window.CHEAT = window.CHEAT || [];
(function () {
  var PG = 'https://www.postgresql.org/docs/current/'; // + z. B. 'sql-select.html'
  var SL = 'https://sqlite.org/';                      // + z. B. 'lang_vacuum.html'
  var MY = 'https://dev.mysql.com/doc/refman/8.4/en/'; // MySQL-Referenzhandbuch
  var MS = 'https://learn.microsoft.com/en-us/sql/t-sql/'; // SQL Server (T-SQL)
  var MSR = 'https://learn.microsoft.com/en-us/sql/';      // SQL Server allgemein
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- PostgreSQL-Besonderheiten ----------------
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'DISTINCT ON',
    desc: 'Liefert je Gruppe genau eine Zeile – die erste laut ORDER BY.',
    details: '`DISTINCT ON (spalten)` behält von allen Zeilen mit gleichen Werten in den genannten Spalten nur die erste. Welche das ist, bestimmt `ORDER BY`: Es muss mit den `DISTINCT ON`-Spalten beginnen, danach folgt das Kriterium für „die erste“ (z. B. `datum DESC` für die neueste). Ideal für „letzter Eintrag je Kunde“ ohne Fensterfunktion.',
    tip: 'Ohne eindeutiges Sortierkriterium hinter den Gruppenspalten ist zufällig, welche Zeile gewinnt – notfalls die ID als letzten Sortierschlüssel anhängen.',
    keywords: ['distinct on', 'erste zeile je gruppe', 'neueste je gruppe', 'greatest n per group', 'letzter eintrag', 'postgresql'],
    related: ['Top-N pro Gruppe', 'ROW_NUMBER()', 'DISTINCT', 'LATERAL'],
    mdn: PG + 'sql-select.html#SQL-DISTINCT',
    dialects: {
      std: { none: 'Kein Standard. Portabel: `ROW_NUMBER() OVER (PARTITION BY … ORDER BY …)` in einer CTE berechnen und außen `WHERE nr = 1` filtern (siehe Top-N pro Gruppe).' },
      pg: {
        syntax: 'SELECT DISTINCT ON (gruppenspalten) spalten\nFROM tabelle\nORDER BY gruppenspalten, kriterium;',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 1, 120.00, '2026-03-01'), (2, 1, 80.50, '2026-03-05'),
  (3, 2, 45.00, '2026-03-02'), (4, 2, 300.00, '2026-03-04'),
  (5, 3, 19.90, '2026-02-27');

-- Neueste Bestellung je Kunde
SELECT DISTINCT ON (kunde_id) kunde_id, datum, betrag
FROM bestellungen
ORDER BY kunde_id, datum DESC, id DESC;
-- kunde_id | datum      | betrag
-- 1        | 2026-03-05 | 80.50
-- 2        | 2026-03-04 | 300.00
-- 3        | 2026-02-27 | 19.90
`)
      },
      mysql: { none: 'Kein `DISTINCT ON`; stattdessen `ROW_NUMBER() OVER (PARTITION BY …)` in einer CTE (ab MySQL 8.0, siehe Top-N pro Gruppe).' },
      mssql: { none: 'Kein `DISTINCT ON`; stattdessen `ROW_NUMBER() OVER (PARTITION BY …)` in einer CTE oder `CROSS APPLY (SELECT TOP (1) …)`.' },
      sqlite: {
        note: 'Kein `DISTINCT ON`. SQLite-Eigenheit: Steht genau ein `MAX()` oder `MIN()` in der Abfrage, stammen die übrigen Spalten aus der Zeile mit diesem Extremwert.',
        mdn: SL + 'lang_select.html#bare_columns_in_an_aggregate_query',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 1, 120.00, '2026-03-01'), (2, 1, 80.50, '2026-03-05'),
  (3, 2, 45.00, '2026-03-02'), (4, 2, 300.00, '2026-03-04'),
  (5, 3, 19.90, '2026-02-27');

-- betrag kommt aus der Zeile mit dem größten Datum
SELECT kunde_id, MAX(datum) AS datum, betrag
FROM bestellungen
GROUP BY kunde_id
ORDER BY kunde_id;
-- kunde_id | datum      | betrag
-- 1        | 2026-03-05 | 80.5
-- 2        | 2026-03-04 | 300
-- 3        | 2026-02-27 | 19.9
`)
      }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'Arrays (PostgreSQL)',
    desc: 'Eine Spalte kann eine Liste von Werten desselben Typs speichern, z. B. TEXT[].',
    details: 'Jeder Datentyp lässt sich mit `[]` zum Array machen. Elemente werden ab 1 gezählt (`tags[1]`), Literale schreibt man als `ARRAY[\'a\', \'b\']` oder `\'{a,b}\'`. Operatoren wie `@>` (enthält), `&&` (überschneidet sich) und Funktionen wie `array_append`, `cardinality` und `unnest` (Array → Zeilen) machen Arrays bequem; mit einem GIN-Index sind Suchen darin schnell. Für Beziehungen mit eigenen Attributen oder Fremdschlüsseln bleibt eine eigene Tabelle die bessere Wahl.',
    values: [
      ['arr[1]', 'Erstes Element (Zählung ab 1)'],
      ['arr @> ARRAY[x]', 'Enthält alle Elemente rechts'],
      ['arr && ARRAY[x, y]', 'Hat mindestens ein gemeinsames Element'],
      ['array_append(arr, x)', 'Element anhängen'],
      ['cardinality(arr)', 'Anzahl der Elemente'],
      ['unnest(arr)', 'Eine Zeile je Element'],
      ['array_agg(spalte)', 'Werte einer Gruppe zu einem Array sammeln']
    ],
    tip: 'Arrays verletzen die erste Normalform – für Tags oder Listen ohne eigene Attribute praktisch, für alles mit Fremdschlüssel lieber eine Zuordnungstabelle.',
    keywords: ['array', 'arrays', 'liste', 'text[]', 'int[]', 'unnest', 'array_agg', 'array_append', 'cardinality', 'tags', 'postgresql'],
    related: ['ANY(array)', '1. Normalform', 'n:m-Beziehung', 'JSON-Typ'],
    mdn: PG + 'arrays.html',
    dialects: {
      std: { none: 'Der Standard definiert `ARRAY`-Typen (z. B. `INTEGER ARRAY[10]`), von den gezeigten Systemen setzt sie aber nur PostgreSQL um. Portabel: Zuordnungstabelle (1:n) oder ein JSON-Array.' },
      pg: {
        syntax: 'spalte typ[]\nARRAY[wert1, wert2]  bzw.  \'{wert1,wert2}\'',
        mdn: PG + 'functions-array.html',
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), tags TEXT[]);
INSERT INTO produkte VALUES
  (1, 'Maus', ARRAY['usb', 'funk']),
  (2, 'Tastatur', '{usb,beleuchtet}'),
  (3, 'Monitor', ARRAY['hdmi']);

SELECT name, tags[1] AS erster_tag, cardinality(tags) AS anzahl,
       array_to_string(tags, ', ') AS liste
FROM produkte
ORDER BY id;
-- name     | erster_tag | anzahl | liste
-- Maus     | usb        | 2      | usb, funk
-- Tastatur | usb        | 2      | usb, beleuchtet
-- Monitor  | hdmi       | 1      | hdmi

-- Enthält das Array den Wert?
SELECT name FROM produkte WHERE tags @> ARRAY['usb'] ORDER BY name;
-- name
-- Maus
-- Tastatur

-- Element anhängen und Array in Zeilen auflösen
UPDATE produkte SET tags = array_append(tags, 'neu') WHERE id = 3;
SELECT unnest(tags) AS tag FROM produkte WHERE id = 3;
-- tag
-- hdmi
-- neu
`)
      },
      mysql: { none: 'Kein Array-Typ; stattdessen eine Zuordnungstabelle oder ein JSON-Array mit `JSON_CONTAINS()` bzw. `wert MEMBER OF (json)` und `JSON_TABLE()`.' },
      mssql: { none: 'Kein Array-Typ; stattdessen eine Zuordnungstabelle, ein JSON-Array mit `OPENJSON()` oder eine Liste mit `STRING_SPLIT()`.' },
      sqlite: { none: 'Kein Array-Typ; stattdessen eine Zuordnungstabelle oder ein JSON-Array, das man mit `json_each()` in Zeilen auflöst.' }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'ANY(array)',
    desc: 'Vergleicht einen Wert mit allen Elementen eines Arrays – wie IN mit einer Liste.',
    details: '`x = ANY(array)` ist wahr, wenn x einem Element gleicht, `x <> ALL(array)`, wenn es keinem gleicht. Der große Vorteil: Aus der Anwendung übergibt man die ganze Liste als einen einzigen Parameter (`WHERE id = ANY($1)`) statt eine variable Zahl von Platzhaltern für `IN ($1, $2, …)` zusammenzubauen. Wie bei `NOT IN` macht ein `NULL` im Array `<> ALL` unbrauchbar.',
    tip: 'Prepared Statements mit `= ANY($1)` bleiben gleich, egal wie viele IDs kommen – das schont den Plan-Cache.',
    keywords: ['any array', 'in liste', 'id liste', 'parameter liste', 'all array', 'postgresql', 'member of'],
    related: ['Arrays (PostgreSQL)', 'IN', 'ANY / ALL', 'Prepared Statements'],
    mdn: PG + 'functions-comparisons.html',
    dialects: {
      std: { none: 'Mit Arrays nicht portabel; im Standard `IN (wert1, wert2, …)` oder `= ANY (unterabfrage)`.' },
      pg: {
        syntax: 'ausdruck = ANY(array)\nausdruck <> ALL(array)',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES
  (1, 'Müller GmbH', 'Berlin'), (2, 'Schmidt AG', 'Hamburg'),
  (3, 'Weber KG', 'München'), (4, 'Fischer OHG', 'Berlin');

-- Aus der Anwendung: WHERE id = ANY($1) mit einem Array-Parameter
SELECT id, name FROM kunden WHERE id = ANY(ARRAY[1, 3, 4]) ORDER BY id;
-- id | name
-- 1  | Müller GmbH
-- 3  | Weber KG
-- 4  | Fischer OHG

SELECT name FROM kunden WHERE stadt <> ALL('{Berlin,Hamburg}'::text[]);
-- name
-- Weber KG
`)
      },
      mysql: {
        note: 'Kein Array-Typ. Seit MySQL 8.0.17 prüft `wert MEMBER OF (json_array)`, ob ein Wert in einem JSON-Array steht – ebenfalls ein einziger Parameter.',
        mdn: MY + 'json-search-functions.html',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES
  (1, 'Müller GmbH', 'Berlin'), (2, 'Schmidt AG', 'Hamburg'),
  (3, 'Weber KG', 'München'), (4, 'Fischer OHG', 'Berlin');

SELECT id, name FROM kunden WHERE id MEMBER OF ('[1, 3, 4]') ORDER BY id;
-- id | name
-- 1  | Müller GmbH
-- 3  | Weber KG
-- 4  | Fischer OHG
`)
      },
      mssql: {
        note: 'Kein Array-Typ. Eine Liste als ein Parameter übergibt man als Text und zerlegt sie mit `STRING_SPLIT()` (oder als JSON mit `OPENJSON()`).',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50), stadt NVARCHAR(50));
INSERT INTO kunden VALUES
  (1, N'Müller GmbH', N'Berlin'), (2, N'Schmidt AG', N'Hamburg'),
  (3, N'Weber KG', N'München'), (4, N'Fischer OHG', N'Berlin');

SELECT id, name FROM kunden
WHERE id IN (SELECT CAST(value AS INT) FROM STRING_SPLIT('1,3,4', ','))
ORDER BY id;
-- id | name
-- 1  | Müller GmbH
-- 3  | Weber KG
-- 4  | Fischer OHG
`)
      },
      sqlite: {
        note: 'Kein Array-Typ. Eine Liste als ein Parameter übergibt man als JSON-Array und löst sie mit `json_each()` auf.',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT);
INSERT INTO kunden VALUES
  (1, 'Müller GmbH', 'Berlin'), (2, 'Schmidt AG', 'Hamburg'),
  (3, 'Weber KG', 'München'), (4, 'Fischer OHG', 'Berlin');

SELECT id, name FROM kunden
WHERE id IN (SELECT value FROM json_each('[1, 3, 4]'))
ORDER BY id;
-- id | name
-- 1  | Müller GmbH
-- 3  | Weber KG
-- 4  | Fischer OHG
`)
      }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'generate_series()',
    desc: 'Tabellenfunktion, die eine Zahlen- oder Zeitreihe als Zeilen erzeugt.',
    details: '`generate_series(start, ende [, schritt])` liefert eine Zeile je Wert – für Zahlen ebenso wie für Datums- und Zeitstempelreihen mit einem `INTERVAL` als Schritt. Typische Anwendung: Kalender oder Zahlenleisten erzeugen und per `LEFT JOIN` an echte Daten hängen, damit auch Tage ohne Einträge mit 0 erscheinen. Ende ist inklusive.',
    tip: 'Mit `generate_series(1, 100000)` lassen sich schnell Testdaten für Performance-Versuche erzeugen.',
    keywords: ['generate_series', 'zahlenreihe', 'datumsreihe', 'kalender', 'lücken füllen', 'testdaten', 'series'],
    related: ['Zahlenreihe erzeugen', 'Rekursive CTE', 'INTERVAL', 'LEFT JOIN'],
    mdn: PG + 'functions-srf.html',
    dialects: {
      std: { none: 'Kein Standard; portabel mit einer rekursiven CTE (siehe Zahlenreihe erzeugen).' },
      pg: {
        syntax: 'generate_series(start, ende [, schritt])',
        example: e(`
SELECT generate_series(1, 5, 2) AS n;
-- n
-- 1
-- 3
-- 5

CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES (1, 120.00, '2026-03-01'), (2, 80.50, '2026-03-03'), (3, 45.00, '2026-03-03');

-- Jeder Tag erscheint, auch ohne Bestellung
SELECT t::date AS tag, COUNT(b.id) AS anzahl
FROM generate_series(DATE '2026-03-01', DATE '2026-03-04', INTERVAL '1 day') AS t
LEFT JOIN bestellungen b ON b.datum = t::date
GROUP BY t
ORDER BY t;
-- tag        | anzahl
-- 2026-03-01 | 1
-- 2026-03-02 | 0
-- 2026-03-03 | 2
-- 2026-03-04 | 0
`)
      },
      mysql: { none: 'Kein `generate_series`; stattdessen eine rekursive CTE (siehe Zahlenreihe erzeugen).' },
      mssql: {
        note: 'Seit SQL Server 2022 (Kompatibilitätsgrad 160) als `GENERATE_SERIES(start, ende [, schritt])`; die Spalte heißt `value`. Nur für Zahlen – Datumsreihen per `DATEADD`.',
        mdn: MS + 'functions/generate-series-transact-sql',
        example: e(`
SELECT value AS n FROM GENERATE_SERIES(1, 5, 2);
-- n
-- 1
-- 3
-- 5

CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES (1, 120.00, '2026-03-01'), (2, 80.50, '2026-03-03'), (3, 45.00, '2026-03-03');

SELECT t.tag, COUNT(b.id) AS anzahl
FROM (SELECT CAST(DATEADD(day, value, '2026-03-01') AS DATE) AS tag
      FROM GENERATE_SERIES(0, 3)) AS t
