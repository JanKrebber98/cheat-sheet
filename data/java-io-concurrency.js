window.CHEAT = window.CHEAT || [];
(function () {
  var A = 'https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/'; // + z. B. 'nio/file/Files.html'
  var H = 'https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/'; // + 'HttpClient.html'
  var D = 'https://dev.java/learn/';                                              // Tutorials
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Dateien & NIO ----------------
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Path',
    desc: "Unveränderliche Beschreibung eines Dateisystempfads (java.nio.file).",
    details: "Ein `Path` ist nur ein Pfad, kein geöffnetes Handle: Die Datei muss nicht existieren. Er ersetzt `java.io.File` für neuen Code. Der Trenner ist plattformabhängig; `normalize()` löst `.` und `..` rein textuell auf, ohne das Dateisystem zu fragen. `getParent()` liefert bei einem einzelnen Namen `null`.",
    syntax: "Path p = Path.of(\"ordner\", \"datei.txt\");",
    values: [
      ['getFileName()', 'Letzter Namensteil als Path'],
      ['getParent()', 'Pfad ohne letzten Teil (kann null sein)'],
      ['toAbsolutePath()', 'Macht den Pfad absolut (relativ zum Arbeitsverzeichnis)'],
      ['normalize()', 'Entfernt `.` und `..` textuell'],
      ['startsWith(), endsWith()', 'Vergleich über Namensteile, nicht über Zeichen'],
      ['toFile()', 'Brücke zur alten File-API']
    ],
    example: e(`
Path p = Path.of("daten", "notizen.txt");
System.out.println(p);                 // daten/notizen.txt (Windows: daten\\notizen.txt)
System.out.println(p.getFileName());   // notizen.txt
System.out.println(p.getParent());     // daten
System.out.println(p.isAbsolute());    // false
System.out.println(p.toAbsolutePath().isAbsolute()); // true

Path wirr = Path.of("a", "..", "b", ".", "c.txt");
System.out.println(wirr.normalize().getNameCount()); // 2 (b und c.txt)
`),
    tip: "`startsWith(\"da\")` ist bei Path false für \"daten\", weil Namensteile verglichen werden, nicht Zeichen.",
    keywords: ['pfad', 'path', 'nio', 'dateipfad', 'normalize', 'absolut', 'relativ'],
    related: ['Path.of()', 'Path.resolve()', 'Files.exists()', 'File'],
    mdn: A + 'nio/file/Path.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Path.of()',
    desc: "Erzeugt einen Path aus Namensteilen (seit Java 11, ersetzt Paths.get()).",
    details: "`Path.of(first, more...)` fügt die Teile mit dem passenden Trenner zusammen. Das ältere `Paths.get()` tut dasselbe und bleibt gültig. Die Methode prüft nur die Syntax, nicht die Existenz. Ungültige Zeichen führen zu `InvalidPathException`, was unter Windows schon bei `?` oder `:` an falscher Stelle passiert.",
    syntax: "Path.of(String first, String... more)\nPath.of(URI uri)",
    example: e(`
Path a = Path.of("daten/log.txt");
Path b = Path.of("daten", "log.txt");
System.out.println(a.equals(b));              // true

Path home = Path.of(System.getProperty("user.home"));
System.out.println(home.isAbsolute());        // true

Path alt = Paths.get("daten", "log.txt");     // älter, gleichwertig
System.out.println(alt.equals(a));            // true
`),
    tip: "Ein leerer Pfad `Path.of(\"\")` steht für das Arbeitsverzeichnis; mit `toAbsolutePath()` wird daraus der volle Pfad.",
    keywords: ['paths.get', 'pfad erzeugen', 'path.of', 'user.home', 'arbeitsverzeichnis'],
    related: ['Path', 'Path.resolve()', 'URI'],
    mdn: A + 'nio/file/Path.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Path.resolve()',
    desc: "Hängt einen Pfad an einen anderen an; relativize() bildet den Weg dazwischen.",
    details: "`a.resolve(b)` ergibt `a/b`, außer `b` ist absolut: Dann ist das Ergebnis einfach `b`. Das ist praktisch zum Zusammensetzen, aber ein Sicherheitsrisiko bei Benutzereingaben (Path Traversal mit `..` oder absoluten Pfaden). Mit `normalize()` und `startsWith(basis)` lässt sich prüfen, ob das Ergebnis in der Basis bleibt. `resolveSibling()` ersetzt den letzten Namensteil.",
    syntax: "basis.resolve(\"unterordner/datei.txt\")\nbasis.resolveSibling(\"andere.txt\")\nvon.relativize(nach)",
    example: e(`
Path basis = Path.of("projekt");
Path src = basis.resolve("src").resolve("Main.java");
System.out.println(src.getFileName());                              // Main.java
System.out.println(src.resolveSibling("Test.java").getFileName());  // Test.java

Path abs = Path.of("").toAbsolutePath();
System.out.println(basis.resolve(abs).equals(abs));   // true: absoluter Pfad ersetzt die Basis
System.out.println(basis.relativize(src).getNameCount()); // 2 (src, Main.java)

// Schutz gegen Path Traversal bei Benutzereingaben
Path ziel = basis.resolve("../geheim.txt").normalize();
System.out.println(ziel.startsWith(basis));           // false
`),
    tip: "Benutzereingaben nie ungeprüft mit `resolve()` an eine Basis hängen: erst `normalize()`, dann `startsWith(basis)` prüfen. Die Prüfung ist rein textuell; zeigen Symlinks nach draußen, zusätzlich `toRealPath()` des vorhandenen Ziels prüfen.",
    keywords: ['pfad zusammensetzen', 'resolve', 'relativize', 'path traversal', 'resolveSibling'],
    related: ['Path', 'Path.of()', 'Files.exists()'],
    mdn: A + 'nio/file/Path.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.readString()',
    desc: "Liest eine ganze Textdatei als String (seit Java 11, Standard UTF-8).",
    details: "Praktisch für kleine bis mittlere Dateien, weil der gesamte Inhalt im Speicher landet. Für große Dateien besser zeilenweise mit `Files.lines()` oder `Files.newBufferedReader()` lesen. Ist die Datei nicht gültiges UTF-8, wirft die Methode `MalformedInputException`; eine andere Kodierung gibt man als zweiten Parameter an.",
    syntax: "String Files.readString(Path path)\nString Files.readString(Path path, Charset cs)",
    example: e(`
Path datei = Files.createTempFile("demo", ".txt");
Files.writeString(datei, "Hallo\\nWelt\\n");

String text = Files.readString(datei);            // UTF-8
System.out.println(text.length());                // 11

String latin = Files.readString(datei, StandardCharsets.ISO_8859_1);
System.out.println(latin.equals(text));           // true (reine ASCII-Zeichen)
Files.delete(datei);
`),
    tip: "Fehlt die Datei, wirft die Methode `NoSuchFileException`. Das ist eine `IOException` und muss behandelt oder deklariert werden.",
    keywords: ['datei lesen', 'textdatei', 'read file', 'readString', 'inhalt'],
    related: ['Files.writeString()', 'Files.readAllLines()', 'Files.lines()', 'StandardCharsets'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.writeString()',
    desc: "Schreibt einen String in eine Datei (seit Java 11, UTF-8).",
    details: "Ohne Optionen wird die Datei angelegt oder überschrieben (`CREATE`, `TRUNCATE_EXISTING`, `WRITE`). Mit `StandardOpenOption.APPEND` hängt man an, mit `CREATE_NEW` schlägt der Aufruf fehl, wenn die Datei schon existiert. Zeilenumbrüche setzt die Methode nicht von selbst: `\\n` muss im Text stehen.",
    syntax: "Files.writeString(Path path, CharSequence text, OpenOption... options)",
    values: [
      ['StandardOpenOption.APPEND', 'Am Dateiende anhängen'],
      ['StandardOpenOption.CREATE_NEW', 'Nur anlegen, Fehler wenn vorhanden'],
      ['StandardOpenOption.TRUNCATE_EXISTING', 'Inhalt vorher leeren (Standard mit WRITE)']
    ],
    example: e(`
Path datei = Files.createTempFile("log", ".txt");
Files.writeString(datei, "Zeile 1\\n");
Files.writeString(datei, "Zeile 2\\n", StandardOpenOption.APPEND);
System.out.print(Files.readString(datei));
// Zeile 1
// Zeile 2

try {
    Files.writeString(datei, "neu", StandardOpenOption.CREATE_NEW);
} catch (FileAlreadyExistsException ex) {
    System.out.println("Datei existiert schon");
}
Files.delete(datei);
`),
    tip: "Ohne `APPEND` wird der alte Inhalt kommentarlos überschrieben.",
    keywords: ['datei schreiben', 'write file', 'append', 'anhängen', 'überschreiben'],
    related: ['Files.readString()', 'Files.write()', 'Files.newBufferedReader()'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.readAllLines()',
    desc: "Liest alle Zeilen einer Textdatei in eine List<String>.",
    details: "Die Zeilenumbrüche (`\\n`, `\\r\\n`) werden entfernt, die Datei wird komplett in den Speicher geladen. Das ist bequem für Konfigurationen und kleine Daten. Bei großen Dateien ist `Files.lines()` oder ein `BufferedReader` besser, weil dort zeilenweise gelesen wird.",
    syntax: "List<String> Files.readAllLines(Path path)\nList<String> Files.readAllLines(Path path, Charset cs)",
    example: e(`
Path datei = Files.createTempFile("zeilen", ".txt");
Files.write(datei, List.of("eins", "zwei", "drei"));

List<String> zeilen = Files.readAllLines(datei);
System.out.println(zeilen.size());   // 3
System.out.println(zeilen.get(1));   // zwei
Files.delete(datei);
`),
    keywords: ['zeilen lesen', 'readAllLines', 'liste', 'csv', 'textdatei'],
    related: ['Files.lines()', 'Files.readString()', 'Files.write()'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.write()',
    desc: "Schreibt ein byte[] oder eine Zeilenliste in eine Datei.",
    details: "Es gibt zwei Hauptformen: `write(path, byte[])` für Binärdaten und `write(path, Iterable<CharSequence>)` für Textzeilen (UTF-8, jede Zeile mit Zeilenende des Systems). Optionen wie `APPEND` wirken wie bei `writeString()`. Für große Datenmengen ist ein Stream mit `Files.newOutputStream()` besser als ein riesiges Array.",
    syntax: "Files.write(Path path, byte[] bytes, OpenOption... options)\nFiles.write(Path path, Iterable<? extends CharSequence> lines, OpenOption... options)",
    example: e(`
Path datei = Files.createTempFile("bin", ".dat");
Files.write(datei, new byte[] {1, 2, 3});
byte[] daten = Files.readAllBytes(datei);
System.out.println(daten.length);                   // 3

Files.write(datei, List.of("a", "b"));              // überschreibt
System.out.println(Files.readAllLines(datei));      // [a, b]
Files.delete(datei);
`),
    keywords: ['bytes schreiben', 'binärdatei', 'readAllBytes', 'zeilen schreiben'],
    related: ['Files.writeString()', 'Files.readAllLines()', 'OutputStream'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.lines()',
    desc: "Liefert die Zeilen einer Datei als lazy Stream<String>.",
    details: "Die Datei wird beim Terminieren des Streams zeilenweise gelesen und bleibt bis zum Schließen geöffnet. Deshalb gehört der Stream immer in ein try-with-resources, sonst bleibt das Dateihandle offen. Lesefehler während der Verarbeitung erscheinen als `UncheckedIOException`.",
    syntax: "Stream<String> Files.lines(Path path)\nStream<String> Files.lines(Path path, Charset cs)",
    example: e(`
Path datei = Files.createTempFile("lines", ".txt");
Files.write(datei, List.of("Ada", "Alan", "Grace", "Anna"));

try (Stream<String> zeilen = Files.lines(datei)) {
    long mitA = zeilen.filter(z -> z.startsWith("A")).count();
    System.out.println(mitA);   // 3
}
Files.delete(datei);
`),
    tip: "Ohne try-with-resources bleibt die Datei offen; unter Windows lässt sie sich dann nicht löschen.",
    keywords: ['stream', 'zeilen', 'lazy', 'große dateien', 'lines'],
    related: ['Files.readAllLines()', 'Files.newBufferedReader()', 'Files.list()', 'try-with-resources'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.exists()',
    desc: "Prüft, ob ein Pfad existiert; dazu isRegularFile(), isDirectory() und weitere.",
    details: "`Files.exists()` und `notExists()` sind nicht komplementär: Ist die Existenz nicht feststellbar (z. B. fehlende Rechte), sind beide false. Ein `exists()` vor dem Zugriff ist außerdem eine Race Condition, weil die Datei dazwischen verschwinden kann. Besser direkt zugreifen und die Exception behandeln.",
    syntax: "Files.exists(Path p, LinkOption... opts)\nFiles.isRegularFile(Path p)\nFiles.isDirectory(Path p)",
    values: [
      ['Files.isRegularFile(p)', 'Normale Datei'],
      ['Files.isDirectory(p)', 'Verzeichnis'],
      ['Files.isReadable(p)', 'Lesbar für den aktuellen Benutzer'],
      ['Files.isSymbolicLink(p)', 'Symbolischer Link']
    ],
    example: e(`
Path p = Path.of("gibt-es-nicht.txt");
System.out.println(Files.exists(p));       // false
System.out.println(Files.notExists(p));    // true

Path tmp = Files.createTempFile("x", ".txt");
System.out.println(Files.isRegularFile(tmp)); // true
System.out.println(Files.isDirectory(tmp));   // false
System.out.println(Files.isReadable(tmp));    // true
Files.delete(tmp);
`),
    tip: "Prüfen und dann Zugreifen ist anfällig für Race Conditions; lieber `NoSuchFileException` abfangen.",
    keywords: ['datei existiert', 'file exists', 'isDirectory', 'isRegularFile', 'prüfen'],
    related: ['Path', 'Files.createDirectories()', 'Race Condition'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.createDirectories()',
    desc: "Legt ein Verzeichnis samt aller fehlenden Elternverzeichnisse an.",
    details: "Im Unterschied zu `Files.createDirectory()` (nur eine Ebene, Fehler wenn vorhanden) erzeugt `createDirectories()` den ganzen Pfad und ist auch dann fehlerfrei, wenn das Verzeichnis schon existiert. Existiert an der Stelle aber eine normale Datei, gibt es eine `FileAlreadyExistsException`.",
    syntax: "Files.createDirectories(Path dir, FileAttribute<?>... attrs)",
    example: e(`
Path basis = Files.createTempDirectory("demo");
Path tief = basis.resolve("a/b/c");
Files.createDirectories(tief);
Files.createDirectories(tief);               // kein Fehler, existiert schon
System.out.println(Files.isDirectory(tief)); // true

// Aufräumen: tiefste Einträge zuerst löschen
try (Stream<Path> s = Files.walk(basis)) {
    s.sorted(Comparator.reverseOrder()).forEach(p -> p.toFile().delete());
}
`),
    keywords: ['ordner anlegen', 'verzeichnis erstellen', 'mkdir', 'mkdir -p', 'createDirectory'],
    related: ['Files.walk()', 'Files.delete()', 'Files.createTempFile()'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.copy()',
    desc: "Kopiert eine Datei oder überträgt einen Stream in eine Datei.",
    details: "Standardmäßig schlägt `copy()` mit `FileAlreadyExistsException` fehl, wenn das Ziel existiert; `StandardCopyOption.REPLACE_EXISTING` erlaubt das Überschreiben. Verzeichnisse werden nur als leeres Verzeichnis kopiert, nicht rekursiv. Es gibt auch Varianten `copy(InputStream, Path)` und `copy(Path, OutputStream)`.",
    syntax: "Files.copy(Path quelle, Path ziel, CopyOption... options)",
    values: [
      ['REPLACE_EXISTING', 'Vorhandenes Ziel überschreiben'],
      ['COPY_ATTRIBUTES', 'Zeitstempel und Attribute mitkopieren'],
      ['NOFOLLOW_LINKS', 'Symbolische Links nicht auflösen']
    ],
    example: e(`
Path quelle = Files.createTempFile("quelle", ".txt");
Files.writeString(quelle, "Inhalt");
Path ziel = quelle.resolveSibling("kopie-" + quelle.getFileName());

Files.copy(quelle, ziel);
try {
    Files.copy(quelle, ziel);
} catch (FileAlreadyExistsException ex) {
    System.out.println("Ziel existiert schon");
}
Files.copy(quelle, ziel, StandardCopyOption.REPLACE_EXISTING);
System.out.println(Files.readString(ziel));   // Inhalt

Files.delete(quelle);
Files.delete(ziel);
`),
    keywords: ['kopieren', 'copy file', 'replace_existing', 'datei kopieren'],
    related: ['Files.move()', 'Files.delete()', 'InputStream'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.move()',
    desc: "Verschiebt oder benennt eine Datei um.",
    details: "Innerhalb desselben Dateisystems ist das ein schnelles Umbenennen, sonst Kopieren und Löschen. Wie bei `copy()` scheitert der Aufruf, wenn das Ziel existiert, außer man gibt `REPLACE_EXISTING` an. `ATOMIC_MOVE` verlangt einen unteilbaren Vorgang und wirft `AtomicMoveNotSupportedException`, wenn das nicht möglich ist; typisch, um fertige Dateien sicher zu veröffentlichen.",
    syntax: "Files.move(Path quelle, Path ziel, CopyOption... options)",
    example: e(`
Path alt = Files.createTempFile("alt", ".txt");
Path neu = alt.resolveSibling("neu-" + alt.getFileName());

Files.move(alt, neu, StandardCopyOption.REPLACE_EXISTING);
System.out.println(Files.exists(alt));   // false
System.out.println(Files.exists(neu));   // true
Files.delete(neu);
`),
    tip: "Erst in eine temporäre Datei schreiben, dann mit `ATOMIC_MOVE` umbenennen: So sieht kein Leser eine halbe Datei.",
    keywords: ['verschieben', 'umbenennen', 'rename', 'move', 'atomic'],
    related: ['Files.copy()', 'Files.delete()'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.delete()',
    desc: "Löscht eine Datei oder ein leeres Verzeichnis; deleteIfExists() ignoriert Fehlendes.",
    details: "Anders als `File.delete()` meldet `Files.delete()` den Grund per Exception: `NoSuchFileException`, `DirectoryNotEmptyException` oder `AccessDeniedException`. Nicht leere Verzeichnisse muss man selbst rekursiv leeren, z. B. mit `Files.walk()` in umgekehrter Reihenfolge.",
    syntax: "Files.delete(Path p)\nboolean Files.deleteIfExists(Path p)",
    example: e(`
Path p = Files.createTempFile("weg", ".txt");
Files.delete(p);
System.out.println(Files.deleteIfExists(p));   // false

try {
    Files.delete(p);
} catch (NoSuchFileException ex) {
    System.out.println("Datei fehlt schon");
}

Path dir = Files.createTempDirectory("voll");
Files.writeString(dir.resolve("f.txt"), "x");
try {
    Files.delete(dir);
} catch (DirectoryNotEmptyException ex) {
    System.out.println("Verzeichnis nicht leer");
}
Files.delete(dir.resolve("f.txt"));
Files.delete(dir);
`),
    keywords: ['löschen', 'delete', 'deleteIfExists', 'datei entfernen'],
    related: ['Files.walk()', 'Files.move()', 'File'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.list()',
    desc: "Listet den Inhalt eines Verzeichnisses (eine Ebene) als Stream<Path>.",
    details: "Die Reihenfolge ist nicht festgelegt, daher bei Bedarf sortieren. Der Stream hält das Verzeichnis offen und muss mit try-with-resources geschlossen werden. Für Unterverzeichnisse nimmt man `Files.walk()`; für einfache Filter mit Muster gibt es `Files.newDirectoryStream(dir, \"*.txt\")`.",
    syntax: "Stream<Path> Files.list(Path dir)",
    example: e(`
Path dir = Files.createTempDirectory("liste");
Files.writeString(dir.resolve("b.txt"), "");
Files.writeString(dir.resolve("a.txt"), "");
Files.createDirectory(dir.resolve("sub"));

try (Stream<Path> s = Files.list(dir)) {
    s.map(p -> p.getFileName().toString()).sorted().forEach(System.out::println);
}
// a.txt
// b.txt
// sub

Files.delete(dir.resolve("a.txt"));
Files.delete(dir.resolve("b.txt"));
Files.delete(dir.resolve("sub"));
Files.delete(dir);
`),
    tip: "Die Reihenfolge ist je nach Dateisystem anders; für stabile Ausgaben immer `sorted()`.",
    keywords: ['verzeichnis auflisten', 'ls', 'dir', 'ordnerinhalt', 'directory'],
    related: ['Files.walk()', 'Files.lines()', 'try-with-resources'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.walk()',
    desc: "Durchläuft einen Verzeichnisbaum rekursiv als Stream<Path>.",
    details: "Der Startpfad ist selbst Teil des Streams, und Verzeichnisse kommen vor ihrem Inhalt. Wie bei `list()` muss der Stream geschlossen werden. Mit dem zweiten Parameter begrenzt man die Tiefe. Zum rekursiven Löschen sortiert man umgekehrt, damit Inhalte vor ihren Verzeichnissen kommen.",
    syntax: "Stream<Path> Files.walk(Path start, int maxDepth, FileVisitOption... options)",
    example: e(`
Path root = Files.createTempDirectory("baum");
Files.createDirectories(root.resolve("a/b"));
Files.writeString(root.resolve("a/x.txt"), "x");
Files.writeString(root.resolve("a/b/y.txt"), "y");

try (Stream<Path> s = Files.walk(root)) {
    long dateien = s.filter(Files::isRegularFile).count();
    System.out.println(dateien);   // 2
}

// Rekursiv löschen: tiefste Einträge zuerst
try (Stream<Path> s = Files.walk(root)) {
    s.sorted(Comparator.reverseOrder()).forEach(p -> p.toFile().delete());
}
System.out.println(Files.exists(root));   // false
`),
    tip: "Für umfangreiche Bäume mit Fehlerbehandlung pro Eintrag ist `Files.walkFileTree()` mit einem `FileVisitor` flexibler.",
    keywords: ['rekursiv', 'verzeichnisbaum', 'find', 'walk', 'unterordner', 'tree'],
    related: ['Files.list()', 'Files.delete()', 'Files.createDirectories()'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.size()',
    desc: "Liefert die Dateigröße in Bytes (nicht in Zeichen).",
    details: "Das Ergebnis ist die Anzahl der Bytes auf der Platte. Bei Textdateien mit Umlauten in UTF-8 ist sie größer als die Zeichenzahl, weil Zeichen wie `ä` zwei Bytes brauchen. Weitere Attribute liefern `Files.getLastModifiedTime()` und `Files.readAttributes()`.",
    syntax: "long Files.size(Path p)",
    example: e(`
Path p = Files.createTempFile("gr", ".txt");
Files.writeString(p, "äbc");

System.out.println(Files.size(p));                 // 4 (ä = 2 Bytes in UTF-8)
System.out.println(Files.readString(p).length());  // 3 Zeichen
Files.delete(p);
`),
    keywords: ['dateigröße', 'größe', 'bytes', 'size', 'länge'],
    related: ['StandardCharsets', 'Files.readString()'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.createTempFile()',
    desc: "Legt eine neue, eindeutig benannte temporäre Datei oder ein Verzeichnis an.",
    details: "Die Datei wird sofort mit einem zufälligen Namen im temporären Verzeichnis des Systems erzeugt (`java.io.tmpdir`). Präfix und Suffix sind frei wählbar. Java löscht die Dateien nicht automatisch: selbst löschen, im `finally` oder mit `deleteOnExit()` über `toFile()`. Für Verzeichnisse gibt es `createTempDirectory()`.",
    syntax: "Path Files.createTempFile(String prefix, String suffix)\nPath Files.createTempDirectory(String prefix)",
    example: e(`
Path tmp = Files.createTempFile("bericht-", ".csv");
System.out.println(tmp.getFileName().toString().startsWith("bericht-"));  // true
System.out.println(Files.exists(tmp));                                    // true
Files.delete(tmp);

Path dir = Files.createTempDirectory("arbeit-");
System.out.println(Files.isDirectory(dir));   // true
Files.delete(dir);
`),
    tip: "Für Tests und Beispiele ideal: Man braucht keine festen Pfade und stört keine vorhandenen Dateien.",
    keywords: ['temporär', 'temp', 'tmp', 'temporäre datei', 'createTempDirectory'],
    related: ['Files.delete()', 'Files.writeString()', 'Path'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'Files.newBufferedReader()',
    desc: "Öffnet eine Datei als BufferedReader (bzw. newBufferedWriter() zum Schreiben).",
    details: "Das ist der Standardweg, um große Textdateien zeilenweise zu lesen, ohne alles in den Speicher zu laden. Die Kodierung ist UTF-8, sofern nicht angegeben. Beim Lesen mit falscher Kodierung gibt es `MalformedInputException`. Reader und Writer immer per try-with-resources schließen, sonst gehen gepufferte Daten verloren.",
    syntax: "BufferedReader Files.newBufferedReader(Path p, Charset cs)\nBufferedWriter Files.newBufferedWriter(Path p, OpenOption... opts)",
    example: e(`
Path p = Files.createTempFile("br", ".txt");
Files.write(p, List.of("eins", "zwei"));

try (BufferedReader in = Files.newBufferedReader(p)) {
    String zeile;
    while ((zeile = in.readLine()) != null) {
        System.out.println(zeile);
    }
}
// eins
// zwei

try (BufferedWriter out = Files.newBufferedWriter(p)) {
    out.write("neu");
    out.newLine();
}
System.out.println(Files.readAllLines(p));   // [neu]
Files.delete(p);
`),
    keywords: ['bufferedreader', 'bufferedwriter', 'zeilenweise', 'datei lesen', 'readLine'],
    related: ['BufferedReader', 'Files.lines()', 'try-with-resources'],
    mdn: A + 'nio/file/Files.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'StandardCharsets',
    desc: "Konstanten für die Zeichenkodierungen UTF-8, ISO-8859-1 und weitere.",
    details: "Texte sind Zeichen, Dateien und Netzwerk sind Bytes; die Kodierung verbindet beides. Seit Java 18 ist UTF-8 der Standard-Charset der Java-APIs (JEP 400), die Konsole folgt weiter dem System. Trotzdem sollte man die Kodierung bei `getBytes()` und `new String(bytes, ...)` ausdrücklich angeben. Die `StandardCharsets`-Konstanten vermeiden Tippfehler und die Exception `UnsupportedEncodingException` der String-Variante.",
    syntax: "StandardCharsets.UTF_8\nStandardCharsets.ISO_8859_1\nStandardCharsets.US_ASCII\nStandardCharsets.UTF_16",
    example: e(`
String s = "Grüße";
byte[] utf8 = s.getBytes(StandardCharsets.UTF_8);
byte[] latin1 = s.getBytes(StandardCharsets.ISO_8859_1);
System.out.println(utf8.length);     // 7 (ü und ß haben je 2 Bytes)
System.out.println(latin1.length);   // 5

String richtig = new String(utf8, StandardCharsets.UTF_8);
String falsch = new String(utf8, StandardCharsets.ISO_8859_1);
System.out.println(richtig.equals(s));   // true
System.out.println(falsch.length());     // 7: Zeichensalat (Mojibake)
`),
    tip: "Zeichensalat wie \"Ã¼\" statt \"ü\" bedeutet fast immer: UTF-8-Bytes wurden als ISO-8859-1 gelesen.",
    keywords: ['kodierung', 'encoding', 'utf-8', 'charset', 'zeichensatz', 'umlaute', 'mojibake'],
    related: ['Files.readString()', 'Reader und Writer', 'Files.size()'],
    mdn: A + 'nio/charset/StandardCharsets.html'
  },
  {
    lang: 'java', group: 'Dateien & NIO', name: 'File',
    desc: "Die ältere Datei-API aus java.io; für neuen Code Path und Files bevorzugen.",
    details: "`File` begegnet einem noch in alten Bibliotheken und APIs. Sie meldet Fehler oft nur über einen Rückgabewert `false` statt mit Ursache (`delete()`, `mkdir()`), kann Symlinks und Attribute schlecht behandeln und bietet keine Verzeichnis-Streams. Mit `toPath()` und `Path.toFile()` wechselt man zwischen beiden Welten.",
    syntax: "File f = new File(\"ordner\", \"datei.txt\");\nPath p = f.toPath();",
    example: e(`
File f = new File("daten", "x.txt");
Path p = f.toPath();
File zurueck = p.toFile();
System.out.println(f.getName());          // x.txt
System.out.println(f.exists());           // false
System.out.println(zurueck.equals(f));    // true

boolean ok = new File("gibt-es-nicht.txt").delete();
System.out.println(ok);                   // false, ohne Begründung

// Neu: Files.delete() wirft NoSuchFileException mit Pfad und Grund
`),
    tip: "Bei neuem Code `Path` und `Files` nehmen; `File` nur an Schnittstellen alter APIs.",
    keywords: ['java.io.file', 'alte api', 'legacy', 'file vs path', 'toPath'],
    related: ['Path', 'Files.delete()', 'Files.exists()'],
    mdn: A + 'io/File.html'
  },

  // ---------------- Streams & Serialisierung ----------------
  {
    lang: 'java', group: 'Streams & Serialisierung', name: 'InputStream',
    desc: "Abstrakte Basisklasse zum Lesen von Bytes.",
    details: "`read()` liefert ein Byte als `int` (0 bis 255) oder -1 am Ende. Praktischer sind `readAllBytes()` (seit Java 9) und `transferTo(OutputStream)`. Für Text braucht man zusätzlich einen `Reader` mit Kodierung. Streams sind Ressourcen und gehören in try-with-resources. Als Quellen dienen Dateien (`Files.newInputStream()`), Arrays (`ByteArrayInputStream`) oder Sockets.",
    syntax: "int read()\nbyte[] readAllBytes()\nlong transferTo(OutputStream out)",
    example: e(`
byte[] quelle = {10, 20, 30};
try (InputStream in = new ByteArrayInputStream(quelle)) {
    int b;
    while ((b = in.read()) != -1) {
        System.out.println(b);   // 10, 20, 30 (je eine Zeile)
    }
}

try (InputStream in = new ByteArrayInputStream(quelle)) {
    byte[] alle = in.readAllBytes();
    System.out.println(alle.length);   // 3
}
`),
    tip: "Ein einzelnes `read()` pro Byte auf einer Datei ist langsam; entweder `BufferedInputStream` oder gleich `readAllBytes()` nutzen.",
    keywords: ['bytes lesen', 'input stream', 'read', 'readAllBytes', 'transferTo'],
    related: ['OutputStream', 'Reader und Writer', 'try-with-resources', 'Files.copy()'],
    mdn: A + 'io/InputStream.html'
  },
  {
    lang: 'java', group: 'Streams & Serialisierung', name: 'OutputStream',
    desc: "Abstrakte Basisklasse zum Schreiben von Bytes.",
    details: "`write(int)` schreibt ein Byte, `write(byte[])` mehrere. Gepufferte Streams sammeln Daten und geben sie erst bei `flush()` oder `close()` weiter. Wer nicht schließt, riskiert verlorene Daten. Mit `InputStream.transferTo(out)` kopiert man einen Stream komplett in einen anderen.",
    syntax: "void write(int b)\nvoid write(byte[] b)\nvoid flush()",
    example: e(`
Path ziel = Files.createTempFile("out", ".bin");
try (OutputStream out = Files.newOutputStream(ziel)) {
    out.write(65);
    out.write(new byte[] {66, 67});
}
System.out.println(Files.readString(ziel));   // ABC

try (InputStream in = new ByteArrayInputStream("xyz".getBytes(StandardCharsets.UTF_8));
     OutputStream out = Files.newOutputStream(ziel)) {
    in.transferTo(out);
}
System.out.println(Files.readString(ziel));   // xyz
Files.delete(ziel);
`),
    keywords: ['bytes schreiben', 'output stream', 'write', 'flush', 'close'],
    related: ['InputStream', 'ByteArrayOutputStream', 'PrintWriter', 'try-with-resources'],
    mdn: A + 'io/OutputStream.html'
  },
  {
    lang: 'java', group: 'Streams & Serialisierung', name: 'Reader und Writer',
    desc: "Zeichenstreams: lesen und schreiben Text, die Kodierung steckt in der Brücke.",
    details: "`Reader` und `Writer` arbeiten mit `char` statt Bytes. Die Brücke von Bytes zu Zeichen bilden `InputStreamReader` und `OutputStreamWriter`; dort gehört die Kodierung hinein. `StringReader` und `StringWriter` arbeiten rein im Speicher und sind gut für Tests. `FileReader`/`FileWriter` nutzen seit Java 18 UTF-8, vorher die Systemkodierung.",
    syntax: "new InputStreamReader(InputStream in, Charset cs)\nnew OutputStreamWriter(OutputStream out, Charset cs)",
    example: e(`
try (Reader r = new StringReader("Zeile A\\nZeile B")) {
    int zeichen = r.read();
    System.out.println((char) zeichen);   // Z
}

StringWriter sw = new StringWriter();
try (Writer w = sw) {
    w.write("Hallo ");
    w.write("Welt");
}
System.out.println(sw);   // Hallo Welt

InputStream bytes = new ByteArrayInputStream("äö".getBytes(StandardCharsets.UTF_8));
try (Reader r = new InputStreamReader(bytes, StandardCharsets.UTF_8)) {
    System.out.println(r.read() == 'ä');   // true
}
`),
    keywords: ['reader', 'writer', 'zeichenstrom', 'InputStreamReader', 'StringReader', 'StringWriter', 'text'],
    related: ['BufferedReader', 'PrintWriter', 'StandardCharsets', 'InputStream'],
    mdn: A + 'io/Reader.html'
  },
  {
    lang: 'java', group: 'Streams & Serialisierung', name: 'BufferedReader',
    desc: "Puffert einen Reader und liest Text zeilenweise mit readLine().",
    details: "`readLine()` liefert die nächste Zeile ohne Zeilenende und `null` am Dateiende. `lines()` gibt die restlichen Zeilen als Stream aus. Der Puffer macht das Lesen großer Textmengen viel schneller als zeichenweises Lesen. Geschlossen wird der äußerste Reader, er schließt die inneren mit.",
    syntax: "BufferedReader br = new BufferedReader(Reader in);\nString line = br.readLine();",
    example: e(`
String text = "eins\\nzwei\\ndrei";
try (BufferedReader br = new BufferedReader(new StringReader(text))) {
    String zeile;
    while ((zeile = br.readLine()) != null) {
        System.out.println(zeile);   // eins, zwei, drei
    }
}

try (BufferedReader br = new BufferedReader(new StringReader(text))) {
    System.out.println(br.lines().count());   // 3
}
`),
    keywords: ['readLine', 'zeilenweise', 'puffer', 'buffered'],
    related: ['Files.newBufferedReader()', 'Reader und Writer', 'System.in lesen'],
    mdn: A + 'io/BufferedReader.html'
  },
  {
    lang: 'java', group: 'Streams & Serialisierung', name: 'PrintWriter',
    desc: "Schreibt formatierten Text mit println() und printf() in einen Writer oder Stream.",
    details: "`PrintWriter` bietet die vertrauten Methoden von `System.out`, aber für beliebige Ziele. Anders als andere Writer wirft er keine `IOException`; Fehler merkt man nur über `checkError()`. Zum Schreiben in Dateien gibt man einen Writer mit Kodierung mit, und mit dem zweiten Parameter `true` wird nach jedem `println()` automatisch geleert.",
    syntax: "new PrintWriter(Writer out)\nnew PrintWriter(OutputStream out, boolean autoFlush, Charset cs)",
    example: e(`
StringWriter sw = new StringWriter();
try (PrintWriter pw = new PrintWriter(sw)) {
    pw.println("Titel");
    pw.printf("%s: %d%n", "Anzahl", 3);
}
System.out.print(sw);
// Titel
// Anzahl: 3

Path datei = Files.createTempFile("pw", ".txt");
try (PrintWriter pw = new PrintWriter(Files.newBufferedWriter(datei))) {
    pw.println("in Datei");
}
System.out.println(Files.readAllLines(datei));   // [in Datei]
Files.delete(datei);
`),
    tip: "`printf` nutzt die Standard-Locale: Dezimalkomma oder -punkt hängt vom System ab. Mit `Locale.ROOT` als erstem Argument bleibt es stabil.",
    keywords: ['println', 'printf', 'formatiert schreiben', 'text schreiben', 'printwriter'],
    related: ['Reader und Writer', 'Files.newBufferedReader()', 'ByteArrayOutputStream'],
    mdn: A + 'io/PrintWriter.html'
  },
  {
    lang: 'java', group: 'Streams & Serialisierung', name: 'ByteArrayOutputStream',
    desc: "Sammelt geschriebene Bytes im Speicher; praktisch für Tests und Zwischenpuffer.",
    details: "Mit `toByteArray()` holt man den Inhalt, mit `toString(Charset)` als Text. `close()` hat bei dieser Klasse keine Wirkung. Häufig fängt man damit Ausgaben in Tests ab oder baut Binärdaten zusammen, bevor man sie sendet. Das Gegenstück zum Lesen ist `ByteArrayInputStream`.",
    syntax: "ByteArrayOutputStream bos = new ByteArrayOutputStream();\nbyte[] daten = bos.toByteArray();",
    example: e(`
ByteArrayOutputStream bos = new ByteArrayOutputStream();
try (PrintStream ps = new PrintStream(bos, true, StandardCharsets.UTF_8)) {
    ps.print("Hallo");
}
System.out.println(bos.size());                            // 5
System.out.println(bos.toString(StandardCharsets.UTF_8));  // Hallo
byte[] roh = bos.toByteArray();
System.out.println(roh[0]);                                // 72 (Code von H)
`),
    keywords: ['byte array', 'puffer', 'speicher', 'test', 'ausgabe abfangen'],
    related: ['OutputStream', 'PrintWriter', 'InputStream'],
    mdn: A + 'io/ByteArrayOutputStream.html'
  },
  {
    lang: 'java', group: 'Streams & Serialisierung', name: 'System.in lesen',
    desc: "Tastatureingabe von der Konsole mit Scanner oder BufferedReader lesen.",
    details: "`System.in` ist ein `InputStream` der Standardeingabe. `Scanner` liest Zahlen und Wörter bequem; `nextInt()` lässt aber das Zeilenende stehen, sodass ein folgendes `nextLine()` eine leere Zeile liefert. `BufferedReader` ist schneller und liefert nur Zeilen. `Scanner` puffert im Voraus; deshalb `Scanner` und `BufferedReader` nie auf demselben `System.in` mischen. `System.in` selbst nicht schließen, wenn danach noch gelesen wird.",
    syntax: "Scanner sc = new Scanner(System.in);\nBufferedReader br = new BufferedReader(new InputStreamReader(System.in));",
    example: e(`
// Variante 1: Scanner (bequem für Zahlen und Wörter)
static void einlesenMitScanner() {
    Scanner sc = new Scanner(System.in);
    System.out.print("Alter: ");
    int alter = sc.nextInt();
    sc.nextLine();                         // Rest der Zeile verwerfen
    System.out.print("Name: ");
    String name = sc.nextLine();
    System.out.println(name + " ist " + alter);
}

// Variante 2: BufferedReader (schneller, nur Zeilen)
static void einlesenMitReader() throws IOException {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    String zeile;
    while ((zeile = br.readLine()) != null) {
        System.out.println("Gelesen: " + zeile);
    }
}
`),
    tip: "Nach `nextInt()` oder `nextDouble()` einmal `nextLine()` aufrufen, wenn danach mit `nextLine()` eine Zeile gelesen wird.",
    keywords: ['eingabe', 'konsole', 'scanner', 'stdin', 'tastatur', 'user input'],
    related: ['BufferedReader', 'Reader und Writer', 'InputStream'],
    mdn: A + 'lang/System.html'
  },
  {
    lang: 'java', group: 'Streams & Serialisierung', name: 'Serializable',
    desc: "Marker-Interface: Objekte dieser Klasse lassen sich in Bytes umwandeln.",
    details: "Serialisierung speichert den Zustand eines Objektgraphen. `transient`-Felder werden ausgelassen und beim Laden mit Standardwerten belegt. Mit `serialVersionUID` steuert man die Versionskompatibilität; fehlt sie, kann schon eine kleine Änderung an der Klasse alte Daten unlesbar machen. Das Java-eigene Format ist anfällig und unflexibel; für Austauschformate sind JSON oder Protobuf meist die bessere Wahl.",
    syntax: "class Konto implements Serializable {\n    private static final long serialVersionUID = 1L;\n    transient String pin;\n}",
    example: e(`
class Konto implements Serializable {
    private static final long serialVersionUID = 1L;
    String inhaber = "Ada";
    transient String pin = "1234";     // wird nicht gespeichert
}

ByteArrayOutputStream bytes = new ByteArrayOutputStream();
try (ObjectOutputStream out = new ObjectOutputStream(bytes)) {
    out.writeObject(new Konto());
}
try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
    Konto k = (Konto) in.readObject();
    System.out.println(k.inhaber);   // Ada
    System.out.println(k.pin);       // null
}
`),
    tip: "Alle Felder müssen selbst serialisierbar oder `transient` sein, sonst gibt es `NotSerializableException`. Records sind serialisierbar, wenn sie `Serializable` implementieren.",
    keywords: ['serialisierung', 'serialization', 'transient', 'serialVersionUID', 'objekt speichern'],
    related: ['ObjectOutputStream', 'Properties', 'OutputStream'],
    mdn: A + 'io/Serializable.html'
  },
  {
    lang: 'java', group: 'Streams & Serialisierung', name: 'ObjectOutputStream',
    desc: "Schreibt Objekte; ObjectInputStream liest sie. Gefährlich bei fremden Daten.",
    details: "Mit `writeObject()` schreibt man einen Objektgraphen, mit `readObject()` liest man ihn zurück und castet. Achtung, Sicherheitswarnung: `ObjectInputStream` auf Daten aus unsicherer Quelle kann beliebigen Code auslösen (Deserialisierungsangriffe). Daten niemals ungefiltert von außen deserialisieren; mindestens einen Allowlist-Filter mit `setObjectInputFilter()` setzen, besser ein anderes Format wie JSON nutzen.",
    syntax: "new ObjectOutputStream(OutputStream)\nObject readObject()\nin.setObjectInputFilter(ObjectInputFilter)",
    example: e(`
Path datei = Files.createTempFile("obj", ".ser");
ArrayList<String> namen = new ArrayList<>(List.of("Ada", "Alan"));
try (ObjectOutputStream out = new ObjectOutputStream(Files.newOutputStream(datei))) {
    out.writeObject(namen);
}

try (ObjectInputStream in = new ObjectInputStream(Files.newInputStream(datei))) {
    // Allowlist: nur diese Klassen dürfen gelesen werden, alles andere ist verboten
    in.setObjectInputFilter(ObjectInputFilter.Config.createFilter("java.util.ArrayList;java.lang.*;!*"));
    @SuppressWarnings("unchecked")
    ArrayList<String> gelesen = (ArrayList<String>) in.readObject();
    System.out.println(gelesen);   // [Ada, Alan]
}
Files.delete(datei);
`),
    tip: "Sicherheitswarnung: Nie `ObjectInputStream` auf Daten aus dem Netz oder von Benutzern ohne Filter. Das ist eine bekannte Einfallstür für Remote Code Execution.",
    keywords: ['objekte speichern', 'readObject', 'writeObject', 'deserialisierung', 'sicherheit', 'ObjectInputStream', 'ObjectInputFilter'],
    related: ['Serializable', 'Files.write()', 'Properties'],
    mdn: A + 'io/ObjectOutputStream.html'
  },
  {
    lang: 'java', group: 'Streams & Serialisierung', name: 'Properties',
    desc: "Schlüssel-Wert-Paare aus Strings, lesbar und schreibbar als .properties-Datei.",
    details: "`Properties` ist eine alte `Hashtable<Object,Object>`, benutzt wird fast nur `getProperty()` und `setProperty()` mit Strings. `load(Reader)` und `store(Writer)` lesen und schreiben das Dateiformat `schluessel=wert`. Mit einem Reader, der UTF-8 nutzt, sind Umlaute direkt möglich. Die Variante mit `InputStream` erwartet ISO-8859-1. Einen Standardwert gibt man als zweiten Parameter von `getProperty()` an.",
    syntax: "Properties p = new Properties();\np.getProperty(\"key\", \"standard\");\np.load(Reader)\np.store(Writer, \"Kommentar\")",
    example: e(`
Properties p = new Properties();
p.setProperty("host", "localhost");
p.setProperty("port", "8080");

Path datei = Files.createTempFile("app", ".properties");
try (Writer w = Files.newBufferedWriter(datei)) {
    p.store(w, "Einstellungen");
}

Properties geladen = new Properties();
try (Reader r = Files.newBufferedReader(datei)) {
    geladen.load(r);
}
int port = Integer.parseInt(geladen.getProperty("port", "80"));
System.out.println(port);                                 // 8080
System.out.println(geladen.getProperty("user", "gast"));  // gast
Files.delete(datei);
`),
    tip: "Alle Werte sind Strings: Zahlen und Booleans selbst umwandeln und fehlende Schlüssel mit einem Standardwert abfangen.",
    keywords: ['konfiguration', 'config', 'properties', 'einstellungen', 'key value', 'getProperty'],
    related: ['Files.newBufferedReader()', 'Reader und Writer', 'Serializable'],
    mdn: A + 'util/Properties.html'
  },

  // ---------------- Netzwerk ----------------
  {
    lang: 'java', group: 'Netzwerk', name: 'HttpClient',
    desc: "Moderner HTTP-Client im JDK (seit Java 11), synchron und asynchron.",
    details: "Ein `HttpClient` wird einmal mit einem Builder erzeugt und für viele Anfragen wiederverwendet (Verbindungspool, HTTP/2). `send()` blockiert bis zur Antwort, `sendAsync()` liefert ein `CompletableFuture`. Standardmäßig folgt der Client keinen Weiterleitungen, dafür braucht man `followRedirects()`. Seit Java 21 ist der Client `AutoCloseable` und lässt sich mit try-with-resources freigeben.",
    syntax: "HttpClient client = HttpClient.newBuilder()\n    .connectTimeout(Duration.ofSeconds(5))\n    .build();",
    example: e(`
static final HttpClient CLIENT = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(5))
    .followRedirects(HttpClient.Redirect.NORMAL)
    .build();

static String holen() throws Exception {
    HttpRequest req = HttpRequest.newBuilder(URI.create("https://example.com/api"))
        .timeout(Duration.ofSeconds(10)).GET().build();
    HttpResponse<String> res = CLIENT.send(req, HttpResponse.BodyHandlers.ofString());
    return res.statusCode() + " " + res.body();
}

static CompletableFuture<String> asynchron(HttpClient client, HttpRequest req) {
    return client.sendAsync(req, HttpResponse.BodyHandlers.ofString())
                 .thenApply(HttpResponse::body);
}
`),
    tip: "Den Client nicht pro Anfrage neu bauen, sondern einmal anlegen und teilen.",
    keywords: ['http', 'rest', 'web request', 'api aufruf', 'client', 'sendAsync', 'get'],
    related: ['HttpRequest', 'HttpResponse', 'URI', 'CompletableFuture'],
    mdn: H + 'HttpClient.html'
  },
  {
    lang: 'java', group: 'Netzwerk', name: 'HttpRequest',
    desc: "Beschreibt eine HTTP-Anfrage: URI, Methode, Header, Timeout und Body.",
    details: "`HttpRequest.newBuilder()` baut unveränderliche Anfragen. Der Body kommt über einen `BodyPublisher` (`ofString`, `ofFile`, `ofByteArray`). Ohne `timeout()` wartet die Anfrage unbegrenzt auf die Antwort. Für Formulare setzt man den `Content-Type` selbst; das JDK kodiert nichts automatisch.",
    syntax: "HttpRequest.newBuilder(URI uri)\n    .header(name, wert)\n    .POST(BodyPublishers.ofString(text))\n    .build()",
    values: [
      ['GET(), DELETE()', 'Anfrage ohne Body'],
      ['POST(publisher), PUT(publisher)', 'Anfrage mit Body'],
      ['method(\"PATCH\", publisher)', 'Beliebige Methode'],
      ['timeout(Duration)', 'Maximale Wartezeit auf die Antwort']
    ],
    example: e(`
static HttpRequest postAnfrage() {
    return HttpRequest.newBuilder()
        .uri(URI.create("https://example.com/api/users"))
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .timeout(Duration.ofSeconds(10))
        .POST(HttpRequest.BodyPublishers.ofString("{\\"name\\":\\"Ada\\"}"))
        .build();
}
`),
    tip: "Immer ein `timeout()` setzen, sonst kann ein hängender Server den Aufrufer endlos blockieren.",
    keywords: ['post', 'json senden', 'header', 'request builder', 'anfrage', 'timeout'],
    related: ['HttpClient', 'HttpResponse', 'URI'],
    mdn: H + 'HttpRequest.html'
  },
  {
    lang: 'java', group: 'Netzwerk', name: 'HttpResponse',
    desc: "Antwort eines HttpClient mit Statuscode, Headern und Body.",
    details: "Den Body-Typ bestimmt der `BodyHandler`, den man beim Senden übergibt: `ofString()`, `ofFile(path)`, `ofInputStream()`, `ofLines()` oder `discarding()`. Ein Statuscode wie 404 oder 500 ist keine Exception; die Prüfung liegt beim Aufrufer. Header sind case-insensitiv und werden über `headers().firstValue(name)` abgefragt.",
    syntax: "HttpResponse<String> res = client.send(req, BodyHandlers.ofString());\nres.statusCode(); res.headers(); res.body();",
    example: e(`
static void auswerten(HttpClient client, HttpRequest req) throws Exception {
    HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
    int status = res.statusCode();
    String typ = res.headers().firstValue("content-type").orElse("unbekannt");

    if (status >= 200 && status < 300) {
        System.out.println(typ + ": " + res.body().length() + " Zeichen");
    } else {
        System.err.println("Fehler " + status);
    }

    // Direkt in eine Datei speichern:
    client.send(req, HttpResponse.BodyHandlers.ofFile(Path.of("antwort.json")));
}
`),
    tip: "HTTP-Fehlerstatus lösen keine Exception aus. Den Statuscode immer selbst prüfen.",
    keywords: ['statuscode', 'antwort', 'body', 'headers', 'response', 'BodyHandlers'],
    related: ['HttpClient', 'HttpRequest', 'Files.writeString()'],
    mdn: H + 'HttpResponse.html'
  },
  {
    lang: 'java', group: 'Netzwerk', name: 'URI',
    desc: "Zerlegt und verarbeitet Adressen; URLEncoder kodiert Parameter.",
    details: "`URI.create(String)` parst eine Adresse und wirft bei Syntaxfehlern `IllegalArgumentException`. Komponenten wie `getHost()`, `getPath()` und `getQuery()` sind einzeln abrufbar, `resolve()` löst relative Adressen auf. Query-Parameter kodiert man mit `URLEncoder.encode(wert, UTF_8)` einzeln, nicht die ganze Adresse, damit Zeichen wie `&` und Leerzeichen keine Struktur zerstören.",
    syntax: "URI u = URI.create(\"https://host:8443/pfad?x=1#abschnitt\");",
    example: e(`
URI u = URI.create("https://example.com:8443/pfad/seite?x=1&y=2#top");
System.out.println(u.getScheme());     // https
System.out.println(u.getHost());       // example.com
System.out.println(u.getPort());       // 8443
System.out.println(u.getPath());       // /pfad/seite
System.out.println(u.getQuery());      // x=1&y=2
System.out.println(u.getFragment());   // top
System.out.println(u.resolve("/anders"));   // https://example.com:8443/anders

String q = URLEncoder.encode("a b&c", StandardCharsets.UTF_8);
System.out.println(q);                 // a+b%26c
`),
    tip: "Nur die Werte der Parameter kodieren, nie die fertige Adresse, sonst werden `?` und `&` mit kodiert.",
    keywords: ['url', 'adresse', 'uri parsen', 'urlencoder', 'query', 'host', 'port'],
    related: ['HttpRequest', 'HttpClient', 'StandardCharsets'],
    mdn: A + 'net/URI.html'
  },
  {
    lang: 'java', group: 'Netzwerk', name: 'Socket und ServerSocket',
    desc: "TCP-Verbindungen auf niedriger Ebene: Server wartet, Client verbindet.",
    details: "`ServerSocket.accept()` blockiert, bis sich ein Client verbindet, und liefert einen `Socket`. Über `getInputStream()` und `getOutputStream()` fließen Bytes in beide Richtungen; die Kodierung muss man selbst festlegen. Ein Server für mehrere Clients startet pro Verbindung einen eigenen (virtuellen) Thread. Für die meisten Aufgaben ist `HttpClient` die bessere Wahl.",
    syntax: "new ServerSocket(int port)\nserver.accept()\nnew Socket(String host, int port)",
    example: e(`
static void server() throws IOException {
    try (ServerSocket server = new ServerSocket(5000);
         Socket client = server.accept();
         BufferedReader in = new BufferedReader(
             new InputStreamReader(client.getInputStream(), StandardCharsets.UTF_8));
         PrintWriter out = new PrintWriter(client.getOutputStream(), true, StandardCharsets.UTF_8)) {
        String zeile = in.readLine();
        out.println("Echo: " + zeile);
    }
}

static void client() throws IOException {
    try (Socket s = new Socket("localhost", 5000);
         BufferedReader in = new BufferedReader(
             new InputStreamReader(s.getInputStream(), StandardCharsets.UTF_8));
         PrintWriter out = new PrintWriter(s.getOutputStream(), true, StandardCharsets.UTF_8)) {
        out.println("Hallo");
        System.out.println(in.readLine());   // Echo: Hallo
    }
}
`),
    tip: "Ein Server pro Verbindung ohne eigenen Thread bedient immer nur einen Client. Mit `Executors.newVirtualThreadPerTaskExecutor()` ist ein Thread pro Verbindung günstig.",
    keywords: ['tcp', 'socket', 'server', 'client', 'port', 'netzwerk', 'accept'],
    related: ['InputStream', 'PrintWriter', 'Executors.newVirtualThreadPerTaskExecutor()', 'HttpClient'],
    mdn: A + 'net/Socket.html'
  },
  // ---------------- Threads ----------------
  {
    lang: 'java', group: 'Threads', name: 'Thread',
    desc: "Ein Ausführungsstrang; Plattform-Threads sind 1:1 auf Betriebssystem-Threads abgebildet.",
    details: "Ein `Thread` führt ein `Runnable` nebenläufig aus. Gestartet wird mit `start()`; der Aufruf von `run()` läuft dagegen im aktuellen Thread. Seit Java 21 bauen `Thread.ofPlatform()` und `Thread.ofVirtual()` Threads mit Name, Daemon-Status und Fabrik. In der Praxis erzeugt man Threads selten von Hand, sondern nutzt einen `ExecutorService`.",
    syntax: "new Thread(Runnable r, String name)\nThread.ofPlatform().name(\"w\").start(Runnable)\nThread.currentThread()",
    values: [
      ['start()', 'Startet den Thread (nur einmal erlaubt)'],
      ['join()', 'Wartet auf das Ende des Threads'],
      ['getName(), setName()', 'Name für Logs und Debugging'],
      ['isAlive()', 'Läuft er noch?'],
      ['interrupt()', 'Bittet den Thread, aufzuhören'],
      ['setDaemon(true)', 'Hintergrund-Thread, vor start() setzen']
    ],
    example: e(`
Thread t = new Thread(() -> {
    System.out.println("Thread: " + Thread.currentThread().getName());
}, "worker-1");
t.start();
t.join();
System.out.println(t.isAlive());   // false

Thread b = Thread.ofPlatform().name("builder-1").start(() -> System.out.println("fertig"));
b.join();
`),
    tip: "Ein Thread ohne Namen heißt \"Thread-0\" und ist im Log schwer zuzuordnen; immer benennen.",
    keywords: ['thread', 'nebenläufig', 'parallel', 'concurrency', 'currentThread', 'start'],
    related: ['Runnable', 'Thread.start() und Thread.join()', 'Virtuelle Threads', 'ExecutorService'],
    mdn: A + 'lang/Thread.html'
  },
  {
    lang: 'java', group: 'Threads', name: 'Runnable',
    desc: "Funktionales Interface für eine Aufgabe ohne Ergebnis: void run().",
    details: "`Runnable` beschreibt Arbeit, `Thread` oder ein Executor führt sie aus. Als Lambda ist es sehr kurz. `run()` darf keine geprüften Exceptions werfen und liefert nichts zurück. Für Ergebnisse oder geprüfte Exceptions nimmt man `Callable`. Ruft man `run()` direkt auf, läuft die Aufgabe im aufrufenden Thread.",
    syntax: "Runnable r = () -> { /* Arbeit */ };\nnew Thread(r).start();",
    example: e(`
Runnable r = () -> System.out.println("Aufgabe");
Thread t = new Thread(r);
t.start();
t.join();

class Zaehler implements Runnable {
    int n;
    public void run() {
        for (int i = 0; i < 3; i++) n++;
    }
}
Zaehler z = new Zaehler();
Thread t2 = new Thread(z);
t2.start();
t2.join();
System.out.println(z.n);   // 3 (join sorgt für Sichtbarkeit)

r.run();   // Achtung: läuft im aktuellen Thread, kein neuer Thread
`),
    keywords: ['aufgabe', 'task', 'lambda', 'run', 'funktionales interface'],
    related: ['Thread', 'Callable', 'ExecutorService', 'Thread.start() und Thread.join()'],
    mdn: A + 'lang/Runnable.html'
  },
  {
    lang: 'java', group: 'Threads', name: 'Thread.start() und Thread.join()',
    desc: "start() startet den Thread, join() wartet auf sein Ende.",
    details: "`start()` legt einen neuen Ausführungsstrang an, der `run()` ausführt; ein zweiter Aufruf wirft `IllegalThreadStateException`. `join()` blockiert den Aufrufer, bis der Thread fertig ist (auch mit Zeitgrenze möglich). Nach `join()` sind alle Schreibzugriffe des Threads für den Aufrufer sichtbar (Happens-before). Das häufigste Versehen ist `run()` statt `start()`.",
    syntax: "t.start();\nt.join();\nt.join(long millis);",
    example: e(`
Runnable job = () -> System.out.println("Job in " + Thread.currentThread().getName());
Thread t = new Thread(job, "A");

t.run();     // falsch: läuft im main-Thread
t.start();   // richtig: läuft in Thread A
t.join();    // wartet, bis A fertig ist

try {
    t.start();
} catch (IllegalThreadStateException ex) {
    System.out.println("nur einmal startbar");
}
`),
    tip: "Ohne `join()` kann `main` fertig sein, bevor der Thread seine Arbeit beendet hat.",
    keywords: ['start', 'join', 'warten', 'thread beenden', 'run vs start'],
    related: ['Thread', 'Happens-before und Java Memory Model', 'CountDownLatch'],
    mdn: A + 'lang/Thread.html'
  },
  {
    lang: 'java', group: 'Threads', name: 'Thread.sleep()',
    desc: "Pausiert den aktuellen Thread für eine bestimmte Zeit.",
    details: "`Thread.sleep(long millis)` und seit Java 19 `Thread.sleep(Duration)` lassen den Thread schlafen, ohne Locks freizugeben. Die Methode wirft `InterruptedException`, wenn der Thread währenddessen unterbrochen wird. Die Genauigkeit hängt vom Betriebssystem ab. Zum Warten auf ein Ereignis sind `wait()`, Latches oder Queues besser als Schlafen und Nachsehen.",
    syntax: "Thread.sleep(long millis)\nThread.sleep(Duration d)   // seit Java 19",
    example: e(`
long start = System.nanoTime();
Thread.sleep(200);
long ms = (System.nanoTime() - start) / 1_000_000;
System.out.println(ms >= 190);   // true

Thread.sleep(Duration.ofMillis(100));   // seit Java 19
`),
    tip: "In Tests ist `sleep` eine Quelle instabiler Ergebnisse; besser auf ein Ereignis warten (Latch, Future).",
    keywords: ['pause', 'warten', 'schlafen', 'delay', 'sleep', 'InterruptedException'],
    related: ['Thread.interrupt()', 'ScheduledExecutorService', 'wait() und notify()'],
    mdn: A + 'lang/Thread.html'
  },
  {
    lang: 'java', group: 'Threads', name: 'Thread.interrupt()',
    desc: "Kooperativer Abbruch: interrupt() setzt ein Flag, der Thread muss darauf reagieren.",
    details: "`interrupt()` beendet nichts zwangsweise. Blockierende Methoden wie `sleep()`, `wait()` und `join()` brechen mit `InterruptedException` ab und löschen dabei das Flag. Wer die Exception nicht weiterreicht, setzt das Flag mit `Thread.currentThread().interrupt()` wieder, damit höhere Ebenen es noch erkennen. In Schleifen fragt man `isInterrupted()` ab.",
    syntax: "t.interrupt();\nThread.currentThread().isInterrupted();\nThread.interrupted();   // fragt ab und löscht das Flag",
    example: e(`
Thread t = new Thread(() -> {
    try {
        Thread.sleep(10_000);
        System.out.println("nicht erreicht");
    } catch (InterruptedException ex) {
        System.out.println("unterbrochen, Flag: " + Thread.currentThread().isInterrupted());   // false
        Thread.currentThread().interrupt();   // Flag wieder setzen
    }
});
t.start();
t.interrupt();
t.join();
`),
    tip: "`InterruptedException` nie leer schlucken: entweder weiterreichen oder das Flag erneut setzen.",
    keywords: ['unterbrechen', 'abbrechen', 'cancel', 'stoppen', 'InterruptedException', 'interrupt'],
    related: ['Thread.sleep()', 'Thread', 'ExecutorService', 'Future'],
    mdn: A + 'lang/Thread.html'
  },
  {
    lang: 'java', group: 'Threads', name: 'Virtuelle Threads',
    desc: "Leichtgewichtige Threads der JVM (seit Java 21), ideal für viele blockierende Aufgaben.",
    details: "Virtuelle Threads werden von der JVM auf wenige Trägerthreads gelegt. Blockiert ein virtueller Thread in I/O oder `sleep()`, gibt er seinen Träger frei; deshalb sind Hunderttausende gleichzeitig möglich. Man erzeugt sie pro Aufgabe und poolt sie nicht. Sie sind immer Daemon-Threads. Seit Java 24 blockieren `synchronized`-Blöcke den Träger nicht mehr; Aufrufe nativen Codes tun es weiterhin. Für rechenintensive Arbeit bringen sie keinen Vorteil.",
    syntax: "Thread.ofVirtual().start(Runnable)\nThread.startVirtualThread(Runnable)\nExecutors.newVirtualThreadPerTaskExecutor()",
    example: e(`
Thread vt = Thread.ofVirtual().name("v-1").start(() ->
    System.out.println("virtuell: " + Thread.currentThread().isVirtual()));   // virtuell: true
vt.join();

try (ExecutorService ex = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 1000; i++) {
        ex.submit(() -> {
            Thread.sleep(100);   // blockiert nur den virtuellen Thread
            return 1;
        });
    }
}   // close() wartet auf alle 1000 Aufgaben
System.out.println("1000 Aufgaben fertig");
`),
    tip: "Virtuelle Threads nicht in Pools halten und Anzahl nicht mit Semaphore begrenzen, ohne zu überlegen: Sie sind billig, begrenzt werden die Ressourcen dahinter (Datenbank, API).",
    keywords: ['virtual threads', 'loom', 'leichtgewichtig', 'java 21', 'millionen threads', 'project loom'],
    related: ['Executors.newVirtualThreadPerTaskExecutor()', 'Thread', 'Daemon-Threads', 'ThreadLocal'],
    mdn: A + 'lang/Thread.html'
  },
  {
    lang: 'java', group: 'Threads', name: 'Daemon-Threads',
    desc: "Hintergrund-Threads, die das Beenden der JVM nicht aufhalten.",
    details: "Die JVM endet, sobald alle Nicht-Daemon-Threads fertig sind; Daemon-Threads werden dabei ohne Aufräumen abgebrochen. `setDaemon(true)` muss vor `start()` aufgerufen werden, sonst gibt es `IllegalThreadStateException`. Daemon-Threads eignen sich für Hilfsarbeit wie Überwachung, nicht für Aufgaben, die Daten sicher schreiben müssen. Virtuelle Threads sind immer Daemon.",
    syntax: "t.setDaemon(true);   // vor t.start()\nt.isDaemon();",
    example: e(`
Thread d = new Thread(() -> {
    while (true) {
        try {
            Thread.sleep(100);
        } catch (InterruptedException ex) {
            return;
        }
    }
});
d.setDaemon(true);
d.start();
System.out.println(d.isDaemon());   // true
// main endet hier, die JVM beendet sich trotz laufendem d
`),
    tip: "Ohne `setDaemon(true)` läuft ein Programm mit endloser Thread-Schleife nach `main` weiter und beendet sich nie.",
    keywords: ['daemon', 'hintergrund', 'jvm beenden', 'setDaemon', 'programm hängt'],
    related: ['Thread', 'Virtuelle Threads', 'ExecutorService.close()'],
    mdn: A + 'lang/Thread.html'
  },
  {
    lang: 'java', group: 'Threads', name: 'ThreadLocal',
    desc: "Variable mit einem eigenen Wert pro Thread.",
    details: "Jeder Thread sieht seine eigene Kopie, ohne Synchronisation. Typische Verwendung: nicht thread-sichere Objekte pro Thread, Kontext wie Benutzer oder Transaktions-ID. Bei Thread-Pools überleben Werte die einzelne Aufgabe, daher ist `remove()` wichtig, sonst entstehen Speicherlecks und Daten der vorigen Aufgabe tauchen wieder auf. Für virtuelle Threads und unveränderlichen Kontext ist `ScopedValue` die modernere Alternative.",
    syntax: "ThreadLocal<T> tl = ThreadLocal.withInitial(() -> start);\ntl.get(); tl.set(x); tl.remove();",
    example: e(`
ThreadLocal<Integer> zaehler = ThreadLocal.withInitial(() -> 0);
Runnable r = () -> {
    zaehler.set(zaehler.get() + 1);
    zaehler.set(zaehler.get() + 1);
    System.out.println(Thread.currentThread().getName() + ": " + zaehler.get());
};

Thread a = new Thread(r, "A");
Thread b = new Thread(r, "B");
a.start(); a.join();
b.start(); b.join();
// A: 2
// B: 2   (jeder Thread hat seinen eigenen Zähler)
zaehler.remove();
`),
    tip: "In Thread-Pools am Ende der Aufgabe `remove()` aufrufen, sonst sieht die nächste Aufgabe den alten Wert.",
    keywords: ['thread local', 'pro thread', 'kontext', 'threadlocal'],
    related: ['ScopedValue', 'Virtuelle Threads', 'Thread'],
    mdn: A + 'lang/ThreadLocal.html'
  },
  {
    lang: 'java', group: 'Threads', name: 'ScopedValue',
    desc: "Unveränderlicher Kontextwert für einen begrenzten Aufruf (final seit Java 25).",
    details: "`ScopedValue.where(wert, daten).run(...)` bindet einen Wert nur für die Dauer des Aufrufs und aller darin aufgerufenen Methoden. Der Wert ist unveränderlich und wird danach automatisch frei; es gibt kein `remove()`. Im Gegensatz zu `ThreadLocal` ist das günstig bei sehr vielen virtuellen Threads. `get()` auf einen nicht gebundenen Wert wirft `NoSuchElementException`. In Java 25 ist `ScopedValue` final, die zugehörige Structured Concurrency noch Preview.",
    syntax: "static final ScopedValue<T> X = ScopedValue.newInstance();\nScopedValue.where(X, wert).run(() -> ...);\nX.get(); X.isBound();",
    example: e(`
private static final ScopedValue<String> BENUTZER = ScopedValue.newInstance();

static void verarbeite() {
    System.out.println("Benutzer: " + BENUTZER.get());
}

public static void main(String[] args) throws Exception {
    System.out.println(BENUTZER.isBound());   // false

    ScopedValue.where(BENUTZER, "ada").run(() -> verarbeite());   // Benutzer: ada

    String gross = ScopedValue.where(BENUTZER, "alan").call(() -> BENUTZER.get().toUpperCase());
    System.out.println(gross);                // ALAN
    System.out.println(BENUTZER.isBound());   // false: nach dem Aufruf wieder frei
}
`),
    keywords: ['scoped value', 'kontext', 'java 25', 'threadlocal ersatz', 'where', 'run'],
    related: ['ThreadLocal', 'Virtuelle Threads', 'Thread'],
    mdn: A + 'lang/ScopedValue.html'
  },
  {
    lang: 'java', group: 'Threads', name: 'Happens-before und Java Memory Model',
    desc: "Regeln, wann ein Thread die Schreibzugriffe eines anderen sicher sieht.",
    details: "Ohne eine Happens-before-Beziehung darf ein Thread veraltete Werte lesen, da Compiler und CPU umsortieren und zwischenspeichern dürfen. Garantiert wird sie u. a. durch: Freigabe und Erwerb desselben Locks (`synchronized`), Schreiben und Lesen derselben `volatile`-Variable, `Thread.start()` und `join()`, sowie das Übergeben über concurrent-Klassen wie `BlockingQueue` und `Future.get()`. Ein Programm, das nur auf Timing vertraut, ist fehlerhaft, auch wenn es meist funktioniert.",
    example: e(`
class Daten {
    int wert;
    volatile boolean bereit;
}
Daten d = new Daten();

Thread schreiber = new Thread(() -> {
    d.wert = 42;        // 1. normaler Schreibzugriff
    d.bereit = true;    // 2. volatile-Schreiben veröffentlicht alles davor
});
Thread leser = new Thread(() -> {
    while (!d.bereit) {
        Thread.onSpinWait();
    }
    System.out.println(d.wert);   // 42, garantiert (volatile-Lesen sieht alles davor)
});
leser.start();
schreiber.start();
schreiber.join();
leser.join();
`),
    tip: "Ohne `volatile` am Flag `bereit` wäre weder garantiert, dass der Leser je ausbricht, noch dass er 42 sieht.",
    keywords: ['memory model', 'jmm', 'sichtbarkeit', 'visibility', 'reordering', 'happens before', 'speichermodell'],
    related: ['volatile', 'synchronized', 'Thread.start() und Thread.join()', 'Race Condition'],
    mdn: A + 'util/concurrent/package-summary.html'
  },

  // ---------------- Synchronisation ----------------
  {
    lang: 'java', group: 'Synchronisation', name: 'synchronized',
    desc: "Gegenseitiger Ausschluss: nur ein Thread gleichzeitig im Block oder in der Methode.",
    details: "Jedes Java-Objekt besitzt einen Monitor. `synchronized`-Methoden sperren `this` (statische Methoden die Klasse), ein `synchronized (obj)`-Block das angegebene Objekt. Beim Betreten und Verlassen entsteht außerdem eine Happens-before-Beziehung. Der Lock ist reentrant, derselbe Thread darf ihn mehrfach erwerben. Zu große Blöcke bremsen, zu viele Locks bergen Deadlock-Gefahr.",
    syntax: "synchronized void methode() { ... }\nsynchronized (lockObjekt) { ... }",
    example: e(`
class Zaehler {
    private int n;
    synchronized void inc() { n++; }
    synchronized int get() { return n; }
}

Zaehler z = new Zaehler();
Thread[] ts = new Thread[4];
for (int i = 0; i < ts.length; i++) {
    ts[i] = new Thread(() -> {
        for (int j = 0; j < 100_000; j++) z.inc();
    });
    ts[i].start();
}
for (Thread t : ts) t.join();
System.out.println(z.get());   // 400000

Object lock = new Object();
synchronized (lock) {
    System.out.println("exklusiv");
}
`),
    tip: "Auf ein privates `final Object` sperren statt auf `this`: So kann niemand von außen denselben Lock benutzen.",
    keywords: ['monitor', 'sperre', 'lock', 'thread-sicher', 'mutual exclusion', 'kritischer abschnitt'],
    related: ['ReentrantLock', 'volatile', 'wait() und notify()', 'Race Condition', 'Deadlock'],
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'volatile',
    desc: "Garantiert Sichtbarkeit und Reihenfolge einer Variable über Threads, aber keine Atomarität.",
    details: "Ein Schreibzugriff auf eine `volatile`-Variable ist für alle Threads, die sie danach lesen, sofort sichtbar, und was davor geschrieben wurde, ebenfalls. Geeignet für Flags (stop, bereit) und das sichere Veröffentlichen von Objekten. Nicht geeignet für `n++` oder andere Lesen-Ändern-Schreiben-Abläufe: Das sind mehrere Schritte und bleiben ein Race. Dafür braucht man `synchronized` oder Atomics.",
    syntax: "private volatile boolean laeuft = true;",
    example: e(`
class Stopper {
    private volatile boolean laeuft = true;
    void stop() { laeuft = false; }
    void arbeite() {
        long n = 0;
        while (laeuft) n++;
        System.out.println("gestoppt");
    }
}

Stopper s = new Stopper();
Thread t = new Thread(s::arbeite);
t.start();
Thread.sleep(100);
s.stop();
t.join();
// gestoppt
`),
    tip: "`volatile int zaehler; zaehler++;` ist nicht thread-sicher. Dafür `AtomicInteger` oder `LongAdder` verwenden.",
    keywords: ['sichtbarkeit', 'flag', 'visibility', 'memory barrier', 'volatile'],
    related: ['Happens-before und Java Memory Model', 'AtomicInteger', 'synchronized'],
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'wait() und notify()',
    desc: "Threads warten auf eine Bedingung und werden darüber geweckt (Monitor-Methoden).",
    details: "`wait()`, `notify()` und `notifyAll()` sind Methoden von `Object` und nur innerhalb von `synchronized` auf demselben Objekt erlaubt, sonst gibt es `IllegalMonitorStateException`. `wait()` gibt den Lock frei und wartet. Immer in einer `while`-Schleife auf die Bedingung prüfen, nie mit `if`, weil es unechte Aufwachvorgänge gibt. Im Zweifel `notifyAll()` verwenden. Für neuen Code sind `BlockingQueue` und `Condition` meist einfacher.",
    syntax: "synchronized (obj) {\n    while (!bedingung) obj.wait();\n}\nsynchronized (obj) { obj.notifyAll(); }",
    example: e(`
class Briefkasten {
    private String inhalt;
    synchronized void ablegen(String s) {
        inhalt = s;
        notifyAll();
    }
    synchronized String abholen() throws InterruptedException {
        while (inhalt == null) wait();   // while, nie if
        String s = inhalt;
        inhalt = null;
        return s;
    }
}

Briefkasten k = new Briefkasten();
Thread leser = new Thread(() -> {
    try {
        System.out.println("Erhalten: " + k.abholen());   // Erhalten: Post
    } catch (InterruptedException ex) {
        Thread.currentThread().interrupt();
    }
});
leser.start();
Thread.sleep(100);
k.ablegen("Post");
leser.join();
`),
    tip: "Die Bedingung immer in einer Schleife prüfen. Ein `if` übersieht unechte Aufwachvorgänge und mehrere Wartende.",
    keywords: ['wait', 'notify', 'notifyAll', 'monitor', 'produzent konsument', 'condition'],
    related: ['synchronized', 'BlockingQueue', 'ReentrantLock', 'Thread.sleep()'],
    mdn: A + 'lang/Object.html'
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'ReentrantLock',
    desc: "Expliziter Lock mit tryLock, Zeitgrenze und mehreren Bedingungen.",
    details: "Kann mehr als `synchronized`: `tryLock()` mit Timeout, unterbrechbares Warten (`lockInterruptibly()`), Fairness und `Condition`-Objekte. Der Preis: Man muss selbst freigeben, und zwar immer im `finally`, sonst bleibt der Lock bei einer Exception für immer gesperrt. Bei virtuellen Threads ist `ReentrantLock` seit jeher unproblematisch.",
    syntax: "lock.lock();\ntry { ... } finally { lock.unlock(); }\nlock.tryLock(1, TimeUnit.SECONDS)",
    example: e(`
ReentrantLock lock = new ReentrantLock();
int[] zaehler = {0};
Runnable r = () -> {
    for (int i = 0; i < 50_000; i++) {
        lock.lock();
        try {
            zaehler[0]++;
        } finally {
            lock.unlock();   // immer im finally
        }
    }
};

Thread a = new Thread(r);
Thread b = new Thread(r);
a.start(); b.start();
a.join(); b.join();
System.out.println(zaehler[0]);   // 100000

if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try {
        System.out.println("Lock erhalten");
    } finally {
        lock.unlock();
    }
}
`),
    tip: "`unlock()` gehört in ein `finally`. Ohne das bleibt der Lock nach einer Exception gesperrt.",
    keywords: ['lock', 'tryLock', 'sperre', 'condition', 'fairness', 'java.util.concurrent.locks'],
    related: ['synchronized', 'ReadWriteLock', 'Deadlock', 'wait() und notify()'],
    mdn: A + 'util/concurrent/locks/ReentrantLock.html'
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'ReadWriteLock',
    desc: "Viele Leser gleichzeitig, aber nur ein Schreiber und dann ohne Leser.",
    details: "`ReentrantReadWriteLock` liefert `readLock()` und `writeLock()`. Es lohnt sich bei Daten, die oft gelesen und selten geschrieben werden. Ein Schreib-Lock lässt sich zu einem Lese-Lock herabstufen, ein Lese-Lock aber nicht zum Schreib-Lock hochstufen (das blockiert den Thread für immer). Bei kurzen kritischen Abschnitten ist ein einfacher Lock oft schneller.",
    syntax: "ReadWriteLock rw = new ReentrantReadWriteLock();\nrw.readLock().lock(); ...; rw.readLock().unlock();",
    example: e(`
ReadWriteLock rw = new ReentrantReadWriteLock();
Map<String, Integer> daten = new HashMap<>();

rw.writeLock().lock();
try {
    daten.put("a", 1);
} finally {
    rw.writeLock().unlock();
}

rw.readLock().lock();
try {
    System.out.println(daten.get("a"));   // 1
} finally {
    rw.readLock().unlock();
}
`),
    tip: "Nie Lese-Lock halten und Schreib-Lock anfordern: Das ist ein sicherer Deadlock.",
    keywords: ['lesen schreiben lock', 'readLock', 'writeLock', 'ReentrantReadWriteLock', 'cache'],
    related: ['ReentrantLock', 'synchronized', 'ConcurrentHashMap'],
    mdn: A + 'util/concurrent/locks/ReadWriteLock.html'
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'Semaphore',
    desc: "Zählt Erlaubnisse: begrenzt, wie viele Threads gleichzeitig eine Ressource nutzen.",
    details: "`acquire()` nimmt eine Erlaubnis oder wartet, `release()` gibt sie zurück. Damit begrenzt man Zugriffe auf knappe Ressourcen wie Datenbankverbindungen oder externe APIs. `release()` gehört ins `finally`. Mit einer Zahl von 1 verhält sich der Semaphor wie ein Lock, aber ohne Besitzer: Jeder Thread darf freigeben.",
    syntax: "Semaphore s = new Semaphore(int erlaubnisse);\ns.acquire(); try { ... } finally { s.release(); }",
    example: e(`
Semaphore sem = new Semaphore(2);
AtomicInteger aktiv = new AtomicInteger();
AtomicInteger max = new AtomicInteger();

try (ExecutorService ex = Executors.newFixedThreadPool(5)) {
    for (int i = 0; i < 5; i++) {
        ex.submit(() -> {
            sem.acquire();
            try {
                int n = aktiv.incrementAndGet();
                max.accumulateAndGet(n, Math::max);
                Thread.sleep(50);
                aktiv.decrementAndGet();
            } finally {
                sem.release();
            }
            return null;
        });
    }
}
System.out.println(max.get() <= 2);   // true: nie mehr als 2 gleichzeitig
`),
    keywords: ['semaphor', 'begrenzen', 'rate limit', 'ressourcen', 'acquire', 'release', 'permits'],
    related: ['ReentrantLock', 'CountDownLatch', 'ExecutorService'],
    mdn: A + 'util/concurrent/Semaphore.html'
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'CountDownLatch',
    desc: "Einmalige Sperre: Threads warten, bis ein Zähler auf null heruntergezählt ist.",
    details: "`await()` blockiert, bis `countDown()` oft genug aufgerufen wurde. Gut als Startsignal oder zum Warten auf mehrere Aufgaben. Der Zähler lässt sich nicht zurücksetzen; für wiederholte Runden gibt es `CyclicBarrier`. `await(Zeit, Einheit)` liefert false, wenn die Zeit abgelaufen ist. `countDown()` im `finally` aufrufen, sonst wartet man ewig, wenn eine Aufgabe scheitert.",
    syntax: "CountDownLatch l = new CountDownLatch(n);\nl.countDown();\nl.await();",
    example: e(`
CountDownLatch fertig = new CountDownLatch(3);
AtomicInteger summe = new AtomicInteger();

for (int i = 1; i <= 3; i++) {
    int nr = i;
    new Thread(() -> {
        try {
            summe.addAndGet(nr * 10);
        } finally {
            fertig.countDown();
        }
    }).start();
}

boolean ok = fertig.await(2, TimeUnit.SECONDS);
System.out.println(ok);            // true
System.out.println(summe.get());   // 60
`),
    keywords: ['latch', 'warten auf mehrere', 'countDown', 'await', 'synchronisieren'],
    related: ['CyclicBarrier', 'Thread.start() und Thread.join()', 'ExecutorService.invokeAll()'],
    mdn: A + 'util/concurrent/CountDownLatch.html'
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'CyclicBarrier',
    desc: "Wiederverwendbare Barriere: alle Threads warten aufeinander und starten gemeinsam weiter.",
    details: "Jeder Thread ruft `await()` auf und blockiert, bis die vereinbarte Anzahl erreicht ist. Dann laufen alle weiter, und die Barriere ist für die nächste Runde bereit. Optional läuft eine Aktion, sobald alle angekommen sind. Fällt ein Teilnehmer aus, bricht die Barriere für alle mit `BrokenBarrierException`. Die Zahl der Threads muss mindestens der Teilnehmerzahl entsprechen, sonst warten alle ewig.",
    syntax: "new CyclicBarrier(int parteien, Runnable aktion)\nbarriere.await();",
    example: e(`
CyclicBarrier barriere = new CyclicBarrier(3, () -> System.out.println("Runde komplett"));

try (ExecutorService ex = Executors.newFixedThreadPool(3)) {
    for (int i = 0; i < 3; i++) {
        ex.submit(() -> {
            for (int runde = 0; runde < 2; runde++) {
                barriere.await();   // wartet auf die anderen zwei
            }
            return null;
        });
    }
}
// Runde komplett
// Runde komplett
`),
    keywords: ['barriere', 'barrier', 'rendezvous', 'runden', 'gemeinsam starten'],
    related: ['CountDownLatch', 'Semaphore', 'ExecutorService'],
    mdn: A + 'util/concurrent/CyclicBarrier.html'
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'AtomicInteger',
    desc: "Thread-sichere Zahl mit atomaren Operationen ohne Lock (auch AtomicLong, AtomicReference).",
    details: "Operationen wie `incrementAndGet()`, `addAndGet()` und `compareAndSet()` laufen unteilbar über CPU-Befehle (CAS). Damit baut man Zähler und lockfreie Strukturen. `updateAndGet(f)` und `accumulateAndGet()` wiederholen die Funktion bei Konflikt, sie muss daher frei von Nebenwirkungen sein. Bei sehr vielen Schreibern auf einem Zähler ist `LongAdder` schneller.",
    syntax: "AtomicInteger n = new AtomicInteger(0);\nn.incrementAndGet(); n.compareAndSet(erwartet, neu);",
    values: [
      ['incrementAndGet()', 'Erhöht um 1 und liefert den neuen Wert'],
      ['getAndIncrement()', 'Liefert den alten Wert, dann erhöhen'],
      ['compareAndSet(a, b)', 'Setzt auf b, wenn der Wert gerade a ist'],
      ['updateAndGet(f)', 'Wendet eine Funktion atomar an']
    ],
    example: e(`
AtomicInteger zaehler = new AtomicInteger();
Runnable r = () -> {
    for (int i = 0; i < 100_000; i++) zaehler.incrementAndGet();
};
Thread a = new Thread(r);
Thread b = new Thread(r);
a.start(); b.start();
a.join(); b.join();

System.out.println(zaehler.get());                       // 200000
System.out.println(zaehler.compareAndSet(200000, 0));    // true
System.out.println(zaehler.updateAndGet(x -> x + 5));    // 5
`),
    keywords: ['atomar', 'atomic', 'cas', 'compare and set', 'zähler', 'lockfrei'],
    related: ['LongAdder', 'volatile', 'Race Condition', 'synchronized'],
    mdn: A + 'util/concurrent/atomic/AtomicInteger.html'
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'LongAdder',
    desc: "Schneller Zähler für viele schreibende Threads.",
    details: "`LongAdder` verteilt Zuwächse intern auf mehrere Zellen und addiert erst beim Lesen mit `sum()`. Das reduziert Konflikte bei hoher Last stark. `sum()` ist nicht atomar zu gleichzeitigen Änderungen, liefert also nur einen Näherungswert, solange noch geschrieben wird. Darum eignet er sich für Statistiken und Zähler, nicht für Vergleiche wie \"genau bis 100 zählen\".",
    syntax: "LongAdder a = new LongAdder();\na.increment(); a.add(5); a.sum();",
    example: e(`
LongAdder summe = new LongAdder();

try (ExecutorService ex = Executors.newFixedThreadPool(4)) {
    for (int t = 0; t < 4; t++) {
        ex.execute(() -> {
            for (int i = 0; i < 100_000; i++) summe.increment();
        });
    }
}
System.out.println(summe.sum());   // 400000
`),
    tip: "Wird oft gelesen und selten geschrieben, ist `AtomicLong` die bessere Wahl.",
    keywords: ['zähler', 'statistik', 'adder', 'contention', 'LongAccumulator'],
    related: ['AtomicInteger', 'ConcurrentHashMap', 'Race Condition'],
    mdn: A + 'util/concurrent/atomic/LongAdder.html'
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'Race Condition',
    desc: "Fehler, wenn das Ergebnis vom zufälligen Zeitablauf mehrerer Threads abhängt.",
    details: "Klassisch: `n++` besteht aus Lesen, Addieren und Schreiben; zwei Threads überschreiben gegenseitig ihre Zwischenstände. Ebenso fehlerhaft sind Check-then-act-Abläufe wie `if (!map.containsKey(k)) map.put(k, v)`. Der Fehler zeigt sich nur manchmal und verschwindet beim Debuggen. Abhilfe: gemeinsamen Zustand vermeiden, unveränderliche Objekte nutzen oder mit Locks, Atomics und thread-sicheren Sammlungen schützen.",
    example: e(`
int[] n = {0};
Runnable r = () -> {
    for (int i = 0; i < 1_000_000; i++) n[0]++;   // nicht atomar!
};
Thread a = new Thread(r);
Thread b = new Thread(r);
a.start(); b.start();
a.join(); b.join();

System.out.println(n[0]);   // kann kleiner als 2000000 sein, nicht reproduzierbar

// Check-then-act mit atomarer Variante:
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
map.putIfAbsent("k", 1);    // statt containsKey + put
`),
    tip: "Ein Test, der \"meistens grün\" ist, beweist nicht, dass kein Race vorliegt.",
    keywords: ['wettlauf', 'race', 'nicht thread-sicher', 'data race', 'check then act', 'fehler'],
    related: ['synchronized', 'AtomicInteger', 'Happens-before und Java Memory Model', 'ConcurrentHashMap'],
  },
  {
    lang: 'java', group: 'Synchronisation', name: 'Deadlock',
    desc: "Zwei oder mehr Threads blockieren sich gegenseitig für immer.",
    details: "Thread 1 hält Lock A und will B, Thread 2 hält B und will A: Keiner kommt weiter. Das Programm hängt ohne Fehlermeldung. Abhilfe: Locks immer in derselben festen Reihenfolge nehmen, so wenige Locks wie möglich halten, `tryLock()` mit Timeout verwenden. Einen hängenden Prozess analysiert man mit einem Thread-Dump (`jstack` oder `jcmd <pid> Thread.print`), der Deadlocks ausdrücklich meldet.",
    example: e(`
static final Object A = new Object();
static final Object B = new Object();

// Gefährlich: entgegengesetzte Reihenfolge
static void thread1() throws InterruptedException {
    synchronized (A) {
        Thread.sleep(50);
        synchronized (B) { System.out.println("1 fertig"); }
    }
}
static void thread2() throws InterruptedException {
    synchronized (B) {
        Thread.sleep(50);
        synchronized (A) { System.out.println("2 fertig"); }
    }
}

// Lösung: immer erst A, dann B
static void thread2Sicher() {
    synchronized (A) {
        synchronized (B) { System.out.println("2 fertig"); }
    }
}
`),
    tip: "Hängt ein Programm, hilft \"jcmd <pid> Thread.print\": Der Dump nennt die beteiligten Threads und Locks.",
    keywords: ['verklemmung', 'hängt', 'deadlock', 'lock reihenfolge', 'jstack', 'livelock'],
    related: ['synchronized', 'ReentrantLock', 'Race Condition'],
  },

  // ---------------- Executor & Futures ----------------
  {
    lang: 'java', group: 'Executor & Futures', name: 'ExecutorService',
    desc: "Führt Aufgaben auf einem Thread-Pool aus und liefert Futures zurück.",
    details: "Ein `ExecutorService` trennt das Einreichen von Aufgaben (`submit()`, `execute()`) vom Ausführen. Er wiederverwendet Threads und begrenzt die Parallelität. Wichtig: Ein nicht beendeter Pool hält die JVM am Leben. Mit `shutdown()` und `awaitTermination()` oder seit Java 19 einfach `close()` beendet man ihn. Structured Concurrency (`StructuredTaskScope`) ist in Java 25 noch Preview und hier nicht Thema.",
    syntax: "ExecutorService pool = Executors.newFixedThreadPool(n);\nFuture<T> f = pool.submit(callable);\npool.shutdown();",
    values: [
      ['submit(task)', 'Reicht Runnable oder Callable ein, liefert Future'],
      ['execute(runnable)', 'Reicht ein, ohne Future'],
      ['shutdown()', 'Nimmt nichts Neues an, erledigt Laufendes'],
      ['shutdownNow()', 'Versucht laufende Aufgaben zu unterbrechen'],
      ['awaitTermination(t, einheit)', 'Wartet auf das Ende nach shutdown()'],
      ['close()', 'shutdown + warten (seit Java 19)']
    ],
    example: e(`
ExecutorService pool = Executors.newFixedThreadPool(3);
Future<Integer> f = pool.submit(() -> 6 * 7);
System.out.println(f.get());   // 42

pool.shutdown();
System.out.println(pool.awaitTermination(1, TimeUnit.SECONDS));   // true
`),
    tip: "Ein vergessener Pool verhindert das Programmende. Immer schließen, am besten mit try-with-resources.",
    keywords: ['thread pool', 'pool', 'submit', 'execute', 'shutdown', 'awaitTermination', 'executor'],
    related: ['Executors', 'Future', 'ExecutorService.close()', 'Callable', 'try-with-resources'],
    mdn: A + 'util/concurrent/ExecutorService.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'Executors',
    desc: "Fabrikmethoden für gängige Thread-Pools.",
    details: "`newFixedThreadPool(n)` hat feste Größe mit unbegrenzter Warteschlange; `newCachedThreadPool()` erzeugt bei Bedarf beliebig viele Threads; `newSingleThreadExecutor()` führt Aufgaben nacheinander aus; `newScheduledThreadPool()` plant zeitgesteuert; `newVirtualThreadPerTaskExecutor()` startet pro Aufgabe einen virtuellen Thread. Eigene Namen für Threads vergibt man über eine `ThreadFactory`, was Logs deutlich lesbarer macht.",
    syntax: "Executors.newFixedThreadPool(int n)\nExecutors.newCachedThreadPool()\nExecutors.newVirtualThreadPerTaskExecutor()",
    example: e(`
ExecutorService fest = Executors.newFixedThreadPool(2);
ExecutorService einzel = Executors.newSingleThreadExecutor();
ExecutorService cached = Executors.newCachedThreadPool();
ScheduledExecutorService plan = Executors.newScheduledThreadPool(1);
ExecutorService virtuell = Executors.newVirtualThreadPerTaskExecutor();

// Eigene Threadnamen
ExecutorService benannt = Executors.newFixedThreadPool(2,
    Thread.ofPlatform().name("worker-", 0).factory());
System.out.println(benannt.submit(() -> Thread.currentThread().getName()).get());   // worker-0

for (ExecutorService s : List.of(fest, einzel, cached, plan, virtuell, benannt)) {
    s.close();
}
`),
    tip: "Ein Cached-Pool ohne Obergrenze kann bei Lastspitzen tausende Threads anlegen; in solchen Fällen einen festen Pool oder virtuelle Threads verwenden.",
    keywords: ['thread pool', 'newFixedThreadPool', 'newCachedThreadPool', 'factory', 'ThreadFactory', 'pool erzeugen'],
    related: ['ExecutorService', 'Executors.newVirtualThreadPerTaskExecutor()', 'ScheduledExecutorService', 'ForkJoinPool'],
    mdn: A + 'util/concurrent/Executors.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'Executors.newVirtualThreadPerTaskExecutor()',
    desc: "Executor, der pro Aufgabe einen neuen virtuellen Thread startet (seit Java 21).",
    details: "Es gibt keinen Pool und keine Obergrenze: jede Aufgabe bekommt ihren eigenen billigen Thread. Das passt zu vielen blockierenden Aufgaben wie HTTP-Aufrufen oder Datenbankzugriffen. Der Executor ist `AutoCloseable`; `close()` wartet auf alle Aufgaben. Begrenzen sollte man die Last der Ressourcen dahinter, etwa mit einem `Semaphore`, nicht die Zahl der Threads.",
    syntax: "try (ExecutorService ex = Executors.newVirtualThreadPerTaskExecutor()) { ... }",
    example: e(`
try (ExecutorService ex = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> fs = new ArrayList<>();
    for (int i = 0; i < 1_000; i++) {
        int nr = i;
        fs.add(ex.submit(() -> {
            Thread.sleep(Duration.ofMillis(100));
            return "Task " + nr;
        }));
    }
    System.out.println(fs.get(999).get());   // Task 999
}
`),
    keywords: ['virtual threads', 'virtuelle threads executor', 'pro aufgabe', 'java 21', 'loom'],
    related: ['Virtuelle Threads', 'ExecutorService', 'Semaphore', 'ExecutorService.close()'],
    mdn: A + 'util/concurrent/Executors.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'Future',
    desc: "Handle auf ein Ergebnis, das erst später vorliegt.",
    details: "`get()` blockiert bis zum Ergebnis; mit Zeitgrenze wirft es `TimeoutException`. Wirft die Aufgabe, kommt die Exception als `ExecutionException` mit der Ursache in `getCause()`. `cancel(true)` unterbricht die Aufgabe über `interrupt()`. Seit Java 19 gibt es zusätzlich `state()` und `resultNow()`. Für Verkettung ohne Blockieren ist `CompletableFuture` gedacht.",
    syntax: "Future<T> f = executor.submit(callable);\nf.get(); f.get(1, TimeUnit.SECONDS); f.cancel(true); f.isDone();",
    example: e(`
ExecutorService ex = Executors.newSingleThreadExecutor();

Future<String> f = ex.submit(() -> {
    Thread.sleep(100);
    return "fertig";
});
System.out.println(f.isDone());   // meist false, die Aufgabe schläft noch
System.out.println(f.get());      // fertig

Future<String> langsam = ex.submit(() -> {
    Thread.sleep(5_000);
    return "spaet";
});
try {
    langsam.get(100, TimeUnit.MILLISECONDS);
} catch (TimeoutException t) {
    langsam.cancel(true);
    System.out.println("Timeout");
}

Future<Integer> fehler = ex.submit(() -> Integer.parseInt("x"));
try {
    fehler.get();
} catch (ExecutionException x) {
    System.out.println(x.getCause().getClass().getSimpleName());   // NumberFormatException
}
ex.close();
`),
    tip: "`get()` ohne Zeitgrenze kann ewig blockieren; in produktivem Code besser mit Timeout aufrufen.",
    keywords: ['ergebnis', 'async', 'get', 'cancel', 'ExecutionException', 'timeout'],
    related: ['ExecutorService', 'Callable', 'CompletableFuture', 'Thread.interrupt()'],
    mdn: A + 'util/concurrent/Future.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'Callable',
    desc: "Aufgabe mit Rückgabewert, die geprüfte Exceptions werfen darf.",
    details: "`Callable<V>` hat die Methode `V call() throws Exception`. Das macht es zur Variante von `Runnable` für Aufgaben mit Ergebnis. Beim Einreichen entscheidet der Compiler anhand des Lambdas: Gibt es einen `return` mit Wert, wird es als `Callable` verstanden. Exceptions landen im `Future` und kommen erst bei `get()` als `ExecutionException` an.",
    syntax: "Callable<Integer> c = () -> 42;\nFuture<Integer> f = executor.submit(c);",
    example: e(`
Callable<Integer> quadrat = () -> 7 * 7;
Callable<String> wirft = () -> { throw new IOException("kaputt"); };
System.out.println(quadrat.call());   // 49

try (ExecutorService ex = Executors.newSingleThreadExecutor()) {
    Future<String> f = ex.submit(wirft);
    try {
        f.get();
    } catch (ExecutionException x) {
        System.out.println(x.getCause().getMessage());   // kaputt
    }
}
`),
    keywords: ['aufgabe mit ergebnis', 'call', 'rückgabewert', 'callable vs runnable'],
    related: ['Runnable', 'Future', 'ExecutorService', 'ExecutorService.invokeAll()'],
    mdn: A + 'util/concurrent/Callable.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'ExecutorService.invokeAll()',
    desc: "Führt viele Callables aus und wartet, bis alle fertig sind; invokeAny() nimmt das erste Ergebnis.",
    details: "`invokeAll(Collection<Callable<T>>)` blockiert, bis alle Aufgaben abgeschlossen sind, und liefert die `Future`s in der Reihenfolge der Eingabe. Fehler einzelner Aufgaben zeigen sich erst bei `get()`. `invokeAny()` liefert das Ergebnis der ersten erfolgreichen Aufgabe und bricht die übrigen ab. Beide gibt es auch mit Zeitgrenze.",
    syntax: "List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks)\nT invokeAny(Collection<? extends Callable<T>> tasks)",
    example: e(`
List<Callable<Integer>> aufgaben = List.of(() -> 1, () -> 2, () -> 3);

try (ExecutorService ex = Executors.newFixedThreadPool(3)) {
    int summe = 0;
    for (Future<Integer> f : ex.invokeAll(aufgaben)) {
        summe += f.get();
    }
    System.out.println(summe);   // 6

    List<Callable<String>> kandidaten = List.of(() -> "a", () -> "a");
    System.out.println(ex.invokeAny(kandidaten));   // a
}
`),
    keywords: ['alle aufgaben', 'invokeAny', 'batch', 'mehrere aufgaben', 'warten auf alle'],
    related: ['ExecutorService', 'Callable', 'Future', 'CompletableFuture.allOf()'],
    mdn: A + 'util/concurrent/ExecutorService.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'ExecutorService.close()',
    desc: "Beendet den Executor und wartet auf laufende Aufgaben (seit Java 19).",
    details: "`ExecutorService` ist seit Java 19 `AutoCloseable`. `close()` ruft `shutdown()` auf und wartet, bis alle Aufgaben fertig sind. Wird der wartende Thread unterbrochen, ruft `close()` `shutdownNow()` auf. So wird try-with-resources die einfachste Form, einen Pool sauber zu beenden. Vorher musste man `shutdown()` und `awaitTermination()` selbst kombinieren.",
    syntax: "try (ExecutorService ex = Executors.newFixedThreadPool(2)) { ... }",
    example: e(`
AtomicInteger fertig = new AtomicInteger();

try (ExecutorService ex = Executors.newFixedThreadPool(2)) {
    for (int i = 0; i < 4; i++) {
        ex.submit(() -> {
            Thread.sleep(50);
            return fertig.incrementAndGet();
        });
    }
}   // close(): wartet auf alle vier Aufgaben
System.out.println(fertig.get());   // 4

// Früher (vor Java 19):
// pool.shutdown();
// if (!pool.awaitTermination(10, TimeUnit.SECONDS)) pool.shutdownNow();
`),
    keywords: ['close', 'beenden', 'shutdown', 'try-with-resources', 'java 19', 'aufräumen'],
    related: ['ExecutorService', 'try-with-resources', 'Executors'],
    mdn: A + 'util/concurrent/ExecutorService.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'CompletableFuture',
    desc: "Future, das sich verketten und kombinieren lässt, ohne zu blockieren.",
    details: "Ein `CompletableFuture<T>` kann von außen mit `complete()` oder `completeExceptionally()` abgeschlossen werden und bietet Methoden, um Folgeschritte anzuhängen (`thenApply`, `thenCompose`, `thenCombine`). `join()` wartet wie `get()`, wirft aber ungeprüfte `CompletionException`. Mit `orTimeout()` und `completeOnTimeout()` (seit Java 9) lassen sich Zeitgrenzen setzen. Ohne eigenen Executor laufen die `...Async`-Varianten im gemeinsamen ForkJoin-Pool.",
    syntax: "CompletableFuture<T> cf = new CompletableFuture<>();\ncf.complete(wert);\ncf.join(); cf.get();",
    example: e(`
CompletableFuture<String> cf = new CompletableFuture<>();
new Thread(() -> cf.complete("Wert")).start();
System.out.println(cf.get());    // Wert

CompletableFuture<Integer> fertig = CompletableFuture.completedFuture(5);
System.out.println(fertig.join());   // 5

CompletableFuture<String> nie = new CompletableFuture<String>().completeOnTimeout("Ersatz", 100, TimeUnit.MILLISECONDS);
System.out.println(nie.join());      // Ersatz
`),
    tip: "`join()` wirft `CompletionException`, `get()` wirft `ExecutionException` (geprüft). Die eigentliche Ursache steckt jeweils in `getCause()`.",
    keywords: ['asynchron', 'promise', 'future verketten', 'async', 'non-blocking', 'completablefuture'],
    related: ['CompletableFuture.supplyAsync()', 'CompletableFuture.thenApply()', 'Future', 'HttpClient'],
    mdn: A + 'util/concurrent/CompletableFuture.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'CompletableFuture.supplyAsync()',
    desc: "Startet eine Berechnung mit Ergebnis asynchron (runAsync() ohne Ergebnis).",
    details: "`supplyAsync(Supplier)` läuft standardmäßig im gemeinsamen ForkJoin-Pool, dessen Threads Daemon-Threads sind. Für blockierende Aufgaben (I/O) übergibt man einen eigenen `Executor` als zweiten Parameter, sonst blockiert man den gemeinsamen Pool. Ausnahmen im Supplier landen im Future und zeigen sich erst bei `join()` oder `get()`.",
    syntax: "CompletableFuture.supplyAsync(Supplier<T> s)\nCompletableFuture.supplyAsync(Supplier<T> s, Executor ex)\nCompletableFuture.runAsync(Runnable r)",
    example: e(`
try (ExecutorService ex = Executors.newFixedThreadPool(2)) {
    CompletableFuture<Integer> f = CompletableFuture.supplyAsync(() -> 6 * 7, ex);
    CompletableFuture<Void> g = CompletableFuture.runAsync(() -> { }, ex);

    System.out.println(f.join());   // 42
    g.join();
}
`),
    tip: "Blockierende Aufrufe (Netzwerk, Datenbank) nie im gemeinsamen ForkJoin-Pool ausführen, sondern mit eigenem Executor oder virtuellen Threads.",
    keywords: ['async starten', 'runAsync', 'supplyAsync', 'asynchrone berechnung', 'commonPool'],
    related: ['CompletableFuture', 'CompletableFuture.thenApply()', 'ForkJoinPool', 'Executors.newVirtualThreadPerTaskExecutor()'],
    mdn: A + 'util/concurrent/CompletableFuture.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'CompletableFuture.thenApply()',
    desc: "Wandelt das Ergebnis um, sobald es da ist (wie map); weitere then-Methoden folgen.",
    details: "`thenApply(f)` transformiert den Wert, `thenAccept(c)` verbraucht ihn ohne Ergebnis, `thenRun(r)` läuft danach ohne Wert, `thenCombine(anderes, f)` verbindet zwei Futures. Jeder Schritt liefert ein neues `CompletableFuture`; ein Fehler überspringt alle Folgeschritte bis zu einer Fehlerbehandlung. Die `...Async`-Varianten starten den Schritt in einem Pool.",
    syntax: "cf.thenApply(x -> y)\ncf.thenAccept(x -> ...)\ncf.thenCombine(other, (a, b) -> ...)",
    example: e(`
CompletableFuture<String> text = CompletableFuture.supplyAsync(() -> 20)
    .thenApply(x -> x + 1)
    .thenApply(x -> "Ergebnis " + x);
System.out.println(text.join());   // Ergebnis 21

CompletableFuture.supplyAsync(() -> 5)
    .thenAccept(x -> System.out.println("Wert " + x))   // Wert 5
    .join();

CompletableFuture<Integer> a = CompletableFuture.supplyAsync(() -> 3);
CompletableFuture<Integer> b = CompletableFuture.supplyAsync(() -> 4);
System.out.println(a.thenCombine(b, Integer::sum).join());   // 7
`),
    keywords: ['map', 'transformieren', 'thenAccept', 'thenCombine', 'verketten', 'callback'],
    related: ['CompletableFuture.thenCompose()', 'CompletableFuture.supplyAsync()', 'CompletableFuture.exceptionally()'],
    mdn: A + 'util/concurrent/CompletableFuture.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'CompletableFuture.thenCompose()',
    desc: "Hängt einen weiteren asynchronen Schritt an (wie flatMap).",
    details: "Liefert der Folgeschritt selbst ein `CompletableFuture`, würde `thenApply` ein verschachteltes `CompletableFuture<CompletableFuture<T>>` ergeben. `thenCompose` flacht das ab. Damit lassen sich abhängige asynchrone Abläufe sequenziell schreiben, z. B. erst Benutzer laden, dann dessen Bestellungen.",
    syntax: "cf.thenCompose(x -> weitererAsyncAufruf(x))",
    example: e(`
Function<String, CompletableFuture<Integer>> userId =
    name -> CompletableFuture.supplyAsync(() -> name.length());
Function<Integer, CompletableFuture<String>> bestellung =
    id -> CompletableFuture.supplyAsync(() -> "Bestellung " + id);

CompletableFuture<String> ergebnis = userId.apply("Ada").thenCompose(bestellung);
System.out.println(ergebnis.join());   // Bestellung 3

// thenApply ergäbe ein verschachteltes Future:
CompletableFuture<CompletableFuture<String>> verschachtelt =
    userId.apply("Ada").thenApply(bestellung);
`),
    keywords: ['flatMap', 'verschachtelt', 'abhängige aufrufe', 'sequenziell', 'compose'],
    related: ['CompletableFuture.thenApply()', 'CompletableFuture.allOf()', 'CompletableFuture'],
    mdn: A + 'util/concurrent/CompletableFuture.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'CompletableFuture.allOf()',
    desc: "Wartet auf mehrere Futures; anyOf() auf das erste fertige.",
    details: "`allOf(...)` liefert ein `CompletableFuture<Void>`, das fertig ist, wenn alle Eingaben fertig sind; die Einzelergebnisse holt man anschließend per `join()` aus den Original-Futures. Schlägt eines fehl, endet auch das Gesamt-Future mit Fehler, die anderen laufen aber weiter. `anyOf(...)` liefert das Ergebnis des ersten fertigen als `Object`.",
    syntax: "CompletableFuture<Void> alle = CompletableFuture.allOf(f1, f2, f3);\nCompletableFuture<Object> eins = CompletableFuture.anyOf(f1, f2);",
    example: e(`
List<CompletableFuture<Integer>> teile = new ArrayList<>();
for (int i = 1; i <= 3; i++) {
    int n = i;
    teile.add(CompletableFuture.supplyAsync(() -> n * 10));
}

CompletableFuture.allOf(teile.toArray(new CompletableFuture<?>[0])).join();
int summe = teile.stream().mapToInt(CompletableFuture::join).sum();
System.out.println(summe);   // 60
`),
    keywords: ['alle fertig', 'anyOf', 'parallel warten', 'mehrere futures', 'zusammenführen'],
    related: ['CompletableFuture.thenCompose()', 'ExecutorService.invokeAll()', 'CountDownLatch'],
    mdn: A + 'util/concurrent/CompletableFuture.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'CompletableFuture.exceptionally()',
    desc: "Fängt Fehler einer Kette ab und liefert einen Ersatzwert; handle() und whenComplete() ebenso.",
    details: "Wirft ein Schritt, überspringt die Kette alle `then...`-Stufen bis zu einer Fehlerbehandlung. `exceptionally(f)` erhält die Exception und liefert einen Ersatzwert. `handle((wert, fehler) -> ...)` wird immer aufgerufen, `whenComplete()` beobachtet nur und ändert das Ergebnis nicht. Die Exception ist oft in eine `CompletionException` verpackt; die Ursache steckt in `getCause()`.",
    syntax: "cf.exceptionally(ex -> ersatz)\ncf.handle((wert, ex) -> ...)\ncf.whenComplete((wert, ex) -> ...)",
    example: e(`
CompletableFuture<Integer> f = CompletableFuture.supplyAsync(() -> Integer.parseInt("abc"))
    .exceptionally(ex -> {
        System.out.println(ex.getClass().getSimpleName() + " / " + ex.getCause().getClass().getSimpleName());
        return -1;
    });
System.out.println(f.join());   // -1

String s = CompletableFuture.supplyAsync(() -> 10 / 2)
    .handle((wert, ex) -> ex == null ? "ok " + wert : "Fehler")
    .join();
System.out.println(s);          // ok 5
`),
    tip: "Ein nie abgefragtes Future mit Fehler verschluckt die Exception. Immer mit `exceptionally`, `handle` oder `join` auswerten.",
    keywords: ['fehlerbehandlung', 'handle', 'whenComplete', 'ausnahme', 'CompletionException', 'fallback'],
    related: ['CompletableFuture.thenApply()', 'CompletableFuture', 'Future'],
    mdn: A + 'util/concurrent/CompletableFuture.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'ForkJoinPool',
    desc: "Pool mit Work-Stealing für rekursiv zerlegbare Aufgaben (Fork/Join).",
    details: "Eine Aufgabe teilt sich selbst (`fork()`) in kleinere Teile, die parallel laufen, und führt die Ergebnisse mit `join()` zusammen (`RecursiveTask<T>` mit Ergebnis, `RecursiveAction` ohne). Untätige Threads stehlen Arbeit von anderen. Der gemeinsame Pool `ForkJoinPool.commonPool()` dient auch parallelen Streams und `CompletableFuture`. Sinnvoll nur für CPU-intensive Arbeit mit ausreichend großen Teilaufgaben, nicht für blockierende I/O.",
    syntax: "class T extends RecursiveTask<Long> { protected Long compute() { ... } }\nForkJoinPool.commonPool().invoke(new T());",
    example: e(`
class Summe extends RecursiveTask<Long> {
    final int[] a;
    final int von, bis;
    Summe(int[] a, int von, int bis) { this.a = a; this.von = von; this.bis = bis; }

    protected Long compute() {
        if (bis - von <= 1_000) {
            long s = 0;
            for (int i = von; i < bis; i++) s += a[i];
            return s;
        }
        int mitte = (von + bis) / 2;
        Summe links = new Summe(a, von, mitte);
        links.fork();                                    // linke Hälfte parallel
        long rechts = new Summe(a, mitte, bis).compute();   // rechte im selben Thread
        return links.join() + rechts;
    }
}

int[] daten = IntStream.rangeClosed(1, 100_000).toArray();
long s = ForkJoinPool.commonPool().invoke(new Summe(daten, 0, daten.length));
System.out.println(s);   // 5000050000
`),
    tip: "Teilaufgaben zu klein zu schneiden kostet mehr Verwaltung als die Arbeit selbst; eine Schwelle (hier 1000) wählen.",
    keywords: ['fork join', 'work stealing', 'rekursiv', 'RecursiveTask', 'parallel', 'commonPool', 'divide and conquer'],
    related: ['ExecutorService', 'CompletableFuture.supplyAsync()', 'Executors'],
    mdn: A + 'util/concurrent/ForkJoinPool.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'ScheduledExecutorService',
    desc: "Führt Aufgaben zeitversetzt oder wiederholt aus.",
    details: "`schedule()` startet eine Aufgabe einmal nach einer Verzögerung. `scheduleAtFixedRate()` startet in festem Takt (Beginn zu Beginn), `scheduleWithFixedDelay()` wartet nach jeder Ausführung die Pause ab (Ende zu Beginn). Wirft eine wiederholte Aufgabe eine Exception, wird sie stillschweigend nicht mehr ausgeführt: Fehler daher in der Aufgabe selbst abfangen. Zum Stoppen `cancel()` auf dem Rückgabewert oder den Executor schließen.",
    syntax: "ScheduledExecutorService s = Executors.newScheduledThreadPool(1);\ns.schedule(task, 5, TimeUnit.SECONDS);\ns.scheduleAtFixedRate(task, 0, 1, TimeUnit.SECONDS);",
    example: e(`
try (ScheduledExecutorService plan = Executors.newScheduledThreadPool(1)) {
    ScheduledFuture<String> einmal = plan.schedule(() -> "spaeter", 100, TimeUnit.MILLISECONDS);
    System.out.println(einmal.get());   // spaeter

    AtomicInteger n = new AtomicInteger();
    ScheduledFuture<?> serie = plan.scheduleAtFixedRate(
        () -> System.out.println("Tick " + n.incrementAndGet()),
        0, 100, TimeUnit.MILLISECONDS);
    Thread.sleep(250);
    serie.cancel(false);   // etwa Tick 1 bis Tick 3
}
`),
    tip: "Eine Exception in einer wiederholten Aufgabe beendet die Wiederholung lautlos. Den Inhalt der Aufgabe mit try/catch absichern.",
    keywords: ['timer', 'zeitplan', 'periodisch', 'cron', 'verzögert', 'scheduleAtFixedRate'],
    related: ['Executors', 'ExecutorService', 'Thread.sleep()'],
    mdn: A + 'util/concurrent/ScheduledExecutorService.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'ConcurrentHashMap',
    desc: "Thread-sichere Map mit hoher Parallelität und atomaren Operationen.",
    details: "Einzelne Operationen wie `put`, `get`, `merge`, `compute` und `computeIfAbsent` sind atomar; Lesen blockiert nicht. Mehrstufige Abläufe wie \"prüfen und dann setzen\" sind nur mit diesen atomaren Methoden sicher, nicht mit getrenntem `containsKey` und `put`. Schlüssel und Werte dürfen nicht `null` sein. Die Iteration ist schwach konsistent: Sie wirft keine `ConcurrentModificationException`, sieht aber nicht zwingend jede gleichzeitige Änderung.",
    syntax: "ConcurrentHashMap<K, V> map = new ConcurrentHashMap<>();\nmap.merge(key, 1, Integer::sum);",
    example: e(`
ConcurrentHashMap<String, Integer> zaehler = new ConcurrentHashMap<>();

try (ExecutorService ex = Executors.newFixedThreadPool(4)) {
    for (int t = 0; t < 4; t++) {
        ex.execute(() -> {
            for (int i = 0; i < 1000; i++) zaehler.merge("a", 1, Integer::sum);
        });
    }
}
System.out.println(zaehler.get("a"));   // 4000

zaehler.computeIfAbsent("b", k -> 10);
System.out.println(zaehler.get("b"));   // 10

try {
    zaehler.put("x", null);
} catch (NullPointerException ex) {
    System.out.println("null nicht erlaubt");
}
`),
    tip: "`Collections.synchronizedMap` sperrt die ganze Map; `ConcurrentHashMap` ist bei Last deutlich skalierbarer.",
    keywords: ['thread-sichere map', 'concurrent map', 'merge', 'computeIfAbsent', 'synchronizedMap'],
    related: ['CopyOnWriteArrayList', 'LongAdder', 'Race Condition', 'ReadWriteLock'],
    mdn: A + 'util/concurrent/ConcurrentHashMap.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'CopyOnWriteArrayList',
    desc: "Thread-sichere Liste, die bei jeder Änderung eine neue Kopie anlegt.",
    details: "Lesen und Iterieren sind ohne Sperre möglich, und ein Iterator arbeitet auf einem Schnappschuss, wirft also nie `ConcurrentModificationException`. Jede Änderung kopiert dafür das gesamte Array. Gut geeignet für viele Leser und seltene Änderungen, z. B. Listener-Listen. Bei häufigen Schreibzugriffen oder großen Listen ist sie zu teuer. Der Iterator selbst erlaubt keine Änderungen.",
    syntax: "List<String> liste = new CopyOnWriteArrayList<>();",
    example: e(`
List<String> liste = new CopyOnWriteArrayList<>(List.of("a", "b", "c"));
for (String s : liste) {
    if (s.equals("b")) liste.add("neu");   // kein ConcurrentModificationException
}
System.out.println(liste);   // [a, b, c, neu]

List<String> normal = new ArrayList<>(List.of("a", "b", "c"));
try {
    for (String s : normal) {
        if (s.equals("a")) normal.add("x");
    }
} catch (ConcurrentModificationException ex) {
    System.out.println("CME bei normaler ArrayList");
}
`),
    keywords: ['listener liste', 'thread-sichere liste', 'snapshot', 'ConcurrentModificationException'],
    related: ['ConcurrentHashMap', 'BlockingQueue', 'ReadWriteLock'],
    mdn: A + 'util/concurrent/CopyOnWriteArrayList.html'
  },
  {
    lang: 'java', group: 'Executor & Futures', name: 'BlockingQueue',
    desc: "Warteschlange, bei der put() auf Platz und take() auf Elemente wartet.",
    details: "Die Standardlösung für Produzent-Konsument-Muster. `put()` blockiert bei voller, `take()` bei leerer Schlange; `offer()` und `poll()` gibt es auch mit Zeitgrenze. `ArrayBlockingQueue` hat eine feste Kapazität (gibt Gegendruck), `LinkedBlockingQueue` ist optional begrenzt. Zum Beenden schickt man ein Endesignal (\"Poison Pill\"), da die Queue selbst kein Ende kennt.",
    syntax: "BlockingQueue<T> q = new ArrayBlockingQueue<>(kapazität);\nq.put(x); T y = q.take();",
    example: e(`
BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(2);

Thread produzent = new Thread(() -> {
    try {
        for (int i = 1; i <= 5; i++) queue.put(i);   // wartet, wenn voll
        queue.put(-1);                               // Endesignal
    } catch (InterruptedException ex) {
        Thread.currentThread().interrupt();
    }
});
produzent.start();

int summe = 0;
while (true) {
    int n = queue.take();                            // wartet, wenn leer
    if (n == -1) break;
    summe += n;
}
System.out.println(summe);   // 15
`),
    tip: "Eine begrenzte Queue bremst schnelle Produzenten automatisch aus; eine unbegrenzte kann den Speicher füllen.",
    keywords: ['produzent konsument', 'producer consumer', 'warteschlange', 'queue', 'put take', 'poison pill'],
    related: ['wait() und notify()', 'ExecutorService', 'CopyOnWriteArrayList'],
    mdn: A + 'util/concurrent/BlockingQueue.html'
  },

  // ---------------- Module & Build ----------------
  {
    lang: 'java', group: 'Module & Build', name: 'Classpath',
    desc: "Suchpfad für Klassen und JARs beim Kompilieren und Starten.",
    details: "Mit `-cp` bzw. `--class-path` sagt man `javac` und `java`, wo Klassen und Bibliotheken liegen. Mehrere Einträge trennt man unter Linux und macOS mit `:`, unter Windows mit `;`. Ein `*` am Ende eines Ordners nimmt alle JARs darin auf. Fehlt etwas, kommt zur Laufzeit `ClassNotFoundException` oder `NoClassDefFoundError`. Build-Werkzeuge wie Maven und Gradle nehmen einem das ab.",
    syntax: "javac -cp \"lib/*\" -d out src/Main.java\njava -cp \"out:lib/*\" Main",
    example: e(`
# Kompilieren mit Abhängigkeit
javac -cp lib/gson.jar -d out src/Main.java

# Starten (Linux/macOS: Trennzeichen :)
java -cp "out:lib/*" Main

# Starten (Windows: Trennzeichen ;)
java -cp "out;lib/*" Main

# Ausführbares JAR mit Hauptklasse
java -jar app.jar

# Modulpfad statt Classpath
java --module-path mods --module app/de.meinfirma.app.Main
`),
    exampleLang: 'js',
    tip: "Windows trennt Pfade mit `;`, Linux und macOS mit `:`. Falsches Trennzeichen ist ein häufiger Grund für \"Class not found\".",
    keywords: ['cp', 'class path', 'jar', 'ClassNotFoundException', 'NoClassDefFoundError', 'javac', 'java -jar'],
    related: ['module-info.java', 'Maven (pom.xml)', 'Abhängigkeiten'],
  },
  {
    lang: 'java', group: 'Module & Build', name: 'module-info.java',
    desc: "Moduldeklaration: was ein Modul braucht, exportiert und freigibt (seit Java 9).",
    details: "Eine Datei `module-info.java` im Quellstamm macht ein Verzeichnis zum Modul. `requires` nennt Abhängigkeiten, `exports` macht Pakete für andere sichtbar, alles andere ist gekapselt. `opens` erlaubt Reflection auf ein Paket (z. B. für Frameworks), `uses` und `provides` beschreiben Service-Schnittstellen. Kleine Anwendungen kommen oft ohne Module aus; relevant werden sie bei Bibliotheken und mit `jlink`.",
    syntax: "module name {\n    requires ...;\n    exports ...;\n}",
    values: [
      ['requires x', 'Benötigt Modul x'],
      ['requires transitive x', 'Gibt die Abhängigkeit an Nutzer weiter'],
      ['exports p', 'Paket p ist von außen nutzbar'],
      ['opens p', 'Reflection-Zugriff auf p erlauben'],
      ['uses, provides ... with', 'Service-Loader (SPI)']
    ],
    example: e(`
module de.meinfirma.app {
    requires java.net.http;
    requires transitive java.sql;
    exports de.meinfirma.app.api;
    opens de.meinfirma.app.model to com.fasterxml.jackson.databind;
    uses de.meinfirma.spi.Plugin;
    provides de.meinfirma.spi.Plugin with de.meinfirma.app.PdfPlugin;
}
`),
    nocheck: true,
    tip: "Moduldatei fehlt, laufen alle Klassen im Classpath-Modus ohne Kapselung. Das ist für kleine Projekte völlig in Ordnung.",
    keywords: ['module', 'jpms', 'requires', 'exports', 'opens', 'java 9', 'kapselung', 'modulpfad'],
    related: ['Classpath', 'jpackage und jlink', 'Maven (pom.xml)'],
  },
  {
    lang: 'java', group: 'Module & Build', name: 'Maven (pom.xml)',
    desc: "Build-Werkzeug mit Konvention vor Konfiguration; die pom.xml beschreibt Projekt und Abhängigkeiten.",
    details: "Maven erwartet die Struktur `src/main/java` und `src/test/java` und baut daraus ein JAR im Ordner `target`. Die `pom.xml` enthält Koordinaten (`groupId`, `artifactId`, `version`), Eigenschaften, Abhängigkeiten und Plugins. Bibliotheken werden aus Maven Central geladen und lokal in `~/.m2` zwischengespeichert. Die Java-Version steuert `maven.compiler.release`.",
    syntax: "<project>\n  <groupId>..</groupId> <artifactId>..</artifactId> <version>..</version>\n</project>",
    example: e(`
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>

  <groupId>de.meinfirma</groupId>
  <artifactId>demo</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.release>25</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.11.4</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
`),
    exampleLang: 'html',
    tip: "Die Versionsnummern im Beispiel sind Beispielwerte; aktuelle Versionen auf central.sonatype.com nachschlagen.",
    keywords: ['maven', 'pom', 'build', 'artifactId', 'groupId', 'dependencies', 'mvn'],
    related: ['Maven-Befehle', 'Abhängigkeiten', 'Gradle', 'JUnit 5'],
  },
  {
    lang: 'java', group: 'Module & Build', name: 'Maven-Befehle',
    desc: "Die wichtigsten mvn-Aufrufe: bauen, testen, paketieren, installieren.",
    details: "Maven arbeitet mit einem Lebenszyklus: Wer `package` aufruft, führt vorher `compile` und `test` aus. `clean` löscht den Ordner `target` und gehört nicht zum Standardzyklus, wird deshalb meist vorangestellt. `install` kopiert das Ergebnis in das lokale Repository, `verify` führt auch Integrationstests aus. Mit `-DskipTests` überspringt man Tests, mit `-q` unterdrückt man Ausgabe.",
    syntax: "mvn [Optionen] <phase oder goal>",
    values: [
      ['mvn clean', 'Löscht target/'],
      ['mvn compile', 'Kompiliert den Hauptcode'],
      ['mvn test', 'Führt die Tests aus'],
      ['mvn package', 'Baut das JAR in target/'],
      ['mvn verify', 'Wie package plus Integrationstests und Prüfungen'],
      ['mvn install', 'Legt das Artefakt im lokalen Repository ab'],
      ['mvn dependency:tree', 'Zeigt den Abhängigkeitsbaum'],
      ['-DskipTests', 'Tests überspringen'],
      ['-Dtest=MeinTest', 'Nur einen Testlauf']
    ],
    example: e(`
# Neu bauen und testen
mvn clean test

# JAR bauen, Tests überspringen
mvn clean package -DskipTests

# Einzelnen Test ausführen
mvn -Dtest=RechnerTest test

# Abhängigkeitsbaum ansehen (Konflikte finden)
mvn dependency:tree

# Neues Projekt aus Vorlage
mvn archetype:generate -DgroupId=de.meinfirma -DartifactId=demo -DarchetypeArtifactId=maven-archetype-quickstart
`),
    exampleLang: 'js',
    tip: "Bei seltsamen Fehlern hilft oft `mvn clean`, weil alte Kompilate in `target/` stören können.",
    keywords: ['mvn', 'clean', 'package', 'install', 'skipTests', 'lifecycle', 'build ausführen'],
    related: ['Maven (pom.xml)', 'JUnit 5', 'Abhängigkeiten'],
  },
  {
    lang: 'java', group: 'Module & Build', name: 'Gradle',
    desc: "Flexibles Build-Werkzeug mit Skript in Kotlin- oder Groovy-DSL.",
    details: "Die Konfiguration steht in `build.gradle.kts` (Kotlin-DSL) oder `build.gradle` (Groovy). Das Plugin `java` liefert die Standardaufgaben `build`, `test` und `jar`, `application` ergänzt `run`. Der Gradle Wrapper (`gradlew`) lädt die passende Gradle-Version, sodass niemand Gradle installieren muss. Gradle baut inkrementell und nutzt Caches, was bei größeren Projekten schneller als Maven sein kann.",
    syntax: "./gradlew build\n./gradlew test\n./gradlew run",
    example: e(`
// build.gradle.kts
plugins {
    java
    application
}

repositories {
    mavenCentral()
}

java {
    toolchain { languageVersion = JavaLanguageVersion.of(25) }
}

dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.11.4")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

application {
    mainClass = "de.meinfirma.Main"
}

tasks.test {
    useJUnitPlatform()
}

// Aufruf im Terminal:
// ./gradlew build        Kompilieren, testen, JAR bauen
// ./gradlew test         Nur Tests
// ./gradlew run          Anwendung starten
// ./gradlew dependencies Abhängigkeitsbaum
`),
    exampleLang: 'js',
    tip: "Immer `./gradlew` (Wrapper) statt eines global installierten `gradle` verwenden: Jeder baut mit derselben Version.",
    keywords: ['gradle', 'build.gradle.kts', 'kotlin dsl', 'gradlew', 'wrapper', 'build tool'],
    related: ['Maven (pom.xml)', 'Abhängigkeiten', 'JUnit 5'],
  },
  {
    lang: 'java', group: 'Module & Build', name: 'Abhängigkeiten',
    desc: "Bibliotheken über Koordinaten einbinden; Scope bestimmt, wann sie gebraucht werden.",
    details: "Eine Bibliothek wird über `groupId:artifactId:version` identifiziert und aus Maven Central geladen, samt ihrer transitiven Abhängigkeiten. Der Scope legt fest, wo sie auf dem Classpath liegt: `compile` (Standard), `provided` (zur Laufzeit vom Container), `runtime`, `test`. Gradle nennt das `implementation`, `api`, `compileOnly`, `runtimeOnly` und `testImplementation`. Bei Versionskonflikten helfen `mvn dependency:tree` bzw. `./gradlew dependencies`.",
    syntax: "<dependency>\n  <groupId>..</groupId>\n  <artifactId>..</artifactId>\n  <version>..</version>\n  <scope>test</scope>\n</dependency>",
    values: [
      ['compile (Gradle: implementation)', 'Beim Kompilieren und Ausführen nötig'],
      ['provided (Gradle: compileOnly)', 'Nur zum Kompilieren, Laufzeit stellt es bereit'],
      ['runtime (Gradle: runtimeOnly)', 'Nur zur Laufzeit nötig, z. B. ein JDBC-Treiber'],
      ['test (Gradle: testImplementation)', 'Nur für Tests']
    ],
    example: e(`
<dependencies>
  <dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.11.0</version>
  </dependency>

  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.14</version>
    <scope>runtime</scope>
  </dependency>

  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.11.4</version>
    <scope>test</scope>
  </dependency>
</dependencies>
`),
    exampleLang: 'html',
    tip: "Weniger ist mehr: Jede Abhängigkeit bringt eigene Abhängigkeiten und Sicherheitsupdates mit.",
    keywords: ['dependency', 'bibliothek', 'library', 'maven central', 'scope', 'transitiv', 'implementation'],
    related: ['Maven (pom.xml)', 'Gradle', 'Classpath'],
  },
  {
    lang: 'java', group: 'Module & Build', name: 'JUnit 5',
    desc: "Test-Framework: @Test-Methoden und Assertions prüfen Verhalten automatisch.",
    details: "Testklassen liegen unter `src/test/java`; jede Methode mit `@Test` ist ein Test. Die Assertions aus `Assertions` vergleichen Ergebnisse; die Reihenfolge ist `assertEquals(erwartet, tatsächlich)`. `@BeforeEach` bereitet jeden Test vor, `@ParameterizedTest` führt einen Test mit mehreren Eingaben aus (braucht `junit-jupiter-params`, im Sammelartefakt `junit-jupiter` enthalten). Maven (Surefire) und Gradle (`useJUnitPlatform()`) führen die Tests aus.",
    syntax: "@Test void name() { assertEquals(erwartet, tatsaechlich); }",
    values: [
      ['assertEquals(erwartet, ist)', 'Gleichheit prüfen'],
      ['assertTrue(b), assertFalse(b)', 'Bedingung prüfen'],
      ['assertThrows(X.class, () -> ...)', 'Erwartet eine Exception'],
      ['assertAll(...)', 'Mehrere Prüfungen, alle werden gemeldet'],
      ['@BeforeEach, @AfterEach', 'Vor/nach jedem Test'],
      ['@Disabled', 'Test deaktivieren']
    ],
    example: e(`
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

class RechnerTest {
    Rechner rechner;

    @BeforeEach
    void setUp() {
        rechner = new Rechner();
    }

    @Test
    @DisplayName("Addition zweier Zahlen")
    void addiert() {
        assertEquals(5, rechner.add(2, 3));
    }

    @Test
    void teiltNichtDurchNull() {
        ArithmeticException ex = assertThrows(ArithmeticException.class, () -> rechner.div(1, 0));
        assertEquals("/ by zero", ex.getMessage());
    }

    @ParameterizedTest
    @CsvSource({"1,2,3", "5,5,10"})
    void summen(int a, int b, int erwartet) {
        assertEquals(erwartet, rechner.add(a, b));
    }
}
`),
    nocheck: true,
    tip: "`assertEquals(erwartet, ist)`: Die Reihenfolge der Argumente entscheidet über die Lesbarkeit der Fehlermeldung.",
    keywords: ['junit', 'test', 'unit test', 'assertEquals', 'assertThrows', 'jupiter', '@Test', 'testen'],
    related: ['Maven-Befehle', 'Gradle', 'Maven (pom.xml)'],
  },
  {
    lang: 'java', group: 'Module & Build', name: 'Logging',
    desc: "Meldungen mit Stufen ausgeben: System.Logger (seit Java 9) und java.util.logging.",
    details: "`System.getLogger(name)` liefert eine schmale Schnittstelle, die sich an das eingesetzte Logging-Framework anbinden lässt. `java.util.logging` (JUL) ist das eingebaute Framework mit Stufen von `FINEST` bis `SEVERE`; Standard ist `INFO` auf der Konsole (stderr). Für größere Projekte sind SLF4J mit Logback oder Log4j 2 üblich. Platzhalter wie `{0}` sparen das teure Zusammenbauen von Strings.",
    syntax: "System.Logger log = System.getLogger(\"name\");\nlog.log(System.Logger.Level.INFO, \"Text {0}\", wert);",
    example: e(`
import java.util.logging.Level;

System.Logger log = System.getLogger("de.demo.App");
log.log(System.Logger.Level.INFO, "Start mit {0} Argumenten", 3);
log.log(System.Logger.Level.ERROR, "Fehler", new IllegalStateException("kaputt"));

java.util.logging.Logger jul = java.util.logging.Logger.getLogger("de.demo.App");
jul.info("Hallo");
jul.log(Level.WARNING, "Warnung {0}", 42);
jul.setLevel(Level.FINE);
`),
    tip: "Keine Strings per `+` für Debug-Ausgaben bauen: Mit Platzhaltern oder Supplier entsteht der Text nur, wenn die Stufe aktiv ist.",
    keywords: ['log', 'logger', 'protokoll', 'jul', 'slf4j', 'logback', 'log4j', 'level', 'ausgabe'],
    related: ['Properties', 'Maven (pom.xml)'],
    mdn: A + 'lang/System.Logger.html'
  },
  {
    lang: 'java', group: 'Module & Build', name: 'Garbage Collector und JVM-Optionen',
    desc: "Speicher- und GC-Einstellungen beim Start der JVM (-Xmx, -XX).",
    details: "Die JVM räumt nicht mehr erreichbare Objekte selbst auf (Garbage Collection). Seit Java 9 ist G1 auf Maschinen mit mindestens 2 CPUs und rund 2 GB Speicher der Standard, sonst wählt die JVM Serial; G1 ist für die meisten Programme richtig; `-XX:+UseZGC` zielt auf sehr kurze Pausen bei großen Heaps, `-XX:+UseParallelGC` auf Durchsatz, `-XX:+UseSerialGC` auf kleine Programme. Heapgrenzen setzt man mit `-Xms` und `-Xmx`. In Containern ist `-XX:MaxRAMPercentage` oft praktischer. GC-Ausgaben liefert `-Xlog:gc`.",
    syntax: "java [Optionen] -jar app.jar",
    values: [
      ['-Xms256m', 'Anfängliche Heap-Größe'],
      ['-Xmx2g', 'Maximale Heap-Größe'],
      ['-XX:+UseG1GC', 'G1 (Standard ab 2 CPUs und rund 2 GB)'],
      ['-XX:+UseZGC', 'Z Garbage Collector, kurze Pausen'],
      ['-XX:MaxRAMPercentage=75', 'Heap relativ zum verfügbaren RAM'],
      ['-Xlog:gc', 'GC-Protokoll ausgeben'],
      ['-XX:+HeapDumpOnOutOfMemoryError', 'Heap-Dump bei Speicherfehler']
    ],
    example: e(`
# Heap festlegen
java -Xms256m -Xmx2g -jar app.jar

# Anderen Garbage Collector wählen
java -XX:+UseZGC -jar app.jar

# GC-Verhalten beobachten
java -Xlog:gc -jar app.jar

# Bei OutOfMemoryError einen Dump zur Analyse schreiben
java -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=dump.hprof -jar app.jar

# In Containern: Anteil am verfügbaren Speicher
java -XX:MaxRAMPercentage=75 -jar app.jar

# Alle Flags und ihre Werte anzeigen
java -XX:+PrintFlagsFinal -version
`),
    exampleLang: 'js',
    tip: "Erst messen, dann tunen: Mit den Standardeinstellungen läuft die JVM meist gut. Zu kleiner Heap ist die häufigste Ursache für OutOfMemoryError.",
    keywords: ['gc', 'garbage collection', 'speicher', 'heap', 'xmx', 'xms', 'jvm flags', 'zgc', 'g1', 'outofmemoryerror'],
    related: ['Virtuelle Threads', 'Classpath', 'jpackage und jlink'],
  },
  {
    lang: 'java', group: 'Module & Build', name: 'jpackage und jlink',
    desc: "jlink baut eine schlanke Laufzeit, jpackage ein Installationspaket mit eigener JVM.",
    details: "`jlink` stellt aus den benötigten Modulen ein eigenes, kleines Java-Laufzeitabbild zusammen. `jpackage` erzeugt daraus eine native Anwendung oder einen Installer (`exe`, `msi`, `dmg`, `pkg`, `deb`, `rpm`); die Pakete lassen sich nur auf dem jeweiligen Betriebssystem bauen. Welche Module eine Anwendung braucht, ermittelt `jdeps --print-module-deps`. Für Windows-Installer ist zusätzlich WiX nötig.",
    syntax: "jlink --add-modules <module> --output <ordner>\njpackage --input <ordner> --main-jar <jar> --main-class <klasse> --name <name>",
    example: e(`
# Benötigte Module ermitteln
jdeps --print-module-deps target/app.jar

# Schlanke Laufzeit bauen
jlink --add-modules java.base,java.net.http --output runtime --strip-debug --no-header-files --no-man-pages

# Installationspaket erzeugen (Windows, benötigt WiX)
jpackage --input target --name MeineApp --main-jar app.jar --main-class de.meinfirma.Main --type exe

# Nur App-Ordner ohne Installer (kein WiX nötig, Ergebnis läuft nur auf dieser Plattform)
jpackage --input target --name MeineApp --main-jar app.jar --main-class de.meinfirma.Main --type app-image
`),
    exampleLang: 'js',
    keywords: ['installer', 'exe', 'msi', 'laufzeit', 'runtime image', 'jdeps', 'ausliefern', 'deployment', 'native app'],
    related: ['module-info.java', 'Classpath', 'Garbage Collector und JVM-Optionen'],
  }
  );
})();
