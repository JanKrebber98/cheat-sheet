window.CHEAT = window.CHEAT || [];
(function () {
  var PG = 'https://www.postgresql.org/docs/current/'; // + z. B. 'sql-createtable.html'
  var SL = 'https://sqlite.org/';                      // + z. B. 'lang_createtable.html'
  var MY = 'https://dev.mysql.com/doc/refman/8.4/en/'; // + z. B. 'create-table.html'
  var MS = 'https://learn.microsoft.com/en-us/sql/t-sql/'; // + z. B. 'statements/create-table-transact-sql'
  function e(s) { return s.replace(/^\n/, '').replace(/\n\s*$/, ''); }

  window.CHEAT.push(
  // ---------------- Tabellen ----------------
  {
    lang: 'sql', group: 'Tabellen', name: 'CREATE TABLE',
    desc: 'Legt eine neue Tabelle mit Spalten, Datentypen und Constraints an.',
    details: 'Jede Spalte bekommt einen Namen, einen Datentyp und optional Constraints wie `NOT NULL`, `DEFAULT`, `CHECK` oder `PRIMARY KEY`. Tabellenweite Constraints (z. B. zusammengesetzte Schlüssel) stehen nach den Spalten. Die Typnamen unterscheiden sich je Dialekt; portabel sind `INTEGER`, `VARCHAR(n)`, `DECIMAL(p, s)` und `DATE`.',
    values: [
      ['Spalten-Constraint', 'Direkt hinter der Spalte: NOT NULL, UNIQUE, CHECK (…), DEFAULT …, REFERENCES …'],
      ['Tabellen-Constraint', 'Nach den Spalten: PRIMARY KEY (a, b), FOREIGN KEY (…) REFERENCES …'],
      ['Portable Typen', 'INTEGER, VARCHAR(n), DECIMAL(p, s), DATE, TIMESTAMP']
    ],
    dialects: {
      std: {
        syntax: 'CREATE TABLE tabelle (\n  spalte typ [constraint …],\n  …\n  [, tabellen_constraint …]\n);',
        example: e(`
CREATE TABLE mitarbeiter (
  id          INTEGER       PRIMARY KEY,
  name        VARCHAR(50)   NOT NULL,
  abteilung   VARCHAR(30),
  gehalt      DECIMAL(10,2) CHECK (gehalt >= 0),
  eingestellt DATE          DEFAULT CURRENT_DATE
);

INSERT INTO mitarbeiter (id, name, abteilung, gehalt, eingestellt)
VALUES (1, 'Ada', 'IT', 5200, '2021-03-01'),
       (2, 'Lin', 'IT', 4800, '2022-07-15'),
       (3, 'Tom', 'Vertrieb', 3900, '2020-01-10');

SELECT id, name, gehalt, eingestellt FROM mitarbeiter ORDER BY id;
-- id | name | gehalt  | eingestellt
-- 1  | Ada  | 5200.00 | 2021-03-01
-- 2  | Lin  | 4800.00 | 2022-07-15
-- 3  | Tom  | 3900.00 | 2020-01-10
`)
      },
      pg: { note: 'Üblich sind `TEXT` statt `VARCHAR(n)`, `NUMERIC` statt `DECIMAL` und `TIMESTAMPTZ` für Zeitpunkte. Eine Längenbegrenzung kostet bei `TEXT` nichts extra.' },
      mysql: {
        example: e(`
CREATE TABLE mitarbeiter (
  id          INT           PRIMARY KEY,
  name        VARCHAR(50)   NOT NULL,
  abteilung   VARCHAR(30),
  gehalt      DECIMAL(10,2) CHECK (gehalt >= 0),
  eingestellt DATE          DEFAULT (CURRENT_DATE)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

INSERT INTO mitarbeiter (id, name, abteilung, gehalt, eingestellt)
VALUES (1, 'Ada', 'IT', 5200, '2021-03-01'),
       (2, 'Lin', 'IT', 4800, '2022-07-15'),
       (3, 'Tom', 'Vertrieb', 3900, '2020-01-10');

SELECT id, name, gehalt, eingestellt FROM mitarbeiter ORDER BY id;
-- id | name | gehalt  | eingestellt
-- 1  | Ada  | 5200.00 | 2021-03-01
-- 2  | Lin  | 4800.00 | 2022-07-15
-- 3  | Tom  | 3900.00 | 2020-01-10
`),
        note: 'Ausdrücke als Default (auch `CURRENT_DATE`) müssen in Klammern stehen (seit 8.0.13). `ENGINE` und `CHARSET` lassen sich pro Tabelle festlegen.',
        mdn: MY + 'create-table.html'
      },
      mssql: {
        example: e(`
CREATE TABLE mitarbeiter (
  id          INT           PRIMARY KEY,
  name        NVARCHAR(50)  NOT NULL,
  abteilung   NVARCHAR(30),
  gehalt      DECIMAL(10,2) CHECK (gehalt >= 0),
  eingestellt DATE          DEFAULT CAST(GETDATE() AS DATE)
);

INSERT INTO mitarbeiter (id, name, abteilung, gehalt, eingestellt)
VALUES (1, 'Ada', 'IT', 5200, '2021-03-01'),
       (2, 'Lin', 'IT', 4800, '2022-07-15'),
       (3, 'Tom', 'Vertrieb', 3900, '2020-01-10');

SELECT id, name, gehalt, eingestellt FROM mitarbeiter ORDER BY id;
-- id | name | gehalt  | eingestellt
-- 1  | Ada  | 5200.00 | 2021-03-01
-- 2  | Lin  | 4800.00 | 2022-07-15
-- 3  | Tom  | 3900.00 | 2020-01-10
`),
        note: '`NVARCHAR(n)` speichert Unicode, `DATETIME2` ist der moderne Zeitstempeltyp, `BIT` ersetzt `BOOLEAN`. Statt `CURRENT_DATE` nimmt man `CAST(GETDATE() AS DATE)`.',
        mdn: MS + 'statements/create-table-transact-sql'
      },
      sqlite: {
        note: 'Der Typ bestimmt nur die Affinität, gespeichert wird fast alles. Mit `CREATE TABLE … (…) STRICT` erzwingt SQLite echte Typen (dann nur `INTEGER`, `REAL`, `TEXT`, `BLOB`, `ANY`).',
        mdn: SL + 'lang_createtable.html'
      }
    },
    tip: 'Tabellen- und Spaltennamen klein und ohne Leerzeichen wählen, dann muss man sie nie quoten.',
    keywords: ['tabelle anlegen', 'create table', 'ddl', 'tabelle erstellen', 'schema', 'spalten definieren', 'engine', 'nvarchar', 'strict'],
    related: ['IF NOT EXISTS', 'PRIMARY KEY', 'DEFAULT', 'STRICT-Tabellen'],
    mdn: PG + 'sql-createtable.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'IF NOT EXISTS',
    desc: 'Legt ein Objekt nur an, wenn es noch nicht existiert, statt einen Fehler zu werfen.',
    details: 'Mit `CREATE TABLE IF NOT EXISTS` lassen sich Setup-Skripte mehrfach ausführen. Achtung: Existiert die Tabelle schon, passiert gar nichts, auch wenn die neue Definition andere Spalten hätte. Das Gegenstück beim Löschen ist `DROP … IF EXISTS`.',
    dialects: {
      std: { none: 'Nicht im ISO-Standard. Portabel prüft man vorher in `information_schema.tables`, ob die Tabelle existiert.' },
      pg: {
        syntax: 'CREATE TABLE IF NOT EXISTS tabelle (…);\nCREATE INDEX IF NOT EXISTS name ON tabelle (…);',
        example: e(`
CREATE TABLE IF NOT EXISTS kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));

-- Zweiter Aufruf mit anderer Definition: wird übersprungen (nur ein NOTICE)
CREATE TABLE IF NOT EXISTS kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));

SELECT column_name AS spalte
FROM information_schema.columns
WHERE table_name = 'kunden'
ORDER BY ordinal_position;
-- spalte
-- id
-- name
`),
        note: 'Gibt es auch für Indizes, Schemas, Sequenzen und `ALTER TABLE … ADD COLUMN IF NOT EXISTS`.'
      },
      mysql: {
        syntax: 'CREATE TABLE IF NOT EXISTS tabelle (…);',
        example: e(`
CREATE TABLE IF NOT EXISTS kunden (id INT PRIMARY KEY, name VARCHAR(50));

-- Zweiter Aufruf mit anderer Definition: wird übersprungen (nur eine Warnung)
CREATE TABLE IF NOT EXISTS kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));

SELECT column_name AS spalte
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'kunden'
ORDER BY ordinal_position;
-- spalte
-- id
-- name
`),
        note: '`CREATE INDEX IF NOT EXISTS` kennt MySQL nicht.',
        mdn: MY + 'create-table.html'
      },
      mssql: {
        syntax: "IF OBJECT_ID('dbo.tabelle', 'U') IS NULL\n  CREATE TABLE dbo.tabelle (…);",
        example: e(`
IF OBJECT_ID('dbo.kunden', 'U') IS NULL
  CREATE TABLE dbo.kunden (id INT PRIMARY KEY, name NVARCHAR(50));
GO

-- Zweiter Aufruf mit anderer Definition: wird übersprungen
IF OBJECT_ID('dbo.kunden', 'U') IS NULL
  CREATE TABLE dbo.kunden (id INT PRIMARY KEY, name NVARCHAR(50), stadt NVARCHAR(50));
GO

SELECT name AS spalte
FROM sys.columns
WHERE object_id = OBJECT_ID('dbo.kunden')
ORDER BY column_id;
-- spalte
-- id
-- name
`),
        note: 'Kein `CREATE TABLE IF NOT EXISTS`. `DROP TABLE IF EXISTS` gibt es seit SQL Server 2016. Der zweite Parameter von `OBJECT_ID` ist der Objekttyp (`U` = Tabelle, `V` = View).'
      },
      sqlite: {
        syntax: 'CREATE TABLE IF NOT EXISTS tabelle (…);\nCREATE INDEX IF NOT EXISTS name ON tabelle (…);',
        example: e(`
CREATE TABLE IF NOT EXISTS kunden (id INTEGER PRIMARY KEY, name TEXT);

-- Zweiter Aufruf mit anderer Definition: wird stillschweigend ignoriert!
CREATE TABLE IF NOT EXISTS kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT);

SELECT name AS spalte FROM pragma_table_info('kunden') ORDER BY cid;
-- spalte
-- id
-- name
`),
        mdn: SL + 'lang_createtable.html'
      }
    },
    tip: 'Für Schemaänderungen an bestehenden Datenbanken sind Migrationen da, nicht `IF NOT EXISTS`.',
    keywords: ['falls nicht vorhanden', 'idempotent', 'if exists', 'setup-skript', 'ohne fehler', 'object_id'],
    related: ['CREATE TABLE', 'DROP TABLE', 'Datenbank-Migrationen'],
    mdn: PG + 'sql-createtable.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'DROP TABLE',
    desc: 'Löscht eine Tabelle samt Inhalt, Indizes und Triggern endgültig.',
    details: 'Im Gegensatz zu `DELETE` oder `TRUNCATE` verschwindet auch die Tabellendefinition. Verweisen Fremdschlüssel anderer Tabellen auf sie, schlägt das Löschen fehl. Mit `IF EXISTS` gibt es keinen Fehler, wenn die Tabelle fehlt. Ob sich `DROP TABLE` per `ROLLBACK` zurücknehmen lässt, hängt vom Dialekt ab.',
    values: [
      ['IF EXISTS', 'Kein Fehler, wenn die Tabelle nicht existiert (verbreitet, aber nicht im ISO-Standard)'],
      ['CASCADE', 'Abhängige Views und Fremdschlüssel mitlöschen'],
      ['RESTRICT', 'Abbruch, wenn noch etwas davon abhängt (Standardverhalten)']
    ],
    dialects: {
      std: {
        syntax: 'DROP TABLE tabelle [CASCADE | RESTRICT];',
        example: e(`
CREATE TABLE alt_log (id INTEGER PRIMARY KEY, meldung VARCHAR(100));
INSERT INTO alt_log (id, meldung) VALUES (1, 'Start'), (2, 'Ende');

DROP TABLE alt_log;

SELECT COUNT(*) AS anzahl
FROM information_schema.tables
WHERE table_name = 'alt_log';
-- anzahl
-- 0
`)
      },
      pg: {
        syntax: 'DROP TABLE [IF EXISTS] tabelle [, …] [CASCADE | RESTRICT];',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT);
CREATE VIEW v_kunden AS SELECT id, name FROM kunden;

-- DROP TABLE kunden;  → Fehler: cannot drop table kunden because other objects depend on it
DROP TABLE kunden CASCADE;      -- löscht die View mit
DROP TABLE IF EXISTS kunden;    -- kein Fehler, nur ein NOTICE

SELECT COUNT(*) AS anzahl
FROM information_schema.tables
WHERE table_name IN ('kunden', 'v_kunden');
-- anzahl
-- 0
`),
        note: '`DROP TABLE` ist transaktional und lässt sich mit `ROLLBACK` zurücknehmen.',
        mdn: PG + 'sql-droptable.html'
      },
      mysql: {
        syntax: 'DROP [TEMPORARY] TABLE [IF EXISTS] tabelle [, …];',
        example: e(`
CREATE TABLE alt_log (id INT PRIMARY KEY, meldung VARCHAR(100));
INSERT INTO alt_log (id, meldung) VALUES (1, 'Start'), (2, 'Ende');

DROP TABLE alt_log;
DROP TABLE IF EXISTS alt_log;   -- kein Fehler, nur eine Warnung

SELECT COUNT(*) AS anzahl
FROM information_schema.tables
WHERE table_schema = DATABASE() AND table_name = 'alt_log';
-- anzahl
-- 0
`),
        note: '`DROP TABLE` beendet die laufende Transaktion (implizites Commit) und lässt sich nicht zurücknehmen. `CASCADE` und `RESTRICT` werden akzeptiert, aber ignoriert.',
        mdn: MY + 'drop-table.html'
      },
      mssql: {
        note: 'Seit SQL Server 2016 auch `DROP TABLE IF EXISTS`. `CASCADE` gibt es nicht: Fremdschlüssel, die auf die Tabelle zeigen, vorher entfernen. Innerhalb einer Transaktion ist `DROP TABLE` zurücknehmbar.',
        mdn: MS + 'statements/drop-table-transact-sql'
      },
      sqlite: {
        syntax: 'DROP TABLE [IF EXISTS] tabelle;',
        example: e(`
CREATE TABLE alt_log (id INTEGER PRIMARY KEY, meldung TEXT);
INSERT INTO alt_log (meldung) VALUES ('Start'), ('Ende');

DROP TABLE alt_log;
DROP TABLE IF EXISTS alt_log;   -- kein Fehler, obwohl schon gelöscht

SELECT COUNT(*) AS anzahl FROM sqlite_schema WHERE name = 'alt_log';
-- anzahl
-- 0
`),
        note: 'Kein `CASCADE`; immer nur eine Tabelle pro Anweisung. Transaktional wie in PostgreSQL.',
        mdn: SL + 'lang_droptable.html'
      }
    },
    tip: 'Vor einem `DROP TABLE` in Produktion immer ein Backup ziehen oder es in einer Transaktion testen.',
    keywords: ['tabelle löschen', 'drop', 'entfernen', 'cascade', 'if exists'],
    related: ['TRUNCATE', 'DELETE', 'CREATE TABLE'],
    mdn: PG + 'sql-droptable.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'ALTER TABLE',
    desc: 'Ändert die Struktur einer bestehenden Tabelle: Spalten, Namen, Constraints.',
    details: 'Mit `ALTER TABLE` fügt man Spalten hinzu, benennt sie um, löscht sie oder ändert Typen und Constraints, ohne die Daten neu zu laden. Der Funktionsumfang schwankt je Dialekt stark. Große Tabellen werden bei manchen Änderungen (z. B. Typwechsel) komplett umgeschrieben und dabei gesperrt.',
    values: [
      ['ADD COLUMN spalte typ', 'Neue Spalte am Ende anfügen'],
      ['DROP COLUMN spalte', 'Spalte entfernen'],
      ['ALTER COLUMN … SET DEFAULT …', 'Default ändern'],
      ['ALTER COLUMN … SET DATA TYPE …', 'Typ ändern'],
      ['ADD CONSTRAINT …', 'Constraint nachträglich hinzufügen'],
      ['RENAME …', 'Tabelle oder Spalte umbenennen (nicht im ISO-Standard)']
    ],
    dialects: {
      std: {
        syntax: 'ALTER TABLE tabelle aktion;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2), alt_code VARCHAR(10));
INSERT INTO produkte (id, name, preis, alt_code)
VALUES (1, 'Tastatur', 49.90, 'T1'), (2, 'Maus', 19.90, 'M7');

ALTER TABLE produkte ADD COLUMN kategorie VARCHAR(30) DEFAULT 'Zubehör';
ALTER TABLE produkte DROP COLUMN alt_code;

SELECT id, name, preis, kategorie FROM produkte ORDER BY id;
-- id | name     | preis | kategorie
-- 1  | Tastatur | 49.90 | Zubehör
-- 2  | Maus     | 19.90 | Zubehör
`)
      },
      pg: { note: 'Kann fast alles. Mehrere Aktionen durch Komma getrennt in ein `ALTER TABLE` schreiben, dann wird die Tabelle nur einmal umgeschrieben.' },
      mysql: { note: 'Zusätzlich `MODIFY` (Spalte neu definieren), `CHANGE` (umbenennen und neu definieren) sowie `FIRST` / `AFTER spalte` für die Position.', mdn: MY + 'alter-table.html' },
      mssql: {
        syntax: 'ALTER TABLE tabelle ADD spalte typ;\nALTER TABLE tabelle DROP COLUMN spalte;\nALTER TABLE tabelle ALTER COLUMN spalte typ;',
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), preis DECIMAL(10,2), alt_code NVARCHAR(10));
INSERT INTO produkte (id, name, preis, alt_code)
VALUES (1, 'Tastatur', 49.90, 'T1'), (2, 'Maus', 19.90, 'M7');

-- ADD ohne COLUMN; WITH VALUES füllt den Default auch in bestehende Zeilen
ALTER TABLE produkte ADD kategorie NVARCHAR(30) DEFAULT 'Zubehör' WITH VALUES;
ALTER TABLE produkte DROP COLUMN alt_code;
GO

SELECT id, name, preis, kategorie FROM produkte ORDER BY id;
-- id | name     | preis | kategorie
-- 1  | Tastatur | 49.90 | Zubehör
-- 2  | Maus     | 19.90 | Zubehör
`),
        note: 'Ohne `WITH VALUES` bekommen bestehende Zeilen bei einer `NULL`-baren Spalte `NULL` statt des Defaults. Umbenennen geht nur mit `sp_rename`.',
        mdn: MS + 'statements/alter-table-transact-sql'
      },
      sqlite: { note: 'Kann nur `RENAME TO`, `RENAME COLUMN`, `ADD COLUMN` und `DROP COLUMN` (seit 3.35). Alles andere: Tabelle neu anlegen, Daten kopieren, umbenennen.', mdn: SL + 'lang_altertable.html' }
    },
    tip: 'Schemaänderungen immer als versionierte Migration ablegen, nicht von Hand in der Produktivdatenbank ausführen.',
    keywords: ['tabelle ändern', 'alter', 'struktur ändern', 'schema ändern', 'spalte', 'modify', 'with values'],
    related: ['ADD COLUMN', 'RENAME COLUMN', 'DROP COLUMN', 'Spaltentyp ändern'],
    mdn: PG + 'sql-altertable.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'Tabelle umbenennen',
    desc: 'Gibt einer bestehenden Tabelle einen neuen Namen.',
    details: 'Die Daten, Indizes und Constraints bleiben erhalten. Ob Verweise in Views, Triggern und Fremdschlüsseln automatisch angepasst werden, hängt vom Dialekt ab. Anwendungscode, der den alten Namen benutzt, bricht natürlich trotzdem.',
    dialects: {
      std: { none: 'Nicht im ISO-Standard. Die meisten Systeme kennen `ALTER TABLE alt RENAME TO neu`, SQL Server nutzt `sp_rename`.' },
      pg: {
        syntax: 'ALTER TABLE alt RENAME TO neu;',
        example: e(`
CREATE TABLE kunde (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO kunde (id, name) VALUES (1, 'Müller'), (2, 'Schmidt');

ALTER TABLE kunde RENAME TO kunden;

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
`),
        note: 'Views, Fremdschlüssel und Trigger verweisen intern über die OID und bleiben gültig.'
      },
      mysql: {
        syntax: 'RENAME TABLE alt TO neu [, alt2 TO neu2];\nALTER TABLE alt RENAME TO neu;',
        example: e(`
CREATE TABLE kunde (id INT PRIMARY KEY, name VARCHAR(50));
INSERT INTO kunde (id, name) VALUES (1, 'Müller'), (2, 'Schmidt');

RENAME TABLE kunde TO kunden;

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
`),
        note: '`RENAME TABLE` kann mehrere Tabellen in einem Schritt atomar umbenennen, z. B. zum Austauschen zweier Tabellen. Views werden nicht angepasst.',
        mdn: MY + 'rename-table.html'
      },
      mssql: {
        syntax: "EXEC sp_rename 'schema.alt', 'neu';",
        example: e(`
CREATE TABLE kunde (id INT PRIMARY KEY, name NVARCHAR(50));
INSERT INTO kunde (id, name) VALUES (1, 'Müller'), (2, 'Schmidt');
GO

EXEC sp_rename 'dbo.kunde', 'kunden';
GO

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
`),
        note: 'Der neue Name wird ohne Schema angegeben. Views und Prozeduren, die den alten Namen enthalten, werden nicht angepasst (Warnung beachten).',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-rename-transact-sql'
      },
      sqlite: {
        syntax: 'ALTER TABLE alt RENAME TO neu;',
        example: e(`
CREATE TABLE kunde (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO kunde (name) VALUES ('Müller'), ('Schmidt');

ALTER TABLE kunde RENAME TO kunden;

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
`),
        note: 'Seit 3.26 werden Verweise in Views, Triggern und Fremdschlüsseln mit angepasst.',
        mdn: SL + 'lang_altertable.html'
      }
    },
    tip: 'Für einen Umbau ohne Ausfallzeit erst eine View mit dem alten Namen anlegen und den Code danach schrittweise umstellen.',
    keywords: ['rename table', 'umbenennen', 'tabellenname ändern', 'sp_rename', 'rename to'],
    related: ['ALTER TABLE', 'RENAME COLUMN', 'Namenskonventionen'],
    mdn: PG + 'sql-altertable.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'ADD COLUMN',
    desc: 'Fügt einer bestehenden Tabelle eine neue Spalte hinzu.',
    details: 'Bestehende Zeilen bekommen den `DEFAULT`-Wert, ohne Default `NULL`. Eine `NOT NULL`-Spalte braucht deshalb einen Default, sonst schlägt die Änderung bei gefüllten Tabellen fehl. Neue Spalten landen am Ende der Tabelle.',
    dialects: {
      std: {
        syntax: 'ALTER TABLE tabelle ADD [COLUMN] spalte typ [DEFAULT wert] [NOT NULL];',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt');

ALTER TABLE kunden ADD COLUMN stadt VARCHAR(50);
ALTER TABLE kunden ADD COLUMN aktiv INTEGER DEFAULT 1 NOT NULL;

SELECT name, stadt, aktiv FROM kunden ORDER BY id;
-- name    | stadt | aktiv
-- Müller  | NULL  | 1
-- Schmidt | NULL  | 1
`)
      },
      pg: { note: '`ADD COLUMN IF NOT EXISTS` ist möglich. Mit konstantem Default ist das Hinzufügen auch bei großen Tabellen sofort fertig (seit Version 11).' },
      mysql: { note: 'Mit `AFTER andere_spalte` oder `FIRST` lässt sich die Position bestimmen.', mdn: MY + 'alter-table.html' },
      mssql: {
        syntax: 'ALTER TABLE tabelle ADD spalte typ [NOT NULL] [DEFAULT wert [WITH VALUES]];',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50) NOT NULL);
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt');

ALTER TABLE kunden ADD stadt NVARCHAR(50);
ALTER TABLE kunden ADD aktiv BIT NOT NULL DEFAULT 1;
GO

SELECT name, stadt, aktiv FROM kunden ORDER BY id;
-- name    | stadt | aktiv
-- Müller  | NULL  | 1
-- Schmidt | NULL  | 1
`),
        note: 'Ohne das Wort `COLUMN`. Bei `NULL`-baren Spalten füllt nur `WITH VALUES` den Default in bestehende Zeilen.',
        mdn: MS + 'statements/alter-table-transact-sql'
      },
      sqlite: { note: 'Kein `PRIMARY KEY` und kein `UNIQUE` beim Hinzufügen; der Default muss konstant sein (kein `CURRENT_TIMESTAMP`).', mdn: SL + 'lang_altertable.html' }
    },
    tip: 'Auf die Spaltenreihenfolge sollte sich niemand verlassen, deshalb Spalten im `SELECT` immer benennen.',
    keywords: ['spalte hinzufügen', 'neue spalte', 'add column', 'erweitern', 'alter table add'],
    related: ['ALTER TABLE', 'DEFAULT', 'DROP COLUMN'],
    mdn: PG + 'ddl-alter.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'RENAME COLUMN',
    desc: 'Benennt eine Spalte um, ohne Daten zu kopieren.',
    details: 'Die Daten bleiben unverändert, Indizes auf der Spalte bleiben erhalten. Anwendungscode und gespeicherte Abfragen mit dem alten Namen schlagen danach fehl, deshalb gehören Umbenennungen in eine Migration.',
    dialects: {
      std: { none: 'Nicht im ISO-Standard. Verbreitet ist `ALTER TABLE t RENAME COLUMN alt TO neu`, SQL Server nutzt `sp_rename`.' },
      pg: {
        syntax: 'ALTER TABLE tabelle RENAME [COLUMN] alt TO neu;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, nme TEXT, stadt TEXT);
CREATE INDEX idx_kunden_nme ON kunden (nme);
INSERT INTO kunden (id, nme, stadt) VALUES (1, 'Müller', 'Berlin');

ALTER TABLE kunden RENAME COLUMN nme TO name;

SELECT name, stadt FROM kunden;
-- name   | stadt
-- Müller | Berlin

-- Der Index wurde mit angepasst:
SELECT indexdef FROM pg_indexes WHERE indexname = 'idx_kunden_nme';
-- indexdef
-- CREATE INDEX idx_kunden_nme ON public.kunden USING btree (name)
`),
        note: 'Views, Indizes und Constraints passen sich automatisch an.'
      },
      mysql: {
        syntax: 'ALTER TABLE tabelle RENAME COLUMN alt TO neu;\nALTER TABLE tabelle CHANGE alt neu typ;',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, nme VARCHAR(50), stadt VARCHAR(50));
CREATE INDEX idx_kunden_nme ON kunden (nme);
INSERT INTO kunden (id, nme, stadt) VALUES (1, 'Müller', 'Berlin');

ALTER TABLE kunden RENAME COLUMN nme TO name;

SELECT name, stadt FROM kunden;
-- name   | stadt
-- Müller | Berlin

SELECT column_name AS spalte
FROM information_schema.statistics
WHERE table_schema = DATABASE() AND index_name = 'idx_kunden_nme';
-- spalte
-- name
`),
        note: '`RENAME COLUMN` gibt es seit 8.0; vorher nur `CHANGE alt neu typ`, das die komplette Spaltendefinition verlangt.',
        mdn: MY + 'alter-table.html'
      },
      mssql: {
        syntax: "EXEC sp_rename 'tabelle.alt', 'neu', 'COLUMN';",
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, nme NVARCHAR(50), stadt NVARCHAR(50));
CREATE INDEX idx_kunden_nme ON kunden (nme);
INSERT INTO kunden (id, nme, stadt) VALUES (1, 'Müller', 'Berlin');
GO

EXEC sp_rename 'dbo.kunden.nme', 'name', 'COLUMN';
GO

SELECT name, stadt FROM kunden;
-- name   | stadt
-- Müller | Berlin
`),
        note: 'Indizes und Constraints folgen der Umbenennung, Views und Prozeduren mit dem alten Namen nicht.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-rename-transact-sql'
      },
      sqlite: {
        syntax: 'ALTER TABLE tabelle RENAME COLUMN alt TO neu;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, nme TEXT, stadt TEXT);
CREATE INDEX idx_kunden_nme ON kunden (nme);
INSERT INTO kunden (nme, stadt) VALUES ('Müller', 'Berlin');

ALTER TABLE kunden RENAME COLUMN nme TO name;

SELECT name, stadt FROM kunden;
-- name   | stadt
-- Müller | Berlin

-- Der Index wurde mit angepasst:
SELECT sql FROM sqlite_schema WHERE name = 'idx_kunden_nme';
-- sql
-- CREATE INDEX idx_kunden_nme ON kunden (name)
`),
        note: 'Seit 3.25; Indizes, Views und Trigger werden angepasst.',
        mdn: SL + 'lang_altertable.html'
      }
    },
    tip: 'Der Name des Index ändert sich nicht mit; wer Namenskonventionen wie `idx_tabelle_spalte` nutzt, sollte ihn neu anlegen.',
    keywords: ['spalte umbenennen', 'rename', 'column', 'umbenennen', 'sp_rename', 'change'],
    related: ['ALTER TABLE', 'Tabelle umbenennen', 'Namenskonventionen'],
    mdn: PG + 'sql-altertable.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'DROP COLUMN',
    desc: 'Entfernt eine Spalte samt ihrer Daten aus einer Tabelle.',
    details: 'Die Werte der Spalte sind danach weg. Nutzen Views, Indizes oder Constraints die Spalte, verweigern viele Systeme das Löschen oder löschen die Abhängigkeiten mit. Je nach Dialekt wird der Speicherplatz sofort oder erst später freigegeben.',
    dialects: {
      std: {
        syntax: 'ALTER TABLE tabelle DROP [COLUMN] spalte [CASCADE | RESTRICT];',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), fax VARCHAR(20));
INSERT INTO kunden (id, name, fax) VALUES (1, 'Müller', '030-123456');

ALTER TABLE kunden DROP COLUMN fax;

SELECT * FROM kunden;
-- id | name
-- 1  | Müller
`)
      },
      pg: { note: '`DROP COLUMN IF EXISTS` und `CASCADE` (löscht abhängige Views mit) sind möglich. Die Spalte wird nur als gelöscht markiert, der Platz erst bei späteren Schreibvorgängen frei.' },
      mysql: { note: 'Mehrere Spalten in einem `ALTER TABLE`: `DROP COLUMN a, DROP COLUMN b`.', mdn: MY + 'alter-table.html' },
      mssql: { note: 'Hat die Spalte einen `DEFAULT`- oder `CHECK`-Constraint, muss dieser vorher mit `DROP CONSTRAINT` entfernt werden. Seit 2016 auch `DROP COLUMN IF EXISTS`.', mdn: MS + 'statements/alter-table-transact-sql' },
      sqlite: { note: 'Seit 3.35. Nicht für Spalten, die Teil von Primärschlüssel, `UNIQUE`, Index, Fremdschlüssel oder generierter Spalte sind.', mdn: SL + 'lang_altertable.html' }
    },
    tip: 'Bei laufenden Anwendungen zuerst den Code anpassen, sodass er die Spalte nicht mehr liest, und erst im nächsten Release die Spalte löschen.',
    keywords: ['spalte löschen', 'spalte entfernen', 'drop column', 'alter table drop'],
    related: ['ALTER TABLE', 'ADD COLUMN', 'Datenbank-Migrationen'],
    mdn: PG + 'ddl-alter.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'Spaltentyp ändern',
    desc: 'Ändert den Datentyp einer bestehenden Spalte, ggf. mit Umrechnung der Werte.',
    details: 'Die Syntax ist in jedem System anders. Lassen sich die alten Werte nicht automatisch umwandeln, schlägt die Änderung fehl oder braucht eine explizite Umrechnung. Ein Typwechsel schreibt die Tabelle meist komplett neu und sperrt sie so lange.',
    dialects: {
      std: {
        syntax: 'ALTER TABLE tabelle ALTER [COLUMN] spalte SET DATA TYPE neuer_typ;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50), preis DECIMAL(6,2));
INSERT INTO produkte (id, name, preis) VALUES (1, 'Maus', 19.90), (2, 'Monitor', 189.00);

ALTER TABLE produkte ALTER COLUMN preis SET DATA TYPE DECIMAL(12,2);

SELECT numeric_precision, numeric_scale
FROM information_schema.columns
WHERE table_name = 'produkte' AND column_name = 'preis';
-- numeric_precision | numeric_scale
-- 12                | 2
`)
      },
      pg: {
        syntax: 'ALTER TABLE tabelle ALTER COLUMN spalte [SET DATA] TYPE typ [USING ausdruck];',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, datum TEXT, betrag NUMERIC(6,2));
INSERT INTO bestellungen VALUES (1, '2026-03-01', 99.50), (2, '2026-03-15', 20);

-- Text in Datum umwandeln, mit expliziter Umrechnung per USING
ALTER TABLE bestellungen
  ALTER COLUMN betrag TYPE NUMERIC(12,2),
  ALTER COLUMN datum  TYPE DATE USING datum::date;

SELECT id, datum, pg_typeof(datum) AS typ FROM bestellungen ORDER BY id;
-- id | datum      | typ
-- 1  | 2026-03-01 | date
-- 2  | 2026-03-15 | date
`),
        note: 'Ohne `USING` gibt es bei Typen ohne automatische Umwandlung (z. B. Text → Datum) einen Fehler.'
      },
      mysql: {
        syntax: 'ALTER TABLE tabelle MODIFY [COLUMN] spalte typ [NOT NULL] [DEFAULT …];',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, datum VARCHAR(10), betrag DECIMAL(6,2) NOT NULL DEFAULT 0);
