# Web Cheat Sheet

Persönliches Nachschlagewerk für HTML, CSS, JavaScript und TypeScript. Jeder Eintrag hat eine Kurzbeschreibung, eine Erklärung, Syntax, mögliche Werte und ein kopierbares Beispiel. Visuelle HTML/CSS-Themen haben eine Live-Vorschau, JavaScript-Beispiele lassen sich mit „Code ausführen“ in einer Sandbox starten (Konsolenausgabe direkt darunter).

## Benutzen

`index.html` im Browser öffnen. Kein Build, kein Server nötig.

- `/` springt in die Suche, `Esc` leert sie
- Oben zwischen **Alle**, **HTML**, **CSS**, **JS** und **TS** filtern
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
```

## Einträge hinzufügen

Schema und Beispiel stehen in [data/_TEMPLATE.md](data/_TEMPLATE.md). Danach prüfen:

```sh
node scripts/validate.js
```
