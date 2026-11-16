window.CHEAT = window.CHEAT || [];
(function () {
  var PG = 'https://www.postgresql.org/docs/current/'; // + z. B. 'functions-string.html'
  var SL = 'https://sqlite.org/';                      // + z. B. 'lang_corefunc.html'
  var MS = 'https://learn.microsoft.com/en-us/sql/t-sql/functions/'; // SQL Server-Funktionen
  var MST = 'https://learn.microsoft.com/en-us/sql/t-sql/';          // SQL Server allgemein
  var MY = 'https://dev.mysql.com/doc/refman/8.4/en/';               // MySQL
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Bedingte Ausdrücke ----------------
  {
    lang: 'sql', group: 'Bedingte Ausdrücke', name: 'CASE',
    desc: "Wenn-dann-Logik in einer Abfrage: liefert je nach Bedingung einen anderen Wert.",
    details: "Das gesuchte `CASE` prüft die `WHEN`-Bedingungen von oben nach unten und liefert den Wert der ersten, die wahr ist; trifft keine zu, gilt `ELSE`, fehlt `ELSE`, ergibt sich `NULL`. `CASE` ist ein Ausdruck und darf überall stehen, wo ein Wert erlaubt ist: in `SELECT`, `WHERE`, `ORDER BY`, `GROUP BY` und in Aggregaten. Alle Zweige sollten denselben Typ liefern, sonst gibt es je nach Datenbank einen Fehler oder eine stille Umwandlung.",
    tip: "Die Reihenfolge der `WHEN`-Zweige zählt: die engste Bedingung (`>= 5000`) muss vor der weiteren (`>= 4000`) stehen.",
    keywords: ['case when', 'wenn dann', 'if then else', 'bedingung', 'fallunterscheidung', 'conditional', 'pivot'],
    related: ['Einfaches CASE', 'IIF()', 'COALESCE()', 'FILTER (Aggregat)'],
    mdn: PG + 'functions-conditional.html',
    dialects: {
      std: {
        syntax: "CASE\n  WHEN bedingung1 THEN wert1\n  [WHEN bedingung2 THEN wert2 …]\n  [ELSE standardwert]\nEND",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 5200), (2, 'Lin', 4800), (3, 'Max', 3900), (4, 'Tom', 3500);

SELECT name, gehalt,
       CASE WHEN gehalt >= 5000 THEN 'hoch'
            WHEN gehalt >= 4000 THEN 'mittel'
            ELSE 'niedrig'
       END AS stufe
FROM mitarbeiter
ORDER BY gehalt DESC;
-- name | gehalt | stufe
-- Ada  | 5200   | hoch
-- Lin  | 4800   | mittel
-- Max  | 3900   | niedrig
-- Tom  | 3500   | niedrig

-- Bedingtes Zählen mit CASE im Aggregat
SELECT SUM(CASE WHEN gehalt >= 4000 THEN 1 ELSE 0 END) AS ab_4000, COUNT(*) AS gesamt
FROM mitarbeiter;
-- ab_4000 | gesamt
-- 2       | 4
`)
      },
      pg: { mdn: PG + 'functions-conditional.html#FUNCTIONS-CASE' },
      mysql: { note: "Zusätzlich gibt es die Kurzform `IF(bedingung, a, b)`.", mdn: MY + 'flow-control-functions.html' },
      mssql: { note: "Zusätzlich gibt es die Kurzform `IIF(bedingung, a, b)`.", mdn: MST + 'language-elements/case-transact-sql' },
      sqlite: { note: "Zusätzlich gibt es die Kurzform `iif(bedingung, a, b)`.", mdn: SL + 'lang_expr.html#case' }
    }
  },
  {
    lang: 'sql', group: 'Bedingte Ausdrücke', name: 'Einfaches CASE',
    desc: "Kurzform von CASE, die einen Ausdruck mit festen Werten vergleicht.",
    details: "Beim einfachen `CASE` steht der zu prüfende Ausdruck direkt nach `CASE`, die `WHEN`-Zweige enthalten nur noch Vergleichswerte. Verglichen wird mit `=`; deshalb trifft `WHEN NULL` nie zu, für `NULL` braucht man die gesuchte Form `CASE WHEN x IS NULL …`. Praktisch zum Übersetzen von Codes in lesbare Texte.",
    tip: "Für Code-Tabellen, die sich ändern können, ist eine echte Nachschlagetabelle mit Join besser als ein fest verdrahtetes `CASE`.",
    keywords: ['simple case', 'case ausdruck', 'switch', 'decode', 'mapping', 'code übersetzen'],
    related: ['CASE', 'NULL in Vergleichen', 'IIF()'],
    mdn: PG + 'functions-conditional.html',
    dialects: {
      std: {
        syntax: "CASE ausdruck\n  WHEN wert1 THEN ergebnis1\n  [WHEN wert2 THEN ergebnis2 …]\n  [ELSE standard]\nEND",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, status CHAR(1));
INSERT INTO bestellungen VALUES (1, 'N'), (2, 'V'), (3, 'S'), (4, NULL);

SELECT id,
       CASE status
         WHEN 'N' THEN 'neu'
         WHEN 'V' THEN 'versandt'
         WHEN 'S' THEN 'storniert'
         ELSE 'unbekannt'          -- auch NULL landet hier
       END AS status_text
FROM bestellungen
ORDER BY id;
-- id | status_text
-- 1  | neu
-- 2  | versandt
-- 3  | storniert
-- 4  | unbekannt
`)
      },
      mysql: { note: "Bei der Standard-Kollation vergleicht `WHEN 'n'` auch mit `'N'` – Groß-/Kleinschreibung zählt nicht." },
      mssql: { note: "Bei der Standard-Kollation vergleicht `WHEN 'n'` auch mit `'N'` – Groß-/Kleinschreibung zählt nicht." }
    }
  },
  {
    lang: 'sql', group: 'Bedingte Ausdrücke', name: 'COALESCE()',
    desc: "Liefert das erste Argument, das nicht NULL ist – ideal für Ersatzwerte.",
    details: "`COALESCE(a, b, c)` wertet die Argumente von links nach rechts aus und gibt das erste zurück, das nicht `NULL` ist; sind alle `NULL`, ist das Ergebnis `NULL`. Die Funktion ist Standard-SQL und in allen großen Datenbanken vorhanden, viele Dialekte haben zusätzlich eine Variante mit genau zwei Argumenten. Alle Argumente sollten einen verträglichen Typ haben.",
    tip: "`COALESCE(SUM(betrag), 0)` macht aus der leeren Summe (`NULL`) eine echte 0.",
    keywords: ['ifnull', 'isnull', 'nvl', 'ersatzwert', 'standardwert', 'default', 'null ersetzen', 'fallback'],
    related: ['NULLIF()', 'NULL', 'NULL in Aggregaten', 'CASE'],
    mdn: PG + 'functions-conditional.html#FUNCTIONS-COALESCE-NVL-IFNULL',
    dialects: {
      std: {
        syntax: "COALESCE(ausdruck1, ausdruck2 [, …])",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50), telefon VARCHAR(20), mobil VARCHAR(20));
INSERT INTO kunden VALUES
  (1, 'Müller',  'Berlin',  '030-123', NULL),
  (2, 'Schmidt', NULL,      NULL,      '0170-555'),
  (3, 'Weber',   'Hamburg', NULL,      NULL);

SELECT name,
       COALESCE(stadt, 'unbekannt')  AS stadt,
       COALESCE(telefon, mobil, '-') AS kontakt
FROM kunden
ORDER BY id;
-- name    | stadt     | kontakt
-- Müller  | Berlin    | 030-123
-- Schmidt | unbekannt | 0170-555
-- Weber   | Hamburg   | -
`)
      },
      mysql: { note: "Zusätzlich `IFNULL(a, b)` mit genau zwei Argumenten.", mdn: MY + 'flow-control-functions.html#function_ifnull' },
      mssql: {
        syntax: "COALESCE(ausdruck1, ausdruck2 [, …])\nISNULL(ausdruck, ersatz)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(5));
INSERT INTO kunden VALUES (1, 'Müller', 'Bonn'), (2, 'Schmidt', NULL);

-- ISNULL übernimmt den Typ des ersten Arguments: VARCHAR(5) schneidet ab
SELECT name,
       COALESCE(stadt, 'unbekannt') AS mit_coalesce,
       ISNULL(stadt, 'unbekannt')   AS mit_isnull
FROM kunden
ORDER BY id;
-- name    | mit_coalesce | mit_isnull
-- Müller  | Bonn         | Bonn
-- Schmidt | unbekannt    | unbek
`),
        note: "`ISNULL(a, b)` kennt nur zwei Argumente und nimmt den Typ des ersten – längere Ersatzwerte werden abgeschnitten.",
        mdn: MST + 'language-elements/coalesce-transact-sql'
      },
      sqlite: { note: "Zusätzlich `IFNULL(a, b)` mit genau zwei Argumenten.", mdn: SL + 'lang_corefunc.html#coalesce' }
    }
  },
  {
    lang: 'sql', group: 'Bedingte Ausdrücke', name: 'NULLIF()',
    desc: "Gibt NULL zurück, wenn beide Argumente gleich sind, sonst das erste Argument.",
    details: "`NULLIF(a, b)` ist die Umkehrung von `COALESCE`: Es verwandelt einen bestimmten Wert in `NULL`. Typische Einsätze sind leere Strings als `NULL` zu behandeln (`NULLIF(stadt, '')`) und Division durch null zu verhindern (`x / NULLIF(y, 0)`). Die Funktion ist Standard-SQL und überall verfügbar.",
    tip: "Die Kombination `COALESCE(NULLIF(x, ''), 'Ersatz')` ist das Standardmuster für „leer oder NULL“.",
    keywords: ['null if', 'leerstring', 'leerer string', 'in null umwandeln', 'division durch null'],
    related: ['COALESCE()', 'Division durch null vermeiden', 'Leerer String vs. NULL'],
    mdn: PG + 'functions-conditional.html#FUNCTIONS-NULLIF',
    dialects: {
      std: {
        syntax: "NULLIF(ausdruck, vergleichswert)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', ''), (3, 'Weber', NULL);

-- Leerer String und NULL gleich behandeln
SELECT name, COALESCE(NULLIF(stadt, ''), 'unbekannt') AS stadt
FROM kunden
ORDER BY id;
-- name    | stadt
-- Müller  | Berlin
-- Schmidt | unbekannt
-- Weber   | unbekannt

SELECT COUNT(stadt) AS mit_leer, COUNT(NULLIF(stadt, '')) AS echt
FROM kunden;
-- mit_leer | echt
-- 2        | 1
`)
      },
      mssql: { mdn: MST + 'language-elements/nullif-transact-sql' }
    }
  },
  {
    lang: 'sql', group: 'Bedingte Ausdrücke', name: 'IIF()',
    desc: "Kurzform für ein CASE mit genau einer Bedingung – nicht in jedem Dialekt vorhanden.",
    details: "`IIF(bedingung, wert_wahr, wert_falsch)` entspricht `CASE WHEN bedingung THEN wert_wahr ELSE wert_falsch END`. Ist die Bedingung `NULL`, wird der Falsch-Zweig genommen. Die Funktion ist kein Standard-SQL und heißt je nach Dialekt anders; für portablen Code lieber gleich `CASE` schreiben.",
    tip: "Ein `NULL` landet stillschweigend im Falsch-Zweig – wenn das nicht gewollt ist, mit `CASE` einen eigenen Zweig für `IS NULL` schreiben.",
    keywords: ['if', 'iif', 'inline if', 'ternär', 'bedingung', 'wenn'],
    related: ['CASE', 'Einfaches CASE', 'Dreiwertige Logik'],
    mdn: MS + 'logical-functions-iif-transact-sql',
    dialects: {
      std: { none: "Kein `IIF` im Standard; stattdessen `CASE WHEN bedingung THEN a ELSE b END`." },
      pg: { none: "Kein `IIF`; stattdessen `CASE WHEN bedingung THEN a ELSE b END`." },
      mysql: {
        syntax: "IF(bedingung, wert_wenn_wahr, wert_wenn_falsch)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 5200), (2, 'Max', 3900), (3, 'Tom', NULL);

-- Tom: Bedingung ist NULL -> Falsch-Zweig
SELECT name, IF(gehalt >= 4000, 'ja', 'nein') AS ab_4000
FROM mitarbeiter
ORDER BY id;
-- name | ab_4000
-- Ada  | ja
-- Max  | nein
-- Tom  | nein
`),
        note: "Heißt in MySQL `IF()`; `IIF` gibt es nicht.",
        mdn: MY + 'flow-control-functions.html#function_if'
      },
      mssql: {
        syntax: "IIF(bedingung, wert_wenn_wahr, wert_wenn_falsch)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 5200), (2, 'Max', 3900), (3, 'Tom', NULL);

-- Tom: Bedingung ist NULL -> Falsch-Zweig
SELECT name, IIF(gehalt >= 4000, 'ja', 'nein') AS ab_4000
FROM mitarbeiter
ORDER BY id;
-- name | ab_4000
-- Ada  | ja
-- Max  | nein
-- Tom  | nein
`),
        note: "Seit SQL Server 2012; intern wird daraus ein `CASE`.",
        mdn: MS + 'logical-functions-iif-transact-sql'
      },
      sqlite: {
        syntax: "iif(bedingung, wert_wenn_wahr, wert_wenn_falsch)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 5200), (2, 'Max', 3900), (3, 'Tom', NULL);

-- Tom: Bedingung ist NULL -> Falsch-Zweig
SELECT name, iif(gehalt >= 4000, 'ja', 'nein') AS ab_4000
FROM mitarbeiter
ORDER BY id;
-- name | ab_4000
-- Ada  | ja
-- Max  | nein
-- Tom  | nein
`),
        note: "Seit SQLite 3.32, seit 3.48 auch unter dem Namen `if()`.",
        mdn: SL + 'lang_corefunc.html#iif'
      }
    }
  },
  {
    lang: 'sql', group: 'Bedingte Ausdrücke', name: 'GREATEST() / LEAST()',
    desc: "Größter bzw. kleinster Wert aus mehreren Ausdrücken einer Zeile.",
    details: "Im Gegensatz zu `MAX()`/`MIN()` vergleichen `GREATEST` und `LEAST` mehrere Spalten oder Werte innerhalb derselben Zeile. Bei `NULL`-Argumenten unterscheiden sich die Dialekte: Manche ignorieren sie, andere liefern dann `NULL`. Seit SQL:2023 gehören die Funktionen zum Standard.",
    tip: "Für portablen Code mit möglichen `NULL`-Werten die Argumente vorher mit `COALESCE` absichern.",
    keywords: ['greatest', 'least', 'maximum', 'minimum', 'größter wert', 'kleinster wert', 'zeilenweise', 'max mehrere spalten'],
    related: ['MIN() / MAX()', 'COALESCE()', 'CASE'],
    mdn: PG + 'functions-conditional.html#FUNCTIONS-GREATEST-LEAST',
    dialects: {
      std: {
        syntax: "GREATEST(wert1, wert2 [, …])\nLEAST(wert1, wert2 [, …])",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(8,2), preis_alt DECIMAL(8,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.90, 24.90), (2, 'Monitor', 199.00, 179.00);

SELECT name,
       GREATEST(preis, preis_alt) AS hoechster,
       LEAST(preis, preis_alt)    AS niedrigster
FROM produkte
ORDER BY id;
-- name    | hoechster | niedrigster
-- Maus    | 24.90     | 19.90
-- Monitor | 199.00    | 179.00
`)
      },
      pg: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(8,2), preis_alt DECIMAL(8,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.90, 24.90), (2, 'Tastatur', 49.00, NULL);

-- NULL-Argumente werden ignoriert
SELECT name,
       GREATEST(preis, preis_alt) AS hoechster,
       LEAST(preis, preis_alt)    AS niedrigster
FROM produkte
ORDER BY id;
-- name     | hoechster | niedrigster
-- Maus     | 24.90     | 19.90
-- Tastatur | 49.00     | 49.00
`),
        note: "`NULL`-Argumente werden ignoriert; nur wenn alle `NULL` sind, ist das Ergebnis `NULL`."
      },
      mysql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(8,2), preis_alt DECIMAL(8,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.90, 24.90), (2, 'Tastatur', 49.00, NULL);

-- Ein NULL-Argument ergibt NULL
SELECT name,
       GREATEST(preis, preis_alt)              AS hoechster,
       GREATEST(preis, COALESCE(preis_alt, 0)) AS abgesichert
FROM produkte
ORDER BY id;
-- name     | hoechster | abgesichert
-- Maus     | 24.90     | 24.90
-- Tastatur | NULL      | 49.00
`),
        note: "Sobald ein Argument `NULL` ist, ist das Ergebnis `NULL`.",
        mdn: MY + 'comparison-operators.html#function_greatest'
      },
      mssql: {
        note: "Seit SQL Server 2022; `NULL`-Argumente werden ignoriert.",
        mdn: MS + 'logical-functions-greatest-transact-sql'
      },
      sqlite: {
        syntax: "max(wert1, wert2 [, …])\nmin(wert1, wert2 [, …])",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(8,2), preis_alt DECIMAL(8,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.90, 24.90), (2, 'Tastatur', 49.00, NULL);

-- max/min mit mehreren Argumenten; ein NULL ergibt NULL
SELECT name,
       max(preis, preis_alt)              AS hoechster,
       min(preis, COALESCE(preis_alt, preis)) AS niedrigster
FROM produkte
ORDER BY id;
-- name     | hoechster | niedrigster
-- Maus     | 24.9      | 19.9
-- Tastatur | NULL      | 49
`),
        note: "Kein `GREATEST`/`LEAST`; `max()` und `min()` mit mehreren Argumenten arbeiten zeilenweise (mit einem Argument sind sie Aggregate).",
        mdn: SL + 'lang_corefunc.html#max_scalar'
      }
    }
  },

  // ---------------- NULL-Behandlung ----------------
  {
    lang: 'sql', group: 'NULL-Behandlung', name: 'NULL',
    desc: "Markiert einen fehlenden oder unbekannten Wert – weder 0 noch leerer String.",
    details: "`NULL` bedeutet „Wert unbekannt oder nicht vorhanden“. Fast jede Operation mit `NULL` ergibt wieder `NULL`: `1 + NULL`, das Verketten mit `NULL` und auch `NULL = NULL`. Prüfen lässt sich `NULL` nur mit `IS NULL` bzw. `IS NOT NULL`. Spalten mit `NOT NULL` verbieten den Wert, ohne diese Einschränkung ist er überall erlaubt.",
    tip: "Weber hat einen leeren String, keinen `NULL`-Wert – `IS NULL` findet ihn nicht.",
    keywords: ['null', 'fehlender wert', 'unbekannt', 'missing value', 'is null', 'is not null', 'leer'],
    related: ['IS NULL', 'Dreiwertige Logik', 'COALESCE()', 'Leerer String vs. NULL'],
    mdn: SL + 'nulls.html',
    dialects: {
      std: {
        syntax: "spalte IS NULL\nspalte IS NOT NULL",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', NULL), (3, 'Weber', '');

SELECT name FROM kunden WHERE stadt IS NULL;
-- name
-- Schmidt

SELECT NULL = NULL AS gleich, NULL IS NULL AS ist_null, 1 + NULL AS summe, 'a' || NULL AS verkettet;
-- gleich | ist_null | summe | verkettet
-- NULL   | true     | NULL  | NULL
`)
      },
      pg: { mdn: PG + 'functions-comparison.html' },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', NULL), (3, 'Weber', '');

SELECT name FROM kunden WHERE stadt IS NULL;
-- name
-- Schmidt

SELECT NULL = NULL AS gleich, NULL IS NULL AS ist_null, 1 + NULL AS summe, CONCAT('a', NULL) AS verkettet;
-- gleich | ist_null | summe | verkettet
-- NULL   | 1        | NULL  | NULL
`),
        note: "Wahrheitswerte erscheinen als `1`/`0`. `||` ist in MySQL ein logisches ODER, verkettet wird mit `CONCAT()`.",
        mdn: MY + 'working-with-null.html'
      },
      mssql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', NULL), (3, 'Weber', '');

SELECT name FROM kunden WHERE stadt IS NULL;
-- name
-- Schmidt

SELECT CASE WHEN NULL = NULL THEN 'wahr' ELSE 'nicht wahr' END AS gleich,
       CASE WHEN NULL IS NULL THEN 'wahr' ELSE 'nicht wahr' END AS ist_null,
       1 + NULL AS summe, 'a' + NULL AS verkettet;
-- gleich     | ist_null | summe | verkettet
-- nicht wahr | wahr     | NULL  | NULL
`),
        note: "Vergleiche lassen sich nicht direkt selektieren, daher `CASE`. `'a' + NULL` ist `NULL`, `CONCAT('a', NULL)` dagegen `'a'`.",
        mdn: MST + 'language-elements/null-and-unknown-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', NULL), (3, 'Weber', '');

SELECT name FROM kunden WHERE stadt IS NULL;
-- name
-- Schmidt

SELECT NULL = NULL AS gleich, NULL IS NULL AS ist_null, 1 + NULL AS summe, 'a' || NULL AS verkettet;
-- gleich | ist_null | summe | verkettet
-- NULL   | 1        | NULL  | NULL
`),
        note: "Wahrheitswerte erscheinen als `1`/`0`.",
        mdn: SL + 'nulls.html'
      }
    }
  },
  {
    lang: 'sql', group: 'NULL-Behandlung', name: 'Dreiwertige Logik',
    desc: "Bedingungen sind in SQL wahr, falsch oder unbekannt (NULL).",
    details: "Weil Vergleiche mit `NULL` „unbekannt“ ergeben, arbeitet SQL mit drei Wahrheitswerten. `WHERE` und `HAVING` behalten nur Zeilen, deren Bedingung wahr ist; unbekannt fliegt also genauso raus wie falsch. Merkregeln: `FALSE AND NULL` ist falsch, `TRUE OR NULL` ist wahr, alles andere mit `NULL` bleibt unbekannt, auch `NOT NULL`. Deshalb liefern `WHERE x > 100` und `WHERE NOT (x > 100)` zusammen nicht alle Zeilen.",
    values: [
      ['TRUE AND NULL', 'NULL (unbekannt)'],
      ['FALSE AND NULL', 'FALSE'],
      ['TRUE OR NULL', 'TRUE'],
      ['FALSE OR NULL', 'NULL (unbekannt)'],
      ['NOT NULL', 'NULL (unbekannt)']
    ],
    tip: "Wenn `NULL` mitgezählt werden soll, ausdrücklich ergänzen: `WHERE NOT (bonus > 100) OR bonus IS NULL`.",
    keywords: ['three-valued logic', 'dreiwertig', 'unknown', 'unbekannt', 'wahrheitswert', 'and or not null', 'boolean'],
    related: ['NULL', 'NULL in Vergleichen', 'AND / OR / NOT', 'NOT IN und NULL'],
    mdn: PG + 'functions-logical.html',
    dialects: {
      std: {
        example: e(`
SELECT (TRUE AND NULL) AS und_wahr, (FALSE AND NULL) AS und_falsch,
       (TRUE OR NULL)  AS oder_wahr, (FALSE OR NULL) AS oder_falsch, NOT (NULL) AS nicht;
-- und_wahr | und_falsch | oder_wahr | oder_falsch | nicht
-- NULL     | false      | true      | NULL        | NULL

CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), bonus INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 500), (2, 'Lin', NULL), (3, 'Max', 0);

-- Lin fehlt: NULL > 100 ist unbekannt, NOT unbekannt ebenso
SELECT name FROM mitarbeiter WHERE NOT (bonus > 100) ORDER BY id;
-- name
-- Max
`)
      },
      mysql: {
        example: e(`
SELECT (TRUE AND NULL) AS und_wahr, (FALSE AND NULL) AS und_falsch,
       (TRUE OR NULL)  AS oder_wahr, (FALSE OR NULL) AS oder_falsch, NOT (NULL) AS nicht;
-- und_wahr | und_falsch | oder_wahr | oder_falsch | nicht
-- NULL     | 0          | 1         | NULL        | NULL

CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), bonus INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 500), (2, 'Lin', NULL), (3, 'Max', 0);

-- Lin fehlt: NULL > 100 ist unbekannt, NOT unbekannt ebenso
SELECT name FROM mitarbeiter WHERE NOT (bonus > 100) ORDER BY id;
-- name
-- Max
`),
        note: "`TRUE` und `FALSE` sind nur andere Namen für `1` und `0`."
      },
      mssql: {
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), bonus INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 500), (2, 'Lin', NULL), (3, 'Max', 0);

-- Wahrheitswert einer Bedingung sichtbar machen
SELECT name,
       CASE WHEN bonus > 100 THEN 'wahr'
            WHEN NOT (bonus > 100) THEN 'falsch'
            ELSE 'unbekannt' END AS bonus_gross
FROM mitarbeiter
ORDER BY id;
-- name | bonus_gross
-- Ada  | wahr
-- Lin  | unbekannt
-- Max  | falsch

-- Lin fehlt: NULL > 100 ist unbekannt, NOT unbekannt ebenso
SELECT name FROM mitarbeiter WHERE NOT (bonus > 100) ORDER BY id;
-- name
-- Max
`),
        note: "Kein `BOOLEAN`-Typ und keine Literale `TRUE`/`FALSE`; Bedingungen gibt es nur in `WHERE`, `CASE` usw."
      },
      sqlite: {
        example: e(`
SELECT (TRUE AND NULL) AS und_wahr, (FALSE AND NULL) AS und_falsch,
       (TRUE OR NULL)  AS oder_wahr, (FALSE OR NULL) AS oder_falsch, NOT (NULL) AS nicht;
-- und_wahr | und_falsch | oder_wahr | oder_falsch | nicht
-- NULL     | 0          | 1         | NULL        | NULL

CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), bonus INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 500), (2, 'Lin', NULL), (3, 'Max', 0);

-- Lin fehlt: NULL > 100 ist unbekannt, NOT unbekannt ebenso
SELECT name FROM mitarbeiter WHERE NOT (bonus > 100) ORDER BY id;
-- name
-- Max
`),
        note: "`TRUE` und `FALSE` (seit 3.23) sind nur andere Namen für `1` und `0`."
      }
    }
  },
  {
    lang: 'sql', group: 'NULL-Behandlung', name: 'NULL in Vergleichen',
    desc: "= NULL findet nie etwas; NULL-sichere Vergleiche brauchen IS oder IS DISTINCT FROM.",
    details: "`spalte = NULL` und `spalte <> NULL` sind immer unbekannt und liefern keine Zeile. Auch `stadt <> 'Berlin'` übergeht Zeilen mit `stadt IS NULL`, was oft nicht gewollt ist. `IS DISTINCT FROM` (Standard-SQL) behandelt `NULL` wie einen normalen Wert; wo es fehlt, gibt es eigene NULL-sichere Operatoren.",
    values: [
      ['= NULL', 'nie wahr – Fehler im Code'],
      ['IS NULL', 'prüft auf NULL'],
      ['a IS DISTINCT FROM b', 'ungleich, NULL zählt als Wert'],
      ['a IS NOT DISTINCT FROM b', 'gleich, NULL = NULL ist wahr']
    ],
    tip: "Viele Linter melden `= NULL` als Fehler – im Code-Review gezielt danach suchen.",
    keywords: ['= null', 'null vergleich', 'is distinct from', 'null safe', '<=>', 'ungleich null', 'is not'],
    related: ['IS DISTINCT FROM', 'IS NULL', 'Dreiwertige Logik', 'NOT IN und NULL'],
    mdn: PG + 'functions-comparison.html',
    dialects: {
      std: {
        syntax: "a IS DISTINCT FROM b\na IS NOT DISTINCT FROM b",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', NULL), (3, 'Weber', 'Hamburg');

SELECT COUNT(*) AS treffer FROM kunden WHERE stadt = NULL;
-- treffer
-- 0

SELECT name FROM kunden WHERE stadt <> 'Berlin' ORDER BY id;
-- name
-- Weber

SELECT name FROM kunden WHERE stadt IS DISTINCT FROM 'Berlin' ORDER BY id;
-- name
-- Schmidt
-- Weber
`)
      },
      mysql: {
        syntax: "a <=> b          -- NULL-sicheres Gleich\nNOT (a <=> b)    -- NULL-sicheres Ungleich",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', NULL), (3, 'Weber', 'Hamburg');

SELECT COUNT(*) AS treffer FROM kunden WHERE stadt = NULL;
-- treffer
-- 0

SELECT name FROM kunden WHERE stadt <> 'Berlin' ORDER BY id;
-- name
-- Weber

SELECT name FROM kunden WHERE NOT (stadt <=> 'Berlin') ORDER BY id;
-- name
-- Schmidt
-- Weber

SELECT NULL <=> NULL AS beide_null, 1 <=> NULL AS eins_null;
-- beide_null | eins_null
-- 1          | 0
`),
        note: "Kein `IS DISTINCT FROM`; stattdessen der Operator `<=>` (NULL-sicheres Gleich).",
        mdn: MY + 'comparison-operators.html#operator_equal-to'
      },
      mssql: {
        note: "`IS [NOT] DISTINCT FROM` gibt es seit SQL Server 2022. `= NULL` findet nur bei der veralteten Einstellung `SET ANSI_NULLS OFF` etwas.",
        mdn: MST + 'queries/is-distinct-from-transact-sql'
      },
      sqlite: {
        note: "`IS DISTINCT FROM` seit 3.39; außerdem sind `a IS b` und `a IS NOT b` für beliebige Werte NULL-sicher.",
        mdn: SL + 'lang_expr.html#isisnot'
      }
    }
  },
  {
    lang: 'sql', group: 'NULL-Behandlung', name: 'NULL sortieren',
    desc: "Wo NULL-Werte beim Sortieren landen, hängt vom Dialekt ab.",
    details: "Ohne Angabe behandeln manche Datenbanken `NULL` als größten Wert (bei `ASC` am Ende), andere als kleinsten (bei `ASC` am Anfang). Standard-SQL legt die Position mit `NULLS FIRST` / `NULLS LAST` fest; nicht jede Datenbank kennt das. Portabel ist ein zusätzlicher Sortierschlüssel `CASE WHEN x IS NULL THEN 1 ELSE 0 END`.",
    tip: "Bei Top-N-Listen mit `ORDER BY … DESC` stehen `NULL`-Werte in Datenbanken, die `NULL` als größten Wert behandeln, ganz oben – `NULLS LAST` nicht vergessen.",
    keywords: ['nulls first', 'nulls last', 'sortierung', 'order by null', 'null am ende', 'null zuerst'],
    related: ['NULLS FIRST / NULLS LAST', 'ORDER BY', 'NULL'],
    mdn: PG + 'queries-order.html',
    dialects: {
      std: {
        syntax: "ORDER BY spalte [ASC | DESC] [NULLS FIRST | NULLS LAST]",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), bonus INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 500), (2, 'Lin', NULL), (3, 'Max', 200);

SELECT name, bonus FROM mitarbeiter ORDER BY bonus NULLS FIRST;
-- name | bonus
-- Lin  | NULL
-- Max  | 200
-- Ada  | 500

SELECT name, bonus FROM mitarbeiter ORDER BY bonus DESC NULLS LAST;
-- name | bonus
-- Ada  | 500
-- Max  | 200
-- Lin  | NULL
`)
      },
      pg: { note: "Ohne Angabe gilt `NULL` als größter Wert: bei `ASC` am Ende, bei `DESC` am Anfang." },
      mysql: {
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), bonus INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 500), (2, 'Lin', NULL), (3, 'Max', 200);

