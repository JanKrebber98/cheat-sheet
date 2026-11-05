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

for (const f of files) {
  const before = (ctx.window.CHEAT || []).length;
  try {
    vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
  } catch (e) {
    errors.push(`${f}: ${e.message}`);
    continue;
  }
  perFile[f] = (ctx.window.CHEAT || []).length - before;
}

const data = ctx.window.CHEAT || [];
const seen = new Map();
const str = (v) => typeof v === 'string' && v.trim().length > 0;

data.forEach((e, i) => {
  const where = `#${i} ${e && e.name}`;
  if (!e || typeof e !== 'object') return errors.push(`${where}: kein Objekt`);
  if (!['html', 'css', 'js', 'ts', 'java'].includes(e.lang)) errors.push(`${where}: lang muss "html", "css", "js", "ts" oder "java" sein`);
  if (e.run !== undefined && e.run !== true) errors.push(`${where}: run ist entweder true oder fehlt`);
  if (e.run && e.lang !== 'js') errors.push(`${where}: run nur bei lang "js" (TypeScript und Java laufen nicht im Browser)`);
  if (e.run && /^\s*(import|export)\s/m.test(e.example)) errors.push(`${where}: run-Beispiel darf kein import/export enthalten`);
  if (e.run) {
    // Läuft im Browser als Modul; import.meta ist in vm.Script nicht erlaubt, daher ersetzen.
    try { new vm.Script(`(async () => {\n${e.example.replace(/\bimport\.meta\b/g, '({})')}\n})`); } catch (err) { errors.push(`${where}: run-Beispiel hat Syntaxfehler: ${err.message}`); }
  }
  for (const k of ['group', 'name', 'desc', 'details', 'example']) {
    if (!str(e[k])) errors.push(`${where}: Feld "${k}" fehlt`);
  }
  if (e.values !== undefined) {
    if (!Array.isArray(e.values) || !e.values.every((v) => Array.isArray(v) && v.length === 2 && str(v[0]) && str(v[1]))) {
      errors.push(`${where}: values muss [[wert, bedeutung], ...] sein`);
    }
  }
  for (const k of ['keywords', 'related']) {
    if (e[k] !== undefined && !(Array.isArray(e[k]) && e[k].every(str))) errors.push(`${where}: ${k} muss ein String-Array sein`);
  }
  if (e.exampleLang !== undefined && !['html', 'css', 'js', 'ts', 'java'].includes(e.exampleLang)) errors.push(`${where}: exampleLang ungültig`);
  for (const k of ['syntax', 'demo', 'tip', 'mdn', 'initial', 'display', 'exampleLang']) {
    if (e[k] !== undefined && !str(e[k])) errors.push(`${where}: ${k} muss ein nicht-leerer String sein`);
  }
  if (e.mdn && !/^https:\/\/(developer\.mozilla\.org|www\.typescriptlang\.org|docs\.oracle\.com|dev\.java)\//.test(e.mdn)) errors.push(`${where}: mdn muss auf developer.mozilla.org, typescriptlang.org, docs.oracle.com oder dev.java zeigen`);
  if (e.demo && /<script/i.test(e.demo)) errors.push(`${where}: demo darf kein <script> enthalten`);
  const key = `${e.lang}|${String(e.name).toLowerCase()}`;
  if (seen.has(key)) errors.push(`${where}: doppelt (schon bei #${seen.get(key)})`);
  else seen.set(key, i);
});

console.log('Einträge pro Datei:');
for (const [f, n] of Object.entries(perFile)) console.log(`  ${String(n).padStart(4)}  ${f}`);
console.log(`  ${String(data.length).padStart(4)}  gesamt`);

if (errors.length) {
  console.error(`\n${errors.length} Fehler:`);
  errors.slice(0, 100).forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log('\nAlles in Ordnung.');
