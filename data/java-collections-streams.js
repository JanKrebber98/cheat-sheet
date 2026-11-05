window.CHEAT = window.CHEAT || [];
(function () {
  var A = 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/';
  var D = 'https://dev.java/learn/';
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }
  var G1 = 'Collections im Überblick';
  var G2 = 'Listen';
  var G3 = 'Maps';
  var G4 = 'Sets & Queues';
  var G5 = 'Lambdas & Funktionale Interfaces';
  var G6 = 'Streams';
  var G7 = 'Collectors';

  window.CHEAT.push(
  // ---------------- Collections im Überblick ----------------
  {
    lang: 'java', group: G1, name: 'Collection-Framework',
    desc: "Die Standardbibliothek für Listen, Mengen, Maps und Warteschlangen im Paket `java.util`.",
    details: "Das Framework besteht aus Interfaces (`List`, `Set`, `Queue`, `Deque`, `Map`) und mehreren Implementierungen mit unterschiedlichen Eigenschaften. Man deklariert Variablen nach Möglichkeit mit dem Interface-Typ (`List<String>`) und wählt die Implementierung nur bei der Erzeugung. `Map` gehört zum Framework, ist aber kein Untertyp von `Collection`. Collections speichern nur Objekte; für `int` wird automatisch `Integer` verwendet (Autoboxing).",
    syntax: "List<String> liste = new ArrayList<>();",
    values: [
      ['ArrayList', 'Liste auf Array-Basis, schneller Zugriff per Index (Standardwahl)'],
      ['LinkedList', 'Doppelt verkettete Liste, auch als Queue/Deque nutzbar'],
      ['HashSet', 'Menge ohne Duplikate, keine feste Reihenfolge'],
      ['LinkedHashSet', 'Menge in Einfügereihenfolge'],
      ['TreeSet', 'Menge, sortiert (Comparable oder Comparator)'],
      ['HashMap', 'Schlüssel-Wert-Paare, keine feste Reihenfolge'],
      ['LinkedHashMap', 'Map in Einfüge- oder Zugriffsreihenfolge'],
      ['TreeMap', 'Map, nach Schlüsseln sortiert'],
      ['ArrayDeque', 'Stack und Queue, schneller als LinkedList'],
      ['PriorityQueue', 'Queue, die immer das kleinste Element zuerst liefert']
    ],
    example: e(`
List<String> liste = new ArrayList<>(List.of("b", "a", "b"));
Set<String> menge = new TreeSet<>(liste);
Map<String, Integer> zaehler = new LinkedHashMap<>();
for (String s : liste) zaehler.merge(s, 1, Integer::sum);
Deque<Integer> stapel = new ArrayDeque<>();
stapel.push(1);
stapel.push(2);

System.out.println(liste);       // [b, a, b]
System.out.println(menge);       // [a, b]
System.out.println(zaehler);     // {b=2, a=1}
System.out.println(stapel.pop()); // 2
`),
    tip: "Im Zweifel `ArrayList`, `HashMap` und `HashSet`. Sortiert oder in Einfügereihenfolge nur, wenn man es wirklich braucht.",
    keywords: ['collections', 'framework', 'sammlung', 'datenstruktur', 'liste', 'menge', 'map', 'überblick', 'java.util'],
    related: ['List', 'Set', 'Map', 'Queue', 'Deque'],
    mdn: A + 'util/package-summary.html'
  },
  {
    lang: 'java', group: G1, name: 'Iterable und Iterator',
    desc: "`Iterable` macht ein Objekt for-each-fähig, der `Iterator` läuft über die Elemente.",
    details: "Jede `Collection` ist ein `Iterable`. Die erweiterte for-Schleife ruft dahinter `iterator()` auf. Mit `hasNext()` und `next()` läuft man manuell durch, `Iterator.remove()` entfernt das zuletzt gelieferte Element sicher während der Iteration. Eigene Klassen können `Iterable<T>` implementieren, um in for-each verwendet zu werden.",
    syntax: "Iterator<T> it = collection.iterator();\nwhile (it.hasNext()) { T x = it.next(); }",
    example: e(`
List<String> namen = new ArrayList<>(List.of("Ada", "Linus", "Grace"));

for (String n : namen) System.out.println(n);   // Ada, Linus, Grace

Iterator<String> it = namen.iterator();
while (it.hasNext()) {
    if (it.next().length() > 3) it.remove();   // sicheres Entfernen
}
System.out.println(namen);   // [Ada]
`),
    tip: "Entfernen während einer for-each-Schleife kann `ConcurrentModificationException` werfen; stattdessen `Iterator.remove()` oder `removeIf()` nutzen.",
    keywords: ['iterator', 'iterable', 'for-each', 'schleife', 'durchlaufen', 'hasNext', 'next'],
    related: ['ConcurrentModificationException', 'List.removeIf()', 'List.forEach()'],
    mdn: A + 'util/Iterator.html'
  },
  {
    lang: 'java', group: G1, name: 'Comparator',
    desc: "Legt eine Sortierreihenfolge für Objekte fest, ohne die Klasse selbst zu ändern.",
    details: "Ein `Comparator<T>` liefert über `compare(a, b)` eine negative Zahl, 0 oder eine positive Zahl. Es gibt fertige Bausteine: `naturalOrder()`, `reverseOrder()`, `comparing()`, `thenComparing()`, `reversed()`, `nullsFirst()`. Die natürliche Ordnung einer Klasse kommt dagegen aus `Comparable.compareTo()`. Wer in `compare` einfach `a - b` rechnet, riskiert Überläufe; besser `Integer.compare(a, b)`.",
    syntax: "Comparator<T> c = Comparator.comparing(T::getter);",
    example: e(`
List<String> w = new ArrayList<>(List.of("Birne", "Kiwi", "Apfel"));

w.sort(Comparator.naturalOrder());
System.out.println(w);   // [Apfel, Birne, Kiwi]

w.sort(Comparator.comparing(String::length).thenComparing(Comparator.reverseOrder()));
System.out.println(w);   // [Kiwi, Birne, Apfel]

Comparator<String> eigener = (a, b) -> Integer.compare(b.length(), a.length());
w.sort(eigener);         // längste zuerst
`),
    tip: "`Comparator.comparing(...).reversed()` dreht die ganze Kette um; für nur ein Kriterium `thenComparing(..., Comparator.reverseOrder())` verwenden.",
    keywords: ['comparator', 'comparable', 'sortieren', 'vergleichen', 'compare', 'compareTo', 'reihenfolge', 'ordnung'],
    related: ['Comparator.comparing()', 'List.sort()', 'Collections.sort()', 'TreeSet'],
    mdn: A + 'util/Comparator.html'
  },
  {
    lang: 'java', group: G1, name: 'Comparator.comparing()',
    desc: "Baut einen Comparator aus einer Schlüsselfunktion, z. B. einem Getter.",
    details: "`Comparator.comparing(Person::name)` vergleicht Objekte anhand des extrahierten Schlüssels, der `Comparable` sein muss. Für primitive Schlüssel gibt es `comparingInt`, `comparingLong` und `comparingDouble`, die Boxing vermeiden. Mit `thenComparing()` hängt man weitere Kriterien an, mit `reversed()` kehrt man die Richtung um.",
    syntax: "Comparator.comparing(Function<T, U> schluessel)\nComparator.comparing(Function<T, U> schluessel, Comparator<U> vergleich)",
    example: e(`
record Person(String name, int alter) {}

List<Person> l = new ArrayList<>(List.of(
    new Person("Ada", 36), new Person("Linus", 28), new Person("Grace", 36)));

l.sort(Comparator.comparingInt(Person::alter).reversed().thenComparing(Person::name));
System.out.println(l.stream().map(Person::name).toList());   // [Ada, Grace, Linus]
`),
    tip: "Bei möglichen `null`-Schlüsseln `Comparator.nullsFirst(...)` oder `nullsLast(...)` einsetzen, sonst gibt es eine `NullPointerException`.",
    keywords: ['comparing', 'comparingInt', 'thenComparing', 'reversed', 'sortieren nach feld', 'getter'],
    related: ['Comparator', 'List.sort()', 'Stream.sorted()'],
    mdn: A + 'util/Comparator.html'
  },
  {
    lang: 'java', group: G1, name: 'Collections.sort()',
    desc: "Sortiert eine veränderbare Liste in natürlicher Ordnung oder mit Comparator.",
    details: "`Collections.sort(liste)` setzt `Comparable`-Elemente voraus, `Collections.sort(liste, comparator)` nimmt eine eigene Ordnung. Die Methode sortiert stabil und verändert die Liste direkt. Heute ist meist `liste.sort(...)` die kürzere Schreibweise mit demselben Ergebnis. Auf unveränderlichen Listen (`List.of`) wirft sie `UnsupportedOperationException`.",
    syntax: "Collections.sort(List<T> liste);\nCollections.sort(List<T> liste, Comparator<? super T> c);",
    example: e(`
List<Integer> z = new ArrayList<>(List.of(3, 1, 2));

Collections.sort(z);
System.out.println(z);   // [1, 2, 3]

Collections.sort(z, Collections.reverseOrder());
System.out.println(z);   // [3, 2, 1]

// Collections.sort(List.of(3, 1, 2));   // UnsupportedOperationException
`),
    keywords: ['sort', 'sortieren', 'collections', 'ordnen', 'aufsteigend', 'absteigend'],
    related: ['List.sort()', 'Comparator', 'Collections.reverse()', 'Stream.sorted()'],
    mdn: A + 'util/Collections.html'
  },
  {
    lang: 'java', group: G1, name: 'Collections.unmodifiableList()',
    desc: "Liefert eine schreibgeschützte Sicht auf eine bestehende Liste.",
    details: "Die zurückgegebene Liste wirft bei Änderungsversuchen `UnsupportedOperationException`. Es ist aber nur eine Sicht (View): Änderungen an der Originalliste sind weiterhin durch die Sicht sichtbar. Eine echte, unabhängige Kopie liefert `List.copyOf()`. Analog gibt es `unmodifiableSet`, `unmodifiableMap` und `unmodifiableCollection`.",
    syntax: "Collections.unmodifiableList(List<? extends T> liste)",
    example: e(`
List<String> orig = new ArrayList<>(List.of("a"));
List<String> sicht = Collections.unmodifiableList(orig);

orig.add("b");
System.out.println(sicht);   // [a, b]  (Sicht folgt dem Original)

try {
    sicht.add("c");
} catch (UnsupportedOperationException ex) {
    System.out.println("nicht erlaubt");
}
`),
    tip: "Wer eine Liste nach außen gibt und das Original später nicht mehr ändert, fährt mit `List.copyOf()` sicherer.",
    keywords: ['unmodifiable', 'schreibgeschützt', 'readonly', 'view', 'sicht', 'immutable', 'kapselung'],
    related: ['Unveränderliche Collections', 'List.of()'],
    mdn: A + 'util/Collections.html'
  },
  {
    lang: 'java', group: G1, name: 'Unveränderliche Collections',
    desc: "`List.of`, `Set.of`, `Map.of` und `copyOf` erzeugen Collections, die sich nicht ändern lassen.",
    details: "Änderungsversuche werfen `UnsupportedOperationException`. Die Factory-Methoden (seit Java 9) akzeptieren kein `null`: schon `List.of(\"x\", null)` und auch `contains(null)` auf einer solchen Liste werfen eine `NullPointerException`. `List.copyOf()` erzeugt eine unveränderliche Kopie und gibt bei einer schon unveränderlichen Liste dieselbe zurück. Die Elemente selbst werden nicht eingefroren: enthält die Liste veränderbare Objekte, bleiben diese änderbar.",
    syntax: "List.of(...)  Set.of(...)  Map.of(...)\nList.copyOf(coll)  Set.copyOf(coll)  Map.copyOf(map)",
    example: e(`
List<String> a = List.of("x", "y");

try { List.of("x", null); }
catch (NullPointerException ex) { System.out.println("null verboten"); }

try { a.contains(null); }
catch (NullPointerException ex) { System.out.println("contains(null) wirft"); }

List<String> quelle = new ArrayList<>(List.of("a"));
List<String> kopie = List.copyOf(quelle);
quelle.add("b");
System.out.println(kopie);   // [a]

List<String> mitNull = Arrays.asList("a", null);   // erlaubt, aber nur fixe Größe
System.out.println(mitNull);   // [a, null]
`),
    tip: "`Stream.toList()` und `Collectors.toUnmodifiableList()` liefern ebenfalls unveränderliche Listen; Erstere erlaubt `null`.",
    keywords: ['immutable', 'unveränderlich', 'List.of', 'copyOf', 'null', 'NullPointerException', 'UnsupportedOperationException', 'factory'],
    related: ['List.of()', 'Set.of()', 'Map.of()', 'Collections.unmodifiableList()', 'Stream.toList()'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G1, name: 'equals und hashCode in Collections',
    desc: "Hash-basierte Collections und `contains` verlassen sich auf korrektes `equals` und `hashCode`.",
    details: "`HashSet`, `HashMap` und `contains()`/`indexOf()`/`remove(Object)` vergleichen mit `equals()`. Hash-Collections sortieren Objekte zuerst über `hashCode()` in Behälter ein. Überschreibt man `equals`, muss man auch `hashCode` überschreiben, sonst werden gleiche Objekte nicht gefunden. Schlüsselobjekte in Maps sollten unveränderlich sein: ändert sich ein Feld, das in `hashCode` einfließt, ist der Eintrag nicht mehr auffindbar.",
    syntax: "@Override public boolean equals(Object o) { ... }\n@Override public int hashCode() { return Objects.hash(feld1, feld2); }",
    example: e(`
class Ohne {
    final int x;
    Ohne(int x) { this.x = x; }
}
class Mit {
    final int x;
    Mit(int x) { this.x = x; }
    @Override public boolean equals(Object o) { return o instanceof Mit m && m.x == x; }
    @Override public int hashCode() { return Objects.hash(x); }
}

Set<Ohne> a = new HashSet<>(List.of(new Ohne(1)));
a.add(new Ohne(1));
System.out.println(a.size());   // 2 (Objekte gelten als verschieden)

Set<Mit> b = new HashSet<>(List.of(new Mit(1)));
b.add(new Mit(1));
System.out.println(b.size());   // 1
`),
    tip: "Für reine Datenklassen erzeugt ein `record` `equals` und `hashCode` automatisch.",
    keywords: ['equals', 'hashCode', 'gleichheit', 'hash', 'HashSet', 'HashMap', 'Objects.hash', 'vertrag', 'contract'],
    related: ['HashSet', 'HashMap', 'List.contains()', 'Set'],
    mdn: A + 'lang/Object.html'
  },
  {
    lang: 'java', group: G1, name: 'Collections.reverse()',
    desc: "Kehrt die Reihenfolge der Elemente einer Liste direkt um.",
    details: "Die Methode verändert die übergebene Liste und liefert nichts zurück. Sie funktioniert nur auf veränderbaren Listen. Seit Java 21 gibt es mit `List.reversed()` zusätzlich eine umgekehrte Sicht, ohne das Original zu verändern.",
    syntax: "Collections.reverse(List<?> liste)",
    example: e(`
List<Integer> z = new ArrayList<>(List.of(1, 2, 3));

Collections.reverse(z);
System.out.println(z);              // [3, 2, 1]

List<Integer> sicht = z.reversed();   // seit Java 21: Sicht, keine Kopie
System.out.println(sicht);          // [1, 2, 3]
`),
    keywords: ['reverse', 'umkehren', 'umdrehen', 'rückwärts', 'reversed'],
    related: ['Collections.sort()', 'SequencedCollection'],
    mdn: A + 'util/Collections.html'
  },
  {
    lang: 'java', group: G1, name: 'Collections.shuffle()',
    desc: "Mischt die Elemente einer Liste in zufälliger Reihenfolge.",
    details: "Ohne Argument wird eine zufällige Quelle verwendet, die Reihenfolge ist also bei jedem Lauf anders. Mit einem `Random` mit festem Seed (`new Random(42)`) wird das Mischen reproduzierbar, was für Tests nützlich ist. Die Liste muss veränderbar sein.",
    syntax: "Collections.shuffle(List<?> liste);\nCollections.shuffle(List<?> liste, Random zufall);",
    example: e(`
List<Integer> z = new ArrayList<>(List.of(1, 2, 3, 4, 5));

Collections.shuffle(z);                 // bei jedem Lauf anders
Collections.shuffle(z, new Random(42)); // reproduzierbar
System.out.println(z.size());           // 5 (Inhalt gleich, nur Reihenfolge neu)
`),
    keywords: ['shuffle', 'mischen', 'zufall', 'random', 'zufällig'],
    related: ['Collections.sort()', 'Collections.reverse()'],
    mdn: A + 'util/Collections.html'
  },
  {
    lang: 'java', group: G1, name: 'ConcurrentModificationException',
    desc: "Wird geworfen, wenn eine Collection während einer Iteration strukturell verändert wird.",
    details: "Das passiert typischerweise, wenn man in einer for-each-Schleife `add` oder `remove` auf derselben Collection aufruft. Die Iteratoren der Standard-Collections sind fail-fast und erkennen die Änderung beim nächsten `next()`. Das Auslösen ist nicht garantiert (bei bestimmten Größen fällt die Änderung nicht auf), man darf sich also nicht darauf verlassen. Lösungen: `removeIf()`, `Iterator.remove()` oder eine neue Collection aufbauen.",
    example: e(`
List<Integer> z = new ArrayList<>(List.of(1, 2, 3, 4));

try {
    for (Integer i : z) {
        if (i == 2) z.remove(i);   // verändert die Liste während der Iteration
    }
} catch (ConcurrentModificationException ex) {
    System.out.println("CME");   // CME
}

z.removeIf(i -> i == 2);
System.out.println(z);   // [1, 3, 4]
`),
    tip: "Der Name täuscht: die Exception hat nicht zwingend mit Threads zu tun, meist ist es dieselbe Schleife.",
    keywords: ['ConcurrentModificationException', 'CME', 'fail-fast', 'iteration', 'entfernen', 'schleife'],
    related: ['Iterable und Iterator', 'List.removeIf()'],
    mdn: A + 'util/ConcurrentModificationException.html'
  },

  // ---------------- Listen ----------------
  {
    lang: 'java', group: G2, name: 'List',
    desc: "Geordnete Collection mit Index-Zugriff, die Duplikate und `null` zulassen kann.",
    details: "`List<E>` ist das Interface für Sequenzen. Wichtige Implementierungen sind `ArrayList` und `LinkedList`; mit `List.of()` entsteht eine unveränderliche Liste. Elemente werden ab Index 0 angesprochen, ein ungültiger Index führt zu `IndexOutOfBoundsException`. Deklariere Variablen und Parameter mit `List`, nicht mit der konkreten Klasse.",
    syntax: "List<Typ> liste = new ArrayList<>();",
    example: e(`
List<String> l = new ArrayList<>();
l.add("a");
l.add("b");
l.add(0, "x");              // an Index 0 einfügen

System.out.println(l);          // [x, a, b]
System.out.println(l.get(1));   // a
System.out.println(l.size());   // 3
`),
    keywords: ['liste', 'list', 'sequenz', 'index', 'array', 'dynamisch'],
    related: ['ArrayList', 'LinkedList', 'List.of()', 'Collection-Framework'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'ArrayList',
    desc: "Die Standard-Liste: Array-basiert, schneller Index-Zugriff, wächst automatisch.",
    details: "`get(i)` und `set(i, x)` sind sehr schnell, Anhängen am Ende ist im Schnitt ebenfalls schnell. Einfügen und Entfernen in der Mitte verschiebt alle folgenden Elemente und kostet entsprechend. Mit `new ArrayList<>(n)` reserviert man Kapazität vorab, mit `new ArrayList<>(andereCollection)` kopiert man. Nicht thread-sicher.",
    syntax: "new ArrayList<>()\nnew ArrayList<>(int kapazitaet)\nnew ArrayList<>(Collection<? extends E> c)",
    example: e(`
List<Integer> z = new ArrayList<>();
for (int i = 1; i <= 3; i++) z.add(i * 10);
System.out.println(z);   // [10, 20, 30]

List<Integer> kopie = new ArrayList<>(z);   // veränderbare Kopie
kopie.add(40);
System.out.println(z.size() + " " + kopie.size());   // 3 4
`),
    tip: "Die Diamond-Schreibweise `new ArrayList<>()` ersetzt die doppelte Typangabe.",
    keywords: ['arraylist', 'liste', 'dynamisches array', 'kapazität'],
    related: ['List', 'LinkedList', 'List.of()'],
    mdn: A + 'util/ArrayList.html'
  },
  {
    lang: 'java', group: G2, name: 'LinkedList',
    desc: "Doppelt verkettete Liste, die zugleich `List` und `Deque` implementiert.",
    details: "Einfügen und Entfernen am Anfang oder Ende ist günstig, Zugriff per Index muss dagegen die Kette ablaufen. In der Praxis ist `ArrayList` meist schneller, auch bei vielen Einfügungen, weil sie cache-freundlicher ist. Für Stack und Queue ist `ArrayDeque` die bessere Wahl, `LinkedList` erlaubt als Besonderheit `null`-Elemente.",
    example: e(`
LinkedList<String> l = new LinkedList<>();
l.add("b");
l.addFirst("a");
l.addLast("c");

System.out.println(l);                // [a, b, c]
System.out.println(l.removeFirst());  // a
System.out.println(l.peekLast());     // c
`),
    keywords: ['linkedlist', 'verkettete liste', 'deque', 'queue'],
    related: ['ArrayList', 'ArrayDeque', 'Deque'],
    mdn: A + 'util/LinkedList.html'
  },
  {
    lang: 'java', group: G2, name: 'List.of()',
    desc: "Erzeugt seit Java 9 eine unveränderliche Liste aus den übergebenen Elementen.",
    details: "Kein `add`, `remove` oder `set`, kein `null` als Element. Die Reihenfolge bleibt wie angegeben. Für eine veränderbare Liste kopiert man in eine `ArrayList`. Seit Java 16 gibt es `Stream.toList()` als Gegenstück für Stream-Ergebnisse.",
    syntax: "List.of(e1, e2, ...)\nList.of()   // leere Liste",
    example: e(`
List<String> farben = List.of("rot", "grün", "blau");
System.out.println(farben.get(1));   // grün

List<String> aenderbar = new ArrayList<>(farben);
aenderbar.add("gelb");
System.out.println(aenderbar);       // [rot, grün, blau, gelb]

// farben.add("gelb");               // UnsupportedOperationException
`),
    keywords: ['List.of', 'immutable', 'unveränderlich', 'literal', 'factory'],
    related: ['Unveränderliche Collections', 'ArrayList', 'Set.of()', 'Map.of()'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.add()',
    desc: "Hängt ein Element an das Ende an oder fügt es an einem Index ein.",
    details: "`add(x)` liefert `true` zurück, `add(index, x)` verschiebt die folgenden Elemente nach rechts und liefert nichts. Der Index darf höchstens `size()` sein, sonst gibt es `IndexOutOfBoundsException`. Mehrere Elemente auf einmal fügt `addAll(collection)` hinzu.",
    syntax: "boolean add(E e)\nvoid add(int index, E e)\nboolean addAll(Collection<? extends E> c)",
    example: e(`
List<String> l = new ArrayList<>();
l.add("b");
l.add(0, "a");
l.addAll(List.of("c", "d"));
System.out.println(l);   // [a, b, c, d]
`),
    keywords: ['add', 'hinzufügen', 'anhängen', 'einfügen', 'addAll', 'append'],
    related: ['List.set()', 'List.remove()', 'ArrayList'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.get()',
    desc: "Liefert das Element an einem Index.",
    details: "Der Index beginnt bei 0; ist er negativ oder `>= size()`, wird `IndexOutOfBoundsException` geworfen. Bei `ArrayList` ist der Zugriff schnell, bei `LinkedList` langsam. Das letzte Element ist `get(size() - 1)`, seit Java 21 einfacher `getLast()`.",
    syntax: "E get(int index)",
    example: e(`
List<String> l = List.of("a", "b", "c");
System.out.println(l.get(0));              // a
System.out.println(l.get(l.size() - 1));   // c
System.out.println(l.getLast());           // c  (seit Java 21)
`),
    keywords: ['get', 'zugriff', 'index', 'element lesen', 'IndexOutOfBoundsException'],
    related: ['List.set()', 'List.indexOf()', 'SequencedCollection'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.set()',
    desc: "Ersetzt das Element an einem Index und liefert das alte zurück.",
    details: "`set` verändert die Größe der Liste nicht und kann nur bestehende Indizes ersetzen, sonst folgt `IndexOutOfBoundsException`. Auch `Arrays.asList(...)` erlaubt `set`, nicht aber `add` oder `remove`. Für das Ersetzen aller Elemente per Funktion gibt es `replaceAll()`.",
    syntax: "E set(int index, E e)",
    example: e(`
List<String> l = new ArrayList<>(List.of("a", "b", "c"));
String alt = l.set(1, "X");

System.out.println(alt);   // b
System.out.println(l);     // [a, X, c]

l.replaceAll(String::toUpperCase);
System.out.println(l);     // [A, X, C]
`),
    keywords: ['set', 'ersetzen', 'überschreiben', 'replaceAll'],
    related: ['List.get()', 'List.add()'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.remove()',
    desc: "Entfernt ein Element per Index oder per Wert.",
    details: "`remove(int index)` löscht an einer Position und liefert das Element, `remove(Object o)` löscht das erste Vorkommen und liefert `true` oder `false`. Bei `List<Integer>` ist das eine klassische Falle: `remove(1)` bedeutet Index 1, für den Wert 1 braucht man `remove(Integer.valueOf(1))`. Mehrere Elemente nach Bedingung entfernt man mit `removeIf()`.",
    syntax: "E remove(int index)\nboolean remove(Object o)",
    example: e(`
List<Integer> z = new ArrayList<>(List.of(10, 20, 30));

z.remove(1);                     // Index 1
System.out.println(z);           // [10, 30]

z.remove(Integer.valueOf(30));   // Wert 30
System.out.println(z);           // [10]
`),
    tip: "Bei `List<Integer>` immer prüfen: `int` ruft die Index-Variante, `Integer` die Wert-Variante.",
    keywords: ['remove', 'entfernen', 'löschen', 'index oder wert', 'Integer'],
    related: ['List.removeIf()', 'List.add()', 'Iterable und Iterator'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.size()',
    desc: "Gibt die Anzahl der Elemente zurück; `isEmpty()` prüft auf leer.",
    details: "Bei Collections heißt es `size()`, bei Arrays `length` und bei Strings `length()`. Für die Frage nach einer leeren Liste ist `isEmpty()` lesbarer als `size() == 0`. Auf `null` aufgerufen führt beides zur `NullPointerException`.",
    syntax: "int size()\nboolean isEmpty()",
    example: e(`
List<String> l = new ArrayList<>();
System.out.println(l.size());      // 0
System.out.println(l.isEmpty());   // true

l.add("a");
System.out.println(l.size());      // 1
`),
    keywords: ['size', 'länge', 'anzahl', 'isEmpty', 'leer'],
    related: ['List.contains()', 'Stream.count()'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.contains()',
    desc: "Prüft, ob ein Element in der Liste enthalten ist (per `equals`).",
    details: "Die Suche läuft linear durch die Liste und vergleicht mit `equals()`. Bei großen Datenmengen und häufigen Abfragen ist ein `HashSet` deutlich schneller. Auf mit `List.of()` erzeugten Listen wirft `contains(null)` eine `NullPointerException`.",
    syntax: "boolean contains(Object o)\nboolean containsAll(Collection<?> c)",
    example: e(`
List<String> l = List.of("rot", "grün");
System.out.println(l.contains("rot"));    // true
System.out.println(l.contains("blau"));   // false

Set<String> menge = new HashSet<>(l);     // für viele Abfragen schneller
System.out.println(menge.contains("grün")); // true
`),
    keywords: ['contains', 'enthält', 'suchen', 'vorhanden', 'containsAll'],
    related: ['List.indexOf()', 'equals und hashCode in Collections', 'HashSet'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.indexOf()',
    desc: "Liefert den Index des ersten Vorkommens oder -1.",
    details: "Verglichen wird mit `equals()`. Der Rückgabewert -1 bedeutet nicht gefunden und muss geprüft werden, bevor man ihn als Index verwendet. `lastIndexOf()` sucht von hinten.",
    syntax: "int indexOf(Object o)\nint lastIndexOf(Object o)",
    example: e(`
List<String> l = List.of("a", "b", "a");
System.out.println(l.indexOf("a"));       // 0
System.out.println(l.lastIndexOf("a"));   // 2
System.out.println(l.indexOf("z"));       // -1
`),
    keywords: ['indexOf', 'lastIndexOf', 'position', 'suchen', 'finden'],
    related: ['List.contains()', 'List.get()'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.sort()',
    desc: "Sortiert die Liste direkt mit einem Comparator oder in natürlicher Ordnung.",
    details: "`liste.sort(null)` verwendet die natürliche Ordnung (`Comparable`), lesbarer ist `Comparator.naturalOrder()`. Die Sortierung ist stabil, gleiche Elemente behalten also ihre Reihenfolge. Bei unveränderlichen Listen gibt es `UnsupportedOperationException`; dann `stream().sorted().toList()` verwenden.",
    syntax: "void sort(Comparator<? super E> c)",
    example: e(`
List<String> l = new ArrayList<>(List.of("kiwi", "Apfel", "birne"));

l.sort(Comparator.naturalOrder());
System.out.println(l);   // [Apfel, birne, kiwi]

l.sort(String.CASE_INSENSITIVE_ORDER);
System.out.println(l);   // [Apfel, birne, kiwi]

l.sort(Comparator.comparing(String::length).reversed());
System.out.println(l);   // [Apfel, birne, kiwi]
`),
    keywords: ['sort', 'sortieren', 'ordnen', 'comparator', 'natürliche ordnung'],
    related: ['Comparator', 'Comparator.comparing()', 'Collections.sort()', 'Stream.sorted()'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.subList()',
    desc: "Liefert eine Teilsicht auf einen Bereich der Liste (von inklusive bis exklusive).",
    details: "Die Teilliste ist keine Kopie, sondern eine Sicht auf das Original: Änderungen wirken in beide Richtungen. Wird die Originalliste danach strukturell verändert, löst der Zugriff auf die Teilliste eine `ConcurrentModificationException` aus. Für eine unabhängige Kopie wickelt man sie in `new ArrayList<>(...)`.",
    syntax: "List<E> subList(int von, int bis)",
    example: e(`
List<Integer> z = new ArrayList<>(List.of(1, 2, 3, 4, 5));

List<Integer> teil = z.subList(1, 3);
System.out.println(teil);   // [2, 3]

teil.clear();               // löscht auch im Original
System.out.println(z);      // [1, 4, 5]

List<Integer> kopie = new ArrayList<>(z.subList(0, 2));   // unabhängig
`),
    tip: "`subList(a, b).clear()` ist die kürzeste Art, einen Bereich zu löschen.",
    keywords: ['subList', 'teilliste', 'ausschnitt', 'bereich', 'slice', 'view'],
    related: ['List.get()', 'Stream.skip()', 'Stream.limit()'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.toArray()',
    desc: "Wandelt die Liste in ein Array um.",
    details: "`toArray()` ohne Argument liefert ein `Object[]`. Für ein typisiertes Array übergibt man einen Array-Konstruktor: `toArray(String[]::new)` (seit Java 11) oder die ältere Form `toArray(new String[0])`. Umgekehrt macht `Arrays.asList(array)` aus einem Array eine Liste mit fester Größe; `List.of(array)` eine unveränderliche.",
    syntax: "Object[] toArray()\n<T> T[] toArray(IntFunction<T[]> generator)   // seit Java 11\n<T> T[] toArray(T[] a)",
    example: e(`
List<String> l = List.of("a", "b", "c");

String[] arr = l.toArray(new String[0]);
String[] arr2 = l.toArray(String[]::new);
System.out.println(arr.length + " " + arr2[2]);   // 3 c

List<String> zurueck = Arrays.asList(arr);
System.out.println(zurueck);                      // [a, b, c]
`),
    keywords: ['toArray', 'array', 'umwandeln', 'konvertieren', 'asList'],
    related: ['ArrayList', 'List.of()'],
    mdn: A + 'util/List.html'
  },
  {
    lang: 'java', group: G2, name: 'List.forEach()',
    desc: "Führt eine Aktion für jedes Element aus (`Iterable.forEach`).",
    details: "Die Methode nimmt einen `Consumer`, meist als Lambda oder Methodenreferenz. Sie ist kurz für reine Ausgaben oder Seiteneffekte, ersetzt aber nicht jede Schleife: Mit `break`, `continue`, `return` aus der umgebenden Methode oder dem Ändern lokaler Variablen kommt man darin nicht weiter. Sie steht auf allen `Iterable`s und auf `Map` zur Verfügung.",
    syntax: "void forEach(Consumer<? super E> aktion)",
    example: e(`
List<String> l = List.of("a", "b", "c");

l.forEach(System.out::println);          // a, b, c
l.forEach(s -> System.out.print(s + " "));   // a b c
System.out.println();
`),
    keywords: ['forEach', 'schleife', 'durchlaufen', 'consumer', 'lambda'],
    related: ['Consumer', 'Methodenreferenzen (::)', 'Stream.forEach()', 'Map.forEach()'],
    mdn: A + 'lang/Iterable.html'
  },
  {
    lang: 'java', group: G2, name: 'List.removeIf()',
    desc: "Entfernt alle Elemente, die ein Predicate erfüllen (`Collection.removeIf`).",
    details: "Eine sichere und kurze Alternative zum Entfernen in einer Schleife. Der Rückgabewert ist `true`, wenn mindestens ein Element entfernt wurde. Nur auf veränderbaren Collections möglich, sonst `UnsupportedOperationException`. Gilt für alle `Collection`s, auch `Set` und für `map.values()` oder `map.keySet()`.",
    syntax: "boolean removeIf(Predicate<? super E> filter)",
    example: e(`
List<Integer> z = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));

boolean geaendert = z.removeIf(n -> n % 2 == 0);
System.out.println(geaendert);   // true
System.out.println(z);           // [1, 3, 5]

Map<String, Integer> m = new HashMap<>(Map.of("a", 1, "b", 5));
m.values().removeIf(v -> v > 3);
System.out.println(m);           // {a=1}
`),
    keywords: ['removeIf', 'filtern', 'entfernen', 'bedingung', 'predicate'],
    related: ['Predicate', 'List.remove()', 'ConcurrentModificationException', 'Stream.filter()'],
    mdn: A + 'util/Collection.html'
  },
  {
    lang: 'java', group: G2, name: 'SequencedCollection',
    desc: "Seit Java 21: einheitliche Methoden für erstes und letztes Element sowie `reversed()`.",
    details: "`SequencedCollection` ist ein neues Interface für Collections mit festgelegter Reihenfolge; `List`, `Deque`, `LinkedHashSet` und `SortedSet` gehören dazu. Es bietet `getFirst()`, `getLast()`, `addFirst()`, `addLast()`, `removeFirst()`, `removeLast()` und `reversed()`. `reversed()` ist eine Sicht, keine Kopie. Auf leeren Collections werfen `getFirst()` und `getLast()` eine `NoSuchElementException`. Maps haben mit `SequencedMap` ein Gegenstück (`firstEntry()`, `lastEntry()`).",
    syntax: "E getFirst()   E getLast()\nvoid addFirst(E e)   void addLast(E e)\nE removeFirst()   E removeLast()\nSequencedCollection<E> reversed()",
    example: e(`
List<String> l = new ArrayList<>(List.of("a", "b", "c"));
System.out.println(l.getFirst());    // a
System.out.println(l.getLast());     // c
System.out.println(l.reversed());    // [c, b, a]

LinkedHashSet<Integer> s = new LinkedHashSet<>(List.of(1, 2, 3));
System.out.println(s.reversed());    // [3, 2, 1]

LinkedHashMap<String, Integer> m = new LinkedHashMap<>();
m.put("x", 1);
m.put("y", 2);
System.out.println(m.firstEntry());  // x=1
System.out.println(m.lastEntry());   // y=2
`),
    tip: "Vor Java 21 brauchte man `get(0)` und `get(size() - 1)`, bei einer leeren Liste gab das `IndexOutOfBoundsException`, jetzt `NoSuchElementException`.",
    keywords: ['SequencedCollection', 'getFirst', 'getLast', 'reversed', 'java 21', 'erstes element', 'letztes element', 'SequencedMap'],
    related: ['List.get()', 'LinkedHashMap', 'Collections.reverse()', 'Deque'],
    mdn: A + 'util/SequencedCollection.html'
  },
  // ---------------- Maps ----------------
  {
    lang: 'java', group: G3, name: 'Map',
    desc: "Ordnet eindeutigen Schlüsseln jeweils einen Wert zu.",
    details: "`Map<K, V>` ist das Interface für Schlüssel-Wert-Paare. Jeder Schlüssel kommt höchstens einmal vor; ein erneutes `put` mit demselben Schlüssel ersetzt den Wert. Eine `Map` ist keine `Collection`, man iteriert über `keySet()`, `values()` oder `entrySet()`. Gängige Implementierungen sind `HashMap`, `LinkedHashMap` und `TreeMap`.",
    syntax: "Map<Schluessel, Wert> map = new HashMap<>();",
    example: e(`
Map<String, Integer> alter = new TreeMap<>();
alter.put("Ada", 36);
alter.put("Linus", 28);

System.out.println(alter);              // {Ada=36, Linus=28}
System.out.println(alter.get("Ada"));   // 36
System.out.println(alter.size());       // 2
`),
    keywords: ['map', 'dictionary', 'wörterbuch', 'schlüssel', 'wert', 'key', 'value', 'assoziatives array'],
    related: ['HashMap', 'LinkedHashMap', 'TreeMap', 'Map.of()', 'Collection-Framework'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'HashMap',
    desc: "Standard-Map auf Hash-Basis: schneller Zugriff, keine feste Reihenfolge.",
    details: "`get`, `put` und `containsKey` sind im Schnitt sehr schnell, setzen aber ein korrektes `hashCode()` und `equals()` der Schlüssel voraus. Die Iterationsreihenfolge ist nicht festgelegt und kann sich ändern. `HashMap` erlaubt einen `null`-Schlüssel und `null`-Werte, ist aber nicht thread-sicher (dafür `ConcurrentHashMap`).",
    syntax: "new HashMap<>()\nnew HashMap<>(Map<? extends K, ? extends V> m)",
    example: e(`
Map<String, Integer> m = new HashMap<>();
m.put("a", 1);
m.put("b", 2);
m.put("a", 3);   // überschreibt den Wert zu "a"

System.out.println(m.size());     // 2
System.out.println(m.get("a"));   // 3
System.out.println(m.get("x"));   // null
`),
    tip: "Reihenfolge nötig? `LinkedHashMap` (Einfügereihenfolge) oder `TreeMap` (sortiert) nehmen.",
    keywords: ['hashmap', 'hash', 'map', 'wörterbuch', 'dictionary'],
    related: ['Map', 'LinkedHashMap', 'TreeMap', 'equals und hashCode in Collections'],
    mdn: A + 'util/HashMap.html'
  },
  {
    lang: 'java', group: G3, name: 'LinkedHashMap',
    desc: "Map, die die Einfüge- oder wahlweise Zugriffsreihenfolge merkt.",
    details: "Beim Iterieren erscheinen die Einträge in der Reihenfolge des ersten Einfügens; erneutes `put` ändert die Position nicht. Mit dem Konstruktor `new LinkedHashMap<>(16, 0.75f, true)` sortiert sich die Map nach letztem Zugriff, und das Überschreiben von `removeEldestEntry()` macht daraus einen einfachen LRU-Cache. Seit Java 21 implementiert sie `SequencedMap`.",
    syntax: "new LinkedHashMap<>()\nnew LinkedHashMap<>(int kapazitaet, float lastFaktor, boolean zugriffsReihenfolge)",
    example: e(`
Map<String, Integer> m = new LinkedHashMap<>();
m.put("z", 1);
m.put("a", 2);
m.put("m", 3);
System.out.println(m);   // {z=1, a=2, m=3}

// LRU-Cache mit maximal 2 Einträgen
Map<Integer, String> cache = new LinkedHashMap<>(16, 0.75f, true) {
    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, String> aeltester) {
        return size() > 2;
    }
};
cache.put(1, "a");
cache.put(2, "b");
cache.get(1);        // 1 ist jetzt der zuletzt benutzte
cache.put(3, "c");   // verdrängt 2
System.out.println(cache.keySet());   // [1, 3]
`),
    keywords: ['linkedhashmap', 'reihenfolge', 'einfügereihenfolge', 'lru', 'cache', 'removeEldestEntry'],
    related: ['HashMap', 'TreeMap', 'SequencedCollection'],
    mdn: A + 'util/LinkedHashMap.html'
  },
  {
    lang: 'java', group: G3, name: 'TreeMap',
    desc: "Nach Schlüsseln sortierte Map auf Basis eines Rot-Schwarz-Baums.",
    details: "Die Schlüssel müssen `Comparable` sein oder es wird ein `Comparator` übergeben. Zugriffe kosten logarithmische Zeit. Zusätzlich zu `Map` gibt es Navigationsmethoden wie `firstKey()`, `floorKey()`, `ceilingKey()`, `headMap()` und `tailMap()`. Bei natürlicher Ordnung ist kein `null`-Schlüssel erlaubt; ein Comparator wie `Comparator.nullsFirst(...)` kann ihn zulassen. Gleichheit von Schlüsseln bestimmt der Comparator, nicht `equals()`.",
    syntax: "new TreeMap<>()\nnew TreeMap<>(Comparator<? super K> c)",
    example: e(`
TreeMap<Integer, String> t = new TreeMap<>();
t.put(30, "c");
t.put(10, "a");
t.put(20, "b");

System.out.println(t);                  // {10=a, 20=b, 30=c}
System.out.println(t.firstKey());       // 10
System.out.println(t.floorKey(25));     // 20  (größter Schlüssel <= 25)
System.out.println(t.ceilingKey(25));   // 30  (kleinster Schlüssel >= 25)
System.out.println(t.headMap(30));      // {10=a, 20=b}
`),
    keywords: ['treemap', 'sortiert', 'sorted map', 'navigable', 'floorKey', 'ceilingKey', 'baum'],
    related: ['Map', 'HashMap', 'TreeSet', 'Comparator'],
    mdn: A + 'util/TreeMap.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.of()',
    desc: "Erzeugt seit Java 9 eine unveränderliche Map aus Schlüssel-Wert-Paaren.",
    details: "Die Variante `Map.of(k1, v1, k2, v2, ...)` nimmt bis zu 10 Paare; für mehr oder für Einträge aus anderen Quellen gibt es `Map.ofEntries(Map.entry(...), ...)`. `null` als Schlüssel oder Wert wirft eine `NullPointerException`, doppelte Schlüssel eine `IllegalArgumentException`. Die Iterationsreihenfolge ist unbestimmt und kann sich von Lauf zu Lauf unterscheiden.",
    syntax: "Map.of(k1, v1, k2, v2, ...)\nMap.ofEntries(Map.entry(k, v), ...)\nMap.copyOf(map)",
    example: e(`
Map<String, Integer> m = Map.of("a", 1, "b", 2);
System.out.println(m.get("b"));   // 2
System.out.println(m.size());     // 2

Map<String, Integer> viele = Map.ofEntries(
    Map.entry("x", 10), Map.entry("y", 20));
System.out.println(viele.get("y"));   // 20

Map<String, Integer> aenderbar = new HashMap<>(m);   // veränderbare Kopie
aenderbar.put("c", 3);
`),
    keywords: ['Map.of', 'ofEntries', 'immutable', 'unveränderlich', 'literal', 'factory'],
    related: ['Map.entry()', 'Unveränderliche Collections', 'List.of()', 'Set.of()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.entry()',
    desc: "Erzeugt einen unveränderlichen Schlüssel-Wert-Eintrag (seit Java 9).",
    details: "Ein `Map.Entry<K, V>` liefert `getKey()` und `getValue()`. `Map.entry(k, v)` ist die kompakte Art, einen solchen Eintrag zu bauen, z. B. für `Map.ofEntries()`. Der Eintrag erlaubt weder `null` noch `setValue()`. Einträge aus `entrySet()` einer normalen Map dagegen unterstützen oft `setValue()`.",
    syntax: "Map.entry(K key, V value)\nnew AbstractMap.SimpleEntry<>(key, value)   // veränderbar, erlaubt null",
    example: e(`
Map.Entry<String, Integer> eintrag = Map.entry("a", 1);
System.out.println(eintrag.getKey());     // a
System.out.println(eintrag.getValue());   // 1
System.out.println(eintrag);              // a=1

Map<String, Integer> m = new TreeMap<>(Map.of("x", 1, "y", 2));
for (Map.Entry<String, Integer> en : m.entrySet()) {
    System.out.println(en.getKey() + " -> " + en.getValue());   // x -> 1, y -> 2
}
`),
    keywords: ['entry', 'Map.Entry', 'eintrag', 'paar', 'pair', 'getKey', 'getValue'],
    related: ['Map.entrySet()', 'Map.of()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.put()',
    desc: "Speichert einen Wert unter einem Schlüssel und liefert den vorherigen Wert.",
    details: "Existiert der Schlüssel schon, wird der Wert ersetzt und der alte zurückgegeben, sonst ist der Rückgabewert `null`. Der Rückgabewert lässt sich also nicht von einem tatsächlich gespeicherten `null` unterscheiden. Mit `putAll(map)` übernimmt man alle Einträge einer anderen Map. Wer nur setzen will, wenn noch nichts da ist: `putIfAbsent()`.",
    syntax: "V put(K key, V value)\nvoid putAll(Map<? extends K, ? extends V> m)",
    example: e(`
Map<String, Integer> m = new HashMap<>();
System.out.println(m.put("a", 1));   // null (neu)
System.out.println(m.put("a", 2));   // 1    (alter Wert)
System.out.println(m.get("a"));      // 2
`),
    keywords: ['put', 'speichern', 'setzen', 'einfügen', 'putAll', 'überschreiben'],
    related: ['Map.get()', 'Map.putIfAbsent()', 'Map.merge()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.get()',
    desc: "Liefert den Wert zu einem Schlüssel oder `null`, wenn es keinen gibt.",
    details: "`null` bedeutet entweder, dass der Schlüssel fehlt, oder dass `null` gespeichert wurde. Wer das unterscheiden muss, nutzt `containsKey()`. Wird der Wert gleich weiterverwendet, ist `getOrDefault()` sicherer. Ein Auspacken von `null` in einen `int` (`int x = map.get(k)`) wirft eine `NullPointerException`.",
    syntax: "V get(Object key)",
    example: e(`
Map<String, Integer> m = Map.of("a", 1);
System.out.println(m.get("a"));   // 1
System.out.println(m.get("b"));   // null

// int x = m.get("b");            // NullPointerException beim Auspacken
`),
    keywords: ['get', 'lesen', 'abrufen', 'nachschlagen', 'null'],
    related: ['Map.getOrDefault()', 'Map.containsKey()', 'Map.put()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.getOrDefault()',
    desc: "Liefert den Wert zum Schlüssel oder einen Ersatzwert, wenn der Schlüssel fehlt.",
    details: "Praktisch fürs Zählen und für Konfigurationswerte. Der Ersatzwert wird nicht in die Map geschrieben. Ist der Schlüssel vorhanden, aber mit `null` belegt, kommt `null` zurück, nicht der Ersatzwert.",
    syntax: "V getOrDefault(Object key, V standard)",
    example: e(`
Map<String, Integer> m = new HashMap<>();
m.put("a", 1);

System.out.println(m.getOrDefault("a", 0));   // 1
System.out.println(m.getOrDefault("b", 0));   // 0
System.out.println(m.containsKey("b"));       // false (nichts gespeichert)

// Zählen
m.put("b", m.getOrDefault("b", 0) + 1);
System.out.println(m.get("b"));               // 1
`),
    tip: "Fürs Zählen ist `merge(wort, 1, Integer::sum)` noch kürzer.",
    keywords: ['getOrDefault', 'standardwert', 'default', 'fallback', 'zählen'],
    related: ['Map.get()', 'Map.merge()', 'Map.computeIfAbsent()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.containsKey()',
    desc: "Prüft, ob ein Schlüssel in der Map vorhanden ist; `containsValue()` prüft Werte.",
    details: "`containsKey()` ist bei `HashMap` schnell, `containsValue()` muss alle Einträge durchsuchen. Die Methode ist der richtige Weg, um zwischen fehlendem Schlüssel und gespeichertem `null` zu unterscheiden. Mit `keySet().contains(k)` erreicht man dasselbe.",
    syntax: "boolean containsKey(Object key)\nboolean containsValue(Object value)",
    example: e(`
Map<String, Integer> m = Map.of("a", 1, "b", 2);
System.out.println(m.containsKey("a"));    // true
System.out.println(m.containsKey("z"));    // false
System.out.println(m.containsValue(2));    // true
`),
    keywords: ['containsKey', 'containsValue', 'schlüssel vorhanden', 'enthält'],
    related: ['Map.get()', 'Map.keySet()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.remove()',
    desc: "Entfernt einen Eintrag anhand des Schlüssels und liefert den alten Wert.",
    details: "Gibt es den Schlüssel nicht, passiert nichts und es kommt `null` zurück. `remove(key, value)` entfernt den Eintrag nur, wenn auch der Wert passt, und liefert `boolean`. Mehrere Einträge nach Bedingung löscht man mit `entrySet().removeIf(...)` oder `values().removeIf(...)`.",
    syntax: "V remove(Object key)\nboolean remove(Object key, Object value)",
    example: e(`
Map<String, Integer> m = new HashMap<>(Map.of("a", 1, "b", 2));

System.out.println(m.remove("a"));        // 1
System.out.println(m.remove("zzz"));      // null
System.out.println(m.remove("b", 99));    // false (Wert passt nicht)
System.out.println(m);                    // {b=2}
`),
    keywords: ['remove', 'entfernen', 'löschen', 'eintrag'],
    related: ['Map.put()', 'List.removeIf()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.keySet()',
    desc: "Liefert eine Sicht auf alle Schlüssel der Map als `Set`.",
    details: "Die Menge ist an die Map gekoppelt: Wird daraus ein Element entfernt, verschwindet auch der Eintrag in der Map. Hinzufügen über das Set ist nicht möglich. Wer beim Iterieren auch die Werte braucht, nimmt besser `entrySet()`, statt für jeden Schlüssel `get()` aufzurufen.",
    syntax: "Set<K> keySet()",
    example: e(`
Map<String, Integer> m = new TreeMap<>(Map.of("a", 1, "b", 2, "c", 3));

for (String k : m.keySet()) System.out.print(k + " ");   // a b c
System.out.println();

m.keySet().remove("b");          // entfernt den Eintrag auch aus der Map
System.out.println(m);           // {a=1, c=3}
`),
    keywords: ['keySet', 'schlüssel', 'keys', 'schlüsselmenge', 'iterieren'],
    related: ['Map.values()', 'Map.entrySet()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.values()',
    desc: "Liefert eine Sicht auf alle Werte der Map als `Collection`.",
    details: "Werte können doppelt vorkommen, deshalb ist das Ergebnis kein `Set`. Auch diese Sicht ist an die Map gekoppelt: `values().removeIf(...)` entfernt Einträge aus der Map. Für Summen oder Auswertungen streamt man darüber.",
    syntax: "Collection<V> values()",
    example: e(`
Map<String, Integer> m = new TreeMap<>(Map.of("a", 1, "b", 2, "c", 3));

int summe = 0;
for (int v : m.values()) summe += v;
System.out.println(summe);   // 6

m.values().removeIf(v -> v > 1);
System.out.println(m);       // {a=1}
`),
    keywords: ['values', 'werte', 'wertemenge', 'summe'],
    related: ['Map.keySet()', 'Map.entrySet()', 'List.removeIf()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.entrySet()',
    desc: "Liefert alle Schlüssel-Wert-Paare; der beste Weg, eine Map zu durchlaufen.",
    details: "Jedes Element ist ein `Map.Entry` mit `getKey()` und `getValue()`. Diese Variante ist effizienter als über `keySet()` zu laufen und jeweils `get()` aufzurufen. Über den Eintrag lässt sich mit `setValue()` der Wert direkt ändern. Wer die Map beim Iterieren strukturell ändert, bekommt eine `ConcurrentModificationException`; Löschen geht mit `entrySet().removeIf(...)`.",
    syntax: "Set<Map.Entry<K, V>> entrySet()",
    example: e(`
Map<String, Integer> m = new TreeMap<>(Map.of("a", 1, "b", 2));

for (Map.Entry<String, Integer> en : m.entrySet()) {
    en.setValue(en.getValue() * 10);
    System.out.println(en.getKey() + "=" + en.getValue());   // a=10, b=20
}

m.entrySet().removeIf(en -> en.getValue() > 10);
System.out.println(m);   // {a=10}
`),
    keywords: ['entrySet', 'iterieren', 'durchlaufen', 'paare', 'Map.Entry', 'schleife'],
    related: ['Map.entry()', 'Map.keySet()', 'Map.forEach()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.putIfAbsent()',
    desc: "Setzt einen Wert nur, wenn der Schlüssel noch fehlt oder auf `null` steht.",
    details: "Liefert den bisherigen Wert zurück, oder `null`, wenn gerade neu gespeichert wurde. Der Wert wird immer vorher berechnet. Soll er nur bei Bedarf erzeugt werden, etwa ein neues Objekt, dann `computeIfAbsent()` verwenden.",
    syntax: "V putIfAbsent(K key, V value)",
    example: e(`
Map<String, Integer> m = new HashMap<>();

System.out.println(m.putIfAbsent("a", 1));   // null (neu gesetzt)
System.out.println(m.putIfAbsent("a", 2));   // 1    (bleibt)
System.out.println(m.get("a"));              // 1
`),
    keywords: ['putIfAbsent', 'nur wenn fehlt', 'standardwert setzen'],
    related: ['Map.put()', 'Map.computeIfAbsent()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.computeIfAbsent()',
    desc: "Erzeugt einen fehlenden Wert per Funktion und legt ihn ab; gut für Gruppierungen.",
    details: "Ist der Schlüssel nicht vorhanden, wird die Funktion mit dem Schlüssel aufgerufen, ihr Ergebnis gespeichert und zurückgegeben. Sonst wird der vorhandene Wert geliefert und die Funktion nicht aufgerufen. Das typische Muster ist `map.computeIfAbsent(k, x -> new ArrayList<>()).add(wert)`. Die Funktion darf die Map nicht selbst verändern.",
    syntax: "V computeIfAbsent(K key, Function<? super K, ? extends V> f)",
    example: e(`
Map<Integer, List<String>> nachLaenge = new TreeMap<>();

for (String w : List.of("Ei", "Tor", "Au", "Haus", "Uhr")) {
    nachLaenge.computeIfAbsent(w.length(), k -> new ArrayList<>()).add(w);
}
System.out.println(nachLaenge);   // {2=[Ei, Au], 3=[Tor, Uhr], 4=[Haus]}
`),
    tip: "Ohne `computeIfAbsent` braucht man die Dreierfolge `get`, `null`-Prüfung, `put`.",
    keywords: ['computeIfAbsent', 'compute', 'gruppieren', 'multimap', 'liste pro schlüssel'],
    related: ['Map.merge()', 'Map.putIfAbsent()', 'Collectors.groupingBy()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.merge()',
    desc: "Fügt einen Wert ein oder verbindet ihn mit dem vorhandenen; ideal zum Zählen.",
    details: "Fehlt der Schlüssel, wird der gegebene Wert gespeichert. Sonst berechnet die Funktion aus altem und neuem Wert den neuen Wert. Liefert die Funktion `null`, wird der Eintrag entfernt. `merge(wort, 1, Integer::sum)` ist das Standardmuster fürs Zählen und Aufsummieren.",
    syntax: "V merge(K key, V value, BiFunction<? super V, ? super V, ? extends V> f)",
    example: e(`
Map<String, Integer> zaehler = new TreeMap<>();

for (String w : "a b a c b a".split(" ")) {
    zaehler.merge(w, 1, Integer::sum);
}
System.out.println(zaehler);   // {a=3, b=2, c=1}
`),
    keywords: ['merge', 'zählen', 'häufigkeit', 'aufsummieren', 'wörter zählen', 'histogramm'],
    related: ['Map.computeIfAbsent()', 'Map.getOrDefault()', 'BinaryOperator', 'Collectors.counting()'],
    mdn: A + 'util/Map.html'
  },
  {
    lang: 'java', group: G3, name: 'Map.forEach()',
    desc: "Führt eine Aktion mit Schlüssel und Wert für jeden Eintrag aus.",
    details: "Die Methode nimmt einen `BiConsumer<K, V>` und ist die kürzeste Schleife über eine Map. Die Reihenfolge entspricht der Iterationsreihenfolge der Map. Mit `replaceAll((k, v) -> ...)` kann man alle Werte per Funktion ersetzen.",
    syntax: "void forEach(BiConsumer<? super K, ? super V> aktion)",
    example: e(`
Map<String, Integer> m = new TreeMap<>(Map.of("a", 1, "b", 2));

m.forEach((k, v) -> System.out.println(k + " -> " + v));   // a -> 1, b -> 2

m.replaceAll((k, v) -> v * 100);
System.out.println(m);   // {a=100, b=200}
`),
    keywords: ['forEach', 'iterieren', 'durchlaufen', 'BiConsumer', 'replaceAll'],
    related: ['Map.entrySet()', 'List.forEach()', 'Consumer'],
    mdn: A + 'util/Map.html'
  },

  // ---------------- Sets & Queues ----------------
  {
    lang: 'java', group: G4, name: 'Set',
    desc: "Collection ohne Duplikate; ein Element ist entweder enthalten oder nicht.",
    details: "`add()` liefert `false`, wenn das Element schon vorhanden war. Gleichheit entscheidet `equals()`, bei `TreeSet` der Comparator. Ein `Set` hat keinen Index-Zugriff. Typische Verwendungen: Duplikate entfernen, schnelle Zugehörigkeitsprüfung, Mengenoperationen.",
    syntax: "Set<Typ> menge = new HashSet<>();",
    example: e(`
Set<String> s = new HashSet<>();
System.out.println(s.add("a"));   // true
System.out.println(s.add("a"));   // false (schon da)
System.out.println(s.size());     // 1

List<Integer> mitDoppelten = List.of(1, 2, 2, 3, 3, 3);
Set<Integer> ohne = new TreeSet<>(mitDoppelten);
System.out.println(ohne);         // [1, 2, 3]
`),
    keywords: ['set', 'menge', 'duplikate', 'eindeutig', 'unique'],
    related: ['HashSet', 'LinkedHashSet', 'TreeSet', 'Set.of()', 'Mengenoperationen'],
    mdn: A + 'util/Set.html'
  },
  {
    lang: 'java', group: G4, name: 'HashSet',
    desc: "Set auf Hash-Basis: schnelle Abfragen, aber keine feste Reihenfolge.",
    details: "`add`, `remove` und `contains` laufen im Schnitt sehr schnell. Die Elemente brauchen ein passendes `equals()` und `hashCode()`. Intern nutzt `HashSet` eine `HashMap`. Ein Element, das nach dem Einfügen so verändert wird, dass sich sein Hash ändert, geht verloren.",
    syntax: "new HashSet<>()\nnew HashSet<>(Collection<? extends E> c)",
    example: e(`
Set<String> s = new HashSet<>(List.of("rot", "grün"));
s.add("blau");

System.out.println(s.contains("rot"));   // true
System.out.println(s.size());            // 3
s.remove("rot");
System.out.println(s.contains("rot"));   // false
`),
    keywords: ['hashset', 'menge', 'hash', 'duplikate entfernen'],
    related: ['Set', 'LinkedHashSet', 'TreeSet', 'equals und hashCode in Collections'],
    mdn: A + 'util/HashSet.html'
  },
  {
    lang: 'java', group: G4, name: 'LinkedHashSet',
    desc: "Set, das die Einfügereihenfolge beibehält.",
    details: "Verhält sich wie `HashSet`, merkt sich aber zusätzlich die Reihenfolge des ersten Einfügens. Das ist praktisch, um Duplikate zu entfernen und dabei die Reihenfolge zu erhalten. Wird ein Element erneut hinzugefügt, ändert sich seine Position nicht. Seit Java 21 mit `getFirst()`, `getLast()` und `reversed()`.",
    syntax: "new LinkedHashSet<>(Collection<? extends E> c)",
    example: e(`
List<String> l = List.of("c", "a", "c", "b", "a");
Set<String> eindeutig = new LinkedHashSet<>(l);

System.out.println(eindeutig);   // [c, a, b]
`),
    keywords: ['linkedhashset', 'reihenfolge', 'duplikate entfernen', 'einfügereihenfolge'],
    related: ['HashSet', 'TreeSet', 'SequencedCollection'],
    mdn: A + 'util/LinkedHashSet.html'
  },
  {
    lang: 'java', group: G4, name: 'TreeSet',
    desc: "Sortiertes Set mit Navigationsmethoden wie `first()`, `floor()` und `headSet()`.",
    details: "Die Elemente werden fortlaufend sortiert gehalten, entweder über `Comparable` oder einen übergebenen `Comparator`. Operationen kosten logarithmische Zeit. Zusätzlich gibt es `first()`, `last()`, `floor()`, `ceiling()`, `higher()`, `lower()`, `headSet()`, `tailSet()` und `descendingSet()`. Zwei Elemente, die der Comparator als gleich ansieht, gelten als Duplikat, auch wenn `equals()` etwas anderes sagt.",
    syntax: "new TreeSet<>()\nnew TreeSet<>(Comparator<? super E> c)",
    example: e(`
TreeSet<Integer> t = new TreeSet<>(List.of(30, 10, 20, 10));

System.out.println(t);                  // [10, 20, 30]
System.out.println(t.first());          // 10
System.out.println(t.floor(25));        // 20
System.out.println(t.higher(20));       // 30
System.out.println(t.headSet(30));      // [10, 20]
System.out.println(t.descendingSet());  // [30, 20, 10]
`),
    keywords: ['treeset', 'sortiert', 'sorted set', 'navigable', 'floor', 'ceiling'],
    related: ['Set', 'TreeMap', 'Comparator'],
    mdn: A + 'util/TreeSet.html'
  },
  {
    lang: 'java', group: G4, name: 'Set.of()',
    desc: "Erzeugt seit Java 9 ein unveränderliches Set ohne Duplikate und ohne `null`.",
    details: "Doppelte Elemente beim Aufruf führen zu einer `IllegalArgumentException`, `null` zu einer `NullPointerException`. Die Iterationsreihenfolge ist unbestimmt und kann sich zwischen Programmläufen ändern, man darf sich also nicht auf sie verlassen. Für Daten aus einer Collection mit eventuell doppelten Werten nutzt man `Set.copyOf()`.",
    syntax: "Set.of(e1, e2, ...)\nSet.copyOf(collection)",
    example: e(`
Set<String> s = Set.of("a", "b", "c");
System.out.println(s.contains("b"));   // true
System.out.println(s.size());          // 3

Set<Integer> aus = Set.copyOf(List.of(1, 1, 2));   // Duplikate sind hier erlaubt
System.out.println(aus.size());        // 2

// Set.of("a", "a");                   // IllegalArgumentException
`),
    keywords: ['Set.of', 'copyOf', 'immutable', 'unveränderlich', 'menge', 'literal'],
    related: ['Unveränderliche Collections', 'List.of()', 'Map.of()', 'Set'],
    mdn: A + 'util/Set.html'
  },
  {
    lang: 'java', group: G4, name: 'Mengenoperationen',
    desc: "Vereinigung, Schnitt und Differenz zweier Collections mit `addAll`, `retainAll`, `removeAll`.",
    details: "Alle drei Methoden verändern die Collection, auf der sie aufgerufen werden. Wer die Originale behalten will, kopiert vorher. `containsAll()` prüft die Teilmengenbeziehung. Auf unveränderlichen Mengen (`Set.of`) werfen die Methoden eine `UnsupportedOperationException`.",
    syntax: "a.addAll(b)      // Vereinigung\na.retainAll(b)   // Schnittmenge\na.removeAll(b)   // Differenz a ohne b\na.containsAll(b) // b ist Teilmenge von a",
    example: e(`
Set<Integer> a = new TreeSet<>(List.of(1, 2, 3));
Set<Integer> b = new TreeSet<>(List.of(2, 3, 4));

Set<Integer> vereinigung = new TreeSet<>(a);
vereinigung.addAll(b);
System.out.println(vereinigung);   // [1, 2, 3, 4]

Set<Integer> schnitt = new TreeSet<>(a);
schnitt.retainAll(b);
System.out.println(schnitt);       // [2, 3]

Set<Integer> differenz = new TreeSet<>(a);
differenz.removeAll(b);
System.out.println(differenz);     // [1]

System.out.println(a.containsAll(schnitt));   // true
`),
    keywords: ['vereinigung', 'schnittmenge', 'differenz', 'union', 'intersection', 'difference', 'addAll', 'retainAll', 'removeAll', 'containsAll'],
    related: ['Set', 'TreeSet', 'List.contains()'],
    mdn: A + 'util/Collection.html'
  },
  {
    lang: 'java', group: G4, name: 'Queue',
    desc: "Warteschlange nach dem FIFO-Prinzip: hinten einfügen, vorne entnehmen.",
    details: "Das Interface `Queue` hat jede Operation in zwei Varianten: Die eine wirft bei Misserfolg eine Exception (`add`, `remove`, `element`), die andere liefert einen Sonderwert (`offer`, `poll`, `peek` geben `false` oder `null`). `poll()` und `peek()` geben bei leerer Queue also `null` zurück. Implementierungen: `ArrayDeque`, `LinkedList`, `PriorityQueue`.",
    syntax: "Queue<Typ> q = new ArrayDeque<>();",
    values: [
      ['offer(e) / add(e)', 'Hinten einfügen (add wirft bei Fehlschlag)'],
      ['poll() / remove()', 'Vorderstes entnehmen (poll liefert null bei leer)'],
      ['peek() / element()', 'Vorderstes ansehen, ohne zu entnehmen']
    ],
    example: e(`
Queue<String> q = new ArrayDeque<>();
q.offer("a");
q.offer("b");

System.out.println(q.peek());   // a
System.out.println(q.poll());   // a
System.out.println(q.poll());   // b
System.out.println(q.poll());   // null (leer)
`),
    keywords: ['queue', 'warteschlange', 'fifo', 'offer', 'poll', 'peek'],
    related: ['Deque', 'ArrayDeque', 'PriorityQueue', 'LinkedList'],
    mdn: A + 'util/Queue.html'
  },
  {
    lang: 'java', group: G4, name: 'Deque',
    desc: "Doppelendige Queue: an beiden Enden einfügen und entnehmen, auch als Stack nutzbar.",
    details: "`Deque` bietet `addFirst`, `addLast`, `pollFirst`, `pollLast`, `peekFirst`, `peekLast` sowie die Stack-Methoden `push` (vorne einfügen), `pop` (vorne entnehmen) und `peek`. Statt der älteren Klasse `Stack` verwendet man `Deque` mit `ArrayDeque`. Beachte: `pop()` auf einem leeren Deque wirft `NoSuchElementException`, `pollFirst()` liefert `null`.",
    syntax: "Deque<Typ> d = new ArrayDeque<>();",
    example: e(`
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.push(2);
stack.push(3);
System.out.println(stack.pop());    // 3 (zuletzt eingefügt)
System.out.println(stack.peek());   // 2

Deque<String> d = new ArrayDeque<>();
d.addLast("b");
d.addFirst("a");
System.out.println(d);              // [a, b]
System.out.println(d.pollLast());   // b
`),
    tip: "Für einen Stack `Deque<Integer> stack = new ArrayDeque<>()` statt `Stack`.",
    keywords: ['deque', 'stack', 'stapel', 'lifo', 'push', 'pop', 'doppelendig'],
    related: ['ArrayDeque', 'Queue', 'LinkedList', 'SequencedCollection'],
    mdn: A + 'util/Deque.html'
  },
  {
    lang: 'java', group: G4, name: 'ArrayDeque',
    desc: "Array-basierte Deque: die beste Wahl für Stack und Queue.",
    details: "Schneller und speichersparender als `LinkedList` für Stack- und Queue-Zwecke. `ArrayDeque` erlaubt keine `null`-Elemente und ist nicht thread-sicher. Der Zugriff per Index ist nicht möglich; zum Durchlaufen dient der Iterator.",
    syntax: "new ArrayDeque<>()\nnew ArrayDeque<>(Collection<? extends E> c)",
    example: e(`
Deque<String> d = new ArrayDeque<>();
d.offerLast("a");
d.offerLast("b");
d.offerFirst("z");

System.out.println(d);   // [z, a, b]

for (String s : d) System.out.print(s);   // zab
System.out.println();
`),
    keywords: ['arraydeque', 'stack', 'queue', 'deque'],
    related: ['Deque', 'Queue', 'LinkedList'],
    mdn: A + 'util/ArrayDeque.html'
  },
  {
    lang: 'java', group: G4, name: 'PriorityQueue',
    desc: "Queue, die immer das kleinste (bzw. nach Comparator erste) Element zuerst liefert.",
    details: "Die Elemente sind `Comparable` oder es wird ein `Comparator` übergeben. `poll()` und `peek()` liefern das Minimum; `add` und `poll` kosten logarithmische Zeit. Die Iteration und `toString()` zeigen die Elemente nicht sortiert, sondern in interner Heap-Ordnung. Für ein Maximum dreht man den Comparator um.",
    syntax: "new PriorityQueue<>()\nnew PriorityQueue<>(Comparator<? super E> c)",
    example: e(`
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.add(5);
pq.add(1);
pq.add(3);

System.out.println(pq.poll());   // 1
System.out.println(pq.poll());   // 3
System.out.println(pq.poll());   // 5

PriorityQueue<Integer> max = new PriorityQueue<>(Comparator.reverseOrder());
max.addAll(List.of(5, 1, 3));
System.out.println(max.poll());  // 5
`),
    tip: "Zum sortierten Ausgeben wiederholt `poll()` aufrufen, nicht die Queue ausgeben.",
    keywords: ['priorityqueue', 'prioritätswarteschlange', 'heap', 'minimum', 'maximum', 'priorität'],
    related: ['Queue', 'Comparator', 'TreeSet'],
    mdn: A + 'util/PriorityQueue.html'
  },
  // ---------------- Lambdas & Funktionale Interfaces ----------------
  {
    lang: 'java', group: G5, name: 'Lambda-Ausdrücke',
    desc: "Kurzschreibweise für eine anonyme Funktion, die ein funktionales Interface implementiert.",
    details: "Ein Lambda hat die Form `(Parameter) -> Ausdruck` oder `(Parameter) -> { Anweisungen; }`. Der Typ der Parameter wird aus dem Zielinterface abgeleitet; bei genau einem Parameter sind die runden Klammern optional. Ein Lambda ist nur dort erlaubt, wo ein funktionales Interface erwartet wird, also ein Interface mit genau einer abstrakten Methode. Im Gegensatz zu einer anonymen Klasse bezieht sich `this` im Lambda auf die umgebende Klasse.",
    syntax: "(a, b) -> a + b\nx -> x * 2\n() -> System.out.println(\"Hallo\")\n(String s) -> { return s.trim(); }",
    example: e(`
Function<Integer, Integer> doppelt = x -> x * 2;
BinaryOperator<Integer> summe = (a, b) -> a + b;
Runnable r = () -> System.out.println("läuft");
Comparator<String> nachLaenge = (a, b) -> Integer.compare(a.length(), b.length());

System.out.println(doppelt.apply(4));    // 8
System.out.println(summe.apply(2, 3));   // 5
r.run();                                 // läuft
System.out.println(nachLaenge.compare("aa", "b"));   // 1
`),
    tip: "Ein Lambda mit mehreren Zeilen ist meist ein Zeichen, die Logik in eine benannte Methode auszulagern und per `::` zu übergeben.",
    keywords: ['lambda', 'anonyme funktion', 'closure', 'pfeil', '->', 'funktionales interface', 'FunctionalInterface'],
    related: ['Methodenreferenzen (::)', 'Effektiv final', 'Function', 'Predicate'],
    mdn: D + 'lambdas/'
  },
  {
    lang: 'java', group: G5, name: 'Methodenreferenzen (::)',
    desc: "Kurzform für ein Lambda, das nur eine vorhandene Methode aufruft.",
    details: "Es gibt vier Arten: statische Methode (`Integer::parseInt`), Methode an einem bestimmten Objekt (`System.out::println`), Methode am ersten Parameter (`String::length`) und Konstruktor (`ArrayList::new`). Der Compiler passt die Signatur an das Zielinterface an. Bei überladenen Methoden kann das mehrdeutig sein, dann hilft ein ausgeschriebenes Lambda.",
    syntax: "Klasse::statischeMethode\nobjekt::methode\nKlasse::instanzMethode\nKlasse::new",
    values: [
      ['Integer::parseInt', 'Statische Methode: s -> Integer.parseInt(s)'],
      ['System.out::println', 'Gebundenes Objekt: x -> System.out.println(x)'],
      ['String::toUpperCase', 'Instanzmethode: s -> s.toUpperCase()'],
      ['ArrayList::new', 'Konstruktor: () -> new ArrayList<>()']
    ],
    example: e(`
List<String> z = List.of("3", "1", "2");

List<Integer> zahlen = z.stream().map(Integer::parseInt).toList();
System.out.println(zahlen);   // [3, 1, 2]

z.forEach(System.out::print);   // 312
System.out.println();

Supplier<List<String>> fabrik = ArrayList::new;
List<String> neu = fabrik.get();
neu.add("x");
System.out.println(neu);   // [x]
`),
    keywords: ['methodenreferenz', 'method reference', '::', 'doppelpunkt', 'konstruktorreferenz'],
    related: ['Lambda-Ausdrücke', 'Function', 'Supplier', 'Stream.map()'],
    mdn: D + 'lambdas/'
  },
  {
    lang: 'java', group: G5, name: 'Function',
    desc: "Funktionales Interface `Function<T, R>`: nimmt einen Wert und liefert ein Ergebnis.",
    details: "Die abstrakte Methode ist `R apply(T t)`. Mit `andThen(g)` führt man erst die eine, dann die andere Funktion aus, `compose(g)` dreht die Reihenfolge um. `Function.identity()` gibt den Eingabewert unverändert zurück. Für Eingabe und Ausgabe desselben Typs gibt es `UnaryOperator<T>`.",
    syntax: "Function<T, R> f = x -> ...;\nR ergebnis = f.apply(wert);",
    example: e(`
Function<String, Integer> laenge = String::length;
Function<Integer, Integer> quadrat = x -> x * x;

System.out.println(laenge.apply("Java"));                 // 4
System.out.println(laenge.andThen(quadrat).apply("Java"));  // 16
System.out.println(quadrat.compose(laenge).apply("abc"));   // 9
System.out.println(Function.<String>identity().apply("x")); // x
`),
    keywords: ['function', 'apply', 'andThen', 'compose', 'identity', 'abbildung', 'transformation'],
    related: ['BiFunction', 'UnaryOperator', 'Stream.map()', 'Primitive funktionale Interfaces'],
    mdn: A + 'util/function/Function.html'
  },
  {
    lang: 'java', group: G5, name: 'BiFunction',
    desc: "Funktionales Interface `BiFunction<T, U, R>`: zwei Eingaben, ein Ergebnis.",
    details: "Die Methode heißt `apply(T t, U u)`. Es gibt keine `compose`-Methode, aber `andThen(g)`, das die Ausgabe an eine `Function` weiterreicht. Haben alle drei Typen denselben Typ, nimmt man `BinaryOperator<T>`. Die Spezialformen `BiConsumer` und `BiPredicate` folgen demselben Muster.",
    syntax: "BiFunction<T, U, R> f = (a, b) -> ...;",
    example: e(`
BiFunction<String, Integer, String> wiederhole = (s, n) -> s.repeat(n);
System.out.println(wiederhole.apply("ab", 3));   // ababab

BiFunction<Integer, Integer, Integer> summe = Integer::sum;
System.out.println(summe.andThen(x -> x * 10).apply(2, 3));   // 50
`),
    keywords: ['bifunction', 'zwei parameter', 'apply', 'andThen'],
    related: ['Function', 'BinaryOperator', 'Map.merge()'],
    mdn: A + 'util/function/BiFunction.html'
  },
  {
    lang: 'java', group: G5, name: 'Supplier',
    desc: "Funktionales Interface `Supplier<T>`: liefert einen Wert ohne Eingabe.",
    details: "Die Methode ist `T get()`. Suppliers verzögern die Erzeugung eines Werts, bis er gebraucht wird (lazy), etwa bei `Optional.orElseGet()` oder `Stream.generate()`. Bei jedem Aufruf kann ein neuer Wert entstehen, etwa über eine Konstruktorreferenz wie `ArrayList::new`.",
    syntax: "Supplier<T> s = () -> ...;\nT wert = s.get();",
    example: e(`
Supplier<Double> zufall = Math::random;
Supplier<List<String>> neueListe = ArrayList::new;

System.out.println(zufall.get() < 1.0);   // true
List<String> a = neueListe.get();
List<String> b = neueListe.get();
System.out.println(a == b);               // false (jeweils neue Liste)

System.out.println(Stream.generate(() -> "x").limit(3).toList());   // [x, x, x]
`),
    keywords: ['supplier', 'get', 'lieferant', 'fabrik', 'factory', 'lazy', 'generate'],
    related: ['Methodenreferenzen (::)', 'Stream.iterate()', 'Function'],
    mdn: A + 'util/function/Supplier.html'
  },
  {
    lang: 'java', group: G5, name: 'Consumer',
    desc: "Funktionales Interface `Consumer<T>`: verarbeitet einen Wert ohne Rückgabe.",
    details: "Die Methode ist `void accept(T t)`. Typisch für Seiteneffekte wie Ausgaben oder Speichern, z. B. bei `forEach` und `peek`. Mit `andThen(c)` verkettet man zwei Consumer, die nacheinander mit demselben Wert laufen. Die Zwei-Parameter-Variante ist `BiConsumer`.",
    syntax: "Consumer<T> c = x -> ...;\nc.accept(wert);",
    example: e(`
Consumer<String> ausgabe = s -> System.out.println("> " + s);
Consumer<String> zweimal = ausgabe.andThen(s -> System.out.println(s.length()));

zweimal.accept("Java");   // > Java
                          // 4
List.of("a", "b").forEach(ausgabe);   // > a, > b
`),
    keywords: ['consumer', 'accept', 'andThen', 'seiteneffekt', 'verbraucher'],
    related: ['List.forEach()', 'Stream.peek()', 'Stream.forEach()'],
    mdn: A + 'util/function/Consumer.html'
  },
  {
    lang: 'java', group: G5, name: 'Predicate',
    desc: "Funktionales Interface `Predicate<T>`: prüft einen Wert und liefert `boolean`.",
    details: "Die Methode ist `boolean test(T t)`. Prädikate lassen sich mit `and()`, `or()` und `negate()` kombinieren. `Predicate.not(...)` (seit Java 11) negiert eine Methodenreferenz, `Predicate.isEqual(x)` prüft auf Gleichheit. Verwendet wird es u. a. bei `filter`, `removeIf` und `anyMatch`.",
    syntax: "Predicate<T> p = x -> ...;\nboolean ok = p.test(wert);",
    example: e(`
Predicate<String> leer = String::isEmpty;
Predicate<String> kurz = s -> s.length() < 3;

System.out.println(leer.test(""));                   // true
System.out.println(kurz.and(leer.negate()).test("ab")); // true
System.out.println(kurz.or(leer).test("lang"));      // false

List<String> l = List.of("a", "", "b");
System.out.println(l.stream().filter(Predicate.not(String::isEmpty)).toList());   // [a, b]
`),
    keywords: ['predicate', 'test', 'bedingung', 'filter', 'negate', 'and', 'or', 'not'],
    related: ['Stream.filter()', 'List.removeIf()', 'Stream.anyMatch()'],
    mdn: A + 'util/function/Predicate.html'
  },
  {
    lang: 'java', group: G5, name: 'UnaryOperator',
    desc: "`UnaryOperator<T>` ist eine `Function<T, T>`: Eingabe und Ausgabe haben denselben Typ.",
    details: "Das Interface erbt `apply` und `andThen` von `Function`. Es wird vor allem für Operationen verwendet, die Werte gleichen Typs ersetzen, etwa `List.replaceAll()` oder `Stream.iterate()`. `UnaryOperator.identity()` gibt den Wert unverändert zurück.",
    syntax: "UnaryOperator<T> op = x -> ...;",
    example: e(`
UnaryOperator<String> gross = String::toUpperCase;
System.out.println(gross.apply("java"));   // JAVA

List<String> l = new ArrayList<>(List.of("a", "b"));
l.replaceAll(gross);
System.out.println(l);   // [A, B]
`),
    keywords: ['unaryoperator', 'unär', 'replaceAll', 'gleicher typ'],
    related: ['Function', 'BinaryOperator', 'List.set()'],
    mdn: A + 'util/function/UnaryOperator.html'
  },
  {
    lang: 'java', group: G5, name: 'BinaryOperator',
    desc: "`BinaryOperator<T>` ist eine `BiFunction<T, T, T>`: zwei Werte gleichen Typs ergeben einen.",
    details: "Passt für Reduktionen wie `Stream.reduce()` und für `Map.merge()`. Hilfsmethoden sind `BinaryOperator.minBy(comparator)` und `maxBy(comparator)`. Für Summen von `int` gibt es vorgefertigte Referenzen wie `Integer::sum`, `Integer::max` und `Math::min`.",
    syntax: "BinaryOperator<T> op = (a, b) -> ...;",
    example: e(`
BinaryOperator<Integer> max = BinaryOperator.maxBy(Comparator.naturalOrder());
System.out.println(max.apply(3, 7));   // 7

BinaryOperator<Integer> summe = Integer::sum;
System.out.println(Stream.of(1, 2, 3).reduce(0, summe));   // 6
`),
    keywords: ['binaryoperator', 'binär', 'reduce', 'minBy', 'maxBy', 'verknüpfen'],
    related: ['BiFunction', 'Stream.reduce()', 'Map.merge()'],
    mdn: A + 'util/function/BinaryOperator.html'
  },
  {
    lang: 'java', group: G5, name: 'Primitive funktionale Interfaces',
    desc: "Varianten für `int`, `long` und `double`, die Boxing vermeiden.",
    details: "Zu den generischen Interfaces gibt es Spezialisierungen: `IntPredicate`, `IntFunction<R>`, `IntUnaryOperator`, `IntBinaryOperator`, `ToIntFunction<T>`, `IntSupplier`, `IntConsumer` sowie die Entsprechungen für `Long` und `Double`. Sie sparen das Ein- und Auspacken, was bei großen Datenmengen relevant ist. Die Methodennamen unterscheiden sich: z. B. `applyAsInt`, `test`, `getAsInt`. `BooleanSupplier` und `ObjIntConsumer` runden das Bild ab.",
    values: [
      ['IntPredicate', 'int -> boolean (test)'],
      ['IntFunction<R>', 'int -> R (apply)'],
      ['ToIntFunction<T>', 'T -> int (applyAsInt)'],
      ['IntUnaryOperator', 'int -> int (applyAsInt)'],
      ['IntBinaryOperator', '(int, int) -> int (applyAsInt)'],
      ['IntSupplier', '() -> int (getAsInt)'],
      ['IntConsumer', 'int -> void (accept)']
    ],
    example: e(`
IntPredicate gerade = n -> n % 2 == 0;
IntUnaryOperator plusEins = n -> n + 1;
IntBinaryOperator mal = (a, b) -> a * b;
ToIntFunction<String> laenge = String::length;

System.out.println(gerade.test(4));          // true
System.out.println(plusEins.applyAsInt(4));  // 5
System.out.println(mal.applyAsInt(3, 4));    // 12
System.out.println(laenge.applyAsInt("abc")); // 3
`),
    keywords: ['IntFunction', 'IntPredicate', 'ToIntFunction', 'IntUnaryOperator', 'IntBinaryOperator', 'boxing', 'primitive', 'applyAsInt'],
    related: ['Function', 'Predicate', 'IntStream', 'Stream.mapToInt()'],
    mdn: A + 'util/function/package-summary.html'
  },
  {
    lang: 'java', group: G5, name: 'Effektiv final',
    desc: "Lambdas dürfen nur lokale Variablen lesen, die nach der Zuweisung nie mehr geändert werden.",
    details: "Eine Variable gilt als effektiv final, wenn sie genau einmal zugewiesen wird, auch ohne das Schlüsselwort `final`. Wird sie danach geändert, meldet der Compiler einen Fehler, sobald ein Lambda oder eine anonyme Klasse sie verwendet. Felder und Array-Inhalte unterliegen dieser Regel nicht. Wer in einem Lambda zählen oder aufsammeln will, nimmt `AtomicInteger`, eine Collection oder besser einen Stream mit Reduktion.",
    example: e(`
int faktor = 3;
Function<Integer, Integer> f = x -> x * faktor;
// faktor++;   // Fehler: local variables referenced from a lambda expression must be final or effectively final
System.out.println(f.apply(5));   // 15

AtomicInteger zaehler = new AtomicInteger();
List.of(1, 2, 3).forEach(x -> zaehler.addAndGet(x));
System.out.println(zaehler.get());   // 6

int summe = Stream.of(1, 2, 3).mapToInt(Integer::intValue).sum();   // meist die bessere Lösung
System.out.println(summe);           // 6
`),
    tip: "Lieber mit `reduce`, `sum` oder `collect` rechnen, statt Variablen aus dem Lambda heraus zu verändern.",
    keywords: ['effectively final', 'effektiv final', 'capture', 'lambda variable', 'must be final', 'AtomicInteger'],
    related: ['Lambda-Ausdrücke', 'Stream.reduce()', 'Stream.forEach()'],
    mdn: D + 'lambdas/'
  },

  // ---------------- Streams ----------------
  {
    lang: 'java', group: G6, name: 'Stream-Grundlagen',
    desc: "Eine Pipeline aus Quelle, Zwischenoperationen und genau einer Endoperation.",
    details: "Ein Stream speichert keine Daten, sondern beschreibt eine Verarbeitung: Quelle (z. B. `list.stream()`), Zwischenoperationen (`filter`, `map`, `sorted`) und eine Endoperation (`collect`, `forEach`, `count`). Zwischenoperationen sind lazy und laufen erst, wenn eine Endoperation ausgelöst wird. Ein Stream darf nur einmal konsumiert werden, danach wirft jeder Zugriff `IllegalStateException`. Die Quelle wird nicht verändert.",
    syntax: "quelle.stream().zwischenOp(...).zwischenOp(...).endOp(...)",
    example: e(`
Stream<String> s = Stream.of("a", "bb", "ccc").filter(x -> {
    System.out.println("filter " + x);
    return x.length() > 1;
});
System.out.println("noch nichts passiert");

System.out.println(s.count());   // filter a, filter bb, filter ccc, dann 2

try {
    s.count();   // zweite Nutzung
} catch (IllegalStateException ex) {
    System.out.println("Stream schon verbraucht");
}
`),
    tip: "Soll ein Stream mehrfach genutzt werden, die Quelle behalten und jeweils einen neuen Stream erzeugen (oder `Supplier<Stream<T>>`).",
    keywords: ['stream', 'pipeline', 'lazy', 'zwischenoperation', 'endoperation', 'terminal', 'intermediate', 'einmal nutzbar', 'IllegalStateException'],
    related: ['Collection.stream()', 'Stream.of()', 'Stream.collect()', 'Parallele Streams'],
    mdn: A + 'util/stream/package-summary.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.of()',
    desc: "Erzeugt einen Stream aus einzelnen Werten; dazu `empty()`, `generate()` und `ofNullable()`.",
    details: "`Stream.of(a, b, c)` erstellt einen Stream aus den Argumenten. Übergibt man ein Objekt-Array, werden dessen Elemente gestreamt, bei einem `int[]` aber entsteht ein Stream mit genau einem Element (dem Array). Für primitive Arrays gibt es `Arrays.stream()` bzw. `IntStream.of()`. `Stream.ofNullable(x)` (seit Java 9) liefert einen leeren Stream für `null`.",
    syntax: "Stream.of(T... werte)\nStream.empty()\nStream.generate(Supplier<T> s)\nStream.ofNullable(T t)",
    example: e(`
Stream<String> s = Stream.of("a", "b", "c");
System.out.println(s.count());   // 3

String[] arr = {"x", "y"};
System.out.println(Stream.of(arr).count());    // 2

int[] zahlen = {1, 2, 3};
System.out.println(Stream.of(zahlen).count()); // 1  (ein Element: das Array)
System.out.println(IntStream.of(zahlen).count()); // 3

System.out.println(Stream.ofNullable(null).count()); // 0
`),
    keywords: ['Stream.of', 'stream erzeugen', 'empty', 'generate', 'ofNullable', 'varargs'],
    related: ['Collection.stream()', 'IntStream', 'Stream.iterate()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Collection.stream()',
    desc: "Erzeugt einen Stream aus einer Collection; `parallelStream()` einen parallelen.",
    details: "Alle `Collection`s haben `stream()`. Für eine `Map` streamt man `entrySet()`, `keySet()` oder `values()`. Für Arrays gibt es `Arrays.stream()`, für Strings `String.chars()` und `String.lines()`. Der Stream liest zum Zeitpunkt der Endoperation aus der Collection; sie darf währenddessen nicht verändert werden.",
    syntax: "collection.stream()\ncollection.parallelStream()\nmap.entrySet().stream()",
    example: e(`
List<String> l = List.of("a", "bb", "ccc");
System.out.println(l.stream().mapToInt(String::length).sum());   // 6

Set<Integer> s = new TreeSet<>(Set.of(3, 1, 2));
System.out.println(s.stream().map(n -> n * 2).toList());   // [2, 4, 6]

Map<String, Integer> m = new TreeMap<>(Map.of("a", 1, "b", 2));
System.out.println(m.entrySet().stream().map(Map.Entry::getKey).toList());   // [a, b]
`),
    keywords: ['stream', 'collection stream', 'stream aus liste', 'entrySet', 'parallelStream'],
    related: ['Stream.of()', 'Parallele Streams', 'Map.entrySet()', 'IntStream'],
    mdn: A + 'util/Collection.html'
  },
  {
    lang: 'java', group: G6, name: 'IntStream',
    desc: "Stream für `int`-Werte ohne Boxing, mit `range()`, `sum()`, `average()` und mehr.",
    details: "`IntStream.range(a, b)` läuft von a bis b exklusive, `rangeClosed(a, b)` inklusive. Es gibt `sum()`, `max()`, `min()`, `average()` und `count()`; max, min und average liefern ein `Optional`-Äquivalent (`OptionalInt`, `OptionalDouble`). Mit `boxed()` wird ein `Stream<Integer>`, mit `mapToObj()` ein Stream beliebiger Objekte. Analog gibt es `LongStream` und `DoubleStream`.",
    syntax: "IntStream.range(0, n)\nIntStream.rangeClosed(1, n)\nIntStream.of(1, 2, 3)",
    example: e(`
System.out.println(IntStream.rangeClosed(1, 5).sum());           // 15
System.out.println(IntStream.range(0, 5).boxed().toList());      // [0, 1, 2, 3, 4]
System.out.println(IntStream.of(3, 1, 2).max().getAsInt());      // 3
System.out.println(IntStream.of(1, 2).average().orElse(0));      // 1.5
System.out.println(IntStream.range(0, 3).mapToObj(i -> "#" + i).toList());   // [#0, #1, #2]
System.out.println("abc".chars().mapToObj(c -> String.valueOf((char) c)).toList());   // [a, b, c]
`),
    tip: "Statt einer klassischen for-Schleife mit Index: `IntStream.range(0, n).forEach(i -> ...)`.",
    keywords: ['IntStream', 'range', 'rangeClosed', 'sum', 'average', 'primitive stream', 'LongStream', 'DoubleStream', 'zahlenfolge'],
    related: ['Stream.mapToInt()', 'Primitive funktionale Interfaces', 'Stream.of()'],
    mdn: A + 'util/stream/IntStream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.iterate()',
    desc: "Erzeugt einen Stream aus Startwert und Folgefunktion, optional mit Abbruchbedingung.",
    details: "`Stream.iterate(start, f)` ist unendlich und braucht deshalb `limit()` oder `takeWhile()`. Die Variante mit Predicate `iterate(start, hasNext, next)` (seit Java 9) endet selbst, ähnlich einer for-Schleife. Für Werte ohne Vorgänger gibt es `Stream.generate(supplier)`.",
    syntax: "Stream.iterate(T start, UnaryOperator<T> next)\nStream.iterate(T start, Predicate<T> hasNext, UnaryOperator<T> next)",
    example: e(`
System.out.println(Stream.iterate(1, x -> x * 2).limit(5).toList());       // [1, 2, 4, 8, 16]
System.out.println(Stream.iterate(1, x -> x < 100, x -> x * 3).toList());  // [1, 3, 9, 27, 81]
`),
    tip: "Ein unendlicher Stream ohne `limit` oder Abbruchbedingung läuft endlos.",
    keywords: ['iterate', 'generate', 'unendlich', 'folge', 'infinite', 'limit'],
    related: ['Stream.limit()', 'Stream.takeWhile()', 'Supplier', 'IntStream'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.filter()',
    desc: "Behält nur die Elemente, die ein Predicate erfüllen.",
    details: "`filter` ist eine Zwischenoperation und behält die Reihenfolge. Mehrere `filter`-Aufrufe lassen sich mit `&&` in einem Predicate zusammenfassen. Das Predicate sollte keine Seiteneffekte haben.",
    syntax: "Stream<T> filter(Predicate<? super T> p)",
    example: e(`
List<Integer> z = List.of(1, 2, 3, 4, 5, 6);

System.out.println(z.stream().filter(n -> n % 2 == 0).toList());   // [2, 4, 6]
System.out.println(z.stream().filter(n -> n > 2).filter(n -> n < 5).toList());   // [3, 4]
`),
    keywords: ['filter', 'filtern', 'auswählen', 'where', 'bedingung'],
    related: ['Predicate', 'Stream.map()', 'List.removeIf()', 'Stream.takeWhile()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.map()',
    desc: "Wandelt jedes Element mit einer Funktion in ein anderes um.",
    details: "`map` erzeugt aus n Elementen genau n neue Elemente, gegebenenfalls eines anderen Typs. Für primitive Ergebnisse gibt es `mapToInt`, `mapToLong` und `mapToDouble`. Wenn die Funktion pro Element einen Stream oder mehrere Werte liefert, braucht man `flatMap`.",
    syntax: "<R> Stream<R> map(Function<? super T, ? extends R> f)",
    example: e(`
List<String> w = List.of("Ada", "Linus");

System.out.println(w.stream().map(String::toUpperCase).toList());   // [ADA, LINUS]
System.out.println(w.stream().map(String::length).toList());        // [3, 5]
`),
    keywords: ['map', 'umwandeln', 'transformieren', 'abbilden', 'select'],
    related: ['Function', 'Stream.flatMap()', 'Stream.mapToInt()', 'Stream.filter()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.flatMap()',
    desc: "Wandelt jedes Element in einen Stream um und fügt alle Ergebnisse zu einem zusammen.",
    details: "Typischer Einsatz: eine Liste von Listen in eine flache Liste verwandeln oder Texte in Wörter zerlegen. Die Funktion muss einen Stream liefern; für `Optional` und Ähnliches vorher `stream()` aufrufen. Ein Element, das auf einen leeren Stream abgebildet wird, verschwindet aus dem Ergebnis.",
    syntax: "<R> Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> f)",
    example: e(`
List<List<Integer>> verschachtelt = List.of(List.of(1, 2), List.of(3), List.of(4, 5));
System.out.println(verschachtelt.stream().flatMap(List::stream).toList());   // [1, 2, 3, 4, 5]

List<String> saetze = List.of("a b", "c d e");
System.out.println(saetze.stream().flatMap(s -> Stream.of(s.split(" "))).toList());   // [a, b, c, d, e]
`),
    keywords: ['flatMap', 'flach', 'verschachtelt', 'flatten', 'liste von listen'],
    related: ['Stream.map()', 'Stream.mapMulti()', 'Collection.stream()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.mapToInt()',
    desc: "Bildet Elemente auf `int` ab und liefert einen `IntStream` ohne Boxing.",
    details: "Danach stehen `sum()`, `average()`, `max()`, `min()` und `summaryStatistics()` direkt zur Verfügung, die es beim `Stream<Integer>` nicht gibt. `mapToLong` und `mapToDouble` funktionieren entsprechend. Zurück zum Objekt-Stream geht es mit `boxed()` oder `mapToObj()`.",
    syntax: "IntStream mapToInt(ToIntFunction<? super T> f)",
    example: e(`
List<String> w = List.of("a", "bb", "ccc");

System.out.println(w.stream().mapToInt(String::length).sum());   // 6
System.out.println(w.stream().mapToInt(String::length).max().getAsInt());   // 3
System.out.println(w.stream().mapToInt(String::length).average().orElse(0)); // 2.0

IntSummaryStatistics st = w.stream().mapToInt(String::length).summaryStatistics();
System.out.println(st.getMin() + " " + st.getMax() + " " + st.getSum());   // 1 3 6
`),
    keywords: ['mapToInt', 'mapToDouble', 'mapToLong', 'summe', 'durchschnitt', 'summaryStatistics', 'primitive'],
    related: ['IntStream', 'Stream.map()', 'Collectors.summingInt()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.sorted()',
    desc: "Sortiert die Elemente, in natürlicher Ordnung oder mit Comparator.",
    details: "`sorted()` ohne Argument verlangt `Comparable`-Elemente, sonst gibt es eine `ClassCastException`. Mit `sorted(comparator)` bestimmt man die Reihenfolge selbst. Die Operation ist zustandsbehaftet: sie muss alle Elemente sehen, bevor das erste weitergegeben wird, was sie bei unendlichen Streams unbrauchbar macht. Die Sortierung ist stabil bei geordneten Streams.",
    syntax: "Stream<T> sorted()\nStream<T> sorted(Comparator<? super T> c)",
    example: e(`
List<String> w = List.of("Birne", "Kiwi", "Apfel");

System.out.println(w.stream().sorted().toList());   // [Apfel, Birne, Kiwi]
System.out.println(w.stream().sorted(Comparator.comparing(String::length)).toList());   // [Kiwi, Birne, Apfel]
System.out.println(w.stream().sorted(Comparator.reverseOrder()).toList());   // [Kiwi, Birne, Apfel]
`),
    keywords: ['sorted', 'sortieren', 'ordnen', 'comparator', 'order by'],
    related: ['Comparator', 'Comparator.comparing()', 'List.sort()', 'Stream.min()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.distinct()',
    desc: "Entfernt Duplikate anhand von `equals()`.",
    details: "Das jeweils erste Vorkommen bleibt, die Reihenfolge bleibt bei geordneten Streams erhalten. Die Operation braucht ein korrektes `equals()` und `hashCode()` der Elemente. Intern wird ein Set aufgebaut, sie ist also zustandsbehaftet.",
    syntax: "Stream<T> distinct()",
    example: e(`
System.out.println(Stream.of(3, 1, 3, 2, 1).distinct().toList());   // [3, 1, 2]
System.out.println(Stream.of("a", "A", "a").distinct().count());    // 2
`),
    keywords: ['distinct', 'duplikate entfernen', 'eindeutig', 'unique'],
    related: ['LinkedHashSet', 'equals und hashCode in Collections', 'Collectors.toSet()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.limit()',
    desc: "Begrenzt den Stream auf die ersten n Elemente.",
    details: "`limit` ist eine Kurzschluss-Operation und macht unendliche Streams erst endlich. Bei `iterate` oder `generate` wird nur so viel berechnet, wie nötig ist; `sorted().limit(n)` muss trotzdem alle Elemente lesen. Bei parallelen, geordneten Streams kann `limit` teuer werden.",
    syntax: "Stream<T> limit(long maxGroesse)",
    example: e(`
System.out.println(Stream.of(1, 2, 3, 4, 5).limit(3).toList());              // [1, 2, 3]
System.out.println(Stream.iterate(1, x -> x + 1).limit(4).toList());         // [1, 2, 3, 4]
`),
    keywords: ['limit', 'begrenzen', 'erste n', 'top n', 'head'],
    related: ['Stream.skip()', 'Stream.iterate()', 'Stream.takeWhile()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.skip()',
    desc: "Überspringt die ersten n Elemente.",
    details: "Zusammen mit `limit` lässt sich Paginierung bauen: `skip(seite * groesse).limit(groesse)`. Sind weniger als n Elemente vorhanden, ist das Ergebnis leer. Wie `limit` kann `skip` bei parallelen, geordneten Streams teuer sein.",
    syntax: "Stream<T> skip(long n)",
    example: e(`
List<Integer> z = List.of(1, 2, 3, 4, 5, 6, 7);

System.out.println(z.stream().skip(2).toList());               // [3, 4, 5, 6, 7]
System.out.println(z.stream().skip(3).limit(2).toList());      // [4, 5]  (überspringen, dann begrenzen)
`),
    keywords: ['skip', 'überspringen', 'paginierung', 'offset', 'seite'],
    related: ['Stream.limit()', 'List.subList()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.peek()',
    desc: "Führt für jedes durchlaufende Element eine Aktion aus; gedacht zum Debuggen.",
    details: "`peek` reicht die Elemente unverändert weiter und eignet sich, um Zwischenergebnisse einer Pipeline auszugeben. Es wird nur ausgeführt, wenn ein Element wirklich die Stelle erreicht: Eine Endoperation wie `count()` kann `peek` überspringen, wenn sie das Ergebnis ohne Durchlauf kennt. Für echte Logik gehört der Code in `forEach` oder `map`, nicht in `peek`.",
    syntax: "Stream<T> peek(Consumer<? super T> aktion)",
    example: e(`
List<Integer> r = Stream.of(1, 2, 3, 4)
    .filter(n -> n % 2 == 0)
    .peek(n -> System.out.println("gerade: " + n))   // gerade: 2, gerade: 4
    .map(n -> n * 10)
    .toList();
System.out.println(r);   // [20, 40]
`),
    keywords: ['peek', 'debug', 'debuggen', 'zwischenergebnis', 'ausgeben'],
    related: ['Consumer', 'Stream.forEach()', 'Stream-Grundlagen'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.takeWhile()',
    desc: "Nimmt Elemente, bis das Predicate zum ersten Mal falsch ist (seit Java 9).",
    details: "Anders als `filter` hört `takeWhile` beim ersten Nichttreffer auf und prüft den Rest nicht mehr. Das Gegenstück `dropWhile` überspringt, solange das Predicate wahr ist, und gibt danach alles weiter. Beide setzen eine sinnvolle Reihenfolge voraus und sind vor allem bei sortierten oder unendlichen Streams nützlich.",
    syntax: "Stream<T> takeWhile(Predicate<? super T> p)\nStream<T> dropWhile(Predicate<? super T> p)",
    example: e(`
List<Integer> z = List.of(1, 2, 3, 10, 1, 2);

System.out.println(z.stream().takeWhile(n -> n < 5).toList());   // [1, 2, 3]
System.out.println(z.stream().dropWhile(n -> n < 5).toList());   // [10, 1, 2]
System.out.println(z.stream().filter(n -> n < 5).toList());      // [1, 2, 3, 1, 2]
`),
    keywords: ['takeWhile', 'dropWhile', 'solange', 'abbrechen', 'java 9'],
    related: ['Stream.filter()', 'Stream.limit()', 'Stream.iterate()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.mapMulti()',
    desc: "Bildet jedes Element auf null, ein oder mehrere Ergebnisse ab, ohne Zwischen-Streams.",
    details: "Die Funktion bekommt das Element und einen `Consumer` (hier „sink“ genannt); jeder `accept`-Aufruf liefert ein Ergebnis. Das ist bei kleinen Ergebnismengen effizienter als `flatMap`, weil kein Stream pro Element entsteht. Wegen der Typinferenz muss man den Ergebnistyp oft explizit angeben: `.<Integer>mapMulti(...)`.",
    syntax: "<R> Stream<R> mapMulti(BiConsumer<? super T, ? super Consumer<R>> mapper)",
    example: e(`
List<Integer> r = Stream.of(1, 2, 3)
    .<Integer>mapMulti((x, sink) -> {
        if (x != 2) {
            sink.accept(x);
            sink.accept(x * 10);
        }
    })
    .toList();
System.out.println(r);   // [1, 10, 3, 30]
`),
    keywords: ['mapMulti', 'flatMap alternative', 'java 16', 'consumer', 'sink'],
    related: ['Stream.flatMap()', 'Stream.map()', 'Consumer'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.toList()',
    desc: "Sammelt den Stream in eine unveränderliche Liste.",
    details: "Kurzform für das häufige `collect(Collectors.toList())`. Die Liste ist unveränderlich (`add` wirft `UnsupportedOperationException`) und darf im Gegensatz zu `List.of()` `null`-Elemente enthalten. `Collectors.toList()` liefert dagegen eine meist veränderbare Liste ohne Garantie über den Typ.",
    syntax: "List<T> toList()",
    example: e(`
List<Integer> l = Stream.of(3, 1, 2).sorted().toList();
System.out.println(l);   // [1, 2, 3]

try {
    l.add(4);
} catch (UnsupportedOperationException ex) {
    System.out.println("unveränderlich");
}

List<Integer> aenderbar = Stream.of(3, 1, 2).collect(Collectors.toList());
aenderbar.add(4);   // erlaubt (derzeit eine ArrayList)
`),
    tip: "Eine veränderbare Liste bekommt man mit `new ArrayList<>(stream.toList())` oder `Collectors.toCollection(ArrayList::new)`.",
    keywords: ['toList', 'java 16', 'sammeln', 'unveränderlich', 'collect toList'],
    related: ['Collectors.toList()', 'Stream.collect()', 'Unveränderliche Collections'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.collect()',
    desc: "Endoperation, die die Elemente mit einem Collector in eine Ergebnisstruktur sammelt.",
    details: "Meist übergibt man einen fertigen Collector aus `Collectors` (Liste, Set, Map, String, Gruppierung). Die Dreiparameter-Form `collect(supplier, akkumulator, kombinierer)` baut die Ergebnisstruktur selbst auf, etwa einen `StringBuilder`. Collect ist die eigentliche Brücke zwischen Streams und Collections.",
    syntax: "<R, A> R collect(Collector<? super T, A, R> collector)\n<R> R collect(Supplier<R> s, BiConsumer<R, ? super T> acc, BiConsumer<R, R> comb)",
    example: e(`
List<String> w = List.of("a", "b", "c");

String s = w.stream().collect(Collectors.joining("-"));
System.out.println(s);   // a-b-c

StringBuilder sb = w.stream().collect(StringBuilder::new, StringBuilder::append, StringBuilder::append);
System.out.println(sb);  // abc
`),
    keywords: ['collect', 'sammeln', 'collector', 'ergebnis', 'terminal'],
    related: ['Collectors.toList()', 'Collectors.groupingBy()', 'Collectors.joining()', 'Stream.toList()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.reduce()',
    desc: "Verdichtet alle Elemente mit einer Verknüpfung zu einem einzigen Wert.",
    details: "Mit Startwert (`reduce(0, Integer::sum)`) ist das Ergebnis vom Elementtyp und bei leerem Stream der Startwert. Ohne Startwert (`reduce(Integer::max)`) liefert die Methode ein `Optional`, weil der Stream leer sein kann. Die Verknüpfung muss assoziativ sein und darf keinen Zustand mitführen. Für Summen und Maxima sind `mapToInt(...).sum()` oder `max()` meist lesbarer.",
    syntax: "T reduce(T identity, BinaryOperator<T> op)\nOptional<T> reduce(BinaryOperator<T> op)",
    example: e(`
System.out.println(Stream.of(1, 2, 3, 4).reduce(0, Integer::sum));   // 10
System.out.println(Stream.of(1, 2, 3, 4).reduce(Integer::max));      // Optional[4]
System.out.println(Stream.<Integer>empty().reduce(0, Integer::sum)); // 0
System.out.println(Stream.<Integer>empty().reduce(Integer::sum).isPresent()); // false
System.out.println(Stream.of("a", "b", "c").reduce("", String::concat)); // abc
`),
    keywords: ['reduce', 'reduktion', 'aggregieren', 'summe', 'fold', 'verdichten'],
    related: ['BinaryOperator', 'Stream.collect()', 'IntStream', 'Stream.mapToInt()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.forEach()',
    desc: "Endoperation, die für jedes Element eine Aktion ausführt.",
    details: "Gedacht für Ausgabe und andere Seiteneffekte am Ende der Pipeline. Ergebnisse in eine äußere Liste zu sammeln ist ein Antimuster; dafür gibt es `collect` oder `toList`. Bei parallelen Streams ist die Reihenfolge unbestimmt; `forEachOrdered` erzwingt die Reihenfolge der Quelle. Für reine Schleifen über eine `Collection` genügt `Iterable.forEach`.",
    syntax: "void forEach(Consumer<? super T> aktion)\nvoid forEachOrdered(Consumer<? super T> aktion)",
    example: e(`
Stream.of("a", "b", "c").forEach(System.out::print);   // abc
System.out.println();

IntStream.rangeClosed(1, 5).parallel().forEachOrdered(System.out::print);   // 12345
System.out.println();
`),
    keywords: ['forEach', 'forEachOrdered', 'schleife', 'seiteneffekt', 'ausgabe'],
    related: ['List.forEach()', 'Consumer', 'Parallele Streams', 'Stream.collect()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.count()',
    desc: "Endoperation, die die Anzahl der Elemente als `long` liefert.",
    details: "Der Rückgabetyp ist `long`, nicht `int`. Zusammen mit `filter` zählt man Elemente, die eine Bedingung erfüllen. Seit Java 9 darf `count()` die Pipeline überspringen, wenn die Größe schon aus der Quelle bekannt ist; Seiteneffekte in `peek` oder `map` laufen dann nicht.",
    syntax: "long count()",
    example: e(`
List<Integer> z = List.of(1, 2, 3, 4, 5);

long gerade = z.stream().filter(n -> n % 2 == 0).count();
System.out.println(gerade);   // 2

int anzahl = (int) z.stream().count();
System.out.println(anzahl);   // 5
`),
    keywords: ['count', 'anzahl', 'zählen', 'long'],
    related: ['List.size()', 'Collectors.counting()', 'Stream.filter()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.anyMatch()',
    desc: "Prüft, ob mindestens ein, alle oder kein Element ein Predicate erfüllt.",
    details: "Neben `anyMatch` gibt es `allMatch` und `noneMatch`. Alle drei sind Kurzschluss-Operationen und hören auf, sobald das Ergebnis feststeht. Bei einem leeren Stream liefert `anyMatch` `false`, `allMatch` aber `true` und `noneMatch` ebenfalls `true`. Das überrascht gelegentlich.",
    syntax: "boolean anyMatch(Predicate<? super T> p)\nboolean allMatch(Predicate<? super T> p)\nboolean noneMatch(Predicate<? super T> p)",
    example: e(`
List<Integer> z = List.of(1, 2, 3);

System.out.println(z.stream().anyMatch(n -> n > 2));    // true
System.out.println(z.stream().allMatch(n -> n > 2));    // false
System.out.println(z.stream().noneMatch(n -> n > 5));   // true

System.out.println(Stream.<Integer>empty().allMatch(n -> n > 100));   // true (leer)
`),
    keywords: ['anyMatch', 'allMatch', 'noneMatch', 'existiert', 'alle', 'keiner', 'any', 'all'],
    related: ['Predicate', 'Stream.filter()', 'List.contains()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.findFirst()',
    desc: "Liefert das erste Element als `Optional`; `findAny()` irgendein Element.",
    details: "Das Ergebnis ist ein `Optional`, weil der Stream leer sein kann. Beide Methoden sind Kurzschluss-Operationen. `findFirst()` respektiert die Reihenfolge, `findAny()` darf bei parallelen Streams ein beliebiges Element liefern und ist dort schneller. Mit `filter(...).findFirst()` sucht man das erste passende Element.",
    syntax: "Optional<T> findFirst()\nOptional<T> findAny()",
    example: e(`
List<String> w = List.of("Apfel", "Birne", "Banane");

Optional<String> b = w.stream().filter(s -> s.startsWith("B")).findFirst();
System.out.println(b.get());   // Birne

String keins = w.stream().filter(s -> s.startsWith("Z")).findFirst().orElse("-");
System.out.println(keins);     // -
`),
    keywords: ['findFirst', 'findAny', 'erstes element', 'suchen', 'optional'],
    related: ['Stream.filter()', 'Stream.anyMatch()', 'Stream.min()'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.min()',
    desc: "Liefert das kleinste (bzw. mit `max()` größte) Element nach einem Comparator als `Optional`.",
    details: "Beide Methoden brauchen einen `Comparator`, weil `Stream<T>` keine Ordnung voraussetzt. Bei einem leeren Stream ist das Ergebnis ein leeres `Optional`. Bei `IntStream` entfällt der Comparator, die Ergebnisse sind `OptionalInt`. Bei mehreren gleich kleinen Elementen legt die API nicht fest, welches zurückkommt.",
    syntax: "Optional<T> min(Comparator<? super T> c)\nOptional<T> max(Comparator<? super T> c)",
    example: e(`
List<String> w = List.of("Birne", "Kiwi", "Apfel");

System.out.println(w.stream().min(Comparator.comparing(String::length)).get());   // Kiwi
System.out.println(w.stream().max(Comparator.naturalOrder()).get());              // Kiwi
System.out.println(Stream.<String>empty().min(Comparator.naturalOrder()).isPresent());   // false
`),
    keywords: ['min', 'max', 'minimum', 'maximum', 'kleinstes', 'größtes', 'comparator'],
    related: ['Comparator', 'Stream.sorted()', 'Stream.findFirst()', 'IntStream'],
    mdn: A + 'util/stream/Stream.html'
  },
  {
    lang: 'java', group: G6, name: 'Parallele Streams',
    desc: "`parallelStream()` oder `parallel()` verteilen die Verarbeitung auf mehrere Threads.",
    details: "Parallele Streams nutzen den gemeinsamen `ForkJoinPool`. Sie lohnen sich nur bei großen Datenmengen und rechenintensiven, voneinander unabhängigen Operationen; bei kleinen Listen oder I/O sind sie langsamer. Die Operationen müssen zustandslos und seiteneffektfrei sein, und gemeinsam genutzte veränderbare Variablen führen zu Wettlaufbedingungen (Race Conditions). Bei `forEach` ist die Reihenfolge unbestimmt, `forEachOrdered` und `collect` behalten sie.",
    syntax: "collection.parallelStream()\nstream.parallel()   stream.sequential()",
    example: e(`
System.out.println(IntStream.rangeClosed(1, 1_000).parallel().sum());   // 500500

List<Integer> z = IntStream.rangeClosed(1, 5).boxed().toList();
System.out.println(z.parallelStream().map(n -> n * n).toList());   // [1, 4, 9, 16, 25] (Reihenfolge bleibt)

// Falsch: gemeinsamer Zustand in parallelen Streams
// List<Integer> ziel = new ArrayList<>();
// z.parallelStream().forEach(ziel::add);   // nicht thread-sicher
`),
    tip: "Erst messen: Ein sequentieller Stream ist oft schneller und immer vorhersagbar.",
    keywords: ['parallel', 'parallelStream', 'ForkJoinPool', 'multithreading', 'race condition', 'thread'],
    related: ['Stream.forEach()', 'Collection.stream()', 'Stream-Grundlagen'],
    mdn: A + 'util/stream/package-summary.html'
  },
  {
    lang: 'java', group: G6, name: 'Stream.gather()',
    desc: "Eigene und fertige Zwischenoperationen für Streams, z. B. Fenster und laufende Summen.",
    details: "Seit Java 24 gibt es `Stream.gather(Gatherer)`. Die Klasse `Gatherers` liefert fertige Gatherer wie `windowFixed(n)`, `windowSliding(n)`, `fold(...)`, `scan(...)` und `mapConcurrent(...)`. Ein Gatherer kann im Gegensatz zu `map` oder `filter` Zustand halten und Elemente gruppieren. Eigene Gatherer baut man über `Gatherer.of(...)` oder `Gatherer.ofSequential(...)`.",
    syntax: "stream.gather(Gatherers.windowFixed(n))",
    example: e(`
System.out.println(Stream.of(1, 2, 3, 4, 5).gather(Gatherers.windowFixed(2)).toList());
// [[1, 2], [3, 4], [5]]

System.out.println(Stream.of(1, 2, 3, 4).gather(Gatherers.windowSliding(2)).toList());
// [[1, 2], [2, 3], [3, 4]]

System.out.println(Stream.of(1, 2, 3, 4).gather(Gatherers.scan(() -> 0, Integer::sum)).toList());
// [1, 3, 6, 10]
`),
    keywords: ['gatherer', 'gather', 'Gatherers', 'windowFixed', 'windowSliding', 'scan', 'fold', 'mapConcurrent', 'java 24', 'fenster'],
    related: ['Stream.map()', 'Stream.collect()', 'Stream.reduce()'],
    mdn: A + 'util/stream/Gatherers.html'
  },

  // ---------------- Collectors ----------------
  {
    lang: 'java', group: G7, name: 'Collectors.toList()',
    desc: "Sammelt die Elemente in eine `List`.",
    details: "Die Methode liefert derzeit eine `ArrayList`, garantiert wird aber nur eine `List`, auch zu Veränderbarkeit und Thread-Sicherheit. Eine garantiert unveränderliche Liste liefert `Collectors.toUnmodifiableList()` oder seit Java 16 `Stream.toList()`. Für einen bestimmten Typ nutzt man `Collectors.toCollection(LinkedList::new)`.",
    syntax: "stream.collect(Collectors.toList())\nstream.collect(Collectors.toCollection(ArrayList::new))",
    example: e(`
List<String> l = Stream.of("b", "a").collect(Collectors.toList());
System.out.println(l);   // [b, a]

LinkedList<String> ll = Stream.of("b", "a").collect(Collectors.toCollection(LinkedList::new));
System.out.println(ll.getFirst());   // b
`),
    keywords: ['toList', 'Collectors.toList', 'sammeln', 'liste', 'toCollection', 'toUnmodifiableList'],
    related: ['Stream.toList()', 'Stream.collect()', 'Collectors.toSet()'],
    mdn: A + 'util/stream/Collectors.html'
  },
  {
    lang: 'java', group: G7, name: 'Collectors.toSet()',
    desc: "Sammelt die Elemente in ein `Set` und entfernt dabei Duplikate.",
    details: "Das Ergebnis hat keine feste Reihenfolge. Für eine sortierte Menge nimmt man `Collectors.toCollection(TreeSet::new)`, für eine Menge in Einfügereihenfolge `LinkedHashSet::new`. `toUnmodifiableSet()` liefert ein unveränderliches Set.",
    syntax: "stream.collect(Collectors.toSet())\nstream.collect(Collectors.toCollection(TreeSet::new))",
    example: e(`
Set<Integer> s = Stream.of(3, 1, 3, 2).collect(Collectors.toSet());
System.out.println(s.size());   // 3

TreeSet<Integer> sortiert = Stream.of(3, 1, 3, 2).collect(Collectors.toCollection(TreeSet::new));
System.out.println(sortiert);   // [1, 2, 3]
`),
    keywords: ['toSet', 'Collectors.toSet', 'menge', 'duplikate', 'toUnmodifiableSet'],
    related: ['Collectors.toList()', 'Stream.distinct()', 'Set', 'TreeSet'],
    mdn: A + 'util/stream/Collectors.html'
  },
  {
    lang: 'java', group: G7, name: 'Collectors.toMap()',
    desc: "Sammelt die Elemente in eine `Map` aus Schlüssel- und Wertfunktion.",
    details: "Doppelte Schlüssel führen zu einer `IllegalStateException`, solange man keine Merge-Funktion als dritten Parameter angibt. Mit einem vierten Parameter bestimmt man die Map-Art, z. B. `TreeMap::new`. `null` als Wert ist nicht erlaubt (`NullPointerException`). Zum Gruppieren mehrerer Werte pro Schlüssel ist `groupingBy` besser geeignet.",
    syntax: "Collectors.toMap(schluesselFn, wertFn)\nCollectors.toMap(schluesselFn, wertFn, mergeFn)\nCollectors.toMap(schluesselFn, wertFn, mergeFn, mapSupplier)",
    example: e(`
Map<String, Integer> laenge = Stream.of("a", "bb", "ccc")
    .collect(Collectors.toMap(Function.identity(), String::length, (x, y) -> x, TreeMap::new));
System.out.println(laenge);   // {a=1, bb=2, ccc=3}

Map<Integer, String> nachLaenge = Stream.of("a", "bb", "cc")
    .collect(Collectors.toMap(String::length, s -> s, (x, y) -> x + "|" + y, TreeMap::new));
System.out.println(nachLaenge);   // {1=a, 2=bb|cc}

try {
    Stream.of("bb", "cc").collect(Collectors.toMap(String::length, s -> s));
} catch (IllegalStateException ex) {
    System.out.println("doppelter Schlüssel");
}
`),
    keywords: ['toMap', 'Collectors.toMap', 'map erzeugen', 'merge', 'duplicate key', 'IllegalStateException'],
    related: ['Collectors.groupingBy()', 'Map', 'Function'],
    mdn: A + 'util/stream/Collectors.html'
  },
  {
    lang: 'java', group: G7, name: 'Collectors.joining()',
    desc: "Fügt Strings mit Trennzeichen, Präfix und Suffix zu einem String zusammen.",
    details: "Der Stream muss `CharSequence`-Elemente enthalten; Zahlen wandelt man vorher mit `map(String::valueOf)` um. Es gibt die Formen ohne Argument, mit Trennzeichen und mit Trennzeichen, Präfix und Suffix. Für einfache Listen von Strings ist `String.join(\", \", liste)` kürzer.",
    syntax: "Collectors.joining()\nCollectors.joining(trenner)\nCollectors.joining(trenner, praefix, suffix)",
    example: e(`
System.out.println(Stream.of("a", "b", "c").collect(Collectors.joining()));                // abc
System.out.println(Stream.of("a", "b", "c").collect(Collectors.joining(", ")));            // a, b, c
System.out.println(Stream.of("a", "b", "c").collect(Collectors.joining(", ", "[", "]")));  // [a, b, c]
System.out.println(Stream.of(1, 2, 3).map(String::valueOf).collect(Collectors.joining("+")));   // 1+2+3
System.out.println(String.join("/", List.of("x", "y")));   // x/y
`),
    keywords: ['joining', 'Collectors.joining', 'zusammenfügen', 'verketten', 'String.join', 'trennzeichen'],
    related: ['Stream.collect()', 'Stream.map()'],
    mdn: A + 'util/stream/Collectors.html'
  },
  {
    lang: 'java', group: G7, name: 'Collectors.groupingBy()',
    desc: "Gruppiert Elemente nach einem Schlüssel in eine `Map<Schlüssel, Liste>`.",
    details: "Die Klassifizierungsfunktion bestimmt den Schlüssel. Als zweiter Parameter lässt sich ein Downstream-Collector angeben (`counting()`, `mapping()`, `summingInt()`), als optionaler mittlerer Parameter die Map-Art (`TreeMap::new`). Ohne Angabe entsteht eine Map ohne garantierten Typ und ohne feste Reihenfolge (derzeit `HashMap`). Schlüssel dürfen nicht `null` sein.",
    syntax: "Collectors.groupingBy(klassifizierer)\nCollectors.groupingBy(klassifizierer, downstream)\nCollectors.groupingBy(klassifizierer, mapSupplier, downstream)",
    example: e(`
List<String> w = List.of("Apfel", "Birne", "Ananas", "Kiwi", "Banane");

Map<Character, List<String>> nachAnfang = w.stream()
    .collect(Collectors.groupingBy(s -> s.charAt(0), TreeMap::new, Collectors.toList()));
System.out.println(nachAnfang);   // {A=[Apfel, Ananas], B=[Birne, Banane], K=[Kiwi]}

Map<Integer, Long> anzahl = w.stream()
    .collect(Collectors.groupingBy(String::length, TreeMap::new, Collectors.counting()));
System.out.println(anzahl);       // {4=1, 5=2, 6=2}
`),
    keywords: ['groupingBy', 'gruppieren', 'group by', 'Collectors.groupingBy', 'klassifizieren', 'downstream'],
    related: ['Collectors.partitioningBy()', 'Collectors.counting()', 'Collectors.mapping()', 'Map.computeIfAbsent()'],
    mdn: A + 'util/stream/Collectors.html'
  },
  {
    lang: 'java', group: G7, name: 'Collectors.partitioningBy()',
    desc: "Teilt Elemente nach einem Predicate in genau zwei Gruppen: `true` und `false`.",
    details: "Das Ergebnis ist eine `Map<Boolean, List<T>>`, die immer beide Schlüssel enthält, auch wenn eine Gruppe leer ist. Das unterscheidet sie von `groupingBy`. Wie dort kann ein Downstream-Collector als zweiter Parameter folgen.",
    syntax: "Collectors.partitioningBy(Predicate<T> p)\nCollectors.partitioningBy(Predicate<T> p, Collector downstream)",
    example: e(`
List<Integer> z = List.of(1, 2, 3, 4, 5);

Map<Boolean, List<Integer>> p = z.stream().collect(Collectors.partitioningBy(n -> n % 2 == 0));
System.out.println(p);               // {false=[1, 3, 5], true=[2, 4]}
System.out.println(p.get(true));     // [2, 4]

System.out.println(z.stream().collect(Collectors.partitioningBy(n -> n > 10, Collectors.counting())));   // {false=5, true=0}
`),
    keywords: ['partitioningBy', 'aufteilen', 'zweiteilen', 'true false', 'Collectors.partitioningBy'],
    related: ['Collectors.groupingBy()', 'Predicate', 'Stream.filter()'],
    mdn: A + 'util/stream/Collectors.html'
  },
  {
    lang: 'java', group: G7, name: 'Collectors.counting()',
    desc: "Zählt die Elemente und liefert das Ergebnis als `Long`.",
    details: "Allein bringt `counting()` wenig, denn dafür gibt es `Stream.count()`. Wertvoll ist der Collector als Downstream in `groupingBy`, wo er die Größe jeder Gruppe liefert. Das Ergebnis ist ein `Long`, kein `Integer`.",
    syntax: "Collectors.counting()",
    example: e(`
Map<String, Long> haeufigkeit = Stream.of("a", "b", "a", "c", "a")
    .collect(Collectors.groupingBy(Function.identity(), TreeMap::new, Collectors.counting()));
System.out.println(haeufigkeit);   // {a=3, b=1, c=1}
`),
    keywords: ['counting', 'zählen', 'häufigkeit', 'Collectors.counting', 'histogramm'],
    related: ['Collectors.groupingBy()', 'Stream.count()', 'Map.merge()'],
    mdn: A + 'util/stream/Collectors.html'
  },
  {
    lang: 'java', group: G7, name: 'Collectors.summingInt()',
    desc: "Bildet die Summe einer `int`-Eigenschaft; dazu `summingLong` und `summingDouble`.",
    details: "Der Collector nimmt eine Funktion, die aus jedem Element eine Zahl liefert, und summiert sie. Er wird meist als Downstream bei `groupingBy` eingesetzt, etwa für die Summe pro Kategorie. Eine einzelne Summe berechnet man einfacher mit `mapToInt(...).sum()`. Es gibt auch `averagingInt`, `minBy` und `maxBy`.",
    syntax: "Collectors.summingInt(ToIntFunction<T> f)",
    example: e(`
record Posten(String kategorie, int menge) {}

List<Posten> l = List.of(new Posten("A", 2), new Posten("B", 5), new Posten("A", 3));

Map<String, Integer> summen = l.stream()
    .collect(Collectors.groupingBy(Posten::kategorie, TreeMap::new, Collectors.summingInt(Posten::menge)));
System.out.println(summen);   // {A=5, B=5}
`),
    keywords: ['summingInt', 'summingDouble', 'summe', 'summieren', 'Collectors.summingInt'],
    related: ['Collectors.groupingBy()', 'Collectors.averagingDouble()', 'Stream.mapToInt()'],
    mdn: A + 'util/stream/Collectors.html'
  },
  {
    lang: 'java', group: G7, name: 'Collectors.averagingDouble()',
    desc: "Berechnet den Durchschnitt einer Zahleneigenschaft als `Double`.",
    details: "Ebenso gibt es `averagingInt` und `averagingLong`; alle liefern ein `Double`. Bei einem leeren Stream ist das Ergebnis 0.0 und nicht ein leeres Optional. Für einen einfachen Durchschnitt ist `mapToInt(...).average()` gleichwertig, liefert aber ein `OptionalDouble`.",
    syntax: "Collectors.averagingDouble(ToDoubleFunction<T> f)\nCollectors.averagingInt(ToIntFunction<T> f)",
    example: e(`
System.out.println(Stream.of(1.0, 2.0, 3.0, 4.0).collect(Collectors.averagingDouble(Double::doubleValue)));   // 2.5
System.out.println(Stream.of("a", "bbb").collect(Collectors.averagingInt(String::length)));                   // 2.0
System.out.println(Stream.<Integer>empty().collect(Collectors.averagingInt(n -> n)));                         // 0.0
`),
    keywords: ['averagingDouble', 'averagingInt', 'durchschnitt', 'mittelwert', 'average'],
    related: ['Collectors.summingInt()', 'Stream.mapToInt()', 'IntStream'],
    mdn: A + 'util/stream/Collectors.html'
  },
  {
    lang: 'java', group: G7, name: 'Collectors.mapping()',
    desc: "Wandelt Elemente um, bevor ein weiterer Collector sie sammelt; für Downstreams.",
    details: "`mapping(funktion, downstream)` ist das `map` für Collectors. Es dient vor allem in `groupingBy`, wenn pro Gruppe nicht das ganze Objekt, sondern nur ein Teil davon gesammelt werden soll. Das Gegenstück zum Filtern innerhalb einer Gruppe ist `Collectors.filtering()` (seit Java 9).",
    syntax: "Collectors.mapping(Function<T, U> f, Collector<U, A, R> downstream)",
    example: e(`
List<String> w = List.of("Apfel", "Ananas", "Birne");

Map<Character, List<Integer>> laengen = w.stream()
    .collect(Collectors.groupingBy(s -> s.charAt(0), TreeMap::new,
        Collectors.mapping(String::length, Collectors.toList())));
System.out.println(laengen);   // {A=[5, 6], B=[5]}

Map<Character, String> joined = w.stream()
    .collect(Collectors.groupingBy(s -> s.charAt(0), TreeMap::new,
        Collectors.mapping(String::toUpperCase, Collectors.joining("/"))));
System.out.println(joined);    // {A=APFEL/ANANAS, B=BIRNE}
`),
    keywords: ['mapping', 'Collectors.mapping', 'downstream', 'filtering', 'flatMapping'],
    related: ['Collectors.groupingBy()', 'Stream.map()', 'Collectors.joining()'],
    mdn: A + 'util/stream/Collectors.html'
  },
  {
    lang: 'java', group: G7, name: 'Collectors.teeing()',
    desc: "Schickt jedes Element an zwei Collectors und kombiniert beide Ergebnisse (seit Java 12).",
    details: "So kann man zwei Auswertungen in einem Durchlauf erledigen, etwa Anzahl und Summe, oder Minimum und Maximum. Der letzte Parameter ist eine Funktion, die die beiden Ergebnisse zu einem Wert verbindet. Das ist nützlich, weil ein Stream nur einmal konsumiert werden kann.",
    syntax: "Collectors.teeing(collector1, collector2, (r1, r2) -> ergebnis)",
    example: e(`
double schnitt = Stream.of(1, 2, 3, 4).collect(Collectors.teeing(
    Collectors.counting(),
    Collectors.summingInt((Integer x) -> x),
    (anzahl, summe) -> summe / (double) anzahl));
System.out.println(schnitt);   // 2.5

String spanne = Stream.of(5, 2, 9).collect(Collectors.teeing(
    Collectors.minBy(Comparator.<Integer>naturalOrder()),
    Collectors.maxBy(Comparator.<Integer>naturalOrder()),
    (mn, mx) -> mn.get() + ".." + mx.get()));
System.out.println(spanne);    // 2..9
`),
    keywords: ['teeing', 'Collectors.teeing', 'zwei collectors', 'kombinieren', 'ein durchlauf', 'java 12'],
    related: ['Collectors.counting()', 'Collectors.summingInt()', 'Stream.collect()'],
    mdn: A + 'util/stream/Collectors.html'
  }
  );
})();
