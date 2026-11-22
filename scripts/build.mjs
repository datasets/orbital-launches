// Build data/*.csv from archive/launchlog.tsv (GCAT Orbital Launch Log, Jonathan McDowell).
// Plain Node, no dependencies. Usage: node scripts/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = readFileSync(join(root, 'archive', 'launchlog.tsv'), 'utf8').replace(/\r/g, '');
const lines = raw.split('\n').filter((l) => l.length > 0);

// Header is the first line, starting with '#'. Other '#' lines are comments.
const header = lines[0].replace(/^#/, '').split('\t').map((h) => h.trim());
const col = (name) => {
  const i = header.indexOf(name);
  if (i < 0) throw new Error(`missing column ${name}`);
  return i;
};
const iTag = col('Launch_Tag');
const iDate = col('Launch_Date');
const iJcat = col('JCAT');
const iLvState = col('LVState');
const iCode = col('Launch_Code');

// English names for GCAT state codes (GCAT orgs table has the official long names).
const STATE_NAMES = {
  US: 'United States',
  SU: 'Soviet Union',
  RU: 'Russia',
  CN: 'China',
  F: 'France',
  J: 'Japan',
  IN: 'India',
  NZ: 'New Zealand',
  IR: 'Iran',
  'I-ESA': 'European Space Agency',
  'I-ELDO': 'European Launcher Development Organisation',
  IL: 'Israel',
  I: 'Italy',
  KR: 'South Korea',
  KP: 'North Korea',
  CYM: 'Cayman Islands',
  UK: 'United Kingdom',
  D: 'Germany',
  BR: 'Brazil',
  AU: 'Australia',
};

// Orbital launch attempt: GCAT launch category O (orbital) or D (deep space),
// with outcome S (success) or F (failure). Excludes pad explosions (E), pad aborts (A),
// near-orbital (N) and launches from other worlds (X). Partial scores like OS75 or OF40
// keep their pass/fail letter (GCAT: a score below 0.75 is a failure).
const launches = new Map(); // tag -> {year, state, outcome}
const payloadsByYear = new Map();

for (const line of lines.slice(1)) {
  if (line.startsWith('#')) continue;
  const f = line.split('\t').map((x) => x.trim());
  const code = f[iCode];
  const m = /^([OD])([SF])/.exec(code);
  if (!m) continue;
  const tag = f[iTag];
  const year = Number(f[iDate].slice(0, 4));
  if (!Number.isInteger(year)) throw new Error(`bad date for ${tag}: ${f[iDate]}`);
  const state = f[iLvState];
  if (!(state in STATE_NAMES)) throw new Error(`unknown state code ${state} (${tag})`);
  const prev = launches.get(tag);
  if (prev) {
    if (prev.state !== state || prev.outcome !== m[2] || prev.year !== year) throw new Error(`inconsistent rows for ${tag}`);
  } else {
    launches.set(tag, { year, state, outcome: m[2] });
  }
  // A payload reached orbit (or beyond) unless it is in GCAT's failed-to-orbit catalog (JCAT prefix F).
  if (!f[iJcat].startsWith('F')) payloadsByYear.set(year, (payloadsByYear.get(year) || 0) + 1);
}

const byYearState = new Map();
const byYear = new Map();
const bump = (map, key) => {
  if (!map.has(key)) map.set(key, { attempts: 0, successes: 0, failures: 0 });
  return map.get(key);
};
for (const { year, state, outcome } of launches.values()) {
  for (const r of [bump(byYearState, `${year}\t${state}`), bump(byYear, year)]) {
    r.attempts++;
    if (outcome === 'S') r.successes++;
    else r.failures++;
  }
}

const years = [...byYear.keys()].sort((a, b) => a - b);
const first = years[0];
const last = years[years.length - 1];

let out = 'year,attempts,successes,failures,payloads_to_orbit\n';
for (let y = first; y <= last; y++) {
  const r = byYear.get(y) || { attempts: 0, successes: 0, failures: 0 };
  out += `${y},${r.attempts},${r.successes},${r.failures},${payloadsByYear.get(y) || 0}\n`;
}
writeFileSync(join(root, 'data', 'orbital-launches-by-year.csv'), out);

const rows = [...byYearState.entries()]
  .map(([k, r]) => {
    const [y, s] = k.split('\t');
    return { year: Number(y), state: s, ...r };
  })
  .sort((a, b) => a.year - b.year || b.attempts - a.attempts || a.state.localeCompare(b.state));
let out2 = 'year,state_code,state_name,attempts,successes,failures\n';
for (const r of rows) {
  const name = STATE_NAMES[r.state];
  out2 += `${r.year},${r.state},${name},${r.attempts},${r.successes},${r.failures}\n`;
}
writeFileSync(join(root, 'data', 'orbital-launches-by-state.csv'), out2);

console.log(`launches: ${launches.size}; years ${first}-${last}; by-state rows: ${rows.length}`);
