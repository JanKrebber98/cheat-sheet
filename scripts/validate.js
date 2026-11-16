// Prüft alle Datendateien: Pflichtfelder, Typen, doppelte Einträge.
// Aufruf: node scripts/validate.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="(data\/[^"]+)"/g)].map((m) => m[1]);

const ctx = { window: {} };
vm.createContext(ctx);
const errors = [];
const perFile = {};
const fileOf = [];

for (const f of files) {
  const before = (ctx.window.CHEAT || []).length;
  try {
    vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
  } catch (e) {
    errors.push(`${f}: ${e.message}`);
    continue;
  }
  perFile[f] = (ctx.window.CHEAT || []).length - before;
  for (let k = before; k < (ctx.window.CHEAT || []).length; k++) fileOf[k] = f;
}

const data = ctx.window.CHEAT || [];
const seen = new Map();
const str = (v) => typeof v === 'string' && v.trim().length > 0;
const DOC = /^https:\/\/(developer\.mozilla\.org|www\.typescriptlang\.org|docs\.oracle\.com|dev\.java|docs\.python\.org|www\.postgresql\.org|(www\.)?sqlite\.org|dev\.mysql\.com|learn\.microsoft\.com)\//;
const DIALECTS = ['std', 'pg', 'mysql', 'mssql', 'sqlite'];
const DIALECT_KEYS = ['syntax', 'example', 'exampleLang', 'note', 'mdn', 'nocheck'];

// dialects: { std, pg, mysql, mssql, sqlite } – je Dialekt ein Objekt mit eigenem Inhalt, { none: 'Alternative …' }
// wenn es das im Dialekt nicht gibt, oder weggelassen = wie Standard. Ohne dialects nur für Beispiele
// in einer anderen Sprache (z. B. SQL aus Python).
function checkDialects(e, where) {
  if (e.nocheck !== undefined) errors.push(`${where}: nocheck bei SQL je Dialekt angeben (dialects.<d>.nocheck)`);
  const ds = e.dialects;
  if (ds === undefined) {
    if (!e.exampleLang || e.exampleLang === 'sql') errors.push(`${where}: SQL-Eintrag braucht dialects (nur Beispiele in anderen Sprachen kommen ohne aus)`);
    return;
  }
  for (const k of ['syntax', 'example', 'exampleLang']) if (e[k] !== undefined) errors.push(`${where}: ${k} gehört bei SQL in dialects.<d>`);
  if (!ds || typeof ds !== 'object' || Array.isArray(ds)) return errors.push(`${where}: dialects muss ein Objekt sein`);
  for (const d of Object.keys(ds)) if (!DIALECTS.includes(d)) errors.push(`${where}: unbekannter Dialekt "${d}" (erlaubt: ${DIALECTS.join(', ')})`);
  if (!ds.std) errors.push(`${where}: dialects.std fehlt (bei Bedarf { none: '…' })`);
  const stdEx = ds.std && !ds.std.none && str(ds.std.example);
  let any = false;
  for (const d of DIALECTS) {
    const v = ds[d];
    const w = `${where} [${d}]`;
    if (v === undefined) {
      if (!stdEx) errors.push(`${w}: fehlt, erbt aber nichts, weil Standard kein Beispiel hat`);
      else any = true;
      continue;
    }
    if (!v || typeof v !== 'object' || Array.isArray(v)) { errors.push(`${w}: muss ein Objekt sein`); continue; }
    if (v.none !== undefined) {
      if (!str(v.none)) errors.push(`${w}: none braucht einen Text (z. B. die Alternative)`);
      const extra = Object.keys(v).filter((k) => k !== 'none' && k !== 'mdn');
      if (extra.length) errors.push(`${w}: none verträgt sich nicht mit ${extra.join(', ')}`);
      continue;
    }
    for (const k of Object.keys(v)) if (!DIALECT_KEYS.includes(k)) errors.push(`${w}: unbekanntes Feld "${k}"`);
    for (const k of ['syntax', 'example', 'exampleLang', 'note', 'mdn']) if (v[k] !== undefined && !str(v[k])) errors.push(`${w}: ${k} muss ein nicht-leerer String sein`);
    if (v.nocheck !== undefined && v.nocheck !== true) errors.push(`${w}: nocheck ist entweder true oder fehlt`);
    if (v.mdn && !DOC.test(v.mdn)) errors.push(`${w}: mdn zeigt auf keine erlaubte Doku-Seite`);
    if (v.exampleLang && !['sh', 'py', 'java', 'js', 'ts', 'toml'].includes(v.exampleLang)) errors.push(`${w}: exampleLang ungültig`);
    if (v.syntax && !v.example) errors.push(`${w}: eigene Syntax ohne eigenes Beispiel – entweder beides oder nur note`);
    if (!str(v.example) && !stdEx) errors.push(`${w}: kein Beispiel und nichts zu erben`);
    if (d === 'std' && !str(v.example)) errors.push(`${w}: Standard braucht ein Beispiel oder none`);
    any = true;
  }
  if (!any) errors.push(`${where}: kein Dialekt hat ein Beispiel`);
}

