window.CHEAT = window.CHEAT || [];
(function () {
  var H = 'https://www.typescriptlang.org/docs/handbook/';
  var T = 'https://www.typescriptlang.org/tsconfig/';
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- TS-Grundlagen ----------------
  {
    lang: 'ts', group: 'TS-Grundlagen', name: 'Was ist TypeScript?',
    desc: "Typisierte Obermenge von JavaScript, die zu reinem JavaScript kompiliert wird.",
    details: "TypeScript erweitert JavaScript um ein statisches Typsystem. Jeder gültige JavaScript-Code ist auch gültiger TypeScript-Code; der Compiler prüft die Typen vor der Ausführung und entfernt sie anschließend (Type Erasure). Zur Laufzeit gibt es keine Typen mehr, daher schützen Typen nicht vor ungeprüften Daten von außen (z. B. JSON aus einer API).",
    syntax: "// datei.ts\nlet name: string = \"Ada\";",
    example: e(`
// Typen existieren nur zur Entwicklungszeit
function gruss(name: string): string {
  return "Hallo " + name;
}

gruss("Ada");   // ok
gruss(42);      // ❌ Fehler: Argument of type 'number' is not assignable to parameter of type 'string'.

// Nach dem Kompilieren bleibt nur JavaScript:
// function gruss(name) { return "Hallo " + name; }
`),
    tip: "Typen werden beim Kompilieren gelöscht. Für Laufzeitprüfungen von externen Daten braucht man zusätzlich Validierung (z. B. mit einer Schema-Bibliothek).",
    keywords: ['typescript', 'ts', 'superset', 'obermenge', 'statische typisierung', 'type erasure', 'einführung'],
    related: ['tsc (Compiler)', 'Typannotationen', 'Typinferenz'],
    mdn: H + 'typescript-in-5-minutes.html'
  },
  {
    lang: 'ts', group: 'TS-Grundlagen', name: 'tsc (Compiler)',
    desc: "Der TypeScript-Compiler prüft Typen und erzeugt JavaScript.",
    details: "`tsc` wird über das npm-Paket `typescript` installiert, am besten als Dev-Dependency im Projekt. Ohne Dateiargument liest `tsc` die `tsconfig.json`; mit Dateiargument werden die Optionen aus der `tsconfig.json` ignoriert. Mit `--noEmit` wird nur geprüft, ohne Dateien zu schreiben, was bei Bundlern üblich ist. Fehler beim Typprüfen verhindern standardmäßig nicht, dass JavaScript ausgegeben wird (außer mit `noEmitOnError`).",
    syntax: "npx tsc [Optionen] [Dateien]",
    values: [
      ['tsc', 'Kompiliert das Projekt laut tsconfig.json'],
      ['tsc --noEmit', 'Nur Typen prüfen, kein JS ausgeben'],
      ['tsc --watch', 'Bei Änderungen automatisch neu kompilieren'],
      ['tsc --init', 'Erzeugt eine neue tsconfig.json'],
      ['tsc -p pfad', 'Bestimmte tsconfig verwenden'],
      ['tsc --build', 'Project References inkrementell bauen (-b)'],
      ['tsc --version', 'Installierte Version anzeigen']
    ],
    example: e(`
# Installation im Projekt
npm install --save-dev typescript

# tsconfig.json anlegen
npx tsc --init

# Projekt prüfen und kompilieren
npx tsc

# Nur prüfen (z. B. in CI)
npx tsc --noEmit
`),
    exampleLang: 'js',
    tip: "Globale Installation vermeiden: Mit `npx tsc` nutzt jedes Projekt seine eigene TypeScript-Version.",
    keywords: ['compiler', 'kompilieren', 'transpilieren', 'build', 'watch', 'noEmit', 'cli'],
    related: ['tsconfig.json', 'Wichtige Compiler-Optionen', 'TS direkt ausführen (tsx, Node, Deno, Bun)'],
    mdn: H + 'compiler-options.html'
  },
  {
    lang: 'ts', group: 'TS-Grundlagen', name: 'tsconfig.json',
    desc: "Konfigurationsdatei im Projektstamm für Compiler-Optionen und Dateiauswahl.",
    details: "Die Datei legt fest, welche Dateien (`include`, `exclude`, `files`) mit welchen `compilerOptions` kompiliert werden. Mit `extends` kann man eine Basiskonfiguration erben, z. B. von `@tsconfig/...`-Paketen. Pfade sind relativ zur tsconfig-Datei. Die Datei erlaubt Kommentare und abschließende Kommas (JSONC).",
    syntax: "{\n  \"compilerOptions\": { ... },\n  \"include\": [ ... ]\n}",
    values: [
      ['compilerOptions', 'Alle Compiler-Einstellungen'],
      ['include', 'Glob-Muster der einzubeziehenden Dateien'],
      ['exclude', 'Auszuschließende Muster (Standard: node_modules u. a.)'],
      ['files', 'Explizite Liste einzelner Dateien'],
      ['extends', 'Basis-Konfiguration, von der geerbt wird'],
      ['references', 'Project References für Monorepos']
    ],
    example: e(`
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
`),
    exampleLang: 'js',
    tip: "`exclude` verhindert nur das automatische Einbinden. Eine Datei, die von einer eingebundenen Datei importiert wird, wird trotzdem kompiliert.",
    keywords: ['konfiguration', 'config', 'compilerOptions', 'include', 'exclude', 'extends', 'jsconfig'],
    related: ['tsc (Compiler)', 'Wichtige Compiler-Optionen'],
    mdn: 'https://www.typescriptlang.org/docs/handbook/tsconfig-json.html'
  },
  {
    lang: 'ts', group: 'TS-Grundlagen', name: 'Wichtige Compiler-Optionen',
    desc: "Die am häufigsten gesetzten Optionen unter compilerOptions in der tsconfig.json.",
    details: "`strict: true` schaltet die gesamte Familie strenger Prüfungen ein (u. a. `noImplicitAny`, `strictNullChecks`) und sollte in neuen Projekten immer aktiv sein. `module` und `moduleResolution` müssen zur Laufzeitumgebung passen: `NodeNext` für Node.js, `Bundler` für Vite, esbuild und Co. `noUncheckedIndexedAccess` ist nicht in `strict` enthalten und muss separat aktiviert werden.",
    syntax: "\"compilerOptions\": { \"<option>\": <wert> }",
    values: [
      ['strict', 'Aktiviert alle strengen Prüfungen auf einmal (empfohlen)'],
      ['target', 'Ziel-JavaScript-Version der Ausgabe, z. B. ES2022 oder ESNext'],
      ['module', 'Modulsystem der Ausgabe: NodeNext, ESNext, CommonJS ...'],
      ['moduleResolution', 'Wie Imports aufgelöst werden: NodeNext, Bundler, Node10'],
      ['noImplicitAny', 'Fehler, wenn ein Typ implizit zu any würde (Teil von strict)'],
      ['strictNullChecks', 'null und undefined sind eigene Typen (Teil von strict)'],
      ['noUncheckedIndexedAccess', 'Index-Zugriffe liefern zusätzlich undefined'],
      ['outDir', 'Zielordner für die erzeugten Dateien'],
      ['rootDir', 'Wurzel der Quelldateien; bestimmt die Ordnerstruktur in outDir'],
      ['esModuleInterop', 'Saubere Default-Imports von CommonJS-Modulen'],
      ['skipLibCheck', 'Prüft .d.ts-Dateien nicht (schneller, weniger Konflikte)'],
      ['verbatimModuleSyntax', 'Imports/Exports bleiben wie geschrieben; Typen brauchen import type'],
      ['isolatedModules', 'Erzwingt Code, der Datei für Datei transpilierbar ist (Bundler, Babel, esbuild)']
    ],
    example: e(`
{
  "compilerOptions": {
    "strict": true,                      // inkl. noImplicitAny, strictNullChecks ...
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",       // für Vite/esbuild/webpack
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,        // Typ-Imports mit "import type"
    "isolatedModules": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  }
}
`),
    exampleLang: 'js',
    tip: "Mit `verbatimModuleSyntax` muss ein reiner Typ-Import `import type { User } from './user'` lauten, sonst meldet der Compiler einen Fehler.",
    keywords: ['strict', 'target', 'module', 'moduleResolution', 'noImplicitAny', 'strictNullChecks', 'noUncheckedIndexedAccess', 'outDir', 'rootDir', 'esModuleInterop', 'skipLibCheck', 'verbatimModuleSyntax', 'isolatedModules', 'optionen', 'compiler options'],
    related: ['tsconfig.json', 'tsc (Compiler)', 'null / undefined', 'Index-Signaturen'],
    mdn: T
  },
  {
    lang: 'ts', group: 'TS-Grundlagen', name: 'Typannotationen',
    desc: "Explizite Typangabe hinter einem Namen mit Doppelpunkt.",
    details: "Mit `: Typ` legt man den Typ von Variablen, Parametern, Rückgabewerten und Eigenschaften fest. Der Compiler prüft dann jede Zuweisung dagegen. Bei Variablen mit Initialwert ist die Annotation meist überflüssig, bei Funktionsparametern und öffentlichen API-Grenzen dagegen sinnvoll.",
    syntax: "let name: Typ = wert;\nfunction f(param: Typ): Rückgabetyp { }",
    example: e(`
let alter: number = 30;
let name: string = "Ada";
let aktiv: boolean = true;

alter = "dreißig";   // ❌ Fehler: Type 'string' is not assignable to type 'number'.

function verdoppeln(n: number): number {
  return n * 2;
}

const ids: number[] = [1, 2, 3];
const user: { id: number; name: string } = { id: 1, name: "Ada" };
`),
    tip: "Nicht alles annotieren: Wo der Compiler den Typ sicher ableitet, ist die Annotation nur Rauschen.",
    keywords: ['type annotation', 'typangabe', 'doppelpunkt', 'deklarieren'],
    related: ['Typinferenz', 'Parameter- & Rückgabetypen', 'string / number / boolean'],
    mdn: H + 'basic-types.html'
  },
  {
    lang: 'ts', group: 'TS-Grundlagen', name: 'Typinferenz',
    desc: "Der Compiler leitet Typen aus Werten und Kontext automatisch ab.",
    details: "Bei `let` wird der Typ zum allgemeinen Typ erweitert (`string`), bei `const` bleibt der Literaltyp erhalten (`\"x\"`). Rückgabetypen von Funktionen werden aus den `return`-Anweisungen abgeleitet. Ohne Initialwert und ohne Annotation entsteht bei `let` ein `any` (bzw. ein evolvierender Typ), was man vermeiden sollte. Mit Hover im Editor sieht man den abgeleiteten Typ.",
    example: e(`
let titel = "TypeScript";        // Typ: string
const version = 5;               // Typ: 5 (Literaltyp)
let zahlen = [1, 2, 3];          // Typ: number[]
let gemischt = [1, "a"];         // Typ: (string | number)[]

function addiere(a: number, b: number) {
  return a + b;                  // Rückgabetyp: number
}

titel = 42;   // ❌ Fehler: Type 'number' is not assignable to type 'string'.

// Kontextuelle Typisierung: n wird aus dem Array abgeleitet
[1, 2, 3].map((n) => n.toFixed(1));   // n: number
`),
    tip: "Funktionsparameter ohne Kontext werden nicht abgeleitet und sind bei `noImplicitAny` ein Fehler.",
    keywords: ['type inference', 'ableiten', 'automatisch', 'infer', 'contextual typing'],
    related: ['Typannotationen', 'Literal-Typen', 'as const', 'any'],
    mdn: H + 'type-inference.html'
  },
  {
    lang: 'ts', group: 'TS-Grundlagen', name: 'TS direkt ausführen (tsx, Node, Deno, Bun)',
    desc: "TypeScript-Dateien ohne separaten Build-Schritt ausführen.",
    details: "`tsx` ist ein Wrapper um Node.js, der TS-Dateien per esbuild transpiliert. Node.js kann `.ts`-Dateien ab Version 22.18 (Type Stripping) direkt ausführen, unterstützt aber nur Syntax, die sich durch Löschen der Typen ergibt (kein `enum`, keine Parameter Properties ohne Flag). Deno und Bun führen TypeScript nativ aus. Alle diese Wege prüfen keine Typen; dafür bleibt `tsc --noEmit` nötig.",
    syntax: "npx tsx datei.ts  |  node datei.ts  |  deno run datei.ts  |  bun datei.ts",
    values: [
      ['npx tsx datei.ts', 'Node.js mit esbuild-Transpilierung, auch mit watch'],
      ['node datei.ts', 'Natives Type Stripping (neuere Node-Versionen)'],
      ['deno run datei.ts', 'Deno: TypeScript eingebaut'],
      ['bun datei.ts', 'Bun: TypeScript eingebaut'],
      ['npx ts-node datei.ts', 'Älterer Ansatz, oft durch tsx ersetzt']
    ],
    example: e(`
# tsx: schnell, mit Neustart bei Änderungen
npx tsx watch src/index.ts

# Node.js (Type Stripping)
node src/index.ts

# Deno / Bun
deno run --allow-read src/index.ts
bun src/index.ts

# Typen trotzdem separat prüfen
npx tsc --noEmit
`),
    exampleLang: 'js',
    tip: "Diese Runner führen den Code aus, ohne Typfehler zu melden. In CI immer zusätzlich `tsc --noEmit` laufen lassen.",
    keywords: ['ausführen', 'run', 'tsx', 'ts-node', 'deno', 'bun', 'node', 'type stripping', 'direkt'],
    related: ['tsc (Compiler)', 'Wichtige Compiler-Optionen'],
    mdn: H + 'typescript-in-5-minutes.html'
  },

  // ---------------- Basistypen ----------------
  {
    lang: 'ts', group: 'Basistypen', name: 'string / number / boolean',
    desc: "Die primitiven Grundtypen für Text, Zahlen und Wahrheitswerte.",
    details: "Alle Typnamen werden klein geschrieben. `number` deckt Ganz- und Gleitkommazahlen ab (inklusive `NaN` und `Infinity`). Die großgeschriebenen Wrapper-Typen `String`, `Number` und `Boolean` bezeichnen Objekt-Wrapper und sollten nicht verwendet werden. Für sehr große Ganzzahlen gibt es `bigint`, für eindeutige Schlüssel `symbol`.",
    syntax: "let x: string | number | boolean | bigint | symbol;",
    example: e(`
const name: string = "Ada";
const preis: number = 19.99;
const aktiv: boolean = true;
const gross: bigint = 9007199254740993n;
const id: symbol = Symbol("id");

function laenge(s: String) {}   // ⚠ vermeiden: großgeschriebener Wrapper-Typ
function laenge2(s: string) {}  // ok

const n: number = "5";   // ❌ Fehler: Type 'string' is not assignable to type 'number'.
`),
    tip: "Immer `string`, `number`, `boolean` verwenden, nie `String`, `Number`, `Boolean`.",
    keywords: ['primitive', 'primitives', 'bigint', 'symbol', 'text', 'zahl', 'bool'],
    related: ['Typannotationen', 'Literal-Typen', 'null / undefined'],
    mdn: H + '2/everyday-types.html'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'any',
    desc: "Schaltet die Typprüfung für einen Wert komplett ab.",
    details: "Mit `any` ist jede Operation erlaubt, und `any` steckt jeden damit berührten Code an: Das Ergebnis ist ebenfalls `any`. Es ist ein Notausgang bei Migrationen, nimmt aber den Schutz von TypeScript weg. Ohne Annotation entsteht ein implizites `any` (bei `noImplicitAny` ein Fehler). Besser ist meist `unknown`.",
    syntax: "let wert: any;",
    example: e(`
let daten: any = "text";
daten.gibtEsNicht();      // kein Fehler, crasht zur Laufzeit
daten = 42;               // ok
const n: number = daten;  // ok, aber ungeprüft

function log(x) {}        // ❌ Fehler (noImplicitAny): Parameter 'x' implicitly has an 'any' type.
`),
    tip: "Statt `any` lieber `unknown` verwenden und den Wert vor der Nutzung eingrenzen.",
    keywords: ['jeder typ', 'untyped', 'escape hatch', 'implicit any', 'noImplicitAny'],
    related: ['unknown', 'Wichtige Compiler-Optionen', 'Narrowing'],
    mdn: H + '2/everyday-types.html#any'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'unknown',
    desc: "Sicherer Typ für Werte, deren Typ man nicht kennt.",
    details: "Jeder Wert ist einem `unknown` zuweisbar, aber ein `unknown` darf erst benutzt werden, nachdem man es mit Typ-Guards oder einer Assertion eingegrenzt hat. Das macht `unknown` zur typsicheren Alternative zu `any`. Typisch für `catch`-Fehler (mit `useUnknownInCatchVariables`, Teil von `strict`), JSON-Daten und Eingaben von außen.",
    syntax: "let wert: unknown;",
    example: e(`
function verarbeite(eingabe: unknown) {
  eingabe.toUpperCase();     // ❌ Fehler: 'eingabe' is of type 'unknown'.

  if (typeof eingabe === "string") {
    return eingabe.toUpperCase();   // eingabe: string
  }
}

try {
  JSON.parse("{");
} catch (err) {               // err: unknown
  if (err instanceof Error) console.error(err.message);
}
`),
    tip: "Daten aus `JSON.parse` oder `fetch` zuerst als `unknown` behandeln und prüfen, statt sie blind zu casten.",
    keywords: ['unbekannt', 'top type', 'catch', 'sicher', 'any alternative'],
    related: ['any', 'Narrowing', 'typeof-Guards', 'as (Type Assertion)'],
    mdn: H + 'basic-types.html'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'never',
    desc: "Der Typ von Werten, die nie auftreten können.",
    details: "`never` ist der leere Typ: Er hat keinen Wert und ist jedem Typ zuweisbar, aber nichts außer `never` ist ihm zuweisbar. Funktionen, die immer werfen oder nie zurückkehren, haben den Rückgabetyp `never`. Nach vollständigem Eingrenzen einer Union bleibt `never` übrig, was für Exhaustiveness-Checks genutzt wird.",
    syntax: "function f(): never { throw new Error(); }",
    example: e(`
function fehler(msg: string): never {
  throw new Error(msg);
}

function endlos(): never {
  while (true) {}
}

type Leer = string & number;   // Typ: never

function pruefe(x: string | number) {
  if (typeof x === "string") return;
  if (typeof x === "number") return;
  x;   // Typ: never
}
`),
    tip: "`never` ist nicht dasselbe wie `void`: `void` heißt „ohne nützlichen Rückgabewert“, `never` „kehrt nie zurück“.",
    keywords: ['bottom type', 'niemals', 'unerreichbar', 'throw', 'leerer typ'],
    related: ['Exhaustiveness-Check (never)', 'void', 'Narrowing'],
    mdn: H + 'basic-types.html'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'void',
    desc: "Rückgabetyp von Funktionen ohne nützlichen Rückgabewert.",
    details: "`void` kennzeichnet Funktionen, die nichts Sinnvolles zurückgeben. Eine Variable vom Typ `void` ist kaum nützlich. Bei Callback-Typen mit Rückgabetyp `void` darf die übergebene Funktion trotzdem einen Wert zurückgeben; der Wert wird ignoriert. Das ist der Grund, warum `arr.forEach(x => list.push(x))` fehlerfrei ist.",
    syntax: "function f(): void { }",
    example: e(`
function logge(msg: string): void {
  console.log(msg);
}

const r = logge("hi");   // Typ von r: void

type Handler = () => void;
const h: Handler = () => 42;   // ok: Rückgabewert wird ignoriert

function g(): void {
  return 42;   // ❌ Fehler: Type 'number' is not assignable to type 'void'.
}
`),
    tip: "Bei einer Funktion mit deklariertem Rückgabetyp `void` ist ein Rückgabewert verboten; nur bei Funktionstypen (Callbacks) ist er erlaubt.",
    keywords: ['kein rückgabewert', 'return', 'prozedur', 'callback'],
    related: ['never', 'Parameter- & Rückgabetypen', 'Callbacks typisieren'],
    mdn: H + '2/functions.html#void'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'null / undefined',
    desc: "Eigene Typen für fehlende Werte; mit strictNullChecks nicht mehr überall erlaubt.",
    details: "Ohne `strictNullChecks` darf `null` und `undefined` jedem Typ zugewiesen werden, was eine große Fehlerquelle ist. Mit `strict` sind es eigene Typen, und man muss sie per Union ausdrücken (`string | null`). Vor dem Zugriff prüft man auf den Wert (Narrowing), nutzt Optional Chaining `?.` oder den Operator `??`.",
    syntax: "let x: string | null = null;",
    example: e(`
let name: string = null;   // ❌ Fehler: Type 'null' is not assignable to type 'string'.

let spitzname: string | null = null;
spitzname.length;          // ❌ Fehler: 'spitzname' is possibly 'null'.

if (spitzname !== null) {
  spitzname.length;        // spitzname: string
}

const anzeige = spitzname?.toUpperCase() ?? "anonym";   // Typ: string
`),
    tip: "`strictNullChecks` nie ausschalten; es ist die wertvollste Einzelprüfung im Typsystem.",
    keywords: ['null', 'undefined', 'strictNullChecks', 'nullable', 'optional chaining', 'fehlender wert'],
    related: ['Narrowing', '! (Non-Null Assertion)', 'Optionale Eigenschaften (?)', 'Wichtige Compiler-Optionen'],
    mdn: H + '2/everyday-types.html#null-and-undefined'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'Arrays (T[] / Array<T>)',
    desc: "Listen gleichartiger Elemente, geschrieben als T[] oder Array<T>.",
    details: "Beide Schreibweisen sind gleichwertig; `T[]` ist üblicher, `Array<T>` lesbarer bei komplexen Elementtypen. Schreibgeschützte Arrays erhält man mit `readonly T[]` oder `ReadonlyArray<T>`. Ein leeres Array-Literal ohne Annotation wird zu `any[]` bzw. wächst bei `noImplicitAny` mit den eingefügten Typen.",
    syntax: "let a: Typ[];  |  let a: Array<Typ>;  |  let a: readonly Typ[];",
    example: e(`
const zahlen: number[] = [1, 2, 3];
const namen: Array<string> = ["Ada", "Linus"];
const gemischt: (string | number)[] = [1, "a"];

zahlen.push("4");   // ❌ Fehler: Argument of type 'string' is not assignable to parameter of type 'number'.

const fix: readonly number[] = [1, 2, 3];
fix.push(4);        // ❌ Fehler: Property 'push' does not exist on type 'readonly number[]'.

const erstes = zahlen[0];   // Typ: number (mit noUncheckedIndexedAccess: number | undefined)
`),
    tip: "Klammern bei Unions nicht vergessen: `string | number[]` ist etwas anderes als `(string | number)[]`.",
    keywords: ['array', 'liste', 'feld', 'ReadonlyArray', 'T[]'],
    related: ['Tupel', 'readonly', 'Generics', 'Index-Signaturen'],
    mdn: H + '2/everyday-types.html#arrays'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'Tupel',
    desc: "Array fester Länge mit festgelegtem Typ je Position.",
    details: "Ein Tupel beschreibt genau, welcher Typ an welchem Index steht. Elemente können benannt (`[x: number, y: number]`), optional (`?`) oder als Rest (`...T[]`) angegeben werden. Typische Anwendung sind Rückgabewerte wie bei React-Hooks. Zur Laufzeit ist ein Tupel ein normales Array.",
    syntax: "type T = [Typ1, Typ2];  |  [name: Typ, opt?: Typ, ...rest: Typ[]]",
    example: e(`
const punkt: [number, number] = [10, 20];
const eintrag: [id: number, name: string] = [1, "Ada"];

const falsch: [number, string] = ["a", 1];
// ❌ Fehler: Type 'string' is not assignable to type 'number'.

punkt[2];   // ❌ Fehler: Tuple type '[number, number]' of length '2' has no element at index '2'.

const [x, y] = punkt;   // x: number, y: number

type Zeile = [string, ...number[]];   // erst ein String, dann beliebig viele Zahlen
`),
    tip: "`push` ist bei normalen Tupeln erlaubt und wird nicht geprüft; mit `readonly [..]` ist das Tupel unveränderlich.",
    keywords: ['tuple', 'feste länge', 'paar', 'destructuring', 'positionen'],
    related: ['Arrays (T[] / Array<T>)', 'readonly', 'as const'],
    mdn: H + '2/everyday-types.html#tuple-types'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'Objekttypen',
    desc: "Beschreibt die Form eines Objekts mit Eigenschaften und deren Typen.",
    details: "TypeScript typisiert strukturell: Ein Objekt passt zu einem Typ, wenn es alle verlangten Eigenschaften mit passenden Typen hat, unabhängig vom Namen des Typs. Beim direkten Zuweisen eines Objektliterals gilt zusätzlich die Excess-Property-Prüfung, die unbekannte Eigenschaften meldet. Eigenschaften trennt man mit `;` oder `,`.",
    syntax: "{ name: Typ; alter: Typ; methode(): Typ }",
    example: e(`
function zeige(user: { id: number; name: string }) {
  console.log(user.id, user.name);
}

zeige({ id: 1, name: "Ada" });             // ok
zeige({ id: 1 });                          // ❌ Fehler: Property 'name' is missing in type '{ id: number; }' but required in type '{ id: number; name: string; }'.
zeige({ id: 1, name: "Ada", admin: true }); // ❌ Fehler: Object literal may only specify known properties, and 'admin' does not exist in type '{ id: number; name: string; }'.

const u = { id: 1, name: "Ada", admin: true };
zeige(u);   // ok: keine Excess-Property-Prüfung bei Variablen
`),
    tip: "Strukturelle Typisierung: Zusätzliche Eigenschaften sind bei Variablen erlaubt, nur bei frischen Objektliteralen nicht.",
    keywords: ['object type', 'form', 'shape', 'struktur', 'excess property check', 'structural typing'],
    related: ['type (Typalias)', 'interface', 'Optionale Eigenschaften (?)', 'object / {}'],
    mdn: H + '2/objects.html'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'Optionale Eigenschaften (?)',
    desc: "Ein Fragezeichen markiert Eigenschaften oder Parameter als optional.",
    details: "`name?: string` bedeutet, dass die Eigenschaft fehlen darf; ihr Typ ist dann `string | undefined`. Das Lesen verlangt daher eine Prüfung. Mit `exactOptionalPropertyTypes` unterscheidet TypeScript zwischen „fehlt“ und „ist explizit `undefined`“. Mit dem Hilfstyp `Partial<T>` macht man alle Eigenschaften optional.",
    syntax: "{ eigenschaft?: Typ }",
    example: e(`
interface Nutzer {
  id: number;
  name: string;
  email?: string;
}

const a: Nutzer = { id: 1, name: "Ada" };   // ok

a.email.toLowerCase();   // ❌ Fehler: 'a.email' is possibly 'undefined'.
a.email?.toLowerCase();  // Typ: string | undefined
`),
    tip: "Optional (`?`) und `| undefined` sind nicht dasselbe: Letzteres verlangt, dass die Eigenschaft vorhanden ist.",
    keywords: ['optional', 'fragezeichen', 'optional property', 'fehlt', 'undefined'],
    related: ['Objekttypen', 'null / undefined', 'Partial<T>', 'Optionale & Standardparameter (TS)'],
    mdn: H + '2/objects.html#optional-properties'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'readonly',
    desc: "Macht Eigenschaften oder Arrays schreibgeschützt (nur zur Compile-Zeit).",
    details: "Ein Modifikator vor dem Eigenschaftsnamen verbietet das Zuweisen nach der Initialisierung. Auf Array- und Tupeltypen angewandt (`readonly string[]`) sind mutierende Methoden wie `push` nicht verfügbar. Die Prüfung ist flach: Verschachtelte Objekte bleiben veränderbar. Zur Laufzeit wird nichts geschützt; dafür bräuchte man `Object.freeze`.",
    syntax: "readonly eigenschaft: Typ;  |  readonly Typ[]",
    example: e(`
interface Konfig {
  readonly host: string;
  readonly ports: readonly number[];
}

const k: Konfig = { host: "localhost", ports: [80, 443] };

k.host = "example.com";   // ❌ Fehler: Cannot assign to 'host' because it is a read-only property.
k.ports.push(8080);       // ❌ Fehler: Property 'push' does not exist on type 'readonly number[]'.

const kopie: { host: string } = k;   // ok: readonly beeinflusst die Zuweisbarkeit nicht
`),
    tip: "`readonly` ist flach und nur ein Compile-Time-Schutz; es erzwingt keine echte Unveränderlichkeit.",
    keywords: ['schreibgeschützt', 'unveränderlich', 'immutable', 'ReadonlyArray', 'Readonly'],
    related: ['Arrays (T[] / Array<T>)', 'as const', 'Objekttypen', 'Tupel'],
    mdn: H + '2/objects.html#readonly-properties'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'Literal-Typen',
    desc: "Typen, die genau einen bestimmten Wert zulassen.",
    details: "Strings, Zahlen und Booleans lassen sich als exakte Werte typisieren. Kombiniert mit Unions entstehen sichere Auswahlmengen, eine leichte Alternative zu `enum`. Bei `const` wird der Literaltyp abgeleitet, bei `let` zum breiten Typ erweitert. Template Literal Types (`` `prefix-${string}` ``) erweitern das Prinzip auf Muster.",
    syntax: "type Richtung = \"links\" | \"rechts\";",
    example: e(`
type Richtung = "links" | "rechts" | "oben" | "unten";
type Wuerfel = 1 | 2 | 3 | 4 | 5 | 6;

let r: Richtung = "links";
r = "diagonal";   // ❌ Fehler: Type '"diagonal"' is not assignable to type 'Richtung'.

const w: Wuerfel = 7;   // ❌ Fehler: Type '7' is not assignable to type 'Wuerfel'.

const a = "hallo";   // Typ: "hallo"
let b = "hallo";     // Typ: string

type Event = \`on\${Capitalize<Richtung>}\`;   // Typ: "onLinks" | "onRechts" | ...
`),
    tip: "Ein Objekt wie `{ dir: \"links\" }` hat `dir: string`. Mit `as const` oder einer Annotation bleibt das Literal erhalten.",
    keywords: ['literal types', 'string literal', 'konstanter typ', 'union', 'auswahl', 'template literal types'],
    related: ['Union-Typen (|)', 'enum', 'as const', 'Typinferenz'],
    mdn: H + '2/everyday-types.html#literal-types'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'enum',
    desc: "Benannte Konstantenmenge, die als Objekt zur Laufzeit existiert.",
    details: "Numerische Enums zählen ab 0 hoch und erzeugen zusätzlich eine Rückwärtsabbildung (Zahl auf Name). String-Enums haben explizite Werte und keine Rückwärtsabbildung. Enums sind eine der wenigen TypeScript-Funktionen, die echten JavaScript-Code erzeugen; bei Type Stripping oder `erasableSyntaxOnly` sind sie nicht erlaubt. Oft sind Union-Literaltypen die schlankere Wahl.",
    syntax: "enum Name { A, B = 5, C = \"text\" }",
    example: e(`
enum Status {
  Offen,        // 0
  InArbeit,     // 1
  Fertig        // 2
}

enum Farbe {
  Rot = "RED",
  Gruen = "GREEN"
}

const s: Status = Status.Fertig;
Status[1];          // "InArbeit" (Rückwärtsabbildung nur bei numerischen Enums)

const f: Farbe = "RED";   // ❌ Fehler: Type '"RED"' is not assignable to type 'Farbe'.

// Alternative ohne Laufzeitcode:
type StatusU = "offen" | "inArbeit" | "fertig";
`),
    tip: "Für neue Projekte oft besser: Union von String-Literalen oder ein `as const`-Objekt.",
    keywords: ['aufzählung', 'enumeration', 'konstanten', 'string enum', 'numeric enum'],
    related: ['const enum', 'Literal-Typen', 'Union-Typen (|)', 'as const'],
    mdn: H + 'enums.html'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'const enum',
    desc: "Enum, dessen Werte beim Kompilieren direkt eingesetzt werden.",
    details: "Ein `const enum` erzeugt keinen Laufzeitcode; jede Verwendung wird durch den Wert ersetzt (Inlining). Das spart Code, bringt aber Probleme mit `isolatedModules`, Bundlern und Bibliotheken, da andere Dateien den Wert nicht kennen. Deshalb wird es kaum noch empfohlen. Ein einfaches Objekt mit `as const` ist meist sicherer.",
    syntax: "const enum Name { A = 1, B }",
    example: e(`
const enum Richtung {
  Hoch = "UP",
  Runter = "DOWN"
}

const r = Richtung.Hoch;
// Ausgabe-JavaScript: const r = "UP" /* Richtung.Hoch */;

Richtung["Hoch"];        // ok
const alle = Richtung;   // ❌ Fehler: 'const' enums can only be used in property or index access expressions...

// Empfohlene Alternative:
const Rolle = { Admin: "admin", User: "user" } as const;
type Rolle = (typeof Rolle)[keyof typeof Rolle];   // Typ: "admin" | "user"
`),
    tip: "Mit `isolatedModules` oder `verbatimModuleSyntax` ist `const enum` über Dateigrenzen hinweg problematisch.",
    keywords: ['const enum', 'inline', 'konstante aufzählung', 'preserveConstEnums'],
    related: ['enum', 'as const', 'keyof', 'Wichtige Compiler-Optionen'],
    mdn: H + 'enums.html#const-enums'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'object / {}',
    desc: "Unspezifische Objekttypen: object, {} und Object unterscheiden sich deutlich.",
    details: "`object` steht für alle Nicht-Primitiven (Objekte, Arrays, Funktionen). `{}` ist jeder Wert außer `null` und `undefined`, also auch Strings und Zahlen. `Object` (groß) ist ähnlich wie `{}` und sollte vermieden werden. Meist ist ein konkreter Typ oder `Record<string, unknown>` die bessere Wahl.",
    syntax: "let a: object;  let b: {};  let c: Record<string, unknown>;",
    values: [
      ['object', 'Nur Nicht-Primitive: Objekte, Arrays, Funktionen'],
      ['{}', 'Alles außer null und undefined (auch Primitive)'],
      ['Object', 'Wie {}, aber mit Object-Methoden; vermeiden'],
      ['Record<string, unknown>', 'Objekt mit beliebigen String-Schlüsseln']
    ],
    example: e(`
let a: object = { x: 1 };
a = [1, 2];       // ok
a = "text";       // ❌ Fehler: Type 'string' is not assignable to type 'object'.

let b: {} = "text";   // ok
b = 42;               // ok
b = null;             // ❌ Fehler: Type 'null' is not assignable to type '{}'.

a.x;   // ❌ Fehler: Property 'x' does not exist on type 'object'.
`),
    tip: "Auf `object` und `{}` kann man keine Eigenschaften lesen. Für „irgendein Objekt“ eignet sich `Record<string, unknown>`.",
    keywords: ['object', 'leeres objekt', 'nicht primitiv', 'Object', 'Record'],
    related: ['Objekttypen', 'Index-Signaturen', 'unknown'],
    mdn: H + 'basic-types.html#object'
  },
  {
    lang: 'ts', group: 'Basistypen', name: 'Index-Signaturen',
    desc: "Typisiert Objekte mit beliebig vielen Schlüsseln gleichen Wertetyps.",
    details: "`[key: string]: Typ` erlaubt jeden String als Schlüssel; alle bekannten Eigenschaften müssen zum Wertetyp passen. Zugriffe über `obj[key]` liefern `Typ`, auch wenn der Schlüssel nicht existiert. Mit `noUncheckedIndexedAccess` wird daraus `Typ | undefined`, was sicherer ist. Für feste Schlüsselmengen sind `Record<K, V>` oder Mapped Types besser.",
    syntax: "{ [schluessel: string]: Typ }",
    example: e(`
interface Woerterbuch {
  [wort: string]: string;
}

const de: Woerterbuch = { hallo: "hello", welt: "world" };
de.katze = "cat";         // ok
de.zahl = 42;             // ❌ Fehler: Type 'number' is not assignable to type 'string'.

const x = de["unbekannt"];   // Typ: string (mit noUncheckedIndexedAccess: string | undefined)

interface Mix {
  [k: string]: number | string;
  anzahl: number;         // ok: passt zur Signatur
}
`),
    tip: "Aktiviere `noUncheckedIndexedAccess`, damit unbekannte Schlüssel als `undefined` berücksichtigt werden.",
    keywords: ['index signature', 'dictionary', 'map', 'wörterbuch', 'record', 'dynamische schlüssel'],
    related: ['Objekttypen', 'object / {}', 'Wichtige Compiler-Optionen', 'keyof'],
    mdn: H + '2/objects.html#index-signatures'
  },

  // ---------------- Typen kombinieren ----------------
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'type (Typalias)',
    desc: "Gibt einem beliebigen Typ einen Namen.",
    details: "Ein Typalias kann Objekttypen, Unions, Tupel, Funktionstypen und Primitive benennen und ist damit flexibler als `interface`. Aliase erzeugen keinen neuen Typ, sondern nur einen Namen. Sie lassen sich nicht erneut deklarieren (kein Declaration Merging) und können generisch sein.",
    syntax: "type Name = Typausdruck;",
    example: e(`
type ID = string | number;
type Punkt = { x: number; y: number };
type Vergleich<T> = (a: T, b: T) => number;
type Paar = [string, number];

const id: ID = "abc-1";
const p: Punkt = { x: 1, y: 2 };

type ID = boolean;   // ❌ Fehler: Duplicate identifier 'ID'.
`),
    tip: "Für Unions, Tupel und berechnete Typen führt kein Weg an `type` vorbei.",
    keywords: ['alias', 'type alias', 'typalias', 'benennen'],
    related: ['interface', 'interface vs. type', 'Union-Typen (|)', 'Generics'],
    mdn: H + '2/everyday-types.html#type-aliases'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'interface',
    desc: "Benennt die Form eines Objekts und lässt sich erweitern und zusammenführen.",
    details: "Ein Interface beschreibt Eigenschaften und Methoden von Objekten und kann von Klassen mit `implements` erfüllt werden. Es unterstützt `extends` für Vererbung und Declaration Merging. Interfaces beschreiben nur Objektformen, keine Unions oder Primitive. Fehlermeldungen zeigen häufig den Interface-Namen, was Lesbarkeit erhöht.",
    syntax: "interface Name { eigenschaft: Typ; methode(): Typ }",
    example: e(`
interface Nutzer {
  readonly id: number;
  name: string;
  email?: string;
  gruessen(): string;
}

const u: Nutzer = {
  id: 1,
  name: "Ada",
  gruessen() { return "Hi " + this.name; }
};

u.id = 2;   // ❌ Fehler: Cannot assign to 'id' because it is a read-only property.
`),
    keywords: ['schnittstelle', 'contract', 'objektform', 'implements'],
    related: ['type (Typalias)', 'interface vs. type', 'extends (interface)', 'Declaration Merging'],
    mdn: H + 'interfaces.html'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'interface vs. type',
    desc: "Wann man interface und wann type verwendet.",
    details: "Für Objektformen sind beide fast austauschbar. `interface` kann zusammengeführt und mit `extends` erweitert werden, `type` kann zusätzlich Unions, Tupel, Primitive und berechnete Typen benennen. Eine gängige Regel: Standardmäßig `interface` für Objekte und öffentliche APIs, `type` für alles andere. Wichtig ist vor allem, im Projekt konsistent zu bleiben.",
    values: [
      ['interface', 'Objekte; extends; Declaration Merging; implements'],
      ['type', 'Unions, Tupel, Primitive, Mapped/Conditional Types, Funktionstypen'],
      ['Erweitern', 'interface: extends | type: Intersection (&)'],
      ['Mehrfach deklarieren', 'interface: ja (Merging) | type: Fehler']
    ],
    example: e(`
// Beides beschreibt dasselbe Objekt
interface PunktI { x: number; y: number }
type PunktT = { x: number; y: number };

// Nur type kann das:
type ID = string | number;
type Paar = [number, number];

// Nur interface kann das (Merging):
interface Window { meinFeld: string }

// Erweitern
interface Punkt3I extends PunktI { z: number }
type Punkt3T = PunktT & { z: number };
`),
    tip: "Bei `interface extends` meldet der Compiler Konflikte sofort; bei `&` entstehen stattdessen oft `never`-Eigenschaften.",
    keywords: ['unterschied', 'vergleich', 'type oder interface', 'difference'],
    related: ['type (Typalias)', 'interface', 'Declaration Merging', 'Intersection-Typen (&)'],
    mdn: H + '2/everyday-types.html#differences-between-type-aliases-and-interfaces'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'extends (interface)',
    desc: "Ein Interface erbt die Eigenschaften eines oder mehrerer anderer Interfaces.",
    details: "Mit `extends` übernimmt ein Interface alle Eigenschaften der Basis und fügt eigene hinzu. Mehrere Basen werden durch Kommas getrennt. Überschriebene Eigenschaften müssen mit dem Basistyp kompatibel sein (nur Verengung erlaubt). Auch Typaliase von Objekten können erweitert werden.",
    syntax: "interface Kind extends Basis1, Basis2 { ... }",
    example: e(`
interface Tier {
  name: string;
}

interface Hund extends Tier {
  rasse: string;
}

interface Haustier extends Hund, Namensschild {
  besitzer: string;
}

interface Namensschild { chipId: number }

const h: Hund = { name: "Rex", rasse: "Schäfer" };

interface Falsch extends Tier {
  name: number;   // ❌ Fehler: Interface 'Falsch' incorrectly extends interface 'Tier'. Types of property 'name' are incompatible.
}
`),
    keywords: ['vererbung', 'erweitern', 'inheritance', 'extend'],
    related: ['interface', 'Intersection-Typen (&)', 'interface vs. type'],
    mdn: H + 'interfaces.html#extending-interfaces'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'Declaration Merging',
    desc: "Gleichnamige Interfaces werden automatisch zu einem Typ zusammengeführt.",
    details: "Deklariert man ein `interface` mehrfach im selben Scope, vereinigt TypeScript alle Deklarationen. So lassen sich bestehende Typen (z. B. `Window`, `Express.Request`) erweitern, ohne sie zu ändern. Gleich benannte Eigenschaften müssen denselben Typ haben. Typaliase können nicht zusammengeführt werden; das führt zu einem Fehler.",
    example: e(`
interface Konfig {
  host: string;
}

interface Konfig {
  port: number;
}

const k: Konfig = { host: "localhost", port: 8080 };   // beide Teile nötig

// Bestehende Typen erweitern (in einer .d.ts oder mit declare global)
declare global {
  interface Window {
    appVersion: string;
  }
}

type T = { a: number };
type T = { b: number };   // ❌ Fehler: Duplicate identifier 'T'.
`),
    tip: "Praktisch für Bibliotheks-Erweiterungen, aber zufälliges Merging durch doppelte Namen kann auch unbeabsichtigt passieren.",
    keywords: ['merging', 'zusammenführen', 'augmentation', 'module augmentation', 'global'],
    related: ['interface', 'interface vs. type', 'type (Typalias)'],
    mdn: 'https://www.typescriptlang.org/docs/handbook/declaration-merging.html'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'Union-Typen (|)',
    desc: "Ein Wert darf einer von mehreren Typen sein.",
    details: "`A | B` erlaubt Werte vom Typ A oder B. Zugreifen darf man nur auf Eigenschaften, die in allen Mitgliedern vorhanden sind; für alles andere muss man den Typ per Narrowing eingrenzen. Unions mit Literaltypen bilden Auswahlmengen, Unions mit einem gemeinsamen Diskriminator die Discriminated Unions.",
    syntax: "type U = A | B | C;",
    example: e(`
function formatiere(id: string | number) {
  id.toUpperCase();   // ❌ Fehler: Property 'toUpperCase' does not exist on type 'string | number'.

  if (typeof id === "string") {
    return id.toUpperCase();   // id: string
  }
  return id.toFixed(0);        // id: number
}

type Status = "laden" | "fertig" | "fehler";
let s: Status = "laden";
s = "pause";   // ❌ Fehler: Type '"pause"' is not assignable to type 'Status'.
`),
    tip: "Ein führendes `|` ist erlaubt und macht mehrzeilige Unions übersichtlicher.",
    keywords: ['union', 'oder', 'entweder', 'mehrere typen', 'sum type'],
    related: ['Intersection-Typen (&)', 'Narrowing', 'Discriminated Unions', 'Literal-Typen'],
    mdn: H + '2/everyday-types.html#union-types'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'Intersection-Typen (&)',
    desc: "Kombiniert mehrere Typen zu einem, der alle Eigenschaften besitzt.",
    details: "`A & B` verlangt, dass ein Wert sowohl A als auch B erfüllt. Bei Objekttypen entsteht ein Typ mit allen Eigenschaften beider. Haben gleichnamige Eigenschaften unvereinbare Typen, wird ihr Typ `never`. Intersections eignen sich zum Zusammensetzen kleiner Bausteine (Mixins, Props).",
    syntax: "type K = A & B;",
    example: e(`
type MitId = { id: number };
type MitName = { name: string };
type Nutzer = MitId & MitName;

const u: Nutzer = { id: 1, name: "Ada" };
const v: Nutzer = { id: 1 };   // ❌ Fehler: Property 'name' is missing in type '{ id: number; }' but required in type 'MitName'.

type A = { wert: string };
type B = { wert: number };
type AB = A & B;   // AB["wert"] hat den Typ: never

type X = string & number;   // Typ: never
`),
    keywords: ['intersection', 'und', 'kombinieren', 'zusammenführen', 'mixin'],
    related: ['Union-Typen (|)', 'extends (interface)', 'interface vs. type'],
    mdn: H + '2/objects.html#intersection-types'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'Narrowing',
    desc: "Der Compiler grenzt einen Typ durch Prüfungen im Code ein.",
    details: "Nach Bedingungen wie `typeof`, `instanceof`, `in`, Gleichheitsprüfungen oder Truthiness kennt der Compiler im jeweiligen Zweig einen engeren Typ (Control-Flow-Analyse). Das funktioniert mit `if`, `switch`, `&&`, `?:` und frühem `return`. Narrowing wird in Callbacks und nach Zuweisungen an veränderliche Variablen unter Umständen zurückgesetzt.",
    example: e(`
function drucke(x: string | string[] | null) {
  if (x === null) {
    return;                 // danach: x: string | string[]
  }
  if (Array.isArray(x)) {
    x.join(", ");           // x: string[]
  } else {
    x.toUpperCase();        // x: string
  }
}

function laenge(s?: string) {
  if (!s) return 0;         // Truthiness-Check
  return s.length;          // s: string
}
`),
    tip: "Truthiness-Narrowing behandelt auch `0` und `\"\"` als falsch; bei Zahlen und Strings daher lieber explizit prüfen.",
    keywords: ['eingrenzen', 'verengen', 'control flow', 'type guard', 'kontrollfluss'],
    related: ['typeof-Guards', 'instanceof-Guards', 'in-Guards', 'Type Predicates (x is T)', 'Discriminated Unions'],
    mdn: H + '2/narrowing.html'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'typeof-Guards',
    desc: "Grenzt primitive Typen mit typeof zur Laufzeit ein.",
    details: "`typeof x === \"string\"` verengt den Typ im Zweig. Mögliche Ergebnisse sind `\"string\"`, `\"number\"`, `\"bigint\"`, `\"boolean\"`, `\"symbol\"`, `\"undefined\"`, `\"object\"` und `\"function\"`. Vorsicht: `typeof null` ist `\"object\"`, daher muss man `null` extra ausschließen. Arrays erkennt man nicht mit `typeof`, sondern mit `Array.isArray`.",
    syntax: "if (typeof x === \"string\") { ... }",
    example: e(`
function verdopple(x: string | number) {
  if (typeof x === "string") {
    return x.repeat(2);    // x: string
  }
  return x * 2;            // x: number
}

function pruefe(x: unknown) {
  if (typeof x === "object") {
    x.toString();   // ❌ Fehler: 'x' is possibly 'null'.
  }
  if (typeof x === "object" && x !== null) {
    x;              // Typ: object
  }
}
`),
    tip: "`typeof x === \"object\"` schließt `null` ein; immer `x !== null` ergänzen.",
    keywords: ['typeof', 'type guard', 'primitive prüfen', 'laufzeitprüfung'],
    related: ['Narrowing', 'instanceof-Guards', 'in-Guards', 'unknown'],
    mdn: H + '2/narrowing.html#typeof-type-guards'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'instanceof-Guards',
    desc: "Grenzt Typen ein, indem die Klasse (Prototypenkette) geprüft wird.",
    details: "`x instanceof Klasse` verengt `x` im Zweig auf die Instanz-Klasse. Es funktioniert für alle Konstruktorfunktionen, z. B. `Date`, `Error`, `Map` oder eigene Klassen. Für Interfaces und Objektliterale ist es nicht geeignet, da diese zur Laufzeit nicht existieren. Über Realm-Grenzen (iframes) hinweg kann `instanceof` versagen.",
    syntax: "if (x instanceof Klasse) { ... }",
    example: e(`
class Hund { bellen() {} }
class Katze { miauen() {} }

function laut(tier: Hund | Katze) {
  if (tier instanceof Hund) {
    tier.bellen();   // tier: Hund
  } else {
    tier.miauen();   // tier: Katze
  }
}

function zeit(d: Date | string) {
  return d instanceof Date ? d.getTime() : Date.parse(d);
}

try { /* ... */ } catch (e) {
  if (e instanceof Error) console.log(e.message);   // e: Error
}
`),
    tip: "Für Interfaces gibt es kein `instanceof`; dort nutzt man `in`-Guards oder Type Predicates.",
    keywords: ['instanceof', 'klasse prüfen', 'prototyp', 'error'],
    related: ['Narrowing', 'typeof-Guards', 'in-Guards', 'Type Predicates (x is T)'],
    mdn: H + '2/narrowing.html#instanceof-narrowing'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'in-Guards',
    desc: "Grenzt Unions anhand der Existenz einer Eigenschaft ein.",
    details: "`\"eigenschaft\" in obj` verengt `obj` auf die Union-Mitglieder, die diese Eigenschaft (auch optional) haben. Im Else-Zweig bleiben die übrigen Mitglieder. Es eignet sich für Objekt-Unions ohne gemeinsamen Diskriminator. Der `in`-Operator prüft auch die Prototypenkette; bei `unknown` verengt er auf `object & Record<\"key\", unknown>`.",
    syntax: "if (\"eigenschaft\" in objekt) { ... }",
    example: e(`
interface Fisch { schwimmen(): void }
interface Vogel { fliegen(): void }

function bewege(tier: Fisch | Vogel) {
  if ("schwimmen" in tier) {
    tier.schwimmen();   // tier: Fisch
  } else {
    tier.fliegen();     // tier: Vogel
  }
}

function lese(daten: unknown) {
  if (typeof daten === "object" && daten !== null && "id" in daten) {
    daten.id;           // Typ: unknown
  }
}
`),
    tip: "Für wiederkehrende Fälle sind Discriminated Unions mit einer Tag-Eigenschaft robuster als `in`.",
    keywords: ['in operator', 'eigenschaft prüfen', 'property check', 'type guard'],
    related: ['Narrowing', 'Discriminated Unions', 'instanceof-Guards', 'Type Predicates (x is T)'],
    mdn: H + '2/narrowing.html#the-in-operator-narrowing'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'Type Predicates (x is T)',
    desc: "Eigene Type-Guard-Funktionen mit Rückgabetyp „param is Typ“.",
    details: "Eine Funktion mit Rückgabetyp `x is T` gibt `boolean` zurück und teilt dem Compiler mit, dass `x` im `true`-Zweig den Typ `T` hat. Der Compiler prüft nicht, ob die Implementierung korrekt ist; ein falsches Prädikat führt zu Typfehlern zur Laufzeit. Praktisch zum Filtern, z. B. `.filter(istString)`. Ab TypeScript 5.5 werden einfache Prädikate oft automatisch inferiert.",
    syntax: "function istT(x: unknown): x is T { ... }",
    example: e(`
interface Katze { miauen(): void }
interface Hund { bellen(): void }

function istKatze(t: Katze | Hund): t is Katze {
  return "miauen" in t;
}

function sprich(t: Katze | Hund) {
  if (istKatze(t)) t.miauen();   // t: Katze
  else t.bellen();               // t: Hund
}

const werte = ["a", null, "b"];   // Typ: (string | null)[]
const texte = werte.filter((w): w is string => w !== null);   // Typ: string[]
`),
    tip: "Das Prädikat ist eine Zusicherung. Stimmt die Logik nicht, entstehen Fehler, die der Compiler nicht findet.",
    keywords: ['type guard', 'user-defined type guard', 'is', 'prädikat', 'filter', 'benutzerdefiniert'],
    related: ['Narrowing', 'Assertion Functions (asserts)', 'in-Guards'],
    mdn: H + '2/narrowing.html#using-type-predicates'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'Assertion Functions (asserts)',
    desc: "Funktionen, die bei Erfolg den Typ eingrenzen und sonst werfen.",
    details: "Mit `asserts x is T` (oder `asserts x`) sagt man dem Compiler, dass nach dem Aufruf der Funktion `x` den Typ `T` besitzt, andernfalls wurde eine Exception geworfen. Der Aufruf muss über eine explizit typisierte Funktionsdeklaration oder -variable erfolgen. Wie bei Type Predicates wird die Implementierung nicht auf Korrektheit geprüft.",
    syntax: "function pruefe(x: unknown): asserts x is T { ... }",
    example: e(`
function assertIstString(x: unknown): asserts x is string {
  if (typeof x !== "string") {
    throw new TypeError("String erwartet");
  }
}

function verarbeite(eingabe: unknown) {
  eingabe.length;           // ❌ Fehler: 'eingabe' is of type 'unknown'.
  assertIstString(eingabe);
  eingabe.length;           // eingabe: string
}

function assert(bedingung: unknown, msg?: string): asserts bedingung {
  if (!bedingung) throw new Error(msg);
}
`),
    tip: "Ideal für Validierung am Anfang einer Funktion: Danach ist der Rest des Codes frei von weiteren Prüfungen.",
    keywords: ['asserts', 'assertion', 'zusicherung', 'validieren', 'throw'],
    related: ['Type Predicates (x is T)', 'Narrowing', 'unknown'],
    mdn: H + '2/narrowing.html'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'Discriminated Unions',
    desc: "Union von Objekttypen mit einer gemeinsamen Literal-Eigenschaft als Unterscheidungsmerkmal.",
    details: "Jedes Mitglied hat dieselbe Eigenschaft (Diskriminator, z. B. `kind` oder `type`) mit einem eindeutigen Literaltyp. Eine Prüfung dieser Eigenschaft in `if` oder `switch` grenzt die Union exakt auf ein Mitglied ein. Das Muster eignet sich für Zustände, Ergebnisse (`ok`/`error`) und Aktionen und lässt sich mit einem Exhaustiveness-Check absichern.",
    syntax: "type U = { kind: \"a\"; ... } | { kind: \"b\"; ... };",
    example: e(`
type Form =
  | { kind: "kreis"; radius: number }
  | { kind: "rechteck"; breite: number; hoehe: number };

function flaeche(f: Form): number {
  switch (f.kind) {
    case "kreis":
      return Math.PI * f.radius ** 2;       // f: { kind: "kreis"; ... }
    case "rechteck":
      return f.breite * f.hoehe;            // f: { kind: "rechteck"; ... }
  }
}

type Ergebnis<T> = { ok: true; wert: T } | { ok: false; fehler: string };
`),
    tip: "Der Diskriminator muss ein Literaltyp sein (string, number, boolean, null oder undefined), nicht einfach `string`.",
    keywords: ['tagged union', 'discriminated union', 'diskriminator', 'kind', 'sum type', 'algebraischer datentyp'],
    related: ['Union-Typen (|)', 'Exhaustiveness-Check (never)', 'Narrowing', 'Literal-Typen'],
    mdn: H + '2/narrowing.html#discriminated-unions'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'Exhaustiveness-Check (never)',
    desc: "Stellt sicher, dass alle Fälle einer Union behandelt werden.",
    details: "Im `default`-Zweig eines `switch` ist der Wert nach vollständiger Behandlung vom Typ `never`. Weist man ihn einer Variablen vom Typ `never` zu, meldet der Compiler einen Fehler, sobald ein neuer Fall zur Union hinzukommt. So werden vergessene Fälle zur Compile-Zeit erkannt statt zur Laufzeit.",
    syntax: "default: { const _x: never = wert; throw new Error(); }",
    example: e(`
type Form =
  | { kind: "kreis"; radius: number }
  | { kind: "quadrat"; seite: number }
  | { kind: "dreieck"; basis: number; hoehe: number };

function flaeche(f: Form): number {
  switch (f.kind) {
    case "kreis":
      return Math.PI * f.radius ** 2;
    case "quadrat":
      return f.seite ** 2;
    default: {
      const pruefung: never = f;
      // ❌ Fehler: Type '{ kind: "dreieck"; ... }' is not assignable to type 'never'.
      return pruefung;
    }
  }
}
`),
    tip: "Kürzer: eine Hilfsfunktion `function assertNever(x: never): never { throw new Error(); }` im default-Zweig aufrufen.",
    keywords: ['exhaustive', 'vollständigkeit', 'switch', 'assertNever', 'alle fälle'],
    related: ['never', 'Discriminated Unions', 'Narrowing'],
    mdn: H + '2/narrowing.html#exhaustiveness-checking'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'as (Type Assertion)',
    desc: "Überschreibt den vom Compiler abgeleiteten Typ eines Ausdrucks.",
    details: "`wert as Typ` teilt dem Compiler mit, dass man es besser weiß. Es findet keine Umwandlung und keine Laufzeitprüfung statt. Erlaubt sind nur Assertions zu einem verwandten Typ (Ober- oder Untertyp); völlig unpassende Typen erfordern den Umweg über `unknown` (`as unknown as T`), was ein Warnsignal ist. Die Spitzklammer-Syntax `<T>wert` gibt es nur in `.ts`-Dateien, nicht in TSX.",
    syntax: "wert as Typ",
    example: e(`
const el = document.getElementById("name") as HTMLInputElement;
el.value = "Ada";   // el: HTMLInputElement (statt HTMLElement | null)

const daten = JSON.parse("{}") as { id: number };   // Laufzeit: ungeprüft!

const n = "5" as number;
// ❌ Fehler: Conversion of type 'string' to type 'number' may be a mistake...

const hack = "5" as unknown as number;   // erlaubt, aber gefährlich
`),
    tip: "Assertions sind keine Casts. Wenn möglich besser per Type Guard eingrenzen oder `satisfies` nutzen.",
    keywords: ['cast', 'type assertion', 'typecast', 'umwandeln', 'as unknown as'],
    related: ['satisfies', '! (Non-Null Assertion)', 'unknown', 'Narrowing'],
    mdn: H + '2/everyday-types.html#type-assertions'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'satisfies',
    desc: "Prüft einen Wert gegen einen Typ, ohne den abgeleiteten Typ zu verbreitern.",
    details: "`wert satisfies Typ` (ab TypeScript 4.9) meldet Fehler, wenn der Wert nicht zum Typ passt, behält aber den genaueren abgeleiteten Typ bei. Eine Annotation `: Typ` würde dagegen den Typ auf `Typ` verbreitern. So bekommt man Tippfehler-Schutz bei Schlüsseln und trotzdem präzise Typen und Autovervollständigung.",
    syntax: "const x = wert satisfies Typ;",
    example: e(`
type Farben = Record<string, string | number[]>;

const palette = {
  rot: [255, 0, 0],
  gruen: "#00ff00"
} satisfies Farben;

palette.rot.map((c) => c / 2);   // ok: rot ist number[]
palette.gruen.toUpperCase();     // ok: gruen ist string

const falsch = {
  blau: 123
} satisfies Farben;   // ❌ Fehler: Type 'number' is not assignable to type 'string | number[]'.

const a: Farben = { rot: [1, 2, 3] };
a.rot.map((c) => c);   // ❌ Fehler: Property 'map' does not exist on type 'string | number[]'.
`),
    tip: "Kombination `as const satisfies Typ` liefert unveränderliche Literaltypen mit Strukturprüfung.",
    keywords: ['satisfies', 'prüfen ohne verbreitern', 'konfiguration', 'typprüfung'],
    related: ['as (Type Assertion)', 'as const', 'Typannotationen'],
    mdn: 'https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: '! (Non-Null Assertion)',
    desc: "Das nachgestellte Ausrufezeichen entfernt null und undefined aus dem Typ.",
    details: "`wert!` teilt dem Compiler mit, dass der Wert nicht `null` oder `undefined` ist. Es erzeugt keinen Laufzeitcode und prüft nichts; ist der Wert doch leer, tritt ein Fehler auf. Sinnvoll in Fällen, in denen man den Zustand garantiert kennt, die der Compiler aber nicht nachvollziehen kann. Meist ist ein echter Check oder `?.` die bessere Wahl.",
    syntax: "ausdruck!",
    example: e(`
const el = document.getElementById("app");   // Typ: HTMLElement | null
el.textContent = "Hi";    // ❌ Fehler: 'el' is possibly 'null'.
el!.textContent = "Hi";   // ok, aber ungeprüft

const karte = new Map<string, number>([["a", 1]]);
const wert = karte.get("a")!;   // Typ: number

// Sicherer:
if (el) el.textContent = "Hi";
el?.setAttribute("id", "x");
`),
    tip: "Jedes `!` ist eine unbewiesene Behauptung. In Reviews kritisch prüfen, ob ein Check möglich ist.",
    keywords: ['non-null assertion', 'ausrufezeichen', 'bang', 'definitiv', 'nicht null'],
    related: ['null / undefined', 'as (Type Assertion)', 'Narrowing'],
    mdn: H + '2/everyday-types.html#non-null-assertion-operator-postfix-'
  },
  {
    lang: 'ts', group: 'Typen kombinieren', name: 'as const',
    desc: "Const-Assertion: macht Literale schreibgeschützt und behält exakte Typen bei.",
    details: "`as const` verhindert das Verbreitern von Literalen: Strings bleiben Literaltypen, Objekteigenschaften werden `readonly`, Arrays werden zu `readonly`-Tupeln. Damit lassen sich Konstantenlisten definieren, aus denen man per `typeof` und Indexzugriff Union-Typen ableitet. Es wirkt nur auf Literale, nicht auf Variablen oder Funktionsaufrufe.",
    syntax: "const x = literal as const;",
    example: e(`
const rollen = ["admin", "user", "gast"] as const;
// Typ: readonly ["admin", "user", "gast"]

type Rolle = (typeof rollen)[number];   // Typ: "admin" | "user" | "gast"

const konfig = {
  host: "localhost",
  port: 8080
} as const;
// Typ: { readonly host: "localhost"; readonly port: 8080 }

konfig.port = 9090;   // ❌ Fehler: Cannot assign to 'port' because it is a read-only property.
`),
    tip: "Gute Alternative zu `enum`: ein `as const`-Objekt plus abgeleiteter Union-Typ.",
    keywords: ['const assertion', 'literal', 'readonly tuple', 'konstante', 'typeof'],
    related: ['Literal-Typen', 'readonly', 'enum', 'satisfies', 'Tupel'],
    mdn: H + 'release-notes/typescript-3-4.html#const-assertions'
  },

  // ---------------- Funktionen typisieren ----------------
  {
    lang: 'ts', group: 'Funktionen typisieren', name: 'Parameter- & Rückgabetypen',
    desc: "Typen für Parameter hinter dem Namen, Rückgabetyp nach der Parameterliste.",
    details: "Parameter müssen annotiert werden, sonst sind sie bei `noImplicitAny` ein Fehler. Der Rückgabetyp wird meist abgeleitet, eine explizite Angabe schützt aber die Schnittstelle und verhindert, dass versehentlich ein anderer Typ zurückgegeben wird. Bei `async`-Funktionen ist der Rückgabetyp immer ein `Promise<T>`.",
    syntax: "function f(a: Typ, b: Typ): Rückgabetyp { ... }",
    example: e(`
function addiere(a: number, b: number): number {
  return a + b;
}

const teile = (a: number, b: number): number => a / b;

addiere(1);          // ❌ Fehler: Expected 2 arguments, but got 1.
addiere(1, "2");     // ❌ Fehler: Argument of type 'string' is not assignable to parameter of type 'number'.

function laden(id: number): Promise<string> {
  return fetch("/api/" + id).then((r) => r.text());
}

async function ladeAsync(id: number): Promise<{ id: number }> {
  return { id };
}
`),
    tip: "Rückgabetypen für exportierte Funktionen explizit angeben; interne Hilfsfunktionen dürfen abgeleitet werden.",
    keywords: ['parameter', 'return type', 'rückgabewert', 'argument', 'function', 'signatur'],
    related: ['Funktionstypen', 'Optionale & Standardparameter (TS)', 'void', 'Typannotationen'],
    mdn: H + '2/functions.html'
  },
  {
    lang: 'ts', group: 'Funktionen typisieren', name: 'Funktionstypen',
    desc: "Beschreibt Signaturen von Funktionen als Typ.",
    details: "Ein Funktionstyp wird mit Pfeilsyntax geschrieben: `(a: number) => string`. Parameternamen im Typ sind nur Dokumentation. Alternativ nutzt man eine Call Signature in einem Objekttyp, wenn die Funktion zusätzlich Eigenschaften hat. Construct Signatures mit `new (...)` beschreiben Konstruktoren.",
    syntax: "type F = (param: Typ) => Rückgabetyp;  |  { (param: Typ): Rückgabetyp }",
    example: e(`
type Vergleich = (a: number, b: number) => number;

const aufsteigend: Vergleich = (a, b) => a - b;   // Parameter werden abgeleitet
[3, 1, 2].sort(aufsteigend);

const falsch: Vergleich = (a: string) => 0;
// ❌ Fehler: Type '(a: string) => number' is not assignable to type 'Vergleich'.

// Call Signature mit Eigenschaft
type Zaehler = {
  (): number;
  beschreibung: string;
};

type Konstruktor = new (name: string) => { name: string };
`),
    tip: "Weniger Parameter als im Typ sind erlaubt (die Funktion ignoriert sie), mehr Pflichtparameter nicht.",
    keywords: ['function type', 'signatur', 'pfeilfunktion', 'call signature', 'construct signature'],
    related: ['Parameter- & Rückgabetypen', 'Callbacks typisieren', 'Overloads', 'type (Typalias)'],
    mdn: H + '2/functions.html#function-type-expressions'
  },
  {
    lang: 'ts', group: 'Funktionen typisieren', name: 'Optionale & Standardparameter (TS)',
    desc: "Parameter mit ? oder Standardwert dürfen beim Aufruf fehlen.",
    details: "Ein `?` macht den Parameter optional; sein Typ innerhalb der Funktion ist dann `Typ | undefined`. Mit Standardwert (`x: number = 10`) ist der Parameter ebenfalls optional, im Inneren aber nie `undefined`. Optionale Parameter müssen nach den Pflichtparametern stehen, Parameter mit Standardwert nicht unbedingt.",
    syntax: "function f(a: Typ, b?: Typ, c: Typ = standard) { }",
    example: e(`
function gruss(name: string, anrede?: string, ausrufe: number = 1) {
  const a = anrede ?? "Hallo";   // anrede: string | undefined
  return a + " " + name + "!".repeat(ausrufe);   // ausrufe: number
}

gruss("Ada");                // ok
gruss("Ada", "Hi", 3);       // ok
gruss("Ada", undefined, 2);  // ok

function falsch(a?: number, b: number) {}
// ❌ Fehler: A required parameter cannot follow an optional parameter.
`),
    tip: "Wer einen mittleren Parameter überspringen will, übergibt `undefined`; bei vielen Optionen ist ein Options-Objekt besser.",
    keywords: ['optional parameter', 'default parameter', 'standardwert', 'fragezeichen', 'default'],
    related: ['Parameter- & Rückgabetypen', 'Rest-Parameter (TS)', 'Optionale Eigenschaften (?)'],
    mdn: H + '2/functions.html#optional-parameters'
  },
  {
    lang: 'ts', group: 'Funktionen typisieren', name: 'Rest-Parameter (TS)',
    desc: "Sammelt beliebig viele Argumente in einem typisierten Array oder Tupel.",
    details: "Rest-Parameter werden als Array-Typ annotiert (`...args: number[]`) und müssen der letzte Parameter sein. Mit einem Tupeltyp (`...args: [string, number]`) lassen sich feste Argumentlisten ausdrücken. Beim Aufruf kann man mit dem Spread-Operator Arrays übergeben; bei festen Parametern verlangt TypeScript dafür ein Tupel.",
    syntax: "function f(...args: Typ[]) { }",
    example: e(`
function summe(...zahlen: number[]): number {
  return zahlen.reduce((a, b) => a + b, 0);
}

summe(1, 2, 3);       // ok
summe(1, "2");        // ❌ Fehler: Argument of type 'string' is not assignable to parameter of type 'number'.

function logge(ebene: string, ...teile: [string, number?]) {}

const werte = [1, 2];
Math.max(...werte);   // ok
function zwei(a: number, b: number) {}
zwei(...werte);       // ❌ Fehler: A spread argument must either have a tuple type or be passed to a rest parameter.
`),
    keywords: ['rest', 'varargs', 'spread', 'beliebig viele', 'rest parameter'],
    related: ['Parameter- & Rückgabetypen', 'Tupel', 'Optionale & Standardparameter (TS)'],
    mdn: H + '2/functions.html#rest-parameters-and-arguments'
  },
  {
    lang: 'ts', group: 'Funktionen typisieren', name: 'Overloads',
    desc: "Mehrere Signaturen für eine Funktion mit einer gemeinsamen Implementierung.",
    details: "Man schreibt mehrere Overload-Signaturen ohne Rumpf und danach die Implementierungs-Signatur mit Rumpf. Von außen sichtbar sind nur die Overload-Signaturen, nicht die Implementierung. Die Implementierung muss mit allen Overloads kompatibel sein. Overloads werden von oben nach unten geprüft; die spezifischste Signatur gehört daher nach oben. Oft sind Unions oder Generics einfacher.",
    syntax: "function f(a: A): X;\nfunction f(a: B): Y;\nfunction f(a: A | B): X | Y { ... }",
    example: e(`
function erzeuge(zeit: number): Date;
function erzeuge(jahr: number, monat: number, tag: number): Date;
function erzeuge(a: number, b?: number, c?: number): Date {
  return b === undefined ? new Date(a) : new Date(a, b, c ?? 1);
}

erzeuge(0);          // ok
erzeuge(2025, 1, 1); // ok
erzeuge(2025, 1);    // ❌ Fehler: No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.

function laenge(x: string): number;
function laenge(x: unknown[]): number;
function laenge(x: string | unknown[]) { return x.length; }
`),
    tip: "Die Implementierungs-Signatur ist von außen unsichtbar. Bevor man Overloads schreibt, prüfen, ob eine Union ausreicht.",
    keywords: ['overload', 'überladung', 'mehrere signaturen', 'überladen'],
    related: ['Parameter- & Rückgabetypen', 'Union-Typen (|)', 'Funktionstypen', 'Generics'],
    mdn: H + '2/functions.html#function-overloads'
  },
  {
    lang: 'ts', group: 'Funktionen typisieren', name: 'this-Parameter',
    desc: "Deklariert den Typ von this in einer Funktion über einen Pseudo-Parameter.",
    details: "Als erster Parameter namens `this` legt man fest, in welchem Kontext die Funktion aufgerufen werden darf. Er wird beim Kompilieren entfernt und beim Aufruf nicht übergeben. Mit der Option `noImplicitThis` (Teil von `strict`) meldet TypeScript Zugriffe auf ein untypisiertes `this`. Pfeilfunktionen haben kein eigenes `this` und können keinen `this`-Parameter haben.",
    syntax: "function f(this: Typ, ...) { }",
    example: e(`
interface Knopf {
  label: string;
  klick(this: Knopf): void;
}

const k: Knopf = {
  label: "OK",
  klick() { console.log(this.label); }   // this: Knopf
};

k.klick();            // ok
const lose = k.klick;
lose();               // ❌ Fehler: The 'this' context of type 'void' is not assignable to method's 'this' of type 'Knopf'.

function zeige(this: { name: string }) {
  return this.name;
}
zeige.call({ name: "Ada" });   // ok
`),
    tip: "Gut gegen den klassischen Fehler, eine Methode als Callback ohne `bind` zu übergeben.",
    keywords: ['this', 'kontext', 'noImplicitThis', 'bind', 'call'],
    related: ['Callbacks typisieren', 'Funktionstypen', 'Wichtige Compiler-Optionen'],
    mdn: H + '2/functions.html#declaring-this-in-a-function'
  },
  {
    lang: 'ts', group: 'Funktionen typisieren', name: 'Callbacks typisieren',
    desc: "Funktionen als Parameter mit passendem Funktionstyp annotieren.",
    details: "Der Parameter erhält einen Funktionstyp, der Argumente und Rückgabe des Callbacks beschreibt. Die Parameter des übergebenen Callbacks werden dann aus dem Typ abgeleitet (kontextuelle Typisierung), man muss sie nicht erneut annotieren. Optionale Callback-Parameter vermeiden: Wenn der Callback sie nicht braucht, darf er sie auslassen. Rückgabetyp `void` erlaubt beliebige Rückgaben.",
    syntax: "function f(callback: (arg: Typ) => Rückgabetyp) { }",
    example: e(`
function fuerJedes(
  liste: string[],
  callback: (eintrag: string, index: number) => void
): void {
  liste.forEach((e, i) => callback(e, i));
}

fuerJedes(["a", "b"], (eintrag, index) => {
  eintrag.toUpperCase();   // eintrag: string, index: number
});

fuerJedes(["a"], (eintrag: number) => {});
// ❌ Fehler: Argument of type '(eintrag: number) => void' is not assignable to parameter of type '(eintrag: string, index: number) => void'.

function lade(url: string, fertig: (fehler: Error | null, daten?: string) => void) {}
`),
    tip: "Callback-Parameter nur dann als optional (`?`) markieren, wenn der Aufrufer sie tatsächlich manchmal weglässt.",
    keywords: ['callback', 'higher order', 'funktion als parameter', 'handler', 'kontextuelle typisierung'],
    related: ['Funktionstypen', 'void', 'this-Parameter', 'Generics'],
    mdn: H + '2/functions.html#function-type-expressions'
  }
  );
})();
