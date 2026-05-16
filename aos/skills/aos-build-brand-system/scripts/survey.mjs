#!/usr/bin/env node
// survey.mjs — survey the brand intelligence profile state of the granted folder.
//
// OPTIONAL ACCELERATOR. The contract is bash + filesystem: the same survey can
// be done by hand with `ls -l brand/` + a heading count. This script just does
// it in one call. Node is never required for a core function (per the AOS DAL
// contract and docs/data-access-router.md).
//
// The granted folder IS one client's folder — no per-client nesting, no slug.
// The granted-folder root is the working directory (process.cwd()).
//
// Usage (run from the granted-folder root):
//   node <skill>/scripts/survey.mjs            # human-readable survey
//   node <skill>/scripts/survey.mjs --json     # machine-readable
//   node <skill>/scripts/survey.mjs --prep     # survey + source-doc inventory
//                                                + harvest-richness preview
//
// Exit codes:
//   0  — survey completed (regardless of completeness)
//   2  — granted folder is not a valid AOS data folder (no brand/ zone)

import { readFileSync, statSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , ...rest] = process.argv;
const jsonOutput = rest.includes('--json');
const prepMode = rest.includes('--prep');

// The granted folder is the working directory — it IS the client folder.
const GRANTED_ROOT = process.cwd();

const brandDir = resolve(GRANTED_ROOT, 'brand');
if (!existsSync(brandDir)) {
  console.error(`ERROR: ${brandDir} does not exist.`);
  console.error('Run this from the granted-folder root. If the brand/ zone is');
  console.error('missing, the folder has not been onboarded — run aos-onboard.');
  process.exit(2);
}

// The 8 standard files of the Client Intelligence Profile.
// minBytes per reference/file-substance-criteria.md
// websitePref: REQUIRED | STRONGLY_PREFERRED | OPTIONAL — per the same criteria doc
// dependsOn: which other files must be FILLED before this one is drafted
const files = [
  { name: '7LAYER_DIAGNOSTIC.md', minBytes: 2500, websitePref: 'OPTIONAL', dependsOn: [] },
  { name: 'CONSTRAINT_MAP.md', minBytes: 1500, websitePref: 'OPTIONAL', dependsOn: ['7LAYER_DIAGNOSTIC.md'] },
  { name: 'REPAIR_ROADMAP.md', minBytes: 1500, websitePref: 'OPTIONAL', dependsOn: ['CONSTRAINT_MAP.md'] },
  { name: 'BELIEF_PROFILE.md', minBytes: 3000, websitePref: 'OPTIONAL', dependsOn: [] },
  { name: 'ICP.md', minBytes: 2000, websitePref: 'STRONGLY_PREFERRED', dependsOn: [] },
  { name: 'POSITIONING.md', minBytes: 1500, websitePref: 'STRONGLY_PREFERRED', dependsOn: ['ICP.md', '7LAYER_DIAGNOSTIC.md'] },
  { name: 'VOICE.md', minBytes: 2000, websitePref: 'REQUIRED', dependsOn: ['BELIEF_PROFILE.md', 'ICP.md'] },
  { name: 'COMPETITIVE_LANDSCAPE.md', minBytes: 1500, websitePref: 'REQUIRED', dependsOn: ['POSITIONING.md'] },
];

const STUB_CEILING = 500;
const MIN_HEADINGS = 3;