-- NULL gilt als kleinster Wert
SELECT name, bonus FROM mitarbeiter ORDER BY bonus;
-- name | bonus
-- Lin  | NULL
-- Max  | 200
-- Ada  | 500

-- NULL ans Ende: bonus IS NULL ist 0 oder 1
SELECT name, bonus FROM mitarbeiter ORDER BY bonus IS NULL, bonus DESC;
-- name | bonus
-- Ada  | 500
-- Max  | 200
-- Lin  | NULL
`),
        note: "Kein `NULLS FIRST`/`NULLS LAST`; `NULL` gilt als kleinster Wert.",
        mdn: MY + 'sorting-rows.html'
      },
      mssql: {
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), bonus INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 500), (2, 'Lin', NULL), (3, 'Max', 200);

-- NULL gilt als kleinster Wert
SELECT name, bonus FROM mitarbeiter ORDER BY bonus;
-- name | bonus
-- Lin  | NULL
-- Max  | 200
-- Ada  | 500

-- NULL ans Ende
SELECT name, bonus FROM mitarbeiter
ORDER BY CASE WHEN bonus IS NULL THEN 1 ELSE 0 END, bonus DESC;
-- name | bonus
-- Ada  | 500
-- Max  | 200
-- Lin  | NULL
`),
        note: "Kein `NULLS FIRST`/`NULLS LAST`; `NULL` gilt als kleinster Wert."
      },
      sqlite: { note: "`NULLS FIRST`/`NULLS LAST` seit 3.30. Ohne Angabe gilt `NULL` als kleinster Wert: bei `ASC` am Anfang." }
    }
  },
  {
    lang: 'sql', group: 'NULL-Behandlung', name: 'NULL in Aggregaten',
    desc: "Aggregatfunktionen überspringen NULL – mit Folgen für COUNT und AVG.",
    details: "`SUM`, `AVG`, `MIN`, `MAX` und `COUNT(spalte)` ignorieren `NULL`-Werte, nur `COUNT(*)` zählt alle Zeilen. `AVG` teilt deshalb durch die Zahl der Nicht-`NULL`-Werte. Über eine leere Menge liefert `SUM` nicht 0, sondern `NULL`. Ausführlich unter `Aggregate & NULL`.",
    tip: "Ob `NULL` als 0 zählen soll, ist eine fachliche Entscheidung – `AVG(betrag)` und `AVG(COALESCE(betrag, 0))` sind beide „richtig“.",
    keywords: ['aggregat null', 'count null', 'avg null', 'sum null', 'leere summe', 'durchschnitt'],
    related: ['Aggregate & NULL', 'COUNT()', 'AVG()', 'COALESCE()'],
    mdn: PG + 'functions-aggregate.html',
    dialects: {
      std: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 1, NULL), (3, 2, 50), (4, 2, NULL);

SELECT COUNT(*) AS zeilen, COUNT(betrag) AS mit_betrag, SUM(betrag) AS summe,
       AVG(betrag) AS schnitt, AVG(COALESCE(betrag, 0)) AS schnitt_mit_0
FROM bestellungen;
-- zeilen | mit_betrag | summe | schnitt | schnitt_mit_0
-- 4      | 2          | 150   | 75      | 37.5

SELECT SUM(betrag) AS summe, COALESCE(SUM(betrag), 0) AS summe_0
FROM bestellungen WHERE kunde_id = 99;
-- summe | summe_0
-- NULL  | 0
`)
      },
      mssql: { note: "`AVG` über eine `INT`-Spalte rechnet ganzzahlig (`AVG` von 1 und 2 ist 1) – bei Bedarf vorher `CAST(x AS DECIMAL(10,2))`." }
    }
  },
  {
    lang: 'sql', group: 'NULL-Behandlung', name: 'Division durch null vermeiden',
    desc: "Mit NULLIF(nenner, 0) wird aus einem Laufzeitfehler ein NULL-Ergebnis.",
    details: "Je nach Datenbank bricht eine Division durch 0 mit einem Fehler ab oder liefert stillschweigend `NULL`. Portabel ist `zaehler / NULLIF(nenner, 0)`: Ist der Nenner 0, wird er zu `NULL` und das Ergebnis ebenfalls. Mit `COALESCE` lässt sich daraus wieder ein Ersatzwert machen. Achtung bei Ganzzahlen: In den meisten Dialekten ergibt `1250 / 40` den Wert 31, für Nachkommastellen einen Operanden zu Dezimal machen.",
    tip: "Auch in Kennzahlen-Views gleich `NULLIF` einbauen – ein einziger Datensatz mit 0 legt sonst den ganzen Bericht lahm.",
    keywords: ['division by zero', 'durch null teilen', 'nullif', 'teilen', 'quote', 'prozent', 'fehler'],
    related: ['NULLIF()', 'COALESCE()', 'Ganzzahldivision'],
    mdn: PG + 'functions-conditional.html#FUNCTIONS-NULLIF',
    dialects: {
      std: {
        syntax: "zaehler / NULLIF(nenner, 0)\nCOALESCE(zaehler / NULLIF(nenner, 0), 0)",
        example: e(`
CREATE TABLE filialen (name VARCHAR(20), umsatz INT, kunden INT);
INSERT INTO filialen VALUES ('Nord', 1250, 40), ('Süd', 900, 0), ('West', 510, 25);

SELECT name,
       umsatz / NULLIF(kunden, 0)                    AS pro_kunde,
       COALESCE(umsatz * 1.0 / NULLIF(kunden, 0), 0) AS pro_kunde_genau
FROM filialen
ORDER BY name;
-- name | pro_kunde | pro_kunde_genau
-- Nord | 31        | 31.25
-- Süd  | NULL      | 0
-- West | 20        | 20.4
`)
      },
      pg: { note: "`umsatz / 0` bricht mit `ERROR: division by zero` ab." },
      mysql: {
        example: e(`
CREATE TABLE filialen (name VARCHAR(20), umsatz INT, kunden INT);
INSERT INTO filialen VALUES ('Nord', 1250, 40), ('Süd', 900, 0), ('West', 510, 25);

-- / rechnet immer dezimal, DIV ganzzahlig; Division durch 0 ergibt NULL
SELECT name,
       umsatz / kunden                      AS ohne_nullif,
       umsatz DIV NULLIF(kunden, 0)         AS pro_kunde,
       COALESCE(umsatz / NULLIF(kunden, 0), 0) AS pro_kunde_genau
FROM filialen
ORDER BY name;
-- name | ohne_nullif | pro_kunde | pro_kunde_genau
-- Nord | 31.2500     | 31        | 31.2500
-- Süd  | NULL        | NULL      | 0
-- West | 20.4000     | 20        | 20.4000
`),
        note: "Division durch 0 liefert in Abfragen `NULL` (mit Warnung); in `INSERT`/`UPDATE` ist sie im strikten Modus ein Fehler. `/` rechnet immer dezimal.",
        mdn: MY + 'arithmetic-functions.html'
      },
      mssql: { note: "`umsatz / 0` bricht mit `Divide by zero error encountered` ab." },
      sqlite: { note: "`umsatz / 0` liefert ohne Fehler `NULL` – `NULLIF` macht die Absicht trotzdem sichtbar." }
    }
  },
  {
    lang: 'sql', group: 'NULL-Behandlung', name: 'Leerer String vs. NULL',
    desc: "'' ist ein echter Wert, NULL nicht – außer in Oracle, das beides gleichsetzt.",
    details: "Ein leerer String hat die Länge 0 und ist mit `=` vergleichbar, `NULL` dagegen ist unbekannt. Oracle speichert `''` als `NULL`, die anderen großen Datenbanken unterscheiden die beiden. In importierten Daten kommen oft beide Varianten gemischt vor; dann hilft `NULLIF(TRIM(spalte), '')` beim Vereinheitlichen. Ein `CHECK (spalte <> '')` verhindert leere Strings von vornherein.",
    tip: "Beim Datenimport (CSV) festlegen, ob leere Felder `NULL` oder `''` werden – und dann überall gleich behandeln.",
    keywords: ['empty string', 'leerstring', 'leerer text', "''", 'oracle null', 'blank', 'leerzeichen'],
    related: ['NULL', 'NULLIF()', 'TRIM()'],
    mdn: SL + 'nulls.html',
    dialects: {
      std: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', ''), (3, 'Weber', NULL), (4, 'Koch', '  ');

SELECT name, CHAR_LENGTH(stadt) AS laenge, stadt IS NULL AS ist_null, stadt = '' AS ist_leer
FROM kunden
ORDER BY id;
-- name    | laenge | ist_null | ist_leer
-- Müller  | 6      | false    | false
-- Schmidt | 0      | false    | true
-- Weber   | NULL   | true     | NULL
-- Koch    | 2      | false    | false

-- Vereinheitlichen: leer und nur Leerzeichen -> NULL
UPDATE kunden SET stadt = NULLIF(TRIM(stadt), '');
SELECT COUNT(*) AS ohne_stadt FROM kunden WHERE stadt IS NULL;
-- ohne_stadt
-- 3
`)
      },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', ''), (3, 'Weber', NULL), (4, 'Koch', '  ');

SELECT name, CHAR_LENGTH(stadt) AS laenge, stadt IS NULL AS ist_null, stadt = '' AS ist_leer
FROM kunden
ORDER BY id;
-- name    | laenge | ist_null | ist_leer
-- Müller  | 6      | 0        | 0
-- Schmidt | 0      | 0        | 1
-- Weber   | NULL   | 1        | NULL
-- Koch    | 2      | 0        | 0

-- Vereinheitlichen: leer und nur Leerzeichen -> NULL
UPDATE kunden SET stadt = NULLIF(TRIM(stadt), '');
SELECT COUNT(*) AS ohne_stadt FROM kunden WHERE stadt IS NULL;
-- ohne_stadt
-- 3
`),
        note: "Wahrheitswerte erscheinen als `1`/`0`. Mit den `utf8mb4_0900_*`-Kollationen (NO PAD) ist `'  '` ungleich `''`."
      },
      mssql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', ''), (3, 'Weber', NULL), (4, 'Koch', '  ');

-- LEN ignoriert Leerzeichen am Ende, = ebenfalls
SELECT name, LEN(stadt) AS laenge, DATALENGTH(stadt) AS bytes,
       CASE WHEN stadt IS NULL THEN 1 ELSE 0 END AS ist_null,
       CASE WHEN stadt = '' THEN 1 ELSE 0 END AS ist_leer
FROM kunden
ORDER BY id;
-- name    | laenge | bytes | ist_null | ist_leer
-- Müller  | 6      | 6     | 0        | 0
-- Schmidt | 0      | 0     | 0        | 1
-- Weber   | NULL   | NULL  | 1        | 0
-- Koch    | 0      | 2     | 0        | 1

-- Vereinheitlichen: leer und nur Leerzeichen -> NULL
UPDATE kunden SET stadt = NULLIF(TRIM(stadt), '');
SELECT COUNT(*) AS ohne_stadt FROM kunden WHERE stadt IS NULL;
-- ohne_stadt
-- 3
`),
        note: "Vergleiche ignorieren Leerzeichen am Ende: `'  ' = ''` ist wahr, `LEN('  ')` ist 0. Die echte Länge in Bytes liefert `DATALENGTH`."
      },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', ''), (3, 'Weber', NULL), (4, 'Koch', '  ');

SELECT name, LENGTH(stadt) AS laenge, stadt IS NULL AS ist_null, stadt = '' AS ist_leer
FROM kunden
ORDER BY id;
-- name    | laenge | ist_null | ist_leer
-- Müller  | 6      | 0        | 0
-- Schmidt | 0      | 0        | 1
-- Weber   | NULL   | 1        | NULL
-- Koch    | 2      | 0        | 0

-- Vereinheitlichen: leer und nur Leerzeichen -> NULL
UPDATE kunden SET stadt = NULLIF(TRIM(stadt), '');
SELECT COUNT(*) AS ohne_stadt FROM kunden WHERE stadt IS NULL;
-- ohne_stadt
-- 3
`),
        note: "Wahrheitswerte erscheinen als `1`/`0`; die Zeichenzahl liefert `LENGTH` (`CHAR_LENGTH` gibt es nicht)."
      }
    }
  },

  // ---------------- Zeichenketten-Funktionen ----------------
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'LENGTH()',
    desc: "Anzahl der Zeichen eines Strings – je nach Dialekt Zeichen oder Bytes.",
    details: "Standard-SQL kennt `CHAR_LENGTH` (Zeichen) und `OCTET_LENGTH` (Bytes). Die verbreitete Funktion `LENGTH` zählt je nach Datenbank Zeichen oder Bytes – bei Umlauten in UTF-8 ein Unterschied: `'Straße'` hat 6 Zeichen, aber 7 Bytes. Die Länge von `NULL` ist `NULL`.",
    tip: "Für Längenprüfungen von Benutzereingaben immer die Zeichen zählen, nicht die Bytes – sonst zählen Umlaute doppelt.",
    keywords: ['länge', 'length', 'len', 'char_length', 'anzahl zeichen', 'string länge', 'bytes', 'octet_length', 'datalength'],
    related: ['SUBSTRING()', 'TRIM()', 'VARCHAR'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: {
        syntax: "CHAR_LENGTH(text)    -- Zeichen\nOCTET_LENGTH(text)   -- Bytes",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Li'), (3, 'Straße');

SELECT name, CHAR_LENGTH(name) AS zeichen, OCTET_LENGTH(name) AS bytes
FROM kunden
ORDER BY id;
-- name   | zeichen | bytes
-- Müller | 6       | 7
-- Li     | 2       | 2
-- Straße | 6       | 7

SELECT name FROM kunden WHERE CHAR_LENGTH(name) < 3;
-- name
-- Li
`)
      },
      pg: { note: "`LENGTH(text)` ist gleichbedeutend mit `CHAR_LENGTH` und zählt Zeichen." },
      mysql: { note: "Vorsicht: `LENGTH(text)` zählt in MySQL Bytes (wie `OCTET_LENGTH`), nicht Zeichen.", mdn: MY + 'string-functions.html#function_char-length' },
      mssql: {
        syntax: "LEN(text)          -- Zeichen, ohne Leerzeichen am Ende\nDATALENGTH(text)   -- Bytes",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50));
INSERT INTO kunden VALUES (1, N'Müller'), (2, N'Li'), (3, N'Straße');

-- NVARCHAR speichert UTF-16: 2 Bytes je Zeichen
SELECT name, LEN(name) AS zeichen, DATALENGTH(name) AS bytes
FROM kunden
ORDER BY id;
-- name   | zeichen | bytes
-- Müller | 6       | 12
-- Li     | 2       | 4
-- Straße | 6       | 12

SELECT name FROM kunden WHERE LEN(name) < 3;
-- name
-- Li
`),
        note: "Kein `CHAR_LENGTH`. `LEN` ignoriert Leerzeichen am Ende, `DATALENGTH` zählt Bytes.",
        mdn: MS + 'len-transact-sql'
      },
      sqlite: {
        syntax: "LENGTH(text)         -- Zeichen\nOCTET_LENGTH(text)   -- Bytes (seit 3.43)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Li'), (3, 'Straße');

SELECT name, LENGTH(name) AS zeichen, OCTET_LENGTH(name) AS bytes
FROM kunden
ORDER BY id;
-- name   | zeichen | bytes
-- Müller | 6       | 7
-- Li     | 2       | 2
-- Straße | 6       | 7

SELECT name FROM kunden WHERE LENGTH(name) < 3;
-- name
-- Li
`),
        note: "Kein `CHAR_LENGTH`; `LENGTH` zählt bei Text Zeichen, bei BLOBs Bytes.",
        mdn: SL + 'lang_corefunc.html#length'
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'UPPER() / LOWER()',
    desc: "Wandelt einen String in Groß- bzw. Kleinbuchstaben um.",
    details: "`UPPER` und `LOWER` sind Standard-SQL und überall vorhanden. Häufigster Einsatz ist der Vergleich ohne Rücksicht auf Groß- und Kleinschreibung, etwa bei E-Mail-Adressen. Wie gut Umlaute und andere Nicht-ASCII-Zeichen umgewandelt werden, hängt von Datenbank und Zeichensatz ab. Eine Funktion auf der Spalte in `WHERE` verhindert die Nutzung eines normalen Index.",
    tip: "Für schnelle, schreibweisenunabhängige Suche einen Ausdrucksindex auf `LOWER(email)` anlegen oder eine passende Collation verwenden.",
    keywords: ['großbuchstaben', 'kleinbuchstaben', 'upper', 'lower', 'ucase', 'lcase', 'case insensitive', 'groß klein'],
    related: ['INITCAP()', 'Collation', 'Ausdrucksindex', 'ILIKE'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: {
        syntax: "UPPER(text)\nLOWER(text)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), email VARCHAR(100));
INSERT INTO kunden VALUES (1, 'Ada', 'Ada@Example.com'), (2, 'Lin', 'lin@example.com'), (3, 'Jürgen', 'J.Weber@Firma.de');

SELECT UPPER(name) AS gross, LOWER(email) AS email
FROM kunden
ORDER BY id;
-- gross  | email
-- ADA    | ada@example.com
-- LIN    | lin@example.com
-- JÜRGEN | j.weber@firma.de

SELECT name FROM kunden WHERE LOWER(email) = LOWER('ADA@example.com');
-- name
-- Ada
`)
      },
      mysql: { note: "Mit der Standard-Kollation ist `email = 'ADA@example.com'` ohnehin schreibweisenunabhängig; `LOWER` braucht man dort nur für die Anzeige. Synonyme: `UCASE`, `LCASE`." },
      mssql: { note: "Mit der Standard-Kollation (`…_CI_…`) ist `email = 'ADA@example.com'` ohnehin schreibweisenunabhängig." },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), email VARCHAR(100));
INSERT INTO kunden VALUES (1, 'Ada', 'Ada@Example.com'), (2, 'Lin', 'lin@example.com'), (3, 'Jürgen', 'J.Weber@Firma.de');

-- Ohne ICU-Erweiterung nur ASCII: das ü bleibt klein
SELECT UPPER(name) AS gross, LOWER(email) AS email
FROM kunden
ORDER BY id;
-- gross  | email
-- ADA    | ada@example.com
-- LIN    | lin@example.com
-- JüRGEN | j.weber@firma.de

SELECT name FROM kunden WHERE LOWER(email) = LOWER('ADA@example.com');
-- name
-- Ada
`),
        note: "Ohne ICU-Erweiterung wandeln `UPPER`/`LOWER` nur ASCII-Buchstaben um: `UPPER('ü')` bleibt `'ü'`.",
        mdn: SL + 'lang_corefunc.html#upper'
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'TRIM()',
    desc: "Entfernt Leerzeichen (oder andere Zeichen) am Anfang und/oder Ende.",
    details: "`TRIM` schneidet beidseitig ab; mit `LEADING` bzw. `TRAILING` nur links oder rechts, mit einem Zeichen davor andere Zeichen als Leerzeichen. Fast alle Dialekte kennen zusätzlich `LTRIM` und `RTRIM`. Leerzeichen in der Mitte bleiben erhalten.",
    tip: "Daten beim Import bereinigen (`UPDATE … SET name = TRIM(name)`) statt bei jeder Abfrage zu trimmen.",
    keywords: ['trim', 'ltrim', 'rtrim', 'btrim', 'leerzeichen entfernen', 'whitespace', 'abschneiden', 'strip'],
    related: ['REPLACE()', 'LENGTH()', 'Leerer String vs. NULL'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: {
        syntax: "TRIM([LEADING | TRAILING | BOTH] ['zeichen'] FROM text)\nTRIM(text)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, '  Ada  '), (2, 'Lin   '), (3, 'xxBenxx');

SELECT '[' || TRIM(name) || ']'                 AS beidseitig,
       '[' || TRIM(LEADING FROM name) || ']'    AS links,
       '[' || TRIM(TRAILING FROM name) || ']'   AS rechts
FROM kunden
WHERE id <= 2
ORDER BY id;
-- beidseitig | links    | rechts
-- [Ada]      | [Ada  ]  | [  Ada]
-- [Lin]      | [Lin   ] | [Lin]

SELECT TRIM(BOTH 'x' FROM name) AS ohne_x FROM kunden WHERE id = 3;
-- ohne_x
-- Ben
`)
      },
      pg: { note: "Zusätzlich `LTRIM(text [, zeichen])`, `RTRIM(…)` und `BTRIM(text, zeichen)`." },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, '  Ada  '), (2, 'Lin   '), (3, 'xxBenxx');

SELECT CONCAT('[', TRIM(name), ']')  AS beidseitig,
       CONCAT('[', LTRIM(name), ']') AS links,
       CONCAT('[', RTRIM(name), ']') AS rechts
FROM kunden
WHERE id <= 2
ORDER BY id;
-- beidseitig | links    | rechts
-- [Ada]      | [Ada  ]  | [  Ada]
-- [Lin]      | [Lin   ] | [Lin]

SELECT TRIM(BOTH 'x' FROM name) AS ohne_x FROM kunden WHERE id = 3;
-- ohne_x
-- Ben
`),
        note: "Die Standardform mit `LEADING`/`TRAILING`/`BOTH` funktioniert; `LTRIM`/`RTRIM` entfernen nur Leerzeichen. Verkettet wird mit `CONCAT`.",
        mdn: MY + 'string-functions.html#function_trim'
      },
      mssql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, '  Ada  '), (2, 'Lin   '), (3, 'xxBenxx');

SELECT '[' + TRIM(name) + ']'  AS beidseitig,
       '[' + LTRIM(name) + ']' AS links,
       '[' + RTRIM(name) + ']' AS rechts
FROM kunden
WHERE id <= 2
ORDER BY id;
-- beidseitig | links    | rechts
-- [Ada]      | [Ada  ]  | [  Ada]
-- [Lin]      | [Lin   ] | [Lin]

SELECT TRIM('x' FROM name) AS ohne_x FROM kunden WHERE id = 3;
-- ohne_x
-- Ben
`),
        note: "`TRIM` seit SQL Server 2017; `LEADING`/`TRAILING`/`BOTH` und `LTRIM(text, zeichen)` erst seit 2022. Verkettet wird mit `+`.",
        mdn: MS + 'trim-transact-sql'
      },
      sqlite: {
        syntax: "TRIM(text [, zeichen])\nLTRIM(text [, zeichen])\nRTRIM(text [, zeichen])",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, '  Ada  '), (2, 'Lin   '), (3, 'xxBenxx');

SELECT '[' || TRIM(name) || ']'  AS beidseitig,
       '[' || LTRIM(name) || ']' AS links,
       '[' || RTRIM(name) || ']' AS rechts
FROM kunden
WHERE id <= 2
ORDER BY id;
-- beidseitig | links    | rechts
-- [Ada]      | [Ada  ]  | [  Ada]
-- [Lin]      | [Lin   ] | [Lin]

SELECT TRIM(name, 'x') AS ohne_x FROM kunden WHERE id = 3;
-- ohne_x
-- Ben
`),
        note: "Keine Standardform mit `FROM`; die zu entfernenden Zeichen stehen als zweites Argument.",
        mdn: SL + 'lang_corefunc.html#trim'
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'SUBSTRING()',
    desc: "Schneidet einen Teil aus einem String: ab Position, optional mit Länge.",
    details: "Positionen beginnen in SQL bei 1, nicht bei 0. Standard-SQL schreibt `SUBSTRING(text FROM start FOR laenge)`; ohne `FOR` geht es bis zum Ende. Die meisten Dialekte verstehen zusätzlich die Kommaform `SUBSTRING(text, start, laenge)` oder `SUBSTR`.",
    tip: "Für Präfixe und Suffixe sind `LEFT()`/`RIGHT()` lesbarer – sofern der Dialekt sie kennt.",
    keywords: ['substring', 'substr', 'teilstring', 'ausschneiden', 'mid', 'zeichen ab position', 'slice'],
    related: ['LEFT() / RIGHT()', 'POSITION() / INSTR()', 'SPLIT_PART()'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: {
        syntax: "SUBSTRING(text FROM start [FOR laenge])",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, artikelnr VARCHAR(20));
INSERT INTO produkte VALUES (1, 'DE-2024-0815'), (2, 'AT-2023-4711'), (3, 'CH-2025-0042');

SELECT artikelnr,
       SUBSTRING(artikelnr FROM 1 FOR 2) AS land,
       SUBSTRING(artikelnr FROM 4 FOR 4) AS jahr,
       SUBSTRING(artikelnr FROM 9)       AS nummer
FROM produkte
ORDER BY id;
-- artikelnr    | land | jahr | nummer
-- DE-2024-0815 | DE   | 2024 | 0815
-- AT-2023-4711 | AT   | 2023 | 4711
-- CH-2025-0042 | CH   | 2025 | 0042
`)
      },
      pg: { note: "Zusätzlich die Kommaform `SUBSTRING(text, start, laenge)` und `SUBSTR`. Mit `FROM 'regex'` schneidet `SUBSTRING` einen Regex-Treffer aus." },
      mysql: { note: "Zusätzlich `SUBSTRING(text, start, laenge)` und `SUBSTR`; ein negativer Start zählt vom Ende (`SUBSTR(t, -4)`).", mdn: MY + 'string-functions.html#function_substring' },
      mssql: {
        syntax: "SUBSTRING(text, start, laenge)",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, artikelnr VARCHAR(20));
INSERT INTO produkte VALUES (1, 'DE-2024-0815'), (2, 'AT-2023-4711'), (3, 'CH-2025-0042');

SELECT artikelnr,
       SUBSTRING(artikelnr, 1, 2) AS land,
       SUBSTRING(artikelnr, 4, 4) AS jahr,
       RIGHT(artikelnr, 4)        AS nummer
FROM produkte
ORDER BY id;
-- artikelnr    | land | jahr | nummer
-- DE-2024-0815 | DE   | 2024 | 0815
-- AT-2023-4711 | AT   | 2023 | 4711
-- CH-2025-0042 | CH   | 2025 | 0042
`),
        note: "Nur die Kommaform, und die Länge ist Pflicht; für „bis zum Ende“ `RIGHT` oder eine große Länge verwenden.",
        mdn: MS + 'substring-transact-sql'
      },
      sqlite: {
        syntax: "SUBSTR(text, start [, laenge])\nSUBSTRING(text, start [, laenge])",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, artikelnr VARCHAR(20));
INSERT INTO produkte VALUES (1, 'DE-2024-0815'), (2, 'AT-2023-4711'), (3, 'CH-2025-0042');

SELECT artikelnr,
       SUBSTR(artikelnr, 1, 2) AS land,
       SUBSTR(artikelnr, 4, 4) AS jahr,
       SUBSTR(artikelnr, -4)   AS nummer     -- negativ: vom Ende
