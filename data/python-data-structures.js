window.CHEAT = window.CHEAT || [];
(function () {
  var D = 'https://docs.python.org/3/library/';   // + z. B. 'stdtypes.html#str.split'
  var R = 'https://docs.python.org/3/reference/'; // Sprachreferenz
  var T = 'https://docs.python.org/3/tutorial/';  // Tutorial
  var G = 'https://docs.python.org/3/glossary.html'; // Glossar
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Strings ----------------
  {
    lang: 'py', group: 'Strings', name: 'f-String',
    desc: "Formatierter String-Literal: Ausdrücke in {} werden direkt in den Text eingesetzt.",
    details: "Ein `f` vor dem Literal macht aus `{ausdruck}` einen Platzhalter, der beim Ausführen ausgewertet wird. Nach einem Doppelpunkt folgt die Format-Spezifikation (`{x:.2f}`), mit `!r` wird `repr()` statt `str()` verwendet. `{x = }` gibt Ausdruck und Wert aus, praktisch zum Debuggen. Seit Python 3.12 dürfen innerhalb der Klammern dieselben Anführungszeichen wie außen stehen; geschweifte Klammern im Text verdoppelt man: `{{`.",
    syntax: "f\"Text {ausdruck} Text {ausdruck:format} {ausdruck!r} {ausdruck = }\"",
    values: [
      ['{x}', 'Wert von x per str() einsetzen'],
      ['{x:.2f}', 'Mit Format-Spezifikation'],
      ['{x!r}', 'repr() statt str() verwenden'],
      ['{x = }', 'Ausdruck und Wert ausgeben (Debugging)'],
      ['{{ }}', 'Literale geschweifte Klammern']
    ],
    example: e(`
name = "Ada"
alter = 36
print(f"{name} ist {alter} Jahre alt")   # Ada ist 36 Jahre alt
print(f"{alter * 2 = }")                 # alter * 2 = 72
print(f"{name!r}")                       # 'Ada'
print(f"[{name.upper():>6}]")            # [   ADA]

werte = {"a": 1}
print(f"{werte["a"]}")                   # 1 (gleiche Anführungszeichen seit 3.12)
print(f"{{geschweift}} {3.14159:.2f}")   # {geschweift} 3.14
`),
    tip: "f-Strings sind die schnellste und lesbarste Formatierung. Für Logging aber `logger.info(\"%s\", x)` nutzen, damit nur bei aktivem Level formatiert wird.",
    keywords: ['formatstring', 'interpolation', 'string formatting', 'platzhalter', 'formatted string literal', 'f"', 'debug ='],
    related: ['Format-Spezifikation', 'str.format()', 't-String'],
    mdn: R + 'lexical_analysis.html#f-strings'
  },
  {
    lang: 'py', group: 'Strings', name: 'Format-Spezifikation',
    desc: "Mini-Sprache nach dem Doppelpunkt: Breite, Ausrichtung, Nachkommastellen, Tausender.",
    details: "Die Spezifikation hat den Aufbau `[[füll]ausrichtung][vorzeichen][#][0][breite][,|_][.genauigkeit][typ]` und gilt in f-Strings, `str.format()` und `format()`. Ausrichtung: `<` links, `>` rechts, `^` zentriert. Die Typen `f`, `e`, `%`, `d`, `x`, `b` bestimmen die Darstellung. Das Tausendertrennzeichen ist immer `,` oder `_`, für deutsche Formatierung braucht man `locale` oder ein nachträgliches Ersetzen.",
    syntax: "{wert:[[füll]ausr][vorz][#][0][breite][,][.präz][typ]}",
    values: [
      ['.2f', 'Festkomma mit 2 Nachkommastellen'],
      ['>10', 'Rechtsbündig in 10 Zeichen'],
      ['*^11', 'Zentriert, mit * aufgefüllt'],
      ['05d', 'Ganzzahl, mit Nullen auf 5 Stellen'],
      [',', 'Tausendertrennzeichen (Komma)'],
      ['.1%', 'Prozent mit 1 Nachkommastelle'],
      ['x / X / b / o', 'Hexadezimal, binär, oktal'],
      ['#x', 'Mit Präfix 0x'],
      ['+', 'Vorzeichen immer anzeigen'],
      ['.3e', 'Exponentialschreibweise']
    ],
    example: e(`
preis = 1234.5
print(f"{preis:.2f}")         # 1234.50
print(f"{preis:,.2f}")        # 1,234.50
print(f"|{preis:>10.1f}|")    # |    1234.5|
print(f"{42:05d}")            # 00042
print(f"{255:x} {255:#b}")    # ff 0b11111111
print(f"{0.256:.1%}")         # 25.6%
print(f"{'mitte':*^11}")      # ***mitte***
print(f"{1234567:_}")         # 1_234_567
print(f"{-3:+} {3:+}")        # -3 +3

# Deutsches Format ohne locale
print(f"{preis:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))  # 1.234,50
`),
    tip: "Breite und Genauigkeit dürfen selbst Platzhalter sein: `f\"{wert:{breite}.{stellen}f}\"`.",
    keywords: ['format spec', 'mini-language', 'nachkommastellen', 'runden', 'ausrichten', 'padding', 'tausendertrennzeichen', 'prozent', 'hex'],
    related: ['f-String', 'str.format()', 'str.zfill()'],
    mdn: D + 'string.html#format-specification-mini-language'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.format()',
    desc: "Ersetzt Platzhalter {} in einem String durch die übergebenen Argumente.",
    details: "Platzhalter können leer (`{}`), nummeriert (`{0}`) oder benannt (`{name}`) sein und eine Format-Spezifikation tragen. Anders als f-Strings lässt sich die Vorlage vorab definieren, etwa aus einer Konfigurationsdatei. `format_map()` nimmt ein Dictionary. Fehlt ein benanntes Argument, gibt es einen `KeyError`.",
    syntax: "\"... {} ... {name:spec} ...\".format(*args, **kwargs)",
    example: e(`
print("{} + {} = {}".format(2, 3, 5))                    # 2 + 3 = 5
print("{1} vor {0}".format("A", "B"))                     # B vor A
print("{name}: {wert:.1f}".format(name="Temp", wert=21.456))  # Temp: 21.5

vorlage = "Hallo {kunde}, Bestellung {nr:05d} ist da."
print(vorlage.format(kunde="Ada", nr=42))  # Hallo Ada, Bestellung 00042 ist da.

daten = {"x": 1, "y": 2}
print("x={x}, y={y}".format_map(daten))    # x=1, y=2
`),
    tip: "Vorlagen aus Benutzereingaben nie mit `format()` füllen: `{0.__class__}` kann Interna auslesen. Dafür `string.Template` verwenden.",
    keywords: ['format', 'platzhalter', 'vorlage', 'template', 'format_map', 'string formatting'],
    related: ['f-String', 'Format-Spezifikation', 't-String'],
    mdn: D + 'stdtypes.html#str.format'
  },
  {
    lang: 'py', group: 'Strings', name: 'String-Slicing',
    desc: "Teilstrings per Index und Slice ausschneiden: s[start:stop:step].",
    details: "Strings sind Sequenzen: `s[0]` ist das erste Zeichen, `s[-1]` das letzte. Ein Slice `s[a:b]` enthält Index `a`, aber nicht mehr `b`. Fehlende Grenzen bedeuten Anfang bzw. Ende, `s[::-1]` kehrt um. Slices werfen keinen `IndexError` bei zu großen Grenzen, Einzelindizes schon. Strings sind unveränderlich, `s[0] = \"x\"` geht nicht.",
    syntax: "s[i]   s[start:stop]   s[start:stop:step]",
    example: e(`
s = "Python"
print(s[0], s[-1])      # P n
print(s[0:2])           # Py
print(s[2:])            # thon
print(s[:-2])           # Pyth
print(s[::2])           # Pto
print(s[::-1])          # nohtyP
print(s[10:20] == "")   # True (kein IndexError)

datum = "2026-11-16"
jahr, monat = datum[:4], datum[5:7]
print(jahr, monat)      # 2026 11
`),
    tip: "Für Präfixe und Suffixe sind `startswith()` und `removeprefix()` lesbarer als Slices mit abgezählten Längen.",
    keywords: ['substring', 'teilstring', 'ausschneiden', 'index', 'umkehren', 'reverse string', 'slice'],
    related: ['Slicing', 'Indexierung', 'str.removeprefix()'],
    mdn: T + 'introduction.html#text'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.split()',
    desc: "Zerlegt einen String an einem Trennzeichen in eine Liste von Teilstrings.",
    details: "Ohne Argument wird an beliebigem Leerraum getrennt, mehrfache Leerzeichen zählen als eins und Leerraum am Rand wird ignoriert. Mit Trennzeichen entstehen auch leere Teile (`\"a,,b\".split(\",\")`). `maxsplit` begrenzt die Anzahl der Trennungen, `rsplit()` beginnt von rechts. Für mehrere verschiedene Trennzeichen `re.split()` verwenden.",
    syntax: "s.split(sep=None, maxsplit=-1)\ns.rsplit(sep=None, maxsplit=-1)",
    example: e(`
print("a,b,,c".split(","))          # ['a', 'b', '', 'c']
print("  viel   Platz  ".split())    # ['viel', 'Platz']
print("k=v=w".split("=", 1))        # ['k', 'v=w']
print("a/b/c".rsplit("/", 1))       # ['a/b', 'c']

ordner, datei = "src/app/main.py".rsplit("/", 1)
print(datei)                         # main.py
print("".split(","))                 # ['']
`),
    tip: "CSV-Zeilen nicht mit `split(\",\")` zerlegen: Kommas in Anführungszeichen brechen das. Das Modul `csv` kann es richtig.",
    keywords: ['aufteilen', 'zerlegen', 'trennen', 'explode', 'tokenize', 'rsplit', 'maxsplit'],
    related: ['str.join()', 'str.partition()', 'str.splitlines()', 're.split()'],
    mdn: D + 'stdtypes.html#str.split'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.join()',
    desc: "Verbindet die Strings eines Iterables mit dem Trennstring dazwischen.",
    details: "Der Trennstring ruft die Methode auf: `\", \".join(liste)`. Alle Elemente müssen Strings sein, Zahlen vorher mit `str()` oder einem Generator-Ausdruck umwandeln, sonst gibt es einen `TypeError`. `join` ist deutlich schneller als wiederholtes `+=` in einer Schleife.",
    syntax: "trenner.join(iterable)",
    example: e(`
woerter = ["Hallo", "schöne", "Welt"]
print(" ".join(woerter))                  # Hallo schöne Welt
print(", ".join(["a", "b", "c"]))         # a, b, c

zahlen = [1, 2, 3]
print("-".join(str(z) for z in zahlen))   # 1-2-3
print("".join(reversed("abc")))           # cba
print("\\n".join(["Zeile 1", "Zeile 2"]))  # zwei Zeilen
`),
    tip: "Häufiger Fehler: `liste.join(\", \")` – `join` ist eine String-Methode, keine Listenmethode.",
    keywords: ['verbinden', 'zusammenfügen', 'implode', 'concat', 'verketten', 'trennzeichen'],
    related: ['str.split()', 'Generator-Ausdruck', 'String-Methoden-Überblick'],
    mdn: D + 'stdtypes.html#str.join'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.strip()',
    desc: "Entfernt Leerraum (oder angegebene Zeichen) am Anfang und Ende eines Strings.",
    details: "`strip()` entfernt an beiden Enden, `lstrip()` nur links, `rstrip()` nur rechts. Ohne Argument zählen Leerzeichen, Tabs und Zeilenumbrüche. Das Argument ist eine Zeichenmenge, kein Präfix: `strip(\"w.moc\")` entfernt jedes dieser Zeichen. Um genau einen Präfix oder Suffix zu entfernen, `removeprefix()` bzw. `removesuffix()` verwenden.",
    syntax: "s.strip([zeichen])  s.lstrip([zeichen])  s.rstrip([zeichen])",
    example: e(`
print(repr("  Text \\n".strip()))      # 'Text'
print("xxHalloxx".strip("x"))         # Hallo
print("  links".lstrip())             # links
print(repr("Zeile\\n".rstrip("\\n")))  # 'Zeile'

# Fallstrick: Zeichenmenge, kein Präfix
print("www.example.com".strip("w.moc"))  # example
`),
    tip: "Beim Einlesen von Dateien entfernt `line.rstrip(\"\\n\")` nur den Zeilenumbruch und lässt Leerzeichen am Zeilenende stehen.",
    keywords: ['trim', 'leerzeichen entfernen', 'whitespace', 'lstrip', 'rstrip', 'abschneiden'],
    related: ['str.removeprefix()', 'str.split()', 'String-Methoden-Überblick'],
    mdn: D + 'stdtypes.html#str.strip'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.removeprefix()',
    desc: "Entfernt einen bestimmten Präfix bzw. Suffix (removesuffix), falls vorhanden.",
    details: "`removeprefix(p)` liefert den String ohne den Präfix `p`, wenn er damit beginnt, sonst den unveränderten String. `removesuffix()` arbeitet am Ende. Anders als `lstrip()` wird genau die Zeichenfolge entfernt und nur einmal. Verfügbar seit Python 3.9.",
    syntax: "s.removeprefix(präfix)\ns.removesuffix(suffix)",
    example: e(`
print("test_login".removeprefix("test_"))   # login
print("bericht.txt".removesuffix(".txt"))   # bericht
print("bericht.txt".removeprefix("x"))      # bericht.txt

# Unterschied zu lstrip: Zeichenmenge statt Präfix
print("www.web.de".lstrip("w."))            # eb.de
print("www.web.de".removeprefix("www."))    # web.de
`),
    keywords: ['präfix entfernen', 'suffix entfernen', 'removesuffix', 'prefix', 'endung entfernen'],
    related: ['str.strip()', 'str.startswith()', 'String-Slicing'],
    mdn: D + 'stdtypes.html#str.removeprefix'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.replace()',
    desc: "Liefert eine Kopie, in der jedes Vorkommen eines Teilstrings ersetzt ist.",
    details: "Strings sind unveränderlich, `replace()` gibt immer einen neuen String zurück; das Ergebnis muss man zuweisen. Der optionale dritte Parameter begrenzt die Anzahl der Ersetzungen. Für Muster (Ziffern, Wortgrenzen) `re.sub()` verwenden, für viele Einzelzeichen `str.translate()`.",
    syntax: "s.replace(alt, neu, count=-1)",
    example: e(`
s = "Kaffee mit Milch und Milch"
print(s.replace("Milch", "Hafer"))      # Kaffee mit Hafer und Hafer
print(s.replace("Milch", "Hafer", 1))   # Kaffee mit Hafer und Milch
print(s)                                # Kaffee mit Milch und Milch (unverändert)

slug = "Mein erster Beitrag".lower().replace(" ", "-")
print(slug)                             # mein-erster-beitrag
`),
    tip: "Häufiger Fehler: `s.replace(\"a\", \"b\")` ohne Zuweisung – der Aufruf allein ändert `s` nicht.",
    keywords: ['ersetzen', 'austauschen', 'substitute', 'search replace', 'suchen ersetzen'],
    related: ['str.translate()', 're.sub()', 'str.find()'],
    mdn: D + 'stdtypes.html#str.replace'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.find()',
    desc: "Sucht einen Teilstring und liefert die Position oder -1, wenn er fehlt.",
    details: "`find()` gibt den Index des ersten Vorkommens zurück, `rfind()` den des letzten. `index()` und `rindex()` verhalten sich gleich, werfen aber einen `ValueError` statt -1 zu liefern. Wer nur wissen will, ob etwas enthalten ist, nimmt `in`. Vorsicht: -1 ist ein gültiger Index, `s[s.find(x)]` liefert bei fehlendem `x` still das letzte Zeichen.",
    syntax: "s.find(sub[, start[, end]])\ns.rfind(...)  s.index(...)  s.rindex(...)",
    example: e(`
s = "banane"
print(s.find("an"))     # 1
print(s.rfind("an"))    # 3
print(s.find("x"))      # -1
print(s.index("n"))     # 2
print("an" in s)        # True

try:
    s.index("x")
except ValueError as err:
    print(err)          # substring not found
`),
    keywords: ['suchen', 'position', 'indexOf', 'rfind', 'index', 'enthält', 'teilstring finden'],
    related: ['str.count()', 'in / not in', 'str.startswith()'],
    mdn: D + 'stdtypes.html#str.find'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.startswith()',
    desc: "Prüft, ob ein String mit einem Präfix beginnt (endswith: mit einem Suffix endet).",
    details: "Statt eines einzelnen Strings darf man ein Tupel übergeben, dann genügt ein Treffer. Optionale `start`- und `end`-Argumente beschränken die Prüfung auf einen Bereich. Die Prüfung beachtet Groß- und Kleinschreibung, daher vorher ggf. `lower()` anwenden. Eine Liste statt eines Tupels führt zu einem `TypeError`.",
    syntax: "s.startswith(präfix[, start[, end]])\ns.endswith(suffix[, start[, end]])",
    example: e(`
datei = "bericht_2026.pdf"
print(datei.startswith("bericht"))           # True
print(datei.endswith((".pdf", ".docx")))     # True
print(datei.startswith("2026", 8))           # True
print("Bild.PNG".lower().endswith(".png"))   # True

zeilen = ["# Kommentar", "x = 1", "# noch einer"]
print([z for z in zeilen if not z.startswith("#")])  # ['x = 1']
`),
    keywords: ['beginnt mit', 'endet mit', 'endswith', 'präfix', 'suffix', 'dateiendung prüfen'],
    related: ['str.removeprefix()', 'str.find()', 'String-Slicing'],
    mdn: D + 'stdtypes.html#str.startswith'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.upper()',
    desc: "Groß- und Kleinschreibung umwandeln: upper, lower, title, capitalize, casefold.",
    details: "`upper()` und `lower()` wandeln alle Buchstaben um, `title()` macht jeden Wortanfang groß, `capitalize()` nur den ersten Buchstaben des Strings. Für Vergleiche ohne Beachtung der Schreibweise ist `casefold()` besser als `lower()`, da es auch Sonderfälle wie `ß` behandelt. `title()` arbeitet naiv: Aus `\"o'neil\"` wird `\"O'Neil\"`, aus `\"3d\"` wird `\"3D\"`.",
    syntax: "s.upper()  s.lower()  s.title()  s.capitalize()  s.swapcase()  s.casefold()",
    example: e(`
s = "hallo Welt"
print(s.upper())         # HALLO WELT
print(s.lower())         # hallo welt
print(s.title())         # Hallo Welt
print(s.capitalize())    # Hallo welt
print(s.swapcase())      # HALLO wELT

print("Straße".upper())                               # STRASSE
print("STRASSE".casefold() == "straße".casefold())    # True
`),
    tip: "Für Vergleiche ohne Schreibweise `a.casefold() == b.casefold()` verwenden, nicht `lower()`.",
    keywords: ['großbuchstaben', 'kleinbuchstaben', 'lower', 'uppercase', 'lowercase', 'title case', 'casefold', 'capitalize'],
    related: ['String-Methoden-Überblick', 'str.isdigit()'],
    mdn: D + 'stdtypes.html#str.upper'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.isdigit()',
    desc: "Prüft, ob ein String nur aus Ziffern besteht (und weitere is…-Prüfmethoden).",
    details: "Die `is…`-Methoden liefern `True`, wenn der String nicht leer ist und alle Zeichen die Bedingung erfüllen. `isdigit()` akzeptiert auch Hochzahlen wie `²`, `isdecimal()` nur echte Dezimalziffern und ist für `int()`-Prüfungen die bessere Wahl. Negative Zahlen und Kommazahlen fallen durch, weil `-` und `.` keine Ziffern sind: Dafür besser `int()`/`float()` in `try` versuchen.",
    values: [
      ['isdigit()', 'Ziffern inkl. Hochzahlen'],
      ['isdecimal()', 'Nur Dezimalziffern 0–9 (auch andere Schriften)'],
      ['isnumeric()', 'Auch Brüche und Zahlzeichen wie ½'],
      ['isalpha()', 'Nur Buchstaben'],
      ['isalnum()', 'Buchstaben oder Ziffern'],
      ['isspace()', 'Nur Leerraum'],
      ['isupper() / islower()', 'Alle Buchstaben groß bzw. klein'],
      ['isidentifier()', 'Gültiger Python-Bezeichner']
    ],
    example: e(`
print("123".isdigit())      # True
print("-5".isdigit())       # False
print("3.14".isdigit())     # False
print("²".isdigit())        # True
print("²".isdecimal())      # False
print("abc".isalpha())      # True
print("abc123".isalnum())   # True
print("   ".isspace())      # True
print("".isdigit())         # False
`),
    tip: "Zum Prüfen einer Benutzereingabe lieber `try: int(text) except ValueError:` statt `isdigit()` – das deckt Vorzeichen und Leerraum ab.",
    keywords: ['ziffern prüfen', 'ist zahl', 'isnumeric', 'isdecimal', 'isalpha', 'isalnum', 'validierung', 'is numeric'],
    related: ['Typumwandlung', 'str.upper()', 'String-Methoden-Überblick'],
    mdn: D + 'stdtypes.html#str.isdigit'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.count()',
    desc: "Zählt die nicht überlappenden Vorkommen eines Teilstrings.",
    details: "Gezählt wird von links, gefundene Stellen werden übersprungen, daher ergibt `\"aaaa\".count(\"aa\")` 2 und nicht 3. Optionale `start`- und `end`-Argumente beschränken den Bereich. Die Suche unterscheidet Groß- und Kleinschreibung. Um alle Zeichen oder Wörter auf einmal zu zählen, ist `collections.Counter` besser.",
    syntax: "s.count(sub[, start[, end]])",
    example: e(`
text = "Die Katze jagt die Maus"
print(text.count("ie"))             # 2
print(text.count("Die"))            # 1
print(text.lower().count("die"))    # 2
print("aaaa".count("aa"))           # 2 (nicht überlappend)
print(text.count("a", 10))          # 2 (ab Index 10)
print(text.count(""))               # 24 (Länge + 1)
`),
    keywords: ['zählen', 'anzahl', 'vorkommen', 'häufigkeit', 'occurrences'],
    related: ['collections.Counter', 'str.find()', 'list.index()'],
    mdn: D + 'stdtypes.html#str.count'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.partition()',
    desc: "Teilt einen String am ersten Trennzeichen in ein 3-Tupel (vorher, trenner, nachher).",
    details: "Anders als `split()` liefert `partition()` immer genau drei Teile, was sauberes Entpacken erlaubt. Fehlt das Trennzeichen, ist das Ergebnis `(s, \"\", \"\")`, man erkennt es am leeren mittleren Teil. `rpartition()` trennt am letzten Vorkommen, dann steht bei fehlendem Trenner der ganze String hinten.",
    syntax: "vorher, trenner, nachher = s.partition(sep)\ns.rpartition(sep)",
    example: e(`
schluessel, sep, wert = "host=localhost:8080".partition("=")
print(schluessel, wert)              # host localhost:8080
print("ohne".partition("="))         # ('ohne', '', '')
print("a.b.c".rpartition("."))       # ('a.b', '.', 'c')

name, _, endung = "archiv.tar.gz".partition(".")
print(endung)                        # tar.gz
`),
    keywords: ['aufteilen', 'trennen', 'rpartition', 'key value', 'schlüssel wert', 'split once'],
    related: ['str.split()', 'Entpacken', 'tuple'],
    mdn: D + 'stdtypes.html#str.partition'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.zfill()',
    desc: "Füllt einen String links mit Nullen auf die gewünschte Länge auf.",
    details: "`zfill()` berücksichtigt ein Vorzeichen: Aus `\"-42\"` wird `\"-0042\"`. Ist der String schon lang genug, bleibt er unverändert. Bei Zahlen ist die Format-Spezifikation `f\"{n:05d}\"` meist direkter, weil keine Umwandlung in einen String nötig ist.",
    syntax: "s.zfill(breite)",
    example: e(`
print("42".zfill(5))        # 00042
print("-42".zfill(5))       # -0042
print("123456".zfill(3))    # 123456

nr = 7
print(str(nr).zfill(3))     # 007
print(f"{nr:03d}")          # 007 (gleichwertig)
dateien = [f"bild_{i:03d}.png" for i in (1, 12)]
print(dateien)              # ['bild_001.png', 'bild_012.png']
`),
    keywords: ['führende nullen', 'auffüllen', 'padding', 'leading zeros', 'nullen'],
    related: ['str.center()', 'Format-Spezifikation', 'f-String'],
    mdn: D + 'stdtypes.html#str.zfill'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.center()',
    desc: "Richtet Text in einer festen Breite aus: center, ljust und rjust.",
    details: "`center()`, `ljust()` und `rjust()` füllen einen String bis zur angegebenen Breite auf, standardmäßig mit Leerzeichen, optional mit einem einzelnen anderen Zeichen. Längere Strings werden nicht gekürzt. Für Tabellen mit Zahlen ist die Format-Spezifikation (`{x:>8.2f}`) oft praktischer.",
    syntax: "s.center(breite[, füll])  s.ljust(breite[, füll])  s.rjust(breite[, füll])",
    example: e(`
print("Titel".center(11, "*"))      # ***Titel***
print("[" + "x".rjust(4) + "]")     # [   x]
print("[" + "x".ljust(4) + "]")     # [x   ]

for name, preis in [("Brot", 2.5), ("Käse", 12.99)]:
    print(name.ljust(8, ".") + f"{preis:6.2f}")
# Brot....  2.50
# Käse.... 12.99
`),
    keywords: ['zentrieren', 'ausrichten', 'linksbündig', 'rechtsbündig', 'ljust', 'rjust', 'padding', 'tabelle'],
    related: ['Format-Spezifikation', 'str.zfill()', 'String-Methoden-Überblick'],
    mdn: D + 'stdtypes.html#str.center'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.translate()',
    desc: "Ersetzt oder löscht viele einzelne Zeichen auf einmal über eine Übersetzungstabelle.",
    details: "Die Tabelle erzeugt `str.maketrans()`: aus zwei gleich langen Strings (Zeichen für Zeichen), aus einem Dictionary (Zeichen auf beliebige Strings) oder mit drittem Argument für zu löschende Zeichen. `translate()` ist schneller als eine Kette von `replace()`-Aufrufen. Ersetzt werden nur einzelne Zeichen, keine Teilstrings als Quelle.",
    syntax: "tabelle = str.maketrans(von, nach[, löschen])\ns.translate(tabelle)",
    example: e(`
tabelle = str.maketrans("äöü", "aou")
print("Grüße aus Köln".translate(tabelle))      # Gruße aus Koln

umlaute = str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"})
print("Grüße aus Köln".translate(umlaute))      # Gruesse aus Koeln

ohne_vokale = str.maketrans("", "", "aeiou")
print("Programmieren".translate(ohne_vokale))   # Prgrmmrn
`),
    keywords: ['maketrans', 'zeichen ersetzen', 'umlaute ersetzen', 'zeichen löschen', 'transliteration'],
    related: ['str.replace()', 'String-Methoden-Überblick'],
    mdn: D + 'stdtypes.html#str.translate'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.splitlines()',
    desc: "Zerlegt einen Text an Zeilenumbrüchen in eine Liste von Zeilen.",
    details: "`splitlines()` erkennt `\\n`, `\\r\\n`, `\\r` und weitere Unicode-Zeilenumbrüche und lässt am Ende keinen leeren String übrig. `split(\"\\n\")` dagegen behält `\\r` bei Windows-Zeilenenden und erzeugt nach einem abschließenden Umbruch ein leeres Element. Mit `keepends=True` bleiben die Umbrüche erhalten.",
    syntax: "s.splitlines(keepends=False)",
    example: e(`
text = "erste\\nzweite\\r\\ndritte\\n"
print(text.splitlines())             # ['erste', 'zweite', 'dritte']
print(text.split("\\n"))              # ['erste', 'zweite\\r', 'dritte', '']
print(text.splitlines(keepends=True)[1:2])  # ['zweite\\r\\n']

for nr, zeile in enumerate("a\\nb".splitlines(), start=1):
    print(nr, zeile)                 # 1 a, dann 2 b
`),
    keywords: ['zeilen', 'lines', 'zeilenumbruch', 'newline', 'zeilenweise', 'crlf'],
    related: ['str.split()', 'Mehrzeilige Strings', 'Escape-Sequenzen'],
    mdn: D + 'stdtypes.html#str.splitlines'
  },
  {
    lang: 'py', group: 'Strings', name: 'str.encode()',
    desc: "Wandelt einen Text (str) in Bytes um, standardmäßig als UTF-8.",
    details: "`str` enthält Unicode-Zeichen, `bytes` rohe Bytes. `encode()` wandelt Text in Bytes, `bytes.decode()` zurück. Die Länge kann sich unterscheiden, weil Umlaute in UTF-8 zwei Bytes brauchen. Mit `errors=\"replace\"` oder `\"ignore\"` werden nicht darstellbare Zeichen ersetzt bzw. weggelassen statt einen `UnicodeEncodeError` auszulösen.",
    syntax: "s.encode(encoding=\"utf-8\", errors=\"strict\")\nb.decode(encoding=\"utf-8\", errors=\"strict\")",
    values: [
      ['strict', 'Fehler auslösen (Standard)'],
      ['replace', 'Ersatzzeichen ? bzw. U+FFFD einsetzen'],
      ['ignore', 'Nicht darstellbare Zeichen weglassen'],
      ['backslashreplace', 'Als Escape-Sequenz schreiben']
    ],
    example: e(`
s = "Grüße"
b = s.encode()                        # UTF-8 ist Standard
print(b)                              # b'Gr\\xc3\\xbc\\xc3\\x9fe'
print(len(s), len(b))                 # 5 7
print(b.decode("utf-8"))              # Grüße
print(s.encode("ascii", errors="replace"))  # b'Gr??e'

try:
    b.decode("ascii")
except UnicodeDecodeError as err:
    print(type(err).__name__)         # UnicodeDecodeError
`),
    tip: "Beim Lesen und Schreiben von Dateien immer `encoding=\"utf-8\"` angeben, sonst hängt das Ergebnis vom Betriebssystem ab.",
    keywords: ['kodierung', 'encoding', 'decode', 'utf-8', 'bytes', 'unicode', 'umlaute', 'zeichensatz'],
    related: ['bytes', 'Encoding', 'bytearray'],
    mdn: D + 'stdtypes.html#str.encode'
  },
  {
    lang: 'py', group: 'Strings', name: 'Raw-Strings',
    desc: "Mit r-Präfix werden Backslashes nicht als Escape-Sequenzen interpretiert.",
    details: "In `r\"...\"` steht `\\n` für die zwei Zeichen Backslash und n. Raw-Strings sind Standard für reguläre Ausdrücke und praktisch für Windows-Pfade. Ein Raw-String darf nicht auf eine ungerade Anzahl Backslashes enden, `r\"C:\\ordner\\\"` ist ein Syntaxfehler. Kombinierbar mit f: `rf\"...\"`.",
    syntax: "r\"Text mit \\Backslash\"   rf\"{wert}\\d+\"",
    example: e(`
import re

pfad = r"C:\\neu\\tabelle.csv"
print(pfad)                       # C:\\neu\\tabelle.csv
print(len(r"\\n"), len("\\n"))      # 2 1
print(re.findall(r"\\d+", "Raum 12, Etage 3"))  # ['12', '3']

# Endet auf Backslash: normal anhängen
print(r"C:\\ordner" + "\\\\")        # C:\\ordner\\
`),
    tip: "Für Pfade ist `pathlib.Path(\"C:/ordner/datei.txt\")` mit Schrägstrichen meist die bessere Lösung als Raw-Strings.",
    keywords: ['raw string', 'r-präfix', 'backslash', 'regex', 'windows pfad', 'rohstring'],
    related: ['Escape-Sequenzen', 're', 'Strings (Literale)'],
    mdn: R + 'lexical_analysis.html#string-and-bytes-literals'
  },
  {
    lang: 'py', group: 'Strings', name: 'Mehrzeilige Strings',
    desc: "Dreifache Anführungszeichen erlauben Strings über mehrere Zeilen.",
    details: "In `\"\"\"...\"\"\"` oder `'''...'''` bleiben Zeilenumbrüche und Einrückung erhalten. Die Einrückung des Quelltexts landet daher im String, `textwrap.dedent()` entfernt sie. Ein Backslash direkt nach den öffnenden Anführungszeichen unterdrückt den ersten Zeilenumbruch. Alternativ verbindet Python benachbarte Literale in Klammern automatisch zu einem String.",
    syntax: "\"\"\"Zeile 1\nZeile 2\"\"\"\n(\"Teil 1 \"\n \"Teil 2\")",
    example: e(`
import textwrap

text = """Erste Zeile
Zweite Zeile"""
print(text.count("\\n"))          # 1

def hilfe():
    return textwrap.dedent("""\\
        Aufruf: tool [optionen]
          -h  Hilfe anzeigen""")

print(hilfe())                    # ohne führende Einrückung

lang = ("Implizite Verkettung "
        "über mehrere Zeilen")
print(lang)                       # Implizite Verkettung über mehrere Zeilen
`),
    keywords: ['triple quotes', 'dreifache anführungszeichen', 'heredoc', 'multiline', 'dedent', 'textwrap', 'mehrere zeilen'],
    related: ['Docstrings', 'Escape-Sequenzen', 'str.splitlines()'],
    mdn: T + 'introduction.html#text'
  },
  {
    lang: 'py', group: 'Strings', name: 'Escape-Sequenzen',
    desc: "Sonderzeichen in Strings mit Backslash: Zeilenumbruch, Tab, Unicode und mehr.",
    details: "Ein Backslash leitet eine Escape-Sequenz ein: `\\n` Zeilenumbruch, `\\t` Tab, `\\\\` Backslash, `\\\"` Anführungszeichen. Unicode-Zeichen schreibt man als `\\u00e9`, `\\U0001F600` oder per Name `\\N{EURO SIGN}`. Unbekannte Sequenzen wie `\\d` erzeugen seit Python 3.12 eine `SyntaxWarning`, in regulären Ausdrücken daher Raw-Strings verwenden.",
    values: [
      ['\\n', 'Zeilenumbruch (LF)'],
      ['\\t', 'Tabulator'],
      ['\\r', 'Wagenrücklauf (CR)'],
      ['\\\\', 'Backslash'],
      ['\\\' bzw. \\"', 'Anführungszeichen'],
      ['\\xhh', 'Zeichen per Hex-Code'],
      ['\\uXXXX', 'Unicode-Zeichen (4 Hex-Stellen)'],
      ['\\N{NAME}', 'Unicode-Zeichen per Name'],
      ['\\0', 'Nullzeichen']
    ],
    example: e(`
print("Spalte1\\tSpalte2")              # Spalte1<Tab>Spalte2
print("Zeile 1\\nZeile 2")              # zwei Zeilen
print("Sie sagte: \\"Hallo\\"")          # Sie sagte: "Hallo"
print("Backslash: \\\\")                 # Backslash: \\
print("\\u00e9 \\N{EURO SIGN} \\x41")     # é € A
print(len("\\n"), repr("a\\tb"))         # 1 'a\\tb'
`),
    keywords: ['escape', 'backslash', 'sonderzeichen', 'zeilenumbruch', 'tab', 'newline', 'unicode', 'maskieren'],
    related: ['Raw-Strings', 'Strings (Literale)', 'Mehrzeilige Strings'],
    mdn: R + 'lexical_analysis.html#escape-sequences'
  },
  {
    lang: 'py', group: 'Strings', name: 'String-Methoden-Überblick',
    desc: "Die wichtigsten Methoden von str auf einen Blick.",
    details: "Alle String-Methoden geben neue Strings (oder Listen, Zahlen, Wahrheitswerte) zurück, das Original bleibt unverändert. Viele lassen sich verketten: `s.strip().lower().split()`. Für Muster und komplexe Suchen gibt es das Modul `re`, für Vorlagen `string.Template`.",
    values: [
      ['split() / rsplit()', 'In Liste zerlegen'],
      ['join(it)', 'Iterable mit Trenner verbinden'],
      ['strip() / lstrip() / rstrip()', 'Leerraum am Rand entfernen'],
      ['replace(a, b)', 'Teilstring ersetzen'],
      ['find() / index()', 'Position suchen'],
      ['count(sub)', 'Vorkommen zählen'],
      ['startswith() / endswith()', 'Präfix/Suffix prüfen'],
      ['removeprefix() / removesuffix()', 'Präfix/Suffix entfernen'],
      ['upper() / lower() / title()', 'Schreibweise ändern'],
      ['casefold()', 'Für Vergleiche ohne Schreibweise'],
      ['isdigit() / isalpha() / isspace()', 'Zeichenart prüfen'],
      ['partition(sep)', 'Am ersten Trenner in 3 Teile'],
      ['splitlines()', 'In Zeilen zerlegen'],
      ['center() / ljust() / rjust() / zfill()', 'Auf Breite auffüllen'],
      ['translate(tab)', 'Zeichen per Tabelle ersetzen'],
      ['encode()', 'In Bytes umwandeln']
    ],
    example: e(`
s = "  Hallo, Welt!  "
print(s.strip().lower())              # hallo, welt!
print(s.strip().split(", "))          # ['Hallo', 'Welt!']
print("-".join("abc"))                # a-b-c
print("abc".upper().center(7, "."))   # ..ABC..
print("Wort" * 3)                     # WortWortWort
print("all" in "Hallo")               # True
`),
    keywords: ['string methoden', 'str methods', 'übersicht', 'textverarbeitung', 'zeichenketten'],
    related: ['str.split()', 'str.join()', 'str.strip()', 'f-String'],
    mdn: D + 'stdtypes.html#string-methods'
  },
  {
    lang: 'py', group: 'Strings', name: 't-String',
    desc: "Template-String-Literal: liefert ein Template-Objekt statt eines fertigen Strings (seit 3.14).",
    details: "Seit Python 3.14 erzeugt `t\"Hallo {name}\"` kein `str`, sondern ein `string.templatelib.Template` mit den festen Textteilen (`strings`) und den Platzhaltern (`interpolations`). Eine Funktion entscheidet dann, wie die Werte eingesetzt werden, etwa mit HTML- oder SQL-Escaping. Die Syntax entspricht f-Strings inklusive Format-Spezifikation; ein Template hat bewusst keine fertige `str()`-Darstellung des Ergebnisses.",
    syntax: "t\"Text {ausdruck} Text\"   -> string.templatelib.Template",
    values: [
      ['tpl.strings', 'Tupel der festen Textteile'],
      ['tpl.values', 'Tupel der ausgewerteten Werte'],
      ['tpl.interpolations', 'Tupel von Interpolation-Objekten'],
      ['Interpolation.value', 'Ausgewerteter Wert'],
      ['Interpolation.expression', 'Quelltext des Ausdrucks'],
      ['Interpolation.format_spec', 'Format-Spezifikation nach dem :']
    ],
    example: e(`
from string.templatelib import Template, Interpolation

name = "<b>Ada</b>"
tpl = t"Hallo {name}!"
print(type(tpl).__name__)       # Template
print(tpl.strings)              # ('Hallo ', '!')
print(tpl.values)               # ('<b>Ada</b>',)

def html_sicher(vorlage: Template) -> str:
    teile = []
    for teil in vorlage:        # liefert str und Interpolation
        if isinstance(teil, Interpolation):
            teile.append(str(teil.value).replace("<", "&lt;").replace(">", "&gt;"))
        else:
            teile.append(teil)
    return "".join(teile)

print(html_sicher(tpl))         # Hallo &lt;b&gt;Ada&lt;/b&gt;!
`),
    tip: "t-Strings lösen das Problem von f-Strings bei SQL und HTML: Die Werte bleiben getrennt, bis eine Funktion sie sicher einsetzt.",
    keywords: ['template string', 't-string', 'pep 750', 'templatelib', 'python 3.14', 'escaping', 'interpolation'],
    related: ['f-String', 'str.format()', 'Format-Spezifikation'],
    mdn: D + 'string.templatelib.html'
  },

  // ---------------- Listen ----------------
  {
    lang: 'py', group: 'Listen', name: 'list',
    desc: "Veränderliche, geordnete Sammlung beliebiger Objekte in eckigen Klammern.",
    details: "Listen wachsen und schrumpfen dynamisch, erlauben Duplikate und gemischte Typen. Zugriff per Index ist schnell, Einfügen und Löschen am Anfang dagegen langsam (dafür `collections.deque`). `list(iterable)` erzeugt eine Liste aus jedem Iterable. Die Zuweisung `b = a` kopiert nicht, beide Namen zeigen auf dieselbe Liste.",
    syntax: "[a, b, c]   []   list(iterable)",
    values: [
      ['append(x)', 'Element anhängen'],
      ['extend(it)', 'Mehrere Elemente anhängen'],
      ['insert(i, x)', 'An Position einfügen'],
      ['remove(x)', 'Erstes Vorkommen löschen'],
      ['pop([i])', 'Element entnehmen'],
      ['clear()', 'Alle Elemente entfernen'],
      ['index(x)', 'Position suchen'],
      ['count(x)', 'Vorkommen zählen'],
      ['sort()', 'Sortieren (in place)'],
      ['reverse()', 'Umkehren (in place)'],
      ['copy()', 'Flache Kopie']
    ],
    example: e(`
zahlen = [3, 1, 4, 1, 5]
gemischt = [1, "zwei", 3.0, None, [5]]
print(list("abc"))              # ['a', 'b', 'c']
print(list(range(5)))           # [0, 1, 2, 3, 4]
print(len(zahlen), 4 in zahlen) # 5 True
print(zahlen + [9])             # [3, 1, 4, 1, 5, 9]
print([0] * 3)                  # [0, 0, 0]
print(len(gemischt))            # 5
`),
    tip: "Für „ist x enthalten?“ in großen Datenmengen ein `set` statt einer Liste verwenden: `in` ist dort O(1) statt O(n).",
    keywords: ['liste', 'array', 'list', 'eckige klammern', 'sammlung', 'collection', 'dynamisches array'],
    related: ['Indexierung', 'Slicing', 'List Comprehension', 'tuple'],
    mdn: D + 'stdtypes.html#list'
  },
  {
    lang: 'py', group: 'Listen', name: 'Indexierung',
    desc: "Zugriff auf einzelne Elemente per Position; negative Indizes zählen von hinten.",
    details: "Der erste Index ist 0, der letzte `len(x) - 1` oder einfach `-1`. Bei veränderlichen Sequenzen wie Listen kann man per Index auch zuweisen. Ein Index außerhalb des Bereichs löst einen `IndexError` aus. Verschachtelte Listen werden mit mehreren Klammern angesprochen: `matrix[zeile][spalte]`.",
    syntax: "x[i]   x[-1]   x[i] = wert   x[i][j]",
    example: e(`
farben = ["rot", "grün", "blau"]
print(farben[0])       # rot
print(farben[-1])      # blau
farben[1] = "gelb"
print(farben)          # ['rot', 'gelb', 'blau']

matrix = [[1, 2], [3, 4]]
print(matrix[1][0])    # 3

try:
    farben[3]
except IndexError as err:
    print(err)         # list index out of range
`),
    tip: "Statt `for i in range(len(liste)): liste[i]` lieber `for i, x in enumerate(liste)` schreiben.",
    keywords: ['index', 'zugriff', 'element', 'position', 'negativer index', 'indexerror'],
    related: ['Slicing', 'list', 'enumerate()'],
    mdn: T + 'introduction.html#lists'
  },
  {
    lang: 'py', group: 'Listen', name: 'Slicing',
    desc: "Teilbereiche einer Sequenz ausschneiden: x[start:stop:step] liefert eine neue Liste.",
    details: "Der Bereich enthält `start`, aber nicht mehr `stop`. Weggelassene Grenzen bedeuten Anfang bzw. Ende, ein negativer Schritt läuft rückwärts. Ein Slice einer Liste ist eine flache Kopie, Änderungen daran wirken nicht auf das Original. Zu große Grenzen sind kein Fehler, sie werden auf die Länge gekürzt.",
    syntax: "x[start:stop]   x[start:stop:step]   x[::-1]   slice(start, stop, step)",
    example: e(`
z = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(z[2:5])       # [2, 3, 4]
print(z[:3])        # [0, 1, 2]
print(z[-3:])       # [7, 8, 9]
print(z[::3])       # [0, 3, 6, 9]
print(z[::-1][:3])  # [9, 8, 7]

teil = z[1:3]
teil[0] = 99
print(z[1])         # 1 (Slice ist eine Kopie)

mitte = slice(1, 8, 2)
print(z[mitte])     # [1, 3, 5, 7]
`),
    keywords: ['slice', 'teilliste', 'ausschnitt', 'bereich', 'sublist', 'umkehren', 'schritt'],
    related: ['Slice-Zuweisung', 'String-Slicing', 'Indexierung'],
    mdn: D + 'stdtypes.html#common-sequence-operations'
  },
  {
    lang: 'py', group: 'Listen', name: 'Slice-Zuweisung',
    desc: "Ersetzt, löscht oder fügt ganze Bereiche einer Liste per Slice ein.",
    details: "Bei `x[a:b] = iterable` wird der Bereich durch die neuen Elemente ersetzt, die Länge darf sich dabei ändern. Eine leere Liste löscht den Bereich, `x[i:i] = [...]` fügt ein. Bei einem Slice mit Schritt (`x[::2]`) muss die Anzahl genau passen, sonst gibt es einen `ValueError`. `del x[a:b]` entfernt ebenfalls einen Bereich.",
    syntax: "x[a:b] = iterable   x[a:b] = []   del x[a:b]",
    example: e(`
z = [0, 1, 2, 3, 4, 5]
z[1:3] = ["a", "b", "c"]
print(z)          # [0, 'a', 'b', 'c', 3, 4, 5]
z[1:4] = []
print(z)          # [0, 3, 4, 5]
z[:0] = [-1]
print(z)          # [-1, 0, 3, 4, 5]
z[::2] = [9, 9, 9]
print(z)          # [9, 0, 9, 4, 9]
del z[1:3]
print(z)          # [9, 4, 9]
z[:] = []         # Liste leeren, alle Referenzen sehen es
print(z)          # []
`),
    keywords: ['slice assignment', 'bereich ersetzen', 'bereich löschen', 'einfügen', 'del slice'],
    related: ['Slicing', 'list.insert()', 'list.clear()'],
    mdn: D + 'stdtypes.html#mutable-sequence-types'
  },
  {
    lang: 'py', group: 'Listen', name: 'list.append()',
    desc: "Hängt ein einzelnes Element an das Ende der Liste an.",
    details: "`append()` verändert die Liste direkt und gibt `None` zurück. Übergibt man eine Liste, wird sie als ein einziges verschachteltes Element angehängt; zum Anhängen mehrerer Elemente dient `extend()`. Das Anhängen am Ende ist im Mittel O(1) und damit sehr schnell.",
    syntax: "liste.append(x)",
    example: e(`
einkauf = []
einkauf.append("Brot")
einkauf.append("Milch")
print(einkauf)           # ['Brot', 'Milch']

einkauf.append(["Eier", "Mehl"])
print(einkauf)           # ['Brot', 'Milch', ['Eier', 'Mehl']]
print(len(einkauf))      # 3

ergebnis = einkauf.append("Käse")
print(ergebnis)          # None
`),
    tip: "Häufiger Fehler: `liste = liste.append(x)` – danach ist `liste` `None`.",
    keywords: ['anhängen', 'hinzufügen', 'push', 'add', 'element hinzufügen'],
    related: ['list.extend()', 'list.insert()', 'Listen als Stack'],
    mdn: T + 'datastructures.html#more-on-lists'
  },
  {
    lang: 'py', group: 'Listen', name: 'list.extend()',
    desc: "Hängt alle Elemente eines Iterables an die Liste an.",
    details: "`extend()` nimmt jedes Iterable: Listen, Tupel, Mengen, Generatoren und auch Strings, die dann zeichenweise angehängt werden. `liste += iterable` ist gleichwertig und verändert die Liste ebenfalls in place. `a + b` erzeugt dagegen eine neue Liste und funktioniert nur zwischen Listen.",
    syntax: "liste.extend(iterable)\nliste += iterable",
    example: e(`
a = [1, 2]
a.extend([3, 4])
print(a)            # [1, 2, 3, 4]
a += (5, 6)
print(a)            # [1, 2, 3, 4, 5, 6]

b = ["x"]
b.extend("yz")      # Fallstrick: einzelne Zeichen
print(b)            # ['x', 'y', 'z']
b.extend(n * 10 for n in range(2))
print(b)            # ['x', 'y', 'z', 0, 10]
`),
    keywords: ['erweitern', 'anhängen', 'concat', 'zusammenfügen', 'listen verbinden', '+='],
    related: ['list.append()', 'Sequenz-Operationen', 'Unpacking in Literalen'],
    mdn: T + 'datastructures.html#more-on-lists'
  },
  {
    lang: 'py', group: 'Listen', name: 'list.insert()',
    desc: "Fügt ein Element vor der angegebenen Position ein.",
    details: "`insert(i, x)` schiebt alle Elemente ab Index `i` um eins nach hinten, das kostet O(n). Ist der Index größer als die Länge, wird angehängt; negative Indizes zählen von hinten. Häufiges Einfügen am Anfang ist mit `collections.deque.appendleft()` deutlich schneller. Für sortiertes Einfügen gibt es `bisect.insort()`.",
    syntax: "liste.insert(index, x)",
    example: e(`
z = [1, 2, 4]
z.insert(2, 3)
print(z)          # [1, 2, 3, 4]
z.insert(0, 0)
print(z)          # [0, 1, 2, 3, 4]
z.insert(100, 5)
print(z)          # [0, 1, 2, 3, 4, 5]
z.insert(-1, 4.5)
print(z)          # [0, 1, 2, 3, 4, 4.5, 5]
`),
    keywords: ['einfügen', 'insert', 'position', 'an stelle', 'vorne einfügen'],
    related: ['list.append()', 'collections.deque', 'Slice-Zuweisung'],
    mdn: T + 'datastructures.html#more-on-lists'
  },
  {
    lang: 'py', group: 'Listen', name: 'list.remove()',
    desc: "Entfernt das erste Element mit dem angegebenen Wert.",
    details: "`remove()` sucht nach Wert (per `==`), nicht nach Index, und entfernt nur das erste Vorkommen. Fehlt der Wert, gibt es einen `ValueError`. Alle Vorkommen entfernt man am besten mit einer List Comprehension. Niemals Elemente aus einer Liste entfernen, über die man gerade mit `for` läuft – dabei werden Elemente übersprungen.",
    syntax: "liste.remove(wert)",
    example: e(`
tiere = ["Hund", "Katze", "Hund", "Maus"]
tiere.remove("Hund")
print(tiere)        # ['Katze', 'Hund', 'Maus']

try:
    tiere.remove("Vogel")
except ValueError as err:
    print(err)      # list.remove(x): x not in list

ohne_hunde = [t for t in tiere if t != "Hund"]
print(ohne_hunde)   # ['Katze', 'Maus']
`),
    tip: "Zum Löschen nach Position `del liste[i]` oder `liste.pop(i)` verwenden.",
    keywords: ['entfernen', 'löschen', 'delete', 'wert entfernen', 'valueerror'],
    related: ['list.pop()', 'set.discard()', 'List Comprehension'],
    mdn: T + 'datastructures.html#more-on-lists'
  },
  {
    lang: 'py', group: 'Listen', name: 'list.pop()',
    desc: "Entfernt ein Element an einer Position (Standard: das letzte) und gibt es zurück.",
    details: "`pop()` ohne Argument entnimmt das letzte Element in O(1) und eignet sich damit für Stacks. `pop(0)` entfernt das erste Element, muss aber alle anderen verschieben (O(n)), für Warteschlangen besser `deque.popleft()` nutzen. Bei leerer Liste oder ungültigem Index gibt es einen `IndexError`.",
    syntax: "liste.pop()   liste.pop(index)",
    example: e(`
stapel = [1, 2, 3, 4]
print(stapel.pop())     # 4
print(stapel.pop(0))    # 1
print(stapel)           # [2, 3]

try:
    [].pop()
except IndexError as err:
    print(err)          # pop from empty list
`),
    keywords: ['entnehmen', 'entfernen', 'letztes element', 'pop', 'stack'],
    related: ['Listen als Stack', 'list.remove()', 'collections.deque'],
    mdn: T + 'datastructures.html#more-on-lists'
  },
  {
    lang: 'py', group: 'Listen', name: 'list.clear()',
    desc: "Entfernt alle Elemente aus der Liste; das Listenobjekt bleibt erhalten.",
    details: "`clear()` leert die Liste in place, alle anderen Namen, die auf dieselbe Liste zeigen, sehen danach eine leere Liste. `liste = []` bindet dagegen nur den Namen an eine neue Liste, die alte bleibt für andere Referenzen bestehen. `del liste[:]` ist gleichwertig zu `clear()`.",
    syntax: "liste.clear()",
    example: e(`
a = [1, 2, 3]
b = a
a.clear()
print(a, b)     # [] []

c = [1, 2, 3]
d = c
c = []          # nur neu gebunden
print(c, d)     # [] [1, 2, 3]
`),
    keywords: ['leeren', 'alles löschen', 'clear', 'empty', 'zurücksetzen'],
    related: ['Slice-Zuweisung', 'list.copy()', 'Identität & Gleichheit'],
    mdn: D + 'stdtypes.html#mutable-sequence-types'
  },
  {
    lang: 'py', group: 'Listen', name: 'list.sort()',
    desc: "Sortiert die Liste in place, optional mit key-Funktion und absteigend.",
    details: "`sort()` verändert die Liste und gibt `None` zurück; `sorted()` liefert dagegen eine neue Liste. Mit `key` gibt man eine Funktion an, deren Ergebnis verglichen wird, z. B. `key=len` oder `key=str.lower`. Die Sortierung ist stabil: Gleiche Schlüssel behalten ihre Reihenfolge, so lässt sich in mehreren Durchgängen sortieren. Großbuchstaben kommen ohne `key` vor Kleinbuchstaben, gemischte Typen wie `int` und `str` lassen sich nicht vergleichen.",
    syntax: "liste.sort(key=None, reverse=False)",
    example: e(`
z = [3, 1, 2]
z.sort()
print(z)                        # [1, 2, 3]
z.sort(reverse=True)
print(z)                        # [3, 2, 1]

obst = ["kirsche", "Apfel", "banane", "Feige"]
obst.sort()
print(obst)                     # ['Apfel', 'Feige', 'banane', 'kirsche']
obst.sort(key=str.lower)
print(obst)                     # ['Apfel', 'banane', 'Feige', 'kirsche']

personen = [("Ben", 30), ("Ada", 25), ("Cem", 25)]
personen.sort(key=lambda p: (p[1], p[0]))
print(personen)                 # [('Ada', 25), ('Cem', 25), ('Ben', 30)]
print(z.sort())                 # None
`),
    tip: "Für mehrere Sortierkriterien ein Tupel als Schlüssel zurückgeben; für absteigende Zahlen darin `-wert` verwenden.",
    keywords: ['sortieren', 'sort', 'reihenfolge', 'key', 'absteigend', 'aufsteigend', 'stabil'],
    related: ['sorted()', 'list.reverse()', 'lambda'],
    mdn: D + 'stdtypes.html#list.sort'
  },
  {
    lang: 'py', group: 'Listen', name: 'list.reverse()',
    desc: "Kehrt die Reihenfolge der Liste in place um.",
    details: "`reverse()` verändert die Liste und gibt `None` zurück. Eine umgekehrte Kopie liefert `liste[::-1]`, einen Iterator ohne Kopie `reversed(liste)`. Zum absteigenden Sortieren nicht erst sortieren und dann umkehren, sondern `sort(reverse=True)` verwenden.",
    syntax: "liste.reverse()",
    example: e(`
z = [1, 2, 3]
z.reverse()
print(z)                   # [3, 2, 1]
print(z[::-1])             # [1, 2, 3] (neue Liste)
print(list(reversed(z)))   # [1, 2, 3]
print(z)                   # [3, 2, 1]
`),
    keywords: ['umkehren', 'rückwärts', 'reverse', 'umdrehen', 'reihenfolge'],
    related: ['reversed()', 'list.sort()', 'Slicing'],
    mdn: T + 'datastructures.html#more-on-lists'
  },
  {
    lang: 'py', group: 'Listen', name: 'list.index()',
    desc: "Liefert den Index des ersten Elements mit dem gesuchten Wert.",
    details: "`index()` sucht linear (O(n)) und wirft einen `ValueError`, wenn der Wert fehlt; ein `find()` mit -1 gibt es bei Listen nicht. Mit `start` und `end` kann man ab einer Position weitersuchen. `count(x)` zählt, wie oft ein Wert vorkommt. Wer Index und Wert braucht, iteriert mit `enumerate()`.",
    syntax: "liste.index(wert[, start[, end]])\nliste.count(wert)",
    example: e(`
farben = ["rot", "grün", "blau", "grün"]
print(farben.index("grün"))      # 1
print(farben.index("grün", 2))   # 3
print(farben.count("grün"))      # 2

pos = farben.index("lila") if "lila" in farben else -1
print(pos)                       # -1

alle = [i for i, f in enumerate(farben) if f == "grün"]
print(alle)                      # [1, 3]
`),
    keywords: ['suchen', 'position', 'index', 'indexOf', 'count', 'zählen', 'finden'],
    related: ['enumerate()', 'str.find()', 'in / not in'],
    mdn: T + 'datastructures.html#more-on-lists'
  },
  {
    lang: 'py', group: 'Listen', name: 'list.copy()',
    desc: "Erstellt eine flache Kopie der Liste.",
    details: "Eine Zuweisung `b = a` kopiert nichts, beide Namen zeigen auf dieselbe Liste. `a.copy()`, `a[:]` und `list(a)` erzeugen eine neue Liste mit denselben Elementen. Die Kopie ist flach: Verschachtelte Listen oder Objekte darin werden geteilt, dafür braucht man `copy.deepcopy()`.",
    syntax: "kopie = liste.copy()   # auch liste[:] oder list(liste)",
    example: e(`
original = [1, 2, 3]
alias = original
kopie = original.copy()
original.append(4)
print(alias)     # [1, 2, 3, 4]
print(kopie)     # [1, 2, 3]
print(kopie is original)  # False

verschachtelt = [[1], [2]]
flach = verschachtelt.copy()
flach[0].append(99)
print(verschachtelt)      # [[1, 99], [2]]
`),
    keywords: ['kopieren', 'kopie', 'clone', 'duplizieren', 'flache kopie', 'shallow copy'],
    related: ['Flache & tiefe Kopie', 'Identität & Gleichheit', 'Veränderlich & unveränderlich'],
    mdn: T + 'datastructures.html#more-on-lists'
  },
  {
    lang: 'py', group: 'Listen', name: 'Flache & tiefe Kopie',
    desc: "copy.copy() kopiert nur die äußere Ebene, copy.deepcopy() rekursiv alles.",
    details: "Eine flache Kopie legt einen neuen Container an, dessen Elemente aber dieselben Objekte sind wie im Original. Eine tiefe Kopie kopiert auch alle verschachtelten Objekte und kommt mit Zyklen zurecht. `deepcopy` ist langsamer und kopiert alles, auch große Strukturen, die man eigentlich teilen wollte. Eigene Klassen können das Verhalten mit `__copy__` und `__deepcopy__` steuern.",
    syntax: "import copy\ncopy.copy(obj)       # flach\ncopy.deepcopy(obj)   # tief",
    example: e(`
import copy

daten = {"name": "Ada", "tags": ["a", "b"]}
flach = copy.copy(daten)
tief = copy.deepcopy(daten)

daten["tags"].append("c")
daten["name"] = "Grace"
print(flach["tags"])     # ['a', 'b', 'c'] (geteilte Liste)
print(flach["name"])     # Ada
print(tief["tags"])      # ['a', 'b']
`),
    tip: "Seit Python 3.13 gibt es `copy.replace(obj, feld=wert)` für Dataclasses und namedtuples.",
    keywords: ['copy', 'deepcopy', 'shallow copy', 'deep copy', 'kopieren', 'verschachtelt', 'tiefe kopie'],
    related: ['list.copy()', 'Veränderlich & unveränderlich', 'Listen-Fallstrick [[]] * n'],
    mdn: D + 'copy.html'
  },
  {
    lang: 'py', group: 'Listen', name: 'Listen als Stack',
    desc: "Eine Liste mit append() und pop() ergibt einen Stapel (LIFO).",
    details: "Beim Stack (Last In, First Out) wird oben abgelegt und oben entnommen: `append()` und `pop()` am Listenende sind beide O(1). Das oberste Element liest man mit `stapel[-1]`, vorher prüfen, ob der Stack leer ist. Als Warteschlange (FIFO) eignet sich eine Liste nicht, weil `pop(0)` langsam ist – dafür `collections.deque`.",
    syntax: "stapel.append(x)   # push\nstapel.pop()       # pop\nstapel[-1]         # peek",
    example: e(`
verlauf = []
verlauf.append("seite1")
verlauf.append("seite2")
verlauf.append("seite3")
print(verlauf[-1])      # seite3 (oberstes Element)
print(verlauf.pop())    # seite3
print(verlauf)          # ['seite1', 'seite2']

def ausgeglichen(text):
    paare = {")": "(", "]": "["}
    stapel = []
    for z in text:
        if z in "([":
            stapel.append(z)
        elif z in paare and (not stapel or stapel.pop() != paare[z]):
            return False
    return not stapel

print(ausgeglichen("(a[b])"), ausgeglichen("(]"))  # True False
`),
    keywords: ['stack', 'stapel', 'lifo', 'push', 'pop', 'kellerspeicher'],
    related: ['list.pop()', 'list.append()', 'collections.deque'],
    mdn: T + 'datastructures.html#using-lists-as-stacks'
  },
  {
    lang: 'py', group: 'Listen', name: 'Listen-Fallstrick [[]] * n',
    desc: "[[]] * n erzeugt n Verweise auf dieselbe innere Liste, nicht n Listen.",
    details: "Der Operator `*` vervielfacht nur die Referenzen. Bei unveränderlichen Elementen wie `[0] * 3` ist das harmlos, bei Listen, Dictionaries oder Objekten teilen sich alle Einträge dasselbe Objekt. Eine Änderung an einer Zeile erscheint dann in allen. Richtig ist eine List Comprehension, die für jede Position ein neues Objekt erzeugt.",
    syntax: "[[] for _ in range(n)]          # richtig\n[[0] * spalten for _ in range(zeilen)]",
    example: e(`
falsch = [[]] * 3
falsch[0].append(1)
print(falsch)                   # [[1], [1], [1]]
print(falsch[0] is falsch[1])   # True

richtig = [[] for _ in range(3)]
richtig[0].append(1)
print(richtig)                  # [[1], [], []]

gitter = [[0] * 3 for _ in range(2)]
gitter[0][0] = 5
print(gitter)                   # [[5, 0, 0], [0, 0, 0]]
`),
    tip: "Dasselbe Problem hat `dict.fromkeys(schluessel, [])`: alle Schlüssel teilen sich eine Liste.",
    keywords: ['fallstrick', 'gotcha', 'zweidimensional', '2d liste', 'matrix', 'referenz', 'multiplikation', 'pitfall'],
    related: ['List Comprehension', 'Flache & tiefe Kopie', 'Veränderlich & unveränderlich'],
    mdn: 'https://docs.python.org/3/faq/programming.html#how-do-i-create-a-multidimensional-list'
  },

  // ---------------- Tupel ----------------
  {
    lang: 'py', group: 'Tupel', name: 'tuple',
    desc: "Unveränderliche, geordnete Sequenz; Klammern sind optional, das Komma zählt.",
    details: "Tupel eignen sich für feste Datensätze wie Koordinaten oder Rückgabewerte. Sie können nach dem Erzeugen nicht verändert werden und sind hashbar, wenn ihre Elemente hashbar sind, und damit als Dictionary-Schlüssel nutzbar. Tupel werden elementweise verglichen. Enthält ein Tupel eine Liste, kann diese Liste trotzdem verändert werden.",
    syntax: "(a, b, c)   a, b   ()   (a,)   tuple(iterable)",
    values: [
      ['count(x)', 'Vorkommen zählen'],
      ['index(x)', 'Position suchen']
    ],
    example: e(`
punkt = (3, 4)
farben = "rot", "grün"           # Klammern sind optional
print(punkt[0], len(farben))     # 3 2
x, y = punkt
print(x + y)                     # 7

try:
    punkt[0] = 5
except TypeError as err:
    print(err)                   # 'tuple' object does not support item assignment

orte = {(0, 0): "Ursprung"}      # als dict-Schlüssel
print(orte[(0, 0)])              # Ursprung
print((1, 2) < (1, 3))           # True
`),
    keywords: ['tupel', 'tuple', 'unveränderlich', 'immutable', 'datensatz', 'paar', 'record'],
    related: ['Tupel mit einem Element', 'Entpacken', 'collections.namedtuple', 'Tupel vs. Liste'],
    mdn: T + 'datastructures.html#tuples-and-sequences'
  },
  {
    lang: 'py', group: 'Tupel', name: 'Tupel mit einem Element',
    desc: "Ein Tupel mit einem Element braucht ein Komma: (5,) – (5) ist nur eine Zahl.",
    details: "Klammern dienen in Python auch zur Gruppierung von Ausdrücken, daher ist `(5)` einfach `5`. Erst das Komma macht ein Tupel. Ein versehentliches Komma am Zeilenende erzeugt umgekehrt ungewollt ein Tupel, was zu verwirrenden Fehlern führt. Das leere Tupel ist `()`.",
    syntax: "(x,)   x,   ()",
    example: e(`
a = (5)
b = (5,)
c = 5,
print(type(a).__name__, type(b).__name__, type(c).__name__)  # int tuple tuple
print(len(()))     # 0

# Häufiger Fehler: Komma am Zeilenende
preis = 9.99,
print(preis)       # (9.99,)
`),
    tip: "Taucht unerwartet `(wert,)` in einer Ausgabe auf, nach einem überflüssigen Komma in einer Zuweisung suchen.",
    keywords: ['singleton', 'ein element', 'komma', 'trailing comma', 'einelementig', 'leeres tupel'],
    related: ['tuple', 'Zuweisung'],
    mdn: T + 'datastructures.html#tuples-and-sequences'
  },
  {
    lang: 'py', group: 'Tupel', name: 'Tupel als Rückgabewert',
    desc: "Mehrere Werte zurückgeben: return a, b liefert ein Tupel, das man entpackt.",
    details: "`return a, b` gibt genau ein Tupel zurück, der Aufrufer kann es direkt in mehrere Variablen entpacken. Die Anzahl der Variablen muss passen, sonst gibt es einen `ValueError`. Nicht benötigte Werte fängt man üblicherweise mit `_` auf. Bei mehr als zwei, drei Werten ist ein `namedtuple` oder eine Dataclass lesbarer.",
    syntax: "def f():\n    return a, b\n\nx, y = f()",
    example: e(`
def min_max(werte):
    return min(werte), max(werte)

kleinst, groesst = min_max([4, 9, 1])
print(kleinst, groesst)     # 1 9
print(min_max([4, 9, 1]))   # (1, 9)

_, hoch = min_max([2, 3])
print(hoch)                 # 3

q, r = divmod(17, 5)
print(q, r)                 # 3 2
`),
    keywords: ['mehrere rückgabewerte', 'return tuple', 'multiple return', 'entpacken', 'unpacking'],
    related: ['Entpacken', 'collections.namedtuple', 'return'],
    mdn: T + 'datastructures.html#tuples-and-sequences'
  },
  {
    lang: 'py', group: 'Tupel', name: 'Tupel vs. Liste',
    desc: "Tupel für feste Strukturen, Listen für gleichartige, veränderliche Sammlungen.",
    details: "Listen sind für Sammlungen gleichartiger Elemente gedacht, deren Länge sich ändert. Tupel stehen für Datensätze fester Länge, bei denen die Position eine Bedeutung hat. Tupel sind etwas kleiner und schneller zu erzeugen und können als Dictionary-Schlüssel oder Set-Element dienen. Listen sind dagegen nicht hashbar.",
    values: [
      ['Liste', 'veränderlich, nicht hashbar, gleichartige Elemente'],
      ['Tupel', 'unveränderlich, hashbar (bei hashbarem Inhalt), feste Struktur']
    ],
    example: e(`
import sys

liste = [1, 2, 3]
tupel = (1, 2, 3)
print(sys.getsizeof(liste) > sys.getsizeof(tupel))  # True
print(hash(tupel) == hash((1, 2, 3)))               # True

try:
    hash(liste)
except TypeError as err:
    print(err)                     # unhashable type: 'list'

datensatz = ("Ada", 1815)          # feste Struktur: Tupel
namen = ["Ada", "Linus"]           # wachsende Sammlung: Liste
namen.append("Grace")
print(datensatz[0] in namen)       # True
`),
    keywords: ['unterschied', 'tupel oder liste', 'tuple vs list', 'immutable', 'hashbar', 'vergleich'],
    related: ['tuple', 'list', 'Gültige Schlüssel (hashbar)'],
    mdn: T + 'datastructures.html#tuples-and-sequences'
  },
  {
    lang: 'py', group: 'Tupel', name: 'collections.namedtuple',
    desc: "Tupel mit benannten Feldern: Zugriff per Name und per Index.",
    details: "`namedtuple(\"Name\", [\"feld1\", \"feld2\"])` erzeugt eine Klasse, deren Instanzen unveränderliche Tupel mit Attributnamen sind. `_replace()` liefert eine geänderte Kopie, `_asdict()` ein Dictionary. Die typisierte Variante ist `typing.NamedTuple` als Klassensyntax. Für veränderliche Datensätze mit Methoden ist `@dataclass` meist besser.",
    syntax: "Punkt = namedtuple(\"Punkt\", [\"x\", \"y\"], defaults=None)",
    values: [
      ['_replace(**kw)', 'Kopie mit geänderten Feldern'],
      ['_asdict()', 'Als Dictionary'],
      ['_fields', 'Tupel der Feldnamen'],
      ['_make(iterable)', 'Instanz aus Iterable erzeugen']
    ],
    example: e(`
from collections import namedtuple
from typing import NamedTuple

Punkt = namedtuple("Punkt", ["x", "y"])
p = Punkt(3, 4)
print(p)                   # Punkt(x=3, y=4)
print(p.x, p[1])           # 3 4
print(p._replace(x=10))    # Punkt(x=10, y=4)
print(p._asdict())         # {'x': 3, 'y': 4}

class Farbe(NamedTuple):
    r: int
    g: int
    b: int = 0

print(Farbe(255, 128))     # Farbe(r=255, g=128, b=0)
`),
    keywords: ['namedtuple', 'benanntes tupel', 'NamedTuple', 'record', 'struct', 'datensatz'],
    related: ['tuple', '@dataclass', 'Tupel als Rückgabewert'],
    mdn: D + 'collections.html#collections.namedtuple'
  },

  // ---------------- Dictionaries ----------------
  {
    lang: 'py', group: 'Dictionaries', name: 'dict',
    desc: "Veränderliche Zuordnung von eindeutigen Schlüsseln zu Werten (Hashtabelle).",
    details: "Ein Dictionary speichert Schlüssel-Wert-Paare, Zugriff und Einfügen sind im Mittel O(1). Schlüssel müssen hashbar sein (z. B. `str`, `int`, `tuple`), Werte beliebig. Seit Python 3.7 bleibt die Einfügereihenfolge garantiert erhalten. `{}` ist ein leeres Dictionary, kein leeres Set.",
    syntax: "{schlüssel: wert, ...}   {}   dict(a=1, b=2)   dict(paare)   {k: v for ...}",
    values: [
      ['d[k]', 'Wert lesen (KeyError, wenn fehlt)'],
      ['d.get(k, std)', 'Wert lesen mit Standardwert'],
      ['d[k] = v', 'Setzen oder überschreiben'],
      ['del d[k] / d.pop(k)', 'Entfernen'],
      ['k in d', 'Schlüssel vorhanden?'],
      ['keys() / values() / items()', 'Ansichten auf Schlüssel, Werte, Paare'],
      ['update() / |', 'Zusammenführen'],
      ['setdefault(k, v)', 'Lesen oder mit Standard anlegen']
    ],
    example: e(`
person = {"name": "Ada", "jahr": 1815}
print(person["name"])            # Ada
person["beruf"] = "Mathematikerin"
print(len(person))               # 3
print("jahr" in person)          # True

aus_paaren = dict([("a", 1), ("b", 2)])
mit_kw = dict(x=1, y=2)
print(aus_paaren, mit_kw)        # {'a': 1, 'b': 2} {'x': 1, 'y': 2}
print({n: n * n for n in range(4)})  # {0: 0, 1: 1, 2: 4, 3: 9}
`),
    keywords: ['dictionary', 'wörterbuch', 'map', 'hashmap', 'assoziatives array', 'schlüssel wert', 'key value', 'objekt'],
    related: ['dict-Zugriff', 'dict.get()', 'dict.items()', 'Dict Comprehension'],
    mdn: D + 'stdtypes.html#mapping-types-dict'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'dict-Zugriff',
    desc: "Werte per d[schlüssel] lesen, setzen und mit del entfernen.",
    details: "`d[k]` liefert den Wert oder wirft einen `KeyError`, wenn der Schlüssel fehlt. Zuweisen legt einen neuen Eintrag an oder überschreibt einen bestehenden. `del d[k]` entfernt einen Eintrag, ebenfalls mit `KeyError`, falls er fehlt. Ob ein Schlüssel existiert, prüft `k in d`; für optionale Schlüssel ist `get()` bequemer.",
    syntax: "d[k]   d[k] = v   del d[k]   k in d",
    example: e(`
lager = {"äpfel": 10, "birnen": 0}
print(lager["äpfel"])        # 10
lager["birnen"] += 5
lager["kirschen"] = 3        # neuer Eintrag
del lager["äpfel"]
print(lager)                 # {'birnen': 5, 'kirschen': 3}

try:
    lager["bananen"]
except KeyError as err:
    print("Fehlt:", err)     # Fehlt: 'bananen'
print("bananen" in lager)    # False
`),
    keywords: ['zugriff', 'lesen', 'schreiben', 'keyerror', 'eckige klammern', 'del', 'schlüssel'],
    related: ['dict.get()', 'dict.pop()', 'dict'],
    mdn: D + 'stdtypes.html#mapping-types-dict'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'dict.get()',
    desc: "Liest einen Wert und liefert None oder einen Standardwert, wenn der Schlüssel fehlt.",
    details: "`get(k)` wirft nie einen `KeyError`, sondern gibt `None` bzw. den angegebenen Standardwert zurück. Das Dictionary wird dabei nicht verändert. Achtung: Ist der gespeicherte Wert selbst `None`, lässt sich das nicht von „fehlt“ unterscheiden, dann `in` verwenden. Zum Zählen ist `d[k] = d.get(k, 0) + 1` ein bekanntes Muster, `Counter` ist eleganter.",
    syntax: "d.get(schlüssel, standard=None)",
    example: e(`
config = {"host": "localhost", "debug": False}
print(config.get("host"))           # localhost
print(config.get("port"))           # None
print(config.get("port", 8080))     # 8080
print(config.get("debug", True))    # False

zaehler = {}
for wort in "a b a c a".split():
    zaehler[wort] = zaehler.get(wort, 0) + 1
print(zaehler)                      # {'a': 3, 'b': 1, 'c': 1}
`),
    keywords: ['standardwert', 'default', 'sicherer zugriff', 'optional', 'fallback', 'none'],
    related: ['dict-Zugriff', 'dict.setdefault()', 'collections.defaultdict'],
    mdn: D + 'stdtypes.html#dict.get'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'dict.keys()',
    desc: "Liefert eine dynamische Ansicht (View) auf alle Schlüssel.",
    details: "Die View ist kein Schnappschuss: Spätere Änderungen am Dictionary sind sofort sichtbar. Schlüssel-Views unterstützen Mengenoperationen wie `&`, `|` und `-`. Zum Iterieren über Schlüssel ist `keys()` unnötig, `for k in d` macht dasselbe. Während der Iteration darf das Dictionary nicht vergrößert oder verkleinert werden, sonst gibt es einen `RuntimeError`, notfalls über `list(d)` iterieren.",
    syntax: "d.keys()",
    example: e(`
preise = {"Brot": 2.5, "Milch": 1.2}
schluessel = preise.keys()
print(schluessel)                    # dict_keys(['Brot', 'Milch'])
preise["Käse"] = 4.0
print(list(schluessel))              # ['Brot', 'Milch', 'Käse'] (View ist live)
print(schluessel & {"Milch", "Wein"})  # {'Milch'}

for name in list(preise):            # Kopie, damit Löschen erlaubt ist
    if preise[name] < 2:
        del preise[name]
print(preise)                        # {'Brot': 2.5, 'Käse': 4.0}
`),
    keywords: ['schlüssel', 'keys', 'view', 'ansicht', 'dict_keys', 'alle schlüssel'],
    related: ['dict.values()', 'dict.items()', 'Mengenoperationen'],
    mdn: D + 'stdtypes.html#dict.keys'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'dict.values()',
    desc: "Liefert eine dynamische Ansicht auf alle Werte.",
    details: "Wie `keys()` ist auch `values()` eine Live-Ansicht. Werte können doppelt vorkommen, daher gibt es hier keine Mengenoperationen. Praktisch mit `sum()`, `max()` oder `in`. Den Schlüssel zum größten Wert findet `max(d, key=d.get)`.",
    syntax: "d.values()",
    example: e(`
punkte = {"Ada": 90, "Linus": 75, "Grace": 88}
print(sum(punkte.values()))       # 253
print(max(punkte.values()))       # 90
print(90 in punkte.values())      # True
print(list(punkte.values()))      # [90, 75, 88]
print(max(punkte, key=punkte.get))  # Ada
`),
    keywords: ['werte', 'values', 'view', 'dict_values', 'alle werte', 'summe'],
    related: ['dict.keys()', 'dict.items()', 'sum()'],
    mdn: D + 'stdtypes.html#dict.values'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'dict.items()',
    desc: "Liefert eine Ansicht auf alle (Schlüssel, Wert)-Paare, ideal zum Iterieren.",
    details: "`for k, v in d.items()` ist die übliche Art, über ein Dictionary zu laufen. Die Paare sind Tupel und lassen sich direkt entpacken. Kombiniert mit `sorted()` sortiert man nach Werten, mit einer Dict Comprehension filtert oder invertiert man. Beim Invertieren gehen doppelte Werte verloren.",
    syntax: "for schlüssel, wert in d.items(): ...",
    example: e(`
preise = {"Brot": 2.5, "Milch": 1.2, "Käse": 4.0}
for name, preis in preise.items():
    print(f"{name}: {preis:.2f} €")
# Brot: 2.50 €
# Milch: 1.20 €
# Käse: 4.00 €

teuer = {k: v for k, v in preise.items() if v > 2}
print(teuer)                  # {'Brot': 2.5, 'Käse': 4.0}
nach_preis = sorted(preise.items(), key=lambda kv: kv[1])
print(nach_preis[0])          # ('Milch', 1.2)
`),
    keywords: ['paare', 'items', 'iterieren', 'schleife', 'key value', 'dict_items', 'durchlaufen'],
    related: ['dict.keys()', 'Dict Comprehension', 'sorted()'],
    mdn: D + 'stdtypes.html#dict.items'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'dict.setdefault()',
    desc: "Gibt den Wert zurück; fehlt der Schlüssel, wird er vorher mit dem Standard angelegt.",
    details: "`setdefault(k, v)` ist praktisch, um Listen in einem Dictionary zu gruppieren: `d.setdefault(k, []).append(x)`. Existiert der Schlüssel schon, bleibt sein Wert unverändert. Der Standardwert wird bei jedem Aufruf erzeugt, auch wenn er nicht gebraucht wird. In Schleifen ist `collections.defaultdict` oft klarer.",
    syntax: "d.setdefault(schlüssel, standard=None)",
    example: e(`
gruppen = {}
for name in ["Anna", "Ben", "Alex", "Bea", "Carl"]:
    gruppen.setdefault(name[0], []).append(name)
print(gruppen)   # {'A': ['Anna', 'Alex'], 'B': ['Ben', 'Bea'], 'C': ['Carl']}

cfg = {"farbe": "blau"}
print(cfg.setdefault("farbe", "rot"))   # blau
print(cfg.setdefault("größe", 12))      # 12
print(cfg)                              # {'farbe': 'blau', 'größe': 12}
`),
    keywords: ['standardwert setzen', 'gruppieren', 'default', 'anlegen wenn fehlt', 'group by'],
    related: ['collections.defaultdict', 'dict.get()', 'itertools.groupby()'],
    mdn: D + 'stdtypes.html#dict.setdefault'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'dict.update()',
    desc: "Übernimmt Einträge aus einem anderen Mapping oder Paaren und überschreibt vorhandene.",
    details: "`update()` verändert das Dictionary in place und gibt `None` zurück. Es akzeptiert ein Dictionary, ein Iterable von Paaren oder Schlüsselwortargumente. Bei gleichen Schlüsseln gewinnt der neue Wert, die Position des Schlüssels bleibt erhalten. Für ein neues, zusammengeführtes Dictionary ohne Änderung des Originals `a | b` verwenden.",
    syntax: "d.update(anderes)   d.update(schlüssel=wert)   d.update([(k, v), ...])",
    example: e(`
stil = {"farbe": "blau", "größe": 12}
stil.update({"größe": 14, "fett": True})
print(stil)        # {'farbe': 'blau', 'größe': 14, 'fett': True}

stil.update(farbe="rot")
stil.update([("kursiv", False)])
print(stil)        # {'farbe': 'rot', 'größe': 14, 'fett': True, 'kursiv': False}
print(stil.update({}))   # None
`),
    keywords: ['zusammenführen', 'merge', 'aktualisieren', 'überschreiben', 'kombinieren'],
    related: ['Dict-Merge (| und |=)', 'dict.setdefault()', 'Unpacking in Literalen'],
    mdn: D + 'stdtypes.html#dict.update'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'dict.pop()',
    desc: "Entfernt einen Schlüssel und gibt seinen Wert zurück, optional mit Standardwert.",
    details: "Ohne Standardwert wirft `pop()` einen `KeyError`, wenn der Schlüssel fehlt; mit Standardwert wird dieser zurückgegeben und nichts geändert. So lässt sich ein Eintrag gleichzeitig auslesen und entfernen. `popitem()` entfernt stattdessen das zuletzt eingefügte Paar.",
    syntax: "d.pop(schlüssel[, standard])",
    example: e(`
sitzung = {"user": "ada", "token": "abc", "theme": "dunkel"}
token = sitzung.pop("token")
print(token)                       # abc
print(sitzung.pop("fehlt", None))  # None
print(sitzung)                     # {'user': 'ada', 'theme': 'dunkel'}

try:
    sitzung.pop("fehlt")
except KeyError as err:
    print("KeyError:", err)        # KeyError: 'fehlt'
`),
    keywords: ['entfernen', 'löschen', 'herausnehmen', 'remove key', 'pop'],
    related: ['dict.popitem()', 'dict-Zugriff', 'list.pop()'],
    mdn: D + 'stdtypes.html#dict.pop'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'dict.popitem()',
    desc: "Entfernt das zuletzt eingefügte (Schlüssel, Wert)-Paar und gibt es zurück.",
    details: "`popitem()` arbeitet nach dem LIFO-Prinzip und ist damit vorhersagbar, seit Dictionaries ihre Reihenfolge behalten. Bei leerem Dictionary gibt es einen `KeyError`. Ein FIFO-Verhalten (ältester Eintrag zuerst) bietet `OrderedDict.popitem(last=False)`.",
    syntax: "schlüssel, wert = d.popitem()",
    example: e(`
d = {"a": 1, "b": 2, "c": 3}
print(d.popitem())       # ('c', 3)
print(d)                 # {'a': 1, 'b': 2}

while d:
    k, v = d.popitem()
    print(k, v)          # b 2, dann a 1

try:
    d.popitem()
except KeyError as err:
    print(err)           # 'popitem(): dictionary is empty'
`),
    keywords: ['letztes element', 'popitem', 'lifo', 'entfernen', 'paar'],
    related: ['dict.pop()', 'collections.OrderedDict', 'Dict-Reihenfolge'],
    mdn: D + 'stdtypes.html#dict.popitem'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'dict.fromkeys()',
    desc: "Erzeugt ein neues Dictionary mit den angegebenen Schlüsseln und einem gemeinsamen Wert.",
    details: "`dict.fromkeys(schlüssel, wert)` ist eine Klassenmethode, der Standardwert ist `None`. Ein beliebter Trick: `list(dict.fromkeys(liste))` entfernt Duplikate und behält die Reihenfolge. Fallstrick: Alle Schlüssel teilen sich dasselbe Wertobjekt, bei Listen als Wert also dieselbe Liste – dann eine Dict Comprehension verwenden.",
    syntax: "dict.fromkeys(iterable, wert=None)",
    example: e(`
felder = ["name", "email", "alter"]
print(dict.fromkeys(felder))       # {'name': None, 'email': None, 'alter': None}
print(dict.fromkeys("abc", 0))     # {'a': 0, 'b': 0, 'c': 0}

# Duplikate entfernen, Reihenfolge erhalten
print(list(dict.fromkeys([3, 1, 3, 2, 1])))  # [3, 1, 2]

# Fallstrick: veränderlicher Startwert wird geteilt
geteilt = dict.fromkeys(["x", "y"], [])
geteilt["x"].append(1)
print(geteilt)                     # {'x': [1], 'y': [1]}
`),
    keywords: ['fromkeys', 'initialisieren', 'duplikate entfernen', 'deduplizieren', 'reihenfolge erhalten'],
    related: ['Dict Comprehension', 'Listen-Fallstrick [[]] * n', 'set'],
    mdn: D + 'stdtypes.html#dict.fromkeys'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'Dict-Merge (| und |=)',
    desc: "a | b erzeugt ein zusammengeführtes Dictionary, a |= b aktualisiert a.",
    details: "Seit Python 3.9 verbindet `|` zwei Dictionaries zu einem neuen; bei gleichen Schlüsseln gewinnt der rechte Wert. `|=` entspricht `update()` und verändert das linke Dictionary. Die Reihenfolge folgt dem linken Operanden, neue Schlüssel kommen hinten dazu. Ältere Alternative: `{**a, **b}`.",
    syntax: "neu = a | b\na |= b",
    example: e(`
standard = {"farbe": "blau", "größe": 12}
nutzer = {"größe": 14}
print(standard | nutzer)      # {'farbe': 'blau', 'größe': 14}
print(nutzer | standard)      # {'größe': 12, 'farbe': 'blau'}

standard |= {"fett": True}
print(standard)               # {'farbe': 'blau', 'größe': 12, 'fett': True}
print({**nutzer, "neu": 1})   # {'größe': 14, 'neu': 1}
`),
    tip: "Für Einstellungen gilt „Standard | Benutzer“: Die rechte Seite überschreibt die linke.",
    keywords: ['merge', 'zusammenführen', 'vereinigen', 'pipe operator', 'dict union', 'kombinieren', '|='],
    related: ['dict.update()', 'Unpacking in Literalen', 'collections.ChainMap'],
    mdn: D + 'stdtypes.html#mapping-types-dict'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'Dict-Reihenfolge',
    desc: "Dictionaries behalten die Einfügereihenfolge seit Python 3.7 garantiert bei.",
    details: "Beim Iterieren erscheinen Schlüssel in der Reihenfolge, in der sie zuerst eingefügt wurden. Überschreiben eines Werts ändert die Position nicht, Löschen und neu Einfügen schiebt den Schlüssel ans Ende. Für den Gleichheitsvergleich spielt die Reihenfolge keine Rolle. Ein sortiertes Dictionary erhält man mit `dict(sorted(d.items()))`.",
    example: e(`
d = {}
d["z"] = 1
d["a"] = 2
d["m"] = 3
print(list(d))            # ['z', 'a', 'm']
d["z"] = 99               # Überschreiben behält die Position
print(list(d))            # ['z', 'a', 'm']

del d["z"]
d["z"] = 1                # neu eingefügt: ans Ende
print(list(d))            # ['a', 'm', 'z']
print({"a": 1, "b": 2} == {"b": 2, "a": 1})  # True
print(dict(sorted(d.items())))   # {'a': 2, 'm': 3, 'z': 1}
`),
    keywords: ['reihenfolge', 'ordnung', 'insertion order', 'sortiert', 'geordnet', 'ordered'],
    related: ['collections.OrderedDict', 'dict.items()', 'sorted()'],
    mdn: D + 'stdtypes.html#mapping-types-dict'
  },
  {
    lang: 'py', group: 'Dictionaries', name: 'Gültige Schlüssel (hashbar)',
    desc: "Dictionary-Schlüssel und Set-Elemente müssen hashbar sein, also praktisch unveränderlich.",
    details: "Hashbar sind `int`, `float`, `str`, `bytes`, `bool`, `None`, `frozenset` und Tupel aus hashbaren Elementen. Listen, Dictionaries und Sets sind nicht hashbar und lösen einen `TypeError` aus. Gleich große Zahlen gelten als derselbe Schlüssel: `1`, `1.0` und `True` landen auf demselben Eintrag. Eigene Klassen sind standardmäßig über ihre Identität hashbar; wer `__eq__` überschreibt, muss auch `__hash__` definieren.",
    example: e(`
d = {}
d[1] = "int"
d["eins"] = "str"
d[(1, 2)] = "tuple"
d[frozenset({1})] = "frozenset"

try:
    d[[1, 2]] = "list"
except TypeError as err:
    print(err)  # cannot use 'list' as a dict key (unhashable type: 'list')

print(d[1.0])            # int (1 == 1.0, gleicher Hash)
d[True] = "bool"
print(d[1])              # bool (True == 1 überschreibt!)
print(len(d))            # 4
`),
    tip: "Listen als Schlüssel vorher mit `tuple(liste)` umwandeln, Sets mit `frozenset(menge)`.",
    keywords: ['hashbar', 'hashable', 'unhashable', 'schlüssel', 'key', 'typeerror', 'hash'],
    related: ['hash()', '__eq__ & __hash__', 'frozenset', 'Tupel vs. Liste'],
    mdn: G + '#term-hashable'
  },

  // ---------------- Sets ----------------
  {
    lang: 'py', group: 'Sets', name: 'set',
    desc: "Veränderliche, ungeordnete Menge ohne Duplikate mit schnellem Enthaltensein-Test.",
    details: "Sets speichern jedes Element nur einmal, `x in s` ist im Mittel O(1). Elemente müssen hashbar sein, die Reihenfolge ist nicht festgelegt. Ein leeres Set erzeugt man mit `set()`, denn `{}` ist ein leeres Dictionary. Typische Einsätze: Duplikate entfernen, Mitgliedschaft prüfen, Mengenoperationen.",
    syntax: "{a, b, c}   set()   set(iterable)   {x for x in ...}",
    example: e(`
farben = {"rot", "grün", "rot"}
print(len(farben))           # 2
print("rot" in farben)       # True

leer = set()                 # {} wäre ein leeres dict!
print(type({}).__name__, type(leer).__name__)  # dict set

zahlen = set([3, 1, 3, 2])
print(sorted(zahlen))        # [1, 2, 3]
print(sorted(set("hallo")))  # ['a', 'h', 'l', 'o']
`),
    tip: "Sets sind ungeordnet: Für eine stabile Ausgabe `sorted(menge)` verwenden; Duplikate mit erhaltener Reihenfolge entfernt `dict.fromkeys()`.",
    keywords: ['menge', 'set', 'eindeutig', 'unique', 'duplikate', 'ohne doppelte', 'hashset'],
    related: ['Mengenoperationen', 'frozenset', 'Set Comprehension', 'set.add()'],
    mdn: D + 'stdtypes.html#set-types-set-frozenset'
  },
  {
    lang: 'py', group: 'Sets', name: 'set.add()',
    desc: "Fügt ein einzelnes Element zur Menge hinzu; Duplikate werden ignoriert.",
    details: "Ist das Element schon enthalten, passiert nichts, es gibt keinen Fehler. `add()` nimmt genau ein Element: Ein Tupel wird als ein Element eingefügt, eine Liste löst einen `TypeError` aus. Mehrere Elemente auf einmal fügt `update()` hinzu.",
    syntax: "s.add(element)",
    example: e(`
gesehen = set()
for wort in ["a", "b", "a", "c", "b"]:
    if wort in gesehen:
        print("Doppelt:", wort)     # Doppelt: a, dann Doppelt: b
    gesehen.add(wort)

print(sorted(gesehen))   # ['a', 'b', 'c']
gesehen.add("a")         # kein Fehler, keine Änderung
gesehen.add((1, 2))      # Tupel als ein Element
print(len(gesehen))      # 4
`),
    keywords: ['hinzufügen', 'einfügen', 'add', 'element', 'menge erweitern'],
    related: ['set.update()', 'set.discard()', 'set'],
    mdn: D + 'stdtypes.html#frozenset.add'
  },
  {
    lang: 'py', group: 'Sets', name: 'set.update()',
    desc: "Fügt alle Elemente aus einem oder mehreren Iterables zur Menge hinzu.",
    details: "`update()` verändert die Menge in place und nimmt beliebig viele Iterables. `s |= t` ist die Operator-Form, verlangt aber ein Set auf der rechten Seite. Ein String als Argument wird zeichenweise hinzugefügt – ein häufiger Fehler, wenn man ein einzelnes Wort ergänzen wollte.",
    syntax: "s.update(iterable, ...)\ns |= anderes_set",
    example: e(`
tags = {"python"}
tags.update(["web", "api"], {"python", "cli"})
print(sorted(tags))   # ['api', 'cli', 'python', 'web']

tags.update("ab")     # Fallstrick: einzelne Zeichen
print(sorted(tags))   # ['a', 'api', 'b', 'cli', 'python', 'web']

tags |= {"neu"}
print(len(tags))      # 7
`),
    keywords: ['hinzufügen', 'mehrere', 'vereinigen', 'union in place', 'update', '|='],
    related: ['set.add()', 'Mengenoperationen', 'list.extend()'],
    mdn: D + 'stdtypes.html#frozenset.update'
  },
  {
    lang: 'py', group: 'Sets', name: 'set.discard()',
    desc: "Entfernt ein Element, falls vorhanden – ohne Fehler, wenn es fehlt.",
    details: "`discard()` ist die nachsichtige Variante zum Entfernen: Fehlt das Element, passiert nichts. `remove()` wirft in diesem Fall einen `KeyError`, was gewollt sein kann, wenn das Element sicher enthalten sein muss. Beide geben `None` zurück.",
    syntax: "s.discard(element)",
    example: e(`
aktiv = {"ada", "linus", "grace"}
aktiv.discard("linus")
aktiv.discard("niemand")     # kein Fehler
print(sorted(aktiv))         # ['ada', 'grace']
`),
    keywords: ['entfernen', 'löschen', 'discard', 'ohne fehler', 'remove'],
    related: ['set.remove()', 'set.add()', 'list.remove()'],
    mdn: D + 'stdtypes.html#frozenset.discard'
  },
  {
    lang: 'py', group: 'Sets', name: 'set.remove()',
    desc: "Entfernt ein Element und wirft KeyError, wenn es nicht enthalten ist.",
    details: "`remove()` eignet sich, wenn ein fehlendes Element ein Fehler im Programm wäre. `pop()` entfernt ein beliebiges Element und gibt es zurück, welches ist nicht festgelegt; bei leerer Menge gibt es einen `KeyError`. `clear()` leert die Menge vollständig.",
    syntax: "s.remove(element)   s.pop()   s.clear()",
    example: e(`
s = {"a", "b"}
s.remove("a")
print(s)                     # {'b'}

try:
    s.remove("x")
except KeyError as err:
    print("KeyError:", err)  # KeyError: 'x'

print(s.pop())               # b (beliebiges Element)
print(s)                     # set()
`),
    keywords: ['entfernen', 'remove', 'keyerror', 'pop', 'clear', 'löschen'],
    related: ['set.discard()', 'set', 'dict.pop()'],
    mdn: D + 'stdtypes.html#frozenset.remove'
  },
  {
    lang: 'py', group: 'Sets', name: 'Mengenoperationen',
    desc: "Vereinigung |, Schnittmenge &, Differenz - und symmetrische Differenz ^.",
    details: "Die Operatoren verlangen auf beiden Seiten Sets bzw. frozensets; die Methoden `union()`, `intersection()`, `difference()` und `symmetric_difference()` akzeptieren beliebige Iterables. Die Varianten `|=`, `&=`, `-=` und `^=` verändern die linke Menge. `isdisjoint()` prüft, ob es keine gemeinsamen Elemente gibt.",
    values: [
      ['a | b', 'Vereinigung: in a oder b (union)'],
      ['a & b', 'Schnittmenge: in a und b (intersection)'],
      ['a - b', 'Differenz: in a, nicht in b (difference)'],
      ['a ^ b', 'Symmetrische Differenz: in genau einer (symmetric_difference)'],
      ['a.isdisjoint(b)', 'Keine gemeinsamen Elemente'],
      ['a <= b / a < b', 'Teilmenge / echte Teilmenge']
    ],
    example: e(`
a = {1, 2, 3, 4}
b = {3, 4, 5}
print(a | b)              # {1, 2, 3, 4, 5}
print(a & b)              # {3, 4}
print(a - b)              # {1, 2}
print(a ^ b)              # {1, 2, 5}
print(a.union([5, 6]))    # {1, 2, 3, 4, 5, 6}

a &= {1, 2}
print(a)                  # {1, 2}
print(a.isdisjoint(b))    # True
`),
    tip: "Gemeinsame Elemente zweier Listen: `set(liste1) & set(liste2)` – deutlich schneller als verschachtelte Schleifen.",
    keywords: ['vereinigung', 'schnittmenge', 'differenz', 'union', 'intersection', 'difference', 'symmetrische differenz', 'mengenlehre'],
    related: ['set', 'set.issubset()', 'frozenset'],
    mdn: D + 'stdtypes.html#set-types-set-frozenset'
  },
  {
    lang: 'py', group: 'Sets', name: 'frozenset',
    desc: "Unveränderliche Menge, hashbar und damit als Dictionary-Schlüssel oder Set-Element nutzbar.",
    details: "`frozenset` bietet alle lesenden Operationen von `set`, aber keine Methoden wie `add()` oder `remove()`. Weil es hashbar ist, kann es Element eines anderen Sets oder Schlüssel eines Dictionaries sein, etwa für ungerichtete Kanten in Graphen. Mengenoperationen liefern wieder ein `frozenset`, wenn der linke Operand eines ist.",
    syntax: "frozenset(iterable)",
    example: e(`
f = frozenset([1, 2, 3])
print(2 in f)                  # True

try:
    f.add(4)
except AttributeError as err:
    print(err)                 # 'frozenset' object has no attribute 'add'

kanten = {frozenset({"A", "B"}): 5}
print(kanten[frozenset({"B", "A"})])  # 5 (Reihenfolge egal)
print(f | {4})                 # frozenset({1, 2, 3, 4})
`),
    keywords: ['unveränderliche menge', 'immutable set', 'frozenset', 'hashbar', 'set als schlüssel'],
    related: ['set', 'Gültige Schlüssel (hashbar)', 'tuple'],
    mdn: D + 'stdtypes.html#frozenset'
  },
  {
    lang: 'py', group: 'Sets', name: 'set.issubset()',
    desc: "Prüft, ob alle Elemente einer Menge in einer anderen enthalten sind (<=).",
    details: "`a.issubset(b)` bzw. `a <= b` ist wahr, wenn jedes Element von `a` in `b` liegt; `a < b` verlangt zusätzlich, dass `b` mehr Elemente hat (echte Teilmenge). `issuperset()` bzw. `>=` prüft die umgekehrte Richtung. Die Methoden akzeptieren beliebige Iterables, die Operatoren nur Sets.",
    syntax: "a.issubset(b)   a <= b   a < b\na.issuperset(b)   a >= b   a > b",
    example: e(`
pflicht = {"name", "email"}
formular = {"name", "email", "alter"}
print(pflicht.issubset(formular))    # True
print(pflicht <= formular)           # True
print(pflicht < formular)            # True (echte Teilmenge)
print(formular.issuperset(pflicht))  # True
print(pflicht <= pflicht, pflicht < pflicht)  # True False

fehlend = pflicht - {"name"}
print(fehlend)                       # {'email'}
`),
    tip: "Pflichtfelder prüfen: `if not pflicht <= daten.keys(): ...` – Dictionary-Views verhalten sich hier wie Sets.",
    keywords: ['teilmenge', 'subset', 'superset', 'obermenge', 'enthalten', 'alle enthalten'],
    related: ['Mengenoperationen', 'set', 'dict.keys()'],
    mdn: D + 'stdtypes.html#frozenset.issubset'
  },

  // ---------------- collections ----------------
  {
    lang: 'py', group: 'collections', name: 'collections.Counter',
    desc: "Dictionary zum Zählen: zählt Elemente eines Iterables und liefert die häufigsten.",
    details: "`Counter(iterable)` zählt jedes Element; fehlende Schlüssel liefern 0 statt `KeyError`. `most_common(n)` gibt die n häufigsten Paare zurück, bei Gleichstand in Reihenfolge des ersten Auftretens. Counter lassen sich addieren und subtrahieren, wobei Ergebnisse ≤ 0 verschwinden. `update()` zählt hinzu, statt zu überschreiben, `total()` liefert die Summe aller Zählwerte.",
    syntax: "Counter(iterable)   Counter(a=3, b=1)",
    values: [
      ['most_common(n)', 'Die n häufigsten (Element, Anzahl)-Paare'],
      ['update(it)', 'Vorkommen hinzuzählen'],
      ['subtract(it)', 'Vorkommen abziehen (auch negativ)'],
      ['total()', 'Summe aller Zählwerte'],
      ['elements()', 'Iterator, jedes Element so oft wie gezählt'],
      ['c1 + c2 / c1 - c2', 'Zählwerte addieren / abziehen']
    ],
    example: e(`
from collections import Counter

woerter = "der hund und der ball und der hund".split()
c = Counter(woerter)
print(c.most_common(2))     # [('der', 3), ('hund', 2)]
print(c["katze"])           # 0
c.update(["katze"])
print(c["katze"])           # 1
print(c.total())            # 9

print(Counter("banane"))    # Counter({'a': 2, 'n': 2, 'b': 1, 'e': 1})
print(Counter(a=3, b=1) - Counter(a=1, b=2))  # Counter({'a': 2})
`),
    keywords: ['zählen', 'häufigkeit', 'counter', 'most common', 'histogramm', 'frequenz', 'wörter zählen'],
    related: ['collections.defaultdict', 'str.count()', 'dict.get()'],
    mdn: D + 'collections.html#collections.Counter'
  },
  {
    lang: 'py', group: 'collections', name: 'collections.defaultdict',
    desc: "Dictionary, das fehlende Schlüssel automatisch mit einem Standardwert anlegt.",
    details: "Der Konstruktor bekommt eine Fabrikfunktion ohne Argumente, z. B. `list`, `int` oder `set`. Beim Zugriff auf einen fehlenden Schlüssel wird ihr Ergebnis eingetragen und zurückgegeben. Achtung: Schon das reine Lesen legt den Schlüssel an; `in` und `get()` tun das nicht. Für die Ausgabe oder JSON mit `dict(dd)` in ein normales Dictionary umwandeln.",
    syntax: "defaultdict(fabrik)   # z. B. list, int, set, lambda: \"?\"",
    example: e(`
from collections import defaultdict

nach_laenge = defaultdict(list)
for w in ["Hut", "Haus", "Ball", "Ei"]:
    nach_laenge[len(w)].append(w)
print(dict(nach_laenge))   # {3: ['Hut'], 4: ['Haus', 'Ball'], 2: ['Ei']}

zaehler = defaultdict(int)
for z in "abca":
    zaehler[z] += 1
print(dict(zaehler))       # {'a': 2, 'b': 1, 'c': 1}

print("x" in zaehler)      # False
zaehler["x"]               # Lesen legt den Schlüssel an!
print("x" in zaehler)      # True
`),
    keywords: ['standardwert', 'default', 'gruppieren', 'automatisch anlegen', 'defaultdict', 'group by'],
    related: ['dict.setdefault()', 'collections.Counter', 'dict.get()'],
    mdn: D + 'collections.html#collections.defaultdict'
  },
  {
    lang: 'py', group: 'collections', name: 'collections.deque',
    desc: "Doppelseitige Warteschlange mit schnellem Einfügen und Entnehmen an beiden Enden.",
    details: "`append`/`pop` und `appendleft`/`popleft` sind bei `deque` alle O(1), bei Listen ist das Arbeiten am Anfang O(n). Mit `maxlen` entsteht ein Ringpuffer, der beim Anhängen automatisch das älteste Element verwirft. `rotate(n)` verschiebt die Elemente zyklisch. Indexzugriff in der Mitte ist langsamer als bei Listen.",
    syntax: "deque(iterable=(), maxlen=None)",
    values: [
      ['append(x) / appendleft(x)', 'Rechts / links anhängen'],
      ['pop() / popleft()', 'Rechts / links entnehmen'],
      ['extend(it) / extendleft(it)', 'Mehrere anhängen'],
      ['rotate(n)', 'Um n Stellen nach rechts drehen'],
      ['maxlen', 'Maximale Länge (Ringpuffer)']
    ],
    example: e(`
from collections import deque

q = deque(["a", "b"])
q.append("c")
q.appendleft("z")
print(q)              # deque(['z', 'a', 'b', 'c'])
print(q.popleft())    # z
print(q.pop())        # c

letzte = deque(maxlen=3)
for i in range(6):
    letzte.append(i)
print(list(letzte))   # [3, 4, 5]

r = deque([1, 2, 3, 4])
r.rotate(1)
print(list(r))        # [4, 1, 2, 3]
`),
    tip: "Für Breitensuche (BFS) und FIFO-Warteschlangen immer `deque.popleft()` statt `list.pop(0)` verwenden.",
    keywords: ['warteschlange', 'queue', 'fifo', 'ringpuffer', 'double-ended queue', 'deque', 'popleft', 'bfs'],
    related: ['Listen als Stack', 'list.pop()', 'queue.Queue'],
    mdn: D + 'collections.html#collections.deque'
  },
  {
    lang: 'py', group: 'collections', name: 'collections.OrderedDict',
    desc: "Dictionary mit Methoden zum Umsortieren; Vergleich beachtet die Reihenfolge.",
    details: "Seit normale Dictionaries die Reihenfolge behalten, braucht man `OrderedDict` nur noch für Spezialfälle. `move_to_end(k)` schiebt einen Schlüssel ans Ende (oder mit `last=False` an den Anfang), `popitem(last=False)` entnimmt den ältesten Eintrag. Anders als bei `dict` sind zwei `OrderedDict` mit gleichen Paaren in anderer Reihenfolge ungleich. Damit lässt sich etwa ein einfacher LRU-Cache bauen.",
    syntax: "OrderedDict(...)   od.move_to_end(k, last=True)   od.popitem(last=True)",
    example: e(`
from collections import OrderedDict

od = OrderedDict(a=1, b=2, c=3)
od.move_to_end("a")
print(list(od))                     # ['b', 'c', 'a']
print(od.popitem(last=False))       # ('b', 2)
print(OrderedDict(a=1, b=2) == OrderedDict(b=2, a=1))  # False
print(dict(a=1, b=2) == dict(b=2, a=1))                # True

cache = OrderedDict()               # LRU-Skizze mit 2 Plätzen
for key in ["x", "y", "x", "z"]:
    cache[key] = True
    cache.move_to_end(key)
    if len(cache) > 2:
        cache.popitem(last=False)   # ältesten verwerfen
print(list(cache))                  # ['x', 'z']
`),
    tip: "Für Funktions-Caches gibt es fertig `@functools.lru_cache`.",
    keywords: ['geordnet', 'ordered dict', 'reihenfolge', 'move_to_end', 'lru', 'cache'],
    related: ['Dict-Reihenfolge', 'dict.popitem()', '@functools.lru_cache'],
    mdn: D + 'collections.html#collections.OrderedDict'
  },
  {
    lang: 'py', group: 'collections', name: 'collections.ChainMap',
    desc: "Fasst mehrere Dictionaries zu einer Sicht zusammen; die Suche läuft der Reihe nach.",
    details: "Beim Lesen wird der Schlüssel in der ersten Map gesucht, dann in der zweiten usw. – ideal für Konfiguration mit Ebenen wie Kommandozeile, Umgebung, Standard. Schreiben und Löschen wirken nur auf die erste Map. Es wird nichts kopiert, Änderungen an den einzelnen Dictionaries sind sofort sichtbar. `new_child()` legt eine neue Ebene vorne an, etwa für verschachtelte Gültigkeitsbereiche.",
    syntax: "ChainMap(erste, zweite, ...)",
    example: e(`
from collections import ChainMap

standard = {"farbe": "blau", "debug": False}
umgebung = {"debug": True}
cli = {"farbe": "rot"}

config = ChainMap(cli, umgebung, standard)
print(config["farbe"], config["debug"])  # rot True

config["neu"] = 1                 # schreibt in die erste Map
print(cli)                        # {'farbe': 'rot', 'neu': 1}
print(sorted(config))             # ['debug', 'farbe', 'neu']

kind = config.new_child({"farbe": "grün"})
print(kind["farbe"], config["farbe"])    # grün rot
`),
    keywords: ['chainmap', 'konfiguration', 'ebenen', 'fallback', 'mehrere dicts', 'scope', 'layer'],
    related: ['Dict-Merge (| und |=)', 'dict.update()', 'os.environ'],
    mdn: D + 'collections.html#collections.ChainMap'
  },

  // ---------------- Sequenzen allgemein ----------------
  {
    lang: 'py', group: 'Sequenzen allgemein', name: 'Sequenz-Operationen',
    desc: "Gemeinsame Operationen aller Sequenzen: Index, Slice, len, in, +, *, min, max.",
    details: "Listen, Tupel, Strings, `range`, `bytes` und `bytearray` unterstützen dieselben Grundoperationen. `+` verkettet, `*` wiederholt, `in` prüft Enthaltensein (bei Strings auch Teilstrings). `index()` und `count()` gibt es überall. Verketten mit `+` erzeugt jedes Mal ein neues Objekt; in Schleifen ist das bei großen Sequenzen langsam.",
    values: [
      ['x in s / x not in s', 'Enthaltensein'],
      ['s + t', 'Verketten'],
      ['s * n', 'n-mal wiederholen'],
      ['s[i] / s[i:j:k]', 'Index / Slice'],
      ['len(s)', 'Länge'],
      ['min(s) / max(s)', 'Kleinstes / größtes Element'],
      ['s.index(x) / s.count(x)', 'Position / Anzahl']
    ],
    example: e(`
for seq in ([1, 2, 3], (1, 2, 3), "abc", range(1, 4)):
    print(type(seq).__name__, len(seq), seq[0], seq[-1], seq[1:])
# list 3 1 3 [2, 3]
# tuple 3 1 3 (2, 3)
# str 3 a c bc
# range 3 1 3 range(2, 4)

print([0] * 3 + [1])                  # [0, 0, 0, 1]
print("ab" * 2)                       # abab
print(min("hallo"), max((4, 9, 2)))   # a 9
print((1, 2, 2).count(2), "abc".index("c"))  # 2 2
`),
    keywords: ['sequenz', 'sequence', 'gemeinsame operationen', 'verketten', 'wiederholen', 'contains'],
    related: ['len()', 'Slicing', 'in / not in', 'min() / max()'],
    mdn: D + 'stdtypes.html#common-sequence-operations'
  },
  {
    lang: 'py', group: 'Sequenzen allgemein', name: 'len()',
    desc: "Liefert die Anzahl der Elemente eines Containers (Sequenz, dict, set …).",
    details: "`len()` funktioniert für alle Objekte mit `__len__`: Strings (Anzahl Zeichen), Listen, Tupel, Dictionaries (Anzahl Schlüssel), Sets, `range` und `bytes`. Bei Strings zählen Unicode-Zeichen, nicht Bytes. Generatoren und Iteratoren haben keine Länge, dafür `sum(1 for _ in it)` oder vorher `list()`. Für „ist leer?“ ist `if not liste:` idiomatischer als `if len(liste) == 0:`.",
    syntax: "len(objekt)",
    example: e(`
print(len("Grüße"))           # 5
print(len([1, [2, 3]]))       # 2
print(len({"a": 1, "b": 2}))  # 2
print(len(range(0, 10, 3)))   # 4
print(len("😀"), len("😀".encode()))  # 1 4

class Warteschlange:
    def __init__(self):
        self.items = [1, 2]
    def __len__(self):
        return len(self.items)

print(len(Warteschlange()))   # 2
liste = []
if not liste:
    print("leer")             # leer
`),
    keywords: ['länge', 'anzahl', 'größe', 'length', 'size', 'count', '__len__', 'elemente zählen'],
    related: ['Sequenz-Operationen', 'Truthiness', 'Container-Protokoll (__len__, __getitem__, __contains__)'],
    mdn: D + 'functions.html#len'
  },
  {
    lang: 'py', group: 'Sequenzen allgemein', name: 'bytearray',
    desc: "Veränderliche Folge von Bytes (0–255), das Gegenstück zum unveränderlichen bytes.",
    details: "`bytearray` hat die Methoden von `bytes` und zusätzlich die von Listen wie `append()`, `extend()` und Indexzuweisung. Einzelne Elemente sind Ganzzahlen zwischen 0 und 255. Praktisch als Puffer beim Zusammenbauen von Binärdaten oder für Netzwerkprotokolle. Mit `bytes(ba)` erhält man eine unveränderliche Kopie, mit `decode()` Text.",
    syntax: "bytearray(b\"...\")   bytearray(n)   bytearray(text, encoding)   bytearray(iterable_of_ints)",
    example: e(`
puffer = bytearray(b"hallo")
puffer[0] = ord("H")
print(puffer)                 # bytearray(b'Hallo')
puffer.extend(b" Welt")
print(puffer.decode())        # Hallo Welt
print(bytes(puffer))          # b'Hallo Welt'

print(bytearray(3))           # bytearray(b'\\x00\\x00\\x00')
print(list(bytearray("ä", "utf-8")))  # [195, 164]
`),
    keywords: ['bytes', 'binär', 'puffer', 'buffer', 'veränderliche bytes', 'mutable bytes', 'binärdaten'],
    related: ['bytes', 'str.encode()', 'memoryview'],
    mdn: D + 'stdtypes.html#bytearray-objects'
  },
  {
    lang: 'py', group: 'Sequenzen allgemein', name: 'memoryview',
    desc: "Zugriff auf den Speicher von bytes/bytearray ohne Kopie, auch für Teilbereiche.",
    details: "Ein Slice von `bytes` oder `bytearray` kopiert die Daten, ein Slice einer `memoryview` nicht. Änderungen über eine `memoryview` auf ein `bytearray` wirken direkt auf das Original. Nützlich bei großen Binärdaten, etwa beim Verarbeiten von Dateien in Blöcken. Ist das zugrunde liegende Objekt unveränderlich (`bytes`), ist auch die View schreibgeschützt.",
    syntax: "memoryview(objekt)",
    example: e(`
daten = bytearray(b"ABCDEF")
mv = memoryview(daten)
teil = mv[2:4]               # keine Kopie
teil[0] = ord("x")
print(daten)                 # bytearray(b'ABxDEF')
print(teil.tobytes())        # b'xD'
print(mv.nbytes, mv.readonly)          # 6 False
print(memoryview(b"abc").readonly)     # True
`),
    keywords: ['memoryview', 'puffer', 'ohne kopie', 'zero copy', 'buffer protocol', 'binär'],
    related: ['bytearray', 'bytes', 'array'],
    mdn: D + 'stdtypes.html#memoryview'
  },
  {
    lang: 'py', group: 'Sequenzen allgemein', name: 'array',
    desc: "Kompakte Sequenz gleichartiger Zahlen mit festem C-Typ (Modul array).",
    details: "`array.array(typcode, ...)` speichert Zahlen eines Typs platzsparend direkt im Speicher, statt wie eine Liste Verweise auf Python-Objekte zu halten. Der Typcode legt den Datentyp fest, z. B. `\"i\"` für int, `\"d\"` für double. Werte vom falschen Typ lösen einen `TypeError` aus. Für Rechnen mit großen Zahlenmengen ist NumPy die übliche Wahl, `array` genügt für einfache Puffer und Binärformate.",
    syntax: "from array import array\narray(typcode, iterable)",
    values: [
      ['\"b\" / \"B\"', 'signed / unsigned char (1 Byte)'],
      ['\"i\" / \"I\"', 'signed / unsigned int (meist 4 Bytes)'],
      ['\"q\" / \"Q\"', 'signed / unsigned long long (8 Bytes)'],
      ['\"f\"', 'float (4 Bytes)'],
      ['\"d\"', 'double (8 Bytes)']
    ],
    example: e(`
from array import array

werte = array("d", [1.5, 2.5])
werte.append(3.0)
print(werte)                    # array('d', [1.5, 2.5, 3.0])
print(sum(werte))               # 7.0

ganz = array("i", range(5))
print(ganz[1:3])                # array('i', [1, 2])
print(werte.itemsize, ganz.itemsize)  # 8 4
print(len(ganz.tobytes()))      # 20

try:
    ganz.append(1.5)
except TypeError as err:
    print(err)  # 'float' object cannot be interpreted as an integer
`),
    keywords: ['array','typisiertes array', 'kompakt', 'typecode', 'zahlenfeld', 'speicher sparen'],
    related: ['list', 'bytearray', 'memoryview'],
    mdn: D + 'array.html'
  },
  {
    lang: 'py', group: 'Sequenzen allgemein', name: 'Unpacking in Literalen',
    desc: "Mit * und ** Iterables bzw. Dictionaries direkt in Listen, Tupel, Sets und Dicts entpacken.",
    details: "`[*a, *b]` baut eine neue Liste aus den Elementen von `a` und `b`, das funktioniert mit beliebigen Iterables und mischt sich mit einzelnen Werten. `{**a, **b}` führt Dictionaries zusammen, bei gleichen Schlüsseln gewinnt der spätere. So entstehen immer neue Objekte, die Originale bleiben unverändert. Für Dictionaries ist `a | b` seit Python 3.9 die lesbarere Alternative.",
    syntax: "[*a, *b]   (*a, x)   {*a, *b}   {**a, **b, \"k\": v}",
    example: e(`
a = [1, 2]
b = (3, 4)
print([*a, *b, 5])           # [1, 2, 3, 4, 5]
print((*a, *"xy"))           # (1, 2, 'x', 'y')
print({*a, *b, 1})           # {1, 2, 3, 4}

basis = {"host": "localhost", "port": 80}
print({**basis, "port": 8080})  # {'host': 'localhost', 'port': 8080}

erster, *rest = [*a, *b]
print(erster, rest)          # 1 [2, 3, 4]
`),
    keywords: ['entpacken', 'unpacking', 'spread', 'stern', 'sternchen', 'splat', 'pep 448', 'zusammenführen'],
    related: ['Stern-Entpacken', 'Dict-Merge (| und |=)', 'list.extend()', 'Argumente entpacken'],
    mdn: R + 'expressions.html#list-displays'
  }
  );
})();
