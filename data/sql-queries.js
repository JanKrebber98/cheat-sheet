window.CHEAT = window.CHEAT || [];
(function () {
  var PG = 'https://www.postgresql.org/docs/current/'; // + z. B. 'queries-with.html'
  var SL = 'https://sqlite.org/';                      // + z. B. 'lang_select.html'
  var MY = 'https://dev.mysql.com/doc/refman/8.4/en/';
  var MS = 'https://learn.microsoft.com/en-us/sql/t-sql/';
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Aggregatfunktionen ----------------
  {
    lang: 'sql', group: 'Aggregatfunktionen', name: 'COUNT()',
    desc: "Zählt Zeilen (COUNT(*)) oder Nicht-NULL-Werte einer Spalte (COUNT(spalte)).",
    details: "`COUNT(*)` zählt alle Zeilen der Gruppe, auch solche, die nur aus NULL bestehen. `COUNT(spalte)` zählt nur Zeilen, in denen die Spalte nicht NULL ist – ein häufiger Grund für „falsche“ Zahlen. Auf einer leeren Menge liefert `COUNT` als einzige Aggregatfunktion `0` statt NULL. `COUNT(1)` ist gleichwertig zu `COUNT(*)`, nicht schneller.",
    values: [
      ['COUNT(*)', 'Alle Zeilen'],
      ['COUNT(spalte)', 'Zeilen mit spalte IS NOT NULL'],
      ['COUNT(DISTINCT spalte)', 'Verschiedene Nicht-NULL-Werte']
    ],
    dialects: {
      std: {
        syntax: "COUNT(*)\nCOUNT(ausdruck)\nCOUNT(DISTINCT ausdruck)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', NULL),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT COUNT(*) AS zeilen, COUNT(gehalt) AS mit_gehalt FROM mitarbeiter;
-- zeilen | mit_gehalt
-- 5      | 4
`)
      },
      pg: { note: "`COUNT` liefert den Typ `bigint`." },
      mssql: { note: "`COUNT` liefert `INT` und meldet ab 2³¹ Zeilen einen Überlauf; für sehr große Tabellen `COUNT_BIG(*)` verwenden.", mdn: MS + 'functions/count-big-transact-sql' }
    },
    tip: "Für „Gibt es mindestens eine Zeile?“ ist `EXISTS` meist schneller als `COUNT(*) > 0`, weil die Suche beim ersten Treffer stoppt.",
    keywords: ['zählen', 'anzahl', 'count', 'count(*)', 'zeilen zählen', 'aggregat', 'count_big'],
    related: ['COUNT(DISTINCT)', 'Aggregate & NULL', 'GROUP BY', 'EXISTS'],
    mdn: PG + 'functions-aggregate.html'
  },
  {
    lang: 'sql', group: 'Aggregatfunktionen', name: 'SUM()',
    desc: "Summiert die Nicht-NULL-Werte eines numerischen Ausdrucks.",
    details: "NULL-Werte werden übersprungen. Enthält die Menge keine Zeile (oder nur NULL), ist das Ergebnis NULL, nicht 0 – deshalb oft `COALESCE(SUM(x), 0)`. Welchen Typ das Ergebnis hat und ob große Summen überlaufen können, hängt vom Dialekt ab.",
    dialects: {
      std: {
        syntax: "SUM([DISTINCT] ausdruck)",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 1, 120.50, '2026-01-10'), (2, 1, 80, '2026-02-03'),
  (3, 2, 200, '2026-02-15'), (4, 3, 45.25, '2026-03-01');

SELECT SUM(betrag) AS umsatz FROM bestellungen;
-- umsatz
-- 445.75

SELECT SUM(betrag) AS leer, COALESCE(SUM(betrag), 0) AS null_sicher
FROM bestellungen WHERE kunde_id = 99;
-- leer | null_sicher
-- NULL | 0
`)
      },
      pg: { note: "Für `integer` liefert `SUM` ein `bigint`, für `bigint` und `numeric` ein `numeric` – ein Überlauf ist praktisch ausgeschlossen." },
      mysql: { note: "Für Ganzzahl- und `DECIMAL`-Spalten liefert `SUM` ein `DECIMAL`, für `FLOAT`/`DOUBLE` ein `DOUBLE`." },
      mssql: { note: "Der Ergebnistyp folgt der Spalte: `SUM` über `INT` ist `INT` und kann überlaufen – dann `SUM(CAST(x AS BIGINT))` schreiben.", mdn: MS + 'functions/sum-transact-sql' },
      sqlite: { note: "Ganzzahlen werden exakt summiert; bei Überlauf meldet `SUM` einen Fehler. `TOTAL(x)` liefert stattdessen immer eine Gleitkommazahl und für leere Mengen 0.0.", mdn: SL + 'lang_aggfunc.html' }
    },
    tip: "Geldbeträge in `NUMERIC`/`DECIMAL` oder als ganze Cent speichern; `REAL`/`FLOAT` summiert Rundungsfehler auf.",
    keywords: ['summe', 'addieren', 'total', 'sum', 'aufsummieren'],
    related: ['AVG()', 'Aggregate & NULL', 'COALESCE()', 'Laufende Summe'],
    mdn: PG + 'functions-aggregate.html'
  },
  {
    lang: 'sql', group: 'Aggregatfunktionen', name: 'AVG()',
    desc: "Berechnet den arithmetischen Mittelwert der Nicht-NULL-Werte.",
    details: "NULL-Zeilen zählen weder im Zähler noch im Nenner mit; sollen sie als 0 gelten, vorher `COALESCE(spalte, 0)` anwenden. Der Ergebnistyp unterscheidet sich je Dialekt – bei Ganzzahlspalten kann das Ergebnis sogar abgeschnitten werden. Zum Anzeigen meist mit `ROUND()` kombinieren.",
    dialects: {
      std: {
        syntax: "AVG([DISTINCT] ausdruck)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 5200), (2, 'Ben', 4100), (3, 'Cem', NULL), (4, 'Dana', 4450);

SELECT ROUND(AVG(gehalt), 2)      AS schnitt,
       AVG(COALESCE(gehalt, 0))   AS null_als_0
FROM mitarbeiter;
-- schnitt | null_als_0
-- 4583.33 | 3437.5
`)
      },
      pg: { note: "`AVG` über Ganzzahlen und `numeric` liefert `numeric`, über `real`/`double precision` ein `double precision`." },
      mysql: { note: "`AVG` über Ganzzahlen und `DECIMAL` liefert `DECIMAL` (mit 4 zusätzlichen Nachkommastellen), über `FLOAT`/`DOUBLE` ein `DOUBLE`." },
      mssql: {
        syntax: "AVG(CAST(ausdruck AS DECIMAL(p, s)))",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 5200), (2, 'Ben', 4100), (3, 'Cem', NULL), (4, 'Dana', 4450);

-- AVG über INT bleibt INT: 4583.33 wird zu 4583
SELECT AVG(gehalt) AS abgeschnitten,
       ROUND(AVG(CAST(gehalt AS DECIMAL(10,2))), 2)    AS schnitt,
       AVG(COALESCE(CAST(gehalt AS DECIMAL(10,2)), 0)) AS null_als_0
FROM mitarbeiter;
-- abgeschnitten | schnitt | null_als_0
-- 4583          | 4583.33 | 3437.5
`),
        note: "Der Ergebnistyp entspricht dem Spaltentyp: `AVG` über `INT` ist ganzzahlig und schneidet ab. Vorher nach `DECIMAL` casten.",
        mdn: MS + 'functions/avg-transact-sql'
      },
      sqlite: { note: "`AVG` liefert immer eine Gleitkommazahl (`REAL`), auch bei Ganzzahlspalten.", mdn: SL + 'lang_aggfunc.html' }
    },
    tip: "Bei Ganzzahlspalten das Ergebnis in jedem Dialekt prüfen – ein abgeschnittener Durchschnitt fällt in Berichten selten sofort auf.",
    keywords: ['durchschnitt', 'mittelwert', 'average', 'mean', 'avg', 'schnitt'],
    related: ['SUM()', 'Aggregate & NULL', 'ROUND()', 'Gleitender Durchschnitt'],
    mdn: PG + 'functions-aggregate.html'
  },
  {
    lang: 'sql', group: 'Aggregatfunktionen', name: 'MIN() / MAX()',
    desc: "Liefern den kleinsten bzw. größten Nicht-NULL-Wert, auch für Texte und Datumswerte.",
    details: "Funktioniert für alle sortierbaren Typen: Zahlen, Zeichenketten (nach Collation), Datum und Zeit. NULL wird ignoriert, eine leere Menge ergibt NULL. Die Funktion liefert nur den Wert – die zugehörige Zeile bekommt man über eine Unterabfrage, `ORDER BY … FETCH FIRST 1 ROW ONLY` oder Fensterfunktionen.",
    dialects: {
      std: {
        syntax: "MIN(ausdruck)\nMAX(ausdruck)",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2), kategorie VARCHAR(50));
INSERT INTO produkte VALUES
  (1, 'Maus', 19.9, 'Zubehör'), (2, 'Monitor', 189, 'Hardware'),
  (3, 'Tastatur', 49.5, 'Zubehör'), (4, 'Laptop', 899, 'Hardware'), (5, 'Kabel', 4.99, 'Zubehör');

SELECT MIN(preis) AS guenstigster, MAX(preis) AS teuerster, MIN(name) AS erster_name
FROM produkte;
-- guenstigster | teuerster | erster_name
-- 4.99         | 899       | Kabel

-- Ganze Zeile zum Maximum
SELECT name, preis FROM produkte WHERE preis = (SELECT MAX(preis) FROM produkte);
-- name   | preis
-- Laptop | 899
`)
      },
      mysql: { note: "Mit dem voreingestellten `ONLY_FULL_GROUP_BY` ist `SELECT name, MAX(preis) FROM produkte` ein Fehler; ohne diesen Modus liefert MySQL einen beliebigen Namen." },
      sqlite: { note: "`MIN(a, b)` und `MAX(a, b)` mit mehreren Argumenten sind skalare Funktionen (wie `LEAST`/`GREATEST`). `SELECT name, MAX(preis) FROM produkte` ist erlaubt und liefert den Namen der Zeile mit dem Maximum.", mdn: SL + 'lang_aggfunc.html' }
    },
    tip: "`SELECT name, MAX(preis) FROM produkte` ohne `GROUP BY` ist im Standard ein Fehler – für die zugehörige Zeile eine Unterabfrage verwenden.",
    keywords: ['minimum', 'maximum', 'kleinster', 'größter', 'min', 'max', 'höchster wert', 'niedrigster wert'],
    related: ['Skalare Unterabfrage', 'GREATEST() / LEAST()', 'Top-N pro Gruppe', 'FIRST_VALUE() / LAST_VALUE()'],
    mdn: PG + 'functions-aggregate.html'
  },
  {
    lang: 'sql', group: 'Aggregatfunktionen', name: 'COUNT(DISTINCT)',
    desc: "Zählt die verschiedenen Nicht-NULL-Werte eines Ausdrucks.",
    details: "Doppelte Werte werden vor dem Zählen entfernt, NULL zählt nicht mit. `DISTINCT` ist auch bei `SUM` und `AVG` erlaubt, dort aber selten sinnvoll. Kombinationen mehrerer Spalten zählt man portabel über eine Unterabfrage mit `SELECT DISTINCT a, b`. Auf großen Tabellen ist es teuer, weil sortiert oder gehasht werden muss.",
    dialects: {
      std: {
        syntax: "COUNT(DISTINCT ausdruck)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT COUNT(abteilung) AS alle, COUNT(DISTINCT abteilung) AS verschiedene
FROM mitarbeiter;
-- alle | verschiedene
-- 5    | 3

-- Kombinationen mehrerer Spalten portabel zählen
SELECT COUNT(*) AS paare
FROM (SELECT DISTINCT abteilung, CASE WHEN gehalt > 4000 THEN 1 ELSE 0 END AS hoch
      FROM mitarbeiter) AS t;
-- paare
-- 4
`)
      },
      mysql: {
        syntax: "COUNT(DISTINCT ausdruck [, ausdruck …])",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT COUNT(abteilung) AS alle, COUNT(DISTINCT abteilung) AS verschiedene
FROM mitarbeiter;
-- alle | verschiedene
-- 5    | 3

-- MySQL kann mehrere Ausdrücke direkt zählen
SELECT COUNT(DISTINCT abteilung, gehalt > 4000) AS paare FROM mitarbeiter;
-- paare
-- 4
`),
        note: "Nur MySQL erlaubt mehrere Ausdrücke in `COUNT(DISTINCT …)`; Zeilen, in denen einer davon NULL ist, zählen nicht mit."
      },
      mssql: { note: "Für Dashboards über riesige Tabellen liefert `APPROX_COUNT_DISTINCT(spalte)` (ab 2019) schnell eine Näherung.", mdn: MS + 'functions/approx-count-distinct-transact-sql' }
    },
    tip: "`COUNT(DISTINCT …)` über Millionen Zeilen ist teuer – für grobe Kennzahlen reicht oft eine Näherung.",
    keywords: ['eindeutig zählen', 'unique count', 'distinct count', 'verschiedene werte', 'anzahl unterschiedlicher', 'approx_count_distinct'],
    related: ['COUNT()', 'DISTINCT', 'GROUP BY'],
    mdn: PG + 'functions-aggregate.html'
  },
  {
    lang: 'sql', group: 'Aggregatfunktionen', name: 'STRING_AGG() / GROUP_CONCAT()',
    desc: "Verkettet die Werte einer Gruppe zu einem Text mit Trennzeichen.",
    details: "Der ISO-Standard (SQL:2016) nennt die Funktion `LISTAGG`; die Dialekte haben eigene Namen und Schreibweisen für die Sortierung (siehe Tabs). Ohne Sortierangabe ist die Reihenfolge zufällig. NULL-Werte werden übersprungen, eine leere Gruppe ergibt NULL.",
    dialects: {
      std: {
        syntax: "LISTAGG(ausdruck, trenner) WITHIN GROUP (ORDER BY …)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ben', 'IT', 4100), (2, 'Ada', 'IT', 5200), (3, 'Dana', 'Vertrieb', 4500),
  (4, 'Cem', 'Vertrieb', 3900), (5, 'Eva', 'HR', 3600);

SELECT abteilung, LISTAGG(name, ', ') WITHIN GROUP (ORDER BY name) AS namen
FROM mitarbeiter
GROUP BY abteilung
ORDER BY abteilung;
-- abteilung | namen
-- HR        | Eva
-- IT        | Ada, Ben
-- Vertrieb  | Cem, Dana
`),
        note: "`LISTAGG` kennen Oracle und Db2; PostgreSQL, MySQL, SQL Server und SQLite nicht.",
        nocheck: true
      },
      pg: {
        syntax: "STRING_AGG(ausdruck, trenner [ORDER BY …])",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ben', 'IT', 4100), (2, 'Ada', 'IT', 5200), (3, 'Dana', 'Vertrieb', 4500),
  (4, 'Cem', 'Vertrieb', 3900), (5, 'Eva', 'HR', 3600);

SELECT abteilung, STRING_AGG(name, ', ' ORDER BY name) AS namen
FROM mitarbeiter
GROUP BY abteilung
ORDER BY abteilung;
-- abteilung | namen
-- HR        | Eva
-- IT        | Ada, Ben
-- Vertrieb  | Cem, Dana
`),
        note: "Das `ORDER BY` steht innerhalb der Klammern. `ARRAY_AGG` sammelt die Werte stattdessen in einem Array."
      },
      mysql: {
        syntax: "GROUP_CONCAT([DISTINCT] ausdruck [ORDER BY …] [SEPARATOR trenner])",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ben', 'IT', 4100), (2, 'Ada', 'IT', 5200), (3, 'Dana', 'Vertrieb', 4500),
  (4, 'Cem', 'Vertrieb', 3900), (5, 'Eva', 'HR', 3600);

SELECT abteilung, GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') AS namen
FROM mitarbeiter
GROUP BY abteilung
ORDER BY abteilung;
-- abteilung | namen
-- HR        | Eva
-- IT        | Ada, Ben
-- Vertrieb  | Cem, Dana
`),
        note: "Ohne `SEPARATOR` wird mit Komma ohne Leerzeichen getrennt. Das Ergebnis wird nach `group_concat_max_len` (Standard 1024 Zeichen) still abgeschnitten.",
        mdn: MY + 'aggregate-functions.html'
      },
      mssql: {
        syntax: "STRING_AGG(ausdruck, trenner) [WITHIN GROUP (ORDER BY …)]",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ben', 'IT', 4100), (2, 'Ada', 'IT', 5200), (3, 'Dana', 'Vertrieb', 4500),
  (4, 'Cem', 'Vertrieb', 3900), (5, 'Eva', 'HR', 3600);

SELECT abteilung, STRING_AGG(name, ', ') WITHIN GROUP (ORDER BY name) AS namen
FROM mitarbeiter
GROUP BY abteilung
ORDER BY abteilung;
-- abteilung | namen
-- HR        | Eva
-- IT        | Ada, Ben
-- Vertrieb  | Cem, Dana
`),
        note: "Seit SQL Server 2017; die Sortierung steht wie beim Standard in `WITHIN GROUP`. Über 8000 Byte hinaus nur mit `CAST(name AS VARCHAR(MAX))`.",
        mdn: MS + 'functions/string-agg-transact-sql'
      },
      sqlite: {
        syntax: "STRING_AGG(ausdruck, trenner [ORDER BY …])\nGROUP_CONCAT(ausdruck [, trenner])",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ben', 'IT', 4100), (2, 'Ada', 'IT', 5200), (3, 'Dana', 'Vertrieb', 4500),
  (4, 'Cem', 'Vertrieb', 3900), (5, 'Eva', 'HR', 3600);

SELECT abteilung, STRING_AGG(name, ', ' ORDER BY name) AS namen
FROM mitarbeiter
GROUP BY abteilung
ORDER BY abteilung;
-- abteilung | namen
-- HR        | Eva
-- IT        | Ada, Ben
-- Vertrieb  | Cem, Dana
`),
        note: "`STRING_AGG` und `ORDER BY` im Aggregat gibt es seit 3.44; ältere Versionen kennen nur `GROUP_CONCAT(name, ', ')` ohne Sortierung.",
        mdn: SL + 'lang_aggfunc.html'
      }
    },
    tip: "Immer eine Sortierung angeben – sonst kann sich die Reihenfolge der Namen von Lauf zu Lauf ändern.",
    keywords: ['verketten', 'liste', 'komma getrennt', 'concat', 'group_concat', 'listagg', 'string aggregieren', 'string_agg'],
    related: ['GROUP BY', '|| (Verkettung)', 'CONCAT()'],
    mdn: PG + 'functions-aggregate.html'
  },
  {
    lang: 'sql', group: 'Aggregatfunktionen', name: 'FILTER (Aggregat)',
    desc: "Beschränkt ein einzelnes Aggregat auf Zeilen, die eine Bedingung erfüllen.",
    details: "Mit `FILTER (WHERE …)` hinter einer Aggregatfunktion lassen sich mehrere bedingte Kennzahlen in einer Abfrage berechnen, ohne die Zeilen für alle anderen Aggregate zu filtern. Überall funktioniert die gleichwertige Schreibweise mit `CASE`: `SUM(CASE WHEN bedingung THEN x END)` bzw. `COUNT(CASE WHEN … THEN 1 END)`. `FILTER` geht auch bei Fensterfunktionen mit Aggregat.",
    dialects: {
      std: {
        syntax: "aggregat(…) FILTER (WHERE bedingung)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT COUNT(*)                                    AS alle,
       COUNT(*) FILTER (WHERE gehalt >= 4500)      AS ab_4500,
       SUM(gehalt) FILTER (WHERE abteilung = 'IT') AS summe_it,
       SUM(CASE WHEN abteilung = 'IT' THEN gehalt END) AS summe_it_portabel
FROM mitarbeiter;
-- alle | ab_4500 | summe_it | summe_it_portabel
-- 5    | 2       | 9300     | 9300
`)
      },
      sqlite: { note: "`FILTER` bei Aggregaten gibt es seit SQLite 3.30." },
      mysql: {
        syntax: "aggregat(CASE WHEN bedingung THEN ausdruck END)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT COUNT(*)                                         AS alle,
       COUNT(CASE WHEN gehalt >= 4500 THEN 1 END)       AS ab_4500,
       SUM(CASE WHEN abteilung = 'IT' THEN gehalt END)  AS summe_it
FROM mitarbeiter;
-- alle | ab_4500 | summe_it
-- 5    | 2       | 9300
`),
        note: "Kein `FILTER`; stattdessen `CASE` im Aggregat. Kurzform: `SUM(gehalt >= 4500)` zählt, weil Vergleiche 1 oder 0 liefern."
      },
      mssql: {
        syntax: "aggregat(CASE WHEN bedingung THEN ausdruck END)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT COUNT(*)                                         AS alle,
       COUNT(CASE WHEN gehalt >= 4500 THEN 1 END)       AS ab_4500,
       SUM(CASE WHEN abteilung = 'IT' THEN gehalt END)  AS summe_it
FROM mitarbeiter;
-- alle | ab_4500 | summe_it
-- 5    | 2       | 9300
`),
        note: "Kein `FILTER`; stattdessen `CASE` im Aggregat. Für echte Kreuztabellen gibt es zusätzlich `PIVOT`."
      }
    },
    tip: "So entstehen Pivot-Tabellen: eine Spalte pro Kategorie, jeweils mit eigenem `FILTER` oder `CASE`.",
    keywords: ['bedingtes aggregat', 'conditional aggregation', 'pivot', 'filter where', 'count if', 'sum if'],
    related: ['CASE', 'COUNT()', 'SUM()', 'GROUP BY'],
    mdn: PG + 'functions-aggregate.html'
  },
  {
    lang: 'sql', group: 'Aggregatfunktionen', name: 'Aggregate & NULL',
    desc: "Aggregatfunktionen ignorieren NULL; auf leeren Mengen liefern sie NULL (außer COUNT).",
    details: "`SUM`, `AVG`, `MIN`, `MAX` und `COUNT(spalte)` überspringen NULL-Werte stillschweigend; nur `COUNT(*)` zählt jede Zeile. Hat die Menge keine Zeilen oder nur NULL, ist das Ergebnis NULL – `COUNT` liefert 0. Dadurch ist `AVG(x)` nicht dasselbe wie `SUM(x) / COUNT(*)`. NULL als Gruppierungswert bildet bei `GROUP BY` eine eigene Gruppe.",
    dialects: {
      std: {
        syntax: "COALESCE(SUM(x), 0)\nAVG(COALESCE(x, 0))",
        example: e(`
CREATE TABLE werte (id INT PRIMARY KEY, x INT);
INSERT INTO werte VALUES (1, 10), (2, NULL), (3, 20), (4, NULL);

SELECT COUNT(*) AS zeilen, COUNT(x) AS nicht_null, SUM(x) AS summe,
       AVG(x) AS schnitt, SUM(x) * 1.0 / COUNT(*) AS schnitt_alle
FROM werte;
-- zeilen | nicht_null | summe | schnitt | schnitt_alle
-- 4      | 2          | 30    | 15.0    | 7.5

-- Leere Menge
SELECT COUNT(x) AS anzahl, SUM(x) AS summe, MAX(x) AS maximum FROM werte WHERE x > 100;
-- anzahl | summe | maximum
-- 0      | NULL  | NULL
`)
      },
      mssql: { note: "Beim Überspringen von NULL meldet SQL Server die Warnung „Null value is eliminated by an aggregate“ – kein Fehler, das Ergebnis stimmt." }
    },
    tip: "Ein Aggregat ohne `GROUP BY` liefert immer genau eine Zeile – auch wenn `WHERE` alles herausfiltert.",
    keywords: ['null', 'leere menge', 'aggregat null', 'null ignorieren', 'null summe', 'null zählen'],
    related: ['NULL in Aggregaten', 'COUNT()', 'COALESCE()', 'NULL'],
    mdn: PG + 'functions-aggregate.html'
  },

  // ---------------- Gruppierung ----------------
  {
    lang: 'sql', group: 'Gruppierung', name: 'GROUP BY',
    desc: "Fasst Zeilen mit gleichen Werten zu Gruppen zusammen, je Gruppe eine Ergebniszeile.",
    details: "Pro Kombination der Gruppierungsspalten entsteht eine Zeile; Aggregatfunktionen rechnen je Gruppe. Im `SELECT` dürfen nur Gruppierungsspalten, Aggregate und Konstanten stehen (der Standard erlaubt zusätzlich Spalten, die funktional vom Gruppierungsschlüssel abhängen). Wie streng die Dialekte das prüfen, unterscheidet sich. Die Reihenfolge der Gruppen ist ohne `ORDER BY` nicht garantiert.",
    dialects: {
      std: {
        syntax: "SELECT spalte, aggregat(…)\nFROM tabelle\n[WHERE …]\nGROUP BY spalte [, …]\n[HAVING …]\n[ORDER BY …];",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT abteilung, COUNT(*) AS anzahl, SUM(gehalt) AS summe
FROM mitarbeiter
GROUP BY abteilung
ORDER BY abteilung;
-- abteilung | anzahl | summe
-- HR        | 1      | 3600
-- IT        | 2      | 9300
-- Vertrieb  | 2      | 8400
`)
      },
      pg: { note: "Erlaubt im `SELECT` auch Spalten, die funktional vom Primärschlüssel einer gruppierten Tabelle abhängen (`GROUP BY k.id` reicht für `k.name`). `GROUP BY 1` (Spaltennummer) und `SELECT`-Aliase im `GROUP BY` gehen ebenfalls." },
      mysql: { note: "Mit dem voreingestellten `ONLY_FULL_GROUP_BY` ähnlich streng wie PostgreSQL; ohne den Modus liefern fremde Spalten einen beliebigen Wert. `GROUP BY 1` und Aliase sind erlaubt.", mdn: MY + 'group-by-handling.html' },
      mssql: { note: "Streng nach Standard: Jede Nicht-Aggregat-Spalte muss im `GROUP BY` stehen. Weder Spaltennummern (`GROUP BY 1`) noch `SELECT`-Aliase sind erlaubt.", mdn: MS + 'queries/select-group-by-transact-sql' },
      sqlite: { note: "Sehr nachsichtig: Fremde Spalten im `SELECT` sind erlaubt und liefern den Wert einer beliebigen Zeile der Gruppe. `GROUP BY 1` und Aliase gehen." }
    },
    tip: "Positionsangaben wie `GROUP BY 1` sind kein Standard und brechen beim Umstellen der Spalten – besser den Ausdruck ausschreiben.",
    keywords: ['gruppieren', 'gruppierung', 'group by', 'zusammenfassen', 'pro', 'je', 'only_full_group_by'],
    related: ['HAVING', 'GROUP BY mehrere Spalten', 'COUNT()', 'Logische Abfragereihenfolge'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Gruppierung', name: 'HAVING',
    desc: "Filtert Gruppen nach dem GROUP BY, typischerweise anhand von Aggregaten.",
    details: "`HAVING` wird nach dem Gruppieren ausgewertet und kann deshalb Aggregatfunktionen verwenden, was in `WHERE` nicht erlaubt ist. Spaltenaliase aus dem `SELECT` sind im Standard in `HAVING` nicht sichtbar – das Aggregat wird wiederholt. Ohne `GROUP BY` behandelt `HAVING` die ganze Tabelle als eine Gruppe.",
    dialects: {
      std: {
        syntax: "GROUP BY spalte\nHAVING aggregat_bedingung",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT abteilung, AVG(gehalt) AS schnitt
FROM mitarbeiter
GROUP BY abteilung
HAVING AVG(gehalt) > 4000
ORDER BY schnitt DESC;
-- abteilung | schnitt
-- IT        | 4650.0
-- Vertrieb  | 4200.0
`)
      },
      mysql: { note: "Erlaubt in `HAVING` auch `SELECT`-Aliase: `HAVING schnitt > 4000`." },
      mssql: { note: "`AVG` über `INT` ist hier ganzzahlig (4650, 4200) – bei krummen Werten vorher nach `DECIMAL` casten." },
      sqlite: { note: "Erlaubt in `HAVING` auch `SELECT`-Aliase: `HAVING schnitt > 4000`." }
    },
    tip: "Bedingungen, die keine Aggregate brauchen, gehören in `WHERE` – das filtert früher und kann Indizes nutzen.",
    keywords: ['gruppen filtern', 'having', 'aggregat bedingung', 'filter nach group by'],
    related: ['WHERE vs. HAVING', 'GROUP BY', 'WHERE'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Gruppierung', name: 'WHERE vs. HAVING',
    desc: "WHERE filtert Zeilen vor dem Gruppieren, HAVING filtert Gruppen danach.",
    details: "Die logische Reihenfolge ist `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY`. `WHERE` sieht einzelne Zeilen und kennt keine Aggregate; `HAVING` sieht Gruppen und ihre Aggregate. Eine Bedingung wie `abteilung = 'IT'` funktioniert in beiden, ist in `WHERE` aber effizienter.",
    values: [
      ['WHERE', 'Pro Zeile, vor GROUP BY, keine Aggregate'],
      ['HAVING', 'Pro Gruppe, nach GROUP BY, Aggregate erlaubt']
    ],
    dialects: {
      std: {
        syntax: "SELECT …\nFROM …\nWHERE zeilen_bedingung\nGROUP BY …\nHAVING gruppen_bedingung;",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

-- Abteilungen mit mindestens 2 Personen, die über 4000 verdienen
SELECT abteilung, COUNT(*) AS anzahl
FROM mitarbeiter
WHERE gehalt > 4000          -- zuerst: Zeilen filtern
GROUP BY abteilung
HAVING COUNT(*) >= 2         -- danach: Gruppen filtern
ORDER BY abteilung;
-- abteilung | anzahl
-- IT        | 2
`)
      }
    },
    tip: "Fehlermeldungen wie „aggregate functions are not allowed in WHERE“ bedeuten: Bedingung nach `HAVING` verschieben.",
    keywords: ['where oder having', 'unterschied', 'filtern', 'reihenfolge', 'aggregate in where'],
    related: ['HAVING', 'WHERE', 'Logische Abfragereihenfolge'],
    mdn: PG + 'tutorial-agg.html'
  },
  {
    lang: 'sql', group: 'Gruppierung', name: 'GROUP BY mehrere Spalten',
    desc: "Gruppiert nach Kombinationen mehrerer Spalten oder Ausdrücke.",
    details: "Jede vorkommende Kombination der Werte bildet eine Gruppe. Gruppieren lässt sich auch nach Ausdrücken, etwa nach dem Monat eines Datums; derselbe Ausdruck muss dann im `SELECT` stehen. Die Datumsfunktionen dafür heißen in jedem Dialekt anders.",
    dialects: {
      std: {
        syntax: "GROUP BY spalte1, spalte2 [, ausdruck …]",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 1, 100, '2026-01-05'), (2, 1, 50, '2026-01-20'), (3, 1, 70, '2026-02-02'),
  (4, 2, 200, '2026-01-11'), (5, 2, 30, '2026-02-14');

SELECT kunde_id, EXTRACT(MONTH FROM datum) AS monat, COUNT(*) AS anzahl, SUM(betrag) AS summe
FROM bestellungen
GROUP BY kunde_id, EXTRACT(MONTH FROM datum)
ORDER BY kunde_id, monat;
-- kunde_id | monat | anzahl | summe
-- 1        | 1     | 2      | 150
-- 1        | 2     | 1      | 70
-- 2        | 1     | 1      | 200
-- 2        | 2     | 1      | 30
`)
      },
      pg: { note: "Für Jahr und Monat zusammen: `DATE_TRUNC('month', datum)` oder `TO_CHAR(datum, 'YYYY-MM')`. Gruppieren nach `SELECT`-Alias ist erlaubt." },
      mysql: { note: "Für Jahr und Monat zusammen: `DATE_FORMAT(datum, '%Y-%m')`. Gruppieren nach `SELECT`-Alias ist erlaubt." },
      mssql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 1, 100, '2026-01-05'), (2, 1, 50, '2026-01-20'), (3, 1, 70, '2026-02-02'),
  (4, 2, 200, '2026-01-11'), (5, 2, 30, '2026-02-14');

SELECT kunde_id, MONTH(datum) AS monat, COUNT(*) AS anzahl, SUM(betrag) AS summe
FROM bestellungen
GROUP BY kunde_id, MONTH(datum)
ORDER BY kunde_id, monat;
-- kunde_id | monat | anzahl | summe
-- 1        | 1     | 2      | 150
-- 1        | 2     | 1      | 70
-- 2        | 1     | 1      | 200
-- 2        | 2     | 1      | 30
`),
        note: "Kein `EXTRACT`; stattdessen `MONTH(datum)` bzw. `DATEPART(month, datum)`, für Jahr und Monat `FORMAT(datum, 'yyyy-MM')`. Ein `SELECT`-Alias ist im `GROUP BY` nicht erlaubt."
      },
      sqlite: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 1, 100, '2026-01-05'), (2, 1, 50, '2026-01-20'), (3, 1, 70, '2026-02-02'),
  (4, 2, 200, '2026-01-11'), (5, 2, 30, '2026-02-14');

