window.CHEAT = window.CHEAT || [];
(function () {
  var PG = 'https://www.postgresql.org/docs/current/'; // + z. B. 'sql-select.html'
  var SL = 'https://sqlite.org/';                      // + z. B. 'lang_select.html'
  var MY = 'https://dev.mysql.com/doc/refman/8.4/en/'; // MySQL-Referenzhandbuch
  var MS = 'https://learn.microsoft.com/en-us/sql/t-sql/'; // SQL Server (T-SQL)
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- SQL-Grundlagen ----------------
  {
    lang: 'sql', group: 'SQL-Grundlagen', name: 'Was ist SQL?',
    desc: 'Deklarative Sprache zum Abfragen und Ändern von Daten in relationalen Datenbanken.',
    details: 'SQL (Structured Query Language) beschreibt, welches Ergebnis man haben will, nicht wie es berechnet wird; den Ausführungsweg wählt der Optimierer der Datenbank. Eine Abfrage arbeitet immer auf Tabellen und liefert wieder eine Tabelle. Der Kern ist seit Jahrzehnten ISO-standardisiert, jedes System ergänzt aber eigene Funktionen und Syntax.',
    values: [
      ['Tabelle', 'Menge von Zeilen mit festen, benannten Spalten'],
      ['Zeile', 'Ein Datensatz (engl. row, tuple)'],
      ['Spalte', 'Ein Attribut mit Datentyp (engl. column)'],
      ['Abfrage', 'SELECT-Anweisung, liefert eine Ergebnistabelle'],
      ['Optimierer', 'Wählt Indizes, Join-Reihenfolge und Algorithmen']
    ],
    dialects: {
      std: {
        syntax: 'SELECT spalten FROM tabelle [WHERE bedingung] [ORDER BY spalte];',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200),
  (2, 'Ben', 'Vertrieb', 3900),
  (3, 'Cem', 'IT', 4800);

-- Was soll herauskommen? Wie gesucht wird, entscheidet die Datenbank.
SELECT name, gehalt
FROM mitarbeiter
WHERE abteilung = 'IT'
ORDER BY gehalt DESC;
-- name | gehalt
-- Ada  | 5200
-- Cem  | 4800
`)
      },
      pg: { note: 'Sehr standardnah; die prozedurale Sprache heißt PL/pgSQL.' },
      mysql: { note: 'MySQL weicht an vielen Stellen vom Standard ab (Backticks, `LIMIT`, `||` als ODER); die prozedurale Erweiterung ist Teil von MySQL selbst.' },
      mssql: { note: 'Der SQL-Dialekt von SQL Server heißt T-SQL (Transact-SQL) und bringt Variablen, Kontrollfluss und Fehlerbehandlung mit.' },
      sqlite: { note: 'SQLite ist eine eingebettete Bibliothek ohne Server; die ganze Datenbank liegt in einer Datei.' }
    },
    tip: 'Ausgesprochen wird es „S-Q-L“ oder „Sequel“; beides ist üblich.',
    keywords: ['structured query language', 'einführung', 'datenbank', 'abfragesprache', 'deklarativ', 'query', 'sequel', 't-sql'],
    related: ['Relationale Datenbank', 'SQL-Dialekte', 'SELECT'],
    mdn: PG + 'tutorial-sql-intro.html'
  },
  {
    lang: 'sql', group: 'SQL-Grundlagen', name: 'Relationale Datenbank',
    desc: 'Daten liegen in Tabellen, die über Schlüssel miteinander verknüpft werden.',
    details: 'Jede Tabelle beschreibt eine Art von Ding (Kunden, Bestellungen); ein Primärschlüssel identifiziert jede Zeile eindeutig. Fremdschlüssel verweisen auf Primärschlüssel anderer Tabellen und bilden so die Beziehungen, die man in Abfragen per Join wieder zusammenführt. Das Datenbanksystem (RDBMS) sichert Konsistenz über Constraints und Transaktionen.',
    values: [
      ['Primärschlüssel', 'Eindeutige Kennung einer Zeile (PRIMARY KEY)'],
      ['Fremdschlüssel', 'Verweis auf den Schlüssel einer anderen Tabelle (REFERENCES)'],
      ['Schema', 'Struktur aller Tabellen, Spalten und Beziehungen'],
      ['RDBMS', 'Relational Database Management System, z. B. PostgreSQL']
    ],
    dialects: {
      std: {
        example: e(`
CREATE TABLE abteilungen (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);
CREATE TABLE mitarbeiter (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  abteilung_id INTEGER REFERENCES abteilungen(id)
);
INSERT INTO abteilungen VALUES (1, 'IT'), (2, 'Vertrieb');
INSERT INTO mitarbeiter VALUES (1, 'Ada', 1), (2, 'Ben', 2), (3, 'Cem', 1);

-- Beziehung per Join auflösen
SELECT m.name, a.name AS abteilung
FROM mitarbeiter m
JOIN abteilungen a ON a.id = m.abteilung_id
ORDER BY m.name;
-- name | abteilung
-- Ada  | IT
-- Ben  | Vertrieb
-- Cem  | IT

-- INSERT INTO mitarbeiter VALUES (4, 'Dana', 9);
-- → Fehler: Abteilung 9 gibt es nicht (Fremdschlüssel verletzt)
`)
      },
      mysql: {
        example: e(`
CREATE TABLE abteilungen (id INT PRIMARY KEY, name VARCHAR(50) NOT NULL);
CREATE TABLE mitarbeiter (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  abteilung_id INT,
  FOREIGN KEY (abteilung_id) REFERENCES abteilungen(id)
);
INSERT INTO abteilungen VALUES (1, 'IT'), (2, 'Vertrieb');
INSERT INTO mitarbeiter VALUES (1, 'Ada', 1), (2, 'Ben', 2), (3, 'Cem', 1);

SELECT m.name, a.name AS abteilung
FROM mitarbeiter m
JOIN abteilungen a ON a.id = m.abteilung_id
ORDER BY m.name;
-- name | abteilung
-- Ada  | IT
-- Ben  | Vertrieb
-- Cem  | IT

-- INSERT INTO mitarbeiter VALUES (4, 'Dana', 9);
-- → Fehler: Cannot add or update a child row: a foreign key constraint fails
`),
        note: 'MySQL 8.4 ignoriert `REFERENCES` direkt hinter einer Spalte stillschweigend; der Fremdschlüssel muss als eigene Klausel `FOREIGN KEY (…) REFERENCES …` stehen. Nur InnoDB-Tabellen prüfen Fremdschlüssel.',
        mdn: MY + 'create-table-foreign-keys.html'
      },
      sqlite: {
        example: e(`
PRAGMA foreign_keys = ON;   -- pro Verbindung einschalten!

CREATE TABLE abteilungen (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE mitarbeiter (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  abteilung_id INTEGER REFERENCES abteilungen(id)
);
INSERT INTO abteilungen VALUES (1, 'IT'), (2, 'Vertrieb');
INSERT INTO mitarbeiter VALUES (1, 'Ada', 1), (2, 'Ben', 2), (3, 'Cem', 1);

SELECT m.name, a.name AS abteilung
FROM mitarbeiter m
JOIN abteilungen a ON a.id = m.abteilung_id
ORDER BY m.name;
-- name | abteilung
-- Ada  | IT
-- Ben  | Vertrieb
-- Cem  | IT

-- INSERT INTO mitarbeiter VALUES (4, 'Dana', 9);
-- → Fehler: FOREIGN KEY constraint failed
`),
        note: 'SQLite prüft Fremdschlüssel nur, wenn `PRAGMA foreign_keys = ON` für die Verbindung gesetzt ist; ohne das wird der Verweis auf Abteilung 9 klaglos gespeichert.',
        mdn: SL + 'foreignkeys.html'
      }
    },
    tip: 'Jede Information nur an einer Stelle speichern und per Schlüssel verweisen; das ist der Kern der Normalisierung.',
    keywords: ['rdbms', 'relational', 'tabelle', 'beziehung', 'schlüssel', 'primary key', 'foreign key', 'relation', 'pragma foreign_keys'],
    related: ['PRIMARY KEY', 'FOREIGN KEY', 'Joins im Überblick', 'Normalisierung'],
    mdn: PG + 'tutorial-concepts.html'
  },
  {
    lang: 'sql', group: 'SQL-Grundlagen', name: 'SQL-Dialekte',
    desc: 'PostgreSQL, MySQL, SQLite, SQL Server und Oracle weichen im Detail voneinander ab.',
    details: 'Der ISO-Standard legt den gemeinsamen Kern fest (SELECT, JOIN, GROUP BY, CTEs, Fensterfunktionen). Unterschiede gibt es vor allem bei Zeilenbegrenzung, Auto-Increment, String-Verkettung, Datums- und JSON-Funktionen sowie bei prozeduralem Code. Wer portabel bleiben will, nutzt Standardfunktionen wie `COALESCE`, `CASE` und `CAST` und testet gegen die Zieldatenbank. Oracle (PL/SQL, leerer String gleich NULL) ist ein weiterer verbreiteter Dialekt.',
    dialects: {
      std: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50);

-- Die zwei teuersten Produkte, ISO-Schreibweise (auch Oracle, Db2)
SELECT name, preis FROM produkte ORDER BY preis DESC FETCH FIRST 2 ROWS ONLY;
-- name     | preis
-- Monitor  | 189.00
-- Tastatur | 49.90
`),
        note: 'Der Standard (ISO/IEC 9075, aktuell SQL:2023) beschreibt viele optionale Features; kein System setzt ihn vollständig um.'
      },
      pg: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, preis NUMERIC(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50);

-- FETCH FIRST geht auch, LIMIT ist üblicher
SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 2;
-- name     | preis
-- Monitor  | 189.00
-- Tastatur | 49.90
`),
        note: 'Sehr standardnah, dazu viele Erweiterungen: `LIMIT`, `ILIKE`, `JSONB`, Arrays, `::`-Cast, `RETURNING`, `DISTINCT ON`.'
      },
      mysql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50);

SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 2;
-- name     | preis
-- Monitor  | 189.00
-- Tastatur | 49.90
`),
        note: 'Bezeichner in Backticks, `LIMIT`, `AUTO_INCREMENT`, `CONCAT()` statt `||`, String-Vergleiche standardmäßig ohne Groß-/Kleinschreibung. MariaDB ist ein Abzweig mit weitgehend gleicher Syntax.'
      },
      mssql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, N'Maus', 19.99), (2, N'Tastatur', 49.90), (3, N'Monitor', 189.00), (4, N'Kabel', 4.50);

SELECT TOP 2 name, preis FROM produkte ORDER BY preis DESC;
-- name     | preis
-- Monitor  | 189.00
-- Tastatur | 49.90
`),
        note: 'T-SQL: `TOP`, `IDENTITY`, `[Bezeichner]`, `+` zum Verketten, `BIT` statt `BOOLEAN`, `GO` als Batch-Trenner.'
      },
      sqlite: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, preis NUMERIC);
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50);

SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 2;
-- name     | preis
-- Monitor  | 189
-- Tastatur | 49.9
`),
        note: 'Eingebettet, eine Datei, dynamische Typen pro Wert, kein `GRANT`, kein `FETCH FIRST`; `LIMIT` wie PostgreSQL und MySQL.'
      }
    },
    tip: 'In der Doku der eigenen Datenbank nachsehen, bevor man ein Feature eines anderen Systems übernimmt; gleich benannte Funktionen verhalten sich teils unterschiedlich.',
    keywords: ['dialekt', 'dialect', 'postgresql', 'mysql', 'mariadb', 'sqlite', 'sql server', 't-sql', 'oracle', 'standard', 'iso', 'portabel', 'top', 'limit'],
    related: ['LIMIT / OFFSET', 'FETCH FIRST', '|| (Verkettung)', 'Auto-Increment'],
    mdn: PG + 'features.html'
  },
  {
    lang: 'sql', group: 'SQL-Grundlagen', name: 'Anweisungen & Semikolon',
    desc: 'Jede SQL-Anweisung endet mit einem Semikolon; Zeilenumbrüche sind beliebig.',
    details: 'SQL ist formatfrei: Leerzeichen, Tabs und Zeilenumbrüche trennen nur Wörter, eine Anweisung darf sich über viele Zeilen erstrecken. Das Semikolon trennt Anweisungen; Kommandozeilen-Clients führen erst beim Semikolon aus. Über Treiber aus Programmen schickt man meist genau eine Anweisung pro Aufruf.',
    dialects: {
      std: {
        syntax: 'anweisung1;\nanweisung2;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller GmbH', 'Berlin');
INSERT INTO kunden VALUES (2, 'Schmidt AG', 'Hamburg');

-- Eine Anweisung über mehrere Zeilen
SELECT name,
       stadt
FROM   kunden
WHERE  stadt = 'Berlin';
-- name        | stadt
-- Müller GmbH | Berlin
`)
      },
      pg: { note: '`psql` wartet ohne Semikolon mit der Eingabeaufforderung `-#` auf den Rest; `\\g` führt ebenfalls aus.' },
      mysql: { note: 'Der `mysql`-Client wartet mit `->` auf das Semikolon. Für Prozeduren und Trigger stellt man mit `DELIMITER //` vorübergehend ein anderes Endezeichen ein.' },
      mssql: { note: 'Das Semikolon ist meist optional, vor `WITH` (CTE), nach `MERGE` und vor `THROW` aber Pflicht. `GO` ist kein SQL, sondern trennt in `sqlcmd` und SSMS Batches.' },
      sqlite: { note: 'Die `sqlite3`-Shell wartet mit `...>` auf das Semikolon; Punkt-Befehle wie `.tables` brauchen keins.' }
    },
    tip: 'Hängt der Client mit einer Fortsetzungs-Eingabeaufforderung, fehlt meist nur das Semikolon oder ein schließendes Anführungszeichen.',
    keywords: ['statement', 'anweisung', 'semikolon', 'semicolon', 'befehl', 'formatierung', 'zeilenumbruch', 'go', 'delimiter'],
    related: ['Kommentare', 'Teilsprachen (DDL, DML, DQL, DCL, TCL)', 'Groß- & Kleinschreibung'],
    mdn: PG + 'sql-syntax-lexical.html'
  },
  {
    lang: 'sql', group: 'SQL-Grundlagen', name: 'Kommentare',
    desc: 'Zeilenkommentare mit --, Blockkommentare mit /* … */.',
    details: 'Alles von `--` bis zum Zeilenende ignoriert die Datenbank, ebenso alles zwischen `/*` und `*/`, auch über mehrere Zeilen. Beide Formen funktionieren in allen verbreiteten Systemen. Unterschiede gibt es bei verschachtelten Blockkommentaren und Sonderformen.',
    dialects: {
      std: {
        syntax: '-- Zeilenkommentar\n/* Blockkommentar */',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Kabel', 4.50);

/* Mehrzeiliger Kommentar:
   günstige Produkte anzeigen */
SELECT name, preis   -- Kommentar am Zeilenende
FROM produkte
WHERE preis < 10;
-- name  | preis
-- Kabel | 4.50
`)
      },
      pg: { note: 'Blockkommentare dürfen verschachtelt werden: `/* außen /* innen */ außen */`.' },
      mysql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Kabel', 4.50);

# Zeilenkommentar mit Raute (nur MySQL)
/* Blockkommentar */
SELECT name, preis   -- nach -- muss ein Leerzeichen stehen
FROM produkte
WHERE preis < 10;
-- name  | preis
-- Kabel | 4.50
`),
        note: 'Nach `--` muss ein Leerzeichen folgen (`--x` ist kein Kommentar); zusätzlich gibt es `#`. `/*! … */` ist kein Kommentar, sondern Code, den nur MySQL ausführt. Keine verschachtelten Blockkommentare.',
        mdn: MY + 'comments.html'
      },
      mssql: { note: 'Blockkommentare dürfen verschachtelt werden.', mdn: MS + 'language-elements/slash-star-comment-transact-sql' },
      sqlite: { note: 'Ein Blockkommentar darf am Dateiende offen bleiben; verschachteln geht nicht.', mdn: SL + 'lang_comment.html' }
    },
    tip: 'Zum schnellen Ausprobieren eine Bedingung mit `--` auskommentieren; dabei auf ein übrig bleibendes `AND` am Zeilenanfang achten.',
    keywords: ['comment', 'kommentar', 'auskommentieren', 'doppelstrich', 'blockkommentar', 'raute', '#'],
    related: ['Anweisungen & Semikolon', 'String-Literale'],
    mdn: PG + 'sql-syntax-lexical.html#SQL-SYNTAX-COMMENTS'
  },
  {
    lang: 'sql', group: 'SQL-Grundlagen', name: 'Groß- & Kleinschreibung',
    desc: 'Schlüsselwörter und ungequotete Bezeichner sind case-insensitive, Strings nicht überall.',
    details: '`SELECT`, `select` und `Select` sind gleichwertig; ebenso Spaltennamen ohne Anführungszeichen. Gequotete Bezeichner wie `"Name"` sind dagegen exakt. Ob String-Vergleiche Groß/Klein unterscheiden, hängt von der Collation (Sortierregel) ab und ist je System verschieden. Wer sicher gehen will, vergleicht mit `LOWER()` auf beiden Seiten.',
    dialects: {
      std: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller GmbH', 'Berlin'), (2, 'Schmidt AG', 'Hamburg'), (3, 'Weber KG', 'Berlin');

-- Schlüsselwörter und Bezeichner: Schreibweise egal
select Name from KUNDEN where Stadt = 'Berlin' order by NAME;
-- name
-- Müller GmbH
-- Weber KG

-- String-Inhalt: Groß/Klein zählt
SELECT COUNT(*) AS anzahl FROM kunden WHERE stadt = 'berlin';
-- anzahl
-- 0
SELECT COUNT(*) AS anzahl FROM kunden WHERE LOWER(stadt) = 'berlin';
-- anzahl
-- 2
`)
      },
      pg: { note: 'Ungequotete Bezeichner werden intern kleingeschrieben (`KUNDEN` → `kunden`); eine als `"Kunden"` angelegte Tabelle muss man immer gequotet ansprechen. Für Vergleiche ohne Groß/Klein gibt es `ILIKE` oder den Typ `citext`.' },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller GmbH', 'Berlin'), (2, 'Schmidt AG', 'Hamburg'), (3, 'Weber KG', 'Berlin');

-- Spalten und Schlüsselwörter: egal; Tabellennamen unter Linux nicht!
select Name from kunden where Stadt = 'Berlin' order by NAME;
-- name
-- Müller GmbH
-- Weber KG

-- Standard-Collation utf8mb4_0900_ai_ci: Groß/Klein egal
SELECT COUNT(*) AS anzahl FROM kunden WHERE stadt = 'berlin';
-- anzahl
-- 2
SELECT COUNT(*) AS anzahl FROM kunden WHERE stadt COLLATE utf8mb4_bin = 'berlin';
-- anzahl
-- 0
`),
        note: 'Tabellennamen entsprechen Dateinamen und sind deshalb unter Linux case-sensitive (`lower_case_table_names`), unter Windows nicht. String-Vergleiche ignorieren Groß/Klein mit der Standard-Collation.',
        mdn: MY + 'identifier-case-sensitivity.html'
      },
      mssql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50), stadt NVARCHAR(50));
INSERT INTO kunden VALUES (1, N'Müller GmbH', N'Berlin'), (2, N'Schmidt AG', N'Hamburg'), (3, N'Weber KG', N'Berlin');

select Name from KUNDEN where Stadt = 'Berlin' order by NAME;
-- name
-- Müller GmbH
-- Weber KG

-- Standard-Collation (…_CI_AS): Groß/Klein egal
SELECT COUNT(*) AS anzahl FROM kunden WHERE stadt = 'berlin';
-- anzahl
-- 2
SELECT COUNT(*) AS anzahl FROM kunden WHERE stadt COLLATE Latin1_General_CS_AS = 'berlin';
-- anzahl
-- 0
`),
        note: 'Die Collation der Datenbank gilt auch für Bezeichner: Bei der üblichen case-insensitiven Collation (`_CI_`) sind Tabellen- und Spaltennamen sowie String-Vergleiche unabhängig von Groß/Klein.'
      },
      sqlite: { note: 'Bezeichner sind case-insensitive und behalten ihre Schreibweise. `=` unterscheidet Groß/Klein (Collation `BINARY`), `COLLATE NOCASE` nicht – aber nur bei ASCII-Buchstaben.' }
    },
    tip: 'Konvention: Schlüsselwörter GROSS, Bezeichner klein in snake_case. So muss man nie quoten und der Code liest sich auf allen Systemen gleich.',
    keywords: ['case sensitive', 'groß', 'klein', 'großschreibung', 'kleinschreibung', 'case insensitive', 'collation', 'schreibweise', 'collate'],
    related: ['Bezeichner quoten', 'Collation', 'UPPER() / LOWER()', 'Namenskonventionen'],
    mdn: PG + 'sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS'
  },
  {
    lang: 'sql', group: 'SQL-Grundlagen', name: 'Bezeichner quoten',
    desc: 'Anführungszeichen erlauben Namen mit Leerzeichen, Großbuchstaben oder Schlüsselwörtern.',
    details: 'Standard-SQL quotet Bezeichner mit doppelten Anführungszeichen: `"order"`, `"Bestellung Details"`. Der Name ist dann case-sensitive und muss überall genau so geschrieben werden. Ein Anführungszeichen im Namen wird verdoppelt: `"sag ""hallo"""`. Einige Systeme nutzen statt doppelter Anführungszeichen andere Zeichen.',
    dialects: {
      std: {
        syntax: '"bezeichner"',
        example: e(`
CREATE TABLE "Bestellung Details" ("id" INTEGER PRIMARY KEY, "order" VARCHAR(10), "Menge" INTEGER);
INSERT INTO "Bestellung Details" VALUES (1, 'A-100', 3), (2, 'A-101', 5);

-- order ist ein Schlüsselwort, Menge großgeschrieben: beides quoten
SELECT "order", "Menge" FROM "Bestellung Details" ORDER BY "id";
-- order | Menge
-- A-100 | 3
-- A-101 | 5
`)
      },
      pg: { note: 'Ungequotet wird kleingeschrieben: `Menge` meint `menge`, nicht die Spalte `"Menge"`.' },
      mysql: {
        syntax: '`bezeichner`',
        example: e(`
CREATE TABLE \`Bestellung Details\` (id INT PRIMARY KEY, \`order\` VARCHAR(10), Menge INT);
INSERT INTO \`Bestellung Details\` VALUES (1, 'A-100', 3), (2, 'A-101', 5);

SELECT \`order\`, Menge FROM \`Bestellung Details\` ORDER BY id;
-- order | Menge
-- A-100 | 3
-- A-101 | 5
`),
        note: 'Standardmäßig Backticks; doppelte Anführungszeichen sind Strings, außer im SQL-Modus `ANSI_QUOTES`.',
        mdn: MY + 'identifiers.html'
      },
      mssql: {
        syntax: '[bezeichner]',
        example: e(`
CREATE TABLE [Bestellung Details] (id INT PRIMARY KEY, [order] VARCHAR(10), Menge INT);
INSERT INTO [Bestellung Details] VALUES (1, 'A-100', 3), (2, 'A-101', 5);

SELECT [order], Menge FROM [Bestellung Details] ORDER BY id;
-- order | Menge
-- A-100 | 3
-- A-101 | 5
`),
        note: 'Eckige Klammern; doppelte Anführungszeichen gehen nur mit `SET QUOTED_IDENTIFIER ON` (Standard in SSMS und den meisten Treibern).'
      },
      sqlite: { note: 'Versteht `"name"`, `` `name` `` und `[name]`. Ein String in doppelten Anführungszeichen, der keine Spalte trifft, wird aus Kompatibilitätsgründen als String gelesen.' }
    },
    tip: 'Einfache Anführungszeichen sind für Strings, doppelte für Namen. `WHERE name = "Ada"` sucht in PostgreSQL eine Spalte namens Ada.',
    keywords: ['quote', 'quoting', 'anführungszeichen', 'backtick', 'eckige klammern', 'reserviertes wort', 'identifier', 'escape', 'ansi_quotes', 'quoted_identifier'],
    related: ['Groß- & Kleinschreibung', 'String-Literale', 'Namenskonventionen'],
    mdn: PG + 'sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS'
  },
  {
    lang: 'sql', group: 'SQL-Grundlagen', name: 'String-Literale',
    desc: 'Zeichenketten stehen in einfachen Anführungszeichen; ein Apostroph wird verdoppelt.',
    details: '`\'Text\'` ist ein String, `\'O\'\'Brien\'` enthält einen Apostroph. Backslash-Escapes wie `\\n` gelten im Standard nicht. Werte aus Benutzereingaben nie selbst in String-Literale einbauen, sondern als Parameter übergeben.',
    dialects: {
      std: {
        syntax: "'text'\n'O''Brien'   -- Apostroph verdoppeln",
        example: e(`
SELECT 'O''Brien'              AS name,
       CHAR_LENGTH('Straße')   AS laenge,
       'Teil 1' || ' + 2'      AS verkettet;
-- name    | laenge | verkettet
-- O'Brien | 6      | Teil 1 + 2
`)
      },
      pg: {
        syntax: "'text'\n'O''Brien'\nE'Zeile1\\nZeile2'   -- mit Escapes\n$$Text mit 'Apostroph'$$",
        example: e(`
SELECT 'O''Brien'              AS name,
       LENGTH('Straße')        AS laenge,
       E'Rock \\'n\\' Roll'      AS mit_escape,
       $$It's $$ || 'easy'     AS dollar;
-- name    | laenge | mit_escape    | dollar
-- O'Brien | 6      | Rock 'n' Roll | It's easy
`),
        note: 'Escapes nur mit `E\'…\'`; Dollar-Quoting `$$…$$` erspart das Verdoppeln von Apostrophen (praktisch für Funktionskörper).'
      },
      mysql: {
        example: e(`
SELECT 'O''Brien'              AS name,
       CHAR_LENGTH('Straße')   AS laenge,
       CONCAT('Teil 1', ' + 2') AS verkettet;
-- name    | laenge | verkettet
-- O'Brien | 6      | Teil 1 + 2
`),
        note: 'Backslash-Escapes (`\'O\\\'Brien\'`, `\'\\n\'`) gelten standardmäßig, außer im Modus `NO_BACKSLASH_ESCAPES`; auch `"Text"` ist ein String. `LENGTH()` zählt Bytes, `CHAR_LENGTH()` Zeichen.',
        mdn: MY + 'string-literals.html'
      },
      mssql: {
        syntax: "'text'\nN'Ünicode'   -- NVARCHAR-Literal",
        example: e(`
SELECT 'O''Brien'              AS name,
       LEN(N'Straße')          AS laenge,
       N'Teil 1' + N' + 2'     AS verkettet;
-- name    | laenge | verkettet
-- O'Brien | 6      | Teil 1 + 2
`),
        note: 'Für Unicode-Text `N\'…\'` schreiben, sonst gehen Zeichen außerhalb der Codepage verloren. `LEN()` ignoriert Leerzeichen am Ende.',
        mdn: MS + 'data-types/constants-transact-sql'
      },
      sqlite: {
        example: e(`
SELECT 'O''Brien'              AS name,
       LENGTH('Straße')        AS laenge,
       'Teil 1' || ' + 2'      AS verkettet;
-- name    | laenge | verkettet
-- O'Brien | 6      | Teil 1 + 2
`),
        note: 'Keine Backslash-Escapes; Sonderzeichen über `char(10)` o. Ä. einfügen.'
      }
    },
    tip: 'Ein String, der aus Benutzereingaben zusammengesetzt wird, ist die klassische Einfallstür für SQL-Injection. Platzhalter verwenden.',
    keywords: ['string', 'text', 'zeichenkette', 'literal', 'apostroph', 'einfache anführungszeichen', 'escape', 'quote', 'dollar quoting', 'nvarchar'],
    related: ['Bezeichner quoten', '|| (Verkettung)', 'SQL-Injection', 'Parameter-Platzhalter'],
    mdn: PG + 'sql-syntax-lexical.html#SQL-SYNTAX-STRINGS'
  },
  {
    lang: 'sql', group: 'SQL-Grundlagen', name: 'Teilsprachen (DDL, DML, DQL, DCL, TCL)',
    desc: 'SQL-Befehle werden nach Zweck in Definition, Manipulation, Abfrage, Rechte und Transaktion geteilt.',
    details: 'DDL legt Strukturen an und ändert sie, DML ändert Daten, DQL liest sie, DCL vergibt Rechte und TCL steuert Transaktionen. Die Einteilung ist nicht ganz einheitlich: Oft zählt `SELECT` mit zur DML. Wichtig für die Praxis ist, ob sich DDL in einer Transaktion zurückrollen lässt; das ist je System verschieden.',
    values: [
      ['DDL', 'Data Definition: CREATE, ALTER, DROP, TRUNCATE'],
      ['DML', 'Data Manipulation: INSERT, UPDATE, DELETE, MERGE'],
      ['DQL', 'Data Query: SELECT'],
      ['DCL', 'Data Control: GRANT, REVOKE'],
      ['TCL', 'Transaction Control: START TRANSACTION, COMMIT, ROLLBACK, SAVEPOINT']
    ],
    dialects: {
      std: {
        example: e(`
-- DDL
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));

-- TCL + DML
START TRANSACTION;
INSERT INTO kunden VALUES (1, 'Müller GmbH', 'Berlin'), (2, 'Schmidt AG', 'Hamburg'), (3, 'Weber KG', 'Köln');
UPDATE kunden SET stadt = 'München' WHERE id = 2;
COMMIT;     -- dauerhaft speichern

START TRANSACTION;
DELETE FROM kunden WHERE id = 3;
ROLLBACK;   -- Löschen rückgängig

-- DQL
SELECT id, name, stadt FROM kunden ORDER BY id;
-- id | name        | stadt
-- 1  | Müller GmbH | Berlin
-- 2  | Schmidt AG  | München
-- 3  | Weber KG    | Köln

-- DCL: GRANT SELECT ON kunden TO leser;
`)
      },
      pg: { note: '`BEGIN` ist die übliche Kurzform von `START TRANSACTION`. DDL ist transaktional: Ein `CREATE TABLE` lässt sich mit `ROLLBACK` zurücknehmen.' },
      mysql: { note: 'Jede DDL-Anweisung (`CREATE`, `ALTER`, `DROP`) beendet die laufende Transaktion mit einem impliziten `COMMIT` und lässt sich nicht zurückrollen. `BEGIN` geht ebenfalls.', mdn: MY + 'implicit-commit.html' },
      mssql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50), stadt NVARCHAR(50));