INSERT INTO bestellungen VALUES (1, '2026-03-01', 99.50), (2, '2026-03-15', 20);

-- MODIFY definiert die Spalte komplett neu: NOT NULL und DEFAULT wieder angeben!
ALTER TABLE bestellungen
  MODIFY COLUMN betrag DECIMAL(12,2) NOT NULL DEFAULT 0,
  MODIFY COLUMN datum  DATE;

SELECT column_name AS spalte, column_type AS typ, is_nullable
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'bestellungen'
ORDER BY ordinal_position;
-- spalte | typ           | is_nullable
-- id     | int           | NO
-- datum  | date          | YES
-- betrag | decimal(12,2) | NO
`),
        note: 'Bei `MODIFY` gehen `NOT NULL`, `DEFAULT` und Kommentare verloren, wenn man sie nicht erneut angibt.',
        mdn: MY + 'alter-table.html'
      },
      mssql: {
        syntax: 'ALTER TABLE tabelle ALTER COLUMN spalte typ [NULL | NOT NULL];',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, datum VARCHAR(10), betrag DECIMAL(6,2) NOT NULL);
INSERT INTO bestellungen VALUES (1, '2026-03-01', 99.50), (2, '2026-03-15', 20);

ALTER TABLE bestellungen ALTER COLUMN betrag DECIMAL(12,2) NOT NULL;
ALTER TABLE bestellungen ALTER COLUMN datum DATE;

SELECT column_name AS spalte, data_type AS typ, is_nullable
FROM information_schema.columns
WHERE table_name = 'bestellungen'
ORDER BY ordinal_position;
-- spalte | typ     | is_nullable
-- id     | int     | NO
-- datum  | date    | YES
-- betrag | decimal | NO
`),
        note: 'Ohne `NOT NULL` wird die Spalte `NULL`-bar. Spalten mit Index oder Constraint lassen sich oft erst nach dem Entfernen ändern.',
        mdn: MS + 'statements/alter-table-transact-sql'
      },
      sqlite: {
        syntax: 'CREATE TABLE neu (…);\nINSERT INTO neu SELECT … FROM alt;\nDROP TABLE alt;\nALTER TABLE neu RENAME TO alt;',
        example: e(`
CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, preis TEXT);
INSERT INTO produkte (name, preis) VALUES ('Maus', '19.90'), ('Kabel', '4.50');

-- Typ ändern = Tabelle neu aufbauen
CREATE TABLE produkte_neu (id INTEGER PRIMARY KEY, name TEXT, preis REAL);
INSERT INTO produkte_neu SELECT id, name, CAST(preis AS REAL) FROM produkte;
DROP TABLE produkte;
ALTER TABLE produkte_neu RENAME TO produkte;

SELECT name, preis, typeof(preis) AS typ FROM produkte ORDER BY id;
-- name  | preis | typ
-- Maus  | 19.9  | real
-- Kabel | 4.5   | real
`),
        note: 'Spaltentypen lassen sich nicht ändern. Indizes, Trigger und Views der alten Tabelle danach neu anlegen.',
        mdn: SL + 'lang_altertable.html'
      }
    },
    tip: 'Vor dem Typwechsel prüfen, ob alle vorhandenen Werte umwandelbar sind, z. B. mit einer Abfrage auf Werte, die nicht ins neue Format passen.',
    keywords: ['typ ändern', 'datentyp ändern', 'alter column', 'modify', 'using', 'spalte konvertieren', 'set data type'],
    related: ['ALTER TABLE', 'CAST()', ':: (PostgreSQL-Cast)'],
    mdn: PG + 'sql-altertable.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'CREATE TABLE AS',
    desc: 'Erzeugt eine neue Tabelle aus dem Ergebnis einer Abfrage.',
    details: 'Spaltennamen und Typen werden aus dem `SELECT` übernommen, die Daten gleich mit eingefügt. Constraints, Defaults und Indizes der Quelltabelle werden nicht kopiert, auch kein Primärschlüssel. Praktisch für Kopien, Archive und Zwischenergebnisse.',
    values: [
      ['WITH DATA', 'Daten mitkopieren'],
      ['WITH NO DATA', 'Nur die Struktur anlegen'],
      ['WHERE 1 = 0', 'Nur Struktur, in Dialekten ohne WITH NO DATA']
    ],
    dialects: {
      std: {
        syntax: 'CREATE TABLE neue_tabelle AS (\n  SELECT … FROM … [WHERE …]\n) WITH [NO] DATA;',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30), gehalt DECIMAL(10,2));
INSERT INTO mitarbeiter (id, name, abteilung, gehalt)
VALUES (1, 'Ada', 'IT', 5200), (2, 'Lin', 'IT', 4800), (3, 'Tom', 'Vertrieb', 3900);

CREATE TABLE it_team AS (
  SELECT id, name, gehalt FROM mitarbeiter WHERE abteilung = 'IT'
) WITH DATA;

SELECT id, name, gehalt FROM it_team ORDER BY id;
-- id | name | gehalt
-- 1  | Ada  | 5200.00
-- 2  | Lin  | 4800.00
`)
      },
      pg: { note: 'Klammern und `WITH DATA` sind optional. `CREATE TABLE neu (LIKE alt INCLUDING ALL)` kopiert die Struktur samt Defaults, Constraints und Indizes, aber ohne Daten.', mdn: PG + 'sql-createtableas.html' },
      mysql: {
        syntax: 'CREATE TABLE neu AS SELECT …;\nCREATE TABLE neu LIKE alt;',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30), gehalt DECIMAL(10,2));
INSERT INTO mitarbeiter (id, name, abteilung, gehalt)
VALUES (1, 'Ada', 'IT', 5200), (2, 'Lin', 'IT', 4800), (3, 'Tom', 'Vertrieb', 3900);

CREATE TABLE it_team AS
SELECT id, name, gehalt FROM mitarbeiter WHERE abteilung = 'IT';

SELECT id, name, gehalt FROM it_team ORDER BY id;
-- id | name | gehalt
-- 1  | Ada  | 5200.00
-- 2  | Lin  | 4800.00
`),
        note: 'Kein `WITH [NO] DATA`. `CREATE TABLE neu LIKE alt` kopiert die Struktur inklusive Indizes, aber ohne Daten.',
        mdn: MY + 'create-table-select.html'
      },
      mssql: {
        syntax: 'SELECT … INTO neue_tabelle FROM … [WHERE …];',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), abteilung NVARCHAR(30), gehalt DECIMAL(10,2));
INSERT INTO mitarbeiter (id, name, abteilung, gehalt)
VALUES (1, 'Ada', 'IT', 5200), (2, 'Lin', 'IT', 4800), (3, 'Tom', 'Vertrieb', 3900);

SELECT id, name, gehalt
INTO it_team
FROM mitarbeiter
WHERE abteilung = 'IT';

SELECT id, name, gehalt FROM it_team ORDER BY id;
-- id | name | gehalt
-- 1  | Ada  | 5200.00
-- 2  | Lin  | 4800.00
`),
        note: 'Kein `CREATE TABLE … AS`. Nur die Struktur: `SELECT TOP 0 * INTO neu FROM alt`.',
        mdn: MS + 'queries/select-into-clause-transact-sql'
      },
      sqlite: {
        syntax: 'CREATE TABLE neu AS SELECT …;',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name TEXT, abteilung TEXT, gehalt INTEGER);
INSERT INTO mitarbeiter (name, abteilung, gehalt)
VALUES ('Ada', 'IT', 5200), ('Lin', 'IT', 4800), ('Tom', 'Vertrieb', 3900);

CREATE TABLE it_team AS
SELECT id, name, gehalt FROM mitarbeiter WHERE abteilung = 'IT';

SELECT id, name, gehalt FROM it_team ORDER BY id;
-- id | name | gehalt
-- 1  | Ada  | 5200
-- 2  | Lin  | 4800
`),
        note: 'Kein `WITH [NO] DATA`. Die Spalten bekommen nur die Affinität des Ausdrucks, aus `INTEGER PRIMARY KEY` wird ein einfaches `INT`.',
        mdn: SL + 'lang_createtable.html'
      }
    },
    tip: 'Die neue Tabelle hat keinen Primärschlüssel; für den Dauerbetrieb lieber mit `CREATE TABLE` anlegen und per `INSERT … SELECT` füllen.',
    keywords: ['ctas', 'tabelle kopieren', 'select into', 'tabelle aus abfrage', 'backup-tabelle', 'create table like'],
    related: ['INSERT … SELECT', 'Temporäre Tabellen', 'CREATE TABLE'],
    mdn: PG + 'sql-createtableas.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'Temporäre Tabellen',
    desc: 'Tabellen, die nur für die aktuelle Verbindung existieren und danach verschwinden.',
    details: 'Eine temporäre Tabelle ist nur für die Sitzung sichtbar, die sie angelegt hat, und wird beim Trennen automatisch gelöscht. Sie eignet sich für Zwischenergebnisse großer Auswertungen und kann eine normale Tabelle gleichen Namens verdecken.',
    values: [
      ['ON COMMIT PRESERVE ROWS', 'Inhalt bleibt bis zum Ende der Sitzung'],
      ['ON COMMIT DELETE ROWS', 'Inhalt wird bei jedem COMMIT geleert'],
      ['ON COMMIT DROP', 'Tabelle wird beim COMMIT gelöscht (PostgreSQL)']
    ],
    dialects: {
      std: {
        syntax: 'CREATE {GLOBAL | LOCAL} TEMPORARY TABLE name (…)\n  [ON COMMIT {PRESERVE | DELETE} ROWS];',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag DECIMAL(10,2));
INSERT INTO bestellungen (id, kunde_id, betrag)
VALUES (1, 1, 100), (2, 1, 50), (3, 2, 80), (4, 3, 20);

CREATE LOCAL TEMPORARY TABLE umsatz_tmp (
  kunde_id INTEGER,
  summe    DECIMAL(10,2)
) ON COMMIT PRESERVE ROWS;

INSERT INTO umsatz_tmp
SELECT kunde_id, SUM(betrag) FROM bestellungen GROUP BY kunde_id;

SELECT kunde_id, summe FROM umsatz_tmp WHERE summe > 50 ORDER BY summe DESC;
-- kunde_id | summe
-- 1        | 150.00
-- 2        | 80.00
`)
      },
      pg: {
        syntax: 'CREATE TEMP TABLE name (…) [ON COMMIT {PRESERVE ROWS | DELETE ROWS | DROP}];\nCREATE TEMP TABLE name AS SELECT …;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC(10,2));
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 1, 50), (3, 2, 80), (4, 3, 20);

CREATE TEMP TABLE umsatz_tmp AS
SELECT kunde_id, SUM(betrag) AS summe FROM bestellungen GROUP BY kunde_id;

SELECT kunde_id, summe FROM umsatz_tmp WHERE summe > 50 ORDER BY summe DESC;
-- kunde_id | summe
-- 1        | 150.00
-- 2        | 80.00
`),
        note: '`TEMP` ist die Kurzform von `TEMPORARY`; `GLOBAL`/`LOCAL` werden ignoriert. Temporäre Tabellen liegen in einem eigenen Schema `pg_temp_…`.',
        mdn: PG + 'sql-createtable.html'
      },
      mysql: {
        syntax: 'CREATE TEMPORARY TABLE name (…);\nCREATE TEMPORARY TABLE name AS SELECT …;',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 1, 50), (3, 2, 80), (4, 3, 20);

CREATE TEMPORARY TABLE umsatz_tmp AS
SELECT kunde_id, SUM(betrag) AS summe FROM bestellungen GROUP BY kunde_id;

