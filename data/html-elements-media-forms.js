window.CHEAT = window.CHEAT || [];

(function () {
  var IMG = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27100%27%3E%3Crect width=%27160%27 height=%27100%27 fill=%27%23b4367a%27/%3E%3Ccircle cx=%2780%27 cy=%2750%27 r=%2730%27 fill=%27%23fff%27 opacity=%27.8%27/%3E%3C/svg%3E';
  var IMG2 = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27100%27%3E%3Crect width=%27160%27 height=%27100%27 fill=%27%232b6cb0%27/%3E%3Crect x=%2750%27 y=%2725%27 width=%2760%27 height=%2750%27 fill=%27%23fff%27 opacity=%27.8%27/%3E%3C/svg%3E';
  var MDN = 'https://developer.mozilla.org/de/docs/Web/HTML/Element/';
  var TSTYLE = '<style>table{border-collapse:collapse;font:14px sans-serif}th,td{border:1px solid #999;padding:6px 10px}th{background:#f0e4ec}caption{padding:4px;font-weight:bold}tfoot th,tfoot td{background:#f6f6f6}</style>';
  var FSTYLE = '<style>body{font:14px sans-serif}label{display:block;margin:6px 0 2px}input,select,textarea,button{font:inherit;padding:4px 6px}fieldset{margin:8px 0}</style>';

  window.CHEAT.push(
    // ===== Bilder & Medien =====
    {
      lang: 'html', group: 'Bilder & Medien', name: '<img>',
      desc: 'Bettet ein Bild in die Seite ein.',
      details: 'Leeres Element, das ein Bild über `src` lädt. `alt` ist Pflicht: Es beschreibt das Bild für Screenreader und erscheint, wenn das Bild nicht lädt; bei rein dekorativen Bildern bleibt es leer (`alt=""`). Gib `width` und `height` an, damit der Browser vor dem Laden Platz reserviert und die Seite nicht springt (Layout Shift).',
      syntax: '<img src="bild.jpg" alt="Beschreibung" width="400" height="300">',
      values: [
        ['src', 'URL des Bildes (Pflicht)'],
        ['alt', 'Textalternative; leer lassen bei Dekoration'],
        ['width / height', 'Intrinsische Größe in Pixeln (ohne Einheit), verhindert Layout-Sprünge'],
        ['srcset', 'Liste von Bildvarianten mit Breite (`800w`) oder Pixeldichte (`2x`)'],
        ['sizes', 'Darstellungsbreite je Media-Query, Hilfe zur Auswahl aus `srcset`'],
        ['loading', '`lazy` lädt erst bei Sichtbarkeit, `eager` sofort (Standard)'],
        ['decoding', '`async`, `sync` oder `auto`: Dekodierung des Bildes'],
        ['fetchpriority', '`high`, `low` oder `auto`: Ladepriorität (z. B. für das Hero-Bild)'],
        ['crossorigin', '`anonymous` oder `use-credentials` für CORS-Anfragen'],
        ['usemap', 'Verweist auf eine `<map>` (z. B. `#karte`)']
      ],
      example: '<img\n  src="foto-800.jpg"\n  srcset="foto-400.jpg 400w, foto-800.jpg 800w, foto-1600.jpg 1600w"\n  sizes="(min-width: 768px) 50vw, 100vw"\n  alt="Segelboot auf dem Bodensee bei Sonnenuntergang"\n  width="800" height="533"\n  loading="lazy" decoding="async">',
      demo: '<img src="' + IMG + '" alt="Rosa Platzhalterbild mit weißem Kreis" width="160" height="100">',
      tip: 'Das Bild im Sichtbereich (LCP) nie mit `loading="lazy"` laden, sonst verzögert sich die Anzeige.',
      keywords: ['bild', 'image', 'foto', 'grafik', 'srcset', 'lazy loading', 'alt-text'],
      related: ['<picture>', '<source>', '<map>', '<svg>'], display: 'inline', mdn: MDN + 'img'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<picture>',
      desc: 'Container für mehrere Bildquellen (Art Direction, Formate).',
      details: 'Enthält null oder mehr `<source>`-Elemente und ein abschließendes `<img>`. Der Browser nimmt die erste passende `<source>` (nach `media`, `type`) und fällt sonst auf das `<img>` zurück. Typisch für moderne Formate wie AVIF/WebP oder für unterschiedliche Bildausschnitte je Bildschirmgröße. Das `<img>` ist zwingend, Styling und `alt` setzt man dort.',
      syntax: '<picture>\n  <source srcset="..." type="...">\n  <img src="..." alt="...">\n</picture>',
      example: '<picture>\n  <source srcset="held.avif" type="image/avif">\n  <source srcset="held.webp" type="image/webp">\n  <source srcset="held-quer.jpg" media="(min-width: 800px)">\n  <img src="held.jpg" alt="Porträt" width="600" height="400">\n</picture>',
      demo: '<picture><source media="(min-width: 400px)" srcset="' + IMG + '"><img src="' + IMG2 + '" alt="Demo" width="160" height="100"></picture><p style="font:13px sans-serif">Rosa ab 400 px Breite, sonst blau.</p>',
      keywords: ['responsive', 'art direction', 'webp', 'avif', 'bildformate'],
      related: ['<source>', '<img>'], display: 'inline', mdn: MDN + 'picture'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<source>',
      desc: 'Gibt alternative Medienquellen für picture, audio oder video an.',
      details: 'Leeres Element innerhalb von `<picture>`, `<audio>` oder `<video>`. Der Browser wählt die erste Quelle, die er abspielen kann bzw. deren Bedingung zutrifft. In `<picture>` verwendet man `srcset`, in `<audio>`/`<video>` `src`. Die Reihenfolge ist entscheidend, die beste Variante gehört nach oben.',
      syntax: '<source src="film.mp4" type="video/mp4">',
      values: [
        ['src', 'URL der Mediendatei (audio/video)'],
        ['srcset', 'Bildvarianten (nur in picture)'],
        ['type', 'MIME-Typ, z. B. `image/webp` oder `video/mp4`'],
        ['media', 'Media Query, bei der die Quelle gilt'],
        ['sizes', 'Darstellungsbreiten (nur in picture)'],
        ['width / height', 'Größenangaben der Bildquelle (picture)']
      ],
      example: '<video controls>\n  <source src="film.webm" type="video/webm">\n  <source src="film.mp4" type="video/mp4">\n</video>',
      keywords: ['quelle', 'mime', 'fallback', 'format'],
      related: ['<picture>', '<video>', '<audio>'], mdn: MDN + 'source'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<audio>',
      desc: 'Bettet eine Audiodatei mit Player ein.',
      details: 'Spielt Ton ab, ohne Plug-in. Ohne `controls` ist der Player unsichtbar. Mehrere `<source>`-Kinder bieten Formate zur Auswahl, Text dazwischen ist Fallback für sehr alte Browser. `autoplay` mit Ton wird von Browsern meist blockiert, daher besser nicht verwenden.',
      syntax: '<audio src="ton.mp3" controls></audio>',
      values: [
        ['src', 'URL der Audiodatei'],
        ['controls', 'Zeigt die Bedienelemente des Browsers'],
        ['autoplay', 'Startet automatisch (oft blockiert)'],
        ['loop', 'Wiederholt endlos'],
        ['muted', 'Startet stumm'],
        ['preload', '`none`, `metadata` oder `auto`: Vorladen'],
        ['crossorigin', 'CORS-Modus']
      ],
      example: '<audio controls preload="metadata">\n  <source src="podcast.ogg" type="audio/ogg">\n  <source src="podcast.mp3" type="audio/mpeg">\n  Dein Browser unterstützt kein Audio.\n</audio>',
      demo: '<audio controls style="width:100%"></audio>',
      keywords: ['ton', 'musik', 'sound', 'podcast', 'player'],
      related: ['<source>', '<track>', '<video>'], display: 'inline', mdn: MDN + 'audio'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<video>',
      desc: 'Bettet ein Video mit Player ein.',
      details: 'Spielt Videos nativ ab. Mit `controls` erscheint die Bedienleiste, `poster` zeigt vor dem Start ein Vorschaubild. Autoplay funktioniert in der Regel nur mit `muted` (und meist `playsinline`). Untertitel liefert man über `<track>`, Formate über mehrere `<source>`.',
      syntax: '<video src="film.mp4" controls width="640"></video>',
      values: [
        ['src', 'URL der Videodatei'],
        ['controls', 'Zeigt die Bedienelemente'],
        ['poster', 'Vorschaubild vor dem Abspielen'],
        ['autoplay', 'Startet automatisch (nur mit `muted` zuverlässig)'],
        ['muted', 'Startet stumm'],
        ['loop', 'Wiederholt endlos'],
        ['playsinline', 'Verhindert Vollbild-Start auf iOS'],
        ['preload', '`none`, `metadata`, `auto`'],
        ['width / height', 'Größe in Pixeln']
      ],
      example: '<video controls width="640" height="360" poster="vorschau.jpg" preload="metadata">\n  <source src="film.webm" type="video/webm">\n  <source src="film.mp4" type="video/mp4">\n  <track kind="subtitles" src="de.vtt" srclang="de" label="Deutsch" default>\n</video>',
      demo: '<video controls width="260" height="150" poster="' + IMG + '"></video>',
      tip: 'Stummgeschaltete Hintergrundvideos: `autoplay muted loop playsinline`.',
      keywords: ['film', 'movie', 'player', 'poster', 'untertitel'],
      related: ['<source>', '<track>', '<audio>'], display: 'inline', mdn: MDN + 'video'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<track>',
      desc: 'Fügt Untertitel oder Textspuren zu audio/video hinzu.',
      details: 'Leeres Kind-Element von `<audio>` oder `<video>`, das eine WebVTT-Datei (`.vtt`) einbindet. Mit `kind` legt man die Art fest (Untertitel, Beschreibungen, Kapitel), `srclang` und `label` identifizieren die Sprache im Menü. Die Datei muss vom selben Origin kommen oder per CORS freigegeben sein.',
      syntax: '<track kind="subtitles" src="de.vtt" srclang="de" label="Deutsch">',
      values: [
        ['kind', '`subtitles`, `captions`, `descriptions`, `chapters`, `metadata`'],
        ['src', 'URL der WebVTT-Datei (Pflicht)'],
        ['srclang', 'Sprachcode, z. B. `de`'],
        ['label', 'Anzeigename im Menü'],
        ['default', 'Spur standardmäßig aktivieren']
      ],
      example: '<video controls src="film.mp4">\n  <track kind="subtitles" src="de.vtt" srclang="de" label="Deutsch" default>\n  <track kind="subtitles" src="en.vtt" srclang="en" label="English">\n</video>',
      keywords: ['untertitel', 'vtt', 'webvtt', 'captions', 'barrierefreiheit'],
      related: ['<video>', '<audio>'], mdn: MDN + 'track'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<iframe>',
      desc: 'Bettet eine andere HTML-Seite als Rahmen ein.',
      details: 'Lädt ein eigenes Dokument in die Seite, etwa Karten oder Videos. Ein aussagekräftiger `title` ist für Barrierefreiheit Pflicht. Bei fremden Inhalten schränkt `sandbox` Rechte ein, `loading="lazy"` verschiebt das Laden. Manche Seiten verbieten die Einbettung per `X-Frame-Options` oder CSP.',
      syntax: '<iframe src="https://…" title="Beschreibung"></iframe>',
      values: [
        ['src', 'URL des einzubettenden Dokuments'],
        ['srcdoc', 'Inline-HTML statt externer URL'],
        ['title', 'Beschreibung für Screenreader (wichtig)'],
        ['width / height', 'Größe in Pixeln'],
        ['loading', '`lazy` oder `eager`'],
        ['sandbox', 'Schränkt Rechte ein (z. B. `allow-scripts`)'],
        ['allow', 'Permissions Policy, z. B. `fullscreen; camera`'],
        ['allowfullscreen', 'Erlaubt Vollbild'],
        ['referrerpolicy', 'Welcher Referrer gesendet wird'],
        ['name', 'Ziel-Name für `target` von Links']
      ],
      example: '<iframe\n  src="https://www.openstreetmap.org/export/embed.html"\n  title="Karte unseres Standorts"\n  width="600" height="400"\n  loading="lazy"\n  sandbox="allow-scripts allow-same-origin"></iframe>',
      demo: '<iframe srcdoc="&lt;p style=&quot;font-family:sans-serif;color:#b4367a&quot;&gt;Inhalt im iframe&lt;/p&gt;" title="Demo" width="240" height="70" style="border:1px solid #999"></iframe>',
      tip: 'Fremde Inhalte immer mit `sandbox` und möglichst wenigen Rechten einbetten.',
      keywords: ['frame', 'einbetten', 'embed', 'youtube', 'karte', 'sandbox'],
      related: ['<embed>', '<object>'], display: 'inline', mdn: MDN + 'iframe'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<embed>',
      desc: 'Bettet externen Inhalt oder ein Plug-in-Objekt ein.',
      details: 'Leeres Element für externe Ressourcen wie PDFs oder SVGs. Es hat keinen Fallback-Inhalt; dafür ist `<object>` besser geeignet. Plug-ins (Flash) sind tot, heute nutzt man `<embed>` selten, meist sind `<iframe>`, `<img>` oder `<video>` passender.',
      syntax: '<embed src="datei.pdf" type="application/pdf" width="600" height="400">',
      values: [
        ['src', 'URL der Ressource'],
        ['type', 'MIME-Typ'],
        ['width / height', 'Größe in Pixeln']
      ],
      example: '<embed src="handbuch.pdf" type="application/pdf" width="600" height="800">',
      keywords: ['pdf', 'plugin', 'einbetten'],
      related: ['<object>', '<iframe>'], display: 'inline', mdn: MDN + 'embed'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<object>',
      desc: 'Bettet externe Ressource ein, mit Fallback-Inhalt.',
      details: 'Kann Bilder, PDFs, SVGs oder verschachtelte Dokumente einbinden. Der Inhalt zwischen den Tags dient als Fallback, wenn die Ressource nicht geladen werden kann. Heute ist es vor allem für SVG mit Fallback oder PDF-Einbettung relevant.',
      syntax: '<object data="datei.pdf" type="application/pdf">Fallback</object>',
      values: [
        ['data', 'URL der Ressource'],
        ['type', 'MIME-Typ'],
        ['width / height', 'Größe in Pixeln'],
        ['name', 'Name für Verweise (`target`)'],
        ['form', 'ID eines zugehörigen Formulars']
      ],
      example: '<object data="logo.svg" type="image/svg+xml" width="200" height="80">\n  <img src="logo.png" alt="Firmenlogo">\n</object>',
      keywords: ['pdf', 'svg', 'fallback', 'einbetten'],
      related: ['<embed>', '<iframe>'], display: 'inline', mdn: MDN + 'object'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<canvas>',
      desc: 'Zeichenfläche für Grafiken per JavaScript.',
      details: 'Pixelbasierte Zeichenfläche, die per JavaScript über `getContext(\'2d\')` oder WebGL bespielt wird. Größe immer über die Attribute `width`/`height` setzen; per CSS skaliert nur das Bitmap und wird unscharf. Inhalt zwischen den Tags ist Fallback und wichtig für Barrierefreiheit, da der Canvas selbst nicht auslesbar ist.',
      syntax: '<canvas id="c" width="300" height="150">Fallback-Text</canvas>',
      values: [
        ['width', 'Breite der Zeichenfläche in Pixeln (Standard 300)'],
        ['height', 'Höhe in Pixeln (Standard 150)']
      ],
      example: '<canvas id="chart" width="400" height="200">\n  Diagramm: Umsatz steigt von 10 auf 25 Mio.\n</canvas>\n<script>\n  const ctx = document.getElementById(\'chart\').getContext(\'2d\');\n  ctx.fillStyle = \'#b4367a\';\n  ctx.fillRect(10, 10, 100, 50);\n</script>',
      keywords: ['zeichnen', 'webgl', 'grafik', '2d', 'spiel'],
      related: ['<svg>', '<img>'], display: 'inline', mdn: MDN + 'canvas'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<svg>',
      desc: 'Container für Inline-Vektorgrafiken.',
      details: 'Bettet Vektorgrafik direkt ins HTML ein. Sie bleibt in jeder Größe scharf und lässt sich per CSS und JavaScript stylen. Mit `viewBox` skaliert die Grafik flexibel, `currentColor` übernimmt die Textfarbe. Für Barrierefreiheit `<title>` hineinsetzen oder `role="img"` mit `aria-label` nutzen; dekorative Icons mit `aria-hidden="true"`.',
      syntax: '<svg viewBox="0 0 100 100" width="100" height="100">…</svg>',
      values: [
        ['viewBox', '`min-x min-y breite höhe`: eigenes Koordinatensystem'],
        ['width / height', 'Darstellungsgröße'],
        ['xmlns', 'Namensraum, nur bei eigenständigen .svg-Dateien nötig'],
        ['role / aria-label', 'Zugängliche Beschreibung']
      ],
      example: '<svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="Rosa Kreis">\n  <circle cx="50" cy="50" r="40" fill="#b4367a" />\n</svg>',
      demo: '<svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="Rosa Kreis"><circle cx="50" cy="50" r="40" fill="#b4367a"/><rect x="35" y="35" width="30" height="30" fill="#fff"/></svg>',
      keywords: ['vektor', 'icon', 'grafik', 'viewbox', 'inline'],
      related: ['<canvas>', '<img>'], display: 'inline', mdn: 'https://developer.mozilla.org/de/docs/Web/SVG/Element/svg'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<map>',
      desc: 'Definiert eine Image Map mit klickbaren Bereichen.',
      details: 'Enthält `<area>`-Elemente, die Bereiche eines Bildes als Links definieren. Das Bild verweist per `usemap="#name"` auf die Map, die über `name` identifiziert wird. Die Koordinaten sind in Pixeln und skalieren nicht mit responsiven Bildern mit, daher nur bei festen Größen sinnvoll.',
      syntax: '<map name="karte">\n  <area …>\n</map>',
      values: [['name', 'Name, auf den `usemap="#name"` verweist']],
      example: '<img src="landkarte.png" alt="Karte" usemap="#karte" width="400" height="300">\n<map name="karte">\n  <area shape="rect" coords="0,0,200,150" href="/nord" alt="Norden">\n  <area shape="circle" coords="300,200,50" href="/sued" alt="Süden">\n</map>',
      demo: '<img src="' + IMG + '" alt="Demo" usemap="#demo" width="160" height="100"><map name="demo"><area shape="rect" coords="0,0,80,100" href="#" alt="Linke Hälfte"><area shape="circle" coords="120,50,30" href="#" alt="Kreis"></map><p style="font:13px sans-serif">Linke Hälfte und Kreis sind klickbar.</p>',
      keywords: ['image map', 'bereiche', 'klickbar'],
      related: ['<area>', '<img>'], mdn: MDN + 'map'
    },
    {
      lang: 'html', group: 'Bilder & Medien', name: '<area>',
      desc: 'Klickbarer Bereich innerhalb einer Image Map.',
      details: 'Leeres Element innerhalb von `<map>`. `shape` und `coords` legen den Bereich fest, `href` das Ziel, `alt` ist bei Links Pflicht. Die Koordinaten sind Pixel relativ zur linken oberen Ecke des Bildes.',
      syntax: '<area shape="rect" coords="x1,y1,x2,y2" href="ziel" alt="Text">',
      values: [
        ['shape', '`rect`, `circle`, `poly` oder `default`'],
        ['coords', 'rect: `x1,y1,x2,y2`; circle: `x,y,r`; poly: `x1,y1,x2,y2,…`'],
        ['href', 'Linkziel'],
        ['alt', 'Textalternative (Pflicht bei `href`)'],
        ['target', 'Ziel-Fenster, z. B. `_blank`'],
        ['download', 'Datei herunterladen statt öffnen']
      ],
      example: '<area shape="poly" coords="10,10 90,10 50,80" href="/dreieck" alt="Dreieck">',
      keywords: ['hotspot', 'koordinaten', 'image map'],
      related: ['<map>'], mdn: MDN + 'area'
    },

    // ===== Tabellen =====
    {
      lang: 'html', group: 'Tabellen', name: '<table>',
      desc: 'Container für tabellarische Daten.',
      details: 'Stellt Daten in Zeilen und Spalten dar. Nur für echte Tabellendaten verwenden, nicht für das Seitenlayout. Strukturiere sie mit `<caption>`, `<thead>`, `<tbody>`, `<tfoot>` und `<th>` mit `scope`, das hilft Screenreadern. Rahmen, Abstände und Streifen werden per CSS gesteuert (`border-collapse`, `border-spacing`), nicht über veraltete Attribute wie `border` oder `cellpadding`.',
      syntax: '<table>\n  <tr><th>…</th></tr>\n  <tr><td>…</td></tr>\n</table>',
      example: '<table>\n  <caption>Quartalsumsatz</caption>\n  <thead>\n    <tr><th scope="col">Quartal</th><th scope="col">Umsatz</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Q1</td><td>12 000 €</td></tr>\n    <tr><td>Q2</td><td>15 500 €</td></tr>\n  </tbody>\n  <tfoot>\n    <tr><th scope="row">Summe</th><td>27 500 €</td></tr>\n  </tfoot>\n</table>',
      demo: TSTYLE + '<table><caption>Quartalsumsatz</caption><thead><tr><th scope="col">Quartal</th><th scope="col">Umsatz</th></tr></thead><tbody><tr><td>Q1</td><td>12 000 €</td></tr><tr><td>Q2</td><td>15 500 €</td></tr></tbody><tfoot><tr><th scope="row">Summe</th><td>27 500 €</td></tr></tfoot></table>',
      tip: 'Breite Tabellen auf Mobilgeräten in einen Wrapper mit `overflow-x: auto` setzen.',
      keywords: ['tabelle', 'zeilen', 'spalten', 'daten', 'grid'],
      related: ['<caption>', '<thead>', '<tbody>', '<tr>', '<th>', '<td>'], display: 'table', mdn: MDN + 'table'
    },
    {
      lang: 'html', group: 'Tabellen', name: '<caption>',
      desc: 'Titel bzw. Beschriftung einer Tabelle.',
      details: 'Muss das erste Kind von `<table>` sein. Der Browser zeigt den Text standardmäßig oberhalb der Tabelle zentriert an, per CSS `caption-side` lässt er sich nach unten verschieben. Screenreader lesen ihn als Namen der Tabelle vor, deshalb ist er besser als eine Überschrift davor.',
      syntax: '<caption>Titel</caption>',
      example: '<table>\n  <caption>Mitarbeiter nach Abteilung</caption>\n  <tr><th>Name</th><th>Abteilung</th></tr>\n  <tr><td>Anna</td><td>Vertrieb</td></tr>\n</table>',
      demo: TSTYLE + '<table><caption>Mitarbeiter nach Abteilung</caption><tr><th>Name</th><th>Abteilung</th></tr><tr><td>Anna</td><td>Vertrieb</td></tr></table>',
      keywords: ['titel', 'beschriftung', 'überschrift', 'tabelle'],
      related: ['<table>'], display: 'table-caption', mdn: MDN + 'caption'
    },
    {
      lang: 'html', group: 'Tabellen', name: '<thead>',
      desc: 'Gruppiert die Kopfzeilen einer Tabelle.',
      details: 'Enthält eine oder mehrere `<tr>` mit den Spaltenüberschriften. Steht vor `<tbody>`. Beim Drucken kann der Browser den Kopf auf jeder Seite wiederholen, und per CSS `position: sticky` lässt sich der Kopf beim Scrollen fixieren.',
      syntax: '<thead>\n  <tr><th>…</th></tr>\n</thead>',
      example: '<table>\n  <thead>\n    <tr><th>Produkt</th><th>Preis</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Stift</td><td>1,20 €</td></tr>\n  </tbody>\n</table>',
      demo: TSTYLE + '<table><thead><tr><th>Produkt</th><th>Preis</th></tr></thead><tbody><tr><td>Stift</td><td>1,20 €</td></tr></tbody></table>',
      keywords: ['tabellenkopf', 'header', 'sticky'],
      related: ['<tbody>', '<tfoot>', '<th>'], display: 'table-header-group', mdn: MDN + 'thead'
    },
    {
      lang: 'html', group: 'Tabellen', name: '<tbody>',
      desc: 'Gruppiert die Datenzeilen einer Tabelle.',
      details: 'Fasst den Hauptteil der Tabelle zusammen. Browser fügen es automatisch ein, wenn man es weglässt, was bei CSS-Selektoren wie `table > tr` zu Überraschungen führt. Mehrere `<tbody>` sind erlaubt, um Zeilen logisch zu gruppieren.',
      syntax: '<tbody>\n  <tr>…</tr>\n</tbody>',
      example: '<table>\n  <tbody>\n    <tr><td>Montag</td><td>8 h</td></tr>\n    <tr><td>Dienstag</td><td>6 h</td></tr>\n  </tbody>\n  <tbody>\n    <tr><td>Samstag</td><td>frei</td></tr>\n  </tbody>\n</table>',
      demo: TSTYLE + '<table><tbody><tr><td>Montag</td><td>8 h</td></tr><tr><td>Dienstag</td><td>6 h</td></tr></tbody><tbody><tr><td>Samstag</td><td>frei</td></tr></tbody></table>',
      keywords: ['tabellenkörper', 'body', 'zeilengruppe'],
      related: ['<thead>', '<tfoot>', '<tr>'], display: 'table-row-group', mdn: MDN + 'tbody'
    },
    {
      lang: 'html', group: 'Tabellen', name: '<tfoot>',
      desc: 'Gruppiert die Fußzeilen einer Tabelle, z. B. Summen.',
      details: 'Enthält Zusammenfassungen wie Summen. Im aktuellen HTML-Standard steht es am Ende der Tabelle nach `<tbody>` (früher musste es davor stehen). Es wird immer unterhalb der Datenzeilen dargestellt.',
      syntax: '<tfoot>\n  <tr>…</tr>\n</tfoot>',
      example: '<table>\n  <tbody>\n    <tr><td>Stift</td><td>1,20 €</td></tr>\n    <tr><td>Heft</td><td>2,80 €</td></tr>\n  </tbody>\n  <tfoot>\n    <tr><th scope="row">Summe</th><td>4,00 €</td></tr>\n  </tfoot>\n</table>',
      demo: TSTYLE + '<table><tbody><tr><td>Stift</td><td>1,20 €</td></tr><tr><td>Heft</td><td>2,80 €</td></tr></tbody><tfoot><tr><th scope="row">Summe</th><td>4,00 €</td></tr></tfoot></table>',
      keywords: ['fußzeile', 'summe', 'footer'],
      related: ['<thead>', '<tbody>'], display: 'table-footer-group', mdn: MDN + 'tfoot'
    },
    {
      lang: 'html', group: 'Tabellen', name: '<tr>',
      desc: 'Eine Tabellenzeile.',
      details: 'Enthält `<th>`- und `<td>`-Zellen. Alle Zeilen sollten dieselbe Anzahl logischer Zellen haben (unter Beachtung von `colspan`/`rowspan`). Für Zebrastreifen eignet sich `tr:nth-child(even)` in CSS.',
      syntax: '<tr>\n  <td>…</td>\n</tr>',
      example: '<tr>\n  <th scope="row">Anna</th>\n  <td>Berlin</td>\n  <td>32</td>\n</tr>',
      demo: TSTYLE + '<table><tr><th scope="row">Anna</th><td>Berlin</td><td>32</td></tr><tr><th scope="row">Ben</th><td>Köln</td><td>28</td></tr></table>',
      keywords: ['zeile', 'row'],
      related: ['<td>', '<th>', '<table>'], display: 'table-row', mdn: MDN + 'tr'
    },
    {
      lang: 'html', group: 'Tabellen', name: '<th>',
      desc: 'Überschriftszelle einer Tabelle.',
      details: 'Kennzeichnet Spalten- oder Zeilenköpfe, fett und zentriert dargestellt. Mit `scope="col"` bzw. `scope="row"` ordnest du die Überschrift zu, bei komplexen Tabellen hilft `headers`. `colspan` und `rowspan` verbinden Zellen.',
      syntax: '<th scope="col">Überschrift</th>',
      values: [
        ['scope', '`col`, `row`, `colgroup`, `rowgroup`: worauf sich die Überschrift bezieht'],
        ['colspan', 'Anzahl der überspannten Spalten'],
        ['rowspan', 'Anzahl der überspannten Zeilen'],
        ['headers', 'IDs zugehöriger Überschriftszellen (komplexe Tabellen)'],
        ['abbr', 'Kurzform für Screenreader']
      ],
      example: '<tr>\n  <th scope="col">Name</th>\n  <th scope="col" colspan="2">Kontakt</th>\n</tr>',
      demo: TSTYLE + '<table><tr><th scope="col">Name</th><th scope="col" colspan="2">Kontakt</th></tr><tr><td>Anna</td><td>Telefon</td><td>E-Mail</td></tr></table>',
      keywords: ['überschrift', 'kopfzelle', 'scope', 'header cell'],
      related: ['<td>', '<tr>', '<thead>'], display: 'table-cell', mdn: MDN + 'th'
    },
    {
      lang: 'html', group: 'Tabellen', name: '<td>',
      desc: 'Datenzelle einer Tabelle.',
      details: 'Enthält den eigentlichen Inhalt einer Zelle, auch Listen, Bilder oder Formularelemente. Mit `colspan` und `rowspan` überspannt eine Zelle mehrere Spalten oder Zeilen; die nachfolgenden Zellen rücken dann entsprechend. Zellabstand regelst du per CSS (`padding`), nicht mit `cellpadding`.',
      syntax: '<td>Inhalt</td>',
      values: [
        ['colspan', 'Anzahl der überspannten Spalten'],
        ['rowspan', 'Anzahl der überspannten Zeilen'],
        ['headers', 'IDs zugehöriger Überschriftszellen']
      ],
      example: '<table>\n  <tr><td rowspan="2">A</td><td>B</td></tr>\n  <tr><td>C</td></tr>\n  <tr><td colspan="2">D (über beide Spalten)</td></tr>\n</table>',
      demo: TSTYLE + '<table><tr><td rowspan="2">A</td><td>B</td></tr><tr><td>C</td></tr><tr><td colspan="2">D (über beide Spalten)</td></tr></table>',
      keywords: ['zelle', 'cell', 'colspan', 'rowspan', 'verbinden'],
      related: ['<th>', '<tr>'], display: 'table-cell', mdn: MDN + 'td'
    },
    {
      lang: 'html', group: 'Tabellen', name: '<colgroup>',
      desc: 'Gruppiert Spalten, um sie gemeinsam zu formatieren.',
      details: 'Steht direkt nach `<caption>` und vor `<thead>`. Enthält `<col>`-Elemente oder wird selbst mit `span` verwendet. Damit lassen sich ganze Spalten stylen, wobei nur wenige CSS-Eigenschaften wirken (`background`, `border`, `width`, `visibility`).',
      syntax: '<colgroup>\n  <col>\n</colgroup>',
      values: [['span', 'Anzahl der Spalten der Gruppe (wenn keine `<col>` enthalten sind)']],
      example: '<table>\n  <colgroup>\n    <col>\n    <col style="background: #ffe9f4">\n  </colgroup>\n  <tr><th>Name</th><th>Punkte</th></tr>\n  <tr><td>Anna</td><td>12</td></tr>\n</table>',
      demo: TSTYLE + '<table><colgroup><col><col style="background:#ffe9f4"></colgroup><tr><th>Name</th><th>Punkte</th></tr><tr><td>Anna</td><td>12</td></tr><tr><td>Ben</td><td>9</td></tr></table>',
      keywords: ['spaltengruppe', 'spalten formatieren'],
      related: ['<col>', '<table>'], display: 'table-column-group', mdn: MDN + 'colgroup'
    },
    {
      lang: 'html', group: 'Tabellen', name: '<col>',
      desc: 'Definiert eine Spalte innerhalb einer colgroup.',
      details: 'Leeres Element in `<colgroup>`, um einzelne Spalten zu formatieren, ohne jede Zelle zu markieren. `span` lässt es mehrere Spalten abdecken. Funktioniert nur für wenige Eigenschaften wie `background`, `border`, `width` und `visibility`.',
      syntax: '<col span="2" style="width: 100px">',
      values: [['span', 'Anzahl der Spalten, die das Element abdeckt (Standard 1)']],
      example: '<colgroup>\n  <col style="width: 40%">\n  <col span="2" style="background: #eef">\n</colgroup>',
      keywords: ['spalte', 'column', 'spaltenbreite'],
      related: ['<colgroup>'], display: 'table-column', mdn: MDN + 'col'
    },

    // ===== Formulare =====
    {
      lang: 'html', group: 'Formulare', name: '<form>',
      desc: 'Container für Formularelemente, der Daten absendet.',
      details: 'Fasst Eingabefelder zusammen und sendet sie beim Absenden an `action`. Mit `method="post"` gehen die Daten im Body, mit `get` in der URL (nur für Suchen o. Ä.). Jedes Feld braucht ein `name`, sonst wird es nicht übertragen. `novalidate` schaltet die Browser-Validierung ab; Formulare sind auch ohne JavaScript nutzbar.',
      syntax: '<form action="/senden" method="post">…</form>',
      values: [
        ['action', 'Ziel-URL, an die gesendet wird'],
        ['method', '`get` oder `post` (oder `dialog`)'],
        ['enctype', 'Kodierung bei POST; `multipart/form-data` für Datei-Uploads'],
        ['target', 'Wo die Antwort erscheint, z. B. `_blank`'],
        ['autocomplete', '`on` oder `off`: Browser-Autofill'],
        ['novalidate', 'Schaltet die Browser-Validierung ab'],
        ['name', 'Name des Formulars'],
        ['accept-charset', 'Zeichenkodierung der Übertragung']
      ],
      example: '<form action="/kontakt" method="post">\n  <label for="name">Name</label>\n  <input id="name" name="name" required>\n  <label for="mail">E-Mail</label>\n  <input id="mail" name="mail" type="email" required>\n  <button type="submit">Senden</button>\n</form>',
      demo: FSTYLE + '<form onsubmit="return false"><label for="n1">Name</label><input id="n1" name="name" required><label for="m1">E-Mail</label><input id="m1" name="mail" type="email" required><p><button type="submit">Senden</button></p></form>',
      tip: 'Datei-Uploads brauchen `method="post"` und `enctype="multipart/form-data"`.',
      keywords: ['formular', 'absenden', 'submit', 'post', 'get', 'eingabe'],
      related: ['<input>', '<label>', '<button>', '<fieldset>'], display: 'block', mdn: MDN + 'form'
    },
    {
      lang: 'html', group: 'Formulare', name: '<label>',
      desc: 'Beschriftung für ein Formularfeld.',
      details: 'Verknüpft Text mit einem Feld: Ein Klick auf das Label fokussiert das Feld bzw. schaltet Checkboxen und Radios um, Screenreader lesen den Text vor. Entweder per `for="id"` oder indem das Feld im Label verschachtelt wird. Ein `placeholder` ersetzt niemals ein Label.',
      syntax: '<label for="id">Text</label>',
      values: [
        ['for', 'ID des zugehörigen Formularelements'],
        ['form', 'ID eines Formulars, falls das Label außerhalb steht']
      ],
      example: '<label for="vorname">Vorname</label>\n<input id="vorname" name="vorname">\n\n<label>\n  <input type="checkbox" name="agb"> Ich stimme zu\n</label>',
      demo: FSTYLE + '<label for="v1">Vorname</label><input id="v1"><label><input type="checkbox"> Klick auf den Text schaltet die Checkbox</label>',
      keywords: ['beschriftung', 'for', 'barrierefreiheit', 'feldname'],
      related: ['<input>', '<select>', '<textarea>'], display: 'inline', mdn: MDN + 'label'
    },
    {
      lang: 'html', group: 'Formulare', name: '<input>',
      desc: 'Vielseitiges Eingabefeld, Verhalten hängt vom type ab.',
      details: 'Leeres Element, dessen Aussehen und Prüfung der `type` bestimmt (Standard `text`). Jedes Feld braucht `name` zum Senden und ein zugehöriges `<label>`. Die Browser-Validierung steuern `required`, `min`, `max`, `minlength`, `maxlength` und `pattern`. Die einzelnen Typen sind unter „Input-Typen“ aufgeführt.',
      syntax: '<input type="text" name="feld" id="feld">',
      values: [
        ['type', 'Art des Feldes, z. B. `text`, `email`, `number`'],
        ['name', 'Schlüssel beim Absenden'],
        ['value', 'Vorgabe- bzw. aktueller Wert'],
        ['placeholder', 'Hinweistext im leeren Feld (kein Label-Ersatz)'],
        ['required', 'Pflichtfeld'],
        ['disabled', 'Deaktiviert, wird nicht gesendet'],
        ['readonly', 'Schreibgeschützt, wird gesendet'],
        ['autocomplete', 'Autofill-Hinweis, z. B. `email`, `given-name`'],
        ['autofocus', 'Fokus beim Laden'],
        ['min / max / step', 'Grenzen und Schrittweite (number, range, date …)'],
        ['minlength / maxlength', 'Mindest- bzw. Höchstlänge'],
        ['pattern', 'Regulärer Ausdruck zur Validierung'],
        ['list', 'ID einer `<datalist>` mit Vorschlägen'],
        ['multiple', 'Mehrere Werte (email, file)'],
        ['inputmode', 'Tastaturart auf Mobilgeräten, z. B. `numeric`']
      ],
      example: '<label for="alter">Alter</label>\n<input\n  id="alter" name="alter" type="number"\n  min="18" max="99" required\n  placeholder="z. B. 30">',
      demo: FSTYLE + '<label for="i1">Text</label><input id="i1" placeholder="Hier tippen"><label for="i2">Pflichtfeld (Zahl 18–99)</label><input id="i2" type="number" min="18" max="99" required>',
      tip: 'Der `type` gehört zu den wichtigsten Attributen: Er liefert passende Tastaturen und eingebaute Validierung.',
      keywords: ['eingabe', 'feld', 'textfeld', 'formularfeld', 'input'],
      related: ['<label>', '<form>', '<datalist>', '<textarea>'], display: 'inline-block', mdn: MDN + 'input'
    },
    {
      lang: 'html', group: 'Formulare', name: '<button>',
      desc: 'Klickbare Schaltfläche.',
      details: 'Kann beliebigen Inhalt (Text, Icons) enthalten. Innerhalb eines Formulars ist der Standard-`type` `submit`, ein Klick sendet es ab. Für reine JavaScript-Aktionen daher `type="button"` setzen. Für Navigation verwendet man dagegen einen Link `<a>`.',
      syntax: '<button type="button">Text</button>',
      values: [
        ['type', '`submit` (Standard), `reset` oder `button`'],
        ['name / value', 'Wird beim Absenden mitgesendet'],
        ['disabled', 'Deaktiviert den Button'],
        ['form', 'ID eines Formulars, zu dem der Button gehört'],
        ['formaction', 'Überschreibt `action` des Formulars'],
        ['formmethod', 'Überschreibt `method`'],
        ['formnovalidate', 'Sendet ohne Validierung'],
        ['popovertarget', 'ID eines Popover-Elements, das er steuert']
      ],
      example: '<button type="submit">Speichern</button>\n<button type="reset">Zurücksetzen</button>\n<button type="button" id="mehr">Mehr laden</button>',
      demo: FSTYLE + '<button type="button">Normal</button> <button type="button" disabled>Deaktiviert</button> <button type="button" style="background:#b4367a;color:#fff;border:0;border-radius:4px">Primär</button>',
      tip: 'Ein Button ohne `type` in einem Formular sendet es ab. Das ist ein häufiger Fehler.',
      keywords: ['knopf', 'schaltfläche', 'submit', 'klick'],
      related: ['<form>', '<input type="submit">', '<input type="button">'], display: 'inline-block', mdn: MDN + 'button'
    },
    {
      lang: 'html', group: 'Formulare', name: '<select>',
      desc: 'Dropdown- bzw. Listenauswahl.',
      details: 'Enthält `<option>`- und `<optgroup>`-Elemente. Mit `multiple` wird eine Mehrfachauswahl-Liste daraus, `size` bestimmt die Anzahl sichtbarer Zeilen. Eine erste Option mit leerem `value` dient oft als Platzhalter und lässt sich mit `required` zur Pflicht machen. Seit neuerem HTML lässt sich `<select>` per CSS (`appearance: base-select`) stärker gestalten.',
      syntax: '<select name="wahl">\n  <option value="a">A</option>\n</select>',
      values: [
        ['name', 'Schlüssel beim Absenden'],
        ['multiple', 'Mehrfachauswahl'],
        ['size', 'Anzahl sichtbarer Zeilen'],
        ['required', 'Auswahl ist Pflicht'],
        ['disabled', 'Deaktiviert'],
        ['autocomplete', 'Autofill-Hinweis']
      ],
      example: '<label for="land">Land</label>\n<select id="land" name="land" required>\n  <option value="">Bitte wählen</option>\n  <option value="de">Deutschland</option>\n  <option value="at">Österreich</option>\n  <option value="ch">Schweiz</option>\n</select>',
      demo: FSTYLE + '<label for="s1">Land</label><select id="s1"><option value="">Bitte wählen</option><option>Deutschland</option><option>Österreich</option><option>Schweiz</option></select>',
      keywords: ['dropdown', 'auswahl', 'combobox', 'liste'],
      related: ['<option>', '<optgroup>', '<datalist>'], display: 'inline-block', mdn: MDN + 'select'
    },
    {
      lang: 'html', group: 'Formulare', name: '<option>',
      desc: 'Eine Auswahlmöglichkeit in select, optgroup oder datalist.',
      details: 'Der sichtbare Text ist das Label, `value` der gesendete Wert (fehlt es, wird der Text gesendet). `selected` legt die Vorauswahl fest, `disabled` macht die Option unwählbar. In `<datalist>` genügt oft nur `value`.',
      syntax: '<option value="wert">Text</option>',
      values: [
        ['value', 'Gesendeter Wert'],
        ['selected', 'Vorausgewählt'],
        ['disabled', 'Nicht wählbar'],
        ['label', 'Alternativer Anzeigetext']
      ],
      example: '<select name="groesse">\n  <option value="s">Klein</option>\n  <option value="m" selected>Mittel</option>\n  <option value="l" disabled>Groß (ausverkauft)</option>\n</select>',
      demo: FSTYLE + '<select><option>Klein</option><option selected>Mittel</option><option disabled>Groß (ausverkauft)</option></select>',
      keywords: ['auswahlmöglichkeit', 'eintrag', 'selected'],
      related: ['<select>', '<optgroup>', '<datalist>'], mdn: MDN + 'option'
    },
    {
      lang: 'html', group: 'Formulare', name: '<optgroup>',
      desc: 'Gruppiert Optionen in einer select-Liste.',
      details: 'Fasst mehrere `<option>` unter einer Überschrift (`label`) zusammen, die nicht wählbar ist. Gruppen lassen sich nicht verschachteln. Mit `disabled` deaktivierst du die ganze Gruppe.',
      syntax: '<optgroup label="Titel">\n  <option>…</option>\n</optgroup>',
      values: [
        ['label', 'Gruppenüberschrift (Pflicht)'],
        ['disabled', 'Deaktiviert die ganze Gruppe']
      ],
      example: '<select name="stadt">\n  <optgroup label="Deutschland">\n    <option>Berlin</option>\n    <option>Hamburg</option>\n  </optgroup>\n  <optgroup label="Österreich">\n    <option>Wien</option>\n  </optgroup>\n</select>',
      demo: FSTYLE + '<select><optgroup label="Deutschland"><option>Berlin</option><option>Hamburg</option></optgroup><optgroup label="Österreich"><option>Wien</option></optgroup></select>',
      keywords: ['gruppe', 'kategorie', 'select'],
      related: ['<select>', '<option>'], mdn: MDN + 'optgroup'
    },
    {
      lang: 'html', group: 'Formulare', name: '<textarea>',
      desc: 'Mehrzeiliges Textfeld.',
      details: 'Für längere Texte. Der Vorgabewert steht zwischen den Tags (nicht im `value`-Attribut), Leerzeichen und Zeilenumbrüche bleiben erhalten. Die Größe wird mit `rows`/`cols` oder per CSS (`width`, `height`, `resize`) bestimmt. Der Nutzer kann sie standardmäßig ziehen; `resize: none` verhindert das.',
      syntax: '<textarea name="text" rows="4"></textarea>',
      values: [
        ['name', 'Schlüssel beim Absenden'],
        ['rows / cols', 'Sichtbare Zeilen bzw. Zeichen pro Zeile'],
        ['placeholder', 'Hinweistext'],
        ['maxlength / minlength', 'Höchst- bzw. Mindestlänge'],
        ['required', 'Pflichtfeld'],
        ['readonly / disabled', 'Schreibgeschützt bzw. deaktiviert'],
        ['wrap', '`soft` (Standard) oder `hard`: Zeilenumbruch beim Senden'],
        ['spellcheck', 'Rechtschreibprüfung ein/aus']
      ],
      example: '<label for="msg">Nachricht</label>\n<textarea id="msg" name="nachricht" rows="5" cols="40" maxlength="500" placeholder="Ihre Nachricht …"></textarea>',
      demo: FSTYLE + '<label for="t1">Nachricht</label><textarea id="t1" rows="4" cols="30" placeholder="Ihre Nachricht …"></textarea>',
      tip: 'Mit CSS `field-sizing: content` wächst das Feld inzwischen mit dem Inhalt.',
      keywords: ['textbox', 'mehrzeilig', 'kommentar', 'nachricht'],
      related: ['<input type="text">', '<label>'], display: 'inline-block', mdn: MDN + 'textarea'
    },
    {
      lang: 'html', group: 'Formulare', name: '<fieldset>',
      desc: 'Gruppiert zusammengehörige Formularfelder.',
      details: 'Umrahmt verwandte Felder und wird mit einem `<legend>` als erstem Kind beschriftet. Besonders wichtig für Radio- und Checkbox-Gruppen, damit Screenreader die Frage zusammen mit jeder Option vorlesen. Mit `disabled` deaktivierst du alle enthaltenen Felder auf einmal.',
      syntax: '<fieldset>\n  <legend>Titel</legend>\n  …\n</fieldset>',
      values: [
        ['disabled', 'Deaktiviert alle enthaltenen Felder'],
        ['form', 'ID eines Formulars'],
        ['name', 'Name zur Identifikation']
      ],
      example: '<fieldset>\n  <legend>Lieferart</legend>\n  <label><input type="radio" name="lieferart" value="post" checked> Post</label>\n  <label><input type="radio" name="lieferart" value="abholung"> Abholung</label>\n</fieldset>',
      demo: FSTYLE + '<fieldset><legend>Lieferart</legend><label><input type="radio" name="la" checked> Post</label><label><input type="radio" name="la"> Abholung</label></fieldset>',
      keywords: ['gruppe', 'rahmen', 'gruppieren', 'radio gruppe'],
      related: ['<legend>', '<form>'], display: 'block', mdn: MDN + 'fieldset'
    },
    {
      lang: 'html', group: 'Formulare', name: '<legend>',
      desc: 'Beschriftung eines fieldset (oder einer Gruppe).',
      details: 'Muss das erste Kind des `<fieldset>` sein und wird in dessen Rahmen eingefasst dargestellt. Screenreader lesen es als Gruppenname vor. Seine Optik lässt sich per CSS anpassen, ist aber wegen der Rahmenüberlappung manchmal schwierig zu stylen.',
      syntax: '<legend>Gruppentitel</legend>',
      example: '<fieldset>\n  <legend>Zahlungsart</legend>\n  …\n</fieldset>',
      demo: FSTYLE + '<fieldset><legend>Zahlungsart</legend><label><input type="radio" name="z"> Karte</label><label><input type="radio" name="z"> Rechnung</label></fieldset>',
      keywords: ['überschrift', 'gruppentitel', 'fieldset'],
      related: ['<fieldset>'], display: 'block', mdn: MDN + 'legend'
    },
    {
      lang: 'html', group: 'Formulare', name: '<datalist>',
      desc: 'Liefert Vorschläge für ein Eingabefeld.',
      details: 'Enthält `<option>`-Elemente, die ein `<input>` über sein `list`-Attribut (ID der Datalist) als Vorschläge anbietet. Der Nutzer kann auch freien Text eingeben, im Gegensatz zu `<select>`. Funktioniert mit text, email, url, number, date, color und weiteren Typen.',
      syntax: '<input list="id">\n<datalist id="id">\n  <option value="…">\n</datalist>',
      example: '<label for="browser">Browser</label>\n<input id="browser" name="browser" list="browser-liste">\n<datalist id="browser-liste">\n  <option value="Firefox">\n  <option value="Chrome">\n  <option value="Safari">\n</datalist>',
      demo: FSTYLE + '<label for="d1">Browser (Vorschläge beim Tippen)</label><input id="d1" list="dl1"><datalist id="dl1"><option value="Firefox"><option value="Chrome"><option value="Safari"></datalist>',
      keywords: ['autovervollständigung', 'vorschläge', 'autocomplete', 'combobox'],
      related: ['<input>', '<option>', '<select>'], display: 'none', mdn: MDN + 'datalist'
    },
    {
      lang: 'html', group: 'Formulare', name: '<output>',
      desc: 'Zeigt das Ergebnis einer Berechnung oder Nutzeraktion an.',
      details: 'Container für berechnete Werte, der von Screenreadern als Live-Region behandelt wird. Mit `for` benennt man die beteiligten Feld-IDs, mit `form` das Formular. Befüllt wird er per JavaScript.',
      syntax: '<output for="a b" name="summe"></output>',
      values: [
        ['for', 'IDs der Elemente, die in die Berechnung einfließen'],
        ['form', 'ID des zugehörigen Formulars'],
        ['name', 'Name des Elements']
      ],
      example: '<form oninput="summe.value = Number(a.value) + Number(b.value)">\n  <input type="number" id="a" value="2"> +\n  <input type="number" id="b" value="3"> =\n  <output name="summe" for="a b">5</output>\n</form>',
      demo: FSTYLE + '<p>Ergebnis: <output>42</output></p>',
      keywords: ['ergebnis', 'berechnung', 'ausgabe', 'live region'],
      related: ['<input>', '<form>'], display: 'inline', mdn: MDN + 'output'
    },
    {
      lang: 'html', group: 'Formulare', name: '<progress>',
      desc: 'Fortschrittsbalken für eine Aufgabe.',
      details: 'Zeigt den Fortschritt eines Vorgangs. Mit `value` und `max` (Standard 1) ist der Balken bestimmt; ohne `value` zeigt er einen unbestimmten Zustand (laufende Animation). Für Messwerte in einem Bereich ist `<meter>` das richtige Element. Fallback-Text zwischen den Tags ist für alte Browser.',
      syntax: '<progress value="30" max="100">30 %</progress>',
      values: [
        ['value', 'Aktueller Wert (0 bis `max`)'],
        ['max', 'Zielwert (Standard 1)']
      ],
      example: '<label for="upload">Upload</label>\n<progress id="upload" value="65" max="100">65 %</progress>',
      demo: FSTYLE + '<label for="p1">Upload</label><progress id="p1" value="65" max="100">65 %</progress><label for="p2">Unbestimmt</label><progress id="p2"></progress>',
      keywords: ['fortschritt', 'ladebalken', 'balken', 'progress bar'],
      related: ['<meter>'], display: 'inline-block', mdn: MDN + 'progress'
    },
    {
      lang: 'html', group: 'Formulare', name: '<meter>',
      desc: 'Anzeige eines Messwerts innerhalb eines bekannten Bereichs.',
      details: 'Für Skalenwerte wie Speicherauslastung oder Bewertungen, nicht für Fortschritt (dafür `<progress>`). Mit `low`, `high` und `optimum` färbt der Browser den Balken grün, gelb oder rot. Der Bereich ist standardmäßig 0 bis 1.',
      syntax: '<meter value="0.6" min="0" max="1"></meter>',
      values: [
        ['value', 'Aktueller Wert (Pflicht)'],
        ['min / max', 'Bereichsgrenzen (Standard 0 und 1)'],
        ['low', 'Obergrenze des „niedrigen“ Bereichs'],
        ['high', 'Untergrenze des „hohen“ Bereichs'],
        ['optimum', 'Optimaler Wert']
      ],
      example: '<label for="disk">Speicher</label>\n<meter id="disk" min="0" max="100" low="30" high="80" optimum="20" value="85">85 %</meter>',
      demo: FSTYLE + '<label for="m1">Gut</label><meter id="m1" min="0" max="100" low="30" high="80" optimum="20" value="15"></meter><label for="m2">Mittel</label><meter id="m2" min="0" max="100" low="30" high="80" optimum="20" value="50"></meter><label for="m3">Kritisch</label><meter id="m3" min="0" max="100" low="30" high="80" optimum="20" value="90"></meter>',
      keywords: ['messwert', 'skala', 'anzeige', 'gauge'],
      related: ['<progress>'], display: 'inline-block', mdn: MDN + 'meter'
    },

    // ===== Input-Typen =====
    IT('text', 'Einzeiliges Textfeld (Standard).',
      'Der Standardtyp für kurze Freitexte wie Namen. Zeilenumbrüche werden entfernt. Ohne `type` verhält sich `<input>` genauso. Für spezielle Daten sind E-Mail, Telefon oder URL besser, weil sie passende Tastaturen und Prüfungen liefern.',
      [['maxlength', 'Höchstzahl Zeichen'], ['minlength', 'Mindestzahl Zeichen'], ['pattern', 'Regulärer Ausdruck'], ['placeholder', 'Hinweistext'], ['size', 'Sichtbare Breite in Zeichen'], ['list', 'ID einer Datalist']],
      '<label for="stadt">Stadt</label>\n<input type="text" id="stadt" name="stadt" autocomplete="address-level2" maxlength="60">',
      '<label for="x">Stadt</label><input type="text" id="x" placeholder="z. B. Hamburg">',
      ['textfeld', 'eingabe', 'string']),
    IT('password', 'Passwortfeld, Zeichen werden maskiert.',
      'Blendet die Eingabe als Punkte aus, verschlüsselt aber nichts bei der Übertragung, dafür ist HTTPS nötig. Mit `autocomplete="new-password"` bzw. `current-password` helfen Passwortmanagern. Verhindere nie das Einfügen, das behindert Passwortmanager und Nutzer.',
      [['autocomplete', '`new-password` oder `current-password`'], ['minlength', 'Mindestlänge'], ['pattern', 'Regulärer Ausdruck']],
      '<label for="pw">Passwort</label>\n<input type="password" id="pw" name="pw" autocomplete="current-password" minlength="8" required>',
      '<label for="x">Passwort</label><input type="password" id="x" value="geheim123">',
      ['kennwort', 'passwort', 'verbergen']),
    IT('email', 'Feld für E-Mail-Adressen mit Formatprüfung.',
      'Prüft grob auf die Form `name@domain` und zeigt auf Mobilgeräten eine Tastatur mit `@`. Mit `multiple` sind kommagetrennte Adressen möglich. Die Prüfung ist nur oberflächlich, die echte Validierung muss auf dem Server erfolgen.',
      [['multiple', 'Mehrere, kommagetrennte Adressen'], ['pattern', 'Strengere Prüfung per Regex'], ['placeholder', 'Hinweistext'], ['autocomplete', '`email`']],
      '<label for="mail">E-Mail</label>\n<input type="email" id="mail" name="mail" autocomplete="email" required>',
      '<label for="x">E-Mail</label><input type="email" id="x" value="ungültig" required><p style="font-size:12px">Beim Absenden würde „ungültig“ abgelehnt.</p>',
      ['mail', 'e-mail', 'adresse']),
    IT('tel', 'Feld für Telefonnummern.',
      'Zeigt auf Mobilgeräten ein Zifferntastatur-Layout, führt aber keine Formatprüfung durch, da Nummern weltweit sehr unterschiedlich sind. Eine Validierung geht über `pattern`. Der Wert ist normaler Text.',
      [['pattern', 'Regulärer Ausdruck zur Prüfung'], ['placeholder', 'Hinweis, z. B. Format'], ['autocomplete', '`tel`']],
      '<label for="tel">Telefon</label>\n<input type="tel" id="tel" name="tel" autocomplete="tel" placeholder="+49 30 123456">',
      '<label for="x">Telefon</label><input type="tel" id="x" placeholder="+49 30 123456">',
      ['telefon', 'handy', 'nummer', 'phone']),
    IT('url', 'Feld für Web-Adressen mit Formatprüfung.',
      'Verlangt ein gültiges absolutes URL-Schema wie `https://`, sonst schlägt die Validierung fehl. Praktisch auf Mobilgeräten dank `.com`-Taste. Ohne Schema (`example.com`) ist die Eingabe ungültig, was Nutzer oft überrascht.',
      [['pattern', 'Zusätzliche Regex, z. B. nur `https://`'], ['placeholder', 'Hinweis'], ['list', 'Datalist für Vorschläge']],
      '<label for="web">Website</label>\n<input type="url" id="web" name="web" placeholder="https://beispiel.de">',
      '<label for="x">Website</label><input type="url" id="x" placeholder="https://beispiel.de">',
      ['link', 'adresse', 'webseite', 'url']),
    IT('search', 'Suchfeld.',
      'Verhält sich wie ein Textfeld, kann aber je nach Browser einen Löschen-Button zeigen. Dient vor allem der Semantik und Zugänglichkeit; in Kombination mit `<form role="search">` oder `<search>` entsteht ein klar erkennbares Suchformular.',
      [['placeholder', 'Hinweis'], ['autocomplete', 'Autofill-Hinweis'], ['list', 'Vorschläge']],
      '<form role="search" action="/suche">\n  <label for="q">Suche</label>\n  <input type="search" id="q" name="q" placeholder="Suchbegriff">\n  <button>Los</button>\n</form>',
      '<label for="x">Suche</label><input type="search" id="x" placeholder="Suchbegriff">',
      ['suche', 'search', 'query']),
    IT('number', 'Zahleneingabe mit Pfeiltasten.',
      'Akzeptiert nur Zahlen, zeigt Stepper-Pfeile und prüft `min`, `max` und `step`. Für Dinge, die keine Rechenwerte sind (Postleitzahl, Telefonnummer, Kreditkarte), ist `type="text"` mit `inputmode="numeric"` richtig. Dezimalzahlen brauchen `step="any"` oder z. B. `step="0.01"`.',
      [['min / max', 'Grenzen'], ['step', 'Schrittweite oder `any`'], ['value', 'Startwert'], ['inputmode', 'Tastatur, z. B. `decimal`']],
      '<label for="menge">Menge</label>\n<input type="number" id="menge" name="menge" min="1" max="10" step="1" value="1">',
      '<label for="x">Menge (1–10)</label><input type="number" id="x" min="1" max="10" value="3">',
      ['zahl', 'numerisch', 'ziffern', 'stepper']),
    IT('range', 'Schieberegler für einen Zahlenbereich.',
      'Zeigt einen Slider zwischen `min` (Standard 0) und `max` (Standard 100). Der genaue Wert ist nicht sichtbar, daher ergänzt man ein `<output>`. Taugt für ungefähre Eingaben wie Lautstärke, nicht für exakte Zahlen.',
      [['min / max', 'Bereich (Standard 0 bis 100)'], ['step', 'Schrittweite'], ['value', 'Startwert'], ['list', 'Datalist für Skalenmarken']],
      '<label for="vol">Lautstärke</label>\n<input type="range" id="vol" name="vol" min="0" max="100" step="5" value="40">',
      '<label for="x">Lautstärke</label><input type="range" id="x" min="0" max="100" value="40">',
      ['slider', 'regler', 'schieberegler']),
    IT('date', 'Datumsauswahl (Jahr, Monat, Tag).',
      'Zeigt je nach Browser einen Kalender. Der Wert hat immer das Format `JJJJ-MM-TT`, unabhängig von der Anzeige des Nutzers. Mit `min` und `max` begrenzt man den Bereich. Zeitzonen kennt der Typ nicht.',
      [['min / max', 'Grenzen im Format `JJJJ-MM-TT`'], ['step', 'Schrittweite in Tagen'], ['value', 'Startwert `JJJJ-MM-TT`']],
      '<label for="geb">Geburtsdatum</label>\n<input type="date" id="geb" name="geb" min="1900-01-01" max="2010-12-31">',
      '<label for="x">Datum</label><input type="date" id="x" value="2025-06-15">',
      ['datum', 'kalender', 'tag']),
    IT('time', 'Uhrzeitauswahl.',
      'Wert im Format `HH:MM` (oder `HH:MM:SS`), lokal und ohne Zeitzone. Mit `step` in Sekunden steuert man die Genauigkeit (`step="1"` blendet Sekunden ein). Die Anzeige (12/24 Stunden) hängt vom System ab.',
      [['min / max', 'Grenzen, z. B. `09:00`'], ['step', 'Schrittweite in Sekunden']],
      '<label for="start">Beginn</label>\n<input type="time" id="start" name="start" min="08:00" max="18:00">',
      '<label for="x">Uhrzeit</label><input type="time" id="x" value="14:30">',
      ['uhrzeit', 'zeit', 'stunde']),
    IT('datetime-local', 'Datum und Uhrzeit ohne Zeitzone.',
      'Kombiniert Datum und Zeit, Wert im Format `JJJJ-MM-TTTHH:MM`. Es gibt keine Zeitzone: Für Termine über Zeitzonen hinweg wandelt man serverseitig oder per JavaScript um. Der frühere Typ `datetime` ist entfernt.',
      [['min / max', 'Grenzen im Format `JJJJ-MM-TTTHH:MM`'], ['step', 'Schrittweite in Sekunden']],
      '<label for="termin">Termin</label>\n<input type="datetime-local" id="termin" name="termin">',
      '<label for="x">Termin</label><input type="datetime-local" id="x" value="2025-06-15T14:30">',
      ['datum und zeit', 'termin', 'timestamp']),
    IT('month', 'Auswahl von Monat und Jahr.',
      'Liefert Werte wie `2025-06`. Nützlich für Abrechnungszeiträume oder Kreditkartenablauf. Browser-Unterstützung ist uneinheitlich: Firefox zeigt ein Textfeld, deshalb bei Bedarf ein Fallback bereitstellen.',
      [['min / max', 'Grenzen im Format `JJJJ-MM`'], ['step', 'Schrittweite in Monaten']],
      '<label for="monat">Abrechnungsmonat</label>\n<input type="month" id="monat" name="monat" value="2025-06">',
      '<label for="x">Monat</label><input type="month" id="x" value="2025-06">',
      ['monat', 'jahr']),
    IT('week', 'Auswahl einer Kalenderwoche.',
      'Liefert Werte wie `2025-W24` (ISO-8601-Woche). Die Unterstützung ist eingeschränkt (z. B. nicht in Firefox und Safari-Desktop), ein Fallback ist daher ratsam.',
      [['min / max', 'Grenzen im Format `JJJJ-Www`'], ['step', 'Schrittweite in Wochen']],
      '<label for="kw">Kalenderwoche</label>\n<input type="week" id="kw" name="kw" value="2025-W24">',
      '<label for="x">Kalenderwoche</label><input type="week" id="x" value="2025-W24">',
      ['woche', 'kalenderwoche', 'kw']),
    IT('color', 'Farbauswahl.',
      'Öffnet den Farbwähler des Systems. Der Wert ist immer eine Hex-Farbe der Form `#rrggbb`, kleingeschrieben. Alphakanal ist nicht vorgesehen (außer mit dem Attribut `alpha` in neuen Browsern). Der Standardwert ist `#000000`.',
      [['value', 'Startfarbe als `#rrggbb`'], ['list', 'Datalist mit Farbvorschlägen']],
      '<label for="farbe">Akzentfarbe</label>\n<input type="color" id="farbe" name="farbe" value="#b4367a">',
      '<label for="x">Farbe</label><input type="color" id="x" value="#b4367a">',
      ['farbe', 'colorpicker', 'hex']),
    IT('checkbox', 'Kontrollkästchen (an/aus).',
      'Eine einzelne Ja/Nein-Auswahl oder mehrere unabhängige Optionen. Nur angehakte Boxen werden gesendet, ihr `value` (Standard `on`). Mehrere Checkboxen mit gleichem `name` ergeben mehrere Werte. Das `<label>` sollte umschließen oder per `for` verknüpft sein.',
      [['checked', 'Vorausgewählt'], ['value', 'Gesendeter Wert (Standard `on`)'], ['required', 'Muss angehakt sein'], ['indeterminate', 'Nur per JavaScript: Zwischenzustand'], ['disabled', 'Deaktiviert']],
      '<label>\n  <input type="checkbox" name="newsletter" value="ja" checked>\n  Newsletter abonnieren\n</label>',
      '<label><input type="checkbox" checked> Angehakt</label><label><input type="checkbox"> Nicht angehakt</label>',
      ['kästchen', 'häkchen', 'ankreuzen', 'toggle']),
    IT('radio', 'Optionsfeld: eine Wahl aus mehreren.',
      'Radios mit demselben `name` bilden eine Gruppe, in der nur eines aktiv sein kann. Gruppen gehören in ein `<fieldset>` mit `<legend>`. Eine einmal gewählte Option lässt sich nicht abwählen, daher eine Vorauswahl mit `checked` bedenken.',
      [['name', 'Gruppenname (gleich für alle Optionen)'], ['value', 'Gesendeter Wert'], ['checked', 'Vorausgewählt'], ['required', 'Eine Auswahl ist Pflicht']],
      '<fieldset>\n  <legend>Größe</legend>\n  <label><input type="radio" name="groesse" value="s"> S</label>\n  <label><input type="radio" name="groesse" value="m" checked> M</label>\n  <label><input type="radio" name="groesse" value="l"> L</label>\n</fieldset>',
      '<fieldset><legend>Größe</legend><label><input type="radio" name="g"> S</label><label><input type="radio" name="g" checked> M</label><label><input type="radio" name="g"> L</label></fieldset>',
      ['optionsfeld', 'auswahl', 'gruppe', 'einzelauswahl']),
    IT('file', 'Datei-Upload.',
      'Öffnet den Dateidialog. Das Formular braucht `method="post"` und `enctype="multipart/form-data"`. Mit `accept` schränkt man Dateitypen ein (nur ein Hinweis, serverseitig prüfen), mit `multiple` sind mehrere Dateien möglich. Der Wert ist aus Sicherheitsgründen nicht setzbar.',
      [['accept', 'Erlaubte Typen, z. B. `image/*` oder `.pdf`'], ['multiple', 'Mehrere Dateien'], ['capture', '`user` oder `environment`: Kamera auf Mobilgeräten'], ['required', 'Datei ist Pflicht']],
      '<form method="post" enctype="multipart/form-data">\n  <label for="foto">Foto</label>\n  <input type="file" id="foto" name="foto" accept="image/*" multiple>\n</form>',
      '<label for="x">Datei wählen</label><input type="file" id="x" multiple>',
      ['upload', 'datei', 'hochladen', 'anhang']),
    IT('hidden', 'Unsichtbares Feld, das Daten mitsendet.',
      'Wird nicht dargestellt, aber mit dem Formular übertragen. Typisch für IDs oder CSRF-Token. Nutzer können den Wert mit den Entwicklertools ändern, daher dürfen darin keine sicherheitsrelevanten Daten stehen, die der Server nicht prüft.',
      [['name', 'Schlüssel'], ['value', 'Zu sendender Wert']],
      '<input type="hidden" name="produkt_id" value="4711">\n<input type="hidden" name="csrf" value="abc123">',
      '<p style="font:14px sans-serif">Unsichtbar: <input type="hidden" name="id" value="4711"> (hier ist nichts zu sehen)</p>',
      ['versteckt', 'token', 'csrf', 'id']),
    IT('submit', 'Button zum Absenden des Formulars.',
      'Zeigt `value` als Beschriftung (Standard: „Absenden“) und sendet das Formular. Unterscheidet sich vom `<button type="submit">` darin, dass er keinen HTML-Inhalt zulässt. `formaction` & Co. überschreiben Formulareinstellungen pro Button.',
      [['value', 'Beschriftung'], ['formaction', 'Alternatives Ziel'], ['formmethod', 'Alternative Methode'], ['formnovalidate', 'Ohne Validierung senden']],
      '<input type="submit" value="Anmelden">',
      '<input type="submit" value="Anmelden" onclick="return false">',
      ['absenden', 'senden', 'abschicken']),
    IT('reset', 'Button, der das Formular zurücksetzt.',
      'Stellt alle Felder auf ihre Startwerte zurück. Wird kaum benötigt und kann zu versehentlichem Datenverlust führen, setze ihn daher mit Bedacht und nie direkt neben „Absenden“.',
      [['value', 'Beschriftung (Standard „Zurücksetzen“)']],
      '<input type="reset" value="Zurücksetzen">',
      '<input type="text" value="Geänderter Text"> <input type="reset" value="Zurücksetzen">',
      ['zurücksetzen', 'leeren', 'reset']),
    IT('button', 'Allgemeiner Button ohne Standardverhalten.',
      'Tut allein nichts, die Aktion kommt per JavaScript. Meist ist das Element `<button type="button">` besser, da es HTML-Inhalt erlaubt. `value` ist die Beschriftung.',
      [['value', 'Beschriftung']],
      '<input type="button" value="Klick mich" id="knopf">',
      '<input type="button" value="Klick mich">',
      ['knopf', 'schaltfläche']),
    IT('image', 'Grafischer Absende-Button.',
      'Ein Bild fungiert als Submit-Button und sendet zusätzlich die Klickkoordinaten (`name.x`, `name.y`). Es braucht `src` und `alt`. Heute ersetzt man ihn meist durch `<button>` mit einem `<img>` darin.',
      [['src', 'Bild-URL'], ['alt', 'Textalternative (Pflicht)'], ['width / height', 'Größe'], ['formaction', 'Alternatives Ziel']],
      '<input type="image" src="senden.png" alt="Absenden" width="120" height="40">',
      '<input type="image" src="' + IMG + '" alt="Absenden" width="80" height="50" onclick="return false">',
      ['bildbutton', 'bild', 'koordinaten']),

    // ===== Interaktive Elemente =====
    {
      lang: 'html', group: 'Interaktive Elemente', name: '<details>',
      desc: 'Auf- und zuklappbarer Bereich ohne JavaScript.',
      details: 'Zeigt nur das `<summary>` und klappt bei Klick den restlichen Inhalt auf. Das Attribut `open` hält ihn offen. Mit gleichem `name` an mehreren `<details>` entsteht ein Akkordeon, bei dem sich immer nur eines öffnet. Das `toggle`-Event meldet Zustandsänderungen.',
      syntax: '<details>\n  <summary>Titel</summary>\n  Inhalt\n</details>',
      values: [
        ['open', 'Startet geöffnet'],
        ['name', 'Gruppenname: nur ein `<details>` der Gruppe ist offen (Akkordeon)']
      ],
      example: '<details name="faq">\n  <summary>Wie lange ist die Lieferzeit?</summary>\n  <p>In der Regel 2–3 Werktage.</p>\n</details>\n<details name="faq">\n  <summary>Kann ich zurückgeben?</summary>\n  <p>Ja, innerhalb von 14 Tagen.</p>\n</details>',
      demo: '<style>body{font:14px sans-serif}details{border:1px solid #ccc;padding:6px 10px;margin:4px 0}summary{cursor:pointer;font-weight:bold}</style><details name="faq" open><summary>Wie lange ist die Lieferzeit?</summary><p>In der Regel 2–3 Werktage.</p></details><details name="faq"><summary>Kann ich zurückgeben?</summary><p>Ja, innerhalb von 14 Tagen.</p></details>',
      keywords: ['akkordeon', 'aufklappen', 'faq', 'disclosure', 'collapse'],
      related: ['<summary>', '<dialog>'], display: 'block', mdn: MDN + 'details'
    },
    {
      lang: 'html', group: 'Interaktive Elemente', name: '<summary>',
      desc: 'Sichtbare Überschrift eines details-Elements.',
      details: 'Muss das erste Kind von `<details>` sein und dient als Klickfläche zum Auf- und Zuklappen. Es ist per Tastatur bedienbar. Das Dreieck-Symbol lässt sich mit `summary::marker` oder `list-style: none` anpassen.',
      syntax: '<summary>Titel</summary>',
      example: '<details>\n  <summary>Mehr anzeigen</summary>\n  Versteckter Text.\n</details>',
      demo: '<style>body{font:14px sans-serif}summary{cursor:pointer;color:#b4367a}</style><details><summary>Mehr anzeigen</summary>Versteckter Text.</details>',
      keywords: ['überschrift', 'toggle', 'marker'],
      related: ['<details>'], display: 'list-item', mdn: MDN + 'summary'
    },
    {
      lang: 'html', group: 'Interaktive Elemente', name: '<dialog>',
      desc: 'Dialogfenster bzw. Modal.',
      details: 'Ist standardmäßig unsichtbar. Per JavaScript öffnet `showModal()` es als Modal mit abgedunkeltem Hintergrund (`::backdrop`), Fokusfalle und Schließen per Esc; `show()` öffnet es nicht-modal. Das Attribut `open` zeigt es direkt, aber ohne die Modal-Eigenschaften. Ein Formular mit `method="dialog"` schließt es und liefert den Button-Wert als `returnValue`. Mit `closedby` (neu) lässt sich das Schließen per Klick daneben erlauben.',
      syntax: '<dialog>…</dialog>',
      values: [
        ['open', 'Zeigt den Dialog (nicht-modal)'],
        ['closedby', '`any`, `closerequest` oder `none`: wie der Dialog geschlossen werden darf']
      ],
      example: '<button id="auf">Öffnen</button>\n<dialog id="dlg">\n  <form method="dialog">\n    <p>Wirklich löschen?</p>\n    <button value="nein">Abbrechen</button>\n    <button value="ja">Löschen</button>\n  </form>\n</dialog>\n<script>\n  document.getElementById(\'auf\').onclick = () =>\n    document.getElementById(\'dlg\').showModal();\n</script>',
      demo: '<style>body{font:14px sans-serif}dialog{border:2px solid #b4367a;border-radius:8px;position:static}</style><dialog open><form method="dialog"><p>Wirklich löschen?</p><button>Abbrechen</button> <button>Löschen</button></form></dialog>',
      tip: 'Nutze `showModal()` statt `open`, nur so greifen Fokusfalle, Esc und `::backdrop`.',
      keywords: ['modal', 'popup', 'overlay', 'dialogfenster', 'lightbox'],
      related: ['<details>', '<form>', '<button>'], display: 'block', mdn: MDN + 'dialog'
    },

    // ===== Veraltete Elemente =====
    {
      lang: 'html', group: 'Veraltete Elemente', name: '<center>',
      desc: 'Veraltet: zentrierte Darstellung von Inhalten.',
      details: 'Zentrierte den Inhalt, ist aber seit HTML 4 missbilligt und nicht mehr Teil des Standards. Nutze stattdessen CSS: `text-align: center` für Text, `margin-inline: auto` für Blöcke mit Breite oder Flexbox/Grid mit `justify-content: center`.',
      example: '<!-- statt <center> -->\n<div class="zentriert">Text</div>\n\n<style>\n  .zentriert { text-align: center; }\n</style>',
      deprecated: true, keywords: ['zentrieren', 'mittig', 'veraltet', 'obsolete'],
      related: ['<div>'], display: 'block', mdn: MDN + 'center'
    },
    {
      lang: 'html', group: 'Veraltete Elemente', name: '<font>',
      desc: 'Veraltet: Schriftart, -größe und -farbe.',
      details: 'Mit `face`, `size` und `color` formatierte es Text direkt im HTML, was Inhalt und Darstellung vermischt. Ersetze es durch CSS (`font-family`, `font-size`, `color`), ggf. an einem `<span>` oder per Klasse.',
      example: '<!-- statt <font color="red" size="5"> -->\n<span class="warnung">Achtung</span>\n\n<style>\n  .warnung { color: red; font-size: 1.5rem; }\n</style>',
      deprecated: true, keywords: ['schrift', 'schriftart', 'farbe', 'size', 'veraltet'],
      related: ['<span>'], display: 'inline', mdn: MDN + 'font'
    },
    {
      lang: 'html', group: 'Veraltete Elemente', name: '<marquee>',
      desc: 'Veraltet: laufender Text (Scroll-Effekt).',
      details: 'Ließ Inhalte über die Seite scrollen. Es ist nie standardisiert worden, schlecht für Barrierefreiheit und bei Nutzern mit Bewegungsempfindlichkeit problematisch. Nutze CSS-Animationen (`@keyframes` mit `transform`) und respektiere `prefers-reduced-motion`.',
      example: '<!-- statt <marquee> -->\n<p class="lauftext">Aktuelle Meldung</p>\n\n<style>\n  .lauftext { animation: lauf 10s linear infinite; }\n  @keyframes lauf { from { transform: translateX(100%); } to { transform: translateX(-100%); } }\n  @media (prefers-reduced-motion: reduce) { .lauftext { animation: none; } }\n</style>',
      deprecated: true, keywords: ['lauftext', 'scrollen', 'ticker', 'animation', 'veraltet'],
      related: ['<div>'], display: 'inline-block', mdn: MDN + 'marquee'
    },
    {
      lang: 'html', group: 'Veraltete Elemente', name: '<big>',
      desc: 'Veraltet: vergrößerter Text.',
      details: 'Machte Text eine Stufe größer. Die Größe ist eine Gestaltungsfrage und gehört ins CSS, z. B. `font-size: larger` oder `1.25em`. Soll der Text wichtig sein, nimm `<strong>`, für Hervorhebung `<em>`.',
      example: '<!-- statt <big> -->\n<span class="gross">Großer Text</span>\n\n<style>\n  .gross { font-size: larger; }\n</style>',
      deprecated: true, keywords: ['groß', 'vergrößern', 'schriftgröße', 'veraltet'],
      related: ['<strong>', '<em>', '<span>'], display: 'inline', mdn: MDN + 'big'
    },
    {
      lang: 'html', group: 'Veraltete Elemente', name: '<tt>',
      desc: 'Veraltet: Schreibmaschinen-Schrift (Monospace).',
      details: 'Stellte Text in einer Festbreitenschrift dar. Verwende je nach Bedeutung `<code>` für Quelltext, `<kbd>` für Tastatureingaben, `<samp>` für Programmausgaben oder `<var>` für Variablen; für rein optische Zwecke CSS `font-family: monospace`.',
      example: '<!-- statt <tt> -->\n<p>Starte mit <code>npm install</code>.</p>',
      deprecated: true, keywords: ['monospace', 'schreibmaschine', 'code', 'veraltet'],
      related: ['<code>', '<kbd>', '<samp>', '<var>'], display: 'inline', mdn: MDN + 'tt'
    },
    {
      lang: 'html', group: 'Veraltete Elemente', name: '<strike>',
      desc: 'Veraltet: durchgestrichener Text.',
      details: 'Strich den Text durch. Semantisch richtig sind `<s>` für nicht mehr zutreffende Inhalte (z. B. alter Preis) und `<del>` für gelöschte Textteile, oft mit `<ins>` für Ergänzungen. Rein optisch geht `text-decoration: line-through`.',
      example: '<!-- statt <strike> -->\n<p>Preis: <s>49 €</s> <strong>39 €</strong></p>\n<p>Treffpunkt: <del>Bahnhof</del> <ins>Rathaus</ins></p>',
      deprecated: true, keywords: ['durchgestrichen', 'streichen', 'veraltet'],
      related: ['<s>', '<del>', '<ins>'], display: 'inline', mdn: MDN + 'strike'
    },
    {
      lang: 'html', group: 'Veraltete Elemente', name: '<frameset>',
      desc: 'Veraltet: teilte das Fenster in mehrere Frames.',
      details: 'Ersetzte den `<body>` und gliederte die Seite in Bereiche mit eigenen Dokumenten (`<frame>`). Es ist in HTML5 entfernt und problematisch für Adressierung, Suchmaschinen und Barrierefreiheit. Für Layout nimm CSS Grid oder Flexbox, für eingebettete Fremdinhalte `<iframe>`.',
      example: '<!-- statt <frameset> -->\n<body class="layout">\n  <nav>…</nav>\n  <main>…</main>\n</body>\n\n<style>\n  .layout { display: grid; grid-template-columns: 200px 1fr; }\n</style>',
      deprecated: true, keywords: ['frames', 'rahmen', 'layout', 'veraltet'],
      related: ['<frame>', '<iframe>'], display: 'block', mdn: MDN + 'frameset'
    },
    {
      lang: 'html', group: 'Veraltete Elemente', name: '<frame>',
      desc: 'Veraltet: einzelner Frame innerhalb eines frameset.',
      details: 'Lud ein separates Dokument in einen Bereich eines `<frameset>`. Wie das gesamte Frame-System ist es entfernt. Nutze `<iframe>` für eingebettete Seiten oder, besser, CSS-Layouts mit serverseitig oder per Komponenten zusammengesetzten Seiten.',
      example: '<!-- statt <frame src="menue.html"> -->\n<iframe src="menue.html" title="Menü"></iframe>',
      deprecated: true, keywords: ['frame', 'rahmen', 'veraltet'],
      related: ['<frameset>', '<iframe>'], mdn: MDN + 'frame'
    },
    {
      lang: 'html', group: 'Veraltete Elemente', name: '<acronym>',
      desc: 'Veraltet: Akronym mit Erklärung.',
      details: 'Kennzeichnete Akronyme wie „NATO“ mit `title` als Erklärung. In HTML5 ersetzt durch `<abbr>`, das Abkürzungen und Akronyme gleichermaßen abdeckt. Das `title`-Attribut zeigt die Langform als Tooltip.',
      example: '<!-- statt <acronym> -->\n<p>Die <abbr title="North Atlantic Treaty Organization">NATO</abbr> wurde 1949 gegründet.</p>',
      deprecated: true, keywords: ['abkürzung', 'akronym', 'abbr', 'veraltet'],
      related: ['<abbr>'], display: 'inline', mdn: MDN + 'acronym'
    }
  );

  function IT(type, desc, details, values, example, demo, keywords) {
    return {
      lang: 'html', group: 'Input-Typen', name: '<input type="' + type + '">',
      desc: desc, details: details,
      syntax: '<input type="' + type + '">',
      values: values, example: example, exampleLang: 'html',
      demo: FSTYLE + demo, keywords: keywords,
      related: ['<input>', '<label>'], display: 'inline-block',
      mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/input/' + type
    };
  }
})();
