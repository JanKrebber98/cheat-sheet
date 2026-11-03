# HTML & CSS Cheat Sheet

Persönliches Nachschlagewerk für HTML-Elemente, Attribute, CSS-Eigenschaften, Selektoren, At-Regeln, Einheiten und Funktionen. Jeder Eintrag hat eine Kurzbeschreibung, eine Erklärung, Syntax, mögliche Werte, ein kopierbares Beispiel und bei visuellen Themen eine Live-Vorschau.

## Benutzen

`index.html` im Browser öffnen. Kein Build, kein Server nötig.

- `/` springt in die Suche, `Esc` leert sie
- Oben zwischen **Alle**, **HTML** und **CSS** filtern
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
