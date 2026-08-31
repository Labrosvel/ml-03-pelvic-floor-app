#!/usr/bin/env node
/**
 * Cross-platform dev-client launcher for PelviPilot.
 *
 * - LAN mode (default): explicit --lan so the QR code uses your machine's IP.
 * - Tunnel mode (--tunnel): Expo's account-based ws-tunnel (EXPO_UNSTABLE_TUNNEL_V2).
 *   Legacy bundled ngrok often fails in 2026; this path requires `npx expo login`.
 * - USB mode (--usb): localhost + adb reverse hint for Android over USB.
 */
import { spawn, spawnSync } from 'node:child_process';
import net from 'node:net';

const userArgs = process.argv.slice(2);
const tunnel = userArgs.includes('--tunnel');
const usb = userArgs.includes('--usb');
const passthrough = userArgs.filter((arg) => arg !== '--tunnel' && arg !== '--usb');

const METRO_PORT = 8081;

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

function findPidsOnPort(port) {
  if (process.platform === 'win32') {
    const result = spawnSync(
      'netstat',
      ['-ano'],
      { encoding: 'utf8', shell: true },
    );
    const pids = new Set();
    for (const line of result.stdout.split('\n')) {
      if (!line.includes(`:${port}`) || !line.includes('LISTENING')) continue;
      const pid = line.trim().split(/\s+/).pop();
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    return [...pids];
  }

  const result = spawnSync('lsof', ['-ti', `:${port}`], { encoding: 'utf8' });
  if (result.status !== 0 || !result.stdout.trim()) return [];
  return result.stdout.trim().split('\n').filter(Boolean);
}

function killPids(pids) {
  for (const pid of pids) {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/F', '/PID', pid], { stdio: 'ignore', shell: true });
    } else {
      spawnSync('kill', ['-9', pid], { stdio: 'ignore' });
    }
  }
}

async function ensurePort8081() {
  if (await isPortFree(METRO_PORT)) return;

  const pids = findPidsOnPort(METRO_PORT);
  if (pids.length === 0) {
    console.error(
      `\nPort ${METRO_PORT} is in use but could not identify the process.` +
        `\nStop the other Metro/Expo window, then run this command again.\n`,
    );
    process.exit(1);
  }

  console.warn(`Port ${METRO_PORT} is in use (PID ${pids.join(', ')}). Stopping stale Metro…`);
  killPids(pids);
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!(await isPortFree(METRO_PORT))) {
    console.error(`Port ${METRO_PORT} is still in use. Close the other process manually.\n`);
    process.exit(1);
  }
}

async function ensureExpoLogin() {
  const result = spawnSync('npx', ['expo', 'whoami'], {
    encoding: 'utf8',
    shell: true,
  });
  const identity = result.stdout?.trim();
  if (result.status === 0 && identity) {
    console.log(`Expo account: ${identity}\n`);
    return;
  }

  console.error(
    'Tunnel mode needs an Expo login (Expo SDK 57 ws-tunnel).\n' +
      '  npx expo login\n' +
      'Then run:\n' +
      '  npm run start:dev-client:tunnel\n\n' +
      'Alternatives without login:\n' +
      '  npm run start:dev-client:usb   (Android + USB)\n' +
      '  npm run start:dev-client       (same Wi‑Fi LAN)\n',
  );
  process.exit(1);
}

async function main() {
  console.log('PelviPilot Metro launcher\n');

  const hasCustomPort = passthrough.some((arg, index) => {
    if (arg === '--port') return passthrough[index + 1] != null;
    return arg.startsWith('--port=');
  });

  if (tunnel) {
    console.log('Mode: tunnel (Expo account ws-tunnel, not legacy ngrok)\n');
    await ensureExpoLogin();
    await ensurePort8081();
  } else if (usb) {
    console.log(
      'Mode: USB localhost — with the phone connected, run in another terminal:\n' +
        '  adb reverse tcp:8081 tcp:8081\n',
    );
  } else {
    console.log('Mode: LAN (phone and laptop must be on the same Wi‑Fi)\n');
    if (!hasCustomPort && !(await isPortFree(METRO_PORT))) {
      console.warn(
        `Port ${METRO_PORT} is busy — Metro will use port 8082. ` +
          `For tunnel mode, free port ${METRO_PORT} first.\n`,
      );
    }
  }

  const env = { ...process.env };
  const args = ['expo', 'start', '--dev-client'];

  if (tunnel) {
    env.EXPO_UNSTABLE_TUNNEL_V2 = '1';
    args.push('--tunnel');
  } else if (usb) {
    args.push('--localhost');
  } else {
    args.push('--lan');
  }

  args.push(...passthrough);

  const child = spawn('npx', args, {
    stdio: 'inherit',
    env,
    shell: true,
  });

  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