function classify(path, minBytes) {
  if (!existsSync(path)) return { status: 'MISSING', bytes: 0, headings: 0 };
  const stat = statSync(path);
  const bytes = stat.size;
  const content = readFileSync(path, 'utf8');
  const headings = (content.match(/^#{2,3} /gm) || []).length;
  let status;
  if (bytes < STUB_CEILING) status = 'STUB';
  else if (bytes >= minBytes && headings >= MIN_HEADINGS) status = 'FILLED';
  else status = 'PARTIAL';
  return { status, bytes, headings };
}

const rows = files.map(({ name, minBytes, websitePref, dependsOn }) => {
  const path = resolve(brandDir, name);
  const { status, bytes, headings } = classify(path, minBytes);
  return { file: name, bytes, headings, minBytes, status, websitePref, dependsOn };
});

const filled = rows.filter(r => r.status === 'FILLED').length;
const total = rows.length;
const pct = Math.round((filled / total) * 100);
const gatePassed = filled === total;

if (jsonOutput) {
  console.log(JSON.stringify({
    granted_root: GRANTED_ROOT,
    brand_dir: brandDir,
    files: rows.map(r => ({
      file: r.file, bytes: r.bytes, headings: r.headings,
      min_bytes: r.minBytes, status: r.status,
    })),
    filled, total, completeness_pct: pct, gate_passed: gatePassed,
  }, null, 2));
} else {
  console.log('');
  console.log('Brand intelligence profile');
  console.log('────────────────────────────────────────────────────');
  console.log('File                          Bytes    H#   Status');
  console.log('────────────────────────────────────────────────────');
  for (const r of rows) {
    console.log(
      `${r.file.padEnd(26)} ${String(r.bytes).padStart(8)} ${String(r.headings).padStart(5)} ${r.status.padStart(8)}`
    );
  }
  console.log('────────────────────────────────────────────────────');
  console.log(`Completeness: ${filled}/${total} (${pct}%)`);
  if (gatePassed) {
    console.log('Gate: PASSED — /build-content-system unblocked.');
  } else {
    console.log(`Gate: BLOCKED — needs ${total - filled} more file(s) filled to unblock /build-content-system.`);
  }
  console.log('');
}

// ──────────────────────────────────────────────────────────────────────
// --prep mode: source-document inventory + harvest-richness preview
// ──────────────────────────────────────────────────────────────────────

if (prepMode) {
  console.log('\nHarvest preparation');
  console.log('━'.repeat(72));

  // 1. Inventory candidate source documents — the inbox/ zone and its typed subfolders.
  const inboxDir = resolve(GRANTED_ROOT, 'inbox');
  const candidateDirs = [
    inboxDir,
    resolve(inboxDir, 'strategy'),
    resolve(inboxDir, 'transcripts'),
    resolve(inboxDir, 'correspondence'),
    resolve(inboxDir, 'research'),
    resolve(inboxDir, 'brand-material'),
  ].filter(d => existsSync(d));

  const candidates = [];
  for (const dir of candidateDirs) {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const ent of entries) {
      if (!ent.isFile() || !ent.name.endsWith('.md')) continue;
      const fp = resolve(dir, ent.name);
      const bytes = statSync(fp).size;
      if (bytes < 2000) continue; // <2KB unlikely to carry substance
      candidates.push({ path: fp.replace(GRANTED_ROOT + '/', ''), bytes });
    }
  }
  candidates.sort((a, b) => b.bytes - a.bytes);

  console.log(`\n${candidates.length} candidate source documents (>2KB) found across ${candidateDirs.length} directories.`);
  console.log('Top 10 by size:');
  for (const c of candidates.slice(0, 10)) {
    console.log(`  ${String(c.bytes).padStart(7)}  ${c.path}`);
  }

  // 2. Harvest-richness scoring per file
  // Score heuristics (per SKILL.md Step 1.5):
  //   +3 if 3+ candidate sources (rough proxy: total candidate count ≥ 6)
  //   +1 if 1-2 candidates (total < 6 but ≥ 2)
  //   +2 if all dependsOn FILLED
  //   -3 if websitePref=REQUIRED and no website cache exists
  //   +2 if pre-existing user-written reference (heuristic: file matching bucket-keyword)
  // The orchestrator AI refines these scores with content awareness — this script gives the baseline.

  // Website cache lives in the .aos/ runtime zone.
  const websiteCacheDir = resolve(GRANTED_ROOT, '.aos', 'cache', 'website-harvest');
  const websiteCached = existsSync(websiteCacheDir);

  // Build status lookup for dependency resolution
  const statusByFile = Object.fromEntries(rows.map(r => [r.file, r.status]));

  const needingFiles = rows.filter(r => r.status !== 'FILLED');
  if (needingFiles.length === 0) {
    console.log('\nAll 8 files FILLED — nothing to draft. Profile complete.');
    console.log('');
    process.exit(0);
  }

  console.log('\nHarvest-richness scoring (orchestrator refines with content awareness):');
  console.log('');
  console.log('File                       Deps  Website   Score   Confidence');
  console.log('─'.repeat(72));

  for (const r of rows) {
    if (r.status === 'FILLED') continue; // skip files we're not drafting

    let score = 0;
    // Source-document density (rough — orchestrator refines per-bucket)
    if (candidates.length >= 10) score += 3;
    else if (candidates.length >= 4) score += 2;
    else if (candidates.length >= 2) score += 1;

    // Dependency state
    const depsOk = r.dependsOn.every(d => statusByFile[d] === 'FILLED');
    if (r.dependsOn.length === 0 || depsOk) score += 2;

    // Website-required penalty
    if (r.websitePref === 'REQUIRED' && !websiteCached) score -= 3;

    const depsCell = r.dependsOn.length === 0 ? '—' : (depsOk ? '✓' : '✗');
    const webCell = r.websitePref === 'REQUIRED' ? (websiteCached ? 'REQ✓' : 'REQ✗')
                  : r.websitePref === 'STRONGLY_PREFERRED' ? 'pref'
                  : 'opt';
    const conf = score >= 4 ? 'HIGH' : score >= 2 ? 'MEDIUM' : 'LOW';
    const fileShort = r.file.replace('.md', '').padEnd(24);

    console.log(`${fileShort}  ${depsCell.padEnd(4)}  ${webCell.padEnd(8)} ${String(score).padStart(4)}    ${conf}`);
  }

  console.log('');
  console.log('Mode recommendation:');
  console.log('  - HIGH confidence files → batch-mode candidates');
  console.log('  - MEDIUM → stepwise recommended');
  console.log('  - LOW → run sub-skill first OR scrape website OR explicit waiver');
  console.log('');
  console.log('Pass --mode=auto|stepwise|batch and --skip-website to the orchestrator to lock the mode.');
  console.log('');
}

process.exit(0);
