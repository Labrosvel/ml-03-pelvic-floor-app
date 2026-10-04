#!/usr/bin/env node
/**
 * CI helper: when product code changes in a PR, require app.json version to increase.
 *
 * Env:
 *   BASE_REF — git ref to compare against (default: origin/main)
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const baseRef = process.env.BASE_REF || 'origin/main';

const PRODUCT_PATH_PREFIXES = [
  'app/',
  'components/',
  'constants/',
  'context/',
  'i18n/',
  'lib/',
  'assets/',
];

const PRODUCT_FILES = new Set(['app.json', 'app.config.js']);

function git(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}

function parseSemver(value) {
  const match = String(value ?? '').trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function isGreater(a, b) {
  if (a.major !== b.major) return a.major > b.major;
  if (a.minor !== b.minor) return a.minor > b.minor;
  return a.patch > b.patch;
}

function isProductPath(path) {
  if (PRODUCT_FILES.has(path)) return true;
  return PRODUCT_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function readVersionFromGit(ref) {
  try {
    const raw = git(['show', `${ref}:app.json`]);
    const json = JSON.parse(raw);
    return parseSemver(json.expo?.version);
  } catch {
    return null;
  }
}

const changed = git(['diff', '--name-only', `${baseRef}...HEAD`])
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const productChanges = changed.filter(isProductPath);
if (productChanges.length === 0) {
  console.log('No product-code changes — version bump not required.');
  process.exit(0);
}

const baseVersion = readVersionFromGit(baseRef);
const headAppJson = JSON.parse(readFileSync(resolve(root, 'app.json'), 'utf8'));
const headVersion = parseSemver(headAppJson.expo?.version);

if (!baseVersion) {
  console.error(`Could not read version from ${baseRef}:app.json`);
  process.exit(1);
}
if (!headVersion) {
  console.error('app.json is missing a valid expo.version (expected x.y.z)');
  process.exit(1);
}

if (!isGreater(headVersion, baseVersion)) {
  console.error('Product code changed, but app version was not increased.');
  console.error(`  ${baseRef}: ${baseVersion.major}.${baseVersion.minor}.${baseVersion.patch}`);
  console.error(`  HEAD:      ${headVersion.major}.${headVersion.minor}.${headVersion.patch}`);
  console.error('');
  console.error('Bump with one of:');
  console.error('  npm run version:minor   # new feature (default for feature PRs)');
  console.error('  npm run version:patch   # bug fix');
  console.error('  npm run version:major   # rare breaking change');
  console.error('');
  console.error('Changed product paths:');
  for (const path of productChanges) console.error(`  - ${path}`);
  process.exit(1);
}

console.log(
  `Version bump ok: ${baseVersion.major}.${baseVersion.minor}.${baseVersion.patch} → ${headVersion.major}.${headVersion.minor}.${headVersion.patch}`,
);
