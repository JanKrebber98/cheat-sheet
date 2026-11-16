window.CHEAT = window.CHEAT || [];
(function () {
  var PG = 'https://www.postgresql.org/docs/current/'; // + z. B. 'sql-insert.html'
  var SL = 'https://sqlite.org/';                      // + z. B. 'lang_upsert.html'
  var MY = 'https://dev.mysql.com/doc/refman/8.4/en/'; // + z. B. 'insert.html'
  var MS = 'https://learn.microsoft.com/en-us/sql/t-sql/'; // + z. B. 'statements/insert-transact-sql'
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Daten einfügen ----------------
  {
    lang: 'sql', group: 'Daten einfügen', name: 'INSERT INTO',
    desc: 'Fügt eine neue Zeile mit den angegebenen Werten in eine Tabelle ein.',
    details: 'Die Spaltenliste nach dem Tabellennamen legt fest, welcher Wert in welche Spalte kommt. Nicht genannte Spalten erhalten ihren `DEFAULT` oder `NULL`; ein automatisch vergebener Schlüssel (Identity/Auto-Increment) darf fehlen. Ohne Spaltenliste müssen alle Spalten in Tabellenreihenfolge angegeben werden, was bei späteren Schemaänderungen bricht. Verletzt ein Wert ein Constraint (`NOT NULL`, `UNIQUE`, `CHECK`), schlägt die ganze Anweisung fehl.',
    dialects: {
      std: {
        syntax: 'INSERT INTO tabelle (spalte1, spalte2, …)\nVALUES (wert1, wert2, …);',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL, stadt VARCHAR(50));

INSERT INTO kunden (id, name, stadt) VALUES (1, 'Müller GmbH', 'Berlin');
INSERT INTO kunden (id, stadt, name) VALUES (2, 'Hamburg', 'Schmidt AG');  -- Reihenfolge frei
INSERT INTO kunden (id, name) VALUES (3, 'Weber KG');                      -- stadt wird NULL

SELECT id, name, stadt FROM kunden ORDER BY id;
-- id | name        | stadt
-- 1  | Müller GmbH | Berlin
-- 2  | Schmidt AG  | Hamburg
-- 3  | Weber KG    | NULL
`)
      },
      mysql: { note: 'Zusätzlich gibt es die Form `INSERT INTO t SET spalte = wert, …`. Ohne strikten `sql_mode` werden ungültige Werte teils still angepasst statt abgelehnt.', mdn: MY + 'insert.html' },
      mssql: { note: 'Für Unicode-Text in `NVARCHAR`-Spalten Literale als `N\'…\'` schreiben. Werte für eine `IDENTITY`-Spalte sind nur nach `SET IDENTITY_INSERT t ON` erlaubt.', mdn: MS + 'statements/insert-transact-sql' },
      sqlite: { note: 'Typen sind nur Empfehlungen: Ein Text in einer `INTEGER`-Spalte wird ohne `STRICT`-Tabelle nicht abgelehnt.', mdn: SL + 'lang_insert.html' }
    },
    tip: 'Die Spaltenliste immer ausschreiben: Dann bleibt das INSERT gültig, wenn später Spalten hinzukommen oder sich die Reihenfolge ändert.',
    keywords: ['insert', 'einfügen', 'hinzufügen', 'neue zeile', 'datensatz anlegen', 'values', 'add row'],
    related: ['Mehrere Zeilen einfügen', 'INSERT mit DEFAULT', 'RETURNING', 'CREATE TABLE'],
    mdn: PG + 'sql-insert.html'
  },
  {
    lang: 'sql', group: 'Daten einfügen', name: 'Mehrere Zeilen einfügen',
    desc: 'Ein INSERT mit mehreren Wertetupeln fügt viele Zeilen auf einmal ein.',
    details: 'Nach `VALUES` folgen beliebig viele Klammern, durch Kommas getrennt. Das ist deutlich schneller als einzelne INSERTs, weil nur eine Anweisung geparst und übertragen wird, und es ist atomar: Scheitert eine Zeile, wird keine eingefügt. Alle verbreiteten Datenbanken unterstützen die Form.',
    dialects: {
      std: {
        syntax: 'INSERT INTO tabelle (spalte1, spalte2)\nVALUES (w1, w2),\n       (w3, w4),\n       …;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2), kategorie VARCHAR(30));

INSERT INTO produkte (id, name, preis, kategorie) VALUES
  (1, 'Tastatur', 49.50, 'Hardware'),
  (2, 'Maus',     19.50, 'Hardware'),
  (3, 'Editor',   89.00, 'Software');

SELECT COUNT(*) AS anzahl, SUM(preis) AS summe FROM produkte;
-- anzahl | summe
-- 3      | 158.00
`)
      },
      mssql: { note: 'Höchstens 1000 Wertetupel pro `VALUES`-Liste; für mehr mehrere Anweisungen, `INSERT … SELECT` oder `BULK INSERT` verwenden.', mdn: MS + 'queries/table-value-constructor-transact-sql' },
      sqlite: { note: 'Die Länge ist nur durch die maximale Anweisungslänge (`SQLITE_MAX_SQL_LENGTH`, Standard 1 MB) begrenzt.' }
    },
    tip: 'Für sehr große Datenmengen (Hunderttausende Zeilen) sind Bulk-Werkzeuge wie `COPY` oder `LOAD DATA` noch einmal um ein Vielfaches schneller.',
    keywords: ['mehrere zeilen', 'multi row insert', 'bulk insert', 'batch', 'values liste', 'massen einfügen'],
    related: ['INSERT INTO', 'INSERT … SELECT', 'Bulk-Import (COPY / LOAD DATA)'],
    mdn: PG + 'sql-insert.html'
  },
  {
    lang: 'sql', group: 'Daten einfügen', name: 'INSERT … SELECT',
    desc: 'Fügt das Ergebnis einer Abfrage als neue Zeilen in eine Tabelle ein.',
    details: 'Statt `VALUES` steht eine beliebige `SELECT`-Abfrage; ihre Spalten werden der Reihe nach den Zielspalten zugeordnet, die Namen spielen keine Rolle. Typisch für Archivierung, Datenübernahme oder das Befüllen von Hilfstabellen. Anzahl und Typen der Spalten müssen passen. Soll die Zieltabelle erst entstehen, ist `CREATE TABLE … AS SELECT` die kürzere Variante.',
    dialects: {
      std: {
        syntax: 'INSERT INTO ziel (spalte1, spalte2)\nSELECT a, b FROM quelle [WHERE …];',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag DECIMAL(10,2), datum DATE);
CREATE TABLE archiv (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen (id, kunde_id, betrag, datum) VALUES
  (1, 1, 120, '2025-03-14'), (2, 2, 80, '2025-11-02'),
  (3, 1, 45, '2026-01-20'), (4, 3, 300, '2026-02-08');

INSERT INTO archiv (id, kunde_id, betrag, datum)
SELECT id, kunde_id, betrag, datum
FROM bestellungen
WHERE datum < '2026-01-01';

SELECT id, betrag, datum FROM archiv ORDER BY id;
-- id | betrag | datum
-- 1  | 120.00 | 2025-03-14
-- 2  | 80.00  | 2025-11-02
`)
      },
      mssql: { note: 'Kein `CREATE TABLE … AS SELECT`; eine neue Tabelle aus einer Abfrage entsteht mit `SELECT … INTO neue_tabelle FROM …`.', mdn: MS + 'statements/insert-transact-sql' },
      sqlite: { note: 'Bei `INSERT … SELECT … ON CONFLICT` braucht das SELECT ein `WHERE true`, sonst liest der Parser `ON` als Join-Bedingung.' }
    },
    tip: 'Zum Verschieben (nicht nur Kopieren) INSERT … SELECT und das passende DELETE in eine Transaktion packen, damit keine Zeile verloren geht oder doppelt existiert.',
    keywords: ['insert select', 'kopieren', 'archivieren', 'daten übernehmen', 'insert from select', 'copy rows', 'select into'],
    related: ['INSERT INTO', 'CREATE TABLE AS', 'Transaktion', 'DELETE'],
    mdn: PG + 'sql-insert.html'
  },
  {
    lang: 'sql', group: 'Daten einfügen', name: 'INSERT mit DEFAULT',
    desc: 'Lässt Spalten weg oder nutzt DEFAULT, damit der Standardwert eingesetzt wird.',
    details: 'Spalten, die im INSERT fehlen, bekommen ihren `DEFAULT`-Wert aus der Tabellendefinition (sonst `NULL`). Das Schlüsselwort `DEFAULT` in der `VALUES`-Liste setzt den Standardwert ausdrücklich, `INSERT INTO t DEFAULT VALUES` legt eine Zeile nur aus Standardwerten an. Ein explizites `NULL` überschreibt den Default dagegen.',
    dialects: {
      std: {
        syntax: "INSERT INTO t (a) VALUES (1);            -- b bekommt DEFAULT\nINSERT INTO t (a, b) VALUES (1, DEFAULT);\nINSERT INTO t DEFAULT VALUES;",
        example: e(`
CREATE TABLE bestellungen (
  id     INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  betrag DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20)   NOT NULL DEFAULT 'offen'
);

INSERT INTO bestellungen (betrag) VALUES (99);                  -- status = 'offen'
INSERT INTO bestellungen (betrag, status) VALUES (15, DEFAULT);  -- ausdrücklich
INSERT INTO bestellungen DEFAULT VALUES;                        -- nur Standardwerte

SELECT id, betrag, status FROM bestellungen ORDER BY id;
-- id | betrag | status
-- 1  | 99.00  | offen
-- 2  | 15.00  | offen
-- 3  | 0.00   | offen
`)
      },
      mysql: {
        syntax: "INSERT INTO t (a) VALUES (1);\nINSERT INTO t (a, b) VALUES (1, DEFAULT);\nINSERT INTO t () VALUES ();",
        example: e(`
CREATE TABLE bestellungen (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  betrag DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20)   NOT NULL DEFAULT 'offen'
);

INSERT INTO bestellungen (betrag) VALUES (99);                  -- status = 'offen'
INSERT INTO bestellungen (betrag, status) VALUES (15, DEFAULT);  -- ausdrücklich
INSERT INTO bestellungen () VALUES ();                          -- nur Standardwerte

SELECT id, betrag, status FROM bestellungen ORDER BY id;
-- id | betrag | status
-- 1  | 99.00  | offen
-- 2  | 15.00  | offen
-- 3  | 0.00   | offen
`),
        note: 'Kein `DEFAULT VALUES`; eine Zeile nur aus Standardwerten entsteht mit `INSERT INTO t () VALUES ()`. `DEFAULT(spalte)` liefert den Standardwert auch in Ausdrücken.',
        mdn: MY + 'insert.html'
      },
      mssql: {
        example: e(`
CREATE TABLE bestellungen (
  id     INT IDENTITY(1,1) PRIMARY KEY,
  betrag DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20)   NOT NULL DEFAULT 'offen'
);

INSERT INTO bestellungen (betrag) VALUES (99);                  -- status = 'offen'
INSERT INTO bestellungen (betrag, status) VALUES (15, DEFAULT);  -- ausdrücklich
INSERT INTO bestellungen DEFAULT VALUES;                        -- nur Standardwerte

SELECT id, betrag, status FROM bestellungen ORDER BY id;
-- id | betrag | status
-- 1  | 99.00  | offen
-- 2  | 15.00  | offen
-- 3  | 0.00   | offen
`),
        mdn: MS + 'statements/insert-transact-sql'
      },
      sqlite: {
        syntax: "INSERT INTO t (a) VALUES (1);   -- b bekommt DEFAULT\nINSERT INTO t DEFAULT VALUES;",
        example: e(`
CREATE TABLE bestellungen (
  id     INTEGER PRIMARY KEY,
  betrag DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20)   NOT NULL DEFAULT 'offen'
);

INSERT INTO bestellungen (betrag) VALUES (99);   -- status = 'offen'
INSERT INTO bestellungen (betrag) VALUES (15);   -- DEFAULT in VALUES geht nicht
INSERT INTO bestellungen DEFAULT VALUES;         -- nur Standardwerte

SELECT id, betrag, status FROM bestellungen ORDER BY id;
-- id | betrag | status
-- 1  | 99     | offen
-- 2  | 15     | offen
-- 3  | 0      | offen
`),
        note: 'Das Schlüsselwort `DEFAULT` in der `VALUES`-Liste ist ein Syntaxfehler – die Spalte stattdessen weglassen.',
        mdn: SL + 'lang_insert.html'
      }
    },
    tip: 'Zeitstempel wie `erstellt_am` gehören als `DEFAULT CURRENT_TIMESTAMP` in die Tabelle, dann muss sie kein INSERT mehr selbst setzen.',
    keywords: ['default', 'standardwert', 'default values', 'vorgabewert', 'spalte weglassen'],
    related: ['DEFAULT', 'INSERT INTO', 'NOT NULL'],
    mdn: PG + 'sql-insert.html'
  },
  {
    lang: 'sql', group: 'Daten einfügen', name: 'ON CONFLICT (Upsert)',
    desc: 'Einfügen oder, falls der Schlüssel schon existiert, aktualisieren bzw. ignorieren.',
    details: 'Kollidiert ein INSERT mit einem `PRIMARY KEY` oder `UNIQUE`-Constraint, greift die Konfliktklausel: Die Zeile wird übersprungen oder die vorhandene Zeile geändert, wobei man auf den vorgeschlagenen neuen Wert zugreifen kann. Die Konfliktspalte(n) müssen einen eindeutigen Index haben. Das Ganze ist atomar und damit sicher gegen gleichzeitige Zugriffe – im Gegensatz zu „erst SELECT, dann INSERT oder UPDATE“.',
    dialects: {
      std: { none: 'Kein Upsert-INSERT im Standard; dafür gibt es `MERGE` (siehe dort).', mdn: PG + 'sql-merge.html' },
      pg: {
        syntax: 'INSERT INTO t (k, v) VALUES (…)\nON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v [WHERE …];\n… ON CONFLICT (k) DO NOTHING;',
        example: e(`
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER NOT NULL);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10), ('Tastatur', 5);

-- Wareneingang: vorhandene Menge erhöhen, neues Produkt anlegen
INSERT INTO lager (produkt, menge) VALUES ('Maus', 3), ('Monitor', 2)
ON CONFLICT (produkt) DO UPDATE SET menge = lager.menge + EXCLUDED.menge;

-- Nur einfügen, wenn noch nicht vorhanden
INSERT INTO lager (produkt, menge) VALUES ('Tastatur', 99)
ON CONFLICT (produkt) DO NOTHING;

SELECT produkt, menge FROM lager ORDER BY produkt;
-- produkt  | menge
-- Maus     | 13
-- Monitor  | 2
-- Tastatur | 5
`),
        note: 'Seit PostgreSQL 9.5. Statt der Spaltenliste geht auch `ON CONFLICT ON CONSTRAINT name`.',
        mdn: PG + 'sql-insert.html#SQL-ON-CONFLICT'
      },
      mysql: {
        syntax: 'INSERT INTO t (k, v) VALUES (…) AS neu\nON DUPLICATE KEY UPDATE v = neu.v;',
        example: e(`
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER NOT NULL);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10), ('Tastatur', 5);

-- Wareneingang: vorhandene Menge erhöhen, neues Produkt anlegen
INSERT INTO lager (produkt, menge) VALUES ('Maus', 3), ('Monitor', 2) AS neu
ON DUPLICATE KEY UPDATE menge = lager.menge + neu.menge;

-- Nur einfügen, wenn noch nicht vorhanden (Zuweisung ohne Wirkung)
INSERT INTO lager (produkt, menge) VALUES ('Tastatur', 99)
ON DUPLICATE KEY UPDATE produkt = produkt;

SELECT produkt, menge FROM lager ORDER BY produkt;
-- produkt  | menge
-- Maus     | 13
-- Monitor  | 2
-- Tastatur | 5
`),
        note: 'Greift bei jedem verletzten `PRIMARY KEY`/`UNIQUE`, eine Konfliktspalte gibt man nicht an. Der Alias `AS neu` gilt seit 8.0.19; die ältere Form `VALUES(menge)` ist veraltet.',
        mdn: MY + 'insert-on-duplicate.html'
      },
      mssql: { none: 'Kein Upsert-INSERT; stattdessen `MERGE … WITH (HOLDLOCK)` oder `UPDATE` und bei `@@ROWCOUNT = 0` ein `INSERT` in einer Transaktion.', mdn: MS + 'statements/merge-transact-sql' },
      sqlite: {
        syntax: 'INSERT INTO t (k, v) VALUES (…)\nON CONFLICT (k) DO UPDATE SET v = excluded.v [WHERE …];\n… ON CONFLICT (k) DO NOTHING;',
        example: e(`
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER NOT NULL);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10), ('Tastatur', 5);

-- Wareneingang: vorhandene Menge erhöhen, neues Produkt anlegen
INSERT INTO lager (produkt, menge) VALUES ('Maus', 3), ('Monitor', 2)
ON CONFLICT (produkt) DO UPDATE SET menge = lager.menge + excluded.menge;

-- Nur einfügen, wenn noch nicht vorhanden
INSERT INTO lager (produkt, menge) VALUES ('Tastatur', 99)
ON CONFLICT (produkt) DO NOTHING;

SELECT produkt, menge FROM lager ORDER BY produkt;
-- produkt  | menge
-- Maus     | 13
-- Monitor  | 2
-- Tastatur | 5
`),
        note: 'Seit SQLite 3.24, gleiche Syntax wie PostgreSQL. Bei `INSERT … SELECT … ON CONFLICT` braucht das SELECT ein `WHERE true`.',
        mdn: SL + 'lang_upsert.html'
      }
    },
    tip: 'Die alte Lösung „SELECT, dann INSERT oder UPDATE“ ist nicht sicher: Zwei Sitzungen sehen gleichzeitig „nicht vorhanden“ und fügen beide ein.',
    keywords: ['upsert', 'on conflict', 'do update', 'do nothing', 'excluded', 'on duplicate key update', 'insert or update', 'einfügen oder aktualisieren'],
    related: ['INSERT OR REPLACE / INSERT IGNORE', 'MERGE', 'UNIQUE', 'PRIMARY KEY'],
    mdn: PG + 'sql-insert.html'
  },
  {
    lang: 'sql', group: 'Daten einfügen', name: 'INSERT OR REPLACE / INSERT IGNORE',
    desc: 'Dialekt-Kurzformen: bei Schlüsselkonflikt die alte Zeile ersetzen oder überspringen.',
    details: 'Die „Ignore“-Form verwirft Zeilen, die ein Constraint verletzen, ohne Fehler. Die „Replace“-Form löscht die kollidierende Zeile und fügt die neue ein. Fallstrick: Beim Ersetzen werden nicht angegebene Spalten auf Default bzw. `NULL` gesetzt, und Delete-Trigger oder `ON DELETE CASCADE` können auslösen. Genauer ist ein Upsert, der nur einzelne Spalten ändert.',
    values: [
      ['IGNORE', 'Konfliktzeile still überspringen'],
      ['REPLACE', 'alte Zeile löschen, neue einfügen']
    ],
    dialects: {
      std: { none: 'Nicht im Standard; dort `MERGE` mit `WHEN MATCHED THEN UPDATE` bzw. nur `WHEN NOT MATCHED THEN INSERT`.' },
      pg: { none: 'Keine Kurzform; überspringen mit `INSERT … ON CONFLICT DO NOTHING`, ersetzen mit `ON CONFLICT (k) DO UPDATE SET …`.', mdn: PG + 'sql-insert.html#SQL-ON-CONFLICT' },
      mysql: {
        syntax: 'INSERT IGNORE INTO t …;   -- Konfliktzeile überspringen\nREPLACE INTO t …;         -- alte Zeile löschen, neue einfügen',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden (id, name, stadt) VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Hamburg');

INSERT IGNORE INTO kunden (id, name) VALUES (1, 'Doppelt');   -- übersprungen (Warnung)
REPLACE INTO kunden (id, name) VALUES (2, 'Schmidt AG');      -- ersetzt!

-- stadt von Schmidt AG ist jetzt weg:
SELECT id, name, stadt FROM kunden ORDER BY id;
-- id | name       | stadt
-- 1  | Müller     | Berlin
-- 2  | Schmidt AG | NULL
`),
        note: '`INSERT IGNORE` macht auch andere Fehler (z. B. zu lange Werte) zu Warnungen – `SHOW WARNINGS` zeigt sie.',
        mdn: MY + 'replace.html'
      },
      mssql: { none: 'Keine Kurzform; `MERGE` verwenden oder einen Index mit `IGNORE_DUP_KEY = ON` anlegen, der doppelte Schlüssel beim INSERT verwirft.', mdn: MS + 'statements/merge-transact-sql' },
      sqlite: {
        syntax: 'INSERT OR IGNORE INTO t …;\nINSERT OR REPLACE INTO t …;   -- auch: REPLACE INTO t …',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden (id, name, stadt) VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Hamburg');

INSERT OR IGNORE INTO kunden (id, name) VALUES (1, 'Doppelt');     -- übersprungen
INSERT OR REPLACE INTO kunden (id, name) VALUES (2, 'Schmidt AG');  -- ersetzt!

-- stadt von Schmidt AG ist jetzt weg:
SELECT id, name, stadt FROM kunden ORDER BY id;
-- id | name       | stadt
-- 1  | Müller     | Berlin
-- 2  | Schmidt AG | NULL
`),
        note: 'Weitere Konfliktstrategien: `OR ABORT` (Standard: Anweisung zurückrollen), `OR FAIL` (bisherige Zeilen behalten), `OR ROLLBACK` (ganze Transaktion zurückrollen).',
        mdn: SL + 'lang_conflict.html'
      }
    },
    tip: 'Wer nur einzelne Spalten aktualisieren will, nimmt einen Upsert (`ON CONFLICT … DO UPDATE`, `ON DUPLICATE KEY UPDATE`) statt REPLACE – sonst gehen die übrigen Spalten verloren.',
    keywords: ['insert or replace', 'insert or ignore', 'insert ignore', 'replace into', 'konflikt', 'duplikat ignorieren', 'sqlite', 'mysql', 'ignore_dup_key'],
    related: ['ON CONFLICT (Upsert)', 'MERGE', 'UNIQUE'],
    mdn: SL + 'lang_conflict.html'
  },
  {
    lang: 'sql', group: 'Daten einfügen', name: 'RETURNING',
    desc: 'Gibt die eingefügten, geänderten oder gelöschten Zeilen direkt zurück.',
    details: 'Eine Rückgabeklausel an INSERT, UPDATE oder DELETE liefert ein Ergebnis wie ein SELECT, etwa die neu vergebene ID oder berechnete Defaults. Das spart eine zweite Abfrage und ist auch bei mehreren Zeilen eindeutig. Die Reihenfolge der zurückgegebenen Zeilen ist nicht garantiert.',
    dialects: {
      std: { none: 'Nicht im Standard (dort nur das kaum verbreitete `SELECT … FROM FINAL TABLE (INSERT …)`); ohne Rückgabeklausel die Werte mit einem zweiten SELECT lesen.' },
      pg: {
        syntax: 'INSERT INTO t (…) VALUES (…) RETURNING spalte1, …;\nUPDATE t SET … WHERE … RETURNING *;\nDELETE FROM t WHERE … RETURNING *;',
        example: e(`
CREATE TABLE bestellungen (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kunde_id INTEGER, betrag DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'offen'
);

INSERT INTO bestellungen (kunde_id, betrag) VALUES (7, 120), (9, 45)
RETURNING id, status;
-- id | status
-- 1  | offen
-- 2  | offen

DELETE FROM bestellungen WHERE betrag < 100 RETURNING id, betrag;
-- id | betrag
-- 2  | 45.00
`),
        note: 'Seit PostgreSQL 18 auch `RETURNING OLD.spalte, NEW.spalte` für Werte vor und nach der Änderung.',
        mdn: PG + 'dml-returning.html'
      },
      mysql: { none: 'Kein RETURNING; nach dem INSERT liefert `SELECT LAST_INSERT_ID()` die zuerst vergebene ID der Verbindung, sonst ein zweites SELECT.', mdn: MY + 'information-functions.html#function_last-insert-id' },
      mssql: {
        syntax: 'INSERT INTO t (…) OUTPUT inserted.id, … VALUES (…);\nUPDATE t SET … OUTPUT deleted.x, inserted.x WHERE …;\nDELETE FROM t OUTPUT deleted.* WHERE …;',
        example: e(`
CREATE TABLE bestellungen (
  id INT IDENTITY(1,1) PRIMARY KEY,
  kunde_id INT, betrag DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'offen'
);

INSERT INTO bestellungen (kunde_id, betrag)
OUTPUT inserted.id, inserted.status
VALUES (7, 120), (9, 45);
-- id | status
-- 1  | offen
-- 2  | offen

DELETE FROM bestellungen OUTPUT deleted.id, deleted.betrag WHERE betrag < 100;
-- id | betrag
-- 2  | 45.00
`),
        note: '`OUTPUT` steht vor `VALUES` bzw. `WHERE`; `inserted` enthält die neuen, `deleted` die alten Werte. Hat die Tabelle Trigger, braucht es `OUTPUT … INTO @tabellenvariable`.',
        mdn: MS + 'queries/output-clause-transact-sql'
      },
      sqlite: {
        syntax: 'INSERT INTO t (…) VALUES (…) RETURNING spalte1, …;\nUPDATE t SET … WHERE … RETURNING *;\nDELETE FROM t WHERE … RETURNING *;',
        example: e(`
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER, betrag DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'offen'
);

INSERT INTO bestellungen (kunde_id, betrag) VALUES (7, 120), (9, 45)
RETURNING id, status;
-- id | status
-- 1  | offen
-- 2  | offen

DELETE FROM bestellungen WHERE betrag < 100 RETURNING id, betrag;
-- id | betrag
-- 2  | 45
`),
        note: 'Seit SQLite 3.35. Für eine einzelne Zeile gibt es auch `last_insert_rowid()`.',
        mdn: SL + 'lang_returning.html'
      }
    },
    tip: 'Bei mehreren eingefügten Zeilen die Zuordnung über einen fachlichen Schlüssel herstellen, nicht über die Position im Ergebnis.',
    keywords: ['returning', 'output', 'neue id', 'generierte id', 'last insert id', 'zurückgeben', 'inserted', 'deleted', 'last_insert_id'],
    related: ['INSERT INTO', 'Auto-Increment', 'UPDATE', 'DELETE'],
    mdn: PG + 'dml-returning.html'
  },
  {
    lang: 'sql', group: 'Daten einfügen', name: 'Bulk-Import (COPY / LOAD DATA)',
    desc: 'Lädt große Datenmengen aus Dateien (CSV) besonders schnell in eine Tabelle.',
    details: 'Für Millionen Zeilen sind einzelne INSERTs zu langsam. Jede Datenbank hat dafür einen eigenen Ladebefehl oder ein Werkzeug, das eine Datei (meist CSV) direkt einliest. Wichtig ist, ob die Datei auf dem Server oder auf dem Client liegt. Indizes und Trigger bremsen; bei der Erstbefüllung erst laden, dann Indizes anlegen.',
    dialects: {
      std: { none: 'Kein Standard; jede Datenbank hat einen eigenen Ladebefehl (siehe die Dialekt-Tabs), portabel bleibt nur `INSERT` mit mehreren Zeilen.' },
      pg: {
        syntax: "COPY tabelle (spalten) FROM '/pfad/datei.csv' WITH (FORMAT csv, HEADER);\n\\copy tabelle FROM 'datei.csv' CSV HEADER   -- psql, Datei auf dem Client",
        example: e(`
COPY kunden (id, name, stadt)
FROM '/var/lib/import/kunden.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');

-- Export geht genauso
COPY (SELECT id, name FROM kunden WHERE stadt = 'Berlin')
TO '/var/lib/export/berlin.csv' WITH (FORMAT csv, HEADER);
`),
        nocheck: true,
        note: '`COPY … FROM \'datei\'` liest auf dem Server und braucht die Rolle `pg_read_server_files`; `\\copy` in psql liest die Datei auf dem Client.',
        mdn: PG + 'sql-copy.html'
      },
      mysql: {
        syntax: "LOAD DATA [LOCAL] INFILE 'datei.csv' INTO TABLE tabelle\nFIELDS TERMINATED BY ',' ENCLOSED BY '\"'\nIGNORE 1 LINES;",
        example: e(`
LOAD DATA LOCAL INFILE 'kunden.csv'
INTO TABLE kunden
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\\n'
IGNORE 1 LINES
(id, name, stadt);
`),
        nocheck: true,
        note: '`LOCAL` liest auf dem Client und muss auf Server (`local_infile = ON`) und Client erlaubt sein; ohne `LOCAL` gilt `secure_file_priv`.',
        mdn: MY + 'load-data.html'
      },
      mssql: {
        syntax: "BULK INSERT tabelle FROM 'C:\\pfad\\datei.csv'\nWITH (FORMAT = 'CSV', FIRSTROW = 2);",
        example: e(`
BULK INSERT kunden
FROM '/var/opt/mssql/import/kunden.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 2, FIELDTERMINATOR = ',', CODEPAGE = '65001');
`),
        nocheck: true,
        note: 'Der Pfad wird auf dem Server gelesen. Vom Client aus lädt das Werkzeug `bcp` (`bcp kunden in kunden.csv -c -t,`).',
        mdn: MS + 'statements/bulk-insert-transact-sql'
      },
      sqlite: {
        syntax: 'sqlite3 shop.db ".import --csv --skip 1 datei.csv tabelle"',
        example: e(`
# in der sqlite3-Shell: CSV in eine Tabelle laden (--skip 1 überspringt die Kopfzeile)
sqlite3 shop.db ".import --csv --skip 1 kunden.csv kunden"

# existiert die Tabelle noch nicht, legt .import sie aus der Kopfzeile an
sqlite3 shop.db ".import --csv kunden.csv kunden_neu"
`),
        exampleLang: 'sh',
        note: '`.import` ist ein Befehl der Kommandozeile `sqlite3`, kein SQL; aus Programmen lädt man mit `executemany` in einer Transaktion.',
        mdn: SL + 'cli.html'
      }
    },
    tip: 'Erst in eine Staging-Tabelle ohne Constraints laden, prüfen und dann per `INSERT … SELECT` übernehmen – so bricht eine fehlerhafte Zeile nicht den ganzen Import ab.',
    keywords: ['copy', 'load data infile', 'bulk insert', 'csv import', 'import', 'massenimport', 'bcp', '.import'],
    related: ['Mehrere Zeilen einfügen', 'INSERT … SELECT', 'Backup & Export'],
    mdn: PG + 'sql-copy.html'
  },

  // ---------------- Daten ändern & löschen ----------------
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'UPDATE',
    desc: 'Ändert Spaltenwerte in allen Zeilen, die die WHERE-Bedingung erfüllen.',
    details: '`SET` weist einer oder mehreren Spalten neue Werte zu; rechts dürfen Ausdrücke mit den alten Werten stehen (`gehalt = gehalt + 200`). Laut Standard sehen alle Zuweisungen die Werte vor dem Update, die Reihenfolge in `SET` spielt also keine Rolle. Ohne `WHERE` wird jede Zeile geändert – der klassische Fehler.',
    dialects: {
      std: {
        syntax: 'UPDATE tabelle\nSET spalte1 = ausdruck1 [, spalte2 = ausdruck2 …]\n[WHERE bedingung];',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30), gehalt INTEGER);
INSERT INTO mitarbeiter (id, name, abteilung, gehalt) VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Lin', 'IT', 4800),
  (3, 'Max', 'Vertrieb', 3900), (4, 'Eva', 'Vertrieb', 4100);

UPDATE mitarbeiter
SET gehalt = gehalt + 200, abteilung = 'Entwicklung'
WHERE abteilung = 'IT';

