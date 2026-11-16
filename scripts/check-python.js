// Führt alle Python-Beispiele aus; braucht Python 3.14 (t-Strings) (PYTHON oder python/python3 im PATH).
// Aufruf: node scripts/check-python.js [Dateifilter] [--run]
//   Dateifilter  nur Dateien, deren Name den Text enthält, z. B. python-oop
//   --run        zusätzlich die Ausgabe jedes Beispiels zeigen (zum Prüfen der Kommentare)
// Jedes Beispiel läuft als eigenes Skript in einem leeren Temp-Ordner, ohne Eingabe, mit Zeitlimit.
// Nicht geprüft werden Einträge mit exampleLang (Shell, TOML) oder nocheck: true.
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFile } = require('child_process');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const runIt = args.includes('--run');
const filter = args.find((a) => !a.startsWith('--')) || 'python-';
const PY = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

const exec = (argv, cwd) => new Promise((resolve) => {
  const child = execFile(PY, argv, { cwd, timeout: 20000, maxBuffer: 1 << 20, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } }, (err, stdout, stderr) => {
    if (err && err.code === 'ENOENT') { console.error(`${PY} nicht gefunden: PYTHON auf den Interpreter setzen.`); process.exit(2); }
    resolve({ ok: !err, out: stdout, err: stderr || (err && err.killed ? 'Zeitlimit überschritten' : '') });
  });
  child.stdin.end();
});

async function main() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script src="(data\/[^"]+)"/g)].map((m) => m[1]).filter((f) => f.includes(filter));
  const ctx = { window: {} };
  vm.createContext(ctx);
  files.forEach((f) => { if (fs.existsSync(path.join(root, f))) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); });
  const all = (ctx.window.CHEAT || []).filter((e) => e.lang === 'py');
  const todo = all.filter((e) => !e.nocheck && (!e.exampleLang || e.exampleLang === 'py'));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cheat-py-'));
  const failed = [];
  const outputs = new Map();
  let next = 0;
  const worker = async () => {
    while (next < todo.length) {
      const e = todo[next++];
      const dir = fs.mkdtempSync(path.join(tmp, 'x'));
      fs.writeFileSync(path.join(dir, 'beispiel.py'), e.example);
      // -I: isoliert (kein Benutzer-site-packages, kein cwd im Pfad), -X utf8: gleiche Kodierung auf allen Systemen
      const r = await exec(['-I', '-X', 'utf8', 'beispiel.py'], dir);
      if (!r.ok) failed.push(`${e.name}\n${r.err.trim().split('\n').slice(-8).join('\n')}`);
      else if (runIt) outputs.set(e, r.out.trim());
    }
  };
  await Promise.all(Array.from({ length: Math.max(2, os.cpus().length - 1) }, worker));
  fs.rmSync(tmp, { recursive: true, force: true });

  if (runIt) todo.forEach((e) => outputs.has(e) && console.log(`--- ${e.name}\n${outputs.get(e)}`));
  console.log(`${todo.length - failed.length}/${todo.length} Python-Beispiele laufen fehlerfrei (${all.length - todo.length} ohne Prüfung).`);
  if (failed.length) {
    console.error(`\n${failed.length} Fehler:\n\n` + failed.join('\n\n'));
    process.exit(1);
  }
}

main();
