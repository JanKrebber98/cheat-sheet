window.CHEAT = window.CHEAT || [];
(function () {
  var D = 'https://docs.python.org/3/library/';   // + z. B. 'stdtypes.html#str.split'
  var R = 'https://docs.python.org/3/reference/'; // Sprachreferenz
  var T = 'https://docs.python.org/3/tutorial/';  // Tutorial
  var P = 'https://docs.python.org/3/';           // Sonstiges (FAQ, Glossar, using)
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Python-Grundlagen ----------------
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'Was ist Python?',
    desc: "Dynamisch typisierte, interpretierte Allzwecksprache mit Fokus auf Lesbarkeit.",
    details: "Python-Quelltext (`.py`) wird von CPython, der Referenzimplementierung, zu Bytecode übersetzt und direkt ausgeführt, ein separater Compile-Schritt entfällt. Typen hängen an den Werten, nicht an den Variablen; geprüft wird erst zur Laufzeit. Blöcke werden durch Einrückung statt Klammern gebildet. Die große Standardbibliothek („batteries included“) und der Paketindex PyPI decken fast jedes Einsatzgebiet ab.",
    syntax: "Quelltext (.py) -> python -> Bytecode (.pyc, Cache) -> Interpreter",
    values: [
      ['CPython', 'Referenzimplementierung in C, das übliche „python“'],
      ['PyPI', 'Python Package Index, Quelle für pip-Pakete'],
      ['Bytecode', 'Zwischencode, zwischengespeichert in __pycache__/*.pyc'],
      ['REPL', 'Interaktive Konsole: python ohne Argumente starten'],
      ['PEP', 'Python Enhancement Proposal: Dokument für Sprachänderungen']
    ],
    example: e(`
import sys
import platform

# Version und Implementierung des laufenden Interpreters
print(sys.version_info >= (3, 12))          # True
print(platform.python_implementation())     # CPython
print(sys.version.split()[0])               # z. B. 3.14.0
`),
    tip: "Neue Projekte immer mit einer aktuellen Version (3.12 oder neuer) beginnen; Python 2 ist seit 2020 ohne Support.",
    keywords: ['einführung', 'what is python', 'interpreter', 'cpython', 'skriptsprache', 'dynamisch', 'pypi', 'version'],
    related: ['Hello World', 'python (Interpreter & REPL)', 'Einrückung'],
    mdn: P + 'faq/general.html#what-is-python'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'Hello World',
    desc: "Das kleinste Python-Programm: eine einzige print-Zeile, ohne Klasse und main.",
    details: "Ein Python-Skript wird von oben nach unten ausgeführt; Code auf oberster Ebene läuft sofort. Gestartet wird mit `python hallo.py` (unter Windows auch `py hallo.py`). Strings dürfen in einfachen oder doppelten Anführungszeichen stehen. Häufiger Fehler: `print \"Hallo\"` ohne Klammern ist Python-2-Syntax und ergibt einen `SyntaxError`.",
    syntax: "print(\"Hallo, Welt!\")",
    example: e(`
# Datei: hallo.py, Start mit: python hallo.py
print("Hallo, Welt!")        # Hallo, Welt!

name = "Ada"
print(f"Hallo, {name}!")     # Hallo, Ada!
`),
    tip: "Unter Windows startet der Launcher `py` die neueste installierte Version, `py -3.12` eine bestimmte.",
    keywords: ['hallo welt', 'erstes programm', 'print', 'ausgabe', 'einstieg', 'skript'],
    related: ['print()', 'python (Interpreter & REPL)', 'f-String'],
    mdn: T + 'introduction.html'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'python (Interpreter & REPL)',
    desc: "Startet Skripte, Module oder die interaktive Konsole (REPL).",
    details: "Ohne Argumente öffnet `python` die REPL, die Ausdrücke sofort auswertet und das Ergebnis anzeigt; `_` enthält dort das letzte Ergebnis. Seit Python 3.13 hat die REPL Farben, mehrzeiliges Bearbeiten und Befehle wie `exit` ohne Klammern. `python -m modul` führt ein Modul als Skript aus, z. B. `python -m venv` oder `python -m http.server`. Unter Linux/macOS heißt der Befehl oft `python3`, unter Windows gibt es zusätzlich den Launcher `py`.",
    syntax: "python [Optionen] datei.py [Argumente]\npython -m modul [Argumente]\npython -c \"code\"",
    values: [
      ['-m modul', 'Modul als Skript ausführen'],
      ['-c code', 'Code-String ausführen'],
      ['-i', 'Nach dem Skript in die REPL wechseln'],
      ['-V / --version', 'Version anzeigen'],
      ['-X utf8', 'UTF-8-Modus erzwingen'],
      ['-I', 'Isoliert: ohne Benutzer-Pakete und Umgebungsvariablen'],
      ['-O', 'Optimiert: assert-Anweisungen entfernen']
    ],
    example: e(`
# Version anzeigen
python --version

# Skript mit Argumenten starten
python skript.py eins zwei

# Einzeiler und Module ausführen
python -c "print(2 ** 10)"
python -m http.server 8000

# Interaktive Konsole
python
>>> 6 * 7
42
>>> _ + 1
43
>>> exit
`),
    exampleLang: 'sh',
    tip: "Mit `python -i skript.py` landet man nach dem Lauf in der REPL und kann alle Variablen des Skripts untersuchen.",
    keywords: ['repl', 'konsole', 'interaktiv', 'shell', 'kommandozeile', 'cli', 'py launcher', 'python3', '-m'],
    related: ['Was ist Python?', 'Shebang', '__main__.py & python -m'],
    mdn: P + 'using/cmdline.html'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'Einrückung',
    desc: "Blöcke werden durch Einrückung gebildet, ein Doppelpunkt leitet sie ein.",
    details: "Nach `if`, `for`, `def`, `class` usw. folgt ein Doppelpunkt, der Block darunter ist einheitlich eingerückt; üblich sind 4 Leerzeichen. Das Ende der Einrückung beendet den Block, geschweifte Klammern gibt es nicht. Tabs und Leerzeichen zu mischen führt zu `TabError`, falsche Tiefe zu `IndentationError`. Ein leerer Block braucht `pass`.",
    syntax: "kopfzeile:\n    anweisung\n    anweisung",
    example: e(`
def bewerte(punkte):
    if punkte >= 50:
        ergebnis = "bestanden"
    else:
        ergebnis = "nicht bestanden"
    return ergebnis          # gehört wieder zur Funktion

print(bewerte(72))           # bestanden
print(bewerte(30))           # nicht bestanden
`),
    tip: "Editor auf „Tab = 4 Leerzeichen“ stellen; Formatter wie Ruff oder Black sorgen automatisch für einheitliche Einrückung.",
    keywords: ['indentation', 'einrücken', 'block', 'leerzeichen', 'tab', 'IndentationError', 'TabError', 'doppelpunkt'],
    related: ['pass', 'PEP 8', 'if / elif / else'],
    mdn: R + 'lexical_analysis.html#indentation'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'Kommentare',
    desc: "Mit # beginnt ein Kommentar bis zum Zeilenende; Blockkommentare gibt es nicht.",
    details: "Alles nach `#` (außerhalb eines Strings) ignoriert der Interpreter. Mehrzeilige Kommentare schreibt man als mehrere `#`-Zeilen. Ein dreifach gequoteter String ist kein Kommentar, sondern ein Ausdruck, der nur zufällig nichts bewirkt; am Anfang von Funktionen wird er zum Docstring. Spezielle Kommentare wie `# type: ignore` oder `# noqa` werten Werkzeuge aus.",
    syntax: "# Kommentar\ncode  # Kommentar am Zeilenende",
    example: e(`
# Zeilenkommentar
preis = 19.99  # Kommentar am Zeilenende (laut PEP 8 zwei Leerzeichen davor)

# Mehrzeiliger Kommentar:
# einfach jede Zeile
# mit # beginnen

# rabatt = 0.1   (auskommentierter Code)
print(preis)   # 19.99
`),
    tip: "In den meisten Editoren kommentiert `Strg+#` bzw. `Strg+/` markierte Zeilen ein und aus.",
    keywords: ['comment', 'kommentar', 'raute', 'hash', 'auskommentieren', 'noqa'],
    related: ['Docstrings', 'PEP 8'],
    mdn: R + 'lexical_analysis.html#comments'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'Docstrings',
    desc: "Dokumentations-String als erste Anweisung in Modul, Klasse oder Funktion.",
    details: "Ein String-Literal direkt am Anfang eines Moduls, einer Klasse oder Funktion wird im Attribut `__doc__` gespeichert und von `help()`, IDEs und Doku-Werkzeugen angezeigt. Konvention (PEP 257): dreifache doppelte Anführungszeichen, erste Zeile als kurze Zusammenfassung, danach eine Leerzeile und Details. Verbreitete Formate für Parameter sind Google-, NumPy- und reST-Stil.",
    syntax: "def f():\n    \"\"\"Kurzbeschreibung.\n\n    Details ...\n    \"\"\"",
    example: e(`
def flaeche(breite, hoehe):
    """Berechnet die Fläche eines Rechtecks.

    Args:
        breite: Breite in Metern.
        hoehe: Höhe in Metern.

    Returns:
        Die Fläche in Quadratmetern.
    """
    return breite * hoehe

print(flaeche(3, 4))                      # 12
print(flaeche.__doc__.splitlines()[0])    # Berechnet die Fläche eines Rechtecks.
`),
    tip: "Mit `doctest` lassen sich Beispiele im Docstring (`>>> ...`) automatisch als Tests ausführen.",
    keywords: ['docstring', 'dokumentation', '__doc__', 'pep 257', 'help', 'dreifache anführungszeichen'],
    related: ['Kommentare', 'doctest', 'def'],
    mdn: T + 'controlflow.html#documentation-strings'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'PEP 8',
    desc: "Der offizielle Stilleitfaden für Python-Code: Namen, Einrückung, Leerzeichen.",
    details: "PEP 8 legt fest, wie Python-Code aussehen soll; der Interpreter erzwingt nichts davon, aber praktisch alle Projekte folgen ihm. Kernregeln: 4 Leerzeichen Einrückung, `snake_case` für Funktionen und Variablen, `CapWords` für Klassen, `GROSS_MIT_UNTERSTRICH` für Konstanten. Imports stehen oben, gruppiert nach Standardbibliothek, Fremdpaketen und eigenem Code. Statt die Regeln von Hand zu prüfen, nutzt man Ruff oder Black.",
    values: [
      ['snake_case', 'Funktionen, Variablen, Module: berechne_summe'],
      ['CapWords', 'Klassen und Exceptions: KundenKonto'],
      ['GROSS_MIT_UNTERSTRICH', 'Konstanten: MAX_VERSUCHE'],
      ['_name', 'Intern, nicht Teil der öffentlichen API'],
      ['Zeilenlänge', '79 Zeichen laut PEP 8, in Projekten oft 88–120'],
      ['Leerzeilen', '2 um Funktionen/Klassen auf oberster Ebene, 1 zwischen Methoden']
    ],
    example: e(`
import math                      # Standardbibliothek zuerst

MAX_RADIUS = 10                  # Konstante


class Kreis:                     # Klasse: CapWords
    def __init__(self, radius):
        self.radius = radius

    def flaeche(self):           # Methode: snake_case
        return math.pi * self.radius ** 2


kleiner_kreis = Kreis(2)         # Variable: snake_case
print(round(kleiner_kreis.flaeche(), 2))   # 12.57
`),
    tip: "„A foolish consistency is the hobgoblin of little minds“: Lesbarkeit im Einzelfall geht vor sturer Regelbefolgung.",
    keywords: ['stil', 'style guide', 'konvention', 'namenskonvention', 'snake_case', 'formatierung', 'linter'],
    related: ['Ruff & Black', 'Einrückung', 'Bezeichner'],
    mdn: T + 'controlflow.html#intermezzo-coding-style'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'Anweisungen & Ausdrücke',
    desc: "Ausdrücke liefern einen Wert, Anweisungen steuern den Ablauf; eine pro Zeile.",
    details: "Ein Ausdruck (`3 + 4`, `len(x)`, `a if b else c`) ergibt einen Wert und kann überall stehen, wo ein Wert erwartet wird. Anweisungen wie `if`, `for`, `def`, `return` oder die Zuweisung `x = 1` liefern keinen Wert. Pro Zeile steht normalerweise eine Anweisung, ein Semikolon am Ende ist unnötig; mehrere einfache Anweisungen lassen sich mit `;` trennen, das gilt aber als schlechter Stil.",
    example: e(`
x = 3 + 4                  # Zuweisung (Anweisung) mit Ausdruck rechts
print(x * 2)               # 14

# Ausdruck an Stelle eines Werts
status = "gerade" if x % 2 == 0 else "ungerade"
print(status)              # ungerade

a = 1; b = 2               # möglich, aber unüblich
print(a + b)               # 3
`),
    tip: "Weil die Zuweisung `=` kein Ausdruck ist, schützt Python vor dem Klassiker `if x = 5:`; für Zuweisung im Ausdruck gibt es `:=`.",
    keywords: ['statement', 'expression', 'anweisung', 'ausdruck', 'semikolon', 'zeile'],
    related: ['Zuweisung', ':= (Walrus)', 'Bedingter Ausdruck'],
    mdn: R + 'simple_stmts.html'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'Zeilenfortsetzung',
    desc: "Lange Anweisungen über mehrere Zeilen: in Klammern implizit, sonst mit Backslash.",
    details: "Innerhalb von runden, eckigen oder geschweiften Klammern darf ein Ausdruck beliebig umbrochen werden (implizite Fortsetzung). Ohne Klammern verbindet ein `\\` am Zeilenende zwei Zeilen; danach darf nichts mehr stehen, auch kein Leerzeichen oder Kommentar. PEP 8 empfiehlt Klammern statt Backslash. Benachbarte String-Literale werden automatisch verkettet.",
    syntax: "ergebnis = (teil1\n            + teil2)\nergebnis = teil1 + \\\n           teil2",
    example: e(`
# Implizit in Klammern (empfohlen)
summe = (1 + 2 + 3
         + 4 + 5)
print(summe)                      # 15

zahlen = [
    10, 20,
    30,                           # nachgestelltes Komma ist erlaubt
]
print(len(zahlen))                # 3

# Explizit mit Backslash
gesamt = 100 + \\
         50
print(gesamt)                     # 150

# Benachbarte Strings werden verbunden
text = ("Hallo, "
        "Welt")
print(text)                       # Hallo, Welt
`),
    tip: "Ein nachgestelltes Komma in mehrzeiligen Listen sorgt für saubere Diffs, wenn später Elemente dazukommen.",
    keywords: ['zeilenumbruch', 'line continuation', 'backslash', 'mehrzeilig', 'lange zeile', 'klammern'],
    related: ['PEP 8', 'Strings (Literale)', 'Anweisungen & Ausdrücke'],
    mdn: R + 'lexical_analysis.html#explicit-line-joining'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'Schlüsselwörter',
    desc: "Reservierte Wörter wie if, def, class, die nicht als Namen erlaubt sind.",
    details: "Python hat 35 harte Schlüsselwörter, darunter `True`, `False`, `None`, `and`, `or`, `not`, `if`, `for`, `while`, `def`, `class`, `return`, `import`, `try`, `with`, `async`, `await`, `lambda` und `yield`. Dazu kommen weiche Schlüsselwörter wie `match`, `case`, `type` und `_`, die nur im passenden Kontext reserviert sind und sonst als Namen erlaubt bleiben. Das Modul `keyword` liefert die aktuelle Liste.",
    values: [
      ['keyword.kwlist', 'Liste der harten Schlüsselwörter'],
      ['keyword.softkwlist', 'Liste der weichen Schlüsselwörter'],
      ['keyword.iskeyword(s)', 'Prüft, ob s ein Schlüsselwort ist']
    ],
    example: e(`
import keyword

print(len(keyword.kwlist))             # 35
print(keyword.iskeyword("class"))      # True
print(keyword.iskeyword("print"))      # False (eingebaute Funktion, kein Schlüsselwort)
print(sorted(keyword.softkwlist))      # ['_', 'case', 'match', 'type']

match = "erlaubt"                      # weiches Schlüsselwort als Name
print(match)                           # erlaubt
`),
    tip: "Für Namen, die mit einem Schlüsselwort kollidieren, hängt man laut PEP 8 einen Unterstrich an: `class_`, `from_`.",
    keywords: ['keyword', 'reserviert', 'reserved words', 'soft keyword', 'kwlist'],
    related: ['Bezeichner', 'match', 'type (Typ-Alias)'],
    mdn: R + 'lexical_analysis.html#keywords'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'Shebang',
    desc: "Erste Zeile #!/usr/bin/env python3 macht ein Skript unter Unix direkt ausführbar.",
    details: "Beginnt eine Datei mit `#!`, liest das Betriebssystem daraus den Interpreter; nach `chmod +x skript.py` startet `./skript.py` dann ohne vorangestelltes `python`. `/usr/bin/env python3` sucht den Interpreter im `PATH` und funktioniert damit auch in virtuellen Umgebungen. Unter Windows wertet der Launcher `py` die Zeile ebenfalls aus. Für Python selbst ist die Zeile nur ein Kommentar.",
    syntax: "#!/usr/bin/env python3",
    example: e(`
#!/usr/bin/env python3
"""Kleines Skript: chmod +x zaehle.py && ./zaehle.py"""
import sys


def main():
    print(f"{len(sys.argv) - 1} Argumente")   # ohne Argumente: 0 Argumente


if __name__ == "__main__":
    main()
`),
    tip: "Die Datei muss Unix-Zeilenenden (LF) haben, sonst meldet die Shell „python3\\r: No such file or directory“.",
    keywords: ['hashbang', 'skript ausführbar', 'chmod', 'env', 'unix', 'linux', 'executable'],
    related: ['python (Interpreter & REPL)', 'if __name__ == "__main__"', 'sys.argv'],
    mdn: T + 'appendix.html#executable-python-scripts'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'if __name__ == "__main__"',
    desc: "Führt Code nur aus, wenn die Datei direkt gestartet und nicht importiert wird.",
    details: "Jedes Modul hat die Variable `__name__`: Beim direkten Start (`python datei.py`) ist sie `\"__main__\"`, beim Import der Modulname. Mit der Abfrage trennt man wiederverwendbare Funktionen vom Startcode, damit ein Import keine Nebenwirkungen hat. Üblich ist eine Funktion `main()`, die im Block aufgerufen wird. Bei `multiprocessing` unter Windows und macOS ist der Schutz Pflicht, sonst starten Kindprozesse den Code erneut.",
    syntax: "if __name__ == \"__main__\":\n    main()",
    example: e(`
def addiere(a, b):
    return a + b


def main():
    print(addiere(2, 3))     # 5


print(__name__)              # __main__ (beim direkten Start)

if __name__ == "__main__":
    main()                   # läuft nicht, wenn die Datei importiert wird
`),
    tip: "`sys.exit(main())` gibt den Rückgabewert von `main()` als Exit-Code an die Shell weiter.",
    keywords: ['main', '__name__', '__main__', 'einstiegspunkt', 'entry point', 'import guard', 'skript'],
    related: ['import', '__main__.py & python -m', 'sys.exit()'],
    mdn: D + '__main__.html#name-main'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'print()',
    desc: "Gibt Werte auf der Standardausgabe aus, getrennt durch Leerzeichen.",
    details: "`print()` wandelt jedes Argument mit `str()` um, trennt sie mit `sep` und hängt `end` an (Standard: Zeilenumbruch). Mit `file=sys.stderr` geht die Ausgabe auf den Fehlerkanal, mit `flush=True` wird sofort geschrieben, etwa bei Fortschrittsanzeigen. Für formatierte Ausgaben kombiniert man `print` mit f-Strings.",
    syntax: "print(*werte, sep=' ', end='\\n', file=sys.stdout, flush=False)",
    values: [
      ['*werte', 'Beliebig viele Werte, werden mit str() umgewandelt'],
      ['sep', 'Trenner zwischen den Werten (Standard: Leerzeichen)'],
      ['end', 'Wird am Ende angehängt (Standard: Zeilenumbruch)'],
      ['file', 'Ziel, z. B. sys.stderr oder eine geöffnete Datei'],
      ['flush', 'True: Puffer sofort leeren']
    ],
    example: e(`
print("a", "b", 3)               # a b 3
print("a", "b", sep="-")         # a-b
print("ohne Umbruch", end=" | ")
print("weiter")                  # ohne Umbruch | weiter

zahlen = [1, 2, 3]
print(*zahlen, sep=", ")         # 1, 2, 3

preis = 4.5
print(f"Preis: {preis:.2f} €")   # Preis: 4.50 €
print()                          # leere Zeile
`),
    tip: "Für Debug-Ausgaben ist `print(f\"{x=}\")` praktisch: Es gibt Name und Wert aus, z. B. `x=42`.",
    keywords: ['ausgabe', 'output', 'konsole', 'stdout', 'sep', 'end', 'flush', 'drucken', 'console.log'],
    related: ['f-String', 'input()', 'Hello World'],
    mdn: D + 'functions.html#print'
  },
  {
    lang: 'py', group: 'Python-Grundlagen', name: 'input()',
    desc: "Liest eine Zeile von der Tastatur und gibt sie als String zurück.",
    details: "`input(prompt)` zeigt den optionalen Text an, wartet auf Enter und liefert die Eingabe ohne Zeilenumbruch, immer als `str`. Zahlen muss man selbst mit `int()` oder `float()` umwandeln; ungültige Eingaben werfen `ValueError`. Endet die Eingabe (Strg+D bzw. Strg+Z, oder umgeleitete Datei zu Ende), wird `EOFError` ausgelöst.",
    syntax: "text = input(\"Eingabeaufforderung: \")",
    example: e(`
name = input("Wie heißt du? ")
print(f"Hallo, {name}!")

# Zahl einlesen mit Fehlerbehandlung
while True:
    try:
        alter = int(input("Alter: "))
        break
    except ValueError:
        print("Bitte eine ganze Zahl eingeben.")

print(f"In 10 Jahren bist du {alter + 10}.")
`),
    nocheck: true,
    tip: "Häufiger Fehler: `input(\"Zahl: \") + 1` ergibt `TypeError`, weil die Eingabe ein String ist.",
    keywords: ['eingabe', 'tastatur', 'benutzereingabe', 'stdin', 'einlesen', 'prompt', 'user input'],
    related: ['print()', 'Typumwandlung', 'try / except'],
    mdn: D + 'functions.html#input'
  },

  // ---------------- Datentypen & Literale ----------------
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'int',
    desc: "Ganzzahl mit beliebiger Genauigkeit, ohne Überlauf.",
    details: "`int` wächst bei Bedarf automatisch, `2 ** 100` ist exakt; es gibt keine getrennten Typen für kurze und lange Zahlen. `int(x)` wandelt Strings und Floats um, schneidet dabei Nachkommastellen ab (Richtung 0). Die Umwandlung sehr langer Strings (über 4300 Ziffern) ist aus Sicherheitsgründen standardmäßig begrenzt. `bool` ist eine Unterklasse von `int`.",
    syntax: "int(x)\nint(text, basis)",
    values: [
      ['int("42")', 'String zu int: 42'],
      ['int("ff", 16)', 'Mit Basis: 255'],
      ['int(3.9)', 'Abschneiden Richtung 0: 3'],
      ['n.bit_length()', 'Anzahl benötigter Bits'],
      ['n.to_bytes(len, "big")', 'Als bytes darstellen']
    ],
    example: e(`
a = 2 ** 100
print(a)                  # 1267650600228229401496703205376
print(type(a))            # <class 'int'>

print(int("42") + 1)      # 43
print(int("ff", 16))      # 255
print(int(-3.9))          # -3 (schneidet ab, rundet nicht)
print((255).bit_length()) # 8
print(7 // 2, 7 % 2)      # 3 1
`),
    tip: "Für große Zahlen im Quelltext Unterstriche nutzen: `1_000_000` ist besser lesbar als `1000000`.",
    keywords: ['integer', 'ganzzahl', 'ganze zahl', 'bigint', 'beliebige genauigkeit', 'zahl', 'number'],
    related: ['float', 'Zahlenliterale', 'Typumwandlung', '// und %'],
    mdn: D + 'stdtypes.html#numeric-types-int-float-complex'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'float',
    desc: "Gleitkommazahl mit doppelter Genauigkeit (IEEE 754, 64 Bit).",
    details: "Ein Literal mit Punkt oder Exponent (`3.0`, `1e-3`) ist ein `float`. Wie in jeder Sprache sind viele Dezimalbrüche nicht exakt darstellbar, `0.1 + 0.2 == 0.3` ist `False`. Vergleiche deshalb mit `math.isclose()`, für Geldbeträge `decimal.Decimal` verwenden. Die Division `/` liefert immer einen `float`, auch bei `4 / 2`.",
    syntax: "float(x)",
    values: [
      ['float("3.5")', 'String zu float'],
      ['x.is_integer()', 'True, wenn keine Nachkommastellen'],
      ['x.as_integer_ratio()', 'Exakter Bruch als (Zähler, Nenner)'],
      ['sys.float_info.max', 'Größter float, ca. 1.8e308']
    ],
    example: e(`
import math

print(4 / 2)                       # 2.0
print(0.1 + 0.2)                   # 0.30000000000000004
print(0.1 + 0.2 == 0.3)            # False
print(math.isclose(0.1 + 0.2, 0.3))  # True
print(float("1.5e3"))              # 1500.0
print((2.0).is_integer())          # True
print(round(2.675, 2))             # 2.67 (nicht 2.68: Darstellungsfehler)
`),
    tip: "`round()` rundet bei .5 auf die nächste gerade Zahl („Banker's Rounding“): `round(2.5)` ist 2.",
    keywords: ['gleitkommazahl', 'kommazahl', 'fließkomma', 'double', 'dezimalzahl', 'floating point', 'ieee 754'],
    related: ['int', 'Gleitkomma-Fallstricke', 'decimal', 'NaN & Unendlich'],
    mdn: D + 'stdtypes.html#numeric-types-int-float-complex'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'NaN & Unendlich',
    desc: "Spezielle float-Werte: inf, -inf und nan (Not a Number).",
    details: "`float('inf')` bzw. `math.inf` ist größer als jede Zahl und eignet sich als Startwert für Minimumsuchen. `nan` entsteht z. B. bei `inf - inf` und ist zu nichts gleich, nicht einmal zu sich selbst; prüfen daher nur mit `math.isnan()`. Python wirft bei `1 / 0` eine `ZeroDivisionError` statt `inf` zu liefern.",
    values: [
      ['math.inf / float("inf")', 'Positive Unendlichkeit'],
      ['math.nan / float("nan")', 'Not a Number'],
      ['math.isnan(x)', 'Prüft auf NaN'],
      ['math.isinf(x)', 'Prüft auf ±Unendlich'],
      ['math.isfinite(x)', 'Weder NaN noch Unendlich']
    ],
    example: e(`
import math

kleinster = math.inf
for wert in [7, 3, 9]:
    kleinster = min(kleinster, wert)
print(kleinster)                 # 3

n = math.inf - math.inf
print(n)                         # nan
print(n == n)                    # False
print(math.isnan(n))             # True
print(float("-inf") < -1e308)    # True
`),
    tip: "NaN in Listen bringt `sorted()` und `max()` durcheinander, weil alle Vergleiche `False` liefern; vorher herausfiltern.",
    keywords: ['nan', 'inf', 'infinity', 'unendlich', 'not a number', 'isnan', 'isinf'],
    related: ['float', 'math', 'Gleitkomma-Fallstricke'],
    mdn: D + 'math.html#math.isnan'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'complex',
    desc: "Komplexe Zahl mit Real- und Imaginärteil, Literal mit j: 3+4j.",
    details: "Der Imaginärteil wird mit `j` (oder `J`) geschrieben, wie in der Elektrotechnik. Real- und Imaginärteil sind `float` und über `.real` und `.imag` erreichbar, `abs(z)` liefert den Betrag. Für Funktionen wie Wurzel oder Exponentialfunktion im Komplexen gibt es das Modul `cmath`, `math` arbeitet nur mit reellen Zahlen.",
    syntax: "z = 3 + 4j\ncomplex(real, imag)",
    example: e(`
import cmath

z = 3 + 4j
print(z.real, z.imag)       # 3.0 4.0
print(abs(z))               # 5.0
print(z.conjugate())        # (3-4j)
print(z * 1j)               # (-4+3j)
print(complex(1, -2))       # (1-2j)
print(cmath.sqrt(-1))       # 1j
`),
    tip: "`math.sqrt(-1)` wirft `ValueError`, `cmath.sqrt(-1)` liefert `1j`.",
    keywords: ['komplexe zahl', 'complex number', 'imaginär', 'j', 'cmath', 'real'],
    related: ['int', 'float', 'math'],
    mdn: D + 'stdtypes.html#numeric-types-int-float-complex'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'bool',
    desc: "Wahrheitswert True oder False, eine Unterklasse von int.",
    details: "`True` und `False` werden großgeschrieben. Weil `bool` von `int` erbt, gilt `True == 1` und `False == 0`, man kann sie also addieren, etwa um Treffer zu zählen. `bool(x)` liefert den Wahrheitswert eines beliebigen Objekts nach den Truthiness-Regeln. Achtung: `bool(\"False\")` ist `True`, weil der String nicht leer ist.",
    syntax: "True\nFalse\nbool(x)",
    example: e(`
ist_aktiv = True
print(type(ist_aktiv))             # <class 'bool'>
print(True + True)                 # 2
print(isinstance(True, int))       # True

noten = [1, 4, 2, 5, 3]
print(sum(n <= 3 for n in noten))  # 3 (Anzahl der True-Werte)

print(bool(0), bool(""), bool([0]))  # False False True
print(bool("False"))               # True (nicht leerer String)
`),
    tip: "Text wie `\"ja\"`/`\"nein\"` vergleicht man explizit (`s.lower() == \"ja\"`), statt `bool(s)` zu verwenden.",
    keywords: ['boolean', 'wahrheitswert', 'true', 'false', 'wahr', 'falsch', 'boolesch'],
    related: ['Truthiness', 'and / or / not', 'int'],
    mdn: D + 'stdtypes.html#boolean-type-bool'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'None',
    desc: "Das einzige Objekt vom Typ NoneType: steht für „kein Wert“.",
    details: "Funktionen ohne `return` geben `None` zurück. `None` dient als Platzhalter für fehlende Werte und als Standardwert für optionale Parameter. Weil es genau ein `None`-Objekt gibt, prüft man mit `is None` bzw. `is not None`, nicht mit `==`. `None` ist falsy, aber `if not x:` trifft auch auf `0` und `\"\"` zu; wer nur `None` meint, schreibt `if x is None:`.",
    syntax: "x = None\nif x is None: ...",
    example: e(`
def finde(namen, gesucht):
    for i, n in enumerate(namen):
        if n == gesucht:
            return i
    # kein return -> None

pos = finde(["Ada", "Bob"], "Eve")
print(pos)                 # None
print(pos is None)         # True
print(type(None))          # <class 'NoneType'>

def gruss(name=None):
    return f"Hallo {name or 'Gast'}"
print(gruss())             # Hallo Gast
`),
    tip: "Als Standardwert für veränderliche Parameter immer `None` verwenden und in der Funktion eine neue Liste anlegen.",
    keywords: ['null', 'nil', 'nichts', 'kein wert', 'nonetype', 'leer', 'is none'],
    related: ['is / is not', 'Truthiness', 'Veränderliche Standardwerte (Fallstrick)', 'X | None (Optional)'],
    mdn: D + 'constants.html#None'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'Zahlenliterale',
    desc: "Schreibweisen für Zahlen: dezimal, 0x, 0o, 0b, Exponent und Unterstriche.",
    details: "Ganzzahlen gibt es dezimal, hexadezimal (`0xff`), oktal (`0o17`) und binär (`0b1010`). Gleitkommazahlen schreibt man mit Punkt oder Exponent (`2.5e-3`). Unterstriche gruppieren Ziffern (`1_000_000`) und werden ignoriert. Führende Nullen bei Dezimalzahlen (`007`) sind ein `SyntaxError`; die Gegenrichtung liefern `bin()`, `oct()`, `hex()`.",
    values: [
      ['42', 'Dezimal'],
      ['0x2A', 'Hexadezimal'],
      ['0o52', 'Oktal'],
      ['0b101010', 'Binär'],
      ['1_000_000', 'Mit Tausendertrennern'],
      ['1.5e3', 'Exponentschreibweise (float): 1500.0'],
      ['2j', 'Imaginär (complex)']
    ],
    example: e(`
print(0x2A, 0o52, 0b101010)      # 42 42 42
print(1_000_000)                 # 1000000
print(1.5e3, 2.5e-3)             # 1500.0 0.0025

print(hex(255), oct(8), bin(5))  # 0xff 0o10 0b101
print(f"{255:08b}")              # 11111111
print(f"{1234567:_}")            # 1_234_567
`),
    tip: "Zum Parsen von Strings in anderer Basis: `int(\"1010\", 2)` ergibt 10; mit Basis 0 wird das Präfix ausgewertet.",
    keywords: ['literal', 'hex', 'hexadezimal', 'binär', 'oktal', 'exponent', 'unterstrich', 'tausendertrenner', 'binary', 'zahlensystem'],
    related: ['int', 'float', 'Bitoperatoren'],
    mdn: R + 'lexical_analysis.html#numeric-literals'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'Strings (Literale)',
    desc: "Text vom Typ str in einfachen, doppelten oder dreifachen Anführungszeichen.",
    details: "`'...'` und `\"...\"` sind gleichwertig; so lässt sich die jeweils andere Sorte ohne Escape einbetten. Dreifache Anführungszeichen erlauben mehrzeiligen Text. Präfixe ändern die Bedeutung: `f` für f-Strings, `r` für Raw-Strings ohne Escapes, `b` für bytes, seit Python 3.14 `t` für Template-Strings. Strings sind unveränderlich und bestehen aus Unicode-Zeichen.",
    values: [
      ["'text' / \"text\"", 'Normaler String'],
      ['"""text"""', 'Mehrzeiliger String'],
      ['f"{x}"', 'f-String mit eingebetteten Ausdrücken'],
      ['r"C:\\pfad"', 'Raw-String: Backslash bleibt erhalten'],
      ['b"daten"', 'bytes-Literal'],
      ['t"{x}"', 'Template-String (seit Python 3.14)']
    ],
    example: e(`
a = 'Er sagte "Hallo"'
b = "It's fine"
c = """Zeile 1
Zeile 2"""
d = "Tab:\\tEnde"
pfad = r"C:\\neu\\tabelle"

print(a)                    # Er sagte "Hallo"
print(len(c.splitlines()))  # 2
print(d)                    # Tab:	Ende (mit Tabulator)
print(pfad)                 # C:\\neu\\tabelle
print("ab" * 3 + "!")       # ababab!
print(type(b))              # <class 'str'>
`),
    tip: "Es gibt keinen eigenen Zeichentyp: Ein einzelnes Zeichen ist ein String der Länge 1.",
    keywords: ['string', 'zeichenkette', 'text', 'str', 'anführungszeichen', 'quotes', 'literal', 'präfix'],
    related: ['f-String', 'Raw-Strings', 'Escape-Sequenzen', 'Mehrzeilige Strings'],
    mdn: R + 'lexical_analysis.html#string-and-bytes-literals'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'bytes',
    desc: "Unveränderliche Folge von Bytes (0–255) für Binärdaten, Literal b\"...\".",
    details: "`str` enthält Text (Unicode), `bytes` rohe Bytes, etwa aus Dateien im Binärmodus, Netzwerk oder Hashes. Umgewandelt wird mit `text.encode(\"utf-8\")` und `daten.decode(\"utf-8\")`. Ein Index liefert einen `int`, kein Zeichen. `str` und `bytes` lassen sich nicht mischen: `\"a\" + b\"b\"` ist ein `TypeError`. Die veränderliche Variante heißt `bytearray`.",
    syntax: "b\"ascii-text\"\nbytes([65, 66])\ntext.encode(\"utf-8\")",
    values: [
      ['b.decode("utf-8")', 'bytes zu str'],
      ['b.hex()', 'Als Hex-String: "c3bc"'],
      ['bytes.fromhex("c3bc")', 'Aus Hex-String'],
      ['bytes(n)', 'n Null-Bytes']
    ],
    example: e(`
daten = "Grüße".encode("utf-8")
print(daten)                  # b'Gr\\xc3\\xbc\\xc3\\x9fe'
print(len("Grüße"), len(daten))  # 5 7
print(daten.decode("utf-8"))  # Grüße

b = b"ABC"
print(b[0])                   # 65 (int, kein Zeichen)
print(b[:2])                  # b'AB'
print(bytes([72, 105]))       # b'Hi'
print(daten.hex())            # 4772c3bcc39f65
`),
    tip: "Beim Lesen von Dateien das Encoding immer explizit angeben, statt sich auf die Plattform-Voreinstellung zu verlassen.",
    keywords: ['byte', 'binärdaten', 'binary', 'encode', 'decode', 'utf-8', 'kodierung', 'b-präfix'],
    related: ['str.encode()', 'bytearray', 'Strings (Literale)'],
    mdn: D + 'stdtypes.html#bytes-objects'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'type()',
    desc: "Liefert den Typ (die Klasse) eines Objekts.",
    details: "`type(x)` gibt die Klasse zurück, z. B. `<class 'int'>`; mit `type(x).__name__` erhält man nur den Namen. Für Typprüfungen ist `isinstance()` besser, weil es auch Unterklassen berücksichtigt: `type(True) == int` ist `False`, `isinstance(True, int)` ist `True`. Mit drei Argumenten erzeugt `type(name, basen, attribute)` dynamisch eine neue Klasse.",
    syntax: "type(objekt)\ntype(name, basen, dict)",
    example: e(`
print(type(42))               # <class 'int'>
print(type("a").__name__)     # str
print(type([]) is list)       # True
print(type(True) == int)      # False (bool ist Unterklasse)

# Dynamisch eine Klasse erzeugen
Punkt = type("Punkt", (), {"x": 0, "y": 0})
p = Punkt()
print(type(p).__name__, p.x)  # Punkt 0
`),
    tip: "In der REPL ist `type(x)` zusammen mit `dir(x)` der schnellste Weg, ein unbekanntes Objekt zu untersuchen.",
    keywords: ['typ', 'datentyp', 'klasse', 'typeof', 'typ ermitteln', '__name__'],
    related: ['isinstance()', 'dir() & help()', 'class'],
    mdn: D + 'functions.html#type'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'isinstance()',
    desc: "Prüft, ob ein Objekt eine Instanz einer Klasse (oder Unterklasse) ist.",
    details: "`isinstance(x, Typ)` berücksichtigt Vererbung und ist deshalb der bevorzugte Weg für Typprüfungen. Als zweites Argument geht ein Tupel von Typen oder seit Python 3.10 eine Union wie `int | float`. Mit abstrakten Basisklassen aus `collections.abc` prüft man Fähigkeiten, z. B. ob etwas iterierbar ist. Häufig ist Duck Typing (einfach benutzen und Fehler abfangen) die pythonischere Lösung.",
    syntax: "isinstance(objekt, Typ)\nisinstance(objekt, (Typ1, Typ2))\nisinstance(objekt, Typ1 | Typ2)",
    example: e(`
from collections.abc import Iterable

def beschreibe(x):
    if isinstance(x, bool):         # bool vor int prüfen!
        return "Wahrheitswert"
    if isinstance(x, int | float):
        return "Zahl"
    if isinstance(x, str):
        return "Text"
    if isinstance(x, Iterable):
        return "iterierbar"
    return "etwas anderes"

print(beschreibe(3.5))      # Zahl
print(beschreibe(True))     # Wahrheitswert
print(beschreibe([1, 2]))   # iterierbar
print(beschreibe(None))     # etwas anderes
`),
    tip: "Weil `bool` von `int` erbt, ist `isinstance(True, int)` wahr; wer echte Zahlen will, prüft `bool` zuerst.",
    keywords: ['typprüfung', 'instanceof', 'type check', 'unterklasse', 'vererbung', 'duck typing'],
    related: ['type()', 'issubclass()', 'match: Muster'],
    mdn: D + 'functions.html#isinstance'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'Typumwandlung',
    desc: "Werte explizit umwandeln mit int(), float(), str(), bool(), list() usw.",
    details: "Python wandelt kaum automatisch um: `\"3\" + 4` ist ein `TypeError`. Explizit konvertiert man mit dem Typnamen als Funktion. `int()` schneidet Floats ab und akzeptiert nur ganzzahlige Strings, `int(\"3.5\")` wirft `ValueError`. Bei Zahlen untereinander wird automatisch erweitert: `int + float` ergibt `float`.",
    values: [
      ['int(x)', 'Zu Ganzzahl (aus str, float, bool)'],
      ['float(x)', 'Zu Gleitkommazahl'],
      ['str(x)', 'Zu Text'],
      ['bool(x)', 'Wahrheitswert nach Truthiness'],
      ['list(x) / tuple(x) / set(x)', 'Iterierbares in Sammlung umwandeln'],
      ['repr(x)', 'Entwickler-Darstellung als Text']
    ],
    example: e(`
print(int("42") + 8)          # 50
print(str(42) + "8")          # 428
print(float("3.5") * 2)       # 7.0
print(int(float("3.5")))      # 3
print(1 + 2.0)                # 3.0 (automatisch float)
print(list("abc"))            # ['a', 'b', 'c']
print(set([1, 1, 2]))         # {1, 2}

try:
    int("3.5")
except ValueError as fehler:
    print(fehler)             # invalid literal for int() with base 10: '3.5'
`),
    tip: "`int(\" 42 \\n\")` funktioniert, Leerraum am Rand wird ignoriert; Tausendertrenner wie `\"1.000\"` dagegen nicht.",
    keywords: ['casting', 'konvertieren', 'umwandeln', 'conversion', 'parse', 'parseInt', 'type conversion'],
    related: ['int', 'float', 'Truthiness', 'repr()'],
    mdn: D + 'functions.html#int'
  },
  {
    lang: 'py', group: 'Datentypen & Literale', name: 'Truthiness',
    desc: "Jeder Wert gilt in if und while als wahr oder falsch, nicht nur bool.",
    details: "Falsy sind `None`, `False`, alle Nullen (`0`, `0.0`, `0j`) und leere Sammlungen (`\"\"`, `[]`, `()`, `{}`, `set()`, `range(0)`); alles andere ist truthy. So prüft man kurz `if liste:` statt `if len(liste) > 0:`. Eigene Klassen steuern das über `__bool__` oder `__len__`. Fallstrick: `if not wert:` greift auch bei `0`, wenn eigentlich nur `None` gemeint war.",
    values: [
      ['None, False', 'falsy'],
      ['0, 0.0, 0j', 'falsy'],
      ['"", [], (), {}, set()', 'falsy (leer)'],
      ['"0", [0], " "', 'truthy (nicht leer)']
    ],
    example: e(`
werte = [0, 1, "", "0", [], [0], None, {}, 0.0]
print([bool(w) for w in werte])
# [False, True, False, True, False, True, False, False, False]

einkaufsliste = []
if not einkaufsliste:
    print("Nichts zu kaufen")    # Nichts zu kaufen

anzahl = 0
if anzahl is not None:           # nicht "if anzahl:", sonst fällt 0 durch
    print(f"Anzahl: {anzahl}")   # Anzahl: 0
`),
    tip: "`x or standard` liefert den Standardwert für alle falsy Werte; soll `0` erhalten bleiben, `standard if x is None else x` schreiben.",
    keywords: ['truthy', 'falsy', 'wahrheitswert', 'leer', 'bool', '__bool__', 'wahr', 'falsch'],
    related: ['bool', 'None', 'and / or / not', 'if / elif / else'],
    mdn: D + 'stdtypes.html#truth-value-testing'
  },

  // ---------------- Variablen & Namen ----------------
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Zuweisung',
    desc: "name = wert bindet einen Namen an ein Objekt; Deklarationen gibt es nicht.",
    details: "Eine Variable entsteht bei der ersten Zuweisung und kann später auf Objekte beliebigen Typs zeigen. Variablen sind Namen, die auf Objekte verweisen, keine Speicherplätze: `b = a` kopiert nichts, beide Namen zeigen auf dasselbe Objekt. Bei veränderlichen Objekten wie Listen wirkt eine Änderung über `b` deshalb auch auf `a`. Ein Name, der noch nie zugewiesen wurde, löst beim Lesen `NameError` aus.",
    syntax: "name = ausdruck\nname: typ = ausdruck",
    example: e(`
x = 10
x = "jetzt ein String"   # Typ darf wechseln
print(x)                 # jetzt ein String

a = [1, 2]
b = a                    # kein Kopieren: zweiter Name, gleiches Objekt
b.append(3)
print(a)                 # [1, 2, 3]

alter: int = 30          # mit Typ-Annotation (wird nicht erzwungen)
print(alter)             # 30
`),
    tip: "Eine echte Kopie einer Liste erzeugt `a.copy()` oder `a[:]`; für verschachtelte Strukturen `copy.deepcopy()`.",
    keywords: ['variable', 'assignment', 'zuweisen', 'binden', 'referenz', 'name', 'deklaration'],
    related: ['Mehrfachzuweisung', 'Identität & Gleichheit', 'Flache & tiefe Kopie', 'Typ-Annotationen'],
    mdn: R + 'simple_stmts.html#assignment-statements'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Dynamische Typisierung',
    desc: "Typen gehören zu den Objekten, nicht zu den Variablen; geprüft wird zur Laufzeit.",
    details: "Ein Name kann nacheinander auf Objekte verschiedener Typen zeigen, und Funktionen akzeptieren alles, was die benötigten Operationen unterstützt („Duck Typing“). Python ist dabei stark typisiert: Es wandelt nicht stillschweigend um, `\"3\" + 4` ist ein `TypeError`. Typfehler fallen daher erst beim Ausführen der betroffenen Zeile auf. Typ-Annotationen und ein Type Checker wie mypy finden viele davon schon vorher.",
    example: e(`
def verdopple(x):
    return x * 2          # funktioniert für alles mit *

print(verdopple(21))      # 42
print(verdopple("ab"))    # abab
print(verdopple([0]))     # [0, 0]

wert = 42
wert = "jetzt Text"       # gleicher Name, anderer Typ
print(type(wert).__name__)   # str

try:
    "3" + 4               # stark typisiert: keine stille Umwandlung
except TypeError as fehler:
    print(fehler)         # can only concatenate str (not "int") to str
`),
    tip: "Annotationen wie `def verdopple(x: int) -> int:` ändern das Laufzeitverhalten nicht, helfen aber IDE und mypy.",
    keywords: ['dynamic typing', 'duck typing', 'stark typisiert', 'strong typing', 'laufzeit', 'typsystem'],
    related: ['Zuweisung', 'type()', 'Typ-Annotationen', 'mypy'],
    mdn: P + 'glossary.html#term-duck-typing'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Bezeichner',
    desc: "Regeln für Namen: Buchstaben, Ziffern, Unterstrich, nicht mit Ziffer beginnend.",
    details: "Namen bestehen aus Buchstaben, Ziffern und `_`, dürfen nicht mit einer Ziffer beginnen und keine Schlüsselwörter sein. Groß- und Kleinschreibung zählt: `name` und `Name` sind verschiedene Variablen. Unicode-Buchstaben wie Umlaute sind erlaubt, üblich ist aber ASCII. Eingebaute Namen wie `list`, `str`, `id` oder `sum` sollte man nicht überschreiben, sonst sind die Funktionen im selben Bereich nicht mehr erreichbar.",
    values: [
      ['zaehler, max_wert', 'Gültig'],
      ['_intern', 'Gültig, signalisiert „intern“'],
      ['2wert', 'Ungültig: beginnt mit Ziffer'],
      ['mein-wert', 'Ungültig: Bindestrich ist Minus'],
      ['class', 'Ungültig: Schlüsselwort'],
      ['list = [...]', 'Gültig, verdeckt aber die eingebaute Funktion']
    ],
    example: e(`
preis_netto = 100
größe = 1.80                   # erlaubt, aber unüblich
print("preis_netto".isidentifier())   # True
print("2wert".isidentifier())         # False

list = [3, 1, 2]               # verdeckt die eingebaute list()!
try:
    list("abc")
except TypeError as fehler:
    print(fehler)              # 'list' object is not callable
del list                       # eingebaute Funktion wieder sichtbar
print(list("ab"))              # ['a', 'b']
`),
    tip: "Ein häufiger Fehler beim Lernen: eine Variable `str`, `list` oder `input` nennen und sich dann über `not callable` wundern.",
    keywords: ['identifier', 'variablenname', 'name', 'benennung', 'namensregeln', 'gültiger name', 'shadowing'],
    related: ['Schlüsselwörter', 'PEP 8', 'Unterstrich _', 'Konstanten'],
    mdn: R + 'lexical_analysis.html#identifiers'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Mehrfachzuweisung',
    desc: "Mehreren Namen gleichzeitig Werte zuweisen oder Werte tauschen.",
    details: "`a, b = 1, 2` weist parallel zu: Die rechte Seite wird komplett ausgewertet, bevor zugewiesen wird. Darum tauscht `a, b = b, a` zwei Werte ohne Hilfsvariable. `a = b = 0` bindet beide Namen an dasselbe Objekt; bei veränderlichen Objekten wie `a = b = []` teilen sich beide also eine Liste.",
    syntax: "a, b = 1, 2\na, b = b, a\na = b = wert",
    example: e(`
x, y = 1, 2
x, y = y, x               # Tauschen
print(x, y)               # 2 1

a = b = 0                 # gleicher Startwert
a += 1
print(a, b)               # 1 0 (int ist unveränderlich)

l1 = l2 = []              # Vorsicht: dieselbe Liste
l1.append("x")
print(l2)                 # ['x']

# Fibonacci mit paralleler Zuweisung
f0, f1 = 0, 1
for _ in range(10):
    f0, f1 = f1, f0 + f1
print(f0)                 # 55
`),
    tip: "Für getrennte leere Listen `l1, l2 = [], []` schreiben, nicht `l1 = l2 = []`.",
    keywords: ['multiple assignment', 'tauschen', 'swap', 'parallele zuweisung', 'mehrere variablen'],
    related: ['Entpacken', 'Zuweisung', 'Veränderlich & unveränderlich'],
    mdn: R + 'simple_stmts.html#assignment-statements'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Entpacken',
    desc: "Elemente einer Sequenz oder eines Iterables auf mehrere Namen verteilen.",
    details: "Links stehen so viele Namen, wie das Iterable Elemente hat; passt die Anzahl nicht, gibt es `ValueError`. Das funktioniert mit Tupeln, Listen, Strings, Dict-Items und allem Iterierbaren, auch verschachtelt und in `for`-Köpfen. Nicht benötigte Werte bindet man per Konvention an `_`.",
    syntax: "a, b, c = iterierbar\n(a, b), c = ((1, 2), 3)\nfor k, v in d.items(): ...",
    example: e(`
punkt = (3, 4)
x, y = punkt
print(x, y)                     # 3 4

name, _, stadt = ["Ada", 36, "London"]
print(name, stadt)              # Ada London

(a, b), c = (1, 2), 3           # verschachtelt
print(a, b, c)                  # 1 2 3

preise = {"Apfel": 0.5, "Brot": 2.2}
for produkt, preis in preise.items():
    print(produkt, preis)       # Apfel 0.5, dann Brot 2.2

try:
    p, q = [1, 2, 3]
except ValueError as fehler:
    print(fehler)               # too many values to unpack (expected 2, got 3)
`),
    tip: "Funktionen, die mehrere Werte zurückgeben, liefern ein Tupel, das man direkt entpackt: `q, r = divmod(17, 5)`.",
    keywords: ['unpacking', 'destructuring', 'destrukturieren', 'auspacken', 'tupel', 'zuweisung'],
    related: ['Stern-Entpacken', 'Mehrfachzuweisung', 'Tupel als Rückgabewert', 'Argumente entpacken'],
    mdn: T + 'datastructures.html#tuples-and-sequences'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Stern-Entpacken',
    desc: "Mit *rest beim Entpacken beliebig viele übrige Elemente als Liste einsammeln.",
    details: "Ein Name mit `*` sammelt alle Elemente, die keinem anderen Namen zugeordnet sind, und ist immer eine Liste (eventuell leer). Pro Zuweisung ist nur ein Stern erlaubt, er darf an beliebiger Stelle stehen. Das Gegenstück in Funktionsaufrufen und Literalen (`f(*args)`, `[*a, *b]`) verteilt Elemente statt sie zu sammeln.",
    syntax: "erstes, *rest = folge\n*anfang, letztes = folge\nkopf, *mitte, ende = folge",
    example: e(`
erstes, *rest = [1, 2, 3, 4]
print(erstes, rest)             # 1 [2, 3, 4]

*anfang, letztes = "abc"
print(anfang, letztes)          # ['a', 'b'] c

kopf, *mitte, ende = (10, 20)
print(kopf, mitte, ende)        # 10 [] 20

zeile = "2026-11-16;Miete;-850;Fix"
datum, *_, art = zeile.split(";")
print(datum, art)               # 2026-11-16 Fix
`),
    tip: "`*_` ignoriert beliebig viele Werte in der Mitte, praktisch bei CSV-Zeilen mit vielen Spalten.",
    keywords: ['star unpacking', 'stern', 'rest', 'extended unpacking', 'splat', 'asterisk'],
    related: ['Entpacken', 'Unpacking in Literalen', '*args'],
    mdn: R + 'simple_stmts.html#assignment-statements'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Konstanten',
    desc: "Python kennt keine echten Konstanten; Konvention sind GROSSBUCHSTABEN.",
    details: "Ein Name in `GROSS_MIT_UNTERSTRICH` signalisiert, dass er nicht verändert werden soll, technisch bleibt die Neuzuweisung aber möglich. Mit der Annotation `typing.Final` melden Type Checker wie mypy eine spätere Zuweisung als Fehler, zur Laufzeit passiert nichts. Für feste Wertemengen eignet sich `enum.Enum`, für unveränderliche Sammlungen `tuple` oder `frozenset`.",
    syntax: "MAX_VERSUCHE = 3\nMAX_VERSUCHE: Final = 3",
    example: e(`
from typing import Final

MAX_VERSUCHE: Final = 3
ERLAUBTE_ENDUNGEN = (".jpg", ".png")   # Tupel: unveränderlich

def pruefe(datei):
    return datei.endswith(ERLAUBTE_ENDUNGEN)

print(pruefe("foto.png"))     # True
print(MAX_VERSUCHE)           # 3

MAX_VERSUCHE = 5              # läuft trotzdem; mypy meldet einen Fehler
print(MAX_VERSUCHE)           # 5
`),
    tip: "Konstanten gehören auf Modulebene an den Dateianfang, direkt nach die Imports.",
    keywords: ['konstante', 'constant', 'final', 'unveränderlich', 'großbuchstaben', 'const'],
    related: ['typing.Final', 'enum.Enum', 'PEP 8'],
    mdn: D + 'typing.html#typing.Final'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Gültigkeitsbereiche (LEGB)',
    desc: "Namen werden in der Reihenfolge Local, Enclosing, Global, Built-in gesucht.",
    details: "Jede Funktion hat einen eigenen lokalen Bereich. Beim Lesen sucht Python erst lokal, dann in umschließenden Funktionen, dann auf Modulebene und zuletzt bei den eingebauten Namen. Wird ein Name irgendwo in einer Funktion zugewiesen, ist er dort überall lokal; ein Lesen vor der Zuweisung ergibt `UnboundLocalError`. Blöcke wie `if` oder `for` bilden keinen eigenen Bereich, die Schleifenvariable existiert nach der Schleife weiter.",
    values: [
      ['L – Local', 'Namen in der aktuellen Funktion'],
      ['E – Enclosing', 'Namen in umschließenden Funktionen (Closures)'],
      ['G – Global', 'Namen auf Modulebene'],
      ['B – Built-in', 'Eingebaute Namen wie len, print']
    ],
    example: e(`
x = "global"

def aussen():
    x = "enclosing"
    def innen():
        print(x)            # sucht: local -> enclosing
    innen()

aussen()                    # enclosing

for i in range(3):
    pass
print(i)                    # 2 (Schleifenvariable bleibt erhalten)

zaehler = 0
def erhoehe():
    try:
        zaehler += 1        # Zuweisung macht zaehler lokal
    except UnboundLocalError:
        print("UnboundLocalError")
erhoehe()                   # UnboundLocalError
`),
    tip: "Statt `global` lieber Werte als Parameter übergeben und zurückgeben; das macht Funktionen testbar.",
    keywords: ['scope', 'gültigkeitsbereich', 'sichtbarkeit', 'namensraum', 'namespace', 'legb', 'UnboundLocalError', 'lokal'],
    related: ['global', 'nonlocal', 'Closures'],
    mdn: R + 'executionmodel.html#resolution-of-names'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'global',
    desc: "Erlaubt einer Funktion, einen Namen auf Modulebene neu zuzuweisen.",
    details: "Ohne `global` erzeugt eine Zuweisung in einer Funktion immer eine lokale Variable. Mit `global name` verweist die Zuweisung auf die Modulvariable. Nur zum Lesen oder zum Verändern eines Objekts (z. B. `liste.append`) braucht man `global` nicht. Globale Zustände erschweren Tests und Nebenläufigkeit, daher sparsam einsetzen.",
    syntax: "global name1, name2",
    example: e(`
aufrufe = 0
cache = []

def zaehle():
    global aufrufe
    aufrufe += 1          # ändert die Modulvariable
    cache.append(aufrufe) # Objekt verändern: kein global nötig

zaehle()
zaehle()
print(aufrufe)            # 2
print(cache)              # [1, 2]
`),
    tip: "Brauchen mehrere Funktionen gemeinsamen Zustand, ist eine Klasse oder ein übergebenes Objekt meist die bessere Lösung.",
    keywords: ['global', 'globale variable', 'modulvariable', 'scope', 'gültigkeitsbereich'],
    related: ['nonlocal', 'Gültigkeitsbereiche (LEGB)'],
    mdn: R + 'simple_stmts.html#the-global-statement'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'nonlocal',
    desc: "Erlaubt einer inneren Funktion, eine Variable der äußeren Funktion neu zuzuweisen.",
    details: "`nonlocal name` bindet den Namen an die nächste umschließende Funktion (nicht an die Modulebene). Typischer Einsatz sind Closures mit Zustand, etwa Zähler oder Akkumulatoren. Die Variable muss in einer umschließenden Funktion bereits existieren, sonst gibt es einen `SyntaxError`.",
    syntax: "nonlocal name",
    example: e(`
def erzeuge_zaehler():
    stand = 0
    def zaehle():
        nonlocal stand
        stand += 1
        return stand
    return zaehle

z = erzeuge_zaehler()
z()
z()
print(z())          # 3

z2 = erzeuge_zaehler()
print(z2())         # 1 (eigener Zustand)
`),
    tip: "Ohne `nonlocal` führt `stand += 1` zu `UnboundLocalError`, weil die Zuweisung `stand` lokal macht.",
    keywords: ['nonlocal', 'closure', 'umschließend', 'enclosing', 'innere funktion', 'scope'],
    related: ['global', 'Closures', 'Gültigkeitsbereiche (LEGB)'],
    mdn: R + 'simple_stmts.html#the-nonlocal-statement'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'del',
    desc: "Entfernt einen Namen, ein Listenelement, einen Slice oder einen Dict-Schlüssel.",
    details: "`del x` löst die Bindung des Namens; das Objekt selbst wird erst freigegeben, wenn keine Referenz mehr darauf zeigt. `del liste[i]` und `del liste[a:b]` entfernen Elemente, `del d[k]` einen Schlüssel (`KeyError`, wenn er fehlt). Auf gelöschte Namen zuzugreifen ergibt `NameError`.",
    syntax: "del name\ndel liste[index]\ndel liste[start:ende]\ndel d[schluessel]\ndel obj.attribut",
    example: e(`
zahlen = [10, 20, 30, 40, 50]
del zahlen[0]
print(zahlen)              # [20, 30, 40, 50]
del zahlen[1:3]
print(zahlen)              # [20, 50]

d = {"a": 1, "b": 2}
del d["a"]
print(d)                   # {'b': 2}

x = 5
del x
try:
    print(x)
except NameError as fehler:
    print(fehler)          # name 'x' is not defined
`),
    tip: "Wenn man den Wert noch braucht: `liste.pop(i)` bzw. `d.pop(k, None)` statt `del`.",
    keywords: ['löschen', 'delete', 'entfernen', 'remove', 'name entfernen', 'unset'],
    related: ['list.pop()', 'dict.pop()', 'list.remove()'],
    mdn: R + 'simple_stmts.html#the-del-statement'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Identität & Gleichheit',
    desc: "== vergleicht Werte, is prüft, ob es dasselbe Objekt ist.",
    details: "`a == b` ruft `__eq__` auf und vergleicht Inhalte, `a is b` prüft die Identität (gleiche `id()`). Zwei gleiche Listen sind `==`, aber nicht `is`. `is` verwendet man fast nur mit Singletons wie `None`, `True`, `False`. Dass `is` bei kleinen Zahlen oder kurzen Strings manchmal `True` liefert, ist ein Implementierungsdetail (Caching) und darf nicht genutzt werden.",
    values: [
      ['a == b', 'Gleicher Wert (__eq__)'],
      ['a is b', 'Dasselbe Objekt (gleiche id)'],
      ['id(a)', 'Identität des Objekts als Zahl']
    ],
    example: e(`
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)       # True  (gleicher Inhalt)
print(a is b)       # False (zwei Objekte)
print(a is c)       # True  (gleiches Objekt)

x = None
print(x is None)    # True (so prüft man auf None)

print(1 == 1.0)     # True (Wertvergleich über Typgrenzen)
`),
    tip: "Linter warnen bei `x == None` und bei `is` mit Literalen (`x is 5`, SyntaxWarning); das ist fast immer ein Fehler.",
    keywords: ['identität', 'gleichheit', 'equality', 'identity', 'is', '==', 'gleiches objekt', 'vergleich'],
    related: ['is / is not', 'Vergleichsoperatoren', 'id()', '__eq__ & __hash__'],
    mdn: R + 'expressions.html#identity-comparisons'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Veränderlich & unveränderlich',
    desc: "Mutable Objekte (list, dict, set) lassen sich ändern, immutable (int, str, tuple) nicht.",
    details: "Unveränderliche Typen: `int`, `float`, `bool`, `str`, `bytes`, `tuple`, `frozenset`, `None`. „Ändern“ erzeugt dort ein neues Objekt, `s += \"x\"` bindet `s` an einen neuen String. Veränderliche Typen: `list`, `dict`, `set`, `bytearray` und die meisten eigenen Klassen; Änderungen sind über alle Namen sichtbar, die auf das Objekt zeigen. Nur unveränderliche (hashbare) Objekte taugen als Dict-Schlüssel und Set-Elemente.",
    values: [
      ['unveränderlich', 'int, float, bool, str, bytes, tuple, frozenset, None'],
      ['veränderlich', 'list, dict, set, bytearray, eigene Objekte']
    ],
    example: e(`
def anhaengen(liste, text):
    liste.append(1)       # verändert das übergebene Objekt
    text += "!"           # erzeugt nur lokal einen neuen String
    return text

l = []
t = "Hallo"
neu = anhaengen(l, t)
print(l, t, neu)          # [1] Hallo Hallo!

s = "abc"
try:
    s[0] = "X"
except TypeError as fehler:
    print(fehler)         # 'str' object does not support item assignment

print({(1, 2): "ok"})     # {(1, 2): 'ok'} (Tupel als Schlüssel)
`),
    tip: "Funktionen, die ein übergebenes Objekt verändern, geben laut Konvention `None` zurück (wie `list.sort()`), damit die Seiteneffekte klar sind.",
    keywords: ['mutable', 'immutable', 'veränderlich', 'unveränderlich', 'mutabel', 'seiteneffekt', 'hashbar'],
    related: ['Zuweisung', 'Gültige Schlüssel (hashbar)', 'Veränderliche Standardwerte (Fallstrick)', 'tuple'],
    mdn: R + 'datamodel.html#objects-values-and-types'
  },
  {
    lang: 'py', group: 'Variablen & Namen', name: 'Unterstrich _',
    desc: "Platzhaltername für unbenutzte Werte, Präfix für Internes und letztes REPL-Ergebnis.",
    details: "`_` als Variable bedeutet „Wert wird nicht gebraucht“, etwa in `for _ in range(3)`. Ein führender Unterstrich (`_hilfe`) markiert interne Namen, `from modul import *` übernimmt sie nicht. Doppelter führender Unterstrich in Klassen (`__x`) löst Name Mangling aus, doppelt an beiden Seiten (`__init__`) ist für spezielle Methoden reserviert. In `match` ist `_` das Muster, das immer passt; in der REPL enthält `_` das letzte Ergebnis.",
    values: [
      ['_', 'Wegwerf-Variable, Wildcard in match'],
      ['_name', 'Intern (Konvention)'],
      ['name_', 'Vermeidet Kollision mit Schlüsselwort: class_'],
      ['__name', 'Name Mangling in Klassen'],
      ['__name__', 'Spezielle Namen (dunder)']
    ],
    example: e(`
for _ in range(3):
    print("Hallo", end=" ")
print()                          # Hallo Hallo Hallo

name, _, _ = ("Ada", 36, "London")
print(name)                      # Ada

def _hilfsfunktion():            # intern
    return 42

print(_hilfsfunktion())          # 42
print(1_000 + 1)                 # 1001 (in Zahlen: Zifferntrenner)
`),
    tip: "Für Übersetzungen wird `_` oft als Funktion (`gettext`) verwendet; dann nicht gleichzeitig als Wegwerf-Variable benutzen.",
    keywords: ['underscore', 'unterstrich', 'wegwerf', 'platzhalter', 'dunder', 'intern', 'private', 'wildcard'],
    related: ['Private Namen (_ und __)', 'Entpacken', 'match: Muster'],
    mdn: R + 'lexical_analysis.html#reserved-classes-of-identifiers'
  },

  // ---------------- Operatoren ----------------
  {
    lang: 'py', group: 'Operatoren', name: 'Arithmetische Operatoren',
    desc: "+, -, *, /, //, %, ** und unäres - für Grundrechenarten.",
    details: "`/` liefert immer einen `float`, `//` die abgerundete Ganzzahldivision, `%` den Rest, `**` die Potenz. Bei gemischten Typen wird erweitert: `int` mit `float` ergibt `float`. `+` und `*` funktionieren auch für Sequenzen (Verketten und Wiederholen). Division durch 0 wirft `ZeroDivisionError`, auch bei Floats.",
    values: [
      ['a + b', 'Addition, bei Sequenzen Verkettung'],
      ['a - b', 'Subtraktion'],
      ['a * b', 'Multiplikation, bei Sequenzen Wiederholung'],
      ['a / b', 'Division, Ergebnis immer float'],
      ['a // b', 'Ganzzahldivision (abgerundet)'],
      ['a % b', 'Rest (Modulo)'],
      ['a ** b', 'Potenz'],
      ['-a', 'Negation']
    ],
    example: e(`
print(7 + 2, 7 - 2, 7 * 2)   # 9 5 14
print(7 / 2)                 # 3.5
print(8 / 2)                 # 4.0
print(7 // 2, 7 % 2)         # 3 1
print(2 ** 10)               # 1024
print(3 * "ab")              # ababab
print([0] * 3)               # [0, 0, 0]

try:
    1 / 0
except ZeroDivisionError as fehler:
    print(fehler)            # division by zero
`),
    tip: "Ein `++` oder `--` gibt es nicht; `x++` ist ein Syntaxfehler, `++x` bedeutet einfach `+(+x)`.",
    keywords: ['rechnen', 'arithmetik', 'plus', 'minus', 'mal', 'geteilt', 'division', 'operator', 'math'],
    related: ['// und %', '**', 'Erweiterte Zuweisung', 'Operator-Rangfolge'],
    mdn: R + 'expressions.html#binary-arithmetic-operations'
  },
  {
    lang: 'py', group: 'Operatoren', name: '// und %',
    desc: "Ganzzahldivision (abgerundet) und Rest; bei negativen Zahlen anders als in C/Java.",
    details: "`a // b` rundet immer nach unten (Richtung minus unendlich), nicht Richtung 0: `-7 // 2` ist `-4`. Der Rest `%` hat deshalb das Vorzeichen des Divisors: `-7 % 2` ist `1`. So gilt stets `(a // b) * b + a % b == a`. `divmod(a, b)` liefert beides auf einmal. Für die C-Semantik (Abschneiden) gibt es `int(a / b)` und `math.fmod()`.",
    syntax: "a // b\na % b\ndivmod(a, b)",
    example: e(`
print(17 // 5, 17 % 5)     # 3 2
print(-7 // 2, -7 % 2)     # -4 1
print(7.5 // 2)            # 3.0
print(divmod(125, 60))     # (2, 5)

# Typische Anwendungen
print(10 % 2 == 0)         # True (gerade Zahl)
sekunden = 3725
minuten, sek = divmod(sekunden, 60)
print(f"{minuten} min {sek} s")   # 62 min 5 s
print((6 + 3) % 7)         # 2 (Wochentag 3 Tage nach Sonntag=6)
`),
    tip: "`%` mit negativem Index-Abstand ist ideal für Ringpuffer: `(i - 1) % n` bleibt immer im Bereich 0 bis n-1.",
    keywords: ['modulo', 'rest', 'ganzzahldivision', 'floor division', 'remainder', 'div', 'mod', 'abrunden'],
    related: ['divmod()', 'Arithmetische Operatoren', 'int'],
    mdn: R + 'expressions.html#binary-arithmetic-operations'
  },
  {
    lang: 'py', group: 'Operatoren', name: '**',
    desc: "Potenzoperator: a ** b; bindet stärker als unäres Minus und von rechts.",
    details: "`2 ** 10` ist 1024, mit `int` beliebig groß und exakt. Negative oder gebrochene Exponenten liefern `float`: `2 ** -1` ist `0.5`, `9 ** 0.5` die Wurzel. `**` ist rechtsassoziativ (`2 ** 3 ** 2` ist `2 ** 9`) und bindet stärker als das Vorzeichen: `-2 ** 2` ergibt `-4`. Für modulare Potenzen gibt es `pow(a, b, m)`.",
    syntax: "basis ** exponent\npow(basis, exponent, modulus)",
    example: e(`
print(2 ** 10)          # 1024
print(2 ** -1)          # 0.5
print(9 ** 0.5)         # 3.0
print(2 ** 3 ** 2)      # 512 (= 2 ** 9)
print(-2 ** 2)          # -4
print((-2) ** 2)        # 4
print(pow(3, 4, 5))     # 1 (3**4 % 5, effizient)
print(len(str(2 ** 1000)))  # 302 Ziffern
`),
    tip: "Das `^` ist in Python XOR, keine Potenz: `2 ^ 3` ergibt 1.",
    keywords: ['potenz', 'hoch', 'exponent', 'power', 'pow', 'wurzel', 'quadrat'],
    related: ['Arithmetische Operatoren', 'Operator-Rangfolge', 'math'],
    mdn: R + 'expressions.html#the-power-operator'
  },
  {
    lang: 'py', group: 'Operatoren', name: 'Vergleichsoperatoren',
    desc: "==, !=, <, <=, >, >= vergleichen Werte und liefern True oder False.",
    details: "Zahlen verschiedener Typen werden nach Wert verglichen (`1 == 1.0`). Strings, Listen und Tupel vergleicht man lexikografisch, Element für Element; Strings nach Unicode-Codepunkt, daher ist `\"Z\" < \"a\"`. Größenvergleiche zwischen nicht vergleichbaren Typen (`1 < \"2\"`) sind ein `TypeError`, `==` liefert dort einfach `False`. Eigene Klassen definieren Vergleiche über `__eq__`, `__lt__` usw.",
    values: [
      ['==', 'gleich'],
      ['!=', 'ungleich'],
      ['< / <=', 'kleiner / kleiner gleich'],
      ['> / >=', 'größer / größer gleich']
    ],
    example: e(`
print(3 == 3.0, 3 != 4)              # True True
print("Apfel" < "Birne")             # True
print("Z" < "a")                     # True (Codepunkte: 90 < 97)
print([1, 2, 3] < [1, 3])            # True (zweites Element entscheidet)
print((2026, 1, 5) > (2025, 12, 31)) # True

try:
    1 < "2"
except TypeError as fehler:
    print(fehler)  # '<' not supported between instances of 'int' and 'str'
`),
    tip: "Für Sortierung ohne Groß/Klein-Unterschied `sorted(namen, key=str.casefold)` verwenden.",
    keywords: ['vergleich', 'comparison', 'gleich', 'ungleich', 'kleiner', 'größer', 'lexikografisch'],
    related: ['Verkettete Vergleiche', 'Identität & Gleichheit', 'Vergleichsmethoden (__lt__, functools.total_ordering)'],
    mdn: R + 'expressions.html#comparisons'
  },
  {
    lang: 'py', group: 'Operatoren', name: 'Verkettete Vergleiche',
    desc: "a < b < c prüft beide Vergleiche wie in der Mathematik.",
    details: "`a < b < c` ist gleichbedeutend mit `a < b and b < c`, wobei `b` nur einmal ausgewertet wird. Das liest sich natürlich für Bereichsprüfungen wie `0 <= x < 10`. Beliebige Vergleichsoperatoren lassen sich kombinieren, auch `==`, `is` und `in`. Fallstrick: `a == b == c` prüft, ob alle drei gleich sind, und `x < y > z` ist zwar erlaubt, aber schwer lesbar.",
    syntax: "a < b < c\nuntergrenze <= x < obergrenze",
    example: e(`
alter = 17
print(13 <= alter < 18)       # True (Teenager)

x = 5
print(1 < x < 3)              # False
print(1 == 1.0 == True)       # True (alle drei gleich)

# Achtung: Das ist ebenfalls ein verketteter Vergleich!
print(False == False in [False])   # True (= False == False and False in [False])
`),
    tip: "Für Bereichsprüfungen ist `x in range(a, b)` bei ganzen Zahlen eine lesbare Alternative.",
    keywords: ['chained comparison', 'verkettet', 'bereich', 'intervall', 'zwischen', 'between'],
    related: ['Vergleichsoperatoren', 'and / or / not', 'in / not in'],
    mdn: R + 'expressions.html#comparisons'
  },
  {
    lang: 'py', group: 'Operatoren', name: 'and / or / not',
    desc: "Logische Operatoren mit Kurzschlussauswertung; and/or liefern einen der Operanden.",
    details: "`and` und `or` werten nur so weit aus, wie nötig, und geben einen der Operanden zurück, nicht zwingend `True`/`False`: `x or y` liefert `x`, wenn `x` truthy ist, sonst `y`; `x and y` liefert `x`, wenn `x` falsy ist, sonst `y`. `not` liefert immer einen `bool`. Rangfolge: `not` vor `and` vor `or`. Für Bits sind `&`, `|`, `~` zuständig, nicht diese Wörter.",
    values: [
      ['x and y', 'y, falls x truthy, sonst x'],
      ['x or y', 'x, falls x truthy, sonst y'],
      ['not x', 'True, falls x falsy']
    ],
    example: e(`
print(True and False, True or False, not True)  # False True False
print(0 or "Standard")        # Standard
print("Wert" or "Standard")   # Wert
print([] and "nie")           # []

name = ""
anzeige = name or "Anonym"
print(anzeige)                # Anonym

# Kurzschluss verhindert Fehler
liste = []
print(len(liste) > 0 and liste[0] > 5)   # False (liste[0] wird nicht ausgewertet)
`),
    tip: "Klammern setzen, wenn `and` und `or` gemischt werden: `a or b and c` ist `a or (b and c)`.",
    keywords: ['logisch', 'und', 'oder', 'nicht', 'kurzschluss', 'short circuit', 'boolean', '&&', '||', '!'],
    related: ['Truthiness', 'Bedingter Ausdruck', 'any() / all()', 'Bitoperatoren'],
    mdn: R + 'expressions.html#boolean-operations'
  },
  {
    lang: 'py', group: 'Operatoren', name: 'is / is not',
    desc: "Prüft auf Objektidentität: zeigen beide Namen auf dasselbe Objekt?",
    details: "`a is b` ist genau dann wahr, wenn `id(a) == id(b)`. Der Standardfall ist `x is None` bzw. `x is not None`, außerdem Vergleiche mit Sentinel-Objekten. `x is not y` ist die lesbare Form von `not x is y`. Für Wertvergleiche (Zahlen, Strings, Listen) immer `==` benutzen.",
    syntax: "a is b\na is not b",
    example: e(`
FEHLT = object()          # eindeutiger Sentinel

def hole(d, k, standard=FEHLT):
    wert = d.get(k, FEHLT)
    if wert is FEHLT:
        if standard is FEHLT:
            raise KeyError(k)
        return standard
    return wert

print(hole({"a": None}, "a"))       # None (vorhanden, Wert ist None)
print(hole({}, "b", 0))             # 0
print([] is not [])                 # True (zwei verschiedene Listen)
`),
    tip: "Sentinels mit `object()` unterscheiden „nicht angegeben“ von „ausdrücklich None“.",
    keywords: ['is', 'is not', 'identität', 'identity', 'gleiches objekt', 'sentinel', 'none prüfen'],
    related: ['Identität & Gleichheit', 'None', 'id()'],
    mdn: R + 'expressions.html#identity-comparisons'
  },
  {
    lang: 'py', group: 'Operatoren', name: 'in / not in',
    desc: "Prüft, ob ein Element in einer Sammlung oder ein Teilstring im String enthalten ist.",
    details: "Bei Strings sucht `in` nach Teilstrings, bei Listen und Tupeln nach gleichen Elementen (linear, O(n)), bei Sets und Dicts per Hash (O(1)). Bei Dicts prüft `in` die Schlüssel, nicht die Werte; für Werte `in d.values()`. Eigene Klassen unterstützen `in` über `__contains__` oder Iteration.",
    syntax: "element in sammlung\nelement not in sammlung",
    example: e(`
print("all" in "Hallo Welt")        # True
print("Wel" in "Hallo Welt")        # True
print(3 in [1, 2, 3])               # True
print("x" not in {"a", "b"})        # True

alter = {"Ada": 36, "Bob": 25}
print("Ada" in alter)               # True (Schlüssel)
print(36 in alter)                  # False
print(36 in alter.values())         # True

erlaubt = {"jpg", "png", "gif"}     # Set: schnelle Suche
print("png" in erlaubt)             # True
`),
    tip: "Viele `in`-Abfragen auf einer großen Liste? Vorher in ein `set` umwandeln.",
    keywords: ['enthalten', 'contains', 'membership', 'mitgliedschaft', 'suchen', 'includes', 'teilstring'],
    related: ['set', 'Container-Protokoll (__len__, __getitem__, __contains__)', 'str.find()'],
    mdn: R + 'expressions.html#membership-test-operations'
  },
  {
    lang: 'py', group: 'Operatoren', name: 'Bitoperatoren',
    desc: "&, |, ^, ~, <<, >> verknüpfen Ganzzahlen bitweise.",
    details: "Bitoperatoren arbeiten auf der Binärdarstellung von `int`. `~x` ist `-x - 1`, weil Python mit unendlicher Zweierkomplement-Darstellung rechnet. `<<` und `>>` verschieben Bits, `x << n` entspricht `x * 2**n`. Die Operatoren `&`, `|`, `^` dienen bei `set` auch als Mengenoperationen (`|` auch zum Zusammenführen von Dicts). Anders als in C binden `&`, `|` und `^` stärker als Vergleiche: `a & b == 0` bedeutet `(a & b) == 0`, aber `x > 1 & y < 5` bedeutet `x > (1 & y) < 5`.",
    values: [
      ['a & b', 'UND'],
      ['a | b', 'ODER'],
      ['a ^ b', 'Exklusives ODER (XOR)'],
      ['~a', 'Bitweise Negation (-a - 1)'],
      ['a << n', 'Nach links verschieben (× 2^n)'],
      ['a >> n', 'Nach rechts verschieben (// 2^n)']
    ],
    example: e(`
a, b = 0b1100, 0b1010
print(bin(a & b))       # 0b1000
print(bin(a | b))       # 0b1110
print(bin(a ^ b))       # 0b110
print(~5)               # -6
print(1 << 4, 64 >> 2)  # 16 16

# Flags kombinieren und prüfen
LESEN, SCHREIBEN, AUSFUEHREN = 4, 2, 1
rechte = LESEN | SCHREIBEN
print(bool(rechte & SCHREIBEN))    # True
print((rechte & AUSFUEHREN) == 0)  # True
print((255).bit_count())           # 8 gesetzte Bits
`),
    tip: "Für benannte Flags ist `enum.Flag` lesbarer als nackte Zahlen.",
    keywords: ['bitweise', 'bitwise', 'and', 'or', 'xor', 'shift', 'verschieben', 'maske', 'flags', 'binär'],
    related: ['Zahlenliterale', 'Mengenoperationen', 'enum.Flag'],
    mdn: R + 'expressions.html#binary-bitwise-operations'
  },
  {
    lang: 'py', group: 'Operatoren', name: 'Erweiterte Zuweisung',
    desc: "x += 1, x *= 2 usw.: Operation und Zuweisung in einem.",
    details: "Für fast jeden binären Operator gibt es eine Kurzform: `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=`, `&=`, `|=`, `^=`, `<<=`, `>>=`, `@=`. Bei unveränderlichen Typen entsteht ein neues Objekt. Veränderliche Objekte ändern sich in place: `liste += [4]` erweitert die vorhandene Liste, was alle Namen auf diese Liste mitbekommen. Inkrement-Operatoren wie `++` gibt es nicht.",
    syntax: "x += wert\nx -= wert\nx *= wert ...",
    example: e(`
zaehler = 0
zaehler += 1
zaehler *= 10
print(zaehler)          # 10

text = "Hallo"
text += " Welt"
print(text)             # Hallo Welt

a = [1, 2]
b = a
a += [3]                # in place: b sieht die Änderung
print(b)                # [1, 2, 3]
a = a + [4]             # neue Liste: b bleibt unverändert
print(a, b)             # [1, 2, 3, 4] [1, 2, 3]
`),
    tip: "Viele Strings in einer Schleife mit `+=` zu verbinden ist langsam; besser Teile in einer Liste sammeln und `\"\".join(teile)` aufrufen.",
    keywords: ['augmented assignment', 'plus gleich', '+=', '-=', 'inkrement', 'increment', 'kurzform'],
    related: ['Zuweisung', 'Arithmetische Operatoren', 'Veränderlich & unveränderlich', 'str.join()'],
    mdn: R + 'simple_stmts.html#augmented-assignment-statements'
  },
  {
    lang: 'py', group: 'Operatoren', name: ':= (Walrus)',
    desc: "Zuweisungsausdruck: weist einen Wert zu und liefert ihn zugleich zurück.",
    details: "Der „Walross-Operator“ `:=` (seit Python 3.8) erlaubt eine Zuweisung innerhalb eines Ausdrucks, etwa in `while`- oder `if`-Bedingungen und Comprehensions. So muss ein teurer Ausdruck nicht doppelt berechnet werden. Auf oberster Ebene einer Anweisung ist er ohne Klammern nicht erlaubt (`x := 5` ist ein Syntaxfehler). Sparsam einsetzen, sonst leidet die Lesbarkeit.",
    syntax: "if (name := ausdruck) bedingung: ...\nwhile (zeile := lese()): ...",
    example: e(`
import re

daten = ["a", "bb", "ccc", "dddd"]
if (n := len(daten)) > 3:
    print(f"Zu viele Elemente: {n}")      # Zu viele Elemente: 4

# Ergebnis wiederverwenden statt doppelt berechnen
werte = [3, 8, 12, 5]
quadrate = [q for x in werte if (q := x * x) > 20]
print(quadrate)                           # [64, 144, 25]

if (treffer := re.search(r"\\d+", "Bestellung 4711")):
    print(treffer.group())                # 4711

stapel = [1, 2, 3]
while (element := stapel.pop() if stapel else None) is not None:
    print(element, end=" ")               # 3 2 1
print()
`),
    tip: "Klassischer Einsatz: Blockweise lesen mit `while (block := f.read(8192)):`.",
    keywords: ['walrus', 'walross', 'zuweisungsausdruck', 'assignment expression', 'named expression', ':='],
    related: ['Zuweisung', 'while', 'Comprehension mit Bedingung'],
    mdn: R + 'expressions.html#assignment-expressions'
  },
  {
    lang: 'py', group: 'Operatoren', name: 'Bedingter Ausdruck',
    desc: "Ternärer Operator: wert_wenn_wahr if bedingung else wert_wenn_falsch.",
    details: "Pythons Variante von `bedingung ? a : b` steht in natürlicher Reihenfolge: erst das Ergebnis, dann die Bedingung. Nur der gewählte Zweig wird ausgewertet. Ausdrücke lassen sich verschachteln, das wird aber schnell unleserlich; dann lieber `if`/`elif` oder ein Dict als Tabelle. Der `else`-Teil ist Pflicht.",
    syntax: "a if bedingung else b",
    example: e(`
punkte = 72
ergebnis = "bestanden" if punkte >= 50 else "durchgefallen"
print(ergebnis)                    # bestanden

n = 1
print(f"{n} Datei{'' if n == 1 else 'en'}")   # 1 Datei

# In Comprehensions
zahlen = [-2, 5, -1, 3]
print([x if x > 0 else 0 for x in zahlen])   # [0, 5, 0, 3]

# Verschachtelt (sparsam verwenden)
t = 25
print("heiß" if t > 30 else "warm" if t > 20 else "kalt")   # warm
`),
    tip: "Ein Bedingter Ausdruck in einer Comprehension steht vor dem `for`, ein Filter-`if` danach.",
    keywords: ['ternär', 'ternary', 'conditional expression', 'inline if', 'fragezeichen operator', '?:', 'einzeiler'],
    related: ['if / elif / else', 'and / or / not', 'Comprehension mit Bedingung'],
    mdn: R + 'expressions.html#conditional-expressions'
  },
  {
    lang: 'py', group: 'Operatoren', name: 'Operator-Rangfolge',
    desc: "Welche Operatoren stärker binden: von ** bis zum Lambda.",
    details: "Von stark nach schwach: Klammern, Aufrufe und Indizes, `await`, `**`, unäres `+x -x ~x`, `* / // % @`, `+ -`, Shifts, `&`, `^`, `|`, Vergleiche inkl. `in` und `is`, `not`, `and`, `or`, bedingter Ausdruck, `lambda`, `:=`. Fast alle Operatoren werten von links nach rechts aus, `**` von rechts. Im Zweifel klammern; das kostet nichts und hilft dem Leser.",
    values: [
      ['()  x[i]  f(x)  x.attr', 'Höchste Bindung'],
      ['**', 'Potenz (rechtsassoziativ)'],
      ['+x  -x  ~x', 'Unäre Operatoren'],
      ['*  /  //  %  @', 'Multiplikativ'],
      ['+  -', 'Additiv'],
      ['<<  >>', 'Shift'],
      ['&  ^  |', 'Bitoperatoren (in dieser Reihenfolge)'],
      ['==  <  in  is ...', 'Vergleiche'],
      ['not', 'Logisches Nicht'],
      ['and', 'Logisches Und'],
      ['or', 'Logisches Oder'],
      ['x if c else y', 'Bedingter Ausdruck'],
      ['lambda', 'Lambda'],
      [':=', 'Zuweisungsausdruck (schwächste Bindung)']
    ],
    example: e(`
print(2 + 3 * 4)          # 14
print((2 + 3) * 4)        # 20
print(-3 ** 2)            # -9 (** vor unärem Minus)
print(2 ** 3 ** 2)        # 512 (von rechts)
print(not 1 == 2)         # True (= not (1 == 2))
print(True or False and False)   # True (and vor or)
print(1 | 2 == 3)         # True (= (1 | 2) == 3, anders als in C)
print(5 > 1 & 2)          # True (= 5 > (1 & 2) = 5 > 0)
`),
    tip: "Tückisch sind `&` und `|` zwischen Vergleichen (z. B. in pandas-Filtern): `(a > 1) & (b < 5)` immer klammern.",
    keywords: ['precedence', 'rangfolge', 'vorrang', 'priorität', 'punkt vor strich', 'klammern', 'bindung'],
    related: ['Arithmetische Operatoren', 'and / or / not', '**', 'Bitoperatoren'],
    mdn: R + 'expressions.html#operator-precedence'
  },

  {
    lang: 'py', group: 'Operatoren', name: '@ (Matrixmultiplikation)',
    desc: "Operator für Matrixmultiplikation; eingebaute Typen nutzen ihn nicht.",
    details: "`a @ b` ruft `a.__matmul__(b)` auf, `@=` entsprechend `__imatmul__`. Keine eingebaute Klasse implementiert ihn, er ist für Bibliotheken wie NumPy gedacht (`A @ B` statt `A.dot(B)`). Eigene Klassen können ihn für Vektoren oder Matrizen definieren. Nicht verwechseln mit dem `@` vor Dekoratoren, das eine ganz andere Bedeutung hat.",
    syntax: "a @ b\na @= b",
    example: e(`
class Vektor:
    def __init__(self, *werte):
        self.werte = werte

    def __matmul__(self, other):      # Skalarprodukt
        return sum(a * b for a, b in zip(self.werte, other.werte))

v = Vektor(1, 2, 3)
w = Vektor(4, 5, 6)
print(v @ w)                          # 32

try:
    [1, 2] @ [3, 4]
except TypeError:
    print("list kennt @ nicht")       # list kennt @ nicht
`),
    tip: "Mit NumPy: `import numpy as np; np.array([[1, 2], [3, 4]]) @ np.eye(2)` multipliziert Matrizen.",
    keywords: ['matmul', 'matrix', 'matrixmultiplikation', 'skalarprodukt', 'numpy', '__matmul__', 'at operator'],
    related: ['Operatorüberladung', 'Arithmetische Operatoren', 'Operator-Rangfolge'],
    mdn: R + 'expressions.html#binary-arithmetic-operations'
  },

  // ---------------- Kontrollfluss ----------------
  {
    lang: 'py', group: 'Kontrollfluss', name: 'if / elif / else',
    desc: "Verzweigung: führt den ersten Block aus, dessen Bedingung wahr ist.",
    details: "Bedingungen werden nach Truthiness ausgewertet, Klammern sind unnötig. Es gibt beliebig viele `elif`-Zweige und höchstens ein `else` am Ende; ein `switch` im C-Stil gibt es nicht, dafür `match` oder ein Dict als Nachschlagetabelle. Häufige Fehler: fehlender Doppelpunkt und `else if` statt `elif`.",
    syntax: "if bedingung:\n    ...\nelif andere_bedingung:\n    ...\nelse:\n    ...",
    example: e(`
def note(punkte):
    if punkte >= 90:
        return "sehr gut"
    elif punkte >= 75:
        return "gut"
    elif punkte >= 50:
        return "bestanden"
    else:
        return "nicht bestanden"

print(note(95))    # sehr gut
print(note(60))    # bestanden

warenkorb = []
if not warenkorb:
    print("Warenkorb ist leer")   # Warenkorb ist leer
`),
    tip: "Frühe Rückgaben („Guard Clauses“) vermeiden tief verschachtelte `if`-Blöcke.",
    keywords: ['wenn', 'sonst', 'bedingung', 'verzweigung', 'condition', 'else if', 'elseif', 'branch'],
    related: ['match', 'Bedingter Ausdruck', 'Truthiness'],
    mdn: R + 'compound_stmts.html#the-if-statement'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'for',
    desc: "Durchläuft die Elemente eines beliebigen Iterables (for-each-Schleife).",
    details: "`for x in iterierbar:` funktioniert mit Listen, Strings, Dicts (Schlüssel), Dateien, Generatoren usw. Eine Zählschleife im C-Stil gibt es nicht: Für Zahlenfolgen nimmt man `range()`, für Index und Wert `enumerate()`, für parallele Sequenzen `zip()`. Die Sammlung während der Iteration zu verändern (Elemente entfernen) führt zu übersprungenen Elementen oder `RuntimeError`; besser über eine Kopie iterieren oder eine neue Liste bauen.",
    syntax: "for element in iterierbar:\n    ...",
    example: e(`
for frucht in ["Apfel", "Birne"]:
    print(frucht)                  # Apfel, dann Birne

for i, buchstabe in enumerate("abc", start=1):
    print(i, buchstabe)            # 1 a, 2 b, 3 c

preise = {"Brot": 2.2, "Milch": 1.1}
for name, preis in preise.items():
    print(f"{name}: {preis:.2f}")  # Brot: 2.20, Milch: 1.10

namen = ["Ada", "Bob"]
alter = [36, 25]
for n, a in zip(namen, alter):
    print(n, a)                    # Ada 36, Bob 25
`),
    tip: "`for i in range(len(liste)):` ist fast immer unnötig; `enumerate(liste)` liefert Index und Element.",
    keywords: ['schleife', 'loop', 'for each', 'iterieren', 'durchlaufen', 'wiederholen', 'foreach'],
    related: ['range()', 'enumerate()', 'zip()', 'while'],
    mdn: R + 'compound_stmts.html#the-for-statement'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'while',
    desc: "Wiederholt einen Block, solange die Bedingung wahr ist.",
    details: "Die Bedingung wird vor jedem Durchlauf geprüft. Typisch ist `while True:` mit `break` für Schleifen, deren Abbruch sich erst im Rumpf ergibt (Python hat kein `do-while`). Man muss sicherstellen, dass sich die Bedingung irgendwann ändert, sonst entsteht eine Endlosschleife; in der Konsole bricht `Strg+C` sie mit `KeyboardInterrupt` ab.",
    syntax: "while bedingung:\n    ...\n\nwhile True:\n    ...\n    if fertig:\n        break",
    example: e(`
n = 27
schritte = 0
while n != 1:                 # Collatz-Folge
    n = n // 2 if n % 2 == 0 else 3 * n + 1
    schritte += 1
print(schritte)               # 111

# do-while-Ersatz
versuche = 0
while True:
    versuche += 1
    if versuche * versuche > 50:
        break
print(versuche)               # 8
`),
    tip: "Wenn die Anzahl der Durchläufe vorher feststeht oder über eine Sammlung iteriert wird, ist `for` die bessere Wahl.",
    keywords: ['schleife', 'loop', 'solange', 'endlosschleife', 'while true', 'do while', 'wiederholen'],
    related: ['for', 'break', ':= (Walrus)', 'else bei Schleifen'],
    mdn: R + 'compound_stmts.html#the-while-statement'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'range()',
    desc: "Unveränderliche, speichersparende Zahlenfolge, typisch für Zählschleifen.",
    details: "`range(stop)` zählt von 0 bis `stop - 1`, `range(start, stop, schritt)` mit beliebigem Start und Schritt, auch negativ. Das Ende ist immer exklusiv. `range` erzeugt die Zahlen erst bei Bedarf, `range(10**12)` belegt also kaum Speicher; `len()`, Indizes, Slicing und `in` funktionieren trotzdem in konstanter Zeit. Nur ganze Zahlen sind erlaubt; für Float-Schritte eine Comprehension verwenden.",
    syntax: "range(stop)\nrange(start, stop)\nrange(start, stop, schritt)",
    example: e(`
print(list(range(5)))           # [0, 1, 2, 3, 4]
print(list(range(2, 8, 2)))     # [2, 4, 6]
print(list(range(5, 0, -1)))    # [5, 4, 3, 2, 1]

r = range(0, 100, 10)
print(len(r), r[3], 50 in r)    # 10 30 True
print(range(10**12)[-1])        # 999999999999

# Float-Schritte: per Comprehension
print([i / 4 for i in range(5)])  # [0.0, 0.25, 0.5, 0.75, 1.0]
`),
    tip: "Rückwärts zählen geht auch mit `reversed(range(n))`, das ist oft lesbarer als `range(n - 1, -1, -1)`.",
    keywords: ['bereich', 'zahlenfolge', 'zählschleife', 'counter', 'sequenz', 'step', 'schritt', 'xrange'],
    related: ['for', 'enumerate()', 'reversed()'],
    mdn: D + 'stdtypes.html#range'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'break',
    desc: "Beendet die innerste for- oder while-Schleife sofort.",
    details: "Nach `break` geht es mit der ersten Anweisung nach der Schleife weiter; ein `else`-Block der Schleife wird übersprungen. `break` wirkt nur auf die innerste Schleife, beschriftete Breaks gibt es nicht. Um mehrere Ebenen zu verlassen, lagert man die Schleifen in eine Funktion aus und nutzt `return`.",
    syntax: "for x in daten:\n    if bedingung:\n        break",
    example: e(`
zahlen = [4, 7, 12, 3, 20]
for z in zahlen:
    if z > 10:
        print("Erste Zahl > 10:", z)   # Erste Zahl > 10: 12
        break

def finde_paar(matrix, ziel):
    # Verschachtelte Schleifen verlässt man per return
    for i, zeile in enumerate(matrix):
        for j, wert in enumerate(zeile):
            if wert == ziel:
                return i, j
    return None

print(finde_paar([[1, 2], [3, 4]], 3))   # (1, 0)
`),
    tip: "Die Suche nach dem ersten passenden Element geht oft kürzer mit `next((x for x in daten if bed), None)`.",
    keywords: ['abbrechen', 'schleife beenden', 'exit loop', 'verlassen', 'stop'],
    related: ['continue', 'else bei Schleifen', 'while'],
    mdn: T + 'controlflow.html#break-and-continue-statements'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'continue',
    desc: "Springt sofort zum nächsten Durchlauf der Schleife.",
    details: "Der Rest des Schleifenrumpfs wird übersprungen, bei `for` geht es mit dem nächsten Element weiter, bei `while` mit der nächsten Bedingungsprüfung. `continue` eignet sich, um unpassende Elemente früh auszusortieren und die Verschachtelung flach zu halten. In `while`-Schleifen aufpassen, dass der Zähler vor dem `continue` erhöht wird, sonst droht eine Endlosschleife.",
    syntax: "for x in daten:\n    if überspringen:\n        continue\n    ...",
    example: e(`
zeilen = ["# Kommentar", "name=Ada", "", "alter=36"]
config = {}
for zeile in zeilen:
    if not zeile or zeile.startswith("#"):
        continue                   # leere und Kommentarzeilen überspringen
    schluessel, wert = zeile.split("=")
    config[schluessel] = wert

print(config)                      # {'name': 'Ada', 'alter': '36'}
`),
    tip: "Ein einfacher Filter lässt sich oft als Comprehension mit `if` schreiben und braucht dann gar kein `continue`.",
    keywords: ['überspringen', 'skip', 'nächster durchlauf', 'next iteration', 'weiter'],
    related: ['break', 'for', 'Comprehension mit Bedingung'],
    mdn: T + 'controlflow.html#break-and-continue-statements'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'else bei Schleifen',
    desc: "Ein else-Block nach for/while läuft nur, wenn die Schleife ohne break endet.",
    details: "Das `else` einer Schleife bedeutet „kein `break`“: Es wird ausgeführt, wenn die Schleife regulär zu Ende läuft (auch bei leerer Sammlung), und übersprungen, wenn sie per `break` verlassen wird. Typischer Einsatz ist die Suche: Gefunden heißt `break`, nicht gefunden landet im `else`. Der Name ist irreführend, deshalb einen Kommentar wie `# kein break` dazuschreiben.",
    syntax: "for x in daten:\n    if treffer:\n        break\nelse:\n    # kein break\n    ...",
    example: e(`
def ist_primzahl(n):
    if n < 2:
        return False
    for teiler in range(2, int(n ** 0.5) + 1):
        if n % teiler == 0:
            break
    else:                       # kein break: kein Teiler gefunden
        return True
    return False

print([n for n in range(20) if ist_primzahl(n)])
# [2, 3, 5, 7, 11, 13, 17, 19]
`),
    tip: "Wer das Konstrukt unklar findet, nimmt eine Funktion mit `return` oder `any()`.",
    keywords: ['for else', 'while else', 'schleifen else', 'no break', 'suche', 'loop else'],
    related: ['break', 'for', 'any() / all()'],
    mdn: T + 'controlflow.html#else-clauses-on-loops'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'pass',
    desc: "Leere Anweisung als Platzhalter, wo syntaktisch ein Block nötig ist.",
    details: "Weil Blöcke nicht leer sein dürfen, setzt man `pass` in noch nicht implementierte Funktionen, leere Klassen oder bewusst ignorierte Fälle. `pass` tut nichts und wird einfach übersprungen. Für Stubs ist auch `...` (Ellipsis) verbreitet; ein Docstring allein reicht ebenfalls als Rumpf.",
    syntax: "def spaeter():\n    pass",
    example: e(`
class MeinFehler(Exception):
    pass                       # leere Klasse

def noch_offen():
    pass                       # Platzhalter, gibt None zurück

for zahl in range(3):
    if zahl == 1:
        pass                   # bewusst nichts tun
    else:
        print(zahl)            # 0, dann 2

print(noch_offen())            # None
`),
    tip: "`except: pass` verschluckt jeden Fehler und erschwert die Fehlersuche; lieber gezielt `contextlib.suppress(FehlerTyp)` verwenden.",
    keywords: ['platzhalter', 'placeholder', 'leer', 'nichts tun', 'noop', 'stub', 'leerer block'],
    related: ['Ellipsis (...)', 'Einrückung', 'contextlib.suppress'],
    mdn: T + 'controlflow.html#pass-statements'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'match',
    desc: "Strukturelles Pattern Matching: vergleicht einen Wert mit Mustern (seit Python 3.10).",
    details: "`match` prüft die `case`-Zweige von oben nach unten und führt den ersten passenden aus; ein Durchfallen wie bei `switch` gibt es nicht. Neben Literalen passen Muster auf Struktur: Sequenzen, Dicts, Klassen, mit Bindung von Variablen. `case _:` fängt alles Übrige. Fallstrick: Ein nackter Name wie `case status:` vergleicht nicht, sondern bindet immer; Konstanten müssen punktiert sein (`case Farbe.ROT:`).",
    syntax: "match wert:\n    case muster1:\n        ...\n    case muster2 | muster3:\n        ...\n    case _:\n        ...",
    example: e(`
def http_text(status):
    match status:
        case 200:
            return "OK"
        case 301 | 302:
            return "Weiterleitung"
        case 404:
            return "Nicht gefunden"
        case code if 500 <= code < 600:
            return "Serverfehler"
        case _:
            return "Unbekannt"

print(http_text(200))    # OK
print(http_text(302))    # Weiterleitung
print(http_text(503))    # Serverfehler
print(http_text(999))    # Unbekannt
`),
    tip: "Für einfache Wert-zu-Wert-Zuordnungen ist ein Dict (`texte.get(status, \"Unbekannt\")`) kürzer als `match`.",
    keywords: ['switch', 'case', 'pattern matching', 'mustervergleich', 'structural pattern matching', 'fallunterscheidung'],
    related: ['match: Muster', 'match: Guards', 'if / elif / else'],
    mdn: T + 'controlflow.html#match-statements'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'match: Muster',
    desc: "Musterarten in case: Literal, Capture, Sequenz, Mapping, Klasse, Oder, as.",
    details: "Sequenzmuster `[x, y, *rest]` passen auf Listen und Tupel (nicht auf Strings), Mapping-Muster `{\"typ\": t}` auf Dicts, wobei zusätzliche Schlüssel erlaubt sind. Klassenmuster `Punkt(x=0, y=y)` prüfen `isinstance` und Attribute; für Positionsargumente braucht die Klasse `__match_args__`, was Dataclasses automatisch setzen. `|` verbindet Alternativen, `as` bindet das Teilergebnis an einen Namen.",
    values: [
      ['case 0 | 1:', 'Literale, Alternativen'],
      ['case x:', 'Capture: passt immer, bindet x'],
      ['case _:', 'Wildcard, bindet nichts'],
      ['case [a, b, *rest]:', 'Sequenzmuster'],
      ['case {"k": v, **rest}:', 'Mapping-Muster'],
      ['case Punkt(x=0, y=y):', 'Klassenmuster mit Attributen'],
      ['case int() | float():', 'Typprüfung über Klassenmuster'],
      ['case [x, y] as paar:', 'Teilmuster an Namen binden']
    ],
    example: e(`
from dataclasses import dataclass

@dataclass
class Punkt:
    x: int
    y: int

def beschreibe(obj):
    match obj:
        case Punkt(x=0, y=0):
            return "Ursprung"
        case Punkt(x=0, y=y):
            return f"auf y-Achse bei {y}"
        case [x, y]:
            return f"Paar {x}, {y}"
        case [erstes, *rest]:
            return f"Liste ab {erstes}, {len(rest)} weitere"
        case {"typ": "kreis", "r": r}:
            return f"Kreis mit r={r}"
        case int() | float() as zahl:
            return f"Zahl {zahl}"
        case _:
            return "unbekannt"

print(beschreibe(Punkt(0, 5)))               # auf y-Achse bei 5
print(beschreibe([1, 2]))                    # Paar 1, 2
print(beschreibe([1, 2, 3]))                 # Liste ab 1, 2 weitere
print(beschreibe({"typ": "kreis", "r": 2}))  # Kreis mit r=2
print(beschreibe(3.5))                       # Zahl 3.5
`),
    tip: "Die Reihenfolge der `case`-Zweige zählt: Spezielle Muster vor allgemeine setzen, sonst sind sie unerreichbar.",
    keywords: ['pattern', 'muster', 'sequenzmuster', 'mapping pattern', 'class pattern', 'destrukturieren', '__match_args__'],
    related: ['match', 'match: Guards', '@dataclass', 'Stern-Entpacken'],
    mdn: R + 'compound_stmts.html#patterns'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'match: Guards',
    desc: "Zusätzliche Bedingung hinter einem Muster: case muster if bedingung.",
    details: "Ein Guard wird erst geprüft, nachdem das Muster gepasst hat, und kann die gebundenen Variablen verwenden. Ist der Guard falsch, geht es mit dem nächsten `case` weiter. Guards ersetzen Vergleiche, die Muster selbst nicht ausdrücken können, etwa Bereiche oder Beziehungen zwischen Teilwerten.",
    syntax: "case muster if bedingung:",
    example: e(`
def einordnen(punkt):
    match punkt:
        case (x, y) if x == y:
            return "auf der Diagonale"
        case (x, y) if x > 0 and y > 0:
            return "1. Quadrant"
        case (x, y):
            return f"anderswo ({x}, {y})"

print(einordnen((3, 3)))     # auf der Diagonale
print(einordnen((2, 5)))     # 1. Quadrant
print(einordnen((-1, 4)))    # anderswo (-1, 4)

befehl = "gehe 10"
match befehl.split():
    case ["gehe", n] if n.isdigit():
        print(f"Gehe {int(n)} Schritte")   # Gehe 10 Schritte
    case _:
        print("Unbekannter Befehl")
`),
    tip: "Kommandozeilen-Parser für kleine Textbefehle lassen sich mit `match befehl.split():` und Guards elegant schreiben.",
    keywords: ['guard', 'wächter', 'case if', 'bedingung im muster', 'pattern guard'],
    related: ['match', 'match: Muster', 'if / elif / else'],
    mdn: R + 'compound_stmts.html#guards'
  },
  {
    lang: 'py', group: 'Kontrollfluss', name: 'Ellipsis (...)',
    desc: "Das eingebaute Objekt ... dient als Platzhalter und in Typ-Hinweisen.",
    details: "`...` ist ein gültiger Ausdruck und das einzige Objekt vom Typ `ellipsis`. Als Funktionsrumpf zeigt es „wird noch implementiert“ oder in Protokollen und Stub-Dateien (`.pyi`) „nur Signatur“. In Typ-Hinweisen steht es z. B. in `tuple[int, ...]` (beliebig viele `int`) und `Callable[..., str]` (beliebige Parameter). NumPy nutzt es beim Slicing mehrdimensionaler Arrays.",
    syntax: "def stub(): ...\ntuple[int, ...]\nCallable[..., T]",
    example: e(`
from typing import Protocol

class Zeichenbar(Protocol):
    def zeichne(self) -> str: ...     # nur Signatur

def spaeter():
    ...                               # Platzhalter

print(spaeter())                      # None
print(... is Ellipsis)                # True
print(type(...).__name__)             # ellipsis

def summe(werte: tuple[int, ...]) -> int:
    return sum(werte)

print(summe((1, 2, 3)))               # 6
`),
    tip: "Zwischen `pass` und `...` gibt es funktional keinen Unterschied; `...` wirkt in Stubs und Protokollen idiomatischer.",
    keywords: ['ellipsis', 'drei punkte', 'platzhalter', 'stub', 'auslassungspunkte', 'dots'],
    related: ['pass', 'typing.Protocol', 'Callable'],
    mdn: D + 'constants.html#Ellipsis'
  },

  // ---------------- Comprehensions ----------------
  {
    lang: 'py', group: 'Comprehensions', name: 'List Comprehension',
    desc: "Erzeugt eine Liste kompakt aus einem Iterable: [ausdruck for x in daten].",
    details: "Eine List Comprehension ersetzt die Schleife mit `append` durch einen einzigen Ausdruck und ist meist schneller. Optional filtert ein `if` hinter dem `for`. Sie sollte nur für das Erzeugen neuer Listen verwendet werden, nicht für Seiteneffekte wie `print`. Wird es mit mehreren Bedingungen und Schleifen unübersichtlich, ist eine normale Schleife besser.",
    syntax: "[ausdruck for element in iterierbar]\n[ausdruck for element in iterierbar if bedingung]",
    example: e(`
zahlen = [1, 2, 3, 4, 5]
quadrate = [z * z for z in zahlen]
print(quadrate)                     # [1, 4, 9, 16, 25]

# Entspricht:
quadrate2 = []
for z in zahlen:
    quadrate2.append(z * z)
print(quadrate == quadrate2)        # True

namen = ["  ada ", "BOB", " eve"]
print([n.strip().capitalize() for n in namen])   # ['Ada', 'Bob', 'Eve']
print([len(w) for w in "Python ist toll".split()])  # [6, 3, 4]
`),
    tip: "Für Aggregationen keine Liste bauen: `sum(x * x for x in zahlen)` braucht keine eckigen Klammern.",
    keywords: ['listcomp', 'list comprehension', 'listenabstraktion', 'map', 'liste erzeugen', 'einzeiler'],
    related: ['Comprehension mit Bedingung', 'Generator-Ausdruck', 'Dict Comprehension', 'map()'],
    mdn: T + 'datastructures.html#list-comprehensions'
  },
  {
    lang: 'py', group: 'Comprehensions', name: 'Dict Comprehension',
    desc: "Erzeugt ein Dictionary: {schluessel: wert for x in daten}.",
    details: "Wie die List Comprehension, aber mit `schluessel: wert` in geschweiften Klammern. Praktisch zum Umdrehen von Dicts, Filtern von Einträgen oder zum Aufbau von Nachschlagetabellen. Kommt ein Schlüssel mehrfach vor, gewinnt der letzte Wert ohne Warnung.",
    syntax: "{k: v for element in iterierbar}\n{k: v for k, v in d.items() if bedingung}",
    example: e(`
woerter = ["Apfel", "Kiwi", "Banane"]
laengen = {w: len(w) for w in woerter}
print(laengen)                 # {'Apfel': 5, 'Kiwi': 4, 'Banane': 6}

preise = {"Brot": 2.2, "Kaviar": 89.0, "Milch": 1.1}
guenstig = {k: v for k, v in preise.items() if v < 5}
print(guenstig)                # {'Brot': 2.2, 'Milch': 1.1}

# Dict umkehren
codes = {"de": "Deutsch", "en": "Englisch"}
print({v: k for k, v in codes.items()})   # {'Deutsch': 'de', 'Englisch': 'en'}
`),
    tip: "Aus zwei parallelen Listen geht es ohne Comprehension: `dict(zip(schluessel, werte))`.",
    keywords: ['dictcomp', 'dict comprehension', 'wörterbuch erzeugen', 'mapping', 'dict erstellen'],
    related: ['List Comprehension', 'dict', 'dict.items()', 'zip()'],
    mdn: T + 'datastructures.html#dictionaries'
  },
  {
    lang: 'py', group: 'Comprehensions', name: 'Set Comprehension',
    desc: "Erzeugt eine Menge ohne Duplikate: {ausdruck for x in daten}.",
    details: "Wie die List Comprehension, aber in geschweiften Klammern ohne Doppelpunkt; doppelte Ergebnisse fallen automatisch weg. Die Reihenfolge der Elemente ist nicht festgelegt. Achtung: `{}` ist ein leeres Dict, eine leere Menge schreibt man `set()`.",
    syntax: "{ausdruck for element in iterierbar}",
    example: e(`
emails = ["ada@a.de", "bob@b.com", "eve@a.de", "max@B.com"]
domains = {m.split("@")[1].lower() for m in emails}
print(sorted(domains))          # ['a.de', 'b.com']

text = "Anna sah ein Lama"
buchstaben = {c.lower() for c in text if c.isalpha()}
print(len(buchstaben))          # 8
print(type({}), type(set()))    # <class 'dict'> <class 'set'>
`),
    tip: "Weil Sets ungeordnet sind, für reproduzierbare Ausgaben `sorted(menge)` verwenden.",
    keywords: ['setcomp', 'set comprehension', 'menge erzeugen', 'duplikate entfernen', 'eindeutig', 'unique'],
    related: ['set', 'List Comprehension', 'Mengenoperationen'],
    mdn: T + 'datastructures.html#sets'
  },
  {
    lang: 'py', group: 'Comprehensions', name: 'Generator-Ausdruck',
    desc: "Wie eine List Comprehension in runden Klammern, aber lazy: (x for x in daten).",
    details: "Ein Generator-Ausdruck erzeugt seine Werte erst beim Durchlaufen und belegt daher kaum Speicher, auch bei Millionen Elementen. Als einziges Argument einer Funktion dürfen die eigenen Klammern entfallen: `sum(x * x for x in daten)`. Ein Generator lässt sich nur einmal durchlaufen; danach ist er erschöpft und liefert nichts mehr.",
    syntax: "(ausdruck for element in iterierbar if bedingung)\nfunktion(ausdruck for element in iterierbar)",
    example: e(`
import sys

zahlen = range(1_000_000)
liste = [x * 2 for x in zahlen]
gen = (x * 2 for x in zahlen)
print(sys.getsizeof(liste) > 1_000_000)  # True
print(sys.getsizeof(gen) < 500)          # True

print(sum(x * x for x in range(4)))      # 14
print(max(len(w) for w in ["a", "abc", "ab"]))  # 3
print(any(x > 3 for x in [1, 5, 2]))     # True

g = (c.upper() for c in "ab")
print(list(g))                           # ['A', 'B']
print(list(g))                           # [] (erschöpft)
`),
    tip: "Für `any()`, `all()`, `sum()`, `min()`, `max()` und `\"\".join()` immer den Generator-Ausdruck statt einer Liste übergeben.",
    keywords: ['generator expression', 'genexp', 'lazy', 'speicher sparen', 'runde klammern', 'iterator'],
    related: ['List Comprehension', 'Generator', 'Lazy Evaluation', 'sum()'],
    mdn: R + 'expressions.html#generator-expressions'
  },
  {
    lang: 'py', group: 'Comprehensions', name: 'Verschachtelte Comprehensions',
    desc: "Mehrere for-Klauseln in einer Comprehension oder Comprehensions ineinander.",
    details: "Mehrere `for`-Klauseln werden von links nach rechts gelesen wie verschachtelte Schleifen: Die erste ist die äußere. Damit flacht man Listen von Listen ab oder bildet alle Kombinationen. Eine Comprehension als Ausdruck einer anderen (`[[...] for ...]`) erzeugt dagegen verschachtelte Listen, etwa Matrizen. Mehr als zwei Ebenen werden schnell unlesbar.",
    syntax: "[x for zeile in matrix for x in zeile]\n[[ausdruck for j in b] for i in a]",
    example: e(`
matrix = [[1, 2, 3], [4, 5, 6]]

# Abflachen: äußere Schleife zuerst
flach = [x for zeile in matrix for x in zeile]
print(flach)                     # [1, 2, 3, 4, 5, 6]

# Transponieren: Comprehension in Comprehension
transponiert = [[zeile[i] for zeile in matrix] for i in range(3)]
print(transponiert)              # [[1, 4], [2, 5], [3, 6]]

# Alle Kombinationen
paare = [(f, g) for f in "SM" for g in (1, 2)]
print(paare)                     # [('S', 1), ('S', 2), ('M', 1), ('M', 2)]

# 3x3-Gitter mit Nullen (richtig, ohne [[0] * 3] * 3)
gitter = [[0] * 3 for _ in range(3)]
print(gitter)                    # [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
`),
    tip: "Für Kombinationen ist `itertools.product()` oft klarer, für Transponieren `list(zip(*matrix))`.",
    keywords: ['nested', 'verschachtelt', 'abflachen', 'flatten', 'matrix', 'kombinationen', 'mehrere for'],
    related: ['List Comprehension', 'itertools.product()', 'Listen-Fallstrick [[]] * n', 'itertools.chain()'],
    mdn: T + 'datastructures.html#nested-list-comprehensions'
  },
  {
    lang: 'py', group: 'Comprehensions', name: 'Comprehension mit Bedingung',
    desc: "Filtern mit if hinter dem for, Werte wählen mit if/else vor dem for.",
    details: "Ein `if` am Ende filtert: Nur Elemente, für die die Bedingung wahr ist, landen im Ergebnis; mehrere `if` werden wie `and` verknüpft. Ein bedingter Ausdruck `a if b else c` vor dem `for` filtert nicht, sondern bestimmt den Wert jedes Elements. Häufiger Fehler: `[x for x in daten if x > 0 else 0]` ist ein Syntaxfehler; das `else` gehört nach vorn.",
    syntax: "[x for x in daten if bedingung]          # filtern\n[a if bedingung else b for x in daten]   # abbilden",
    example: e(`
zahlen = [-3, 4, 0, 7, -1, 10]

positiv = [z for z in zahlen if z > 0]
print(positiv)                         # [4, 7, 10]

gerade_positiv = [z for z in zahlen if z > 0 if z % 2 == 0]
print(gerade_positiv)                  # [4, 10]

begrenzt = [z if z > 0 else 0 for z in zahlen]
print(begrenzt)                        # [0, 4, 0, 7, 0, 10]

beides = ["groß" if z > 5 else "klein" for z in zahlen if z > 0]
print(beides)                          # ['klein', 'groß', 'groß']
`),
    tip: "Merkhilfe: `if` allein steht hinten (Filter), `if ... else` steht vorn (Ausdruck).",
    keywords: ['filter', 'filtern', 'bedingung', 'if else', 'comprehension if', 'auswählen'],
    related: ['List Comprehension', 'Bedingter Ausdruck', 'filter()'],
    mdn: T + 'datastructures.html#list-comprehensions'
  },
  {
    lang: 'py', group: 'Comprehensions', name: 'Comprehension-Gültigkeitsbereich',
    desc: "Schleifenvariablen einer Comprehension bleiben lokal und überschreiben nichts.",
    details: "Anders als bei einer `for`-Schleife ist die Laufvariable einer Comprehension nach außen nicht sichtbar und verändert gleichnamige Variablen nicht. Ausnahme ist `:=`: Ein Zuweisungsausdruck bindet den Namen im umgebenden Bereich. In Klassenrümpfen sehen Comprehensions (außer im ersten Iterable) die Klassenvariablen nicht, was zu `NameError` führen kann. Seit Python 3.12 werden Comprehensions inline ausgeführt (PEP 709), das Verhalten bleibt aber gleich.",
    example: e(`
x = "außen"
quadrate = [x * x for x in range(4)]
print(x)                     # außen (nicht überschrieben)

for y in range(3):
    pass
print(y)                     # 2 (normale Schleife: Variable bleibt)

# := bindet nach außen
daten = [3, 9, 4]
if any((treffer := d) > 5 for d in daten):
    print(treffer)           # 9
`),
    tip: "Mit `any()` und `:=` lässt sich das erste passende Element einer Suche direkt weiterverwenden.",
    keywords: ['scope', 'gültigkeitsbereich', 'leak', 'laufvariable', 'pep 709', 'sichtbarkeit'],
    related: ['Gültigkeitsbereiche (LEGB)', ':= (Walrus)', 'List Comprehension'],
    mdn: R + 'expressions.html#displays-for-lists-sets-and-dictionaries'
  },
  {
    lang: 'py', group: 'Comprehensions', name: 'Comprehension oder Schleife?',
    desc: "Faustregeln, wann eine Comprehension lesbarer ist und wann eine for-Schleife.",
    details: "Comprehensions eignen sich, wenn aus einem Iterable eine neue Sammlung entsteht: abbilden, filtern, kurz und ohne Seiteneffekte. Eine Schleife ist besser bei mehreren Anweisungen pro Element, bei Ausnahmebehandlung, bei `break` oder wenn nur Seiteneffekte wie Ausgabe oder Schreiben gewollt sind. `[print(x) for x in daten]` baut eine nutzlose Liste aus `None`. Passt die Comprehension nicht mehr gut in eine bis zwei Zeilen, lieber eine Schleife oder eine Hilfsfunktion schreiben.",
    values: [
      ['Comprehension', 'Neue Sammlung, abbilden und filtern, kein Seiteneffekt'],
      ['Generator-Ausdruck', 'Werte nur einmal durchlaufen oder aggregieren'],
      ['for-Schleife', 'Seiteneffekte, try/except, break, mehrere Schritte'],
      ['Hilfsfunktion', 'Komplexe Umwandlung, dann [f(x) for x in daten]']
    ],
    example: e(`
def parse(text):
    try:
        return int(text)
    except ValueError:
        return None

roh = ["1", "x", "3"]

# Komplexe Logik in Funktion auslagern, Comprehension bleibt kurz
werte = [w for t in roh if (w := parse(t)) is not None]
print(werte)                   # [1, 3]

# Seiteneffekte: normale Schleife
for w in werte:
    print(f"Wert: {w}")        # Wert: 1, dann Wert: 3
`),
    tip: "Lesbarkeit geht vor Kürze: Eine Comprehension über drei Zeilen mit zwei Bedingungen spart nichts.",
    keywords: ['stil', 'lesbarkeit', 'best practice', 'schleife oder comprehension', 'seiteneffekt', 'pythonic'],
    related: ['List Comprehension', 'for', 'Generator-Ausdruck'],
    mdn: T + 'datastructures.html#list-comprehensions'
  }
  );
})();