LEFT JOIN bestellungen b ON b.datum = t.tag
GROUP BY t.tag
ORDER BY t.tag;
-- tag        | anzahl
-- 2026-03-01 | 1
-- 2026-03-02 | 0
-- 2026-03-03 | 2
-- 2026-03-04 | 0
`)
      },
      sqlite: { none: '`generate_series` gibt es nur als Erweiterung (in der `sqlite3`-Kommandozeile eingebaut, in Programmbibliotheken meist nicht); portabel mit einer rekursiven CTE (siehe Zahlenreihe erzeugen).' }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'SERIAL',
    desc: 'Kurzschreibweise für eine Ganzzahlspalte mit automatisch fortlaufender Nummer.',
    details: '`SERIAL` ist kein echter Typ, sondern eine Abkürzung: PostgreSQL legt eine Sequenz `tabelle_spalte_seq` an, setzt `DEFAULT nextval(…)` und `NOT NULL`. `BIGSERIAL` nutzt `BIGINT`, `SMALLSERIAL` `SMALLINT`. Seit PostgreSQL 10 ist `GENERATED … AS IDENTITY` die empfohlene, standardkonforme Alternative, weil Rechte und Besitz der Sequenz dort sauber an der Spalte hängen.',
    tip: 'Wer Werte von Hand einfügt, bringt die Sequenz aus dem Takt: danach `SELECT setval(\'kunden_id_seq\', (SELECT MAX(id) FROM kunden));`.',
    keywords: ['serial', 'bigserial', 'smallserial', 'autoincrement', 'sequenz', 'nextval', 'currval', 'postgresql'],
    related: ['IDENTITY', 'Sequenzen', 'Auto-Increment', 'AUTO_INCREMENT'],
    mdn: PG + 'datatype-numeric.html#DATATYPE-SERIAL',
    dialects: {
      std: { none: 'Kein Standard; dort `GENERATED BY DEFAULT AS IDENTITY` (siehe IDENTITY).' },
      pg: {
        syntax: 'spalte SERIAL | BIGSERIAL | SMALLSERIAL',
        example: e(`
CREATE TABLE kunden (id SERIAL PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (name) VALUES ('Müller GmbH'), ('Schmidt AG');

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller GmbH
-- 2  | Schmidt AG

-- Dahinter steckt eine Sequenz
SELECT pg_get_serial_sequence('kunden', 'id') AS sequenz, currval('kunden_id_seq') AS letzte_id;
-- sequenz               | letzte_id
-- public.kunden_id_seq  | 2
`)
      },
      mysql: {
        note: 'In MySQL ist `SERIAL` ein Alias für `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.',
        mdn: MY + 'numeric-type-syntax.html',
        example: e(`
CREATE TABLE kunden (id SERIAL PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (name) VALUES ('Müller GmbH'), ('Schmidt AG');

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller GmbH
-- 2  | Schmidt AG
`)
      },
      mssql: { none: 'Kein `SERIAL`; stattdessen `INT IDENTITY(1,1)` (siehe IDENTITY).' },
      sqlite: { none: 'Kein `SERIAL`; `INTEGER PRIMARY KEY` vergibt IDs automatisch (siehe rowid).' }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'psql-Befehle',
    desc: 'Backslash-Befehle des Kommandozeilen-Clients psql zum Erkunden der Datenbank.',
    details: 'Befehle mit Backslash wie `\\dt` oder `\\d tabelle` wertet der Client `psql` selbst aus; sie sind kein SQL und brauchen kein Semikolon. Sie listen Tabellen, Spalten, Indizes, Funktionen und Rechte auf und steuern die Ausgabe (`\\x` für senkrechte Anzeige, `\\timing` für Laufzeiten). In Programmen und anderen Clients gibt es sie nicht – dort fragt man `information_schema` oder `pg_catalog` ab.',
    values: [
      ['\\l', 'Datenbanken auflisten'],
      ['\\c name', 'Mit anderer Datenbank verbinden'],
      ['\\dt', 'Tabellen auflisten'],
      ['\\d tabelle', 'Spalten, Indizes, Constraints einer Tabelle'],
      ['\\dn / \\df / \\dv', 'Schemas / Funktionen / Views'],
      ['\\x', 'Erweiterte (senkrechte) Anzeige an/aus'],
      ['\\timing', 'Laufzeit jeder Abfrage anzeigen'],
      ['\\i datei.sql', 'SQL-Datei ausführen'],
      ['\\q', 'Beenden']
    ],
    tip: '`\\?` listet alle Backslash-Befehle, `\\h SELECT` zeigt die Syntax eines SQL-Befehls.',
    keywords: ['psql', 'kommandozeile', 'cli', 'backslash', '\\d', '\\dt', 'tabellen auflisten', 'client', 'postgresql'],
    related: ['information_schema', 'mysql-Client', 'sqlcmd', 'sqlite3-Kommandozeile'],
    mdn: PG + 'app-psql.html',
    dialects: {
      std: { none: 'Client-Befehle sind nicht standardisiert; portabel fragt man `information_schema` ab.' },
      pg: {
        exampleLang: 'sh',
        example: e(`
psql -h localhost -U postgres -d shop

shop=# \\dt                 -- alle Tabellen
shop=# \\d kunden           -- Spalten, Typen, Indizes von kunden
shop=# \\x                  -- senkrechte Ausgabe an
shop=# \\timing             -- Laufzeiten anzeigen
shop=# \\i schema.sql       -- Skript ausführen
shop=# \\q

# Einzelne Abfrage ohne interaktive Sitzung
psql -d shop -c "SELECT COUNT(*) FROM kunden;"
`)
      },
      mysql: { none: 'Der `mysql`-Client hat eigene Kurzbefehle; Tabellen und Spalten zeigt man mit SQL: `SHOW TABLES`, `DESCRIBE tabelle` (siehe mysql-Client und SHOW-Befehle).' },
      mssql: { none: 'Statt Backslash-Befehlen: `sqlcmd` als Client und gespeicherte Prozeduren wie `EXEC sp_help \'tabelle\'` (siehe sqlcmd und sp_help).' },
      sqlite: { none: 'Die `sqlite3`-Kommandozeile hat Punktbefehle wie `.tables` und `.schema` (siehe sqlite3-Kommandozeile).' }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'CREATE EXTENSION',
    desc: 'Lädt eine Erweiterung mit zusätzlichen Typen, Funktionen und Indexarten in die Datenbank.',
    details: 'Erweiterungen bringen Funktionalität, die nicht im Kern steckt: `pg_trgm` (Ähnlichkeitssuche), `pgcrypto` (Hashes, Verschlüsselung), `postgis` (Geodaten), `pg_stat_statements` (Abfragestatistik) u. v. m. Sie müssen auf dem Server installiert sein (viele liegen im contrib-Paket bei) und werden je Datenbank mit `CREATE EXTENSION` aktiviert, meist nur von Superusern oder Datenbank-Eigentümern. `\\dx` in psql oder `pg_extension` zeigt, was aktiv ist.',
    values: [
      ['pg_trgm', 'Trigramm-Ähnlichkeit, schnelles LIKE \'%…%\' per Index'],
      ['pgcrypto', 'Hashfunktionen, Verschlüsselung, gen_random_bytes'],
      ['postgis', 'Geodaten, Abstände, räumliche Indizes'],
      ['pg_stat_statements', 'Statistik über alle ausgeführten Abfragen'],
      ['citext', 'Text ohne Unterscheidung von Groß- und Kleinschreibung'],
      ['btree_gist', 'B-Tree-Operatoren für GiST, z. B. in EXCLUDE-Constraints']
    ],
    tip: 'Erweiterungen gehören in die Migrationen (`CREATE EXTENSION IF NOT EXISTS …`), sonst fehlt sie auf dem nächsten Server.',
    keywords: ['extension', 'erweiterung', 'pg_trgm', 'pgcrypto', 'postgis', 'contrib', 'plugin', 'similarity', 'postgresql'],
    related: ['Volltextsuche (tsvector)', 'Datenbank-Migrationen', 'LIKE'],
    mdn: PG + 'sql-createextension.html',
    dialects: {
      std: { none: 'Kein Standard; Erweiterungsmechanismen sind herstellerspezifisch.' },
      pg: {
        syntax: 'CREATE EXTENSION [IF NOT EXISTS] name;',
        mdn: PG + 'pgtrgm.html',
        example: e(`
CREATE EXTENSION IF NOT EXISTS pg_trgm;

SELECT extname FROM pg_extension WHERE extname = 'pg_trgm';
-- extname
-- pg_trgm

-- Ähnlichkeit zweier Texte (0 bis 1)
SELECT ROUND(similarity('Schmidt', 'Schmitt')::numeric, 2) AS aehnlichkeit;
-- aehnlichkeit
-- 0.45

-- Unscharfe Suche mit dem Operator %
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Schmidt AG'), (2, 'Schmitt KG'), (3, 'Weber KG');
SELECT name FROM kunden WHERE name % 'Schmitt' ORDER BY name;
-- name
-- Schmidt AG
-- Schmitt KG
`)
      },
      mysql: { none: 'Keine Erweiterungen dieser Art; Server-Plugins und Komponenten (`INSTALL PLUGIN`, `INSTALL COMPONENT`) erweitern vor allem Server-Funktionen wie Authentifizierung.' },
      mssql: { none: 'Keine Erweiterungen; Zusatzfunktionen kommen als Server-Features (Full-Text Search, R/Python-Services) oder als .NET-Assemblys (CLR).' },
      sqlite: { none: 'Erweiterungen sind Bibliotheken, die die Anwendung lädt: `.load ./erweiterung` in der Kommandozeile oder `load_extension()` (muss im Programm erlaubt werden).' }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'LISTEN / NOTIFY',
    desc: 'Eingebaute Benachrichtigungen: Sitzungen abonnieren einen Kanal und bekommen Nachrichten.',
    details: '`LISTEN kanal` abonniert, `NOTIFY kanal, \'text\'` (oder `pg_notify(kanal, text)`) sendet eine Nachricht an alle Sitzungen, die zuhören. Zugestellt wird erst beim `COMMIT` der sendenden Transaktion, nach einem Rollback gar nicht; die Nutzlast ist auf etwa 8000 Byte begrenzt. Typisch ist ein Trigger, der bei Änderungen `pg_notify` aufruft, damit eine Anwendung ihren Cache leert oder einen Job startet, ohne die Tabelle ständig abzufragen.',
    tip: 'Nachrichten gehen verloren, wenn gerade niemand zuhört – für zuverlässige Warteschlangen eine Tabelle mit `SELECT … FOR UPDATE SKIP LOCKED` nutzen.',
    keywords: ['listen', 'notify', 'pg_notify', 'benachrichtigung', 'pub sub', 'publish subscribe', 'event', 'kanal', 'postgresql'],
    related: ['CREATE TRIGGER', 'SKIP LOCKED (Warteschlange)', 'Transaktion'],
    mdn: PG + 'sql-notify.html',
    dialects: {
      std: { none: 'Kein Standard. Ohne Benachrichtigungen bleibt nur regelmäßiges Abfragen (Polling) einer Tabelle.' },
      pg: {
        syntax: 'LISTEN kanal;\nNOTIFY kanal [, \'nutzlast\'];\nUNLISTEN kanal | *;',
        mdn: PG + 'sql-listen.html',
        example: e(`
-- Sitzung A abonniert den Kanal
LISTEN bestellungen_neu;

-- Sitzung B (hier dieselbe) sendet
NOTIFY bestellungen_neu, '{"id": 42}';

-- psql in Sitzung A meldet danach:
-- Asynchronous notification "bestellungen_neu" with payload "{"id": 42}" received from server process with PID 4711.

-- Als Funktion, z. B. in einem Trigger
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag DECIMAL(10,2));
CREATE FUNCTION melde_bestellung() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('bestellungen_neu', NEW.id::text);
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER bestellung_melden AFTER INSERT ON bestellungen
  FOR EACH ROW EXECUTE FUNCTION melde_bestellung();
INSERT INTO bestellungen VALUES (43, 99.90);

UNLISTEN *;
`)
      },
      mysql: { none: 'Keine Benachrichtigungen; stattdessen Polling einer Tabelle oder Change Data Capture über das Binärlog (z. B. Debezium).' },
      mssql: { none: 'Kein `LISTEN`/`NOTIFY`; ähnliche Aufgaben übernehmen Service Broker, Query Notifications (`SqlDependency`) oder Change Tracking.' },
      sqlite: { none: 'Keine Benachrichtigungen zwischen Verbindungen; innerhalb eines Programms meldet `sqlite3_update_hook()` Änderungen.' }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'Volltextsuche (tsvector)',
    desc: 'Sucht Wörter samt Beugungsformen in Texten – schneller und genauer als LIKE.',
    details: '`to_tsvector(\'german\', text)` zerlegt Text in normalisierte Wortstämme (Stoppwörter fallen weg, „Tabellen“ wird zu „tabell“), `to_tsquery` oder `websearch_to_tsquery` macht aus der Suchanfrage dasselbe, `@@` prüft auf Treffer. Mit einem GIN-Index auf dem Vektor ist die Suche auch in Millionen Zeilen schnell; `ts_rank` sortiert nach Relevanz. Die Sprache (`german`, `english`, `simple`) muss bei Index und Abfrage übereinstimmen.',
    values: [
      ['to_tsvector(sprache, text)', 'Text in Wortstämme zerlegen'],
      ['to_tsquery(sprache, \'a & b\')', 'Suchanfrage mit &, |, ! und Präfix :*'],
      ['websearch_to_tsquery(…)', 'Suchanfrage wie bei Suchmaschinen („…“, -wort, or)'],
      ['vektor @@ anfrage', 'Treffer?'],
      ['ts_rank(vektor, anfrage)', 'Relevanz für ORDER BY'],
      ['ts_headline(…)', 'Fundstellen hervorheben']
    ],
    tip: 'Für Tippfehler-tolerante Suche lässt sich die Volltextsuche mit `pg_trgm` kombinieren.',
    keywords: ['volltextsuche', 'full text search', 'tsvector', 'tsquery', 'to_tsvector', '@@', 'gin', 'suche', 'match against', 'fulltext', 'postgresql'],
    related: ['FTS5 (Volltextsuche)', 'LIKE', 'CREATE EXTENSION', 'Ausdrucksindex'],
    mdn: PG + 'textsearch.html',
    dialects: {
      std: { none: 'Kein Standard; ohne Volltextsuche bleibt nur `LIKE \'%wort%\'` (langsam, ohne Wortstämme).' },
      pg: {
        syntax: "to_tsvector('german', text) @@ to_tsquery('german', 'suche')",
        example: e(`
CREATE TABLE artikel (id INT PRIMARY KEY, titel VARCHAR(100), inhalt VARCHAR(500));
INSERT INTO artikel VALUES
  (1, 'Indizes verstehen', 'Ein Index beschleunigt Abfragen auf großen Tabellen.'),
  (2, 'Joins', 'Tabellen über Schlüssel verbinden.'),
  (3, 'Backups', 'Regelmäßige Sicherungen der Datenbank.');

CREATE INDEX artikel_fts ON artikel
  USING GIN (to_tsvector('german', titel || ' ' || inhalt));

-- "tabelle" findet auch "Tabellen"
SELECT id, titel
FROM artikel
WHERE to_tsvector('german', titel || ' ' || inhalt) @@ to_tsquery('german', 'tabelle')
ORDER BY id;
-- id | titel
-- 1  | Indizes verstehen
-- 2  | Joins

SELECT to_tsvector('german', 'Die Tabellen wurden verbunden')::text AS vektor;
-- vektor
-- 'tabell':2 'verbund':4 'wurd':3
`)
      },
      mysql: {
        note: 'MySQL hat einen `FULLTEXT`-Index mit `MATCH … AGAINST`, aber ohne Wortstämme: Beugungsformen findet man im `BOOLEAN MODE` über Präfixe wie `Tabelle*`. Wörter unter 3 Zeichen (InnoDB) werden nicht indiziert.',
        mdn: MY + 'fulltext-search.html',
        example: e(`
CREATE TABLE artikel (
  id INT PRIMARY KEY, titel VARCHAR(100), inhalt VARCHAR(500),
  FULLTEXT (titel, inhalt)
);
INSERT INTO artikel VALUES
  (1, 'Indizes verstehen', 'Ein Index beschleunigt Abfragen auf großen Tabellen.'),
  (2, 'Joins', 'Tabellen über Schlüssel verbinden.'),
  (3, 'Backups', 'Regelmäßige Sicherungen der Datenbank.');

SELECT id, titel
FROM artikel
WHERE MATCH (titel, inhalt) AGAINST ('Tabelle*' IN BOOLEAN MODE)
ORDER BY id;
-- id | titel
-- 1  | Indizes verstehen
-- 2  | Joins
`)
      },
      mssql: {
        note: 'Full-Text Search ist ein eigenes Feature, das installiert sein muss (fehlt z. B. im Linux-Container standardmäßig). Es braucht einen Katalog und einen eindeutigen Schlüsselindex; `FORMSOF(INFLECTIONAL, …)` findet Beugungsformen.',
        mdn: MS + 'queries/contains-transact-sql',
        nocheck: true,
        example: e(`
CREATE TABLE artikel (
  id INT NOT NULL CONSTRAINT pk_artikel PRIMARY KEY,
  titel NVARCHAR(100), inhalt NVARCHAR(500)
);
INSERT INTO artikel VALUES
  (1, N'Indizes verstehen', N'Ein Index beschleunigt Abfragen auf großen Tabellen.'),
  (2, N'Joins', N'Tabellen über Schlüssel verbinden.'),
  (3, N'Backups', N'Regelmäßige Sicherungen der Datenbank.');

CREATE FULLTEXT CATALOG ft_katalog AS DEFAULT;
CREATE FULLTEXT INDEX ON artikel (titel LANGUAGE 1031, inhalt LANGUAGE 1031)
  KEY INDEX pk_artikel;

SELECT id, titel
FROM artikel
WHERE CONTAINS((titel, inhalt), 'FORMSOF(INFLECTIONAL, Tabelle)')
ORDER BY id;
-- id | titel
-- 1  | Indizes verstehen
-- 2  | Joins
`)
      },
      sqlite: { none: 'Volltextsuche über die virtuelle Tabelle FTS5 (siehe FTS5 (Volltextsuche)).' }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'Dollar-Quoting ($$)',
    desc: 'Strings zwischen $$ … $$ brauchen kein Escaping von Apostrophen.',
    details: 'Alles zwischen `$$` und `$$` ist ein String-Literal, in dem `\'` und `\\` keine besondere Bedeutung haben. Das ist vor allem für Funktions- und Prozedurrümpfe gedacht, die selbst wieder Strings enthalten. Braucht der Inhalt selbst `$$`, setzt man einen Namen dazwischen: `$body$ … $body$`. Für normale Werte in Abfragen bleibt `\'…\'` üblich.',
    tip: 'Auch in Migrationsskripten praktisch: Funktionsrümpfe in `$$` bleiben lesbar und lassen sich unverändert aus einer Datei kopieren.',
    keywords: ['dollar quoting', '$$', 'dollar quote', 'string literal', 'funktion', 'plpgsql', 'escaping', 'postgresql'],
    related: ['String-Literale', 'CREATE FUNCTION', 'Variablen & Kontrollfluss (PL/pgSQL)', 'GO'],
    mdn: PG + 'sql-syntax-lexical.html#SQL-SYNTAX-DOLLAR-QUOTING',
    dialects: {
      std: { none: 'Kein Standard; Apostrophe im String werden verdoppelt: `\'O\'\'Brien\'`.' },
      pg: {
        syntax: '$$text$$\n$name$text$name$',
        example: e(`
SELECT $$O'Brien sagt "Hallo"$$ AS zitat;
-- zitat
-- O'Brien sagt "Hallo"

SELECT $tag$Kosten: $$ 5$tag$ AS mit_dollar;
-- mit_dollar
-- Kosten: $$ 5

-- Hauptanwendung: Funktionsrümpfe
CREATE FUNCTION brutto(netto DECIMAL) RETURNS DECIMAL AS $$
  SELECT ROUND(netto * 1.19, 2)
$$ LANGUAGE sql;

SELECT brutto(100) AS brutto;
-- brutto
-- 119.00
`)
      },
      mysql: { none: 'Kein Dollar-Quoting; Rümpfe von Prozeduren und Triggern werden im Client mit `DELIMITER //` abgegrenzt, Apostrophe verdoppelt oder mit `\\\'` maskiert.' },
      mssql: { none: 'Kein Dollar-Quoting; Prozedurrümpfe stehen direkt im eigenen Batch (siehe GO), Apostrophe in Strings werden verdoppelt.' },
      sqlite: { none: 'Kein Dollar-Quoting; Apostrophe in Strings werden verdoppelt: `\'O\'\'Brien\'`.' }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'Bereichstypen (Range)',
    desc: 'Ein Wert für einen ganzen Bereich wie „1. bis 5. März“ – mit Überlappungsprüfung.',
    details: 'Range-Typen wie `daterange`, `tsrange`, `int4range` und `numrange` speichern Anfang und Ende in einer Spalte; `[` schließt eine Grenze ein, `)` schließt sie aus. Operatoren wie `@>` (enthält), `&&` (überschneidet sich) und `-|-` (grenzt an) ersetzen fehleranfällige Vergleiche mit zwei Spalten. Ein `EXCLUDE`-Constraint mit `&&` verhindert überlappende Buchungen direkt in der Datenbank. Seit PostgreSQL 14 gibt es zusätzlich Multiranges.',
    values: [
      ['[a,b)', 'a eingeschlossen, b ausgeschlossen (Standardform)'],
      ['bereich @> wert', 'Bereich enthält den Wert'],
      ['a && b', 'Bereiche überschneiden sich'],
      ['lower(r) / upper(r)', 'Untere / obere Grenze'],
      ['EXCLUDE USING GIST (r WITH &&)', 'Keine zwei Zeilen mit überlappenden Bereichen']
    ],
    tip: 'Halboffene Bereiche `[von,bis)` sind für Zeiträume am praktischsten: Abreisetag des einen kann Anreisetag des nächsten sein.',
    keywords: ['range', 'daterange', 'tsrange', 'int4range', 'bereich', 'zeitraum', 'überlappung', 'exclude', 'buchung', 'postgresql'],
    related: ['Datumsbereich filtern', 'CHECK', 'DATE'],
    mdn: PG + 'rangetypes.html',
    dialects: {
      std: { none: 'Kein Range-Typ; zwei Spalten `von`/`bis` und Überschneidung mit `a.von < b.bis AND b.von < a.bis` prüfen. SQL:2011 kennt `PERIOD FOR`, das von den gezeigten Systemen nur teilweise unterstützt wird.' },
      pg: {
        syntax: "daterange('2026-03-01', '2026-03-05')  bzw.  '[2026-03-01,2026-03-05)'",
        example: e(`
CREATE TABLE buchungen (
  id INT PRIMARY KEY,
  gast VARCHAR(50),
  zeitraum DATERANGE,
  EXCLUDE USING GIST (zeitraum WITH &&)
);
INSERT INTO buchungen VALUES
  (1, 'Ada', '[2026-03-01,2026-03-05)'),
  (2, 'Ben', daterange('2026-03-05', '2026-03-08'));

SELECT gast, lower(zeitraum) AS anreise, upper(zeitraum) AS abreise,
       upper(zeitraum) - lower(zeitraum) AS naechte
FROM buchungen
ORDER BY id;
-- gast | anreise    | abreise    | naechte
-- Ada  | 2026-03-01 | 2026-03-05 | 4
-- Ben  | 2026-03-05 | 2026-03-08 | 3

SELECT gast FROM buchungen WHERE zeitraum @> DATE '2026-03-06';
-- gast
-- Ben

-- INSERT INTO buchungen VALUES (3, 'Cem', '[2026-03-04,2026-03-06)');
--   → Fehler: conflicting key value violates exclusion constraint "buchungen_zeitraum_excl"
`)
      },
      mysql: { none: 'Kein Range-Typ; zwei Spalten `von`/`bis`, Überschneidungen per Abfrage oder Trigger verhindern.' },
      mssql: { none: 'Kein Range-Typ; zwei Spalten `von`/`bis`. Für Gültigkeitszeiträume gibt es System-Versioned Temporal Tables (`PERIOD FOR SYSTEM_TIME`).' },
      sqlite: { none: 'Kein Range-Typ; zwei Spalten `von`/`bis`, Überschneidungen per Abfrage oder Trigger verhindern.' }
    }
  },
  {
    lang: 'sql', group: 'PostgreSQL-Besonderheiten', name: 'CREATE DOMAIN',
    desc: 'Eigener Datentyp auf Basis eines vorhandenen – mit Prüfregeln und Default.',
    details: 'Eine Domain bündelt Basistyp, `CHECK`-Regeln, `NOT NULL` und `DEFAULT` unter einem Namen, z. B. `plz` oder `email`. Jede Spalte dieses Typs erbt die Regeln; ändert man die Domain, gilt das überall. Domains stehen im SQL-Standard, umgesetzt sind sie von den gezeigten Systemen aber nur in PostgreSQL. In `CHECK` steht der zu prüfende Wert als `VALUE`.',
    tip: 'Ideal für fachliche Typen, die in vielen Tabellen vorkommen (Beträge, Prozentsätze, Postleitzahlen).',
    keywords: ['domain', 'create domain', 'eigener typ', 'benutzerdefinierter typ', 'check', 'datentyp', 'postgresql'],
    related: ['CHECK', 'ENUM-Typen', 'Benannte Constraints'],
    mdn: PG + 'sql-createdomain.html',
    dialects: {
      std: {
        syntax: 'CREATE DOMAIN name AS basistyp\n  [DEFAULT wert]\n  [CHECK (bedingung mit VALUE)];',
        example: e(`
CREATE DOMAIN plz AS VARCHAR(5)
  CHECK (VALUE SIMILAR TO '[0-9]{5}');

CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), plz plz);
INSERT INTO kunden VALUES (1, 'Müller GmbH', '10115');
-- INSERT INTO kunden VALUES (2, 'Schmidt AG', '2000');
--   → Fehler: value for domain plz violates check constraint "plz_check"

SELECT name, plz FROM kunden;
-- name        | plz
-- Müller GmbH | 10115
`)
      },
      pg: { note: 'Im `CHECK` sind auch reguläre Ausdrücke erlaubt, z. B. `VALUE ~ \'^[0-9]{5}$\'`. `ALTER DOMAIN` ändert Regeln nachträglich.' },
      mysql: { none: 'Keine Domains; den `CHECK` an jeder Spalte wiederholen (seit MySQL 8.0.16 wird er durchgesetzt).' },
      mssql: { none: 'Keine Domains mit Prüfregeln; `CREATE TYPE plz FROM VARCHAR(5)` legt nur einen Alias-Typ an, den `CHECK` braucht jede Spalte selbst.' },
      sqlite: { none: 'Keine Domains; den `CHECK` an jeder Spalte wiederholen.' }
    }
  },

  // ---------------- MySQL-Besonderheiten ----------------
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'AUTO_INCREMENT',
    desc: 'MySQL vergibt für die Spalte automatisch die nächste freie Nummer.',
    details: 'Eine `AUTO_INCREMENT`-Spalte muss indiziert sein (meist der Primärschlüssel); lässt man sie beim `INSERT` weg oder setzt `NULL`, vergibt MySQL den nächsten Wert. `LAST_INSERT_ID()` liefert die zuletzt vergebene ID der eigenen Verbindung – bei einem mehrzeiligen INSERT die der ersten Zeile. Den Startwert setzt die Tabellenoption `AUTO_INCREMENT = n`. Seit MySQL 8.0 bleibt der Zähler auch nach einem Neustart erhalten.',
    tip: '`LAST_INSERT_ID()` ist pro Verbindung, also sicher bei gleichzeitigen Zugriffen – `SELECT MAX(id)` ist es nicht.',
    keywords: ['auto_increment', 'autoincrement', 'last_insert_id', 'id automatisch', 'fortlaufende nummer', 'mysql', 'mariadb'],
    related: ['Auto-Increment', 'IDENTITY', 'SERIAL', 'sqlite_sequence'],
    mdn: MY + 'example-auto-increment.html',
    dialects: {
      std: { none: 'Kein Standard; dort `GENERATED BY DEFAULT AS IDENTITY` (siehe IDENTITY).' },
      pg: { none: 'Kein `AUTO_INCREMENT`; stattdessen `GENERATED … AS IDENTITY` oder `SERIAL`, die neue ID per `RETURNING id`.' },
      mysql: {
        syntax: 'id INT AUTO_INCREMENT PRIMARY KEY\nCREATE TABLE … (…) AUTO_INCREMENT = startwert;',
        example: e(`
CREATE TABLE kunden (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50)
) AUTO_INCREMENT = 1000;

INSERT INTO kunden (name) VALUES ('Müller GmbH');
SELECT LAST_INSERT_ID() AS neue_id;
-- neue_id
-- 1000

-- Bei mehreren Zeilen: ID der ersten
INSERT INTO kunden (name) VALUES ('Schmidt AG'), ('Weber KG');
SELECT LAST_INSERT_ID() AS neue_id;
-- neue_id
-- 1001

SELECT id, name FROM kunden ORDER BY id;
-- id   | name
-- 1000 | Müller GmbH
-- 1001 | Schmidt AG
-- 1002 | Weber KG
`)
      },
      mssql: { none: 'Kein `AUTO_INCREMENT`; stattdessen `INT IDENTITY(1,1)`, die neue ID per `SCOPE_IDENTITY()` oder `OUTPUT inserted.id`.' },
      sqlite: { none: 'Kein `AUTO_INCREMENT`; `INTEGER PRIMARY KEY` vergibt IDs automatisch, das Schlüsselwort `AUTOINCREMENT` verhindert zusätzlich die Wiederverwendung (siehe sqlite_sequence).' }
    }
  },
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'ON DUPLICATE KEY UPDATE',
    desc: 'MySQL-Upsert: Gibt es den Schlüssel schon, wird die vorhandene Zeile geändert.',
    details: 'Verletzt ein `INSERT` einen `PRIMARY KEY` oder `UNIQUE`-Index, führt MySQL stattdessen das `UPDATE` hinter `ON DUPLICATE KEY UPDATE` auf der vorhandenen Zeile aus. Die vorgeschlagenen neuen Werte erreicht man seit 8.0.19 über einen Zeilenalias (`AS neu` … `neu.spalte`); die ältere Form `VALUES(spalte)` ist veraltet. Bei mehreren eindeutigen Indizes ist unklar, welche Zeile getroffen wird – möglichst nur einen haben.',
    tip: 'Die Anzahl betroffener Zeilen ist 1 für eingefügt, 2 für aktualisiert und 0 für unverändert – nützlich, um im Code zu unterscheiden.',
    keywords: ['on duplicate key update', 'upsert', 'insert or update', 'mysql', 'mariadb', 'values()', 'zeilenalias'],
    related: ['ON CONFLICT (Upsert)', 'MERGE', 'INSERT OR REPLACE / INSERT IGNORE', 'UNIQUE'],
    mdn: MY + 'insert-on-duplicate.html',
    dialects: {
      std: { none: 'Kein Standard; dort `MERGE INTO … WHEN MATCHED THEN UPDATE … WHEN NOT MATCHED THEN INSERT` (siehe MERGE).' },
      pg: { none: 'Stattdessen `INSERT … ON CONFLICT (spalte) DO UPDATE SET … = excluded.…` (siehe ON CONFLICT (Upsert)) oder `MERGE`.' },
      mysql: {
        syntax: 'INSERT INTO tabelle (…) VALUES (…) AS neu\nON DUPLICATE KEY UPDATE spalte = neu.spalte;',
        example: e(`
CREATE TABLE lager (produkt_id INT PRIMARY KEY, bestand INT NOT NULL);
INSERT INTO lager VALUES (1, 10), (2, 5);

-- Produkt 1 gibt es schon (Bestand erhöhen), Produkt 3 ist neu
INSERT INTO lager (produkt_id, bestand) VALUES (1, 3), (3, 7) AS neu
ON DUPLICATE KEY UPDATE bestand = lager.bestand + neu.bestand;

SELECT produkt_id, bestand FROM lager ORDER BY produkt_id;
-- produkt_id | bestand
-- 1          | 13
-- 2          | 5
-- 3          | 7
`)
      },
      mssql: { none: 'Stattdessen `MERGE` (siehe MERGE) oder `UPDATE` und bei `@@ROWCOUNT = 0` ein `INSERT` in einer Transaktion.' },
      sqlite: { none: 'Stattdessen `INSERT … ON CONFLICT (spalte) DO UPDATE SET … = excluded.…` (siehe ON CONFLICT (Upsert)).' }
    }
  },
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'Storage Engines',
    desc: 'MySQL speichert jede Tabelle mit einer wählbaren Engine – Standard ist InnoDB.',
    details: 'Die Storage Engine legt fest, wie eine Tabelle gespeichert wird und was sie kann. InnoDB (Standard) bietet Transaktionen, Sperren auf Zeilenebene, Fremdschlüssel und Crash-Recovery; MyISAM kann nichts davon und ist nur noch aus Altlasten bekannt. `MEMORY` hält Daten nur im Arbeitsspeicher (weg nach Neustart), `ARCHIVE` und `CSV` sind Spezialfälle. Gewählt wird per `ENGINE = …` beim Anlegen oder mit `ALTER TABLE`.',
    values: [
      ['InnoDB', 'Standard: Transaktionen, Fremdschlüssel, Zeilensperren'],
      ['MyISAM', 'Veraltet: keine Transaktionen, Tabellensperren'],
      ['MEMORY', 'Nur im RAM, nach Neustart leer'],
      ['ARCHIVE', 'Komprimiert, nur INSERT und SELECT'],
      ['CSV', 'Daten als CSV-Datei']
    ],
    tip: 'Fremdschlüssel und Transaktionen wirken nur, wenn alle beteiligten Tabellen InnoDB sind – bei MyISAM werden sie stillschweigend ignoriert.',
    keywords: ['storage engine', 'innodb', 'myisam', 'memory', 'engine', 'tabellentyp', 'mysql', 'mariadb'],
    related: ['ACID', 'FOREIGN KEY', 'SHOW-Befehle', 'Transaktion'],
    mdn: MY + 'storage-engines.html',
    dialects: {
      std: { none: 'Kein Standard; wie Daten gespeichert werden, ist Sache des Systems.' },
      pg: { none: 'Eine Speicherform (Heap) für alle Tabellen; Alternativen sind über Erweiterungen als Table Access Method (`CREATE TABLE … USING …`) möglich, `UNLOGGED`-Tabellen sparen das WAL.' },
      mysql: {
        syntax: 'CREATE TABLE … (…) ENGINE = InnoDB | MEMORY | …;\nALTER TABLE tabelle ENGINE = InnoDB;',
        example: e(`
CREATE TABLE protokoll (id INT PRIMARY KEY, meldung VARCHAR(100)) ENGINE = InnoDB;
CREATE TABLE cache (schluessel VARCHAR(50) PRIMARY KEY, wert VARCHAR(100)) ENGINE = MEMORY;

SELECT table_name AS tabelle, engine AS engine
FROM information_schema.tables
WHERE table_schema = DATABASE()
ORDER BY table_name;
-- tabelle   | engine
-- cache     | MEMORY
-- protokoll | InnoDB

ALTER TABLE cache ENGINE = InnoDB;

-- Verfügbare Engines des Servers
SHOW ENGINES;
`)
      },
      mssql: { none: 'Keine wählbaren Engines; für Hochlast gibt es speicheroptimierte Tabellen (In-Memory OLTP, `MEMORY_OPTIMIZED = ON`) und Columnstore-Indizes.' },
      sqlite: { none: 'Eine Speicherform; Sonderfälle sind `WITHOUT ROWID`-Tabellen und virtuelle Tabellen (z. B. FTS5).' }
    }
  },
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'SHOW-Befehle',
    desc: 'Kurzbefehle, die Tabellen, Spalten, Indizes und Servereinstellungen anzeigen.',
    details: '`SHOW TABLES`, `SHOW COLUMNS FROM t` (gleichwertig: `DESCRIBE t`), `SHOW INDEX FROM t` und `SHOW CREATE TABLE t` erkunden das Schema; `SHOW VARIABLES`, `SHOW STATUS`, `SHOW PROCESSLIST` und `SHOW WARNINGS` geben Einblick in den Server. Die meisten erlauben `LIKE \'muster\'` oder `WHERE`. Sie liefern normale Ergebnistabellen und funktionieren daher auch aus Programmen; für portable Abfragen ist `information_schema` besser.',
    values: [
      ['SHOW DATABASES', 'Alle Datenbanken'],
      ['SHOW TABLES', 'Tabellen der aktuellen Datenbank'],
      ['SHOW COLUMNS FROM t / DESCRIBE t', 'Spalten mit Typ, NULL, Schlüssel, Default'],
      ['SHOW CREATE TABLE t', 'Vollständige CREATE-Anweisung'],
      ['SHOW INDEX FROM t', 'Indizes der Tabelle'],
      ['SHOW VARIABLES LIKE \'…\'', 'Servereinstellungen'],
      ['SHOW WARNINGS', 'Warnungen der letzten Anweisung'],
      ['SHOW PROCESSLIST', 'Laufende Verbindungen und Abfragen']
    ],
    tip: '`SHOW WARNINGS` direkt nach einem verdächtigen `INSERT` zeigt, ob Werte abgeschnitten oder umgewandelt wurden.',
    keywords: ['show', 'show tables', 'show columns', 'describe', 'desc', 'show create table', 'show index', 'show variables', 'show warnings', 'processlist', 'mysql'],
    related: ['information_schema', 'mysql-Client', 'sp_help', 'PRAGMA (SQLite)', 'psql-Befehle'],
    mdn: MY + 'show.html',
    dialects: {
      std: { none: 'Kein Standard; portabel über `information_schema.tables` und `information_schema.columns`.' },
      pg: { none: 'Kein `SHOW TABLES`; in psql `\\dt` und `\\d tabelle`, sonst `information_schema` oder `pg_catalog`. `SHOW name` zeigt dort nur Einstellungen (z. B. `SHOW search_path`).' },
      mysql: {
        syntax: 'SHOW TABLES;\nSHOW COLUMNS FROM tabelle;\nSHOW CREATE TABLE tabelle;',
        example: e(`
CREATE TABLE kunden (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  stadt VARCHAR(50)
);

SHOW TABLES;
-- liefert eine Zeile je Tabelle, hier: kunden

SHOW COLUMNS FROM kunden;
-- Field | Type        | Null | Key | Default | Extra
-- id    | int         | NO   | PRI | NULL    | auto_increment
-- name  | varchar(50) | NO   |     | NULL    |
-- stadt | varchar(50) | YES  |     | NULL    |

SHOW CREATE TABLE kunden;
-- liefert die vollständige CREATE TABLE-Anweisung samt ENGINE und Zeichensatz

SHOW VARIABLES LIKE 'max_connections';
`)
      },
      mssql: { none: 'Kein `SHOW`; stattdessen `EXEC sp_help \'tabelle\'`, `sp_columns` oder die Kataloge `sys.tables`, `sys.columns` (siehe sp_help).' },
      sqlite: { none: 'Kein `SHOW`; in der Kommandozeile `.tables` und `.schema`, per SQL `PRAGMA table_info(tabelle)` oder `sqlite_schema`.' }
    }
  },
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'SQL_MODE',
    desc: 'Schaltet strenges oder nachsichtiges Verhalten und Kompatibilitätsoptionen von MySQL um.',
    details: 'Die Variable `sql_mode` bestimmt, wie streng MySQL ist. Mit `STRICT_TRANS_TABLES` (Standard seit 5.7) sind zu lange Strings oder ungültige Werte Fehler; ohne werden sie mit nur einer Warnung abgeschnitten oder umgewandelt. `ONLY_FULL_GROUP_BY` verbietet nicht gruppierte Spalten im `SELECT`, `ANSI_QUOTES` macht `"…"` zu Bezeichnern, `PIPES_AS_CONCAT` macht `||` zur Verkettung. Der Modus gilt global oder je Sitzung.',
    values: [
      ['STRICT_TRANS_TABLES', 'Ungültige oder zu lange Werte sind Fehler'],
      ['ONLY_FULL_GROUP_BY', 'Nur gruppierte oder aggregierte Spalten im SELECT'],
      ['NO_ZERO_DATE', 'Kein Datum 0000-00-00'],
      ['ERROR_FOR_DIVISION_BY_ZERO', 'Division durch 0 als Fehler (mit STRICT)'],
      ['ANSI_QUOTES', '"…" quotet Bezeichner statt Strings'],
      ['PIPES_AS_CONCAT', '|| verkettet statt ODER'],
      ['ANSI', 'Sammelmodus für mehr Standardnähe']
    ],
    tip: 'Alte Anwendungen setzen oft `sql_mode = \'\'` – dann landen abgeschnittene Daten ohne Fehler in der Datenbank. Den Modus bewusst prüfen.',
    keywords: ['sql_mode', 'strict mode', 'strict_trans_tables', 'only_full_group_by', 'ansi_quotes', 'pipes_as_concat', 'mysql', 'kompatibilität'],
    related: ['Implizite Umwandlung', 'GROUP BY', '|| (Verkettung)', 'Bezeichner quoten'],
    mdn: MY + 'sql-mode.html',
    dialects: {
      std: { none: 'Kein Standard; standardkonforme Systeme sind ohnehin streng.' },
      pg: { none: 'Kein vergleichbarer Modus; PostgreSQL ist immer streng (zu lange Werte und ungültige Datumswerte sind Fehler).' },
      mysql: {
        syntax: "SET SESSION sql_mode = 'modus1,modus2';\nSELECT @@SESSION.sql_mode;",
        example: e(`
SELECT @@SESSION.sql_mode AS modus;
-- modus
-- ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(5));
-- INSERT INTO kunden VALUES (1, 'Müller GmbH');
--   → Fehler: Data too long for column 'name' at row 1

-- Ohne strikten Modus: abgeschnitten, nur eine Warnung
SET SESSION sql_mode = '';
INSERT INTO kunden VALUES (1, 'Müller GmbH');
SELECT name FROM kunden;
-- name
-- Mülle

-- || als Verkettung wie im Standard
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,PIPES_AS_CONCAT';
SELECT 'SQL' || '-' || 'Modus' AS text;
-- text
-- SQL-Modus
`)
      },
      mssql: { none: 'Kein `sql_mode`; einzelne Verhaltensweisen schalten `SET`-Optionen wie `SET ANSI_NULLS ON`, `SET QUOTED_IDENTIFIER ON` und `SET ANSI_WARNINGS ON` sowie der Kompatibilitätsgrad der Datenbank.' },
      sqlite: { none: 'Kein `sql_mode`; Verhalten steuern `PRAGMA`s (z. B. `foreign_keys`), strenge Typen gibt es mit `STRICT`-Tabellen.' }
    }
  },
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'Zeichensätze & utf8mb4',
    desc: 'utf8mb4 ist in MySQL das echte UTF-8 – das alte utf8 kann keine Emojis speichern.',
    details: 'MySQLs ursprüngliches `utf8` (heute `utf8mb3`) speichert höchstens 3 Byte pro Zeichen; Emojis und seltene Schriftzeichen brauchen 4 und scheitern. `utf8mb4` ist seit 8.0 Standard und die richtige Wahl. Zeichensatz und Kollation lassen sich je Server, Datenbank, Tabelle und Spalte setzen; auch die Verbindung braucht `utf8mb4` (`SET NAMES utf8mb4` bzw. Treiberoption). Die Standard-Kollation `utf8mb4_0900_ai_ci` vergleicht ohne Akzente und Groß-/Kleinschreibung.',
    values: [
      ['utf8mb4', 'Volles UTF-8 (1–4 Byte), Standard seit 8.0'],
      ['utf8mb3 / utf8', 'Veraltet, max. 3 Byte, keine Emojis'],
      ['latin1', 'Westeuropäisch, 1 Byte'],
      ['utf8mb4_0900_ai_ci', 'Standard-Kollation: akzent- und schreibweisenunabhängig'],
      ['utf8mb4_bin', 'Binär: exakter Vergleich'],
      ['CHAR_LENGTH() / LENGTH()', 'Zeichen / Bytes']
    ],
    tip: 'Fehler „Incorrect string value: \'\\xF0\\x9F…\'“ heißt fast immer: Spalte oder Verbindung ist noch `utf8mb3`.',
    keywords: ['utf8mb4', 'utf8', 'utf8mb3', 'zeichensatz', 'charset', 'character set', 'emoji', 'set names', 'encoding', 'mysql'],
    related: ['Collation', 'LENGTH()', 'NVARCHAR & N\'…\'', 'CREATE DATABASE'],
    mdn: MY + 'charset-unicode-utf8mb4.html',
    dialects: {
      std: { none: 'Der Standard kennt `CHARACTER SET` je Spalte, die Namen der Zeichensätze sind aber herstellerspezifisch.' },
      pg: {
        note: 'Der Zeichensatz gilt je Datenbank (`CREATE DATABASE … ENCODING \'UTF8\'`); UTF8 kann alle Zeichen, auch Emojis. `OCTET_LENGTH` zählt Bytes.',
        example: e(`
SELECT CHAR_LENGTH('Grüße 😀') AS zeichen, OCTET_LENGTH('Grüße 😀') AS bytes;
-- zeichen | bytes
-- 7       | 12
`)
      },
      mysql: {
        syntax: 'CREATE TABLE … (…) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;\nSET NAMES utf8mb4;',
        example: e(`
CREATE TABLE notizen (id INT PRIMARY KEY, inhalt VARCHAR(50))
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
INSERT INTO notizen VALUES (1, 'Grüße 😀');

SELECT inhalt, CHAR_LENGTH(inhalt) AS zeichen, LENGTH(inhalt) AS bytes FROM notizen;
-- inhalt   | zeichen | bytes
-- Grüße 😀 | 7       | 12

-- ai_ci: Akzente und Groß-/Kleinschreibung egal, _bin: exakt
SELECT 'Ärger' = 'arger' AS ai_ci, 'Ärger' = 'arger' COLLATE utf8mb4_bin AS bin;
-- ai_ci | bin
-- 1     | 0
`)
      },
      mssql: { none: 'Unicode über `NVARCHAR` (UTF-16, siehe NVARCHAR & N\'…\'); seit SQL Server 2019 auch UTF-8 in `VARCHAR` mit einer Kollation wie `Latin1_General_100_CI_AS_SC_UTF8`.' },
      sqlite: {
        note: 'Text ist immer UTF-8 (oder UTF-16), es gibt nichts einzustellen. `length()` zählt Zeichen, als `BLOB` gezählt ergibt es Bytes.',
        example: e(`
SELECT length('Grüße 😀') AS zeichen, length(CAST('Grüße 😀' AS BLOB)) AS bytes;
-- zeichen | bytes
-- 7       | 12
`)
      }
    }
  },
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'mysql-Client',
    desc: 'Kommandozeilen-Client von MySQL: Verbinden, Abfragen, Skripte ausführen.',
    details: '`mysql -u benutzer -p datenbank` öffnet eine interaktive Sitzung; das Passwort wird danach abgefragt. Im Client beenden `;` oder `\\G` eine Anweisung, `\\G` zeigt das Ergebnis senkrecht – praktisch bei breiten Zeilen. `SOURCE datei.sql` führt ein Skript aus, `USE db` wechselt die Datenbank. Mit `-e "…"` läuft eine einzelne Anweisung ohne interaktive Sitzung, z. B. in Shell-Skripten.',
    values: [
      ['mysql -u root -p shop', 'Verbinden (Passwort wird abgefragt)'],
      ['-h host -P 3306', 'Server und Port'],
      ['-e "SQL"', 'Eine Anweisung ausführen und beenden'],
      ['USE db;', 'Datenbank wechseln'],
      ['\\G', 'Statt ; – Ergebnis senkrecht anzeigen'],
      ['SOURCE datei.sql', 'Skript ausführen'],
      ['\\q / exit', 'Beenden']
    ],
    tip: 'Das Passwort nie mit `-pGeheim` auf der Kommandozeile übergeben – es landet in der Shell-History. Besser eine Option-Datei `~/.my.cnf` mit Rechten 600.',
    keywords: ['mysql client', 'kommandozeile', 'cli', 'mysql -u', '\\g', 'source', 'use', 'shell', 'terminal'],
    related: ['SHOW-Befehle', 'psql-Befehle', 'sqlcmd', 'sqlite3-Kommandozeile', 'Backup & Export'],
    mdn: MY + 'mysql.html',
    dialects: {
      std: { none: 'Client-Programme sind nicht standardisiert.' },
      pg: { none: 'Der Client heißt `psql` und hat Backslash-Befehle wie `\\dt` (siehe psql-Befehle).' },
      mysql: {
        exampleLang: 'sh',
        example: e(`
mysql -u root -p shop

mysql> SHOW TABLES;
mysql> SELECT * FROM kunden WHERE id = 1\\G
*************************** 1. row ***************************
   id: 1
 name: Müller GmbH
stadt: Berlin
mysql> SOURCE schema.sql
mysql> exit

# Einzelne Anweisung, z. B. im Shell-Skript
mysql -u root -p shop -e "SELECT COUNT(*) FROM kunden;"
`)
      },
      mssql: { none: 'Der Kommandozeilen-Client heißt `sqlcmd` (siehe sqlcmd).' },
      sqlite: { none: 'Der Client heißt `sqlite3` und hat Punktbefehle wie `.tables` (siehe sqlite3-Kommandozeile).' }
    }
  },
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'Benutzervariablen (@var)',
    desc: 'Sitzungsvariablen mit @, ohne Deklaration – gelten bis zum Ende der Verbindung.',
    details: '`SET @name = wert` oder `SELECT … INTO @name` legt eine Benutzervariable an, die in allen folgenden Anweisungen derselben Verbindung nutzbar ist; ihr Typ ergibt sich aus dem Wert. Nicht gesetzte Variablen sind `NULL`. Die Zuweisung mit `:=` innerhalb eines `SELECT` (früher für Zeilennummern genutzt) ist veraltet – dafür gibt es Fensterfunktionen. Innerhalb von Prozeduren gibt es zusätzlich lokale Variablen mit `DECLARE`.',
    tip: 'Mit einem Verbindungspool können Variablen einer früheren Anfrage noch gesetzt sein – vor Gebrauch immer selbst setzen.',
    keywords: ['benutzervariable', 'user variable', '@variable', 'set @', 'select into', 'sitzungsvariable', 'mysql'],
    related: ['T-SQL-Variablen', 'Variablen & Kontrollfluss (PL/pgSQL)', 'ROW_NUMBER()'],
    mdn: MY + 'user-variables.html',
    dialects: {
      std: { none: 'Kein Standard; Variablen gibt es dort nur in Routinen (SQL/PSM `DECLARE`).' },
      pg: { none: 'Keine Sitzungsvariablen in SQL; in psql `\\set name wert` und `:name`, in Funktionen und `DO`-Blöcken `DECLARE` (siehe Variablen & Kontrollfluss (PL/pgSQL)).' },
      mysql: {
        syntax: 'SET @name = wert;\nSELECT ausdruck INTO @name FROM …;',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt DECIMAL(10,2));
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'Vertrieb', 3900),
  (3, 'Cem', 'IT', 4800), (4, 'Dana', 'Vertrieb', 4100);