SELECT name, abteilung, gehalt FROM mitarbeiter ORDER BY id;
-- name | abteilung   | gehalt
-- Ada  | Entwicklung | 5400
-- Lin  | Entwicklung | 5000
-- Max  | Vertrieb    | 3900
-- Eva  | Vertrieb    | 4100
`)
      },
      mysql: { note: 'MySQL wertet `SET` von links nach rechts aus: Eine spätere Zuweisung sieht bereits den neuen Wert einer früheren. `UPDATE … ORDER BY … LIMIT n` begrenzt die Anzahl geänderter Zeilen.', mdn: MY + 'update.html' },
      mssql: { note: '`UPDATE TOP (n)` begrenzt die Anzahl geänderter Zeilen (ohne festgelegte Reihenfolge).', mdn: MS + 'queries/update-transact-sql' },
      sqlite: { mdn: SL + 'lang_update.html', note: 'Mit der Compile-Option `SQLITE_ENABLE_UPDATE_DELETE_LIMIT` gibt es auch `UPDATE … ORDER BY … LIMIT n`.' }
    },
    tip: 'Vor dem UPDATE dieselbe WHERE-Bedingung als `SELECT` laufen lassen und prüfen, ob die richtigen Zeilen getroffen werden.',
    keywords: ['update', 'ändern', 'aktualisieren', 'set', 'bearbeiten', 'modify', 'werte ändern'],
    related: ['UPDATE mit CASE', 'UPDATE mit Unterabfrage', 'UPDATE … FROM (Join)', 'Sicheres UPDATE / DELETE'],
    mdn: PG + 'sql-update.html'
  },
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'UPDATE mit CASE',
    desc: 'Setzt je nach Bedingung unterschiedliche Werte in einer einzigen UPDATE-Anweisung.',
    details: 'Ein `CASE`-Ausdruck in `SET` erlaubt verschiedene Änderungen für verschiedene Zeilen, ohne mehrere UPDATEs nacheinander. Das ist nicht nur schneller, sondern vermeidet auch Fehler, bei denen ein zweites UPDATE die Ergebnisse des ersten erneut trifft. Ein `ELSE` nicht vergessen, sonst werden nicht erfasste Zeilen auf `NULL` gesetzt.',
    dialects: {
      std: {
        syntax: 'UPDATE t SET spalte = CASE\n  WHEN bed1 THEN wert1\n  WHEN bed2 THEN wert2\n  ELSE spalte\nEND\n[WHERE …];',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER, kategorie VARCHAR(30));
INSERT INTO produkte (id, name, preis, kategorie) VALUES
  (1, 'Tastatur', 50, 'Hardware'), (2, 'Editor', 90, 'Software'),
  (3, 'Kabel', 10, 'Zubehör'), (4, 'Maus', 20, 'Hardware');

-- Hardware +10 %, Software -20 %, Rest unverändert
UPDATE produkte SET preis = CASE kategorie
  WHEN 'Hardware' THEN preis * 110 / 100
  WHEN 'Software' THEN preis * 80 / 100
  ELSE preis
END;

SELECT name, preis FROM produkte ORDER BY id;
-- name     | preis
-- Tastatur | 55
-- Editor   | 72
-- Kabel    | 10
-- Maus     | 22
`)
      },
      mysql: { note: 'Zwei Werte tauschen mit `SET a = b, b = a` klappt hier nicht, weil `SET` von links nach rechts auswertet – beide Spalten hätten danach den Wert von `b`.' }
    },
    tip: 'Zwei Werte tauschen geht mit einem einzigen UPDATE: `SET a = b, b = a` – alle Zuweisungen sehen die alten Werte.',
    keywords: ['update case', 'bedingtes update', 'conditional update', 'mehrere werte', 'fallunterscheidung'],
    related: ['UPDATE', 'CASE', 'Einfaches CASE'],
    mdn: PG + 'functions-conditional.html'
  },
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'UPDATE mit Unterabfrage',
    desc: 'Berechnet den neuen Wert oder die zu ändernden Zeilen über eine Unterabfrage.',
    details: 'Eine skalare Unterabfrage in `SET` kann sich auf die gerade geänderte Zeile beziehen (korreliert) und so Werte aus anderen Tabellen übernehmen. In `WHERE` schränken `IN` oder `EXISTS` die Zeilen ein. Liefert die Unterabfrage keine Zeile, wird der Wert `NULL` – daher oft `COALESCE`.',
    dialects: {
      std: {
        syntax: 'UPDATE t SET spalte = (SELECT … FROM u WHERE u.x = t.x)\n[WHERE t.y IN (SELECT …)];',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), umsatz INTEGER);
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag INTEGER);
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber');
INSERT INTO bestellungen (id, kunde_id, betrag) VALUES (1, 1, 120), (2, 1, 80), (3, 2, 45);

UPDATE kunden
SET umsatz = COALESCE((SELECT SUM(b.betrag)
                       FROM bestellungen AS b
                       WHERE b.kunde_id = kunden.id), 0);

SELECT name, umsatz FROM kunden ORDER BY id;
-- name    | umsatz
-- Müller  | 200
-- Schmidt | 45
-- Weber   | 0
`)
      },
      mysql: { note: 'Eine Unterabfrage auf die Zieltabelle selbst ist verboten (Fehler 1093); dann die Unterabfrage in eine abgeleitete Tabelle verpacken: `WHERE id IN (SELECT id FROM (SELECT …) AS x)`.', mdn: MY + 'update.html' }
    },
    tip: 'Bei vielen Zeilen ist ein UPDATE mit Join auf eine vorab aggregierte Quelle meist schneller als eine korrelierte Unterabfrage pro Zeile.',
    keywords: ['update subquery', 'unterabfrage', 'korreliert', 'werte übernehmen', 'update aus anderer tabelle'],
    related: ['UPDATE … FROM (Join)', 'Korrelierte Unterabfrage', 'Skalare Unterabfrage', 'COALESCE()'],
    mdn: PG + 'sql-update.html'
  },
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'UPDATE … FROM (Join)',
    desc: 'Aktualisiert Zeilen mit Werten aus einer anderen Tabelle über eine Join-Bedingung.',
    details: 'Statt einer Unterabfrage pro Spalte wird die Quelle mit der Zieltabelle verknüpft und ihre Spalten stehen in `SET` zur Verfügung. Die Syntax ist stark dialektabhängig. Trifft eine Zielzeile mehrere Quellzeilen, ist das Ergebnis unbestimmt – die Quelle sollte pro Schlüssel nur eine Zeile liefern.',
    dialects: {
      std: { none: 'Kein UPDATE mit Join im Standard; dort `MERGE … WHEN MATCHED THEN UPDATE` oder eine korrelierte Unterabfrage in `SET`.', mdn: PG + 'sql-merge.html' },
      pg: {
        syntax: 'UPDATE ziel\nSET spalte = q.wert\nFROM quelle AS q\nWHERE q.id = ziel.id;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER);
CREATE TABLE neue_preise (id INTEGER PRIMARY KEY, preis INTEGER);
INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20), (3, 'Monitor', 180);
INSERT INTO neue_preise (id, preis) VALUES (1, 45), (3, 199);

UPDATE produkte
SET preis = n.preis
FROM neue_preise AS n
WHERE n.id = produkte.id;

SELECT name, preis FROM produkte ORDER BY id;
-- name     | preis
-- Tastatur | 45
-- Maus     | 20
-- Monitor  | 199
`),
        note: 'Die Zieltabelle nicht noch einmal in `FROM` aufführen – das erzeugt einen ungewollten Cross Join mit sich selbst.',
        mdn: PG + 'sql-update.html'
      },
      mysql: {
        syntax: 'UPDATE ziel\nJOIN quelle AS q ON q.id = ziel.id\nSET ziel.spalte = q.wert;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER);
CREATE TABLE neue_preise (id INTEGER PRIMARY KEY, preis INTEGER);
INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20), (3, 'Monitor', 180);
INSERT INTO neue_preise (id, preis) VALUES (1, 45), (3, 199);

UPDATE produkte AS p
JOIN neue_preise AS n ON n.id = p.id
SET p.preis = n.preis;

SELECT name, preis FROM produkte ORDER BY id;
-- name     | preis
-- Tastatur | 45
-- Maus     | 20
-- Monitor  | 199
`),
        note: 'Ein Multi-Table-UPDATE kann auch Spalten mehrerer Tabellen zugleich setzen, erlaubt aber kein `ORDER BY` und kein `LIMIT`.',
        mdn: MY + 'update.html'
      },
      mssql: {
        syntax: 'UPDATE z\nSET z.spalte = q.wert\nFROM ziel AS z\nJOIN quelle AS q ON q.id = z.id;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER);
CREATE TABLE neue_preise (id INTEGER PRIMARY KEY, preis INTEGER);
INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20), (3, 'Monitor', 180);
INSERT INTO neue_preise (id, preis) VALUES (1, 45), (3, 199);

UPDATE p
SET p.preis = n.preis
FROM produkte AS p
JOIN neue_preise AS n ON n.id = p.id;

SELECT name, preis FROM produkte ORDER BY id;
-- name     | preis
-- Tastatur | 45
-- Maus     | 20
-- Monitor  | 199
`),
        note: 'Nach `UPDATE` steht der Alias aus der `FROM`-Klausel; die Zieltabelle wird dort mit aufgeführt.',
        mdn: MS + 'queries/update-transact-sql'
      },
      sqlite: {
        syntax: 'UPDATE ziel\nSET spalte = q.wert\nFROM quelle AS q\nWHERE q.id = ziel.id;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER);
CREATE TABLE neue_preise (id INTEGER PRIMARY KEY, preis INTEGER);
INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20), (3, 'Monitor', 180);
INSERT INTO neue_preise (id, preis) VALUES (1, 45), (3, 199);

UPDATE produkte
SET preis = n.preis
FROM neue_preise AS n
WHERE n.id = produkte.id;

SELECT name, preis FROM produkte ORDER BY id;
-- name     | preis
-- Tastatur | 45
-- Maus     | 20
-- Monitor  | 199
`),
        note: 'Seit SQLite 3.33, Syntax wie PostgreSQL.',
        mdn: SL + 'lang_update.html'
      }
    },
    tip: 'Vorher prüfen, ob die Quelle pro Schlüssel eindeutig ist (`GROUP BY id HAVING COUNT(*) > 1`) – sonst gewinnt eine zufällige Quellzeile.',
    keywords: ['update join', 'update from', 'update mit join', 'werte aus anderer tabelle', 'mysql update join'],
    related: ['UPDATE mit Unterabfrage', 'MERGE', 'INNER JOIN'],
    mdn: PG + 'sql-update.html'
  },
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'DELETE',
    desc: 'Löscht alle Zeilen einer Tabelle, die die WHERE-Bedingung erfüllen.',
    details: 'Ohne `WHERE` werden alle Zeilen gelöscht, die Tabelle selbst bleibt bestehen (anders als `DROP TABLE`). Fremdschlüssel können das Löschen verhindern oder per `ON DELETE CASCADE` abhängige Zeilen mitlöschen. DELETE ist transaktional und löst Trigger aus; bei sehr vielen Zeilen ist es langsam und erzeugt viel Log – dann `TRUNCATE` oder Löschen in Portionen.',
    dialects: {
      std: {
        syntax: 'DELETE FROM tabelle\n[WHERE bedingung];',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag INTEGER, datum DATE);
INSERT INTO bestellungen (id, kunde_id, betrag, datum) VALUES
  (1, 1, 120, '2024-12-01'), (2, 2, 80, '2025-06-10'),
  (3, 1, 45, '2026-01-20'), (4, 3, 300, '2026-02-08');

DELETE FROM bestellungen WHERE datum < '2025-01-01';

SELECT id, datum FROM bestellungen ORDER BY id;
-- id | datum
-- 2  | 2025-06-10
-- 3  | 2026-01-20
-- 4  | 2026-02-08
`)
      },
      mysql: { note: '`DELETE … ORDER BY … LIMIT n` löscht in Portionen; mit `--safe-updates` wird DELETE ohne Schlüsselbedingung abgelehnt.', mdn: MY + 'delete.html' },
      mssql: { note: 'In Portionen löschen mit `DELETE TOP (10000) FROM t WHERE …` in einer Schleife.', mdn: MS + 'statements/delete-transact-sql' },
      sqlite: { note: 'Fremdschlüssel (auch `ON DELETE CASCADE`) wirken nur nach `PRAGMA foreign_keys = ON`.', mdn: SL + 'lang_delete.html' }
    },
    tip: 'Große Löschungen in Portionen aufteilen (z. B. 10 000 Zeilen pro Durchlauf), damit Sperren und Transaktionslog klein bleiben.',
    keywords: ['delete', 'löschen', 'entfernen', 'zeilen löschen', 'remove rows', 'delete from'],
    related: ['DELETE mit Unterabfrage', 'TRUNCATE', 'Soft Delete', 'ON DELETE / ON UPDATE'],
    mdn: PG + 'sql-delete.html'
  },
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'DELETE mit Unterabfrage',
    desc: 'Löscht Zeilen abhängig von Daten in einer anderen Tabelle.',
    details: 'Mit `IN`, `EXISTS` oder `NOT EXISTS` im `WHERE` lassen sich Zeilen anhand anderer Tabellen auswählen, z. B. Kunden ohne Bestellungen. Diese Form ist portabel; einige Dialekte erlauben zusätzlich eine Join-Syntax beim Löschen. Vorsicht mit `NOT IN`, wenn die Unterabfrage `NULL` liefern kann – dann wird gar nichts gelöscht.',
    dialects: {
      std: {
        syntax: 'DELETE FROM t\nWHERE [NOT] EXISTS (SELECT 1 FROM u WHERE u.t_id = t.id);',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER);
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber'), (4, 'Koch');
INSERT INTO bestellungen (id, kunde_id) VALUES (1, 1), (2, 1), (3, 3);

-- Kunden ohne Bestellungen entfernen
DELETE FROM kunden
WHERE NOT EXISTS (SELECT 1 FROM bestellungen AS b WHERE b.kunde_id = kunden.id);

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 3  | Weber
`)
      },
      pg: { note: 'Join-Form: `DELETE FROM t USING u WHERE u.t_id = t.id` (nur als innerer Join; für „ohne Treffer“ bleibt `NOT EXISTS`).', mdn: PG + 'sql-delete.html' },
      mysql: { note: 'Join-Form: `DELETE k FROM kunden AS k LEFT JOIN bestellungen AS b ON b.kunde_id = k.id WHERE b.id IS NULL`. Eine Unterabfrage auf die Zieltabelle selbst ist verboten (Fehler 1093).', mdn: MY + 'delete.html' },
      mssql: { note: 'Join-Form: `DELETE k FROM kunden AS k LEFT JOIN bestellungen AS b ON b.kunde_id = k.id WHERE b.id IS NULL`.', mdn: MS + 'statements/delete-transact-sql' },
      sqlite: { note: 'Keine Join-Form beim Löschen; nur Unterabfragen in `WHERE`.' }
    },
    tip: '`NOT EXISTS` ist gegenüber `NOT IN` die sichere Wahl, weil ein einziges `NULL` in der Unterabfrage `NOT IN` komplett aushebelt.',
    keywords: ['delete subquery', 'delete join', 'delete using', 'löschen mit bedingung', 'not exists'],
    related: ['DELETE', 'NOT EXISTS', 'NOT IN und NULL', 'Anti-Join'],
    mdn: PG + 'sql-delete.html'
  },
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'TRUNCATE',
    desc: 'Leert eine Tabelle komplett und sehr schnell, ohne einzelne Zeilen zu löschen.',
    details: '`TRUNCATE` gibt die Datenseiten auf einmal frei, statt Zeile für Zeile zu löschen – daher viel schneller als `DELETE` ohne WHERE. Es löst keine Zeilen-Trigger aus und braucht eine exklusive Sperre auf die Tabelle. Fremdschlüssel, die auf die Tabelle zeigen, verhindern es meist. Ob es transaktional ist und Zähler zurücksetzt, hängt vom Dialekt ab.',
    dialects: {
      std: {
        syntax: 'TRUNCATE TABLE tabelle [CONTINUE IDENTITY | RESTART IDENTITY];',
        example: e(`
CREATE TABLE import_staging (id INTEGER PRIMARY KEY, wert VARCHAR(50));
INSERT INTO import_staging (id, wert) VALUES (1, 'a'), (2, 'b'), (3, 'c');

TRUNCATE TABLE import_staging;

SELECT COUNT(*) AS anzahl FROM import_staging;
-- anzahl
-- 0
`)
      },
      pg: {
        syntax: 'TRUNCATE [TABLE] tabelle [, …] [RESTART IDENTITY] [CASCADE];',
        example: e(`
CREATE TABLE bestellungen (id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, betrag INTEGER);
CREATE TABLE bestellpositionen (
  id INTEGER PRIMARY KEY,
  bestellung_id INTEGER REFERENCES bestellungen (id)
);
INSERT INTO bestellungen (betrag) VALUES (120), (80);
INSERT INTO bestellpositionen (id, bestellung_id) VALUES (1, 1), (2, 2);

-- CASCADE leert auch die referenzierende Tabelle, RESTART IDENTITY setzt den Zähler zurück
TRUNCATE bestellungen RESTART IDENTITY CASCADE;

INSERT INTO bestellungen (betrag) VALUES (45);
SELECT id, betrag FROM bestellungen;
-- id | betrag
-- 1  | 45
SELECT COUNT(*) AS positionen FROM bestellpositionen;
-- positionen
-- 0
`),
        note: 'Transaktional: Ein `ROLLBACK` holt die Daten zurück. Braucht das eigene Recht `TRUNCATE`.',
        mdn: PG + 'sql-truncate.html'
      },
      mysql: { note: 'DDL mit implizitem `COMMIT` – kein Zurückrollen möglich. Setzt `AUTO_INCREMENT` immer zurück; scheitert, wenn ein Fremdschlüssel auf die Tabelle zeigt.', mdn: MY + 'truncate-table.html' },
      mssql: { note: 'Transaktional (lässt sich in `BEGIN TRANSACTION` zurückrollen) und setzt `IDENTITY` zurück. Nicht erlaubt, wenn ein Fremdschlüssel auf die Tabelle zeigt.', mdn: MS + 'statements/truncate-table-transact-sql' },
      sqlite: { none: 'Kein TRUNCATE; `DELETE FROM t;` ohne WHERE wird intern ähnlich schnell ausgeführt (Truncate-Optimierung, solange keine Trigger existieren).', mdn: SL + 'lang_delete.html' }
    },
    tip: 'TRUNCATE holt eine exklusive Tabellensperre – im laufenden Betrieb blockiert es alle Leser und Schreiber dieser Tabelle.',
    keywords: ['truncate', 'tabelle leeren', 'alle zeilen löschen', 'empty table', 'restart identity'],
    related: ['DELETE', 'DROP TABLE', 'Sperren'],
    mdn: PG + 'sql-truncate.html'
  },
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'MERGE',
    desc: 'Standard-Anweisung, die Quelle und Ziel abgleicht: einfügen, ändern oder löschen.',
    details: '`MERGE` verknüpft eine Zieltabelle mit einer Quelle über `ON` und legt für jeden Fall eine Aktion fest: `WHEN MATCHED` (ändern oder löschen) und `WHEN NOT MATCHED` (einfügen). Mehrere `WHEN`-Zweige werden der Reihe nach geprüft, der erste passende gewinnt. Jede Zielzeile darf höchstens einer Quellzeile entsprechen.',
    values: [
      ['WHEN MATCHED [AND …]', 'Zeile existiert in Ziel und Quelle: UPDATE oder DELETE'],
      ['WHEN NOT MATCHED [BY TARGET]', 'nur in der Quelle: INSERT'],
      ['WHEN NOT MATCHED BY SOURCE', 'nur im Ziel: UPDATE oder DELETE (nicht ISO)']
    ],
    dialects: {
      std: {
        syntax: 'MERGE INTO ziel AS z\nUSING quelle AS q ON q.id = z.id\nWHEN MATCHED [AND …] THEN UPDATE SET … | DELETE\nWHEN NOT MATCHED THEN INSERT (…) VALUES (…);',
        example: e(`
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER NOT NULL);
CREATE TABLE wareneingang (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER NOT NULL);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10), ('Kabel', 4), ('Tastatur', 5);
INSERT INTO wareneingang (produkt, menge) VALUES ('Maus', 3), ('Kabel', -4), ('Monitor', 2);

MERGE INTO lager AS l
USING wareneingang AS w ON w.produkt = l.produkt
WHEN MATCHED AND l.menge + w.menge = 0 THEN
  DELETE
WHEN MATCHED THEN
  UPDATE SET menge = l.menge + w.menge
WHEN NOT MATCHED THEN
  INSERT (produkt, menge) VALUES (w.produkt, w.menge);

SELECT produkt, menge FROM lager ORDER BY produkt;
-- produkt  | menge
-- Maus     | 13
-- Monitor  | 2
-- Tastatur | 5
`)
      },
      pg: { note: 'Seit PostgreSQL 15; `DO NOTHING` als Aktion, seit 17 auch `WHEN NOT MATCHED BY SOURCE` und `RETURNING`. Für einfache Upserts ist `INSERT … ON CONFLICT` bei gleichzeitigen Zugriffen robuster.', mdn: PG + 'sql-merge.html' },
      mysql: { none: 'Kein MERGE; Upsert mit `INSERT … ON DUPLICATE KEY UPDATE`, Löschen mit separatem `DELETE … JOIN`.', mdn: MY + 'insert-on-duplicate.html' },
      mssql: { note: 'Die Anweisung muss mit `;` enden. Kennt zusätzlich `WHEN NOT MATCHED BY SOURCE` und `OUTPUT $action`. Ohne `WITH (HOLDLOCK)` am Ziel ist MERGE nicht sicher gegen gleichzeitige Einfügungen.', mdn: MS + 'statements/merge-transact-sql' },
      sqlite: { none: 'Kein MERGE; Upsert mit `INSERT … ON CONFLICT DO UPDATE`, Löschen mit separatem `DELETE … WHERE EXISTS`.', mdn: SL + 'lang_upsert.html' }
    },
    tip: 'Die Quelle vorher auf doppelte Schlüssel prüfen: Passen zwei Quellzeilen auf dieselbe Zielzeile, bricht MERGE mit Fehler ab.',
    keywords: ['merge', 'upsert', 'abgleich', 'synchronisieren', 'when matched', 'when not matched'],
    related: ['ON CONFLICT (Upsert)', 'UPDATE … FROM (Join)', 'INSERT OR REPLACE / INSERT IGNORE'],
    mdn: PG + 'sql-merge.html'
  },
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'Duplikate löschen',
    desc: 'Entfernt mehrfach vorhandene Zeilen und behält pro Gruppe genau eine.',
    details: 'Man gruppiert nach den Spalten, die ein Duplikat ausmachen, und behält je Gruppe die Zeile mit der kleinsten ID; alle anderen werden gelöscht. Alternativ nummeriert `ROW_NUMBER() OVER (PARTITION BY …)` die Zeilen und alles mit Nummer > 1 fällt weg. Danach einen `UNIQUE`-Constraint anlegen, damit keine neuen Duplikate entstehen.',
    dialects: {
      std: {
        syntax: 'DELETE FROM t\nWHERE id NOT IN (SELECT MIN(id) FROM t GROUP BY spalte1, spalte2);',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden (id, name, stadt) VALUES
  (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Hamburg'), (3, 'Müller', 'Berlin'),
  (4, 'Weber', 'Köln'), (5, 'Schmidt', 'Hamburg');

DELETE FROM kunden
WHERE id NOT IN (SELECT MIN(id) FROM kunden GROUP BY name, stadt);

SELECT id, name, stadt FROM kunden ORDER BY id;
-- id | name    | stadt
-- 1  | Müller  | Berlin
-- 2  | Schmidt | Hamburg
-- 4  | Weber   | Köln

CREATE UNIQUE INDEX ux_kunden_name_stadt ON kunden (name, stadt);
`)
      },
      mysql: {
        syntax: 'DELETE FROM t\nWHERE id NOT IN (SELECT id FROM (SELECT MIN(id) AS id FROM t GROUP BY …) AS x);',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden (id, name, stadt) VALUES
  (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Hamburg'), (3, 'Müller', 'Berlin'),
  (4, 'Weber', 'Köln'), (5, 'Schmidt', 'Hamburg');

-- abgeleitete Tabelle drumherum, sonst Fehler 1093
DELETE FROM kunden
WHERE id NOT IN (SELECT id FROM (SELECT MIN(id) AS id FROM kunden GROUP BY name, stadt) AS behalten);

SELECT id, name, stadt FROM kunden ORDER BY id;
-- id | name    | stadt
-- 1  | Müller  | Berlin
-- 2  | Schmidt | Hamburg
-- 4  | Weber   | Köln

CREATE UNIQUE INDEX ux_kunden_name_stadt ON kunden (name, stadt);
`),
        note: 'Die Zieltabelle darf nicht direkt in der Unterabfrage stehen (Fehler 1093); die abgeleitete Tabelle wird vorher materialisiert. Vergleiche sind standardmäßig ohne Groß-/Kleinschreibung: `müller` gilt als Duplikat von `Müller`.',
        mdn: MY + 'subquery-restrictions.html'
      },
      mssql: { note: 'Elegant über einen CTE: `WITH d AS (SELECT ROW_NUMBER() OVER (PARTITION BY name, stadt ORDER BY id) AS nr FROM kunden) DELETE FROM d WHERE nr > 1;`. Vergleiche sind standardmäßig ohne Groß-/Kleinschreibung.' },
      sqlite: { note: 'Ohne eigene ID-Spalte eignet sich die versteckte `rowid`: `… WHERE rowid NOT IN (SELECT MIN(rowid) …)`.' }
    },
    tip: 'Erst mit `SELECT name, stadt, COUNT(*) AS anzahl FROM kunden GROUP BY name, stadt HAVING COUNT(*) > 1` prüfen, welche Duplikate es überhaupt gibt.',
    keywords: ['duplikate', 'dubletten', 'doppelte zeilen', 'remove duplicates', 'deduplizieren', 'distinct löschen'],
    related: ['ROW_NUMBER()', 'GROUP BY', 'UNIQUE INDEX', 'DELETE mit Unterabfrage'],
    mdn: PG + 'sql-delete.html'
  },
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'Soft Delete',
    desc: 'Markiert Zeilen als gelöscht, statt sie physisch zu entfernen.',
    details: 'Eine Spalte wie `geloescht_am` (Datum oder `NULL`) bzw. `aktiv` kennzeichnet gelöschte Zeilen. So bleiben Historie, Fremdschlüssel und Wiederherstellung möglich. Nachteil: Jede Abfrage muss den Filter enthalten – eine View für die „lebenden“ Zeilen hilft. `UNIQUE`-Constraints müssen gelöschte Zeilen ausnehmen, etwa per partiellem Index, den aber nicht jeder Dialekt kennt.',
    dialects: {
      std: {
        syntax: "UPDATE t SET geloescht_am = CURRENT_DATE WHERE id = …;\nSELECT … FROM t WHERE geloescht_am IS NULL;",
        example: e(`
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(100),
  geloescht_am DATE                       -- NULL = aktiv
);
INSERT INTO kunden (id, name, email) VALUES
  (1, 'Müller', 'm@example.com'), (2, 'Schmidt', 's@example.com'), (3, 'Weber', 'w@example.com');

CREATE VIEW aktive_kunden AS
  SELECT id, name, email FROM kunden WHERE geloescht_am IS NULL;

UPDATE kunden SET geloescht_am = '2026-11-16' WHERE id = 2;   -- "löschen"

SELECT id, name FROM aktive_kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 3  | Weber
`)
      },
      pg: {
        example: e(`
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(100),
  geloescht_am DATE                       -- NULL = aktiv
);
INSERT INTO kunden (id, name, email) VALUES
  (1, 'Müller', 'm@example.com'), (2, 'Schmidt', 's@example.com'), (3, 'Weber', 'w@example.com');

CREATE VIEW aktive_kunden AS
  SELECT id, name, email FROM kunden WHERE geloescht_am IS NULL;
-- E-Mail nur unter aktiven Kunden eindeutig (partieller Index)
CREATE UNIQUE INDEX ux_kunden_email ON kunden (email) WHERE geloescht_am IS NULL;

UPDATE kunden SET geloescht_am = '2026-11-16' WHERE id = 2;   -- "löschen"
INSERT INTO kunden (id, name, email) VALUES (4, 'Schmidt neu', 's@example.com');  -- erlaubt

SELECT id, name FROM aktive_kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 3  | Weber
-- 4  | Schmidt neu
`),
        note: 'Partielle Indizes (`CREATE INDEX … WHERE …`) halten den eindeutigen Index klein und nehmen gelöschte Zeilen aus.',
        mdn: PG + 'indexes-partial.html'
      },
      mysql: {
        example: e(`
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(100),
  geloescht_am DATE,                      -- NULL = aktiv
  -- nur bei aktiven Kunden gefüllt; mehrere NULL sind im UNIQUE-Index erlaubt
  email_aktiv VARCHAR(100) AS (CASE WHEN geloescht_am IS NULL THEN email END),
  UNIQUE KEY ux_kunden_email (email_aktiv)
);
INSERT INTO kunden (id, name, email) VALUES
  (1, 'Müller', 'm@example.com'), (2, 'Schmidt', 's@example.com'), (3, 'Weber', 'w@example.com');

CREATE VIEW aktive_kunden AS
  SELECT id, name, email FROM kunden WHERE geloescht_am IS NULL;

UPDATE kunden SET geloescht_am = '2026-11-16' WHERE id = 2;   -- "löschen"
INSERT INTO kunden (id, name, email) VALUES (4, 'Schmidt neu', 's@example.com');  -- erlaubt

SELECT id, name FROM aktive_kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 3  | Weber
-- 4  | Schmidt neu
`),
        note: 'Keine partiellen Indizes; eine generierte Spalte, die nur bei aktiven Zeilen einen Wert hat, ersetzt sie (`NULL` zählt im UNIQUE-Index nicht).',
        mdn: MY + 'create-table-generated-columns.html'
      },
      mssql: {
        example: e(`
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(100),
  geloescht_am DATE                       -- NULL = aktiv
);
INSERT INTO kunden (id, name, email) VALUES
  (1, 'Müller', 'm@example.com'), (2, 'Schmidt', 's@example.com'), (3, 'Weber', 'w@example.com');
GO
CREATE VIEW aktive_kunden AS
  SELECT id, name, email FROM kunden WHERE geloescht_am IS NULL;
GO
-- E-Mail nur unter aktiven Kunden eindeutig (gefilterter Index)
CREATE UNIQUE INDEX ux_kunden_email ON kunden (email) WHERE geloescht_am IS NULL;

UPDATE kunden SET geloescht_am = '2026-11-16' WHERE id = 2;   -- "löschen"
INSERT INTO kunden (id, name, email) VALUES (4, 'Schmidt neu', 's@example.com');  -- erlaubt

