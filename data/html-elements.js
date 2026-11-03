window.CHEAT = window.CHEAT || [];

window.CHEAT.push({
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<!DOCTYPE html>',
  desc: 'Deklariert das Dokument als HTML5 und aktiviert den Standardmodus.',
  details: 'Muss in der allerersten Zeile eines HTML-Dokuments stehen. Ohne Doctype schaltet der Browser in den Quirks-Modus und rendert nach alten, uneinheitlichen Regeln. Die Schreibweise ist nicht case-sensitiv, üblich ist `<!DOCTYPE html>`. Es ist kein Element, sondern eine Dokumenttyp-Deklaration ohne schließendes Tag.',
  syntax: '<!DOCTYPE html>',
  example: '<!DOCTYPE html>\n<html lang="de">\n  <head>\n    <meta charset="utf-8">\n    <title>Meine Seite</title>\n  </head>\n  <body>\n    <p>Hallo Welt</p>\n  </body>\n</html>',
  tip: 'Vor dem Doctype dürfen nur Kommentare und Leerraum stehen, sonst droht der Quirks-Modus.',
  keywords: ['doctype', 'html5', 'quirks', 'standardmodus', 'dokumenttyp'],
  related: ['<html>', '<head>'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Doctype'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<html>',
  desc: 'Wurzelelement, das das gesamte HTML-Dokument umschließt.',
  details: 'Alle anderen Elemente sind Nachfahren von `<html>`; es enthält genau ein `<head>` gefolgt von genau einem `<body>`. Das Attribut `lang` sollte immer gesetzt werden, damit Screenreader, Übersetzungsdienste und Silbentrennung die Sprache kennen. Auch Pseudoklassen wie `:root` und `:lang()` beziehen sich auf dieses Element.',
  values: [
    ['lang', 'Sprache des Dokuments, z. B. `de`, `en`, `de-AT`'],
    ['dir', 'Textrichtung: `ltr`, `rtl` oder `auto`']
  ],
  example: '<!DOCTYPE html>\n<html lang="de">\n  <head>…</head>\n  <body>…</body>\n</html>',
  tip: 'Wechselt die Sprache mitten im Text, setze `lang` zusätzlich am betroffenen Element.',
  keywords: ['root', 'wurzel', 'lang', 'sprache'],
  related: ['<!DOCTYPE html>', '<head>', '<body>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/html'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<head>',
  desc: 'Container für Metadaten des Dokuments, die nicht direkt angezeigt werden.',
  details: 'Enthält `<title>`, `<meta>`, `<link>`, `<style>`, `<script>` und `<base>`. Der Inhalt erscheint nicht im Seitenfenster, steuert aber Zeichensatz, Titel, Stylesheets, Social-Media-Vorschau und Suchmaschinen-Infos. Ein `<title>` ist Pflicht, und `<meta charset>` sollte innerhalb der ersten 1024 Bytes stehen.',
  example: '<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Meine Seite</title>\n  <link rel="stylesheet" href="style.css">\n</head>',
  keywords: ['metadaten', 'kopf', 'metadata'],
  related: ['<title>', '<meta>', '<link>', '<body>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/head'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<body>',
  desc: 'Enthält den gesamten sichtbaren Inhalt des Dokuments.',
  details: 'Pro Dokument gibt es genau ein `<body>`, direkt nach dem `<head>`. Alles, was der Nutzer sieht oder bedient, steht hier. Präsentationsattribute wie `bgcolor` oder `text` sind veraltet, Gestaltung gehört ins CSS.',
  display: 'block',
  example: '<body>\n  <header>…</header>\n  <main>…</main>\n  <footer>…</footer>\n</body>',
  tip: 'Der Standardrand von 8px stammt vom Browser-Stylesheet, nicht von HTML; mit `margin: 0` entfernbar.',
  keywords: ['inhalt', 'seitenkörper', 'content'],
  related: ['<html>', '<head>', '<main>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/body'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<title>',
  desc: 'Legt den Titel des Dokuments fest (Tab, Lesezeichen, Suchergebnis).',
  details: 'Der Text erscheint im Browser-Tab, in Lesezeichen, im Verlauf und als Überschrift in Suchergebnissen. Er darf nur reinen Text enthalten, keine Elemente. Jede Seite braucht einen eigenen, aussagekräftigen Titel; für Screenreader ist er das Erste, was vorgelesen wird.',
  example: '<head>\n  <title>HTML-Elemente – Spickzettel</title>\n</head>',
  tip: 'Etwa 50 bis 60 Zeichen, wichtigstes Stichwort zuerst, damit nichts abgeschnitten wird.',
  keywords: ['seitentitel', 'tab', 'seo'],
  related: ['<head>', '<meta>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/title'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<meta>',
  desc: 'Definiert Metadaten wie Zeichensatz, Viewport oder Beschreibung.',
  details: 'Ein Void-Element im `<head>` ohne schließendes Tag. Je nach Attribut-Kombination hat es unterschiedliche Aufgaben: `charset` für die Zeichenkodierung, `name` plus `content` für Metadaten, `http-equiv` für Header-Äquivalente. Ohne den Viewport-Eintrag rendern mobile Browser die Seite im Desktop-Layout.',
  values: [
    ['charset', 'Zeichenkodierung, praktisch immer `utf-8`'],
    ['name', 'Name der Metainformation, z. B. `viewport`, `description`, `robots`, `theme-color`'],
    ['content', 'Wert der Metainformation (zusammen mit `name` oder `http-equiv`)'],
    ['http-equiv', 'Entspricht einem HTTP-Header, z. B. `refresh` oder `content-security-policy`'],
    ['property', 'Open-Graph-Angaben wie `og:title` (kein HTML-Standard, aber weit verbreitet)']
  ],
  example: '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="description" content="Spickzettel für HTML und CSS">\n<meta name="robots" content="noindex">',
  tip: 'Die Meta-Description beeinflusst das Ranking nicht direkt, wird aber oft als Snippet angezeigt.',
  keywords: ['charset', 'viewport', 'description', 'seo', 'open graph', 'metadaten'],
  related: ['<head>', '<link>', '<title>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/meta'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<link>',
  desc: 'Verknüpft das Dokument mit einer externen Ressource, z. B. einem Stylesheet.',
  details: 'Ein Void-Element, das meist im `<head>` steht. Das Attribut `rel` bestimmt die Beziehung: Stylesheet, Favicon, Preload, Canonical und mehr. Stylesheets per `<link>` blockieren das Rendering, bis sie geladen sind; das ist gewollt, um ein ungestyltes Aufblitzen zu vermeiden.',
  values: [
    ['rel', 'Art der Beziehung: `stylesheet`, `icon`, `preload`, `preconnect`, `canonical`, `manifest`'],
    ['href', 'URL der Ressource'],
    ['as', 'Ressourcentyp bei `preload`, z. B. `font`, `style`, `image`'],
    ['media', 'Medienabfrage, ab der die Ressource gilt'],
    ['crossorigin', 'CORS-Modus; für Fonts bei `preload` nötig'],
    ['type', 'MIME-Typ der Ressource']
  ],
  example: '<link rel="stylesheet" href="style.css">\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="canonical" href="https://example.com/seite">',
  tip: 'Bei `preload` für Schriften ist `crossorigin` Pflicht, auch bei gleicher Domain, sonst wird die Datei doppelt geladen.',
  keywords: ['stylesheet', 'css einbinden', 'favicon', 'preload', 'canonical'],
  related: ['<style>', '<meta>', '<head>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/link'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<style>',
  desc: 'Bettet CSS-Regeln direkt im Dokument ein.',
  details: 'Meist im `<head>`, enthält ein Stylesheet als Text. Praktisch für kleine Seiten, kritisches CSS oder Demos; für größere Projekte ist eine externe Datei per `<link>` besser, weil sie gecacht werden kann. Die Regeln gelten für das ganze Dokument, nicht nur für die Umgebung des Elements.',
  values: [
    ['media', 'Medienabfrage, z. B. `print` oder `(min-width: 600px)`'],
    ['nonce', 'Kryptografischer Wert für eine Content Security Policy']
  ],
  example: '<style>\n  body {\n    font-family: system-ui, sans-serif;\n  }\n  a { color: #b4367a; }\n</style>',
  keywords: ['css', 'inline', 'eingebettet', 'internes stylesheet'],
  related: ['<link>', '<head>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/style'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<script>',
  desc: 'Bindet JavaScript ein oder lädt eine Skriptdatei.',
  details: 'Der Code steht entweder inline oder wird per `src` geladen; ein Element darf nicht beides. Klassische Skripte blockieren das Parsen, bis sie geladen und ausgeführt sind. Mit `defer` oder `type="module"` laufen sie erst nach dem Parsen, mit `async` sobald sie geladen sind, in beliebiger Reihenfolge.',
  values: [
    ['src', 'URL der Skriptdatei'],
    ['defer', 'Lädt parallel, führt nach dem Parsen in Reihenfolge aus'],
    ['async', 'Lädt parallel, führt sofort nach dem Laden aus (Reihenfolge unbestimmt)'],
    ['type', '`module` für ES-Module, `importmap`, oder ein Nicht-JS-Typ für Datenblöcke wie `application/ld+json`'],
    ['integrity', 'Hash für Subresource Integrity'],
    ['nomodule', 'Wird nur von Browsern ohne Modul-Unterstützung ausgeführt']
  ],
  example: '<script src="app.js" defer></script>\n<script type="module" src="main.js"></script>\n<script type="application/ld+json">\n  { "@context": "https://schema.org", "@type": "WebSite" }\n</script>',
  tip: 'Im Zweifel `defer` verwenden. `async` ist nur für unabhängige Skripte wie Statistik sinnvoll.',
  keywords: ['javascript', 'js', 'defer', 'async', 'module'],
  related: ['<noscript>', '<head>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/script'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<noscript>',
  desc: 'Alternativer Inhalt für den Fall, dass JavaScript fehlt oder deaktiviert ist.',
  details: 'Im `<body>` kann beliebiger Fließinhalt enthalten sein, der nur ohne aktives Scripting angezeigt wird. Im `<head>` sind nur `<link>`, `<style>` und `<meta>` erlaubt. Es erkennt nicht, ob ein Skript fehlschlägt, sondern nur, ob Scripting abgeschaltet ist.',
  example: '<noscript>\n  <p>Bitte aktiviere JavaScript, um die Karte zu sehen.</p>\n</noscript>',
  keywords: ['kein javascript', 'fallback', 'js deaktiviert'],
  related: ['<script>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/noscript'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<base>',
  desc: 'Legt die Basis-URL und das Standardziel für alle relativen Links fest.',
  details: 'Darf höchstens einmal im `<head>` stehen, vor allen Elementen mit URLs. Relative Pfade in `href`, `src` oder `action` werden gegen diese Basis aufgelöst. Achtung: Auch reine Anker wie `#abschnitt` beziehen sich dann auf die Basis-URL und nicht mehr auf die aktuelle Seite.',
  values: [
    ['href', 'Basis-URL für relative Adressen'],
    ['target', 'Standard-Linkziel, z. B. `_blank`']
  ],
  example: '<head>\n  <base href="https://example.com/docs/" target="_blank">\n</head>',
  tip: 'Nur einsetzen, wenn nötig; `<base>` überrascht beim Debugging gern, weil es jeden relativen Link verändert.',
  keywords: ['basis url', 'relative links', 'target'],
  related: ['<a>', '<head>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/base'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<template>',
  desc: 'Hält HTML-Fragmente vor, die nicht gerendert, aber per JavaScript geklont werden.',
  details: 'Der Inhalt ist inert: Bilder werden nicht geladen, Skripte nicht ausgeführt und nichts wird angezeigt. Per JavaScript klont man `template.content` und fügt den Klon ins DOM ein. Mit `shadowrootmode` entsteht ein deklarativer Shadow DOM ohne JavaScript.',
  values: [
    ['shadowrootmode', '`open` oder `closed`: erzeugt deklarativ ein Shadow Root am Elternelement']
  ],
  display: 'none',
  example: '<template id="karte">\n  <article class="karte">\n    <h3></h3>\n    <p></p>\n  </article>\n</template>',
  keywords: ['vorlage', 'klonen', 'web components', 'shadow dom'],
  related: ['<slot>', '<script>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/template'
}, {
  lang: 'html',
  group: 'Dokumentstruktur',
  name: '<slot>',
  desc: 'Platzhalter in einem Shadow DOM, in den Inhalte von außen eingesetzt werden.',
  details: 'Wird in Web Components genutzt: Der Autor der Komponente definiert Slots, der Verwender füllt sie mit Kindelementen, die per `slot="name"` zugewiesen werden. Ein Slot ohne `name` ist der Standard-Slot. Der Inhalt zwischen den `<slot>`-Tags dient als Fallback, wenn nichts eingesetzt wird.',
  values: [
    ['name', 'Name des Slots; ohne Namen = Standard-Slot']
  ],
  display: 'contents',
  example: '<template id="profil">\n  <slot name="name">Unbekannt</slot>\n  <slot></slot>\n</template>\n\n<mein-profil>\n  <span slot="name">Ada</span>\n  <p>Mathematikerin</p>\n</mein-profil>',
  keywords: ['web components', 'shadow dom', 'platzhalter'],
  related: ['<template>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/slot'
});

window.CHEAT.push({
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<header>',
  desc: 'Einleitender Bereich einer Seite oder eines Abschnitts, z. B. mit Logo und Navigation.',
  details: 'Kann Überschriften, Logo, Suchfeld oder Autorenangaben enthalten. Direkt im `<body>` (nicht in `<article>`, `<section>` usw.) gilt es als Seitenkopf mit der ARIA-Rolle `banner`. Innerhalb von `<article>` oder `<section>` ist es nur der Kopf dieses Abschnitts. Darf nicht in `<footer>` oder `<address>` verschachtelt werden.',
  display: 'block',
  example: '<header>\n  <a href="/"><img src="logo.svg" alt="Startseite"></a>\n  <nav>…</nav>\n</header>',
  demo: '<style>.d-h{background:#b4367a;color:#fff;padding:10px 14px;display:flex;justify-content:space-between;border-radius:4px}</style><header class="d-h"><strong>Mein Blog</strong><span>Start | Kontakt</span></header>',
  keywords: ['kopfbereich', 'kopf', 'banner', 'seitenkopf'],
  related: ['<footer>', '<nav>', '<main>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/header'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<nav>',
  desc: 'Bereich mit Navigationslinks zu anderen Seiten oder Abschnitten.',
  details: 'Gedacht für Hauptnavigation, Inhaltsverzeichnis oder Breadcrumbs, nicht für jede beliebige Linkgruppe (z. B. Footer-Links). Screenreader können direkt zu Navigationsbereichen springen. Gibt es mehrere `<nav>`, unterscheide sie mit `aria-label`.',
  display: 'block',
  example: '<nav aria-label="Hauptmenü">\n  <ul>\n    <li><a href="/">Start</a></li>\n    <li><a href="/kontakt">Kontakt</a></li>\n  </ul>\n</nav>',
  demo: '<style>.d-n ul{display:flex;gap:16px;list-style:none;margin:0;padding:8px 12px;background:#eef}.d-n a{color:#b4367a}</style><nav class="d-n" aria-label="Demo"><ul><li><a href="#">Start</a></li><li><a href="#">Über uns</a></li><li><a href="#">Kontakt</a></li></ul></nav>',
  keywords: ['navigation', 'menü', 'menu', 'breadcrumb'],
  related: ['<ul>', '<a>', '<header>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/nav'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<main>',
  desc: 'Der zentrale Hauptinhalt der Seite.',
  details: 'Pro Seite darf nur ein sichtbares `<main>` existieren. Es enthält, was die Seite einzigartig macht, ohne wiederkehrende Elemente wie Header, Navigation oder Footer. Es dient als Sprungziel für Skip-Links und hat die ARIA-Rolle `main`. Es darf nicht in `<article>`, `<aside>`, `<header>`, `<footer>` oder `<nav>` stehen.',
  display: 'block',
  example: '<body>\n  <header>…</header>\n  <main id="inhalt">\n    <h1>Willkommen</h1>\n  </main>\n  <footer>…</footer>\n</body>',
  tip: 'Ein Skip-Link `<a href="#inhalt">Zum Inhalt</a>` am Seitenanfang hilft Tastaturnutzern.',
  keywords: ['hauptinhalt', 'content', 'skip link'],
  related: ['<header>', '<footer>', '<article>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/main'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<section>',
  desc: 'Thematisch zusammengehöriger Abschnitt, in der Regel mit eigener Überschrift.',
  details: 'Nutze es, wenn der Abschnitt in einer Gliederung auftauchen würde und ein Thema hat. Fehlt eine Überschrift, ist `<div>` meist die bessere Wahl. Erst mit einem zugänglichen Namen (Überschrift per `aria-labelledby`) wird es als Landmark `region` erkannt.',
  display: 'block',
  example: '<section aria-labelledby="preise">\n  <h2 id="preise">Preise</h2>\n  <p>Alle Tarife im Überblick.</p>\n</section>',
  demo: '<style>.d-s{border:1px solid #b4367a;padding:8px 12px;border-radius:4px}.d-s h2{margin:0 0 4px;font-size:18px}</style><section class="d-s"><h2>Preise</h2><p style="margin:0">Alle Tarife im Überblick.</p></section>',
  keywords: ['abschnitt', 'bereich', 'gliederung'],
  related: ['<article>', '<div>', '<h1>–<h6>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/section'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<article>',
  desc: 'Eigenständiger, für sich verständlicher Inhalt, z. B. Beitrag oder Produktkarte.',
  details: 'Der Inhalt sollte auch außerhalb der Seite sinnvoll sein, etwa in einem Feed oder per Syndikation. Typisch sind Blogposts, Nachrichten, Kommentare und Produktkarten. Artikel dürfen verschachtelt werden, z. B. Kommentare in einem Beitrag, und enthalten idealerweise eine Überschrift.',
  display: 'block',
  example: '<article>\n  <h2>Neues in CSS</h2>\n  <p>Container Queries sind da.</p>\n  <footer>Von Ada, <time datetime="2026-03-01">1. März 2026</time></footer>\n</article>',
  demo: '<style>.d-a{border:1px solid #ccc;padding:10px 14px;border-radius:6px}.d-a h3{margin:0 0 4px}</style><article class="d-a"><h3>Neues in CSS</h3><p style="margin:0">Container Queries sind da.</p></article>',
  keywords: ['beitrag', 'blogpost', 'artikel', 'eigenständig'],
  related: ['<section>', '<aside>', '<main>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/article'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<aside>',
  desc: 'Inhalt, der nur am Rande zum Hauptinhalt gehört, z. B. Seitenleiste oder Infokasten.',
  details: 'Typisch für Seitenleisten, Glossar-Boxen, verwandte Links oder Werbung. Der Inhalt ergänzt den Haupttext, bleibt aber auch ohne ihn verständlich. Außerhalb von `<article>` und `<section>` wird es als Landmark `complementary` erkannt. Es ist nicht für bloße Optik gedacht.',
  display: 'block',
  example: '<aside>\n  <h2>Verwandte Artikel</h2>\n  <ul>\n    <li><a href="/flexbox">Flexbox</a></li>\n  </ul>\n</aside>',
  demo: '<style>.d-as{background:#f6f0f4;border-left:4px solid #b4367a;padding:8px 12px}</style><aside class="d-as"><strong>Hinweis:</strong> Das ist ein Nebeninhalt.</aside>',
  keywords: ['seitenleiste', 'sidebar', 'randbemerkung', 'infobox'],
  related: ['<article>', '<section>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/aside'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<footer>',
  desc: 'Fußbereich einer Seite oder eines Abschnitts, z. B. mit Autor und Copyright.',
  details: 'Enthält typischerweise Copyright, Kontakt, Impressum-Links oder Autorenangaben. Direkt im `<body>` gilt es als Seitenfuß (Rolle `contentinfo`), in `<article>` oder `<section>` nur als Fuß dieses Abschnitts. Darf weder `<header>` noch `<footer>` enthalten.',
  display: 'block',
  example: '<footer>\n  <p>&copy; 2026 Beispiel GmbH</p>\n  <a href="/impressum">Impressum</a>\n</footer>',
  demo: '<style>.d-f{background:#333;color:#fff;padding:10px 14px;border-radius:4px;font-size:14px}</style><footer class="d-f">&copy; 2026 Beispiel GmbH &middot; Impressum</footer>',
  keywords: ['fußbereich', 'fuß', 'copyright', 'contentinfo'],
  related: ['<header>', '<main>', '<address>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/footer'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<address>',
  desc: 'Kontaktinformationen für das nächste `<article>` oder den gesamten Body.',
  details: 'Gedacht für Kontaktdaten der Person oder Organisation, die für das Dokument verantwortlich ist, etwa E-Mail, Telefon oder Adresse. Es ist keine allgemeine Auszeichnung für beliebige Postadressen im Text. Der Browser stellt den Inhalt standardmäßig kursiv dar; Zeilenumbrüche setzt man mit `<br>`.',
  display: 'block',
  example: '<address>\n  Ada Lovelace<br>\n  <a href="mailto:ada@example.com">ada@example.com</a>\n</address>',
  demo: '<address>Ada Lovelace<br><a href="#">ada@example.com</a></address>',
  keywords: ['kontakt', 'adresse', 'anschrift'],
  related: ['<footer>', '<br>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/address'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<hgroup>',
  desc: 'Gruppiert eine Überschrift mit zugehöriger Unter- oder Titelzeile.',
  details: 'Enthält eine Überschrift (`<h1>`–`<h6>`) und beliebig viele `<p>`-Elemente, etwa Untertitel oder Slogan. Es beeinflusst die Dokumentgliederung nicht; nur die Überschrift zählt. Vorteil ist die semantische Zusammengehörigkeit.',
  display: 'block',
  example: '<hgroup>\n  <h1>CSS Grid</h1>\n  <p>Layout in zwei Dimensionen</p>\n</hgroup>',
  demo: '<hgroup><h2 style="margin:0">CSS Grid</h2><p style="margin:0;color:#666">Layout in zwei Dimensionen</p></hgroup>',
  keywords: ['überschriftengruppe', 'untertitel', 'subtitle'],
  related: ['<h1>–<h6>', '<header>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/hgroup'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<search>',
  desc: 'Bereich für Such- oder Filterfunktionen der Seite.',
  details: 'Umschließt ein Suchformular samt zugehörigen Bedienelementen und hat die ARIA-Rolle `search`. Das Element ersetzt `role="search"` auf einem `<form>` oder `<div>`. Es enthält nicht die Ergebnisse selbst, sondern nur die Steuerung der Suche. Relativ neu, wird aber von modernen Browsern unterstützt.',
  display: 'block',
  example: '<search>\n  <form action="/suche">\n    <label for="q">Suche</label>\n    <input type="search" id="q" name="q">\n    <button>Los</button>\n  </form>\n</search>',
  demo: '<search><form onsubmit="return false"><input type="search" placeholder="Suchbegriff"> <button>Los</button></form></search>',
  keywords: ['suche', 'suchfeld', 'filter', 'landmark'],
  related: ['<nav>', '<main>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/search'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<div>',
  desc: 'Generischer Blockcontainer ohne eigene Bedeutung.',
  details: 'Dient als Gruppierung für Layout und Styling per CSS oder zum Zugriff per JavaScript. Verwende ihn nur, wenn kein semantisch passenderes Element wie `<section>`, `<nav>` oder `<ul>` existiert. Ein `<div>` nimmt standardmäßig die volle Breite ein und beginnt in einer neuen Zeile.',
  display: 'block',
  example: '<div class="karte">\n  <h3>Titel</h3>\n  <p>Text</p>\n</div>',
  demo: '<style>.d-d{background:#eef;padding:8px;margin-bottom:4px}</style><div class="d-d">Erstes div</div><div class="d-d">Zweites div</div>',
  tip: 'Viele verschachtelte Divs („Div-Suppe“) sind ein Hinweis, dass semantische Elemente fehlen.',
  keywords: ['container', 'block', 'wrapper', 'layout'],
  related: ['<span>', '<section>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/div'
}, {
  lang: 'html',
  group: 'Seitenaufbau & Semantik',
  name: '<span>',
  desc: 'Generischer Inline-Container ohne eigene Bedeutung.',
  details: 'Umschließt Textteile oder andere Inline-Inhalte, um sie per CSS zu gestalten oder per JavaScript anzusprechen, ohne den Textfluss zu unterbrechen. Wie bei `<div>` gilt: nur nutzen, wenn kein semantisches Element passt. Blockelemente gehören nicht hinein.',
  display: 'inline',
  example: '<p>Status: <span class="badge">aktiv</span></p>',
  demo: '<style>.d-sp{background:#b4367a;color:#fff;padding:1px 8px;border-radius:10px;font-size:13px}</style><p>Status: <span class="d-sp">aktiv</span></p>',
  keywords: ['inline', 'container', 'textabschnitt'],
  related: ['<div>', '<mark>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/span'
});

window.CHEAT.push({
  lang: 'html',
  group: 'Text & Absätze',
  name: '<h1>–<h6>',
  desc: 'Überschriften in sechs Ebenen, von h1 (wichtigste) bis h6.',
  details: 'Sie gliedern das Dokument und bilden die Basis für Navigation per Screenreader. Pro Seite sollte es genau ein `<h1>` geben, danach folgen die Ebenen ohne Sprünge (h2 nach h1, nicht h4). Wähle die Ebene nach der Struktur, nicht nach der gewünschten Schriftgröße; diese steuert man mit CSS.',
  display: 'block',
  example: '<h1>Hauptthema</h1>\n<h2>Unterthema</h2>\n<h3>Detail</h3>',
  demo: '<h1 style="margin:4px 0">Überschrift 1</h1><h2 style="margin:4px 0">Überschrift 2</h2><h3 style="margin:4px 0">Überschrift 3</h3><h4 style="margin:4px 0">Überschrift 4</h4><h5 style="margin:4px 0">Überschrift 5</h5><h6 style="margin:4px 0">Überschrift 6</h6>',
  tip: 'Überschriften nie nur wegen der Optik wählen oder überspringen, das schadet Barrierefreiheit und SEO.',
  keywords: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'überschrift', 'heading', 'titel'],
  related: ['<hgroup>', '<section>', '<p>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/Heading_Elements'
}, {
  lang: 'html',
  group: 'Text & Absätze',
  name: '<p>',
  desc: 'Absatz: ein zusammenhängender Textblock.',
  details: 'Der Browser setzt davor und danach einen Abstand. Mehrere Leerzeichen oder Zeilenumbrüche im Quelltext werden zu einem Leerzeichen zusammengefasst. Blockelemente wie `<div>` oder `<ul>` dürfen nicht in einem `<p>` stehen; sie schließen es implizit, was zu unerwarteten Strukturen führt.',
  display: 'block',
  example: '<p>Dies ist ein Absatz mit <strong>wichtigem</strong> Text.</p>\n<p>Dies ist der nächste Absatz.</p>',
  demo: '<p>Dies ist ein Absatz mit <strong>wichtigem</strong> Text.</p><p>Dies ist der nächste Absatz.</p>',
  tip: 'Abstände zwischen Absätzen per CSS (`margin`) steuern, nicht mit leeren `<p>` oder `<br>`.',
  keywords: ['absatz', 'paragraph', 'text'],
  related: ['<br>', '<pre>', '<div>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/p'
}, {
  lang: 'html',
  group: 'Text & Absätze',
  name: '<br>',
  desc: 'Erzwingt einen Zeilenumbruch innerhalb eines Textes.',
  details: 'Ein Void-Element ohne Inhalt. Nur dort sinnvoll, wo der Umbruch Teil des Inhalts ist, etwa bei Gedichten oder Adressen. Für Abstände oder Layout ist es ungeeignet; nutze dafür Absätze und CSS.',
  display: 'inline',
  example: '<p>\n  Musterstraße 1<br>\n  12345 Musterstadt\n</p>',
  demo: '<p>Musterstraße 1<br>12345 Musterstadt</p>',
  keywords: ['zeilenumbruch', 'umbruch', 'line break', 'newline'],
  related: ['<p>', '<wbr>', '<address>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/br'
}, {
  lang: 'html',
  group: 'Text & Absätze',
  name: '<hr>',
  desc: 'Thematische Trennung zwischen Absätzen, meist als horizontale Linie dargestellt.',
  details: 'Ein Void-Element, das einen inhaltlichen Themenwechsel markiert. Die Linie ist nur die Standarddarstellung; Aussehen steuerst du per CSS mit `border`, `height` oder `background`. Reine Zierlinien gehören ins CSS.',
  display: 'block',
  example: '<p>Erstes Thema.</p>\n<hr>\n<p>Zweites Thema.</p>',
  demo: '<p>Erstes Thema.</p><hr><p>Zweites Thema.</p>',
  keywords: ['trennlinie', 'linie', 'horizontal rule', 'trenner'],
  related: ['<p>', '<section>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/hr'
}, {
  lang: 'html',
  group: 'Text & Absätze',
  name: '<wbr>',
  desc: 'Markiert eine mögliche Umbruchstelle in einem langen Wort.',
  details: 'Der Browser bricht dort nur um, wenn der Platz nicht reicht; sonst bleibt das Wort zusammenhängend. Nützlich für lange URLs, Bandwurmwörter oder Code. Anders als ein weiches Trennzeichen (`&shy;`) erscheint kein Bindestrich.',
  display: 'inline',
  example: '<p>Donau<wbr>dampfschiff<wbr>fahrts<wbr>gesellschaft</p>',
  demo: '<div style="width:110px;border:1px dashed #b4367a;padding:4px">Donau<wbr>dampfschiff<wbr>fahrts<wbr>gesellschaft</div>',
  keywords: ['umbruch', 'word break', 'trennung', 'lange wörter'],
  related: ['<br>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/wbr'
}, {
  lang: 'html',
  group: 'Text & Absätze',
  name: '<pre>',
  desc: 'Vorformatierter Text: Leerzeichen und Zeilenumbrüche bleiben erhalten.',
  details: 'Der Text wird in einer Festbreitenschrift ohne Zusammenfassen von Leerraum dargestellt. Für Quellcode kombiniert man es mit `<code>`. Zeichen wie `<` und `&` müssen als `&lt;` und `&amp;` geschrieben werden. Lange Zeilen scrollen horizontal, sofern nicht per CSS umgebrochen.',
  display: 'block',
  example: '<pre><code>function gruss() {\n  return "Hallo";\n}</code></pre>',
  demo: '<style>.d-pre{background:#f4f4f4;padding:8px 12px;border-radius:4px}</style><pre class="d-pre"><code>function gruss() {\n  return "Hallo";\n}</code></pre>',
  tip: 'Mit `white-space: pre-wrap` bleiben Umbrüche erhalten, lange Zeilen brechen aber um.',
  keywords: ['vorformatiert', 'preformatted', 'codeblock', 'leerzeichen'],
  related: ['<code>', '<samp>', '<kbd>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/pre'
}, {
  lang: 'html',
  group: 'Text & Absätze',
  name: '<blockquote>',
  desc: 'Längeres Zitat aus einer anderen Quelle als eigener Block.',
  details: 'Der Browser rückt den Block standardmäßig ein. Die Quelle nennst du über das Attribut `cite` (nicht sichtbar) oder sichtbar in einem umgebenden `<figure>` mit `<figcaption>`. Für kurze Zitate im Fließtext ist `<q>` gedacht. Nicht zum bloßen Einrücken verwenden.',
  values: [
    ['cite', 'URL der Quelle des Zitats']
  ],
  display: 'block',
  example: '<figure>\n  <blockquote cite="https://example.com/rede">\n    <p>Die Zukunft gehört denen, die sie gestalten.</p>\n  </blockquote>\n  <figcaption>– <cite>Beispiel-Rede</cite></figcaption>\n</figure>',
  demo: '<blockquote cite="#" style="margin:0;padding:6px 14px;border-left:4px solid #b4367a;background:#f6f0f4"><p style="margin:0">Die Zukunft gehört denen, die sie gestalten.</p></blockquote>',
  keywords: ['zitat', 'quote', 'quotation'],
  related: ['<q>', '<cite>', '<figure>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/blockquote'
}, {
  lang: 'html',
  group: 'Text & Absätze',
  name: '<figure>',
  desc: 'Eigenständiger Inhalt wie Bild, Diagramm oder Code, optional mit Beschriftung.',
  details: 'Der Inhalt wird vom Haupttext referenziert, könnte aber an anderer Stelle stehen, ohne dass der Text leidet. Die Beschriftung kommt in ein `<figcaption>` als erstes oder letztes Kind. Neben Bildern eignet es sich für Tabellen, Zitate und Codebeispiele. Der Browser rückt es standardmäßig ein.',
  display: 'block',
  example: '<figure>\n  <img src="berg.jpg" alt="Schneebedeckter Berggipfel" width="400" height="250">\n  <figcaption>Der Gipfel im Morgenlicht.</figcaption>\n</figure>',
  demo: '<figure style="margin:0"><div style="width:200px;height:100px;background:linear-gradient(135deg,#b4367a,#5b8def)"></div><figcaption style="font-size:13px;color:#555">Abb. 1: Farbverlauf</figcaption></figure>',
  keywords: ['abbildung', 'bild mit untertitel', 'caption', 'bildunterschrift'],
  related: ['<figcaption>', '<blockquote>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/figure'
}, {
  lang: 'html',
  group: 'Text & Absätze',
  name: '<figcaption>',
  desc: 'Beschriftung oder Legende eines `<figure>`.',
  details: 'Muss direkt als erstes oder letztes Kind eines `<figure>` stehen. Es liefert den zugänglichen Namen für den Inhalt des `<figure>`. Es ersetzt nicht den `alt`-Text eines Bildes: `alt` beschreibt das Bild, `<figcaption>` ergänzt Kontext.',
  display: 'block',
  example: '<figure>\n  <img src="chart.png" alt="Balkendiagramm der Umsätze">\n  <figcaption>Umsatz pro Quartal 2025</figcaption>\n</figure>',
  keywords: ['bildunterschrift', 'legende', 'beschriftung'],
  related: ['<figure>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/figcaption'
});

window.CHEAT.push({
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<a>',
  desc: 'Hyperlink zu einer Seite, Datei, E-Mail-Adresse oder Stelle im Dokument.',
  details: 'Ohne `href` ist es nur ein Platzhalter und kein Link. Der Linktext sollte für sich verständlich sein („Preisliste herunterladen“ statt „hier klicken“). Bei `target="_blank"` setzen moderne Browser implizit `rel="noopener"`; ein Hinweis für Nutzer, dass sich ein neuer Tab öffnet, ist trotzdem sinnvoll. Ein `<a>` darf kein weiteres interaktives Element enthalten.',
  values: [
    ['href', 'Ziel: URL, `#anker`, `mailto:…`, `tel:…`'],
    ['target', '`_self` (Standard), `_blank` (neuer Tab), `_parent`, `_top`'],
    ['rel', 'Beziehung, z. B. `noopener`, `noreferrer`, `nofollow`, `external`'],
    ['download', 'Datei herunterladen statt öffnen, optional mit Dateinamen'],
    ['hreflang', 'Sprache der Zielseite'],
    ['type', 'MIME-Typ des Ziels (nur Hinweis)']
  ],
  display: 'inline',
  example: '<a href="https://example.com" target="_blank" rel="noopener">Externe Seite</a>\n<a href="#kontakt">Zum Kontakt</a>\n<a href="mailto:info@example.com">E-Mail schreiben</a>\n<a href="/bericht.pdf" download>PDF laden</a>',
  demo: '<p><a href="#">Ein Link</a> &middot; <a href="#kontakt">Zum Anker</a> &middot; <a href="mailto:info@example.com">E-Mail</a></p>',
  tip: 'Links zu anderen Seiten sind `<a>`, Aktionen auf der gleichen Seite sind `<button>`.',
  keywords: ['link', 'verweis', 'anker', 'hyperlink', 'href', 'mailto', 'tel', 'download'],
  related: ['<link>', '<base>', '<nav>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/a'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<strong>',
  desc: 'Markiert Text von hoher Wichtigkeit, Ernst oder Dringlichkeit.',
  details: 'Wird meist fett dargestellt, die Bedeutung zählt aber mehr als die Optik. Screenreader können es betonen. Für rein optisches Fettdruck-Styling ohne besondere Bedeutung nimm CSS (`font-weight`) oder `<b>`.',
  display: 'inline',
  example: '<p><strong>Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden.</p>',
  demo: '<p><strong>Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden.</p>',
  keywords: ['fett', 'bold', 'wichtig'],
  related: ['<b>', '<em>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/strong'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<em>',
  desc: 'Markiert Text mit besonderer Betonung.',
  details: 'Wird meist kursiv dargestellt. Die Betonung verändert den Sinn eines Satzes („Ich habe *das* gesagt“) und darf verschachtelt werden, um die Stärke zu variieren. Für Fachbegriffe, Titel oder fremdsprachige Wörter ohne Betonung ist `<i>` passender.',
  display: 'inline',
  example: '<p>Ich habe <em>nicht</em> gesagt, dass er das Geld gestohlen hat.</p>',
  demo: '<p>Ich habe <em>nicht</em> gesagt, dass er das Geld gestohlen hat.</p>',
  keywords: ['kursiv', 'italic', 'betonung', 'emphasis'],
  related: ['<i>', '<strong>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/em'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<b>',
  desc: 'Hebt Text optisch hervor, ohne zusätzliche Wichtigkeit.',
  details: 'Stilistische Aufmerksamkeit, z. B. für Schlüsselwörter in einer Zusammenfassung oder Produktnamen. Es transportiert keine besondere Bedeutung wie `<strong>`. Wenn möglich, bevorzuge ein spezifischeres Element oder CSS.',
  display: 'inline',
  example: '<p>Das <b>Flexbox</b>-Modul eignet sich für eindimensionale Layouts.</p>',
  demo: '<p>Das <b>Flexbox</b>-Modul eignet sich für eindimensionale Layouts.</p>',
  keywords: ['fett', 'bold'],
  related: ['<strong>', '<i>', '<mark>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/b'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<i>',
  desc: 'Text in abweichender Stimme oder Stimmung, z. B. Fachbegriff oder Gedanke.',
  details: 'Typische Verwendung sind Fachbegriffe, fremdsprachige Wörter, Schiffsnamen oder innere Monologe. Wird kursiv dargestellt, hat aber keine Betonung wie `<em>`. Häufig wird es zweckentfremdet für Icons (`<i class="icon">`); dafür sind `<span>` oder SVG besser.',
  display: 'inline',
  example: '<p>Das Wort <i lang="en">cheat sheet</i> bedeutet Spickzettel.</p>',
  demo: '<p>Das Wort <i lang="en">cheat sheet</i> bedeutet Spickzettel.</p>',
  keywords: ['kursiv', 'italic', 'fachbegriff'],
  related: ['<em>', '<b>', '<cite>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/i'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<u>',
  desc: 'Text mit nicht-textueller Auszeichnung, standardmäßig unterstrichen.',
  details: 'Gedacht für Fälle wie Rechtschreibfehler-Markierung oder chinesische Eigennamen. Weil Unterstreichungen leicht mit Links verwechselt werden, sollte man es sparsam einsetzen. Für reine Optik ist `text-decoration` in CSS besser.',
  display: 'inline',
  example: '<p>Er schrieb <u>Rechtschreibfehlr</u> in den Text.</p>',
  demo: '<p>Er schrieb <u>Rechtschreibfehlr</u> in den Text.</p>',
  tip: 'Unterstrichener Text, der kein Link ist, verwirrt Nutzer schnell.',
  keywords: ['unterstrichen', 'underline'],
  related: ['<mark>', '<s>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/u'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<s>',
  desc: 'Durchgestrichener Text für Inhalte, die nicht mehr korrekt oder relevant sind.',
  details: 'Passt für alte Preise oder überholte Angaben, die sichtbar bleiben sollen. Für Änderungen im Dokument (Löschung) ist `<del>` semantisch korrekt, `<s>` beschreibt nur, dass etwas nicht mehr gilt.',
  display: 'inline',
  example: '<p><s>49,99 €</s> jetzt nur 29,99 €</p>',
  demo: '<p><s>49,99 €</s> jetzt nur 29,99 €</p>',
  keywords: ['durchgestrichen', 'strikethrough', 'veraltet'],
  related: ['<del>', '<ins>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/s'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<mark>',
  desc: 'Hebt Text wegen seiner Relevanz im aktuellen Kontext hervor.',
  details: 'Wie mit einem Textmarker, etwa für Suchtreffer oder eine Stelle, auf die der Leser achten soll. Standardmäßig gelber Hintergrund. Es markiert Relevanz für den Leser, nicht Wichtigkeit im Text selbst (dafür `<strong>`).',
  display: 'inline',
  example: '<p>Suchergebnis: Die <mark>Flexbox</mark> ist ein Layoutmodul.</p>',
  demo: '<p>Suchergebnis: Die <mark>Flexbox</mark> ist ein Layoutmodul.</p>',
  keywords: ['markieren', 'highlight', 'textmarker', 'hervorheben'],
  related: ['<strong>', '<em>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/mark'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<small>',
  desc: 'Kleingedrucktes: Nebenanmerkungen, Haftungshinweise, Copyright.',
  details: 'Für kurze Zusatzinfos wie rechtliche Hinweise oder Quellenangaben. Es wird kleiner dargestellt, ist aber nicht zur reinen Verkleinerung gedacht; dafür gibt es `font-size`. Nicht für lange Textpassagen verwenden.',
  display: 'inline',
  example: '<p>Preis: 19,90 € <small>inkl. MwSt., zzgl. Versand</small></p>',
  demo: '<p>Preis: 19,90 € <small>inkl. MwSt., zzgl. Versand</small></p>',
  keywords: ['klein', 'kleingedrucktes', 'fußnote'],
  related: ['<footer>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/small'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<sub>',
  desc: 'Tiefgestellter Text, z. B. in chemischen Formeln.',
  details: 'Der Text wird verkleinert unter die Grundlinie gesetzt. Typisch sind Formeln wie H₂O oder Indizes in der Mathematik. Rein optisches Tiefstellen sollte stattdessen per CSS (`vertical-align`) erfolgen.',
  display: 'inline',
  example: '<p>Wasser: H<sub>2</sub>O</p>',
  demo: '<p>Wasser: H<sub>2</sub>O</p>',
  keywords: ['tiefgestellt', 'subscript', 'index', 'formel'],
  related: ['<sup>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/sub'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<sup>',
  desc: 'Hochgestellter Text, z. B. Exponenten oder Fußnotenverweise.',
  details: 'Der Text wird verkleinert über die Grundlinie gesetzt. Typisch für Potenzen (x²), Ordnungszahlen in manchen Sprachen und Fußnotenmarker. Fußnotenverweise sollten verlinkt sein, damit Nutzer die Fußnote erreichen.',
  display: 'inline',
  example: '<p>Fläche: 25 m<sup>2</sup> &ndash; siehe Fußnote<sup><a href="#fn1">1</a></sup></p>',
  demo: '<p>Fläche: 25 m<sup>2</sup> &ndash; siehe Fußnote<sup><a href="#fn1">1</a></sup></p>',
  keywords: ['hochgestellt', 'superscript', 'exponent', 'fußnote'],
  related: ['<sub>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/sup'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<code>',
  desc: 'Kurzer Ausschnitt Computercode, in Festbreitenschrift.',
  details: 'Für Befehle, Funktionsnamen oder Codezeilen im Text. Mehrzeiligen Code umschließt man mit `<pre><code>…</code></pre>`, da `<code>` allein Umbrüche nicht erhält. Spitze Klammern und `&` im Code müssen als Entitäten (`&lt;`, `&amp;`) geschrieben werden.',
  display: 'inline',
  example: '<p>Nutze <code>display: flex</code>, um Elemente nebeneinander anzuordnen.</p>',
  demo: '<p>Nutze <code>display: flex</code>, um Elemente nebeneinander anzuordnen.</p>',
  keywords: ['quellcode', 'programmcode', 'monospace', 'inline code'],
  related: ['<pre>', '<kbd>', '<samp>', '<var>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/code'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<kbd>',
  desc: 'Tastatureingabe oder andere Benutzereingabe.',
  details: 'Zeigt, was der Nutzer eingeben soll, etwa Tastenkombinationen oder Befehle. Mehrere Tasten werden meist durch verschachtelte `<kbd>`-Elemente dargestellt. Die gängige Tastendarstellung als Button-Optik erreichst du per CSS.',
  display: 'inline',
  example: '<p>Speichern mit <kbd><kbd>Strg</kbd> + <kbd>S</kbd></kbd></p>',
  demo: '<style>.d-k kbd{border:1px solid #aaa;border-bottom-width:2px;border-radius:4px;padding:0 5px;background:#f5f5f5}</style><p class="d-k">Speichern mit <kbd>Strg</kbd> + <kbd>S</kbd></p>',
  keywords: ['tastatur', 'taste', 'shortcut', 'tastenkombination', 'keyboard'],
  related: ['<code>', '<samp>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/kbd'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<samp>',
  desc: 'Beispielausgabe eines Programms oder Systems.',
  details: 'Kennzeichnet Text, den ein Computerprogramm ausgibt, etwa Fehlermeldungen oder Konsolenausgaben. Wird in Festbreitenschrift dargestellt. Eingaben des Nutzers markiert man dagegen mit `<kbd>`.',
  display: 'inline',
  example: '<p>Das Programm meldet: <samp>Datei nicht gefunden.</samp></p>',
  demo: '<p>Das Programm meldet: <samp>Datei nicht gefunden.</samp></p>',
  keywords: ['ausgabe', 'output', 'sample', 'konsole'],
  related: ['<kbd>', '<code>', '<pre>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/samp'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<var>',
  desc: 'Variable in einer mathematischen Formel oder in Programmcode.',
  details: 'Wird standardmäßig kursiv dargestellt. Nützlich in Erklärungen von Formeln oder Programmen, wo ein Name für einen Wert steht. Für den Code selbst ist `<code>` zuständig, `<var>` markiert nur den Platzhalter.',
  display: 'inline',
  example: '<p>Die Fläche beträgt <var>a</var> &times; <var>b</var>.</p>',
  demo: '<p>Die Fläche beträgt <var>a</var> &times; <var>b</var>.</p>',
  keywords: ['variable', 'formel', 'mathematik', 'platzhalter'],
  related: ['<code>', '<sub>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/var'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<abbr>',
  desc: 'Abkürzung oder Akronym, optional mit Erklärung per `title`.',
  details: 'Mit `title` erscheint die ausgeschriebene Form als Tooltip. Weil Tooltips auf Touchgeräten und bei Tastaturbedienung kaum erreichbar sind, solltest du Abkürzungen bei der ersten Verwendung im Text ausschreiben. Browser unterstreichen es oft gepunktet.',
  values: [
    ['title', 'Ausgeschriebene Form oder Erklärung der Abkürzung']
  ],
  display: 'inline',
  example: '<p><abbr title="HyperText Markup Language">HTML</abbr> strukturiert Webseiten.</p>',
  demo: '<p><abbr title="HyperText Markup Language">HTML</abbr> strukturiert Webseiten.</p>',
  keywords: ['abkürzung', 'akronym', 'abbreviation', 'acronym'],
  related: ['<dfn>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/abbr'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<cite>',
  desc: 'Titel eines Werks wie Buch, Film, Lied oder Studie.',
  details: 'Bezeichnet den Namen des Werks, nicht den Autor und nicht das Zitat selbst. Wird kursiv dargestellt. Oft zusammen mit `<blockquote>` oder `<q>` verwendet, um die Quelle zu nennen.',
  display: 'inline',
  example: '<p>Gelesen in <cite>Der Process</cite> von Franz Kafka.</p>',
  demo: '<p>Gelesen in <cite>Der Process</cite> von Franz Kafka.</p>',
  tip: 'Personennamen gehören nicht in `<cite>`.',
  keywords: ['quelle', 'werk', 'buchtitel', 'referenz'],
  related: ['<blockquote>', '<q>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/cite'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<q>',
  desc: 'Kurzes Inline-Zitat; der Browser setzt die Anführungszeichen automatisch.',
  details: 'Die Anführungszeichen richten sich nach der Sprache (`lang`), im Deutschen „…“. Setze deshalb keine eigenen Anführungszeichen dazu. Längere Zitate gehören in `<blockquote>`. Die Quelle kann per `cite` angegeben werden.',
  values: [
    ['cite', 'URL der Quelle des Zitats']
  ],
  display: 'inline',
  example: '<p lang="de">Er sagte: <q>Das ist ein Test.</q></p>',
  demo: '<p lang="de">Er sagte: <q>Das ist ein Test.</q></p>',
  keywords: ['zitat', 'anführungszeichen', 'quote'],
  related: ['<blockquote>', '<cite>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/q'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<dfn>',
  desc: 'Kennzeichnet den Begriff, der gerade definiert wird.',
  details: 'Steht an der Stelle, wo ein Fachbegriff im Text erklärt wird. Der nächste Absatz, Satz oder die Beschreibungsliste enthält die Definition. Wird kursiv dargestellt. Für Glossare nutzt man es in `<dt>`.',
  display: 'inline',
  example: '<p>Ein <dfn>Void-Element</dfn> ist ein Element ohne Inhalt und ohne Endtag.</p>',
  demo: '<p>Ein <dfn>Void-Element</dfn> ist ein Element ohne Inhalt und ohne End-Tag.</p>',
  keywords: ['definition', 'begriff', 'glossar'],
  related: ['<abbr>', '<dt>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/dfn'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<time>',
  desc: 'Maschinenlesbare Angabe von Datum und Uhrzeit.',
  details: 'Das Attribut `datetime` enthält den ISO-8601-Wert, der sichtbare Text darf frei formuliert sein. Suchmaschinen und Browser können daraus Termine erkennen. Ohne `datetime` muss der Inhalt selbst ein gültiges Datumsformat sein.',
  values: [
    ['datetime', 'Datum/Zeit, z. B. `2026-03-01`, `2026-03-01T14:30`, `PT2H30M` (Dauer)']
  ],
  display: 'inline',
  example: '<p>Veröffentlicht am <time datetime="2026-03-01">1. März 2026</time></p>',
  demo: '<p>Veröffentlicht am <time datetime="2026-03-01">1. März 2026</time></p>',
  keywords: ['datum', 'uhrzeit', 'zeit', 'iso 8601', 'termin'],
  related: ['<data>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/time'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<data>',
  desc: 'Verknüpft Inhalt mit einem maschinenlesbaren Wert.',
  details: 'Das Attribut `value` enthält die Rohdaten (z. B. eine Artikelnummer), der Elementinhalt die menschenlesbare Form. Für Datum und Uhrzeit ist `<time>` zuständig. Der Browser stellt nichts Besonderes dar; die Nutzung ergibt sich erst über Skripte oder Crawler.',
  values: [
    ['value', 'Maschinenlesbarer Wert (Pflicht)']
  ],
  display: 'inline',
  example: '<ul>\n  <li><data value="4711">Espresso</data></li>\n  <li><data value="4712">Cappuccino</data></li>\n</ul>',
  demo: '<p><data value="4711">Espresso</data> &middot; <data value="4712">Cappuccino</data></p>',
  keywords: ['wert', 'maschinenlesbar', 'value'],
  related: ['<time>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/data'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<del>',
  desc: 'Markiert Text, der aus dem Dokument entfernt wurde.',
  details: 'Wird durchgestrichen dargestellt. Zusammen mit `<ins>` zeigt man Änderungen am Inhalt, z. B. in Versionsverläufen. `cite` verweist auf eine Erklärung, `datetime` hält den Zeitpunkt fest.',
  values: [
    ['cite', 'URL mit Erklärung zur Änderung'],
    ['datetime', 'Zeitpunkt der Löschung']
  ],
  display: 'inline',
  example: '<p>Treffpunkt: <del>Bahnhof</del> <ins>Marktplatz</ins></p>',
  demo: '<p>Treffpunkt: <del>Bahnhof</del> <ins>Marktplatz</ins></p>',
  keywords: ['gelöscht', 'durchgestrichen', 'änderung', 'delete'],
  related: ['<ins>', '<s>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/del'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<ins>',
  desc: 'Markiert Text, der neu in das Dokument eingefügt wurde.',
  details: 'Wird unterstrichen dargestellt. Gegenstück zu `<del>`; beide können Inline-Text oder ganze Blöcke umfassen. Mit `datetime` und `cite` lässt sich die Änderung dokumentieren.',
  values: [
    ['cite', 'URL mit Erklärung zur Änderung'],
    ['datetime', 'Zeitpunkt der Einfügung']
  ],
  display: 'inline',
  example: '<p>Treffpunkt: <del>Bahnhof</del> <ins datetime="2026-03-02">Marktplatz</ins></p>',
  demo: '<p>Treffpunkt: <del>Bahnhof</del> <ins>Marktplatz</ins></p>',
  keywords: ['eingefügt', 'unterstrichen', 'änderung', 'insert'],
  related: ['<del>', '<u>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/ins'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<bdi>',
  desc: 'Isoliert Text, dessen Schreibrichtung unbekannt oder abweichend ist.',
  details: 'Der Browser bestimmt die Richtung des Inhalts unabhängig vom Umfeld. Wichtig bei nutzergenerierten Inhalten wie Namen, die arabisch oder hebräisch sein können, damit sie die Reihenfolge des umgebenden Textes nicht durcheinanderbringen.',
  display: 'inline',
  example: '<ul>\n  <li>Nutzer <bdi>إيان</bdi>: 3 Punkte</li>\n  <li>Nutzer <bdi>Jan</bdi>: 5 Punkte</li>\n</ul>',
  demo: '<p>Nutzer <bdi>إيان</bdi>: 3 Punkte</p>',
  keywords: ['bidirektional', 'rtl', 'schreibrichtung', 'isolieren'],
  related: ['<bdo>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/bdi'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<bdo>',
  desc: 'Erzwingt eine bestimmte Schreibrichtung für den enthaltenen Text.',
  details: 'Das Attribut `dir` ist Pflicht und überschreibt den Unicode-Algorithmus für bidirektionalen Text. Mit `rtl` wird der Inhalt von rechts nach links dargestellt. Selten nötig, meist reicht `<bdi>` oder das globale `dir`-Attribut.',
  values: [
    ['dir', '`ltr` (links nach rechts) oder `rtl` (rechts nach links)']
  ],
  display: 'inline',
  example: '<p><bdo dir="rtl">Dieser Text läuft rückwärts.</bdo></p>',
  demo: '<p><bdo dir="rtl">Dieser Text läuft rückwärts.</bdo></p>',
  keywords: ['richtung', 'rtl', 'ltr', 'bidirektional'],
  related: ['<bdi>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/bdo'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<ruby>',
  desc: 'Aussprachehilfe (Ruby-Annotation) für ostasiatische Schriftzeichen.',
  details: 'Umschließt Basiszeichen und ihre Annotation, die mit `<rt>` über (oder neben) dem Text steht. `<rp>` liefert Klammern als Fallback für Browser ohne Ruby-Unterstützung. Mehrere Zeichen-Annotation-Paare dürfen nacheinander stehen.',
  display: 'ruby',
  example: '<ruby>\n  漢 <rp>(</rp><rt>kan</rt><rp>)</rp>\n  字 <rp>(</rp><rt>ji</rt><rp>)</rp>\n</ruby>',
  demo: '<p style="font-size:24px"><ruby>漢<rp>(</rp><rt>kan</rt><rp>)</rp>字<rp>(</rp><rt>ji</rt><rp>)</rp></ruby></p>',
  keywords: ['furigana', 'pinyin', 'aussprache', 'japanisch', 'chinesisch', 'annotation'],
  related: ['<rt>', '<rp>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/ruby'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<rt>',
  desc: 'Enthält die Aussprache- oder Übersetzungshilfe innerhalb von `<ruby>`.',
  details: 'Steht direkt nach den Basiszeichen im `<ruby>`-Element. Der Text wird kleiner über den Zeichen dargestellt. Ohne umgebendes `<ruby>` hat das Element keine Funktion.',
  display: 'ruby-text',
  example: '<ruby>東京<rp>(</rp><rt>Tōkyō</rt><rp>)</rp></ruby>',
  demo: '<p style="font-size:24px"><ruby>東京<rp>(</rp><rt>Tōkyō</rt><rp>)</rp></ruby></p>',
  keywords: ['ruby text', 'aussprache', 'annotation'],
  related: ['<ruby>', '<rp>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/rt'
}, {
  lang: 'html',
  group: 'Textauszeichnung',
  name: '<rp>',
  desc: 'Klammern als Fallback für Browser ohne Ruby-Unterstützung.',
  details: 'Umschließt die Klammern um `<rt>`, damit die Aussprache in Browsern ohne Ruby-Darstellung als „Zeichen (Aussprache)“ erscheint. In modernen Browsern bleibt der Inhalt unsichtbar.',
  display: 'none',
  example: '<ruby>東<rp>(</rp><rt>tō</rt><rp>)</rp></ruby>',
  keywords: ['ruby parenthesis', 'fallback', 'klammer'],
  related: ['<ruby>', '<rt>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/rp'
});

window.CHEAT.push({
  lang: 'html',
  group: 'Listen',
  name: '<ul>',
  desc: 'Ungeordnete Liste, deren Reihenfolge keine Rolle spielt.',
  details: 'Darf direkt nur `<li>`-Elemente (und Skript-unterstützende Elemente) enthalten. Standardmäßig mit Aufzählungspunkten. Mit CSS (`list-style: none`) wird sie oft zur Navigation oder zu Karten umgebaut; die Listensemantik bleibt dabei erhalten, Safari entfernt sie allerdings, wenn `list-style: none` gesetzt ist, bis du `role="list"` ergänzt.',
  display: 'block',
  example: '<ul>\n  <li>Äpfel</li>\n  <li>Birnen</li>\n  <li>Kirschen</li>\n</ul>',
  demo: '<ul><li>Äpfel</li><li>Birnen</li><li>Kirschen</li></ul>',
  keywords: ['aufzählung', 'liste', 'bullet', 'unordered list'],
  related: ['<ol>', '<li>', '<menu>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/ul'
}, {
  lang: 'html',
  group: 'Listen',
  name: '<ol>',
  desc: 'Geordnete (nummerierte) Liste, bei der die Reihenfolge wichtig ist.',
  details: 'Enthält `<li>`-Elemente und nummeriert sie automatisch. Mit Attributen steuerst du Startwert, Zählrichtung und Zählart. Nutze es für Anleitungen oder Ranglisten, nicht für beliebige Aufzählungen.',
  values: [
    ['start', 'Startzahl, z. B. `5`'],
    ['reversed', 'Zählt rückwärts'],
    ['type', 'Nummerierung: `1`, `a`, `A`, `i`, `I`']
  ],
  display: 'block',
  example: '<ol start="3" type="a">\n  <li>Eier verquirlen</li>\n  <li>Mehl dazugeben</li>\n  <li>Backen</li>\n</ol>',
  demo: '<ol><li>Eier verquirlen</li><li>Mehl dazugeben</li><li>Backen</li></ol><ol reversed><li>Dritter</li><li>Zweiter</li><li>Erster</li></ol>',
  keywords: ['nummerierte liste', 'aufzählung', 'ordered list', 'reversed', 'start'],
  related: ['<ul>', '<li>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/ol'
}, {
  lang: 'html',
  group: 'Listen',
  name: '<li>',
  desc: 'Einzelner Eintrag einer Liste.',
  details: 'Muss direkt in `<ul>`, `<ol>` oder `<menu>` stehen. In einer `<ol>` erlaubt das Attribut `value` eine abweichende Nummer. Als Inhalt sind beliebige Flussinhalte erlaubt, auch verschachtelte Listen.',
  values: [
    ['value', 'Nummer des Eintrags (nur in `<ol>`)']
  ],
  display: 'list-item',
  example: '<ul>\n  <li>Obst\n    <ul>\n      <li>Äpfel</li>\n      <li>Birnen</li>\n    </ul>\n  </li>\n  <li>Gemüse</li>\n</ul>',
  demo: '<ul><li>Obst<ul><li>Äpfel</li><li>Birnen</li></ul></li><li>Gemüse</li></ul>',
  keywords: ['listeneintrag', 'list item', 'punkt'],
  related: ['<ul>', '<ol>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/li'
}, {
  lang: 'html',
  group: 'Listen',
  name: '<dl>',
  desc: 'Beschreibungsliste mit Begriffen und zugehörigen Erklärungen.',
  details: 'Besteht aus Paaren von `<dt>` (Begriff) und `<dd>` (Beschreibung). Ein Begriff kann mehrere Beschreibungen haben und umgekehrt. Geeignet für Glossare, Metadaten oder Schlüssel-Wert-Paare. Zur Gruppierung von Paaren darf ein `<div>` dazwischen stehen.',
  display: 'block',
  example: '<dl>\n  <dt>HTML</dt>\n  <dd>Auszeichnungssprache für Webseiten</dd>\n  <dt>CSS</dt>\n  <dd>Sprache zur Gestaltung</dd>\n</dl>',
  demo: '<dl><dt><strong>HTML</strong></dt><dd>Auszeichnungssprache für Webseiten</dd><dt><strong>CSS</strong></dt><dd>Sprache zur Gestaltung</dd></dl>',
  keywords: ['beschreibungsliste', 'definitionsliste', 'glossar', 'schlüssel wert', 'description list'],
  related: ['<dt>', '<dd>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/dl'
}, {
  lang: 'html',
  group: 'Listen',
  name: '<dt>',
  desc: 'Begriff (Term) in einer Beschreibungsliste.',
  details: 'Steht innerhalb von `<dl>` und wird von einem oder mehreren `<dd>` gefolgt. Mehrere aufeinanderfolgende `<dt>` teilen sich die darauffolgenden Beschreibungen. Es enthält keine Überschriften oder Gruppierungselemente.',
  display: 'block',
  example: '<dl>\n  <dt>Farbe</dt>\n  <dd>Rot</dd>\n</dl>',
  demo: '<dl><dt><strong>Farbe</strong></dt><dd>Rot</dd></dl>',
  keywords: ['begriff', 'term', 'definition term'],
  related: ['<dl>', '<dd>', '<dfn>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/dt'
}, {
  lang: 'html',
  group: 'Listen',
  name: '<dd>',
  desc: 'Beschreibung oder Wert zu einem Begriff in einer Beschreibungsliste.',
  details: 'Folgt in `<dl>` auf ein oder mehrere `<dt>`. Wird vom Browser standardmäßig eingerückt. Pro Begriff können mehrere `<dd>` stehen, etwa mehrere Bedeutungen.',
  display: 'block',
  example: '<dl>\n  <dt>Sprache</dt>\n  <dd>Deutsch</dd>\n  <dd>Englisch</dd>\n</dl>',
  demo: '<dl><dt><strong>Sprache</strong></dt><dd>Deutsch</dd><dd>Englisch</dd></dl>',
  keywords: ['beschreibung', 'definition', 'description details'],
  related: ['<dl>', '<dt>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/dd'
}, {
  lang: 'html',
  group: 'Listen',
  name: '<menu>',
  desc: 'Semantisch eine Liste von Befehlen, technisch wie eine `<ul>`.',
  details: 'Gedacht für Werkzeugleisten oder Befehlslisten und enthält `<li>`-Elemente. Es verhält sich im Browser wie eine ungeordnete Liste. Das einst geplante Kontextmenü-Feature wurde nie umgesetzt; für Navigation ist `<nav>` mit `<ul>` besser.',
  display: 'block',
  example: '<menu>\n  <li><button>Kopieren</button></li>\n  <li><button>Einfügen</button></li>\n</menu>',
  demo: '<menu style="margin:0"><li><button>Kopieren</button></li><li><button>Einfügen</button></li></menu>',
  keywords: ['menü', 'werkzeugleiste', 'toolbar', 'befehle'],
  related: ['<ul>', '<li>', '<nav>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/menu'
});
