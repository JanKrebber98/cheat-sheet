window.CHEAT = window.CHEAT || [];
(function () {
  var A = 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/'; // + z. B. 'util/List.html'
  var S = 'https://docs.oracle.com/en/java/javase/25/docs/specs/man/';            // + z. B. 'javac.html'
  var L = 'https://docs.oracle.com/javase/specs/jls/se25/html/';                  // + z. B. 'jls-14.html'
  var D = 'https://dev.java/learn/';                                              // Tutorials
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Java-Grundlagen ----------------
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'Was ist Java?',
    desc: "Statisch typisierte, objektorientierte Sprache, die zu Bytecode für die JVM kompiliert wird.",
    details: "Der Compiler `javac` übersetzt `.java`-Quelldateien in plattformunabhängigen Bytecode (`.class`-Dateien), den die Java Virtual Machine (JVM) ausführt. Das JDK enthält Compiler, Werkzeuge und Laufzeitumgebung; die JRE ist nur die Laufzeitumgebung, die JVM darin führt den Bytecode aus. Java 25 ist eine LTS-Version (Long-Term Support). Typen werden zur Compile-Zeit geprüft, der Speicher wird vom Garbage Collector verwaltet.",
    syntax: "Quelltext (.java) -> javac -> Bytecode (.class) -> JVM (java)",
    values: [
      ['JDK', 'Java Development Kit: Compiler, Werkzeuge und Laufzeit zum Entwickeln'],
      ['JRE', 'Java Runtime Environment: nur zum Ausführen von Programmen'],
      ['JVM', 'Virtuelle Maschine, die Bytecode ausführt und kompiliert (JIT)'],
      ['Bytecode', 'Plattformunabhängiger Zwischencode in .class-Dateien'],
      ['LTS', 'Version mit langem Support, z. B. Java 17, 21 und 25']
    ],
    example: e(`
// Hallo.java -> javac Hallo.java -> Hallo.class -> java Hallo
public class Hallo {
    public static void main(String[] args) {
        // Version der laufenden JVM (hängt von der Installation ab)
        System.out.println("Spezifikation: " + System.getProperty("java.specification.version"));
    }
}
`),
    tip: "Quelltext einmal kompilieren, überall ausführen: Der Bytecode läuft auf jeder Plattform mit passender JVM.",
    keywords: ['jdk', 'jre', 'jvm', 'bytecode', 'einführung', 'what is java', 'laufzeitumgebung', 'lts', 'virtuelle maschine'],
    related: ['Hello World', 'javac', 'java'],
    mdn: D
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'Hello World',
    desc: "Das kleinste klassische Java-Programm: eine Klasse mit einer main-Methode.",
    details: "Eine öffentliche Klasse muss in einer Datei liegen, die genauso heißt wie die Klasse (`HelloWorld.java`). `System.out.println` schreibt eine Zeile auf die Standardausgabe. Groß- und Kleinschreibung zählt: `string` statt `String` oder `system` statt `System` sind häufige Anfängerfehler.",
    syntax: "public class Name {\n    public static void main(String[] args) {\n        ...\n    }\n}",
    example: e(`
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hallo, Welt!"); // Hallo, Welt!
    }
}
`),
    tip: "Seit Java 25 geht es auch kürzer mit einer kompakten Quelldatei: `void main() { IO.println(\"Hallo\"); }`.",
    keywords: ['hallo welt', 'erstes programm', 'println', 'ausgabe', 'system.out', 'einstieg'],
    related: ['main-Methode', 'Kompakte Quelldateien', 'javac'],
    mdn: D
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'main-Methode',
    desc: "Einstiegspunkt eines Java-Programms, den die JVM beim Start aufruft.",
    details: "Klassisch lautet die Signatur `public static void main(String[] args)`; `args` enthält die Kommandozeilenargumente. Seit Java 25 darf `main` auch ohne `public`, ohne `static` und ohne Parameter geschrieben werden, die Klasse wird dann instanziiert. Gibt es mehrere Varianten, wählt der Launcher nach einer festen Reihenfolge, die klassische Form hat Vorrang. Eine Klasse ohne passende `main` lässt sich nicht starten.",
    syntax: "public static void main(String[] args)  // klassisch\nvoid main()                             // seit Java 25",
    example: e(`
public class Start {
    public static void main(String[] args) {
        System.out.println("Argumente: " + args.length); // ohne Argumente: 0
        for (String a : args) {
            System.out.println(a);
        }
    }
}
`),
    tip: "Aufruf mit Argumenten: `java Start eins zwei`. Zahlen kommen immer als String an und müssen mit `Integer.parseInt` umgewandelt werden.",
    keywords: ['einstiegspunkt', 'entry point', 'args', 'kommandozeile', 'startmethode', 'instance main'],
    related: ['Hello World', 'Kompakte Quelldateien', 'java'],
    mdn: L + 'jls-12.html'
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'Kompakte Quelldateien',
    desc: "Programm ohne Klassendeklaration: nur eine main-Methode in der Datei (seit Java 25).",
    details: "In einer kompakten Quelldatei stehen Methoden und Felder direkt auf oberster Ebene, die umgebende Klasse legt der Compiler implizit an. Alle Pakete des Moduls `java.base` (z. B. `java.util`) sind automatisch importiert. Die Klasse `IO` aus `java.lang` bietet `IO.println`, `IO.print` und `IO.readln` für einfache Ein- und Ausgabe. Das Feature ist seit Java 25 final und eignet sich für Skripte und Lernbeispiele, nicht für größere Projekte.",
    syntax: "void main() {\n    IO.println(\"...\");\n}",
    values: [
      ['IO.println(x)', 'Gibt x mit Zeilenumbruch aus'],
      ['IO.print(x)', 'Gibt x ohne Zeilenumbruch aus'],
      ['IO.readln(prompt)', 'Liest eine Zeile von der Konsole (mit Eingabeaufforderung)']
    ],
    example: e(`
// Datei: Hallo.java, Start mit: java Hallo.java
void main() {
    var namen = List.of("Ada", "Linus");   // java.util ist automatisch importiert
    for (var n : namen) {
        IO.println("Hallo " + n);          // Hallo Ada, dann Hallo Linus
    }
}
`),
    tip: "Der Dateiname muss (ohne `.java`) ein gültiger Bezeichner sein; die implizite Klasse trägt diesen Namen.",
    keywords: ['compact source file', 'unnamed class', 'implicit class', 'ohne klasse', 'IO.println', 'java 25', 'einsteiger', 'skript'],
    related: ['main-Methode', 'Hello World', 'java'],
    mdn: A + 'lang/IO.html'
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'javac',
    desc: "Der Java-Compiler: übersetzt .java-Dateien in .class-Dateien.",
    details: "`javac` erzeugt aus jeder Klasse eine eigene `.class`-Datei. Ohne `-d` landen die Dateien neben dem Quelltext, mit `-d out` in einem Ausgabeverzeichnis, das der Compiler passend zu den Paketen aufbaut. Mit `-cp` gibt man den Klassenpfad für benötigte Bibliotheken an. Seit Java 18 liest `javac` Quelltext standardmäßig als UTF-8 (JEP 400); `-encoding` braucht man nur für andere Kodierungen.",
    syntax: "javac [Optionen] Datei.java ...",
    values: [
      ['-d verz', 'Ausgabeverzeichnis für die .class-Dateien'],
      ['-cp pfad', 'Klassenpfad (auch -classpath)'],
      ['--release N', 'Kompiliert gegen Java-Version N'],
      ['-encoding UTF-8', 'Zeichenkodierung der Quelldateien'],
      ['-Xlint:all', 'Alle optionalen Warnungen aktivieren'],
      ['--module-path pfad', 'Modulpfad für modulare Projekte']
    ],
    example: e(`
# Eine Datei kompilieren
javac Hallo.java

# Mehrere Dateien eines Pakets in ein Ausgabeverzeichnis
javac -d out src/de/firma/*.java

# Mit Bibliothek und festem Zielrelease
javac --release 25 -cp lib/gson.jar -d out src/de/firma/Main.java

# Ausführen
java -cp out de.firma.Main
`),
    exampleLang: 'js',
    tip: "Fehlermeldungen nennen Datei und Zeile; der erste Fehler ist meist die Ursache, Folgefehler verschwinden oft von selbst.",
    keywords: ['compiler', 'kompilieren', 'classpath', 'class-datei', 'build', 'cli'],
    related: ['java', 'jar', 'Was ist Java?'],
    mdn: S + 'javac.html'
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'java',
    desc: "Startet die JVM: führt eine Klasse, ein JAR oder direkt eine Quelldatei aus.",
    details: "`java Klasse` startet `main` einer kompilierten Klasse (voll qualifiziert mit Paket, ohne `.class`). `java -jar app.jar` nutzt die `Main-Class` aus dem Manifest. Der Einzeldatei-Modus `java Hallo.java` kompiliert den Quelltext im Speicher und führt die erste Klasse darin aus, ohne `.class`-Dateien zu erzeugen. Speicher und Systemeigenschaften lassen sich über Optionen wie `-Xmx` und `-D` setzen.",
    syntax: "java [Optionen] Klasse [Argumente]\njava [Optionen] -jar datei.jar [Argumente]\njava [Optionen] Datei.java [Argumente]",
    values: [
      ['-cp pfad', 'Klassenpfad (auch -classpath)'],
      ['-jar datei', 'JAR mit Main-Class im Manifest starten'],
      ['-Xmx512m', 'Maximale Heap-Größe setzen'],
      ['-Dname=wert', 'Systemeigenschaft setzen'],
      ['-ea', 'Assertions aktivieren'],
      ['--version', 'Installierte Java-Version anzeigen']
    ],
    example: e(`
# Kompilierte Klasse starten
java -cp out de.firma.Main

# JAR starten
java -jar app.jar eins zwei

# Einzeldatei-Modus: ohne separates javac
java Hallo.java

# Mit Heap-Limit, Assertions und Systemeigenschaft
java -Xmx512m -ea -Dstage=test -jar app.jar
`),
    exampleLang: 'js',
    tip: "Bei `java Klasse` keine Endung `.class` angeben, bei `java Datei.java` dagegen die Endung `.java`.",
    keywords: ['starten', 'ausführen', 'run', 'launcher', 'jvm', 'single-file', 'einzeldatei', 'source launcher', '-jar'],
    related: ['javac', 'jar', 'jshell'],
    mdn: S + 'java.html'
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'jshell',
    desc: "Interaktive Konsole (REPL) zum schnellen Ausprobieren von Java-Code.",
    details: "In `jshell` werden Ausdrücke und Anweisungen sofort ausgewertet, ohne Klasse und `main`. Das Ergebnis eines Ausdrucks landet in einer automatisch benannten Variable wie `$1`. Befehle beginnen mit einem Schrägstrich. Gängige Pakete wie `java.util` sind vorimportiert.",
    syntax: "jshell [Optionen]",
    values: [
      ['/help', 'Hilfe zu allen Befehlen'],
      ['/vars', 'Alle Variablen anzeigen'],
      ['/methods', 'Alle Methoden anzeigen'],
      ['/list', 'Bisher eingegebenen Code anzeigen'],
      ['/open datei', 'Datei laden und ausführen'],
      ['/save datei', 'Eingaben in Datei speichern'],
      ['/reset', 'Zustand zurücksetzen'],
      ['/exit', 'jshell beenden']
    ],
    example: e(`
$ jshell
jshell> int x = 6 * 7
x ==> 42
jshell> x / 5
$2 ==> 8
jshell> String gruss(String n) { return "Hallo " + n; }
|  created method gruss(String)
jshell> /vars
jshell> /exit
`),
    exampleLang: 'js',
    tip: "Ideal, um API-Verhalten (z. B. von `String`-Methoden) auszuprobieren, bevor man es ins Projekt schreibt.",
    keywords: ['repl', 'interaktiv', 'konsole', 'ausprobieren', 'shell', 'read eval print loop'],
    related: ['java', 'javac'],
    mdn: S + 'jshell.html'
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'jar',
    desc: "Packt Klassen und Ressourcen zu einem JAR-Archiv, optional startbar mit -jar.",
    details: "Ein JAR ist ein ZIP-Archiv mit optionaler Datei `META-INF/MANIFEST.MF`. Mit `--main-class` (oder `e` bei der Kurzform) wird der Einstiegspunkt ins Manifest geschrieben, sodass `java -jar` ohne Klassenangabe startet. Mit `-C verzeichnis .` nimmt man den Inhalt eines Verzeichnisses ohne dessen Namen auf. Abhängigkeiten werden nicht eingepackt, sie müssen im Klassenpfad liegen oder in ein \"Fat JAR\" gebaut werden (z. B. durch Maven oder Gradle).",
    syntax: "jar --create --file datei.jar [--main-class Klasse] -C verz .",
    values: [
      ['--create / c', 'Neues Archiv erzeugen'],
      ['--file / f', 'Name der JAR-Datei'],
      ['--main-class / e', 'Einstiegsklasse ins Manifest schreiben'],
      ['--list / t', 'Inhalt auflisten'],
      ['--extract / x', 'Inhalt entpacken'],
      ['-C verz', 'In Verzeichnis wechseln, danach folgenden Pfad aufnehmen']
    ],
    example: e(`
# JAR bauen (Klassen liegen in out/)
jar --create --file app.jar --main-class de.firma.Main -C out .

# Kurzform
jar cfe app.jar de.firma.Main -C out .

# Inhalt ansehen und starten
jar tf app.jar
java -jar app.jar
`),
    exampleLang: 'js',
    keywords: ['archiv', 'manifest', 'main-class', 'fat jar', 'paketieren', 'zip'],
    related: ['java', 'javac'],
    mdn: S + 'jar.html'
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'javadoc',
    desc: "Erzeugt HTML-Dokumentation aus Dokumentationskommentaren (/** ... */).",
    details: "Das Werkzeug `javadoc` liest Kommentare, die mit `/**` beginnen, und die Tags wie `@param`, `@return` und `@throws`. Der erste Satz dient als Kurzbeschreibung. In Kommentaren kann man mit `{@code ...}` Code setzen und mit `{@link Klasse#methode}` verlinken. Seit Java 23 sind auch Markdown-Kommentare mit `///` möglich.",
    syntax: "javadoc -d doc -sourcepath src -subpackages de.firma",
    values: [
      ['@param name', 'Beschreibt einen Parameter'],
      ['@return', 'Beschreibt den Rückgabewert'],
      ['@throws Typ', 'Beschreibt eine mögliche Exception'],
      ['@see', 'Verweis auf verwandte Elemente'],
      ['{@code x}', 'Code im Fließtext'],
      ['{@link K#m}', 'Verlinkung auf Klasse oder Methode']
    ],
    example: e(`
/**
 * Berechnet die Summe zweier Zahlen.
 *
 * @param a die erste Zahl
 * @param b die zweite Zahl
 * @return die Summe von {@code a} und {@code b}
 */
static int summe(int a, int b) {
    return a + b;
}

public static void main(String[] args) {
    System.out.println(summe(2, 3)); // 5
}
`),
    tip: "Der Kommentar muss direkt vor der Deklaration stehen, sonst wird er ignoriert.",
    keywords: ['dokumentation', 'doc comment', 'api doc', '@param', '@return', 'html'],
    related: ['Kommentare', 'javac'],
    mdn: S + 'javadoc.html'
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'Kommentare',
    desc: "Zeilen-, Block- und Dokumentationskommentare, die der Compiler ignoriert.",
    details: "`//` kommentiert bis zum Zeilenende, `/* ... */` über mehrere Zeilen, `/** ... */` ist ein Dokumentationskommentar für `javadoc`. Blockkommentare lassen sich nicht verschachteln: das erste `*/` beendet den Kommentar. Seit Java 23 gibt es zusätzlich Markdown-Dokumentationskommentare, die mit `///` beginnen.",
    syntax: "// Zeile\n/* Block */\n/** Doku */",
    example: e(`
// Zeilenkommentar
int x = 5; // Kommentar am Zeilenende

/* Blockkommentar
   über mehrere Zeilen */
int y = /* auch mittendrin */ 7;

/** Dokumentationskommentar (steht vor Klassen, Methoden, Feldern) */

/// Markdown-Dokumentationskommentar (seit Java 23)

// int deaktiviert = 1;   // Code auskommentiert
System.out.println(x + y); // 12
`),
    tip: "Gute Kommentare erklären das Warum, nicht das Was. Auskommentierten Code besser per Versionsverwaltung aufbewahren.",
    keywords: ['kommentar', 'comment', 'doc', 'auskommentieren', 'block', 'zeile'],
    related: ['javadoc'],
    mdn: L + 'jls-3.html'
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'Namenskonventionen',
    desc: "Übliche Schreibweisen für Klassen, Methoden, Variablen, Konstanten und Pakete.",
    details: "Der Compiler erzwingt sie nicht, aber der gesamte Java-Code folgt ihnen. Klassen heißen im UpperCamelCase und sind Substantive, Methoden und Variablen im lowerCamelCase, Methoden meist Verben. Konstanten (`static final`) werden in GROSSBUCHSTABEN mit Unterstrichen geschrieben, Pakete komplett klein. Bezeichner dürfen Umlaute enthalten, im Team ist reines ASCII aber üblich.",
    values: [
      ['Klasse, Interface, Record, Enum', 'UpperCamelCase: Kundenkonto'],
      ['Methode', 'lowerCamelCase, Verb: einzahlen()'],
      ['Variable, Feld, Parameter', 'lowerCamelCase: kontostand'],
      ['Konstante', 'GROSS_MIT_UNTERSTRICH: MAX_VERSUCHE'],
      ['Paket', 'klein, umgekehrte Domain: de.firma.shop'],
      ['Typparameter', 'Ein Großbuchstabe: T, E, K, V']
    ],
    example: e(`
public class Kundenkonto {                 // Klasse: UpperCamelCase
    static final int MAX_VERSUCHE = 3;      // Konstante: GROSS_MIT_UNTERSTRICH
    private double kontostand;              // Feld: lowerCamelCase

    void einzahlen(double betrag) {         // Methode: Verb
        kontostand += betrag;
    }

    public static void main(String[] args) {
        Kundenkonto konto = new Kundenkonto();
        konto.einzahlen(50);
        System.out.println(konto.kontostand); // 50.0
    }
}
`),
    keywords: ['camelcase', 'konvention', 'benennung', 'namensgebung', 'style', 'naming'],
    related: ['Konstanten (static final)', 'package'],
    mdn: D
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'package',
    desc: "Ordnet eine Klasse einem Paket (Namensraum) zu; steht als erste Anweisung der Datei.",
    details: "Der Paketname spiegelt die Verzeichnisstruktur wider: `package de.beispiel.shop;` gehört in das Verzeichnis `de/beispiel/shop/`. Klassen ohne `package` liegen im namenlosen Paket und sind nur für Kleinstprogramme geeignet. Pakete vermeiden Namenskonflikte und steuern über Paketsichtbarkeit (kein Modifizierer), wer Zugriff hat. Zum Start braucht man den voll qualifizierten Namen: `java de.beispiel.shop.Main`.",
    syntax: "package de.firma.projekt;",
    example: e(`
package de.beispiel.shop;

public class Main {
    public static void main(String[] args) {
        System.out.println(Main.class.getPackageName()); // de.beispiel.shop
        System.out.println(Main.class.getName());        // de.beispiel.shop.Main
    }
}
`),
    tip: "Als Präfix dient die umgekehrte Domain des Projekts, damit Namen weltweit eindeutig bleiben.",
    keywords: ['paket', 'namespace', 'namensraum', 'verzeichnis', 'package-private'],
    related: ['import', 'Namenskonventionen'],
    mdn: L + 'jls-7.html'
  },
  {
    lang: 'java', group: 'Java-Grundlagen', name: 'import',
    desc: "Macht Klassen aus anderen Paketen unter ihrem einfachen Namen verfügbar.",
    details: "`import java.util.List;` erlaubt `List` statt `java.util.List`. Mit `*` importiert man alle Typen eines Pakets, nicht aber Unterpakete. `import static` macht statische Member direkt nutzbar. Das Paket `java.lang` (`String`, `Math`, `System`) ist immer importiert. Bei gleichen Klassennamen in zwei mit `*` importierten Paketen (z. B. `java.util.Date` und `java.sql.Date`) wird der Name mehrdeutig: eine Klasse einzeln importieren, die andere mit vollem Namen schreiben.",
    syntax: "import paket.Klasse;\nimport paket.*;\nimport static paket.Klasse.mitglied;",
    example: e(`
import java.util.ArrayList;
import java.util.List;
import static java.lang.Math.max;

List<String> liste = new ArrayList<>();
liste.add("a");
System.out.println(liste + " " + max(3, 7)); // [a] 7

// Ohne Import mit vollem Namen:
java.time.LocalDate datum = java.time.LocalDate.of(2025, 1, 31);
System.out.println(datum); // 2025-01-31
`),
    tip: "Imports sind reine Schreibhilfen: Sie ändern weder Laufzeit noch Bytecode.",
    keywords: ['importieren', 'static import', 'wildcard', 'qualifizierter name', 'java.lang'],
    related: ['package'],
    mdn: L + 'jls-7.html'
  },

  // ---------------- Primitive Typen & Literale ----------------
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'byte',
    desc: "8-Bit-Ganzzahl mit Vorzeichen, Wertebereich -128 bis 127.",
    details: "`byte` spart vor allem in großen Arrays Speicher und kommt bei Binärdaten und Streams vor. Rechnen mit `byte` ergibt immer `int`, deshalb braucht eine Zuweisung zurück einen Cast. Bei Überschreitung des Bereichs läuft der Wert über, ohne Fehler.",
    values: [
      ['Byte.MIN_VALUE', '-128'],
      ['Byte.MAX_VALUE', '127'],
      ['Byte.SIZE', '8 (Bits)']
    ],
    example: e(`
byte b = 127;
b++;
System.out.println(b);           // -128 (Überlauf)

byte c = (byte) 200;
System.out.println(c);           // -56

byte d = 10;
// byte e = d + 1;               // Fehler: int lässt sich nicht verlustfrei in byte speichern
byte f = (byte) (d + 1);
System.out.println(f);           // 11
System.out.println(c & 0xFF);    // 200 (als vorzeichenlose Zahl lesen)
`),
    tip: "Um ein `byte` als Wert 0 bis 255 zu lesen, maskiert man mit `& 0xFF` oder nutzt `Byte.toUnsignedInt()`.",
    keywords: ['byte', 'ganzzahl', '8 bit', 'integer', 'datentyp', 'vorzeichen'],
    related: ['short', 'int', 'Typumwandlung', 'Integer-Überlauf'],
    mdn: A + 'lang/Byte.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'short',
    desc: "16-Bit-Ganzzahl mit Vorzeichen, Wertebereich -32768 bis 32767.",
    details: "`short` wird selten benutzt, hauptsächlich für Dateiformate und Speicheroptimierung. Wie bei `byte` werden Ausdrücke zu `int` und brauchen für die Zuweisung einen Cast. Für normale Zahlen nimmt man `int`.",
    values: [
      ['Short.MIN_VALUE', '-32768'],
      ['Short.MAX_VALUE', '32767'],
      ['Short.SIZE', '16 (Bits)']
    ],
    example: e(`
short s = 32767;
s++;
System.out.println(s);           // -32768 (Überlauf)

short t = 10;
// short u = t + 1;              // Fehler: int lässt sich nicht verlustfrei in short speichern
short u = (short) (t + 1);
System.out.println(u);           // 11
System.out.println(Short.MAX_VALUE); // 32767
`),
    keywords: ['short', 'ganzzahl', '16 bit', 'datentyp'],
    related: ['byte', 'int', 'Typumwandlung'],
    mdn: A + 'lang/Short.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'int',
    desc: "32-Bit-Ganzzahl mit Vorzeichen, der Standardtyp für ganze Zahlen.",
    details: "Wertebereich: -2^31 bis 2^31-1, also etwa +-2,1 Milliarden. Ganzzahlliterale ohne Suffix sind `int`. Das Ergebnis einer `int`-Rechnung läuft bei Überschreitung still über, ein Fehler tritt nicht auf. Texte wandelt man mit `Integer.parseInt()` in `int` um; bei ungültigem Text wirft die Methode eine `NumberFormatException`.",
    values: [
      ['Integer.MIN_VALUE', '-2147483648'],
      ['Integer.MAX_VALUE', '2147483647'],
      ['Integer.SIZE', '32 (Bits)']
    ],
    example: e(`
int alter = 30;
System.out.println(Integer.MAX_VALUE);          // 2147483647
System.out.println(Integer.MIN_VALUE);          // -2147483648
System.out.println(Integer.parseInt("42") + 1); // 43
System.out.println(Integer.toString(alter));    // 30
System.out.println(Integer.compare(3, 5));      // -1
`),
    keywords: ['int', 'integer', 'ganzzahl', '32 bit', 'datentyp', 'parseint', 'zahl'],
    related: ['long', 'Integer-Überlauf', 'Numerische Literale', 'Ganzzahldivision'],
    mdn: A + 'lang/Integer.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'long',
    desc: "64-Bit-Ganzzahl mit Vorzeichen; Literale brauchen das Suffix L.",
    details: "Wertebereich: -2^63 bis 2^63-1, etwa +-9,2 Trillionen. Ein Literal ohne `L` ist ein `int` und muss in dessen Bereich passen, sonst meldet der Compiler einen Fehler. Für Zeitstempel in Millisekunden, IDs und große Summen ist `long` die übliche Wahl. Man schreibt `L` groß, weil `l` wie eine 1 aussieht.",
    values: [
      ['Long.MIN_VALUE', '-9223372036854775808'],
      ['Long.MAX_VALUE', '9223372036854775807'],
      ['Long.SIZE', '64 (Bits)']
    ],
    example: e(`
long gross = 3_000_000_000L;
System.out.println(gross);            // 3000000000
System.out.println(Long.MAX_VALUE);   // 9223372036854775807
// int zuGross = 3_000_000_000;       // Fehler: Ganzzahl zu groß

long summe = Integer.MAX_VALUE + 1L;  // mit long rechnen
System.out.println(summe);            // 2147483648
`),
    keywords: ['long', 'ganzzahl', '64 bit', 'datentyp', 'suffix l', 'große zahl'],
    related: ['int', 'Numerische Literale', 'Integer-Überlauf'],
    mdn: A + 'lang/Long.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'float',
    desc: "32-Bit-Gleitkommazahl mit ca. 7 gültigen Stellen; Literale mit Suffix f.",
    details: "`float` ist ungenauer als `double` und nur bei großen Datenmengen oder Grafikbibliotheken sinnvoll. Ein Literal wie `3.14` ist ein `double`; für `float` ist das Suffix `f` nötig. Für Geldbeträge sind beide Typen ungeeignet, dafür gibt es `BigDecimal`.",
    values: [
      ['Float.MAX_VALUE', 'ca. 3.4028235E38'],
      ['Float.MIN_VALUE', 'kleinster positiver Wert, ca. 1.4E-45'],
      ['Float.SIZE', '32 (Bits)']
    ],
    example: e(`
float f = 3.14f;
// float g = 3.14;              // Fehler: double lässt sich nicht verlustfrei in float speichern
System.out.println(1.0f / 3);   // 0.33333334
System.out.println(f * 2);      // 6.28
System.out.println(16777216f + 1f); // 1.6777216E7 (Genauigkeit erschöpft)
`),
    keywords: ['float', 'gleitkomma', 'kommazahl', 'dezimal', '32 bit', 'datentyp'],
    related: ['double', 'Numerische Literale', 'Typumwandlung'],
    mdn: A + 'lang/Float.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'double',
    desc: "64-Bit-Gleitkommazahl mit ca. 15 gültigen Stellen; Standardtyp für Kommazahlen.",
    details: "Kommazahlen werden binär gespeichert, daher lassen sich viele Dezimalbrüche wie `0.1` nicht exakt darstellen. Gleichheit mit `==` zu prüfen ist deshalb fehleranfällig; besser vergleicht man mit einer Toleranz. Division durch 0.0 liefert `Infinity` oder `NaN` statt einer Exception, und `NaN` ist ungleich zu sich selbst. Für Geld nimmt man `BigDecimal`.",
    values: [
      ['Double.MAX_VALUE', 'ca. 1.7976931348623157E308'],
      ['Double.NaN', 'Not a Number (z. B. 0.0 / 0.0)'],
      ['Double.POSITIVE_INFINITY', 'Unendlich (z. B. 1.0 / 0)'],
      ['Double.SIZE', '64 (Bits)']
    ],
    example: e(`
double d = 0.1 + 0.2;
System.out.println(d);                   // 0.30000000000000004
System.out.println(d == 0.3);            // false
System.out.println(Math.abs(d - 0.3) < 1e-9); // true

System.out.println(1.0 / 0);             // Infinity
System.out.println(0.0 / 0);             // NaN
System.out.println(Double.isNaN(0.0 / 0)); // true
System.out.println(Double.parseDouble("2.5")); // 2.5
`),
    keywords: ['double', 'gleitkomma', 'kommazahl', 'dezimal', 'nan', 'infinity', 'rundungsfehler', '64 bit'],
    related: ['float', 'Vergleichsoperatoren', 'Typumwandlung'],
    mdn: A + 'lang/Double.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'char',
    desc: "16-Bit-Zeichentyp (UTF-16-Einheit), Literale in einfachen Anführungszeichen.",
    details: "Ein `char` ist technisch eine vorzeichenlose Zahl von 0 bis 65535 und kann mit Zahlen verrechnet werden. Das Ergebnis solcher Rechnungen ist `int`, für ein Zeichen braucht es einen Cast. Zeichen außerhalb des Basisbereichs (z. B. viele Emojis) belegen zwei `char`-Einheiten. Hilfsmethoden stehen in der Klasse `Character`.",
    values: [
      ["'A'", 'Zeichenliteral'],
      ["'\\n'", 'Escape-Sequenz (Zeilenumbruch); weitere: \\t, \\\\, \\\', \\\"'],
      ["'\\u0041'", 'Unicode-Escape (hier: A)'],
      ['Character.isDigit(c)', 'Prüft, ob c eine Ziffer ist'],
      ['Character.isLetter(c)', 'Prüft, ob c ein Buchstabe ist']
    ],
    example: e(`
char c = 'A';
System.out.println(c + 1);              // 66 (Rechnung ergibt int)
System.out.println((char) (c + 1));     // B
System.out.println('a' < 'b');          // true
System.out.println(Character.isDigit('7')); // true
System.out.println(Character.toUpperCase('x')); // X

char umlaut = '\\u00e4';                 // ä als Unicode-Escape
System.out.println((int) umlaut);       // 228
char z = '5';
System.out.println(z - '0');            // 5 (Ziffer als Zahl)
`),
    tip: "Ziffernzeichen in Zahlen umrechnen: `zeichen - '0'`.",
    keywords: ['char', 'zeichen', 'character', 'unicode', 'buchstabe', 'utf-16', 'escape'],
    related: ['Typumwandlung', 'int'],
    mdn: A + 'lang/Character.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'boolean',
    desc: "Wahrheitswert mit nur zwei Werten: true und false.",
    details: "`boolean` entsteht aus Vergleichen und logischen Operatoren und steuert Bedingungen in `if`, `while` und `?:`. Anders als in C oder JavaScript gibt es keine Umwandlung von Zahlen oder Objekten in `boolean`: `if (1)` oder `if (text)` sind Compilerfehler. Das Ergebnis eines Vergleichs lässt sich direkt zurückgeben statt mit `if` zu verpacken.",
    example: e(`
boolean fertig = false;
boolean gross = 5 > 3;
System.out.println(gross);            // true
System.out.println(fertig || gross);  // true

// if (1) { }                         // Fehler: int lässt sich nicht in boolean umwandeln
boolean parsed = Boolean.parseBoolean("TRUE");
System.out.println(parsed);           // true (Groß-/Kleinschreibung egal)
System.out.println(Boolean.parseBoolean("ja")); // false (alles außer "true")
`),
    keywords: ['boolean', 'wahrheitswert', 'true', 'false', 'bool', 'logik'],
    related: ['&& und ||', '!', 'Vergleichsoperatoren', 'if / else'],
    mdn: A + 'lang/Boolean.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'Numerische Literale',
    desc: "Schreibweisen für Zahlen: Unterstriche, Hex, Binär, Oktal und Suffixe L und f.",
    details: "Dezimalliterale ohne Suffix sind `int`, mit `L` sind sie `long`; Kommazahlen sind `double`, mit `f` `float`. Unterstriche erhöhen die Lesbarkeit und werden ignoriert, dürfen aber nicht am Anfang oder Ende stehen. Eine führende `0` macht das Literal oktal: `017` ist 15, nicht 17. Hexadezimal beginnt mit `0x`, binär mit `0b`.",
    values: [
      ['1_000_000', 'Unterstriche als Gruppierung'],
      ['0xFF', 'Hexadezimal (255)'],
      ['0b1010', 'Binär (10)'],
      ['017', 'Oktal (15)'],
      ['123L', 'long'],
      ['1.5f', 'float'],
      ['1.5d oder 1.5', 'double'],
      ['1e3', 'double in Exponentialschreibweise (1000.0)']
    ],
    example: e(`
int million = 1_000_000;
int hex = 0xFF;
int bin = 0b1010;
int okt = 017;
long big = 123_456_789_012L;
float f = 1.5f;
double d = 1e3;
System.out.println(million); // 1000000
System.out.println(hex);     // 255
System.out.println(bin);     // 10
System.out.println(okt);     // 15 (Falle: führende 0)
System.out.println(big);     // 123456789012
System.out.println(f + " " + d); // 1.5 1000.0
`),
    tip: "Keine Zahlen mit führenden Nullen schreiben (`007`), wenn sie dezimal gemeint sind.",
    keywords: ['literal', 'hex', 'binär', 'oktal', 'unterstrich', 'suffix', 'exponent', 'zahlenschreibweise'],
    related: ['int', 'long', 'float', 'double'],
    mdn: L + 'jls-3.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'Typumwandlung',
    desc: "Automatische Erweiterung kleiner Typen und explizites Casting großer Typen.",
    details: "Widening (z. B. `int` zu `long` oder `double`) geschieht automatisch; `int` zu `float` und `long` zu `float` oder `double` können dabei Genauigkeit verlieren. Narrowing (z. B. `double` zu `int`) braucht einen Cast `(int)`. Von Gleitkomma zu Ganzzahl fällt der Nachkommaanteil weg und zu große Werte werden auf den Zielbereich begrenzt; zwischen Ganzzahltypen werden höherwertige Bits verworfen. In Ausdrücken werden `byte`, `short` und `char` vor dem Rechnen zu `int`. Der Cast bindet stärker als die Rechenoperatoren: `(int) a / b` wandelt nur `a` um.",
    syntax: "zieltyp variable = (zieltyp) wert;",
    example: e(`
int i = 42;
long l = i;               // Widening, automatisch
double d = i;             // 42.0
double pi = 3.99;
int abgeschnitten = (int) pi;
System.out.println(abgeschnitten);        // 3 (abgeschnitten, nicht gerundet)
System.out.println(Math.round(pi));       // 4
System.out.println((byte) 300);           // 44 (Bits verworfen)
System.out.println((int) 3_000_000_000L); // -1294967296

System.out.println((double) 7 / 2);      // 3.5
System.out.println((double) (7 / 2));    // 3.0
`),
    tip: "Bei Zahlen zu groß für das Ziel gibt es keinen Fehler. Exakte Konvertierung bietet `Math.toIntExact(long)`, das bei Überschreitung eine `ArithmeticException` wirft.",
    keywords: ['cast', 'casting', 'widening', 'narrowing', 'umwandlung', 'konvertierung', 'typecast', 'abschneiden'],
    related: ['Ganzzahldivision', 'Integer-Überlauf', 'double', 'int'],
    mdn: L + 'jls-5.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'Integer-Überlauf',
    desc: "Ganzzahlen laufen bei Überschreitung des Wertebereichs still über.",
    details: "Ein `int` springt nach `Integer.MAX_VALUE` auf `Integer.MIN_VALUE`, ohne Fehler oder Warnung. Besonders tückisch: In `long x = a * b` mit zwei `int` wird zuerst als `int` gerechnet und erst das (falsche) Ergebnis erweitert. Für geprüftes Rechnen gibt es `Math.addExact()`, `multiplyExact()` und weitere, die bei Überlauf eine `ArithmeticException` werfen.",
    values: [
      ['Math.addExact(a, b)', 'Addition, wirft bei Überlauf'],
      ['Math.multiplyExact(a, b)', 'Multiplikation, wirft bei Überlauf'],
      ['Math.toIntExact(long)', 'long zu int, wirft wenn zu groß'],
      ['BigInteger', 'Ganzzahlen beliebiger Größe']
    ],
    example: e(`
int max = Integer.MAX_VALUE;
System.out.println(max + 1);   // -2147483648

try {
    Math.addExact(max, 1);
} catch (ArithmeticException ex) {
    System.out.println(ex.getMessage()); // integer overflow
}

long falsch = 1_000_000 * 1_000_000;   // Rechnung läuft als int
System.out.println(falsch);            // -727379968
long richtig = 1_000_000L * 1_000_000; // eine Seite als long
System.out.println(richtig);           // 1000000000000
`),
    keywords: ['overflow', 'überlauf', 'wertebereich', 'addexact', 'bigint', 'umlauf', 'wrap around'],
    related: ['int', 'long', 'Typumwandlung'],
    mdn: A + 'lang/Math.html'
  },
  {
    lang: 'java', group: 'Primitive Typen & Literale', name: 'Standardwerte',
    desc: "Felder und Array-Elemente starten mit 0, false oder null; lokale Variablen nicht.",
    details: "Felder (Instanz- und statische Variablen) und neu angelegte Arrays werden automatisch auf einen Standardwert gesetzt. Lokale Variablen haben keinen: Lesen vor dem Zuweisen ist ein Compilerfehler. Referenztypen starten mit `null`, auch `String` und Arrays.",
    values: [
      ['byte, short, int, long', '0 (long: 0L)'],
      ['float, double', '0.0'],
      ['char', "'\\u0000' (Zeichen mit Code 0)"],
      ['boolean', 'false'],
      ['Referenztypen', 'null']
    ],
    example: e(`
static int zahl;
static double kommazahl;
static boolean flag;
static char zeichen;
static String text;
static int[] feld;

public static void main(String[] args) {
    System.out.println(zahl);        // 0
    System.out.println(kommazahl);   // 0.0
    System.out.println(flag);        // false
    System.out.println((int) zeichen); // 0
    System.out.println(text);        // null
    System.out.println(feld);        // null

    int lokal;
    // System.out.println(lokal);    // Fehler: Variable wurde nicht initialisiert
}
`),
    keywords: ['default', 'initialwert', 'initialisierung', 'null', '0', 'false', 'felder'],
    related: ['Variablen deklarieren', 'Referenztypen und null', 'Arrays anlegen'],
    mdn: L + 'jls-4.html'
  },

  // ---------------- Variablen ----------------
  {
    lang: 'java', group: 'Variablen', name: 'Variablen deklarieren',
    desc: "Legt eine Variable mit festem Typ an und weist optional einen Startwert zu.",
    details: "Zuerst steht der Typ, dann der Name; mit `=` wird initialisiert. Mehrere Variablen gleichen Typs lassen sich in einer Zeile deklarieren. Ein Typ ändert sich nie: eine `int`-Variable bleibt `int`. Lokale Variablen müssen vor dem Lesen sicher einen Wert haben.",
    syntax: "typ name;\ntyp name = wert;\ntyp a = 1, b = 2;",
    example: e(`
int alter;               // deklariert, noch ohne Wert
alter = 30;              // zugewiesen
double preis = 9.99;     // deklariert und initialisiert
int a = 1, b = 2;        // mehrere in einer Zeile
String name = "Ada";

int ohneWert;
// System.out.println(ohneWert); // Fehler: Variable wurde nicht initialisiert
System.out.println(alter + a + b + " " + name + " " + preis); // 33 Ada 9.99
`),
    keywords: ['variable', 'deklaration', 'initialisieren', 'zuweisen', 'typ', 'let'],
    related: ['var', 'final', 'Gültigkeitsbereich', 'Standardwerte'],
    mdn: L + 'jls-4.html'
  },
  {
    lang: 'java', group: 'Variablen', name: 'var',
    desc: "Lokale Typinferenz: der Compiler leitet den Typ aus dem Initialisierer ab (seit Java 10).",
    details: "`var` ist kein Schlüsselwort mit dynamischer Typisierung: Der Typ steht beim Kompilieren fest. Es geht nur bei lokalen Variablen mit Initialisierer, nicht für Felder, Methodenparameter oder Rückgabetypen. Erlaubt ist es auch im `for`-Kopf und seit Java 11 bei Lambda-Parametern. `var x;` und `var n = null;` sind Fehler, weil kein Typ ableitbar ist. Bei einer Raute wie `new ArrayList<>()` ergibt sich `ArrayList<Object>`, deshalb besser `new ArrayList<String>()` schreiben.",
    syntax: "var name = ausdruck;",
    example: e(`
var liste = new ArrayList<String>();   // ArrayList<String>
liste.add("Ada");
var zahl = 42;                          // int
var text = "Hallo";                     // String

// var leer;                            // Fehler: kein Initialisierer
// var nichts = null;                   // Fehler: Typ nicht ableitbar

for (var s : liste) {
    System.out.println(s);              // Ada
}
System.out.println(((Object) zahl).getClass().getSimpleName()); // Integer
`),
    tip: "`var` lohnt sich bei langen Typnamen. Wo der Typ aus dem Code nicht klar wird, besser ausschreiben.",
    keywords: ['typinferenz', 'type inference', 'var', 'java 10', 'lokale variable', 'automatisch'],
    related: ['Variablen deklarieren', 'final'],
    mdn: D
  },
  {
    lang: 'java', group: 'Variablen', name: 'final',
    desc: "Verhindert erneutes Zuweisen: Variable, Parameter oder Feld lässt sich nur einmal setzen.",
    details: "Bei `final` darf der Wert einmal gesetzt werden, auch später, solange vor dem Lesen. Bei Referenztypen ist nur die Referenz fest: Das Objekt dahinter, etwa eine Liste, bleibt veränderbar. Für Methoden verbietet `final` das Überschreiben, für Klassen das Ableiten. Lambda-Ausdrücke dürfen nur lokale Variablen nutzen, die final oder effektiv final (nie neu zugewiesen) sind.",
    syntax: "final typ name = wert;",
    example: e(`
final int max = 10;
// max = 20;                           // Fehler: final-Variable nicht neu zuweisbar

final List<String> namen = new ArrayList<>();
namen.add("Ada");                       // erlaubt: Inhalt ändert sich, Referenz nicht
// namen = new ArrayList<>();           // Fehler: Referenz ist final
System.out.println(namen + " " + max);  // [Ada] 10

final int spaeter;                      // blank final: einmal später zuweisen
spaeter = 5;
System.out.println(spaeter);            // 5
`),
    tip: "`final` auf Parametern und lokalen Variablen macht Absicht sichtbar, ist aber optional.",
    keywords: ['konstante', 'unveränderlich', 'immutable', 'effectively final', 'schreibschutz'],
    related: ['Konstanten (static final)', 'Variablen deklarieren', 'Referenztypen und null'],
    mdn: L + 'jls-4.html'
  },
  {
    lang: 'java', group: 'Variablen', name: 'Konstanten (static final)',
    desc: "Echte Konstanten sind static final Felder, per Konvention in GROSSBUCHSTABEN.",
    details: "`static` macht das Feld klassenweit, `final` unveränderlich. Primitive Werte und Strings werden vom Compiler direkt an den Verwendungsstellen eingesetzt (Compile-Zeit-Konstanten), was beim Ändern einer Konstante ein Neukompilieren der nutzenden Klassen nötig macht. Für Aufzählungen von Werten ist `enum` meist besser als mehrere `int`-Konstanten.",
    syntax: "[public] static final typ NAME = wert;",
    example: e(`
static final double MWST = 0.19;
static final int MAX_VERSUCHE = 3;
static final String PREFIX = "ID-";

public static void main(String[] args) {
    System.out.println(PREFIX + MAX_VERSUCHE); // ID-3
    System.out.println(100 * (1 + MWST));      // 119.0
    System.out.println(Math.PI);               // 3.141592653589793 (Konstante der JDK)
}
`),
    keywords: ['constant', 'konstante', 'static final', 'uppercase', 'magic number'],
    related: ['final', 'Namenskonventionen'],
    mdn: L + 'jls-4.html'
  },
  {
    lang: 'java', group: 'Variablen', name: 'Gültigkeitsbereich',
    desc: "Eine lokale Variable gilt nur im Block {...}, in dem sie deklariert wurde.",
    details: "Der Bereich reicht von der Deklaration bis zur schließenden Klammer des umgebenden Blocks. Schleifenvariablen im Kopf von `for` gelten nur in der Schleife. Anders als in manchen Sprachen darf eine lokale Variable keine andere lokale Variable im umgebenden Bereich überdecken; ein Feld dagegen schon (`this.name` greift dann aufs Feld zu).",
    example: e(`
int x = 1;
{
    int y = 2;
    System.out.println(x + y);   // 3
}
// System.out.println(y);        // Fehler: y ist hier unbekannt

for (int i = 0; i < 2; i++) {
    System.out.println(i);       // 0, dann 1
}
// System.out.println(i);        // Fehler: i gilt nur in der Schleife

// int x = 5;                    // Fehler: x ist schon deklariert
`),
    keywords: ['scope', 'sichtbarkeit', 'block', 'lokale variable', 'shadowing', 'lebensdauer'],
    related: ['Variablen deklarieren', 'for'],
    mdn: L + 'jls-6.html'
  },
  {
    lang: 'java', group: 'Variablen', name: 'Referenztypen und null',
    desc: "Variablen von Objekttypen speichern eine Referenz; null bedeutet: kein Objekt.",
    details: "Bei Klassen, Arrays und Interfaces enthält die Variable nur einen Verweis auf das Objekt. Zuweisung kopiert die Referenz, nicht das Objekt: Zwei Variablen zeigen dann auf dasselbe Objekt. Ein Zugriff über `null` löst eine `NullPointerException` aus; die Meldung nennt seit Java 15 standardmäßig genau, was `null` war. `null` ist für primitive Typen nicht erlaubt.",
    example: e(`
String s = null;
System.out.println(s == null);   // true
// s.length();                   // NullPointerException

int[] a = {1, 2};
int[] b = a;                     // gleiche Referenz, keine Kopie
b[0] = 9;
System.out.println(a[0]);        // 9

System.out.println(Objects.requireNonNullElse(s, "leer")); // leer
System.out.println(Objects.isNull(s));                     // true
`),
    tip: "Mit `Objects.requireNonNull(x, \"Meldung\")` bricht man früh und mit klarer Fehlermeldung ab.",
    keywords: ['null', 'nullpointerexception', 'npe', 'referenz', 'objekt', 'pointer', 'zeiger'],
    related: ['== vs. equals', 'Standardwerte', 'Array-Fallstricke'],
    mdn: A + 'util/Objects.html'
  },

  // ---------------- Operatoren ----------------
  {
    lang: 'java', group: 'Operatoren', name: 'Arithmetik (+ - * / %)',
    desc: "Grundrechenarten und Rest (Modulo) für Zahlen; + verkettet auch Strings.",
    details: "`%` liefert den Rest und behält das Vorzeichen des linken Operanden: `-7 % 3` ist -1. Das Ergebnis hat den größeren der beiden Operandentypen, mindestens `int`. Bei `+` mit einem String wird alles zum Text verkettet, von links nach rechts ausgewertet.",
    values: [
      ['a + b', 'Addition (bzw. String-Verkettung)'],
      ['a - b', 'Subtraktion'],
      ['a * b', 'Multiplikation'],
      ['a / b', 'Division (bei Ganzzahlen ohne Rest)'],
      ['a % b', 'Rest der Division']
    ],
    example: e(`
int a = 17, b = 5;
System.out.println(a + b);   // 22
System.out.println(a - b);   // 12
System.out.println(a * b);   // 85
System.out.println(a / b);   // 3
System.out.println(a % b);   // 2
System.out.println(-7 % 3);  // -1
System.out.println(5.5 % 2); // 1.5

System.out.println("Text" + 1 + 2);   // Text12
System.out.println(1 + 2 + "Text");   // 3Text
`),
    keywords: ['rechnen', 'plus', 'minus', 'mal', 'geteilt', 'modulo', 'rest', 'addition', 'string verketten'],
    related: ['Ganzzahldivision', '++ und --', 'Operatorrangfolge'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: 'Ganzzahldivision',
    desc: "Teilen zweier Ganzzahlen schneidet den Rest ab und ergibt wieder eine Ganzzahl.",
    details: "Bei `7 / 2` ist das Ergebnis `3`, nicht `3.5`. Soll ein Bruch entstehen, muss mindestens ein Operand `double` sein, und zwar vor der Division: `(double) (a / b)` ist zu spät. Das Abschneiden geht Richtung 0, daher ist `-7 / 2` gleich -3. Für Rundung nach unten dienen `Math.floorDiv()` und `Math.floorMod()`. Ganzzahl durch 0 wirft eine `ArithmeticException`, Gleitkomma durch 0 nicht.",
    example: e(`
System.out.println(7 / 2);                // 3
System.out.println(7 / 2.0);              // 3.5
System.out.println((double) 7 / 2);       // 3.5
System.out.println((double) (7 / 2));     // 3.0 (zu spät umgewandelt)
System.out.println(-7 / 2);               // -3
System.out.println(Math.floorDiv(-7, 2)); // -4
System.out.println(Math.floorMod(-7, 3)); // 2

// System.out.println(1 / 0);             // ArithmeticException: / by zero
System.out.println(1.0 / 0);              // Infinity
`),
    tip: "Prozentwerte: `anteil * 100 / gesamt` rechnen, nicht `anteil / gesamt * 100`.",
    keywords: ['division', 'ganzzahl', 'integer division', 'abschneiden', 'by zero', 'arithmeticexception', 'floordiv'],
    related: ['Arithmetik (+ - * / %)', 'Typumwandlung', 'double'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: '++ und --',
    desc: "Erhöht oder verringert eine Variable um 1, als Präfix oder Postfix.",
    details: "Beim Postfix (`i++`) liefert der Ausdruck den alten Wert und erhöht danach, beim Präfix (`++i`) wird zuerst erhöht. Als eigene Anweisung ist beides gleichwertig. In Ausdrücken führt die Kombination schnell zu schwer lesbarem Code. Die Zuweisung `i = i++` lässt `i` unverändert, weil der alte Wert zurückgeschrieben wird.",
    example: e(`
int i = 5;
int a = i++;   // a = 5, danach i = 6
int b = ++i;   // i = 7, dann b = 7
System.out.println(a + " " + i + " " + b); // 5 7 7

i = i++;       // alter Wert wird zurückgeschrieben
System.out.println(i);                     // 7

i--;
System.out.println(i);                     // 6
`),
    tip: "Besser als eigene Anweisung nutzen und nicht innerhalb komplexer Ausdrücke verstecken.",
    keywords: ['inkrement', 'dekrement', 'increment', 'decrement', 'plusplus', 'hochzählen', 'postfix', 'präfix'],
    related: ['Zuweisungsoperatoren', 'for'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: 'Zuweisungsoperatoren',
    desc: "= weist zu; += -= *= /= %= und weitere kombinieren Rechnen und Zuweisen.",
    details: "`a += b` entspricht `a = (T) (a + b)`, wobei `T` der Typ von `a` ist: Der Cast ist eingebaut. Deshalb kompiliert `byte b = 10; b += 5;`, `b = b + 5;` aber nicht. Eine Zuweisung ist selbst ein Ausdruck und liefert den zugewiesenen Wert, was verkettete Zuweisungen wie `a = b = 0` erlaubt.",
    values: [
      ['+= -= *= /= %=', 'Rechenoperation und Zuweisung'],
      ['&= |= ^=', 'Bitweise Verknüpfung und Zuweisung'],
      ['<<= >>= >>>=', 'Verschiebung und Zuweisung']
    ],
    example: e(`
int x = 10;
x += 5;   System.out.println(x); // 15
x *= 2;   System.out.println(x); // 30
x -= 4;   System.out.println(x); // 26
x /= 5;   System.out.println(x); // 5
x %= 3;   System.out.println(x); // 2

byte b = 10;
b += 5;                          // ok: impliziter Cast
// b = b + 5;                    // Fehler: int lässt sich nicht verlustfrei in byte speichern

int p, q;
p = q = 3;                       // verkettet: q zuerst
System.out.println(p + q);       // 6
`),
    keywords: ['zuweisung', 'compound', 'plus gleich', 'assign', 'verkürzte schreibweise'],
    related: ['++ und --', 'Arithmetik (+ - * / %)', 'Bitoperatoren'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: '== vs. equals',
    desc: "== vergleicht Werte bzw. Referenzen, equals() vergleicht den Inhalt von Objekten.",
    details: "Bei primitiven Typen vergleicht `==` die Werte. Bei Objekten prüft `==`, ob es dasselbe Objekt ist, nicht ob der Inhalt gleich ist. Strings, Wrapper und eigene Klassen vergleicht man deshalb mit `equals()`. Literale Strings teilen sich ein Objekt, daher wirkt `==` dort scheinbar richtig. Auch bei `Integer` täuscht `==`: Werte von -128 bis 127 sind gecacht, größere nicht.",
    syntax: "a == b\na.equals(b)\nObjects.equals(a, b)  // null-sicher",
    example: e(`
String a = "Java";
String b = "Java";
String c = new String("Java");
System.out.println(a == b);        // true (gleiches Literal-Objekt)
System.out.println(a == c);        // false (anderes Objekt)
System.out.println(a.equals(c));   // true

Integer i1 = 127, i2 = 127;
Integer j1 = 1000, j2 = 1000;
System.out.println(i1 == i2);      // true (Cache)
System.out.println(j1 == j2);      // false
System.out.println(j1.equals(j2)); // true

String n = null;
System.out.println(Objects.equals(n, "x")); // false, ohne NullPointerException
`),
    tip: "Konstante zuerst schreiben, wenn die Variable null sein kann: `\"ja\".equals(eingabe)`.",
    keywords: ['gleichheit', 'equals', 'identität', 'string vergleichen', 'referenzvergleich', 'objects.equals', 'integer cache'],
    related: ['Vergleichsoperatoren', 'Referenztypen und null'],
    mdn: A + 'lang/Object.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: 'Vergleichsoperatoren',
    desc: "== != < > <= >= vergleichen Zahlen und liefern einen boolean.",
    details: "Größenvergleiche gehen nur für Zahlen und `char`, nicht für Strings oder Objekte; dafür gibt es `compareTo()` und `Comparator`. Bei Gleitkommazahlen führt `==` wegen Rundungsfehlern oft zu überraschenden Ergebnissen. `NaN` ist mit nichts gleich, auch nicht mit sich selbst; man prüft mit `Double.isNaN()`.",
    values: [
      ['==, !=', 'gleich, ungleich'],
      ['<, >', 'kleiner, größer'],
      ['<=, >=', 'kleiner gleich, größer gleich']
    ],
    example: e(`
System.out.println(3 < 5);                    // true
System.out.println('a' < 'b');                // true
System.out.println(0.1 + 0.2 == 0.3);         // false
System.out.println(Math.abs(0.1 + 0.2 - 0.3) < 1e-9); // true (mit Toleranz)
System.out.println(Double.NaN == Double.NaN); // false
System.out.println("a".compareTo("b"));       // -1 (Strings nicht mit < vergleichen)
`),
    keywords: ['vergleich', 'größer', 'kleiner', 'gleich', 'comparison', 'relational', 'compareto'],
    related: ['== vs. equals', '&& und ||', 'double'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: '&& und ||',
    desc: "Logisches UND und ODER mit Kurzschlussauswertung.",
    details: "Bei `&&` wird der rechte Teil nur ausgewertet, wenn der linke `true` ist; bei `||` nur, wenn der linke `false` ist. Das nutzt man, um Fehler zu vermeiden: `s != null && s.length() > 3`. Die einzelnen Zeichen `&` und `|` werten dagegen immer beide Seiten aus. `&&` bindet stärker als `||`.",
    values: [
      ['a && b', 'true, wenn beide true sind'],
      ['a || b', 'true, wenn mindestens eins true ist'],
      ['a & b, a | b', 'Wie oben, aber ohne Kurzschluss'],
      ['a ^ b', 'Exklusives ODER: true, wenn genau eins true ist']
    ],
    example: e(`
int n = 0;
boolean r1 = (n != 0) && (10 / n > 1);   // rechts wird übersprungen
System.out.println(r1);                  // false

boolean r2 = (n == 0) || (10 / n > 1);   // ebenfalls kein Fehler
System.out.println(r2);                  // true

// boolean r3 = (n != 0) & (10 / n > 1); // ArithmeticException: beide Seiten werden ausgewertet

String s = null;
System.out.println(s != null && s.length() > 3); // false
System.out.println(true ^ true);                 // false
`),
    keywords: ['und', 'oder', 'and', 'or', 'kurzschluss', 'short circuit', 'logisch', 'xor'],
    related: ['!', 'Operatorrangfolge', 'Bitoperatoren'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: '!',
    desc: "Logische Negation: kehrt einen boolean um.",
    details: "`!` gilt nur für `boolean`, nicht für Zahlen oder Objekte (anders als `~` für Bits). Es bindet sehr stark, deshalb braucht man bei zusammengesetzten Bedingungen Klammern: `!(a && b)`. Mit den De-Morganschen Regeln lässt sich `!(a && b)` zu `!a || !b` umformen.",
    example: e(`
boolean fertig = false;
System.out.println(!fertig);          // true
System.out.println(!(5 > 3));         // false
System.out.println(!!fertig);         // false

boolean a = true, b = false;
System.out.println(!(a && b));        // true
System.out.println(!a || !b);         // true (De Morgan)
`),
    keywords: ['nicht', 'not', 'negation', 'umkehren', 'invertieren', 'de morgan'],
    related: ['&& und ||', 'boolean', 'Bitoperatoren'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: 'Bitoperatoren',
    desc: "& | ^ ~ verknüpfen die einzelnen Bits von Ganzzahlen.",
    details: "`&` setzt ein Bit nur, wenn es in beiden Zahlen gesetzt ist, `|` wenn in einer, `^` wenn in genau einer, und `~` kehrt alle Bits um. Typisch sind Flags und Masken: mit `&` testet man ein Bit, mit `|` setzt man es, mit `^` schaltet man es um. Bei `boolean`-Operanden wirken `&`, `|` und `^` als logische Operatoren ohne Kurzschluss.",
    values: [
      ['a & b', 'UND (beide Bits gesetzt)'],
      ['a | b', 'ODER (mindestens ein Bit gesetzt)'],
      ['a ^ b', 'XOR (genau ein Bit gesetzt)'],
      ['~a', 'Alle Bits umkehren']
    ],
    example: e(`
int a = 0b1100;   // 12
int b = 0b1010;   // 10
System.out.println(a & b);   // 8  (1000)
System.out.println(a | b);   // 14 (1110)
System.out.println(a ^ b);   // 6  (0110)
System.out.println(~a);      // -13

System.out.println(Integer.toBinaryString(a & b)); // 1000

final int LESEN = 1, SCHREIBEN = 2;
int rechte = LESEN | SCHREIBEN;
System.out.println((rechte & SCHREIBEN) != 0);     // true
`),
    keywords: ['bit', 'bitweise', 'bitwise', 'maske', 'flags', 'xor', 'and', 'or', 'binär'],
    related: ['Shift-Operatoren', '&& und ||', 'Numerische Literale'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: 'Shift-Operatoren',
    desc: "<< >> >>> verschieben die Bits einer Ganzzahl nach links oder rechts.",
    details: "`a << n` verschiebt um n Stellen nach links, das entspricht der Multiplikation mit 2^n. `>>` verschiebt arithmetisch nach rechts und behält das Vorzeichen, `>>>` füllt links mit Nullen auf. Bei `int` zählt die Schiebedistanz modulo 32, bei `long` modulo 64: `1 << 33` ist daher 2.",
    values: [
      ['a << n', 'Nach links, füllt mit 0 (a mal 2^n)'],
      ['a >> n', 'Nach rechts, Vorzeichen bleibt (a durch 2^n, abgerundet)'],
      ['a >>> n', 'Nach rechts, füllt mit 0']
    ],
    example: e(`
System.out.println(1 << 3);      // 8
System.out.println(16 >> 2);     // 4
System.out.println(-16 >> 2);    // -4 (Vorzeichen bleibt)
System.out.println(-16 >>> 28);  // 15
System.out.println(1 << 33);     // 2 (Distanz 33 % 32 = 1)
System.out.println(1L << 33);    // 8589934592
`),
    keywords: ['shift', 'schieben', 'verschieben', 'bitverschiebung', 'links', 'rechts', 'unsigned shift'],
    related: ['Bitoperatoren', 'Zuweisungsoperatoren'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: '?: (Ternary)',
    desc: "Bedingungsoperator: Ausdruck mit Wert je nach Bedingung.",
    details: "`bedingung ? wertA : wertB` liefert `wertA`, wenn die Bedingung `true` ist, sonst `wertB`. Praktisch für kurze Auswahlen, bei langen oder verschachtelten Ausdrücken ist `if` lesbarer. Die beiden Zweige werden auf einen gemeinsamen Typ gebracht: `true ? 1 : 2.0` ergibt `1.0`. Mit Wrapper-Typen kann beim automatischen Auspacken eine `NullPointerException` auftreten.",
    syntax: "bedingung ? wennWahr : wennFalsch",
    example: e(`
int alter = 20;
String status = alter >= 18 ? "erwachsen" : "minderjaehrig";
System.out.println(status);         // erwachsen

int a = 4, b = 9;
int max = a > b ? a : b;
System.out.println(max);            // 9

System.out.println(true ? 1 : 2.0); // 1.0 (gemeinsamer Typ double)
`),
    keywords: ['ternär', 'ternary', 'bedingungsoperator', 'fragezeichen', 'inline if', 'conditional'],
    related: ['if / else', 'switch-Ausdruck'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: 'instanceof',
    desc: "Prüft den Typ eines Objekts und bindet es per Pattern an eine Variable (seit Java 16).",
    details: "`x instanceof Typ` ist `false` für `null`. Mit Pattern Matching (seit Java 16) deklariert man gleich die Variable und spart den Cast: `if (o instanceof String s)`. Die Variable gilt dort, wo der Compiler sicher ist, dass das Muster passte, auch hinter einem `&&`. Seit Java 21 lassen sich auch Record-Patterns zerlegen: `o instanceof Punkt(int x, int y)`.",
    syntax: "objekt instanceof Typ\nobjekt instanceof Typ variable",
    example: e(`
Object o = "Hallo";
if (o instanceof String s) {
    System.out.println(s.length());     // 5
}
System.out.println(o instanceof Integer); // false
System.out.println(null instanceof String); // false

if (o instanceof String t && t.length() > 3) {
    System.out.println(t.toUpperCase()); // HALLO
}

record Punkt(int x, int y) {}
Object p = new Punkt(3, 4);
if (p instanceof Punkt(int px, int py)) {
    System.out.println(px + py);         // 7
}
`),
    tip: "Häufige `instanceof`-Ketten sind oft ein Zeichen für fehlendes Polymorphie-Design; als Alternative bietet sich `switch` mit Pattern Matching an.",
    keywords: ['typprüfung', 'type check', 'pattern matching', 'cast', 'record pattern', 'java 16', 'typtest'],
    related: ['Pattern Matching in switch', 'Typumwandlung'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Operatoren', name: 'Operatorrangfolge',
    desc: "Regelt, in welcher Reihenfolge Operatoren in einem Ausdruck ausgewertet werden.",
    details: "Punkt vor Strich, `&&` vor `||`, Zuweisungen ganz zuletzt. Gleichrangige Operatoren werden meist von links nach rechts ausgewertet, Zuweisungen und `?:` von rechts nach links. Im Zweifel hilft jede Klammer, Absicht zu zeigen; Klammern kosten nichts.",
    values: [
      ['a++ a-- . [] ()', 'Postfix, Zugriff (stärkste Bindung)'],
      ['++a --a + - ! ~ (Typ)', 'Unär und Cast'],
      ['* / %', 'Multiplikativ'],
      ['+ -', 'Additiv'],
      ['<< >> >>>', 'Shift'],
      ['< > <= >= instanceof', 'Relational'],
      ['== !=', 'Gleichheit'],
      ['&  ^  |', 'Bitweise, in dieser Reihenfolge'],
      ['&&  ||', 'Logisch, in dieser Reihenfolge'],
      ['?:', 'Bedingungsoperator'],
      ['= += -= ...', 'Zuweisung (schwächste Bindung)']
    ],
    example: e(`
System.out.println(2 + 3 * 4);       // 14
System.out.println((2 + 3) * 4);     // 20
System.out.println(8 / 2 * 2);       // 8 (links nach rechts)
System.out.println(true || false && false); // true (&& vor ||)
System.out.println(1 + 2 + "x");     // 3x
System.out.println(1 << 2 + 1);      // 8 (+ vor <<)

int a = 5;
boolean ok = a > 3 && a < 10;
System.out.println(ok);              // true
`),
    keywords: ['priorität', 'precedence', 'reihenfolge', 'klammern', 'assoziativität', 'punkt vor strich'],
    related: ['Arithmetik (+ - * / %)', '&& und ||', '?: (Ternary)'],
    mdn: L + 'jls-15.html'
  },

  // ---------------- Kontrollfluss ----------------
  {
    lang: 'java', group: 'Kontrollfluss', name: 'if / else',
    desc: "Führt Code nur aus, wenn eine boolesche Bedingung zutrifft.",
    details: "Die Bedingung muss ein `boolean` sein; Zahlen oder Objekte genügen nicht. Ohne geschweifte Klammern gehört nur die nächste Anweisung zum `if`, was bei späteren Erweiterungen leicht zu Fehlern führt; Klammern immer setzen. Ein Semikolon direkt hinter der Bedingung (`if (x > 0);`) ist ein typischer Tippfehler und macht den Block unabhängig von der Bedingung. Bei `else` ohne Klammern hängt es am nächsten `if`.",
    syntax: "if (bedingung) {\n    ...\n} else if (andere) {\n    ...\n} else {\n    ...\n}",
    example: e(`
int punkte = 75;
if (punkte >= 90) {
    System.out.println("Sehr gut");
} else if (punkte >= 60) {
    System.out.println("Bestanden");   // Bestanden
} else {
    System.out.println("Nicht bestanden");
}

int x = 3;
// if (x = 5) { }                      // Fehler: int lässt sich nicht in boolean umwandeln
`),
    tip: "Frühe Rückgabe (`if (fehler) return;`) hält den Hauptpfad flach, statt tief zu verschachteln.",
    keywords: ['bedingung', 'verzweigung', 'if else', 'entscheidung', 'condition', 'else if'],
    related: ['switch-Anweisung', '?: (Ternary)', '&& und ||'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'switch-Anweisung',
    desc: "Verzweigt anhand eines Werts; klassisch mit case/break, modern mit Pfeil.",
    details: "Zulässig sind `byte`, `short`, `char`, `int` samt Wrappern, `String`, Enums und seit Java 21 auch Pattern. Beim klassischen `case X:` läuft der Code weiter in den nächsten Fall (Fall-through), wenn `break` fehlt. Die Pfeilform `case X ->` kennt kein Fall-through und erlaubt mehrere Werte durch Komma. Ein `default` fängt alle übrigen Werte ab.",
    syntax: "switch (wert) {\n    case a: ...; break;\n    default: ...;\n}\n\nswitch (wert) {\n    case b, c -> ...;\n    default -> ...;\n}",
    example: e(`
int tag = 3;
switch (tag) {
    case 1:
        System.out.println("Mo");
        break;
    case 3:
        System.out.println("Mi");          // Mi
    case 4:
        System.out.println("Do (Durchfall)"); // Do (Durchfall), kein break davor
        break;
    default:
        System.out.println("anderer Tag");
}

String art = "b";
switch (art) {
    case "a", "b" -> System.out.println("a oder b"); // a oder b
    case "c" -> System.out.println("c");
    default -> System.out.println("sonst");
}
`),
    tip: "Fehlendes `break` ist die häufigste Fehlerquelle; die Pfeilform vermeidet sie.",
    keywords: ['switch', 'case', 'default', 'fall-through', 'verzweigung', 'break', 'mehrfachauswahl'],
    related: ['switch-Ausdruck', 'Pattern Matching in switch', 'break', 'if / else'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'switch-Ausdruck',
    desc: "switch als Ausdruck mit Wert; Pfeilzweige ohne Fall-through (seit Java 14).",
    details: "Jeder Zweig liefert einen Wert, entweder direkt hinter `->` oder in einem Block mit `yield`. Der Ausdruck muss vollständig sein: Bei `int` oder `String` braucht er ein `default`, bei Enums und sealed Typen reicht es, alle Fälle abzudecken. Statt eines Werts darf ein Zweig eine Exception werfen.",
    syntax: "var ergebnis = switch (wert) {\n    case a, b -> x;\n    case c -> { ...; yield y; }\n    default -> z;\n};",
    example: e(`
int monat = 2;
int tage = switch (monat) {
    case 1, 3, 5, 7, 8, 10, 12 -> 31;
    case 4, 6, 9, 11 -> 30;
    case 2 -> 28;
    default -> throw new IllegalArgumentException("Monat: " + monat);
};
System.out.println(tage);      // 28

String art = switch (tage) {
    case 28 -> {
        String t = "kurz";
        yield t;                // Wert aus einem Block liefern
    }
    default -> "normal";
};
System.out.println(art);       // kurz
`),
    keywords: ['switch expression', 'yield', 'pfeil', 'arrow', 'java 14', 'wert zurückgeben'],
    related: ['switch-Anweisung', 'Pattern Matching in switch', '?: (Ternary)'],
    mdn: L + 'jls-15.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'Pattern Matching in switch',
    desc: "switch prüft Typen und Muster, mit Guards (when) und null-Fall (seit Java 21).",
    details: "Statt Werten stehen Typmuster wie `case String s`. Mit `when` fügt man eine Bedingung hinzu (Guard). Reihenfolge zählt: Spezielle Fälle müssen vor allgemeineren stehen, sonst meldet der Compiler einen Fehler. `case null` fängt `null` ab; ohne ihn wirft `switch` bei `null` eine `NullPointerException`. Bei sealed Typen prüft der Compiler Vollständigkeit, ein `default` ist dann unnötig. Record-Patterns zerlegen Records direkt im `case`.",
    syntax: "switch (obj) {\n    case Typ t when bedingung -> ...;\n    case Typ t -> ...;\n    case null -> ...;\n    default -> ...;\n}",
    example: e(`
sealed interface Form permits Kreis, Quadrat {}
record Kreis(double r) implements Form {}
record Quadrat(double a) implements Form {}

static double flaeche(Form f) {
    return switch (f) {                       // ohne default: sealed ist vollständig
        case Kreis k -> Math.PI * k.r() * k.r();
        case Quadrat(double a) -> a * a;      // Record-Pattern
    };
}

static String beschreibe(Object o) {
    return switch (o) {
        case null -> "null";
        case Integer i when i > 10 -> "grosse Zahl " + i;
        case Integer i -> "Zahl " + i;
        case String s -> "Text " + s;
        default -> "anderes";
    };
}

public static void main(String[] args) {
    System.out.println(flaeche(new Quadrat(3)));  // 9.0
    System.out.println(beschreibe(42));           // grosse Zahl 42
    System.out.println(beschreibe(5));            // Zahl 5
    System.out.println(beschreibe("x"));          // Text x
    System.out.println(beschreibe(null));         // null
}
`),
    keywords: ['pattern matching', 'when', 'guard', 'sealed', 'record pattern', 'java 21', 'typmuster', 'case null'],
    related: ['switch-Ausdruck', 'instanceof', 'switch-Anweisung'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'for',
    desc: "Zählschleife mit Initialisierung, Bedingung und Fortschritt im Kopf.",
    details: "Der Kopf hat drei Teile, jeder darf leer sein: `for (;;)` ist eine Endlosschleife. Die Schleifenvariable gilt nur in der Schleife. Zähler, die nach dem Schleifenende noch gebraucht werden, müssen vorher deklariert werden. Typische Fehler sind Off-by-one (`<=` statt `<`) und das Verändern des Zählers im Rumpf.",
    syntax: "for (init; bedingung; fortschritt) {\n    ...\n}",
    example: e(`
for (int i = 0; i < 3; i++) {
    System.out.println(i);          // 0, 1, 2
}

for (int i = 10, j = 0; i > j; i -= 4, j++) {
    System.out.println(i + " " + j); // 10 0, dann 6 1
}

for (int k = 5; k > 0; k -= 2) {
    System.out.println(k);          // 5, 3, 1
}
`),
    keywords: ['schleife', 'loop', 'zählschleife', 'iteration', 'for loop', 'wiederholen'],
    related: ['Erweiterte for-Schleife', 'while', 'break', 'continue'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'Erweiterte for-Schleife',
    desc: "For-each: durchläuft Arrays und Iterables Element für Element.",
    details: "Die Syntax `for (Typ x : sammlung)` funktioniert für Arrays und alles, was `Iterable` ist (Listen, Sets, Map-Sichten). Die Schleifenvariable ist eine Kopie bzw. Referenz: Das Zuweisen an sie ändert das Array nicht. Beim Hinzufügen oder Entfernen in einer Liste während des Durchlaufs kann Java eine `ConcurrentModificationException` werfen, garantiert ist das nicht; dafür dient der Iterator oder `removeIf`.",
    syntax: "for (Typ element : sammlung) {\n    ...\n}",
    example: e(`
int[] zahlen = {1, 2, 3};
int summe = 0;
for (int z : zahlen) {
    summe += z;
}
System.out.println(summe);              // 6

for (int z : zahlen) {
    z = 0;                              // ändert nur die Kopie
}
System.out.println(zahlen[0]);          // 1

List<String> namen = List.of("Ada", "Linus");
for (String n : namen) {
    System.out.println(n);              // Ada, Linus
}

Map<String, Integer> alter = Map.of("Ada", 36);
for (Map.Entry<String, Integer> en : alter.entrySet()) {
    System.out.println(en.getKey() + "=" + en.getValue()); // Ada=36
}
`),
    keywords: ['foreach', 'for each', 'iterieren', 'durchlaufen', 'iterable', 'sammlung', 'liste durchgehen'],
    related: ['for', 'while', 'Arrays anlegen'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'while',
    desc: "Wiederholt einen Block, solange die Bedingung vor jedem Durchlauf zutrifft.",
    details: "Die Bedingung wird vor dem Rumpf geprüft; ist sie von Anfang an `false`, läuft der Rumpf nie. Die Bedingung muss sich im Rumpf irgendwann ändern, sonst entsteht eine Endlosschleife. Geeignet, wenn die Anzahl der Durchläufe nicht vorab feststeht.",
    syntax: "while (bedingung) {\n    ...\n}",
    example: e(`
int n = 10;
while (n > 0) {
    n /= 2;
    System.out.println(n);   // 5, 2, 1, 0
}

int versuche = 0;
while (true) {
    versuche++;
    if (versuche == 3) break;
}
System.out.println(versuche); // 3
`),
    keywords: ['schleife', 'solange', 'loop', 'endlosschleife', 'while loop'],
    related: ['do-while', 'for', 'break'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'do-while',
    desc: "Fußgesteuerte Schleife: Der Rumpf läuft mindestens einmal.",
    details: "Die Bedingung wird erst nach dem Rumpf geprüft, deshalb läuft er mindestens einmal. Typisch für Eingabeschleifen, in denen erst gelesen und dann geprüft wird. Das abschließende Semikolon nach `while (...)` ist Pflicht.",
    syntax: "do {\n    ...\n} while (bedingung);",
    example: e(`
int x = 5;
do {
    System.out.println(x);   // 5 (einmal, obwohl x < 5 false ist)
    x++;
} while (x < 5);

int zaehler = 0;
do {
    zaehler += 2;
} while (zaehler < 7);
System.out.println(zaehler); // 8
`),
    keywords: ['schleife', 'fußgesteuert', 'mindestens einmal', 'loop', 'do while'],
    related: ['while', 'for'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'break',
    desc: "Beendet die innerste Schleife oder switch-Anweisung sofort.",
    details: "Wirkt nur auf die unmittelbar umgebende Schleife bzw. `switch`. Um aus verschachtelten Schleifen auf einmal auszusteigen, nutzt man `break` mit einer Sprungmarke. In einem Switch-Ausdruck gibt es kein `break`, dort liefert man mit `yield` den Wert.",
    syntax: "break;\nbreak marke;",
    example: e(`
int[] zahlen = {3, 8, 15, 4};
int gefunden = -1;
for (int i = 0; i < zahlen.length; i++) {
    if (zahlen[i] > 10) {
        gefunden = i;
        break;                       // Rest wird nicht mehr durchsucht
    }
}
System.out.println(gefunden);        // 2
`),
    keywords: ['abbrechen', 'schleife verlassen', 'exit loop', 'stop'],
    related: ['continue', 'Sprungmarken', 'switch-Anweisung', 'while'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'continue',
    desc: "Überspringt den Rest des aktuellen Schleifendurchlaufs.",
    details: "Springt zur nächsten Iteration: In einer `for`-Schleife wird zuerst der Fortschrittsteil ausgeführt, dann die Bedingung geprüft. In `while` und `do-while` geht es direkt zur Bedingung, daher muss ein Zähler vor `continue` verändert worden sein, sonst droht eine Endlosschleife. Mit Sprungmarke steuert man äußere Schleifen an.",
    syntax: "continue;\ncontinue marke;",
    example: e(`
for (int i = 1; i <= 5; i++) {
    if (i % 2 == 0) {
        continue;                    // gerade Zahlen überspringen
    }
    System.out.println(i);           // 1, 3, 5
}
`),
    keywords: ['überspringen', 'nächster durchlauf', 'skip', 'iteration'],
    related: ['break', 'Sprungmarken', 'for'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'Sprungmarken',
    desc: "Benannte Schleifen, die man mit break marke oder continue marke ansteuert.",
    details: "Eine Marke steht vor der Schleife: `aussen: for (...)`. Mit `break aussen;` verlässt man die benannte Schleife, mit `continue aussen;` springt man zu deren nächstem Durchlauf, auch aus einer inneren Schleife heraus. Es gibt kein `goto`. Marken sind selten nötig; oft ist eine eigene Methode mit `return` klarer.",
    syntax: "marke:\nfor (...) {\n    for (...) {\n        break marke;\n    }\n}",
    example: e(`
aussen:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 2) continue aussen;   // nächster Durchlauf der äußeren Schleife
        if (i == 2) break aussen;      // beide Schleifen verlassen
        System.out.println(i + "," + j);
    }
}
// Ausgabe: 0,0  0,1  1,0  1,1
`),
    keywords: ['label', 'goto', 'break label', 'continue label', 'verschachtelte schleifen', 'sprungmarke'],
    related: ['break', 'continue', 'for'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'return',
    desc: "Beendet die Methode und gibt optional einen Wert an den Aufrufer zurück.",
    details: "Bei einer Methode mit Rückgabetyp muss auf jedem Pfad ein Wert zurückgegeben werden, sonst meldet der Compiler einen Fehler. In `void`-Methoden steht `return;` ohne Wert und beendet die Methode vorzeitig. Code direkt nach einem `return` ist nicht erreichbar und ein Compilerfehler.",
    syntax: "return wert;\nreturn;",
    example: e(`
static int groesser(int a, int b) {
    if (a > b) return a;
    return b;
}

static void gruss(String name) {
    if (name == null) return;          // vorzeitig beenden
    System.out.println("Hallo " + name);
}

public static void main(String[] args) {
    System.out.println(groesser(3, 8)); // 8
    gruss(null);                        // keine Ausgabe
    gruss("Ada");                       // Hallo Ada
}
`),
    keywords: ['rückgabe', 'zurückgeben', 'ergebnis', 'methode beenden', 'early return'],
    related: ['if / else', 'break'],
    mdn: L + 'jls-14.html'
  },
  {
    lang: 'java', group: 'Kontrollfluss', name: 'assert',
    desc: "Prüft eine Annahme zur Laufzeit; nur aktiv, wenn die JVM mit -ea startet.",
    details: "`assert bedingung : meldung;` wirft einen `AssertionError`, wenn die Bedingung `false` ist. Standardmäßig sind Assertions ausgeschaltet; man aktiviert sie mit `java -ea`. Sie prüfen interne Annahmen beim Entwickeln und Testen, nicht Eingaben von außen. Die Bedingung darf keine Nebenwirkungen haben, da sie bei ausgeschalteten Assertions gar nicht ausgeführt wird.",
    syntax: "assert bedingung;\nassert bedingung : meldung;",
    example: e(`
int alter = 5;
assert alter >= 0 : "Alter darf nicht negativ sein";
System.out.println("weiter");   // weiter (Prüfung ist ohne -ea abgeschaltet)

// Aufruf mit Prüfung:  java -ea Programm
// assert alter > 10;           // würde mit -ea einen AssertionError werfen
`),
    tip: "Für Prüfung von Parametern öffentlicher Methoden besser `IllegalArgumentException` oder `Objects.requireNonNull` verwenden.",
    keywords: ['assertion', 'annahme', '-ea', 'enableassertions', 'invariante', 'debugging', 'assertionerror'],
    related: ['java', 'if / else'],
    mdn: L + 'jls-14.html'
  },

  // ---------------- Arrays ----------------
  {
    lang: 'java', group: 'Arrays', name: 'Arrays anlegen',
    desc: "Legt ein Array fester Größe an, leer mit new oder direkt mit Werten.",
    details: "Ein Array ist ein Objekt mit fester Länge, dessen Elemente alle denselben Typ haben. Mit `new typ[n]` werden die Elemente auf ihren Standardwert gesetzt (`0`, `false`, `null`). Die Kurzform `{...}` ist nur bei der Deklaration erlaubt, sonst schreibt man `new int[]{...}`. Die Klammern dürfen auch hinter dem Namen stehen (`int a[]`), der Stil `int[] a` ist üblich.",
    syntax: "typ[] name = new typ[laenge];\ntyp[] name = {w1, w2, w3};\ntyp[] name = new typ[]{w1, w2};",
    example: e(`
int[] a = new int[3];
int[] b = {1, 2, 3};
int[] c = new int[]{4, 5};
String[] s = new String[2];

System.out.println(Arrays.toString(a)); // [0, 0, 0]
System.out.println(Arrays.toString(b)); // [1, 2, 3]
System.out.println(Arrays.toString(c)); // [4, 5]
System.out.println(Arrays.toString(s)); // [null, null]

int[] spaeter;
spaeter = new int[]{7, 8};              // Kurzform {..} geht hier nicht
System.out.println(spaeter.length);     // 2
`),
    keywords: ['array', 'feld', 'liste', 'new int[]', 'initialisieren', 'deklarieren'],
    related: ['Array-Zugriff und length', 'Mehrdimensionale Arrays', 'Standardwerte', 'Array-Fallstricke'],
    mdn: L + 'jls-10.html'
  },
  {
    lang: 'java', group: 'Arrays', name: 'Array-Zugriff und length',
    desc: "Elemente per Index ab 0 lesen und schreiben; length liefert die Größe.",
    details: "Der erste Index ist 0, der letzte `length - 1`. Ein Zugriff außerhalb wirft eine `ArrayIndexOutOfBoundsException`. `length` ist bei Arrays ein Feld ohne Klammern, bei `String` dagegen die Methode `length()`, bei Listen `size()`. Das Feld ist final, die Größe lässt sich nicht ändern.",
    syntax: "array[index]\narray.length",
    example: e(`
int[] z = {10, 20, 30};
System.out.println(z[0]);             // 10
System.out.println(z.length);         // 3

z[2] = 99;
System.out.println(z[z.length - 1]);  // 99 (letztes Element)

int summe = 0;
for (int i = 0; i < z.length; i++) {
    summe += z[i];
}
System.out.println(summe);            // 129
`),
    tip: "Merkhilfe: Arrays `length`, Strings `length()`, Collections `size()`.",
    keywords: ['index', 'zugriff', 'länge', 'length', 'element', 'letztes element', 'größe'],
    related: ['Arrays anlegen', 'Erweiterte for-Schleife', 'Array-Fallstricke'],
    mdn: L + 'jls-10.html'
  },
  {
    lang: 'java', group: 'Arrays', name: 'Mehrdimensionale Arrays',
    desc: "Arrays von Arrays: Matrizen und Tabellen, auch mit unterschiedlich langen Zeilen.",
    details: "Ein `int[][]` ist ein Array, dessen Elemente selbst `int[]` sind. Deshalb dürfen die Zeilen verschieden lang sein (gezackte Arrays). Beim Anlegen kann man die inneren Größen weglassen und später setzen: `new int[3][]`. Die Ausgabe mit `Arrays.toString` zeigt nur Referenzen, für verschachtelte Arrays dient `Arrays.deepToString`.",
    syntax: "typ[][] name = new typ[zeilen][spalten];\ntyp[][] name = {{...}, {...}};",
    example: e(`
int[][] m = {{1, 2, 3}, {4, 5, 6}};
System.out.println(m[1][2]);        // 6
System.out.println(m.length);       // 2 (Zeilen)
System.out.println(m[0].length);    // 3 (Spalten)
System.out.println(Arrays.deepToString(m)); // [[1, 2, 3], [4, 5, 6]]

int[][] zackig = new int[3][];
zackig[0] = new int[]{1};
zackig[1] = new int[]{1, 2};
zackig[2] = new int[]{1, 2, 3};
System.out.println(zackig[2].length); // 3

int[][] leer = new int[2][3];
System.out.println(Arrays.deepToString(leer)); // [[0, 0, 0], [0, 0, 0]]
`),
    keywords: ['matrix', '2d array', 'zweidimensional', 'tabelle', 'gezacktes array', 'jagged', 'deeptostring'],
    related: ['Arrays anlegen', 'Array-Zugriff und length', 'Arrays kopieren'],
    mdn: L + 'jls-10.html'
  },
  {
    lang: 'java', group: 'Arrays', name: 'Varargs',
    desc: "Methode mit beliebig vielen Argumenten gleichen Typs: typ... name.",
    details: "Ein Varargs-Parameter steht als letzter Parameter und ist in der Methode ein normales Array. Der Aufrufer darf null, ein, mehrere Argumente oder direkt ein Array übergeben. Pro Methode ist nur ein Varargs-Parameter erlaubt. Bei überladenen Methoden werden Varargs zuletzt in Betracht gezogen. Bei generischen Typen warnt der Compiler vor Heap-Pollution.",
    syntax: "static void methode(typ... name) { ... }",
    example: e(`
static int summe(int... zahlen) {
    int s = 0;
    for (int z : zahlen) {
        s += z;
    }
    return s;
}

static String formatiere(String vorlage, Object... args) {
    return String.format(vorlage, args);
}

public static void main(String[] args) {
    System.out.println(summe());                       // 0
    System.out.println(summe(1, 2, 3));                // 6
    System.out.println(summe(new int[]{4, 5}));        // 9
    System.out.println(formatiere("%s ist %d", "Ada", 36)); // Ada ist 36
}
`),
    keywords: ['variable argumente', 'varargs', '...', 'beliebig viele parameter', 'variable arity'],
    related: ['Arrays anlegen', 'return'],
    mdn: L + 'jls-8.html'
  },
  {
    lang: 'java', group: 'Arrays', name: 'Arrays kopieren',
    desc: "Zuweisen kopiert nur die Referenz; echte Kopien erzeugen clone, copyOf und arraycopy.",
    details: "`int[] b = a;` lässt beide Variablen auf dasselbe Array zeigen. Eine unabhängige Kopie liefern `clone()`, `Arrays.copyOf()` (auch zum Vergrößern oder Verkleinern), `Arrays.copyOfRange()` und `System.arraycopy()`. Alle erzeugen eine flache Kopie: Bei Arrays von Objekten oder mehrdimensionalen Arrays werden nur die Referenzen kopiert, innere Arrays bleiben gemeinsam genutzt.",
    syntax: "int[] kopie = original.clone();\nint[] kopie = Arrays.copyOf(original, neueLaenge);\nSystem.arraycopy(quelle, qPos, ziel, zPos, anzahl);",
    example: e(`
int[] a = {1, 2, 3};
int[] ref = a;                              // gleiche Referenz
int[] k1 = a.clone();
int[] k2 = Arrays.copyOf(a, 5);
int[] k3 = Arrays.copyOfRange(a, 1, 3);
int[] k4 = new int[3];
System.arraycopy(a, 0, k4, 0, 3);

ref[0] = 99;
System.out.println(a[0]);                   // 99 (a und ref teilen sich das Array)
System.out.println(k1[0]);                  // 1 (unabhängig)
System.out.println(Arrays.toString(k2));    // [1, 2, 3, 0, 0]
System.out.println(Arrays.toString(k3));    // [2, 3]
System.out.println(Arrays.toString(k4));    // [1, 2, 3]
`),
    tip: "Weitere Hilfsmethoden wie Sortieren, Suchen und Vergleichen stehen in der Klasse `Arrays`.",
    keywords: ['kopie', 'clone', 'copyof', 'arraycopy', 'flache kopie', 'shallow copy', 'duplizieren', 'vergrößern'],
    related: ['Arrays anlegen', 'Mehrdimensionale Arrays', 'Referenztypen und null'],
    mdn: A + 'util/Arrays.html'
  },
  {
    lang: 'java', group: 'Arrays', name: 'Array-Fallstricke',
    desc: "Feste Größe, Indexfehler, Kovarianz und Gleichheit: typische Stolpersteine bei Arrays.",
    details: "Die Länge eines Arrays steht nach dem Anlegen fest; für wachsende Daten nimmt man `ArrayList`. Ein ungültiger Index wirft eine `ArrayIndexOutOfBoundsException`, eine negative Größe beim Anlegen eine `NegativeArraySizeException`. Arrays sind kovariant: Ein `String[]` lässt sich einem `Object[]` zuweisen, doch das Speichern eines falschen Typs scheitert erst zur Laufzeit mit einer `ArrayStoreException`. Außerdem vergleicht `equals()` bei Arrays nur die Referenz.",
    example: e(`
int[] a = new int[3];
try {
    a[3] = 1;                                   // gültig sind 0 bis 2
} catch (ArrayIndexOutOfBoundsException ex) {
    System.out.println(ex.getMessage());        // Index 3 out of bounds for length 3
}

Object[] o = new String[1];                     // Kovarianz: kompiliert
try {
    o[0] = 1;                                   // Laufzeitfehler
} catch (ArrayStoreException ex) {
    System.out.println(ex.getMessage());        // java.lang.Integer
}

int[] x = {1}, y = {1};
System.out.println(x.equals(y));                // false (Referenzvergleich)
System.out.println(Arrays.equals(x, y));        // true (Inhaltsvergleich)
System.out.println(x);                          // gibt nur eine Kennung wie [I@... aus
`),
    tip: "Arrays ausgeben mit `Arrays.toString(a)`, vergleichen mit `Arrays.equals(a, b)`. Variable Größe: `List<Integer>`.",
    keywords: ['indexoutofbounds', 'arrayindexoutofboundsexception', 'arraystoreexception', 'kovarianz', 'feste größe', 'array equals', 'fehler', 'off-by-one'],
    related: ['Array-Zugriff und length', 'Arrays anlegen', 'Arrays kopieren'],
    mdn: L + 'jls-10.html'
  }
  );
})();