SET @grenze = 4000;
SELECT name, gehalt FROM mitarbeiter WHERE gehalt > @grenze ORDER BY gehalt DESC;
-- name | gehalt
-- Ada  | 5200.00
-- Cem  | 4800.00
-- Dana | 4100.00

SELECT MAX(gehalt) INTO @max FROM mitarbeiter;
SELECT @max AS hoechstes, @gibt_es_nicht AS unbekannt;
-- hoechstes | unbekannt
-- 5200.00   | NULL
`)
      },
      mssql: { none: 'Variablen müssen mit `DECLARE @name typ` deklariert werden und gelten nur bis zum Ende des Batches (siehe T-SQL-Variablen).' },
      sqlite: { none: 'Keine Variablen in SQL; Werte kommen als Parameter (`?`, `:name`) aus dem Programm, in der Kommandozeile mit `.parameter set :name wert`.' }
    }
  },
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'UNSIGNED',
    desc: 'Ganzzahl ohne Vorzeichen: nur Werte ab 0, dafür doppelt so großer positiver Bereich.',
    details: '`INT UNSIGNED` reicht von 0 bis 4 294 967 295 statt von −2 147 483 648 bis 2 147 483 647. Negative Werte sind im strikten Modus ein Fehler. Fallstrick: Rechnet man mit `UNSIGNED`-Werten und das Ergebnis wird negativ, gibt es einen Bereichsfehler – etwa bei `bestand - reserviert`. `UNSIGNED` für `DECIMAL`/`FLOAT` und `ZEROFILL` sind veraltet.',
    values: [
      ['TINYINT UNSIGNED', '0 bis 255'],
      ['SMALLINT UNSIGNED', '0 bis 65 535'],
      ['INT UNSIGNED', '0 bis 4 294 967 295'],
      ['BIGINT UNSIGNED', '0 bis 18 446 744 073 709 551 615']
    ],
    tip: 'Für „darf nicht negativ sein“ ist `CHECK (spalte >= 0)` klarer und portabel; `UNSIGNED` lohnt sich nur, wenn der größere Bereich gebraucht wird.',
    keywords: ['unsigned', 'vorzeichenlos', 'ohne vorzeichen', 'zerofill', 'tinyint', 'positiv', 'mysql'],
    related: ['INTEGER', 'BIGINT', 'CHECK', 'SQL_MODE'],
    mdn: MY + 'numeric-type-attributes.html',
    dialects: {
      std: { none: 'Kein `UNSIGNED`; stattdessen `CHECK (spalte >= 0)` und bei Bedarf der nächstgrößere Typ.' },
      pg: { none: 'Kein `UNSIGNED`; stattdessen `CHECK (spalte >= 0)` und bei Bedarf `BIGINT`.' },
      mysql: {
        syntax: 'spalte INT UNSIGNED',
        example: e(`
