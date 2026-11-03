window.CHEAT = window.CHEAT || [];
(function () {
  var M = 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/';
  var out = [];
  // P(gruppe, name, desc, details, syntax, example, extras) – alle Einträge sind lauffähig (run: true)
  function P(group, name, desc, details, syntax, example, o) {
    var e = { lang: 'js', group: group, name: name, desc: desc, details: details, syntax: syntax, example: example, run: true };
    o = o || {};
    for (var k in o) e[k] = o[k];
    if (e.mdn && e.mdn.indexOf('http') !== 0) e.mdn = M + e.mdn;
    out.push(e);
  }

  // ---------------- Strings ----------------
  var S = 'Strings';
  P(S, 'Template-Literale', 'Strings in Backticks mit eingebetteten Ausdrücken und Zeilenumbrüchen.',
    'Template-Literale werden mit Backticks geschrieben. In `${...}` steht ein beliebiger Ausdruck, dessen Ergebnis in einen String umgewandelt wird. Echte Zeilenumbrüche im Quelltext bleiben erhalten. Fallstrick: Objekte werden zu `[object Object]`, wenn sie nicht explizit formatiert werden.',
    '`Text ${ausdruck} Text`',
    "const name = 'Ada';\nconst preis = 4.5;\nconsole.log(`Hallo ${name}!`); // → Hallo Ada!\nconsole.log(`Summe: ${2 + 3}`); // → Summe: 5\nconsole.log(`Preis: ${preis.toFixed(2)} €`); // → Preis: 4.50 €\nconsole.log(`Zeile 1\nZeile 2`); // → zwei Zeilen\nconsole.log(`${{}}`); // → [object Object]",
    { values: [['${ausdruck}', 'Interpolation eines beliebigen Ausdrucks'], ['\\`', 'Backtick im Text maskieren'], ['\\${', 'Interpolation verhindern']],
      tip: 'Für Mehrzeiliges und Verkettungen sind Template-Literale lesbarer als `+`.',
      keywords: ['template string', 'interpolation', 'backtick', 'string verketten', 'mehrzeilig'],
      related: ['Tagged Templates', 'String.raw'], mdn: '../Template_literals' });
  out[out.length - 1].mdn = 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Template_literals';

  P(S, 'Tagged Templates', 'Funktion vor einem Template-Literal erhält Textteile und Werte getrennt.',
    'Steht eine Funktion direkt vor dem Backtick, wird sie als Tag aufgerufen: Das erste Argument ist ein Array der Textteile (mit `.raw`), die weiteren sind die interpolierten Werte. Die Funktion darf beliebige Werte zurückgeben, nicht nur Strings. Nützlich für Escaping, Hervorhebung, Internationalisierung oder SQL-/HTML-Builder.',
    'tag`Text ${wert} Text`',
    "function hervorheben(teile, ...werte) {\n  return teile.reduce((acc, t, i) =>\n    acc + t + (i < werte.length ? `[${werte[i]}]` : ''), '');\n}\nconst user = 'Ada';\nconst n = 3;\nconsole.log(hervorheben`${user} hat ${n} Nachrichten`);\n// → [Ada] hat [3] Nachrichten",
    { values: [['teile', 'Array der statischen Textteile (teile.raw: ungeparste Variante)'], ['...werte', 'Die ausgewerteten ${}-Ausdrücke in Reihenfolge']],
      keywords: ['tag function', 'tagged template literal', 'raw', 'escaping'], related: ['Template-Literale', 'String.raw'],
      mdn: 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Template_literals#tagged_templates' });

  P(S, 'length', 'Anzahl der UTF-16-Codeeinheiten eines Strings.',
    '`length` ist eine schreibgeschützte Eigenschaft, keine Methode. Sie zählt UTF-16-Codeeinheiten, nicht sichtbare Zeichen: Emojis und manche Sonderzeichen zählen als 2. Mit `[...text].length` werden Codepoints gezählt.',
    'text.length',
    "console.log('Hallo'.length); // → 5\nconsole.log(''.length); // → 0\nconsole.log('😀'.length); // → 2\nconsole.log([...'😀'].length); // → 1\nconst s = 'abc';\n// s.length = 1; → TypeError im Strict Mode (Strings sind unveränderlich)\nconsole.log(s); // → abc",
    { tip: 'Strings sind unveränderlich: Jede Methode gibt einen neuen String zurück.', keywords: ['länge', 'zeichen zählen', 'size'], related: ['at() (String)', 'charAt() / charCodeAt()'], mdn: 'String/length' });

  P(S, 'slice() (String)', 'Schneidet einen Teilstring über Start- und Endindex aus.',
    'Gibt die Zeichen von `start` bis ausschließlich `end` als neuen String zurück; das Original bleibt unverändert. Negative Indizes zählen vom Ende. Fehlt `end`, geht der Schnitt bis zum Ende.',
    'text.slice(start, end?)',
    "const t = 'Hallo Welt';\nconsole.log(t.slice(0, 5)); // → Hallo\nconsole.log(t.slice(6)); // → Welt\nconsole.log(t.slice(-4)); // → Welt\nconsole.log(t.slice(2, -2)); // → llo We\nconsole.log(t.slice(5, 2)); // → '' (leer)",
    { values: [['start', 'Startindex (inklusiv), negativ = vom Ende'], ['end', 'Endindex (exklusiv), optional']],
      keywords: ['teilstring', 'substring', 'ausschneiden', 'substr'], related: ['substring()', 'slice() (Array)', 'at() (String)'], mdn: 'String/slice' });

  P(S, 'substring()', 'Teilstring zwischen zwei Indizes, mit Sonderregeln für negative Werte.',
    'Wie `slice()`, aber negative Werte und `NaN` werden als 0 behandelt, und sind `start` und `end` vertauscht, werden sie automatisch getauscht. Das macht das Verhalten schwerer vorhersagbar; meist ist `slice()` die bessere Wahl.',
    'text.substring(start, end?)',
    "const t = 'Hallo Welt';\nconsole.log(t.substring(0, 5)); // → Hallo\nconsole.log(t.substring(5, 0)); // → Hallo (getauscht)\nconsole.log(t.substring(-3)); // → Hallo Welt (-3 wird 0)\nconsole.log(t.slice(-3)); // → elt",
    { keywords: ['teilstring', 'ausschneiden', 'substr'], related: ['slice() (String)'], mdn: 'String/substring' });

  P(S, 'indexOf() (String)', 'Index des ersten Vorkommens eines Teilstrings oder -1.',
    'Sucht von links (optional ab `fromIndex`) und liefert die Position des ersten Treffers, sonst `-1`. Die Suche ist case-sensitiv. `lastIndexOf()` sucht von rechts. Fallstrick: `if (text.indexOf(x))` ist falsch, da Index 0 falsy ist; besser `!== -1` oder `includes()`.',
    'text.indexOf(suchtext, fromIndex?)',
    "const t = 'Hallo Welt';\nconsole.log(t.indexOf('l')); // → 2\nconsole.log(t.indexOf('l', 4)); // → 8\nconsole.log(t.lastIndexOf('l')); // → 8\nconsole.log(t.indexOf('x')); // → -1\nconsole.log(t.indexOf('hallo')); // → -1 (Groß-/Kleinschreibung)",
    { keywords: ['suchen', 'position', 'lastIndexOf', 'find'], related: ['includes() (String)', 'indexOf() (Array)'], mdn: 'String/indexOf' });

  P(S, 'includes() (String)', 'Prüft, ob ein Teilstring im String vorkommt.',
    'Liefert `true` oder `false`. Die Suche ist case-sensitiv; für Groß-/Kleinschreibung vorher beide Seiten umwandeln. Ein regulärer Ausdruck als Argument wirft einen `TypeError`.',
    'text.includes(suchtext, startIndex?)',
    "const t = 'Hallo Welt';\nconsole.log(t.includes('Welt')); // → true\nconsole.log(t.includes('welt')); // → false\nconsole.log(t.toLowerCase().includes('welt')); // → true\nconsole.log(t.includes('Hallo', 1)); // → false",
    { keywords: ['enthält', 'contains', 'suchen'], related: ['indexOf() (String)', 'startsWith() / endsWith()', 'includes() (Array)', 'test()'], mdn: 'String/includes' });

  P(S, 'startsWith() / endsWith()', 'Prüft, ob ein String mit einem Text beginnt bzw. endet.',
    'Beide liefern einen Boolean und sind case-sensitiv. Optionale zweite Argumente verschieben den Prüfbereich: bei `startsWith` die Startposition, bei `endsWith` die Länge, bis zu der gesucht wird. Reguläre Ausdrücke sind nicht erlaubt.',
    'text.startsWith(prefix, pos?)  |  text.endsWith(suffix, laenge?)',
    "const datei = 'bericht.pdf';\nconsole.log(datei.startsWith('bericht')); // → true\nconsole.log(datei.endsWith('.pdf')); // → true\nconsole.log(datei.endsWith('.PDF')); // → false\nconsole.log(datei.startsWith('icht', 3)); // → true\nconsole.log(datei.endsWith('bericht', 7)); // → true",
    { keywords: ['beginnt mit', 'endet mit', 'prefix', 'suffix', 'dateiendung'], related: ['includes() (String)', 'indexOf() (String)'], mdn: 'String/startsWith' });

  P(S, 'split()', 'Zerlegt einen String an einem Trennzeichen in ein Array.',
    'Gibt ein Array von Teilstrings zurück. Als Trenner geht ein String oder ein regulärer Ausdruck; ein leerer String zerlegt in Codeeinheiten. Das optionale `limit` begrenzt die Anzahl der Elemente. Das Gegenstück ist `Array.join()`.',
    'text.split(trenner, limit?)',
    "console.log('a,b,c'.split(',')); // → [\"a\",\"b\",\"c\"]\nconsole.log('a,b,c'.split(',', 2)); // → [\"a\",\"b\"]\nconsole.log('abc'.split('')); // → [\"a\",\"b\",\"c\"]\nconsole.log('a1b22c'.split(/\\d+/)); // → [\"a\",\"b\",\"c\"]\nconsole.log('Zeile1\\nZeile2'.split('\\n')); // → [\"Zeile1\",\"Zeile2\"]\nconsole.log([...'😀a']); // → [\"😀\",\"a\"] (besser als split(''))",
    { keywords: ['trennen', 'aufteilen', 'explode', 'csv'], related: ['join()', 'Reguläre Ausdrücke'], mdn: 'String/split' });
  out[out.length - 1].related = ['join()', 'RegExp-Literal'];

  P(S, 'replace()', 'Ersetzt das erste Vorkommen (oder alle bei /g) eines Musters.',
    'Gibt einen neuen String zurück. Bei einem String als Muster wird nur der erste Treffer ersetzt; für alle Treffer braucht man ein RegExp mit `g` oder `replaceAll()`. Als Ersatz geht ein String (mit `$1`, `$&`, `$<name>`) oder eine Funktion, die pro Treffer aufgerufen wird.',
    'text.replace(muster, ersatz | funktion)',
    "console.log('a-b-c'.replace('-', '+')); // → a+b-c\nconsole.log('a-b-c'.replace(/-/g, '+')); // → a+b+c\nconsole.log('Ada Lovelace'.replace(/(\\w+) (\\w+)/, '$2, $1')); // → Lovelace, Ada\nconsole.log('preis: 5'.replace(/\\d+/, (z) => z * 2)); // → preis: 10",
    { values: [['$1, $2 …', 'Inhalt der Capture-Gruppen'], ['$&', 'Gesamter Treffer'], ['$<name>', 'Benannte Gruppe'], ['$$', 'Ein Dollarzeichen']],
      keywords: ['ersetzen', 'austauschen', 'regex', 'substitute'], related: ['replaceAll()', 'RegExp-Literal', 'Benannte Gruppen'], mdn: 'String/replace' });

  P(S, 'replaceAll()', 'Ersetzt alle Vorkommen eines Musters.',
    'Wie `replace()`, aber ersetzt jeden Treffer. Bei einem RegExp ist das Flag `g` Pflicht, sonst gibt es einen `TypeError`. Ein String-Muster wird wörtlich genommen, Sonderzeichen müssen nicht maskiert werden.',
    'text.replaceAll(muster, ersatz | funktion)',
    "console.log('a.b.c'.replaceAll('.', '-')); // → a-b-c\nconsole.log('x1y22'.replaceAll(/\\d/g, '#')); // → x#y##\ntry {\n  'abc'.replaceAll(/b/, '_');\n} catch (e) {\n  console.log(e.name); // → TypeError (ohne g-Flag)\n}",
    { keywords: ['alle ersetzen', 'global'], related: ['replace()', 'Flags (g, i, m, s, u, y, d)'], mdn: 'String/replaceAll' });

  P(S, 'trim()', 'Entfernt Leerraum am Anfang und Ende eines Strings.',
    '`trim()` entfernt Leerzeichen, Tabs und Zeilenumbrüche an beiden Enden, `trimStart()` und `trimEnd()` nur an einer Seite. Leerraum in der Mitte bleibt erhalten. Der Originalstring wird nicht verändert.',
    'text.trim()  |  text.trimStart()  |  text.trimEnd()',
    "const eingabe = '  Ada Lovelace \\n';\nconsole.log(`[${eingabe.trim()}]`); // → [Ada Lovelace]\nconsole.log(`[${eingabe.trimStart()}]`); // → [Ada Lovelace \\n]\nconsole.log(`[${'  a  b '.trim()}]`); // → [a  b]",
    { keywords: ['leerzeichen entfernen', 'whitespace', 'strip'], related: ['padStart() / padEnd()'], mdn: 'String/trim' });

  P(S, 'padStart() / padEnd()', 'Füllt einen String auf eine Mindestlänge auf.',
    'Hängt Füllzeichen vorn (`padStart`) oder hinten (`padEnd`) an, bis die Zielänge erreicht ist. Ist der String bereits lang genug, bleibt er unverändert. Das Füllzeichen wird bei Bedarf wiederholt und abgeschnitten. Zahlen müssen vorher mit `String()` umgewandelt werden.',
    'text.padStart(laenge, fuell?)  |  text.padEnd(laenge, fuell?)',
    "console.log('7'.padStart(3, '0')); // → 007\nconsole.log(String(5).padStart(2, '0')); // → 05\nconsole.log('abc'.padEnd(6, '.')); // → abc...\nconsole.log('abc'.padStart(8, '12')); // → 12121abc\nconst h = 9, m = 5;\nconsole.log(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`); // → 09:05",
    { keywords: ['auffüllen', 'führende nullen', 'leading zero', 'formatieren'], related: ['repeat()', 'trim()'], mdn: 'String/padStart' });

  P(S, 'toUpperCase() / toLowerCase()', 'Wandelt einen String in Groß- bzw. Kleinbuchstaben um.',
    'Liefert einen neuen String; das Original bleibt unverändert. Die Umwandlung folgt Unicode, daher wird etwa `ß` zu `SS` (die Länge kann sich ändern). Für sprachspezifische Regeln gibt es `toLocaleUpperCase(locale)`.',
    'text.toUpperCase()  |  text.toLowerCase()',
    "console.log('Hallo'.toUpperCase()); // → HALLO\nconsole.log('Hallo'.toLowerCase()); // → hallo\nconsole.log('straße'.toUpperCase()); // → STRASSE\nconsole.log('i'.toLocaleUpperCase('tr')); // → İ\nconst wort = 'javaScript';\nconsole.log(wort[0].toUpperCase() + wort.slice(1).toLowerCase()); // → Javascript",
    { keywords: ['großbuchstaben', 'kleinbuchstaben', 'case', 'capitalize', 'uppercase', 'lowercase'], related: ['localeCompare()', 'includes() (String)'], mdn: 'String/toUpperCase' });

  P(S, 'at() (String)', 'Zeichen an einem Index, auch negativ vom Ende.',
    'Wie die Klammer-Schreibweise `text[i]`, erlaubt aber negative Indizes: `-1` ist das letzte Zeichen. Liegt der Index außerhalb, wird `undefined` zurückgegeben.',
    'text.at(index)',
    "const t = 'Hallo';\nconsole.log(t.at(0)); // → H\nconsole.log(t.at(-1)); // → o\nconsole.log(t.at(10)); // → undefined\nconsole.log(t[-1]); // → undefined (Klammer kennt keine negativen Indizes)",
    { keywords: ['letztes zeichen', 'negativer index'], related: ['at() (Array)', 'charAt() / charCodeAt()'], mdn: 'String/at' });

  P(S, 'repeat()', 'Wiederholt einen String n-mal.',
    'Gibt die Verkettung von `n` Kopien zurück. Bei `0` ist das Ergebnis ein leerer String; negative Zahlen oder `Infinity` lösen einen `RangeError` aus.',
    'text.repeat(anzahl)',
    "console.log('ab'.repeat(3)); // → ababab\nconsole.log('-'.repeat(10)); // → ----------\nconsole.log('x'.repeat(0) === ''); // → true\ntry {\n  'x'.repeat(-1);\n} catch (e) {\n  console.log(e.name); // → RangeError\n}",
    { keywords: ['wiederholen', 'vervielfachen'], related: ['padStart() / padEnd()'], mdn: 'String/repeat' });

  P(S, 'charAt() / charCodeAt()', 'Zeichen bzw. UTF-16-Code an einem Index.',
    '`charAt(i)` gibt das Zeichen als String zurück (leer bei ungültigem Index), `charCodeAt(i)` den numerischen UTF-16-Code (`NaN` bei ungültigem Index). `codePointAt()` liefert den vollständigen Codepoint, auch bei Emojis, `String.fromCharCode()` bzw. `fromCodePoint()` den Gegenweg.',
    'text.charAt(i)  |  text.charCodeAt(i)  |  String.fromCharCode(code)',
    "console.log('abc'.charAt(1)); // → b\nconsole.log('abc'.charAt(10) === ''); // → true\nconsole.log('A'.charCodeAt(0)); // → 65\nconsole.log(String.fromCharCode(72, 105)); // → Hi\nconsole.log('😀'.codePointAt(0)); // → 128512\nconsole.log('😀'.charCodeAt(0)); // → 55357 (nur halbes Zeichen)",
    { keywords: ['zeichencode', 'ascii', 'unicode', 'codepoint', 'fromCharCode'], related: ['at() (String)', 'length', 'normalize()'], mdn: 'String/charCodeAt' });

  P(S, 'localeCompare()', 'Vergleicht Strings nach sprachspezifischer Sortierreihenfolge.',
    'Gibt eine negative Zahl, 0 oder eine positive Zahl zurück und eignet sich als Vergleichsfunktion für `sort()`. Anders als `<` beachtet es Umlaute und Akzente der gewählten Sprache. Mit Optionen lassen sich Groß-/Kleinschreibung ignorieren (`sensitivity`) oder Zahlen numerisch vergleichen (`numeric`).',
    'a.localeCompare(b, locale?, optionen?)',
    "const namen = ['Zoe', 'Äpfel', 'Anna', 'Bernd'];\nconsole.log([...namen].sort()); // → [\"Anna\",\"Bernd\",\"Zoe\",\"Äpfel\"]\nconsole.log([...namen].sort((a, b) => a.localeCompare(b, 'de'))); // → [\"Anna\",\"Äpfel\",\"Bernd\",\"Zoe\"]\nconsole.log('a'.localeCompare('A', 'de', { sensitivity: 'base' })); // → 0\nconsole.log('10'.localeCompare('2', 'de', { numeric: true })); // → 1",
    { values: [['sensitivity: \'base\'', 'a = A = á (nur Grundbuchstaben)'], ['numeric: true', '\'10\' sortiert nach \'2\''], ['caseFirst: \'upper\'', 'Großbuchstaben zuerst']],
      keywords: ['sortieren', 'umlaute', 'vergleichen', 'collator', 'alphabetisch'], related: ['sort()', 'Intl.NumberFormat'], mdn: 'String/localeCompare' });

  P(S, 'normalize()', 'Wandelt Unicode in eine einheitliche Normalform um.',
    'Manche Zeichen lassen sich auf mehrere Arten darstellen, etwa `é` als ein Codepoint oder als `e` plus Akzent. Solche Strings sind gleich aussehend, aber `===` liefert `false`. `normalize()` (Standard `NFC`) macht sie vergleichbar; mit `NFD` plus Regex lassen sich Akzente entfernen.',
    'text.normalize(form?)',
    "const a = '\\u00e9'; // é als ein Zeichen\nconst b = 'e\\u0301'; // e + kombinierender Akzent\nconsole.log(a === b); // → false\nconsole.log(a.normalize() === b.normalize()); // → true\nconsole.log(a.length, b.length); // → 1 2\nconsole.log('Café'.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')); // → Cafe",
    { values: [['NFC', 'Zusammengesetzt (Standard)'], ['NFD', 'Zerlegt in Basiszeichen + Akzente'], ['NFKC', 'Kompatibilitäts-Variante, zusammengesetzt'], ['NFKD', 'Kompatibilitäts-Variante, zerlegt']],
      keywords: ['unicode', 'akzente entfernen', 'diakritika', 'vergleich'], related: ['localeCompare()', 'charAt() / charCodeAt()'], mdn: 'String/normalize' });

  P(S, 'String.raw', 'Tag für Template-Literale, der Escape-Sequenzen nicht auswertet.',
    'Mit `String.raw` bleiben Backslashes wörtlich erhalten: `\\n` ist dann zwei Zeichen, kein Zeilenumbruch. Praktisch für Windows-Pfade und Regex-Quellen. Interpolationen mit `${}` funktionieren weiterhin.',
    'String.raw`text`',
    "console.log(String.raw`C:\\neu\\tabelle`); // → C:\\neu\\tabelle\nconsole.log('C:\\neu'.length); // → 4 (\\n ist ein Zeilenumbruch)\nconsole.log(String.raw`C:\\neu`.length); // → 6\nconst n = 2;\nconsole.log(String.raw`a\\tb${n}`); // → a\\tb2",
    { tip: 'Ein Raw-String darf nicht auf einem einzelnen Backslash enden.', keywords: ['rohstring', 'backslash', 'pfad', 'raw string'], related: ['Template-Literale', 'Tagged Templates'], mdn: 'String/raw' });

  // ---------------- Arrays ----------------
  var A = 'Arrays';
  P(A, 'Array-Literal', 'Geordnete Liste von Werten in eckigen Klammern.',
    'Arrays sind Objekte mit numerischen Indizes ab 0 und der Eigenschaft `length`. Sie können beliebige Werte mischen und wachsen dynamisch. Mit Spread `[...a]` kopiert man flach, mit Destructuring `[x, y] = a` entnimmt man Elemente. Das Schreiben an einen weit entfernten Index erzeugt ein löchriges (sparse) Array.',
    '[wert1, wert2, ...]',
    "const zahlen = [10, 20, 30];\nconsole.log(zahlen[0], zahlen.length); // → 10 3\nconst kopie = [...zahlen, 40];\nconsole.log(kopie); // → [10,20,30,40]\nconst [erstes, ...rest] = zahlen;\nconsole.log(erstes, rest); // → 10 [20,30]\nconst luecke = [1];\nluecke[3] = 4;\nconsole.log(luecke.length); // → 4",
    { tip: 'Kopien mit `[...a]` sind flach: verschachtelte Objekte werden geteilt. Tiefe Kopie: `structuredClone(a)`.',
      keywords: ['liste', 'array erstellen', 'spread', 'destructuring', 'length'], related: ['Array.from()', 'Array.of()', 'Array.isArray()'], mdn: 'Array' });

  P(A, 'push()', 'Hängt Elemente ans Ende eines Arrays an.',
    'Mutiert das Array und gibt die neue Länge zurück (nicht das Array). Mehrere Elemente sind möglich. Um ein Array nicht zu verändern, nutzt man stattdessen `[...a, x]` oder `concat()`.',
    'array.push(element1, ..., elementN)',
    "const a = [1, 2];\nconst laenge = a.push(3, 4);\nconsole.log(a, laenge); // → [1,2,3,4] 4\nconst b = [1, 2];\nb.push(...[3, 4]); // anderes Array anhängen\nconsole.log(b); // → [1,2,3,4]\nconst neu = [...a, 5]; // ohne Mutation\nconsole.log(neu, a.length); // → [1,2,3,4,5] 4",
    { keywords: ['anhängen', 'hinzufügen', 'append', 'add'], related: ['pop()', 'shift() / unshift()', 'concat() (Array)'], mdn: 'Array/push' });

  P(A, 'pop()', 'Entfernt das letzte Element und gibt es zurück.',
    'Mutiert das Array und liefert das entfernte Element, bei einem leeren Array `undefined`. Zusammen mit `push()` ergibt sich ein Stack (LIFO).',
    'array.pop()',
    "const stack = [1, 2, 3];\nconsole.log(stack.pop()); // → 3\nconsole.log(stack); // → [1,2]\nconsole.log([].pop()); // → undefined",
    { keywords: ['letztes entfernen', 'stack', 'remove last'], related: ['push()', 'shift() / unshift()', 'splice()'], mdn: 'Array/pop' });

  P(A, 'shift() / unshift()', 'Entfernt das erste Element bzw. fügt vorn Elemente ein.',
    'Beide mutieren das Array. `shift()` liefert das entfernte erste Element (oder `undefined`), `unshift()` die neue Länge. Da alle Elemente umindiziert werden, sind sie bei sehr großen Arrays langsamer als `push()`/`pop()`.',
    'array.shift()  |  array.unshift(element1, ..., elementN)',
    "const queue = ['b', 'c'];\nconsole.log(queue.unshift('a')); // → 3\nconsole.log(queue); // → [\"a\",\"b\",\"c\"]\nconsole.log(queue.shift()); // → a\nconsole.log(queue); // → [\"b\",\"c\"]",
    { keywords: ['queue', 'warteschlange', 'vorne einfügen', 'erstes entfernen'], related: ['push()', 'pop()'], mdn: 'Array/shift' });

  P(A, 'splice()', 'Entfernt und/oder fügt Elemente an beliebiger Stelle ein (mutiert).',
    'Ab `start` werden `deleteCount` Elemente entfernt und optionale neue Elemente eingefügt. Rückgabe ist ein Array der entfernten Elemente. Das Original wird verändert; die nicht-mutierende Variante ist `toSpliced()`. Nicht mit `slice()` verwechseln.',
    'array.splice(start, deleteCount?, ...neueElemente)',
    "const a = [1, 2, 3, 4, 5];\nconst entfernt = a.splice(1, 2);\nconsole.log(entfernt, a); // → [2,3] [1,4,5]\na.splice(1, 0, 'x', 'y'); // einfügen\nconsole.log(a); // → [1,\"x\",\"y\",4,5]\na.splice(-1, 1, 'ende'); // letztes ersetzen\nconsole.log(a); // → [1,\"x\",\"y\",4,\"ende\"]",
    { keywords: ['einfügen', 'löschen', 'entfernen', 'ersetzen', 'insert', 'remove'], related: ['toSpliced()', 'slice() (Array)'], mdn: 'Array/splice' });

  P(A, 'slice() (Array)', 'Kopiert einen Ausschnitt in ein neues Array (mutiert nicht).',
    'Liefert eine flache Kopie von `start` bis ausschließlich `end`; negative Werte zählen vom Ende. Ohne Argumente entsteht eine vollständige flache Kopie. Das Originalarray bleibt unverändert.',
    'array.slice(start?, end?)',
    "const a = ['a', 'b', 'c', 'd'];\nconsole.log(a.slice(1, 3)); // → [\"b\",\"c\"]\nconsole.log(a.slice(-2)); // → [\"c\",\"d\"]\nconsole.log(a.slice()); // → Kopie\nconsole.log(a); // → unverändert",
    { keywords: ['teilarray', 'ausschnitt', 'kopieren', 'copy'], related: ['splice()', 'slice() (String)', 'toSpliced()'], mdn: 'Array/slice' });

  P(A, 'concat() (Array)', 'Verbindet Arrays zu einem neuen Array.',
    'Gibt ein neues Array zurück und lässt die Originale unverändert. Array-Argumente werden eine Ebene aufgelöst, andere Werte angehängt. Heute wird häufig der Spread-Operator bevorzugt: `[...a, ...b]`.',
    'array.concat(wert1, ..., wertN)',
    "const a = [1, 2];\nconst b = [3];\nconsole.log(a.concat(b, 4, [5, [6]])); // → [1,2,3,4,5,[6]]\nconsole.log([...a, ...b]); // → [1,2,3]\nconsole.log(a); // → [1,2]",
    { keywords: ['verbinden', 'zusammenführen', 'merge', 'verketten'], related: ['push()', 'flat()'], mdn: 'Array/concat' });

  P(A, 'map()', 'Wandelt jedes Element um und liefert ein neues Array.',
    'Ruft die Callback-Funktion für jedes Element auf (Wert, Index, Array) und sammelt die Rückgabewerte in einem neuen Array gleicher Länge. Das Original bleibt unverändert. Fallstrick: Wer das Ergebnis nicht nutzt, sollte `forEach()` verwenden; vergisst man `return` im Block-Body, entstehen `undefined`-Werte.',
    'array.map((element, index, array) => neuerWert)',
    "const zahlen = [1, 2, 3];\nconsole.log(zahlen.map((x) => x * 2)); // → [2,4,6]\nconst user = [{ name: 'Ada' }, { name: 'Linus' }];\nconsole.log(user.map((u) => u.name)); // → [\"Ada\",\"Linus\"]\nconsole.log(['1', '2', '3'].map(Number)); // → [1,2,3]\nconsole.log(['1', '2', '3'].map(parseInt)); // → [1,NaN,NaN] (Falle!)",
    { tip: 'Callback-Funktionen bekommen 3 Argumente: `map(parseInt)` übergibt den Index als Radix und liefert Unsinn.',
      keywords: ['transformieren', 'umwandeln', 'mapping'], related: ['filter()', 'reduce()', 'forEach()', 'flatMap()'], mdn: 'Array/map' });

  P(A, 'filter()', 'Behält nur die Elemente, für die der Callback truthy liefert.',
    'Gibt ein neues Array mit den passenden Elementen zurück, möglicherweise ein leeres. Das Original bleibt unverändert. Mit `filter(Boolean)` entfernt man falsy-Werte wie `0`, `""`, `null`, `undefined` und `NaN`.',
    'array.filter((element, index, array) => bedingung)',
    "const zahlen = [1, 2, 3, 4, 5, 6];\nconsole.log(zahlen.filter((x) => x % 2 === 0)); // → [2,4,6]\nconsole.log([0, 'a', '', null, 5].filter(Boolean)); // → [\"a\",5]\nconst unique = [1, 2, 2, 3].filter((x, i, arr) => arr.indexOf(x) === i);\nconsole.log(unique); // → [1,2,3]",
    { keywords: ['filtern', 'auswählen', 'where', 'suchen'], related: ['map()', 'find() / findLast()', 'reduce()', 'some()'], mdn: 'Array/filter' });

  P(A, 'reduce()', 'Faltet ein Array mit einer Akkumulator-Funktion zu einem einzigen Wert.',
    'Der Callback erhält Akkumulator und aktuelles Element und gibt den neuen Akkumulator zurück; `startwert` ist der erste Akkumulator. Ohne Startwert dient das erste Element dazu, und ein leeres Array wirft einen `TypeError`. Das Ergebnis kann beliebig sein: Zahl, Objekt, Array.',
    'array.reduce((acc, element, index, array) => neuerAcc, startwert?)',
    "const preise = [4.5, 10, 2.5];\nconsole.log(preise.reduce((summe, p) => summe + p, 0)); // → 17\nconst woerter = ['a', 'b', 'a', 'c', 'a'];\nconst zaehler = woerter.reduce((acc, w) => {\n  acc[w] = (acc[w] || 0) + 1;\n  return acc;\n}, {});\nconsole.log(zaehler); // → {\"a\":3,\"b\":1,\"c\":1}\ntry {\n  [].reduce((a, b) => a + b);\n} catch (e) {\n  console.log(e.name); // → TypeError\n}",
    { tip: 'Immer einen Startwert angeben, dann ist auch das leere Array sicher.', keywords: ['summe', 'aggregieren', 'fold', 'zählen', 'akkumulator', 'reduceRight'], related: ['map()', 'filter()', 'Object.groupBy()'], mdn: 'Array/reduce' });

  P(A, 'forEach()', 'Ruft eine Funktion für jedes Element auf (ohne Rückgabe).',
    'Führt Nebeneffekte aus und gibt immer `undefined` zurück. Die Schleife lässt sich nicht mit `break` oder `return` abbrechen, und `async`-Callbacks werden nicht abgewartet. Für Abbruch eignet sich `for...of`, `some()` oder `every()`.',
    'array.forEach((element, index, array) => { ... })',
    "['a', 'b', 'c'].forEach((wert, i) => {\n  console.log(i, wert);\n});\n// → 0 a / 1 b / 2 c\nconst r = [1, 2].forEach((x) => x * 2);\nconsole.log(r); // → undefined",
    { keywords: ['schleife', 'iterieren', 'durchlaufen', 'loop', 'each'], related: ['map()', 'some()', 'keys() / values() / entries()'], mdn: 'Array/forEach' });

  P(A, 'find() / findLast()', 'Liefert das erste bzw. letzte Element, das eine Bedingung erfüllt.',
    'Gibt das Element selbst zurück, nicht den Index, und `undefined`, wenn nichts passt. `find` sucht von vorn, `findLast` von hinten. Für den Index dienen `findIndex()` und `findLastIndex()`.',
    'array.find((element, index, array) => bedingung)  |  array.findLast(...)',
    "const zahlen = [5, 12, 8, 130, 44];\nconsole.log(zahlen.find((x) => x > 10)); // → 12\nconsole.log(zahlen.findLast((x) => x > 10)); // → 44\nconsole.log(zahlen.find((x) => x > 500)); // → undefined\nconst user = [{ id: 1, n: 'Ada' }, { id: 2, n: 'Linus' }];\nconsole.log(user.find((u) => u.id === 2)); // → {\"id\":2,\"n\":\"Linus\"}",
    { keywords: ['suchen', 'finden', 'erstes element', 'letztes element'], related: ['findIndex()', 'filter()', 'includes() (Array)', 'some()'], mdn: 'Array/find' });

  P(A, 'findIndex()', 'Index des ersten Elements, das eine Bedingung erfüllt, sonst -1.',
    'Wie `find()`, liefert aber die Position statt des Elements; ohne Treffer `-1`. `findLastIndex()` sucht von hinten. Praktisch, wenn man danach per `splice()` oder `with()` ändern will.',
    'array.findIndex((element, index, array) => bedingung)',
    "const user = [{ id: 1 }, { id: 2 }, { id: 3 }];\nconst i = user.findIndex((u) => u.id === 2);\nconsole.log(i); // → 1\nconsole.log(user.findIndex((u) => u.id === 9)); // → -1\nconsole.log(user.findLastIndex((u) => u.id < 3)); // → 1",
    { keywords: ['position', 'index suchen'], related: ['find() / findLast()', 'indexOf() (Array)', 'splice()'], mdn: 'Array/findIndex' });

  P(A, 'some()', 'Prüft, ob mindestens ein Element die Bedingung erfüllt.',
    'Gibt `true` zurück, sobald ein Element passt (Kurzschluss), sonst `false`. Bei einem leeren Array ist das Ergebnis immer `false`.',
    'array.some((element, index, array) => bedingung)',
    "const zahlen = [1, 3, 5, 6];\nconsole.log(zahlen.some((x) => x % 2 === 0)); // → true\nconsole.log([1, 3].some((x) => x % 2 === 0)); // → false\nconsole.log([].some(() => true)); // → false",
    { keywords: ['mindestens eines', 'any', 'exists'], related: ['every()', 'includes() (Array)', 'find() / findLast()'], mdn: 'Array/some' });

  P(A, 'every()', 'Prüft, ob alle Elemente die Bedingung erfüllen.',
    'Gibt `false` zurück, sobald ein Element nicht passt (Kurzschluss), sonst `true`. Bei einem leeren Array ist das Ergebnis immer `true`, was oft überrascht.',
    'array.every((element, index, array) => bedingung)',
    "console.log([2, 4, 6].every((x) => x % 2 === 0)); // → true\nconsole.log([2, 3].every((x) => x % 2 === 0)); // → false\nconsole.log([].every(() => false)); // → true (leer!)",
    { keywords: ['alle', 'all', 'forall'], related: ['some()', 'filter()'], mdn: 'Array/every' });

  P(A, 'includes() (Array)', 'Prüft, ob ein Wert im Array vorkommt.',
    'Liefert `true` oder `false` und vergleicht mit SameValueZero (strikt wie `===`, aber `NaN` wird gefunden). Für Objekte wird die Referenz verglichen, nicht der Inhalt.',
    'array.includes(wert, startIndex?)',
    "console.log([1, 2, 3].includes(2)); // → true\nconsole.log([NaN].includes(NaN)); // → true\nconsole.log([NaN].indexOf(NaN)); // → -1\nconsole.log([{ a: 1 }].includes({ a: 1 })); // → false (andere Referenz)\nconsole.log(['x', 'y'].includes('X')); // → false",
    { keywords: ['enthält', 'contains', 'vorhanden'], related: ['indexOf() (Array)', 'some()', 'includes() (String)'], mdn: 'Array/includes' });

  P(A, 'indexOf() (Array)', 'Index des ersten passenden Elements oder -1.',
    'Vergleicht strikt mit `===` und findet daher kein `NaN`. Objekte werden per Referenz verglichen. `lastIndexOf()` sucht von hinten. Für Bedingungen statt Werten nutzt man `findIndex()`.',
    'array.indexOf(wert, startIndex?)',
    "const a = ['x', 'y', 'z', 'y'];\nconsole.log(a.indexOf('y')); // → 1\nconsole.log(a.lastIndexOf('y')); // → 3\nconsole.log(a.indexOf('q')); // → -1\nconsole.log([NaN].indexOf(NaN)); // → -1",
    { keywords: ['position', 'suchen', 'lastIndexOf'], related: ['includes() (Array)', 'findIndex()', 'indexOf() (String)'], mdn: 'Array/indexOf' });

  P(A, 'sort()', 'Sortiert ein Array in-place; Standard ist String-Vergleich.',
    'Mutiert das Array und gibt es zurück. Ohne Vergleichsfunktion wird alles in Strings umgewandelt und nach UTF-16 sortiert, daher steht `10` vor `9`. Die Vergleichsfunktion `(a, b) => ...` liefert negativ (a vor b), 0 oder positiv. Die Sortierung ist stabil.',
    'array.sort(vergleich?)',
    "const z = [10, 9, 1, 100];\nconsole.log([...z].sort()); // → [1,10,100,9] (String-Vergleich!)\nconsole.log([...z].sort((a, b) => a - b)); // → [1,9,10,100]\nconsole.log([...z].sort((a, b) => b - a)); // → [100,10,9,1]\nconst leute = [{ n: 'Zoe' }, { n: 'Ada' }];\nleute.sort((a, b) => a.n.localeCompare(b.n));\nconsole.log(leute.map((l) => l.n)); // → [\"Ada\",\"Zoe\"]",
    { tip: 'Zum Sortieren ohne Mutation `toSorted()` oder vorher kopieren `[...a].sort()`.', keywords: ['sortieren', 'ordnen', 'reihenfolge', 'compare', 'comparator'], related: ['toSorted()', 'reverse() / toReversed()', 'localeCompare()'], mdn: 'Array/sort' });

  P(A, 'toSorted()', 'Sortierte Kopie eines Arrays, das Original bleibt unverändert.',
    'Nicht-mutierende Variante von `sort()` (ES2023). Gleiche Vergleichslogik, aber das Ergebnis ist ein neues Array. Ideal für unveränderliche Zustandsverwaltung.',
    'array.toSorted(vergleich?)',
    "const z = [3, 1, 2];\nconst s = z.toSorted((a, b) => a - b);\nconsole.log(s); // → [1,2,3]\nconsole.log(z); // → [3,1,2] (unverändert)",
    { keywords: ['sortieren ohne mutation', 'immutable', 'kopie'], related: ['sort()', 'reverse() / toReversed()', 'toSpliced()', 'with()'], mdn: 'Array/toSorted' });

  P(A, 'reverse() / toReversed()', 'Kehrt die Reihenfolge um, mutierend bzw. als Kopie.',
    '`reverse()` verändert das Array in-place und gibt es zurück. `toReversed()` (ES2023) liefert ein neues umgekehrtes Array und lässt das Original unberührt.',
    'array.reverse()  |  array.toReversed()',
    "const a = [1, 2, 3];\nconsole.log(a.toReversed()); // → [3,2,1]\nconsole.log(a); // → [1,2,3]\nconsole.log(a.reverse()); // → [3,2,1]\nconsole.log(a); // → [3,2,1] (mutiert)\nconsole.log([...'abc'].reverse().join('')); // → cba",
    { keywords: ['umdrehen', 'umkehren', 'invertieren'], related: ['sort()', 'toSorted()'], mdn: 'Array/reverse' });

  P(A, 'toSpliced()', 'Nicht-mutierende Variante von splice().',
    'Gibt ein neues Array zurück, in dem ab `start` Elemente entfernt und/oder eingefügt wurden; das Original bleibt gleich. Im Gegensatz zu `splice()` wird nicht das entfernte Stück, sondern das neue Array geliefert.',
    'array.toSpliced(start, deleteCount?, ...neueElemente)',
    "const a = [1, 2, 3, 4];\nconsole.log(a.toSpliced(1, 2, 'x')); // → [1,\"x\",4]\nconsole.log(a.toSpliced(1, 0, 'neu')); // → [1,\"neu\",2,3,4]\nconsole.log(a); // → [1,2,3,4]",
    { keywords: ['einfügen ohne mutation', 'immutable'], related: ['splice()', 'with()', 'toSorted()'], mdn: 'Array/toSpliced' });

  P(A, 'with()', 'Kopie des Arrays mit einem ersetzten Element.',
    'Gibt ein neues Array zurück, in dem das Element am Index ersetzt ist (negativer Index erlaubt); das Original bleibt unverändert. Liegt der Index außerhalb des Arrays, wird ein `RangeError` geworfen.',
    'array.with(index, neuerWert)',
    "const a = [1, 2, 3];\nconsole.log(a.with(1, 99)); // → [1,99,3]\nconsole.log(a.with(-1, 0)); // → [1,2,0]\nconsole.log(a); // → [1,2,3]\ntry {\n  a.with(5, 0);\n} catch (e) {\n  console.log(e.name); // → RangeError\n}",
    { keywords: ['element ersetzen', 'immutable', 'update'], related: ['toSpliced()', 'splice()', 'at() (Array)'], mdn: 'Array/with' });

  P(A, 'flat()', 'Glättet verschachtelte Arrays um eine oder mehrere Ebenen.',
    'Gibt ein neues, flacheres Array zurück. Die Standardtiefe ist 1; `Infinity` glättet vollständig. Leere Löcher in Arrays werden dabei entfernt.',
    'array.flat(tiefe = 1)',
    "const a = [1, [2, [3, [4]]]];\nconsole.log(a.flat()); // → [1,2,[3,[4]]]\nconsole.log(a.flat(2)); // → [1,2,3,[4]]\nconsole.log(a.flat(Infinity)); // → [1,2,3,4]\nconsole.log([1, , 3].flat()); // → [1,3]",
    { keywords: ['glätten', 'verschachtelt', 'flatten', 'abflachen'], related: ['flatMap()', 'concat() (Array)'], mdn: 'Array/flat' });

  P(A, 'flatMap()', 'map() gefolgt von flat(1) in einem Schritt.',
    'Der Callback darf pro Element ein Array liefern, das ins Ergebnis eingefügt wird. Damit kann man Elemente vervielfachen oder durch Rückgabe von `[]` entfernen. Es wird nur eine Ebene geglättet.',
    'array.flatMap((element, index, array) => wertOderArray)',
    "console.log(['a b', 'c'].flatMap((s) => s.split(' '))); // → [\"a\",\"b\",\"c\"]\nconsole.log([1, 2, 3].flatMap((x) => [x, x * 10])); // → [1,10,2,20,3,30]\nconsole.log([1, 2, 3, 4].flatMap((x) => (x % 2 ? [] : [x]))); // → [2,4]",
    { keywords: ['map flat', 'vervielfachen'], related: ['map()', 'flat()', 'filter()'], mdn: 'Array/flatMap' });

  P(A, 'join()', 'Verbindet die Elemente zu einem String mit Trennzeichen.',
    'Wandelt jedes Element in einen String und trennt sie mit dem Trenner (Standard: Komma). `null` und `undefined` werden zu leeren Strings. Gegenstück zu `String.split()`.',
    'array.join(trenner = ",")',
    "console.log([1, 2, 3].join()); // → 1,2,3\nconsole.log(['a', 'b', 'c'].join(' - ')); // → a - b - c\nconsole.log([1, 2, 3].join('')); // → 123\nconsole.log([null, undefined, 1].join('|')); // → ||1",
    { keywords: ['zusammenfügen', 'string aus array', 'implode'], related: ['split()', 'concat() (Array)'], mdn: 'Array/join' });

  P(A, 'fill()', 'Füllt Bereiche eines Arrays mit einem festen Wert (mutiert).',
    'Setzt alle Elemente von `start` bis `end` auf den Wert und gibt das Array zurück. Nützlich zum Initialisieren: `new Array(n).fill(0)`. Fallstrick: Bei Objekten teilen sich alle Slots dieselbe Referenz.',
    'array.fill(wert, start?, end?)',
    "console.log(new Array(3).fill(0)); // → [0,0,0]\nconsole.log([1, 2, 3, 4].fill(9, 1, 3)); // → [1,9,9,4]\nconst falsch = new Array(2).fill([]);\nfalsch[0].push('x');\nconsole.log(falsch); // → [[\"x\"],[\"x\"]] (gleiche Referenz!)\nconst richtig = Array.from({ length: 2 }, () => []);\nrichtig[0].push('x');\nconsole.log(richtig); // → [[\"x\"],[]]",
    { keywords: ['initialisieren', 'füllen', 'vorbelegen'], related: ['Array.from()', 'Array.of()'], mdn: 'Array/fill' });

  P(A, 'at() (Array)', 'Element an einem Index, auch negativ vom Ende.',
    'Wie `a[i]`, aber `-1` liefert das letzte Element, `-2` das vorletzte usw. Außerhalb des Bereichs ergibt sich `undefined`. Ersetzt das Muster `a[a.length - 1]`.',
    'array.at(index)',
    "const a = ['a', 'b', 'c'];\nconsole.log(a.at(0)); // → a\nconsole.log(a.at(-1)); // → c\nconsole.log(a.at(5)); // → undefined",
    { keywords: ['letztes element', 'negativer index', 'last'], related: ['at() (String)', 'with()'], mdn: 'Array/at' });

  P(A, 'keys() / values() / entries()', 'Liefern Iteratoren über Indizes, Werte bzw. [Index, Wert]-Paare.',
    'Die Methoden geben Iteratoren zurück, die man mit `for...of`, Spread oder `Array.from()` verbrauchen kann. `entries()` zusammen mit Destructuring ist die übliche Art, Index und Wert gleichzeitig zu bekommen.',
    'array.keys()  |  array.values()  |  array.entries()',
    "const a = ['x', 'y'];\nconsole.log([...a.keys()]); // → [0,1]\nconsole.log([...a.values()]); // → [\"x\",\"y\"]\nconsole.log([...a.entries()]); // → [[0,\"x\"],[1,\"y\"]]\nfor (const [i, wert] of a.entries()) {\n  console.log(i, wert); // → 0 x, 1 y\n}",
    { keywords: ['iterator', 'index und wert', 'for of', 'enumerate'], related: ['forEach()', 'Iterator-Protokoll', 'Iterator-Helfer (map, filter, take)'], mdn: 'Array/entries' });

  P(A, 'Array.from()', 'Erzeugt ein Array aus iterierbaren oder array-ähnlichen Objekten.',
    'Akzeptiert Iterables (String, Set, Map …) und Objekte mit `length`. Das optionale zweite Argument ist eine Mapping-Funktion. Typisch: Zahlenfolgen erzeugen oder NodeLists in echte Arrays umwandeln.',
    'Array.from(quelle, mapFn?)',
    "console.log(Array.from('abc')); // → [\"a\",\"b\",\"c\"]\nconsole.log(Array.from(new Set([1, 1, 2]))); // → [1,2]\nconsole.log(Array.from({ length: 3 }, (_, i) => i * 2)); // → [0,2,4]\nconsole.log(Array.from(new Map([['a', 1]]))); // → [[\"a\",1]]",
    { keywords: ['konvertieren', 'range', 'nodelist', 'iterable', 'zahlenfolge'], related: ['Array.of()', 'fill()', 'Array-Literal'], mdn: 'Array/from' });

  P(A, 'Array.of()', 'Erzeugt ein Array aus den übergebenen Argumenten.',
    'Löst die Inkonsistenz des Konstruktors: `new Array(3)` erzeugt ein leeres Array der Länge 3, `Array.of(3)` dagegen `[3]`.',
    'Array.of(element1, ..., elementN)',
    "console.log(Array.of(3)); // → [3]\nconsole.log(new Array(3)); // → [null,null,null] (3 leere Slots)\nconsole.log(new Array(3).length); // → 3\nconsole.log(Array.of(1, 2, 3)); // → [1,2,3]",
    { keywords: ['konstruktor', 'array erzeugen'], related: ['Array.from()', 'Array-Literal'], mdn: 'Array/of' });

  P(A, 'Array.isArray()', 'Prüft zuverlässig, ob ein Wert ein Array ist.',
    'Liefert `true` für echte Arrays, auch aus anderen Frames oder Realms. Es ist `typeof` und `instanceof` überlegen, denn `typeof []` ergibt nur `"object"`.',
    'Array.isArray(wert)',
    "console.log(Array.isArray([1, 2])); // → true\nconsole.log(Array.isArray('abc')); // → false\nconsole.log(Array.isArray({ length: 0 })); // → false\nconsole.log(typeof []); // → object",
    { keywords: ['typ prüfen', 'typeof', 'ist array'], related: ['Array.from()', 'Array-Literal'], mdn: 'Array/isArray' });

  P(A, 'Object.groupBy()', 'Gruppiert Elemente einer Sammlung nach einem berechneten Schlüssel.',
    'Der Callback liefert pro Element einen Schlüssel; das Ergebnis ist ein Objekt ohne Prototyp, dessen Werte Arrays sind. `Map.groupBy()` macht dasselbe mit beliebigen Schlüsseltypen. Verfügbar in aktuellen Browsern (ES2024); ältere Umgebungen brauchen ein Polyfill.',
    'Object.groupBy(iterable, (element, index) => schluessel)',
    "const waren = [\n  { n: 'Apfel', typ: 'obst' },\n  { n: 'Karotte', typ: 'gemuese' },\n  { n: 'Birne', typ: 'obst' }\n];\nconst gruppen = Object.groupBy(waren, (w) => w.typ);\nconsole.log(gruppen.obst.map((w) => w.n)); // → [\"Apfel\",\"Birne\"]\nconsole.log(Object.keys(gruppen)); // → [\"obst\",\"gemuese\"]\nconst zahlen = Object.groupBy([1, 2, 3, 4], (x) => (x % 2 ? 'ungerade' : 'gerade'));\nconsole.log(zahlen); // → {\"ungerade\":[1,3],\"gerade\":[2,4]}",
    { keywords: ['gruppieren', 'group by', 'kategorisieren', 'Map.groupBy'], related: ['reduce()', 'Map'], mdn: 'Object/groupBy' });

  // ---------------- Zahlen & Mathe ----------------
  var N = 'Zahlen & Mathe';
  P(N, 'Number()', 'Wandelt einen Wert strikt in eine Zahl um.',
    'Der Gesamtstring muss eine gültige Zahl sein, sonst ergibt sich `NaN`. Leerer String und `null` werden zu `0`, `undefined` zu `NaN`, `true` zu `1`. Ein unärer Plus (`+wert`) verhält sich identisch.',
    'Number(wert)',
    "console.log(Number('42')); // → 42\nconsole.log(Number('3.14')); // → 3.14\nconsole.log(Number('')); // → 0\nconsole.log(Number('12px')); // → NaN\nconsole.log(Number(null), Number(undefined)); // → 0 NaN\nconsole.log(Number(true)); // → 1\nconsole.log(+'7'); // → 7",
    { keywords: ['umwandeln', 'string zu zahl', 'konvertieren', 'cast'], related: ['parseInt()', 'parseFloat()', 'Number.isNaN()'], mdn: 'Number' });

  P(N, 'parseInt()', 'Liest eine ganze Zahl vom Anfang eines Strings.',
    'Parst so weit wie möglich und ignoriert den Rest (`"12px"` → 12). Der zweite Parameter ist die Basis (2–36); gib sie immer an. Beginnt der Text nicht mit einer Ziffer, ist das Ergebnis `NaN`. Nachkommastellen werden abgeschnitten, nicht gerundet.',
    'parseInt(text, basis?)',
    "console.log(parseInt('42px', 10)); // → 42\nconsole.log(parseInt('3.99', 10)); // → 3\nconsole.log(parseInt('101', 2)); // → 5\nconsole.log(parseInt('ff', 16)); // → 255\nconsole.log(parseInt('abc', 10)); // → NaN\nconsole.log(parseInt('', 10)); // → NaN",
    { keywords: ['ganzzahl', 'string parsen', 'radix', 'basis'], related: ['parseFloat()', 'Number()', 'Math.round() / floor() / ceil() / trunc()'], mdn: 'parseInt' });

  P(N, 'parseFloat()', 'Liest eine Dezimalzahl vom Anfang eines Strings.',
    'Wie `parseInt()`, aber mit Nachkommastellen und Exponent; es gibt keine Basis. Als Dezimaltrenner gilt nur der Punkt, daher wird `"3,5"` zu `3`.',
    'parseFloat(text)',
    "console.log(parseFloat('3.14abc')); // → 3.14\nconsole.log(parseFloat('  2.5 ')); // → 2.5\nconsole.log(parseFloat('1e3')); // → 1000\nconsole.log(parseFloat('3,5')); // → 3 (Komma wird nicht erkannt)\nconsole.log(parseFloat('x')); // → NaN",
    { keywords: ['dezimalzahl', 'komma', 'fließkomma', 'string parsen'], related: ['parseInt()', 'Number()', 'Intl.NumberFormat'], mdn: 'parseFloat' });

  P(N, 'toFixed()', 'Formatiert eine Zahl mit fester Zahl an Nachkommastellen als String.',
    'Gibt einen String zurück, keine Zahl. Wegen binärer Gleitkommadarstellung kann das Runden überraschen (`1.005.toFixed(2)` ergibt `"1.00"`). Für lokalisierte Ausgabe eignet sich `Intl.NumberFormat`.',
    'zahl.toFixed(nachkommastellen)',
    "console.log((3.14159).toFixed(2)); // → 3.14\nconsole.log((5).toFixed(2)); // → 5.00\nconsole.log((1.005).toFixed(2)); // → 1.00 (nicht 1.01)\nconsole.log(typeof (2.5).toFixed(1)); // → string\nconsole.log(Number((2.567).toFixed(1))); // → 2.6",
    { keywords: ['runden', 'nachkommastellen', 'dezimalstellen', 'formatieren', 'toPrecision'], related: ['Math.round() / floor() / ceil() / trunc()', 'Intl.NumberFormat', 'Gleitkomma-Genauigkeit'], mdn: 'Number/toFixed' });

  P(N, 'Number.isNaN()', 'Prüft strikt, ob ein Wert exakt NaN ist.',
    'Anders als die globale `isNaN()` erzwingt `Number.isNaN()` keine Typumwandlung: Nur der Wert `NaN` selbst liefert `true`. `NaN === NaN` ist immer `false`, deshalb braucht man diese Funktion.',
    'Number.isNaN(wert)',
    "console.log(Number.isNaN(NaN)); // → true\nconsole.log(Number.isNaN('abc')); // → false\nconsole.log(isNaN('abc')); // → true (wandelt erst um!)\nconsole.log(NaN === NaN); // → false\nconsole.log(Number.isNaN(Number('x'))); // → true",
    { keywords: ['nan prüfen', 'keine zahl', 'isNaN', 'isFinite'], related: ['NaN & Infinity', 'Number.isInteger()', 'Number()'], mdn: 'Number/isNaN' });

  P(N, 'Number.isInteger()', 'Prüft, ob ein Wert eine ganze Zahl ist.',
    'Liefert `true` nur für Werte vom Typ Number ohne Nachkommaanteil. `5.0` ist ganzzahlig, `"5"` nicht. `Number.isSafeInteger()` prüft zusätzlich, ob die Zahl sicher darstellbar ist.',
    'Number.isInteger(wert)',
    "console.log(Number.isInteger(5)); // → true\nconsole.log(Number.isInteger(5.0)); // → true\nconsole.log(Number.isInteger(5.5)); // → false\nconsole.log(Number.isInteger('5')); // → false\nconsole.log(Number.isSafeInteger(2 ** 53)); // → false",
    { keywords: ['ganzzahl prüfen', 'integer', 'isSafeInteger'], related: ['Number.isNaN()', 'Number()', 'BigInt'], mdn: 'Number/isInteger' });

  P(N, 'NaN & Infinity', 'Spezielle Zahlenwerte für ungültige bzw. unendliche Ergebnisse.',
    '`NaN` (Not a Number) entsteht bei ungültigen Rechnungen und ist der einzige Wert, der nicht gleich sich selbst ist. `Infinity` und `-Infinity` entstehen etwa bei Division durch 0 (kein Fehler!). Beide haben den Typ `number`. Prüfen mit `Number.isNaN()`, `Number.isFinite()` oder `Object.is()`.',
    'NaN  |  Infinity  |  -Infinity',
    "console.log(0 / 0); // → NaN\nconsole.log(1 / 0, -1 / 0); // → Infinity -Infinity\nconsole.log(typeof NaN); // → number\nconsole.log(NaN === NaN); // → false\nconsole.log(Object.is(NaN, NaN)); // → true\nconsole.log(Number.isFinite(Infinity)); // → false\nconsole.log(Math.max()); // → -Infinity",
    { keywords: ['not a number', 'unendlich', 'division durch null', 'isFinite'], related: ['Number.isNaN()', 'Number()', 'Math.max() / Math.min()'], mdn: 'NaN' });

  P(N, 'Gleitkomma-Genauigkeit', 'Warum 0.1 + 0.2 nicht exakt 0.3 ergibt.',
    'JavaScript speichert Zahlen als 64-Bit-Binärgleitkommazahlen (IEEE 754). Viele Dezimalbrüche wie 0.1 sind darin nicht exakt darstellbar, es entstehen winzige Rundungsfehler. Vergleiche daher mit Toleranz (`Number.EPSILON`) und rechne bei Geld in ganzen Cent-Beträgen.',
    'Math.abs(a - b) < Number.EPSILON',
    "console.log(0.1 + 0.2); // → 0.30000000000000004\nconsole.log(0.1 + 0.2 === 0.3); // → false\nconsole.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // → true\nconsole.log(Number((0.1 + 0.2).toFixed(2))); // → 0.3\nconst cent = 10 + 20; // Geld in Cent rechnen\nconsole.log(cent / 100); // → 0.3",
    { tip: 'Für Geld: ganze Cent-Beträge oder BigInt verwenden und erst zur Anzeige formatieren.', keywords: ['rundungsfehler', 'ieee 754', 'epsilon', 'float', 'präzision', '0.1 + 0.2'], related: ['toFixed()', 'BigInt', 'Intl.NumberFormat'], mdn: 'Number/EPSILON' });

  P(N, 'Math.round() / floor() / ceil() / trunc()', 'Runden auf ganze Zahlen in vier Varianten.',
    '`round` rundet kaufmännisch (bei .5 Richtung +Infinity), `floor` immer ab, `ceil` immer auf, `trunc` schneidet den Nachkommaanteil ab. Bei negativen Zahlen unterscheiden sich `floor` und `trunc`. Für Rundung auf Nachkommastellen: `Math.round(x * 100) / 100`.',
    'Math.round(x)  |  Math.floor(x)  |  Math.ceil(x)  |  Math.trunc(x)',
    "console.log(Math.round(2.5), Math.round(-2.5)); // → 3 -2\nconsole.log(Math.floor(4.7), Math.floor(-4.7)); // → 4 -5\nconsole.log(Math.ceil(4.2), Math.ceil(-4.2)); // → 5 -4\nconsole.log(Math.trunc(4.7), Math.trunc(-4.7)); // → 4 -4\nconsole.log(Math.round(1.2345 * 100) / 100); // → 1.23",
    { values: [['Math.round', 'Zur nächsten ganzen Zahl'], ['Math.floor', 'Abrunden Richtung -Infinity'], ['Math.ceil', 'Aufrunden Richtung +Infinity'], ['Math.trunc', 'Nachkommastellen abschneiden (Richtung 0)']],
      keywords: ['runden', 'abrunden', 'aufrunden', 'abschneiden', 'round'], related: ['toFixed()', 'parseInt()', 'Math.random()'], mdn: 'Math/round' });

  P(N, 'Math.random()', 'Liefert eine Zufallszahl im Bereich [0, 1).',
    'Gibt eine Gleitkommazahl von 0 (inklusive) bis kleiner 1 zurück. Für Ganzzahlen in einem Bereich skaliert man und rundet ab. Nicht kryptografisch sicher: Für Tokens oder Passwörter `crypto.getRandomValues()` nutzen.',
    'Math.random()',
    "const r = Math.random();\nconsole.log(r >= 0 && r < 1); // → true\n// Ganzzahl von min bis max (beide inklusive)\nfunction zufall(min, max) {\n  return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconst w = zufall(1, 6);\nconsole.log(w >= 1 && w <= 6); // → true\nconst liste = ['a', 'b', 'c'];\nconsole.log(liste.includes(liste[Math.floor(Math.random() * liste.length)])); // → true",
    { keywords: ['zufall', 'würfel', 'random', 'zufallszahl'], related: ['Math.round() / floor() / ceil() / trunc()', 'Math.max() / Math.min()'], mdn: 'Math/random' });

  P(N, 'Math.max() / Math.min()', 'Größter bzw. kleinster Wert einer Liste von Zahlen.',
    'Nimmt beliebig viele Argumente, keine Arrays; ein Array wird per Spread übergeben. Ohne Argumente ergibt `max` den Wert `-Infinity` und `min` `Infinity`. Ist ein Argument `NaN`, ist das Ergebnis `NaN`. Mit beiden lässt sich ein Wert klemmen (clamp).',
    'Math.max(a, b, ...)  |  Math.min(a, b, ...)',
    "console.log(Math.max(3, 9, 5)); // → 9\nconsole.log(Math.min(3, 9, 5)); // → 3\nconst zahlen = [4, 8, 1];\nconsole.log(Math.max(...zahlen)); // → 8\nconsole.log(Math.max()); // → -Infinity\nconsole.log(Math.max(1, NaN)); // → NaN\nconst klemme = (x, lo, hi) => Math.min(Math.max(x, lo), hi);\nconsole.log(klemme(15, 0, 10)); // → 10",
    { keywords: ['maximum', 'minimum', 'größter wert', 'kleinster wert', 'clamp'], related: ['Math.abs() / pow() / sqrt()', 'reduce()'], mdn: 'Math/max' });

  P(N, 'Math.abs() / pow() / sqrt()', 'Betrag, Potenz und Quadratwurzel.',
    '`Math.abs(x)` liefert den Betrag, `Math.pow(x, y)` die Potenz (entspricht dem Operator `**`) und `Math.sqrt(x)` die Wurzel. Die Wurzel einer negativen Zahl ergibt `NaN`. Weitere nützliche Funktionen sind `Math.cbrt()`, `Math.hypot()` und `Math.sign()`.',
    'Math.abs(x)  |  Math.pow(x, y)  |  Math.sqrt(x)',
    "console.log(Math.abs(-7.5)); // → 7.5\nconsole.log(Math.pow(2, 10), 2 ** 10); // → 1024 1024\nconsole.log(Math.sqrt(16)); // → 4\nconsole.log(Math.sqrt(-1)); // → NaN\nconsole.log(Math.hypot(3, 4)); // → 5\nconsole.log(Math.sign(-3)); // → -1",
    { keywords: ['betrag', 'potenz', 'wurzel', 'hoch', 'exponent', 'hypot'], related: ['Math.max() / Math.min()', 'Math.round() / floor() / ceil() / trunc()'], mdn: 'Math' });

  P(N, 'BigInt-Arithmetik', 'Ganzzahlen beliebiger Größe, geschrieben mit Suffix n.',
    'Number ist nur bis `Number.MAX_SAFE_INTEGER` (2^53 - 1) exakt. `BigInt` rechnet mit beliebig großen Ganzzahlen, erlaubt aber keine Vermischung mit Number (`TypeError`) und keine Nachkommastellen. Division schneidet ab. `JSON.stringify` kann BigInt nicht ohne Weiteres serialisieren.',
    '123n  |  BigInt(wert)',
    "console.log(2n ** 64n); // → 18446744073709551616n\nconsole.log(Number.MAX_SAFE_INTEGER + 2); // → 9007199254740992 (falsch)\nconsole.log(BigInt(Number.MAX_SAFE_INTEGER) + 2n); // → 9007199254740993n\nconsole.log(7n / 2n); // → 3n\nconsole.log(typeof 5n); // → bigint\ntry {\n  1n + 1;\n} catch (e) {\n  console.log(e.name); // → TypeError\n}",
    { keywords: ['große zahlen', 'ganzzahl', 'arbitrary precision', 'bigint'], related: ['Number.isInteger()', 'Gleitkomma-Genauigkeit', 'Number()'], mdn: 'BigInt' });

  P(N, 'Intl.NumberFormat', 'Formatiert Zahlen sprach- und regionsabhängig (Währung, Prozent, Einheiten).',
    'Erzeugt einen Formatierer für eine Locale mit Optionen; `format()` liefert den fertigen String. Übernimmt Tausendertrenner, Dezimalzeichen, Währungssymbol und Rundung. Dieselbe Funktionalität steckt in `zahl.toLocaleString(locale, optionen)`.',
    'new Intl.NumberFormat(locale, optionen).format(zahl)',
    "const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });\nconsole.log(eur.format(1234.5)); // → 1.234,50 €\nconsole.log(new Intl.NumberFormat('en-US').format(1234567.891)); // → 1,234,567.891\nconsole.log((0.256).toLocaleString('de-DE', { style: 'percent' })); // → 26 %\nconsole.log(new Intl.NumberFormat('de-DE', { notation: 'compact' }).format(1500000)); // → 1,5 Mio.",
    { values: [['style', "'decimal' | 'currency' | 'percent' | 'unit'"], ['currency', "Währungscode, z. B. 'EUR', 'USD'"], ['minimumFractionDigits', 'Mindestzahl an Nachkommastellen'], ['maximumFractionDigits', 'Höchstzahl an Nachkommastellen'], ['notation', "'compact', 'scientific' …"]],
      keywords: ['währung', 'tausendertrenner', 'formatieren', 'toLocaleString', 'prozent', 'euro'], related: ['toFixed()', 'Intl.DateTimeFormat', 'localeCompare()'], mdn: 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat' });

  // ---------------- Datum & Zeit ----------------
  var D = 'Datum & Zeit';
  P(D, 'Date', 'Objekt für Zeitpunkte, intern Millisekunden seit 1.1.1970 UTC.',
    'Erzeugt wird es ohne Argument (jetzt), mit ISO-String, mit Millisekunden oder mit Einzelwerten `(Jahr, Monat, Tag, ...)`. Achtung: Monate zählen ab 0 (Januar = 0). Ein ISO-Datum ohne Uhrzeit (`"2024-03-15"`) wird als UTC interpretiert, mit Uhrzeit ohne Zone als lokale Zeit. Date-Objekte sind veränderlich.',
    'new Date()  |  new Date(isoString)  |  new Date(jahr, monat, tag, ...)',
    "const d1 = new Date('2024-03-15T12:30:00Z');\nconsole.log(d1.toISOString()); // → 2024-03-15T12:30:00.000Z\nconst d2 = new Date(2024, 0, 31); // Monat 0 = Januar\nconsole.log(d2.getMonth(), d2.getDate()); // → 0 31\nconsole.log(new Date('kein datum').getTime()); // → NaN\nconst differenz = new Date('2024-03-20') - new Date('2024-03-15');\nconsole.log(differenz / 86400000); // → 5 (Tage)",
    { tip: 'Für Zeitzonen und Kalenderrechnung ist `Temporal` die moderne Alternative.',
      keywords: ['datum', 'zeit', 'timestamp', 'zeitpunkt', 'iso', 'differenz'], related: ['Date-Methoden (get/set)', 'Date.now()', 'toLocaleDateString()', 'Temporal'], mdn: 'Date' });

  P(D, 'Date-Methoden (get/set)', 'Einzelne Bestandteile eines Date-Objekts lesen und setzen.',
    'Getter wie `getFullYear()`, `getMonth()` (0–11!), `getDate()` (Tag 1–31), `getDay()` (Wochentag, 0 = Sonntag), `getHours()` usw. liefern lokale Werte; die `getUTC...`-Varianten UTC. Setter verändern das Objekt und rechnen Überläufe automatisch um (31. Januar + 1 Monat ergibt Anfang März).',
    'd.getFullYear() | d.getMonth() | d.getDate() | d.getDay() | d.setDate(n) | d.getTime()',
    "const d = new Date(2024, 0, 31, 10, 30); // 31. Jan 2024\nconsole.log(d.getFullYear(), d.getMonth() + 1, d.getDate()); // → 2024 1 31\nconsole.log(d.getDay()); // → 3 (Mittwoch)\nd.setDate(d.getDate() + 10); // 10 Tage addieren\nconsole.log(d.getMonth() + 1, d.getDate()); // → 2 10\nconst e = new Date(2024, 0, 31);\ne.setMonth(1); // Februar hat keinen 31.\nconsole.log(e.getMonth() + 1, e.getDate()); // → 3 2",
    { values: [['getMonth()', '0 = Januar … 11 = Dezember'], ['getDay()', '0 = Sonntag … 6 = Samstag'], ['getDate()', 'Tag des Monats (1–31)'], ['getTime()', 'Millisekunden seit 1970 (UTC)'], ['getTimezoneOffset()', 'Abweichung zu UTC in Minuten']],
      keywords: ['jahr', 'monat', 'tag', 'wochentag', 'stunde', 'tage addieren'], related: ['Date', 'Date.now()', 'toLocaleDateString()'], mdn: 'Date/getMonth' });

  P(D, 'Date.now()', 'Aktuelle Zeit als Millisekunden seit 1.1.1970 UTC.',
    'Gibt eine Zahl zurück, ohne ein Date-Objekt anzulegen. Ideal für Zeitstempel und einfache Zeitmessungen. Für genauere Messungen nutzt man `performance.now()` (monoton, höher aufgelöst).',
    'Date.now()',
    "const start = Date.now();\nlet x = 0;\nfor (let i = 0; i < 1e6; i++) x += i;\nconst dauer = Date.now() - start;\nconsole.log(typeof start); // → number\nconsole.log(dauer >= 0); // → true\nconsole.log(new Date(start).getFullYear() >= 2024); // → true",
    { keywords: ['timestamp', 'zeitstempel', 'jetzt', 'now', 'zeit messen', 'performance'], related: ['Date', 'Date-Methoden (get/set)'], mdn: 'Date/now' });

  P(D, 'toLocaleDateString()', 'Formatiert Datum (bzw. Uhrzeit) passend zur Sprache.',
    'Mit Locale und Optionen entsteht eine lesbare Ausgabe, z. B. `"15.3.2024"` für `de-DE`. Verwandt sind `toLocaleTimeString()` und `toLocaleString()`. Für wiederholte Aufrufe ist ein wiederverwendeter `Intl.DateTimeFormat` schneller. Setze `timeZone` explizit, wenn die Ausgabe reproduzierbar sein soll.',
    'datum.toLocaleDateString(locale, optionen)',
    "const d = new Date('2024-03-15T12:00:00Z');\nconsole.log(d.toLocaleDateString('de-DE', { timeZone: 'UTC' })); // → 15.3.2024\nconsole.log(d.toLocaleDateString('de-DE', {\n  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'\n})); // → Freitag, 15. März 2024\nconsole.log(d.toLocaleDateString('en-US', { timeZone: 'UTC' })); // → 3/15/2024\nconsole.log(d.toLocaleTimeString('de-DE', { timeZone: 'UTC' })); // → 12:00:00",
    { values: [['weekday', "'long' | 'short' | 'narrow'"], ['year / month / day', "'numeric' | '2-digit' | 'long' …"], ['dateStyle', "'full' | 'long' | 'medium' | 'short'"], ['timeZone', "z. B. 'UTC', 'Europe/Berlin'"]],
      keywords: ['datum formatieren', 'locale', 'deutsches datum', 'wochentag', 'monatsname'], related: ['Intl.DateTimeFormat', 'Date', 'Intl.RelativeTimeFormat'], mdn: 'Date/toLocaleDateString' });

  P(D, 'Intl.DateTimeFormat', 'Wiederverwendbarer Formatierer für Datum und Uhrzeit nach Locale.',
    'Erzeugt einmalig einen Formatierer mit Locale und Optionen; `format()` und `formatToParts()` verarbeiten dann Date-Objekte. Die Optionen `dateStyle` und `timeStyle` decken die gängigen Formate kompakt ab, Einzelfelder wie `month: "long"` geben feine Kontrolle.',
    'new Intl.DateTimeFormat(locale, optionen).format(datum)',
    "const d = new Date('2024-03-15T14:05:00Z');\nconst f = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeZone: 'UTC' });\nconsole.log(f.format(d)); // → 15.03.2024\nconst g = new Intl.DateTimeFormat('de-DE', {\n  dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Berlin'\n});\nconsole.log(g.format(d)); // → Freitag, 15. März 2024 um 15:05\nconsole.log(new Intl.DateTimeFormat('en-GB', { month: 'long', timeZone: 'UTC' }).format(d)); // → March",
    { values: [['dateStyle', "'full' | 'long' | 'medium' | 'short'"], ['timeStyle', "'full' | 'long' | 'medium' | 'short'"], ['timeZone', "IANA-Zone, z. B. 'Europe/Berlin'"], ['hour12', 'true/false: 12- oder 24-Stunden-Format']],
      keywords: ['datum formatieren', 'uhrzeit', 'zeitzone', 'locale', 'format'], related: ['toLocaleDateString()', 'Intl.RelativeTimeFormat', 'Intl.NumberFormat'], mdn: 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat' });

  P(D, 'Intl.RelativeTimeFormat', 'Formatiert relative Zeitangaben wie "vor 3 Stunden" oder "morgen".',
    'Man übergibt einen Zahlenwert und eine Einheit (`second`, `minute`, `hour`, `day`, `week`, `month`, `year`). Negative Werte liegen in der Vergangenheit. Mit `numeric: "auto"` entstehen natürlichsprachige Wörter wie "gestern" statt "vor 1 Tag". Die Berechnung der Differenz muss man selbst erledigen.',
    'new Intl.RelativeTimeFormat(locale, { numeric }).format(wert, einheit)',
    "const rtf = new Intl.RelativeTimeFormat('de', { numeric: 'auto' });\nconsole.log(rtf.format(-1, 'day')); // → gestern\nconsole.log(rtf.format(2, 'day')); // → übermorgen\nconsole.log(rtf.format(-3, 'hour')); // → vor 3 Stunden\nconsole.log(rtf.format(1, 'week')); // → nächste Woche\nconsole.log(new Intl.RelativeTimeFormat('en').format(5, 'minute')); // → in 5 minutes",
    { values: [['numeric: \'always\'', '"vor 1 Tag" (Standard)'], ['numeric: \'auto\'', '"gestern", "morgen"'], ['style', "'long' | 'short' | 'narrow'"]],
      keywords: ['vor x minuten', 'relative zeit', 'time ago', 'gestern', 'morgen'], related: ['Intl.DateTimeFormat', 'Date.now()', 'toLocaleDateString()'], mdn: 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat' });

  P(D, 'Temporal', 'Moderne Datums-API als Ersatz für Date (noch nicht überall verfügbar).',
    '`Temporal` bietet unveränderliche Typen wie `PlainDate`, `PlainTime`, `ZonedDateTime` und `Duration`, klare Zeitzonenbehandlung und Monate ab 1. Der Standard ist weit fortgeschritten, aber die Browser-Unterstützung ist noch uneinheitlich. Prüfe deshalb per `typeof Temporal` und nutze sonst ein Polyfill (z. B. `@js-temporal/polyfill`).',
    'Temporal.PlainDate.from("2024-03-15")  |  Temporal.Now.instant()',
    "if (typeof Temporal === 'undefined') {\n  console.log('Temporal ist in diesem Browser nicht verfügbar.');\n} else {\n  const tag = Temporal.PlainDate.from('2024-03-15');\n  console.log(tag.add({ days: 20 }).toString()); // → 2024-04-04\n  console.log(tag.dayOfWeek); // → 5 (Freitag, 1 = Montag)\n  console.log(tag.month); // → 3 (Monate ab 1)\n  const bis = Temporal.PlainDate.from('2024-12-24');\n  console.log(tag.until(bis).days); // → 284\n}",
    { tip: 'Bis zur breiten Unterstützung: Feature-Check oder Polyfill einsetzen.', keywords: ['datum neu', 'zeitzone', 'immutable', 'zoneddatetime', 'plaindate', 'duration'], related: ['Date', 'Intl.DateTimeFormat'], mdn: 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Temporal' });

  // ---------------- Collections ----------------
  var C = 'Collections';
  P(C, 'Map', 'Schlüssel-Wert-Sammlung mit Schlüsseln beliebigen Typs und fester Reihenfolge.',
    'Anders als einfache Objekte erlaubt eine `Map` jeden Typ als Schlüssel (auch Objekte), merkt sich die Einfügereihenfolge und kennt `size`. Wichtige Methoden: `set()`, `get()`, `has()`, `delete()`, `clear()`. Iteration per `for...of` liefert `[schlüssel, wert]`-Paare. Zwischen Map und Objekt wandelt man mit `Object.fromEntries()` bzw. `new Map(Object.entries(obj))`.',
    'new Map([[schluessel, wert], ...])',
    "const m = new Map();\nm.set('a', 1).set('b', 2);\nconst key = { id: 1 };\nm.set(key, 'Objekt als Schlüssel');\nconsole.log(m.get('a'), m.size); // → 1 3\nconsole.log(m.has('x')); // → false\nconsole.log(m.get(key)); // → Objekt als Schlüssel\nm.delete('a');\nfor (const [k, v] of new Map([['x', 1], ['y', 2]])) {\n  console.log(k, v); // → x 1, y 2\n}\nconsole.log(Object.fromEntries(new Map([['p', 1]]))); // → {\"p\":1}",
    { keywords: ['dictionary', 'hashmap', 'wörterbuch', 'schlüssel wert', 'assoziatives array'], related: ['Set', 'WeakMap', 'Object.groupBy()'], mdn: 'Map' });

  P(C, 'Set', 'Sammlung eindeutiger Werte in Einfügereihenfolge.',
    'Jeder Wert kann nur einmal vorkommen (Vergleich wie `===`, aber `NaN` ist gleich `NaN`). Methoden: `add()`, `has()`, `delete()`, `clear()`, Eigenschaft `size`. Typischer Einsatz: Duplikate entfernen mit `[...new Set(array)]`. Objekte werden per Referenz verglichen.',
    'new Set(iterable?)',
    "const s = new Set([1, 2, 2, 3]);\nconsole.log(s.size); // → 3\ns.add(4).add(1); // 1 existiert schon\nconsole.log([...s]); // → [1,2,3,4]\nconsole.log(s.has(3)); // → true\nconsole.log([...new Set('hallo')].join('')); // → halo\nconsole.log([...new Set([{}, {}])].length); // → 2",
    { keywords: ['duplikate entfernen', 'unique', 'eindeutig', 'menge'], related: ['Map', 'Set-Methoden (union, intersection …)', 'WeakSet'], mdn: 'Set' });

  P(C, 'WeakMap', 'Map mit schwach referenzierten Objekt-Schlüsseln.',
    'Schlüssel müssen Objekte (oder nicht registrierte Symbole) sein. Hält ansonsten niemand eine Referenz auf den Schlüssel, darf der Garbage Collector Eintrag und Schlüssel entfernen. Daher gibt es weder `size` noch Iteration. Ideal für Metadaten oder private Daten zu Objekten ohne Speicherlecks.',
    'new WeakMap()',
    "const meta = new WeakMap();\nlet knoten = { name: 'Element' };\nmeta.set(knoten, { geklickt: 3 });\nconsole.log(meta.get(knoten)); // → {\"geklickt\":3}\nconsole.log(meta.has(knoten)); // → true\ntry {\n  meta.set('text', 1);\n} catch (e) {\n  console.log(e.name); // → TypeError (kein Objekt)\n}\nknoten = null; // Eintrag darf nun vom GC entfernt werden",
    { keywords: ['schwache referenz', 'garbage collection', 'private daten', 'metadaten'], related: ['Map', 'WeakSet', 'WeakRef'], mdn: 'WeakMap' });

  P(C, 'WeakSet', 'Set aus schwach referenzierten Objekten.',
    'Speichert nur Objekte und verhindert nicht deren Garbage Collection. Es gibt `add()`, `has()` und `delete()`, aber weder `size` noch Iteration. Sinnvoll, um Objekte zu markieren, z. B. "bereits besucht", ohne sie am Leben zu halten.',
    'new WeakSet()',
    "const besucht = new WeakSet();\nconst a = { id: 1 };\nconst b = { id: 2 };\nbesucht.add(a);\nconsole.log(besucht.has(a)); // → true\nconsole.log(besucht.has(b)); // → false\nbesucht.delete(a);\nconsole.log(besucht.has(a)); // → false",
    { keywords: ['markieren', 'besucht', 'schwache referenz'], related: ['Set', 'WeakMap', 'WeakRef'], mdn: 'WeakSet' });

  P(C, 'Set-Methoden (union, intersection …)', 'Mengenoperationen direkt auf Set-Objekten.',
    'Seit ES2025 bieten Sets `union()`, `intersection()`, `difference()`, `symmetricDifference()` sowie die Prüfungen `isSubsetOf()`, `isSupersetOf()` und `isDisjointFrom()`. Sie liefern neue Sets, ohne das Original zu ändern. Ältere Umgebungen brauchen Polyfills oder Handarbeit mit `filter()`.',
    'a.union(b)  |  a.intersection(b)  |  a.difference(b)  |  a.isSubsetOf(b)',
    "const a = new Set([1, 2, 3]);\nconst b = new Set([2, 3, 4]);\nif (typeof a.union !== 'function') {\n  console.log('Set-Methoden werden hier nicht unterstützt.');\n} else {\n  console.log([...a.union(b)]); // → [1,2,3,4]\n  console.log([...a.intersection(b)]); // → [2,3]\n  console.log([...a.difference(b)]); // → [1]\n  console.log([...a.symmetricDifference(b)]); // → [1,4]\n  console.log(new Set([2]).isSubsetOf(a)); // → true\n  console.log(a.isDisjointFrom(new Set([9]))); // → true\n}",
    { values: [['union(b)', 'Vereinigung: alle Elemente aus beiden'], ['intersection(b)', 'Schnittmenge: in beiden enthalten'], ['difference(b)', 'In a, aber nicht in b'], ['symmetricDifference(b)', 'In genau einem der beiden'], ['isSubsetOf(b)', 'a vollständig in b enthalten?'], ['isSupersetOf(b)', 'a enthält alle Elemente von b?'], ['isDisjointFrom(b)', 'Keine gemeinsamen Elemente?']],
      keywords: ['vereinigung', 'schnittmenge', 'differenz', 'mengenlehre'], related: ['Set', 'filter()'], mdn: 'Set/union' });

  P(C, 'WeakRef', 'Schwache Referenz auf ein Objekt, die den Garbage Collector nicht bremst.',
    'Ein `WeakRef` hält ein Objekt, ohne es am Leben zu halten. `deref()` gibt das Objekt zurück oder `undefined`, wenn es bereits eingesammelt wurde. Der Zeitpunkt der Bereinigung ist nicht vorhersagbar, deshalb nie auf ein bestimmtes Verhalten verlassen. Anwendungsfall sind Caches; im Alltag selten nötig.',
    'new WeakRef(objekt)  →  ref.deref()',
    "let daten = { gross: new Array(1000).fill(0) };\nconst ref = new WeakRef(daten);\nconst ergebnis = ref.deref();\nconsole.log(ergebnis === daten); // → true (solange Referenz besteht)\nconsole.log(typeof ref.deref()); // → object\n// Nach Verlust aller starken Referenzen kann deref() undefined liefern.\ndaten = null;",
    { tip: 'Wirkliche Cache-Logik besser mit WeakMap oder dedizierten Libraries lösen.', keywords: ['schwache referenz', 'cache', 'garbage collector', 'FinalizationRegistry'], related: ['WeakMap', 'WeakSet'], mdn: 'WeakRef' });

  // ---------------- JSON ----------------
  var J = 'JSON';
  P(J, 'JSON.stringify()', 'Wandelt einen JavaScript-Wert in einen JSON-String um.',
    'Funktionen, `undefined` und Symbole werden in Objekten ausgelassen (in Arrays zu `null`); `Date` wird per `toJSON()` zum ISO-String, `Map` und `Set` werden zu `{}`. Zirkuläre Strukturen und `BigInt` lösen einen `TypeError` aus. Der zweite Parameter filtert oder transformiert, der dritte formatiert mit Einrückung.',
    'JSON.stringify(wert, replacer?, einrueckung?)',
    "const obj = { name: 'Ada', alter: 36, tags: ['a', 'b'], f: () => 1, u: undefined };\nconsole.log(JSON.stringify(obj)); // → {\"name\":\"Ada\",\"alter\":36,\"tags\":[\"a\",\"b\"]}\nconsole.log(JSON.stringify(obj, ['name'])); // → {\"name\":\"Ada\"}\nconsole.log(JSON.stringify({ a: 1, b: [1, 2] }, null, 2));\nconsole.log(JSON.stringify({ d: new Date(0) })); // → {\"d\":\"1970-01-01T00:00:00.000Z\"}\nconst z = {};\nz.selbst = z;\ntry {\n  JSON.stringify(z);\n} catch (e) {\n  console.log(e.name); // → TypeError\n}",
    { values: [['replacer (Array)', 'Whitelist erlaubter Schlüssel'], ['replacer (Funktion)', '(key, value) => neuerWert; undefined entfernt'], ['einrueckung', 'Zahl (Leerzeichen) oder String']],
      keywords: ['serialisieren', 'objekt zu json', 'stringify', 'deep copy', 'speichern'], related: ['JSON.parse()', 'Map'], mdn: 'JSON/stringify' });

  P(J, 'JSON.parse()', 'Wandelt einen JSON-String in einen JavaScript-Wert um.',
    'Wirft bei ungültigem JSON einen `SyntaxError`; daher in `try...catch` verwenden. Strenge Syntax: Schlüssel in doppelten Anführungszeichen, keine abschließenden Kommas, keine Kommentare. Mit dem `reviver` lassen sich Werte nach dem Parsen umwandeln, z. B. Datumsstrings in `Date`.',
    'JSON.parse(text, reviver?)',
    "const daten = JSON.parse('{\"name\":\"Ada\",\"alter\":36,\"tags\":[1,2]}');\nconsole.log(daten.name, daten.tags.length); // → Ada 2\ntry {\n  JSON.parse(\"{'name': 'Ada'}\"); // einfache Anführungszeichen sind ungültig\n} catch (e) {\n  console.log(e.name); // → SyntaxError\n}\nconst mitDatum = JSON.parse('{\"d\":\"2024-03-15T00:00:00.000Z\"}', (k, v) =>\n  k === 'd' ? new Date(v) : v);\nconsole.log(mitDatum.d.getUTCFullYear()); // → 2024",
    { tip: 'Für tiefe Kopien ist `structuredClone()` meist besser als `JSON.parse(JSON.stringify(x))`.', keywords: ['parsen', 'json lesen', 'deserialisieren', 'reviver', 'syntaxerror'], related: ['JSON.stringify()'], mdn: 'JSON/parse' });

  // ---------------- Reguläre Ausdrücke ----------------
  var R = 'Reguläre Ausdrücke';
  P(R, 'RegExp-Literal', 'Muster zwischen Schrägstrichen, optional mit Flags.',
    'Ein Regex-Literal `/muster/flags` wird beim Laden des Skripts kompiliert. Für dynamische Muster erzeugt man mit `new RegExp(text, flags)` ein Objekt; dabei müssen Backslashes im String verdoppelt werden. Sonderzeichen wie `. * + ? ( ) [ ] { } | \\ ^ $` müssen für wörtliche Treffer mit `\\` maskiert werden.',
    '/muster/flags  |  new RegExp(muster, flags)',
    "const re = /ab+c/i;\nconsole.log(re.test('xABBCx')); // → true\nconsole.log(re.source, re.flags); // → ab+c i\nconst wort = 'Katze';\nconst dyn = new RegExp(wort, 'i');\nconsole.log(dyn.test('Die katze schläft')); // → true\nconsole.log(/\\d+/.exec('Zimmer 42')[0]); // → 42",
    { keywords: ['regex', 'regexp', 'muster', 'pattern', 'regulärer ausdruck'], related: ['Flags (g, i, m, s, u, y, d)', 'Zeichenklassen & Quantoren', 'test()', 'match()'], mdn: 'RegExp' });

  P(R, 'Flags (g, i, m, s, u, y, d)', 'Modifikatoren, die das Verhalten eines Regex steuern.',
    'Flags stehen hinter dem schließenden Schrägstrich und sind kombinierbar. `g` findet alle Treffer, `i` ignoriert Groß-/Kleinschreibung, `u` aktiviert volle Unicode-Unterstützung (z. B. `\\p{L}`). Mit `g` und `y` merkt sich das Regex-Objekt `lastIndex` zwischen Aufrufen, was bei `test()`/`exec()` zu Überraschungen führen kann.',
    '/muster/gimsuyd',
    "console.log('a1b2'.match(/\\d/g)); // → [\"1\",\"2\"]\nconsole.log(/hallo/i.test('HALLO')); // → true\nconsole.log('a\\nb'.match(/^b$/m)?.[0]); // → b\nconsole.log(/a.b/s.test('a\\nb')); // → true\nconsole.log('Ünï'.match(/\\p{L}+/u)[0]); // → Ünï\nconst m = /b+/d.exec('aabbb');\nconsole.log(m.indices[0]); // → [2,5]\nconst sticky = /foo/y;\nsticky.lastIndex = 3;\nconsole.log(sticky.test('barfoo')); // → true",
    { values: [['g', 'global: alle Treffer'], ['i', 'ignoreCase: Groß-/Kleinschreibung egal'], ['m', 'multiline: ^ und $ pro Zeile'], ['s', 'dotAll: . trifft auch Zeilenumbrüche'], ['u', 'unicode: Codepoints, \\p{...}'], ['y', 'sticky: Treffer genau an lastIndex'], ['d', 'indices: Trefferpositionen in .indices'], ['v', 'unicodeSets: erweiterte Klassen (neuer als u)']],
      keywords: ['modifier', 'global', 'ignorecase', 'multiline', 'unicode', 'sticky', 'dotall'], related: ['RegExp-Literal', 'test()', 'replaceAll()', 'matchAll()'], mdn: 'RegExp#flags' });
  out[out.length - 1].mdn = 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Regular_expressions#flags';

  P(R, 'test()', 'Prüft, ob ein Regex in einem String passt (Boolean).',
    'Die schnellste Variante, wenn nur "passt / passt nicht" interessiert. Fallstrick: Bei Regexen mit `g` oder `y` wird `lastIndex` fortgeschrieben, sodass wiederholte Aufrufe auf demselben Objekt abwechselnd `true` und `false` liefern können.',
    'regex.test(text)',
    "console.log(/^\\d{5}$/.test('12345')); // → true\nconsole.log(/^\\d{5}$/.test('1234a')); // → false\nconst email = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\nconsole.log(email.test('ada@example.org')); // → true\nconst g = /a/g; // Falle: g-Flag mit test()\nconsole.log(g.test('aa'), g.test('aa'), g.test('aa')); // → true true false",
    { keywords: ['prüfen', 'validieren', 'matcht', 'boolean'], related: ['exec()', 'match()', 'includes() (String)'], mdn: 'RegExp/test' });

  P(R, 'exec()', 'Liefert Details zum nächsten Treffer oder null.',
    'Gibt ein Array zurück: Index 0 ist der gesamte Treffer, danach folgen die Capture-Gruppen; zusätzlich `index`, `input` und `groups`. Ohne Treffer ergibt sich `null`. Mit dem Flag `g` oder `y` springt jeder Aufruf zum nächsten Treffer (über `lastIndex`), ideal für Schleifen; meist ist `matchAll()` aber bequemer.',
    'regex.exec(text)',
    "const re = /(\\d+)-(\\d+)/;\nconst m = re.exec('Seiten 10-20');\nconsole.log(m[0], m[1], m[2]); // → 10-20 10 20\nconsole.log(m.index); // → 7\nconsole.log(re.exec('nichts')); // → null\nconst g = /\\d+/g;\nlet t;\nwhile ((t = g.exec('a1 b22 c333')) !== null) {\n  console.log(t[0], g.lastIndex); // → 1 2, 22 6, 333 11\n}",
    { keywords: ['treffer', 'capture group', 'lastIndex', 'gruppen'], related: ['test()', 'match()', 'matchAll()', 'Benannte Gruppen'], mdn: 'RegExp/exec' });

  P(R, 'match()', 'String-Methode: liefert Treffer eines Regex als Array oder null.',
    'Ohne `g` entspricht das Ergebnis `exec()` (Treffer plus Gruppen), mit `g` nur ein Array aller Gesamttreffer ohne Gruppen. Ohne Treffer kommt `null`, nicht `[]`. Deshalb vor dem Zugriff prüfen oder `?.` / `?? []` verwenden.',
    'text.match(regex)',
    "const t = 'Preis: 12 EUR, 30 EUR';\nconsole.log(t.match(/\\d+/)); // → [\"12\"] (mit index/input)\nconsole.log(t.match(/\\d+/g)); // → [\"12\",\"30\"]\nconsole.log('abc'.match(/\\d/g)); // → null\nconst anzahl = ('abc'.match(/\\d/g) ?? []).length;\nconsole.log(anzahl); // → 0",
    { keywords: ['treffer finden', 'alle treffer', 'extrahieren'], related: ['matchAll()', 'exec()', 'test()', 'replace()'], mdn: 'String/match' });

  P(R, 'matchAll()', 'Iterator über alle Treffer samt Gruppen (Flag g erforderlich).',
    'Liefert einen Iterator von Treffer-Objekten, jeweils mit Capture-Gruppen und Index, und ersetzt die alte `exec()`-Schleife. Ohne `g` wirft die Methode einen `TypeError`. Zum Weiterverarbeiten wandelt man den Iterator mit Spread oder `Array.from()` um.',
    'text.matchAll(regex)',
    "const t = 'a=1, b=22, c=333';\nfor (const m of t.matchAll(/(\\w)=(\\d+)/g)) {\n  console.log(m[1], m[2], m.index); // → a 1 0 / b 22 5 / c 333 11\n}\nconst werte = [...t.matchAll(/\\d+/g)].map((m) => Number(m[0]));\nconsole.log(werte); // → [1,22,333]\ntry {\n  t.matchAll(/\\d/);\n} catch (e) {\n  console.log(e.name); // → TypeError\n}",
    { keywords: ['alle treffer', 'iterator', 'gruppen', 'globale suche'], related: ['match()', 'exec()', 'Flags (g, i, m, s, u, y, d)', 'Array.from()'], mdn: 'String/matchAll' });

  P(R, 'Benannte Gruppen', 'Capture-Gruppen mit Namen statt Nummer: (?<name>...).',
    'Der Treffer enthält die Werte in `match.groups.name`, im Ersatzstring von `replace()` greift man mit `$<name>` zu, im Muster selbst per `\\k<name>` auf frühere Gruppen zurück. Das macht Muster lesbarer und robuster gegenüber Änderungen der Gruppenreihenfolge.',
    '(?<name>muster)  →  match.groups.name',
    "const m = '2024-03-15'.match(/(?<jahr>\\d{4})-(?<monat>\\d{2})-(?<tag>\\d{2})/);\nconsole.log(m.groups.jahr, m.groups.monat, m.groups.tag); // → 2024 03 15\nconst { jahr, tag } = m.groups;\nconsole.log(tag + '.' + m.groups.monat + '.' + jahr); // → 15.03.2024\nconsole.log('2024-03-15'.replace(/(?<j>\\d{4})-(?<m>\\d{2})-(?<t>\\d{2})/, '$<t>.$<m>.$<j>')); // → 15.03.2024\nconsole.log(/(?<z>\\w)\\k<z>/.test('hallo')); // → true (ll)",
    { keywords: ['named groups', 'capture group', 'gruppe', 'groups'], related: ['exec()', 'match()', 'replace()', 'matchAll()'], mdn: 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Regular_expressions/Named_capturing_group' });

  P(R, 'Zeichenklassen & Quantoren', 'Bausteine für Regex-Muster: Klassen, Anker und Wiederholungen.',
    'Zeichenklassen wie `\\d` oder `[a-z]` legen fest, welche Zeichen passen, Quantoren wie `+` oder `{n,m}` wie oft. Quantoren sind standardmäßig gierig (greedy); ein angehängtes `?` macht sie genügsam (lazy). Mit runden Klammern gruppiert man und erzeugt Capture-Gruppen.',
    '\\d \\w \\s . * + ? {n,m} ^ $ [] |',
    "console.log('a1b22'.match(/\\d+/g)); // → [\"1\",\"22\"]\nconsole.log(/^[A-Z][a-z]+$/.test('Ada')); // → true\nconsole.log('<b>x</b><b>y</b>'.match(/<b>.+<\\/b>/)[0]); // → <b>x</b><b>y</b> (gierig)\nconsole.log('<b>x</b><b>y</b>'.match(/<b>.+?<\\/b>/)[0]); // → <b>x</b> (lazy)\nconsole.log(/colou?r/.test('color')); // → true\nconsole.log('ja|nein'.split(/\\|/)); // → [\"ja\",\"nein\"]\nconsole.log(/^(Hund|Katze)$/.test('Katze')); // → true",
    { values: [['\\d / \\D', 'Ziffer / keine Ziffer'], ['\\w / \\W', 'Wortzeichen [A-Za-z0-9_] / Nicht-Wortzeichen'], ['\\s / \\S', 'Leerraum / kein Leerraum'], ['.', 'Beliebiges Zeichen außer Zeilenumbruch'], ['*', '0 oder mehr'], ['+', '1 oder mehr'], ['?', '0 oder 1 (nach Quantor: lazy)'], ['{n,m}', 'Mindestens n, höchstens m Wiederholungen'], ['^ / $', 'Anfang / Ende des Strings (mit m: der Zeile)'], ['[abc] / [^abc]', 'Eines dieser Zeichen / keines davon'], ['a|b', 'Alternative: a oder b'], ['(...)', 'Gruppe mit Capture'], ['\\b', 'Wortgrenze']],
      keywords: ['quantifier', 'character class', 'gierig', 'lazy', 'anker', 'wortgrenze', 'alternative'], related: ['RegExp-Literal', 'Flags (g, i, m, s, u, y, d)', 'Benannte Gruppen'], mdn: 'https://developer.mozilla.org/de/docs/Web/JavaScript/Guide/Regular_expressions/Character_classes' });

  // ---------------- Symbole & Iteratoren ----------------
  var Y = 'Symbole & Iteratoren';
  P(Y, 'Symbol()', 'Erzeugt einen garantiert eindeutigen, unveränderlichen Wert.',
    'Jeder Aufruf von `Symbol()` liefert ein neues Symbol, auch bei gleicher Beschreibung. Symbole dienen als kollisionsfreie Objekt-Schlüssel und erscheinen nicht in `for...in` oder `Object.keys()`. `Symbol.for(key)` holt ein Symbol aus der globalen Registry, sodass gleiche Schlüssel dasselbe Symbol liefern. Mit `new` darf `Symbol` nicht aufgerufen werden.',
    'Symbol(beschreibung?)  |  Symbol.for(key)',
    "const a = Symbol('id');\nconst b = Symbol('id');\nconsole.log(a === b); // → false\nconsole.log(Symbol.for('app') === Symbol.for('app')); // → true\nconsole.log(a.description); // → id\nconst obj = { name: 'Ada', [a]: 123 };\nconsole.log(Object.keys(obj)); // → [\"name\"]\nconsole.log(obj[a]); // → 123\nconsole.log(typeof a); // → symbol",
    { keywords: ['eindeutig', 'unique key', 'privat', 'well-known symbols', 'Symbol.for'], related: ['Symbol.iterator', 'Iterator-Protokoll'], mdn: 'Symbol' });

  P(Y, 'Symbol.iterator', 'Well-known Symbol, das ein Objekt iterierbar macht.',
    'Hat ein Objekt eine Methode unter `[Symbol.iterator]`, die einen Iterator zurückgibt, lässt es sich mit `for...of`, Spread, Destructuring und `Array.from()` verwenden. Arrays, Strings, Maps und Sets bringen das schon mit. Am bequemsten schreibt man die Methode als Generator (`*[Symbol.iterator]()`).',
    '[Symbol.iterator]() { return iterator; }',
    "const bereich = {\n  von: 1,\n  bis: 4,\n  *[Symbol.iterator]() {\n    for (let i = this.von; i <= this.bis; i++) yield i;\n  }\n};\nconsole.log([...bereich]); // → [1,2,3,4]\nfor (const n of bereich) console.log(n); // → 1 2 3 4\nconsole.log(Math.max(...bereich)); // → 4\nconsole.log(typeof [][Symbol.iterator]); // → function",
    { keywords: ['iterable', 'for of', 'generator', 'iterierbar'], related: ['Iterator-Protokoll', 'Symbol()', 'keys() / values() / entries()'], mdn: 'Symbol/iterator' });

  P(Y, 'Iterator-Protokoll', 'Regeln, nach denen Objekte schrittweise Werte liefern.',
    'Ein Iterator ist ein Objekt mit `next()`, das `{ value, done }` zurückgibt; `done: true` signalisiert das Ende. Ein Iterable besitzt `[Symbol.iterator]()`, das einen Iterator liefert. Iteratoren werden lazy ausgewertet und eignen sich für unendliche Folgen. Generatorfunktionen (`function*` mit `yield`) erzeugen Iteratoren automatisch.',
    'iterator.next()  →  { value, done }',
    "function zaehler(bis) {\n  let i = 0;\n  return {\n    next: () => (i < bis ? { value: i++, done: false } : { value: undefined, done: true }),\n    [Symbol.iterator]() { return this; }\n  };\n}\nconst it = zaehler(2);\nconsole.log(it.next()); // → {\"value\":0,\"done\":false}\nconsole.log(it.next()); // → {\"value\":1,\"done\":false}\nconsole.log(it.next()); // → {\"done\":true}\nconsole.log([...zaehler(3)]); // → [0,1,2]\nfunction* fib() {\n  let [a, b] = [0, 1];\n  while (true) { yield a; [a, b] = [b, a + b]; }\n}\nconst f = fib();\nconsole.log([f.next().value, f.next().value, f.next().value, f.next().value]); // → [0,1,1,2]",
    { values: [['next()', 'Liefert das nächste Ergebnisobjekt'], ['value', 'Aktueller Wert'], ['done', 'true, wenn die Folge zu Ende ist'], ['return()', 'Optional: Aufräumen bei vorzeitigem Abbruch']],
      keywords: ['iterator', 'iterable', 'generator', 'yield', 'next', 'lazy'], related: ['Symbol.iterator', 'Iterator-Helfer (map, filter, take)', 'keys() / values() / entries()'], mdn: 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Iteration_protocols' });

  P(Y, 'Iterator-Helfer (map, filter, take)', 'Array-ähnliche Methoden direkt auf Iteratoren, ohne Zwischenarray.',
    'Neue Methoden auf `Iterator.prototype`: `map`, `filter`, `take`, `drop`, `flatMap` (lazy, liefern wieder Iteratoren) sowie `toArray`, `forEach`, `reduce`, `some`, `every`, `find` (verbrauchen den Iterator). Damit lassen sich auch unendliche Generatoren sicher begrenzen. Verfügbar in aktuellen Browsern; sonst Feature-Check nötig.',
    'iterator.map(fn).filter(fn).take(n).toArray()',
    "function* natuerlich() {\n  let n = 1;\n  while (true) yield n++;\n}\nif (typeof natuerlich().map !== 'function') {\n  console.log('Iterator-Helfer werden hier nicht unterstützt.');\n} else {\n  const ergebnis = natuerlich()\n    .filter((n) => n % 2 === 0)\n    .map((n) => n * n)\n    .take(4)\n    .toArray();\n  console.log(ergebnis); // → [4,16,36,64]\n  console.log([10, 20, 30].values().drop(1).toArray()); // → [20,30]\n  console.log(Iterator.from({ next() { return { done: true }; } }).toArray()); // → []\n}",
    { values: [['map(fn)', 'Werte umwandeln (lazy)'], ['filter(fn)', 'Werte filtern (lazy)'], ['take(n)', 'Nur die ersten n Werte'], ['drop(n)', 'Die ersten n überspringen'], ['flatMap(fn)', 'Pro Wert einen Iterator einflechten'], ['toArray()', 'Rest als Array einsammeln']],
      keywords: ['lazy', 'unendlich', 'generator', 'pipeline', 'iterator helpers'], related: ['Iterator-Protokoll', 'Symbol.iterator', 'map()', 'filter()'], mdn: 'https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Iterator' });

  window.CHEAT.push.apply(window.CHEAT, out);
})();