BEGIN TRANSACTION;
INSERT INTO kunden VALUES (1, N'Müller GmbH', N'Berlin'), (2, N'Schmidt AG', N'Hamburg'), (3, N'Weber KG', N'Köln');
UPDATE kunden SET stadt = N'München' WHERE id = 2;
COMMIT;

BEGIN TRANSACTION;
DELETE FROM kunden WHERE id = 3;
ROLLBACK;

SELECT id, name, stadt FROM kunden ORDER BY id;
-- id | name        | stadt
-- 1  | Müller GmbH | Berlin
-- 2  | Schmidt AG  | München
-- 3  | Weber KG    | Köln

-- DCL: GRANT SELECT ON kunden TO leser;
`),
        note: 'Transaktionen beginnen mit `BEGIN TRANSACTION` (kurz `BEGIN TRAN`); `START TRANSACTION` gibt es nicht. DDL ist transaktional.',
        mdn: MS + 'language-elements/begin-transaction-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT);

BEGIN;
INSERT INTO kunden VALUES (1, 'Müller GmbH', 'Berlin'), (2, 'Schmidt AG', 'Hamburg'), (3, 'Weber KG', 'Köln');
UPDATE kunden SET stadt = 'München' WHERE id = 2;
COMMIT;

BEGIN;
DELETE FROM kunden WHERE id = 3;
ROLLBACK;

SELECT id, name, stadt FROM kunden ORDER BY id;
-- id | name        | stadt
-- 1  | Müller GmbH | Berlin
-- 2  | Schmidt AG  | München
-- 3  | Weber KG    | Köln
`),
        note: 'Transaktionen mit `BEGIN` (nicht `START TRANSACTION`); DDL ist transaktional. Keine DCL: Rechte regelt das Dateisystem.',
        mdn: SL + 'lang_transaction.html'
      }
    },
    tip: 'Deployment-Skripte für Systeme ohne transaktionale DDL (z. B. MySQL) so aufteilen, dass ein Fehler mittendrin keinen halb umgebauten Zustand hinterlässt.',
    keywords: ['ddl', 'dml', 'dql', 'dcl', 'tcl', 'teilsprache', 'sublanguage', 'kategorien', 'befehlsarten', 'implicit commit'],
    related: ['CREATE TABLE', 'INSERT INTO', 'GRANT', 'BEGIN / COMMIT'],
    mdn: PG + 'sql-commands.html'
  },
  {
    lang: 'sql', group: 'SQL-Grundlagen', name: 'Logische Abfragereihenfolge',
    desc: 'Eine Abfrage wird logisch in der Reihenfolge FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY verarbeitet.',
    details: 'Geschrieben wird `SELECT` zuerst, ausgewertet aber erst nach `FROM`, `WHERE`, `GROUP BY` und `HAVING`. Deshalb kennt `WHERE` keine Spaltenaliase aus dem `SELECT` und keine Aggregate, `ORDER BY` dagegen schon. Fensterfunktionen werden nach `HAVING` berechnet und sind daher in `WHERE` nicht erlaubt. Manche Systeme erlauben Aliase auch früher; das ist nicht portabel.',
    dialects: {
      std: {
        syntax: '1 FROM / JOIN\n2 WHERE\n3 GROUP BY\n4 HAVING\n5 SELECT (inkl. Fensterfunktionen)\n6 DISTINCT\n7 ORDER BY\n8 OFFSET / FETCH FIRST',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'Vertrieb', 3900), (3, 'Cem', 'IT', 4800),
  (4, 'Dana', 'Marketing', 4100), (5, 'Eva', 'Vertrieb', 3600);

SELECT abteilung, AVG(gehalt) AS schnitt   -- 5. Spalten berechnen
FROM mitarbeiter                           -- 1. Quelle
WHERE gehalt > 3000                        -- 2. Zeilen filtern
GROUP BY abteilung                         -- 3. gruppieren
HAVING COUNT(*) >= 2                       -- 4. Gruppen filtern
ORDER BY schnitt DESC;                     -- 6. Alias hier bekannt
-- abteilung | schnitt
-- IT        | 5000
-- Vertrieb  | 3750

-- WHERE schnitt > 4000  → Fehler: column "schnitt" does not exist
`)
      },
      pg: { note: 'Aliase sind nur in `ORDER BY` erlaubt; in `GROUP BY` darf zusätzlich ein Alias oder eine Spaltennummer stehen.' },
      mysql: { note: 'MySQL erlaubt Aliase auch in `GROUP BY` und `HAVING`, nicht aber in `WHERE`. Die Paginierung kommt mit `LIMIT` am Ende.' },
      mssql: { note: 'Aliase gelten nur in `ORDER BY`. `TOP` wird logisch zusammen mit `ORDER BY` ausgewertet. `AVG()` über eine `INT`-Spalte liefert hier eine Ganzzahl (`AVG(gehalt * 1.0)` für Nachkommastellen).' },
      sqlite: { note: 'SQLite erlaubt Aliase sogar in `WHERE` und `GROUP BY`; das ist bequem, aber nicht portabel.' }
    },
    tip: 'Braucht man einen berechneten Wert im `WHERE`, die Abfrage in eine CTE oder Unterabfrage packen und außen filtern.',
    keywords: ['reihenfolge', 'auswertungsreihenfolge', 'logical order', 'order of execution', 'ausführungsreihenfolge', 'alias where'],
    related: ['WHERE', 'GROUP BY', 'HAVING', 'WITH (CTE)'],
    mdn: PG + 'sql-select.html'
  },

  // ---------------- SELECT-Abfragen ----------------
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'SELECT',
    desc: 'Liest Daten und liefert sie als Ergebnistabelle zurück.',
    details: '`SELECT` ist die zentrale Abfrage-Anweisung: Hinter `SELECT` stehen die gewünschten Spalten oder Ausdrücke, hinter `FROM` die Quelle. Weitere Klauseln filtern (`WHERE`), gruppieren (`GROUP BY`), sortieren (`ORDER BY`) und begrenzen die Zeilenzahl. Die Reihenfolge der Klauseln ist fest vorgegeben. Ohne `ORDER BY` ist die Reihenfolge der Ergebniszeilen nicht definiert.',
    dialects: {
      std: {
        syntax: 'SELECT [DISTINCT] ausdruck [AS alias], …\nFROM tabelle\n[WHERE bedingung]\n[GROUP BY …] [HAVING …]\n[ORDER BY …]\n[OFFSET m ROWS] [FETCH FIRST n ROWS ONLY];',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'Vertrieb', 3900), (3, 'Cem', 'IT', 4800), (4, 'Dana', 'Marketing', 4100);

SELECT name, abteilung, gehalt
FROM mitarbeiter
WHERE gehalt >= 4000
ORDER BY gehalt DESC;
-- name | abteilung | gehalt
-- Ada  | IT        | 5200
-- Cem  | IT        | 4800
-- Dana | Marketing | 4100
`)
      },
      pg: { note: 'Zeilen begrenzt man meist mit `LIMIT n OFFSET m`; `FETCH FIRST` geht ebenso.', mdn: PG + 'sql-select.html' },
      mysql: { note: 'Zeilen begrenzt man mit `LIMIT n [OFFSET m]` am Ende; `FETCH FIRST` gibt es nicht.', mdn: MY + 'select.html' },
      mssql: { note: 'Zeilen begrenzt man mit `SELECT TOP n …` oder `ORDER BY … OFFSET m ROWS FETCH NEXT n ROWS ONLY`.', mdn: MS + 'queries/select-transact-sql' },
      sqlite: { note: 'Zeilen begrenzt man mit `LIMIT n [OFFSET m]`; `FETCH FIRST` gibt es nicht.', mdn: SL + 'lang_select.html' }
    },
    tip: 'Nur die Spalten holen, die man wirklich braucht. Das spart Netzwerk und erlaubt dem Optimierer, reine Index-Zugriffe zu nutzen.',
    keywords: ['select', 'abfrage', 'query', 'lesen', 'auswählen', 'daten abfragen'],
    related: ['FROM', 'WHERE', 'ORDER BY', 'Logische Abfragereihenfolge'],
    mdn: PG + 'sql-select.html'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'FROM',
    desc: 'Gibt die Tabellen, Views oder Unterabfragen an, aus denen gelesen wird.',
    details: 'Hinter `FROM` steht eine Tabelle, eine View, eine Unterabfrage (abgeleitete Tabelle) oder eine Verknüpfung mehrerer Quellen per `JOIN`. Mehrere Tabellen mit Komma ergeben das kartesische Produkt; das ist der alte Join-Stil, bei dem die Bedingung im `WHERE` steht. Eine Unterabfrage im `FROM` sollte immer einen Alias bekommen; manche Systeme verlangen ihn.',
    dialects: {
      std: {
        syntax: 'FROM tabelle [AS] alias\nFROM tabelle1 JOIN tabelle2 ON bedingung\nFROM (SELECT …) AS alias',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2), kategorie VARCHAR(50));
INSERT INTO produkte VALUES
  (1, 'Maus', 19.99, 'Zubehör'), (2, 'Monitor', 189.00, 'Hardware'), (3, 'Kabel', 4.50, 'Zubehör');

-- Einfache Tabelle
SELECT name FROM produkte ORDER BY name;
-- name
-- Kabel
-- Maus
-- Monitor

-- Unterabfrage als Quelle (mit Alias)
SELECT t.kategorie, t.anzahl
FROM (SELECT kategorie, COUNT(*) AS anzahl FROM produkte GROUP BY kategorie) AS t
ORDER BY t.kategorie;
-- kategorie | anzahl
-- Hardware  | 1
-- Zubehör   | 2
`)
      },
      pg: { note: 'Seit PostgreSQL 16 darf der Alias einer Unterabfrage im `FROM` fehlen, davor war er Pflicht.' },
      mysql: { note: 'Der Alias der Unterabfrage ist Pflicht (Fehler „Every derived table must have its own alias“).' },
      mssql: { note: 'Der Alias der Unterabfrage ist Pflicht. Zusätzlich gibt es `CROSS APPLY` / `OUTER APPLY` für Unterabfragen, die sich auf Spalten links davon beziehen.' },
      sqlite: { note: 'Der Alias der Unterabfrage ist optional.' }
    },
    tip: 'Statt Komma-Joins (`FROM a, b WHERE a.id = b.a_id`) explizite `JOIN … ON` schreiben; eine vergessene Bedingung erzeugt sonst unbemerkt ein Kreuzprodukt.',
    keywords: ['from', 'quelle', 'tabelle', 'datenquelle', 'source', 'unterabfrage im from', 'derived table'],
    related: ['SELECT', 'Tabellenalias', 'Abgeleitete Tabelle', 'Joins im Überblick'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'SELECT *',
    desc: 'Wählt alle Spalten der Quelle in Tabellenreihenfolge aus.',
    details: '`*` steht für alle Spalten aller Tabellen im `FROM`, `tabelle.*` für alle Spalten einer bestimmten Tabelle. Praktisch zum Erkunden, in Anwendungscode aber riskant: Neue Spalten ändern das Ergebnis, bei Joins entstehen doppelte Spaltennamen, und es werden mehr Daten übertragen als nötig. In `COUNT(*)` und `EXISTS (SELECT * …)` ist der Stern unproblematisch.',
    dialects: {
      std: {
        syntax: 'SELECT * FROM tabelle;\nSELECT t.*, andere.spalte FROM t JOIN andere …;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller GmbH', 'Berlin'), (2, 'Schmidt AG', 'Hamburg');

SELECT * FROM kunden ORDER BY id;
-- id | name        | stadt
-- 1  | Müller GmbH | Berlin
-- 2  | Schmidt AG  | Hamburg
`)
      }
    },
    tip: 'Zum schnellen Reinschauen nur die ersten Zeilen holen (`FETCH FIRST 10 ROWS ONLY`, `LIMIT 10` bzw. `TOP 10`) statt die ganze Tabelle zu laden.',
    keywords: ['stern', 'asterisk', 'alle spalten', 'star', 'wildcard'],
    related: ['SELECT', 'SELECT * vermeiden', 'LIMIT / OFFSET'],
    mdn: PG + 'queries-select-lists.html'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'AS (Alias)',
    desc: 'Gibt einer Ergebnisspalte einen eigenen Namen.',
    details: 'Mit `ausdruck AS name` benennt man Spalten um, vor allem berechnete Ausdrücke, die sonst einen generierten Namen bekommen. `AS` ist bei Spaltenaliasen optional, macht den Code aber lesbarer. Aliase mit Leerzeichen oder Großbuchstaben müssen gequotet werden. Der Alias ist in `ORDER BY` verwendbar, aber nicht in `WHERE` desselben Abfrageblocks.',
    dialects: {
      std: {
        syntax: 'SELECT ausdruck AS alias\nSELECT ausdruck alias\nSELECT ausdruck AS "Alias mit Leerzeichen"',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 5200), (2, 'Ben', 3900), (3, 'Cem', 4800);

SELECT name AS mitarbeiter,
       gehalt * 12 AS "Jahresgehalt in €"
FROM mitarbeiter
ORDER BY "Jahresgehalt in €" DESC;
-- mitarbeiter | Jahresgehalt in €
-- Ada         | 62400
-- Cem         | 57600
-- Ben         | 46800
`)
      },
      pg: { note: 'Ohne Alias heißt eine berechnete Spalte `?column?`.' },
      mysql: {
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 5200), (2, 'Ben', 3900), (3, 'Cem', 4800);

SELECT name AS mitarbeiter,
       gehalt * 12 AS \`Jahresgehalt in €\`
FROM mitarbeiter
ORDER BY \`Jahresgehalt in €\` DESC;
-- mitarbeiter | Jahresgehalt in €
-- Ada         | 62400
-- Cem         | 57600
-- Ben         | 46800
`),
        note: 'Aliase mit Sonderzeichen in Backticks. `AS "…"` geht zwar auch, aber `ORDER BY "…"` sortiert dann nach einem konstanten String, also gar nicht.'
      },
      mssql: {
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES (1, N'Ada', 5200), (2, N'Ben', 3900), (3, N'Cem', 4800);

SELECT name AS mitarbeiter,
       gehalt * 12 AS [Jahresgehalt in €]
FROM mitarbeiter
ORDER BY [Jahresgehalt in €] DESC;
-- mitarbeiter | Jahresgehalt in €
-- Ada         | 62400
-- Cem         | 57600
-- Ben         | 46800
`),
        note: 'Aliase mit Sonderzeichen in eckigen Klammern. Ohne Alias bleibt die Spalte namenlos. Die alte Form `alias = ausdruck` ist ebenfalls erlaubt.'
      },
      sqlite: { note: 'Ohne Alias heißt die Spalte wie der Ausdruck selbst (`gehalt * 12`).' }
    },
    tip: 'Berechnete Spalten immer benennen; ohne Alias heißen sie je nach System `?column?`, `gehalt * 12` oder haben gar keinen Namen.',
    keywords: ['alias', 'umbenennen', 'spaltenname', 'as', 'column alias', 'rename'],
    related: ['Tabellenalias', 'Berechnete Spalten', 'Logische Abfragereihenfolge'],
    mdn: PG + 'queries-select-lists.html#QUERIES-COLUMN-LABELS'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'Tabellenalias',
    desc: 'Kurzname für eine Tabelle im FROM, um Spalten eindeutig und knapp anzusprechen.',
    details: 'Hinter dem Tabellennamen steht der Alias, wahlweise mit `AS` (Oracle erlaubt `AS` hier nicht, daher wird es oft weggelassen). Ab dann muss die Tabelle in dieser Abfrage über den Alias angesprochen werden. Bei Joins sind Aliase fast Pflicht, weil gleich benannte Spalten (`id`, `name`) sonst mehrdeutig sind; beim Self Join braucht man sie zwingend.',
    dialects: {
      std: {
        syntax: 'FROM tabelle [AS] alias',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER REFERENCES kunden(id), betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Müller GmbH'), (2, 'Schmidt AG');
INSERT INTO bestellungen VALUES (10, 1, 250.00), (11, 2, 80.00), (12, 1, 120.00);

SELECT k.name, b.id AS bestellung, b.betrag
FROM kunden k
JOIN bestellungen b ON b.kunde_id = k.id
ORDER BY b.id;
-- name        | bestellung | betrag
-- Müller GmbH | 10         | 250.00
-- Schmidt AG  | 11         | 80.00
-- Müller GmbH | 12         | 120.00
`)
      }
    },
    tip: 'Sprechende Kürzel wählen (`k` für kunden, `b` für bestellungen) statt `a`, `b`, `c`; das hilft beim Lesen langer Joins.',
    keywords: ['alias', 'tabellenalias', 'table alias', 'kurzname', 'correlation name', 'qualifizieren'],
    related: ['AS (Alias)', 'INNER JOIN', 'Self Join'],
    mdn: PG + 'queries-table-expressions.html#QUERIES-TABLE-ALIASES'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'DISTINCT',
    desc: 'Entfernt doppelte Zeilen aus dem Ergebnis.',
    details: '`SELECT DISTINCT` behält von identischen Ergebniszeilen nur eine; verglichen wird über alle ausgewählten Spalten zusammen, nicht über die erste. NULL-Werte gelten dabei als gleich. Intern wird sortiert oder gehasht, was bei großen Mengen teuer ist.',
    dialects: {
      std: {
        syntax: 'SELECT DISTINCT spalte1, spalte2 FROM tabelle;',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), standort VARCHAR(50));
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 'Berlin'), (2, 'Ben', 'Vertrieb', 'Hamburg'),
  (3, 'Cem', 'IT', 'Berlin'), (4, 'Dana', 'IT', 'Hamburg');

SELECT DISTINCT abteilung FROM mitarbeiter ORDER BY abteilung;
-- abteilung
-- IT
-- Vertrieb

-- Eindeutig über die Kombination beider Spalten
SELECT DISTINCT abteilung, standort FROM mitarbeiter ORDER BY abteilung, standort;
-- abteilung | standort
-- IT        | Berlin
-- IT        | Hamburg
-- Vertrieb  | Hamburg
`)
      },
      pg: { note: 'Zusätzlich `DISTINCT ON (spalte)`: liefert je Wert die erste Zeile laut `ORDER BY`.' },
      mysql: { note: 'Mit der Standard-Collation gelten `\'IT\'` und `\'it\'` als gleich und werden zusammengefasst.' },
      mssql: { note: 'Mit der Standard-Collation gelten `\'IT\'` und `\'it\'` als gleich. Bei `DISTINCT` müssen alle `ORDER BY`-Spalten in der Auswahlliste stehen.' }
    },
    tip: 'Ein `DISTINCT`, das nur Duplikate aus einem fehlerhaften Join kaschiert, ist ein Warnsignal. Besser die Join-Bedingung prüfen oder `EXISTS` verwenden.',
    keywords: ['distinct', 'eindeutig', 'duplikate entfernen', 'unique', 'doppelte', 'unterschiedliche werte'],
    related: ['COUNT(DISTINCT)', 'GROUP BY', 'UNION', 'EXISTS'],
    mdn: PG + 'queries-select-lists.html#QUERIES-DISTINCT'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'WHERE',
    desc: 'Filtert Zeilen nach einer Bedingung, bevor gruppiert und ausgewählt wird.',
    details: 'Nur Zeilen, für die die Bedingung `TRUE` ergibt, kommen ins Ergebnis; `FALSE` und `NULL` (unbekannt) fallen heraus. Bedingungen werden mit `AND`, `OR` und `NOT` kombiniert. Aggregatfunktionen sind im `WHERE` nicht erlaubt, dafür gibt es `HAVING`. `WHERE` wirkt genauso in `UPDATE` und `DELETE`; dort ein vergessenes `WHERE` trifft alle Zeilen.',
    dialects: {
      std: {
        syntax: 'SELECT … FROM tabelle WHERE bedingung;',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'Vertrieb', 3900),
  (3, 'Cem', 'IT', 4800), (4, 'Dana', 'Marketing', NULL);

SELECT name, gehalt
FROM mitarbeiter
WHERE abteilung = 'IT' AND gehalt > 5000;
-- name | gehalt
-- Ada  | 5200

-- NULL erfüllt keinen Vergleich: Dana fehlt
SELECT name FROM mitarbeiter WHERE gehalt < 5000 ORDER BY name;
-- name
-- Ben
-- Cem
`)
      },
      mysql: { note: 'String-Vergleiche im `WHERE` ignorieren mit der Standard-Collation Groß/Klein: `WHERE abteilung = \'it\'` findet auch `IT`.' },
      mssql: { note: 'String-Vergleiche ignorieren mit der Standard-Collation Groß/Klein. Eine Spalte vom Typ `BIT` braucht einen expliziten Vergleich (`WHERE aktiv = 1`).' },
      sqlite: { note: 'Ein Ausdruck ist wahr, wenn er eine Zahl ungleich 0 ergibt; `WHERE gehalt` filtert also Nullen und NULL heraus.' }
    },
    tip: 'Spalten im `WHERE` nicht in Funktionen einpacken (`WHERE EXTRACT(YEAR FROM datum) = 2026`), sonst kann kein normaler Index genutzt werden; besser einen Bereich vergleichen.',
    keywords: ['where', 'filter', 'bedingung', 'filtern', 'condition', 'zeilen auswählen', 'predicate'],
    related: ['Vergleichsoperatoren', 'AND / OR / NOT', 'HAVING', 'Sargierbare Bedingungen'],
    mdn: PG + 'queries-table-expressions.html#QUERIES-WHERE'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'ORDER BY',
    desc: 'Sortiert das Ergebnis nach einer oder mehreren Spalten, aufsteigend oder absteigend.',
    details: 'Standard ist `ASC` (aufsteigend), `DESC` sortiert absteigend; die Richtung gilt jeweils nur für die Spalte davor. Bei mehreren Sortierschlüsseln entscheidet der nächste nur bei Gleichstand. Erlaubt sind Spalten, Aliase, Ausdrücke und Spaltenpositionen (`ORDER BY 2`). Ohne `ORDER BY` garantiert keine Datenbank eine Reihenfolge, auch wenn sie zufällig stabil wirkt.',
    dialects: {
      std: {
        syntax: 'ORDER BY ausdruck [ASC | DESC] [NULLS FIRST | NULLS LAST], …',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'Vertrieb', 3900),
  (3, 'Cem', 'IT', 4800), (4, 'Dana', 'Vertrieb', 4100);

-- Abteilung aufsteigend, darin Gehalt absteigend
SELECT abteilung, name, gehalt
FROM mitarbeiter
ORDER BY abteilung, gehalt DESC;
-- abteilung | name | gehalt
-- IT        | Ada  | 5200
-- IT        | Cem  | 4800
-- Vertrieb  | Dana | 4100
-- Vertrieb  | Ben  | 3900
`)
      },
      pg: { note: 'NULL gilt als größter Wert (bei `ASC` hinten); `NULLS FIRST/LAST` ändert das. Textsortierung folgt der Collation der Datenbank.' },
      mysql: { note: 'Kein `NULLS FIRST/LAST`; NULL gilt als kleinster Wert (bei `ASC` vorne).', mdn: MY + 'sorting-rows.html' },
      mssql: { note: 'Kein `NULLS FIRST/LAST`; NULL gilt als kleinster Wert. In Views und Unterabfragen ist `ORDER BY` nur zusammen mit `TOP` oder `OFFSET` erlaubt.', mdn: MS + 'queries/select-order-by-clause-transact-sql' },
      sqlite: { note: 'NULL gilt als kleinster Wert; `NULLS FIRST/LAST` gibt es seit 3.30.' }
    },
    tip: 'Für Paginierung immer einen eindeutigen Schlüssel als letzte Sortierspalte anhängen (`ORDER BY gehalt DESC, id`), sonst springen Zeilen mit gleichem Wert zwischen den Seiten.',
    keywords: ['sortieren', 'sort', 'order', 'asc', 'desc', 'aufsteigend', 'absteigend', 'reihenfolge'],
    related: ['NULLS FIRST / NULLS LAST', 'LIMIT / OFFSET', 'Collation'],
    mdn: PG + 'queries-order.html'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'NULLS FIRST / NULLS LAST',
    desc: 'Legt fest, ob NULL-Werte beim Sortieren vorne oder hinten stehen.',
    details: 'Ohne Angabe ist die Position von NULL systemabhängig: Manche Systeme behandeln NULL als größten Wert, andere als kleinsten. `NULLS FIRST` und `NULLS LAST` machen das explizit. Wo es sie nicht gibt, hilft ein zusätzlicher Sortierschlüssel, der zuerst nach „ist NULL“ sortiert.',
    dialects: {
      std: {
        syntax: 'ORDER BY spalte [ASC | DESC] NULLS FIRST\nORDER BY spalte [ASC | DESC] NULLS LAST',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 5200), (2, 'Ben', NULL), (3, 'Cem', 4800);

SELECT name, gehalt FROM mitarbeiter ORDER BY gehalt DESC NULLS LAST;
-- name | gehalt
-- Ada  | 5200
-- Cem  | 4800
-- Ben  | NULL

SELECT name, gehalt FROM mitarbeiter ORDER BY gehalt NULLS FIRST;
-- name | gehalt
-- Ben  | NULL
-- Cem  | 4800
-- Ada  | 5200
`)
      },
      pg: { note: 'Ohne Angabe gilt NULL als größter Wert: bei `ASC` hinten, bei `DESC` vorne.' },
      mysql: {
        syntax: 'ORDER BY spalte IS NULL, spalte …       -- NULL ans Ende\nORDER BY spalte IS NOT NULL, spalte …   -- NULL nach vorn',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 5200), (2, 'Ben', NULL), (3, 'Cem', 4800);