CREATE TABLE lager (produkt_id INT UNSIGNED PRIMARY KEY, bestand SMALLINT UNSIGNED NOT NULL);
INSERT INTO lager VALUES (1, 65535), (2, 0);

-- INSERT INTO lager VALUES (3, -1);
--   → Fehler: Out of range value for column 'bestand' at row 1

SELECT produkt_id, bestand FROM lager ORDER BY produkt_id;
-- produkt_id | bestand
-- 1          | 65535
-- 2          | 0

-- Fallstrick: negatives Zwischenergebnis
-- SELECT bestand - 1 FROM lager WHERE produkt_id = 2;
--   → Fehler: BIGINT UNSIGNED value is out of range
SELECT CAST(bestand AS SIGNED) - 1 AS differenz FROM lager WHERE produkt_id = 2;
-- differenz
-- -1
`)
      },
      mssql: { none: 'Kein `UNSIGNED` (nur `TINYINT` ist 0–255); stattdessen `CHECK (spalte >= 0)`.' },
      sqlite: { none: 'Wird als Typname akzeptiert, aber ignoriert (Affinität INTEGER); stattdessen `CHECK (spalte >= 0)`.' }
    }
  },
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'ON UPDATE CURRENT_TIMESTAMP',
    desc: 'Zeitstempelspalte, die MySQL bei jeder Änderung der Zeile selbst aktualisiert.',
    details: 'Eine `TIMESTAMP`- oder `DATETIME`-Spalte mit `ON UPDATE CURRENT_TIMESTAMP` bekommt bei jedem `UPDATE`, das tatsächlich einen Wert ändert, die aktuelle Zeit. Zusammen mit `DEFAULT CURRENT_TIMESTAMP` entsteht so ein „zuletzt geändert“-Feld ohne Trigger. Ein `UPDATE`, das alle Werte gleich lässt, ändert den Zeitstempel nicht. `TIMESTAMP` wird in UTC gespeichert und reicht nur bis 2038, `DATETIME` nicht.',
    tip: 'Für Zeitpunkte nach 2038 `DATETIME` verwenden – das Verhalten mit `DEFAULT` und `ON UPDATE` ist dasselbe.',
    keywords: ['on update current_timestamp', 'geändert am', 'updated_at', 'zeitstempel', 'automatisch', 'timestamp', 'mysql'],
    related: ['TIMESTAMP', 'DEFAULT', 'Audit-Trigger', 'CREATE TRIGGER'],
    mdn: MY + 'timestamp-initialization.html',
    dialects: {
      std: { none: 'Kein Standard; einen `BEFORE UPDATE`-Trigger nutzen, der die Spalte setzt (siehe Audit-Trigger).' },
      pg: { none: 'Kein `ON UPDATE`; ein `BEFORE UPDATE`-Trigger mit `NEW.geaendert := now();` übernimmt das.' },
      mysql: {
        syntax: 'spalte TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        example: e(`
