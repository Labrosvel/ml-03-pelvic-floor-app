#!/usr/bin/env node
/**
 * Bump the user-facing app version in app.json, package.json, and package-lock.json.
 *
 * Usage:
 *   node scripts/bump-version.mjs patch|minor|major
 *   node scripts/bump-version.mjs set 1.2.3
 *
 * Semver for PelviPilot:
 *   MAJOR — rare breaking / first public store launch decisions
 *   MINOR — new user-facing feature (default for feature PRs)
 *   PATCH — bug fix / small correction
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const appJsonPath = resolve(root, 'app.json');
const packageJsonPath = resolve(root, 'package.json');
const packageLockPath = resolve(root, 'package-lock.json');

const mode = process.argv[2];
const explicit = process.argv[3];

if (!mode || !['patch', 'minor', 'major', 'set'].includes(mode)) {
  console.error('Usage: node scripts/bump-version.mjs patch|minor|major');
  console.error('       node scripts/bump-version.mjs set <x.y.z>');
  process.exit(1);
}

if (mode === 'set' && !explicit) {
  console.error('Usage: node scripts/bump-version.mjs set <x.y.z>');
  process.exit(1);
}

function parseSemver(value) {
  const match = String(value).trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid semver "${value}". Expected x.y.z`);
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function formatSemver({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

function bump(version, kind) {
  const next = { ...version };
  if (kind === 'major') {
    next.major += 1;
    next.minor = 0;
    next.patch = 0;
  } else if (kind === 'minor') {
    next.minor += 1;
    next.patch = 0;
  } else {
    next.patch += 1;
  }
  return next;
}

const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8'));
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const packageLock = JSON.parse(readFileSync(packageLockPath, 'utf8'));

const current = parseSemver(appJson.expo?.version ?? packageJson.version);
const nextVersion =
  mode === 'set' ? formatSemver(parseSemver(explicit)) : formatSemver(bump(current, mode));

appJson.expo.version = nextVersion;
packageJson.version = nextVersion;
packageLock.version = nextVersion;
if (packageLock.packages?.['']) {
  packageLock.packages[''].version = nextVersion;
}

writeFileSync(appJsonPath, `${JSON.stringify(appJson, null, 2)}\n`);
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
writeFileSync(packageLockPath, `${JSON.stringify(packageLock, null, 2)}\n`);

console.log(`Version ${formatSemver(current)} → ${nextVersion}`);