-- IS NULL ergibt 0 oder 1: Zeilen mit 1 (NULL) kommen ans Ende
SELECT name, gehalt FROM mitarbeiter ORDER BY gehalt IS NULL, gehalt DESC;
-- name | gehalt
-- Ada  | 5200
-- Cem  | 4800
-- Ben  | NULL

SELECT name, gehalt FROM mitarbeiter ORDER BY gehalt IS NOT NULL, gehalt;
-- name | gehalt
-- Ben  | NULL
-- Cem  | 4800
-- Ada  | 5200
`),
        note: 'Kein `NULLS FIRST/LAST`. Ohne Angabe gilt NULL als kleinster Wert: bei `ASC` vorne, bei `DESC` hinten.'
      },
      mssql: {
        syntax: 'ORDER BY CASE WHEN spalte IS NULL THEN 1 ELSE 0 END, spalte …',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES (1, N'Ada', 5200), (2, N'Ben', NULL), (3, N'Cem', 4800);

SELECT name, gehalt FROM mitarbeiter
ORDER BY CASE WHEN gehalt IS NULL THEN 1 ELSE 0 END, gehalt DESC;
-- name | gehalt
-- Ada  | 5200
-- Cem  | 4800
-- Ben  | NULL

SELECT name, gehalt FROM mitarbeiter
ORDER BY CASE WHEN gehalt IS NULL THEN 0 ELSE 1 END, gehalt;
-- name | gehalt
-- Ben  | NULL
-- Cem  | 4800
-- Ada  | 5200
`),
        note: 'Kein `NULLS FIRST/LAST`. Ohne Angabe gilt NULL als kleinster Wert: bei `ASC` vorne, bei `DESC` hinten.'
      },
      sqlite: { note: 'Seit 3.30. Ohne Angabe gilt NULL als kleinster Wert: bei `ASC` vorne, bei `DESC` hinten.' }
    },
    tip: 'In Ranglisten mit `DESC` immer festlegen, wo NULL landen soll; sonst steht je nach System ein Eintrag ohne Wert ganz oben.',
    keywords: ['null sortieren', 'nulls first', 'nulls last', 'sortierung null', 'leere werte', 'reihenfolge null'],
    related: ['ORDER BY', 'NULL sortieren', 'NULL'],
    mdn: PG + 'queries-order.html'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'LIMIT / OFFSET',
    desc: 'Begrenzt die Anzahl der Ergebniszeilen und überspringt optional die ersten.',
    details: '`LIMIT n` liefert höchstens n Zeilen, `OFFSET m` überspringt vorher m Zeilen. `LIMIT` ist kein Standard-SQL, aber weit verbreitet; die Standardform ist `OFFSET … FETCH`. Ohne `ORDER BY` ist nicht festgelegt, welche Zeilen man bekommt. Große Offsets sind langsam, weil alle übersprungenen Zeilen trotzdem gelesen werden.',
    dialects: {
      std: {
        syntax: 'SELECT … ORDER BY … OFFSET start ROWS FETCH FIRST anzahl ROWS ONLY;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES
  (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50), (5, 'Headset', 59.00);

-- Seite 2 bei 2 Einträgen pro Seite
SELECT name, preis FROM produkte ORDER BY preis DESC
OFFSET 2 ROWS FETCH FIRST 2 ROWS ONLY;
-- name     | preis
-- Tastatur | 49.90
-- Maus     | 19.99
`),
        note: 'Im Standard heißt es nicht `LIMIT`, sondern `OFFSET … ROWS FETCH FIRST … ROWS ONLY`.'
      },
      pg: {
        syntax: 'SELECT … ORDER BY … LIMIT anzahl [OFFSET start];',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, preis NUMERIC(10,2));
INSERT INTO produkte VALUES
  (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50), (5, 'Headset', 59.00);

SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 2 OFFSET 2;
-- name     | preis
-- Tastatur | 49.90
-- Maus     | 19.99
`),
        note: 'Versteht `LIMIT … OFFSET …` und die Standardform. `LIMIT ALL` bedeutet „ohne Begrenzung“.',
        mdn: PG + 'queries-limit.html'
      },
      mysql: {
        syntax: 'SELECT … ORDER BY … LIMIT anzahl [OFFSET start];\nSELECT … LIMIT start, anzahl;   -- Kurzform',
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES
  (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50), (5, 'Headset', 59.00);

SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 2 OFFSET 2;
-- name     | preis
-- Tastatur | 49.90
-- Maus     | 19.99

-- Kurzform: erst Offset, dann Anzahl
SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 2, 2;
-- name     | preis
-- Tastatur | 49.90
-- Maus     | 19.99
`),
        note: 'In der Kurzform `LIMIT 20, 10` steht der Offset zuerst – leicht zu verwechseln. Kein `FETCH FIRST`.',
        mdn: MY + 'select.html'
      },
      mssql: {
        syntax: 'SELECT TOP (anzahl) … ORDER BY …;\nSELECT … ORDER BY … OFFSET start ROWS FETCH NEXT anzahl ROWS ONLY;',
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES
  (1, N'Maus', 19.99), (2, N'Tastatur', 49.90), (3, N'Monitor', 189.00), (4, N'Kabel', 4.50), (5, N'Headset', 59.00);

-- Seite 2: OFFSET/FETCH braucht ORDER BY
SELECT name, preis FROM produkte ORDER BY preis DESC
OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY;
-- name     | preis
-- Tastatur | 49.90
-- Maus     | 19.99

-- Nur die ersten n Zeilen
SELECT TOP 2 name, preis FROM produkte ORDER BY preis DESC;
-- name    | preis
-- Monitor | 189.00
-- Headset | 59.00
`),
        note: 'Kein `LIMIT`. `TOP n` begrenzt ohne Offset; Seiten blättert man mit `OFFSET … FETCH`, das nur nach `ORDER BY` erlaubt ist.',
        mdn: MS + 'queries/top-transact-sql'
      },
      sqlite: {
        syntax: 'SELECT … ORDER BY … LIMIT anzahl [OFFSET start];',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, preis NUMERIC);
INSERT INTO produkte VALUES
  (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50), (5, 'Headset', 59.00);

SELECT name, preis FROM produkte ORDER BY preis DESC LIMIT 2 OFFSET 2;
-- name     | preis
-- Tastatur | 49.9
-- Maus     | 19.99
`),
        note: 'Versteht auch die Kurzform `LIMIT start, anzahl`. `LIMIT -1` bedeutet „ohne Begrenzung“. Kein `FETCH FIRST`.',
        mdn: SL + 'lang_select.html#limitoffset'
      }
    },
    tip: 'Für tiefe Seiten oder Endlos-Scrollen ist Keyset-Paginierung deutlich schneller als ein großer `OFFSET`.',
    keywords: ['limit', 'offset', 'top', 'begrenzen', 'paginierung', 'pagination', 'seite', 'erste n zeilen', 'fetch next'],
    related: ['FETCH FIRST', 'Paginierung (Keyset)', 'ORDER BY', 'Top-N pro Gruppe'],
    mdn: PG + 'queries-limit.html'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'FETCH FIRST',
    desc: 'Standard-SQL-Syntax zum Begrenzen der Ergebniszeilen, Alternative zu LIMIT.',
    details: '`FETCH FIRST n ROWS ONLY` ist die ISO-Form von `LIMIT`; `FIRST` und `NEXT` sowie `ROW` und `ROWS` sind austauschbar. Kombiniert mit `OFFSET m ROWS` ergibt sich Paginierung. `WITH TIES` liefert zusätzlich alle Zeilen, die beim Sortierwert mit der letzten gleichauf liegen. Auch Oracle (ab 12c) und Db2 verstehen diese Form.',
    dialects: {
      std: {
        syntax: '[OFFSET m ROWS] FETCH { FIRST | NEXT } n { ROW | ROWS } { ONLY | WITH TIES }',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 5200), (2, 'Ben', 4800), (3, 'Cem', 4800), (4, 'Dana', 4100);

SELECT name, gehalt FROM mitarbeiter
ORDER BY gehalt DESC, name
FETCH FIRST 2 ROWS ONLY;
-- name | gehalt
-- Ada  | 5200
-- Ben  | 4800

-- Gleichplatzierte mitnehmen: Cem hat dasselbe Gehalt wie Ben
SELECT name, gehalt FROM mitarbeiter
ORDER BY gehalt DESC
FETCH FIRST 2 ROWS WITH TIES;
-- name | gehalt
-- Ada  | 5200
-- Ben  | 4800
-- Cem  | 4800
`)
      },
      pg: { note: 'Seit PostgreSQL 13 auch mit `WITH TIES`. Die übliche Kurzform ist `LIMIT`.' },
      mysql: { none: 'Kein `FETCH FIRST`; stattdessen `LIMIT n`. Für „mit Gleichplatzierten“ die Zeilen per `RANK() OVER (ORDER BY …)` nummerieren und außen `WHERE rang <= n` filtern.' },
      mssql: {
        syntax: 'ORDER BY … OFFSET m ROWS FETCH NEXT n ROWS ONLY\nSELECT TOP (n) WITH TIES … ORDER BY …',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES (1, N'Ada', 5200), (2, N'Ben', 4800), (3, N'Cem', 4800), (4, N'Dana', 4100);

-- FETCH nur zusammen mit OFFSET
SELECT name, gehalt FROM mitarbeiter
ORDER BY gehalt DESC, name
OFFSET 0 ROWS FETCH NEXT 2 ROWS ONLY;
-- name | gehalt
-- Ada  | 5200
-- Ben  | 4800

-- WITH TIES gibt es nur bei TOP
SELECT TOP 2 WITH TIES name, gehalt FROM mitarbeiter
ORDER BY gehalt DESC;
-- name | gehalt
-- Ada  | 5200
-- Ben  | 4800
-- Cem  | 4800
`),
        note: '`FETCH` ist nur nach `OFFSET … ROWS` erlaubt (notfalls `OFFSET 0 ROWS`) und kennt kein `WITH TIES`; das bietet `TOP n WITH TIES`.',
        mdn: MS + 'queries/select-order-by-clause-transact-sql'
      },
      sqlite: { none: 'Kein `FETCH FIRST`; stattdessen `LIMIT n [OFFSET m]`. Für „mit Gleichplatzierten“ `RANK() OVER (ORDER BY …)` berechnen und außen filtern.' }
    },
    tip: '`WITH TIES` ist ideal für Ranglisten („Top 3 inklusive Gleichplatzierter“) und braucht zwingend ein `ORDER BY`.',
    keywords: ['fetch first', 'fetch next', 'rows only', 'with ties', 'limit standard', 'top n', 'oracle', 'top with ties'],
    related: ['LIMIT / OFFSET', 'RANK() / DENSE_RANK()', 'SQL-Dialekte'],
    mdn: PG + 'sql-select.html#SQL-LIMIT'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'Berechnete Spalten',
    desc: 'Im SELECT dürfen beliebige Ausdrücke aus Spalten, Funktionen und Konstanten stehen.',
    details: 'Statt nur Spalten auszuwählen, kann man rechnen (`preis * menge`), Funktionen aufrufen (`UPPER(name)`), Strings verketten oder mit `CASE` verzweigen. Das Ergebnis existiert nur in der Abfrage und wird nicht gespeichert. Für dauerhaft berechnete Werte gibt es generierte Spalten oder Views.',
    dialects: {
      std: {
        syntax: 'SELECT ausdruck AS alias FROM …',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, produkt VARCHAR(50), preis DECIMAL(10,2), menge INTEGER);
INSERT INTO bestellungen VALUES (1, 'Maus', 19.99, 3), (2, 'Kabel', 4.50, 10), (3, 'Monitor', 189.00, 1);

SELECT produkt,
       preis * menge                                     AS netto,
       ROUND(preis * menge * 1.19, 2)                    AS brutto,
       UPPER(produkt) || ' x' || CAST(menge AS VARCHAR(10)) AS etikett
FROM bestellungen
ORDER BY id;
-- produkt | netto  | brutto | etikett
-- Maus    | 59.97  | 71.36  | MAUS x3
-- Kabel   | 45.00  | 53.55  | KABEL x10
-- Monitor | 189.00 | 224.91 | MONITOR x1
`)
      },
      pg: { note: 'Ganzzahl durch Ganzzahl bleibt ganzzahlig (`7 / 2 = 3`). Beim Verketten mit `||` wandelt PostgreSQL Zahlen auch ohne `CAST` in Text um.' },
      mysql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, produkt VARCHAR(50), preis DECIMAL(10,2), menge INT);
INSERT INTO bestellungen VALUES (1, 'Maus', 19.99, 3), (2, 'Kabel', 4.50, 10), (3, 'Monitor', 189.00, 1);

SELECT produkt,
       preis * menge                          AS netto,
       ROUND(preis * menge * 1.19, 2)         AS brutto,
       CONCAT(UPPER(produkt), ' x', menge)    AS etikett
FROM bestellungen
ORDER BY id;
-- produkt | netto  | brutto | etikett
-- Maus    | 59.97  | 71.36  | MAUS x3
-- Kabel   | 45.00  | 53.55  | KABEL x10
-- Monitor | 189.00 | 224.91 | MONITOR x1
`),
        note: 'Verkettet wird mit `CONCAT()`, Zahlen werden dabei automatisch Text. `/` liefert auch bei zwei Ganzzahlen eine Dezimalzahl (`7 / 2 = 3.5000`).'
      },
      mssql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, produkt NVARCHAR(50), preis DECIMAL(10,2), menge INT);
INSERT INTO bestellungen VALUES (1, N'Maus', 19.99, 3), (2, N'Kabel', 4.50, 10), (3, N'Monitor', 189.00, 1);

SELECT produkt,
       preis * menge                                   AS netto,
       ROUND(preis * menge * 1.19, 2)                  AS brutto,
       UPPER(produkt) + N' x' + CAST(menge AS NVARCHAR(10)) AS etikett
FROM bestellungen
ORDER BY id;
-- produkt | netto  | brutto | etikett
-- Maus    | 59.97  | 71.36  | MAUS x3
-- Kabel   | 45.00  | 53.55  | KABEL x10
-- Monitor | 189.00 | 224.91 | MONITOR x1
`),
        note: 'Verkettet wird mit `+`; Zahlen müssen dafür per `CAST` in Text umgewandelt werden, sonst versucht SQL Server, den String in eine Zahl zu wandeln. `CONCAT()` wandelt automatisch. `ROUND` behält die Nachkommastellen des Typs (`71.3600`).'
      },
      sqlite: { note: 'Gerechnet wird je nach Wert in Ganzzahl oder Gleitkomma; `7 / 2` ist `3`. `||` wandelt Zahlen automatisch in Text.' }
    },
    tip: 'Ausdrücke, die in mehreren Abfragen gebraucht werden, als View oder generierte Spalte ablegen, statt die Formel zu kopieren.',
    keywords: ['berechnet', 'ausdruck', 'expression', 'computed column', 'rechnen', 'formel', 'abgeleitete spalte'],
    related: ['AS (Alias)', 'Arithmetische Operatoren', 'CASE', 'Generierte Spalten'],
    mdn: PG + 'queries-select-lists.html'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'SELECT ohne FROM',
    desc: 'Wertet Ausdrücke aus, ohne eine Tabelle zu lesen, z. B. zum Testen von Funktionen.',
    details: 'Ein `SELECT` ohne `FROM` liefert genau eine Zeile mit den berechneten Ausdrücken. Das ist praktisch, um Funktionen, Datumsrechnung oder Operatoren schnell auszuprobieren. Oracle verlangt (vor Version 23) immer ein `FROM` und stellt dafür die Ein-Zeilen-Tabelle `DUAL` bereit.',
    dialects: {
      std: { none: 'Im ISO-Standard braucht `SELECT` ein `FROM`. Standardkonform liefert `VALUES (6 * 7, UPPER(\'sql\'))` eine Zeile ohne Tabelle.' },
      pg: {
        syntax: 'SELECT ausdruck [, …];',
        example: e(`
SELECT 6 * 7          AS antwort,
       UPPER('sql')   AS gross,
       10 / 4         AS ganzzahl,
       10 / 4.0       AS dezimal;
-- antwort | gross | ganzzahl | dezimal
-- 42      | SQL   | 2        | 2.5

SELECT CURRENT_DATE AS heute;
-- z. B. 2026-11-16
`)
      },
      mysql: {
        syntax: 'SELECT ausdruck [, …];\nSELECT ausdruck FROM DUAL;',
        example: e(`
SELECT 6 * 7          AS antwort,
       UPPER('sql')   AS gross,
       10 DIV 4       AS ganzzahl,
       10 / 4         AS dezimal;
-- antwort | gross | ganzzahl | dezimal
-- 42      | SQL   | 2        | 2.5

-- Für Oracle-Gewohnheiten gibt es auch DUAL
SELECT CURRENT_DATE AS heute FROM DUAL;
-- z. B. 2026-11-16
`),
        note: '`FROM DUAL` ist erlaubt, aber überflüssig. `10 / 4` ist hier `2.5000`, Ganzzahldivision heißt `DIV`.'
      },
      mssql: {
        example: e(`
SELECT 6 * 7          AS antwort,
       UPPER('sql')   AS gross,
       10 / 4         AS ganzzahl,
       10 / 4.0       AS dezimal;
-- antwort | gross | ganzzahl | dezimal
-- 42      | SQL   | 2        | 2.5

SELECT CAST(GETDATE() AS DATE) AS heute;
-- z. B. 2026-11-16
`),
        note: 'Das aktuelle Datum liefert `CAST(GETDATE() AS DATE)`; `CURRENT_DATE` gibt es erst in neueren Versionen.'
      },
      sqlite: {
        example: e(`
SELECT 6 * 7          AS antwort,
       UPPER('sql')   AS gross,
       10 / 4         AS ganzzahl,
       10 / 4.0       AS dezimal;
-- antwort | gross | ganzzahl | dezimal
-- 42      | SQL   | 2        | 2.5

SELECT CURRENT_DATE AS heute;
-- z. B. 2026-11-16 (in UTC)
`),
        note: '`CURRENT_DATE` liefert das Datum in UTC; für Ortszeit `date(\'now\', \'localtime\')`.'
      }
    },
    tip: 'Ideal als Taschenrechner in der Datenbank-Konsole, um das Verhalten einer Funktion im eigenen Dialekt zu prüfen.',
    keywords: ['ohne from', 'dual', 'ausdruck testen', 'select konstante', 'taschenrechner', 'without from', 'values'],
    related: ['SELECT', 'Berechnete Spalten', 'CURRENT_DATE / CURRENT_TIMESTAMP'],
    mdn: PG + 'sql-select.html'
  },
  {
    lang: 'sql', group: 'SELECT-Abfragen', name: 'Paginierung (Keyset)',
    desc: 'Blättern über „ab dem letzten gesehenen Schlüssel“ statt mit OFFSET.',
    details: 'Statt `OFFSET 10000` merkt man sich die Sortierwerte der letzten Zeile und filtert die nächste Seite mit `WHERE (sortwert, id) < (letzter_wert, letzte_id)`. Mit passendem Index ist jede Seite gleich schnell, und neue Zeilen verschieben die Seiten nicht. Nachteil: kein direkter Sprung auf Seite 57.',
    dialects: {
      std: {
        syntax: 'SELECT … FROM t\nWHERE (sortspalte, id) < (:letzter_wert, :letzte_id)\nORDER BY sortspalte DESC, id DESC\nFETCH FIRST n ROWS ONLY;',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 5200), (2, 'Ben', 3900), (3, 'Cem', 4800), (4, 'Dana', 4800), (5, 'Eva', 3600);

-- Seite 1
SELECT id, name, gehalt FROM mitarbeiter
ORDER BY gehalt DESC, id DESC FETCH FIRST 2 ROWS ONLY;
-- id | name | gehalt
-- 1  | Ada  | 5200
-- 4  | Dana | 4800

-- Seite 2: ab der letzten Zeile von Seite 1 (4800, 4)
SELECT id, name, gehalt FROM mitarbeiter
WHERE (gehalt, id) < (4800, 4)
ORDER BY gehalt DESC, id DESC FETCH FIRST 2 ROWS ONLY;
-- id | name | gehalt
-- 3  | Cem  | 4800
-- 2  | Ben  | 3900
`)
      },
      pg: { note: 'Zeilenvergleiche `(a, b) < (x, y)` nutzen einen zusammengesetzten Index direkt; üblich ist `LIMIT n` statt `FETCH FIRST`.' },
      mysql: {
        syntax: 'SELECT … FROM t\nWHERE (sortspalte, id) < (?, ?)\nORDER BY sortspalte DESC, id DESC\nLIMIT n;',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 5200), (2, 'Ben', 3900), (3, 'Cem', 4800), (4, 'Dana', 4800), (5, 'Eva', 3600);

SELECT id, name, gehalt FROM mitarbeiter
ORDER BY gehalt DESC, id DESC LIMIT 2;
-- id | name | gehalt
-- 1  | Ada  | 5200
-- 4  | Dana | 4800

SELECT id, name, gehalt FROM mitarbeiter
WHERE (gehalt, id) < (4800, 4)
ORDER BY gehalt DESC, id DESC LIMIT 2;
-- id | name | gehalt
-- 3  | Cem  | 4800
-- 2  | Ben  | 3900
`),
        note: 'Zeilenvergleiche funktionieren; ältere Versionen nutzten dafür aber keinen Index, dann hilft die ausgeschriebene Form `gehalt < ? OR (gehalt = ? AND id < ?)`.'
      },
      mssql: {
        syntax: 'SELECT TOP (n) … FROM t\nWHERE sortspalte < @wert OR (sortspalte = @wert AND id < @id)\nORDER BY sortspalte DESC, id DESC;',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, N'Ada', 5200), (2, N'Ben', 3900), (3, N'Cem', 4800), (4, N'Dana', 4800), (5, N'Eva', 3600);

SELECT TOP 2 id, name, gehalt FROM mitarbeiter
ORDER BY gehalt DESC, id DESC;
-- id | name | gehalt
-- 1  | Ada  | 5200
-- 4  | Dana | 4800