SELECT kunde_id, summe FROM umsatz_tmp WHERE summe > 50 ORDER BY summe DESC;
-- kunde_id | summe
-- 1        | 150.00
-- 2        | 80.00
`),
        note: 'Eine temporäre Tabelle darf in einer Abfrage nur einmal vorkommen (kein Self-Join). Löschen mit `DROP TEMPORARY TABLE`.',
        mdn: MY + 'create-temporary-table.html'
      },
      mssql: {
        syntax: 'CREATE TABLE #name (…);       -- lokal\nCREATE TABLE ##name (…);      -- global\nSELECT … INTO #name FROM …;',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 1, 50), (3, 2, 80), (4, 3, 20);

SELECT kunde_id, SUM(betrag) AS summe
INTO #umsatz_tmp
FROM bestellungen
GROUP BY kunde_id;

SELECT kunde_id, summe FROM #umsatz_tmp WHERE summe > 50 ORDER BY summe DESC;
-- kunde_id | summe
-- 1        | 150.00
-- 2        | 80.00
`),
        note: 'Temporäre Tabellen erkennt man am `#` (lokal) bzw. `##` (global, für alle Sitzungen sichtbar). Sie liegen in `tempdb`.',
        mdn: MS + 'statements/create-table-transact-sql'
      },
      sqlite: {
        syntax: 'CREATE TEMP TABLE name (…);\nCREATE TEMP TABLE name AS SELECT …;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC);
INSERT INTO bestellungen (kunde_id, betrag) VALUES (1, 100), (1, 50), (2, 80), (3, 20);

CREATE TEMP TABLE umsatz_tmp AS
SELECT kunde_id, SUM(betrag) AS summe FROM bestellungen GROUP BY kunde_id;

SELECT kunde_id, summe FROM umsatz_tmp WHERE summe > 50 ORDER BY summe DESC;
-- kunde_id | summe
-- 1        | 150
-- 2        | 80
`),
        note: 'Temporäre Tabellen liegen in der Datenbank `temp` (ansprechbar als `temp.umsatz_tmp`). Kein `ON COMMIT`.',
        mdn: SL + 'lang_createtable.html'
      }
    },
    tip: 'Oft ist eine CTE (`WITH`) die einfachere Alternative; temporäre Tabellen lohnen sich, wenn das Zwischenergebnis mehrfach gebraucht oder indiziert werden soll.',
    keywords: ['temp table', 'temporär', 'zwischentabelle', 'session', '#tabelle', 'temporary', 'tempdb'],
    related: ['CREATE TABLE AS', 'WITH (CTE)', 'CREATE TABLE'],
    mdn: PG + 'sql-createtable.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'DEFAULT',
    desc: 'Standardwert einer Spalte, wenn beim Einfügen kein Wert angegeben wird.',
    details: 'Der Default greift nur, wenn die Spalte im `INSERT` fehlt oder ausdrücklich `DEFAULT` angegeben ist; ein explizites `NULL` überschreibt ihn. Erlaubt sind Konstanten und je nach System Ausdrücke wie `CURRENT_DATE` oder Funktionsaufrufe.',
    values: [
      ["DEFAULT 'neu'", 'Konstanter Wert'],
      ['DEFAULT CURRENT_DATE', 'Datum des Einfügens'],
      ['DEFAULT CURRENT_TIMESTAMP', 'Zeitpunkt des Einfügens']
    ],
    dialects: {
      std: {
        syntax: 'spalte typ DEFAULT wert',
        example: e(`
CREATE TABLE bestellungen (
  id     INTEGER       PRIMARY KEY,
  betrag DECIMAL(10,2) NOT NULL,
  status VARCHAR(20)   DEFAULT 'neu' NOT NULL,
  datum  DATE          DEFAULT CURRENT_DATE
);

INSERT INTO bestellungen (id, betrag) VALUES (1, 99.50);
INSERT INTO bestellungen (id, betrag, status, datum) VALUES (2, 20, 'bezahlt', NULL);

SELECT id, betrag, status FROM bestellungen ORDER BY id;
-- id | betrag | status
-- 1  | 99.50  | neu
-- 2  | 20.00  | bezahlt

SELECT id, datum FROM bestellungen ORDER BY id;
-- 1 = heutiges Datum (z. B. 2026-11-16), 2 = NULL: explizites NULL schlägt den Default
`)
      },
      pg: { note: 'Beliebige Ausdrücke erlaubt, z. B. `DEFAULT now()` oder `DEFAULT gen_random_uuid()`. Ändern mit `ALTER TABLE t ALTER COLUMN c SET DEFAULT …`.', mdn: PG + 'ddl-default.html' },
      mysql: {
        syntax: 'spalte typ DEFAULT wert\nspalte typ DEFAULT (ausdruck)',
        example: e(`
CREATE TABLE bestellungen (
  id        INT           PRIMARY KEY,
  betrag    DECIMAL(10,2) NOT NULL,
  status    VARCHAR(20)   NOT NULL DEFAULT 'neu',
  datum     DATE          DEFAULT (CURRENT_DATE),
  geaendert TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO bestellungen (id, betrag) VALUES (1, 99.50);
INSERT INTO bestellungen (id, betrag, status, datum) VALUES (2, 20, 'bezahlt', NULL);

SELECT id, betrag, status FROM bestellungen ORDER BY id;
-- id | betrag | status
-- 1  | 99.50  | neu
-- 2  | 20.00  | bezahlt
`),
        note: 'Ausdrücke (auch `CURRENT_DATE`) müssen in Klammern stehen; nur `CURRENT_TIMESTAMP` geht ohne. `ON UPDATE CURRENT_TIMESTAMP` aktualisiert die Spalte bei jeder Änderung.',
        mdn: MY + 'data-type-defaults.html'
      },
      mssql: {
        syntax: 'spalte typ [CONSTRAINT name] DEFAULT wert',
        example: e(`
CREATE TABLE bestellungen (
  id     INT           PRIMARY KEY,
  betrag DECIMAL(10,2) NOT NULL,
  status NVARCHAR(20)  NOT NULL DEFAULT 'neu',
  datum  DATE          DEFAULT CAST(GETDATE() AS DATE)
);

INSERT INTO bestellungen (id, betrag) VALUES (1, 99.50);
INSERT INTO bestellungen (id, betrag, status, datum) VALUES (2, 20, 'bezahlt', NULL);

SELECT id, betrag, status FROM bestellungen ORDER BY id;
-- id | betrag | status
-- 1  | 99.50  | neu
-- 2  | 20.00  | bezahlt
`),
        note: 'Ein Default ist ein eigener Constraint; ohne Namen vergibt SQL Server einen generierten (`DF__bestellu__…`). Häufig: `DEFAULT GETDATE()`, `DEFAULT NEWID()`.',
        mdn: MS + 'statements/create-table-transact-sql'
      },
      sqlite: { note: 'Ausdrücke müssen in Klammern stehen, z. B. `DEFAULT (date(\'now\'))`; Konstanten und `CURRENT_DATE` gehen ohne. `DEFAULT` als Wert in `VALUES` gibt es nicht – die Spalte einfach weglassen.', mdn: SL + 'lang_createtable.html' }
    },
    tip: 'Ein Default ersetzt kein `NOT NULL`: Wer `NULL` verhindern will, braucht beides.',
    keywords: ['standardwert', 'default value', 'vorgabewert', 'voreinstellung', 'current_timestamp', 'getdate', 'on update'],
    related: ['CREATE TABLE', 'NOT NULL', 'INSERT mit DEFAULT'],
    mdn: PG + 'ddl-default.html'
  },
  {
    lang: 'sql', group: 'Tabellen', name: 'Generierte Spalten',
    desc: 'Spalten, deren Wert automatisch aus anderen Spalten derselben Zeile berechnet wird.',
    details: 'Eine generierte Spalte kann nicht direkt beschrieben werden, die Datenbank berechnet sie selbst. Gespeicherte Varianten (`STORED`) kosten Platz, sind aber schnell und indizierbar; virtuelle werden beim Lesen berechnet. Der Ausdruck darf nur Spalten derselben Zeile und deterministische Funktionen verwenden.',
    values: [
      ['STORED', 'Wert wird gespeichert; schneller beim Lesen, indizierbar'],
      ['VIRTUAL', 'Wert wird beim Lesen berechnet, kostet keinen Platz']
    ],
    dialects: {
      std: {
        syntax: 'spalte typ GENERATED ALWAYS AS (ausdruck)',
        example: e(`
CREATE TABLE produkte (
  id     INTEGER       PRIMARY KEY,
  name   VARCHAR(50),
  netto  DECIMAL(10,2),
  brutto DECIMAL(10,2) GENERATED ALWAYS AS (ROUND(netto * 1.19, 2))
);

INSERT INTO produkte (id, name, netto) VALUES (1, 'Maus', 20), (2, 'Tastatur', 50);

SELECT name, netto, brutto FROM produkte ORDER BY id;
-- name     | netto | brutto
-- Maus     | 20.00 | 23.80
-- Tastatur | 50.00 | 59.50
`)
      },
      pg: { note: 'Ohne Zusatz seit PostgreSQL 18 `VIRTUAL`; bis Version 17 gab es nur `STORED` (Pflichtangabe). Für einen Index `STORED` angeben.', mdn: PG + 'ddl-generated-columns.html' },
      mysql: { note: 'Ohne Zusatz `VIRTUAL`; mit `STORED` gespeichert. Auch virtuelle Spalten lassen sich in InnoDB indizieren.', mdn: MY + 'create-table-generated-columns.html' },
      mssql: {
        syntax: 'spalte AS (ausdruck) [PERSISTED]',
        example: e(`
CREATE TABLE produkte (
  id     INT           PRIMARY KEY,
  name   NVARCHAR(50),
  netto  DECIMAL(10,2),
  brutto AS ROUND(netto * 1.19, 2) PERSISTED
);

INSERT INTO produkte (id, name, netto) VALUES (1, 'Maus', 20), (2, 'Tastatur', 50);

SELECT name, netto, brutto FROM produkte ORDER BY id;
-- name     | netto | brutto
-- Maus     | 20.00 | 23.80
-- Tastatur | 50.00 | 59.50
`),
        note: 'Heißen „computed columns“; ohne Typangabe, der Typ ergibt sich aus dem Ausdruck. `PERSISTED` entspricht `STORED`.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/tables/specify-computed-columns-in-a-table'
      },
      sqlite: { note: 'Ohne Zusatz `VIRTUAL`. Per `ALTER TABLE … ADD COLUMN` lassen sich nur virtuelle Spalten hinzufügen.', mdn: SL + 'gencol.html' }
    },
    tip: 'Generierte Spalten sind ideal, um einen Ausdruck zu indizieren, den viele Abfragen im `WHERE` benutzen.',
    keywords: ['computed column', 'berechnete spalte', 'generated column', 'stored', 'virtual', 'abgeleitete spalte', 'persisted'],
    related: ['Berechnete Spalten', 'Ausdrucksindex', 'CREATE TABLE'],
    mdn: PG + 'ddl-generated-columns.html'
  },

  // ---------------- Schlüssel & Constraints ----------------
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'PRIMARY KEY',
    desc: 'Identifiziert jede Zeile eindeutig; implizit UNIQUE und NOT NULL.',
    details: 'Jede Tabelle sollte genau einen Primärschlüssel haben. Die Datenbank legt dafür automatisch einen eindeutigen Index an, Fremdschlüssel verweisen in der Regel darauf. Ein doppelter oder fehlender Schlüsselwert wird mit einem Fehler abgelehnt.',
    dialects: {
      std: {
        syntax: 'spalte typ PRIMARY KEY\nPRIMARY KEY (spalte [, …])',
        example: e(`
CREATE TABLE abteilungen (
  id   INTEGER     PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

INSERT INTO abteilungen (id, name) VALUES (1, 'IT'), (2, 'Vertrieb'), (3, 'Einkauf');
-- INSERT INTO abteilungen (id, name) VALUES (1, 'HR');
--   → Fehler: doppelter Schlüsselwert (1)

SELECT id, name FROM abteilungen ORDER BY id;
-- id | name
-- 1  | IT
-- 2  | Vertrieb
-- 3  | Einkauf
`)
      },
      pg: { note: 'Fehlermeldung: `duplicate key value violates unique constraint "abteilungen_pkey"`. Der Index heißt standardmäßig `<tabelle>_pkey`.' },
      mysql: { note: 'InnoDB speichert die Zeilen physisch nach dem Primärschlüssel sortiert (Clustered Index); ein kurzer, fortlaufender Schlüssel ist daher günstig.', mdn: MY + 'create-table.html' },
      mssql: { note: 'Der Primärschlüssel wird standardmäßig als Clustered Index angelegt; mit `PRIMARY KEY NONCLUSTERED` lässt sich das ändern.', mdn: MS + 'statements/create-table-transact-sql' },
      sqlite: {
        example: e(`
CREATE TABLE abteilungen (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO abteilungen (id, name) VALUES (1, 'IT'), (2, 'Vertrieb');
INSERT INTO abteilungen (name) VALUES ('Einkauf');      -- id wird automatisch 3
-- INSERT INTO abteilungen (id, name) VALUES (1, 'HR');
--   Fehler: UNIQUE constraint failed: abteilungen.id

SELECT id, name FROM abteilungen ORDER BY id;
-- id | name
-- 1  | IT
-- 2  | Vertrieb
-- 3  | Einkauf
`),
        note: '`INTEGER PRIMARY KEY` ist ein Alias für die interne `rowid` und wird automatisch vergeben. Fallstrick: Bei anderen Primärschlüsseln erlaubt SQLite `NULL` (außer in `STRICT`-Tabellen) – dort zusätzlich `NOT NULL` schreiben.',
        mdn: SL + 'lang_createtable.html'
      }
    },
    tip: 'Primärschlüssel nie ändern: Wenn sich ein Wert ändern kann, ist er kein guter Schlüssel – dann lieber einen Surrogatschlüssel nehmen.',
    keywords: ['primärschlüssel', 'primary key', 'pk', 'eindeutig', 'schlüssel', 'id', 'rowid', 'clustered'],
    related: ['Zusammengesetzter Primärschlüssel', 'Auto-Increment', 'FOREIGN KEY', 'Natürlicher vs. Surrogatschlüssel'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'Zusammengesetzter Primärschlüssel',
    desc: 'Primärschlüssel aus mehreren Spalten, deren Kombination eindeutig sein muss.',
    details: 'Typisch für Verknüpfungstabellen von n:m-Beziehungen: Einzeln dürfen sich die Werte wiederholen, nur die Kombination nicht. Er wird als Tabellen-Constraint nach den Spalten definiert. Die Reihenfolge der Spalten bestimmt den zugehörigen Index: Abfragen nach der ersten Spalte profitieren, nach der zweiten allein nicht.',
    dialects: {
      std: {
        syntax: 'PRIMARY KEY (spalte1, spalte2 [, …])',
        example: e(`
CREATE TABLE projekt_mitarbeit (
  projekt_id     INTEGER NOT NULL,
  mitarbeiter_id INTEGER NOT NULL,
  rolle          VARCHAR(30),
  PRIMARY KEY (projekt_id, mitarbeiter_id)
);

INSERT INTO projekt_mitarbeit VALUES
  (1, 1, 'Leitung'), (1, 2, 'Entwicklung'), (2, 1, 'Beratung');
-- INSERT INTO projekt_mitarbeit VALUES (1, 1, 'Test');
--   → Fehler: doppelter Schlüssel (1, 1)

SELECT projekt_id, mitarbeiter_id, rolle
FROM projekt_mitarbeit
ORDER BY projekt_id, mitarbeiter_id;
-- projekt_id | mitarbeiter_id | rolle
-- 1          | 1              | Leitung
-- 1          | 2              | Entwicklung
-- 2          | 1              | Beratung
`)
      }
    },
    tip: 'Wird oft auch nach der zweiten Spalte gesucht, zusätzlich einen Index auf diese Spalte anlegen.',
    keywords: ['composite key', 'zusammengesetzt', 'mehrspaltig', 'verbundschlüssel', 'compound primary key'],
    related: ['PRIMARY KEY', 'n:m-Beziehung', 'Zusammengesetzter Index'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'Auto-Increment',
    desc: 'Automatisch hochgezählte ID für neue Zeilen; je Dialekt anders geschrieben.',
    details: 'Statt die ID selbst zu vergeben, lässt man die Datenbank fortlaufende Nummern erzeugen. Lücken in der Nummerierung sind normal (Rollbacks, Löschungen) und kein Fehler; IDs gelöschter Zeilen werden in der Regel nicht wiederverwendet. Die neu vergebene ID fragt man direkt nach dem Einfügen ab, nie per `MAX(id)`.',
    dialects: {
      std: {
        syntax: 'id INTEGER GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY PRIMARY KEY',
        example: e(`
CREATE TABLE kunden (
  id   INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

INSERT INTO kunden (name) VALUES ('Müller'), ('Schmidt'), ('Weber');
DELETE FROM kunden WHERE id = 3;
INSERT INTO kunden (name) VALUES ('Fischer');   -- bekommt 4, nicht wieder 3

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
-- 4  | Fischer
`)
      },
      pg: {
        syntax: 'id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY\nid SERIAL PRIMARY KEY   -- veraltet',
        example: e(`
CREATE TABLE kunden (
  id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO kunden (name) VALUES ('Müller'), ('Schmidt'), ('Weber');
DELETE FROM kunden WHERE id = 3;

-- Die neue ID direkt zurückgeben lassen
INSERT INTO kunden (name) VALUES ('Fischer') RETURNING id;
-- id
-- 4
`),
        note: 'Ältere Schemas nutzen `SERIAL`/`BIGSERIAL` (Spalte mit Default aus einer Sequenz). `RETURNING id` liefert die vergebene ID.',
        mdn: PG + 'ddl-identity-columns.html'
      },
      mysql: {
        syntax: 'id INT AUTO_INCREMENT PRIMARY KEY',
        example: e(`
CREATE TABLE kunden (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

INSERT INTO kunden (name) VALUES ('Müller'), ('Schmidt'), ('Weber');
DELETE FROM kunden WHERE id = 3;
INSERT INTO kunden (name) VALUES ('Fischer');   -- bekommt 4, nicht wieder 3

SELECT LAST_INSERT_ID() AS neue_id;
-- neue_id
-- 4

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
-- 4  | Fischer
`),
        note: '`LAST_INSERT_ID()` gilt pro Verbindung. Den Startwert setzt `ALTER TABLE kunden AUTO_INCREMENT = 1000`.',
        mdn: MY + 'example-auto-increment.html'
      },
      mssql: {
        syntax: 'id INT IDENTITY(start, schritt) PRIMARY KEY',
        example: e(`
CREATE TABLE kunden (
  id   INT IDENTITY(1, 1) PRIMARY KEY,
  name NVARCHAR(50) NOT NULL
);

INSERT INTO kunden (name) VALUES ('Müller'), ('Schmidt'), ('Weber');
DELETE FROM kunden WHERE id = 3;
INSERT INTO kunden (name) VALUES ('Fischer');   -- bekommt 4, nicht wieder 3

SELECT SCOPE_IDENTITY() AS neue_id;
-- neue_id
-- 4

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
-- 4  | Fischer
`),
        note: '`SCOPE_IDENTITY()` liefert die letzte ID im aktuellen Gültigkeitsbereich; alternativ `OUTPUT inserted.id` im `INSERT`.',
        mdn: MS + 'statements/create-table-transact-sql-identity-property'
      },
      sqlite: {
        syntax: 'id INTEGER PRIMARY KEY [AUTOINCREMENT]',
        example: e(`
CREATE TABLE kunden (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

INSERT INTO kunden (name) VALUES ('Müller'), ('Schmidt'), ('Weber');
DELETE FROM kunden WHERE id = 3;
INSERT INTO kunden (name) VALUES ('Fischer');   -- bekommt 4, nicht wieder 3

SELECT last_insert_rowid() AS neue_id;
-- neue_id
-- 4

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
-- 4  | Fischer
`),
        note: 'Schon `INTEGER PRIMARY KEY` zählt automatisch hoch, kann aber die ID der zuletzt gelöschten höchsten Zeile wiederverwenden. `AUTOINCREMENT` verhindert das (Zähler in `sqlite_sequence`).',
        mdn: SL + 'autoinc.html'
      }
    },
    tip: 'Die neue ID nie per `SELECT MAX(id)` ermitteln (Race Condition), sondern mit der Funktion des Dialekts oder des Treibers.',
    keywords: ['autoincrement', 'auto_increment', 'serial', 'fortlaufende nummer', 'id automatisch', 'rowid', 'identity', 'last_insert_id', 'scope_identity'],
    related: ['IDENTITY', 'PRIMARY KEY', 'Sequenzen', 'RETURNING'],
    mdn: PG + 'ddl-identity-columns.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'IDENTITY',
    desc: 'Standard-SQL-Identitätsspalte: die Datenbank erzeugt die Werte aus einer Sequenz.',
    details: 'Bei `GENERATED ALWAYS AS IDENTITY` lehnt die Datenbank eigene Werte ab, außer mit `OVERRIDING SYSTEM VALUE`; bei `BY DEFAULT` darf man Werte selbst angeben. Nach Importen mit eigenen IDs muss der Zähler hinter den höchsten Wert gesetzt werden, sonst kommt es zu Schlüsselkonflikten.',
    values: [
      ['ALWAYS', 'Nur die Datenbank vergibt Werte'],
      ['BY DEFAULT', 'Eigene Werte erlaubt (z. B. für Datenimporte)'],
      ['OVERRIDING SYSTEM VALUE', 'Bei ALWAYS trotzdem eigenen Wert einfügen'],
      ['RESTART WITH n', 'Zähler neu setzen']
    ],
    dialects: {
      std: {
        syntax: 'spalte typ GENERATED { ALWAYS | BY DEFAULT } AS IDENTITY [(START WITH n INCREMENT BY m)]',
        example: e(`
CREATE TABLE kunden (
  id   INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

INSERT INTO kunden (name) VALUES ('Müller'), ('Schmidt');

-- INSERT INTO kunden (id, name) VALUES (10, 'Import');  → Fehler bei ALWAYS
INSERT INTO kunden (id, name) OVERRIDING SYSTEM VALUE VALUES (10, 'Import');

-- Zähler nach dem Import nachziehen
ALTER TABLE kunden ALTER COLUMN id RESTART WITH 11;
INSERT INTO kunden (name) VALUES ('Weber');

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
-- 10 | Import
-- 11 | Weber
`)
      },
      pg: { note: 'Seit Version 10; ersetzt `SERIAL`, dessen Sequenz nicht sauber zur Spalte gehörte. Fehlermeldung bei `ALWAYS`: `cannot insert a non-DEFAULT value into column "id"`.', mdn: PG + 'ddl-identity-columns.html' },
      mysql: {
        syntax: 'id INT AUTO_INCREMENT PRIMARY KEY',
        example: e(`
CREATE TABLE kunden (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

INSERT INTO kunden (name) VALUES ('Müller'), ('Schmidt');
INSERT INTO kunden (id, name) VALUES (10, 'Import');   -- eigene Werte immer erlaubt
INSERT INTO kunden (name) VALUES ('Weber');            -- Zähler zieht automatisch nach

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
-- 10 | Import
-- 11 | Weber
`),
        note: 'Keine `IDENTITY`-Syntax; `AUTO_INCREMENT` verhält sich wie `BY DEFAULT`. Ein größerer eigener Wert setzt den Zähler automatisch hoch, manuell mit `ALTER TABLE t AUTO_INCREMENT = n`.',
        mdn: MY + 'example-auto-increment.html'
      },
      mssql: {
        syntax: 'spalte INT IDENTITY(start, schritt)\nSET IDENTITY_INSERT tabelle { ON | OFF };',
        example: e(`
CREATE TABLE kunden (
  id   INT IDENTITY(1, 1) PRIMARY KEY,
  name NVARCHAR(50) NOT NULL
);

INSERT INTO kunden (name) VALUES ('Müller'), ('Schmidt');

-- Eigene Werte nur mit IDENTITY_INSERT
SET IDENTITY_INSERT kunden ON;
INSERT INTO kunden (id, name) VALUES (10, 'Import');
SET IDENTITY_INSERT kunden OFF;

INSERT INTO kunden (name) VALUES ('Weber');   -- Zähler zieht automatisch nach

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
-- 10 | Import
-- 11 | Weber
`),
        note: 'Verhält sich wie `ALWAYS`. Den Zähler setzt man mit `DBCC CHECKIDENT (\'kunden\', RESEED, n)`. SQL Server 2022 kennt keine `GENERATED … AS IDENTITY`-Syntax.',
        mdn: MS + 'statements/create-table-transact-sql-identity-property'
      },
      sqlite: {
        syntax: 'id INTEGER PRIMARY KEY',
        example: e(`
CREATE TABLE kunden (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO kunden (name) VALUES ('Müller'), ('Schmidt');
INSERT INTO kunden (id, name) VALUES (10, 'Import');   -- eigene Werte immer erlaubt
INSERT INTO kunden (name) VALUES ('Weber');            -- höchste ID + 1

SELECT id, name FROM kunden ORDER BY id;
-- id | name
-- 1  | Müller
-- 2  | Schmidt
-- 10 | Import
-- 11 | Weber
`),
        note: 'Keine `IDENTITY`-Syntax; `INTEGER PRIMARY KEY` vergibt automatisch die höchste vorhandene ID + 1.',
        mdn: SL + 'autoinc.html'
      }
    },
    tip: 'Nach Importen mit eigenen IDs den Zähler hochsetzen, sonst kommt es später zu Schlüsselkonflikten.',
    keywords: ['identity column', 'generated always', 'serial', 'identitätsspalte', 'identity_insert', 'overriding system value', 'reseed'],
    related: ['Auto-Increment', 'Sequenzen', 'PRIMARY KEY'],
    mdn: PG + 'ddl-identity-columns.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'FOREIGN KEY',
    desc: 'Stellt sicher, dass ein Wert in einer anderen Tabelle als Schlüssel existiert.',
    details: 'Ein Fremdschlüssel verweist auf den Primärschlüssel (oder eine `UNIQUE`-Spalte) einer Elterntabelle und verhindert verwaiste Datensätze (referentielle Integrität). `NULL` im Fremdschlüssel ist erlaubt und bedeutet „keine Beziehung“. Die Elterntabelle muss vor der Kindtabelle existieren und befüllt werden.',
    dialects: {
      std: {
        syntax: 'spalte typ REFERENCES eltern (spalte)\nFOREIGN KEY (spalte) REFERENCES eltern (spalte) [ON DELETE …] [ON UPDATE …]',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);
CREATE TABLE bestellungen (
  id       INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL,
  betrag   DECIMAL(10,2),
  FOREIGN KEY (kunde_id) REFERENCES kunden (id)
);

INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Schmidt');
INSERT INTO bestellungen VALUES (10, 1, 99.50), (11, 1, 20), (12, 2, 45);
-- INSERT INTO bestellungen VALUES (13, 99, 10);
--   → Fehler: Kunde 99 existiert nicht (Fremdschlüssel verletzt)

SELECT b.id, k.name, b.betrag
FROM bestellungen b JOIN kunden k ON k.id = b.kunde_id
ORDER BY b.id;
-- id | name    | betrag
-- 10 | Müller  | 99.50
-- 11 | Müller  | 20.00
-- 12 | Schmidt | 45.00
`)
      },
      pg: { note: 'Fremdschlüsselspalten bekommen keinen automatischen Index – für Joins und `ON DELETE` selbst einen anlegen.' },
      mysql: { note: 'Nur die Kurzform `REFERENCES` direkt hinter der Spalte wird bis MySQL 8.4 stillschweigend ignoriert – immer `FOREIGN KEY (…) REFERENCES …` schreiben. Geprüft wird nur mit InnoDB, das auch automatisch einen Index anlegt.', mdn: MY + 'create-table-foreign-keys.html' },
      mssql: { note: 'Kein automatischer Index auf der Fremdschlüsselspalte. Mit `ALTER TABLE … NOCHECK CONSTRAINT name` lässt sich die Prüfung vorübergehend abschalten.', mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/tables/create-foreign-key-relationships' },
      sqlite: { note: 'Fremdschlüssel werden nur geprüft, wenn pro Verbindung `PRAGMA foreign_keys = ON` gesetzt ist – standardmäßig sind sie aus!', mdn: SL + 'foreignkeys.html' }
    },
    tip: 'Fremdschlüsselspalten (außer in MySQL) selbst indizieren, sonst werden Joins und Löschungen in der Elterntabelle langsam.',
    keywords: ['fremdschlüssel', 'foreign key', 'fk', 'references', 'referentielle integrität', 'beziehung', 'verweis'],
    related: ['ON DELETE / ON UPDATE', 'PRIMARY KEY', '1:n-Beziehung', 'PRAGMA (SQLite)'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'ON DELETE / ON UPDATE',
    desc: 'Legt fest, was mit abhängigen Zeilen passiert, wenn der Elterndatensatz sich ändert.',
    details: 'Ohne Angabe gilt `NO ACTION`: Löschen oder Ändern eines noch referenzierten Elternteils schlägt fehl. `CASCADE` löscht bzw. ändert die Kindzeilen mit, `SET NULL` setzt den Fremdschlüssel auf `NULL`. `ON DELETE CASCADE` ist bequem, kann aber unbemerkt große Datenmengen löschen.',
    values: [
      ['NO ACTION', 'Standard: Fehler, wenn noch Kindzeilen existieren (Prüfung am Anweisungsende)'],
      ['RESTRICT', 'Wie NO ACTION, aber sofort geprüft'],
      ['CASCADE', 'Kindzeilen mitlöschen bzw. Schlüssel mitändern'],
      ['SET NULL', 'Fremdschlüssel in den Kindzeilen auf NULL setzen'],
      ['SET DEFAULT', 'Fremdschlüssel auf den DEFAULT-Wert setzen']
    ],
    dialects: {
      std: {
        syntax: 'FOREIGN KEY (spalte) REFERENCES eltern (id)\n  ON DELETE aktion ON UPDATE aktion',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (
  id       INTEGER PRIMARY KEY,
  kunde_id INTEGER,
  betrag   DECIMAL(10,2),
  FOREIGN KEY (kunde_id) REFERENCES kunden (id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Schmidt');
INSERT INTO bestellungen VALUES (10, 1, 99.50), (11, 2, 20), (12, 2, 45);

DELETE FROM kunden WHERE id = 2;           -- löscht Bestellungen 11 und 12 mit
UPDATE kunden SET id = 7 WHERE id = 1;     -- ändert kunde_id in Bestellung 10

SELECT id, kunde_id, betrag FROM bestellungen ORDER BY id;
-- id | kunde_id | betrag
-- 10 | 7        | 99.50
`)
      },
      mysql: { note: '`RESTRICT` und `NO ACTION` sind identisch (sofortige Prüfung). `SET DEFAULT` lehnt InnoDB ab. Kaskaden lösen keine Trigger aus.', mdn: MY + 'create-table-foreign-keys.html' },
      mssql: { note: 'Kein `RESTRICT` (nur `NO ACTION`). Kaskaden, die auf mehreren Wegen dieselbe Tabelle erreichen könnten, lehnt SQL Server ab („multiple cascade paths“).', mdn: MS + 'statements/create-table-transact-sql' },
      sqlite: { note: 'Wirkt nur mit `PRAGMA foreign_keys = ON`.', mdn: SL + 'foreignkeys.html' }
    },
    tip: 'Für Stammdaten (Kunden, Produkte) lieber `RESTRICT` oder Soft Delete verwenden, `CASCADE` eher für echte Teile eines Ganzen (Bestellpositionen).',
    keywords: ['cascade', 'kaskadierend', 'set null', 'restrict', 'no action', 'löschweitergabe', 'referentielle aktion'],
    related: ['FOREIGN KEY', 'Soft Delete', 'DELETE'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'NOT NULL',
    desc: 'Verbietet NULL-Werte in einer Spalte.',
    details: 'Spalten ohne `NOT NULL` dürfen `NULL` enthalten, das ist der Standard. Pflichtfelder sollten immer `NOT NULL` sein, das spart später viele `NULL`-Sonderfälle in Abfragen. Ein leerer String `\'\'` ist kein `NULL` und wird akzeptiert (Ausnahme: Oracle behandelt `\'\'` als `NULL`).',
    dialects: {
      std: {
        syntax: 'spalte typ [DEFAULT wert] NOT NULL',
        example: e(`
CREATE TABLE produkte (
  id        INTEGER       PRIMARY KEY,
  name      VARCHAR(50)   NOT NULL,
  preis     DECIMAL(10,2) DEFAULT 0 NOT NULL,
  kategorie VARCHAR(30)
);

INSERT INTO produkte (id, name) VALUES (1, 'Kabel');
INSERT INTO produkte (id, name, preis, kategorie) VALUES (2, 'Maus', 19.90, 'Zubehör');
-- INSERT INTO produkte (id, preis) VALUES (3, 5);
--   → Fehler: Spalte name darf nicht NULL sein

SELECT name, preis, kategorie FROM produkte ORDER BY id;
-- name  | preis | kategorie
-- Kabel | 0.00  | NULL
-- Maus  | 19.90 | Zubehör
`)
      },
      pg: { note: 'Nachträglich: `ALTER TABLE t ALTER COLUMN c SET NOT NULL` (bzw. `DROP NOT NULL`); prüft alle vorhandenen Zeilen.' },
      mysql: { note: 'Nachträglich nur über `MODIFY spalte typ NOT NULL` (komplette Definition). Ohne Strict Mode wird ein fehlender Wert still durch einen Leerwert (`\'\'`, `0`) ersetzt.', mdn: MY + 'alter-table.html' },
      mssql: { note: 'Nachträglich: `ALTER TABLE t ALTER COLUMN c typ NOT NULL` (Typ muss mit angegeben werden).', mdn: MS + 'statements/alter-table-transact-sql' },
      sqlite: { note: 'Nachträglich nicht änderbar – nur per Neuaufbau der Tabelle.', mdn: SL + 'lang_createtable.html' }
    },
    tip: 'Zusätzlich `CHECK (name <> \'\')` verhindert auch leere Strings.',
    keywords: ['pflichtfeld', 'not null', 'nicht leer', 'required', 'null verbieten'],
    related: ['NULL', 'DEFAULT', 'CHECK'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'UNIQUE',
    desc: 'Erzwingt, dass ein Wert (oder eine Kombination) in der Tabelle nur einmal vorkommt.',
    details: 'Anders als der Primärschlüssel darf eine Tabelle mehrere `UNIQUE`-Constraints haben, und die Spalten dürfen `NULL` enthalten. Nach Standard gelten mehrere `NULL` nicht als Duplikat. Intern legt die Datenbank einen eindeutigen Index an.',
    dialects: {
      std: {
        syntax: 'spalte typ UNIQUE\nUNIQUE (spalte1, spalte2)',
        example: e(`
CREATE TABLE kunden (
  id    INTEGER      PRIMARY KEY,
  name  VARCHAR(50)  NOT NULL,
  email VARCHAR(100) UNIQUE
);

INSERT INTO kunden (id, name, email) VALUES
  (1, 'Müller', 'm@example.com'), (2, 'Schmidt', NULL), (3, 'Weber', NULL);  -- zwei NULL sind ok
-- INSERT INTO kunden (id, name, email) VALUES (4, 'Fake', 'm@example.com');
--   → Fehler: doppelter Wert in email

SELECT name, email FROM kunden ORDER BY id;
-- name    | email
-- Müller  | m@example.com
-- Schmidt | NULL
-- Weber   | NULL
`)
      },
      pg: { note: 'Seit Version 15 macht `UNIQUE NULLS NOT DISTINCT` auch `NULL` eindeutig (nur ein `NULL` erlaubt).' },
      mysql: { note: 'Achtung: Die Standard-Kollation vergleicht ohne Groß-/Kleinschreibung – `M@example.com` gilt als Duplikat von `m@example.com`.', mdn: MY + 'create-table.html' },
      mssql: {
        example: e(`
CREATE TABLE kunden (
  id    INT           PRIMARY KEY,
  name  NVARCHAR(50)  NOT NULL,
  email NVARCHAR(100) NULL
);

-- UNIQUE erlaubt hier nur EIN NULL; für mehrere NULL ein gefilterter Index:
CREATE UNIQUE INDEX ux_kunden_email ON kunden (email) WHERE email IS NOT NULL;

INSERT INTO kunden (id, name, email) VALUES
  (1, 'Müller', 'm@example.com'), (2, 'Schmidt', NULL), (3, 'Weber', NULL);

SELECT name, email FROM kunden ORDER BY id;
-- name    | email
-- Müller  | m@example.com
-- Schmidt | NULL
-- Weber   | NULL
`),
        note: 'Abweichend vom Standard behandelt ein `UNIQUE`-Constraint `NULL` wie einen Wert: nur ein `NULL` pro Spalte. Abhilfe ist ein gefilterter eindeutiger Index.',
        mdn: MS + 'statements/create-index-transact-sql'
      },
      sqlite: { note: 'Fehlermeldung: `UNIQUE constraint failed: kunden.email`. Mehrere `NULL` sind erlaubt.', mdn: SL + 'lang_createtable.html' }
    },
    tip: 'E-Mail-Adressen sollten meist ohne Rücksicht auf Groß-/Kleinschreibung eindeutig sein: dafür einen eindeutigen Index auf `LOWER(email)` anlegen.',
    keywords: ['eindeutig', 'unique', 'keine duplikate', 'doppelt verhindern', 'unique constraint', 'nulls not distinct'],
    related: ['UNIQUE INDEX', 'PRIMARY KEY', 'ON CONFLICT (Upsert)'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'CHECK',
    desc: 'Prüft bei jedem Einfügen und Ändern eine Bedingung für die Zeile.',
    details: 'Die Bedingung darf sich auf eine oder (als Tabellen-Constraint) mehrere Spalten derselben Zeile beziehen, aber nicht auf andere Tabellen. Wichtig: Eine Zeile wird nur abgelehnt, wenn die Bedingung `FALSE` ergibt; bei `NULL` (unbekannt) gilt sie als erfüllt.',
    dialects: {
      std: {
        syntax: 'spalte typ CHECK (bedingung)\n[CONSTRAINT name] CHECK (bedingung)',
        example: e(`
CREATE TABLE produkte (
  id     INTEGER       PRIMARY KEY,
  name   VARCHAR(50)   NOT NULL CHECK (name <> ''),
  preis  DECIMAL(10,2) CHECK (preis >= 0),
  rabatt DECIMAL(10,2) DEFAULT 0,
  CHECK (rabatt BETWEEN 0 AND preis)
);

INSERT INTO produkte (id, name, preis, rabatt) VALUES (1, 'Maus', 19.90, 5);
INSERT INTO produkte (id, name, preis, rabatt) VALUES (2, 'Kabel', NULL, 3);  -- NULL besteht den Check!
-- INSERT INTO produkte (id, name, preis) VALUES (3, 'Monitor', -10);
--   → Fehler: CHECK-Constraint verletzt (preis >= 0)

SELECT name, preis, rabatt FROM produkte ORDER BY id;
-- name  | preis | rabatt
-- Maus  | 19.90 | 5.00
-- Kabel | NULL  | 3.00
`)
      },
      pg: { note: 'Fehlermeldung nennt den Constraint-Namen, z. B. `produkte_preis_check`.' },
      mysql: { note: 'Wird erst seit 8.0.16 durchgesetzt – ältere Versionen haben `CHECK` stillschweigend ignoriert.', mdn: MY + 'create-table-check-constraints.html' },
      mssql: { note: 'Mit `WITH NOCHECK` hinzugefügte Constraints prüfen Altdaten nicht und gelten als „nicht vertrauenswürdig“.', mdn: MS + 'statements/create-table-transact-sql' },
      sqlite: { mdn: SL + 'lang_createtable.html' }
    },
    tip: 'Soll `NULL` nicht durchrutschen, zusätzlich `NOT NULL` setzen.',
    keywords: ['prüfbedingung', 'check constraint', 'validierung', 'wertebereich', 'bedingung'],
    related: ['NOT NULL', 'Benannte Constraints', 'Dreiwertige Logik'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'Benannte Constraints',
    desc: 'Constraints mit eigenem Namen, damit Fehlermeldungen und Änderungen eindeutig sind.',
    details: 'Mit `CONSTRAINT name` vor dem Constraint vergibt man einen sprechenden Namen; ohne vergibt die Datenbank einen generierten Namen. Der Name erscheint in Fehlermeldungen und wird gebraucht, um den Constraint später mit `ALTER TABLE … DROP CONSTRAINT` zu entfernen. Übliche Präfixe: `pk_`, `fk_`, `uq_`, `chk_`.',
    dialects: {
      std: {
        syntax: 'CONSTRAINT name PRIMARY KEY (…)\nCONSTRAINT name FOREIGN KEY (…) REFERENCES …\nCONSTRAINT name CHECK (…)\nALTER TABLE tabelle DROP CONSTRAINT name;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (
  id       INTEGER NOT NULL,
  kunde_id INTEGER,
  betrag   DECIMAL(10,2),
  CONSTRAINT pk_bestellungen         PRIMARY KEY (id),
  CONSTRAINT fk_bestellungen_kunde   FOREIGN KEY (kunde_id) REFERENCES kunden (id),
  CONSTRAINT chk_bestellungen_betrag CHECK (betrag > 0)
);

INSERT INTO kunden VALUES (1, 'Müller');
INSERT INTO bestellungen VALUES (10, 1, 99.50);
-- INSERT INTO bestellungen VALUES (11, 1, -5);
--   → Fehler: … violates check constraint "chk_bestellungen_betrag"

ALTER TABLE bestellungen DROP CONSTRAINT chk_bestellungen_betrag;
INSERT INTO bestellungen VALUES (11, 1, -5);   -- jetzt erlaubt

SELECT COUNT(*) AS anzahl FROM bestellungen;
-- anzahl
-- 2
`)
      },
      pg: { note: 'Generierte Namen folgen dem Schema `<tabelle>_<spalte>_check`, `_fkey`, `_key`, `_pkey`.' },
      mysql: { note: '`DROP CONSTRAINT` gibt es seit 8.0.19; vorher `DROP FOREIGN KEY`, `DROP CHECK` bzw. `DROP INDEX`. Der Name eines Primärschlüssels ist immer `PRIMARY`.', mdn: MY + 'alter-table.html' },
      mssql: { note: 'Generierte Namen sind zufällig, z. B. `CK__bestellu__betra__3B75D760` – gerade hier lohnen eigene Namen.', mdn: MS + 'statements/alter-table-transact-sql' },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE bestellungen (
  id       INTEGER,
  kunde_id INTEGER,
  betrag   NUMERIC,
  CONSTRAINT pk_bestellungen         PRIMARY KEY (id),
  CONSTRAINT fk_bestellungen_kunde   FOREIGN KEY (kunde_id) REFERENCES kunden (id),
  CONSTRAINT chk_bestellungen_betrag CHECK (betrag > 0)
);

INSERT INTO kunden VALUES (1, 'Müller');
INSERT INTO bestellungen VALUES (10, 1, 99.5);
-- INSERT INTO bestellungen VALUES (11, 1, -5);
--   Fehler: CHECK constraint failed: chk_bestellungen_betrag

SELECT COUNT(*) AS anzahl FROM bestellungen;
-- anzahl
-- 1
`),
        note: 'Namen erscheinen in Fehlermeldungen, aber `DROP CONSTRAINT` gibt es nicht – Constraints ändern heißt Tabelle neu aufbauen.',
        mdn: SL + 'lang_createtable.html'
      }
    },
    tip: 'Ein einheitliches Schema wie `fk_<tabelle>_<ziel>` macht Migrationen und Fehlersuche deutlich einfacher.',
    keywords: ['constraint name', 'benennen', 'pk_', 'fk_', 'chk_', 'uq_', 'drop constraint'],
    related: ['Constraints nachträglich', 'CHECK', 'Namenskonventionen'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'Constraints nachträglich',
    desc: 'Fügt Constraints mit ALTER TABLE zu einer bestehenden Tabelle hinzu oder entfernt sie.',
    details: 'Beim Hinzufügen prüft die Datenbank alle vorhandenen Zeilen; verletzt eine davon den Constraint, schlägt die Änderung fehl. Deshalb vorher per Abfrage die problematischen Zeilen finden und bereinigen. Bei großen Tabellen kann die Prüfung die Tabelle länger sperren.',
    dialects: {
      std: {
        syntax: 'ALTER TABLE tabelle ADD CONSTRAINT name constraint;\nALTER TABLE tabelle DROP CONSTRAINT name;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), email VARCHAR(100));
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag DECIMAL(10,2));
INSERT INTO kunden VALUES (1, 'Müller', 'm@example.com'), (2, 'Schmidt', 's@example.com');
INSERT INTO bestellungen VALUES (10, 1, 99.50), (11, 2, -5);

-- Vorher prüfen, welche Zeilen den neuen Constraint verletzen würden
SELECT id, betrag FROM bestellungen WHERE betrag <= 0;
-- id | betrag
-- 11 | -5.00

DELETE FROM bestellungen WHERE betrag <= 0;

ALTER TABLE bestellungen
  ADD CONSTRAINT fk_bestellungen_kunde FOREIGN KEY (kunde_id) REFERENCES kunden (id);
ALTER TABLE bestellungen ADD CONSTRAINT chk_bestellungen_betrag CHECK (betrag > 0);
ALTER TABLE kunden ADD CONSTRAINT uq_kunden_email UNIQUE (email);

ALTER TABLE kunden DROP CONSTRAINT uq_kunden_email;

SELECT COUNT(*) AS anzahl FROM bestellungen;
-- anzahl
-- 1
`)
      },
      pg: {
        syntax: 'ALTER TABLE tabelle ADD CONSTRAINT name … NOT VALID;\nALTER TABLE tabelle VALIDATE CONSTRAINT name;\nALTER TABLE tabelle ALTER COLUMN spalte SET NOT NULL;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, email TEXT);
CREATE TABLE produkte (id INTEGER PRIMARY KEY, preis NUMERIC(10,2));
INSERT INTO kunden VALUES (1, 'Müller', 'm@example.com'), (2, 'Schmidt', 's@example.com');
INSERT INTO produkte VALUES (1, 19.90), (2, -1);

ALTER TABLE kunden ADD CONSTRAINT uq_kunden_email UNIQUE (email);
ALTER TABLE kunden ALTER COLUMN name SET NOT NULL;

-- Große Tabelle: erst nur neue Zeilen prüfen, alte später
ALTER TABLE produkte ADD CONSTRAINT chk_preis CHECK (preis >= 0) NOT VALID;
UPDATE produkte SET preis = 0 WHERE preis < 0;          -- Altdaten bereinigen
ALTER TABLE produkte VALIDATE CONSTRAINT chk_preis;

SELECT conname, convalidated FROM pg_constraint WHERE conname = 'chk_preis';
-- conname   | convalidated
-- chk_preis | true
`),
        note: '`NOT VALID` (für `CHECK` und Fremdschlüssel) überspringt die Prüfung alter Zeilen; `VALIDATE CONSTRAINT` holt sie später ohne lange Schreibsperre nach.'
      },
      mysql: { note: '`DROP CONSTRAINT` seit 8.0.19, vorher typspezifisch: `DROP FOREIGN KEY name`, `DROP CHECK name`, `DROP INDEX name`.', mdn: MY + 'alter-table.html' },
      mssql: { note: 'Mit `ADD CONSTRAINT … WITH NOCHECK` werden Altdaten nicht geprüft; der Constraint gilt dann aber für den Optimierer als nicht vertrauenswürdig.', mdn: MS + 'statements/alter-table-transact-sql' },
      sqlite: { none: 'Constraints lassen sich nachträglich weder hinzufügen noch löschen. Eindeutigkeit geht per `CREATE UNIQUE INDEX`, alles andere nur über einen Neuaufbau der Tabelle (neu anlegen, Daten kopieren, umbenennen).', mdn: SL + 'lang_altertable.html' }
    },
    tip: 'Vor dem Hinzufügen per Abfrage prüfen, welche Zeilen den Constraint verletzen würden, und diese zuerst bereinigen.',
    keywords: ['add constraint', 'drop constraint', 'nachträglich', 'not valid', 'validate constraint', 'alter table constraint', 'with nocheck'],
    related: ['Benannte Constraints', 'ALTER TABLE', 'FOREIGN KEY'],
    mdn: PG + 'sql-altertable.html'
  },
  {
    lang: 'sql', group: 'Schlüssel & Constraints', name: 'Deferrable Constraints',
    desc: 'Constraints, die erst beim COMMIT statt nach jeder Anweisung geprüft werden.',
    details: 'Bei gegenseitigen Verweisen (Abteilung hat Leiter, Mitarbeiter gehört zu Abteilung) kann keine Zeile zuerst eingefügt werden, ohne einen Fremdschlüssel zu verletzen. Mit `DEFERRABLE INITIALLY DEFERRED` wird die Prüfung auf das Ende der Transaktion verschoben. Außerhalb einer expliziten Transaktion bringt das nichts.',
    values: [
      ['NOT DEFERRABLE', 'Standard: Prüfung sofort nach jeder Anweisung'],
      ['DEFERRABLE INITIALLY IMMEDIATE', 'Sofort, aber per SET CONSTRAINTS aufschiebbar'],
      ['DEFERRABLE INITIALLY DEFERRED', 'Prüfung erst beim COMMIT']
    ],
    dialects: {
      std: {
        syntax: 'FOREIGN KEY (…) REFERENCES t (id) DEFERRABLE INITIALLY DEFERRED\nSET CONSTRAINTS { ALL | name } { DEFERRED | IMMEDIATE };',
        example: e(`
CREATE TABLE abteilungen (id INTEGER PRIMARY KEY, name VARCHAR(30), leiter_id INTEGER);
CREATE TABLE mitarbeiter (
  id           INTEGER PRIMARY KEY,
  name         VARCHAR(30),
  abteilung_id INTEGER,
  FOREIGN KEY (abteilung_id) REFERENCES abteilungen (id) DEFERRABLE INITIALLY DEFERRED
);
ALTER TABLE abteilungen ADD CONSTRAINT fk_abteilungen_leiter
  FOREIGN KEY (leiter_id) REFERENCES mitarbeiter (id) DEFERRABLE INITIALLY DEFERRED;

START TRANSACTION;
INSERT INTO abteilungen VALUES (1, 'IT', 10);   -- Mitarbeiter 10 gibt es noch nicht
INSERT INTO mitarbeiter VALUES (10, 'Ada', 1);
COMMIT;                                         -- erst hier wird geprüft

SELECT a.name AS abteilung, m.name AS leiter
FROM abteilungen a JOIN mitarbeiter m ON m.id = a.leiter_id;
-- abteilung | leiter
-- IT        | Ada
`)
      },
      pg: { note: 'Aufschiebbar sind Fremdschlüssel, `UNIQUE` und Primärschlüssel, nicht aber `CHECK` und `NOT NULL`. `SET CONSTRAINTS ALL DEFERRED` schaltet innerhalb einer Transaktion um.', mdn: PG + 'sql-set-constraints.html' },
      mysql: { none: 'Keine aufschiebbaren Constraints. Workaround: Fremdschlüssel zunächst `NULL` lassen und nach dem zweiten `INSERT` per `UPDATE` setzen, oder mit `SET FOREIGN_KEY_CHECKS = 0` kurz abschalten (prüft beim Wiedereinschalten nicht nach!).' },
      mssql: { none: 'Keine aufschiebbaren Constraints. Workaround: Fremdschlüssel zunächst `NULL` lassen und nach dem zweiten `INSERT` per `UPDATE` setzen, oder mit `ALTER TABLE … NOCHECK CONSTRAINT name` vorübergehend abschalten.' },
      sqlite: {
        syntax: 'REFERENCES t (id) DEFERRABLE INITIALLY DEFERRED',
        example: e(`
CREATE TABLE abteilungen (
  id        INTEGER PRIMARY KEY,
  name      TEXT,
  leiter_id INTEGER REFERENCES mitarbeiter (id) DEFERRABLE INITIALLY DEFERRED
);
CREATE TABLE mitarbeiter (
  id           INTEGER PRIMARY KEY,
  name         TEXT,
  abteilung_id INTEGER REFERENCES abteilungen (id) DEFERRABLE INITIALLY DEFERRED
);

BEGIN;
INSERT INTO abteilungen VALUES (1, 'IT', 10);   -- Mitarbeiter 10 gibt es noch nicht
INSERT INTO mitarbeiter VALUES (10, 'Ada', 1);
COMMIT;                                         -- erst hier wird geprüft

SELECT a.name AS abteilung, m.name AS leiter
FROM abteilungen a JOIN mitarbeiter m ON m.id = a.leiter_id;
-- abteilung | leiter
-- IT        | Ada
`),
        note: 'Nur Fremdschlüssel sind aufschiebbar. `PRAGMA defer_foreign_keys = ON` schiebt alle Fremdschlüsselprüfungen der aktuellen Transaktion auf. Verweise auf noch nicht angelegte Tabellen sind erlaubt.',
        mdn: SL + 'foreignkeys.html'
      }
    },
    tip: 'Deferred Constraints außerhalb einer expliziten Transaktion bringen nichts, weil dann jede Anweisung sofort committet wird.',
    keywords: ['deferrable', 'deferred', 'verzögert', 'aufgeschoben', 'set constraints', 'zirkulär', 'commit-prüfung'],
    related: ['FOREIGN KEY', 'BEGIN / COMMIT', 'Transaktion'],
    mdn: PG + 'sql-set-constraints.html'
  },

  // ---------------- Indizes ----------------
  {
    lang: 'sql', group: 'Indizes', name: 'CREATE INDEX',
    desc: 'Legt einen Index an, der Suchen, Sortieren und Joins über Spalten beschleunigt.',
    details: 'Ein Index ist eine sortierte Zusatzstruktur (meist ein B-Baum), über die die Datenbank passende Zeilen findet, ohne die ganze Tabelle zu lesen. Er kostet Speicher und verlangsamt jedes `INSERT`, `UPDATE` und `DELETE`, weil er mitgepflegt werden muss. Ob ein Index benutzt wird, entscheidet der Optimierer – prüfen lässt sich das mit `EXPLAIN`.',
    values: [
      ['B-Baum', 'Standard; für =, <, >, BETWEEN, ORDER BY, LIKE \'abc%\''],
      ['UNIQUE', 'Erzwingt zusätzlich eindeutige Werte'],
      ['ASC / DESC', 'Sortierrichtung je Spalte']
    ],
    dialects: {
      std: { none: 'Indizes sind nicht Teil des ISO-Standards. Praktisch alle Systeme verstehen aber `CREATE INDEX name ON tabelle (spalte);`.' },
      pg: {
        syntax: 'CREATE [UNIQUE] INDEX [CONCURRENTLY] [IF NOT EXISTS] name\n  ON tabelle [USING methode] (spalte [ASC | DESC] [, …]) [WHERE …];',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC(10,2));
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 2, 80), (3, 1, 50), (4, 3, 20);

CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);

SELECT id, betrag FROM bestellungen WHERE kunde_id = 1 ORDER BY id;
-- id | betrag
-- 1  | 100.00
-- 3  | 50.00

SELECT indexdef FROM pg_indexes WHERE indexname = 'idx_bestellungen_kunde';
-- indexdef
-- CREATE INDEX idx_bestellungen_kunde ON public.bestellungen USING btree (kunde_id)
`),
        note: '`CREATE INDEX CONCURRENTLY` baut ohne Schreibsperre auf (nicht in einer Transaktion). Weitere Methoden: `USING hash | gin | gist | brin`.',
        mdn: PG + 'sql-createindex.html'
      },
      mysql: {
        syntax: 'CREATE [UNIQUE] INDEX name ON tabelle (spalte [, …]);\nCREATE TABLE t (…, INDEX name (spalte));',
        example: e(`
CREATE TABLE bestellungen (
  id       INT PRIMARY KEY,
  kunde_id INT,
  betrag   DECIMAL(10,2),
  INDEX idx_bestellungen_kunde (kunde_id)      -- direkt in CREATE TABLE
);
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 2, 80), (3, 1, 50), (4, 3, 20);

