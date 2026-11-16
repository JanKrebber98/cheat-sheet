window.CHEAT = window.CHEAT || [];
(function () {
  var D = 'https://docs.python.org/3/library/';   // + z. B. 'exceptions.html'
  var R = 'https://docs.python.org/3/reference/'; // Sprachreferenz
  var T = 'https://docs.python.org/3/tutorial/';  // Tutorial
  var G = 'https://docs.python.org/3/glossary.html#'; // Glossar
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Exceptions ----------------
  {
    lang: 'py', group: 'Exceptions', name: 'try / except',
    desc: 'Fängt Ausnahmen ab, die im try-Block auftreten, und behandelt sie gezielt.',
    details: 'Python prüft die `except`-Klauseln von oben nach unten und nimmt die erste, deren Typ passt (auch Unterklassen). Mehrere Typen fasst man als Tupel zusammen, mit `as e` erhält man das Exception-Objekt. Ein nacktes `except:` fängt auch `KeyboardInterrupt` und `SystemExit` ab und versteckt Fehler – fast immer ein Fehler. Seit Python 3.14 dürfen mehrere Typen ohne Klammern stehen, solange kein `as` folgt.',
    syntax: 'try:\n    ...\nexcept Typ as e:\n    ...\nexcept (TypA, TypB):\n    ...',
    example: e(`
def zahl_lesen(text):
    try:
        return int(text)
    except ValueError as e:
        print("Ungültig:", e)
        return None
    except (TypeError, OverflowError):
        print("Falscher Typ")
        return None

print(zahl_lesen("42"))    # 42
print(zahl_lesen("abc"))   # Ungültig: invalid literal for int() with base 10: 'abc' / None
print(zahl_lesen(None))    # Falscher Typ / None
`),
    tip: 'Den try-Block so klein wie möglich halten: nur die Zeile, die die erwartete Ausnahme werfen kann, sonst fängt man versehentlich fremde Fehler ab.',
    keywords: ['exception', 'ausnahme', 'fehler abfangen', 'catch', 'fehlerbehandlung', 'error handling', 'except as'],
    related: ['else & finally', 'raise', 'Exception-Hierarchie', 'Häufige Exceptions'],
    mdn: R + 'compound_stmts.html#the-try-statement'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'else & finally',
    desc: 'else läuft nur ohne Ausnahme, finally läuft immer – auch bei return oder Fehlern.',
    details: '`else` gehört hinter alle `except`-Klauseln und enthält Code, der nur bei Erfolg laufen soll, aber selbst nicht mehr abgesichert sein muss. `finally` wird in jedem Fall ausgeführt und eignet sich für Aufräumarbeiten. Ein `return` in `finally` überschreibt den eigentlichen Rückgabewert und verschluckt Ausnahmen; seit Python 3.14 gibt es dafür eine `SyntaxWarning`.',
    syntax: 'try:\n    ...\nexcept Typ:\n    ...\nelse:\n    ...  # nur ohne Ausnahme\nfinally:\n    ...  # immer',
    example: e(`
def teilen(a, b):
    try:
        ergebnis = a / b
    except ZeroDivisionError:
        print("Division durch 0")
    else:
        print("Ergebnis:", ergebnis)
    finally:
        print("fertig")

teilen(10, 4)   # Ergebnis: 2.5 / fertig
teilen(1, 0)    # Division durch 0 / fertig
`),
    tip: 'Für Ressourcen wie Dateien oder Sperren ist `with` meist die bessere Wahl als ein eigenes `finally`.',
    keywords: ['finally', 'else', 'aufräumen', 'cleanup', 'immer ausführen', 'try else'],
    related: ['try / except', 'with', 'Eigener Context Manager'],
    mdn: T + 'errors.html#defining-clean-up-actions'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'raise',
    desc: 'Löst eine Ausnahme aus oder wirft die gerade behandelte erneut.',
    details: 'Nach `raise` steht eine Exception-Instanz oder eine Klasse (die dann ohne Argumente instanziiert wird). Ein nacktes `raise` innerhalb von `except` wirft die aktuelle Ausnahme unverändert mit ursprünglichem Traceback weiter. Die Meldung sollte den konkreten Wert nennen, damit der Fehler ohne Debugger verständlich ist.',
    syntax: 'raise Typ("Meldung")\nraise          # im except: erneut auslösen',
    example: e(`
def alter_setzen(alter):
    if not isinstance(alter, int):
        raise TypeError(f"alter muss int sein, nicht {type(alter).__name__}")
    if alter < 0:
        raise ValueError(f"alter darf nicht negativ sein: {alter}")
    return alter

try:
    alter_setzen(-3)
except ValueError as e:
    print(e)              # alter darf nicht negativ sein: -3

try:
    alter_setzen("5")
except TypeError as e:
    print(e)              # alter muss int sein, nicht str
`),
    tip: 'Zum Weiterwerfen im `except` ein nacktes `raise` statt `raise e` verwenden – so bleibt der Traceback sauber.',
    keywords: ['werfen', 'throw', 'auslösen', 'exception werfen', 'reraise', 'erneut auslösen'],
    related: ['try / except', 'raise from', 'Eigene Exceptions'],
    mdn: R + 'simple_stmts.html#the-raise-statement'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'Eigene Exceptions',
    desc: 'Eigene Fehlerklassen leitet man von Exception ab, oft mit gemeinsamer Basisklasse.',
    details: 'Eine eigene Exception ist eine normale Klasse, die von `Exception` (nicht von `BaseException`) erbt. Eine gemeinsame Basisklasse pro Bibliothek erlaubt Aufrufern, alle eigenen Fehler mit einem `except` zu fangen. Zusätzliche Attribute speichert man im `__init__`; dabei `super().__init__(meldung)` aufrufen, damit `str(e)` und `e.args` stimmen. Namen enden üblicherweise auf `Error`.',
    syntax: 'class MeinFehler(Exception):\n    pass',
    example: e(`
class ShopError(Exception):
    """Basisklasse aller Fehler des Shops."""

class NichtVorraetig(ShopError):
    def __init__(self, artikel, menge):
        super().__init__(f"{artikel}: nur noch {menge} Stück")
        self.artikel = artikel
        self.menge = menge

try:
    raise NichtVorraetig("Tasse", 2)
except ShopError as e:
    print(e)                       # Tasse: nur noch 2 Stück
    print(type(e).__name__)        # NichtVorraetig
    print(e.menge)                 # 2
`),
    tip: 'Nicht für jeden Fall eine eigene Klasse anlegen: Oft reichen `ValueError`, `TypeError` oder `KeyError` mit guter Meldung.',
    keywords: ['custom exception', 'eigene fehlerklasse', 'exception ableiten', 'benutzerdefiniert', 'error klasse'],
    related: ['raise', 'Exception-Hierarchie', 'Vererbung'],
    mdn: T + 'errors.html#user-defined-exceptions'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'Exception-Hierarchie',
    desc: 'Alle Ausnahmen erben von BaseException; normale Fehler von Exception.',
    details: 'Direkt unter `BaseException` stehen `SystemExit`, `KeyboardInterrupt`, `GeneratorExit` und `Exception`. Fast alle Programmfehler erben von `Exception`, sodass `except Exception` sie fängt, Strg+C und `sys.exit()` aber nicht. Wichtige Zwischenklassen sind `LookupError` (`KeyError`, `IndexError`), `ArithmeticError` und `OSError` (z. B. `FileNotFoundError`). Ein `except` fängt immer auch alle Unterklassen.',
    values: [
      ['BaseException', 'Wurzel aller Ausnahmen'],
      ['Exception', 'Basis aller „normalen“ Fehler'],
      ['LookupError', 'KeyError, IndexError'],
      ['ArithmeticError', 'ZeroDivisionError, OverflowError'],
      ['OSError', 'FileNotFoundError, PermissionError, TimeoutError …'],
      ['KeyboardInterrupt / SystemExit', 'Erben nicht von Exception']
    ],
    example: e(`
print(KeyError.__mro__)
# (<class 'KeyError'>, <class 'LookupError'>, <class 'Exception'>, <class 'BaseException'>, <class 'object'>)

print(issubclass(FileNotFoundError, OSError))       # True
print(issubclass(KeyboardInterrupt, Exception))     # False

try:
    [1, 2][5]
except LookupError as e:          # fängt IndexError und KeyError
    print(type(e).__name__)       # IndexError
`),
    tip: 'Spezifische Klassen zuerst abfangen, allgemeine danach – sonst erreicht Python die spezifische Klausel nie.',
    keywords: ['hierarchie', 'baseexception', 'exception klassen', 'vererbung exceptions', 'lookuperror', 'oserror'],
    related: ['Häufige Exceptions', 'try / except', 'Eigene Exceptions'],
    mdn: D + 'exceptions.html#exception-hierarchy'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'raise from',
    desc: 'Verkettet Ausnahmen: zeigt, welcher Fehler einen anderen ausgelöst hat.',
    details: 'Mit `raise NeuerFehler(...) from e` landet die ursprüngliche Ausnahme in `__cause__`, und der Traceback zeigt beide mit „The above exception was the direct cause …“. Ohne `from` setzt Python `__context__` automatisch, was als „During handling … another exception occurred“ erscheint und eher nach einem Folgefehler aussieht. `raise ... from None` unterdrückt die Kette, wenn die Ursache ein Implementierungsdetail ist.',
    syntax: 'raise NeuerFehler("...") from ursache\nraise NeuerFehler("...") from None',
    example: e(`
class ConfigError(Exception):
    pass

def port_lesen(werte):
    try:
        return int(werte["port"])
    except (KeyError, ValueError) as e:
        raise ConfigError("Port fehlt oder ist ungültig") from e

try:
    port_lesen({"port": "abc"})
except ConfigError as e:
    print(e)                          # Port fehlt oder ist ungültig
    print(repr(e.__cause__))          # ValueError("invalid literal for int() with base 10: 'abc'")
`),
    tip: 'Beim Übersetzen technischer Fehler in Fachfehler immer `from e` angeben, damit die Ursache beim Debuggen sichtbar bleibt.',
    keywords: ['exception chaining', 'verkettung', 'cause', '__cause__', '__context__', 'from none', 'ursache'],
    related: ['raise', 'Eigene Exceptions', 'traceback'],
    mdn: D + 'exceptions.html#exception-context'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'ExceptionGroup & except*',
    desc: 'Bündelt mehrere unabhängige Ausnahmen; except* behandelt sie getrennt nach Typ.',
    details: '`ExceptionGroup(meldung, [fehler, ...])` transportiert mehrere Fehler gleichzeitig, etwa aus parallelen Tasks einer `asyncio.TaskGroup`. Mit `except*` greift jede Klausel die passenden Fehler aus der Gruppe heraus; mehrere Klauseln können nacheinander zum Zug kommen. Nicht behandelte Fehler werden als verkleinerte Gruppe weitergereicht. `except` und `except*` dürfen in einem `try` nicht gemischt werden.',
    syntax: 'try:\n    ...\nexcept* ValueError as gruppe:\n    for e in gruppe.exceptions: ...',
    example: e(`
def pruefen(daten):
    fehler = []
    if not daten.get("name"):
        fehler.append(ValueError("name fehlt"))
    if not isinstance(daten.get("alter"), int):
        fehler.append(TypeError("alter muss int sein"))
    if fehler:
        raise ExceptionGroup("Ungültige Daten", fehler)

try:
    pruefen({"alter": "drei"})
except* ValueError as g:
    print("Werte:", [str(e) for e in g.exceptions])   # Werte: ['name fehlt']
except* TypeError as g:
    print("Typen:", [str(e) for e in g.exceptions])   # Typen: ['alter muss int sein']
`),
    tip: 'Zum Validieren sammelt man Fehler und wirft sie gemeinsam – so sieht der Nutzer alle Probleme auf einmal statt nur das erste.',
    keywords: ['exceptiongroup', 'except star', 'mehrere exceptions', 'baseexceptiongroup', 'parallel fehler', 'pep 654'],
    related: ['try / except', 'asyncio.TaskGroup', 'Eigene Exceptions'],
    mdn: T + 'errors.html#raising-and-handling-multiple-unrelated-exceptions'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'assert',
    desc: 'Prüft eine Annahme und wirft AssertionError, wenn sie nicht stimmt.',
    details: '`assert bedingung, meldung` dient zum Absichern interner Annahmen und in Tests. Mit `python -O` werden alle `assert`-Anweisungen entfernt – deshalb nie Benutzereingaben oder Sicherheitsregeln damit prüfen. Ein häufiger Fehler ist `assert (x, "Meldung")`: Das Tupel ist immer wahr, die Prüfung schlägt nie fehl.',
    syntax: 'assert bedingung\nassert bedingung, "Meldung"',
    example: e(`
def mittelwert(werte):
    assert len(werte) > 0, "Liste darf nicht leer sein"
    return sum(werte) / len(werte)

print(mittelwert([2, 4, 6]))      # 4.0

try:
    mittelwert([])
except AssertionError as e:
    print("AssertionError:", e)   # AssertionError: Liste darf nicht leer sein
`),
    tip: 'Für Eingabeprüfung `if ...: raise ValueError(...)` verwenden; `assert` nur für „kann eigentlich nicht passieren“.',
    keywords: ['assertion', 'annahme prüfen', 'assertionerror', 'zusicherung', 'debug check', '-O'],
    related: ['raise', 'pytest', 'unittest'],
    mdn: R + 'simple_stmts.html#the-assert-statement'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'Häufige Exceptions',
    desc: 'Die eingebauten Ausnahmen, denen man im Alltag am häufigsten begegnet.',
    details: 'Der Typ einer Ausnahme sagt schon viel über die Ursache: `TypeError` bei falschem Typ, `ValueError` bei richtigem Typ mit unpassendem Wert. `AttributeError` tritt oft auf, wenn eine Variable unerwartet `None` ist. `ModuleNotFoundError` ist eine Unterklasse von `ImportError`, `FileNotFoundError` eine von `OSError`.',
    values: [
      ['ValueError', 'Richtiger Typ, falscher Wert: int("abc")'],
      ['TypeError', 'Falscher Typ: "a" + 1'],
      ['KeyError', 'Schlüssel fehlt im dict'],
      ['IndexError', 'Index außerhalb der Liste'],
      ['AttributeError', 'Attribut existiert nicht, oft bei None'],
      ['NameError', 'Name nicht definiert (Tippfehler)'],
      ['ZeroDivisionError', 'Division durch 0'],
      ['FileNotFoundError', 'Datei existiert nicht'],
      ['ModuleNotFoundError', 'Modul nicht installiert/gefunden'],
      ['StopIteration', 'Iterator erschöpft (next())'],
      ['RecursionError', 'Maximale Rekursionstiefe überschritten'],
      ['NotImplementedError', 'Methode muss in Unterklasse implementiert werden']
    ],
    example: e(`
tests = [
    lambda: int("abc"),
    lambda: "a" + 1,
    lambda: {}["x"],
    lambda: [][0],
    lambda: None.upper(),
    lambda: 1 / 0,
]
for t in tests:
    try:
        t()
    except Exception as e:
        print(type(e).__name__)
# ValueError, TypeError, KeyError, IndexError, AttributeError, ZeroDivisionError
`),
    tip: 'Die letzte Zeile des Tracebacks nennt Typ und Meldung; seit Python 3.10 macht der Interpreter bei Tippfehlern oft „Did you mean …?“-Vorschläge.',
    keywords: ['valueerror', 'typeerror', 'keyerror', 'indexerror', 'attributeerror', 'nameerror', 'fehlertypen', 'built-in exceptions'],
    related: ['Exception-Hierarchie', 'try / except', 'traceback'],
    mdn: D + 'exceptions.html#concrete-exceptions'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'traceback',
    desc: 'Modul zum Formatieren und Ausgeben von Tracebacks, etwa für Logs.',
    details: '`traceback.print_exc()` gibt die gerade behandelte Ausnahme wie der Interpreter auf `stderr` aus, ohne das Programm zu beenden. `traceback.format_exc()` liefert denselben Text als String, `format_exception_only()` nur die letzte Zeile. In Anwendungen ist meist `logging.exception()` bequemer, weil es den Traceback automatisch ins Log schreibt.',
    values: [
      ['print_exc()', 'Aktuelle Ausnahme auf stderr ausgeben'],
      ['format_exc()', 'Aktuelle Ausnahme als String'],
      ['format_exception(e)', 'Liste von Zeilen zu einer Exception'],
      ['format_exception_only(e)', 'Nur „Typ: Meldung“'],
      ['print_stack()', 'Aktuellen Aufrufstapel ausgeben (ohne Fehler)']
    ],
    example: e(`
import traceback

def tief():
    return {}["fehlt"]

try:
    tief()
except KeyError:
    text = traceback.format_exc()
    print(text.splitlines()[0])        # Traceback (most recent call last):
    print(text.splitlines()[-1])       # KeyError: 'fehlt'

try:
    int("x")
except ValueError as e:
    print(traceback.format_exception_only(e)[0].strip())
    # ValueError: invalid literal for int() with base 10: 'x'
`),
    tip: 'Tracebacks liest man von unten nach oben: Die letzte Zeile ist der Fehler, darüber die Stelle im eigenen Code.',
    keywords: ['stacktrace', 'stack trace', 'print_exc', 'format_exc', 'fehlerausgabe', 'aufrufstapel'],
    related: ['try / except', 'logging', 'raise from'],
    mdn: D + 'traceback.html'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'warnings',
    desc: 'Gibt Warnungen aus, die das Programm nicht abbrechen, z. B. für veraltete APIs.',
    details: '`warnings.warn(meldung, Kategorie)` schreibt eine Warnung nach `stderr`; gleiche Warnungen von derselben Stelle erscheinen standardmäßig nur einmal. `DeprecationWarning` wird außerhalb von `__main__` normalerweise ausgeblendet – mit `python -W default` oder im Entwicklungsmodus `-X dev` sieht man sie. Über Filter lassen sich Warnungen ignorieren oder in Fehler umwandeln. Seit Python 3.13 gibt es den Dekorator `@warnings.deprecated`.',
    values: [
      ['warn(msg, Kategorie, stacklevel)', 'Warnung auslösen'],
      ['DeprecationWarning', 'Veraltete Funktion'],
      ['UserWarning', 'Standardkategorie'],
      ['simplefilter("error")', 'Warnungen in Exceptions umwandeln'],
      ['catch_warnings()', 'Context Manager für temporäre Filter']
    ],
    example: e(`
import warnings

def alte_funktion():
    warnings.warn("alte_funktion() ist veraltet, nutze neue_funktion()",
                  DeprecationWarning, stacklevel=2)
    return 1

with warnings.catch_warnings(record=True) as liste:
    warnings.simplefilter("always")
    alte_funktion()

print(len(liste))                      # 1
print(liste[0].category.__name__)      # DeprecationWarning
print(liste[0].message)                # alte_funktion() ist veraltet, nutze neue_funktion()
`),
    tip: '`stacklevel=2` lässt die Warnung auf die Zeile des Aufrufers zeigen statt auf die Bibliothek selbst.',
    keywords: ['warnung', 'warning', 'deprecated', 'deprecationwarning', 'veraltet', 'filterwarnings'],
    related: ['raise', 'Entwicklungsmodus (-X dev)', 'logging'],
    mdn: D + 'warnings.html'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'EAFP vs. LBYL',
    desc: 'Zwei Stile: erst handeln und Fehler fangen (EAFP) oder vorher prüfen (LBYL).',
    details: 'EAFP („Easier to Ask Forgiveness than Permission“) ist der typische Python-Stil: Man versucht die Operation und fängt die Ausnahme. LBYL („Look Before You Leap“) prüft zuerst mit `if`. EAFP vermeidet Race Conditions, etwa wenn eine Datei zwischen Prüfung und Öffnen gelöscht wird, und ist bei seltenen Fehlern schneller. Bei häufigen Fehlern oder teuren Ausnahmen kann LBYL lesbarer sein.',
    example: e(`
config = {"host": "localhost"}

# LBYL: vorher nachsehen
if "port" in config:
    port = config["port"]
else:
    port = 8080

# EAFP: einfach versuchen
try:
    port = config["port"]
except KeyError:
    port = 8080
print(port)                       # 8080

# Oft am kürzesten: passende Methode
print(config.get("port", 8080))   # 8080
`),
    tip: 'Bei Dateien immer EAFP: `try: open(...)` statt `if os.path.exists(...)`, denn zwischen Prüfung und Zugriff kann sich alles ändern.',
    keywords: ['eafp', 'lbyl', 'stil', 'pythonic', 'race condition', 'ask forgiveness', 'look before you leap'],
    related: ['try / except', 'dict.get()', 'contextlib.suppress'],
    mdn: G + 'term-EAFP'
  },
  {
    lang: 'py', group: 'Exceptions', name: 'BaseException.add_note()',
    desc: 'Hängt einer Ausnahme zusätzliche Hinweise an, die im Traceback erscheinen.',
    details: '`e.add_note(text)` speichert den Text in `e.__notes__`; der Traceback zeigt alle Notizen unter der Fehlermeldung an. So ergänzt man Kontext (z. B. Dateiname oder Zeilennummer), ohne den Fehlertyp zu ändern oder eine neue Exception zu verketten. Danach wirft man die Ausnahme mit nacktem `raise` weiter.',
    syntax: 'e.add_note("Zusatzinfo")',
    example: e(`
zeilen = ["10", "20", "x", "40"]
try:
    for nr, z in enumerate(zeilen, start=1):
        try:
            int(z)
        except ValueError as e:
            e.add_note(f"in Zeile {nr} der Eingabedatei")
            raise
except ValueError as e:
    print(e)              # invalid literal for int() with base 10: 'x'
    print(e.__notes__)    # ['in Zeile 3 der Eingabedatei']
`),
    tip: 'Ideal in Schleifen über Daten: Der Fehlertyp bleibt gleich, aber man sieht sofort, welcher Datensatz schuld war.',
    keywords: ['add_note', '__notes__', 'notiz', 'kontext', 'exception notes', 'pep 678'],
    related: ['raise', 'raise from', 'traceback'],
    mdn: D + 'exceptions.html#BaseException.add_note'
  },

  // ---------------- Context Manager ----------------
  {
    lang: 'py', group: 'Context Manager', name: 'with',
    desc: 'Führt einen Block in einem Kontext aus und räumt danach garantiert auf.',
    details: '`with` ruft beim Betreten `__enter__()` und beim Verlassen `__exit__()` des Context Managers auf – auch bei Ausnahmen oder `return`. Typische Anwendungen sind Dateien, Sperren, Datenbanktransaktionen und temporäre Einstellungen. Mehrere Manager lassen sich in einer Anweisung kombinieren, bei vielen Zeilen in Klammern. Der Wert nach `as` ist der Rückgabewert von `__enter__()`, nicht zwingend der Manager selbst.',
    syntax: 'with ausdruck as name:\n    ...\nwith (\n    open("a") as a,\n    open("b") as b,\n):\n    ...',
    example: e(`
from pathlib import Path

Path("notiz.txt").write_text("Zeile 1\\nZeile 2\\n", encoding="utf-8")

with open("notiz.txt", encoding="utf-8") as f:
    zeilen = f.read().splitlines()
print(zeilen)       # ['Zeile 1', 'Zeile 2']
print(f.closed)     # True – nach dem Block automatisch geschlossen

with open("notiz.txt", encoding="utf-8") as quelle, open("kopie.txt", "w", encoding="utf-8") as ziel:
    ziel.write(quelle.read().upper())
print(Path("kopie.txt").read_text(encoding="utf-8").splitlines())   # ['ZEILE 1', 'ZEILE 2']
`),
    tip: 'Dateien immer mit `with` öffnen – ohne `close()` bleiben sie bei Ausnahmen offen, und Schreibpuffer gehen eventuell verloren.',
    keywords: ['context manager', 'kontextmanager', 'with statement', 'ressourcen', 'aufräumen', '__enter__', '__exit__'],
    related: ['Eigener Context Manager', 'contextlib.contextmanager', 'open()', 'async with'],
    mdn: R + 'compound_stmts.html#the-with-statement'
  },
  {
    lang: 'py', group: 'Context Manager', name: 'Eigener Context Manager',
    desc: 'Eine Klasse mit __enter__ und __exit__ kann in with verwendet werden.',
    details: '`__enter__(self)` wird beim Betreten aufgerufen, sein Rückgabewert landet hinter `as`. `__exit__(self, typ, wert, tb)` erhält Infos zu einer eventuellen Ausnahme (sonst dreimal `None`). Gibt `__exit__` einen wahren Wert zurück, wird die Ausnahme unterdrückt – normalerweise gibt man `None` bzw. `False` zurück. Für einfache Fälle ist `contextlib.contextmanager` kürzer.',
    syntax: 'class Name:\n    def __enter__(self): ...\n    def __exit__(self, typ, wert, tb): ...',
    example: e(`
import time

class Stoppuhr:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, typ, wert, tb):
        self.dauer = time.perf_counter() - self.start
        print(f"Dauer: {self.dauer:.3f} s")   # z. B. Dauer: 0.012 s
        return False                         # Ausnahmen nicht unterdrücken

with Stoppuhr() as uhr:
    summe = sum(range(500_000))
print(summe)              # 124999750000
print(uhr.dauer > 0)      # True
`),
    tip: 'Nur `True` aus `__exit__` zurückgeben, wenn Ausnahmen wirklich bewusst verschluckt werden sollen.',
    keywords: ['__enter__', '__exit__', 'context manager klasse', 'eigener kontext', 'protokoll', 'custom context manager'],
    related: ['with', 'contextlib.contextmanager', 'contextlib.ExitStack'],
    mdn: R + 'datamodel.html#context-managers'
  },
  {
    lang: 'py', group: 'Context Manager', name: 'contextlib.contextmanager',
    desc: 'Dekorator, der aus einer Generatorfunktion mit einem yield einen Context Manager macht.',
    details: 'Code vor dem `yield` entspricht `__enter__`, der gelieferte Wert landet hinter `as`, Code danach entspricht `__exit__`. Tritt im `with`-Block eine Ausnahme auf, wird sie an der Stelle des `yield` geworfen – deshalb gehört das Aufräumen in ein `finally`. Der Generator darf genau einmal `yield` ausführen.',
    syntax: '@contextmanager\ndef name():\n    # vorher\n    try:\n        yield wert\n    finally:\n        # aufräumen',
    example: e(`
from contextlib import contextmanager
import os

@contextmanager
def verzeichnis(pfad):
    alt = os.getcwd()
    os.makedirs(pfad, exist_ok=True)
    os.chdir(pfad)
    try:
        yield pfad
    finally:
        os.chdir(alt)        # läuft auch bei Fehlern

with verzeichnis("build") as p:
    print(os.path.basename(os.getcwd()))   # build
print(os.path.basename(os.getcwd()) != "build")   # True
`),
    tip: 'Das `try/finally` um das `yield` nicht vergessen – sonst wird bei einer Ausnahme im Block nicht aufgeräumt.',
    keywords: ['contextmanager', 'decorator', 'generator context manager', 'yield', 'contextlib'],
    related: ['Eigener Context Manager', 'yield', 'contextlib.asynccontextmanager', 'contextlib.chdir'],
    mdn: D + 'contextlib.html#contextlib.contextmanager'
  },
  {
    lang: 'py', group: 'Context Manager', name: 'contextlib.suppress',
    desc: 'Unterdrückt die angegebenen Ausnahmen im with-Block.',
    details: '`with suppress(FileNotFoundError):` ist die Kurzform von `try ... except FileNotFoundError: pass`. Nach der Ausnahme wird der Rest des Blocks übersprungen, das Programm läuft hinter dem `with` weiter. Nur für Fälle nutzen, in denen der Fehler wirklich egal ist – sonst versteckt man Probleme.',
    syntax: 'with suppress(Typ1, Typ2):\n    ...',
    example: e(`
from contextlib import suppress
import os

with suppress(FileNotFoundError):
    os.remove("gibt-es-nicht.tmp")
    print("nicht erreicht")
print("weiter")                     # weiter

werte = {}
with suppress(KeyError):
    print(werte["x"])
print("auch weiter")                # auch weiter
`),
    tip: 'Für „löschen, falls vorhanden“ gibt es bei Pfaden auch `Path.unlink(missing_ok=True)`.',
    keywords: ['suppress', 'ignorieren', 'ignore exception', 'except pass', 'unterdrücken'],
    related: ['try / except', 'with', 'EAFP vs. LBYL'],
    mdn: D + 'contextlib.html#contextlib.suppress'
  },
  {
    lang: 'py', group: 'Context Manager', name: 'contextlib.ExitStack',
    desc: 'Verwaltet beliebig viele Context Manager, deren Anzahl erst zur Laufzeit feststeht.',
    details: 'Mit `stack.enter_context(cm)` betritt man einen Manager; beim Verlassen des `with` werden alle in umgekehrter Reihenfolge geschlossen, auch wenn einer davon fehlschlägt. `stack.callback(func, *args)` registriert beliebige Aufräumfunktionen. Mit `pop_all()` überträgt man die Verantwortung an einen neuen Stack, etwa wenn ein Konstruktor nur bei Erfolg Ressourcen behalten soll.',
    values: [
      ['enter_context(cm)', 'Manager betreten, Wert von __enter__ zurück'],
      ['callback(f, *args)', 'Funktion beim Verlassen aufrufen'],
      ['push(exit_func)', '__exit__-ähnliche Funktion registrieren'],
      ['pop_all()', 'Alles in neuen Stack verschieben'],
      ['close()', 'Sofort alles aufräumen']
    ],
    example: e(`
from contextlib import ExitStack
from pathlib import Path

namen = ["a.txt", "b.txt", "c.txt"]
for n in namen:
    Path(n).write_text(n.upper(), encoding="utf-8")

with ExitStack() as stack:
    dateien = [stack.enter_context(open(n, encoding="utf-8")) for n in namen]
    stack.callback(print, "alle Dateien geschlossen")
    print([f.read() for f in dateien])   # ['A.TXT', 'B.TXT', 'C.TXT']
# alle Dateien geschlossen
print(all(f.closed for f in dateien))    # True
`),
    tip: 'Callbacks laufen in umgekehrter Reihenfolge der Registrierung (LIFO) – wie verschachtelte `with`-Blöcke.',
    keywords: ['exitstack', 'mehrere context manager', 'dynamisch', 'callback', 'aufräumen', 'cleanup stack'],
    related: ['with', 'Eigener Context Manager', 'contextlib.contextmanager'],
    mdn: D + 'contextlib.html#contextlib.ExitStack'
  },
  {
    lang: 'py', group: 'Context Manager', name: 'contextlib.redirect_stdout',
    desc: 'Leitet print-Ausgaben vorübergehend in ein anderes Dateiobjekt um.',
    details: 'Innerhalb des Blocks zeigt `sys.stdout` auf das angegebene Objekt, etwa ein `io.StringIO`, um Ausgaben als String einzufangen. Das Gegenstück `redirect_stderr` funktioniert genauso für Fehlerausgaben. Die Umleitung ist global für den Prozess und daher nicht threadsicher; Ausgaben von Unterprozessen erfasst sie nicht.',
    syntax: 'with redirect_stdout(ziel):\n    ...',
    example: e(`
from contextlib import redirect_stdout
import io

def hilfe_text():
    help(len)

puffer = io.StringIO()
with redirect_stdout(puffer):
    hilfe_text()
    print("Ende")

text = puffer.getvalue()
print(text.splitlines()[0])        # Help on built-in function len in module builtins:
print(text.strip().endswith("Ende"))   # True
`),
    tip: 'Praktisch in Tests oder um Funktionen fremder Bibliotheken „stumm“ zu schalten: `redirect_stdout(io.StringIO())`.',
    keywords: ['redirect_stdout', 'redirect_stderr', 'stdout umleiten', 'ausgabe abfangen', 'stringio', 'capture output'],
    related: ['with', 'print()', 'sys'],
    mdn: D + 'contextlib.html#contextlib.redirect_stdout'
  },
  {
    lang: 'py', group: 'Context Manager', name: 'contextlib.nullcontext',
    desc: 'Context Manager, der nichts tut – Platzhalter, wenn ein with optional ist.',
    details: '`nullcontext(wert)` gibt beim Betreten einfach `wert` zurück und räumt nichts auf. Damit vermeidet man doppelten Code, wenn ein Manager nur manchmal nötig ist, etwa eine Sperre oder eine bereits geöffnete Datei. Seit Python 3.10 funktioniert er auch mit `async with`.',
    syntax: 'with (echter_cm if bedingung else nullcontext()):\n    ...',
    example: e(`
from contextlib import nullcontext
import threading

def zaehlen(daten, sperre=None):
    with sperre if sperre is not None else nullcontext():
        return len(daten)

print(zaehlen([1, 2, 3]))                       # 3
print(zaehlen([1, 2], sperre=threading.Lock()))  # 2

with nullcontext("Wert") as x:
    print(x)                                     # Wert
`),
    tip: 'Typischer Einsatz: Funktion akzeptiert Dateiname oder offene Datei – nur im ersten Fall selbst öffnen, sonst `nullcontext(datei)`.',
    keywords: ['nullcontext', 'dummy', 'optionaler context manager', 'platzhalter', 'no-op'],
    related: ['with', 'contextlib.ExitStack', 'threading.Lock'],
    mdn: D + 'contextlib.html#contextlib.nullcontext'
  },
  {
    lang: 'py', group: 'Context Manager', name: 'contextlib.chdir',
    desc: 'Wechselt vorübergehend das Arbeitsverzeichnis und kehrt danach zurück (seit 3.11).',
    details: 'Beim Betreten ruft `chdir(pfad)` intern `os.chdir()` auf, beim Verlassen wird das vorherige Verzeichnis wiederhergestellt – auch bei Ausnahmen. Das Arbeitsverzeichnis gilt für den ganzen Prozess, daher ist der Manager nicht für Threads oder `asyncio` geeignet. Das Zielverzeichnis muss bereits existieren.',
    syntax: 'with chdir(pfad):\n    ...',
    example: e(`
from contextlib import chdir
from pathlib import Path

Path("projekt").mkdir(exist_ok=True)
start = Path.cwd()

with chdir("projekt"):
    Path("log.txt").write_text("ok", encoding="utf-8")
    print(Path.cwd().name)          # projekt

print(Path.cwd() == start)          # True
print(Path("projekt/log.txt").exists())   # True
`),
    tip: 'Besser ist oft, mit absoluten Pfaden zu arbeiten (`basis / "datei"`) statt das Arbeitsverzeichnis zu wechseln.',
    keywords: ['chdir', 'arbeitsverzeichnis', 'working directory', 'cwd', 'verzeichnis wechseln'],
    related: ['contextlib.contextmanager', 'with', 'pathlib'],
    mdn: D + 'contextlib.html#contextlib.chdir'
  },

  // ---------------- Iteratoren & Generatoren ----------------
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'Iterator-Protokoll',
    desc: 'Ein Iterator liefert mit __next__ Werte nacheinander und endet mit StopIteration.',
    details: 'Ein Iterable hat eine Methode `__iter__()`, die einen Iterator liefert; ein Iterator hat `__next__()` und gibt bei `__iter__()` sich selbst zurück. `for`, Comprehensions, `list()`, Entpacken und viele Funktionen nutzen intern genau dieses Protokoll. Ist der Iterator erschöpft, wirft `__next__()` `StopIteration`, was `for` stillschweigend beendet.',
    values: [
      ['__iter__()', 'Liefert einen Iterator (bei Iteratoren: self)'],
      ['__next__()', 'Nächster Wert oder StopIteration'],
      ['iter(x)', 'Ruft x.__iter__() auf'],
      ['next(it)', 'Ruft it.__next__() auf']
    ],
    example: e(`
farben = ["rot", "grün"]
it = iter(farben)            # was for intern macht
print(next(it))              # rot
print(next(it))              # grün
try:
    next(it)
except StopIteration:
    print("erschöpft")       # erschöpft

# for x in farben: ... entspricht ungefähr:
it = iter(farben)
while True:
    try:
        x = next(it)
    except StopIteration:
        break
    print(x.upper())         # ROT / GRÜN
`),
    tip: 'Eigene Klassen werden mit `__iter__` als Generator-Methode (`yield`) am einfachsten iterierbar.',
    keywords: ['iterator', 'iterable', '__iter__', '__next__', 'stopiteration', 'protokoll', 'iteration'],
    related: ['iter() & next()', 'Iterable vs. Iterator', 'Eigener Iterator', 'for'],
    mdn: D + 'stdtypes.html#iterator-types'
  },
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'iter() & next()',
    desc: 'iter() holt einen Iterator, next() den nächsten Wert – optional mit Standardwert.',
    details: '`next(it, standard)` gibt statt `StopIteration` den Standardwert zurück, wenn nichts mehr kommt – praktisch für „erstes passendes Element oder None“. `iter(funktion, endwert)` ruft die Funktion so lange auf, bis sie den Endwert liefert, etwa beim blockweisen Lesen von Dateien. `next()` funktioniert nur auf Iteratoren, nicht direkt auf Listen.',
    syntax: 'iter(iterable)\niter(callable, endwert)\nnext(iterator[, standard])',
    example: e(`
from functools import partial
from pathlib import Path

zahlen = [3, 8, 12, 5]
erste_gerade = next((z for z in zahlen if z % 2 == 0), None)
print(erste_gerade)                  # 8
print(next((z for z in zahlen if z > 100), None))   # None

# Erste Zeile überspringen (Kopfzeile)
it = iter(["name,alter", "Ada,36", "Linus,28"])
kopf = next(it)
print(list(it))                      # ['Ada,36', 'Linus,28']

# Blockweise lesen bis b"" (Ende)
Path("daten.bin").write_bytes(b"abcdefghij")
with open("daten.bin", "rb") as f:
    print(list(iter(partial(f.read, 4), b"")))   # [b'abcd', b'efgh', b'ij']
`),
    tip: '`next(liste)` ergibt `TypeError: list object is not an iterator` – vorher `iter(liste)` aufrufen.',
    keywords: ['iter', 'next', 'standardwert', 'default', 'sentinel', 'erstes element', 'first match'],
    related: ['Iterator-Protokoll', 'Generator-Ausdruck', 'Generator'],
    mdn: D + 'functions.html#next'
  },
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'Iterable vs. Iterator',
    desc: 'Ein Iterable kann man mehrfach durchlaufen, einen Iterator nur einmal.',
    details: 'Listen, Tupel, Strings, Dicts und `range` sind Iterables: Jedes `for` holt sich einen frischen Iterator. Generatoren, `map`, `filter`, `zip` und Dateiobjekte sind selbst Iteratoren und nach einem Durchlauf leer. Der häufige Fehler: Ein Generator wird zweimal benutzt und liefert beim zweiten Mal nichts – ohne Fehlermeldung.',
    example: e(`
zahlen = [1, 2, 3]                 # Iterable
print(sum(zahlen), sum(zahlen))    # 6 6

quadrate = map(lambda x: x * x, zahlen)   # Iterator
print(sum(quadrate))               # 14
print(sum(quadrate))               # 0 – schon verbraucht!

print(iter(zahlen) is zahlen)      # False
print(iter(quadrate) is quadrate)  # True – Iterator gibt sich selbst zurück

# Lösung: in eine Liste umwandeln, wenn man mehrfach braucht
quadrate = list(map(lambda x: x * x, zahlen))
print(sum(quadrate), max(quadrate))   # 14 9
`),
    tip: 'Funktionen, die ihren Eingabewert zweimal durchlaufen, sollten ihn zuerst mit `list()` materialisieren.',
    keywords: ['iterable', 'iterator', 'einmal', 'verbraucht', 'exhausted', 'mehrfach durchlaufen', 'unterschied'],
    related: ['Iterator-Protokoll', 'Generator', 'map()'],
    mdn: G + 'term-iterable'
  },
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'Generator',
    desc: 'Funktion mit yield, die Werte nach und nach liefert statt alle auf einmal.',
    details: 'Der Aufruf einer Generatorfunktion führt den Code noch nicht aus, sondern liefert ein Generator-Objekt. Erst jedes `next()` (bzw. jede `for`-Runde) läuft bis zum nächsten `yield` und pausiert dort mitsamt allen lokalen Variablen. Generatoren brauchen kaum Speicher und können sogar unendlich sein. Ein `return wert` beendet den Generator; der Wert steckt dann in `StopIteration.value`.',
    syntax: 'def gen():\n    yield wert',
    example: e(`
def fibonacci(grenze):
    a, b = 0, 1
    while a < grenze:
        yield a
        a, b = b, a + b

print(list(fibonacci(50)))     # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

g = fibonacci(10)
print(type(g).__name__)        # generator
print(next(g), next(g), next(g))   # 0 1 1
print(sum(g))                  # 18 (2 + 3 + 5 + 8)
`),
    tip: 'Für einfache Fälle reicht ein Generator-Ausdruck `(x * x for x in daten)` statt einer eigenen Funktion.',
    keywords: ['generator', 'generatorfunktion', 'yield', 'lazy', 'speicher sparen', 'generator function'],
    related: ['yield', 'Generator-Ausdruck', 'Lazy Evaluation', 'yield from'],
    mdn: T + 'classes.html#generators'
  },
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'yield',
    desc: 'Gibt aus einem Generator einen Wert zurück und pausiert die Funktion an dieser Stelle.',
    details: 'Sobald `yield` in einer Funktion vorkommt, ist sie eine Generatorfunktion – egal ob die Zeile je erreicht wird. `yield` ist zugleich ein Ausdruck: `x = yield wert` empfängt einen Wert, der per `send()` hineingereicht wurde. Code nach dem letzten `yield` läuft erst, wenn der Verbraucher noch einmal `next()` aufruft – Aufräumcode gehört deshalb in `try/finally`.',
    syntax: 'yield wert\nwert = yield\nwert = yield ausgabe',
    example: e(`
def zeilen_nummerieren(zeilen):
    print("Start")
    for nr, zeile in enumerate(zeilen, start=1):
        yield f"{nr:>2}: {zeile}"
    print("Ende")

gen = zeilen_nummerieren(["import os", "print(os.name)"])
print("noch nichts passiert")
for z in gen:
    print(z)
# noch nichts passiert / Start /  1: import os /  2: print(os.name) / Ende
`),
    tip: 'Die Ausgabe zeigt: Der Funktionskörper startet erst beim ersten `next()`, nicht beim Aufruf.',
    keywords: ['yield', 'generator', 'pausieren', 'yield expression', 'liefern'],
    related: ['Generator', 'yield from', 'Generator.send()'],
    mdn: R + 'expressions.html#yield-expressions'
  },
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'yield from',
    desc: 'Reicht alle Werte eines anderen Iterables oder Generators unverändert weiter.',
    details: '`yield from iterable` ersetzt die Schleife `for x in iterable: yield x`. Bei Untergeneratoren leitet es zusätzlich `send()` und `throw()` weiter, und der Ausdruck nimmt den `return`-Wert des Untergenerators an. Das eignet sich besonders für rekursive Strukturen wie Bäume oder verschachtelte Listen.',
    syntax: 'yield from iterable\nergebnis = yield from untergenerator()',
    example: e(`
def flach(daten):
    for x in daten:
        if isinstance(x, list):
            yield from flach(x)      # rekursiv weiterreichen
        else:
            yield x

print(list(flach([1, [2, [3, 4]], 5])))   # [1, 2, 3, 4, 5]

def teil():
    yield "a"
    yield "b"
    return 2                 # wird Wert von yield from

def gesamt():
    anzahl = yield from teil()
    yield f"{anzahl} Werte"

print(list(gesamt()))        # ['a', 'b', '2 Werte']
`),
    tip: 'Für flache Kombinationen ohne Generatorlogik ist `itertools.chain()` oft lesbarer.',
    keywords: ['yield from', 'delegieren', 'subgenerator', 'untergenerator', 'rekursiv', 'flatten'],
    related: ['yield', 'Generator', 'itertools.chain()', 'Rekursion'],
    mdn: R + 'expressions.html#yield-expressions'
  },
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'Generator.send()',
    desc: 'Schickt einen Wert in einen pausierten Generator; er wird zum Ergebnis von yield.',
    details: 'Vor dem ersten `send()` muss der Generator mit `next(gen)` (oder `gen.send(None)`) bis zum ersten `yield` laufen. Danach setzt `gen.send(wert)` die Ausführung fort, `wert` ist der Wert des `yield`-Ausdrucks, und der nächste geyieldete Wert ist der Rückgabewert von `send()`. Diese Koroutinen-Technik ist heute selten; für Nebenläufigkeit nutzt man `async`/`await`.',
    syntax: 'next(gen)        # starten\nantwort = gen.send(wert)',
    example: e(`
def laufender_schnitt():
    summe = anzahl = 0
    schnitt = None
    while True:
        wert = yield schnitt
        summe += wert
        anzahl += 1
        schnitt = summe / anzahl

s = laufender_schnitt()
next(s)                  # bis zum ersten yield laufen
print(s.send(10))        # 10.0
print(s.send(20))        # 15.0
print(s.send(60))        # 30.0
`),
    tip: 'Ein `send()` mit Wert auf einen frischen Generator ergibt `TypeError: can\'t send non-None value to a just-started generator`.',
    keywords: ['send', 'koroutine', 'coroutine', 'generator senden', 'werte hineinreichen', 'yield ausdruck'],
    related: ['yield', 'Generator.close() & throw()', 'async / await'],
    mdn: R + 'expressions.html#generator.send'
  },
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'Generator.close() & throw()',
    desc: 'close() beendet einen Generator, throw() wirft eine Ausnahme an der yield-Stelle.',
    details: '`gen.close()` löst im Generator `GeneratorExit` aus, sodass `finally`-Blöcke laufen; das passiert auch automatisch, wenn der Generator vom Garbage Collector abgeräumt wird. `gen.throw(exc)` wirft die Ausnahme an der Stelle des pausierten `yield`; fängt der Generator sie ab, liefert `throw()` den nächsten geyieldeten Wert. Nach `close()` führt jedes `next()` sofort zu `StopIteration`.',
    syntax: 'gen.close()\ngen.throw(Ausnahme("..."))',
    example: e(`
def leser():
    print("öffne")
    try:
        while True:
            try:
                yield "Daten"
            except ValueError as e:
                print("Fehler behandelt:", e)
    finally:
        print("schließe")

g = leser()
print(next(g))                        # öffne / Daten
print(g.throw(ValueError("kaputt")))  # Fehler behandelt: kaputt / Daten
g.close()                             # schließe
print(next(g, "beendet"))             # beendet
`),
    tip: 'Wer einen Generator vorzeitig verlässt, sollte `close()` aufrufen oder `contextlib.closing()` nutzen, damit Ressourcen sofort frei werden.',
    keywords: ['close', 'throw', 'generatorexit', 'generator beenden', 'aufräumen', 'finally generator'],
    related: ['Generator.send()', 'Generator', 'else & finally'],
    mdn: R + 'expressions.html#generator.throw'
  },
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'Lazy Evaluation',
    desc: 'Werte werden erst berechnet, wenn sie gebraucht werden – spart Speicher und Zeit.',
    details: 'Generatoren, Generator-Ausdrücke, `range`, `map`, `filter`, `zip` und die meisten `itertools`-Funktionen arbeiten lazy. So lassen sich riesige oder unendliche Datenströme verarbeiten, ohne alles im Speicher zu halten. Die Kehrseite: Seiteneffekte passieren später als erwartet, und Fehler tauchen erst beim Durchlaufen auf, nicht beim Erstellen.',
    example: e(`
import sys
from itertools import count, islice

liste = [x * x for x in range(1_000_000)]   # alles im Speicher
gen = (x * x for x in range(1_000_000))     # nur ein Rezept
print(sys.getsizeof(liste) > 1_000_000)     # True
print(sys.getsizeof(gen) < 1_000)           # True

# Unendliche Folge – geht nur lazy
ungerade = (n for n in count(1) if n % 2)
print(list(islice(ungerade, 5)))            # [1, 3, 5, 7, 9]

# any() bricht beim ersten Treffer ab
print(any(x > 10 for x in count()))         # True
`),
    tip: 'Bei großen Dateien `for zeile in datei:` statt `datei.readlines()` – so liegt immer nur eine Zeile im Speicher.',
    keywords: ['lazy', 'verzögert', 'faul', 'speicher', 'unendlich', 'stream', 'bedarfsauswertung', 'lazy evaluation'],
    related: ['Generator', 'Generator-Ausdruck', 'itertools.islice()', 'Generator-Pipeline'],
    mdn: T + 'classes.html#generator-expressions'
  },
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'Generator-Pipeline',
    desc: 'Mehrere Generatoren hintereinander schalten, jeder erledigt einen Verarbeitungsschritt.',
    details: 'Jede Stufe nimmt ein Iterable entgegen und liefert ein neues; Daten fließen Element für Element durch die ganze Kette. So bleiben die Schritte einzeln testbar, und auch große Datenmengen laufen mit konstantem Speicher. Erst der letzte Verbraucher (`for`, `sum`, `list` …) setzt die Pipeline in Gang.',
    example: e(`
from pathlib import Path

Path("zugriffe.log").write_text(
    "200 /index\\n404 /alt\\n\\n200 /shop\\n500 /api\\n404 /bild\\n", encoding="utf-8")

def zeilen(pfad):
    with open(pfad, encoding="utf-8") as f:
        for z in f:
            yield z.strip()

def nicht_leer(zs):
    return (z for z in zs if z)

def fehler(zs):
    for z in zs:
        code, url = z.split()
        if int(code) >= 400:
            yield code, url

for code, url in fehler(nicht_leer(zeilen("zugriffe.log"))):
    print(code, url)       # 404 /alt / 500 /api / 404 /bild
`),
    tip: 'Pipelines wie Unix-Pipes denken: kleine Stufen, die genau eine Sache tun.',
    keywords: ['pipeline', 'generator kette', 'stream processing', 'verarbeitungskette', 'datenfluss'],
    related: ['Generator', 'Lazy Evaluation', 'Generator-Ausdruck'],
    mdn: D + 'itertools.html#itertools-recipes'
  },
  {
    lang: 'py', group: 'Iteratoren & Generatoren', name: 'Eigener Iterator',
    desc: 'Eigene Klassen iterierbar machen: __iter__ mit yield oder __iter__ plus __next__.',
    details: 'Am einfachsten schreibt man `__iter__` als Generator-Methode: Dann ist das Objekt ein wiederholt durchlaufbares Iterable. Eine Klasse mit `__iter__` (gibt `self` zurück) und `__next__` ist dagegen ein echter Iterator, der nur einmal durchläuft und seinen Zustand selbst verwaltet. Am Ende muss `__next__` `StopIteration` werfen.',
    syntax: 'class X:\n    def __iter__(self):\n        yield ...',
    example: e(`
class Countdown:                  # Iterable: mehrfach nutzbar
    def __init__(self, start):
        self.start = start
    def __iter__(self):
        n = self.start
        while n > 0:
            yield n
            n -= 1

class Zaehler:                    # Iterator: einmal nutzbar
    def __init__(self, ende):
        self.n, self.ende = 0, ende
    def __iter__(self):
        return self
    def __next__(self):
        if self.n >= self.ende:
            raise StopIteration
        self.n += 1
        return self.n

c = Countdown(3)
print(list(c), list(c))           # [3, 2, 1] [3, 2, 1]
z = Zaehler(3)
print(list(z), list(z))           # [1, 2, 3] []
`),
    tip: 'Im Zweifel die Variante mit `yield` in `__iter__` wählen – kürzer und ohne Fallstrick „nur einmal durchlaufbar“.',
    keywords: ['eigener iterator', '__iter__', '__next__', 'iterierbar machen', 'custom iterator', 'stopiteration'],
    related: ['Iterator-Protokoll', 'Iterable vs. Iterator', 'Container-Protokoll (__len__, __getitem__, __contains__)'],
    mdn: T + 'classes.html#iterators'
  },

  // ---------------- Asynchrone Programmierung ----------------
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'async / await',
    desc: 'async def definiert eine Koroutine, await wartet auf ein Ergebnis, ohne zu blockieren.',
    details: 'Der Aufruf einer `async def`-Funktion führt nichts aus, sondern liefert ein Koroutinen-Objekt, das eine Event-Loop (meist über `asyncio.run()`) ausführt. An jedem `await` darf die Loop zu anderen Aufgaben wechseln – so laufen viele I/O-Operationen gleichzeitig in einem Thread. `await` ist nur innerhalb von `async def` erlaubt. Blockierender Code wie `time.sleep()` oder `requests.get()` hält die ganze Loop an.',
    syntax: 'async def name():\n    ergebnis = await andere_koroutine()',
    example: e(`
import asyncio

async def laden(name, dauer):
    print(f"starte {name}")
    await asyncio.sleep(dauer)      # gibt die Kontrolle ab
    return f"{name} fertig"

async def main():
    # nacheinander: Dauer addiert sich
    print(await laden("A", 0.05))
    # gleichzeitig: Dauer = längste Aufgabe
    ergebnisse = await asyncio.gather(laden("B", 0.05), laden("C", 0.05))
    print(ergebnisse)

asyncio.run(main())
# starte A / A fertig / starte B / starte C / ['B fertig', 'C fertig']
`),
    tip: 'Ein vergessenes `await` erzeugt nur die Warnung „coroutine … was never awaited“ – der Code darin läuft nie.',
    keywords: ['async', 'await', 'koroutine', 'coroutine', 'asynchron', 'nebenläufig', 'event loop', 'asyncio'],
    related: ['asyncio.run()', 'asyncio.gather()', 'asyncio.create_task()', 'GIL & Free-Threading'],
    mdn: R + 'compound_stmts.html#coroutines'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.run()',
    desc: 'Startet eine Event-Loop, führt die Haupt-Koroutine aus und schließt die Loop danach.',
    details: '`asyncio.run(main())` ist der übliche Einstiegspunkt eines asynchronen Programms und wird genau einmal aufgerufen. Es erstellt eine neue Event-Loop, wartet auf das Ergebnis, bricht übrig gebliebene Tasks ab und räumt auf. Innerhalb einer bereits laufenden Loop (z. B. in Jupyter) schlägt es mit `RuntimeError` fehl – dort direkt `await main()` schreiben.',
    syntax: 'asyncio.run(koroutine, *, debug=None)',
    example: e(`
import asyncio

async def main():
    await asyncio.sleep(0.01)
    loop = asyncio.get_running_loop()
    print(loop.is_running())       # True
    return 42

ergebnis = asyncio.run(main())
print(ergebnis)                    # 42
`),
    tip: 'Für mehrere Aufrufe hintereinander mit derselben Loop gibt es `asyncio.Runner` (seit Python 3.11).',
    keywords: ['asyncio run', 'event loop', 'starten', 'einstiegspunkt', 'main', 'loop'],
    related: ['async / await', 'asyncio.TaskGroup', 'asyncio.sleep()'],
    mdn: D + 'asyncio-runner.html#asyncio.run'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.gather()',
    desc: 'Führt mehrere Awaitables gleichzeitig aus und liefert ihre Ergebnisse als Liste.',
    details: 'Die Ergebnisse stehen in derselben Reihenfolge wie die Argumente, unabhängig davon, welche Aufgabe zuerst fertig wird. Wirft eine Aufgabe eine Ausnahme, wird sie an den Aufrufer weitergereicht, die anderen laufen aber weiter. Mit `return_exceptions=True` landen Ausnahmen stattdessen in der Ergebnisliste. Für neuen Code ist `asyncio.TaskGroup` meist die sicherere Wahl.',
    syntax: 'ergebnisse = await asyncio.gather(*aufgaben, return_exceptions=False)',
    example: e(`
import asyncio

async def preis(produkt, dauer):
    await asyncio.sleep(dauer)
    if produkt == "?":
        raise ValueError("unbekannt")
    return len(produkt) * 10

async def main():
    print(await asyncio.gather(preis("Tee", 0.03), preis("Kaffee", 0.01)))
    # [30, 60] – Reihenfolge wie übergeben

    ergebnisse = await asyncio.gather(preis("Saft", 0.01), preis("?", 0.01),
                                      return_exceptions=True)
    print(ergebnisse)       # [40, ValueError('unbekannt')]

asyncio.run(main())
`),
    tip: 'Viele gleichartige Aufgaben übergibt man entpackt: `await asyncio.gather(*(laden(u) for u in urls))`.',
    keywords: ['gather', 'parallel', 'gleichzeitig', 'mehrere koroutinen', 'concurrent', 'promise.all'],
    related: ['asyncio.TaskGroup', 'asyncio.create_task()', 'asyncio.as_completed()'],
    mdn: D + 'asyncio-task.html#asyncio.gather'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.TaskGroup',
    desc: 'Startet mehrere Tasks und wartet auf alle; bei einem Fehler werden die anderen abgebrochen.',
    details: 'Innerhalb von `async with asyncio.TaskGroup() as tg:` startet `tg.create_task()` neue Tasks; beim Verlassen des Blocks wird auf alle gewartet. Schlägt ein Task fehl, bricht die Gruppe alle übrigen ab und wirft eine `ExceptionGroup`, die man mit `except*` behandelt. Das ist „strukturierte Nebenläufigkeit“: Kein Task überlebt versehentlich seinen Block. Verfügbar seit Python 3.11.',
    syntax: 'async with asyncio.TaskGroup() as tg:\n    t1 = tg.create_task(koro1())\n    t2 = tg.create_task(koro2())\n# hier sind alle fertig: t1.result()',
    example: e(`
import asyncio

async def abrufen(id, dauer):
    await asyncio.sleep(dauer)
    if id == 3:
        raise ConnectionError(f"Server {id} nicht erreichbar")
    return f"Daten {id}"

async def main():
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(abrufen(i, 0.01 * i)) for i in (1, 2)]
    print([t.result() for t in tasks])     # ['Daten 1', 'Daten 2']

    try:
        async with asyncio.TaskGroup() as tg:
            for i in (1, 3):
                tg.create_task(abrufen(i, 0.01))
    except* ConnectionError as g:
        print(g.exceptions[0])             # Server 3 nicht erreichbar

asyncio.run(main())
`),
    tip: 'Statt `gather()` bevorzugen: Bei Fehlern laufen keine verwaisten Tasks im Hintergrund weiter.',
    keywords: ['taskgroup', 'structured concurrency', 'strukturierte nebenläufigkeit', 'tasks', 'parallel', 'exceptiongroup'],
    related: ['asyncio.gather()', 'asyncio.create_task()', 'ExceptionGroup & except*', 'async with'],
    mdn: D + 'asyncio-task.html#asyncio.TaskGroup'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.create_task()',
    desc: 'Plant eine Koroutine als Task ein, der sofort im Hintergrund weiterläuft.',
    details: 'Anders als ein direktes `await` startet `create_task()` die Koroutine, ohne auf sie zu warten; der Aufrufer kann parallel weiterarbeiten und später `await task` schreiben. Die Event-Loop hält nur eine schwache Referenz – einen Task, auf den nirgends mehr verwiesen wird, kann der Garbage Collector mitten in der Ausführung entfernen. Daher Tasks immer in einer Variable oder Sammlung behalten oder gleich eine `TaskGroup` nutzen.',
    syntax: 'task = asyncio.create_task(koroutine(), name=None)\nergebnis = await task',
    example: e(`
import asyncio

async def backup():
    await asyncio.sleep(0.05)
    return "Backup fertig"

async def main():
    task = asyncio.create_task(backup())   # läuft ab jetzt
    print("arbeite weiter")
    await asyncio.sleep(0.01)
    print(task.done())                     # False
    print(await task)                      # Backup fertig
    print(task.done())                     # True

asyncio.run(main())
# arbeite weiter / False / Backup fertig / True
`),
    tip: 'Fire-and-forget-Tasks in einem `set` sammeln und per `task.add_done_callback(menge.discard)` wieder entfernen.',
    keywords: ['create_task', 'task', 'hintergrund', 'background', 'einplanen', 'schedule', 'future'],
    related: ['asyncio.TaskGroup', 'asyncio.gather()', 'Task.cancel()'],
    mdn: D + 'asyncio-task.html#asyncio.create_task'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.sleep()',
    desc: 'Pausiert eine Koroutine, ohne die Event-Loop zu blockieren.',
    details: '`await asyncio.sleep(sekunden)` gibt die Kontrolle an die Event-Loop ab, sodass andere Tasks in der Zwischenzeit laufen. `asyncio.sleep(0)` ist ein Weg, anderen Tasks explizit Vorrang zu geben. Mit dem Parameter `result` liefert der Aufruf einen Wert zurück. Ein `time.sleep()` in einer Koroutine friert dagegen alle Tasks ein.',
    syntax: 'await asyncio.sleep(sekunden, result=None)',
    example: e(`
import asyncio
import time

async def ticker(name, n):
    for i in range(n):
        print(name, i)
        await asyncio.sleep(0.01)

async def main():
    start = time.perf_counter()
    await asyncio.gather(ticker("A", 2), ticker("B", 2))
    print(time.perf_counter() - start < 0.1)   # True – lief verzahnt

asyncio.run(main())
# A 0 / B 0 / A 1 / B 1 / True
`),
    tip: 'Ein langsamer synchroner Aufruf lässt sich mit `asyncio.to_thread()` aus der Event-Loop auslagern.',
    keywords: ['sleep', 'warten', 'pause', 'nicht blockierend', 'delay', 'async sleep'],
    related: ['async / await', 'asyncio.to_thread()', 'time'],
    mdn: D + 'asyncio-task.html#asyncio.sleep'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.timeout()',
    desc: 'Context Manager, der alles im Block nach einer Frist abbricht (seit Python 3.11).',
    details: 'Läuft die Zeit ab, wird der laufende Task abgebrochen und beim Verlassen des Blocks `TimeoutError` geworfen. Mit `None` als Wert gibt es keine Frist; über `cm.reschedule()` lässt sie sich nachträglich ändern. `asyncio.timeout_at()` nimmt einen absoluten Zeitpunkt der Loop-Uhr. Der Block muss in einer Koroutine stehen und mit `async with` benutzt werden.',
    syntax: 'async with asyncio.timeout(sekunden):\n    ...',
    example: e(`
import asyncio

async def langsam():
    await asyncio.sleep(1)
    return "fertig"

async def main():
    try:
        async with asyncio.timeout(0.05):
            print(await langsam())
    except TimeoutError:
        print("Zeitüberschreitung")          # Zeitüberschreitung

    async with asyncio.timeout(2):
        await asyncio.sleep(0.01)
        print("rechtzeitig")                 # rechtzeitig

asyncio.run(main())
`),
    tip: 'Seit Python 3.11 ist `asyncio.TimeoutError` dasselbe wie das eingebaute `TimeoutError`.',
    keywords: ['timeout', 'zeitlimit', 'frist', 'abbrechen', 'timeouterror', 'deadline'],
    related: ['asyncio.wait_for()', 'async with', 'Task.cancel()'],
    mdn: D + 'asyncio-task.html#asyncio.timeout'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.wait_for()',
    desc: 'Wartet auf ein Awaitable mit Zeitlimit und bricht es bei Überschreitung ab.',
    details: '`await asyncio.wait_for(koro(), timeout=2)` gibt das Ergebnis zurück oder wirft `TimeoutError`, nachdem die Aufgabe abgebrochen wurde. Es ist die Funktions-Variante zu `asyncio.timeout()` und praktisch für einen einzelnen Aufruf. Seit Python 3.12 ist es intern über `asyncio.timeout()` implementiert.',
    syntax: 'ergebnis = await asyncio.wait_for(awaitable, timeout)',
    example: e(`
import asyncio

async def antwort(dauer):
    await asyncio.sleep(dauer)
    return "OK"

async def main():
    print(await asyncio.wait_for(antwort(0.01), timeout=1))   # OK
    try:
        await asyncio.wait_for(antwort(1), timeout=0.05)
    except TimeoutError:
        print("abgebrochen")                                  # abgebrochen

asyncio.run(main())
`),
    tip: 'Für mehrere Schritte unter einer gemeinsamen Frist ist `async with asyncio.timeout()` übersichtlicher.',
    keywords: ['wait_for', 'timeout', 'zeitlimit', 'abbrechen', 'warten mit frist'],
    related: ['asyncio.timeout()', 'Task.cancel()', 'async / await'],
    mdn: D + 'asyncio-task.html#asyncio.wait_for'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.as_completed()',
    desc: 'Liefert Ergebnisse mehrerer Aufgaben in der Reihenfolge, in der sie fertig werden.',
    details: 'Im Gegensatz zu `gather()` muss man nicht auf die langsamste Aufgabe warten, sondern verarbeitet jedes Ergebnis sofort. Klassisch iteriert man mit `for` und schreibt `await` vor jedes Element; seit Python 3.13 geht auch `async for`, das direkt die fertigen Tasks liefert. Ein optionales `timeout` begrenzt die Gesamtdauer.',
    syntax: 'for f in asyncio.as_completed(aufgaben):\n    ergebnis = await f',
    example: e(`
import asyncio

async def suche(quelle, dauer):
    await asyncio.sleep(dauer)
    return quelle

async def main():
    aufgaben = [suche("langsam", 0.06), suche("schnell", 0.01), suche("mittel", 0.03)]
    for f in asyncio.as_completed(aufgaben):
        print(await f)

asyncio.run(main())
# schnell / mittel / langsam
`),
    tip: 'Gut für Fortschrittsanzeigen oder „erstes brauchbares Ergebnis nehmen und Rest abbrechen“.',
    keywords: ['as_completed', 'reihenfolge fertig', 'sobald fertig', 'fortschritt', 'first completed'],
    related: ['asyncio.gather()', 'asyncio.TaskGroup', 'concurrent.futures'],
    mdn: D + 'asyncio-task.html#asyncio.as_completed'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'Task.cancel()',
    desc: 'Bricht einen laufenden Task ab; im Task erscheint CancelledError am aktuellen await.',
    details: '`task.cancel()` fordert den Abbruch nur an: Beim nächsten `await` im Task wird `asyncio.CancelledError` geworfen. Der Task kann darauf mit `try/finally` aufräumen, sollte den Fehler aber weiterreichen statt ihn zu verschlucken. Wer anschließend `await task` schreibt, bekommt ebenfalls `CancelledError`. `CancelledError` erbt von `BaseException`, damit `except Exception` es nicht versehentlich fängt.',
    syntax: 'task.cancel()\ntask.cancelled()  # True nach erfolgreichem Abbruch',
    example: e(`
import asyncio

async def dienst():
    try:
        while True:
            await asyncio.sleep(0.01)
    finally:
        print("Dienst aufgeräumt")

async def main():
    task = asyncio.create_task(dienst())
    await asyncio.sleep(0.03)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        print("abgebrochen")
    print(task.cancelled())          # True

asyncio.run(main())
# Dienst aufgeräumt / abgebrochen / True
`),
    tip: 'Nie `except asyncio.CancelledError: pass` ohne erneutes `raise` – sonst funktionieren Timeouts und TaskGroups nicht mehr richtig.',
    keywords: ['cancel', 'abbrechen', 'cancellederror', 'task abbrechen', 'stoppen', 'cancellation'],
    related: ['asyncio.create_task()', 'asyncio.timeout()', 'else & finally'],
    mdn: D + 'asyncio-task.html#asyncio.Task.cancel'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'async for',
    desc: 'Durchläuft einen asynchronen Iterator, bei dem jeder Schritt awaitet werden kann.',
    details: '`async for` ruft `__aiter__()` und bei jedem Schritt `await __anext__()` auf; Ende signalisiert `StopAsyncIteration`. Typische Quellen sind asynchrone Generatoren, Datenbank-Cursor oder Streams. Auch asynchrone Comprehensions sind möglich: `[x async for x in quelle()]`. `async for` ist nur innerhalb von `async def` erlaubt.',
    syntax: 'async for element in async_iterable:\n    ...',
    example: e(`
import asyncio

class Seiten:
    def __init__(self, anzahl):
        self.seite, self.anzahl = 0, anzahl
    def __aiter__(self):
        return self
    async def __anext__(self):
        if self.seite >= self.anzahl:
            raise StopAsyncIteration
        await asyncio.sleep(0.01)          # z. B. Netzwerkabruf
        self.seite += 1
        return f"Seite {self.seite}"

async def main():
    async for s in Seiten(2):
        print(s)                           # Seite 1 / Seite 2
    print([s async for s in Seiten(3)])    # ['Seite 1', 'Seite 2', 'Seite 3']

asyncio.run(main())
`),
    tip: 'Statt einer Klasse mit `__anext__` ist ein Async-Generator (`async def` mit `yield`) meist kürzer.',
    keywords: ['async for', 'asynchrone iteration', '__aiter__', '__anext__', 'stopasynciteration', 'async iterator'],
    related: ['Async-Generator', 'async with', 'Iterator-Protokoll'],
    mdn: R + 'compound_stmts.html#the-async-for-statement'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'Async-Generator',
    desc: 'async def mit yield: liefert Werte asynchron, durchlaufen mit async for.',
    details: 'Ein Async-Generator kann zwischen den `yield`s `await` verwenden, etwa um Daten seitenweise nachzuladen. Er wird mit `async for` oder `anext()` konsumiert; `yield from` ist darin nicht erlaubt. Wird er vorzeitig verlassen, sollte er mit `await gen.aclose()` bzw. `contextlib.aclosing()` geschlossen werden, damit `finally`-Blöcke zuverlässig laufen.',
    syntax: 'async def gen():\n    await ...\n    yield wert',
    example: e(`
import asyncio

async def messwerte(n):
    for i in range(n):
        await asyncio.sleep(0.01)    # z. B. Sensor abfragen
        yield i * 1.5

async def main():
    async for wert in messwerte(3):
        print(wert)                  # 0.0 / 1.5 / 3.0
    gen = messwerte(5)
    print(await anext(gen))          # 0.0
    await gen.aclose()

asyncio.run(main())
`),
    tip: '`anext()` und `aiter()` sind seit Python 3.10 eingebaute Funktionen – das asynchrone Gegenstück zu `next()` und `iter()`.',
    keywords: ['async generator', 'asynchroner generator', 'async yield', 'anext', 'aclose', 'stream'],
    related: ['async for', 'Generator', 'contextlib.asynccontextmanager'],
    mdn: R + 'expressions.html#asynchronous-generator-functions'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'async with',
    desc: 'Asynchroner Context Manager: Betreten und Verlassen dürfen awaiten.',
    details: '`async with` ruft `await __aenter__()` und `await __aexit__()` auf, etwa um Netzwerkverbindungen asynchron zu öffnen und zu schließen. Beispiele aus der Standardbibliothek sind `asyncio.TaskGroup`, `asyncio.timeout()`, `asyncio.Lock` und `asyncio.Semaphore`. Nur innerhalb von `async def` erlaubt.',
    syntax: 'async with ausdruck as name:\n    ...',
    example: e(`
import asyncio

class Verbindung:
    async def __aenter__(self):
        await asyncio.sleep(0.01)
        print("verbunden")
        return self
    async def __aexit__(self, typ, wert, tb):
        await asyncio.sleep(0.01)
        print("getrennt")
    async def senden(self, text):
        print("sende", text)

async def main():
    async with Verbindung() as v:
        await v.senden("Hallo")

asyncio.run(main())
# verbunden / sende Hallo / getrennt
`),
    tip: 'Mit `contextlib.asynccontextmanager` spart man sich die Klasse mit `__aenter__`/`__aexit__`.',
    keywords: ['async with', '__aenter__', '__aexit__', 'asynchroner context manager', 'async context manager'],
    related: ['with', 'contextlib.asynccontextmanager', 'asyncio.TaskGroup'],
    mdn: R + 'compound_stmts.html#the-async-with-statement'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'contextlib.asynccontextmanager',
    desc: 'Macht aus einem Async-Generator mit einem yield einen asynchronen Context Manager.',
    details: 'Funktioniert wie `contextlib.contextmanager`, nur mit `async def` und `async with`. Vor dem `yield` steht der asynchrone Aufbau, dahinter der Abbau – geschützt durch `try/finally`, damit er auch bei Ausnahmen läuft. Häufig genutzt für Verbindungen, Sitzungen oder den Lebenszyklus von Web-Apps (z. B. FastAPI-`lifespan`).',
    syntax: '@asynccontextmanager\nasync def name():\n    try:\n        yield wert\n    finally:\n        ...',
    example: e(`
import asyncio
from contextlib import asynccontextmanager

@asynccontextmanager
async def sitzung(name):
    await asyncio.sleep(0.01)
    print("öffne", name)
    try:
        yield {"name": name}
    finally:
        print("schließe", name)

async def main():
    async with sitzung("db") as s:
        print("arbeite mit", s["name"])

asyncio.run(main())
# öffne db / arbeite mit db / schließe db
`),
    tip: 'Mehrere asynchrone Manager dynamisch kombinieren: `contextlib.AsyncExitStack`.',
    keywords: ['asynccontextmanager', 'async context manager', 'lifespan', 'asynchron aufräumen', 'contextlib'],
    related: ['contextlib.contextmanager', 'async with', 'Async-Generator'],
    mdn: D + 'contextlib.html#contextlib.asynccontextmanager'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.Queue',
    desc: 'Asynchrone Warteschlange für das Erzeuger-Verbraucher-Muster zwischen Tasks.',
    details: '`await q.put(x)` und `await q.get()` warten, wenn die Queue voll bzw. leer ist. Nach jedem verarbeiteten Element ruft der Verbraucher `q.task_done()` auf; `await q.join()` wartet, bis alles erledigt ist. Seit Python 3.13 beendet `q.shutdown()` die Queue sauber. Die Queue ist nicht threadsicher – zwischen Threads nimmt man `queue.Queue`.',
    values: [
      ['await put(x) / put_nowait(x)', 'Element einreihen'],
      ['await get() / get_nowait()', 'Element entnehmen'],
      ['task_done()', 'Element als erledigt markieren'],
      ['await join()', 'Warten, bis alle Elemente erledigt sind'],
      ['maxsize', 'Maximale Länge (0 = unbegrenzt)'],
      ['shutdown()', 'Queue schließen (seit 3.13)']
    ],
    example: e(`
import asyncio

async def arbeiter(name, q, ergebnisse):
    while True:
        zahl = await q.get()
        await asyncio.sleep(0.01)
        ergebnisse.append(zahl * zahl)
        q.task_done()

async def main():
    q = asyncio.Queue()
    ergebnisse = []
    for n in range(1, 6):
        q.put_nowait(n)
    tasks = [asyncio.create_task(arbeiter(f"W{i}", q, ergebnisse)) for i in range(2)]
    await q.join()                 # bis alle task_done() gemeldet haben
    for t in tasks:
        t.cancel()
    print(sorted(ergebnisse))      # [1, 4, 9, 16, 25]

asyncio.run(main())
`),
    tip: 'Mit `maxsize` begrenzt man den Speicher: Ein schneller Erzeuger wartet dann automatisch auf langsame Verbraucher (Backpressure).',
    keywords: ['queue', 'warteschlange', 'producer consumer', 'erzeuger verbraucher', 'worker', 'task_done', 'join'],
    related: ['queue.Queue', 'asyncio.create_task()', 'asyncio.Semaphore'],
    mdn: D + 'asyncio-queue.html#asyncio.Queue'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.Semaphore',
    desc: 'Begrenzt, wie viele Tasks gleichzeitig einen Abschnitt betreten dürfen.',
    details: 'Ein `Semaphore(n)` lässt höchstens `n` Tasks gleichzeitig durch, weitere warten bei `async with sem:`. Typisch, um parallele Anfragen an einen Server zu drosseln. `asyncio.Lock` ist der Spezialfall mit `n = 1`. Wie alle `asyncio`-Synchronisationsprimitive ist es nicht threadsicher.',
    syntax: 'sem = asyncio.Semaphore(n)\nasync with sem:\n    ...',
    example: e(`
import asyncio

aktiv = 0
maximum = 0

async def abruf(sem, i):
    global aktiv, maximum
    async with sem:
        aktiv += 1
        maximum = max(maximum, aktiv)
        await asyncio.sleep(0.01)
        aktiv -= 1
        return i

async def main():
    sem = asyncio.Semaphore(3)
    ergebnisse = await asyncio.gather(*(abruf(sem, i) for i in range(10)))
    print(len(ergebnisse))    # 10
    print(maximum)            # 3

asyncio.run(main())
`),
    tip: 'Das Semaphore innerhalb der laufenden Event-Loop anlegen (z. B. in `main()`), nicht auf Modulebene.',
    keywords: ['semaphore', 'drosseln', 'rate limit', 'begrenzen', 'gleichzeitige anfragen', 'lock', 'concurrency limit'],
    related: ['asyncio.gather()', 'threading.Lock', 'asyncio.Queue'],
    mdn: D + 'asyncio-sync.html#asyncio.Semaphore'
  },
  {
    lang: 'py', group: 'Asynchrone Programmierung', name: 'asyncio.to_thread()',
    desc: 'Führt eine blockierende Funktion in einem Thread aus, ohne die Event-Loop anzuhalten.',
    details: '`await asyncio.to_thread(func, *args)` startet die Funktion im Standard-Thread-Pool und wartet asynchron auf das Ergebnis. So bleiben synchrone Bibliotheken, Dateizugriffe oder `time.sleep()` nutzbar, ohne andere Tasks zu blockieren. Für CPU-lastige Arbeit hilft es wegen des GIL kaum – dafür besser einen `ProcessPoolExecutor` verwenden.',
    syntax: 'ergebnis = await asyncio.to_thread(funktion, *args, **kwargs)',
    example: e(`
import asyncio
import time

def blockierend(n):
    time.sleep(0.1)          # z. B. alte synchrone Bibliothek
    return n * 2

async def main():
    start = time.perf_counter()
    ergebnisse = await asyncio.gather(
        asyncio.to_thread(blockierend, 1),
        asyncio.to_thread(blockierend, 2),
        asyncio.to_thread(blockierend, 3),
    )
    print(ergebnisse)                            # [2, 4, 6]
    print(time.perf_counter() - start < 0.25)    # True – lief parallel

asyncio.run(main())
`),
    tip: 'Ohne `to_thread` würde jedes `time.sleep(0.1)` die ganze Loop anhalten und die Laufzeit verdreifachen.',
    keywords: ['to_thread', 'blockierend', 'thread', 'synchron in async', 'run_in_executor', 'blocking io'],
    related: ['ThreadPoolExecutor', 'async / await', 'GIL & Free-Threading'],
    mdn: D + 'asyncio-task.html#asyncio.to_thread'
  },

  // ---------------- Nebenläufigkeit ----------------
  {
    lang: 'py', group: 'Nebenläufigkeit', name: 'threading.Thread',
    desc: 'Startet eine Funktion in einem eigenen Thread, der parallel zum Hauptprogramm läuft.',
    details: '`Thread(target=funktion, args=(...))` legt den Thread an, `start()` startet ihn, `join()` wartet auf sein Ende. Threads teilen sich den Speicher des Prozesses und eignen sich vor allem für I/O-lastige Arbeit (Netzwerk, Dateien). Wegen des GIL laufen CPU-lastige Python-Threads im Standard-Build nicht wirklich gleichzeitig. Daemon-Threads (`daemon=True`) werden beim Programmende einfach abgebrochen.',
    syntax: 't = threading.Thread(target=f, args=(...), daemon=False)\nt.start()\nt.join()',
    example: e(`
import threading
import time

ergebnisse = {}

def herunterladen(name, dauer):
    time.sleep(dauer)              # simuliert Netzwerk-I/O
    ergebnisse[name] = f"{name}: ok"

threads = [threading.Thread(target=herunterladen, args=(f"datei{i}", 0.1)) for i in range(3)]
start = time.perf_counter()
for t in threads:
    t.start()
for t in threads:
    t.join()

print(sorted(ergebnisse.values()))           # ['datei0: ok', 'datei1: ok', 'datei2: ok']
print(time.perf_counter() - start < 0.25)    # True – lief parallel
`),
    tip: 'Statt Threads von Hand zu verwalten, ist ein `ThreadPoolExecutor` meist kürzer und liefert auch Rückgabewerte und Ausnahmen.',
    keywords: ['thread', 'threading', 'parallel', 'nebenläufig', 'start', 'join', 'daemon'],
    related: ['threading.Lock', 'ThreadPoolExecutor', 'GIL & Free-Threading'],
    mdn: D + 'threading.html#thread-objects'
  },
  {
    lang: 'py', group: 'Nebenläufigkeit', name: 'threading.Lock',
    desc: 'Sperre, die gemeinsame Daten vor gleichzeitigem Zugriff mehrerer Threads schützt.',
    details: 'Nur ein Thread kann die Sperre halten; andere warten bei `with lock:`, bis sie frei ist. Operationen wie `zaehler += 1` sind nicht atomar (lesen, rechnen, schreiben) und können ohne Sperre Aktualisierungen verlieren – besonders im Free-Threading-Build. `RLock` darf vom selben Thread mehrfach betreten werden. Mehrere Locks immer in derselben Reihenfolge holen, sonst drohen Deadlocks.',
    syntax: 'lock = threading.Lock()\nwith lock:\n    ...',
    example: e(`
import threading

zaehler = 0
lock = threading.Lock()

def erhoehen(n):
    global zaehler
    for _ in range(n):
        with lock:              # kritischer Abschnitt
            zaehler += 1

threads = [threading.Thread(target=erhoehen, args=(50_000,)) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print(zaehler)                  # 200000
`),
    tip: 'Kritische Abschnitte kurz halten: Kein I/O und keine langen Berechnungen, während die Sperre gehalten wird.',
    keywords: ['lock', 'mutex', 'sperre', 'rlock', 'race condition', 'synchronisieren', 'thread safety', 'threadsicher'],
    related: ['threading.Thread', 'threading.Event', 'queue.Queue'],
    mdn: D + 'threading.html#lock-objects'
  },
  {
    lang: 'py', group: 'Nebenläufigkeit', name: 'threading.Event',
    desc: 'Einfaches Signal zwischen Threads: einer setzt es, andere warten darauf.',
    details: '`event.set()` setzt das Flag, `event.wait(timeout)` blockiert, bis es gesetzt ist, und `event.clear()` setzt es zurück. Typisch ist ein Stopp-Signal für Hintergrund-Threads, die regelmäßig `is_set()` prüfen oder mit `wait(intervall)` schlafen. `wait()` gibt `True` zurück, wenn das Flag gesetzt wurde, bei Timeout `False`.',
    syntax: 'ev = threading.Event()\nev.set() / ev.clear() / ev.is_set()\nev.wait(timeout=None)',
    example: e(`
import threading

stopp = threading.Event()
runden = []

def hintergrund():
    while not stopp.wait(0.01):     # schläft, bis Signal oder Timeout
        runden.append(1)
    print("Hintergrund beendet")

t = threading.Thread(target=hintergrund)
t.start()
stopp.wait(0.1)                     # Hauptthread wartet kurz
stopp.set()                         # Signal senden
t.join()                            # Hintergrund beendet
print(len(runden) > 0)              # True
`),
    tip: '`stopp.wait(intervall)` statt `time.sleep(intervall)` – so reagiert der Thread sofort auf das Stopp-Signal.',
    keywords: ['event', 'signal', 'flag', 'stoppen', 'beenden', 'warten', 'thread kommunikation'],
    related: ['threading.Thread', 'threading.Lock', 'queue.Queue'],
    mdn: D + 'threading.html#event-objects'
  },
  {
    lang: 'py', group: 'Nebenläufigkeit', name: 'concurrent.futures',
    desc: 'Einheitliche High-Level-API für Thread- und Prozess-Pools mit Futures.',
    details: 'Das Modul bietet `ThreadPoolExecutor` und `ProcessPoolExecutor` mit identischer Schnittstelle: `submit()` liefert ein `Future`, `map()` verarbeitet ein Iterable. `as_completed()` liefert Futures in Fertigstellungsreihenfolge, `wait()` wartet mit Bedingungen wie `FIRST_COMPLETED`. Seit Python 3.14 gibt es zusätzlich `InterpreterPoolExecutor` für Subinterpreter.',
    values: [
      ['ThreadPoolExecutor', 'Pool aus Threads (I/O-lastig)'],
      ['ProcessPoolExecutor', 'Pool aus Prozessen (CPU-lastig)'],
      ['InterpreterPoolExecutor', 'Pool aus Subinterpretern (seit 3.14)'],
      ['submit(f, *args)', 'Aufgabe einreichen, liefert Future'],
      ['map(f, iterable)', 'Wie map(), Ergebnisse in Eingabereihenfolge'],
      ['as_completed(futures)', 'Futures, sobald sie fertig sind'],
      ['wait(futures, return_when=...)', 'Auf alle/erste warten']
    ],
    example: e(`
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

def pruefen(url):
    time.sleep(0.05 if "slow" in url else 0.01)
    return url, len(url)

urls = ["a.de/slow", "b.de", "c.de/x"]
with ThreadPoolExecutor(max_workers=3) as pool:
    futures = [pool.submit(pruefen, u) for u in urls]
    for f in as_completed(futures):
        print(f.result())
# ('b.de', 4) / ('c.de/x', 6) / ('a.de/slow', 9)  – Reihenfolge je nach Laufzeit
`),
    tip: 'Den Executor immer mit `with` verwenden – beim Verlassen wird auf alle Aufgaben gewartet und der Pool sauber beendet.',
    keywords: ['concurrent futures', 'executor', 'pool', 'future', 'as_completed', 'parallel', 'thread pool', 'process pool'],
    related: ['ThreadPoolExecutor', 'ProcessPoolExecutor', 'Future'],
    mdn: D + 'concurrent.futures.html'
  },
  {
    lang: 'py', group: 'Nebenläufigkeit', name: 'ThreadPoolExecutor',
    desc: 'Pool aus Threads, der Aufgaben verteilt – ideal für viele parallele I/O-Aufrufe.',
    details: '`pool.map(f, daten)` liefert die Ergebnisse in Eingabereihenfolge; tritt in einer Aufgabe eine Ausnahme auf, wird sie beim Abrufen dieses Ergebnisses geworfen. Ohne `max_workers` wählt Python `min(32, CPU-Anzahl + 4)` Threads. Für CPU-lastige reine Python-Berechnungen bringt ein Thread-Pool im Standard-Build wegen des GIL kaum Beschleunigung.',
    syntax: 'with ThreadPoolExecutor(max_workers=n) as pool:\n    ergebnisse = pool.map(f, daten)',
    example: e(`
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

for i in range(4):
    Path(f"teil{i}.txt").write_text("x" * (i + 1) * 100, encoding="utf-8")

def groesse(pfad):
    return pfad.name, len(pfad.read_text(encoding="utf-8"))

with ThreadPoolExecutor(max_workers=4) as pool:
    for name, n in pool.map(groesse, sorted(Path(".").glob("teil*.txt"))):
        print(name, n)
# teil0.txt 100 / teil1.txt 200 / teil2.txt 300 / teil3.txt 400
`),
    tip: 'Ergebnisse von `pool.map()` sind ein Iterator – Ausnahmen tauchen erst beim Durchlaufen auf, nicht beim Aufruf.',
    keywords: ['threadpoolexecutor', 'thread pool', 'threadpool', 'parallel io', 'worker', 'map'],
    related: ['concurrent.futures', 'ProcessPoolExecutor', 'asyncio.to_thread()'],
    mdn: D + 'concurrent.futures.html#threadpoolexecutor'
  },
  {
    lang: 'py', group: 'Nebenläufigkeit', name: 'ProcessPoolExecutor',
    desc: 'Pool aus eigenen Prozessen – echte Parallelität für CPU-lastige Berechnungen.',
    details: 'Jeder Prozess hat einen eigenen Interpreter und eigenen GIL, daher nutzt der Pool alle CPU-Kerne. Funktionen und Argumente werden per `pickle` übertragen – Lambdas und lokale Funktionen gehen nicht. Unter Windows und macOS (Startmethode „spawn“) muss der Startcode in `if __name__ == "__main__":` stehen, sonst startet jeder Kindprozess das Programm erneut. Der Start ist teuer; nur für ausreichend große Aufgaben lohnend.',
    syntax: 'if __name__ == "__main__":\n    with ProcessPoolExecutor() as pool:\n        ergebnisse = pool.map(f, daten)',
    example: e(`
from concurrent.futures import ProcessPoolExecutor
import math

def ist_primzahl(n):
    if n < 2:
        return False
    return all(n % t for t in range(2, math.isqrt(n) + 1))

if __name__ == "__main__":
    zahlen = [112_272_535_095_293, 112_582_705_942_171, 115_280_095_190_773, 15]
    with ProcessPoolExecutor(max_workers=2) as pool:
        print(list(pool.map(ist_primzahl, zahlen, chunksize=1)))
    # [True, True, True, False]
`),
    tip: 'Bei vielen kleinen Aufgaben `chunksize` erhöhen, damit nicht jedes Element einzeln zwischen Prozessen hin- und hergeschickt wird.',
    keywords: ['processpoolexecutor', 'prozesse', 'multiprocessing', 'cpu', 'mehrkern', 'parallel rechnen', 'process pool'],
    related: ['concurrent.futures', 'multiprocessing', 'GIL & Free-Threading', 'if __name__ == "__main__"'],
    mdn: D + 'concurrent.futures.html#processpoolexecutor'
  },
  {
    lang: 'py', group: 'Nebenläufigkeit', name: 'Future',
    desc: 'Platzhalter für ein Ergebnis, das ein Executor später liefert.',
    details: '`pool.submit()` gibt sofort ein `concurrent.futures.Future` zurück. `result(timeout)` wartet auf den Wert und wirft eine in der Aufgabe aufgetretene Ausnahme erneut; `exception()` liefert sie stattdessen. Mit `add_done_callback()` lässt sich Code anhängen, der beim Fertigwerden läuft. `asyncio` hat eine eigene, nicht austauschbare `Future`-Klasse.',
    values: [
      ['result(timeout=None)', 'Ergebnis abwarten (wirft Ausnahme der Aufgabe)'],
      ['exception()', 'Ausnahme der Aufgabe oder None'],
      ['done()', 'True, wenn fertig oder abgebrochen'],
      ['cancel()', 'Abbrechen, falls noch nicht gestartet'],
      ['add_done_callback(f)', 'f(future) nach Fertigstellung aufrufen']
    ],
    example: e(`
from concurrent.futures import ThreadPoolExecutor

def teilen(a, b):
    return a / b

with ThreadPoolExecutor() as pool:
    gut = pool.submit(teilen, 10, 4)
    schlecht = pool.submit(teilen, 1, 0)
    gut.add_done_callback(lambda f: print("fertig:", f.result()))

print(gut.result())                     # 2.5  (davor: fertig: 2.5)
print(repr(schlecht.exception()))       # ZeroDivisionError('division by zero')
try:
    schlecht.result()
except ZeroDivisionError:
    print("Fehler kam beim result() an")   # Fehler kam beim result() an
`),
    tip: 'Ausnahmen in Aufgaben gehen still verloren, wenn niemand `result()` oder `exception()` aufruft.',
    keywords: ['future', 'promise', 'ergebnis später', 'submit', 'result', 'callback'],
    related: ['concurrent.futures', 'ThreadPoolExecutor', 'asyncio.create_task()'],
    mdn: D + 'concurrent.futures.html#future-objects'
  },
  {
    lang: 'py', group: 'Nebenläufigkeit', name: 'multiprocessing',
    desc: 'Startet Python-Prozesse mit thread-ähnlicher API, inklusive Pools, Queues und Pipes.',
    details: '`multiprocessing.Process` funktioniert wie `threading.Thread`, startet aber einen eigenen Prozess mit eigenem Speicher. Daten tauscht man über `Queue`, `Pipe` oder geteilte Werte (`Value`, `Array`) aus. `multiprocessing.Pool` ist die ältere Pool-API; für neuen Code ist `ProcessPoolExecutor` meist einfacher. Seit Python 3.14 ist auf Linux „forkserver“ statt „fork“ die Standard-Startmethode.',
    values: [
      ['Process(target, args)', 'Neuer Prozess'],
      ['Pool(n).map(f, xs)', 'Klassischer Prozess-Pool'],
      ['Queue()', 'Prozesssichere Warteschlange'],
      ['Pipe()', 'Zwei verbundene Endpunkte'],
      ['cpu_count()', 'Anzahl CPU-Kerne'],
      ['set_start_method()', '„spawn“, „fork“ oder „forkserver“']
    ],
    example: e(`
import multiprocessing as mp

def quadrieren(zahlen, q):
    q.put([z * z for z in zahlen])

if __name__ == "__main__":
    q = mp.Queue()
    p = mp.Process(target=quadrieren, args=([1, 2, 3], q))
    p.start()
    print(q.get())          # [1, 4, 9]
    p.join()
    print(p.exitcode)       # 0

    with mp.Pool(2) as pool:
        print(pool.map(abs, [-1, -2, 3]))   # [1, 2, 3]
`),
    tip: 'Erst aus der Queue lesen, dann `join()` – sonst kann der Kindprozess beim Schreiben großer Daten hängen bleiben.',
    keywords: ['multiprocessing', 'prozess', 'process', 'pool', 'mehrere kerne', 'pipe', 'spawn', 'fork'],
    related: ['ProcessPoolExecutor', 'queue.Queue', 'threading.Thread'],
    mdn: D + 'multiprocessing.html'
  },
  {
    lang: 'py', group: 'Nebenläufigkeit', name: 'queue.Queue',
    desc: 'Threadsichere FIFO-Warteschlange für die Kommunikation zwischen Threads.',
    details: '`put()` und `get()` sind threadsicher und blockieren bei voller bzw. leerer Queue (optional mit `timeout`). Mit `task_done()` und `join()` wartet man, bis alle Elemente verarbeitet sind. Varianten sind `LifoQueue` (Stapel) und `PriorityQueue` (kleinstes Element zuerst). Seit Python 3.13 beendet `shutdown()` die Queue und weckt wartende Threads.',
    values: [
      ['put(x) / get()', 'Einreihen / entnehmen (blockierend)'],
      ['put_nowait / get_nowait', 'Sofort, sonst Full/Empty-Ausnahme'],
      ['task_done() / join()', 'Erledigung melden / auf alles warten'],
      ['LifoQueue', 'Last in, first out'],
      ['PriorityQueue', 'Nach Priorität sortiert'],
      ['shutdown()', 'Queue schließen (seit 3.13)']
    ],
    example: e(`
import queue
import threading

auftraege = queue.Queue()
fertig = []

def arbeiter():
    while True:
        x = auftraege.get()
        if x is None:            # Signal zum Beenden
            break
        fertig.append(x * 10)
        auftraege.task_done()

t = threading.Thread(target=arbeiter)
t.start()
for i in range(5):
    auftraege.put(i)
auftraege.join()                 # warten, bis alle verarbeitet sind
auftraege.put(None)
t.join()
print(fertig)                    # [0, 10, 20, 30, 40]
`),
    tip: 'Eine Queue ersetzt oft Locks: Threads teilen keine Daten direkt, sondern schicken sich Nachrichten.',
    keywords: ['queue', 'warteschlange', 'threadsicher', 'producer consumer', 'fifo', 'priorityqueue', 'lifoqueue'],
    related: ['asyncio.Queue', 'threading.Thread', 'collections.deque'],
    mdn: D + 'queue.html#queue.Queue'
  },
  {
    lang: 'py', group: 'Nebenläufigkeit', name: 'GIL & Free-Threading',
    desc: 'Der GIL lässt nur einen Thread gleichzeitig Python-Code ausführen; Free-Threading entfernt ihn.',
    details: 'Im Standard-CPython verhindert der Global Interpreter Lock, dass mehrere Threads parallel Python-Bytecode ausführen; I/O und viele C-Erweiterungen geben ihn aber frei. Seit Python 3.13 gibt es experimentelle Free-Threading-Builds (`python3.13t`) ohne GIL, seit Python 3.14 sind sie offiziell unterstützt. Faustregel: I/O → Threads oder `asyncio`, CPU → Prozesse oder Free-Threading.',
    values: [
      ['I/O-lastig', 'threading, ThreadPoolExecutor, asyncio'],
      ['CPU-lastig', 'ProcessPoolExecutor, multiprocessing'],
      ['Free-Threading', 'python3.14t: Threads laufen echt parallel'],
      ['sys._is_gil_enabled()', 'Prüft, ob der GIL aktiv ist (seit 3.13)'],
      ['PYTHON_GIL=0', 'GIL im Free-Threading-Build abschalten erzwingen']
    ],
    example: e(`
import sys
import sysconfig

frei = sysconfig.get_config_var("Py_GIL_DISABLED")
print("Free-Threading-Build:", bool(frei))   # z. B. False (Standard-Build)
print("GIL aktiv:", sys._is_gil_enabled())    # z. B. True
`),
    tip: 'Auch ohne GIL gilt: Gemeinsame veränderliche Daten mit `Lock` oder `Queue` schützen.',
    keywords: ['gil', 'global interpreter lock', 'free threading', 'nogil', 'parallelität', 'python3.14t', 'pep 703'],
    related: ['threading.Thread', 'ProcessPoolExecutor', 'async / await'],
    mdn: 'https://docs.python.org/3/howto/free-threading-python.html'
  },

  // ---------------- Module & Pakete ----------------
  {
    lang: 'py', group: 'Module & Pakete', name: 'import',
    desc: 'Lädt ein Modul und bindet es an einen Namen im aktuellen Namensraum.',
    details: 'Beim ersten `import` sucht Python das Modul, führt es einmal aus und legt es in `sys.modules` ab; weitere Importe nutzen diesen Cache. Mit `as` vergibt man einen Alias. Importe stehen laut PEP 8 am Dateianfang, gruppiert nach Standardbibliothek, Drittanbietern und eigenen Modulen. Eine eigene Datei mit dem Namen eines Standardmoduls (z. B. `random.py`) überdeckt dieses – ein häufiger Fehler.',
    syntax: 'import modul\nimport modul as alias\nimport paket.untermodul',
    example: e(`
import math
import datetime as dt
import os.path

print(math.sqrt(16))                    # 4.0
print(dt.date(2026, 11, 16).isoformat())   # 2026-11-16
print(os.path.splitext("bild.png"))     # ('bild', '.png')
print(math.__name__)                    # math
`),
    tip: 'Seit Python 3.13 nennt der Interpreter bei einem überdeckten Standardmodul den Grund in der Fehlermeldung.',
    keywords: ['import', 'modul laden', 'importieren', 'alias', 'as', 'module'],
    related: ['from … import', 'Modulsuche & sys.path', 'Pakete & __init__.py', 'sys.modules'],
    mdn: R + 'simple_stmts.html#the-import-statement'
  },
  {
    lang: 'py', group: 'Module & Pakete', name: 'from … import',
    desc: 'Importiert einzelne Namen aus einem Modul direkt in den eigenen Namensraum.',
    details: '`from modul import name` macht `name` ohne Modulpräfix verfügbar; mehrere Namen trennt man mit Kommas, lange Listen setzt man in Klammern. `from modul import *` importiert alle öffentlichen Namen und sollte außer im interaktiven Interpreter vermieden werden, weil unklar wird, woher Namen stammen. Der importierte Name ist eine Kopie der Bindung: Spätere Neuzuweisungen im Modul sieht man nicht.',
    syntax: 'from modul import name\nfrom modul import name as alias\nfrom modul import (a, b, c)',
    example: e(`
from math import pi, sqrt
from collections import Counter as Zaehler
from os.path import (
    basename,
    dirname,
)

print(round(pi, 2))                     # 3.14
print(sqrt(2) ** 2 > 1.99)              # True
print(Zaehler("ananas").most_common(1)) # [('a', 3)]
print(basename("/tmp/a.txt"), dirname("/tmp/a.txt"))   # a.txt /tmp
`),
    tip: 'Bei Namenskollisionen (z. B. `json.load` und `pickle.load`) lieber das Modul importieren und `modul.name` schreiben.',
    keywords: ['from import', 'namen importieren', 'star import', 'import *', 'wildcard', 'einzelne funktion'],
    related: ['import', '__all__', 'Relative Imports'],
    mdn: T + 'modules.html#more-on-modules'
  },
  {
    lang: 'py', group: 'Module & Pakete', name: 'Pakete & __init__.py',
    desc: 'Ein Paket ist ein Verzeichnis mit Modulen; __init__.py wird beim Import ausgeführt.',
    details: 'Ein Verzeichnis mit `__init__.py` ist ein reguläres Paket; Untermodule importiert man mit Punkt-Notation (`paket.modul`). Code in `__init__.py` läuft beim ersten Import des Pakets und dient oft dazu, wichtige Namen auf Paketebene bereitzustellen. Fehlt `__init__.py`, entsteht ein Namespace-Paket – das funktioniert, ist aber meist nicht gewollt. Für größere Projekte bewährt sich das „src-Layout“.',
    syntax: 'shop/\n    __init__.py\n    kasse.py\n    lager/\n        __init__.py\n        bestand.py',
    example: e(`
# Struktur:
# shop/
#     __init__.py      -> from .kasse import summe
#     kasse.py         -> def summe(preise): return sum(preise)
#     lager/
#         __init__.py
#         bestand.py   -> BESTAND = {"Tee": 4}

import shop
from shop.lager import bestand
from shop.kasse import summe

print(shop.summe([2, 3]))      # 5  (über __init__.py bereitgestellt)
print(summe([1, 1]))           # 2
print(bestand.BESTAND)         # {'Tee': 4}
`),
    nocheck: true,
    tip: '`__init__.py` schlank halten: Schwere Importe darin verlangsamen jeden Import des Pakets.',
    keywords: ['paket', 'package', '__init__.py', 'untermodul', 'verzeichnis', 'namespace package', 'src layout'],
    related: ['Relative Imports', '__all__', 'import', '__main__.py & python -m'],
    mdn: T + 'modules.html#packages'
  },
  {
    lang: 'py', group: 'Module & Pakete', name: 'Relative Imports',
    desc: 'Importe relativ zum aktuellen Paket mit Punkten: . für dasselbe, .. für das übergeordnete.',
    details: 'Relative Importe funktionieren nur mit der `from`-Form und nur innerhalb von Paketen. Startet man eine Datei direkt (`python shop/kasse.py`), kennt sie ihr Paket nicht und meldet „attempted relative import with no known parent package“. Dann das Modul mit `python -m shop.kasse` aus dem Projektverzeichnis starten. Absolute Importe (`from shop.lager import bestand`) sind oft klarer.',
    syntax: 'from . import modul\nfrom .modul import name\nfrom ..paket import name',
    example: e(`
# Datei shop/kasse.py
from . import rabatte                 # shop/rabatte.py
from .lager.bestand import BESTAND    # shop/lager/bestand.py

def preis(artikel, basis):
    if BESTAND.get(artikel, 0) == 0:
        raise ValueError(f"{artikel} ausverkauft")
    return basis * (1 - rabatte.SATZ)

# Datei shop/lager/bestand.py
# from ..rabatte import SATZ          # eine Ebene höher

# Aufruf aus dem Projektordner:  python -m shop.kasse
`),
    nocheck: true,
    tip: 'Fehlermeldung „no known parent package“? Nicht die Datei direkt starten, sondern `python -m paket.modul`.',
    keywords: ['relativer import', 'relative import', 'punkt import', 'from .', 'parent package', 'paketintern'],
    related: ['Pakete & __init__.py', 'from … import', '__main__.py & python -m'],
    mdn: T + 'modules.html#intra-package-references'
  },
  {
    lang: 'py', group: 'Module & Pakete', name: '__all__',
    desc: 'Liste der öffentlichen Namen eines Moduls; steuert, was from modul import * lädt.',
    details: 'Ohne `__all__` importiert `from modul import *` alle Namen, die nicht mit `_` beginnen – auch die selbst importierten Module. Mit `__all__ = ["a", "b"]` legt man die öffentliche Schnittstelle explizit fest; Werkzeuge wie Dokumentationsgeneratoren und Type Checker werten die Liste ebenfalls aus. Auf normale Importe (`from modul import x`) hat `__all__` keinen Einfluss.',
    syntax: '__all__ = ["name1", "name2"]',
    example: e(`
# Datei geometrie.py
import math

__all__ = ["kreisflaeche", "PI"]

PI = math.pi

def kreisflaeche(r):
    return PI * r * r

def _hilfe():               # privat per Konvention
    return 42

# Datei main.py
# from geometrie import *
# print(kreisflaeche(1))     # 3.141592653589793
# print(math)                # NameError – math steht nicht in __all__
`),
    nocheck: true,
    tip: 'Einen führenden Unterstrich (`_hilfe`) für interne Namen verwenden – das versteht jeder Python-Entwickler als „nicht öffentlich“.',
    keywords: ['__all__', 'öffentliche api', 'public', 'star import', 'export', 'import *'],
    related: ['from … import', 'Pakete & __init__.py', 'Private Namen (_ und __)'],
    mdn: T + 'modules.html#importing-from-a-package'
  },
  {
    lang: 'py', group: 'Module & Pakete', name: 'Modulsuche & sys.path',
    desc: 'sys.path ist die Liste der Verzeichnisse, in denen import nach Modulen sucht.',
    details: 'Python durchsucht `sys.path` der Reihe nach: zuerst das Verzeichnis des gestarteten Skripts (bzw. das aktuelle bei `-m` und im REPL), dann `PYTHONPATH`, die Standardbibliothek und `site-packages`. Das erste passende Modul gewinnt. `sys.path` lässt sich zur Laufzeit ändern; sauberer ist es, das eigene Projekt als Paket zu installieren (`pip install -e .`). Mit `python -P` oder `-I` wird das Skriptverzeichnis nicht vorangestellt.',
    values: [
      ['Skriptverzeichnis', 'Ordner der gestarteten Datei (oder cwd bei -m)'],
      ['PYTHONPATH', 'Zusätzliche Verzeichnisse aus der Umgebung'],
      ['Standardbibliothek', 'z. B. .../lib/python3.14'],
      ['site-packages', 'Installierte Pakete (pip)'],
      ['.pth-Dateien', 'Weitere Pfade aus site-packages']
    ],
    example: e(`
import sys
import json
from pathlib import Path

print(any("site-packages" in p for p in sys.path))   # z. B. True
print(Path(json.__file__).parent.name)               # json
print(Path(json.__file__).name)                      # __init__.py

# Eigenes Verzeichnis zur Laufzeit hinzufügen
Path("libs").mkdir(exist_ok=True)
Path("libs/helfer.py").write_text("GRUSS = 'Hallo'", encoding="utf-8")
sys.path.insert(0, str(Path("libs").resolve()))
import helfer
print(helfer.GRUSS)                                  # Hallo
`),
    tip: 'Herausfinden, welche Datei tatsächlich importiert wird: `print(modul.__file__)`.',
    keywords: ['sys.path', 'modulsuche', 'pythonpath', 'site-packages', 'import pfad', 'modulenotfounderror', 'search path'],
    related: ['import', 'sys.modules', 'venv', 'importlib'],
    mdn: T + 'modules.html#the-module-search-path'
  },
  {
    lang: 'py', group: 'Module & Pakete', name: 'sys.modules',
    desc: 'Dictionary aller bereits geladenen Module – der Cache hinter import.',
    details: 'Jeder `import` schaut zuerst in `sys.modules`; nur wenn das Modul dort fehlt, wird die Datei gesucht und ausgeführt. Deshalb läuft Code auf Modulebene nur beim ersten Import. Entfernt man einen Eintrag, wird das Modul beim nächsten `import` neu geladen – bestehende Referenzen zeigen aber weiter auf das alte Objekt.',
    syntax: 'sys.modules["name"]',
    example: e(`
import sys

print("csv" in sys.modules)       # False
import csv
print("csv" in sys.modules)       # True
print(sys.modules["csv"] is csv)  # True

import csv as nochmal
print(nochmal is csv)             # True – aus dem Cache, nicht neu geladen
`),
    tip: 'Wer ein Modul während der Entwicklung neu laden will, nutzt `importlib.reload(modul)`.',
    keywords: ['sys.modules', 'modul cache', 'geladene module', 'import cache', 'einmal ausgeführt'],
    related: ['import', 'importlib', 'Zirkuläre Imports'],
    mdn: D + 'sys.html#sys.modules'
  },
  {
    lang: 'py', group: 'Module & Pakete', name: 'Zirkuläre Imports',
    desc: 'Zwei Module importieren sich gegenseitig – führt oft zu ImportError oder halb geladenen Modulen.',
    details: 'Importiert `a` das Modul `b` und `b` wiederum `a`, findet `b` ein erst teilweise ausgeführtes `a` vor. `from a import x` scheitert dann mit „cannot import name … (most likely due to a circular import)“. Lösungen: Gemeinsames in ein drittes Modul auslagern, `import a` statt `from a import x` verwenden und erst in der Funktion auf `a.x` zugreifen, oder den Import in die Funktion verschieben. Für reine Typ-Hinweise hilft `if TYPE_CHECKING:`.',
    example: e(`
# Datei kunde.py
from bestellung import Bestellung      # Problem: bestellung importiert kunde

class Kunde:
    def bestellen(self):
        return Bestellung(self)

# Datei bestellung.py
from typing import TYPE_CHECKING
if TYPE_CHECKING:                      # Lösung: nur für den Type Checker
    from kunde import Kunde

class Bestellung:
    def __init__(self, kunde: "Kunde"):
        self.kunde = kunde
`),
    nocheck: true,
    tip: 'Zirkuläre Imports sind oft ein Hinweis auf eine unklare Aufteilung der Module – Abhängigkeiten sollten nur in eine Richtung zeigen.',
    keywords: ['circular import', 'zirkulär', 'gegenseitiger import', 'importerror', 'partially initialized', 'type_checking'],
    related: ['import', 'sys.modules', 'Typ-Annotationen'],
    mdn: 'https://docs.python.org/3/faq/programming.html#what-are-the-best-practices-for-using-import-in-a-module'
  },
  {
    lang: 'py', group: 'Module & Pakete', name: 'importlib',
    desc: 'Programmatische Importe: Module per Name laden, neu laden oder Dateien importieren.',
    details: '`importlib.import_module("paket.modul")` lädt ein Modul, dessen Name erst zur Laufzeit feststeht, etwa für Plugins. `importlib.reload(modul)` führt ein Modul erneut aus. `importlib.util.find_spec()` prüft, ob ein Modul verfügbar ist, ohne es zu importieren. Für Dateien in Paketen (Vorlagen, Daten) ist `importlib.resources` gedacht, für installierte Paketversionen `importlib.metadata`.',
    values: [
      ['import_module(name)', 'Modul per String importieren'],
      ['reload(modul)', 'Modul neu laden'],
      ['util.find_spec(name)', 'Ist das Modul vorhanden? (sonst None)'],
      ['resources.files(paket)', 'Datendateien eines Pakets lesen'],
      ['metadata.version(dist)', 'Version eines installierten Pakets']
    ],
    example: e(`
import importlib
import importlib.util
import importlib.metadata

formate = {"json": "json", "csv": "csv"}
modul = importlib.import_module(formate["json"])
print(modul.dumps({"a": 1}))                     # {"a": 1}

print(importlib.util.find_spec("tomllib") is not None)    # True
print(importlib.util.find_spec("gibtsnicht") is None)     # True

try:
    importlib.metadata.version("pip")
    print("pip installiert")                     # z. B. pip installiert
except importlib.metadata.PackageNotFoundError:
    print("pip fehlt")
`),
    tip: 'Optionale Abhängigkeiten sauber prüfen: `if importlib.util.find_spec("numpy"): ...` statt `try: import numpy`.',
    keywords: ['importlib', 'dynamischer import', 'import_module', 'reload', 'find_spec', 'plugins', 'metadata', 'resources'],
    related: ['import', 'sys.modules', 'Modulsuche & sys.path'],
    mdn: D + 'importlib.html'
  },
  {
    lang: 'py', group: 'Module & Pakete', name: '__main__.py & python -m',
    desc: 'python -m startet ein Modul oder Paket als Skript; bei Paketen läuft dessen __main__.py.',
    details: '`python -m modul` sucht das Modul über `sys.path` und führt es mit `__name__ == "__main__"` aus. Bei einem Paket wird `paket/__main__.py` gestartet – so wird ein Paket zur Kommandozeilenanwendung. Weil das aktuelle Verzeichnis im Suchpfad liegt und das Paket korrekt erkannt wird, funktionieren relative Importe. Viele Standardmodule sind so nutzbar, etwa `python -m venv`, `python -m http.server` oder `python -m json`.',
    syntax: 'python -m modul [argumente]\npython -m paket          # führt paket/__main__.py aus',
    example: e(`
# Paket mit Kommandozeilen-Einstieg
#   werkzeug/
#       __init__.py
#       __main__.py
#       zaehlen.py

# Datei werkzeug/__main__.py
import sys
from .zaehlen import woerter

def main():
    text = " ".join(sys.argv[1:])
    print(woerter(text))

if __name__ == "__main__":
    main()

# Aufruf:  python -m werkzeug Hallo schöne Welt   ->  3
`),
    nocheck: true,
    tip: 'Nützliche eingebaute Module: `python -m http.server 8000` (Webserver), `python -m json pretty.json` (JSON formatieren, seit 3.14), `python -m timeit`.',
    keywords: ['__main__.py', 'python -m', 'modul ausführen', 'cli', 'kommandozeile', 'einstiegspunkt', 'runpy'],
    related: ['if __name__ == "__main__"', 'Relative Imports', 'Pakete & __init__.py'],
    mdn: D + '__main__.html#main-py-in-python-packages'
  },

  // ---------------- Werkzeuge & Umgebung ----------------
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'pip',
    desc: 'Paketmanager von Python: installiert Pakete aus dem Python Package Index (PyPI).',
    details: 'Am zuverlässigsten ruft man pip über den gewünschten Interpreter auf: `python -m pip …` – so landet das Paket garantiert in der richtigen Umgebung. Pakete gehören in eine virtuelle Umgebung, nicht in die System-Installation; viele Linux-Distributionen verhindern Letzteres sogar („externally-managed-environment“). Versionsangaben folgen PEP 440, etwa `==`, `>=` oder `~=`.',
    values: [
      ['install paket', 'Paket installieren'],
      ['install "paket>=2,<3"', 'Mit Versionsbereich'],
      ['install -U paket', 'Auf neueste Version aktualisieren'],
      ['install -r requirements.txt', 'Alle Pakete aus Datei'],
      ['install -e .', 'Eigenes Projekt editierbar installieren'],
      ['uninstall paket', 'Paket entfernen'],
      ['list / show paket', 'Installierte Pakete / Details'],
      ['freeze', 'Installierte Pakete mit exakter Version']
    ],
    example: e(`
# Paket in die aktive Umgebung installieren
python -m pip install requests

# Bestimmte Version bzw. Versionsbereich
python -m pip install "django~=5.1"

# Aktualisieren und anzeigen
python -m pip install --upgrade pip
python -m pip list --outdated
python -m pip show requests
`),
    exampleLang: 'sh',
    tip: 'Unter Windows funktioniert auch `py -m pip …` – der Launcher wählt die neueste installierte Python-Version.',
    keywords: ['pip', 'paket installieren', 'pypi', 'install', 'package manager', 'abhängigkeiten', 'dependencies'],
    related: ['venv', 'requirements.txt', 'uv', 'pyproject.toml'],
    mdn: 'https://docs.python.org/3/installing/index.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'venv',
    desc: 'Erstellt eine virtuelle Umgebung: ein isolierter Ordner mit eigenem Interpreter und Paketen.',
    details: 'Jedes Projekt bekommt seine eigene Umgebung, damit sich Paketversionen verschiedener Projekte nicht in die Quere kommen. Nach dem Aktivieren zeigen `python` und `pip` auf die Umgebung; ohne Aktivierung ruft man direkt `.venv/bin/python` bzw. `.venv\\Scripts\\python.exe` auf. Der Ordner `.venv` gehört nicht ins Git-Repository und lässt sich jederzeit aus `requirements.txt` oder `pyproject.toml` neu erzeugen.',
    values: [
      ['python -m venv .venv', 'Umgebung anlegen'],
      ['source .venv/bin/activate', 'Aktivieren (Linux/macOS)'],
      ['.venv\\Scripts\\activate', 'Aktivieren (Windows)'],
      ['deactivate', 'Deaktivieren'],
      ['sys.prefix != sys.base_prefix', 'Im Code: läuft in venv?']
    ],
    example: e(`
# Umgebung anlegen und aktivieren (Linux/macOS)
python -m venv .venv
source .venv/bin/activate

# Windows (PowerShell)
py -m venv .venv
.venv\\Scripts\\Activate.ps1

# Pakete installieren – landen nur in .venv
python -m pip install -r requirements.txt

deactivate
`),
    exampleLang: 'sh',
    tip: 'Läuft man in einer Umgebung? `python -c "import sys; print(sys.prefix)"` zeigt den aktiven Pfad.',
    keywords: ['venv', 'virtualenv', 'virtuelle umgebung', 'virtual environment', 'isoliert', 'activate', '.venv'],
    related: ['pip', 'requirements.txt', 'uv', 'Modulsuche & sys.path'],
    mdn: D + 'venv.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'requirements.txt',
    desc: 'Textdatei mit den Abhängigkeiten eines Projekts, eine Anforderung pro Zeile.',
    details: 'Mit `pip install -r requirements.txt` werden alle Pakete installiert. Für reproduzierbare Installationen pinnt man exakte Versionen (`paket==1.2.3`), etwa mit `pip freeze > requirements.txt` – dann stehen aber auch alle indirekten Abhängigkeiten drin. Für Bibliotheken und moderne Projekte gehören die Abhängigkeiten eher in `pyproject.toml`; `requirements.txt` dient dann als Lock-Datei.',
    example: e(`
# requirements.txt
#   requests>=2.32,<3
#   rich==13.9.4
#   pytest ; python_version >= "3.12"
#   -r requirements-dev.txt

# Aktuelle Umgebung festschreiben
python -m pip freeze > requirements.txt

# Auf einem anderen Rechner wiederherstellen
python -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
`),
    exampleLang: 'sh',
    tip: 'Bei `pip freeze` vorher sicherstellen, dass die richtige (virtuelle) Umgebung aktiv ist – sonst landet die ganze System-Installation in der Datei.',
    keywords: ['requirements', 'abhängigkeiten', 'dependencies', 'pip freeze', 'pinnen', 'versionen', 'lock'],
    related: ['pip', 'venv', 'pyproject.toml'],
    mdn: T + 'venv.html#managing-packages-with-pip'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'pyproject.toml',
    desc: 'Zentrale Konfigurationsdatei eines Python-Projekts: Metadaten, Abhängigkeiten, Werkzeuge.',
    details: 'Der Abschnitt `[project]` (PEP 621) beschreibt Name, Version, benötigte Python-Version und Abhängigkeiten; `[build-system]` legt das Build-Backend fest. Unter `[project.scripts]` definiert man Kommandozeilenbefehle, die bei der Installation entstehen. Viele Werkzeuge wie pytest, Ruff, Black und mypy lesen ihre Einstellungen aus `[tool.…]`-Abschnitten derselben Datei. Seit Python 3.11 kann man TOML mit `tomllib` einlesen.',
    example: e(`
[project]
name = "rechnungen"
version = "0.3.0"
requires-python = ">=3.12"
dependencies = [
    "httpx>=0.27",
    "rich",
]

[project.optional-dependencies]
dev = ["pytest", "ruff"]

[project.scripts]
rechnungen = "rechnungen.cli:main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 100
`),
    exampleLang: 'toml',
    tip: 'Mit `pip install -e ".[dev]"` installiert man das eigene Projekt editierbar samt Entwickler-Abhängigkeiten.',
    keywords: ['pyproject', 'toml', 'projektkonfiguration', 'pep 621', 'build', 'packaging', 'metadaten', 'setup.py'],
    related: ['pip', 'uv', 'Ruff & Black', 'tomllib'],
    mdn: 'https://docs.python.org/3/distributing/index.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'uv',
    desc: 'Sehr schneller Paket- und Projektmanager (Drittanbieter) – ersetzt pip, venv und pyenv.',
    details: '`uv` ist in Rust geschrieben und installiert Pakete deutlich schneller als pip. Es verwaltet Python-Versionen, virtuelle Umgebungen, Abhängigkeiten in `pyproject.toml` und eine Lock-Datei `uv.lock`. `uv run` führt Befehle automatisch in der passenden Umgebung aus. Für bestehende Workflows gibt es die kompatible Schnittstelle `uv pip …`.',
    values: [
      ['uv init', 'Neues Projekt mit pyproject.toml'],
      ['uv add paket', 'Abhängigkeit hinzufügen und installieren'],
      ['uv sync', 'Umgebung an Lock-Datei angleichen'],
      ['uv run befehl', 'Befehl in der Projektumgebung ausführen'],
      ['uv python install 3.14', 'Python-Version installieren'],
      ['uvx werkzeug', 'Werkzeug einmalig ausführen (wie pipx)']
    ],
    example: e(`
# Neues Projekt anlegen
uv init rechnungen
cd rechnungen

# Abhängigkeiten hinzufügen (inkl. Lock-Datei)
uv add httpx rich
uv add --dev pytest ruff

# Code und Tests in der Projektumgebung ausführen
uv run python main.py
uv run pytest

# Werkzeug ohne Installation starten
uvx ruff check .
`),
    exampleLang: 'sh',
    tip: '`uv.lock` ins Repository einchecken – so bekommen alle Entwickler und die CI exakt dieselben Versionen.',
    keywords: ['uv', 'astral', 'paketmanager', 'schnell', 'lockfile', 'uv.lock', 'pip alternative', 'poetry'],
    related: ['pip', 'venv', 'pyproject.toml'],
    mdn: T + 'venv.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'pytest',
    desc: 'Beliebtestes Test-Framework (Drittanbieter): Tests sind einfache Funktionen mit assert.',
    details: 'pytest findet automatisch Dateien `test_*.py` und darin Funktionen `test_*`. Statt spezieller Methoden genügt ein normales `assert`; bei Fehlschlägen zeigt pytest die beteiligten Werte detailliert an. `pytest.raises` prüft erwartete Ausnahmen, `@pytest.mark.parametrize` führt einen Test mit mehreren Datensätzen aus. Installation mit `pip install pytest`.',
    values: [
      ['pytest', 'Alle Tests ausführen'],
      ['pytest -k name', 'Nur Tests, deren Name passt'],
      ['pytest -x', 'Beim ersten Fehler stoppen'],
      ['pytest -v / -q', 'Ausführlich / knapp'],
      ['pytest --lf', 'Nur zuletzt fehlgeschlagene Tests'],
      ['pytest --pdb', 'Bei Fehler in den Debugger']
    ],
    example: e(`
# Datei test_preise.py
import pytest

def brutto(netto, satz=0.19):
    if netto < 0:
        raise ValueError("netto negativ")
    return round(netto * (1 + satz), 2)

def test_brutto():
    assert brutto(100) == 119.0

@pytest.mark.parametrize("netto, erwartet", [(0, 0), (10, 11.9), (2.5, 2.98)])
def test_brutto_werte(netto, erwartet):
    assert brutto(netto) == erwartet

def test_negativ():
    with pytest.raises(ValueError, match="negativ"):
        brutto(-1)

# Aufruf: pytest -v
`),
    nocheck: true,
    tip: 'Gleitkommazahlen mit `pytest.approx` vergleichen: `assert 0.1 + 0.2 == pytest.approx(0.3)`.',
    keywords: ['pytest', 'test', 'unit test', 'testen', 'assert', 'parametrize', 'raises', 'testframework'],
    related: ['pytest-Fixtures', 'unittest', 'assert', 'doctest'],
    mdn: D + 'development.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'pytest-Fixtures',
    desc: 'Wiederverwendbare Testvorbereitung, die pytest per Parametername in Tests injiziert.',
    details: 'Eine mit `@pytest.fixture` dekorierte Funktion liefert Testdaten oder Ressourcen; Tests fordern sie einfach über einen gleichnamigen Parameter an. Code nach einem `yield` in der Fixture dient als Aufräumschritt. Eingebaute Fixtures sind z. B. `tmp_path` (temporäres Verzeichnis), `capsys` (Ausgabe abfangen) und `monkeypatch` (Attribute und Umgebungsvariablen ersetzen). Gemeinsame Fixtures legt man in `conftest.py` ab.',
    values: [
      ['tmp_path', 'Temporäres Verzeichnis als Path'],
      ['capsys', 'stdout/stderr abfangen'],
      ['monkeypatch', 'Attribute, dict-Einträge, Umgebung ersetzen'],
      ['scope="module"', 'Fixture nur einmal pro Modul erzeugen'],
      ['conftest.py', 'Fixtures für mehrere Testdateien']
    ],
    example: e(`
# Datei test_lager.py
import json
import pytest

@pytest.fixture
def lager_datei(tmp_path):
    pfad = tmp_path / "lager.json"
    pfad.write_text(json.dumps({"Tee": 3}), encoding="utf-8")
    yield pfad
    # hier könnte aufgeräumt werden

def test_lesen(lager_datei):
    daten = json.loads(lager_datei.read_text(encoding="utf-8"))
    assert daten["Tee"] == 3

def test_ausgabe(capsys):
    print("Hallo")
    assert capsys.readouterr().out == "Hallo\\n"
`),
    nocheck: true,
    tip: 'Fixtures dürfen andere Fixtures anfordern – so baut man komplexe Testumgebungen aus kleinen Bausteinen.',
    keywords: ['fixture', 'pytest fixture', 'tmp_path', 'capsys', 'monkeypatch', 'conftest', 'setup', 'teardown'],
    related: ['pytest', 'unittest.mock', 'tempfile'],
    mdn: D + 'development.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'unittest',
    desc: 'Eingebautes Test-Framework im xUnit-Stil mit Testklassen und assert-Methoden.',
    details: 'Tests sind Methoden `test_*` in Klassen, die von `unittest.TestCase` erben. Statt `assert` nutzt man Methoden wie `assertEqual`, `assertIn` oder `assertRaises`, die aussagekräftige Fehlermeldungen liefern. `setUp()` und `tearDown()` laufen vor bzw. nach jedem Test. Gestartet wird mit `python -m unittest` (sucht automatisch `test*.py`); pytest kann unittest-Tests ebenfalls ausführen.',
    values: [
      ['assertEqual(a, b)', 'a == b'],
      ['assertTrue(x) / assertFalse(x)', 'Wahrheitswert prüfen'],
      ['assertIn(a, b)', 'a in b'],
      ['assertRaises(Typ)', 'Erwartete Ausnahme (als Context Manager)'],
      ['assertAlmostEqual(a, b)', 'Gleitkomma-Vergleich'],
      ['setUp() / tearDown()', 'Vor/nach jedem Test'],
      ['@unittest.skip("Grund")', 'Test überspringen']
    ],
    example: e(`
import io
import unittest

def teilen(a, b):
    if b == 0:
        raise ZeroDivisionError("b ist 0")
    return a / b

class TestTeilen(unittest.TestCase):
    def test_normal(self):
        self.assertEqual(teilen(10, 4), 2.5)

    def test_null(self):
        with self.assertRaises(ZeroDivisionError):
            teilen(1, 0)

# Normalerweise: unittest.main() bzw. python -m unittest -v
suite = unittest.TestLoader().loadTestsFromTestCase(TestTeilen)
ergebnis = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
print(ergebnis.testsRun, ergebnis.wasSuccessful())   # 2 True
`),
    tip: 'Bei neuen Projekten ist pytest meist angenehmer; unittest lohnt sich, wenn keine Fremdpakete erlaubt sind.',
    keywords: ['unittest', 'testcase', 'unit test', 'assertequal', 'xunit', 'setup', 'teardown', 'testen'],
    related: ['pytest', 'unittest.mock', 'doctest', 'assert'],
    mdn: D + 'unittest.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'unittest.mock',
    desc: 'Ersetzt Objekte in Tests durch Attrappen und prüft, wie sie aufgerufen wurden.',
    details: '`Mock()` und `MagicMock()` akzeptieren jeden Aufruf und jedes Attribut und merken sich alles; `return_value` und `side_effect` steuern das Verhalten. `patch("modul.name")` ersetzt ein Objekt vorübergehend – wichtig ist, es dort zu patchen, wo es nachgeschlagen wird, nicht wo es definiert ist. Mit `autospec=True` hält sich die Attrappe an die echte Signatur und fängt Tippfehler ab.',
    values: [
      ['Mock(return_value=x)', 'Aufruf liefert x'],
      ['side_effect=Fehler / [werte]', 'Ausnahme werfen / nacheinander liefern'],
      ['assert_called_once_with(...)', 'Genau ein Aufruf mit diesen Argumenten'],
      ['call_count / call_args', 'Anzahl / letzte Argumente'],
      ['patch("modul.name")', 'Objekt vorübergehend ersetzen'],
      ['patch.object(obj, "attr")', 'Attribut eines Objekts ersetzen']
    ],
    example: e(`
from unittest.mock import Mock, patch
import time

def zeitstempel():
    return f"Stand: {time.time():.0f}"

with patch("time.time", return_value=1_700_000_000):
    print(zeitstempel())               # Stand: 1700000000

versand = Mock()
versand.senden.return_value = "OK"
print(versand.senden("ada@example.org", betreff="Hallo"))   # OK
versand.senden.assert_called_once_with("ada@example.org", betreff="Hallo")
print(versand.senden.call_count)       # 1

fehlerhaft = Mock(side_effect=ConnectionError("offline"))
try:
    fehlerhaft()
except ConnectionError as e:
    print(e)                           # offline
`),
    tip: 'Zu viel Mocking testet nur noch die Attrappen – externe Grenzen (Netzwerk, Zeit, Zufall) mocken, eigene Logik echt testen.',
    keywords: ['mock', 'patch', 'magicmock', 'attrappe', 'stub', 'test double', 'side_effect', 'mocking'],
    related: ['unittest', 'pytest-Fixtures', 'pytest'],
    mdn: D + 'unittest.mock.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'doctest',
    desc: 'Führt Beispiele aus Docstrings aus und prüft, ob die Ausgabe stimmt.',
    details: 'Zeilen mit `>>>` im Docstring werden wie im REPL ausgeführt, die Zeile darunter ist die erwartete Ausgabe. So bleibt die Dokumentation garantiert aktuell. Ausgaben müssen exakt übereinstimmen – bei Dicts, Gleitkommazahlen oder Speicheradressen kann das knifflig sein. Gestartet wird mit `python -m doctest datei.py -v` oder `doctest.testmod()`.',
    syntax: 'def f():\n    """\n    >>> f()\n    erwartete Ausgabe\n    """',
    example: e(`
import doctest

def initialen(name):
    """Liefert die Initialen eines Namens.

    >>> initialen("Ada Lovelace")
    'A. L.'
    >>> initialen("guido van rossum")
    'G. V. R.'
    """
    return " ".join(teil[0].upper() + "." for teil in name.split())

ergebnis = doctest.testmod()
print(ergebnis)       # TestResults(failed=0, attempted=2)
`),
    tip: 'pytest führt Doctests mit `pytest --doctest-modules` gleich mit aus.',
    keywords: ['doctest', 'docstring test', 'dokumentation testen', '>>>', 'beispiele prüfen'],
    related: ['Docstrings', 'unittest', 'pytest'],
    mdn: D + 'doctest.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'timeit',
    desc: 'Misst die Laufzeit kleiner Code-Schnipsel zuverlässig über viele Wiederholungen.',
    details: '`timeit.timeit(code, number=n)` führt den Code `n`-mal aus und gibt die Gesamtzeit in Sekunden zurück; der Garbage Collector ist dabei abgeschaltet. `repeat()` wiederholt die Messung mehrmals – maßgeblich ist das Minimum, weil Ausreißer von anderen Prozessen stammen. Auf der Kommandozeile wählt `python -m timeit` die Anzahl automatisch. Im REPL von IPython/Jupyter gibt es `%timeit`.',
    syntax: 'timeit.timeit(stmt, setup="pass", number=1000000, globals=None)\npython -m timeit "ausdruck"',
    example: e(`
import timeit

daten = list(range(1000))

t_list = timeit.timeit("[x * 2 for x in daten]", globals=globals(), number=2000)
t_map = timeit.timeit("list(map(lambda x: x * 2, daten))", globals=globals(), number=2000)
print(f"Comprehension: {t_list:.4f} s")   # z. B. Comprehension: 0.0590 s
print(f"map + lambda:  {t_map:.4f} s")    # z. B. map + lambda:  0.0950 s

beste = min(timeit.repeat("sum(daten)", globals=globals(), number=1000, repeat=3))
print(beste > 0)                          # True
`),
    tip: 'Auf der Kommandozeile: `python -m timeit -s "xs = list(range(1000))" "sum(xs)"` – `-s` ist der Setup-Code, der nicht mitgemessen wird.',
    keywords: ['timeit', 'laufzeit messen', 'benchmark', 'performance', 'zeitmessung', 'mikrobenchmark'],
    related: ['cProfile', 'time', 'tracemalloc'],
    mdn: D + 'timeit.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'cProfile',
    desc: 'Profiler: zeigt, wie oft jede Funktion aufgerufen wird und wie viel Zeit sie braucht.',
    details: '`python -m cProfile -s cumtime skript.py` profiliert ein ganzes Programm und sortiert nach kumulierter Zeit. Im Code nutzt man `cProfile.Profile()` als Context Manager und wertet mit `pstats` aus. `tottime` ist die Zeit in der Funktion selbst, `cumtime` inklusive aller aufgerufenen Funktionen. Erst profilieren, dann optimieren – die Engstelle liegt selten dort, wo man sie vermutet.',
    values: [
      ['ncalls', 'Anzahl Aufrufe'],
      ['tottime', 'Zeit nur in dieser Funktion'],
      ['cumtime', 'Zeit inklusive Unteraufrufe'],
      ['-s cumtime', 'Sortierung auf der Kommandozeile'],
      ['-o datei.prof', 'Ergebnis für Visualisierer speichern (z. B. snakeviz)']
    ],
    example: e(`
import cProfile
import pstats

def langsam():
    return sum(i * i for i in range(200_000))

def schnell():
    return sum(range(1000))

def programm():
    for _ in range(3):
        langsam()
    schnell()

with cProfile.Profile() as profil:
    programm()

stats = pstats.Stats(profil).sort_stats("cumulative")
eintraege = {f[2]: d[0] for f, d in stats.stats.items()}   # Funktionsname -> Aufrufe
print(eintraege["langsam"], eintraege["schnell"])          # 3 1
stats.print_stats(4)    # Tabelle mit ncalls, tottime, cumtime … (Zeiten variieren)
`),
    tip: 'Für einen schnellen Überblick genügt `python -m cProfile -s cumtime main.py | head -20`.',
    keywords: ['cprofile', 'profiler', 'profiling', 'pstats', 'performance', 'engpass', 'bottleneck', 'laufzeitanalyse'],
    related: ['timeit', 'tracemalloc', 'breakpoint() & pdb'],
    mdn: D + 'profile.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'tracemalloc',
    desc: 'Verfolgt Speicherzuweisungen und zeigt, welche Codezeilen am meisten Speicher belegen.',
    details: 'Nach `tracemalloc.start()` zeichnet Python jede Speicherzuweisung mit Herkunft auf. `get_traced_memory()` liefert aktuellen und Spitzenverbrauch in Bytes, `take_snapshot()` einen Schnappschuss, den man nach Zeilen gruppiert oder mit einem früheren vergleicht. Das Tracing verlangsamt das Programm spürbar und gehört daher nicht in den Produktivbetrieb.',
    values: [
      ['start() / stop()', 'Aufzeichnung starten / beenden'],
      ['get_traced_memory()', '(aktuell, Spitze) in Bytes'],
      ['take_snapshot()', 'Schnappschuss aller Zuweisungen'],
      ['snapshot.statistics("lineno")', 'Nach Codezeile gruppieren'],
      ['snapshot.compare_to(alt, "lineno")', 'Differenz zweier Schnappschüsse']
    ],
    example: e(`
import tracemalloc

tracemalloc.start()

liste = [str(i) * 10 for i in range(50_000)]
aktuell, spitze = tracemalloc.get_traced_memory()
print(f"aktuell: {aktuell / 1e6:.1f} MB")   # z. B. aktuell: 3.6 MB
print(spitze >= aktuell)                    # True

snapshot = tracemalloc.take_snapshot()
top = snapshot.statistics("lineno")[0]
print(top.traceback[0].lineno)              # 5 – die Zeile mit der Liste
tracemalloc.stop()
`),
    tip: 'Speicherlecks findet man, indem man zwei Schnappschüsse mit `compare_to()` vergleicht und auf wachsende Zeilen achtet.',
    keywords: ['tracemalloc', 'speicher', 'memory', 'speicherleck', 'memory leak', 'speicherverbrauch', 'profiling'],
    related: ['cProfile', 'timeit', 'Entwicklungsmodus (-X dev)'],
    mdn: D + 'tracemalloc.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'breakpoint() & pdb',
    desc: 'breakpoint() hält das Programm an und öffnet den Debugger pdb an dieser Stelle.',
    details: 'Im Debugger kann man Variablen ansehen, Ausdrücke auswerten und Schritt für Schritt weiterlaufen. `breakpoint()` ruft standardmäßig `pdb.set_trace()` auf; mit der Umgebungsvariable `PYTHONBREAKPOINT=0` werden alle Haltepunkte ignoriert. `python -m pdb skript.py` startet ein Skript direkt im Debugger und springt nach einem Absturz an die Fehlerstelle (Post-Mortem). Seit Python 3.14 kann sich pdb mit `-p PID` an laufende Prozesse anhängen.',
    values: [
      ['n (next)', 'Nächste Zeile, Funktionsaufrufe überspringen'],
      ['s (step)', 'In Funktionsaufruf hineinspringen'],
      ['c (continue)', 'Bis zum nächsten Haltepunkt weiterlaufen'],
      ['p ausdruck / pp', 'Wert ausgeben / formatiert ausgeben'],
      ['l / ll', 'Quelltext um die aktuelle Zeile / ganze Funktion'],
      ['w (where)', 'Aufrufstapel anzeigen'],
      ['b zeile', 'Haltepunkt setzen'],
      ['q (quit)', 'Debugger beenden']
    ],
    example: e(`
def rabatt(preis, prozent):
    faktor = 1 - prozent / 100
    breakpoint()            # hier hält das Programm an
    return preis * faktor

print(rabatt(80, 25))

# (Pdb) p faktor
# 0.75
# (Pdb) p preis * faktor
# 60.0
# (Pdb) c
# 60.0
`),
    nocheck: true,
    tip: 'Haltepunkte vor dem Commit entfernen – oder in der CI `PYTHONBREAKPOINT=0` setzen, damit nichts hängen bleibt.',
    keywords: ['debugger', 'pdb', 'breakpoint', 'debuggen', 'haltepunkt', 'set_trace', 'post mortem', 'step'],
    related: ['traceback', 'cProfile', 'python (Interpreter & REPL)'],
    mdn: D + 'pdb.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'Ruff & Black',
    desc: 'Linter und Formatierer (Drittanbieter): einheitlicher Stil und Fehlerfunde ohne Handarbeit.',
    details: 'Black formatiert Code automatisch in einem festen, kaum konfigurierbaren Stil – Diskussionen über Formatierung entfallen. Ruff ist ein sehr schneller Linter in Rust, der Regeln von Flake8, isort, pyupgrade und vielen Plugins vereint, und bringt mit `ruff format` einen Black-kompatiblen Formatierer mit. Beide werden in `pyproject.toml` konfiguriert und laufen gut als Pre-Commit-Hook oder in der CI.',
    values: [
      ['ruff check .', 'Code prüfen'],
      ['ruff check --fix .', 'Automatisch behebbare Funde korrigieren'],
      ['ruff format .', 'Code formatieren (Black-kompatibel)'],
      ['black .', 'Mit Black formatieren'],
      ['black --check .', 'Nur prüfen, nichts ändern (CI)']
    ],
    example: e(`
# Installieren (in der Projektumgebung)
python -m pip install ruff black

# Prüfen und automatisch reparieren
ruff check --fix .

# Formatieren
ruff format .
# oder
black .

# In der CI: nur prüfen
ruff check . && ruff format --check .
`),
    exampleLang: 'sh',
    tip: 'Ruff allein reicht meist: Er ersetzt Black, isort und Flake8 und ist um ein Vielfaches schneller.',
    keywords: ['ruff', 'black', 'linter', 'formatter', 'formatierung', 'pep 8', 'flake8', 'isort', 'code style'],
    related: ['PEP 8', 'pyproject.toml', 'Type Checker'],
    mdn: 'https://docs.python.org/3/library/development.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'Type Checker',
    desc: 'Werkzeuge wie mypy und pyright prüfen Typ-Annotationen statisch, ohne den Code auszuführen.',
    details: 'Python selbst ignoriert Typ-Hinweise zur Laufzeit; erst ein Type Checker meldet etwa `None`-Zugriffe oder falsche Argumenttypen. mypy ist der Klassiker, pyright (Grundlage von Pylance in VS Code) ist schneller und strenger; neuere Alternativen sind `ty` und `pyrefly`. Man beginnt mit lockeren Einstellungen und schaltet schrittweise strengere Prüfungen (`--strict`) ein.',
    values: [
      ['mypy .', 'Projekt mit mypy prüfen'],
      ['mypy --strict', 'Alle strengen Prüfungen'],
      ['pyright', 'Projekt mit pyright prüfen'],
      ['reveal_type(x)', 'Vom Checker erkannten Typ anzeigen'],
      ['# type: ignore', 'Einzelne Zeile ausnehmen']
    ],
    example: e(`
# Installieren
python -m pip install mypy pyright

# Prüfen
mypy src/
pyright src/

# Typische Meldung:
# src/kasse.py:12: error: Item "None" of "str | None" has no attribute "upper"  [union-attr]

# Konfiguration in pyproject.toml:
# [tool.mypy]
# strict = true
`),
    exampleLang: 'sh',
    tip: 'Den Type Checker in der CI laufen lassen – Typfehler fallen so schon vor dem Merge auf.',
    keywords: ['type checker', 'mypy', 'pyright', 'pylance', 'statische analyse', 'typprüfung', 'static typing', 'ty'],
    related: ['mypy', 'Typ-Annotationen', 'Ruff & Black'],
    mdn: D + 'typing.html'
  },
  {
    lang: 'py', group: 'Werkzeuge & Umgebung', name: 'Entwicklungsmodus (-X dev)',
    desc: 'Startoption mit zusätzlichen Laufzeitprüfungen und sichtbaren Warnungen für die Entwicklung.',
    details: 'Mit `python -X dev` (oder `PYTHONDEVMODE=1`) zeigt Python alle Warnungen inklusive `DeprecationWarning` und `ResourceWarning` (z. B. nicht geschlossene Dateien), aktiviert den asyncio-Debugmodus und zusätzliche Speicherprüfungen. Bei Abstürzen gibt `faulthandler` einen Traceback aus. Das Programm läuft etwas langsamer, verhält sich aber sonst gleich.',
    values: [
      ['-X dev', 'Entwicklungsmodus'],
      ['-W error', 'Warnungen als Ausnahmen behandeln'],
      ['-X importtime', 'Importdauer jedes Moduls messen'],
      ['-X tracemalloc', 'Speicherverfolgung ab Start'],
      ['-X utf8', 'UTF-8-Modus für Dateien und Konsole'],
      ['-I', 'Isoliert: ohne Umgebungsvariablen und Skriptpfad']
    ],
    example: e(`
# Mit allen Warnungen und Zusatzprüfungen starten
python -X dev app.py

# Beispielausgabe bei vergessener close():
# app.py:3: ResourceWarning: unclosed file <_io.TextIOWrapper name='log.txt' ...>

# Warnungen in Fehler umwandeln (z. B. in Tests)
python -W error -m pytest

# Welche Importe bremsen den Start?
python -X importtime -c "import json" 2> importzeiten.txt
`),
    exampleLang: 'sh',
    tip: 'In der CI Tests mit `-X dev` laufen lassen: Nicht geschlossene Ressourcen und veraltete APIs fallen so früh auf.',
    keywords: ['dev mode', 'entwicklungsmodus', '-X dev', 'pythondevmode', 'resourcewarning', 'kommandozeilenoptionen', 'faulthandler'],
    related: ['warnings', 'tracemalloc', 'python (Interpreter & REPL)'],
    mdn: D + 'devmode.html'
  }
  );
})();