SELECT id, name FROM aktive_kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 3  | Weber
-- 4  | Schmidt neu
`),
        note: 'Gefilterte Indizes (`WHERE …`) entsprechen partiellen Indizes. `CREATE VIEW` muss allein im Batch stehen, daher `GO`.',
        mdn: MS + 'statements/create-index-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL, email VARCHAR(100),
  geloescht_am DATE                       -- NULL = aktiv
);
INSERT INTO kunden (id, name, email) VALUES
  (1, 'Müller', 'm@example.com'), (2, 'Schmidt', 's@example.com'), (3, 'Weber', 'w@example.com');

CREATE VIEW aktive_kunden AS
  SELECT id, name, email FROM kunden WHERE geloescht_am IS NULL;
-- E-Mail nur unter aktiven Kunden eindeutig (partieller Index)
CREATE UNIQUE INDEX ux_kunden_email ON kunden (email) WHERE geloescht_am IS NULL;

UPDATE kunden SET geloescht_am = '2026-11-16' WHERE id = 2;   -- "löschen"
INSERT INTO kunden (id, name, email) VALUES (4, 'Schmidt neu', 's@example.com');  -- erlaubt

SELECT id, name FROM aktive_kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 3  | Weber
-- 4  | Schmidt neu
`),
        note: 'Partielle Indizes gibt es seit SQLite 3.8.0.',
        mdn: SL + 'partialindex.html'
      }
    },
    tip: 'Datenschutz beachten: Soft Delete ist kein Löschen im Sinne der DSGVO; personenbezogene Daten müssen ggf. zusätzlich anonymisiert oder endgültig entfernt werden.',
    keywords: ['soft delete', 'logisches löschen', 'deleted_at', 'gelöscht markieren', 'papierkorb', 'archivieren', 'is_deleted', 'gefilterter index'],
    related: ['DELETE', 'CREATE VIEW', 'Partieller Index', 'BEFORE / AFTER / INSTEAD OF'],
    mdn: PG + 'sql-update.html'
  },
  {
    lang: 'sql', group: 'Daten ändern & löschen', name: 'Sicheres UPDATE / DELETE',
    desc: 'Massenänderungen erst prüfen, dann in einer Transaktion ausführen und kontrollieren.',
    details: 'Ein vergessenes oder falsches `WHERE` trifft schnell alle Zeilen. Sicherer Ablauf: Bedingung zuerst als `SELECT COUNT(*)` testen, dann Transaktion starten, Änderung ausführen, Ergebnis kontrollieren und erst danach `COMMIT` – oder `ROLLBACK`. In Werkzeugen wie DBeaver oder psql lässt sich Autocommit abschalten, damit jede Änderung erst bestätigt werden muss.',
    dialects: {
      std: {
        syntax: 'START TRANSACTION;\nUPDATE/DELETE … WHERE …;\nSELECT …;            -- kontrollieren\nCOMMIT; | ROLLBACK;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, betrag INTEGER, datum DATE);
INSERT INTO bestellungen (id, betrag, datum) VALUES
  (1, 120, '2024-12-01'), (2, 80, '2025-06-10'), (3, 45, '2026-01-20');

SELECT COUNT(*) AS betroffen FROM bestellungen WHERE datum < '2026-01-01';
-- betroffen
-- 2

START TRANSACTION;
DELETE FROM bestellungen WHERE datum < '2026-01-01';
SELECT COUNT(*) AS rest FROM bestellungen;
-- rest
-- 1
ROLLBACK;   -- doch nicht: alles zurück

SELECT COUNT(*) AS anzahl FROM bestellungen;
-- anzahl
-- 3
`)
      },
      pg: { note: 'Kürzer `BEGIN;` statt `START TRANSACTION;`. In psql schaltet `\\set AUTOCOMMIT off` den Autocommit ab.', mdn: PG + 'sql-begin.html' },
      mysql: { note: '`SET SQL_SAFE_UPDATES = 1;` (bzw. Client-Option `--safe-updates`) lässt UPDATE und DELETE ohne Schlüsselbedingung oder `LIMIT` scheitern.', mdn: MY + 'mysql-tips.html#safe-updates' },
      mssql: {
        syntax: 'BEGIN TRANSACTION;\nUPDATE/DELETE … WHERE …;\nSELECT …;            -- kontrollieren\nCOMMIT; | ROLLBACK;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, betrag INTEGER, datum DATE);
INSERT INTO bestellungen (id, betrag, datum) VALUES
  (1, 120, '2024-12-01'), (2, 80, '2025-06-10'), (3, 45, '2026-01-20');

SELECT COUNT(*) AS betroffen FROM bestellungen WHERE datum < '2026-01-01';
-- betroffen
-- 2

BEGIN TRANSACTION;
DELETE FROM bestellungen WHERE datum < '2026-01-01';
SELECT @@ROWCOUNT AS geloescht;
-- geloescht
-- 2
SELECT COUNT(*) AS rest FROM bestellungen;
-- rest
-- 1
ROLLBACK;   -- doch nicht: alles zurück

SELECT COUNT(*) AS anzahl FROM bestellungen;
-- anzahl
-- 3
`),
        note: '`@@ROWCOUNT` direkt nach der Änderung zeigt, wie viele Zeilen sie getroffen hat.',
        mdn: MS + 'language-elements/begin-transaction-transact-sql'
      },
      sqlite: {
        syntax: 'BEGIN;\nUPDATE/DELETE … WHERE …;\nSELECT …;            -- kontrollieren\nCOMMIT; | ROLLBACK;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, betrag INTEGER, datum DATE);
INSERT INTO bestellungen (id, betrag, datum) VALUES
  (1, 120, '2024-12-01'), (2, 80, '2025-06-10'), (3, 45, '2026-01-20');

SELECT COUNT(*) AS betroffen FROM bestellungen WHERE datum < '2026-01-01';
-- betroffen
-- 2

BEGIN;
DELETE FROM bestellungen WHERE datum < '2026-01-01';
SELECT changes() AS geloescht, (SELECT COUNT(*) FROM bestellungen) AS rest;
-- geloescht | rest
-- 2         | 1
ROLLBACK;   -- doch nicht: alles zurück

SELECT COUNT(*) AS anzahl FROM bestellungen;
-- anzahl
-- 3
`),
        note: 'Kein `START TRANSACTION`, nur `BEGIN`. `changes()` liefert die Zahl der zuletzt geänderten Zeilen.',
        mdn: SL + 'lang_transaction.html'
      }
    },
    tip: 'Die WHERE-Bedingung zuerst als SELECT schreiben und erst danach `SELECT … FROM` durch `DELETE FROM` ersetzen – so ist sie garantiert getestet.',
    keywords: ['where vergessen', 'safe updates', 'versehentlich gelöscht', 'massenänderung', 'vorsicht', 'rollback testen'],
    related: ['UPDATE', 'DELETE', 'ROLLBACK', 'Autocommit'],
    mdn: PG + 'tutorial-transactions.html'
  },

  // ---------------- Transaktionen ----------------
  {
    lang: 'sql', group: 'Transaktionen', name: 'Transaktion',
    desc: 'Fasst mehrere Anweisungen zu einer Einheit zusammen: alles oder nichts.',
    details: 'Eine Transaktion beginnt mit `START TRANSACTION` (oder `BEGIN`) und endet mit `COMMIT` (Änderungen dauerhaft speichern) oder `ROLLBACK` (alles verwerfen). Andere Sitzungen sehen die Änderungen erst nach dem Commit. Typisches Beispiel ist eine Überweisung: Abbuchen und Gutschreiben dürfen nur gemeinsam passieren. Transaktionen sollten kurz sein, weil sie Sperren halten und andere Sitzungen ausbremsen.',
    dialects: {
      std: {
        syntax: 'START TRANSACTION;\n  anweisung1;\n  anweisung2;\nCOMMIT;   -- oder ROLLBACK;',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo INTEGER CHECK (saldo >= 0));
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);

-- Überweisung von 200 € als eine Einheit
START TRANSACTION;
UPDATE konten SET saldo = saldo - 200 WHERE id = 1;
UPDATE konten SET saldo = saldo + 200 WHERE id = 2;
COMMIT;

SELECT inhaber, saldo FROM konten ORDER BY id;
-- inhaber | saldo
-- Ada     | 300
-- Lin     | 300
`)
      },
      pg: { note: 'Üblich ist die Kurzform `BEGIN;`. Nach einem Fehler nimmt die Transaktion nur noch `ROLLBACK` an.', mdn: PG + 'tutorial-transactions.html' },
      mysql: { note: 'Nur InnoDB-Tabellen sind transaktional. DDL wie `CREATE TABLE` beendet eine offene Transaktion mit implizitem Commit.', mdn: MY + 'commit.html' },
      mssql: {
        syntax: 'BEGIN TRANSACTION;\n  anweisung1;\n  anweisung2;\nCOMMIT;   -- oder ROLLBACK;',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo INTEGER CHECK (saldo >= 0));
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);

-- Überweisung von 200 € als eine Einheit
BEGIN TRANSACTION;
UPDATE konten SET saldo = saldo - 200 WHERE id = 1;
UPDATE konten SET saldo = saldo + 200 WHERE id = 2;
COMMIT;

SELECT inhaber, saldo FROM konten ORDER BY id;
-- inhaber | saldo
-- Ada     | 300
-- Lin     | 300
`),
        note: 'Ein Fehler bricht die Transaktion standardmäßig nicht ab; mit `SET XACT_ABORT ON` wird bei jedem Laufzeitfehler alles zurückgerollt.',
        mdn: MS + 'language-elements/begin-transaction-transact-sql'
      },
      sqlite: {
        syntax: 'BEGIN;\n  anweisung1;\n  anweisung2;\nCOMMIT;   -- oder ROLLBACK;',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo INTEGER CHECK (saldo >= 0));
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);

-- Überweisung von 200 € als eine Einheit
BEGIN;
UPDATE konten SET saldo = saldo - 200 WHERE id = 1;
UPDATE konten SET saldo = saldo + 200 WHERE id = 2;
COMMIT;

SELECT inhaber, saldo FROM konten ORDER BY id;
-- inhaber | saldo
-- Ada     | 300
-- Lin     | 300
`),
        note: 'Kein `START TRANSACTION`. Viele INSERTs in einer Transaktion sind um Größenordnungen schneller als einzeln, weil nur einmal auf die Platte geschrieben wird.',
        mdn: SL + 'lang_transaction.html'
      }
    },
    tip: 'Keine Benutzereingaben oder Netzwerkaufrufe innerhalb einer offenen Transaktion abwarten – sie hält solange Sperren und blockiert andere.',
    keywords: ['transaktion', 'transaction', 'alles oder nichts', 'atomar', 'commit', 'rollback', 'tcl'],
    related: ['BEGIN / COMMIT', 'ROLLBACK', 'ACID', 'Isolationslevel'],
    mdn: PG + 'tutorial-transactions.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'BEGIN / COMMIT',
    desc: 'Startet eine Transaktion bzw. schließt sie ab und macht die Änderungen dauerhaft.',
    details: 'Der Standard schreibt `START TRANSACTION`, die meisten Systeme kennen zusätzlich `BEGIN`. `COMMIT` beendet die Transaktion erfolgreich und macht alle Änderungen für andere Sitzungen sichtbar. Ob auch DDL wie `CREATE TABLE` Teil der Transaktion ist oder sie sofort committet, hängt vom Dialekt ab.',
    dialects: {
      std: {
        syntax: 'START TRANSACTION [ISOLATION LEVEL … | READ ONLY];\n…\nCOMMIT [WORK];',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag INTEGER);
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10);

START TRANSACTION;
INSERT INTO bestellungen (id, kunde_id, betrag) VALUES (1, 1, 20);
UPDATE lager SET menge = menge - 1 WHERE produkt = 'Maus';
COMMIT;

SELECT (SELECT COUNT(*) FROM bestellungen) AS bestellungen,
       (SELECT menge FROM lager WHERE produkt = 'Maus') AS maeuse;
-- bestellungen | maeuse
-- 1            | 9
`)
      },
      pg: {
        syntax: 'BEGIN [ISOLATION LEVEL …];   -- = START TRANSACTION\n…\nCOMMIT;                      -- oder END',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag INTEGER);
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10);

BEGIN;
INSERT INTO bestellungen (id, kunde_id, betrag) VALUES (1, 1, 20);
UPDATE lager SET menge = menge - 1 WHERE produkt = 'Maus';
COMMIT;

SELECT (SELECT COUNT(*) FROM bestellungen) AS bestellungen,
       (SELECT menge FROM lager WHERE produkt = 'Maus') AS maeuse;
-- bestellungen | maeuse
-- 1            | 9
`),
        note: 'DDL ist transaktional: Auch `CREATE TABLE` oder `ALTER TABLE` lassen sich zurückrollen. Schlägt eine Anweisung fehl, ist die Transaktion „abgebrochen“ und nimmt nur noch `ROLLBACK` an.',
        mdn: PG + 'sql-begin.html'
      },
      mysql: { note: '`BEGIN` und `BEGIN WORK` funktionieren auch, aber nicht in Prozeduren (dort ist `BEGIN` ein Block). DDL löst einen impliziten Commit aus.', mdn: MY + 'commit.html' },
      mssql: {
        syntax: 'BEGIN TRAN[SACTION] [name];\n…\nCOMMIT [TRAN[SACTION]];',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag INTEGER);
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10);

BEGIN TRAN;
INSERT INTO bestellungen (id, kunde_id, betrag) VALUES (1, 1, 20);
UPDATE lager SET menge = menge - 1 WHERE produkt = 'Maus';
SELECT @@TRANCOUNT AS offen;
-- offen
-- 1
COMMIT TRAN;

SELECT (SELECT COUNT(*) FROM bestellungen) AS bestellungen,
       (SELECT menge FROM lager WHERE produkt = 'Maus') AS maeuse;
-- bestellungen | maeuse
-- 1            | 9
`),
        note: 'Verschachtelte `BEGIN TRAN` erhöhen nur `@@TRANCOUNT`; erst das äußerste `COMMIT` schreibt fest. DDL ist transaktional.',
        mdn: MS + 'language-elements/commit-transaction-transact-sql'
      },
      sqlite: {
        syntax: 'BEGIN [DEFERRED | IMMEDIATE | EXCLUSIVE] [TRANSACTION];\n…\nCOMMIT;   -- oder END',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag INTEGER);
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10);

BEGIN TRANSACTION;
INSERT INTO bestellungen (id, kunde_id, betrag) VALUES (1, 1, 20);
UPDATE lager SET menge = menge - 1 WHERE produkt = 'Maus';
COMMIT;

SELECT (SELECT COUNT(*) FROM bestellungen) AS bestellungen,
       (SELECT menge FROM lager WHERE produkt = 'Maus') AS maeuse;
-- bestellungen | maeuse
-- 1            | 9
`),
        note: 'Kein `START TRANSACTION`. DDL ist transaktional. Zum Sperrverhalten von `DEFERRED`/`IMMEDIATE` siehe BEGIN IMMEDIATE (SQLite).',
        mdn: SL + 'lang_transaction.html'
      }
    },
    tip: 'Migrationen mit mehreren Schemaänderungen profitieren von transaktionaler DDL: Scheitert ein Schritt, bleibt das Schema unverändert – in MySQL dagegen bleibt ein halber Zustand zurück.',
    keywords: ['begin', 'commit', 'start transaction', 'end', 'begin tran', 'transaktion starten', 'bestätigen'],
    related: ['Transaktion', 'ROLLBACK', 'Autocommit', 'BEGIN IMMEDIATE (SQLite)'],
    mdn: PG + 'sql-begin.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'ROLLBACK',
    desc: 'Bricht die laufende Transaktion ab und verwirft alle ihre Änderungen.',
    details: 'Nach `ROLLBACK` ist der Zustand so, als hätte die Transaktion nie stattgefunden. Anwendungen rufen es im Fehlerfall auf, Datenbanken auch automatisch, wenn die Verbindung abbricht. Zähler von Auto-Increment-/Identity-Spalten werden dabei in der Regel nicht zurückgesetzt, es entstehen also Lücken. `ROLLBACK TO SAVEPOINT` macht nur einen Teil rückgängig.',
    dialects: {
      std: {
        syntax: 'ROLLBACK [WORK];\nROLLBACK TO SAVEPOINT name;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber');

START TRANSACTION;
DELETE FROM kunden;               -- Oops, WHERE vergessen
SELECT COUNT(*) AS anzahl FROM kunden;
-- anzahl
-- 0
ROLLBACK;

SELECT COUNT(*) AS anzahl FROM kunden;
-- anzahl
-- 3
`)
      },
      pg: { note: 'Kurzform `BEGIN;` statt `START TRANSACTION;`. Auch `ABORT` ist ein Synonym für `ROLLBACK`.', mdn: PG + 'sql-rollback.html' },
      mysql: { note: 'DDL (`DROP TABLE`, `TRUNCATE`, `ALTER TABLE`) committet implizit und lässt sich nicht zurückrollen.', mdn: MY + 'commit.html' },
      mssql: {
        syntax: 'ROLLBACK [TRAN[SACTION]];\nROLLBACK TRAN[SACTION] savepoint_name;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber');

BEGIN TRANSACTION;
DELETE FROM kunden;               -- Oops, WHERE vergessen
SELECT COUNT(*) AS anzahl FROM kunden;
-- anzahl
-- 0
ROLLBACK;

SELECT COUNT(*) AS anzahl FROM kunden;
-- anzahl
-- 3
`),
        note: '`ROLLBACK` ohne Savepoint-Namen rollt immer bis zur äußersten Transaktion zurück, auch bei verschachtelten `BEGIN TRAN`.',
        mdn: MS + 'language-elements/rollback-transaction-transact-sql'
      },
      sqlite: {
        syntax: 'ROLLBACK [TRANSACTION];\nROLLBACK TO [SAVEPOINT] name;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber');

BEGIN;
DELETE FROM kunden;               -- Oops, WHERE vergessen
SELECT COUNT(*) AS anzahl FROM kunden;
-- anzahl
-- 0
ROLLBACK;

SELECT COUNT(*) AS anzahl FROM kunden;
-- anzahl
-- 3
`),
        mdn: SL + 'lang_transaction.html'
      }
    },
    tip: 'Im Anwendungscode immer `try` / `except` bzw. `catch` mit ROLLBACK verwenden, oder Konstrukte nutzen, die das automatisch tun (`with` in Python, `@Transactional` in Spring).',
    keywords: ['rollback', 'zurückrollen', 'rückgängig', 'abbrechen', 'undo', 'verwerfen'],
    related: ['BEGIN / COMMIT', 'SAVEPOINT', 'Transaktion', 'Sicheres UPDATE / DELETE'],
    mdn: PG + 'sql-rollback.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'SAVEPOINT',
    desc: 'Setzt einen Zwischenpunkt in einer Transaktion, zu dem man zurückrollen kann.',
    details: '`SAVEPOINT name` markiert einen Zustand; `ROLLBACK TO SAVEPOINT name` verwirft nur die Änderungen danach, die Transaktion läuft weiter. `RELEASE SAVEPOINT name` entfernt den Punkt und behält die Änderungen. Savepoints sind die Grundlage für verschachtelte Transaktionen in ORMs.',
    dialects: {
      std: {
        syntax: 'SAVEPOINT name;\nROLLBACK TO SAVEPOINT name;\nRELEASE SAVEPOINT name;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50));

START TRANSACTION;
INSERT INTO produkte (id, name) VALUES (1, 'Tastatur');
SAVEPOINT vor_import;
INSERT INTO produkte (id, name) VALUES (2, 'Fehlerhaft 1'), (3, 'Fehlerhaft 2');
ROLLBACK TO SAVEPOINT vor_import;   -- nur den Import verwerfen
INSERT INTO produkte (id, name) VALUES (4, 'Maus');
COMMIT;

SELECT id, name FROM produkte ORDER BY id;
-- id | name
-- 1  | Tastatur
-- 4  | Maus
`)
      },
      pg: { note: 'Ein Savepoint ist der einzige Weg, nach einem Fehler innerhalb einer Transaktion weiterzuarbeiten, ohne alles zurückzurollen. Viele Savepoints in einer Transaktion kosten Leistung.', mdn: PG + 'sql-savepoint.html' },
      mysql: { note: 'Nur in InnoDB-Tabellen wirksam. Ein Savepoint mit gleichem Namen ersetzt den alten.', mdn: MY + 'savepoint.html' },
      mssql: {
        syntax: 'SAVE TRAN[SACTION] name;\nROLLBACK TRAN[SACTION] name;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50));

BEGIN TRANSACTION;
INSERT INTO produkte (id, name) VALUES (1, 'Tastatur');
SAVE TRANSACTION vor_import;
INSERT INTO produkte (id, name) VALUES (2, 'Fehlerhaft 1'), (3, 'Fehlerhaft 2');
ROLLBACK TRANSACTION vor_import;   -- nur den Import verwerfen
INSERT INTO produkte (id, name) VALUES (4, 'Maus');
COMMIT;

SELECT id, name FROM produkte ORDER BY id;
-- id | name
-- 1  | Tastatur
-- 4  | Maus
`),
        note: 'Andere Schlüsselwörter: `SAVE TRANSACTION` und `ROLLBACK TRANSACTION name`; ein `RELEASE` gibt es nicht.',
        mdn: MS + 'language-elements/save-transaction-transact-sql'
      },
      sqlite: {
        syntax: 'SAVEPOINT name;\nROLLBACK TO [SAVEPOINT] name;\nRELEASE [SAVEPOINT] name;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50));

BEGIN;
INSERT INTO produkte (id, name) VALUES (1, 'Tastatur');
SAVEPOINT vor_import;
INSERT INTO produkte (id, name) VALUES (2, 'Fehlerhaft 1'), (3, 'Fehlerhaft 2');
ROLLBACK TO vor_import;   -- nur den Import verwerfen
INSERT INTO produkte (id, name) VALUES (4, 'Maus');
COMMIT;

SELECT id, name FROM produkte ORDER BY id;
-- id | name
-- 1  | Tastatur
-- 4  | Maus
`),
        note: 'Kein `START TRANSACTION`. Ein `SAVEPOINT` außerhalb einer Transaktion startet selbst eine; `RELEASE` des äußersten Savepoints committet sie.',
        mdn: SL + 'lang_savepoint.html'
      }
    },
    tip: 'Für eine Stapelverarbeitung, in der einzelne fehlerhafte Datensätze übersprungen werden sollen, vor jedem Datensatz einen Savepoint setzen und im Fehlerfall nur dorthin zurückrollen.',
    keywords: ['savepoint', 'sicherungspunkt', 'zwischenstand', 'rollback to', 'release', 'verschachtelte transaktion', 'nested transaction', 'save transaction'],
    related: ['ROLLBACK', 'Transaktion', 'BEGIN / COMMIT'],
    mdn: PG + 'sql-savepoint.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'ACID',
    desc: 'Die vier Garantien von Transaktionen: atomar, konsistent, isoliert, dauerhaft.',
    details: 'Atomicity: Eine Transaktion wird ganz oder gar nicht ausgeführt. Consistency: Sie führt von einem gültigen Zustand (alle Constraints erfüllt) zum nächsten. Isolation: Parallele Transaktionen beeinflussen sich nur so weit, wie das Isolationslevel erlaubt. Durability: Nach dem Commit überleben die Daten auch Absturz oder Stromausfall (Write-Ahead-Log).',
    values: [
      ['Atomicity', 'Atomarität: alles oder nichts'],
      ['Consistency', 'Konsistenz: Constraints gelten vor und nach der Transaktion'],
      ['Isolation', 'Isolation: parallele Transaktionen stören sich nicht (je nach Level)'],
      ['Durability', 'Dauerhaftigkeit: Commit ist gegen Absturz gesichert'],
      ['BASE', 'Gegenmodell vieler NoSQL-Systeme: Basically Available, Soft state, Eventually consistent']
    ],
    dialects: {
      std: {
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, saldo INTEGER NOT NULL CHECK (saldo >= 0));
INSERT INTO konten (id, saldo) VALUES (1, 100), (2, 50);

-- Konsistenz: Der CHECK verhindert negative Salden.
-- UPDATE konten SET saldo = saldo - 150 WHERE id = 1;  -> Fehler, nichts geändert

-- Atomarität: Beide Buchungen oder keine
START TRANSACTION;
UPDATE konten SET saldo = saldo - 80 WHERE id = 1;
UPDATE konten SET saldo = saldo + 80 WHERE id = 2;
COMMIT;   -- Dauerhaftigkeit: ab hier gegen Absturz gesichert

SELECT id, saldo FROM konten ORDER BY id;
-- id | saldo
-- 1  | 20
-- 2  | 130
`)
      },
      mysql: { note: 'ACID gilt nur für InnoDB (Standard); die alte Engine MyISAM kennt keine Transaktionen. `CHECK` wird erst seit 8.0.16 durchgesetzt.', mdn: MY + 'mysql-acid.html' },
      mssql: {
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, saldo INTEGER NOT NULL CHECK (saldo >= 0));
INSERT INTO konten (id, saldo) VALUES (1, 100), (2, 50);

-- Konsistenz: Der CHECK verhindert negative Salden.
-- UPDATE konten SET saldo = saldo - 150 WHERE id = 1;  -> Fehler, nichts geändert

-- Atomarität: Beide Buchungen oder keine
SET XACT_ABORT ON;   -- bei jedem Fehler die ganze Transaktion zurückrollen
BEGIN TRANSACTION;
UPDATE konten SET saldo = saldo - 80 WHERE id = 1;
UPDATE konten SET saldo = saldo + 80 WHERE id = 2;
COMMIT;   -- Dauerhaftigkeit: ab hier gegen Absturz gesichert

SELECT id, saldo FROM konten ORDER BY id;
-- id | saldo
-- 1  | 20
-- 2  | 130
`),
        note: 'Ohne `SET XACT_ABORT ON` bricht ein Laufzeitfehler nur die eine Anweisung ab, die übrigen der Transaktion bleiben bestehen – Atomarität muss man dann selbst per `TRY … CATCH` sichern.',
        mdn: MS + 'statements/set-xact-abort-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, saldo INTEGER NOT NULL CHECK (saldo >= 0));
INSERT INTO konten (id, saldo) VALUES (1, 100), (2, 50);

-- Konsistenz: Der CHECK verhindert negative Salden.
-- UPDATE konten SET saldo = saldo - 150 WHERE id = 1;  -> Fehler, nichts geändert

-- Atomarität: Beide Buchungen oder keine
BEGIN;
UPDATE konten SET saldo = saldo - 80 WHERE id = 1;
UPDATE konten SET saldo = saldo + 80 WHERE id = 2;
COMMIT;   -- Dauerhaftigkeit: ab hier gegen Absturz gesichert

SELECT id, saldo FROM konten ORDER BY id;
-- id | saldo
-- 1  | 20
-- 2  | 130
`),
        note: 'Voll ACID-konform; Dauerhaftigkeit über Rollback-Journal oder WAL. `PRAGMA synchronous = OFF` opfert sie für Geschwindigkeit.',
        mdn: SL + 'transactional.html'
      }
    },
    tip: 'Durability kostet Zeit beim Commit (fsync). Viele kleine Transaktionen sind daher langsam; zusammengehörige Änderungen lieber bündeln.',
    keywords: ['acid', 'atomarität', 'konsistenz', 'isolation', 'dauerhaftigkeit', 'atomicity', 'consistency', 'durability', 'base'],
    related: ['Transaktion', 'Isolationslevel', 'CHECK'],
    mdn: PG + 'tutorial-transactions.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'Autocommit',
    desc: 'Modus, in dem jede einzelne Anweisung sofort als eigene Transaktion committet wird.',
    details: 'Die meisten Datenbanken und Clients arbeiten standardmäßig im Autocommit: Ohne `BEGIN` ist jede Anweisung sofort dauerhaft. Erst ein expliziter Transaktionsstart fasst mehrere zusammen. Manche Treiber verhalten sich anders: Pythons DB-API und JDBC mit `setAutoCommit(false)` öffnen implizit eine Transaktion, die man selbst committen muss – vergisst man das, gehen Änderungen verloren.',
    values: [
      ['Python DB-API', 'Transaktion implizit offen; con.commit() nötig (sqlite3: autocommit=False ab 3.12)'],
      ['JDBC', 'con.setAutoCommit(false); … con.commit();']
    ],
    dialects: {
      std: { none: 'Kein Autocommit-Schalter im Standard: Eine Transaktion beginnt implizit mit der ersten Anweisung und endet erst mit `COMMIT` oder `ROLLBACK` – Autocommit ist eine Eigenschaft von Server oder Client.' },
      pg: {
        syntax: '\\set AUTOCOMMIT off   -- psql-Befehl, kein SQL',
        example: e(`