SELECT id, betrag FROM bestellungen WHERE kunde_id = 1 ORDER BY id;
-- id | betrag
-- 1  | 100.00
-- 3  | 50.00

SELECT index_name, column_name AS spalte
FROM information_schema.statistics
WHERE table_schema = DATABASE() AND table_name = 'bestellungen'
ORDER BY index_name;
-- index_name             | spalte
-- idx_bestellungen_kunde | kunde_id
-- PRIMARY                | id
`),
        note: 'Indizes lassen sich direkt in `CREATE TABLE` definieren. `SHOW INDEX FROM tabelle` listet sie auf. Fremdschlüssel bekommen automatisch einen Index.',
        mdn: MY + 'create-index.html'
      },
      mssql: {
        syntax: 'CREATE [UNIQUE] [CLUSTERED | NONCLUSTERED] INDEX name\n  ON tabelle (spalte [ASC | DESC] [, …]) [INCLUDE (…)] [WHERE …];',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 2, 80), (3, 1, 50), (4, 3, 20);

CREATE NONCLUSTERED INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);

SELECT id, betrag FROM bestellungen WHERE kunde_id = 1 ORDER BY id;
-- id | betrag
-- 1  | 100.00
-- 3  | 50.00

SELECT name, type_desc FROM sys.indexes
WHERE object_id = OBJECT_ID('bestellungen') AND name LIKE 'idx%';
-- name                   | type_desc
-- idx_bestellungen_kunde | NONCLUSTERED
`),
        note: 'Pro Tabelle gibt es höchstens einen `CLUSTERED` Index (die Tabelle selbst, meist der Primärschlüssel); alle weiteren sind `NONCLUSTERED`.',
        mdn: MS + 'statements/create-index-transact-sql'
      },
      sqlite: {
        syntax: 'CREATE [UNIQUE] INDEX [IF NOT EXISTS] name ON tabelle (spalte [ASC | DESC] [, …]) [WHERE …];',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC);
INSERT INTO bestellungen (kunde_id, betrag)
VALUES (1, 100), (2, 80), (1, 50), (3, 20);

CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);

SELECT id, betrag FROM bestellungen WHERE kunde_id = 1 ORDER BY id;
-- id | betrag
-- 1  | 100
-- 3  | 50

EXPLAIN QUERY PLAN SELECT id, betrag FROM bestellungen WHERE kunde_id = 1;
-- id | parent | notused | detail
-- 3  | 0      | 62      | SEARCH bestellungen USING INDEX idx_bestellungen_kunde (kunde_id=?)
`),
        mdn: SL + 'lang_createindex.html'
      }
    },
    tip: 'Indizes gezielt für häufige `WHERE`-, `JOIN`- und `ORDER BY`-Spalten anlegen, nicht vorsorglich auf jede Spalte.',
    keywords: ['index', 'index anlegen', 'schneller', 'performance', 'b-baum', 'b-tree', 'concurrently', 'nonclustered', 'clustered'],
    related: ['Zusammengesetzter Index', 'Wann Indizes helfen', 'EXPLAIN QUERY PLAN (SQLite)', 'DROP INDEX'],
    mdn: PG + 'sql-createindex.html'
  },
  {
    lang: 'sql', group: 'Indizes', name: 'Zusammengesetzter Index',
    desc: 'Index über mehrere Spalten; die Reihenfolge der Spalten ist entscheidend.',
    details: 'Ein Index auf `(abteilung, gehalt)` ist erst nach `abteilung` und innerhalb davon nach `gehalt` sortiert, wie ein Telefonbuch nach Nachname, dann Vorname. Er hilft daher bei Bedingungen auf `abteilung` allein oder auf beide Spalten, aber kaum bei `gehalt` allein (Präfixregel, „leftmost prefix“). Faustregel: Spalten mit Gleichheitsbedingung zuerst, Bereichs- oder Sortierspalten danach.',
    dialects: {
      std: { none: 'Indizes sind nicht Teil des ISO-Standards. Üblich ist `CREATE INDEX name ON tabelle (spalte1, spalte2);`.' },
      pg: {
        syntax: 'CREATE INDEX name ON tabelle (spalte1, spalte2 [, …]);',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name TEXT, abteilung TEXT, gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Lin', 'IT', 4800), (3, 'Tom', 'Vertrieb', 3900), (4, 'Eva', 'Vertrieb', 4100);

CREATE INDEX idx_mitarbeiter_abt_gehalt ON mitarbeiter (abteilung, gehalt);

SELECT name FROM mitarbeiter WHERE abteilung = 'IT' AND gehalt > 5000;
-- name
-- Ada

SET enable_seqscan = off;   -- nur für die Demo: Mini-Tabellen liest PostgreSQL sonst komplett
EXPLAIN (COSTS OFF) SELECT name FROM mitarbeiter WHERE abteilung = 'IT' AND gehalt > 5000;
-- QUERY PLAN
-- Index Scan using idx_mitarbeiter_abt_gehalt on mitarbeiter
-- …
`),
        note: 'Seit PostgreSQL 18 kann ein B-Baum per „Skip Scan“ auch ohne Bedingung auf der ersten Spalte genutzt werden – lohnt sich aber nur bei wenigen verschiedenen Werten in der ersten Spalte.',
        mdn: PG + 'indexes-multicolumn.html'
      },
      mysql: {
        syntax: 'CREATE INDEX name ON tabelle (spalte1, spalte2 [, …]);',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Lin', 'IT', 4800), (3, 'Tom', 'Vertrieb', 3900), (4, 'Eva', 'Vertrieb', 4100);

CREATE INDEX idx_mitarbeiter_abt_gehalt ON mitarbeiter (abteilung, gehalt);

SELECT name FROM mitarbeiter WHERE abteilung = 'IT' AND gehalt > 5000;
-- name
-- Ada

SELECT column_name AS spalte, seq_in_index AS position
FROM information_schema.statistics
WHERE table_schema = DATABASE() AND index_name = 'idx_mitarbeiter_abt_gehalt'
ORDER BY seq_in_index;
-- spalte    | position
-- abteilung | 1
-- gehalt    | 2
`),
        note: 'Der Plan (`EXPLAIN …`) zeigt in der Spalte `key` den genutzten Index und in `key_len`, wie viele Bytes davon (also wie viele Spalten) verwendet werden.',
        mdn: MY + 'multiple-column-indexes.html'
      },
      mssql: {
        syntax: 'CREATE INDEX name ON tabelle (spalte1, spalte2 [, …]);',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), abteilung NVARCHAR(30), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Lin', 'IT', 4800), (3, 'Tom', 'Vertrieb', 3900), (4, 'Eva', 'Vertrieb', 4100);

CREATE INDEX idx_mitarbeiter_abt_gehalt ON mitarbeiter (abteilung, gehalt);

SELECT name FROM mitarbeiter WHERE abteilung = 'IT' AND gehalt > 5000;
-- name
-- Ada

SELECT c.name AS spalte, ic.key_ordinal AS position
FROM sys.indexes i
JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE i.name = 'idx_mitarbeiter_abt_gehalt'
ORDER BY ic.key_ordinal;
-- spalte    | position
-- abteilung | 1
-- gehalt    | 2
`),
        note: 'Im Ausführungsplan (SSMS: „Tatsächlichen Ausführungsplan einschließen“) erscheint ein „Index Seek“, wenn der Index gezielt genutzt wird, sonst ein „Index Scan“.',
        mdn: MS + 'statements/create-index-transact-sql'
      },
      sqlite: {
        syntax: 'CREATE INDEX name ON tabelle (spalte1, spalte2 [, …]);',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name TEXT, abteilung TEXT, gehalt INTEGER);
INSERT INTO mitarbeiter (name, abteilung, gehalt) VALUES
  ('Ada', 'IT', 5200), ('Lin', 'IT', 4800), ('Tom', 'Vertrieb', 3900), ('Eva', 'Vertrieb', 4100);

CREATE INDEX idx_mitarbeiter_abt_gehalt ON mitarbeiter (abteilung, gehalt);

-- Erste Spalte gleich, zweite als Bereich: Index wird genutzt
EXPLAIN QUERY PLAN SELECT name FROM mitarbeiter WHERE abteilung = 'IT' AND gehalt > 5000;
-- id | parent | notused | detail
-- 3  | 0      | 51      | SEARCH mitarbeiter USING INDEX idx_mitarbeiter_abt_gehalt (abteilung=? AND gehalt>?)

-- Nur die zweite Spalte: kein gezieltes Suchen möglich
EXPLAIN QUERY PLAN SELECT name FROM mitarbeiter WHERE gehalt > 5000;
-- id | parent | notused | detail
-- 2  | 0      | 216     | SCAN mitarbeiter
`),
        mdn: SL + 'lang_createindex.html'
      }
    },
    tip: 'Ein Index auf `(a, b)` macht einen zusätzlichen Index auf `(a)` überflüssig, aber nicht einen auf `(b)`.',
    keywords: ['mehrspaltiger index', 'composite index', 'multi-column index', 'spaltenreihenfolge', 'leftmost prefix', 'präfix', 'skip scan'],
    related: ['CREATE INDEX', 'Covering Index', 'Zusammengesetzter Primärschlüssel'],
    mdn: PG + 'indexes-multicolumn.html'
  },
  {
    lang: 'sql', group: 'Indizes', name: 'UNIQUE INDEX',
    desc: 'Index, der zusätzlich die Eindeutigkeit der indizierten Werte erzwingt.',
    details: 'Wirkt wie ein `UNIQUE`-Constraint und wird von der Datenbank intern auch genau dafür angelegt. Als eigener Index ist er flexibler: Er kann je nach Dialekt über Ausdrücke laufen (z. B. `LOWER(email)`) oder partiell sein. Bestehende Duplikate lassen das Anlegen scheitern.',
    dialects: {
      std: { none: 'Indizes sind nicht Teil des ISO-Standards; standardkonform ist ein `UNIQUE`-Constraint. Üblich ist `CREATE UNIQUE INDEX name ON tabelle (spalte);`.' },
      pg: {
        syntax: 'CREATE UNIQUE INDEX name ON tabelle (spalte | (ausdruck) [, …]);',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, email TEXT);
INSERT INTO kunden VALUES
  (1, 'Müller', 'mueller@example.com'), (2, 'Schmidt', 'schmidt@example.com');

-- Eindeutig ohne Rücksicht auf Groß-/Kleinschreibung
CREATE UNIQUE INDEX ux_kunden_email ON kunden (LOWER(email));

INSERT INTO kunden VALUES (3, 'Weber', 'weber@example.com');
-- INSERT INTO kunden VALUES (4, 'Fake', 'Mueller@Example.com');
--   → Fehler: duplicate key value violates unique constraint "ux_kunden_email"

SELECT name, email FROM kunden ORDER BY id;
-- name    | email
-- Müller  | mueller@example.com
-- Schmidt | schmidt@example.com
-- Weber   | weber@example.com
`),
        note: 'Vergleiche sind standardmäßig case-sensitiv – ohne `LOWER()` wären beide Schreibweisen erlaubt. `NULLS NOT DISTINCT` (seit 15) lässt nur ein `NULL` zu.',
        mdn: PG + 'indexes-unique.html'
      },
      mysql: {
        syntax: 'CREATE UNIQUE INDEX name ON tabelle (spalte [, …]);',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), email VARCHAR(100));
INSERT INTO kunden VALUES
  (1, 'Müller', 'mueller@example.com'), (2, 'Schmidt', 'schmidt@example.com');

-- Die Standard-Kollation ignoriert Groß-/Kleinschreibung schon von selbst
CREATE UNIQUE INDEX ux_kunden_email ON kunden (email);

INSERT INTO kunden VALUES (3, 'Weber', 'weber@example.com');
-- INSERT INTO kunden VALUES (4, 'Fake', 'Mueller@Example.com');
--   → Fehler: Duplicate entry 'Mueller@Example.com' for key 'kunden.ux_kunden_email'

SELECT name, email FROM kunden ORDER BY id;
-- name    | email
-- Müller  | mueller@example.com
-- Schmidt | schmidt@example.com
-- Weber   | weber@example.com
`),
        note: 'Mit der Standard-Kollation `utf8mb4_0900_ai_ci` ist der Index bereits case-insensitiv. Ausdrücke gehen seit 8.0.13 mit doppelten Klammern: `((LOWER(email)))`.',
        mdn: MY + 'create-index.html'
      },
      mssql: {
        syntax: 'CREATE UNIQUE INDEX name ON tabelle (spalte [, …]) [WHERE …];',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50), email NVARCHAR(100));
INSERT INTO kunden VALUES
  (1, 'Müller', 'mueller@example.com'), (2, 'Schmidt', 'schmidt@example.com');

-- Die Standard-Kollation ignoriert Groß-/Kleinschreibung schon von selbst
CREATE UNIQUE INDEX ux_kunden_email ON kunden (email);

INSERT INTO kunden VALUES (3, 'Weber', 'weber@example.com');
-- INSERT INTO kunden VALUES (4, 'Fake', 'Mueller@Example.com');
--   → Fehler: Cannot insert duplicate key row … with unique index 'ux_kunden_email'

SELECT name, email FROM kunden ORDER BY id;
-- name    | email
-- Müller  | mueller@example.com
-- Schmidt | schmidt@example.com
-- Weber   | weber@example.com
`),
        note: 'Die Standard-Kollation (`…_CI_AS`) ist case-insensitiv. Ein eindeutiger Index erlaubt nur ein `NULL` – mit `WHERE spalte IS NOT NULL` beliebig viele.',
        mdn: MS + 'statements/create-index-transact-sql'
      },
      sqlite: {
        syntax: 'CREATE UNIQUE INDEX name ON tabelle (spalte | ausdruck [, …]);',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, email TEXT);
INSERT INTO kunden (name, email) VALUES
  ('Müller', 'mueller@example.com'), ('Schmidt', 'schmidt@example.com');

-- Eindeutig ohne Rücksicht auf Groß-/Kleinschreibung
CREATE UNIQUE INDEX ux_kunden_email ON kunden (LOWER(email));

INSERT INTO kunden (name, email) VALUES ('Weber', 'weber@example.com');
-- INSERT INTO kunden (name, email) VALUES ('Fake', 'Mueller@Example.com');
--   Fehler: UNIQUE constraint failed: index 'ux_kunden_email'

SELECT name, email FROM kunden ORDER BY id;
-- name    | email
-- Müller  | mueller@example.com
-- Schmidt | schmidt@example.com
-- Weber   | weber@example.com
`),
        note: 'Der einzige Weg, nachträglich Eindeutigkeit zu erzwingen, da `ALTER TABLE … ADD CONSTRAINT` fehlt.',
        mdn: SL + 'lang_createindex.html'
      }
    },
    tip: 'Doppelte Werte vor dem Anlegen mit `GROUP BY spalte HAVING COUNT(*) > 1` aufspüren.',
    keywords: ['eindeutiger index', 'unique index', 'duplikate verhindern', 'case insensitive unique', 'kollation'],
    related: ['UNIQUE', 'Ausdrucksindex', 'Partieller Index'],
    mdn: PG + 'indexes-unique.html'
  },
  {
    lang: 'sql', group: 'Indizes', name: 'Partieller Index',
    desc: 'Index nur über die Zeilen, die eine WHERE-Bedingung erfüllen.',
    details: 'Indiziert nur einen Teil der Tabelle, z. B. offene Bestellungen oder nicht gelöschte Datensätze. Das spart Platz und Pflegeaufwand, wenn Abfragen fast immer genau diese Teilmenge betreffen. Benutzt wird er nur, wenn die Abfrage-Bedingung die Index-Bedingung erkennbar mit einschließt. Als `UNIQUE` erzwingt er Eindeutigkeit nur innerhalb der Teilmenge.',
    dialects: {
      std: { none: 'Indizes sind nicht Teil des ISO-Standards. PostgreSQL und SQLite schreiben `CREATE INDEX … WHERE bedingung`, SQL Server ebenso („filtered index“).' },
      pg: {
        syntax: 'CREATE [UNIQUE] INDEX name ON tabelle (spalte) WHERE bedingung;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, status TEXT, betrag NUMERIC(10,2));
INSERT INTO bestellungen VALUES
  (1, 1, 'offen', 100), (2, 1, 'erledigt', 50), (3, 2, 'offen', 80), (4, 2, 'erledigt', 20);

CREATE INDEX idx_bestellungen_offen ON bestellungen (kunde_id) WHERE status = 'offen';

SELECT id, betrag FROM bestellungen WHERE status = 'offen' AND kunde_id = 1;
-- id | betrag
-- 1  | 100.00

SET enable_seqscan = off;   -- nur für die Demo
EXPLAIN (COSTS OFF) SELECT id, betrag FROM bestellungen WHERE status = 'offen' AND kunde_id = 1;
-- QUERY PLAN
-- Index Scan using idx_bestellungen_offen on bestellungen
-- …
`),
        mdn: PG + 'indexes-partial.html'
      },
      mysql: { none: 'Keine partiellen Indizes. Alternativen: ein normaler Index auf `(status, kunde_id)` oder ein funktionaler Index auf einen Ausdruck, der für die übrigen Zeilen `NULL` ergibt.' },
      mssql: {
        syntax: 'CREATE [UNIQUE] INDEX name ON tabelle (spalte) WHERE bedingung;',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, status NVARCHAR(20), betrag DECIMAL(10,2));
INSERT INTO bestellungen VALUES
  (1, 1, 'offen', 100), (2, 1, 'erledigt', 50), (3, 2, 'offen', 80), (4, 2, 'erledigt', 20);

CREATE INDEX idx_bestellungen_offen ON bestellungen (kunde_id) WHERE status = 'offen';

SELECT id, betrag FROM bestellungen WHERE status = 'offen' AND kunde_id = 1;
-- id | betrag
-- 1  | 100.00