FROM produkte
ORDER BY id;
-- artikelnr    | land | jahr | nummer
-- DE-2024-0815 | DE   | 2024 | 0815
-- AT-2023-4711 | AT   | 2023 | 4711
-- CH-2025-0042 | CH   | 2025 | 0042
`),
        note: "Keine Form mit `FROM … FOR`; `SUBSTRING` ist seit 3.34 ein Alias für `SUBSTR`. Ein negativer Start zählt vom Ende.",
        mdn: SL + 'lang_corefunc.html#substr'
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'REPLACE()',
    desc: "Ersetzt alle Vorkommen eines Teilstrings durch einen anderen.",
    details: "`REPLACE(text, suche, ersatz)` ersetzt jedes Vorkommen, nicht nur das erste. Mit leerem Ersatz löscht man Zeichen. Für mehrere verschiedene Zeichen verschachtelt man `REPLACE` oder nimmt `TRANSLATE` bzw. reguläre Ausdrücke. Ob Groß- und Kleinschreibung zählt, hängt teils von der Collation ab.",
    tip: "Vor einem `UPDATE … SET x = REPLACE(…)` das Ergebnis erst mit einem `SELECT` prüfen – die Änderung trifft jede Zeile ohne `WHERE`.",
    keywords: ['ersetzen', 'replace', 'suchen ersetzen', 'search replace', 'translate', 'zeichen entfernen'],
    related: ['Reguläre Ausdrücke', 'TRIM()', 'UPDATE'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: {
        syntax: "REPLACE(text, suchtext, ersatztext)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), telefon VARCHAR(20));
INSERT INTO kunden VALUES (1, 'Müller', '030-123-45'), (2, 'Schmidt', '040 98 76'), (3, 'Weber', '089/55 66');

SELECT name,
       REPLACE(REPLACE(REPLACE(telefon, '-', ''), ' ', ''), '/', '') AS nur_ziffern
FROM kunden
ORDER BY id;
-- name    | nur_ziffern
-- Müller  | 03012345
-- Schmidt | 0409876
-- Weber   | 0895566

-- Massenänderung in einer Spalte
UPDATE kunden SET telefon = REPLACE(telefon, ' ', '-');
SELECT telefon FROM kunden WHERE id = 2;
-- telefon
-- 040-98-76
`),
        note: "`REPLACE` gehört nicht zum ISO-Standard, ist aber in allen großen Datenbanken gleich vorhanden."
      },
      pg: { note: "`TRANSLATE(text, 'abc', 'xyz')` ersetzt mehrere einzelne Zeichen auf einmal." },
      mysql: { note: "`REPLACE` unterscheidet immer Groß- und Kleinschreibung, unabhängig von der Kollation.", mdn: MY + 'string-functions.html#function_replace' },
      mssql: { note: "Ob Groß- und Kleinschreibung zählt, folgt der Collation (Standard: nein). `TRANSLATE` gibt es seit 2017.", mdn: MS + 'replace-transact-sql' },
      sqlite: { mdn: SL + 'lang_corefunc.html#replace' }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'POSITION() / INSTR()',
    desc: "Liefert die Position eines Teilstrings (ab 1), 0 wenn er nicht vorkommt.",
    details: "Standard-SQL schreibt `POSITION(suche IN text)`. Viele Dialekte haben eigene Funktionen dafür, teils mit umgekehrter Reihenfolge der Argumente. Zusammen mit `SUBSTRING` lassen sich so Teile vor oder nach einem Trennzeichen herauslösen.",
    tip: "Für eine reine Enthält-Prüfung ist `LIKE '%@%'` meist lesbarer als `POSITION(…) > 0`.",
    keywords: ['position', 'instr', 'charindex', 'strpos', 'locate', 'index of', 'suchen', 'finden', 'enthält'],
    related: ['SUBSTRING()', 'SPLIT_PART()', 'LIKE'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: {
        syntax: "POSITION(suche IN text)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, email VARCHAR(100));
INSERT INTO kunden VALUES (1, 'ada@example.com'), (2, 'lin.wu@firma.de'), (3, 'ohne-at');

SELECT email,
       POSITION('@' IN email)                                  AS pos,
       SUBSTRING(email FROM 1 FOR POSITION('@' IN email) - 1)  AS benutzer,
       SUBSTRING(email FROM POSITION('@' IN email) + 1)        AS domain
FROM kunden
WHERE POSITION('@' IN email) > 0
ORDER BY id;
-- email           | pos | benutzer | domain
-- ada@example.com | 4   | ada      | example.com
-- lin.wu@firma.de | 7   | lin.wu   | firma.de
`)
      },
      pg: { note: "Zusätzlich `STRPOS(text, suche)`." },
      mysql: { note: "Zusätzlich `INSTR(text, suche)` und `LOCATE(suche, text [, ab])`.", mdn: MY + 'string-functions.html#function_position' },
      mssql: {
        syntax: "CHARINDEX(suche, text [, ab_position])",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, email VARCHAR(100));
INSERT INTO kunden VALUES (1, 'ada@example.com'), (2, 'lin.wu@firma.de'), (3, 'ohne-at');

SELECT email,
       CHARINDEX('@', email)                                      AS pos,
       SUBSTRING(email, 1, CHARINDEX('@', email) - 1)             AS benutzer,
       SUBSTRING(email, CHARINDEX('@', email) + 1, LEN(email))    AS domain
FROM kunden
WHERE CHARINDEX('@', email) > 0
ORDER BY id;
-- email           | pos | benutzer | domain
-- ada@example.com | 4   | ada      | example.com
-- lin.wu@firma.de | 7   | lin.wu   | firma.de
`),
        note: "Kein `POSITION`; `CHARINDEX` nimmt den Suchtext zuerst. `PATINDEX('%[0-9]%', text)` sucht nach Mustern.",
        mdn: MS + 'charindex-transact-sql'
      },
      sqlite: {
        syntax: "INSTR(text, suche)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, email VARCHAR(100));
INSERT INTO kunden VALUES (1, 'ada@example.com'), (2, 'lin.wu@firma.de'), (3, 'ohne-at');

SELECT email,
       INSTR(email, '@')                       AS pos,
       SUBSTR(email, 1, INSTR(email, '@') - 1) AS benutzer,
       SUBSTR(email, INSTR(email, '@') + 1)    AS domain
FROM kunden
WHERE INSTR(email, '@') > 0
ORDER BY id;
-- email           | pos | benutzer | domain
-- ada@example.com | 4   | ada      | example.com
-- lin.wu@firma.de | 7   | lin.wu   | firma.de
`),
        note: "Kein `POSITION`; `INSTR` nimmt den Text zuerst.",
        mdn: SL + 'lang_corefunc.html#instr'
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'CONCAT()',
    desc: "Verkettet beliebig viele Werte zu einem String – der Umgang mit NULL ist je Dialekt verschieden.",
    details: "`CONCAT(a, b, …)` hängt Werte aneinander und wandelt Zahlen automatisch in Text um. Die meisten Dialekte behandeln `NULL` dabei wie einen leeren String, anders als der Verkettungsoperator, bei dem ein `NULL` das ganze Ergebnis `NULL` macht. `CONCAT_WS(trenner, …)` fügt einen Trenner zwischen die Werte ein und lässt `NULL`-Werte samt Trenner weg.",
    tip: "`CONCAT_WS(', ', strasse, plz, ort)` baut Adresszeilen ohne doppelte Kommas, wenn ein Teil fehlt.",
    keywords: ['verketten', 'concat', 'concat_ws', 'zusammenfügen', 'string verbinden', 'join strings', 'plus'],
    related: ['|| (Verkettung)', 'STRING_AGG() / GROUP_CONCAT()', 'COALESCE()'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: { none: "Kein `CONCAT` im ISO-Standard; verkettet wird mit `a || b` – ein `NULL` macht das Ergebnis `NULL`, daher mit `COALESCE` absichern." },
      pg: {
        syntax: "CONCAT(wert1, wert2 [, …])\nCONCAT_WS(trenner, wert1, wert2 [, …])",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, titel VARCHAR(10), vorname VARCHAR(50), nachname VARCHAR(50));
INSERT INTO kunden VALUES (1, NULL, 'Ada', 'Lovelace'), (2, 'Dr.', 'Alan', 'Turing');

SELECT CONCAT(nachname, ' (', titel, ')')       AS mit_concat,
       nachname || ' (' || titel || ')'        AS mit_pipe,
       CONCAT_WS(' ', titel, vorname, nachname) AS anrede
FROM kunden
ORDER BY id;
-- mit_concat   | mit_pipe     | anrede
-- Lovelace ()  | NULL         | Ada Lovelace
-- Turing (Dr.) | Turing (Dr.) | Dr. Alan Turing
`),
        note: "`CONCAT` überspringt `NULL`, `||` liefert dann `NULL`."
      },
      mysql: {
        syntax: "CONCAT(wert1, wert2 [, …])\nCONCAT_WS(trenner, wert1, wert2 [, …])",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, titel VARCHAR(10), vorname VARCHAR(50), nachname VARCHAR(50));
INSERT INTO kunden VALUES (1, NULL, 'Ada', 'Lovelace'), (2, 'Dr.', 'Alan', 'Turing');

SELECT CONCAT(nachname, ' (', titel, ')')        AS mit_concat,
       CONCAT(nachname, ' (', COALESCE(titel, '-'), ')') AS abgesichert,
       CONCAT_WS(' ', titel, vorname, nachname)  AS anrede
FROM kunden
ORDER BY id;
-- mit_concat   | abgesichert  | anrede
-- NULL         | Lovelace (-) | Ada Lovelace
-- Turing (Dr.) | Turing (Dr.) | Dr. Alan Turing
`),
        note: "Anders als die übrigen Dialekte liefert `CONCAT` `NULL`, sobald ein Argument `NULL` ist; `CONCAT_WS` überspringt `NULL`. `||` ist ein logisches ODER.",
        mdn: MY + 'string-functions.html#function_concat'
      },
      mssql: {
        syntax: "CONCAT(wert1, wert2 [, …])\nCONCAT_WS(trenner, wert1, wert2 [, …])\na + b",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, titel VARCHAR(10), vorname VARCHAR(50), nachname VARCHAR(50));
INSERT INTO kunden VALUES (1, NULL, 'Ada', 'Lovelace'), (2, 'Dr.', 'Alan', 'Turing');

SELECT CONCAT(nachname, ' (', titel, ')')       AS mit_concat,
       nachname + ' (' + titel + ')'          AS mit_plus,
       CONCAT_WS(' ', titel, vorname, nachname) AS anrede
FROM kunden
ORDER BY id;
-- mit_concat   | mit_plus     | anrede
-- Lovelace ()  | NULL         | Ada Lovelace
-- Turing (Dr.) | Turing (Dr.) | Dr. Alan Turing
`),
        note: "Verkettungsoperator ist `+`; `CONCAT_WS` seit SQL Server 2017. `+` mit einer Zahl versucht zu addieren – `CONCAT` wandelt dagegen um.",
        mdn: MS + 'concat-transact-sql'
      },
      sqlite: {
        syntax: "CONCAT(wert1, wert2 [, …])\nCONCAT_WS(trenner, wert1, wert2 [, …])",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, titel VARCHAR(10), vorname VARCHAR(50), nachname VARCHAR(50));
INSERT INTO kunden VALUES (1, NULL, 'Ada', 'Lovelace'), (2, 'Dr.', 'Alan', 'Turing');

SELECT CONCAT(nachname, ' (', titel, ')')       AS mit_concat,
       nachname || ' (' || titel || ')'        AS mit_pipe,
       CONCAT_WS(' ', titel, vorname, nachname) AS anrede
FROM kunden
ORDER BY id;
-- mit_concat   | mit_pipe     | anrede
-- Lovelace ()  | NULL         | Ada Lovelace
-- Turing (Dr.) | Turing (Dr.) | Dr. Alan Turing
`),
        note: "`CONCAT` und `CONCAT_WS` gibt es erst seit SQLite 3.44; davor nur `||`.",
        mdn: SL + 'lang_corefunc.html#concat'
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'LEFT() / RIGHT()',
    desc: "Liefert die ersten bzw. letzten n Zeichen eines Strings.",
    details: "`LEFT(text, n)` und `RIGHT(text, n)` sind lesbare Kurzformen für `SUBSTRING` am Anfang bzw. Ende eines Strings. Ist `n` größer als die Länge, kommt der ganze String zurück. Wo die Funktionen fehlen, hilft `SUBSTR` mit negativem Start oder `SUBSTRING` mit der Länge.",
    tip: "Wer zwischen allen Dialekten portabel bleiben will, nimmt `SUBSTRING` – die Kommaform verstehen alle hier gezeigten Datenbanken.",
    keywords: ['left', 'right', 'links', 'rechts', 'erste zeichen', 'letzte zeichen', 'präfix', 'suffix'],
    related: ['SUBSTRING()', 'LPAD() / RPAD()', 'LENGTH()'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: {
        syntax: "LEFT(text, n)\nRIGHT(text, n)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), plz VARCHAR(5), iban VARCHAR(34));
INSERT INTO kunden VALUES
  (1, 'Müller', '10115', 'DE89370400440532013000'),
  (2, 'Weber',  '20095', 'DE02120300000000202051');

SELECT name,
       LEFT(plz, 2)   AS plz_bereich,
       RIGHT(iban, 4) AS iban_ende
FROM kunden
ORDER BY id;
-- name   | plz_bereich | iban_ende
-- Müller | 10          | 3000
-- Weber  | 20          | 2051
`),
        note: "`LEFT`/`RIGHT` stehen nicht im ISO-Standard (dort `SUBSTRING(t FROM 1 FOR n)`), sind aber weit verbreitet."
      },
      pg: { note: "`n` darf negativ sein: `LEFT(text, -2)` liefert alles außer den letzten zwei Zeichen." },
      mysql: { mdn: MY + 'string-functions.html#function_left' },
      mssql: { mdn: MS + 'left-transact-sql' },
      sqlite: {
        syntax: "SUBSTR(text, 1, n)   -- erste n Zeichen\nSUBSTR(text, -n)     -- letzte n Zeichen",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), plz VARCHAR(5), iban VARCHAR(34));
INSERT INTO kunden VALUES
  (1, 'Müller', '10115', 'DE89370400440532013000'),
  (2, 'Weber',  '20095', 'DE02120300000000202051');

SELECT name,
       SUBSTR(plz, 1, 2) AS plz_bereich,
       SUBSTR(iban, -4)  AS iban_ende
FROM kunden
ORDER BY id;
-- name   | plz_bereich | iban_ende
-- Müller | 10          | 3000
-- Weber  | 20          | 2051
`),
        note: "Kein `LEFT`/`RIGHT`; `SUBSTR` mit negativem Start zählt vom Ende."
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'LPAD() / RPAD()',
    desc: "Füllt einen String links bzw. rechts mit Zeichen auf eine feste Länge auf.",
    details: "`LPAD(text, laenge, fuell)` ergänzt links, `RPAD` rechts; ist der Text schon länger, wird er auf `laenge` gekürzt. Nicht jeder Dialekt hat die Funktionen; dann hilft das Muster „Füllzeichen davorhängen und die letzten n Zeichen nehmen“. Typisch sind führende Nullen für Belegnummern.",
    tip: "Führende Nullen sind Darstellung – gespeichert wird die Zahl ohne Füllzeichen, formatiert wird erst bei der Ausgabe.",
    keywords: ['lpad', 'rpad', 'auffüllen', 'führende nullen', 'padding', 'feste länge', 'leading zeros'],
    related: ['FORMAT() / printf()', 'LEFT() / RIGHT()', ':: (PostgreSQL-Cast)'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: { none: "Kein `LPAD`/`RPAD` im Standard; nachbauen mit `SUBSTRING('00000' || x FROM CHAR_LENGTH(x) + 1)`." },
      pg: {
        syntax: "LPAD(text, laenge [, fuellzeichen])\nRPAD(text, laenge [, fuellzeichen])",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde VARCHAR(20), betrag DECIMAL(8,2));
INSERT INTO bestellungen VALUES (7, 'Ada', 19.90), (42, 'Lin', 250.00), (815, 'Max', 5.00);

SELECT LPAD(CAST(id AS VARCHAR), 5, '0')      AS nummer,
       RPAD(kunde, 6, '.')                    AS kunde,
       LPAD(CAST(betrag AS VARCHAR), 8, '*')  AS betrag
FROM bestellungen
ORDER BY id;
-- nummer | kunde  | betrag
-- 00007  | Ada... | ***19.90
-- 00042  | Lin... | **250.00
-- 00815  | Max... | ****5.00
`),
        note: "Erwartet Text; Zahlen vorher mit `CAST` oder `::text` umwandeln. Ohne Füllzeichen wird mit Leerzeichen aufgefüllt."
      },
      mysql: {
        syntax: "LPAD(text, laenge, fuellzeichen)\nRPAD(text, laenge, fuellzeichen)",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde VARCHAR(20), betrag DECIMAL(8,2));
INSERT INTO bestellungen VALUES (7, 'Ada', 19.90), (42, 'Lin', 250.00), (815, 'Max', 5.00);

SELECT LPAD(id, 5, '0')     AS nummer,
       RPAD(kunde, 6, '.')  AS kunde,
       LPAD(betrag, 8, '*') AS betrag
FROM bestellungen
ORDER BY id;
-- nummer | kunde  | betrag
-- 00007  | Ada... | ***19.90
-- 00042  | Lin... | **250.00
-- 00815  | Max... | ****5.00
`),
        note: "Das Füllzeichen ist Pflicht; Zahlen werden automatisch in Text umgewandelt.",
        mdn: MY + 'string-functions.html#function_lpad'
      },
      mssql: {
        syntax: "RIGHT(REPLICATE('0', n) + text, n)   -- links auffüllen\nLEFT(text + REPLICATE('.', n), n)    -- rechts auffüllen\nFORMAT(zahl, 'D5')                   -- führende Nullen",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde VARCHAR(20), betrag DECIMAL(8,2));
INSERT INTO bestellungen VALUES (7, 'Ada', 19.90), (42, 'Lin', 250.00), (815, 'Max', 5.00);

SELECT FORMAT(id, 'D5')                                         AS nummer,
       LEFT(kunde + REPLICATE('.', 6), 6)                       AS kunde,
       RIGHT(REPLICATE('*', 8) + CAST(betrag AS VARCHAR(10)), 8) AS betrag
FROM bestellungen
ORDER BY id;
-- nummer | kunde  | betrag
-- 00007  | Ada... | ***19.90
-- 00042  | Lin... | **250.00
-- 00815  | Max... | ****5.00
`),
        note: "Kein `LPAD`/`RPAD`; Füllzeichen mit `REPLICATE` davor- bzw. dahinterhängen und mit `RIGHT`/`LEFT` kürzen.",
        mdn: MS + 'replicate-transact-sql'
      },
      sqlite: {
        syntax: "printf('%05d', zahl)                -- führende Nullen\nSUBSTR('****' || text, -n)          -- links auffüllen",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde VARCHAR(20), betrag DECIMAL(8,2));
INSERT INTO bestellungen VALUES (7, 'Ada', 19.90), (42, 'Lin', 250.00), (815, 'Max', 5.00);

SELECT printf('%05d', id)                          AS nummer,
       SUBSTR(kunde || '......', 1, 6)             AS kunde,
       SUBSTR('********' || printf('%.2f', betrag), -8) AS betrag
FROM bestellungen
ORDER BY id;
-- nummer | kunde  | betrag
-- 00007  | Ada... | ***19.90
-- 00042  | Lin... | **250.00
-- 00815  | Max... | ****5.00
`),
        note: "Kein `LPAD`/`RPAD`; `printf` füllt mit Nullen oder Leerzeichen, für andere Zeichen hilft `SUBSTR`.",
        mdn: SL + 'printf.html'
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'INITCAP()',
    desc: "Schreibt den ersten Buchstaben jedes Worts groß, den Rest klein.",
    details: "`INITCAP` gibt es in PostgreSQL und Oracle, in den anderen Dialekten fehlt eine eingebaute Entsprechung. Als Wortgrenze gilt jedes Zeichen, das kein Buchstabe oder keine Ziffer ist, deshalb wird aus `o'neil` `O'Neil` und aus `müller-lüdenscheidt` `Müller-Lüdenscheidt`. Namen wie `McDonald` oder `van der Berg` werden dabei falsch geschrieben.",
    tip: "Namen nicht automatisch „korrigieren“ – `INITCAP` eignet sich für Anzeige-Normalisierung, nicht zum Überschreiben von Stammdaten.",
    keywords: ['initcap', 'title case', 'großschreibung', 'erster buchstabe groß', 'capitalize', 'proper case'],
    related: ['UPPER() / LOWER()', 'SUBSTRING()'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: { none: "Kein `INITCAP` im Standard; nur das erste Zeichen: `UPPER(SUBSTRING(t FROM 1 FOR 1)) || LOWER(SUBSTRING(t FROM 2))`." },
      pg: {
        syntax: "INITCAP(text)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'ada lovelace'), (2, 'MÜLLER-LÜDENSCHEIDT'), (3, 'o''neil');

SELECT INITCAP(name) AS name FROM kunden ORDER BY id;
-- name
-- Ada Lovelace
-- Müller-Lüdenscheidt
-- O'Neil
`)
      },
      mysql: { none: "Kein `INITCAP`; nur das erste Zeichen: `CONCAT(UPPER(LEFT(t, 1)), LOWER(SUBSTRING(t, 2)))`." },
      mssql: { none: "Kein `INITCAP`; nur das erste Zeichen: `UPPER(LEFT(t, 1)) + LOWER(SUBSTRING(t, 2, LEN(t)))`." },
      sqlite: { none: "Kein `INITCAP`; nur das erste Zeichen: `UPPER(SUBSTR(t, 1, 1)) || LOWER(SUBSTR(t, 2))` (nur ASCII)." }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'SPLIT_PART()',
    desc: "Liefert den n-ten Teil eines Strings, der an einem Trennzeichen zerlegt wird.",
    details: "`SPLIT_PART(text, trenner, n)` zerlegt einen String und gibt den n-ten Teil zurück. Die Funktion stammt aus PostgreSQL; andere Dialekte haben eigene Werkzeuge, die sich bei fehlenden Teilen unterschiedlich verhalten oder gleich eine Zeile pro Teil liefern.",
    tip: "Kommagetrennte Listen in einer Spalte sind ein Designproblem (1. Normalform) – besser eine eigene Tabelle mit einer Zeile pro Wert.",
    keywords: ['split', 'split_part', 'zerlegen', 'trennen', 'trennzeichen', 'substring_index', 'string_split', 'delimiter'],
    related: ['POSITION() / INSTR()', 'SUBSTRING()', '1. Normalform'],
    mdn: PG + 'functions-string.html',
    dialects: {
      std: { none: "Kein `SPLIT_PART` im Standard; mit `POSITION` und `SUBSTRING` nachbauen." },
      pg: {
        syntax: "SPLIT_PART(text, trenner, n)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, email VARCHAR(100), tags VARCHAR(100));
INSERT INTO kunden VALUES (1, 'ada@example.com', 'vip,newsletter'), (2, 'lin@firma.de', 'newsletter');

-- Gibt es weniger Teile als n, kommt ein leerer String zurück
SELECT SPLIT_PART(email, '@', 1) AS benutzer,
       SPLIT_PART(email, '@', 2) AS domain,
       SPLIT_PART(tags, ',', 2)  AS zweiter_tag
FROM kunden
ORDER BY id;
-- benutzer | domain      | zweiter_tag
-- ada      | example.com | newsletter
-- lin      | firma.de    |
`),
        note: "Ein negatives `n` zählt seit Version 14 von hinten. Als Zeilen: `string_to_table(text, ',')`."
      },
      mysql: {
        syntax: "SUBSTRING_INDEX(text, trenner, n)   -- alles vor dem n-ten Trenner (n < 0: von hinten)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, email VARCHAR(100), tags VARCHAR(100));
INSERT INTO kunden VALUES (1, 'ada@example.com', 'vip,newsletter'), (2, 'lin@firma.de', 'newsletter');

-- Vorsicht: Fehlt der zweite Teil, liefert die Verschachtelung den ersten
SELECT SUBSTRING_INDEX(email, '@', 1)                         AS benutzer,
       SUBSTRING_INDEX(email, '@', -1)                        AS domain,
       SUBSTRING_INDEX(SUBSTRING_INDEX(tags, ',', 2), ',', -1) AS zweiter_tag
FROM kunden
ORDER BY id;
-- benutzer | domain      | zweiter_tag
-- ada      | example.com | newsletter
-- lin      | firma.de    | newsletter
`),
        note: "Kein `SPLIT_PART`; der n-te Teil entsteht aus zwei verschachtelten `SUBSTRING_INDEX`-Aufrufen.",
        mdn: MY + 'string-functions.html#function_substring-index'
      },
      mssql: {
        syntax: "STRING_SPLIT(text, trenner [, enable_ordinal])   -- Tabellenfunktion",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, email VARCHAR(100), tags VARCHAR(100));
INSERT INTO kunden VALUES (1, 'ada@example.com', 'vip,newsletter'), (2, 'lin@firma.de', 'newsletter');

-- Eine Zeile pro Teil; ordinal (seit 2022) nummeriert ab 1
SELECT k.id, t.ordinal, t.value AS tag
FROM kunden AS k
CROSS APPLY STRING_SPLIT(k.tags, ',', 1) AS t
ORDER BY k.id, t.ordinal;
-- id | ordinal | tag
-- 1  | 1       | vip
-- 1  | 2       | newsletter
-- 2  | 1       | newsletter
`),
        note: "Kein `SPLIT_PART`; `STRING_SPLIT` liefert eine Zeile pro Teil, die Nummer `ordinal` gibt es seit SQL Server 2022.",
        mdn: MS + 'string-split-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, email VARCHAR(100), tags VARCHAR(100));
INSERT INTO kunden VALUES (1, 'ada@example.com', 'vip,newsletter'), (2, 'lin@firma.de', 'newsletter');

SELECT SUBSTR(email, 1, INSTR(email, '@') - 1) AS benutzer,
       SUBSTR(email, INSTR(email, '@') + 1)    AS domain
FROM kunden
ORDER BY id;
-- benutzer | domain
-- ada      | example.com
-- lin      | firma.de
`),
        note: "Nichts Eingebautes; den ersten und letzten Teil liefern `INSTR` und `SUBSTR`, für alle Teile eine rekursive CTE."
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'FORMAT() / printf()',
    desc: "Baut Text aus einer Formatvorlage mit Platzhaltern – je Dialekt sehr verschieden.",
    details: "Für formatierte Ausgaben (führende Nullen, feste Nachkommastellen, Tausendertrennzeichen) hat jeder Dialekt eigene Funktionen mit eigenen Platzhaltern. Das Ergebnis ist immer Text: Mit formatierten Zahlen lässt sich nicht mehr rechnen und sie sortieren alphabetisch.",
    tip: "Formatierung mit Komma als Dezimaltrenner gehört meist in die Anwendung, nicht in die Abfrage – sonst kann man mit dem Ergebnis nicht mehr rechnen.",
    keywords: ['printf', 'format', 'formatieren', 'to_char', 'platzhalter', 'zahlenformat', 'tausendertrennzeichen', 'sprintf'],
    related: ['LPAD() / RPAD()', 'ROUND()', 'Datum formatieren'],
    mdn: SL + 'lang_corefunc.html#printf',
    dialects: {
      std: { none: "Keine Formatierungsfunktion im Standard; nur `CAST(x AS VARCHAR(n))` und Verketten." },
      pg: {
        syntax: "to_char(zahl, 'muster')          -- 0 = Ziffer, 9 = optionale Ziffer, FM = ohne Füll-Leerzeichen\nformat('vorlage %s', wert, …)   -- %s Text, %I Bezeichner, %L Literal",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(8,2), lager INT);
INSERT INTO produkte VALUES (7, 'Maus', 19.90, 1250), (42, 'Monitor', 199.00, 38), (815, 'Kabel', 4.50, 120000);

SELECT format('ART-%s', to_char(id, 'FM00000'))   AS nummer,
       to_char(preis, 'FM9990.00') || ' EUR'      AS preis,
       to_char(lager, 'FM999,999') || ' Stück'    AS lager
FROM produkte
ORDER BY id;
-- nummer    | preis      | lager
-- ART-00007 | 19.90 EUR  | 1,250 Stück
-- ART-00042 | 199.00 EUR | 38 Stück
-- ART-00815 | 4.50 EUR   | 120,000 Stück
`),
        note: "Im `to_char`-Muster stehen `D` und `G` für Dezimal- und Tausendertrennzeichen der eingestellten Locale (`lc_numeric`).",
        mdn: PG + 'functions-formatting.html'
      },
      mysql: {
        syntax: "FORMAT(zahl, stellen [, locale])   -- rundet, mit Tausendertrennzeichen",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(8,2), lager INT);
INSERT INTO produkte VALUES (7, 'Maus', 19.90, 1250), (42, 'Monitor', 199.00, 38), (815, 'Kabel', 4.50, 120000);

SELECT CONCAT('ART-', LPAD(id, 5, '0'))  AS nummer,
       CONCAT(FORMAT(preis, 2), ' EUR')  AS preis,
       CONCAT(FORMAT(lager, 0), ' Stück') AS lager,
       FORMAT(lager, 0, 'de_DE')         AS lager_de
FROM produkte
ORDER BY id;
-- nummer    | preis      | lager         | lager_de
-- ART-00007 | 19.90 EUR  | 1,250 Stück   | 1.250
-- ART-00042 | 199.00 EUR | 38 Stück      | 38
-- ART-00815 | 4.50 EUR   | 120,000 Stück | 120.000
`),
        note: "`FORMAT` kennt nur Zahlen mit Nachkommastellen und Tausendertrennzeichen; führende Nullen über `LPAD`.",
        mdn: MY + 'string-functions.html#function_format'
      },
      mssql: {
        syntax: "FORMAT(wert, 'muster' [, 'kultur'])   -- .NET-Formate: D5, N2, 'dd.MM.yyyy' …",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(8,2), lager INT);
INSERT INTO produkte VALUES (7, 'Maus', 19.90, 1250), (42, 'Monitor', 199.00, 38), (815, 'Kabel', 4.50, 120000);

SELECT 'ART-' + FORMAT(id, 'D5')          AS nummer,
       FORMAT(preis, 'N2') + ' EUR'        AS preis,
       FORMAT(lager, 'N0') + ' Stück'      AS lager,
       FORMAT(lager, 'N0', 'de-DE')        AS lager_de
