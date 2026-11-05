window.CHEAT = window.CHEAT || [];
(function () {
  var A = 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/';
  var D = 'https://dev.java/learn/';
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Strings ----------------
  {
    lang: 'java', group: 'Strings', name: 'String',
    desc: "Unveränderliche Zeichenkette; Vergleiche immer mit `equals()`, nie mit `==`.",
    details: "Ein `String` kann nach der Erzeugung nicht mehr geändert werden; Methoden wie `toUpperCase()` liefern ein neues Objekt. Literale landen im String-Pool, deshalb sind gleiche Literale dasselbe Objekt, während `new String(\"...\")` immer ein neues erzeugt. `==` vergleicht nur die Referenz und liefert daher bei gleichem Inhalt mal `true`, mal `false`. Für Inhalte gilt `equals()`.",
    syntax: "String s = \"Text\";\nString t = new String(\"Text\");",
    example: e(`
String a = "java";
String b = "java";
String c = new String("java");

System.out.println(a == b);        // true  (gleiches Literal, gleicher Pool-Eintrag)
System.out.println(a == c);        // false (neues Objekt)
System.out.println(a.equals(c));   // true  (gleicher Inhalt)

String d = a.toUpperCase();        // a bleibt unverändert
System.out.println(a + " " + d);   // java JAVA
`),
    tip: "In Schleifen viele Strings mit `+` zu verketten erzeugt jedes Mal ein neues Objekt; dafür gibt es `StringBuilder`.",
    keywords: ['zeichenkette', 'string', 'immutable', 'unveränderlich', 'string pool', 'intern', '==', 'equals', 'text'],
    related: ['String.equals()', 'StringBuilder', 'Text Blocks', 'String.valueOf()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'Text Blocks',
    desc: "Mehrzeilige String-Literale zwischen dreifachen Anführungszeichen (seit Java 15).",
    details: "Ein Text Block beginnt mit `\"\"\"` und einem Zeilenumbruch und endet mit `\"\"\"`. Die gemeinsame Einrückung aller Zeilen (inklusive der Zeile mit dem schließenden Delimiter) wird entfernt, Zeilenenden werden zu `\\n`. Anführungszeichen müssen nicht maskiert werden, andere Escapes wie `\\\\` und `\\t` gelten weiterhin; `\\` am Zeilenende verbindet Zeilen, `\\s` erzeugt ein Leerzeichen am Ende.",
    syntax: "String s = \"\"\"\n    Zeile 1\n    Zeile 2\"\"\";",
    example: e(`
String json = """
    {
      "name": "Ada",
      "alter": 36
    }
    """;
System.out.print(json);

// Backslash am Zeilenende: keine neue Zeile
String satz = """
    eins \\
    zwei""";
System.out.println(satz);              // eins zwei
System.out.println(json.lines().count()); // 4
`),
    tip: "Steht der schließende Delimiter auf einer eigenen Zeile, endet der Text mit einem Zeilenumbruch; steht er direkt hinter dem letzten Zeichen, nicht.",
    keywords: ['mehrzeilig', 'multiline', 'textblock', 'text block', '"""', 'json', 'sql', 'html'],
    related: ['String', 'String.formatted()', 'String.lines()'],
    mdn: 'https://docs.oracle.com/en/java/javase/25/text-blocks/index.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.length()',
    desc: "Liefert die Anzahl der `char`-Einheiten (UTF-16) eines Strings.",
    details: "`length()` zählt UTF-16-Einheiten, nicht Zeichen im Sinne des Menschen: Zeichen außerhalb der Basic Multilingual Plane wie viele Emojis belegen zwei `char`. Bei Arrays ist `length` dagegen ein Feld ohne Klammern, bei Collections heißt die Methode `size()`. Für echte Zeichen siehe die Codepoint-Methoden.",
    syntax: "int n = s.length();",
    example: e(`
String s = "Hallo";
System.out.println(s.length());          // 5
System.out.println("".length());         // 0

int[] zahlen = {1, 2, 3};
System.out.println(zahlen.length);       // 3 (Array: Feld ohne Klammern)

String emoji = "😀";
System.out.println(emoji.length());      // 2 (zwei char-Einheiten)
System.out.println(emoji.codePointCount(0, emoji.length())); // 1
`),
    tip: "Array: `a.length`, String: `s.length()`, Collection: `c.size()`. Diese Verwechslung ist ein Klassiker.",
    keywords: ['länge', 'anzahl zeichen', 'size', 'length'],
    related: ['Unicode und Codepoints', 'String.isEmpty()', 'String.charAt()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.charAt()',
    desc: "Liefert das `char` an einem Index (Zählung ab 0).",
    details: "Der Index muss zwischen 0 und `length() - 1` liegen, sonst wird eine `StringIndexOutOfBoundsException` geworfen. Das Ergebnis ist ein `char`, also ein numerischer Typ: `'a' + 1` ergibt einen `int`, erst die Umwandlung mit `(char)` liefert wieder ein Zeichen.",
    syntax: "char c = s.charAt(index);",
    example: e(`
String s = "Java";
System.out.println(s.charAt(0));              // J
System.out.println(s.charAt(s.length() - 1)); // a

try {
    s.charAt(4);
} catch (StringIndexOutOfBoundsException ex) {
    System.out.println("Index außerhalb");    // Index außerhalb
}

System.out.println('a' + 1);                  // 98
System.out.println((char) ('a' + 1));         // b
`),
    tip: "Für alle Zeichen einer Zeichenkette: `for (char c : s.toCharArray())`.",
    keywords: ['zeichen', 'index', 'position', 'char', 'toCharArray'],
    related: ['String.substring()', 'String.indexOf()', 'char und Character'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.substring()',
    desc: "Schneidet einen Teilstring aus; Anfang inklusive, Ende exklusive.",
    details: "`substring(von)` geht bis zum Ende, `substring(von, bis)` schließt `bis` nicht mit ein. Die Länge des Ergebnisses ist also `bis - von`. Ungültige Grenzen führen zu einer `StringIndexOutOfBoundsException`. Mit `indexOf()` lässt sich die Position eines Trennzeichens finden.",
    syntax: "s.substring(von)\ns.substring(von, bis)",
    example: e(`
String s = "Hallo Welt";
System.out.println(s.substring(6));      // Welt
System.out.println(s.substring(0, 5));   // Hallo
System.out.println(s.substring(3, 3).isEmpty()); // true

String datei = "bericht.pdf";
String endung = datei.substring(datei.lastIndexOf('.') + 1);
System.out.println(endung);              // pdf
`),
    tip: "Merkhilfe: `substring(a, b)` hat die Länge `b - a`.",
    keywords: ['teilstring', 'ausschneiden', 'slice', 'abschneiden'],
    related: ['String.indexOf()', 'String.charAt()', 'String.split()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.indexOf()',
    desc: "Sucht ein Zeichen oder einen Teilstring und liefert den Index oder -1.",
    details: "`indexOf` sucht von vorn, `lastIndexOf` von hinten; ein zweites Argument legt die Startposition fest. Wird nichts gefunden, ist das Ergebnis `-1`. Die Suche unterscheidet Groß- und Kleinschreibung. Für eine reine Ja/Nein-Frage ist `contains()` lesbarer.",
    syntax: "s.indexOf(str)\ns.indexOf(str, ab)\ns.lastIndexOf(str)",
    example: e(`
String s = "banane";
System.out.println(s.indexOf('a'));       // 1
System.out.println(s.indexOf("an"));      // 1
System.out.println(s.indexOf("an", 2));   // 3
System.out.println(s.lastIndexOf('a'));   // 5
System.out.println(s.indexOf("x"));       // -1
`),
    tip: "Ergebnis `-1` immer prüfen, bevor man es als Index weiterverwendet.",
    keywords: ['suchen', 'position', 'finden', 'lastIndexOf', 'index of'],
    related: ['String.contains()', 'String.substring()', 'String.startsWith()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.contains()',
    desc: "Prüft, ob ein Teilstring enthalten ist.",
    details: "`contains(CharSequence)` liefert `true`, wenn der Text irgendwo vorkommt. Die Prüfung unterscheidet Groß- und Kleinschreibung. Für eine Suche ohne Beachtung der Schreibweise wandelt man beide Seiten vorher mit `toLowerCase()` um. Mit `null` als Argument wird eine `NullPointerException` geworfen.",
    syntax: "boolean b = s.contains(teil);",
    example: e(`
String s = "Hallo Welt";
System.out.println(s.contains("Welt"));   // true
System.out.println(s.contains("welt"));   // false
System.out.println(s.toLowerCase().contains("welt")); // true
System.out.println(s.contains(""));       // true
`),
    keywords: ['enthält', 'teilstring', 'suchen', 'contains'],
    related: ['String.indexOf()', 'String.startsWith()', 'String.matches()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.startsWith()',
    desc: "Prüft Anfang (`startsWith`) und Ende (`endsWith`) eines Strings.",
    details: "`startsWith(prefix)` und `endsWith(suffix)` liefern einen `boolean`. Eine überladene Variante `startsWith(prefix, offset)` prüft ab einer bestimmten Position. Beide unterscheiden Groß- und Kleinschreibung; ein leerer String als Präfix ergibt immer `true`.",
    syntax: "s.startsWith(prefix)\ns.endsWith(suffix)\ns.startsWith(prefix, offset)",
    example: e(`
String datei = "Main.java";
System.out.println(datei.startsWith("Ma"));    // true
System.out.println(datei.endsWith(".java"));   // true
System.out.println(datei.endsWith(".JAVA"));   // false
System.out.println(datei.startsWith("in", 2)); // true
`),
    keywords: ['präfix', 'suffix', 'beginnt mit', 'endet mit', 'endsWith'],
    related: ['String.contains()', 'String.indexOf()', 'String.substring()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.equals()',
    desc: "Vergleicht den Inhalt zweier Strings; `equalsIgnoreCase()` ignoriert die Schreibweise.",
    details: "`==` vergleicht bei Objekten die Referenz, `equals()` den Inhalt. Wenn die Variable `null` sein kann, schreibt man das Literal nach vorn (`\"ja\".equals(eingabe)`), dann gibt es keine `NullPointerException`. `equalsIgnoreCase()` ignoriert Groß- und Kleinschreibung, `contentEquals()` vergleicht auch mit einem `StringBuilder`.",
    syntax: "a.equals(b)\na.equalsIgnoreCase(b)",
    example: e(`
String a = "Java";
String b = new String("Java");
System.out.println(a == b);                    // false
System.out.println(a.equals(b));               // true
System.out.println(a.equalsIgnoreCase("JAVA")); // true

String eingabe = null;
System.out.println("ja".equals(eingabe));      // false (kein Fehler)
// eingabe.equals("ja");                       // NullPointerException
`),
    tip: "Literal zuerst oder `Objects.equals(a, b)` verwenden, wenn eine Seite `null` sein darf.",
    keywords: ['vergleichen', 'gleich', 'equalsIgnoreCase', '==', 'string vergleich'],
    related: ['String', 'String.compareTo()', 'Objects.equals()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.compareTo()',
    desc: "Vergleicht Strings lexikographisch und liefert negativ, 0 oder positiv.",
    details: "Das Ergebnis ist die Differenz der ersten unterschiedlichen `char`-Werte, bei Präfixen die Längendifferenz; nur das Vorzeichen ist verlässlich. Die Reihenfolge folgt den Unicode-Werten: Großbuchstaben kommen vor Kleinbuchstaben, Umlaute nach `z`. `compareToIgnoreCase()` ignoriert die Schreibweise; für sprachrichtige Sortierung braucht man einen `Collator`.",
    syntax: "int r = a.compareTo(b);",
    example: e(`
System.out.println("apfel".compareTo("birne"));   // -1
System.out.println("b".compareTo("a"));           // 1
System.out.println("a".compareTo("a"));           // 0
System.out.println("Zebra".compareTo("apfel"));   // -7 (Großbuchstabe zuerst)
System.out.println("Zebra".compareToIgnoreCase("apfel") > 0); // true

String[] namen = {"Zoe", "adam", "Bob"};
Arrays.sort(namen, String.CASE_INSENSITIVE_ORDER);
System.out.println(Arrays.toString(namen));       // [adam, Bob, Zoe]
`),
    tip: "Nicht auf bestimmte Werte wie `-1` prüfen, sondern auf `< 0`, `== 0`, `> 0`.",
    keywords: ['sortieren', 'vergleich', 'lexikographisch', 'comparable', 'compareToIgnoreCase', 'reihenfolge'],
    related: ['String.equals()', 'Arrays.sort()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.isEmpty()',
    desc: "Prüft, ob die Länge 0 ist.",
    details: "`isEmpty()` ist nur für Strings der Länge 0 wahr; ein String aus Leerzeichen ist nicht leer. Für Texte, die nur aus Leerraum bestehen, nimmt man `isBlank()`. Auf `null` aufgerufen werfen beide Methoden eine `NullPointerException`.",
    syntax: "s.isEmpty()",
    example: e(`
System.out.println("".isEmpty());      // true
System.out.println("  ".isEmpty());    // false
System.out.println("  ".isBlank());    // true
String s = null;
System.out.println(s == null || s.isEmpty()); // true
`),
    keywords: ['leer', 'empty', 'null prüfen', 'blank'],
    related: ['String.isBlank()', 'String.length()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.isBlank()',
    desc: "Wahr, wenn der String leer ist oder nur Leerraum enthält (seit Java 11).",
    details: "`isBlank()` ist praktisch für Formulareingaben: Leerzeichen, Tabulatoren und Zeilenumbrüche zählen als Leerraum (definiert über `Character.isWhitespace`). Gegenüber `isEmpty()` fängt es auch rein optische Leere ab. Vor Java 11 musste man `s.trim().isEmpty()` schreiben.",
    syntax: "s.isBlank()",
    example: e(`
System.out.println("".isBlank());        // true
System.out.println(" \\t\\n".isBlank());   // true
System.out.println(" a ".isBlank());     // false
`),
    keywords: ['leer', 'leerzeichen', 'whitespace', 'blank', 'eingabe prüfen'],
    related: ['String.isEmpty()', 'String.strip()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.strip()',
    desc: "Entfernt Leerraum am Anfang und Ende (seit Java 11); `trim()` kennt nur ASCII.",
    details: "`strip()` entfernt führenden und nachfolgenden Leerraum nach `Character.isWhitespace`, `stripLeading()` und `stripTrailing()` nur eine Seite. `trim()` entfernt dagegen alle Zeichen bis U+0020 und erkennt etwa das breite Leerzeichen U+2003 nicht. Das geschützte Leerzeichen U+00A0 entfernen beide nicht. Der Originalstring bleibt unverändert, das Ergebnis muss zugewiesen werden.",
    syntax: "s.strip()\ns.stripLeading()\ns.stripTrailing()",
    example: e(`
String s = "  Hallo  ";
System.out.println("[" + s.strip() + "]");         // [Hallo]
System.out.println("[" + s.stripLeading() + "]");  // [Hallo  ]
System.out.println("[" + s.stripTrailing() + "]"); // [  Hallo]

String breit = "\\u2003Hallo\\u2003";   // Geviert-Leerzeichen
System.out.println(breit.trim().length());   // 7
System.out.println(breit.strip().length());  // 5
`),
    tip: "In neuem Code `strip()` statt `trim()` verwenden.",
    keywords: ['trim', 'leerzeichen entfernen', 'whitespace', 'abschneiden', 'stripLeading', 'stripTrailing'],
    related: ['String.isBlank()', 'String.replace()'],
    mdn: A + 'lang/String.html#strip()'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.split()',
    desc: "Zerlegt einen String anhand eines regulären Ausdrucks in ein Array.",
    details: "Das Trennmuster ist ein regulärer Ausdruck: Sonderzeichen wie `.` oder `|` müssen maskiert werden, etwa `\"\\\\.\"`. Leere Teile am Ende werden standardmäßig entfernt; mit dem Limit `-1` bleiben sie erhalten. Beginnt der String mit einem Trenner, entsteht vorn ein leerer String.",
    syntax: "String[] teile = s.split(regex);\nString[] teile = s.split(regex, limit);",
    example: e(`
System.out.println(Arrays.toString("a,b,,c,,".split(",")));      // [a, b, , c]
System.out.println(Arrays.toString("a,b,,c,,".split(",", -1)));  // [a, b, , c, , ]
System.out.println(Arrays.toString(" x  y ".split("\\\\s+")));     // [, x, y]
System.out.println("a.b".split(".").length);                     // 0 (Punkt = beliebiges Zeichen)
System.out.println(Arrays.toString("a.b".split("\\\\.")));         // [a, b]
System.out.println(Arrays.toString("k=v=w".split("=", 2)));      // [k, v=w]
`),
    tip: "Zeichen mit Sonderbedeutung (`. | * + ? ( ) [ ] \\\\ $ ^`) entweder mit `\\\\` maskieren oder `Pattern.quote(...)` nutzen.",
    keywords: ['teilen', 'trennen', 'zerlegen', 'csv', 'regex', 'tokenize'],
    related: ['String.join()', 'Regex-Syntax', 'Pattern'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.join()',
    desc: "Verbindet Strings oder Elemente einer Collection mit einem Trennzeichen.",
    details: "`String.join(trenner, elemente...)` nimmt entweder mehrere Strings oder ein `Iterable<? extends CharSequence>`. Es entsteht kein Trenner am Anfang oder Ende, das erspart die übliche Sonderbehandlung des letzten Elements. Bei Listen aus anderen Typen wandelt man vorher mit einem Stream um oder verwendet `StringJoiner`.",
    syntax: "String.join(trenner, a, b, c)\nString.join(trenner, iterable)",
    example: e(`
System.out.println(String.join(", ", "rot", "grün", "blau")); // rot, grün, blau

List<String> liste = List.of("a", "b", "c");
System.out.println(String.join("-", liste));                  // a-b-c

String[] teile = {"2025", "03", "14"};
System.out.println(String.join(".", teile));                  // 2025.03.14
`),
    keywords: ['verbinden', 'zusammenfügen', 'concat', 'trennzeichen', 'joiner'],
    related: ['StringJoiner', 'String.split()', 'StringBuilder'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.replace()',
    desc: "Ersetzt alle Vorkommen eines Zeichens oder Textes (ohne Regex).",
    details: "`replace` ersetzt alle Vorkommen, nicht nur das erste, und arbeitet mit festem Text. Weil Strings unveränderlich sind, liefert die Methode ein neues Objekt; der Rückgabewert muss zugewiesen werden. Für Muster gibt es `replaceAll()` und `replaceFirst()`.",
    syntax: "s.replace(alt, neu)",
    example: e(`
String s = "banane";
System.out.println(s.replace('a', 'o'));       // bonone
System.out.println(s.replace("an", "AN"));     // bANANe
s.replace("b", "x");                           // Ergebnis verworfen!
System.out.println(s);                         // banane
System.out.println("1+1".replace("+", "-"));   // 1-1
`),
    tip: "`replace` ist wörtlich, `replaceAll` nimmt eine Regex. Sonderzeichen wie `+` oder `.` machen dort Ärger.",
    keywords: ['ersetzen', 'austauschen', 'replace', 'substitute'],
    related: ['String.replaceAll()', 'StringBuilder', 'String.strip()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.toUpperCase()',
    desc: "Wandelt in Groß- bzw. Kleinbuchstaben um (`toLowerCase()`); Locale beachten.",
    details: "Beide Methoden liefern einen neuen String. Die Umwandlung hängt vom Locale ab: Im Türkischen wird aus `I` beim Kleinschreiben ein punktloses `ı`. Für technische Texte wie Schlüssel oder Dateiendungen daher `Locale.ROOT` übergeben. Einzelne Zeichen können dabei länger werden: `ß` wird zu `SS`.",
    syntax: "s.toUpperCase()\ns.toLowerCase(Locale.ROOT)",
    example: e(`
System.out.println("Hallo".toUpperCase());     // HALLO
System.out.println("Hallo".toLowerCase());     // hallo
System.out.println("straße".toUpperCase());    // STRASSE

String tr = "I".toLowerCase(Locale.forLanguageTag("tr"));
System.out.println(tr.equals("i"));            // false (türkisches ı)
System.out.println("TITLE".toLowerCase(Locale.ROOT)); // title
`),
    tip: "Für Vergleiche ohne Beachtung der Schreibweise ist `equalsIgnoreCase()` meist besser als erst umzuwandeln.",
    keywords: ['großbuchstaben', 'kleinbuchstaben', 'upper', 'lower', 'case', 'umwandeln', 'locale'],
    related: ['String.equals()', 'Locale'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.repeat()',
    desc: "Wiederholt einen String n-mal (seit Java 11).",
    details: "`repeat(n)` hängt den String `n`-mal aneinander; `repeat(0)` ergibt den leeren String, ein negativer Wert wirft eine `IllegalArgumentException`. Praktisch für Trennlinien, Einrückungen und Tabellenausgaben.",
    syntax: "s.repeat(anzahl)",
    example: e(`
System.out.println("ab".repeat(3));        // ababab
System.out.println("-".repeat(10));        // ----------
System.out.println("x".repeat(0).isEmpty()); // true

int tiefe = 3;
System.out.println("  ".repeat(tiefe) + "Eintrag"); //       Eintrag
`),
    keywords: ['wiederholen', 'vervielfachen', 'linie', 'einrücken', 'repeat'],
    related: ['StringBuilder', 'String.join()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.format()',
    desc: "Baut einen String nach einer Formatvorlage (`printf`-Stil).",
    details: "`String.format(vorlage, argumente...)` nutzt dieselben Spezifizierer wie `printf`. Ohne Locale-Argument gilt das Standard-Locale der JVM, so dass `%f` auf einem deutschen System ein Komma ausgibt. Für reproduzierbare Ausgaben übergibt man als erstes Argument ein festes `Locale`. Passt der Typ des Arguments nicht zum Spezifizierer, wird eine `IllegalFormatException` geworfen.",
    syntax: "String.format(vorlage, args...)\nString.format(locale, vorlage, args...)",
    example: e(`
String s = String.format(Locale.US, "%s ist %d Jahre alt, %.1f m groß", "Ada", 36, 1.7);
System.out.println(s);   // Ada ist 36 Jahre alt, 1.7 m groß

System.out.println(String.format("|%5d|%-5d|%05d|", 42, 42, 42)); // |   42|42   |00042|
System.out.println(String.format(Locale.GERMANY, "%.2f", 3.14159)); // 3,14
System.out.println(String.format(Locale.US, "%.2f", 3.14159));      // 3.14
`),
    tip: "Zeilenumbruch in Vorlagen als `%n` schreiben, nicht als `\\n`: Das passt zum Betriebssystem.",
    keywords: ['formatieren', 'printf', 'format', 'platzhalter', 'ausgabe'],
    related: ['String.formatted()', 'Format-Spezifizierer', 'System.out.printf()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.formatted()',
    desc: "Instanzvariante von `String.format()` (seit Java 15).",
    details: "`vorlage.formatted(args...)` ist gleichbedeutend mit `String.format(vorlage, args...)`, lässt sich aber direkt an einem Literal oder Text Block aufrufen. Es gelten dieselben Spezifizierer und dasselbe Standard-Locale.",
    syntax: "vorlage.formatted(args...)",
    example: e(`
String s = "%s hat %d Punkte".formatted("Ada", 42);
System.out.println(s);   // Ada hat 42 Punkte

String bericht = """
    Name:   %s
    Punkte: %d
    """.formatted("Bob", 7);
System.out.print(bericht);
`),
    keywords: ['formatieren', 'format', 'text block', 'platzhalter'],
    related: ['String.format()', 'Text Blocks', 'Format-Spezifizierer'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.valueOf()',
    desc: "Wandelt Werte aller Typen in einen String um.",
    details: "`String.valueOf` gibt es für alle primitiven Typen, für `char[]` und für `Object`. Bei `null` als `Object` kommt der Text `\"null\"` heraus, bei `valueOf((char[]) null)` dagegen eine `NullPointerException`. Auch `Integer.toString(x)` oder `\"\" + x` funktionieren, `valueOf` drückt die Absicht aber am klarsten aus.",
    syntax: "String.valueOf(wert)",
    example: e(`
System.out.println(String.valueOf(42) + 1);      // 421
System.out.println(String.valueOf(3.5));         // 3.5
System.out.println(String.valueOf(true));        // true

char[] zeichen = {'J', 'a', 'v', 'a'};
System.out.println(String.valueOf(zeichen));     // Java

Object nichts = null;
System.out.println(String.valueOf(nichts));      // null
`),
    keywords: ['umwandeln', 'konvertieren', 'toString', 'int zu string', 'char array'],
    related: ['Integer.parseInt()', 'String', 'char und Character'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.lines()',
    desc: "Liefert einen Stream der Zeilen eines Strings (seit Java 11).",
    details: "`lines()` trennt an `\\n`, `\\r` und `\\r\\n`; ein abschließender Zeilenumbruch erzeugt keine leere letzte Zeile. Das Ergebnis ist ein `Stream<String>`, den man mit `toList()` (seit Java 16), `forEach` oder anderen Stream-Operationen weiterverarbeitet.",
    syntax: "Stream<String> z = s.lines();",
    example: e(`
String text = "a\\nb\\r\\nc\\n";
System.out.println(text.lines().count());        // 3
System.out.println(text.lines().toList());       // [a, b, c]
text.lines().map(String::toUpperCase).forEach(System.out::println);
`),
    keywords: ['zeilen', 'zeilenweise', 'stream', 'lines', 'text block'],
    related: ['String.split()', 'Text Blocks', 'String.chars()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'String.chars()',
    desc: "Liefert die Zeichen eines Strings als `IntStream`.",
    details: "Jedes Element ist der `char`-Wert als `int`, daher braucht es für die Rückkehr zum Zeichen einen Cast. `chars()` liefert UTF-16-Einheiten; für echte Zeichen jenseits der Basisebene gibt es `codePoints()`. Gut geeignet zum Zählen und Filtern.",
    syntax: "IntStream s = text.chars();",
    example: e(`
long vokale = "Programmieren".chars()
        .filter(c -> "aeiou".indexOf(c) >= 0)
        .count();
System.out.println(vokale);   // 5

String bindestrich = "hallo".chars()
        .mapToObj(c -> String.valueOf((char) c))
        .collect(Collectors.joining("-"));
System.out.println(bindestrich);   // h-a-l-l-o
`),
    keywords: ['zeichen', 'stream', 'intstream', 'zählen', 'chars', 'codePoints'],
    related: ['String.lines()', 'Unicode und Codepoints', 'char und Character'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'StringBuilder',
    desc: "Veränderlicher Zeichenpuffer für effizientes Zusammenbauen von Strings.",
    details: "Mit `append()` wird in dasselbe Objekt geschrieben, statt bei jedem `+` einen neuen String anzulegen; das lohnt sich vor allem in Schleifen. Weitere Methoden sind `insert`, `reverse`, `deleteCharAt`, `delete`, `setLength` und `setCharAt`. `StringBuilder` ist nicht thread-sicher, `StringBuffer` ist die synchronisierte, langsamere Variante. Am Ende liefert `toString()` den fertigen String.",
    syntax: "StringBuilder sb = new StringBuilder();\nsb.append(x).append(y);\nString s = sb.toString();",
    example: e(`
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 3; i++) {
    sb.append(i).append(',');
}
sb.setLength(sb.length() - 1);   // letztes Komma entfernen
sb.insert(0, "[").append("]");
System.out.println(sb);          // [1,2,3]

System.out.println(new StringBuilder("Hallo").reverse()); // ollaH
`),
    tip: "Für einfache Verkettungen außerhalb von Schleifen ist `+` völlig in Ordnung; der Compiler optimiert das.",
    keywords: ['stringbuilder', 'stringbuffer', 'append', 'puffer', 'verketten', 'umkehren', 'reverse'],
    related: ['StringJoiner', 'String', 'String.join()'],
    mdn: A + 'lang/StringBuilder.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'StringJoiner',
    desc: "Baut eine Liste mit Trenner, Präfix und Suffix zusammen.",
    details: "`new StringJoiner(trenner, praefix, suffix)` sammelt Teile mit `add()` und liefert über `toString()` das Ergebnis, ohne überzähligen Trenner. Mit `setEmptyValue()` legt man fest, was bei null Teilen ausgegeben wird. Für einfache Fälle genügt `String.join()`.",
    syntax: "new StringJoiner(trenner, praefix, suffix)",
    example: e(`
StringJoiner sj = new StringJoiner(", ", "[", "]");
sj.add("a").add("b").add("c");
System.out.println(sj);            // [a, b, c]

StringJoiner leer = new StringJoiner(", ", "[", "]");
leer.setEmptyValue("(leer)");
System.out.println(leer);          // (leer)
`),
    keywords: ['verbinden', 'trennzeichen', 'präfix', 'liste ausgeben', 'joiner'],
    related: ['String.join()', 'StringBuilder'],
    mdn: A + 'util/StringJoiner.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'char und Character',
    desc: "`char` ist ein 16-Bit-Zeichentyp; `Character` bietet Prüf- und Umwandlungsmethoden.",
    details: "Ein `char` ist ein vorzeichenloser 16-Bit-Wert und lässt sich wie eine Zahl verwenden: `'7' - '0'` ergibt 7. Zeichenliterale stehen in einfachen, Strings in doppelten Anführungszeichen. Die Klasse `Character` enthält `isDigit`, `isLetter`, `isUpperCase`, `toUpperCase`, `getNumericValue` und mehr.",
    syntax: "char c = 'A';\nCharacter.isDigit(c)",
    example: e(`
char c = 'a';
System.out.println(Character.isLetter(c));        // true
System.out.println(Character.toUpperCase(c));     // A
System.out.println(Character.isDigit('7'));       // true
System.out.println('7' - '0');                    // 7
System.out.println((char) (c + 1));               // b
System.out.println(Character.getNumericValue('9')); // 9

char[] feld = "hallo".toCharArray();
Arrays.sort(feld);
System.out.println(new String(feld));             // ahllo
`),
    tip: "`'a' + 'b'` ist die Zahl 195, kein String. Mit `\"\" + 'a' + 'b'` entsteht `ab`.",
    keywords: ['char', 'zeichen', 'character', 'isDigit', 'isLetter', 'ascii', 'toCharArray'],
    related: ['String.charAt()', 'Unicode und Codepoints', 'String.valueOf()'],
    mdn: A + 'lang/Character.html'
  },
  {
    lang: 'java', group: 'Strings', name: 'Unicode und Codepoints',
    desc: "Java-Strings sind UTF-16; Zeichen außerhalb der Basisebene brauchen zwei `char`.",
    details: "Ein Codepoint ist die Unicode-Nummer eines Zeichens; viele Emojis liegen über U+FFFF und werden als Surrogatpaar aus zwei `char` gespeichert. `length()` und `charAt()` arbeiten auf `char`-Ebene, `codePointCount()`, `codePointAt()` und `codePoints()` auf Zeichenebene. `StringBuilder.reverse()` behandelt Surrogatpaare korrekt. Für Bytes ist die Kodierung anzugeben, z. B. `getBytes(StandardCharsets.UTF_8)`.",
    syntax: "s.codePointCount(0, s.length())\ns.codePointAt(i)\nCharacter.toChars(cp)",
    example: e(`
String s = "a😀b";
System.out.println(s.length());                        // 4
System.out.println(s.codePointCount(0, s.length()));   // 3
System.out.println(s.codePointAt(1));                  // 128512
System.out.println(Character.charCount(128512));       // 2
System.out.println(new String(Character.toChars(128512)));  // 😀
System.out.println(s.codePoints().count());            // 3
System.out.println("😀".getBytes(StandardCharsets.UTF_8).length); // 4
`),
    tip: "Beim Lesen und Schreiben von Dateien oder Netzwerkdaten immer die Zeichenkodierung angeben, am besten UTF-8.",
    keywords: ['unicode', 'utf-8', 'utf-16', 'emoji', 'surrogate', 'codepoint', 'kodierung', 'encoding'],
    related: ['String.length()', 'char und Character', 'String.chars()'],
    mdn: A + 'lang/Character.html'
  },

  // ---------------- Zahlen & Mathematik ----------------
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Wrapper-Klassen und Autoboxing',
    desc: "Objekt-Gegenstücke der primitiven Typen (`Integer`, `Double`, ...) mit automatischer Umwandlung.",
    details: "Collections und Generics brauchen Objekte, daher wandelt Java `int` und `Integer` automatisch ineinander um (Autoboxing und Unboxing). Wrapper dürfen `null` sein; das Unboxing von `null` wirft eine `NullPointerException`. Fallstrick: `Integer` zwischen -128 und 127 stammen aus einem Cache, dort liefert `==` zufällig `true`, außerhalb `false`. Wrapper immer mit `equals()` vergleichen.",
    syntax: "Integer i = 5;       // Autoboxing\nint n = i;           // Unboxing",
    values: [
      ['byte / Byte', '8 Bit, -128 bis 127'],
      ['short / Short', '16 Bit'],
      ['int / Integer', '32 Bit, Standard für ganze Zahlen'],
      ['long / Long', '64 Bit, Literal mit L'],
      ['float / Float', '32 Bit, Literal mit f'],
      ['double / Double', '64 Bit, Standard für Kommazahlen'],
      ['char / Character', '16 Bit, ein UTF-16-Zeichen'],
      ['boolean / Boolean', 'true oder false']
    ],
    example: e(`
Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println(a == b);        // true  (Cache)
System.out.println(c == d);        // false (zwei Objekte)
System.out.println(c.equals(d));   // true

Integer leer = null;
// int x = leer;                   // NullPointerException beim Unboxing

List<Integer> liste = new ArrayList<>(List.of(10, 20, 30));
liste.remove(1);                   // Index 1 entfernen
System.out.println(liste);         // [10, 30]
liste.remove(Integer.valueOf(10)); // Wert 10 entfernen
System.out.println(liste);         // [30]
`),
    tip: "Bei `List<Integer>` unterscheidet `remove(int index)` von `remove(Object o)`; mit `Integer.valueOf()` wählt man das Entfernen nach Wert.",
    keywords: ['autoboxing', 'unboxing', 'wrapper', 'integer', 'primitive', 'cache', 'int vs integer', 'datentypen'],
    related: ['Integer.parseInt()', 'Integer.MAX_VALUE', 'Double.compare()'],
    mdn: A + 'lang/Integer.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Integer.parseInt()',
    desc: "Wandelt einen String in einen `int` um; wirft `NumberFormatException` bei ungültiger Eingabe.",
    details: "`parseInt(s)` erwartet eine ganze Zahl ohne Leerzeichen, optional mit Vorzeichen. Mit einem zweiten Argument gibt man die Basis an. `Integer.valueOf(s)` liefert statt eines `int` ein `Integer`. Für andere Typen gibt es `Long.parseLong`, `Double.parseDouble` und `Boolean.parseBoolean`. Umgekehrt wandeln `Integer.toString(n, basis)`, `toBinaryString` und `toHexString` um.",
    syntax: "int n = Integer.parseInt(s);\nint n = Integer.parseInt(s, basis);",
    example: e(`
System.out.println(Integer.parseInt("42") + 1);      // 43
System.out.println(Integer.parseInt("-7"));          // -7
System.out.println(Integer.parseInt("ff", 16));      // 255
System.out.println(Integer.toBinaryString(10));      // 1010
System.out.println(Integer.toHexString(255));        // ff

try {
    Integer.parseInt(" 42");
} catch (NumberFormatException ex) {
    System.out.println(ex.getMessage());             // For input string: " 42"
}
System.out.println(Integer.parseInt(" 42".strip())); // 42
`),
    tip: "Benutzereingaben vorher mit `strip()` bereinigen und die `NumberFormatException` abfangen.",
    keywords: ['string zu int', 'parse', 'umwandeln', 'zahl lesen', 'NumberFormatException', 'valueOf', 'parseDouble'],
    related: ['String.valueOf()', 'Wrapper-Klassen und Autoboxing', 'Integer.MAX_VALUE'],
    mdn: A + 'lang/Integer.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Integer.MAX_VALUE',
    desc: "Größter `int` (2 147 483 647); darüber läuft die Rechnung ohne Fehler über.",
    details: "`int` hat 32 Bit, der Wertebereich liegt zwischen `Integer.MIN_VALUE` (-2 147 483 648) und `Integer.MAX_VALUE`. Überläufe werden nicht gemeldet, der Wert springt auf die andere Seite. Mit `long` oder `Math.addExact()` und Verwandten lässt sich das vermeiden. Auch die Ganzzahldivision schneidet Nachkommastellen ab.",
    syntax: "Integer.MAX_VALUE\nInteger.MIN_VALUE\nLong.MAX_VALUE",
    example: e(`
int max = Integer.MAX_VALUE;
System.out.println(max);                // 2147483647
System.out.println(max + 1);            // -2147483648 (Überlauf)
System.out.println((long) max + 1);     // 2147483648
System.out.println(Long.MAX_VALUE);     // 9223372036854775807

int x = 1_000_000;
System.out.println(x * x);              // -727379968
System.out.println((long) x * x);       // 1000000000000
System.out.println(7 / 2);              // 3
System.out.println(7 / 2.0);            // 3.5
`),
    tip: "Bei Multiplikationen vor dem Rechnen auf `long` umwandeln: `(long) a * b`, nicht `(long) (a * b)`.",
    keywords: ['überlauf', 'overflow', 'wertebereich', 'max int', 'min int', 'long', 'ganzzahldivision'],
    related: ['Math.addExact()', 'Wrapper-Klassen und Autoboxing', 'Math.abs()'],
    mdn: A + 'lang/Integer.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Double.compare()',
    desc: "Vergleicht `double`-Werte korrekt, auch bei `NaN` und `-0.0`.",
    details: "`NaN == NaN` ist `false`; ob ein Wert `NaN` ist, prüft man mit `Double.isNaN()`. `Double.compare(a, b)` liefert negativ, 0 oder positiv und ordnet `NaN` als größten Wert sowie `-0.0` vor `0.0`. Gleitkommazahlen sind ungenau: `0.1 + 0.2` ergibt nicht exakt `0.3`, deshalb vergleicht man mit einer Toleranz oder nimmt `BigDecimal`.",
    syntax: "Double.compare(a, b)\nDouble.isNaN(x)",
    example: e(`
double nan = 0.0 / 0.0;
System.out.println(nan == nan);               // false
System.out.println(Double.isNaN(nan));        // true
System.out.println(1.0 / 0);                  // Infinity

System.out.println(Double.compare(1.5, 2.5)); // -1
System.out.println(Double.compare(0.0, -0.0)); // 1
System.out.println(Double.compare(nan, 1.0)); // 1

System.out.println(0.1 + 0.2);                // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);         // false
System.out.println(Math.abs(0.1 + 0.2 - 0.3) < 1e-9); // true
`),
    tip: "Geldbeträge nie als `double` speichern, sondern als `BigDecimal` oder in ganzen Cent als `long`.",
    keywords: ['nan', 'gleitkomma', 'float', 'genauigkeit', 'vergleich', 'infinity', 'epsilon', 'double'],
    related: ['BigDecimal', 'Math.round()', 'Wrapper-Klassen und Autoboxing'],
    mdn: A + 'lang/Double.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Math.round()',
    desc: "Rundet auf die nächste ganze Zahl; Hälften werden zur positiven Unendlichkeit gerundet.",
    details: "`Math.round(double)` liefert einen `long`, `Math.round(float)` einen `int`. Die Hälfte wird aufgerundet, daher ergibt `round(-2.5)` den Wert -2. Auf Nachkommastellen rundet man mit `Math.round(x * 100) / 100.0`; für Geld oder Steuerung des Rundungsmodus ist `BigDecimal` mit `RoundingMode` besser. `Math.rint()` rundet Hälften zur geraden Zahl.",
    syntax: "long r = Math.round(x);",
    example: e(`
System.out.println(Math.round(2.4));    // 2
System.out.println(Math.round(2.5));    // 3
System.out.println(Math.round(-2.5));   // -2
System.out.println(Math.rint(2.5));     // 2.0
System.out.println(Math.rint(3.5));     // 4.0

double x = 3.14159;
System.out.println(Math.round(x * 100) / 100.0);  // 3.14
`),
    keywords: ['runden', 'round', 'nachkommastellen', 'rint', 'kaufmännisch'],
    related: ['Math.floor()', 'RoundingMode', 'BigDecimal'],
    mdn: A + 'lang/Math.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Math.floor()',
    desc: "Rundet ab (`floor`) bzw. auf (`ceil`); das Ergebnis ist ein `double`.",
    details: "`Math.floor` liefert die größte ganze Zahl kleiner oder gleich dem Wert, `Math.ceil` die kleinste größer oder gleich. Bei negativen Zahlen unterscheidet sich das vom Abschneiden mit einem `(int)`-Cast, der zur 0 hin schneidet. Beide Methoden geben `double` zurück. Für ganzzahlige Division mit Aufrunden gibt es `Math.ceilDiv()` (seit Java 18).",
    syntax: "Math.floor(x)\nMath.ceil(x)",
    example: e(`
System.out.println(Math.floor(2.7));    // 2.0
System.out.println(Math.ceil(2.1));     // 3.0
System.out.println(Math.floor(-1.5));   // -2.0
System.out.println(Math.ceil(-1.5));    // -1.0
System.out.println((int) -1.5);         // -1 (Abschneiden)
System.out.println(Math.ceilDiv(7, 2)); // 4
`),
    keywords: ['abrunden', 'aufrunden', 'floor', 'ceil', 'ceiling', 'ceilDiv'],
    related: ['Math.round()', 'Math.floorMod()'],
    mdn: A + 'lang/Math.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Math.abs()',
    desc: "Betrag einer Zahl; Sonderfall `Integer.MIN_VALUE`.",
    details: "`Math.abs` gibt es für `int`, `long`, `float` und `double`. Weil der negative Bereich eines `int` um 1 größer ist als der positive, bleibt `Math.abs(Integer.MIN_VALUE)` negativ. `Math.absExact()` (seit Java 15) wirft in diesem Fall eine `ArithmeticException`.",
    syntax: "Math.abs(x)",
    example: e(`
System.out.println(Math.abs(-5));            // 5
System.out.println(Math.abs(3.5));           // 3.5
System.out.println(Math.abs(Integer.MIN_VALUE)); // -2147483648

try {
    Math.absExact(Integer.MIN_VALUE);
} catch (ArithmeticException ex) {
    System.out.println(ex.getMessage());     // Overflow to represent absolute value of Integer.MIN_VALUE
}
`),
    keywords: ['betrag', 'absolut', 'abs', 'vorzeichen'],
    related: ['Integer.MAX_VALUE', 'Math.addExact()', 'Math.max()'],
    mdn: A + 'lang/Math.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Math.max()',
    desc: "Größerer (`max`) bzw. kleinerer (`min`) von zwei Werten; `clamp` begrenzt einen Wert.",
    details: "`Math.max` und `Math.min` nehmen genau zwei Argumente; für mehr Werte verschachtelt man sie oder nutzt einen Stream. Bei gemischten Typen wird auf den größeren Typ erweitert. `Math.clamp(wert, min, max)` (seit Java 21) begrenzt einen Wert auf ein Intervall.",
    syntax: "Math.max(a, b)\nMath.min(a, b)\nMath.clamp(wert, min, max)",
    example: e(`
System.out.println(Math.max(3, 7));          // 7
System.out.println(Math.min(3, 7));          // 3
System.out.println(Math.max(1, 2.5));        // 2.5
System.out.println(Math.max(1, Math.max(5, 3))); // 5
System.out.println(Math.clamp(15, 0, 10));   // 10
System.out.println(Math.clamp(-4, 0, 10));   // 0
`),
    keywords: ['maximum', 'minimum', 'größer', 'kleiner', 'begrenzen', 'clamp', 'min'],
    related: ['Math.abs()', 'Arrays.stream()'],
    mdn: A + 'lang/Math.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Math.pow()',
    desc: "Potenz `a` hoch `b` als `double`.",
    details: "`Math.pow(basis, exponent)` rechnet immer mit `double`; für ganzzahlige Zweierpotenzen sind Bitverschiebungen wie `1 << 10` exakter und schneller. Der Operator `^` ist in Java kein Potenzieren, sondern XOR. Für große ganze Zahlen gibt es `BigInteger.pow()`.",
    syntax: "double r = Math.pow(basis, exponent);",
    example: e(`
System.out.println(Math.pow(2, 10));        // 1024.0
System.out.println((int) Math.pow(2, 10));  // 1024
System.out.println(Math.pow(2, 0.5));       // 1.4142135623730951
System.out.println(1 << 10);                // 1024
System.out.println(2 ^ 3);                  // 1 (XOR, keine Potenz!)
System.out.println(BigInteger.TWO.pow(100)); // 1267650600228229401496703205376
`),
    keywords: ['potenz', 'hoch', 'exponent', 'power', 'xor'],
    related: ['Math.sqrt()', 'BigInteger'],
    mdn: A + 'lang/Math.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Math.sqrt()',
    desc: "Quadratwurzel als `double`; negative Werte ergeben `NaN`.",
    details: "`Math.sqrt` liefert für negative Argumente `NaN`, keine Exception. Verwandt sind `Math.cbrt` (Kubikwurzel) und `Math.hypot` (Wurzel aus `x² + y²`, ohne Überlauf in Zwischenschritten). Ob eine Zahl ein Quadrat ist, prüft man besser über eine Rundung als über den Vergleich von Gleitkommawerten.",
    syntax: "Math.sqrt(x)",
    example: e(`
System.out.println(Math.sqrt(16));        // 4.0
System.out.println(Math.sqrt(2));         // 1.4142135623730951
System.out.println(Math.sqrt(-1));        // NaN
System.out.println(Math.cbrt(27));        // 3.0
System.out.println(Math.hypot(3, 4));     // 5.0

int n = 49;
int w = (int) Math.round(Math.sqrt(n));
System.out.println(w * w == n);           // true (ist Quadratzahl)
`),
    keywords: ['wurzel', 'quadratwurzel', 'sqrt', 'cbrt', 'hypot', 'pythagoras'],
    related: ['Math.pow()', 'Double.compare()'],
    mdn: A + 'lang/Math.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Math.addExact()',
    desc: "Rechnet mit Überlauferkennung und wirft `ArithmeticException`.",
    details: "Die `Exact`-Varianten `addExact`, `subtractExact`, `multiplyExact`, `incrementExact` und `negateExact` melden einen Überlauf, statt stillschweigend zu wrappen. `Math.toIntExact(long)` wandelt einen `long` in einen `int` und wirft, wenn er nicht passt. Das schützt etwa Geld- und Mengenberechnungen vor unbemerkten Fehlern.",
    syntax: "Math.addExact(a, b)\nMath.multiplyExact(a, b)\nMath.toIntExact(l)",
    example: e(`
System.out.println(Math.addExact(2, 3));   // 5

try {
    Math.addExact(Integer.MAX_VALUE, 1);
} catch (ArithmeticException ex) {
    System.out.println(ex.getMessage());   // integer overflow
}

long gross = 3_000_000_000L;
try {
    int klein = Math.toIntExact(gross);
} catch (ArithmeticException ex) {
    System.out.println(ex.getMessage());   // integer overflow
}
`),
    keywords: ['überlauf', 'overflow', 'exact', 'multiplyExact', 'toIntExact', 'sicher rechnen'],
    related: ['Integer.MAX_VALUE', 'Math.abs()', 'BigInteger'],
    mdn: A + 'lang/Math.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Math.floorMod()',
    desc: "Modulo mit nichtnegativem Ergebnis bei positivem Teiler (`%` kann negativ sein).",
    details: "Der Operator `%` übernimmt das Vorzeichen des Dividenden: `-7 % 3` ist -1. `Math.floorMod(-7, 3)` ergibt 2 und eignet sich für zyklische Indizes, etwa wenn man in einem Array rückwärts über den Anfang hinaus umlaufen will. Das passende Gegenstück zur Division ist `Math.floorDiv`.",
    syntax: "Math.floorMod(a, b)\nMath.floorDiv(a, b)",
    example: e(`
System.out.println(-7 % 3);                // -1
System.out.println(Math.floorMod(-7, 3));  // 2
System.out.println(-7 / 3);                // -2
System.out.println(Math.floorDiv(-7, 3));  // -3

int[] wochentage = {0, 1, 2, 3, 4, 5, 6};
int i = 0;
System.out.println(wochentage[Math.floorMod(i - 1, wochentage.length)]); // 6
`),
    keywords: ['modulo', 'rest', 'restwert', 'negativ', 'zyklisch', 'ringpuffer', '%'],
    related: ['Math.floor()', 'Integer.MAX_VALUE'],
    mdn: A + 'lang/Math.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Math.random()',
    desc: "Zufallszahl `double` im Bereich von 0,0 (inklusive) bis 1,0 (exklusive).",
    details: "`Math.random()` ist ein einfacher Einstieg, lässt sich aber nicht mit einem Startwert reproduzierbar machen. Eine Zahl von 1 bis 6 erhält man mit `(int) (Math.random() * 6) + 1`. Bequemer und flexibler sind `Random.nextInt(...)` und `ThreadLocalRandom.current().nextInt(von, bis)`.",
    syntax: "double d = Math.random();",
    example: e(`
double d = Math.random();
System.out.println(d >= 0.0 && d < 1.0);       // true

int wuerfel = (int) (Math.random() * 6) + 1;    // 1 bis 6
System.out.println(wuerfel >= 1 && wuerfel <= 6); // true

int ziel = ThreadLocalRandom.current().nextInt(1, 7); // 1 bis 6
System.out.println(ziel >= 1 && ziel <= 6);        // true
`),
    keywords: ['zufall', 'random', 'würfel', 'zufallszahl', 'ThreadLocalRandom'],
    related: ['Random', 'Math.floor()'],
    mdn: A + 'lang/Math.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'Random',
    desc: "Pseudozufallsgenerator; mit festem Seed reproduzierbar.",
    details: "`new Random(seed)` liefert bei gleichem Seed immer dieselbe Folge, das hilft bei Tests und Simulationen. `nextInt(bound)` erzeugt Werte von 0 bis `bound - 1`, `nextInt(von, bis)` (seit Java 17) einen Wert im Bereich `[von, bis)`. Für Sicherheitszwecke wie Tokens oder Passwörter ist `SecureRandom` zu verwenden. In Multithread-Code bietet sich `ThreadLocalRandom` an.",
    syntax: "Random r = new Random();\nRandom r = new Random(seed);\nr.nextInt(bound)",
    example: e(`
Random r1 = new Random(42);
Random r2 = new Random(42);
System.out.println(r1.nextInt(100) == r2.nextInt(100)); // true (gleicher Seed)

Random r = new Random();
int a = r.nextInt(10);          // 0..9
int b = r.nextInt(5, 11);       // 5..10 (seit Java 17)
boolean m = r.nextBoolean();
double g = r.nextDouble();      // 0.0 <= g < 1.0
System.out.println(a < 10 && b >= 5 && b <= 10 && g < 1.0); // true

List<Integer> karten = new ArrayList<>(List.of(1, 2, 3, 4, 5));
Collections.shuffle(karten, new Random(1));
System.out.println(karten.size());   // 5
`),
    tip: "Für Passwörter, Tokens und Schlüssel nie `Random`, sondern `java.security.SecureRandom`.",
    keywords: ['zufall', 'random', 'seed', 'pseudozufall', 'nextInt', 'securerandom', 'würfeln'],
    related: ['Math.random()', 'UUID'],
    mdn: A + 'util/Random.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'BigDecimal',
    desc: "Exakte Dezimalzahlen mit beliebiger Genauigkeit, z. B. für Geld.",
    details: "`BigDecimal` immer aus einem String oder mit `BigDecimal.valueOf(double)` erzeugen, nicht mit `new BigDecimal(0.1)`, das die Ungenauigkeit des `double` übernimmt. Objekte sind unveränderlich, jede Rechenoperation liefert ein neues. `divide` wirft bei nicht abbrechenden Ergebnissen eine `ArithmeticException`, wenn man keine Nachkommastellen und kein `RoundingMode` angibt. `equals` beachtet auch die Skalierung (`2.0` ungleich `2.00`), `compareTo` nicht.",
    syntax: "new BigDecimal(\"0.1\")\na.add(b)  a.subtract(b)  a.multiply(b)\na.divide(b, scale, RoundingMode.HALF_UP)",
    example: e(`
BigDecimal a = new BigDecimal("0.1");
BigDecimal b = new BigDecimal("0.2");
System.out.println(a.add(b));                         // 0.3
System.out.println(new BigDecimal("2.0").equals(new BigDecimal("2.00")));    // false
System.out.println(new BigDecimal("2.0").compareTo(new BigDecimal("2.00"))); // 0

BigDecimal drittel = BigDecimal.ONE.divide(new BigDecimal("3"), 5, RoundingMode.HALF_UP);
System.out.println(drittel);                          // 0.33333

BigDecimal preis = new BigDecimal("19.99").multiply(new BigDecimal("3"));
System.out.println(preis.setScale(1, RoundingMode.HALF_UP)); // 60.0
System.out.println(BigDecimal.valueOf(0.1));          // 0.1
`),
    tip: "Für Geld: Beträge als `BigDecimal` aus Strings, Rundung ausdrücklich mit `RoundingMode` festlegen.",
    keywords: ['dezimal', 'geld', 'währung', 'genau', 'präzision', 'setScale', 'bigdecimal', 'kommazahl'],
    related: ['RoundingMode', 'BigInteger', 'Double.compare()'],
    mdn: A + 'math/BigDecimal.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'BigInteger',
    desc: "Ganze Zahlen beliebiger Größe.",
    details: "`BigInteger` hat keinen Überlauf, rechnet aber über Methoden wie `add`, `multiply`, `pow`, `mod` und `compareTo` statt über Operatoren. Objekte sind unveränderlich. Kleine Werte erzeugt man mit `BigInteger.valueOf(long)`, große aus einem String. Mit `longValueExact()` oder `intValueExact()` wandelt man zurück und erhält bei Überschreitung eine Exception.",
    syntax: "new BigInteger(\"123...\")\nBigInteger.valueOf(5)\na.add(b)  a.multiply(b)  a.pow(n)",
    example: e(`
BigInteger fak = BigInteger.ONE;
for (int i = 2; i <= 25; i++) {
    fak = fak.multiply(BigInteger.valueOf(i));
}
System.out.println(fak);                        // 15511210043330985984000000

BigInteger a = new BigInteger("123456789012345678901234567890");
System.out.println(a.add(BigInteger.TEN));      // 123456789012345678901234567900
System.out.println(a.mod(BigInteger.valueOf(97)));  // 52
System.out.println(BigInteger.valueOf(97).isProbablePrime(20)); // true
System.out.println(a.compareTo(BigInteger.ZERO) > 0);           // true
`),
    keywords: ['große zahlen', 'fakultät', 'unbegrenzt', 'bigint', 'biginteger', 'primzahl'],
    related: ['BigDecimal', 'Math.pow()', 'Math.addExact()'],
    mdn: A + 'math/BigInteger.html'
  },
  {
    lang: 'java', group: 'Zahlen & Mathematik', name: 'RoundingMode',
    desc: "Legt fest, wie `BigDecimal` beim Runden entscheidet.",
    details: "Das Enum steuert `setScale`, `divide` und `round`. `HALF_UP` entspricht der Schulrundung, `HALF_EVEN` (Bankers Rounding) rundet Hälften zur geraden Nachbarzahl und verringert die statistische Verzerrung. `UNNECESSARY` wirft eine `ArithmeticException`, wenn Runden nötig wäre. Bei negativen Zahlen unterscheiden sich `UP`/`DOWN` (weg von bzw. hin zur 0) von `CEILING`/`FLOOR` (Richtung plus bzw. minus unendlich).",
    syntax: "x.setScale(stellen, RoundingMode.HALF_UP)",
    values: [
      ['UP', 'Immer weg von 0'],
      ['DOWN', 'Immer hin zur 0 (Abschneiden)'],
      ['CEILING', 'Richtung plus unendlich'],
      ['FLOOR', 'Richtung minus unendlich'],
      ['HALF_UP', 'Hälfte weg von 0 (Schulrundung)'],
      ['HALF_DOWN', 'Hälfte hin zur 0'],
      ['HALF_EVEN', 'Hälfte zur geraden Nachbarzahl'],
      ['UNNECESSARY', 'Exception, falls Rundung nötig']
    ],
    example: e(`
BigDecimal x = new BigDecimal("2.5");
BigDecimal y = new BigDecimal("-2.5");
for (RoundingMode m : RoundingMode.values()) {
    if (m == RoundingMode.UNNECESSARY) continue;
    System.out.println(m + ": " + x.setScale(0, m) + " / " + y.setScale(0, m));
}
// UP: 3 / -3
// DOWN: 2 / -2
// CEILING: 3 / -2
// FLOOR: 2 / -3
// HALF_UP: 3 / -3
// HALF_DOWN: 2 / -2
// HALF_EVEN: 2 / -2
`),
    keywords: ['runden', 'rundungsmodus', 'half_up', 'half_even', 'bankers rounding', 'setScale'],
    related: ['BigDecimal', 'Math.round()'],
    mdn: A + 'math/RoundingMode.html'
  },

  // ---------------- Hilfsklassen ----------------
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Objects.equals()',
    desc: "Nullsicherer Gleichheitstest zweier Objekte.",
    details: "`Objects.equals(a, b)` ist `true`, wenn beide `null` sind oder `a.equals(b)` gilt, und wirft nie eine `NullPointerException`. Das ist die Standardzutat beim Schreiben von `equals()`. Weitere nützliche Methoden der Klasse sind `Objects.isNull`, `nonNull`, `toString(o, default)` und `requireNonNullElse` (seit Java 9).",
    syntax: "Objects.equals(a, b)",
    example: e(`
System.out.println(Objects.equals("a", "a"));    // true
System.out.println(Objects.equals(null, null));  // true
System.out.println(Objects.equals("a", null));   // false
System.out.println(Objects.toString(null, "-")); // -
System.out.println(Objects.requireNonNullElse(null, "Standard")); // Standard

class Punkt {
    final int x, y;
    Punkt(int x, int y) { this.x = x; this.y = y; }
    @Override public boolean equals(Object o) {
        return o instanceof Punkt p && x == p.x && y == p.y;
    }
    @Override public int hashCode() { return Objects.hash(x, y); }
}
System.out.println(new Punkt(1, 2).equals(new Punkt(1, 2))); // true
`),
    keywords: ['null sicher', 'gleich', 'equals', 'vergleichen', 'nullsafe', 'objects'],
    related: ['Objects.hash()', 'Objects.requireNonNull()', 'String.equals()'],
    mdn: A + 'util/Objects.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Objects.requireNonNull()',
    desc: "Prüft auf `null` und wirft sonst sofort eine `NullPointerException` mit Meldung.",
    details: "Die Methode gibt das geprüfte Objekt zurück, daher lässt sie sich direkt in Zuweisungen von Konstruktoren schreiben. Die Meldung beschreibt, was fehlt, und macht Fehler früh sichtbar statt erst viel später am Verwendungsort. Es gibt auch eine Variante mit `Supplier<String>`, die die Meldung erst bei Bedarf erzeugt.",
    syntax: "Objects.requireNonNull(obj)\nObjects.requireNonNull(obj, \"Meldung\")",
    example: e(`
class Benutzer {
    final String name;
    Benutzer(String name) {
        this.name = Objects.requireNonNull(name, "name darf nicht null sein");
    }
}

System.out.println(new Benutzer("Ada").name);    // Ada
try {
    new Benutzer(null);
} catch (NullPointerException ex) {
    System.out.println(ex.getMessage());         // name darf nicht null sein
}
`),
    keywords: ['null prüfen', 'npe', 'nullpointerexception', 'parameter prüfen', 'guard', 'fail fast'],
    related: ['Objects.equals()', 'Optional'],
    mdn: A + 'util/Objects.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Objects.hash()',
    desc: "Berechnet einen Hashcode aus mehreren Feldern, passend zu `equals()`.",
    details: "`Objects.hash(a, b, c)` kombiniert die Hashcodes der Felder (`null` zählt als 0) und eignet sich für die Implementierung von `hashCode()`. Regel: Wer `equals()` überschreibt, muss `hashCode()` mit denselben Feldern überschreiben, sonst funktionieren `HashMap` und `HashSet` nicht richtig. Records und Enums bekommen beides automatisch.",
    syntax: "@Override public int hashCode() {\n    return Objects.hash(feld1, feld2);\n}",
    example: e(`
System.out.println(Objects.hash("a", 1));      // 3969
System.out.println(Objects.hash(1, 2, 3));     // 30817
System.out.println(Objects.hash((Object) null)); // 31

record Punkt(int x, int y) {}
System.out.println(new Punkt(1, 2).hashCode() == new Punkt(1, 2).hashCode()); // true
Set<Punkt> menge = new HashSet<>();
menge.add(new Punkt(1, 2));
System.out.println(menge.contains(new Punkt(1, 2)));  // true
`),
    tip: "Veränderliche Felder in `hashCode()` verwenden ist riskant: Ändert sich das Objekt in einer `HashMap`, findet man es nicht mehr.",
    keywords: ['hashcode', 'hash', 'equals', 'hashmap', 'record', 'vertrag'],
    related: ['Objects.equals()', 'Arrays.equals()'],
    mdn: A + 'util/Objects.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Optional',
    desc: "Container für einen Wert, der fehlen kann; Alternative zu `null` bei Rückgabewerten.",
    details: "`Optional.of(x)` verlangt einen Wert ungleich `null`, `ofNullable(x)` akzeptiert `null`, `Optional.empty()` ist leer. Man liest mit `orElse`, `orElseGet`, `orElseThrow`, `ifPresent` oder `ifPresentOrElse` (seit Java 9) statt mit `get()`. `isEmpty()` gibt es seit Java 11. Gedacht ist `Optional` für Rückgabewerte, nicht für Felder, Parameter oder Collections.",
    syntax: "Optional<T> o = Optional.ofNullable(wert);\no.isPresent()  o.isEmpty()  o.ifPresent(...)",
    example: e(`
Optional<String> name = Optional.of("Ada");
Optional<String> nichts = Optional.empty();

System.out.println(name);                      // Optional[Ada]
System.out.println(nichts);                    // Optional.empty
System.out.println(name.isPresent());          // true
System.out.println(nichts.isEmpty());          // true
name.ifPresent(n -> System.out.println("Hallo " + n)); // Hallo Ada
nichts.ifPresentOrElse(n -> System.out.println(n), () -> System.out.println("leer")); // leer

Optional<String> vonNull = Optional.ofNullable(null);
System.out.println(vonNull.isPresent());       // false
`),
    tip: "`Optional.get()` ohne Prüfung wirft bei leerem Optional eine `NoSuchElementException`; lieber `orElse...` verwenden.",
    keywords: ['optional', 'null', 'kein wert', 'ofNullable', 'isPresent', 'ifPresent', 'empty'],
    related: ['Optional.map()', 'Optional.orElse()', 'Optional.orElseThrow()'],
    mdn: A + 'util/Optional.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Optional.map()',
    desc: "Wandelt den Wert eines gefüllten `Optional` um; ein leeres bleibt leer.",
    details: "`map` wendet eine Funktion auf den Wert an und verpackt das Ergebnis neu. Liefert die Funktion selbst ein `Optional`, nimmt man `flatMap`, sonst entstünde `Optional<Optional<T>>`. Mit `filter` verwirft man Werte, die eine Bedingung nicht erfüllen. So lassen sich Ketten ohne `if (x != null)` bauen.",
    syntax: "opt.map(fn)\nopt.flatMap(fn)\nopt.filter(pred)",
    example: e(`
Optional<String> name = Optional.of("  ada ");

String ergebnis = name
        .map(String::strip)
        .filter(s -> !s.isEmpty())
        .map(String::toUpperCase)
        .orElse("?");
System.out.println(ergebnis);                        // ADA

Optional<String> leer = Optional.empty();
System.out.println(leer.map(String::length).isPresent()); // false

Optional<Integer> laenge = name.flatMap(s -> Optional.of(s.strip().length()));
System.out.println(laenge);                          // Optional[3]
`),
    keywords: ['umwandeln', 'transformieren', 'flatMap', 'filter', 'kette', 'optional'],
    related: ['Optional', 'Optional.orElse()'],
    mdn: A + 'util/Optional.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Optional.orElse()',
    desc: "Liefert den Wert oder eine Ersatzvariante; `orElseGet` wertet sie erst bei Bedarf aus.",
    details: "Das Argument von `orElse(x)` wird immer berechnet, auch wenn ein Wert vorhanden ist. Bei teuren Ersatzwerten (Datenbank, Objekterzeugung, Logging) nimmt man `orElseGet(supplier)`, das den Supplier nur bei leerem Optional aufruft. Seit Java 9 gibt es außerdem `or(supplier)` mit einem anderen `Optional` als Ersatz.",
    syntax: "opt.orElse(ersatz)\nopt.orElseGet(() -> ersatz)",
    example: e(`
int[] zaehler = {0};
Supplier<String> teuer = () -> { zaehler[0]++; return "Ersatz"; };

Optional<String> da = Optional.of("Wert");
System.out.println(da.orElse(teuer.get()));     // Wert
System.out.println(zaehler[0]);                 // 1 (Argument wurde trotzdem berechnet)

System.out.println(da.orElseGet(teuer));        // Wert
System.out.println(zaehler[0]);                 // 1 (nicht erneut)

System.out.println(Optional.<String>empty().orElseGet(teuer)); // Ersatz
System.out.println(zaehler[0]);                 // 2
`),
    keywords: ['standardwert', 'default', 'fallback', 'orElseGet', 'ersatzwert', 'lazy'],
    related: ['Optional', 'Optional.orElseThrow()', 'Optional.map()'],
    mdn: A + 'util/Optional.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Optional.orElseThrow()',
    desc: "Liefert den Wert oder wirft eine Exception, wenn das `Optional` leer ist.",
    details: "`orElseThrow()` ohne Argument (seit Java 10) wirft eine `NoSuchElementException` und ist die empfohlene Form statt `get()`. Mit einem Supplier wirft man eine eigene Exception, z. B. `orElseThrow(() -> new IllegalArgumentException(\"...\"))`. Der Supplier wird nur bei leerem Optional aufgerufen.",
    syntax: "opt.orElseThrow()\nopt.orElseThrow(() -> new XException(...))",
    example: e(`
Optional<String> da = Optional.of("Ada");
System.out.println(da.orElseThrow());           // Ada

Optional<String> leer = Optional.empty();
try {
    leer.orElseThrow();
} catch (NoSuchElementException ex) {
    System.out.println(ex.getMessage());        // No value present
}

try {
    leer.orElseThrow(() -> new IllegalArgumentException("Name fehlt"));
} catch (IllegalArgumentException ex) {
    System.out.println(ex.getMessage());        // Name fehlt
}
`),
    keywords: ['exception', 'fehler werfen', 'pflichtwert', 'get', 'NoSuchElementException'],
    related: ['Optional.orElse()', 'Optional', 'Objects.requireNonNull()'],
    mdn: A + 'util/Optional.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Arrays.toString()',
    desc: "Gibt den Inhalt eines Arrays als lesbaren String aus.",
    details: "`System.out.println(array)` gibt nur Typ und Hashcode aus (z. B. `[I@1b6d3586`). `Arrays.toString` liefert `[1, 2, 3]`; bei verschachtelten Arrays braucht man `Arrays.deepToString`. Für `null` kommt der Text `null` heraus. Collections haben dagegen schon eine lesbare `toString()`-Ausgabe.",
    syntax: "Arrays.toString(array)\nArrays.deepToString(array2d)",
    example: e(`
int[] zahlen = {3, 1, 2};
System.out.println(Arrays.toString(zahlen));     // [3, 1, 2]

String[] namen = {"Ada", "Bob"};
System.out.println(Arrays.toString(namen));      // [Ada, Bob]

int[][] gitter = {{1, 2}, {3, 4}};
System.out.println(Arrays.toString(gitter).startsWith("[[I@")); // true (nur Referenzen)
System.out.println(Arrays.deepToString(gitter)); // [[1, 2], [3, 4]]

int[] nichts = null;
System.out.println(Arrays.toString(nichts));     // null
`),
    keywords: ['array ausgeben', 'array drucken', 'deepToString', 'toString', 'feld'],
    related: ['Arrays.sort()', 'Arrays.asList()', 'Arrays.equals()'],
    mdn: A + 'util/Arrays.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Arrays.sort()',
    desc: "Sortiert ein Array in-place, auch mit Bereich oder `Comparator`.",
    details: "Für primitive Arrays sortiert `Arrays.sort(a)` aufsteigend. Bereiche gibt `sort(a, von, bis)` an (Ende exklusive). Ein `Comparator` funktioniert nur bei Objekt-Arrays wie `String[]` oder `Integer[]`, nicht bei `int[]`. Die Sortierung von Objekten ist stabil. Mit `Arrays.binarySearch()` sucht man danach in einem sortierten Array.",
    syntax: "Arrays.sort(a)\nArrays.sort(a, von, bis)\nArrays.sort(objekte, comparator)",
    example: e(`
int[] z = {5, 2, 9, 1};
Arrays.sort(z);
System.out.println(Arrays.toString(z));            // [1, 2, 5, 9]
System.out.println(Arrays.binarySearch(z, 5));     // 2

Integer[] absteigend = {5, 2, 9, 1};
Arrays.sort(absteigend, Comparator.reverseOrder());
System.out.println(Arrays.toString(absteigend));   // [9, 5, 2, 1]

String[] w = {"Birne", "apfel", "Kirsche"};
Arrays.sort(w, String.CASE_INSENSITIVE_ORDER);
System.out.println(Arrays.toString(w));            // [apfel, Birne, Kirsche]

int[] teil = {9, 8, 7, 6, 5};
Arrays.sort(teil, 1, 4);
System.out.println(Arrays.toString(teil));         // [9, 6, 7, 8, 5]
`),
    tip: "`binarySearch` liefert auf nicht sortierten Daten ein falsches Ergebnis.",
    keywords: ['sortieren', 'ordnen', 'sort', 'comparator', 'absteigend', 'binarySearch'],
    related: ['Arrays.toString()', 'String.compareTo()', 'Arrays.copyOf()'],
    mdn: A + 'util/Arrays.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Arrays.asList()',
    desc: "Macht aus einem Array eine Liste mit fester Größe, die das Array als Basis nutzt.",
    details: "Die Liste ist eine Sicht auf das Array: `set()` ändert das Array mit, `add()` und `remove()` werfen eine `UnsupportedOperationException`. Bei primitiven Arrays wie `int[]` entsteht eine Liste mit einem einzigen Element, nämlich dem Array selbst. Eine unveränderliche Liste bekommt man mit `List.of(...)`, eine veränderliche mit `new ArrayList<>(Arrays.asList(...))`.",
    syntax: "List<T> l = Arrays.asList(a, b, c);\nList<T> l = Arrays.asList(array);",
    example: e(`
String[] feld = {"c", "a", "b"};
List<String> liste = Arrays.asList(feld);
liste.set(0, "z");
System.out.println(feld[0]);                 // z (Array wurde geändert)
Collections.sort(liste);
System.out.println(Arrays.toString(feld));   // [a, b, z]

try {
    liste.add("x");
} catch (UnsupportedOperationException ex) {
    System.out.println("feste Größe");       // feste Größe
}

int[] prim = {1, 2, 3};
System.out.println(Arrays.asList(prim).size()); // 1

List<String> kopie = new ArrayList<>(Arrays.asList(feld));
kopie.add("x");
System.out.println(kopie);                   // [a, b, z, x]
`),
    keywords: ['array zu liste', 'liste', 'aslist', 'fixed size', 'list.of'],
    related: ['Arrays.toString()', 'Arrays.stream()', 'Arrays.copyOf()'],
    mdn: A + 'util/Arrays.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Arrays.fill()',
    desc: "Füllt ein Array (oder einen Bereich) mit einem Wert; `setAll` füllt per Funktion.",
    details: "`Arrays.fill(a, wert)` belegt alle Plätze, `fill(a, von, bis, wert)` nur einen Bereich. `Arrays.setAll(a, i -> ...)` berechnet jeden Wert aus dem Index. Vorsicht bei mehrdimensionalen Arrays: `Arrays.fill(gitter, new int[3])` verteilt dieselbe Zeile auf alle Plätze.",
    syntax: "Arrays.fill(a, wert)\nArrays.setAll(a, i -> ...)",
    example: e(`
int[] a = new int[5];
Arrays.fill(a, -1);
System.out.println(Arrays.toString(a));   // [-1, -1, -1, -1, -1]

Arrays.fill(a, 1, 3, 0);
System.out.println(Arrays.toString(a));   // [-1, 0, 0, -1, -1]

int[] quadrate = new int[5];
Arrays.setAll(quadrate, i -> i * i);
System.out.println(Arrays.toString(quadrate)); // [0, 1, 4, 9, 16]

int[][] gitter = new int[2][3];
Arrays.fill(gitter, new int[3]);
gitter[0][0] = 9;
System.out.println(gitter[1][0]);         // 9 (beide Zeilen sind dasselbe Array)
`),
    keywords: ['füllen', 'initialisieren', 'fill', 'setAll', 'vorbelegen'],
    related: ['Arrays.copyOf()', 'Arrays.toString()'],
    mdn: A + 'util/Arrays.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Arrays.copyOf()',
    desc: "Kopiert ein Array in ein neues mit anderer Länge; `copyOfRange` kopiert einen Bereich.",
    details: "`copyOf(a, neueLaenge)` schneidet ab oder füllt mit 0, `false` bzw. `null` auf. `copyOfRange(a, von, bis)` schließt `bis` nicht ein. Die Kopie ist flach: Bei Objekt-Arrays werden nur die Referenzen kopiert, die Objekte selbst nicht. `a.clone()` erzeugt ebenfalls eine flache Kopie gleicher Länge.",
    syntax: "Arrays.copyOf(a, laenge)\nArrays.copyOfRange(a, von, bis)",
    example: e(`
int[] a = {1, 2, 3};
System.out.println(Arrays.toString(Arrays.copyOf(a, 5)));      // [1, 2, 3, 0, 0]
System.out.println(Arrays.toString(Arrays.copyOf(a, 2)));      // [1, 2]
System.out.println(Arrays.toString(Arrays.copyOfRange(a, 1, 3))); // [2, 3]

int[] b = a;                 // gleiche Referenz!
int[] c = a.clone();         // echte Kopie
a[0] = 99;
System.out.println(b[0] + " " + c[0]);   // 99 1
`),
    keywords: ['kopieren', 'array kopieren', 'vergrößern', 'copyOfRange', 'clone', 'erweitern'],
    related: ['Arrays.fill()', 'Arrays.equals()', 'Arrays.asList()'],
    mdn: A + 'util/Arrays.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Arrays.equals()',
    desc: "Vergleicht den Inhalt zweier Arrays; `a.equals(b)` vergleicht nur die Referenz.",
    details: "Auf Arrays vergleicht `equals` die Identität. Den Inhalt prüft `Arrays.equals(a, b)`, bei verschachtelten Arrays `Arrays.deepEquals`. Seit Java 9 liefern `Arrays.compare` die lexikographische Ordnung und `Arrays.mismatch` den Index des ersten Unterschieds (oder -1).",
    syntax: "Arrays.equals(a, b)\nArrays.deepEquals(a, b)\nArrays.mismatch(a, b)",
    example: e(`
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
System.out.println(a == b);                 // false
System.out.println(a.equals(b));            // false
System.out.println(Arrays.equals(a, b));    // true

int[][] g1 = {{1}, {2}};
int[][] g2 = {{1}, {2}};
System.out.println(Arrays.equals(g1, g2));      // false
System.out.println(Arrays.deepEquals(g1, g2));  // true

System.out.println(Arrays.mismatch(a, new int[]{1, 2, 9})); // 2
`),
    keywords: ['array vergleichen', 'gleich', 'deepEquals', 'mismatch', 'inhalt'],
    related: ['Arrays.toString()', 'Objects.hash()', 'String.equals()'],
    mdn: A + 'util/Arrays.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Arrays.stream()',
    desc: "Macht aus einem Array einen Stream; `int[]` ergibt einen `IntStream`.",
    details: "Für `int[]`, `long[]` und `double[]` entstehen `IntStream`, `LongStream` und `DoubleStream` mit `sum()`, `average()`, `max()` und weiteren Terminaloperationen. Bei Objekt-Arrays entsteht ein `Stream<T>`. Mit `Arrays.stream(a, von, bis)` verarbeitet man einen Ausschnitt. Alles Weitere zu Streams steht in den Stream-Einträgen.",
    syntax: "Arrays.stream(array)\nArrays.stream(array, von, bis)",
    example: e(`
int[] z = {3, 1, 4, 1, 5};
System.out.println(Arrays.stream(z).sum());                // 14
System.out.println(Arrays.stream(z).max().getAsInt());     // 5
System.out.println(Arrays.stream(z).average().getAsDouble()); // 2.8
System.out.println(Arrays.stream(z, 1, 4).sum());          // 6

String[] w = {"Ada", "Bob"};
System.out.println(Arrays.stream(w).map(String::toUpperCase).toList()); // [ADA, BOB]
`),
    keywords: ['stream', 'array', 'summe', 'durchschnitt', 'intstream', 'sum'],
    related: ['Arrays.toString()', 'Arrays.asList()', 'Math.max()'],
    mdn: A + 'util/Arrays.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'UUID',
    desc: "Weltweit praktisch eindeutige 128-Bit-Kennung.",
    details: "`UUID.randomUUID()` erzeugt eine zufällige UUID (Version 4) und eignet sich für IDs ohne zentrale Vergabe. Die Textform hat 36 Zeichen im Muster `8-4-4-4-12`. `UUID.fromString(...)` liest sie wieder ein, `version()` nennt die Version. Zufällige UUIDs sind nicht sortierbar nach Erzeugungszeit.",
    syntax: "UUID id = UUID.randomUUID();\nUUID.fromString(text)",
    example: e(`
UUID id = UUID.randomUUID();
System.out.println(id.toString().length());   // 36
System.out.println(id.version());             // 4

UUID u = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
System.out.println(u.version());              // 1
System.out.println(u);                        // 123e4567-e89b-12d3-a456-426614174000
System.out.println(u.equals(UUID.fromString("123E4567-E89B-12D3-A456-426614174000"))); // true
`),
    keywords: ['id', 'eindeutig', 'guid', 'zufall', 'kennung', 'uuid'],
    related: ['Random', 'String.valueOf()'],
    mdn: A + 'util/UUID.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Scanner',
    desc: "Liest formatierte Eingaben aus Konsole, Datei oder String.",
    details: "`new Scanner(System.in)` liest von der Tastatur. `next()` liest ein Wort, `nextInt()` und `nextDouble()` lesen Zahlen, `nextLine()` eine ganze Zeile. Klassische Falle: Nach `nextInt()` bleibt der Zeilenumbruch stehen, ein folgendes `nextLine()` liefert deshalb eine leere Zeile. `hasNextInt()` und `hasNextLine()` prüfen, ob noch etwas kommt. `nextDouble()` erwartet das Dezimalformat des Locale; mit `useLocale(Locale.US)` wird der Punkt erkannt. Scanner auf `System.in` schließt beim `close()` auch die Eingabe.",
    syntax: "Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nString z = sc.nextLine();",
    example: e(`
// Hier zu Demozwecken auf einem String; im Programm: new Scanner(System.in)
Scanner sc = new Scanner("42 Ada\\nzweite Zeile\\n3.5\\n");
int n = sc.nextInt();            // 42
String wort = sc.next();         // Ada
sc.nextLine();                   // Rest der ersten Zeile verwerfen
String zeile = sc.nextLine();    // zweite Zeile
sc.useLocale(Locale.US);
double d = sc.nextDouble();      // 3.5
System.out.println(n + "|" + wort + "|" + zeile + "|" + d); // 42|Ada|zweite Zeile|3.5
System.out.println(sc.hasNext()); // false

try (Scanner zahlen = new Scanner("1 2 3")) {
    int summe = 0;
    while (zahlen.hasNextInt()) summe += zahlen.nextInt();
    System.out.println(summe);   // 6
}
`),
    tip: "Nach `nextInt()` oder `nextDouble()` einmal `nextLine()` aufrufen, bevor man mit `nextLine()` eine Zeile liest.",
    keywords: ['eingabe', 'input', 'konsole', 'tastatur', 'lesen', 'system.in', 'nextLine', 'nextInt'],
    related: ['Integer.parseInt()', 'Locale', 'System.out.println()'],
    mdn: A + 'util/Scanner.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Locale',
    desc: "Beschreibt Sprache und Region für Formate, Groß-/Kleinschreibung und Namen.",
    details: "Zahlen-, Datums- und Textformatierung hängt vom Locale ab, das standardmäßig vom Betriebssystem kommt (`Locale.getDefault()`). Konstanten wie `Locale.GERMANY`, `Locale.US` und `Locale.ROOT` (neutral, für technische Texte) decken häufige Fälle ab; mit `Locale.forLanguageTag(\"de-AT\")` oder `Locale.of(\"de\", \"CH\")` (seit Java 19) baut man weitere. Der alte Konstruktor `new Locale(...)` ist seit Java 19 veraltet.",
    syntax: "Locale.GERMANY\nLocale.forLanguageTag(\"de-AT\")\nLocale.of(\"de\", \"CH\")",
    example: e(`
Locale de = Locale.GERMANY;
System.out.println(de.getLanguage());        // de
System.out.println(de.getCountry());         // DE
System.out.println(de.toLanguageTag());      // de-DE
System.out.println(de);                      // de_DE

Locale at = Locale.forLanguageTag("de-AT");
System.out.println(at.getCountry());         // AT
System.out.println(Locale.of("de", "CH"));   // de_CH

System.out.println(String.format(Locale.US, "%,.2f", 1234.5));      // 1,234.50
System.out.println(String.format(Locale.GERMANY, "%,.2f", 1234.5)); // 1.234,50
`),
    tip: "Für Dateiformate, Schlüssel und Protokolle `Locale.ROOT` nehmen, sonst hängt das Ergebnis vom Rechner ab.",
    keywords: ['sprache', 'region', 'lokalisierung', 'i18n', 'locale', 'land', 'zahlenformat'],
    related: ['String.format()', 'DateTimeFormatter', 'String.toUpperCase()'],
    mdn: A + 'util/Locale.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'System.out.println()',
    desc: "Gibt Text mit Zeilenumbruch auf der Standardausgabe aus.",
    details: "`println` hängt einen Zeilenumbruch an, `print` nicht, `System.out.println()` ohne Argument gibt nur eine Leerzeile aus. Fehlermeldungen gehören nach `System.err`. Bei Objekten wird `String.valueOf(x)` und damit `toString()` aufgerufen. Fallstricke: `1 + 2 + \"x\"` ergibt `3x`, `\"x\" + 1 + 2` dagegen `x12`, und `'a' + 'b'` ergibt die Zahl 195.",
    syntax: "System.out.println(x);\nSystem.out.print(x);\nSystem.err.println(x);",
    example: e(`
System.out.print("A");
System.out.print("B");
System.out.println();             // Zeilenumbruch
System.out.println("Hallo");

System.out.println(1 + 2 + "x");  // 3x
System.out.println("x" + 1 + 2);  // x12
System.out.println('a' + 'b');    // 195
System.out.println("" + 'a' + 'b'); // ab

char[] cs = {'J', 'a', 'v', 'a'};
System.out.println(cs);           // Java
System.err.println("Fehlerkanal");
`),
    keywords: ['ausgabe', 'print', 'drucken', 'konsole', 'sysout', 'println', 'stderr'],
    related: ['System.out.printf()', 'String.format()', 'StringBuilder'],
    mdn: A + 'io/PrintStream.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'System.out.printf()',
    desc: "Gibt formatierten Text aus, ohne automatischen Zeilenumbruch.",
    details: "`printf(vorlage, args...)` nutzt dieselben Spezifizierer wie `String.format()`. Zeilenumbrüche setzt man mit `%n`, nicht von selbst. Ohne Locale gilt das Standard-Locale (Dezimalkomma auf deutschen Systemen); ein festes Locale steht als erstes Argument. `System.out.format(...)` ist ein Synonym.",
    syntax: "System.out.printf(vorlage, args...);\nSystem.out.printf(locale, vorlage, args...);",
    example: e(`
System.out.printf("%s ist %d Jahre alt%n", "Ada", 36);   // Ada ist 36 Jahre alt
System.out.printf(Locale.US, "Pi = %.3f%n", Math.PI);    // Pi = 3.142
System.out.printf("|%-6s|%6s|%n", "links", "rechts");   // |links |rechts|
System.out.printf(Locale.US, "%5.1f%%%n", 99.5);         //  99.5%
`),
    tip: "Weniger Argumente als Platzhalter ergibt eine `MissingFormatArgumentException`.",
    keywords: ['formatiert ausgeben', 'printf', 'format', 'ausgabe', 'platzhalter', 'tabelle'],
    related: ['Format-Spezifizierer', 'String.format()', 'System.out.println()'],
    mdn: A + 'io/PrintStream.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Format-Spezifizierer',
    desc: "Platzhalter für `printf`, `String.format()` und `formatted()`.",
    details: "Allgemeine Form: `%[Flags][Breite][.Genauigkeit]Umwandlung`. Flags sind etwa `-` (linksbündig), `0` (mit Nullen füllen), `+` (Vorzeichen) und `,` (Tausendertrenner). Die Zeichenfolge `%n` steht für den Zeilenumbruch, `%%` für ein Prozentzeichen. Falsche Typen wie `%d` mit einem `double` führen zu einer `IllegalFormatConversionException`.",
    syntax: "%[Flags][Breite][.Genauigkeit]Umwandlung",
    values: [
      ['%s', 'String (oder toString() eines Objekts)'],
      ['%d', 'Ganzzahl'],
      ['%f / %.2f', 'Kommazahl, Standard 6 Nachkommastellen / hier 2'],
      ['%e', 'Wissenschaftliche Schreibweise'],
      ['%x / %X', 'Hexadezimal klein / groß'],
      ['%o', 'Oktal'],
      ['%c', 'Einzelnes Zeichen'],
      ['%b', 'boolean'],
      ['%5d', 'Mindestbreite 5, rechtsbündig'],
      ['%-5d', 'Mindestbreite 5, linksbündig'],
      ['%05d', 'Mit Nullen auf Breite 5 auffüllen'],
      ['%,d', 'Mit Tausendertrenner'],
      ['%+d', 'Vorzeichen immer anzeigen'],
      ['%n', 'Plattformabhängiger Zeilenumbruch'],
      ['%%', 'Ein Prozentzeichen']
    ],
    example: e(`
Locale l = Locale.US;
System.out.println(String.format(l, "%,d", 1234567));        // 1,234,567
System.out.println(String.format(l, "%08.3f", 3.14159));     // 0003.142
System.out.println(String.format(l, "|%-8s|%8s|", "ab", "cd")); // |ab      |      cd|
System.out.println(String.format(l, "%x %X %o", 255, 255, 8));  // ff FF 10
System.out.println(String.format(l, "%e", 12345.678));       // 1.234568e+04
System.out.println(String.format(l, "%c %b", 'A', true));    // A true
System.out.println(String.format(l, "%+d", 5));              // +5
System.out.println(String.format(l, "%2$s %1$s", "Welt", "Hallo")); // Hallo Welt
`),
    tip: "Mit `%2$s` greift man auf Argumente nach Position zu, praktisch für Übersetzungen mit anderer Wortreihenfolge.",
    keywords: ['format', 'platzhalter', 'printf', 'formatstring', 'placeholder', 'spezifizierer', 'zahlenformat'],
    related: ['System.out.printf()', 'String.format()', 'String.formatted()'],
    mdn: A + 'util/Formatter.html#syntax'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'System.currentTimeMillis()',
    desc: "Millisekunden seit dem 1.1.1970 UTC (Unix-Epoche), also die aktuelle Systemzeit.",
    details: "Die Uhr folgt der Systemzeit und kann sich bei Zeitumstellung oder Synchronisierung sprunghaft ändern, ist also für Zeitmessungen weniger geeignet als `System.nanoTime()`. Für moderne Zeitangaben nimmt man `Instant.now()` aus `java.time`. Den Wert in ein Datum zu verwandeln geht mit `Instant.ofEpochMilli(ms)`.",
    syntax: "long ms = System.currentTimeMillis();",
    example: e(`
long jetzt = System.currentTimeMillis();
System.out.println(jetzt > 1_700_000_000_000L);  // true (nach November 2023)

Instant i = Instant.ofEpochMilli(0);
System.out.println(i);                            // 1970-01-01T00:00:00Z
System.out.println(Instant.now().toEpochMilli() >= jetzt); // true
`),
    keywords: ['zeit', 'zeitstempel', 'timestamp', 'epoch', 'millisekunden', 'unix zeit'],
    related: ['System.nanoTime()', 'Instant', 'Date und Calendar'],
    mdn: A + 'lang/System.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'System.nanoTime()',
    desc: "Monotone Zeit in Nanosekunden, nur für Zeitdifferenzen geeignet.",
    details: "Der Ausgangspunkt von `nanoTime()` ist beliebig, einzelne Werte haben keine Bedeutung. Nur die Differenz zweier Aufrufe in derselben JVM ist verwertbar und hängt nicht von Systemzeit-Änderungen ab. Für saubere Benchmarks genügt das nicht (Aufwärmphase, JIT); dafür gibt es JMH.",
    syntax: "long t0 = System.nanoTime();\n// ...\nlong dauerNs = System.nanoTime() - t0;",
    example: e(`
long start = System.nanoTime();
long summe = 0;
for (int i = 0; i < 1_000_000; i++) summe += i;
long ns = System.nanoTime() - start;

System.out.println(summe);            // 499999500000
System.out.println(ns >= 0);          // true
long ms = ns / 1_000_000;             // in Millisekunden
Duration d = Duration.ofNanos(ns);    // als Duration weiterverwenden
System.out.println(d.isNegative());   // false
`),
    keywords: ['zeitmessung', 'stoppuhr', 'benchmark', 'dauer messen', 'performance', 'nanosekunden'],
    related: ['System.currentTimeMillis()', 'Duration'],
    mdn: A + 'lang/System.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'System.getenv()',
    desc: "Liest Umgebungsvariablen; `System.getProperty()` liest JVM-Eigenschaften.",
    details: "`System.getenv(\"NAME\")` liefert den Wert oder `null`, `System.getenv()` eine unveränderliche `Map` aller Variablen. Unter Windows ist die Groß-/Kleinschreibung egal, unter Linux nicht. `System.getProperty(\"user.dir\")`, `\"java.version\"` oder `\"os.name\"` liefern JVM-Eigenschaften, die man mit `-Dname=wert` setzen kann; ein zweites Argument gibt den Standardwert an.",
    syntax: "System.getenv(\"NAME\")\nSystem.getProperty(\"name\", standard)",
    example: e(`
String modus = System.getenv().getOrDefault("APP_MODE", "dev");
System.out.println(modus);                               // dev, falls APP_MODE nicht gesetzt ist

String fehlt = System.getenv("GIBT_ES_NICHT_12345");
System.out.println(fehlt);                               // null

System.out.println(System.getProperty("nicht.da", "std")); // std
System.out.println(System.getProperty("java.version") != null); // true
System.out.println(System.getProperty("user.dir") != null);     // true
`),
    tip: "Geheimnisse wie Passwörter und API-Schlüssel gehören in Umgebungsvariablen, nicht in den Quelltext.",
    keywords: ['umgebungsvariable', 'environment', 'env', 'property', 'konfiguration', 'getProperty', 'path'],
    related: ['Runtime', 'System.exit()'],
    mdn: A + 'lang/System.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'System.exit()',
    desc: "Beendet die JVM mit einem Exit-Code; 0 bedeutet Erfolg.",
    details: "`System.exit(status)` stoppt das Programm sofort: Ausstehende `finally`-Blöcke laufen nicht mehr, nur registrierte Shutdown-Hooks werden noch ausgeführt. Ein Status ungleich 0 signalisiert Skripten und CI einen Fehler. In Bibliotheken und Servern sollte man `exit` vermeiden und Exceptions nutzen. `Runtime.halt()` beendet ohne Hooks.",
    syntax: "System.exit(0);\nSystem.exit(1);",
    example: e(`
Runtime.getRuntime().addShutdownHook(new Thread(() -> System.out.println("Aufräumen")));
System.out.println("Ende");
try {
    System.exit(0);
} finally {
    System.out.println("wird nie ausgegeben");
}
// Ausgabe: Ende, dann Aufräumen
`),
    keywords: ['beenden', 'programm beenden', 'exit code', 'status', 'shutdown hook', 'abbrechen'],
    related: ['Runtime', 'System.getenv()'],
    mdn: A + 'lang/System.html'
  },
  {
    lang: 'java', group: 'Hilfsklassen', name: 'Runtime',
    desc: "Zugriff auf Laufzeitumgebung: Prozessoren, Speicher, Version, Shutdown-Hooks.",
    details: "`Runtime.getRuntime()` liefert die einzige Instanz. `availableProcessors()` gibt die Zahl der verfügbaren Kerne an, `totalMemory()`, `freeMemory()` und `maxMemory()` den Heap in Bytes. `Runtime.version()` (seit Java 9) liefert die Java-Version, z. B. `feature()` für die Hauptversion. `gc()` ist nur ein Hinweis. Für neue Prozesse nimmt man `ProcessBuilder`; `exec(String)` ist seit Java 18 veraltet.",
    syntax: "Runtime rt = Runtime.getRuntime();",
    example: e(`
Runtime rt = Runtime.getRuntime();
System.out.println(rt.availableProcessors() >= 1);   // true
long belegt = rt.totalMemory() - rt.freeMemory();
System.out.println(belegt > 0);                      // true
System.out.println(rt.maxMemory() >= rt.totalMemory()); // true
System.out.println(Runtime.version().feature());     // 25 (bei Java 25)
`),
    keywords: ['speicher', 'heap', 'prozessoren', 'kerne', 'jvm', 'version', 'availableProcessors', 'memory'],
    related: ['System.exit()', 'System.getenv()'],
    mdn: A + 'lang/Runtime.html'
  },

  // ---------------- Datum & Zeit ----------------
  {
    lang: 'java', group: 'Datum & Zeit', name: 'java.time im Überblick',
    desc: "Moderne, unveränderliche Datums- und Zeit-API (seit Java 8).",
    details: "Das Paket `java.time` ersetzt `Date` und `Calendar`. Alle Klassen sind unveränderlich und thread-sicher: Methoden wie `plusDays()` liefern ein neues Objekt. Monate zählen von 1 bis 12. Man wählt den Typ nach dem, was man ausdrücken will: Datum ohne Zeit, Zeit ohne Datum, mit oder ohne Zeitzone, maschinelle Zeitachse oder Zeitspanne.",
    syntax: "import java.time.*;",
    values: [
      ['LocalDate', 'Datum ohne Zeit und Zone (2025-03-14)'],
      ['LocalTime', 'Uhrzeit ohne Datum (09:30)'],
      ['LocalDateTime', 'Datum und Uhrzeit ohne Zone'],
      ['ZonedDateTime', 'Datum, Uhrzeit und Zeitzone (inkl. Sommerzeit)'],
      ['OffsetDateTime', 'Datum, Uhrzeit und fester Offset zu UTC'],
      ['Instant', 'Zeitpunkt auf der Maschinen-Zeitachse (UTC)'],
      ['Duration', 'Zeitspanne in Sekunden und Nanosekunden'],
      ['Period', 'Zeitspanne in Jahren, Monaten und Tagen'],
      ['ZoneId', 'Zeitzone, z. B. Europe/Berlin'],
      ['DateTimeFormatter', 'Formatieren und Parsen']
    ],
    example: e(`
LocalDate d = LocalDate.of(2025, 3, 14);
System.out.println(d.plusDays(30));                 // 2025-04-13
System.out.println(d.getDayOfWeek());               // FRIDAY
System.out.println(d);                              // 2025-03-14 (d selbst ist unverändert)

LocalTime t = LocalTime.of(9, 30);
System.out.println(LocalDateTime.of(d, t));         // 2025-03-14T09:30

System.out.println(Duration.ofMinutes(90));         // PT1H30M
System.out.println(Period.of(1, 2, 3));             // P1Y2M3D
`),
    tip: "Für Geburtstage und Termine ohne Uhrzeit `LocalDate`, für Zeitstempel in Logs `Instant`, für Anzeige in einer Zeitzone `ZonedDateTime`.",
    keywords: ['datum', 'zeit', 'java.time', 'date', 'time', 'zeitzone', 'kalender', 'übersicht'],
    related: ['LocalDate', 'LocalDateTime', 'ZonedDateTime', 'Instant', 'Date und Calendar'],
    mdn: D + 'date-time/'
  },
  {
    lang: 'java', group: 'Datum & Zeit', name: 'LocalDate',
    desc: "Kalenderdatum ohne Uhrzeit und Zeitzone.",
    details: "Erzeugt wird es mit `LocalDate.of(jahr, monat, tag)`, `LocalDate.now()` oder `LocalDate.parse(\"2025-03-14\")`. Rechnen mit `plusDays`, `minusMonths`, `plusYears` und Verwandten; bei kürzeren Monaten wird der Tag begrenzt, aus dem 31. Januar plus einem Monat wird der letzte Februartag. Ungültige Daten wie der 30. Februar werfen eine `DateTimeException`. Vergleichen mit `isBefore`, `isAfter`, `isEqual` oder `compareTo`.",
    syntax: "LocalDate.of(jahr, monat, tag)\nLocalDate.now()\nLocalDate.parse(\"2025-03-14\")",
    example: e(`
LocalDate d = LocalDate.of(2024, 1, 31);
System.out.println(d.plusMonths(1));                // 2024-02-29
System.out.println(d.isLeapYear());                 // true
System.out.println(d.lengthOfMonth());              // 31
System.out.println(d.withDayOfMonth(1));            // 2024-01-01
System.out.println(d.getMonth() + " " + d.getMonthValue()); // JANUARY 1

LocalDate weihnachten = LocalDate.parse("2025-12-24");
System.out.println(weihnachten.getDayOfWeek());     // WEDNESDAY
System.out.println(d.isBefore(weihnachten));        // true

try {
    LocalDate.of(2025, 2, 30);
} catch (DateTimeException ex) {
    System.out.println("ungültiges Datum");         // ungültiges Datum
}
`),
    keywords: ['datum', 'tag', 'monat', 'jahr', 'localdate', 'schaltjahr', 'wochentag', 'kalender'],
    related: ['LocalDateTime', 'Period', 'ChronoUnit', 'DateTimeFormatter'],
    mdn: A + 'time/LocalDate.html'
  },
  {
    lang: 'java', group: 'Datum & Zeit', name: 'LocalTime',
    desc: "Uhrzeit ohne Datum und Zeitzone.",
    details: "Erzeugt mit `LocalTime.of(stunde, minute)`, `of(h, m, s)`, `now()` oder `parse(\"08:15\")`. Rechenoperationen laufen über Mitternacht hinaus im Kreis: 23:30 plus 2 Stunden ist 01:30, ohne Datumswechsel. `truncatedTo(ChronoUnit.MINUTES)` schneidet kleinere Einheiten ab. Konstanten: `LocalTime.MIDNIGHT` und `LocalTime.NOON`.",
    syntax: "LocalTime.of(14, 30)\nLocalTime.parse(\"08:15\")\nLocalTime.now()",
    example: e(`
LocalTime t = LocalTime.of(14, 30, 15);
System.out.println(t);                              // 14:30:15
System.out.println(LocalTime.of(14, 30));           // 14:30
System.out.println(t.plusMinutes(45));              // 15:15:15
System.out.println(LocalTime.of(23, 30).plusHours(2)); // 01:30
System.out.println(t.truncatedTo(ChronoUnit.MINUTES)); // 14:30
System.out.println(t.isBefore(LocalTime.NOON));     // false
System.out.println(LocalTime.parse("08:15").toSecondOfDay()); // 29700
`),
    keywords: ['uhrzeit', 'stunde', 'minute', 'localtime', 'zeit', 'mitternacht'],
    related: ['LocalDateTime', 'Duration', 'DateTimeFormatter'],
    mdn: A + 'time/LocalTime.html'
  },
  {
    lang: 'java', group: 'Datum & Zeit', name: 'LocalDateTime',
    desc: "Datum und Uhrzeit ohne Zeitzone.",
    details: "`LocalDateTime` beschreibt, was auf einer Wanduhr steht, aber keinen eindeutigen Zeitpunkt, weil die Zone fehlt. Mit `atZone(ZoneId)` macht man daraus einen `ZonedDateTime`, mit `toLocalDate()` und `toLocalTime()` zerlegt man es wieder. Für Zeitstempel, die zwischen Systemen ausgetauscht werden, ist `Instant` die bessere Wahl. Die Standardausgabe nutzt das ISO-Format mit `T`.",
    syntax: "LocalDateTime.of(2025, 3, 14, 9, 30)\nLocalDateTime.parse(\"2025-03-14T09:30\")\nLocalDateTime.now()",
    example: e(`
LocalDateTime dt = LocalDateTime.of(2025, 3, 14, 9, 30);
System.out.println(dt);                           // 2025-03-14T09:30
System.out.println(dt.plusHours(20));             // 2025-03-15T05:30
System.out.println(dt.toLocalDate());             // 2025-03-14
System.out.println(dt.toLocalTime());             // 09:30

ZonedDateTime berlin = dt.atZone(ZoneId.of("Europe/Berlin"));
System.out.println(berlin);                       // 2025-03-14T09:30+01:00[Europe/Berlin]
System.out.println(LocalDateTime.parse("2025-03-14T09:30").equals(dt)); // true
`),
    keywords: ['datum und zeit', 'localdatetime', 'timestamp', 'zeitpunkt', 'atZone'],
    related: ['LocalDate', 'LocalTime', 'ZonedDateTime', 'Instant'],
    mdn: A + 'time/LocalDateTime.html'
  },
  {
    lang: 'java', group: 'Datum & Zeit', name: 'ZonedDateTime',
    desc: "Datum, Uhrzeit und Zeitzone inklusive Sommerzeit-Regeln.",
    details: "Ein `ZonedDateTime` bezeichnet einen eindeutigen Zeitpunkt in einer Region (`ZoneId.of(\"Europe/Berlin\")`). Beim Rechnen werden Zeitumstellungen berücksichtigt. Mit `withZoneSameInstant` zeigt man denselben Zeitpunkt in einer anderen Zone, `withZoneSameLocal` behält die Uhrzeit. Zeitzonen immer als Region (`Europe/Berlin`) angeben, nicht als feste Abkürzung wie `CET`.",
    syntax: "ZonedDateTime.of(datumZeit, ZoneId.of(\"Europe/Berlin\"))\nZonedDateTime.now(zone)",
    example: e(`
ZoneId berlin = ZoneId.of("Europe/Berlin");
ZonedDateTime z = ZonedDateTime.of(2025, 3, 30, 1, 30, 0, 0, berlin);
System.out.println(z);                  // 2025-03-30T01:30+01:00[Europe/Berlin]
System.out.println(z.plusHours(1));     // 2025-03-30T03:30+02:00[Europe/Berlin] (Zeitumstellung)

ZonedDateTime ny = z.withZoneSameInstant(ZoneId.of("America/New_York"));
System.out.println(ny);                 // 2025-03-29T20:30-04:00[America/New_York]
System.out.println(z.toInstant());      // 2025-03-30T00:30:00Z
`),
    tip: "Für Termine in der Zukunft (z. B. Meetings) lieber lokale Zeit plus Zone speichern als einen festen Instant, falls sich die Zeitzonenregeln ändern.",
    keywords: ['zeitzone', 'sommerzeit', 'dst', 'zoneid', 'zoneddatetime', 'utc', 'umrechnen'],
    related: ['Instant', 'LocalDateTime', 'DateTimeFormatter'],
    mdn: A + 'time/ZonedDateTime.html'
  },
  {
    lang: 'java', group: 'Datum & Zeit', name: 'Instant',
    desc: "Zeitpunkt auf der UTC-Zeitachse, gemessen ab 1970-01-01T00:00:00Z.",
    details: "`Instant` ist für Maschinen gedacht: Zeitstempel in Logs, Datenbanken und Protokollen. Die Ausgabe endet mit `Z` für UTC. Er unterstützt Sekunden-, Millisekunden- und Nanosekundenrechnung, aber keine Monate oder Jahre; `instant.plus(1, ChronoUnit.MONTHS)` wirft eine `UnsupportedTemporalTypeException`. Für Menschen konvertiert man mit `atZone(zone)`.",
    syntax: "Instant.now()\nInstant.parse(\"2025-01-01T12:00:00Z\")\nInstant.ofEpochMilli(ms)",
    example: e(`
Instant i = Instant.parse("2025-01-01T12:00:00Z");
System.out.println(i.toEpochMilli());           // 1735732800000
System.out.println(i.plusSeconds(3600));        // 2025-01-01T13:00:00Z
System.out.println(Instant.ofEpochSecond(0));   // 1970-01-01T00:00:00Z
System.out.println(i.atZone(ZoneId.of("Europe/Berlin"))); // 2025-01-01T13:00+01:00[Europe/Berlin]

try {
    i.plus(1, ChronoUnit.MONTHS);
} catch (UnsupportedTemporalTypeException ex) {
    System.out.println("Monate gehen nicht");   // Monate gehen nicht
}
`),
    keywords: ['zeitstempel', 'timestamp', 'epoch', 'utc', 'maschinenzeit', 'instant', 'unix'],
    related: ['ZonedDateTime', 'System.currentTimeMillis()', 'Duration'],
    mdn: A + 'time/Instant.html'
  },
  {
    lang: 'java', group: 'Datum & Zeit', name: 'Duration',
    desc: "Zeitspanne in Stunden, Minuten, Sekunden und kleiner.",
    details: "`Duration.between(a, b)` misst zwischen zwei Zeiten, `Duration.ofMinutes(90)` baut eine Dauer direkt. Die Ausgabe ist ISO-formatiert (`PT8H30M`). Mit `toMinutes()` erhält man die Gesamtzahl, mit `toHoursPart()` und `toMinutesPart()` (seit Java 9) die Anteile. Zwischen reinen `LocalDate`-Werten wirft `between` eine Exception, dafür gibt es `Period` und `ChronoUnit`.",
    syntax: "Duration.between(von, bis)\nDuration.ofMinutes(90)\nd.toMinutes()",
    example: e(`
Duration d = Duration.between(LocalTime.of(9, 0), LocalTime.of(17, 30));
System.out.println(d);                      // PT8H30M
System.out.println(d.toMinutes());          // 510
System.out.println(d.toHoursPart() + ":" + d.toMinutesPart()); // 8:30
System.out.println(d.plusMinutes(45));      // PT9H15M
System.out.println(Duration.ofSeconds(3725).toString()); // PT1H2M5S
System.out.println(Duration.ofMinutes(90).compareTo(Duration.ofHours(1)) > 0); // true
`),
    keywords: ['dauer', 'zeitspanne', 'differenz', 'stunden', 'minuten', 'duration', 'between'],
    related: ['Period', 'ChronoUnit', 'System.nanoTime()'],
    mdn: A + 'time/Duration.html'
  },
  {
    lang: 'java', group: 'Datum & Zeit', name: 'Period',
    desc: "Zeitspanne in Jahren, Monaten und Tagen.",
    details: "`Period.between(datum1, datum2)` liefert die Differenz als Kombination aus Jahren, Monaten und Tagen, etwa für ein Alter. Für die reine Anzahl Tage nimmt man `ChronoUnit.DAYS.between(...)`. Die Teile sind unabhängig voneinander; `Period.ofMonths(14)` ist nicht dasselbe wie 1 Jahr 2 Monate, bis man `normalized()` aufruft.",
    syntax: "Period.between(von, bis)\nPeriod.of(jahre, monate, tage)\nPeriod.ofDays(n)",
    example: e(`
LocalDate geburt = LocalDate.of(2000, 1, 15);
LocalDate heute = LocalDate.of(2025, 3, 14);
Period p = Period.between(geburt, heute);
System.out.println(p);                                // P25Y1M27D
System.out.println(p.getYears() + " Jahre");          // 25 Jahre
System.out.println(Period.ofMonths(14).normalized()); // P1Y2M
System.out.println(heute.plus(Period.ofWeeks(2)));    // 2025-03-28
`),
    keywords: ['alter', 'zeitspanne', 'jahre monate tage', 'period', 'differenz datum'],
    related: ['Duration', 'ChronoUnit', 'LocalDate'],
    mdn: A + 'time/Period.html'
  },
  {
    lang: 'java', group: 'Datum & Zeit', name: 'DateTimeFormatter',
    desc: "Formatiert und parst Datums- und Zeitwerte mit Mustern.",
    details: "`DateTimeFormatter.ofPattern(\"dd.MM.yyyy\")` erzeugt einen Formatter, `format()` und `parse()` benutzen ihn. Die Konstanten wie `ISO_LOCAL_DATE` entsprechen den Standardformaten. Namen von Monaten und Wochentagen hängen vom Locale ab; `ofPattern(muster, locale)` legt es fest. Fallstricke: `yyyy` (Jahr) nicht mit `YYYY` (Wochenjahr) verwechseln, `HH` (0 bis 23) nicht mit `hh` (1 bis 12), `MM` (Monat) nicht mit `mm` (Minute).",
    syntax: "DateTimeFormatter.ofPattern(\"dd.MM.yyyy\")\ndatum.format(formatter)\nLocalDate.parse(text, formatter)",
    values: [
      ['yyyy / yy', 'Jahr vierstellig / zweistellig'],
      ['MM / M', 'Monat numerisch'],
      ['MMM / MMMM', 'Monatsname kurz / lang'],
      ['dd / d', 'Tag des Monats'],
      ['EEE / EEEE', 'Wochentag kurz / lang'],
      ['HH', 'Stunde 0 bis 23'],
      ['hh + a', 'Stunde 1 bis 12 mit AM/PM'],
      ['mm', 'Minute'],
      ['ss', 'Sekunde'],
      ['SSS', 'Millisekunden'],
      ['VV / z / XXX', 'Zonen-ID / Zonenname / Offset']
    ],
    example: e(`
DateTimeFormatter f = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
LocalDateTime dt = LocalDateTime.of(2025, 3, 14, 9, 5);
System.out.println(dt.format(f));                           // 14.03.2025 09:05

LocalDate d = LocalDate.parse("24.12.2025", DateTimeFormatter.ofPattern("dd.MM.yyyy"));
System.out.println(d);                                      // 2025-12-24

DateTimeFormatter lang = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy", Locale.US);
System.out.println(LocalDate.of(2025, 3, 14).format(lang)); // Friday, March 14, 2025
System.out.println(LocalDate.of(2025, 3, 14).format(DateTimeFormatter.ISO_LOCAL_DATE)); // 2025-03-14

try {
    LocalDate.parse("2025/03/14");
} catch (DateTimeParseException ex) {
    System.out.println("Format passt nicht");               // Format passt nicht
}
`),
    keywords: ['formatieren', 'parsen', 'muster', 'pattern', 'datum ausgeben', 'dd.MM.yyyy', 'simpledateformat'],
    related: ['LocalDate', 'LocalDateTime', 'Locale'],
    mdn: A + 'time/format/DateTimeFormatter.html'
  },
  {
    lang: 'java', group: 'Datum & Zeit', name: 'ChronoUnit',
    desc: "Zeiteinheiten; `ChronoUnit.DAYS.between(a, b)` zählt volle Einheiten.",
    details: "`einheit.between(a, b)` liefert die Anzahl vollständiger Einheiten als `long`; das Ergebnis ist negativ, wenn `b` vor `a` liegt. Die Methode funktioniert mit allen Zeit-Typen, die die Einheit unterstützen, `HOURS` etwa nicht für ein reines `LocalDate`. Mit `plus(n, einheit)` und `truncatedTo(einheit)` nutzt man dieselben Einheiten zum Rechnen und Abschneiden.",
    syntax: "ChronoUnit.DAYS.between(von, bis)\ndatum.plus(2, ChronoUnit.WEEKS)",
    values: [
      ['NANOS / MICROS / MILLIS', 'Sehr kleine Einheiten'],
      ['SECONDS / MINUTES / HOURS', 'Zeit'],
      ['DAYS / WEEKS', 'Tage und Wochen'],
      ['MONTHS / YEARS', 'Monate und Jahre'],
      ['DECADES / CENTURIES', 'Jahrzehnte und Jahrhunderte']
    ],
    example: e(`
LocalDate a = LocalDate.of(2025, 1, 1);
LocalDate b = LocalDate.of(2025, 12, 31);
System.out.println(ChronoUnit.DAYS.between(a, b));     // 364
System.out.println(ChronoUnit.WEEKS.between(a, b));    // 52
System.out.println(ChronoUnit.DAYS.between(b, a));     // -364
System.out.println(ChronoUnit.MONTHS.between(LocalDate.of(2025, 1, 31), LocalDate.of(2025, 2, 28))); // 0
System.out.println(a.plus(2, ChronoUnit.WEEKS));       // 2025-01-15

LocalTime t = LocalTime.of(9, 0);
System.out.println(ChronoUnit.MINUTES.between(t, LocalTime.of(10, 30))); // 90
`),
    keywords: ['tage zwischen', 'differenz', 'between', 'wochen', 'monate', 'zeiteinheit', 'chronounit'],
    related: ['Duration', 'Period', 'LocalDate'],
    mdn: A + 'time/temporal/ChronoUnit.html'
  },
  {
    lang: 'java', group: 'Datum & Zeit', name: 'Date und Calendar',
    desc: "Alte, veränderliche Datums-API; in neuem Code `java.time` verwenden.",
    details: "`java.util.Date` ist ein Zeitpunkt in Millisekunden und hat eine irreführende Textausgabe in der Standardzone; `Calendar` zählt Monate ab 0 und ist veränderlich und fehleranfällig. Beide sind nicht offiziell als veraltet markiert, aber von der Praxis überholt. Alte Schnittstellen und Bibliotheken liefern sie noch: Mit `date.toInstant()` und `Date.from(instant)` wechselt man in die neue API.",
    syntax: "date.toInstant()\nDate.from(instant)\ncalendar.toInstant()",
    example: e(`
Date d = Date.from(Instant.parse("2025-01-01T12:00:00Z"));
System.out.println(d.getTime());           // 1735732800000
System.out.println(d.toInstant());         // 2025-01-01T12:00:00Z

Calendar c = Calendar.getInstance();
c.set(2025, Calendar.MARCH, 14);
System.out.println(c.get(Calendar.MONTH)); // 2 (Monate ab 0)
System.out.println(c.get(Calendar.YEAR));  // 2025

// Besser: java.time
LocalDate neu = LocalDate.of(2025, 3, 14); // Monat 3 = März
System.out.println(neu.getMonthValue());   // 3
`),
    tip: "Wer eine `SimpleDateFormat`-Instanz teilt, bekommt Fehler in Threads: Sie ist nicht thread-sicher. `DateTimeFormatter` schon.",
    keywords: ['date', 'calendar', 'gregoriancalendar', 'simpledateformat', 'legacy', 'veraltet', 'alt', 'konvertieren'],
    related: ['java.time im Überblick', 'Instant', 'LocalDate'],
    mdn: A + 'util/Date.html'
  },

  // ---------------- Reguläre Ausdrücke ----------------
  {
    lang: 'java', group: 'Reguläre Ausdrücke', name: 'Pattern',
    desc: "Kompilierter regulärer Ausdruck; einmal bauen, oft verwenden.",
    details: "`Pattern.compile(regex)` übersetzt den Ausdruck; `pattern.matcher(text)` erzeugt dazu einen `Matcher`. Flags wie `Pattern.CASE_INSENSITIVE`, `MULTILINE` und `DOTALL` stellt man als zweites Argument ein, oder im Ausdruck als `(?i)`. In Java-Strings muss jeder Backslash verdoppelt werden (`\"\\\\d+\"`). Muster, die mehrfach benutzt werden, legt man als `static final` Feld ab, da das Kompilieren teuer ist.",
    syntax: "Pattern p = Pattern.compile(regex);\nPattern p = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);\nMatcher m = p.matcher(text);",
    example: e(`
Pattern p = Pattern.compile("\\\\d{3}-\\\\d{4}");
System.out.println(p.matcher("555-1234").matches());   // true
System.out.println(p.matcher("Tel 555-1234!").find()); // true

Pattern ci = Pattern.compile("java", Pattern.CASE_INSENSITIVE);
System.out.println(ci.matcher("Ich mag JAVA").find()); // true

System.out.println(Arrays.toString(Pattern.compile("[,;]\\\\s*").split("a, b;c")));  // [a, b, c]
System.out.println(Pattern.matches("[a-z]+", "abc"));  // true
System.out.println("a.b".matches(Pattern.quote("a.b"))); // true
`),
    tip: "Benutzereingaben mit `Pattern.quote(text)` einbetten, wenn sie wörtlich gesucht werden sollen.",
    keywords: ['regex', 'regulärer ausdruck', 'pattern', 'compile', 'muster', 'flags', 'case insensitive'],
    related: ['Matcher', 'Regex-Syntax', 'String.matches()'],
    mdn: A + 'util/regex/Pattern.html'
  },
  {
    lang: 'java', group: 'Reguläre Ausdrücke', name: 'Matcher',
    desc: "Führt ein `Pattern` auf einem Text aus; liefert Treffer und Gruppen.",
    details: "`matches()` prüft den ganzen Text, `find()` sucht den nächsten Treffer (in einer `while`-Schleife für alle), `lookingAt()` prüft den Anfang. Erst nach einem erfolgreichen Aufruf sind `group()`, `group(n)`, `start()` und `end()` gültig, sonst gibt es eine `IllegalStateException`. Gruppe 0 ist der Gesamttreffer, Gruppen zählen nach den öffnenden Klammern. `results()` (seit Java 9) liefert alle Treffer als Stream.",
    syntax: "Matcher m = p.matcher(text);\nwhile (m.find()) { m.group(1); }",
    example: e(`
Matcher m = Pattern.compile("(\\\\d+)-(\\\\d+)").matcher("Zimmer 12-34 und 5-6");
while (m.find()) {
    System.out.println(m.group(1) + "/" + m.group(2) + " bei " + m.start());
}
// 12/34 bei 7
// 5/6 bei 17

Matcher x = Pattern.compile("\\\\d+").matcher("a1b22c333");
System.out.println(x.results().map(MatchResult::group).toList()); // [1, 22, 333]

Matcher leer = Pattern.compile("\\\\d+").matcher("abc");
try {
    leer.group();
} catch (IllegalStateException ex) {
    System.out.println("kein Treffer");   // kein Treffer
}
`),
    keywords: ['regex', 'find', 'group', 'treffer', 'match', 'gruppen', 'suchen'],
    related: ['Pattern', 'Benannte Gruppen', 'String.replaceAll()'],
    mdn: A + 'util/regex/Matcher.html'
  },
  {
    lang: 'java', group: 'Reguläre Ausdrücke', name: 'String.matches()',
    desc: "Prüft, ob der gesamte String auf einen regulären Ausdruck passt.",
    details: "`matches` verlangt, dass der ganze String passt, nicht nur ein Teil; Anker `^` und `$` sind überflüssig. Für ein Teilvorkommen verwendet man `Matcher.find()` oder `.*muster.*`. Die Methode kompiliert bei jedem Aufruf neu; in Schleifen ist ein vorab erzeugtes `Pattern` schneller.",
    syntax: "boolean b = s.matches(regex);",
    example: e(`
System.out.println("12345".matches("\\\\d+"));        // true
System.out.println("ab12".matches("\\\\d+"));         // false (ganzer String muss passen)
System.out.println("ab12".matches(".*\\\\d+.*"));      // true
System.out.println("anna@example.org".matches("[\\\\w.]+@[\\\\w.]+\\\\.[a-z]{2,}")); // true
System.out.println("80331".matches("\\\\d{5}"));       // true
`),
    tip: "Für wirklich wasserdichte E-Mail-Prüfung reicht kein einfacher Regex; ein einfaches Muster dient nur als Plausibilitätscheck.",
    keywords: ['regex', 'prüfen', 'validieren', 'matches', 'muster', 'email', 'postleitzahl'],
    related: ['Pattern', 'Regex-Syntax', 'String.contains()'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Reguläre Ausdrücke', name: 'String.replaceAll()',
    desc: "Ersetzt alle Treffer eines regulären Ausdrucks; `$1` verweist auf Gruppen.",
    details: "`replaceAll(regex, ersatz)` ersetzt alle Treffer, `replaceFirst` nur den ersten. Im Ersatz stehen `$1`, `$2` und `${name}` für Gruppen, ein wörtliches `$` oder `\\` muss mit `Matcher.quoteReplacement()` maskiert werden. Fehlerhafte Muster wie ein einzelnes `+` werfen eine `PatternSyntaxException`; bei einem festen Text ist `replace()` die richtige Wahl.",
    syntax: "s.replaceAll(regex, ersatz)\ns.replaceFirst(regex, ersatz)",
    example: e(`
System.out.println("2025-03-14".replaceAll("(\\\\d+)-(\\\\d+)-(\\\\d+)", "$3.$2.$1")); // 14.03.2025
System.out.println("a  b   c".replaceAll("\\\\s+", " "));         // a b c
System.out.println("a1b22".replaceAll("\\\\d", "#"));            // a#b##
System.out.println("a1b22".replaceFirst("\\\\d+", "#"));         // a#b22

String roh = "Preis: 5$";
System.out.println(roh.replaceAll("5\\\\$", Matcher.quoteReplacement("5 $ netto"))); // Preis: 5 $ netto

System.out.println("1+1".replace("+", "-"));                   // 1-1 (kein Regex nötig)
`),
    keywords: ['regex ersetzen', 'replaceAll', 'ersetzen', 'gruppen', 'backreference', 'replaceFirst'],
    related: ['String.replace()', 'Matcher', 'Regex-Syntax'],
    mdn: A + 'lang/String.html'
  },
  {
    lang: 'java', group: 'Reguläre Ausdrücke', name: 'Regex-Syntax',
    desc: "Bausteine regulärer Ausdrücke; in Java-Strings jeden Backslash verdoppeln.",
    details: "In einem Java-String steht `\\\\d` für das Regex-Zeichen `\\d`, ein wörtlicher Backslash im Regex ist `\\\\\\\\`. Das gilt auch in Text Blocks, die Escape-Sequenzen ebenfalls auswerten. Quantifizierer sind standardmäßig gierig (`*`), mit `?` dahinter genügsam (`*?`), mit `+` dahinter besitzergreifend (`*+`). Die Tabelle zeigt die Regex-Schreibweise; im Quelltext kommen die Backslashes doppelt.",
    syntax: "Regex  \\d+      ->  Java-String  \"\\\\d+\"\nRegex  \\.       ->  Java-String  \"\\\\.\"",
    values: [
      ['.', 'Beliebiges Zeichen (außer Zeilenende)'],
      ['\\d  \\D', 'Ziffer / keine Ziffer'],
      ['\\w  \\W', 'Wortzeichen [A-Za-z0-9_] / kein Wortzeichen'],
      ['\\s  \\S', 'Leerraum / kein Leerraum'],
      ['\\b', 'Wortgrenze'],
      ['^  $', 'Anfang / Ende (Text, mit MULTILINE: Zeile)'],
      ['[abc]  [^abc]  [a-z]', 'Zeichenklasse / Negation / Bereich'],
      ['a|b', 'Alternative'],
      ['(...)  (?:...)', 'Gruppe mit / ohne Erfassung'],
      ['(?<name>...)', 'Benannte Gruppe'],
      ['*  +  ?', 'Null oder mehr / ein oder mehr / null oder eins'],
      ['{n}  {n,}  {n,m}', 'Genau n / mindestens n / n bis m'],
      ['*?  +?', 'Genügsame Quantifizierer'],
      ['(?=...)  (?!...)', 'Lookahead positiv / negativ'],
      ['(?<=...)  (?<!...)', 'Lookbehind positiv / negativ'],
      ['\\p{L}  \\p{Lu}', 'Unicode-Buchstabe / Großbuchstabe'],
      ['\\Q...\\E', 'Alles dazwischen wörtlich'],
      ['(?i)  (?m)  (?s)', 'Flags: Groß-/Kleinschreibung, Mehrzeilig, Punkt auch für Zeilenende']
    ],
    example: e(`
// Regex \\d{5} -> Java "\\\\d{5}"
System.out.println("80331".matches("\\\\d{5}"));                 // true
System.out.println("a.b".split("\\\\.").length);                 // 2
System.out.println("Überfluss".matches("\\\\p{L}+"));            // true
System.out.println("foo123".matches("[a-z]+\\\\d+"));            // true
System.out.println("<b>x</b><b>y</b>".replaceAll("<b>.*?</b>", "-")); // --
System.out.println("<b>x</b><b>y</b>".replaceAll("<b>.*</b>", "-"));  // -
System.out.println("preis100".matches("preis(?=\\\\d)\\\\w+"));   // true
System.out.println("C:\\\\temp".replaceAll("\\\\\\\\", "/"));          // C:/temp
`),
    tip: "Wörtlicher Backslash im Regex: im Java-String vier Backslashes (`\"\\\\\\\\\"`).",
    keywords: ['regex', 'regulärer ausdruck', 'syntax', 'quantifizierer', 'lookahead', 'zeichenklasse', 'backslash', 'escape'],
    related: ['Pattern', 'Matcher', 'String.split()', 'Benannte Gruppen'],
    mdn: A + 'util/regex/Pattern.html'
  },
  {
    lang: 'java', group: 'Reguläre Ausdrücke', name: 'Benannte Gruppen',
    desc: "Gruppen mit Namen: `(?<name>...)` und Zugriff über `group(\"name\")`.",
    details: "Statt Gruppen nach Nummern anzusprechen, vergibt man Namen, die aus Buchstaben und Ziffern bestehen und mit einem Buchstaben beginnen (kein Unterstrich). Das macht Muster lesbarer und stabil gegen eingefügte Gruppen. Im Ersatztext von `replaceAll` verweist `${name}` auf eine benannte Gruppe. Ein unbekannter Name wirft eine `IllegalArgumentException`.",
    syntax: "(?<name>muster)\nmatcher.group(\"name\")",
    example: e(`
Pattern p = Pattern.compile("(?<jahr>\\\\d{4})-(?<monat>\\\\d{2})-(?<tag>\\\\d{2})");
Matcher m = p.matcher("Termin: 2025-03-14");
if (m.find()) {
    System.out.println(m.group("tag") + "." + m.group("monat") + "." + m.group("jahr")); // 14.03.2025
    System.out.println(m.group(1));          // 2025 (Nummer geht weiterhin)
}

try {
    m.group("stunde");
} catch (IllegalArgumentException ex) {
    System.out.println("unbekannte Gruppe"); // unbekannte Gruppe
}
`),
    keywords: ['regex', 'gruppe', 'benannt', 'named group', 'capture', 'group name'],
    related: ['Matcher', 'Regex-Syntax', 'Pattern'],
    mdn: A + 'util/regex/Pattern.html'
  }
  );
})();
