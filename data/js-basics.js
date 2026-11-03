window.CHEAT = window.CHEAT || [];
(function () {
  var M = 'https://developer.mozilla.org/de/docs/Web/JavaScript/';
  function mk(group) {
    return function (name, desc, details, syntax, example, o) {
      var e = { lang: 'js', group: group, name: name, desc: desc, details: details, syntax: syntax, example: example, run: true };
      for (var k in (o || {})) e[k] = o[k];
      window.CHEAT.push(e);
    };
  }

  // ---------------- JS-Grundlagen ----------------
  var a = mk('JS-Grundlagen');
  a('JavaScript einbinden',
    'Bindet JavaScript per script-Element inline oder als externe Datei in eine HTML-Seite ein.',
    'Mit `<script src="...">` lädst du eine externe Datei, ohne `src` schreibst du Code direkt zwischen die Tags. Ohne Attribut blockiert das Skript das Parsen der Seite; `defer` lädt parallel und führt nach dem Parsen in Reihenfolge aus, `async` führt sofort nach dem Laden aus (Reihenfolge unbestimmt). `type="module"` aktiviert ES-Module (`import`/`export`), ist automatisch deferred und läuft im Strict-Modus.',
    '<script src="datei.js" defer></script>\n<script type="module" src="main.js"></script>',
    '<!DOCTYPE html>\n<html lang="de">\n<head>\n  <meta charset="utf-8">\n  <title>Demo</title>\n  <!-- lädt parallel, läuft nach dem Parsen -->\n  <script src="app.js" defer></script>\n  <!-- ES-Modul: import/export möglich -->\n  <script type="module" src="main.js"></script>\n</head>\n<body>\n  <h1>Hallo</h1>\n  <script>\n    console.log("Inline-Skript");\n  </script>\n</body>\n</html>',
    { run: undefined, exampleLang: 'html',
      values: [['defer', 'Nach dem Parsen, in Dokumentreihenfolge (nur mit src)'], ['async', 'Sofort nach dem Laden, Reihenfolge unbestimmt'], ['type="module"', 'ES-Modul, implizit deferred, Strict-Modus'], ['nomodule', 'Nur für Browser ohne Modul-Unterstützung']],
      tip: 'Skripte mit `defer` am Ende von `<head>` sind meist besser als ein `<script>` vor `</body>`: Der Download startet früher.',
      keywords: ['script', 'einbinden', 'defer', 'async', 'module', 'extern', 'inline', 'include'],
      related: ["'use strict'", 'console.log()'], mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/script' });

  a('Kommentare',
    'Text, den die JavaScript-Engine ignoriert, für Erklärungen und zum Auskommentieren.',
    'Einzeilige Kommentare beginnen mit `//` und enden am Zeilenende. Blockkommentare stehen zwischen `/*` und `*/` und lassen sich nicht verschachteln. `/** ... */` ist die JSDoc-Konvention, die Editoren für Typ-Hinweise nutzen. Kommentiere das Warum, nicht das Was.',
    '// einzeilig\n/* mehrzeilig */\n/** JSDoc */',
    '// Einzeiliger Kommentar\nconst preis = 10; // Kommentar am Zeilenende\n\n/*\n  Mehrzeiliger Kommentar:\n  alles dazwischen wird ignoriert.\n*/\n\n/**\n * Berechnet den Bruttopreis.\n * @param {number} netto - Nettopreis\n * @returns {number}\n */\nconsole.log(preis * 1.19); // → 11.9',
    { keywords: ['comment', 'kommentieren', 'auskommentieren', 'jsdoc'], related: ['Anweisungen & Semikolons'], mdn: M + 'Reference/Lexical_grammar#kommentare' });

  a('Anweisungen & Semikolons',
    'Ein Programm besteht aus Anweisungen, die meist mit einem Semikolon enden.',
    'Anweisungen werden der Reihe nach ausgeführt; Semikolons trennen sie. Dank automatischer Semikolon-Einfügung (ASI) darf man sie oft weglassen, was aber Fallen birgt: Nach `return` mit Zeilenumbruch wird ein Semikolon eingefügt und der Wert geht verloren. Entscheide dich im Projekt für einen Stil und lass ihn per Linter/Prettier durchsetzen.',
    'anweisung1;\nanweisung2;',
    'const a = 1;\nconst b = 2; const c = 3; // mehrere in einer Zeile\n\nfunction falsch() {\n  return\n    42; // ASI: "return;" – 42 wird nie erreicht\n}\nfunction richtig() {\n  return 42;\n}\nconsole.log(falsch());  // → undefined\nconsole.log(richtig()); // → 42',
    { tip: 'Zeilen, die mit `(`, `[` oder einem Template-Literal beginnen, können ohne Semikolon in der Vorzeile hängen bleiben.',
      keywords: ['semicolon', 'asi', 'statement', 'zeilenende', 'automatic semicolon insertion'],
      related: ['Kommentare', "'use strict'"], mdn: M + 'Reference/Lexical_grammar#automatische_semikolon-einfügung' });

  a("'use strict'",
    'Aktiviert den Strict-Modus mit strengeren Regeln und mehr Fehlermeldungen.',
    'Die Direktive muss ganz am Anfang eines Skripts oder einer Funktion stehen. Der Strict-Modus verwandelt stille Fehler in Exceptions: Zuweisung an nicht deklarierte Variablen, doppelte Parameternamen oder Schreiben auf schreibgeschützte Eigenschaften. ES-Module und Klassenkörper sind automatisch strict, dort brauchst du die Direktive nicht.',
    '"use strict";',
    '"use strict";\n\ntry {\n  nichtDeklariert = 5; // ReferenceError im Strict-Modus\n} catch (e) {\n  console.log(e.name + ": " + e.message);\n}\n\nconst eingefroren = Object.freeze({ x: 1 });\ntry {\n  eingefroren.x = 2; // TypeError im Strict-Modus\n} catch (e) {\n  console.log(e.name); // → TypeError\n}',
    { keywords: ['strict mode', 'strikter modus', 'direktive', 'sloppy'], related: ['let', 'const', 'throw'], mdn: M + 'Reference/Strict_mode' });

  a('console.log()',
    'Gibt Werte in der Browser-Konsole aus – das wichtigste Debugging-Werkzeug.',
    '`console.log` akzeptiert beliebig viele Argumente und gibt sie getrennt aus. Daneben gibt es `console.error` und `console.warn` für Fehler und Warnungen sowie `console.table` für Arrays und Objekte in Tabellenform. Bei Objekten zeigt die Konsole oft den Zustand zum Zeitpunkt des Aufklappens, nicht zum Logzeitpunkt; mit `JSON.stringify` oder `structuredClone` bekommst du einen Schnappschuss.',
    'console.log(wert1, wert2, ...);\nconsole.error(msg);\nconsole.warn(msg);\nconsole.table(daten);',
    'const user = { name: "Ada", alter: 36 };\nconsole.log("Nutzer:", user);\nconsole.warn("Das ist eine Warnung");\nconsole.error("Das ist ein Fehler");\nconsole.table([\n  { id: 1, name: "Ada" },\n  { id: 2, name: "Linus" }\n]);\nconsole.log("%s ist %d Jahre alt", user.name, user.alter);',
    { values: [['console.log()', 'Normale Ausgabe'], ['console.info()', 'Information'], ['console.warn()', 'Warnung (gelb)'], ['console.error()', 'Fehler (rot)'], ['console.table()', 'Tabellenansicht für Arrays/Objekte'], ['console.group()', 'Gruppiert Ausgaben (mit groupEnd beenden)'], ['console.time()', 'Zeitmessung (mit timeEnd beenden)']],
      keywords: ['ausgabe', 'debug', 'print', 'konsole', 'console.table', 'console.error', 'console.warn'],
      related: ['JavaScript einbinden', 'Kommentare'], mdn: 'https://developer.mozilla.org/de/docs/Web/API/console/log_static' });

  // ---------------- Variablen & Datentypen ----------------
  var v = mk('Variablen & Datentypen');
  v('let',
    'Deklariert eine blockbezogene Variable, die neu zugewiesen werden darf.',
    '`let` ist block-scoped: Die Variable existiert nur im umgebenden `{ }`. Sie darf nicht doppelt im selben Scope deklariert werden und steht vor der Deklaration in der Temporal Dead Zone (Zugriff wirft einen `ReferenceError`). Nimm `let`, wenn sich der Wert ändert, sonst `const`.',
    'let name = wert;\nlet a, b = 2;',
    'let zaehler = 0;\nzaehler = zaehler + 1;\nconsole.log(zaehler); // → 1\n\nif (true) {\n  let innen = "nur im Block";\n  console.log(innen);\n}\ntry {\n  console.log(innen);\n} catch (e) {\n  console.log(e.name); // → ReferenceError\n}',
    { keywords: ['variable', 'deklaration', 'block scope', 'temporal dead zone', 'tdz'], related: ['const', 'var', 'Gültigkeitsbereich (Scope)', 'Hoisting'], mdn: M + 'Reference/Statements/let' });

  v('const',
    'Deklariert eine Konstante, die nicht neu zugewiesen werden kann.',
    '`const` verlangt einen Startwert und verbietet spätere Neuzuweisung. Es macht Objekte und Arrays aber nicht unveränderlich: Deren Inhalt darf sich ändern, nur die Bindung bleibt gleich. Für echte Unveränderlichkeit nutzt du `Object.freeze`. Standardmäßig `const` verwenden, `let` nur bei Bedarf.',
    'const name = wert;',
    'const PI = 3.14159;\ntry {\n  PI = 3; // Neuzuweisung verboten\n} catch (e) {\n  console.log(e.name); // → TypeError\n}\n\nconst liste = [1, 2];\nliste.push(3); // erlaubt: Inhalt ändert sich\nconsole.log(liste); // → [1, 2, 3]',
    { tip: 'Fehler wie `const x;` (ohne Wert) sind ein `SyntaxError`.',
      keywords: ['konstante', 'constant', 'unveränderlich', 'immutable'], related: ['let', 'var', 'Gültigkeitsbereich (Scope)'], mdn: M + 'Reference/Statements/const' });

  v('var',
    'Alte Variablendeklaration mit Funktions-Scope und Hoisting.',
    '`var` ist funktionsbezogen (nicht blockbezogen), wird an den Anfang der Funktion gehoben und mit `undefined` initialisiert und darf mehrfach deklariert werden. Das führt zu überraschendem Verhalten, etwa in Schleifen mit Closures. In neuem Code verwendest du `let` und `const`.',
    'var name = wert;',
    'if (true) {\n  var sichtbar = "auch außerhalb";\n}\nconsole.log(sichtbar); // → "auch außerhalb"\n\nconsole.log(gehoben); // → undefined (kein Fehler)\nvar gehoben = 5;\n\nvar x = 1;\nvar x = 2; // erneute Deklaration erlaubt\nconsole.log(x); // → 2',
    { keywords: ['variable', 'function scope', 'legacy', 'veraltet'], related: ['let', 'const', 'Hoisting', 'Gültigkeitsbereich (Scope)'], mdn: M + 'Reference/Statements/var' });

  v('Datentypen (Überblick)',
    'JavaScript kennt sieben primitive Typen und Objekte.',
    'Primitive Werte sind unveränderlich und werden per Wert kopiert: `string`, `number`, `bigint`, `boolean`, `undefined`, `null` und `symbol`. Alles andere (Objekte, Arrays, Funktionen, Datumswerte) sind Objekte und werden per Referenz übergeben. Variablen sind nicht typisiert, nur Werte haben einen Typ (dynamische Typisierung).',
    'typeof wert',
    'console.log(typeof "text");     // → "string"\nconsole.log(typeof 42);         // → "number"\nconsole.log(typeof 10n);        // → "bigint"\nconsole.log(typeof true);       // → "boolean"\nconsole.log(typeof undefined);  // → "undefined"\nconsole.log(typeof null);       // → "object" (historischer Fehler)\nconsole.log(typeof Symbol());   // → "symbol"\nconsole.log(typeof {});         // → "object"\nconsole.log(typeof function(){}); // → "function"',
    { values: [['string', 'Text'], ['number', 'Ganz- und Fließkommazahlen (64 Bit), NaN, Infinity'], ['bigint', 'Beliebig große Ganzzahlen'], ['boolean', 'true / false'], ['undefined', 'Kein Wert zugewiesen'], ['null', 'Absichtlich leer'], ['symbol', 'Eindeutiger Bezeichner'], ['object', 'Alles Übrige: Objekte, Arrays, Funktionen …']],
      keywords: ['typen', 'primitive', 'data types', 'datentyp', 'primitiv', 'referenz'], related: ['typeof', 'string', 'number', 'object'], mdn: M + 'Data_structures' });

  v('string',
    'Primitiver Datentyp für Text.',
    'Strings stehen in einfachen, doppelten Anführungszeichen oder als Template-Literal in Backticks, das Platzhalter `${...}` und Zeilenumbrüche erlaubt. Strings sind unveränderlich: Methoden liefern immer einen neuen String. Sie sind UTF-16-kodiert, daher kann `length` bei Emojis größer sein als die sichtbare Zeichenzahl.',
    '"text"  \'text\'  `text ${ausdruck}`',
    'const a = "doppelt";\nconst b = \'einfach\';\nconst name = "Welt";\nconst c = `Hallo ${name}!\nZweite Zeile`;\nconsole.log(c);\nconsole.log(a.length); // → 7\nconsole.log("a" + "b"); // → "ab"\nconsole.log("Zeichen: \\"zitat\\" und \\n Umbruch");',
    { values: [['\\n', 'Zeilenumbruch'], ['\\t', 'Tabulator'], ['\\\\', 'Backslash'], ['\\\'  \\"', 'Anführungszeichen'], ['\\u00e4', 'Unicode-Zeichen (ä)']],
      keywords: ['text', 'zeichenkette', 'template literal', 'template string', 'backtick'], related: ['Datentypen (Überblick)', 'Typumwandlung', 'typeof'], mdn: M + 'Reference/Global_Objects/String' });

  v('number',
    'Primitiver Datentyp für Ganz- und Fließkommazahlen (64-Bit-Double).',
    'Es gibt nur einen Zahlentyp nach IEEE 754. Das führt zu Rundungsfehlern wie `0.1 + 0.2 !== 0.3`; Geldbeträge rechnet man deshalb in Cent. Besondere Werte sind `NaN` (ungültige Rechnung, nicht gleich sich selbst, prüfe mit `Number.isNaN`) und `Infinity`. Ganzzahlen sind nur bis `Number.MAX_SAFE_INTEGER` exakt.',
    '42  3.14  1e3  0xFF  0b101  1_000_000',
    'console.log(0.1 + 0.2);            // → 0.30000000000000004\nconsole.log(0.1 + 0.2 === 0.3);    // → false\nconsole.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // → true\nconsole.log(1 / 0);                // → Infinity\nconsole.log(Number("abc"));        // → NaN\nconsole.log(NaN === NaN);          // → false\nconsole.log(Number.isNaN(NaN));    // → true\nconsole.log(Number.MAX_SAFE_INTEGER); // → 9007199254740991\nconsole.log(1_000_000, 0xFF, 0b101);  // → 1000000 255 5',
    { keywords: ['zahl', 'integer', 'float', 'nan', 'infinity', 'fließkomma', 'rundungsfehler'], related: ['bigint', 'Typumwandlung', 'Arithmetische Operatoren'], mdn: M + 'Reference/Global_Objects/Number' });

  v('bigint',
    'Primitiver Datentyp für beliebig große Ganzzahlen.',
    'BigInt-Literale enden auf `n`. Sie sprengen die sichere Ganzzahlgrenze von `number`, lassen sich aber nicht mit normalen Zahlen mischen (`TypeError`) und kennen keine Nachkommastellen. `Math`-Funktionen und `JSON.stringify` funktionieren nicht direkt mit BigInt. Konvertiere explizit mit `BigInt()` bzw. `Number()`.',
    '123n  BigInt(wert)',
    'const gross = 9007199254740991n + 2n;\nconsole.log(gross);          // → 9007199254740993n\nconsole.log(typeof gross);   // → "bigint"\nconsole.log(7n / 2n);        // → 3n (ganzzahlig)\nconsole.log(2n ** 64n);      // → 18446744073709551616n\ntry {\n  console.log(1n + 1);\n} catch (e) {\n  console.log(e.name);       // → TypeError\n}\nconsole.log(1n + BigInt(1)); // → 2n',
    { keywords: ['große zahlen', 'big integer', 'ganzzahl'], related: ['number', 'Typumwandlung'], mdn: M + 'Reference/Global_Objects/BigInt' });

  v('boolean',
    'Primitiver Datentyp mit den Werten true und false.',
    'Booleans entstehen aus Vergleichen und logischen Operatoren und steuern Bedingungen. In Bedingungen werden auch andere Werte automatisch als truthy oder falsy ausgewertet. Mit `Boolean(x)` oder `!!x` erzwingst du einen echten Boolean. Der String `"false"` ist truthy!',
    'true  false  Boolean(wert)',
    'const aktiv = true;\nconst istGross = 10 > 5;\nconsole.log(aktiv, istGross); // → true true\nconsole.log(Boolean(""));      // → false\nconsole.log(Boolean("false")); // → true (nicht leerer String)\nconsole.log(!!0);              // → false\nconsole.log(!!"text");         // → true',
    { keywords: ['wahrheitswert', 'bool', 'wahr', 'falsch', 'true', 'false'], related: ['Truthy & Falsy', '&&', '||', '!'], mdn: M + 'Reference/Global_Objects/Boolean' });

  v('undefined',
    'Wert einer Variable oder Eigenschaft, der nichts zugewiesen wurde.',
    '`undefined` liefern nicht initialisierte Variablen, fehlende Eigenschaften, nicht übergebene Parameter und Funktionen ohne `return`. Es bedeutet „nicht gesetzt“. Setze es nicht absichtlich als Wert, dafür gibt es `null`. Die Prüfung `typeof x === "undefined"` ist auch bei nicht deklarierten Variablen sicher.',
    'undefined',
    'let a;\nconsole.log(a);              // → undefined\nconst obj = { x: 1 };\nconsole.log(obj.y);          // → undefined\nfunction f() {}\nconsole.log(f());            // → undefined\nconsole.log(typeof nichtDa); // → "undefined" (kein Fehler)\nconsole.log(undefined == null);  // → true\nconsole.log(undefined === null); // → false',
    { keywords: ['nicht definiert', 'leer', 'fehlend'], related: ['null', 'typeof', '??', '?.'], mdn: M + 'Reference/Global_Objects/undefined' });

  v('null',
    'Primitiver Wert, der „absichtlich kein Wert“ bedeutet.',
    '`null` setzt du selbst, um eine Variable explizit zu leeren oder „kein Objekt“ zu markieren. Es ist nicht `undefined`, aber `null == undefined` ist `true`. `typeof null` liefert wegen eines historischen Fehlers `"object"`. Zugriff auf eine Eigenschaft von `null` wirft einen `TypeError`.',
    'null',
    'let auswahl = null; // bewusst leer\nconsole.log(auswahl);          // → null\nconsole.log(typeof null);      // → "object" (Altlast)\nconsole.log(null === undefined); // → false\nconsole.log(null == undefined);  // → true\ntry {\n  console.log(auswahl.name);\n} catch (e) {\n  console.log(e.name);         // → TypeError\n}\nconsole.log(auswahl?.name);    // → undefined',
    { keywords: ['leer', 'kein wert', 'nichts'], related: ['undefined', '?.', '??', 'typeof'], mdn: M + 'Reference/Operators/null' });

  v('symbol',
    'Primitiver Datentyp für garantiert eindeutige Bezeichner.',
    '`Symbol()` erzeugt bei jedem Aufruf einen neuen, einzigartigen Wert, auch mit gleicher Beschreibung. Symbole eignen sich als Objektschlüssel, die nicht mit anderen kollidieren und in `for...in` oder `Object.keys` nicht auftauchen. Mit `Symbol.for("key")` teilst du Symbole über eine globale Registry. Eingebaute well-known Symbols wie `Symbol.iterator` steuern Sprachverhalten.',
    'Symbol(beschreibung)\nSymbol.for(key)',
    'const s1 = Symbol("id");\nconst s2 = Symbol("id");\nconsole.log(s1 === s2);              // → false\nconsole.log(Symbol.for("a") === Symbol.for("a")); // → true\n\nconst user = { name: "Ada", [s1]: 123 };\nconsole.log(user[s1]);               // → 123\nconsole.log(Object.keys(user));      // → ["name"] (Symbol versteckt)\nconsole.log(s1.toString());          // → "Symbol(id)"\nconsole.log(s1.description);         // → "id"',
    { keywords: ['eindeutig', 'unique', 'schlüssel', 'iterator'], related: ['Datentypen (Überblick)', 'object', 'typeof'], mdn: M + 'Reference/Global_Objects/Symbol' });

  v('object',
    'Strukturierter Datentyp aus Schlüssel-Wert-Paaren; auch Arrays und Funktionen sind Objekte.',
    'Objekte entstehen als Literal `{ key: wert }`, Eigenschaften liest du mit Punkt- oder Klammer-Schreibweise. Im Gegensatz zu Primitiven werden sie per Referenz übergeben: Zwei Variablen können dasselbe Objekt sehen, und `===` vergleicht die Identität, nicht den Inhalt. Kopien legst du mit Spread `{...obj}` oder `structuredClone()` an (Spread ist nur flach).',
    'const obj = { key: wert, "anderer-key": 2 };',
    'const person = { name: "Ada", alter: 36 };\nconsole.log(person.name);       // → "Ada"\nconsole.log(person["alter"]);   // → 36\nperson.stadt = "London";        // hinzufügen\n\nconst alias = person;\nalias.name = "Grace";\nconsole.log(person.name);       // → "Grace" (gleiche Referenz)\nconsole.log({} === {});         // → false\n\nconst kopie = { ...person };\nkopie.name = "Linus";\nconsole.log(person.name);       // → "Grace"',
    { keywords: ['objekt', 'literal', 'eigenschaft', 'property', 'referenz', 'key value'], related: ['Datentypen (Überblick)', '... (Spread)', 'Destrukturierung (Objekt)', 'in', 'delete'], mdn: M + 'Reference/Global_Objects/Object' });

  v('typeof',
    'Liefert den Typ eines Wertes als String.',
    '`typeof` ist ein Operator, keine Funktion, und kann auch nicht deklarierte Variablen ohne Fehler prüfen. Beachte Sonderfälle: `typeof null` ist `"object"`, Arrays sind `"object"` (nutze `Array.isArray`), Funktionen ergeben `"function"`. `NaN` ist vom Typ `"number"`.',
    'typeof wert',
    'console.log(typeof 42);          // → "number"\nconsole.log(typeof "a");         // → "string"\nconsole.log(typeof true);        // → "boolean"\nconsole.log(typeof undefined);   // → "undefined"\nconsole.log(typeof null);        // → "object"\nconsole.log(typeof []);          // → "object"\nconsole.log(Array.isArray([]));  // → true\nconsole.log(typeof (() => 1));   // → "function"\nconsole.log(typeof NaN);         // → "number"\nconsole.log(typeof nirgendwo);   // → "undefined"',
    { values: [['"string"', 'Text'], ['"number"', 'Zahl (inkl. NaN)'], ['"bigint"', 'BigInt'], ['"boolean"', 'Wahrheitswert'], ['"undefined"', 'Nicht definiert'], ['"symbol"', 'Symbol'], ['"function"', 'Funktion'], ['"object"', 'Objekt, Array, null']],
      keywords: ['typ prüfen', 'type check', 'typprüfung'], related: ['Datentypen (Überblick)', 'instanceof', 'null'], mdn: M + 'Reference/Operators/typeof' });

  v('Typumwandlung',
    'Konvertiert Werte zwischen Typen, explizit oder automatisch (Coercion).',
    'Explizit wandelst du mit `String()`, `Number()`, `Boolean()`, `parseInt()` und `parseFloat()` um. Automatisch passiert es bei Operatoren: `+` mit einem String verkettet, alle anderen arithmetischen Operatoren wandeln in Zahlen. `Number("")` ist `0`, `Number("abc")` ist `NaN`, und `parseInt` liest bis zum ersten ungültigen Zeichen. Gib bei `parseInt` immer die Basis an.',
    'String(x)  Number(x)  Boolean(x)\nparseInt(s, 10)  parseFloat(s)',
    'console.log(Number("42"));       // → 42\nconsole.log(Number(""));         // → 0\nconsole.log(Number("12px"));     // → NaN\nconsole.log(parseInt("12px", 10)); // → 12\nconsole.log(parseFloat("3.14abc")); // → 3.14\nconsole.log(String(123) + 1);    // → "1231"\nconsole.log("5" + 3);            // → "53"\nconsole.log("5" - 3);            // → 2\nconsole.log(+"7");               // → 7\nconsole.log(Boolean("0"));       // → true',
    { values: [['String(x)', 'In Text umwandeln'], ['Number(x)', 'In Zahl umwandeln (streng, sonst NaN)'], ['parseInt(s, 10)', 'Ganzzahl am Textanfang lesen'], ['parseFloat(s)', 'Dezimalzahl am Textanfang lesen'], ['Boolean(x)', 'In true/false umwandeln'], ['+x', 'Kurzform für Number(x)']],
      tip: '`"5" + 3` ergibt `"53"`, `"5" - 3` dagegen `2`: `+` bevorzugt Verkettung.',
      keywords: ['coercion', 'type conversion', 'casting', 'konvertieren', 'parseint', 'parsefloat', 'number()', 'string()'], related: ['Truthy & Falsy', 'number', 'string', '== / !='], mdn: M + 'Data_structures#typumwandlung' });

  v('Truthy & Falsy',
    'Jeder Wert verhält sich in Bedingungen wie true oder false.',
    'In `if`, `&&`, `||`, `!` und `? :` wird jeder Wert zu einem Boolean umgewandelt. Genau acht Werte sind falsy, alles andere ist truthy – auch `"0"`, `"false"`, leere Arrays `[]` und leere Objekte `{}`. Brauchst du `0` oder `""` als gültige Werte, nimm `??` statt `||`.',
    'if (wert) { ... }',
    'const werte = [false, 0, -0, 0n, "", null, undefined, NaN, "0", [], {}, "false"];\nfor (const w of werte) {\n  console.log(String(typeof w === "bigint" ? w + "n" : JSON.stringify(w) ?? String(w)), "→", Boolean(w));\n}\n\nconst name = "";\nconsole.log(name || "Gast"); // → "Gast"\nconsole.log(name ?? "Gast"); // → ""',
    { values: [['false', 'falsy'], ['0, -0, 0n', 'falsy'], ['"" (leerer String)', 'falsy'], ['null', 'falsy'], ['undefined', 'falsy'], ['NaN', 'falsy'], ['document.all', 'falsy (Browser-Altlast)'], ['"0", "false", [], {}', 'truthy!']],
      keywords: ['falsy', 'truthy', 'bedingung', 'boolean coercion', 'wahr', 'falsch'], related: ['boolean', '||', '??', '!', '&&'], mdn: 'https://developer.mozilla.org/de/docs/Glossary/Truthy' });

  v('Gültigkeitsbereich (Scope)',
    'Bestimmt, wo eine Variable sichtbar und nutzbar ist.',
    'Es gibt globalen Scope, Funktions-Scope und Block-Scope (`let`/`const` in `{ }`). Innere Bereiche sehen die Variablen äußerer Bereiche (Scope-Kette), nie umgekehrt. Eine innere Variable gleichen Namens verdeckt die äußere (Shadowing). Funktionen merken sich ihren Entstehungs-Scope: das ist ein Closure.',
    '{ let x; }  function f() { var y; }',
    'const global = "außen";\nfunction f() {\n  const lokal = "in f";\n  if (true) {\n    const block = "im Block";\n    console.log(global, lokal, block);\n  }\n  // console.log(block); // ReferenceError\n}\nf();\n\nlet x = 1;\n{\n  let x = 2; // Shadowing\n  console.log(x); // → 2\n}\nconsole.log(x); // → 1\n\nfunction zaehler() {\n  let n = 0;\n  return () => ++n; // Closure\n}\nconst z = zaehler();\nz();\nconsole.log(z()); // → 2',
    { keywords: ['scope', 'sichtbarkeit', 'block scope', 'function scope', 'closure', 'shadowing', 'global'], related: ['let', 'const', 'var', 'Hoisting'], mdn: 'https://developer.mozilla.org/de/docs/Glossary/Scope' });

  v('Hoisting',
    'Deklarationen werden vor der Ausführung an den Anfang ihres Scopes „gehoben“.',
    'Funktionsdeklarationen sind vollständig nutzbar, bevor sie im Code stehen. `var` wird gehoben und mit `undefined` belegt. `let`, `const` und `class` sind zwar auch gehoben, stehen aber bis zur Deklaration in der Temporal Dead Zone: Zugriff wirft einen `ReferenceError`. Funktionsausdrücke (`const f = () => {}`) sind nicht vorab aufrufbar.',
    '// Deklarationen werden nach oben gezogen',
    'console.log(hallo());   // → "Hallo" (Funktionsdeklaration)\nfunction hallo() { return "Hallo"; }\n\nconsole.log(a);         // → undefined\nvar a = 1;\n\ntry {\n  console.log(b);\n} catch (e) {\n  console.log(e.name + ": " + e.message);\n}\nlet b = 2;\n\ntry {\n  f();\n} catch (e) {\n  console.log(e.name);   // → ReferenceError\n}\nconst f = () => 1;',
    { keywords: ['hoisting', 'temporal dead zone', 'tdz', 'heben'], related: ['var', 'let', 'const', 'Gültigkeitsbereich (Scope)'], mdn: 'https://developer.mozilla.org/de/docs/Glossary/Hoisting' });

  // ---------------- Operatoren ----------------
  var o = mk('Operatoren');
  o('Arithmetische Operatoren',
    'Rechenoperatoren: +, -, *, /, % und **.',
    '`+` addiert Zahlen, verkettet aber Strings. `/` liefert immer eine Fließkommazahl (kein Ganzzahl-Teilen), `%` den Rest mit dem Vorzeichen des linken Operanden. Division durch 0 ergibt `Infinity`, ungültige Rechnungen `NaN`. Für Ganzzahldivision nutzt du `Math.trunc(a / b)`.',
    'a + b   a - b   a * b   a / b   a % b   -a  +a',
    'console.log(7 + 2);   // → 9\nconsole.log(7 - 2);   // → 5\nconsole.log(7 * 2);   // → 14\nconsole.log(7 / 2);   // → 3.5\nconsole.log(7 % 2);   // → 1\nconsole.log(-7 % 3);  // → -1\nconsole.log(Math.trunc(7 / 2)); // → 3\nconsole.log("3" + 4); // → "34"\nconsole.log(1 / 0);   // → Infinity\nconsole.log(0 / 0);   // → NaN',
    { values: [['+', 'Addition / String-Verkettung'], ['-', 'Subtraktion'], ['*', 'Multiplikation'], ['/', 'Division'], ['%', 'Rest (Modulo)'], ['**', 'Potenz'], ['-x', 'Negation'], ['+x', 'Umwandlung in Zahl']],
      keywords: ['rechnen', 'plus', 'minus', 'modulo', 'rest', 'division', 'mathe', 'arithmetic'], related: ['**', 'Zuweisungsoperatoren', '++ / --', 'number', 'Operator-Rangfolge'], mdn: M + 'Reference/Operators#arithmetische_operatoren' });

  o('**',
    'Potenzoperator: a ** b ist a hoch b.',
    'Der Operator ist rechtsassoziativ: `2 ** 3 ** 2` ist `2 ** 9`. Ein negativer Operand links muss geklammert werden (`(-2) ** 2`), sonst gibt es einen `SyntaxError`. Er ersetzt `Math.pow()`, und mit BigInt funktioniert er ebenfalls.',
    'basis ** exponent',
    'console.log(2 ** 3);        // → 8\nconsole.log(2 ** 3 ** 2);    // → 512 (rechts zuerst)\nconsole.log((-2) ** 2);      // → 4\nconsole.log(9 ** 0.5);       // → 3 (Wurzel)\nconsole.log(2 ** -1);        // → 0.5\nlet x = 3;\nx **= 2;\nconsole.log(x);              // → 9\nconsole.log(Math.pow(2, 10)); // → 1024',
    { keywords: ['potenz', 'hoch', 'exponent', 'power', 'math.pow'], related: ['Arithmetische Operatoren', 'Zuweisungsoperatoren'], mdn: M + 'Reference/Operators/Exponentiation' });

  o('Zuweisungsoperatoren',
    'Weisen Variablen Werte zu, mit optionaler Rechenoperation.',
    '`=` weist zu und liefert den zugewiesenen Wert zurück, daher gehen Ketten wie `a = b = 0`. Kombinierte Operatoren wie `+=` kürzen `a = a + b` ab. Beachte den Unterschied zwischen `=` (Zuweisung) und `===` (Vergleich) in Bedingungen. Bei `+=` mit Strings wird verkettet.',
    'a = b   a += b   a -= b   a *= b   a /= b   a %= b   a **= b',
    'let x = 10;\nx += 5;  console.log(x); // → 15\nx -= 3;  console.log(x); // → 12\nx *= 2;  console.log(x); // → 24\nx /= 4;  console.log(x); // → 6\nx %= 4;  console.log(x); // → 2\nx **= 3; console.log(x); // → 8\n\nlet text = "Hallo";\ntext += " Welt";\nconsole.log(text);       // → "Hallo Welt"\n\nlet a, b;\na = b = 5;\nconsole.log(a, b);       // → 5 5',
    { values: [['=', 'Zuweisung'], ['+= -= *= /= %= **=', 'Rechnen und zuweisen'], ['<<= >>= >>>= &= |= ^=', 'Bitweise Varianten'], ['||= &&= ??=', 'Logische Zuweisung']],
      keywords: ['assignment', 'zuweisen', 'plus gleich', 'kurzschreibweise'], related: ['||= &&= ??=', 'Arithmetische Operatoren', '=== / !=='], mdn: M + 'Reference/Operators#zuweisungsoperatoren' });

  o('++ / --',
    'Erhöhen bzw. verringern eine Variable um 1.',
    'Als Postfix (`i++`) liefert der Ausdruck den alten Wert, als Präfix (`++i`) den neuen. Der Unterschied zählt nur, wenn das Ergebnis weiterverwendet wird. Standalone nutzt man meist die Postfix-Form, etwa in `for`-Schleifen. Der Operand muss eine Variable oder Eigenschaft sein.',
    'i++   ++i   i--   --i',
    'let i = 5;\nconsole.log(i++); // → 5 (alter Wert, danach i = 6)\nconsole.log(i);   // → 6\nconsole.log(++i); // → 7 (erst erhöhen, dann Wert)\nconsole.log(i--); // → 7\nconsole.log(--i); // → 5\n\nfor (let n = 0; n < 3; n++) {\n  console.log("Durchlauf", n);\n}',
    { keywords: ['inkrement', 'dekrement', 'increment', 'decrement', 'hochzählen', 'runterzählen'], related: ['Zuweisungsoperatoren', 'for', 'Arithmetische Operatoren'], mdn: M + 'Reference/Operators/Increment' });

  o('=== / !==',
    'Strikter Vergleich ohne Typumwandlung (Gleichheit / Ungleichheit).',
    '`===` ist nur `true`, wenn Typ und Wert übereinstimmen. Das ist der Standard-Vergleich in modernem JavaScript. Objekte, Arrays und Funktionen werden per Referenz verglichen, nicht nach Inhalt. `NaN === NaN` ist `false`; nutze `Number.isNaN()` oder `Object.is()`.',
    'a === b   a !== b',
    'console.log(1 === 1);        // → true\nconsole.log(1 === "1");      // → false\nconsole.log(null === undefined); // → false\nconsole.log(NaN === NaN);    // → false\nconsole.log(Object.is(NaN, NaN)); // → true\nconsole.log([1] === [1]);    // → false (andere Referenz)\n\nconst a = { x: 1 };\nconst b = a;\nconsole.log(a === b);        // → true\nconsole.log(1 !== 2);        // → true',
    { keywords: ['gleich', 'vergleich', 'strict equality', 'identisch', 'ungleich'], related: ['== / !=', '< > <= >=', 'object'], mdn: M + 'Reference/Operators/Strict_equality' });

  o('== / !=',
    'Loser Vergleich mit automatischer Typumwandlung.',
    '`==` wandelt die Operanden vor dem Vergleich um und liefert dadurch überraschende Ergebnisse, etwa `"" == 0` oder `"0" == false`. Verwende deshalb `===`. Die einzige weit akzeptierte Ausnahme ist `x == null`, was `null` und `undefined` zugleich abdeckt.',
    'a == b   a != b',
    'console.log(1 == "1");         // → true\nconsole.log(0 == "");          // → true\nconsole.log("0" == false);     // → true\nconsole.log(null == undefined);// → true\nconsole.log(null == 0);        // → false\nconsole.log([] == false);      // → true\nconsole.log(NaN == NaN);       // → false\n\nconst wert = undefined;\nconsole.log(wert == null);     // → true (null oder undefined)',
    { keywords: ['loser vergleich', 'loose equality', 'gleich', 'coercion'], related: ['=== / !==', 'Typumwandlung', 'Truthy & Falsy'], mdn: M + 'Reference/Operators/Equality' });

  o('< > <= >=',
    'Größenvergleiche für Zahlen und Strings.',
    'Zahlen werden numerisch verglichen, Strings lexikografisch nach UTF-16-Codeeinheiten (`"10" < "9"` ist `true`). Bei gemischten Typen wird in Zahlen umgewandelt; jeder Vergleich mit `NaN` ist `false`. Für sprachrichtiges Sortieren nutze `localeCompare`.',
    'a < b   a > b   a <= b   a >= b',
    'console.log(3 < 5);          // → true\nconsole.log(5 <= 5);         // → true\nconsole.log("a" < "b");      // → true\nconsole.log("10" < "9");     // → true (als Text)\nconsole.log(10 < 9);         // → false\nconsole.log("10" < 9);       // → false (Text wird Zahl)\nconsole.log(NaN < 1, NaN >= 1); // → false false\nconsole.log("ä".localeCompare("z", "de")); // → -1',
    { keywords: ['größer', 'kleiner', 'vergleich', 'comparison', 'relational'], related: ['=== / !==', 'number', 'string'], mdn: M + 'Reference/Operators#vergleichsoperatoren' });

  o('&&',
    'Logisches UND: liefert den ersten falsy Operanden, sonst den letzten.',
    'Der Operator arbeitet mit Kurzschlussauswertung: Ist die linke Seite falsy, wird die rechte gar nicht ausgewertet. Er gibt nicht zwingend einen Boolean zurück, sondern einen der Operanden. Das nutzt man für bedingte Ausführung und Guard-Ausdrücke.',
    'a && b',
    'console.log(true && false);   // → false\nconsole.log("a" && "b");      // → "b"\nconsole.log(0 && "b");        // → 0\nconsole.log("" && "b");       // → ""\n\nconst user = { name: "Ada" };\nconsole.log(user && user.name); // → "Ada"\n\nfunction log() { console.log("ausgeführt"); return true; }\nfalse && log(); // log() wird nicht aufgerufen\ntrue && log();  // → "ausgeführt"',
    { keywords: ['und', 'and', 'kurzschluss', 'short circuit', 'logisch'], related: ['||', '!', '??', 'Truthy & Falsy', '||= &&= ??='], mdn: M + 'Reference/Operators/Logical_AND' });

  o('||',
    'Logisches ODER: liefert den ersten truthy Operanden, sonst den letzten.',
    'Kurzschluss: Ist die linke Seite truthy, wird die rechte nicht ausgewertet. Häufig für Standardwerte genutzt, aber `0`, `""` und `false` werden dabei ebenfalls ersetzt. Wenn nur `null`/`undefined` ersetzt werden sollen, nimm `??`.',
    'a || b',
    'console.log(true || false);   // → true\nconsole.log("" || "Standard"); // → "Standard"\nconsole.log("Ada" || "Gast");  // → "Ada"\nconsole.log(0 || 10);          // → 10 (0 ist falsy!)\nconsole.log(0 ?? 10);          // → 0\n\nfunction gruss(name) {\n  name = name || "Gast";\n  return "Hallo " + name;\n}\nconsole.log(gruss());          // → "Hallo Gast"',
    { keywords: ['oder', 'or', 'standardwert', 'default', 'fallback', 'kurzschluss'], related: ['&&', '??', '!', 'Truthy & Falsy', '||= &&= ??='], mdn: M + 'Reference/Operators/Logical_OR' });

  o('!',
    'Logisches NICHT: kehrt die Wahrheit eines Werts um.',
    '`!` wandelt den Operanden in einen Boolean und negiert ihn. Doppelt (`!!x`) ist es eine kurze Form von `Boolean(x)`. Achte auf die hohe Rangfolge: `!a === b` heißt `(!a) === b`.',
    '!wert   !!wert',
    'console.log(!true);       // → false\nconsole.log(!0);          // → true\nconsole.log(!"text");     // → false\nconsole.log(!!"text");    // → true\nconsole.log(!!null);      // → false\n\nconst liste = [];\nif (!liste.length) {\n  console.log("Liste ist leer");\n}\nconsole.log(!1 === 0);    // → false (!1 ist false)',
    { keywords: ['nicht', 'not', 'negation', 'negieren', 'doppelte negation'], related: ['&&', '||', 'Truthy & Falsy', 'boolean'], mdn: M + 'Reference/Operators/Logical_NOT' });

  o('??',
    'Nullish Coalescing: liefert die rechte Seite nur bei null oder undefined.',
    'Im Gegensatz zu `||` bleiben `0`, `""`, `false` und `NaN` erhalten, nur `null` und `undefined` lösen den Fallback aus. Ideal für Standardwerte bei optionalen Einstellungen. Das Mischen mit `||` oder `&&` ohne Klammern ist ein `SyntaxError`.',
    'a ?? b',
    'console.log(null ?? "Standard");      // → "Standard"\nconsole.log(undefined ?? "Standard"); // → "Standard"\nconsole.log(0 ?? 10);                 // → 0\nconsole.log("" ?? "leer");            // → ""\nconsole.log(false ?? true);           // → false\n\nconst optionen = { laut: false, anzahl: 0 };\nconst laut = optionen.laut ?? true;\nconst anzahl = optionen.anzahl ?? 5;\nconsole.log(laut, anzahl);            // → false 0\nconsole.log((null ?? 0) || 7);        // → 7',
    { keywords: ['nullish', 'coalescing', 'standardwert', 'default', 'fallback'], related: ['||', '?.', '||= &&= ??=', 'null', 'undefined'], mdn: M + 'Reference/Operators/Nullish_coalescing' });

  o('?.',
    'Optional Chaining: greift sicher auf verschachtelte Eigenschaften zu.',
    'Ist der Wert links `null` oder `undefined`, bricht die Kette ab und liefert `undefined`, statt einen `TypeError` zu werfen. Es gibt drei Formen: `obj?.prop`, `obj?.[key]` und `fn?.()`. Setze es nur dort, wo Werte wirklich fehlen können, sonst versteckst du Fehler.',
    'obj?.eigenschaft   obj?.[key]   fn?.()',
    'const user = { name: "Ada", adresse: { stadt: "London" }, gruss() { return "Hi"; } };\nconsole.log(user?.adresse?.stadt);   // → "London"\nconsole.log(user?.konto?.nummer);    // → undefined\nconsole.log(user.hobbys?.[0]);       // → undefined\nconsole.log(user.gruss?.());         // → "Hi"\nconsole.log(user.tschuess?.());      // → undefined\n\nconst leer = null;\nconsole.log(leer?.name ?? "unbekannt"); // → "unbekannt"\ntry {\n  console.log(leer.name);\n} catch (e) {\n  console.log(e.name);               // → TypeError\n}',
    { keywords: ['optional chaining', 'sicherer zugriff', 'verkettung', 'null check'], related: ['??', 'null', 'undefined', 'in'], mdn: M + 'Reference/Operators/Optional_chaining' });

  o('||= &&= ??=',
    'Logische Zuweisungsoperatoren: weisen nur unter einer Bedingung zu.',
    '`a ||= b` weist zu, wenn `a` falsy ist; `a &&= b`, wenn `a` truthy ist; `a ??= b`, wenn `a` `null` oder `undefined` ist. Sie schließen kurz: Die Zuweisung (und damit ein Setter) läuft nur, wenn nötig. `??=` ist ideal, um fehlende Standardwerte zu ergänzen.',
    'a ||= b   a &&= b   a ??= b',
    'const opt = { titel: "", zahl: 0, name: null };\n\nopt.titel ||= "Ohne Titel";\nconsole.log(opt.titel);  // → "Ohne Titel"\n\nopt.zahl ??= 10;         // 0 ist nicht nullish\nconsole.log(opt.zahl);   // → 0\n\nopt.name ??= "Gast";\nconsole.log(opt.name);   // → "Gast"\n\nlet eingeloggt = true;\neingeloggt &&= false;\nconsole.log(eingeloggt); // → false',
    { keywords: ['logische zuweisung', 'logical assignment', 'default setzen'], related: ['??', '||', '&&', 'Zuweisungsoperatoren'], mdn: M + 'Reference/Operators/Logical_OR_assignment' });

  o('? : (Ternär)',
    'Bedingungsoperator: wählt abhängig von einer Bedingung einen von zwei Werten.',
    'Als einziger Operator mit drei Operanden ersetzt er kurze `if...else`-Zuweisungen. Weil er ein Ausdruck ist, kannst du ihn in Template-Literalen oder Argumenten nutzen. Verschachtelte Ternaries werden schnell unlesbar; nimm dann `if` oder `switch`.',
    'bedingung ? wertWennWahr : wertWennFalsch',
    'const alter = 20;\nconst status = alter >= 18 ? "erwachsen" : "minderjährig";\nconsole.log(status);   // → "erwachsen"\n\nconst n = 1;\nconsole.log(`${n} Datei${n === 1 ? "" : "en"}`); // → "1 Datei"\n\nconst note = 2;\nconst text = note === 1 ? "sehr gut" : note === 2 ? "gut" : "andere";\nconsole.log(text);     // → "gut"',
    { keywords: ['ternary', 'conditional', 'bedingungsoperator', 'inline if', 'fragezeichen'], related: ['if...else', '&&', '??'], mdn: M + 'Reference/Operators/Conditional_operator' });

  o('... (Spread)',
    'Entpackt Arrays, Strings oder Objekte in einzelne Elemente bzw. Eigenschaften.',
    'In Array-Literalen, Funktionsaufrufen und Objekt-Literalen kopiert oder verteilt `...` Inhalte. Bei Objekten gewinnt die spätere Eigenschaft, so lassen sich Defaults überschreiben. Die Kopie ist flach: Verschachtelte Objekte bleiben geteilt. Funktioniert bei Arrays mit allem Iterierbaren, bei Objekten nur mit eigenen aufzählbaren Eigenschaften.',
    '[...array]   {...objekt}   fn(...array)',
    'const a = [1, 2];\nconst b = [...a, 3, 4];\nconsole.log(b);                    // → [1, 2, 3, 4]\nconsole.log(Math.max(...b));       // → 4\nconsole.log([..."abc"]);           // → ["a", "b", "c"]\n\nconst basis = { farbe: "rot", groesse: "M" };\nconst neu = { ...basis, groesse: "L" };\nconsole.log(neu);                  // → { farbe: "rot", groesse: "L" }\n\nconst tief = { inner: { x: 1 } };\nconst kopie = { ...tief };\nkopie.inner.x = 99;\nconsole.log(tief.inner.x);         // → 99 (nur flache Kopie)',
    { keywords: ['spread', 'ausbreiten', 'kopieren', 'zusammenführen', 'merge', 'entpacken'], related: ['... (Rest)', 'Destrukturierung (Array)', 'Destrukturierung (Objekt)', 'object'], mdn: M + 'Reference/Operators/Spread_syntax' });

  o('... (Rest)',
    'Sammelt übrige Argumente oder Elemente in einem Array (bzw. Objekt).',
    'In Parameterlisten bündelt `...args` alle restlichen Argumente zu einem echten Array. In Destrukturierungen sammelt es den Rest. Der Rest-Teil muss immer an letzter Stelle stehen. Er ersetzt das veraltete `arguments`-Objekt.',
    'function f(a, ...rest) {}\nconst [x, ...rest] = array;\nconst { a, ...rest } = obj;',
    'function summe(...zahlen) {\n  return zahlen.reduce((s, z) => s + z, 0);\n}\nconsole.log(summe(1, 2, 3, 4)); // → 10\n\nfunction f(erstes, ...rest) {\n  console.log(erstes, rest);\n}\nf("a", "b", "c");               // → a ["b", "c"]\n\nconst [kopf, ...schwanz] = [1, 2, 3];\nconsole.log(kopf, schwanz);     // → 1 [2, 3]\n\nconst { id, ...ohneId } = { id: 7, x: 1, y: 2 };\nconsole.log(ohneId);            // → { x: 1, y: 2 }',
    { keywords: ['rest parameter', 'restparameter', 'sammeln', 'varargs', 'argumente'], related: ['... (Spread)', 'Destrukturierung (Array)', 'Destrukturierung (Objekt)'], mdn: M + 'Reference/Functions/rest_parameters' });

  o('Destrukturierung (Array)',
    'Entpackt Array-Elemente nach Position in einzelne Variablen.',
    'Links vom `=` steht ein Muster in `[ ]`. Elemente überspringst du mit Komma-Lücken, Standardwerte setzt du mit `= wert` (greifen nur bei `undefined`), den Rest sammelt `...rest`. Damit tauschst du Variablen ohne Hilfsvariable. Funktioniert mit jedem Iterierbaren, z. B. `Map`-Einträgen.',
    'const [a, b = 0, ...rest] = array;',
    'const [erstes, zweites] = ["a", "b", "c"];\nconsole.log(erstes, zweites);  // → a b\n\nconst [, , drittes] = [1, 2, 3];\nconsole.log(drittes);          // → 3\n\nconst [x = 10, y = 20] = [1];\nconsole.log(x, y);             // → 1 20\n\nlet p = 1, q = 2;\n[p, q] = [q, p];\nconsole.log(p, q);             // → 2 1\n\nfor (const [k, w] of Object.entries({ a: 1, b: 2 })) {\n  console.log(k, w);\n}',
    { keywords: ['destructuring', 'entpacken', 'array auspacken', 'swap', 'tauschen'], related: ['Destrukturierung (Objekt)', '... (Rest)', '... (Spread)', 'for...of'], mdn: M + 'Reference/Operators/Destructuring' });

  o('Destrukturierung (Objekt)',
    'Entpackt Objekteigenschaften nach Namen in Variablen.',
    'Das Muster `{ a, b }` liest die gleichnamigen Eigenschaften. Mit `a: neuerName` benennst du um, mit `= wert` setzt du Standardwerte, und verschachtelte Muster lesen tiefer. Auch in Funktionsparametern praktisch. Steht die Destrukturierung ohne `const`/`let` in einer Anweisung, musst du sie in Klammern setzen: `({ a } = obj);`.',
    'const { a, b: alias, c = 1 } = obj;',
    'const user = { name: "Ada", alter: 36, adresse: { stadt: "London" } };\nconst { name, alter } = user;\nconsole.log(name, alter);        // → Ada 36\n\nconst { name: vorname, rolle = "Gast" } = user;\nconsole.log(vorname, rolle);     // → Ada Gast\n\nconst { adresse: { stadt } } = user;\nconsole.log(stadt);              // → London\n\nfunction zeige({ name, alter = 0 }) {\n  console.log(`${name} (${alter})`);\n}\nzeige(user);                     // → Ada (36)\n\nlet a;\n({ a } = { a: 5 });\nconsole.log(a);                  // → 5',
    { keywords: ['destructuring', 'objekt auspacken', 'umbenennen', 'standardwert', 'parameter'], related: ['Destrukturierung (Array)', '... (Rest)', 'object', '?.'], mdn: M + 'Reference/Operators/Destructuring' });

  o('instanceof',
    'Prüft, ob ein Objekt von einer bestimmten Klasse bzw. einem Konstruktor abstammt.',
    'Der Operator durchsucht die Prototypenkette des Objekts nach `Konstruktor.prototype`. Für Primitive liefert er immer `false`. Über Frame-Grenzen hinweg (iframes) versagt er, dort nimmst du `Array.isArray` o. Ä. Bei eigenen Fehlerklassen ist er der Standard, um Fehler zu unterscheiden.',
    'objekt instanceof Konstruktor',
    'console.log([] instanceof Array);       // → true\nconsole.log([] instanceof Object);      // → true\nconsole.log(new Date() instanceof Date);// → true\nconsole.log("text" instanceof String);  // → false (primitiv)\n\nclass Tier {}\nclass Hund extends Tier {}\nconst h = new Hund();\nconsole.log(h instanceof Hund);         // → true\nconsole.log(h instanceof Tier);         // → true\n\ntry { null.x; } catch (e) {\n  console.log(e instanceof TypeError);   // → true\n}',
    { keywords: ['typprüfung', 'klasse', 'prototype', 'instanz'], related: ['typeof', 'in', 'Error-Typen', 'try...catch...finally'], mdn: M + 'Reference/Operators/instanceof' });

  o('in',
    'Prüft, ob ein Schlüssel in einem Objekt (inkl. Prototypenkette) existiert.',
    '`"key" in obj` ist `true`, auch wenn der Wert `undefined` ist, und findet geerbte Eigenschaften. Für nur eigene Eigenschaften nimmst du `Object.hasOwn(obj, "key")`. Bei Arrays prüft `in` Indizes, nicht Werte. Mit privaten Feldern (`#x in obj`) lässt sich außerdem die Klassenzugehörigkeit testen.',
    '"schluessel" in objekt',
    'const user = { name: "Ada", alter: undefined };\nconsole.log("name" in user);          // → true\nconsole.log("alter" in user);         // → true (obwohl undefined)\nconsole.log(user.alter !== undefined);// → false\nconsole.log("stadt" in user);         // → false\nconsole.log("toString" in user);      // → true (geerbt)\nconsole.log(Object.hasOwn(user, "toString")); // → false\n\nconsole.log(1 in ["a", "b"]);         // → true (Index 1)\nconsole.log("b" in ["a", "b"]);       // → false',
    { keywords: ['eigenschaft prüfen', 'key exists', 'hasownproperty', 'schlüssel vorhanden'], related: ['for...in', 'delete', 'object', '?.'], mdn: M + 'Reference/Operators/in' });

  o('delete',
    'Entfernt eine Eigenschaft aus einem Objekt.',
    '`delete obj.key` liefert `true`, wenn die Eigenschaft entfernt wurde (oder nicht existierte). Es löscht keine Variablen und gibt keinen Speicher direkt frei. Bei Arrays hinterlässt es ein Loch, die Länge bleibt gleich; verwende dort `splice`. In Strict-Modus führt das Löschen nicht löschbarer Eigenschaften zu einem `TypeError`.',
    'delete objekt.eigenschaft\ndelete objekt["key"]',
    'const user = { name: "Ada", passwort: "geheim" };\nconsole.log(delete user.passwort); // → true\nconsole.log(user);                 // → { name: "Ada" }\nconsole.log("passwort" in user);   // → false\n\nconst arr = [1, 2, 3];\ndelete arr[1];\nconsole.log(arr, arr.length);      // → [1, <1 empty item>, 3] 3\n\nconst fest = Object.freeze({ x: 1 });\ntry {\n  delete fest.x;\n} catch (e) {\n  console.log(e.name);               // → TypeError\n}',
    { tip: 'Um Eigenschaften ohne Mutation zu entfernen, nutze Rest: `const { passwort, ...rest } = user;`.',
      keywords: ['löschen', 'entfernen', 'eigenschaft löschen', 'remove property'], related: ['in', 'object', '... (Rest)'], mdn: M + 'Reference/Operators/delete' });

  o('void',
    'Wertet einen Ausdruck aus und liefert immer undefined.',
    'Selten gebraucht. Typische Anwendungen sind `void 0` als sicheres `undefined` in altem Code, das bewusste Verwerfen eines Rückgabewerts (z. B. bei einem Promise im Linter) und `javascript:void(0)` in alten Links. In modernem Code ist `undefined` einfacher.',
    'void ausdruck',
    'console.log(void 0);          // → undefined\nconsole.log(void "text");     // → undefined\n\nlet zaehler = 0;\nconst r = void zaehler++;     // Ausdruck wird ausgewertet\nconsole.log(r, zaehler);      // → undefined 1\n\nconst f = () => void console.log("Seiteneffekt");\nconsole.log(f());             // → undefined',
    { keywords: ['undefined erzwingen', 'void 0'], related: ['undefined', 'typeof', 'Komma-Operator'], mdn: M + 'Reference/Operators/void' });

  o('Komma-Operator',
    'Wertet mehrere Ausdrücke von links nach rechts aus und liefert den letzten.',
    'Nicht zu verwechseln mit dem Komma in Parameterlisten, Arrays oder Deklarationen. Der Operator taucht vor allem im Kopf von `for`-Schleifen auf, um mehrere Variablen zu bewegen. Sonst wirkt er schnell kryptisch und sollte vermieden werden.',
    'ausdruck1, ausdruck2, ...',
    'const x = (1, 2, 3);\nconsole.log(x);                // → 3\n\nfor (let i = 0, j = 10; i < j; i += 3, j -= 3) {\n  console.log(i, j);           // → 0 10 / 3 7\n}\n\nlet a = 0;\nconst ergebnis = (a++, a++, a);\nconsole.log(ergebnis);         // → 2',
    { keywords: ['comma operator', 'mehrere ausdrücke'], related: ['for', 'void', 'Operator-Rangfolge'], mdn: M + 'Reference/Operators/Comma_operator' });

  o('Bitweise Operatoren',
    'Arbeiten auf der Binärdarstellung von 32-Bit-Ganzzahlen.',
    'Operanden werden zu vorzeichenbehafteten 32-Bit-Ganzzahlen umgewandelt, Nachkommastellen fallen weg. Typische Einsatzgebiete sind Flags/Bitmasken, schnelles Abschneiden (`x | 0`) und Prüfen auf gerade/ungerade (`x & 1`). Verwechsle `&` und `|` nicht mit `&&` und `||`.',
    'a & b   a | b   a ^ b   ~a   a << n   a >> n   a >>> n',
    'console.log(5 & 3);    // → 1   (101 & 011 = 001)\nconsole.log(5 | 3);    // → 7   (111)\nconsole.log(5 ^ 3);    // → 6   (110)\nconsole.log(~5);       // → -6\nconsole.log(1 << 3);   // → 8\nconsole.log(-16 >> 2); // → -4\nconsole.log(-1 >>> 0); // → 4294967295\nconsole.log(7.9 | 0);  // → 7\nconsole.log(9 & 1);    // → 1 (ungerade)\n\nconst LESEN = 1, SCHREIBEN = 2;\nlet recht = LESEN | SCHREIBEN;\nconsole.log((recht & SCHREIBEN) !== 0); // → true\nconsole.log((5).toString(2));           // → "101"',
    { values: [['&', 'UND'], ['|', 'ODER'], ['^', 'Exklusiv-ODER (XOR)'], ['~', 'NICHT (Bits invertieren)'], ['<<', 'Linksverschiebung'], ['>>', 'Rechtsverschiebung mit Vorzeichen'], ['>>>', 'Rechtsverschiebung ohne Vorzeichen']],
      keywords: ['bit', 'binär', 'bitmaske', 'flags', 'shift', 'xor', 'bitwise'], related: ['&&', '||', 'Zuweisungsoperatoren', 'number'], mdn: M + 'Reference/Operators#bitweise_operatoren' });

  o('Operator-Rangfolge',
    'Legt fest, in welcher Reihenfolge Operatoren ausgewertet werden.',
    'Operatoren mit höherer Priorität binden stärker (`*` vor `+`). Bei gleicher Priorität entscheidet die Assoziativität, meist links nach rechts, bei `**`, Zuweisung und Ternär rechts nach links. Klammern `( )` überstimmen alles; setze sie großzügig für Lesbarkeit. `??` darf nicht ohne Klammern mit `||`/`&&` gemischt werden.',
    '( )  >  ! ++ --  >  **  >  * / %  >  + -  >  < >  >  === !==  >  &&  >  ||  >  ? :  >  =',
    'console.log(2 + 3 * 4);       // → 14\nconsole.log((2 + 3) * 4);     // → 20\nconsole.log(2 ** 3 ** 2);     // → 512\nconsole.log(true || false && false); // → true (&& vor ||)\nconsole.log(!true === false); // → true\nconsole.log(1 + 2 + "3");     // → "33"\nconsole.log("1" + 2 + 3);     // → "123"\n\nlet a, b;\na = b = 3;                    // rechts nach links\nconsole.log(a, b);            // → 3 3',
    { values: [['( )', 'Gruppierung'], ['. [] ?. ()', 'Zugriff / Aufruf'], ['! ~ + - typeof ++ --', 'Unär'], ['**', 'Potenz'], ['* / %', 'Multiplikativ'], ['+ -', 'Additiv'], ['< <= > >= in instanceof', 'Relational'], ['=== !== == !=', 'Gleichheit'], ['&&', 'Logisches UND'], ['|| ??', 'Logisches ODER / Nullish'], ['? :', 'Ternär'], ['= += …', 'Zuweisung'], [',', 'Komma']],
      keywords: ['priorität', 'precedence', 'reihenfolge', 'klammern', 'assoziativität'], related: ['Arithmetische Operatoren', '&&', '||', '**', '? : (Ternär)'], mdn: M + 'Reference/Operators/Operator_precedence' });

  // ---------------- Kontrollfluss ----------------
  var k = mk('Kontrollfluss');
  k('if...else',
    'Führt Code abhängig von einer Bedingung aus.',
    'Die Bedingung in Klammern wird auf truthy/falsy geprüft. Mit `else if` verkettest du Fälle, `else` fängt den Rest ab. Auch einzeilige Anweisungen sollten in `{ }` stehen, um Fehler beim Erweitern zu vermeiden. Frühe `return`s (Guard Clauses) halten Verschachtelung flach.',
    'if (bedingung) {\n  ...\n} else if (andere) {\n  ...\n} else {\n  ...\n}',
    'const punkte = 72;\nif (punkte >= 90) {\n  console.log("sehr gut");\n} else if (punkte >= 70) {\n  console.log("gut");       // → "gut"\n} else {\n  console.log("bestanden oder schlechter");\n}\n\nfunction teile(a, b) {\n  if (b === 0) return null;  // Guard Clause\n  return a / b;\n}\nconsole.log(teile(6, 3), teile(1, 0)); // → 2 null',
    { keywords: ['bedingung', 'verzweigung', 'wenn dann', 'condition', 'else if'], related: ['? : (Ternär)', 'switch', 'Truthy & Falsy', '&&'], mdn: M + 'Reference/Statements/if...else' });

  k('switch',
    'Wählt anhand eines Werts einen von mehreren Fällen aus.',
    'Der Ausdruck wird mit `case`-Werten per strikter Gleichheit (`===`) verglichen. Ohne `break` läuft die Ausführung in den nächsten Fall durch (Fall-through), was Absicht oder Fehler sein kann. `default` greift, wenn kein Fall passt. Variablen mit `let`/`const` in einem `case` brauchen einen eigenen Block `{ }`.',
    'switch (ausdruck) {\n  case wert1:\n    ...\n    break;\n  default:\n    ...\n}',
    'const tag = 3;\nswitch (tag) {\n  case 1:\n    console.log("Montag");\n    break;\n  case 2:\n    console.log("Dienstag");\n    break;\n  case 3:\n  case 4: // Fall-through: gleiche Behandlung\n    console.log("Mitte der Woche"); // → ausgeführt\n    break;\n  default:\n    console.log("anderer Tag");\n}\n\nconst art = "x";\nswitch (true) {\n  case art === "x": {\n    const lokal = 1;\n    console.log("Muster", lokal);\n    break;\n  }\n}',
    { keywords: ['fallunterscheidung', 'case', 'default', 'fall-through', 'mehrfachauswahl'], related: ['if...else', 'break', '=== / !=='], mdn: M + 'Reference/Statements/switch' });

  k('for',
    'Klassische Zählschleife mit Initialisierung, Bedingung und Schritt.',
    'Der Kopf besteht aus drei Teilen: Start, Bedingung vor jedem Durchlauf, Schritt nach jedem Durchlauf. Mit `let` bekommt jeder Durchlauf eine eigene Variable, wichtig bei Closures. Vorsicht vor Off-by-one-Fehlern (`<` vs. `<=`). Zum reinen Durchlaufen von Arrays ist `for...of` oft lesbarer.',
    'for (let i = 0; i < n; i++) {\n  ...\n}',
    'for (let i = 0; i < 3; i++) {\n  console.log("i =", i);   // 0, 1, 2\n}\n\nconst farben = ["rot", "grün", "blau"];\nfor (let i = 0; i < farben.length; i++) {\n  console.log(i, farben[i]);\n}\n\nfor (let i = 10; i > 0; i -= 4) {\n  console.log(i);          // 10, 6, 2\n}\n\nconst fns = [];\nfor (let i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map(f => f())); // → [0, 1, 2]',
    { keywords: ['schleife', 'loop', 'zählschleife', 'iteration', 'wiederholung'], related: ['for...of', 'while', 'break', 'continue', '++ / --'], mdn: M + 'Reference/Statements/for' });

  k('for...of',
    'Iteriert über die Werte eines iterierbaren Objekts.',
    'Funktioniert mit Arrays, Strings, `Map`, `Set`, `NodeList` und allem, was `Symbol.iterator` implementiert, nicht aber mit einfachen Objekten. `break`, `continue` und `return` sind erlaubt. Für Index und Wert zusammen nutzt du `array.entries()`, für Objekte `Object.entries(obj)`.',
    'for (const element of iterierbar) {\n  ...\n}',
    'for (const farbe of ["rot", "grün"]) {\n  console.log(farbe);\n}\nfor (const zeichen of "Hi!") {\n  console.log(zeichen);          // H, i, !\n}\nfor (const [i, wert] of ["a", "b"].entries()) {\n  console.log(i, wert);          // 0 a / 1 b\n}\nconst preise = { apfel: 1, birne: 2 };\nfor (const [name, preis] of Object.entries(preise)) {\n  console.log(name, preis);\n}\nconst menge = new Set([1, 1, 2]);\nfor (const x of menge) console.log(x); // 1, 2\ntry {\n  for (const x of {}) {}\n} catch (e) {\n  console.log(e.name);           // → TypeError\n}',
    { keywords: ['iterieren', 'array durchlaufen', 'iterator', 'foreach', 'schleife'], related: ['for...in', 'for', 'Destrukturierung (Array)', 'break', 'continue'], mdn: M + 'Reference/Statements/for...of' });

  k('for...in',
    'Iteriert über die aufzählbaren Schlüssel eines Objekts.',
    'Durchläuft String-Schlüssel, auch geerbte aufzählbare Eigenschaften, und die Reihenfolge ist bei Nicht-Integer-Schlüsseln die Einfügereihenfolge. Auf Arrays ist es fehleranfällig (Schlüssel sind Strings, geerbte Eigenschaften), dort nimmst du `for...of`. Für nur eigene Eigenschaften sind `Object.keys()`/`Object.entries()` die bessere Wahl.',
    'for (const schluessel in objekt) {\n  ...\n}',
    'const auto = { marke: "VW", baujahr: 2020 };\nfor (const key in auto) {\n  console.log(key, auto[key]);\n}\n\nfor (const i in ["a", "b"]) {\n  console.log(i, typeof i); // → "0" "string"\n}\n\nconst kind = Object.create({ geerbt: 1 });\nkind.eigen = 2;\nfor (const k in kind) {\n  console.log(k, Object.hasOwn(kind, k)); // eigen true / geerbt false\n}',
    { keywords: ['objekt durchlaufen', 'schlüssel', 'keys', 'properties', 'iterieren'], related: ['for...of', 'in', 'object'], mdn: M + 'Reference/Statements/for...in' });

  k('while',
    'Wiederholt Code, solange die Bedingung wahr ist.',
    'Die Bedingung wird vor jedem Durchlauf geprüft; ist sie von Anfang an falsch, läuft der Block nie. Geeignet, wenn die Zahl der Durchläufe vorab unbekannt ist. Achte darauf, dass sich im Block etwas ändert, sonst entsteht eine Endlosschleife, die den Tab einfriert.',
    'while (bedingung) {\n  ...\n}',
    'let n = 3;\nwhile (n > 0) {\n  console.log("noch", n);\n  n--;\n}\n\nlet zahl = 27, schritte = 0;\nwhile (zahl !== 1) {\n  zahl = zahl % 2 === 0 ? zahl / 2 : 3 * zahl + 1;\n  schritte++;\n}\nconsole.log(schritte); // → 111\n\nconst queue = ["a", "b"];\nwhile (queue.length) {\n  console.log(queue.shift());\n}',
    { keywords: ['schleife', 'solange', 'loop', 'endlosschleife'], related: ['do...while', 'for', 'break', 'continue'], mdn: M + 'Reference/Statements/while' });

  k('do...while',
    'Schleife, die mindestens einmal läuft und danach die Bedingung prüft.',
    'Der Block wird zuerst ausgeführt, dann wird die Bedingung geprüft. Praktisch, wenn etwas mindestens einmal passieren muss, z. B. Eingabe oder Versuch mit Wiederholung. Am Ende der Schleife steht ein Semikolon nach der Klammer.',
    'do {\n  ...\n} while (bedingung);',
    'let i = 10;\ndo {\n  console.log("läuft einmal, i =", i);\n  i++;\n} while (i < 5);\n\nlet versuche = 0;\nlet erfolg;\ndo {\n  versuche++;\n  erfolg = versuche >= 3;\n} while (!erfolg);\nconsole.log("Versuche:", versuche); // → 3',
    { keywords: ['schleife', 'mindestens einmal', 'loop', 'fußgesteuert'], related: ['while', 'for', 'break'], mdn: M + 'Reference/Statements/do...while' });

  k('break',
    'Beendet die umgebende Schleife oder das switch sofort.',
    'In verschachtelten Schleifen bricht `break` nur die innerste ab; für äußere nutzt du ein Label (`break label`). In `switch` verhindert es das Durchfallen in den nächsten Fall. Bei `forEach` funktioniert `break` nicht, nimm dort `for...of` oder `some`/`every`.',
    'break;\nbreak label;',
    'for (let i = 0; i < 10; i++) {\n  if (i === 3) break;\n  console.log(i);          // 0, 1, 2\n}\n\nconst zahlen = [4, 8, 15, 16];\nlet gefunden;\nfor (const z of zahlen) {\n  if (z > 10) { gefunden = z; break; }\n}\nconsole.log(gefunden);     // → 15\n\nblock: {\n  console.log("vorher");\n  if (true) break block;\n  console.log("wird übersprungen");\n}',
    { keywords: ['abbrechen', 'schleife verlassen', 'exit loop', 'stop'], related: ['continue', 'Labels', 'switch', 'for', 'while'], mdn: M + 'Reference/Statements/break' });

  k('continue',
    'Springt in der Schleife direkt zum nächsten Durchlauf.',
    'Der Rest des aktuellen Durchlaufs wird übersprungen. Bei `for` wird anschließend der Schritt-Ausdruck ausgeführt, bei `while` die Bedingung geprüft. Mit Label (`continue label`) setzt du die äußere Schleife fort. Oft lesbarer als tiefe `if`-Verschachtelung.',
    'continue;\ncontinue label;',
    'for (let i = 1; i <= 5; i++) {\n  if (i % 2 === 0) continue; // gerade überspringen\n  console.log(i);             // 1, 3, 5\n}\n\nfor (const wort of ["a", "", "b"]) {\n  if (!wort) continue;\n  console.log(wort);          // a, b\n}\n\naussen: for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (j === 1) continue aussen;\n    console.log(i, j);        // 0 0 / 1 0 / 2 0\n  }\n}',
    { keywords: ['überspringen', 'nächster durchlauf', 'skip', 'schleife'], related: ['break', 'Labels', 'for', 'while'], mdn: M + 'Reference/Statements/continue' });

  k('Labels',
    'Benennen eine Anweisung, damit break/continue gezielt darauf wirken.',
    'Ein Label steht vor einer Schleife oder einem Block (`name: for (...)`). `break name` verlässt die benannte Anweisung, `continue name` setzt die benannte Schleife fort; so steuerst du äußere Schleifen aus verschachtelten heraus. Selten nötig, oft ersetzbar durch eine Funktion mit `return`.',
    'label: anweisung\nbreak label;\ncontinue label;',
    'aussen: for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (i * j === 2) {\n      console.log("gefunden:", i, j); // → 1 2\n      break aussen;\n    }\n  }\n}\n\nconst matrix = [[1, 2], [3, 4]];\nsuche: for (const zeile of matrix) {\n  for (const wert of zeile) {\n    if (wert === 3) { console.log("3 gefunden"); break suche; }\n  }\n}',
    { keywords: ['label', 'sprungmarke', 'verschachtelte schleifen', 'äußere schleife'], related: ['break', 'continue', 'for'], mdn: M + 'Reference/Statements/label' });

  k('try...catch...finally',
    'Fängt Laufzeitfehler ab und erlaubt Aufräumcode.',
    'Wirft Code im `try`-Block einen Fehler (auch per `throw`), springt die Ausführung in `catch (e)`. `finally` läuft immer, auch nach `return` oder Fehler, ideal zum Aufräumen. Das Fehlerobjekt in `catch` ist optional (`catch { }`). Syntaxfehler im Code selbst lassen sich nicht abfangen; in `async`-Funktionen fängt `try` mit `await` auch abgelehnte Promises.',
    'try {\n  ...\n} catch (fehler) {\n  ...\n} finally {\n  ...\n}',
    'function parse(text) {\n  try {\n    return JSON.parse(text);\n  } catch (e) {\n    console.log("Fehler:", e.name);  // → SyntaxError\n    return null;\n  } finally {\n    console.log("immer ausgeführt");\n  }\n}\nconsole.log(parse(\'{"a":1}\'));    // → { a: 1 }\nconsole.log(parse("kaputt"));     // → null\n\ntry {\n  undefinedFunktion();\n} catch {\n  console.log("Fehlerobjekt nicht nötig");\n}\n\ntry {\n  throw new Error("selbst geworfen");\n} catch (err) {\n  console.log(err.message);\n}',
    { keywords: ['fehlerbehandlung', 'exception', 'error handling', 'abfangen', 'catch', 'finally'], related: ['throw', 'Error-Typen', 'instanceof'], mdn: M + 'Reference/Statements/try...catch' });

  k('throw',
    'Wirft einen Fehler und unterbricht die normale Ausführung.',
    'Du kannst jeden Wert werfen, sollst aber immer ein `Error`-Objekt (oder eine Unterklasse) werfen, weil nur dieses einen Stack-Trace mitbringt. Der Fehler steigt die Aufrufkette hoch, bis ein `catch` ihn behandelt; sonst landet er als uncaught error in der Konsole. Werfen eignet sich für Vertragsverletzungen wie ungültige Argumente.',
    'throw new Error("Meldung");',
    'function teilen(a, b) {\n  if (b === 0) {\n    throw new RangeError("Division durch 0");\n  }\n  return a / b;\n}\ntry {\n  console.log(teilen(6, 3));    // → 2\n  console.log(teilen(1, 0));\n} catch (e) {\n  console.log(e.name, e.message); // → RangeError Division durch 0\n}\n\ntry {\n  throw "nur ein String"; // möglich, aber schlechter Stil\n} catch (e) {\n  console.log(typeof e, e);\n}',
    { keywords: ['fehler werfen', 'exception', 'auslösen', 'raise'], related: ['try...catch...finally', 'Error-Typen'], mdn: M + 'Reference/Statements/throw' });

  k('Error-Typen',
    'Eingebaute und eigene Fehlerklassen mit name, message, stack und cause.',
    'Neben dem Basistyp `Error` gibt es `TypeError` (falscher Typ), `RangeError` (Wert außerhalb des Bereichs), `SyntaxError` (ungültiger Code/JSON) und `ReferenceError` (unbekannte Variable). Eigene Fehler erstellst du mit `class MeinFehler extends Error`. Die Option `{ cause }` hängt den ursprünglichen Fehler an, sodass beim Umverpacken keine Information verloren geht. Unterscheide Fehler mit `instanceof`.',
    'new Error(message, { cause })\nclass MeinFehler extends Error {}',
    'try { null.x; } catch (e) { console.log(e.name); }        // → TypeError\ntry { new Array(-1); } catch (e) { console.log(e.name); } // → RangeError\ntry { JSON.parse("{"); } catch (e) { console.log(e.name); } // → SyntaxError\ntry { gibtEsNicht; } catch (e) { console.log(e.name); }   // → ReferenceError\n\nclass ValidierungsFehler extends Error {\n  constructor(feld, message) {\n    super(message);\n    this.name = "ValidierungsFehler";\n    this.feld = feld;\n  }\n}\ntry {\n  throw new ValidierungsFehler("email", "Ungültige E-Mail");\n} catch (e) {\n  console.log(e instanceof ValidierungsFehler, e.feld, e.message);\n}\n\ntry {\n  try {\n    JSON.parse("kaputt");\n  } catch (err) {\n    throw new Error("Konfiguration ungültig", { cause: err });\n  }\n} catch (e) {\n  console.log(e.message, "←", e.cause.name);\n}',
    { values: [['Error', 'Basisklasse für alle Fehler'], ['TypeError', 'Wert hat den falschen Typ, z. B. null.x'], ['RangeError', 'Wert außerhalb des erlaubten Bereichs'], ['SyntaxError', 'Ungültige Syntax, z. B. in JSON.parse'], ['ReferenceError', 'Nicht deklarierte Variable'], ['error.name / .message', 'Typname und Text'], ['error.stack', 'Stack-Trace (nicht standardisiert)'], ['error.cause', 'Ursprünglicher Fehler (ES2022)']],
      keywords: ['fehlerklassen', 'custom error', 'eigener fehler', 'exception', 'cause', 'stack trace', 'typeerror', 'rangeerror', 'syntaxerror', 'referenceerror'], related: ['throw', 'try...catch...finally', 'instanceof'], mdn: M + 'Reference/Global_Objects/Error' });
})();