-- Kein Zeilenvergleich: Bedingung ausschreiben
DECLARE @gehalt INT = 4800, @id INT = 4;
SELECT TOP 2 id, name, gehalt FROM mitarbeiter
WHERE gehalt < @gehalt OR (gehalt = @gehalt AND id < @id)
ORDER BY gehalt DESC, id DESC;
-- id | name | gehalt
-- 3  | Cem  | 4800
-- 2  | Ben  | 3900
`),
        note: 'Keine Zeilenvergleiche `(a, b) < (x, y)`; die Bedingung wird mit `OR` ausgeschrieben.'
      },
      sqlite: {
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name TEXT, gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 5200), (2, 'Ben', 3900), (3, 'Cem', 4800), (4, 'Dana', 4800), (5, 'Eva', 3600);

SELECT id, name, gehalt FROM mitarbeiter
ORDER BY gehalt DESC, id DESC LIMIT 2;
-- id | name | gehalt
-- 1  | Ada  | 5200
-- 4  | Dana | 4800

SELECT id, name, gehalt FROM mitarbeiter
WHERE (gehalt, id) < (4800, 4)
ORDER BY gehalt DESC, id DESC LIMIT 2;
-- id | name | gehalt
-- 3  | Cem  | 4800
-- 2  | Ben  | 3900
`),
        note: 'Zeilenvergleiche (Row Values) gibt es seit SQLite 3.15.'
      }
    },
    tip: 'Ein zusammengesetzter Index auf genau die Sortierspalten (`gehalt, id`) macht Keyset-Paginierung schnell.',
    keywords: ['keyset', 'seek method', 'cursor pagination', 'paginierung', 'blättern', 'endlos scrollen', 'offset langsam', 'row values'],
    related: ['LIMIT / OFFSET', 'ORDER BY', 'Zusammengesetzter Index'],
    mdn: PG + 'queries-limit.html'
  },

  // ---------------- Operatoren & Bedingungen ----------------
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'Vergleichsoperatoren',
    desc: 'Vergleichen zwei Werte: =, <> bzw. !=, <, >, <=, >=.',
    details: 'Gleichheit wird in SQL mit einem einfachen `=` geprüft, Ungleichheit standardkonform mit `<>`; `!=` verstehen aber alle verbreiteten Systeme. Strings werden nach Collation verglichen, Datumswerte chronologisch. Ist eine Seite NULL, ist das Ergebnis NULL (unbekannt) und die Zeile fällt aus dem `WHERE`. Für NULL-Prüfungen gibt es `IS NULL` und `IS DISTINCT FROM`.',
    values: [
      ['=', 'gleich (nicht ==)'],
      ['<> / !=', 'ungleich'],
      ['< / >', 'kleiner / größer'],
      ['<= / >=', 'kleiner gleich / größer gleich']
    ],
    dialects: {
      std: {
        syntax: 'a = b    a <> b\na < b    a > b     a <= b    a >= b',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50);

SELECT name, preis FROM produkte
WHERE preis >= 10 AND preis <> 189
ORDER BY preis;
-- name     | preis
-- Maus     | 19.99
-- Tastatur | 49.90

-- Vergleiche sind Ausdrücke vom Typ BOOLEAN
SELECT 3 = 3 AS gleich, 'a' < 'b' AS kleiner, 2 <> 2 AS ungleich, NULL = NULL AS null_gleich;
-- gleich | kleiner | ungleich | null_gleich
-- true   | true    | false    | NULL
`)
      },
      pg: { note: '`!=` wird intern zu `<>`. Vergleiche liefern `true`/`false`, die man direkt selektieren kann.' },
      mysql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50);

SELECT name, preis FROM produkte
WHERE preis >= 10 AND preis <> 189
ORDER BY preis;
-- name     | preis
-- Maus     | 19.99
-- Tastatur | 49.90

-- Vergleiche liefern 1 / 0; 'a' = 'A' ist wahr (Collation)
SELECT 3 = 3 AS gleich, 'a' < 'b' AS kleiner, 2 <> 2 AS ungleich, NULL = NULL AS null_gleich, 'a' = 'A' AS gross_klein;
-- gleich | kleiner | ungleich | null_gleich | gross_klein
-- 1      | 1       | 0        | NULL        | 1
`),
        note: 'Vergleiche ergeben die Zahlen 1 und 0. Zusätzlich gibt es `<=>`, ein NULL-sicheres Gleich. Strings vergleicht die Standard-Collation ohne Groß/Klein.',
        mdn: MY + 'comparison-operators.html'
      },
      mssql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, N'Maus', 19.99), (2, N'Tastatur', 49.90), (3, N'Monitor', 189.00), (4, N'Kabel', 4.50);

SELECT name, preis FROM produkte
WHERE preis >= 10 AND preis <> 189
ORDER BY preis;
-- name     | preis
-- Maus     | 19.99
-- Tastatur | 49.90

-- Vergleiche kann man nicht selektieren: mit CASE in 1 / 0 umwandeln
SELECT CASE WHEN 3 = 3 THEN 1 ELSE 0 END     AS gleich,
       CASE WHEN 'a' < 'b' THEN 1 ELSE 0 END AS kleiner,
       CASE WHEN 2 <> 2 THEN 1 ELSE 0 END    AS ungleich;
-- gleich | kleiner | ungleich
-- 1      | 1       | 0
`),
        note: 'Ein Vergleich ist kein Wert: `SELECT 1 = 1` ist ein Syntaxfehler, nur in `WHERE`, `CASE` usw. erlaubt. Strings vergleicht die Standard-Collation ohne Groß/Klein. Zusätzlich gibt es `!<` und `!>`.',
        mdn: MS + 'language-elements/comparison-operators-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, preis NUMERIC);
INSERT INTO produkte VALUES (1, 'Maus', 19.99), (2, 'Tastatur', 49.90), (3, 'Monitor', 189.00), (4, 'Kabel', 4.50);

SELECT name, preis FROM produkte
WHERE preis >= 10 AND preis <> 189
ORDER BY preis;
-- name     | preis
-- Maus     | 19.99
-- Tastatur | 49.9

-- Vergleiche liefern 1 / 0
SELECT 3 = 3 AS gleich, 'a' < 'b' AS kleiner, 2 <> 2 AS ungleich, NULL = NULL AS null_gleich;
-- gleich | kleiner | ungleich | null_gleich
-- 1      | 1       | 0        | NULL
`),
        note: 'Vergleiche ergeben die Zahlen 1 und 0. `==` ist als Synonym für `=` erlaubt. Zahlen sind immer kleiner als Text.',
        mdn: SL + 'lang_expr.html'
      }
    },
    tip: 'Strings mit Zahlen vergleichen sich lexikografisch: `\'10\' < \'9\'` ist wahr. Zahlen daher als Zahlentyp speichern.',
    keywords: ['vergleich', 'gleich', 'ungleich', 'größer', 'kleiner', 'comparison', 'operator', 'equals', 'not equal'],
    related: ['WHERE', 'IS NULL', 'IS DISTINCT FROM', 'BETWEEN'],
    mdn: PG + 'functions-comparison.html'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'AND / OR / NOT',
    desc: 'Verknüpfen und verneinen Bedingungen; Klammern steuern die Auswertung.',
    details: '`AND` ist wahr, wenn beide Seiten wahr sind, `OR`, wenn mindestens eine wahr ist, `NOT` kehrt um. Weil es NULL gibt, arbeitet SQL mit dreiwertiger Logik: `NULL AND FALSE` ist `FALSE`, `NULL OR TRUE` ist `TRUE`, sonst bleibt es meist NULL. `AND` bindet stärker als `OR`; gemischte Bedingungen deshalb immer klammern.',
    dialects: {
      std: {
        syntax: 'bedingung1 AND bedingung2\nbedingung1 OR bedingung2\nNOT bedingung',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'Vertrieb', 3900), (3, 'Cem', 'IT', 4800),
  (4, 'Dana', 'Marketing', 4100), (5, 'Eva', 'Vertrieb', 4300);

SELECT name, abteilung, gehalt
FROM mitarbeiter
WHERE (abteilung = 'IT' OR abteilung = 'Vertrieb')
  AND NOT gehalt < 4500
ORDER BY name;
-- name | abteilung | gehalt
-- Ada  | IT        | 5200
-- Cem  | IT        | 4800
`)
      },
      mysql: { note: 'Zusätzlich `&&`, `||` und `!` als Kurzformen (veraltet) sowie `XOR`. `||` ist daher in MySQL kein Verkettungsoperator.', mdn: MY + 'logical-operators.html' }
    },
    tip: 'Viele `OR` auf dieselbe Spalte lassen sich mit `IN (…)` kürzer und lesbarer schreiben.',
    keywords: ['and', 'or', 'not', 'und', 'oder', 'nicht', 'logisch', 'verknüpfung', 'boolean', 'klammern', 'xor'],
    related: ['Operator-Rangfolge', 'Dreiwertige Logik', 'IN', 'WHERE'],
    mdn: PG + 'functions-logical.html'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'BETWEEN',
    desc: 'Prüft, ob ein Wert in einem Bereich liegt, beide Grenzen eingeschlossen.',
    details: '`x BETWEEN a AND b` ist gleichbedeutend mit `x >= a AND x <= b`; die kleinere Grenze muss zuerst stehen, sonst ist das Ergebnis leer. Funktioniert mit Zahlen, Strings und Datumswerten. Fallstrick bei Zeitstempeln: `BETWEEN \'2026-01-01\' AND \'2026-03-31\'` schließt Zeitpunkte am 31. nach Mitternacht aus. Für Zeiträume ist `>= start AND < folgetag` sicherer.',
    dialects: {
      std: {
        syntax: 'ausdruck [NOT] BETWEEN untergrenze AND obergrenze',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag DECIMAL(10,2), datum TIMESTAMP);
INSERT INTO bestellungen VALUES
  (1, 1, 250.00, '2026-01-15 00:00:00'), (2, 2, 80.00, '2026-03-31 00:00:00'),
  (3, 1, 120.00, '2026-04-01 00:00:00'), (4, 3, 45.00, '2026-03-31 14:00:00');

SELECT id, betrag FROM bestellungen WHERE betrag BETWEEN 80 AND 200 ORDER BY id;
-- id | betrag
-- 2  | 80.00
-- 3  | 120.00

-- Fallstrick: Bestellung 4 (31.03. um 14 Uhr) fehlt
SELECT id, datum FROM bestellungen
WHERE datum BETWEEN '2026-01-01' AND '2026-03-31' ORDER BY id;
-- id | datum
-- 1  | 2026-01-15 00:00:00
-- 2  | 2026-03-31 00:00:00

-- Besser: halboffener Bereich
SELECT id FROM bestellungen WHERE datum >= '2026-01-01' AND datum < '2026-04-01' ORDER BY id;
-- id
-- 1
-- 2
-- 4
`)
      },
      pg: { note: 'Zusätzlich `BETWEEN SYMMETRIC`, das die Grenzen bei Bedarf selbst vertauscht.' },
      mysql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATETIME);
INSERT INTO bestellungen VALUES
  (1, 1, 250.00, '2026-01-15 00:00:00'), (2, 2, 80.00, '2026-03-31 00:00:00'),
  (3, 1, 120.00, '2026-04-01 00:00:00'), (4, 3, 45.00, '2026-03-31 14:00:00');

SELECT id, betrag FROM bestellungen WHERE betrag BETWEEN 80 AND 200 ORDER BY id;
-- id | betrag
-- 2  | 80.00
-- 3  | 120.00

SELECT id, datum FROM bestellungen
WHERE datum BETWEEN '2026-01-01' AND '2026-03-31' ORDER BY id;
-- id | datum
-- 1  | 2026-01-15 00:00:00
-- 2  | 2026-03-31 00:00:00

SELECT id FROM bestellungen WHERE datum >= '2026-01-01' AND datum < '2026-04-01' ORDER BY id;
-- id
-- 1
-- 2
-- 4
`),
        note: 'Für Datum mit Uhrzeit nimmt man `DATETIME`; `TIMESTAMP` gibt es auch, rechnet aber in UTC um und reicht nur bis 2038.'
      },
      mssql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATETIME2(0));
INSERT INTO bestellungen VALUES
  (1, 1, 250.00, '2026-01-15 00:00:00'), (2, 2, 80.00, '2026-03-31 00:00:00'),
  (3, 1, 120.00, '2026-04-01 00:00:00'), (4, 3, 45.00, '2026-03-31 14:00:00');

SELECT id, betrag FROM bestellungen WHERE betrag BETWEEN 80 AND 200 ORDER BY id;
-- id | betrag
-- 2  | 80.00
-- 3  | 120.00

SELECT id, datum FROM bestellungen
WHERE datum BETWEEN '2026-01-01' AND '2026-03-31' ORDER BY id;
-- id | datum
-- 1  | 2026-01-15 00:00:00
-- 2  | 2026-03-31 00:00:00

SELECT id FROM bestellungen WHERE datum >= '2026-01-01' AND datum < '2026-04-01' ORDER BY id;
-- id
-- 1
-- 2
-- 4
`),
        note: 'Für Datum mit Uhrzeit `DATETIME2` verwenden; `TIMESTAMP` ist in SQL Server kein Zeittyp, sondern eine Zeilenversion. Beim alten `DATETIME` rundet `23:59:59.999` auf den Folgetag – ein weiterer Grund für halboffene Bereiche.'
      },
      sqlite: {
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC, datum TEXT);
INSERT INTO bestellungen VALUES
  (1, 1, 250, '2026-01-15'), (2, 2, 80, '2026-03-31'),
  (3, 1, 120, '2026-04-01'), (4, 3, 45, '2026-03-31 14:00:00');

SELECT id, betrag FROM bestellungen WHERE betrag BETWEEN 80 AND 200 ORDER BY id;
-- id | betrag
-- 2  | 80
-- 3  | 120

-- Text-Vergleich: '2026-03-31 14:00:00' ist größer als '2026-03-31'
SELECT id, datum FROM bestellungen
WHERE datum BETWEEN '2026-01-01' AND '2026-03-31' ORDER BY id;
-- id | datum
-- 1  | 2026-01-15
-- 2  | 2026-03-31

SELECT id FROM bestellungen WHERE datum >= '2026-01-01' AND datum < '2026-04-01' ORDER BY id;
-- id
-- 1
-- 2
-- 4
`),
        note: 'Datumswerte sind Text; `BETWEEN` vergleicht sie als Strings, was im ISO-Format chronologisch passt. Gemischte Werte mit und ohne Uhrzeit machen den Fallstrick noch tückischer.'
      }
    },
    tip: 'Für Datums- und Zeitbereiche immer `>= Anfang AND < Ende` verwenden; das funktioniert unabhängig davon, ob die Spalte eine Uhrzeit enthält.',
    keywords: ['between', 'bereich', 'zwischen', 'von bis', 'range', 'intervall', 'inklusive'],
    related: ['Vergleichsoperatoren', 'Datumsbereich filtern', 'IN'],
    mdn: PG + 'functions-comparison.html'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'IN',
    desc: 'Prüft, ob ein Wert in einer Liste von Werten vorkommt.',
    details: '`x IN (a, b, c)` ist die Kurzform für `x = a OR x = b OR x = c`. Statt einer festen Liste kann auch eine Unterabfrage stehen. Vorsicht bei `NOT IN`: Enthält die Liste ein NULL, ist das Ergebnis nie wahr, und die Abfrage liefert keine Zeilen. Sehr lange Listen (Tausende Werte) bremsen; dann besser eine temporäre Tabelle und einen Join nutzen.',
    dialects: {
      std: {
        syntax: 'ausdruck [NOT] IN (wert1, wert2, …)\nausdruck [NOT] IN (SELECT …)',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES
  (1, 'Müller GmbH', 'Berlin'), (2, 'Schmidt AG', 'Hamburg'),
  (3, 'Weber KG', 'Köln'), (4, 'Becker OHG', 'München');

SELECT name, stadt FROM kunden WHERE stadt IN ('Berlin', 'Köln') ORDER BY name;
-- name        | stadt
-- Müller GmbH | Berlin
-- Weber KG    | Köln

-- Fallstrick: NULL in der NOT-IN-Liste
SELECT COUNT(*) AS anzahl FROM kunden WHERE stadt NOT IN ('Berlin', NULL);
-- anzahl
-- 0
`)
      },
      pg: { note: 'Für Arrays gibt es zusätzlich `x = ANY(array)`, praktisch mit einem einzigen Parameter für die ganze Liste.' },
      mssql: { note: 'Eine Liste kann höchstens einige Tausend Werte haben; sehr lange Listen führen zu Fehler 8623. Dann eine Tabellenvariable oder `STRING_SPLIT()` joinen.' }
    },
    tip: 'Für „nicht in einer anderen Tabelle“ `NOT EXISTS` statt `NOT IN (SELECT …)` verwenden; das ist NULL-sicher.',
    keywords: ['in', 'liste', 'enthalten', 'mehrere werte', 'not in', 'werteliste', 'list'],
    related: ['IN (Unterabfrage)', 'NOT IN und NULL', 'AND / OR / NOT'],
    mdn: PG + 'functions-comparisons.html'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'LIKE',
    desc: 'Mustervergleich für Strings mit den Platzhaltern % und _.',
    details: '`%` steht für beliebig viele Zeichen (auch keins), `_` für genau ein Zeichen. Ob dabei Groß/Klein unterschieden wird, ist je System verschieden. Ein Muster mit führendem `%` kann keinen normalen Index nutzen.',
    values: [
      ['%', 'beliebig viele Zeichen'],
      ['_', 'genau ein Zeichen'],
      ["'Ma%'", 'beginnt mit Ma'],
      ["'%kabel%'", 'enthält kabel'],
      ["'M_us'", 'M, ein Zeichen, us']
    ],
    dialects: {
      std: {
        syntax: "ausdruck [NOT] LIKE 'muster' [ESCAPE 'zeichen']",
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50));
INSERT INTO produkte VALUES (1, 'Maus'), (2, 'Mauspad'), (3, 'Monitor'), (4, 'USB-Kabel'), (5, 'Kabelbinder');

SELECT name FROM produkte WHERE name LIKE 'Maus%' ORDER BY name;
-- name
-- Maus
-- Mauspad

SELECT name FROM produkte WHERE name LIKE 'M_us';
-- name
-- Maus

-- Groß/Klein zählt: 'kabel' findet 'Kabel' nicht
SELECT COUNT(*) AS anzahl FROM produkte WHERE name LIKE '%kabel%';
-- anzahl
-- 0
SELECT COUNT(*) AS anzahl FROM produkte WHERE LOWER(name) LIKE '%kabel%';
-- anzahl
-- 2
`)
      },
      pg: { note: 'Case-sensitive; ohne Groß/Klein mit `ILIKE`. Für `LIKE \'abc%\'` braucht der Index bei nicht-C-Collation die Operatorklasse `text_pattern_ops`.' },
      mysql: {
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO produkte VALUES (1, 'Maus'), (2, 'Mauspad'), (3, 'Monitor'), (4, 'USB-Kabel'), (5, 'Kabelbinder');

SELECT name FROM produkte WHERE name LIKE 'Maus%' ORDER BY name;
-- name
-- Maus
-- Mauspad

SELECT name FROM produkte WHERE name LIKE 'M_us';
-- name
-- Maus

-- Standard-Collation: Groß/Klein egal
SELECT COUNT(*) AS anzahl FROM produkte WHERE name LIKE '%kabel%';
-- anzahl
-- 2
SELECT COUNT(*) AS anzahl FROM produkte WHERE name LIKE '%kabel%' COLLATE utf8mb4_bin;
-- anzahl
-- 0
`),
        note: 'Groß/Klein hängt von der Collation ab; mit der Standard-Collation wird nicht unterschieden. Für reguläre Ausdrücke gibt es `REGEXP`.',
        mdn: MY + 'string-comparison-functions.html'
      },
      mssql: {
        syntax: "ausdruck [NOT] LIKE 'muster' [ESCAPE 'zeichen']\n'[a-c]%'   -- Zeichenklasse\n'[^a-c]%'  -- nicht a bis c",
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50));
INSERT INTO produkte VALUES (1, N'Maus'), (2, N'Mauspad'), (3, N'Monitor'), (4, N'USB-Kabel'), (5, N'Kabelbinder');

SELECT name FROM produkte WHERE name LIKE 'Maus%' ORDER BY name;
-- name
-- Maus
-- Mauspad

-- Zeichenklasse: beginnt mit K oder U
SELECT name FROM produkte WHERE name LIKE '[KU]%' ORDER BY name;
-- name
-- Kabelbinder
-- USB-Kabel

-- Standard-Collation: Groß/Klein egal
SELECT COUNT(*) AS anzahl FROM produkte WHERE name LIKE '%kabel%';
-- anzahl
-- 2
`),
        note: 'Zusätzlich Zeichenklassen `[abc]`, `[a-c]` und `[^a-c]`. Groß/Klein hängt von der Collation ab, standardmäßig egal.',
        mdn: MS + 'language-elements/like-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO produkte VALUES (1, 'Maus'), (2, 'Mauspad'), (3, 'Monitor'), (4, 'USB-Kabel'), (5, 'Kabelbinder');

SELECT name FROM produkte WHERE name LIKE 'Maus%' ORDER BY name;
-- name
-- Maus
-- Mauspad

SELECT name FROM produkte WHERE name LIKE 'M_us';
-- name
-- Maus

-- LIKE ignoriert Groß/Klein bei ASCII-Buchstaben
SELECT COUNT(*) AS anzahl FROM produkte WHERE name LIKE '%kabel%';
-- anzahl
-- 2

