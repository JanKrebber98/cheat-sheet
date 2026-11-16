window.CHEAT = window.CHEAT || [];
(function () {
  var D = 'https://docs.python.org/3/library/';   // + z. B. 'stdtypes.html#str.split'
  var R = 'https://docs.python.org/3/reference/'; // Sprachreferenz
  var T = 'https://docs.python.org/3/tutorial/';  // Tutorial
  var F = D + 'functions.html#';                   // eingebaute Funktionen
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Eingebaute Funktionen ----------------
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'enumerate()',
    desc: "Liefert beim Iterieren Paare aus laufendem Index und Element.",
    details: "`enumerate(iterable, start=0)` erzeugt einen Iterator aus Tupeln `(index, element)`. Damit entfällt das fehleranfällige `for i in range(len(xs))`. Mit `start` beginnt die Zählung bei einem anderen Wert, z. B. 1 für Zeilennummern. Das Ergebnis ist ein Iterator und nach einem Durchlauf verbraucht.",
    syntax: "enumerate(iterable, start=0)",
    example: e(`
fruechte = ["Apfel", "Birne", "Kirsche"]

for i, frucht in enumerate(fruechte, start=1):
    print(i, frucht)
# 1 Apfel
# 2 Birne
# 3 Kirsche

print(list(enumerate("ab")))  # [(0, 'a'), (1, 'b')]
`),
    tip: "Statt `for i in range(len(liste)): x = liste[i]` immer `for i, x in enumerate(liste)` schreiben.",
    keywords: ['index', 'zähler', 'counter', 'nummerieren', 'schleife mit index', 'loop index'],
    related: ['zip()', 'for', 'range()'],
    mdn: F + 'enumerate'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'zip()',
    desc: "Fasst mehrere Iterables elementweise zu Tupeln zusammen.",
    details: "`zip(a, b)` liefert `(a[0], b[0])`, `(a[1], b[1])` usw. und hört beim kürzesten Iterable auf – überzählige Elemente werden still verworfen. Mit `strict=True` (seit 3.10) gibt es stattdessen einen `ValueError`, wenn die Längen nicht passen. `zip(*paare)` dreht eine Liste von Paaren wieder in einzelne Folgen um.",
    syntax: "zip(*iterables, strict=False)",
    example: e(`
namen = ["Ada", "Linus", "Grace"]
alter = [36, 54, 85]

for name, a in zip(namen, alter):
    print(f"{name}: {a}")  # Ada: 36, Linus: 54, Grace: 85

print(dict(zip(namen, alter)))  # {'Ada': 36, 'Linus': 54, 'Grace': 85}
print(list(zip([1, 2, 3], "ab")))  # [(1, 'a'), (2, 'b')]

# "Entzippen"
zahlen, buchstaben = zip(*[(1, "a"), (2, "b")])
print(zahlen, buchstaben)  # (1, 2) ('a', 'b')

try:
    list(zip([1, 2], [1], strict=True))
except ValueError as fehler:
    print(fehler)  # zip() argument 2 is shorter than argument 1
`),
    tip: "Für unterschiedlich lange Folgen mit Auffüllwert gibt es `itertools.zip_longest(a, b, fillvalue=None)`.",
    keywords: ['reißverschluss', 'paare', 'parallel iterieren', 'zip_longest', 'kombinieren', 'transponieren'],
    related: ['enumerate()', 'dict', 'itertools.chain()'],
    mdn: F + 'zip'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'sorted()',
    desc: "Gibt eine neue, sortierte Liste aus beliebigen Iterables zurück.",
    details: "`sorted()` lässt das Original unverändert und funktioniert mit jedem Iterable (Listen, Tupel, Strings, Dict-Schlüssel). Mit `key` gibt man eine Funktion an, die den Sortierschlüssel liefert; `reverse=True` sortiert absteigend. Die Sortierung ist stabil: Gleiche Schlüssel behalten ihre ursprüngliche Reihenfolge. Großbuchstaben kommen standardmäßig vor Kleinbuchstaben.",
    syntax: "sorted(iterable, *, key=None, reverse=False)",
    values: [
      ['key=len', 'Nach Länge sortieren'],
      ['key=str.lower', 'Ohne Beachtung der Groß-/Kleinschreibung'],
      ['key=lambda x: (x[1], x[0])', 'Nach mehreren Kriterien (Tupel)'],
      ['reverse=True', 'Absteigend']
    ],
    example: e(`
woerter = ["banane", "Apfel", "kirsche", "Zitrone"]

print(sorted(woerter))                 # ['Apfel', 'Zitrone', 'banane', 'kirsche']
print(sorted(woerter, key=str.lower))  # ['Apfel', 'banane', 'kirsche', 'Zitrone']
print(sorted(woerter, key=len, reverse=True))  # ['kirsche', 'Zitrone', 'banane', 'Apfel']

personen = [("Ada", 36), ("Linus", 54), ("Bob", 36)]
# Erst nach Alter, bei Gleichstand nach Name
print(sorted(personen, key=lambda p: (p[1], p[0])))
# [('Ada', 36), ('Bob', 36), ('Linus', 54)]
`),
    tip: "`liste.sort()` sortiert in-place und gibt `None` zurück – `x = liste.sort()` ist ein klassischer Fehler.",
    keywords: ['sortieren', 'sort', 'reihenfolge', 'key', 'absteigend', 'aufsteigend', 'ordnen'],
    related: ['list.sort()', 'reversed()', 'operator', 'lambda'],
    mdn: F + 'sorted'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'reversed()',
    desc: "Liefert einen Iterator, der eine Sequenz rückwärts durchläuft.",
    details: "`reversed()` erzeugt keine Kopie, sondern einen Iterator über die Originaldaten. Er funktioniert mit Sequenzen (Listen, Tupel, Strings, `range`) und Objekten mit `__reversed__`, aber nicht mit beliebigen Iterables wie Generatoren. Wie jeder Iterator ist er nach einem Durchlauf erschöpft.",
    syntax: "reversed(sequenz)",
    example: e(`
print(list(reversed([1, 2, 3])))     # [3, 2, 1]
print("".join(reversed("Python")))   # nohtyP
print("Python"[::-1])                # nohtyP (Slicing-Alternative)

for i in reversed(range(3)):
    print(i, end=" ")  # 2 1 0
print()

r = reversed([1, 2])
print(list(r), list(r))  # [2, 1] []
`),
    tip: "`liste.reverse()` dreht die Liste selbst um; `reversed(liste)` lässt sie unverändert.",
    keywords: ['umkehren', 'rückwärts', 'reverse', 'umdrehen', 'backwards'],
    related: ['sorted()', 'list.reverse()', 'String-Slicing'],
    mdn: F + 'reversed'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'min() / max()',
    desc: "Liefert das kleinste bzw. größte Element – optional nach eigenem Schlüssel.",
    details: "Beide nehmen entweder ein Iterable oder mehrere Argumente. Mit `key` bestimmt man, wonach verglichen wird, z. B. `key=len`. Ein leeres Iterable löst `ValueError` aus, außer man gibt `default` an. Bei Gleichstand wird das erste passende Element zurückgegeben.",
    syntax: "min(iterable, *, key=None, default=...)\nmax(a, b, *weitere, key=None)",
    example: e(`
zahlen = [4, 1, 7]
print(min(zahlen), max(zahlen))  # 1 7
print(max(3, 9, 2))              # 9

woerter = ["Kiwi", "Banane", "Feige"]
print(max(woerter, key=len))     # Banane

print(min([], default=0))        # 0

# Schlüssel mit dem kleinsten Wert in einem Dict
preise = {"Brot": 2.5, "Käse": 4.2, "Milch": 1.1}
print(min(preise, key=preise.get))  # Milch
`),
    tip: "Für die n größten Elemente: `heapq.nlargest(3, xs)` statt sortieren und schneiden.",
    keywords: ['minimum', 'maximum', 'kleinster', 'größter', 'extremwert', 'key', 'default'],
    related: ['sorted()', 'sum()', 'dict.get()'],
    mdn: F + 'min'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'sum()',
    desc: "Addiert alle Elemente eines Iterables, optional ab einem Startwert.",
    details: "`sum()` funktioniert mit Zahlen jeder Art, auch mit `bool` (True zählt 1). Mit einem Generator-Ausdruck lassen sich Werte direkt beim Summieren berechnen. Für Strings ist `sum` gesperrt, dafür gibt es `str.join()`. Seit Python 3.12 addiert `sum()` Floats mit Fehlerkorrektur (Neumaier); `math.fsum()` liefert das exakt gerundete Ergebnis.",
    syntax: "sum(iterable, /, start=0)",
    example: e(`
import math

print(sum([1, 2, 3]))            # 6
print(sum([1, 2, 3], start=10))  # 16
print(sum(x * x for x in range(4)))  # 14
print(sum([True, False, True]))  # 2 (zählt Treffer)

print(sum([0.1] * 10))       # 1.0 (seit 3.12 kompensiert)
print(0.1 + 0.1 + 0.1 == 0.3)  # False (einzeln addiert)
print(math.fsum([0.1] * 10))  # 1.0
`),
    tip: "Treffer zählen: `sum(1 for x in xs if bedingung(x))` oder `sum(bedingung(x) for x in xs)`.",
    keywords: ['summe', 'addieren', 'aufsummieren', 'total', 'fsum', 'zählen'],
    related: ['min() / max()', 'Generator-Ausdruck', 'math', 'functools.reduce()'],
    mdn: F + 'sum'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'any() / all()',
    desc: "Prüft, ob mindestens ein bzw. jedes Element wahr ist.",
    details: "`any()` liefert `True`, sobald ein Element truthy ist, `all()` liefert `False`, sobald eines falsy ist – beide brechen früh ab (Kurzschluss). Zusammen mit Generator-Ausdrücken ersetzen sie viele Schleifen mit Flags. Achtung bei leeren Iterables: `any([])` ist `False`, `all([])` ist `True`.",
    syntax: "any(iterable)\nall(iterable)",
    example: e(`
zahlen = [3, 8, 12]

print(any(z > 10 for z in zahlen))  # True
print(all(z > 0 for z in zahlen))   # True
print(any([]), all([]))             # False True

namen = ["Ada", "", "Linus"]
print(all(namen))  # False (leerer String ist falsy)
`),
    tip: "Ohne Klammern um den Generator: `any(x < 0 for x in xs)` – keine Liste nötig, das spart Speicher und bricht früh ab.",
    keywords: ['irgendein', 'alle', 'jeder', 'mindestens einer', 'prüfen', 'some', 'every'],
    related: ['Truthiness', 'Generator-Ausdruck', 'filter()'],
    mdn: F + 'any'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'map()',
    desc: "Wendet eine Funktion auf jedes Element an und liefert einen Iterator.",
    details: "`map(funktion, iterable)` ist lazy: Die Werte werden erst beim Iterieren berechnet, daher meist `list(map(...))`. Mit mehreren Iterables bekommt die Funktion mehrere Argumente. In modernem Python ist eine List Comprehension oft lesbarer; `map` lohnt sich vor allem mit bereits vorhandenen Funktionen wie `int` oder `str.strip`.",
    syntax: "map(funktion, iterable, *weitere)",
    example: e(`
texte = ["1", "2", "3"]
zahlen = list(map(int, texte))
print(zahlen)  # [1, 2, 3]

# Zwei Iterables -> Funktion mit zwei Argumenten
print(list(map(pow, [2, 3], [3, 2])))  # [8, 9]

m = map(str.upper, ["a", "b"])
print(type(m).__name__)  # map
print(list(m))  # ['A', 'B']
print(list(m))  # [] (Iterator ist verbraucht)
`),
    tip: "Zeile mit Zahlen einlesen: `a, b = map(int, \"3 4\".split())`.",
    keywords: ['abbilden', 'transformieren', 'umwandeln', 'funktional', 'apply', 'lazy'],
    related: ['filter()', 'List Comprehension', 'lambda'],
    mdn: F + 'map'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'filter()',
    desc: "Liefert nur die Elemente, für die eine Funktion einen wahren Wert ergibt.",
    details: "`filter(funktion, iterable)` gibt einen lazy Iterator zurück. Mit `None` als Funktion bleiben alle truthy Elemente übrig – praktisch zum Entfernen von leeren Strings, `0` und `None`. Wie bei `map` ist eine Comprehension mit `if` oft die lesbarere Alternative.",
    syntax: "filter(funktion | None, iterable)",
    example: e(`
zahlen = [5, 12, 7, 20]

print(list(filter(lambda z: z > 6, zahlen)))  # [12, 7, 20]
print([z for z in zahlen if z > 6])           # [12, 7, 20] (gleichwertig)

# None: alle falsy Werte entfernen
print(list(filter(None, [0, "", "x", None, 3])))  # ['x', 3]
`),
    tip: "Das Gegenstück, das die falschen Elemente behält, ist `itertools.filterfalse()`.",
    keywords: ['filtern', 'aussieben', 'auswählen', 'bedingung', 'filterfalse', 'where'],
    related: ['map()', 'Comprehension mit Bedingung', 'any() / all()'],
    mdn: F + 'filter'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'abs()',
    desc: "Liefert den Betrag einer Zahl (bei komplexen Zahlen den Absolutwert).",
    details: "`abs()` funktioniert mit `int`, `float`, `complex`, `Decimal`, `Fraction` und allen Objekten mit `__abs__`, z. B. `timedelta`. Bei komplexen Zahlen liefert es die Länge des Vektors als `float`. Typischer Einsatz: Abstände und Toleranzen berechnen.",
    syntax: "abs(x)",
    example: e(`
from datetime import timedelta

print(abs(-7))      # 7
print(abs(-2.5))    # 2.5
print(abs(3 + 4j))  # 5.0
print(abs(timedelta(days=-2)))  # 2 days, 0:00:00

# Abstand zweier Werte prüfen
print(abs(10 - 13) <= 5)  # True
`),
    tip: "Für Float-Vergleiche mit Toleranz besser `math.isclose(a, b)` als `abs(a - b) < 1e-9`.",
    keywords: ['betrag', 'absolutwert', 'absolute value', 'vorzeichen', 'abstand'],
    related: ['round()', 'math', 'Gleitkomma-Fallstricke'],
    mdn: F + 'abs'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'round()',
    desc: "Rundet eine Zahl auf eine Anzahl Nachkommastellen – mit Banker's Rounding.",
    details: "Ohne zweites Argument liefert `round()` ein `int`, sonst den Typ der Eingabe. Python rundet „halb auf gerade“: `round(2.5)` ist 2, `round(3.5)` ist 4. Weil Floats binär gespeichert werden, ergibt `round(2.675, 2)` den Wert 2.67. Negative Stellen runden auf Zehner, Hunderter usw.",
    syntax: "round(zahl, ndigits=None)",
    example: e(`
print(round(3.14159, 2))       # 3.14
print(round(2.5), round(3.5))  # 2 4 (halb auf gerade)
print(round(1234, -2))         # 1200
print(round(2.675, 2))         # 2.67 (Float-Darstellung!)
print(type(round(2.7)))        # <class 'int'>

# Nur für die Anzeige runden
print(f"{2.675:.2f}")  # 2.67
`),
    tip: "Für kaufmännisches Runden (halb aufwärts) `Decimal(...).quantize(..., rounding=ROUND_HALF_UP)` verwenden.",
    keywords: ['runden', 'nachkommastellen', 'bankers rounding', 'kaufmännisch', 'rounding', 'aufrunden', 'abrunden'],
    related: ['decimal', 'Gleitkomma-Fallstricke', 'math', 'Format-Spezifikation'],
    mdn: F + 'round'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'divmod()',
    desc: "Liefert ganzzahligen Quotienten und Rest in einem Schritt als Tupel.",
    details: "`divmod(a, b)` entspricht `(a // b, a % b)`. Ideal zum Umrechnen von Einheiten wie Sekunden in Minuten und Stunden. Bei negativen Zahlen rundet `//` Richtung minus unendlich, der Rest hat dann das Vorzeichen des Divisors.",
    syntax: "divmod(a, b)  # -> (a // b, a % b)",
    example: e(`
print(divmod(17, 5))  # (3, 2)

sekunden = 3725
minuten, s = divmod(sekunden, 60)
stunden, m = divmod(minuten, 60)
print(f"{stunden}:{m:02}:{s:02}")  # 1:02:05

print(divmod(-7, 2))  # (-4, 1)
`),
    tip: "Seitenanzahl berechnen: `seiten, rest = divmod(n, pro_seite)` und bei `rest` eine Seite mehr.",
    keywords: ['ganzzahldivision', 'rest', 'modulo', 'quotient', 'umrechnen', 'zeit umrechnen'],
    related: ['// und %', 'round()', 'math'],
    mdn: F + 'divmod'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'chr() / ord()',
    desc: "Wandelt zwischen Zeichen und ihrem Unicode-Codepunkt (Zahl) um.",
    details: "`ord(\"A\")` liefert 65, `chr(65)` liefert `\"A\"`. Beide arbeiten mit Unicode-Codepunkten, nicht mit Bytes – `ord(\"€\")` ist 8364. `ord` erwartet genau ein Zeichen, sonst gibt es einen `TypeError`.",
    syntax: "ord(zeichen) -> int\nchr(codepunkt) -> str",
    example: e(`
print(ord("A"), ord("ä"), ord("€"))  # 65 228 8364
print(chr(97), chr(8364))            # a €
print(hex(ord("ß")))                 # 0xdf

# Jeden Buchstaben um eins verschieben
print("".join(chr(ord(c) + 1) for c in "HAL"))  # IBM

print([chr(c) for c in range(ord("a"), ord("e"))])  # ['a', 'b', 'c', 'd']
`),
    tip: "Für Buchstabenlisten gibt es fertige Konstanten: `string.ascii_lowercase`, `string.digits`.",
    keywords: ['unicode', 'codepunkt', 'ascii', 'zeichencode', 'character code', 'zeichen in zahl'],
    related: ['str.encode()', 'Escape-Sequenzen', 'repr()'],
    mdn: F + 'ord'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'repr()',
    desc: "Liefert die eindeutige, entwicklerfreundliche Darstellung eines Objekts.",
    details: "`repr()` ruft `__repr__` auf und zeigt Objekte möglichst so, wie man sie im Code schreiben würde – Strings mit Anführungszeichen und Escape-Sequenzen. `str()` ist dagegen für Endnutzer gedacht. Container wie Listen zeigen ihre Elemente immer per `repr`. In f-Strings erzwingt `!r` die repr-Darstellung.",
    syntax: "repr(objekt)\nf\"{x!r}\"",
    example: e(`
from datetime import date

s = "Hallo\\nWelt"
print(repr(s))   # 'Hallo\\nWelt'
print(f"{s!r}")  # 'Hallo\\nWelt'

d = date(2026, 11, 16)
print(str(d))    # 2026-11-16
print(repr(d))   # datetime.date(2026, 11, 16)

print(repr(1.0), [1, "a"])  # 1.0 [1, 'a']
`),
    tip: "Beim Debuggen `print(f\"{wert=}\")` nutzen: zeigt Name und repr, z. B. `wert='abc'`.",
    keywords: ['darstellung', 'debug', 'ausgabe', '__repr__', 'string darstellung', 'representation'],
    related: ['__str__ & __repr__', 'f-String', 'print()'],
    mdn: F + 'repr'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'hash()',
    desc: "Liefert den Hashwert eines Objekts, wie ihn dict und set intern nutzen.",
    details: "Nur unveränderliche (hashbare) Objekte haben einen Hashwert: Zahlen, Strings, Tupel aus hashbaren Elementen, `frozenset`. Listen, Dicts und Sets lösen `TypeError` aus. Gleiche Objekte müssen denselben Hash haben. String-Hashes werden pro Prozess zufällig gesalzen und sind daher nicht stabil zwischen Programmläufen.",
    syntax: "hash(objekt) -> int",
    example: e(`
print(hash(42))                      # 42
print(hash((1, 2)) == hash((1, 2)))  # True
print(hash("text"))  # z. B. -3074384592734729 (bei jedem Start anders)

try:
    hash([1, 2])
except TypeError as fehler:
    print(fehler)  # unhashable type: 'list'
`),
    tip: "Für dauerhafte Prüfsummen (Dateien, Caches auf Platte) `hashlib` statt `hash()` verwenden.",
    keywords: ['hashwert', 'hashbar', 'hashable', 'unhashable', 'prüfsumme', '__hash__'],
    related: ['Gültige Schlüssel (hashbar)', '__eq__ & __hash__', 'hashlib', 'id()'],
    mdn: F + 'hash'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'id()',
    desc: "Liefert die eindeutige Identität eines Objekts während seiner Lebensdauer.",
    details: "In CPython ist die id die Speicheradresse. Zwei Objekte mit gleicher id sind dasselbe Objekt – genau das prüft `is`. Nach dem Löschen eines Objekts kann seine id wiederverwendet werden. Der konkrete Wert ist bei jedem Lauf anders und hat keine Bedeutung über den Vergleich hinaus.",
    syntax: "id(objekt) -> int",
    example: e(`
a = [1, 2]
b = a          # zweiter Name, gleiches Objekt
c = [1, 2]     # neues Objekt mit gleichem Inhalt

print(id(a) == id(b))  # True
print(id(a) == id(c))  # False
print(a is b, a == c)  # True True
print(id(a))  # z. B. 2251799813685248
`),
    tip: "Statt `id(a) == id(b)` direkt `a is b` schreiben – das ist lesbarer und gleichwertig.",
    keywords: ['identität', 'speicheradresse', 'objekt-id', 'is', 'referenz', 'identity'],
    related: ['Identität & Gleichheit', 'is / is not', 'hash()'],
    mdn: F + 'id'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'callable()',
    desc: "Prüft, ob ein Objekt aufrufbar ist (Funktion, Klasse, Objekt mit __call__).",
    details: "`callable(x)` liefert `True` für Funktionen, Methoden, Lambdas, Klassen und Instanzen von Klassen mit `__call__`. Nützlich, wenn ein Parameter entweder ein Wert oder eine Funktion sein darf. Ein `True` garantiert nicht, dass der Aufruf mit bestimmten Argumenten gelingt.",
    syntax: "callable(objekt) -> bool",
    example: e(`
def gruss():
    return "Hi"

class Zaehler:
    def __call__(self):
        return 1

print(callable(gruss), callable(len), callable(Zaehler))  # True True True
print(callable(Zaehler()), callable(42), callable("x"))   # True False False

# Wert oder Fabrikfunktion akzeptieren
def standard(wert):
    return wert() if callable(wert) else wert

print(standard(list), standard(5))  # [] 5
`),
    keywords: ['aufrufbar', 'funktion prüfen', '__call__', 'callable', 'ist funktion'],
    related: ['__call__', 'Funktionen als Objekte', 'Callable'],
    mdn: F + 'callable'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'getattr() / setattr() / hasattr()',
    desc: "Liest, setzt und prüft Attribute über ihren Namen als String.",
    details: "`getattr(obj, \"name\")` entspricht `obj.name`, nur dass der Name zur Laufzeit feststehen kann. Mit drittem Argument gibt es einen Standardwert statt `AttributeError`. `setattr` setzt, `delattr` löscht ein Attribut, `hasattr` prüft per `getattr` auf Existenz. Für normalen Code mit festen Namen ist die Punktschreibweise klarer.",
    syntax: "getattr(obj, name[, default])\nsetattr(obj, name, wert)\nhasattr(obj, name)\ndelattr(obj, name)",
    example: e(`
class Konfig:
    debug = False

k = Konfig()
print(getattr(k, "debug"))       # False
print(getattr(k, "port", 8080))  # 8080 (Standardwert)

setattr(k, "port", 9000)
print(k.port, hasattr(k, "port"))  # 9000 True

delattr(k, "port")
print(hasattr(k, "port"))  # False

# Methode per Name aufrufen
methode = "upper"
print(getattr("text", methode)())  # TEXT
`),
    tip: "Dynamische Attributnamen aus Benutzereingaben nur mit Whitelist verwenden – sonst kann man beliebige Attribute überschreiben.",
    keywords: ['attribut', 'dynamisch', 'reflection', 'introspektion', 'delattr', 'attribute by name'],
    related: ['vars() & __dict__', '__getattr__', 'dir() & help()'],
    mdn: F + 'getattr'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'dir() & help()',
    desc: "Listet die Attribute eines Objekts auf bzw. zeigt seine Dokumentation an.",
    details: "`dir(obj)` liefert eine sortierte Liste aller Namen eines Objekts, inklusive Dunder-Methoden; ohne Argument die Namen im aktuellen Gültigkeitsbereich. `help(obj)` zeigt die Docstrings formatiert an und ist vor allem in der interaktiven REPL nützlich. Den reinen Docstring liefert `obj.__doc__`.",
    syntax: "dir([objekt])\nhelp([objekt])",
    example: e(`
import math

print([n for n in dir(math) if n.startswith("log")])  # ['log', 'log10', 'log1p', 'log2']
print("upper" in dir(str))  # True

# Öffentliche Methoden ohne Dunder-Namen
print([n for n in dir(list) if not n.startswith("_")][:3])  # ['append', 'clear', 'copy']

print(math.sqrt.__doc__)  # Return the square root of x.
# help(math.sqrt) zeigt dieselbe Doku ausführlich (in der REPL)
`),
    tip: "In der REPL `help()` ohne Argument startet eine interaktive Hilfe; mit `q` verlässt man die Anzeige.",
    keywords: ['hilfe', 'dokumentation', 'introspektion', 'attribute auflisten', 'docstring', '__doc__'],
    related: ['getattr() / setattr() / hasattr()', 'Docstrings', 'vars() & __dict__'],
    mdn: F + 'dir'
  },
  {
    lang: 'py', group: 'Eingebaute Funktionen', name: 'eval() & exec()',
    desc: "Führen Python-Code aus einem String aus – mit erheblichen Sicherheitsrisiken.",
    details: "`eval()` wertet einen einzelnen Ausdruck aus und gibt das Ergebnis zurück, `exec()` führt beliebige Anweisungen aus und gibt `None` zurück. Mit einem eigenen Dict als Namensraum bleiben die Definitionen getrennt. Beide dürfen nie mit nicht vertrauenswürdigen Eingaben genutzt werden: Darüber lässt sich beliebiger Code ausführen. Für das Einlesen von Literalen gibt es das sichere `ast.literal_eval()`.",
    syntax: "eval(ausdruck, globals=None, locals=None)\nexec(code, globals=None, locals=None)",
    example: e(`
import ast

print(eval("2 + 3 * 4"))  # 14

code = """
def quadrat(x):
    return x * x
"""
namensraum = {}
exec(code, namensraum)
print(namensraum["quadrat"](5))  # 25

# Sicher: nur Literale (Zahlen, Strings, Listen, Dicts ...)
print(ast.literal_eval("[1, 2, {'a': 3}]"))  # [1, 2, {'a': 3}]
`),
    tip: "Konfiguration oder Daten aus Text einlesen? `json`, `tomllib` oder `ast.literal_eval` statt `eval`.",
    keywords: ['code ausführen', 'dynamisch', 'literal_eval', 'sicherheit', 'injection', 'string auswerten'],
    related: ['json.loads()', 'tomllib', 'getattr() / setattr() / hasattr()'],
    mdn: F + 'eval'
  },

  // ---------------- Mathematik & Zahlen ----------------
  {
    lang: 'py', group: 'Mathematik & Zahlen', name: 'math',
    desc: "Mathematische Funktionen und Konstanten für int und float.",
    details: "Das Modul `math` enthält Wurzel, Logarithmen, Trigonometrie (im Bogenmaß), Rundungsfunktionen und Konstanten wie `pi`, `e` und `inf`. Funktionen wie `gcd`, `lcm`, `comb` und `factorial` arbeiten exakt mit Ganzzahlen. Für komplexe Zahlen gibt es das Schwestermodul `cmath`.",
    values: [
      ['math.sqrt(x)', 'Quadratwurzel (math.isqrt für ganzzahlige Wurzel)'],
      ['math.floor(x) / math.ceil(x)', 'Ab- bzw. aufrunden auf int'],
      ['math.isclose(a, b)', 'Floats mit Toleranz vergleichen'],
      ['math.gcd / math.lcm', 'Größter gemeinsamer Teiler / kleinstes gemeinsames Vielfaches'],
      ['math.comb(n, k) / math.perm(n, k)', 'Kombinationen / Permutationen zählen'],
      ['math.log(x, basis)', 'Logarithmus (Standard: natürlich)'],
      ['math.pi, math.e, math.inf, math.nan', 'Konstanten']
    ],
    example: e(`
import math

print(math.sqrt(16), math.pi)            # 4.0 3.141592653589793
print(math.floor(2.7), math.ceil(2.1))   # 2 3
print(math.isclose(0.1 + 0.2, 0.3))      # True
print(math.gcd(12, 18), math.lcm(4, 6))  # 6 12
print(math.factorial(5), math.comb(5, 2))  # 120 10
print(math.hypot(3, 4), math.log(8, 2))  # 5.0 3.0
print(math.degrees(math.pi))             # 180.0
print(math.inf > 10**100, math.isnan(float("nan")))  # True True
`),
    tip: "`math.floor(-2.5)` ist -3, `int(-2.5)` ist -2: `int()` schneidet nur ab.",
    keywords: ['mathematik', 'wurzel', 'sqrt', 'pi', 'logarithmus', 'sinus', 'runden', 'fakultät', 'ggt'],
    related: ['Gleitkomma-Fallstricke', 'round()', 'statistics', 'decimal'],
    mdn: D + 'math.html'
  },
  {
    lang: 'py', group: 'Mathematik & Zahlen', name: 'Gleitkomma-Fallstricke',
    desc: "Warum 0.1 + 0.2 nicht 0.3 ist und wie man Floats richtig vergleicht.",
    details: "`float` speichert Zahlen binär nach IEEE 754; viele Dezimalbrüche wie 0.1 sind darin nicht exakt darstellbar. Daher nie Floats mit `==` vergleichen, sondern mit `math.isclose()`. Für Geldbeträge `decimal.Decimal` oder Ganzzahlen in Cent verwenden. `nan` ist nicht einmal zu sich selbst gleich.",
    example: e(`
import math
from decimal import Decimal

print(0.1 + 0.2)         # 0.30000000000000004
print(0.1 + 0.2 == 0.3)  # False
print(math.isclose(0.1 + 0.2, 0.3))  # True

print(f"{0.1:.20f}")     # 0.10000000000000000555
print(round(2.675, 2))   # 2.67

nan = float("nan")
print(nan == nan, math.isnan(nan))  # False True

print(Decimal("0.1") + Decimal("0.2"))  # 0.3
`),
    tip: "Geldbeträge in Cent als `int` speichern ist die einfachste robuste Lösung: `1999` statt `19.99`.",
    keywords: ['float', 'ieee 754', 'rundungsfehler', 'genauigkeit', 'precision', 'isclose', '0.1 + 0.2', 'nan'],
    related: ['float', 'decimal', 'math', 'round()'],
    mdn: T + 'floatingpoint.html'
  },
  {
    lang: 'py', group: 'Mathematik & Zahlen', name: 'decimal',
    desc: "Exakte Dezimalarithmetik mit einstellbarer Genauigkeit – ideal für Geldbeträge.",
    details: "`Decimal` rechnet im Dezimalsystem und vermeidet so die binären Rundungsfehler von `float`. Immer aus Strings erzeugen: `Decimal(\"0.1\")`, nicht `Decimal(0.1)` – sonst wird der ungenaue Float-Wert übernommen. Mit `quantize()` rundet man auf eine feste Stellenzahl und wählt die Rundungsart. Die Genauigkeit für Divisionen steuert der Kontext (`getcontext().prec`, Standard 28 Stellen).",
    syntax: "Decimal(\"19.99\")\nd.quantize(Decimal(\"0.01\"), rounding=ROUND_HALF_UP)",
    values: [
      ['ROUND_HALF_UP', 'Kaufmännisch runden (0.5 aufwärts)'],
      ['ROUND_HALF_EVEN', 'Banker\'s Rounding (Standard)'],
      ['ROUND_DOWN / ROUND_UP', 'Richtung null / weg von null'],
      ['getcontext().prec', 'Anzahl signifikanter Stellen']
    ],
    example: e(`
from decimal import Decimal, ROUND_HALF_UP, localcontext

preis = Decimal("19.99")
print(preis * 3)  # 59.97
print(Decimal(0.1))  # 0.1000000000000000055511151231257827021181583404541015625

betrag = Decimal("2.675")
print(betrag.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))  # 2.68

with localcontext() as ctx:
    ctx.prec = 6
    print(Decimal(1) / Decimal(7))  # 0.142857
`),
    tip: "`Decimal` und `float` nicht mischen: `Decimal(\"1.5\") + 0.5` löst einen `TypeError` aus.",
    keywords: ['dezimal', 'geld', 'währung', 'exakt', 'präzision', 'quantize', 'kaufmännisch runden', 'money'],
    related: ['Gleitkomma-Fallstricke', 'fractions', 'round()'],
    mdn: D + 'decimal.html'
  },
  {
    lang: 'py', group: 'Mathematik & Zahlen', name: 'fractions',
    desc: "Exakte Brüche mit Zähler und Nenner, automatisch gekürzt.",
    details: "`Fraction(1, 3)` rechnet ohne Rundungsfehler und kürzt automatisch. Brüche lassen sich aus Ganzzahlen, Strings (`\"3/4\"`, `\"0.75\"`) und Floats erzeugen; bei Floats wird der exakte, oft hässliche Binärwert übernommen. `limit_denominator()` findet den nächstgelegenen einfachen Bruch.",
    syntax: "Fraction(zaehler, nenner)\nFraction(\"3/4\")",
    example: e(`
from fractions import Fraction

a = Fraction(1, 3)
print(a + Fraction(1, 6))  # 1/2
print(Fraction("0.75"), Fraction(6, 8))  # 3/4 3/4
print(float(Fraction(1, 3)))  # 0.3333333333333333

b = Fraction(3, 4)
print(b.numerator, b.denominator)  # 3 4

print(Fraction(0.1))  # 3602879701896397/36028797018963968
print(Fraction(0.1).limit_denominator(100))  # 1/10
`),
    keywords: ['bruch', 'bruchrechnung', 'rational', 'zähler', 'nenner', 'kürzen', 'fraction'],
    related: ['decimal', 'Gleitkomma-Fallstricke', 'math'],
    mdn: D + 'fractions.html'
  },
  {
    lang: 'py', group: 'Mathematik & Zahlen', name: 'statistics',
    desc: "Grundlegende Statistik: Mittelwert, Median, Modus, Standardabweichung.",
    details: "Das Modul `statistics` deckt einfache Kennzahlen ohne NumPy ab. `stdev` und `variance` berechnen die Stichproben-Werte (n−1), `pstdev` und `pvariance` die der Grundgesamtheit (n). Leere Daten lösen `StatisticsError` aus. Für große Datenmengen oder Matrizen sind NumPy bzw. pandas schneller.",
    values: [
      ['mean(xs)', 'Arithmetisches Mittel (fmean: schneller, immer float)'],
      ['median(xs)', 'Median (Mittelwert der beiden mittleren bei gerader Anzahl)'],
      ['mode(xs)', 'Häufigster Wert (multimode: alle häufigsten)'],
      ['stdev(xs) / pstdev(xs)', 'Standardabweichung Stichprobe / Grundgesamtheit'],
      ['quantiles(xs, n=4)', 'Quartile bzw. n-Quantile'],
      ['correlation(x, y)', 'Korrelationskoeffizient nach Pearson']
    ],
    example: e(`
import statistics as st

werte = [2, 4, 4, 4, 5, 5, 7, 9]

print(st.mean(werte))    # 5
print(st.median(werte))  # 4.5
print(st.mode(werte))    # 4
print(st.pstdev(werte))  # 2.0
print(round(st.stdev(werte), 3))  # 2.138
print(st.quantiles(werte, n=4))   # [4.0, 4.5, 6.5]
`),
    keywords: ['statistik', 'mittelwert', 'durchschnitt', 'median', 'standardabweichung', 'varianz', 'average', 'quartil'],
    related: ['math', 'sum()', 'random'],
    mdn: D + 'statistics.html'
  },
  {
    lang: 'py', group: 'Mathematik & Zahlen', name: 'random',
    desc: "Pseudozufallszahlen: Zufallswerte, Auswahl, Mischen und Stichproben.",
    details: "`random` erzeugt reproduzierbare Pseudozufallszahlen; mit `random.seed(...)` erhält man bei jedem Lauf dieselbe Folge, was Tests erleichtert. `randint(a, b)` schließt beide Grenzen ein, `randrange` wie `range` nicht. `shuffle` mischt in-place und gibt `None` zurück. Für Passwörter, Tokens und alles Sicherheitsrelevante ist `random` ungeeignet – dafür gibt es `secrets`.",
    values: [
      ['random()', 'Float in [0.0, 1.0)'],
      ['randint(a, b)', 'Ganzzahl von a bis einschließlich b'],
      ['uniform(a, b)', 'Float zwischen a und b'],
      ['choice(seq)', 'Ein zufälliges Element'],
      ['choices(seq, weights, k)', 'k Elemente mit Zurücklegen, optional gewichtet'],
      ['sample(seq, k)', 'k verschiedene Elemente ohne Zurücklegen'],
      ['shuffle(liste)', 'Liste in-place mischen'],
      ['seed(x)', 'Startwert für reproduzierbare Folgen']
    ],
    example: e(`
import random

random.seed(42)  # gleiche Ergebnisse bei jedem Lauf
print(random.randint(1, 6))  # 6
print(random.choice(["rot", "grün", "blau"]))  # rot
print(random.sample(range(10), 3))  # [0, 4, 3]

karten = [1, 2, 3, 4]
random.shuffle(karten)
print(karten)  # [4, 3, 1, 2]

print(round(random.random(), 3))  # 0.677
print(random.choices("ab", weights=[9, 1], k=5))  # ['a', 'a', 'a', 'a', 'a']
`),
    tip: "Für Simulationen eine eigene Instanz nutzen: `rng = random.Random(42)` – so beeinflussen sich Programmteile nicht gegenseitig.",
    keywords: ['zufall', 'zufallszahl', 'würfeln', 'mischen', 'stichprobe', 'seed', 'random number', 'shuffle'],
    related: ['secrets', 'statistics', 'itertools.permutations()'],
    mdn: D + 'random.html'
  },
  {
    lang: 'py', group: 'Mathematik & Zahlen', name: 'secrets',
    desc: "Kryptografisch sichere Zufallswerte für Passwörter, Tokens und Schlüssel.",
    details: "`secrets` nutzt die sichere Zufallsquelle des Betriebssystems und ist die richtige Wahl für alles Sicherheitsrelevante. `token_hex(n)` und `token_urlsafe(n)` erzeugen Tokens aus n zufälligen Bytes, `choice` wählt sicher aus einer Folge. `compare_digest` vergleicht Geheimnisse in konstanter Zeit und schützt so vor Timing-Angriffen.",
    values: [
      ['token_hex(n)', 'n Zufallsbytes als Hex-String (2n Zeichen)'],
      ['token_urlsafe(n)', 'n Zufallsbytes, Base64-URL-kodiert'],
      ['token_bytes(n)', 'n Zufallsbytes als bytes'],
      ['choice(seq)', 'Sichere Zufallsauswahl'],
      ['randbelow(n)', 'Sichere Ganzzahl in [0, n)'],
      ['compare_digest(a, b)', 'Vergleich in konstanter Zeit']
    ],
    example: e(`
import secrets
import string

token = secrets.token_hex(16)
print(len(token))  # 32
print(secrets.token_urlsafe(16))  # z. B. Drmhze6EPcv0fN_81Bj-nA

alphabet = string.ascii_letters + string.digits
passwort = "".join(secrets.choice(alphabet) for _ in range(12))
print(len(passwort))  # 12

print(secrets.compare_digest("abc", "abc"))  # True
`),
    tip: "Faustregel: `random` für Spiele und Simulationen, `secrets` für alles, was ein Angreifer nicht erraten darf.",
    keywords: ['sicherheit', 'passwort', 'token', 'kryptografie', 'csprng', 'api key', 'zufall sicher'],
    related: ['random', 'hashlib', 'base64'],
    mdn: D + 'secrets.html'
  },

  // ---------------- Datum & Zeit ----------------
  {
    lang: 'py', group: 'Datum & Zeit', name: 'datetime',
    desc: "Klasse für Datum und Uhrzeit zusammen, optional mit Zeitzone.",
    details: "`datetime.datetime` kombiniert Datum und Uhrzeit. Objekte ohne `tzinfo` sind „naiv“ (keine Zeitzone), mit `tzinfo` „aware“; beide lassen sich nicht miteinander vergleichen. `datetime.now(timezone.utc)` liefert die aktuelle Zeit zeitzonenbewusst. Objekte sind unveränderlich: `replace()` gibt eine neue Instanz zurück. Das Modul und die Klasse heißen gleich – daher meist `from datetime import datetime`.",
    syntax: "datetime(jahr, monat, tag, stunde=0, minute=0, sekunde=0, tzinfo=None)",
    values: [
      ['datetime.now(tz)', 'Aktuelle Zeit (mit tz zeitzonenbewusst)'],
      ['datetime.fromisoformat(s)', 'Aus ISO-8601-String erzeugen'],
      ['d.isoformat()', 'Als ISO-8601-String'],
      ['d.date() / d.time()', 'Datums- bzw. Zeitanteil'],
      ['d.replace(...)', 'Kopie mit geänderten Feldern'],
      ['d.weekday()', 'Wochentag, Montag = 0'],
      ['d.timestamp()', 'Unix-Zeitstempel in Sekunden']
    ],
    example: e(`
from datetime import datetime, timezone

d = datetime(2026, 11, 16, 14, 30)
print(d)              # 2026-11-16 14:30:00
print(d.year, d.month, d.weekday())  # 2026 11 0 (Montag)
print(d.isoformat())  # 2026-11-16T14:30:00
print(d.replace(hour=9))  # 2026-11-16 09:30:00

iso = datetime.fromisoformat("2026-11-16T08:00:00+01:00")
print(iso.utcoffset())  # 1:00:00

jetzt = datetime.now(timezone.utc)
print(jetzt.tzinfo)  # UTC
`),
    tip: "`datetime.utcnow()` ist veraltet und liefert ein naives Objekt – stattdessen `datetime.now(timezone.utc)`.",
    keywords: ['datum', 'uhrzeit', 'zeitstempel', 'jetzt', 'now', 'iso 8601', 'date time', 'timestamp'],
    related: ['datetime.date', 'datetime.timedelta', 'strftime() & strptime()', 'zoneinfo'],
    mdn: D + 'datetime.html#datetime-objects'
  },
  {
    lang: 'py', group: 'Datum & Zeit', name: 'datetime.date',
    desc: "Reines Kalenderdatum ohne Uhrzeit: Jahr, Monat, Tag.",
    details: "`date` eignet sich für Geburtstage, Fälligkeiten und alles ohne Uhrzeit. Die Differenz zweier Daten ist ein `timedelta`, Daten lassen sich direkt mit `<` und `>` vergleichen. `date.today()` nutzt die lokale Systemzeit. Ungültige Daten wie der 30. Februar lösen sofort `ValueError` aus.",
    syntax: "date(jahr, monat, tag)",
    example: e(`
from datetime import date

heiligabend = date(2026, 12, 24)
print(heiligabend)  # 2026-12-24
print(date.today())  # z. B. 2026-11-16

print((heiligabend - date(2026, 11, 16)).days)  # 38
print(heiligabend.isocalendar().week)  # 52
print(heiligabend > date(2026, 1, 1))  # True

monatsanfang = date.fromisoformat("2026-02-28").replace(day=1)
print(monatsanfang)  # 2026-02-01
`),
    tip: "Alter berechnen: `heute.year - geb.year - ((heute.month, heute.day) < (geb.month, geb.day))`.",
    keywords: ['datum', 'kalender', 'heute', 'today', 'tag', 'kalenderwoche', 'date'],
    related: ['datetime', 'datetime.timedelta', 'strftime() & strptime()'],
    mdn: D + 'datetime.html#date-objects'
  },
  {
    lang: 'py', group: 'Datum & Zeit', name: 'datetime.timedelta',
    desc: "Zeitspanne: Differenz zwischen Zeitpunkten oder Dauer zum Addieren.",
    details: "`timedelta` speichert intern nur Tage, Sekunden und Mikrosekunden; Wochen, Stunden und Minuten werden beim Erzeugen umgerechnet. Das Attribut `seconds` ist nur der Rest unter einem Tag – für die Gesamtdauer `total_seconds()` nutzen. Monate und Jahre gibt es nicht, weil ihre Länge schwankt. Zwei `timedelta` lassen sich teilen, um ein Verhältnis zu erhalten.",
    syntax: "timedelta(days=0, seconds=0, microseconds=0, milliseconds=0, minutes=0, hours=0, weeks=0)",
    example: e(`
from datetime import datetime, timedelta

start = datetime(2026, 11, 16, 9, 0)
dauer = timedelta(hours=2, minutes=30)
print(start + dauer)  # 2026-11-16 11:30:00
print(start + timedelta(days=30))  # 2026-12-16 09:00:00

diff = datetime(2026, 12, 24) - start
print(diff)  # 37 days, 15:00:00
print(diff.days, diff.seconds)  # 37 54000
print(diff.total_seconds())     # 3250800.0

print(timedelta(weeks=1) / timedelta(days=1))  # 7.0
`),
    tip: "„Einen Monat später“ geht nicht mit `timedelta`; dafür `date.replace(month=...)` mit Sonderfallbehandlung oder das Paket `dateutil`.",
    keywords: ['zeitspanne', 'dauer', 'differenz', 'duration', 'zeitraum', 'addieren', 'tage'],
    related: ['datetime', 'datetime.date', 'time'],
    mdn: D + 'datetime.html#timedelta-objects'
  },
  {
    lang: 'py', group: 'Datum & Zeit', name: 'strftime() & strptime()',
    desc: "Formatiert Datumswerte als Text bzw. liest Datumstext mit festem Format ein.",
    details: "`strftime` (format) wandelt ein `date`/`datetime` mit Formatcodes wie `%d.%m.%Y` in einen String, `datetime.strptime` (parse) ist die Umkehrung. Passt der Text nicht exakt zum Format, gibt es `ValueError`. Monats- und Wochentagsnamen (`%A`, `%B`) hängen von der Locale ab, standardmäßig Englisch. In f-Strings funktionieren die Codes direkt: `f\"{d:%d.%m.%Y}\"`.",
    values: [
      ['%Y / %y', 'Jahr vierstellig / zweistellig'],
      ['%m / %d', 'Monat / Tag, zweistellig'],
      ['%H / %M / %S', 'Stunde (24 h) / Minute / Sekunde'],
      ['%A / %a', 'Wochentag ausgeschrieben / abgekürzt'],
      ['%B / %b', 'Monatsname ausgeschrieben / abgekürzt'],
      ['%j', 'Tag im Jahr (001–366)'],
      ['%z / %Z', 'UTC-Offset / Zeitzonenname']
    ],
    example: e(`
from datetime import datetime

d = datetime(2026, 11, 16, 14, 5)
print(d.strftime("%d.%m.%Y %H:%M"))  # 16.11.2026 14:05
print(d.strftime("%Y-%m-%d"))        # 2026-11-16
print(f"{d:%d.%m.%y}")               # 16.11.26

p = datetime.strptime("24.12.2026 18:00", "%d.%m.%Y %H:%M")
print(p)  # 2026-12-24 18:00:00
print(p.strftime("%A, %B"))  # Thursday, December

try:
    datetime.strptime("2026-12-24", "%d.%m.%Y")
except ValueError:
    print("Format passt nicht")  # Format passt nicht
`),
    tip: "Für ISO-Strings wie `2026-11-16T14:05` ist `datetime.fromisoformat()` schneller und robuster als `strptime`.",
    keywords: ['datum formatieren', 'datum parsen', 'formatcodes', 'date format', 'parse date', 'string zu datum'],
    related: ['datetime', 'datetime.date', 'Format-Spezifikation'],
    mdn: D + 'datetime.html#strftime-and-strptime-behavior'
  },
  {
    lang: 'py', group: 'Datum & Zeit', name: 'zoneinfo',
    desc: "IANA-Zeitzonen (z. B. Europe/Berlin) inklusive Sommerzeit.",
    details: "`ZoneInfo(\"Europe/Berlin\")` liefert eine Zeitzone, die Sommer- und Winterzeit korrekt berücksichtigt. Man hängt sie per `tzinfo=` an oder rechnet mit `astimezone()` um. Unter Windows fehlt die Zeitzonendatenbank des Systems; dann muss das Paket `tzdata` installiert sein (`pip install tzdata`), sonst gibt es `ZoneInfoNotFoundError`.",
    syntax: "from zoneinfo import ZoneInfo\ndatetime(..., tzinfo=ZoneInfo(\"Europe/Berlin\"))",
    example: e(`
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

berlin = ZoneInfo("Europe/Berlin")

sommer = datetime(2026, 7, 1, 12, 0, tzinfo=berlin)
winter = datetime(2026, 12, 1, 12, 0, tzinfo=berlin)
print(sommer.utcoffset(), winter.utcoffset())  # 2:00:00 1:00:00

# Umrechnen
utc = sommer.astimezone(timezone.utc)
print(utc)  # 2026-07-01 10:00:00+00:00
print(utc.astimezone(ZoneInfo("America/New_York")))  # 2026-07-01 06:00:00-04:00
`),
    nocheck: true,
    tip: "Intern immer in UTC speichern und rechnen, erst für die Anzeige in die lokale Zeitzone umwandeln.",
    keywords: ['zeitzone', 'timezone', 'sommerzeit', 'utc', 'iana', 'tzdata', 'astimezone', 'mez'],
    related: ['datetime', 'time'],
    mdn: D + 'zoneinfo.html'
  },
  {
    lang: 'py', group: 'Datum & Zeit', name: 'time',
    desc: "Low-Level-Zeitfunktionen: Zeitstempel, Pausen und präzise Zeitmessung.",
    details: "`time.time()` liefert Sekunden seit 1970 (Unix-Epoche), `time.sleep(s)` pausiert. Zum Messen von Laufzeiten `time.perf_counter()` verwenden – es ist monoton und hochauflösend, während `time.time()` durch Uhrumstellungen springen kann. Für Datumsberechnungen ist das Modul `datetime` komfortabler.",
    values: [
      ['time.time()', 'Unix-Zeitstempel als float'],
      ['time.perf_counter()', 'Hochauflösender Zähler für Laufzeitmessung'],
      ['time.monotonic()', 'Monotone Uhr für Timeouts'],
      ['time.sleep(s)', 'Pausiert s Sekunden'],
      ['time.strftime(fmt, t)', 'struct_time formatieren'],
      ['time.gmtime(s) / localtime(s)', 'Zeitstempel in struct_time (UTC / lokal)']
    ],
    example: e(`
import time

start = time.perf_counter()
summe = sum(range(1_000_000))
dauer = time.perf_counter() - start
print(f"{dauer:.4f} s")  # z. B. 0.0123 s

print(time.time())  # z. B. 1794830400.123
time.sleep(0.1)     # 100 ms Pause

print(time.strftime("%Y-%m-%d", time.gmtime(0)))  # 1970-01-01
print(time.monotonic() > 0)  # True
`),
    tip: "Für Benchmarks einzelner Ausdrücke ist das Modul `timeit` genauer als eigene `perf_counter`-Messungen.",
    keywords: ['zeit', 'zeitmessung', 'sleep', 'pause', 'warten', 'timestamp', 'epoch', 'stoppuhr', 'benchmark'],
    related: ['datetime', 'datetime.timedelta', 'timeit'],
    mdn: D + 'time.html'
  },

  // ---------------- Dateien & Pfade ----------------
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'open()',
    desc: "Öffnet eine Datei zum Lesen oder Schreiben und liefert ein Dateiobjekt.",
    details: "`open()` gehört fast immer in einen `with`-Block, damit die Datei auch bei Fehlern sicher geschlossen wird. Für Textdateien immer `encoding=\"utf-8\"` angeben, sonst nutzt Python die Plattform-Kodierung (unter Windows oft cp1252). Fehlt die Datei beim Lesen, gibt es `FileNotFoundError`. Das Dateiobjekt ist selbst iterierbar und liefert Zeile für Zeile.",
    syntax: "open(datei, mode=\"r\", encoding=None, newline=None)",
    values: [
      ['datei', 'Pfad als str oder Path'],
      ['mode', 'Modus wie \"r\", \"w\", \"a\", \"rb\" (siehe Dateimodi)'],
      ['encoding', 'Textkodierung, praktisch immer \"utf-8\"'],
      ['errors', 'Umgang mit Kodierungsfehlern: \"strict\", \"replace\", \"ignore\"'],
      ['newline', 'Zeilenende-Behandlung; bei csv immer \"\"']
    ],
    example: e(`
with open("notiz.txt", "w", encoding="utf-8") as f:
    f.write("Erste Zeile\\n")

with open("notiz.txt", encoding="utf-8") as f:
    inhalt = f.read()

print(repr(inhalt))  # 'Erste Zeile\\n'
print(f.closed)      # True (with hat die Datei geschlossen)

try:
    open("fehlt.txt", encoding="utf-8")
except FileNotFoundError as fehler:
    print(type(fehler).__name__)  # FileNotFoundError
`),
    tip: "Ab Python 3.15 ist der UTF-8-Modus Standard (PEP 686); für ältere Versionen und klaren Code trotzdem `encoding=\"utf-8\"` explizit angeben.",
    keywords: ['datei öffnen', 'file', 'lesen', 'schreiben', 'dateiobjekt', 'file handle', 'with open'],
    related: ['Dateimodi', 'Datei lesen', 'Datei schreiben', 'with'],
    mdn: F + 'open'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'Dateimodi',
    desc: "Der mode-Parameter von open(): lesen, schreiben, anhängen, binär.",
    details: "Der Modus besteht aus einem Hauptbuchstaben (`r`, `w`, `a`, `x`) und optional `b` für Binär- bzw. `+` für Lesen und Schreiben. Vorsicht: `w` leert eine bestehende Datei sofort beim Öffnen. `x` legt nur neu an und schlägt mit `FileExistsError` fehl, wenn die Datei existiert – gut gegen versehentliches Überschreiben. Im Binärmodus liest und schreibt man `bytes` und gibt kein `encoding` an.",
    values: [
      ['r', 'Lesen (Standard); Datei muss existieren'],
      ['w', 'Schreiben; legt an oder leert die Datei'],
      ['a', 'Anhängen ans Ende; legt bei Bedarf an'],
      ['x', 'Exklusiv neu anlegen; Fehler, wenn vorhanden'],
      ['b', 'Binärmodus (z. B. \"rb\", \"wb\"): bytes statt str'],
      ['+', 'Lesen und Schreiben (z. B. \"r+\")'],
      ['t', 'Textmodus (Standard)']
    ],
    example: e(`
with open("log.txt", "w", encoding="utf-8") as f:
    f.write("a\\n")
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("b\\n")
with open("log.txt", encoding="utf-8") as f:
    print(f.read().split())  # ['a', 'b']

try:
    open("log.txt", "x")
except FileExistsError:
    print("existiert schon")  # existiert schon

with open("daten.bin", "wb") as f:
    f.write(bytes([0, 255]))
with open("daten.bin", "rb") as f:
    print(f.read())  # b'\\x00\\xff'
`),
    tip: "Logdateien mit `a` öffnen, nicht mit `w` – sonst ist der alte Inhalt beim nächsten Start weg.",
    keywords: ['modus', 'mode', 'binär', 'anhängen', 'append', 'überschreiben', 'rb', 'wb'],
    related: ['open()', 'Datei schreiben', 'bytes'],
    mdn: F + 'open'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'Datei lesen',
    desc: "Textdateien komplett, zeilenweise oder als Liste von Zeilen einlesen.",
    details: "`f.read()` liest alles auf einmal, `for zeile in f` liest speicherschonend Zeile für Zeile – ideal für große Dateien. Jede Zeile endet mit `\\n`, das man mit `rstrip(\"\\n\")` entfernt. `f.read().splitlines()` liefert eine Liste ohne Zeilenenden. `readline()` gibt am Dateiende einen leeren String zurück.",
    values: [
      ['f.read()', 'Gesamten Inhalt als einen String'],
      ['f.read(n)', 'Höchstens n Zeichen'],
      ['f.readline()', 'Nächste Zeile inkl. \\n'],
      ['f.readlines()', 'Liste aller Zeilen inkl. \\n'],
      ['for zeile in f', 'Zeilenweise, speicherschonend']
    ],
    example: e(`
from pathlib import Path

Path("zeilen.txt").write_text("eins\\nzwei\\ndrei\\n", encoding="utf-8")

with open("zeilen.txt", encoding="utf-8") as f:
    for nr, zeile in enumerate(f, start=1):
        print(nr, zeile.rstrip("\\n"))
# 1 eins
# 2 zwei
# 3 drei

with open("zeilen.txt", encoding="utf-8") as f:
    print(repr(f.readline()))  # 'eins\\n'
    print(f.read().splitlines())  # ['zwei', 'drei']
`),
    tip: "Für kleine Dateien ist `Path(\"x.txt\").read_text(encoding=\"utf-8\")` der kürzeste Weg.",
    keywords: ['datei lesen', 'einlesen', 'read', 'readline', 'readlines', 'zeilenweise', 'read file'],
    related: ['open()', 'Path.read_text()', 'Datei schreiben', 'str.split()'],
    mdn: T + 'inputoutput.html#methods-of-file-objects'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'Datei schreiben',
    desc: "Text in Dateien schreiben – mit write(), writelines() oder print(file=...).",
    details: "`f.write(s)` schreibt einen String und gibt die Anzahl der Zeichen zurück; Zeilenumbrüche muss man selbst anhängen. `writelines()` fügt ebenfalls keine Umbrüche ein. Mit `print(..., file=f)` gibt es den Umbruch automatisch. Geschrieben wird gepuffert – erst beim Schließen (Ende des `with`-Blocks) oder mit `f.flush()` landet alles sicher auf der Platte.",
    values: [
      ['f.write(s)', 'String schreiben, liefert Zeichenanzahl'],
      ['f.writelines(iterable)', 'Mehrere Strings ohne Trenner schreiben'],
      ['print(x, file=f)', 'Wie print, aber in die Datei'],
      ['f.flush()', 'Puffer sofort schreiben']
    ],
    example: e(`
namen = ["Ada", "Linus", "Grace"]

with open("namen.txt", "w", encoding="utf-8") as f:
    n = f.write("Namen:\\n")
    f.writelines(name + "\\n" for name in namen)
    print("Ende", file=f)

print(n)  # 7
with open("namen.txt", encoding="utf-8") as f:
    print(f.read().splitlines())  # ['Namen:', 'Ada', 'Linus', 'Grace', 'Ende']
`),
    tip: "Wichtige Dateien atomar ersetzen: erst in eine Temp-Datei schreiben, dann `os.replace(tmp, ziel)`.",
    keywords: ['datei schreiben', 'speichern', 'write', 'writelines', 'save file', 'ausgeben in datei'],
    related: ['open()', 'Dateimodi', 'Datei lesen', 'print()'],
    mdn: T + 'inputoutput.html#reading-and-writing-files'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'Encoding',
    desc: "Zeichenkodierung beim Umwandeln zwischen str und bytes bzw. beim Dateizugriff.",
    details: "In Python ist `str` Unicode-Text und `bytes` sind rohe Bytes; zwischen beiden vermittelt eine Kodierung wie UTF-8. Wird mit der falschen Kodierung gelesen, entsteht Zeichensalat („Mojibake“) oder ein `UnicodeDecodeError`. Mit `errors=\"replace\"` werden ungültige Bytes durch `�` ersetzt statt abzubrechen. Dateien mit BOM aus Windows-Programmen liest man mit `encoding=\"utf-8-sig\"`.",
    values: [
      ['utf-8', 'Standard für fast alles'],
      ['utf-8-sig', 'UTF-8 mit BOM (z. B. Excel-CSV)'],
      ['cp1252', 'Windows-Westeuropa'],
      ['latin-1', 'ISO-8859-1, kann jedes Byte dekodieren'],
      ['errors=\"replace\"', 'Ungültiges durch Ersatzzeichen ersetzen']
    ],
    example: e(`
text = "Grüße"
daten = text.encode("utf-8")
print(daten)  # b'Gr\\xc3\\xbc\\xc3\\x9fe'
print(len(text), len(daten))  # 5 7
print(daten.decode("utf-8"))   # Grüße
print(daten.decode("cp1252"))  # GrÃ¼ÃŸe (falsche Kodierung)

with open("gruss.txt", "w", encoding="utf-8") as f:
    f.write(text)

try:
    open("gruss.txt", encoding="ascii").read()
except UnicodeDecodeError:
    print("Kein ASCII")  # Kein ASCII

with open("gruss.txt", encoding="ascii", errors="replace") as f:
    print(f.read())  # Gr����e
`),
    tip: "Sieht man `Ã¤` statt `ä`, wurde UTF-8 als cp1252/latin-1 gelesen – beim Öffnen `encoding=\"utf-8\"` setzen.",
    keywords: ['kodierung', 'zeichensatz', 'utf-8', 'unicode', 'umlaute', 'mojibake', 'unicodedecodeerror', 'charset', 'bom'],
    related: ['str.encode()', 'bytes', 'open()'],
    mdn: 'https://docs.python.org/3/howto/unicode.html'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'pathlib',
    desc: "Objektorientierte Dateipfade: zusammensetzen, zerlegen, prüfen – plattformübergreifend.",
    details: "`Path` ist der moderne Ersatz für Stringpfade und `os.path`. Mit dem `/`-Operator setzt man Pfade zusammen, Attribute wie `name`, `stem`, `suffix` und `parent` zerlegen sie. Unter Windows werden Pfade mit `\\` dargestellt; `as_posix()` liefert immer `/`. Viele Funktionen der Standardbibliothek akzeptieren `Path` direkt.",
    values: [
      ['Path(\"a\") / \"b\"', 'Pfade verbinden'],
      ['p.name / p.stem / p.suffix', 'Dateiname / ohne Endung / Endung'],
      ['p.parent', 'Übergeordneter Ordner'],
      ['p.exists() / is_file() / is_dir()', 'Existenz und Art prüfen'],
      ['p.resolve()', 'Absoluter, bereinigter Pfad'],
      ['p.with_suffix(\".txt\")', 'Endung austauschen'],
      ['Path.cwd() / Path.home()', 'Arbeitsordner / Benutzerordner']
    ],
    example: e(`
from pathlib import Path

p = Path("projekt") / "src" / "main.py"
print(p.name, p.stem, p.suffix)  # main.py main .py
print(p.parent.as_posix())       # projekt/src
print(p.with_suffix(".txt").as_posix())  # projekt/src/main.txt
print(p.parts)     # ('projekt', 'src', 'main.py')
print(p.exists())  # False

print(Path.cwd())   # z. B. /home/ada/projekt
print(Path.home())  # z. B. /home/ada
print(Path("archiv.tar.gz").suffixes)  # ['.tar', '.gz']
`),
    tip: "Pfad relativ zur eigenen Skriptdatei: `Path(__file__).parent / \"daten.json\"` – unabhängig vom Arbeitsverzeichnis.",
    keywords: ['pfad', 'path', 'dateipfad', 'ordner', 'verzeichnis', 'dateiname', 'endung', 'extension'],
    related: ['Path.read_text()', 'Path.glob()', 'Path.mkdir()', 'os.path'],
    mdn: D + 'pathlib.html'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'Path.read_text()',
    desc: "Liest eine ganze Datei in einem Aufruf – samt write_text, read_bytes, write_bytes.",
    details: "`read_text()` und `write_text()` öffnen und schließen die Datei selbst, ein `with`-Block ist nicht nötig. Für Binärdaten gibt es `read_bytes()` und `write_bytes()`. `write_text` überschreibt die Datei vollständig. Für große Dateien oder zeilenweises Verarbeiten ist `open()` die bessere Wahl.",
    syntax: "p.read_text(encoding=\"utf-8\")\np.write_text(text, encoding=\"utf-8\")\np.read_bytes() / p.write_bytes(daten)",
    example: e(`
from pathlib import Path

p = Path("gruss.txt")
p.write_text("Hallo\\nWelt\\n", encoding="utf-8")
print(p.read_text(encoding="utf-8").splitlines())  # ['Hallo', 'Welt']

p.write_bytes(b"\\x01\\x02")
print(p.read_bytes())    # b'\\x01\\x02'
print(p.stat().st_size)  # 2

p.unlink()  # Datei löschen
print(p.exists())  # False
`),
    tip: "Zum Anhängen gibt es keine Path-Methode – dafür `with p.open(\"a\", encoding=\"utf-8\") as f:`.",
    keywords: ['datei lesen', 'datei schreiben', 'write_text', 'read_bytes', 'write_bytes', 'einzeiler'],
    related: ['pathlib', 'Datei lesen', 'Datei schreiben'],
    mdn: D + 'pathlib.html#pathlib.Path.read_text'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'Path.glob()',
    desc: "Findet Dateien per Muster wie *.py – mit rglob() auch rekursiv.",
    details: "`glob(\"*.py\")` sucht im Ordner selbst, `glob(\"**/*.py\")` oder `rglob(\"*.py\")` auch in allen Unterordnern. Das Ergebnis ist ein Generator aus `Path`-Objekten in beliebiger Reihenfolge – für stabile Ausgaben `sorted()` drumherum. `iterdir()` listet einfach alle Einträge eines Ordners ohne Muster.",
    syntax: "p.glob(muster)\np.rglob(muster)\np.iterdir()",
    values: [
      ['*', 'Beliebig viele Zeichen (ohne /)'],
      ['?', 'Genau ein Zeichen'],
      ['[abc]', 'Eines der Zeichen'],
      ['**', 'Beliebig viele Ordnerebenen']
    ],
    example: e(`
from pathlib import Path

basis = Path("demo")
for name in ["a.py", "b.txt", "src/c.py", "src/sub/d.py"]:
    datei = basis / name
    datei.parent.mkdir(parents=True, exist_ok=True)
    datei.touch()

def zeige(treffer):
    return sorted(p.relative_to(basis).as_posix() for p in treffer)

print(zeige(basis.glob("*.py")))   # ['a.py']
print(zeige(basis.rglob("*.py")))  # ['a.py', 'src/c.py', 'src/sub/d.py']
print(zeige(basis.glob("**/*.py")))  # ['a.py', 'src/c.py', 'src/sub/d.py']
print(sorted(p.name for p in (basis / "src").iterdir()))  # ['c.py', 'sub']
`),
    tip: "Nur Dateien: `[p for p in ordner.rglob(\"*\") if p.is_file()]` – `rglob` liefert auch Ordner.",
    keywords: ['dateien suchen', 'muster', 'wildcard', 'rekursiv', 'rglob', 'iterdir', 'ordner auflisten', 'find files'],
    related: ['pathlib', 'os', 'Path.mkdir()'],
    mdn: D + 'pathlib.html#pathlib.Path.glob'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'Path.mkdir()',
    desc: "Legt einen Ordner an – mit parents=True auch alle fehlenden Zwischenordner.",
    details: "Ohne Optionen schlägt `mkdir()` fehl, wenn der Ordner existiert (`FileExistsError`) oder der Elternordner fehlt (`FileNotFoundError`). `parents=True, exist_ok=True` ist die übliche Kombination für „Ordner sicherstellen“. Zum Entfernen gibt es `rmdir()` (nur leere Ordner) und `unlink()` für Dateien; ganze Bäume löscht `shutil.rmtree()`.",
    syntax: "p.mkdir(mode=0o777, parents=False, exist_ok=False)",
    example: e(`
from pathlib import Path

ziel = Path("ausgabe/2026/11")
ziel.mkdir(parents=True, exist_ok=True)
ziel.mkdir(parents=True, exist_ok=True)  # kein Fehler beim zweiten Mal
print(ziel.is_dir())  # True

try:
    Path("ausgabe").mkdir()
except FileExistsError:
    print("gibt es schon")  # gibt es schon

(ziel / "leer.txt").touch()
(ziel / "leer.txt").unlink()
ziel.rmdir()
print(ziel.exists(), ziel.parent.exists())  # False True
`),
    keywords: ['ordner anlegen', 'verzeichnis erstellen', 'mkdir', 'makedirs', 'rmdir', 'unlink', 'create directory'],
    related: ['pathlib', 'shutil', 'os'],
    mdn: D + 'pathlib.html#pathlib.Path.mkdir'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'os',
    desc: "Schnittstelle zum Betriebssystem: Dateien, Ordner, Prozesse, Umgebung.",
    details: "`os` bietet Funktionen wie `listdir`, `makedirs`, `remove`, `rename` und `walk`, die direkt mit Stringpfaden arbeiten. Für Pfad-Operationen ist heute `pathlib` meist angenehmer, `os.walk` bleibt aber praktisch für Ordnerbäume. `os.replace` überschreibt das Ziel auch unter Windows, `os.rename` nicht. Umgebungsvariablen stecken in `os.environ`.",
    values: [
      ['os.listdir(pfad)', 'Namen im Ordner'],
      ['os.makedirs(pfad, exist_ok=True)', 'Ordner inkl. Zwischenordnern anlegen'],
      ['os.remove(pfad)', 'Datei löschen'],
      ['os.replace(alt, neu)', 'Umbenennen/verschieben, Ziel wird überschrieben'],
      ['os.walk(pfad)', 'Ordnerbaum durchlaufen: (ordner, unterordner, dateien)'],
      ['os.getcwd() / os.chdir(p)', 'Arbeitsverzeichnis lesen / wechseln'],
      ['os.cpu_count()', 'Anzahl logischer CPUs']
    ],
    example: e(`
import os

os.makedirs("daten/roh", exist_ok=True)
with open("daten/roh/a.csv", "w", encoding="utf-8") as f:
    f.write("x")

print(os.listdir("daten"))  # ['roh']
os.replace("daten/roh/a.csv", "daten/roh/b.csv")

for ordner, unterordner, dateien in os.walk("daten"):
    print(ordner.replace(os.sep, "/"), unterordner, dateien)
# daten ['roh'] []
# daten/roh [] ['b.csv']

print(os.getcwd())     # z. B. /home/ada/projekt
print(os.cpu_count())  # z. B. 8
`),
    tip: "`os.system(\"befehl\")` vermeiden – `subprocess.run([...])` ist sicherer und liefert Ausgabe und Exit-Code.",
    keywords: ['betriebssystem', 'operating system', 'listdir', 'walk', 'makedirs', 'remove', 'rename', 'cwd'],
    related: ['os.path', 'pathlib', 'os.environ', 'shutil'],
    mdn: D + 'os.html'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'os.path',
    desc: "Klassische String-Funktionen für Pfade: join, split, exists, splitext.",
    details: "`os.path` arbeitet mit Pfaden als Strings und ist in älterem Code allgegenwärtig. `join` verwendet den Trenner des Betriebssystems (`/` bzw. `\\`). `splitext` trennt nur die letzte Endung ab. Für neuen Code ist `pathlib` lesbarer; beide lassen sich mischen, da `os.path` auch `Path`-Objekte akzeptiert.",
    values: [
      ['join(a, b)', 'Pfade verbinden'],
      ['basename(p) / dirname(p)', 'Letzter Teil / Ordneranteil'],
      ['splitext(p)', 'Tupel (Rest, Endung)'],
      ['exists / isfile / isdir', 'Existenz und Art prüfen'],
      ['abspath(p)', 'Absoluter Pfad'],
      ['getsize(p)', 'Dateigröße in Bytes'],
      ['expanduser(\"~\")', 'Benutzerordner einsetzen']
    ],
    example: e(`
import os.path

pfad = "berichte/2026/umsatz.tar.gz"
print(os.path.basename(pfad))  # umsatz.tar.gz
print(os.path.dirname(pfad))   # berichte/2026
print(os.path.splitext(pfad))  # ('berichte/2026/umsatz.tar', '.gz')
print(os.path.exists(pfad))    # False

print(os.path.join("berichte", "2026"))  # berichte/2026 (Windows: berichte\\2026)
print(os.path.isabs(os.path.abspath(pfad)))  # True
`),
    tip: "Pfade nie mit `+` und `\"/\"` zusammenbauen – `os.path.join` oder `Path(...) / ...` erledigen das plattformgerecht.",
    keywords: ['pfad', 'join', 'basename', 'dirname', 'splitext', 'exists', 'dateiendung'],
    related: ['pathlib', 'os'],
    mdn: D + 'os.path.html'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'shutil',
    desc: "Höhere Dateioperationen: kopieren, verschieben, Ordnerbäume löschen, archivieren.",
    details: "`shutil` ergänzt `os` um Operationen auf ganzen Dateien und Bäumen. `copy2` kopiert inklusive Metadaten, `copytree` einen ganzen Ordner, `rmtree` löscht einen Ordner mit allem Inhalt – ohne Papierkorb und ohne Rückfrage. `make_archive` erstellt ZIP- oder TAR-Archive, `which` findet Programme im PATH.",
    values: [
      ['copy(src, dst) / copy2(...)', 'Datei kopieren (copy2 mit Zeitstempeln)'],
      ['copytree(src, dst)', 'Ganzen Ordner kopieren'],
      ['move(src, dst)', 'Verschieben bzw. umbenennen'],
      ['rmtree(pfad)', 'Ordner samt Inhalt löschen'],
      ['make_archive(name, \"zip\", ordner)', 'Archiv erstellen'],
      ['which(\"programm\")', 'Pfad eines Programms im PATH oder None'],
      ['disk_usage(pfad)', 'Gesamt-, belegter und freier Speicher']
    ],
    example: e(`
import shutil
from pathlib import Path

Path("quelle/sub").mkdir(parents=True)
Path("quelle/sub/a.txt").write_text("A", encoding="utf-8")

shutil.copy("quelle/sub/a.txt", "kopie.txt")
shutil.copytree("quelle", "backup")
print(Path("backup/sub/a.txt").read_text(encoding="utf-8"))  # A

shutil.move("kopie.txt", "verschoben.txt")
shutil.rmtree("quelle")
print(Path("quelle").exists())  # False

archiv = shutil.make_archive("backup", "zip", "backup")
print(Path(archiv).name)  # backup.zip
`),
    tip: "`rmtree` mit einem Pfad aus einer Variablen? Vorher prüfen, dass er wirklich im erwarteten Ordner liegt.",
    keywords: ['kopieren', 'verschieben', 'löschen', 'copy', 'move', 'rmtree', 'zip', 'archiv', 'which'],
    related: ['os', 'pathlib', 'tempfile'],
    mdn: D + 'shutil.html'
  },
  {
    lang: 'py', group: 'Dateien & Pfade', name: 'tempfile',
    desc: "Temporäre Dateien und Ordner, die nach Gebrauch automatisch verschwinden.",
    details: "`TemporaryDirectory()` legt einen eindeutigen Ordner an und löscht ihn samt Inhalt am Ende des `with`-Blocks. `NamedTemporaryFile()` erzeugt eine Datei mit Namen, die beim Schließen gelöscht wird. Unter Windows kann eine noch offene `NamedTemporaryFile` nicht von anderen Prozessen geöffnet werden; seit 3.12 hilft `delete_on_close=False`. Ideal für Tests und Zwischenergebnisse.",
    values: [
      ['TemporaryDirectory()', 'Temporärer Ordner (Kontextmanager)'],
      ['NamedTemporaryFile(mode, suffix)', 'Temporäre Datei mit Namen'],
      ['TemporaryFile()', 'Anonyme Temp-Datei ohne sichtbaren Namen'],
      ['mkdtemp() / mkstemp()', 'Ohne automatisches Aufräumen'],
      ['gettempdir()', 'Temp-Ordner des Systems']
    ],
    example: e(`
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    p = Path(tmp) / "test.txt"
    p.write_text("x", encoding="utf-8")
    print(p.exists())  # True
print(p.exists())  # False (Ordner ist weg)

with tempfile.NamedTemporaryFile("w+", suffix=".csv", encoding="utf-8") as f:
    f.write("a,b\\n")
    f.seek(0)
    print(f.read().strip(), f.name.endswith(".csv"))  # a,b True

print(tempfile.gettempdir())  # z. B. /tmp
`),
    keywords: ['temporär', 'temp', 'tmp', 'zwischendatei', 'temporary file', 'test', 'aufräumen'],
    related: ['pathlib', 'shutil', 'with'],
    mdn: D + 'tempfile.html'
  },

  // ---------------- Datenformate ----------------
  {
    lang: 'py', group: 'Datenformate', name: 'json',
    desc: "Liest und schreibt JSON – mit load/dump für Dateien, loads/dumps für Strings.",
    details: "JSON-Objekte werden zu `dict`, Arrays zu `list`, `true`/`false`/`null` zu `True`/`False`/`None`. `json.load(f)` und `json.dump(obj, f)` arbeiten mit Dateien, die Varianten mit `s` mit Strings. Tupel werden zu Listen, Dict-Schlüssel immer zu Strings. Typen wie `datetime`, `set` oder eigene Klassen sind nicht direkt serialisierbar.",
    values: [
      ['json.load(f)', 'JSON aus Datei lesen'],
      ['json.dump(obj, f)', 'JSON in Datei schreiben'],
      ['json.loads(s)', 'JSON-String parsen'],
      ['json.dumps(obj)', 'Objekt als JSON-String'],
      ['python -m json.tool datei.json', 'JSON auf der Kommandozeile formatieren']
    ],
    example: e(`
import json

daten = {"name": "Ada", "sprachen": ["Python", "C"], "aktiv": True, "chef": None}

with open("person.json", "w", encoding="utf-8") as f:
    json.dump(daten, f, indent=2, ensure_ascii=False)

with open("person.json", encoding="utf-8") as f:
    geladen = json.load(f)

print(geladen == daten)        # True
print(geladen["sprachen"][0])  # Python
`),
    tip: "Für Konfigurationsdateien, die Menschen bearbeiten, ist TOML (`tomllib`) angenehmer, weil es Kommentare erlaubt.",
    keywords: ['json', 'serialisieren', 'deserialisieren', 'parsen', 'api', 'datei', 'javascript object notation'],
    related: ['json.dumps()', 'json.loads()', 'tomllib', 'pickle'],
    mdn: D + 'json.html'
  },
  {
    lang: 'py', group: 'Datenformate', name: 'json.dumps()',
    desc: "Wandelt Python-Objekte in einen JSON-String um – kompakt oder eingerückt.",
    details: "Standardmäßig werden Nicht-ASCII-Zeichen als `\\uXXXX` maskiert; `ensure_ascii=False` behält Umlaute bei. `indent` macht die Ausgabe lesbar, `sort_keys=True` sorgt für stabile Reihenfolge. Nicht serialisierbare Objekte lösen `TypeError` aus – mit `default=` gibt man eine Umwandlungsfunktion an, z. B. `default=str` für Datumswerte.",
    syntax: "json.dumps(obj, *, indent=None, ensure_ascii=True, sort_keys=False, default=None, separators=None)",
    values: [
      ['indent=2', 'Mehrzeilig mit 2 Leerzeichen einrücken'],
      ['ensure_ascii=False', 'Umlaute und Unicode unverändert ausgeben'],
      ['sort_keys=True', 'Schlüssel alphabetisch sortieren'],
      ['default=str', 'Fallback für unbekannte Typen'],
      ['separators=(\",\", \":\")', 'Möglichst kompakt, ohne Leerzeichen']
    ],
    example: e(`
import json
from datetime import date

d = {"stadt": "Köln", "werte": (1, 2), "ok": True, "x": None}
print(json.dumps(d))
# {"stadt": "K\\u00f6ln", "werte": [1, 2], "ok": true, "x": null}
print(json.dumps(d, ensure_ascii=False))
# {"stadt": "Köln", "werte": [1, 2], "ok": true, "x": null}

print(json.dumps({"b": 1, "a": 2}, sort_keys=True, separators=(",", ":")))  # {"a":2,"b":1}
print(json.dumps({"tag": date(2026, 11, 16)}, default=str))  # {"tag": "2026-11-16"}

try:
    json.dumps({1, 2})
except TypeError as fehler:
    print(fehler)  # Object of type set is not JSON serializable
`),
    tip: "Dataclasses vorher mit `dataclasses.asdict(obj)` in ein Dict umwandeln, dann `json.dumps`.",
    keywords: ['json erzeugen', 'serialisieren', 'stringify', 'indent', 'ensure_ascii', 'pretty print', 'to json'],
    related: ['json', 'json.loads()', 'dataclasses.asdict()'],
    mdn: D + 'json.html#json.dumps'
  },
  {
    lang: 'py', group: 'Datenformate', name: 'json.loads()',
    desc: "Parst einen JSON-String und liefert dict, list, str, int, float, bool oder None.",
    details: "`json.loads()` erwartet striktes JSON: doppelte Anführungszeichen, kein abschließendes Komma, keine Kommentare. Fehler lösen `json.JSONDecodeError` (eine Unterklasse von `ValueError`) mit Zeile und Spalte aus. Zahlen mit Punkt werden zu `float`; mit `parse_float=Decimal` bleiben sie exakt. `bytes` in UTF-8 werden ebenfalls akzeptiert.",
    syntax: "json.loads(s, *, parse_float=None, object_hook=None)",
    example: e(`
import json
from decimal import Decimal

text = '{"id": 7, "preis": 9.99, "tags": ["neu"], "aktiv": false}'
obj = json.loads(text)
print(obj["id"], obj["aktiv"], type(obj["preis"]).__name__)  # 7 False float

try:
    json.loads("{'id': 7}")
except json.JSONDecodeError as fehler:
    print(fehler.msg)  # Expecting property name enclosed in double quotes

print(json.loads("1.10", parse_float=Decimal))  # 1.10
print(json.loads('{"1": "a"}'))  # {'1': 'a'} (Schlüssel bleiben Strings)
`),
    tip: "Python-Dicts mit einfachen Anführungszeichen sind kein JSON – dafür `ast.literal_eval`, besser aber die Quelle korrigieren.",
    keywords: ['json parsen', 'deserialisieren', 'parse', 'from json', 'jsondecodeerror', 'string zu dict'],
    related: ['json', 'json.dumps()', 'eval() & exec()'],
    mdn: D + 'json.html#json.loads'
  },
  {
    lang: 'py', group: 'Datenformate', name: 'csv',
    desc: "Liest und schreibt CSV-Dateien, als Listen oder als Dicts pro Zeile.",
    details: "`csv.reader`/`csv.writer` arbeiten mit Listen, `DictReader`/`DictWriter` mit Dicts über die Kopfzeile. Dateien immer mit `newline=\"\"` öffnen, sonst entstehen unter Windows Leerzeilen. Alle Werte kommen als Strings an und müssen selbst umgewandelt werden. Für deutsche Excel-Dateien `delimiter=\";\"` und oft `encoding=\"utf-8-sig\"` angeben.",
    values: [
      ['csv.reader(f, delimiter=\",\")', 'Zeilen als Listen'],
      ['csv.DictReader(f)', 'Zeilen als Dicts (Schlüssel aus Kopfzeile)'],
      ['csv.writer(f).writerow(liste)', 'Eine Zeile schreiben'],
      ['csv.DictWriter(f, fieldnames)', 'Dicts schreiben, writeheader() für Kopfzeile'],
      ['quoting=csv.QUOTE_ALL', 'Alle Felder in Anführungszeichen']
    ],
    example: e(`
import csv

zeilen = [{"name": "Ada", "stadt": "London"}, {"name": "Linus", "stadt": "Helsinki"}]

with open("leute.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["name", "stadt"])
    w.writeheader()
    w.writerows(zeilen)

with open("leute.csv", newline="", encoding="utf-8") as f:
    for zeile in csv.DictReader(f):
        print(zeile["name"], zeile["stadt"])
# Ada London
# Linus Helsinki

with open("leute.csv", newline="", encoding="utf-8") as f:
    print(next(csv.reader(f)))  # ['name', 'stadt']
`),
    tip: "Nie per `zeile.split(\",\")` parsen: Felder in Anführungszeichen dürfen selbst Kommas und Zeilenumbrüche enthalten.",
    keywords: ['csv', 'excel', 'tabelle', 'komma', 'semikolon', 'dictreader', 'dictwriter', 'spreadsheet'],
    related: ['open()', 'Encoding', 'json'],
    mdn: D + 'csv.html'
  },
  {
    lang: 'py', group: 'Datenformate', name: 'pickle',
    desc: "Speichert fast beliebige Python-Objekte binär und lädt sie wieder.",
    details: "`pickle` serialisiert Listen, Dicts, Sets, eigene Klassen und vieles mehr in ein Python-spezifisches Binärformat. Dateien im Binärmodus (`wb`/`rb`) öffnen. Wichtig: Beim Laden kann beliebiger Code ausgeführt werden – niemals Pickle-Daten aus unsicheren Quellen laden. Für den Austausch mit anderen Sprachen ist JSON die bessere Wahl.",
    values: [
      ['pickle.dump(obj, f)', 'In Binärdatei schreiben'],
      ['pickle.load(f)', 'Aus Binärdatei laden'],
      ['pickle.dumps(obj)', 'Als bytes'],
      ['pickle.loads(b)', 'Aus bytes laden']
    ],
    example: e(`
import pickle

daten = {"punkte": [1, 2, 3], "menge": {1, 2}, "paar": (1, "a")}

with open("daten.pkl", "wb") as f:
    pickle.dump(daten, f)

with open("daten.pkl", "rb") as f:
    geladen = pickle.load(f)

print(geladen == daten)  # True
print(type(geladen["menge"]).__name__)  # set

b = pickle.dumps([1, 2])
print(type(b).__name__, pickle.loads(b))  # bytes [1, 2]
`),
    tip: "Pickle eignet sich für Caches im eigenen Programm, nicht als dauerhaftes Archivformat – Klassenänderungen können alte Dateien unlesbar machen.",
    keywords: ['serialisieren', 'speichern', 'objekte speichern', 'binär', 'persistenz', 'marshalling', 'unsicher'],
    related: ['json', 'sqlite3', 'Dateimodi'],
    mdn: D + 'pickle.html'
  },
  {
    lang: 'py', group: 'Datenformate', name: 'tomllib',
    desc: "Liest TOML-Dateien wie pyproject.toml (nur lesen, seit Python 3.11).",
    details: "`tomllib.load()` erwartet eine im Binärmodus (`rb`) geöffnete Datei, `tomllib.loads()` einen String. Tabellen wie `[tool.ruff]` werden zu verschachtelten Dicts. Schreiben kann `tomllib` nicht; dafür braucht man ein Fremdpaket wie `tomli-w`. TOML eignet sich gut für Konfiguration, weil es Kommentare und Datumswerte kennt.",
    syntax: "with open(\"datei.toml\", \"rb\") as f:\n    cfg = tomllib.load(f)",
    example: e(`
import tomllib

text = """
# Kommentare sind erlaubt
[projekt]
name = "demo"
version = "1.2.0"
abhaengigkeiten = ["requests>=2.31"]

[tool.ruff]
line-length = 100
"""

cfg = tomllib.loads(text)
print(cfg["projekt"]["name"])             # demo
print(cfg["tool"]["ruff"]["line-length"]) # 100

with open("config.toml", "wb") as f:
    f.write(text.encode("utf-8"))
with open("config.toml", "rb") as f:  # Binärmodus ist Pflicht
    print(tomllib.load(f)["projekt"]["version"])  # 1.2.0
`),
    keywords: ['toml', 'konfiguration', 'config', 'pyproject', 'einstellungen', 'settings'],
    related: ['pyproject.toml', 'json', 'csv'],
    mdn: D + 'tomllib.html'
  },
  {
    lang: 'py', group: 'Datenformate', name: 'sqlite3',
    desc: "Eingebaute SQL-Datenbank in einer einzigen Datei (oder im Speicher).",
    details: "`sqlite3.connect(\"app.db\")` öffnet bzw. erstellt eine Datenbankdatei, `\":memory:\"` eine flüchtige Datenbank. Werte immer über Platzhalter `?` übergeben, nie per f-String in SQL einbauen – das verhindert SQL-Injection. Änderungen müssen mit `commit()` gespeichert werden; `with con:` erledigt Commit bzw. Rollback automatisch, schließt die Verbindung aber nicht. Mit `row_factory = sqlite3.Row` greift man per Spaltenname zu.",
    values: [
      ['con.execute(sql, params)', 'SQL ausführen, liefert Cursor'],
      ['con.executemany(sql, liste)', 'Gleiche Anweisung für viele Datensätze'],
      ['cur.fetchone() / fetchall()', 'Ergebniszeilen holen'],
      ['con.commit() / rollback()', 'Transaktion bestätigen / verwerfen'],
      ['con.row_factory = sqlite3.Row', 'Zugriff per Spaltenname']
    ],
    example: e(`
import sqlite3

con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE user (id INTEGER PRIMARY KEY, name TEXT, jahre INTEGER)")

with con:  # commit bei Erfolg, rollback bei Fehler
    con.executemany("INSERT INTO user (name, jahre) VALUES (?, ?)",
                    [("Ada", 36), ("Linus", 54)])

for zeile in con.execute("SELECT name, jahre FROM user WHERE jahre > ?", (40,)):
    print(zeile)  # ('Linus', 54)

con.row_factory = sqlite3.Row
r = con.execute("SELECT * FROM user WHERE name = ?", ("Ada",)).fetchone()
print(r["id"], r["name"])  # 1 Ada

print(con.execute("SELECT COUNT(*) FROM user").fetchone()[0])  # 2
con.close()
`),
    tip: "Parameter immer als Tupel übergeben – auch bei nur einem Wert: `(wert,)` mit Komma.",
    keywords: ['datenbank', 'sql', 'database', 'sqlite', 'abfrage', 'query', 'tabelle', 'sql injection'],
    related: ['pickle', 'json', 'with'],
    mdn: D + 'sqlite3.html'
  },
  {
    lang: 'py', group: 'Datenformate', name: 'base64',
    desc: "Kodiert Binärdaten als ASCII-Text (Base64) und zurück.",
    details: "Base64 macht aus beliebigen Bytes druckbaren Text, z. B. für Daten-URLs, E-Mail-Anhänge oder HTTP-Basic-Auth. Ein- und Ausgabe sind `bytes`; Text muss vorher mit `encode()` umgewandelt werden. Die URL-sichere Variante ersetzt `+` und `/` durch `-` und `_`. Base64 ist keine Verschlüsselung – jeder kann es dekodieren.",
    values: [
      ['b64encode(b) / b64decode(s)', 'Standard-Base64'],
      ['urlsafe_b64encode / urlsafe_b64decode', 'Mit - und _ statt + und /'],
      ['b32encode / b16encode', 'Base32 bzw. Hex']
    ],
    example: e(`
import base64

daten = "Grüße!".encode("utf-8")
kodiert = base64.b64encode(daten)
print(kodiert)  # b'R3LDvMOfZSE='
print(base64.b64decode(kodiert).decode("utf-8"))  # Grüße!

print(base64.b64encode(b"\\xfb\\xff"))          # b'+/8='
print(base64.urlsafe_b64encode(b"\\xfb\\xff"))  # b'-_8='

# HTTP Basic Auth-Header
print(base64.b64encode(b"user:pass").decode("ascii"))  # dXNlcjpwYXNz
`),
    keywords: ['base64', 'kodieren', 'encode', 'decode', 'binär zu text', 'data url', 'basic auth'],
    related: ['bytes', 'hashlib', 'str.encode()'],
    mdn: D + 'base64.html'
  },
  {
    lang: 'py', group: 'Datenformate', name: 'hashlib',
    desc: "Kryptografische Hashfunktionen wie SHA-256 für Prüfsummen und Signaturen.",
    details: "Ein Hash-Objekt wird mit `update()` gefüttert, auch in mehreren Stücken, und liefert mit `hexdigest()` die Prüfsumme. Eingaben müssen `bytes` sein. MD5 und SHA-1 gelten als gebrochen und taugen nur noch für einfache Prüfsummen. Passwörter nie mit einfachem SHA-256 speichern, sondern mit einem langsamen Verfahren wie `pbkdf2_hmac` oder `scrypt` plus Salt.",
    values: [
      ['hashlib.sha256(b)', 'SHA-256-Hash-Objekt'],
      ['h.update(b)', 'Weitere Daten hinzufügen'],
      ['h.hexdigest() / h.digest()', 'Ergebnis als Hex-String / bytes'],
      ['hashlib.file_digest(f, \"sha256\")', 'Datei effizient hashen (seit 3.11)'],
      ['hashlib.pbkdf2_hmac(...)', 'Schlüsselableitung für Passwörter']
    ],
    example: e(`
import hashlib

print(hashlib.md5(b"abc").hexdigest())  # 900150983cd24fb0d6963f7d28e17f72
print(hashlib.sha256(b"abc").hexdigest()[:16])  # ba7816bf8f01cfea

h = hashlib.sha256()
h.update(b"a")
h.update(b"bc")  # in Stücken – gleiches Ergebnis
print(h.hexdigest() == hashlib.sha256(b"abc").hexdigest())  # True

with open("datei.bin", "wb") as f:
    f.write(b"x" * 1000)
with open("datei.bin", "rb") as f:
    print(len(hashlib.file_digest(f, "sha256").hexdigest()))  # 64

schluessel = hashlib.pbkdf2_hmac("sha256", b"geheim", b"zufaelliges-salt", 100_000)
print(len(schluessel))  # 32
`),
    tip: "Zum Prüfen von Signaturen `hmac.compare_digest()` statt `==` nutzen, um Timing-Angriffe zu vermeiden.",
    keywords: ['hash', 'prüfsumme', 'checksum', 'sha256', 'md5', 'passwort hashen', 'digest', 'integrität'],
    related: ['hash()', 'secrets', 'base64'],
    mdn: D + 'hashlib.html'
  },

  // ---------------- Reguläre Ausdrücke ----------------
  {
    lang: 'py', group: 'Reguläre Ausdrücke', name: 're',
    desc: "Modul für reguläre Ausdrücke: Muster suchen, extrahieren, ersetzen, aufteilen.",
    details: "Muster schreibt man als Raw-String (`r\"\\d+\"`), damit Backslashes nicht von Python selbst interpretiert werden. Treffer sind `Match`-Objekte oder `None` – vor dem Zugriff immer prüfen. Für einfache Aufgaben wie `startswith`, `in` oder `split` sind String-Methoden schneller und lesbarer.",
    values: [
      ['\\d / \\w / \\s', 'Ziffer / Wortzeichen / Leerraum (Großbuchstabe: Gegenteil)'],
      ['.', 'Beliebiges Zeichen außer Zeilenumbruch'],
      ['* / + / ?', '0 oder mehr / 1 oder mehr / 0 oder 1 (gierig)'],
      ['*? / +?', 'Nicht-gierige Varianten'],
      ['{n} / {n,m}', 'Genau n / n bis m Wiederholungen'],
      ['^ / $', 'Anfang / Ende (mit re.M pro Zeile)'],
      ['[abc] / [^abc]', 'Zeichenklasse / negierte Klasse'],
      ['\\b', 'Wortgrenze'],
      ['a|b', 'Alternative']
    ],
    example: e(`
import re

text = "Bestellung 4711 vom 16.11.2026, Betrag 59,90 EUR"

print(re.search(r"\\d{4}", text).group())  # 4711
print(re.findall(r"\\d+", text))  # ['4711', '16', '11', '2026', '59', '90']
print(re.sub(r"\\s+", " ", "a   b \\t c"))  # a b c

datum = re.search(r"(\\d{2})\\.(\\d{2})\\.(\\d{4})", text)
print(datum.groups())  # ('16', '11', '2026')
`),
    tip: "Muster interaktiv testen, z. B. auf regex101.com mit der Einstellung „Python“.",
    keywords: ['regex', 'regulärer ausdruck', 'regular expression', 'muster', 'pattern', 'regexp'],
    related: ['re.search()', 're.findall()', 're.sub()', 'Raw-Strings'],
    mdn: D + 're.html'
  },
  {
    lang: 'py', group: 'Reguläre Ausdrücke', name: 're.search()',
    desc: "Sucht den ersten Treffer irgendwo im String und liefert ein Match-Objekt oder None.",
    details: "`re.search()` durchsucht den ganzen String, `re.match()` dagegen nur den Anfang. Das Match-Objekt liefert mit `group()` den Treffer, mit `group(n)` bzw. `m[n]` die Gruppen und mit `span()` die Position. Ohne Treffer kommt `None` zurück – direkt `.group()` aufzurufen führt dann zu `AttributeError`. Der Walrus-Operator `:=` hält Prüfung und Zuweisung kompakt.",
    syntax: "re.search(muster, text, flags=0)",
    values: [
      ['m.group() / m[0]', 'Gesamter Treffer'],
      ['m.group(1) / m[1]', 'Erste Gruppe'],
      ['m.groups()', 'Alle Gruppen als Tupel'],
      ['m.start() / m.end() / m.span()', 'Position des Treffers']
    ],
    example: e(`
import re

m = re.search(r"(\\w+)@(\\w+)\\.de", "Kontakt: ada@firma.de, Tel. 123")
if m:
    print(m.group())             # ada@firma.de
    print(m.group(1), m[2])      # ada firma
    print(m.start(), m.span())   # 9 (9, 21)

print(re.search(r"\\d", "abc"))  # None

if (m := re.search(r"Tel\\. (\\d+)", "Kontakt: Tel. 123")):
    print(m[1])  # 123
`),
    tip: "Nie `re.search(...).group()` ohne Prüfung schreiben – bei fehlendem Treffer gibt es `'NoneType' object has no attribute 'group'`.",
    keywords: ['suchen', 'finden', 'match objekt', 'treffer', 'search', 'erster treffer'],
    related: ['re.match() & re.fullmatch()', 're.findall()', 'Regex-Gruppen', ':= (Walrus)'],
    mdn: D + 're.html#re.search'
  },
  {
    lang: 'py', group: 'Reguläre Ausdrücke', name: 're.match() & re.fullmatch()',
    desc: "Prüfen, ob ein Muster am Anfang bzw. auf den gesamten String passt.",
    details: "`re.match()` verankert das Muster nur am Anfang – Text dahinter ist erlaubt. `re.fullmatch()` verlangt, dass der ganze String passt, und ist damit die richtige Wahl für Validierungen (PLZ, IDs, Formate). Ein häufiger Fehler ist, `match` für Validierung zu verwenden und sich über durchgerutschte Eingaben wie „506671“ zu wundern.",
    syntax: "re.match(muster, text)\nre.fullmatch(muster, text)",
    example: e(`
import re

print(re.match(r"\\d+", "123abc"))  # <re.Match object; span=(0, 3), match='123'>
print(re.match(r"\\d+", "abc123"))  # None (nur am Anfang)
print(re.search(r"\\d+", "abc123").group())  # 123

# Validierung einer Postleitzahl
print(bool(re.fullmatch(r"\\d{5}", "50667")))   # True
print(bool(re.fullmatch(r"\\d{5}", "506671")))  # False
print(bool(re.match(r"\\d{5}", "506671")))      # True (Fallstrick!)
`),
    keywords: ['validieren', 'prüfen', 'anfang', 'ganzer string', 'validation', 'fullmatch', 'anker'],
    related: ['re.search()', 're.compile()', 're'],
    mdn: D + 're.html#re.fullmatch'
  },
  {
    lang: 'py', group: 'Reguläre Ausdrücke', name: 're.findall()',
    desc: "Liefert alle nicht überlappenden Treffer als Liste von Strings oder Tupeln.",
    details: "Ohne Gruppen enthält die Liste die Treffer selbst. Mit einer Gruppe nur deren Inhalt, mit mehreren Gruppen Tupel – das überrascht oft. Wer Gruppen nur zum Strukturieren braucht, nimmt nicht-erfassende Gruppen `(?:...)`. Ohne Treffer ist das Ergebnis eine leere Liste, nie `None`.",
    syntax: "re.findall(muster, text, flags=0)",
    example: e(`
import re

text = "Preise: 3,50 €, 12,00 € und 0,99 €"

print(re.findall(r"\\d+,\\d{2}", text))    # ['3,50', '12,00', '0,99']
print(re.findall(r"(\\d+),(\\d{2})", text))  # [('3', '50'), ('12', '00'), ('0', '99')]
print(re.findall(r"#(\\w+)", "Neu: #python #regex"))  # ['python', 'regex']

# Nicht-erfassende Gruppe: ganzer Treffer bleibt erhalten
print(re.findall(r"\\d+(?:,\\d+)?", "1 und 2,5"))  # ['1', '2,5']
print(re.findall(r"x", "abc"))  # []
`),
    tip: "Brauchst du Positionen oder benannte Gruppen, nimm `re.finditer()` – das liefert Match-Objekte.",
    keywords: ['alle treffer', 'extrahieren', 'find all', 'liste', 'matches', 'herausziehen'],
    related: ['re.finditer()', 're.search()', 'Regex-Gruppen'],
    mdn: D + 're.html#re.findall'
  },
  {
    lang: 'py', group: 'Reguläre Ausdrücke', name: 're.finditer()',
    desc: "Liefert einen Iterator über alle Treffer als Match-Objekte.",
    details: "`finditer()` kombiniert die Vorteile von `findall` und `search`: alle Treffer, aber jeweils mit Gruppen, Namen und Positionen. Es ist lazy und eignet sich damit auch für große Texte. Typisch für Log-Analysen oder Tokenizer.",
    syntax: "re.finditer(muster, text, flags=0)",
    example: e(`
import re

log = """ERROR 12:01 Platte voll
INFO 12:02 ok
ERROR 12:05 Timeout"""

for m in re.finditer(r"^ERROR (\\d\\d:\\d\\d) (.+)$", log, re.MULTILINE):
    print(m.start(), m[1], m[2])
# 0 12:01 Platte voll
# 38 12:05 Timeout

woerter = [m.group() for m in re.finditer(r"[A-Z]+", "abc DEF gh IJK")]
print(woerter)  # ['DEF', 'IJK']
`),
    keywords: ['iterator', 'alle treffer', 'positionen', 'match objekte', 'log parsen', 'tokenizer'],
    related: ['re.findall()', 'Regex-Flags', 'Regex-Gruppen'],
    mdn: D + 're.html#re.finditer'
  },
  {
    lang: 'py', group: 'Reguläre Ausdrücke', name: 're.sub()',
    desc: "Ersetzt alle Treffer durch einen Text oder das Ergebnis einer Funktion.",
    details: "Im Ersatztext verweisen `\\1` bzw. `\\g<name>` auf Gruppen; der Ersatztext sollte daher ebenfalls ein Raw-String sein. Statt eines Strings darf eine Funktion übergeben werden, die das Match-Objekt erhält und den Ersatz zurückgibt. `count` begrenzt die Anzahl der Ersetzungen, `re.subn()` liefert zusätzlich deren Anzahl.",
    syntax: "re.sub(muster, ersatz, text, count=0, flags=0)",
    example: e(`
import re

print(re.sub(r"\\d", "#", "PIN 1234"))  # PIN ####

# Gruppen umstellen: TT.MM.JJJJ -> JJJJ-MM-TT
print(re.sub(r"(\\d{2})\\.(\\d{2})\\.(\\d{4})", r"\\3-\\2-\\1", "am 16.11.2026"))  # am 2026-11-16

print(re.sub(r"(?P<user>\\w+)@", r"\\g<user> at ", "ada@x.de"))  # ada at x.de

# Funktion als Ersatz
print(re.sub(r"\\d+", lambda m: str(int(m[0]) * 2), "3 Äpfel, 10 Birnen"))  # 6 Äpfel, 20 Birnen

print(re.subn(r"a", "o", "Banane"))  # ('Bonone', 2)
`),
    tip: "Für einfaches Ersetzen ohne Muster ist `str.replace()` schneller und braucht kein Escaping.",
    keywords: ['ersetzen', 'replace', 'substitute', 'suchen und ersetzen', 'subn', 'rückverweis'],
    related: ['str.replace()', 'Regex-Gruppen', 're.split()'],
    mdn: D + 're.html#re.sub'
  },
  {
    lang: 'py', group: 'Reguläre Ausdrücke', name: 're.split()',
    desc: "Teilt einen String an allen Stellen, die auf ein Muster passen.",
    details: "`re.split()` ist flexibler als `str.split()`, weil es mehrere Trennzeichen und variable Abstände erlaubt. Enthält das Muster Gruppen, landen die Trennzeichen selbst mit in der Ergebnisliste. Am Anfang oder Ende entstehen leere Strings, wenn dort ein Trenner steht. `maxsplit` begrenzt die Anzahl der Teilungen.",
    syntax: "re.split(muster, text, maxsplit=0, flags=0)",
    example: e(`
import re

print(re.split(r"[,;]\\s*", "a, b;c;  d"))  # ['a', 'b', 'c', 'd']
print(re.split(r"\\s+", "  eins  zwei "))   # ['', 'eins', 'zwei', '']
print("  eins  zwei ".split())               # ['eins', 'zwei']

# Mit Gruppe bleiben die Trenner erhalten
print(re.split(r"(\\d)", "a1b2c"))  # ['a', '1', 'b', '2', 'c']
print(re.split(r",", "a,b,c,d", maxsplit=2))  # ['a', 'b', 'c,d']
`),
    keywords: ['aufteilen', 'trennen', 'split', 'mehrere trennzeichen', 'tokenisieren', 'zerlegen'],
    related: ['str.split()', 're.sub()', 're.findall()'],
    mdn: D + 're.html#re.split'
  },
  {
    lang: 'py', group: 'Reguläre Ausdrücke', name: 'Regex-Gruppen',
    desc: "Klammern im Muster: Teile erfassen, benennen, wiederholen oder wiederverwenden.",
    details: "Runde Klammern erfassen den passenden Teil, nummeriert ab 1. Benannte Gruppen `(?P<name>...)` machen Muster lesbarer und sind per `m[\"name\"]` oder `groupdict()` erreichbar. `(?:...)` gruppiert, ohne zu erfassen. Mit `\\1` bzw. `(?P=name)` verweist man im Muster selbst auf eine frühere Gruppe. Nicht beteiligte optionale Gruppen liefern `None`.",
    values: [
      ['(...)', 'Erfassende Gruppe'],
      ['(?P<name>...)', 'Benannte Gruppe'],
      ['(?:...)', 'Nicht-erfassende Gruppe'],
      ['\\1 / (?P=name)', 'Rückverweis im Muster'],
      ['(?=...) / (?!...)', 'Lookahead positiv / negativ'],
      ['(?<=...) / (?<!...)', 'Lookbehind positiv / negativ']
    ],
    example: e(`
import re

m = re.search(r"(?P<jahr>\\d{4})-(?P<monat>\\d{2})-(?P<tag>\\d{2})", "Release: 2026-11-16")
print(m["jahr"], m.group("monat"))  # 2026 11
print(m.groupdict())  # {'jahr': '2026', 'monat': '11', 'tag': '16'}
print(m.groups())     # ('2026', '11', '16')

print(re.findall(r"(?:ab)+", "ababx ab"))  # ['abab', 'ab']

# Doppelte Wörter finden
print(re.search(r"\\b(\\w+) \\1\\b", "das ist ist doppelt")[1])  # ist

# Lookahead: Zahl vor "€", ohne das Zeichen
print(re.findall(r"\\d+(?=€)", "5€ und 7$ und 9€"))  # ['5', '9']
print(re.match(r"(a)?b", "b").group(1))  # None
`),
    keywords: ['gruppe', 'capture group', 'benannte gruppe', 'named group', 'lookahead', 'lookbehind', 'rückverweis', 'backreference'],
    related: ['re.search()', 're.sub()', 're.findall()'],
    mdn: D + 're.html#regular-expression-syntax'
  },
  {
    lang: 'py', group: 'Reguläre Ausdrücke', name: 're.compile()',
    desc: "Übersetzt ein Muster einmal in ein wiederverwendbares Pattern-Objekt.",
    details: "Ein kompiliertes Muster hat dieselben Methoden wie das Modul (`search`, `match`, `findall`, `sub` …) und speichert die Flags gleich mit. Das lohnt sich für häufig genutzte Muster und macht Code lesbarer, wenn das Muster als Konstante mit sprechendem Namen definiert wird. Python cacht zwar auch Modul-Aufrufe, aber nur eine begrenzte Anzahl Muster.",
    syntax: "muster = re.compile(r\"...\", flags=0)",
    example: e(`
import re

PLZ = re.compile(r"\\b\\d{5}\\b")

for adresse in ["50667 Köln", "Berlin 10115", "ohne"]:
    m = PLZ.search(adresse)
    print(m.group() if m else "-")
# 50667
# 10115
# -

print(PLZ.pattern)  # \\b\\d{5}\\b
print(PLZ.findall("10115 und 80331"))  # ['10115', '80331']
`),
    keywords: ['kompilieren', 'pattern objekt', 'vorkompiliert', 'performance', 'wiederverwenden', 'compile'],
    related: ['re', 'Regex-Flags', 're.match() & re.fullmatch()'],
    mdn: D + 're.html#re.compile'
  },
  {
    lang: 'py', group: 'Reguläre Ausdrücke', name: 'Regex-Flags',
    desc: "Optionen wie IGNORECASE, MULTILINE, DOTALL und VERBOSE für Muster.",
    details: "Flags werden als `flags=`-Argument übergeben und mit `|` kombiniert, z. B. `re.I | re.M`. `MULTILINE` lässt `^` und `$` an jeder Zeile greifen, `DOTALL` lässt `.` auch Zeilenumbrüche erfassen. `VERBOSE` erlaubt Leerraum und Kommentare im Muster – ideal für komplexe Ausdrücke. Inline geht es auch am Musteranfang, z. B. `(?i)`.",
    values: [
      ['re.I / re.IGNORECASE', 'Groß-/Kleinschreibung ignorieren'],
      ['re.M / re.MULTILINE', '^ und $ pro Zeile'],
      ['re.S / re.DOTALL', '. passt auch auf \\n'],
      ['re.X / re.VERBOSE', 'Leerraum und # Kommentare im Muster'],
      ['re.A / re.ASCII', '\\w, \\d usw. nur ASCII']
    ],
    example: e(`
import re

print(re.findall(r"python", "Python PYTHON python", re.IGNORECASE))  # ['Python', 'PYTHON', 'python']
print(re.findall(r"^\\w", "a=1\\nb=2", re.M))  # ['a', 'b']
print(bool(re.search(r"a.b", "a\\nb", re.S)))   # True

telefon = re.compile(r"""
    (\\d{3,5})   # Vorwahl
    [-/\\s]?     # optionaler Trenner
    (\\d{4,8})   # Rufnummer
""", re.VERBOSE)
print(telefon.search("Tel 030 1234567").groups())  # ('030', '1234567')

print(re.findall(r"(?i)ja", "Ja JA ja"))    # ['Ja', 'JA', 'ja']
print(re.findall(r"\\w+", "Grüße", re.ASCII))  # ['Gr', 'e']
`),
    keywords: ['flags', 'ignorecase', 'multiline', 'dotall', 'verbose', 'groß kleinschreibung', 'case insensitive', 'optionen'],
    related: ['re.compile()', 're', 're.finditer()'],
    mdn: D + 're.html#flags'
  },

  // ---------------- System & Prozesse ----------------
  {
    lang: 'py', group: 'System & Prozesse', name: 'sys',
    desc: "Zugriff auf den Interpreter: Version, Pfade, Standardströme, Argumente.",
    details: "`sys` liefert Informationen über die laufende Python-Umgebung und Zugriff auf `stdin`, `stdout` und `stderr`. Fehlermeldungen gehören nach `sys.stderr`, damit sie bei Umleitungen der normalen Ausgabe sichtbar bleiben. `sys.path` bestimmt, wo Module gesucht werden. Mit `sys.version_info` prüft man die Python-Version als Tupel.",
    values: [
      ['sys.argv', 'Kommandozeilenargumente'],
      ['sys.exit(code)', 'Programm mit Exit-Code beenden'],
      ['sys.version_info', 'Python-Version als vergleichbares Tupel'],
      ['sys.platform', 'Plattformkennung (linux, win32, darwin)'],
      ['sys.executable', 'Pfad zum laufenden Interpreter'],
      ['sys.stdin / stdout / stderr', 'Standardströme'],
      ['sys.path', 'Suchpfade für Importe']
    ],
    example: e(`
import sys

print(sys.version_info >= (3, 12))  # True
print(sys.version_info[:2])         # z. B. (3, 14)
print(sys.platform)                 # z. B. linux, win32 oder darwin
print(sys.executable)               # z. B. /usr/bin/python3
print(sys.getrecursionlimit())      # 1000

print("Warnung!", file=sys.stderr)  # landet auf stderr, nicht stdout
print(sys.maxsize == 2**63 - 1)     # True (auf 64-Bit-Systemen)
`),
    tip: "Im Unterprozess denselben Interpreter nutzen: `subprocess.run([sys.executable, ...])` statt `\"python\"`.",
    keywords: ['system', 'interpreter', 'version', 'stderr', 'stdout', 'plattform', 'python version'],
    related: ['sys.argv', 'sys.exit()', 'Modulsuche & sys.path', 'platform'],
    mdn: D + 'sys.html'
  },
  {
    lang: 'py', group: 'System & Prozesse', name: 'sys.argv',
    desc: "Liste der Kommandozeilenargumente; sys.argv[0] ist der Skriptname.",
    details: "Beim Aufruf `python skript.py eingabe.txt -v` enthält `sys.argv` die Liste `['skript.py', 'eingabe.txt', '-v']`. Alle Werte sind Strings und müssen bei Bedarf umgewandelt werden. Für mehr als ein, zwei einfache Argumente ist `argparse` die bessere Wahl, weil es Hilfe, Typen und Fehlermeldungen mitbringt.",
    syntax: "sys.argv[0]   # Skriptname\nsys.argv[1:]  # eigentliche Argumente",
    example: e(`
import sys

# Aufruf z. B.: python skript.py eingabe.txt --verbose
print(sys.argv[0])  # z. B. skript.py

args = sys.argv[1:]
print(args)  # [] ohne Argumente, sonst z. B. ['eingabe.txt', '--verbose']

datei = args[0] if args else "standard.txt"
verbose = "--verbose" in args
print(datei, verbose)  # standard.txt False (ohne Argumente)
`),
    tip: "Zahlen aus `sys.argv` mit `int(...)` umwandeln und den `ValueError` bei falscher Eingabe abfangen.",
    keywords: ['argumente', 'kommandozeile', 'parameter', 'cli', 'command line arguments', 'argv'],
    related: ['argparse', 'sys', 'sys.exit()'],
    mdn: D + 'sys.html#sys.argv'
  },
  {
    lang: 'py', group: 'System & Prozesse', name: 'sys.exit()',
    desc: "Beendet das Programm mit einem Exit-Code (0 = Erfolg).",
    details: "`sys.exit(code)` löst intern `SystemExit` aus; `finally`-Blöcke und `with`-Aufräumarbeiten laufen daher noch. 0 bedeutet Erfolg, andere Zahlen Fehler; ein String wird nach stderr ausgegeben und ergibt Code 1. Ein pauschales `except BaseException` oder nacktes `except:` fängt `SystemExit` versehentlich ab. Üblich ist das Muster `sys.exit(main())`.",
    syntax: "sys.exit(code=0)",
    example: e(`
import sys

def main() -> int:
    if len(sys.argv) > 5:
        print("Zu viele Argumente", file=sys.stderr)
        return 2
    print("Alles gut")
    return 0

try:
    sys.exit(3)
except SystemExit as e:
    print("Exit-Code:", e.code)  # Exit-Code: 3

if __name__ == "__main__":
    sys.exit(main())  # Alles gut (Exit-Code 0)
`),
    tip: "In Bibliotheksfunktionen nie `sys.exit()` aufrufen, sondern Exceptions werfen – das Beenden entscheidet das Hauptprogramm.",
    keywords: ['beenden', 'exit code', 'rückgabecode', 'systemexit', 'programm beenden', 'quit'],
    related: ['sys', 'sys.argv', 'if __name__ == \"__main__\"'],
    mdn: D + 'sys.html#sys.exit'
  },
  {
    lang: 'py', group: 'System & Prozesse', name: 'argparse',
    desc: "Baut Kommandozeilen-Schnittstellen mit Optionen, Typen und automatischer Hilfe.",
    details: "Mit `add_argument` definiert man Positionsargumente (`\"pfad\"`) und Optionen (`\"-v\"`, `\"--verbose\"`). `type=int` wandelt automatisch um, `action=\"store_true\"` erzeugt Schalter, `choices` begrenzt Werte. Bei falschen Eingaben gibt argparse eine Fehlermeldung aus und beendet mit Code 2; `-h` zeigt die generierte Hilfe. Bindestriche in Optionsnamen werden zu Unterstrichen im Attribut.",
    values: [
      ['add_argument(\"name\")', 'Pflicht-Positionsargument'],
      ['add_argument(\"-k\", \"--key\")', 'Option mit Wert'],
      ['type=int', 'Wert umwandeln'],
      ['default=...', 'Standardwert'],
      ['action=\"store_true\"', 'Schalter ohne Wert'],
      ['choices=[...]', 'Erlaubte Werte'],
      ['nargs=\"+\" / \"*\"', 'Mehrere Werte']
    ],
    example: e(`
import argparse

parser = argparse.ArgumentParser(description="Dateien zählen")
parser.add_argument("pfad", help="Startordner")
parser.add_argument("-e", "--endung", default=".py")
parser.add_argument("-n", "--max-tiefe", type=int, default=10)
parser.add_argument("-v", "--verbose", action="store_true")

# Normalerweise: args = parser.parse_args()  (liest sys.argv)
args = parser.parse_args(["src", "-e", ".txt", "--verbose"])
print(args.pfad, args.endung, args.max_tiefe, args.verbose)  # src .txt 10 True
print(vars(args))
# {'pfad': 'src', 'endung': '.txt', 'max_tiefe': 10, 'verbose': True}
`),
    tip: "Zum Testen eine Liste an `parse_args([...])` übergeben – so braucht man keine echte Kommandozeile.",
    keywords: ['kommandozeile', 'cli', 'optionen', 'argumente parsen', 'command line', 'hilfe', 'flags'],
    related: ['sys.argv', 'sys.exit()', 'shlex'],
    mdn: D + 'argparse.html'
  },
  {
    lang: 'py', group: 'System & Prozesse', name: 'subprocess',
    desc: "Startet externe Programme, wartet auf sie und liest ihre Ausgabe.",
    details: "`subprocess.run([...])` ist die Standardschnittstelle: Befehl als Liste, `capture_output=True` sammelt Ausgaben, `text=True` liefert Strings statt bytes, `check=True` wirft bei Exit-Code ≠ 0 eine `CalledProcessError`. `shell=True` nur mit festen Befehlen verwenden – mit Benutzereingaben droht Command Injection. `timeout=` verhindert endlos hängende Prozesse.",
    syntax: "subprocess.run(args, capture_output=False, text=False, check=False, cwd=None, timeout=None)",
    values: [
      ['capture_output=True', 'stdout und stderr einsammeln'],
      ['text=True', 'Ausgabe als str dekodieren'],
      ['check=True', 'Exception bei Exit-Code ungleich 0'],
      ['cwd=pfad', 'Arbeitsverzeichnis des Kindprozesses'],
      ['input=\"...\"', 'Daten an stdin übergeben'],
      ['timeout=s', 'Abbruch nach s Sekunden']
    ],
    example: e(`
import subprocess
import sys

r = subprocess.run([sys.executable, "-c", "print('Hallo aus dem Kindprozess')"],
                   capture_output=True, text=True, check=True)
print(r.returncode)       # 0
print(r.stdout.strip())   # Hallo aus dem Kindprozess

r = subprocess.run([sys.executable, "-c", "import sys; sys.exit(3)"])
print(r.returncode)  # 3

try:
    subprocess.run([sys.executable, "-c", "raise SystemExit(1)"], check=True)
except subprocess.CalledProcessError as fehler:
    print("Fehlgeschlagen mit", fehler.returncode)  # Fehlgeschlagen mit 1
`),
    tip: "Unter Windows sind viele Befehle wie `dir` Shell-Builtins und keine Programme – die funktionieren nur mit `shell=True`.",
    keywords: ['prozess', 'externes programm', 'befehl ausführen', 'shell', 'kommando', 'run command', 'popen'],
    related: ['shlex', 'sys', 'os.environ'],
    mdn: D + 'subprocess.html'
  },
  {
    lang: 'py', group: 'System & Prozesse', name: 'os.environ',
    desc: "Dict-artiger Zugriff auf die Umgebungsvariablen des Prozesses.",
    details: "`os.environ[\"NAME\"]` löst `KeyError` aus, wenn die Variable fehlt; `os.environ.get(\"NAME\", standard)` bzw. `os.getenv` liefert stattdessen einen Standardwert. Alle Werte sind Strings. Änderungen gelten für den eigenen Prozess und werden an Kindprozesse vererbt, nicht aber an die aufrufende Shell. Umgebungsvariablen sind der übliche Weg für Konfiguration und Geheimnisse in Containern.",
    syntax: "os.environ[\"NAME\"]\nos.environ.get(\"NAME\", standard)\nos.getenv(\"NAME\")",
    example: e(`
import os

os.environ["APP_MODUS"] = "test"
print(os.environ["APP_MODUS"])  # test

port = int(os.environ.get("APP_PORT", "8080"))
print(port)  # 8080 (wenn APP_PORT nicht gesetzt ist)
print(os.getenv("GIBT_ES_NICHT"))  # None

debug = os.getenv("DEBUG", "").lower() in {"1", "true", "ja"}
print(debug)  # False

del os.environ["APP_MODUS"]
print("APP_MODUS" in os.environ)  # False
`),
    tip: "Ja/Nein-Werte nie mit `bool(os.getenv(...))` prüfen – auch `\"false\"` und `\"0\"` sind nicht leer und damit `True`.",
    keywords: ['umgebungsvariable', 'environment', 'env', 'getenv', 'konfiguration', 'secrets', 'path'],
    related: ['os', 'subprocess', 'dict.get()'],
    mdn: D + 'os.html#os.environ'
  },
  {
    lang: 'py', group: 'System & Prozesse', name: 'logging',
    desc: "Flexibles Protokollieren mit Leveln, Formaten und Ausgabezielen statt print().",
    details: "Pro Modul holt man sich mit `logging.getLogger(__name__)` einen Logger und konfiguriert die Ausgabe einmal zentral mit `basicConfig`. Nachrichten unterhalb des eingestellten Levels werden verworfen – standardmäßig ist das `WARNING`. Platzhalter wie `%s` übergibt man als Argumente, damit nur formatiert wird, wenn die Nachricht wirklich ausgegeben wird. `log.exception()` im `except`-Block hängt den Traceback an.",
    values: [
      ['DEBUG', 'Details für die Fehlersuche'],
      ['INFO', 'Normale Abläufe'],
      ['WARNING', 'Auffälligkeiten (Standard-Schwelle)'],
      ['ERROR', 'Fehler, Programm läuft weiter'],
      ['CRITICAL', 'Schwere Fehler'],
      ['%(asctime)s %(levelname)s %(name)s %(message)s', 'Häufige Format-Platzhalter']
    ],
    example: e(`
import logging
import sys

logging.basicConfig(level=logging.INFO, stream=sys.stdout,
                    format="%(levelname)s %(name)s: %(message)s")
log = logging.getLogger("app")

log.debug("unsichtbar")                  # unter der Schwelle INFO
log.info("Start mit %d Dateien", 3)      # INFO app: Start mit 3 Dateien
log.warning("Platte fast voll")          # WARNING app: Platte fast voll

try:
    1 / 0
except ZeroDivisionError:
    log.exception("Rechnen fehlgeschlagen")  # ERROR app: Rechnen fehlgeschlagen + Traceback
`),
    tip: "`basicConfig` wirkt nur beim ersten Aufruf; mit `force=True` überschreibt man eine bestehende Konfiguration.",
    keywords: ['log', 'protokoll', 'logger', 'debug', 'level', 'ausgabe', 'logdatei', 'tracing'],
    related: ['print()', 'warnings', 'traceback'],
    mdn: 'https://docs.python.org/3/howto/logging.html'
  },
  {
    lang: 'py', group: 'System & Prozesse', name: 'shlex',
    desc: "Zerlegt und quotet Kommandozeilen nach Shell-Regeln (POSIX).",
    details: "`shlex.split()` teilt einen Befehlsstring wie eine Shell, berücksichtigt also Anführungszeichen. `shlex.quote()` maskiert einen einzelnen Wert sicher für die Shell, `shlex.join()` baut aus einer Liste einen Befehl. Die Regeln entsprechen POSIX-Shells (bash, sh), nicht der Windows-Eingabeaufforderung.",
    values: [
      ['shlex.split(s)', 'String in Argumentliste zerlegen'],
      ['shlex.quote(s)', 'Wert sicher für die Shell quoten'],
      ['shlex.join(liste)', 'Liste zu Befehlsstring zusammensetzen']
    ],
    example: e(`
import shlex

befehl = 'git commit -m "erster Commit" --amend'
print(shlex.split(befehl))  # ['git', 'commit', '-m', 'erster Commit', '--amend']

print(shlex.quote("mein bericht.txt"))  # 'mein bericht.txt'
print(shlex.quote("einfach"))           # einfach
print(shlex.join(["ls", "-l", "mein ordner"]))  # ls -l 'mein ordner'
`),
    tip: "Ein Befehl aus einer Konfiguration? `subprocess.run(shlex.split(befehl))` statt `shell=True`.",
    keywords: ['shell', 'quoting', 'kommandozeile zerlegen', 'escapen', 'split command', 'anführungszeichen'],
    related: ['subprocess', 'argparse', 'str.split()'],
    mdn: D + 'shlex.html'
  },
  {
    lang: 'py', group: 'System & Prozesse', name: 'platform',
    desc: "Informationen über Betriebssystem, Hardware und Python-Implementierung.",
    details: "`platform` liefert lesbare Angaben wie Betriebssystemname, Version, Prozessorarchitektur und Python-Version. Für Verzweigungen im Code reicht oft `sys.platform`; `platform.system()` ist für Ausgaben und Fehlerberichte gedacht. Die Werte unterscheiden sich je nach System, Tests sollten sie daher nicht fest erwarten.",
    values: [
      ['platform.system()', 'Linux, Windows, Darwin (macOS)'],
      ['platform.release() / version()', 'Version des Betriebssystems'],
      ['platform.machine()', 'Architektur, z. B. x86_64, AMD64, arm64'],
      ['platform.python_version()', 'Python-Version als String'],
      ['platform.python_implementation()', 'CPython, PyPy …'],
      ['platform.platform()', 'Kompakte Gesamtbeschreibung']
    ],
    example: e(`
import platform

print(platform.system())          # z. B. Linux, Windows oder Darwin
print(platform.machine())         # z. B. x86_64, AMD64 oder arm64
print(platform.python_version())  # z. B. 3.14.0
print(platform.python_implementation())  # CPython

if platform.system() == "Windows":
    print("Pfade mit Backslash")
else:
    print("Pfade mit Slash")
`),
    keywords: ['betriebssystem', 'os erkennen', 'architektur', 'version', 'windows', 'linux', 'macos', 'system info'],
    related: ['sys', 'os'],
    mdn: D + 'platform.html'
  },

  // ---------------- itertools & functools ----------------
  {
    lang: 'py', group: 'itertools & functools', name: 'itertools.chain()',
    desc: "Hängt mehrere Iterables hintereinander, ohne eine neue Liste zu bauen.",
    details: "`chain(a, b, c)` liefert erst alle Elemente von `a`, dann von `b` usw. – lazy und speicherschonend. `chain.from_iterable(x)` nimmt ein einziges Iterable aus Iterables entgegen und eignet sich so zum Abflachen einer Ebene von Verschachtelung. Tiefere Verschachtelungen glättet es nicht.",
    syntax: "chain(*iterables)\nchain.from_iterable(iterable_von_iterables)",
    example: e(`
from itertools import chain

a, b = [1, 2], (3, 4)
print(list(chain(a, b, "xy")))  # [1, 2, 3, 4, 'x', 'y']

verschachtelt = [[1, 2], [3], []]
print(list(chain.from_iterable(verschachtelt)))  # [1, 2, 3]

# Über mehrere Listen iterieren ohne Kopie
for x in chain(range(2), range(10, 12)):
    print(x, end=" ")  # 0 1 10 11
print()
`),
    keywords: ['verketten', 'aneinanderhängen', 'flatten', 'abflachen', 'concat', 'zusammenfügen', 'itertools'],
    related: ['itertools.islice()', 'Verschachtelte Comprehensions', 'zip()'],
    mdn: D + 'itertools.html#itertools.chain'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'itertools.product()',
    desc: "Kartesisches Produkt: alle Kombinationen aus mehreren Iterables.",
    details: "`product(a, b)` entspricht verschachtelten `for`-Schleifen über `a` und `b`. Mit `repeat=n` kombiniert man ein Iterable mit sich selbst, z. B. für alle Bitmuster. Die Anzahl der Ergebnisse wächst schnell (Produkt aller Längen) – bei großen Eingaben nicht in eine Liste umwandeln.",
    syntax: "product(*iterables, repeat=1)",
    example: e(`
from itertools import product

print(list(product("AB", [1, 2])))  # [('A', 1), ('A', 2), ('B', 1), ('B', 2)]

for groesse, farbe in product(["S", "M"], ["rot", "blau"]):
    print(groesse, farbe)
# S rot / S blau / M rot / M blau

bits = ["".join(b) for b in product("01", repeat=3)]
print(bits)  # ['000', '001', '010', '011', '100', '101', '110', '111']
`),
    keywords: ['kartesisches produkt', 'kombinationen', 'alle möglichkeiten', 'verschachtelte schleifen', 'cartesian'],
    related: ['itertools.permutations()', 'itertools.combinations()', 'Verschachtelte Comprehensions'],
    mdn: D + 'itertools.html#itertools.product'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'itertools.permutations()',
    desc: "Alle Anordnungen (Reihenfolge zählt) von Elementen, optional nur r davon.",
    details: "`permutations(xs, r)` liefert alle geordneten Auswahlen von `r` Elementen ohne Wiederholung; ohne `r` werden alle Elemente angeordnet. Elemente gelten nach Position als verschieden, gleiche Werte erzeugen also doppelte Ergebnisse. Die Anzahl wächst mit n! extrem schnell – für das reine Zählen gibt es `math.perm(n, r)`.",
    syntax: "permutations(iterable, r=None)",
    example: e(`
import math
from itertools import permutations

print(list(permutations("ABC", 2)))
# [('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('C', 'A'), ('C', 'B')]

print(["".join(p) for p in permutations("abc")])
# ['abc', 'acb', 'bac', 'bca', 'cab', 'cba']

print(math.perm(5, 2))  # 20 (nur zählen)
print(len(set(permutations("aab"))))  # 3 (Duplikate entfernt)
`),
    keywords: ['permutation', 'anordnungen', 'reihenfolge', 'vertauschen', 'anagramm', 'fakultät'],
    related: ['itertools.combinations()', 'itertools.product()', 'math'],
    mdn: D + 'itertools.html#itertools.permutations'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'itertools.combinations()',
    desc: "Alle Auswahlen von r Elementen, bei denen die Reihenfolge keine Rolle spielt.",
    details: "`combinations(xs, r)` liefert Tupel in der Reihenfolge der Eingabe, jedes Paar nur einmal – ideal für „jeder gegen jeden“. `combinations_with_replacement` erlaubt, dass ein Element mehrfach gewählt wird. Zum bloßen Zählen ohne Erzeugen dient `math.comb(n, r)`.",
    syntax: "combinations(iterable, r)\ncombinations_with_replacement(iterable, r)",
    example: e(`
import math
from itertools import combinations, combinations_with_replacement

teams = ["Ada", "Bob", "Cy"]
for a, b in combinations(teams, 2):
    print(f"{a} gegen {b}")
# Ada gegen Bob / Ada gegen Cy / Bob gegen Cy

print(list(combinations_with_replacement("ab", 2)))  # [('a', 'a'), ('a', 'b'), ('b', 'b')]
print(math.comb(49, 6))  # 13983816 (Lotto 6 aus 49)
`),
    keywords: ['kombination', 'auswahl', 'paare', 'jeder gegen jeden', 'teilmengen', 'n über k', 'binomial'],
    related: ['itertools.permutations()', 'itertools.product()', 'math'],
    mdn: D + 'itertools.html#itertools.combinations'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'itertools.groupby()',
    desc: "Fasst aufeinanderfolgende Elemente mit gleichem Schlüssel zu Gruppen zusammen.",
    details: "`groupby()` gruppiert nur benachbarte Elemente – für eine echte Gruppierung muss die Eingabe vorher nach demselben Schlüssel sortiert werden. Jede Gruppe ist ein Iterator, der ungültig wird, sobald man zur nächsten Gruppe weitergeht; daher sofort in eine Liste umwandeln. Für Gruppieren ohne Sortieren ist `collections.defaultdict(list)` oft einfacher.",
    syntax: "groupby(iterable, key=None)",
    example: e(`
from itertools import groupby

woerter = ["Apfel", "Avocado", "Birne", "Banane", "Aprikose"]

def erster(w):
    return w[0]

for buchstabe, gruppe in groupby(sorted(woerter), key=erster):
    print(buchstabe, list(gruppe))
# A ['Apfel', 'Aprikose', 'Avocado']
# B ['Banane', 'Birne']

# Ohne Sortieren: A taucht zweimal auf!
print([k for k, _ in groupby(woerter, key=erster)])  # ['A', 'B', 'A']

# Lauflängen zählen
print([(k, len(list(g))) for k, g in groupby("aaabbc")])  # [('a', 3), ('b', 2), ('c', 1)]
`),
    tip: "Faustregel: `groupby(sorted(xs, key=f), key=f)` – zweimal derselbe Schlüssel.",
    keywords: ['gruppieren', 'group by', 'zusammenfassen', 'lauflänge', 'run length', 'kategorien'],
    related: ['sorted()', 'collections.defaultdict', 'collections.Counter'],
    mdn: D + 'itertools.html#itertools.groupby'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'itertools.islice()',
    desc: "Slicing für beliebige Iteratoren – auch für Generatoren und unendliche Folgen.",
    details: "Generatoren und Dateiobjekte lassen sich nicht mit `[a:b]` schneiden; `islice(it, start, stop, step)` geht. Negative Werte sind nicht erlaubt. `islice` verbraucht den zugrunde liegenden Iterator: übersprungene Elemente sind danach weg. Typisch, um die ersten n Elemente eines unendlichen Generators zu nehmen.",
    syntax: "islice(iterable, stop)\nislice(iterable, start, stop, step=1)",
    example: e(`
from itertools import count, islice

print(list(islice("ABCDEFG", 3)))         # ['A', 'B', 'C']
print(list(islice(range(100), 10, 20, 3)))  # [10, 13, 16, 19]

quadrate = (n * n for n in count(1))  # unendlich
print(list(islice(quadrate, 5)))      # [1, 4, 9, 16, 25]
print(next(quadrate))                 # 36 (Iterator läuft weiter)

with open("log.txt", "w", encoding="utf-8") as f:
    f.writelines(f"Zeile {i}\\n" for i in range(100))
with open("log.txt", encoding="utf-8") as f:
    print([z.strip() for z in islice(f, 2)])  # ['Zeile 0', 'Zeile 1']
`),
    keywords: ['slicing', 'erste n', 'head', 'take', 'iterator schneiden', 'ausschnitt', 'unendlich'],
    related: ['itertools.count() & cycle()', 'Generator', 'Slicing'],
    mdn: D + 'itertools.html#itertools.islice'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'itertools.count() & cycle()',
    desc: "Unendliche Iteratoren: fortlaufend zählen oder eine Folge endlos wiederholen.",
    details: "`count(start, step)` zählt ohne Ende, `cycle(xs)` wiederholt die Elemente endlos, `repeat(x, n)` liefert einen Wert n-mal (ohne n unendlich). Weil sie nie enden, braucht man immer ein Abbruchkriterium: `zip`, `islice`, `break` oder `next`. `list(count())` hängt das Programm auf.",
    syntax: "count(start=0, step=1)\ncycle(iterable)\nrepeat(objekt, times=None)",
    example: e(`
from itertools import count, cycle, repeat

for nr, name in zip(count(100, 10), ["Ada", "Bob", "Cy"]):
    print(nr, name)
# 100 Ada / 110 Bob / 120 Cy

farben = cycle(["rot", "grün"])
print([next(farben) for _ in range(5)])  # ['rot', 'grün', 'rot', 'grün', 'rot']

print(list(repeat("x", 3)))  # ['x', 'x', 'x']
`),
    tip: "Zebrastreifen in Tabellen: `for zeile, farbe in zip(zeilen, cycle([\"hell\", \"dunkel\"]))`.",
    keywords: ['unendlich', 'zählen', 'wiederholen', 'endlos', 'repeat', 'round robin', 'zähler'],
    related: ['itertools.islice()', 'zip()', 'enumerate()'],
    mdn: D + 'itertools.html#itertools.count'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'itertools.accumulate()',
    desc: "Laufende Zwischenergebnisse: Summen, Produkte, Maxima Schritt für Schritt.",
    details: "Ohne Funktion bildet `accumulate()` laufende Summen. Mit einer zweistelligen Funktion wie `max` oder `operator.mul` entstehen laufende Maxima bzw. Produkte. `initial=` stellt einen Startwert voran, das Ergebnis wird dadurch ein Element länger. Im Gegensatz zu `functools.reduce` liefert es alle Zwischenstände, nicht nur das Endergebnis.",
    syntax: "accumulate(iterable, func=operator.add, *, initial=None)",
    example: e(`
import operator
from itertools import accumulate

print(list(accumulate([1, 2, 3, 4])))          # [1, 3, 6, 10]
print(list(accumulate([3, 1, 4, 1, 5], max)))  # [3, 3, 4, 4, 5]
print(list(accumulate([1, 2, 3, 4], operator.mul)))  # [1, 2, 6, 24]
print(list(accumulate([10, 20], initial=100)))  # [100, 110, 130]

# Kontostand aus Buchungen
buchungen = [500, -120, -80, 200]
print(list(accumulate(buchungen)))  # [500, 380, 300, 500]
`),
    keywords: ['laufende summe', 'kumulativ', 'running total', 'prefix sum', 'zwischensumme', 'scan'],
    related: ['functools.reduce()', 'sum()', 'operator'],
    mdn: D + 'itertools.html#itertools.accumulate'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'itertools.pairwise()',
    desc: "Liefert überlappende Paare aufeinanderfolgender Elemente (seit 3.10).",
    details: "`pairwise([a, b, c])` ergibt `(a, b)` und `(b, c)` – ideal für Differenzen, Abstände oder Übergänge. Bei weniger als zwei Elementen ist das Ergebnis leer. Vorher schrieb man dafür `zip(xs, xs[1:])`, was nur mit Sequenzen funktioniert; `pairwise` klappt mit jedem Iterable.",
    syntax: "pairwise(iterable)",
    example: e(`
from itertools import pairwise

print(list(pairwise([1, 4, 9, 16])))  # [(1, 4), (4, 9), (9, 16)]

messwerte = [10, 12, 9, 15]
print([b - a for a, b in pairwise(messwerte)])  # [2, -3, 6]

route = ["Köln", "Bonn", "Koblenz"]
for start, ziel in pairwise(route):
    print(f"{start} -> {ziel}")
# Köln -> Bonn / Bonn -> Koblenz

print(list(pairwise("a")))  # []
`),
    keywords: ['paare', 'nachbarn', 'aufeinanderfolgend', 'differenzen', 'sliding window', 'gleitendes fenster'],
    related: ['zip()', 'itertools.batched()', 'itertools.islice()'],
    mdn: D + 'itertools.html#itertools.pairwise'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'itertools.batched()',
    desc: "Teilt ein Iterable in Tupel fester Größe auf (seit 3.12).",
    details: "`batched(xs, n)` liefert Tupel mit je `n` Elementen, das letzte darf kürzer sein. Seit Python 3.13 erzwingt `strict=True` volle Stapel und wirft sonst `ValueError`. Praktisch für Datenbank-Inserts in Blöcken, API-Aufrufe mit Limits oder das Aufteilen in Zeilen.",
    syntax: "batched(iterable, n, *, strict=False)",
    example: e(`
from itertools import batched

print(list(batched("ABCDEFG", 3)))  # [('A', 'B', 'C'), ('D', 'E', 'F'), ('G',)]

for stapel in batched(range(1, 8), 3):
    print(sum(stapel), end=" ")  # 6 15 7
print()

try:
    list(batched("ABCD", 3, strict=True))  # seit Python 3.13
except ValueError as fehler:
    print(fehler)  # batched(): incomplete batch
`),
    tip: "Auf Python 3.11 und älter nachbauen: `zip(*[iter(xs)] * n)` – das verwirft allerdings einen unvollständigen Rest.",
    keywords: ['stapel', 'chunks', 'blöcke', 'aufteilen', 'batch', 'gruppen fester größe', 'paging'],
    related: ['itertools.islice()', 'itertools.pairwise()', 'Slicing'],
    mdn: D + 'itertools.html#itertools.batched'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'functools.reduce()',
    desc: "Faltet ein Iterable mit einer zweistelligen Funktion zu einem einzigen Wert zusammen.",
    details: "`reduce(f, [a, b, c])` berechnet `f(f(a, b), c)`. Mit einem Startwert (`initial`) funktioniert es auch bei leeren Eingaben, ohne ihn gibt es dann `TypeError`. Für Summen, Maxima oder Verkettung gibt es lesbarere Spezialfunktionen (`sum`, `max`, `str.join`, `math.prod`); `reduce` lohnt sich für eigene Verknüpfungen.",
    syntax: "reduce(funktion, iterable[, initial])",
    example: e(`
import operator
from functools import reduce

print(reduce(operator.add, [1, 2, 3, 4]))           # 10
print(reduce(lambda a, b: a * b, [1, 2, 3, 4], 1))  # 24

# Verschachtelten Pfad in einem Dict auflösen
konfig = {"db": {"verbindung": {"port": 5432}}}
print(reduce(lambda d, k: d[k], ["db", "verbindung", "port"], konfig))  # 5432

try:
    reduce(operator.add, [])
except TypeError as fehler:
    print(fehler)  # reduce() of empty iterable with no initial value
`),
    keywords: ['falten', 'fold', 'aggregieren', 'zusammenfassen', 'akkumulieren', 'funktional'],
    related: ['itertools.accumulate()', 'sum()', 'operator', 'lambda'],
    mdn: D + 'functools.html#functools.reduce'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'functools.partial()',
    desc: "Erzeugt eine neue Funktion mit vorbelegten Argumenten.",
    details: "`partial(f, *args, **kwargs)` friert einige Argumente ein; die restlichen werden beim Aufruf ergänzt. Das ist nützlich für Callbacks, `map` oder `sorted(key=...)`, wenn eine Funktion mehr Parameter erwartet als übergeben werden. Gegenüber einem `lambda` ist `partial` introspektierbar (`.func`, `.args`, `.keywords`) und picklebar.",
    syntax: "partial(funktion, *args, **kwargs)",
    example: e(`
from functools import partial

def potenz(basis, exponent):
    return basis ** exponent

quadrat = partial(potenz, exponent=2)
print(quadrat(5))  # 25

binaer = partial(int, base=2)
print(binaer("1010"))  # 10
print(list(map(binaer, ["1", "11", "111"])))  # [1, 3, 7]

print(quadrat.func.__name__, quadrat.keywords)  # potenz {'exponent': 2}
`),
    keywords: ['teilanwendung', 'partial application', 'currying', 'argumente vorbelegen', 'callback'],
    related: ['lambda', 'Closures', 'map()'],
    mdn: D + 'functools.html#functools.partial'
  },
  {
    lang: 'py', group: 'itertools & functools', name: 'operator',
    desc: "Operatoren als Funktionen sowie itemgetter, attrgetter und methodcaller.",
    details: "`operator.add`, `operator.mul` usw. ersetzen kleine Lambdas wie `lambda a, b: a + b`. Besonders praktisch sind `itemgetter` (Index oder Schlüssel), `attrgetter` (Attribut) und `methodcaller` als `key`-Funktionen für `sorted`, `min`, `max` und `groupby`. Sie sind schneller und oft lesbarer als gleichwertige Lambdas.",
    values: [
      ['add, sub, mul, truediv', 'Arithmetische Operatoren'],
      ['eq, lt, gt', 'Vergleiche'],
      ['itemgetter(i, ...)', 'Holt obj[i] (mehrere: Tupel)'],
      ['attrgetter(\"a.b\")', 'Holt obj.a.b'],
      ['methodcaller(\"name\", *args)', 'Ruft obj.name(*args) auf']
    ],
    example: e(`
import operator
from datetime import date
from operator import attrgetter, itemgetter, methodcaller

personen = [("Ada", 36), ("Linus", 54), ("Bob", 29)]
print(sorted(personen, key=itemgetter(1)))  # [('Bob', 29), ('Ada', 36), ('Linus', 54)]
print(itemgetter(0, 2)("abc"))  # ('a', 'c')

print(operator.add(2, 3), operator.mul(4, 5))  # 5 20

tage = [date(2026, 5, 1), date(2025, 1, 1)]
print(max(tage, key=attrgetter("year")))  # 2026-05-01

print(list(map(methodcaller("upper"), ["a", "b"])))  # ['A', 'B']
`),
    keywords: ['operatoren als funktion', 'itemgetter', 'attrgetter', 'methodcaller', 'sortierschlüssel', 'key function'],
    related: ['sorted()', 'functools.reduce()', 'lambda'],
    mdn: D + 'operator.html'
  }
  );
})();