FROM produkte
ORDER BY id;
-- nummer    | preis      | lager         | lager_de
-- ART-00007 | 19.90 EUR  | 1,250 Stück   | 1.250
-- ART-00042 | 199.00 EUR | 38 Stück      | 38
-- ART-00815 | 4.50 EUR   | 120,000 Stück | 120.000
`),
        note: "`FORMAT` nutzt .NET-Formatstrings und ist bei vielen Zeilen langsam; ohne Kultur gilt die Sprache der Sitzung.",
        mdn: MS + 'format-transact-sql'
      },
      sqlite: {
        syntax: "printf('format', wert1 [, …])   -- auch format(…)\n%d / %05d   Ganzzahl / mit führenden Nullen\n%.2f        2 Nachkommastellen\n%,d         Tausendertrennzeichen\n%s / %-10s  Text / linksbündig",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(8,2), lager INT);
INSERT INTO produkte VALUES (7, 'Maus', 19.90, 1250), (42, 'Monitor', 199.00, 38), (815, 'Kabel', 4.50, 120000);

SELECT printf('ART-%05d', id)     AS nummer,
       printf('%.2f EUR', preis)  AS preis,
       printf('%,d Stück', lager) AS lager
FROM produkte
ORDER BY id;
-- nummer    | preis      | lager
-- ART-00007 | 19.90 EUR  | 1,250 Stück
-- ART-00042 | 199.00 EUR | 38 Stück
-- ART-00815 | 4.50 EUR   | 120,000 Stück
`),
        note: "`printf` (seit 3.38 auch als `format`) arbeitet mit C-Platzhaltern; `%%` ergibt ein Prozentzeichen.",
        mdn: SL + 'printf.html'
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'Reguläre Ausdrücke',
    desc: "Mustersuche und -ersetzung mit Regex – mächtiger als LIKE, aber dialektabhängig.",
    details: "Reguläre Ausdrücke prüfen Formate (Postleitzahl, E-Mail) und ersetzen Muster. Standard-SQL kennt `SIMILAR TO` (eine Mischung aus `LIKE` und Regex) und `LIKE_REGEX`, verbreitet sind aber eigene Operatoren und `REGEXP_*`-Funktionen der Dialekte. Die Regex-Varianten unterscheiden sich in Details wie `\\d` oder Flags.",
    tip: "Regex-Bedingungen können keinen normalen Index nutzen; für häufige Prüfungen lieber einen `CHECK`-Constraint beim Schreiben als eine Regex-Suche beim Lesen.",
    keywords: ['regex', 'regulärer ausdruck', 'regexp', 'regexp_replace', 'muster', 'pattern', 'similar to', 'rlike', 'glob'],
    related: ['LIKE', 'REPLACE()', 'CHECK'],
    mdn: PG + 'functions-matching.html',
    dialects: {
      std: {
        syntax: "text SIMILAR TO 'muster'      -- muss den ganzen String treffen\ntext NOT SIMILAR TO 'muster'",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), telefon VARCHAR(20), plz VARCHAR(10));
INSERT INTO kunden VALUES
  (1, 'Müller', '030-123 45', '10115'), (2, 'Weber', '(040) 98 76', '2009'), (3, 'Koch', '+49 89 5566', '80331');

-- Ungültige Postleitzahlen finden (nicht genau 5 Ziffern)
SELECT name, plz FROM kunden WHERE plz NOT SIMILAR TO '[0-9]{5}' ORDER BY id;
-- name  | plz
-- Weber | 2009
`)
      },
      pg: {
        syntax: "text ~ 'muster'      -- passt (~* ohne Groß/Klein, !~ passt nicht)\nregexp_replace(text, 'muster', 'ersatz' [, 'g'])",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), telefon VARCHAR(20), plz VARCHAR(10));
INSERT INTO kunden VALUES
  (1, 'Müller', '030-123 45', '10115'), (2, 'Weber', '(040) 98 76', '2009'), (3, 'Koch', '+49 89 5566', '80331');

-- Ungültige Postleitzahlen finden (nicht genau 5 Ziffern)
SELECT name, plz FROM kunden WHERE plz !~ '^\\d{5}$' ORDER BY id;
-- name  | plz
-- Weber | 2009

-- Alles außer Ziffern und + entfernen ('g' = alle Treffer)
SELECT name, regexp_replace(telefon, '[^0-9+]', '', 'g') AS telefon
FROM kunden ORDER BY id;
-- name   | telefon
-- Müller | 03012345
-- Weber  | 0409876
-- Koch   | +49895566
`),
        note: "Weitere Funktionen: `regexp_match`, `regexp_count`, `regexp_split_to_table`. Ohne `'g'` ersetzt `regexp_replace` nur den ersten Treffer."
      },
      mysql: {
        syntax: "text REGEXP 'muster'          -- auch RLIKE, REGEXP_LIKE(text, muster)\nREGEXP_REPLACE(text, 'muster', 'ersatz')",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), telefon VARCHAR(20), plz VARCHAR(10));
INSERT INTO kunden VALUES
  (1, 'Müller', '030-123 45', '10115'), (2, 'Weber', '(040) 98 76', '2009'), (3, 'Koch', '+49 89 5566', '80331');

-- Ungültige Postleitzahlen finden (nicht genau 5 Ziffern)
SELECT name, plz FROM kunden WHERE plz NOT REGEXP '^[0-9]{5}$' ORDER BY id;
-- name  | plz
-- Weber | 2009

-- REGEXP_REPLACE ersetzt standardmäßig alle Treffer
SELECT name, REGEXP_REPLACE(telefon, '[^0-9+]', '') AS telefon
FROM kunden ORDER BY id;
-- name   | telefon
-- Müller | 03012345
-- Weber  | 0409876
-- Koch   | +49895566
`),
        note: "Seit MySQL 8.0 mit ICU-Regex; zusätzlich `REGEXP_SUBSTR` und `REGEXP_INSTR`. Die Suche folgt der Kollation, ist also meist schreibweisenunabhängig.",
        mdn: MY + 'regexp.html'
      },
      mssql: {
        syntax: "text LIKE '[0-9][0-9]%'      -- Zeichenklassen in LIKE\nPATINDEX('%[^0-9]%', text)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), telefon VARCHAR(20), plz VARCHAR(10));
INSERT INTO kunden VALUES
  (1, 'Müller', '030-123 45', '10115'), (2, 'Weber', '(040) 98 76', '2009'), (3, 'Koch', '+49 89 5566', '80331');

-- Ungültige Postleitzahlen finden (nicht genau 5 Ziffern)
SELECT name, plz FROM kunden WHERE plz NOT LIKE '[0-9][0-9][0-9][0-9][0-9]' ORDER BY id;
-- name  | plz
-- Weber | 2009

-- Position des ersten Zeichens, das keine Ziffer ist
SELECT name, PATINDEX('%[^0-9]%', telefon) AS erste_nicht_ziffer
FROM kunden ORDER BY id;
-- name   | erste_nicht_ziffer
-- Müller | 4
-- Weber  | 1
-- Koch   | 1
`),
        note: "Echte reguläre Ausdrücke (`REGEXP_LIKE`, `REGEXP_REPLACE`) erst ab SQL Server 2025; vorher nur `LIKE`/`PATINDEX` mit Zeichenklassen wie `[0-9]`.",
        mdn: MS + 'patindex-transact-sql'
      },
      sqlite: {
        syntax: "text GLOB 'muster'     -- * ? [0-9], Groß/Klein zählt\ntext REGEXP 'muster'   -- nur mit Erweiterung",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), telefon VARCHAR(20), plz VARCHAR(10));
INSERT INTO kunden VALUES
  (1, 'Müller', '030-123 45', '10115'), (2, 'Weber', '(040) 98 76', '2009'), (3, 'Koch', '+49 89 5566', '80331');

-- Ungültige Postleitzahlen finden (nicht genau 5 Ziffern)
SELECT name, plz FROM kunden WHERE plz NOT GLOB '[0-9][0-9][0-9][0-9][0-9]' ORDER BY id;
-- name  | plz
-- Weber | 2009
`),
        note: "`REGEXP` ist nur ein Operatorname: Die Funktion `regexp()` muss die Anwendung oder eine Erweiterung bereitstellen. Eingebaut ist `GLOB` mit Unix-Platzhaltern.",
        mdn: SL + 'lang_expr.html#glob'
      }
    }
  },
  {
    lang: 'sql', group: 'Zeichenketten-Funktionen', name: 'Collation',
    desc: "Regeln für Vergleich und Sortierung von Text: Groß/Klein, Akzente, Sprache.",
    details: "Die Collation legt fest, ob `'a' = 'A'` gilt und wie `ä`, `ß` oder `Z` vs. `a` sortiert werden. Sie lässt sich pro Datenbank, Spalte oder Ausdruck (`COLLATE name`) setzen. Die Klausel `COLLATE` ist Standard, die Namen der Collations sind es nicht. Ein Index hilft nur, wenn seine Collation zur Abfrage passt.",
    tip: "Die Collation am besten schon in der Spaltendefinition festlegen, dann gelten Vergleiche, `UNIQUE` und Index einheitlich.",
    keywords: ['collation', 'collate', 'sortierreihenfolge', 'case insensitive', 'nocase', 'groß klein', 'akzente', 'umlaute sortieren'],
    related: ['UPPER() / LOWER()', 'ORDER BY', 'ILIKE'],
    mdn: PG + 'collation.html',
    dialects: {
      std: { none: "Die Klausel `spalte COLLATE name` ist Standard, die Namen der Collations aber nicht – siehe die Dialekt-Tabs." },
      pg: {
        syntax: "ausdruck COLLATE \"C\"            -- Bytereihenfolge\nCREATE COLLATION name (provider = icu, locale = '…', deterministic = false);",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'ada'), (2, 'Ben'), (3, 'Ada'), (4, 'Zoe');

SELECT name FROM kunden ORDER BY name COLLATE "C";   -- Großbuchstaben zuerst
-- name
-- Ada
-- Ben
-- Zoe
-- ada

-- Schreibweisenunabhängig vergleichen: ICU-Collation, nicht deterministisch
CREATE COLLATION ci (provider = icu, locale = 'und-u-ks-level2', deterministic = false);
SELECT COUNT(*) AS treffer FROM kunden WHERE name = 'ADA' COLLATE ci;
-- treffer
-- 2
`),
        note: "Standard ist die Collation der Datenbank (oft `en_US.utf8`), Vergleiche sind dann schreibweisenabhängig. ICU-Collations heißen z. B. `\"de-x-icu\"`.",
        mdn: PG + 'collation.html'
      },
      mysql: {
        syntax: "spalte VARCHAR(50) COLLATE utf8mb4_0900_ai_ci   -- ai = akzent-, ci = schreibweisenunabhängig\nausdruck COLLATE utf8mb4_bin",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'ada'), (2, 'Ben'), (3, 'Ada'), (4, 'Zoe');

SELECT name FROM kunden ORDER BY name COLLATE utf8mb4_bin;   -- Großbuchstaben zuerst
-- name
-- Ada
-- Ben
-- Zoe
-- ada

-- Standard-Collation utf8mb4_0900_ai_ci: ohne Rücksicht auf Groß/Klein
SELECT COUNT(*) AS treffer FROM kunden WHERE name = 'ADA';
-- treffer
-- 2
`),
        note: "Die Standard-Collation `utf8mb4_0900_ai_ci` ist schreibweisen- und akzentunabhängig; `_cs` = case-sensitive, `_bin` = binär.",
        mdn: MY + 'charset-general.html'
      },
      mssql: {
        syntax: "spalte VARCHAR(50) COLLATE Latin1_General_CI_AS   -- CI = case-insensitive, AS = accent-sensitive\nausdruck COLLATE Latin1_General_BIN",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'ada'), (2, 'Ben'), (3, 'Ada'), (4, 'Zoe');

SELECT name FROM kunden ORDER BY name COLLATE Latin1_General_BIN;   -- Großbuchstaben zuerst
-- name
-- Ada
-- Ben
-- Zoe
-- ada

-- Standard-Collation (…_CI_AS): ohne Rücksicht auf Groß/Klein
SELECT COUNT(*) AS treffer FROM kunden WHERE name = 'ADA';
-- treffer
-- 2
`),
        note: "Standard ist meist `SQL_Latin1_General_CP1_CI_AS`; die Collation legt bei `VARCHAR` auch die Codepage fest.",
        mdn: MST + 'statements/collations'
      },
      sqlite: {
        syntax: "spalte TEXT COLLATE NOCASE      -- BINARY (Standard), NOCASE, RTRIM\nausdruck COLLATE NOCASE",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'ada'), (2, 'Ben'), (3, 'Ada'), (4, 'Zoe');

SELECT name FROM kunden ORDER BY name;   -- BINARY: Großbuchstaben zuerst
-- name
-- Ada
-- Ben
-- Zoe
-- ada

SELECT name FROM kunden ORDER BY name COLLATE NOCASE, id;
-- name
-- ada
-- Ada
-- Ben
-- Zoe

SELECT COUNT(*) AS treffer FROM kunden WHERE name = 'ADA' COLLATE NOCASE;
-- treffer
-- 2
`),
        note: "Nur `BINARY` (Standard), `NOCASE` (nur ASCII) und `RTRIM`; eigene Collations muss die Anwendung registrieren.",
        mdn: SL + 'datatype3.html#collation'
      }
    }
  },

  // ---------------- Zahlen-Funktionen ----------------
  {
    lang: 'sql', group: 'Zahlen-Funktionen', name: 'ROUND()',
    desc: "Rundet eine Zahl auf eine bestimmte Anzahl Nachkommastellen.",
    details: "`ROUND(x, n)` rundet auf `n` Stellen, ohne `n` auf eine ganze Zahl. Bei exakten Typen (`DECIMAL`) wird ,5 von null weg gerundet: 2.5 → 3, -2.5 → -3. Negative `n` runden in den meisten Dialekten auf Zehner, Hunderter usw. Bei Gleitkommazahlen können Darstellungsfehler das Ergebnis verschieben.",
    tip: "Geldbeträge erst am Ende einer Rechnung runden, nicht jeden Zwischenschritt – sonst summieren sich Rundungsdifferenzen.",
    keywords: ['runden', 'round', 'nachkommastellen', 'dezimalstellen', 'kaufmännisch runden', 'aufrunden', 'abrunden'],
    related: ['CEIL() / FLOOR()', 'TRUNC()', 'Rundungsfehler bei Gleitkomma', 'NUMERIC / DECIMAL'],
    mdn: PG + 'functions-math.html',
    dialects: {
      std: {
        syntax: "ROUND(zahl [, stellen])",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,3));
INSERT INTO produkte VALUES (1, 'Maus', 19.989), (2, 'Kabel', 4.5), (3, 'Monitor', 199.5), (4, 'Rabatt', -2.5);

SELECT name, preis, ROUND(preis, 2) AS zwei_stellen, ROUND(preis) AS ganz
FROM produkte
ORDER BY id;
-- name    | preis   | zwei_stellen | ganz
-- Maus    | 19.989  | 19.990       | 20
-- Kabel   | 4.500   | 4.500        | 5
-- Monitor | 199.500 | 199.500      | 200
-- Rabatt  | -2.500  | -2.500       | -3
`),
        note: "`ROUND` gehört nicht zum ISO-Kern, ist aber in allen großen Datenbanken vorhanden."
      },
      pg: { note: "`ROUND(x, n)` gibt es nur für `NUMERIC`; `DOUBLE PRECISION` rundet ,5 zur geraden Zahl (`ROUND(2.5::float8)` = 2). Negative `n` erlaubt." },
      mysql: { note: "Negative `n` erlaubt: `ROUND(1234.5, -2)` = 1200.", mdn: MY + 'mathematical-functions.html#function_round' },
      mssql: {
        syntax: "ROUND(zahl, stellen [, abschneiden])   -- stellen ist Pflicht",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,3));
INSERT INTO produkte VALUES (1, 'Maus', 19.989), (2, 'Kabel', 4.5), (3, 'Monitor', 199.5), (4, 'Rabatt', -2.5);

SELECT name, preis, ROUND(preis, 2) AS zwei_stellen, ROUND(preis, 0) AS ganz,
       ROUND(preis, 2, 1) AS abgeschnitten
FROM produkte
ORDER BY id;
-- name    | preis   | zwei_stellen | ganz     | abgeschnitten
-- Maus    | 19.989  | 19.990       | 20.000   | 19.980
-- Kabel   | 4.500   | 4.500        | 5.000    | 4.500
-- Monitor | 199.500 | 199.500      | 200.000  | 199.500
-- Rabatt  | -2.500  | -2.500       | -3.000   | -2.500
`),
        note: "Das zweite Argument ist Pflicht; ein drittes Argument ungleich 0 schneidet ab statt zu runden. Der Typ bleibt erhalten (`20.000`).",
        mdn: MS + 'round-transact-sql'
      },
      sqlite: { note: "Das Ergebnis ist immer `REAL` (`20.0`); negative `n` werden wie 0 behandelt.", mdn: SL + 'lang_corefunc.html#round' }
    }
  },
  {
    lang: 'sql', group: 'Zahlen-Funktionen', name: 'ABS()',
    desc: "Absolutwert einer Zahl: das Vorzeichen fällt weg.",
    details: "`ABS(x)` ist Standard-SQL und überall vorhanden. Typische Anwendung sind Abweichungen, bei denen nur die Größe zählt, etwa zwischen Soll und Ist. `ABS(NULL)` ist `NULL`. Beim kleinsten Wert eines Ganzzahltyps gibt es einen Überlauffehler, weil der positive Wert nicht darstellbar ist.",
    tip: "„Ungefähr gleich“ bei Gleitkommazahlen prüft man mit `ABS(a - b) < 0.0001` statt mit `a = b`.",
    keywords: ['betrag', 'absolutwert', 'abs', 'absolute value', 'vorzeichen entfernen', 'abweichung'],
    related: ['SIGN()', 'Arithmetische Operatoren', 'Rundungsfehler bei Gleitkomma'],
    mdn: PG + 'functions-math.html',
    dialects: {
      std: {
        syntax: "ABS(zahl)",
        example: e(`
CREATE TABLE lager (artikel VARCHAR(20), soll INT, ist INT);
INSERT INTO lager VALUES ('Maus', 50, 47), ('Kabel', 20, 26), ('Monitor', 10, 10);