SELECT name, filter_definition FROM sys.indexes WHERE name = 'idx_bestellungen_offen';
-- name                   | filter_definition
-- idx_bestellungen_offen | ([status]='offen')
`),
        note: 'Heißt „filtered index“. Die Bedingung darf nur einfache Vergleiche enthalten (kein `OR`, keine Funktionen). Abfragen mit Parametern nutzen ihn oft nicht.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/indexes/create-filtered-indexes'
      },
      sqlite: {
        syntax: 'CREATE [UNIQUE] INDEX name ON tabelle (spalte) WHERE bedingung;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, status TEXT, betrag NUMERIC);
INSERT INTO bestellungen (kunde_id, status, betrag) VALUES
  (1, 'offen', 100), (1, 'erledigt', 50), (2, 'offen', 80), (2, 'erledigt', 20);

CREATE INDEX idx_bestellungen_offen ON bestellungen (kunde_id) WHERE status = 'offen';

SELECT id, betrag FROM bestellungen WHERE status = 'offen' AND kunde_id = 1;
-- id | betrag
-- 1  | 100

EXPLAIN QUERY PLAN SELECT id, betrag FROM bestellungen WHERE status = 'offen' AND kunde_id = 1;
-- id | parent | notused | detail
-- 3  | 0      | 61      | SEARCH bestellungen USING INDEX idx_bestellungen_offen (kunde_id=?)
`),
        mdn: SL + 'partialindex.html'
      }
    },
    tip: 'Klassiker: `CREATE UNIQUE INDEX … ON kunden (email) WHERE geloescht = 0` – eindeutige E-Mail nur unter aktiven Kunden.',
    keywords: ['partial index', 'teilindex', 'filtered index', 'gefilterter index', 'where im index'],
    related: ['CREATE INDEX', 'UNIQUE INDEX', 'Soft Delete'],
    mdn: PG + 'indexes-partial.html'
  },
  {
    lang: 'sql', group: 'Indizes', name: 'Ausdrucksindex',
    desc: 'Index über das Ergebnis eines Ausdrucks statt über eine Spalte.',
    details: 'Wird in Abfragen eine Funktion auf eine Spalte angewendet, etwa `LOWER(name)`, kann ein normaler Index auf `name` nicht genutzt werden. Ein Index auf genau diesen Ausdruck schon – aber nur, wenn die Abfrage den Ausdruck exakt gleich schreibt. Der Ausdruck muss deterministisch sein.',
    dialects: {
      std: { none: 'Indizes sind nicht Teil des ISO-Standards. Je nach System: Ausdruck direkt im Index (PostgreSQL, SQLite, MySQL) oder Index auf eine berechnete Spalte (SQL Server).' },
      pg: {
        syntax: 'CREATE INDEX name ON tabelle (funktion(spalte));\nCREATE INDEX name ON tabelle ((ausdruck));',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT);
INSERT INTO kunden VALUES (1, 'Weber', 'Berlin'), (2, 'Schmidt', 'Köln'), (3, 'WEBER', 'Bonn');

CREATE INDEX idx_kunden_name_lower ON kunden (LOWER(name));

SELECT name, stadt FROM kunden WHERE LOWER(name) = 'weber' ORDER BY id;
-- name  | stadt
-- Weber | Berlin
-- WEBER | Bonn

SET enable_seqscan = off;   -- nur für die Demo
EXPLAIN (COSTS OFF) SELECT name FROM kunden WHERE LOWER(name) = 'weber';
-- QUERY PLAN
-- Index Scan using idx_kunden_name_lower on kunden
-- …
`),
        note: 'Ein einfacher Funktionsaufruf geht ohne Zusatzklammern, andere Ausdrücke (z. B. `(vorname || \' \' || nachname)`) brauchen doppelte Klammern.',
        mdn: PG + 'indexes-expressional.html'
      },
      mysql: {
        syntax: 'CREATE INDEX name ON tabelle ((ausdruck));',
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name VARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.90), (2, 'Monitor', 189.00), (3, 'Kabel', 4.50);

-- Funktionaler Index: Ausdruck in doppelten Klammern
CREATE INDEX idx_produkte_brutto ON produkte ((ROUND(preis * 1.19, 2)));

SELECT name FROM produkte WHERE ROUND(preis * 1.19, 2) > 20 ORDER BY id;
-- name
-- Maus
-- Monitor
`),
        note: 'Seit 8.0.13 („functional key parts“), intern als versteckte generierte Spalte umgesetzt. Für `LOWER(name)` braucht es ihn meist nicht, weil die Standard-Kollation ohnehin case-insensitiv vergleicht.',
        mdn: MY + 'create-index.html'
      },
      mssql: {
        syntax: 'ALTER TABLE tabelle ADD spalte AS (ausdruck);\nCREATE INDEX name ON tabelle (spalte);',
        example: e(`
CREATE TABLE produkte (id INT PRIMARY KEY, name NVARCHAR(50), preis DECIMAL(10,2));
INSERT INTO produkte VALUES (1, 'Maus', 19.90), (2, 'Monitor', 189.00), (3, 'Kabel', 4.50);

-- Berechnete Spalte anlegen und indizieren
ALTER TABLE produkte ADD brutto AS ROUND(preis * 1.19, 2);
CREATE INDEX idx_produkte_brutto ON produkte (brutto);
GO

-- Der Optimierer erkennt den Ausdruck auch ohne Spaltennamen
SELECT name FROM produkte WHERE ROUND(preis * 1.19, 2) > 20 ORDER BY id;
-- name
-- Maus
-- Monitor
`),
        note: 'Keine Ausdrücke direkt im Index; der Umweg über eine (auch nicht `PERSISTED`) berechnete Spalte ist der übliche Weg.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/indexes/indexes-on-computed-columns'
      },
      sqlite: {
        syntax: 'CREATE INDEX name ON tabelle (ausdruck);',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT);
INSERT INTO kunden (name, stadt) VALUES ('Weber', 'Berlin'), ('Schmidt', 'Köln'), ('WEBER', 'Bonn');

CREATE INDEX idx_kunden_name_lower ON kunden (LOWER(name));

SELECT name, stadt FROM kunden WHERE LOWER(name) = 'weber' ORDER BY id;
-- name  | stadt
-- Weber | Berlin
-- WEBER | Bonn

EXPLAIN QUERY PLAN SELECT name FROM kunden WHERE LOWER(name) = 'weber';
-- id | parent | notused | detail
-- 3  | 0      | 61      | SEARCH kunden USING INDEX idx_kunden_name_lower (<expr>=?)
`),
        note: '`LOWER()` wandelt nur ASCII-Buchstaben um; für Umlaute besser eine normalisierte Zusatzspalte verwenden.',
        mdn: SL + 'expridx.html'
      }
    },
    tip: 'Der Ausdruck in der Abfrage muss exakt dem im Index entsprechen – `LOWER(name)` und `UPPER(name)` sind für den Optimierer verschiedene Dinge.',
    keywords: ['expression index', 'funktionsindex', 'function-based index', 'lower index', 'berechneter index', 'functional key part'],
    related: ['Sargierbare Bedingungen', 'Generierte Spalten', 'UPPER() / LOWER()'],
    mdn: PG + 'indexes-expressional.html'
  },
  {
    lang: 'sql', group: 'Indizes', name: 'Covering Index',
    desc: 'Index, der alle von einer Abfrage benötigten Spalten enthält – die Tabelle bleibt ungelesen.',
    details: 'Enthält der Index sowohl die Suchspalten als auch alle ausgegebenen Spalten, kann die Datenbank die Antwort allein aus dem Index liefern („Index Only Scan“). Das spart den Zugriff auf die eigentlichen Tabellenzeilen. Zusatzspalten hängt man entweder als weitere Indexspalten an oder – wo möglich – per `INCLUDE (…)`, dann werden sie nur mitgespeichert, aber nicht sortiert.',
    dialects: {
      std: { none: 'Indizes sind nicht Teil des ISO-Standards. Portabel: Zusatzspalten als weitere Indexspalten anhängen, `CREATE INDEX name ON tabelle (suchspalte, ausgabespalte);`.' },
      pg: {
        syntax: 'CREATE INDEX name ON tabelle (suchspalte) INCLUDE (ausgabespalte [, …]);',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC(10,2), notiz TEXT);
INSERT INTO bestellungen VALUES
  (1, 1, 100, 'Express'), (2, 2, 80, NULL), (3, 1, 50, NULL), (4, 3, 20, 'Abholung');

CREATE INDEX idx_bestellungen_kunde_inc ON bestellungen (kunde_id) INCLUDE (betrag);

SELECT SUM(betrag) AS summe FROM bestellungen WHERE kunde_id = 1;
-- summe
-- 150.00

SET enable_seqscan = off;   -- nur für die Demo
EXPLAIN (COSTS OFF) SELECT kunde_id, betrag FROM bestellungen WHERE kunde_id = 1;
-- QUERY PLAN
-- Index Only Scan using idx_bestellungen_kunde_inc on bestellungen
-- …
`),
        note: 'Ein „Index Only Scan“ spart den Tabellenzugriff nur für Seiten, die laut Visibility Map vollständig sichtbar sind – regelmäßiges `VACUUM` ist dafür wichtig.',
        mdn: PG + 'indexes-index-only-scans.html'
      },
      mysql: {
        syntax: 'CREATE INDEX name ON tabelle (suchspalte, ausgabespalte [, …]);',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), notiz VARCHAR(100));
INSERT INTO bestellungen VALUES
  (1, 1, 100, 'Express'), (2, 2, 80, NULL), (3, 1, 50, NULL), (4, 3, 20, 'Abholung');

CREATE INDEX idx_bestellungen_kunde_betrag ON bestellungen (kunde_id, betrag);

SELECT SUM(betrag) AS summe FROM bestellungen WHERE kunde_id = 1;
-- summe
-- 150.00
`),
        note: 'Kein `INCLUDE`. `EXPLAIN` zeigt in der Spalte `Extra` den Hinweis `Using index`, wenn nur der Index gelesen wird. Der Primärschlüssel steckt in InnoDB in jedem Index automatisch mit drin.',
        mdn: MY + 'explain-output.html'
      },
      mssql: {
        syntax: 'CREATE INDEX name ON tabelle (suchspalte) INCLUDE (ausgabespalte [, …]);',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), notiz NVARCHAR(100));
INSERT INTO bestellungen VALUES
  (1, 1, 100, 'Express'), (2, 2, 80, NULL), (3, 1, 50, NULL), (4, 3, 20, 'Abholung');

CREATE INDEX idx_bestellungen_kunde_inc ON bestellungen (kunde_id) INCLUDE (betrag);

SELECT SUM(betrag) AS summe FROM bestellungen WHERE kunde_id = 1;
-- summe
-- 150.00
`),
        note: 'Ohne passenden Covering Index zeigt der Plan einen „Key Lookup“ auf den Clustered Index – ein typischer Kandidat für `INCLUDE`.',
        mdn: MS + 'statements/create-index-transact-sql'
      },
      sqlite: {
        syntax: 'CREATE INDEX name ON tabelle (suchspalte, ausgabespalte [, …]);',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC, notiz TEXT);
INSERT INTO bestellungen (kunde_id, betrag, notiz) VALUES
  (1, 100, 'Express'), (2, 80, NULL), (1, 50, NULL), (3, 20, 'Abholung');

CREATE INDEX idx_bestellungen_kunde_betrag ON bestellungen (kunde_id, betrag);

SELECT SUM(betrag) AS summe FROM bestellungen WHERE kunde_id = 1;
-- summe
-- 150

EXPLAIN QUERY PLAN SELECT SUM(betrag) FROM bestellungen WHERE kunde_id = 1;
-- id | parent | notused | detail
-- 3  | 0      | 54      | SEARCH bestellungen USING COVERING INDEX idx_bestellungen_kunde_betrag (kunde_id=?)
`),
        note: 'Kein `INCLUDE`; der Plan meldet `USING COVERING INDEX`.',
        mdn: SL + 'eqp.html'
      }
    },
    tip: 'Covering Indizes lohnen sich für sehr häufige, schmale Abfragen; mit `SELECT *` funktionieren sie praktisch nie.',
    keywords: ['abdeckender index', 'covering index', 'index only scan', 'include', 'index-only', 'using index', 'key lookup'],
    related: ['Zusammengesetzter Index', 'SELECT * vermeiden', 'EXPLAIN QUERY PLAN (SQLite)'],
    mdn: PG + 'indexes-index-only-scans.html'
  },
  {
    lang: 'sql', group: 'Indizes', name: 'DROP INDEX',
    desc: 'Löscht einen Index; die Tabellendaten bleiben unverändert.',
    details: 'Nicht benutzte Indizes kosten nur Speicher und Schreibleistung, deshalb lohnt es sich, sie zu entfernen. Indizes, die zu einem `PRIMARY KEY`- oder `UNIQUE`-Constraint gehören, löscht man über den Constraint, nicht mit `DROP INDEX`.',
    dialects: {
      std: { none: 'Indizes sind nicht Teil des ISO-Standards. Je nach System `DROP INDEX name` oder `DROP INDEX name ON tabelle`.' },
      pg: {
        syntax: 'DROP INDEX [CONCURRENTLY] [IF EXISTS] name [CASCADE];',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT);
CREATE INDEX idx_kunden_stadt ON kunden (stadt);
CREATE INDEX idx_kunden_name ON kunden (name);

DROP INDEX idx_kunden_stadt;
DROP INDEX IF EXISTS idx_gibt_es_nicht;   -- nur ein NOTICE

SELECT indexname FROM pg_indexes WHERE tablename = 'kunden' ORDER BY indexname;
-- indexname
-- idx_kunden_name
-- kunden_pkey
`),
        note: 'Indexnamen sind pro Schema eindeutig, daher ohne Tabellennamen. `pg_stat_user_indexes` (Spalte `idx_scan`) zeigt, welche Indizes nie benutzt werden.',
        mdn: PG + 'sql-dropindex.html'
      },
      mysql: {
        syntax: 'DROP INDEX name ON tabelle;\nALTER TABLE tabelle DROP INDEX name;',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
CREATE INDEX idx_kunden_stadt ON kunden (stadt);
CREATE INDEX idx_kunden_name ON kunden (name);

DROP INDEX idx_kunden_stadt ON kunden;

SELECT DISTINCT index_name
FROM information_schema.statistics
WHERE table_schema = DATABASE() AND table_name = 'kunden'
ORDER BY index_name;
-- index_name
-- idx_kunden_name
-- PRIMARY
`),
        note: 'Indexnamen gelten pro Tabelle, deshalb ist `ON tabelle` Pflicht. Kein `IF EXISTS`. Ein Index, den ein Fremdschlüssel braucht, lässt sich nicht löschen.',
        mdn: MY + 'drop-index.html'
      },
      mssql: {
        syntax: 'DROP INDEX [IF EXISTS] name ON tabelle;',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50), stadt NVARCHAR(50));
CREATE INDEX idx_kunden_stadt ON kunden (stadt);
CREATE INDEX idx_kunden_name ON kunden (name);

DROP INDEX idx_kunden_stadt ON kunden;
DROP INDEX IF EXISTS idx_gibt_es_nicht ON kunden;

SELECT name FROM sys.indexes
WHERE object_id = OBJECT_ID('kunden') AND name LIKE 'idx%'
ORDER BY name;
-- name
-- idx_kunden_name
`),
        note: 'Indexnamen gelten pro Tabelle. `IF EXISTS` seit SQL Server 2016. Alte Schreibweise: `DROP INDEX tabelle.name`.',
        mdn: MS + 'statements/drop-index-transact-sql'
      },
      sqlite: {
        syntax: 'DROP INDEX [IF EXISTS] name;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT);
CREATE INDEX idx_kunden_stadt ON kunden (stadt);
CREATE INDEX idx_kunden_name ON kunden (name);

DROP INDEX idx_kunden_stadt;
DROP INDEX IF EXISTS idx_gibt_es_nicht;

SELECT name FROM sqlite_schema WHERE type = 'index' ORDER BY name;
-- name
-- idx_kunden_name
`),
        mdn: SL + 'lang_dropindex.html'
      }
    },
    tip: 'Vor dem Löschen prüfen, ob der Index nicht doch selten, aber kritisch genutzt wird (z. B. von einem nächtlichen Bericht).',
    keywords: ['index löschen', 'drop index', 'index entfernen'],
    related: ['CREATE INDEX', 'Wann Indizes helfen', 'sqlite_schema'],
    mdn: PG + 'sql-dropindex.html'
  },
  {
    lang: 'sql', group: 'Indizes', name: 'Wann Indizes helfen',
    desc: 'Indizes lohnen sich bei selektiven Filtern, Joins und Sortierungen großer Tabellen.',
    details: 'Ein Index hilft, wenn eine Abfrage nur einen kleinen Teil der Zeilen braucht (hohe Selektivität), bei Join-Spalten, bei `ORDER BY` mit Zeilenbegrenzung und bei `MIN()`/`MAX()`. Er hilft kaum bei kleinen Tabellen, bei Spalten mit wenigen verschiedenen Werten (z. B. Boolean) oder wenn ohnehin ein Großteil der Tabelle gelesen wird. Nicht nutzbar ist er, wenn die Spalte in eine Funktion verpackt ist oder ein `LIKE` mit `%` beginnt.',
    values: [
      ['Hilft', 'WHERE spalte = …, Bereiche, JOIN … ON, ORDER BY mit Zeilenlimit, MIN/MAX'],
      ['Hilft kaum', 'Kleine Tabellen, wenige verschiedene Werte, große Ergebnismengen'],
      ['Wird nicht genutzt', "Funktion um die Spalte, LIKE '%…', Typumwandlung der Spalte"],
      ['Kostet', 'Speicher und Zeit bei jedem INSERT, UPDATE, DELETE']
    ],
    dialects: {
      std: { none: 'Indizes und Ausführungspläne sind nicht Teil des ISO-Standards; ob ein Index genutzt wird, zeigt der Plan des jeweiligen Systems (siehe Dialekt-Tabs).' },
      pg: {
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 1, 100, '2026-01-05'), (2, 2, 80, '2026-02-10'), (3, 1, 50, '2026-03-15'), (4, 3, 20, '2026-04-20');
CREATE INDEX idx_bestellungen_datum ON bestellungen (datum);
SET enable_seqscan = off;   -- nur für die Demo

-- Neueste Bestellung: Index liefert die Sortierung gleich mit
-- (darunter: Index Scan Backward using idx_bestellungen_datum on bestellungen)
EXPLAIN (COSTS OFF) SELECT id, betrag FROM bestellungen ORDER BY datum DESC LIMIT 1;
-- QUERY PLAN
-- Limit
-- …

-- Spalte in Funktion verpackt: Index nutzlos, sogar trotz enable_seqscan = off
EXPLAIN (COSTS OFF) SELECT id FROM bestellungen WHERE EXTRACT(YEAR FROM datum) = 2026;
-- QUERY PLAN
-- Seq Scan on bestellungen
-- …
`),
        note: '`EXPLAIN (ANALYZE, BUFFERS)` zeigt die tatsächlichen Zeiten und gelesenen Seiten. Kleine Tabellen liest PostgreSQL bewusst komplett (`Seq Scan`).',
        mdn: PG + 'indexes.html'
      },
      mysql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 1, 100, '2026-01-05'), (2, 2, 80, '2026-02-10'), (3, 1, 50, '2026-03-15'), (4, 3, 20, '2026-04-20');
CREATE INDEX idx_bestellungen_datum ON bestellungen (datum);

-- Neueste Bestellung: Index liefert die Sortierung gleich mit
SELECT id, betrag FROM bestellungen ORDER BY datum DESC LIMIT 1;
-- id | betrag
-- 4  | 20.00

-- Plan prüfen: Spalte type (ALL = ganze Tabelle, ref/range = Index), key, rows
EXPLAIN SELECT id FROM bestellungen WHERE YEAR(datum) = 2026;
`),
        note: 'Im `EXPLAIN` bedeutet `type = ALL` einen Full Table Scan; `key` nennt den genutzten Index. `EXPLAIN FORMAT=TREE` zeigt den Plan als Baum.',
        mdn: MY + 'explain-output.html'
      },
      mssql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 1, 100, '2026-01-05'), (2, 2, 80, '2026-02-10'), (3, 1, 50, '2026-03-15'), (4, 3, 20, '2026-04-20');
CREATE INDEX idx_bestellungen_datum ON bestellungen (datum);

-- Neueste Bestellung: Index liefert die Sortierung gleich mit
SELECT TOP 1 id, betrag FROM bestellungen ORDER BY datum DESC;
-- id | betrag
-- 4  | 20.00

-- Fehlende Indizes schlägt SQL Server selbst vor:
SELECT COUNT(*) AS vorschlaege FROM sys.dm_db_missing_index_details WHERE database_id = DB_ID();
-- vorschlaege
-- 0
`),
        note: 'Den Plan zeigt SSMS mit „Tatsächlichen Ausführungsplan einschließen“ (Strg+M): „Index Seek“ ist gezielt, „Table/Index Scan“ liest alles. `sys.dm_db_missing_index_details` sammelt Indexvorschläge.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/performance/display-an-actual-execution-plan'
      },
      sqlite: {
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC, datum TEXT);
INSERT INTO bestellungen (kunde_id, betrag, datum) VALUES
  (1, 100, '2026-01-05'), (2, 80, '2026-02-10'), (1, 50, '2026-03-15'), (3, 20, '2026-04-20');
CREATE INDEX idx_bestellungen_datum ON bestellungen (datum);

-- Neueste Bestellung: Index liefert die Sortierung gleich mit
EXPLAIN QUERY PLAN SELECT id, betrag FROM bestellungen ORDER BY datum DESC LIMIT 1;
-- id | parent | notused | detail
-- 5  | 0      | 225     | SCAN bestellungen USING INDEX idx_bestellungen_datum

-- Spalte in Funktion verpackt: Index nutzlos, volle Tabelle
EXPLAIN QUERY PLAN SELECT id, betrag FROM bestellungen WHERE SUBSTR(datum, 1, 4) = '2026';
-- id | parent | notused | detail
-- 2  | 0      | 216     | SCAN bestellungen
`),
        mdn: SL + 'eqp.html'
      }
    },
    tip: 'Nicht raten, messen: den Ausführungsplan vor und nach dem Anlegen eines Index vergleichen.',
    keywords: ['index sinnvoll', 'selektivität', 'performance', 'wann index', 'langsame abfrage', 'tuning'],
    related: ['CREATE INDEX', 'Sargierbare Bedingungen', 'EXPLAIN'],
    mdn: PG + 'indexes.html'
  },

  // ---------------- Abfrageoptimierung ----------------
  {
    lang: 'sql', group: 'Abfrageoptimierung', name: 'EXPLAIN',
    desc: 'Zeigt den Ausführungsplan, den der Optimierer für eine Abfrage gewählt hat.',
    details: 'Der Plan verrät, ob Indizes benutzt werden oder die ganze Tabelle gelesen wird, in welcher Reihenfolge und mit welchem Verfahren Tabellen verknüpft werden und welche Kosten und Zeilenzahlen der Optimierer schätzt. Die Abfrage selbst wird dabei nicht ausgeführt. Ausgabe und Syntax sind in jedem System anders.',
    dialects: {
      std: { none: 'Nicht im ISO-Standard. Fast alle Systeme kennen `EXPLAIN abfrage`, SQL Server nutzt `SET SHOWPLAN_TEXT ON` bzw. den grafischen Plan.' },
      pg: {
        syntax: 'EXPLAIN [(ANALYZE, BUFFERS, COSTS OFF, FORMAT JSON …)] abfrage;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC(10,2));
INSERT INTO bestellungen SELECT g, g % 100, g * 1.5 FROM generate_series(1, 10000) AS g;
CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);
ANALYZE bestellungen;

-- Ohne COSTS OFF steht hinter jedem Schritt z. B. (cost=5.06..63.63 rows=100 width=14)
EXPLAIN (COSTS OFF) SELECT * FROM bestellungen WHERE kunde_id = 42;
-- QUERY PLAN
-- Bitmap Heap Scan on bestellungen
-- …

EXPLAIN (COSTS OFF) SELECT * FROM bestellungen WHERE betrag > 100;
-- QUERY PLAN
-- Seq Scan on bestellungen
-- …
`),
        note: 'Wichtige Knoten: `Seq Scan` (ganze Tabelle), `Index Scan`, `Bitmap Heap Scan` (viele Treffer über Index), `Hash Join`, `Nested Loop`. `cost=Start..Gesamt` ist eine relative Schätzung, keine Zeit.',
        mdn: PG + 'sql-explain.html'
      },
      mysql: {
        syntax: 'EXPLAIN [FORMAT = TRADITIONAL | TREE | JSON] abfrage;',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO bestellungen
WITH RECURSIVE z (n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM z WHERE n < 1000)
SELECT n, n % 100, n * 1.5 FROM z;
CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);
ANALYZE TABLE bestellungen;

EXPLAIN SELECT * FROM bestellungen WHERE kunde_id = 42;
-- id | select_type | table        | partitions | type | possible_keys          | key                    | key_len | ref   | rows | filtered | Extra
-- 1  | SIMPLE      | bestellungen | NULL       | ref  | idx_bestellungen_kunde | idx_bestellungen_kunde | 5       | const | 10   | 100.0    | NULL

-- Als Baum: EXPLAIN FORMAT=TREE SELECT * FROM bestellungen WHERE betrag > 100;
--   -> Filter: (bestellungen.betrag > 100.00)  (cost=101 rows=333)
--       -> Table scan on bestellungen  (cost=101 rows=1000)
`),
        note: 'Wichtige Spalten: `type` (`ALL` = ganze Tabelle, `ref`/`range`/`eq_ref` = über Index), `key` (genutzter Index), `rows` (geschätzte Zeilen), `Extra` (`Using filesort`, `Using index`).',
        mdn: MY + 'explain.html'
      },
      mssql: {
        syntax: 'SET SHOWPLAN_TEXT ON;   -- eigener Batch\nGO\nabfrage;\nGO\nSET SHOWPLAN_TEXT OFF;',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
WITH z (n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM z WHERE n < 1000)
INSERT INTO bestellungen SELECT n, n % 100, n * 1.5 FROM z OPTION (MAXRECURSION 1000);
CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);
GO

SET SHOWPLAN_TEXT ON;
GO
-- Abfragen werden jetzt nicht ausgeführt, nur der Plan wird geliefert
SELECT id, kunde_id FROM bestellungen WHERE kunde_id = 42;
--   Index Seek(OBJECT:(…[idx_bestellungen_kunde]), SEEK:(…[kunde_id]=…) ORDERED FORWARD)
SELECT * FROM bestellungen WHERE kunde_id = 42;
--   Clustered Index Scan(OBJECT:(…[PK__bestellu…]), WHERE:(…[kunde_id]=(42)))
GO
SET SHOWPLAN_TEXT OFF;
GO
`),
        note: 'Üblicher ist der grafische Plan in SSMS: „Geschätzten Ausführungsplan anzeigen“ (Strg+L). `SET SHOWPLAN_XML ON` liefert den Plan als XML.',
        mdn: MS + 'statements/set-showplan-text-transact-sql'
      },
      sqlite: {
        syntax: 'EXPLAIN QUERY PLAN abfrage;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC);
CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);

EXPLAIN QUERY PLAN SELECT * FROM bestellungen WHERE kunde_id = 42;
-- id | parent | notused | detail
-- 3  | 0      | 62      | SEARCH bestellungen USING INDEX idx_bestellungen_kunde (kunde_id=?)

EXPLAIN QUERY PLAN SELECT * FROM bestellungen WHERE betrag > 100;
-- id | parent | notused | detail
-- 2  | 0      | 216     | SCAN bestellungen
`),
        note: 'Ein bloßes `EXPLAIN` zeigt in SQLite den Bytecode der virtuellen Maschine; den lesbaren Plan liefert `EXPLAIN QUERY PLAN`.',
        mdn: SL + 'eqp.html'
      }
    },
    tip: 'Ein voller Tabellenscan ist nicht automatisch schlecht: Bei kleinen Tabellen oder großen Ergebnismengen ist er schneller als ein Index.',
    keywords: ['ausführungsplan', 'query plan', 'execution plan', 'abfrageplan', 'seq scan', 'index scan', 'performance', 'showplan'],
    related: ['EXPLAIN ANALYZE', 'EXPLAIN QUERY PLAN (SQLite)', 'Wann Indizes helfen'],
    mdn: PG + 'sql-explain.html'
  },
  {
    lang: 'sql', group: 'Abfrageoptimierung', name: 'EXPLAIN ANALYZE',
    desc: 'Führt die Abfrage wirklich aus und zeigt geschätzte und tatsächliche Zeiten und Zeilen.',
    details: 'Neben dem Plan liefert die Datenbank pro Schritt die gemessene Laufzeit, die tatsächliche Zeilenzahl und die Anzahl der Durchläufe. Große Abweichungen zwischen geschätzten und tatsächlichen Zeilen deuten auf veraltete Statistiken hin. Achtung: Die Anweisung wird ausgeführt – bei `UPDATE` oder `DELETE` also in eine Transaktion mit `ROLLBACK` packen.',
    values: [
      ['actual time=a..b', 'Zeit bis zur ersten bzw. letzten Zeile in ms'],
      ['rows', 'Geschätzte vs. tatsächliche Zeilen'],
      ['loops', 'Wie oft der Schritt ausgeführt wurde']
    ],
    dialects: {
      std: { none: 'Nicht im ISO-Standard. PostgreSQL und MySQL kennen `EXPLAIN ANALYZE`, SQL Server misst mit `SET STATISTICS TIME, IO ON` bzw. dem tatsächlichen Plan.' },
      pg: {
        syntax: 'EXPLAIN ANALYZE abfrage;\nEXPLAIN (ANALYZE, BUFFERS) abfrage;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC(10,2), datum DATE);
INSERT INTO bestellungen
SELECT g, g % 100, g * 1.5, DATE '2019-01-01' + g FROM generate_series(1, 10000) AS g;

-- Ausgabe z. B.:
--   HashAggregate  (cost=206.00..207.25 rows=100 width=36) (actual time=1.5..1.5 rows=100 loops=1)
--     ->  Seq Scan on bestellungen  (…) (actual time=0.03..0.37 rows=10000 loops=1)
--   Execution Time: 1.530 ms
EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, BUFFERS OFF, SUMMARY OFF)
SELECT kunde_id, SUM(betrag) AS summe FROM bestellungen GROUP BY kunde_id;
-- QUERY PLAN
-- HashAggregate (actual rows=100.00 loops=1)
-- …

-- Änderungen nur testweise messen: ROLLBACK nimmt das DELETE zurück
BEGIN;
EXPLAIN ANALYZE DELETE FROM bestellungen WHERE datum < '2020-01-01';
ROLLBACK;
`),
        note: 'Seit PostgreSQL 18 enthält `ANALYZE` automatisch die `BUFFERS`-Angaben (Seiten aus Cache = `shared hit`, von Platte = `read`). Tools wie explain.depesz.com machen lange Pläne lesbarer.',
        mdn: PG + 'using-explain.html'
      },
      mysql: {
        syntax: 'EXPLAIN ANALYZE abfrage;',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
INSERT INTO bestellungen
WITH RECURSIVE z (n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM z WHERE n < 1000)
SELECT n, n % 100, n * 1.5 FROM z;
CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);

EXPLAIN ANALYZE
SELECT kunde_id, SUM(betrag) AS summe FROM bestellungen GROUP BY kunde_id;
-- Ausgabe (eine Zelle, als Baum), z. B.:
--   -> Group aggregate: sum(bestellungen.betrag)  (cost=201 rows=100) (actual time=0.48..0.90 rows=100 loops=1)
--       -> Index scan on bestellungen using idx_bestellungen_kunde  (cost=101 rows=1000) (actual time=0.18..0.54 rows=1000 loops=1)
`),
        note: 'Seit 8.0.18; liefert immer das Baumformat. Für `UPDATE`/`DELETE` erst seit 8.0.21 bzw. nur für `SELECT` und mehrere Tabellen – im Zweifel die Abfrage als `SELECT` nachbauen.',
        mdn: MY + 'explain.html'
      },
      mssql: {
        syntax: 'SET STATISTICS TIME, IO ON;\nabfrage;\nSET STATISTICS TIME, IO OFF;',
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, kunde_id INT, betrag DECIMAL(10,2));
WITH z (n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM z WHERE n < 1000)
INSERT INTO bestellungen SELECT n, n % 100, n * 1.5 FROM z OPTION (MAXRECURSION 1000);

SET STATISTICS TIME, IO ON;
SELECT COUNT(*) AS anzahl, SUM(betrag) AS summe FROM bestellungen WHERE kunde_id = 42;
-- anzahl | summe
-- 10     | 7380.00
SET STATISTICS TIME, IO OFF;