# psql: Autocommit für die Sitzung abschalten
psql -d shop
shop=# \\set AUTOCOMMIT off
shop=# UPDATE produkte SET preis = preis * 1.1 WHERE kategorie = 'Hardware';
shop=*# SELECT name, preis FROM produkte;   -- * im Prompt: Transaktion offen
shop=*# COMMIT;                             -- erst jetzt dauerhaft
`),
        exampleLang: 'sh',
        note: 'Der Server arbeitet immer im Autocommit; abschalten lässt es sich nur im Client (psql, Treiber, Werkzeug), der dann selbst `BEGIN` sendet.',
        mdn: PG + 'app-psql.html'
      },
      mysql: {
        syntax: 'SET autocommit = 0;   -- bis COMMIT/ROLLBACK eine Transaktion\nSET autocommit = 1;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte (id, name, preis) VALUES (1, 'Maus', 20.00), (2, 'Kabel', 5.00);

SET autocommit = 0;              -- ab jetzt implizit in einer Transaktion
UPDATE produkte SET preis = preis * 2;
ROLLBACK;                        -- verwirft das UPDATE
UPDATE produkte SET preis = preis + 1 WHERE id = 1;
COMMIT;                          -- erst jetzt dauerhaft
SET autocommit = 1;

SELECT name, preis FROM produkte ORDER BY id;
-- name  | preis
-- Maus  | 21.00
-- Kabel | 5.00
`),
        note: 'Gilt für die Sitzung; `SET autocommit = 1` committet eine offene Transaktion. Der Server-Standard lässt sich mit `init_connect` oder der Client-Option ändern.',
        mdn: MY + 'commit.html'
      },
      mssql: {
        syntax: 'SET IMPLICIT_TRANSACTIONS ON;   -- Änderungen öffnen eine Transaktion\nSET IMPLICIT_TRANSACTIONS OFF;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte (id, name, preis) VALUES (1, 'Maus', 20.00), (2, 'Kabel', 5.00);

SET IMPLICIT_TRANSACTIONS ON;    -- ab jetzt öffnet jede Änderung eine Transaktion
UPDATE produkte SET preis = preis * 2;
SELECT @@TRANCOUNT AS offen;
-- offen
-- 1
ROLLBACK;                        -- verwirft das UPDATE
UPDATE produkte SET preis = preis + 1 WHERE id = 1;
COMMIT;                          -- erst jetzt dauerhaft
SET IMPLICIT_TRANSACTIONS OFF;

SELECT name, preis FROM produkte ORDER BY id;
-- name  | preis
-- Maus  | 21.00
-- Kabel | 5.00
`),
        note: 'Standard ist Autocommit; `@@TRANCOUNT` zeigt, ob eine Transaktion offen ist.',
        mdn: MS + 'statements/set-implicit-transactions-transact-sql'
      },
      sqlite: { none: 'Kein Schalter: SQLite ist immer im Autocommit, bis `BEGIN` eine Transaktion öffnet. Pythons `sqlite3` öffnet dagegen implizit Transaktionen (`autocommit=False` bzw. Altmodus).', mdn: SL + 'c3ref/get_autocommit.html' }
    },
    tip: 'Bei abgeschaltetem Autocommit wirkt auch ein reines SELECT als offene Transaktion und kann z. B. in PostgreSQL VACUUM blockieren – Verbindungen nie „idle in transaction“ liegen lassen.',
    keywords: ['autocommit', 'auto commit', 'implicit transactions', 'implizite transaktion', 'setautocommit', 'sofort speichern'],
    related: ['BEGIN / COMMIT', 'Transaktion', 'Transaktionen im Code'],
    mdn: MY + 'commit.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'Isolationslevel',
    desc: 'Legt fest, wie stark parallele Transaktionen voneinander abgeschirmt sind.',
    details: 'Der SQL-Standard definiert vier Stufen, die jeweils bestimmte Anomalien ausschließen. Höhere Stufen sind sicherer, führen aber zu mehr Wartezeiten oder Serialisierungsfehlern, die die Anwendung durch Wiederholen behandeln muss. Die Standardstufe und die genaue Umsetzung (Sperren oder Schnappschüsse) unterscheiden sich je nach Datenbank.',
    values: [
      ['READ UNCOMMITTED', 'sieht auch nicht committete Daten (Dirty Read)'],
      ['READ COMMITTED', 'jede Anweisung sieht den letzten Commit-Stand'],
      ['REPEATABLE READ', 'einmal gelesene Zeilen behalten ihre Werte'],
      ['SERIALIZABLE', 'Ergebnis wie bei Ausführung nacheinander; kann Serialisierungsfehler (SQLSTATE 40001) werfen']
    ],
    dialects: {
      std: {
        syntax: 'SET TRANSACTION ISOLATION LEVEL\n  { READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE };\nSTART TRANSACTION ISOLATION LEVEL …;',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo INTEGER);
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);

START TRANSACTION ISOLATION LEVEL SERIALIZABLE;
UPDATE konten SET saldo = saldo - 50 WHERE id = 1;
COMMIT;   -- kann mit SQLSTATE 40001 scheitern -> Transaktion wiederholen

SELECT saldo FROM konten WHERE id = 1;
-- saldo
-- 450
`)
      },
      pg: {
        syntax: 'BEGIN ISOLATION LEVEL …;\nSET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL …;',
        example: e(`
BEGIN ISOLATION LEVEL REPEATABLE READ;
SHOW transaction_isolation;
-- transaction_isolation
-- repeatable read
COMMIT;

-- Standardstufe für die Sitzung ändern
SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SHOW default_transaction_isolation;
-- default_transaction_isolation
-- serializable
`),
        note: 'Standard ist READ COMMITTED. READ UNCOMMITTED verhält sich wie READ COMMITTED; REPEATABLE READ verhindert dank Schnappschuss auch Phantome.',
        mdn: PG + 'transaction-iso.html'
      },
      mysql: {
        syntax: 'SET [SESSION | GLOBAL] TRANSACTION ISOLATION LEVEL …;',
        example: e(`
-- für alle folgenden Transaktionen der Sitzung
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT @@transaction_isolation AS stufe;
-- stufe
-- READ-COMMITTED

-- ohne SESSION: nur für die nächste Transaktion
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
START TRANSACTION;
SELECT 1 AS test;
COMMIT;
`),
        note: 'Standard in InnoDB ist REPEATABLE READ. Unter SERIALIZABLE werden einfache SELECTs zu `SELECT … FOR SHARE`.',
        mdn: MY + 'innodb-transaction-isolation-levels.html'
      },
      mssql: {
        syntax: 'SET TRANSACTION ISOLATION LEVEL\n  { READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SNAPSHOT | SERIALIZABLE };',
        example: e(`
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;   -- gilt für die Sitzung

SELECT CASE transaction_isolation_level
         WHEN 1 THEN 'READ UNCOMMITTED' WHEN 2 THEN 'READ COMMITTED'
         WHEN 3 THEN 'REPEATABLE READ'  WHEN 4 THEN 'SERIALIZABLE'
         WHEN 5 THEN 'SNAPSHOT'
       END AS stufe
FROM sys.dm_exec_sessions
WHERE session_id = @@SPID;
-- stufe
-- SERIALIZABLE
`),
        note: 'Standard ist READ COMMITTED mit Sperren (Leser warten auf Schreiber). Die Datenbankoption `READ_COMMITTED_SNAPSHOT ON` und die Stufe `SNAPSHOT` arbeiten stattdessen mit Zeilenversionen.',
        mdn: MS + 'statements/set-transaction-isolation-level-transact-sql'
      },
      sqlite: { none: 'Nicht einstellbar: SQLite ist immer serialisierbar, weil es nur einen Schreiber zur Zeit zulässt. `PRAGMA read_uncommitted` wirkt nur im Shared-Cache-Modus.', mdn: SL + 'isolation.html' }
    },
    tip: 'Wer SERIALIZABLE oder REPEATABLE READ nutzt, muss Serialisierungsfehler und Deadlocks abfangen und die ganze Transaktion erneut ausführen.',
    keywords: ['isolation level', 'isolationsstufe', 'read committed', 'repeatable read', 'serializable', 'read uncommitted', 'set transaction', 'mvcc', 'snapshot'],
    related: ['Dirty Read / Phantom Read', 'ACID', 'Sperren', 'Lost Update'],
    mdn: PG + 'transaction-iso.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'Dirty Read / Phantom Read',
    desc: 'Typische Anomalien, wenn parallele Transaktionen nicht vollständig isoliert sind.',
    details: 'Ein Dirty Read liest Daten einer anderen Transaktion, die noch nicht committet sind und vielleicht zurückgerollt werden. Ein Non-Repeatable Read liefert beim zweiten Lesen derselben Zeile einen anderen Wert. Ein Phantom Read findet bei derselben Bedingung plötzlich neue oder fehlende Zeilen. Welche Anomalie möglich ist, hängt vom Isolationslevel und seiner Umsetzung im Dialekt ab.',
    values: [
      ['Dirty Read', 'nicht committete Änderung gelesen – möglich bei READ UNCOMMITTED'],
      ['Non-Repeatable Read', 'Zeile ändert sich zwischen zwei Lesevorgängen – bis READ COMMITTED'],
      ['Phantom Read', 'Treffermenge ändert sich durch INSERT/DELETE – laut Standard bis REPEATABLE READ'],
      ['Lost Update', 'zwei Schreiber überschreiben sich gegenseitig'],
      ['Write Skew', 'zwei Transaktionen prüfen dieselbe Regel und verletzen sie gemeinsam – nur SERIALIZABLE hilft']
    ],
    dialects: {
      std: {
        example: e(`
-- zwei Sitzungen, READ COMMITTED
-- Sitzung A                                  -- Sitzung B
START TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT COUNT(*) AS anzahl FROM bestellungen
WHERE betrag > 100;            -- 3
                                              START TRANSACTION;
                                              INSERT INTO bestellungen (id, kunde_id, betrag)
                                              VALUES (9, 1, 500);
                                              COMMIT;
SELECT COUNT(*) AS anzahl FROM bestellungen
WHERE betrag > 100;            -- 4  <- Phantom
COMMIT;
-- Unter SERIALIZABLE sähe A beide Male 3.
`),
        nocheck: true
      },
      pg: {
        example: e(`
-- zwei Sitzungen, READ COMMITTED (Standard)
-- Sitzung A                                  -- Sitzung B
BEGIN;
SELECT COUNT(*) AS anzahl FROM bestellungen
WHERE betrag > 100;            -- 3
                                              BEGIN;
                                              INSERT INTO bestellungen (id, kunde_id, betrag)
                                              VALUES (9, 1, 500);
                                              COMMIT;
SELECT COUNT(*) AS anzahl FROM bestellungen
WHERE betrag > 100;            -- 4  <- Phantom
COMMIT;
-- Mit BEGIN ISOLATION LEVEL REPEATABLE READ sähe A beide Male 3.
`),
        nocheck: true,
        note: 'Dirty Reads gibt es nie. Schon REPEATABLE READ verhindert Phantome (Schnappschuss der ganzen Transaktion); Write Skew verhindert erst SERIALIZABLE.',
        mdn: PG + 'transaction-iso.html'
      },
      mysql: { note: 'InnoDB-Standard ist REPEATABLE READ: Einfache SELECTs lesen einen festen Schnappschuss und sehen keine Phantome; sperrende Lesezugriffe (`FOR UPDATE`) lesen dagegen den neuesten Stand.', mdn: MY + 'innodb-next-key-locking.html' },
      mssql: {
        example: e(`
-- zwei Sitzungen: Dirty Read mit NOLOCK (= READ UNCOMMITTED)
-- Sitzung A                                  -- Sitzung B
BEGIN TRANSACTION;
UPDATE konten SET saldo = 0 WHERE id = 1;
                                              SELECT saldo FROM konten WITH (NOLOCK)
                                              WHERE id = 1;   -- 0  <- Dirty Read
ROLLBACK;
-- B hat einen Wert gesehen, den es nie gab.
`),
        nocheck: true,
        note: 'Der Tabellenhinweis `WITH (NOLOCK)` ist gleichbedeutend mit READ UNCOMMITTED und erlaubt Dirty Reads – ein häufiger, gefährlicher „Performance-Trick“.',
        mdn: MS + 'queries/hints-transact-sql-table'
      },
      sqlite: { none: 'Zwischen Verbindungen treten diese Anomalien nicht auf: Es gibt nur einen Schreiber, und Leser sehen einen festen Stand (serialisierbar). Ausnahme: `PRAGMA read_uncommitted` im Shared-Cache-Modus.', mdn: SL + 'isolation.html' }
    },
    tip: 'Berichte, die mehrere Abfragen konsistent auswerten müssen, in einer Transaktion mit REPEATABLE READ (bzw. SNAPSHOT) ausführen – dann sehen alle Abfragen denselben Stand.',
    keywords: ['dirty read', 'phantom read', 'non-repeatable read', 'anomalie', 'write skew', 'schmutziges lesen', 'phantom', 'nolock'],
    related: ['Isolationslevel', 'Lost Update', 'Transaktion'],
    mdn: PG + 'transaction-iso.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'Sperren',
    desc: 'Locks verhindern, dass parallele Transaktionen dieselben Daten gleichzeitig ändern.',
    details: 'Datenbanken sperren beim Schreiben automatisch die betroffenen Zeilen oder – je nach System – ganze Tabellen oder die ganze Datei. Mit Zeilenversionen (MVCC) blockieren Leser die Schreiber nicht. Explizit sperrt man Zeilen mit `SELECT … FOR UPDATE` oder ganze Tabellen mit einem Sperrbefehl. Sperren werden erst am Ende der Transaktion freigegeben.',
    values: [
      ['Zeilensperre', 'durch UPDATE/DELETE oder SELECT … FOR UPDATE'],
      ['Tabellensperre', 'expliziter Sperrbefehl oder DDL wie ALTER TABLE, TRUNCATE'],
      ['Shared Lock', 'mehrere Leser gleichzeitig, kein Schreiber'],
      ['Exclusive Lock', 'nur ein Halter, alle anderen warten'],
      ['Lock Timeout', 'wie lange auf eine Sperre gewartet wird, bevor ein Fehler kommt']
    ],
    dialects: {
      std: { none: 'Kein Befehl für Tabellensperren im Standard; Sperren entstehen implizit über das Isolationslevel bzw. Zeilensperren mit `SELECT … FOR UPDATE`.' },
      pg: {
        syntax: 'LOCK [TABLE] tabelle IN { ACCESS SHARE | ROW EXCLUSIVE | SHARE | SHARE ROW EXCLUSIVE | EXCLUSIVE | ACCESS EXCLUSIVE } MODE [NOWAIT];',
        example: e(`
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10), ('Kabel', -2);

SET lock_timeout = '5s';                         -- nicht ewig auf Sperren warten
BEGIN;
LOCK TABLE lager IN SHARE ROW EXCLUSIVE MODE;    -- andere dürfen lesen, nicht schreiben
UPDATE lager SET menge = 0 WHERE menge < 0;

-- Ist die Tabellensperre gesetzt?
SELECT mode, granted FROM pg_locks
WHERE relation = 'lager'::regclass AND mode = 'ShareRowExclusiveLock';
-- mode                  | granted
-- ShareRowExclusiveLock | true
COMMIT;                                         -- Sperren werden freigegeben

SELECT produkt, menge FROM lager ORDER BY produkt;
-- produkt | menge
-- Kabel   | 0
-- Maus    | 10
`),
        note: 'Tabellensperren nur innerhalb von `BEGIN … COMMIT`. Anwendungsdefinierte Sperren gibt es mit `pg_advisory_xact_lock(42)`; wer wartet, zeigt `pg_locks WHERE NOT granted`.',
        mdn: PG + 'explicit-locking.html'
      },
      mysql: {
        syntax: 'LOCK TABLES tabelle { READ | WRITE } [, …];\nUNLOCK TABLES;',
        example: e(`
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10), ('Kabel', -2);

SET SESSION innodb_lock_wait_timeout = 5;   -- höchstens 5 s auf Zeilensperren warten
LOCK TABLES lager WRITE;                    -- nur diese Sitzung darf lesen und schreiben
UPDATE lager SET menge = 0 WHERE menge < 0;
UNLOCK TABLES;                              -- Sperre freigeben

SELECT produkt, menge FROM lager ORDER BY produkt;
-- produkt | menge
-- Kabel   | 0
-- Maus    | 10
`),
        note: '`LOCK TABLES` committet eine offene Transaktion implizit; solange es gilt, darf die Sitzung nur die gesperrten Tabellen benutzen. In InnoDB sind Zeilensperren per `SELECT … FOR UPDATE` meist die bessere Wahl.',
        mdn: MY + 'lock-tables.html'
      },
      mssql: {
        syntax: 'SELECT … FROM tabelle WITH (TABLOCKX, HOLDLOCK);   -- Tabellenhinweis\nSET LOCK_TIMEOUT ms;',
        example: e(`
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10), ('Kabel', -2);

SET LOCK_TIMEOUT 5000;                     -- höchstens 5 s warten, dann Fehler 1222
BEGIN TRANSACTION;
SELECT COUNT(*) AS anzahl FROM lager WITH (TABLOCKX, HOLDLOCK);   -- Tabelle exklusiv
-- anzahl
-- 2
UPDATE lager SET menge = 0 WHERE menge < 0;
COMMIT;                                    -- Sperre wird freigegeben

SELECT produkt, menge FROM lager ORDER BY produkt;
-- produkt | menge
-- Kabel   | 0
-- Maus    | 10
`),
        note: 'Kein `LOCK TABLE`; Sperren steuert man über Tabellenhinweise (`TABLOCKX`, `UPDLOCK`, `HOLDLOCK`). Aktuelle Sperren zeigt `sys.dm_tran_locks`.',
        mdn: MS + 'queries/hints-transact-sql-table'
      },
      sqlite: {
        syntax: 'BEGIN EXCLUSIVE;   -- ganze Datenbank sperren\nPRAGMA busy_timeout = ms;',
        example: e(`
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER);
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10), ('Kabel', -2);

PRAGMA busy_timeout = 5000;      -- bis zu 5 s auf andere Verbindungen warten
-- timeout
-- 5000

BEGIN EXCLUSIVE;                 -- Schreibsperre auf die ganze Datenbank
UPDATE lager SET menge = 0 WHERE menge < 0;
COMMIT;

SELECT produkt, menge FROM lager ORDER BY produkt;
-- produkt | menge
-- Kabel   | 0
-- Maus    | 10
`),
        note: 'Keine Zeilen- oder Tabellensperren: gesperrt wird immer die ganze Datenbankdatei, es gibt höchstens einen Schreiber.',
        mdn: SL + 'lockingv3.html'
      }
    },
    tip: 'Lange Migrationen (`ALTER TABLE`) im Betrieb mit einem Lock-Timeout absichern – sonst stauen sich hinter der wartenden Sperre alle anderen Abfragen.',
    keywords: ['lock', 'sperre', 'locking', 'lock table', 'zeilensperre', 'row lock', 'advisory lock', 'mvcc', 'lock timeout', 'tablockx'],
    related: ['SELECT … FOR UPDATE', 'Deadlock', 'Optimistisches Sperren', 'BEGIN IMMEDIATE (SQLite)'],
    mdn: PG + 'explicit-locking.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'SELECT … FOR UPDATE',
    desc: 'Liest Zeilen und sperrt sie bis zum Transaktionsende gegen fremde Änderungen.',
    details: 'Pessimistisches Sperren: Wer Zeilen lesen und danach abhängig vom Ergebnis ändern will, sperrt sie schon beim Lesen. Andere Transaktionen, die dieselben Zeilen ändern oder sperren wollen, warten. Optionen wie `NOWAIT` (sofort Fehler) oder `SKIP LOCKED` (gesperrte Zeilen auslassen) steuern das Warten.',
    values: [
      ['FOR UPDATE', 'exklusiv sperren, Änderung folgt'],
      ['FOR SHARE', 'andere dürfen lesen und ebenfalls FOR SHARE, nicht ändern'],
      ['NOWAIT', 'sofort Fehler statt warten'],
      ['SKIP LOCKED', 'gesperrte Zeilen auslassen (Job-Queues)']
    ],
    dialects: {
      std: { none: 'Im Standard nur als `FOR UPDATE` in Cursor-Deklarationen; `SELECT … FOR UPDATE` ist eine verbreitete Erweiterung (PostgreSQL, MySQL, Oracle).' },
      pg: {
        syntax: 'SELECT … FROM t WHERE …\nFOR { UPDATE | NO KEY UPDATE | SHARE | KEY SHARE } [OF t] [NOWAIT | SKIP LOCKED];',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo INTEGER);
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);

BEGIN;
SELECT saldo FROM konten WHERE id = 1 FOR UPDATE;   -- Zeile gesperrt
-- saldo
-- 500

-- Anwendung prüft: reicht der Saldo?
UPDATE konten SET saldo = saldo - 200 WHERE id = 1;
COMMIT;                                             -- Sperre frei

SELECT saldo FROM konten WHERE id = 1;
-- saldo
-- 300
`),
        note: '`FOR NO KEY UPDATE` sperrt schwächer und blockiert keine Fremdschlüssel-Prüfungen anderer Transaktionen.',
        mdn: PG + 'sql-select.html#SQL-FOR-UPDATE-SHARE'
      },
      mysql: {
        syntax: 'SELECT … FROM t WHERE …\nFOR { UPDATE | SHARE } [OF t] [NOWAIT | SKIP LOCKED];',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo INTEGER);
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);

START TRANSACTION;
SELECT saldo FROM konten WHERE id = 1 FOR UPDATE;   -- Zeile gesperrt
-- saldo
-- 500

-- Anwendung prüft: reicht der Saldo?
UPDATE konten SET saldo = saldo - 200 WHERE id = 1;
COMMIT;                                             -- Sperre frei

SELECT saldo FROM konten WHERE id = 1;
-- saldo
-- 300
`),
        note: '`FOR SHARE`, `NOWAIT` und `SKIP LOCKED` seit 8.0 (vorher `LOCK IN SHARE MODE`). Ohne passenden Index sperrt InnoDB alle durchsuchten Zeilen.',
        mdn: MY + 'innodb-locking-reads.html'
      },
      mssql: {
        syntax: 'SELECT … FROM t WITH (UPDLOCK, ROWLOCK [, NOWAIT | READPAST]) WHERE …;',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo INTEGER);
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);

BEGIN TRANSACTION;
SELECT saldo FROM konten WITH (UPDLOCK, ROWLOCK) WHERE id = 1;   -- Zeile gesperrt
-- saldo
-- 500

-- Anwendung prüft: reicht der Saldo?
UPDATE konten SET saldo = saldo - 200 WHERE id = 1;
COMMIT;                                             -- Sperre frei

SELECT saldo FROM konten WHERE id = 1;
-- saldo
-- 300
`),
        note: 'Kein `FOR UPDATE` (außer bei Cursorn); stattdessen Tabellenhinweise: `UPDLOCK` hält eine Update-Sperre bis Transaktionsende, `READPAST` überspringt gesperrte Zeilen.',
        mdn: MS + 'queries/hints-transact-sql-table'
      },
      sqlite: { none: 'Keine Zeilensperren; `BEGIN IMMEDIATE` holt gleich zu Beginn die Schreibsperre für die ganze Datenbank.', mdn: SL + 'lang_transaction.html' }
    },
    tip: 'Mehrere Zeilen immer in derselben Reihenfolge sperren (z. B. `ORDER BY id … FOR UPDATE`), sonst drohen Deadlocks.',
    keywords: ['for update', 'select for update', 'pessimistisches sperren', 'pessimistic locking', 'zeile sperren', 'nowait', 'for share', 'updlock'],
    related: ['Sperren', 'SKIP LOCKED (Warteschlange)', 'Optimistisches Sperren', 'Deadlock'],
    mdn: PG + 'sql-select.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'Deadlock',
    desc: 'Zwei Transaktionen warten gegenseitig auf Sperren des anderen und hängen fest.',
    details: 'A sperrt Zeile 1 und will Zeile 2, B sperrt Zeile 2 und will Zeile 1 – keiner kommt weiter. Die Datenbank erkennt den Zyklus nach kurzer Zeit und bricht eine der Transaktionen mit Fehler ab. Die Anwendung muss die abgebrochene Transaktion wiederholen. Vorbeugen lässt sich durch einheitliche Sperrreihenfolge und kurze Transaktionen.',
    dialects: {
      std: {
        example: e(`
-- zwei Sitzungen
-- Sitzung A                                   -- Sitzung B
START TRANSACTION;                             START TRANSACTION;
UPDATE konten SET saldo = saldo - 10
WHERE id = 1;                                  UPDATE konten SET saldo = saldo - 10
                                               WHERE id = 2;
UPDATE konten SET saldo = saldo + 10
WHERE id = 2;           -- wartet auf B …
                                               UPDATE konten SET saldo = saldo + 10
                                               WHERE id = 1;
                                               -- Fehler: Deadlock, B wird zurückgerollt
-- Abhilfe: beide sperren immer zuerst die kleinere id
SELECT id FROM konten WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
`),
        nocheck: true
      },
      pg: { note: 'Fehler `ERROR: deadlock detected` mit SQLSTATE `40P01`; geprüft wird nach `deadlock_timeout` (Standard 1 s). Die Kurzform `BEGIN;` geht ebenso.', mdn: PG + 'explicit-locking.html#LOCKING-DEADLOCKS' },
      mysql: { note: 'Fehler 1213 (`ER_LOCK_DEADLOCK`, SQLSTATE `40001`); InnoDB rollt die „kleinere“ Transaktion zurück. Den letzten Deadlock zeigt `SHOW ENGINE INNODB STATUS`.', mdn: MY + 'innodb-deadlocks.html' },
      mssql: {
        example: e(`
-- zwei Sitzungen
-- Sitzung A                                   -- Sitzung B
BEGIN TRANSACTION;                             BEGIN TRANSACTION;
UPDATE konten SET saldo = saldo - 10
WHERE id = 1;                                  UPDATE konten SET saldo = saldo - 10
                                               WHERE id = 2;
UPDATE konten SET saldo = saldo + 10
WHERE id = 2;           -- wartet auf B …
                                               UPDATE konten SET saldo = saldo + 10
                                               WHERE id = 1;
                                               -- Fehler 1205: als Deadlockopfer ausgewählt
-- Abhilfe: beide sperren immer zuerst die kleinere id
SELECT id FROM konten WITH (UPDLOCK) WHERE id IN (1, 2) ORDER BY id;
`),
        nocheck: true,
        note: 'Fehler 1205 („deadlock victim“). Mit `SET DEADLOCK_PRIORITY LOW` bietet sich eine Sitzung freiwillig als Opfer an.',
        mdn: MS + 'statements/set-deadlock-priority-transact-sql'
      },
      sqlite: { none: 'Keine Deadlocks im eigentlichen Sinn, weil es nur einen Schreiber gibt; stattdessen meldet eine wartende Verbindung `SQLITE_BUSY` („database is locked“). Abhilfe: `BEGIN IMMEDIATE` und `busy_timeout`.', mdn: SL + 'rescode.html#busy' }
    },
    tip: 'Deadlocks sind im Mehrbenutzerbetrieb normal und kein Datenbankfehler – entscheidend ist eine Wiederholungslogik mit wenigen Versuchen in der Anwendung.',
    keywords: ['deadlock', 'verklemmung', 'gegenseitiges warten', '40p01', 'deadlock detected', 'lock order', '1205', '1213'],
    related: ['Sperren', 'SELECT … FOR UPDATE', 'Isolationslevel'],
    mdn: PG + 'explicit-locking.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'Optimistisches Sperren',
    desc: 'Erkennt Konflikte über eine Versionsspalte, statt Zeilen beim Lesen zu sperren.',
    details: 'Jede Zeile trägt eine `version` (oder einen Änderungszeitstempel). Beim Speichern lautet die Bedingung `WHERE id = … AND version = <gelesene Version>` und die Version wird erhöht. Hat inzwischen jemand anderes gespeichert, trifft das UPDATE 0 Zeilen – die Anwendung meldet einen Konflikt. Ideal für Web-Formulare, bei denen zwischen Lesen und Speichern Minuten liegen; JPA/Hibernate unterstützt das mit `@Version`.',
    dialects: {
      std: {
        syntax: 'UPDATE t SET …, version = version + 1\nWHERE id = :id AND version = :gelesene_version;\n-- 0 betroffene Zeilen = Konflikt',
        example: e(`
CREATE TABLE artikel (id INTEGER PRIMARY KEY, titel VARCHAR(100), version INTEGER DEFAULT 1 NOT NULL);
INSERT INTO artikel (id, titel) VALUES (1, 'Entwurf');

-- A und B haben beide Version 1 gelesen. A speichert zuerst (1 Zeile):
UPDATE artikel SET titel = 'Fassung A', version = version + 1
WHERE id = 1 AND version = 1;

-- B speichert mit veralteter Version: 0 Zeilen -> Konflikt melden
UPDATE artikel SET titel = 'Fassung B', version = version + 1
WHERE id = 1 AND version = 1;

SELECT titel, version FROM artikel;
-- titel     | version
-- Fassung A | 2
`)
      },
      pg: {
        example: e(`
CREATE TABLE artikel (id INTEGER PRIMARY KEY, titel VARCHAR(100), version INTEGER DEFAULT 1 NOT NULL);
INSERT INTO artikel (id, titel) VALUES (1, 'Entwurf');

-- A und B haben beide Version 1 gelesen. A speichert zuerst:
UPDATE artikel SET titel = 'Fassung A', version = version + 1
WHERE id = 1 AND version = 1
RETURNING id, version;
-- id | version
-- 1  | 2

-- B speichert mit veralteter Version: keine Zeile zurück -> Konflikt melden
UPDATE artikel SET titel = 'Fassung B', version = version + 1
WHERE id = 1 AND version = 1
RETURNING id, version;
-- id | version
`),
        note: 'Mit `RETURNING` liefert das UPDATE die neue Version gleich mit; eine leere Rückgabe bedeutet Konflikt. Alternativ dient die Systemspalte `xmin` als Versionsnummer.',
        mdn: PG + 'dml-returning.html'
      },
      mysql: {
        example: e(`
CREATE TABLE artikel (id INTEGER PRIMARY KEY, titel VARCHAR(100), version INTEGER DEFAULT 1 NOT NULL);
INSERT INTO artikel (id, titel) VALUES (1, 'Entwurf');

-- A und B haben beide Version 1 gelesen. A speichert zuerst:
UPDATE artikel SET titel = 'Fassung A', version = version + 1
WHERE id = 1 AND version = 1;
SELECT ROW_COUNT() AS geaendert;
-- geaendert
-- 1

-- B speichert mit veralteter Version -> Konflikt melden
UPDATE artikel SET titel = 'Fassung B', version = version + 1
WHERE id = 1 AND version = 1;
SELECT ROW_COUNT() AS geaendert;
-- geaendert
-- 0
`),
        note: '`ROW_COUNT()` zählt standardmäßig nur tatsächlich geänderte Zeilen – ein UPDATE, das denselben Wert noch einmal setzt, ergibt 0. Die Versionsspalte umgeht das.',
        mdn: MY + 'information-functions.html#function_row-count'
      },
      mssql: {
        example: e(`
CREATE TABLE artikel (id INTEGER PRIMARY KEY, titel VARCHAR(100), version INTEGER DEFAULT 1 NOT NULL);
INSERT INTO artikel (id, titel) VALUES (1, 'Entwurf');

-- A und B haben beide Version 1 gelesen. A speichert zuerst:
UPDATE artikel SET titel = 'Fassung A', version = version + 1
WHERE id = 1 AND version = 1;
SELECT @@ROWCOUNT AS geaendert;
-- geaendert
-- 1

