window.CHEAT = window.CHEAT || [];
(function () {
  var A = 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/';
  var L = 'https://docs.oracle.com/javase/specs/jls/se25/html/';
  var D = 'https://dev.java/learn/';
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Klassen & Objekte ----------------
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'class',
    desc: "Deklariert eine Klasse: den Bauplan für Objekte mit Feldern und Methoden.",
    details: "Eine Klasse bündelt Daten (Felder) und Verhalten (Methoden). Pro Quelldatei darf es höchstens eine `public` Klasse geben, und ihr Name muss dem Dateinamen entsprechen. Klassennamen schreibt man per Konvention in UpperCamelCase. Ohne eigenen Konstruktor stellt der Compiler einen parameterlosen Standardkonstruktor bereit.",
    syntax: "[Modifikatoren] class Name [extends Oberklasse] [implements Interfaces] {\n  // Felder, Konstruktoren, Methoden\n}",
    example: e(`
class Auto {
    String marke = "VW";

    void hupen() {
        System.out.println(marke + " macht Tuut");
    }
}

Auto a = new Auto();
a.hupen(); // VW macht Tuut
`),
    tip: "Eine Klasse ist der Typ, ein Objekt ist eine konkrete Instanz davon.",
    keywords: ['klasse', 'objekt', 'bauplan', 'instanz', 'oop', 'objektorientierung'],
    related: ['new', 'Felder', 'Methoden', 'Konstruktoren'],
    mdn: L + 'jls-8.html#jls-8.1'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'new',
    desc: "Erzeugt ein Objekt oder Array und liefert eine Referenz darauf.",
    details: "`new` reserviert Speicher auf dem Heap, ruft den Konstruktor auf und gibt die Referenz zurück. Die Variable hält nur die Referenz, nicht das Objekt selbst. Deshalb vergleicht `==` bei Objekten die Referenzen, `equals()` den Inhalt. Aufgeräumt wird automatisch durch den Garbage Collector.",
    syntax: "Typ variable = new Typ(argumente);\nTyp[] feld = new Typ[laenge];",
    example: e(`
StringBuilder sb = new StringBuilder("Hallo");
int[] zahlen = new int[3];          // {0, 0, 0}
List<String> liste = new ArrayList<>();

String s1 = new String("x");
String s2 = new String("x");
System.out.println(s1 == s2);       // false (zwei Objekte)
System.out.println(s1.equals(s2));  // true (gleicher Inhalt)
System.out.println(zahlen.length);  // 3
`),
    tip: "Strings mit `new String(...)` zu erzeugen ist fast immer überflüssig; Literale genügen.",
    keywords: ['objekt erzeugen', 'instanziieren', 'instanz', 'heap', 'array erzeugen'],
    related: ['class', 'Konstruktoren', 'Object.equals()'],
    mdn: L + 'jls-15.html#jls-15.9'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'Felder',
    desc: "Variablen einer Klasse, die den Zustand eines Objekts speichern.",
    details: "Instanzfelder gehören zu jedem Objekt einzeln, `static` Felder gibt es nur einmal pro Klasse. Felder bekommen automatisch Standardwerte: `0`, `false` oder `null`. Lokale Variablen dagegen müssen vor der Benutzung initialisiert werden. Mit `final` wird ein Feld nach der Zuweisung unveränderlich.",
    syntax: "[Modifikatoren] Typ name [= startwert];",
    values: [
      ['int, long, double …', 'Standardwert 0 bzw. 0.0'],
      ['boolean', 'Standardwert false'],
      ['Referenztypen', 'Standardwert null'],
      ['final', 'Genau einmal zuweisbar (Initialisierer oder Konstruktor)']
    ],
    example: e(`
class Konto {
    static final double ZINS = 0.02;  // eine Konstante für alle
    String inhaber;                   // null
    int anzahl;                       // 0
    boolean aktiv;                    // false
    final long id = 42;               // unveränderlich
}

Konto k = new Konto();
System.out.println(k.inhaber + " " + k.anzahl + " " + k.aktiv); // null 0 false
`),
    tip: "Felder besser `private` halten und über Methoden zugänglich machen.",
    keywords: ['attribut', 'membervariable', 'instanzvariable', 'standardwert', 'field'],
    related: ['static', 'private', 'Getter und Setter', 'final bei Klassen und Methoden'],
    mdn: L + 'jls-8.html#jls-8.3'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'Methoden',
    desc: "Benannter Codeblock mit Parametern und Rückgabetyp, der das Verhalten einer Klasse beschreibt.",
    details: "Eine Methode hat Rückgabetyp (oder `void`), Namen und Parameterliste. Mit `return` liefert sie ein Ergebnis zurück. Varargs (`int... werte`) fassen mehrere Argumente als Array zusammen und müssen der letzte Parameter sein. Instanzmethoden greifen auf die Felder des Objekts zu, auf dem sie aufgerufen werden.",
    syntax: "[Modifikatoren] Rückgabetyp name(Typ param, ...) {\n  return wert;\n}",
    example: e(`
class Rechner {
    int addiere(int a, int b) {
        return a + b;
    }

    int summe(int... werte) {   // Varargs
        int s = 0;
        for (int w : werte) s += w;
        return s;
    }
}

Rechner r = new Rechner();
System.out.println(r.addiere(2, 3));        // 5
System.out.println(r.summe(1, 2, 3, 4));    // 10
System.out.println(r.summe());              // 0
`),
    tip: "Methodennamen beginnen klein und sind meist Verben (`berechne`, `ausgeben`).",
    keywords: ['funktion', 'method', 'return', 'rückgabe', 'varargs', 'parameter'],
    related: ['Methoden überladen', 'Statische Methoden', 'Wertübergabe'],
    mdn: L + 'jls-8.html#jls-8.4'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'Konstruktoren',
    desc: "Spezielle Methode ohne Rückgabetyp, die ein neues Objekt initialisiert.",
    details: "Ein Konstruktor heißt wie die Klasse und wird von `new` aufgerufen. Wer keinen schreibt, bekommt einen parameterlosen Standardkonstruktor. Sobald man einen eigenen Konstruktor definiert, entfällt dieser Standardkonstruktor. Mit `this(...)` ruft ein Konstruktor einen anderen derselben Klasse auf. Seit Java 25 dürfen davor Anweisungen stehen, die nicht auf die neue Instanz zugreifen.",
    syntax: "class Name {\n  Name(Typ param) { ... }\n}",
    example: e(`
class Person {
    String name;
    int alter;

    Person() {
        this("Unbekannt", 0);   // anderer Konstruktor
    }

    Person(String name, int alter) {
        this.name = name;
        this.alter = alter;
    }
}

Person p1 = new Person();
Person p2 = new Person("Ada", 36);
System.out.println(p1.name + ", " + p2.name); // Unbekannt, Ada
`),
    tip: "Ein versehentlicher Rückgabetyp (`void Person()`) macht aus dem Konstruktor eine normale Methode.",
    keywords: ['constructor', 'initialisieren', 'standardkonstruktor', 'default constructor', 'this()'],
    related: ['this', 'super', 'new', 'Initialisierungsblöcke'],
    mdn: L + 'jls-8.html#jls-8.8'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'this',
    desc: "Verweist auf das aktuelle Objekt; löst Namenskonflikte und verkettet Konstruktoren.",
    details: "`this` ist in Instanzmethoden und Konstruktoren die Referenz auf das Objekt, auf dem gerade gearbeitet wird. Es trennt Felder von gleichnamigen Parametern (`this.name = name`). `return this` ermöglicht verkettete Aufrufe (Fluent Interface). In `static` Kontexten gibt es kein `this`.",
    syntax: "this.feld\nthis.methode()\nthis(argumente);   // nur im Konstruktor",
    example: e(`
class Zaehler {
    int wert;

    Zaehler erhoehe(int wert) {
        this.wert += wert;   // Feld += Parameter
        return this;         // für Verkettung
    }
}

Zaehler z = new Zaehler();
z.erhoehe(2).erhoehe(3);
System.out.println(z.wert); // 5
`),
    tip: "Ohne `this.` würde `wert = wert` nur den Parameter sich selbst zuweisen.",
    keywords: ['selbstreferenz', 'aktuelles objekt', 'fluent', 'verkettung'],
    related: ['Konstruktoren', 'super', 'static'],
    mdn: L + 'jls-15.html#jls-15.8.3'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'Methoden überladen',
    desc: "Mehrere Methoden gleichen Namens mit unterschiedlicher Parameterliste.",
    details: "Beim Überladen (Overloading) wählt der Compiler anhand der statischen Argumenttypen die passende Methode. Der Rückgabetyp allein reicht zur Unterscheidung nicht aus. Gibt es keinen exakten Treffer, wird automatisch zum nächstgrößeren Typ erweitert (`char` zu `int`, `long` zu `double`). Das ist etwas anderes als Überschreiben, das erst zur Laufzeit entschieden wird.",
    example: e(`
class Druck {
    void zeige(int x)    { System.out.println("int " + x); }
    void zeige(double x) { System.out.println("double " + x); }
    void zeige(String x) { System.out.println("String " + x); }
}

Druck d = new Druck();
d.zeige(5);      // int 5
d.zeige(5.0);    // double 5.0
d.zeige("fünf"); // String fünf
d.zeige('a');    // int 97 (char wird zu int erweitert)
d.zeige(5L);     // double 5.0 (long wird zu double erweitert)
`),
    tip: "Überladene Varianten mit `null`-Argument sind oft mehrdeutig; vermeiden oder casten.",
    keywords: ['overloading', 'überladung', 'gleicher name', 'signatur'],
    related: ['Methoden überschreiben', 'Methoden', 'Konstruktoren'],
    mdn: L + 'jls-8.html#jls-8.4.9'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'Getter und Setter',
    desc: "Methoden, die private Felder lesen (get) bzw. kontrolliert ändern (set).",
    details: "Die Kapselung hält Felder `private` und erlaubt den Zugriff nur über Methoden. So lassen sich Werte beim Setzen prüfen und interne Details später ändern, ohne den Aufrufer anzupassen. Bei `boolean` heißt der Getter per Konvention `isXyz()`. Für reine Datenträger sind `record`s kürzer, weil sie Getter und Konstruktor selbst erzeugen.",
    example: e(`
class Profil {
    private String name = "Ada";
    private int alter;

    String getName() { return name; }
    int getAlter()   { return alter; }

    void setAlter(int alter) {
        if (alter < 0) throw new IllegalArgumentException("alter < 0");
        this.alter = alter;
    }

    boolean isVolljaehrig() { return alter >= 18; }
}

Profil p = new Profil();
p.setAlter(20);
System.out.println(p.getName() + " " + p.isVolljaehrig()); // Ada true
`),
    tip: "Getter und Setter für jedes Feld mechanisch anzulegen hebelt die Kapselung aus; nur anbieten, was nötig ist.",
    keywords: ['accessor', 'mutator', 'kapselung', 'encapsulation', 'bean', 'getxyz', 'setxyz'],
    related: ['private', 'record', 'Felder'],
    mdn: D + 'classes-objects/'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'static',
    desc: "Macht ein Feld oder eine Methode zum Teil der Klasse statt des einzelnen Objekts.",
    details: "`static` Felder existieren genau einmal pro Klasse und werden von allen Objekten geteilt. Zugriff erfolgt über den Klassennamen. Typisch sind Konstanten (`static final`) und Zähler. Veränderliche statische Felder sind globaler Zustand und in Mehrthread-Programmen ein Risiko.",
    example: e(`
class Kunde {
    static int anzahl = 0;   // gehört der Klasse
    final int nr;            // gehört jedem Objekt

    Kunde() {
        nr = ++anzahl;
    }
}

new Kunde();
new Kunde();
Kunde dritter = new Kunde();
System.out.println(Kunde.anzahl); // 3
System.out.println(dritter.nr);   // 3
`),
    tip: "Statische Mitglieder über den Klassennamen ansprechen (`Kunde.anzahl`), nicht über eine Instanz.",
    keywords: ['klassenvariable', 'klassenmethode', 'konstante', 'static final', 'statisch'],
    related: ['Statische Methoden', 'Initialisierungsblöcke', 'Felder'],
    mdn: L + 'jls-8.html#jls-8.3.1.1'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'Statische Methoden',
    desc: "Methoden, die ohne Objekt über den Klassennamen aufgerufen werden.",
    details: "Statische Methoden haben kein `this` und können daher nur auf andere statische Mitglieder direkt zugreifen. Sie passen zu Hilfsfunktionen ohne Zustand wie `Math.max()` oder Fabrikmethoden (`List.of()`). Sie werden nicht überschrieben, sondern höchstens verdeckt, es gibt also keine Polymorphie. Die klassische Einstiegsmethode `main` ist ebenfalls statisch; seit Java 25 ist das optional.",
    example: e(`
class MathUtil {
    static int quadrat(int x) {
        return x * x;
    }
}

System.out.println(MathUtil.quadrat(4));  // 16
System.out.println(Math.max(3, 7));       // 7
System.out.println(List.of(1, 2).size()); // 2 (statische Fabrikmethode)
`),
    tip: "Statische Methoden erschweren Tests und Austauschbarkeit; für Logik mit Abhängigkeiten besser Instanzen verwenden.",
    keywords: ['klassenmethode', 'utility', 'hilfsmethode', 'main', 'fabrikmethode', 'factory'],
    related: ['static', 'Methoden', 'this'],
    mdn: L + 'jls-8.html#jls-8.4.3.2'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'Initialisierungsblöcke',
    desc: "Codeblöcke in der Klasse, die bei der Objekt- bzw. Klasseninitialisierung laufen.",
    details: "Ein Instanzblock `{ ... }` läuft bei jedem `new` vor dem Rest des Konstruktors, ein `static { ... }` Block einmal bei der Initialisierung der Klasse. Reihenfolge: statische Blöcke, dann pro Objekt Feldinitialisierer und Instanzblöcke, dann der Konstruktorrumpf. Meist reichen Feldinitialisierer und Konstruktoren; Blöcke braucht man für komplexe statische Initialisierung.",
    example: e(`
class Demo {
    static { System.out.println("static-Block"); }
    { System.out.println("Instanzblock"); }
    Demo() { System.out.println("Konstruktor"); }
}

new Demo();
new Demo();
// static-Block, Instanzblock, Konstruktor, Instanzblock, Konstruktor
`),
    tip: "Ein statischer Block läuft nur einmal, auch bei vielen Objekten.",
    keywords: ['static block', 'instance initializer', 'initializer', 'reihenfolge', 'klasseninitialisierung'],
    related: ['Konstruktoren', 'static', 'Felder'],
    mdn: L + 'jls-8.html#jls-8.6'
  },
  {
    lang: 'java', group: 'Klassen & Objekte', name: 'Wertübergabe',
    desc: "Java übergibt Argumente immer als Kopie (pass by value): bei Objekten die Referenz.",
    details: "Primitive Werte können in einer Methode nicht für den Aufrufer geändert werden. Bei Objekten wird eine Kopie der Referenz übergeben: Man kann den Objektinhalt verändern, die Variable des Aufrufers aber nicht auf ein anderes Objekt umbiegen. Zuweisungen an den Parameter wirken nur lokal.",
    example: e(`
static void aendere(int x, int[] arr, StringBuilder sb) {
    x = 99;                        // nur lokale Kopie
    arr[0] = 99;                   // Inhalt des Objekts ändern
    sb.append("!");                // Inhalt ändern
    sb = new StringBuilder("neu"); // wirkt nicht nach außen
}

public static void main(String[] args) {
    int x = 1;
    int[] arr = {1};
    StringBuilder sb = new StringBuilder("hi");
    aendere(x, arr, sb);
    System.out.println(x);         // 1
    System.out.println(arr[0]);    // 99
    System.out.println(sb);        // hi!
}
`),
    tip: "Wer mehrere Ergebnisse braucht, gibt ein `record` oder Objekt zurück, statt Parameter zu verändern.",
    keywords: ['call by value', 'call by reference', 'übergabe', 'referenz', 'parameter', 'argument'],
    related: ['Methoden', 'new', 'final bei Klassen und Methoden'],
    mdn: L + 'jls-15.html#jls-15.12.4.5'
  },

  // ---------------- Zugriffsmodifikatoren ----------------
  {
    lang: 'java', group: 'Zugriffsmodifikatoren', name: 'public',
    desc: "Sichtbar für jeden Code, überall.",
    details: "`public` ist die offenste Stufe und gilt für Klassen, Felder, Methoden und Konstruktoren. Pro Quelldatei darf nur eine Top-Level-Klasse `public` sein, und ihr Name muss dem Dateinamen entsprechen. Alles Öffentliche bildet die API und muss später kompatibel bleiben. Öffentliche Felder sollte man vermeiden, außer bei Konstanten.",
    values: [
      ['public', 'Überall sichtbar'],
      ['protected', 'Paket und Unterklassen'],
      ['(ohne)', 'Nur im selben Paket (package-private)'],
      ['private', 'Nur innerhalb der Klasse']
    ],
    example: e(`
public class Main {
    public static final String VERSION = "1.0";   // öffentliche Konstante

    public String gruss() {                        // öffentliche API
        return "Hallo";
    }

    public static void main(String[] args) {
        System.out.println(new Main().gruss() + " " + VERSION); // Hallo 1.0
    }
}
`),
    tip: "Im Zweifel die engere Sichtbarkeit wählen; öffnen kann man später immer noch.",
    keywords: ['sichtbarkeit', 'öffentlich', 'access modifier', 'zugriff', 'api'],
    related: ['protected', 'package-private', 'private'],
    mdn: L + 'jls-6.html#jls-6.6'
  },
  {
    lang: 'java', group: 'Zugriffsmodifikatoren', name: 'protected',
    desc: "Sichtbar im eigenen Paket und in Unterklassen.",
    details: "`protected` erlaubt Unterklassen den Zugriff auf Mitglieder der Oberklasse, auch aus einem anderen Paket. Im selben Paket sind sie ohnehin sichtbar. Außerhalb des Pakets gilt der Zugriff nur über die Unterklasse selbst, nicht über beliebige Objekte der Oberklasse. Geschützte Felder koppeln Unterklassen eng an die Oberklasse; geschützte Methoden als Erweiterungspunkte sind meist sauberer.",
    example: e(`
class Tier {
    protected String name;
    protected void atme() { System.out.println(name + " atmet"); }
}

class Hund extends Tier {
    Hund(String name) { this.name = name; }   // Zugriff erlaubt
    void tricks() { atme(); }
}

new Hund("Rex").tricks(); // Rex atmet
`),
    tip: "`protected` ist weiter als package-private: Es schließt das Paket mit ein.",
    keywords: ['geschützt', 'vererbung', 'sichtbarkeit', 'unterklasse'],
    related: ['public', 'package-private', 'private', 'extends'],
    mdn: L + 'jls-6.html#jls-6.6.2'
  },
  {
    lang: 'java', group: 'Zugriffsmodifikatoren', name: 'package-private',
    desc: "Standardzugriff ohne Schlüsselwort: nur Klassen im selben Paket.",
    details: "Fehlt ein Modifikator, sind Klasse oder Mitglied nur im eigenen Paket sichtbar. Das ist die richtige Stufe für Hilfsklassen und Interna eines Pakets. Außerhalb des Pakets sieht auch eine Unterklasse diese Mitglieder nicht. Für Interface-Mitglieder gilt das nicht: Sie sind implizit `public`.",
    example: e(`
class Hilfe {                  // package-private: kein Modifikator
    int zaehler;               // nur im Paket
    void zaehle() { zaehler++; }
}

class Main {
    public static void main(String[] args) {
        Hilfe h = new Hilfe();  // gleiches Paket: erlaubt
        h.zaehle();
        System.out.println(h.zaehler); // 1
    }
}
`),
    tip: "Ohne `package`-Zeile liegen Klassen im unbenannten Paket; für echte Projekte immer Pakete verwenden.",
    keywords: ['default access', 'standard-sichtbarkeit', 'paket', 'package', 'kein modifikator'],
    related: ['public', 'protected', 'private'],
    mdn: L + 'jls-6.html#jls-6.6.1'
  },
  {
    lang: 'java', group: 'Zugriffsmodifikatoren', name: 'private',
    desc: "Nur innerhalb der deklarierenden (Top-Level-)Klasse sichtbar.",
    details: "`private` verbirgt Felder, Methoden und Konstruktoren vor allem anderen Code und ist die Basis der Kapselung. Verschachtelte Klassen dürfen auf private Mitglieder ihrer Umgebung zugreifen und umgekehrt. Ein privater Konstruktor verhindert die Instanziierung von außen (Utility-Klassen, Singletons, Fabrikmethoden).",
    example: e(`
class Konto {
    private double stand = 100;
    private Konto() { }                        // nur intern erzeugbar

    static Konto neu() { return new Konto(); } // Fabrikmethode
    double getStand() { return stand; }
}

class Main {
    public static void main(String[] args) {
        Konto k = Konto.neu();
        // k.stand = 5;   // Fehler: stand has private access in Konto
        // new Konto();   // Fehler: Konto() has private access in Konto
        System.out.println(k.getStand()); // 100.0
    }
}
`),
    tip: "Private Mitglieder sind für andere Top-Level-Klassen unsichtbar, auch in derselben Datei; nur verschachtelte Klassen teilen sie sich.",
    keywords: ['kapselung', 'privat', 'verbergen', 'singleton', 'sichtbarkeit'],
    related: ['public', 'Getter und Setter', 'Statische verschachtelte Klassen'],
    mdn: L + 'jls-6.html#jls-6.6.1'
  },
  {
    lang: 'java', group: 'Zugriffsmodifikatoren', name: 'final bei Klassen und Methoden',
    desc: "Verbietet das Ableiten einer Klasse bzw. das Überschreiben einer Methode.",
    details: "Eine `final` Klasse kann nicht erweitert werden (z. B. `String`, `Integer`). Eine `final` Methode kann in Unterklassen nicht überschrieben werden. Bei Feldern und Variablen bedeutet `final`, dass sie nur einmal zugewiesen werden; bei Objekten bleibt der Inhalt dennoch veränderbar. Für Unveränderlichkeit auch `final` Felder und Records nutzen.",
    example: e(`
final class Konstanten {            // nicht ableitbar
    static final int MAX = 10;
}
// class Mehr extends Konstanten {}  // Fehler: cannot inherit from final

class Basis {
    final void start() { System.out.println("Basis-Start"); }
}
class Kind extends Basis {
    // void start() {}               // Fehler: cannot override final method
}

final List<String> liste = new ArrayList<>();
liste.add("ok");                     // Inhalt änderbar
// liste = new ArrayList<>();        // Fehler: cannot assign a value to final variable
System.out.println(liste + " " + Konstanten.MAX); // [ok] 10
`),
    tip: "`final` auf Parametern und lokalen Variablen verhindert versehentliches Überschreiben und hilft bei Lambdas.",
    keywords: ['unveränderlich', 'konstante', 'nicht ableitbar', 'immutable', 'sealed'],
    related: ['sealed und permits', 'Methoden überschreiben', 'Felder', 'record'],
    mdn: L + 'jls-8.html#jls-8.1.1.2'
  },

  // ---------------- Vererbung & Polymorphie ----------------
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'extends',
    desc: "Leitet eine Klasse von einer Oberklasse ab und erbt deren Mitglieder.",
    details: "Java kennt nur Einfachvererbung: eine Klasse hat genau eine direkte Oberklasse, kann aber viele Interfaces implementieren. Die Unterklasse erbt alle zugänglichen, nicht privaten Felder und Methoden (package-private nur im selben Paket) und kann eigene ergänzen oder Methoden überschreiben. Ohne `extends` erbt jede Klasse von `Object`. Konstruktoren werden nicht vererbt.",
    syntax: "class Unterklasse extends Oberklasse { ... }",
    example: e(`
class Tier {
    String name;
    Tier(String name) { this.name = name; }
    void essen() { System.out.println(name + " frisst"); }
}

class Hund extends Tier {
    Hund(String name) { super(name); }
    void bellen() { System.out.println(name + " bellt"); }
}

Hund h = new Hund("Rex");
h.essen();   // Rex frisst (geerbt)
h.bellen();  // Rex bellt
`),
    tip: "Vererbung nur bei echter \"ist-ein\"-Beziehung verwenden; für \"hat-ein\" Komposition wählen.",
    keywords: ['vererbung', 'inheritance', 'oberklasse', 'unterklasse', 'superclass', 'subclass', 'ableiten'],
    related: ['super', 'Methoden überschreiben', 'implements', 'Object'],
    mdn: L + 'jls-8.html#jls-8.1.4'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'super',
    desc: "Greift auf die Oberklasse zu: Konstruktor, Methoden und Felder.",
    details: "`super(...)` ruft einen Konstruktor der Oberklasse auf. Fehlt der Aufruf, setzt der Compiler `super()` ein, was scheitert, wenn die Oberklasse keinen parameterlosen Konstruktor hat. `super.methode()` ruft die überschriebene Version der Oberklasse auf. Seit Java 25 dürfen vor `super(...)` Anweisungen stehen, die nicht auf die neue Instanz zugreifen, etwa das Prüfen von Argumenten.",
    syntax: "super(argumente);\nsuper.methode();\nsuper.feld",
    example: e(`
class Konto {
    protected double stand;
    Konto(double start) { stand = start; }
    String info() { return "Stand: " + stand; }
}

class Sparkonto extends Konto {
    Sparkonto(double start) { super(start); }   // Konstruktor der Oberklasse
    @Override String info() {
        return super.info() + " (Spar)";        // Methode der Oberklasse
    }
}

System.out.println(new Sparkonto(50).info()); // Stand: 50.0 (Spar)
`),
    tip: "Hat die Oberklasse keinen parameterlosen Konstruktor, muss jede Unterklasse `super(...)` explizit aufrufen.",
    keywords: ['oberklasse', 'superklasse', 'konstruktoraufruf', 'super()'],
    related: ['extends', 'Konstruktoren', 'Methoden überschreiben', 'this'],
    mdn: L + 'jls-8.html#jls-8.8.7'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'Methoden überschreiben',
    desc: "Eine Unterklasse ersetzt die Implementierung einer geerbten Methode.",
    details: "Die überschreibende Methode hat dieselbe Signatur, darf aber einen spezielleren Rückgabetyp haben (kovariant) und keine engere Sichtbarkeit. Sie darf keine zusätzlichen geprüften Exceptions werfen. Welche Version läuft, entscheidet die Laufzeit anhand des echten Objekttyps (dynamische Bindung). `static`, `private` und `final` Methoden lassen sich nicht überschreiben.",
    example: e(`
class Form {
    String name() { return "Form"; }
    Object kopie() { return new Form(); }
}

class Kreis extends Form {
    @Override String name() { return "Kreis"; }
    @Override Kreis kopie() { return new Kreis(); }   // kovarianter Rückgabetyp
}

Form f = new Kreis();
System.out.println(f.name());                   // Kreis (Laufzeittyp zählt)
System.out.println(f.kopie() instanceof Kreis); // true
`),
    tip: "Immer `@Override` schreiben: Tippfehler in der Signatur werden dann zu Compilerfehlern.",
    keywords: ['override', 'overriding', 'überschreibung', 'dynamische bindung', 'kovarianz'],
    related: ['@Override', 'Methoden überladen', 'Polymorphie', 'super'],
    mdn: L + 'jls-8.html#jls-8.4.8'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: '@Override',
    desc: "Annotation, die der Compiler prüft: Die Methode muss etwas überschreiben.",
    details: "Mit `@Override` meldet der Compiler einen Fehler, wenn die Methode keine Methode einer Oberklasse oder eines Interfaces überschreibt oder implementiert. Das fängt Tippfehler und spätere Änderungen in der Oberklasse ab. Zur Laufzeit hat die Annotation keine Wirkung. Sie ist optional, aber Standard in jedem sauberen Code.",
    example: e(`
class Person {
    String name = "Ada";

    @Override
    public String toString() { return name; }

    // @Override
    // public boolean equal(Object o) { return true; }
    // Fehler: method does not override or implement a method from a supertype
}

System.out.println(new Person()); // Ada
`),
    tip: "Bei `equals(Person p)` statt `equals(Object o)` wird nur überladen; `@Override` entlarvt das sofort.",
    keywords: ['annotation', 'override', 'überschreiben prüfen'],
    related: ['Methoden überschreiben', 'Object.equals()', 'Object.toString()'],
    mdn: A + 'lang/Override.html'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'abstract',
    desc: "Markiert Klassen, die nicht instanziiert werden, und Methoden ohne Rumpf.",
    details: "Eine `abstract` Klasse dient als gemeinsame Basis und darf abstrakte Methoden ohne Rumpf enthalten, die Unterklassen implementieren müssen. Sie kann außerdem Felder, Konstruktoren und fertige Methoden enthalten. `new` auf einer abstrakten Klasse ist verboten. Eine Klasse mit abstrakter Methode muss selbst `abstract` sein.",
    syntax: "abstract class Name {\n  abstract Rückgabetyp methode();\n}",
    example: e(`
abstract class Form {
    abstract double flaeche();            // ohne Rumpf

    String beschreibe() {                 // fertige Methode
        return "Fläche: " + flaeche();
    }
}

class Quadrat extends Form {
    double a;
    Quadrat(double a) { this.a = a; }
    @Override double flaeche() { return a * a; }
}

// Form f = new Form();   // Fehler: Form is abstract; cannot be instantiated
System.out.println(new Quadrat(3).beschreibe()); // Fläche: 9.0
`),
    tip: "Wenn kein Zustand und kein gemeinsamer Code nötig ist, ist ein `interface` die flexiblere Wahl.",
    keywords: ['abstrakte klasse', 'abstrakte methode', 'template method'],
    related: ['interface', 'extends', 'Polymorphie'],
    mdn: L + 'jls-8.html#jls-8.1.1.1'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'Polymorphie',
    desc: "Ein Aufruf über den Oberklassentyp führt die Methode des echten Objekts aus.",
    details: "Eine Variable vom Typ der Oberklasse oder eines Interfaces kann Objekte beliebiger Unterklassen halten. Beim Aufruf einer Instanzmethode entscheidet der Laufzeittyp, welche Version läuft (dynamische Bindung). So lässt sich Code schreiben, der gegen die Abstraktion arbeitet und neue Varianten ohne Änderung aufnimmt. Felder und `static` Methoden sind dagegen nicht polymorph.",
    example: e(`
abstract class Tier {
    abstract String laut();
}
class Hund extends Tier { String laut() { return "Wuff"; } }
class Katze extends Tier { String laut() { return "Miau"; } }

List<Tier> tiere = List.of(new Hund(), new Katze());
for (Tier t : tiere) {
    System.out.println(t.laut());   // Wuff, dann Miau
}
`),
    tip: "Statt langer `if (x instanceof ...)`-Ketten die Verzweigung in überschriebene Methoden verlagern.",
    keywords: ['vielgestaltigkeit', 'dynamische bindung', 'late binding', 'upcast', 'laufzeittyp'],
    related: ['Methoden überschreiben', 'Casting von Referenzen', 'abstract', 'interface'],
    mdn: D + 'inheritance/'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'Casting von Referenzen',
    desc: "Wandelt den statischen Typ einer Referenz um: Upcast implizit, Downcast explizit.",
    details: "Ein Upcast (Unterklasse zu Oberklasse) ist immer sicher und geschieht automatisch. Ein Downcast braucht eine explizite Klammer und wird erst zur Laufzeit geprüft; passt der echte Typ nicht, fliegt eine `ClassCastException`. Das Objekt selbst ändert sich nie, nur die Sicht darauf. Vorher mit `instanceof` prüfen, am besten mit Pattern Matching.",
    syntax: "Ziel t = (Ziel) objekt;",
    example: e(`
Object o = "Hallo";
String s = (String) o;          // Downcast, ok
CharSequence cs = s;            // Upcast, automatisch

Object zahl = 42;
try {
    String falsch = (String) zahl;   // Integer ist kein String
} catch (ClassCastException ex) {
    System.out.println("ClassCastException");
}

if (zahl instanceof Integer i) {
    System.out.println(i + 1);       // 43
}
`),
    tip: "Primitive Typen castet man anders (`(int) 3.7`): dort werden Werte umgerechnet, keine Referenzen.",
    keywords: ['typumwandlung', 'upcast', 'downcast', 'classcastexception', 'cast', 'instanceof'],
    related: ['Pattern Matching für instanceof', 'Polymorphie', 'Häufige Exceptions'],
    mdn: L + 'jls-5.html#jls-5.5'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'Object',
    desc: "Wurzel aller Klassen in Java; liefert grundlegende Methoden für jedes Objekt.",
    details: "Jede Klasse erbt direkt oder indirekt von `java.lang.Object`. Dort liegen `equals()`, `hashCode()`, `toString()`, `getClass()`, außerdem `clone()` sowie `wait()`, `notify()` und `notifyAll()` für Threads. Arrays sind ebenfalls Objekte. Primitive Typen sind keine `Object`s, werden aber bei Bedarf automatisch geboxt.",
    values: [
      ['equals(Object)', 'Inhaltsgleichheit, Standard ist Identität'],
      ['hashCode()', 'Hashwert, muss zu equals() passen'],
      ['toString()', 'Textdarstellung, Standard Klasse@Hash'],
      ['getClass()', 'Laufzeitklasse des Objekts'],
      ['wait/notify', 'Thread-Koordination']
    ],
    example: e(`
class Leer { }

Object o = new Leer();
System.out.println(o instanceof Object);          // true
System.out.println(o.getClass().getSimpleName()); // Leer
System.out.println(o.equals(o));                  // true
Object[] mix = { "text", 42, 3.5, new int[0] };   // alles ist ein Object
System.out.println(mix.length);                   // 4
`),
    tip: "Eigene Klassen sollten mindestens `toString()` überschreiben; sinnvolle Ausgaben helfen beim Debuggen.",
    keywords: ['wurzelklasse', 'java.lang.object', 'basisklasse', 'root'],
    related: ['Object.equals()', 'Object.hashCode()', 'Object.toString()', 'Object.getClass()'],
    mdn: A + 'lang/Object.html'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'Object.equals()',
    desc: "Prüft Inhaltsgleichheit; die Standardversion vergleicht nur die Identität.",
    details: "Der Standard-`equals()` entspricht `==`. Eigene Klassen überschreiben ihn für fachliche Gleichheit. Der Vertrag verlangt Reflexivität, Symmetrie, Transitivität, Konsistenz und `x.equals(null) == false`. Wer `equals()` überschreibt, muss auch `hashCode()` überschreiben, sonst arbeiten `HashMap` und `HashSet` fehlerhaft.",
    syntax: "@Override\npublic boolean equals(Object o)",
    example: e(`
class Punkt {
    final int x, y;
    Punkt(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        return o instanceof Punkt p && x == p.x && y == p.y;
    }
    @Override
    public int hashCode() { return Objects.hash(x, y); }
}

Punkt a = new Punkt(1, 2), b = new Punkt(1, 2);
System.out.println(a == b);            // false (verschiedene Objekte)
System.out.println(a.equals(b));       // true
System.out.println("a".equals(null));  // false
`),
    tip: "Strings und Objekte mit `equals()` vergleichen, nie mit `==`. Für `null`-Sicherheit `Objects.equals(a, b)` nutzen.",
    keywords: ['gleichheit', 'vergleichen', 'identität', 'equals', '==', 'objects.equals'],
    related: ['Object.hashCode()', 'Object', 'record', '@Override'],
    mdn: A + 'lang/Object.html#equals(java.lang.Object)'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'Object.hashCode()',
    desc: "Liefert einen int-Hashwert, der zu equals() passen muss.",
    details: "Der Vertrag: Gleiche Objekte (`equals()`) liefern denselben Hashwert; ungleiche dürfen kollidieren. Hash-basierte Sammlungen wie `HashMap` und `HashSet` suchen zuerst über den Hashwert. Wird nur `equals()` überschrieben, findet `contains()` gleiche Objekte in der Regel nicht. `Objects.hash(...)` erzeugt einen passenden Wert aus mehreren Feldern.",
    syntax: "@Override\npublic int hashCode() { return Objects.hash(feld1, feld2); }",
    example: e(`
class Punkt {
    final int x, y;
    Punkt(int x, int y) { this.x = x; this.y = y; }
    @Override public boolean equals(Object o) {
        return o instanceof Punkt p && x == p.x && y == p.y;
    }
    @Override public int hashCode() { return Objects.hash(x, y); }
}

Set<Punkt> menge = new HashSet<>();
menge.add(new Punkt(1, 2));
System.out.println(menge.contains(new Punkt(1, 2))); // true
System.out.println(new Punkt(1, 2).hashCode());      // 994
`),
    tip: "Veränderliche Felder im `hashCode()` sind gefährlich: Ändert sich das Objekt in einem `HashSet`, wird es nicht mehr gefunden.",
    keywords: ['hash', 'hashcode', 'hashmap', 'hashset', 'objects.hash', 'vertrag'],
    related: ['Object.equals()', 'Object', 'record'],
    mdn: A + 'lang/Object.html#hashCode()'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'Object.toString()',
    desc: "Liefert die Textdarstellung eines Objekts, genutzt von println und String-Verkettung.",
    details: "Der Standard liefert nur `Klassenname@Hashwert` und ist wenig hilfreich. `System.out.println(obj)`, String-Verkettung und die meisten Logger rufen `toString()` automatisch auf. Eigene Klassen überschreiben sie mit einer lesbaren Darstellung der wichtigsten Felder. Records erzeugen eine passende Version selbst.",
    example: e(`
class Person {
    String name = "Ada";
    int alter = 36;

    @Override
    public String toString() {
        return "Person[name=" + name + ", alter=" + alter + "]";
    }
}

Person p = new Person();
System.out.println(p);            // Person[name=Ada, alter=36]
System.out.println("Hallo " + p); // Hallo Person[name=Ada, alter=36]
`),
    tip: "Keine sensiblen Daten (Passwörter) in `toString()` aufnehmen; die Ausgabe landet schnell in Logs.",
    keywords: ['textdarstellung', 'ausgabe', 'string', 'println', 'debug'],
    related: ['Object', 'record', 'Object.equals()'],
    mdn: A + 'lang/Object.html#toString()'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'Object.getClass()',
    desc: "Liefert das Class-Objekt des tatsächlichen Laufzeittyps.",
    details: "`getClass()` gibt immer die echte Klasse zurück, nicht den deklarierten Variablentyp. Damit lassen sich Name, Paket und weitere Metadaten ermitteln und Klassen exakt vergleichen. Der Vergleich `a.getClass() == b.getClass()` ist strenger als `instanceof`, denn er schließt Unterklassen aus. Das Klassenliteral `String.class` bezeichnet die Klasse ohne Instanz.",
    example: e(`
Object o = "text";
System.out.println(o.getClass().getName());        // java.lang.String
System.out.println(o.getClass().getSimpleName());  // String
System.out.println(o.getClass() == String.class);  // true

List<Integer> liste = new ArrayList<>();
System.out.println(liste.getClass());              // class java.util.ArrayList
System.out.println(new int[0].getClass().getSimpleName()); // int[]
`),
    tip: "In `equals()` ist `instanceof` meist die bessere Wahl; `getClass()`-Vergleich nur, wenn Unterklassen nie gleich sein dürfen.",
    keywords: ['reflection', 'class', 'klassenname', 'laufzeittyp', 'getname', 'getsimplename'],
    related: ['Object', 'Object.equals()', 'Pattern Matching für instanceof'],
    mdn: A + 'lang/Object.html#getClass()'
  },
  {
    lang: 'java', group: 'Vererbung & Polymorphie', name: 'Comparable und compareTo',
    desc: "Interface für die natürliche Ordnung von Objekten über compareTo().",
    details: "Eine Klasse, die `Comparable<T>` implementiert, definiert mit `compareTo()` ihre Standard-Sortierreihenfolge. Rückgabe negativ bedeutet kleiner, `0` gleich, positiv größer. `compareTo()` sollte konsistent mit `equals()` sein. Damit sortieren `Collections.sort()` und `TreeSet` automatisch; für andere Ordnungen gibt es `Comparator`.",
    syntax: "class T implements Comparable<T> {\n  public int compareTo(T anderes) { ... }\n}",
    example: e(`
class Version implements Comparable<Version> {
    final int major, minor;
    Version(int major, int minor) { this.major = major; this.minor = minor; }

    @Override
    public int compareTo(Version o) {
        if (major != o.major) return Integer.compare(major, o.major);
        return Integer.compare(minor, o.minor);
    }
    @Override public String toString() { return major + "." + minor; }
}

List<Version> v = new ArrayList<>(List.of(new Version(2, 1), new Version(1, 9), new Version(2, 0)));
Collections.sort(v);
System.out.println(v); // [1.9, 2.0, 2.1]
`),
    tip: "Nicht mit `a - b` vergleichen: Das kann bei großen Werten überlaufen. `Integer.compare(a, b)` verwenden.",
    keywords: ['sortieren', 'ordnung', 'natürliche ordnung', 'comparator', 'compare', 'sort'],
    related: ['interface', 'Object.equals()', 'Generische Klassen'],
    mdn: A + 'lang/Comparable.html'
  },

  // ---------------- Interfaces ----------------
  {
    lang: 'java', group: 'Interfaces', name: 'interface',
    desc: "Beschreibt einen Vertrag aus Methoden und Konstanten, ohne Zustand einer Instanz.",
    details: "Ein Interface legt fest, was eine Klasse können muss, aber nicht wie. Methoden sind implizit `public abstract`, Felder implizit `public static final`. Eine Klasse kann beliebig viele Interfaces implementieren, ein Interface kann mehrere andere erweitern. Interfaces können nicht instanziiert werden, Variablen dieses Typs dürfen aber auf jedes implementierende Objekt zeigen.",
    syntax: "interface Name [extends A, B] {\n  Rückgabetyp methode();\n}",
    example: e(`
interface Fahrzeug {
    int RADER = 4;          // implizit public static final
    void fahren();          // implizit public abstract
}

class Auto implements Fahrzeug {
    public void fahren() {   // muss public sein
        System.out.println("Auto fährt auf " + RADER + " Rädern");
    }
}

Fahrzeug f = new Auto();
f.fahren(); // Auto fährt auf 4 Rädern
`),
    tip: "Gegen Interfaces programmieren (`List<String> l = new ArrayList<>()`) hält Code austauschbar und testbar.",
    keywords: ['schnittstelle', 'vertrag', 'contract', 'abstraktion', 'api'],
    related: ['implements', 'abstract', 'default-Methoden', 'Polymorphie'],
    mdn: L + 'jls-9.html#jls-9.1'
  },
  {
    lang: 'java', group: 'Interfaces', name: 'implements',
    desc: "Eine Klasse verpflichtet sich, alle Methoden eines oder mehrerer Interfaces umzusetzen.",
    details: "Hinter `implements` stehen kommagetrennt beliebig viele Interfaces. Die Klasse muss alle abstrakten Methoden mit `public` implementieren, sonst muss sie selbst `abstract` sein. So erreicht Java eine Art Mehrfachvererbung für Typen, ohne die Probleme von Mehrfachvererbung für Zustand. Die Reihenfolge ist `extends` vor `implements`.",
    syntax: "class Name [extends Oberklasse] implements A, B { ... }",
    example: e(`
interface Schwimmer { void schwimm(); }
interface Flieger  { void flieg(); }

class Ente implements Schwimmer, Flieger {
    public void schwimm() { System.out.println("Ente schwimmt"); }
    public void flieg()   { System.out.println("Ente fliegt"); }
}

Schwimmer s = new Ente();
s.schwimm();                       // Ente schwimmt
if (s instanceof Flieger fl) {
    fl.flieg();                    // Ente fliegt
}
`),
    tip: "Vergisst man `public` bei der Implementierung, meldet der Compiler eine schwächere Zugriffsstufe.",
    keywords: ['implementieren', 'mehrfachvererbung', 'schnittstelle umsetzen'],
    related: ['interface', 'extends', 'default-Methoden'],
    mdn: L + 'jls-8.html#jls-8.1.5'
  },
  {
    lang: 'java', group: 'Interfaces', name: 'default-Methoden',
    desc: "Methoden mit Rumpf im Interface (seit Java 8), die Implementierer erben oder überschreiben.",
    details: "Mit `default` darf ein Interface eine Standardimplementierung liefern, ohne bestehende Implementierer zu brechen. So wurde z. B. `List.sort()` nachträglich ergänzt. Erben Klassen dieselbe Default-Methode aus zwei Interfaces, muss die Klasse überschreiben und kann mit `Interface.super.methode()` gezielt eine Version wählen. Eine Methode der Klasse oder Oberklasse hat immer Vorrang vor einer Default-Methode.",
    syntax: "interface X {\n  default Rückgabetyp methode() { ... }\n}",
    example: e(`
interface Begruesser {
    String name();
    default String gruss() { return "Hallo " + name(); }
}
interface Hoeflich {
    default String gruss() { return "Guten Tag"; }
}

class Gast implements Begruesser, Hoeflich {
    public String name() { return "Gast"; }
    public String gruss() {      // Konflikt: Überschreiben ist Pflicht
        return Begruesser.super.gruss() + " / " + Hoeflich.super.gruss();
    }
}

System.out.println(new Gast().gruss()); // Hallo Gast / Guten Tag
`),
    tip: "Default-Methoden sind für Weiterentwicklung von APIs gedacht, nicht als Ersatz für abstrakte Klassen mit Zustand.",
    keywords: ['standardmethode', 'default', 'java 8', 'diamond problem', 'interface.super'],
    related: ['interface', 'Statische Interface-Methoden', 'Private Interface-Methoden', 'implements'],
    mdn: L + 'jls-9.html#jls-9.4.3'
  },
  {
    lang: 'java', group: 'Interfaces', name: 'Statische Interface-Methoden',
    desc: "Hilfs- und Fabrikmethoden direkt im Interface (seit Java 8).",
    details: "Eine `static` Methode im Interface gehört zum Interface selbst und wird über dessen Namen aufgerufen (`Comparator.naturalOrder()`). Sie wird nicht vererbt und lässt sich nicht über eine Instanz oder ein implementierendes Klassenobjekt aufrufen. Typische Verwendung sind Fabrikmethoden und kleine Helfer, die sonst in einer separaten Utility-Klasse stünden.",
    example: e(`
interface Validator {
    boolean pruefe(String s);

    static Validator nichtLeer() {          // Fabrikmethode
        return s -> !s.isBlank();
    }
}

Validator v = Validator.nichtLeer();
System.out.println(v.pruefe("Ada"));   // true
System.out.println(v.pruefe("   "));   // false
`),
    tip: "Aufruf immer mit Interface-Namen: `Validator.nichtLeer()`; über eine Variable geht es nicht.",
    keywords: ['static', 'fabrikmethode', 'factory', 'utility', 'java 8'],
    related: ['interface', 'default-Methoden', 'Statische Methoden'],
    mdn: L + 'jls-9.html#jls-9.4'
  },
  {
    lang: 'java', group: 'Interfaces', name: 'Private Interface-Methoden',
    desc: "Hilfsmethoden im Interface, die von default- und static-Methoden genutzt werden (seit Java 9).",
    details: "Mit `private` (oder `private static`) lässt sich gemeinsamer Code in einem Interface bündeln, ohne ihn der API auszusetzen. Private Methoden haben immer einen Rumpf und sind für Implementierer unsichtbar. Sie dienen allein dazu, Wiederholungen in `default`- und `static`-Methoden zu vermeiden.",
    example: e(`
interface Logger {
    default void info(String m)   { schreibe("INFO", m); }
    default void fehler(String m) { schreibe("FEHLER", m); }

    private void schreibe(String stufe, String m) {   // nicht Teil der API
        System.out.println("[" + stufe + "] " + m);
    }
}

class Konsole implements Logger { }

Konsole k = new Konsole();
k.info("gestartet");    // [INFO] gestartet
k.fehler("kaputt");     // [FEHLER] kaputt
`),
    tip: "Private Interface-Methoden ersetzen den früher üblichen Umweg über eine separate Hilfsklasse.",
    keywords: ['private', 'java 9', 'hilfsmethode', 'interface'],
    related: ['default-Methoden', 'Statische Interface-Methoden', 'private'],
    mdn: L + 'jls-9.html#jls-9.4'
  },
  {
    lang: 'java', group: 'Interfaces', name: 'Funktionale Interfaces',
    desc: "Interface mit genau einer abstrakten Methode; Ziel für Lambdas und Methodenreferenzen.",
    details: "Ein funktionales Interface hat genau eine abstrakte Methode, `default`- und `static`-Methoden zählen nicht. Dafür lässt sich ein Lambda oder eine Methodenreferenz schreiben. `@FunctionalInterface` ist optional, lässt den Compiler aber prüfen, dass es dabei bleibt. Fertige Typen wie `Function`, `Predicate` und `Supplier` liegen in `java.util.function`, `Runnable` in `java.lang`. Lambdas selbst werden an anderer Stelle behandelt.",
    example: e(`
@FunctionalInterface
interface Rechenop {
    int an(int a, int b);
}

Rechenop plus = (a, b) -> a + b;
Rechenop mal  = (a, b) -> a * b;
System.out.println(plus.an(2, 3)); // 5
System.out.println(mal.an(2, 3));  // 6

Function<Integer, Integer> verdopple = x -> x * 2;   // fertig im JDK
System.out.println(verdopple.apply(4)); // 8
`),
    tip: "Bevor man ein eigenes funktionales Interface schreibt, lohnt ein Blick in `java.util.function`.",
    keywords: ['lambda', 'functional interface', 'sam', 'single abstract method', 'function', 'predicate'],
    related: ['interface', 'default-Methoden', 'Anonyme Klassen'],
    mdn: A + 'lang/FunctionalInterface.html'
  },
  {
    lang: 'java', group: 'Interfaces', name: 'Marker-Interfaces',
    desc: "Interfaces ohne Methoden, die ein Objekt nur mit einer Eigenschaft kennzeichnen.",
    details: "Ein Marker-Interface hat keinen Inhalt; seine bloße Implementierung ist die Aussage. Bekannte Beispiele sind `Serializable`, `Cloneable` und `RandomAccess`. Code prüft die Eigenschaft per `instanceof`. Heute ersetzen oft Annotationen dieses Muster, ein Marker-Interface bleibt aber nützlich, wenn der Typ in Signaturen vorkommen soll.",
    example: e(`
interface Exportierbar { }          // Marker: keine Methoden

class Bericht implements Exportierbar { }
class Notiz { }

Object[] objekte = { new Bericht(), new Notiz() };
for (Object o : objekte) {
    System.out.println(o instanceof Exportierbar);   // true, dann false
}

System.out.println(new ArrayList<String>() instanceof RandomAccess); // true
`),
    tip: "`Serializable` markiert nur die Möglichkeit zur Serialisierung; die Serialisierung selbst gilt als fehleranfällig.",
    keywords: ['marker', 'serializable', 'cloneable', 'randomaccess', 'tagging interface'],
    related: ['interface', 'Eigene Annotationen', 'Casting von Referenzen'],
    mdn: A + 'io/Serializable.html'
  },

  // ---------------- Records, Enums & Sealed Types ----------------
  {
    lang: 'java', group: 'Records, Enums & Sealed Types', name: 'record',
    desc: "Kompakte, unveränderliche Datenklasse mit automatisch erzeugten Methoden (seit Java 16).",
    details: "Ein `record` deklariert Komponenten im Kopf und erhält dafür private finale Felder, einen Konstruktor, Zugriffsmethoden (`x()`, nicht `getX()`) sowie `equals()`, `hashCode()` und `toString()`. Records sind implizit `final` und können nicht erweitert werden, dürfen aber Interfaces implementieren und eigene Methoden, statische Member und Konstruktoren besitzen. Instanzfelder neben den Komponenten sind verboten.",
    syntax: "record Name(Typ a, Typ b) [implements X] { ... }",
    example: e(`
record Punkt(int x, int y) {
    double abstand() { return Math.sqrt(x * x + y * y); }
    static Punkt ursprung() { return new Punkt(0, 0); }
}

Punkt p = new Punkt(3, 4);
System.out.println(p);                        // Punkt[x=3, y=4]
System.out.println(p.x());                    // 3
System.out.println(p.equals(new Punkt(3, 4))); // true
System.out.println(p.abstand());              // 5.0
System.out.println(Punkt.ursprung());         // Punkt[x=0, y=0]
`),
    tip: "Ein Record ist flach unveränderlich: Eine enthaltene `List` kann sich weiterhin ändern, wenn man sie nicht kopiert.",
    keywords: ['datenklasse', 'immutable', 'value object', 'dto', 'java 16', 'unveränderlich'],
    related: ['Kompakte Konstruktoren', 'Record Patterns', 'Getter und Setter', 'Object.equals()'],
    mdn: A + 'lang/Record.html'
  },
  {
    lang: 'java', group: 'Records, Enums & Sealed Types', name: 'Kompakte Konstruktoren',
    desc: "Konstruktor eines Records ohne Parameterliste für Prüfung und Normalisierung.",
    details: "Im kompakten Konstruktor schreibt man nur den Rumpf, die Parameter heißen wie die Komponenten. Man kann sie prüfen, eine Exception werfen oder sie neu zuweisen; die Felder werden danach automatisch gesetzt. Direkte Zuweisungen an `this.x` sind dort verboten. So erzwingt man Invarianten an einer einzigen Stelle.",
    example: e(`
record Bereich(int von, int bis) {
    Bereich {                                   // kompakt: keine Parameterliste
        if (von > bis) throw new IllegalArgumentException("von > bis");
    }
}

record Name(String wert) {
    Name {
        wert = wert.trim();                     // Parameter normalisieren
    }
}

System.out.println(new Name("  Ada ").wert()); // Ada
try {
    new Bereich(5, 1);
} catch (IllegalArgumentException ex) {
    System.out.println(ex.getMessage());       // von > bis
}
`),
    tip: "Veränderliche Komponenten wie Listen im kompakten Konstruktor mit `List.copyOf(...)` defensiv kopieren.",
    keywords: ['compact constructor', 'validierung', 'invariante', 'record konstruktor'],
    related: ['record', 'Konstruktoren', 'throw'],
    mdn: L + 'jls-8.html#jls-8.10.4.2'
  },
  {
    lang: 'java', group: 'Records, Enums & Sealed Types', name: 'enum',
    desc: "Typ mit einer festen, benannten Menge von Konstanten.",
    details: "Jede Konstante ist ein einziges Objekt des Enum-Typs, daher darf man sie mit `==` vergleichen. Eingebaut sind `values()`, `valueOf(String)`, `name()` und `ordinal()`. `valueOf` wirft eine `IllegalArgumentException` bei unbekanntem Namen. In einem `switch`-Ausdruck über ein Enum prüft der Compiler die Vollständigkeit, sodass kein `default` nötig ist.",
    syntax: "enum Name { KONSTANTE_A, KONSTANTE_B }",
    example: e(`
enum Tag { MO, DI, MI }

Tag t = Tag.DI;
System.out.println(t);                          // DI
System.out.println(t.ordinal());                // 1
System.out.println(Tag.valueOf("MI"));          // MI
System.out.println(Arrays.toString(Tag.values())); // [MO, DI, MI]
System.out.println(t == Tag.DI);                // true

String s = switch (t) {
    case MO -> "Start";
    case DI, MI -> "Mitte";
};
System.out.println(s);                          // Mitte
`),
    tip: "Die `ordinal()`-Nummer nicht speichern oder als Wert verwenden: Sie ändert sich, wenn man Konstanten umsortiert.",
    keywords: ['aufzählung', 'enumeration', 'konstanten', 'values', 'valueof', 'ordinal'],
    related: ['Enum mit Feldern und Methoden', 'EnumSet und EnumMap', 'sealed und permits'],
    mdn: A + 'lang/Enum.html'
  },
  {
    lang: 'java', group: 'Records, Enums & Sealed Types', name: 'Enum mit Feldern und Methoden',
    desc: "Enum-Konstanten mit eigenen Daten, Konstruktor und Verhalten.",
    details: "Ein Enum ist eine vollwertige Klasse: Es kann Felder, Konstruktoren und Methoden haben und Interfaces implementieren. Die Konstanten werden mit Argumenten für den Konstruktor aufgeführt, gefolgt von einem Semikolon. Der Konstruktor ist implizit `private`. Jede Konstante kann außerdem Methoden überschreiben oder eine abstrakte Methode umsetzen.",
    example: e(`
enum Groesse {
    S(36), M(40), L(44);                 // Semikolon nach der Liste

    private final int weite;
    Groesse(int weite) { this.weite = weite; }
    int weite() { return weite; }
}

enum Op {
    PLUS("+") { int an(int a, int b) { return a + b; } },
    MAL("*")  { int an(int a, int b) { return a * b; } };

    final String zeichen;
    Op(String zeichen) { this.zeichen = zeichen; }
    abstract int an(int a, int b);       // jede Konstante implementiert sie
}

System.out.println(Groesse.M.weite());        // 40
System.out.println(Op.MAL.zeichen + " " + Op.MAL.an(3, 4)); // * 12
`),
    tip: "Statt `switch` über ein Enum an mehreren Stellen lieber das Verhalten in die Konstanten legen.",
    keywords: ['enum konstruktor', 'konstantenspezifische methoden', 'enum felder', 'strategie'],
    related: ['enum', 'EnumSet und EnumMap', 'abstract'],
    mdn: L + 'jls-8.html#jls-8.9'
  },
  {
    lang: 'java', group: 'Records, Enums & Sealed Types', name: 'EnumSet und EnumMap',
    desc: "Spezialisierte, sehr schnelle Set- und Map-Varianten für Enum-Schlüssel.",
    details: "`EnumSet` und `EnumMap` speichern intern kompakt (Bitfeld bzw. Array) und halten die Elemente in der Reihenfolge der Enum-Konstanten. `EnumSet` wird über Fabrikmethoden wie `of`, `range`, `allOf`, `noneOf` und `complementOf` erzeugt, nicht mit `new`. `EnumMap` braucht im Konstruktor die Klasse des Schlüssel-Enums. Beide erlauben keine `null`-Schlüssel bzw. -Elemente.",
    example: e(`
enum Tag { MO, DI, MI, DO, FR, SA, SO }

EnumSet<Tag> arbeit = EnumSet.range(Tag.MO, Tag.FR);
EnumSet<Tag> frei   = EnumSet.complementOf(arbeit);
System.out.println(arbeit); // [MO, DI, MI, DO, FR]
System.out.println(frei);   // [SA, SO]

EnumMap<Tag, Integer> stunden = new EnumMap<>(Tag.class);
stunden.put(Tag.FR, 6);
stunden.put(Tag.MO, 8);
System.out.println(stunden); // {MO=8, FR=6} (Reihenfolge der Konstanten)
`),
    tip: "Für Enum-Schlüssel sind diese Typen schneller und sparsamer als `HashSet` und `HashMap`.",
    keywords: ['enumset', 'enummap', 'enum sammlung', 'bitfeld', 'collections'],
    related: ['enum', 'Enum mit Feldern und Methoden'],
    mdn: A + 'util/EnumSet.html'
  },
  {
    lang: 'java', group: 'Records, Enums & Sealed Types', name: 'sealed und permits',
    desc: "Beschränkt, welche Klassen einen Typ ableiten oder implementieren dürfen (seit Java 17).",
    details: "Ein `sealed` Typ listet nach `permits` seine erlaubten direkten Untertypen auf; stehen sie in derselben Datei, darf `permits` entfallen. Jeder erlaubte Untertyp muss `final`, `sealed` oder `non-sealed` sein. Mit `non-sealed` öffnet man den Zweig wieder für beliebige Erben. Der Compiler kennt so alle Fälle und prüft `switch` auf Vollständigkeit. Lokale Klassen können nicht `sealed` sein.",
    syntax: "sealed interface X permits A, B { }\nfinal class A implements X { }\nnon-sealed class B implements X { }",
    example: e(`
sealed interface Fahrzeug permits Auto, Fahrrad { }

final class Auto implements Fahrzeug { }                 // abgeschlossen
non-sealed class Fahrrad implements Fahrzeug { }         // wieder offen

class EBike extends Fahrrad { }   // erlaubt, weil Fahrrad non-sealed ist
// class Boot implements Fahrzeug { }   // Fehler: Boot nicht in permits aufgeführt

class Main {
    public static void main(String[] args) {
        Fahrzeug f = new EBike();
        System.out.println(f instanceof Fahrrad);  // true
    }
}
`),
    tip: "Records sind implizit `final` und deshalb ideale Untertypen eines `sealed` Interfaces.",
    keywords: ['versiegelt', 'permits', 'non-sealed', 'java 17', 'geschlossene hierarchie'],
    related: ['Algebraische Datentypen mit sealed und record', 'final bei Klassen und Methoden', 'record'],
    mdn: L + 'jls-8.html#jls-8.1.6'
  },
  {
    lang: 'java', group: 'Records, Enums & Sealed Types', name: 'Algebraische Datentypen mit sealed und record',
    desc: "Geschlossene Fallunterscheidung aus sealed Interface und Records, ausgewertet per switch.",
    details: "Ein `sealed` Interface mit Records als Varianten bildet einen Summentyp: Ein Wert ist genau eine der Varianten. Ein `switch` über den Typ braucht kein `default`, der Compiler meldet fehlende Fälle, sobald man eine Variante hinzufügt. Rekursive Strukturen wie Ausdrucksbäume lassen sich damit knapp und typsicher modellieren. Das ersetzt Visitor-Muster in vielen Fällen.",
    example: e(`
sealed interface Ausdruck permits Zahl, Add, Mul { }
record Zahl(int wert) implements Ausdruck { }
record Add(Ausdruck links, Ausdruck rechts) implements Ausdruck { }
record Mul(Ausdruck links, Ausdruck rechts) implements Ausdruck { }

class Main {
    static int auswerten(Ausdruck a) {
        return switch (a) {                 // ohne default: vollständig
            case Zahl z -> z.wert();
            case Add s  -> auswerten(s.links()) + auswerten(s.rechts());
            case Mul m  -> auswerten(m.links()) * auswerten(m.rechts());
        };
    }

    public static void main(String[] args) {
        Ausdruck a = new Add(new Zahl(2), new Mul(new Zahl(3), new Zahl(4)));
        System.out.println(auswerten(a)); // 14
    }
}
`),
    tip: "Kein `default` in solchen `switch`-Ausdrücken schreiben, sonst verliert man die Vollständigkeitsprüfung.",
    keywords: ['sum type', 'summentyp', 'adt', 'algebraic data type', 'pattern matching', 'switch'],
    related: ['sealed und permits', 'record', 'Record Patterns', 'Pattern Matching für instanceof'],
    mdn: D + 'using-pattern-matching/'
  },
  {
    lang: 'java', group: 'Records, Enums & Sealed Types', name: 'Record Patterns',
    desc: "Zerlegt einen Record in einem Pattern direkt in seine Komponenten (seit Java 21).",
    details: "Ein Record Pattern `Punkt(int x, int y)` prüft den Typ und bindet die Komponenten an Variablen, in `instanceof` wie in `switch`. Patterns lassen sich verschachteln, `var` übernimmt den Komponententyp. Mit `when` fügt man einem `case` eine zusätzliche Bedingung an. Ein `switch` über `Object` braucht einen `default`-Zweig oder ein unbedingtes Muster wie `case Object x`.",
    syntax: "if (obj instanceof Rec(Typ a, var b)) { ... }\ncase Rec(Typ a, Typ b) when bedingung -> ...",
    example: e(`
record Punkt(int x, int y) { }
record Linie(Punkt von, Punkt nach) { }

Object o = new Linie(new Punkt(0, 0), new Punkt(3, 4));

if (o instanceof Linie(Punkt(var x1, var y1), Punkt(int x2, int y2))) {
    System.out.println(x1 + "," + y1 + " bis " + x2 + "," + y2); // 0,0 bis 3,4
}

String text = switch (o) {
    case Punkt(int x, int y) -> "Punkt " + x;
    case Linie(Punkt a, Punkt b) when a.equals(b) -> "Punkt-Linie";
    case Linie l -> "Linie";
    default -> "unbekannt";
};
System.out.println(text); // Linie
`),
    tip: "Reihenfolge der `case`-Zweige beachten: Allgemeinere Muster nach den spezielleren, sonst meldet der Compiler unerreichbaren Code.",
    keywords: ['destructuring', 'dekonstruktion', 'java 21', 'pattern matching', 'switch pattern', 'when'],
    related: ['record', 'Pattern Matching für instanceof', 'Algebraische Datentypen mit sealed und record'],
    mdn: L + 'jls-14.html#jls-14.30'
  },
  {
    lang: 'java', group: 'Records, Enums & Sealed Types', name: 'Pattern Matching für instanceof',
    desc: "Prüft den Typ und bindet die Variable gleich mit, ohne Cast (seit Java 16).",
    details: "Bei `obj instanceof String s` steht `s` bei Erfolg als bereits gecastete Variable zur Verfügung. Ihr Gültigkeitsbereich folgt dem Datenfluss: im `&&`-Teil und im Then-Block, bei negierter Prüfung nach einem Abbruch auch dahinter. `null` ist nie eine Instanz, die Prüfung liefert dann `false`. Das ersetzt das alte Muster aus `instanceof` und anschließendem Cast.",
    syntax: "if (obj instanceof Typ name) { name... }",
    example: e(`
Object o = "Hallo Welt";
if (o instanceof String s && s.length() > 5) {
    System.out.println(s.toUpperCase());   // HALLO WELT
}

Object n = 7;
if (!(n instanceof Integer i)) {
    System.out.println("kein Integer");
} else {
    System.out.println(i * 2);             // 14
}

Object nichts = null;
System.out.println(nichts instanceof String);  // false
`),
    tip: "Mit `&&` kombinieren, nicht mit `||`: Nur bei `&&` ist die Variable im zweiten Teil sicher gebunden.",
    keywords: ['instanceof', 'pattern', 'java 16', 'cast sparen', 'type pattern', 'binding'],
    related: ['Casting von Referenzen', 'Record Patterns', 'Object.getClass()'],
    mdn: L + 'jls-15.html#jls-15.20.2'
  },

  // ---------------- Verschachtelte Klassen ----------------
  {
    lang: 'java', group: 'Verschachtelte Klassen', name: 'Statische verschachtelte Klassen',
    desc: "In einer Klasse deklarierte `static` Klasse ohne Bezug zu einer äußeren Instanz.",
    details: "Eine `static class` innerhalb einer anderen Klasse ist nur ein Namensraum und ein Gruppierungsmittel. Sie braucht kein Objekt der äußeren Klasse und wird mit `Aussen.Innen` angesprochen. Sie darf private statische Mitglieder der äußeren Klasse nutzen und umgekehrt. Typisch: Knoten einer Datenstruktur, Builder, kleine Hilfstypen. Im Zweifel ist sie die bessere Wahl gegenüber einer inneren Klasse.",
    example: e(`
class Liste {
    private Knoten kopf;

    static class Knoten {                // braucht keine Liste-Instanz
        final int wert;
        Knoten naechster;
        Knoten(int wert) { this.wert = wert; }
    }

    void vorne(int wert) {
        Knoten k = new Knoten(wert);
        k.naechster = kopf;
        kopf = k;
    }
    int ersterWert() { return kopf.wert; }
}

class Main {
    public static void main(String[] args) {
        Liste.Knoten k = new Liste.Knoten(5);   // ohne Liste-Objekt
        Liste l = new Liste();
        l.vorne(1);
        l.vorne(2);
        System.out.println(k.wert + " " + l.ersterWert()); // 5 2
    }
}
`),
    tip: "Verschachtelte Typen im Zweifel `static` machen: Ohne `static` hängt jede Instanz an einem äußeren Objekt.",
    keywords: ['nested class', 'static nested', 'builder', 'verschachtelt', 'innere klasse'],
    related: ['Innere Klassen', 'private', 'Lokale Klassen'],
    mdn: L + 'jls-8.html#jls-8.5'
  },
  {
    lang: 'java', group: 'Verschachtelte Klassen', name: 'Innere Klassen',
    desc: "Nicht-statische Klasse in einer Klasse, die an eine äußere Instanz gebunden ist.",
    details: "Jede Instanz einer inneren Klasse (Inner Class) gehört zu einem Objekt der äußeren Klasse und kann dessen Felder und Methoden direkt benutzen, auch private. Erzeugt wird sie über die äußere Instanz: `aussen.new Innen()`. Mit `Aussen.this` greift man bei Namensgleichheit auf die äußere Instanz zu. Die versteckte Referenz kann Speicherlecks verursachen, wenn die innere Instanz länger lebt als die äußere.",
    example: e(`
class Konto {
    private int stand = 100;

    class Buchung {                            // Inner Class
        final int betrag;
        Buchung(int betrag) { this.betrag = betrag; }
        void ausfuehren() { stand += betrag; } // Zugriff auf das äußere Feld
    }

    int stand() { return stand; }
}

class Main {
    public static void main(String[] args) {
        Konto k = new Konto();
        Konto.Buchung b = k.new Buchung(50);   // an k gebunden
        b.ausfuehren();
        b.ausfuehren();
        System.out.println(k.stand());         // 200
    }
}
`),
    tip: "Braucht die innere Klasse keinen Zugriff auf die äußere Instanz, besser `static` verwenden.",
    keywords: ['inner class', 'nicht-statisch', 'aussen.this', 'enclosing instance'],
    related: ['Statische verschachtelte Klassen', 'Lokale Klassen', 'Anonyme Klassen'],
    mdn: L + 'jls-8.html#jls-8.1.3'
  },
  {
    lang: 'java', group: 'Verschachtelte Klassen', name: 'Lokale Klassen',
    desc: "Klasse, die innerhalb einer Methode oder eines Blocks deklariert wird.",
    details: "Eine lokale Klasse ist nur im umgebenden Block sichtbar und trägt keinen Zugriffsmodifikator. Sie darf lokale Variablen und Parameter der Methode lesen, sofern diese final oder effektiv final sind. Das passt, wenn man einen kleinen Helfer genau an einer Stelle braucht. Lokale Records, Enums und Interfaces sind seit Java 16 ebenfalls erlaubt.",
    example: e(`
int faktor = 3;                       // effektiv final

class Vervielfacher {                 // nur in diesem Block sichtbar
    int an(int x) { return x * faktor; }
}

System.out.println(new Vervielfacher().an(5));  // 15

record Paar(int a, int b) { }         // lokaler Record
System.out.println(new Paar(1, 2));   // Paar[a=1, b=2]
`),
    tip: "Ändert man `faktor` später, meldet der Compiler, dass die Variable nicht mehr effektiv final ist.",
    keywords: ['local class', 'methode', 'effektiv final', 'closure', 'erfassen'],
    related: ['Anonyme Klassen', 'Innere Klassen', 'record'],
    mdn: L + 'jls-14.html#jls-14.3'
  },
  {
    lang: 'java', group: 'Verschachtelte Klassen', name: 'Anonyme Klassen',
    desc: "Namenlose Klasse, die direkt bei der Instanziierung definiert wird.",
    details: "Mit `new Typ() { ... }` erzeugt man eine Unterklasse oder Implementierung ohne Namen und davon genau ein Objekt. Das eignet sich für einmalige Implementierungen von Interfaces oder abstrakten Klassen. Für Interfaces mit einer einzigen Methode sind Lambdas kürzer. Anonyme Klassen können Konstruktorargumente der Oberklasse übergeben und haben, anders als Lambdas, ein eigenes `this`.",
    syntax: "Typ x = new Typ(args) {\n  // Überschreibungen\n};",
    example: e(`
interface Gruss { String sage(String name); }

Gruss g = new Gruss() {
    @Override
    public String sage(String name) { return "Hi " + name; }
};
System.out.println(g.sage("Ada"));   // Hi Ada

Comparator<String> nachLaenge = new Comparator<>() {
    @Override
    public int compare(String a, String b) {
        return Integer.compare(a.length(), b.length());
    }
};
List<String> woerter = new ArrayList<>(List.of("ccc", "a", "bb"));
woerter.sort(nachLaenge);
System.out.println(woerter);         // [a, bb, ccc]
`),
    tip: "Bei einem funktionalen Interface ist ein Lambda (`(a, b) -> ...`) fast immer die bessere Wahl.",
    keywords: ['anonymous class', 'namenlos', 'inline', 'new interface', 'lambda alternative'],
    related: ['Funktionale Interfaces', 'Lokale Klassen', 'Innere Klassen'],
    mdn: L + 'jls-15.html#jls-15.9.5'
  },

  // ---------------- Generics ----------------
  {
    lang: 'java', group: 'Generics', name: 'Generische Klassen',
    desc: "Klassen mit Typparametern, die erst bei der Verwendung festgelegt werden.",
    details: "Ein Typparameter wie `<T>` macht eine Klasse für beliebige Typen wiederverwendbar und trotzdem typsicher: Der Compiler prüft Zuweisungen und spart Casts. Üblich sind Einbuchstaben-Namen (`T`, `E`, `K`, `V`). Typargumente müssen Referenztypen sein, also `Integer` statt `int`. Mit dem Diamond-Operator `<>` leitet der Compiler sie beim `new` selbst ab.",
    syntax: "class Name<T> { T feld; }\nName<String> n = new Name<>();",
    example: e(`
class Box<T> {
    private T inhalt;
    void set(T inhalt) { this.inhalt = inhalt; }
    T get() { return inhalt; }
}

class Paar<A, B> {
    final A erstes;
    final B zweites;
    Paar(A erstes, B zweites) { this.erstes = erstes; this.zweites = zweites; }
}

Box<String> box = new Box<>();
box.set("Hallo");
String s = box.get();                  // kein Cast nötig
// box.set(42);                        // Fehler: int cannot be converted to String
System.out.println(s);                 // Hallo

Paar<String, Integer> p = new Paar<>("Alter", 36);
System.out.println(p.erstes + "=" + p.zweites); // Alter=36
`),
    tip: "Für reine Datenpaare ist ein generisches `record Paar<A, B>(A erstes, B zweites)` noch kürzer.",
    keywords: ['generics', 'typparameter', 'diamond', 'typsicher', 'template', 'parametrisierter typ'],
    related: ['Generische Methoden', 'Beschränkte Typparameter', 'Type Erasure', 'record'],
    mdn: L + 'jls-8.html#jls-8.1.2'
  },
  {
    lang: 'java', group: 'Generics', name: 'Generische Methoden',
    desc: "Methoden mit eigenem Typparameter vor dem Rückgabetyp.",
    details: "Der Typparameter steht vor dem Rückgabetyp: `static <T> T erstes(List<T> l)`. Er gilt nur für diese Methode, unabhängig von der Klasse. Meist leitet der Compiler `T` aus den Argumenten ab; in seltenen Fällen gibt man es explizit an (`Collections.<String>emptyList()`). Generische Methoden funktionieren in beliebigen Klassen, auch nicht generischen.",
    syntax: "[static] <T> Rückgabetyp name(T param) { ... }",
    example: e(`
static <T> T erstes(List<T> liste) {
    return liste.get(0);
}

static <T> void tausche(T[] feld, int i, int j) {
    T t = feld[i];
    feld[i] = feld[j];
    feld[j] = t;
}

public static void main(String[] args) {
    System.out.println(erstes(List.of("a", "b")));   // a (T = String)
    Integer[] z = {1, 2, 3};
    tausche(z, 0, 2);
    System.out.println(Arrays.toString(z));          // [3, 2, 1]
    System.out.println(Collections.<String>emptyList().size()); // 0
}
`),
    tip: "Primitive Arrays (`int[]`) passen nicht zu `T[]`; dafür `Integer[]` oder eine eigene Überladung verwenden.",
    keywords: ['generic method', 'typinferenz', 'typparameter', 'static generic'],
    related: ['Generische Klassen', 'Beschränkte Typparameter', 'Wildcards'],
    mdn: L + 'jls-8.html#jls-8.4.4'
  },
  {
    lang: 'java', group: 'Generics', name: 'Beschränkte Typparameter',
    desc: "Schränkt einen Typparameter auf Untertypen eines Typs ein: <T extends Obergrenze>.",
    details: "Mit `T extends Comparable<T>` darf nur ein Typ eingesetzt werden, der diese Fähigkeit besitzt, und im Rumpf stehen deren Methoden zur Verfügung. `extends` gilt dabei auch für Interfaces. Mehrere Schranken verbindet man mit `&`: `<T extends Number & Comparable<T>>`; eine Klasse muss zuerst stehen. Eine untere Schranke gibt es bei Typparametern nicht, nur bei Wildcards (`? super`).",
    syntax: "<T extends Obergrenze>\n<T extends Klasse & Interface1 & Interface2>",
    example: e(`
static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}

static <T extends Number> double doppelt(T n) {
    return n.doubleValue() * 2;       // Number-Methoden verfügbar
}

public static void main(String[] args) {
    System.out.println(max(3, 7));            // 7
    System.out.println(max("pear", "apple")); // pear
    System.out.println(doppelt(2.5));         // 5.0
    System.out.println(doppelt(4));           // 8.0
    // doppelt("text");   // Fehler: String is not within bounds of type variable T
}
`),
    tip: "Bei `Comparable` ist `<T extends Comparable<? super T>>` die allgemeinste Form (so in `Collections.max`).",
    keywords: ['bounded type', 'obergrenze', 'upper bound', 'typschranke', 'extends generics'],
    related: ['Generische Methoden', 'Wildcards', 'Comparable und compareTo'],
    mdn: L + 'jls-4.html#jls-4.4'
  },
  {
    lang: 'java', group: 'Generics', name: 'Wildcards',
    desc: "Platzhalter für unbekannte Typargumente: ?, ? extends T und ? super T.",
    details: "`List<Integer>` ist kein `List<Number>`, Generics sind invariant. `List<? extends Number>` akzeptiert jede Liste von Zahlen, ist aber nur lesbar. `List<? super Integer>` akzeptiert Listen von `Integer` und Obertypen und ist zum Schreiben gedacht. Merkregel PECS: Producer Extends, Consumer Super. `List<?>` steht für eine Liste unbekannten Typs und erlaubt nur lesenden Zugriff als `Object`.",
    values: [
      ['?', 'Beliebiger Typ (nur lesen als Object)'],
      ['? extends T', 'T oder Untertyp: liefert Werte (Producer)'],
      ['? super T', 'T oder Obertyp: nimmt Werte auf (Consumer)']
    ],
    example: e(`
static double summe(List<? extends Number> liste) {   // Producer
    double s = 0;
    for (Number n : liste) s += n.doubleValue();
    return s;
}

static void fuelle(List<? super Integer> ziel) {      // Consumer
    ziel.add(1);
    ziel.add(2);
}

public static void main(String[] args) {
    System.out.println(summe(List.of(1, 2, 3)));      // 6.0
    System.out.println(summe(List.of(1.5, 2.5)));     // 4.0

    List<Object> objekte = new ArrayList<>();
    fuelle(objekte);
    System.out.println(objekte);                      // [1, 2]

    // List<Number> n = new ArrayList<Integer>();     // Fehler: Generics sind invariant
    List<?> unbekannt = List.of("x", 1);
    System.out.println(unbekannt.size());             // 2
}
`),
    tip: "In `List<? extends Number>` kann man nichts (außer `null`) hinzufügen, weil der genaue Typ unbekannt ist.",
    keywords: ['wildcard', 'pecs', 'producer extends consumer super', 'kovarianz', 'kontravarianz', 'invarianz'],
    related: ['Beschränkte Typparameter', 'Generische Methoden', 'Type Erasure'],
    mdn: L + 'jls-4.html#jls-4.5.1'
  },
  {
    lang: 'java', group: 'Generics', name: 'Type Erasure',
    desc: "Generische Typinformationen existieren nur beim Kompilieren, nicht zur Laufzeit.",
    details: "Der Compiler prüft Generics und entfernt die Typargumente danach (Erasure); im Bytecode steht `Object` bzw. die Schranke. Daraus folgen Einschränkungen: kein `new T()`, kein `new T[n]`, kein `instanceof List<String>` auf einem `Object`, keine primitiven Typargumente und keine Überladung, die sich nur im Typargument unterscheidet. Zur Laufzeit sind `List<String>` und `List<Integer>` dieselbe Klasse.",
    example: e(`
List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());  // true

// Object o = a; if (o instanceof List<String>) { }   // Fehler: Cast wäre ungeprüft
// T[] feld = new T[10];                // Fehler: generic array creation
// T objekt = new T();                  // Fehler: T kann nicht instanziiert werden

if (a instanceof List<?>) {              // erlaubt: unbeschränkte Wildcard
    System.out.println("ist eine Liste");
}
`),
    tip: "Braucht man den Typ zur Laufzeit, übergibt man ein `Class<T>`-Argument (`Class<T> typ`).",
    keywords: ['erasure', 'typlöschung', 'bytecode', 'reifiziert', 'reified', 'laufzeit'],
    related: ['Generische Klassen', 'Rohe Typen', 'Wildcards'],
    mdn: L + 'jls-4.html#jls-4.6'
  },
  {
    lang: 'java', group: 'Generics', name: 'Rohe Typen',
    desc: "Generische Klassen ohne Typargument; nur aus Kompatibilitätsgründen vorhanden.",
    details: "Schreibt man `List` statt `List<String>`, schaltet der Compiler die Typprüfung für diese Variable ab und warnt nur (unchecked). Falsche Elemente fallen dann erst beim Lesen als `ClassCastException` auf, weit entfernt vom Fehler. Rohe Typen stammen aus der Zeit vor Java 5 und sollten in neuem Code nicht mehr vorkommen. Ist der Typ egal, nimmt man `List<?>`.",
    example: e(`
List roh = new ArrayList();            // raw type: Warnung statt Fehler
roh.add("Text");
roh.add(42);                           // der Compiler lässt es zu

List<String> strings = roh;            // keine Prüfung des Inhalts
try {
    String s = strings.get(1);         // hier erst knallt es
} catch (ClassCastException ex) {
    System.out.println("ClassCastException beim Lesen");
}
`),
    tip: "Compilerwarnungen wie \"unchecked\" ernst nehmen, sie zeigen genau diese Stellen.",
    keywords: ['raw type', 'unchecked', 'altlast', 'java 5', 'warnung', 'classcastexception'],
    related: ['Generische Klassen', 'Type Erasure', '@SuppressWarnings'],
    mdn: L + 'jls-4.html#jls-4.8'
  },

  // ---------------- Exceptions ----------------
  {
    lang: 'java', group: 'Exceptions', name: 'try / catch',
    desc: "Fängt Ausnahmen ab und behandelt sie, statt das Programm abbrechen zu lassen.",
    details: "Code im `try`-Block wird ausgeführt; wirft er eine Ausnahme, springt die Ausführung zum ersten passenden `catch`. Mehrere `catch`-Blöcke prüft Java von oben nach unten, deshalb müssen spezielle Typen vor allgemeinen stehen. Danach läuft das Programm hinter dem `try`-Statement weiter. Leere `catch`-Blöcke verschlucken Fehler und sollten vermieden werden.",
    syntax: "try {\n  ...\n} catch (ExceptionTyp e) {\n  ...\n}",
    example: e(`
try {
    int n = Integer.parseInt("abc");
    System.out.println(n);              // wird nicht erreicht
} catch (NumberFormatException ex) {
    System.out.println("Keine Zahl: " + ex.getMessage());
    // Keine Zahl: For input string: "abc"
}
System.out.println("weiter");           // weiter
`),
    tip: "Nicht pauschal `catch (Exception e)` verwenden; lieber den konkreten Typ, den man auch wirklich behandeln kann.",
    keywords: ['ausnahme', 'fehlerbehandlung', 'exception handling', 'abfangen', 'catch'],
    related: ['finally', 'throw', 'Multi-catch', 'Checked und Unchecked Exceptions'],
    mdn: L + 'jls-14.html#jls-14.20'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'finally',
    desc: "Block, der nach try und catch immer ausgeführt wird, für Aufräumarbeiten.",
    details: "Der `finally`-Block läuft auch dann, wenn im `try` eine Ausnahme fliegt, nicht gefangen wird oder ein `return` erfolgt. Er eignet sich zum Freigeben von Ressourcen, doch dafür ist `try-with-resources` meist besser. Ein `return` oder `throw` in `finally` überschreibt das Ergebnis des `try` und verschluckt Ausnahmen; das sollte man nie tun. Nur ein Programmende (`System.exit`) verhindert `finally`.",
    example: e(`
try {
    System.out.println("try");
    throw new IllegalStateException("kaputt");
} catch (IllegalStateException ex) {
    System.out.println("catch " + ex.getMessage());
} finally {
    System.out.println("finally");      // läuft immer
}
// try, catch kaputt, finally
`),
    tip: "Kein `return` im `finally`: Es würde eine ausgelöste Exception stillschweigend verwerfen.",
    keywords: ['aufräumen', 'cleanup', 'immer ausführen', 'ressource freigeben'],
    related: ['try / catch', 'try-with-resources', 'throw'],
    mdn: L + 'jls-14.html#jls-14.20.2'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'throw',
    desc: "Löst eine Ausnahme aus, indem ein Exception-Objekt geworfen wird.",
    details: "`throw` wirft ein Objekt vom Typ `Throwable`, meist mit `new` erzeugt und mit einer aussagekräftigen Nachricht. Die Methode wird sofort verlassen und die Ausnahme steigt den Aufrufstapel hoch, bis ein passendes `catch` sie fängt. Mit `throw ex;` in einem `catch` lässt sich eine Ausnahme weiterwerfen. Eine geprüfte Ausnahme muss zusätzlich per `throws` deklariert werden.",
    syntax: "throw new ExceptionTyp(\"Nachricht\");",
    example: e(`
static void setzeAlter(int alter) {
    if (alter < 0) {
        throw new IllegalArgumentException("Alter negativ: " + alter);
    }
}

public static void main(String[] args) {
    try {
        setzeAlter(-1);
    } catch (IllegalArgumentException ex) {
        System.out.println(ex.getMessage()); // Alter negativ: -1
    }
}
`),
    tip: "`throw` (Anweisung, wirft) und `throws` (Deklaration in der Signatur) nicht verwechseln.",
    keywords: ['werfen', 'auslösen', 'exception werfen', 'rethrow', 'weiterwerfen'],
    related: ['throws', 'try / catch', 'Eigene Exceptions'],
    mdn: L + 'jls-14.html#jls-14.18'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'throws',
    desc: "Deklariert in der Methodensignatur, welche geprüften Ausnahmen entstehen können.",
    details: "Wirft eine Methode eine geprüfte Ausnahme und fängt sie nicht selbst, muss sie `throws` angeben. Aufrufer müssen sie dann behandeln oder ebenfalls weiterreichen. Mehrere Typen trennt man mit Kommas. Bei Unchecked Exceptions ist `throws` erlaubt, aber nicht nötig. Überschreibende Methoden dürfen nicht mehr geprüfte Ausnahmen deklarieren als die überschriebene.",
    syntax: "Rückgabetyp name(...) throws ExceptionA, ExceptionB { ... }",
    example: e(`
static String lies(String pfad) throws IOException {
    return Files.readString(Path.of(pfad));
}

public static void main(String[] args) {
    try {
        lies("gibt-es-nicht.txt");
    } catch (IOException ex) {
        System.out.println(ex.getClass().getSimpleName()); // NoSuchFileException
    }
}
`),
    tip: "`throws Exception` in jeder Signatur ist bequem, nimmt dem Aufrufer aber jede Information darüber, was schiefgehen kann.",
    keywords: ['deklarieren', 'geprüfte exception', 'signatur', 'weiterreichen'],
    related: ['throw', 'Checked und Unchecked Exceptions', 'try / catch'],
    mdn: L + 'jls-8.html#jls-8.4.6'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'try-with-resources',
    desc: "Schließt Ressourcen am Blockende automatisch, auch bei Ausnahmen.",
    details: "Im Kopf von `try (...)` deklarierte Objekte, die `AutoCloseable` implementieren, werden am Ende in umgekehrter Reihenfolge geschlossen. Das ersetzt umständliche `finally`-Konstruktionen. Tritt im Block und beim Schließen je ein Fehler auf, bleibt der erste erhalten und der zweite hängt als suppressed an (`getSuppressed()`). Seit Java 9 genügt eine effektiv finale Variable im Kopf: `try (reader)`.",
    syntax: "try (Typ r = new Typ(); Typ2 r2 = ...) {\n  ...\n}",
    example: e(`
try (BufferedReader br = new BufferedReader(new StringReader("erste\\nzweite"))) {
    String zeile;
    while ((zeile = br.readLine()) != null) {
        System.out.println(zeile);       // erste, dann zweite
    }
}   // br.close() läuft automatisch

BufferedReader r2 = new BufferedReader(new StringReader("x"));
try (r2) {                               // seit Java 9: vorhandene Variable
    System.out.println(r2.readLine());   // x
}
`),
    tip: "Für Dateien, Streams und Verbindungen immer `try-with-resources` verwenden. Einen `Scanner` auf `System.in` nicht schließen, sonst ist die Standardeingabe zu.",
    keywords: ['ressourcen', 'close', 'autoclosable', 'stream schließen', 'twr', 'suppressed'],
    related: ['AutoCloseable', 'finally', 'try / catch'],
    mdn: L + 'jls-14.html#jls-14.20.3'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'AutoCloseable',
    desc: "Interface mit close(); Voraussetzung für die Nutzung in try-with-resources.",
    details: "Eine Klasse, die `AutoCloseable` implementiert, muss `close()` bereitstellen, das `throws Exception` deklarieren darf. Die Methode kann enger gefasst werden, etwa ganz ohne `throws`, was den Aufrufer entlastet. `Closeable` (für I/O) ist eine Spezialisierung, deren `close()` eine `IOException` werfen darf und die mehrfaches Schließen folgenlos erlauben soll. `close()` sollte idempotent sein.",
    syntax: "class X implements AutoCloseable {\n  public void close() { ... }\n}",
    example: e(`
class Ressource implements AutoCloseable {
    final String name;
    Ressource(String name) {
        this.name = name;
        System.out.println("öffne " + name);
    }
    @Override
    public void close() {                // ohne throws: Aufrufer muss nichts fangen
        System.out.println("schließe " + name);
    }
}

try (Ressource a = new Ressource("A"); Ressource b = new Ressource("B")) {
    System.out.println("arbeite");
}
// öffne A, öffne B, arbeite, schließe B, schließe A
`),
    tip: "Geschlossen wird in umgekehrter Reihenfolge der Deklaration; die zuletzt geöffnete Ressource zuerst.",
    keywords: ['closeable', 'close', 'ressource', 'autoclosable'],
    related: ['try-with-resources', 'finally', 'interface'],
    mdn: A + 'lang/AutoCloseable.html'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'Multi-catch',
    desc: "Fängt mehrere Ausnahmetypen in einem catch-Block mit | ab.",
    details: "Mit `catch (A | B e)` behandelt man verschiedene Typen gleich, ohne den Code zu wiederholen. Die Alternativen dürfen nicht in einer Vererbungsbeziehung stehen, sonst meldet der Compiler einen Fehler. Die Variable `e` ist implizit `final` und hat den gemeinsamen Obertyp. Steht eine Unterklasse nach ihrer Oberklasse in einem eigenen `catch`, ist das ebenfalls ein Fehler (unerreichbar).",
    syntax: "catch (TypA | TypB e) { ... }",
    example: e(`
String[] eingaben = { "12", "x", null };

for (String s : eingaben) {
    try {
        System.out.println(Integer.parseInt(s.trim()) * 2);
    } catch (NumberFormatException | NullPointerException ex) {
        System.out.println("ungültig: " + ex.getClass().getSimpleName());
    }
}
// 24
// ungültig: NumberFormatException
// ungültig: NullPointerException
`),
    tip: "Bei unterschiedlicher Behandlung besser getrennte `catch`-Blöcke schreiben.",
    keywords: ['mehrere exceptions', 'oder', 'pipe', 'catch mehrere'],
    related: ['try / catch', 'Exception-Hierarchie', 'Häufige Exceptions'],
    mdn: L + 'jls-14.html#jls-14.20'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'Checked und Unchecked Exceptions',
    desc: "Geprüfte Ausnahmen erzwingt der Compiler zu behandeln, ungeprüfte (RuntimeException) nicht.",
    details: "Checked Exceptions sind alle `Exception`s außer `RuntimeException` und ihren Unterklassen, z. B. `IOException`. Sie müssen gefangen oder per `throws` weitergereicht werden. Unchecked Exceptions (`RuntimeException`, `Error`) zeigen meist Programmierfehler an wie `NullPointerException` oder `IllegalArgumentException`. Faustregel: geprüft, wenn der Aufrufer sinnvoll reagieren kann, sonst ungeprüft.",
    values: [
      ['Checked', 'Exception und Unterklassen (außer RuntimeException): Behandlungspflicht'],
      ['Unchecked', 'RuntimeException und Error: keine Pflicht'],
      ['Beispiele checked', 'IOException, SQLException, InterruptedException'],
      ['Beispiele unchecked', 'NullPointerException, IllegalArgumentException, ArithmeticException']
    ],
    example: e(`
try {
    Files.readString(Path.of("fehlt.txt"));          // IOException: Pflicht zu behandeln
} catch (IOException ex) {
    System.out.println("checked: " + ex.getClass().getSimpleName());
}

try {
    Object o = "x";
    Integer i = (Integer) o;                          // ClassCastException: freiwillig
} catch (RuntimeException ex) {
    System.out.println("unchecked: " + ex.getClass().getSimpleName());
}

Exception ex = new IOException("test");
System.out.println(ex instanceof RuntimeException);   // false
`),
    tip: "Checked Exceptions in Lambdas sind lästig; dort verpackt man sie oft in eine `RuntimeException` (mit `cause`).",
    keywords: ['geprüft', 'ungeprüft', 'runtimeexception', 'checked', 'unchecked', 'behandlungspflicht'],
    related: ['throws', 'Exception-Hierarchie', 'Eigene Exceptions'],
    mdn: L + 'jls-11.html#jls-11.1.1'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'Eigene Exceptions',
    desc: "Eigene Ausnahmeklassen durch Ableiten von Exception oder RuntimeException.",
    details: "Eine eigene Exception leitet man von `Exception` (geprüft) oder `RuntimeException` (ungeprüft) ab. Üblich sind Konstruktoren für Nachricht und für Nachricht mit `cause`. Zusätzliche Felder tragen fachliche Details, zum Beispiel einen Fehlerbetrag. Der Name endet per Konvention auf `Exception`. Lieber vorhandene Typen wie `IllegalArgumentException` nutzen, wenn sie die Situation schon gut beschreiben.",
    example: e(`
class KontoLeerException extends Exception {          // geprüft
    final double fehlbetrag;
    KontoLeerException(String nachricht, double fehlbetrag) {
        super(nachricht);
        this.fehlbetrag = fehlbetrag;
    }
}

class Konto {
    double stand = 50;
    void abheben(double betrag) throws KontoLeerException {
        if (betrag > stand) {
            throw new KontoLeerException("Nicht genug Geld", betrag - stand);
        }
        stand -= betrag;
    }
}

try {
    new Konto().abheben(80);
} catch (KontoLeerException ex) {
    System.out.println(ex.getMessage() + ", es fehlen " + ex.fehlbetrag);
    // Nicht genug Geld, es fehlen 30.0
}
`),
    tip: "Beim Umwandeln einer Ausnahme immer die ursprüngliche als `cause` mitgeben, sonst geht die Fehlerursache verloren.",
    keywords: ['custom exception', 'benutzerdefinierte ausnahme', 'ableiten', 'fachliche exception'],
    related: ['Checked und Unchecked Exceptions', 'throw', 'Stack Trace und cause'],
    mdn: D + 'exceptions/'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'Exception-Hierarchie',
    desc: "Alle Ausnahmen stammen von Throwable ab; Error und Exception sind die zwei Zweige.",
    details: "`Throwable` ist die Wurzel. `Error` steht für schwere Probleme der JVM wie `OutOfMemoryError` oder `StackOverflowError`, die man normalerweise nicht fängt. `Exception` umfasst behebbare Fälle, mit `RuntimeException` als ungeprüftem Unterzweig. In `catch (Exception e)` landen keine `Error`; fängt man `Throwable`, schon. Ein `catch` für eine Oberklasse fängt auch alle Unterklassen.",
    values: [
      ['Throwable', 'Wurzel, hat Nachricht, cause und Stack Trace'],
      ['Error', 'JVM-Probleme: OutOfMemoryError, StackOverflowError'],
      ['Exception', 'Behebbare Fehler (geprüft)'],
      ['RuntimeException', 'Programmierfehler (ungeprüft)']
    ],
    example: e(`
static int tiefe(int n) {
    return tiefe(n + 1) + 1;         // endlose Rekursion
}

public static void main(String[] args) {
    try {
        tiefe(0);
    } catch (StackOverflowError err) {
        System.out.println("Error: " + err.getClass().getSimpleName()); // StackOverflowError
    }

    Throwable t = new IllegalStateException("x");
    System.out.println(t instanceof RuntimeException);  // true
    System.out.println(t instanceof Exception);         // true
    System.out.println(t instanceof Error);             // false
}
`),
    tip: "Ein `catch (Throwable t)` hält auch Speicher- und Stack-Fehler auf; das gehört höchstens in die oberste Ebene eines Programms.",
    keywords: ['throwable', 'error', 'exception', 'runtimeexception', 'hierarchie', 'stackoverflowerror'],
    related: ['Checked und Unchecked Exceptions', 'try / catch', 'Häufige Exceptions'],
    mdn: A + 'lang/Throwable.html'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'Häufige Exceptions',
    desc: "NullPointerException, IllegalArgumentException und weitere typische Laufzeitfehler im Überblick.",
    details: "Die meisten Fehler im Alltag sind ungeprüfte Ausnahmen. `NullPointerException` entsteht beim Zugriff auf `null`; seit Java 15 nennt die Meldung standardmäßig, was genau `null` war. `IllegalArgumentException` und `IllegalStateException` meldet man selbst bei falschen Argumenten bzw. falschem Objektzustand. `ConcurrentModificationException` droht, wenn man eine Sammlung während der Iteration verändert.",
    values: [
      ['NullPointerException', 'Zugriff auf null'],
      ['ArrayIndexOutOfBoundsException', 'Ungültiger Array-Index'],
      ['ClassCastException', 'Falscher Cast'],
      ['ArithmeticException', 'Ganzzahldivision durch 0'],
      ['NumberFormatException', 'String lässt sich nicht in Zahl wandeln'],
      ['UnsupportedOperationException', 'Veränderung an unveränderlicher Sammlung'],
      ['NoSuchElementException', 'Kein (weiteres) Element vorhanden'],
      ['ConcurrentModificationException', 'Änderung während der Iteration'],
      ['IllegalArgumentException / IllegalStateException', 'Falsches Argument / falscher Zustand']
    ],
    example: e(`
List<Runnable> faelle = List.of(
    () -> { String s = null; s.length(); },
    () -> { int[] a = new int[2]; a[2] = 1; },
    () -> { Object o = "x"; Integer i = (Integer) o; },
    () -> { int zero = 0; int r = 1 / zero; },
    () -> Integer.parseInt("abc"),
    () -> List.of(1).add(2),
    () -> new ArrayList<Integer>().iterator().next(),
    () -> { List<Integer> l = new ArrayList<>(List.of(1, 2, 3)); for (Integer i : l) l.remove(i); }
);

for (Runnable fall : faelle) {
    try {
        fall.run();
    } catch (RuntimeException ex) {
        System.out.println(ex.getClass().getSimpleName());
    }
}
// NullPointerException, ArrayIndexOutOfBoundsException, ClassCastException,
// ArithmeticException, NumberFormatException, UnsupportedOperationException,
// NoSuchElementException, ConcurrentModificationException
`),
    tip: "Null-Fehler früh abfangen mit `Objects.requireNonNull(x, \"Nachricht\")` oder `Optional`, statt später zu suchen.",
    keywords: ['nullpointerexception', 'npe', 'arrayindexoutofbounds', 'illegalargumentexception', 'classcastexception', 'arithmeticexception', 'numberformatexception', 'laufzeitfehler'],
    related: ['Checked und Unchecked Exceptions', 'Exception-Hierarchie', 'Stack Trace und cause'],
    mdn: A + 'lang/NullPointerException.html'
  },
  {
    lang: 'java', group: 'Exceptions', name: 'Stack Trace und cause',
    desc: "Aufrufkette zum Fehlerort und die ursprüngliche Ursache einer umgewandelten Ausnahme.",
    details: "Jede Ausnahme trägt einen Stack Trace mit den Aufrufen bis zum Entstehungsort; der oberste Eintrag ist die Stelle des `new`. Mit `new Ex(\"Text\", ursache)` verkettet man Ausnahmen, `getCause()` liefert die ursprüngliche. `printStackTrace()` schreibt den Trace samt `Caused by:` auf `System.err`. Beim Umwandeln einer Ausnahme darf die Ursache nie verloren gehen, sonst fehlt der entscheidende Hinweis.",
    syntax: "throw new RuntimeException(\"Text\", ursache);\nex.getCause();  ex.getStackTrace();  ex.printStackTrace();",
    example: e(`
static void lesen() {
    try {
        Integer.parseInt("x");
    } catch (NumberFormatException ex) {
        throw new IllegalStateException("Konfiguration ungültig", ex);  // Ursache mitgeben
    }
}

public static void main(String[] args) {
    try {
        lesen();
    } catch (IllegalStateException ex) {
        System.out.println(ex.getMessage());                             // Konfiguration ungültig
        System.out.println(ex.getCause().getClass().getSimpleName());    // NumberFormatException
        System.out.println(ex.getStackTrace()[0].getMethodName());       // lesen
        // ex.printStackTrace();   // vollständiger Trace samt "Caused by:" auf System.err
    }
}
`),
    tip: "Exceptions mit einem Logger ausgeben (`logger.error(\"Text\", ex)`), nicht nur `ex.getMessage()`; der Trace enthält die Fehlerstelle.",
    keywords: ['stacktrace', 'cause', 'getcause', 'caused by', 'printstacktrace', 'verketten', 'chaining'],
    related: ['throw', 'Eigene Exceptions', 'try / catch'],
    mdn: A + 'lang/Throwable.html#getCause()'
  },

  // ---------------- Annotationen ----------------
  {
    lang: 'java', group: 'Annotationen', name: 'Annotationen benutzen',
    desc: "Metadaten mit @Name an Klassen, Methoden, Parametern oder Variablen.",
    details: "Annotationen ändern den Code nicht direkt, sondern liefern Informationen für Compiler, Werkzeuge und Frameworks, teils auch zur Laufzeit per Reflection. Elemente gibt man mit `@Name(schlüssel = wert)` an, bei nur einem Element `value` genügt `@Name(wert)`. Arrays schreibt man in geschweiften Klammern. Annotationen dürfen mehrfach nebeneinander stehen.",
    syntax: "@Name\n@Name(wert)\n@Name(a = 1, b = \"text\")",
    example: e(`
static class Basis {
    @Deprecated(since = "2.0")
    void alt() { System.out.println("alt"); }
}

static class Kind extends Basis {
    @Override                                              // prüft das Überschreiben
    @SuppressWarnings({"deprecation", "unused"})           // Array von Werten
    void alt() { System.out.println("Kind.alt"); }
}

public static void main(String[] args) {
    new Kind().alt();                    // Kind.alt
    Basis b = new Kind();
    b.alt();                             // Kind.alt
}
`),
    tip: "Die wichtigsten eingebauten sind `@Override`, `@Deprecated`, `@SuppressWarnings`, `@FunctionalInterface` und `@SafeVarargs`.",
    keywords: ['annotation', 'metadaten', 'at-zeichen', '@', 'reflection', 'processing'],
    related: ['@Override', '@Deprecated', '@SuppressWarnings', 'Eigene Annotationen'],
    mdn: D + 'annotations/'
  },
  {
    lang: 'java', group: 'Annotationen', name: '@Deprecated',
    desc: "Markiert Klassen, Methoden oder Felder als veraltet; der Compiler warnt bei Benutzung.",
    details: "`@Deprecated` signalisiert, dass es einen besseren Weg gibt. Mit `since` gibt man die Version an, mit `forRemoval = true`, dass das Element bald entfernt wird; dann warnt der Compiler deutlicher. Zusätzlich gehört ein Javadoc-Hinweis `@deprecated` mit Alternative dazu. Innerhalb derselben äußersten Klasse erscheint keine Warnung.",
    syntax: "@Deprecated(since = \"1.2\", forRemoval = true)",
    example: e(`
static class Rechner {
    /** @deprecated Stattdessen {@link #addiere(int, int)} verwenden. */
    @Deprecated(since = "2.0", forRemoval = true)
    int addiereAlt(int a, int b) { return a + b; }

    int addiere(int a, int b) { return a + b; }       // Nachfolger
}

public static void main(String[] args) {
    Rechner r = new Rechner();
    System.out.println(r.addiereAlt(1, 2));    // 3 (Aufrufer außerhalb der Klasse bekämen eine Warnung)
    System.out.println(r.addiere(1, 2));       // 3
}
`),
    tip: "Veraltetes nicht sofort löschen: erst `@Deprecated` mit Hinweis auf den Ersatz, dann in einer späteren Version entfernen.",
    keywords: ['veraltet', 'deprecated', 'forremoval', 'since', 'abkündigung', 'obsolet'],
    related: ['Annotationen benutzen', '@SuppressWarnings', 'Methoden überschreiben'],
    mdn: A + 'lang/Deprecated.html'
  },
  {
    lang: 'java', group: 'Annotationen', name: '@SuppressWarnings',
    desc: "Unterdrückt bestimmte Compilerwarnungen an einem Element.",
    details: "Der Wert nennt die zu unterdrückenden Warnungen, z. B. `\"unchecked\"`, `\"rawtypes\"`, `\"deprecation\"` oder `\"unused\"`. Die Annotation sollte so eng wie möglich stehen, am besten an einer einzelnen Variablendeklaration statt an der ganzen Klasse. Setzt man sie, sollte man sicher sein, dass der Code tatsächlich korrekt ist, und das kurz kommentieren. Welche Namen gültig sind, hängt vom Compiler ab.",
    syntax: "@SuppressWarnings(\"unchecked\")\n@SuppressWarnings({\"unchecked\", \"rawtypes\"})",
    example: e(`
Object o = new ArrayList<String>(List.of("a"));

@SuppressWarnings("unchecked")        // bewusst: wir wissen, dass es Strings sind
List<String> liste = (List<String>) o;

System.out.println(liste.get(0));     // a
`),
    tip: "Pauschales `@SuppressWarnings(\"all\")` verdeckt echte Probleme; Warnung gezielt benennen.",
    keywords: ['warnung', 'unchecked', 'rawtypes', 'unterdrücken', 'compiler warning'],
    related: ['Rohe Typen', '@Deprecated', '@SafeVarargs'],
    mdn: A + 'lang/SuppressWarnings.html'
  },
  {
    lang: 'java', group: 'Annotationen', name: '@SafeVarargs',
    desc: "Erklärt eine Methode mit generischem Varargs-Parameter als typsicher.",
    details: "Varargs mit generischem Typ (`T... elemente`) erzeugen ein Array und lösen die Warnung \"possible heap pollution\" aus. Mit `@SafeVarargs` bestätigt man, dass die Methode das Array nicht unsicher verwendet, also nichts hineinschreibt und es nicht nach außen gibt. Erlaubt ist die Annotation nur bei `static`, `final` und `private` Methoden sowie bei Konstruktoren, weil sie dort nicht überschrieben werden können.",
    example: e(`
@SafeVarargs
static <T> List<T> listeVon(T... elemente) {
    return new ArrayList<>(Arrays.asList(elemente));
}

public static void main(String[] args) {
    List<String> l = listeVon("a", "b", "c");
    System.out.println(l);          // [a, b, c]
}
`),
    tip: "Ohne `@SafeVarargs` bekommt jeder Aufrufer eine \"unchecked\"-Warnung; mit der Annotation steht die Zusicherung an einer Stelle.",
    keywords: ['varargs', 'heap pollution', 'generics varargs', 'typ-sicherheit'],
    related: ['@SuppressWarnings', 'Generische Methoden', 'Type Erasure'],
    mdn: A + 'lang/SafeVarargs.html'
  },
  {
    lang: 'java', group: 'Annotationen', name: 'Eigene Annotationen',
    desc: "Definiert eigene Annotationstypen mit @interface und steuert Lebensdauer und Einsatzort.",
    details: "Eine Annotation deklariert man mit `@interface`; ihre Elemente sehen wie Methoden ohne Parameter aus und können Standardwerte mit `default` haben. `@Retention` bestimmt, wie lange sie existiert: `SOURCE` (nur Quelltext), `CLASS` (Standard, im Bytecode) oder `RUNTIME` (per Reflection lesbar). `@Target` beschränkt, wo sie stehen darf, z. B. `METHOD` oder `TYPE`. Elementtypen sind auf Primitive, `String`, `Class`, Enums, Annotationen und Arrays davon beschränkt.",
    syntax: "@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\n@interface Name { Typ element() default wert; }",
    example: e(`
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)      // zur Laufzeit lesbar
@Target(ElementType.METHOD)              // nur an Methoden erlaubt
@interface Info {
    String value();
    int prio() default 1;
}

static class Dienst {
    @Info(value = "startet den Dienst", prio = 2)
    public void start() { }

    @Info("stoppt")
    public void stopp() { }
}

public static void main(String[] args) throws Exception {
    Info i = Dienst.class.getMethod("start").getAnnotation(Info.class);
    System.out.println(i.value() + " / " + i.prio());   // startet den Dienst / 2
    System.out.println(Dienst.class.getMethod("stopp").getAnnotation(Info.class).prio()); // 1
}
`),
    tip: "Ohne `@Retention(RUNTIME)` ist die Annotation per Reflection unsichtbar, ein häufiger Grund für \"funktioniert nicht\".",
    keywords: ['annotation definieren', '@interface', 'retention', 'target', 'meta-annotation', 'reflection', 'runtime'],
    related: ['Annotationen benutzen', 'Marker-Interfaces', '@Override'],
    mdn: L + 'jls-9.html#jls-9.6'
  }
  );
})();