-- GLOB unterscheidet Groß/Klein und nutzt * und ?
SELECT COUNT(*) AS anzahl FROM produkte WHERE name GLOB '*kabel*';
-- anzahl
-- 0
`),
        note: '`LIKE` ignoriert Groß/Klein nur bei ASCII (`\'ä\' LIKE \'Ä\'` ist falsch); `PRAGMA case_sensitive_like` ändert das Verhalten. `GLOB` ist die case-sensitive Variante mit `*` und `?`.',
        mdn: SL + 'lang_expr.html#like'
      }
    },
    tip: 'Für portable, schreibweisen-unabhängige Suche `LOWER(name) LIKE LOWER(:suche)` verwenden; für echte Volltextsuche gibt es eigene Indizes (PostgreSQL `tsvector`, SQLite FTS5, MySQL `FULLTEXT`).',
    keywords: ['like', 'muster', 'pattern', 'wildcard', 'platzhalter', 'prozent', 'unterstrich', 'enthält', 'beginnt mit', 'suche', 'glob'],
    related: ['ILIKE', 'ESCAPE', 'Reguläre Ausdrücke', 'Collation'],
    mdn: PG + 'functions-matching.html#FUNCTIONS-LIKE'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'ILIKE',
    desc: 'PostgreSQL-Variante von LIKE, die Groß- und Kleinschreibung ignoriert.',
    details: '`ILIKE` funktioniert wie `LIKE`, vergleicht aber ohne Groß/Klein, auch bei Umlauten. Es ist eine PostgreSQL-Erweiterung; `~~*` ist die Operatorform. Andere Systeme erreichen dasselbe mit `LOWER(spalte) LIKE LOWER(muster)` oder einer Collation ohne Groß/Klein-Unterscheidung.',
    dialects: {
      std: { none: 'Kein `ILIKE`; stattdessen `LOWER(spalte) LIKE LOWER(muster)` oder eine Collation ohne Groß-/Kleinschreibung.' },
      pg: {
        syntax: "ausdruck [NOT] ILIKE 'muster'\nausdruck ~~* 'muster'",
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO produkte VALUES (1, 'USB-Kabel'), (2, 'Kabelbinder'), (3, 'ÖLFILTER'), (4, 'Maus');

SELECT name FROM produkte WHERE name ILIKE '%kabel%' ORDER BY name;
-- name
-- Kabelbinder
-- USB-Kabel

-- auch mit Umlauten
SELECT name FROM produkte WHERE name ILIKE 'öl%';
-- name
-- ÖLFILTER

-- Portable Alternative
SELECT name FROM produkte WHERE LOWER(name) LIKE '%kabel%' ORDER BY name;
-- name
-- Kabelbinder
-- USB-Kabel
`),
        note: 'Schnell wird `ILIKE \'%…%\'` erst mit `CREATE EXTENSION pg_trgm` und einem GIN-Index `USING gin (name gin_trgm_ops)`.',
        mdn: PG + 'functions-matching.html#FUNCTIONS-LIKE'
      },
      mysql: { none: 'Kein `ILIKE`; nicht nötig, weil `LIKE` mit der Standard-Collation (`utf8mb4_0900_ai_ci`) Groß/Klein und sogar Akzente ignoriert.' },
      mssql: { none: 'Kein `ILIKE`; nicht nötig, weil `LIKE` mit der Standard-Collation (`…_CI_AS`) Groß/Klein ignoriert. Sonst `name COLLATE Latin1_General_CI_AS LIKE …`.' },
      sqlite: { none: 'Kein `ILIKE`; `LIKE` ignoriert Groß/Klein bereits, allerdings nur bei ASCII-Buchstaben (Umlaute nicht, auch `LOWER()` wandelt nur ASCII).' }
    },
    tip: 'Wer portabel bleiben will, schreibt `LOWER(name) LIKE LOWER(:suche)`; in PostgreSQL ist `ILIKE` kürzer und behandelt Umlaute korrekt.',
    keywords: ['ilike', 'case insensitive', 'groß klein ignorieren', 'postgresql', 'suche', 'pattern', 'like', '~~*'],
    related: ['LIKE', 'UPPER() / LOWER()', 'Reguläre Ausdrücke'],
    mdn: PG + 'functions-matching.html#FUNCTIONS-LIKE'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'ESCAPE',
    desc: 'Macht % und _ in LIKE-Mustern zu normalen Zeichen.',
    details: 'Sucht man nach einem echten Prozentzeichen oder Unterstrich, stellt man ein Escape-Zeichen davor und nennt es mit `ESCAPE`. Das Zeichen ist frei wählbar, z. B. `!`. Ob es zusätzlich ein voreingestelltes Escape-Zeichen gibt, unterscheidet sich je System.',
    dialects: {
      std: {
        syntax: "ausdruck LIKE 'muster' ESCAPE 'zeichen'",
        example: e(`
CREATE TABLE aktionen (id INTEGER PRIMARY KEY, titel VARCHAR(50));
INSERT INTO aktionen VALUES (1, '10% Rabatt'), (2, '100 Stück gratis'), (3, 'Spar 10% sofort'), (4, 'max_wert');

-- !% ist ein echtes Prozentzeichen; ohne Escape passte auch "100 Stück"
SELECT titel FROM aktionen WHERE titel LIKE '%10!%%' ESCAPE '!' ORDER BY id;
-- titel
-- 10% Rabatt
-- Spar 10% sofort

SELECT titel FROM aktionen WHERE titel LIKE '%!_%' ESCAPE '!';
-- titel
-- max_wert
`)
      },
      pg: { note: 'Ohne `ESCAPE` ist der Backslash voreingestellt: `LIKE \'%10\\%%\'` funktioniert direkt. `ESCAPE \'\'` schaltet das ab.' },
      mysql: { note: 'Ohne `ESCAPE` ist der Backslash voreingestellt; im String-Literal muss er wegen der Backslash-Escapes oft verdoppelt werden (`\'%10\\\\%%\'`).' },
      mssql: {
        example: e(`
CREATE TABLE aktionen (id INT PRIMARY KEY, titel NVARCHAR(50));
INSERT INTO aktionen VALUES (1, N'10% Rabatt'), (2, N'100 Stück gratis'), (3, N'Spar 10% sofort'), (4, N'max_wert');

SELECT titel FROM aktionen WHERE titel LIKE '%10!%%' ESCAPE '!' ORDER BY id;
-- titel
-- 10% Rabatt
-- Spar 10% sofort

-- Alternative: Platzhalter in eckige Klammern
SELECT titel FROM aktionen WHERE titel LIKE '%10[%]%' ORDER BY id;
-- titel
-- 10% Rabatt
-- Spar 10% sofort
`),
        note: 'Kein voreingestelltes Escape-Zeichen. Statt `ESCAPE` kann man den Platzhalter in eine Zeichenklasse setzen: `[%]`, `[_]`, `[[]`.'
      },
      sqlite: { note: 'Kein voreingestelltes Escape-Zeichen; ohne `ESCAPE` ist der Backslash ein normales Zeichen.' }
    },
    tip: 'Wird ein Suchbegriff aus Benutzereingaben in ein LIKE-Muster eingebaut, `%`, `_` und das Escape-Zeichen selbst escapen, sonst sucht „50%“ nach allem, was mit 50 beginnt.',
    keywords: ['escape', 'prozentzeichen', 'unterstrich', 'like', 'maskieren', 'sonderzeichen', 'wildcard escapen'],
    related: ['LIKE', 'String-Literale'],
    mdn: PG + 'functions-matching.html#FUNCTIONS-LIKE'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'IS NULL',
    desc: 'Prüft, ob ein Wert NULL ist; = NULL funktioniert dafür nicht.',
    details: 'NULL bedeutet „unbekannt“, deshalb ist auch `NULL = NULL` nicht wahr, sondern NULL. Ob ein Wert fehlt, prüft man ausschließlich mit `IS NULL` bzw. `IS NOT NULL`. Ein `WHERE spalte = NULL` ist syntaktisch gültig, liefert aber nie eine Zeile. In Oracle ist zudem ein leerer String `\'\'` ebenfalls NULL.',
    dialects: {
      std: {
        syntax: 'ausdruck IS NULL\nausdruck IS NOT NULL',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller GmbH', 'Berlin'), (2, 'Schmidt AG', NULL), (3, 'Weber KG', 'Köln');

-- = NULL findet nie etwas
SELECT COUNT(*) AS anzahl FROM kunden WHERE stadt = NULL;
-- anzahl
-- 0

SELECT name FROM kunden WHERE stadt IS NULL;
-- name
-- Schmidt AG

SELECT name FROM kunden WHERE stadt IS NOT NULL ORDER BY name;
-- name
-- Müller GmbH
-- Weber KG
`)
      },
      pg: { note: 'Kurzformen `ISNULL` und `NOTNULL` (ohne Leerzeichen) sind PostgreSQL-spezifisch.' },
      mysql: { note: 'Zusätzlich `ISNULL(ausdruck)` als Funktion (liefert 1/0) und der NULL-sichere Vergleich `<=>`.' },
      mssql: { note: 'Die Funktion `ISNULL(a, b)` ist etwas anderes: Sie ersetzt NULL durch b (wie `COALESCE`). Die veraltete Einstellung `SET ANSI_NULLS OFF` lässt `= NULL` wahr werden.', mdn: MS + 'queries/is-null-transact-sql' },
      sqlite: { note: 'Kurzformen `ISNULL`, `NOTNULL` und `NOT NULL` als Operatoren; außerdem ist `IS` ein NULL-sicheres Gleich (`stadt IS NULL` ist ein Spezialfall davon).' }
    },
    tip: 'Fehlende Werte für die Anzeige mit `COALESCE(stadt, \'unbekannt\')` ersetzen.',
    keywords: ['is null', 'is not null', 'null prüfen', 'leer', 'fehlend', 'missing', 'nullwert'],
    related: ['NULL', 'NULL in Vergleichen', 'COALESCE()', 'IS DISTINCT FROM'],
    mdn: PG + 'functions-comparison.html'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'Arithmetische Operatoren',
    desc: 'Grundrechenarten +, -, *, / und Rest (% bzw. MOD) in Ausdrücken.',
    details: 'Sind beide Operanden Ganzzahlen, ist `/` in den meisten Systemen eine Ganzzahldivision, die zur Null hin abschneidet (`7 / 2 = 3`). Ist ein Operand NULL, ist das Ergebnis NULL. Wie Division durch null behandelt wird, unterscheidet sich: Fehler oder NULL.',
    values: [
      ['+ - *', 'Addition, Subtraktion, Multiplikation'],
      ['/', 'Division (bei zwei Ganzzahlen meist ganzzahlig)'],
      ['MOD(a, b) / %', 'Rest der Division']
    ],
    dialects: {
      std: {
        syntax: 'a + b   a - b   a * b   a / b   MOD(a, b)   -a',
        example: e(`
SELECT 7 + 3      AS summe,
       7 - 10     AS differenz,
       7 * 3      AS produkt,
       7 / 2      AS ganzzahl,
       MOD(7, 3)  AS rest,
       7 / 2.0    AS dezimal,
       CAST(7 AS DOUBLE PRECISION) / 2 AS mit_cast,
       7 + NULL   AS mit_null;
-- summe | differenz | produkt | ganzzahl | rest | dezimal | mit_cast | mit_null
-- 10    | -3        | 21      | 3        | 1    | 3.5     | 3.5      | NULL
`)
      },
      pg: { note: 'Rest auch mit `%`; Division durch null ist ein Fehler (`division by zero`). Weitere Operatoren: `^` (Potenz), `|/` (Wurzel).', mdn: PG + 'functions-math.html' },
      mysql: {
        syntax: 'a + b   a - b   a * b   a / b   a DIV b   a % b   MOD(a, b)',
        example: e(`
SELECT 7 + 3      AS summe,
       7 - 10     AS differenz,
       7 * 3      AS produkt,
       7 DIV 2    AS ganzzahl,
       7 % 3      AS rest,
       7 / 2      AS dezimal,
       7 / 0      AS durch_null,
       7 + NULL   AS mit_null;
-- summe | differenz | produkt | ganzzahl | rest | dezimal | durch_null | mit_null
-- 10    | -3        | 21      | 3        | 1    | 3.5     | NULL       | NULL
`),
        note: '`/` liefert immer eine Dezimalzahl (`7 / 2 = 3.5000`), Ganzzahldivision heißt `DIV`. Division durch null ergibt NULL (mit Warnung; beim Schreiben im strikten Modus ein Fehler).',
        mdn: MY + 'arithmetic-functions.html'
      },
      mssql: {
        syntax: 'a + b   a - b   a * b   a / b   a % b',
        example: e(`
SELECT 7 + 3      AS summe,
       7 - 10     AS differenz,
       7 * 3      AS produkt,
       7 / 2      AS ganzzahl,
       7 % 3      AS rest,
       7 / 2.0    AS dezimal,
       CAST(7 AS FLOAT) / 2 AS mit_cast,
       7 + NULL   AS mit_null;
-- summe | differenz | produkt | ganzzahl | rest | dezimal | mit_cast | mit_null
-- 10    | -3        | 21      | 3        | 1    | 3.5     | 3.5      | NULL
`),
        note: 'Keine Funktion `MOD()`, nur `%`. Division durch null ist ein Fehler (`Divide by zero error encountered`).',
        mdn: MS + 'language-elements/arithmetic-operators-transact-sql'
      },
      sqlite: {
        syntax: 'a + b   a - b   a * b   a / b   a % b',
        example: e(`
SELECT 7 + 3      AS summe,
       7 - 10     AS differenz,
       7 * 3      AS produkt,
       7 / 2      AS ganzzahl,
       7 % 3      AS rest,
       7 / 2.0    AS dezimal,
       CAST(7 AS REAL) / 2 AS mit_cast,
       7 / 0      AS durch_null,
       7 + NULL   AS mit_null;
-- summe | differenz | produkt | ganzzahl | rest | dezimal | mit_cast | durch_null | mit_null
-- 10    | -3        | 21      | 3        | 1    | 3.5     | 3.5      | NULL       | NULL
`),
        note: 'Rest mit `%`; `MOD()` gibt es nur, wenn die Mathe-Funktionen einkompiliert sind. Division durch null ergibt NULL statt eines Fehlers.'
      }
    },
    tip: 'Durchschnitte und Quoten aus Ganzzahlspalten mit `* 1.0` oder `CAST(… AS DECIMAL(10,2))` berechnen, sonst kommt `0` statt `0.75` heraus.',
    keywords: ['rechnen', 'arithmetik', 'plus', 'minus', 'mal', 'geteilt', 'division', 'modulo', 'rest', 'math', 'div', 'mod'],
    related: ['Ganzzahldivision', 'MOD() / %', 'Berechnete Spalten', 'Division durch null vermeiden'],
    mdn: PG + 'functions-math.html'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: '|| (Verkettung)',
    desc: 'Verbindet Strings miteinander; Standard-SQL-Operator zur Verkettung.',
    details: '`\'a\' || \'b\'` ergibt `\'ab\'`. Ist ein Teil NULL, ist das gesamte Ergebnis NULL. Nicht jedes System versteht `||`; verbreitet sind auch `CONCAT()` und `CONCAT_WS()` (mit Trennzeichen), die sich bei NULL je nach System unterschiedlich verhalten.',
    dialects: {
      std: {
        syntax: 'ausdruck || ausdruck [|| …]',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, vorname VARCHAR(50), nachname VARCHAR(50), titel VARCHAR(10));
INSERT INTO mitarbeiter VALUES (1, 'Ada', 'Lovelace', 'Dr.'), (2, 'Ben', 'Becker', NULL);

SELECT vorname || ' ' || nachname                        AS name,
       titel || ' ' || nachname                          AS mit_titel,
       COALESCE(titel || ' ', '') || nachname            AS ohne_luecke,
       'Nr. ' || CAST(id AS VARCHAR(10))                 AS nummer
FROM mitarbeiter
ORDER BY id;
-- name         | mit_titel    | ohne_luecke  | nummer
-- Ada Lovelace | Dr. Lovelace | Dr. Lovelace | Nr. 1
-- Ben Becker   | NULL         | Becker       | Nr. 2
`)
      },
      pg: { note: 'Zahlen werden bei `||` automatisch Text. Zusätzlich `CONCAT()` und `CONCAT_WS()`, die NULL einfach überspringen.' },
      mysql: {
        syntax: 'CONCAT(a, b, …)\nCONCAT_WS(trenner, a, b, …)',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, vorname VARCHAR(50), nachname VARCHAR(50), titel VARCHAR(10));
INSERT INTO mitarbeiter VALUES (1, 'Ada', 'Lovelace', 'Dr.'), (2, 'Ben', 'Becker', NULL);

SELECT CONCAT(vorname, ' ', nachname)      AS name,
       CONCAT(titel, ' ', nachname)        AS mit_titel,
       CONCAT_WS(' ', titel, nachname)     AS ohne_luecke,
       CONCAT('Nr. ', id)                  AS nummer
FROM mitarbeiter
ORDER BY id;
-- name         | mit_titel    | ohne_luecke  | nummer
-- Ada Lovelace | Dr. Lovelace | Dr. Lovelace | Nr. 1
-- Ben Becker   | NULL         | Becker       | Nr. 2
`),
        note: '`||` ist ein logisches ODER (`\'a\' || \'b\'` ergibt 0), außer mit dem SQL-Modus `PIPES_AS_CONCAT`. `CONCAT()` liefert NULL, sobald ein Argument NULL ist; `CONCAT_WS()` überspringt NULL.',
        mdn: MY + 'string-functions.html#function_concat'
      },
      mssql: {
        syntax: "a + b\nCONCAT(a, b, …)\nCONCAT_WS(trenner, a, b, …)",
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, vorname NVARCHAR(50), nachname NVARCHAR(50), titel NVARCHAR(10));
INSERT INTO mitarbeiter VALUES (1, N'Ada', N'Lovelace', N'Dr.'), (2, N'Ben', N'Becker', NULL);

SELECT vorname + ' ' + nachname            AS name,
       titel + ' ' + nachname              AS mit_titel,
       CONCAT_WS(' ', titel, nachname)     AS ohne_luecke,
       CONCAT('Nr. ', id)                  AS nummer
FROM mitarbeiter
ORDER BY id;
-- name         | mit_titel    | ohne_luecke  | nummer
-- Ada Lovelace | Dr. Lovelace | Dr. Lovelace | Nr. 1
-- Ben Becker   | NULL         | Becker       | Nr. 2
`),
        note: 'Verkettet wird mit `+`; das ergibt NULL, sobald ein Teil NULL ist, und braucht für Zahlen ein `CAST`. `CONCAT()` behandelt NULL als leeren String und wandelt Zahlen selbst um; `CONCAT_WS()` gibt es seit SQL Server 2017.',
        mdn: MS + 'language-elements/string-concatenation-transact-sql'
      },
      sqlite: { note: 'Zahlen werden bei `||` automatisch Text. `concat()` und `concat_ws()` gibt es seit SQLite 3.44.' }
    },
    tip: 'Optionale Teile mit `COALESCE(titel || \' \', \'\')` bzw. `CONCAT_WS()` einbauen, dann verschwindet auch das überzählige Leerzeichen.',
    keywords: ['verkettung', 'concat', 'concatenation', 'pipe', 'strings verbinden', 'zusammenfügen', 'doppelstrich', 'string join', 'concat_ws', 'pipes_as_concat'],
    related: ['CONCAT()', 'String-Literale', 'COALESCE()'],
    mdn: PG + 'functions-string.html'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'Operator-Rangfolge',
    desc: 'Punkt vor Strich, Vergleich vor NOT, NOT vor AND, AND vor OR.',
    details: 'Arithmetik wird zuerst ausgewertet (`*`, `/` vor `+`, `-`), dann Vergleiche, dann `NOT`, dann `AND` und zuletzt `OR`. Der häufigste Fehler ist `a OR b AND c`, das als `a OR (b AND c)` gelesen wird. Die genaue Stellung von `||`, `LIKE` und `BETWEEN` unterscheidet sich zwischen den Systemen. Klammern kosten nichts und machen die Absicht eindeutig.',
    dialects: {
      std: {
        syntax: '1  unäres + -\n2  * / %\n3  + -   ||\n4  = <> < > <= >= LIKE IN BETWEEN IS\n5  NOT\n6  AND\n7  OR',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(50), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Ben', 'Vertrieb', 3900), (3, 'Cem', 'IT', 4800);

SELECT 2 + 3 * 4 AS ohne_klammern, (2 + 3) * 4 AS mit_klammern;
-- ohne_klammern | mit_klammern
-- 14            | 20

-- Gelesen als: IT OR (Vertrieb AND gehalt > 5000)
SELECT name FROM mitarbeiter
WHERE abteilung = 'IT' OR abteilung = 'Vertrieb' AND gehalt > 5000
ORDER BY name;
-- name
-- Ada
-- Cem

-- Gemeint war vermutlich:
SELECT name FROM mitarbeiter
WHERE (abteilung = 'IT' OR abteilung = 'Vertrieb') AND gehalt > 5000;
-- name
-- Ada
`)
      },
      pg: { mdn: PG + 'sql-syntax-lexical.html#SQL-PRECEDENCE', note: '`::` (Cast) bindet am stärksten; eigene Operatoren wie `||` stehen gemeinsam auf einer Stufe vor den Vergleichen.' },
      mysql: { note: '`||` ist hier ein ODER mit der Rangstufe von `OR`. `NOT` bindet schwächer als in einigen anderen Systemen, `!` dagegen sehr stark.', mdn: MY + 'operator-precedence.html' },
      mssql: { note: '`+` ist sowohl Addition als auch Verkettung und steht auf der Stufe von `-`.', mdn: MS + 'language-elements/operator-precedence-transact-sql' }
    },
    tip: 'Sobald `AND` und `OR` in einer Bedingung vorkommen, Klammern setzen, auch wenn die Rangfolge zufällig passt.',
    keywords: ['rangfolge', 'präzedenz', 'precedence', 'priorität', 'klammern', 'punkt vor strich', 'auswertungsreihenfolge'],
    related: ['AND / OR / NOT', 'Arithmetische Operatoren', 'Vergleichsoperatoren'],
    mdn: PG + 'sql-syntax-lexical.html#SQL-PRECEDENCE'
  },
  {
    lang: 'sql', group: 'Operatoren & Bedingungen', name: 'IS DISTINCT FROM',
    desc: 'NULL-sicherer Vergleich: NULL gilt dabei als gleich NULL.',
    details: '`a IS DISTINCT FROM b` ist wie `a <> b`, liefert aber nie NULL: Zwei NULL-Werte sind nicht verschieden, ein NULL und ein Wert schon. `IS NOT DISTINCT FROM` ist entsprechend ein NULL-sicheres `=`. Nicht alle Systeme kennen die Standard-Schreibweise, haben aber eine gleichwertige Kurzform.',
    dialects: {
      std: {
        syntax: 'a IS [NOT] DISTINCT FROM b',
        example: e(`
CREATE TABLE preise (id INTEGER PRIMARY KEY, alt INTEGER, neu INTEGER);
INSERT INTO preise VALUES (1, 10, 10), (2, 10, 12), (3, NULL, 5), (4, NULL, NULL);

SELECT id,
       alt <> neu                    AS ungleich,
       alt IS DISTINCT FROM neu      AS verschieden
FROM preise
ORDER BY id;
-- id | ungleich | verschieden
-- 1  | false    | false
-- 2  | true     | true
-- 3  | NULL     | true
-- 4  | NULL     | false

-- Geänderte Zeilen finden, auch wenn ein Wert NULL war
SELECT id FROM preise WHERE alt IS DISTINCT FROM neu ORDER BY id;
-- id
-- 2
-- 3
`)
      },
      mysql: {
        syntax: 'a <=> b         -- NULL-sicheres Gleich\nNOT (a <=> b)   -- NULL-sicheres Ungleich',
        example: e(`
CREATE TABLE preise (id INT PRIMARY KEY, alt INT, neu INT);
INSERT INTO preise VALUES (1, 10, 10), (2, 10, 12), (3, NULL, 5), (4, NULL, NULL);

SELECT id,
       alt <> neu                    AS ungleich,
       NOT (alt <=> neu)             AS verschieden
FROM preise
ORDER BY id;
-- id | ungleich | verschieden
-- 1  | 0        | 0
-- 2  | 1        | 1
-- 3  | NULL     | 1
-- 4  | NULL     | 0

SELECT id FROM preise WHERE NOT (alt <=> neu) ORDER BY id;
-- id
-- 2
-- 3
`),
        note: 'Kein `IS DISTINCT FROM`; stattdessen der Operator `<=>` („Spaceship“), ein NULL-sicheres Gleich.',
        mdn: MY + 'comparison-operators.html#operator_equal-to'
      },
      mssql: {
        example: e(`
CREATE TABLE preise (id INT PRIMARY KEY, alt INT, neu INT);
INSERT INTO preise VALUES (1, 10, 10), (2, 10, 12), (3, NULL, 5), (4, NULL, NULL);

-- Vergleiche nicht selektierbar: per CASE in 1 / 0 umwandeln
SELECT id,
       CASE WHEN alt <> neu THEN 1 WHEN alt = neu THEN 0 END          AS ungleich,
       CASE WHEN alt IS DISTINCT FROM neu THEN 1 ELSE 0 END           AS verschieden
FROM preise
ORDER BY id;
-- id | ungleich | verschieden
-- 1  | 0        | 0
-- 2  | 1        | 1
-- 3  | NULL     | 1
-- 4  | NULL     | 0

SELECT id FROM preise WHERE alt IS DISTINCT FROM neu ORDER BY id;
-- id
-- 2
-- 3
`),
        note: 'Seit SQL Server 2022. In älteren Versionen: `WHERE alt <> neu OR (alt IS NULL AND neu IS NOT NULL) OR (alt IS NOT NULL AND neu IS NULL)` oder `EXISTS (SELECT alt EXCEPT SELECT neu)`.',
        mdn: MS + 'queries/is-distinct-from-transact-sql'
      },
      sqlite: {
        syntax: 'a IS [NOT] DISTINCT FROM b\na IS b       -- NULL-sicheres Gleich\na IS NOT b   -- NULL-sicheres Ungleich',
        example: e(`
CREATE TABLE preise (id INTEGER PRIMARY KEY, alt INTEGER, neu INTEGER);
INSERT INTO preise VALUES (1, 10, 10), (2, 10, 12), (3, NULL, 5), (4, NULL, NULL);

SELECT id,
       alt <> neu                    AS ungleich,
       alt IS DISTINCT FROM neu      AS verschieden,
       alt IS NOT neu                AS kurzform
FROM preise
ORDER BY id;
-- id | ungleich | verschieden | kurzform
-- 1  | 0        | 0           | 0
-- 2  | 1        | 1           | 1
-- 3  | NULL     | 1           | 1
-- 4  | NULL     | 0           | 0
`),
        note: 'Die Standardform gibt es seit 3.39; schon länger die Kurzformen `IS` und `IS NOT`. Ergebnisse sind 1 und 0.'
      }
    },
    tip: 'Ideal beim Vergleich alter und neuer Werte in Triggern oder Abgleichen; ein einfaches `<>` übersieht Wechsel von oder zu NULL.',
    keywords: ['is distinct from', 'null sicher', 'null safe', 'vergleich null', '<=>', 'is not distinct from', 'is not', 'spaceship'],
    related: ['IS NULL', 'NULL in Vergleichen', 'Vergleichsoperatoren'],
    mdn: PG + 'functions-comparison.html'
  },

  // ---------------- Datentypen ----------------
  {
    lang: 'sql', group: 'Datentypen', name: 'INTEGER',
    desc: 'Ganzzahl ohne Nachkommastellen, meist 4 Byte (ca. ±2,1 Milliarden).',
    details: '`INTEGER` (kurz `INT`) speichert ganze Zahlen; daneben gibt es `SMALLINT` (2 Byte) und `BIGINT` (8 Byte). Rechnen zwei Ganzzahlen, bleibt das Ergebnis in den meisten Systemen ganzzahlig, auch bei Division. Ein Überlauf ist ein Fehler.',
    values: [
      ['SMALLINT', '2 Byte: −32 768 bis 32 767'],
      ['INTEGER / INT', '4 Byte: −2 147 483 648 bis 2 147 483 647'],
      ['BIGINT', '8 Byte: ca. ±9,2 · 10^18']
    ],
    dialects: {
      std: {
        syntax: 'spalte SMALLINT | INTEGER | INT | BIGINT',
        example: e(`
CREATE TABLE lager (id INTEGER PRIMARY KEY, artikel VARCHAR(50), menge INTEGER NOT NULL);
INSERT INTO lager VALUES (1, 'Schraube', 500), (2, 'Mutter', 320);

SELECT id, artikel, menge, menge / 3 AS drittel
FROM lager
ORDER BY id;
-- id | artikel  | menge | drittel
-- 1  | Schraube | 500   | 166
-- 2  | Mutter   | 320   | 106

-- INSERT INTO lager VALUES (3, 'Dübel', 3000000000);
-- → Fehler: integer out of range
`)
      },
      pg: { note: 'Auch als `int2`, `int4`, `int8` ansprechbar. Überlauf ist ein Fehler.', mdn: PG + 'datatype-numeric.html#DATATYPE-INT' },
      mysql: {
        syntax: 'spalte TINYINT | SMALLINT | MEDIUMINT | INT | BIGINT [UNSIGNED]',
        example: e(`
CREATE TABLE lager (id INT PRIMARY KEY, artikel VARCHAR(50), menge INT UNSIGNED NOT NULL);
INSERT INTO lager VALUES (1, 'Schraube', 500), (2, 'Mutter', 320);

-- / liefert eine Dezimalzahl, DIV schneidet ab
SELECT id, artikel, menge, menge DIV 3 AS drittel, menge / 3 AS genau
FROM lager
ORDER BY id;
-- id | artikel  | menge | drittel | genau
-- 1  | Schraube | 500   | 166     | 166.6667
-- 2  | Mutter   | 320   | 106     | 106.6667

-- INSERT INTO lager VALUES (3, 'Dübel', -5);
-- → Fehler: Out of range value for column 'menge'
`),
        note: 'Zusätzlich `TINYINT` (1 Byte), `MEDIUMINT` (3 Byte) und `UNSIGNED` für nur nicht-negative Werte mit doppeltem Bereich. Die Anzeigebreite `INT(11)` ist veraltet und begrenzt nichts.',
        mdn: MY + 'integer-types.html'
      },
      mssql: { note: 'Zusätzlich `TINYINT` (1 Byte, nur 0 bis 255). Überlauf ist ein Fehler (`Arithmetic overflow error`).', mdn: MS + 'data-types/int-bigint-smallint-and-tinyint-transact-sql' },
      sqlite: {
        example: e(`
CREATE TABLE lager (id INTEGER PRIMARY KEY, artikel TEXT, menge INTEGER NOT NULL);
-- INTEGER PRIMARY KEY ist die rowid und zählt selbst hoch
INSERT INTO lager (artikel, menge) VALUES ('Schraube', 500), ('Mutter', 320);

SELECT id, artikel, menge, menge / 3 AS drittel, typeof(menge) AS typ
FROM lager
ORDER BY id;
-- id | artikel  | menge | drittel | typ
-- 1  | Schraube | 500   | 166     | integer
-- 2  | Mutter   | 320   | 106     | integer
`),
        note: 'Jeder Ganzzahlwert belegt je nach Größe 1 bis 8 Byte; `SMALLINT`, `INT` und `BIGINT` sind nur Namen für dieselbe INTEGER-Affinität. `INTEGER PRIMARY KEY` ist ein Alias für die `rowid` und vergibt Werte automatisch.',
        mdn: SL + 'datatype3.html'
      }
    },
    tip: 'Geldbeträge lassen sich exakt als ganze Cent in INTEGER speichern; beim Anzeigen durch 100 teilen.',
    keywords: ['int', 'integer', 'ganzzahl', 'smallint', 'tinyint', 'zahl', 'number', 'whole number', 'unsigned', 'mediumint'],
    related: ['BIGINT', 'NUMERIC / DECIMAL', 'Ganzzahldivision', 'Auto-Increment'],
    mdn: PG + 'datatype-numeric.html#DATATYPE-INT'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'BIGINT',
    desc: '8-Byte-Ganzzahl für sehr große Werte wie IDs, Zähler oder Zeitstempel in ms.',
    details: '`BIGINT` reicht bis etwa 9,2 Trillionen (2^63 − 1). Für Primärschlüssel von Tabellen, die schnell wachsen, ist es die sichere Wahl, weil ein 4-Byte-`INTEGER` nach 2,1 Milliarden Zeilen überläuft und eine spätere Umstellung großer Tabellen teuer ist.',
    dialects: {
      std: {
        syntax: 'spalte BIGINT',
        example: e(`
CREATE TABLE ereignisse (id BIGINT PRIMARY KEY, zeit_ms BIGINT NOT NULL);
INSERT INTO ereignisse VALUES (3000000000, 1763287200000), (3000000001, 1763290800000);

SELECT id, zeit_ms, zeit_ms / 1000 AS sekunden FROM ereignisse ORDER BY id;
-- id         | zeit_ms       | sekunden
-- 3000000000 | 1763287200000 | 1763287200
-- 3000000001 | 1763290800000 | 1763290800

SELECT MAX(id) + 1 AS naechste FROM ereignisse;
-- naechste
-- 3000000002
`)
      },
      pg: { note: 'Für neue IDs `BIGINT GENERATED ALWAYS AS IDENTITY` statt `BIGSERIAL`. `2147483647 + 1` mit zwei `INTEGER`-Werten ist ein Fehler (`integer out of range`).' },
      mysql: { note: '`/` liefert eine Dezimalzahl (`1763287200.0000`); ganzzahlig mit `DIV`. `BIGINT UNSIGNED` reicht bis 2^64 − 1. In `CAST` heißt der Typ `SIGNED`, nicht `BIGINT`.' },
      mssql: { note: 'Literale über 2^31 sind automatisch `NUMERIC`; Rechnungen mit zwei `INT`-Werten laufen bei Überlauf in einen Fehler, dann einen Operanden per `CAST(… AS BIGINT)` umwandeln.' },
      sqlite: { note: 'Alle Ganzzahlen sind ohnehin bis zu 8 Byte groß; `BIGINT` ist nur ein anderer Name für INTEGER-Affinität.' }
    },
    tip: 'Primärschlüssel neuer Tabellen gleich als `BIGINT` anlegen; die 4 Byte Mehrplatz pro Zeile sind billiger als eine spätere Migration.',
    keywords: ['bigint', 'int8', 'große zahl', '64 bit', 'long', 'überlauf', 'overflow', 'id'],
    related: ['INTEGER', 'IDENTITY', 'Auto-Increment'],
    mdn: PG + 'datatype-numeric.html#DATATYPE-INT'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'NUMERIC / DECIMAL',
    desc: 'Exakte Dezimalzahl mit fester Genauigkeit, ideal für Geldbeträge.',
    details: '`NUMERIC(p, s)` speichert bis zu p Stellen, davon s nach dem Komma, ohne Rundungsfehler; `DECIMAL` ist praktisch dasselbe. Werte mit mehr Nachkommastellen werden gerundet, zu große Werte sind ein Fehler. Rechnen mit NUMERIC ist langsamer als mit Gleitkomma, dafür exakt.',
    values: [
      ['NUMERIC(10, 2)', 'bis 99 999 999,99'],
      ['DECIMAL(p, s)', 'Synonym für NUMERIC(p, s)']
    ],
    dialects: {
      std: {
        syntax: 'spalte NUMERIC(genauigkeit, nachkommastellen)\nspalte DECIMAL(10, 2)',
        example: e(`
CREATE TABLE buchungen (id INTEGER PRIMARY KEY, betrag NUMERIC(10, 2));
INSERT INTO buchungen VALUES (1, 0.1), (2, 0.2), (3, 19.999);

-- Exakt: kein Rundungsfehler
SELECT SUM(betrag) AS summe FROM buchungen WHERE id <= 2;
-- summe
-- 0.30

-- Auf zwei Nachkommastellen gerundet gespeichert
SELECT betrag FROM buchungen WHERE id = 3;
-- betrag
-- 20.00
`)
      },
      pg: { note: '`NUMERIC` ohne Angaben speichert beliebig viele Stellen. Den Typ `MONEY` gibt es, besser ist aber `NUMERIC`.', mdn: PG + 'datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL' },
      mysql: { note: 'Bis 65 Stellen. Zu viele Nachkommastellen werden mit einer Warnung gerundet, zu große Werte sind im strikten Modus ein Fehler.', mdn: MY + 'fixed-point-types.html' },
      mssql: { note: 'Bis 38 Stellen. Die Typen `MONEY` und `SMALLMONEY` haben feste 4 Nachkommastellen und runden bei Division ungünstig; `DECIMAL` ist die bessere Wahl.', mdn: MS + 'data-types/decimal-and-numeric-transact-sql' },
      sqlite: {
        example: e(`
CREATE TABLE buchungen (id INTEGER PRIMARY KEY, betrag NUMERIC(10, 2));
INSERT INTO buchungen VALUES (1, 0.1), (2, 0.2), (3, 19.999);

-- Gespeichert als Gleitkomma (REAL): Rundungsfehler
SELECT SUM(betrag) AS summe FROM buchungen WHERE id <= 2;
-- summe
-- 0.30000000000000004

-- Genauigkeit und Skala werden ignoriert
SELECT betrag, typeof(betrag) AS typ FROM buchungen WHERE id = 3;
-- betrag | typ
-- 19.999 | real
`),
        note: 'Kein echter Dezimaltyp: Werte landen als INTEGER oder REAL (Gleitkomma), Länge und Skala werden ignoriert. Geld deshalb als ganze Cent in INTEGER speichern.',
        mdn: SL + 'datatype3.html'
      }
    },
    tip: 'Für Geld `NUMERIC(12, 2)` bzw. `DECIMAL(12, 2)` verwenden, in SQLite ganze Cent als INTEGER.',
    keywords: ['numeric', 'decimal', 'dezimal', 'festkomma', 'geld', 'währung', 'money', 'exakt', 'genauigkeit', 'precision', 'scale'],
    related: ['REAL / DOUBLE PRECISION', 'INTEGER', 'Rundungsfehler bei Gleitkomma', 'ROUND()'],
    mdn: PG + 'datatype-numeric.html#DATATYPE-NUMERIC-DECIMAL'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'REAL / DOUBLE PRECISION',
    desc: 'Gleitkommazahlen: schnell und mit großem Wertebereich, aber nicht exakt.',
    details: '`REAL` hat einfache Genauigkeit (meist 4 Byte, ca. 6 Stellen), `DOUBLE PRECISION` doppelte (8 Byte, ca. 15 Stellen); `FLOAT(n)` wählt nach Mantissenbits. Weil Werte binär gespeichert werden, ist `0.1 + 0.2` nicht genau `0.3`. Gleitkomma eignet sich für Messwerte und Wissenschaft, nicht für Geld oder Gleichheitsvergleiche.',
    values: [
      ['REAL', 'einfache Genauigkeit, meist 4 Byte'],
      ['DOUBLE PRECISION', '8 Byte, ca. 15 Dezimalstellen'],
      ['FLOAT(n)', 'n Bit Mantisse: bis 24 wie REAL, darüber wie DOUBLE']
    ],
    dialects: {
      std: {
        syntax: 'spalte REAL | DOUBLE PRECISION | FLOAT(n)',
        example: e(`
CREATE TABLE messwerte (id INTEGER PRIMARY KEY, wert DOUBLE PRECISION);
INSERT INTO messwerte VALUES (1, 0.1), (2, 0.2);

SELECT SUM(wert)                         AS summe,
       CAST(SUM(wert) AS DECIMAL(10,2))  AS gerundet
FROM messwerte;
-- summe               | gerundet
-- 0.30000000000000004 | 0.30

-- Nie mit = vergleichen, sondern mit Toleranz
SELECT CASE WHEN SUM(wert) = 0.3 THEN 'ja' ELSE 'nein' END              AS gleich,
       CASE WHEN ABS(SUM(wert) - 0.3) < 1e-9 THEN 'ja' ELSE 'nein' END  AS fast_gleich
FROM messwerte;
-- gleich | fast_gleich
-- nein   | ja
`)
      },
      pg: { note: 'Kurznamen `float4` (REAL) und `float8` (DOUBLE PRECISION). Achtung: Ein Literal wie `0.1` ist in PostgreSQL `NUMERIC`, `0.1 + 0.2` ist dort also exakt `0.3`.', mdn: PG + 'datatype-numeric.html#DATATYPE-FLOAT' },
      mysql: { note: '`FLOAT` ist 4 Byte, `DOUBLE` 8 Byte; `REAL` ist hier ein Synonym für `DOUBLE`. Literale wie `0.1` sind exakte Dezimalzahlen.', mdn: MY + 'floating-point-types.html' },
      mssql: { note: '`FLOAT` ohne Angabe ist 8 Byte, `REAL` 4 Byte; `DOUBLE PRECISION` ist ein Synonym für `FLOAT(53)`.', mdn: MS + 'data-types/float-and-real-transact-sql' },
      sqlite: {
        example: e(`
CREATE TABLE messwerte (id INTEGER PRIMARY KEY, wert REAL);
INSERT INTO messwerte VALUES (1, 0.1), (2, 0.2);

-- CAST(… AS DECIMAL) hilft hier nicht: Runden mit ROUND()
SELECT SUM(wert)            AS summe,
       ROUND(SUM(wert), 2)  AS gerundet
FROM messwerte;
-- summe               | gerundet
-- 0.30000000000000004 | 0.3

SELECT CASE WHEN SUM(wert) = 0.3 THEN 'ja' ELSE 'nein' END              AS gleich,
       CASE WHEN ABS(SUM(wert) - 0.3) < 1e-9 THEN 'ja' ELSE 'nein' END  AS fast_gleich
FROM messwerte;
-- gleich | fast_gleich
-- nein   | ja
`),
        note: 'Jedes REAL ist ein 8-Byte-Double, egal ob `REAL`, `FLOAT` oder `DOUBLE` deklariert ist. Auch Literale wie `0.1` sind Gleitkomma, und `DECIMAL` ist keine exakte Alternative.'
      }
    },
    tip: 'Gleitkommawerte nie mit `=` vergleichen, sondern mit einer Toleranz (`ABS(a - b) < 1e-9`).',
    keywords: ['real', 'float', 'double', 'double precision', 'gleitkomma', 'fließkomma', 'floating point', 'kommazahl'],
    related: ['NUMERIC / DECIMAL', 'Rundungsfehler bei Gleitkomma', 'ROUND()'],
    mdn: PG + 'datatype-numeric.html#DATATYPE-FLOAT'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'VARCHAR',
    desc: 'Zeichenkette variabler Länge mit Höchstlänge.',
    details: '`VARCHAR(n)` (lang `CHARACTER VARYING(n)`) speichert Text bis n Zeichen; belegt wird nur, was der Wert braucht. Ist ein Wert zu lang, reagieren die Systeme unterschiedlich: Fehler, Abschneiden oder klaglos speichern.',
    dialects: {
      std: {
        syntax: 'spalte VARCHAR(n)\nspalte CHARACTER VARYING(n)',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(10), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Weber KG', 'Köln'), (2, 'Schmidt AG', 'Hamburg');

SELECT name, CHAR_LENGTH(name) AS laenge FROM kunden ORDER BY id;
-- name       | laenge
-- Weber KG   | 8
-- Schmidt AG | 10

-- INSERT INTO kunden VALUES (3, 'Müller GmbH & Co. KG', 'Berlin');
-- → Fehler: value too long for type character varying(10)
`)
      },
      pg: { note: '`VARCHAR` ohne Länge und `TEXT` sind gleichwertig, Performance-Unterschiede gibt es nicht. Die Länge zählt Zeichen, nicht Bytes.', mdn: PG + 'datatype-character.html' },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(10), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Weber KG', 'Köln'), (2, 'Schmidt AG', 'Hamburg');

SELECT name, CHAR_LENGTH(name) AS laenge FROM kunden ORDER BY id;
-- name       | laenge
-- Weber KG   | 8
-- Schmidt AG | 10

-- INSERT INTO kunden VALUES (3, 'Müller GmbH & Co. KG', 'Berlin');
-- → Fehler: Data too long for column 'name' at row 1
`),
        note: 'Die Länge ist Pflicht. Eine Zeile darf höchstens 65 535 Byte haben; bei `utf8mb4` zählt jedes Zeichen bis zu 4 Byte. Ohne strikten SQL-Modus wird zu langer Text abgeschnitten statt abgelehnt.',
        mdn: MY + 'char.html'
      },
      mssql: {
        syntax: 'spalte VARCHAR(n | MAX)    -- Codepage\nspalte NVARCHAR(n | MAX)   -- Unicode',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(10), stadt NVARCHAR(50));
INSERT INTO kunden VALUES (1, N'Weber KG', N'Köln'), (2, N'Schmidt AG', N'Hamburg');

SELECT name, LEN(name) AS laenge FROM kunden ORDER BY id;
-- name       | laenge
-- Weber KG   | 8
-- Schmidt AG | 10

-- INSERT INTO kunden VALUES (3, N'Müller GmbH & Co. KG', N'Berlin');
-- → Fehler: String or binary data would be truncated
`),
        note: '`VARCHAR` speichert in der Codepage der Collation, `NVARCHAR` Unicode (UTF-16); für beliebige Sprachen `NVARCHAR` und `N\'…\'`-Literale. `VARCHAR(MAX)`/`NVARCHAR(MAX)` gehen bis 2 GB.',
        mdn: MS + 'data-types/char-and-varchar-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(10), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Weber KG', 'Köln'), (2, 'Schmidt AG', 'Hamburg');
-- Zu lang? SQLite speichert trotzdem vollständig
INSERT INTO kunden VALUES (3, 'Müller GmbH & Co. KG', 'Berlin');

SELECT name, LENGTH(name) AS laenge FROM kunden ORDER BY id;
-- name                 | laenge
-- Weber KG             | 8
-- Schmidt AG           | 10
-- Müller GmbH & Co. KG | 20
`),
        note: 'Die Länge wird komplett ignoriert, `VARCHAR(10)` ist einfach TEXT. Eine echte Grenze erzwingt `CHECK (LENGTH(name) <= 10)`.'
      }
    },
    tip: 'Längen großzügig, aber nicht beliebig wählen: Sie sind auch eine Plausibilitätsprüfung gegen kaputte Daten.',
    keywords: ['varchar', 'nvarchar', 'zeichenkette', 'string', 'text', 'character varying', 'länge', 'maximallänge'],
    related: ['CHAR', 'TEXT', 'CHECK', 'LENGTH()'],
    mdn: PG + 'datatype-character.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'CHAR',
    desc: 'Zeichenkette fester Länge; kürzere Werte werden mit Leerzeichen aufgefüllt.',
    details: '`CHAR(n)` (kurz für `CHARACTER(n)`) speichert immer genau n Zeichen und füllt rechts mit Leerzeichen auf. Beim Vergleichen werden diese Leerzeichen meist ignoriert, beim Verketten oder Ausgeben aber nicht überall, was zu überraschenden Ergebnissen führt. Sinnvoll nur für Codes mit wirklich fester Länge (Ländercodes, ISO-Währungen).',
    dialects: {
      std: {
        syntax: 'spalte CHAR(n)',
        example: e(`
CREATE TABLE laender (code CHAR(2) PRIMARY KEY, name VARCHAR(50));
INSERT INTO laender VALUES ('DE', 'Deutschland'), ('AT', 'Österreich'), ('CH', 'Schweiz');

SELECT code, name FROM laender ORDER BY code;
-- code | name
-- AT   | Österreich
-- CH   | Schweiz
-- DE   | Deutschland
`)
      },
      pg: { note: 'Füllt auf, ignoriert die Leerzeichen aber bei Vergleichen und bei `LENGTH()`; beim Umwandeln in `TEXT` fallen sie weg.', mdn: PG + 'datatype-character.html' },
      mysql: { note: 'Leerzeichen am Ende werden beim Lesen entfernt (außer mit SQL-Modus `PAD_CHAR_TO_FULL_LENGTH`).', mdn: MY + 'char.html' },
      mssql: { note: 'Füllt auf; `NCHAR(n)` ist die Unicode-Variante. `LEN()` ignoriert Leerzeichen am Ende, `DATALENGTH()` nicht.' },
      sqlite: { note: 'Füllt nicht auf und ignoriert die Länge; `CHAR(2)` ist einfach TEXT.' }
    },
    tip: 'Im Zweifel `VARCHAR` nehmen; `CHAR(n)` bringt außer bei festen Codes keinen Vorteil.',
    keywords: ['char', 'character', 'feste länge', 'fixed length', 'nchar', 'padding', 'leerzeichen'],
    related: ['VARCHAR', 'TEXT'],
    mdn: PG + 'datatype-character.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'TEXT',
    desc: 'Zeichenkette beliebiger Länge ohne festgelegte Obergrenze.',
    details: 'Für lange Texte ohne sinnvolle Höchstlänge bieten die meisten Systeme einen eigenen Typ. `TEXT` ist dabei der verbreitete Name, gehört aber nicht zum SQL-Standard; dort heißt das Gegenstück `CLOB`. Ob TEXT-Spalten Einschränkungen bei Index oder Standardwert haben, ist je System verschieden.',
    dialects: {
      std: { none: 'Kein `TEXT` im Standard; dort `CLOB` (`CHARACTER LARGE OBJECT`) oder `VARCHAR(n)` mit großzügiger Länge.' },
      pg: {
        syntax: 'spalte TEXT',
        example: e(`
CREATE TABLE artikel (id INTEGER PRIMARY KEY, titel TEXT NOT NULL, inhalt TEXT);
INSERT INTO artikel VALUES
  (1, 'SQL lernen', 'SELECT liest Daten, INSERT schreibt sie.'),
  (2, 'Indizes', NULL);

SELECT titel, LENGTH(inhalt) AS zeichen FROM artikel ORDER BY id;
-- titel      | zeichen
-- SQL lernen | 40
-- Indizes    | NULL
`),
        note: 'Der empfohlene Standardtyp für Strings: unbegrenzt (bis 1 GB) und genauso schnell wie `VARCHAR`. Lange Werte werden automatisch komprimiert ausgelagert (TOAST).',
        mdn: PG + 'datatype-character.html'
      },
      mysql: {
        syntax: 'spalte TINYTEXT | TEXT | MEDIUMTEXT | LONGTEXT',
        example: e(`
CREATE TABLE artikel (id INT PRIMARY KEY, titel VARCHAR(200) NOT NULL, inhalt TEXT);
INSERT INTO artikel VALUES
  (1, 'SQL lernen', 'SELECT liest Daten, INSERT schreibt sie.'),
  (2, 'Indizes', NULL);

SELECT titel, CHAR_LENGTH(inhalt) AS zeichen FROM artikel ORDER BY id;
-- titel      | zeichen
-- SQL lernen | 40
-- Indizes    | NULL
`),
        note: '`TEXT` fasst 64 KB, `MEDIUMTEXT` 16 MB, `LONGTEXT` 4 GB. TEXT-Spalten lassen sich nur mit Präfixlänge indizieren (`INDEX (inhalt(100))`) und haben nur Ausdrucks-Standardwerte (`DEFAULT (\'…\')`).',
        mdn: MY + 'blob.html'
      },
      mssql: {
        syntax: 'spalte NVARCHAR(MAX)',
        example: e(`
CREATE TABLE artikel (id INT PRIMARY KEY, titel NVARCHAR(200) NOT NULL, inhalt NVARCHAR(MAX));
INSERT INTO artikel VALUES
  (1, N'SQL lernen', N'SELECT liest Daten, INSERT schreibt sie.'),
  (2, N'Indizes', NULL);

SELECT titel, LEN(inhalt) AS zeichen FROM artikel ORDER BY id;
-- titel      | zeichen
-- SQL lernen | 40
-- Indizes    | NULL
`),
        note: 'Der Typ `TEXT` (und `NTEXT`) ist veraltet; stattdessen `NVARCHAR(MAX)` bzw. `VARCHAR(MAX)` bis 2 GB, die alle String-Funktionen unterstützen.',
        mdn: MS + 'data-types/nchar-and-nvarchar-transact-sql'
      },
      sqlite: {
        syntax: 'spalte TEXT',
        example: e(`
CREATE TABLE artikel (id INTEGER PRIMARY KEY, titel TEXT NOT NULL, inhalt TEXT);
INSERT INTO artikel VALUES
  (1, 'SQL lernen', 'SELECT liest Daten, INSERT schreibt sie.'),
  (2, 'Indizes', NULL);

SELECT titel, LENGTH(inhalt) AS zeichen, typeof(inhalt) AS typ FROM artikel ORDER BY id;
-- titel      | zeichen | typ
-- SQL lernen | 40      | text
-- Indizes    | NULL    | null
`),
        note: 'Der natürliche Typ für Strings; alle Längenangaben wie `VARCHAR(n)` landen ohnehin bei TEXT-Affinität.',
        mdn: SL + 'datatype3.html'
      }
    },
    tip: 'Wenn die Höchstlänge fachlich wichtig ist, eine Grenze per `CHECK (CHAR_LENGTH(spalte) <= n)` statt über den Typ setzen; ein Constraint lässt sich leichter ändern.',
    keywords: ['text', 'string', 'langer text', 'clob', 'longtext', 'nvarchar max', 'zeichenkette', 'mediumtext'],
    related: ['VARCHAR', 'CHAR', 'LENGTH()'],
    mdn: PG + 'datatype-character.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'BOOLEAN',
    desc: 'Wahrheitswert TRUE oder FALSE (plus NULL für unbekannt).',
    details: 'Der Standardtyp `BOOLEAN` kennt die Literale `TRUE`, `FALSE` und `UNKNOWN` (NULL). Nicht jedes System hat einen echten Wahrheitstyp; manche bilden ihn auf Ganzzahlen 1 und 0 ab. Entsprechend unterschiedlich sieht das Ergebnis einer Abfrage aus.',
    dialects: {
      std: {
        syntax: 'spalte BOOLEAN [NOT NULL] [DEFAULT TRUE]',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), aktiv BOOLEAN NOT NULL DEFAULT TRUE);