-- B speichert mit veralteter Version -> Konflikt melden
UPDATE artikel SET titel = 'Fassung B', version = version + 1
WHERE id = 1 AND version = 1;
SELECT @@ROWCOUNT AS geaendert;
-- geaendert
-- 0
`),
        note: 'Eine Spalte vom Typ `rowversion` wird bei jeder Änderung automatisch hochgezählt und eignet sich direkt als Versionsmerkmal.',
        mdn: MS + 'data-types/rowversion-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE artikel (id INTEGER PRIMARY KEY, titel VARCHAR(100), version INTEGER DEFAULT 1 NOT NULL);
INSERT INTO artikel (id, titel) VALUES (1, 'Entwurf');

-- A und B haben beide Version 1 gelesen. A speichert zuerst:
UPDATE artikel SET titel = 'Fassung A', version = version + 1
WHERE id = 1 AND version = 1;
SELECT changes() AS geaendert;
-- geaendert
-- 1

-- B speichert mit veralteter Version -> Konflikt melden
UPDATE artikel SET titel = 'Fassung B', version = version + 1
WHERE id = 1 AND version = 1;
SELECT changes() AS geaendert;
-- geaendert
-- 0
`),
        note: '`changes()` liefert die Zahl der Zeilen der letzten Änderung; seit 3.35 geht auch `RETURNING`.',
        mdn: SL + 'lang_corefunc.html#changes'
      }
    },
    tip: 'Die Anzahl betroffener Zeilen liefert auch jeder Treiber (`cursor.rowcount`, `executeUpdate()`); 0 ist das Signal für den Konflikt.',
    keywords: ['optimistisches sperren', 'optimistic locking', 'version', 'versionsspalte', 'konflikt', 'concurrency', '@version', 'etag', 'rowversion'],
    related: ['SELECT … FOR UPDATE', 'Lost Update', 'Sperren', 'RETURNING'],
    mdn: PG + 'sql-update.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'Lost Update',
    desc: 'Zwei Sitzungen lesen denselben Wert, ändern ihn und überschreiben sich gegenseitig.',
    details: 'Muster „lesen – in der Anwendung rechnen – zurückschreiben“: Liest B den Wert, bevor A gespeichert hat, geht As Änderung verloren. Lösungen: die Berechnung in das UPDATE verlegen (`menge = menge - 1`, atomar), Zeilen mit `SELECT … FOR UPDATE` sperren oder optimistisches Sperren. READ COMMITTED verhindert Lost Updates nicht.',
    dialects: {
      std: {
        example: e(`
CREATE TABLE lager (produkt VARCHAR(50) PRIMARY KEY, menge INTEGER NOT NULL CHECK (menge >= 0));
INSERT INTO lager (produkt, menge) VALUES ('Maus', 10);

-- Falsch (anfällig): Anwendung liest 10, rechnet 10 - 1 und schreibt fest 9
-- UPDATE lager SET menge = 9 WHERE produkt = 'Maus';

-- Richtig: atomar in der Datenbank rechnen, zwei Verkäufe parallel
UPDATE lager SET menge = menge - 1 WHERE produkt = 'Maus' AND menge >= 1;
UPDATE lager SET menge = menge - 1 WHERE produkt = 'Maus' AND menge >= 1;

SELECT menge FROM lager WHERE produkt = 'Maus';
-- menge
-- 8
`)
      },
      pg: { note: 'Unter REPEATABLE READ erkennt PostgreSQL den Konflikt und bricht die zweite Transaktion mit SQLSTATE `40001` ab.' },
      mysql: { note: 'Auch unter REPEATABLE READ (Standard) erkennt InnoDB Lost Updates nicht: Das UPDATE liest immer den neuesten Stand. Schutz nur durch atomares UPDATE, `FOR UPDATE` oder Versionsspalte.' }
    },
    tip: 'Die Bedingung `AND menge >= 1` im UPDATE verhindert zugleich Überverkauf – trifft es 0 Zeilen, ist der Artikel ausverkauft.',
    keywords: ['lost update', 'verlorene änderung', 'überschreiben', 'read modify write', 'race condition', 'atomares update'],
    related: ['Optimistisches Sperren', 'SELECT … FOR UPDATE', 'Dirty Read / Phantom Read'],
    mdn: PG + 'transaction-iso.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'SKIP LOCKED (Warteschlange)',
    desc: 'Mehrere Worker holen sich Jobs aus einer Tabelle, ohne sich gegenseitig zu blockieren.',
    details: 'Die Abfrage sperrt die gefundenen Zeilen und überspringt solche, die gerade ein anderer Worker gesperrt hat. So entsteht eine einfache, robuste Job-Queue direkt in der Datenbank. Bricht ein Worker ab, wird seine Sperre beim Rollback frei und der Job erneut vergeben.',
    dialects: {
      std: { none: 'Nicht im Standard; verbreitete Erweiterung von `SELECT … FOR UPDATE` (PostgreSQL, MySQL, Oracle).' },
      pg: {
        syntax: "SELECT … FROM jobs WHERE status = 'neu'\nORDER BY id LIMIT n\nFOR UPDATE SKIP LOCKED;",
        example: e(`
CREATE TABLE jobs (id INTEGER PRIMARY KEY, auftrag VARCHAR(50), status VARCHAR(20) DEFAULT 'neu', worker VARCHAR(20));
INSERT INTO jobs (id, auftrag) VALUES (1, 'Rechnung 17'), (2, 'Mail an Ada'), (3, 'Export');

BEGIN;
UPDATE jobs SET status = 'in_arbeit', worker = 'w1'
WHERE id = (
  SELECT id FROM jobs
  WHERE status = 'neu'
  ORDER BY id
  LIMIT 1
  FOR UPDATE SKIP LOCKED
)
RETURNING id, auftrag;
-- id | auftrag
-- 1  | Rechnung 17

-- … Job verarbeiten …
UPDATE jobs SET status = 'fertig' WHERE id = 1;
COMMIT;

SELECT id, status FROM jobs ORDER BY id;
-- id | status
-- 1  | fertig
-- 2  | neu
-- 3  | neu
`),
        note: 'Seit PostgreSQL 9.5. Holen und Markieren in einer Anweisung (UPDATE mit Unterabfrage und `RETURNING`).',
        mdn: PG + 'sql-select.html#SQL-FOR-UPDATE-SHARE'
      },
      mysql: {
        syntax: "SELECT … FROM jobs WHERE status = 'neu'\nORDER BY id LIMIT n\nFOR UPDATE SKIP LOCKED;",
        example: e(`
CREATE TABLE jobs (id INTEGER PRIMARY KEY, auftrag VARCHAR(50), status VARCHAR(20) DEFAULT 'neu', worker VARCHAR(20));
INSERT INTO jobs (id, auftrag) VALUES (1, 'Rechnung 17'), (2, 'Mail an Ada'), (3, 'Export');

START TRANSACTION;
SELECT id, auftrag FROM jobs
WHERE status = 'neu'
ORDER BY id
LIMIT 1
FOR UPDATE SKIP LOCKED;
-- id | auftrag
-- 1  | Rechnung 17

UPDATE jobs SET status = 'in_arbeit', worker = 'w1' WHERE id = 1;
-- … Job verarbeiten …
UPDATE jobs SET status = 'fertig' WHERE id = 1;
COMMIT;

SELECT id, status FROM jobs ORDER BY id;
-- id | status
-- 1  | fertig
-- 2  | neu
-- 3  | neu
`),
        note: 'Seit MySQL 8.0. Ein UPDATE mit Unterabfrage auf dieselbe Tabelle ist verboten, daher erst sperrend lesen, dann ändern.',
        mdn: MY + 'innodb-locking-reads.html'
      },
      mssql: {
        syntax: 'SELECT TOP (n) … FROM jobs WITH (READPAST, UPDLOCK, ROWLOCK)\nWHERE … ORDER BY id;',
        example: e(`
CREATE TABLE jobs (id INTEGER PRIMARY KEY, auftrag VARCHAR(50), status VARCHAR(20) DEFAULT 'neu', worker VARCHAR(20));
INSERT INTO jobs (id, auftrag) VALUES (1, 'Rechnung 17'), (2, 'Mail an Ada'), (3, 'Export');

BEGIN TRANSACTION;
WITH naechster AS (
  SELECT TOP (1) id, auftrag, status, worker
  FROM jobs WITH (READPAST, UPDLOCK, ROWLOCK)
  WHERE status = 'neu'
  ORDER BY id
)
UPDATE naechster SET status = 'in_arbeit', worker = 'w1'
OUTPUT inserted.id, inserted.auftrag;
-- id | auftrag
-- 1  | Rechnung 17

-- … Job verarbeiten …
UPDATE jobs SET status = 'fertig' WHERE id = 1;
COMMIT;

SELECT id, status FROM jobs ORDER BY id;
-- id | status
-- 1  | fertig
-- 2  | neu
-- 3  | neu
`),
        note: 'Kein `SKIP LOCKED`; der Hinweis `READPAST` überspringt gesperrte Zeilen, `UPDLOCK` sperrt die gefundenen.',
        mdn: MS + 'queries/hints-transact-sql-table'
      },
      sqlite: { none: 'Keine Zeilensperren; mit nur einem Schreiber genügt `BEGIN IMMEDIATE` plus `UPDATE … RETURNING`, um einen Job exklusiv zu holen.', mdn: SL + 'lang_transaction.html' }
    },
    tip: 'Ein partieller bzw. gefilterter Index `ON jobs (id) WHERE status = \'neu\'` hält das Holen des nächsten Jobs auch bei Millionen erledigter Einträge schnell.',
    keywords: ['skip locked', 'job queue', 'warteschlange', 'worker', 'queue', 'readpast', 'parallel abarbeiten'],
    related: ['SELECT … FOR UPDATE', 'Sperren', 'Partieller Index'],
    mdn: PG + 'sql-select.html'
  },
  {
    lang: 'sql', group: 'Transaktionen', name: 'BEGIN IMMEDIATE (SQLite)',
    desc: 'Startet in SQLite eine Transaktion, die sofort die Schreibsperre holt.',
    details: 'SQLite erlaubt beliebig viele Leser, aber nur einen Schreiber für die ganze Datenbank. Ein normales `BEGIN` (DEFERRED) holt die Schreibsperre erst beim ersten Schreiben; scheitert das, gibt es `SQLITE_BUSY` mitten in der Transaktion. `BEGIN IMMEDIATE` sperrt gleich zu Beginn, sodass Fehler früh und sauber auftreten. Im WAL-Modus (`PRAGMA journal_mode = WAL`) blockieren sich Leser und Schreiber nicht mehr.',
    values: [
      ['DEFERRED', 'Standard: Sperren erst bei Bedarf'],
      ['IMMEDIATE', 'Schreibsperre sofort, Leser weiter erlaubt'],
      ['EXCLUSIVE', 'wie IMMEDIATE; im Rollback-Journal-Modus auch Leser aussperren'],
      ['PRAGMA busy_timeout', 'Millisekunden warten statt sofort SQLITE_BUSY'],
      ['PRAGMA journal_mode = WAL', 'Leser und ein Schreiber gleichzeitig']
    ],
    dialects: {
      std: { none: 'SQLite-spezifisch; im Standard bestimmt das Isolationslevel (`START TRANSACTION ISOLATION LEVEL …`) das Sperrverhalten.' },
      pg: { none: 'Nicht nötig, weil Zeilen einzeln gesperrt werden; Schreibkonflikte früh erzwingen mit `BEGIN; SELECT … FOR UPDATE` oder `LOCK TABLE`.', mdn: PG + 'explicit-locking.html' },
      mysql: { none: 'Nicht nötig (Zeilensperren); früh sperren mit `START TRANSACTION; SELECT … FOR UPDATE`.', mdn: MY + 'innodb-locking-reads.html' },
      mssql: { none: 'Nicht nötig (Zeilensperren); früh sperren mit Tabellenhinweisen wie `WITH (UPDLOCK)` oder `TABLOCKX`.', mdn: MS + 'queries/hints-transact-sql-table' },
      sqlite: {
        syntax: 'BEGIN [DEFERRED | IMMEDIATE | EXCLUSIVE] [TRANSACTION];',
        example: e(`
CREATE TABLE zaehler (name VARCHAR(50) PRIMARY KEY, wert INTEGER);
INSERT INTO zaehler (name, wert) VALUES ('besuche', 41);

PRAGMA busy_timeout = 5000;      -- bis zu 5 s auf andere Schreiber warten
-- timeout
-- 5000

BEGIN IMMEDIATE;
UPDATE zaehler SET wert = wert + 1 WHERE name = 'besuche';
COMMIT;

SELECT wert FROM zaehler WHERE name = 'besuche';
-- wert
-- 42
`),
        mdn: SL + 'lang_transaction.html'
      }
    },
    tip: 'Für Webanwendungen mit SQLite: WAL-Modus, `busy_timeout` und `BEGIN IMMEDIATE` für alle schreibenden Transaktionen – das beseitigt die meisten „database is locked“-Fehler.',
    keywords: ['begin immediate', 'sqlite', 'database is locked', 'sqlite_busy', 'busy timeout', 'wal', 'deferred', 'exclusive'],
    related: ['BEGIN / COMMIT', 'Sperren', 'Isolationslevel'],
    mdn: SL + 'lang_transaction.html'
  },

  // ---------------- Trigger & Prozeduren ----------------
  {
    lang: 'sql', group: 'Trigger & Prozeduren', name: 'CREATE TRIGGER',
    desc: 'Legt Code an, der bei INSERT, UPDATE oder DELETE auf einer Tabelle automatisch läuft.',
    details: 'Ein Trigger reagiert auf ein Ereignis (`INSERT`, `UPDATE [OF spalte]`, `DELETE`) zu einem Zeitpunkt (`BEFORE`, `AFTER`, `INSTEAD OF`) und läuft je betroffener Zeile oder einmal je Anweisung. Er läuft in derselben Transaktion wie die auslösende Anweisung. Die Syntax unterscheidet sich zwischen den Dialekten stark: Rumpf direkt im Trigger, separate Trigger-Funktion oder Pseudotabellen mit allen geänderten Zeilen.',
    dialects: {
      std: {
        syntax: 'CREATE TRIGGER name\n{ BEFORE | AFTER | INSTEAD OF } { INSERT | UPDATE [OF spalte] | DELETE }\nON tabelle\n[REFERENCING OLD ROW AS alt NEW ROW AS neu]\nFOR EACH { ROW | STATEMENT } [WHEN (bedingung)]\nanweisung | BEGIN ATOMIC anweisungen; END;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER, geaendert INTEGER DEFAULT 0);

CREATE TRIGGER produkte_aenderungen
BEFORE UPDATE OF preis ON produkte
REFERENCING OLD ROW AS alt NEW ROW AS neu
FOR EACH ROW
SET neu.geaendert = alt.geaendert + 1;

INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20);
UPDATE produkte SET preis = 45 WHERE id = 1;
UPDATE produkte SET preis = 40 WHERE id = 1;

SELECT name, preis, geaendert FROM produkte ORDER BY id;
-- name     | preis | geaendert
-- Tastatur | 40    | 2
-- Maus     | 20    | 0
`),
        nocheck: true
      },
      pg: {
        syntax: 'CREATE FUNCTION f() RETURNS trigger LANGUAGE plpgsql AS $$ … $$;\nCREATE [OR REPLACE] TRIGGER name\n{ BEFORE | AFTER | INSTEAD OF } { INSERT | UPDATE [OF spalte] | DELETE } ON tabelle\nFOR EACH { ROW | STATEMENT } [WHEN (bedingung)]\nEXECUTE FUNCTION f();',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER, geaendert INTEGER DEFAULT 0);

CREATE FUNCTION zaehle_aenderung() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.geaendert := OLD.geaendert + 1;
  RETURN NEW;               -- BEFORE-Trigger: diese Zeile wird gespeichert
END $$;

CREATE TRIGGER produkte_aenderungen
BEFORE UPDATE OF preis ON produkte
FOR EACH ROW
EXECUTE FUNCTION zaehle_aenderung();

INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20);
UPDATE produkte SET preis = 45 WHERE id = 1;
UPDATE produkte SET preis = 40 WHERE id = 1;

SELECT name, preis, geaendert FROM produkte ORDER BY id;
-- name     | preis | geaendert
-- Tastatur | 40    | 2
-- Maus     | 20    | 0
`),
        note: 'Der Rumpf steht immer in einer eigenen Funktion mit `RETURNS trigger`; eine Funktion kann für viele Tabellen dienen. `CREATE OR REPLACE TRIGGER` seit 14.',
        mdn: PG + 'sql-createtrigger.html'
      },
      mysql: {
        syntax: 'CREATE TRIGGER name\n{ BEFORE | AFTER } { INSERT | UPDATE | DELETE } ON tabelle\nFOR EACH ROW\nBEGIN … END;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER, geaendert INTEGER DEFAULT 0);

DELIMITER //
CREATE TRIGGER produkte_aenderungen
BEFORE UPDATE ON produkte
FOR EACH ROW
BEGIN
  IF NOT (NEW.preis <=> OLD.preis) THEN
    SET NEW.geaendert = OLD.geaendert + 1;
  END IF;
END //
DELIMITER ;

INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20);
UPDATE produkte SET preis = 45 WHERE id = 1;
UPDATE produkte SET preis = 40 WHERE id = 1;

SELECT name, preis, geaendert FROM produkte ORDER BY id;
-- name     | preis | geaendert
-- Tastatur | 40    | 2
-- Maus     | 20    | 0
`),
        note: 'Nur `FOR EACH ROW`, kein `UPDATE OF spalte` und kein `WHEN`. Ein Trigger darf die eigene Tabelle nicht per UPDATE ändern (Fehler 1442) – im BEFORE-Trigger stattdessen `NEW` setzen.',
        mdn: MY + 'create-trigger.html'
      },
      mssql: {
        syntax: 'CREATE [OR ALTER] TRIGGER name ON tabelle\n{ AFTER | INSTEAD OF } { INSERT, UPDATE, DELETE }\nAS\nBEGIN … END;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER, geaendert INTEGER DEFAULT 0);
GO
CREATE TRIGGER produkte_aenderungen
ON produkte
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  IF UPDATE(preis)
    UPDATE p SET geaendert = p.geaendert + 1
    FROM produkte AS p
    JOIN inserted AS i ON i.id = p.id;
END;
GO
INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20);
UPDATE produkte SET preis = 45 WHERE id = 1;
UPDATE produkte SET preis = 40 WHERE id = 1;

SELECT name, preis, geaendert FROM produkte ORDER BY id;
-- name     | preis | geaendert
-- Tastatur | 40    | 2
-- Maus     | 20    | 0
`),
        note: 'Trigger laufen einmal pro Anweisung; alle betroffenen Zeilen stehen in den Pseudotabellen `inserted` und `deleted`. `CREATE TRIGGER` muss allein im Batch stehen (`GO`).',
        mdn: MS + 'statements/create-trigger-transact-sql'
      },
      sqlite: {
        syntax: 'CREATE TRIGGER [IF NOT EXISTS] name\n{ BEFORE | AFTER | INSTEAD OF } { INSERT | UPDATE [OF spalte] | DELETE }\nON tabelle [FOR EACH ROW] [WHEN bedingung]\nBEGIN\n  anweisungen;\nEND;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER, geaendert INTEGER DEFAULT 0);

CREATE TRIGGER produkte_aenderungen
AFTER UPDATE OF preis ON produkte
FOR EACH ROW
BEGIN
  UPDATE produkte SET geaendert = geaendert + 1 WHERE id = NEW.id;
END;

INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20);
UPDATE produkte SET preis = 45 WHERE id = 1;
UPDATE produkte SET preis = 40 WHERE id = 1;

SELECT name, preis, geaendert FROM produkte ORDER BY id;
-- name     | preis | geaendert
-- Tastatur | 40    | 2
-- Maus     | 20    | 0
`),
        note: 'Nur Zeilen-Trigger. `NEW` lässt sich nicht ändern, daher ein AFTER-Trigger mit UPDATE; er löst sich nicht selbst erneut aus, solange `recursive_triggers` aus ist.',
        mdn: SL + 'lang_createtrigger.html'
      }
    },
    tip: 'Trigger sind unsichtbare Logik: Sparsam einsetzen (Audit, Zeitstempel, Integrität) und gut dokumentieren, sonst wundert sich jeder über „magische“ Änderungen.',
    keywords: ['trigger', 'create trigger', 'auslöser', 'automatisch', 'for each row', 'ereignis', 'event', 'inserted', 'deleted'],
    related: ['BEFORE / AFTER / INSTEAD OF', 'NEW und OLD', 'Audit-Trigger', 'DROP TRIGGER'],
    mdn: PG + 'sql-createtrigger.html'
  },
  {
    lang: 'sql', group: 'Trigger & Prozeduren', name: 'BEFORE / AFTER / INSTEAD OF',
    desc: 'Zeitpunkt eines Triggers: vor, nach oder anstelle der auslösenden Änderung.',
    details: '`BEFORE`-Trigger laufen vor der Änderung und eignen sich zum Prüfen oder Anpassen der neuen Werte. `AFTER`-Trigger sehen das Ergebnis und dienen für Folgeaktionen wie Protokolle. `INSTEAD OF` gibt es nur auf Views: Der Trigger ersetzt die Änderung und macht so auch komplexe Views beschreibbar. Nicht jeder Dialekt kennt alle drei Zeitpunkte.',
    values: [
      ['BEFORE', 'vor der Änderung: prüfen, Werte anpassen'],
      ['AFTER', 'nach der Änderung: protokollieren, Folgeänderungen'],
      ['INSTEAD OF', 'nur auf Views: ersetzt INSERT/UPDATE/DELETE'],
      ['FOR EACH ROW', 'einmal pro betroffener Zeile'],
      ['FOR EACH STATEMENT', 'einmal pro Anweisung']
    ],
    dialects: {
      std: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), aktiv INTEGER DEFAULT 1 NOT NULL);
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber');

CREATE VIEW aktive_kunden AS SELECT id, name FROM kunden WHERE aktiv = 1;

-- DELETE auf der View deaktiviert nur, statt zu löschen
CREATE TRIGGER aktive_kunden_delete
INSTEAD OF DELETE ON aktive_kunden
REFERENCING OLD ROW AS alt
FOR EACH ROW
UPDATE kunden SET aktiv = 0 WHERE id = alt.id;

DELETE FROM aktive_kunden WHERE name = 'Schmidt';

SELECT id, name, aktiv FROM kunden ORDER BY id;
-- id | name    | aktiv
-- 1  | Müller  | 1
-- 2  | Schmidt | 0
-- 3  | Weber   | 1
`),
        nocheck: true
      },
      pg: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), aktiv INTEGER DEFAULT 1 NOT NULL);
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber');

CREATE VIEW aktive_kunden AS SELECT id, name FROM kunden WHERE aktiv = 1;

-- DELETE auf der View deaktiviert nur, statt zu löschen
CREATE FUNCTION aktive_kunden_loeschen() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE kunden SET aktiv = 0 WHERE id = OLD.id;
  RETURN OLD;
END $$;

CREATE TRIGGER aktive_kunden_delete
INSTEAD OF DELETE ON aktive_kunden
FOR EACH ROW EXECUTE FUNCTION aktive_kunden_loeschen();

DELETE FROM aktive_kunden WHERE name = 'Schmidt';

SELECT id, name, aktiv FROM kunden ORDER BY id;
-- id | name    | aktiv
-- 1  | Müller  | 1
-- 2  | Schmidt | 0
-- 3  | Weber   | 1
`),
        note: 'Alle drei Zeitpunkte; `INSTEAD OF` nur mit `FOR EACH ROW`. In BEFORE-Triggern lässt sich `NEW` ändern, `RETURN NULL` überspringt die Zeile.',
        mdn: PG + 'trigger-definition.html'
      },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), aktiv INTEGER DEFAULT 1 NOT NULL);

-- BEFORE: Werte vor dem Speichern anpassen
CREATE TRIGGER kunden_name_bereinigen
BEFORE INSERT ON kunden
FOR EACH ROW
SET NEW.name = TRIM(NEW.name);

INSERT INTO kunden (id, name) VALUES (1, '  Müller '), (2, 'Schmidt');

SELECT id, name, CHAR_LENGTH(name) AS laenge FROM kunden ORDER BY id;
-- id | name    | laenge
-- 1  | Müller  | 6
-- 2  | Schmidt | 7
`),
        note: 'Nur `BEFORE` und `AFTER` auf Tabellen, je Zeile; kein `INSTEAD OF` und keine Trigger auf Views. Ein „Löschen als Deaktivieren“ muss die Anwendung direkt als UPDATE ausführen.',
        mdn: MY + 'trigger-syntax.html'
      },
      mssql: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), aktiv INTEGER DEFAULT 1 NOT NULL);
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber');
GO
CREATE VIEW aktive_kunden AS SELECT id, name FROM kunden WHERE aktiv = 1;
GO
-- DELETE auf der View deaktiviert nur, statt zu löschen
CREATE TRIGGER aktive_kunden_delete
ON aktive_kunden
INSTEAD OF DELETE
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE k SET aktiv = 0
  FROM kunden AS k
  JOIN deleted AS d ON d.id = k.id;
END;
GO
DELETE FROM aktive_kunden WHERE name = 'Schmidt';

SELECT id, name, aktiv FROM kunden ORDER BY id;
-- id | name    | aktiv
-- 1  | Müller  | 1
-- 2  | Schmidt | 0
-- 3  | Weber   | 1
`),
        note: 'Kein `BEFORE`; nur `AFTER` (auch `FOR`) und `INSTEAD OF`, das hier auch auf Tabellen erlaubt ist. Alle Trigger laufen einmal pro Anweisung.',
        mdn: MS + 'statements/create-trigger-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), aktiv INTEGER DEFAULT 1 NOT NULL);
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber');

CREATE VIEW aktive_kunden AS SELECT id, name FROM kunden WHERE aktiv = 1;

-- DELETE auf der View deaktiviert nur, statt zu löschen
CREATE TRIGGER aktive_kunden_delete
INSTEAD OF DELETE ON aktive_kunden
BEGIN
  UPDATE kunden SET aktiv = 0 WHERE id = OLD.id;
END;

DELETE FROM aktive_kunden WHERE name = 'Schmidt';

SELECT id, name, aktiv FROM kunden ORDER BY id;
-- id | name    | aktiv
-- 1  | Müller  | 1
-- 2  | Schmidt | 0
-- 3  | Weber   | 1
`),
        note: 'Immer `FOR EACH ROW`. In BEFORE-Triggern lässt sich `NEW` nicht ändern; berechnete Werte per AFTER-Trigger mit UPDATE oder als generierte Spalte lösen.',
        mdn: SL + 'lang_createtrigger.html'
      }
    },
    tip: 'Prüfungen in BEFORE-Triggern, Folgeaktionen in AFTER-Triggern: Ein AFTER-Trigger sieht garantiert nur Zeilen, die alle Constraints bestanden haben.',
    keywords: ['before', 'after', 'instead of', 'trigger zeitpunkt', 'view trigger', 'for each statement'],
    related: ['CREATE TRIGGER', 'NEW und OLD', 'Aktualisierbare Views', 'Soft Delete'],
    mdn: PG + 'sql-createtrigger.html'
  },
  {
    lang: 'sql', group: 'Trigger & Prozeduren', name: 'NEW und OLD',
    desc: 'Zugriff auf die Zeile nach (NEW) bzw. vor (OLD) der Änderung im Trigger.',
    details: 'Die neue Zeile gibt es bei INSERT und UPDATE, die alte bei UPDATE und DELETE. Über sie lassen sich Änderungen vergleichen und protokollieren, etwa nur reagieren, wenn sich ein Wert wirklich geändert hat. Der Standard benennt beide über `REFERENCING`; die Dialekte nutzen feste Namen oder Pseudotabellen mit allen betroffenen Zeilen.',
    values: [
      ['INSERT', 'nur NEW'],
      ['UPDATE', 'OLD (vorher) und NEW (nachher)'],
      ['DELETE', 'nur OLD']
    ],
    dialects: {
      std: {
        syntax: 'REFERENCING OLD ROW AS alt NEW ROW AS neu   -- Zeilen-Trigger\nREFERENCING OLD TABLE AS alt NEW TABLE AS neu   -- Anweisungs-Trigger',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER);
CREATE TABLE preis_historie (produkt_id INTEGER, alt INTEGER, neu INTEGER);

CREATE TRIGGER preis_merken
AFTER UPDATE OF preis ON produkte
REFERENCING OLD ROW AS vorher NEW ROW AS nachher
FOR EACH ROW
WHEN (vorher.preis IS DISTINCT FROM nachher.preis)   -- nur echte Änderungen
INSERT INTO preis_historie VALUES (nachher.id, vorher.preis, nachher.preis);

INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20);
UPDATE produkte SET preis = 45 WHERE id = 1;
UPDATE produkte SET preis = 20 WHERE id = 2;   -- unverändert, kein Eintrag

SELECT produkt_id, alt, neu FROM preis_historie ORDER BY produkt_id;
-- produkt_id | alt | neu
-- 1          | 50  | 45
`),
        nocheck: true
      },
      pg: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER);
CREATE TABLE preis_historie (produkt_id INTEGER, alt INTEGER, neu INTEGER);

CREATE FUNCTION preis_merken() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO preis_historie VALUES (NEW.id, OLD.preis, NEW.preis);
  RETURN NULL;              -- bei AFTER-Triggern ohne Bedeutung
END $$;

CREATE TRIGGER preis_merken
AFTER UPDATE OF preis ON produkte
FOR EACH ROW
WHEN (OLD.preis IS DISTINCT FROM NEW.preis)   -- nur echte Änderungen
EXECUTE FUNCTION preis_merken();

INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20);
UPDATE produkte SET preis = 45 WHERE id = 1;
UPDATE produkte SET preis = 20 WHERE id = 2;   -- unverändert, kein Eintrag

SELECT produkt_id, alt, neu FROM preis_historie ORDER BY produkt_id;
-- produkt_id | alt | neu
-- 1          | 50  | 45
`),
        note: '`NEW` und `OLD` sind Variablen der Trigger-Funktion; Anweisungs-Trigger erhalten mit `REFERENCING NEW TABLE AS …` Übergangstabellen.',
        mdn: PG + 'plpgsql-trigger.html'
      },
      mysql: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER);
CREATE TABLE preis_historie (produkt_id INTEGER, alt INTEGER, neu INTEGER);

DELIMITER //
CREATE TRIGGER preis_merken
AFTER UPDATE ON produkte
FOR EACH ROW
BEGIN
  IF NOT (OLD.preis <=> NEW.preis) THEN
    INSERT INTO preis_historie VALUES (NEW.id, OLD.preis, NEW.preis);
  END IF;
END //
DELIMITER ;

INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20);
UPDATE produkte SET preis = 45 WHERE id = 1;
UPDATE produkte SET preis = 20 WHERE id = 2;

SELECT produkt_id, alt, neu FROM preis_historie ORDER BY produkt_id;
-- produkt_id | alt | neu
-- 1          | 50  | 45
`),
        note: 'Feste Namen `NEW` und `OLD`; im BEFORE-Trigger ist `NEW` änderbar (`SET NEW.x = …`). Der NULL-sichere Vergleich heißt `<=>`.',
        mdn: MY + 'trigger-syntax.html'
      },
      mssql: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER);
CREATE TABLE preis_historie (produkt_id INTEGER, alt INTEGER, neu INTEGER);
GO
CREATE TRIGGER preis_merken
ON produkte
AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO preis_historie (produkt_id, alt, neu)
  SELECT i.id, d.preis, i.preis
  FROM inserted AS i
  JOIN deleted AS d ON d.id = i.id
  WHERE i.preis IS DISTINCT FROM d.preis;   -- nur echte Änderungen
END;
GO
INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20);
UPDATE produkte SET preis = 45 WHERE id = 1;
UPDATE produkte SET preis = 20 WHERE id = 2;   -- unverändert, kein Eintrag

SELECT produkt_id, alt, neu FROM preis_historie ORDER BY produkt_id;
-- produkt_id | alt | neu
-- 1          | 50  | 45
`),
        note: 'Kein `NEW`/`OLD`: Die Pseudotabellen `inserted` und `deleted` enthalten alle Zeilen der Anweisung und werden über den Schlüssel verknüpft. `IS DISTINCT FROM` seit SQL Server 2022.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/triggers/use-the-inserted-and-deleted-tables'
      },
      sqlite: {
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis INTEGER);
CREATE TABLE preis_historie (produkt_id INTEGER, alt INTEGER, neu INTEGER);

CREATE TRIGGER preis_merken
AFTER UPDATE OF preis ON produkte
WHEN OLD.preis IS NOT NEW.preis      -- nur echte Änderungen
BEGIN
  INSERT INTO preis_historie VALUES (NEW.id, OLD.preis, NEW.preis);
END;

INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 50), (2, 'Maus', 20);
UPDATE produkte SET preis = 45 WHERE id = 1;
UPDATE produkte SET preis = 20 WHERE id = 2;   -- unverändert, kein Eintrag

SELECT produkt_id, alt, neu FROM preis_historie ORDER BY produkt_id;
-- produkt_id | alt | neu
-- 1          | 50  | 45
`),
        note: 'Feste Namen `NEW` und `OLD`, nur lesbar. `IS NOT` ist hier der NULL-sichere Vergleich (seit 3.39 auch `IS DISTINCT FROM`).',
        mdn: SL + 'lang_createtrigger.html'
      }
    },
    tip: 'Für den Vergleich einen NULL-sicheren Operator (`IS DISTINCT FROM`, `<=>`, `IS NOT`) statt `<>` verwenden, sonst werden Änderungen von oder zu `NULL` übersehen.',
    keywords: ['new', 'old', 'inserted', 'deleted', 'trigger variablen', 'alter wert', 'neuer wert', 'referencing'],
    related: ['CREATE TRIGGER', 'Audit-Trigger', 'IS DISTINCT FROM'],
    mdn: PG + 'plpgsql-trigger.html'
  },
  {
    lang: 'sql', group: 'Trigger & Prozeduren', name: 'Audit-Trigger',
    desc: 'Protokolliert jede Änderung einer Tabelle automatisch in einer Log-Tabelle.',
    details: 'Trigger für INSERT, UPDATE und DELETE schreiben Aktion, Schlüssel, alte und neue Werte sowie Zeitpunkt in eine Audit-Tabelle. Weil der Trigger in derselben Transaktion läuft, gibt es keine Änderung ohne Protokoll und kein Protokoll ohne Änderung. Bei hohem Schreibaufkommen kostet das spürbar Leistung.',
    dialects: {
      std: { none: 'Kein eigenes Sprachmittel – ein Muster aus mehreren `CREATE TRIGGER` (Standard-Syntax siehe dort); die Umsetzungen unterscheiden sich je Dialekt.' },
      pg: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE kunden_audit (
  nr INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, aktion VARCHAR(10), kunde_id INTEGER,
  alt VARCHAR(50), neu VARCHAR(50), zeit TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- eine Funktion für alle drei Ereignisse
CREATE FUNCTION kunden_protokollieren() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO kunden_audit (aktion, kunde_id, neu) VALUES (TG_OP, NEW.id, NEW.stadt);
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO kunden_audit (aktion, kunde_id, alt, neu) VALUES (TG_OP, NEW.id, OLD.stadt, NEW.stadt);
  ELSE
    INSERT INTO kunden_audit (aktion, kunde_id, alt) VALUES (TG_OP, OLD.id, OLD.stadt);
  END IF;
  RETURN NULL;
END $$;

CREATE TRIGGER kunden_audit_trg
AFTER INSERT OR UPDATE OR DELETE ON kunden
FOR EACH ROW EXECUTE FUNCTION kunden_protokollieren();

INSERT INTO kunden (id, name, stadt) VALUES (1, 'Müller', 'Berlin');
UPDATE kunden SET stadt = 'Potsdam' WHERE id = 1;
DELETE FROM kunden WHERE id = 1;

SELECT nr, aktion, kunde_id, alt, neu FROM kunden_audit ORDER BY nr;
-- nr | aktion | kunde_id | alt     | neu
-- 1  | INSERT | 1        | NULL    | Berlin
-- 2  | UPDATE | 1        | Berlin  | Potsdam
-- 3  | DELETE | 1        | Potsdam | NULL
`),
        note: '`TG_OP` nennt das Ereignis, `TG_TABLE_NAME` die Tabelle; mit `to_jsonb(OLD)` und `to_jsonb(NEW)` protokolliert eine einzige generische Funktion beliebige Tabellen.',
        mdn: PG + 'plpgsql-trigger.html'
      },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE kunden_audit (
  nr INT AUTO_INCREMENT PRIMARY KEY, aktion VARCHAR(10), kunde_id INTEGER,
  alt VARCHAR(50), neu VARCHAR(50), zeit DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- je Ereignis ein Trigger; ein einzelner Befehl braucht kein BEGIN … END
CREATE TRIGGER kunden_ins AFTER INSERT ON kunden FOR EACH ROW
  INSERT INTO kunden_audit (aktion, kunde_id, neu) VALUES ('INSERT', NEW.id, NEW.stadt);
CREATE TRIGGER kunden_upd AFTER UPDATE ON kunden FOR EACH ROW
  INSERT INTO kunden_audit (aktion, kunde_id, alt, neu) VALUES ('UPDATE', NEW.id, OLD.stadt, NEW.stadt);
CREATE TRIGGER kunden_del AFTER DELETE ON kunden FOR EACH ROW
  INSERT INTO kunden_audit (aktion, kunde_id, alt) VALUES ('DELETE', OLD.id, OLD.stadt);

INSERT INTO kunden (id, name, stadt) VALUES (1, 'Müller', 'Berlin');
UPDATE kunden SET stadt = 'Potsdam' WHERE id = 1;
DELETE FROM kunden WHERE id = 1;

SELECT nr, aktion, kunde_id, alt, neu FROM kunden_audit ORDER BY nr;
-- nr | aktion | kunde_id | alt     | neu
-- 1  | INSERT | 1        | NULL    | Berlin
-- 2  | UPDATE | 1        | Berlin  | Potsdam
-- 3  | DELETE | 1        | Potsdam | NULL
`),
        note: 'Ein Trigger je Ereignis und Zeitpunkt. `CURRENT_USER()` bzw. `USER()` liefern den ausführenden Benutzer fürs Protokoll.',
        mdn: MY + 'trigger-syntax.html'
      },
      mssql: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE kunden_audit (
  nr INT IDENTITY(1,1) PRIMARY KEY, aktion VARCHAR(10), kunde_id INTEGER,
  alt VARCHAR(50), neu VARCHAR(50), zeit DATETIME2 DEFAULT SYSDATETIME()
);
GO
-- ein Trigger für alle drei Ereignisse
CREATE TRIGGER kunden_audit_trg
ON kunden
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO kunden_audit (aktion, kunde_id, alt, neu)
  SELECT CASE WHEN d.id IS NULL THEN 'INSERT'
              WHEN i.id IS NULL THEN 'DELETE'
              ELSE 'UPDATE' END,
         COALESCE(i.id, d.id), d.stadt, i.stadt
  FROM inserted AS i
  FULL JOIN deleted AS d ON d.id = i.id;
END;
GO
INSERT INTO kunden (id, name, stadt) VALUES (1, 'Müller', 'Berlin');
UPDATE kunden SET stadt = 'Potsdam' WHERE id = 1;
DELETE FROM kunden WHERE id = 1;

SELECT nr, aktion, kunde_id, alt, neu FROM kunden_audit ORDER BY nr;
-- nr | aktion | kunde_id | alt     | neu
-- 1  | INSERT | 1        | NULL    | Berlin
-- 2  | UPDATE | 1        | Berlin  | Potsdam
-- 3  | DELETE | 1        | Potsdam | NULL
`),
        note: 'Ein Trigger kann mehrere Ereignisse abdecken; welches es war, ergibt sich aus dem Inhalt von `inserted` und `deleted`. Für lückenlose Historie gibt es außerdem System-Versioned Temporal Tables.',
        mdn: MS + 'statements/create-trigger-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE TABLE kunden_audit (
  nr INTEGER PRIMARY KEY, aktion VARCHAR(10), kunde_id INTEGER,
  alt VARCHAR(50), neu VARCHAR(50), zeit TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER kunden_ins AFTER INSERT ON kunden BEGIN
  INSERT INTO kunden_audit (aktion, kunde_id, neu) VALUES ('INSERT', NEW.id, NEW.stadt);