data.forEach((e, i) => {
  const where = `${(fileOf[i] || '').replace('data/', '')} #${i} ${e && e.name}`;
  if (!e || typeof e !== 'object') return errors.push(`${where}: kein Objekt`);
  if (!['html', 'css', 'js', 'ts', 'java', 'py', 'sql'].includes(e.lang)) errors.push(`${where}: lang muss "html", "css", "js", "ts", "java", "py" oder "sql" sein`);
  if (e.run !== undefined && e.run !== true) errors.push(`${where}: run ist entweder true oder fehlt`);
  if (e.run && e.lang !== 'js') errors.push(`${where}: run nur bei lang "js" (TypeScript, Java, Python und SQL laufen nicht im Browser)`);
  if (e.run && /^\s*(import|export)\s/m.test(e.example)) errors.push(`${where}: run-Beispiel darf kein import/export enthalten`);
  if (e.run) {
    // Läuft im Browser als Modul; import.meta ist in vm.Script nicht erlaubt, daher ersetzen.
    try { new vm.Script(`(async () => {\n${e.example.replace(/\bimport\.meta\b/g, '({})')}\n})`); } catch (err) { errors.push(`${where}: run-Beispiel hat Syntaxfehler: ${err.message}`); }
  }
  // SQL-Einträge mit Dialekt-Tabs tragen Syntax und Beispiel je Dialekt statt oben.
  const required = e.lang === 'sql' && e.dialects !== undefined ? ['group', 'name', 'desc', 'details'] : ['group', 'name', 'desc', 'details', 'example'];
  for (const k of required) {
    if (!str(e[k])) errors.push(`${where}: Feld "${k}" fehlt`);
  }
  if (e.lang === 'sql') checkDialects(e, where);
  else if (e.dialects !== undefined) errors.push(`${where}: dialects nur bei lang "sql"`);
  if (e.values !== undefined) {
    if (!Array.isArray(e.values) || !e.values.every((v) => Array.isArray(v) && v.length === 2 && str(v[0]) && str(v[1]))) {
      errors.push(`${where}: values muss [[wert, bedeutung], ...] sein`);
    }
  }
  for (const k of ['keywords', 'related']) {
    if (e[k] !== undefined && !(Array.isArray(e[k]) && e[k].every(str))) errors.push(`${where}: ${k} muss ein String-Array sein`);
  }
  if (e.exampleLang !== undefined && !['html', 'css', 'js', 'ts', 'java', 'py', 'sql', 'sh', 'toml'].includes(e.exampleLang)) errors.push(`${where}: exampleLang ungültig`);
  for (const k of ['syntax', 'demo', 'tip', 'mdn', 'initial', 'display', 'exampleLang']) {
    if (e[k] !== undefined && !str(e[k])) errors.push(`${where}: ${k} muss ein nicht-leerer String sein`);
  }
  if (e.mdn && !/^https:\/\/(developer\.mozilla\.org|www\.typescriptlang\.org|docs\.oracle\.com|dev\.java|docs\.python\.org|www\.postgresql\.org|(www\.)?sqlite\.org|dev\.mysql\.com|learn\.microsoft\.com)\//.test(e.mdn)) errors.push(`${where}: mdn muss auf eine erlaubte Doku-Seite zeigen (MDN, typescriptlang.org, Oracle/dev.java, docs.python.org, postgresql.org, sqlite.org, dev.mysql.com, learn.microsoft.com)`);
  if (e.nocheck !== undefined && !(e.nocheck === true && ['java', 'py'].includes(e.lang)) && e.lang !== 'sql') errors.push(`${where}: nocheck nur als true bei java oder py`);
  if (e.demo && /<script/i.test(e.demo)) errors.push(`${where}: demo darf kein <script> enthalten`);
  const key = `${e.lang}|${String(e.name).toLowerCase()}`;
  if (seen.has(key)) errors.push(`${where}: doppelt (schon bei #${seen.get(key)})`);
  else seen.set(key, i);
});

console.log('Einträge pro Datei:');
for (const [f, n] of Object.entries(perFile)) console.log(`  ${String(n).padStart(4)}  ${f}`);
console.log(`  ${String(data.length).padStart(4)}  gesamt`);

// Optional: node scripts/validate.js <Dateifilter> zeigt nur Fehler aus passenden Dateien.
const only = process.argv[2];
const shown = only ? errors.filter((e) => e.startsWith(only)) : errors;
if (only && errors.length && !shown.length) console.log(`\nKeine Fehler in „${only}“ (${errors.length} in anderen Dateien).`);
if (shown.length) {
  console.error(`\n${shown.length} Fehler${only ? ` in „${only}“` : ''}:`);
  shown.slice(0, 200).forEach((e) => console.error('  - ' + e));
}
if (errors.length) process.exit(1);
console.log('\nAlles in Ordnung.');