-- Im Meldungen-Tab, z. B.:
--   Table 'bestellungen'. Scan count 1, logical reads 5, physical reads 0, …
--   SQL Server Execution Times: CPU time = 0 ms, elapsed time = 0 ms.
`),
        note: 'Kein `EXPLAIN ANALYZE`. In SSMS zeigt „Tatsächlichen Ausführungsplan einschließen“ (Strg+M) geschätzte und tatsächliche Zeilen je Operator; `SET STATISTICS XML ON` liefert ihn als XML.',
        mdn: MS + 'statements/set-statistics-io-transact-sql'
      },
      sqlite: { none: 'Kein `EXPLAIN ANALYZE`. Den Plan zeigt `EXPLAIN QUERY PLAN`; im Kommandozeilenwerkzeug misst `.timer on` die Laufzeit jeder Anweisung.' }
    },
    tip: 'Erst `EXPLAIN` lesen, dann gezielt mit `EXPLAIN ANALYZE` messen – und dabei immer mit realistischen Datenmengen testen.',
    keywords: ['laufzeit messen', 'actual time', 'profiling', 'explain analyse', 'buffers', 'tatsächlicher plan', 'statistics io'],
    related: ['EXPLAIN', 'ANALYZE (Statistiken)', 'ROLLBACK'],
    mdn: PG + 'using-explain.html'
  },
  {
    lang: 'sql', group: 'Abfrageoptimierung', name: 'EXPLAIN QUERY PLAN (SQLite)',
    desc: 'Zeigt in SQLite, wie eine Abfrage ausgeführt wird: SCAN oder SEARCH mit Index.',
    details: 'Jede Zeile beschreibt einen Schritt; wichtig ist die Spalte `detail`. `SCAN tabelle` bedeutet, dass die ganze Tabelle gelesen wird, `SEARCH tabelle USING INDEX …` einen gezielten Zugriff über einen Index. `USE TEMP B-TREE FOR ORDER BY` zeigt eine zusätzliche Sortierung, `COVERING INDEX` einen Zugriff nur über den Index. Die Zahlen in `id`, `parent` und `notused` sind interne Nummern.',
    values: [
      ['SCAN t', 'Ganze Tabelle lesen'],
      ['SEARCH t USING INDEX i (a=?)', 'Gezielter Zugriff über Index'],
      ['USING COVERING INDEX', 'Antwort kommt allein aus dem Index'],
      ['USING INTEGER PRIMARY KEY', 'Zugriff über die rowid'],
      ['USE TEMP B-TREE FOR ORDER BY', 'Zusätzliche Sortierung nötig']
    ],
    dialects: {
      std: { none: 'SQLite-spezifisch; Ausführungspläne sind nicht Teil des ISO-Standards.' },
      pg: { none: 'Entspricht `EXPLAIN abfrage` (siehe EXPLAIN).' },
      mysql: { none: 'Entspricht `EXPLAIN abfrage` bzw. `EXPLAIN FORMAT=TREE abfrage` (siehe EXPLAIN).' },
      mssql: { none: 'Entspricht `SET SHOWPLAN_TEXT ON` bzw. dem grafischen Plan in SSMS (siehe EXPLAIN).' },
      sqlite: {
        syntax: 'EXPLAIN QUERY PLAN abfrage;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT);
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, kunde_id INTEGER, betrag NUMERIC);
CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);

EXPLAIN QUERY PLAN
SELECT k.name, b.betrag
FROM kunden k JOIN bestellungen b ON b.kunde_id = k.id
WHERE k.stadt = 'Berlin'
ORDER BY k.name;
-- id | parent | notused | detail
-- 4  | 0      | 216     | SCAN b
-- 6  | 0      | 45      | SEARCH k USING INTEGER PRIMARY KEY (rowid=?)
-- 16 | 0      | 0       | USE TEMP B-TREE FOR ORDER BY
`),
        note: 'Im Kommandozeilenwerkzeug `sqlite3` schaltet `.eqp on` die Planausgabe für jede folgende Abfrage automatisch ein.',
        mdn: SL + 'eqp.html'
      }
    },
    tip: 'Ohne Statistiken (`ANALYZE`) rät SQLite die Join-Reihenfolge; nach `ANALYZE` kann der Plan anders aussehen.',
    keywords: ['eqp', 'query plan', 'sqlite plan', 'scan', 'search', 'index benutzt', 'ausführungsplan'],
    related: ['EXPLAIN', 'CREATE INDEX', 'Covering Index'],
    mdn: SL + 'eqp.html'
  },
  {
    lang: 'sql', group: 'Abfrageoptimierung', name: 'Sargierbare Bedingungen',
    desc: 'Bedingungen, die so formuliert sind, dass die Datenbank einen Index nutzen kann.',
    details: '„Sargable“ (Search ARGument ABLE) heißt: Die indizierte Spalte steht unverändert auf einer Seite des Vergleichs. Funktionen oder Rechnungen auf der Spalte (`EXTRACT(YEAR FROM datum) = 2026`, `preis * 1.19 > 100`, `LOWER(name) = …`) verhindern die Indexnutzung, weil der Index die rohen Werte sortiert. Die Lösung ist, den Ausdruck auf die andere Seite zu bringen oder einen Ausdrucksindex anzulegen. Auch `LIKE \'%text\'` mit führendem Platzhalter ist nicht sargierbar.',
    values: [
      ['EXTRACT(YEAR FROM datum) = 2026', "datum >= '2026-01-01' AND datum < '2027-01-01'"],
      ['preis * 1.19 > 119', 'preis > 100'],
      ["SUBSTRING(plz FROM 1 FOR 2) = '10'", "plz LIKE '10%'"],
      ['COALESCE(status, 0) = 1', 'status = 1'],
      ["LOWER(name) = 'x'", 'Ausdrucksindex auf LOWER(name)']
    ],
    dialects: {
      std: {
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 100, '2025-12-30'), (2, 80, '2026-01-15'), (3, 50, '2026-06-01'), (4, 20, '2027-02-01');

-- Nicht sargierbar: Funktion auf der Spalte, ein Index auf datum hilft nicht
SELECT id, betrag FROM bestellungen WHERE EXTRACT(YEAR FROM datum) = 2026 ORDER BY id;
-- id | betrag
-- 2  | 80.00
-- 3  | 50.00

-- Sargierbar: Bereich auf der rohen Spalte, gleiches Ergebnis
SELECT id, betrag FROM bestellungen
WHERE datum >= DATE '2026-01-01' AND datum < DATE '2027-01-01'
ORDER BY id;
-- id | betrag
-- 2  | 80.00
-- 3  | 50.00
`)
      },
      pg: {
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, betrag NUMERIC(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 100, '2025-12-30'), (2, 80, '2026-01-15'), (3, 50, '2026-06-01'), (4, 20, '2027-02-01');
CREATE INDEX idx_bestellungen_datum ON bestellungen (datum);
SET enable_seqscan = off;   -- nur für die Demo

-- Nicht sargierbar: trotz Index ein voller Scan
EXPLAIN (COSTS OFF) SELECT id FROM bestellungen WHERE EXTRACT(YEAR FROM datum) = 2026;
-- QUERY PLAN
-- Seq Scan on bestellungen
-- …

-- Sargierbar: Bereich auf der rohen Spalte
EXPLAIN (COSTS OFF) SELECT id FROM bestellungen
WHERE datum >= '2026-01-01' AND datum < '2027-01-01';
-- QUERY PLAN
-- Index Scan using idx_bestellungen_datum on bestellungen
-- …
`),
        note: 'Typumwandlungen der Spalte (`datum::text LIKE \'2026%\'`) verhindern die Indexnutzung ebenso wie Funktionen.',
        mdn: PG + 'indexes-expressional.html'
      },
      mysql: { note: 'Häufig gesehen: `YEAR(datum) = 2026` oder `DATE(zeitpunkt) = \'2026-03-01\'` – beide nicht sargierbar. Gleicher Fallstrick bei Vergleichen von Textspalten mit Zahlen (implizite Umwandlung der Spalte).', mdn: MY + 'range-optimization.html' },
      mssql: {
        example: e(`
CREATE TABLE bestellungen (id INT PRIMARY KEY, betrag DECIMAL(10,2), datum DATE);
INSERT INTO bestellungen VALUES
  (1, 100, '2025-12-30'), (2, 80, '2026-01-15'), (3, 50, '2026-06-01'), (4, 20, '2027-02-01');
CREATE INDEX idx_bestellungen_datum ON bestellungen (datum);

-- Nicht sargierbar: Index Scan über alle Einträge
SELECT id, betrag FROM bestellungen WHERE YEAR(datum) = 2026 ORDER BY id;
-- id | betrag
-- 2  | 80.00
-- 3  | 50.00

-- Sargierbar: Index Seek auf den Bereich
SELECT id, betrag FROM bestellungen
WHERE datum >= '2026-01-01' AND datum < '2027-01-01'
ORDER BY id;
-- id | betrag
-- 2  | 80.00
-- 3  | 50.00
`),
        note: 'Kein `EXTRACT`; man schreibt `YEAR(datum)` bzw. `DATEPART(year, datum)` – beide nicht sargierbar. Eine Ausnahme ist `CAST(zeitpunkt AS DATE) = …`, das SQL Server noch als Bereich nutzen kann.',
        mdn: MS + 'functions/year-transact-sql'
      },
      sqlite: {
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, betrag NUMERIC, datum TEXT);
INSERT INTO bestellungen (betrag, datum) VALUES
  (100, '2025-12-30'), (80, '2026-01-15'), (50, '2026-06-01'), (20, '2027-02-01');
CREATE INDEX idx_bestellungen_datum ON bestellungen (datum);

-- Nicht sargierbar: Funktion auf der Spalte
EXPLAIN QUERY PLAN SELECT id, betrag FROM bestellungen WHERE SUBSTR(datum, 1, 4) = '2026';
-- id | parent | notused | detail
-- 2  | 0      | 216     | SCAN bestellungen

-- Sargierbar: Bereich auf der rohen Spalte
EXPLAIN QUERY PLAN SELECT id, betrag FROM bestellungen
WHERE datum >= '2026-01-01' AND datum < '2027-01-01';
-- id | parent | notused | detail
-- 3  | 0      | 166     | SEARCH bestellungen USING INDEX idx_bestellungen_datum (datum>? AND datum<?)

SELECT id, betrag FROM bestellungen
WHERE datum >= '2026-01-01' AND datum < '2027-01-01' ORDER BY id;
-- id | betrag
-- 2  | 80
-- 3  | 50
`),
        note: 'Datumswerte sind Text (`YYYY-MM-DD`); `strftime(\'%Y\', datum) = \'2026\'` ist genauso wenig sargierbar wie `SUBSTR`.',
        mdn: SL + 'optoverview.html'
      }
    },
    tip: 'Halboffene Bereiche (`>= Anfang AND < Ende`) statt `BETWEEN` verwenden: Sie funktionieren auch mit Uhrzeitanteilen korrekt.',
    keywords: ['sargable', 'index nutzen', 'funktion auf spalte', 'search argument', 'optimierung', 'where umschreiben'],
    related: ['Ausdrucksindex', 'Wann Indizes helfen', 'Datumsbereich filtern'],
    mdn: PG + 'indexes-expressional.html'
  },
  {
    lang: 'sql', group: 'Abfrageoptimierung', name: 'ANALYZE (Statistiken)',
    desc: 'Sammelt Statistiken über die Datenverteilung, auf denen der Optimierer seine Pläne aufbaut.',
    details: 'Der Optimierer schätzt anhand von Statistiken (Zeilenzahl, Anzahl verschiedener Werte, Häufigkeiten), wie viele Zeilen eine Bedingung liefert, und wählt danach Index oder Full Scan. Nach großen Datenänderungen sind die Statistiken veraltet und die Pläne schlecht. Die meisten Systeme aktualisieren sie automatisch, ein manueller Aufruf hilft nach Massenimporten.',
    dialects: {
      std: { none: 'Nicht im ISO-Standard. PostgreSQL und SQLite: `ANALYZE`, MySQL: `ANALYZE TABLE`, SQL Server: `UPDATE STATISTICS`.' },
      pg: {
        syntax: 'ANALYZE [tabelle [(spalte, …)]];\nVACUUM ANALYZE [tabelle];',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name TEXT, abteilung TEXT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT'), (2, 'Lin', 'IT'), (3, 'Tom', 'Vertrieb'), (4, 'Eva', 'Vertrieb'), (5, 'Max', 'IT');

ANALYZE mitarbeiter;

SELECT reltuples AS zeilen FROM pg_class WHERE relname = 'mitarbeiter';
-- zeilen
-- 5

SELECT attname, n_distinct, most_common_vals
FROM pg_stats WHERE tablename = 'mitarbeiter' AND attname = 'abteilung';
-- attname   | n_distinct | most_common_vals
-- abteilung | -0.4       | {IT,Vertrieb}
`),
        note: 'Autovacuum aktualisiert die Statistiken meist selbst. `n_distinct` negativ heißt: Anteil an der Zeilenzahl (hier 40 % → 2 Werte).',
        mdn: PG + 'sql-analyze.html'
      },
      mysql: {
        syntax: 'ANALYZE TABLE tabelle [, …];',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30));
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT'), (2, 'Lin', 'IT'), (3, 'Tom', 'Vertrieb'), (4, 'Eva', 'Vertrieb'), (5, 'Max', 'IT');
CREATE INDEX idx_mitarbeiter_abteilung ON mitarbeiter (abteilung);

ANALYZE TABLE mitarbeiter;

SELECT index_name, cardinality
FROM information_schema.statistics
WHERE table_schema = DATABASE() AND table_name = 'mitarbeiter'
ORDER BY index_name;
-- index_name                | cardinality
-- idx_mitarbeiter_abteilung | 2
-- PRIMARY                   | 5
`),
        note: 'InnoDB schätzt die Statistiken über Stichproben; `cardinality` ist die geschätzte Anzahl verschiedener Werte. Histogramme für Spalten ohne Index: `ANALYZE TABLE t UPDATE HISTOGRAM ON spalte`.',
        mdn: MY + 'analyze-table.html'
      },
      mssql: {
        syntax: 'UPDATE STATISTICS tabelle [index] [WITH FULLSCAN];',
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), abteilung NVARCHAR(30));
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT'), (2, 'Lin', 'IT'), (3, 'Tom', 'Vertrieb'), (4, 'Eva', 'Vertrieb'), (5, 'Max', 'IT');
CREATE INDEX idx_mitarbeiter_abteilung ON mitarbeiter (abteilung);

UPDATE STATISTICS mitarbeiter WITH FULLSCAN;

SELECT s.name AS statistik, p.rows AS zeilen
FROM sys.stats s
CROSS APPLY sys.dm_db_stats_properties(s.object_id, s.stats_id) p
WHERE s.object_id = OBJECT_ID('mitarbeiter') AND s.name LIKE 'idx%';
-- statistik                 | zeilen
-- idx_mitarbeiter_abteilung | 5
`),
        note: 'Jeder Index hat ein Statistikobjekt; Spaltenstatistiken legt SQL Server bei Bedarf automatisch an. Für die ganze Datenbank: `EXEC sp_updatestats;`.',
        mdn: MS + 'statements/update-statistics-transact-sql'
      },
      sqlite: {
        syntax: 'ANALYZE [tabelle];\nPRAGMA optimize;',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name TEXT, abteilung TEXT);
INSERT INTO mitarbeiter (name, abteilung) VALUES
  ('Ada', 'IT'), ('Lin', 'IT'), ('Tom', 'Vertrieb'), ('Eva', 'Vertrieb'), ('Max', 'IT');
CREATE INDEX idx_mitarbeiter_abteilung ON mitarbeiter (abteilung);

ANALYZE;

-- stat: 5 Zeilen, im Schnitt ca. 3 Zeilen pro Abteilungswert
SELECT tbl, idx, stat FROM sqlite_stat1 ORDER BY tbl, idx;
-- tbl         | idx                       | stat
-- mitarbeiter | idx_mitarbeiter_abteilung | 5 3
`),
        note: 'Statistiken landen in der Tabelle `sqlite_stat1`. Empfohlen ist `PRAGMA optimize;` vor dem Schließen langlebiger Verbindungen.',
        mdn: SL + 'lang_analyze.html'
      }
    },
    tip: 'Nach dem Import großer Datenmengen immer die Statistiken aktualisieren, bevor die ersten Abfragen laufen.',
    keywords: ['statistiken', 'statistics', 'optimierer', 'analyze table', 'update statistics', 'vacuum', 'sqlite_stat1', 'cardinality'],
    related: ['EXPLAIN ANALYZE', 'EXPLAIN', 'CREATE INDEX'],
    mdn: PG + 'sql-analyze.html'
  },
  {
    lang: 'sql', group: 'Abfrageoptimierung', name: 'N+1-Problem',
    desc: 'Eine Abfrage für die Liste plus je eine weitere pro Zeile – statt einer einzigen Abfrage.',
    details: 'Typisch für ORMs und Schleifen im Anwendungscode: Erst werden N Kunden geladen, dann für jeden Kunden einzeln seine Bestellungen. Das ergibt N+1 Roundtrips zur Datenbank und ist bei vielen Zeilen extrem langsam, obwohl jede Einzelabfrage schnell ist. Abhilfe schafft ein Join mit Aggregation, eine einzige Abfrage mit `IN (…)` oder im ORM „Eager Loading“.',
    dialects: {
      std: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50));
CREATE TABLE bestellungen (
  id       INTEGER PRIMARY KEY,
  kunde_id INTEGER,
  betrag   DECIMAL(10,2),
  FOREIGN KEY (kunde_id) REFERENCES kunden (id)
);
INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber');
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 1, 50), (3, 2, 80);

-- Schlecht (N+1): erst alle Kunden ...
--   SELECT id, name FROM kunden;
-- ... dann im Code pro Kunde eine eigene Abfrage:
--   SELECT betrag FROM bestellungen WHERE kunde_id = ?;

-- Besser: eine Abfrage für alles
SELECT k.name, COUNT(b.id) AS anzahl, COALESCE(SUM(b.betrag), 0) AS summe
FROM kunden k LEFT JOIN bestellungen b ON b.kunde_id = k.id
GROUP BY k.id, k.name
ORDER BY k.name;
-- name    | anzahl | summe
-- Müller  | 2      | 150.00
-- Schmidt | 1      | 80.00
-- Weber   | 0      | 0
`)
      }
    },
    tip: 'Das Abfrage-Log des ORMs einschalten: Viele fast identische Abfragen hintereinander sind das typische Erkennungszeichen.',
    keywords: ['n+1', 'n plus 1', 'orm', 'eager loading', 'lazy loading', 'viele abfragen', 'roundtrips'],
    related: ['LEFT JOIN', 'ORM', 'GROUP BY'],
    mdn: PG + 'queries-table-expressions.html'
  },
  {
    lang: 'sql', group: 'Abfrageoptimierung', name: 'SELECT * vermeiden',
    desc: 'Nur die benötigten Spalten abfragen statt mit * alle.',
    details: '`SELECT *` überträgt unnötige Daten (z. B. große Text- oder BLOB-Spalten), verhindert Covering-Index-Zugriffe und macht Code fragil: Neue oder umsortierte Spalten verändern still das Ergebnis, und in Joins kommen doppelte Spaltennamen heraus. Für schnelle Ad-hoc-Abfragen ist `*` in Ordnung, in Anwendungscode und Views sollten die Spalten benannt sein. Unproblematisch ist `*` in `EXISTS (SELECT * …)` und `COUNT(*)`.',
    dialects: {
      std: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50), notizen VARCHAR(2000));
INSERT INTO kunden VALUES
  (1, 'Müller', 'Berlin', 'sehr langer Text …'), (2, 'Schmidt', 'Köln', NULL), (3, 'Weber', 'Berlin', NULL);

-- Schlecht: holt auch die große Spalte notizen und ändert sich mit jeder neuen Spalte
--   SELECT * FROM kunden WHERE stadt = 'Berlin';

-- Besser: nur die benötigten Spalten
SELECT id, name FROM kunden WHERE stadt = 'Berlin' ORDER BY name;
-- id | name
-- 1  | Müller
-- 3  | Weber
`)
      },
      pg: { note: 'Views mit `SELECT *` frieren die Spaltenliste beim Anlegen ein; später hinzugefügte Spalten fehlen in der View.' },
      mssql: { note: 'Auch hier frieren Views mit `*` die Spaltenliste ein; `sp_refreshview` aktualisiert sie.' },
      sqlite: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT, notizen TEXT);
INSERT INTO kunden (name, stadt, notizen) VALUES
  ('Müller', 'Berlin', 'sehr langer Text …'), ('Schmidt', 'Köln', NULL), ('Weber', 'Berlin', NULL);
CREATE INDEX idx_kunden_stadt_name ON kunden (stadt, name);

-- Liest jede Zeile aus der Tabelle, inkl. großer Spalten
EXPLAIN QUERY PLAN SELECT * FROM kunden WHERE stadt = 'Berlin';
-- id | parent | notused | detail
-- 3  | 0      | 62      | SEARCH kunden USING INDEX idx_kunden_stadt_name (stadt=?)

-- Nur benötigte Spalten: Antwort direkt aus dem Index
EXPLAIN QUERY PLAN SELECT name FROM kunden WHERE stadt = 'Berlin';
-- id | parent | notused | detail
-- 2  | 0      | 55      | SEARCH kunden USING COVERING INDEX idx_kunden_stadt_name (stadt=?)
`),
        note: 'Der Plan zeigt den Unterschied: Mit `*` muss SQLite zusätzlich jede Tabellenzeile lesen, mit benannten Spalten reicht der Index.'
      }
    },
    tip: 'Auch in Views keine `*` verwenden, sondern die Spalten ausdrücklich aufzählen.',
    keywords: ['select stern', 'select *', 'spalten auswählen', 'best practice', 'performance'],
    related: ['SELECT *', 'Covering Index', 'CREATE VIEW'],
    mdn: PG + 'queries-select-lists.html'
  },

  // ---------------- Views ----------------
  {
    lang: 'sql', group: 'Views', name: 'CREATE VIEW',
    desc: 'Speichert eine Abfrage unter einem Namen; sie lässt sich wie eine Tabelle abfragen.',
    details: 'Eine View enthält keine Daten, sondern nur die Abfrage; bei jedem Zugriff wird sie neu ausgewertet und ist daher immer aktuell. Views vereinfachen wiederkehrende Joins und Auswertungen und können Spalten oder Zeilen verbergen (z. B. für Rechtevergabe). Der Optimierer setzt die View-Definition meist direkt in die Abfrage ein, eine View kostet also kaum Leistung.',
    dialects: {
      std: {
        syntax: 'CREATE VIEW name [(spalte, …)] AS\nSELECT …;',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30), gehalt INTEGER);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Lin', 'IT', 4800), (3, 'Tom', 'Vertrieb', 3900),
  (4, 'Eva', 'Vertrieb', 4100), (5, 'Max', 'HR', 3600);

CREATE VIEW v_abteilung_gehalt AS
SELECT abteilung, COUNT(*) AS anzahl, AVG(gehalt) AS schnitt
FROM mitarbeiter
GROUP BY abteilung;

SELECT abteilung, anzahl, schnitt FROM v_abteilung_gehalt WHERE anzahl > 1 ORDER BY abteilung;
-- abteilung | anzahl | schnitt
-- IT        | 2      | 5000
-- Vertrieb  | 2      | 4000
`)
      },
      pg: { note: '`AVG` über Ganzzahlen liefert `NUMERIC` (`5000.0000000000000000`). Mit `CREATE TEMP VIEW` gibt es auch sitzungslokale Views.', mdn: PG + 'sql-createview.html' },
      mysql: { note: '`AVG` über Ganzzahlen liefert `DECIMAL` (`5000.0000`).', mdn: MY + 'create-view.html' },
      mssql: {
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), abteilung NVARCHAR(30), gehalt INT);
INSERT INTO mitarbeiter VALUES
  (1, 'Ada', 'IT', 5200), (2, 'Lin', 'IT', 4800), (3, 'Tom', 'Vertrieb', 3900),
  (4, 'Eva', 'Vertrieb', 4100), (5, 'Max', 'HR', 3600);
GO

CREATE VIEW v_abteilung_gehalt AS
SELECT abteilung, COUNT(*) AS anzahl, AVG(gehalt) AS schnitt
FROM mitarbeiter
GROUP BY abteilung;
GO

SELECT abteilung, anzahl, schnitt FROM v_abteilung_gehalt WHERE anzahl > 1 ORDER BY abteilung;
-- abteilung | anzahl | schnitt
-- IT        | 2      | 5000
-- Vertrieb  | 2      | 4000
`),
        note: '`CREATE VIEW` muss die erste Anweisung eines Batches sein – davor und danach `GO`. `ORDER BY` ist in Views nur mit `TOP` erlaubt. `AVG` über `INT` rechnet ganzzahlig.',
        mdn: MS + 'statements/create-view-transact-sql'
      },
      sqlite: { note: 'Views sind schreibgeschützt (außer mit `INSTEAD OF`-Triggern). `CREATE TEMP VIEW` legt eine View nur für die Verbindung an.', mdn: SL + 'lang_createview.html' }
    },
    tip: 'Ein Präfix wie `v_` macht Views im Schema sofort von Tabellen unterscheidbar.',
    keywords: ['view', 'sicht', 'ansicht', 'gespeicherte abfrage', 'virtuelle tabelle'],
    related: ['Views ändern & löschen', 'Aktualisierbare Views', 'Materialized View', 'WITH (CTE)'],
    mdn: PG + 'sql-createview.html'
  },
  {
    lang: 'sql', group: 'Views', name: 'Views ändern & löschen',
    desc: 'Ersetzt die Definition einer View oder löscht sie mit DROP VIEW.',
    details: 'Der ISO-Standard kennt nur `DROP VIEW` und erneutes `CREATE VIEW`; die meisten Systeme bieten zusätzlich eine Ersetzen-Variante. Das Löschen einer View berührt die Daten der zugrunde liegenden Tabellen nicht. Views, die auf der gelöschten View aufbauen, werden ungültig oder verhindern das Löschen.',
    dialects: {
      std: {
        syntax: 'DROP VIEW name [CASCADE | RESTRICT];\nCREATE VIEW name AS SELECT …;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Köln'), (3, 'Weber', 'Berlin');

CREATE VIEW v_kunden_berlin AS
SELECT id, name FROM kunden WHERE stadt = 'Berlin';

-- Definition ändern: löschen und neu anlegen
DROP VIEW v_kunden_berlin;
CREATE VIEW v_kunden_berlin AS
SELECT id, name, stadt FROM kunden WHERE stadt = 'Berlin';

SELECT name, stadt FROM v_kunden_berlin ORDER BY name;
-- name   | stadt
-- Müller | Berlin
-- Weber  | Berlin
`)
      },
      pg: {
        syntax: 'CREATE OR REPLACE VIEW name AS SELECT …;\nDROP VIEW [IF EXISTS] name [CASCADE];',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, stadt TEXT);
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Köln'), (3, 'Weber', 'Berlin');

CREATE VIEW v_kunden_berlin AS
SELECT id, name FROM kunden WHERE stadt = 'Berlin';

-- Ersetzen: neue Spalten nur hinten anhängen
CREATE OR REPLACE VIEW v_kunden_berlin AS
SELECT id, name, stadt FROM kunden WHERE stadt = 'Berlin';

SELECT name, stadt FROM v_kunden_berlin ORDER BY name;
-- name   | stadt
-- Müller | Berlin
-- Weber  | Berlin
`),
        note: '`CREATE OR REPLACE` darf Spalten nur hinten anhängen, nicht entfernen, umbenennen oder umtypen – dann hilft nur `DROP` und neu anlegen. `DROP VIEW … CASCADE` löscht abhängige Views mit.',
        mdn: PG + 'sql-createview.html'
      },
      mysql: {
        syntax: 'CREATE OR REPLACE VIEW name AS SELECT …;\nALTER VIEW name AS SELECT …;\nDROP VIEW [IF EXISTS] name;',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50), stadt VARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Köln'), (3, 'Weber', 'Berlin');

CREATE VIEW v_kunden_berlin AS
SELECT id, name FROM kunden WHERE stadt = 'Berlin';

CREATE OR REPLACE VIEW v_kunden_berlin AS
SELECT id, name, stadt FROM kunden WHERE stadt = 'Berlin';

SELECT name, stadt FROM v_kunden_berlin ORDER BY name;
-- name   | stadt
-- Müller | Berlin
-- Weber  | Berlin
`),
        note: 'Die neue Definition darf beliebig anders sein. Gelöschte Basistabellen machen Views ungültig, ohne dass MySQL das beim Löschen verhindert.',
        mdn: MY + 'create-view.html'
      },
      mssql: {
        syntax: 'CREATE OR ALTER VIEW name AS SELECT …;\nDROP VIEW [IF EXISTS] name;',
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50), stadt NVARCHAR(50));
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Köln'), (3, 'Weber', 'Berlin');
GO

CREATE VIEW v_kunden_berlin AS
SELECT id, name FROM kunden WHERE stadt = 'Berlin';
GO

CREATE OR ALTER VIEW v_kunden_berlin AS
SELECT id, name, stadt FROM kunden WHERE stadt = 'Berlin';
GO

SELECT name, stadt FROM v_kunden_berlin ORDER BY name;
-- name   | stadt
-- Müller | Berlin
-- Weber  | Berlin
`),
        note: '`CREATE OR ALTER` seit SQL Server 2016 SP1, davor `ALTER VIEW`. Jede `CREATE`/`ALTER VIEW`-Anweisung braucht einen eigenen Batch (`GO`).',
        mdn: MS + 'statements/alter-view-transact-sql'
      },
      sqlite: { note: 'Kein `CREATE OR REPLACE VIEW` und kein `ALTER VIEW` – immer `DROP VIEW [IF EXISTS]` und neu anlegen.', mdn: SL + 'lang_dropview.html' }
    },
    tip: 'View-Änderungen wie Tabellenänderungen behandeln: in Migrationen versionieren und abhängige Views mitdenken.',
    keywords: ['drop view', 'create or replace view', 'view ändern', 'view löschen', 'alter view', 'create or alter'],
    related: ['CREATE VIEW', 'Datenbank-Migrationen', 'DROP TABLE'],
    mdn: PG + 'sql-createview.html'
  },
  {
    lang: 'sql', group: 'Views', name: 'Aktualisierbare Views',
    desc: 'Views, über die man Zeilen der Basistabelle einfügen, ändern und löschen kann.',
    details: 'Einfache Views über genau eine Tabelle ohne `GROUP BY`, `DISTINCT`, Aggregate oder Joins sind automatisch aktualisierbar: Änderungen landen in der Basistabelle. `WITH CHECK OPTION` verhindert, dass über die View Zeilen entstehen, die die View selbst danach nicht mehr zeigen würde. Für komplexere Views legt man mit `INSTEAD OF`-Triggern fest, wohin geschrieben wird.',
    dialects: {
      std: {
        syntax: 'CREATE VIEW name AS SELECT … FROM tabelle WHERE …\nWITH [LOCAL | CASCADED] CHECK OPTION;',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50), abteilung VARCHAR(30), gehalt DECIMAL(10,2));
INSERT INTO mitarbeiter VALUES (1, 'Ada', 'IT', 5000), (2, 'Tom', 'Vertrieb', 3900);

CREATE VIEW v_it AS
SELECT id, name, abteilung, gehalt
FROM mitarbeiter
WHERE abteilung = 'IT'
WITH CHECK OPTION;

-- Ändert bzw. ergänzt Zeilen in der Tabelle mitarbeiter
UPDATE v_it SET gehalt = gehalt * 1.05 WHERE name = 'Ada';
INSERT INTO v_it (id, name, abteilung, gehalt) VALUES (3, 'Kim', 'IT', 4500);
-- INSERT INTO v_it (id, name, abteilung, gehalt) VALUES (4, 'Bob', 'HR', 3000);
--   → Fehler: neue Zeile verletzt die CHECK OPTION der View

SELECT name, abteilung, gehalt FROM mitarbeiter ORDER BY id;
-- name | abteilung | gehalt
-- Ada  | IT        | 5250.00
-- Tom  | Vertrieb  | 3900.00
-- Kim  | IT        | 4500.00
`)
      },
      pg: { note: 'Fehlermeldung: `new row violates check option for view "v_it"`. Für Views mit Joins `INSTEAD OF`-Trigger oder Regeln verwenden.', mdn: PG + 'sql-createview.html' },
      mysql: { note: 'Auch Views mit Joins sind teilweise aktualisierbar, solange jede Änderung nur eine Basistabelle betrifft.', mdn: MY + 'view-updatability.html' },
      mssql: {
        example: e(`
CREATE TABLE mitarbeiter (id INT PRIMARY KEY, name NVARCHAR(50), abteilung NVARCHAR(30), gehalt DECIMAL(10,2));
INSERT INTO mitarbeiter VALUES (1, 'Ada', 'IT', 5000), (2, 'Tom', 'Vertrieb', 3900);
GO

CREATE VIEW v_it AS
SELECT id, name, abteilung, gehalt
FROM mitarbeiter
WHERE abteilung = 'IT'
WITH CHECK OPTION;
GO

UPDATE v_it SET gehalt = gehalt * 1.05 WHERE name = 'Ada';
INSERT INTO v_it (id, name, abteilung, gehalt) VALUES (3, 'Kim', 'IT', 4500);
-- INSERT INTO v_it (id, name, abteilung, gehalt) VALUES (4, 'Bob', 'HR', 3000);
--   → Fehler: The attempted insert or update failed because the target view … specifies WITH CHECK OPTION

SELECT name, abteilung, gehalt FROM mitarbeiter ORDER BY id;
-- name | abteilung | gehalt
-- Ada  | IT        | 5250.00
-- Tom  | Vertrieb  | 3900.00
-- Kim  | IT        | 4500.00
`),
        note: 'Views mit Joins sind aktualisierbar, wenn jede Änderung nur eine Basistabelle betrifft; sonst `INSTEAD OF`-Trigger.',
        mdn: MS + 'statements/create-view-transact-sql'
      },
      sqlite: {
        syntax: 'CREATE TRIGGER name INSTEAD OF UPDATE ON view\nBEGIN\n  UPDATE tabelle SET … WHERE …;\nEND;',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name TEXT, abteilung TEXT, gehalt REAL);