SELECT kunde_id, CAST(strftime('%m', datum) AS INTEGER) AS monat, COUNT(*) AS anzahl, SUM(betrag) AS summe
FROM bestellungen
GROUP BY kunde_id, monat
ORDER BY kunde_id, monat;
-- kunde_id | monat | anzahl | summe
-- 1        | 1     | 2      | 150
-- 1        | 2     | 1      | 70
-- 2        | 1     | 1      | 200
-- 2        | 2     | 1      | 30
`),
        note: "Kein `EXTRACT`; Datumsteile liefert `strftime()` als Text (`'01'`), Jahr und Monat zusammen `strftime('%Y-%m', datum)`. Gruppieren nach Alias ist erlaubt.",
        mdn: SL + 'lang_datefunc.html'
      }
    },
    tip: "Gruppen über Monate mehrerer Jahre brauchen Jahr und Monat – nur der Monat würfelt Januar 2025 und Januar 2026 zusammen.",
    keywords: ['mehrere spalten gruppieren', 'kombination', 'pro monat', 'gruppierung nach ausdruck', 'extract', 'date_trunc', 'strftime'],
    related: ['GROUP BY', 'ROLLUP', 'Wochentag & Monat gruppieren'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Gruppierung', name: 'ROLLUP',
    desc: "Erzeugt zusätzlich Zwischensummen je Hierarchiestufe und eine Gesamtsumme.",
    details: "`GROUP BY ROLLUP (a, b)` gruppiert nach `(a, b)`, `(a)` und `()` – ideal für Berichte mit Teil- und Gesamtsummen. In den Summenzeilen stehen die zusammengefassten Spalten auf NULL; `GROUPING(spalte)` liefert dort 1 und unterscheidet sie von echten NULL-Werten. Wo NULL beim Sortieren landet, ist je Dialekt verschieden – deshalb im Beispiel nach `GROUPING()` sortieren.",
    dialects: {
      std: {
        syntax: "GROUP BY ROLLUP (spalte1, spalte2)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), standort VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 'Berlin', 5200), (2, 'Ben', 'IT', 'Hamburg', 4100),
  (3, 'Cem', 'Vertrieb', 'Berlin', 3900), (4, 'Dana', 'Vertrieb', 'Hamburg', 4500);

-- Zeilen mit NULL: Zwischensummen je Abteilung, ganz unten die Gesamtsumme
SELECT abteilung, standort, SUM(gehalt) AS summe
FROM mitarbeiter
GROUP BY ROLLUP (abteilung, standort)
ORDER BY GROUPING(abteilung), abteilung, GROUPING(standort), standort;
-- abteilung | standort | summe
-- IT        | Berlin   | 5200
-- IT        | Hamburg  | 4100
-- IT        | NULL     | 9300
-- Vertrieb  | Berlin   | 3900
-- Vertrieb  | Hamburg  | 4500
-- Vertrieb  | NULL     | 8400
-- NULL      | NULL     | 17700
`)
      },
      mssql: { note: "Die ältere Schreibweise `GROUP BY a, b WITH ROLLUP` funktioniert weiterhin.", mdn: MS + 'queries/select-group-by-transact-sql' },
      mysql: {
        syntax: "GROUP BY spalte1, spalte2 WITH ROLLUP",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), standort VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 'Berlin', 5200), (2, 'Ben', 'IT', 'Hamburg', 4100),
  (3, 'Cem', 'Vertrieb', 'Berlin', 3900), (4, 'Dana', 'Vertrieb', 'Hamburg', 4500);

