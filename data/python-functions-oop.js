window.CHEAT = window.CHEAT || [];
(function () {
  var D = 'https://docs.python.org/3/library/';   // + z. B. 'functools.html#functools.wraps'
  var R = 'https://docs.python.org/3/reference/'; // Sprachreferenz
  var T = 'https://docs.python.org/3/tutorial/';  // Tutorial
  var H = 'https://docs.python.org/3/howto/';     // HOWTOs
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Funktionen ----------------
  {
    lang: 'py', group: 'Funktionen', name: 'def',
    desc: "Definiert eine Funktion mit Namen, Parametern und eingerücktem Rumpf.",
    details: "`def` erzeugt zur Laufzeit ein Funktionsobjekt und bindet es an den Namen. Ein String direkt als erste Anweisung im Rumpf wird zum Docstring (`__doc__`). Ohne `return` gibt eine Funktion `None` zurück. Funktionen müssen definiert sein, bevor sie aufgerufen werden; innerhalb anderer Funktionen darf man sie aber vorab referenzieren.",
    syntax: "def name(param1, param2=standard, *args, **kwargs):\n    \"\"\"Docstring\"\"\"\n    ...\n    return wert",
    example: e(`
def begruessung(name, gruss="Hallo"):
    """Gibt eine Begrüßung zurück."""
    return f"{gruss}, {name}!"

print(begruessung("Ada"))          # Hallo, Ada!
print(begruessung("Bob", "Moin"))  # Moin, Bob!
print(begruessung.__doc__)         # Gibt eine Begrüßung zurück.

def nichts():
    pass                           # leerer Rumpf braucht pass

print(nichts())                    # None
`),
    tip: "Funktionsnamen schreibt man nach PEP 8 in snake_case und als Verb: `lade_daten()`, nicht `LadeDaten()`.",
    keywords: ['funktion', 'function', 'definieren', 'define', 'methode', 'unterprogramm', 'docstring'],
    related: ['return', 'Standardwerte', 'lambda', 'Docstrings'],
    mdn: R + 'compound_stmts.html#function-definitions'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'return',
    desc: "Beendet die Funktion und gibt einen Wert (oder mehrere als Tupel) zurück.",
    details: "`return` ohne Wert und das Ende des Rumpfs liefern beide `None`. Mehrere durch Komma getrennte Werte werden zu einem Tupel, das der Aufrufer direkt entpacken kann. Code nach einem `return` im selben Block wird nie ausgeführt. In Generatoren beendet `return` die Iteration.",
    syntax: "return\nreturn ausdruck\nreturn a, b",
    example: e(`
def min_max(werte):
    if not werte:
        return None                 # früher Ausstieg
    return min(werte), max(werte)   # Tupel

print(min_max([3, 1, 4]))   # (1, 4)
print(min_max([]))          # None
klein, gross = min_max([7, 2, 9])
print(klein, gross)         # 2 9

def ohne_return():
    x = 1

print(ohne_return())        # None
`),
    tip: "Häufiger Fehler: `print()` statt `return` in der Funktion. Dann sieht man zwar eine Ausgabe, der Aufrufer bekommt aber `None`.",
    keywords: ['rückgabe', 'rückgabewert', 'return value', 'zurückgeben', 'none', 'mehrere werte'],
    related: ['def', 'Entpacken', 'yield'],
    mdn: R + 'simple_stmts.html#the-return-statement'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'Standardwerte',
    desc: "Parameter mit Vorgabewert, die beim Aufruf weggelassen werden dürfen.",
    details: "Ein Parameter mit `=wert` ist optional. Parameter mit Standardwert müssen hinter denen ohne stehen, sonst gibt es einen `SyntaxError`. Der Standardwert wird genau einmal ausgewertet, nämlich wenn `def` ausgeführt wird, nicht bei jedem Aufruf.",
    syntax: "def f(pflicht, optional=standard): ...",
    example: e(`
def verbinden(host, port=5432, timeout=10.0):
    return f"{host}:{port} (Timeout {timeout}s)"

print(verbinden("db"))               # db:5432 (Timeout 10.0s)
print(verbinden("db", 6543))         # db:6543 (Timeout 10.0s)
print(verbinden("db", timeout=2.5))  # db:5432 (Timeout 2.5s)
print(verbinden.__defaults__)        # (5432, 10.0)
`),
    tip: "Optionale Parameter beim Aufruf per Name übergeben (`timeout=2.5`), dann muss man die davorliegenden nicht mitschreiben.",
    keywords: ['default', 'defaultwert', 'optionaler parameter', 'vorgabewert', 'default argument'],
    related: ['Veränderliche Standardwerte (Fallstrick)', 'Schlüsselwortargumente', 'def'],
    mdn: T + 'controlflow.html#default-argument-values'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'Veränderliche Standardwerte (Fallstrick)',
    desc: "Eine Liste oder ein Dict als Standardwert wird von allen Aufrufen geteilt.",
    details: "Da Standardwerte nur einmal bei der Definition erzeugt werden, verändert jeder Aufruf dasselbe Objekt, wenn es veränderlich ist (`list`, `dict`, `set`). Die übliche Lösung ist `None` als Standardwert und das Objekt im Rumpf neu anzulegen. Linter wie Ruff (Regel B006) warnen davor.",
    syntax: "def f(x, liste=None):\n    if liste is None:\n        liste = []",
    example: e(`
def anhaengen_falsch(x, liste=[]):
    liste.append(x)
    return liste

print(anhaengen_falsch(1))  # [1]
print(anhaengen_falsch(2))  # [1, 2]  – dieselbe Liste!

def anhaengen(x, liste=None):
    if liste is None:
        liste = []          # bei jedem Aufruf neu
    liste.append(x)
    return liste

print(anhaengen(1))  # [1]
print(anhaengen(2))  # [2]
`),
    tip: "Dasselbe Problem gibt es bei Klassenattributen und bei Dataclasses; dort hilft `field(default_factory=list)`.",
    keywords: ['mutable default', 'fallstrick', 'pitfall', 'gotcha', 'liste als default', 'none default', 'b006'],
    related: ['Standardwerte', 'Veränderlich & unveränderlich', 'dataclasses.field()'],
    mdn: T + 'controlflow.html#default-argument-values'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'Schlüsselwortargumente',
    desc: "Argumente per Name übergeben: f(menge=3) statt nur über die Position.",
    details: "Schlüsselwortargumente machen Aufrufe lesbarer und unabhängig von der Reihenfolge. Positionsargumente müssen vor Schlüsselwortargumenten stehen. Wird ein Parameter sowohl über die Position als auch per Name belegt, gibt es einen `TypeError`.",
    syntax: "f(wert1, name=wert2)",
    example: e(`
def bestellung(artikel, menge=1, express=False):
    text = f"{menge}x {artikel}"
    return text + " (Express)" if express else text

print(bestellung("Kaffee", express=True))   # 1x Kaffee (Express)
print(bestellung(menge=3, artikel="Tee"))   # 3x Tee

try:
    bestellung("Tee", artikel="Kaffee")
except TypeError as e:
    print(e)  # bestellung() got multiple values for argument 'artikel'
`),
    tip: "Boolesche Schalter immer per Name übergeben: `speichern(daten, True)` ist unklar, `speichern(daten, ueberschreiben=True)` nicht. Mit `*` in der Signatur lässt sich das erzwingen.",
    keywords: ['keyword argument', 'kwarg', 'benannte argumente', 'named arguments', 'parametername'],
    related: ['Nur-Positions- & Nur-Keyword-Parameter', '**kwargs', 'Standardwerte'],
    mdn: T + 'controlflow.html#keyword-arguments'
  },
  {
    lang: 'py', group: 'Funktionen', name: '*args',
    desc: "Sammelt beliebig viele Positionsargumente in einem Tupel.",
    details: "Der Name `args` ist nur Konvention, entscheidend ist der Stern. Innerhalb der Funktion ist `args` ein Tupel, eventuell leer. Parameter nach `*args` können nur noch per Name übergeben werden.",
    syntax: "def f(*args): ...\ndef f(erster, *rest, option=...): ...",
    example: e(`
def summe(*zahlen):
    return sum(zahlen)              # zahlen ist ein Tupel

print(summe())           # 0
print(summe(1, 2, 3))    # 6

def log(stufe, *teile, sep=" "):    # sep nur per Name möglich
    print(f"[{stufe}]", sep.join(str(t) for t in teile))

log("INFO", "Start", 42, True)      # [INFO] Start 42 True
log("WARN", "a", "b", sep="-")      # [WARN] a-b
`),
    tip: "Eine vorhandene Liste übergibt man mit `summe(*liste)`, nicht mit `summe(liste)`, sonst landet die ganze Liste als ein Element im Tupel.",
    keywords: ['variable argumente', 'varargs', 'beliebig viele argumente', 'stern', 'star args', 'tupel'],
    related: ['**kwargs', 'Argumente entpacken', 'Stern-Entpacken'],
    mdn: T + 'controlflow.html#arbitrary-argument-lists'
  },
  {
    lang: 'py', group: 'Funktionen', name: '**kwargs',
    desc: "Sammelt beliebig viele Schlüsselwortargumente in einem Dictionary.",
    details: "`kwargs` ist ein normales `dict` mit den Namen als Schlüssel, in der Reihenfolge des Aufrufs. Es muss der letzte Parameter sein. Typisch ist die Kombination `*args, **kwargs`, um Argumente unverändert an eine andere Funktion weiterzureichen, etwa in Dekoratoren.",
    syntax: "def f(**kwargs): ...\ndef f(*args, **kwargs): ...",
    example: e(`
def html_tag(name, **attribute):
    attrs = "".join(f' {k}="{v}"' for k, v in attribute.items())
    return f"<{name}{attrs}>"

print(html_tag("img", src="logo.png", alt="Logo"))  # <img src="logo.png" alt="Logo">

def alles(*args, **kwargs):
    print(args, kwargs)

alles(1, 2, x=3, y=4)   # (1, 2) {'x': 3, 'y': 4}
`),
    tip: "Schlüsselwörter wie `class` sind als Name nicht erlaubt; man nimmt `class_` oder übergibt ein Dict: `html_tag(\"p\", **{\"class\": \"info\"})`.",
    keywords: ['keyword arguments', 'kwargs', 'doppelstern', 'double star', 'dict', 'beliebige schlüsselwörter'],
    related: ['*args', 'Argumente entpacken', 'Schlüsselwortargumente'],
    mdn: T + 'controlflow.html#keyword-arguments'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'Nur-Positions- & Nur-Keyword-Parameter',
    desc: "Mit / und * in der Signatur festlegen, wie Parameter übergeben werden dürfen.",
    details: "Alle Parameter vor `/` dürfen nur über die Position übergeben werden, alle nach `*` nur per Name. So bleiben interne Parameternamen änderbar, und Optionen müssen lesbar benannt werden. Viele eingebaute Funktionen nutzen `/`, z. B. `len(obj, /)`.",
    syntax: "def f(nur_pos, /, normal, *, nur_kw): ...",
    values: [
      ["a, /", "a nur per Position"],
      ["*, b", "b nur per Schlüsselwort"],
      ["*args, b", "b nach *args ebenfalls nur per Schlüsselwort"]
    ],
    example: e(`
def teile(a, b, /, *, runden=False):
    ergebnis = a / b
    return round(ergebnis) if runden else ergebnis

print(teile(7, 2))               # 3.5
print(teile(7, 2, runden=True))  # 4

try:
    teile(a=7, b=2)
except TypeError as e:
    print(e)  # teile() got some positional-only arguments passed as keyword arguments: 'a, b'

try:
    teile(7, 2, True)
except TypeError as e:
    print(e)  # teile() takes 2 positional arguments but 3 were given
`),
    tip: "`*` allein ist gut für boolesche Optionen: Ein Aufruf wie `teile(7, 2, True)` wird dadurch unmöglich.",
    keywords: ['positional only', 'keyword only', 'schrägstrich', 'slash', 'stern', 'signatur', 'pep 570', 'pep 3102'],
    related: ['Schlüsselwortargumente', '*args', 'def'],
    mdn: T + 'controlflow.html#special-parameters'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'Argumente entpacken',
    desc: "Liste mit * und Dictionary mit ** beim Aufruf in einzelne Argumente zerlegen.",
    details: "`f(*folge)` übergibt die Elemente einer beliebigen iterierbaren Folge als Positionsargumente, `f(**mapping)` die Einträge eines Dicts als Schlüsselwortargumente. Beides lässt sich kombinieren und mehrfach verwenden. Passt die Anzahl nicht zur Signatur, gibt es einen `TypeError`.",
    syntax: "f(*liste)\nf(**dictionary)\nf(*a, *b, **c)",
    example: e(`
def punkt(x, y, z=0):
    return f"({x}, {y}, {z})"

koordinaten = [1, 2, 3]
print(punkt(*koordinaten))        # (1, 2, 3)

optionen = {"y": 5, "x": 4}
print(punkt(**optionen))          # (4, 5, 0)

print(punkt(*[1], **{"y": 9}))    # (1, 9, 0)
print(*["a", "b", "c"], sep="|")  # a|b|c
`),
    tip: "Bei `**` müssen die Schlüssel Strings sein und zu den Parameternamen passen; unbekannte Schlüssel führen zu `TypeError: unexpected keyword argument`.",
    keywords: ['unpacking', 'entpacken', 'splat', 'spread', 'stern', 'argumentliste', 'dict als argumente'],
    related: ['*args', '**kwargs', 'Stern-Entpacken'],
    mdn: T + 'controlflow.html#unpacking-argument-lists'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'lambda',
    desc: "Anonyme Funktion aus genau einem Ausdruck, z. B. als key für sorted().",
    details: "`lambda parameter: ausdruck` erzeugt ein Funktionsobjekt, dessen Rückgabewert der Ausdruck ist. Anweisungen wie `if`-Blöcke, Zuweisungen oder `return` sind nicht erlaubt, ein bedingter Ausdruck schon. Für alles, was einen Namen bekommt oder mehr als eine Zeile braucht, ist `def` lesbarer.",
    syntax: "lambda x: ausdruck\nlambda x, y=0: ausdruck",
    example: e(`
personen = [("Ada", 36), ("Bob", 25), ("Cem", 31)]

print(sorted(personen, key=lambda p: p[1]))
# [('Bob', 25), ('Cem', 31), ('Ada', 36)]

print(list(map(lambda s: s.upper(), ["a", "b"])))   # ['A', 'B']
print(list(filter(lambda p: p[1] > 30, personen)))  # [('Ada', 36), ('Cem', 31)]

vorzeichen = lambda x: "+" if x >= 0 else "-"
print(vorzeichen(-3))   # -
`),
    tip: "PEP 8 rät von `name = lambda ...` ab; dann lieber `def`, weil Tracebacks sonst nur `<lambda>` zeigen. Statt `lambda p: p[1]` geht auch `operator.itemgetter(1)`.",
    keywords: ['anonyme funktion', 'anonymous function', 'lambda ausdruck', 'inline funktion', 'key funktion', 'pfeilfunktion'],
    related: ['sorted()', 'map()', 'Closures', 'def'],
    mdn: R + 'expressions.html#lambda'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'Closures',
    desc: "Innere Funktion, die Variablen der umgebenden Funktion auch danach noch kennt.",
    details: "Eine verschachtelte Funktion behält Zugriff auf die Variablen ihres Erzeugungsbereichs, selbst wenn die äußere Funktion längst zurückgekehrt ist. Lesen geht direkt, zum Neuzuweisen braucht man `nonlocal`. Die Variablen werden spät gebunden: Der Wert wird erst beim Aufruf nachgeschlagen, was in Schleifen überrascht.",
    syntax: "def aussen():\n    x = ...\n    def innen():\n        nonlocal x\n        ...\n    return innen",
    example: e(`
def zaehler(start=0):
    stand = start
    def weiter():
        nonlocal stand       # sonst UnboundLocalError
        stand += 1
        return stand
    return weiter

z = zaehler(10)
print(z(), z(), z())     # 11 12 13

# Fallstrick: späte Bindung in Schleifen
fs = [lambda: i for i in range(3)]
print([f() for f in fs])          # [2, 2, 2]
fs = [lambda i=i: i for i in range(3)]
print([f() for f in fs])          # [0, 1, 2]
`),
    tip: "Gegen späte Bindung hilft ein Standardwert (`lambda i=i: i`) oder `functools.partial()`.",
    keywords: ['closure', 'funktionsabschluss', 'verschachtelte funktion', 'nested function', 'späte bindung', 'late binding', 'scope'],
    related: ['nonlocal', 'Funktionen als Objekte', 'Dekorator', 'functools.partial()'],
    mdn: R + 'executionmodel.html#naming-and-binding'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'Funktionen als Objekte',
    desc: "Funktionen sind Werte: zuweisen, übergeben, zurückgeben und in Dicts ablegen.",
    details: "Ohne Klammern ist ein Funktionsname nur eine Referenz auf das Funktionsobjekt, mit Klammern wird es aufgerufen. Funktionen haben Attribute wie `__name__`, `__doc__` und `__defaults__` und können eigene Attribute bekommen. Funktionen, die Funktionen annehmen oder liefern, heißen Funktionen höherer Ordnung.",
    example: e(`
def verdoppeln(x):
    return x * 2

def anwenden(f, werte):
    return [f(w) for w in werte]

aktion = verdoppeln                 # ohne Klammern: keine Ausführung
print(anwenden(aktion, [1, 2, 3]))  # [2, 4, 6]
print(aktion.__name__)              # verdoppeln

befehle = {"hoch": str.upper, "runter": str.lower}
print(befehle["hoch"]("python"))    # PYTHON
print(callable(aktion))             # True
`),
    tip: "Ein Dict aus Funktionen ersetzt lange `if/elif`-Ketten für Befehle oder Rechenarten (Dispatch-Tabelle).",
    keywords: ['first class function', 'higher order function', 'funktion höherer ordnung', 'callback', 'funktionsreferenz', 'dispatch'],
    related: ['lambda', 'Closures', 'Dekorator', 'callable()'],
    mdn: R + 'datamodel.html#user-defined-functions'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'Rekursion',
    desc: "Eine Funktion ruft sich selbst auf, bis eine Abbruchbedingung erreicht ist.",
    details: "Jeder rekursive Aufruf belegt einen Stack-Frame; CPython bricht standardmäßig nach etwa 1000 Ebenen mit `RecursionError` ab. Python optimiert keine Endrekursion, tiefe Rekursion sollte man daher in eine Schleife umschreiben. Für Bäume und verschachtelte Strukturen ist Rekursion trotzdem oft die klarste Lösung.",
    example: e(`
import sys

def fakultaet(n):
    if n <= 1:                # Abbruchbedingung
        return 1
    return n * fakultaet(n - 1)

def flach(xs):
    for x in xs:
        if isinstance(x, list):
            yield from flach(x)
        else:
            yield x

print(fakultaet(5))                       # 120
print(list(flach([1, [2, [3, 4]], 5])))   # [1, 2, 3, 4, 5]
print(sys.getrecursionlimit())            # 1000 (Standard)

try:
    fakultaet(100_000)
except RecursionError:
    print("zu tief")                      # zu tief
`),
    tip: "Rekursive Funktionen mit wiederholten Teilproblemen (Fibonacci) mit `@functools.cache` beschleunigen. `sys.setrecursionlimit()` nur mit Vorsicht erhöhen.",
    keywords: ['rekursiv', 'recursion', 'selbstaufruf', 'recursionerror', 'abbruchbedingung', 'stack', 'base case'],
    related: ['@functools.cache', 'yield from', 'def'],
    mdn: D + 'sys.html#sys.setrecursionlimit'
  },
  {
    lang: 'py', group: 'Funktionen', name: 'Funktions-Annotationen',
    desc: "Typangaben für Parameter und Rückgabe einer Funktion: def f(x: int) -> str.",
    details: "Annotationen stehen hinter dem Parameter (`x: int`) und hinter `->` für den Rückgabewert. Python selbst prüft sie zur Laufzeit nicht, sie dienen Type Checkern, IDEs und Bibliotheken wie Dataclasses. Seit Python 3.14 werden Annotationen erst bei Bedarf ausgewertet (PEP 649); zum Auslesen dient dann `annotationlib.get_annotations()` oder `inspect.signature()`.",
    syntax: "def f(param: Typ, opt: Typ = standard) -> Rückgabetyp: ...",
    example: e(`
import inspect

def preis(netto: float, steuer: float = 0.19) -> float:
    return round(netto * (1 + steuer), 2)

print(preis(100))                  # 119.0
print(inspect.signature(preis))    # (netto: float, steuer: float = 0.19) -> float
print(preis.__annotations__["return"])  # <class 'float'>

# keine Prüfung zur Laufzeit: int statt float geht problemlos
print(preis(2, 1))                 # 4
`),
    tip: "Bei Standardwerten mit Annotation stehen Leerzeichen um das `=` (`steuer: float = 0.19`), ohne Annotation nicht (`steuer=0.19`).",
    keywords: ['annotation', 'type hint', 'typhinweis', 'rückgabetyp', 'return type', 'pfeil', '__annotations__', 'annotationlib'],
    related: ['Typ-Annotationen', 'X | None (Optional)', 'mypy'],
    mdn: T + 'controlflow.html#function-annotations'
  },

  // ---------------- Dekoratoren ----------------
  {
    lang: 'py', group: 'Dekoratoren', name: 'Dekorator',
    desc: "Funktion, die eine andere Funktion umhüllt und mit @name erweitert.",
    details: "`@deko` über `def f` ist Kurzschrift für `f = deko(f)`. Ein Dekorator bekommt die Funktion, definiert meist eine innere `wrapper`-Funktion mit `*args, **kwargs` und gibt diese zurück. Typische Anwendungen sind Logging, Zeitmessung, Caching, Zugriffsprüfungen und Registrierung. Mehrere Dekoratoren werden von unten nach oben angewendet.",
    syntax: "def deko(func):\n    def wrapper(*args, **kwargs):\n        ...\n        return func(*args, **kwargs)\n    return wrapper\n\n@deko\ndef f(): ...",
    example: e(`
def protokoll(func):
    def wrapper(*args, **kwargs):
        print(f"-> {func.__name__}{args}")
        ergebnis = func(*args, **kwargs)
        print(f"<- {ergebnis}")
        return ergebnis
    return wrapper

@protokoll               # entspricht: addiere = protokoll(addiere)
def addiere(a, b):
    return a + b

addiere(2, 3)
# -> addiere(2, 3)
# <- 5
print(addiere.__name__)  # wrapper  (ohne functools.wraps!)
`),
    tip: "Immer `@functools.wraps(func)` auf den Wrapper setzen, sonst gehen Name, Docstring und Signatur der Originalfunktion verloren.",
    keywords: ['decorator', 'dekorieren', 'wrapper', 'at', '@', 'umhüllen', 'higher order', 'annotation'],
    related: ['functools.wraps', 'Dekorator mit Parametern', 'Closures', 'Funktionen als Objekte'],
    mdn: 'https://docs.python.org/3/glossary.html#term-decorator'
  },
  {
    lang: 'py', group: 'Dekoratoren', name: 'functools.wraps',
    desc: "Überträgt Name, Docstring und Signatur der Originalfunktion auf den Wrapper.",
    details: "`@functools.wraps(func)` kopiert `__name__`, `__doc__`, `__module__`, `__qualname__` und `__annotations__` auf die Wrapper-Funktion und setzt `__wrapped__` auf das Original. Dadurch zeigen Tracebacks, `help()` und `inspect.signature()` die echte Funktion. Es gehört in praktisch jeden selbst geschriebenen Dekorator.",
    syntax: "@functools.wraps(func)\ndef wrapper(*args, **kwargs): ...",
    example: e(`
import functools

def protokoll(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print("Aufruf:", func.__name__)
        return func(*args, **kwargs)
    return wrapper

@protokoll
def addiere(a, b):
    """Addiert zwei Zahlen."""
    return a + b

print(addiere(1, 2))              # Aufruf: addiere, dann 3
print(addiere.__name__)           # addiere
print(addiere.__doc__)            # Addiert zwei Zahlen.
print(addiere.__wrapped__(1, 2))  # 3  (Original ohne Dekorator)
`),
    tip: "Über `__wrapped__` lässt sich die undekorierte Funktion in Tests direkt aufrufen.",
    keywords: ['wraps', 'functools', 'metadaten', 'metadata', '__name__', '__doc__', '__wrapped__', 'update_wrapper'],
    related: ['Dekorator', 'Dekorator mit Parametern', 'Docstrings'],
    mdn: D + 'functools.html#functools.wraps'
  },
  {
    lang: 'py', group: 'Dekoratoren', name: 'Dekorator mit Parametern',
    desc: "Dekorator-Fabrik: @wiederholen(3) liefert erst den eigentlichen Dekorator.",
    details: "Braucht ein Dekorator Argumente, kommt eine dritte Ebene dazu: Die äußere Funktion nimmt die Parameter und gibt den Dekorator zurück, der wiederum den Wrapper liefert. `@fabrik(arg)` entspricht `f = fabrik(arg)(f)`. Häufiger Fehler ist das Vergessen der Klammern: `@fabrik` statt `@fabrik()` übergibt die Funktion als Parameter.",
    syntax: "def fabrik(param):\n    def deko(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs): ...\n        return wrapper\n    return deko",
    example: e(`
import functools

def wiederholen(versuche):
    def dekorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for nr in range(1, versuche + 1):
                try:
                    return func(*args, **kwargs)
                except ConnectionError:
                    print(f"Versuch {nr} fehlgeschlagen")
            raise ConnectionError("aufgegeben")
        return wrapper
    return dekorator

zustand = {"aufrufe": 0}

@wiederholen(versuche=3)
def laden():
    zustand["aufrufe"] += 1
    if zustand["aufrufe"] < 3:
        raise ConnectionError
    return "Daten"

print(laden())
# Versuch 1 fehlgeschlagen
# Versuch 2 fehlgeschlagen
# Daten
`),
    tip: "Für komplexe Dekoratoren mit Zustand ist oft eine Klasse mit `__init__` und `__call__` übersichtlicher als drei verschachtelte Funktionen.",
    keywords: ['decorator factory', 'dekorator fabrik', 'parametrisierter dekorator', 'decorator arguments', 'retry'],
    related: ['Dekorator', 'functools.wraps', 'Closures'],
    mdn: R + 'compound_stmts.html#function-definitions'
  },
  {
    lang: 'py', group: 'Dekoratoren', name: 'Klassen-Dekorator',
    desc: "Dekorator für Klassen – oder eine Klasse, die selbst als Dekorator dient.",
    details: "Ein Dekorator über `class` bekommt die Klasse und gibt sie (meist verändert oder registriert) zurück; `@dataclass` ist das bekannteste Beispiel. Umgekehrt kann eine Klasse mit `__call__` als Dekorator für Funktionen dienen: `__init__` bekommt die Funktion, `__call__` ersetzt den Wrapper. So lässt sich Zustand bequem in Attributen halten.",
    syntax: "@deko\nclass K: ...      # K = deko(K)",
    example: e(`
REGISTRY = {}

def registrieren(cls):
    REGISTRY[cls.__name__.lower()] = cls
    return cls                 # Klasse unverändert zurückgeben

@registrieren
class CsvExport:
    pass

print(list(REGISTRY))          # ['csvexport']

class Zaehle:                  # Klasse als Dekorator
    def __init__(self, func):
        self.func = func
        self.aufrufe = 0
    def __call__(self, *args, **kwargs):
        self.aufrufe += 1
        return self.func(*args, **kwargs)

@Zaehle
def hallo():
    return "hi"

hallo(); hallo()
print(hallo.aufrufe)           # 2
`),
    tip: "Ein Klassen-Dekorator ist oft einfacher als eine Metaklasse oder `__init_subclass__`, wenn nur einzelne Klassen betroffen sind.",
    keywords: ['class decorator', 'klassendekorator', 'registrierung', 'registry', 'dekorator klasse', '__call__'],
    related: ['Dekorator', '@dataclass', '__call__', '__init_subclass__'],
    mdn: R + 'compound_stmts.html#class-definitions'
  },
  {
    lang: 'py', group: 'Dekoratoren', name: '@functools.cache',
    desc: "Merkt sich Ergebnisse je Argumentkombination unbegrenzt (Memoisierung).",
    details: "Beim zweiten Aufruf mit denselben Argumenten wird das gespeicherte Ergebnis zurückgegeben, ohne die Funktion auszuführen. Die Argumente müssen hashbar sein, Listen gehen also nicht. Der Cache wächst unbegrenzt und lebt so lange wie die Funktion; `cache_clear()` leert ihn.",
    syntax: "@functools.cache\ndef f(...): ...",
    values: [
      ["f.cache_info()", "Treffer, Fehlschläge, Größe"],
      ["f.cache_clear()", "Cache leeren"]
    ],
    example: e(`
from functools import cache

@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(80))            # 23416728348467685 (sofort statt Stunden)
print(fib.cache_info())   # CacheInfo(hits=78, misses=81, maxsize=None, currsize=81)
fib.cache_clear()
`),
    tip: "Auf Methoden angewendet hält der Cache auch `self` fest und verhindert so die Freigabe der Objekte; dort besser `functools.cached_property` oder einen Cache pro Instanz verwenden.",
    keywords: ['cache', 'memoization', 'memoisierung', 'zwischenspeichern', 'functools', 'performance', 'fibonacci'],
    related: ['@functools.lru_cache', 'Rekursion', 'Gültige Schlüssel (hashbar)'],
    mdn: D + 'functools.html#functools.cache'
  },
  {
    lang: 'py', group: 'Dekoratoren', name: '@functools.lru_cache',
    desc: "Cache mit Größenlimit: verdrängt die am längsten nicht genutzten Einträge.",
    details: "LRU steht für „least recently used“. Mit `maxsize` begrenzt man die Anzahl gespeicherter Ergebnisse, `maxsize=None` entspricht `@cache`. Mit `typed=True` werden `1` und `1.0` getrennt gespeichert. Ohne Klammern (`@lru_cache`) gilt `maxsize=128`.",
    syntax: "@functools.lru_cache(maxsize=128, typed=False)",
    values: [
      ["maxsize", "Maximale Einträge, None = unbegrenzt"],
      ["typed", "True: Argumente verschiedener Typen getrennt cachen"]
    ],
    example: e(`
from functools import lru_cache

@lru_cache(maxsize=2)
def quadrat(n):
    print("berechne", n)
    return n * n

quadrat(2); quadrat(3)
quadrat(2)               # Treffer, keine Ausgabe
quadrat(4)               # verdrängt 3
quadrat(3)               # wird neu berechnet
print(quadrat.cache_info())
# berechne 2 / berechne 3 / berechne 4 / berechne 3
# CacheInfo(hits=1, misses=4, maxsize=2, currsize=2)
`),
    tip: "Für Funktionen, die Ein-/Ausgabe machen oder veränderliche Objekte zurückgeben, ist Caching gefährlich: Alle Aufrufer teilen sich dasselbe Ergebnisobjekt.",
    keywords: ['lru', 'least recently used', 'cache', 'maxsize', 'memoization', 'functools', 'begrenzter cache'],
    related: ['@functools.cache', 'Dekorator mit Parametern'],
    mdn: D + 'functools.html#functools.lru_cache'
  },
  {
    lang: 'py', group: 'Dekoratoren', name: '@functools.singledispatch',
    desc: "Generische Funktion, die je nach Typ des ersten Arguments eine Variante wählt.",
    details: "Die mit `@singledispatch` dekorierte Funktion ist der Rückfall für unbekannte Typen. Weitere Varianten registriert man mit `@f.register`, wahlweise mit Typ-Annotation am ersten Parameter oder als `@f.register(Typ)`. Unterklassen werden passend zugeordnet (`bool` landet bei `int`, wenn es keine eigene Variante gibt). Für Methoden gibt es `functools.singledispatchmethod`.",
    syntax: "@singledispatch\ndef f(arg): ...\n\n@f.register\ndef _(arg: Typ): ...",
    example: e(`
from functools import singledispatch

@singledispatch
def formatieren(wert):
    return str(wert)

@formatieren.register
def _(wert: float):
    return f"{wert:.2f}"

@formatieren.register
def _(wert: list):
    return ", ".join(formatieren(w) for w in wert)

print(formatieren(3))              # 3
print(formatieren(3.14159))        # 3.14
print(formatieren([1, 2.5, "x"]))  # 1, 2.50, x
`),
    tip: "Alternative zu langen `if isinstance(...)`-Ketten; neue Typen lassen sich auch aus anderen Modulen registrieren, ohne die Ausgangsfunktion zu ändern.",
    keywords: ['singledispatch', 'überladung', 'overloading', 'generische funktion', 'dispatch', 'typabhängig', 'polymorphie'],
    related: ['isinstance()', 'typing.overload', 'Dekorator'],
    mdn: D + 'functools.html#functools.singledispatch'
  },

  // ---------------- Klassen & Objekte ----------------
  {
    lang: 'py', group: 'Klassen & Objekte', name: 'class',
    desc: "Definiert eine Klasse: Bauplan mit Attributen und Methoden für Objekte.",
    details: "Eine Klasse bündelt Daten (Attribute) und Verhalten (Methoden). Ein Aufruf der Klasse wie eine Funktion erzeugt eine Instanz und ruft `__init__` auf. Ohne Basisklasse erbt jede Klasse von `object`. Klassennamen schreibt man im CapWords-Stil (`BankKonto`).",
    syntax: "class Name(Basisklasse):\n    \"\"\"Docstring\"\"\"\n    klassenattribut = wert\n\n    def __init__(self, ...):\n        self.attribut = ...\n\n    def methode(self, ...): ...",
    example: e(`
class Konto:
    """Ein einfaches Bankkonto."""
    waehrung = "EUR"                 # Klassenattribut

    def __init__(self, inhaber, stand=0):
        self.inhaber = inhaber        # Instanzattribute
        self.stand = stand

    def einzahlen(self, betrag):
        self.stand += betrag
        return self.stand

k = Konto("Ada")
k.einzahlen(50)
print(k.inhaber, k.stand, k.waehrung)          # Ada 50 EUR
print(type(k).__name__, isinstance(k, Konto))  # Konto True
`),
    tip: "Reine Datenbehälter lieber mit `@dataclass` schreiben, das spart `__init__`, `__repr__` und `__eq__`.",
    keywords: ['klasse', 'objekt', 'instanz', 'oop', 'objektorientiert', 'object oriented', 'bauplan', 'typ'],
    related: ['__init__', 'self', '@dataclass', 'Vererbung'],
    mdn: T + 'classes.html#class-definitions'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: '__init__',
    desc: "Initialisiert eine neue Instanz; wird beim Aufruf der Klasse automatisch ausgeführt.",
    details: "`__init__` legt die Instanzattribute an und prüft Argumente. Genau genommen ist es kein Konstruktor: Das Objekt wurde vorher von `__new__` erzeugt, `__init__` richtet es nur ein. Es muss `None` zurückgeben. Bei Vererbung muss man `super().__init__(...)` selbst aufrufen.",
    syntax: "def __init__(self, param, ...):\n    self.attribut = param",
    example: e(`
class Rechteck:
    def __init__(self, breite, hoehe=None):
        if breite <= 0:
            raise ValueError("Breite muss positiv sein")
        self.breite = breite
        self.hoehe = breite if hoehe is None else hoehe   # Quadrat als Standard

r = Rechteck(3, 4)
q = Rechteck(5)
print(r.breite * r.hoehe)   # 12
print(q.hoehe)              # 5
try:
    Rechteck(0)
except ValueError as e:
    print(e)                # Breite muss positiv sein
`),
    tip: "Alle Instanzattribute in `__init__` anlegen, auch wenn sie anfangs `None` sind. Attribute, die erst in anderen Methoden entstehen, führen leicht zu `AttributeError`.",
    keywords: ['konstruktor', 'constructor', 'initialisierer', 'initializer', 'dunder init', 'instanz erzeugen', '__new__'],
    related: ['class', 'self', 'super()', '__post_init__'],
    mdn: R + 'datamodel.html#object.__init__'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: 'self',
    desc: "Erster Parameter jeder Instanzmethode: verweist auf das aktuelle Objekt.",
    details: "Python übergibt die Instanz beim Methodenaufruf automatisch als erstes Argument: `obj.m(x)` entspricht `Klasse.m(obj, x)`. Der Name `self` ist reine Konvention, aber verbindlich üblich. Attribute muss man immer über `self.` ansprechen, ein nacktes `wert = 0` erzeugt nur eine lokale Variable.",
    example: e(`
class Zaehler:
    def __init__(self):
        self.wert = 0

    def erhoehen(self, schritt=1):
        self.wert += schritt   # ohne self.: nur lokale Variable
        return self            # erlaubt Verkettung

z = Zaehler()
z.erhoehen().erhoehen(5)
print(z.wert)                  # 6
Zaehler.erhoehen(z)            # gleichbedeutend mit z.erhoehen()
print(z.wert)                  # 7
`),
    tip: "`TypeError: m() takes 1 positional argument but 2 were given` bedeutet fast immer: `self` in der Methodendefinition vergessen.",
    keywords: ['self', 'this', 'instanz', 'aktuelles objekt', 'erster parameter', 'methode'],
    related: ['Methoden', '__init__', 'Instanz- & Klassenattribute'],
    mdn: T + 'classes.html#random-remarks'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: 'Instanz- & Klassenattribute',
    desc: "Attribute pro Objekt (self.x) und gemeinsame Attribute der Klasse (x im Klassenrumpf).",
    details: "Instanzattribute gehören einem einzelnen Objekt, Klassenattribute teilen sich alle Instanzen. Beim Lesen sucht Python erst in der Instanz, dann in der Klasse. Eine Zuweisung über die Instanz legt immer ein neues Instanzattribut an und verdeckt das Klassenattribut. Veränderliche Klassenattribute (Listen) werden versehentlich von allen Instanzen geteilt.",
    example: e(`
class Hund:
    art = "Canis"        # Klassenattribut
    tricks = []          # Fallstrick: von allen Instanzen geteilt

    def __init__(self, name):
        self.name = name  # Instanzattribut

a, b = Hund("Rex"), Hund("Bello")
a.tricks.append("Sitz")
print(b.tricks)                  # ['Sitz']  – geteilte Liste!
a.art = "Wolf"                   # neues Instanzattribut verdeckt die Klasse
print(a.art, b.art, Hund.art)    # Wolf Canis Canis
Hund.art = "Hund"
print(b.art)                     # Hund
`),
    tip: "Klassenattribute für Konstanten und Zähler nutzen; Listen und Dicts pro Objekt immer in `__init__` anlegen.",
    keywords: ['klassenattribut', 'instanzattribut', 'class variable', 'instance variable', 'klassenvariable', 'statisches feld', 'geteilt'],
    related: ['class', 'self', 'vars() & __dict__', 'Veränderliche Standardwerte (Fallstrick)'],
    mdn: T + 'classes.html#class-and-instance-variables'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: 'Methoden',
    desc: "Funktionen in einer Klasse: Instanz-, Klassen- und statische Methoden.",
    details: "Eine normale Methode bekommt die Instanz als `self`, eine `@classmethod` die Klasse als `cls`, eine `@staticmethod` gar nichts automatisch. Über eine Instanz abgerufen, ist eine Methode an das Objekt gebunden und kann wie ein Wert weitergegeben werden. Methoden ohne Bezug auf Instanz oder Klasse gehören oft besser als Funktion ins Modul.",
    values: [
      ["def m(self)", "Instanzmethode: Zugriff auf das Objekt"],
      ["@classmethod def m(cls)", "Klassenmethode: Zugriff auf die Klasse"],
      ["@staticmethod def m()", "Statische Methode: kein automatisches Argument"],
      ["@property def m(self)", "Berechnetes Attribut ohne Klammern"]
    ],
    example: e(`
class Temperatur:
    def __init__(self, celsius):
        self.celsius = celsius

    def in_fahrenheit(self):         # Instanzmethode
        return self.celsius * 9 / 5 + 32

    def ist_frost(self):
        return self.celsius < 0

t = Temperatur(20)
print(t.in_fahrenheit())    # 68.0
pruefen = t.ist_frost       # gebundene Methode, noch kein Aufruf
print(pruefen())            # False
print(pruefen.__self__ is t)  # True
`),
    tip: "`t.ist_frost` ohne Klammern ist immer wahr (Methodenobjekt). In Bedingungen also auf `t.ist_frost()` achten.",
    keywords: ['methode', 'method', 'instanzmethode', 'gebundene methode', 'bound method', 'member function'],
    related: ['self', '@classmethod', '@staticmethod', '@property'],
    mdn: T + 'classes.html#method-objects'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: '@staticmethod',
    desc: "Methode ohne self und cls: eine normale Funktion im Namensraum der Klasse.",
    details: "Eine statische Methode bekommt weder Instanz noch Klasse übergeben und lässt sich über beides aufrufen. Sie eignet sich für Hilfsfunktionen, die thematisch zur Klasse gehören. Braucht die Methode die Klasse (etwa um Instanzen zu erzeugen), ist `@classmethod` die richtige Wahl.",
    syntax: "@staticmethod\ndef name(param): ...",
    example: e(`
class Validierung:
    @staticmethod
    def ist_plz(text):
        return len(text) == 5 and text.isdigit()

print(Validierung.ist_plz("10115"))    # True
print(Validierung().ist_plz("1011"))   # False
`),
    tip: "In Python ist eine Funktion auf Modulebene oft die einfachere Alternative; statische Methoden lohnen sich, wenn Unterklassen sie überschreiben sollen.",
    keywords: ['statische methode', 'static method', 'utility', 'hilfsmethode', 'ohne self'],
    related: ['@classmethod', 'Methoden'],
    mdn: D + 'functions.html#staticmethod'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: '@classmethod',
    desc: "Methode, die die Klasse als cls bekommt – typisch für alternative Konstruktoren.",
    details: "Eine Klassenmethode erhält als erstes Argument die Klasse, über die sie aufgerufen wurde, bei Unterklassen also die Unterklasse. Damit sind Fabrikmethoden wie `dict.fromkeys()` oder `datetime.fromisoformat()` möglich, die auch in Unterklassen das richtige Objekt erzeugen. Auf Instanzattribute hat sie keinen Zugriff.",
    syntax: "@classmethod\ndef name(cls, ...):\n    return cls(...)",
    example: e(`
class Person:
    def __init__(self, name, jahrgang):
        self.name = name
        self.jahrgang = jahrgang

    @classmethod
    def aus_text(cls, text):           # alternativer Konstruktor
        name, jahr = text.split(";")
        return cls(name, int(jahr))

class Kunde(Person):
    pass

k = Kunde.aus_text("Ada;1815")
print(type(k).__name__, k.name, k.jahrgang)  # Kunde Ada 1815
`),
    tip: "`cls(...)` statt des festen Klassennamens verwenden, damit Unterklassen automatisch korrekt funktionieren.",
    keywords: ['klassenmethode', 'class method', 'cls', 'fabrikmethode', 'factory method', 'alternativer konstruktor'],
    related: ['@staticmethod', 'Methoden', 'typing.Self'],
    mdn: D + 'functions.html#classmethod'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: '@property',
    desc: "Methode, die wie ein Attribut gelesen (und optional gesetzt) wird – mit Prüfung.",
    details: "`@property` macht aus einer Methode ein berechnetes, lesbares Attribut ohne Klammern. Mit `@name.setter` und `@name.deleter` kommen Schreib- und Löschzugriff hinzu, etwa zur Validierung. Ohne Setter ist das Attribut schreibgeschützt. So kann man öffentliche Attribute später durch Logik ersetzen, ohne die Aufrufer zu ändern.",
    syntax: "@property\ndef name(self): ...\n\n@name.setter\ndef name(self, wert): ...",
    example: e(`
import math

class Kreis:
    def __init__(self, radius):
        self.radius = radius           # läuft schon über den Setter

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, wert):
        if wert < 0:
            raise ValueError("Radius darf nicht negativ sein")
        self._radius = wert

    @property
    def flaeche(self):                 # nur lesbar, berechnet
        return round(math.pi * self._radius ** 2, 2)

k = Kreis(2)
print(k.flaeche)     # 12.57
k.radius = 3
print(k.flaeche)     # 28.27
try:
    k.flaeche = 5
except AttributeError:
    print("flaeche ist schreibgeschützt")  # flaeche ist schreibgeschützt
`),
    tip: "Im Getter `self._radius` verwenden, nicht `self.radius` – sonst ruft sich die Property endlos selbst auf (`RecursionError`). Für teure Berechnungen gibt es `functools.cached_property`.",
    keywords: ['property', 'getter', 'setter', 'eigenschaft', 'berechnetes attribut', 'computed', 'cached_property', 'validierung'],
    related: ['Deskriptoren', 'Private Namen (_ und __)', 'Methoden'],
    mdn: D + 'functions.html#property'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: '__str__ & __repr__',
    desc: "Textdarstellung eines Objekts: lesbar für Nutzer (str), eindeutig für Entwickler (repr).",
    details: "`__str__` wird von `print()`, `str()` und f-Strings genutzt, `__repr__` von `repr()`, der REPL, dem Debugger und in Containern wie Listen. Fehlt `__str__`, nimmt Python `__repr__`. Ein gutes `__repr__` sieht möglichst wie gültiger Code aus, der das Objekt erzeugt.",
    syntax: "def __repr__(self): return f\"Klasse({self.x!r})\"\ndef __str__(self): return ...",
    example: e(`
class Punkt:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Punkt({self.x!r}, {self.y!r})"

    def __str__(self):
        return f"({self.x} | {self.y})"

p = Punkt(1, 2)
print(p)            # (1 | 2)
print(repr(p))      # Punkt(1, 2)
print([p])          # [Punkt(1, 2)]
print(f"{p!r}")     # Punkt(1, 2)
`),
    tip: "Wenn man nur eine der beiden Methoden schreibt, dann `__repr__`. Ohne sie zeigt Python nur `<__main__.Punkt object at 0x...>`.",
    keywords: ['repr', 'str', 'tostring', 'textdarstellung', 'string representation', 'ausgabe', 'dunder', 'print objekt'],
    related: ['repr()', 'print()', 'f-String', '@dataclass'],
    mdn: R + 'datamodel.html#object.__repr__'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: '__eq__ & __hash__',
    desc: "Gleichheit mit == definieren und Objekte als Dict-Schlüssel und in Sets nutzbar machen.",
    details: "Ohne `__eq__` vergleicht `==` die Identität. Wer `__eq__` überschreibt, setzt dabei automatisch `__hash__ = None`; die Objekte sind dann nicht mehr hashbar. Soll das Objekt in Sets und als Dict-Schlüssel funktionieren, braucht es ein `__hash__`, das aus denselben Feldern berechnet wird wie `__eq__`. Diese Felder sollten unveränderlich sein.",
    syntax: "def __eq__(self, other): ...\ndef __hash__(self): return hash((self.a, self.b))",
    example: e(`
class Farbe:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        if not isinstance(other, Farbe):
            return NotImplemented          # Python probiert dann die Gegenseite
        return self.name.lower() == other.name.lower()

    def __hash__(self):
        return hash(self.name.lower())

print(Farbe("Rot") == Farbe("rot"))        # True
print(len({Farbe("Rot"), Farbe("ROT")}))   # 1
print(Farbe("Rot") == "Rot")               # False

class NurEq:
    def __eq__(self, other):
        return True

print(NurEq.__hash__)                      # None – nicht hashbar
`),
    tip: "Bei fremden Typen `NotImplemented` zurückgeben, nicht `False` oder eine Exception. `@dataclass(frozen=True)` erzeugt beide Methoden passend.",
    keywords: ['gleichheit', 'equality', 'hash', 'hashbar', 'hashable', 'vergleich', 'notimplemented', 'set', 'dict schlüssel'],
    related: ['Identität & Gleichheit', 'Gültige Schlüssel (hashbar)', 'hash()', 'frozen=True'],
    mdn: R + 'datamodel.html#object.__hash__'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: 'Vergleichsmethoden (__lt__, functools.total_ordering)',
    desc: "<, <=, >, >= für eigene Klassen; total_ordering ergänzt die fehlenden.",
    details: "Die Methoden `__lt__`, `__le__`, `__gt__` und `__ge__` steuern die Ordnungsvergleiche. `sorted()`, `min()` und `max()` brauchen nur `__lt__`. Mit `@functools.total_ordering` reichen `__eq__` und eine Ordnungsmethode, die übrigen werden abgeleitet. Bei unpassenden Typen sollte man `NotImplemented` zurückgeben.",
    values: [
      ["__lt__", "a < b"],
      ["__le__", "a <= b"],
      ["__gt__", "a > b"],
      ["__ge__", "a >= b"],
      ["__eq__ / __ne__", "a == b / a != b"]
    ],
    example: e(`
from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.teile = tuple(int(t) for t in text.split("."))
    def __eq__(self, other):
        return self.teile == other.teile
    def __lt__(self, other):
        return self.teile < other.teile      # Tupel vergleichen elementweise
    def __repr__(self):
        return ".".join(map(str, self.teile))

v = [Version("1.10.0"), Version("1.2.3"), Version("1.2")]
print(sorted(v))                          # [1.2, 1.2.3, 1.10.0]
print(Version("2.0") >= Version("1.9"))   # True (von total_ordering ergänzt)
print(max(v))                             # 1.10.0
`),
    tip: "Oft genügt statt eigener Vergleichsmethoden ein `key`: `sorted(versionen, key=lambda v: v.teile)`. Oder `@dataclass(order=True)`.",
    keywords: ['vergleich', 'comparison', 'sortieren', 'ordnung', 'ordering', '__lt__', 'total_ordering', 'kleiner als'],
    related: ['__eq__ & __hash__', 'sorted()', 'Operatorüberladung', '@dataclass'],
    mdn: D + 'functools.html#functools.total_ordering'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: 'Operatorüberladung',
    desc: "Operatoren wie +, *, abs() für eigene Klassen über Dunder-Methoden definieren.",
    details: "Für `a + b` ruft Python `a.__add__(b)` auf; liefert das `NotImplemented`, wird `b.__radd__(a)` probiert. Die `__r*__`-Varianten sind nötig, wenn das eigene Objekt rechts steht (`3 * v`). Ohne `__iadd__` fällt `+=` auf `__add__` zurück und erzeugt ein neues Objekt.",
    values: [
      ["__add__ / __sub__", "+ / -"],
      ["__mul__ / __truediv__", "* / /"],
      ["__floordiv__ / __mod__", "// / %"],
      ["__pow__ / __matmul__", "** / @"],
      ["__neg__ / __abs__", "-a / abs(a)"],
      ["__radd__, __rmul__ …", "Gespiegelte Variante (Objekt rechts)"],
      ["__iadd__ …", "Erweiterte Zuweisung (+=)"],
      ["__bool__", "Wahrheitswert"]
    ],
    example: e(`
class Vektor:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):
        return Vektor(self.x + other.x, self.y + other.y)
    def __mul__(self, faktor):
        return Vektor(self.x * faktor, self.y * faktor)
    __rmul__ = __mul__                  # damit auch 3 * v geht
    def __abs__(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5
    def __repr__(self):
        return f"Vektor({self.x}, {self.y})"

a, b = Vektor(1, 2), Vektor(3, 4)
print(a + b)    # Vektor(4, 6)
print(a * 2)    # Vektor(2, 4)
print(3 * a)    # Vektor(3, 6)
print(abs(b))   # 5.0
`),
    tip: "Operatoren nur überladen, wenn die Bedeutung offensichtlich ist (Vektoren, Geldbeträge, Matrizen). Für alles andere sind benannte Methoden klarer.",
    keywords: ['operator overloading', 'überladen', 'dunder', 'magic methods', '__add__', '__radd__', 'arithmetik'],
    related: ['Arithmetische Operatoren', 'Vergleichsmethoden (__lt__, functools.total_ordering)', 'Container-Protokoll (__len__, __getitem__, __contains__)'],
    mdn: R + 'datamodel.html#emulating-numeric-types'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: 'Container-Protokoll (__len__, __getitem__, __contains__)',
    desc: "Eigene Klassen mit len(), obj[i], in und Schleifen wie Listen benutzbar machen.",
    details: "`__len__` liefert die Länge für `len()` und den Wahrheitswert, `__getitem__` den Zugriff mit `[]` inklusive Slices, `__contains__` den `in`-Test. Ohne `__iter__` iteriert Python über `__getitem__` mit 0, 1, 2 … bis `IndexError`. Für vollständige Sequenzen oder Mappings lohnt sich die Basisklasse aus `collections.abc`, die fehlende Methoden ergänzt.",
    values: [
      ["__len__", "len(obj), bool(obj)"],
      ["__getitem__", "obj[key], Slices, Iteration-Fallback"],
      ["__setitem__ / __delitem__", "obj[key] = v / del obj[key]"],
      ["__contains__", "x in obj"],
      ["__iter__", "for x in obj"]
    ],
    example: e(`
class Playlist:
    def __init__(self, *titel):
        self._titel = list(titel)
    def __len__(self):
        return len(self._titel)
    def __getitem__(self, index):
        return self._titel[index]        # unterstützt auch Slices
    def __contains__(self, titel):
        return titel in self._titel

p = Playlist("Intro", "Song A", "Outro")
print(len(p))           # 3
print(p[0], p[-1])      # Intro Outro
print(p[1:])            # ['Song A', 'Outro']
print("Song A" in p)    # True
print(list(p))          # ['Intro', 'Song A', 'Outro']
print(bool(Playlist())) # False (Länge 0)
`),
    tip: "Mit `class Playlist(collections.abc.Sequence)` und nur `__len__` plus `__getitem__` bekommt man `index()`, `count()`, `reversed()` und `in` geschenkt.",
    keywords: ['container', 'sequenz', 'sequence protocol', '__len__', '__getitem__', '__contains__', 'indexierung', 'collections.abc'],
    related: ['Iterator-Protokoll', 'Operatorüberladung', 'len()'],
    mdn: R + 'datamodel.html#emulating-container-types'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: '__call__',
    desc: "Macht Instanzen aufrufbar wie Funktionen: obj(argumente).",
    details: "Definiert eine Klasse `__call__`, führt `obj(x)` diese Methode aus. So erhält man Funktionen mit eigenem Zustand in Attributen, etwa konfigurierbare Berechnungen, Zähler oder Dekoratoren. `callable(obj)` liefert dann `True`.",
    syntax: "def __call__(self, *args, **kwargs): ...",
    example: e(`
class Multiplikator:
    def __init__(self, faktor):
        self.faktor = faktor

    def __call__(self, wert):
        return wert * self.faktor

verdreifachen = Multiplikator(3)
print(verdreifachen(7))                  # 21
print(callable(verdreifachen))           # True
print(list(map(verdreifachen, [1, 2])))  # [3, 6]
`),
    tip: "Für einfache Fälle reicht eine Closure oder `functools.partial`; `__call__` lohnt sich, wenn das Objekt zusätzlich weitere Methoden oder einsehbaren Zustand hat.",
    keywords: ['aufrufbar', 'callable', 'funktionsobjekt', 'functor', 'call', 'dunder call'],
    related: ['callable()', 'Klassen-Dekorator', 'Closures'],
    mdn: R + 'datamodel.html#object.__call__'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: '__slots__',
    desc: "Feste Attributliste statt __dict__: spart Speicher und verhindert Tippfehler-Attribute.",
    details: "Mit `__slots__ = (\"x\", \"y\")` reserviert Python feste Plätze für genau diese Attribute und legt kein `__dict__` pro Instanz an. Das spart bei vielen kleinen Objekten deutlich Speicher und macht den Zugriff etwas schneller. Neue Attribute lassen sich dann nicht mehr hinzufügen. Bei Vererbung braucht jede Klasse in der Kette eigene `__slots__`, sonst entsteht doch ein `__dict__`.",
    syntax: "class K:\n    __slots__ = (\"a\", \"b\")",
    example: e(`
class Punkt:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x, self.y = x, y

p = Punkt(1, 2)
p.x = 10                          # erlaubt
try:
    p.z = 3                       # Tippfehler oder neues Attribut
except AttributeError as e:
    print(e)  # 'Punkt' object has no attribute 'z' and no __dict__ for setting new attributes
print(hasattr(p, "__dict__"))     # False
`),
    tip: "Bei Dataclasses einfach `@dataclass(slots=True)` schreiben, statt `__slots__` von Hand zu pflegen.",
    keywords: ['slots', 'speicher', 'memory', '__dict__', 'attribute begrenzen', 'performance'],
    related: ['slots=True & kw_only', 'vars() & __dict__', 'Instanz- & Klassenattribute'],
    mdn: R + 'datamodel.html#slots'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: 'Private Namen (_ und __)',
    desc: "_name heißt „intern“ (Konvention), __name wird per Name Mangling umbenannt.",
    details: "Python kennt kein echtes `private`. Ein führender Unterstrich signalisiert „nicht Teil der öffentlichen API“ und wird von `from modul import *` ausgelassen. Zwei führende Unterstriche (ohne zwei am Ende) lösen Name Mangling aus: `__geheim` wird in Klasse `Konto` zu `_Konto__geheim`. Das schützt vor Namenskollisionen in Unterklassen, nicht vor Zugriff.",
    values: [
      ["_name", "Intern, Konvention"],
      ["__name", "Name Mangling: _Klasse__name"],
      ["__name__", "Dunder: von Python reserviert, nicht selbst erfinden"],
      ["name_", "Vermeidet Kollision mit Schlüsselwort (class_)"]
    ],
    example: e(`
class Konto:
    def __init__(self):
        self._intern = "bitte nicht anfassen"
        self.__geheim = 42           # wird zu _Konto__geheim

k = Konto()
print(k._intern)                     # bitte nicht anfassen
try:
    print(k.__geheim)
except AttributeError:
    print("kein Zugriff")            # kein Zugriff
print(k._Konto__geheim)              # 42 (Mangling umgangen)
print(list(vars(k)))                 # ['_intern', '_Konto__geheim']
`),
    tip: "Im Alltag reicht ein Unterstrich. Doppelte Unterstriche nur gegen Kollisionen in Klassenhierarchien einsetzen, nicht als Zugriffsschutz.",
    keywords: ['private', 'privat', 'protected', 'unterstrich', 'underscore', 'name mangling', 'kapselung', 'encapsulation'],
    related: ['@property', 'vars() & __dict__', 'PEP 8'],
    mdn: T + 'classes.html#private-variables'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: 'vars() & __dict__',
    desc: "Das Dictionary mit den Attributen eines Objekts, eines Moduls oder einer Klasse.",
    details: "Normale Instanzen speichern ihre Attribute in `obj.__dict__`; `vars(obj)` liefert genau dieses Dict. Klassenattribute stehen dort nicht, sondern in `vars(Klasse)`. Ohne Argument entspricht `vars()` den lokalen Variablen (`locals()`). Objekte mit `__slots__` haben kein `__dict__`, dann wirft `vars()` einen `TypeError`.",
    syntax: "vars(obj)\nobj.__dict__",
    example: e(`
class Artikel:
    rabatt = 0.1
    def __init__(self, name, preis):
        self.name = name
        self.preis = preis

a = Artikel("Buch", 20)
print(vars(a))                   # {'name': 'Buch', 'preis': 20}
print(a.__dict__ is vars(a))     # True
vars(a)["lager"] = 5             # Attribut dynamisch setzen
print(a.lager)                   # 5
print("rabatt" in vars(a), "rabatt" in vars(Artikel))  # False True
`),
    tip: "Praktisch zum Debuggen oder um ein einfaches Objekt in JSON zu wandeln: `json.dumps(vars(obj))`. Für Dataclasses ist `dataclasses.asdict()` besser.",
    keywords: ['vars', '__dict__', 'attribute auflisten', 'attributes', 'namespace', 'introspektion', 'reflection'],
    related: ['dir() & help()', 'getattr() / setattr() / hasattr()', '__slots__', 'dataclasses.asdict()'],
    mdn: D + 'functions.html#vars'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: '__getattr__',
    desc: "Wird aufgerufen, wenn ein Attribut auf normalem Weg nicht gefunden wurde.",
    details: "`__getattr__` ist der Rückfall für fehlende Attribute und eignet sich für Proxys, Wrapper und dynamische Felder. Es muss für unbekannte Namen `AttributeError` werfen, sonst funktionieren `hasattr()` und `getattr()` mit Standardwert nicht. `__getattribute__` dagegen läuft bei jedem Zugriff und ist entsprechend heikel. Zum Abfangen von Zuweisungen gibt es `__setattr__`.",
    syntax: "def __getattr__(self, name):\n    ...\n    raise AttributeError(name)",
    values: [
      ["__getattr__", "Nur für fehlende Attribute"],
      ["__getattribute__", "Bei jedem Attributzugriff"],
      ["__setattr__", "Bei jeder Zuweisung obj.x = ..."],
      ["__delattr__", "Bei del obj.x"]
    ],
    example: e(`
class Konfig:
    def __init__(self, werte):
        self._werte = werte

    def __getattr__(self, name):          # nur wenn normale Suche scheitert
        try:
            return self._werte[name]
        except KeyError:
            raise AttributeError(name) from None

c = Konfig({"host": "localhost", "port": 8080})
print(c.host, c.port)               # localhost 8080
print(getattr(c, "debug", False))   # False
print(hasattr(c, "timeout"))        # False
`),
    tip: "Im Inneren von `__getattr__` nie auf ein Attribut zugreifen, das selbst fehlen könnte (etwa vor dem Setzen in `__init__`), sonst entsteht eine Endlosrekursion.",
    keywords: ['getattr', 'dynamische attribute', 'proxy', 'delegation', '__getattribute__', '__setattr__', 'attributzugriff'],
    related: ['getattr() / setattr() / hasattr()', 'Deskriptoren', '@property'],
    mdn: R + 'datamodel.html#object.__getattr__'
  },
  {
    lang: 'py', group: 'Klassen & Objekte', name: 'Deskriptoren',
    desc: "Objekte mit __get__/__set__, die den Attributzugriff einer anderen Klasse steuern.",
    details: "Ein Deskriptor ist ein Klassenattribut, dessen Klasse `__get__`, `__set__` oder `__delete__` definiert. Python ruft diese Methoden beim Zugriff über die Instanz auf. `@property`, `@classmethod`, `@staticmethod` und sogar normale Methoden sind intern Deskriptoren. `__set_name__` teilt dem Deskriptor mit, unter welchem Namen er in der Klasse steht.",
    values: [
      ["__get__(self, obj, typ)", "Lesen: obj.attr (obj ist None bei Zugriff über die Klasse)"],
      ["__set__(self, obj, wert)", "Schreiben: obj.attr = wert"],
      ["__delete__(self, obj)", "Löschen: del obj.attr"],
      ["__set_name__(self, owner, name)", "Bekommt den Attributnamen bei Klassenerstellung"]
    ],
    example: e(`
class Positiv:
    def __set_name__(self, owner, name):
        self.name = "_" + name
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.name)
    def __set__(self, obj, wert):
        if wert <= 0:
            raise ValueError(f"{self.name[1:]} muss positiv sein")
        setattr(obj, self.name, wert)

class Produkt:
    preis = Positiv()       # wiederverwendbare Prüfung
    menge = Positiv()
    def __init__(self, preis, menge):
        self.preis = preis
        self.menge = menge

p = Produkt(9.99, 3)
print(p.preis, p.menge)     # 9.99 3
try:
    p.menge = 0
except ValueError as e:
    print(e)                # menge muss positiv sein
`),
    tip: "Deskriptoren lohnen sich, wenn dieselbe Validierung an mehreren Attributen gebraucht wird; für ein einzelnes Attribut reicht `@property`.",
    keywords: ['descriptor', 'deskriptor', '__get__', '__set__', '__set_name__', 'attributzugriff', 'validierung'],
    related: ['@property', '__getattr__', '@classmethod'],
    mdn: H + 'descriptor.html'
  },

  // ---------------- Vererbung ----------------
  {
    lang: 'py', group: 'Vererbung', name: 'Vererbung',
    desc: "Eine Klasse übernimmt Attribute und Methoden einer Basisklasse und erweitert sie.",
    details: "`class Hund(Tier):` erbt alles von `Tier`; Methoden lassen sich überschreiben oder ergänzen. Beim Attributzugriff sucht Python erst in der Instanz, dann in der Klasse und dann entlang der Basisklassen. Jede Klasse erbt letztlich von `object`. Vererbung drückt eine „ist ein“-Beziehung aus; für „hat ein“ ist Komposition passender.",
    syntax: "class Kind(Basis):\n    ...",
    example: e(`
class Tier:
    def __init__(self, name):
        self.name = name
    def laut(self):
        return "..."
    def vorstellen(self):
        return f"{self.name} sagt {self.laut()}"

class Hund(Tier):
    def laut(self):
        return "Wuff"

class Katze(Tier):
    def laut(self):
        return "Miau"

for t in [Hund("Rex"), Katze("Mia"), Tier("Wesen")]:
    print(t.vorstellen())
# Rex sagt Wuff
# Mia sagt Miau
# Wesen sagt ...
print(isinstance(Hund("x"), Tier))   # True
print(Hund.__bases__)                # (<class '__main__.Tier'>,)
`),
    tip: "Tiefe Vererbungshierarchien werden schnell unübersichtlich. Oft sind Komposition, Protokolle oder Funktionen die einfachere Lösung.",
    keywords: ['vererbung', 'inheritance', 'erben', 'unterklasse', 'subclass', 'basisklasse', 'oberklasse', 'polymorphie', 'extends'],
    related: ['super()', 'Methoden überschreiben', 'Mehrfachvererbung & MRO', 'isinstance()'],
    mdn: T + 'classes.html#inheritance'
  },
  {
    lang: 'py', group: 'Vererbung', name: 'super()',
    desc: "Ruft die Methode der nächsten Klasse in der MRO auf, meist der Elternklasse.",
    details: "`super().__init__(...)` initialisiert den geerbten Teil, `super().methode()` erweitert eine überschriebene Methode statt sie komplett zu ersetzen. Ohne Argumente funktioniert `super()` nur innerhalb einer Methode einer Klasse. Bei Mehrfachvererbung ist „nächste Klasse“ nicht unbedingt die direkte Elternklasse, sondern die nächste in der MRO.",
    syntax: "super().__init__(args)\nsuper().methode(args)",
    example: e(`
class Fahrzeug:
    def __init__(self, marke):
        self.marke = marke
    def info(self):
        return f"Marke: {self.marke}"

class Auto(Fahrzeug):
    def __init__(self, marke, tueren):
        super().__init__(marke)          # Elternklasse initialisieren
        self.tueren = tueren
    def info(self):
        return super().info() + f", Türen: {self.tueren}"

a = Auto("VW", 5)
print(a.info())    # Marke: VW, Türen: 5
`),
    tip: "Vergisst man `super().__init__()` in der Unterklasse, fehlen die Attribute der Basisklasse und es kommt später zu `AttributeError`.",
    keywords: ['super', 'elternklasse', 'parent', 'basisklasse aufrufen', 'oberklasse', 'konstruktor verketten'],
    related: ['Vererbung', 'Mehrfachvererbung & MRO', '__init__', 'Methoden überschreiben'],
    mdn: D + 'functions.html#super'
  },
  {
    lang: 'py', group: 'Vererbung', name: 'Mehrfachvererbung & MRO',
    desc: "Eine Klasse mit mehreren Basisklassen; die MRO legt die Suchreihenfolge fest.",
    details: "Die Method Resolution Order (MRO) wird per C3-Linearisierung berechnet: Unterklassen vor Basisklassen, Basisklassen in der Reihenfolge der Klassendefinition, jede Klasse nur einmal. `Klasse.__mro__` oder `Klasse.mro()` zeigt sie an. Damit kooperative Mehrfachvererbung funktioniert, müssen alle beteiligten Klassen konsequent `super()` aufrufen.",
    syntax: "class C(A, B): ...\nC.__mro__",
    example: e(`
class Basis:
    def gruss(self):
        return ["Basis"]

class A(Basis):
    def gruss(self):
        return ["A"] + super().gruss()

class B(Basis):
    def gruss(self):
        return ["B"] + super().gruss()

class C(A, B):
    def gruss(self):
        return ["C"] + super().gruss()

print(C().gruss())                       # ['C', 'A', 'B', 'Basis']
print([k.__name__ for k in C.__mro__])   # ['C', 'A', 'B', 'Basis', 'object']
`),
    tip: "Lässt sich keine konsistente Reihenfolge bilden, gibt es schon beim Definieren der Klasse einen `TypeError: Cannot create a consistent method resolution order`.",
    keywords: ['mehrfachvererbung', 'multiple inheritance', 'mro', 'method resolution order', 'c3', 'diamant', 'diamond problem'],
    related: ['super()', 'Mixins', 'Vererbung'],
    mdn: H + 'mro.html'
  },
  {
    lang: 'py', group: 'Vererbung', name: 'issubclass()',
    desc: "Prüft, ob eine Klasse von einer anderen erbt (oder sie selbst ist).",
    details: "`issubclass(K, Basis)` arbeitet mit Klassen, `isinstance(obj, Basis)` mit Objekten. Jede Klasse gilt als Unterklasse von sich selbst. Als zweites Argument geht auch ein Tupel oder eine Union (`int | str`). Abstrakte Basisklassen aus `collections.abc` erkennen auch Klassen, die nur registriert sind oder die passenden Methoden haben.",
    syntax: "issubclass(klasse, basis)\nissubclass(klasse, (basis1, basis2))",
    example: e(`
from collections.abc import Sequence

class Tier: pass
class Hund(Tier): pass

print(issubclass(Hund, Tier))          # True
print(issubclass(Tier, Hund))          # False
print(issubclass(Hund, Hund))          # True – jede Klasse zu sich selbst
print(issubclass(bool, int | str))     # True – bool erbt von int
print(issubclass(list, Sequence))      # True – über abc
try:
    issubclass(Hund(), Tier)
except TypeError:
    print("erstes Argument muss eine Klasse sein")
`),
    tip: "Für Objekte ist `isinstance()` die richtige Funktion; `issubclass(type(obj), K)` ist nur ein Umweg.",
    keywords: ['unterklasse prüfen', 'subclass check', 'vererbung prüfen', 'klassenhierarchie', 'issubclass'],
    related: ['isinstance()', 'Vererbung', 'Abstrakte Klassen (abc)'],
    mdn: D + 'functions.html#issubclass'
  },
  {
    lang: 'py', group: 'Vererbung', name: 'Abstrakte Klassen (abc)',
    desc: "Basisklassen mit @abstractmethod, die nicht direkt instanziiert werden können.",
    details: "Eine Klasse, die von `ABC` erbt und mindestens eine `@abstractmethod` hat, lässt sich nicht instanziieren. Erst Unterklassen, die alle abstrakten Methoden implementieren, sind verwendbar. Der Fehler tritt beim Erzeugen des Objekts auf, nicht beim Aufruf. Abstrakte Methoden dürfen trotzdem Code enthalten, der über `super()` nutzbar ist.",
    syntax: "from abc import ABC, abstractmethod\n\nclass Basis(ABC):\n    @abstractmethod\n    def methode(self): ...",
    example: e(`
from abc import ABC, abstractmethod

class Form(ABC):
    @abstractmethod
    def flaeche(self) -> float: ...

    def beschreibung(self):              # konkrete Methode
        return f"{type(self).__name__} mit Fläche {self.flaeche()}"

class Quadrat(Form):
    def __init__(self, a):
        self.a = a
    def flaeche(self):
        return self.a ** 2

print(Quadrat(3).beschreibung())   # Quadrat mit Fläche 9
try:
    Form()
except TypeError as e:
    print(e)  # Can't instantiate abstract class Form without an implementation for abstract method 'flaeche'
`),
    tip: "Muss eine Klasse nur bestimmte Methoden haben, ohne zu erben, ist `typing.Protocol` die leichtere Alternative (strukturelle Typisierung).",
    keywords: ['abstrakt', 'abstract', 'abc', 'abstractmethod', 'interface', 'schnittstelle', 'abstract base class'],
    related: ['typing.Protocol', 'Vererbung', 'Methoden überschreiben'],
    mdn: D + 'abc.html'
  },
  {
    lang: 'py', group: 'Vererbung', name: 'Mixins',
    desc: "Kleine Klassen, die per Mehrfachvererbung einzelne Fähigkeiten beisteuern.",
    details: "Ein Mixin ist nicht zur alleinigen Verwendung gedacht, sondern liefert eine abgeschlossene Zusatzfunktion wie Serialisierung, Vergleich oder Logging. Es hat meist kein eigenes `__init__` und keinen eigenen Zustand. Mixins stehen in der Klassendefinition links von der eigentlichen Basisklasse, damit ihre Methoden in der MRO zuerst gefunden werden.",
    syntax: "class Klasse(MixinA, MixinB, Basis): ...",
    example: e(`
import json

class JsonMixin:
    def als_json(self):
        return json.dumps(vars(self), ensure_ascii=False)

class ReprMixin:
    def __repr__(self):
        felder = ", ".join(f"{k}={v!r}" for k, v in vars(self).items())
        return f"{type(self).__name__}({felder})"

class Kunde(JsonMixin, ReprMixin):
    def __init__(self, name, ort):
        self.name, self.ort = name, ort

k = Kunde("Jörg", "Köln")
print(k.als_json())   # {"name": "Jörg", "ort": "Köln"}
print(k)              # Kunde(name='Jörg', ort='Köln')
`),
    tip: "Mixins mit der Endung `Mixin` benennen, damit klar ist, dass sie allein keinen Sinn ergeben.",
    keywords: ['mixin', 'mix-in', 'mehrfachvererbung', 'trait', 'komposition', 'zusatzfunktion'],
    related: ['Mehrfachvererbung & MRO', 'Vererbung', 'vars() & __dict__'],
    mdn: T + 'classes.html#multiple-inheritance'
  },
  {
    lang: 'py', group: 'Vererbung', name: 'Methoden überschreiben',
    desc: "Eine geerbte Methode in der Unterklasse neu definieren oder mit super() erweitern.",
    details: "Definiert eine Unterklasse eine Methode mit demselben Namen, wird diese statt der geerbten verwendet, auch wenn die Basisklasse sie selbst aufruft (Polymorphie). Mit `super().methode()` lässt sich das Verhalten der Basis einbinden. Eine Basismethode, die `NotImplementedError` wirft, zwingt Unterklassen zum Überschreiben, allerdings erst zur Laufzeit.",
    example: e(`
class Bericht:
    def kopf(self):
        return "BERICHT"
    def rumpf(self):
        raise NotImplementedError     # Unterklassen müssen liefern
    def erzeugen(self):               # ruft die überschriebenen Methoden auf
        return f"{self.kopf()}: {self.rumpf()}"

class Umsatz(Bericht):
    def rumpf(self):                  # ersetzt
        return "1.234 €"
    def kopf(self):                   # erweitert
        return super().kopf() + " (Q3)"

print(Umsatz().erzeugen())   # BERICHT (Q3): 1.234 €
`),
    tip: "Mit `@typing.override` (seit Python 3.12) markiert man überschriebene Methoden; Type Checker melden dann Tippfehler im Methodennamen.",
    keywords: ['überschreiben', 'override', 'polymorphie', 'polymorphism', 'template method', 'notimplementederror'],
    related: ['@typing.override', 'super()', 'Vererbung', 'Abstrakte Klassen (abc)'],
    mdn: T + 'classes.html#inheritance'
  },
  {
    lang: 'py', group: 'Vererbung', name: '__init_subclass__',
    desc: "Hook in der Basisklasse, der bei jeder neuen Unterklasse aufgerufen wird.",
    details: "`__init_subclass__` ist implizit eine Klassenmethode und bekommt die neue Unterklasse als `cls`. Schlüsselwortargumente aus der Klassendefinition (`class X(Basis, name=\"x\")`) kommen als Parameter an. Damit lassen sich Plugins registrieren oder Unterklassen prüfen, ohne Metaklassen zu schreiben. Restliche Argumente sollte man an `super().__init_subclass__(**kwargs)` weiterreichen.",
    syntax: "class Basis:\n    def __init_subclass__(cls, /, **kwargs):\n        super().__init_subclass__(**kwargs)\n        ...",
    example: e(`
class Exporter:
    formate: dict[str, type] = {}

    def __init_subclass__(cls, /, format, **kwargs):
        super().__init_subclass__(**kwargs)
        Exporter.formate[format] = cls

class CsvExporter(Exporter, format="csv"):
    pass

class PdfExporter(Exporter, format="pdf"):
    pass

print(list(Exporter.formate))              # ['csv', 'pdf']
print(Exporter.formate["pdf"].__name__)    # PdfExporter
`),
    tip: "Für die meisten Fälle, in denen man früher eine Metaklasse brauchte, reicht `__init_subclass__` oder ein Klassen-Dekorator.",
    keywords: ['init_subclass', 'unterklasse registrieren', 'plugin', 'registry', 'metaklasse', 'metaclass', 'hook'],
    related: ['Klassen-Dekorator', 'Vererbung', '@classmethod'],
    mdn: R + 'datamodel.html#object.__init_subclass__'
  },

  // ---------------- Dataclasses ----------------
  {
    lang: 'py', group: 'Dataclasses', name: '@dataclass',
    desc: "Erzeugt __init__, __repr__ und __eq__ automatisch aus annotierten Klassenfeldern.",
    details: "`@dataclass` liest die Klassenattribute mit Typ-Annotation in Reihenfolge und baut daraus Konstruktor, Darstellung und Gleichheitsvergleich. Felder mit Standardwert müssen hinter Feldern ohne stehen. Die Typen werden nicht geprüft, sie sind nur nötig, damit das Feld erkannt wird. Über Parameter wie `frozen`, `order`, `slots` und `kw_only` lässt sich das Verhalten anpassen.",
    syntax: "@dataclass(frozen=False, order=False, slots=False, kw_only=False)\nclass Name:\n    feld: Typ\n    feld2: Typ = standard",
    values: [
      ["init", "__init__ erzeugen (Standard True)"],
      ["repr / eq", "__repr__ / __eq__ erzeugen (Standard True)"],
      ["order", "<, <=, >, >= nach Feldreihenfolge"],
      ["frozen", "Unveränderlich und hashbar"],
      ["slots", "__slots__ statt __dict__"],
      ["kw_only", "Alle Felder nur per Schlüsselwort"]
    ],
    example: e(`
from dataclasses import dataclass

@dataclass
class Artikel:
    name: str
    preis: float
    menge: int = 1

    def gesamt(self) -> float:
        return self.preis * self.menge

a = Artikel("Stift", 1.5, 4)
print(a)                               # Artikel(name='Stift', preis=1.5, menge=4)
print(a.gesamt())                      # 6.0
print(a == Artikel("Stift", 1.5, 4))   # True
`),
    tip: "Ein Attribut ohne Annotation (`rabatt = 0.1`) ist kein Feld, sondern ein normales Klassenattribut. Konstanten markiert man mit `typing.ClassVar`.",
    keywords: ['dataclass', 'datenklasse', 'record', 'struct', 'boilerplate', 'pojo', 'dto', 'datenobjekt'],
    related: ['dataclasses.field()', 'frozen=True', 'collections.namedtuple', 'typing.TypedDict'],
    mdn: D + 'dataclasses.html#dataclasses.dataclass'
  },
  {
    lang: 'py', group: 'Dataclasses', name: 'dataclasses.field()',
    desc: "Feineinstellung einzelner Felder: Factory-Standardwerte, repr, Vergleich, init.",
    details: "Veränderliche Standardwerte wie `[]` sind in Dataclasses verboten (`ValueError`); stattdessen `field(default_factory=list)`. Mit `repr=False` taucht ein Feld nicht in der Ausgabe auf, mit `compare=False` zählt es nicht für `==`, mit `init=False` steht es nicht im Konstruktor. `metadata` nimmt beliebige Zusatzinfos für eigene Werkzeuge auf.",
    syntax: "feld: Typ = field(default=..., default_factory=..., repr=True, compare=True, init=True, kw_only=...)",
    values: [
      ["default", "Fester Standardwert"],
      ["default_factory", "Funktion, die pro Instanz einen Standardwert liefert"],
      ["init=False", "Nicht im __init__ (z. B. in __post_init__ berechnet)"],
      ["repr=False", "Nicht in der Textdarstellung (z. B. Passwörter)"],
      ["compare=False", "Nicht für == und Sortierung"],
      ["kw_only=True", "Nur per Schlüsselwort"]
    ],
    example: e(`
from dataclasses import dataclass, field

@dataclass
class Warenkorb:
    kunde: str
    positionen: list[str] = field(default_factory=list)   # nie = []
    id: int = field(default=0, repr=False, compare=False)

a = Warenkorb("Ada")
b = Warenkorb("Bob")
a.positionen.append("Buch")
print(a)                  # Warenkorb(kunde='Ada', positionen=['Buch'])
print(b.positionen)       # []
print(Warenkorb("X", id=1) == Warenkorb("X", id=2))   # True
`),
    tip: "`default_factory` bekommt die Funktion selbst, nicht ihren Aufruf: `default_factory=list`, nicht `list()`.",
    keywords: ['field', 'default_factory', 'standardwert', 'feldoptionen', 'repr false', 'compare', 'metadata'],
    related: ['@dataclass', 'Veränderliche Standardwerte (Fallstrick)', '__post_init__'],
    mdn: D + 'dataclasses.html#dataclasses.field'
  },
  {
    lang: 'py', group: 'Dataclasses', name: 'frozen=True',
    desc: "Macht Dataclass-Instanzen unveränderlich und damit hashbar.",
    details: "Mit `@dataclass(frozen=True)` wirft jede Zuweisung an ein Feld `FrozenInstanceError`. Weil `eq` und `frozen` zusammen ein `__hash__` erzeugen, lassen sich die Objekte in Sets und als Dict-Schlüssel verwenden. Geänderte Kopien erzeugt man mit `dataclasses.replace()` oder seit Python 3.13 mit `copy.replace()`. Enthaltene Listen bleiben trotzdem veränderlich.",
    syntax: "@dataclass(frozen=True)",
    example: e(`
from dataclasses import dataclass, replace, FrozenInstanceError

@dataclass(frozen=True)
class Punkt:
    x: int
    y: int

p = Punkt(1, 2)
try:
    p.x = 5
except FrozenInstanceError as e:
    print("Fehler:", e)        # Fehler: cannot assign to field 'x'

q = replace(p, x=5)            # neue Instanz mit geändertem Feld
print(q)                       # Punkt(x=5, y=2)
print({p: "Start"}[Punkt(1, 2)])   # Start – hashbar
`),
    tip: "In `__post_init__` einer frozen Dataclass setzt man abgeleitete Felder mit `object.__setattr__(self, \"feld\", wert)`.",
    keywords: ['frozen', 'unveränderlich', 'immutable', 'hashbar', 'hashable', 'replace', 'value object', 'wertobjekt'],
    related: ['@dataclass', '__eq__ & __hash__', 'Veränderlich & unveränderlich', 'typing.Final'],
    mdn: D + 'dataclasses.html#frozen-instances'
  },
  {
    lang: 'py', group: 'Dataclasses', name: '__post_init__',
    desc: "Wird nach dem generierten __init__ aufgerufen: prüfen und abgeleitete Felder setzen.",
    details: "Da `@dataclass` das `__init__` selbst schreibt, gehört eigene Initialisierungslogik in `__post_init__`. Dort kann man Werte validieren, normalisieren oder Felder mit `field(init=False)` berechnen. Mit `dataclasses.InitVar` lassen sich Parameter übergeben, die nur für `__post_init__` gedacht sind und kein Feld werden.",
    syntax: "def __post_init__(self):\n    ...",
    example: e(`
from dataclasses import dataclass, field

@dataclass
class Rechnung:
    netto: float
    steuersatz: float = 0.19
    brutto: float = field(init=False)

    def __post_init__(self):
        if self.netto < 0:
            raise ValueError("netto darf nicht negativ sein")
        self.brutto = round(self.netto * (1 + self.steuersatz), 2)

print(Rechnung(100))   # Rechnung(netto=100, steuersatz=0.19, brutto=119.0)
try:
    Rechnung(-1)
except ValueError as e:
    print(e)           # netto darf nicht negativ sein
`),
    tip: "Ein selbst geschriebenes `__init__` in einer Dataclass ersetzt das generierte vollständig; dann lieber `__post_init__` verwenden.",
    keywords: ['post_init', 'validierung', 'validation', 'initvar', 'abgeleitetes feld', 'dataclass init'],
    related: ['@dataclass', 'dataclasses.field()', '__init__'],
    mdn: D + 'dataclasses.html#post-init-processing'
  },
  {
    lang: 'py', group: 'Dataclasses', name: 'dataclasses.asdict()',
    desc: "Wandelt eine Dataclass rekursiv in ein Dictionary um, z. B. für JSON.",
    details: "`asdict()` geht auch in verschachtelte Dataclasses, Listen, Tupel und Dicts hinein und kopiert die Werte tief. `astuple()` macht dasselbe mit Tupeln. Für die Rückrichtung gibt es keine eingebaute Funktion; `Klasse(**dct)` funktioniert nur bei flachen Strukturen. `dataclasses.fields()` listet die Felder samt Metadaten.",
    syntax: "asdict(obj)\nastuple(obj)\nfields(obj)",
    example: e(`
from dataclasses import dataclass, asdict, astuple
import json

@dataclass
class Adresse:
    ort: str
    plz: str

@dataclass
class Person:
    name: str
    adresse: Adresse

p = Person("Ada", Adresse("Berlin", "10115"))
print(asdict(p))       # {'name': 'Ada', 'adresse': {'ort': 'Berlin', 'plz': '10115'}}
print(astuple(p))      # ('Ada', ('Berlin', '10115'))
print(json.dumps(asdict(p)))
# {"name": "Ada", "adresse": {"ort": "Berlin", "plz": "10115"}}
`),
    tip: "Felder mit `datetime` oder `Decimal` muss man für `json.dumps` noch selbst umwandeln, z. B. mit `default=str`.",
    keywords: ['asdict', 'astuple', 'dict', 'serialisieren', 'serialize', 'json', 'umwandeln', 'fields'],
    related: ['@dataclass', 'json.dumps()', 'vars() & __dict__'],
    mdn: D + 'dataclasses.html#dataclasses.asdict'
  },
  {
    lang: 'py', group: 'Dataclasses', name: 'slots=True & kw_only',
    desc: "Dataclass mit __slots__ (weniger Speicher) und Felder nur per Schlüsselwort.",
    details: "`slots=True` erzeugt eine Klasse mit `__slots__`, also ohne `__dict__`: weniger Speicher, schnellerer Zugriff, keine Tippfehler-Attribute. `kw_only=True` macht alle Felder zu Nur-Keyword-Parametern; das löst auch das Problem, dass Felder ohne Standardwert nach solchen mit Standardwert stehen. Mit dem Pseudo-Feld `_: KW_ONLY` gilt das nur für die nachfolgenden Felder.",
    syntax: "@dataclass(slots=True, kw_only=True)\n\nclass K:\n    a: int\n    _: KW_ONLY\n    b: int = 0",
    example: e(`
from dataclasses import dataclass, KW_ONLY

@dataclass(slots=True, kw_only=True)
class Optionen:
    timeout: float = 5.0
    retries: int = 3

@dataclass
class Anfrage:
    url: str
    _: KW_ONLY                    # alles danach nur per Schlüsselwort
    methode: str = "GET"
    body: str | None = None

o = Optionen(retries=1)
print(o)                                # Optionen(timeout=5.0, retries=1)
print(hasattr(o, "__dict__"))           # False
print(Anfrage("/api", methode="POST"))  # Anfrage(url='/api', methode='POST', body=None)
try:
    Optionen(1.0)
except TypeError as e:
    print(e)  # Optionen.__init__() takes 1 positional argument but 2 were given
`),
    tip: "Bei Datenklassen mit vielen optionalen Feldern ist `kw_only=True` fast immer sinnvoll: Aufrufe bleiben lesbar und neue Felder brechen keine bestehenden Aufrufe.",
    keywords: ['slots', 'kw_only', 'keyword only', 'KW_ONLY', 'speicher', 'dataclass optionen'],
    related: ['__slots__', '@dataclass', 'Nur-Positions- & Nur-Keyword-Parameter'],
    mdn: D + 'dataclasses.html#dataclasses.KW_ONLY'
  },

  // ---------------- Enums ----------------
  {
    lang: 'py', group: 'Enums', name: 'enum.Enum',
    desc: "Aufzählungstyp mit festen, benannten Konstanten (Mitgliedern).",
    details: "Jedes Mitglied hat `name` und `value` und ist ein Singleton, deshalb vergleicht man mit `is` oder `==`. Ein normales `Enum`-Mitglied ist nicht gleich seinem Wert (`Status.OFFEN == 1` ist `False`). Zugriff geht per Attribut, per Wert (`Status(1)`) und per Name (`Status[\"OFFEN\"]`). Über die Klasse kann man in Definitionsreihenfolge iterieren.",
    syntax: "class Name(Enum):\n    MITGLIED = wert",
    example: e(`
from enum import Enum

class Status(Enum):
    OFFEN = 1
    IN_ARBEIT = 2
    ERLEDIGT = 3

s = Status.OFFEN
print(s)                     # Status.OFFEN
print(s.name, s.value)       # OFFEN 1
print(Status(3))             # Status.ERLEDIGT
print(Status["IN_ARBEIT"])   # Status.IN_ARBEIT
print(s == 1)                # False – kein int
print([m.name for m in Status])   # ['OFFEN', 'IN_ARBEIT', 'ERLEDIGT']

match s:
    case Status.OFFEN:
        print("noch zu tun")  # noch zu tun
`),
    tip: "Enums statt loser String- oder Zahlenkonstanten verwenden: Tippfehler fallen sofort als `AttributeError` auf, und Type Checker prüfen `match` auf Vollständigkeit.",
    keywords: ['enum', 'enumeration', 'aufzählung', 'konstanten', 'auswahl', 'status', 'mitglied', 'member'],
    related: ['enum.auto()', 'enum.StrEnum', 'match', 'typing.Literal'],
    mdn: D + 'enum.html#enum.Enum'
  },
  {
    lang: 'py', group: 'Enums', name: 'enum.auto()',
    desc: "Vergibt Enum-Werte automatisch, statt sie von Hand durchzunummerieren.",
    details: "Bei `Enum` liefert `auto()` aufsteigende Zahlen ab 1, bei `StrEnum` den kleingeschriebenen Namen, bei `Flag` Zweierpotenzen. Das Verhalten lässt sich mit der statischen Methode `_generate_next_value_` ändern, die vor den Mitgliedern stehen muss. Man nutzt `auto()`, wenn der konkrete Wert keine Bedeutung hat.",
    syntax: "MITGLIED = auto()",
    example: e(`
from enum import Enum, auto

class Farbe(Enum):
    ROT = auto()
    GRUEN = auto()
    BLAU = auto()

print([f.value for f in Farbe])   # [1, 2, 3]

class Richtung(Enum):
    @staticmethod
    def _generate_next_value_(name, start, count, last_values):
        return name.lower()       # Wert = Name in Kleinbuchstaben
    NORD = auto()
    SUED = auto()

print(Richtung.NORD.value)        # nord
`),
    tip: "Werden Enum-Werte gespeichert (Datenbank, JSON), besser feste Werte vergeben: Ein neues Mitglied in der Mitte verschiebt sonst alle `auto()`-Nummern.",
    keywords: ['auto', 'automatische werte', 'auto value', 'nummerierung', 'enum wert', '_generate_next_value_'],
    related: ['enum.Enum', 'enum.Flag', 'enum.StrEnum'],
    mdn: D + 'enum.html#enum.auto'
  },
  {
    lang: 'py', group: 'Enums', name: 'enum.IntEnum',
    desc: "Enum, dessen Mitglieder echte ints sind: vergleichbar und rechenbar.",
    details: "`IntEnum`-Mitglieder erben von `int` und lassen sich daher mit Zahlen vergleichen, sortieren und in Rechnungen verwenden. Seit Python 3.11 liefert `str()` den reinen Zahlenwert, `repr()` aber weiterhin `<Klasse.NAME: wert>`. Das ist praktisch für HTTP-Status oder Prioritäten, schwächt aber die Typsicherheit gegenüber `Enum`.",
    syntax: "class Name(IntEnum):\n    A = 1",
    example: e(`
from enum import IntEnum

class Prioritaet(IntEnum):
    NIEDRIG = 1
    MITTEL = 2
    HOCH = 3

print(Prioritaet.HOCH > Prioritaet.NIEDRIG)   # True
print(Prioritaet.MITTEL == 2)                 # True
print(Prioritaet.HOCH + 1)                    # 4
print(Prioritaet.HOCH, repr(Prioritaet.HOCH)) # 3 <Prioritaet.HOCH: 3>
print(max(Prioritaet).name)                   # HOCH
`),
    tip: "`http.HTTPStatus` ist ein fertiges `IntEnum`: `HTTPStatus.NOT_FOUND == 404` ist `True`.",
    keywords: ['intenum', 'int enum', 'ganzzahl', 'vergleichbar', 'priorität', 'status code', 'httpstatus'],
    related: ['enum.Enum', 'enum.StrEnum', 'int'],
    mdn: D + 'enum.html#enum.IntEnum'
  },
  {
    lang: 'py', group: 'Enums', name: 'enum.StrEnum',
    desc: "Enum, dessen Mitglieder echte Strings sind; auto() liefert den Namen klein.",
    details: "`StrEnum`-Mitglieder erben von `str`, vergleichen sich also direkt mit Strings und lassen sich ohne `.value` in f-Strings, JSON oder Datenbankabfragen einsetzen. `str()` und `format()` liefern den Wert. Alle Werte müssen Strings sein.",
    syntax: "class Name(StrEnum):\n    A = auto()   # 'a'",
    example: e(`
from enum import StrEnum, auto
import json

class Methode(StrEnum):
    GET = auto()          # Wert: 'get'
    POST = auto()
    PUT = "PUT"

print(Methode.GET)                    # get
print(Methode.PUT == "PUT")           # True
print(f"Aufruf per {Methode.POST}")   # Aufruf per post
print(Methode("get") is Methode.GET)  # True
print(json.dumps({"m": Methode.GET})) # {"m": "get"}
`),
    tip: "Ideal für Werte, die aus Konfiguration oder JSON kommen: `Methode(text)` wirft bei unbekannten Strings sofort `ValueError`.",
    keywords: ['strenum', 'string enum', 'str enum', 'text konstanten', 'json enum'],
    related: ['enum.Enum', 'enum.auto()', 'typing.Literal'],
    mdn: D + 'enum.html#enum.StrEnum'
  },
  {
    lang: 'py', group: 'Enums', name: 'enum.Flag',
    desc: "Enum für kombinierbare Schalter, die man mit | verknüpft und mit in prüft.",
    details: "`Flag`-Mitglieder sind Bitwerte; `auto()` vergibt 1, 2, 4, 8 … Mit `|` kombiniert man sie, mit `&` bildet man die Schnittmenge, mit `in` prüft man, ob ein Flag enthalten ist. Kombinationen kann man iterieren. `IntFlag` verhält sich zusätzlich wie ein `int`.",
    syntax: "class Name(Flag):\n    A = auto()\n    B = auto()\n\nkombi = Name.A | Name.B",
    example: e(`
from enum import Flag, auto

class Recht(Flag):
    LESEN = auto()
    SCHREIBEN = auto()
    AUSFUEHREN = auto()

r = Recht.LESEN | Recht.SCHREIBEN
print(r)                       # Recht.LESEN|SCHREIBEN
print(Recht.SCHREIBEN in r)    # True
print(Recht.AUSFUEHREN in r)   # False
print(r.value)                 # 3
print([m.name for m in r])     # ['LESEN', 'SCHREIBEN']
print(bool(Recht(0)))          # False – keine Rechte
`),
    tip: "Häufige Kombinationen direkt im Enum definieren: `ALLE = LESEN | SCHREIBEN | AUSFUEHREN`.",
    keywords: ['flag', 'intflag', 'bitflags', 'bitmaske', 'bitmask', 'rechte', 'permissions', 'kombinieren'],
    related: ['enum.Enum', 'enum.auto()', 'Bitoperatoren'],
    mdn: D + 'enum.html#enum.Flag'
  },

  // ---------------- Typ-Hinweise ----------------
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'Typ-Annotationen',
    desc: "Optionale Typangaben für Variablen, Attribute und Funktionen (Type Hints).",
    details: "Annotationen wie `name: str = \"Ada\"` dokumentieren den erwarteten Typ und werden von Type Checkern (mypy, pyright) und IDEs ausgewertet. Python ignoriert sie zur Laufzeit; falsche Typen führen zu keinem Fehler. Eine Annotation ohne Zuweisung (`x: int`) legt keine Variable an. Seit Python 3.14 werden Annotationen verzögert ausgewertet, Vorwärtsverweise auf später definierte Klassen brauchen daher keine Anführungszeichen mehr.",
    syntax: "variable: Typ = wert\nclass K:\n    attribut: Typ",
    example: e(`
from typing import get_type_hints

name: str = "Ada"
preise: dict[str, float] = {"Kaffee": 2.5}
noch_leer: list[int]              # nur Annotation, keine Variable

class Kunde:
    id: int
    email: str | None = None

print(get_type_hints(Kunde))      # {'id': <class 'int'>, 'email': str | None}

alter: int = 36
alter = "sechsunddreißig"         # läuft trotzdem – Python prüft nicht
print(alter)                      # sechsunddreißig
`),
    tip: "Typ-Hinweise lohnen sich vor allem an Schnittstellen (Funktionssignaturen, Klassenattribute). Lokale Variablen leitet der Type Checker meist selbst ab.",
    keywords: ['type hints', 'typhinweise', 'typisierung', 'annotation', 'statische typen', 'typing', 'pep 484', 'pep 526'],
    related: ['Funktions-Annotationen', 'mypy', 'Generische Container (list[int])', 'X | None (Optional)'],
    mdn: D + 'typing.html'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'X | None (Optional)',
    desc: "Typ für Werte, die auch None sein dürfen; ersetzt Optional[X].",
    details: "`str | None` bedeutet „ein String oder `None`“ und ist gleichbedeutend mit dem älteren `Optional[str]`. Type Checker verlangen dann vor dem Zugriff auf String-Methoden eine Prüfung wie `if wert is not None`. Achtung: `Optional` bedeutet nicht „optionaler Parameter“; ein Parameter wird erst durch einen Standardwert optional.",
    syntax: "def f(x: int | None = None) -> str | None: ...",
    example: e(`
def finde(benutzer: dict[int, str], id: int) -> str | None:
    return benutzer.get(id)

namen = {1: "Ada"}
treffer = finde(namen, 2)
if treffer is not None:       # Type Checker verlangt diese Prüfung
    print(treffer.upper())
else:
    print("nicht gefunden")   # nicht gefunden

print(finde(namen, 1))        # Ada
print(str | None)             # str | None
`),
    tip: "Mit `if not wert:` statt `if wert is None:` werden auch leere Strings und `0` aussortiert – meist unbeabsichtigt.",
    keywords: ['optional', 'none', 'nullable', 'oder none', 'union none', 'optionaler typ', 'pep 604'],
    related: ['Union', 'None', 'Typ-Annotationen'],
    mdn: D + 'stdtypes.html#types-union'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'Generische Container (list[int])',
    desc: "Elementtypen für Listen, Dicts, Tupel und Co. direkt mit eckigen Klammern angeben.",
    details: "Seit Python 3.9 lassen sich eingebaute Typen direkt parametrisieren: `list[int]`, `dict[str, float]`, `set[str]`, `tuple[int, str]` (feste Länge) oder `tuple[int, ...]` (beliebige Länge). `typing.List` und Co. sind veraltet. Für Parameter sind die abstrakten Typen aus `collections.abc` wie `Sequence`, `Iterable` und `Mapping` oft besser, weil sie mehr Eingaben akzeptieren.",
    values: [
      ["list[int]", "Liste von ints"],
      ["dict[str, float]", "Schlüssel str, Werte float"],
      ["tuple[int, str]", "Tupel mit genau zwei Elementen"],
      ["tuple[int, ...]", "Tupel beliebiger Länge"],
      ["Iterable[str]", "Alles, worüber man iterieren kann"],
      ["Sequence[float]", "Liste, Tupel, … mit Index und len"],
      ["Mapping[str, int]", "Lesbares Dict-artiges Objekt"]
    ],
    example: e(`
from collections.abc import Iterable, Sequence

def mittelwert(werte: Sequence[float]) -> float:
    return sum(werte) / len(werte)

def zaehle(woerter: Iterable[str]) -> dict[str, int]:
    ergebnis: dict[str, int] = {}
    for w in woerter:
        ergebnis[w] = ergebnis.get(w, 0) + 1
    return ergebnis

punkt: tuple[int, int] = (3, 4)
print(mittelwert([1, 2, 3]))       # 2.0
print(mittelwert((4.0, 6.0)))      # 5.0
print(zaehle(["a", "b", "a"]))     # {'a': 2, 'b': 1}
print(list[int], tuple[str, ...])  # list[int] tuple[str, ...]
`),
    tip: "Faustregel: Parameter möglichst allgemein (`Iterable`, `Sequence`, `Mapping`), Rückgabewerte möglichst konkret (`list`, `dict`).",
    keywords: ['generics', 'generisch', 'list[int]', 'dict[str, int]', 'collections.abc', 'sequence', 'iterable', 'pep 585'],
    related: ['Typ-Annotationen', 'Generische Funktionen & Klassen (PEP 695)', 'list', 'dict'],
    mdn: D + 'stdtypes.html#types-genericalias'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'Union',
    desc: "Wert kann einer von mehreren Typen sein: int | str (früher Union[int, str]).",
    details: "Der Operator `|` bildet seit Python 3.10 Union-Typen, `Union[int, str]` aus `typing` ist die ältere Schreibweise. Vor typspezifischen Operationen muss man den Typ eingrenzen, etwa mit `isinstance()`; Type Checker verstehen diese Prüfungen (Narrowing). `int | str` funktioniert auch direkt in `isinstance()`.",
    syntax: "x: int | str\nx: Union[int, str]   # älter",
    example: e(`
def als_text(wert: int | float | str) -> str:
    if isinstance(wert, str):
        return wert                    # hier ist wert: str
    return f"{wert:,}"                 # hier: int | float

print(als_text(1234567))               # 1,234,567
print(als_text("x"))                   # x
print(isinstance(3.5, int | float))    # True
`),
    tip: "Viele Union-Typen in einer Signatur sind oft ein Hinweis, dass ein Protokoll, eine gemeinsame Basisklasse oder `@singledispatch` besser passt.",
    keywords: ['union', 'oder typ', 'mehrere typen', 'pipe', 'type narrowing', 'eingrenzen', 'pep 604'],
    related: ['X | None (Optional)', 'isinstance()', 'typing.Literal', 'typing.TypeIs'],
    mdn: D + 'typing.html#typing.Union'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'Callable',
    desc: "Typ für Funktionen und andere aufrufbare Objekte: Callable[[int, str], bool].",
    details: "`Callable[[Param1, Param2], Rückgabe]` beschreibt Parameter- und Rückgabetypen einer Funktion; `Callable[..., T]` akzeptiert beliebige Parameter. Man importiert es aus `collections.abc` (`typing.Callable` ist veraltet). Für Schlüsselwortparameter oder Überladungen reicht `Callable` nicht, dann definiert man ein `Protocol` mit `__call__`.",
    syntax: "Callable[[ArgTyp1, ArgTyp2], RückgabeTyp]\nCallable[..., RückgabeTyp]",
    example: e(`
from collections.abc import Callable

def anwenden(f: Callable[[int, int], int], a: int, b: int) -> int:
    return f(a, b)

def multiplizierer(faktor: int) -> Callable[[int], int]:
    return lambda x: x * faktor

print(anwenden(max, 3, 7))                 # 7
print(anwenden(lambda a, b: a - b, 3, 7))  # -4
print(multiplizierer(3)(5))                # 15
`),
    tip: "Für Dekoratoren, die die Signatur erhalten sollen, nutzt man `ParamSpec`: `def deko[**P, R](f: Callable[P, R]) -> Callable[P, R]`.",
    keywords: ['callable', 'funktionstyp', 'callback', 'function type', 'paramspec', 'aufrufbar'],
    related: ['Funktionen als Objekte', 'typing.Protocol', 'callable()'],
    mdn: D + 'typing.html#annotating-callable-objects'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'Generische Funktionen & Klassen (PEP 695)',
    desc: "Typparameter direkt in eckigen Klammern: def f[T](x: T) -> T, class Box[T].",
    details: "Seit Python 3.12 schreibt man Typparameter direkt hinter den Namen von Funktion oder Klasse, ohne `TypeVar` und `Generic`. `[T: Basis]` setzt eine Obergrenze, `[T: (int, float)]` erlaubt nur bestimmte Typen. Der Type Checker setzt beim Aufruf den konkreten Typ ein, sodass etwa `erstes([\"a\"])` als `str` erkannt wird. Zur Laufzeit gibt es keine Prüfung.",
    syntax: "def f[T](x: T) -> T: ...\nclass K[T]: ...\ndef g[T: Basis](x: T) -> T: ...",
    example: e(`
def erstes[T](xs: list[T]) -> T:
    return xs[0]

class Stapel[T]:
    def __init__(self) -> None:
        self._items: list[T] = []
    def push(self, item: T) -> None:
        self._items.append(item)
    def pop(self) -> T:
        return self._items.pop()

def groesstes[N: (int, float)](a: N, b: N) -> N:   # nur int oder float
    return a if a > b else b

s = Stapel[int]()
s.push(1)
s.push(2)
print(s.pop())                  # 2
print(erstes(["a", "b"]))       # a
print(groesstes(2.5, 1.0))      # 2.5
print(Stapel.__type_params__)   # (T,)
`),
    tip: "Älterer Code nutzt `T = TypeVar(\"T\")` und `class Stapel(Generic[T])`; das funktioniert weiter, die neue Syntax ist aber kürzer und lokal gültig.",
    keywords: ['generics', 'typvariable', 'typevar', 'generic', 'typparameter', 'type parameter', 'pep 695', 'vorlage'],
    related: ['type (Typ-Alias)', 'Generische Container (list[int])', 'typing.Protocol'],
    mdn: R + 'compound_stmts.html#type-params'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'type (Typ-Alias)',
    desc: "Benennt einen komplexen Typ mit der type-Anweisung: type Punkt = tuple[float, float].",
    details: "Seit Python 3.12 definiert `type Name = ...` einen Typ-Alias, der verzögert ausgewertet wird; dadurch sind rekursive Aliase und Typparameter (`type Paar[T] = tuple[T, T]`) möglich. Der Alias ist ein `TypeAliasType`-Objekt, den eigentlichen Typ liefert `__value__`. Für `isinstance()` lässt sich ein solcher Alias nicht verwenden.",
    syntax: "type Name = Typ\ntype Name[T] = Typ_mit_T",
    example: e(`
type Punkt = tuple[float, float]
type Paar[T] = tuple[T, T]
type JSON = dict[str, JSON] | list[JSON] | str | int | float | bool | None

def abstand(a: Punkt, b: Punkt) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5

print(abstand((0, 0), (3, 4)))   # 5.0
print(Punkt)                     # Punkt
print(Punkt.__value__)           # tuple[float, float]
`),
    tip: "Nicht verwechseln mit der eingebauten Funktion `type()`, die den Typ eines Objekts liefert. Vor 3.12 schrieb man `Punkt: TypeAlias = tuple[float, float]`.",
    keywords: ['typ alias', 'type alias', 'typealias', 'type statement', 'rekursiver typ', 'pep 695', 'typname'],
    related: ['type()', 'Generische Funktionen & Klassen (PEP 695)', 'Typ-Annotationen'],
    mdn: R + 'simple_stmts.html#the-type-statement'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'typing.Protocol',
    desc: "Strukturelle Schnittstelle: Jede Klasse mit passenden Methoden erfüllt sie, ohne zu erben.",
    details: "Ein `Protocol` beschreibt, welche Methoden und Attribute ein Objekt haben muss („Duck Typing“ für den Type Checker). Klassen müssen nicht davon erben; es reicht, dass sie die Methoden passend implementieren. Mit `@runtime_checkable` funktioniert zusätzlich `isinstance()`, das aber nur das Vorhandensein der Methoden prüft, nicht deren Signatur.",
    syntax: "class Name(Protocol):\n    def methode(self, x: int) -> str: ...",
    example: e(`
from typing import Protocol, runtime_checkable

@runtime_checkable
class Zeichenbar(Protocol):
    def zeichnen(self) -> str: ...

class Kreis:                      # erbt NICHT von Zeichenbar
    def zeichnen(self) -> str:
        return "()"

class Linie:
    def zeichnen(self) -> str:
        return "--"

def alle_zeichnen(objekte: list[Zeichenbar]) -> str:
    return " ".join(o.zeichnen() for o in objekte)

print(alle_zeichnen([Kreis(), Linie()]))   # () --
print(isinstance(Kreis(), Zeichenbar))     # True
print(isinstance("text", Zeichenbar))      # False
`),
    tip: "Protokolle eignen sich besonders für Parameter, die von fremden Klassen erfüllt werden sollen, die man nicht ändern kann.",
    keywords: ['protocol', 'protokoll', 'duck typing', 'strukturelle typisierung', 'structural subtyping', 'interface', 'schnittstelle', 'pep 544'],
    related: ['Abstrakte Klassen (abc)', 'Callable', 'Generische Funktionen & Klassen (PEP 695)'],
    mdn: D + 'typing.html#typing.Protocol'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'typing.TypedDict',
    desc: "Typ für Dictionaries mit festen Schlüsseln und je eigenem Werttyp (z. B. JSON).",
    details: "Ein `TypedDict` beschreibt, welche Schlüssel ein Dict hat und welche Typen die Werte haben. Zur Laufzeit ist es ein ganz normales `dict`, ohne Prüfung. Mit `NotRequired[...]` werden einzelne Schlüssel optional, mit `total=False` alle; seit Python 3.13 markiert `ReadOnly[...]` Schlüssel als nur lesbar.",
    syntax: "class Name(TypedDict):\n    schluessel: Typ\n    optional: NotRequired[Typ]",
    example: e(`
from typing import TypedDict, NotRequired

class Benutzer(TypedDict):
    id: int
    name: str
    email: NotRequired[str]

def begruessen(b: Benutzer) -> str:
    return f"Hallo {b['name']} (#{b['id']})"

u: Benutzer = {"id": 7, "name": "Ada"}
print(begruessen(u))                       # Hallo Ada (#7)
print(type(u).__name__)                    # dict
print(sorted(Benutzer.__required_keys__))  # ['id', 'name']
`),
    tip: "Für Daten aus JSON oder APIs ist `TypedDict` passend; für eigene Objekte mit Verhalten ist eine Dataclass besser.",
    keywords: ['typeddict', 'typisiertes dict', 'json typ', 'notrequired', 'readonly', 'schema', 'pep 589'],
    related: ['dict', '@dataclass', 'Typ-Annotationen'],
    mdn: D + 'typing.html#typing.TypedDict'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'typing.Literal',
    desc: "Erlaubt nur bestimmte konkrete Werte: Literal[\"r\", \"w\", \"a\"].",
    details: "`Literal` schränkt einen Typ auf feste Werte ein, etwa Modus-Strings oder bestimmte Zahlen. Type Checker melden Aufrufe mit anderen Werten. Zur Laufzeit wird nichts geprüft; die erlaubten Werte bekommt man über `typing.get_args()`. Für viele Werte oder Werte mit Verhalten ist ein `Enum` die robustere Wahl.",
    syntax: "Literal[wert1, wert2, ...]",
    example: e(`
from typing import Literal, get_args

type Modus = Literal["r", "w", "a"]

def oeffnen(pfad: str, modus: Modus = "r") -> str:
    if modus not in get_args(Modus.__value__):   # Laufzeitprüfung selbst machen
        raise ValueError(f"ungültiger Modus: {modus}")
    return f"{pfad} im Modus {modus}"

print(oeffnen("daten.txt", "w"))    # daten.txt im Modus w
print(get_args(Modus.__value__))    # ('r', 'w', 'a')
try:
    oeffnen("x", "q")               # mypy meldet das schon vorher
except ValueError as e:
    print(e)                        # ungültiger Modus: q
`),
    tip: "In Kombination mit `match` erkennen Type Checker, ob alle Literal-Werte behandelt wurden (`assert_never` im `case _:`).",
    keywords: ['literal', 'feste werte', 'erlaubte werte', 'konstante werte', 'string literal', 'pep 586'],
    related: ['enum.StrEnum', 'Union', 'type (Typ-Alias)'],
    mdn: D + 'typing.html#typing.Literal'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'typing.Any',
    desc: "Schaltet die Typprüfung für einen Wert ab: Alles ist erlaubt, nichts wird geprüft.",
    details: "`Any` ist mit jedem Typ verträglich, in beide Richtungen; der Type Checker meldet für solche Werte keine Fehler mehr. Nicht annotierte Parameter gelten standardmäßig als `Any`. Wer nur „irgendein Objekt“ meint, nimmt besser `object`: Dann verlangt der Checker eine Prüfung, bevor man spezifische Methoden aufruft.",
    syntax: "x: Any",
    example: e(`
from typing import Any
import json

def laden(text: str) -> Any:          # Ergebnis kann alles sein
    return json.loads(text)

daten = laden('{"a": [1, 2]}')
print(daten["a"][1])                   # 2 – Checker prüft hier nichts

def beschreiben(x: object) -> str:     # object: sicherer als Any
    if isinstance(x, str):
        return x.upper()               # erst nach Prüfung erlaubt
    return repr(x)

print(beschreiben("abc"), beschreiben(3.0))   # ABC 3.0
`),
    tip: "`Any` breitet sich aus: Alles, was aus einem `Any`-Wert berechnet wird, ist wieder `Any`. Im Strict-Modus von mypy lässt sich das mit `--disallow-any-expr` aufspüren.",
    keywords: ['any', 'beliebig', 'dynamisch', 'object', 'untyped', 'typprüfung abschalten', 'escape hatch'],
    related: ['Typ-Annotationen', 'typing.cast()', 'mypy'],
    mdn: D + 'typing.html#typing.Any'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'typing.Self',
    desc: "Rückgabetyp „Instanz der eigenen Klasse“ – auch korrekt in Unterklassen.",
    details: "`Self` steht für den Typ von `self` bzw. `cls`. Gibt eine Methode `self` zurück (Fluent Interface) oder erzeugt eine `@classmethod` ein neues Objekt, erkennt der Type Checker damit in Unterklassen automatisch die Unterklasse. Ohne `Self` müsste man einen gebundenen Typparameter verwenden. Verfügbar seit Python 3.11.",
    syntax: "def methode(self) -> Self: ...",
    example: e(`
from typing import Self

class Abfrage:
    def __init__(self) -> None:
        self.teile: list[str] = []

    def wo(self, bedingung: str) -> Self:
        self.teile.append(f"WHERE {bedingung}")
        return self

    def sortiere(self, feld: str) -> Self:
        self.teile.append(f"ORDER BY {feld}")
        return self

class NutzerAbfrage(Abfrage):
    pass

q = NutzerAbfrage().wo("aktiv = 1").sortiere("name")
print(type(q).__name__)    # NutzerAbfrage
print(" ".join(q.teile))   # WHERE aktiv = 1 ORDER BY name
`),
    tip: "Ein fester Klassenname als Rückgabetyp (`-> \"Abfrage\"`) wäre in Unterklassen falsch: Der Checker würde dort die Methoden der Unterklasse nicht mehr kennen.",
    keywords: ['self', 'self type', 'eigener typ', 'fluent interface', 'method chaining', 'verkettung', 'pep 673'],
    related: ['@classmethod', 'self', 'Generische Funktionen & Klassen (PEP 695)'],
    mdn: D + 'typing.html#typing.Self'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'typing.Final',
    desc: "Markiert Namen als nicht neu zuweisbar (Konstanten) – geprüft vom Type Checker.",
    details: "`Final` kennzeichnet Variablen und Attribute, die nach der ersten Zuweisung nicht mehr verändert werden sollen; der Typ wird ohne Angabe abgeleitet. Der Dekorator `@final` verbietet das Überschreiben einer Methode oder das Ableiten von einer Klasse. Beides wirkt nur im Type Checker, Python selbst erlaubt die Änderung weiterhin.",
    syntax: "NAME: Final = wert\nNAME: Final[Typ] = wert\n@final",
    example: e(`
from typing import Final, final

MAX_VERSUCHE: Final = 3
API_URL: Final[str] = "https://example.org/api"

@final
class Konfiguration:          # darf nicht beerbt werden
    pass

class Basis:
    @final
    def id(self) -> int:      # darf nicht überschrieben werden
        return 1

MAX_VERSUCHE = 4              # mypy: Cannot assign to final name
print(MAX_VERSUCHE)           # 4 – zur Laufzeit trotzdem erlaubt
`),
    tip: "Konstanten zusätzlich in GROSSBUCHSTABEN schreiben; `Final` macht die Absicht für Werkzeuge prüfbar.",
    keywords: ['final', 'konstante', 'constant', 'unveränderlich', 'readonly', 'nicht überschreiben', 'sealed', 'pep 591'],
    related: ['Konstanten', 'frozen=True', '@typing.override'],
    mdn: D + 'typing.html#typing.Final'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'typing.overload',
    desc: "Mehrere Signaturen für eine Funktion, deren Rückgabetyp vom Argumenttyp abhängt.",
    details: "Mit `@overload` deklariert man mehrere Varianten einer Funktion nur für den Type Checker; die Rümpfe bestehen aus `...`. Danach folgt genau eine echte Implementierung ohne `@overload`, die alle Fälle abdeckt. Zur Laufzeit wird nur diese letzte Definition verwendet. Für echte Laufzeit-Verzweigung nach Typ gibt es `@functools.singledispatch`.",
    syntax: "@overload\ndef f(x: int) -> int: ...\n@overload\ndef f(x: str) -> str: ...\ndef f(x): ...  # Implementierung",
    example: e(`
from typing import overload

@overload
def verdoppeln(x: int) -> int: ...
@overload
def verdoppeln(x: str) -> str: ...

def verdoppeln(x: int | str) -> int | str:   # echte Implementierung
    return x * 2

print(verdoppeln(21))     # 42 – Checker kennt den Typ int
print(verdoppeln("ab"))   # abab – Checker kennt den Typ str
`),
    tip: "Oft reicht ein generischer Typparameter (`def verdoppeln[T: (int, str)](x: T) -> T`) statt mehrerer Überladungen.",
    keywords: ['overload', 'überladung', 'überladen', 'overloading', 'mehrere signaturen', 'rückgabetyp abhängig'],
    related: ['@functools.singledispatch', 'Generische Funktionen & Klassen (PEP 695)', 'Union'],
    mdn: D + 'typing.html#typing.overload'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: '@typing.override',
    desc: "Markiert eine Methode als Überschreibung; der Checker meldet fehlende Basismethoden.",
    details: "Seit Python 3.12 markiert `@override` Methoden, die eine Methode der Basisklasse überschreiben sollen. Wird die Basismethode umbenannt oder ist der Name falsch geschrieben, meldet der Type Checker einen Fehler, statt still eine neue Methode anzulegen. Zur Laufzeit setzt der Dekorator nur das Attribut `__override__`.",
    syntax: "from typing import override\n\n@override\ndef methode(self): ...",
    example: e(`
from typing import override

class Basis:
    def speichern(self) -> str:
        return "Basis"

class Kind(Basis):
    @override
    def speichern(self) -> str:
        return "Kind"

    # @override
    # def speicher(self) -> str: ...   # Tippfehler: mypy meldet einen Fehler

print(Kind().speichern())             # Kind
print(Kind.speichern.__override__)    # True
`),
    tip: "Mit der mypy-Option `--enable-error-code explicit-override` wird `@override` an jeder überschreibenden Methode Pflicht.",
    keywords: ['override', 'überschreiben', 'decorator', 'pep 698', 'tippfehler', 'basisklasse'],
    related: ['Methoden überschreiben', 'typing.Final', 'mypy'],
    mdn: D + 'typing.html#typing.override'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'typing.TypeIs',
    desc: "Eigene Prüffunktion, nach der der Type Checker den Typ eines Werts eingrenzt.",
    details: "Eine Funktion mit Rückgabetyp `TypeIs[T]` gibt `True` zurück, wenn ihr Argument vom Typ `T` ist. Der Type Checker grenzt den Typ danach im `if`-Zweig auf `T` und im `else`-Zweig auf den Rest ein, wie bei `isinstance()`. `TypeIs` gibt es seit Python 3.13; das ältere `TypeGuard` grenzt nur den `if`-Zweig ein.",
    syntax: "def ist_x(wert: object) -> TypeIs[X]: ...",
    example: e(`
from typing import TypeIs

def ist_text(wert: object) -> TypeIs[str]:
    return isinstance(wert, str)

def laenge(wert: int | str) -> int:
    if ist_text(wert):
        return len(wert)        # hier: str
    return wert                 # hier: int

print(laenge("Hallo"), laenge(42))   # 5 42
`),
    tip: "Die Prüffunktion muss wirklich korrekt sein: Der Checker glaubt ihr blind, ein falsches `True` führt zu Laufzeitfehlern.",
    keywords: ['typeis', 'typeguard', 'type narrowing', 'typ eingrenzen', 'prüffunktion', 'pep 742', 'type guard'],
    related: ['Union', 'isinstance()', 'typing.cast()'],
    mdn: D + 'typing.html#typing.TypeIs'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'typing.cast()',
    desc: "Sagt dem Type Checker „vertrau mir, das ist Typ X“ – ohne Umwandlung oder Prüfung.",
    details: "`cast(Typ, wert)` gibt `wert` unverändert zurück; nur der Type Checker behandelt das Ergebnis ab dann als `Typ`. Es findet weder eine Konvertierung noch eine Prüfung statt, anders als bei `int(x)`. Sinnvoll ist `cast()`, wenn man mehr weiß als der Checker, etwa bei Daten aus `json.loads()`.",
    syntax: "cast(Typ, wert)",
    example: e(`
from typing import cast
import json

roh = json.loads('{"port": 8080}')
port = cast(int, roh["port"])      # nur für den Checker
print(port + 1)                    # 8081

falsch = cast(int, "kein int")     # keine Prüfung zur Laufzeit!
print(type(falsch).__name__)       # str
`),
    tip: "Häufige `cast()`-Aufrufe deuten auf fehlende Typinformationen hin; eine echte Prüfung mit `isinstance()` ist sicherer.",
    keywords: ['cast', 'typumwandlung', 'type assertion', 'typ erzwingen', 'as', 'vertrauen'],
    related: ['typing.Any', 'typing.TypeIs', 'Typumwandlung'],
    mdn: D + 'typing.html#typing.cast'
  },
  {
    lang: 'py', group: 'Typ-Hinweise', name: 'mypy',
    desc: "Statischer Type Checker: prüft Typ-Hinweise, ohne den Code auszuführen.",
    details: "mypy liest die Annotationen und meldet Typfehler, etwa falsche Argumenttypen, fehlende `None`-Prüfungen oder Tippfehler bei Attributen. Nicht annotierte Funktionen werden standardmäßig nicht geprüft; `--strict` aktiviert alle Prüfungen. Konfiguriert wird mypy über `pyproject.toml` im Abschnitt `[tool.mypy]`. Mit `reveal_type(x)` im Code zeigt mypy den abgeleiteten Typ.",
    syntax: "mypy [optionen] pfad ...",
    values: [
      ["--strict", "Alle strengen Prüfungen einschalten"],
      ["--ignore-missing-imports", "Fehlende Typinformationen von Paketen ignorieren"],
      ["--python-version 3.12", "Gegen eine bestimmte Python-Version prüfen"],
      ["# type: ignore[code]", "Einzelne Zeile gezielt ausnehmen"],
      ["reveal_type(x)", "Abgeleiteten Typ anzeigen"]
    ],
    example: e(`
# Installieren (in der virtuellen Umgebung)
python -m pip install mypy

# Datei oder Paket prüfen
mypy app.py
mypy --strict src/

# Typische Ausgabe
# app.py:12: error: Argument 1 to "preis" has incompatible type "str"; expected "float"  [arg-type]
# Found 1 error in 1 file (checked 3 source files)
`),
    exampleLang: 'sh',
    tip: "In bestehenden Projekten schrittweise vorgehen: erst ohne `--strict` starten, dann Modul für Modul strenger werden. Alternativen sind pyright und ty.",
    keywords: ['mypy', 'type checker', 'typprüfung', 'statische analyse', 'static analysis', 'strict', 'reveal_type', 'linter'],
    related: ['Type Checker', 'Typ-Annotationen', 'pyproject.toml'],
    mdn: D + 'typing.html'
  }
  );
})();
