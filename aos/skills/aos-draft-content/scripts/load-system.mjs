#!/usr/bin/env node
// load-system.mjs — validate that a client's content-system meets the contract.
//
// Usage:
//   node load-system.mjs <client-slug> <type> [<bu-slug>]
//
// <type> is one of: reference, blog, linkbait
// <bu-slug> optional — if provided, validates content-system/<bu-slug>/ instead of
//   content-system/. Required when the client uses per-BU content-systems.
//
// Exit codes:
//   0 — content-system passes validation for the requested type
//   1 — invalid input (bad slug, bad type)
//   2 — client tree not found
//   3 — content-system directory missing
//   4 — required file missing or fails substance check
//   5 — client uses per-BU layout but no --bu was provided

import { existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HUB_ROOT = resolve(__dirname, '..', '..', '..', '..');

const [, , clientSlug, type, buSlugRaw] = process.argv;
let buSlug = buSlugRaw || '';

if (!clientSlug || !type) {
  console.error('Usage: node load-system.mjs <client-slug> <reference|blog|linkbait> [<bu-slug>]');
  process.exit(1);
}

if (!['reference', 'blog', 'linkbait'].includes(type)) {
  console.error(`ERROR: type must be one of: reference, blog, linkbait (got: ${type})`);
  process.exit(1);
}

// Resolve client dir
let clientDir = resolve(HUB_ROOT, 'clients-cloud', clientSlug);
if (!existsSync(clientDir)) {
  clientDir = resolve(HUB_ROOT, 'clients', clientSlug);
  if (!existsSync(clientDir)) {
    console.error(`ERROR: Client '${clientSlug}' not found in clients-cloud/ or clients/`);
    process.exit(2);
  }
}

const csRoot = resolve(clientDir, 'content-system');
if (!existsSync(csRoot)) {
  console.error(`ERROR: ${csRoot} does not exist.`);
  console.error('Create it (copy templates or fill manually).');
  process.exit(3);
}

// Detect per-BU layout: any subdirectory under content-system/ that contains messaging.md
function findBuFolders(root) {
  return readdirSync(root, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(name => existsSync(resolve(root, name, 'messaging.md')));
}

const buFolders = findBuFolders(csRoot);
const hasBuLayout = buFolders.length > 0;

// --bu supplied to single-BU client: warn and ignore
if (buSlug && !hasBuLayout) {
  console.error(`WARNING: --bu=${buSlug} was supplied but ${clientSlug} uses single-BU layout (no subfolders under content-system/).`);
  console.error(`Ignoring --bu and using ${csRoot} directly.`);
  buSlug = '';
}

// Multi-BU client without --bu: refuse
if (hasBuLayout && !buSlug) {
  console.error(`ERROR: ${clientSlug} uses a per-BU content-system layout.`);
  console.error('Available BUs:');
  for (const bu of buFolders) console.error(`  - ${bu}`);
  console.error(`Re-run with a BU slug: node load-system.mjs ${clientSlug} ${type} <bu-slug>`);
  process.exit(5);
}

const csDir = buSlug ? resolve(csRoot, buSlug) : csRoot;
if (buSlug && !existsSync(csDir)) {
  console.error(`ERROR: BU folder ${csDir} does not exist.`);
  process.exit(3);
}

function checkSubstance(path, minBytes, label, required) {
  if (!existsSync(path)) {
    if (required) {
      console.error(`ERROR: ${path} missing — ${label}.`);
      process.exit(4);
    }
    return { ok: false, bytes: 0 };
  }
  const bytes = statSync(path).size;
  if (bytes < minBytes) {
    if (required) {
      console.error(`ERROR: ${path} is a stub (${bytes} bytes, need ≥${minBytes}). ${label}`);
      process.exit(4);
    }
    return { ok: false, bytes };
  }
  return { ok: true, bytes };
}

// Required: messaging.md (always)
const messaging = checkSubstance(
  resolve(csDir, 'messaging.md'), 300, 'Fill in at least one messaging pole.', true
);

// Required for reference type: products.md
let products = null;
if (type === 'reference') {
  products = checkSubstance(
    resolve(csDir, 'products.md'), 300, 'Fill in the product catalog.', true
  );
}

// Recommended: pillars.md, distribution.md
const pillars = checkSubstance(resolve(csDir, 'pillars.md'), 300, '', false);
const distribution = checkSubstance(resolve(csDir, 'distribution.md'), 300, '', false);

// Required brand inputs
const brandDir = resolve(clientDir, 'brand');
const voice = checkSubstance(
  resolve(brandDir, 'VOICE.md'), 1500, 'Brand intelligence incomplete.', false
);
const icp = checkSubstance(
  resolve(brandDir, 'ICP.md'), 1500, 'Brand intelligence incomplete.', false
);

if (!voice.ok || !icp.ok) {
  console.error(`ERROR: Brand intelligence incomplete for ${clientSlug}.`);
  console.error(`  brand/VOICE.md: ${voice.bytes} bytes (need ≥1500)`);
  console.error(`  brand/ICP.md:   ${icp.bytes} bytes (need ≥1500)`);
  console.error('Run /build-brand-system first.');
  process.exit(4);
}

// All checks passed
const head = buSlug
  ? `✓ Content-system valid for ${clientSlug} / bu=${buSlug} / type=${type}`
  : `✓ Content-system valid for ${clientSlug} / type=${type}`;
console.log(head);
console.log(`  messaging.md       — ${messaging.bytes} bytes`);
if (products) console.log(`  products.md        — ${products.bytes} bytes`);
console.log(`  brand/VOICE.md     — ${voice.bytes} bytes`);
console.log(`  brand/ICP.md       — ${icp.bytes} bytes`);
console.log(`  pillars.md         — ${pillars.ok ? 'OK' : 'MISSING (recommended)'}`);
console.log(`  distribution.md    — ${distribution.ok ? 'OK' : 'MISSING (recommended)'}`);

process.exit(0);