SELECT abteilung, standort, SUM(gehalt) AS summe
FROM mitarbeiter
GROUP BY abteilung, standort WITH ROLLUP
ORDER BY GROUPING(abteilung), abteilung, GROUPING(standort), standort;
-- abteilung | standort | summe
-- IT        | Berlin   | 5200
-- IT        | Hamburg  | 4100
-- IT        | NULL     | 9300
-- Vertrieb  | Berlin   | 3900
-- Vertrieb  | Hamburg  | 4500
-- Vertrieb  | NULL     | 8400
-- NULL      | NULL     | 17700
`),
        note: "Kein `ROLLUP (…)`, sondern `WITH ROLLUP` hinter der Spaltenliste. `GROUPING()` und `ORDER BY` zusammen mit `WITH ROLLUP` gehen seit 8.0.12.",
        mdn: MY + 'group-by-modifiers.html'
      },
      sqlite: {
        syntax: "SELECT a, b, SUM(x) FROM t GROUP BY a, b\nUNION ALL SELECT a, NULL, SUM(x) FROM t GROUP BY a\nUNION ALL SELECT NULL, NULL, SUM(x) FROM t",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), standort VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 'Berlin', 5200), (2, 'Ben', 'IT', 'Hamburg', 4100),
  (3, 'Cem', 'Vertrieb', 'Berlin', 3900), (4, 'Dana', 'Vertrieb', 'Hamburg', 4500);

SELECT abteilung, standort, summe FROM (
  SELECT abteilung, standort, SUM(gehalt) AS summe FROM mitarbeiter GROUP BY abteilung, standort
  UNION ALL
  SELECT abteilung, NULL, SUM(gehalt) FROM mitarbeiter GROUP BY abteilung
  UNION ALL
  SELECT NULL, NULL, SUM(gehalt) FROM mitarbeiter
) AS r
ORDER BY abteilung IS NULL, abteilung, standort IS NULL, standort;
-- abteilung | standort | summe
-- IT        | Berlin   | 5200
-- IT        | Hamburg  | 4100
-- IT        | NULL     | 9300
-- Vertrieb  | Berlin   | 3900
-- Vertrieb  | Hamburg  | 4500
-- Vertrieb  | NULL     | 8400
-- NULL      | NULL     | 17700
`),
        note: "Kein `ROLLUP`; die Summenstufen per `UNION ALL` mehrerer `GROUP BY`-Abfragen nachbauen."
      }
    },
    tip: "Für lesbare Berichte: `CASE WHEN GROUPING(abteilung) = 1 THEN 'Gesamt' ELSE abteilung END`.",
    keywords: ['zwischensumme', 'gesamtsumme', 'subtotal', 'rollup', 'with rollup', 'bericht', 'summenzeile', 'grouping'],
    related: ['CUBE', 'GROUPING SETS', 'GROUP BY mehrere Spalten'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Gruppierung', name: 'CUBE',
    desc: "Bildet Summen für alle Kombinationen der angegebenen Spalten.",
    details: "`GROUP BY CUBE (a, b)` entspricht `GROUPING SETS ((a, b), (a), (b), ())` – also zusätzlich zu `ROLLUP` auch die Summen je `b`. Bei n Spalten entstehen 2^n Gruppierungen, das wird schnell groß.",
    dialects: {
      std: {
        syntax: "GROUP BY CUBE (spalte1, spalte2)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), standort VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 'Berlin', 5200), (2, 'Ben', 'IT', 'Hamburg', 4100),
  (3, 'Cem', 'Vertrieb', 'Berlin', 3900), (4, 'Dana', 'Vertrieb', 'Hamburg', 4500);

-- Gegenüber ROLLUP neu: die Summen je Standort (abteilung NULL)
SELECT abteilung, standort, SUM(gehalt) AS summe
FROM mitarbeiter
GROUP BY CUBE (abteilung, standort)
ORDER BY GROUPING(abteilung), abteilung, GROUPING(standort), standort;
-- abteilung | standort | summe
-- IT        | Berlin   | 5200
-- IT        | Hamburg  | 4100
-- IT        | NULL     | 9300
-- Vertrieb  | Berlin   | 3900
-- Vertrieb  | Hamburg  | 4500
-- Vertrieb  | NULL     | 8400
-- NULL      | Berlin   | 9100
-- NULL      | Hamburg  | 8600
-- NULL      | NULL     | 17700
`)
      },
      mssql: { note: "Die ältere Schreibweise `GROUP BY a, b WITH CUBE` funktioniert weiterhin." },
      mysql: { none: "Kein `CUBE`, nur `WITH ROLLUP`. Die fehlenden Summen (hier je Standort) per `UNION ALL` einer weiteren `GROUP BY standort`-Abfrage ergänzen." },
      sqlite: { none: "Kein `CUBE`; alle Kombinationen per `UNION ALL` mehrerer `GROUP BY`-Abfragen nachbauen (siehe `ROLLUP`)." }
    },
    tip: "Braucht man nur einige der Kombinationen, ist `GROUPING SETS` sparsamer als `CUBE`.",
    keywords: ['cube', 'alle kombinationen', 'kreuztabelle', 'olap', 'summen', 'with cube'],
    related: ['ROLLUP', 'GROUPING SETS', 'GROUP BY'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Gruppierung', name: 'GROUPING SETS',
    desc: "Berechnet mehrere frei gewählte Gruppierungen in einer einzigen Abfrage.",
    details: "Jede Menge in der Liste ist eine eigene Gruppierung; `()` steht für die Gesamtsumme. Das Ergebnis entspricht einem `UNION ALL` mehrerer `GROUP BY`-Abfragen, wird aber in einem Durchlauf berechnet. `ROLLUP` und `CUBE` sind Kurzschreibweisen dafür.",
    dialects: {
      std: {
        syntax: "GROUP BY GROUPING SETS ((a, b), (a), (b), ())",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), standort VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 'Berlin', 5200), (2, 'Ben', 'IT', 'Hamburg', 4100),
  (3, 'Cem', 'Vertrieb', 'Berlin', 3900), (4, 'Dana', 'Vertrieb', 'Hamburg', 4500);

SELECT abteilung, standort, SUM(gehalt) AS summe, GROUPING(abteilung, standort) AS g
FROM mitarbeiter
GROUP BY GROUPING SETS ((abteilung), (standort), ())
ORDER BY g, abteilung, standort;
-- abteilung | standort | summe | g
-- IT        | NULL     | 9300  | 1
-- Vertrieb  | NULL     | 8400  | 1
-- NULL      | Berlin   | 9100  | 2
-- NULL      | Hamburg  | 8600  | 2
-- NULL      | NULL     | 17700 | 3
`)
      },
      mssql: {
        syntax: "GROUP BY GROUPING SETS ((a, b), (a), (b), ())\nGROUPING_ID(a, b)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), standort VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 'Berlin', 5200), (2, 'Ben', 'IT', 'Hamburg', 4100),
  (3, 'Cem', 'Vertrieb', 'Berlin', 3900), (4, 'Dana', 'Vertrieb', 'Hamburg', 4500);

SELECT abteilung, standort, SUM(gehalt) AS summe, GROUPING_ID(abteilung, standort) AS g
FROM mitarbeiter
GROUP BY GROUPING SETS ((abteilung), (standort), ())
ORDER BY g, abteilung, standort;
-- abteilung | standort | summe | g
-- IT        | NULL     | 9300  | 1
-- Vertrieb  | NULL     | 8400  | 1
-- NULL      | Berlin   | 9100  | 2
-- NULL      | Hamburg  | 8600  | 2
-- NULL      | NULL     | 17700 | 3
`),
        note: "`GROUPING()` nimmt nur eine Spalte; die Bitmaske über mehrere Spalten liefert `GROUPING_ID(a, b)`.",
        mdn: MS + 'functions/grouping-id-transact-sql'
      },
      mysql: { none: "Kein `GROUPING SETS`; nur `WITH ROLLUP`. Andere Kombinationen per `UNION ALL` mehrerer `GROUP BY`-Abfragen." },
      sqlite: { none: "Kein `GROUPING SETS`; die Gruppierungen per `UNION ALL` mehrerer `GROUP BY`-Abfragen nachbauen (siehe `ROLLUP`)." }
    },
    tip: "Die Bitmaske aus `GROUPING(a, b)` (1 = Spalte zusammengefasst) eignet sich gut zum Sortieren der Summenzeilen.",
    keywords: ['grouping sets', 'mehrere gruppierungen', 'grouping()', 'grouping_id', 'olap', 'teilsummen'],
    related: ['ROLLUP', 'CUBE', 'UNION ALL'],
    mdn: PG + 'queries-table-expressions.html'
  },

  // ---------------- Joins ----------------
  {
    lang: 'sql', group: 'Joins', name: 'Joins im Überblick',
    desc: "Joins verknüpfen Zeilen mehrerer Tabellen über eine Bedingung zu einer Ergebnismenge.",
    details: "`INNER JOIN` liefert nur Paare mit Treffer, `LEFT`/`RIGHT JOIN` behalten zusätzlich alle Zeilen der linken bzw. rechten Seite, `FULL JOIN` beider Seiten; fehlende Werte werden mit NULL aufgefüllt. `CROSS JOIN` bildet jede Kombination. Ein Join kann Zeilen vervielfachen, wenn auf einer Seite mehrere Treffer existieren – häufige Ursache für zu große Summen.",
    values: [
      ['INNER JOIN', 'Nur Zeilen mit Treffer auf beiden Seiten'],
      ['LEFT JOIN', 'Alle links, rechts NULL ohne Treffer'],
      ['RIGHT JOIN', 'Alle rechts, links NULL ohne Treffer'],
      ['FULL OUTER JOIN', 'Alle von beiden Seiten'],
      ['CROSS JOIN', 'Kartesisches Produkt: jede mit jeder']
    ],
    dialects: {
      std: {
        syntax: "FROM a\n[INNER | LEFT | RIGHT | FULL] JOIN b ON bedingung\nCROSS JOIN c",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200), (4, 9, 50);

-- LEFT: + Cem ohne Bestellung, RIGHT: + Bestellung 4 ohne Kunde, CROSS: 3 × 4
SELECT 'INNER' AS art, COUNT(*) AS zeilen FROM kunden k INNER JOIN bestellungen b ON b.kunde_id = k.id
UNION ALL
SELECT 'LEFT', COUNT(*) FROM kunden k LEFT JOIN bestellungen b ON b.kunde_id = k.id
UNION ALL
SELECT 'RIGHT', COUNT(*) FROM kunden k RIGHT JOIN bestellungen b ON b.kunde_id = k.id
UNION ALL
SELECT 'FULL', COUNT(*) FROM kunden k FULL JOIN bestellungen b ON b.kunde_id = k.id
UNION ALL
SELECT 'CROSS', COUNT(*) FROM kunden k CROSS JOIN bestellungen b;
-- art   | zeilen
-- INNER | 3
-- LEFT  | 4
-- RIGHT | 4
-- FULL  | 5
-- CROSS | 12
`)
      },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200), (4, 9, 50);

-- FULL nachgebaut: LEFT JOIN UNION RIGHT JOIN
SELECT 'INNER' AS art, COUNT(*) AS zeilen FROM kunden k INNER JOIN bestellungen b ON b.kunde_id = k.id
UNION ALL
SELECT 'LEFT', COUNT(*) FROM kunden k LEFT JOIN bestellungen b ON b.kunde_id = k.id
UNION ALL
SELECT 'RIGHT', COUNT(*) FROM kunden k RIGHT JOIN bestellungen b ON b.kunde_id = k.id
UNION ALL
SELECT 'FULL', COUNT(*) FROM (
  SELECT k.id AS kid, b.id AS bid FROM kunden k LEFT JOIN bestellungen b ON b.kunde_id = k.id
  UNION
  SELECT k.id, b.id FROM kunden k RIGHT JOIN bestellungen b ON b.kunde_id = k.id
) AS f
UNION ALL
SELECT 'CROSS', COUNT(*) FROM kunden k CROSS JOIN bestellungen b;
-- art   | zeilen
-- INNER | 3
-- LEFT  | 4
-- RIGHT | 4
-- FULL  | 5
-- CROSS | 12
`),
        note: "Kein `FULL OUTER JOIN`; nachbauen mit `LEFT JOIN … UNION … RIGHT JOIN`. In MySQL ist `CROSS JOIN` mit `ON` ein normaler `INNER JOIN`."
      },
      sqlite: { note: "`RIGHT JOIN` und `FULL JOIN` gibt es erst seit SQLite 3.39." }
    },
    tip: "Ein einfaches `JOIN` ist `INNER JOIN`, `LEFT JOIN` ist `LEFT OUTER JOIN` – das Wort `OUTER` ist optional.",
    keywords: ['join', 'verknüpfen', 'verbinden', 'tabellen verbinden', 'join arten', 'venn', 'outer join'],
    related: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'INNER JOIN',
    desc: "Liefert nur Zeilenpaare, die die Join-Bedingung auf beiden Seiten erfüllen.",
    details: "Zeilen ohne Partner fallen weg, ebenso Zeilen, deren Join-Spalte NULL ist (NULL = NULL ist nicht wahr). Hat eine Zeile mehrere Partner, erscheint sie mehrfach. Die alte Schreibweise `FROM a, b WHERE a.id = b.a_id` ist gleichwertig, aber fehleranfällig, weil eine vergessene Bedingung ein Kreuzprodukt erzeugt.",
    dialects: {
      std: {
        syntax: "SELECT …\nFROM a\n[INNER] JOIN b ON b.a_id = a.id;",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200);

SELECT k.name, b.id AS bestellung, b.betrag
FROM kunden AS k
INNER JOIN bestellungen AS b ON b.kunde_id = k.id
ORDER BY b.id;
-- name | bestellung | betrag
-- Ada  | 1          | 120
-- Ada  | 2          | 80
-- Ben  | 3          | 200
`)
      },
      pg: { note: "Für Fremdschlüssel wird kein Index angelegt – die Join-Spalte selbst indizieren." },
      mysql: { note: "InnoDB legt für jeden Fremdschlüssel automatisch einen Index an." },
      mssql: { note: "Für Fremdschlüssel wird kein Index angelegt – die Join-Spalte selbst indizieren." },
      sqlite: { note: "Für Fremdschlüssel wird kein Index angelegt – die Join-Spalte selbst indizieren." }
    },
    tip: "Join-Spalten (Fremdschlüssel) indizieren – nicht jede Datenbank legt dafür automatisch einen Index an.",
    keywords: ['inner join', 'join', 'schnittmenge', 'verknüpfung', 'equi join', 'innerer verbund'],
    related: ['Joins im Überblick', 'LEFT JOIN', 'Tabellenalias', 'FOREIGN KEY'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'LEFT JOIN',
    desc: "Behält alle Zeilen der linken Tabelle; ohne Treffer sind die rechten Spalten NULL.",
    details: "Typisch für „alle Kunden, auch ohne Bestellung“. Beim Zählen `COUNT(b.id)` statt `COUNT(*)` verwenden, sonst zählt die aufgefüllte NULL-Zeile als 1. Eine Bedingung auf die rechte Tabelle im `WHERE` (z. B. `b.betrag > 100`) macht aus dem `LEFT JOIN` faktisch einen `INNER JOIN` – sie gehört in die `ON`-Klausel.",
    dialects: {
      std: {
        syntax: "SELECT …\nFROM a\nLEFT [OUTER] JOIN b ON b.a_id = a.id;",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200);

SELECT k.name, COUNT(b.id) AS anzahl, COALESCE(SUM(b.betrag), 0) AS umsatz
FROM kunden k
LEFT JOIN bestellungen b ON b.kunde_id = k.id
GROUP BY k.id, k.name
ORDER BY k.id;
-- name | anzahl | umsatz
-- Ada  | 2      | 200
-- Ben  | 1      | 200
-- Cem  | 0      | 0
`)
      }
    },
    tip: "Bei mehreren `LEFT JOIN`s hintereinander multiplizieren sich die Treffer – Summen dann vorher in Unterabfragen oder CTEs aggregieren.",
    keywords: ['left join', 'left outer join', 'linker verbund', 'alle zeilen links', 'auch ohne', 'outer join'],
    related: ['INNER JOIN', 'RIGHT JOIN', 'Anti-Join', 'Join-Bedingung vs. WHERE'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'RIGHT JOIN',
    desc: "Spiegelbild des LEFT JOIN: behält alle Zeilen der rechten Tabelle.",
    details: "`a RIGHT JOIN b` ist dasselbe wie `b LEFT JOIN a`. In der Praxis wird fast immer `LEFT JOIN` mit vertauschten Tabellen geschrieben, weil sich das von links nach rechts besser liest.",
    dialects: {
      std: {
        syntax: "SELECT …\nFROM a\nRIGHT [OUTER] JOIN b ON b.a_id = a.id;",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200), (4, 9, 50);

-- Alle Bestellungen, auch die mit unbekanntem Kunden
SELECT k.name, b.id AS bestellung, b.betrag
FROM kunden k
RIGHT JOIN bestellungen b ON b.kunde_id = k.id
ORDER BY b.id;
-- name | bestellung | betrag
-- Ada  | 1          | 120
-- Ada  | 2          | 80
-- Ben  | 3          | 200
-- NULL | 4          | 50
`)
      },
      sqlite: { note: "`RIGHT JOIN` gibt es erst seit SQLite 3.39; in älteren Versionen die Tabellen tauschen und `LEFT JOIN` schreiben." }
    },
    tip: "Verwaiste Datensätze wie Bestellung 4 verhindert ein `FOREIGN KEY`-Constraint.",
    keywords: ['right join', 'right outer join', 'rechter verbund', 'alle zeilen rechts'],
    related: ['LEFT JOIN', 'FULL OUTER JOIN', 'FOREIGN KEY'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'FULL OUTER JOIN',
    desc: "Behält alle Zeilen beider Tabellen und füllt fehlende Partner mit NULL auf.",
    details: "Nützlich für Abgleiche, etwa „was fehlt wo“ zwischen zwei Listen. Mit `WHERE a.id IS NULL OR b.id IS NULL` bleiben nur die Zeilen ohne Partner übrig. Wo NULL-Werte beim Sortieren landen, ist je Dialekt verschieden – deshalb sortiert das Beispiel ausdrücklich.",
    dialects: {
      std: {
        syntax: "SELECT …\nFROM a\nFULL [OUTER] JOIN b ON b.a_id = a.id;",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200), (4, 9, 50);

SELECT k.name, b.id AS bestellung
FROM kunden k
FULL OUTER JOIN bestellungen b ON b.kunde_id = k.id
ORDER BY k.id NULLS LAST, b.id;
-- name | bestellung
-- Ada  | 1
-- Ada  | 2
-- Ben  | 3
-- Cem  | NULL
-- NULL | 4
`)
      },
      sqlite: { note: "`FULL OUTER JOIN` gibt es erst seit SQLite 3.39, `NULLS LAST` seit 3.30." },
      mssql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200), (4, 9, 50);

SELECT k.name, b.id AS bestellung
FROM kunden k
FULL OUTER JOIN bestellungen b ON b.kunde_id = k.id
ORDER BY CASE WHEN k.id IS NULL THEN 1 ELSE 0 END, k.id, b.id;
-- name | bestellung
-- Ada  | 1
-- Ada  | 2
-- Ben  | 3
-- Cem  | NULL
-- NULL | 4
`),
        note: "Kein `NULLS LAST`; NULL steht beim aufsteigenden Sortieren vorn – mit `CASE WHEN … IS NULL THEN 1 ELSE 0 END` nach hinten schieben."
      },
      mysql: {
        syntax: "SELECT … FROM a LEFT JOIN b ON …\nUNION\nSELECT … FROM a RIGHT JOIN b ON …",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200), (4, 9, 50);