SELECT artikel, ist - soll AS differenz, ABS(ist - soll) AS abweichung
FROM lager
ORDER BY abweichung DESC, artikel;
-- artikel | differenz | abweichung
-- Kabel   | 6         | 6
-- Maus    | -3        | 3
-- Monitor | 0         | 0
`)
      }
    }
  },
  {
    lang: 'sql', group: 'Zahlen-Funktionen', name: 'CEIL() / FLOOR()',
    desc: "Rundet immer auf (CEIL) bzw. immer ab (FLOOR) zur nächsten ganzen Zahl.",
    details: "`CEIL` bzw. `CEILING` liefert die kleinste ganze Zahl ≥ x, `FLOOR` die größte ≤ x. Bei negativen Zahlen heißt „ab“ weg von null: `FLOOR(-2.7)` ist -3. Standard-SQL kennt beide Schreibweisen `CEIL` und `CEILING`; `CEILING` funktioniert in allen hier gezeigten Dialekten.",
    tip: "Für Seitenzahlen bei Paginierung: `CEILING(anzahl * 1.0 / pro_seite)` – ohne `1.0` rechnet die Ganzzahldivision vorher schon ab.",
    keywords: ['aufrunden', 'abrunden', 'ceil', 'ceiling', 'floor', 'obergrenze', 'untergrenze', 'ganze zahl'],
    related: ['ROUND()', 'TRUNC()', 'Ganzzahldivision'],
    mdn: PG + 'functions-math.html',
    dialects: {
      std: {
        syntax: "CEILING(zahl)   -- auch CEIL(zahl)\nFLOOR(zahl)",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, stueck INT);
INSERT INTO bestellungen VALUES (1, 12), (2, 13), (3, 5);

-- Kartons à 6 Stück
SELECT id, stueck,
       CEILING(stueck / 6.0) AS kartons_noetig,
       FLOOR(stueck / 6.0)   AS volle_kartons
FROM bestellungen
ORDER BY id;
-- id | stueck | kartons_noetig | volle_kartons
-- 1  | 12     | 2              | 2
-- 2  | 13     | 3              | 2
-- 3  | 5      | 1              | 0
`)
      },
      mssql: { note: "Nur `CEILING`, kein `CEIL`.", mdn: MS + 'ceiling-transact-sql' },
      sqlite: { note: "Seit 3.35 als Mathe-Funktionen (sofern einkompiliert); bei Dezimalwerten ist das Ergebnis `REAL` (`2.0`).", mdn: SL + 'lang_mathfunc.html#ceil' }
    }
  },
  {
    lang: 'sql', group: 'Zahlen-Funktionen', name: 'MOD() / %',
    desc: "Rest einer ganzzahligen Division (Modulo).",
    details: "`MOD(a, b)` (Standard) bzw. der Operator `a % b` liefert den Rest von `a / b`. Das Vorzeichen folgt dem Dividenden: `MOD(-7, 3)` ist -1, nicht 2. Typische Einsätze: gerade/ungerade, jede n-te Zeile, Verteilen auf Gruppen.",
    tip: "Für Stichproben („jede zehnte Zeile“) ist `MOD(id, 10) = 0` schnell, aber nicht zufällig, wenn IDs Lücken oder Muster haben.",
    keywords: ['modulo', 'rest', 'mod', 'prozent', 'gerade ungerade', 'remainder', 'teilbar'],
    related: ['Ganzzahldivision', 'Arithmetische Operatoren', 'NTILE()'],
    mdn: PG + 'functions-math.html',
    dialects: {
      std: {
        syntax: "MOD(a, b)",
        example: e(`
SELECT MOD(17, 5) AS rest, MOD(-7, 3) AS negativ;
-- rest | negativ
-- 2    | -1

CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO mitarbeiter VALUES (1, 'Ada'), (2, 'Lin'), (3, 'Max'), (4, 'Eva'), (5, 'Tom');

-- Auf zwei Teams verteilen
SELECT name, MOD(id, 2) AS team FROM mitarbeiter ORDER BY team, id;
-- name | team
-- Lin  | 0
-- Eva  | 0
-- Ada  | 1
-- Max  | 1
-- Tom  | 1
`)
      },
      pg: { note: "Zusätzlich der Operator `a % b`." },
      mysql: { note: "Zusätzlich `a % b` und `a MOD b`.", mdn: MY + 'mathematical-functions.html#function_mod' },
      mssql: {
        syntax: "a % b",
        example: e(`
SELECT 17 % 5 AS rest, -7 % 3 AS negativ;
-- rest | negativ
-- 2    | -1

CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO mitarbeiter VALUES (1, 'Ada'), (2, 'Lin'), (3, 'Max'), (4, 'Eva'), (5, 'Tom');

-- Auf zwei Teams verteilen
SELECT name, id % 2 AS team FROM mitarbeiter ORDER BY team, id;
-- name | team
-- Lin  | 0
-- Eva  | 0
-- Ada  | 1
-- Max  | 1
-- Tom  | 1
`),
        note: "Keine Funktion `MOD`, nur der Operator `%`.",
        mdn: MST + 'language-elements/modulo-transact-sql'
      },
      sqlite: { note: "`MOD` ist eine Mathe-Funktion (seit 3.35) und liefert `REAL` (`2.0`); der Operator `%` rechnet ganzzahlig.", mdn: SL + 'lang_mathfunc.html#mod' }
    }
  },
  {
    lang: 'sql', group: 'Zahlen-Funktionen', name: 'Ganzzahldivision',
    desc: "Teilt man zwei Ganzzahlen, schneiden die meisten Datenbanken die Nachkommastellen ab.",
    details: "Sind beide Operanden ganzzahlig, ergibt `7 / 2` in den meisten Datenbanken 3. Abhilfe: einen Operanden zur Dezimalzahl machen, etwa `7 * 1.0 / 2`, `7 / 2.0` oder `CAST(7 AS DECIMAL(10,2)) / 2`. Besonders tückisch bei Prozentrechnungen wie `aktiv / gesamt * 100`.",
    tip: "Die `100.0` an den Anfang stellen (`100.0 * aktiv / gesamt`): Die Auswertung läuft von links, so wird schon die erste Operation dezimal.",
    keywords: ['ganzzahldivision', 'integer division', 'division', 'teilen', 'nachkommastellen fehlen', 'div', 'prozent berechnen'],
    related: ['MOD() / %', 'Division durch null vermeiden', 'CAST()', 'Arithmetische Operatoren'],
    mdn: PG + 'functions-math.html',
    dialects: {
      std: {
        syntax: "ganzzahl / ganzzahl          -- Ergebnis abgeschnitten\nganzzahl * 1.0 / ganzzahl    -- Dezimalergebnis",
        example: e(`
SELECT 7 / 2 AS ganz, 7 / 2.0 AS dezimal, 7 * 1.0 / 2 AS mal_eins, CAST(7 AS DECIMAL(10,2)) / 2 AS mit_cast;
-- ganz | dezimal | mal_eins | mit_cast
-- 3    | 3.5     | 3.5      | 3.5

CREATE TABLE abteilungen (name VARCHAR(20), gesamt INT, aktiv INT);
INSERT INTO abteilungen VALUES ('IT', 8, 6), ('HR', 3, 1);

SELECT name,
       aktiv / gesamt * 100             AS falsch,
       ROUND(100.0 * aktiv / gesamt, 1) AS prozent
FROM abteilungen
ORDER BY name;
-- name | falsch | prozent
-- HR   | 0      | 33.3
-- IT   | 0      | 75.0
`)
      },
      mysql: {
        syntax: "a / b      -- immer dezimal\na DIV b    -- Ganzzahldivision",
        example: e(`
SELECT 7 / 2 AS dezimal, 7 DIV 2 AS ganz;
-- dezimal | ganz
-- 3.5000  | 3

CREATE TABLE abteilungen (name VARCHAR(20), gesamt INT, aktiv INT);
INSERT INTO abteilungen VALUES ('IT', 8, 6), ('HR', 3, 1);

SELECT name,
       aktiv DIV gesamt * 100     AS falsch,
       ROUND(aktiv / gesamt * 100, 1) AS prozent
FROM abteilungen
ORDER BY name;
-- name | falsch | prozent
-- HR   | 0      | 33.3
-- IT   | 0      | 75.0
`),
        note: "`/` rechnet immer dezimal (`7 / 2` = 3.5000); ganzzahlig teilt der Operator `DIV`.",
        mdn: MY + 'arithmetic-functions.html#operator_div'
      },
      sqlite: {
        example: e(`
SELECT 7 / 2 AS ganz, 7 / 2.0 AS dezimal, 7 * 1.0 / 2 AS mal_eins, CAST(7 AS REAL) / 2 AS mit_cast;
-- ganz | dezimal | mal_eins | mit_cast
-- 3    | 3.5     | 3.5      | 3.5

CREATE TABLE abteilungen (name VARCHAR(20), gesamt INT, aktiv INT);
INSERT INTO abteilungen VALUES ('IT', 8, 6), ('HR', 3, 1);

SELECT name,
       aktiv / gesamt * 100             AS falsch,
       ROUND(100.0 * aktiv / gesamt, 1) AS prozent
FROM abteilungen
ORDER BY name;
-- name | falsch | prozent
-- HR   | 0      | 33.3
-- IT   | 0      | 75.0
`),
        note: "`CAST(7 AS DECIMAL(10,2))` bleibt in SQLite die Ganzzahl 7 – für Dezimalergebnisse nach `REAL` umwandeln oder mit `1.0` multiplizieren."
      }
    }
  },
  {
    lang: 'sql', group: 'Zahlen-Funktionen', name: 'POWER() / SQRT()',
    desc: "Potenz und Quadratwurzel einer Zahl.",
    details: "`POWER(basis, exponent)` und `SQRT(x)` sind Standard-SQL und in allen großen Datenbanken vorhanden. Der Ergebnistyp unterscheidet sich: meist eine Gleitkommazahl, teils der Typ der Basis. `EXP`, `LN`, `LOG` und `PI()` ergänzen die Sammlung. Die Wurzel einer negativen Zahl ist ein Fehler bzw. `NULL`.",
    tip: "`POWER(x, 2)` ist lesbarer als `x * x`, aber für Ganzzahlen liefert `x * x` ein exaktes Ergebnis statt einer Gleitkommazahl.",
    keywords: ['potenz', 'hoch', 'quadrat', 'wurzel', 'quadratwurzel', 'power', 'pow', 'sqrt', 'exponent', 'zinseszins'],
    related: ['ROUND()', 'ABS()', 'Arithmetische Operatoren'],
    mdn: PG + 'functions-math.html',
    dialects: {
      std: {
        syntax: "POWER(basis, exponent)\nSQRT(zahl)",
        example: e(`
CREATE TABLE punkte (name VARCHAR(5), x DECIMAL(10,2), y DECIMAL(10,2));
INSERT INTO punkte VALUES ('A', 3, 4), ('B', 6, 8), ('C', 1, 1);

-- Abstand zum Ursprung
SELECT name, ROUND(SQRT(POWER(x, 2) + POWER(y, 2)), 3) AS abstand
FROM punkte
ORDER BY name;
-- name | abstand
-- A    | 5.000
-- B    | 10.000
-- C    | 1.414

-- Zinseszins: 1000 € bei 5 % über 3 Jahre
SELECT ROUND(1000 * POWER(1.05, 3), 2) AS kapital;
-- kapital
-- 1157.63
`)
      },
      pg: { note: "Zusätzlich `POW` sowie die Operatoren `^` (Potenz) und `|/` (Quadratwurzel)." },
      mysql: { note: "Zusätzlich `POW`; das Ergebnis ist immer `DOUBLE`.", mdn: MY + 'mathematical-functions.html#function_power' },
      mssql: {
        example: e(`
CREATE TABLE punkte (name VARCHAR(5), x DECIMAL(10,2), y DECIMAL(10,2));
INSERT INTO punkte VALUES ('A', 3, 4), ('B', 6, 8), ('C', 1, 1);

-- Abstand zum Ursprung
SELECT name, ROUND(SQRT(POWER(x, 2) + POWER(y, 2)), 3) AS abstand
FROM punkte
ORDER BY name;
-- name | abstand
-- A    | 5.0
-- B    | 10.0
-- C    | 1.414

-- POWER behält den Typ der Basis: 1.05 hat nur 2 Nachkommastellen
SELECT ROUND(1000 * POWER(1.05, 3), 2)                  AS falsch,
       ROUND(1000 * POWER(CAST(1.05 AS FLOAT), 3), 2)   AS richtig;
-- falsch  | richtig
-- 1160.00 | 1157.63
`),
        note: "`POWER` liefert den Typ der Basis: Bei einem Dezimal-Literal wie `1.05` wird auf dessen Nachkommastellen gerundet. Basis vorher nach `FLOAT` umwandeln.",
        mdn: MS + 'power-transact-sql'
      },
      sqlite: { note: "Mathe-Funktionen seit 3.35 (sofern einkompiliert), auch als `POW`; Ergebnis immer `REAL`.", mdn: SL + 'lang_mathfunc.html#pow' }
    }
  },
  {
    lang: 'sql', group: 'Zahlen-Funktionen', name: 'RANDOM()',
    desc: "Erzeugt eine Zufallszahl – Name und Wertebereich je Dialekt verschieden.",
    details: "Zufallszahlen braucht man für Stichproben, Testdaten oder zum Mischen. Name, Wertebereich und Verhalten (einmal pro Abfrage oder pro Zeile) unterscheiden sich je Dialekt. Zufällige Zeilen zieht man mit „nach Zufall sortieren und die erste nehmen“ – das sortiert allerdings die ganze Tabelle.",
    tip: "Für große Tabellen ist Sortieren nach Zufall teuer; `TABLESAMPLE` (PostgreSQL, SQL Server) liefert eine schnelle Stichprobe.",
    keywords: ['zufall', 'zufallszahl', 'random', 'rand', 'newid', 'stichprobe', 'zufällige zeile', 'shuffle'],
    related: ['ORDER BY', 'LIMIT / OFFSET', 'MOD() / %'],
    mdn: PG + 'functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE',
    dialects: {
      std: { none: "Keine Zufallsfunktion im ISO-Standard." },
      pg: {
        syntax: "RANDOM()             -- 0 <= x < 1\nRANDOM(min, max)     -- Ganzzahl im Bereich (seit 17)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber'), (4, 'Koch');

-- Gewinner ziehen
SELECT name FROM kunden ORDER BY RANDOM() LIMIT 1;
-- z. B. Weber

-- Würfeln: 1 bis 6
SELECT RANDOM(1, 6) AS wuerfel, FLOOR(RANDOM() * 6 + 1) AS wuerfel_alt;
-- z. B. 4 und 2
`),
        note: "`SETSEED(0.5)` macht die Folge wiederholbar. `RANDOM(min, max)` gibt es seit PostgreSQL 17."
      },
      mysql: {
        syntax: "RAND()        -- 0 <= x < 1\nRAND(seed)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber'), (4, 'Koch');

-- Gewinner ziehen
SELECT name FROM kunden ORDER BY RAND() LIMIT 1;
-- z. B. Weber

-- Würfeln: 1 bis 6
SELECT FLOOR(1 + RAND() * 6) AS wuerfel;
-- z. B. 4
`),
        note: "Heißt `RAND()`; mit Startwert `RAND(42)` wiederholbar.",
        mdn: MY + 'mathematical-functions.html#function_rand'
      },
      mssql: {
        syntax: "RAND()      -- einmal pro Abfrage!\nNEWID()     -- neue GUID pro Zeile",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber'), (4, 'Koch');

-- Gewinner ziehen: NEWID() ist pro Zeile verschieden
SELECT TOP 1 name FROM kunden ORDER BY NEWID();
-- z. B. Weber

-- Würfeln: 1 bis 6
SELECT FLOOR(1 + RAND() * 6) AS wuerfel, ABS(CHECKSUM(NEWID())) % 6 + 1 AS pro_zeile;
-- z. B. 4 und 2
`),
        note: "`RAND()` wird pro Abfrage nur einmal ausgewertet – alle Zeilen bekommen denselben Wert. Für Zufall pro Zeile `NEWID()`.",
        mdn: MS + 'rand-transact-sql'
      },
      sqlite: {
        syntax: "RANDOM()       -- zufällige 64-Bit-Ganzzahl\nABS(RANDOM()) % n   -- 0 bis n-1",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber'), (4, 'Koch');

-- Gewinner ziehen
SELECT name FROM kunden ORDER BY RANDOM() LIMIT 1;
-- z. B. Weber

-- Würfeln: 1 bis 6
SELECT ABS(RANDOM()) % 6 + 1 AS wuerfel;
-- z. B. 4
`),
        note: "`RANDOM()` liefert eine Ganzzahl zwischen -9223372036854775808 und +9223372036854775807, keinen Wert zwischen 0 und 1.",
        mdn: SL + 'lang_corefunc.html#random'
      }
    }
  },
  {
    lang: 'sql', group: 'Zahlen-Funktionen', name: 'SIGN()',
    desc: "Vorzeichen einer Zahl: -1, 0 oder 1.",
    details: "`SIGN(x)` liefert -1 für negative, 0 für null und 1 für positive Zahlen, bei `NULL` ebenfalls `NULL`. Praktisch, um Buchungen in Ein- und Ausgänge zu sortieren, ohne mehrere Vergleiche zu schreiben.",
    tip: "`SUM(CASE WHEN betrag > 0 THEN betrag ELSE 0 END)` ist für Teilsummen lesbarer als Tricks mit `SIGN`.",
    keywords: ['vorzeichen', 'sign', 'signum', 'positiv', 'negativ', 'plus minus'],
    related: ['ABS()', 'Einfaches CASE'],
    mdn: PG + 'functions-math.html',
    dialects: {
      std: {
        syntax: "SIGN(zahl)",
        example: e(`
CREATE TABLE buchungen (id INT PRIMARY KEY, betrag INT);
INSERT INTO buchungen VALUES (1, 250), (2, -80), (3, 0), (4, -15);

SELECT id, betrag, SIGN(betrag) AS vorzeichen,
       CASE SIGN(betrag) WHEN 1 THEN 'Eingang' WHEN -1 THEN 'Ausgang' ELSE 'neutral' END AS art
FROM buchungen
ORDER BY id;
-- id | betrag | vorzeichen | art
-- 1  | 250    | 1          | Eingang
-- 2  | -80    | -1         | Ausgang
-- 3  | 0      | 0          | neutral
-- 4  | -15    | -1         | Ausgang
`),
        note: "`SIGN` gehört nicht zum ISO-Kern, ist aber in allen großen Datenbanken vorhanden."
      },
      sqlite: { note: "Seit SQLite 3.35.", mdn: SL + 'lang_corefunc.html#sign' }
    }
  },
  {
    lang: 'sql', group: 'Zahlen-Funktionen', name: 'TRUNC()',
    desc: "Schneidet Nachkommastellen ab, ohne zu runden (Richtung null).",
    details: "Abschneiden entfernt die Nachkommastellen: aus 2.7 wird 2, aus -2.7 wird -2 – anders als `FLOOR`, das -3 liefert, und `ROUND`, das 3 bzw. -3 liefert. Name und Argumente unterscheiden sich je Dialekt, teils lässt sich die Zahl der verbleibenden Stellen angeben.",
    tip: "Nicht mit der Anweisung `TRUNCATE TABLE` verwechseln, die alle Zeilen einer Tabelle löscht.",
    keywords: ['abschneiden', 'trunc', 'truncate', 'nachkommastellen entfernen', 'ganzzahlanteil', 'ohne runden'],
    related: ['ROUND()', 'CEIL() / FLOOR()', 'DATE_TRUNC()'],
    mdn: PG + 'functions-math.html',
    dialects: {
      std: { none: "Keine Funktion zum Abschneiden im ISO-Standard; `CAST(x AS INTEGER)` rundet je nach Datenbank oder schneidet ab." },
      pg: {
        syntax: "TRUNC(zahl [, stellen])",
        example: e(`
CREATE TABLE werte (x DECIMAL(5,2));
INSERT INTO werte VALUES (2.70), (2.25), (-2.70);

SELECT x, TRUNC(x) AS trunc, FLOOR(x) AS floor, ROUND(x) AS round, TRUNC(x, 1) AS eine_stelle
FROM werte
ORDER BY x DESC;
-- x     | trunc | floor | round | eine_stelle
-- 2.70  | 2     | 2     | 3     | 2.7
-- 2.25  | 2     | 2     | 2     | 2.2
-- -2.70 | -2    | -3    | -3    | -2.7
`)
      },
      mysql: {
        syntax: "TRUNCATE(zahl, stellen)   -- stellen ist Pflicht",
        example: e(`
CREATE TABLE werte (x DECIMAL(5,2));
INSERT INTO werte VALUES (2.70), (2.25), (-2.70);

SELECT x, TRUNCATE(x, 0) AS trunc, FLOOR(x) AS floor, ROUND(x) AS round, TRUNCATE(x, 1) AS eine_stelle
FROM werte
ORDER BY x DESC;
-- x     | trunc | floor | round | eine_stelle
-- 2.70  | 2     | 2     | 3     | 2.7
-- 2.25  | 2     | 2     | 2     | 2.2
-- -2.70 | -2    | -3    | -3    | -2.7
`),
        note: "Heißt `TRUNCATE(x, n)`; die Stellenzahl ist Pflicht.",
        mdn: MY + 'mathematical-functions.html#function_truncate'
      },
      mssql: {
        syntax: "ROUND(zahl, stellen, 1)   -- drittes Argument ≠ 0: abschneiden",
        example: e(`
CREATE TABLE werte (x DECIMAL(5,2));
INSERT INTO werte VALUES (2.70), (2.25), (-2.70);

SELECT x, ROUND(x, 0, 1) AS trunc, FLOOR(x) AS floor, ROUND(x, 0) AS round, ROUND(x, 1, 1) AS eine_stelle
FROM werte
ORDER BY x DESC;
-- x     | trunc | floor | round | eine_stelle
-- 2.70  | 2.00  | 2     | 3.00  | 2.70
-- 2.25  | 2.00  | 2     | 2.00  | 2.20
-- -2.70 | -2.00 | -3    | -3.00 | -2.70
`),
        note: "Kein `TRUNC`; `ROUND` mit drittem Argument schneidet ab.",
        mdn: MS + 'round-transact-sql'
      },
      sqlite: {
        syntax: "TRUNC(zahl)   -- ohne Stellenzahl",
        example: e(`
CREATE TABLE werte (x DECIMAL(5,2));
INSERT INTO werte VALUES (2.70), (2.25), (-2.70);

SELECT x, TRUNC(x) AS trunc, FLOOR(x) AS floor, ROUND(x) AS round, TRUNC(x * 10) / 10 AS eine_stelle
FROM werte
ORDER BY x DESC;
-- x    | trunc | floor | round | eine_stelle
-- 2.7  | 2.0   | 2.0   | 3.0   | 2.7
-- 2.25 | 2.0   | 2.0   | 2.0   | 2.2
-- -2.7 | -2.0  | -3.0  | -3.0  | -2.7
`),
        note: "`TRUNC(x)` seit 3.35 (Mathe-Funktionen), ohne Stellenzahl – dafür vorher mit 10, 100 … multiplizieren.",
        mdn: SL + 'lang_mathfunc.html#trunc'
      }
    }
  },
  {
    lang: 'sql', group: 'Zahlen-Funktionen', name: 'Rundungsfehler bei Gleitkomma',
    desc: "REAL/DOUBLE speichern Dezimalbrüche nur näherungsweise – 0.1 + 0.2 ≠ 0.3.",
    details: "Gleitkommatypen (`REAL`, `FLOAT`, `DOUBLE PRECISION`) arbeiten binär und können Werte wie 0.1 nicht exakt darstellen. Summen und Vergleiche mit `=` liefern deshalb überraschende Ergebnisse. Für Geld und alles, was exakt sein muss, `DECIMAL`/`NUMERIC` verwenden oder in Cent als Ganzzahl speichern.",
    tip: "Gleitkommawerte nie mit `=` vergleichen, sondern mit einer Toleranz: `ABS(a - b) < 0.000001`.",
    keywords: ['gleitkomma', 'floating point', 'rundungsfehler', 'float', 'double', 'real', 'genauigkeit', 'geldbetrag', 'präzision'],
    related: ['NUMERIC / DECIMAL', 'REAL / DOUBLE PRECISION', 'ROUND()', 'ABS()'],
    mdn: PG + 'datatype-numeric.html',
    dialects: {
      std: {
        example: e(`
-- Dezimal-Literale rechnen exakt, Gleitkomma nicht
SELECT 0.1 + 0.2 AS dezimal,
       CAST(0.1 AS DOUBLE PRECISION) + CAST(0.2 AS DOUBLE PRECISION) AS gleitkomma;
-- dezimal | gleitkomma
-- 0.3     | 0.30000000000000004

CREATE TABLE preise (id INT PRIMARY KEY, netto_float DOUBLE PRECISION, netto_dec DECIMAL(10,2));
INSERT INTO preise VALUES (1, 0.1, 0.10), (2, 1.1, 1.10);

SELECT id, netto_float * 3 AS dreifach_float, netto_dec * 3 AS dreifach_dec
FROM preise
ORDER BY id;
-- id | dreifach_float      | dreifach_dec
-- 1  | 0.30000000000000004 | 0.30
-- 2  | 3.3000000000000003  | 3.30

SELECT COUNT(*) AS treffer FROM preise WHERE netto_float * 3 = 0.3;
-- treffer
-- 0
`)
      },
      mysql: {
        example: e(`
-- Dezimal-Literale rechnen exakt, Gleitkomma (1e-1 = DOUBLE) nicht
SELECT 0.1 + 0.2 AS dezimal, 1e-1 + 2e-1 AS gleitkomma;
-- dezimal | gleitkomma
-- 0.3     | 0.30000000000000004

CREATE TABLE preise (id INT PRIMARY KEY, netto_float DOUBLE, netto_dec DECIMAL(10,2));
INSERT INTO preise VALUES (1, 0.1, 0.10), (2, 1.1, 1.10);

SELECT id, netto_float * 3 AS dreifach_float, netto_dec * 3 AS dreifach_dec
FROM preise
ORDER BY id;
-- id | dreifach_float      | dreifach_dec
-- 1  | 0.30000000000000004 | 0.30
-- 2  | 3.3000000000000003  | 3.30

SELECT COUNT(*) AS treffer FROM preise WHERE netto_float * 3 = 0.3;
-- treffer
-- 0
`),
        note: "Literale mit Exponent (`1e-1`) sind `DOUBLE`, Literale mit Punkt `DECIMAL`. `FLOAT` ohne Angabe ist nur 4 Byte genau."
      },
      mssql: { note: "`DOUBLE PRECISION` ist ein Synonym für `FLOAT(53)`; `REAL` hat nur 4 Byte Genauigkeit." },
      sqlite: {
        example: e(`
-- Kein Dezimaltyp: auch Literale wie 0.1 sind Gleitkomma
SELECT 0.1 + 0.2 AS summe, 0.1 + 0.2 = 0.3 AS gleich;
-- summe               | gleich
-- 0.30000000000000004 | 0

CREATE TABLE preise (id INT PRIMARY KEY, netto REAL, netto_cent INT);
INSERT INTO preise VALUES (1, 0.1, 10), (2, 1.1, 110);

SELECT id, netto * 3 AS dreifach_real, netto_cent * 3 AS dreifach_cent
FROM preise
ORDER BY id;
-- id | dreifach_real       | dreifach_cent
-- 1  | 0.30000000000000004 | 30
-- 2  | 3.3000000000000003  | 330
`),
        note: "SQLite hat keinen echten Dezimaltyp – `DECIMAL(10,2)` speichert Gleitkommazahlen. Für Geld ganzzahlige Cent verwenden.",
        mdn: SL + 'floatingpoint.html'
      }
    }
  },

  // ---------------- Datum & Zeit ----------------
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'CURRENT_DATE / CURRENT_TIMESTAMP',
    desc: "Aktuelles Datum bzw. aktueller Zeitpunkt – ohne Klammern geschrieben.",
    details: "`CURRENT_DATE`, `CURRENT_TIME` und `CURRENT_TIMESTAMP` sind Standard-SQL und werden ohne Klammern geschrieben. Häufig dienen sie als `DEFAULT` für Anlegezeitpunkte. Ob der Wert innerhalb einer Transaktion gleich bleibt und in welcher Zeitzone er geliefert wird, hängt vom Dialekt ab.",
    tip: "Zeitpunkte in UTC speichern und erst bei der Anzeige in die lokale Zeit umrechnen – sonst gibt es bei der Zeitumstellung doppelte oder fehlende Stunden.",
    keywords: ['heute', 'jetzt', 'now', 'getdate', 'sysdatetime', 'curdate', 'aktuelles datum', 'current date', 'zeitstempel', 'today'],
    related: ['DEFAULT', 'date() / datetime() (SQLite)', 'Zeitzonen', 'TIMESTAMP'],
    mdn: PG + 'functions-datetime.html#FUNCTIONS-DATETIME-CURRENT',
    dialects: {
      std: {
        syntax: "CURRENT_DATE\nCURRENT_TIME\nCURRENT_TIMESTAMP",
        example: e(`
CREATE TABLE bestellungen (
  id       INT PRIMARY KEY,
  betrag   INT,
  erstellt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO bestellungen (id, betrag) VALUES (1, 20), (2, 35);

SELECT id, betrag, erstellt FROM bestellungen ORDER BY id;
-- erstellt enthält z. B. 2026-11-16 09:30:00

SELECT CURRENT_DATE AS heute, CURRENT_TIME AS uhrzeit, CURRENT_TIMESTAMP AS jetzt;
-- z. B. 2026-11-16, 09:30:00, 2026-11-16 09:30:00
`)
      },
      pg: { note: "`NOW()` ist dasselbe wie `CURRENT_TIMESTAMP` und liefert den Beginn der Transaktion; die echte Uhrzeit liefert `clock_timestamp()`." },
      mysql: { note: "Zusätzlich `NOW()` und `CURDATE()`. `TIMESTAMP`-Spalten speichern intern UTC.", mdn: MY + 'date-and-time-functions.html#function_now' },
      mssql: {
        syntax: "GETDATE()            -- DATETIME\nSYSDATETIME()        -- DATETIME2, genauer\nCAST(GETDATE() AS DATE)",
        example: e(`
CREATE TABLE bestellungen (
  id       INT PRIMARY KEY,
  betrag   INT,
  erstellt DATETIME2 DEFAULT SYSDATETIME()
);
INSERT INTO bestellungen (id, betrag) VALUES (1, 20), (2, 35);

SELECT id, betrag, erstellt FROM bestellungen ORDER BY id;
-- erstellt enthält z. B. 2026-11-16 09:30:00.1234567

SELECT CAST(GETDATE() AS DATE) AS heute, CURRENT_TIMESTAMP AS jetzt, SYSDATETIME() AS genau;
-- z. B. 2026-11-16, 2026-11-16 09:30:00.123
`),
        note: "`CURRENT_TIMESTAMP` gibt es (wie `GETDATE()`), `CURRENT_DATE` erst ab SQL Server 2025. Achtung: Der Typ `TIMESTAMP` ist in SQL Server kein Zeitpunkt, sondern ein Synonym für `ROWVERSION`.",
        mdn: MS + 'getdate-transact-sql'
      },
      sqlite: { note: "Liefert Text in UTC (`2026-11-16 08:30:00`); lokale Zeit mit `datetime('now', 'localtime')`.", mdn: SL + 'lang_datefunc.html' }
    }
  },
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'Datum rechnen',
    desc: "Tage, Monate oder Stunden zu einem Datum addieren oder abziehen.",
    details: "Standard-SQL addiert ein `INTERVAL` zum Datum; viele Dialekte haben dafür eigene Funktionen. Vorsicht bei Monaten: Der 31. Januar plus ein Monat ergibt je nach Datenbank den 28. Februar oder läuft in den März über. Das Monatsende bekommt man zuverlässig über „Monatsanfang + 1 Monat − 1 Tag“ oder eine eigene Funktion.",
    tip: "Fälligkeiten immer mit Testdaten am Monatsende (31.01., 29.02.) prüfen – dort zeigen sich die Unterschiede.",
    keywords: ['datum addieren', 'tage addieren', 'dateadd', 'date_add', 'interval', 'monat addieren', 'fälligkeit', 'monatsende', 'eomonth', 'last_day'],
    related: ['INTERVAL', 'Datumsdifferenz', 'date() / datetime() (SQLite)', 'DATE_TRUNC()'],
    mdn: PG + 'functions-datetime.html',
    dialects: {
      std: {
        syntax: "datum + INTERVAL '14' DAY\ndatum - INTERVAL '1' MONTH",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, datum DATE);
INSERT INTO bestellungen VALUES (1, '2026-01-15'), (2, '2026-01-31'), (3, '2026-02-28');

SELECT id, datum,
       CAST(datum + INTERVAL '14' DAY AS DATE)  AS faellig,
       CAST(datum + INTERVAL '1' MONTH AS DATE) AS plus_monat
FROM bestellungen
ORDER BY id;
-- id | datum      | faellig    | plus_monat
-- 1  | 2026-01-15 | 2026-01-29 | 2026-02-15
-- 2  | 2026-01-31 | 2026-02-14 | 2026-02-28
-- 3  | 2026-02-28 | 2026-03-14 | 2026-03-28
`)
      },
      pg: { note: "`DATE + INTERVAL` ergibt einen `TIMESTAMP`, daher das `CAST`; `datum + 14` addiert Tage direkt. Monatsende: `DATE_TRUNC('month', d) + INTERVAL '1 month - 1 day'`." },
      mysql: { note: "Auch `DATE_ADD(datum, INTERVAL 14 DAY)`; das Monatsende liefert `LAST_DAY(datum)`.", mdn: MY + 'date-and-time-functions.html#function_date-add' },
      mssql: {
        syntax: "DATEADD(einheit, anzahl, datum)\nEOMONTH(datum [, monate])",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, datum DATE);
INSERT INTO bestellungen VALUES (1, '2026-01-15'), (2, '2026-01-31'), (3, '2026-02-28');

SELECT id, datum,
       DATEADD(day, 14, datum)  AS faellig,
       DATEADD(month, 1, datum) AS plus_monat,
       EOMONTH(datum)           AS monatsende
FROM bestellungen
ORDER BY id;
-- id | datum      | faellig    | plus_monat | monatsende
-- 1  | 2026-01-15 | 2026-01-29 | 2026-02-15 | 2026-01-31
-- 2  | 2026-01-31 | 2026-02-14 | 2026-02-28 | 2026-01-31
-- 3  | 2026-02-28 | 2026-03-14 | 2026-03-28 | 2026-02-28
`),
        note: "Kein `INTERVAL`; `DATEADD` mit Einheiten wie `day`, `month`, `hour`. `EOMONTH` liefert das Monatsende.",
        mdn: MS + 'dateadd-transact-sql'
      },
      sqlite: {
        syntax: "date(datum, '+14 days')\ndate(datum, 'start of month', '+1 month', '-1 day')",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, datum DATE);
INSERT INTO bestellungen VALUES (1, '2026-01-15'), (2, '2026-01-31'), (3, '2026-02-28');

-- Achtung bei id 2: 31. Januar + 1 Monat läuft in den März über
SELECT id, datum,
       date(datum, '+14 days')                             AS faellig,
       date(datum, '+1 month')                             AS plus_monat,
       date(datum, 'start of month', '+1 month', '-1 day') AS monatsende
FROM bestellungen
ORDER BY id;
-- id | datum      | faellig    | plus_monat | monatsende
-- 1  | 2026-01-15 | 2026-01-29 | 2026-02-15 | 2026-01-31
-- 2  | 2026-01-31 | 2026-02-14 | 2026-03-03 | 2026-01-31
-- 3  | 2026-02-28 | 2026-03-14 | 2026-03-28 | 2026-02-28
`),
        note: "Kein `INTERVAL`; gerechnet wird mit Modifikatoren in `date()`. Seit 3.46 verhindert `'floor'` den Monatsüberlauf: `date('2026-01-31', '+1 month', 'floor')` ergibt den 28. Februar.",
        mdn: SL + 'lang_datefunc.html#modifiers'
      }
    }
  },
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'Datumsdifferenz',
    desc: "Abstand zwischen zwei Daten in Tagen, Stunden oder Jahren.",
    details: "Die Differenz zweier Zeitpunkte ist je nach Dialekt eine Zahl von Tagen, ein Intervall oder das Ergebnis einer Funktion mit Einheit. Vorsicht bei Jahren und Monaten: Manche Funktionen zählen volle Einheiten, andere nur überschrittene Grenzen – vom 31.12. zum 01.01. ist dann schon „ein Jahr“ vergangen.",
    tip: "Im echten Code statt eines festen Datums `CURRENT_DATE` verwenden; hier steht ein festes Datum, damit das Ergebnis reproduzierbar ist.",
    keywords: ['datediff', 'differenz', 'tage zwischen', 'dauer', 'age', 'alter berechnen', 'julianday', 'zeitspanne', 'timestampdiff'],
    related: ['Datum rechnen', 'INTERVAL', 'EXTRACT()', 'date() / datetime() (SQLite)'],
    mdn: PG + 'functions-datetime.html',
    dialects: {
      std: { none: "Standard-SQL subtrahiert Zeitpunkte zu einem Intervall: `(ende - start) DAY`; die Dialekte setzen das unterschiedlich um – siehe die Tabs." },
      pg: {
        syntax: "ende - start              -- DATE: Tage als Zahl, TIMESTAMP: INTERVAL\nAGE(ende, start)          -- Jahre, Monate, Tage\nEXTRACT(EPOCH FROM ende - start)   -- Sekunden",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), eingestellt DATE);
INSERT INTO mitarbeiter VALUES (1, 'Ada', '2019-03-01'), (2, 'Lin', '2021-07-15'), (3, 'Eva', '2026-10-01');

SELECT name,
       DATE '2026-11-16' - eingestellt                          AS tage,
       EXTRACT(YEAR FROM AGE(DATE '2026-11-16', eingestellt))   AS jahre
FROM mitarbeiter
ORDER BY id;
-- name | tage | jahre
-- Ada  | 2817 | 7
-- Lin  | 1950 | 5
-- Eva  | 46   | 0

-- Minuten zwischen zwei Zeitpunkten
SELECT EXTRACT(EPOCH FROM TIMESTAMP '2026-11-16 17:30' - TIMESTAMP '2026-11-16 08:15') / 60 AS minuten;
-- minuten
-- 555
`),
        note: "`AGE` zählt volle Jahre, Monate und Tage – passend für Altersberechnungen."
      },
      mysql: {
        syntax: "DATEDIFF(ende, start)                  -- Tage\nTIMESTAMPDIFF(einheit, start, ende)    -- volle Einheiten",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), eingestellt DATE);
INSERT INTO mitarbeiter VALUES (1, 'Ada', '2019-03-01'), (2, 'Lin', '2021-07-15'), (3, 'Eva', '2026-10-01');

SELECT name,
       DATEDIFF('2026-11-16', eingestellt)              AS tage,
       TIMESTAMPDIFF(YEAR, eingestellt, '2026-11-16')   AS jahre
FROM mitarbeiter
ORDER BY id;
-- name | tage | jahre
-- Ada  | 2817 | 7
-- Lin  | 1950 | 5
-- Eva  | 46   | 0

-- Minuten zwischen zwei Zeitpunkten
SELECT TIMESTAMPDIFF(MINUTE, '2026-11-16 08:15', '2026-11-16 17:30') AS minuten;
-- minuten
-- 555
`),
        note: "Vorsicht: `DATEDIFF` nimmt das Ende zuerst, `TIMESTAMPDIFF` den Start. `TIMESTAMPDIFF` zählt volle Einheiten.",
        mdn: MY + 'date-and-time-functions.html#function_timestampdiff'
      },
      mssql: {
        syntax: "DATEDIFF(einheit, start, ende)   -- zählt überschrittene Grenzen",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), eingestellt DATE);
INSERT INTO mitarbeiter VALUES (1, 'Ada', '2019-03-01'), (2, 'Lin', '2021-07-15'), (3, 'Eva', '2026-10-01');

SELECT name,
       DATEDIFF(day, eingestellt, '2026-11-16') AS tage,
       DATEDIFF(year, eingestellt, '2026-11-16') AS jahreswechsel
FROM mitarbeiter
ORDER BY id;
-- name | tage | jahreswechsel
-- Ada  | 2817 | 7
-- Lin  | 1950 | 5
-- Eva  | 46   | 0

-- Grenzen statt voller Einheiten: ein Tag Abstand, aber "1 Jahr"
SELECT DATEDIFF(year, '2025-12-31', '2026-01-01') AS jahre,
       DATEDIFF(minute, '2026-11-16 08:15', '2026-11-16 17:30') AS minuten;
-- jahre | minuten
-- 1     | 555
`),
        note: "`DATEDIFF` zählt überschrittene Grenzen, nicht volle Einheiten – für das Alter in Jahren ist es ungeeignet.",
        mdn: MS + 'datediff-transact-sql'
      },
      sqlite: {
        syntax: "julianday(ende) - julianday(start)     -- Tage als Kommazahl\nunixepoch(ende) - unixepoch(start)     -- Sekunden",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), eingestellt DATE);
INSERT INTO mitarbeiter VALUES (1, 'Ada', '2019-03-01'), (2, 'Lin', '2021-07-15'), (3, 'Eva', '2026-10-01');

SELECT name,
       CAST(julianday('2026-11-16') - julianday(eingestellt) AS INTEGER)            AS tage,
       CAST((julianday('2026-11-16') - julianday(eingestellt)) / 365.25 AS INTEGER) AS jahre
FROM mitarbeiter
ORDER BY id;
-- name | tage | jahre
-- Ada  | 2817 | 7
-- Lin  | 1950 | 5
-- Eva  | 46   | 0