INSERT INTO kunden VALUES (1, 'Müller GmbH', TRUE), (2, 'Schmidt AG', FALSE), (3, 'Weber KG', TRUE);

SELECT name, aktiv FROM kunden WHERE aktiv ORDER BY name;
-- name        | aktiv
-- Müller GmbH | true
-- Weber KG    | true

SELECT COUNT(*) AS inaktiv FROM kunden WHERE NOT aktiv;
-- inaktiv
-- 1
`)
      },
      pg: { note: 'Echter `BOOLEAN`-Typ; als Eingabe gehen auch `\'t\'`, `\'yes\'`, `\'on\'`, `\'1\'`. `psql` zeigt die Werte als `t` und `f`.', mdn: PG + 'datatype-boolean.html' },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), aktiv BOOLEAN NOT NULL DEFAULT TRUE);
INSERT INTO kunden VALUES (1, 'Müller GmbH', TRUE), (2, 'Schmidt AG', FALSE), (3, 'Weber KG', TRUE);

SELECT name, aktiv FROM kunden WHERE aktiv ORDER BY name;
-- name        | aktiv
-- Müller GmbH | 1
-- Weber KG    | 1

SELECT COUNT(*) AS inaktiv FROM kunden WHERE NOT aktiv;
-- inaktiv
-- 1
`),
        note: '`BOOLEAN` ist nur ein Alias für `TINYINT(1)`; `TRUE` ist 1, `FALSE` 0. Die Spalte nimmt auch andere Zahlen wie 5 an.',
        mdn: MY + 'numeric-type-syntax.html'
      },
      mssql: {
        syntax: 'spalte BIT [NOT NULL] [DEFAULT 1]',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50), aktiv BIT NOT NULL DEFAULT 1);
INSERT INTO kunden VALUES (1, N'Müller GmbH', 1), (2, N'Schmidt AG', 0), (3, N'Weber KG', 1);

-- WHERE aktiv allein geht nicht: immer vergleichen
SELECT name, aktiv FROM kunden WHERE aktiv = 1 ORDER BY name;
-- name        | aktiv
-- Müller GmbH | 1
-- Weber KG    | 1

SELECT COUNT(*) AS inaktiv FROM kunden WHERE aktiv = 0;
-- inaktiv
-- 1
`),
        note: 'Kein `BOOLEAN`, stattdessen `BIT` mit 0 und 1 (die Strings `\'TRUE\'`/`\'FALSE\'` werden umgewandelt). `WHERE aktiv` und `NOT aktiv` sind nicht erlaubt.',
        mdn: MS + 'data-types/bit-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, aktiv BOOLEAN NOT NULL DEFAULT TRUE);
INSERT INTO kunden VALUES (1, 'Müller GmbH', TRUE), (2, 'Schmidt AG', FALSE), (3, 'Weber KG', TRUE);

SELECT name, aktiv FROM kunden WHERE aktiv ORDER BY name;
-- name        | aktiv
-- Müller GmbH | 1
-- Weber KG    | 1

SELECT COUNT(*) AS inaktiv FROM kunden WHERE NOT aktiv;
-- inaktiv
-- 1
`),
        note: 'Kein eigener Typ: gespeichert werden die Ganzzahlen 1 und 0; die Literale `TRUE`/`FALSE` gibt es seit 3.23.'
      }
    },
    tip: 'Boolesche Spalten mit `NOT NULL` und `DEFAULT` anlegen; ein dritter Zustand NULL macht Bedingungen wie `WHERE NOT aktiv` unvollständig.',
    keywords: ['boolean', 'bool', 'wahrheitswert', 'true', 'false', 'bit', 'flag', 'ja nein', 'tinyint(1)'],
    related: ['Dreiwertige Logik', 'AND / OR / NOT', 'DEFAULT'],
    mdn: PG + 'datatype-boolean.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'DATE',
    desc: 'Kalenderdatum ohne Uhrzeit, Literal im ISO-Format YYYY-MM-DD.',
    details: 'Ein echter `DATE`-Typ lehnt ungültige Daten ab und erlaubt Datumsrechnung. Standardkonforme Literale schreibt man `DATE \'2026-11-16\'`; Formate wie `16.11.2026` sind nicht portabel. Wie man Tage addiert, ist je System verschieden.',
    dialects: {
      std: {
        syntax: "spalte DATE\nDATE '2026-11-16'\ndatum + INTERVAL '30' DAY",
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES (1, 1, 250.00, DATE '2026-01-15'), (2, 2, 80.00, DATE '2026-03-02'), (3, 1, 120.00, DATE '2025-12-20');

SELECT id, datum FROM bestellungen WHERE datum >= DATE '2026-01-01' ORDER BY datum;
-- id | datum
-- 1  | 2026-01-15
-- 2  | 2026-03-02

-- Zahlungsziel: 30 Tage
SELECT id, CAST(datum + INTERVAL '30' DAY AS DATE) AS faellig FROM bestellungen WHERE id = 1;
-- id | faellig
-- 1  | 2026-02-14
`)
      },
      pg: { note: 'Kurz geht auch `datum + 30` (Ganzzahl = Tage, Ergebnis wieder `DATE`); die Differenz zweier Daten ist eine Zahl von Tagen.', mdn: PG + 'datatype-datetime.html' },
      mysql: {
        syntax: "spalte DATE\nDATE_ADD(datum, INTERVAL 30 DAY)\ndatum + INTERVAL 30 DAY",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES (1, 1, 250.00, '2026-01-15'), (2, 2, 80.00, '2026-03-02'), (3, 1, 120.00, '2025-12-20');

SELECT id, datum FROM bestellungen WHERE datum >= DATE '2026-01-01' ORDER BY datum;
-- id | datum
-- 1  | 2026-01-15
-- 2  | 2026-03-02

SELECT id, DATE_ADD(datum, INTERVAL 30 DAY) AS faellig FROM bestellungen WHERE id = 1;
-- id | faellig
-- 1  | 2026-02-14
`),
        note: 'Das Intervall wird ohne Anführungszeichen geschrieben: `INTERVAL 30 DAY`. Im strikten Modus sind ungültige Daten wie `\'2026-02-30\'` ein Fehler.',
        mdn: MY + 'date-and-time-functions.html#function_date-add'
      },
      mssql: {
        syntax: 'spalte DATE\nDATEADD(day, 30, datum)',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES (1, 1, 250.00, '2026-01-15'), (2, 2, 80.00, '2026-03-02'), (3, 1, 120.00, '2025-12-20');

SELECT id, datum FROM bestellungen WHERE datum >= '2026-01-01' ORDER BY datum;
-- id | datum
-- 1  | 2026-01-15
-- 2  | 2026-03-02

SELECT id, DATEADD(day, 30, datum) AS faellig FROM bestellungen WHERE id = 1;
-- id | faellig
-- 1  | 2026-02-14
`),
        note: 'Kein `DATE \'…\'`-Literal; Strings im Format `\'YYYY-MM-DD\'` werden umgewandelt (beim alten `DATETIME` ist `\'YYYYMMDD\'` die sichere Form). Rechnen mit `DATEADD` und `DATEDIFF`.',
        mdn: MS + 'functions/dateadd-transact-sql'
      },
      sqlite: {
        syntax: "spalte TEXT   -- 'YYYY-MM-DD'\ndate(datum, '+30 days')",
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC, datum TEXT);
INSERT INTO bestellungen VALUES (1, 1, 250, '2026-01-15'), (2, 2, 80, '2026-03-02'), (3, 1, 120, '2025-12-20');