SELECT name, bestellung FROM (
  SELECT k.id AS kid, k.name, b.id AS bestellung
  FROM kunden k LEFT JOIN bestellungen b ON b.kunde_id = k.id
  UNION
  SELECT k.id, k.name, b.id
  FROM kunden k RIGHT JOIN bestellungen b ON b.kunde_id = k.id
) AS f
ORDER BY kid IS NULL, kid, bestellung;
-- name | bestellung
-- Ada  | 1
-- Ada  | 2
-- Ben  | 3
-- Cem  | NULL
-- NULL | 4
`),
        note: "Kein `FULL OUTER JOIN`; `LEFT JOIN` und `RIGHT JOIN` mit `UNION` kombinieren. `UNION` entfernt dabei auch echte Doppelzeilen – Schlüsselspalten mit auswählen. Kein `NULLS LAST`: `ORDER BY spalte IS NULL, spalte`."
      }
    },
    tip: "Für einen Abgleich „was fehlt wo“: `WHERE k.id IS NULL OR b.id IS NULL` behält nur die Zeilen ohne Partner.",
    keywords: ['full join', 'full outer join', 'vollständiger verbund', 'abgleich', 'beide seiten', 'nulls last'],
    related: ['LEFT JOIN', 'RIGHT JOIN', 'UNION', 'Joins im Überblick'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'CROSS JOIN',
    desc: "Bildet das kartesische Produkt: jede Zeile links mit jeder Zeile rechts.",
    details: "Das Ergebnis hat Zeilen(a) × Zeilen(b) Zeilen und hat keine `ON`-Bedingung. Sinnvoll für Kombinationen wie Größe × Farbe oder um jede Zeile mit einer einzeiligen Hilfstabelle (z. B. Parameter) zu verbinden. Ein vergessenes `ON` oder `FROM a, b` ohne `WHERE` erzeugt ungewollt ein Kreuzprodukt.",
    dialects: {
      std: {
        syntax: "SELECT …\nFROM a\nCROSS JOIN b;",
        example: e(`
CREATE TABLE groessen (groesse VARCHAR(5));
CREATE TABLE farben (farbe VARCHAR(20));
INSERT INTO groessen VALUES ('S'), ('M'), ('L');
INSERT INTO farben VALUES ('rot'), ('blau');