CREATE TABLE kunden (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  angelegt  DATETIME DEFAULT CURRENT_TIMESTAMP,
  geaendert DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO kunden (id, name) VALUES (1, 'Müller GmbH');
UPDATE kunden SET name = 'Müller AG' WHERE id = 1;

SELECT name, geaendert FROM kunden;
-- z. B. Müller AG, 2026-11-16 10:30:00 (Zeitpunkt des UPDATE)
`)
      },
      mssql: { none: 'Kein `ON UPDATE`; ein `AFTER UPDATE`-Trigger setzt die Spalte (`UPDATE … SET geaendert = SYSDATETIME() FROM inserted …`).' },
      sqlite: { none: 'Kein `ON UPDATE`; ein `AFTER UPDATE`-Trigger setzt die Spalte (`UPDATE kunden SET geaendert = CURRENT_TIMESTAMP WHERE id = NEW.id`).' }
    }
  },
  {
    lang: 'sql', group: 'MySQL-Besonderheiten', name: 'DELETE … LIMIT',
    desc: 'Löscht oder ändert nur die ersten n Zeilen in einer gewählten Reihenfolge.',
    details: 'MySQL erlaubt `ORDER BY` und `LIMIT` direkt in `DELETE` und `UPDATE` (für eine einzelne Tabelle). Das ist praktisch, um große Löschungen in kleinen Portionen zu erledigen, ohne lange Sperren zu halten, oder um die ältesten Einträge zu entfernen. Ohne `ORDER BY` ist nicht festgelegt, welche Zeilen es trifft. Portabel löscht man über die IDs aus einer begrenzten Unterabfrage.',
    tip: 'Aufräumjobs in einer Schleife mit `LIMIT 1000` laufen lassen, bis keine Zeile mehr betroffen ist – so bleibt die Datenbank ansprechbar.',
    keywords: ['delete limit', 'update limit', 'in portionen löschen', 'batch delete', 'älteste löschen', 'top', 'mysql'],
    related: ['DELETE', 'LIMIT / OFFSET', 'TOP', 'Sicheres UPDATE / DELETE'],
    mdn: MY + 'delete.html',
    dialects: {
      std: {
        syntax: 'DELETE FROM tabelle\nWHERE id IN (SELECT id FROM tabelle ORDER BY … FETCH FIRST n ROWS ONLY);',
        example: e(`
CREATE TABLE protokoll (id INT PRIMARY KEY, datum DATE);
INSERT INTO protokoll VALUES
  (1, '2026-03-04'), (2, '2026-03-01'), (3, '2026-03-05'), (4, '2026-03-02'), (5, '2026-03-03');

-- Die zwei ältesten Einträge löschen
DELETE FROM protokoll
WHERE id IN (SELECT id FROM protokoll ORDER BY datum FETCH FIRST 2 ROWS ONLY);

SELECT id, datum FROM protokoll ORDER BY datum;
-- id | datum
-- 5  | 2026-03-03
-- 1  | 2026-03-04
-- 3  | 2026-03-05
`)
      },
      pg: { note: 'PostgreSQL kennt kein `LIMIT` in `DELETE`/`UPDATE`; die Unterabfrage darf aber auch `LIMIT 2` statt `FETCH FIRST` schreiben.' },
      mysql: {
        syntax: 'DELETE FROM tabelle [WHERE …] ORDER BY … LIMIT n;\nUPDATE tabelle SET … [WHERE …] ORDER BY … LIMIT n;',
        note: 'Die portable Form mit `IN (SELECT … LIMIT n)` lehnt MySQL ab („doesn\'t yet support LIMIT & IN subquery“).',
        example: e(`
CREATE TABLE protokoll (id INT PRIMARY KEY, datum DATE);
INSERT INTO protokoll VALUES
  (1, '2026-03-04'), (2, '2026-03-01'), (3, '2026-03-05'), (4, '2026-03-02'), (5, '2026-03-03');

-- Die zwei ältesten Einträge löschen
DELETE FROM protokoll ORDER BY datum LIMIT 2;

SELECT id, datum FROM protokoll ORDER BY datum;
-- id | datum
-- 5  | 2026-03-03
-- 1  | 2026-03-04
-- 3  | 2026-03-05
`)
      },
      mssql: {
        note: '`DELETE TOP (n)` gibt es, erlaubt aber kein `ORDER BY`. Mit Reihenfolge löscht man über eine CTE.',
        example: e(`
CREATE TABLE protokoll (id INT PRIMARY KEY, datum DATE);
INSERT INTO protokoll VALUES
  (1, '2026-03-04'), (2, '2026-03-01'), (3, '2026-03-05'), (4, '2026-03-02'), (5, '2026-03-03');

-- Die zwei ältesten Einträge löschen
WITH aelteste AS (SELECT TOP (2) * FROM protokoll ORDER BY datum)
DELETE FROM aelteste;

SELECT id, datum FROM protokoll ORDER BY datum;
-- id | datum
-- 5  | 2026-03-03
-- 1  | 2026-03-04
-- 3  | 2026-03-05
`)
      },
      sqlite: {
        note: '`DELETE … LIMIT` gibt es nur, wenn SQLite mit `SQLITE_ENABLE_UPDATE_DELETE_LIMIT` übersetzt wurde (meist nicht). Die Unterabfrage mit `LIMIT` funktioniert immer.',
        example: e(`
CREATE TABLE protokoll (id INTEGER PRIMARY KEY, datum DATE);
INSERT INTO protokoll VALUES
  (1, '2026-03-04'), (2, '2026-03-01'), (3, '2026-03-05'), (4, '2026-03-02'), (5, '2026-03-03');

-- Die zwei ältesten Einträge löschen
DELETE FROM protokoll
WHERE id IN (SELECT id FROM protokoll ORDER BY datum LIMIT 2);

SELECT id, datum FROM protokoll ORDER BY datum;
-- id | datum
-- 5  | 2026-03-03
-- 1  | 2026-03-04
-- 3  | 2026-03-05
`)
      }
    }
  },

  // ---------------- SQL-Server-Besonderheiten (T-SQL) ----------------
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: 'TOP',
    desc: 'Begrenzt in SQL Server das Ergebnis auf die ersten n Zeilen oder Prozent.',
    details: '`SELECT TOP (n)` liefert höchstens n Zeilen; welche, legt `ORDER BY` fest. `TOP (n) PERCENT` nimmt einen Anteil, `WITH TIES` nimmt zusätzlich alle Zeilen, die mit der letzten gleichauf liegen. `TOP` funktioniert auch in `UPDATE`, `DELETE` und `INSERT`, dort aber ohne Sortierung. Zum Blättern mit Offset gibt es `OFFSET … ROWS FETCH NEXT … ROWS ONLY`.',
    values: [
      ['TOP (n)', 'Höchstens n Zeilen'],
      ['TOP (n) PERCENT', 'n Prozent der Zeilen (aufgerundet)'],
      ['TOP (n) WITH TIES', 'Plus alle Gleichstände zur letzten Zeile (braucht ORDER BY)'],
      ['OFFSET m ROWS FETCH NEXT n ROWS ONLY', 'Blättern, braucht ORDER BY']
    ],
    tip: 'Die Klammern bei `TOP (n)` immer setzen – nur mit Klammern sind Variablen und Ausdrücke erlaubt, und ohne sind sie nur noch aus Kompatibilität erlaubt.',
    keywords: ['top', 'top n', 'with ties', 'percent', 'erste zeilen', 'limit', 'sql server', 't-sql'],
    related: ['LIMIT / OFFSET', 'FETCH FIRST', 'DELETE … LIMIT', 'Top-N pro Gruppe'],
    mdn: MS + 'queries/top-transact-sql',
    dialects: {
      std: { none: 'Kein `TOP`; im Standard `FETCH FIRST n ROWS ONLY` bzw. `FETCH FIRST n ROWS WITH TIES` (siehe FETCH FIRST).' },
      pg: { none: 'Kein `TOP`; stattdessen `LIMIT n` oder `FETCH FIRST n ROWS ONLY` / `WITH TIES` (siehe LIMIT / OFFSET).' },
      mysql: { none: 'Kein `TOP`; stattdessen `LIMIT n` (siehe LIMIT / OFFSET). `WITH TIES` gibt es nicht – Gleichstände über `RANK()` lösen.' },
      mssql: {
        syntax: 'SELECT TOP (n) [PERCENT] [WITH TIES] spalten\nFROM tabelle\nORDER BY …;',
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES
  (1, N'Maus', 19.99), (2, N'Tastatur', 49.90), (3, N'Monitor', 189.00),
  (4, N'Kabel', 4.50), (5, N'Headset', 49.90);

SELECT TOP (2) name, preis FROM produkte ORDER BY preis DESC, name;
-- name    | preis
-- Monitor | 189.00
-- Headset | 49.90

-- WITH TIES: Tastatur kostet genauso viel wie Headset
SELECT name, preis
FROM (SELECT TOP (2) WITH TIES name, preis FROM produkte ORDER BY preis DESC) AS t
ORDER BY preis DESC, name;
-- name     | preis
-- Monitor  | 189.00
-- Headset  | 49.90
-- Tastatur | 49.90

SELECT TOP (40) PERCENT name FROM produkte ORDER BY preis;
-- name
-- Kabel
-- Maus
`)
      },
      sqlite: { none: 'Kein `TOP`; stattdessen `LIMIT n` (siehe LIMIT / OFFSET).' }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: 'T-SQL-Variablen',
    desc: 'Lokale Variablen mit @, dazu IF, WHILE und BEGIN … END direkt in Skripten.',
    details: '`DECLARE @name typ [= wert]` legt eine Variable an, `SET @x = …` oder `SELECT @x = spalte FROM …` weist zu. Variablen gelten nur bis zum Ende des Batches (bis zum nächsten `GO`). T-SQL erlaubt Kontrollfluss mit `IF … ELSE`, `WHILE` und `BEGIN … END` direkt im Skript, ohne Prozedur. Fallstrick: Liefert `SELECT @x = …` keine Zeile, behält `@x` seinen alten Wert.',
    values: [
      ['DECLARE @x INT = 1;', 'Variable anlegen'],
      ['SET @x = @x + 1;', 'Zuweisen (ein Wert)'],
      ['SELECT @x = spalte FROM …', 'Zuweisen aus Abfrage'],
      ['IF bedingung … ELSE …', 'Verzweigung'],
      ['WHILE bedingung BEGIN … END', 'Schleife'],
      ['PRINT \'Text\';', 'Meldung ausgeben']
    ],
    tip: '`SET @x = (SELECT …)` meldet einen Fehler, wenn die Abfrage mehrere Zeilen liefert – `SELECT @x = …` nimmt stillschweigend irgendeine.',
    keywords: ['declare', '@variable', 'set', 't-sql', 'tsql', 'if else', 'while', 'begin end', 'print', 'variable', 'sql server'],
    related: ['Benutzervariablen (@var)', 'Variablen & Kontrollfluss (PL/pgSQL)', 'GO', 'TRY … CATCH'],
    mdn: MS + 'language-elements/declare-local-variable-transact-sql',
    dialects: {
      std: { none: 'Variablen und Kontrollfluss gibt es im Standard nur in Routinen (SQL/PSM).' },
      pg: { none: 'Variablen nur in PL/pgSQL-Funktionen oder anonymen `DO`-Blöcken (siehe Variablen & Kontrollfluss (PL/pgSQL)).' },
      mysql: { none: 'Ohne Deklaration als Benutzervariablen `@x` (siehe Benutzervariablen (@var)); `DECLARE`, `IF` und `WHILE` nur in Prozeduren, Funktionen und Triggern.' },
      mssql: {
        syntax: 'DECLARE @name typ [= wert];\nSET @name = ausdruck;\nIF bedingung … ELSE …',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), gehalt DECIMAL(10,2));
INSERT INTO mitarbeiter VALUES (1, N'Ada', 5200), (2, N'Ben', 3900), (3, N'Cem', 4800), (4, N'Dana', 4100);

DECLARE @grenze DECIMAL(10,2) = 4000;
DECLARE @anzahl INT;

SELECT @anzahl = COUNT(*) FROM mitarbeiter WHERE gehalt > @grenze;
SET @grenze = @grenze + 500;

SELECT @anzahl AS anzahl, @grenze AS grenze;
-- anzahl | grenze
-- 3      | 4500.00

IF @anzahl > 2
  SELECT N'viele' AS bewertung;
ELSE
  SELECT N'wenige' AS bewertung;
-- bewertung
-- viele

-- Schleife
DECLARE @i INT = 1, @summe INT = 0;
WHILE @i <= 4
BEGIN
  SET @summe += @i;
  SET @i += 1;
END;
SELECT @summe AS summe;
-- summe
-- 10
`)
      },
      sqlite: { none: 'Keine Variablen und kein Kontrollfluss in SQL; Logik gehört in das aufrufende Programm.' }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: 'TRY … CATCH',
    desc: 'Fängt Fehler in T-SQL ab, um z. B. eine Transaktion sauber zurückzurollen.',
    details: 'Tritt im `BEGIN TRY`-Block ein Fehler auf, springt die Ausführung in den `BEGIN CATCH`-Block. Dort liefern `ERROR_NUMBER()`, `ERROR_MESSAGE()`, `ERROR_LINE()` und `ERROR_PROCEDURE()` Details; `THROW;` ohne Argumente gibt den Fehler an den Aufrufer weiter. Typisch ist: Transaktion im TRY, bei Fehler `IF @@TRANCOUNT > 0 ROLLBACK`. Kompilierfehler (z. B. unbekannte Tabelle im selben Batch) fängt `TRY` nicht.',
    values: [
      ['ERROR_NUMBER()', 'Fehlernummer, z. B. 547 = Constraint verletzt'],
      ['ERROR_MESSAGE()', 'Fehlertext'],
      ['ERROR_LINE()', 'Zeile des Fehlers'],
      ['THROW;', 'Gefangenen Fehler weiterwerfen'],
      ['THROW 50001, \'Text\', 1;', 'Eigenen Fehler auslösen'],
      ['@@TRANCOUNT', 'Anzahl offener Transaktionen']
    ],
    tip: 'Mit `SET XACT_ABORT ON` rollt SQL Server bei jedem Laufzeitfehler die ganze Transaktion automatisch zurück – zusammen mit TRY … CATCH das robusteste Muster.',
    keywords: ['try catch', 'begin try', 'begin catch', 'fehlerbehandlung', 'exception', 'throw', 'raiserror', 'error_message', 'xact_abort', 'sql server'],
    related: ['Transaktionen im Code', 'ROLLBACK', 'Trigger-Validierung (RAISE)', 'T-SQL-Variablen'],
    mdn: MS + 'language-elements/try-catch-transact-sql',
    dialects: {
      std: { none: 'Im Standard nur in Routinen über SQL/PSM-Handler (`DECLARE … HANDLER`).' },
      pg: {
        note: 'PL/pgSQL fängt Fehler mit `EXCEPTION WHEN … THEN` am Ende eines Blocks; Änderungen des Blocks werden dabei automatisch zurückgerollt. `SQLERRM` enthält den Fehlertext.',
        mdn: PG + 'plpgsql-control-structures.html#PLPGSQL-ERROR-TRAPPING',
        example: e(`
CREATE TABLE konten (id INT PRIMARY KEY, saldo DECIMAL(10,2) CHECK (saldo >= 0));
INSERT INTO konten VALUES (1, 100), (2, 50);

DO $$
BEGIN
  UPDATE konten SET saldo = saldo - 200 WHERE id = 1;
  UPDATE konten SET saldo = saldo + 200 WHERE id = 2;
EXCEPTION WHEN check_violation THEN
  RAISE NOTICE 'Umbuchung abgebrochen: %', SQLERRM;
END $$;

SELECT id, saldo FROM konten ORDER BY id;
-- id | saldo
-- 1  | 100.00
-- 2  | 50.00
`)
      },
      mysql: {
        note: 'In Prozeduren fängt `DECLARE … HANDLER FOR SQLEXCEPTION` Fehler ab; außerhalb von Prozeduren gibt es keine Fehlerbehandlung in SQL.',
        mdn: MY + 'declare-handler.html',
        example: e(`
CREATE TABLE konten (id INT PRIMARY KEY, saldo DECIMAL(10,2) CHECK (saldo >= 0));
INSERT INTO konten VALUES (1, 100), (2, 50);

DELIMITER //
CREATE PROCEDURE umbuchen(betrag DECIMAL(10,2))
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SELECT 'zurückgerollt' AS status;
  END;
  START TRANSACTION;
  UPDATE konten SET saldo = saldo - betrag WHERE id = 1;
  UPDATE konten SET saldo = saldo + betrag WHERE id = 2;
  COMMIT;
  SELECT 'gebucht' AS status;
END //
DELIMITER ;

CALL umbuchen(200);
-- status
-- zurückgerollt

SELECT id, saldo FROM konten ORDER BY id;
-- id | saldo
-- 1  | 100.00
-- 2  | 50.00
`)
      },
      mssql: {
        syntax: 'BEGIN TRY\n  …\nEND TRY\nBEGIN CATCH\n  …\nEND CATCH;',
        example: e(`
CREATE TABLE konten (id INT PRIMARY KEY, saldo DECIMAL(10,2) CHECK (saldo >= 0));
INSERT INTO konten VALUES (1, 100), (2, 50);

BEGIN TRY
  BEGIN TRANSACTION;
  UPDATE konten SET saldo = saldo - 200 WHERE id = 1;
  UPDATE konten SET saldo = saldo + 200 WHERE id = 2;
  COMMIT;
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0 ROLLBACK;
  SELECT ERROR_NUMBER() AS fehlernummer;
  -- ERROR_MESSAGE(): The UPDATE statement conflicted with the CHECK constraint …
  -- THROW;  -- würde den Fehler an den Aufrufer weitergeben
END CATCH;
-- fehlernummer
-- 547

SELECT id, saldo FROM konten ORDER BY id;
-- id | saldo
-- 1  | 100.00
-- 2  | 50.00
`)
      },
      sqlite: { none: 'Keine Fehlerbehandlung in SQL; Fehler fängt das aufrufende Programm ab (try/except) und ruft `ROLLBACK` auf. Konflikte lassen sich mit `ON CONFLICT`-Klauseln steuern.' }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: 'OUTPUT',
    desc: 'Liefert bei INSERT, UPDATE, DELETE und MERGE die betroffenen Zeilen zurück.',
    details: 'Die `OUTPUT`-Klausel steht zwischen Tabellenname und `VALUES`/`WHERE` und gibt Spalten aus den Pseudotabellen `inserted` (neue Werte) und `deleted` (alte Werte) zurück. So erhält man bei einem `INSERT` alle neu vergebenen IDs, bei einem `UPDATE` Vorher und Nachher. Mit `OUTPUT … INTO @tabelle` landen die Zeilen in einer Tabelle statt im Ergebnis – nötig, wenn auf der Tabelle Trigger liegen.',
    values: [
      ['inserted.spalte', 'Neuer Wert (INSERT, UPDATE, MERGE)'],
      ['deleted.spalte', 'Alter Wert (DELETE, UPDATE, MERGE)'],
      ['$action', 'Bei MERGE: INSERT, UPDATE oder DELETE'],
      ['OUTPUT … INTO @t', 'In Tabellenvariable oder Tabelle schreiben']
    ],
    tip: '`OUTPUT inserted.id` ist bei mehrzeiligen INSERTs zuverlässiger als `SCOPE_IDENTITY()`, das nur die letzte ID liefert.',
    keywords: ['output', 'inserted', 'deleted', 'returning', 'neue id', 'output into', 'scope_identity', 'sql server'],
    related: ['RETURNING', 'MERGE', 'IDENTITY', '@@ROWCOUNT'],
    mdn: MS + 'queries/output-clause-transact-sql',
    dialects: {
      std: { none: 'Kein Standard; in anderen Systemen heißt das Gegenstück `RETURNING`.' },
      pg: { none: 'Statt `OUTPUT` steht `RETURNING` am Ende der Anweisung; alte Werte bei `UPDATE` seit PostgreSQL 18 mit `RETURNING old.spalte, new.spalte` (siehe RETURNING).' },
      mysql: { none: 'Kein `OUTPUT`/`RETURNING`; die erste neue ID liefert `LAST_INSERT_ID()`, sonst eine zweite Abfrage.' },
      mssql: {
        syntax: 'INSERT INTO t (…) OUTPUT inserted.spalte VALUES (…);\nUPDATE t SET … OUTPUT deleted.x, inserted.x WHERE …;\nDELETE FROM t OUTPUT deleted.* WHERE …;',
        example: e(`
