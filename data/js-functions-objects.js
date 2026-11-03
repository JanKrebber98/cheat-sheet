window.CHEAT = window.CHEAT || [];
(function () {
  var M = 'https://developer.mozilla.org/de/docs/Web/JavaScript/';
  var F = 'Funktionen', O = 'Objekte', K = 'Klassen', D = 'Module';

  window.CHEAT.push(
  // ---------------- Funktionen ----------------
  {
    lang: 'js', group: F, name: 'Funktionsdeklaration', run: true,
    desc: 'Definiert eine benannte Funktion mit dem Schlüsselwort `function`.',
    details: 'Eine Deklaration wird gehoistet: Die Funktion kann schon vor der Zeile ihrer Definition aufgerufen werden. Sie erzeugt einen Namen im umgebenden Scope und eignet sich für wiederverwendbare, benannte Logik. In Blöcken (`if`, `{}`) verhalten sich Deklarationen im Strict Mode blockgebunden, daher besser nicht bedingt deklarieren.',
    syntax: 'function name(param1, param2) {\n  // Anweisungen\n  return wert;\n}',
    example: 'console.log(addiere(2, 3)); // → 5 (Hoisting: Aufruf vor Definition)\n\nfunction addiere(a, b) {\n  return a + b;\n}\n\nconsole.log(addiere.name);   // → "addiere"\nconsole.log(addiere.length); // → 2 (Anzahl Parameter)',
    tip: 'Fehlt `return`, liefert die Funktion `undefined` zurück.',
    keywords: ['function', 'funktion definieren', 'hoisting', 'deklaration'],
    related: ['Funktionsausdruck', 'Arrow Functions (=>)', 'return'], mdn: M + 'Reference/Statements/function'
  },
  {
    lang: 'js', group: F, name: 'Funktionsausdruck', run: true,
    desc: 'Funktion als Wert, den man in einer Variablen speichern oder weitergeben kann.',
    details: 'Ein Funktionsausdruck erzeugt die Funktion erst zur Laufzeit an der Stelle des Ausdrucks und wird nicht gehoistet; vor der Zuweisung ist die Variable nicht nutzbar. Der Name ist optional (anonym) und hilft bei Stack Traces und Rekursion. Funktionen sind in JavaScript First-Class-Werte.',
    syntax: 'const f = function (param) { ... };\nconst g = function benannt(param) { ... };',
    example: 'const quadrat = function (x) {\n  return x * x;\n};\nconsole.log(quadrat(4)); // → 16\n\nconst fakultaet = function fak(n) {\n  return n <= 1 ? 1 : n * fak(n - 1); // fak nur innen sichtbar\n};\nconsole.log(fakultaet(5)); // → 120\n\ntry {\n  vorher(); // Variable existiert, ist aber noch nicht zugewiesen\n  var vorher = function () {};\n} catch (e) {\n  console.log(e.name); // → TypeError\n}',
    keywords: ['anonyme funktion', 'function expression', 'first-class'],
    related: ['Funktionsdeklaration', 'Arrow Functions (=>)', 'IIFE'], mdn: M + 'Reference/Operators/function'
  },
  {
    lang: 'js', group: F, name: 'Arrow Functions (=>)', run: true,
    desc: 'Kompakte Funktionsschreibweise ohne eigenes `this`.',
    details: 'Bei einem einzigen Ausdruck entfällt `return` samt geschweiften Klammern (implizite Rückgabe). Arrow Functions übernehmen `this` und `arguments`-Kontext aus der Umgebung (lexikalisches `this`), sind nicht als Konstruktor (`new`) nutzbar und eignen sich für Callbacks. Wer ein Objekt-Literal implizit zurückgibt, muss es in Klammern setzen.',
    syntax: '(a, b) => a + b\nx => x * 2\n() => ({ key: wert })\n(a, b) => {\n  return a + b;\n}',
    example: 'const verdopple = (x) => x * 2;\nconsole.log([1, 2, 3].map(verdopple)); // → [2, 4, 6]\n\nconst punkt = (x, y) => ({ x, y }); // Objekt in Klammern!\nconsole.log(punkt(1, 2)); // → { x: 1, y: 2 }\n\nconst timer = {\n  sekunden: 0,\n  start() {\n    [1, 2, 3].forEach(() => this.sekunden++); // this = timer\n    return this.sekunden;\n  }\n};\nconsole.log(timer.start()); // → 3',
    tip: 'Als Objektmethode oder Prototyp-Methode sind Arrow Functions meist falsch, weil `this` nicht das Objekt ist.',
    keywords: ['pfeilfunktion', 'lambda', 'arrow', 'fat arrow', 'lexikalisches this'],
    related: ['Funktionsausdruck', 'this', 'Callbacks'], mdn: M + 'Reference/Functions/Arrow_functions'
  },
  {
    lang: 'js', group: F, name: 'Standardparameter', run: true,
    desc: 'Vorgabewert für einen Parameter, falls kein Wert oder `undefined` übergeben wird.',
    details: 'Der Default greift nur bei `undefined`, nicht bei `null`, `0` oder `""`. Er wird bei jedem Aufruf neu ausgewertet und kann auf frühere Parameter zugreifen. Parameter mit Default sollten möglichst am Ende stehen, da man sonst `undefined` explizit übergeben muss.',
    syntax: 'function f(a, b = 10, c = a + b) { ... }',
    example: 'function begruesse(name = "Gast", gruss = "Hallo") {\n  return `${gruss}, ${name}!`;\n}\nconsole.log(begruesse());              // → "Hallo, Gast!"\nconsole.log(begruesse("Anna"));        // → "Hallo, Anna!"\nconsole.log(begruesse(undefined, "Hi")); // → "Hi, Gast!"\nconsole.log(begruesse(null));          // → "Hallo, null!" (null ist kein Default-Auslöser)\n\nfunction rechteck(w, h = w) {\n  return w * h;\n}\nconsole.log(rechteck(3)); // → 9',
    keywords: ['default parameter', 'vorgabewert', 'defaults'],
    related: ['Rest-Parameter', 'Funktionsdeklaration', 'Destrukturierung (Objekt)'], mdn: M + 'Reference/Functions/Default_parameters'
  },
  {
    lang: 'js', group: F, name: 'Rest-Parameter', run: true,
    desc: 'Sammelt beliebig viele übrige Argumente in einem echten Array.',
    details: 'Der Rest-Parameter `...name` muss der letzte Parameter sein und es darf nur einen geben. Anders als das alte `arguments`-Objekt ist er ein echtes Array mit allen Array-Methoden und funktioniert auch in Arrow Functions. Nicht mit dem Spread-Operator verwechseln, der beim Aufruf Werte ausbreitet.',
    syntax: 'function f(a, b, ...rest) { ... }',
    example: 'function summe(...zahlen) {\n  return zahlen.reduce((s, z) => s + z, 0);\n}\nconsole.log(summe(1, 2, 3, 4)); // → 10\n\nfunction logge(ebene, ...nachrichten) {\n  console.log(ebene, nachrichten);\n}\nlogge("INFO", "a", "b"); // → INFO ["a", "b"]',
    keywords: ['rest parameter', 'varargs', 'beliebig viele argumente', 'arguments'],
    related: ['Standardparameter', 'Funktionsdeklaration', '... (Spread)'], mdn: M + 'Reference/Functions/rest_parameters'
  },
  {
    lang: 'js', group: F, name: 'return', run: true,
    desc: 'Beendet die Funktion und gibt einen Wert an den Aufrufer zurück.',
    details: 'Ohne Wert oder ohne `return` ist das Ergebnis `undefined`. Nach `return` wird kein weiterer Code der Funktion ausgeführt, was für frühe Rückgaben (Guard Clauses) genutzt wird. Ein Zeilenumbruch direkt nach `return` ist eine Falle: Wegen automatischer Semikolon-Einfügung wird `undefined` zurückgegeben.',
    syntax: 'return ausdruck;',
    example: 'function teile(a, b) {\n  if (b === 0) return null; // frühe Rückgabe\n  return a / b;\n}\nconsole.log(teile(10, 2)); // → 5\nconsole.log(teile(1, 0));  // → null\n\nfunction falsch() {\n  return\n  { ok: true };\n}\nconsole.log(falsch()); // → undefined (Semikolon nach return eingefügt)\n\nfunction mehrere() {\n  return [1, 2]; // mehrere Werte per Array oder Objekt\n}\nconst [a, b] = mehrere();\nconsole.log(a, b); // → 1 2',
    keywords: ['rückgabe', 'rückgabewert', 'zurückgeben'],
    related: ['Funktionsdeklaration', 'Arrow Functions (=>)'], mdn: M + 'Reference/Statements/return'
  },
  {
    lang: 'js', group: F, name: 'Closures', run: true,
    desc: 'Eine Funktion behält Zugriff auf die Variablen ihres Entstehungsorts.',
    details: 'Jede Funktion „erinnert“ sich an den Scope, in dem sie definiert wurde, auch nachdem dieser Scope beendet ist. So lassen sich private Zustände, Fabriken und Konfigurationsfunktionen bauen. Fallstricke: Schleifen mit `var` teilen sich eine Variable, und gehaltene Closures verhindern das Aufräumen großer Objekte.',
    syntax: 'function aussen() {\n  let zustand = 0;\n  return function innen() {\n    return ++zustand;\n  };\n}',
    example: 'function zaehler(start = 0) {\n  let n = start; // von außen nicht erreichbar\n  return {\n    erhoehe: () => ++n,\n    wert: () => n\n  };\n}\nconst a = zaehler();\nconst b = zaehler(100);\na.erhoehe(); a.erhoehe();\nb.erhoehe();\nconsole.log(a.wert(), b.wert()); // → 2 101\n\nconst fns = [];\nfor (var i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map(f => f())); // → [3, 3, 3] (var teilt sich i)\nconst fns2 = [];\nfor (let j = 0; j < 3; j++) fns2.push(() => j);\nconsole.log(fns2.map(f => f())); // → [0, 1, 2]',
    keywords: ['closure', 'abschluss', 'scope', 'gültigkeitsbereich', 'private variable'],
    related: ['Higher-Order Functions', 'IIFE', 'Callbacks'], mdn: M + 'Closures'
  },
  {
    lang: 'js', group: F, name: 'Callbacks', run: true,
    desc: 'Funktion, die einer anderen Funktion übergeben und später von ihr aufgerufen wird.',
    details: 'Callbacks sind die Grundlage für Array-Methoden, Event-Handler und Timer. Sie können synchron (z. B. `map`) oder asynchron (z. B. `setTimeout`) aufgerufen werden. Verschachtelte asynchrone Callbacks führen schnell zu schwer lesbarem Code („Callback Hell“); dafür gibt es Promises und `async`/`await`.',
    syntax: 'function arbeite(daten, callback) {\n  callback(ergebnis);\n}',
    example: 'function ladeDaten(id, callback) {\n  setTimeout(() => callback(null, { id, name: "Tisch" }), 100);\n}\n\nladeDaten(7, (fehler, daten) => {\n  if (fehler) return console.log("Fehler:", fehler);\n  console.log(daten); // → { id: 7, name: "Tisch" }\n});\n\n// Synchroner Callback\n[3, 1, 2].sort((a, b) => a - b).forEach(x => console.log(x)); // → 1, 2, 3',
    tip: 'Konvention bei Node.js: Fehler als erstes Argument (`(err, result)`).',
    keywords: ['callback', 'rückruf', 'handler', 'asynchron'],
    related: ['Higher-Order Functions', 'Closures', 'Arrow Functions (=>)'], mdn: M + 'Guide/Using_promises#callbacks'
  },
  {
    lang: 'js', group: F, name: 'Higher-Order Functions', run: true,
    desc: 'Funktionen, die andere Funktionen als Argument nehmen oder zurückgeben.',
    details: 'Sie erlauben, Verhalten zu parametrisieren und zu komponieren, etwa `map`, `filter`, `reduce` oder eigene Fabriken wie `multipliziereMit(n)`. Oft werden sie mit Closures kombiniert, um Konfiguration zu „merken“. Wichtig ist, dass die übergebene Funktion nicht aufgerufen (`f()`), sondern nur referenziert (`f`) wird.',
    syntax: 'const hof = (fn) => (...args) => fn(...args);',
    example: 'const multipliziereMit = (n) => (x) => x * n;\nconst mal3 = multipliziereMit(3);\nconsole.log(mal3(5)); // → 15\n\nfunction mitLog(fn) {\n  return (...args) => {\n    const r = fn(...args);\n    console.log(`${fn.name}(${args}) =`, r);\n    return r;\n  };\n}\nfunction plus(a, b) { return a + b; }\nmitLog(plus)(2, 3); // → plus(2,3) = 5\n\nconst komponiere = (f, g) => (x) => f(g(x));\nconsole.log(komponiere(mal3, (x) => x + 1)(2)); // → 9',
    keywords: ['higher order', 'funktion höherer ordnung', 'funktionale programmierung', 'komposition'],
    related: ['Callbacks', 'Closures', 'Arrow Functions (=>)'], mdn: M + 'Guide/Functions'
  },
  {
    lang: 'js', group: F, name: 'IIFE', run: true,
    desc: 'Sofort ausgeführter Funktionsausdruck: Funktion definieren und direkt aufrufen.',
    details: 'Eine IIFE (Immediately Invoked Function Expression) erzeugt einen eigenen Scope, ohne den globalen Namensraum zu verschmutzen. Früher das Standardmittel für Module; heute ersetzen Blöcke mit `let`/`const` und ES-Module vieles davon. Nützlich ist sie noch für einmalige Initialisierung oder `async`-Code ohne top-level `await`.',
    syntax: '(function () { ... })();\n(() => { ... })();\n(async () => { ... })();',
    example: 'const zaehler = (function () {\n  let n = 0; // privat\n  return () => ++n;\n})();\nconsole.log(zaehler(), zaehler()); // → 1 2\n\n(() => {\n  const geheim = 42;\n  console.log("läuft sofort", geheim);\n})();\n\n(async () => {\n  const wert = await Promise.resolve("fertig");\n  console.log(wert); // → fertig\n})();',
    tip: 'Die Klammern sind nötig, damit der Parser einen Ausdruck statt einer Deklaration sieht.',
    keywords: ['iife', 'selbstaufrufend', 'immediately invoked', 'sofort aufrufen'],
    related: ['Funktionsausdruck', 'Closures', 'Arrow Functions (=>)'], mdn: 'https://developer.mozilla.org/de/docs/Glossary/IIFE'
  },
  {
    lang: 'js', group: F, name: 'Rekursion', run: true,
    desc: 'Eine Funktion ruft sich selbst auf, um ein Problem in kleinere Teile zu zerlegen.',
    details: 'Jede Rekursion braucht einen Basisfall, der den Abbruch garantiert, und einen Schritt, der sich dem Basisfall nähert. Zu tiefe Rekursion löst einen `RangeError` („Maximum call stack size exceeded“) aus, JavaScript optimiert Endrekursion in der Praxis nicht. Für sehr tiefe Strukturen ist eine Schleife oder ein expliziter Stack sicherer.',
    syntax: 'function f(n) {\n  if (basisfall) return wert;\n  return f(kleinereAufgabe);\n}',
    example: 'function fakultaet(n) {\n  if (n <= 1) return 1; // Basisfall\n  return n * fakultaet(n - 1);\n}\nconsole.log(fakultaet(5)); // → 120\n\nfunction tiefe(obj) {\n  const kinder = Object.values(obj).filter(v => typeof v === "object" && v !== null);\n  return 1 + Math.max(0, ...kinder.map(tiefe));\n}\nconsole.log(tiefe({ a: { b: { c: 1 } }, d: 2 })); // → 3\n\ntry {\n  (function endlos() { endlos(); })();\n} catch (e) {\n  console.log(e instanceof RangeError); // → true\n}',
    keywords: ['recursion', 'rekursiv', 'selbstaufruf', 'stack overflow', 'basisfall'],
    related: ['Funktionsdeklaration', 'Closures'], mdn: 'https://developer.mozilla.org/de/docs/Glossary/Recursion'
  },
  {
    lang: 'js', group: F, name: 'this', run: true,
    desc: 'Verweist je nach Aufrufart auf das Objekt, in dessen Kontext die Funktion läuft.',
    details: 'Bei `obj.methode()` ist `this` das Objekt vor dem Punkt, bei einem losen Aufruf `undefined` (Strict Mode/Module) bzw. das globale Objekt. `call`, `apply` und `bind` setzen es explizit, bei `new` ist es die neue Instanz. Arrow Functions haben kein eigenes `this`, sondern übernehmen es aus dem umgebenden Code. Eine Methode als Callback weitergegeben verliert ihr `this`.',
    syntax: 'this.eigenschaft',
    example: '"use strict";\nconst person = {\n  name: "Mia",\n  hallo() { return `Hallo, ${this.name}`; },\n  halloArrow: () => typeof this // this der Umgebung (Modul: undefined)\n};\nconsole.log(person.hallo()); // → "Hallo, Mia"\n\nconst lose = person.hallo; // Kontext verloren\ntry {\n  lose();\n} catch (e) {\n  console.log(e.name); // → TypeError (this ist undefined)\n}\nconsole.log(lose.call({ name: "Ben" })); // → "Hallo, Ben"\nconsole.log(person.halloArrow()); // → "undefined"',
    tip: 'Methode als Callback weitergeben? Mit `bind(obj)` oder einer Arrow Function umschließen.',
    keywords: ['kontext', 'this verloren', 'lexikalisch', 'aufrufkontext'],
    related: ['call() / apply()', 'bind()', 'Arrow Functions (=>)'], mdn: M + 'Reference/Operators/this'
  },
  {
    lang: 'js', group: F, name: 'call() / apply()', run: true,
    desc: 'Ruft eine Funktion sofort auf und legt dabei `this` explizit fest.',
    details: '`fn.call(thisArg, a, b)` übergibt Argumente einzeln, `fn.apply(thisArg, [a, b])` als Array. Beide führen die Funktion direkt aus (im Gegensatz zu `bind`). Mit Spread und Rest-Parametern wird `apply` heute selten gebraucht; `call` dient oft zum Ausleihen von Methoden.',
    syntax: 'fn.call(thisArg, arg1, arg2)\nfn.apply(thisArg, [arg1, arg2])',
    example: 'function vorstellen(stadt, land) {\n  return `${this.name} aus ${stadt}, ${land}`;\n}\nconst anna = { name: "Anna" };\n\nconsole.log(vorstellen.call(anna, "Wien", "Österreich"));\n// → "Anna aus Wien, Österreich"\nconsole.log(vorstellen.apply(anna, ["Bern", "Schweiz"]));\n// → "Anna aus Bern, Schweiz"\n\nconsole.log(Math.max.apply(null, [3, 9, 4])); // → 9\nconsole.log(Math.max(...[3, 9, 4]));         // → 9 (modern)',
    keywords: ['call', 'apply', 'this setzen', 'methode ausleihen'],
    related: ['bind()', 'this', 'Rest-Parameter'], mdn: M + 'Reference/Global_Objects/Function/call'
  },
  {
    lang: 'js', group: F, name: 'bind()', run: true,
    desc: 'Erzeugt eine neue Funktion mit fest gebundenem `this` und optional vorbelegten Argumenten.',
    details: '`bind` führt die Funktion nicht aus, sondern liefert eine neue, gebundene Funktion zurück. Das Binden von `this` ist endgültig und kann durch ein weiteres `bind` oder `call` nicht überschrieben werden. Vorbelegte Argumente (Partial Application) werden vor die späteren gestellt.',
    syntax: 'const gebunden = fn.bind(thisArg, arg1, arg2);',
    example: 'const knopf = {\n  label: "Speichern",\n  klick() { return `Klick auf ${this.label}`; }\n};\nconst handler = knopf.klick.bind(knopf);\nconsole.log(handler()); // → "Klick auf Speichern"\n\nfunction mult(a, b) { return a * b; }\nconst verdopple = mult.bind(null, 2); // Partial Application\nconsole.log(verdopple(21)); // → 42',
    keywords: ['bind', 'binden', 'partial application', 'this fixieren'],
    related: ['call() / apply()', 'this', 'Arrow Functions (=>)'], mdn: M + 'Reference/Global_Objects/Function/bind'
  },
  {
    lang: 'js', group: F, name: 'function* (Generator)', run: true,
    desc: 'Funktion, die sich pausieren lässt und Werte nach und nach liefert.',
    details: 'Ein Aufruf liefert einen Generator-Iterator, der den Code erst bei `next()` bis zum nächsten `yield` ausführt. Generatoren sind lazy, eignen sich für unendliche Folgen und eigene Iterables (`for...of`, Spread). Der Zustand der Funktion bleibt zwischen den Aufrufen erhalten.',
    syntax: 'function* name() {\n  yield wert;\n}\nconst it = name();\nit.next(); // { value, done }',
    example: 'function* zaehle(bis) {\n  for (let i = 1; i <= bis; i++) yield i;\n}\nconst it = zaehle(2);\nconsole.log(it.next()); // → { value: 1, done: false }\nconsole.log(it.next()); // → { value: 2, done: false }\nconsole.log(it.next()); // → { value: undefined, done: true }\n\nconsole.log([...zaehle(4)]); // → [1, 2, 3, 4]\n\nfunction* unendlich() {\n  let n = 0;\n  while (true) yield n++;\n}\nfor (const n of unendlich()) {\n  if (n > 3) break;\n  console.log(n); // → 0, 1, 2, 3\n}',
    tip: 'Generatoren können keine Arrow Functions sein; es gibt kein `=>*`.',
    keywords: ['generator', 'iterator', 'lazy', 'function stern', 'iterable'],
    related: ['yield', 'Rekursion'], mdn: M + 'Reference/Statements/function*'
  },
  {
    lang: 'js', group: F, name: 'yield', run: true,
    desc: 'Pausiert einen Generator und gibt einen Wert nach außen; kann Werte empfangen.',
    details: '`yield wert` liefert `{ value, done: false }` an den Aufrufer von `next()`. Der Ausdruck selbst ergibt den Wert, den man dem nächsten `next(x)` übergibt, so entsteht eine Zwei-Wege-Kommunikation. `yield*` delegiert an ein anderes Iterable oder einen anderen Generator.',
    syntax: 'const eingabe = yield wert;\nyield* andereQuelle;',
    example: 'function* dialog() {\n  const name = yield "Wie heißt du?";\n  const alter = yield `Hallo ${name}, wie alt bist du?`;\n  return `${name} ist ${alter}`;\n}\nconst g = dialog();\nconsole.log(g.next().value);     // → "Wie heißt du?"\nconsole.log(g.next("Lea").value); // → "Hallo Lea, wie alt bist du?"\nconsole.log(g.next(30));          // → { value: "Lea ist 30", done: true }\n\nfunction* alles() {\n  yield 1;\n  yield* [2, 3]; // Delegation\n}\nconsole.log([...alles()]); // → [1, 2, 3]',
    tip: 'Das erste `next()` startet nur den Generator; ein dort übergebener Wert geht verloren.',
    keywords: ['yield', 'yield*', 'generator pausieren', 'delegation'],
    related: ['function* (Generator)'], mdn: M + 'Reference/Operators/yield'
  },

  // ---------------- Objekte ----------------
  {
    lang: 'js', group: O, name: 'Objekt-Literal', run: true,
    desc: 'Erzeugt ein Objekt direkt mit `{ schlüssel: wert }`.',
    details: 'Objekte sind Sammlungen von Schlüssel-Wert-Paaren; Werte können beliebige Typen inkl. Funktionen (Methoden) sein. Schlüssel sind Strings oder Symbole, Zahlen werden zu Strings. Das Objekt-Literal ist der übliche Weg für Konfigurationen und Datenstrukturen; Zugriff erfolgt über Punkt- oder Klammernotation.',
    syntax: 'const obj = {\n  schluessel: wert,\n  methode() { ... }\n};',
    example: 'const auto = {\n  marke: "VW",\n  baujahr: 2020,\n  "top speed": 200, // Schlüssel mit Leerzeichen in Anführungszeichen\n  fahre() { return `${this.marke} fährt`; }\n};\nconsole.log(auto.marke);       // → "VW"\nconsole.log(auto["top speed"]); // → 200\nconsole.log(auto.fahre());     // → "VW fährt"\n\nauto.farbe = "rot"; // Eigenschaft hinzufügen\ndelete auto.baujahr; // entfernen\nconsole.log(auto);',
    keywords: ['object literal', 'objekt erstellen', 'eigenschaften', 'properties', 'json'],
    related: ['Kurzschreibweise (Shorthand)', 'Punkt- vs. Klammernotation', 'Berechnete Schlüssel'], mdn: M + 'Reference/Operators/Object_initializer'
  },
  {
    lang: 'js', group: O, name: 'Kurzschreibweise (Shorthand)', run: true,
    desc: 'Verkürzte Notation für Eigenschaften und Methoden in Objekt-Literalen.',
    details: 'Heißt die Variable wie die Eigenschaft, genügt `{ name }` statt `{ name: name }`. Methoden schreibt man ohne `function`: `{ gruss() {} }`. Methoden in dieser Kurzform können `super` nutzen, sind aber keine Konstruktoren.',
    syntax: 'const obj = { a, b, methode() { ... } };',
    example: 'const name = "Tom";\nconst alter = 25;\n\nconst person = {\n  name,  // = name: name\n  alter, // = alter: alter\n  gruss() { return `Hi, ich bin ${this.name}`; }\n};\nconsole.log(person);         // → { name: "Tom", alter: 25, gruss: ƒ }\nconsole.log(person.gruss()); // → "Hi, ich bin Tom"',
    keywords: ['shorthand', 'property shorthand', 'method shorthand', 'kurzform'],
    related: ['Objekt-Literal', 'Berechnete Schlüssel', 'Destrukturierung (Objekt)'], mdn: M + 'Reference/Operators/Object_initializer#property_definitions'
  },
  {
    lang: 'js', group: O, name: 'Berechnete Schlüssel', run: true,
    desc: 'Eigenschaftsnamen zur Laufzeit aus einem Ausdruck in `[ ]` bilden.',
    details: 'Im Objekt-Literal steht der Ausdruck in eckigen Klammern; sein Ergebnis wird zum Schlüssel (String oder Symbol). Praktisch für dynamische Felder, Lookup-Objekte und Formular-Handler. Der Ausdruck wird einmal bei der Objekterzeugung ausgewertet.',
    syntax: 'const obj = { [ausdruck]: wert };',
    example: 'const feld = "email";\nconst nutzer = {\n  [feld]: "a@b.de",\n  [`${feld}Bestaetigt`]: false,\n  ["id_" + 1]: 99\n};\nconsole.log(nutzer); // → { email: "a@b.de", emailBestaetigt: false, id_1: 99 }\n\nfunction setze(key, value) {\n  return { [key]: value };\n}\nconsole.log(setze("farbe", "blau")); // → { farbe: "blau" }',
    keywords: ['computed property', 'dynamischer schlüssel', 'dynamic key'],
    related: ['Objekt-Literal', 'Punkt- vs. Klammernotation', 'Kurzschreibweise (Shorthand)'], mdn: M + 'Reference/Operators/Object_initializer#computed_property_names'
  },
  {
    lang: 'js', group: O, name: 'Punkt- vs. Klammernotation', run: true,
    desc: 'Zwei Wege, auf Eigenschaften zuzugreifen: `obj.key` und `obj["key"]`.',
    details: 'Die Punktnotation braucht einen festen, gültigen Bezeichner. Die Klammernotation akzeptiert beliebige Strings, Variablen und Ausdrücke, etwa Schlüssel mit Bindestrich oder Leerzeichen oder dynamische Namen. Nicht vorhandene Eigenschaften liefern `undefined`; für sichere Zugriffe auf Verschachteltes dient Optional Chaining.',
    syntax: 'obj.eigenschaft\nobj["eigenschaft"]\nobj[variable]',
    example: 'const produkt = { name: "Lampe", "preis-eur": 19.9 };\nconst key = "name";\n\nconsole.log(produkt.name);          // → "Lampe"\nconsole.log(produkt[key]);          // → "Lampe" (dynamisch)\nconsole.log(produkt["preis-eur"]);  // → 19.9 (Punkt geht hier nicht)\nconsole.log(produkt.gewicht);       // → undefined\nconsole.log(produkt.key);           // → undefined (sucht Eigenschaft "key"!)',
    tip: 'Häufiger Fehler: `obj.key` statt `obj[key]` bei Variablen.',
    keywords: ['property access', 'dot notation', 'bracket notation', 'zugriff'],
    related: ['Berechnete Schlüssel', 'Objekt-Literal', '?.'], mdn: M + 'Reference/Operators/Property_accessors'
  },
  {
    lang: 'js', group: O, name: 'Getter & Setter', run: true,
    desc: 'Eigenschaften, die beim Lesen oder Schreiben eine Funktion ausführen.',
    details: 'Mit `get` und `set` im Objekt-Literal wirken berechnete Werte wie normale Eigenschaften. Der Getter hat keine Parameter, der Setter genau einen; ohne Setter ist die Eigenschaft schreibgeschützt (im Strict Mode wirft eine Zuweisung einen Fehler). Getter und Setter sind keine eigenen Datenfelder, ihr Wert muss in einer anderen Eigenschaft liegen.',
    syntax: 'const obj = {\n  get name() { return ...; },\n  set name(wert) { ... }\n};',
    example: 'const kreis = {\n  radius: 2,\n  get flaeche() {\n    return +(Math.PI * this.radius ** 2).toFixed(2);\n  },\n  set durchmesser(d) {\n    this.radius = d / 2;\n  }\n};\nconsole.log(kreis.flaeche); // → 12.57\nkreis.durchmesser = 10;\nconsole.log(kreis.radius);  // → 5\nconsole.log(kreis.flaeche); // → 78.54',
    keywords: ['getter', 'setter', 'accessor', 'berechnete eigenschaft'],
    related: ['get / set (Klasse)', 'Object.defineProperty()'], mdn: M + 'Reference/Functions/get'
  },
  {
    lang: 'js', group: O, name: 'Object.keys()', run: true,
    desc: 'Liefert ein Array der eigenen, aufzählbaren Schlüssel eines Objekts.',
    details: 'Berücksichtigt nur eigene Eigenschaften (keine geerbten), nur String-Schlüssel und nur enumerable. Die Reihenfolge: ganzzahlige Schlüssel aufsteigend, danach Strings in Einfügereihenfolge. Praktisch für Iteration und zum Zählen von Eigenschaften.',
    syntax: 'Object.keys(obj)',
    example: 'const o = { b: 1, a: 2, 10: "x", 2: "y" };\nconsole.log(Object.keys(o)); // → ["2", "10", "b", "a"]\nconsole.log(Object.keys(o).length); // → 4\n\nObject.keys({ x: 1, y: 2 }).forEach(k => console.log(k)); // → x, y',
    keywords: ['schlüssel', 'keys', 'eigenschaften auflisten', 'iterieren'],
    related: ['Object.values()', 'Object.entries()', 'Object.hasOwn()'], mdn: M + 'Reference/Global_Objects/Object/keys'
  },
  {
    lang: 'js', group: O, name: 'Object.values()', run: true,
    desc: 'Liefert ein Array der Werte aller eigenen, aufzählbaren Eigenschaften.',
    details: 'Reihenfolge wie bei `Object.keys()`. Nützlich zum Aufsummieren oder Filtern von Werten. Geschachtelte Objekte werden nicht rekursiv aufgelöst; die Werte sind Referenzen.',
    syntax: 'Object.values(obj)',
    example: 'const preise = { apfel: 1.2, brot: 2.5, milch: 0.99 };\nconsole.log(Object.values(preise)); // → [1.2, 2.5, 0.99]\n\nconst summe = Object.values(preise).reduce((s, p) => s + p, 0);\nconsole.log(summe.toFixed(2)); // → "4.69"',
    keywords: ['werte', 'values', 'summieren'],
    related: ['Object.keys()', 'Object.entries()'], mdn: M + 'Reference/Global_Objects/Object/values'
  },
  {
    lang: 'js', group: O, name: 'Object.entries()', run: true,
    desc: 'Liefert ein Array aus `[Schlüssel, Wert]`-Paaren.',
    details: 'Ideal zum Iterieren mit Destrukturierung in `for...of` und zum Umwandeln eines Objekts in eine `Map` oder (zusammen mit `Object.fromEntries`) zum Transformieren von Objekten. Nur eigene, aufzählbare String-Schlüssel.',
    syntax: 'Object.entries(obj)',
    example: 'const note = { mathe: 1, deutsch: 2 };\n\nfor (const [fach, wert] of Object.entries(note)) {\n  console.log(`${fach}: ${wert}`); // → mathe: 1, deutsch: 2\n}\nconsole.log(Object.entries(note)); // → [["mathe", 1], ["deutsch", 2]]\nconsole.log(new Map(Object.entries(note)).get("mathe")); // → 1',
    keywords: ['paare', 'entries', 'schlüssel wert', 'iterieren', 'map'],
    related: ['Object.fromEntries()', 'Object.keys()', 'Object.values()'], mdn: M + 'Reference/Global_Objects/Object/entries'
  },
  {
    lang: 'js', group: O, name: 'Object.fromEntries()', run: true,
    desc: 'Baut aus `[Schlüssel, Wert]`-Paaren ein Objekt, Gegenstück zu `Object.entries()`.',
    details: 'Akzeptiert jedes Iterable von Paaren, also auch eine `Map`. Zusammen mit `entries` entsteht ein Muster zum Filtern oder Umbauen von Objekten. Bei doppelten Schlüsseln gewinnt das letzte Paar.',
    syntax: 'Object.fromEntries(iterable)',
    example: 'const preise = { apfel: 1, birne: 2, kiwi: 3 };\n\nconst teuer = Object.fromEntries(\n  Object.entries(preise).filter(([, p]) => p >= 2)\n);\nconsole.log(teuer); // → { birne: 2, kiwi: 3 }\n\nconst verdoppelt = Object.fromEntries(\n  Object.entries(preise).map(([k, v]) => [k, v * 2])\n);\nconsole.log(verdoppelt); // → { apfel: 2, birne: 4, kiwi: 6 }\n\nconsole.log(Object.fromEntries(new Map([["a", 1]]))); // → { a: 1 }',
    keywords: ['fromentries', 'objekt aus paaren', 'map zu objekt', 'filter objekt'],
    related: ['Object.entries()', 'Object.assign()'], mdn: M + 'Reference/Global_Objects/Object/fromEntries'
  },
  {
    lang: 'js', group: O, name: 'Object.assign()', run: true,
    desc: 'Kopiert eigene aufzählbare Eigenschaften von Quellobjekten in ein Zielobjekt.',
    details: 'Das Ziel (erstes Argument) wird verändert und zurückgegeben; spätere Quellen überschreiben frühere. Es kopiert nur flach, verschachtelte Objekte bleiben gemeinsame Referenzen. Für eine Kopie ohne Mutation `Object.assign({}, a, b)` oder den Spread `{ ...a, ...b }` nutzen.',
    syntax: 'Object.assign(ziel, quelle1, quelle2, ...)',
    example: 'const defaults = { laut: false, tempo: 1 };\nconst optionen = { tempo: 2 };\n\nconst conf = Object.assign({}, defaults, optionen);\nconsole.log(conf); // → { laut: false, tempo: 2 }\nconsole.log(defaults); // → unverändert\n\nconst ziel = { a: 1 };\nObject.assign(ziel, { b: 2 });\nconsole.log(ziel); // → { a: 1, b: 2 } (Ziel mutiert!)',
    tip: 'Ohne `{}` als Ziel wird das erste Objekt verändert.',
    keywords: ['merge', 'zusammenführen', 'kopieren', 'flache kopie', 'mutieren'],
    related: ['Referenz vs. Kopie', 'structuredClone()', '... (Spread)'], mdn: M + 'Reference/Global_Objects/Object/assign'
  },
  {
    lang: 'js', group: O, name: 'Object.freeze()', run: true,
    desc: 'Friert ein Objekt ein: keine Änderungen, Ergänzungen oder Löschungen mehr.',
    details: 'Das Einfrieren ist flach: verschachtelte Objekte bleiben veränderbar. Verbotene Schreibzugriffe schlagen im Sloppy Mode still fehl, im Strict Mode (und in Modulen) werfen sie einen `TypeError`. Mit `Object.isFrozen()` lässt sich der Zustand prüfen; rückgängig machen kann man ihn nicht.',
    syntax: 'Object.freeze(obj)',
    example: '"use strict";\nconst konfig = Object.freeze({ port: 80, db: { host: "lokal" } });\n\ntry {\n  konfig.port = 8080;\n} catch (e) {\n  console.log(e.name); // → TypeError\n}\nkonfig.db.host = "remote"; // verschachtelt: erlaubt!\nconsole.log(konfig.db.host);        // → "remote"\nconsole.log(Object.isFrozen(konfig)); // → true',
    keywords: ['einfrieren', 'immutable', 'unveränderlich', 'schreibschutz'],
    related: ['Object.seal()', 'Object.defineProperty()', 'Referenz vs. Kopie'], mdn: M + 'Reference/Global_Objects/Object/freeze'
  },
  {
    lang: 'js', group: O, name: 'Object.seal()', run: true,
    desc: 'Versiegelt ein Objekt: Werte änderbar, aber keine Eigenschaften hinzufügen oder löschen.',
    details: 'Bestehende Eigenschaften werden nicht konfigurierbar, ihre Werte bleiben jedoch (sofern beschreibbar) änderbar. Das ist eine mildere Variante von `freeze`. Verstöße werfen im Strict Mode einen `TypeError`. Auch hier ist die Wirkung flach.',
    syntax: 'Object.seal(obj)',
    example: '"use strict";\nconst nutzer = Object.seal({ name: "Eva" });\n\nnutzer.name = "Eve";           // erlaubt\nconsole.log(nutzer.name);      // → "Eve"\ntry {\n  nutzer.alter = 30;           // neu: verboten\n} catch (e) {\n  console.log(e.name);         // → TypeError\n}\ntry {\n  delete nutzer.name;          // löschen: verboten\n} catch (e) {\n  console.log(e.name);         // → TypeError\n}\nconsole.log(Object.isSealed(nutzer)); // → true',
    keywords: ['versiegeln', 'seal', 'isSealed', 'preventExtensions'],
    related: ['Object.freeze()', 'Object.defineProperty()'], mdn: M + 'Reference/Global_Objects/Object/seal'
  },
  {
    lang: 'js', group: O, name: 'Object.create()', run: true,
    desc: 'Erzeugt ein neues Objekt mit einem angegebenen Prototyp.',
    details: 'Das erste Argument wird der Prototyp des neuen Objekts; mit `null` entsteht ein Objekt ohne Prototyp (reine Dictionary). Das optionale zweite Argument nimmt Property-Deskriptoren wie `Object.defineProperties`. Damit lässt sich Vererbung ohne Klassen modellieren.',
    syntax: 'Object.create(proto, deskriptoren?)',
    example: 'const tier = {\n  laut() { return `${this.name} macht ${this.laut_}`; }\n};\nconst hund = Object.create(tier);\nhund.name = "Rex";\nhund.laut_ = "Wuff";\nconsole.log(hund.laut()); // → "Rex macht Wuff"\nconsole.log(Object.getPrototypeOf(hund) === tier); // → true\n\nconst dict = Object.create(null); // ohne toString & Co.\ndict.a = 1;\nconsole.log("toString" in dict); // → false',
    keywords: ['prototyp', 'vererbung', 'create', 'null prototype'],
    related: ['Prototypen & Prototypkette', 'extends', 'Object.defineProperty()'], mdn: M + 'Reference/Global_Objects/Object/create'
  },
  {
    lang: 'js', group: O, name: 'Object.defineProperty()', run: true,
    desc: 'Definiert oder ändert eine Eigenschaft mit genau festgelegten Attributen.',
    details: 'Über den Deskriptor steuert man `value`, `writable`, `enumerable`, `configurable` oder alternativ `get`/`set`. Beim Neuanlegen sind alle Flags standardmäßig `false` (anders als bei normaler Zuweisung). Nicht enumerierbare Eigenschaften erscheinen nicht in `Object.keys()`, `for...in` oder `JSON.stringify`.',
    syntax: 'Object.defineProperty(obj, "name", {\n  value, writable, enumerable, configurable\n  // oder get() {}, set(v) {}\n});',
    example: '"use strict";\nconst konto = { owner: "Ida" };\n\nObject.defineProperty(konto, "id", {\n  value: 42,\n  writable: false,\n  enumerable: false\n});\nconsole.log(konto.id);          // → 42\nconsole.log(Object.keys(konto)); // → ["owner"] (id nicht aufgezählt)\ntry {\n  konto.id = 1;\n} catch (e) {\n  console.log(e.name);          // → TypeError\n}\n\nObject.defineProperty(konto, "info", {\n  get() { return `${this.owner}#${this.id}`; },\n  enumerable: true\n});\nconsole.log(konto.info); // → "Ida#42"',
    keywords: ['deskriptor', 'property descriptor', 'writable', 'enumerable', 'configurable'],
    related: ['Getter & Setter', 'Object.freeze()', 'Object.create()'], mdn: M + 'Reference/Global_Objects/Object/defineProperty'
  },
  {
    lang: 'js', group: O, name: 'Object.hasOwn()', run: true,
    desc: 'Prüft, ob ein Objekt eine bestimmte Eigenschaft selbst besitzt (nicht geerbt).',
    details: 'Moderner, sicherer Ersatz für `obj.hasOwnProperty(key)`; funktioniert auch bei Objekten ohne Prototyp. Anders als der `in`-Operator ignoriert es die Prototypkette. Der Wert der Eigenschaft ist egal, auch `undefined` zählt als vorhanden.',
    syntax: 'Object.hasOwn(obj, "schluessel")',
    example: 'const o = { a: 1, b: undefined };\nconsole.log(Object.hasOwn(o, "a"));        // → true\nconsole.log(Object.hasOwn(o, "b"));        // → true (Wert undefined)\nconsole.log(Object.hasOwn(o, "c"));        // → false\nconsole.log(Object.hasOwn(o, "toString")); // → false (geerbt)\nconsole.log("toString" in o);              // → true',
    keywords: ['hasOwnProperty', 'eigene eigenschaft', 'vorhanden', 'in operator'],
    related: ['Object.keys()', 'Prototypen & Prototypkette'], mdn: M + 'Reference/Global_Objects/Object/hasOwn'
  },
  {
    lang: 'js', group: O, name: 'structuredClone()', run: true,
    desc: 'Erstellt eine tiefe Kopie eines Werts, inkl. verschachtelter Objekte.',
    details: 'Unterstützt u. a. Objekte, Arrays, `Date`, `Map`, `Set`, `RegExp` und zirkuläre Referenzen. Funktionen und DOM-Knoten sind nicht klonbar und lösen einen `DataCloneError` aus; Klasseninstanzen werden zu schlichten Objekten und verlieren ihren Prototyp. Besser als der Umweg über `JSON.parse(JSON.stringify())`, der `Date`, `undefined` und `Map` verfälscht.',
    syntax: 'structuredClone(wert)',
    example: 'const original = { name: "A", tags: ["x"], datum: new Date(0), m: new Map([[1, "eins"]]) };\nconst kopie = structuredClone(original);\n\nkopie.tags.push("y");\nconsole.log(original.tags);          // → ["x"] (unverändert)\nconsole.log(kopie.datum instanceof Date); // → true\nconsole.log(kopie.m.get(1));         // → "eins"\n\ntry {\n  structuredClone({ f() {} });\n} catch (e) {\n  console.log(e.name); // → DataCloneError\n}',
    keywords: ['deep copy', 'tiefe kopie', 'klonen', 'clone', 'deep clone'],
    related: ['Referenz vs. Kopie', 'Object.assign()'], mdn: 'https://developer.mozilla.org/de/docs/Web/API/Window/structuredClone'
  },
  {
    lang: 'js', group: O, name: 'Referenz vs. Kopie', run: true,
    desc: 'Objekte werden als Referenz zugewiesen; Kopien müssen explizit erstellt werden.',
    details: 'Primitive Werte (Zahl, String, Boolean …) werden bei Zuweisung kopiert, Objekte und Arrays dagegen nur als Verweis, sodass beide Variablen dasselbe Objekt ändern. Flache Kopien (Spread, `Object.assign`) duplizieren nur die oberste Ebene, tiefe Kopien erzeugt `structuredClone()`. Auch `===` vergleicht bei Objekten Identität, nicht Inhalt.',
    syntax: 'const kopieFlach = { ...obj };\nconst kopieTief = structuredClone(obj);',
    example: 'const a = { n: 1, sub: { x: 1 } };\nconst b = a;           // gleiche Referenz\nb.n = 2;\nconsole.log(a.n);      // → 2\n\nconst flach = { ...a };\nflach.sub.x = 99;      // sub wird geteilt!\nconsole.log(a.sub.x);  // → 99\n\nconst tief = structuredClone(a);\ntief.sub.x = 0;\nconsole.log(a.sub.x);  // → 99\n\nconsole.log({} === {}); // → false (verschiedene Objekte)\nlet s1 = "hi", s2 = s1; s2 = "ho";\nconsole.log(s1);       // → "hi" (Primitive werden kopiert)',
    keywords: ['reference', 'copy', 'shallow copy', 'deep copy', 'flache kopie', 'identität', 'mutation'],
    related: ['structuredClone()', 'Object.assign()', 'Object.freeze()'], mdn: 'https://developer.mozilla.org/de/docs/Glossary/Shallow_copy'
  },
  {
    lang: 'js', group: O, name: 'Prototypen & Prototypkette', run: true,
    desc: 'Objekte erben Eigenschaften über eine Kette von Prototypen.',
    details: 'Jedes Objekt hat einen internen Prototyp (`Object.getPrototypeOf(obj)`); fehlt eine Eigenschaft, sucht JavaScript in der Kette weiter bis `null`. Funktionen besitzen `.prototype`, das bei `new` zum Prototyp der Instanz wird. Klassen sind syntaktischer Zucker darüber. `__proto__` ist veraltet, besser `Object.getPrototypeOf`/`setPrototypeOf`.',
    syntax: 'Object.getPrototypeOf(obj)\nFunktion.prototype.methode = function () { ... };',
    example: 'function Tier(name) { this.name = name; }\nTier.prototype.hallo = function () { return `Ich bin ${this.name}`; };\n\nconst katze = new Tier("Mimi");\nconsole.log(katze.hallo()); // → "Ich bin Mimi"\nconsole.log(Object.hasOwn(katze, "hallo")); // → false (liegt im Prototyp)\nconsole.log(Object.getPrototypeOf(katze) === Tier.prototype); // → true\nconsole.log(Object.getPrototypeOf(Tier.prototype) === Object.prototype); // → true\nconsole.log(Object.getPrototypeOf(Object.prototype)); // → null (Ende der Kette)\nconsole.log(katze instanceof Tier); // → true',
    tip: 'Eingebaute Prototypen (z. B. `Array.prototype`) nicht verändern.',
    keywords: ['prototype', 'prototyp', 'vererbung', '__proto__', 'prototype chain', 'getPrototypeOf'],
    related: ['Object.create()', 'extends', 'Object.hasOwn()'], mdn: M + 'Inheritance_and_the_prototype_chain'
  },

  // ---------------- Klassen ----------------
  {
    lang: 'js', group: K, name: 'class', run: true,
    desc: 'Vorlage zum Erzeugen von Objekten mit gemeinsamen Eigenschaften und Methoden.',
    details: 'Klassen sind Syntax über dem Prototypen-System. Eine Klasse wird mit `new` instanziiert; ohne `new` gibt es einen `TypeError`. Anders als Funktionsdeklarationen werden Klassen nicht nutzbar gehoistet (Temporal Dead Zone), und der Klassenkörper läuft immer im Strict Mode.',
    syntax: 'class Name {\n  constructor() { ... }\n  methode() { ... }\n}\nconst instanz = new Name();',
    example: 'class Rechteck {\n  constructor(breite, hoehe) {\n    this.breite = breite;\n    this.hoehe = hoehe;\n  }\n  flaeche() {\n    return this.breite * this.hoehe;\n  }\n}\nconst r = new Rechteck(3, 4);\nconsole.log(r.flaeche());          // → 12\nconsole.log(r instanceof Rechteck); // → true\nconsole.log(typeof Rechteck);      // → "function"\n\ntry {\n  Rechteck(1, 1);\n} catch (e) {\n  console.log(e.name); // → TypeError (new fehlt)\n}',
    keywords: ['klasse', 'class', 'objektorientierung', 'oop', 'instanz', 'new'],
    related: ['constructor', 'Methoden', 'extends'], mdn: M + 'Reference/Classes'
  },
  {
    lang: 'js', group: K, name: 'constructor', run: true,
    desc: 'Spezielle Methode, die beim Erzeugen einer Instanz mit `new` ausgeführt wird.',
    details: 'Hier werden Instanzeigenschaften initialisiert. Eine Klasse hat höchstens einen `constructor`; fehlt er, wird ein leerer (bei `extends` ein durchreichender) angelegt. In abgeleiteten Klassen muss `super(...)` vor dem ersten Zugriff auf `this` aufgerufen werden.',
    syntax: 'class Name {\n  constructor(param) {\n    this.param = param;\n  }\n}',
    example: 'class Benutzer {\n  constructor(name, rolle = "gast") {\n    if (!name) throw new Error("Name fehlt");\n    this.name = name;\n    this.rolle = rolle;\n    this.erstellt = "heute";\n  }\n}\nconsole.log(new Benutzer("Jo"));          // → Benutzer { name: "Jo", rolle: "gast", ... }\nconsole.log(new Benutzer("Al", "admin").rolle); // → "admin"\ntry {\n  new Benutzer();\n} catch (e) {\n  console.log(e.message); // → "Name fehlt"\n}',
    keywords: ['konstruktor', 'initialisieren', 'new', 'instanz erzeugen'],
    related: ['class', 'super', 'Klassenfelder'], mdn: M + 'Reference/Classes/constructor'
  },
  {
    lang: 'js', group: K, name: 'Methoden', run: true,
    desc: 'Funktionen innerhalb einer Klasse, die auf dem Prototyp liegen und von Instanzen geteilt werden.',
    details: 'Methoden schreibt man ohne `function` und ohne Komma im Klassenkörper. Sie sind nicht aufzählbar und werden von allen Instanzen gemeinsam genutzt. Wird eine Methode als Callback ohne Kontext weitergegeben, geht `this` verloren; dann `bind` verwenden oder ein Klassenfeld mit Arrow Function nutzen.',
    syntax: 'class Name {\n  methode(param) { ... }\n}',
    example: 'class Zaehler {\n  wert = 0;\n  erhoehe() {\n    this.wert++;\n    return this; // Verkettung\n  }\n  zeige() {\n    return `Wert: ${this.wert}`;\n  }\n}\nconst z = new Zaehler();\nconsole.log(z.erhoehe().erhoehe().zeige()); // → "Wert: 2"\n\nconst lose = z.zeige;\ntry {\n  lose();\n} catch (e) {\n  console.log(e.name); // → TypeError (this verloren)\n}\nconsole.log(Object.hasOwn(z, "erhoehe")); // → false (auf Prototyp)',
    keywords: ['methode', 'klassenmethode', 'instanzmethode', 'method chaining'],
    related: ['class', 'static', 'this'], mdn: M + 'Reference/Classes/Public_class_fields#public_methods'
  },
  {
    lang: 'js', group: K, name: 'extends', run: true,
    desc: 'Lässt eine Klasse von einer anderen erben.',
    details: 'Die Unterklasse erbt Methoden und statische Member der Oberklasse über die Prototypkette. Sie kann Methoden überschreiben und mit `super` auf die Oberklasse zugreifen. Auch eingebaute Klassen wie `Error` oder `Array` lassen sich erweitern. Eine mehrfache Vererbung gibt es nicht, dafür Mixins.',
    syntax: 'class Kind extends Eltern {\n  constructor(...) {\n    super(...);\n  }\n}',
    example: 'class Tier {\n  constructor(name) { this.name = name; }\n  sprich() { return `${this.name} macht ein Geräusch`; }\n}\nclass Hund extends Tier {\n  sprich() { return `${this.name} bellt`; } // überschreiben\n}\nconst h = new Hund("Rex");\nconsole.log(h.sprich());          // → "Rex bellt"\nconsole.log(h instanceof Tier);   // → true\nconsole.log(Object.getPrototypeOf(Hund) === Tier); // → true\n\nclass MeinFehler extends Error {}\nconsole.log(new MeinFehler("x") instanceof Error); // → true',
    keywords: ['vererbung', 'inheritance', 'erben', 'unterklasse', 'subclass'],
    related: ['super', 'class', 'Mixins', 'Prototypen & Prototypkette'], mdn: M + 'Reference/Classes/extends'
  },
  {
    lang: 'js', group: K, name: 'super', run: true,
    desc: 'Greift auf den Konstruktor oder die Methoden der Oberklasse zu.',
    details: '`super(...)` ruft im Konstruktor einer abgeleiteten Klasse den Konstruktor der Oberklasse auf und muss vor jeder Verwendung von `this` stehen, sonst gibt es einen `ReferenceError`. `super.methode()` ruft die überschriebene Elternmethode auf. Auch in Objekt-Literal-Methoden verfügbar.',
    syntax: 'super(args);          // im constructor\nsuper.methode(args);  // in Methoden',
    example: 'class Form {\n  constructor(name) { this.name = name; }\n  beschreibe() { return `Form ${this.name}`; }\n}\nclass Kreis extends Form {\n  constructor(radius) {\n    super("Kreis"); // vor this!\n    this.radius = radius;\n  }\n  beschreibe() {\n    return `${super.beschreibe()} mit r=${this.radius}`;\n  }\n}\nconsole.log(new Kreis(2).beschreibe()); // → "Form Kreis mit r=2"\n\nclass Falsch extends Form {\n  constructor() { this.x = 1; super("x"); }\n}\ntry {\n  new Falsch();\n} catch (e) {\n  console.log(e.name); // → ReferenceError\n}',
    keywords: ['super', 'oberklasse', 'elternklasse', 'parent'],
    related: ['extends', 'constructor'], mdn: M + 'Reference/Operators/super'
  },
  {
    lang: 'js', group: K, name: 'static', run: true,
    desc: 'Definiert Methoden und Felder, die zur Klasse selbst gehören, nicht zur Instanz.',
    details: 'Statische Member werden direkt auf der Klasse aufgerufen (`Klasse.methode()`), nicht auf Instanzen. Typisch sind Hilfsfunktionen, Fabrikmethoden und gemeinsame Zähler. In statischen Methoden zeigt `this` auf die Klasse; statische Member werden an Unterklassen vererbt.',
    syntax: 'class Name {\n  static feld = wert;\n  static methode() { ... }\n}',
    example: 'class Punkt {\n  static anzahl = 0;\n  constructor(x, y) {\n    this.x = x; this.y = y;\n    Punkt.anzahl++;\n  }\n  static ursprung() { return new Punkt(0, 0); } // Fabrikmethode\n  static abstand(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }\n}\nconst p = new Punkt(3, 4);\nconsole.log(Punkt.abstand(p, Punkt.ursprung())); // → 5\nconsole.log(Punkt.anzahl);   // → 2\nconsole.log(p.abstand);      // → undefined (nicht auf Instanzen)',
    keywords: ['statisch', 'klassenmethode', 'static method', 'factory', 'fabrikmethode'],
    related: ['static-Block', 'Methoden', 'Klassenfelder'], mdn: M + 'Reference/Classes/static'
  },
  {
    lang: 'js', group: K, name: '#private Felder', run: true,
    desc: 'Mit `#` gekennzeichnete Felder und Methoden, nur innerhalb der Klasse zugreifbar.',
    details: 'Der Zugriff von außen ist ein Syntaxfehler, nicht nur eine Konvention wie der Unterstrich. Private Namen müssen im Klassenkörper deklariert sein. Mit `#name in obj` lässt sich prüfen, ob ein Objekt das private Feld besitzt. Auch private Methoden, Getter und statische Member sind möglich; Unterklassen sehen sie nicht.',
    syntax: 'class Name {\n  #geheim = 0;\n  #methode() { ... }\n}',
    example: 'class Konto {\n  #saldo = 0;\n  einzahlen(betrag) {\n    if (betrag <= 0) throw new RangeError("Betrag muss positiv sein");\n    this.#saldo += betrag;\n    return this;\n  }\n  get kontostand() { return this.#saldo; }\n  static istKonto(o) { return #saldo in o; }\n}\nconst k = new Konto().einzahlen(50);\nconsole.log(k.kontostand);      // → 50\nconsole.log(k.saldo);           // → undefined\nconsole.log(Konto.istKonto(k)); // → true\nconsole.log(Konto.istKonto({})); // → false\n// k.#saldo → SyntaxError (außerhalb der Klasse)',
    keywords: ['private', 'kapselung', 'hash', 'encapsulation', 'privat'],
    related: ['Klassenfelder', 'get / set (Klasse)', 'class'], mdn: M + 'Reference/Classes/Private_elements'
  },
  {
    lang: 'js', group: K, name: 'Klassenfelder', run: true,
    desc: 'Eigenschaften direkt im Klassenkörper deklarieren statt im Konstruktor.',
    details: 'Öffentliche Felder (`name = wert;`) werden pro Instanz beim Erzeugen angelegt, noch vor dem Konstruktorkörper (bzw. nach `super()`). Initialwerte werden für jede Instanz neu ausgewertet. Mit einer Arrow Function als Feld ist `this` fest an die Instanz gebunden, was bei Event-Handlern hilft, aber pro Instanz eine eigene Funktion erzeugt.',
    syntax: 'class Name {\n  feld = wert;\n  static sfeld = wert;\n  #privat = wert;\n  handler = () => { ... };\n}',
    example: 'class Todo {\n  titel;                   // undefined\n  erledigt = false;\n  tags = [];               // pro Instanz neu\n  id = Todo.#naechsteId++;\n  static #naechsteId = 1;\n  melde = () => `${this.titel} (#${this.id})`; // this gebunden\n\n  constructor(titel) { this.titel = titel; }\n}\nconst a = new Todo("Einkaufen");\nconst b = new Todo("Lernen");\na.tags.push("haus");\nconsole.log(b.tags);      // → []\nconst { melde } = a;\nconsole.log(melde());     // → "Einkaufen (#1)"\nconsole.log(b.id);        // → 2',
    keywords: ['class fields', 'eigenschaften', 'felder', 'instanzfelder', 'property'],
    related: ['#private Felder', 'constructor', 'static'], mdn: M + 'Reference/Classes/Public_class_fields'
  },
  {
    lang: 'js', group: K, name: 'get / set (Klasse)', run: true,
    desc: 'Getter und Setter in Klassen, die wie normale Eigenschaften genutzt werden.',
    details: 'Sie liegen auf dem Prototyp und eignen sich zur Validierung und für abgeleitete Werte. Ein Getter ohne Setter macht die Eigenschaft schreibgeschützt. Als Speicher dient meist ein privates Feld (`#wert`), damit Getter/Setter nicht sich selbst endlos aufrufen.',
    syntax: 'class Name {\n  #x;\n  get x() { return this.#x; }\n  set x(v) { this.#x = v; }\n}',
    example: 'class Temperatur {\n  #celsius = 0;\n  get celsius() { return this.#celsius; }\n  set celsius(c) {\n    if (c < -273.15) throw new RangeError("Unter dem absoluten Nullpunkt");\n    this.#celsius = c;\n  }\n  get fahrenheit() { return this.#celsius * 9 / 5 + 32; }\n}\nconst t = new Temperatur();\nt.celsius = 100;\nconsole.log(t.fahrenheit); // → 212\ntry {\n  t.celsius = -300;\n} catch (e) {\n  console.log(e.message); // → "Unter dem absoluten Nullpunkt"\n}\ntry {\n  t.fahrenheit = 0; // kein Setter\n} catch (e) {\n  console.log(e.name); // → TypeError (Strict Mode)\n}',
    keywords: ['getter', 'setter', 'accessor', 'validierung', 'berechnete eigenschaft'],
    related: ['Getter & Setter', '#private Felder', 'class'], mdn: M + 'Reference/Classes/Private_elements'
  },
  {
    lang: 'js', group: K, name: 'static-Block', run: true,
    desc: 'Block `static { }` zur komplexen Initialisierung statischer Member.',
    details: 'Der Block läuft einmal bei der Klassendefinition, in der Reihenfolge zusammen mit den statischen Feldern. Er hat Zugriff auf private Member der Klasse, `this` ist die Klasse. Sinnvoll, wenn die Initialisierung mehrere Anweisungen braucht, etwa `try/catch` oder Berechnungen.',
    syntax: 'class Name {\n  static {\n    // Initialisierungscode\n  }\n}',
    example: 'class Konfig {\n  static werte;\n  static #version = 3;\n\n  static {\n    const roh = "a=1;b=2";\n    this.werte = Object.fromEntries(\n      roh.split(";").map(p => p.split("="))\n    );\n    this.beschreibung = `v${Konfig.#version}`;\n  }\n}\nconsole.log(Konfig.werte);        // → { a: "1", b: "2" }\nconsole.log(Konfig.beschreibung); // → "v3"',
    keywords: ['static block', 'initialisierungsblock', 'klassen initialisierung'],
    related: ['static', 'Klassenfelder', '#private Felder'], mdn: M + 'Reference/Classes/Static_initialization_blocks'
  },
  {
    lang: 'js', group: K, name: 'Mixins', run: true,
    desc: 'Muster, um Verhalten aus mehreren Quellen in eine Klasse einzumischen.',
    details: 'JavaScript kennt nur Einfachvererbung. Ein Mixin ist üblicherweise eine Funktion, die eine Klasse nimmt und eine erweiterte Unterklasse zurückgibt (`Base => class extends Base { ... }`). Mehrere Mixins werden verschachtelt angewendet. Alternativ kopiert man Methoden per `Object.assign(Klasse.prototype, mixin)`, dann fehlt aber `super`-Unterstützung.',
    syntax: 'const MixinName = (Base) => class extends Base {\n  methode() { ... }\n};\nclass C extends MixinName(Basis) {}',
    example: 'const Schwimmer = (Base) => class extends Base {\n  schwimme() { return `${this.name} schwimmt`; }\n};\nconst Flieger = (Base) => class extends Base {\n  fliege() { return `${this.name} fliegt`; }\n};\n\nclass Tier {\n  constructor(name) { this.name = name; }\n}\nclass Ente extends Schwimmer(Flieger(Tier)) {}\n\nconst e = new Ente("Donald");\nconsole.log(e.schwimme()); // → "Donald schwimmt"\nconsole.log(e.fliege());   // → "Donald fliegt"\nconsole.log(e instanceof Tier); // → true\n\n// Variante: Methoden einfach kopieren\nconst Logger = { log(msg) { return `[${this.name}] ${msg}`; } };\nObject.assign(Tier.prototype, Logger);\nconsole.log(new Tier("X").log("hi")); // → "[X] hi"',
    keywords: ['mixin', 'mehrfachvererbung', 'komposition', 'multiple inheritance'],
    related: ['extends', 'super', 'Object.assign()'], mdn: M + 'Reference/Classes/extends#mix-ins'
  },

  // ---------------- Module ----------------
  {
    lang: 'js', group: D, name: 'import',
    desc: 'Lädt Exporte aus einem anderen ES-Modul.',
    details: 'Statische Imports stehen auf oberster Ebene und werden vor der Ausführung aufgelöst (gehoistet). Benannte Exporte importiert man in `{ }` (optional mit `as` umbenannt), den Default-Export ohne Klammern, alle als Namespace per `* as`. Importe sind read-only-Live-Bindings. Im Browser braucht das Skript `type="module"`, und Pfade müssen relativ (`./`) oder absolut sein inkl. Dateiendung.',
    syntax: 'import standard from "./modul.js";\nimport { a, b as c } from "./modul.js";\nimport * as ns from "./modul.js";\nimport "./seiteneffekt.js";',
    example: '// ===== mathe.js =====\nexport const PI = 3.14159;\nexport function addiere(a, b) { return a + b; }\nexport default function quadrat(x) { return x * x; }\n\n// ===== main.js =====\nimport quadrat, { PI, addiere as plus } from "./mathe.js";\nimport * as mathe from "./mathe.js";\n\nconsole.log(quadrat(3));      // → 9\nconsole.log(plus(1, 2), PI);  // → 3 3.14159\nconsole.log(mathe.addiere(2, 2)); // → 4\n\n// ===== index.html =====\n// <script type="module" src="./main.js"></script>',
    tip: 'Im Browser (ohne Bundler) die Dateiendung `.js` nicht weglassen.',
    keywords: ['importieren', 'es modules', 'esm', 'namespace import', 'module laden'],
    related: ['export', 'export default', 'import()', 'Module vs. Skripte'], mdn: M + 'Reference/Statements/import'
  },
  {
    lang: 'js', group: D, name: 'export',
    desc: 'Macht Variablen, Funktionen oder Klassen eines Moduls für andere verfügbar.',
    details: 'Benannte Exporte stehen direkt vor der Deklaration (`export const x`) oder gesammelt als `export { a, b as c }`. Mit `export ... from "..."` lassen sich Exporte anderer Module weiterreichen (Re-Export). Nicht exportierte Bezeichner bleiben modulprivat. Pro Modul sind beliebig viele benannte Exporte erlaubt.',
    syntax: 'export const x = 1;\nexport function f() {}\nexport { a, b as c };\nexport { x } from "./anderes.js";\nexport * from "./anderes.js";',
    example: '// ===== util.js =====\nconst geheim = 42;                // nicht exportiert → modulprivat\nexport const MWST = 0.19;\nexport function brutto(netto) { return netto * (1 + MWST); }\nexport class Rechner {}\nexport { geheim as antwort };     // umbenannt exportieren\n\n// ===== index.js (Sammelmodul) =====\nexport * from "./util.js";        // alle benannten Exporte weiterreichen\nexport { brutto as preis } from "./util.js";\n\n// ===== main.js =====\nimport { brutto, antwort } from "./index.js";\nconsole.log(brutto(100)); // → 119\nconsole.log(antwort);     // → 42',
    keywords: ['exportieren', 'named export', 're-export', 'benannter export', 'barrel'],
    related: ['import', 'export default', 'Module vs. Skripte'], mdn: M + 'Reference/Statements/export'
  },
  {
    lang: 'js', group: D, name: 'export default',
    desc: 'Legt den Standard-Export eines Moduls fest (pro Modul nur einer).',
    details: 'Der Import erfolgt ohne geschweifte Klammern und kann frei benannt werden. Das ist praktisch, wenn ein Modul genau eine Hauptsache liefert (Klasse, Komponente). Der freie Name erschwert aber Refactoring und Auto-Imports, deshalb bevorzugen viele Teams benannte Exporte. `export default` lässt sich mit benannten Exporten mischen.',
    syntax: 'export default ausdruck;\nexport default function () {}\nexport default class {}\nimport beliebigerName from "./modul.js";',
    example: '// ===== benutzer.js =====\nexport default class Benutzer {\n  constructor(name) { this.name = name; }\n}\nexport const ROLLEN = ["admin", "gast"];\n\n// ===== main.js =====\nimport Benutzer, { ROLLEN } from "./benutzer.js";\n// Name frei wählbar:\nimport User from "./benutzer.js";\n\nconsole.log(new Benutzer("Mo").name); // → "Mo"\nconsole.log(Benutzer === User);        // → true\nconsole.log(ROLLEN);                   // → ["admin", "gast"]',
    keywords: ['standard export', 'default export', 'default import', 'standardexport'],
    related: ['export', 'import', 'import()'], mdn: M + 'Reference/Statements/export#default_exports_versus_named_exports'
  },
  {
    lang: 'js', group: D, name: 'import()', run: true,
    desc: 'Dynamischer Import: lädt ein Modul zur Laufzeit und liefert ein Promise.',
    details: 'Im Gegensatz zu statischem `import` ist der Aufruf überall erlaubt (in Funktionen, Bedingungen) und der Pfad darf berechnet sein. Das Promise liefert das Namespace-Objekt, der Default-Export steckt unter `.default`. Typisch für Code-Splitting, Lazy Loading und optionale Features. Funktioniert auch in klassischen Skripten.',
    syntax: 'const modul = await import("./modul.js");\nimport("./modul.js").then(m => ...);',
    example: '// Läuft hier mit einem Data-URL-Modul, sonst z. B. import("./diagramm.js")\nconst code = "export const gruss = n => `Hallo ${n}`; export default 42;";\nconst url = "data:text/javascript," + encodeURIComponent(code);\n\nconst modul = await import(url);\nconsole.log(modul.gruss("Welt")); // → "Hallo Welt"\nconsole.log(modul.default);       // → 42\n\n// Typisches Muster: erst bei Bedarf laden\n// button.onclick = async () => {\n//   const { zeichne } = await import("./diagramm.js");\n//   zeichne();\n// };',
    keywords: ['dynamic import', 'lazy loading', 'code splitting', 'dynamisch laden', 'promise'],
    related: ['import', 'export default', 'Module vs. Skripte'], mdn: M + 'Reference/Operators/import'
  },
  {
    lang: 'js', group: D, name: 'import.meta',
    desc: 'Metadaten zum aktuellen Modul, z. B. dessen URL.',
    details: 'Nur in Modulen verfügbar (sonst Syntaxfehler). `import.meta.url` enthält die vollständige URL der Moduldatei und dient dazu, Pfade relativ zum Modul aufzulösen, z. B. `new URL("./daten.json", import.meta.url)`. Weitere Felder wie `resolve()` oder `dirname` hängen von der Umgebung (Browser, Node, Bundler) ab.',
    syntax: 'import.meta.url\nimport.meta.resolve("./datei.js")',
    example: 'console.log(typeof import.meta.url); // → "string"\n\n// Pfad relativ zum Modul auflösen (unabhängig vom Seiten-URL):\nconst bildUrl = new URL("./bild.png", import.meta.url);\nconsole.log(bildUrl.pathname.endsWith("bild.png")); // → true\n\n// Hauptmodul erkennen (Node.js): import.meta.url === `file://${process.argv[1]}`',
    keywords: ['import meta', 'modul url', 'metadaten', 'pfad auflösen'],
    related: ['import', 'import()', 'Module vs. Skripte'], mdn: M + 'Reference/Operators/import.meta'
  },
  {
    lang: 'js', group: D, name: 'Module vs. Skripte',
    desc: 'ES-Module unterscheiden sich von klassischen Skripten in Scope, Strict Mode und Laden.',
    details: 'Module werden mit `<script type="module">` (oder `.mjs`/`"type": "module"` in Node) geladen, haben ihren eigenen Scope statt globaler Variablen, laufen automatisch im Strict Mode und werden einmalig sowie deferred ausgeführt. In Modulen ist top-level `await` erlaubt und `this` auf oberster Ebene ist `undefined`. Browser holen Module per CORS, lokal über `file://` schlägt das fehl; ein kleiner Webserver ist nötig.',
    syntax: '<script type="module" src="main.js"></script>\n<script src="klassisch.js"></script>',
    example: '// ===== index.html =====\n// <script type="module" src="./app.js"></script>\n// <script src="./altes-skript.js"></script>   (klassisch)\n\n// ===== altes-skript.js (klassisch) =====\nvar global = "ich bin window.global";   // landet im globalen Scope\n\n// ===== app.js (Modul) =====\nconst privat = "nur in diesem Modul";    // kein window.privat\nconsole.log(window.privat);              // → undefined\nconsole.log(this);                       // → undefined\nconst daten = await fetch("./daten.json").then(r => r.json()); // top-level await\n\n// Unterschiede in Kürze:\n// Skript:  globaler Scope, Sloppy Mode, sofort/blockierend, kein import/export\n// Modul:   eigener Scope, Strict Mode, deferred, einmal geladen, import/export',
    tip: 'Lokal testen mit einem Server (z. B. `npx serve`), nicht per Doppelklick auf die HTML-Datei.',
    keywords: ['esm', 'commonjs', 'type module', 'scope', 'strict mode', 'defer', 'top-level await'],
    related: ['import', 'export', 'import()', 'import.meta'], mdn: M + 'Guide/Modules'
  }
  );
})();