INSERT INTO mitarbeiter VALUES (1, 'Ada', 'IT', 5000), (2, 'Tom', 'Vertrieb', 3900);

CREATE VIEW v_it AS
SELECT id, name, abteilung, gehalt FROM mitarbeiter WHERE abteilung = 'IT';

-- Views sind schreibgeschützt; ein INSTEAD-OF-Trigger leitet die Änderung um
CREATE TRIGGER trg_v_it_update INSTEAD OF UPDATE OF gehalt ON v_it
BEGIN
  UPDATE mitarbeiter SET gehalt = NEW.gehalt WHERE id = OLD.id;
END;

UPDATE v_it SET gehalt = gehalt * 1.05 WHERE name = 'Ada';

SELECT name, abteilung, gehalt FROM mitarbeiter ORDER BY id;
-- name | abteilung | gehalt
-- Ada  | IT        | 5250
-- Tom  | Vertrieb  | 3900
`),
        note: 'Views sind grundsätzlich schreibgeschützt; Schreibzugriffe nur über `INSTEAD OF`-Trigger. Kein `WITH CHECK OPTION`.',
        mdn: SL + 'lang_createtrigger.html'
      }
    },
    tip: 'Über Views lässt sich Schreibzugriff auf eine Teilmenge der Zeilen beschränken – zusammen mit `WITH CHECK OPTION` und passenden Rechten.',
    keywords: ['updatable view', 'with check option', 'view schreiben', 'insert in view', 'instead of'],
    related: ['CREATE VIEW', 'BEFORE / AFTER / INSTEAD OF', 'UPDATE'],
    mdn: PG + 'sql-createview.html'
  },
  {
    lang: 'sql', group: 'Views', name: 'Materialized View',
    desc: 'View, deren Ergebnis gespeichert und nur bei REFRESH neu berechnet wird.',
    details: 'Anders als eine normale View speichert eine Materialized View ihr Ergebnis wie eine Tabelle; Abfragen darauf sind schnell, zeigen aber den Stand der letzten Aktualisierung. Sie eignet sich für teure Auswertungen, die nicht sekundengenau sein müssen. Ohne eingebaute Unterstützung baut man sie mit einer Tabelle nach, die regelmäßig neu befüllt wird.',
    dialects: {
      std: { none: 'Nicht im ISO-Standard. Ersatz: Tabelle per `CREATE TABLE … AS` anlegen und regelmäßig neu befüllen.' },
      pg: {
        syntax: 'CREATE MATERIALIZED VIEW name AS SELECT …;\nREFRESH MATERIALIZED VIEW [CONCURRENTLY] name;',
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, betrag NUMERIC(10,2), datum DATE);
INSERT INTO bestellungen VALUES (1, 100, '2026-01-10'), (2, 80, '2026-01-20'), (3, 50, '2026-02-05');

CREATE MATERIALIZED VIEW mv_umsatz_monat AS
SELECT date_trunc('month', datum)::date AS monat, SUM(betrag) AS umsatz
FROM bestellungen
GROUP BY 1;

CREATE UNIQUE INDEX ux_mv_umsatz_monat ON mv_umsatz_monat (monat);

INSERT INTO bestellungen VALUES (4, 30, '2026-02-20');

-- Noch der alte Stand
SELECT monat, umsatz FROM mv_umsatz_monat ORDER BY monat;
-- monat      | umsatz
-- 2026-01-01 | 180.00
-- 2026-02-01 | 50.00

-- z. B. nächtlich per Cronjob; CONCURRENTLY braucht den eindeutigen Index
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_umsatz_monat;

SELECT monat, umsatz FROM mv_umsatz_monat ORDER BY monat;
-- monat      | umsatz
-- 2026-01-01 | 180.00
-- 2026-02-01 | 80.00
`),
        note: 'Ohne `CONCURRENTLY` ist die View während des Refresh für Leser gesperrt.',
        mdn: PG + 'rules-materializedviews.html'
      },
      mysql: { none: 'Keine Materialized Views. Ersatz: Tabelle per `CREATE TABLE … AS SELECT` anlegen und per Event (`CREATE EVENT … ON SCHEDULE`) oder Cronjob regelmäßig neu befüllen.' },
      mssql: {
        syntax: 'CREATE VIEW name WITH SCHEMABINDING AS SELECT …;\nCREATE UNIQUE CLUSTERED INDEX name ON view (…);',
        example: e(`
CREATE TABLE dbo.bestellungen (id INT PRIMARY KEY, kunde_id INT NOT NULL, betrag DECIMAL(10,2) NOT NULL);
INSERT INTO dbo.bestellungen VALUES (1, 1, 100), (2, 1, 80), (3, 2, 50);
GO

-- „Indexed View“: wird durch den Index gespeichert
CREATE VIEW dbo.v_umsatz_kunde WITH SCHEMABINDING AS
SELECT kunde_id, SUM(betrag) AS umsatz, COUNT_BIG(*) AS anzahl
FROM dbo.bestellungen
GROUP BY kunde_id;
GO

CREATE UNIQUE CLUSTERED INDEX ux_v_umsatz_kunde ON dbo.v_umsatz_kunde (kunde_id);
GO

INSERT INTO dbo.bestellungen VALUES (4, 2, 30);   -- wird sofort mitgeführt

SELECT kunde_id, umsatz, anzahl FROM dbo.v_umsatz_kunde ORDER BY kunde_id;
-- kunde_id | umsatz | anzahl
-- 1        | 180.00 | 2
-- 2        | 80.00  | 2
`),
        note: 'Heißt „indexed view“ und ist immer aktuell (kein `REFRESH`), verlangsamt dafür jede Änderung der Basistabellen. Viele Einschränkungen: `SCHEMABINDING`, zweiteilige Namen, `COUNT_BIG(*)` bei `GROUP BY`, keine Outer Joins.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/views/create-indexed-views'
      },
      sqlite: { none: 'Keine Materialized Views. Ersatz: Tabelle per `CREATE TABLE … AS SELECT` anlegen und bei Bedarf neu befüllen (oder per Trigger aktuell halten).' }
    },
    tip: 'Den Zeitpunkt des letzten Refresh mitspeichern oder anzeigen, damit niemand veraltete Zahlen für aktuelle hält.',
    keywords: ['materialisierte sicht', 'materialized view', 'refresh', 'cache', 'vorberechnet', 'indexed view'],
    related: ['CREATE VIEW', 'CREATE TABLE AS', 'Denormalisierung'],
    mdn: PG + 'rules-materializedviews.html'
  },

  // ---------------- Datenbankdesign ----------------
  {
    lang: 'sql', group: 'Datenbankdesign', name: 'Normalisierung',
    desc: 'Aufteilen von Daten auf Tabellen, sodass jede Information genau einmal gespeichert ist.',
    details: 'Redundante Daten führen zu Anomalien: Beim Ändern muss man viele Zeilen anpassen (Änderungsanomalie), manche Fakten lassen sich nicht ohne andere speichern (Einfügeanomalie) oder gehen beim Löschen mit verloren (Löschanomalie). Die Normalformen (1NF, 2NF, 3NF, BCNF) beschreiben schrittweise strengere Regeln dagegen. In der Praxis ist die 3. Normalform das übliche Ziel; Abfragen setzen die Daten dann per Join wieder zusammen.',
    values: [
      ['1NF', 'Atomare Werte, keine Wiederholungsgruppen'],
      ['2NF', '1NF + kein Attribut hängt nur von einem Teil des Schlüssels ab'],
      ['3NF', '2NF + keine Abhängigkeit zwischen Nicht-Schlüssel-Attributen'],
      ['BCNF', 'Verschärfte 3NF: jede Determinante ist Schlüsselkandidat'],
      ['Anomalien', 'Einfüge-, Änderungs- und Löschanomalie']
    ],
    dialects: {
      std: {
        example: e(`
-- Unnormalisiert: Kundendaten stehen in jeder Bestellung erneut
--   bestellungen(id, kunde_name, kunde_stadt, betrag)

-- Normalisiert: jede Information genau einmal
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL, stadt VARCHAR(50));
CREATE TABLE bestellungen (
  id       INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL,
  betrag   DECIMAL(10,2),
  FOREIGN KEY (kunde_id) REFERENCES kunden (id)
);
INSERT INTO kunden VALUES (1, 'Müller', 'Berlin'), (2, 'Schmidt', 'Köln');
INSERT INTO bestellungen VALUES (10, 1, 99.50), (11, 1, 20), (12, 2, 45);

UPDATE kunden SET stadt = 'Hamburg' WHERE id = 1;   -- eine Zeile statt vieler

SELECT b.id, k.name, k.stadt, b.betrag
FROM bestellungen b JOIN kunden k ON k.id = b.kunde_id
ORDER BY b.id;
-- id | name    | stadt   | betrag
-- 10 | Müller  | Hamburg | 99.50
-- 11 | Müller  | Hamburg | 20.00
-- 12 | Schmidt | Köln    | 45.00
`)
      }
    },
    tip: 'Erst sauber normalisieren, dann nur dort gezielt denormalisieren, wo Messungen ein Leistungsproblem zeigen.',
    keywords: ['normalform', 'normalization', 'redundanz', 'anomalie', 'datenmodell', 'entwurf', 'bcnf'],
    related: ['1. Normalform', '2. Normalform', '3. Normalform', 'Denormalisierung'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Datenbankdesign', name: '1. Normalform',
    desc: 'Jede Spalte enthält nur einen atomaren Wert, es gibt keine Wiederholungsgruppen.',
    details: 'Verstöße sind Listen in einer Spalte (`\'030-1, 0171-2\'`) oder durchnummerierte Spalten wie `telefon1`, `telefon2`, `telefon3`. Solche Werte lassen sich schlecht durchsuchen, indizieren und prüfen. Die Lösung ist eine eigene Tabelle mit einer Zeile pro Wert und einem Fremdschlüssel. Ob ein Wert atomar ist, hängt von der Verwendung ab: Eine Adresse kann ein Feld sein, solange niemand nach der Postleitzahl suchen muss.',
    dialects: {
      std: {
        example: e(`
-- Verletzt die 1NF: mehrere Werte in einer Spalte
--   kunden(id, name, telefon = '030-1234, 0171-5678')

CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);
CREATE TABLE telefonnummern (
  kunde_id INTEGER     NOT NULL,
  nummer   VARCHAR(20) NOT NULL,
  art      VARCHAR(20),
  PRIMARY KEY (kunde_id, nummer),
  FOREIGN KEY (kunde_id) REFERENCES kunden (id)
);
INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Schmidt');
INSERT INTO telefonnummern VALUES
  (1, '030-1234', 'Festnetz'), (1, '0171-5678', 'Mobil'), (2, '0221-999', 'Festnetz');

SELECT k.name, t.art, t.nummer
FROM kunden k JOIN telefonnummern t ON t.kunde_id = k.id
ORDER BY k.name, t.art;
-- name    | art      | nummer
-- Müller  | Festnetz | 030-1234
-- Müller  | Mobil    | 0171-5678
-- Schmidt | Festnetz | 0221-999
`)
      },
      pg: { note: 'Arrays (`TEXT[]`) und `JSONB` verletzen die 1NF formal; sie sind praktisch für Zusatzdaten, aber kein Ersatz für eine Detailtabelle, wenn man darüber suchen oder verknüpfen will.' }
    },
    tip: 'Kommagetrennte Listen in einer Spalte sind fast immer ein Designfehler; JSON-Spalten nur für wirklich unstrukturierte Zusatzdaten nutzen.',
    keywords: ['1nf', 'erste normalform', 'atomar', 'wiederholungsgruppe', 'first normal form', 'kommaliste'],
    related: ['Normalisierung', '2. Normalform', '1:n-Beziehung'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Datenbankdesign', name: '2. Normalform',
    desc: 'Kein Nicht-Schlüssel-Attribut hängt nur von einem Teil eines zusammengesetzten Schlüssels ab.',
    details: 'Die 2NF betrifft nur Tabellen mit zusammengesetztem Primärschlüssel. Beispiel: In `bestellpositionen(bestell_id, produkt_id, menge, produkt_name)` hängt `produkt_name` nur von `produkt_id` ab und wiederholt sich in jeder Position. Solche Attribute wandern in eine eigene Tabelle, die nur nach dem Teilschlüssel identifiziert wird. Tabellen mit einspaltigem Schlüssel sind in 1NF automatisch auch in 2NF.',
    dialects: {
      std: {
        example: e(`
-- Verletzt die 2NF: produkt_name hängt nur von produkt_id ab
--   bestellpositionen(bestell_id, produkt_id, menge, produkt_name)

CREATE TABLE produkte (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);
CREATE TABLE bestellpositionen (
  bestell_id INTEGER NOT NULL,
  produkt_id INTEGER NOT NULL,
  menge      INTEGER NOT NULL,
  PRIMARY KEY (bestell_id, produkt_id),
  FOREIGN KEY (produkt_id) REFERENCES produkte (id)
);
INSERT INTO produkte VALUES (1, 'Maus'), (2, 'Tastatur');
INSERT INTO bestellpositionen VALUES (100, 1, 2), (100, 2, 1), (101, 1, 5);

SELECT bp.bestell_id, p.name, bp.menge
FROM bestellpositionen bp JOIN produkte p ON p.id = bp.produkt_id
ORDER BY bp.bestell_id, p.name;
-- bestell_id | name     | menge
-- 100        | Maus     | 2
-- 100        | Tastatur | 1
-- 101        | Maus     | 5
`)
      }
    },
    tip: 'Merksatz für 1NF bis 3NF: Jedes Attribut hängt ab vom Schlüssel, vom ganzen Schlüssel und von nichts als dem Schlüssel.',
    keywords: ['2nf', 'zweite normalform', 'teilschlüssel', 'partielle abhängigkeit', 'second normal form'],
    related: ['1. Normalform', '3. Normalform', 'Zusammengesetzter Primärschlüssel'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Datenbankdesign', name: '3. Normalform',
    desc: 'Keine transitiven Abhängigkeiten: Nicht-Schlüssel-Spalten hängen nicht voneinander ab.',
    details: 'Steht in `mitarbeiter(id, name, abteilung_id, abteilung_name)` der Abteilungsname, hängt er nicht vom Mitarbeiter, sondern von `abteilung_id` ab (transitiv). Benennt man eine Abteilung um, müssen alle ihre Mitarbeiterzeilen geändert werden. Lösung: Die abhängigen Spalten in eine eigene Tabelle auslagern und nur den Fremdschlüssel behalten.',
    dialects: {
      std: {
        example: e(`
-- Verletzt die 3NF: abteilung_name hängt von abteilung_id ab, nicht vom Mitarbeiter
--   mitarbeiter(id, name, abteilung_id, abteilung_name)

CREATE TABLE abteilungen (id INTEGER PRIMARY KEY, name VARCHAR(30) NOT NULL);
CREATE TABLE mitarbeiter (
  id           INTEGER PRIMARY KEY,
  name         VARCHAR(50) NOT NULL,
  abteilung_id INTEGER,
  FOREIGN KEY (abteilung_id) REFERENCES abteilungen (id)
);
INSERT INTO abteilungen VALUES (1, 'IT'), (2, 'Vertrieb');
INSERT INTO mitarbeiter VALUES (1, 'Ada', 1), (2, 'Lin', 1), (3, 'Tom', 2);

UPDATE abteilungen SET name = 'Informatik' WHERE id = 1;   -- nur eine Zeile

SELECT m.name, a.name AS abteilung
FROM mitarbeiter m JOIN abteilungen a ON a.id = m.abteilung_id
ORDER BY m.id;
-- name | abteilung
-- Ada  | Informatik
-- Lin  | Informatik
-- Tom  | Vertrieb
`)
      }
    },
    tip: 'Auch berechenbare Werte (Alter aus Geburtsdatum, Summe aus Positionen) verletzen die 3NF; sie gehören in Abfragen, Views oder generierte Spalten.',
    keywords: ['3nf', 'dritte normalform', 'transitiv', 'transitive abhängigkeit', 'third normal form'],
    related: ['2. Normalform', 'Normalisierung', 'Denormalisierung'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Datenbankdesign', name: 'Denormalisierung',
    desc: 'Bewusst redundante Daten speichern, um Lesezugriffe zu beschleunigen.',
    details: 'Typische Formen sind vorberechnete Summen oder Zähler, kopierte Spalten zur Vermeidung von Joins oder Berichtstabellen. Der Preis: Die Redundanz muss bei jeder Änderung synchron gehalten werden, per Anwendungslogik, Trigger oder regelmäßigem Neuaufbau. Kein Fall von Denormalisierung ist das Speichern des Preises zum Bestellzeitpunkt: Das ist ein eigener Fakt, der sich später nicht mitändern soll.',
    dialects: {
      std: {
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50), umsatz_gesamt DECIMAL(10,2) DEFAULT 0);
CREATE TABLE bestellungen (
  id       INTEGER PRIMARY KEY,
  kunde_id INTEGER,
  betrag   DECIMAL(10,2),
  FOREIGN KEY (kunde_id) REFERENCES kunden (id)
);
INSERT INTO kunden (id, name) VALUES (1, 'Müller'), (2, 'Schmidt');
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 1, 50), (3, 2, 80);

-- Redundante Summe aktualisieren (z. B. nächtlich oder per Trigger)
UPDATE kunden
SET umsatz_gesamt = (SELECT COALESCE(SUM(b.betrag), 0) FROM bestellungen b WHERE b.kunde_id = kunden.id);

-- Lesen ohne Join und Aggregation
SELECT name, umsatz_gesamt FROM kunden ORDER BY umsatz_gesamt DESC;
-- name    | umsatz_gesamt
-- Müller  | 150.00
-- Schmidt | 80.00
`)
      },
      pg: { note: 'Eine Materialized View ist oft die sauberere Form der Denormalisierung.' },
      mssql: { note: 'Indexed Views halten vorberechnete Summen automatisch aktuell.' }
    },
    tip: 'Vor dem Denormalisieren Alternativen prüfen: passender Index, Materialized View oder Caching in der Anwendung.',
    keywords: ['denormalisieren', 'redundanz', 'vorberechnet', 'performance', 'reporting', 'denormalization'],
    related: ['Normalisierung', 'Materialized View', 'Audit-Trigger'],
    mdn: PG + 'rules-materializedviews.html'
  },
  {
    lang: 'sql', group: 'Datenbankdesign', name: '1:n-Beziehung',
    desc: 'Ein Datensatz steht mit beliebig vielen Datensätzen einer anderen Tabelle in Beziehung.',
    details: 'Die häufigste Beziehung: Ein Kunde hat viele Bestellungen, jede Bestellung gehört zu genau einem Kunden. Umgesetzt wird sie mit einem Fremdschlüssel auf der „n“-Seite (`bestellungen.kunde_id`). `NOT NULL` auf dem Fremdschlüssel macht die Beziehung verpflichtend. Abfragen über die Beziehung laufen per Join, für „auch ohne Kinder“ mit `LEFT JOIN`.',
    dialects: {
      std: {
        syntax: 'FOREIGN KEY (eltern_id) REFERENCES eltern (id)   -- in der Kindtabelle',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);
CREATE TABLE bestellungen (
  id       INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL,              -- n-Seite trägt den Fremdschlüssel
  betrag   DECIMAL(10,2),
  FOREIGN KEY (kunde_id) REFERENCES kunden (id)
);
CREATE INDEX idx_bestellungen_kunde ON bestellungen (kunde_id);

INSERT INTO kunden VALUES (1, 'Müller'), (2, 'Schmidt'), (3, 'Weber');
INSERT INTO bestellungen VALUES (1, 1, 100), (2, 1, 50), (3, 2, 80);

SELECT k.name, COUNT(b.id) AS bestellungen
FROM kunden k LEFT JOIN bestellungen b ON b.kunde_id = k.id
GROUP BY k.id, k.name
ORDER BY k.id;
-- name    | bestellungen
-- Müller  | 2
-- Schmidt | 1
-- Weber   | 0
`)
      },
      mysql: { note: 'Den Index auf dem Fremdschlüssel legt InnoDB auch selbst an; ein expliziter Index wird dafür mitbenutzt.' }
    },
    tip: 'Den Fremdschlüssel nach der referenzierten Tabelle benennen (`kunde_id`), dann ist die Beziehung im Schema sofort lesbar.',
    keywords: ['eins zu n', 'one to many', '1:n', 'beziehung', 'relation', 'fremdschlüssel', 'eltern kind'],
    related: ['FOREIGN KEY', 'n:m-Beziehung', '1:1-Beziehung', 'LEFT JOIN'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Datenbankdesign', name: 'n:m-Beziehung',
    desc: 'Viele-zu-viele-Beziehung, umgesetzt mit einer Verknüpfungstabelle.',
    details: 'Ein Mitarbeiter arbeitet in mehreren Projekten, ein Projekt hat mehrere Mitarbeiter. Relationale Datenbanken bilden das über eine Zwischentabelle (Verknüpfungs-, Join- oder Brückentabelle) mit zwei Fremdschlüsseln ab. Deren zusammengesetzter Primärschlüssel verhindert doppelte Zuordnungen. Die Zwischentabelle kann eigene Attribute der Beziehung tragen, etwa die Rolle oder das Startdatum.',
    dialects: {
      std: {
        syntax: 'verknuepfung (a_id, b_id, PRIMARY KEY (a_id, b_id),\n  FOREIGN KEY (a_id) REFERENCES a (id), FOREIGN KEY (b_id) REFERENCES b (id))',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);
CREATE TABLE projekte (id INTEGER PRIMARY KEY, titel VARCHAR(50) NOT NULL);
CREATE TABLE projekt_mitarbeit (
  projekt_id     INTEGER NOT NULL,
  mitarbeiter_id INTEGER NOT NULL,
  rolle          VARCHAR(30),
  PRIMARY KEY (projekt_id, mitarbeiter_id),
  FOREIGN KEY (projekt_id) REFERENCES projekte (id) ON DELETE CASCADE,
  FOREIGN KEY (mitarbeiter_id) REFERENCES mitarbeiter (id) ON DELETE CASCADE
);
INSERT INTO mitarbeiter VALUES (1, 'Ada'), (2, 'Lin'), (3, 'Tom');
INSERT INTO projekte VALUES (1, 'Webshop'), (2, 'App');
INSERT INTO projekt_mitarbeit VALUES (1, 1, 'Leitung'), (1, 2, 'Dev'), (2, 1, 'Dev');

SELECT p.titel, m.name, pm.rolle
FROM projekt_mitarbeit pm
JOIN projekte p    ON p.id = pm.projekt_id
JOIN mitarbeiter m ON m.id = pm.mitarbeiter_id
ORDER BY p.titel, m.name;
-- titel   | name | rolle
-- App     | Ada  | Dev
-- Webshop | Ada  | Leitung
-- Webshop | Lin  | Dev
`)
      }
    },
    tip: 'Für Abfragen in beide Richtungen zusätzlich einen Index auf die zweite Schlüsselspalte (`mitarbeiter_id`) anlegen.',
    keywords: ['n zu m', 'many to many', 'n:m', 'viele zu viele', 'zwischentabelle', 'verknüpfungstabelle', 'junction table'],
    related: ['Zusammengesetzter Primärschlüssel', '1:n-Beziehung', 'Join über mehrere Tabellen'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Datenbankdesign', name: '1:1-Beziehung',
    desc: 'Jedem Datensatz ist höchstens ein Datensatz der anderen Tabelle zugeordnet.',
    details: 'Üblich, um selten genutzte, große oder besonders schützenswerte Spalten auszulagern (z. B. Profil- oder Gehaltsdaten). Umgesetzt wird sie, indem der Primärschlüssel der abhängigen Tabelle zugleich Fremdschlüssel ist, oder mit einem `UNIQUE`-Fremdschlüssel. Oft ist eine einzige Tabelle mit `NULL`-baren Spalten die einfachere Lösung.',
    dialects: {
      std: {
        syntax: 'kind.id PRIMARY KEY, FOREIGN KEY (id) REFERENCES eltern (id)',
        example: e(`
CREATE TABLE mitarbeiter (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);
CREATE TABLE mitarbeiter_details (
  mitarbeiter_id INTEGER PRIMARY KEY,
  iban           VARCHAR(34),
  notfallkontakt VARCHAR(50),
  FOREIGN KEY (mitarbeiter_id) REFERENCES mitarbeiter (id) ON DELETE CASCADE
);
INSERT INTO mitarbeiter VALUES (1, 'Ada'), (2, 'Lin');
INSERT INTO mitarbeiter_details VALUES (1, 'DE89 3704 0044 0532 0130 00', 'Bob');
-- INSERT INTO mitarbeiter_details VALUES (1, 'DE00 …', 'Eve');
--   → Fehler: doppelter Schlüssel (nur ein Detailsatz pro Mitarbeiter)

SELECT m.name, d.notfallkontakt
FROM mitarbeiter m LEFT JOIN mitarbeiter_details d ON d.mitarbeiter_id = m.id
ORDER BY m.id;
-- name | notfallkontakt
-- Ada  | Bob
-- Lin  | NULL
`)
      }
    },
    tip: 'Eine Auslagerung lohnt sich vor allem, wenn die Detailtabelle andere Zugriffsrechte bekommen soll.',
    keywords: ['eins zu eins', 'one to one', '1:1', 'beziehung', 'tabelle aufteilen', 'vertikale partitionierung'],
    related: ['1:n-Beziehung', 'FOREIGN KEY', 'UNIQUE'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Datenbankdesign', name: 'Natürlicher vs. Surrogatschlüssel',
    desc: 'Fachlicher Schlüssel (z. B. ISO-Code) gegenüber künstlicher, bedeutungsloser ID.',
    details: 'Ein natürlicher Schlüssel stammt aus den Daten selbst (ISBN, Ländercode, E-Mail); ein Surrogatschlüssel ist eine generierte Zahl oder UUID ohne fachliche Bedeutung. Natürliche Schlüssel sparen Joins, ändern sich aber manchmal doch (E-Mail-Wechsel) oder sind nicht wirklich eindeutig. Gängige Praxis: Surrogatschlüssel als Primärschlüssel und den natürlichen Schlüssel zusätzlich mit `UNIQUE` absichern. Für kleine, stabile Codelisten sind natürliche Schlüssel gut geeignet.',
    values: [
      ['Natürlich', 'ISO-Ländercode, ISBN, Kontonummer – fachlich, lesbar, kann sich ändern'],
      ['Surrogat', 'INTEGER-ID oder UUID – stabil, kompakt, ohne Bedeutung'],
      ['UUID', 'Global eindeutig, gut für verteilte Systeme, aber größer als INTEGER']
    ],
    dialects: {
      std: {
        example: e(`
-- Natürlicher Schlüssel: kleine, stabile Codeliste
CREATE TABLE laender (iso_code CHAR(2) PRIMARY KEY, name VARCHAR(50) NOT NULL);

-- Surrogatschlüssel + fachliche Eindeutigkeit per UNIQUE
CREATE TABLE kunden (
  id    INTEGER      PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  name  VARCHAR(50),
  land  CHAR(2),
  FOREIGN KEY (land) REFERENCES laender (iso_code)
);
INSERT INTO laender VALUES ('DE', 'Deutschland'), ('AT', 'Österreich');
INSERT INTO kunden VALUES (1, 'm@example.com', 'Müller', 'DE'), (2, 'h@example.at', 'Huber', 'AT');

UPDATE kunden SET email = 'mueller@example.com' WHERE id = 1;  -- Fremdschlüssel bleiben gültig

SELECT id, email, land FROM kunden ORDER BY id;
-- id | email               | land
-- 1  | mueller@example.com | DE
-- 2  | h@example.at        | AT
`)
      },
      pg: { note: 'UUIDs: Typ `UUID` mit `DEFAULT gen_random_uuid()`; seit Version 18 auch zeitlich sortierbare `uuidv7()`.' },
      mysql: { note: 'UUIDs speichert man platzsparend als `BINARY(16)` mit `UUID_TO_BIN(UUID())`.' },
      mssql: { note: 'UUIDs: Typ `UNIQUEIDENTIFIER` mit `DEFAULT NEWSEQUENTIALID()` (sortierbar, besser für den Clustered Index als `NEWID()`).' }
    },
    tip: 'Surrogatschlüssel nie nach außen als fachliche Nummer verwenden (Rechnungsnummer o. Ä.) – dafür eine eigene Spalte anlegen.',
    keywords: ['surrogate key', 'natural key', 'künstlicher schlüssel', 'fachschlüssel', 'business key', 'uuid', 'id'],
    related: ['PRIMARY KEY', 'UNIQUE', 'UUID', 'Auto-Increment'],
    mdn: PG + 'ddl-constraints.html'
  },
  {
    lang: 'sql', group: 'Datenbankdesign', name: 'Namenskonventionen',
    desc: 'Einheitliche Benennung von Tabellen, Spalten, Schlüsseln und Indizes.',
    details: 'Welche Konvention man wählt, ist weniger wichtig, als sie durchzuhalten. Verbreitet sind `snake_case` in Kleinbuchstaben (dann muss nichts gequotet werden), Fremdschlüssel als `<tabelle>_id` und Präfixe für Constraints und Indizes. Ob Tabellen im Singular oder Plural heißen, ist Geschmackssache. Reservierte Wörter (`user`, `order`, `group`) und Leerzeichen als Namen vermeiden, sonst muss überall gequotet werden.',
    values: [
      ['Tabellen', 'kunden, bestellungen (oder einheitlich Singular)'],
      ['Spalten', 'snake_case: eingestellt_am, ist_aktiv'],
      ['Fremdschlüssel', '<bezug>_id: kunde_id, abteilung_id'],
      ['Indizes', 'idx_<tabelle>_<spalten>, eindeutig: ux_… / uq_…'],
      ['Constraints', 'pk_…, fk_<tabelle>_<ziel>, chk_…'],
      ['Views', 'v_… ; Materialized Views mv_…']
    ],
    dialects: {
      std: {
        example: e(`
CREATE TABLE abteilungen (
  id   INTEGER     PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
CREATE TABLE mitarbeiter (
  id             INTEGER     PRIMARY KEY,
  vorname        VARCHAR(50) NOT NULL,
  abteilung_id   INTEGER,
  ist_aktiv      INTEGER     DEFAULT 1 NOT NULL,
  eingestellt_am DATE,
  CONSTRAINT fk_mitarbeiter_abteilung FOREIGN KEY (abteilung_id) REFERENCES abteilungen (id),
  CONSTRAINT chk_mitarbeiter_ist_aktiv CHECK (ist_aktiv IN (0, 1))
);
CREATE INDEX idx_mitarbeiter_abteilung_id ON mitarbeiter (abteilung_id);

SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'mitarbeiter'
  AND (constraint_name LIKE 'fk%' OR constraint_name LIKE 'chk%')
ORDER BY constraint_name;
-- constraint_name           | constraint_type
-- chk_mitarbeiter_ist_aktiv | CHECK
-- fk_mitarbeiter_abteilung  | FOREIGN KEY
`)
      },
      pg: { note: 'Unquotierte Namen werden kleingeschrieben; `"Kunden"` in Anführungszeichen bleibt case-sensitiv und muss dann immer so geschrieben werden.' },
      mysql: {
        example: e(`
CREATE TABLE abteilungen (
  id   INT         PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);
CREATE TABLE mitarbeiter (
  id             INT         PRIMARY KEY,
  vorname        VARCHAR(50) NOT NULL,
  abteilung_id   INT,
  ist_aktiv      TINYINT     NOT NULL DEFAULT 1,
  eingestellt_am DATE,
  CONSTRAINT fk_mitarbeiter_abteilung FOREIGN KEY (abteilung_id) REFERENCES abteilungen (id),
  CONSTRAINT chk_mitarbeiter_ist_aktiv CHECK (ist_aktiv IN (0, 1))
);
CREATE INDEX idx_mitarbeiter_abteilung_id ON mitarbeiter (abteilung_id);

SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = DATABASE() AND table_name = 'mitarbeiter'
  AND (constraint_name LIKE 'fk%' OR constraint_name LIKE 'chk%')
ORDER BY constraint_name;
-- constraint_name           | constraint_type
-- chk_mitarbeiter_ist_aktiv | CHECK
-- fk_mitarbeiter_abteilung  | FOREIGN KEY
`),
        note: 'Tabellennamen sind unter Linux case-sensitiv (Dateinamen), unter Windows nicht – deshalb konsequent kleinschreiben. Bezeichner quotet man mit Backticks.'
      },
      mssql: { note: 'Verbreitet ist auch PascalCase (`Kunden`, `KundeId`). Bezeichner quotet man mit `[eckigen Klammern]`.' },
      sqlite: {
        example: e(`
CREATE TABLE abteilungen (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE mitarbeiter (
  id             INTEGER PRIMARY KEY,
  vorname        TEXT NOT NULL,
  abteilung_id   INTEGER,
  ist_aktiv      INTEGER NOT NULL DEFAULT 1,
  eingestellt_am DATE,
  CONSTRAINT fk_mitarbeiter_abteilung FOREIGN KEY (abteilung_id) REFERENCES abteilungen (id),
  CONSTRAINT chk_mitarbeiter_ist_aktiv CHECK (ist_aktiv IN (0, 1))
);
CREATE INDEX idx_mitarbeiter_abteilung_id ON mitarbeiter (abteilung_id);

SELECT type, name FROM sqlite_schema ORDER BY type, name;
-- type  | name
-- index | idx_mitarbeiter_abteilung_id
-- table | abteilungen
-- table | mitarbeiter
`),
        note: 'Namen, die mit `sqlite_` beginnen, sind für interne Objekte reserviert.'
      }
    },
    tip: 'Die Konvention im Projekt schriftlich festhalten (z. B. in der README der Migrationen), dann bleibt sie auch bei vielen Beteiligten einheitlich.',
    keywords: ['naming', 'benennung', 'snake_case', 'konvention', 'präfix', 'singular plural', 'reservierte wörter'],
    related: ['Bezeichner quoten', 'Benannte Constraints', 'Groß- & Kleinschreibung'],
    mdn: PG + 'sql-syntax-lexical.html'
  },

  // ---------------- Schemas & Katalog ----------------
  {
    lang: 'sql', group: 'Schemas & Katalog', name: 'CREATE DATABASE',
    desc: 'Legt eine neue, leere Datenbank auf dem Datenbankserver an.',
    details: 'Ein Server verwaltet meist mehrere Datenbanken. Beim Anlegen werden Zeichensatz und Sortierung (Kollation) festgelegt, die sich später nur schwer ändern lassen. Wie man zwischen Datenbanken wechselt, ist je Dialekt verschieden.',
    dialects: {
      std: { none: 'Nicht im ISO-Standard (dort gibt es nur Kataloge und Schemas). Fast alle Server kennen aber `CREATE DATABASE name;`.' },
      pg: {
        syntax: "CREATE DATABASE name [WITH OWNER = rolle ENCODING = 'UTF8' TEMPLATE = template0 …];\nDROP DATABASE [IF EXISTS] name [WITH (FORCE)];",
        example: e(`
CREATE DATABASE shop
  WITH OWNER = app_user
       ENCODING = 'UTF8'
       TEMPLATE = template0;

DROP DATABASE IF EXISTS shop_test;

-- Wechseln geht nur über eine neue Verbindung, in psql:  \\c shop
`),
        nocheck: true,
        note: 'Läuft nicht innerhalb einer Transaktion und braucht die Rolle `app_user` (deshalb hier ungeprüft). Eine Verbindung gehört immer zu genau einer Datenbank.',
        mdn: PG + 'sql-createdatabase.html'
      },
      mysql: {
        syntax: 'CREATE DATABASE [IF NOT EXISTS] name\n  [CHARACTER SET utf8mb4] [COLLATE …];\nUSE name;',
        example: e(`
CREATE DATABASE IF NOT EXISTS shop_ddl_demo
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE shop_ddl_demo;
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50));

SELECT DATABASE() AS aktuell;
-- aktuell
-- shop_ddl_demo

DROP DATABASE shop_ddl_demo;
`),
        note: '`CREATE DATABASE` und `CREATE SCHEMA` sind dasselbe. Immer `utf8mb4` statt `utf8` wählen – das alte `utf8` speichert keine Emojis.',
        mdn: MY + 'create-database.html'
      },
      mssql: {
        syntax: 'CREATE DATABASE name [COLLATE …];\nUSE name;',
        example: e(`
CREATE DATABASE shop_ddl_demo;
GO

SELECT name, collation_name FROM sys.databases WHERE name = 'shop_ddl_demo';
-- name          | collation_name
-- shop_ddl_demo | SQL_Latin1_General_CP1_CI_AS

DROP DATABASE shop_ddl_demo;
`),
        note: 'Mit `USE name;` wechselt man die Datenbank innerhalb der Verbindung. Ohne `COLLATE` gilt die Server-Kollation (meist case-insensitiv).',
        mdn: MS + 'statements/create-database-transact-sql'
      },
      sqlite: {
        example: e(`
# Eine SQLite-Datenbank ist eine Datei; sie entsteht beim ersten Öffnen
sqlite3 shop.db

# Datei löschen = Datenbank löschen
rm shop.db
`),
        exampleLang: 'sh',
        note: 'Kein `CREATE DATABASE`. Weitere Dateien lassen sich per `ATTACH DATABASE` in eine Verbindung einhängen.',
        mdn: SL + 'cli.html'
      }
    },
    tip: 'Zeichensatz und Kollation gleich beim Anlegen bewusst wählen – nachträglich bedeutet das oft einen kompletten Export und Import.',
    keywords: ['datenbank anlegen', 'create database', 'neue datenbank', 'use', 'encoding', 'zeichensatz', 'kollation'],
    related: ['CREATE SCHEMA', 'ATTACH DATABASE (SQLite)', 'Collation'],
    mdn: PG + 'sql-createdatabase.html'
  },
  {
    lang: 'sql', group: 'Schemas & Katalog', name: 'CREATE SCHEMA',
    desc: 'Legt einen Namensraum innerhalb einer Datenbank an, der Tabellen und Views gruppiert.',
    details: 'Schemas trennen Objekte logisch (z. B. `lager.artikel` und `shop.artikel`) und erleichtern die Rechtevergabe. Objekte spricht man als `schema.objekt` an; ohne Präfix gilt ein Standardschema. Was genau ein Schema ist, unterscheidet sich je Dialekt deutlich.',
    dialects: {
      std: {
        syntax: 'CREATE SCHEMA name [AUTHORIZATION rolle];\nDROP SCHEMA name { CASCADE | RESTRICT };',
        example: e(`
CREATE SCHEMA lager;

CREATE TABLE lager.artikel (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);
INSERT INTO lager.artikel VALUES (1, 'Schraube'), (2, 'Mutter');

SELECT id, name FROM lager.artikel ORDER BY id;
-- id | name
-- 1  | Schraube
-- 2  | Mutter

DROP SCHEMA lager CASCADE;   -- löscht auch alle enthaltenen Objekte
`)
      },
      pg: {
        syntax: 'CREATE SCHEMA [IF NOT EXISTS] name [AUTHORIZATION rolle];\nSET search_path TO schema [, …];',
        example: e(`
CREATE SCHEMA IF NOT EXISTS lager;

CREATE TABLE lager.artikel (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO lager.artikel VALUES (1, 'Schraube'), (2, 'Mutter');

SET search_path TO lager, public;
SELECT id, name FROM artikel ORDER BY id;    -- findet lager.artikel
-- id | name
-- 1  | Schraube
-- 2  | Mutter

DROP SCHEMA lager CASCADE;
`),
        note: 'Standardschema ist `public`. Welche Schemas ohne Präfix durchsucht werden, bestimmt `search_path`.',
        mdn: PG + 'ddl-schemas.html'
      },
      mysql: {
        syntax: 'CREATE SCHEMA [IF NOT EXISTS] name;   -- = CREATE DATABASE',
        example: e(`
CREATE SCHEMA lager_ddl_demo;

CREATE TABLE lager_ddl_demo.artikel (id INT PRIMARY KEY, name VARCHAR(50) NOT NULL);
INSERT INTO lager_ddl_demo.artikel VALUES (1, 'Schraube'), (2, 'Mutter');

SELECT id, name FROM lager_ddl_demo.artikel ORDER BY id;
-- id | name
-- 1  | Schraube
-- 2  | Mutter

DROP SCHEMA lager_ddl_demo;
`),
        note: 'In MySQL sind Schema und Datenbank dasselbe; `schema.tabelle` ist also ein datenbankübergreifender Zugriff.',
        mdn: MY + 'create-database.html'
      },
      mssql: {
        syntax: 'CREATE SCHEMA name [AUTHORIZATION besitzer];   -- eigener Batch',
        example: e(`
CREATE SCHEMA lager;
GO

CREATE TABLE lager.artikel (id INT PRIMARY KEY, name NVARCHAR(50) NOT NULL);
INSERT INTO lager.artikel VALUES (1, 'Schraube'), (2, 'Mutter');

SELECT id, name FROM lager.artikel ORDER BY id;
-- id | name
-- 1  | Schraube
-- 2  | Mutter

-- Kein CASCADE: erst die Objekte, dann das Schema löschen
DROP TABLE lager.artikel;
DROP SCHEMA lager;
`),
        note: 'Standardschema ist `dbo`. `CREATE SCHEMA` muss die erste Anweisung eines Batches sein; `DROP SCHEMA` geht nur bei leerem Schema.',
        mdn: MS + 'statements/create-schema-transact-sql'
      },
      sqlite: {
        syntax: "ATTACH DATABASE 'datei.db' AS name;",
        example: e(`
-- Statt Schemas: weitere Datenbanken anhängen (hier im Speicher)
ATTACH DATABASE ':memory:' AS lager;

CREATE TABLE lager.artikel (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO lager.artikel VALUES (1, 'Schraube'), (2, 'Mutter');

SELECT id, name FROM lager.artikel ORDER BY id;
-- id | name
-- 1  | Schraube
-- 2  | Mutter

DETACH DATABASE lager;
`),
        note: 'Kein `CREATE SCHEMA`. Die Präfixe sind `main`, `temp` und die Namen per `ATTACH` angehängter Datenbanken.',
        mdn: SL + 'lang_attach.html'
      }
    },
    tip: 'Mehrmandanten-Anwendungen nutzen oft ein Schema pro Mandant; ab einigen Hundert Schemas wird das allerdings unhandlich.',
    keywords: ['schema', 'namensraum', 'namespace', 'search_path', 'public', 'dbo'],
    related: ['CREATE DATABASE', 'information_schema', 'Benutzer & Rollen'],
    mdn: PG + 'ddl-schemas.html'
  },
  {
    lang: 'sql', group: 'Schemas & Katalog', name: 'information_schema',
    desc: 'Standardisierte Sicht auf den Systemkatalog: Tabellen, Spalten, Constraints.',
    details: 'Das `information_schema` ist eine Sammlung von Views, die der SQL-Standard definiert. Damit lassen sich Tabellen, Spalten, Typen und Constraints portabel abfragen, z. B. für Migrationswerkzeuge oder Dokumentation. Es zeigt nur Objekte, auf die man Rechte hat. Systemspezifische Details liefern die eigenen Kataloge der Dialekte.',
    values: [
      ['tables', 'Alle Tabellen und Views (table_type)'],
      ['columns', 'Spalten mit data_type, is_nullable, column_default'],
      ['table_constraints', 'Primär-, Fremdschlüssel, UNIQUE, CHECK'],
      ['key_column_usage', 'Welche Spalten zu welchem Schlüssel gehören'],
      ['views', 'View-Definitionen']
    ],
    dialects: {
      std: {
        syntax: 'SELECT … FROM information_schema.tables | columns | table_constraints | …;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL, stadt VARCHAR(50));

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'kunden'
ORDER BY ordinal_position;
-- column_name | data_type         | is_nullable
-- id          | integer           | NO
-- name        | character varying | NO
-- stadt       | character varying | YES
`)
      },
      pg: { note: 'Tabellen eines Schemas: `WHERE table_schema = \'public\'`. Mehr Details im eigenen Katalog `pg_catalog` (z. B. `pg_class`, `pg_indexes`); in psql zeigt `\\d kunden` die Struktur.', mdn: PG + 'information-schema.html' },
      mysql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name VARCHAR(50) NOT NULL, stadt VARCHAR(50));

SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = DATABASE();
-- table_name | table_type
-- kunden     | BASE TABLE

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = DATABASE() AND table_name = 'kunden'
ORDER BY ordinal_position;
-- column_name | data_type | is_nullable
-- id          | int       | NO
-- name        | varchar   | NO
-- stadt       | varchar   | YES
`),
        note: '`table_schema` ist der Datenbankname – ohne diesen Filter sieht man die Tabellen aller Datenbanken. Kurzformen: `SHOW TABLES`, `SHOW COLUMNS FROM kunden`.',
        mdn: MY + 'information-schema.html'
      },
      mssql: {
        example: e(`
CREATE TABLE kunden (id INT PRIMARY KEY, name NVARCHAR(50) NOT NULL, stadt NVARCHAR(50));

SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_type = 'BASE TABLE';
-- table_schema | table_name
-- dbo          | kunden

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'kunden'
ORDER BY ordinal_position;
-- column_name | data_type | is_nullable
-- id          | int       | NO
-- name        | nvarchar  | NO
-- stadt       | nvarchar  | YES
`),
        note: 'Gilt pro Datenbank. Mehr Details liefern die Katalogsichten `sys.tables`, `sys.columns`, `sys.indexes`; kurz: `EXEC sp_help \'kunden\'`.',
        mdn: 'https://learn.microsoft.com/en-us/sql/relational-databases/system-information-schema-views/system-information-schema-views-transact-sql'
      },
      sqlite: { none: 'Kein `information_schema`. Stattdessen `sqlite_schema` (alle Objekte samt SQL) und Pragma-Funktionen wie `pragma_table_info(\'kunden\')`.', mdn: SL + 'schematab.html' }
    },
    tip: 'Für portable Werkzeuge (Migrationen, Doku-Generatoren) das `information_schema` nutzen, für Detailfragen den Katalog des jeweiligen Systems.',
    keywords: ['systemkatalog', 'metadaten', 'catalog', 'tabellen auflisten', 'spalten auflisten', 'information schema', 'sys.tables'],
    related: ['sqlite_schema', 'PRAGMA (SQLite)', 'CREATE SCHEMA'],
    mdn: PG + 'information-schema.html'
  },
  {
    lang: 'sql', group: 'Schemas & Katalog', name: 'sqlite_schema',
    desc: 'Systemtabelle von SQLite mit allen Tabellen, Indizes, Views und Triggern samt SQL.',
    details: 'Jede SQLite-Datenbank enthält die Tabelle `sqlite_schema` (vor Version 3.33 `sqlite_master`, der alte Name funktioniert weiterhin). Die Spalte `type` unterscheidet `table`, `index`, `view` und `trigger`, die Spalte `sql` enthält die ursprüngliche `CREATE`-Anweisung. Automatisch erzeugte Indizes (z. B. für `UNIQUE`) heißen `sqlite_autoindex_…` und haben kein SQL.',
    values: [
      ['type', 'table, index, view oder trigger'],
      ['name', 'Name des Objekts'],
      ['tbl_name', 'Tabelle, zu der ein Index oder Trigger gehört'],
      ['sql', 'Die CREATE-Anweisung (NULL bei Auto-Indizes)'],
      ['temp.sqlite_schema', 'Objekte der temporären Datenbank']
    ],
    dialects: {
      std: { none: 'SQLite-spezifisch. Standardkonform ist das `information_schema`.' },
      pg: { none: 'Entspricht `information_schema.tables` bzw. den Katalogen `pg_class`, `pg_indexes`, `pg_views`; die `CREATE`-Anweisung liefern `pg_get_viewdef()`, `pg_get_indexdef()` oder `pg_dump --schema-only`.' },
      mysql: { none: 'Entspricht `information_schema.tables`; die `CREATE`-Anweisung liefert `SHOW CREATE TABLE name`.' },
      mssql: { none: 'Entspricht `sys.objects` bzw. `sys.tables`, `sys.indexes`, `sys.views`; die Definition liefert `OBJECT_DEFINITION(OBJECT_ID(\'name\'))` (für Views, Prozeduren, Trigger).' },
      sqlite: {
        syntax: 'SELECT type, name, tbl_name, sql FROM sqlite_schema;',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE);
CREATE INDEX idx_kunden_name ON kunden (name);
CREATE VIEW v_kunden AS SELECT id, name FROM kunden;

SELECT type, name, tbl_name FROM sqlite_schema ORDER BY type, name;
-- type  | name                      | tbl_name
-- index | idx_kunden_name           | kunden
-- index | sqlite_autoindex_kunden_1 | kunden
-- table | kunden                    | kunden
-- view  | v_kunden                  | v_kunden

SELECT sql FROM sqlite_schema WHERE name = 'v_kunden';
-- sql
-- CREATE VIEW v_kunden AS SELECT id, name FROM kunden
`),
        note: 'Im Kommandozeilenwerkzeug liefern `.tables` und `.schema kunden` dieselben Informationen bequemer.',
        mdn: SL + 'schematab.html'
      }
    },
    tip: 'Zum schnellen Prüfen, ob eine Tabelle existiert: `SELECT COUNT(*) FROM sqlite_schema WHERE type = \'table\' AND name = \'kunden\'`.',
    keywords: ['sqlite_master', 'sqlite schema', 'tabellen auflisten', 'metadaten', 'systemtabelle', '.schema'],
    related: ['PRAGMA (SQLite)', 'information_schema', 'DROP INDEX'],
    mdn: SL + 'schematab.html'
  },
  {
    lang: 'sql', group: 'Schemas & Katalog', name: 'PRAGMA (SQLite)',
    desc: 'SQLite-spezifische Befehle zum Abfragen von Metadaten und Setzen von Optionen.',
    details: 'Mit `PRAGMA` liest und setzt man Einstellungen der Verbindung (z. B. `foreign_keys`, `journal_mode`) und fragt Strukturinformationen ab (`table_info`, `index_list`, `foreign_key_list`). Viele Informations-Pragmas gibt es auch als Tabellenfunktion (`pragma_table_info(\'t\')`), die sich in normalen `SELECT`s mit `WHERE` und `JOIN` nutzen lässt. Wichtig: `PRAGMA foreign_keys = ON` gilt nur für die aktuelle Verbindung und muss bei jedem Öffnen gesetzt werden.',
    values: [
      ['foreign_keys = ON', 'Fremdschlüssel prüfen (Standard: aus!)'],
      ['journal_mode = WAL', 'Write-Ahead-Log: Leser blockieren Schreiber nicht'],
      ['table_info(t)', 'Spalten: cid, name, type, notnull, dflt_value, pk'],
      ['index_list(t)', 'Indizes einer Tabelle'],
      ['foreign_key_list(t)', 'Fremdschlüssel einer Tabelle'],
      ['integrity_check', 'Datenbankdatei auf Beschädigung prüfen']
    ],
    dialects: {
      std: { none: 'SQLite-spezifisch. Metadaten liefert standardkonform das `information_schema`, Einstellungen sind systemabhängig.' },
      pg: { none: 'Einstellungen mit `SET name = wert` / `SHOW name`, Strukturinfos über `information_schema` oder `pg_catalog`.' },
      mysql: { none: 'Einstellungen mit `SET [SESSION] name = wert` / `SHOW VARIABLES LIKE …`, Strukturinfos über `SHOW COLUMNS`, `SHOW INDEX` oder `information_schema`.' },
      mssql: { none: 'Einstellungen mit `SET …` bzw. `ALTER DATABASE … SET …`, Strukturinfos über `sp_help`, `sys.columns` oder `information_schema`.' },
      sqlite: {
        syntax: 'PRAGMA name;\nPRAGMA name = wert;\nSELECT … FROM pragma_name(\'tabelle\');',
        example: e(`
CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT NOT NULL, stadt TEXT DEFAULT 'Berlin');

PRAGMA foreign_keys;
-- foreign_keys
-- 1

SELECT name, type, "notnull", dflt_value, pk
FROM pragma_table_info('kunden')
ORDER BY cid;
-- name  | type    | notnull | dflt_value | pk
-- id    | INTEGER | 0       | NULL       | 1
-- name  | TEXT    | 1       | NULL       | 0
-- stadt | TEXT    | 0       | 'Berlin'   | 0
`),
        mdn: SL + 'pragma.html'
      }
    },
    tip: 'Unbekannte Pragmas ignoriert SQLite stillschweigend – ein Tippfehler bleibt also ohne Fehlermeldung.',
    keywords: ['pragma', 'table_info', 'foreign_keys', 'journal_mode', 'wal', 'sqlite einstellungen', 'metadaten'],
    related: ['sqlite_schema', 'FOREIGN KEY', 'information_schema'],
    mdn: SL + 'pragma.html'
  },
  {
    lang: 'sql', group: 'Schemas & Katalog', name: 'ATTACH DATABASE (SQLite)',
    desc: 'Hängt eine weitere SQLite-Datenbankdatei an die Verbindung an.',
    details: 'Nach `ATTACH` sind die Tabellen der zweiten Datei unter dem Alias ansprechbar (`archiv.bestellungen`); so lassen sich Daten zwischen Dateien kopieren oder per Join kombinieren. Die Hauptdatenbank heißt `main`, temporäre Objekte liegen in `temp`. Transaktionen über mehrere angehängte Dateien sind atomar (außer im WAL-Modus). Mit `DETACH` wird die Datei wieder gelöst.',
    dialects: {
      std: { none: 'SQLite-spezifisch. Am ehesten entsprechen dem Schemas (`CREATE SCHEMA`).' },
      pg: { none: 'Eine Verbindung sieht nur eine Datenbank. Für Zugriffe auf andere Datenbanken dienen Schemas oder die Erweiterungen `postgres_fdw` bzw. `dblink`.' },
      mysql: { none: 'Nicht nötig: Andere Datenbanken desselben Servers spricht man direkt als `datenbank.tabelle` an.' },
      mssql: { none: 'Nicht nötig: Andere Datenbanken desselben Servers spricht man mit dreiteiligen Namen an (`archiv.dbo.bestellungen`), andere Server über Linked Server.' },
      sqlite: {
        syntax: "ATTACH DATABASE 'datei.db' AS alias;\nDETACH DATABASE alias;",
        example: e(`
CREATE TABLE bestellungen (id INTEGER PRIMARY KEY, betrag NUMERIC, datum TEXT);
INSERT INTO bestellungen (betrag, datum) VALUES
  (100, '2024-05-01'), (80, '2025-03-10'), (50, '2026-01-20');

ATTACH DATABASE ':memory:' AS archiv;   -- sonst z. B. 'archiv.db'

CREATE TABLE archiv.bestellungen AS
SELECT * FROM main.bestellungen WHERE datum < '2025-01-01';
DELETE FROM main.bestellungen WHERE datum < '2025-01-01';

SELECT 'main' AS db, COUNT(*) AS anzahl FROM main.bestellungen
UNION ALL
SELECT 'archiv', COUNT(*) FROM archiv.bestellungen;
-- db     | anzahl
-- main   | 2
-- archiv | 1

DETACH DATABASE archiv;
`),
        mdn: SL + 'lang_attach.html'
      }
    },
    tip: 'Mit `ATTACH` und `INSERT … SELECT` lassen sich Daten am schnellsten zwischen zwei SQLite-Dateien übertragen.',
    keywords: ['attach', 'detach', 'mehrere datenbanken', 'sqlite datei', 'datenbank anhängen', 'main', 'temp'],
    related: ['CREATE DATABASE', 'CREATE SCHEMA', 'INSERT … SELECT'],
    mdn: SL + 'lang_attach.html'
  },
  {
    lang: 'sql', group: 'Schemas & Katalog', name: 'Sequenzen',
    desc: 'Eigenständige Zahlengeneratoren, die fortlaufende, eindeutige Werte liefern.',
    details: 'Eine Sequenz ist ein Datenbankobjekt, das bei jedem Abruf die nächste Zahl liefert – auch über Transaktionen hinweg ohne Doppelvergabe. Identitätsspalten nutzen intern Sequenzen. Eigene Sequenzen eignen sich für Nummern, die mehrere Tabellen teilen, oder für fachliche Nummernkreise. Werte werden bei `ROLLBACK` nicht zurückgegeben, daher entstehen Lücken.',
    dialects: {
      std: {
        syntax: 'CREATE SEQUENCE name [AS typ] [START WITH n] [INCREMENT BY m];\nNEXT VALUE FOR name',
        example: e(`
CREATE SEQUENCE rechnung_nr AS INTEGER START WITH 1000 INCREMENT BY 1;

CREATE TABLE rechnungen (nr INTEGER PRIMARY KEY, betrag DECIMAL(10,2));
INSERT INTO rechnungen VALUES (NEXT VALUE FOR rechnung_nr, 99.50);
INSERT INTO rechnungen VALUES (NEXT VALUE FOR rechnung_nr, 20.00);

SELECT nr, betrag FROM rechnungen ORDER BY nr;
-- nr   | betrag
-- 1000 | 99.50
-- 1001 | 20.00
`),
        nocheck: true,
        note: 'PostgreSQL kennt `NEXT VALUE FOR` nicht (dort `nextval()`), deshalb läuft dieses Beispiel in SQL Server, aber nicht in PostgreSQL.'
      },
      pg: {
        syntax: "CREATE SEQUENCE name [START WITH n] [INCREMENT BY m];\nSELECT nextval('name'), currval('name');",
        example: e(`
CREATE SEQUENCE rechnung_nr START WITH 1000 INCREMENT BY 1;

CREATE TABLE rechnungen (
  nr     BIGINT PRIMARY KEY DEFAULT nextval('rechnung_nr'),
  betrag NUMERIC(10,2)
);
INSERT INTO rechnungen (betrag) VALUES (99.50), (20.00);

SELECT nextval('rechnung_nr') AS naechste, currval('rechnung_nr') AS aktuell;
-- naechste | aktuell
-- 1002     | 1002

SELECT nr, betrag FROM rechnungen ORDER BY nr;
-- nr   | betrag
-- 1000 | 99.50
-- 1001 | 20.00
`),
        note: '`currval` liefert den zuletzt in dieser Sitzung geholten Wert, `setval(\'name\', n)` setzt die Sequenz. Identitätsspalten und `SERIAL` nutzen intern Sequenzen.',
        mdn: PG + 'sql-createsequence.html'
      },
      mysql: { none: 'Keine Sequenzen. Stattdessen `AUTO_INCREMENT` pro Tabelle; für einen tabellenübergreifenden Zähler eine Hilfstabelle mit `AUTO_INCREMENT` nutzen.' },
      mssql: {
        syntax: 'CREATE SEQUENCE name [AS typ] START WITH n INCREMENT BY m;\nNEXT VALUE FOR name',
        example: e(`
CREATE SEQUENCE rechnung_nr AS INT START WITH 1000 INCREMENT BY 1;

CREATE TABLE rechnungen (nr INT PRIMARY KEY, betrag DECIMAL(10,2));
INSERT INTO rechnungen VALUES (NEXT VALUE FOR rechnung_nr, 99.50);
INSERT INTO rechnungen VALUES (NEXT VALUE FOR rechnung_nr, 20.00);

SELECT nr, betrag FROM rechnungen ORDER BY nr;
-- nr   | betrag
-- 1000 | 99.50
-- 1001 | 20.00
`),
        note: 'Seit SQL Server 2012; auch als Default möglich: `nr INT DEFAULT NEXT VALUE FOR rechnung_nr`. Ohne `AS` ist der Typ `BIGINT`.',
        mdn: MS + 'statements/create-sequence-transact-sql'
      },
      sqlite: { none: 'Keine Sequenzen. Stattdessen `INTEGER PRIMARY KEY`; für einen eigenen Zähler eine Hilfstabelle per `UPDATE … RETURNING` hochzählen.' }
    },
    tip: 'Für lückenlose Nummern (z. B. Rechnungsnummern mit gesetzlicher Vorgabe) sind Sequenzen ungeeignet; dafür einen Zähler in einer Tabelle unter Sperre hochzählen.',
    keywords: ['sequence', 'sequenz', 'nextval', 'currval', 'nummernkreis', 'zähler', 'next value for'],
    related: ['IDENTITY', 'Auto-Increment', 'Sperren'],
    mdn: PG + 'sql-createsequence.html'
  }
  );
})();