END;
CREATE TRIGGER kunden_upd AFTER UPDATE ON kunden BEGIN
  INSERT INTO kunden_audit (aktion, kunde_id, alt, neu) VALUES ('UPDATE', NEW.id, OLD.stadt, NEW.stadt);
END;
CREATE TRIGGER kunden_del AFTER DELETE ON kunden BEGIN
  INSERT INTO kunden_audit (aktion, kunde_id, alt) VALUES ('DELETE', OLD.id, OLD.stadt);
END;

INSERT INTO kunden (id, name, stadt) VALUES (1, 'Müller', 'Berlin');
UPDATE kunden SET stadt = 'Potsdam' WHERE id = 1;
DELETE FROM kunden WHERE id = 1;

SELECT nr, aktion, kunde_id, alt, neu FROM kunden_audit ORDER BY nr;
-- nr | aktion | kunde_id | alt     | neu
-- 1  | INSERT | 1        | NULL    | Berlin
-- 2  | UPDATE | 1        | Berlin  | Potsdam
-- 3  | DELETE | 1        | Potsdam | NULL
`),
        note: 'Ein Trigger je Ereignis; Benutzer gibt es nicht, den Akteur muss die Anwendung mitschreiben.',
        mdn: SL + 'lang_createtrigger.html'
      }
    },
    tip: 'Den ausführenden Benutzer mitprotokollieren: in PostgreSQL `current_user` oder eine Sitzungsvariable (`current_setting(\'app.user_id\')`), in SQL Server `SUSER_SNAME()` oder `SESSION_CONTEXT()`.',
    keywords: ['audit', 'protokoll', 'änderungshistorie', 'log tabelle', 'change log', 'history', 'revision', 'tg_op'],
    related: ['CREATE TRIGGER', 'NEW und OLD', 'Soft Delete'],
    mdn: PG + 'plpgsql-trigger.html'
  },
  {
    lang: 'sql', group: 'Trigger & Prozeduren', name: 'Trigger-Validierung (RAISE)',
    desc: 'Bricht eine Änderung im Trigger mit eigener Fehlermeldung ab.',
    details: 'Wenn eine Regel mit `CHECK` nicht ausdrückbar ist, weil sie andere Zeilen oder Tabellen betrifft, prüft ein Trigger und löst einen Fehler aus. Die auslösende Anweisung wird dann komplett zurückgerollt. Der Befehl zum Auslösen eines Fehlers heißt in jedem Dialekt anders; der Standard nutzt `SIGNAL SQLSTATE`.',
    dialects: {
      std: {
        syntax: "SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Meldung';",
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30));

-- Höchstens 2 Mitarbeiter pro Abteilung
CREATE TRIGGER max_zwei_pro_abteilung
BEFORE INSERT ON mitarbeiter
REFERENCING NEW ROW AS neu
FOR EACH ROW
WHEN ((SELECT COUNT(*) FROM mitarbeiter WHERE abteilung = neu.abteilung) >= 2)
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Abteilung ist voll';

INSERT INTO mitarbeiter (id, name, abteilung) VALUES (1, 'Ada', 'IT');
INSERT INTO mitarbeiter (id, name, abteilung) VALUES (2, 'Lin', 'IT');
-- INSERT INTO mitarbeiter (id, name, abteilung) VALUES (3, 'Max', 'IT');
--   -> Fehler: Abteilung ist voll

SELECT name FROM mitarbeiter ORDER BY id;
-- name
-- Ada
-- Lin
`),
        nocheck: true
      },
      pg: {
        syntax: "RAISE EXCEPTION 'Meldung %', wert [USING ERRCODE = '…'];   -- PL/pgSQL",
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30));

-- Höchstens 2 Mitarbeiter pro Abteilung
CREATE FUNCTION max_zwei_pruefen() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT COUNT(*) FROM mitarbeiter WHERE abteilung = NEW.abteilung) >= 2 THEN
    RAISE EXCEPTION 'Abteilung % ist voll', NEW.abteilung
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER max_zwei_pro_abteilung
BEFORE INSERT ON mitarbeiter
FOR EACH ROW EXECUTE FUNCTION max_zwei_pruefen();

INSERT INTO mitarbeiter (id, name, abteilung) VALUES (1, 'Ada', 'IT');
INSERT INTO mitarbeiter (id, name, abteilung) VALUES (2, 'Lin', 'IT');
-- INSERT INTO mitarbeiter (id, name, abteilung) VALUES (3, 'Max', 'IT');
--   -> ERROR: Abteilung IT ist voll

SELECT name FROM mitarbeiter ORDER BY id;
-- name
-- Ada
-- Lin
`),
        note: '`%` in der Meldung wird durch die folgenden Argumente ersetzt; `USING ERRCODE` setzt den SQLSTATE, den die Anwendung auswerten kann.',
        mdn: PG + 'plpgsql-errors-and-messages.html'
      },
      mysql: {
        syntax: "SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Meldung';",
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30));

-- Höchstens 2 Mitarbeiter pro Abteilung
DELIMITER //
CREATE TRIGGER max_zwei_pro_abteilung
BEFORE INSERT ON mitarbeiter
FOR EACH ROW
BEGIN
  IF (SELECT COUNT(*) FROM mitarbeiter WHERE abteilung = NEW.abteilung) >= 2 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Abteilung ist voll';
  END IF;
END //
DELIMITER ;

INSERT INTO mitarbeiter (id, name, abteilung) VALUES (1, 'Ada', 'IT');
INSERT INTO mitarbeiter (id, name, abteilung) VALUES (2, 'Lin', 'IT');
-- INSERT INTO mitarbeiter (id, name, abteilung) VALUES (3, 'Max', 'IT');
--   -> ERROR 1644 (45000): Abteilung ist voll

SELECT name FROM mitarbeiter ORDER BY id;
-- name
-- Ada
-- Lin
`),
        note: '`SIGNAL` wie im Standard; SQLSTATE `45000` steht für „benutzerdefinierter Fehler“ (Fehlernummer 1644).',
        mdn: MY + 'signal.html'
      },
      mssql: {
        syntax: "THROW 50001, 'Meldung', 1;   -- Nummer ab 50000, Meldung, Status",
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30));
GO
-- Höchstens 2 Mitarbeiter pro Abteilung (AFTER-Trigger prüft das Ergebnis)
CREATE TRIGGER max_zwei_pro_abteilung
ON mitarbeiter
AFTER INSERT
AS
BEGIN
  SET NOCOUNT ON;
  IF EXISTS (SELECT m.abteilung
             FROM mitarbeiter AS m
             WHERE m.abteilung IN (SELECT abteilung FROM inserted)
             GROUP BY m.abteilung
             HAVING COUNT(*) > 2)
    THROW 50001, 'Abteilung ist voll', 1;
END;
GO
INSERT INTO mitarbeiter (id, name, abteilung) VALUES (1, 'Ada', 'IT');
INSERT INTO mitarbeiter (id, name, abteilung) VALUES (2, 'Lin', 'IT');
-- INSERT INTO mitarbeiter (id, name, abteilung) VALUES (3, 'Max', 'IT');
--   -> Meldung 50001: Abteilung ist voll

SELECT name FROM mitarbeiter ORDER BY id;
-- name
-- Ada
-- Lin
`),
        note: 'Ohne BEFORE-Trigger prüft ein AFTER-Trigger den Zustand nach der Änderung; `THROW` bricht ab und rollt die auslösende Anweisung zurück. Älter: `RAISERROR`.',
        mdn: MS + 'language-elements/throw-transact-sql'
      },
      sqlite: {
        syntax: "SELECT RAISE(ABORT, 'Meldung');   -- auch IGNORE, FAIL, ROLLBACK",
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30));

-- Höchstens 2 Mitarbeiter pro Abteilung
CREATE TRIGGER max_zwei_pro_abteilung
BEFORE INSERT ON mitarbeiter
WHEN (SELECT COUNT(*) FROM mitarbeiter WHERE abteilung = NEW.abteilung) >= 2
BEGIN
  SELECT RAISE(ABORT, 'Abteilung ist voll');
END;

INSERT INTO mitarbeiter (id, name, abteilung) VALUES (1, 'Ada', 'IT');
INSERT INTO mitarbeiter (id, name, abteilung) VALUES (2, 'Lin', 'IT');
-- INSERT INTO mitarbeiter (id, name, abteilung) VALUES (3, 'Max', 'IT');
--   -> Runtime error: Abteilung ist voll

SELECT name FROM mitarbeiter ORDER BY id;
-- name
-- Ada
-- Lin
`),
        note: '`RAISE(ABORT, …)` rollt die Anweisung zurück, `RAISE(IGNORE)` überspringt still die Zeile, `RAISE(ROLLBACK, …)` verwirft die ganze Transaktion, `RAISE(FAIL, …)` behält bisherige Zeilen.',
        mdn: SL + 'lang_createtrigger.html'
      }
    },
    tip: 'Solche Prüfungen sind bei parallelen Transaktionen nicht dicht (beide zählen 1 und fügen ein); dafür SERIALIZABLE oder eine Sperre auf die betroffenen Zeilen verwenden.',
    keywords: ['raise', 'raise abort', 'raise exception', 'signal', 'throw', 'validierung', 'geschäftsregel', 'fehler auslösen', 'sqlstate 45000'],
    related: ['CREATE TRIGGER', 'CHECK', 'BEFORE / AFTER / INSTEAD OF'],
    mdn: SL + 'lang_createtrigger.html'
  },
  {
    lang: 'sql', group: 'Trigger & Prozeduren', name: 'DROP TRIGGER',
    desc: 'Entfernt einen Trigger; die Tabelle und ihre Daten bleiben erhalten.',
    details: 'Mit `IF EXISTS` gibt es keinen Fehler, wenn der Trigger fehlt. Beim Löschen einer Tabelle verschwinden ihre Trigger automatisch. Ändern geht meist nicht direkt: Trigger löschen und neu anlegen, sofern der Dialekt kein `CREATE OR REPLACE`/`CREATE OR ALTER` kennt. Manche Dialekte können Trigger auch nur vorübergehend abschalten.',
    dialects: {
      std: {
        syntax: 'DROP TRIGGER name;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, preis INTEGER);
CREATE TRIGGER preis_pruefen
BEFORE UPDATE OF preis ON produkte
REFERENCING NEW ROW AS neu
FOR EACH ROW
WHEN (neu.preis < 0)
SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Preis darf nicht negativ sein';

DROP TRIGGER preis_pruefen;

SELECT COUNT(*) AS trigger_anzahl FROM information_schema.triggers;
-- trigger_anzahl
-- 0
`),
        nocheck: true
      },
      pg: {
        syntax: 'DROP TRIGGER [IF EXISTS] name ON tabelle [CASCADE];\nALTER TABLE tabelle { DISABLE | ENABLE } TRIGGER { name | USER | ALL };',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, preis INTEGER);
CREATE FUNCTION preis_behalten() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.preis := COALESCE(NEW.preis, OLD.preis);   -- NULL ignorieren
  RETURN NEW;
END $$;
CREATE TRIGGER preis_nie_null BEFORE UPDATE ON produkte
FOR EACH ROW EXECUTE FUNCTION preis_behalten();

SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'produkte';
-- trigger_name
-- preis_nie_null

DROP TRIGGER IF EXISTS preis_nie_null ON produkte;

SELECT COUNT(*) AS trigger_anzahl FROM information_schema.triggers WHERE event_object_table = 'produkte';
-- trigger_anzahl
-- 0
`),
        note: 'Ein Trigger gehört zu einer Tabelle, daher `ON tabelle`; die Trigger-Funktion bleibt bestehen (`DROP FUNCTION`). Für Massenimporte `ALTER TABLE t DISABLE TRIGGER USER` statt löschen.',
        mdn: PG + 'sql-droptrigger.html'
      },
      mysql: {
        syntax: 'DROP TRIGGER [IF EXISTS] [schema.]name;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, preis INTEGER);
CREATE TRIGGER preis_nie_null BEFORE UPDATE ON produkte
FOR EACH ROW SET NEW.preis = COALESCE(NEW.preis, OLD.preis);

SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema = DATABASE();
-- trigger_name
-- preis_nie_null

DROP TRIGGER IF EXISTS preis_nie_null;

SELECT COUNT(*) AS trigger_anzahl FROM information_schema.triggers WHERE trigger_schema = DATABASE();
-- trigger_anzahl
-- 0
`),
        note: 'Trigger lassen sich nicht abschalten, nur löschen und neu anlegen; `SHOW TRIGGERS` listet sie.',
        mdn: MY + 'drop-trigger.html'
      },
      mssql: {
        syntax: 'DROP TRIGGER [IF EXISTS] name;\n{ DISABLE | ENABLE } TRIGGER { name | ALL } ON tabelle;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, preis INTEGER);
GO
CREATE TRIGGER preis_nie_null ON produkte AFTER UPDATE AS
BEGIN
  SET NOCOUNT ON;
  UPDATE p SET preis = d.preis
  FROM produkte AS p
  JOIN inserted AS i ON i.id = p.id
  JOIN deleted AS d ON d.id = p.id
  WHERE i.preis IS NULL;
END;
GO
SELECT name FROM sys.triggers;
-- name
-- preis_nie_null

DROP TRIGGER IF EXISTS preis_nie_null;

SELECT COUNT(*) AS trigger_anzahl FROM sys.triggers;
-- trigger_anzahl
-- 0
`),
        note: '`IF EXISTS` seit SQL Server 2016; ändern mit `CREATE OR ALTER TRIGGER`. Vorübergehend abschalten mit `DISABLE TRIGGER name ON tabelle`.',
        mdn: MS + 'statements/drop-trigger-transact-sql'
      },
      sqlite: {
        syntax: 'DROP TRIGGER [IF EXISTS] name;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, preis INTEGER);
CREATE TRIGGER preis_nie_null BEFORE UPDATE ON produkte
WHEN NEW.preis IS NULL
BEGIN
  SELECT RAISE(IGNORE);
END;

SELECT name FROM sqlite_schema WHERE type = 'trigger';
-- name
-- preis_nie_null

DROP TRIGGER IF EXISTS preis_nie_null;

SELECT COUNT(*) AS trigger_anzahl FROM sqlite_schema WHERE type = 'trigger';
-- trigger_anzahl
-- 0
`),
        note: 'Trigger lassen sich nicht abschalten; die Liste steht in `sqlite_schema`.',
        mdn: SL + 'lang_droptrigger.html'
      }
    },
    tip: 'Trigger-Änderungen wie Schemaänderungen behandeln: in einer Migration löschen und neu anlegen, damit alle Umgebungen denselben Stand haben.',
    keywords: ['drop trigger', 'trigger löschen', 'disable trigger', 'trigger entfernen', 'trigger deaktivieren'],
    related: ['CREATE TRIGGER', 'sqlite_schema', 'DROP TABLE'],
    mdn: PG + 'sql-droptrigger.html'
  },
  {
    lang: 'sql', group: 'Trigger & Prozeduren', name: 'CREATE FUNCTION',
    desc: 'Definiert eine eigene Funktion in der Datenbank, aufrufbar in jeder Abfrage.',
    details: 'Benutzerdefinierte Funktionen kapseln Berechnungen und liefern einen Wert, in manchen Dialekten auch eine Tabelle. Sie werden wie eingebaute Funktionen in `SELECT`, `WHERE` usw. aufgerufen. Angaben wie „deterministisch“ helfen dem Optimierer und sind Voraussetzung für Indizes auf Funktionsaufrufe.',
    dialects: {
      std: {
        syntax: 'CREATE FUNCTION name(param typ, …)\nRETURNS typ\nLANGUAGE SQL\nRETURN ausdruck;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 49.50), (2, 'Maus', 19.50);

CREATE FUNCTION brutto(netto DECIMAL(10,2))
RETURNS DECIMAL(10,2)
LANGUAGE SQL
RETURN ROUND(netto * 1.19, 2);

SELECT name, brutto(preis) AS preis_brutto FROM produkte ORDER BY id;
-- name     | preis_brutto
-- Tastatur | 58.91
-- Maus     | 23.21
`)
      },
      pg: {
        syntax: 'CREATE [OR REPLACE] FUNCTION name(param typ [DEFAULT …], …)\nRETURNS typ | TABLE (…)\nLANGUAGE sql | plpgsql\n[IMMUTABLE | STABLE | VOLATILE]\nRETURN ausdruck | AS $$ … $$;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag DECIMAL(10,2));
INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 49.50), (2, 'Maus', 19.50);
INSERT INTO bestellungen (id, kunde_id, betrag) VALUES (1, 1, 120), (2, 2, 80), (3, 1, 45);

CREATE OR REPLACE FUNCTION brutto(netto numeric, satz numeric DEFAULT 0.19)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
RETURN round(netto * (1 + satz), 2);

SELECT name, brutto(preis) AS preis_brutto, brutto(preis, 0.07) AS ermaessigt
FROM produkte ORDER BY id;
-- name     | preis_brutto | ermaessigt
-- Tastatur | 58.91        | 52.97
-- Maus     | 23.21        | 20.87

-- Tabellenfunktion, nutzbar in FROM
CREATE FUNCTION bestellungen_von(k_id integer)
RETURNS TABLE (bestell_id integer, summe numeric)
LANGUAGE sql STABLE
AS $$ SELECT id, betrag FROM bestellungen WHERE kunde_id = k_id $$;

SELECT bestell_id, summe FROM bestellungen_von(1) ORDER BY bestell_id;
-- bestell_id | summe
-- 1          | 120.00
-- 3          | 45.00
`),
        note: '`IMMUTABLE` (gleiche Eingabe, gleiches Ergebnis) erlaubt Ausdrucksindizes; Standardwerte für Parameter und `RETURNS TABLE` sind Erweiterungen. Die `RETURN`-Kurzform gibt es seit 14.',
        mdn: PG + 'sql-createfunction.html'
      },
      mysql: {
        syntax: 'CREATE FUNCTION name(param typ, …)\nRETURNS typ\n[DETERMINISTIC | NOT DETERMINISTIC] [READS SQL DATA | NO SQL]\nRETURN ausdruck;   -- oder BEGIN … END mit DELIMITER',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 49.50), (2, 'Maus', 19.50);

CREATE FUNCTION brutto(netto DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
RETURN ROUND(netto * 1.19, 2);

SELECT name, brutto(preis) AS preis_brutto FROM produkte ORDER BY id;
-- name     | preis_brutto
-- Tastatur | 58.91
-- Maus     | 23.21
`),
        note: 'Bei aktivem Binärlog muss die Funktion `DETERMINISTIC`, `NO SQL` oder `READS SQL DATA` angeben. Keine Tabellenfunktionen; mehrteilige Rümpfe brauchen `BEGIN … END` und `DELIMITER`.',
        mdn: MY + 'create-procedure.html'
      },
      mssql: {
        syntax: 'CREATE [OR ALTER] FUNCTION dbo.name(@param typ, …)\nRETURNS typ\nAS\nBEGIN\n  RETURN ausdruck;\nEND;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte (id, name, preis) VALUES (1, 'Tastatur', 49.50), (2, 'Maus', 19.50);
GO
CREATE FUNCTION dbo.brutto(@netto DECIMAL(10,2))
RETURNS DECIMAL(10,2)
AS
BEGIN
  RETURN ROUND(@netto * 1.19, 2);
END;
GO
SELECT name, dbo.brutto(preis) AS preis_brutto FROM produkte ORDER BY id;
-- name     | preis_brutto
-- Tastatur | 58.91
-- Maus     | 23.21
`),
        note: 'Parameter beginnen mit `@`, der Aufruf braucht das Schema (`dbo.brutto`). Tabellenwertige Funktionen: `RETURNS TABLE AS RETURN (SELECT …)`.',
        mdn: MS + 'statements/create-function-transact-sql'
      },
      sqlite: { none: 'Kein `CREATE FUNCTION`; Funktionen registriert die Anwendung über die API, z. B. in Python `con.create_function("brutto", 1, lambda n: round(n * 1.19, 2))`.', mdn: SL + 'appfunc.html' }
    },
    tip: 'Funktionen in `WHERE` verhindern oft die Nutzung von Indizes – für häufig gefilterte Ausdrücke einen Index auf genau diesen (deterministischen) Funktionsaufruf anlegen.',
    keywords: ['create function', 'benutzerdefinierte funktion', 'user defined function', 'udf', 'plpgsql', 'immutable', 'deterministic', 'tabellenfunktion'],
    related: ['Stored Procedure', 'Variablen & Kontrollfluss (PL/pgSQL)', 'Ausdrucksindex'],
    mdn: PG + 'sql-createfunction.html'
  },
  {
    lang: 'sql', group: 'Trigger & Prozeduren', name: 'Stored Procedure',
    desc: 'Gespeicherte Prozedur: serverseitige Logik, aufgerufen mit CALL bzw. EXEC.',
    details: 'Prozeduren bündeln mehrere Anweisungen auf dem Server und werden mit `CALL` aufgerufen. Anders als Funktionen liefern sie keinen Wert in einem Ausdruck, haben aber Ein- und Ausgabeparameter und können je nach Dialekt Ergebnismengen zurückgeben oder Transaktionen steuern. Vorteil sind weniger Netzwerk-Roundtrips und zentrale Logik, Nachteil die schwerere Versionierung und Testbarkeit.',
    values: [
      ['IN', 'Eingabeparameter (Standard)'],
      ['OUT', 'Ausgabeparameter'],
      ['INOUT', 'Ein- und Ausgabe']
    ],
    dialects: {
      std: {
        syntax: 'CREATE PROCEDURE name([IN | OUT | INOUT] param typ, …)\nLANGUAGE SQL\nBEGIN ATOMIC\n  anweisungen;\nEND;\nCALL name(argumente);',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo DECIMAL(10,2));
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);

CREATE PROCEDURE ueberweisen(IN von INTEGER, IN an INTEGER, IN betrag DECIMAL(10,2))
LANGUAGE SQL
BEGIN ATOMIC
  UPDATE konten SET saldo = saldo - betrag WHERE id = von;
  UPDATE konten SET saldo = saldo + betrag WHERE id = an;
END;

CALL ueberweisen(1, 2, 200);

SELECT inhaber, saldo FROM konten ORDER BY id;
-- inhaber | saldo
-- Ada     | 300.00
-- Lin     | 300.00
`)
      },
      pg: {
        syntax: 'CREATE [OR REPLACE] PROCEDURE name(param typ, …)\nLANGUAGE plpgsql\nAS $$ BEGIN … END $$;\nCALL name(argumente);',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo DECIMAL(10,2));
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);

CREATE OR REPLACE PROCEDURE ueberweisen(von int, an int, betrag numeric)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE konten SET saldo = saldo - betrag WHERE id = von;
  UPDATE konten SET saldo = saldo + betrag WHERE id = an;
  IF (SELECT saldo FROM konten WHERE id = von) < 0 THEN
    RAISE EXCEPTION 'Konto % nicht gedeckt', von;
  END IF;
END;
$$;

CALL ueberweisen(1, 2, 200);
-- CALL ueberweisen(2, 1, 900);  -> ERROR: Konto 2 nicht gedeckt

SELECT inhaber, saldo FROM konten ORDER BY id;
-- inhaber | saldo
-- Ada     | 300.00
-- Lin     | 300.00
`),
        note: 'Prozeduren gibt es seit PostgreSQL 11; anders als Funktionen dürfen sie selbst `COMMIT` und `ROLLBACK` ausführen (nicht innerhalb eines expliziten `BEGIN`). Die Standard-Form mit `BEGIN ATOMIC` geht seit 14.',
        mdn: PG + 'sql-createprocedure.html'
      },
      mysql: {
        syntax: 'DELIMITER //\nCREATE PROCEDURE name(IN param typ, OUT …)\nBEGIN\n  anweisungen;\nEND //\nDELIMITER ;\nCALL name(argumente);',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo DECIMAL(10,2));
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);

DELIMITER //
CREATE PROCEDURE ueberweisen(IN von INT, IN an INT, IN betrag DECIMAL(10,2))
BEGIN
  UPDATE konten SET saldo = saldo - betrag WHERE id = von;
  UPDATE konten SET saldo = saldo + betrag WHERE id = an;
  IF (SELECT saldo FROM konten WHERE id = von) < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Konto nicht gedeckt';
  END IF;
END //
DELIMITER ;

CALL ueberweisen(1, 2, 200);

SELECT inhaber, saldo FROM konten ORDER BY id;
-- inhaber | saldo
-- Ada     | 300.00
-- Lin     | 300.00
`),
        note: 'Der Rumpf enthält `;`, daher im Client `DELIMITER` umstellen. Ein `SELECT` in der Prozedur liefert eine Ergebnismenge an den Aufrufer; `OUT`-Parameter landen in Variablen (`CALL p(@x); SELECT @x;`).',
        mdn: MY + 'create-procedure.html'
      },
      mssql: {
        syntax: 'CREATE [OR ALTER] PROCEDURE dbo.name @param typ, …\nAS\nBEGIN\n  anweisungen;\nEND;\nEXEC dbo.name @param = wert;',
        example: e(`
CREATE TABLE konten (id INTEGER PRIMARY KEY, inhaber VARCHAR(50), saldo DECIMAL(10,2));
INSERT INTO konten (id, inhaber, saldo) VALUES (1, 'Ada', 500), (2, 'Lin', 100);
GO
CREATE PROCEDURE dbo.ueberweisen @von INT, @an INT, @betrag DECIMAL(10,2)
AS
BEGIN
  SET NOCOUNT ON;
  SET XACT_ABORT ON;
  BEGIN TRANSACTION;
  UPDATE konten SET saldo = saldo - @betrag WHERE id = @von;
  UPDATE konten SET saldo = saldo + @betrag WHERE id = @an;
  IF (SELECT saldo FROM konten WHERE id = @von) < 0
    THROW 50001, 'Konto nicht gedeckt', 1;
  COMMIT;
END;
GO
EXEC dbo.ueberweisen @von = 1, @an = 2, @betrag = 200;

SELECT inhaber, saldo FROM konten ORDER BY id;
-- inhaber | saldo
-- Ada     | 300.00
-- Lin     | 300.00
`),
        note: 'Aufruf mit `EXEC`/`EXECUTE`, Parameter mit `@`, Ausgabeparameter mit `OUTPUT`. Ein `SELECT` in der Prozedur liefert eine Ergebnismenge; `RETURN n` einen Statuscode.',
        mdn: MS + 'statements/create-procedure-transact-sql'
      },
      sqlite: { none: 'Keine Stored Procedures; die Logik gehört in die Anwendung, wiederkehrende Abläufe evtl. in Trigger oder Views.' }
    },
    tip: 'Prozeduren wie Anwendungscode behandeln: in Migrationsdateien versionieren und mit `CREATE OR REPLACE` bzw. `CREATE OR ALTER` ausrollen, nie nur von Hand in der Produktion ändern.',
    keywords: ['stored procedure', 'gespeicherte prozedur', 'prozedur', 'call', 'exec', 'create procedure', 'sp'],
    related: ['CREATE FUNCTION', 'Variablen & Kontrollfluss (PL/pgSQL)', 'Datenbank-Migrationen'],
    mdn: PG + 'sql-createprocedure.html'
  },
  {
    lang: 'sql', group: 'Trigger & Prozeduren', name: 'Variablen & Kontrollfluss (PL/pgSQL)',
    desc: 'Prozedurale Erweiterungen mit Variablen, IF, Schleifen und Fehlerbehandlung.',
    details: 'Für Logik, die über eine einzelne Abfrage hinausgeht, hat jeder Server eine prozedurale Sprache: Variablen deklarieren, Abfrageergebnisse zuweisen, mit `IF` verzweigen, mit Schleifen über Zeilen laufen und Fehler abfangen. Der Standard heißt SQL/PSM; in der Praxis nutzt man PL/pgSQL (PostgreSQL), T-SQL (SQL Server) bzw. die Stored-Program-Syntax von MySQL.',
    dialects: {
      std: { none: 'SQL/PSM (ISO 9075-4) definiert `DECLARE`, `IF`, `WHILE`, `FOR` und Handler innerhalb von Routinen; umgesetzt ist es nur ähnlich in MySQL, sonst hat jedes System eine eigene Sprache.' },
      pg: {
        syntax: 'DO $$\nDECLARE\n  var typ [:= wert];\nBEGIN\n  IF … THEN … ELSIF … ELSE … END IF;\n  FOR r IN SELECT … LOOP … END LOOP;\nEXCEPTION WHEN … THEN …\nEND $$;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, NULL), (3, 'Weber');

DO $$
DECLARE
  anzahl integer;
  r record;
BEGIN
  SELECT COUNT(*) INTO anzahl FROM kunden;
  RAISE NOTICE 'Kunden: %', anzahl;

  FOR r IN SELECT id, name FROM kunden ORDER BY id LOOP
    IF r.name IS NULL THEN
      RAISE NOTICE 'Kunde % ohne Namen', r.id;
    END IF;
  END LOOP;
EXCEPTION
  WHEN undefined_table THEN
    RAISE NOTICE 'Tabelle fehlt';
END $$;
-- NOTICE:  Kunden: 3
-- NOTICE:  Kunde 2 ohne Namen
`),
        note: '`DO` führt einen anonymen Block aus; derselbe Rumpf steht in Funktionen und Prozeduren. `RAISE NOTICE` gibt Meldungen aus, `%` ist der Platzhalter.',
        mdn: PG + 'plpgsql.html'
      },
      mysql: {
        syntax: 'BEGIN\n  DECLARE var typ DEFAULT wert;\n  IF … THEN … ELSEIF … ELSE … END IF;\n  WHILE … DO … END WHILE;\nEND',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, NULL), (3, 'Weber');