CREATE TABLE kunden (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(50), stadt NVARCHAR(50));

INSERT INTO kunden (name, stadt)
OUTPUT inserted.id, inserted.name
VALUES (N'Müller GmbH', N'Berlin'), (N'Schmidt AG', N'Hamburg');
-- id | name
-- 1  | Müller GmbH
-- 2  | Schmidt AG

UPDATE kunden SET stadt = N'Köln'
OUTPUT deleted.stadt AS alt, inserted.stadt AS neu
WHERE id = 2;
-- alt     | neu
-- Hamburg | Köln

DELETE FROM kunden
OUTPUT deleted.id, deleted.name
WHERE stadt = N'Berlin';
-- id | name
-- 1  | Müller GmbH
`)
      },
      sqlite: { none: 'Statt `OUTPUT` steht `RETURNING` am Ende der Anweisung (seit SQLite 3.35, siehe RETURNING).' }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: 'CROSS APPLY / OUTER APPLY',
    desc: 'Führt eine Unterabfrage oder Tabellenfunktion für jede Zeile der linken Tabelle aus.',
    details: '`APPLY` ist das T-SQL-Gegenstück zu `LATERAL`: Die rechte Seite darf auf Spalten der linken verweisen und wird pro Zeile ausgewertet. `CROSS APPLY` verhält sich wie ein Inner Join (Zeilen ohne Ergebnis fallen weg), `OUTER APPLY` wie ein Left Join (mit `NULL` aufgefüllt). Klassische Anwendungen: „Top-N je Gruppe“ mit `TOP (n)` und das Aufrufen von Tabellenfunktionen wie `STRING_SPLIT` oder `OPENJSON` pro Zeile.',
    tip: 'Für „neueste Bestellung je Kunde“ ist `CROSS APPLY (SELECT TOP (1) … ORDER BY datum DESC)` mit einem Index auf (kunde_id, datum) oft schneller als `ROW_NUMBER()`.',
    keywords: ['cross apply', 'outer apply', 'apply', 'lateral', 'top n je gruppe', 'tabellenfunktion', 'sql server', 't-sql'],
    related: ['LATERAL', 'Top-N pro Gruppe', 'DISTINCT ON', 'LEFT JOIN'],
    mdn: MS + 'queries/from-transact-sql',
    dialects: {
      std: { none: 'Im Standard heißt das `LATERAL`: `CROSS JOIN LATERAL (…)` bzw. `LEFT JOIN LATERAL (…) ON TRUE` (siehe LATERAL).' },
      pg: { none: 'Statt `APPLY`: `CROSS JOIN LATERAL (…)` und `LEFT JOIN LATERAL (…) ON true` (siehe LATERAL).' },
      mysql: { none: 'Statt `APPLY`: seit MySQL 8.0.14 `JOIN LATERAL (…)` bzw. `LEFT JOIN LATERAL (…) ON TRUE` (siehe LATERAL).' },
      mssql: {
        syntax: 'FROM a CROSS APPLY (unterabfrage mit a.spalte) AS b\nFROM a OUTER APPLY (…) AS b',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50));
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO kunden VALUES (1, N'Müller GmbH'), (2, N'Schmidt AG'), (3, N'Weber KG');
INSERT INTO bestellungen VALUES
  (1, 1, 120.00, '2026-03-01'), (2, 1, 80.50, '2026-03-05'),
  (3, 2, 45.00, '2026-03-02'), (4, 2, 300.00, '2026-03-04');

-- Neueste Bestellung je Kunde (Kunden ohne Bestellung fallen weg)
SELECT k.name, b.datum, b.betrag
FROM kunden k
CROSS APPLY (SELECT TOP (1) datum, betrag FROM bestellungen
             WHERE kunde_id = k.id ORDER BY datum DESC) AS b
ORDER BY k.name;
-- name        | datum      | betrag
-- Müller GmbH | 2026-03-05 | 80.50
-- Schmidt AG  | 2026-03-04 | 300.00

-- OUTER APPLY behält Kunden ohne Bestellung
SELECT k.name, b.datum, b.betrag
FROM kunden k
OUTER APPLY (SELECT TOP (1) datum, betrag FROM bestellungen
             WHERE kunde_id = k.id ORDER BY datum DESC) AS b
ORDER BY k.name;
-- name        | datum      | betrag
-- Müller GmbH | 2026-03-05 | 80.50
-- Schmidt AG  | 2026-03-04 | 300.00
-- Weber KG    | NULL       | NULL
`)
      },
      sqlite: { none: 'Kein `APPLY` und kein `LATERAL`; stattdessen korrelierte Unterabfragen oder `ROW_NUMBER()` in einer CTE (siehe Top-N pro Gruppe).' }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: 'SELECT … INTO',
    desc: 'Legt eine neue Tabelle an und füllt sie mit dem Ergebnis einer Abfrage.',
    details: '`SELECT spalten INTO neue_tabelle FROM …` erzeugt die Tabelle mit Spalten und Typen aus der Abfrage und kopiert die Daten in einem Schritt. Übernommen werden auch `IDENTITY`-Eigenschaft und `NULL`-Fähigkeit, nicht aber Primärschlüssel, Indizes, Constraints und Defaults. Mit `WHERE 1 = 0` kopiert man nur die Struktur. Die Zieltabelle darf noch nicht existieren; für bestehende Tabellen gibt es `INSERT … SELECT`.',
    tip: 'Für schnelle Sicherungskopien vor einem riskanten Update: `SELECT * INTO kunden_backup FROM kunden;`.',
    keywords: ['select into', 'tabelle kopieren', 'ctas', 'create table as', 'backup tabelle', 'struktur kopieren', 'sql server'],
    related: ['CREATE TABLE AS', 'INSERT … SELECT', '#temp-Tabellen'],
    mdn: MS + 'queries/select-into-clause-transact-sql',
    dialects: {
      std: { none: 'Im Standard weist `SELECT … INTO` Variablen zu; eine neue Tabelle aus einer Abfrage erzeugt `CREATE TABLE … AS SELECT …` (siehe CREATE TABLE AS).' },
      pg: {
        note: 'PostgreSQL versteht `SELECT … INTO tabelle` ebenfalls, empfiehlt aber `CREATE TABLE … AS`. In PL/pgSQL bedeutet `SELECT … INTO` dagegen Zuweisung an Variablen.',
        mdn: PG + 'sql-selectinto.html',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt DECIMAL(10,2));
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'Vertrieb', 3900), (3, 'Cem', 'IT', 4800);

SELECT name, gehalt INTO it_mitarbeiter FROM mitarbeiter WHERE abteilung = 'IT';

