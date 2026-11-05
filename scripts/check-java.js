// Kompiliert alle Java-Beispiele mit javac; braucht ein JDK 25 (JAVA_HOME oder PATH).
// Aufruf: node scripts/check-java.js [Dateifilter] [--run]
//   Dateifilter  nur Dateien, deren Name den Text enthält, z. B. java-oop
//   --run        Beispiele zusätzlich ausführen und die Ausgabe zeigen (zum Prüfen der Kommentare)
// Beispiele dürfen Anweisungen, Klassenmember oder ganze Quelldateien sein. Nicht geprüft werden
// Einträge mit exampleLang (Shell, XML) oder nocheck: true.
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { execFile } = require('child_process');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const runIt = args.includes('--run');
const filter = args.find((a) => !a.startsWith('--')) || 'java-';
const bin = (tool) => {
  const exe = process.platform === 'win32' ? tool + '.exe' : tool;
  return process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin', exe) : exe;
};

const IMPORTS = ['java.io', 'java.math', 'java.net', 'java.net.http', 'java.nio.charset', 'java.nio.file', 'java.time',
  'java.time.format', 'java.time.temporal', 'java.util', 'java.util.concurrent', 'java.util.concurrent.atomic',
  'java.util.concurrent.locks', 'java.util.function', 'java.util.regex', 'java.util.stream']
  .map((p) => `import ${p}.*;`).join(' ');

// Aufrufe mit Fehlerstatus liefern das Ergebnis statt zu werfen; javac meldet Fehler auf stderr.
const exec = (cmd, argv, cwd, timeout) => new Promise((resolve) => {
  execFile(cmd, argv, { cwd, timeout, maxBuffer: 1 << 20 }, (err, stdout, stderr) => {
    if (err && err.code === 'ENOENT') { console.error(`${cmd} nicht gefunden: JAVA_HOME auf ein JDK setzen.`); process.exit(2); }
    resolve({ ok: !err, out: stdout, err: stderr });
  });
});

// Dieselbe Quelle in den drei möglichen Formen; die erste, die kompiliert, zählt.
function variants(code) {
  const own = (code.match(/^\s*import\s[^;]+;/gm) || []).join(' ');
  const body = code.replace(/^\s*import\s[^;]+;/gm, '');
  const unit = /^\s*package\s/m.test(code) ? code : `${IMPORTS}\n${code}`;
  const pub = (code.match(/^public\s+(?:(?:abstract|final|sealed|non-sealed|strictfp)\s+)*(?:class|interface|enum|record|@interface)\s+(\w+)/m) || [])[1];
  const forms = [
    { file: 'Main.java', src: `${IMPORTS}\n${own}\nclass Main { public static void main(String[] args) throws Exception {\n${body}\n} }` },
    { file: 'Main.java', src: `${IMPORTS}\n${own}\nclass Main {\n${body}\n}` },
    { file: (pub || 'Main') + '.java', src: unit }
  ];
  // Eine Klasse mit eigener main-Methode würde sonst als innere Klasse von Main kompilieren und nie starten.
  const ownMain = /^(?:public\s+|final\s+|abstract\s+)*(?:class|record|enum|interface)\s/m.test(code) && /\bstatic\s+void\s+main\b/.test(code);
  return ownMain ? [forms[2], forms[0], forms[1]] : forms;
}

async function check(entry, tmp) {
  // Scheitern alle Formen, ist die mit den wenigsten Fehlern vermutlich die gemeinte.
  let best = null;
  const count = (s) => (s.match(/^\S+\.java:\d+:/gm) || []).length;
  for (const v of variants(entry.example)) {
    const dir = fs.mkdtempSync(path.join(tmp, 'x'));
    fs.writeFileSync(path.join(dir, v.file), v.src);
    const r = await exec(bin('javac'), ['-nowarn', '--release', '25', '-encoding', 'UTF-8', '-d', 'out', v.file], dir, 60000);
    if (r.ok) return { ok: true, dir, source: v.src, wrapped: v.file === 'Main.java' };
    if (best === null || count(r.err) < count(best)) best = r.err;
  }
  return { ok: false, err: best };
}

async function main() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const files = [...html.matchAll(/<script src="(data\/[^"]+)"/g)].map((m) => m[1]).filter((f) => f.includes(filter));
  const ctx = { window: {} };
  vm.createContext(ctx);
  files.forEach((f) => { if (fs.existsSync(path.join(root, f))) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f }); });
  const all = (ctx.window.CHEAT || []).filter((e) => e.lang === 'java');
  const todo = all.filter((e) => !e.nocheck && (!e.exampleLang || e.exampleLang === 'java'));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cheat-java-'));
  const failed = [];
  let next = 0;
  const worker = async () => {
    while (next < todo.length) {
      const e = todo[next++];
      const r = await check(e, tmp);
      if (!r.ok) { failed.push(`${e.name}\n${r.err.trim().split('\n').slice(0, 8).join('\n')}`); continue; }
      if (runIt) {
        // Hauptklasse: der letzte nicht eingerückte Typ vor main. In Main.java liegt alles in Main.
        const at = r.source.search(/\bvoid\s+main\b/);
        const types = at < 0 ? [] : [...r.source.slice(0, at).matchAll(/^(?:[\w-]+\s+)*(?:class|record|enum|interface)\s+(\w+)/gm)];
        const mainClass = r.wrapped ? 'Main' : types.length ? types[types.length - 1][1] : null;
        if (at >= 0 && mainClass) {
          const pkg = (r.source.match(/^\s*package\s+([\w.]+);/m) || [])[1];
          const out = await exec(bin('java'), ['-cp', 'out', (pkg ? pkg + '.' : '') + mainClass], r.dir, 15000);
          console.log(`--- ${e.name}\n${out.out.trim()}${out.ok ? '' : '\n[Abbruch] ' + out.err.trim().split('\n')[0]}`);
        }
      }
    }
  };
  await Promise.all(Array.from({ length: Math.max(2, os.cpus().length - 1) }, worker));
  fs.rmSync(tmp, { recursive: true, force: true });

  console.log(`${todo.length - failed.length}/${todo.length} Java-Beispiele kompilieren (${all.length - todo.length} ohne Prüfung).`);
  if (failed.length) {
    console.error(`\n${failed.length} Fehler:\n\n` + failed.join('\n\n'));
    process.exit(1);
  }
}

main();