-- Minuten zwischen zwei Zeitpunkten
SELECT (unixepoch('2026-11-16 17:30') - unixepoch('2026-11-16 08:15')) / 60 AS minuten;
-- minuten
-- 555
`),
        note: "Keine Differenzfunktion; gerechnet wird über `julianday()` (Tage) oder `unixepoch()` (Sekunden, seit 3.38). Jahre über `/ 365.25` sind nur eine Näherung.",
        mdn: SL + 'lang_datefunc.html'
      }
    }
  },
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'EXTRACT()',
    desc: "Holt einen Bestandteil wie Jahr, Monat oder Wochentag aus einem Datum.",
    details: "`EXTRACT(feld FROM datum)` ist Standard-SQL und liefert eine Zahl. Die Standardfelder sind `YEAR`, `MONTH`, `DAY`, `HOUR`, `MINUTE`, `SECOND`; Quartal, Kalenderwoche und Wochentag sind Erweiterungen der Dialekte – mit unterschiedlicher Nummerierung der Wochentage.",
    values: [
      ['YEAR, MONTH, DAY', 'Jahr, Monat, Tag'],
      ['HOUR, MINUTE, SECOND', 'Uhrzeit-Bestandteile']
    ],
    tip: "`WHERE EXTRACT(YEAR FROM datum) = 2026` kann keinen Index nutzen; besser `WHERE datum >= '2026-01-01' AND datum < '2027-01-01'`.",
    keywords: ['extract', 'datepart', 'jahr', 'monat', 'tag', 'wochentag', 'quartal', 'kalenderwoche', 'bestandteil'],
    related: ['strftime() (SQLite)', 'DATE_TRUNC()', 'Wochentag & Monat gruppieren', 'Datumsbereich filtern'],
    mdn: PG + 'functions-datetime.html#FUNCTIONS-DATETIME-EXTRACT',
    dialects: {
      std: {
        syntax: "EXTRACT(feld FROM datum)",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, datum DATE);
INSERT INTO bestellungen VALUES (1, '2026-03-14'), (2, '2026-11-16');

SELECT datum,
       EXTRACT(YEAR FROM datum)  AS jahr,
       EXTRACT(MONTH FROM datum) AS monat,
       EXTRACT(DAY FROM datum)   AS tag
FROM bestellungen
ORDER BY id;
-- datum      | jahr | monat | tag
-- 2026-03-14 | 2026 | 3     | 14
-- 2026-11-16 | 2026 | 11    | 16
`)
      },
      pg: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, datum DATE);
INSERT INTO bestellungen VALUES (1, '2026-03-14'), (2, '2026-11-16');

-- ISODOW: 1 = Montag … 7 = Sonntag
SELECT datum,
       EXTRACT(QUARTER FROM datum) AS quartal,
       EXTRACT(WEEK FROM datum)    AS kw,
       EXTRACT(ISODOW FROM datum)  AS wochentag,
       EXTRACT(DOY FROM datum)     AS tag_im_jahr
FROM bestellungen
ORDER BY id;
-- datum      | quartal | kw | wochentag | tag_im_jahr
-- 2026-03-14 | 1       | 11 | 6         | 73
-- 2026-11-16 | 4       | 47 | 1         | 320
`),
        note: "Zusätzliche Felder: `QUARTER`, `WEEK` (ISO-Woche), `DOW` (0 = Sonntag), `ISODOW` (1 = Montag), `DOY`, `EPOCH` (Sekunden seit 1970). Ergebnis ist `NUMERIC`; `DATE_PART('year', d)` ist gleichwertig."
      },
      mysql: {
        note: "Zusätzlich Funktionen wie `YEAR(d)`, `MONTH(d)`, `QUARTER(d)`, `WEEK(d, 3)` (ISO-Woche) und `DAYOFWEEK(d)` (1 = Sonntag).",
        mdn: MY + 'date-and-time-functions.html#function_extract'
      },
      mssql: {
        syntax: "DATEPART(feld, datum)\nYEAR(datum) / MONTH(datum) / DAY(datum)",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, datum DATE);
INSERT INTO bestellungen VALUES (1, '2026-03-14'), (2, '2026-11-16');

SELECT datum,
       YEAR(datum)                AS jahr,
       MONTH(datum)               AS monat,
       DATEPART(quarter, datum)   AS quartal,
       DATEPART(iso_week, datum)  AS kw
FROM bestellungen
ORDER BY id;
-- datum      | jahr | monat | quartal | kw
-- 2026-03-14 | 2026 | 3     | 1       | 11
-- 2026-11-16 | 2026 | 11    | 4       | 47
`),
        note: "Kein `EXTRACT`. `DATEPART(weekday, d)` hängt von `SET DATEFIRST` ab (Standard: 1 = Sonntag).",
        mdn: MS + 'datepart-transact-sql'
      },
      sqlite: {
        syntax: "CAST(strftime('%Y', datum) AS INTEGER)",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, datum DATE);
INSERT INTO bestellungen VALUES (1, '2026-03-14'), (2, '2026-11-16');

SELECT datum,
       CAST(strftime('%Y', datum) AS INTEGER) AS jahr,
       CAST(strftime('%m', datum) AS INTEGER) AS monat,
       CAST(strftime('%d', datum) AS INTEGER) AS tag
FROM bestellungen
ORDER BY id;
-- datum      | jahr | monat | tag
-- 2026-03-14 | 2026 | 3     | 14
-- 2026-11-16 | 2026 | 11    | 16
`),
        note: "Kein `EXTRACT`; `strftime` liefert Text, daher das `CAST`.",
        mdn: SL + 'lang_datefunc.html'
      }
    }
  },
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'DATE_TRUNC()',
    desc: "Schneidet einen Zeitpunkt auf Monat, Woche, Tag … ab – ideal zum Gruppieren.",
    details: "Abschneiden setzt alle kleineren Bestandteile auf ihren Anfangswert: Aus `2026-03-14 10:30` wird beim Monat `2026-03-01 00:00`. Das ist die übliche Art, nach Zeiträumen zu gruppieren, ohne Jahre zu vermischen. Die Funktion heißt je Dialekt anders oder wird über Formatierung nachgebaut.",
    tip: "Für Berichte mit lückenlosen Monaten die Monate per Kalendertabelle oder rekursiver CTE erzeugen und die Umsätze per `LEFT JOIN` anhängen.",
    keywords: ['date_trunc', 'datetrunc', 'abschneiden', 'monatsanfang', 'gruppieren nach monat', 'zeitraum', 'bucket'],
    related: ['EXTRACT()', 'Wochentag & Monat gruppieren', 'GROUP BY', 'TRUNC()'],
    mdn: PG + 'functions-datetime.html#FUNCTIONS-DATETIME-TRUNC',
    dialects: {
      std: { none: "Kein `DATE_TRUNC` im Standard; nach `EXTRACT(YEAR …)` und `EXTRACT(MONTH …)` gruppieren." },
      pg: {
        syntax: "DATE_TRUNC('einheit', zeitpunkt)   -- year, quarter, month, week, day, hour …",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, zeitpunkt TIMESTAMP);
INSERT INTO bestellungen VALUES
  (1, 100, '2026-03-02 09:15'), (2, 50, '2026-03-14 10:30'), (3, 80, '2026-04-01 08:00');

SELECT DATE_TRUNC('month', zeitpunkt) AS monat, SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY 1
ORDER BY 1;
-- monat               | umsatz
-- 2026-03-01 00:00:00 | 150
-- 2026-04-01 00:00:00 | 80
`),
        note: "`'week'` schneidet auf den Montag ab. Lückenlose Monatslisten liefert `generate_series`."
      },
      mysql: {
        syntax: "DATE_FORMAT(zeitpunkt, '%Y-%m-01')",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, zeitpunkt DATETIME);
INSERT INTO bestellungen VALUES
  (1, 100, '2026-03-02 09:15'), (2, 50, '2026-03-14 10:30'), (3, 80, '2026-04-01 08:00');

SELECT DATE_FORMAT(zeitpunkt, '%Y-%m-01') AS monat, SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY monat
ORDER BY monat;
-- monat      | umsatz
-- 2026-03-01 | 150
-- 2026-04-01 | 80
`),
        note: "Kein `DATE_TRUNC`; über `DATE_FORMAT` nachgebaut (Ergebnis ist Text), für Tage reicht `DATE(zeitpunkt)`.",
        mdn: MY + 'date-and-time-functions.html#function_date-format'
      },
      mssql: {
        syntax: "DATETRUNC(einheit, zeitpunkt)   -- seit SQL Server 2022",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, zeitpunkt DATETIME2(0));
INSERT INTO bestellungen VALUES
  (1, 100, '2026-03-02 09:15'), (2, 50, '2026-03-14 10:30'), (3, 80, '2026-04-01 08:00');

SELECT DATETRUNC(month, zeitpunkt) AS monat, SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY DATETRUNC(month, zeitpunkt)
ORDER BY monat;
-- monat               | umsatz
-- 2026-03-01 00:00:00 | 150
-- 2026-04-01 00:00:00 | 80
`),
        note: "Heißt `DATETRUNC` (ohne Unterstrich) und gibt es seit SQL Server 2022; davor `DATEFROMPARTS(YEAR(d), MONTH(d), 1)`.",
        mdn: MS + 'datetrunc-transact-sql'
      },
      sqlite: {
        syntax: "date(zeitpunkt, 'start of month')\nstrftime('%Y-%m', zeitpunkt)",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, zeitpunkt TIMESTAMP);
INSERT INTO bestellungen VALUES
  (1, 100, '2026-03-02 09:15'), (2, 50, '2026-03-14 10:30'), (3, 80, '2026-04-01 08:00');

SELECT date(zeitpunkt, 'start of month') AS monat, SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY monat
ORDER BY monat;
-- monat      | umsatz
-- 2026-03-01 | 150
-- 2026-04-01 | 80
`),
        note: "Kein `DATE_TRUNC`; die Modifikatoren `'start of month'`, `'start of year'` und `'start of day'` leisten dasselbe.",
        mdn: SL + 'lang_datefunc.html#modifiers'
      }
    }
  },
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'strftime() (SQLite)',
    desc: "Formatiert oder zerlegt Datum und Uhrzeit in SQLite über Platzhalter wie %Y.",
    details: "`strftime(format, zeitwert, modifikator…)` ist die zentrale Datumsfunktion von SQLite: Damit holt man Bestandteile (Ersatz für `EXTRACT`) und formatiert Ausgaben. Das Ergebnis ist immer Text, für Rechnungen also mit `CAST(… AS INTEGER)` umwandeln. Der Zeitwert darf ISO-Text, eine Julian-Day-Zahl oder mit `'unixepoch'` ein Unix-Zeitstempel sein.",
    values: [
      ['%Y / %m / %d', 'Jahr / Monat (01–12) / Tag (01–31)'],
      ['%H / %M / %S', 'Stunde / Minute / Sekunde'],
      ['%w', 'Wochentag 0–6, 0 = Sonntag'],
      ['%u / %V', 'ISO-Wochentag 1–7 / ISO-Kalenderwoche (ab 3.46)'],
      ['%j', 'Tag im Jahr (001–366)'],
      ['%s', 'Sekunden seit 1970-01-01 (Unix-Zeit)']
    ],
    tip: "`strftime('%m', datum) = 3` findet nichts, weil `'03'` Text ist – entweder mit `'03'` vergleichen oder vorher in eine Zahl umwandeln.",
    keywords: ['strftime', 'sqlite datum', 'formatieren', 'jahr', 'monat', 'wochentag', 'platzhalter', 'unixzeit'],
    related: ['date() / datetime() (SQLite)', 'EXTRACT()', 'Datum formatieren', 'Wochentag & Monat gruppieren'],
    mdn: SL + 'lang_datefunc.html',
    dialects: {
      std: { none: "SQLite-Funktion; Bestandteile liefert im Standard `EXTRACT(feld FROM datum)`." },
      pg: { none: "Kein `strftime`; Bestandteile mit `EXTRACT`, Formatierung mit `TO_CHAR(d, 'YYYY-MM-DD HH24:MI')`." },
      mysql: { none: "Kein `strftime`; Formatierung mit `DATE_FORMAT(d, '%Y-%m-%d %H:%i')` (ähnliche Platzhalter, Minute ist `%i`), Bestandteile mit `EXTRACT`." },
      mssql: { none: "Kein `strftime`; Bestandteile mit `DATEPART`, Formatierung mit `FORMAT(d, 'yyyy-MM-dd HH:mm')`." },
      sqlite: {
        syntax: "strftime('format', zeitwert [, modifikator …])",
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, zeitpunkt TEXT);
INSERT INTO bestellungen VALUES (1, '2026-03-14 10:30:00'), (2, '2026-11-16 08:05:00');

SELECT zeitpunkt,
       strftime('%Y', zeitpunkt)                  AS jahr,
       CAST(strftime('%m', zeitpunkt) AS INTEGER) AS monat,
       strftime('%w', zeitpunkt)                  AS wochentag,
       strftime('%H:%M', zeitpunkt)               AS uhrzeit,
       strftime('%j', zeitpunkt)                  AS tag_im_jahr
FROM bestellungen
ORDER BY id;
-- zeitpunkt           | jahr | monat | wochentag | uhrzeit | tag_im_jahr
-- 2026-03-14 10:30:00 | 2026 | 3     | 6         | 10:30   | 073
-- 2026-11-16 08:05:00 | 2026 | 11    | 1         | 08:05   | 320
`),
        note: "Seit 3.46 auch ISO-Wochen (`%G`, `%V`, `%u`)."
      }
    }
  },
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'date() / datetime() (SQLite)',
    desc: "SQLite-Funktionen, die Datumswerte normalisieren und mit Modifikatoren verschieben.",
    details: "SQLite hat keinen eigenen Datumstyp; Daten werden meist als ISO-Text (`'2026-11-16 14:30:00'`) gespeichert. `date()`, `time()`, `datetime()` und `unixepoch()` lesen solche Werte, wenden Modifikatoren wie `'+1 day'`, `'start of month'`, `'weekday 1'` oder `'localtime'` an und geben ein normiertes Ergebnis zurück. Unlesbare Eingaben wie `'31.12.2026'` liefern `NULL` statt eines Fehlers, der 30. Februar wird stillschweigend zum 2. März. `'now'` steht für den aktuellen Zeitpunkt in UTC.",
    values: [
      ["'+n days' / '-n hours'", 'Verschieben um Tage, Stunden, Minuten, Monate, Jahre'],
      ["'start of month' / 'start of year'", 'Auf Monats- / Jahresanfang setzen'],
      ["'weekday n'", 'Nächster Wochentag n (0 = Sonntag), ggf. derselbe Tag'],
      ["'unixepoch'", 'Zahl als Unix-Zeitstempel interpretieren'],
      ["'localtime' / 'utc'", 'Zwischen UTC und lokaler Zeit umrechnen']
    ],
    tip: "Datumswerte in SQLite immer im ISO-Format `JJJJ-MM-TT` speichern – nur dann sortieren und vergleichen sie als Text korrekt.",
    keywords: ['date', 'datetime', 'time', 'unixepoch', 'sqlite datum', 'modifikator', 'now', 'localtime', 'start of month'],
    related: ['strftime() (SQLite)', 'Datum rechnen', 'CURRENT_DATE / CURRENT_TIMESTAMP', 'Typaffinität (SQLite)'],
    mdn: SL + 'lang_datefunc.html',
    dialects: {
      std: { none: "SQLite-Funktionen; im Standard gibt es die Typen `DATE`, `TIME`, `TIMESTAMP`, `CAST(x AS DATE)` und Rechnen mit `INTERVAL`." },
      pg: { none: "Nicht nötig: echte Typen `DATE`/`TIMESTAMP`, umwandeln mit `CAST(x AS DATE)` oder `x::date`, rechnen mit `INTERVAL`, Unix-Zeit mit `to_timestamp(n)`." },
      mysql: { none: "Ähnlich heißen `DATE(x)` und `TIME(x)` (Bestandteil holen); rechnen mit `DATE_ADD`, Unix-Zeit mit `FROM_UNIXTIME(n)`." },
      mssql: { none: "Nicht nötig: echte Typen `DATE`/`DATETIME2`, umwandeln mit `CAST`/`TRY_CAST`, rechnen mit `DATEADD`, Unix-Zeit mit `DATEADD(second, n, '1970-01-01')`." },
      sqlite: {
        syntax: "date(zeitwert [, modifikator …])\ntime(zeitwert [, modifikator …])\ndatetime(zeitwert [, modifikator …])\nunixepoch(zeitwert [, modifikator …])",
        example: e(`
CREATE TABLE termine (id INTEGER PRIMARY KEY, titel TEXT, beginn TEXT, dauer_min INTEGER);
INSERT INTO termine VALUES (1, 'Standup', '2026-11-16 09:00', 15), (2, 'Workshop', '2026-11-18 13:30', 150);

SELECT titel,
       date(beginn)                                      AS tag,
       time(beginn)                                      AS start,
       datetime(beginn, '+' || dauer_min || ' minutes')  AS ende,
       date(beginn, 'weekday 5')                         AS freitag_danach
FROM termine
ORDER BY id;
-- titel    | tag        | start    | ende                | freitag_danach
-- Standup  | 2026-11-16 | 09:00:00 | 2026-11-16 09:15:00 | 2026-11-20
-- Workshop | 2026-11-18 | 13:30:00 | 2026-11-18 16:00:00 | 2026-11-20

SELECT datetime(1767225600, 'unixepoch') AS aus_unix,
       date('2026-02-30')                AS normalisiert,
       date('31.12.2026')                AS deutsch;
-- aus_unix            | normalisiert | deutsch
-- 2026-01-01 00:00:00 | 2026-03-02   | NULL
`)
      }
    }
  },
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'Datum formatieren',
    desc: "Datum als Text im gewünschten Format ausgeben, etwa deutsch TT.MM.JJJJ.",
    details: "Für die Ausgabe hat jeder Dialekt eine eigene Funktion mit eigenen Platzhaltern. Das Ergebnis ist Text und sortiert nicht mehr chronologisch, deshalb nach der Originalspalte sortieren. Monats- und Tagesnamen in Landessprache liefern nur manche Dialekte über eine Sprach- oder Kultureinstellung.",
    tip: "Formatieren ist Aufgabe der Anzeige-Schicht; in der Datenbank Datumswerte als Datum lassen, damit Filter und Indizes funktionieren.",
    keywords: ['datum formatieren', 'to_char', 'date_format', 'format', 'convert', 'deutsches datum', 'tt.mm.jjjj', 'ausgabeformat'],
    related: ['strftime() (SQLite)', 'FORMAT() / printf()', 'DATE'],
    mdn: PG + 'functions-formatting.html',
    dialects: {
      std: { none: "Keine Formatierungsfunktion im Standard; `CAST(d AS VARCHAR(10))` liefert das ISO-Format `2026-11-16`." },
      pg: {
        syntax: "TO_CHAR(zeitpunkt, 'DD.MM.YYYY HH24:MI')",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, zeitpunkt TIMESTAMP);
INSERT INTO bestellungen VALUES (1, '2026-11-16 08:05:00'), (2, '2026-03-04 17:45:00');

SELECT TO_CHAR(zeitpunkt, 'DD.MM.YYYY')       AS datum,
       TO_CHAR(zeitpunkt, 'DD.MM.YYYY HH24:MI') AS datum_uhrzeit
FROM bestellungen
ORDER BY zeitpunkt;                            -- nach Originalwert sortieren
-- datum      | datum_uhrzeit
-- 04.03.2026 | 04.03.2026 17:45
-- 16.11.2026 | 16.11.2026 08:05
`),
        note: "Monatsnamen in Landessprache mit dem Präfix `TM` (`TMMonth`) und passender `lc_time`-Einstellung."
      },
      mysql: {
        syntax: "DATE_FORMAT(zeitpunkt, '%d.%m.%Y %H:%i')",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, zeitpunkt DATETIME);
INSERT INTO bestellungen VALUES (1, '2026-11-16 08:05:00'), (2, '2026-03-04 17:45:00');

SELECT DATE_FORMAT(zeitpunkt, '%d.%m.%Y')       AS datum,
       DATE_FORMAT(zeitpunkt, '%d.%m.%Y %H:%i') AS datum_uhrzeit
FROM bestellungen
ORDER BY zeitpunkt;                              -- nach Originalwert sortieren
-- datum      | datum_uhrzeit
-- 04.03.2026 | 04.03.2026 17:45
-- 16.11.2026 | 16.11.2026 08:05
`),
        note: "Minuten sind `%i`, nicht `%M` (das ist der Monatsname). Deutsche Namen mit `SET lc_time_names = 'de_DE'`.",
        mdn: MY + 'date-and-time-functions.html#function_date-format'
      },
      mssql: {
        syntax: "FORMAT(zeitpunkt, 'dd.MM.yyyy HH:mm' [, 'de-DE'])\nCONVERT(VARCHAR(10), zeitpunkt, 104)   -- Stil 104 = TT.MM.JJJJ",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, zeitpunkt DATETIME2(0));
INSERT INTO bestellungen VALUES (1, '2026-11-16 08:05:00'), (2, '2026-03-04 17:45:00');

SELECT CONVERT(VARCHAR(10), zeitpunkt, 104)    AS datum,
       FORMAT(zeitpunkt, 'dd.MM.yyyy HH:mm')   AS datum_uhrzeit
FROM bestellungen
ORDER BY zeitpunkt;                            -- nach Originalwert sortieren
-- datum      | datum_uhrzeit
-- 04.03.2026 | 04.03.2026 17:45
-- 16.11.2026 | 16.11.2026 08:05
`),
        note: "`CONVERT` mit Stilnummer ist schnell, `FORMAT` flexibler (.NET-Muster, Kultur als drittes Argument). Im Muster ist `MM` der Monat, `mm` die Minute.",
        mdn: MS + 'cast-and-convert-transact-sql'
      },
      sqlite: {
        syntax: "strftime('%d.%m.%Y %H:%M', zeitpunkt)",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, zeitpunkt TEXT);
INSERT INTO bestellungen VALUES (1, '2026-11-16 08:05:00'), (2, '2026-03-04 17:45:00');

SELECT strftime('%d.%m.%Y', zeitpunkt)       AS datum,
       strftime('%d.%m.%Y %H:%M', zeitpunkt) AS datum_uhrzeit
FROM bestellungen
ORDER BY zeitpunkt;                          -- nach Originalwert sortieren
-- datum      | datum_uhrzeit
-- 04.03.2026 | 04.03.2026 17:45
-- 16.11.2026 | 16.11.2026 08:05
`),
        note: "Keine Monats- oder Tagesnamen; die muss man selbst zuordnen.",
        mdn: SL + 'lang_datefunc.html'
      }
    }
  },
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'Zeitzonen',
    desc: "Zeitpunkte mit Zeitzone speichern und in andere Zeitzonen umrechnen.",
    details: "Standard-SQL kennt `TIMESTAMP WITH TIME ZONE` und `AT TIME ZONE` zum Umrechnen. Wie die Typen intern speichern (UTC oder mit Versatz) und welche Zonennamen gelten, unterscheidet sich je Dialekt. Zeitzonen möglichst mit Namen wie `Europe/Berlin` angeben, nicht mit festen Versätzen, sonst fehlt die Sommerzeit.",
    tip: "Für echte Zeitpunkte fast immer einen Typ mit Zeitzone (oder konsequent UTC) verwenden; ohne Zone nur für „Wanduhrzeiten“ wie Öffnungszeiten.",
    keywords: ['zeitzone', 'timezone', 'utc', 'timestamptz', 'at time zone', 'sommerzeit', 'convert_tz', 'datetimeoffset'],
    related: ['TIMESTAMP', 'CURRENT_DATE / CURRENT_TIMESTAMP', 'date() / datetime() (SQLite)'],
    mdn: PG + 'datatype-datetime.html#DATATYPE-TIMEZONES',
    dialects: {
      std: {
        syntax: "spalte TIMESTAMP WITH TIME ZONE\nzeitpunkt AT TIME ZONE 'zone'",
        example: e(`
CREATE TABLE termine (id INT PRIMARY KEY, titel VARCHAR(50), beginn TIMESTAMP WITH TIME ZONE);
INSERT INTO termine VALUES
  (1, 'Standup',  '2026-11-16 09:00:00+01'),
  (2, 'Call USA', '2026-11-16 15:00:00-05');

SELECT titel,
       beginn AT TIME ZONE 'UTC'              AS utc,
       beginn AT TIME ZONE 'America/New_York' AS new_york
FROM termine
ORDER BY beginn;
-- titel    | utc                 | new_york
-- Standup  | 2026-11-16 08:00:00 | 2026-11-16 03:00:00
-- Call USA | 2026-11-16 20:00:00 | 2026-11-16 15:00:00
`),
        note: "Der Standard erwartet als Zone eigentlich einen Versatz (`INTERVAL '-05:00' HOUR TO MINUTE`); Namen wie `'America/New_York'` sind verbreitete Erweiterungen."
      },
      pg: { note: "`TIMESTAMPTZ` (= `TIMESTAMP WITH TIME ZONE`) speichert intern UTC und zeigt in der Sitzungszeitzone an (`SET TIME ZONE 'Europe/Berlin'`). `AT TIME ZONE` liefert einen `TIMESTAMP` ohne Zone." },
      mysql: {
        syntax: "CONVERT_TZ(zeitpunkt, 'von_zone', 'nach_zone')\nSET time_zone = 'Europe/Berlin';",
        example: e(`
-- Zeitpunkte in UTC speichern, bei der Ausgabe umrechnen
CREATE TABLE termine (id INT PRIMARY KEY, titel VARCHAR(50), beginn_utc DATETIME);
INSERT INTO termine VALUES (1, 'Standup', '2026-11-16 08:00:00'), (2, 'Call USA', '2026-11-16 20:00:00');

SELECT titel,
       CONVERT_TZ(beginn_utc, '+00:00', 'Europe/Berlin')    AS berlin,
       CONVERT_TZ(beginn_utc, '+00:00', 'America/New_York') AS new_york
FROM termine
ORDER BY beginn_utc;
-- titel    | berlin              | new_york
-- Standup  | 2026-11-16 09:00:00 | 2026-11-16 03:00:00
-- Call USA | 2026-11-16 21:00:00 | 2026-11-16 15:00:00
`),
        note: "Kein Typ mit Zeitzone; `TIMESTAMP` speichert intern UTC und rechnet mit der Sitzungszeitzone um. Zonennamen funktionieren nur, wenn die Zeitzonentabellen geladen sind (`mysql_tzinfo_to_sql`).",
        mdn: MY + 'time-zone-support.html'
      },
      mssql: {
        syntax: "spalte DATETIMEOFFSET\nzeitpunkt AT TIME ZONE 'W. Europe Standard Time'",
        example: e(`
CREATE TABLE termine (id INT PRIMARY KEY, titel VARCHAR(50), beginn DATETIMEOFFSET(0));
INSERT INTO termine VALUES
  (1, 'Standup',  '2026-11-16 09:00:00 +01:00'),
  (2, 'Call USA', '2026-11-16 15:00:00 -05:00');

SELECT titel,
       CAST(beginn AT TIME ZONE 'UTC' AS DATETIME2(0))                   AS utc,
       CAST(beginn AT TIME ZONE 'Eastern Standard Time' AS DATETIME2(0)) AS new_york
FROM termine
ORDER BY beginn;
-- titel    | utc                 | new_york
-- Standup  | 2026-11-16 08:00:00 | 2026-11-16 03:00:00
-- Call USA | 2026-11-16 20:00:00 | 2026-11-16 15:00:00
`),
        note: "Der Typ heißt `DATETIMEOFFSET` und speichert den Versatz mit. `AT TIME ZONE` (seit 2016) nutzt Windows-Zonennamen wie `'W. Europe Standard Time'`.",
        mdn: MST + 'queries/at-time-zone-transact-sql'
      },
      sqlite: {
        syntax: "datetime(zeitwert)                -- Versatz im Text wird nach UTC umgerechnet\ndatetime(zeitwert, 'localtime')",
        example: e(`
CREATE TABLE termine (id INT PRIMARY KEY, titel TEXT, beginn TEXT);
INSERT INTO termine VALUES
  (1, 'Standup',  '2026-11-16 09:00:00+01:00'),
  (2, 'Call USA', '2026-11-16 15:00:00-05:00');

SELECT titel, datetime(beginn) AS utc
FROM termine
ORDER BY utc;
-- titel    | utc
-- Standup  | 2026-11-16 08:00:00
-- Call USA | 2026-11-16 20:00:00
`),
        note: "Keine Zeitzonen-Typen und keine Zonennamen; nur UTC und die lokale Zeit des Rechners (`'localtime'`). Ein Versatz wie `+01:00` im Text wird beim Lesen nach UTC umgerechnet.",
        mdn: SL + 'lang_datefunc.html'
      }
    }
  },
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'Datumsbereich filtern',
    desc: "Zeiträume mit halboffenem Intervall filtern: >= Anfang und < Ende.",
    details: "Das sichere Muster für Zeiträume ist `spalte >= '2026-03-01' AND spalte < '2026-04-01'`. `BETWEEN` schließt beide Grenzen ein und verliert bei Zeitstempeln alles nach Mitternacht des letzten Tags: `'2026-03-31 18:30'` ist größer als `'2026-03-31'`. Funktionen auf der Spalte (`EXTRACT`, `YEAR()` …) verhindern zudem die Index-Nutzung; der Vergleich mit Grenzwerten bleibt sargierbar.",
    tip: "Halboffene Intervalle lassen sich lückenlos aneinanderreihen – das Ende des einen Monats ist der Anfang des nächsten.",
    keywords: ['zeitraum', 'datumsbereich', 'between datum', 'monat filtern', 'von bis', 'date range', 'halboffen'],
    related: ['BETWEEN', 'Sargierbare Bedingungen', 'EXTRACT()', 'Datum rechnen'],
    mdn: PG + 'functions-datetime.html',
    dialects: {
      std: {
        syntax: "WHERE spalte >= anfang AND spalte < ende_exklusiv",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, zeitpunkt TIMESTAMP);
INSERT INTO bestellungen VALUES
  (1, 50, '2026-03-01 09:00:00'), (2, 80, '2026-03-31 18:30:00'),
  (3, 20, '2026-04-01 00:00:00'), (4, 30, '2026-02-28 23:59:00');

-- Falsch: BETWEEN verliert den 31. März ab 00:00:01
SELECT id FROM bestellungen
WHERE zeitpunkt BETWEEN '2026-03-01' AND '2026-03-31'
ORDER BY id;
-- id
-- 1

-- Richtig: halboffenes Intervall
SELECT id, betrag FROM bestellungen
WHERE zeitpunkt >= '2026-03-01' AND zeitpunkt < '2026-04-01'
ORDER BY id;
-- id | betrag
-- 1  | 50
-- 2  | 80
`)
      },
      mssql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, zeitpunkt DATETIME2(0));
INSERT INTO bestellungen VALUES
  (1, 50, '2026-03-01 09:00:00'), (2, 80, '2026-03-31 18:30:00'),
  (3, 20, '2026-04-01 00:00:00'), (4, 30, '2026-02-28 23:59:00');

-- Falsch: BETWEEN verliert den 31. März ab 00:00:01
SELECT id FROM bestellungen
WHERE zeitpunkt BETWEEN '2026-03-01' AND '2026-03-31'
ORDER BY id;
-- id
-- 1

-- Richtig: halboffenes Intervall
SELECT id, betrag FROM bestellungen
WHERE zeitpunkt >= '2026-03-01' AND zeitpunkt < '2026-04-01'
ORDER BY id;
-- id | betrag
-- 1  | 50
-- 2  | 80
`),
        note: "`TIMESTAMP` ist in SQL Server kein Datumstyp (sondern `ROWVERSION`) – für Zeitpunkte `DATETIME2` verwenden."
      },
      sqlite: { note: "Datumswerte sind Text; der Vergleich funktioniert nur, weil ISO-Text (`JJJJ-MM-TT hh:mm:ss`) alphabetisch richtig sortiert." }
    }
  },
  {
    lang: 'sql', group: 'Datum & Zeit', name: 'Wochentag & Monat gruppieren',
    desc: "Umsätze pro Monat oder Wochentag auswerten, indem man nach Datumsteilen gruppiert.",
    details: "Für Monatsberichte gruppiert man nach einem Ausdruck, der Jahr und Monat enthält – nur nach dem Monat zu gruppieren würde Jahre vermischen. Für Wochentage ist die Nummerierung je Dialekt verschieden (Sonntag = 0 oder 1, Montag = 0 oder 1), deshalb nach der Zahl sortieren und den Namen selbst zuordnen.",
    tip: "Monate ohne Umsatz fehlen im Ergebnis; für lückenlose Berichte eine Monatsliste (z. B. per rekursiver CTE) erzeugen und per `LEFT JOIN` verbinden.",
    keywords: ['pro monat', 'monatlich', 'wochentag', 'gruppieren nach datum', 'zeitreihe', 'umsatz pro monat', 'report'],
    related: ['GROUP BY', 'strftime() (SQLite)', 'DATE_TRUNC()', 'Zahlenreihe erzeugen'],
    mdn: SL + 'lang_datefunc.html',
    dialects: {
      std: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, datum DATE);
INSERT INTO bestellungen VALUES
  (1, 100, '2026-01-05'), (2, 50, '2026-01-20'), (3, 70, '2026-02-03'),
  (4, 30, '2026-02-14'), (5, 90, '2026-03-02');

SELECT EXTRACT(YEAR FROM datum) AS jahr, EXTRACT(MONTH FROM datum) AS monat,
       COUNT(*) AS anzahl, SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY EXTRACT(YEAR FROM datum), EXTRACT(MONTH FROM datum)
ORDER BY jahr, monat;
-- jahr | monat | anzahl | umsatz
-- 2026 | 1     | 2      | 150
-- 2026 | 2     | 2      | 100
-- 2026 | 3     | 1      | 90
`),
        note: "Einen Wochentag kennt `EXTRACT` im Standard nicht – siehe die Dialekt-Tabs."
      },
      pg: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, datum DATE);
INSERT INTO bestellungen VALUES
  (1, 100, '2026-01-05'), (2, 50, '2026-01-20'), (3, 70, '2026-02-03'),
  (4, 30, '2026-02-14'), (5, 90, '2026-03-02');

SELECT TO_CHAR(datum, 'YYYY-MM') AS monat, COUNT(*) AS anzahl, SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY monat
ORDER BY monat;
-- monat   | anzahl | umsatz
-- 2026-01 | 2      | 150
-- 2026-02 | 2      | 100
-- 2026-03 | 1      | 90

-- Wochentag: ISODOW liefert 1 = Montag … 7 = Sonntag
SELECT SUBSTRING('MoDiMiDoFrSaSo' FROM tag_nr * 2 - 1 FOR 2) AS tag, SUM(betrag) AS umsatz
FROM (SELECT CAST(EXTRACT(ISODOW FROM datum) AS INT) AS tag_nr, betrag FROM bestellungen) AS t
GROUP BY tag_nr
ORDER BY tag_nr;
-- tag | umsatz
-- Mo  | 190
-- Di  | 120
-- Sa  | 30
`),
        note: "Monate auch mit `DATE_TRUNC('month', datum)`; Wochentag über `EXTRACT(ISODOW …)` (1 = Montag) oder `DOW` (0 = Sonntag)."
      },
      mysql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, datum DATE);