SELECT name, gehalt FROM it_mitarbeiter ORDER BY name;
-- name | gehalt
-- Ada  | 5200.00
-- Cem  | 4800.00
`)
      },
      mysql: { none: '`SELECT … INTO` weist nur Variablen zu (oder schreibt mit `INTO OUTFILE` eine Datei); neue Tabellen mit `CREATE TABLE … AS SELECT …` oder leer mit `CREATE TABLE neu LIKE alt`.' },
      mssql: {
        syntax: 'SELECT spalten INTO neue_tabelle FROM quelle [WHERE …];',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), abteilung NVARCHAR(50), gehalt DECIMAL(10,2));
INSERT INTO mitarbeiter VALUES
  (1, N'Ada', N'IT', 5200), (2, N'Ben', N'Vertrieb', 3900), (3, N'Cem', N'IT', 4800);

SELECT name, gehalt INTO it_mitarbeiter FROM mitarbeiter WHERE abteilung = N'IT';

SELECT name, gehalt FROM it_mitarbeiter ORDER BY name;
-- name | gehalt
-- Ada  | 5200.00
-- Cem  | 4800.00

-- Nur die Struktur kopieren
SELECT * INTO mitarbeiter_leer FROM mitarbeiter WHERE 1 = 0;
SELECT COUNT(*) AS anzahl FROM mitarbeiter_leer;
-- anzahl
-- 0
`)
      },
      sqlite: { none: 'Kein `SELECT … INTO`; stattdessen `CREATE TABLE neu AS SELECT …` (siehe CREATE TABLE AS).' }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: 'NVARCHAR & N\'…\'',
    desc: 'Unicode-Text in SQL Server: NVARCHAR-Spalten und String-Literale mit N davor.',
    details: '`VARCHAR` speichert Text in der Codepage der Kollation (meist Windows-1252), `NVARCHAR` speichert Unicode (UTF-16, 2 Byte pro Zeichen, Emojis 4). Ein Literal ohne `N` ist immer `VARCHAR`: Zeichen außerhalb der Codepage werden schon beim Lesen der Anweisung zu `?` – noch bevor sie in die `NVARCHAR`-Spalte kommen. Deshalb Unicode-Literale immer als `N\'…\'` schreiben. `NVARCHAR(MAX)` fasst bis 2 GB.',
    values: [
      ['VARCHAR(n)', 'Codepage-Text, n Byte'],
      ['NVARCHAR(n)', 'Unicode (UTF-16), n Byte-Paare'],
      ['NVARCHAR(MAX)', 'Unicode bis 2 GB (statt veraltetem NTEXT)'],
      ['N\'…\'', 'Unicode-Literal'],
      ['LEN() / DATALENGTH()', 'Zeichen (ohne Leerzeichen am Ende) / Bytes']
    ],
    tip: 'Parameter aus .NET/JDBC kommen als `NVARCHAR`; trifft das auf eine indizierte `VARCHAR`-Spalte, kann eine implizite Umwandlung den Index aushebeln.',
    keywords: ['nvarchar', 'nchar', 'unicode', 'n prefix', 'n string', 'utf-16', 'datalength', 'ntext', 'sql server'],
    related: ['VARCHAR', 'String-Literale', 'Zeichensätze & utf8mb4', 'Collation'],
    mdn: MS + 'data-types/nchar-and-nvarchar-transact-sql',
    dialects: {
      std: { none: 'Der Standard kennt `NATIONAL CHARACTER VARYING` (`NCHAR VARYING`) und `N\'…\'`; in der Praxis ist es nur in SQL Server nötig, weil die anderen Systeme Text ohnehin als UTF-8 speichern.' },
      pg: { none: 'Nicht nötig: Text ist in UTF-8-Datenbanken immer Unicode. `NCHAR`, `NVARCHAR` und `N\'…\'` werden akzeptiert und sind gleichbedeutend mit `CHAR`, `VARCHAR` und `\'…\'`.' },
      mysql: { none: 'Nicht nötig mit `utf8mb4` (siehe Zeichensätze & utf8mb4). Achtung: `NVARCHAR` bedeutet in MySQL `VARCHAR` mit dem veralteten `utf8mb3`.' },
      mssql: {
        syntax: 'spalte NVARCHAR(n | MAX)\nN\'Unicode-Text\'',
        example: e(`
CREATE TABLE notizen (id INT PRIMARY KEY, ohne_n NVARCHAR(20), mit_n NVARCHAR(20));
INSERT INTO notizen VALUES (1, 'Tokio 東京', N'Tokio 東京');

-- Ohne N gehen die Schriftzeichen schon im Literal verloren
SELECT ohne_n, mit_n FROM notizen;
-- ohne_n   | mit_n
-- Tokio ?? | Tokio 東京

SELECT LEN(N'Grüße') AS zeichen, DATALENGTH(N'Grüße') AS bytes_n, DATALENGTH('Grüße') AS bytes;
-- zeichen | bytes_n | bytes
-- 5       | 10      | 5
`)
      },
      sqlite: { none: 'Nicht nötig: Text ist immer Unicode (UTF-8). `NVARCHAR` wird als Typname akzeptiert und hat TEXT-Affinität.' }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: 'GO',
    desc: 'Trennt ein T-SQL-Skript in Batches – ein Befehl der Werkzeuge, nicht des Servers.',
    details: '`GO` steht allein in einer Zeile und wird von `sqlcmd`, SSMS und Azure Data Studio ausgewertet: Alles davor geht als ein Batch an den Server. Nötig ist das, weil `CREATE VIEW`, `CREATE PROCEDURE`, `CREATE FUNCTION` und `CREATE TRIGGER` die erste Anweisung eines Batches sein müssen. Variablen gelten nur innerhalb eines Batches. Aus Programmen (ADO.NET, JDBC) schickt man Batches einzeln – `GO` dort ist ein Syntaxfehler.',
    tip: '`GO 5` führt den vorigen Batch fünfmal aus – praktisch für Testdaten in sqlcmd und SSMS.',
    keywords: ['go', 'batch', 'batch trenner', 'separator', 'sqlcmd', 'ssms', 'create view erste anweisung', 'sql server'],
    related: ['T-SQL-Variablen', 'sqlcmd', 'CREATE VIEW', 'Stored Procedure', 'Dollar-Quoting ($$)'],
    mdn: MS + 'language-elements/sql-server-utilities-statements-go',
    dialects: {
      std: { none: 'Kein Standard; Anweisungen werden durch Semikolon getrennt.' },
      pg: { none: 'Kein `GO`; Anweisungen enden mit `;`, Funktionsrümpfe stehen in `$$ … $$` (siehe Dollar-Quoting ($$)).' },
      mysql: { none: 'Kein `GO`; für Prozeduren und Trigger stellt der Client mit `DELIMITER //` das Trennzeichen um.' },
      mssql: {
        syntax: 'anweisungen\nGO\nCREATE VIEW …\nGO',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50));
GO

CREATE VIEW v_kunden AS SELECT id, name FROM kunden;
GO

INSERT INTO kunden VALUES (1, N'Müller GmbH');
SELECT name FROM v_kunden;
-- name
-- Müller GmbH
GO

-- Variablen gelten nur bis zum nächsten GO
DECLARE @x INT = 1;
GO
-- SELECT @x;  → Fehler: Must declare the scalar variable "@x".
`)
      },
      sqlite: { none: 'Kein `GO`; Anweisungen enden mit `;`.' }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: '#temp-Tabellen',
    desc: 'Tabellen mit # vor dem Namen sind temporär; dazu kommen Tabellenvariablen @t.',
    details: '`#name` ist eine lokale temporäre Tabelle: nur in der eigenen Sitzung sichtbar und beim Trennen automatisch gelöscht; `##name` ist global für alle Sitzungen sichtbar. Beide liegen in der Systemdatenbank `tempdb` und können Indizes haben. Eine Tabellenvariable (`DECLARE @t TABLE (…)`) lebt nur bis zum Ende des Batches und hat keine Statistiken – gut für wenige Zeilen, schlecht für große Mengen.',
    values: [
      ['#tabelle', 'Lokal: nur eigene Sitzung'],
      ['##tabelle', 'Global: alle Sitzungen, bis die letzte sie nicht mehr nutzt'],
      ['DECLARE @t TABLE (…)', 'Tabellenvariable, nur im Batch'],
      ['SELECT … INTO #t', 'Temporäre Tabelle direkt aus Abfrage']
    ],
    tip: 'In Prozeduren, die mehrfach in derselben Sitzung laufen, vorher `DROP TABLE IF EXISTS #tmp;` – sonst scheitert das zweite `CREATE`.',
    keywords: ['#temp', '#tmp', 'temporäre tabelle', '##global', 'tempdb', 'tabellenvariable', 'table variable', '@tabelle', 'sql server'],
    related: ['Temporäre Tabellen', 'SELECT … INTO', 'T-SQL-Variablen'],
    mdn: MS + 'statements/create-table-transact-sql',
    dialects: {
      std: { none: 'Im Standard `CREATE [GLOBAL | LOCAL] TEMPORARY TABLE`; die `#`-Schreibweise ist T-SQL (siehe Temporäre Tabellen).' },
      pg: { none: 'Kein `#`; stattdessen `CREATE TEMP TABLE name (…)`, auf Wunsch `ON COMMIT DROP` (siehe Temporäre Tabellen).' },
      mysql: { none: 'Kein `#`; stattdessen `CREATE TEMPORARY TABLE name (…)` (siehe Temporäre Tabellen).' },
      mssql: {
        syntax: 'CREATE TABLE #name (…);\nSELECT … INTO #name FROM …;\nDECLARE @name TABLE (…);',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), abteilung NVARCHAR(50), gehalt DECIMAL(10,2));
INSERT INTO mitarbeiter VALUES
  (1, N'Ada', N'IT', 5200), (2, N'Ben', N'Vertrieb', 3900), (3, N'Cem', N'IT', 4800);

SELECT name, gehalt INTO #it FROM mitarbeiter WHERE abteilung = N'IT';
SELECT name, gehalt FROM #it ORDER BY gehalt DESC;
-- name | gehalt
-- Ada  | 5200.00
-- Cem  | 4800.00
DROP TABLE IF EXISTS #it;

-- Tabellenvariable
DECLARE @spitze TABLE (name NVARCHAR(50));
INSERT INTO @spitze SELECT TOP (1) name FROM mitarbeiter ORDER BY gehalt DESC;
SELECT name FROM @spitze;
-- name
-- Ada
`)
      },
      sqlite: { none: 'Kein `#`; stattdessen `CREATE TEMP TABLE name (…)` – sie liegt in der Datenbank `temp` (siehe Temporäre Tabellen).' }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: 'sp_help',
    desc: 'System-Prozeduren, die Tabellen, Spalten, Indizes und Code-Definitionen anzeigen.',
    details: '`EXEC sp_help \'tabelle\'` liefert mehrere Ergebnistabellen: Eigentümer und Anlagedatum, alle Spalten mit Typ und Länge, Identity-Spalte, Indizes und Constraints. Ohne Argument listet es alle Objekte der Datenbank. Verwandte Prozeduren: `sp_columns`, `sp_helpindex`, `sp_helptext` (Quelltext von Views, Prozeduren, Triggern) und `sp_who2` (aktive Sitzungen). Für Auswertungen per Abfrage sind die Katalogsichten `sys.tables`, `sys.columns` oder `information_schema` besser.',
    values: [
      ['sp_help \'t\'', 'Alles über ein Objekt'],
      ['sp_columns \'t\'', 'Spalten einer Tabelle'],
      ['sp_helpindex \'t\'', 'Indizes einer Tabelle'],
      ['sp_helptext \'v\'', 'Quelltext einer View/Prozedur'],
      ['sp_who2', 'Aktive Sitzungen'],
      ['sp_spaceused \'t\'', 'Zeilen und Speicherplatz']
    ],
    tip: 'In SSMS zeigt Alt+F1 auf einem markierten Tabellennamen dasselbe wie `sp_help`.',
    keywords: ['sp_help', 'sp_columns', 'sp_helpindex', 'sp_helptext', 'sp_who2', 'tabelle beschreiben', 'describe', 'sys.tables', 'sql server'],
    related: ['information_schema', 'SHOW-Befehle', 'psql-Befehle', 'PRAGMA (SQLite)'],
    mdn: MSR + 'relational-databases/system-stored-procedures/sp-help-transact-sql',
    dialects: {
      std: { none: 'Kein Standard; portabel über `information_schema.columns`.' },
      pg: { none: 'In psql `\\d tabelle`, sonst `information_schema` oder `pg_catalog` (siehe psql-Befehle).' },
      mysql: { none: 'Stattdessen `DESCRIBE tabelle`, `SHOW INDEX FROM tabelle`, `SHOW CREATE TABLE tabelle` (siehe SHOW-Befehle).' },
      mssql: {
        syntax: "EXEC sp_help 'tabelle';\nEXEC sp_helpindex 'tabelle';",
        example: e(`
CREATE TABLE kunden (
  id INT IDENTITY(1,1) CONSTRAINT pk_kunden PRIMARY KEY,
  name NVARCHAR(50) NOT NULL,
  stadt NVARCHAR(50)
);

EXEC sp_help 'kunden';
-- liefert mehrere Ergebnistabellen: Name und Anlagedatum, Spalten mit Typ und Länge,
-- Identity-Spalte, Indizes und Constraints

EXEC sp_helpindex 'kunden';
-- index_name | index_description                                  | index_keys
-- pk_kunden  | clustered, unique, primary key located on PRIMARY | id
`)
      },
      sqlite: { none: 'Stattdessen `PRAGMA table_info(tabelle)`, `PRAGMA index_list(tabelle)` oder `.schema tabelle` in der Kommandozeile.' }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: '@@ROWCOUNT',
    desc: 'Anzahl der Zeilen, die die vorige Anweisung gelesen oder geändert hat.',
    details: '`@@ROWCOUNT` gilt nur für die unmittelbar vorhergehende Anweisung – schon ein `SET`, `IF` oder `PRINT` setzt es neu. Wer den Wert braucht, speichert ihn sofort in einer Variablen. Typisch ist die Prüfung nach einem `UPDATE`: Wurde nichts geändert, folgt ein `INSERT` oder eine Fehlermeldung. Für Werte über 2 Milliarden gibt es `ROWCOUNT_BIG()`.',
    tip: '`SET NOCOUNT ON` am Anfang von Prozeduren unterdrückt die „n rows affected“-Meldungen an den Client, `@@ROWCOUNT` funktioniert trotzdem.',
    keywords: ['@@rowcount', 'rowcount', 'betroffene zeilen', 'affected rows', 'row_count', 'changes', 'get diagnostics', 'set nocount', 'sql server'],
    related: ['UPDATE', 'OUTPUT', 'T-SQL-Variablen', 'ON DUPLICATE KEY UPDATE'],
    mdn: MS + 'functions/rowcount-transact-sql',
    dialects: {
      std: { none: 'Im Standard nur in Routinen über `GET DIAGNOSTICS n = ROW_COUNT`.' },
      pg: {
        note: 'In PL/pgSQL liefert `GET DIAGNOSTICS n = ROW_COUNT` die Zahl; psql zeigt sie nach jeder Anweisung als „UPDATE 3“, Treiber als `rowcount`.',
        mdn: PG + 'plpgsql-statements.html#PLPGSQL-STATEMENTS-DIAGNOSTICS',
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50);

DO $$
DECLARE n INT;
BEGIN
  UPDATE produkte SET preis = preis * 1.1 WHERE preis < 50;
  GET DIAGNOSTICS n = ROW_COUNT;
  RAISE NOTICE 'geändert: %', n;
END $$;
-- NOTICE:  geändert: 3
`)
      },
      mysql: {
        note: '`ROW_COUNT()` liefert die Zahl der tatsächlich geänderten Zeilen – Zeilen, deren Werte schon stimmten, zählen nicht mit.',
        mdn: MY + 'information-functions.html',
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50);

UPDATE produkte SET preis = preis * 1.1 WHERE preis < 50;
SELECT ROW_COUNT() AS geaendert;
-- geaendert
-- 3
`)
      },
      mssql: {
        syntax: 'SELECT @@ROWCOUNT;',
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, N'Maus', 19.99), (2, N'Tastatur', 49.90), (3, N'Monitor', 189.00), (4, N'Kabel', 4.50);

UPDATE produkte SET preis = preis * 1.1 WHERE preis < 50;
SELECT @@ROWCOUNT AS geaendert;
-- geaendert
-- 3

-- Sofort sichern, die nächste Anweisung überschreibt den Wert
DECLARE @n INT;
DELETE FROM produkte WHERE preis > 100;
SET @n = @@ROWCOUNT;
IF @n = 0 PRINT 'nichts gelöscht';
SELECT @n AS geloescht;
-- geloescht
-- 1
`)
      },
      sqlite: {
        note: '`changes()` liefert die Zahl der Zeilen, die das letzte `INSERT`, `UPDATE` oder `DELETE` geändert hat; `total_changes()` zählt seit dem Öffnen der Verbindung.',
        mdn: SL + 'lang_corefunc.html#changes',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50);

UPDATE produkte SET preis = preis * 1.1 WHERE preis < 50;
SELECT changes() AS geaendert;
-- geaendert
-- 3
`)
      }
    }
  },
  {
    lang: 'sql', group: 'SQL-Server-Besonderheiten (T-SQL)', name: 'sqlcmd',
    desc: 'Kommandozeilen-Client für SQL Server: Abfragen und Skripte aus dem Terminal.',
    details: '`sqlcmd -S server -d datenbank` verbindet sich (mit `-E` per Windows-Anmeldung, mit `-U`/`-P` per SQL-Login). Interaktiv schickt `GO` den eingegebenen Batch ab, `:r datei.sql` liest ein Skript ein, `EXIT` beendet. Mit `-Q "…"` läuft eine einzelne Abfrage, mit `-i datei.sql` ein ganzes Skript – ideal für Deployments und geplante Jobs. Das neuere `sqlcmd` (Go-Version) läuft auch auf Linux und macOS.',
    values: [
      ['-S server[,port]', 'Server (z. B. localhost,1433)'],
      ['-d db', 'Datenbank'],
      ['-E / -U name -P pw', 'Windows-Anmeldung / SQL-Login'],
      ['-Q "SQL"', 'Abfrage ausführen und beenden'],
      ['-i datei.sql / -o aus.txt', 'Skript ausführen / Ausgabe in Datei'],
      ['GO', 'Batch abschicken (interaktiv)'],
      [':r datei.sql', 'Skript einlesen']
    ],
    tip: 'Mit `-b` bricht sqlcmd bei einem Fehler ab und liefert einen Exit-Code ungleich 0 – wichtig in Build- und Deploy-Skripten.',
    keywords: ['sqlcmd', 'kommandozeile', 'cli', 'terminal', 'skript ausführen', 'sql server client', 'ssms'],
    related: ['GO', 'psql-Befehle', 'mysql-Client', 'sqlite3-Kommandozeile'],
    mdn: MSR + 'tools/sqlcmd/sqlcmd-utility',
    dialects: {
      std: { none: 'Client-Programme sind nicht standardisiert.' },
      pg: { none: 'Der Kommandozeilen-Client heißt `psql` (siehe psql-Befehle).' },
      mysql: { none: 'Der Kommandozeilen-Client heißt `mysql` (siehe mysql-Client).' },
      mssql: {
        exampleLang: 'sh',
        example: e(`
sqlcmd -S localhost,1433 -U sa -d shop

1> SELECT TOP (3) name FROM kunden ORDER BY name;
2> GO
1> :r schema.sql
1> EXIT

# Einzelne Abfrage bzw. Skript, Abbruch bei Fehlern
sqlcmd -S localhost -E -d shop -Q "SELECT COUNT(*) FROM kunden;"
sqlcmd -S localhost -E -d shop -b -i migration.sql -o protokoll.txt
`)
      },
      sqlite: { none: 'Der Kommandozeilen-Client heißt `sqlite3` (siehe sqlite3-Kommandozeile).' }
    }
  },

  // ---------------- SQLite-Besonderheiten ----------------
  {
    lang: 'sql', group: 'SQLite-Besonderheiten', name: 'rowid',
    desc: 'Versteckte 64-Bit-Ganzzahl, die jede Zeile einer SQLite-Tabelle eindeutig kennzeichnet.',
    details: 'Jede normale SQLite-Tabelle hat eine Spalte `rowid` (auch `oid` oder `_rowid_`), nach der die Zeilen im B-Baum sortiert gespeichert sind. Eine Spalte `INTEGER PRIMARY KEY` ist ein Alias für `rowid` – das ist der schnellste Zugriff und vergibt beim Einfügen ohne Wert automatisch max+1. Nur genau `INTEGER` macht den Alias; `INT PRIMARY KEY` oder `BIGINT PRIMARY KEY` erzeugen einen zusätzlichen Index. `last_insert_rowid()` liefert die zuletzt vergebene.',
    tip: 'Ohne explizite ID-Spalte kann `VACUUM` die rowids neu nummerieren – wer sie von außen referenziert, braucht eine `INTEGER PRIMARY KEY`-Spalte.',
    keywords: ['rowid', 'oid', '_rowid_', 'integer primary key', 'last_insert_rowid', 'zeilen-id', 'sqlite'],
    related: ['WITHOUT ROWID', 'Auto-Increment', 'sqlite_sequence', 'PRIMARY KEY'],
    mdn: SL + 'lang_createtable.html#rowid',
    dialects: {
      std: { none: 'Kein Standard; eine eindeutige Kennung bekommt man über einen eigenen Primärschlüssel.' },
      pg: { none: 'Keine stabile Zeilen-ID; `ctid` ist die physische Position und ändert sich bei jedem `UPDATE` und `VACUUM FULL` – nicht als Schlüssel verwenden.' },
      mysql: { none: 'Keine sichtbare Zeilen-ID; InnoDB nutzt den Primärschlüssel (oder eine interne versteckte ID, wenn keiner da ist).' },
      mssql: { none: 'Keine stabile Zeilen-ID; `%%physloc%%` ist nur die physische Position. Eindeutigkeit über `IDENTITY`-Spalten.' },
      sqlite: {
        syntax: 'SELECT rowid, … FROM tabelle;\nid INTEGER PRIMARY KEY  -- Alias für rowid',
        example: e(`
CREATE TABLE notizen (titel TEXT);
INSERT INTO notizen VALUES ('Einkauf'), ('Termin');
SELECT rowid, titel FROM notizen ORDER BY rowid;
-- rowid | titel
-- 1     | Einkauf
-- 2     | Termin

-- INTEGER PRIMARY KEY ist dieselbe Spalte wie rowid
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO kunden (name) VALUES ('Müller GmbH'), ('Schmidt AG');
SELECT rowid AS r, id, name FROM kunden ORDER BY id;
-- r | id | name
-- 1 | 1  | Müller GmbH
-- 2 | 2  | Schmidt AG

SELECT last_insert_rowid() AS letzte_id;
-- letzte_id
-- 2
`)
      }
    }
  },
  {
    lang: 'sql', group: 'SQLite-Besonderheiten', name: 'WITHOUT ROWID',
    desc: 'SQLite-Tabelle, die direkt nach dem Primärschlüssel gespeichert wird – ohne rowid.',
    details: 'Mit `WITHOUT ROWID` am Ende von `CREATE TABLE` entfällt die versteckte `rowid`; die Zeilen liegen nach dem Primärschlüssel sortiert im B-Baum (wie ein Clustered Index). Das spart Platz und einen Index-Zugriff bei Tabellen mit zusammengesetztem oder Text-Schlüssel, etwa Zuordnungs- oder Übersetzungstabellen. Ein `PRIMARY KEY` ist Pflicht, `AUTOINCREMENT` gibt es nicht, und bei großen Zeilen (über etwa 1/20 einer Seite) ist es eher langsamer.',
    tip: 'Lohnt sich vor allem für kleine Zeilen mit nicht-ganzzahligem oder zusammengesetztem Schlüssel; im Zweifel messen.',
    keywords: ['without rowid', 'clustered', 'zusammengesetzter schlüssel', 'speicherplatz', 'sqlite'],
    related: ['rowid', 'Zusammengesetzter Primärschlüssel', 'Covering Index'],
    mdn: SL + 'withoutrowid.html',
    dialects: {
      std: { none: 'Kein Standard; die physische Speicherung ist Sache des Systems.' },
      pg: { none: 'Keine Entsprechung; Tabellen sind Heaps, `CLUSTER tabelle USING index` sortiert nur einmalig um.' },
      mysql: { none: 'Nicht nötig: InnoDB speichert jede Tabelle ohnehin nach dem Primärschlüssel sortiert.' },
      mssql: { none: 'Entspricht einem Clustered Index auf dem Primärschlüssel – das ist in SQL Server der Standard.' },
      sqlite: {
        syntax: 'CREATE TABLE name (…, PRIMARY KEY (…)) WITHOUT ROWID;',
        example: e(`
CREATE TABLE uebersetzungen (
  sprache TEXT,
  schluessel TEXT,
  text TEXT NOT NULL,
  PRIMARY KEY (sprache, schluessel)
) WITHOUT ROWID;

INSERT INTO uebersetzungen VALUES
  ('de', 'gruss', 'Hallo'), ('en', 'gruss', 'Hello'), ('de', 'abschied', 'Tschüss');

SELECT schluessel, text FROM uebersetzungen WHERE sprache = 'de' ORDER BY schluessel;
-- schluessel | text
-- abschied   | Tschüss
-- gruss      | Hallo

-- SELECT rowid FROM uebersetzungen;  → Fehler: no such column: rowid
`)
      }
    }
  },
  {
    lang: 'sql', group: 'SQLite-Besonderheiten', name: 'sqlite3-Kommandozeile',
    desc: 'Punktbefehle der sqlite3-Shell: Tabellen anzeigen, Ausgabe formatieren, CSV importieren.',
    details: '`sqlite3 datei.db` öffnet (oder erzeugt) eine Datenbank. Befehle mit Punkt am Anfang wie `.tables` oder `.schema` wertet die Shell selbst aus; sie brauchen kein Semikolon und gibt es nicht in Programmbibliotheken. `.mode` und `.headers` steuern die Ausgabe (z. B. `box`, `csv`, `json`, `markdown`), `.import` lädt CSV-Dateien, `.read` führt ein Skript aus, `.backup` sichert die Datenbank im laufenden Betrieb.',
    values: [
      ['.tables', 'Tabellen auflisten'],
      ['.schema [tabelle]', 'CREATE-Anweisungen anzeigen'],
      ['.mode box | csv | json | markdown', 'Ausgabeformat'],
      ['.headers on', 'Spaltennamen anzeigen'],
      ['.import --csv datei.csv tabelle', 'CSV importieren'],
      ['.read datei.sql', 'Skript ausführen'],
      ['.output datei', 'Ausgabe in Datei umleiten'],
      ['.backup datei.db', 'Konsistente Sicherung'],
      ['.quit', 'Beenden']
    ],
    tip: '`.help` listet alle Punktbefehle; `.mode box` gibt die lesbarste Tabellenausgabe.',
    keywords: ['sqlite3', 'kommandozeile', 'cli', 'shell', '.tables', '.schema', '.mode', '.headers', '.import', '.read', 'punktbefehl', 'csv import'],
    related: ['sqlite_schema', 'PRAGMA (SQLite)', 'psql-Befehle', 'mysql-Client', 'sqlcmd', 'Backup & Export'],
    mdn: SL + 'cli.html',
    dialects: {
      std: { none: 'Client-Programme sind nicht standardisiert.' },
      pg: { none: 'Der Client heißt `psql` und hat Backslash-Befehle wie `\\dt` (siehe psql-Befehle).' },
      mysql: { none: 'Der Client heißt `mysql`; Tabellen zeigt `SHOW TABLES` (siehe mysql-Client).' },
      mssql: { none: 'Der Client heißt `sqlcmd`; Objekte zeigt `sp_help` (siehe sqlcmd).' },
      sqlite: {
        exampleLang: 'sh',
        example: e(`
sqlite3 shop.db

sqlite> .tables
bestellungen  kunden
sqlite> .schema kunden
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT);
sqlite> .mode box
sqlite> SELECT id, name FROM kunden LIMIT 2;
┌────┬─────────────┐
│ id │    name     │
├────┼─────────────┤
│ 1  │ Müller GmbH │
│ 2  │ Schmidt AG  │
└────┴─────────────┘
sqlite> .import --csv neue_kunden.csv kunden
sqlite> .backup sicherung.db
sqlite> .quit

# Abfrage direkt aus der Shell, Ergebnis als CSV
sqlite3 -header -csv shop.db "SELECT * FROM kunden;" > kunden.csv
`)
      }
    }
  },
  {
    lang: 'sql', group: 'SQLite-Besonderheiten', name: 'VACUUM',
    desc: 'Baut die SQLite-Datei neu auf und gibt den Platz gelöschter Daten frei.',
    details: 'Gelöschte Zeilen hinterlassen in SQLite freie Seiten, die Datei schrumpft aber nicht. `VACUUM` kopiert die Datenbank kompakt neu, defragmentiert sie und gibt den Platz an das Dateisystem zurück; währenddessen ist sie gesperrt und es wird bis zu doppelt so viel Platz gebraucht. `VACUUM INTO \'datei.db\'` schreibt stattdessen eine kompakte Kopie – eine gute Sicherung. Mit `PRAGMA auto_vacuum = FULL` (vor dem ersten `CREATE TABLE`) wird freier Platz laufend zurückgegeben.',
    tip: 'Nach großen Löschungen oder Migrationen einmal `VACUUM`, nicht nach jeder Änderung – es schreibt jedes Mal die ganze Datei.',
    keywords: ['vacuum', 'vacuum into', 'auto_vacuum', 'datei verkleinern', 'speicher freigeben', 'defragmentieren', 'optimize table', 'sqlite'],
    related: ['Backup & Export', 'PRAGMA (SQLite)', 'ANALYZE (Statistiken)'],
    mdn: SL + 'lang_vacuum.html',
    dialects: {
      std: { none: 'Kein Standard; Speicherverwaltung ist Sache des Systems.' },
      pg: {
        note: 'PostgreSQL hat ebenfalls `VACUUM`, mit anderem Zweck: Es macht Platz alter Zeilenversionen (MVCC) wiederverwendbar, läuft meist automatisch (Autovacuum) und verkleinert die Datei nicht. Erst `VACUUM FULL` schreibt die Tabelle neu und sperrt sie dabei. Es darf nicht in einer Transaktion laufen.',
        mdn: PG + 'sql-vacuum.html',
        example: e(`
-- Platz alter Zeilenversionen freigeben und Statistiken aktualisieren
VACUUM (ANALYZE);
`)
      },
      mysql: {
        note: 'In MySQL heißt das `OPTIMIZE TABLE`; bei InnoDB baut es die Tabelle neu auf (intern `ALTER TABLE … FORCE`) und gibt Platz frei, wenn jede Tabelle eine eigene Datei hat (Standard).',
        mdn: MY + 'optimize-table.html',
        example: e(`
CREATE TABLE protokoll (id INT PRIMARY KEY, meldung VARCHAR(100));
INSERT INTO protokoll VALUES (1, 'Start'), (2, 'Stopp');
DELETE FROM protokoll;

OPTIMIZE TABLE protokoll;
-- liefert eine Statuszeile je Tabelle, bei InnoDB mit dem Hinweis „doing recreate + analyze instead“
`)
      },
      mssql: {
        note: 'Kein `VACUUM`; Indizes werden mit `ALTER INDEX … REBUILD` (oder `REORGANIZE`) neu aufgebaut. `DBCC SHRINKDATABASE` verkleinert Dateien, fragmentiert aber Indizes und ist nur selten sinnvoll.',
        mdn: MS + 'statements/alter-index-transact-sql',
        example: e(`
CREATE TABLE protokoll (id INT PRIMARY KEY, meldung NVARCHAR(100));
INSERT INTO protokoll VALUES (1, N'Start'), (2, N'Stopp');
DELETE FROM protokoll;

ALTER INDEX ALL ON protokoll REBUILD;
`)
      },
      sqlite: {
        syntax: 'VACUUM;\nVACUUM INTO \'datei.db\';',
        example: e(`
CREATE TABLE protokoll (id INTEGER PRIMARY KEY, meldung TEXT);
INSERT INTO protokoll VALUES (1, 'Start'), (2, 'Stopp');
DELETE FROM protokoll;

-- Datei kompakt neu schreiben
VACUUM;

-- Kompakte Kopie als Sicherung (Datei darf noch nicht existieren):
-- VACUUM INTO 'sicherung.db';
`)
      }
    }
  },
  {
    lang: 'sql', group: 'SQLite-Besonderheiten', name: 'sqlite_sequence',
    desc: 'Interne Tabelle, in der SQLite den Zähler von AUTOINCREMENT-Spalten speichert.',
    details: 'Eine Spalte `INTEGER PRIMARY KEY AUTOINCREMENT` vergibt nie eine ID zweimal, auch nicht nach dem Löschen der höchsten Zeile; den höchsten je vergebenen Wert merkt sich SQLite in `sqlite_sequence` (Spalten `name` und `seq`). Ohne `AUTOINCREMENT` nimmt `INTEGER PRIMARY KEY` einfach max+1, sodass gelöschte IDs am Ende wiederkommen können. `AUTOINCREMENT` kostet etwas Leistung und wird nur gebraucht, wenn IDs nie wiederverwendet werden dürfen.',
    tip: 'Den Zähler kann man per `UPDATE sqlite_sequence SET seq = … WHERE name = \'tabelle\'` verstellen, etwa nach einem Import.',
    keywords: ['sqlite_sequence', 'autoincrement', 'zähler', 'sequenz', 'id wiederverwendung', 'seq', 'sqlite'],
    related: ['rowid', 'Auto-Increment', 'AUTO_INCREMENT', 'Sequenzen'],
    mdn: SL + 'autoinc.html',
    dialects: {
      std: { none: 'Kein Standard; den Zähler einer Identitätsspalte setzt dort `ALTER TABLE … ALTER COLUMN … RESTART WITH n`.' },
      pg: { none: 'Identitätsspalten und `SERIAL` nutzen echte Sequenzen; Stand mit `currval`, ändern mit `setval` oder `ALTER TABLE … ALTER COLUMN id RESTART WITH n` (siehe Sequenzen).' },
      mysql: { none: 'Der Zähler ist eine Tabelleneigenschaft: lesen über `information_schema.tables.AUTO_INCREMENT`, setzen mit `ALTER TABLE t AUTO_INCREMENT = n` (siehe AUTO_INCREMENT).' },
      mssql: { none: 'Den `IDENTITY`-Zähler zeigt `IDENT_CURRENT(\'tabelle\')`, setzen lässt er sich mit `DBCC CHECKIDENT (\'tabelle\', RESEED, n)`.' },
      sqlite: {
        syntax: 'id INTEGER PRIMARY KEY AUTOINCREMENT\nSELECT name, seq FROM sqlite_sequence;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
INSERT INTO kunden (name) VALUES ('Müller GmbH'), ('Schmidt AG');
DELETE FROM kunden WHERE id = 2;
INSERT INTO kunden (name) VALUES ('Weber KG');

-- ID 2 wird nicht wiederverwendet
SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller GmbH
-- 3  | Weber KG

SELECT name, seq FROM sqlite_sequence;
-- name   | seq
-- kunden | 3

-- Zähler verstellen
UPDATE sqlite_sequence SET seq = 100 WHERE name = 'kunden';
INSERT INTO kunden (name) VALUES ('Fischer OHG');
SELECT MAX(id) AS max_id FROM kunden;
-- max_id
-- 101
`)
      }
    }
  },
  {
    lang: 'sql', group: 'SQLite-Besonderheiten', name: 'WAL-Modus',
    desc: 'Write-Ahead-Logging: Leser und ein Schreiber arbeiten gleichzeitig ohne sich zu blockieren.',
    details: 'Standardmäßig sperrt ein Schreibvorgang in SQLite die ganze Datei auch für Leser (Rollback-Journal). Mit `PRAGMA journal_mode = WAL` landen Änderungen zuerst in einer Datei `datei.db-wal`; Leser sehen weiter den alten Stand, und gelesen und geschrieben wird gleichzeitig. Es bleibt bei einem Schreiber zur Zeit. Die Einstellung ist dauerhaft in der Datei gespeichert; sie funktioniert nicht auf Netzlaufwerken und nicht bei In-Memory-Datenbanken.',
    values: [
      ['PRAGMA journal_mode = WAL', 'WAL einschalten (dauerhaft)'],
      ['PRAGMA synchronous = NORMAL', 'Im WAL-Modus sicher und schneller als FULL'],
      ['PRAGMA busy_timeout = 5000', 'Bis zu 5 s auf Sperren warten statt sofort SQLITE_BUSY'],
      ['PRAGMA wal_checkpoint(TRUNCATE)', 'WAL-Inhalt in die Datenbank übertragen, WAL leeren']
    ],
    tip: 'Für Web-Anwendungen mit SQLite fast immer die richtige Wahl: `journal_mode = WAL`, `synchronous = NORMAL` und ein `busy_timeout`.',
    keywords: ['wal', 'write ahead log', 'journal_mode', 'busy_timeout', 'gleichzeitig', 'concurrency', 'sperre', 'database is locked', 'sqlite'],
    related: ['PRAGMA (SQLite)', 'BEGIN IMMEDIATE (SQLite)', 'Sperren', 'Transaktion'],
    mdn: SL + 'wal.html',
    dialects: {
      std: { none: 'Kein Standard; wie ein System Änderungen protokolliert, ist seine Sache.' },
      pg: { none: 'Nicht nötig: PostgreSQL schreibt immer ein WAL und erlaubt dank MVCC beliebig viele gleichzeitige Leser und Schreiber.' },
      mysql: { none: 'Nicht nötig: InnoDB nutzt immer ein Redo-Log und MVCC; Leser blockieren Schreiber nicht.' },
      mssql: { none: 'Nicht nötig: SQL Server schreibt immer ein Transaktionsprotokoll. Leser blockieren Schreiber nur ohne Zeilenversionierung – die schaltet `READ_COMMITTED_SNAPSHOT ON` ein.' },
      sqlite: {
        syntax: 'PRAGMA journal_mode = WAL;',
        example: e(`
-- Bei einer Datei-Datenbank liefert das: wal
-- (In-Memory-Datenbanken bleiben bei memory)
PRAGMA journal_mode = WAL;

PRAGMA synchronous = NORMAL;
PRAGMA busy_timeout = 5000;

CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO kunden (name) VALUES ('Müller GmbH');

-- WAL in die Hauptdatei übertragen, z. B. vor einer Dateikopie
PRAGMA wal_checkpoint(TRUNCATE);
`)
      }
    }
  },
  {
    lang: 'sql', group: 'SQLite-Besonderheiten', name: 'GLOB',
    desc: 'Mustervergleich wie LIKE, aber mit * und ? und mit Groß-/Kleinschreibung.',
    details: '`GLOB` nutzt Platzhalter wie in der Unix-Shell: `*` für beliebig viele Zeichen, `?` für genau eines, `[abc]` bzw. `[a-z]` für Zeichenklassen und `[^…]` für Ausschluss. Anders als `LIKE` (in SQLite für ASCII ohne Groß-/Kleinschreibung) unterscheidet `GLOB` immer zwischen `A` und `a`. Ein Index wird genutzt, wenn das Muster nicht mit einem Platzhalter beginnt.',
    values: [
      ['*', 'Beliebig viele Zeichen (wie % bei LIKE)'],
      ['?', 'Genau ein Zeichen (wie _ bei LIKE)'],
      ['[abc] / [a-z]', 'Eines der Zeichen / aus dem Bereich'],
      ['[^0-9]', 'Kein Zeichen aus der Klasse']
    ],
    tip: '`spalte GLOB \'*[^0-9]*\'` findet Werte, die nicht nur aus Ziffern bestehen – mit `LIKE` geht das nicht.',
    keywords: ['glob', 'muster', 'wildcard', 'platzhalter', 'like', 'case sensitive', 'zeichenklasse', 'sqlite'],
    related: ['LIKE', 'ILIKE', 'Reguläre Ausdrücke', 'Collation'],
    mdn: SL + 'lang_expr.html#glob',
    dialects: {
      std: { none: 'Kein `GLOB`; Mustervergleich mit `LIKE` (`%`, `_`) oder `SIMILAR TO` (mit Zeichenklassen).' },
      pg: { none: 'Kein `GLOB`; `LIKE` unterscheidet in PostgreSQL bereits Groß-/Kleinschreibung, Zeichenklassen gehen mit `SIMILAR TO` oder regulären Ausdrücken (`~`).' },
      mysql: { none: 'Kein `GLOB`; `LIKE` mit binärer Kollation (`COLLATE utf8mb4_bin`) für Groß-/Kleinschreibung, Zeichenklassen mit `REGEXP`.' },
      mssql: { none: 'Kein `GLOB`; `LIKE` kennt in SQL Server direkt Zeichenklassen wie `[a-z]` und `[^0-9]`, Groß-/Kleinschreibung über eine `_CS_`-Kollation.' },
      sqlite: {
        syntax: "spalte GLOB 'muster'",
        example: e(`
CREATE TABLE dateien (name TEXT);
INSERT INTO dateien VALUES ('Bericht.pdf'), ('bericht_alt.pdf'), ('Foto1.jpg'), ('Foto12.jpg');

SELECT name FROM dateien WHERE name GLOB 'Foto?.jpg';
-- name
-- Foto1.jpg

SELECT name FROM dateien WHERE name GLOB '[Bb]ericht*' ORDER BY name;
-- name
-- Bericht.pdf
-- bericht_alt.pdf

-- LIKE ignoriert Groß-/Kleinschreibung, GLOB nicht
SELECT 'ABC' LIKE 'abc' AS mit_like, 'ABC' GLOB 'abc' AS mit_glob;
-- mit_like | mit_glob
-- 1        | 0
`)
      }
    }
  },
  {
    lang: 'sql', group: 'SQLite-Besonderheiten', name: 'FTS5 (Volltextsuche)',
    desc: 'Virtuelle Tabelle für schnelle Volltextsuche mit Ranking und Hervorhebung.',
    details: '`CREATE VIRTUAL TABLE … USING fts5(spalten)` legt einen invertierten Index an; gesucht wird mit `MATCH`, sortiert nach Relevanz mit `ORDER BY rank` (BM25). Suchanfragen kennen `AND`, `OR`, `NOT`, Phrasen in Anführungszeichen und Präfixe mit `*`. `highlight()` und `snippet()` markieren Fundstellen. Wortstämme kennt der Standard-Tokenizer `unicode61` nicht; Präfixsuche oder der Tokenizer `porter` (nur Englisch) helfen.',
    values: [
      ['tabelle MATCH \'wort\'', 'Treffer in irgendeiner Spalte'],
      ['MATCH \'titel: wort\'', 'Nur in einer Spalte'],
      ['MATCH \'tabell*\'', 'Präfixsuche'],
      ['MATCH \'"zwei wörter"\'', 'Phrase'],
      ['ORDER BY rank', 'Nach Relevanz sortieren'],
      ['highlight(t, spalte, \'[\', \']\')', 'Treffer markieren']
    ],
    tip: 'Mit `content=\'tabelle\'` indiziert FTS5 eine vorhandene Tabelle, ohne den Text doppelt zu speichern; Trigger halten den Index aktuell.',
    keywords: ['fts5', 'fts', 'volltextsuche', 'full text search', 'match', 'virtual table', 'bm25', 'rank', 'highlight', 'sqlite'],
    related: ['Volltextsuche (tsvector)', 'LIKE', 'GLOB'],
    mdn: SL + 'fts5.html',
    dialects: {
      std: { none: 'Kein Standard; ohne Volltextsuche bleibt nur `LIKE \'%wort%\'`.' },
      pg: { none: 'Volltextsuche mit `tsvector`, `tsquery` und `@@` (siehe Volltextsuche (tsvector)).' },
      mysql: { none: 'Volltextsuche mit `FULLTEXT`-Index und `MATCH … AGAINST` (siehe Volltextsuche (tsvector), MySQL-Tab).' },
      mssql: { none: 'Volltextsuche als eigenes Feature mit `CONTAINS` / `FREETEXT` (siehe Volltextsuche (tsvector), SQL-Server-Tab).' },
      sqlite: {
        syntax: 'CREATE VIRTUAL TABLE name USING fts5(spalte1, spalte2);\nSELECT … FROM name WHERE name MATCH \'suche\';',
        example: e(`
CREATE VIRTUAL TABLE artikel USING fts5(titel, inhalt);
INSERT INTO artikel (rowid, titel, inhalt) VALUES
  (1, 'Indizes verstehen', 'Ein Index beschleunigt Abfragen auf großen Tabellen.'),
  (2, 'Joins', 'Tabellen über Schlüssel verbinden.'),
  (3, 'Backups', 'Regelmäßige Sicherungen der Datenbank.');

-- Präfixsuche: "tabelle*" findet auch "Tabellen"
SELECT rowid AS id, titel FROM artikel WHERE artikel MATCH 'tabelle*' ORDER BY rowid;
-- id | titel
-- 1  | Indizes verstehen
-- 2  | Joins

SELECT highlight(artikel, 1, '[', ']') AS treffer
FROM artikel WHERE artikel MATCH 'sicherungen';
-- treffer
-- Regelmäßige [Sicherungen] der Datenbank.
`)
      }
    }
  },
  {
    lang: 'sql', group: 'SQLite-Besonderheiten', name: 'In-Memory-Datenbank (:memory:)',
    desc: 'Eine SQLite-Datenbank, die nur im Arbeitsspeicher existiert – ideal für Tests.',
    details: 'Öffnet man statt eines Dateinamens `:memory:`, entsteht eine leere Datenbank im RAM, die mit dem Schließen der Verbindung verschwindet. Jede Verbindung bekommt ihre eigene; teilen lässt sie sich nur über eine URI wie `file:test?mode=memory&cache=shared`. Mit `ATTACH DATABASE \':memory:\' AS name` hängt man eine zusätzliche In-Memory-Datenbank für Zwischenergebnisse an. Typisch für Unit-Tests: Jeder Test startet in Millisekunden mit einer frischen Datenbank.',
    tip: 'Ein leerer Dateiname (`sqlite3.connect(\'\')`) erzeugt eine temporäre Datenbank, die bei Bedarf auf die Platte auslagert – gut für große Zwischenergebnisse.',
    keywords: [':memory:', 'in-memory', 'arbeitsspeicher', 'ram', 'test', 'unit test', 'temporär', 'attach', 'sqlite'],
    related: ['ATTACH DATABASE (SQLite)', 'Temporäre Tabellen', 'SQL aus Python (sqlite3)'],
    mdn: SL + 'inmemorydb.html',
    dialects: {
      std: { none: 'Kein Standard.' },
      pg: { none: 'Keine reine In-Memory-Datenbank; für Tests eine frische Datenbank bzw. einen Container, für schnelle Zwischenergebnisse `TEMP`- oder `UNLOGGED`-Tabellen.' },
      mysql: { none: 'Keine In-Memory-Datenbank; einzelne Tabellen mit `ENGINE = MEMORY` (siehe Storage Engines) oder temporäre Tabellen.' },
      mssql: { none: 'Keine In-Memory-Datenbank; speicheroptimierte Tabellen (In-Memory OLTP) oder `#temp`-Tabellen in `tempdb` (siehe #temp-Tabellen).' },
      sqlite: {
        syntax: "sqlite3 :memory:\nATTACH DATABASE ':memory:' AS name;",
        example: e(`
-- Programm: sqlite3.connect(':memory:'), Kommandozeile: sqlite3 :memory:
ATTACH DATABASE ':memory:' AS zwischen;

CREATE TABLE zwischen.werte (n INTEGER);
INSERT INTO zwischen.werte VALUES (1), (2), (3);

SELECT SUM(n) AS summe FROM zwischen.werte;
-- summe
-- 6

DETACH DATABASE zwischen;
`)
      }
    }
  }
  );
})();