SELECT g.groesse, f.farbe
FROM groessen g
CROSS JOIN farben f
ORDER BY g.groesse, f.farbe;
-- groesse | farbe
-- L       | blau
-- L       | rot
-- M       | blau
-- M       | rot
-- S       | blau
-- S       | rot
`)
      },
      mysql: { note: "In MySQL sind `CROSS JOIN`, `JOIN` und `INNER JOIN` gleichbedeutend; ein `CROSS JOIN … ON` ist dort also ein normaler Join." }
    },
    tip: "Zeilenzahl plötzlich explodiert? Fast immer fehlt eine Join-Bedingung.",
    keywords: ['cross join', 'kreuzprodukt', 'kartesisches produkt', 'alle kombinationen', 'cartesian'],
    related: ['Joins im Überblick', 'INNER JOIN', 'LATERAL'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'Self Join',
    desc: "Verknüpft eine Tabelle mit sich selbst, etwa für Vorgesetzte oder Paare.",
    details: "Die Tabelle erscheint zweimal im `FROM` und braucht deshalb zwei verschiedene Aliase. Typisch für Hierarchien (Mitarbeiter → Chef in derselben Tabelle) oder für Vergleiche von Zeilen untereinander. Mit `LEFT JOIN` bleiben auch Zeilen ohne Partner (die oberste Ebene) erhalten. Für beliebig tiefe Hierarchien braucht man eine rekursive CTE.",
    dialects: {
      std: {
        syntax: "SELECT …\nFROM t AS a\nJOIN t AS b ON b.id = a.parent_id;",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), chef_id INT REFERENCES mitarbeiter(id));
INSERT INTO mitarbeiter VALUES (1, 'Ada', NULL), (2, 'Ben', 1), (3, 'Cem', 1), (4, 'Dana', 2);

SELECT m.name AS mitarbeiter, c.name AS chef
FROM mitarbeiter AS m
LEFT JOIN mitarbeiter AS c ON c.id = m.chef_id
ORDER BY m.id;
-- mitarbeiter | chef
-- Ada         | NULL
-- Ben         | Ada
-- Cem         | Ada
-- Dana        | Ben
`)
      }
    },
    tip: "Für Paare ohne Dopplung (A-B, aber nicht B-A) `ON a.id < b.id` verwenden.",
    keywords: ['self join', 'selbstverknüpfung', 'tabelle mit sich selbst', 'hierarchie', 'vorgesetzter', 'chef'],
    related: ['Tabellenalias', 'Hierarchie mit rekursiver CTE', 'LEFT JOIN'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'USING',
    desc: "Kurzform für Joins über gleichnamige Spalten: USING (spalte) statt ON a.x = b.x.",
    details: "Die genannten Spalten müssen in beiden Tabellen gleich heißen. Im Ergebnis erscheint die Join-Spalte nur einmal und kann ohne Tabellenpräfix angesprochen werden. Bei `SELECT *` steht sie vorne statt doppelt.",
    dialects: {
      std: {
        syntax: "FROM a JOIN b USING (spalte [, …])",
        example: e(`
CREATE TABLE kunden (kunde_id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (bestell_id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada'), (2, 'Ben'), (3, 'Cem');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200);

SELECT kunde_id, name, betrag
FROM kunden
JOIN bestellungen USING (kunde_id)
ORDER BY bestell_id;
-- kunde_id | name | betrag
-- 1        | Ada  | 120
-- 1        | Ada  | 80
-- 2        | Ben  | 200
`)
      },
      mssql: { none: "Kein `USING`; stattdessen `JOIN bestellungen b ON b.kunde_id = k.kunde_id` und die Spalte mit Tabellenalias ansprechen." }
    },
    tip: "`USING` passt gut zu der Konvention, Schlüssel überall gleich zu benennen (`kunde_id` statt `id`).",
    keywords: ['using', 'join using', 'gleichnamige spalten', 'kurzform join'],
    related: ['NATURAL JOIN', 'INNER JOIN', 'Namenskonventionen'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'NATURAL JOIN',
    desc: "Joint automatisch über alle Spalten, die in beiden Tabellen gleich heißen.",
    details: "Entspricht `USING` mit allen gemeinsamen Spaltennamen – bequem, aber riskant: Kommt später in beiden Tabellen z. B. eine Spalte `name` oder `erstellt` dazu, ändert sich die Join-Bedingung still und das Ergebnis wird leer oder falsch. Gibt es gar keine gemeinsame Spalte, entsteht ein Kreuzprodukt.",
    dialects: {
      std: {
        syntax: "FROM a NATURAL [LEFT] JOIN b",
        example: e(`
CREATE TABLE abteilungen (abteilung_id INT PRIMARY KEY, abteilung VARCHAR(50));
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung_id INT);
INSERT INTO abteilungen VALUES (1, 'IT'), (2, 'HR');
INSERT INTO mitarbeiter VALUES (1, 'Ada', 1), (2, 'Ben', 2), (3, 'Cem', 1);

-- joint über abteilung_id, die einzige gemeinsame Spalte
SELECT name, abteilung
FROM mitarbeiter
NATURAL JOIN abteilungen
ORDER BY name;
-- name | abteilung
-- Ada  | IT
-- Ben  | HR
-- Cem  | IT
`)
      },
      mssql: { none: "Kein `NATURAL JOIN`; die Join-Bedingung mit `ON` ausschreiben: `JOIN abteilungen a ON a.abteilung_id = m.abteilung_id`." }
    },
    tip: "In produktivem Code besser `USING` oder `ON` – dann steht die Join-Bedingung sichtbar im Code.",
    keywords: ['natural join', 'natürlicher verbund', 'automatischer join', 'gleiche spaltennamen'],
    related: ['USING', 'INNER JOIN', 'CROSS JOIN'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'Join über mehrere Tabellen',
    desc: "Verkettet beliebig viele Tabellen, jeweils mit eigener JOIN … ON-Bedingung.",
    details: "Jeder weitere `JOIN` verknüpft mit dem bisherigen Zwischenergebnis; die Reihenfolge im Text ändert bei `INNER JOIN` nichts am Ergebnis, der Optimierer wählt selbst. Bei gemischten `LEFT`/`INNER JOIN`s kommt es aber auf die Reihenfolge an: ein `INNER JOIN` nach einem `LEFT JOIN` kann dessen NULL-Zeilen wieder entfernen. Aliase halten lange Abfragen lesbar.",
    dialects: {
      std: {
        syntax: "FROM a\nJOIN b ON b.a_id = a.id\nJOIN c ON c.id = b.c_id",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, produkt_id INT);
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg');
INSERT INTO produkte VALUES (1, 'Maus', 19.9), (2, 'Monitor', 189), (3, 'Laptop', 899);
INSERT INTO bestellungen VALUES (1, 1, 3), (2, 2, 1), (3, 1, 2);

SELECT b.id, k.name AS kunde, p.name AS produkt, p.preis
FROM bestellungen b
JOIN kunden k   ON k.id = b.kunde_id
JOIN produkte p ON p.id = b.produkt_id
ORDER BY b.id;
-- id | kunde | produkt | preis
-- 1  | Ada   | Laptop  | 899
-- 2  | Ben   | Maus    | 19.9
-- 3  | Ada   | Monitor | 189
`)
      }
    },
    tip: "Gleichnamige Spalten (hier `name`) immer mit Alias ausgeben, sonst überschreiben sie sich in vielen Treibern gegenseitig.",
    keywords: ['mehrere joins', 'drei tabellen', 'join kette', 'multi join', 'n tabellen verbinden'],
    related: ['INNER JOIN', 'n:m-Beziehung', 'Tabellenalias'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'Anti-Join',
    desc: "Findet Zeilen ohne passenden Partner, z. B. Kunden ohne Bestellung.",
    details: "Drei übliche Schreibweisen: `NOT EXISTS` (meist die beste Wahl), `LEFT JOIN … WHERE rechts.id IS NULL` und `NOT IN`. `NOT IN` liefert falsch keine Zeilen, sobald die Unterabfrage ein NULL enthält. Moderne Optimierer erkennen `NOT EXISTS` und den `LEFT JOIN`-Trick als Anti-Join und führen beide gleich effizient aus.",
    dialects: {
      std: {
        syntax: "WHERE NOT EXISTS (SELECT 1 FROM b WHERE b.a_id = a.id)\n-- oder\nLEFT JOIN b ON b.a_id = a.id WHERE b.a_id IS NULL",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln'), (4, 'Dana', 'Bonn');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200);

SELECT k.name
FROM kunden k
LEFT JOIN bestellungen b ON b.kunde_id = k.id
WHERE b.id IS NULL
ORDER BY k.name;
-- name
-- Cem
-- Dana

SELECT k.name FROM kunden k
WHERE NOT EXISTS (SELECT 1 FROM bestellungen b WHERE b.kunde_id = k.id)
ORDER BY k.name;
-- name
-- Cem
-- Dana
`)
      }
    },
    tip: "Beim `LEFT JOIN`-Trick auf eine Spalte prüfen, die rechts nie NULL ist (Primärschlüssel oder Join-Spalte).",
    keywords: ['anti join', 'ohne partner', 'nicht vorhanden', 'fehlende', 'kunden ohne bestellung', 'left join is null'],
    related: ['NOT EXISTS', 'NOT IN und NULL', 'LEFT JOIN', 'Semi-Join'],
    mdn: PG + 'functions-subquery.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'Semi-Join',
    desc: "Liefert Zeilen, die mindestens einen Partner haben – jede nur einmal.",
    details: "Ein normaler `JOIN` vervielfacht Zeilen mit mehreren Treffern; ein Semi-Join mit `EXISTS` oder `IN` prüft nur, ob ein Partner existiert. Das ersetzt das oft gesehene `SELECT DISTINCT … JOIN …`, das erst Duplikate erzeugt und dann wieder entfernt. Der Optimierer kann beim ersten Treffer abbrechen.",
    dialects: {
      std: {
        syntax: "WHERE EXISTS (SELECT 1 FROM b WHERE b.a_id = a.id)\n-- oder\nWHERE a.id IN (SELECT a_id FROM b)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200);

-- JOIN vervielfacht Ada
SELECT k.name FROM kunden k JOIN bestellungen b ON b.kunde_id = k.id ORDER BY k.name;
-- name
-- Ada
-- Ada
-- Ben

-- Semi-Join: jeder Kunde höchstens einmal
SELECT k.name FROM kunden k
WHERE EXISTS (SELECT 1 FROM bestellungen b WHERE b.kunde_id = k.id)
ORDER BY k.name;
-- name
-- Ada
-- Ben
`)
      }
    },
    tip: "Taucht `DISTINCT` nur auf, um Join-Duplikate zu beseitigen, ist meist ein Semi-Join gemeint.",
    keywords: ['semi join', 'exists', 'mit partner', 'vorhanden', 'ohne duplikate', 'distinct join'],
    related: ['EXISTS', 'IN (Unterabfrage)', 'Anti-Join', 'DISTINCT'],
    mdn: PG + 'functions-subquery.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'LATERAL',
    desc: "Erlaubt einer Unterabfrage im FROM, auf Spalten vorheriger Tabellen zuzugreifen.",
    details: "Eine `LATERAL`-Unterabfrage wird pro Zeile der linken Seite ausgewertet, ähnlich einer Schleife – ideal für „Top-N je Gruppe“ oder für Funktionen, die pro Zeile mehrere Zeilen liefern. Mit `CROSS JOIN LATERAL` fallen Zeilen ohne Ergebnis weg, mit `LEFT JOIN LATERAL … ON TRUE` bleiben sie erhalten.",
    dialects: {
      std: {
        syntax: "FROM a\nCROSS JOIN LATERAL (SELECT … FROM b WHERE b.a_id = a.id …) AS x\nLEFT JOIN LATERAL (…) AS x ON TRUE",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada'), (2, 'Ben'), (3, 'Cem');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 1, 300), (4, 2, 200);

-- Die zwei größten Bestellungen je Kunde
SELECT k.name, t.betrag
FROM kunden k
CROSS JOIN LATERAL (
  SELECT b.betrag FROM bestellungen b
  WHERE b.kunde_id = k.id
  ORDER BY b.betrag DESC
  FETCH FIRST 2 ROWS ONLY
) AS t
ORDER BY k.name, t.betrag DESC;
-- name | betrag
-- Ada  | 300
-- Ada  | 120
-- Ben  | 200
`)
      },
      pg: { note: "Statt `FETCH FIRST` wird meist `LIMIT 2` geschrieben. Funktionen im `FROM` (z. B. `unnest()`) sind automatisch lateral." },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada'), (2, 'Ben'), (3, 'Cem');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 1, 300), (4, 2, 200);

SELECT k.name, t.betrag
FROM kunden k
CROSS JOIN LATERAL (
  SELECT b.betrag FROM bestellungen b
  WHERE b.kunde_id = k.id
  ORDER BY b.betrag DESC
  LIMIT 2
) AS t
ORDER BY k.name, t.betrag DESC;
-- name | betrag
-- Ada  | 300
-- Ada  | 120
-- Ben  | 200
`),
        note: "`LATERAL` gibt es seit MySQL 8.0.14; kein `FETCH FIRST`, stattdessen `LIMIT`.",
        mdn: MY + 'lateral-derived-tables.html'
      },
      mssql: {
        syntax: "FROM a\nCROSS APPLY (SELECT … FROM b WHERE b.a_id = a.id) AS x\nOUTER APPLY (…) AS x",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada'), (2, 'Ben'), (3, 'Cem');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 1, 300), (4, 2, 200);

SELECT k.name, t.betrag
FROM kunden k
CROSS APPLY (
  SELECT TOP 2 b.betrag FROM bestellungen b
  WHERE b.kunde_id = k.id
  ORDER BY b.betrag DESC
) AS t
ORDER BY k.name, t.betrag DESC;
-- name | betrag
-- Ada  | 300
-- Ada  | 120
-- Ben  | 200
`),
        note: "Kein `LATERAL`; `CROSS APPLY` entspricht `CROSS JOIN LATERAL`, `OUTER APPLY` dem `LEFT JOIN LATERAL … ON TRUE`.",
        mdn: MS + 'queries/from-transact-sql'
      },
      sqlite: { none: "Kein `LATERAL`; Top-N je Gruppe mit `ROW_NUMBER()` in einer CTE (siehe „Top-N pro Gruppe“) oder mit einer korrelierten Unterabfrage im `WHERE`." }
    },
    tip: "Mit Index auf `(kunde_id, betrag)` ist `LATERAL` mit Zeilenbegrenzung oft schneller als `ROW_NUMBER()` über die ganze Tabelle.",
    keywords: ['lateral', 'cross apply', 'outer apply', 'korrelierter join', 'top n je gruppe', 'for each', 'apply'],
    related: ['Top-N pro Gruppe', 'Korrelierte Unterabfrage', 'Abgeleitete Tabelle'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Joins', name: 'Join-Bedingung vs. WHERE',
    desc: "Bei Outer Joins macht es einen Unterschied, ob eine Bedingung in ON oder WHERE steht.",
    details: "Beim `INNER JOIN` ist es egal. Beim `LEFT JOIN` bestimmt `ON`, welche rechten Zeilen als Partner gelten – linke Zeilen bleiben immer erhalten. `WHERE` filtert danach das fertige Ergebnis und wirft dabei auch die mit NULL aufgefüllten Zeilen weg. Faustregel: Bedingungen auf die rechte Tabelle eines `LEFT JOIN` gehören in `ON`.",
    dialects: {
      std: {
        syntax: "LEFT JOIN b ON b.a_id = a.id AND b.bedingung   -- filtert Partner\nWHERE b.bedingung                             -- filtert Ergebnis",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO kunden VALUES (1, 'Ada'), (2, 'Ben'), (3, 'Cem');
INSERT INTO bestellungen VALUES (1, 1, 120, '2026-01-10'), (2, 2, 200, '2025-12-15'), (3, 1, 80, '2026-02-03');

-- Bedingung im ON: alle Kunden bleiben
SELECT k.name, COUNT(b.id) AS bestellungen_2026
FROM kunden k
LEFT JOIN bestellungen b ON b.kunde_id = k.id AND b.datum >= '2026-01-01'
GROUP BY k.id, k.name ORDER BY k.id;
-- name | bestellungen_2026
-- Ada  | 2
-- Ben  | 0
-- Cem  | 0

-- Bedingung im WHERE: wirkt wie INNER JOIN
SELECT k.name, COUNT(b.id) AS bestellungen_2026
FROM kunden k
LEFT JOIN bestellungen b ON b.kunde_id = k.id
WHERE b.datum >= '2026-01-01'
GROUP BY k.id, k.name ORDER BY k.id;
-- name | bestellungen_2026
-- Ada  | 2
`)
      }
    },
    tip: "Ausnahme: `WHERE b.id IS NULL` gehört bewusst ins `WHERE` – so entsteht ein Anti-Join.",
    keywords: ['on oder where', 'join bedingung', 'left join filter', 'outer join where', 'fehler left join'],
    related: ['LEFT JOIN', 'Anti-Join', 'WHERE', 'Logische Abfragereihenfolge'],
    mdn: PG + 'queries-table-expressions.html'
  },

  // ---------------- Unterabfragen ----------------
  {
    lang: 'sql', group: 'Unterabfragen', name: 'Unterabfrage',
    desc: "Ein SELECT in Klammern innerhalb einer anderen Anweisung (Subquery).",
    details: "Unterabfragen stehen im `WHERE` (Vergleich, `IN`, `EXISTS`), im `SELECT` (skalarer Wert) oder im `FROM` (abgeleitete Tabelle). Sie können eigenständig sein oder sich als korrelierte Unterabfrage auf die äußere Zeile beziehen. Lange Verschachtelungen lassen sich mit `WITH` (CTE) lesbarer schreiben; für den Optimierer ist beides meist gleichwertig.",
    values: [
      ['Skalar', 'Genau ein Wert: eine Zeile, eine Spalte'],
      ['Zeilenliste', 'Eine Spalte, beliebig viele Zeilen: für IN, ANY, ALL'],
      ['Tabelle', 'Beliebige Ergebnismenge: im FROM oder für EXISTS']
    ],
    dialects: {
      std: {
        syntax: "WHERE spalte > (SELECT …)\nWHERE spalte IN (SELECT …)\nFROM (SELECT …) AS alias\nSELECT (SELECT …) AS wert",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

-- Wer verdient mehr als der Durchschnitt (4260)?
SELECT name, gehalt
FROM mitarbeiter
WHERE gehalt > (SELECT AVG(gehalt) FROM mitarbeiter)
ORDER BY gehalt DESC;
-- name | gehalt
-- Ada  | 5200
-- Dana | 4500
`)
      },
      pg: { note: "Seit PostgreSQL 16 ist der Alias für Unterabfragen im `FROM` optional." }
    },
    tip: "Unterabfragen immer in Klammern; im `FROM` verlangen der Standard und die meisten Datenbanken zusätzlich einen Alias.",
    keywords: ['subquery', 'unterabfrage', 'verschachtelt', 'nested query', 'inner query', 'subselect'],
    related: ['Skalare Unterabfrage', 'Korrelierte Unterabfrage', 'Abgeleitete Tabelle', 'WITH (CTE)'],
    mdn: PG + 'functions-subquery.html'
  },
  {
    lang: 'sql', group: 'Unterabfragen', name: 'Skalare Unterabfrage',
    desc: "Unterabfrage, die genau einen Wert liefert und wie eine Konstante verwendet wird.",
    details: "Sie darf überall stehen, wo ein einzelner Wert erwartet wird: im `SELECT`, im `WHERE`, in Berechnungen. Liefert sie keine Zeile, ist das Ergebnis NULL; liefert sie mehr als eine Zeile, ist das laut Standard ein Laufzeitfehler. Im `SELECT` wird eine korrelierte skalare Unterabfrage pro Zeile ausgeführt.",
    dialects: {
      std: {
        syntax: "SELECT spalte, (SELECT aggregat(…) FROM …) AS wert FROM …",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT name, gehalt,
       gehalt - (SELECT AVG(gehalt) FROM mitarbeiter) AS abweichung
FROM mitarbeiter
ORDER BY id;
-- name | gehalt | abweichung
-- Ada  | 5200   | 940.0
-- Ben  | 4100   | -160.0
-- Cem  | 3900   | -360.0
-- Dana | 4500   | 240.0
-- Eva  | 3600   | -660.0
`)
      },
      mssql: { note: "`AVG` über `INT` ist ganzzahlig – hier passt es zufällig, weil der Schnitt genau 4260 ist." },
      sqlite: { note: "Liefert die Unterabfrage mehrere Zeilen, nimmt SQLite ohne Fehlermeldung die erste." }
    },
    tip: "Dieselbe Rechnung geht ohne Unterabfrage mit einer Fensterfunktion: `gehalt - AVG(gehalt) OVER ()`.",
    keywords: ['scalar subquery', 'einzelwert', 'skalare unterabfrage', 'subquery im select'],
    related: ['Unterabfrage', 'OVER()', 'Korrelierte Unterabfrage'],
    mdn: PG + 'functions-subquery.html'
  },
  {
    lang: 'sql', group: 'Unterabfragen', name: 'IN (Unterabfrage)',
    desc: "Prüft, ob ein Wert in der Ergebnisliste einer Unterabfrage vorkommt.",
    details: "Die Unterabfrage muss genau eine Spalte liefern; Duplikate darin sind egal. `IN` arbeitet wie ein Semi-Join, jede äußere Zeile erscheint höchstens einmal. Die Umkehrung `NOT IN` ist gefährlich, sobald die Liste NULL enthält. Mehrspaltige Vergleiche (`(a, b) IN (SELECT x, y …)`) sieht der Standard vor, aber nicht jeder Dialekt.",
    dialects: {
      std: {
        syntax: "WHERE ausdruck IN (SELECT spalte FROM …)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 200), (4, 3, 40);

-- Kunden mit mindestens einer Bestellung ab 100
SELECT name
FROM kunden
WHERE id IN (SELECT kunde_id FROM bestellungen WHERE betrag >= 100)
ORDER BY name;
-- name
-- Ada
-- Ben
`)
      },
      pg: { note: "Große Listen aus der Anwendung übergibt man am besten als Array-Parameter: `WHERE id = ANY($1)`." },
      mssql: { note: "Kein mehrspaltiges `(a, b) IN (SELECT …)`; stattdessen `EXISTS` mit beiden Bedingungen." }
    },
    tip: "Für große Listen aus der Anwendung besser eine temporäre Tabelle oder einen Array-Parameter verwenden statt tausender Platzhalter.",
    keywords: ['in subquery', 'in liste', 'enthalten in', 'in select', 'semi join'],
    related: ['IN', 'EXISTS', 'NOT IN und NULL', 'Semi-Join'],
    mdn: PG + 'functions-subquery.html'
  },
  {
    lang: 'sql', group: 'Unterabfragen', name: 'EXISTS',
    desc: "Wahr, wenn die Unterabfrage mindestens eine Zeile liefert.",
    details: "Was die Unterabfrage auswählt, ist egal – üblich ist `SELECT 1`. `EXISTS` ist fast immer korreliert, bezieht sich also auf die äußere Zeile, und bricht beim ersten Treffer ab. Es liefert nie NULL, nur wahr oder falsch, und ist deshalb robuster als `IN` mit NULL-Werten.",
    dialects: {
      std: {
        syntax: "WHERE EXISTS (SELECT 1 FROM b WHERE b.a_id = a.id [AND …])",
        example: e(`
CREATE TABLE abteilungen (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung_id INT, gehalt INT);
INSERT INTO abteilungen VALUES (1, 'IT'), (2, 'Vertrieb'), (3, 'HR');
INSERT INTO mitarbeiter VALUES (1, 'Ada', 1, 5200), (2, 'Ben', 1, 4100), (3, 'Cem', 2, 3900), (4, 'Dana', 2, 4500);

-- Abteilungen mit mindestens einer Person über 4400
SELECT a.name
FROM abteilungen a
WHERE EXISTS (
  SELECT 1 FROM mitarbeiter m
  WHERE m.abteilung_id = a.id AND m.gehalt > 4400
)
ORDER BY a.name;
-- name
-- IT
-- Vertrieb
`)
      }
    },
    tip: "Ein Index auf der Korrelationsspalte (`mitarbeiter.abteilung_id`) macht `EXISTS` schnell.",
    keywords: ['exists', 'existiert', 'vorhanden', 'mindestens eine', 'semi join', 'where exists'],
    related: ['NOT EXISTS', 'Semi-Join', 'Korrelierte Unterabfrage', 'IN (Unterabfrage)'],
    mdn: PG + 'functions-subquery.html'
  },
  {
    lang: 'sql', group: 'Unterabfragen', name: 'NOT EXISTS',
    desc: "Wahr, wenn die Unterabfrage keine Zeile liefert – der sichere Anti-Join.",
    details: "Findet Zeilen ohne Partner und ist die empfohlene Alternative zu `NOT IN`, weil NULL-Werte keine Rolle spielen. Die Bedingung in der Unterabfrage bestimmt, was als „Partner“ gilt. Optimierer wandeln `NOT EXISTS` in einen effizienten Anti-Join um.",
    dialects: {
      std: {
        syntax: "WHERE NOT EXISTS (SELECT 1 FROM b WHERE b.a_id = a.id)",
        example: e(`
CREATE TABLE abteilungen (id INT PRIMARY KEY, name VARCHAR(50));
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung_id INT, gehalt INT);
INSERT INTO abteilungen VALUES (1, 'IT'), (2, 'Vertrieb'), (3, 'HR');
INSERT INTO mitarbeiter VALUES (1, 'Ada', 1, 5200), (2, 'Ben', 1, 4100), (3, 'Cem', 2, 3900), (4, 'Dana', 2, 4500);

-- Abteilungen ohne Mitarbeiter
SELECT a.name
FROM abteilungen a
WHERE NOT EXISTS (SELECT 1 FROM mitarbeiter m WHERE m.abteilung_id = a.id)
ORDER BY a.name;
-- name
-- HR
`)
      }
    },
    tip: "Auch zum Aufräumen nützlich: `DELETE FROM a WHERE NOT EXISTS (…)` entfernt verwaiste Datensätze.",
    keywords: ['not exists', 'existiert nicht', 'ohne', 'anti join', 'fehlende datensätze'],
    related: ['EXISTS', 'Anti-Join', 'NOT IN und NULL'],
    mdn: PG + 'functions-subquery.html'
  },
  {
    lang: 'sql', group: 'Unterabfragen', name: 'Korrelierte Unterabfrage',
    desc: "Unterabfrage, die sich auf Spalten der äußeren Zeile bezieht.",
    details: "Logisch wird sie für jede äußere Zeile neu ausgewertet; der Alias der äußeren Tabelle (`m.abteilung`) stellt die Verbindung her. Optimierer wandeln viele korrelierte Unterabfragen in Joins um, aber nicht alle – bei großen Tabellen ist ein Join mit vorab aggregierter Tabelle oder eine Fensterfunktion oft schneller. Ohne Alias kann ein Spaltenname versehentlich auf die innere statt die äußere Tabelle zeigen.",
    dialects: {
      std: {
        syntax: "SELECT …\nFROM t AS aussen\nWHERE spalte > (SELECT … FROM t WHERE t.x = aussen.x)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

-- Wer verdient mehr als der Schnitt der eigenen Abteilung?
SELECT name, abteilung, gehalt
FROM mitarbeiter AS m
WHERE gehalt > (SELECT AVG(gehalt) FROM mitarbeiter WHERE abteilung = m.abteilung)
ORDER BY name;
-- name | abteilung | gehalt
-- Ada  | IT        | 5200
-- Dana | Vertrieb  | 4500
`)
      }
    },
    tip: "In Unterabfragen alle Spalten mit Tabellenalias qualifizieren – ein Tippfehler im Spaltennamen fällt sonst nicht auf, wenn er zufällig eine Spalte der äußeren Tabelle trifft.",
    keywords: ['correlated subquery', 'korreliert', 'abhängige unterabfrage', 'pro zeile', 'äußere zeile'],
    related: ['EXISTS', 'Unterabfrage', 'PARTITION BY', 'LATERAL'],
    mdn: PG + 'functions-subquery.html'
  },
  {
    lang: 'sql', group: 'Unterabfragen', name: 'Abgeleitete Tabelle',
    desc: "Unterabfrage im FROM, die wie eine Tabelle abgefragt wird (Derived Table).",
    details: "Das Ergebnis der Unterabfrage bekommt einen Alias und kann gejoint, gefiltert und gruppiert werden – etwa um auf ein Aggregat ein weiteres anzuwenden oder um nach einem berechneten Alias zu filtern. Sie kann nicht auf andere Tabellen derselben `FROM`-Ebene zugreifen (dafür gibt es `LATERAL`). Eine CTE mit `WITH` ist meist lesbarer.",
    dialects: {
      std: {
        syntax: "SELECT …\nFROM (SELECT …) AS alias\n[WHERE …]",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT abteilung, summe
FROM (
  SELECT abteilung, SUM(gehalt) AS summe
  FROM mitarbeiter
  GROUP BY abteilung
) AS s
WHERE summe > 5000
ORDER BY summe DESC;
-- abteilung | summe
-- IT        | 9300
-- Vertrieb  | 8400
`)
      },
      pg: { note: "Der Alias ist seit PostgreSQL 16 optional, vorher Pflicht." },
      mssql: { note: "`ORDER BY` ist in einer abgeleiteten Tabelle nur zusammen mit `TOP` oder `OFFSET` erlaubt." }
    },
    tip: "Den Alias (`AS s`) einfach immer angeben – viele Datenbanken verlangen ihn.",
    keywords: ['derived table', 'inline view', 'unterabfrage im from', 'subquery from', 'abgeleitete tabelle'],
    related: ['WITH (CTE)', 'Unterabfrage', 'LATERAL'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Unterabfragen', name: 'ANY / ALL',
    desc: "Vergleichen einen Wert mit jedem Element einer Unterabfrage: mindestens einer bzw. alle.",
    details: "`x > ANY (…)` ist wahr, wenn x größer als mindestens ein Wert ist; `x > ALL (…)` nur, wenn x größer als alle ist. `= ANY` entspricht `IN`, `<> ALL` entspricht `NOT IN` (mit derselben NULL-Falle). Bei leerer Unterabfrage ist `ALL` immer wahr und `ANY` immer falsch.",
    values: [
      ['> ANY (…)', 'größer als das Minimum'],
      ['> ALL (…)', 'größer als das Maximum'],
      ['= ANY (…)', 'wie IN'],
      ['<> ALL (…)', 'wie NOT IN'],
      ['SOME', 'Synonym für ANY']
    ],
    dialects: {
      std: {
        syntax: "ausdruck operator ANY (SELECT …)\nausdruck operator ALL (SELECT …)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

-- verdient mehr als alle im Vertrieb (> 4500)
SELECT name, gehalt FROM mitarbeiter
WHERE gehalt > ALL (SELECT gehalt FROM mitarbeiter WHERE abteilung = 'Vertrieb')
ORDER BY name;
-- name | gehalt
-- Ada  | 5200

-- verdient mehr als irgendwer im Vertrieb (> 3900)
SELECT name, gehalt FROM mitarbeiter
WHERE gehalt > ANY (SELECT gehalt FROM mitarbeiter WHERE abteilung = 'Vertrieb')
ORDER BY name;
-- name | gehalt
-- Ada  | 5200
-- Ben  | 4100
-- Dana | 4500
`)
      },
      pg: { note: "`ANY`/`ALL` funktionieren zusätzlich mit Arrays: `WHERE id = ANY(ARRAY[1, 2, 3])`." },
      sqlite: {
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

-- statt > ALL: größer als das Maximum
SELECT name, gehalt FROM mitarbeiter
WHERE gehalt > (SELECT MAX(gehalt) FROM mitarbeiter WHERE abteilung = 'Vertrieb')
ORDER BY name;
-- name | gehalt
-- Ada  | 5200

-- statt > ANY: größer als das Minimum
SELECT name, gehalt FROM mitarbeiter
WHERE gehalt > (SELECT MIN(gehalt) FROM mitarbeiter WHERE abteilung = 'Vertrieb')
ORDER BY name;
-- name | gehalt
-- Ada  | 5200
-- Ben  | 4100
-- Dana | 4500
`),
        note: "Kein `ANY`/`ALL`; mit `MAX()`/`MIN()` in einer skalaren Unterabfrage umschreiben. Achtung: Bei NULL in der Liste verhalten sich beide Schreibweisen unterschiedlich."
      }
    },
    tip: "Portabel und meist klarer: `gehalt > (SELECT MAX(gehalt) FROM …)` statt `> ALL`.",
    keywords: ['any', 'all', 'some', 'quantor', 'alle', 'mindestens einer', 'vergleich mit liste'],
    related: ['IN (Unterabfrage)', 'MIN() / MAX()', 'NOT IN und NULL'],
    mdn: PG + 'functions-subquery.html'
  },
  {
    lang: 'sql', group: 'Unterabfragen', name: 'NOT IN und NULL',
    desc: "Enthält die Liste hinter NOT IN ein NULL, liefert die Abfrage keine einzige Zeile.",
    details: "`x NOT IN (1, NULL)` bedeutet `x <> 1 AND x <> NULL`; der zweite Vergleich ist unbekannt, also ist das Ganze nie wahr. Das passiert unbemerkt, sobald eine Spalte der Unterabfrage NULL-Werte enthält. Abhilfe: `NOT EXISTS` verwenden oder in der Unterabfrage `WHERE spalte IS NOT NULL` ergänzen.",
    dialects: {
      std: {
        syntax: "-- riskant\nWHERE x NOT IN (SELECT spalte FROM …)\n-- sicher\nWHERE NOT EXISTS (SELECT 1 FROM … WHERE spalte = x)",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, NULL, 80);

-- Ergebnis: keine einzige Zeile!
SELECT name FROM kunden WHERE id NOT IN (SELECT kunde_id FROM bestellungen);
-- name

SELECT name FROM kunden k
WHERE NOT EXISTS (SELECT 1 FROM bestellungen b WHERE b.kunde_id = k.id)
ORDER BY name;
-- name
-- Ben
-- Cem
`)
      }
    },
    tip: "Code-Review-Regel: `NOT IN` nur mit festen Literal-Listen, mit Unterabfragen immer `NOT EXISTS`.",
    keywords: ['not in null', 'null falle', 'leeres ergebnis', 'not in fehler', 'dreiwertige logik'],
    related: ['NOT EXISTS', 'Dreiwertige Logik', 'Anti-Join', 'NULL in Vergleichen'],
    mdn: PG + 'functions-subquery.html'
  },

  // ---------------- Mengenoperationen ----------------
  {
    lang: 'sql', group: 'Mengenoperationen', name: 'UNION',
    desc: "Hängt die Ergebnisse zweier Abfragen aneinander und entfernt Duplikate.",
    details: "Beide Abfragen brauchen gleich viele Spalten mit verträglichen Typen; die Spaltennamen kommen aus der ersten Abfrage. Das Entfernen der Duplikate kostet eine Sortierung oder Hash-Operation – wenn keine Duplikate möglich oder gewünscht sind, `UNION ALL` nehmen. `ORDER BY` und eine Zeilenbegrenzung stehen einmal am Ende und gelten für das Gesamtergebnis.",
    dialects: {
      std: {
        syntax: "SELECT a, b FROM t1\nUNION\nSELECT a, b FROM t2\n[ORDER BY …];",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE lieferanten (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'München'), (4, 'Dana', 'Berlin');
INSERT INTO lieferanten VALUES (1, 'Nord AG', 'Köln'), (2, 'Süd GmbH', 'Berlin'), (3, 'Ost KG', 'München');

SELECT stadt FROM kunden
UNION
SELECT stadt FROM lieferanten
ORDER BY stadt;
-- stadt
-- Berlin
-- Hamburg
-- Köln
-- München
`)
      },
      sqlite: { note: "Das `ORDER BY` am Ende einer Mengenoperation darf nur Ergebnisspalten (Name oder Nummer) nennen, keine beliebigen Ausdrücke." }
    },
    tip: "Für eine Herkunftsspalte eine Konstante mitgeben: `SELECT 'Kunde' AS typ, name FROM kunden UNION ALL SELECT 'Lieferant', name FROM lieferanten`.",
    keywords: ['union', 'vereinigung', 'zusammenführen', 'ergebnisse kombinieren', 'mengen', 'anhängen'],
    related: ['UNION ALL', 'INTERSECT', 'EXCEPT', 'DISTINCT'],
    mdn: PG + 'queries-union.html'
  },
  {
    lang: 'sql', group: 'Mengenoperationen', name: 'UNION ALL',
    desc: "Hängt die Ergebnisse zweier Abfragen aneinander, Duplikate bleiben erhalten.",
    details: "Schneller als `UNION`, weil nichts sortiert oder verglichen werden muss. Die richtige Wahl, wenn sich die Teilmengen ohnehin nicht überschneiden (etwa Daten aus verschiedenen Jahren) oder wenn Duplikate zählen sollen. Ohne `ORDER BY` am Ende ist die Reihenfolge nicht garantiert.",
    dialects: {
      std: {
        syntax: "SELECT … FROM t1\nUNION ALL\nSELECT … FROM t2;",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE lieferanten (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'München'), (4, 'Dana', 'Berlin');
INSERT INTO lieferanten VALUES (1, 'Nord AG', 'Köln'), (2, 'Süd GmbH', 'Berlin'), (3, 'Ost KG', 'München');

SELECT stadt, COUNT(*) AS anzahl
FROM (
  SELECT stadt FROM kunden
  UNION ALL
  SELECT stadt FROM lieferanten
) AS alle
GROUP BY stadt
ORDER BY anzahl DESC, stadt;
-- stadt   | anzahl
-- Berlin  | 3
-- München | 2
-- Hamburg | 1
-- Köln    | 1
`)
      }
    },
    tip: "`UNION` aus Gewohnheit statt `UNION ALL` ist ein häufiger, unnötiger Performance-Verlust.",
    keywords: ['union all', 'mit duplikaten', 'anhängen', 'zusammenfügen', 'stapeln'],
    related: ['UNION', 'GROUPING SETS', 'Abgeleitete Tabelle'],
    mdn: PG + 'queries-union.html'
  },
  {
    lang: 'sql', group: 'Mengenoperationen', name: 'INTERSECT',
    desc: "Liefert nur die Zeilen, die in beiden Abfrageergebnissen vorkommen.",
    details: "Vergleicht ganze Zeilen über alle Spalten, wobei NULL hier als gleich zu NULL gilt (anders als bei `=`). Duplikate werden entfernt; `INTERSECT ALL` behält sie, wird aber nicht überall unterstützt. `INTERSECT` bindet stärker als `UNION` und `EXCEPT`.",
    dialects: {
      std: {
        syntax: "SELECT … FROM t1\nINTERSECT [ALL]\nSELECT … FROM t2;",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE lieferanten (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'München'), (4, 'Dana', 'Berlin');
INSERT INTO lieferanten VALUES (1, 'Nord AG', 'Köln'), (2, 'Süd GmbH', 'Berlin'), (3, 'Ost KG', 'München');

-- Städte mit Kunden und Lieferanten
SELECT stadt FROM kunden
INTERSECT
SELECT stadt FROM lieferanten
ORDER BY stadt;
-- stadt
-- Berlin
-- München
`)
      },
      pg: { note: "Kennt auch `INTERSECT ALL`." },
      mysql: { note: "`INTERSECT` gibt es erst seit MySQL 8.0.31, dann auch mit `ALL`; vorher per `WHERE … IN (SELECT …)` nachbauen.", mdn: MY + 'intersect.html' },
      mssql: { note: "Kein `INTERSECT ALL`, nur `INTERSECT`." },
      sqlite: { note: "Kein `INTERSECT ALL`, nur `INTERSECT`." }
    },
    tip: "Für eine einzelne Spalte ist `WHERE … IN (SELECT …)` ähnlich; `INTERSECT` glänzt beim Vergleich ganzer Zeilen.",
    keywords: ['intersect', 'schnittmenge', 'gemeinsam', 'in beiden', 'durchschnitt mengen'],
    related: ['EXCEPT', 'UNION', 'Semi-Join'],
    mdn: PG + 'queries-union.html'
  },
  {
    lang: 'sql', group: 'Mengenoperationen', name: 'EXCEPT',
    desc: "Liefert Zeilen der ersten Abfrage, die in der zweiten nicht vorkommen.",
    details: "Die Mengendifferenz: Die Reihenfolge der Abfragen ist entscheidend. Duplikate werden entfernt, NULL gilt als gleich NULL – damit gibt es nicht die NULL-Falle von `NOT IN`. Oracle nennt den Operator `MINUS`. Gut geeignet, um zwei Tabellen auf Unterschiede zu vergleichen.",
    dialects: {
      std: {
        syntax: "SELECT … FROM t1\nEXCEPT [ALL]\nSELECT … FROM t2;",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE lieferanten (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'München'), (4, 'Dana', 'Berlin');
INSERT INTO lieferanten VALUES (1, 'Nord AG', 'Köln'), (2, 'Süd GmbH', 'Berlin'), (3, 'Ost KG', 'München');

-- Städte mit Kunden, aber ohne Lieferanten
SELECT stadt FROM kunden
EXCEPT
SELECT stadt FROM lieferanten
ORDER BY stadt;
-- stadt
-- Hamburg
`)
      },
      pg: { note: "Kennt auch `EXCEPT ALL`." },
      mysql: { note: "`EXCEPT` gibt es erst seit MySQL 8.0.31, dann auch mit `ALL`; vorher per `NOT EXISTS` nachbauen.", mdn: MY + 'except.html' },
      mssql: { note: "Kein `EXCEPT ALL`, nur `EXCEPT`." },
      sqlite: { note: "Kein `EXCEPT ALL`, nur `EXCEPT`." }
    },
    tip: "Zwei Tabellen auf Gleichheit prüfen: `(A EXCEPT B) UNION ALL (B EXCEPT A)` muss leer sein.",
    keywords: ['except', 'minus', 'differenz', 'mengendifferenz', 'ohne', 'unterschied'],
    related: ['INTERSECT', 'UNION', 'Anti-Join'],
    mdn: PG + 'queries-union.html'
  },

  // ---------------- Common Table Expressions ----------------
  {
    lang: 'sql', group: 'Common Table Expressions', name: 'WITH (CTE)',
    desc: "Benennt eine Unterabfrage vorab, damit die Hauptabfrage sie wie eine Tabelle nutzt.",
    details: "Eine Common Table Expression gilt nur für die eine Anweisung, in der sie steht. Sie macht verschachtelte Abfragen von oben nach unten lesbar und kann mehrfach referenziert werden. Ob der Optimierer sie wie eine eingebettete Unterabfrage behandelt oder einmal vorab berechnet, hängt vom Dialekt ab.",
    dialects: {
      std: {
        syntax: "WITH name [(spalten)] AS (\n  SELECT …\n)\nSELECT … FROM name …;",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

WITH abt AS (
  SELECT abteilung, AVG(gehalt) AS schnitt
  FROM mitarbeiter
  GROUP BY abteilung
)
SELECT m.name, m.gehalt, a.schnitt
FROM mitarbeiter m
JOIN abt a ON a.abteilung = m.abteilung
WHERE m.gehalt > a.schnitt
ORDER BY m.name;
-- name | gehalt | schnitt
-- Ada  | 5200   | 4650.0
-- Dana | 4500   | 4200.0
`)
      },
      pg: { note: "Seit PostgreSQL 12 werden einfache CTEs in die Hauptabfrage eingebettet; `WITH abt AS MATERIALIZED (…)` erzwingt eine einmalige Berechnung.", mdn: PG + 'queries-with.html' },
      mysql: { note: "CTEs gibt es seit MySQL 8.0.", mdn: MY + 'with.html' },
      mssql: { note: "Die Anweisung vor `WITH` muss mit `;` enden – deshalb sieht man oft `;WITH`. CTEs werden immer eingebettet, nie zwischengespeichert.", mdn: MS + 'queries/with-common-table-expression-transact-sql' },
      sqlite: { note: "Wie PostgreSQL: `AS MATERIALIZED` bzw. `AS NOT MATERIALIZED` steuern die Berechnung (seit 3.35).", mdn: SL + 'lang_with.html' }
    },
    tip: "Eine CTE, die mehrfach verwendet wird und teuer ist, lohnt sich als `MATERIALIZED` oder als temporäre Tabelle.",
    keywords: ['cte', 'common table expression', 'with', 'with klausel', 'benannte unterabfrage', 'temporäres ergebnis', 'materialized'],
    related: ['Mehrere CTEs', 'Rekursive CTE', 'Abgeleitete Tabelle', 'CREATE VIEW'],
    mdn: PG + 'queries-with.html'
  },
  {
    lang: 'sql', group: 'Common Table Expressions', name: 'Mehrere CTEs',
    desc: "Mehrere benannte Schritte, durch Komma getrennt, die aufeinander aufbauen können.",
    details: "Nach einem einzigen `WITH` folgen beliebig viele CTEs, getrennt durch Kommas; jede darf die vorher definierten verwenden. So lässt sich eine komplexe Auswertung wie eine Pipeline in kleine, benannte Schritte zerlegen. Ein zweites `WITH` vor der nächsten CTE ist ein Syntaxfehler.",
    dialects: {
      std: {
        syntax: "WITH a AS (…),\n     b AS (SELECT … FROM a …)\nSELECT … FROM b;",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Ada', 'Berlin'), (2, 'Ben', 'Hamburg'), (3, 'Cem', 'Köln');
INSERT INTO bestellungen VALUES (1, 1, 120), (2, 1, 80), (3, 2, 250), (4, 3, 40);

WITH umsatz AS (
  SELECT kunde_id, SUM(betrag) AS summe
  FROM bestellungen
  GROUP BY kunde_id
),
grosskunden AS (
  SELECT kunde_id, summe FROM umsatz WHERE summe >= 150
)
SELECT k.name, g.summe
FROM grosskunden g
JOIN kunden k ON k.id = g.kunde_id
ORDER BY g.summe DESC;
-- name | summe
-- Ben  | 250
-- Ada  | 200
`)
      },
      mssql: { note: "Reservierte Wörter wie `top` oder `order` taugen nicht als CTE-Namen." }
    },
    tip: "CTE-Namen wie Zwischenschritte benennen (`umsatz`, `grosskunden`) – dann liest sich die Abfrage wie eine Beschreibung.",
    keywords: ['mehrere cte', 'cte kette', 'with mehrere', 'pipeline', 'zwischenschritte'],
    related: ['WITH (CTE)', 'Rekursive CTE', 'Abgeleitete Tabelle'],
    mdn: PG + 'queries-with.html'
  },
  {
    lang: 'sql', group: 'Common Table Expressions', name: 'Rekursive CTE',
    desc: "CTE, die sich selbst referenziert – für Reihen, Bäume und Graphen.",
    details: "Sie besteht aus einem Startteil (Anker) und einem rekursiven Teil, verbunden mit `UNION ALL`. Der rekursive Teil läuft so lange auf den jeweils neuen Zeilen, bis er keine mehr liefert; eine Abbruchbedingung im `WHERE` ist Pflicht. Mit `UNION` statt `UNION ALL` werden Duplikate entfernt, was bei Zyklen den Abbruch sichert.",
    dialects: {
      std: {
        syntax: "WITH RECURSIVE name (spalten) AS (\n  SELECT …                -- Anker\n  UNION ALL\n  SELECT … FROM name …    -- rekursiver Teil\n  WHERE abbruch\n)\nSELECT … FROM name;",
        example: e(`
-- Zweierpotenzen 2^0 bis 2^5
WITH RECURSIVE potenzen (n, wert) AS (
  SELECT 0, 1
  UNION ALL
  SELECT n + 1, wert * 2 FROM potenzen WHERE n < 5
)
SELECT n, wert FROM potenzen ORDER BY n;
-- n | wert
-- 0 | 1
-- 1 | 2
-- 2 | 4
-- 3 | 8
-- 4 | 16
-- 5 | 32
`)
      },
      mysql: { note: "Die Rekursionstiefe begrenzt `cte_max_recursion_depth` (Standard 1000).", mdn: MY + 'with.html' },
      mssql: {
        syntax: "WITH name (spalten) AS (\n  SELECT …\n  UNION ALL\n  SELECT … FROM name … WHERE abbruch\n)\nSELECT … FROM name\n[OPTION (MAXRECURSION n)];",
        example: e(`
-- Zweierpotenzen 2^0 bis 2^5
WITH potenzen (n, wert) AS (
  SELECT 0, 1
  UNION ALL
  SELECT n + 1, wert * 2 FROM potenzen WHERE n < 5
)
SELECT n, wert FROM potenzen ORDER BY n;
-- n | wert
-- 0 | 1
-- 1 | 2
-- 2 | 4
-- 3 | 8
-- 4 | 16
-- 5 | 32
`),
        note: "Ohne das Wort `RECURSIVE`. Nach 100 Ebenen bricht die Abfrage mit Fehler ab; `OPTION (MAXRECURSION 1000)` am Ende ändert die Grenze (0 = unbegrenzt). Anker und rekursiver Teil müssen exakt dieselben Spaltentypen haben.",
        mdn: MS + 'queries/with-common-table-expression-transact-sql'
      }
    },
    tip: "Fehlt die Abbruchbedingung, läuft die Abfrage endlos – beim Testen zusätzlich eine maximale Tiefe einbauen (`WHERE n < 100`).",
    keywords: ['recursive', 'rekursiv', 'with recursive', 'rekursion', 'baum', 'graph', 'iteration', 'maxrecursion'],
    related: ['Hierarchie mit rekursiver CTE', 'Zahlenreihe erzeugen', 'WITH (CTE)', 'UNION ALL'],
    mdn: PG + 'queries-with.html'
  },
  {
    lang: 'sql', group: 'Common Table Expressions', name: 'Hierarchie mit rekursiver CTE',
    desc: "Durchläuft Baumstrukturen wie Organigramme oder Kategorien beliebig tief.",
    details: "Der Anker wählt die Wurzel(n), der rekursive Teil joint die Tabelle mit der CTE über die Eltern-Spalte und erhöht dabei z. B. eine Ebenen-Nummer oder baut einen Pfad auf. Nach dem Pfad sortiert ergibt sich die Baumreihenfolge. Der Pfad wird im Anker auf eine ausreichende Länge gecastet, weil der Spaltentyp aus dem Anker stammt. Bei möglichen Zyklen im Datenbestand den Pfad prüfen oder eine maximale Tiefe setzen.",
    dialects: {
      std: {
        syntax: "WITH RECURSIVE baum AS (\n  SELECT …, 0 AS ebene FROM t WHERE parent_id IS NULL\n  UNION ALL\n  SELECT …, b.ebene + 1 FROM t JOIN baum b ON t.parent_id = b.id\n)\nSELECT … FROM baum;",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), chef_id INT REFERENCES mitarbeiter(id));
INSERT INTO mitarbeiter VALUES (1, 'Ada', NULL), (2, 'Ben', 1), (3, 'Cem', 1), (4, 'Dana', 2), (5, 'Eva', 4);

WITH RECURSIVE baum (id, name, ebene, pfad) AS (
  SELECT id, name, 0, CAST(name AS VARCHAR(200)) FROM mitarbeiter WHERE chef_id IS NULL
  UNION ALL
  SELECT m.id, m.name, b.ebene + 1, CAST(b.pfad || ' > ' || m.name AS VARCHAR(200))
  FROM mitarbeiter m
  JOIN baum b ON m.chef_id = b.id
)
SELECT ebene, pfad FROM baum ORDER BY pfad;
-- ebene | pfad
-- 0     | Ada
-- 1     | Ada > Ben
-- 2     | Ada > Ben > Dana
-- 3     | Ada > Ben > Dana > Eva
-- 1     | Ada > Cem
`)
      },
      pg: { note: "Seit PostgreSQL 14 gibt es eigene Klauseln: `SEARCH DEPTH FIRST BY id SET ordnung` und `CYCLE id SET ist_zyklus`." },
      mysql: {
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), chef_id INT REFERENCES mitarbeiter(id));
INSERT INTO mitarbeiter VALUES (1, 'Ada', NULL), (2, 'Ben', 1), (3, 'Cem', 1), (4, 'Dana', 2), (5, 'Eva', 4);