-- Text im ISO-Format vergleicht und sortiert sich richtig
SELECT id, datum FROM bestellungen WHERE datum >= '2026-01-01' ORDER BY datum;
-- id | datum
-- 1  | 2026-01-15
-- 2  | 2026-03-02

SELECT id, date(datum, '+30 days') AS faellig FROM bestellungen WHERE id = 1;
-- id | faellig
-- 1  | 2026-02-14
`),
        note: 'Kein Datumstyp: Daten werden als Text `\'YYYY-MM-DD\'` gespeichert und mit `date()`, `strftime()` verarbeitet. Ungültige Daten wie `\'2026-02-30\'` werden nicht abgelehnt.',
        mdn: SL + 'lang_datefunc.html'
      }
    },
    tip: 'Daten immer im ISO-Format `YYYY-MM-DD` speichern und übergeben; nur dieses Format ist eindeutig und sortiert als Text korrekt.',
    keywords: ['date', 'datum', 'kalender', 'tag', 'iso 8601', 'yyyy-mm-dd', 'datumstyp', 'dateadd', 'date_add'],
    related: ['TIMESTAMP', 'Datum rechnen', 'date() / datetime() (SQLite)', 'Datumsbereich filtern'],
    mdn: PG + 'datatype-datetime.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'TIME',
    desc: 'Uhrzeit ohne Datum, z. B. für Öffnungszeiten oder Terminbeginn.',
    details: '`TIME` speichert eine Tageszeit `HH:MM:SS[.ffffff]`. Für Zeitpunkte mit Datum nimmt man `TIMESTAMP`, für Dauern `INTERVAL`. Rechnen mit Uhrzeiten (Minuten addieren) schreibt jedes System anders.',
    dialects: {
      std: {
        syntax: "spalte TIME\nTIME '14:30:00'\nbeginn + INTERVAL '15' MINUTE",
        example: e(`
CREATE TABLE termine (id INTEGER PRIMARY KEY, titel VARCHAR(50), beginn TIME, dauer_min INTEGER);
INSERT INTO termine VALUES (1, 'Daily', TIME '09:15:00', 15), (2, 'Review', TIME '14:00:00', 90), (3, 'Mittag', TIME '12:00:00', 45);

SELECT titel, beginn, beginn + dauer_min * INTERVAL '1' MINUTE AS ende
FROM termine
ORDER BY beginn;
-- titel  | beginn   | ende
-- Daily  | 09:15:00 | 09:30:00
-- Mittag | 12:00:00 | 12:45:00
-- Review | 14:00:00 | 15:30:00
`)
      },
      pg: { note: '`TIME WITH TIME ZONE` gibt es, wird aber selbst in der Doku nicht empfohlen. Über Mitternacht läuft die Uhrzeit einfach um (`23:30 + 1 hour = 00:30`).', mdn: PG + 'datatype-datetime.html' },
      mysql: {
        example: e(`
CREATE TABLE termine (id INT PRIMARY KEY, titel VARCHAR(50), beginn TIME, dauer_min INT);
INSERT INTO termine VALUES (1, 'Daily', '09:15:00', 15), (2, 'Review', '14:00:00', 90), (3, 'Mittag', '12:00:00', 45);

SELECT titel,
       TIME_FORMAT(beginn, '%H:%i:%s')                                       AS beginn,
       TIME_FORMAT(ADDTIME(beginn, SEC_TO_TIME(dauer_min * 60)), '%H:%i:%s') AS ende
FROM termine
ORDER BY termine.beginn;
-- titel  | beginn   | ende
-- Daily  | 09:15:00 | 09:30:00
-- Mittag | 12:00:00 | 12:45:00
-- Review | 14:00:00 | 15:30:00
`),
        note: '`TIME` kann auch Dauern darstellen, von `-838:59:59` bis `838:59:59`; über Mitternacht entsteht deshalb `24:30:00` statt `00:30:00`. Rechnen mit `ADDTIME()` oder `DATE_ADD()`.',
        mdn: MY + 'time.html'
      },
      mssql: {
        syntax: 'spalte TIME(0)\nDATEADD(minute, n, beginn)',
        example: e(`
CREATE TABLE termine (id INT PRIMARY KEY, titel NVARCHAR(50), beginn TIME(0), dauer_min INT);
INSERT INTO termine VALUES (1, N'Daily', '09:15:00', 15), (2, N'Review', '14:00:00', 90), (3, N'Mittag', '12:00:00', 45);

SELECT titel, beginn, DATEADD(minute, dauer_min, beginn) AS ende
FROM termine
ORDER BY beginn;
-- titel  | beginn   | ende
-- Daily  | 09:15:00 | 09:30:00
-- Mittag | 12:00:00 | 12:45:00
-- Review | 14:00:00 | 15:30:00
`),
        note: '`TIME(n)` legt die Sekundenbruchteile fest (Standard 7 Stellen); `TIME(0)` speichert nur ganze Sekunden.',
        mdn: MS + 'data-types/time-transact-sql'
      },
      sqlite: {
        syntax: "spalte TEXT   -- 'HH:MM:SS'\ntime(beginn, '+15 minutes')",
        example: e(`
CREATE TABLE termine (id INTEGER PRIMARY KEY, titel TEXT, beginn TEXT, dauer_min INTEGER);
INSERT INTO termine VALUES (1, 'Daily', '09:15:00', 15), (2, 'Review', '14:00:00', 90), (3, 'Mittag', '12:00:00', 45);

SELECT titel, beginn, time(beginn, '+' || dauer_min || ' minutes') AS ende
FROM termine
ORDER BY beginn;
-- titel  | beginn   | ende
-- Daily  | 09:15:00 | 09:30:00
-- Mittag | 12:00:00 | 12:45:00
-- Review | 14:00:00 | 15:30:00
`),
        note: 'Uhrzeiten sind Text; mit führender Null speichern (`09:15`, nicht `9:15`), damit Vergleich und Sortierung stimmen.',
        mdn: SL + 'lang_datefunc.html'
      }
    },
    tip: 'Uhrzeiten immer zweistellig mit Sekunden schreiben (`09:15:00`); das ist überall gültig und sortiert auch als Text richtig.',
    keywords: ['time', 'uhrzeit', 'zeit', 'tageszeit', 'hh:mm:ss', 'stunde', 'minute'],
    related: ['TIMESTAMP', 'INTERVAL', 'DATE'],
    mdn: PG + 'datatype-datetime.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'TIMESTAMP',
    desc: 'Zeitpunkt aus Datum und Uhrzeit, optional mit Zeitzone.',
    details: '`TIMESTAMP` speichert Datum und Uhrzeit ohne Zeitzone; `TIMESTAMP WITH TIME ZONE` einen absoluten Zeitpunkt, der bei der Ausgabe in die Sitzungszeitzone umgerechnet wird. Die Typnamen und ihr genaues Verhalten unterscheiden sich stark; in SQL Server ist `TIMESTAMP` sogar etwas völlig anderes.',
    dialects: {
      std: {
        syntax: "spalte TIMESTAMP [WITH TIME ZONE]\nTIMESTAMP '2026-11-16 14:30:00'",
        example: e(`
CREATE TABLE logins (id INTEGER PRIMARY KEY, benutzer VARCHAR(50), zeitpunkt TIMESTAMP);
INSERT INTO logins VALUES
  (1, 'ada', '2026-11-16 08:05:00'), (2, 'ben', '2026-11-15 22:47:10'), (3, 'ada', '2026-11-16 13:30:00');

-- Alle Logins am 16.11.
SELECT benutzer, zeitpunkt FROM logins
WHERE zeitpunkt >= '2026-11-16' AND zeitpunkt < '2026-11-17'
ORDER BY zeitpunkt;
-- benutzer | zeitpunkt
-- ada      | 2026-11-16 08:05:00
-- ada      | 2026-11-16 13:30:00

SELECT CURRENT_TIMESTAMP AS jetzt;
-- z. B. 2026-11-16 10:42:07.123456+01
`)
      },
      pg: { note: '`timestamptz` (`TIMESTAMP WITH TIME ZONE`) speichert intern UTC und ist meist die bessere Wahl. `now()` und `CURRENT_TIMESTAMP` liefern `timestamptz`.', mdn: PG + 'datatype-datetime.html' },
      mysql: {
        syntax: 'spalte DATETIME[(fsp)]\nspalte TIMESTAMP[(fsp)]   -- UTC, bis 2038',
        example: e(`
CREATE TABLE logins (id INT PRIMARY KEY, benutzer VARCHAR(50), zeitpunkt DATETIME);
INSERT INTO logins VALUES
  (1, 'ada', '2026-11-16 08:05:00'), (2, 'ben', '2026-11-15 22:47:10'), (3, 'ada', '2026-11-16 13:30:00');

SELECT benutzer, zeitpunkt FROM logins
WHERE zeitpunkt >= '2026-11-16' AND zeitpunkt < '2026-11-17'
ORDER BY zeitpunkt;
-- benutzer | zeitpunkt
-- ada      | 2026-11-16 08:05:00
-- ada      | 2026-11-16 13:30:00

SELECT NOW() AS jetzt;
-- z. B. 2026-11-16 10:42:07
`),
        note: '`DATETIME` speichert Datum und Uhrzeit ohne Zeitzone (bis Jahr 9999). `TIMESTAMP` rechnet in UTC um und reicht nur bis 2038-01-19. Sekundenbruchteile mit `DATETIME(3)` oder `(6)`.',
        mdn: MY + 'datetime.html'
      },
      mssql: {
        syntax: 'spalte DATETIME2[(n)]\nspalte DATETIMEOFFSET[(n)]   -- mit Zeitzonen-Offset',
        example: e(`
CREATE TABLE logins (id INT PRIMARY KEY, benutzer NVARCHAR(50), zeitpunkt DATETIME2(0));
INSERT INTO logins VALUES
  (1, N'ada', '2026-11-16 08:05:00'), (2, N'ben', '2026-11-15 22:47:10'), (3, N'ada', '2026-11-16 13:30:00');

SELECT benutzer, zeitpunkt FROM logins
WHERE zeitpunkt >= '2026-11-16' AND zeitpunkt < '2026-11-17'
ORDER BY zeitpunkt;
-- benutzer | zeitpunkt
-- ada      | 2026-11-16 08:05:00
-- ada      | 2026-11-16 13:30:00

SELECT SYSDATETIME() AS jetzt;
-- z. B. 2026-11-16 10:42:07.1234567
`),
        note: '`TIMESTAMP` ist hier ein veralteter Name für `ROWVERSION` (Änderungszähler), kein Zeittyp! Für Zeitpunkte `DATETIME2` bzw. mit Zeitzone `DATETIMEOFFSET`; das alte `DATETIME` ist ungenauer.',
        mdn: MS + 'data-types/datetime2-transact-sql'
      },
      sqlite: { note: 'Kein Zeittyp: Werte sind Text `\'YYYY-MM-DD HH:MM:SS\'` und werden mit `datetime()` verarbeitet. `CURRENT_TIMESTAMP` liefert UTC ohne Zeitzonenangabe.', mdn: SL + 'lang_datefunc.html' }
    },
    tip: 'Zeitpunkte in UTC speichern (z. B. `timestamptz`, `DATETIMEOFFSET`) und erst bei der Anzeige in die lokale Zeitzone umrechnen.',
    keywords: ['timestamp', 'datetime', 'zeitstempel', 'zeitpunkt', 'timestamptz', 'datetime2', 'datum uhrzeit', 'utc', 'datetimeoffset'],
    related: ['DATE', 'Zeitzonen', 'CURRENT_DATE / CURRENT_TIMESTAMP', 'INTERVAL'],
    mdn: PG + 'datatype-datetime.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'INTERVAL',
    desc: 'Zeitspanne wie „3 Tage“ oder „1 Monat“, zum Rechnen mit Datum und Zeit.',
    details: '`INTERVAL` beschreibt eine Dauer aus Jahren, Monaten, Tagen und Uhrzeitanteilen. Addiert man ein Intervall zu einem Datum, werden Monatslängen berücksichtigt: Der 31. Januar plus ein Monat ergibt meist den 28. Februar. Als eigenen Spaltentyp gibt es Intervalle nicht überall; oft existieren sie nur in Ausdrücken oder als Funktion.',
    dialects: {
      std: {
        syntax: "INTERVAL '3' DAY\nINTERVAL '90' MINUTE\nzeitpunkt + INTERVAL '1' MONTH",
        example: e(`
SELECT DATE '2026-01-31' + INTERVAL '1' MONTH                   AS monat_spaeter,
       TIMESTAMP '2026-11-16 10:00:00' + INTERVAL '90' MINUTE   AS ende;
-- monat_spaeter       | ende
-- 2026-02-28 00:00:00 | 2026-11-16 11:30:00

-- Alles der letzten 7 Tage:
-- SELECT * FROM bestellungen WHERE datum >= CURRENT_DATE - INTERVAL '7' DAY;
`)
      },
      pg: {
        syntax: "INTERVAL '3 days'\nINTERVAL '1 hour 30 minutes'\nzeitpunkt + INTERVAL '1 month'",
        example: e(`
SELECT DATE '2026-01-31' + INTERVAL '1 month'                    AS monat_spaeter,
       TIMESTAMP '2026-11-16 10:00' + INTERVAL '90 minutes'      AS ende;
-- monat_spaeter       | ende
-- 2026-02-28 00:00:00 | 2026-11-16 11:30:00

-- Intervalle als Werte: AGE() und Multiplikation
SELECT CAST(AGE(DATE '2026-11-16', DATE '1990-05-03') AS TEXT)  AS lebensalter,
       CAST(INTERVAL '1 day 2 hours' * 3 AS TEXT)               AS dreifach;
-- lebensalter             | dreifach
-- 36 years 6 mons 13 days | 3 days 06:00:00
`),
        note: 'Freie Schreibweise `\'1 hour 30 minutes\'`, Spaltentyp `INTERVAL`, Funktionen wie `AGE()` und `justify_days()`. `DATE + INTEGER` addiert Tage.',
        mdn: PG + 'datatype-datetime.html#DATATYPE-INTERVAL-INPUT'
      },
      mysql: {
        syntax: 'datum + INTERVAL n einheit\nDATE_ADD(datum, INTERVAL n einheit)',
        example: e(`
SELECT DATE '2026-01-31' + INTERVAL 1 MONTH                     AS monat_spaeter,
       TIMESTAMP '2026-11-16 10:00:00' + INTERVAL 90 MINUTE     AS ende;
-- monat_spaeter | ende
-- 2026-02-28    | 2026-11-16 11:30:00

SELECT TIMESTAMPDIFF(YEAR, '1990-05-03', '2026-11-16') AS jahre;
-- jahre
-- 36
`),
        note: 'Kein Spaltentyp; `INTERVAL n EINHEIT` (ohne Anführungszeichen) gibt es nur in Ausdrücken und `DATE_ADD`/`DATE_SUB`. Differenzen mit `TIMESTAMPDIFF()`.',
        mdn: MY + 'date-and-time-functions.html#function_date-add'
      },
      mssql: {
        syntax: 'DATEADD(einheit, n, datum)\nDATEDIFF(einheit, von, bis)',
        example: e(`
SELECT DATEADD(month, 1, CAST('2026-01-31' AS DATE))                  AS monat_spaeter,
       DATEADD(minute, 90, CAST('2026-11-16 10:00:00' AS DATETIME2(0))) AS ende;
-- monat_spaeter | ende
-- 2026-02-28    | 2026-11-16 11:30:00

SELECT DATEDIFF(year, '1990-05-03', '2026-11-16') AS jahreswechsel;
-- jahreswechsel
-- 36
`),
        note: 'Kein `INTERVAL`; gerechnet wird mit `DATEADD()` und `DATEDIFF()`. Achtung: `DATEDIFF(year, …)` zählt Jahresgrenzen, kein echtes Alter.',
        mdn: MS + 'functions/dateadd-transact-sql'
      },
      sqlite: {
        syntax: "date(datum, '+1 month')\ndatetime(zeitpunkt, '+90 minutes')",
        example: e(`
SELECT date('2026-01-31', '+1 month')                    AS ueberlauf,
       date('2026-01-31', '+1 month', 'floor')           AS monat_spaeter,
       datetime('2026-11-16 10:00:00', '+90 minutes')    AS ende;
-- ueberlauf  | monat_spaeter | ende
-- 2026-03-03 | 2026-02-28    | 2026-11-16 11:30:00
`),
        note: 'Kein `INTERVAL`; Datumsfunktionen nehmen Modifikatoren wie `\'+1 month\'`. Ein „31. Februar“ läuft dabei in den März über; der Modifikator `\'floor\'` (seit 3.46) bleibt im Monat.',
        mdn: SL + 'lang_datefunc.html'
      }
    },
    tip: 'Ein Monat ist kein fester Wert: „plus 1 Monat“ und „plus 30 Tage“ liefern unterschiedliche Ergebnisse.',
    keywords: ['interval', 'zeitspanne', 'dauer', 'duration', 'datum addieren', 'dateadd', 'date_add', 'age', 'datediff'],
    related: ['Datum rechnen', 'Datumsdifferenz', 'TIMESTAMP', 'DATE'],
    mdn: PG + 'datatype-datetime.html#DATATYPE-INTERVAL-INPUT'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'BLOB / BYTEA',
    desc: 'Binärdaten wie Bilder, Dateien oder Hashes byteweise speichern.',
    details: 'Für Binärdaten gibt es einen eigenen Typ, der Bytes unverändert speichert; der Standardname ist `BLOB` (Binary Large Object), die Namen der Systeme weichen ab. Große Dateien (Bilder, PDFs) legt man meist im Dateisystem oder Objektspeicher ab und speichert in der Datenbank nur Pfad und Metadaten.',
    dialects: {
      std: {
        syntax: "spalte BLOB | VARBINARY(n)\nX'48656C6C6F'   -- Binär-Literal",
        example: e(`
CREATE TABLE dateien (id INTEGER PRIMARY KEY, name VARCHAR(50), inhalt BLOB);
INSERT INTO dateien VALUES (1, 'gruss.txt', X'48616C6C6F'), (2, 'hash.bin', X'00FF10');

SELECT name, OCTET_LENGTH(inhalt) AS bytes FROM dateien ORDER BY id;
-- name      | bytes
-- gruss.txt | 5
-- hash.bin  | 3
`),
        nocheck: true,
        note: 'PostgreSQL kennt weder `BLOB` noch `X\'…\'` als Binär-Literal (dort ist es ein Bit-String); das Beispiel wird deshalb nicht ausgeführt.'
      },
      pg: {
        syntax: "spalte BYTEA\n'\\x48656c6c6f'   -- Hex-Literal",
        example: e(`
CREATE TABLE dateien (id INTEGER PRIMARY KEY, name TEXT, inhalt BYTEA);
INSERT INTO dateien VALUES (1, 'gruss.txt', '\\x48616C6C6F'), (2, 'hash.bin', '\\x00FF10');

SELECT name, LENGTH(inhalt) AS bytes, encode(inhalt, 'hex') AS hex
FROM dateien
ORDER BY id;
-- name      | bytes | hex
-- gruss.txt | 5     | 48616c6c6f
-- hash.bin  | 3     | 00ff10
`),
        note: 'Typ `BYTEA`, Literal `\'\\x…\'`; umwandeln mit `encode()`/`decode()`. Sehr große Objekte (über 1 GB) über die Large-Object-Schnittstelle.',
        mdn: PG + 'datatype-binary.html'
      },
      mysql: {
        syntax: "spalte BLOB | MEDIUMBLOB | LONGBLOB | VARBINARY(n)\nX'48656C6C6F'",
        example: e(`
CREATE TABLE dateien (id INT PRIMARY KEY, name VARCHAR(50), inhalt BLOB);
INSERT INTO dateien VALUES (1, 'gruss.txt', X'48616C6C6F'), (2, 'hash.bin', X'00FF10');

SELECT name, LENGTH(inhalt) AS bytes, HEX(inhalt) AS hex
FROM dateien
ORDER BY id;
-- name      | bytes | hex
-- gruss.txt | 5     | 48616C6C6F
-- hash.bin  | 3     | 00FF10
`),
        note: '`BLOB` fasst 64 KB, `MEDIUMBLOB` 16 MB, `LONGBLOB` 4 GB; für kurze Werte (Hashes) `VARBINARY(n)` oder `BINARY(n)`.',
        mdn: MY + 'blob.html'
      },
      mssql: {
        syntax: 'spalte VARBINARY(n | MAX)\n0x48656C6C6F   -- Binär-Literal',
        example: e(`
CREATE TABLE dateien (id INT PRIMARY KEY, name NVARCHAR(50), inhalt VARBINARY(MAX));
INSERT INTO dateien VALUES (1, N'gruss.txt', 0x48616C6C6F), (2, N'hash.bin', 0x00FF10);

SELECT name, DATALENGTH(inhalt) AS bytes, CONVERT(VARCHAR(20), inhalt, 2) AS hex
FROM dateien
ORDER BY id;
-- name      | bytes | hex
-- gruss.txt | 5     | 48616C6C6F
-- hash.bin  | 3     | 00FF10
`),
        note: 'Typ `VARBINARY(n)` bzw. `VARBINARY(MAX)` (bis 2 GB), Literal `0x…`; `IMAGE` ist veraltet. Bytes zählt `DATALENGTH()`.',
        mdn: MS + 'data-types/binary-and-varbinary-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE dateien (id INTEGER PRIMARY KEY, name TEXT, inhalt BLOB);
INSERT INTO dateien VALUES (1, 'gruss.txt', X'48616C6C6F'), (2, 'hash.bin', X'00FF10');

SELECT name, LENGTH(inhalt) AS bytes, HEX(inhalt) AS hex, typeof(inhalt) AS typ
FROM dateien
ORDER BY id;
-- name      | bytes | hex        | typ
-- gruss.txt | 5     | 48616C6C6F | blob
-- hash.bin  | 3     | 00FF10     | blob
`),
        note: 'Literal `X\'…\'`; `LENGTH()` zählt bei BLOBs Bytes. Zufällige Bytes liefert `randomblob(n)`.',
        mdn: SL + 'datatype3.html'
      }
    },
    tip: 'Hashes und UUIDs binär statt als Hex-Text zu speichern halbiert den Platzbedarf; für die Anzeige in Hex umwandeln.',
    keywords: ['blob', 'bytea', 'binär', 'binary', 'varbinary', 'bytes', 'datei', 'bild', 'hex'],
    related: ['TEXT', 'UUID'],
    mdn: PG + 'datatype-binary.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'JSON-Typ',
    desc: 'Speichert JSON-Dokumente in einer Spalte, mit Validierung und Zugriffsfunktionen.',
    details: 'JSON eignet sich für flexible Zusatzattribute, ersetzt aber keine sauberen Spalten für Daten, nach denen oft gefiltert oder gejoint wird. Der Standard (SQL:2016/2023) beschreibt Funktionen wie `JSON_VALUE` und das Prädikat `IS JSON`; die Systeme haben dazu teils eigene Typen und Operatoren.',
    dialects: {
      std: {
        syntax: "spalte JSON\nJSON_VALUE(spalte, '$.feld')\nspalte IS JSON",
        example: e(`
CREATE TABLE bestellungen (
  id    INTEGER PRIMARY KEY,
  daten JSON NOT NULL CHECK (daten IS JSON)
);
INSERT INTO bestellungen VALUES
  (1, '{"kunde": "Ada", "artikel": ["Maus", "Kabel"], "express": true}'),
  (2, '{"kunde": "Ben", "artikel": ["Monitor"], "express": false}');

SELECT id,
       JSON_VALUE(daten, '$.kunde')                                   AS kunde,
       JSON_VALUE(daten, '$.artikel.size()' RETURNING INTEGER)        AS anzahl,
       JSON_VALUE(daten, '$.express' RETURNING BOOLEAN)               AS express
FROM bestellungen
ORDER BY id;
-- id | kunde | anzahl | express
-- 1  | Ada   | 2      | true
-- 2  | Ben   | 1      | false
`)
      },
      pg: {
        syntax: "spalte JSONB\nspalte -> 'feld'    -- JSON\nspalte ->> 'feld'   -- Text",
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, daten JSONB NOT NULL);
INSERT INTO bestellungen VALUES
  (1, '{"kunde": "Ada", "artikel": ["Maus", "Kabel"], "express": true}'),
  (2, '{"kunde": "Ben", "artikel": ["Monitor"], "express": false}');

SELECT id,
       daten ->> 'kunde'                        AS kunde,
       jsonb_array_length(daten -> 'artikel')   AS anzahl,
       daten ->> 'express'                      AS express
FROM bestellungen
ORDER BY id;
-- id | kunde | anzahl | express
-- 1  | Ada   | 2      | true
-- 2  | Ben   | 1      | false
`),
        note: '`JSONB` (binär, indizierbar per GIN, empfohlen) und `JSON` (Text, unverändert). Ungültiges JSON lehnen beide Typen ab. Die Standardfunktionen `JSON_VALUE` usw. gibt es seit PostgreSQL 17.',
        mdn: PG + 'datatype-json.html'
      },
      mysql: {
        syntax: "spalte JSON\nspalte ->> '$.feld'",
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, daten JSON NOT NULL);
INSERT INTO bestellungen VALUES
  (1, '{"kunde": "Ada", "artikel": ["Maus", "Kabel"], "express": true}'),
  (2, '{"kunde": "Ben", "artikel": ["Monitor"], "express": false}');

SELECT id,
       daten ->> '$.kunde'                AS kunde,
       JSON_LENGTH(daten, '$.artikel')    AS anzahl,
       daten ->> '$.express'              AS express
FROM bestellungen
ORDER BY id;
-- id | kunde | anzahl | express
-- 1  | Ada   | 2      | true
-- 2  | Ben   | 1      | false
`),
        note: 'Eigener Typ `JSON` (binär gespeichert, validiert). Pfade beginnen mit `$`; `->>` ist die Kurzform von `JSON_UNQUOTE(JSON_EXTRACT(…))`. Indizes über generierte Spalten oder Mehrwert-Indizes.',
        mdn: MY + 'json.html'
      },
      mssql: {
        syntax: "spalte NVARCHAR(MAX) CHECK (ISJSON(spalte) = 1)\nJSON_VALUE(spalte, '$.feld')",
        example: e(`
CREATE TABLE bestellungen (
  id    INT PRIMARY KEY,
  daten NVARCHAR(MAX) NOT NULL CHECK (ISJSON(daten) = 1)
);
INSERT INTO bestellungen VALUES
  (1, N'{"kunde": "Ada", "artikel": ["Maus", "Kabel"], "express": true}'),
  (2, N'{"kunde": "Ben", "artikel": ["Monitor"], "express": false}');

SELECT id,
       JSON_VALUE(daten, '$.kunde')                          AS kunde,
       (SELECT COUNT(*) FROM OPENJSON(daten, '$.artikel'))   AS anzahl,
       JSON_VALUE(daten, '$.express')                        AS express
FROM bestellungen
ORDER BY id;
-- id | kunde | anzahl | express
-- 1  | Ada   | 2      | true
-- 2  | Ben   | 1      | false
`),
        note: 'In SQL Server 2022 ist JSON Text (`NVARCHAR(MAX)`) mit `ISJSON()` als Prüfung; ein nativer `JSON`-Typ kam erst mit SQL Server 2025. Arrays zerlegt `OPENJSON()`.',
        mdn: MS + 'functions/json-value-transact-sql'
      },
      sqlite: {
        syntax: "spalte TEXT CHECK (json_valid(spalte))\nspalte ->> '$.feld'",
        example: e(`
CREATE TABLE bestellungen (
  id    INTEGER PRIMARY KEY,
  daten TEXT NOT NULL CHECK (json_valid(daten))
);
INSERT INTO bestellungen VALUES
  (1, '{"kunde": "Ada", "artikel": ["Maus", "Kabel"], "express": true}'),
  (2, '{"kunde": "Ben", "artikel": ["Monitor"], "express": false}');

SELECT id,
       daten ->> '$.kunde'                      AS kunde,
       json_array_length(daten, '$.artikel')    AS anzahl,
       daten ->> '$.express'                    AS express
FROM bestellungen
ORDER BY id;
-- id | kunde | anzahl | express
-- 1  | Ada   | 2      | 1
-- 2  | Ben   | 1      | 0
`),
        note: 'JSON ist Text; `json_valid()` im `CHECK` sichert gültiges JSON. `->` und `->>` gibt es seit 3.38; JSON-`true`/`false` werden dabei zu 1 und 0.',
        mdn: SL + 'json1.html'
      }
    },
    tip: 'Felder, nach denen man regelmäßig sucht, als eigene Spalte (oder generierte Spalte) herausziehen und indizieren.',
    keywords: ['json', 'jsonb', 'dokument', 'semi-strukturiert', 'nosql', 'json spalte', 'json_valid', 'isjson', 'json_value'],
    related: ['JSON-Funktionen', '-> / ->>', 'JSONB (PostgreSQL)', 'Generierte Spalten'],
    mdn: PG + 'datatype-json.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'UUID',
    desc: '128-Bit-Kennung, weltweit eindeutig ohne zentrale Vergabe.',
    details: 'UUIDs eignen sich als Primärschlüssel, wenn IDs außerhalb der Datenbank erzeugt werden oder nicht erratbar sein sollen. Zufällige UUIDs (Version 4) verteilen Einfügungen über den ganzen Index und bremsen so große Tabellen; zeitlich sortierbare UUIDs (Version 7) vermeiden das. Ob es einen eigenen Typ und eine Erzeugungsfunktion gibt, hängt vom System ab.',
    dialects: {
      std: { none: 'Kein UUID-Typ im Standard; üblich sind `CHAR(36)` oder `BINARY(16)` mit in der Anwendung erzeugten Werten.' },
      pg: {
        syntax: 'id UUID PRIMARY KEY DEFAULT gen_random_uuid()\nid UUID PRIMARY KEY DEFAULT uuidv7()   -- ab PostgreSQL 18',
        example: e(`
CREATE TABLE kunden (
  id   UUID PRIMARY KEY DEFAULT uuidv7(),
  name TEXT NOT NULL
);
INSERT INTO kunden (name) VALUES ('Müller GmbH'), ('Schmidt AG');

SELECT name, LENGTH(CAST(id AS TEXT)) AS zeichen FROM kunden ORDER BY name;
-- name        | zeichen
-- Müller GmbH | 36
-- Schmidt AG  | 36

SELECT gen_random_uuid() AS zufaellig;
-- z. B. 9b2e4f7a-1c3d-4e5f-8a6b-7c8d9e0f1a2b

-- Text wird beim Vergleich automatisch umgewandelt
SELECT CAST('9B2E4F7A-1C3D-4E5F-8A6B-7C8D9E0F1A2B' AS UUID) AS id;
-- id
-- 9b2e4f7a-1c3d-4e5f-8a6b-7c8d9e0f1a2b
`),
        note: 'Eigener Typ `UUID` (16 Byte). `gen_random_uuid()` erzeugt Version 4, `uuidv7()` (ab 18) zeitlich sortierbare Werte.',
        mdn: PG + 'datatype-uuid.html'
      },
      mysql: {
        syntax: 'id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1))',
        example: e(`
CREATE TABLE kunden (
  id   BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
  name VARCHAR(50) NOT NULL
);
INSERT INTO kunden (name) VALUES ('Müller GmbH'), ('Schmidt AG');

SELECT name, LENGTH(id) AS bytes, CHAR_LENGTH(BIN_TO_UUID(id, 1)) AS zeichen
FROM kunden ORDER BY name;
-- name        | bytes | zeichen
-- Müller GmbH | 16    | 36
-- Schmidt AG  | 16    | 36

SELECT BIN_TO_UUID(UUID_TO_BIN('9b2e4f7a-1c3d-4e5f-8a6b-7c8d9e0f1a2b')) AS id;
-- id
-- 9b2e4f7a-1c3d-4e5f-8a6b-7c8d9e0f1a2b
`),
        note: 'Kein UUID-Typ; `UUID()` liefert Version 1 als Text. Platzsparend als `BINARY(16)` mit `UUID_TO_BIN(…, 1)`, das die Zeitanteile nach vorn tauscht und so indexfreundlich sortiert.',
        mdn: MY + 'miscellaneous-functions.html#function_uuid'
      },
      mssql: {
        syntax: 'id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID()',
        example: e(`
CREATE TABLE kunden (
  id   UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
  name NVARCHAR(50) NOT NULL
);
INSERT INTO kunden (name) VALUES (N'Müller GmbH'), (N'Schmidt AG');

SELECT name, DATALENGTH(id) AS bytes, LEN(CAST(id AS CHAR(36))) AS zeichen
FROM kunden ORDER BY name;
-- name        | bytes | zeichen
-- Müller GmbH | 16    | 36
-- Schmidt AG  | 16    | 36

SELECT NEWID() AS zufaellig;
-- z. B. 9B2E4F7A-1C3D-4E5F-8A6B-7C8D9E0F1A2B
`),
        note: 'Typ `UNIQUEIDENTIFIER`; `NEWID()` erzeugt zufällige Werte, `NEWSEQUENTIALID()` (nur als `DEFAULT`) aufsteigende. Ausgabe in Großbuchstaben.',
        mdn: MS + 'data-types/uniqueidentifier-transact-sql'
      },
      sqlite: {
        syntax: 'id BLOB PRIMARY KEY DEFAULT (randomblob(16))\nid TEXT PRIMARY KEY   -- UUID aus der Anwendung',
        example: e(`
-- 16 Zufallsbytes als Ersatz; echte UUIDs erzeugt die Anwendung
CREATE TABLE kunden (
  id   BLOB PRIMARY KEY DEFAULT (randomblob(16)),
  name TEXT NOT NULL
);
INSERT INTO kunden (name) VALUES ('Müller GmbH'), ('Schmidt AG');

SELECT name, LENGTH(id) AS bytes, LENGTH(HEX(id)) AS hexzeichen FROM kunden ORDER BY name;
-- name        | bytes | hexzeichen
-- Müller GmbH | 16    | 32
-- Schmidt AG  | 16    | 32
`),
        note: 'Kein UUID-Typ und keine eingebaute UUID-Funktion; die `sqlite3`-Shell bringt die Erweiterung `uuid` mit (`uuid()`). Sonst als `TEXT` oder 16-Byte-`BLOB` aus der Anwendung.'
      }
    },
    tip: 'UUIDs als nativen Typ oder 16 Byte binär speichern, nicht als 36-Zeichen-Text; das spart Platz und beschleunigt Vergleiche.',
    keywords: ['uuid', 'guid', 'uniqueidentifier', 'gen_random_uuid', 'newid', 'uuidv7', 'eindeutige id', 'surrogatschlüssel', 'uuid_to_bin'],
    related: ['PRIMARY KEY', 'Natürlicher vs. Surrogatschlüssel', 'BLOB / BYTEA'],
    mdn: PG + 'datatype-uuid.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'ENUM-Typen',
    desc: 'Datentyp mit fester Liste erlaubter Werte, z. B. für Status-Felder.',
    details: 'Ein ENUM lässt nur Werte aus einer festen Liste zu und sortiert in der Reihenfolge der Definition, nicht alphabetisch. Neue Werte lassen sich anhängen, Entfernen oder Umbenennen ist aufwendig. Wo es keine ENUMs gibt, erreicht man dasselbe mit `CHECK (status IN (…))` oder einer Nachschlagetabelle mit Fremdschlüssel.',
    dialects: {
      std: { none: 'Keine ENUM-Typen; stattdessen `status VARCHAR(20) CHECK (status IN (\'neu\', \'bezahlt\', \'versendet\'))` oder eine Nachschlagetabelle mit Fremdschlüssel.' },
      pg: {
        syntax: "CREATE TYPE name AS ENUM ('wert1', 'wert2', …);",
        example: e(`
CREATE TYPE bestellstatus AS ENUM ('neu', 'bezahlt', 'versendet');

CREATE TABLE bestellungen (
  id     INTEGER PRIMARY KEY,
  status bestellstatus NOT NULL DEFAULT 'neu'
);
INSERT INTO bestellungen VALUES (1, 'versendet'), (2, 'neu'), (3, 'bezahlt');

-- Sortiert in der Reihenfolge der Definition
SELECT id, status FROM bestellungen ORDER BY status;
-- id | status
-- 2  | neu
-- 3  | bezahlt
-- 1  | versendet

-- INSERT INTO bestellungen VALUES (4, 'storniert');
-- → Fehler: invalid input value for enum bestellstatus: "storniert"
ALTER TYPE bestellstatus ADD VALUE 'storniert';
`),
        note: 'Ein ENUM ist ein eigener Typ (`CREATE TYPE`), den mehrere Tabellen nutzen können. Werte anhängen mit `ALTER TYPE … ADD VALUE`, entfernen geht nicht.',
        mdn: PG + 'datatype-enum.html'
      },
      mysql: {
        syntax: "spalte ENUM('wert1', 'wert2', …)",
        example: e(`
CREATE TABLE bestellungen (
  id     INT PRIMARY KEY,
  status ENUM('neu', 'bezahlt', 'versendet') NOT NULL DEFAULT 'neu'
);
INSERT INTO bestellungen VALUES (1, 'versendet'), (2, 'neu'), (3, 'bezahlt');

SELECT id, status FROM bestellungen ORDER BY status;
-- id | status
-- 2  | neu
-- 3  | bezahlt
-- 1  | versendet

-- INSERT INTO bestellungen VALUES (4, 'storniert');
-- → Fehler: Data truncated for column 'status' at row 1
ALTER TABLE bestellungen MODIFY status ENUM('neu', 'bezahlt', 'versendet', 'storniert') NOT NULL DEFAULT 'neu';
`),
        note: 'ENUM wird direkt an der Spalte definiert und intern als Zahl gespeichert. Neue Werte per `ALTER TABLE … MODIFY` mit der vollständigen Liste.',
        mdn: MY + 'enum.html'
      },
      mssql: {
        syntax: "spalte NVARCHAR(20) CHECK (spalte IN ('wert1', 'wert2', …))",
        example: e(`
CREATE TABLE bestellungen (
  id     INT PRIMARY KEY,
  status NVARCHAR(20) NOT NULL DEFAULT 'neu'
         CHECK (status IN ('neu', 'bezahlt', 'versendet'))
);
INSERT INTO bestellungen VALUES (1, N'versendet'), (2, N'neu'), (3, N'bezahlt');

-- Reihenfolge der Definition per CASE nachbauen
SELECT id, status FROM bestellungen
ORDER BY CASE status WHEN 'neu' THEN 1 WHEN 'bezahlt' THEN 2 ELSE 3 END;
-- id | status
-- 2  | neu
-- 3  | bezahlt
-- 1  | versendet

-- INSERT INTO bestellungen VALUES (4, N'storniert');
-- → Fehler: The INSERT statement conflicted with the CHECK constraint
`),
        note: 'Keine ENUM-Typen; Ersatz ist ein `CHECK`-Constraint oder eine Nachschlagetabelle mit Fremdschlüssel (dort kann auch eine Sortierspalte stehen).'
      },
      sqlite: {
        syntax: "spalte TEXT CHECK (spalte IN ('wert1', 'wert2', …))",
        example: e(`
CREATE TABLE bestellungen (
  id     INTEGER PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'neu'
         CHECK (status IN ('neu', 'bezahlt', 'versendet'))
);
INSERT INTO bestellungen VALUES (1, 'versendet'), (2, 'neu'), (3, 'bezahlt');

SELECT id, status FROM bestellungen
ORDER BY CASE status WHEN 'neu' THEN 1 WHEN 'bezahlt' THEN 2 ELSE 3 END;
-- id | status
-- 2  | neu
-- 3  | bezahlt
-- 1  | versendet

-- INSERT INTO bestellungen VALUES (4, 'storniert');
-- → Fehler: CHECK constraint failed: status IN (…)
`),
        note: 'Keine ENUM-Typen; `CHECK` oder Nachschlagetabelle. Einen `CHECK` nachträglich zu ändern erfordert in SQLite den Neuaufbau der Tabelle.'
      }
    },
    tip: 'Ändert sich die Werteliste öfter oder braucht man Zusatzinfos (Beschriftung, Sortierung), ist eine Nachschlagetabelle mit Fremdschlüssel flexibler als ein ENUM.',
    keywords: ['enum', 'aufzählung', 'enumeration', 'status', 'werteliste', 'create type', 'auswahlliste'],
    related: ['CHECK', 'FOREIGN KEY', 'TEXT'],
    mdn: PG + 'datatype-enum.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'CAST()',
    desc: 'Wandelt einen Wert explizit in einen anderen Datentyp um.',
    details: '`CAST(ausdruck AS typ)` ist die Standardform und funktioniert überall. Unterschiede gibt es bei ungültigen Werten (Fehler oder stillschweigend 0) und beim Umwandeln von Kommazahlen in Ganzzahlen (runden oder abschneiden). Die erlaubten Zieltypnamen weichen teils ab.',
    values: [
      ["CAST('42' AS INTEGER)", 'Text in Zahl'],
      ['CAST(19.5 AS VARCHAR(10))', 'Zahl in Text'],
      ["CAST('2026-11-16' AS DATE)", 'Text in Datum'],
      ['CAST(x AS DECIMAL(10, 2))', 'In Dezimalzahl mit 2 Nachkommastellen']
    ],
    dialects: {
      std: {
        syntax: 'CAST(ausdruck AS zieltyp)',
        example: e(`
SELECT CAST('42' AS INTEGER) + 1                AS zahl,
       CAST(3.9 AS INTEGER)                     AS gerundet,
       CAST(19.5 AS VARCHAR(10)) || ' €'        AS text,
       CAST(7 AS DOUBLE PRECISION) / 2          AS dezimal;
-- zahl | gerundet | text   | dezimal
-- 43   | 4        | 19.5 € | 3.5

-- SELECT CAST('abc' AS INTEGER);
-- → Fehler: invalid input syntax for type integer: "abc"
`)
      },
      pg: { note: 'Kurzform `ausdruck::typ` (z. B. `\'42\'::int`). Kommazahlen werden beim Umwandeln in Ganzzahlen gerundet. Ungültige Werte sind ein Fehler.', mdn: PG + 'sql-expressions.html#SQL-SYNTAX-TYPE-CASTS' },
      mysql: {
        syntax: 'CAST(ausdruck AS SIGNED | UNSIGNED | DECIMAL(p,s) | CHAR | DATE | DATETIME | DOUBLE | JSON)',
        example: e(`
SELECT CAST('42' AS SIGNED) + 1                 AS zahl,
       CAST(3.9 AS SIGNED)                      AS gerundet,
       CONCAT(CAST(19.5 AS CHAR), ' €')         AS text,
       CAST(7 AS DOUBLE) / 2                    AS dezimal,
       CAST('abc' AS SIGNED)                    AS ungueltig;
-- zahl | gerundet | text   | dezimal | ungueltig
-- 43   | 4       | 19.5 € | 3.5     | 0
`),
        note: 'Ganzzahl-Ziele heißen `SIGNED` bzw. `UNSIGNED`, Text-Ziel `CHAR`; `INTEGER` oder `VARCHAR` sind in `CAST` nicht erlaubt. Ungültige Werte werden mit Warnung zu 0.',
        mdn: MY + 'cast-functions.html'
      },
      mssql: {
        syntax: 'CAST(ausdruck AS zieltyp)\nCONVERT(zieltyp, ausdruck [, stil])\nTRY_CAST(ausdruck AS zieltyp)',
        example: e(`
SELECT CAST('42' AS INT) + 1                    AS zahl,
       CAST(3.9 AS INT)                         AS abgeschnitten,
       CAST(19.5 AS VARCHAR(10)) + ' €'         AS text,
       CAST(7 AS FLOAT) / 2                     AS dezimal,
       TRY_CAST('abc' AS INT)                   AS ungueltig;
-- zahl | abgeschnitten | text   | dezimal | ungueltig
-- 43   | 3             | 19.5 € | 3.5     | NULL
`),
        note: 'Kommazahlen werden beim Umwandeln in `INT` abgeschnitten. Ungültige Werte sind ein Fehler; `TRY_CAST` und `TRY_CONVERT` liefern stattdessen NULL. `CONVERT` kennt Formatstile für Datum und Binärdaten.',
        mdn: MS + 'functions/cast-and-convert-transact-sql'
      },
      sqlite: {
        example: e(`
SELECT CAST('42' AS INTEGER) + 1                AS zahl,
       CAST(3.9 AS INTEGER)                     AS abgeschnitten,
       CAST(19.5 AS TEXT) || ' €'               AS text,
       CAST(7 AS REAL) / 2                      AS dezimal,
       CAST('abc' AS INTEGER)                   AS ungueltig;
-- zahl | abgeschnitten | text   | dezimal | ungueltig
-- 43   | 3             | 19.5 € | 3.5     | 0
`),
        note: 'Ziel ist eine Affinität (`INTEGER`, `REAL`, `TEXT`, `BLOB`, `NUMERIC`); Kommazahlen werden abgeschnitten, ungültiger Text wird stillschweigend 0. `CAST(… AS DATE)` macht kein Datum daraus.',
        mdn: SL + 'lang_expr.html#castexpr'
      }
    },
    tip: 'Sich nicht auf implizite Umwandlung verlassen: Ein Vergleich von Text mit Zahl kann je nach System den Index ausschalten oder falsche Treffer liefern. Typen passend wählen oder explizit casten.',
    keywords: ['cast', 'umwandeln', 'konvertieren', 'typumwandlung', 'convert', 'type conversion', 'datentyp ändern', 'try_cast', '::'],
    related: ['Implizite Umwandlung', ':: (PostgreSQL-Cast)', 'TRY_CAST / sichere Umwandlung', 'Typaffinität (SQLite)'],
    mdn: PG + 'sql-expressions.html#SQL-SYNTAX-TYPE-CASTS'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'Typaffinität (SQLite)',
    desc: 'SQLite speichert Typen pro Wert; der Spaltentyp ist nur eine Vorliebe.',
    details: 'In SQLite hat jeder Wert einen der Speichertypen NULL, INTEGER, REAL, TEXT oder BLOB. Der deklarierte Spaltentyp bestimmt nur die Affinität: Die Spalte versucht, eingefügte Werte verlustfrei in ihren bevorzugten Typ umzuwandeln, nimmt aber notfalls alles an. Die Affinität wird aus dem Typnamen abgeleitet (enthält „INT“ → INTEGER, „CHAR“/„TEXT“ → TEXT usw.), deshalb ist auch `VARCHAR(10)` einfach TEXT. Mit `typeof()` sieht man den tatsächlichen Typ.',
    values: [
      ['INTEGER', 'Typname enthält INT'],
      ['TEXT', 'Typname enthält CHAR, CLOB oder TEXT'],
      ['BLOB', 'Typname enthält BLOB oder fehlt: keine Umwandlung'],
      ['REAL', 'Typname enthält REAL, FLOA oder DOUB'],
      ['NUMERIC', 'Alles andere, z. B. NUMERIC, DECIMAL, BOOLEAN, DATE']
    ],
    dialects: {
      std: { none: 'Statische Typen: Jede Spalte hat genau einen Typ, ein unpassender Wert ist ein Fehler oder wird umgewandelt.' },
      pg: { none: 'Strenge Typen; ein unpassender Wert ist ein Fehler (`invalid input syntax for type integer`). Den tatsächlichen Typ eines Ausdrucks zeigt `pg_typeof()`.' },
      mysql: { none: 'Statische Typen; im strikten Modus ist ein unpassender Wert ein Fehler, sonst wird er mit Warnung umgewandelt (z. B. zu 0).' },
      mssql: { none: 'Statische Typen; ein unpassender Wert ist ein Konvertierungsfehler. Einzig `SQL_VARIANT` nimmt Werte verschiedener Typen auf.' },
      sqlite: {
        example: e(`
CREATE TABLE t (i INTEGER, r REAL, x TEXT, n NUMERIC, b BLOB);
INSERT INTO t VALUES ('42', '42', 42, '3.0', '42');

SELECT typeof(i) AS ti, typeof(r) AS tr, typeof(x) AS tx, typeof(n) AS tn, typeof(b) AS tb FROM t;
-- ti      | tr   | tx   | tn      | tb
-- integer | real | text | integer | text

-- Nicht umwandelbar: wird trotzdem gespeichert
INSERT INTO t (i) VALUES ('abc');
SELECT i, typeof(i) AS typ FROM t ORDER BY rowid;
-- i   | typ
-- 42  | integer
-- abc | text
`),
        mdn: SL + 'datatype3.html'
      }
    },
    tip: 'Wer strenge Typen will, legt Tabellen mit `STRICT` an; sonst landen Tippfehler wie `\'12,5\'` unbemerkt als Text in Zahlenspalten.',
    keywords: ['affinität', 'affinity', 'typeof', 'dynamische typen', 'manifest typing', 'sqlite typen', 'speichertyp', 'storage class'],
    related: ['STRICT-Tabellen', 'CAST()', 'Implizite Umwandlung'],
    mdn: SL + 'datatype3.html'
  },
  {
    lang: 'sql', group: 'Datentypen', name: 'STRICT-Tabellen',
    desc: 'SQLite-Tabellen mit erzwungenen Spaltentypen (ab Version 3.37).',
    details: 'Mit `STRICT` hinter der Spaltenliste prüft SQLite Typen wie andere Datenbanken: Ein Wert, der sich nicht verlustfrei umwandeln lässt, löst einen Fehler aus. Erlaubt sind nur die Typnamen `INT`, `INTEGER`, `REAL`, `TEXT`, `BLOB` und `ANY`; `VARCHAR` oder `DATE` sind dann nicht zulässig. Eine `ANY`-Spalte nimmt jeden Wert unverändert auf. Ältere SQLite-Versionen können STRICT-Tabellen nicht öffnen.',
    dialects: {
      std: { none: 'Nicht nötig: Spaltentypen werden ohnehin erzwungen.' },
      pg: { none: 'Nicht nötig: Spaltentypen werden immer streng geprüft.' },
      mysql: { none: 'Nicht nötig; der strikte SQL-Modus (`STRICT_TRANS_TABLES`, Standard seit 5.7) lehnt unpassende Werte ab statt sie umzuwandeln.' },
      mssql: { none: 'Nicht nötig: Spaltentypen werden immer streng geprüft.' },
      sqlite: {
        syntax: 'CREATE TABLE name (\n  spalte INTEGER | REAL | TEXT | BLOB | ANY, …\n) STRICT;',
        example: e(`
CREATE TABLE mitarbeiter (
  id     INTEGER PRIMARY KEY,
  name   TEXT NOT NULL,
  gehalt INTEGER,
  notiz  ANY
) STRICT;

-- '5200' lässt sich verlustfrei umwandeln und wird zur Zahl
INSERT INTO mitarbeiter VALUES (1, 'Ada', '5200', 'beliebig');
SELECT gehalt, typeof(gehalt) AS typ FROM mitarbeiter;
-- gehalt | typ
-- 5200   | integer

-- INSERT INTO mitarbeiter VALUES (2, 'Ben', 'viel', NULL);
-- → Fehler: cannot store TEXT value in INTEGER column mitarbeiter.gehalt
`),
        mdn: SL + 'stricttables.html'
      }
    },
    tip: 'Für neue SQLite-Projekte `STRICT` als Standard nehmen; Datumswerte dann als `TEXT` im ISO-Format deklarieren.',
    keywords: ['strict', 'strenge typen', 'typprüfung', 'sqlite', 'type checking', 'any'],
    related: ['Typaffinität (SQLite)', 'CREATE TABLE', 'CHECK'],
    mdn: SL + 'stricttables.html'
  }
  );
})();
