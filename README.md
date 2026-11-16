# Cheat Sheet

Persönliches Nachschlagewerk für HTML, CSS, JavaScript, TypeScript, Java, Python und SQL. Jeder Eintrag hat eine Kurzbeschreibung, eine Erklärung, Syntax, mögliche Werte und ein kopierbares Beispiel. Visuelle HTML/CSS-Themen haben eine Live-Vorschau, JavaScript-Beispiele lassen sich mit „Code ausführen“ in einer Sandbox starten (Konsolenausgabe direkt darunter).

## Benutzen

`index.html` im Browser öffnen. Kein Build, kein Server nötig.

- `/` springt in die Suche, `Esc` leert sie
- Oben zwischen **Alle**, **HTML**, **CSS**, **JS**, **TS**, **Java**, **Py** und **SQL** filtern
- Bei **SQL** wählt die Dialekt-Leiste über der Liste Standard, PostgreSQL, MySQL, SQL Server oder SQLite: Einträge, die es dort nicht gibt, werden ausgeblendet, und jeder Eintrag öffnet den passenden Tab
- Eintrag anklicken zum Aufklappen; die Adresse (`#css-display`) lässt sich als Lesezeichen speichern
- Hell/Dunkel über den Mond-Knopf

## Aufbau

```
index.html            Seite und Reihenfolge der Datendateien
assets/styles.css     Gestaltung
assets/app.js         Suche, Filter, Rendering, Vorschau
data/*.js             Inhalte (ein Array window.CHEAT)
data/_TEMPLATE.md     Schema für neue Einträge
scripts/validate.js   Prüft alle Einträge
scripts/check-java.js Kompiliert alle Java-Beispiele (braucht ein JDK 25)
scripts/check-python.js Führt alle Python-Beispiele aus (braucht Python 3.14)
scripts/check-sql.js    Führt alle SQL-Beispiele je Dialekt aus (Docker + Python, siehe unten)
scripts/sql_runner.py   Hilfsskript von check-sql.js
```

## Einträge hinzufügen

Schema und Beispiel stehen in [data/_TEMPLATE.md](data/_TEMPLATE.md). Danach prüfen:

```sh
node scripts/validate.js
```

Prüfskripte für die Beispiele: `check-java.js`, `check-python.js`, `check-sql.js` (jeweils mit Dateifilter und `--run`, Details im Kopf der Datei).

### SQL-Beispiele prüfen

`check-sql.js` führt jedes Beispiel in einer frischen Datenbank des jeweiligen Dialekts aus und vergleicht die Ergebniskommentare mit der echten Ausgabe. Der Standard-Tab läuft in PostgreSQL. Für das Cheat Sheet selbst ist nichts davon nötig – nur zum Prüfen geänderter oder neuer SQL-Einträge.

**Voraussetzungen**

- **Python** mit den Datenbank-Treibern aus [requirements-sql.txt](requirements-sql.txt). Einmalig einrichten (PowerShell, im Projektordner):

  ```powershell
  python -m venv .venv-sql
  .venv-sql\Scripts\pip install -r requirements-sql.txt
  ```

  Die `.venv-sql` nutzt das Skript automatisch (sie ist in `.gitignore`). Alternativ global mit `pip install -r requirements-sql.txt` oder einen anderen Interpreter über `SQL_PYTHON` angeben.
- **Docker Desktop** muss laufen. Die Container startet das Skript beim ersten Aufruf selbst (der erste Download dauert, zusammen ca. 3 GB):
  - `cheat-sql-pg` – postgres:18, Port 55432
  - `cheat-sql-mysql` – mysql:8.4, Port 53306
  - `cheat-sql-mssql` – mcr.microsoft.com/mssql/server:2022-latest, Port 51433, startet mit `ACCEPT_EULA=Y` (Developer Edition, damit gelten Microsofts Lizenzbedingungen)

  Ohne Docker lässt sich nur SQLite prüfen: `--dialect=sqlite`.

**Aufruf**

```sh
node scripts/check-sql.js                                   # alle Dateien, alle Dialekte
node scripts/check-sql.js sql-queries                       # nur eine Datei
node scripts/check-sql.js sql-queries --dialect=mysql,sqlite --run   # bestimmte Dialekte, Ergebnisse anzeigen
node scripts/check-sql.js --stop                            # danach die Container stoppen
```

Ergebniskommentare im Beispiel: direkt unter der Abfrage ein Kommentarblock, erste Zeile die Spaltennamen, Zellen mit `|` getrennt (Schema in [data/_TEMPLATE.md](data/_TEMPLATE.md)).