DELIMITER //
CREATE PROCEDURE kunden_pruefen()
BEGIN
  DECLARE anzahl INT DEFAULT 0;
  DECLARE i INT DEFAULT 1;
  DECLARE ohne_namen INT DEFAULT 0;

  SELECT COUNT(*) INTO anzahl FROM kunden;
  WHILE i <= anzahl DO
    IF (SELECT name FROM kunden WHERE id = i) IS NULL THEN
      SET ohne_namen = ohne_namen + 1;
    END IF;
    SET i = i + 1;
  END WHILE;

  SELECT anzahl AS anzahl, ohne_namen AS ohne_namen;
END //
DELIMITER ;

CALL kunden_pruefen();
-- anzahl | ohne_namen
-- 3      | 1
`),
        note: 'Kontrollfluss nur in Prozeduren, Funktionen, Triggern und Events, nicht als anonymer Block. Fehler fängt `DECLARE … HANDLER FOR …` ab; Sitzungsvariablen (`@x`) gehen auch außerhalb.',
        mdn: MY + 'flow-control-statements.html'
      },
      mssql: {
        syntax: 'DECLARE @var typ = wert;\nIF … BEGIN … END ELSE BEGIN … END;\nWHILE … BEGIN … END;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, NULL), (3, 'Weber');

DECLARE @anzahl INT, @i INT = 1, @ohne_namen INT = 0;

SELECT @anzahl = COUNT(*) FROM kunden;
WHILE @i <= @anzahl
BEGIN
  IF (SELECT name FROM kunden WHERE id = @i) IS NULL
    SET @ohne_namen += 1;
  SET @i += 1;
END;

PRINT CONCAT('Kunden: ', @anzahl);
SELECT @anzahl AS anzahl, @ohne_namen AS ohne_namen;
-- anzahl | ohne_namen
-- 3      | 1
`),
        note: 'T-SQL braucht keinen umschließenden Block: Variablen (`@name`) gelten bis zum Ende des Batches. Fehlerbehandlung mit `BEGIN TRY … END TRY BEGIN CATCH … END CATCH`.',
        mdn: MS + 'language-elements/control-of-flow'
      },
      sqlite: { none: 'Keine prozedurale Sprache; Schleifen und Verzweigungen gehören in die Anwendung, manches lässt sich mit `CASE` und rekursiven CTEs lösen.' }
    },
    tip: 'Zeilenweise Schleifen sind langsam – was sich als ein einziges UPDATE oder INSERT … SELECT formulieren lässt, ist fast immer um Größenordnungen schneller.',
    keywords: ['plpgsql', 'pl/pgsql', 'do block', 'declare', 'if', 'loop', 'schleife', 't-sql', 'pl/sql', 'variablen', 'raise notice', 'while', 'sql/psm'],
    related: ['CREATE FUNCTION', 'Stored Procedure', 'Trigger-Validierung (RAISE)'],
    mdn: PG + 'plpgsql.html'
  },

  // ---------------- Rechte & Sicherheit ----------------
  {
    lang: 'sql', group: 'Rechte & Sicherheit', name: 'Benutzer & Rollen',
    desc: 'Datenbankkonten und Rollen bündeln Rechte und regeln, wer sich anmelden darf.',
    details: 'Ein Benutzer ist ein Konto, das sich anmelden darf; eine Rolle bündelt Rechte und wird Benutzern oder anderen Rollen zugewiesen, die diese Rechte dann erben. Der Standard kennt `CREATE ROLE` und `GRANT rolle TO …`, das Anlegen von Benutzern ist dagegen herstellerspezifisch. Rollen und Benutzer gelten meist für den ganzen Server, nicht nur für eine Datenbank.',
    values: [
      ['Benutzer', 'Konto mit Anmeldung (Passwort, Zertifikat, …)'],
      ['Rolle', 'Bündel von Rechten, zuweisbar an Benutzer und Rollen'],
      ['Superuser / Admin', 'umgeht alle Rechteprüfungen – sparsam vergeben']
    ],
    dialects: {
      std: {
        syntax: 'CREATE ROLE name;\nGRANT rolle TO empfaenger [WITH ADMIN OPTION];\nREVOKE rolle FROM empfaenger;\nDROP ROLE name;',
        example: e(`
CREATE ROLE leser;
CREATE ROLE schreiber;
GRANT leser TO schreiber;          -- schreiber erbt die Rechte von leser

-- Benutzer anlegen ist nicht genormt; ein vorhandener Benutzer erhält die Rolle:
GRANT schreiber TO app_backend;

REVOKE leser FROM schreiber;
DROP ROLE leser;
`),
        nocheck: true
      },
      pg: {
        syntax: "CREATE ROLE name [WITH] [LOGIN] [PASSWORD '…'] [CREATEDB] [CREATEROLE];\nCREATE USER name …;   -- = CREATE ROLE … LOGIN",
        example: e(`
CREATE ROLE leser NOLOGIN;                         -- Gruppenrolle
CREATE ROLE schreiber NOLOGIN;
GRANT leser TO schreiber;                          -- schreiber erbt leser

CREATE ROLE app_backend LOGIN PASSWORD 'geheim';  -- Benutzer
GRANT schreiber TO app_backend;

ALTER ROLE app_backend CONNECTION LIMIT 20;
DROP ROLE IF EXISTS alter_benutzer;
`),
        nocheck: true,
        note: 'Alles ist eine Rolle: mit `LOGIN` ein Benutzer, ohne eine Gruppe. Weitere Attribute: `SUPERUSER`, `CREATEDB`, `CREATEROLE`, `INHERIT` (Standard). In psql listet `\\du` alle Rollen.',
        mdn: PG + 'sql-createrole.html'
      },
      mysql: {
        syntax: "CREATE USER 'name'@'host' IDENTIFIED BY '…';\nCREATE ROLE rolle;\nGRANT rolle TO 'name'@'host';\nSET DEFAULT ROLE ALL TO 'name'@'host';",
        example: e(`
CREATE ROLE leser, schreiber;
GRANT SELECT ON shop.* TO leser;
GRANT leser TO schreiber;                               -- schreiber erbt leser

CREATE USER 'app_backend'@'%' IDENTIFIED BY 'geheim';   -- Benutzer@Host
GRANT schreiber TO 'app_backend'@'%';
SET DEFAULT ROLE ALL TO 'app_backend'@'%';              -- Rollen beim Login aktiv

ALTER USER 'app_backend'@'%' WITH MAX_USER_CONNECTIONS 20;
DROP USER IF EXISTS 'alter_benutzer'@'%';
`),
        nocheck: true,
        note: 'Ein Benutzer ist immer `\'name\'@\'host\'` – dieselbe Kennung von zwei Hosts sind zwei Konten. Rollen seit 8.0; sie wirken erst, wenn sie aktiv sind (`SET DEFAULT ROLE` oder `SET ROLE`).',
        mdn: MY + 'roles.html'
      },
      mssql: {
        syntax: "CREATE LOGIN name WITH PASSWORD = '…';   -- Server\nCREATE USER name FOR LOGIN name;         -- Datenbank\nCREATE ROLE rolle;\nALTER ROLE rolle ADD MEMBER name;",
        example: e(`
-- Server-Ebene: Login
CREATE LOGIN app_backend WITH PASSWORD = 'Geheim!2026';

-- Datenbank-Ebene: Benutzer und Rollen
CREATE USER app_backend FOR LOGIN app_backend;
CREATE ROLE leser;
CREATE ROLE schreiber;
ALTER ROLE leser ADD MEMBER schreiber;           -- schreiber erbt leser
ALTER ROLE schreiber ADD MEMBER app_backend;
ALTER ROLE db_datareader ADD MEMBER leser;       -- feste Rolle: alle Tabellen lesen

DROP USER IF EXISTS alter_benutzer;
`),
        nocheck: true,
        note: 'Zwei Ebenen: Logins (Server) und Benutzer (je Datenbank). Feste Rollen wie `db_datareader`, `db_datawriter` und `db_owner` decken typische Fälle ab.',
        mdn: MS + 'statements/create-user-transact-sql'
      },
      sqlite: { none: 'Keine Benutzerverwaltung: Wer die Datei lesen bzw. schreiben darf, regelt allein das Dateisystem. Nur lesend öffnen mit `sqlite3 -readonly` bzw. der URI `file:shop.db?mode=ro`.' }
    },
    tip: 'Rechte nie direkt an Personen oder Dienste vergeben, sondern an Gruppenrollen – dann genügt bei Wechseln ein `GRANT`/`REVOKE` der Rolle.',
    keywords: ['benutzer', 'user', 'rolle', 'role', 'create user', 'create role', 'login', 'gruppe', 'konto', 'create login'],
    related: ['GRANT', 'REVOKE', 'Prinzip der minimalen Rechte'],
    mdn: PG + 'sql-createrole.html'
  },
  {
    lang: 'sql', group: 'Rechte & Sicherheit', name: 'GRANT',
    desc: 'Erteilt Rollen oder Benutzern Rechte auf Tabellen, Schemas und andere Objekte.',
    details: 'Rechte gibt es pro Objekt und Aktion: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `REFERENCES`, `EXECUTE` (Funktion/Prozedur) usw. Spaltenrechte schränken auf einzelne Spalten ein. `WITH GRANT OPTION` erlaubt dem Empfänger, das Recht weiterzugeben. Wie man Rechte für ganze Schemas oder künftige Tabellen vergibt, ist dialektabhängig.',
    values: [
      ['SELECT / INSERT / UPDATE / DELETE', 'Lesen und Ändern von Zeilen'],
      ['ALL [PRIVILEGES]', 'alle Rechte auf das Objekt'],
      ['UPDATE (spalte)', 'Recht nur für bestimmte Spalten'],
      ['EXECUTE', 'Funktion/Prozedur aufrufen'],
      ['WITH GRANT OPTION', 'Empfänger darf das Recht weitergeben']
    ],
    dialects: {
      std: {
        syntax: 'GRANT { SELECT | INSERT | UPDATE [(spalten)] | DELETE | ALL PRIVILEGES }\nON [TABLE] objekt\nTO rolle [WITH GRANT OPTION];',
        example: e(`
GRANT SELECT ON TABLE kunden TO leser;
GRANT INSERT, UPDATE, DELETE ON TABLE bestellungen TO schreiber;
GRANT UPDATE (stadt) ON TABLE kunden TO support;          -- nur eine Spalte
GRANT SELECT ON TABLE produkte TO teamleitung WITH GRANT OPTION;
GRANT EXECUTE ON PROCEDURE ueberweisen TO schreiber;
`),
        nocheck: true
      },
      pg: {
        syntax: 'GRANT … ON { TABLE t | ALL TABLES IN SCHEMA s } TO rolle;\nGRANT USAGE ON SCHEMA s TO rolle;\nALTER DEFAULT PRIVILEGES IN SCHEMA s GRANT … ON TABLES TO rolle;',
        example: e(`
GRANT USAGE ON SCHEMA public TO leser;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO leser;
GRANT INSERT, UPDATE, DELETE ON bestellungen TO schreiber;
GRANT UPDATE (stadt) ON kunden TO support;          -- nur eine Spalte

-- auch für künftig angelegte Tabellen
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO leser;
`),
        nocheck: true,
        note: 'Ohne `USAGE` auf das Schema sind dessen Objekte unerreichbar. `ON ALL TABLES` gilt nur für bestehende Tabellen, für künftige braucht es `ALTER DEFAULT PRIVILEGES`. Bei `serial`-Spalten zusätzlich `USAGE` auf die Sequenz.',
        mdn: PG + 'sql-grant.html'
      },
      mysql: {
        syntax: "GRANT … ON { db.* | db.tabelle | *.* } TO 'name'@'host' | rolle;",
        example: e(`
GRANT SELECT ON shop.* TO leser;                                -- ganze Datenbank
GRANT INSERT, UPDATE, DELETE ON shop.bestellungen TO schreiber;
GRANT UPDATE (stadt) ON shop.kunden TO 'support'@'%';           -- nur eine Spalte
GRANT EXECUTE ON PROCEDURE shop.ueberweisen TO 'app'@'%';

SHOW GRANTS FOR 'support'@'%';
`),
        nocheck: true,
        note: '`db.*` gilt auch für künftige Tabellen der Datenbank. Ein unbekannter Benutzer wird bei `GRANT` nicht mehr automatisch angelegt (seit 8.0).',
        mdn: MY + 'grant.html'
      },
      mssql: {
        syntax: 'GRANT … ON [OBJECT::]schema.objekt TO prinzipal;\nGRANT … ON SCHEMA::schema TO prinzipal;\nDENY … ON … TO prinzipal;',
        example: e(`
GRANT SELECT ON SCHEMA::dbo TO leser;                 -- alle Objekte im Schema, auch künftige
GRANT INSERT, UPDATE, DELETE ON dbo.bestellungen TO schreiber;
GRANT UPDATE (stadt) ON dbo.kunden TO support;        -- nur eine Spalte
GRANT EXECUTE ON dbo.ueberweisen TO app_backend;

DENY DELETE ON dbo.kunden TO praktikant;              -- DENY schlägt jedes GRANT
`),
        nocheck: true,
        note: 'Zusätzlich gibt es `DENY`, das ein Recht ausdrücklich verbietet und Vorrang vor geerbten `GRANT`s hat. Rechte auf ein Schema gelten auch für künftige Objekte darin.',
        mdn: MS + 'statements/grant-transact-sql'
      },
      sqlite: { none: 'Keine Rechteverwaltung in SQL; Zugriff regeln Dateirechte. Eine Anwendung kann einzelne Aktionen über die C-API `sqlite3_set_authorizer()` verbieten.', mdn: SL + 'c3ref/set_authorizer.html' }
    },
    tip: 'Rechte an Rollen statt an einzelne Benutzer vergeben und regelmäßig prüfen, wer was darf – überflüssige Rechte sind ein typisches Audit-Ergebnis.',
    keywords: ['grant', 'recht erteilen', 'berechtigung', 'privileges', 'permission', 'zugriff', 'dcl', 'default privileges', 'deny'],
    related: ['REVOKE', 'Benutzer & Rollen', 'Row-Level Security'],
    mdn: PG + 'sql-grant.html'
  },
  {
    lang: 'sql', group: 'Rechte & Sicherheit', name: 'REVOKE',
    desc: 'Entzieht zuvor erteilte Rechte wieder.',
    details: '`REVOKE` ist das Gegenstück zu `GRANT` und hat dieselbe Struktur mit `FROM` statt `TO`. Ein Benutzer kann ein Recht trotzdem behalten, wenn er es über eine andere Rolle oder `PUBLIC` erbt – Rechte sind additiv. `CASCADE` entzieht auch Rechte, die der Empfänger per `WITH GRANT OPTION` weitergegeben hat.',
    dialects: {
      std: {
        syntax: 'REVOKE [GRANT OPTION FOR] { SELECT | INSERT | … | ALL PRIVILEGES } ON objekt FROM rolle { CASCADE | RESTRICT };\nREVOKE rolle FROM benutzer;',
        example: e(`
REVOKE DELETE ON TABLE bestellungen FROM schreiber CASCADE;
REVOKE schreiber FROM praktikant;                 -- Rollenmitgliedschaft entziehen
REVOKE GRANT OPTION FOR SELECT ON TABLE produkte FROM teamleitung CASCADE;
REVOKE ALL PRIVILEGES ON TABLE kunden FROM PUBLIC CASCADE;
`),
        nocheck: true
      },
      pg: {
        example: e(`
REVOKE DELETE ON bestellungen FROM schreiber;
REVOKE schreiber FROM praktikant;                 -- Rollenmitgliedschaft entziehen

-- Standardrechte für alle Benutzer einschränken
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE shop FROM PUBLIC;
`),
        nocheck: true,
        note: '`PUBLIC` hat standardmäßig `CONNECT` auf Datenbanken und `USAGE` auf das Schema `public` (bis Version 14 auch `CREATE`). Prüfen mit `\\dp tabelle` in psql.',
        mdn: PG + 'sql-revoke.html'
      },
      mysql: {
        example: e(`
REVOKE DELETE ON shop.bestellungen FROM schreiber;
REVOKE schreiber FROM 'praktikant'@'%';             -- Rolle entziehen
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'alt'@'%'; -- alles auf einmal

SHOW GRANTS FOR 'praktikant'@'%';
`),
        nocheck: true,
        note: 'Ein Recht auf `db.*` lässt sich nicht für eine einzelne Tabelle entziehen – dann die Rechte feiner vergeben. Kein `CASCADE`.',
        mdn: MY + 'revoke.html'
      },
      mssql: {
        example: e(`
REVOKE DELETE ON dbo.bestellungen FROM schreiber;
ALTER ROLE schreiber DROP MEMBER praktikant;      -- Rollenmitgliedschaft entziehen
REVOKE SELECT ON dbo.kunden FROM support CASCADE;
`),
        note: '`REVOKE` entfernt sowohl `GRANT` als auch `DENY`. Rollenmitgliedschaften entzieht man mit `ALTER ROLE … DROP MEMBER`.',
        nocheck: true,
        mdn: MS + 'statements/revoke-transact-sql'
      },
      sqlite: { none: 'Keine Rechteverwaltung; Zugriff entziehen über Dateirechte oder indem die Anwendung die Datei nur lesend öffnet (`mode=ro`).' }
    },
    tip: 'Nach einem REVOKE prüfen, was wirklich gilt (psql `\\dp`, MySQL `SHOW GRANTS`, SQL Server `fn_my_permissions`) – geerbte Rechte über Rollen oder `PUBLIC` bleiben bestehen.',
    keywords: ['revoke', 'recht entziehen', 'berechtigung entfernen', 'public', 'zugriff sperren', 'dcl', 'drop member'],
    related: ['GRANT', 'Benutzer & Rollen', 'Prinzip der minimalen Rechte'],
    mdn: PG + 'sql-revoke.html'
  },
  {
    lang: 'sql', group: 'Rechte & Sicherheit', name: 'Row-Level Security',
    desc: 'Zeilenbasierte Rechte: Jeder Benutzer sieht und ändert nur „seine“ Zeilen.',
    details: 'Nach dem Einschalten filtert eine Richtlinie (Policy) jede Abfrage automatisch, als stünde eine zusätzliche WHERE-Bedingung darin; eine zweite Bedingung kann prüfen, welche Werte neu geschrieben werden dürfen. Typisch für mandantenfähige Anwendungen, oft mit einer Sitzungsvariablen für den Mandanten. Weil die Datenbank selbst filtert, kann ein vergessenes WHERE in der Anwendung keine fremden Daten mehr preisgeben.',
    dialects: {
      std: { none: 'Nicht im Standard; ohne eingebaute Row-Level Security filtern Views mit `WHERE mandant_id = …`, auf die nur Leserechte vergeben werden.' },
      pg: {
        syntax: 'ALTER TABLE t ENABLE ROW LEVEL SECURITY;\nCREATE POLICY name ON t\n  [FOR { ALL | SELECT | INSERT | UPDATE | DELETE }] [TO rolle]\n  USING (bedingung) [WITH CHECK (bedingung)];',
        example: e(`
ALTER TABLE bestellungen ENABLE ROW LEVEL SECURITY;

CREATE POLICY nur_eigener_mandant ON bestellungen
  USING (mandant_id = current_setting('app.mandant_id')::int)
  WITH CHECK (mandant_id = current_setting('app.mandant_id')::int);

-- pro Anfrage in der Anwendung (als Rolle ohne BYPASSRLS):
SET app.mandant_id = '7';
SELECT * FROM bestellungen;     -- liefert nur Zeilen von Mandant 7
`),
        nocheck: true,
        note: 'Superuser, Rollen mit `BYPASSRLS` und der Tabelleneigentümer (ohne `FORCE ROW LEVEL SECURITY`) sind ausgenommen – die Anwendung muss sich daher als eigene Rolle verbinden.',
        mdn: PG + 'ddl-rowsecurity.html'
      },
      mysql: { none: 'Keine Row-Level Security; Ersatz sind Views mit `WHERE mandant_id = …` (z. B. über `CURRENT_USER()`), auf die der Benutzer statt auf die Tabelle Rechte bekommt.', mdn: MY + 'create-view.html' },
      mssql: {
        syntax: 'CREATE FUNCTION dbo.f(@spalte typ) RETURNS TABLE WITH SCHEMABINDING AS RETURN SELECT 1 AS ok WHERE …;\nCREATE SECURITY POLICY name\n  ADD FILTER PREDICATE dbo.f(spalte) ON dbo.t\n  [, ADD BLOCK PREDICATE dbo.f(spalte) ON dbo.t AFTER INSERT]\n  WITH (STATE = ON);',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, mandant_id INT, betrag DECIMAL(10,2));
INSERT INTO bestellungen (id, mandant_id, betrag) VALUES (1, 7, 120), (2, 8, 80), (3, 7, 45);
GO
CREATE FUNCTION dbo.nur_eigener_mandant(@mandant_id INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN SELECT 1 AS erlaubt
       WHERE @mandant_id = CAST(SESSION_CONTEXT(N'mandant_id') AS INT);
GO
CREATE SECURITY POLICY mandanten_filter
  ADD FILTER PREDICATE dbo.nur_eigener_mandant(mandant_id) ON dbo.bestellungen,
  ADD BLOCK PREDICATE dbo.nur_eigener_mandant(mandant_id) ON dbo.bestellungen AFTER INSERT
  WITH (STATE = ON);
GO
-- pro Anfrage in der Anwendung:
EXEC sp_set_session_context @key = N'mandant_id', @value = 7;
SELECT id, betrag FROM bestellungen ORDER BY id;
-- id | betrag
-- 1  | 120.00
-- 3  | 45.00
`),
        note: 'Seit SQL Server 2016: Die Bedingung steckt in einer Inline-Tabellenfunktion, Filter-Prädikate blenden Zeilen aus, Block-Prädikate verhindern unerlaubte Schreibzugriffe. Gilt auch für `dbo` und Administratoren.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/security/row-level-security'
      },
      sqlite: { none: 'Keine Row-Level Security und keine Benutzer; die Anwendung muss selbst filtern, z. B. über Views.' }
    },
    tip: 'Testen, dass die Policy wirklich greift: einmal als Anwendungskonto ohne gesetzte Mandanten-ID abfragen – das Ergebnis muss leer sein.',
    keywords: ['row level security', 'rls', 'policy', 'zeilenrechte', 'mandantenfähig', 'multi tenant', 'create policy', 'security policy', 'session_context'],
    related: ['GRANT', 'Benutzer & Rollen', 'CREATE VIEW'],
    mdn: PG + 'ddl-rowsecurity.html'
  },
  {
    lang: 'sql', group: 'Rechte & Sicherheit', name: 'SQL-Injection',
    desc: 'Angriff, bei dem Eingaben als SQL-Code ausgeführt werden, weil sie eingebaut statt gebunden sind.',
    details: 'Setzt die Anwendung Benutzereingaben per Stringverkettung in SQL ein, kann ein Angreifer mit Anführungszeichen die Abfrage umbauen: Logins umgehen, Daten auslesen oder löschen. Escapen von Hand ist fehleranfällig. Die einzig verlässliche Abhilfe sind Parameter (Prepared Statements); Tabellen- und Spaltennamen, die nicht parametrisierbar sind, prüft man gegen eine feste Liste.',
    dialects: {
      std: {
        example: e(`
CREATE TABLE benutzer (id INTEGER PRIMARY KEY, name VARCHAR(50), rolle VARCHAR(20));
INSERT INTO benutzer (id, name, rolle) VALUES (1, 'ada', 'admin'), (2, 'lin', 'user'), (3, 'max', 'user');

-- Anwendung baut:  "SELECT … WHERE name = '" + eingabe + "'"
-- Eingabe:         x' OR '1'='1
-- Ergebnis: alle Benutzer statt keinem
SELECT id, name, rolle FROM benutzer WHERE name = 'x' OR '1'='1' ORDER BY id;
-- id | name | rolle
-- 1  | ada  | admin
-- 2  | lin  | user
-- 3  | max  | user

-- Richtig: Platzhalter, der Treiber übergibt den Wert getrennt vom SQL
-- SELECT id, name, rolle FROM benutzer WHERE name = ?;
`)
      },
      pg: { note: 'Mehrere Anweisungen pro Aufruf (`…; DROP TABLE …`) erlaubt nur das einfache Protokoll ohne Parameter – ein Grund mehr, immer mit Parametern zu arbeiten.' },
      mysql: { note: 'Kommentare (`-- ` mit Leerzeichen oder `#`) schneiden den Rest der Abfrage ab. Mehrere Anweisungen pro Aufruf erlauben die Treiber nur mit ausdrücklicher Option.' },
      mssql: { note: 'Mehrere Anweisungen in einem Batch sind erlaubt – eine Injection kann also direkt `; DROP TABLE …` anhängen. Dynamisches SQL nur mit `sp_executesql` und Parametern.' }
    },
    tip: 'Auch ORMs schützen nur, solange man keine Roh-SQL-Strings mit f-Strings, Template-Literals oder `+` zusammenbaut.',
    keywords: ['sql injection', 'sqli', 'sicherheit', 'angriff', 'escape', 'owasp', 'eingabe', 'injektion'],
    related: ['Prepared Statements', 'Parameter-Platzhalter', 'Dynamische Bezeichner'],
    mdn: PG + 'sql-prepare.html'
  },
  {
    lang: 'sql', group: 'Rechte & Sicherheit', name: 'Prepared Statements',
    desc: 'Vorbereitete Anweisungen: SQL mit Platzhaltern, Werte werden separat übergeben.',
    details: 'Der Server parst die Anweisung einmal und führt sie dann mit wechselnden Parametern aus. Werte werden nie als SQL interpretiert, was SQL-Injection verhindert; bei häufiger Ausführung spart es zudem Parse- und Planungszeit. In der Praxis nutzt man sie über den Datenbanktreiber; einige Dialekte bieten sie auch direkt in SQL an.',
    values: [
      ['PREPARE', 'Anweisung parsen und unter einem Namen merken'],
      ['EXECUTE', 'mit konkreten Werten ausführen'],
      ['DEALLOCATE', 'vorbereitete Anweisung freigeben'],
      ['Treiber', 'JDBC PreparedStatement, Python execute(sql, params), Node query(sql, values)']
    ],
    dialects: {
      std: { none: 'Im Standard nur für Embedded/Dynamic SQL (`PREPARE … FROM`, `EXECUTE … USING`); in der Praxis über den Treiber, siehe Parameter-Platzhalter.' },
      pg: {
        syntax: 'PREPARE name (typ, …) AS anweisung_mit_$1;\nEXECUTE name (wert, …);\nDEALLOCATE name;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden (id, name, stadt) VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Hamburg'), (3, 'Weber', 'Berlin');

PREPARE kunden_in_stadt (varchar) AS
  SELECT id, name FROM kunden WHERE stadt = $1 ORDER BY id;

EXECUTE kunden_in_stadt ('Berlin');
-- id | name
-- 1  | Müller
-- 3  | Weber
EXECUTE kunden_in_stadt ('Hamburg');
-- id | name
-- 2  | Schmidt

DEALLOCATE kunden_in_stadt;
`),
        note: 'Vorbereitete Anweisungen gelten nur für die Sitzung. Platzhalter heißen `$1`, `$2`, …',
        mdn: PG + 'sql-prepare.html'
      },
      mysql: {
        syntax: "PREPARE name FROM 'anweisung_mit_?';\nEXECUTE name USING @var, …;\nDEALLOCATE PREPARE name;",
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden (id, name, stadt) VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Hamburg'), (3, 'Weber', 'Berlin');

PREPARE kunden_in_stadt FROM
  'SELECT id, name FROM kunden WHERE stadt = ? ORDER BY id';

SET @stadt = 'Berlin';
EXECUTE kunden_in_stadt USING @stadt;
-- id | name
-- 1  | Müller
-- 3  | Weber
SET @stadt = 'Hamburg';
EXECUTE kunden_in_stadt USING @stadt;
-- id | name
-- 2  | Schmidt

DEALLOCATE PREPARE kunden_in_stadt;
`),
        note: 'Der SQL-Text ist ein String (oder eine Variable), Platzhalter sind `?`, Werte kommen nur aus Benutzervariablen (`@x`).',
        mdn: MY + 'sql-prepared-statements.html'
      },
      mssql: {
        syntax: "EXEC sp_executesql N'anweisung_mit_@p', N'@p typ, …', @p = wert;",
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden (id, name, stadt) VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Hamburg'), (3, 'Weber', 'Berlin');

EXEC sp_executesql
  N'SELECT id, name FROM kunden WHERE stadt = @stadt ORDER BY id',
  N'@stadt VARCHAR(50)',
  @stadt = 'Berlin';
-- id | name
-- 1  | Müller
-- 3  | Weber
EXEC sp_executesql
  N'SELECT id, name FROM kunden WHERE stadt = @stadt ORDER BY id',
  N'@stadt VARCHAR(50)',
  @stadt = 'Hamburg';
-- id | name
-- 2  | Schmidt
`),
        note: 'Kein `PREPARE` in T-SQL; `sp_executesql` mit Parameterliste wird gecacht und wiederverwendet. Treiber nutzen benannte Parameter `@name`.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-executesql-transact-sql'
      },
      sqlite: { none: 'Kein `PREPARE` in SQL; die API bereitet jede Anweisung vor (`sqlite3_prepare_v2`) und bindet Werte an `?`, `?1` oder `:name` – in Python z. B. `con.execute(sql, params)`.', mdn: SL + 'c3ref/prepare.html' }
    },
    tip: 'Platzhalter stehen nur für Werte – nicht für Tabellennamen, Spaltennamen, `ORDER BY`-Richtung oder Listen unbekannter Länge in `IN (…)`.',
    keywords: ['prepared statement', 'vorbereitete anweisung', 'prepare', 'execute', 'bind parameter', 'parametrisiert', 'sp_executesql'],
    related: ['SQL-Injection', 'Parameter-Platzhalter', 'SQL aus Java (JDBC)'],
    mdn: PG + 'sql-prepare.html'
  },
  {
    lang: 'sql', group: 'Rechte & Sicherheit', name: 'Prinzip der minimalen Rechte',
    desc: 'Jedes Konto bekommt nur die Rechte, die es für seine Aufgabe wirklich braucht.',
    details: 'Die Anwendung verbindet sich nicht als Superuser oder Eigentümer, sondern mit einem Konto, das nur lesen und schreiben darf; Migrationen laufen mit einem separaten Konto, das DDL darf. Auswertungen bekommen nur Lesezugriff, idealerweise auf eine Replik. So begrenzt ein kompromittiertes Passwort oder eine SQL-Injection den Schaden: kein `DROP TABLE`, kein Zugriff auf fremde Schemas.',
    values: [
      ['Eigentümer / Migration', 'besitzt die Objekte, darf DDL – nur im Deployment verwendet'],
      ['Anwendung', 'SELECT, INSERT, UPDATE, DELETE auf die nötigen Tabellen'],
      ['Reporting', 'nur SELECT, evtl. nur auf Views'],
      ['Admin', 'Superuser, nur für Notfälle, nie in Anwendungen']
    ],
    dialects: {
      std: {
        example: e(`
-- Rollen je Aufgabe; Benutzer erhalten nur die passende Rolle
CREATE ROLE shop_app;
CREATE ROLE shop_report;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE kunden TO shop_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE bestellungen TO shop_app;
GRANT SELECT ON TABLE umsatz_view TO shop_report;     -- nur die View
`),
        nocheck: true
      },
      pg: {
        example: e(`
-- drei getrennte Konten
CREATE ROLE shop_owner NOLOGIN;                    -- besitzt die Tabellen
CREATE ROLE shop_migrate LOGIN PASSWORD '…' IN ROLE shop_owner;
CREATE ROLE shop_app LOGIN PASSWORD '…';
CREATE ROLE shop_report LOGIN PASSWORD '…';

GRANT USAGE ON SCHEMA shop TO shop_app, shop_report;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA shop TO shop_app;
GRANT SELECT ON shop.umsatz_view TO shop_report;   -- nur die View

REVOKE ALL ON DATABASE shop FROM PUBLIC;
GRANT CONNECT ON DATABASE shop TO shop_app, shop_report, shop_migrate;
`),
        nocheck: true,
        note: 'Tabellen gehören einer `NOLOGIN`-Rolle; das Migrationskonto arbeitet als deren Mitglied. `default_transaction_read_only = on` für das Reporting-Konto verhindert auch versehentliche Änderungen.',
        mdn: PG + 'ddl-priv.html'
      },
      mysql: {
        example: e(`
CREATE USER 'shop_migrate'@'10.0.%' IDENTIFIED BY '…';
CREATE USER 'shop_app'@'10.0.%' IDENTIFIED BY '…';
CREATE USER 'shop_report'@'%' IDENTIFIED BY '…';

GRANT ALL PRIVILEGES ON shop.* TO 'shop_migrate'@'10.0.%';
GRANT SELECT, INSERT, UPDATE, DELETE ON shop.* TO 'shop_app'@'10.0.%';
GRANT SELECT ON shop.umsatz_view TO 'shop_report'@'%';   -- nur die View
`),
        nocheck: true,
        note: 'Der Host-Teil (`\'10.0.%\'`) schränkt zusätzlich ein, von wo aus sich ein Konto anmelden darf. Nie `GRANT … ON *.*` an Anwendungskonten.',
        mdn: MY + 'privileges-provided.html'
      },
      mssql: {
        example: e(`
CREATE LOGIN shop_app WITH PASSWORD = '…';
CREATE LOGIN shop_report WITH PASSWORD = '…';
CREATE USER shop_app FOR LOGIN shop_app;
CREATE USER shop_report FOR LOGIN shop_report;
CREATE USER shop_migrate FOR LOGIN shop_migrate;

ALTER ROLE db_ddladmin ADD MEMBER shop_migrate;              -- darf DDL
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::shop TO shop_app;
GRANT SELECT ON shop.umsatz_view TO shop_report;            -- nur die View
`),
        nocheck: true,
        note: 'Feste Datenbankrollen (`db_datareader`, `db_datawriter`, `db_ddladmin`) helfen beim Zuschnitt; Anwendungen nie als `sa` oder Mitglied von `db_owner` verbinden.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/security/authentication-access/database-level-roles'
      },
      sqlite: { none: 'Keine Konten: Minimale Rechte heißt hier Dateirechte – der Prozess der Anwendung darf nur seine Datei schreiben, Auswertungen öffnen sie nur lesend (`mode=ro`).' }
    },
    tip: 'Zugangsdaten nie im Code einchecken, sondern aus Umgebungsvariablen oder einem Secret-Store laden und regelmäßig rotieren.',
    keywords: ['least privilege', 'minimale rechte', 'sicherheit', 'berechtigungskonzept', 'rollenkonzept', 'superuser vermeiden'],
    related: ['Benutzer & Rollen', 'GRANT', 'REVOKE', 'SQL-Injection'],
    mdn: PG + 'ddl-priv.html'
  },
  {
    lang: 'sql', group: 'Rechte & Sicherheit', name: 'Dynamische Bezeichner',
    desc: 'Tabellen- oder Spaltennamen zur Laufzeit sicher in SQL einsetzen.',
    details: 'Bezeichner lassen sich nicht als Parameter binden. Kommen sie aus Benutzereingaben (z. B. Sortierspalte), prüft man sie gegen eine feste Liste erlaubter Namen (Allowlist). Muss dynamisches SQL in der Datenbank gebaut werden, wird der Name gequotet: in Anführungszeichen gesetzt, enthaltene Anführungszeichen verdoppelt – dafür hat jeder Dialekt eine eigene Funktion.',
    values: [
      ['Allowlist', 'in der Anwendung nur bekannte Namen zulassen'],
      ['Quotieren', 'Bezeichner einklammern, enthaltene Quote-Zeichen verdoppeln']
    ],
    dialects: {
      std: { none: 'Nur in SQL/PSM über `EXECUTE IMMEDIATE`; eine Quotier-Funktion gibt es nicht. Bezeichner werden mit doppelten Anführungszeichen gequotet (`"` verdoppeln).' },
      pg: {
        syntax: "EXECUTE format('SELECT * FROM %I WHERE id = $1', tabelle) USING wert;   -- PL/pgSQL",
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt');

CREATE FUNCTION zeilen_zaehlen(tabelle text) RETURNS bigint
LANGUAGE plpgsql AS $$
DECLARE
  n bigint;
BEGIN
  EXECUTE format('SELECT COUNT(*) FROM %I', tabelle) INTO n;
  RETURN n;
END $$;

SELECT zeilen_zaehlen('kunden') AS anzahl;
-- anzahl
-- 2

-- Eine Eingabe mit SQL wird nur zu einem (nicht existierenden) Tabellennamen:
SELECT format('%I', 'kunden; DROP TABLE kunden') AS bezeichner;
-- bezeichner
-- "kunden; DROP TABLE kunden"
`),
        note: '`format()` quotet Bezeichner mit `%I` und Werte mit `%L`; einzeln auch `quote_ident()` und `quote_literal()`. Werte besser per `EXECUTE … USING` binden.',
        mdn: PG + 'plpgsql-statements.html#PLPGSQL-STATEMENTS-EXECUTING-DYN'
      },
      mysql: {
        syntax: "SET @sql = CONCAT('SELECT … FROM \`', REPLACE(@name, '\`', '\`\`'), '\`');\nPREPARE s FROM @sql; EXECUTE s;",
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt');

SET @tabelle = 'kunden';
SET @sql = CONCAT('SELECT COUNT(*) AS anzahl FROM \`', REPLACE(@tabelle, '\`', '\`\`'), '\`');
PREPARE stmt FROM @sql;
EXECUTE stmt;
-- anzahl
-- 2
DEALLOCATE PREPARE stmt;

-- Eine Eingabe mit SQL wird nur zu einem (nicht existierenden) Tabellennamen:
SELECT CONCAT('\`', REPLACE('kunden; DROP TABLE kunden', '\`', '\`\`'), '\`') AS bezeichner;
-- bezeichner
-- \`kunden; DROP TABLE kunden\`
`),
        note: 'Keine Quotier-Funktion für Bezeichner: in Backticks setzen und enthaltene Backticks verdoppeln. Für Werte gibt es `QUOTE()`, besser aber `EXECUTE … USING`.',
        mdn: MY + 'identifiers.html'
      },
      mssql: {
        syntax: "DECLARE @sql NVARCHAR(MAX) = N'SELECT … FROM ' + QUOTENAME(@name);\nEXEC sp_executesql @sql, N'@p typ', @p = wert;",
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt');

DECLARE @tabelle SYSNAME = N'kunden';
DECLARE @sql NVARCHAR(MAX) = N'SELECT COUNT(*) AS anzahl FROM ' + QUOTENAME(@tabelle) + N';';
EXEC sp_executesql @sql;
-- anzahl
-- 2

-- Eine Eingabe mit SQL wird nur zu einem (nicht existierenden) Tabellennamen:
SELECT QUOTENAME(N'kunden; DROP TABLE kunden') AS bezeichner;
-- bezeichner
-- [kunden; DROP TABLE kunden]
`),
        note: '`QUOTENAME()` setzt eckige Klammern und verdoppelt enthaltene `]`; Werte über die Parameterliste von `sp_executesql` binden, nie anhängen.',
        mdn: MS + 'functions/quotename-transact-sql'
      },
      sqlite: { none: 'Kein dynamisches SQL in der Datenbank; die Anwendung baut den Text und quotet Bezeichner in doppelten Anführungszeichen, z. B. mit `printf(\'"%w"\', name)`, das `"` verdoppelt.', mdn: SL + 'printf.html' }
    },
    tip: 'Für dynamisches `ORDER BY` in der Anwendung eine Map wie `{"name": "name", "datum": "eingestellt"}` verwenden und alles andere ablehnen.',
    keywords: ['dynamisches sql', 'dynamic sql', 'bezeichner', 'identifier', 'quote_ident', 'format %I', 'quotename', 'allowlist', 'sortierspalte'],
    related: ['SQL-Injection', 'Bezeichner quoten', 'Variablen & Kontrollfluss (PL/pgSQL)'],
    mdn: PG + 'plpgsql-statements.html'
  },

  // ---------------- SQL aus Programmiersprachen ----------------
  {
    lang: 'sql', group: 'SQL aus Programmiersprachen', name: 'Parameter-Platzhalter',
    desc: 'Je nach Treiber stehen ?, $1, :name oder %s für gebundene Werte im SQL.',
    details: 'Platzhalter markieren Stellen, an denen der Treiber Werte sicher einsetzt. Welche Schreibweise gilt, bestimmt der Treiber, nicht die Datenbank: JDBC und SQLite nutzen `?`, PostgreSQL-Treiber für Node `$1`, psycopg `%s`, SQL Server `@name`. Ein Platzhalter ersetzt genau einen Wert; für `IN`-Listen erzeugt man passend viele Platzhalter oder übergibt in PostgreSQL ein Array (`= ANY($1)`).',
    values: [
      ['?', 'JDBC, ODBC, SQLite, MySQL-Treiber (positional)'],
      ['$1, $2', 'PostgreSQL nativ, node-postgres, asyncpg'],
      [':name', 'SQLite (named), Oracle, SQLAlchemy text(), JPA'],
      ['%s / %(name)s', 'psycopg, PyMySQL, mysqlclient (kein String-Formatieren!)'],
      ['@name', 'SQL Server (ADO.NET, sp_executesql)']
    ],
    example: e(`
import sqlite3

con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT)")
con.executemany("INSERT INTO kunden (name, stadt) VALUES (?, ?)",
                [("Müller", "Berlin"), ("Schmidt", "Hamburg"), ("Weber", "Berlin")])

# positional: ?
print(con.execute("SELECT name FROM kunden WHERE stadt = ?", ("Berlin",)).fetchall())
# [('Müller',), ('Weber',)]

# named: :name
print(con.execute("SELECT COUNT(*) FROM kunden WHERE stadt = :s", {"s": "Hamburg"}).fetchone())
# (1,)

# IN-Liste: passend viele Platzhalter erzeugen
staedte = ["Berlin", "Hamburg"]
sql = f"SELECT COUNT(*) FROM kunden WHERE stadt IN ({', '.join('?' * len(staedte))})"
print(con.execute(sql, staedte).fetchone())   # (3,)
`),
    exampleLang: 'py',
    tip: 'Ein einzelner Parameter muss in Python ein Tupel sein: `("Berlin",)` mit Komma – `("Berlin")` ist nur ein String und wird zeichenweise gebunden.',
    keywords: ['platzhalter', 'placeholder', 'bind parameter', 'fragezeichen', '$1', 'named parameter', 'paramstyle', 'in liste'],
    related: ['Prepared Statements', 'SQL-Injection', 'SQL aus Python (sqlite3)'],
    mdn: 'https://docs.python.org/3/library/sqlite3.html#sqlite3-placeholders'
  },
  {
    lang: 'sql', group: 'SQL aus Programmiersprachen', name: 'SQL aus Python (sqlite3)',
    desc: 'Pythons eingebautes Modul sqlite3 führt SQL ohne zusätzliche Pakete aus.',
    details: '`sqlite3.connect()` öffnet eine Datei (oder `:memory:`), `execute()` führt Anweisungen mit Parametern aus, `fetchone()`/`fetchall()` holen Ergebnisse. Die Verbindung als Kontextmanager (`with con:`) committet bei Erfolg und rollt bei Ausnahmen zurück, schließt die Verbindung aber nicht. `row_factory = sqlite3.Row` erlaubt Zugriff per Spaltenname. Für PostgreSQL ist `psycopg` das Gegenstück mit fast gleicher API (DB-API 2.0).',
    example: e(`
import sqlite3

con = sqlite3.connect("shop.db")
con.row_factory = sqlite3.Row            # Zugriff per Spaltenname

with con:                                # Transaktion: commit oder rollback
    con.execute("""CREATE TABLE IF NOT EXISTS kunden (
                       id INTEGER PRIMARY KEY, name TEXT NOT NULL, stadt TEXT)""")
    con.executemany("INSERT INTO kunden (name, stadt) VALUES (?, ?)",
                    [("Müller", "Berlin"), ("Schmidt", "Hamburg")])

for row in con.execute("SELECT id, name FROM kunden WHERE stadt = ? ORDER BY id", ("Berlin",)):
    print(row["id"], row["name"])        # z. B. 1 Müller

cur = con.execute("UPDATE kunden SET stadt = ? WHERE name = ?", ("Potsdam", "Müller"))
print(cur.rowcount)                      # Anzahl geänderter Zeilen
con.commit()
con.close()                              # with schließt nicht!
`),
    exampleLang: 'py',
    tip: 'Ohne `commit()` (oder `with con:`) gehen Änderungen beim Schließen verloren – der häufigste Anfängerfehler mit sqlite3.',
    keywords: ['python', 'sqlite3', 'db-api', 'psycopg', 'cursor', 'execute', 'fetchall', 'row_factory', 'pep 249'],
    related: ['Parameter-Platzhalter', 'Transaktionen im Code', 'ORM'],
    mdn: 'https://docs.python.org/3/library/sqlite3.html'
  },
  {
    lang: 'sql', group: 'SQL aus Programmiersprachen', name: 'SQL aus Java (JDBC)',
    desc: 'JDBC ist die Standard-API von Java für relationale Datenbanken.',
    details: 'Über eine JDBC-URL und den passenden Treiber (z. B. `org.postgresql:postgresql`) liefert `DriverManager` oder besser eine `DataSource` eine `Connection`. `PreparedStatement` mit `?` bindet Werte typsicher (`setString`, `setLong`), `executeQuery()` liefert ein `ResultSet`, `executeUpdate()` die Anzahl geänderter Zeilen. Alle Ressourcen gehören in try-with-resources, sonst bleiben Verbindungen offen.',
    example: e(`
import java.sql.*;

String url = "jdbc:postgresql://localhost:5432/shop";
String sql = "SELECT id, name FROM kunden WHERE stadt = ? ORDER BY id";

try (Connection con = DriverManager.getConnection(url, "app", System.getenv("DB_PASSWORT"));
     PreparedStatement ps = con.prepareStatement(sql)) {
    ps.setString(1, "Berlin");
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getLong("id") + " " + rs.getString("name"));
        }
    }

    con.setAutoCommit(false);                       // Transaktion
    try (PreparedStatement up = con.prepareStatement(
            "UPDATE konten SET saldo = saldo + ? WHERE id = ?")) {
        up.setBigDecimal(1, new java.math.BigDecimal("-200")); up.setLong(2, 1); up.executeUpdate();
        up.setBigDecimal(1, new java.math.BigDecimal("200"));  up.setLong(2, 2); up.executeUpdate();
        con.commit();
    } catch (SQLException ex) {
        con.rollback();
        throw ex;
    }
}
`),
    exampleLang: 'java',
    tip: '`rs.getInt()` liefert bei SQL-NULL `0`; mit `rs.wasNull()` prüfen oder `rs.getObject(…, Integer.class)` verwenden.',
    keywords: ['java', 'jdbc', 'preparedstatement', 'resultset', 'connection', 'drivermanager', 'datasource', 'spring jdbc'],
    related: ['Parameter-Platzhalter', 'Verbindungspool', 'Prepared Statements', 'ORM'],
    mdn: 'https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/PreparedStatement.html'
  },
  {
    lang: 'sql', group: 'SQL aus Programmiersprachen', name: 'SQL aus JavaScript (Node)',
    desc: 'In Node.js greift man über Treiber wie pg, mysql2 oder node:sqlite auf Datenbanken zu.',
    details: 'Für PostgreSQL ist `pg` (node-postgres) Standard: `pool.query(sql, werte)` mit `$1`-Platzhaltern liefert ein Promise mit `rows`. MySQL nutzt `mysql2` mit `?`, SQLite ist seit Node 22.5 als `node:sqlite` eingebaut (synchron, `prepare().all()`). Werte immer als Array übergeben, nie per Template-Literal ins SQL einsetzen. Für Transaktionen einen einzelnen Client aus dem Pool holen, da jede `pool.query()` eine andere Verbindung nutzen kann.',
    example: e(`
import pg from 'pg';                      // npm install pg

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const { rows } = await pool.query(
  'SELECT id, name FROM kunden WHERE stadt = $1 ORDER BY id',
  ['Berlin']
);
console.log(rows);                        // z. B. [ { id: 1, name: 'Müller' } ]

// Transaktion: alle Anweisungen über denselben Client
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE konten SET saldo = saldo - $1 WHERE id = $2', [200, 1]);
  await client.query('UPDATE konten SET saldo = saldo + $1 WHERE id = $2', [200, 2]);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();                       // zurück in den Pool
}
`),
    exampleLang: 'js',
    tip: 'node-postgres liefert `bigint`- und `numeric`-Spalten als Strings, um Genauigkeit nicht zu verlieren – vor dem Rechnen bewusst umwandeln.',
    keywords: ['node', 'nodejs', 'javascript', 'pg', 'node-postgres', 'mysql2', 'node:sqlite', 'pool.query'],
    related: ['Parameter-Platzhalter', 'Verbindungspool', 'Transaktionen im Code'],
    mdn: PG + 'libpq.html'
  },
  {
    lang: 'sql', group: 'SQL aus Programmiersprachen', name: 'Transaktionen im Code',
    desc: 'Mehrere Anweisungen aus der Anwendung gemeinsam committen oder zurückrollen.',
    details: 'Das Muster ist überall gleich: Transaktion beginnen, Anweisungen ausführen, bei Erfolg `commit()`, bei jeder Ausnahme `rollback()` und die Verbindung am Ende freigeben. Viele Bibliotheken verpacken das: Pythons `with con:`, Springs `@Transactional`, `knex.transaction()` oder `session.begin()` in SQLAlchemy. Alle Anweisungen müssen über dieselbe Verbindung laufen.',
    example: e(`
import sqlite3

con = sqlite3.connect("bank.db", autocommit=False)   # Python 3.12+
try:
    con.execute("UPDATE konten SET saldo = saldo - ? WHERE id = ?", (200, 1))
    con.execute("UPDATE konten SET saldo = saldo + ? WHERE id = ?", (200, 2))
    (saldo,) = con.execute("SELECT saldo FROM konten WHERE id = ?", (1,)).fetchone()
    if saldo < 0:
        raise ValueError("Konto nicht gedeckt")
    con.commit()
except Exception:
    con.rollback()                  # beide Buchungen verwerfen
    raise
finally:
    con.close()
`),
    exampleLang: 'py',
    tip: 'Transaktionen bei Deadlocks oder Serialisierungsfehlern komplett wiederholen (Retry mit kleiner Wartezeit), nicht nur die fehlgeschlagene Anweisung.',
    keywords: ['transaktion', 'commit', 'rollback', 'try except', '@transactional', 'unit of work', 'retry'],
    related: ['Transaktion', 'Autocommit', 'SQL aus Python (sqlite3)', 'Deadlock'],
    mdn: 'https://docs.python.org/3/library/sqlite3.html#sqlite3-controlling-transactions'
  },
  {
    lang: 'sql', group: 'SQL aus Programmiersprachen', name: 'ORM',
    desc: 'Object-Relational Mapper: bildet Tabellen auf Klassen und Zeilen auf Objekte ab.',
    details: 'Ein ORM wie Hibernate/JPA (Java), SQLAlchemy oder Django ORM (Python), Prisma, TypeORM oder Drizzle (JS/TS) erzeugt SQL aus Methodenaufrufen und Objekten. Das spart Routinecode und schützt durch gebundene Parameter vor Injection. Fallstricke sind das N+1-Problem durch Lazy Loading, ineffiziente generierte Abfragen und fehlendes Verständnis dafür, welches SQL tatsächlich läuft. Für komplexe Auswertungen bleibt handgeschriebenes SQL oft die bessere Wahl.',
    example: e(`
from sqlalchemy import String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

class Base(DeclarativeBase):
    pass

class Kunde(Base):
    __tablename__ = "kunden"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    stadt: Mapped[str | None]

engine = create_engine("sqlite:///shop.db", echo=True)   # echo: SQL mitloggen
Base.metadata.create_all(engine)

with Session(engine) as session:
    session.add(Kunde(name="Müller", stadt="Berlin"))
    session.commit()

    abfrage = select(Kunde).where(Kunde.stadt == "Berlin").order_by(Kunde.id)
    for kunde in session.scalars(abfrage):
        print(kunde.id, kunde.name)
`),
    exampleLang: 'py',
    tip: 'Das SQL-Logging des ORMs (`echo=True`, `spring.jpa.show-sql`) in der Entwicklung einschalten – nur so fallen N+1-Abfragen und überflüssige Joins auf.',
    keywords: ['orm', 'object relational mapping', 'hibernate', 'jpa', 'sqlalchemy', 'django', 'prisma', 'typeorm', 'entity framework'],
    related: ['N+1-Problem', 'SQL aus Python (sqlite3)', 'Datenbank-Migrationen'],
    mdn: 'https://learn.microsoft.com/en-us/ef/core/'
  },
  {
    lang: 'sql', group: 'SQL aus Programmiersprachen', name: 'Verbindungspool',
    desc: 'Hält offene Datenbankverbindungen bereit und verleiht sie an Anfragen.',
    details: 'Eine Verbindung aufzubauen kostet Zeit (TCP, TLS, Anmeldung) und Speicher auf dem Server. Ein Pool öffnet einige Verbindungen vorab und gibt sie nach `close()` bzw. `release()` wieder frei, statt sie zu schließen. Die Poolgröße sollte klein sein (oft 10–20 pro Anwendungsinstanz); zu viele Verbindungen bremsen den Server. Bekannt sind HikariCP (Java), `pg.Pool` (Node), SQLAlchemy-Pools sowie serverseitig PgBouncer.',
    values: [
      ['maximumPoolSize', 'Obergrenze gleichzeitiger Verbindungen'],
      ['minimumIdle', 'Anzahl bereitgehaltener freier Verbindungen'],
      ['connectionTimeout', 'wie lange auf eine freie Verbindung gewartet wird'],
      ['maxLifetime', 'Verbindungen regelmäßig erneuern'],
      ['PgBouncer', 'externer Pool vor PostgreSQL für viele Clients']
    ],
    example: e(`
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.*;

HikariConfig cfg = new HikariConfig();
cfg.setJdbcUrl("jdbc:postgresql://localhost:5432/shop");
cfg.setUsername("app");
cfg.setPassword(System.getenv("DB_PASSWORT"));
cfg.setMaximumPoolSize(10);

HikariDataSource ds = new HikariDataSource(cfg);     // einmal pro Anwendung

try (Connection con = ds.getConnection();            // aus dem Pool leihen
     PreparedStatement ps = con.prepareStatement("SELECT COUNT(*) FROM kunden");
     ResultSet rs = ps.executeQuery()) {
    rs.next();
    System.out.println(rs.getLong(1));
}                                                    // close() = zurückgeben
`),
    exampleLang: 'java',
    tip: 'Fehlt irgendwo ein `close()`/`release()`, läuft der Pool leer und alle Anfragen warten bis zum Timeout – Ressourcen immer mit try-with-resources bzw. `finally` freigeben.',
    keywords: ['connection pool', 'verbindungspool', 'pooling', 'hikaricp', 'pgbouncer', 'pool size', 'datasource'],
    related: ['SQL aus Java (JDBC)', 'SQL aus JavaScript (Node)', 'Transaktionen im Code'],
    mdn: PG + 'runtime-config-connection.html'
  },
  {
    lang: 'sql', group: 'SQL aus Programmiersprachen', name: 'Datenbank-Migrationen',
    desc: 'Versionierte SQL-Skripte, die das Schema nachvollziehbar Schritt für Schritt ändern.',
    details: 'Jede Schemaänderung liegt als nummerierte Datei im Repository (`V1__…sql`, `V2__…sql`) und wird von einem Werkzeug genau einmal pro Datenbank ausgeführt; welche schon liefen, merkt es sich in einer eigenen Tabelle. So sind Entwicklungs-, Test- und Produktionsdatenbanken immer auf demselben Stand. Bekannte Werkzeuge: Flyway, Liquibase, Alembic, Django Migrations, Prisma Migrate. Bereits ausgerollte Migrationen nie ändern, sondern eine neue anlegen.',
    dialects: {
      std: {
        example: e(`
-- V1__kunden_anlegen.sql
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);

-- V2__kunden_email.sql
ALTER TABLE kunden ADD COLUMN email VARCHAR(100);
CREATE UNIQUE INDEX ux_kunden_email ON kunden (email);

-- Verwaltungstabelle des Werkzeugs (vereinfacht, vgl. flyway_schema_history)
CREATE TABLE schema_version (version INTEGER PRIMARY KEY, beschreibung VARCHAR(100) NOT NULL);
INSERT INTO schema_version (version, beschreibung) VALUES (1, 'kunden anlegen'), (2, 'kunden email');

SELECT MAX(version) AS aktueller_stand FROM schema_version;
-- aktueller_stand
-- 2
`)
      },
      pg: { note: 'DDL ist transaktional: Eine Migration in `BEGIN … COMMIT` wird bei einem Fehler komplett zurückgerollt. Indizes auf großen Tabellen im Betrieb mit `CREATE INDEX CONCURRENTLY` (außerhalb einer Transaktion) anlegen.' },
      mysql: { note: 'DDL committet implizit – scheitert eine Migration in der Mitte, bleibt ein halber Stand zurück. Daher eine Schemaänderung pro Migrationsdatei; `ALTER TABLE … ALGORITHM=INSTANT` vermeidet lange Sperren.' },
      mssql: {
        example: e(`
-- V1__kunden_anlegen.sql
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);

-- V2__kunden_email.sql
ALTER TABLE kunden ADD email VARCHAR(100);
CREATE UNIQUE INDEX ux_kunden_email ON kunden (email) WHERE email IS NOT NULL;

-- Verwaltungstabelle des Werkzeugs (vereinfacht, vgl. flyway_schema_history)
CREATE TABLE schema_version (version INTEGER PRIMARY KEY, beschreibung VARCHAR(100) NOT NULL);
INSERT INTO schema_version (version, beschreibung) VALUES (1, 'kunden anlegen'), (2, 'kunden email');

SELECT MAX(version) AS aktueller_stand FROM schema_version;
-- aktueller_stand
-- 2
`),
        note: '`ALTER TABLE … ADD` ohne `COLUMN`. Ein UNIQUE-Index erlaubt nur ein einziges `NULL` – daher gefiltert auf `IS NOT NULL`. Skripte mit `CREATE VIEW/PROCEDURE` brauchen `GO` als Batch-Trenner.',
        mdn: MS + 'statements/alter-table-transact-sql'
      },
      sqlite: { note: '`ALTER TABLE` kann nur Spalten hinzufügen, umbenennen und (seit 3.35) löschen; für andere Änderungen legen Werkzeuge die Tabelle neu an und kopieren die Daten.', mdn: SL + 'lang_altertable.html' }
    },
    tip: 'Änderungen an großen Tabellen in kleine, abwärtskompatible Schritte zerlegen (Spalte hinzufügen, befüllen, Code umstellen, alte Spalte entfernen) – dann geht das Deployment ohne Ausfall.',
    keywords: ['migration', 'schema migration', 'flyway', 'liquibase', 'alembic', 'versionierung', 'schemaänderung', 'deployment'],
    related: ['ALTER TABLE', 'ADD COLUMN', 'ORM', 'Backup & Export'],
    mdn: PG + 'ddl-alter.html'
  },
  {
    lang: 'sql', group: 'SQL aus Programmiersprachen', name: 'Backup & Export',
    desc: 'Datenbanken sichern, wiederherstellen und Daten als CSV exportieren.',
    details: 'Logische Backups erzeugen SQL bzw. ein Archiv, das sich auch auf einer anderen Version wieder einspielen lässt; jede Datenbank bringt dafür eigene Werkzeuge mit. Wichtig ist eine konsistente Sicherung im laufenden Betrieb – das bloße Kopieren der Dateien während Schreibzugriffen kann eine defekte Sicherung liefern. Große Systeme setzen zusätzlich auf physische Backups mit Point-in-Time-Recovery.',
    values: [
      ['Logisches Backup', 'SQL-Skript oder Archiv der Daten, versionsunabhängig'],
      ['Physisches Backup', 'Kopie der Datendateien plus Transaktionslog, schnell und mit Point-in-Time-Recovery']
    ],
    dialects: {
      std: { none: 'Kein Standard; Sichern und Wiederherstellen sind Werkzeuge der jeweiligen Datenbank (siehe die Dialekt-Tabs).' },
      pg: {
        syntax: 'pg_dump -d datenbank -Fc -f datei.dump\npg_restore -d ziel datei.dump',
        example: e(`
# Sicherung im Custom-Format und Wiederherstellung
pg_dump -U app -d shop -Fc -f shop.dump
pg_restore -U app -d shop_neu --clean shop.dump

# alle Datenbanken plus Rollen
pg_dumpall -U postgres -f alles.sql

# CSV-Export auf den Client
psql -d shop -c "\\copy (SELECT * FROM kunden) TO 'kunden.csv' CSV HEADER"
`),
        exampleLang: 'sh',
        note: '`-Fc` erzeugt ein komprimiertes Archiv, aus dem `pg_restore` auch einzelne Tabellen holen kann. Physische Backups mit `pg_basebackup` plus WAL-Archivierung.',
        mdn: PG + 'backup-dump.html'
      },
      mysql: {
        syntax: 'mysqldump --single-transaction datenbank > datei.sql\nmysql ziel < datei.sql',
        example: e(`
# konsistenter Dump von InnoDB-Tabellen ohne Tabellensperren
mysqldump -u app -p --single-transaction --routines --triggers shop > shop.sql
mysql -u app -p shop_neu < shop.sql

# CSV-Export über den Client
mysql -u app -p --batch -e "SELECT * FROM kunden" shop > kunden.tsv
`),
        exampleLang: 'sh',
        note: '`--single-transaction` liest einen Schnappschuss, ohne Schreiber zu blockieren. Seit 8.0 gibt es zusätzlich `mysqlpump` bzw. MySQL Shell `util.dumpInstance()` für parallele Dumps.',
        mdn: MY + 'mysqldump.html'
      },
      mssql: {
        syntax: "BACKUP DATABASE db TO DISK = 'pfad.bak';\nRESTORE DATABASE db FROM DISK = 'pfad.bak';",
        example: e(`
-- Vollsicherung auf dem Server
BACKUP DATABASE shop
TO DISK = '/var/opt/mssql/backup/shop.bak'
WITH COMPRESSION, CHECKSUM, INIT;

-- Wiederherstellen unter neuem Namen
RESTORE DATABASE shop_neu
FROM DISK = '/var/opt/mssql/backup/shop.bak'
WITH MOVE 'shop' TO '/var/opt/mssql/data/shop_neu.mdf',
     MOVE 'shop_log' TO '/var/opt/mssql/data/shop_neu_log.ldf';
`),
        nocheck: true,
        note: 'Sicherungen sind physisch und schreiben auf das Dateisystem des Servers. CSV-Export vom Client mit `bcp "SELECT * FROM shop.dbo.kunden" queryout kunden.csv -c -t,`.',
        mdn: MS + 'statements/backup-transact-sql'
      },
      sqlite: {
        syntax: 'sqlite3 db ".backup kopie.db"\nsqlite3 db "VACUUM INTO \'kopie.db\'"',
        example: e(`
# konsistente Kopie, auch wenn gerade geschrieben wird
sqlite3 shop.db ".backup shop-backup.db"
sqlite3 shop.db "VACUUM INTO 'shop-kopie.db'"

# als SQL-Skript sichern und einspielen
sqlite3 shop.db .dump > shop.sql
sqlite3 shop_neu.db < shop.sql

# CSV-Export
sqlite3 -header -csv shop.db "SELECT * FROM kunden;" > kunden.csv
`),
        exampleLang: 'sh',
        note: '`.backup` nutzt die Online-Backup-API, `VACUUM INTO` (seit 3.27) schreibt zusätzlich eine kompaktierte Kopie.',
        mdn: SL + 'lang_vacuum.html'
      }
    },
    tip: 'Ein Backup ist erst etwas wert, wenn die Wiederherstellung getestet wurde – regelmäßig in eine Testdatenbank zurückspielen.',
    keywords: ['backup', 'sicherung', 'export', 'dump', 'pg_dump', 'mysqldump', 'restore', 'wiederherstellen', 'csv export', 'backup database', 'bcp'],
    related: ['Bulk-Import (COPY / LOAD DATA)', 'Datenbank-Migrationen', 'Transaktion'],
    mdn: PG + 'backup.html'
  }
  );
})();
