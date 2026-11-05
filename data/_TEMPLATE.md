# Datenschema für Einträge

Jede Datei in `data/` beginnt mit `window.CHEAT = window.CHEAT || [];` und hängt Einträge per `window.CHEAT.push({...}, {...});` an.
Die Reihenfolge der Einträge bestimmt die Reihenfolge in der Seite; die Gruppen erscheinen in der Reihenfolge ihres ersten Eintrags.

Alle Texte auf Deutsch. Code-Namen im Fließtext in Backticks: `display: flex`. Kein anderes Markdown, kein HTML im Fließtext (wird escaped).

| Feld | Pflicht | Inhalt |
|---|---|---|
| `lang` | ja | `"html"`, `"css"`, `"js"`, `"ts"` oder `"java"` |
| `group` | ja | Kategorie, z. B. `"Textstruktur"`, `"Flexbox"` |
| `name` | ja | So wie man es schreibt: `"<p>"`, `"href"`, `"display"`, `":hover"`, `"@media"`, `"rem"`, `"calc()"` |
| `desc` | ja | Ein Satz, max. ~90 Zeichen: was es ist |
| `details` | ja | 2–4 Sätze: was es macht, wann und wie man es benutzt, typische Fallstricke |
| `syntax` | nein | Allgemeine Schreibweise |
| `values` | nein | `[["wert", "Bedeutung"], ...]` – mögliche Werte bzw. wichtige Attribute |
| `example` | ja | Realistisches, kopierbares Beispiel |
| `exampleLang` | nein | `"html"`, `"css"`, `"js"`, `"ts"` oder `"java"`, falls Beispielsprache ≠ `lang` (Prism-Hervorhebung) |
| `demo` | nein | HTML-Fragment (darf `<style>` enthalten, **kein** `<script>`), wird in der Live-Vorschau gerendert. Für alles Visuelle angeben. Bei `run: true` ist es das Markup, auf dem das Beispiel arbeitet. |
| `run` | nein | Nur `lang: "js"`: `true` = `example` wird beim Klick auf „Code ausführen“ in einer Sandbox als `<script type="module">` ausgeführt, `console.log`-Ausgaben und Fehler erscheinen darunter. Top-level `await` geht, `import`/`export` nicht. Kein `alert`/`prompt`. Ausgaben mit `console.log` sichtbar machen. |
| `nocheck` | nein | Nur `lang: "java"`: `true` = `scripts/check-java.js` überspringt das Beispiel. Nur für Code, der allein nicht kompilieren kann (`module-info.java`, mehrere Dateien, fremde Bibliotheken, Preview-Features). Eingebettete Shell- und XML-Beispiele bekommen `exampleLang` und werden ebenfalls übersprungen. |
| `tip` | nein | Ein Praxistipp oder häufiger Fehler |
| `keywords` | nein | Suchbegriffe (Synonyme, deutsch/englisch) |
| `related` | nein | Namen verwandter Einträge, exakt wie deren `name` |
| `initial` | nein | (CSS) Standardwert |
| `inherited` | nein | (CSS) `true`/`false` |
| `display` | nein | (HTML) `"block"`, `"inline"`, `"inline-block"`, `"none"` … |
| `deprecated` | nein | `true` bei veralteten Elementen/Eigenschaften |
| `mdn` | nein | Link auf `https://developer.mozilla.org/de/docs/...` (bei TypeScript: `https://www.typescriptlang.org/docs/...`, bei Java: `https://docs.oracle.com/en/java/javase/25/...` oder `https://dev.java/...`) |

## Beispiel

```js
window.CHEAT.push({
  lang: 'css',
  group: 'Flexbox',
  name: 'justify-content',
  desc: 'Verteilt Flex- bzw. Grid-Elemente entlang der Hauptachse.',
  details: 'Wirkt auf den Container (`display: flex` oder `grid`) und legt fest, wie freier Platz auf der Hauptachse verteilt wird. Bei `flex-direction: row` ist das die Horizontale, bei `column` die Vertikale.',
  syntax: 'justify-content: <wert>;',
  values: [
    ['flex-start', 'Alles an den Anfang (Standard)'],
    ['center', 'Zentriert'],
    ['space-between', 'Erstes und letztes Element am Rand, Rest gleichmäßig dazwischen']
  ],
  initial: 'normal',
  inherited: false,
  example: '.nav {\n  display: flex;\n  justify-content: space-between;\n}',
  demo: '<style>.box{display:flex;justify-content:space-between;background:#eef;padding:8px}.box div{background:#b4367a;color:#fff;padding:8px 12px}</style><div class="box"><div>1</div><div>2</div><div>3</div></div>',
  tip: 'Für die Querachse ist `align-items` zuständig.',
  keywords: ['ausrichten', 'zentrieren', 'horizontal'],
  related: ['align-items', 'gap', 'display'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/justify-content'
});
```