WITH RECURSIVE baum (id, name, ebene, pfad) AS (
  SELECT id, name, 0, CAST(name AS CHAR(200)) FROM mitarbeiter WHERE chef_id IS NULL
  UNION ALL
  SELECT m.id, m.name, b.ebene + 1, CONCAT(b.pfad, ' > ', m.name)
  FROM mitarbeiter m
  JOIN baum b ON m.chef_id = b.id
)
SELECT ebene, pfad FROM baum ORDER BY pfad;
-- ebene | pfad
-- 0     | Ada
-- 1     | Ada > Ben
-- 2     | Ada > Ben > Dana
-- 3     | Ada > Ben > Dana > Eva
-- 1     | Ada > Cem
`),
        note: "Verkettung mit `CONCAT()`; `CAST` kennt kein `VARCHAR`, sondern `CHAR(n)`. Ohne den Cast im Anker wird der Pfad im strikten Modus mit „Data too long“ abgebrochen."
      },
      mssql: {
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), chef_id INT REFERENCES mitarbeiter(id));
INSERT INTO mitarbeiter VALUES (1, 'Ada', NULL), (2, 'Ben', 1), (3, 'Cem', 1), (4, 'Dana', 2), (5, 'Eva', 4);

WITH baum (id, name, ebene, pfad) AS (
  SELECT id, name, 0, CAST(name AS VARCHAR(200)) FROM mitarbeiter WHERE chef_id IS NULL
  UNION ALL
  SELECT m.id, m.name, b.ebene + 1, CAST(b.pfad + ' > ' + m.name AS VARCHAR(200))
  FROM mitarbeiter m
  JOIN baum b ON m.chef_id = b.id
)
SELECT ebene, pfad FROM baum ORDER BY pfad;
-- ebene | pfad
-- 0     | Ada
-- 1     | Ada > Ben
-- 2     | Ada > Ben > Dana
-- 3     | Ada > Ben > Dana > Eva
-- 1     | Ada > Cem
`),
        note: "Ohne `RECURSIVE`, Verkettung mit `+`. Beide Teile brauchen exakt denselben Typ – ohne die Casts meldet SQL Server „Types don't match between the anchor and the recursive part“. Für Baumstrukturen gibt es zusätzlich den Typ `hierarchyid`."
      }
    },
    tip: "Zum Einrücken in der Ausgabe: `REPEAT('  ', ebene) || name` bzw. `REPLICATE('  ', ebene) + name` in SQL Server.",
    keywords: ['hierarchie', 'baum', 'organigramm', 'eltern kind', 'parent child', 'tree', 'kategoriebaum', 'pfad'],
    related: ['Rekursive CTE', 'Self Join', '1:n-Beziehung'],
    mdn: PG + 'queries-with.html'
  },
  {
    lang: 'sql', group: 'Common Table Expressions', name: 'Zahlenreihe erzeugen',
    desc: "Erzeugt eine lückenlose Folge von Zahlen oder Daten, etwa um Lücken aufzufüllen.",
    details: "Mit einer rekursiven CTE entsteht eine Zahlenreihe ohne Hilfstabelle; per `LEFT JOIN` an echte Daten erscheinen auch Monate oder Tage ohne Einträge mit 0. Einige Dialekte haben dafür zusätzlich eine eigene Tabellenfunktion (siehe Tabs); die rekursive Variante funktioniert überall.",
    dialects: {
      std: {
        syntax: "WITH RECURSIVE zahlen (n) AS (\n  SELECT 1 UNION ALL SELECT n + 1 FROM zahlen WHERE n < 10\n)\nSELECT n FROM zahlen;",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, monat INT, betrag DECIMAL(10,2));
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 1, 50), (3, 3, 70);

-- Monate 1–4, auch ohne Bestellungen
WITH RECURSIVE monate (m) AS (
  SELECT 1
  UNION ALL
  SELECT m + 1 FROM monate WHERE m < 4
)
SELECT mo.m AS monat, COUNT(b.id) AS anzahl, COALESCE(SUM(b.betrag), 0) AS summe
FROM monate mo
LEFT JOIN bestellungen b ON b.monat = mo.m
GROUP BY mo.m
ORDER BY mo.m;
-- monat | anzahl | summe
-- 1     | 2      | 150
-- 2     | 0      | 0
-- 3     | 1      | 70
-- 4     | 0      | 0
`)
      },
      pg: { note: "Kürzer mit der Tabellenfunktion `generate_series(1, 4)`, auch für Datumsreihen: `generate_series(DATE '2026-01-01', DATE '2026-12-01', INTERVAL '1 month')`.", mdn: PG + 'functions-srf.html' },
      mssql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, monat INT, betrag DECIMAL(10,2));
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 1, 50), (3, 3, 70);

-- Monate 1–4, auch ohne Bestellungen
WITH monate (m) AS (
  SELECT 1
  UNION ALL
  SELECT m + 1 FROM monate WHERE m < 4
)
SELECT mo.m AS monat, COUNT(b.id) AS anzahl, COALESCE(SUM(b.betrag), 0) AS summe
FROM monate mo
LEFT JOIN bestellungen b ON b.monat = mo.m
GROUP BY mo.m
ORDER BY mo.m;
-- monat | anzahl | summe
-- 1     | 2      | 150
-- 2     | 0      | 0
-- 3     | 1      | 70
-- 4     | 0      | 0
`),
        note: "Rekursive CTE ohne `RECURSIVE`. Seit SQL Server 2022 geht es kürzer mit `SELECT value FROM GENERATE_SERIES(1, 4)`.",
        mdn: MS + 'functions/generate-series-transact-sql'
      },
      sqlite: { note: "Die Tabellenfunktion `generate_series(1, 4)` gibt es als Erweiterung, die z. B. in der `sqlite3`-Kommandozeile eingebaut ist." }
    },
    tip: "Kalender für einen Bericht einmal als Tabelle anlegen und per `LEFT JOIN` nutzen – das ist schneller als jedes Mal eine Reihe zu erzeugen.",
    keywords: ['zahlenreihe', 'generate_series', 'sequenz', 'lücken füllen', 'kalender', 'datumsreihe', 'series'],
    related: ['Rekursive CTE', 'LEFT JOIN', 'Datum rechnen'],
    mdn: PG + 'queries-with.html'
  },

  // ---------------- Fensterfunktionen ----------------
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'Fensterfunktionen',
    desc: "Rechnen über eine Gruppe verwandter Zeilen, ohne die Zeilen zusammenzufassen.",
    details: "Anders als bei `GROUP BY` bleibt jede Zeile erhalten und bekommt zusätzlich einen berechneten Wert – Rang, laufende Summe, Vorgängerwert oder Gruppensumme. Das Fenster wird mit `OVER (…)` beschrieben: Partitionierung, Sortierung und Rahmen. Fensterfunktionen werden nach `WHERE`, `GROUP BY` und `HAVING` ausgewertet und dürfen deshalb nur in `SELECT` und `ORDER BY` stehen.",
    values: [
      ['Ranking', 'ROW_NUMBER, RANK, DENSE_RANK, NTILE, PERCENT_RANK, CUME_DIST'],
      ['Wertzugriff', 'LAG, LEAD, FIRST_VALUE, LAST_VALUE, NTH_VALUE'],
      ['Aggregate', 'SUM, AVG, COUNT, MIN, MAX … mit OVER']
    ],
    dialects: {
      std: {
        syntax: "funktion(…) OVER (\n  [PARTITION BY …]\n  [ORDER BY …]\n  [ROWS | RANGE | GROUPS rahmen]\n)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT name, gehalt,
       RANK() OVER (ORDER BY gehalt DESC) AS platz,
       SUM(gehalt) OVER ()                AS gesamt
FROM mitarbeiter
ORDER BY platz;
-- name | gehalt | platz | gesamt
-- Ada  | 5200   | 1     | 21300
-- Dana | 4500   | 2     | 21300
-- Ben  | 4100   | 3     | 21300
-- Cem  | 3900   | 4     | 21300
-- Eva  | 3600   | 5     | 21300
`)
      },
      pg: { mdn: PG + 'tutorial-window.html', note: "Kann zusätzlich jedes Aggregat mit `FILTER (WHERE …)` als Fensterfunktion nutzen." },
      mysql: { note: "Fensterfunktionen gibt es seit MySQL 8.0. Namen wie `RANK` oder `ROWS` sind dadurch reservierte Wörter.", mdn: MY + 'window-functions.html' },
      mssql: { note: "Fensterfunktionen mit `ORDER BY` und Rahmen gibt es seit SQL Server 2012.", mdn: MS + 'queries/select-over-clause-transact-sql' },
      sqlite: { note: "Fensterfunktionen gibt es seit SQLite 3.25.", mdn: SL + 'windowfunctions.html' }
    },
    tip: "Nach einer Fensterfunktion filtern geht nicht direkt im `WHERE` – Abfrage in eine CTE packen und außen filtern.",
    keywords: ['window functions', 'fensterfunktion', 'analytische funktionen', 'over', 'analytic functions', 'olap'],
    related: ['OVER()', 'PARTITION BY', 'ROW_NUMBER()', 'Logische Abfragereihenfolge'],
    mdn: PG + 'tutorial-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'OVER()',
    desc: "Macht eine Funktion zur Fensterfunktion; leere Klammern = Fenster über alle Zeilen.",
    details: "`OVER ()` ohne Angaben umfasst das gesamte Abfrageergebnis (nach `WHERE`). So lassen sich Gesamtwerte neben Einzelwerte stellen, etwa für Prozentanteile, ohne Unterabfrage oder Join. Mit `ORDER BY` im `OVER` ändert sich bei Aggregaten der Standardrahmen: Dann wird kumulativ bis zur aktuellen Zeile gerechnet.",
    dialects: {
      std: {
        syntax: "aggregat(…) OVER ()\nfunktion(…) OVER (fensterdefinition)\nfunktion(…) OVER fenstername",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT name, gehalt,
       ROUND(100.0 * gehalt / SUM(gehalt) OVER (), 1) AS anteil_prozent
FROM mitarbeiter
ORDER BY id;
-- name | gehalt | anteil_prozent
-- Ada  | 5200   | 24.4
-- Ben  | 4100   | 19.2
-- Cem  | 3900   | 18.3
-- Dana | 4500   | 21.1
-- Eva  | 3600   | 16.9
`)
      }
    },
    tip: "`100.0 *` vorne erzwingt Dezimalrechnung; mit `100 *` und Ganzzahlspalten rechnen PostgreSQL, SQL Server und SQLite ganzzahlig.",
    keywords: ['over', 'over()', 'gesamtsumme', 'anteil', 'prozent', 'fenster'],
    related: ['Fensterfunktionen', 'PARTITION BY', 'Fensterrahmen (ROWS / RANGE)', 'Skalare Unterabfrage'],
    mdn: PG + 'tutorial-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'PARTITION BY',
    desc: "Teilt das Fenster in Gruppen; die Funktion rechnet je Gruppe getrennt.",
    details: "Wie `GROUP BY`, nur ohne die Zeilen zusammenzufassen: Jede Zeile sieht die Werte ihrer eigenen Partition. Ohne `PARTITION BY` bildet das gesamte Ergebnis eine einzige Partition. Mehrere Spalten oder Ausdrücke sind erlaubt, z. B. `PARTITION BY abteilung, standort`.",
    dialects: {
      std: {
        syntax: "funktion(…) OVER (PARTITION BY spalte [, …] [ORDER BY …])",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT name, abteilung, gehalt,
       SUM(gehalt) OVER (PARTITION BY abteilung) AS abt_summe,
       COUNT(*)    OVER (PARTITION BY abteilung) AS abt_anzahl
FROM mitarbeiter
ORDER BY abteilung, name;
-- name | abteilung | gehalt | abt_summe | abt_anzahl
-- Eva  | HR        | 3600   | 3600      | 1
-- Ada  | IT        | 5200   | 9300      | 2
-- Ben  | IT        | 4100   | 9300      | 2
-- Cem  | Vertrieb  | 3900   | 8400      | 2
-- Dana | Vertrieb  | 4500   | 8400      | 2
`)
      }
    },
    tip: "Ein Index auf `(partitionsspalte, sortierspalte)` erspart der Datenbank das Sortieren.",
    keywords: ['partition by', 'partitionieren', 'gruppe im fenster', 'pro gruppe', 'je abteilung'],
    related: ['OVER()', 'GROUP BY', 'Top-N pro Gruppe', 'Korrelierte Unterabfrage'],
    mdn: PG + 'tutorial-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'ROW_NUMBER()',
    desc: "Nummeriert die Zeilen eines Fensters fortlaufend 1, 2, 3 … ohne Lücken.",
    details: "Jede Zeile bekommt eine eindeutige Nummer gemäß dem `ORDER BY` im `OVER`; mit `PARTITION BY` beginnt die Zählung je Gruppe neu. Bei Gleichstand ist die Reihenfolge zufällig – für stabile Ergebnisse eine eindeutige Spalte (z. B. `id`) als zweites Sortierkriterium angeben. Typisch für Deduplizierung und „neuester Eintrag je Gruppe“.",
    dialects: {
      std: {
        syntax: "ROW_NUMBER() OVER ([PARTITION BY …] ORDER BY …)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT name, abteilung, gehalt,
       ROW_NUMBER() OVER (ORDER BY gehalt DESC)                        AS nr,
       ROW_NUMBER() OVER (PARTITION BY abteilung ORDER BY gehalt DESC) AS nr_abt
FROM mitarbeiter
ORDER BY nr;
-- name | abteilung | gehalt | nr | nr_abt
-- Ada  | IT        | 5200   | 1  | 1
-- Dana | Vertrieb  | 4500   | 2  | 1
-- Ben  | IT        | 4100   | 3  | 2
-- Cem  | Vertrieb  | 3900   | 4  | 2
-- Eva  | HR        | 3600   | 5  | 1
`)
      },
      mssql: { note: "Das `ORDER BY` im `OVER` ist Pflicht; für eine beliebige Nummerierung `ORDER BY (SELECT NULL)` schreiben." }
    },
    tip: "Zum Paginieren großer Tabellen ist Keyset-Paginierung schneller als `ROW_NUMBER() … WHERE nr BETWEEN …`.",
    keywords: ['row_number', 'zeilennummer', 'nummerieren', 'laufende nummer', 'durchnummerieren', 'rownum'],
    related: ['RANK() / DENSE_RANK()', 'Top-N pro Gruppe', 'Duplikate löschen', 'Paginierung (Keyset)'],
    mdn: PG + 'functions-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'RANK() / DENSE_RANK()',
    desc: "Vergeben Ränge mit Gleichstand: RANK mit Lücken, DENSE_RANK ohne Lücken.",
    details: "Zeilen mit gleichem Sortierwert bekommen denselben Rang. `RANK()` überspringt danach Plätze (1, 1, 3), wie bei einer Sportwertung; `DENSE_RANK()` zählt lückenlos weiter (1, 1, 2). `ROW_NUMBER()` dagegen vergibt auch bei Gleichstand verschiedene Nummern.",
    values: [
      ['ROW_NUMBER()', '1, 2, 3, 4 – immer eindeutig'],
      ['RANK()', '1, 1, 3, 4 – Lücke nach Gleichstand'],
      ['DENSE_RANK()', '1, 1, 2, 3 – keine Lücken']
    ],
    dialects: {
      std: {
        syntax: "RANK()       OVER ([PARTITION BY …] ORDER BY …)\nDENSE_RANK() OVER ([PARTITION BY …] ORDER BY …)",
        example: e(`
CREATE TABLE spieler (id INT PRIMARY KEY, name VARCHAR(50), punkte INT);
INSERT INTO spieler VALUES (1, 'Ada', 90), (2, 'Ben', 85), (3, 'Cem', 90), (4, 'Dana', 70), (5, 'Eva', 85);

SELECT name, punkte,
       RANK()       OVER (ORDER BY punkte DESC) AS rang,
       DENSE_RANK() OVER (ORDER BY punkte DESC) AS dichter_rang
FROM spieler
ORDER BY punkte DESC, name;
-- name | punkte | rang | dichter_rang
-- Ada  | 90     | 1    | 1
-- Cem  | 90     | 1    | 1
-- Ben  | 85     | 3    | 2
-- Eva  | 85     | 3    | 2
-- Dana | 70     | 5    | 3
`)
      },
      mysql: { note: "`RANK` und `DENSE_RANK` sind reservierte Wörter – als Spaltenname nur in Backticks." }
    },
    tip: "„Die drei höchsten Gehaltsstufen“ → `DENSE_RANK() <= 3`; „die besten drei Personen“ → `ROW_NUMBER() <= 3`.",
    keywords: ['rank', 'dense_rank', 'rang', 'platzierung', 'ranking', 'gleichstand', 'ties'],
    related: ['ROW_NUMBER()', 'PERCENT_RANK() / CUME_DIST()', 'Top-N pro Gruppe'],
    mdn: PG + 'functions-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'NTILE()',
    desc: "Verteilt die Zeilen auf n möglichst gleich große, nummerierte Gruppen.",
    details: "`NTILE(4)` ordnet jeder Zeile ein Quartil 1–4 zu, `NTILE(100)` ein Perzentil. Geht die Zeilenzahl nicht auf, sind die ersten Gruppen um eine Zeile größer. Gleiche Werte können dabei in verschiedenen Gruppen landen, weil nur nach Position aufgeteilt wird.",
    dialects: {
      std: {
        syntax: "NTILE(anzahl) OVER ([PARTITION BY …] ORDER BY …)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

-- 5 Zeilen auf 2 Gruppen: 3 + 2
SELECT name, gehalt, NTILE(2) OVER (ORDER BY gehalt DESC) AS haelfte
FROM mitarbeiter
ORDER BY gehalt DESC;
-- name | gehalt | haelfte
-- Ada  | 5200   | 1
-- Dana | 4500   | 1
-- Ben  | 4100   | 1
-- Cem  | 3900   | 2
-- Eva  | 3600   | 2
`)
      }
    },
    tip: "Für echte wertbasierte Perzentile eignen sich `PERCENT_RANK()` oder `PERCENTILE_CONT` besser.",
    keywords: ['ntile', 'quartil', 'perzentil', 'buckets', 'gruppen bilden', 'quantil', 'dezil'],
    related: ['PERCENT_RANK() / CUME_DIST()', 'ROW_NUMBER()', 'RANK() / DENSE_RANK()'],
    mdn: PG + 'functions-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'LAG() / LEAD()',
    desc: "Greifen auf den Wert der vorherigen bzw. nächsten Zeile im Fenster zu.",
    details: "`LAG(spalte)` liefert den Wert der Vorgängerzeile, `LEAD(spalte)` den der Nachfolgerzeile – ideal für Veränderungen zum Vormonat oder Zeitabstände. Ein zweites Argument gibt den Abstand an (Standard 1), ein drittes den Ersatzwert, wenn es keine solche Zeile gibt (sonst NULL). Das `ORDER BY` im `OVER` ist praktisch immer nötig.",
    dialects: {
      std: {
        syntax: "LAG(ausdruck [, abstand [, standard]]) OVER ([PARTITION BY …] ORDER BY …)\nLEAD(ausdruck [, abstand [, standard]]) OVER (…)",
        example: e(`
CREATE TABLE monatsumsatz (monat VARCHAR(7) PRIMARY KEY, umsatz INT);
INSERT INTO monatsumsatz VALUES ('2026-01', 1000), ('2026-02', 1200), ('2026-03', 900), ('2026-04', 1500);

SELECT monat, umsatz,
       LAG(umsatz) OVER (ORDER BY monat)          AS vormonat,
       umsatz - LAG(umsatz) OVER (ORDER BY monat) AS diff,
       LEAD(umsatz) OVER (ORDER BY monat)         AS folgemonat
FROM monatsumsatz
ORDER BY monat;
-- monat   | umsatz | vormonat | diff | folgemonat
-- 2026-01 | 1000   | NULL     | NULL | 1200
-- 2026-02 | 1200   | 1000     | 200  | 900
-- 2026-03 | 900    | 1200     | -300 | 1500
-- 2026-04 | 1500   | 900      | 600  | NULL
`)
      }
    },
    tip: "Fehlende Monate in den Daten verfälschen `LAG` – vorher mit einer Zahlen- bzw. Datumsreihe auffüllen.",
    keywords: ['lag', 'lead', 'vorherige zeile', 'nächste zeile', 'vormonat', 'differenz', 'previous row', 'next row'],
    related: ['FIRST_VALUE() / LAST_VALUE()', 'Laufende Summe', 'Zahlenreihe erzeugen'],
    mdn: PG + 'functions-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'FIRST_VALUE() / LAST_VALUE()',
    desc: "Liefern den ersten bzw. letzten Wert im aktuellen Fensterrahmen.",
    details: "Mit `ORDER BY` im `OVER` reicht der Standardrahmen nur vom Anfang bis zur aktuellen Zeile (genauer: bis zu ihren Gleichrangigen). Deshalb liefert `LAST_VALUE` ohne eigenen Rahmen meist nur den Wert der aktuellen Zeile – der klassische Fehler. Abhilfe: `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` oder `FIRST_VALUE` mit umgekehrter Sortierung. `NTH_VALUE(x, n)` liefert den n-ten Wert.",
    dialects: {
      std: {
        syntax: "FIRST_VALUE(ausdruck) OVER (… ORDER BY …)\nLAST_VALUE(ausdruck) OVER (… ORDER BY …\n  ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT name, abteilung, gehalt,
       FIRST_VALUE(name) OVER (PARTITION BY abteilung ORDER BY gehalt DESC) AS bestverdiener,
       LAST_VALUE(name)  OVER (PARTITION BY abteilung ORDER BY gehalt DESC
                               ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS geringverdiener
FROM mitarbeiter
ORDER BY abteilung, gehalt DESC;
-- name | abteilung | gehalt | bestverdiener | geringverdiener
-- Eva  | HR        | 3600   | Eva           | Eva
-- Ada  | IT        | 5200   | Ada           | Ben
-- Ben  | IT        | 4100   | Ada           | Ben
-- Dana | Vertrieb  | 4500   | Dana          | Cem
-- Cem  | Vertrieb  | 3900   | Dana          | Cem
`)
      },
      mssql: { note: "Kein `NTH_VALUE`; dafür ein Rang mit `ROW_NUMBER()` in einer CTE berechnen und filtern." }
    },
    tip: "Merksatz: `LAST_VALUE` immer mit explizitem Rahmen bis `UNBOUNDED FOLLOWING` schreiben.",
    keywords: ['first_value', 'last_value', 'nth_value', 'erster wert', 'letzter wert', 'fensterrahmen'],
    related: ['Fensterrahmen (ROWS / RANGE)', 'LAG() / LEAD()', 'MIN() / MAX()'],
    mdn: PG + 'functions-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'Laufende Summe',
    desc: "Kumulierte Summe bis zur aktuellen Zeile mit SUM() OVER (ORDER BY …).",
    details: "Sobald im `OVER` ein `ORDER BY` steht, summiert `SUM` vom Anfang bis zur aktuellen Zeile. Achtung: Der Standardrahmen ist `RANGE`, d. h. Zeilen mit gleichem Sortierwert werden gemeinsam addiert und zeigen denselben Stand. Für eine Summe Zeile für Zeile `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` angeben und eindeutig sortieren. Mit `PARTITION BY` beginnt die Summe je Gruppe neu.",
    dialects: {
      std: {
        syntax: "SUM(wert) OVER ([PARTITION BY …] ORDER BY …\n  [ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW])",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 1, 100, '2026-01-05'), (2, 2, 50, '2026-01-09'), (3, 1, 70, '2026-02-02'),
  (4, 3, 200, '2026-02-11'), (5, 2, 30, '2026-03-01');

SELECT datum, betrag,
       SUM(betrag) OVER (ORDER BY datum, id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS laufend
FROM bestellungen
ORDER BY datum, id;
-- datum      | betrag | laufend
-- 2026-01-05 | 100    | 100
-- 2026-01-09 | 50     | 150
-- 2026-02-02 | 70     | 220
-- 2026-02-11 | 200    | 420
-- 2026-03-01 | 30     | 450
`)
      },
      mssql: { note: "Hier lohnt das explizite `ROWS` doppelt: Der `RANGE`-Standardrahmen ist in SQL Server deutlich langsamer." }
    },
    tip: "Ohne Fensterfunktionen bräuchte man dafür eine korrelierte Unterabfrage pro Zeile – deutlich langsamer.",
    keywords: ['laufende summe', 'kumuliert', 'running total', 'cumulative sum', 'kumulative summe', 'saldo'],
    related: ['Fensterrahmen (ROWS / RANGE)', 'SUM()', 'Gleitender Durchschnitt'],
    mdn: PG + 'tutorial-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'Gleitender Durchschnitt',
    desc: "Durchschnitt über die letzten n Zeilen mit AVG() und einem ROWS-Rahmen.",
    details: "Der Rahmen `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` umfasst die aktuelle und die zwei vorherigen Zeilen, also einen 3er-Schnitt. Am Anfang stehen weniger Zeilen zur Verfügung, der Durchschnitt wird dann aus diesen gebildet. `ROWS` zählt Zeilen, nicht Tage – fehlen Tage in den Daten, umfasst das Fenster einen längeren Zeitraum; dafür eignet sich `RANGE` mit Intervall oder vorheriges Auffüllen.",
    dialects: {
      std: {
        syntax: "AVG(wert) OVER (ORDER BY …\n  ROWS BETWEEN n PRECEDING AND CURRENT ROW)",
        example: e(`
CREATE TABLE tagesumsatz (tag DATE PRIMARY KEY, umsatz INT);
INSERT INTO tagesumsatz VALUES
  ('2026-03-01', 100), ('2026-03-02', 200), ('2026-03-03', 150),
  ('2026-03-04', 250), ('2026-03-05', 50);

SELECT tag, umsatz,
       AVG(umsatz) OVER (ORDER BY tag ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS schnitt_3_tage
FROM tagesumsatz
ORDER BY tag;
-- tag        | umsatz | schnitt_3_tage
-- 2026-03-01 | 100    | 100.0
-- 2026-03-02 | 200    | 150.0
-- 2026-03-03 | 150    | 150.0
-- 2026-03-04 | 250    | 200.0
-- 2026-03-05 | 50     | 150.0
`)
      },
      pg: { note: "Für echte Zeiträume: `RANGE BETWEEN INTERVAL '2 days' PRECEDING AND CURRENT ROW`." },
      mysql: { note: "Für echte Zeiträume: `RANGE BETWEEN INTERVAL 2 DAY PRECEDING AND CURRENT ROW`." },
      mssql: { note: "`AVG` über `INT` ist ganzzahlig (hier gehen die Werte zufällig auf); sonst `AVG(CAST(umsatz AS DECIMAL(10,2)))`. `RANGE` mit Abstand gibt es nicht." }
    },
    tip: "Für zentrierte Glättung: `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING`.",
    keywords: ['gleitender durchschnitt', 'moving average', 'rolling average', 'glätten', 'trend', 'sma'],
    related: ['Fensterrahmen (ROWS / RANGE)', 'AVG()', 'Laufende Summe'],
    mdn: PG + 'tutorial-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'Fensterrahmen (ROWS / RANGE)',
    desc: "Legt fest, welche Zeilen um die aktuelle Zeile herum in die Berechnung eingehen.",
    details: "`ROWS` zählt physische Zeilen, `RANGE` arbeitet mit Werten der Sortierspalte und fasst Gleichrangige (Ties) zusammen, `GROUPS` zählt Gruppen gleicher Werte. Ohne Angabe gilt bei vorhandenem `ORDER BY` der Rahmen `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, sonst die ganze Partition. Welche Rahmenarten und Abstände erlaubt sind, unterscheidet sich je Dialekt.",
    values: [
      ['UNBOUNDED PRECEDING', 'Anfang der Partition'],
      ['n PRECEDING', 'n Zeilen (bzw. Wertabstand) davor'],
      ['CURRENT ROW', 'Aktuelle Zeile (bei RANGE: inkl. Gleichrangiger)'],
      ['n FOLLOWING', 'n Zeilen danach'],
      ['UNBOUNDED FOLLOWING', 'Ende der Partition']
    ],
    dialects: {
      std: {
        syntax: "{ ROWS | RANGE | GROUPS } BETWEEN start AND ende\n-- start/ende: UNBOUNDED PRECEDING | n PRECEDING | CURRENT ROW\n--             | n FOLLOWING | UNBOUNDED FOLLOWING",
        example: e(`
CREATE TABLE buchungen (id INT PRIMARY KEY, tag DATE, betrag INT);
INSERT INTO buchungen VALUES (1, '2026-01-01', 10), (2, '2026-01-01', 20), (3, '2026-01-02', 5);

SELECT tag, betrag,
       SUM(betrag) OVER (ORDER BY tag, id ROWS UNBOUNDED PRECEDING) AS mit_rows,
       SUM(betrag) OVER (ORDER BY tag RANGE UNBOUNDED PRECEDING)    AS mit_range
FROM buchungen
ORDER BY tag, id;
-- tag        | betrag | mit_rows | mit_range
-- 2026-01-01 | 10     | 10       | 30
-- 2026-01-01 | 20     | 30       | 30
-- 2026-01-02 | 5      | 35       | 35
`)
      },
      pg: { note: "Kann alle drei Rahmenarten (`GROUPS` seit 11) und `RANGE` mit Zahlen- oder Intervallabstand, z. B. `RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW`." },
      mysql: { note: "`ROWS` und `RANGE` (auch mit Intervall: `RANGE INTERVAL 7 DAY PRECEDING`), aber kein `GROUPS`.", mdn: MY + 'window-functions-frames.html' },
      mssql: { note: "`ROWS` und `RANGE`, aber kein `GROUPS`; `RANGE` erlaubt nur `UNBOUNDED` und `CURRENT ROW`, keine Abstände.", mdn: MS + 'queries/select-over-clause-transact-sql' },
      sqlite: { note: "Kann alle drei Rahmenarten (`GROUPS` seit 3.28) und `RANGE` mit Zahlenabstand.", mdn: SL + 'windowfunctions.html' }
    },
    tip: "Unerwartet gleiche Werte bei laufenden Summen? Das ist der `RANGE`-Standardrahmen – auf `ROWS` umstellen.",
    keywords: ['frame', 'fensterrahmen', 'rows between', 'range between', 'groups', 'preceding', 'following', 'current row', 'unbounded'],
    related: ['Laufende Summe', 'Gleitender Durchschnitt', 'FIRST_VALUE() / LAST_VALUE()'],
    mdn: SL + 'windowfunctions.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'WINDOW-Klausel',
    desc: "Definiert ein benanntes Fenster einmal, das mehrere Funktionen wiederverwenden.",
    details: "Die `WINDOW`-Klausel steht nach `HAVING` und vor `ORDER BY`; mehrere Funktionen verweisen mit `OVER name` darauf. Ein benanntes Fenster lässt sich auch erweitern, etwa `OVER (w ROWS BETWEEN …)`.",
    dialects: {
      std: {
        syntax: "SELECT f1() OVER w, f2() OVER w\nFROM …\nWINDOW w AS ([PARTITION BY …] [ORDER BY …])\n[ORDER BY …];",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT name, gehalt,
       RANK()      OVER w AS rang,
       SUM(gehalt) OVER w AS kumuliert
FROM mitarbeiter
WINDOW w AS (ORDER BY gehalt DESC)
ORDER BY rang;
-- name | gehalt | rang | kumuliert
-- Ada  | 5200   | 1    | 5200
-- Dana | 4500   | 2    | 9700
-- Ben  | 4100   | 3    | 13800
-- Cem  | 3900   | 4    | 17700
-- Eva  | 3600   | 5    | 21300
`)
      },
      mysql: { note: "Seit MySQL 8.0 verfügbar.", mdn: MY + 'window-functions-named-windows.html' },
      mssql: { note: "Erst seit SQL Server 2022 (Kompatibilitätsgrad 160); vorher die Fensterdefinition bei jeder Funktion wiederholen." },
      sqlite: { note: "Verfügbar seit SQLite 3.25, zusammen mit den Fensterfunktionen." }
    },
    tip: "Spart Wiederholungen und Tippfehler, wenn viele Fensterfunktionen dasselbe Fenster nutzen.",
    keywords: ['window', 'window klausel', 'benanntes fenster', 'named window', 'over w'],
    related: ['OVER()', 'Fensterfunktionen', 'PARTITION BY'],
    mdn: PG + 'sql-select.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'Top-N pro Gruppe',
    desc: "Die n besten Zeilen je Gruppe, z. B. die zwei Bestverdiener jeder Abteilung.",
    details: "Standardmuster: In einer CTE `ROW_NUMBER() OVER (PARTITION BY gruppe ORDER BY wert DESC)` berechnen und außen `WHERE nr <= n` filtern – direkt im `WHERE` geht es nicht, weil Fensterfunktionen erst danach berechnet werden. Mit `RANK()` statt `ROW_NUMBER()` kommen bei Gleichstand auch mehr als n Zeilen heraus. Alternativen: `LATERAL` mit Zeilenbegrenzung oder `QUALIFY` (Snowflake, DuckDB).",
    dialects: {
      std: {
        syntax: "WITH r AS (\n  SELECT …, ROW_NUMBER() OVER (PARTITION BY g ORDER BY w DESC) AS nr\n  FROM t\n)\nSELECT … FROM r WHERE nr <= n;",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600), (6, 'Finn', 'IT', 4800);

WITH r AS (
  SELECT name, abteilung, gehalt,
         ROW_NUMBER() OVER (PARTITION BY abteilung ORDER BY gehalt DESC) AS nr
  FROM mitarbeiter
)
SELECT abteilung, name, gehalt
FROM r
WHERE nr <= 2
ORDER BY abteilung, nr;
-- abteilung | name | gehalt
-- HR        | Eva  | 3600
-- IT        | Ada  | 5200
-- IT        | Finn | 4800
-- Vertrieb  | Dana | 4500
-- Vertrieb  | Cem  | 3900
`)
      },
      pg: { note: "Für genau eine Zeile je Gruppe gibt es zusätzlich `DISTINCT ON (abteilung) … ORDER BY abteilung, gehalt DESC`." },
      mssql: { note: "Alternative ohne CTE: `CROSS APPLY (SELECT TOP 2 … ORDER BY gehalt DESC)` je Gruppe (siehe `LATERAL`)." }
    },
    tip: "Mit `nr = 1` erhält man genau einen Datensatz je Gruppe, z. B. die neueste Bestellung je Kunde.",
    keywords: ['top n', 'top n pro gruppe', 'greatest n per group', 'beste je gruppe', 'neuester eintrag', 'qualify'],
    related: ['ROW_NUMBER()', 'LATERAL', 'WITH (CTE)', 'RANK() / DENSE_RANK()'],
    mdn: PG + 'tutorial-window.html'
  },
  {
    lang: 'sql', group: 'Fensterfunktionen', name: 'PERCENT_RANK() / CUME_DIST()',
    desc: "Relative Position einer Zeile im Fenster als Wert zwischen 0 und 1.",
    details: "`PERCENT_RANK()` = (Rang − 1) / (Zeilen − 1) und liegt zwischen 0 und 1; die erste Zeile hat immer 0. `CUME_DIST()` = Anteil der Zeilen mit kleinerem oder gleichem Wert, also zwischen 1/n und 1. Beide berücksichtigen Gleichstand wie `RANK()`. Gut für Aussagen wie „verdient mehr als 75 % der Kollegen“.",
    dialects: {
      std: {
        syntax: "PERCENT_RANK() OVER ([PARTITION BY …] ORDER BY …)\nCUME_DIST()    OVER ([PARTITION BY …] ORDER BY …)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'IT', 4100), (3, 'Cem', 'Vertrieb', 3900),
  (4, 'Dana', 'Vertrieb', 4500), (5, 'Eva', 'HR', 3600);

SELECT name, gehalt,
       PERCENT_RANK() OVER (ORDER BY gehalt) AS prozentrang,
       CUME_DIST()    OVER (ORDER BY gehalt) AS kumuliert
FROM mitarbeiter
ORDER BY gehalt;
-- name | gehalt | prozentrang | kumuliert
-- Eva  | 3600   | 0.0         | 0.2
-- Cem  | 3900   | 0.25        | 0.4
-- Ben  | 4100   | 0.5         | 0.6
-- Dana | 4500   | 0.75        | 0.8
-- Ada  | 5200   | 1.0         | 1.0
`)
      },
      pg: { note: "Für Median und Perzentile als Aggregat: `percentile_cont(0.5) WITHIN GROUP (ORDER BY gehalt)`." },
      mysql: { note: "Kein `PERCENTILE_CONT`; den Median über `ROW_NUMBER()` und `COUNT(*) OVER ()` selbst berechnen." },
      mssql: { note: "`PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY gehalt) OVER ()` liefert den Median – hier nur als Fensterfunktion, nicht als Aggregat.", mdn: MS + 'functions/percentile-cont-transact-sql' },
      sqlite: { note: "Median und Perzentile liefert die Erweiterung `percentile` (`median(x)`, `percentile_cont(x, 0.5)`), sofern einkompiliert." }
    },
    tip: "Für den Median ist `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY …)` die Standard-Schreibweise.",
    keywords: ['percent_rank', 'cume_dist', 'perzentil', 'prozentrang', 'kumulative verteilung', 'relative position', 'median', 'percentile_cont'],
    related: ['RANK() / DENSE_RANK()', 'NTILE()', 'Fensterfunktionen'],
    mdn: PG + 'functions-window.html'
  }
  );
})();
