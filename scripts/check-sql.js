// Führt alle SQL-Beispiele in echten Datenbanken aus und vergleicht die Ergebniskommentare.
// Aufruf: node scripts/check-sql.js [Dateifilter] [--dialect=pg,mysql] [--run]
//   Dateifilter  nur Dateien, deren Name den Text enthält, z. B. sql-queries
//   --dialect    nur diese Dialekte: std, pg, mysql, mssql, sqlite (Standard: alle)
//   --run        zusätzlich die Ergebnisse jedes Beispiels zeigen
//   --stop       danach die Docker-Container stoppen
//
// Voraussetzungen:
//   - Python mit den Treibern aus requirements-sql.txt, am einfachsten in einer venv im Projekt:
//       python -m venv .venv-sql  &&  .venv-sql/Scripts/pip install -r requirements-sql.txt
//     Die .venv-sql wird automatisch benutzt; sonst SQL_PYTHON setzen oder global installieren.
//   - Docker für PostgreSQL, MySQL und SQL Server. Die Container werden bei Bedarf gestartet:
//       cheat-sql-pg     postgres:18                                   Port 55432
//       cheat-sql-mysql  mysql:8.4                                     Port 53306
//       cheat-sql-mssql  mcr.microsoft.com/mssql/server:2022-latest    Port 51433
//     Der SQL-Server-Container startet mit ACCEPT_EULA=Y (Developer Edition, Microsofts Lizenzbedingungen).
//   SQLite braucht nur Python. Ohne Docker: --dialect=sqlite
//
// Der Tab „Standard“ wird in PostgreSQL ausgeführt. Ein Dialekt ohne eigenes Beispiel erbt das
// Standard-Beispiel – das muss dann auch dort laufen und dieselben Ergebnisse liefern.
// Nicht geprüft: Dialekte mit none, nocheck: true oder einem exampleLang (Shell, Python, …).
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFile } = require('child_process');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const runIt = args.includes('--run');
const stopAfter = args.includes('--stop');
const filter = args.find((a) => !a.startsWith('--')) || 'sql-';
const DIALECTS = ['std', 'pg', 'mysql', 'mssql', 'sqlite'];
const NAME = { std: 'Standard', pg: 'PostgreSQL', mysql: 'MySQL', mssql: 'SQL Server', sqlite: 'SQLite' };
const ENGINE = { std: 'pg', pg: 'pg', mysql: 'mysql', mssql: 'mssql', sqlite: 'sqlite' };
const dArg = (args.find((a) => a.startsWith('--dialect=')) || '').slice(10);
const wanted = dArg ? dArg.split(',').map((s) => s.trim()) : DIALECTS;
const bad = wanted.filter((d) => !DIALECTS.includes(d));
if (bad.length) { console.error(`Unbekannter Dialekt: ${bad.join(', ')} (erlaubt: ${DIALECTS.join(', ')})`); process.exit(2); }
// Interpreter: SQL_PYTHON, sonst eine .venv-sql im Projekt (requirements-sql.txt), sonst PYTHON bzw. python/python3.
const venvPy = path.join(root, '.venv-sql', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const PY = process.env.SQL_PYTHON || (fs.existsSync(venvPy) ? venvPy : process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3'));

const PW = 'Cheat_Sheet1!';
const CONTAINERS = {
  pg: { name: 'cheat-sql-pg', run: ['-e', `POSTGRES_PASSWORD=${PW}`, '-p', '127.0.0.1:55432:5432', 'postgres:18'] },
  mysql: { name: 'cheat-sql-mysql', run: ['-e', `MYSQL_ROOT_PASSWORD=${PW}`, '-p', '127.0.0.1:53306:3306', 'mysql:8.4'] },
  mssql: { name: 'cheat-sql-mssql', run: ['-e', 'ACCEPT_EULA=Y', '-e', `MSSQL_SA_PASSWORD=${PW}`, '-p', '127.0.0.1:51433:1433', 'mcr.microsoft.com/mssql/server:2022-latest'] }
};

const exec = (cmd, argv, opts = {}) => new Promise((resolve) => {
  execFile(cmd, argv, { maxBuffer: 64 << 20, ...opts }, (err, stdout, stderr) => {
    if (err && err.code === 'ENOENT') { console.error(`${cmd} nicht gefunden.`); process.exit(2); }
    resolve({ ok: !err, out: stdout, err: stderr });
  });
});

async function ensureContainer(engine) {
  const c = CONTAINERS[engine];
  const st = await exec('docker', ['inspect', '-f', '{{.State.Running}}', c.name]);
  if (st.ok && st.out.trim() === 'true') return;
  const r = st.ok ? await exec('docker', ['start', c.name]) : await exec('docker', ['run', '-d', '--name', c.name, ...c.run]);
  if (!r.ok) { console.error(`Container ${c.name} lässt sich nicht starten (läuft Docker?):\n${r.err.trim()}\nOhne Docker: --dialect=sqlite`); process.exit(2); }
}

// Das Beispiel eines Dialekts: eigenes oder (ohne eigenes) das Standard-Beispiel.
function variant(e, d) {
  const ds = e.dialects;
  if (!ds) return null;
  const v = ds[d];
  if (v && v.none) return null;
  const std = ds.std && !ds.std.none ? ds.std : null;
  const own = !!(v && v.example);
  const base = own ? v : std;
  if (!base || !base.example) return null;
  const nocheck = v && v.nocheck !== undefined ? v.nocheck : (!own && std && std.nocheck) || false;
  return { example: base.example, lang: base.exampleLang, nocheck, inherited: !own && d !== 'std' };
}

async function main() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const fArg = (args.find((a) => a.startsWith('--file=')) || '').slice(7);  // einzelne Datei, z. B. zum Testen
  const files = fArg ? [path.relative(root, path.resolve(fArg))]
    : [...html.matchAll(/<script src="(data\/[^"]+)"/g)].map((m) => m[1]).filter((f) => f.includes(filter));
  const ctx = { window: {} };
  vm.createContext(ctx);
  files.forEach((f) => { if (fs.existsSync(path.join(root, f))) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); });
  const entries = (ctx.window.CHEAT || []).filter((e) => e.lang === 'sql');

  const jobs = {};   // engine -> [{id, script}]
  const meta = {};   // id -> {entry, dialect}
  const skipped = {};
  for (const d of wanted) skipped[d] = 0;
  entries.forEach((e, i) => {
    for (const d of wanted) {
      const v = variant(e, d);
      if (!v) continue;
      if (v.nocheck || (v.lang && v.lang !== 'sql')) { skipped[d]++; continue; }
      const id = `${i}:${d}`;
      (jobs[ENGINE[d]] = jobs[ENGINE[d]] || []).push({ id, script: v.example });
      meta[id] = { e, d, inherited: v.inherited };
    }
  });

  const engines = Object.keys(jobs);
  await Promise.all(engines.filter((x) => x !== 'sqlite').map(ensureContainer));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cheat-sql-'));
  const results = [];
  await Promise.all(engines.map(async (engine) => {
    const file = path.join(tmp, engine + '.json');
    fs.writeFileSync(file, JSON.stringify(jobs[engine]));
    const r = await exec(PY, ['-X', 'utf8', path.join(__dirname, 'sql_runner.py'), engine, file], { env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
    if (!r.ok) {
      const hint = /No module named/.test(r.err) ? '\nTreiber fehlen: python -m venv .venv-sql, dann .venv-sql/Scripts/pip install -r requirements-sql.txt (siehe README)' : '';
      console.error(`Runner für ${engine} ist abgebrochen:\n${r.err.trim().split('\n').slice(-6).join('\n')}${hint}`);
      process.exit(2);
    }
    results.push(...JSON.parse(r.out));
  }));
  fs.rmSync(tmp, { recursive: true, force: true });
  if (stopAfter) await Promise.all(engines.filter((x) => x !== 'sqlite').map((x) => exec('docker', ['stop', CONTAINERS[x].name])));

  const byId = new Map(results.map((r) => [r.id, r]));
  const order = Object.keys(meta).sort((a, b) => parseInt(a) - parseInt(b) || DIALECTS.indexOf(meta[a].d) - DIALECTS.indexOf(meta[b].d));
  if (runIt) {
    order.forEach((id) => {
      const r = byId.get(id);
      if (r && r.ok) console.log(`--- ${meta[id].e.name} [${NAME[meta[id].d]}${meta[id].inherited ? ', wie Standard' : ''}]\n${r.output || '(keine Ergebnisse)'}`);
    });
    console.log('');
  }

  const failed = order.filter((id) => !byId.get(id).ok);
  for (const d of wanted) {
    const ids = order.filter((id) => meta[id].d === d);
    const bad = ids.filter((id) => !byId.get(id).ok).length;
    console.log(`${NAME[d].padEnd(11)} ${String(ids.length - bad).padStart(4)}/${String(ids.length).padEnd(4)} fehlerfrei${skipped[d] ? ` (${skipped[d]} ohne Prüfung)` : ''}${d === 'std' ? '  [läuft in PostgreSQL]' : ''}`);
  }
  if (failed.length) {
    console.error(`\n${failed.length} Fehler:\n\n` + failed.map((id) => {
      const r = byId.get(id);
      const m = meta[id];
      return `${m.e.name} [${NAME[m.d]}${m.inherited ? ', erbt das Standard-Beispiel' : ''}]\n  ` + (r.error ? r.error : r.problems.join('\n  '));
    }).join('\n\n'));
    process.exit(1);
  }
}

main();