INSERT INTO bestellungen VALUES
  (1, 100, '2026-01-05'), (2, 50, '2026-01-20'), (3, 70, '2026-02-03'),
  (4, 30, '2026-02-14'), (5, 90, '2026-03-02');

SELECT DATE_FORMAT(datum, '%Y-%m') AS monat, COUNT(*) AS anzahl, SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY monat
ORDER BY monat;
-- monat   | anzahl | umsatz
-- 2026-01 | 2      | 150
-- 2026-02 | 2      | 100
-- 2026-03 | 1      | 90

-- Wochentag: WEEKDAY liefert 0 = Montag … 6 = Sonntag
SELECT SUBSTRING('MoDiMiDoFrSaSo', tag_nr * 2 + 1, 2) AS tag, SUM(betrag) AS umsatz
FROM (SELECT WEEKDAY(datum) AS tag_nr, betrag FROM bestellungen) AS t
GROUP BY tag_nr
ORDER BY tag_nr;
-- tag | umsatz
-- Mo  | 190
-- Di  | 120
-- Sa  | 30
`),
        note: "`WEEKDAY(d)` zählt ab Montag = 0, `DAYOFWEEK(d)` ab Sonntag = 1. `DAYNAME(d)` liefert den Namen in der Sprache von `lc_time_names`.",
        mdn: MY + 'date-and-time-functions.html#function_weekday'
      },
      mssql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, datum DATE);
INSERT INTO bestellungen VALUES
  (1, 100, '2026-01-05'), (2, 50, '2026-01-20'), (3, 70, '2026-02-03'),
  (4, 30, '2026-02-14'), (5, 90, '2026-03-02');

SELECT YEAR(datum) AS jahr, MONTH(datum) AS monat, COUNT(*) AS anzahl, SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY YEAR(datum), MONTH(datum)
ORDER BY jahr, monat;
-- jahr | monat | anzahl | umsatz
-- 2026 | 1     | 2      | 150
-- 2026 | 2     | 2      | 100
-- 2026 | 3     | 1      | 90

-- Wochentag unabhängig von SET DATEFIRST: 1 = Montag … 7 = Sonntag
SELECT SUBSTRING('MoDiMiDoFrSaSo', tag_nr * 2 - 1, 2) AS tag, SUM(betrag) AS umsatz
FROM (SELECT (DATEPART(weekday, datum) + @@DATEFIRST - 2) % 7 + 1 AS tag_nr, betrag
      FROM bestellungen) AS t
GROUP BY tag_nr
ORDER BY tag_nr;
-- tag | umsatz
-- Mo  | 190
-- Di  | 120
-- Sa  | 30
`),
        note: "`DATEPART(weekday, d)` hängt von `SET DATEFIRST` ab; die Formel mit `@@DATEFIRST` macht das Ergebnis unabhängig davon.",
        mdn: MS + 'datepart-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag INT, datum DATE);
INSERT INTO bestellungen VALUES
  (1, 100, '2026-01-05'), (2, 50, '2026-01-20'), (3, 70, '2026-02-03'),
  (4, 30, '2026-02-14'), (5, 90, '2026-03-02');

SELECT strftime('%Y-%m', datum) AS monat, COUNT(*) AS anzahl, SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY monat
ORDER BY monat;
-- monat   | anzahl | umsatz
-- 2026-01 | 2      | 150
-- 2026-02 | 2      | 100
-- 2026-03 | 1      | 90

-- Wochentag: %w liefert 0 = Sonntag … 6 = Samstag
SELECT SUBSTR('SoMoDiMiDoFrSa', 1 + 2 * CAST(strftime('%w', datum) AS INTEGER), 2) AS tag,
       SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY strftime('%w', datum)
ORDER BY (CAST(strftime('%w', datum) AS INTEGER) + 6) % 7;   -- Montag zuerst
-- tag | umsatz
-- Mo  | 190
-- Di  | 120
-- Sa  | 30
`),
        note: "`strftime('%w', d)` zählt ab Sonntag = 0, seit 3.46 liefert `%u` den ISO-Wochentag (1 = Montag)."
      }
    }
  },

  // ---------------- JSON ----------------
  {
    lang: 'sql', group: 'JSON', name: 'JSON-Funktionen',
    desc: "JSON-Dokumente in Spalten speichern, prüfen, abfragen und ändern.",
    details: "Alle großen Datenbanken können JSON verarbeiten, aber mit unterschiedlichen Typen und Funktionsnamen. Seit SQL:2016 gibt es genormte Funktionen: `IS JSON` prüft, `JSON_VALUE` holt einen Skalar, `JSON_QUERY` ein Objekt oder Array. Pfade werden meist als `'$.feld.unterfeld'` bzw. `'$.liste[0]'` geschrieben. JSON eignet sich für flexible Zusatzattribute, nicht als Ersatz für normale Spalten.",
    tip: "Ein `CHECK` an der Spalte (`attribute IS JSON`, `JSON_VALID(…)`, `ISJSON(…) = 1` bzw. `json_valid(…)`) verhindert, dass kaputtes JSON überhaupt gespeichert wird.",
    keywords: ['json', 'json funktionen', 'dokument', 'semi-strukturiert', 'json_value', 'json_query', 'is json', 'json_valid', 'isjson', 'nosql', 'attribute'],
    related: ['-> / ->>', 'json_extract()', 'JSONB (PostgreSQL)', 'JSON-Typ'],
    mdn: PG + 'functions-json.html',
    dialects: {
      std: {
        syntax: "wert IS JSON\nJSON_VALUE(json, '$.pfad' [RETURNING typ])   -- Skalar\nJSON_QUERY(json, '$.pfad')                   -- Objekt / Array",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), attribute VARCHAR(200));
INSERT INTO produkte VALUES
  (1, 'Maus',    '{"farbe": "schwarz", "gewicht": 85, "tags": ["neu", "funk"]}'),
  (2, 'Monitor', '{"farbe": "weiß", "gewicht": 4200, "tags": []}'),
  (3, 'Kabel',   'kein json');

SELECT name, attribute IS JSON AS gueltig FROM produkte ORDER BY id;
-- name    | gueltig
-- Maus    | true
-- Monitor | true
-- Kabel   | false

SELECT name,
       JSON_VALUE(CAST(attribute AS JSON), '$.farbe')                 AS farbe,
       JSON_VALUE(CAST(attribute AS JSON), '$.gewicht' RETURNING INT) AS gewicht,
       JSON_QUERY(CAST(attribute AS JSON), '$.tags')                  AS tags
FROM produkte
WHERE attribute IS JSON
ORDER BY id;
-- name    | farbe   | gewicht | tags
-- Maus    | schwarz | 85      | ["neu", "funk"]
-- Monitor | weiß    | 4200    | []
`)
      },
      pg: { note: "`IS JSON` seit PostgreSQL 16, `JSON_VALUE`/`JSON_QUERY` seit 17. Daneben die Typen `json`/`jsonb` mit Operatoren wie `->`, `->>` und `@>` und Funktionen wie `jsonb_set`." },
      mysql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), attribute VARCHAR(200));
INSERT INTO produkte VALUES
  (1, 'Maus',    '{"farbe": "schwarz", "gewicht": 85, "tags": ["neu", "funk"]}'),
  (2, 'Monitor', '{"farbe": "weiß", "gewicht": 4200, "tags": []}'),
  (3, 'Kabel',   'kein json');

SELECT name, JSON_VALID(attribute) AS gueltig FROM produkte ORDER BY id;
-- name    | gueltig
-- Maus    | 1
-- Monitor | 1
-- Kabel   | 0

SELECT name,
       JSON_VALUE(attribute, '$.farbe')                     AS farbe,
       JSON_VALUE(attribute, '$.gewicht' RETURNING SIGNED)  AS gewicht,
       JSON_EXTRACT(attribute, '$.tags')                    AS tags
FROM produkte
WHERE JSON_VALID(attribute)
ORDER BY id;
-- name    | farbe   | gewicht | tags
-- Maus    | schwarz | 85      | ["neu", "funk"]
-- Monitor | weiß    | 4200    | []

-- Ändern: JSON_SET setzt, JSON_REMOVE entfernt
UPDATE produkte SET attribute = JSON_SET(attribute, '$.gewicht', 90) WHERE id = 1;
SELECT JSON_VALUE(attribute, '$.gewicht') AS gewicht FROM produkte WHERE id = 1;
-- gewicht
-- 90
`),
        note: "Prüfen mit `JSON_VALID`; eigener Typ `JSON` (binär gespeichert). `JSON_VALUE` seit 8.0.21, statt `JSON_QUERY` dient `JSON_EXTRACT`.",
        mdn: MY + 'json-functions.html'
      },
      mssql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), attribute NVARCHAR(200));
INSERT INTO produkte VALUES
  (1, N'Maus',    N'{"farbe": "schwarz", "gewicht": 85, "tags": ["neu", "funk"]}'),
  (2, N'Monitor', N'{"farbe": "weiß", "gewicht": 4200, "tags": []}'),
  (3, N'Kabel',   N'kein json');

SELECT name, ISJSON(attribute) AS gueltig FROM produkte ORDER BY id;
-- name    | gueltig
-- Maus    | 1
-- Monitor | 1
-- Kabel   | 0

SELECT name,
       JSON_VALUE(attribute, '$.farbe')                  AS farbe,
       CAST(JSON_VALUE(attribute, '$.gewicht') AS INT)   AS gewicht,
       JSON_QUERY(attribute, '$.tags')                   AS tags
FROM produkte
WHERE ISJSON(attribute) = 1
ORDER BY id;
-- name    | farbe   | gewicht | tags
-- Maus    | schwarz | 85      | ["neu", "funk"]
-- Monitor | weiß    | 4200    | []

-- Ändern: JSON_MODIFY
UPDATE produkte SET attribute = JSON_MODIFY(attribute, '$.gewicht', 90) WHERE id = 1;
SELECT JSON_VALUE(attribute, '$.gewicht') AS gewicht FROM produkte WHERE id = 1;
-- gewicht
-- 90
`),
        note: "JSON wird bis SQL Server 2022 als `NVARCHAR` gespeichert (eigener Typ `json` ab 2025). Prüfen mit `ISJSON`, ändern mit `JSON_MODIFY`; `JSON_VALUE` liefert immer Text.",
        mdn: MS + 'json-functions-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, attribute TEXT);
INSERT INTO produkte VALUES
  (1, 'Maus',    '{"farbe": "schwarz", "gewicht": 85, "tags": ["neu", "funk"]}'),
  (2, 'Monitor', '{"farbe": "weiß", "gewicht": 4200, "tags": []}'),
  (3, 'Kabel',   'kein json');

SELECT name, json_valid(attribute) AS gueltig,
       json_array_length(attribute, '$.tags') AS anzahl_tags
FROM produkte
WHERE json_valid(attribute)
ORDER BY id;
-- name    | gueltig | anzahl_tags
-- Maus    | 1       | 2
-- Monitor | 1       | 0

-- Ändern: json_set / json_insert / json_replace / json_remove
UPDATE produkte SET attribute = json_set(attribute, '$.gewicht', 90) WHERE id = 1;
SELECT attribute FROM produkte WHERE id = 1;
-- attribute
-- {"farbe":"schwarz","gewicht":90,"tags":["neu","funk"]}
`),
        note: "JSON wird als `TEXT` gespeichert; die `json_*`-Funktionen sind eingebaut. Statt `JSON_VALUE` dient `json_extract` bzw. `->>`. Geänderte Dokumente kommen ohne Leerzeichen zurück.",
        mdn: SL + 'json1.html'
      }
    }
  },
  {
    lang: 'sql', group: 'JSON', name: '-> / ->>',
    desc: "Operatoren für JSON-Zugriff: -> liefert JSON, ->> liefert einen SQL-Wert (Text/Zahl).",
    details: "`daten -> 'tags'` gibt das Element als JSON zurück, `daten ->> 'farbe'` als normalen SQL-Wert. Beide lassen sich verketten: `daten -> 'tags' ->> 0` holt das erste Array-Element. Wie der Schlüssel angegeben wird (Name oder Pfad `'$.farbe'`), hängt vom Dialekt ab.",
    tip: "In `WHERE` fast immer `->>` verwenden – `-> 'farbe' = 'schwarz'` vergleicht JSON mit Text und findet je nach Dialekt nichts.",
    keywords: ['->', '->>', 'json pfeil', 'json operator', 'json zugriff', 'json_value', 'feld auslesen'],
    related: ['json_extract()', 'JSON-Funktionen', 'JSONB (PostgreSQL)'],
    mdn: PG + 'functions-json.html',
    dialects: {
      std: { none: "Keine Operatoren im Standard; dort `JSON_QUERY(daten, '$.a')` (JSON) und `JSON_VALUE(daten, '$.a')` (SQL-Wert)." },
      pg: {
        syntax: "json -> 'schluessel'       -- Ergebnis: JSON\njson ->> 'schluessel'      -- Ergebnis: Text\njson -> 'liste' ->> 0      -- Array-Element (Index ab 0)",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), attribute JSONB);
INSERT INTO produkte VALUES
  (1, 'Maus',    '{"farbe": "schwarz", "gewicht": 85, "tags": ["neu", "funk"]}'),
  (2, 'Monitor', '{"farbe": "weiß", "gewicht": 4200, "tags": []}');

SELECT name,
       attribute -> 'tags'        AS als_json,
       attribute ->> 'farbe'      AS als_text,
       attribute -> 'tags' ->> 0  AS erster_tag
FROM produkte
ORDER BY id;
-- name    | als_json        | als_text | erster_tag
-- Maus    | ["neu", "funk"] | schwarz  | neu
-- Monitor | []              | weiß     | NULL

-- ->> liefert Text: für Zahlenvergleiche umwandeln
SELECT name FROM produkte WHERE CAST(attribute ->> 'gewicht' AS INT) > 1000;
-- name
-- Monitor
`),
        note: "Nur für die Typen `json`/`jsonb`, nicht für Text. `#>` und `#>>` nehmen einen Pfad: `daten #>> '{kunde,name}'`.",
        mdn: PG + 'functions-json.html'
      },
      mysql: {
        syntax: "json -> '$.pfad'      -- Ergebnis: JSON\njson ->> '$.pfad'     -- Ergebnis: Text",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), attribute JSON);
INSERT INTO produkte VALUES
  (1, 'Maus',    '{"farbe": "schwarz", "gewicht": 85, "tags": ["neu", "funk"]}'),
  (2, 'Monitor', '{"farbe": "weiß", "gewicht": 4200, "tags": []}');

SELECT name,
       attribute -> '$.tags'       AS als_json,
       attribute ->> '$.farbe'     AS als_text,
       attribute ->> '$.tags[0]'   AS erster_tag
FROM produkte
ORDER BY id;
-- name    | als_json        | als_text | erster_tag
-- Maus    | ["neu", "funk"] | schwarz  | neu
-- Monitor | []              | weiß     | NULL

SELECT name FROM produkte WHERE attribute -> '$.gewicht' > 1000;
-- name
-- Monitor
`),
        note: "Rechts steht immer ein Pfad (`'$.a'`), keine Verkettung `-> … ->>`. `->` entspricht `JSON_EXTRACT`, `->>` zusätzlich `JSON_UNQUOTE`.",
        mdn: MY + 'json-search-functions.html#operator_json-column-path'
      },
      mssql: {
        syntax: "JSON_QUERY(json, '$.pfad')   -- Objekt / Array\nJSON_VALUE(json, '$.pfad')   -- Skalar als Text",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), attribute NVARCHAR(200));
INSERT INTO produkte VALUES
  (1, N'Maus',    N'{"farbe": "schwarz", "gewicht": 85, "tags": ["neu", "funk"]}'),
  (2, N'Monitor', N'{"farbe": "weiß", "gewicht": 4200, "tags": []}');

SELECT name,
       JSON_QUERY(attribute, '$.tags')     AS als_json,
       JSON_VALUE(attribute, '$.farbe')    AS als_text,
       JSON_VALUE(attribute, '$.tags[0]')  AS erster_tag
FROM produkte
ORDER BY id;
-- name    | als_json        | als_text | erster_tag
-- Maus    | ["neu", "funk"] | schwarz  | neu
-- Monitor | []              | weiß     | NULL

SELECT name FROM produkte WHERE CAST(JSON_VALUE(attribute, '$.gewicht') AS INT) > 1000;
-- name
-- Monitor
`),
        note: "Keine Pfeil-Operatoren; `JSON_QUERY` und `JSON_VALUE` übernehmen ihre Rolle.",
        mdn: MS + 'json-value-transact-sql'
      },
      sqlite: {
        syntax: "json -> 'schluessel'   -- Ergebnis: JSON-Text\njson ->> 'schluessel'  -- Ergebnis: SQL-Wert\njson -> '$.a.b'        -- auch Pfade",
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, attribute TEXT);
INSERT INTO produkte VALUES
  (1, 'Maus',    '{"farbe": "schwarz", "gewicht": 85, "tags": ["neu", "funk"]}'),
  (2, 'Monitor', '{"farbe": "weiß", "gewicht": 4200, "tags": []}');

SELECT name,
       attribute -> 'tags'        AS als_json,
       attribute ->> 'farbe'      AS als_text,
       attribute -> 'tags' ->> 0  AS erster_tag
FROM produkte
ORDER BY id;
-- name    | als_json       | als_text | erster_tag
-- Maus    | ["neu","funk"] | schwarz  | neu
-- Monitor | []             | weiß     | NULL

SELECT name FROM produkte WHERE attribute ->> 'gewicht' > 1000;
-- name
-- Monitor
`),
        note: "Seit SQLite 3.38; funktioniert auf JSON in `TEXT`-Spalten und versteht Schlüssel wie Pfade. `->>` liefert Zahlen als Zahlen.",
        mdn: SL + 'json1.html#jptr'
      }
    }
  },
  {
    lang: 'sql', group: 'JSON', name: 'json_extract()',
    desc: "Liest einen oder mehrere Werte über JSON-Pfade aus (SQLite, MySQL).",
    details: "`json_extract(daten, '$.pfad')` holt Werte über JSON-Pfade, mit mehreren Pfaden entsteht ein JSON-Array. Ob Strings als SQL-Wert oder als JSON (mit Anführungszeichen) zurückkommen, unterscheidet sich je Dialekt. Wo die Funktion fehlt, übernehmen `JSON_VALUE`/`JSON_QUERY` oder Operatoren die Aufgabe.",
    values: [
      ['$', 'Das ganze Dokument'],
      ['$.a.b', 'Feld b im Objekt a'],
      ['$.liste[0]', 'Erstes Array-Element']
    ],
    tip: "Häufig abgefragte JSON-Felder lassen sich als generierte Spalte oder Ausdrucksindex beschleunigen.",
    keywords: ['json_extract', 'json pfad', 'json path', 'json_value', 'json auslesen', 'verschachtelt', 'nested', 'json_unquote'],
    related: ['-> / ->>', 'json_each()', 'Generierte Spalten', 'Ausdrucksindex'],
    mdn: SL + 'json1.html#jex',
    dialects: {
      std: { none: "Kein `json_extract` im Standard; dort `JSON_VALUE(daten, '$.pfad')` für Skalare und `JSON_QUERY` für Objekte und Arrays." },
      pg: { none: "Kein `json_extract`; stattdessen `daten #>> '{kunde,name}'`, `daten -> 'kunde' ->> 'name'`, `JSON_VALUE` (seit 17) oder `jsonb_path_query`." },
      mysql: {
        syntax: "JSON_EXTRACT(json, '$.pfad' [, '$.pfad2' …])   -- liefert JSON\nJSON_UNQUOTE(JSON_EXTRACT(…))                  -- als Text",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, daten JSON);
INSERT INTO bestellungen VALUES
  (1, '{"kunde": {"name": "Ada", "stadt": "Berlin"}, "positionen": [{"artikel": "Maus", "preis": 20}]}'),
  (2, '{"kunde": {"name": "Lin", "stadt": "Hamburg"}, "positionen": [{"artikel": "Monitor", "preis": 199}, {"artikel": "Kabel", "preis": 5}]}');

-- JSON_EXTRACT liefert JSON: Strings in Anführungszeichen
SELECT id,
       JSON_EXTRACT(daten, '$.kunde.name')                 AS als_json,
       JSON_UNQUOTE(JSON_EXTRACT(daten, '$.kunde.name'))   AS kunde,
       JSON_EXTRACT(daten, '$.kunde.name', '$.kunde.stadt') AS mehrere
FROM bestellungen
WHERE JSON_EXTRACT(daten, '$.positionen[0].preis') > 10
ORDER BY id;
-- id | als_json | kunde | mehrere
-- 1  | "Ada"    | Ada   | ["Ada", "Berlin"]
-- 2  | "Lin"    | Lin   | ["Lin", "Hamburg"]
`),
        note: "Liefert immer JSON; für Text `JSON_UNQUOTE` oder den Operator `->>`. Das letzte Element: `'$.liste[last]'`.",
        mdn: MY + 'json-search-functions.html#function_json-extract'
      },
      mssql: { none: "Kein `json_extract`; stattdessen `JSON_VALUE(daten, '$.kunde.name')` für Skalare und `JSON_QUERY` für Objekte und Arrays." },
      sqlite: {
        syntax: "json_extract(json, '$.pfad' [, '$.pfad2' …])",
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, daten TEXT);
INSERT INTO bestellungen VALUES
  (1, '{"kunde": {"name": "Ada", "stadt": "Berlin"}, "positionen": [{"artikel": "Maus", "preis": 20}]}'),
  (2, '{"kunde": {"name": "Lin", "stadt": "Hamburg"}, "positionen": [{"artikel": "Monitor", "preis": 199}, {"artikel": "Kabel", "preis": 5}]}');

SELECT id,
       json_extract(daten, '$.kunde.name')                  AS kunde,
       json_extract(daten, '$.positionen[0].artikel')       AS erster_artikel,
       json_extract(daten, '$.kunde.name', '$.kunde.stadt') AS mehrere
FROM bestellungen
WHERE json_extract(daten, '$.positionen[0].preis') > 10
ORDER BY id;
-- id | kunde | erster_artikel | mehrere
-- 1  | Ada   | Maus           | ["Ada","Berlin"]
-- 2  | Lin   | Monitor        | ["Lin","Hamburg"]
`),
        note: "Strings und Zahlen kommen als SQL-Werte zurück, Objekte und Arrays als JSON-Text. Das letzte Element: `'$.liste[#-1]'`.",
        mdn: SL + 'json1.html#jex'
      }
    }
  },
  {
    lang: 'sql', group: 'JSON', name: 'json_each()',
    desc: "Tabellenfunktion: macht aus einem JSON-Array oder -Objekt eine Zeile pro Element.",
    details: "Um Arrays in JSON-Spalten auszuwerten, verwandelt man sie in Zeilen: eine Zeile pro Element, verbunden mit der Ausgangszeile (lateral). Standard-SQL nutzt dafür `JSON_TABLE` mit einer Spaltenliste, die Dialekte haben zusätzlich eigene Tabellenfunktionen.",
    tip: "Mit `WHERE EXISTS (SELECT 1 FROM …(p.tags) WHERE …)` filtert man Zeilen, deren Array einen bestimmten Wert enthält.",
    keywords: ['json_each', 'json_tree', 'array auspacken', 'unnest', 'json_table', 'openjson', 'jsonb_array_elements', 'zeilen aus json'],
    related: ['json_extract()', 'JSON_AGG() / json_group_array()', 'LATERAL'],
    mdn: SL + 'json1.html#jeach',
    dialects: {
      std: {
        syntax: "JSON_TABLE(json, '$[*]' COLUMNS (\n  pos FOR ORDINALITY,\n  spalte typ PATH '$'\n)) AS j",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), tags JSON);
INSERT INTO produkte VALUES
  (1, 'Maus', '["neu", "funk"]'), (2, 'Tastatur', '["funk"]'), (3, 'Monitor', '[]');

SELECT p.name, j.pos, j.tag
FROM produkte AS p,
     JSON_TABLE(p.tags, '$[*]' COLUMNS (pos FOR ORDINALITY, tag VARCHAR(20) PATH '$')) AS j
ORDER BY p.id, j.pos;
-- name     | pos | tag
-- Maus     | 1   | neu
-- Maus     | 2   | funk
-- Tastatur | 1   | funk

-- Wie oft kommt jeder Tag vor?
SELECT j.tag, COUNT(*) AS anzahl
FROM produkte AS p,
     JSON_TABLE(p.tags, '$[*]' COLUMNS (tag VARCHAR(20) PATH '$')) AS j
GROUP BY j.tag
ORDER BY anzahl DESC, j.tag;
-- tag  | anzahl
-- funk | 2
-- neu  | 1
`)
      },
      pg: { note: "`JSON_TABLE` seit PostgreSQL 17; einfacher sind `jsonb_array_elements_text(tags)` bzw. `jsonb_each(objekt)`." },
      mysql: { note: "`JSON_TABLE` seit MySQL 8.0.4.", mdn: MY + 'json-table-functions.html' },
      mssql: {
        syntax: "CROSS APPLY OPENJSON(json [, '$.pfad']) AS j          -- Spalten key, value, type\nCROSS APPLY OPENJSON(json) WITH (spalte typ '$') AS j",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), tags NVARCHAR(200));
INSERT INTO produkte VALUES
  (1, N'Maus', N'["neu", "funk"]'), (2, N'Tastatur', N'["funk"]'), (3, N'Monitor', N'[]');

-- key ist der Array-Index (ab 0, als Text)
SELECT p.name, j.[key] AS pos, j.value AS tag
FROM produkte AS p
CROSS APPLY OPENJSON(p.tags) AS j
ORDER BY p.id, CAST(j.[key] AS INT);
-- name     | pos | tag
-- Maus     | 0   | neu
-- Maus     | 1   | funk
-- Tastatur | 0   | funk

-- Wie oft kommt jeder Tag vor?
SELECT j.value AS tag, COUNT(*) AS anzahl
FROM produkte AS p
CROSS APPLY OPENJSON(p.tags) AS j
GROUP BY j.value
ORDER BY anzahl DESC, tag;
-- tag  | anzahl
-- funk | 2
-- neu  | 1
`),
        note: "Kein `JSON_TABLE`; `OPENJSON` (seit 2016) liefert `key`, `value` und `type` oder mit `WITH (…)` eigene Spalten.",
        mdn: MS + 'openjson-transact-sql'
      },
      sqlite: {
        syntax: "SELECT … FROM tabelle, json_each(tabelle.spalte [, '$.pfad']) AS j   -- Spalten key, value, type",
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, tags TEXT);
INSERT INTO produkte VALUES
  (1, 'Maus', '["neu", "funk"]'), (2, 'Tastatur', '["funk"]'), (3, 'Monitor', '[]');

-- key ist der Array-Index (ab 0)
SELECT p.name, t.key AS pos, t.value AS tag
FROM produkte AS p, json_each(p.tags) AS t
ORDER BY p.id, t.key;
-- name     | pos | tag
-- Maus     | 0   | neu
-- Maus     | 1   | funk
-- Tastatur | 0   | funk

-- Wie oft kommt jeder Tag vor?
SELECT t.value AS tag, COUNT(*) AS anzahl
FROM produkte AS p, json_each(p.tags) AS t
GROUP BY t.value
ORDER BY anzahl DESC, tag;
-- tag  | anzahl
-- funk | 2
-- neu  | 1
`),
        note: "Kein `JSON_TABLE`; `json_each` liefert die Spalten `key`, `value` und `type`, `json_tree` geht rekursiv durch alle Ebenen.",
        mdn: SL + 'json1.html#jeach'
      }
    }
  },
  {
    lang: 'sql', group: 'JSON', name: 'JSON erzeugen (json_object)',
    desc: "Baut JSON-Objekte und -Arrays aus Spaltenwerten, etwa für API-Antworten.",
    details: "`JSON_OBJECT` erzeugt ein Objekt aus Schlüssel-Wert-Paaren, `JSON_ARRAY` ein Array; Werte werden korrekt gequotet und escaped. Verschachtelte Aufrufe ergeben verschachteltes JSON. Die Schreibweise der Paare (`'a' VALUE x`, `'a', x` oder `'a': x`) unterscheidet sich je Dialekt. Für JSON aus mehreren Zeilen braucht man eine Aggregatfunktion.",
    tip: "JSON nie per Stringverkettung bauen – Anführungszeichen im Wert zerstören sonst das Dokument.",
    keywords: ['json_object', 'json_build_object', 'json_array', 'json erzeugen', 'json bauen', 'api', 'serialisieren', 'for json'],
    related: ['JSON_AGG() / json_group_array()', 'JSON-Funktionen', 'CONCAT()'],
    mdn: PG + 'functions-json.html#FUNCTIONS-JSON-CREATION-TABLE',
    dialects: {
      std: {
        syntax: "JSON_OBJECT('schluessel1' VALUE wert1 [, …])\nJSON_ARRAY(wert1 [, wert2 …])",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(8,2), kategorie VARCHAR(20));
INSERT INTO produkte VALUES (1, 'Maus', 19.90, 'Zubehör'), (2, 'Monitor "Pro"', 199.00, 'Hardware');

SELECT JSON_OBJECT(
         'id' VALUE id,
         'name' VALUE name,
         'preis' VALUE preis,
         'meta' VALUE JSON_OBJECT('kategorie' VALUE kategorie, 'tags' VALUE JSON_ARRAY('neu', id))
       ) AS json
FROM produkte
ORDER BY id;
-- json
-- {"id": 1, "name": "Maus", "preis": 19.9, "meta": {"kategorie": "Zubehör", "tags": ["neu", 1]}}
-- {"id": 2, "name": "Monitor \\"Pro\\"", "preis": 199.0, "meta": {"kategorie": "Hardware", "tags": ["neu", 2]}}
`)
      },
      pg: { note: "Standardform seit PostgreSQL 16; älter und weiterhin üblich: `json_build_object('a', x)`, `json_build_array(…)` und `row_to_json(zeile)`." },
      mysql: {
        syntax: "JSON_OBJECT('schluessel1', wert1 [, …])\nJSON_ARRAY(wert1 [, wert2 …])",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(8,2), kategorie VARCHAR(20));
INSERT INTO produkte VALUES (1, 'Maus', 19.90, 'Zubehör'), (2, 'Monitor "Pro"', 199.00, 'Hardware');

SELECT JSON_OBJECT(
         'id', id,
         'name', name,
         'preis', preis,
         'meta', JSON_OBJECT('kategorie', kategorie, 'tags', JSON_ARRAY('neu', id))
       ) AS json
FROM produkte
ORDER BY id;
-- json
-- {"id": 1, "meta": {"tags": ["neu", 1], "kategorie": "Zubehör"}, "name": "Maus", "preis": 19.90}
-- {"id": 2, "meta": {"tags": ["neu", 2], "kategorie": "Hardware"}, "name": "Monitor \\"Pro\\"", "preis": 199.00}
`),
        note: "Paare mit Komma statt `VALUE`. MySQL sortiert die Schlüssel (kürzere zuerst) – die Reihenfolge im Ergebnis entspricht nicht der im Aufruf.",
        mdn: MY + 'json-creation-functions.html'
      },
      mssql: {
        syntax: "JSON_OBJECT('schluessel1': wert1 [, …])   -- seit 2022\nSELECT … FOR JSON PATH                    -- Zeilen als JSON",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), preis DECIMAL(8,2), kategorie NVARCHAR(20));
INSERT INTO produkte VALUES (1, N'Maus', 19.90, N'Zubehör'), (2, N'Monitor "Pro"', 199.00, N'Hardware');

SELECT JSON_OBJECT(
         'id': id,
         'name': name,
         'preis': preis,
         'meta': JSON_OBJECT('kategorie': kategorie, 'tags': JSON_ARRAY('neu', id))
       ) AS json
FROM produkte
ORDER BY id;
-- json
-- {"id":1,"name":"Maus","preis":19.90,"meta":{"kategorie":"Zubehör","tags":["neu",1]}}
-- {"id":2,"name":"Monitor \\"Pro\\"","preis":199.00,"meta":{"kategorie":"Hardware","tags":["neu",2]}}
`),
        note: "`JSON_OBJECT` mit `'a': x` und `JSON_ARRAY` seit SQL Server 2022; davor `FOR JSON PATH`, das ganze Abfrageergebnisse als JSON ausgibt.",
        mdn: MS + 'json-object-transact-sql'
      },
      sqlite: {
        syntax: "json_object('schluessel1', wert1 [, …])\njson_array(wert1 [, wert2 …])",
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, preis REAL, kategorie TEXT);
INSERT INTO produkte VALUES (1, 'Maus', 19.9, 'Zubehör'), (2, 'Monitor "Pro"', 199.0, 'Hardware');

SELECT json_object(
         'id', id,
         'name', name,
         'preis', preis,
         'meta', json_object('kategorie', kategorie, 'tags', json_array('neu', id))
       ) AS json
FROM produkte
ORDER BY id;
-- json
-- {"id":1,"name":"Maus","preis":19.9,"meta":{"kategorie":"Zubehör","tags":["neu",1]}}
-- {"id":2,"name":"Monitor \\"Pro\\"","preis":199.0,"meta":{"kategorie":"Hardware","tags":["neu",2]}}
`),
        note: "Paare mit Komma; das Ergebnis ist JSON-Text ohne Leerzeichen.",
        mdn: SL + 'json1.html#jobj'
      }
    }
  },
  {
    lang: 'sql', group: 'JSON', name: 'JSON_AGG() / json_group_array()',
    desc: "Aggregatfunktion, die die Werte einer Gruppe zu einem JSON-Array zusammenfasst.",
    details: "Damit entstehen verschachtelte Ergebnisse wie „Kunde mit Liste seiner Bestellungen“ in einer einzigen Abfrage. Standard-SQL nennt die Funktion `JSON_ARRAYAGG` (für Objekte `JSON_OBJECTAGG`), die Dialekte haben teils eigene Namen. Die Reihenfolge der Elemente ist ohne `ORDER BY` im Aggregat nicht festgelegt.",
    tip: "Kunden ohne Bestellung fehlen beim `JOIN`; mit `LEFT JOIN` erscheinen sie, dann aber je nach Dialekt mit einem Array aus `null`-Werten – abfangen mit `FILTER (WHERE b.id IS NOT NULL)` oder `CASE`.",
    keywords: ['json_agg', 'jsonb_agg', 'json_group_array', 'json_arrayagg', 'json array aggregieren', 'verschachtelt', 'nested result', 'for json'],
    related: ['JSON erzeugen (json_object)', 'STRING_AGG() / GROUP_CONCAT()', 'GROUP BY', 'FILTER (Aggregat)'],
    mdn: PG + 'functions-aggregate.html',
    dialects: {
      std: {
        syntax: "JSON_ARRAYAGG(wert [ORDER BY …])\nJSON_OBJECTAGG(schluessel VALUE wert)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag INT);
INSERT INTO kunden VALUES (1, 'Ada'), (2, 'Lin');
INSERT INTO bestellungen VALUES (10, 1, 50), (11, 2, 20), (12, 1, 30);

SELECT k.name,
       JSON_ARRAYAGG(JSON_OBJECT('id' VALUE b.id, 'betrag' VALUE b.betrag) ORDER BY b.id) AS bestellungen
FROM kunden AS k
JOIN bestellungen AS b ON b.kunde_id = k.id
GROUP BY k.id, k.name
ORDER BY k.id;
-- name | bestellungen
-- Ada  | [{"id": 10, "betrag": 50}, {"id": 12, "betrag": 30}]
-- Lin  | [{"id": 11, "betrag": 20}]
`)
      },
      pg: { note: "`JSON_ARRAYAGG` seit PostgreSQL 16; älter und weiterhin üblich: `json_agg(x ORDER BY y)` bzw. `jsonb_agg`, für Objekte `json_object_agg`." },
      mysql: {
        syntax: "JSON_ARRAYAGG(wert)\nJSON_OBJECTAGG(schluessel, wert)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag INT);
INSERT INTO kunden VALUES (1, 'Ada'), (2, 'Lin');
INSERT INTO bestellungen VALUES (10, 1, 50), (11, 2, 20), (12, 1, 30);

-- Kein ORDER BY im Aggregat: Reihenfolge der Elemente nicht garantiert
SELECT k.name,
       JSON_ARRAYAGG(JSON_OBJECT('id', b.id, 'betrag', b.betrag)) AS bestellungen
FROM kunden AS k
JOIN bestellungen AS b ON b.kunde_id = k.id
GROUP BY k.id, k.name
ORDER BY k.id;
-- z. B. Ada: [{"id": 10, "betrag": 50}, {"id": 12, "betrag": 30}]

SELECT k.name, JSON_OBJECTAGG(b.id, b.betrag) AS betraege
FROM kunden AS k
JOIN bestellungen AS b ON b.kunde_id = k.id
GROUP BY k.id, k.name
ORDER BY k.id;
-- name | betraege
-- Ada  | {"10": 50, "12": 30}
-- Lin  | {"11": 20}
`),
        note: "`JSON_ARRAYAGG` kennt kein `ORDER BY`; die Reihenfolge ist daher nicht garantiert.",
        mdn: MY + 'aggregate-functions.html#function_json-arrayagg'
      },
      mssql: {
        syntax: "(SELECT … FOR JSON PATH)   -- Unterabfrage als JSON-Array",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag INT);
INSERT INTO kunden VALUES (1, N'Ada'), (2, N'Lin');
INSERT INTO bestellungen VALUES (10, 1, 50), (11, 2, 20), (12, 1, 30);

SELECT k.name,
       (SELECT b.id, b.betrag
        FROM bestellungen AS b
        WHERE b.kunde_id = k.id
        ORDER BY b.id
        FOR JSON PATH) AS bestellungen
FROM kunden AS k
ORDER BY k.id;
-- name | bestellungen
-- Ada  | [{"id":10,"betrag":50},{"id":12,"betrag":30}]
-- Lin  | [{"id":11,"betrag":20}]
`),
        note: "`JSON_ARRAYAGG` erst ab SQL Server 2025; bis 2022 baut eine Unterabfrage mit `FOR JSON PATH` das Array.",
        mdn: MST + 'queries/select-for-clause-transact-sql'
      },
      sqlite: {
        syntax: "json_group_array(wert [ORDER BY …])\njson_group_object(schluessel, wert)",
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag INTEGER);
INSERT INTO kunden VALUES (1, 'Ada'), (2, 'Lin');
INSERT INTO bestellungen VALUES (10, 1, 50), (11, 2, 20), (12, 1, 30);

SELECT k.name,
       json_group_array(json_object('id', b.id, 'betrag', b.betrag) ORDER BY b.id) AS bestellungen
FROM kunden AS k
JOIN bestellungen AS b ON b.kunde_id = k.id
GROUP BY k.id, k.name
ORDER BY k.id;
-- name | bestellungen
-- Ada  | [{"id":10,"betrag":50},{"id":12,"betrag":30}]
-- Lin  | [{"id":11,"betrag":20}]
`),
        note: "Heißt `json_group_array`; `ORDER BY` im Aggregat seit 3.44.",
        mdn: SL + 'json1.html#jgrouparray'
      }
    }
  },
  {
    lang: 'sql', group: 'JSON', name: 'JSONB (PostgreSQL)',
    desc: "Binäres JSON in PostgreSQL: schnell abfragbar, indizierbar, mit eigenen Operatoren.",
    details: "`jsonb` speichert JSON vorverarbeitet: Leerzeichen und Schlüsselreihenfolge gehen verloren, doppelte Schlüssel werden zusammengeführt, dafür sind Abfragen schneller und ein GIN-Index ist möglich. Operatoren wie `@>` (enthält), `?` (Schlüssel vorhanden), `||` (zusammenführen) und `-` (Schlüssel entfernen) gibt es nur für `jsonb`. Der Typ `json` behält den Originaltext und ist nur sinnvoll, wenn genau dieser gebraucht wird.",
    values: [
      ['@> / <@', 'enthält / ist enthalten in'],
      ['? / ?| / ?&', 'Schlüssel vorhanden / einer davon / alle'],
      ['|| / -', 'zusammenführen / Schlüssel entfernen'],
      ['jsonb_set(j, pfad, wert)', 'Wert an einem Pfad setzen'],
      ['GIN-Index', 'beschleunigt @>, ? und JSON-Pfadabfragen']
    ],
    tip: "In PostgreSQL fast immer `jsonb` statt `json` wählen; `json` nur, wenn Formatierung und Schlüsselreihenfolge des Originals erhalten bleiben müssen.",
    keywords: ['jsonb', 'json binary', 'gin index', '@>', 'contains', 'postgresql json', 'jsonb_set', 'schlüssel vorhanden'],
    related: ['JSON-Typ', '-> / ->>', 'JSON-Funktionen', 'CREATE INDEX'],
    mdn: PG + 'datatype-json.html',
    dialects: {
      std: { none: "PostgreSQL-Typ; der Standard kennt seit SQL:2023 einen Typ `JSON`, aber keine `jsonb`-Operatoren." },
      pg: {
        syntax: "spalte JSONB\nspalte @> '{\"a\": 1}'      -- enthält\nspalte ? 'a'              -- Schlüssel vorhanden\nspalte || '{\"b\": 2}'      -- zusammenführen",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), attribute JSONB);
INSERT INTO produkte VALUES
  (1, 'Maus',    '{"farbe": "schwarz", "gewicht": 85}'),
  (2, 'Monitor', '{"farbe": "weiß", "gewicht": 4200, "zoll": 27}');
CREATE INDEX produkte_attribute_idx ON produkte USING GIN (attribute);

SELECT name FROM produkte WHERE attribute @> '{"farbe": "schwarz"}';
-- name
-- Maus

SELECT name FROM produkte WHERE attribute ? 'zoll';
-- name
-- Monitor

UPDATE produkte SET attribute = (attribute || '{"neu": true}') - 'gewicht' WHERE id = 1;
SELECT attribute FROM produkte WHERE id = 1;
-- attribute
-- {"neu": true, "farbe": "schwarz"}
`)
      },
      mysql: { none: "Kein `jsonb`, aber der Typ `JSON` wird ebenfalls binär gespeichert; „enthält“ prüft `JSON_CONTAINS(spalte, '{\"farbe\": \"schwarz\"}')`, Schlüssel `JSON_CONTAINS_PATH`. Indizes über generierte Spalten oder Multi-Valued-Indizes." },
      mssql: { none: "Kein `jsonb`; JSON liegt bis 2022 als `NVARCHAR` vor (eigener Typ `json` ab 2025). Indizes über berechnete Spalten mit `JSON_VALUE`." },
      sqlite: { none: "Seit 3.45 gibt es ein binäres JSONB-Format (`jsonb(…)`, `jsonb_*`-Funktionen), aber ohne Operatoren wie `@>` oder `?`." }
    }
  },

  // ---------------- Typumwandlung ----------------
  {
    lang: 'sql', group: 'Typumwandlung', name: 'Implizite Umwandlung',
    desc: "Die Datenbank wandelt Typen bei Vergleichen und Rechnungen teils automatisch um.",
    details: "Wie großzügig eine Datenbank Typen von selbst umwandelt, ist sehr verschieden: Manche vergleichen Text und Zahl ohne Murren (und wandeln dabei in die eine oder andere Richtung um), andere melden einen Fehler. Davon hängt ab, ob `'007'` gleich `7` ist. Implizite Umwandlungen auf einer Spalte können außerdem die Index-Nutzung verhindern.",
    tip: "Explizit mit `CAST` umwandeln, statt sich auf Automatik zu verlassen – der Code verhält sich dann in allen Datenbanken gleich.",
    keywords: ['implizite umwandlung', 'implicit conversion', 'type coercion', 'automatische umwandlung', 'typaffinität', 'typeof', 'text zu zahl'],
    related: ['CAST()', 'Typaffinität (SQLite)', ':: (PostgreSQL-Cast)', 'Sargierbare Bedingungen'],
    mdn: PG + 'typeconv.html',
    dialects: {
      std: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, artikelnr VARCHAR(10), bestand INT);
INSERT INTO produkte VALUES (1, '007', 42), (2, '7', 8);

-- Text mit Zahl vergleichen ist ein Fehler:
-- SELECT id FROM produkte WHERE artikelnr = 7;  → Fehler: operator does not exist: character varying = integer

SELECT id FROM produkte WHERE CAST(artikelnr AS INT) = 7 ORDER BY id;
-- id
-- 1
-- 2

-- Ein Literal ohne Typ wird passend gemacht
SELECT '10' + 5 AS summe;
-- summe
-- 15
`)
      },
      pg: { note: "Streng: Spalten vom Typ Text werden nicht automatisch zu Zahlen. Nur Literale in Anführungszeichen ohne Typ passen sich dem Gegenüber an." },
      mysql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, artikelnr VARCHAR(10), bestand INT);
INSERT INTO produkte VALUES (1, '007', 42), (2, '7', 8);

-- Text gegen Zahl: beide Seiten werden zu Zahlen, '007' = 7
SELECT id FROM produkte WHERE artikelnr = 7 ORDER BY id;
-- id
-- 1
-- 2

-- Text wird bis zum ersten Nicht-Ziffern-Zeichen gelesen (mit Warnung)
SELECT '10' + 5 AS summe, '3 Äpfel' + 1 AS praefix;
-- summe | praefix
-- 15    | 4
`),
        note: "Sehr großzügig: Text wird beim Rechnen und Vergleichen mit Zahlen zur Zahl, unlesbare Reste ergeben nur eine Warnung.",
        mdn: MY + 'type-conversion.html'
      },
      mssql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, artikelnr VARCHAR(10), bestand INT);
INSERT INTO produkte VALUES (1, '007', 42), (2, '7', 8);

-- INT hat Vorrang: artikelnr wird zu INT, '007' = 7
SELECT id FROM produkte WHERE artikelnr = 7 ORDER BY id;
-- id
-- 1
-- 2

SELECT '10' + 5 AS summe;
-- summe
-- 15

-- Nicht umwandelbarer Text ist ein Fehler:
-- SELECT '3 Äpfel' + 1;  → Fehler: Conversion failed when converting the varchar value '3 Äpfel' to data type int.
`),
        note: "Umgewandelt wird nach fester Typ-Priorität (Zahl vor Text); scheitert die Umwandlung einer Zeile, bricht die ganze Abfrage ab.",
        mdn: MST + 'data-types/data-type-precedence-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, artikelnr TEXT, bestand INTEGER);
INSERT INTO produkte VALUES (1, '007', '42'), (2, 7, 8);

-- Typaffinität: '42' wird zur Zahl, 7 in der TEXT-Spalte zu '7'
SELECT id, artikelnr, typeof(artikelnr) AS typ_nr, bestand, typeof(bestand) AS typ_bestand
FROM produkte
ORDER BY id;
-- id | artikelnr | typ_nr | bestand | typ_bestand
-- 1  | 007       | text   | 42      | integer
-- 2  | 7         | text   | 8       | integer

-- Vergleich mit TEXT-Spalte: 7 wird zu '7', nicht '007'
SELECT id FROM produkte WHERE artikelnr = 7;
-- id
-- 2

SELECT '10' + 5 AS summe, '3 Äpfel' + 1 AS praefix;
-- summe | praefix
-- 15    | 4
`),
        note: "Typaffinität: Spalten wandeln eingefügte Werte um, Vergleiche mit einer Spalte richten sich nach deren Affinität. Rechnen mit Text nimmt den Zahlenanfang.",
        mdn: SL + 'datatype3.html'
      }
    }
  },
  {
    lang: 'sql', group: 'Typumwandlung', name: ':: (PostgreSQL-Cast)',
    desc: "PostgreSQL-Kurzschreibweise für CAST: wert::typ.",
    details: "`'42'::int` ist dasselbe wie `CAST('42' AS int)`, nur kürzer, und lässt sich verketten: `'3.7'::numeric::int`. Die Schreibweise ist PostgreSQL-spezifisch (auch in CockroachDB, DuckDB, Redshift), für portablen Code `CAST` verwenden. Häufig gebraucht für Literale wie `'2026-11-16'::date` oder `'{\"a\":1}'::jsonb`. Bei ungültigen Werten gibt es einen Fehler, keinen `NULL`-Wert.",
    tip: "Beim Cast nach `int` rundet PostgreSQL (3.7 → 4), statt abzuschneiden; zum Abschneiden vorher `TRUNC` anwenden.",
    keywords: ['::', 'doppelpunkt cast', 'typecast', 'postgres cast', 'umwandeln', 'konvertieren'],
    related: ['CAST()', 'Implizite Umwandlung', 'TRY_CAST / sichere Umwandlung'],
    mdn: PG + 'sql-expressions.html#SQL-SYNTAX-TYPE-CASTS',
    dialects: {
      std: { none: "Im Standard nur `CAST(ausdruck AS typ)`." },
      pg: {
        syntax: "ausdruck::typ\nCAST(ausdruck AS typ)   -- Standard, gleichwertig",
        example: e(`
CREATE TABLE import (id INT PRIMARY KEY, menge TEXT, datum TEXT);
INSERT INTO import VALUES (1, '42', '2026-11-16'), (2, '8', '2026-12-01');

SELECT SUM(menge::int) AS summe, MIN(datum::date) + 30 AS frist
FROM import;
-- summe | frist
-- 50    | 2026-12-16

SELECT 7::numeric / 2 AS dezimal, '3.7'::numeric::int AS gerundet, 'yes'::boolean AS wahr;
-- dezimal            | gerundet | wahr
-- 3.5000000000000000 | 4        | true
`)
      },
      mysql: { none: "Kein `::`; stattdessen `CAST(x AS SIGNED)` bzw. `CONVERT(x, SIGNED)`." },
      mssql: { none: "Kein `::` (das ist dort der Aufruf statischer Methoden); stattdessen `CAST(x AS INT)` oder `CONVERT(INT, x [, stil])`." },
      sqlite: { none: "Kein `::`; stattdessen `CAST(x AS INTEGER)`." }
    }
  },
  {
    lang: 'sql', group: 'Typumwandlung', name: 'TRY_CAST / sichere Umwandlung',
    desc: "Umwandlung, die bei ungültigen Werten NULL statt eines Fehlers liefert.",
    details: "Bei Importdaten scheitert ein normales `CAST` oft an einzelnen Zeilen und bricht die ganze Abfrage ab. Sichere Varianten liefern dann `NULL` statt eines Fehlers; wo es sie nicht gibt, prüft man die Werte vorher. Manche Datenbanken werfen bei `CAST` gar keinen Fehler, sondern liefern stillschweigend Ersatzwerte wie 0 – das ist noch tückischer.",
    tip: "Beim Import erst in eine Text-Staging-Tabelle laden, fehlerhafte Zeilen aussortieren und dann typisiert übernehmen.",
    keywords: ['try_cast', 'try_convert', 'sichere umwandlung', 'safe cast', 'ungültige werte', 'import', 'validieren', 'pg_input_is_valid'],
    related: ['CAST()', ':: (PostgreSQL-Cast)', 'Implizite Umwandlung'],
    mdn: MS + 'try-cast-transact-sql',
    dialects: {
      std: { none: "Kein `TRY_CAST` im Standard; `CAST` bricht bei ungültigen Werten ab – vorher mit `CASE` und `SIMILAR TO` prüfen." },
      pg: {
        syntax: "pg_input_is_valid(text, 'typ')   -- seit PostgreSQL 16",
        example: e(`
CREATE TABLE import (id INT PRIMARY KEY, menge VARCHAR(20), datum VARCHAR(20));
INSERT INTO import VALUES (1, '42', '2026-11-16'), (2, 'zwölf', '2026-02-30'), (3, ' 7 ', NULL);

SELECT id,
       CASE WHEN pg_input_is_valid(menge, 'integer') THEN CAST(menge AS INT) END AS menge,
       CASE WHEN pg_input_is_valid(datum, 'date') THEN CAST(datum AS DATE) END   AS datum
FROM import
ORDER BY id;
-- id | menge | datum
-- 1  | 42    | 2026-11-16
-- 2  | NULL  | NULL
-- 3  | 7     | NULL

-- Fehlerhafte Zeilen finden
SELECT id, menge FROM import WHERE NOT pg_input_is_valid(menge, 'integer');
-- id | menge
-- 2  | zwölf
`),
        note: "Kein `TRY_CAST`; `pg_input_is_valid` gibt es seit Version 16, davor hilft nur ein Regex-Test (`menge ~ '^\\s*\\d+\\s*$'`)."
      },
      mysql: {
        example: e(`
CREATE TABLE import (id INT PRIMARY KEY, menge VARCHAR(20), datum VARCHAR(20));
INSERT INTO import VALUES (1, '42', '2026-11-16'), (2, 'zwölf', '2026-02-30'), (3, ' 7 ', NULL);

-- CAST liefert Ersatzwerte mit Warnung: 'zwölf' wird 0, ungültiges Datum NULL
SELECT id, CAST(menge AS SIGNED) AS menge, CAST(datum AS DATE) AS datum
FROM import
ORDER BY id;
-- id | menge | datum
-- 1  | 42    | 2026-11-16
-- 2  | 0     | NULL
-- 3  | 7     | NULL

-- Fehlerhafte Zeilen finden
SELECT id, menge FROM import WHERE menge NOT REGEXP '^ *[0-9]+ *$';
-- id | menge
-- 2  | zwölf
`),
        note: "Kein `TRY_CAST`, aber `CAST` bricht in Abfragen nicht ab: Ungültiges wird mit Warnung zu 0 bzw. `NULL` – daher vorher prüfen.",
        mdn: MY + 'cast-functions.html'
      },
      mssql: {
        syntax: "TRY_CAST(ausdruck AS typ)\nTRY_CONVERT(typ, ausdruck [, stil])",
        example: e(`
CREATE TABLE import (id INT PRIMARY KEY, menge VARCHAR(20), datum VARCHAR(20));
INSERT INTO import VALUES (1, '42', '2026-11-16'), (2, 'zwölf', '2026-02-30'), (3, ' 7 ', NULL);

SELECT id,
       TRY_CAST(menge AS INT)  AS menge,
       TRY_CAST(datum AS DATE) AS datum
FROM import
ORDER BY id;
-- id | menge | datum
-- 1  | 42    | 2026-11-16
-- 2  | NULL  | NULL
-- 3  | 7     | NULL

-- Fehlerhafte Zeilen finden
SELECT id, menge FROM import WHERE TRY_CAST(menge AS INT) IS NULL AND menge IS NOT NULL;
-- id | menge
-- 2  | zwölf
`),
        note: "`TRY_CAST`, `TRY_CONVERT` und `TRY_PARSE` gibt es seit SQL Server 2012.",
        mdn: MS + 'try-cast-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE import (id INTEGER PRIMARY KEY, menge TEXT, datum TEXT);
INSERT INTO import VALUES (1, '42', '2026-11-16'), (2, 'zwölf', '2026-02-30'), (3, ' 7 ', NULL);

-- CAST liefert ohne Fehler 0 für Unlesbares; Prüfung per GLOB
SELECT id, CAST(menge AS INTEGER) AS menge,
       TRIM(menge) GLOB '[0-9]*' AND TRIM(menge) NOT GLOB '*[^0-9]*' AS gueltig
FROM import
ORDER BY id;
-- id | menge | gueltig
-- 1  | 42    | 1
-- 2  | 0     | 0
-- 3  | 7     | 1
`),
        note: "Kein `TRY_CAST`; `CAST` liefert nie einen Fehler, sondern den lesbaren Zahlenanfang oder 0. Datumswerte sind Text – `date()` liefert `NULL` für Unlesbares.",
        mdn: SL + 'lang_expr.html#castexpr'
      }
    }
  }
  );
})();
