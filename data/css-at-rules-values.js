window.CHEAT = window.CHEAT || [];

window.CHEAT.push({
  lang: 'css', group: 'At-Regeln', name: '@media',
  desc: 'Wendet Regeln nur an, wenn eine Medienabfrage zutrifft.',
  details: 'Mit `@media` passt du das Layout an Viewport-Größe, Farbschema, Eingabegerät oder Ausgabemedium an. Bedingungen lassen sich mit `and`, `not`, Kommas (oder) und der Range-Syntax kombinieren. Fallstrick: Ohne `<meta name="viewport" content="width=device-width, initial-scale=1">` greifen Breakpoints auf Mobilgeräten nicht wie erwartet.',
  syntax: '@media <medientyp>? and (<feature>: <wert>) {\n  /* Regeln */\n}',
  values: [
    ['screen / print / all', 'Medientyp (Bildschirm, Druck, alle)'],
    ['and', 'Alle Bedingungen müssen zutreffen'],
    [',', 'Kommagetrennte Liste wirkt wie ein ODER'],
    ['not', 'Kehrt die gesamte Abfrage um'],
    ['only', 'Versteckt die Abfrage vor sehr alten Browsern']
  ],
  example: '.sidebar { display: none; }\n\n@media (min-width: 768px) {\n  .sidebar { display: block; }\n}\n\n@media (prefers-color-scheme: dark) {\n  body { background: #111; color: #eee; }\n}',
  demo: '<style>.m{padding:12px;border-radius:8px;background:#eef;color:#223}@media (prefers-color-scheme: dark){.m{background:#223;color:#fff}}@media (orientation: landscape){.m::after{content:" (Querformat)"}}@media (orientation: portrait){.m::after{content:" (Hochformat)"}}</style><div class="m">Dieses Feld reagiert auf Farbschema und Ausrichtung</div>',
  tip: 'Schreibe Basis-Styles für Mobilgeräte und erweitere mit `min-width` (Mobile First).',
  keywords: ['media query', 'breakpoint', 'responsive', 'medienabfrage', 'haltepunkt'],
  related: ['@container', '@supports', 'Range-Syntax (width >= 600px)', 'width / min-width / max-width'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media'
}, {
  lang: 'css', group: 'At-Regeln', name: '@container',
  desc: 'Container Query: Styles abhängig von der Größe eines Eltern-Containers.',
  details: 'Statt am Viewport richtet sich `@container` an der Größe (oder dem Stil) des nächsten Vorfahren aus, der mit `container-type` als Container deklariert wurde. So werden Komponenten wiederverwendbar, egal wo sie platziert sind. Fallstrick: Das Element mit `container-type` selbst kann nicht abgefragt werden, nur seine Nachfahren, und `inline-size` schränkt dessen Größenermittlung ein.',
  syntax: '.wrapper { container-type: inline-size; container-name: card; }\n@container card (min-width: 400px) {\n  /* Regeln */\n}',
  values: [
    ['container-type: inline-size', 'Macht das Element zum Container für die Breite'],
    ['container-type: size', 'Container für Breite und Höhe'],
    ['container-name', 'Optionaler Name zum gezielten Ansprechen'],
    ['container', 'Kurzform: name / typ'],
    ['style(--x: 1)', 'Abfrage auf Custom Properties des Containers']
  ],
  example: '.card-wrap {\n  container-type: inline-size;\n  container-name: card;\n}\n\n.card { display: grid; gap: 8px; }\n\n@container card (min-width: 400px) {\n  .card { grid-template-columns: 120px 1fr; }\n}',
  demo: '<style>.w{container-type:inline-size;resize:horizontal;overflow:auto;border:2px dashed #b4367a;padding:8px;width:90%}.c{display:grid;gap:6px;background:#eef;padding:8px;color:#223}.c b{background:#b4367a;color:#fff;padding:6px}@container (min-width: 360px){.c{grid-template-columns:1fr 1fr}}</style><div class="w"><div class="c"><b>A</b><b>B</b></div></div><p style="font-size:12px">Rahmen unten rechts ziehen (resize) - ab 360px zweispaltig.</p>',
  tip: 'Für Größeneinheiten innerhalb des Containers nutze `cqw`, `cqi` usw.',
  keywords: ['container query', 'container-type', 'komponente', 'responsive'],
  related: ['@media', 'cqw / cqh / cqi / cqb'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@container'
}, {
  lang: 'css', group: 'At-Regeln', name: '@supports',
  desc: 'Wendet Regeln nur an, wenn der Browser ein Feature unterstützt.',
  details: 'Feature Query: Du prüfst, ob eine Eigenschaft-Wert-Kombination (oder ein Selektor) verstanden wird, und lieferst nur dann moderne Styles aus. Bedingungen lassen sich mit `and`, `or` und `not` verknüpfen. Fallstrick: Schreibe zuerst das einfache Fallback und überschreibe es im `@supports`-Block, nicht umgekehrt.',
  syntax: '@supports (<eigenschaft>: <wert>) {\n  /* Regeln */\n}\n@supports selector(<selektor>) { ... }',
  values: [
    ['(prop: wert)', 'Eigenschaft samt Wert wird unterstützt'],
    ['not (...)', 'Nicht unterstützt'],
    ['(...) and (...)', 'Beides unterstützt'],
    ['(...) or (...)', 'Mindestens eines unterstützt'],
    ['selector(:has(a))', 'Selektor wird unterstützt']
  ],
  example: '.gallery { display: flex; flex-wrap: wrap; }\n\n@supports (display: grid) {\n  .gallery {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n\n@supports not (backdrop-filter: blur(4px)) {\n  .glass { background: #fffe; }\n}',
  demo: '<style>.s{padding:10px;border-radius:8px;background:#fdd;color:#400}.s::after{content:"grid wird NICHT unterstützt"}@supports (display:grid){.s{background:#dfd;color:#040}.s::after{content:"grid wird unterstützt"}}</style><div class="s"></div>',
  keywords: ['feature query', 'unterstützung', 'fallback', 'progressive enhancement'],
  related: ['@media'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@supports'
}, {
  lang: 'css', group: 'At-Regeln', name: '@import',
  desc: 'Bindet ein weiteres Stylesheet ein.',
  details: '`@import` lädt eine andere CSS-Datei und kann sie optional einer `@layer`, einer Medienabfrage oder einer Feature-Bedingung unterordnen. Die Regel muss ganz am Anfang des Stylesheets stehen (nur `@charset` und `@layer`-Deklarationen dürfen davor). Fallstrick: Importe laden nacheinander und verlangsamen das Rendern; nutze lieber mehrere `<link>`-Elemente oder einen Bundler.',
  syntax: '@import url("datei.css") layer(name) supports(...) medienabfrage;',
  values: [
    ['url("...") / "..."', 'Pfad zum Stylesheet'],
    ['layer(name)', 'Legt den Inhalt in eine Cascade Layer'],
    ['supports(...)', 'Import nur bei Feature-Unterstützung'],
    ['print / (min-width: ...)', 'Import nur bei zutreffender Medienabfrage']
  ],
  example: '@layer reset, base;\n\n@import url("reset.css") layer(reset);\n@import "base.css" layer(base);\n@import "print.css" print;',
  tip: 'In Build-Tools (Sass, PostCSS) wird `@import` oft zur Build-Zeit aufgelöst - dann entfällt das Performance-Problem.',
  keywords: ['einbinden', 'stylesheet', 'importieren', 'include'],
  related: ['@layer', '@charset'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@import'
}, {
  lang: 'css', group: 'At-Regeln', name: '@font-face',
  desc: 'Definiert eine eigene Schriftart zum Laden per Web-Font.',
  details: 'Mit `@font-face` registrierst du eine Schriftdatei unter einem Familiennamen, den du danach in `font-family` verwendest. Für jede Strichstärke und jeden Stil legst du einen eigenen Block an (oder nutzt eine Variable Font mit Bereich). Bevorzuge `woff2`, setze `font-display: swap` gegen unsichtbaren Text und lade nur benötigte Schriftschnitte.',
  syntax: '@font-face {\n  font-family: "Name";\n  src: url("datei.woff2") format("woff2");\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}',
  values: [
    ['font-family', 'Name, unter dem die Schrift später verwendet wird'],
    ['src', 'Quelle(n): url(...) format(...) oder local(...)'],
    ['font-weight', 'Gewicht dieses Schnitts, bei Variable Fonts auch Bereich (100 900)'],
    ['font-style', 'normal, italic oder oblique'],
    ['font-display', 'auto, block, swap, fallback, optional - Verhalten beim Laden'],
    ['unicode-range', 'Zeichenbereich, für den die Datei geladen wird (z. B. U+0000-00FF)']
  ],
  example: '@font-face {\n  font-family: "Inter";\n  src: url("/fonts/inter-var.woff2") format("woff2");\n  font-weight: 100 900;\n  font-style: normal;\n  font-display: swap;\n  unicode-range: U+0000-00FF, U+0131;\n}\n\nbody { font-family: "Inter", system-ui, sans-serif; }',
  tip: 'Mit `font-display: optional` vermeidest du Layout-Sprünge fast vollständig.',
  keywords: ['webfont', 'schrift', 'schriftart', 'woff2', 'typografie'],
  related: ['@import'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@font-face'
}, {
  lang: 'css', group: 'At-Regeln', name: '@keyframes',
  desc: 'Definiert die Schlüsselbilder einer CSS-Animation.',
  details: 'Du benennst die Animation und legst mit Prozentwerten (oder `from`/`to`) fest, welche Eigenschaften zu welchem Zeitpunkt gelten. Verwendet wird sie per `animation-name` bzw. der Kurzform `animation`. Animiere bevorzugt `transform` und `opacity`, da diese ohne Layout-Neuberechnung auskommen.',
  syntax: '@keyframes name {\n  from { ... }\n  50%  { ... }\n  to   { ... }\n}',
  values: [
    ['from / 0%', 'Startzustand'],
    ['to / 100%', 'Endzustand'],
    ['25%, 75% ...', 'Beliebige Zwischenschritte'],
    ['animation-timing-function', 'Kann auch innerhalb eines Keyframes gesetzt werden']
  ],
  example: '@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50%      { transform: scale(1.2); }\n}\n\n.badge {\n  animation: pulse 1.5s ease-in-out infinite;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .badge { animation: none; }\n}',
  demo: '<style>@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}.b{width:50px;height:50px;margin:20px;border-radius:50%;background:#b4367a;animation:pulse 1.5s ease-in-out infinite}</style><div class="b"></div>',
  tip: 'Respektiere Nutzer mit Bewegungsempfindlichkeit über `prefers-reduced-motion`.',
  keywords: ['animation', 'schlüsselbild', 'keyframe', 'bewegung'],
  related: ['prefers-reduced-motion', 'cubic-bezier()', 'steps()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@keyframes'
}, {
  lang: 'css', group: 'At-Regeln', name: '@layer',
  desc: 'Cascade Layers: steuert die Priorität von Styles unabhängig von der Spezifität.',
  details: 'Mit `@layer` gruppierst du Regeln in Ebenen. Später deklarierte Ebenen gewinnen gegen frühere, unabhängig von der Selektor-Spezifität; Styles ohne Layer schlagen alle Layer. So lassen sich Resets, Frameworks und eigene Styles sauber ordnen. Fallstrick: Die Reihenfolge wird beim ersten Auftreten festgelegt, deklariere sie daher vorab in einer Zeile.',
  syntax: '@layer reset, base, components;\n@layer name { /* Regeln */ }',
  values: [
    ['@layer a, b, c;', 'Legt die Reihenfolge fest (c gewinnt)'],
    ['@layer name { ... }', 'Regeln in eine Ebene schreiben'],
    ['@layer { ... }', 'Anonyme Ebene'],
    ['layer(name) bei @import', 'Importierte Datei in eine Ebene legen']
  ],
  example: '@layer reset, base, components, utilities;\n\n@layer reset {\n  * { margin: 0; box-sizing: border-box; }\n}\n\n@layer components {\n  .btn { padding: 8px 16px; background: #b4367a; }\n}\n\n@layer utilities {\n  .p-0 { padding: 0; }\n}',
  demo: '<style>@layer a,b;@layer b{.t{color:#c00}}@layer a{#x.t{color:#00c}}</style><p id="x" class="t">Rot: Layer b gewinnt trotz niedrigerer Spezifität</p>',
  tip: '`!important` kehrt die Layer-Reihenfolge um: frühe Layer gewinnen dann.',
  keywords: ['cascade layers', 'ebene', 'spezifität', 'kaskade'],
  related: ['@import', '@scope'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@layer'
}, {
  lang: 'css', group: 'At-Regeln', name: '@property',
  desc: 'Registriert eine Custom Property mit Typ, Startwert und Vererbung.',
  details: 'Normale `--variablen` sind untypisierte Strings. Mit `@property` bekommen sie eine Syntax (z. B. `<color>`, `<length>`, `<angle>`), einen `initial-value` und eine Vererbungsregel. Dadurch lassen sich Custom Properties animieren und sauber interpolieren, etwa Farbverläufe. Fallstrick: `syntax` und `inherits` sind Pflicht; ohne `initial-value` ist die Syntax nur bei `*` erlaubt.',
  syntax: '@property --name {\n  syntax: "<color>";\n  inherits: false;\n  initial-value: #000;\n}',
  values: [
    ['syntax', 'Datentyp, z. B. "<color>", "<length>", "<number>", "<angle>", "*"'],
    ['inherits', 'true oder false: wird der Wert vererbt?'],
    ['initial-value', 'Startwert (muss zur Syntax passen)']
  ],
  example: '@property --angle {\n  syntax: "<angle>";\n  inherits: false;\n  initial-value: 0deg;\n}\n\n.spinner {\n  background: conic-gradient(from var(--angle), #b4367a, #fff);\n  animation: rotate 3s linear infinite;\n}\n\n@keyframes rotate { to { --angle: 360deg; } }',
  demo: '<style>@property --a{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes r{to{--a:360deg}}.sp{width:90px;height:90px;border-radius:50%;background:conic-gradient(from var(--a),#b4367a,#fff);animation:r 3s linear infinite}</style><div class="sp"></div>',
  keywords: ['houdini', 'custom property', 'animierbar', 'typisiert', 'registrieren'],
  related: ['Custom Properties (--name)', '@keyframes', 'conic-gradient()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@property'
}, {
  lang: 'css', group: 'At-Regeln', name: '@scope',
  desc: 'Begrenzt Selektoren auf einen Teilbaum des DOM (Scoping-Root bis Limit).',
  details: 'Mit `@scope (.wurzel) to (.grenze)` gelten die Regeln nur innerhalb von `.wurzel`, aber nicht in Bereichen ab `.grenze` (Donut-Scope). Im Block bezieht sich `:scope` auf die Wurzel. Scoped Styles haben bei gleicher Spezifität Vorrang, wenn die Wurzel näher am Element liegt (Proximity).',
  syntax: '@scope (<wurzel>) to (<grenze>) {\n  /* Regeln */\n}',
  values: [
    ['(.root)', 'Scoping-Root: Beginn des Bereichs'],
    ['to (.limit)', 'Optionale untere Grenze (Donut-Scope)'],
    [':scope', 'Die Scoping-Root im Block']
  ],
  example: '@scope (.card) to (.card-footer) {\n  :scope { border: 1px solid #ccc; }\n  a { color: #b4367a; }\n  img { border-radius: 4px; }\n}',
  tip: 'Ohne Argument im `<style>`-Element gilt `@scope` für das umgebende Elternelement.',
  keywords: ['scoping', 'geltungsbereich', 'donut', 'proximity'],
  related: ['@layer', '@container'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@scope'
}, {
  lang: 'css', group: 'At-Regeln', name: '@starting-style',
  desc: 'Legt Startwerte für Übergänge beim ersten Rendern eines Elements fest.',
  details: 'Transitions starten normalerweise nur bei Änderung eines vorherigen Stils. Mit `@starting-style` definierst du den Ausgangszustand für neu eingefügte Elemente oder solche, die von `display: none` sichtbar werden. So lassen sich Einblend-Effekte ohne JavaScript bauen. Für das Ausblenden kombiniere es mit `transition-behavior: allow-discrete`.',
  syntax: '.el {\n  transition: opacity .3s;\n  @starting-style { opacity: 0; }\n}',
  values: [
    ['@starting-style { ... }', 'Stile für den allerersten Frame'],
    ['transition-behavior: allow-discrete', 'Erlaubt Übergänge für display und overlay']
  ],
  example: '.dialog {\n  opacity: 1;\n  transition: opacity .3s, display .3s allow-discrete;\n}\n\n@starting-style {\n  .dialog { opacity: 0; }\n}\n\n.dialog.hidden { display: none; opacity: 0; }',
  keywords: ['einblenden', 'fade in', 'transition', 'popover', 'dialog'],
  related: ['@keyframes'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@starting-style'
}, {
  lang: 'css', group: 'At-Regeln', name: '@page',
  desc: 'Steuert Seitenformat und Ränder beim Drucken.',
  details: 'Mit `@page` legst du Papiergröße, Ausrichtung und Seitenränder für den Druck fest. Mit Pseudoklassen wie `:first`, `:left` und `:right` lassen sich einzelne Seiten gezielt gestalten. Nur wenige Eigenschaften (`size`, `margin`, `marks`) werden unterstützt; die Browser-Unterstützung für Randboxen ist begrenzt.',
  syntax: '@page {\n  size: A4;\n  margin: 2cm;\n}\n@page :first { margin-top: 4cm; }',
  values: [
    ['size: A4 / letter', 'Papierformat'],
    ['size: landscape / portrait', 'Ausrichtung'],
    ['margin', 'Seitenrand'],
    [':first / :left / :right', 'Bestimmte Seiten ansprechen']
  ],
  example: '@page {\n  size: A4 portrait;\n  margin: 2cm;\n}\n\n@page :first {\n  margin-top: 5cm;\n}\n\n@media print {\n  nav, footer { display: none; }\n}',
  keywords: ['druck', 'seitenrand', 'papier', 'print', 'pdf'],
  related: ['print (Medientyp)', '@media'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@page'
}, {
  lang: 'css', group: 'At-Regeln', name: '@charset',
  desc: 'Legt die Zeichenkodierung einer externen CSS-Datei fest.',
  details: '`@charset "UTF-8";` muss das allererste Element einer CSS-Datei sein, ohne Leerzeichen oder Kommentar davor. Es gilt nur für externe Stylesheets, nicht für `<style>`-Blöcke. Meist ist es unnötig, da Server per HTTP-Header `UTF-8` melden; nur UTF-8 ist erlaubt.',
  syntax: '@charset "UTF-8";',
  example: '@charset "UTF-8";\n\n.quote::before { content: "\\201E"; }\n.quote::after  { content: "\\201C"; }',
  tip: 'Speichere CSS-Dateien einfach als UTF-8; `@charset` ist selten wirklich nötig.',
  keywords: ['zeichensatz', 'encoding', 'utf-8', 'kodierung'],
  related: ['@import'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@charset'
}, {
  lang: 'css', group: 'At-Regeln', name: '@namespace',
  desc: 'Definiert einen XML-Namespace für Selektoren (SVG, XML).',
  details: '`@namespace` ist nur relevant, wenn du XML-Dokumente oder SVG mit gemischten Namespaces stylst. Mit Präfix kannst du Selektoren wie `svg|a` gezielt auf einen Namespace beschränken, ohne Präfix wird er zum Standard. Die Regel muss nach `@charset` und `@import`, aber vor allen anderen Regeln stehen.',
  syntax: '@namespace url(http://www.w3.org/2000/svg);\n@namespace svg url(http://www.w3.org/2000/svg);',
  example: '@namespace svg url(http://www.w3.org/2000/svg);\n\nsvg|a { fill: #b4367a; }\n*|title { display: none; }',
  keywords: ['xml', 'svg', 'namespace', 'namensraum'],
  related: ['@import'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@namespace'
}, {
  lang: 'css', group: 'At-Regeln', name: '@counter-style',
  desc: 'Definiert eigene Zählstile für Listen und Zähler.',
  details: 'Du legst Zeichensystem (`system`), Symbole (`symbols`), Präfix und Suffix fest und nutzt den Namen dann in `list-style-type` oder `counter()`. So entstehen eigene Aufzählungszeichen ohne Bilder oder Pseudo-Elemente-Tricks. Fallstrick: `system: cyclic` benötigt nur ein Symbol, `numeric`/`alphabetic` mindestens zwei.',
  syntax: '@counter-style name {\n  system: cyclic;\n  symbols: "★";\n  suffix: " ";\n}',
  values: [
    ['system', 'cyclic, numeric, alphabetic, symbolic, fixed, additive, extends'],
    ['symbols', 'Zeichen für die Zähler'],
    ['prefix / suffix', 'Text vor und nach dem Marker'],
    ['range', 'Wertebereich, für den der Stil gilt']
  ],
  example: '@counter-style stern {\n  system: cyclic;\n  symbols: "\\2605";\n  suffix: "  ";\n}\n\nul.bewertung { list-style: stern; }',
  demo: '<style>@counter-style stern{system:cyclic;symbols:"\\2605";suffix:"  "}ul{list-style:stern;padding-left:24px}</style><ul><li>Erster Punkt</li><li>Zweiter Punkt</li></ul>',
  keywords: ['liste', 'aufzählung', 'zähler', 'list-style'],
  related: ['counter()', 'counters()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@counter-style'
}, {
  lang: 'css', group: 'At-Regeln', name: '@view-transition',
  desc: 'Aktiviert View Transitions zwischen Seitennavigationen (MPA).',
  details: 'Mit `@view-transition { navigation: auto; }` animiert der Browser den Übergang zwischen zwei Seiten derselben Herkunft automatisch mit einer Überblendung. Beide Seiten müssen die Regel enthalten. Einzelne Elemente lassen sich über `view-transition-name` gezielt weiter animieren und über `::view-transition-*`-Pseudoelemente gestalten.',
  syntax: '@view-transition {\n  navigation: auto;\n}',
  values: [
    ['navigation: auto', 'Übergang bei Same-Origin-Navigation aktivieren'],
    ['navigation: none', 'Deaktiviert (Standard)']
  ],
  example: '@view-transition {\n  navigation: auto;\n}\n\n.header { view-transition-name: header; }\n\n::view-transition-old(root) { animation: fade-out .3s; }\n::view-transition-new(root) { animation: fade-in .3s; }',
  keywords: ['seitenübergang', 'page transition', 'animation', 'mpa'],
  related: ['@keyframes'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@view-transition'
}, {
  lang: 'css', group: 'At-Regeln', name: '@position-try',
  desc: 'Definiert eine Ausweich-Position für Anchor Positioning.',
  details: 'Zusammen mit CSS Anchor Positioning legst du mit `@position-try --name` alternative Platzierungen fest. Passt ein verankertes Element (z. B. Tooltip) nicht in den sichtbaren Bereich, probiert der Browser über `position-try-fallbacks` die Alternativen durch. Der Block erlaubt nur Positions-, Größen- und Margin-Eigenschaften.',
  syntax: '@position-try --name {\n  top: anchor(bottom);\n  left: anchor(left);\n}\n.tip { position-try-fallbacks: --name; }',
  values: [
    ['--name', 'Benutzerdefinierter Bezeichner (mit zwei Bindestrichen)'],
    ['position-try-fallbacks', 'Liste der Alternativen am Element'],
    ['flip-block / flip-inline', 'Eingebaute Spiegelungen ohne eigene Regel']
  ],
  example: '.tooltip {\n  position: fixed;\n  position-anchor: --btn;\n  bottom: anchor(top);\n  position-try-fallbacks: --unten;\n}\n\n@position-try --unten {\n  bottom: auto;\n  top: anchor(bottom);\n}',
  tip: 'Unterstützung noch nicht überall gegeben: mit `@supports (anchor-name: --a)` absichern.',
  keywords: ['anchor positioning', 'tooltip', 'fallback', 'verankern'],
  related: ['@supports'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@position-try'
});

window.CHEAT.push({
  lang: 'css', group: 'Media Features', name: 'width / min-width / max-width',
  desc: 'Media Feature für die Breite des Viewports (Breakpoints).',
  details: '`min-width` trifft ab einer Breite zu, `max-width` bis zu einer Breite, `width` nur bei exakter Breite. Mit `min-width` baust du Mobile First, mit `max-width` Desktop First. Fallstrick: Die Werte sind inklusiv, daher können sich `max-width: 600px` und `min-width: 600px` überschneiden; nutze besser die Range-Syntax oder `min-width: 601px`.',
  syntax: '@media (min-width: 768px) { ... }\n@media (max-width: 767.98px) { ... }',
  values: [
    ['min-width: X', 'Viewport mindestens X breit'],
    ['max-width: X', 'Viewport höchstens X breit'],
    ['width: X', 'Viewport exakt X breit'],
    ['height / min-height / max-height', 'Entsprechend für die Höhe']
  ],
  example: '.grid { display: grid; grid-template-columns: 1fr; }\n\n@media (min-width: 600px) {\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\n\n@media (min-width: 1024px) {\n  .grid { grid-template-columns: repeat(4, 1fr); }\n}',
  tip: 'Breakpoints in `em` skalieren mit der Browser-Schriftgröße und sind barrierefreundlicher als `px`.',
  keywords: ['breakpoint', 'viewport', 'breite', 'responsive', 'mobile first'],
  related: ['@media', 'Range-Syntax (width >= 600px)', 'orientation'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media/width'
}, {
  lang: 'css', group: 'Media Features', name: 'prefers-color-scheme',
  desc: 'Erkennt, ob der Nutzer ein helles oder dunkles Farbschema bevorzugt.',
  details: 'Die Abfrage spiegelt die Betriebssystem- bzw. Browsereinstellung wider (`light` oder `dark`). Damit baust du einen Dark Mode ohne JavaScript, am besten mit Custom Properties für Farben. Ergänze `color-scheme: light dark` auf `:root`, damit Formularelemente und Scrollbars mitziehen.',
  syntax: '@media (prefers-color-scheme: dark) { ... }',
  values: [
    ['light', 'Helles Schema (Standard, wenn nichts gewählt)'],
    ['dark', 'Dunkles Schema']
  ],
  example: ':root {\n  color-scheme: light dark;\n  --bg: #fff;\n  --fg: #111;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root { --bg: #111; --fg: #eee; }\n}\n\nbody { background: var(--bg); color: var(--fg); }',
  demo: '<style>.p{padding:14px;border-radius:8px;background:#fff8d6;color:#332}.p::after{content:"Hell"}@media (prefers-color-scheme: dark){.p{background:#1e2538;color:#fff}.p::after{content:"Dunkel"}}</style><div class="p">Dein System ist auf: </div>',
  tip: 'Mit `light-dark()` kommst du oft ganz ohne Media Query aus.',
  keywords: ['dark mode', 'dunkelmodus', 'theme', 'farbschema', 'hell'],
  related: ['light-dark()', '@media', 'prefers-contrast'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media/prefers-color-scheme'
}, {
  lang: 'css', group: 'Media Features', name: 'prefers-reduced-motion',
  desc: 'Erkennt den Wunsch nach weniger Animationen und Bewegung.',
  details: 'Nutzer mit vestibulären Störungen oder Reizempfindlichkeit aktivieren im Betriebssystem "Bewegung reduzieren". Mit `prefers-reduced-motion: reduce` schaltest du große Animationen, Parallax und automatisch laufende Effekte ab oder ersetzt sie durch sanfte Überblendungen. Alternativ setzt du Animationen nur im Fall `no-preference` ein.',
  syntax: '@media (prefers-reduced-motion: reduce) { ... }',
  values: [
    ['reduce', 'Nutzer wünscht reduzierte Bewegung'],
    ['no-preference', 'Keine Präferenz angegeben']
  ],
  example: '.hero { animation: slide-in 1s ease-out; }\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: .01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: .01ms !important;\n    scroll-behavior: auto !important;\n  }\n}',
  demo: '<style>@keyframes w{to{transform:translateX(120px)}}.d{width:30px;height:30px;border-radius:50%;background:#b4367a;animation:w 1.2s ease-in-out infinite alternate}@media (prefers-reduced-motion: reduce){.d{animation:none}}</style><div class="d"></div><p style="font-size:12px">Stoppt bei aktivierter Systemoption "Bewegung reduzieren".</p>',
  keywords: ['animation', 'barrierefreiheit', 'a11y', 'bewegung', 'motion'],
  related: ['@keyframes', '@media'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media/prefers-reduced-motion'
}, {
  lang: 'css', group: 'Media Features', name: 'prefers-contrast',
  desc: 'Erkennt den Wunsch nach höherem oder niedrigerem Kontrast.',
  details: 'Die Abfrage reagiert auf Systemeinstellungen für erhöhten oder verringerten Kontrast. Mit `more` verstärkst du Rahmen, Textfarben und Hintergründe, damit Inhalte besser lesbar werden. `custom` steht für eigene Farbpaletten (z. B. Windows-Kontrastdesigns), `less` für abgeschwächten Kontrast.',
  syntax: '@media (prefers-contrast: more) { ... }',
  values: [
    ['more', 'Höherer Kontrast gewünscht'],
    ['less', 'Geringerer Kontrast gewünscht'],
    ['custom', 'Eigene Farbpalette des Nutzers aktiv'],
    ['no-preference', 'Keine Präferenz']
  ],
  example: '.btn {\n  background: #b4367a;\n  border: 1px solid transparent;\n}\n\n@media (prefers-contrast: more) {\n  .btn {\n    background: #6b0f45;\n    border-color: currentColor;\n  }\n}',
  keywords: ['kontrast', 'barrierefreiheit', 'a11y', 'high contrast'],
  related: ['prefers-color-scheme', '@media'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media/prefers-contrast'
}, {
  lang: 'css', group: 'Media Features', name: 'hover',
  desc: 'Prüft, ob das primäre Eingabegerät über Elemente schweben (hovern) kann.',
  details: 'Mit `(hover: hover)` stylst du Hover-Effekte nur für Geräte mit Maus oder Trackpad. Auf Touchgeräten bleibt `:hover` sonst nach dem Antippen oft "hängen". `any-hover` fragt dagegen alle verfügbaren Eingabegeräte ab, nicht nur das primäre.',
  syntax: '@media (hover: hover) { ... }',
  values: [
    ['hover', 'Primäres Gerät kann hovern (Maus)'],
    ['none', 'Primäres Gerät kann nicht hovern (Touch)'],
    ['any-hover', 'Mindestens ein Gerät kann hovern']
  ],
  example: '@media (hover: hover) {\n  .card:hover {\n    transform: translateY(-4px);\n    box-shadow: 0 8px 20px #0003;\n  }\n}\n\n@media (hover: none) {\n  .card { box-shadow: 0 2px 6px #0002; }\n}',
  demo: '<style>.h{padding:12px;border-radius:8px;background:#eee;color:#222}.h::after{content:"Hover nicht möglich (Touch)"}@media (hover: hover){.h::after{content:"Hover möglich (Maus)"}.h:hover{background:#b4367a;color:#fff}}</style><div class="h"></div>',
  keywords: ['touch', 'maus', 'mouse', 'eingabegerät'],
  related: ['pointer', ':hover'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media/hover'
}, {
  lang: 'css', group: 'Media Features', name: 'pointer',
  desc: 'Genauigkeit des primären Zeigegeräts (fein, grob, keins).',
  details: '`pointer: fine` steht für Maus und Stift, `coarse` für Finger auf Touchscreens. Vergrößere bei `coarse` Klickflächen auf mindestens ca. 44 x 44 px. Fallstrick: Geräte mit mehreren Eingaben melden nur das primäre; `any-pointer` prüft alle.',
  syntax: '@media (pointer: coarse) { ... }',
  values: [
    ['fine', 'Präzise (Maus, Stift)'],
    ['coarse', 'Ungenau (Finger)'],
    ['none', 'Kein Zeigegerät'],
    ['any-pointer', 'Prüft alle verfügbaren Geräte']
  ],
  example: 'button { padding: 6px 10px; }\n\n@media (pointer: coarse) {\n  button {\n    padding: 14px 18px;\n    min-height: 44px;\n  }\n}',
  demo: '<style>.b{display:inline-block;padding:4px 8px;background:#b4367a;color:#fff;border-radius:6px}@media (pointer: coarse){.b{padding:16px 22px}}</style><span class="b">Button (größer bei Touch)</span>',
  keywords: ['touch', 'finger', 'klickfläche', 'barrierefreiheit'],
  related: ['hover', '@media'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media/pointer'
}, {
  lang: 'css', group: 'Media Features', name: 'orientation',
  desc: 'Hoch- oder Querformat des Viewports.',
  details: '`portrait` gilt, wenn die Höhe mindestens so groß wie die Breite ist, sonst `landscape`. Es geht um das Seitenverhältnis des Viewports, nicht des Geräts; auch ein schmales Desktop-Fenster kann `portrait` sein. Für gezielte Breakpoints ist `min-width` meist robuster.',
  syntax: '@media (orientation: landscape) { ... }',
  values: [
    ['portrait', 'Höhe >= Breite'],
    ['landscape', 'Breite > Höhe']
  ],
  example: '.video { width: 100%; }\n\n@media (orientation: landscape) and (max-height: 500px) {\n  .header { display: none; }\n}',
  demo: '<style>.o{padding:12px;border-radius:8px;color:#fff;background:#2a6}.o::after{content:"Hochformat"}@media (orientation: landscape){.o{background:#b4367a}.o::after{content:"Querformat"}}</style><div class="o"></div>',
  keywords: ['hochformat', 'querformat', 'portrait', 'landscape', 'drehen'],
  related: ['aspect-ratio (Media)', 'width / min-width / max-width'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media/orientation'
}, {
  lang: 'css', group: 'Media Features', name: 'aspect-ratio (Media)',
  desc: 'Media Feature für das Seitenverhältnis des Viewports.',
  details: 'Mit `aspect-ratio` fragst du das Verhältnis von Breite zu Höhe des Viewports ab, z. B. `(min-aspect-ratio: 16/9)`. Das ist nicht die CSS-Eigenschaft `aspect-ratio` für Elemente. Nützlich für Layouts, die sich an sehr breite oder sehr schmale Fenster anpassen.',
  syntax: '@media (min-aspect-ratio: 16/9) { ... }',
  values: [
    ['aspect-ratio: 16/9', 'Exakt dieses Verhältnis'],
    ['min-aspect-ratio: W/H', 'Mindestens so breit'],
    ['max-aspect-ratio: W/H', 'Höchstens so breit']
  ],
  example: '.stage { display: grid; }\n\n@media (min-aspect-ratio: 16/9) {\n  .stage { grid-template-columns: 1fr 300px; }\n}\n\n@media (max-aspect-ratio: 1/1) {\n  .stage { grid-template-columns: 1fr; }\n}',
  tip: 'Nicht mit der Eigenschaft `aspect-ratio` verwechseln, die die Proportion eines Elements festlegt.',
  keywords: ['seitenverhältnis', 'ratio', '16:9', 'viewport'],
  related: ['orientation', 'width / min-width / max-width'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media/aspect-ratio'
}, {
  lang: 'css', group: 'Media Features', name: 'resolution',
  desc: 'Pixeldichte des Ausgabegeräts (Retina/HiDPI).',
  details: 'Mit `resolution` (oder `min-resolution`) lieferst du schärfere Bilder für hochauflösende Displays, z. B. `(min-resolution: 2dppx)` für Retina. Einheiten sind `dpi`, `dpcm` und `dppx` (`x` ist ein Alias). Für `<img>` ist `srcset` meist die bessere Lösung, bei Hintergrundbildern bleibt `image-set()` oder diese Abfrage.',
  syntax: '@media (min-resolution: 2dppx) { ... }',
  values: [
    ['min-resolution: 2dppx', 'Mindestens doppelte Pixeldichte'],
    ['min-resolution: 192dpi', 'Gleichbedeutend mit 2dppx'],
    ['2x', 'Alias für dppx']
  ],
  example: '.logo { background-image: url("logo.png"); }\n\n@media (min-resolution: 2dppx) {\n  .logo {\n    background-image: url("logo@2x.png");\n    background-size: 100px auto;\n  }\n}',
  keywords: ['retina', 'hidpi', 'pixeldichte', 'dpi', 'auflösung'],
  related: ['dpi / dppx', 'image-set()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media/resolution'
}, {
  lang: 'css', group: 'Media Features', name: 'display-mode',
  desc: 'Erkennt, wie die Web-App angezeigt wird (z. B. als installierte PWA).',
  details: 'Mit `display-mode` unterscheidest du Browser-Tab (`browser`) von installierter App (`standalone`, `fullscreen`, `minimal-ui`, `window-controls-overlay`). So blendest du etwa einen Zurück-Button oder eigene Navigation nur in der installierten PWA ein. Die tatsächlichen Werte folgen dem Web App Manifest.',
  syntax: '@media (display-mode: standalone) { ... }',
  values: [
    ['browser', 'Normaler Browser-Tab'],
    ['standalone', 'Eigenes App-Fenster ohne Browser-UI'],
    ['fullscreen', 'Vollbild'],
    ['minimal-ui', 'App mit minimalen Browser-Elementen'],
    ['window-controls-overlay', 'Inhalt reicht in die Titelleiste']
  ],
  example: '.install-hint { display: block; }\n\n@media (display-mode: standalone) {\n  .install-hint { display: none; }\n  body { padding-top: env(safe-area-inset-top); }\n}',
  keywords: ['pwa', 'standalone', 'app', 'manifest', 'installiert'],
  related: ['env()', '@media'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media/display-mode'
}, {
  lang: 'css', group: 'Media Features', name: 'print (Medientyp)',
  desc: 'Medientyp für Druckausgabe und PDF-Export.',
  details: 'Regeln in `@media print` gelten nur beim Drucken bzw. Speichern als PDF. Blende Navigation, Werbung und Hintergründe aus, nutze schwarze Schrift auf weißem Grund und mache Links mit `attr(href)` sichtbar. Mit `break-inside: avoid` verhinderst du Seitenumbrüche mitten in Blöcken.',
  syntax: '@media print { ... }',
  values: [
    ['print', 'Druck und Druckvorschau'],
    ['screen', 'Bildschirm'],
    ['all', 'Alle Medien (Standard)'],
    ['speech', 'Sprachausgabe']
  ],
  example: '@media print {\n  nav, footer, .ads { display: none; }\n  body { color: #000; background: #fff; font-size: 12pt; }\n  a[href]::after { content: " (" attr(href) ")"; }\n  h2, figure { break-inside: avoid; }\n}',
  tip: 'Teste mit den Entwicklertools unter "Rendering > Emulate CSS media type: print".',
  keywords: ['drucken', 'pdf', 'druckstylesheet', 'ausdruck'],
  related: ['@page', 'attr()', '@media'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/@media#medientypen'
}, {
  lang: 'css', group: 'Media Features', name: 'Range-Syntax (width >= 600px)',
  desc: 'Moderne Schreibweise für Medienabfragen mit Vergleichsoperatoren.',
  details: 'Statt `min-width`/`max-width` schreibst du `(width >= 600px)` oder Bereiche wie `(400px <= width <= 900px)`. Das ist lesbarer und vermeidet Überschneidungen, da auch `<` und `>` (exklusiv) möglich sind. Funktioniert für alle Range-Features wie `width`, `height`, `aspect-ratio` und `resolution`, und ebenso in `@container`.',
  syntax: '@media (width >= 600px) { ... }\n@media (400px <= width < 900px) { ... }',
  values: [
    ['>= / <=', 'Größer-gleich / Kleiner-gleich (inklusiv)'],
    ['> / <', 'Größer / Kleiner (exklusiv)'],
    ['=', 'Gleich'],
    ['a <= width <= b', 'Wertebereich in einem Ausdruck']
  ],
  example: '.layout { display: block; }\n\n@media (width >= 768px) {\n  .layout { display: grid; grid-template-columns: 1fr 2fr; }\n}\n\n@media (600px <= width < 1000px) {\n  .note { display: block; }\n}',
  demo: '<style>.r{padding:12px;border-radius:8px;background:#eef;color:#223}.r::after{content:"Schmal: unter 400px"}@media (width >= 400px){.r::after{content:"Mittel: 400px bis unter 700px"}}@media (width >= 700px){.r::after{content:"Breit: ab 700px"}}</style><div class="r"></div>',
  keywords: ['media query', 'vergleich', 'bereich', 'breakpoint', 'range'],
  related: ['width / min-width / max-width', '@media', '@container'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/CSS_media_queries/Using_media_queries#syntax_improvements_in_level_4'
});

window.CHEAT.push({
  lang: 'css', group: 'Einheiten', name: 'px',
  desc: 'Pixel: feste, absolute CSS-Längeneinheit.',
  details: 'Ein CSS-Pixel ist eine geräteunabhängige Referenzgröße (1/96 Zoll), kein physischer Bildschirmpunkt; auf HiDPI-Displays bestehen sie aus mehreren Geräte-Pixeln. Verwende `px` für Rahmen, Schatten, feine Details und feste Maße. Für Schriftgrößen und Abstände sind `rem`/`em` meist besser, weil sie Nutzereinstellungen respektieren.',
  syntax: 'width: 200px;',
  example: '.card {\n  border: 1px solid #ccc;\n  box-shadow: 0 2px 8px #0003;\n  border-radius: 8px;\n}',
  demo: '<style>.u{height:20px;background:#b4367a;margin:4px 0;color:#fff;font-size:12px;line-height:20px}</style><div class="u" style="width:50px">50px</div><div class="u" style="width:100px">100px</div><div class="u" style="width:200px">200px</div>',
  keywords: ['pixel', 'absolut', 'fest', 'einheit'],
  related: ['rem', 'em', '%'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#px'
}, {
  lang: 'css', group: 'Einheiten', name: 'em',
  desc: 'Relativ zur Schriftgröße des Elements (bzw. des Elternelements bei font-size).',
  details: '`1em` entspricht der berechneten `font-size` des aktuellen Elements; bei `font-size` selbst bezieht es sich auf die des Elternelements. Gut für Abstände, die mit der Textgröße einer Komponente skalieren (z. B. Button-Padding). Fallstrick: Bei verschachtelten Elementen multiplizieren sich `em`-Schriftgrößen.',
  syntax: 'padding: 0.5em 1em;',
  example: '.btn {\n  font-size: 1.25rem;\n  padding: 0.5em 1em; /* skaliert mit der Button-Schrift */\n  border-radius: 0.3em;\n}',
  demo: '<style>.e{background:#b4367a;color:#fff;display:inline-block;margin:4px;padding:.5em 1em;border-radius:.3em}</style><span class="e" style="font-size:12px">klein</span><span class="e" style="font-size:18px">mittel</span><span class="e" style="font-size:26px">groß</span>',
  keywords: ['relativ', 'schriftgröße', 'skalieren', 'font-size'],
  related: ['rem', 'ch', 'ex'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#em'
}, {
  lang: 'css', group: 'Einheiten', name: 'rem',
  desc: 'Relativ zur Schriftgröße des Wurzelelements (`html`).',
  details: '`1rem` entspricht der `font-size` von `html`, standardmäßig meist 16px. Damit bleiben Größen konsistent und folgen der Schriftgrößen-Einstellung des Nutzers. Setze die Basisgröße niemals auf `px` fest (z. B. `html { font-size: 10px }`), sondern nutze `100%` und rechne in `rem`.',
  syntax: 'font-size: 1.5rem;',
  example: 'html { font-size: 100%; }\n\nh1 { font-size: 2.5rem; margin-bottom: 1rem; }\np  { font-size: 1rem; max-width: 40rem; }',
  demo: '<style>.r1{margin:0;color:#223}</style><p class="r1" style="font-size:1rem">1rem</p><p class="r1" style="font-size:1.5rem">1.5rem</p><p class="r1" style="font-size:2rem">2rem</p>',
  tip: 'Auch Media-Query-Breakpoints in `em`/`rem` zu schreiben respektiert Nutzer-Zoom.',
  keywords: ['root', 'wurzel', 'schriftgröße', 'skalierung', 'barrierefreiheit'],
  related: ['em', 'px', 'clamp()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#rem'
}, {
  lang: 'css', group: 'Einheiten', name: '%',
  desc: 'Prozentwert relativ zu einer Bezugsgröße (meist dem Elternelement).',
  details: 'Die Bezugsgröße hängt von der Eigenschaft ab: `width` bezieht sich auf die Breite des Containers, `height` auf dessen Höhe (nur wenn diese definiert ist), `padding`/`margin` immer auf die Breite, `font-size` auf die Eltern-Schrift, `top`/`left` auf den Positionierungs-Container. Fallstrick: Prozentuale `height` wirkt nicht, wenn das Elternelement keine feste Höhe hat.',
  syntax: 'width: 50%;',
  example: '.col {\n  width: 33.333%;\n  padding: 5%;   /* bezieht sich auf die Breite des Elternelements */\n}\n\n.img { max-width: 100%; height: auto; }',
  demo: '<style>.p{width:100%;background:#eef;padding:4px 0}.p div{background:#b4367a;color:#fff;margin:3px 0;font-size:12px;padding:2px 4px;box-sizing:border-box}</style><div class="p"><div style="width:25%">25%</div><div style="width:50%">50%</div><div style="width:75%">75%</div></div>',
  keywords: ['prozent', 'relativ', 'elternelement', 'breite'],
  related: ['vw / vh', 'fr', 'calc()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/percentage'
}, {
  lang: 'css', group: 'Einheiten', name: 'vw / vh',
  desc: 'Viewport-Einheiten: 1 % der Breite bzw. Höhe des Viewports.',
  details: '`100vw` ist die gesamte Viewport-Breite, `100vh` die gesamte Höhe. Praktisch für Vollbild-Sektionen und fluide Typografie. Fallstrick: `100vw` schließt eine vertikale Scrollbar ein und erzeugt dadurch leicht horizontales Scrollen; auf Mobilgeräten schwankt `vh` mit der Browser-Leiste, nutze dann `dvh`/`svh`.',
  syntax: 'width: 50vw;\nheight: 100vh;',
  example: '.hero {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n}\n\nh1 { font-size: calc(1rem + 3vw); }',
  demo: '<style>.v{height:20px;background:#b4367a;margin:4px 0;color:#fff;font-size:12px;line-height:20px}</style><div class="v" style="width:25vw">25vw</div><div class="v" style="width:50vw">50vw</div><div class="v" style="width:75vw">75vw</div>',
  keywords: ['viewport', 'fensterbreite', 'fensterhöhe', 'vollbild', 'hero'],
  related: ['dvh / svh / lvh', 'vmin / vmax', 'clamp()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#vw'
}, {
  lang: 'css', group: 'Einheiten', name: 'dvh / svh / lvh',
  desc: 'Dynamische, kleine und große Viewport-Höhe für mobile Browser.',
  details: 'Auf Mobilgeräten ändert sich die sichtbare Höhe, wenn die Adressleiste ein- oder ausfährt. `svh` ist die kleinste Höhe (Leiste sichtbar), `lvh` die größte (Leiste weg), `dvh` passt sich dynamisch an. Für Vollbild-Layouts ist `100svh` stabil, `100dvh` folgt live (kann dafür Reflows auslösen). Die Varianten gibt es auch für Breite und Inline/Block: `dvw`, `dvi`, `dvb`.',
  syntax: 'min-height: 100dvh;',
  values: [
    ['svh', 'Small Viewport Height: Browser-UI eingeblendet'],
    ['lvh', 'Large Viewport Height: Browser-UI ausgeblendet'],
    ['dvh', 'Dynamic Viewport Height: aktuelle sichtbare Höhe']
  ],
  example: '.app {\n  min-height: 100vh;   /* Fallback */\n  min-height: 100dvh;\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n}',
  tip: 'Nutze `100vh` als Fallback vor `100dvh` für ältere Browser.',
  keywords: ['mobile', 'adressleiste', 'viewport height', 'safari', '100vh problem'],
  related: ['vw / vh', 'vmin / vmax'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#dynamic_viewport_units'
}, {
  lang: 'css', group: 'Einheiten', name: 'vmin / vmax',
  desc: 'Viewport-Einheiten: 1 % der kleineren bzw. größeren Viewport-Seite.',
  details: '`vmin` bezieht sich auf die kürzere, `vmax` auf die längere Seite des Viewports. Ideal für Elemente, die in Hoch- und Querformat proportional bleiben sollen, etwa ein Quadrat, das immer ins Fenster passt. Mit `min()` oder `clamp()` lässt sich die Skalierung begrenzen.',
  syntax: 'width: 50vmin;',
  example: '.square {\n  width: 60vmin;\n  height: 60vmin;\n  background: #b4367a;\n}\n\nh1 { font-size: clamp(1.5rem, 6vmin, 4rem); }',
  demo: '<style>.q{width:30vmin;height:30vmin;background:#b4367a;color:#fff;display:grid;place-items:center;font-size:12px}</style><div class="q">30vmin</div>',
  keywords: ['viewport', 'quadrat', 'proportional', 'minimum', 'maximum'],
  related: ['vw / vh', 'min()', 'clamp()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#vmin'
}, {
  lang: 'css', group: 'Einheiten', name: 'ch',
  desc: 'Breite der Ziffer "0" in der aktuellen Schrift.',
  details: '`ch` eignet sich hervorragend für lesbare Zeilenlängen: `max-width: 65ch` begrenzt Fließtext auf etwa 65 Zeichen pro Zeile. Bei Monospace-Schriften entspricht `1ch` exakt einem Zeichen. Bei proportionalen Schriften ist es nur ein Durchschnitt, da die "0" nicht der Breite jedes Buchstabens entspricht.',
  syntax: 'max-width: 65ch;',
  example: 'article p {\n  max-width: 65ch;\n  margin-inline: auto;\n}\n\ninput.pin { width: 6ch; letter-spacing: 1ch; }',
  demo: '<style>.c{font-size:14px;background:#eef;color:#223;padding:6px;margin:0}</style><p class="c" style="max-width:20ch">Dieser Text bricht bei etwa 20 Zeichen Breite um und zeigt die Wirkung von ch.</p>',
  keywords: ['zeichenbreite', 'zeilenlänge', 'lesbarkeit', 'null'],
  related: ['em', 'ex', 'lh'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#ch'
}, {
  lang: 'css', group: 'Einheiten', name: 'ex',
  desc: 'x-Höhe der aktuellen Schrift (Höhe des Kleinbuchstabens "x").',
  details: '`1ex` entspricht der Höhe der Kleinbuchstaben ohne Ober- und Unterlängen. Es wird selten gebraucht, kann aber nützlich sein, um Icons oder Abstände optisch an den Fließtext anzupassen. Die tatsächliche Größe hängt stark von der gewählten Schrift ab.',
  syntax: 'height: 1ex;',
  example: '.icon {\n  height: 1.2ex;\n  vertical-align: baseline;\n}',
  keywords: ['x-höhe', 'x-height', 'schrift', 'typografie'],
  related: ['ch', 'em', 'lh'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#ex'
}, {
  lang: 'css', group: 'Einheiten', name: 'lh',
  desc: 'Berechnete Zeilenhöhe (`line-height`) des Elements.',
  details: '`1lh` entspricht der aktuellen Zeilenhöhe. Damit bekommst du vertikale Abstände, die exakt ganze Textzeilen entsprechen, was das Einhalten eines Baseline-Rasters erleichtert. `rlh` bezieht sich analog auf die Zeilenhöhe des Wurzelelements.',
  syntax: 'margin-block: 1lh;',
  example: 'body { line-height: 1.5; }\n\np { margin-block: 1lh; }\n\ntextarea { min-height: 5lh; }',
  keywords: ['zeilenhöhe', 'line-height', 'abstand', 'raster', 'rlh'],
  related: ['em', 'ch', 'rem'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#lh'
}, {
  lang: 'css', group: 'Einheiten', name: 'fr',
  desc: 'Flexibler Bruchteil des verfügbaren Platzes in Grid-Layouts.',
  details: '`fr` verteilt den freien Platz im Grid proportional: `1fr 2fr` ergibt ein Drittel und zwei Drittel. Feste Spalten und `gap` werden zuerst abgezogen. Fallstrick: `1fr` hat ein implizites Minimum von `auto`, lange Inhalte können die Spalte aufblähen; `minmax(0, 1fr)` verhindert das.',
  syntax: 'grid-template-columns: 1fr 2fr 1fr;',
  example: '.layout {\n  display: grid;\n  grid-template-columns: 200px 1fr 2fr;\n  gap: 16px;\n}',
  demo: '<style>.g{display:grid;grid-template-columns:1fr 2fr 1fr;gap:6px}.g div{background:#b4367a;color:#fff;padding:8px;text-align:center}</style><div class="g"><div>1fr</div><div>2fr</div><div>1fr</div></div>',
  keywords: ['fraction', 'bruchteil', 'grid', 'spalten', 'flexibel'],
  related: ['%', 'minmax()', 'repeat()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/flex_value'
}, {
  lang: 'css', group: 'Einheiten', name: 'cqw / cqh / cqi / cqb',
  desc: 'Container-Einheiten: 1 % der Größe des nächsten Query-Containers.',
  details: '`cqw` und `cqh` beziehen sich auf Breite und Höhe, `cqi` und `cqb` auf Inline- und Block-Größe des nächsten Vorfahren mit `container-type`. Es gibt auch `cqmin` und `cqmax`. Damit skalieren Schriften und Abstände mit der Komponente statt mit dem Viewport. Ohne Container greifen sie auf die kleine Viewport-Einheit (`svw`/`svh`) zurück.',
  syntax: 'font-size: 5cqi;',
  example: '.wrap { container-type: inline-size; }\n\n.title {\n  font-size: clamp(1rem, 6cqi, 2.5rem);\n  padding: 2cqi;\n}',
  demo: '<style>.cw{container-type:inline-size;width:60%;resize:horizontal;overflow:auto;border:2px dashed #b4367a;padding:6px}.cw p{margin:0;font-size:10cqi;color:#223}</style><div class="cw"><p>Skaliert mit dem Rahmen</p></div><p style="font-size:12px">Rahmen unten rechts ziehen.</p>',
  keywords: ['container units', 'container query', 'cqi', 'cqb', 'komponente'],
  related: ['@container', 'vw / vh', 'clamp()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#container_query_length_units'
}, {
  lang: 'css', group: 'Einheiten', name: 'deg / rad / turn',
  desc: 'Winkeleinheiten für Rotation, Verläufe und Skew.',
  details: 'Ein Vollkreis sind `360deg`, `400grad`, `2π rad` (ca. `6.283rad`) oder `1turn`. Am gebräuchlichsten sind `deg` für Verläufe und `turn` für einfache Umdrehungen in Animationen (`0.25turn` = 90°). Positive Werte drehen im Uhrzeigersinn.',
  syntax: 'transform: rotate(45deg);',
  values: [
    ['deg', '360 Grad = ein Vollkreis'],
    ['rad', 'Bogenmaß: 2π ≈ 6,283 = Vollkreis'],
    ['grad', 'Gon: 400 = Vollkreis'],
    ['turn', '1 = eine ganze Umdrehung']
  ],
  example: '.arrow { transform: rotate(0.25turn); }\n\n.hero {\n  background: linear-gradient(135deg, #b4367a, #3a2a7a);\n}\n\n@keyframes spin { to { transform: rotate(1turn); } }',
  demo: '<style>.a{width:40px;height:40px;margin:14px;background:#b4367a;display:inline-block}</style><div class="a" style="transform:rotate(0deg)"></div><div class="a" style="transform:rotate(45deg)"></div><div class="a" style="transform:rotate(.25turn)"></div><div class="a" style="transform:rotate(1.5708rad)"></div>',
  keywords: ['winkel', 'drehen', 'rotation', 'grad', 'umdrehung', 'angle'],
  related: ['conic-gradient()', 'linear-gradient()', '@keyframes'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/angle'
}, {
  lang: 'css', group: 'Einheiten', name: 's / ms',
  desc: 'Zeiteinheiten für Transitions und Animationen.',
  details: '`1s` entspricht `1000ms`. Für Hover-Effekte sind etwa `150ms` bis `300ms` angenehm, für größere Bewegungen `400ms` bis `600ms`. Der Wert muss immer mit Einheit angegeben werden, auch `0` braucht `0s`.',
  syntax: 'transition: opacity 0.3s;\nanimation-duration: 800ms;',
  example: '.btn {\n  transition: background-color 200ms ease, transform 150ms ease;\n  transition-delay: 0s;\n}\n\n.btn:hover { transform: translateY(-2px); }',
  demo: '<style>.t{width:60px;height:30px;background:#b4367a;margin:6px 0;transition:width 1s linear}.w:hover .t{width:220px}.t.f{transition-duration:.2s}</style><div class="w">Mit der Maus darüber fahren:<div class="t f"></div><div class="t"></div></div>',
  keywords: ['zeit', 'dauer', 'sekunden', 'millisekunden', 'transition', 'duration'],
  related: ['@keyframes', 'cubic-bezier()', 'steps()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/time'
}, {
  lang: 'css', group: 'Einheiten', name: 'dpi / dppx',
  desc: 'Auflösungseinheiten für Media Queries und `image-set()`.',
  details: '`dppx` (Dots per CSS-Pixel) ist die Pixeldichte relativ zum CSS-Pixel: `2dppx` entspricht Retina. `dpi` und `dpcm` beziehen sich auf Zoll bzw. Zentimeter; `96dpi` = `1dppx`. Die Kurzform `2x` ist ein Alias für `2dppx`.',
  syntax: '@media (min-resolution: 2dppx) { ... }\nimage-set("a.png" 1x, "a@2x.png" 2x)',
  values: [
    ['dppx', 'Gerätepixel pro CSS-Pixel'],
    ['x', 'Alias für dppx'],
    ['dpi', 'Punkte pro Zoll (96dpi = 1dppx)'],
    ['dpcm', 'Punkte pro Zentimeter']
  ],
  example: '.logo {\n  background-image: image-set(\n    url("logo.png") 1x,\n    url("logo@2x.png") 2x\n  );\n}\n\n@media (min-resolution: 192dpi) {\n  .line { border-width: 0.5px; }\n}',
  keywords: ['auflösung', 'retina', 'pixeldichte', 'hidpi'],
  related: ['resolution', 'image-set()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/resolution'
}, {
  lang: 'css', group: 'Einheiten', name: 'cm / mm / in / pt',
  desc: 'Absolute physische Einheiten, vor allem für den Druck.',
  details: 'Im CSS-Bezug gilt `1in = 2.54cm = 96px = 72pt`; `1pt` ist also 1/72 Zoll. Auf dem Bildschirm entsprechen sie nicht der echten physischen Größe, daher taugen sie dort kaum. Im Druck-Stylesheet (`@media print`) und in `@page` sind sie dagegen sinnvoll, z. B. `12pt` für Text oder `2cm` Seitenrand.',
  syntax: 'margin: 2cm;\nfont-size: 12pt;',
  values: [
    ['cm', 'Zentimeter (1cm = 37,8px)'],
    ['mm', 'Millimeter'],
    ['in', 'Zoll (1in = 96px)'],
    ['pt', 'Punkt (1pt = 1/72 Zoll)'],
    ['pc', 'Pica (1pc = 12pt)']
  ],
  example: '@page { size: A4; margin: 2cm; }\n\n@media print {\n  body { font-size: 11pt; line-height: 1.4; }\n  .box { width: 8cm; border: 0.5pt solid #000; }\n}',
  keywords: ['zentimeter', 'millimeter', 'zoll', 'punkt', 'druck', 'absolut'],
  related: ['px', '@page', 'print (Medientyp)'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/length#absolute_length_units'
});

window.CHEAT.push({
  lang: 'css', group: 'Funktionen', name: 'calc()',
  desc: 'Berechnet Längen mit +, -, *, / und mischt dabei unterschiedliche Einheiten.',
  details: 'In `calc()` kombinierst du z. B. Prozent und Pixel: `calc(100% - 2rem)`. Bei `+` und `-` müssen Leerzeichen um den Operator stehen. Bei `*` muss mindestens ein Faktor eine reine Zahl sein, bei `/` der Divisor. Funktionen lassen sich verschachteln, und `var()` darf innerhalb stehen.',
  syntax: 'width: calc(100% - 2rem);',
  values: [
    ['+ und -', 'Leerzeichen links und rechts sind Pflicht'],
    ['*', 'Ein Faktor muss eine Zahl ohne Einheit sein'],
    ['/', 'Der Divisor muss eine Zahl ohne Einheit sein']
  ],
  example: '.main {\n  width: calc(100% - var(--sidebar-w));\n  padding: calc(1rem + 2vw);\n  margin-top: calc(var(--gap) * 2);\n}',
  demo: '<style>.cc{width:100%;background:#eef;padding:6px 0}.cc div{background:#b4367a;color:#fff;font-size:12px;padding:6px 0;text-align:center;width:calc(100% - 80px)}</style><div class="cc"><div>calc(100% - 80px)</div></div>',
  keywords: ['rechnen', 'berechnung', 'mathe', 'mischen', 'einheiten'],
  related: ['min()', 'max()', 'clamp()', 'var()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/calc'
}, {
  lang: 'css', group: 'Funktionen', name: 'min()',
  desc: 'Nimmt den kleinsten der übergebenen Werte.',
  details: '`min(a, b, ...)` liefert den kleinsten Wert und eignet sich als flexible Obergrenze, z. B. `width: min(100%, 60rem)`. Dadurch brauchst du oft kein separates `max-width`. Die Argumente können Berechnungen enthalten und verschiedene Einheiten mischen.',
  syntax: 'width: min(90%, 800px);',
  example: '.container {\n  width: min(100% - 2rem, 70rem);\n  margin-inline: auto;\n}',
  demo: '<style>.mm{background:#b4367a;color:#fff;padding:8px;font-size:13px;width:min(100%,300px)}</style><div class="mm">width: min(100%, 300px)</div>',
  keywords: ['minimum', 'kleinster', 'obergrenze', 'maximalbreite'],
  related: ['max()', 'clamp()', 'calc()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/min'
}, {
  lang: 'css', group: 'Funktionen', name: 'max()',
  desc: 'Nimmt den größten der übergebenen Werte.',
  details: '`max(a, b, ...)` liefert den größten Wert und setzt damit eine Untergrenze, etwa `font-size: max(1rem, 2vw)`, damit Text nie zu klein wird. Verwende es für Mindestabstände oder Mindestgrößen, die sonst relativ skalieren.',
  syntax: 'padding: max(1rem, 3vw);',
  example: 'body {\n  padding-inline: max(1rem, env(safe-area-inset-left));\n  font-size: max(1rem, 1.2vw);\n}',
  demo: '<style>.mx{background:#b4367a;color:#fff;padding:8px;font-size:13px;width:max(50%,200px)}</style><div class="mx">width: max(50%, 200px)</div>',
  keywords: ['maximum', 'größter', 'untergrenze', 'mindestgröße'],
  related: ['min()', 'clamp()', 'calc()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/max'
}, {
  lang: 'css', group: 'Funktionen', name: 'clamp()',
  desc: 'Begrenzt einen Wert zwischen Minimum und Maximum, mit flexiblem Mittelwert.',
  details: '`clamp(min, bevorzugt, max)` entspricht `max(min, min(bevorzugt, max))`. Der mittlere Wert skaliert (z. B. mit `vw`), bleibt aber immer zwischen Unter- und Obergrenze. Der Klassiker ist fluide Typografie: `clamp(1rem, 0.5rem + 2vw, 2rem)`. Fallstrick: Rein in `vw` angegebene Schrift reagiert nicht auf Browser-Zoom, daher `rem` hinzufügen.',
  syntax: 'font-size: clamp(1rem, 2.5vw, 2rem);',
  example: 'h1 {\n  font-size: clamp(1.75rem, 1rem + 3vw, 3.5rem);\n}\n\n.card { width: clamp(16rem, 50%, 30rem); }',
  demo: '<style>.cl{font-size:clamp(14px,5vw,32px);color:#b4367a;margin:0;font-weight:700}</style><p class="cl">Fluide Schrift: clamp(14px, 5vw, 32px)</p>',
  keywords: ['fluid', 'fluide typografie', 'begrenzen', 'responsive', 'skalieren'],
  related: ['min()', 'max()', 'calc()', 'vw / vh'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/clamp'
}, {
  lang: 'css', group: 'Funktionen', name: 'var()',
  desc: 'Liest den Wert einer Custom Property (CSS-Variable).',
  details: '`var(--name, fallback)` setzt den Wert der Variable ein; der optionale zweite Parameter dient als Ersatz, falls die Variable nicht definiert ist. Variablen werden vererbt und lassen sich per Selektor, Media Query oder inline überschreiben. Ist der Wert zur Laufzeit ungültig für die Eigenschaft, fällt sie auf ihren Initial- bzw. geerbten Wert zurück.',
  syntax: 'color: var(--primary, #b4367a);',
  example: ':root {\n  --primary: #b4367a;\n  --space: 1rem;\n}\n\n.btn {\n  background: var(--primary);\n  padding: var(--space, 8px) calc(var(--space) * 2);\n}',
  demo: '<style>.vv{--c:#b4367a;color:#fff;padding:8px;background:var(--c)}.vv.alt{--c:#2a6}</style><div class="vv">--c: #b4367a</div><div class="vv alt">--c: #2a6 (überschrieben)</div>',
  keywords: ['variable', 'custom property', 'token', 'theme', 'fallback'],
  related: ['Custom Properties (--name)', '@property', 'calc()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/var'
}, {
  lang: 'css', group: 'Funktionen', name: 'env()',
  desc: 'Liest Umgebungsvariablen des Browsers, z. B. sichere Bereiche (Notch).',
  details: 'Mit `env(safe-area-inset-top)` und den Geschwistern `-right`, `-bottom`, `-left` hältst du Inhalte auf Geräten mit Notch oder runden Ecken sichtbar. Voraussetzung ist `viewport-fit=cover` im Viewport-Meta-Tag. Ein Fallback als zweiter Parameter ist möglich: `env(safe-area-inset-top, 0px)`.',
  syntax: 'padding-top: env(safe-area-inset-top, 0px);',
  values: [
    ['safe-area-inset-top/right/bottom/left', 'Abstand zum sicheren Bereich'],
    ['titlebar-area-x/y/width/height', 'Titelleiste bei Window Controls Overlay'],
    ['keyboard-inset-height', 'Höhe der Bildschirmtastatur (wo unterstützt)']
  ],
  example: '.bottom-bar {\n  position: fixed;\n  bottom: 0;\n  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));\n}',
  tip: 'Im HTML-Head: `<meta name="viewport" content="width=device-width, viewport-fit=cover">`.',
  keywords: ['notch', 'safe area', 'iphone', 'umgebung', 'sicherer bereich'],
  related: ['var()', 'display-mode'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/env'
}, {
  lang: 'css', group: 'Funktionen', name: 'attr()',
  desc: 'Liest den Wert eines HTML-Attributs für `content` und (neuer) weitere Eigenschaften.',
  details: 'Klassisch nutzt man `attr()` in `content` bei Pseudo-Elementen, z. B. `content: attr(data-label)` oder `content: " (" attr(href) ")"` für Druck. Neuere Browser erlauben auch Typen in anderen Eigenschaften, z. B. `width: attr(data-w px)`; dafür unbedingt Unterstützung prüfen. Der Wert wird als Text eingesetzt und nicht als HTML interpretiert.',
  syntax: 'content: attr(data-label);',
  example: 'a[href^="http"]::after {\n  content: " (" attr(href) ")";\n  font-size: 0.8em;\n}\n\n.tag::before { content: attr(data-label) ": "; font-weight: 700; }',
  demo: '<style>.at::before{content:attr(data-label) ": ";font-weight:700;color:#b4367a}</style><p class="at" data-label="Status">Fertig</p>',
  keywords: ['attribut', 'data-attribute', 'content', 'tooltip', 'pseudo'],
  related: ['print (Medientyp)', 'url()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/attr'
}, {
  lang: 'css', group: 'Funktionen', name: 'url()',
  desc: 'Verweist auf eine externe Ressource (Bild, Font, Datei).',
  details: 'Wird bei `background-image`, `@font-face`, `cursor`, `mask` und `@import` genutzt. Anführungszeichen sind optional, aber bei Leerzeichen oder Sonderzeichen sinnvoll. Relative Pfade beziehen sich auf die CSS-Datei, nicht auf das HTML-Dokument. Auch Data-URIs sind möglich, z. B. für kleine SVGs.',
  syntax: 'background-image: url("bild.png");',
  example: '.hero {\n  background: url("/img/hero.jpg") center / cover no-repeat;\n}\n\n.icon {\n  background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\'%3E%3Ccircle cx=\'4\' cy=\'4\' r=\'3\' fill=\'%23b4367a\'/%3E%3C/svg%3E");\n}',
  keywords: ['bild', 'pfad', 'hintergrund', 'ressource', 'data-uri'],
  related: ['image-set()', '@font-face'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/url'
}, {
  lang: 'css', group: 'Funktionen', name: 'rgb()',
  desc: 'Farbe über Rot-, Grün- und Blauanteil (optional mit Transparenz).',
  details: 'Moderne Syntax: `rgb(180 54 122)` und `rgb(180 54 122 / 50%)` mit Leerzeichen und Schrägstrich für Alpha. Die alte Komma-Form `rgb(180, 54, 122)` und `rgba()` funktionieren weiterhin. Kanäle liegen zwischen 0 und 255 bzw. 0% und 100%.',
  syntax: 'color: rgb(R G B / Alpha);',
  values: [
    ['rgb(255 0 0)', 'Rot'],
    ['rgb(0 0 0 / 50%)', 'Schwarz, 50 % deckend'],
    ['rgb(100% 0% 0%)', 'Prozentangaben je Kanal']
  ],
  example: '.overlay { background: rgb(0 0 0 / 60%); }\n.btn { color: rgb(255 255 255); background: rgb(180 54 122); }',
  demo: '<style>.rg{display:inline-block;width:60px;height:60px;margin:4px;color:#fff;font-size:11px}</style><div class="rg" style="background:rgb(255 0 0)">rot</div><div class="rg" style="background:rgb(180 54 122)">pink</div><div class="rg" style="background:rgb(180 54 122 / 40%)">40%</div>',
  keywords: ['farbe', 'rgba', 'rot grün blau', 'alpha', 'transparenz'],
  related: ['hsl()', 'Hex-Farben (#rrggbb)', 'oklch()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value/rgb'
}, {
  lang: 'css', group: 'Funktionen', name: 'hsl()',
  desc: 'Farbe über Farbton, Sättigung und Helligkeit.',
  details: '`hsl(320 54% 46%)`: Der Farbton ist ein Winkel (0-360), Sättigung und Helligkeit sind Prozente. HSL ist intuitiv, um Varianten zu bauen (heller, dunkler, blasser). Fallstrick: Die wahrgenommene Helligkeit ist bei gleicher L-Angabe je nach Farbton unterschiedlich; für gleichmäßige Paletten ist `oklch()` besser.',
  syntax: 'color: hsl(H S% L% / Alpha);',
  example: ':root { --h: 320; }\n\n.btn        { background: hsl(var(--h) 54% 46%); }\n.btn:hover  { background: hsl(var(--h) 54% 36%); }\n.btn:active { background: hsl(var(--h) 54% 28% / 80%); }',
  demo: '<style>.hs{display:inline-block;width:50px;height:50px;margin:3px}</style><div class="hs" style="background:hsl(0 80% 50%)"></div><div class="hs" style="background:hsl(120 80% 40%)"></div><div class="hs" style="background:hsl(240 80% 55%)"></div><div class="hs" style="background:hsl(320 54% 46%)"></div>',
  keywords: ['farbe', 'hsla', 'farbton', 'sättigung', 'helligkeit', 'hue'],
  related: ['rgb()', 'hwb()', 'oklch()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value/hsl'
}, {
  lang: 'css', group: 'Funktionen', name: 'hwb()',
  desc: 'Farbe über Farbton, Weiß- und Schwarzanteil.',
  details: '`hwb(320 20% 30%)` mischt einen Farbton mit Weiß und Schwarz, ähnlich wie ein Maler Farbe abtönt. Sind Weiß und Schwarz zusammen 100 % oder mehr, ergibt sich ein Grauton. Das Modell ist intuitiv, wird aber weniger verbreitet genutzt als `hsl()`.',
  syntax: 'color: hwb(H W% B% / Alpha);',
  example: '.chip {\n  background: hwb(320 15% 20%);\n  border-color: hwb(320 0% 50%);\n}',
  demo: '<style>.hw{display:inline-block;width:50px;height:50px;margin:3px}</style><div class="hw" style="background:hwb(0 0% 0%)"></div><div class="hw" style="background:hwb(0 40% 0%)"></div><div class="hw" style="background:hwb(0 0% 40%)"></div><div class="hw" style="background:hwb(0 50% 50%)"></div>',
  keywords: ['farbe', 'whiteness', 'blackness', 'weiß', 'schwarz'],
  related: ['hsl()', 'rgb()', 'oklch()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value/hwb'
}, {
  lang: 'css', group: 'Funktionen', name: 'oklch()',
  desc: 'Wahrnehmungsgleichmäßige Farbe: Helligkeit, Chroma, Farbton.',
  details: '`oklch(60% 0.2 340)` besteht aus Helligkeit (0-100 %), Chroma (Farbintensität, etwa 0-0.4) und Farbton (Winkel). Gleiche L-Werte wirken tatsächlich gleich hell, daher ideal für Paletten und Kontrastsicherheit. Es deckt auch Farben jenseits von sRGB (Display P3) ab, Browser mappen sie bei Bedarf in den darstellbaren Bereich.',
  syntax: 'color: oklch(L C H / Alpha);',
  example: ':root {\n  --brand: oklch(60% 0.2 340);\n  --brand-light: oklch(85% 0.1 340);\n  --brand-dark: oklch(35% 0.12 340);\n}',
  demo: '<style>.ok{display:inline-block;width:50px;height:50px;margin:3px}</style><div class="ok" style="background:oklch(85% .1 340)"></div><div class="ok" style="background:oklch(70% .15 340)"></div><div class="ok" style="background:oklch(55% .2 340)"></div><div class="ok" style="background:oklch(35% .12 340)"></div>',
  tip: 'Perfekt für Farbskalen: nur L variieren, C und H festhalten.',
  keywords: ['farbe', 'oklab', 'wahrnehmung', 'palette', 'p3', 'wide gamut'],
  related: ['oklab()', 'lch()', 'color-mix()', 'hsl()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value/oklch'
}, {
  lang: 'css', group: 'Funktionen', name: 'oklab()',
  desc: 'Wahrnehmungsgleichmäßiger Farbraum mit Helligkeit und zwei Farbachsen.',
  details: '`oklab(L a b)`: `L` ist die Helligkeit, `a` die Achse grün-rot, `b` die Achse blau-gelb. Er eignet sich vor allem für das Mischen und Interpolieren von Farben ohne Graustich. Zum Gestalten von Paletten ist `oklch()` handlicher, weil es einen Farbtonwinkel nutzt.',
  syntax: 'color: oklab(L a b / Alpha);',
  example: '.a { color: oklab(60% 0.15 -0.05); }\n.b { background: color-mix(in oklab, #b4367a, #2a6); }',
  demo: '<style>.oa{display:inline-block;width:50px;height:50px;margin:3px}</style><div class="oa" style="background:oklab(70% 0.1 0.05)"></div><div class="oa" style="background:oklab(60% -0.1 0.1)"></div><div class="oa" style="background:oklab(55% 0.05 -0.15)"></div>',
  keywords: ['farbe', 'farbraum', 'lab', 'wahrnehmung', 'mischen'],
  related: ['oklch()', 'lab()', 'color-mix()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value/oklab'
}, {
  lang: 'css', group: 'Funktionen', name: 'lab()',
  desc: 'CIE-Lab-Farbe: Helligkeit plus zwei Farbachsen, geräteunabhängig.',
  details: '`lab(50% 40 -20)` beschreibt eine Farbe im CIE-Lab-Raum (D50-Weißpunkt). `L` reicht von 0 bis 100 %, `a` und `b` sind etwa -125 bis 125. Der Raum deckt alle sichtbaren Farben ab. Gegenüber `oklab()` ist die Wahrnehmungsgleichmäßigkeit etwas schlechter, vor allem bei Blau.',
  syntax: 'color: lab(L a b / Alpha);',
  example: '.accent { color: lab(50% 60 -10); }',
  demo: '<style>.lb{display:inline-block;width:50px;height:50px;margin:3px}</style><div class="lb" style="background:lab(70% 40 20)"></div><div class="lb" style="background:lab(50% -40 30)"></div><div class="lb" style="background:lab(40% 30 -50)"></div>',
  keywords: ['farbe', 'cie', 'farbraum', 'geräteunabhängig'],
  related: ['lch()', 'oklab()', 'color()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value/lab'
}, {
  lang: 'css', group: 'Funktionen', name: 'lch()',
  desc: 'CIE-LCH-Farbe: Helligkeit, Chroma und Farbton (zylindrisches Lab).',
  details: '`lch(50% 70 340)` ist die Winkel-Darstellung von `lab()`, analog zu `oklch()` bzw. `oklab()`. Das ist praktisch für Farbtonrotation und für Farben jenseits von sRGB. Für gleichmäßige Paletten bevorzugen viele `oklch()`, da LCH bei Blautönen zu Violett driftet.',
  syntax: 'color: lch(L C H / Alpha);',
  example: '.signal { background: lch(55% 80 30); }',
  demo: '<style>.lc{display:inline-block;width:50px;height:50px;margin:3px}</style><div class="lc" style="background:lch(70% 50 30)"></div><div class="lc" style="background:lch(70% 50 150)"></div><div class="lc" style="background:lch(70% 50 270)"></div>',
  keywords: ['farbe', 'chroma', 'hue', 'cie', 'farbraum'],
  related: ['lab()', 'oklch()', 'color()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value/lch'
}, {
  lang: 'css', group: 'Funktionen', name: 'color()',
  desc: 'Farbe in einem benannten Farbraum (display-p3, srgb, rec2020 ...).',
  details: '`color(display-p3 1 0.2 0.4)` greift auf Farbräume mit größerem Gamut als sRGB zu, die moderne Displays darstellen. Die Komponenten sind Zahlen von 0 bis 1. Zusätzlich gibt es `srgb-linear`, `a98-rgb`, `rec2020`, `xyz` u. a. Gib immer eine sRGB-Fallback-Zeile davor an.',
  syntax: 'color: color(<farbraum> c1 c2 c3 / Alpha);',
  example: '.vivid {\n  background: rgb(255 51 102);               /* Fallback */\n  background: color(display-p3 1 0.2 0.4);\n}',
  demo: '<style>.cp{display:inline-block;width:70px;height:50px;margin:3px;color:#fff;font-size:11px}</style><div class="cp" style="background:rgb(255 0 0)">sRGB</div><div class="cp" style="background:color(display-p3 1 0 0)">P3</div>',
  tip: 'Nur auf Wide-Gamut-Displays unterscheidet sich P3 sichtbar von sRGB.',
  keywords: ['display-p3', 'wide gamut', 'farbraum', 'srgb', 'rec2020'],
  related: ['oklch()', 'rgb()', '@supports'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value/color'
}, {
  lang: 'css', group: 'Funktionen', name: 'color-mix()',
  desc: 'Mischt zwei Farben in einem wählbaren Farbraum.',
  details: '`color-mix(in oklch, red 30%, blue)` mischt zwei Farben im angegebenen Farbraum; fehlende Prozentwerte werden aufgefüllt. So erzeugst du Hover-Farben, Tints und Shades direkt aus Variablen. Der Farbraum beeinflusst das Ergebnis stark; `oklab`/`oklch` liefern meist natürlichere Mischungen als `srgb`.',
  syntax: 'color: color-mix(in <farbraum>, <farbe> <p>%, <farbe> <p>%);',
  example: ':root { --brand: #b4367a; }\n\n.btn { background: var(--brand); }\n.btn:hover {\n  background: color-mix(in oklab, var(--brand), black 20%);\n}\n.tint { background: color-mix(in srgb, var(--brand) 15%, white); }',
  demo: '<style>.cm{display:inline-block;width:60px;height:50px;margin:3px;color:#fff;font-size:11px}</style><div class="cm" style="background:color-mix(in srgb,#b4367a 100%,white)">0%</div><div class="cm" style="background:color-mix(in srgb,#b4367a,white 40%)">40%</div><div class="cm" style="background:color-mix(in srgb,#b4367a,white 70%);color:#222">70%</div>',
  keywords: ['mischen', 'farbmischung', 'tint', 'shade', 'abdunkeln', 'aufhellen'],
  related: ['oklch()', 'var()', 'light-dark()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value/color-mix'
}, {
  lang: 'css', group: 'Funktionen', name: 'light-dark()',
  desc: 'Wählt je nach Farbschema den ersten (hell) oder zweiten (dunkel) Wert.',
  details: '`light-dark(#111, #eee)` liefert die erste Farbe im hellen und die zweite im dunklen Schema. Voraussetzung ist `color-scheme: light dark` auf dem Element oder einem Vorfahren. So sparst du Media Queries für `prefers-color-scheme`.',
  syntax: 'color: light-dark(<farbe-hell>, <farbe-dunkel>);',
  example: ':root { color-scheme: light dark; }\n\nbody {\n  background: light-dark(#ffffff, #121212);\n  color: light-dark(#222222, #eeeeee);\n}',
  demo: '<style>:root{color-scheme:light dark}.ld{padding:12px;border-radius:8px;background:light-dark(#fff3c4,#1e2538);color:light-dark(#332,#fff)}</style><div class="ld">Passt sich dem Systemschema an</div>',
  keywords: ['dark mode', 'dunkelmodus', 'hell dunkel', 'theme', 'color-scheme'],
  related: ['prefers-color-scheme', 'color-mix()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value/light-dark'
}, {
  lang: 'css', group: 'Funktionen', name: 'linear-gradient()',
  desc: 'Linearer Farbverlauf entlang einer Richtung.',
  details: 'Die Richtung gibst du als Winkel (`45deg`) oder per Schlüsselwort (`to right`) an, danach folgen Farbstopps mit optionalen Positionen. Das Ergebnis ist ein Bild, das du bei `background`/`background-image` verwendest (nicht bei `background-color`). Harte Kanten erzeugst du, indem zwei Stopps an derselben Position stehen.',
  syntax: 'background: linear-gradient(<richtung>, <farbe> <pos>, <farbe> <pos>);',
  example: '.hero {\n  background: linear-gradient(135deg, #b4367a 0%, #3a2a7a 100%);\n}\n\n.stripe {\n  background: linear-gradient(to right, #b4367a 50%, #eee 50%);\n}',
  demo: '<style>.lg{height:60px;border-radius:8px;margin:4px 0}</style><div class="lg" style="background:linear-gradient(135deg,#b4367a,#3a2a7a)"></div><div class="lg" style="background:linear-gradient(to right,#b4367a 50%,#eee 50%)"></div>',
  keywords: ['farbverlauf', 'gradient', 'verlauf', 'hintergrund'],
  related: ['radial-gradient()', 'conic-gradient()', 'repeating-linear-gradient()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/gradient/linear-gradient'
}, {
  lang: 'css', group: 'Funktionen', name: 'radial-gradient()',
  desc: 'Kreisförmiger oder elliptischer Farbverlauf von einem Mittelpunkt aus.',
  details: 'Mit Form (`circle`/`ellipse`), Größe (`closest-side`, `farthest-corner` ...) und Position (`at 30% 40%`) steuerst du den Verlauf. Typisch für Spotlights, Glanzlichter und weiche Hintergründe. Wie alle Verläufe gehört er in `background-image`.',
  syntax: 'background: radial-gradient(<form> <größe> at <position>, <farbe>, <farbe>);',
  example: '.spot {\n  background: radial-gradient(circle at 30% 30%, #fff, #b4367a 60%, #3a2a7a);\n}',
  demo: '<style>.rd{height:90px;border-radius:8px;background:radial-gradient(circle at 30% 30%,#fff,#b4367a 60%,#3a2a7a)}</style><div class="rd"></div>',
  keywords: ['farbverlauf', 'gradient', 'kreis', 'spotlight', 'radial'],
  related: ['linear-gradient()', 'conic-gradient()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/gradient/radial-gradient'
}, {
  lang: 'css', group: 'Funktionen', name: 'conic-gradient()',
  desc: 'Kegelförmiger Farbverlauf, der sich um einen Mittelpunkt dreht.',
  details: 'Farben verlaufen entlang eines Winkels um den Mittelpunkt, ideal für Farbräder und Tortendiagramme. Mit Winkelangaben als Stopps (`#b4367a 0 25%`) entstehen harte Segmente. `from 45deg` dreht den Start, `at x y` verschiebt den Mittelpunkt.',
  syntax: 'background: conic-gradient(from <winkel> at <position>, <farbe> <winkel>, ...);',
  example: '.pie {\n  width: 120px;\n  aspect-ratio: 1;\n  border-radius: 50%;\n  background: conic-gradient(#b4367a 0 40%, #3a2a7a 0 70%, #eee 0);\n}',
  demo: '<style>.cg{width:100px;height:100px;border-radius:50%;display:inline-block;margin:4px}</style><div class="cg" style="background:conic-gradient(#b4367a 0 40%,#3a2a7a 0 70%,#eee 0)"></div><div class="cg" style="background:conic-gradient(red,yellow,lime,aqua,blue,magenta,red)"></div>',
  keywords: ['farbverlauf', 'tortendiagramm', 'farbrad', 'kegel', 'conic'],
  related: ['linear-gradient()', 'radial-gradient()', '@property'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/gradient/conic-gradient'
}, {
  lang: 'css', group: 'Funktionen', name: 'repeating-linear-gradient()',
  desc: 'Linearer Verlauf, dessen Muster sich wiederholt (Streifen).',
  details: 'Funktioniert wie `linear-gradient()`, wiederholt aber die Folge der Farbstopps bis zum Rand. Die Länge einer Wiederholung ergibt sich aus der Position des letzten Stopps. Ideal für Streifen, Warnmuster oder Fortschrittsbalken. Es gibt auch `repeating-radial-gradient()` und `repeating-conic-gradient()`.',
  syntax: 'background: repeating-linear-gradient(<winkel>, <farbe> 0 10px, <farbe> 10px 20px);',
  example: '.warn {\n  background: repeating-linear-gradient(\n    45deg,\n    #ffcc00 0 10px,\n    #222 10px 20px\n  );\n}',
  demo: '<style>.rl{height:50px;border-radius:6px;background:repeating-linear-gradient(45deg,#ffcc00 0 10px,#222 10px 20px)}</style><div class="rl"></div>',
  keywords: ['streifen', 'muster', 'wiederholen', 'gradient', 'stripes'],
  related: ['linear-gradient()', 'radial-gradient()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/gradient/repeating-linear-gradient'
}, {
  lang: 'css', group: 'Funktionen', name: 'image-set()',
  desc: 'Wählt je nach Pixeldichte oder Format die passende Bilddatei.',
  details: '`image-set()` liefert Alternativen für unterschiedliche Auflösungen (`1x`, `2x`) oder Formate (`type("image/avif")`) bei CSS-Bildern, also Hintergründen, `list-style-image` oder `border-image`. Der Browser wählt die passende Datei. Für `<img>` verwendest du stattdessen `srcset` und `<picture>`.',
  syntax: 'background-image: image-set(url("a.png") 1x, url("a@2x.png") 2x);',
  example: '.logo {\n  background-image: image-set(\n    url("logo.avif") type("image/avif") 1x,\n    url("logo.png") 1x,\n    url("logo@2x.png") 2x\n  );\n}',
  keywords: ['retina', 'responsive images', 'srcset', 'avif', 'hintergrundbild'],
  related: ['url()', 'resolution', 'dpi / dppx'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/image/image-set'
}, {
  lang: 'css', group: 'Funktionen', name: 'counter()',
  desc: 'Gibt den aktuellen Wert eines CSS-Zählers als Text aus.',
  details: 'Zusammen mit `counter-reset` und `counter-increment` nummerierst du Elemente automatisch, etwa Überschriften oder Figuren, und zeigst die Zahl per `content: counter(name)` an. Optional kannst du einen Zählstil angeben: `counter(name, upper-roman)`. Die Anzeige funktioniert nur in `content`.',
  syntax: 'content: counter(<name>, <stil>);',
  example: 'body { counter-reset: kapitel; }\n\nh2::before {\n  counter-increment: kapitel;\n  content: "Kapitel " counter(kapitel) ": ";\n  color: #b4367a;\n}',
  demo: '<style>.cn{counter-reset:k}.cn h4{margin:4px 0}.cn h4::before{counter-increment:k;content:"Kapitel " counter(k, upper-roman) ": ";color:#b4367a}</style><div class="cn"><h4>Einleitung</h4><h4>Hauptteil</h4><h4>Schluss</h4></div>',
  keywords: ['zähler', 'nummerierung', 'counter-increment', 'counter-reset', 'content'],
  related: ['counters()', '@counter-style'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/counter'
}, {
  lang: 'css', group: 'Funktionen', name: 'counters()',
  desc: 'Gibt verschachtelte Zähler mit Trennzeichen aus (1.2.3).',
  details: '`counters(name, ".")` verkettet die Zählerstände aller Verschachtelungsebenen, z. B. `1.2.1` für Gliederungen. Dafür muss `counter-reset` in jeder Ebene (z. B. in verschachtelten `ol`) neue Zähler mit demselben Namen anlegen. Wie `counter()` funktioniert es in `content`.',
  syntax: 'content: counters(<name>, "<trenner>", <stil>);',
  example: 'ol { counter-reset: n; list-style: none; }\nli { counter-increment: n; }\nli::before { content: counters(n, ".") " "; }',
  demo: '<style>.cs ol{counter-reset:n;list-style:none;padding-left:16px;margin:2px 0}.cs li{counter-increment:n}.cs li::before{content:counters(n,".") " ";color:#b4367a;font-weight:700}</style><div class="cs"><ol><li>Eins<ol><li>Unterpunkt</li><li>Unterpunkt</li></ol></li><li>Zwei</li></ol></div>',
  keywords: ['gliederung', 'verschachtelt', 'nummerierung', 'zähler'],
  related: ['counter()', '@counter-style'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/counters'
}, {
  lang: 'css', group: 'Funktionen', name: 'cubic-bezier()',
  desc: 'Eigene Beschleunigungskurve für Transitions und Animationen.',
  details: '`cubic-bezier(x1, y1, x2, y2)` definiert die Kurve mit zwei Kontrollpunkten; x-Werte müssen zwischen 0 und 1 liegen, y-Werte dürfen darüber hinausgehen (Überschwingen). Schlüsselwörter wie `ease`, `ease-in`, `ease-out` sind Spezialfälle. Für federnde Effekte kommt auch `linear()` mit mehreren Stützpunkten infrage.',
  syntax: 'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);',
  values: [
    ['ease', 'cubic-bezier(0.25, 0.1, 0.25, 1)'],
    ['ease-in', 'cubic-bezier(0.42, 0, 1, 1)'],
    ['ease-out', 'cubic-bezier(0, 0, 0.58, 1)'],
    ['ease-in-out', 'cubic-bezier(0.42, 0, 0.58, 1)']
  ],
  example: '.panel {\n  transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n.panel.open { transform: translateX(0); }',
  demo: '<style>.cb{height:24px;width:30px;margin:6px 0;background:#b4367a;transition:width 1.2s}.cbw:hover .cb{width:200px}.cb1{transition-timing-function:linear}.cb2{transition-timing-function:cubic-bezier(.34,1.56,.64,1)}</style><div class="cbw">Maus darüber (oben linear, unten Überschwingen):<div class="cb cb1"></div><div class="cb cb2"></div></div>',
  keywords: ['timing', 'easing', 'beschleunigung', 'kurve', 'bezier'],
  related: ['steps()', '@keyframes', 's / ms'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/easing-function#cubic-bezier'
}, {
  lang: 'css', group: 'Funktionen', name: 'steps()',
  desc: 'Stufenweise statt fließende Animation (Sprites, Typewriter).',
  details: '`steps(n, position)` teilt die Animation in `n` gleich lange Schritte ohne Zwischenwerte. `position` bestimmt, ob der Sprung am Anfang (`jump-start`) oder Ende (`jump-end`, Standard) jedes Intervalls erfolgt. Typische Anwendungen: Sprite-Animationen, Schreibmaschinen-Effekt, Ziffernanzeigen.',
  syntax: 'animation-timing-function: steps(8, end);',
  values: [
    ['jump-end / end', 'Sprung am Ende jedes Schritts (Standard)'],
    ['jump-start / start', 'Sprung am Anfang jedes Schritts'],
    ['jump-none', 'Kein Sprung an den Rändern'],
    ['jump-both', 'Sprung an Anfang und Ende']
  ],
  example: '.typewriter {\n  width: 20ch;\n  overflow: hidden;\n  white-space: nowrap;\n  border-right: 2px solid;\n  animation: type 3s steps(20) forwards;\n}\n@keyframes type { from { width: 0; } }',
  demo: '<style>@keyframes ty{from{width:0}to{width:20ch}}.tw{font-family:monospace;width:20ch;overflow:hidden;white-space:nowrap;border-right:2px solid #b4367a;animation:ty 3s steps(20) infinite}</style><div class="tw">Hallo, Schreibmaschine!</div>',
  keywords: ['sprite', 'stufen', 'schritte', 'typewriter', 'timing'],
  related: ['cubic-bezier()', '@keyframes'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/easing-function#steps'
}, {
  lang: 'css', group: 'Funktionen', name: 'round()',
  desc: 'Rundet einen Wert auf ein Vielfaches einer Schrittweite.',
  details: '`round(Strategie, Wert, Schrittweite)` rundet auf das nächste Vielfache, z. B. `round(up, 17px, 8px)` ergibt `24px`. Strategien: `nearest` (Standard), `up`, `down`, `to-zero`. Nützlich für Raster-Abstände und Pixel-Snapping. Wird in einer Berechnung wie `calc()` häufig mit `vw` oder `%` kombiniert.',
  syntax: 'width: round(nearest, 100%, 8px);',
  values: [
    ['nearest', 'Zum nächsten Vielfachen (Standard)'],
    ['up', 'Aufrunden'],
    ['down', 'Abrunden'],
    ['to-zero', 'Richtung Null runden']
  ],
  example: '.col {\n  width: round(down, 100%, 100px);  /* ganzzahlige 100px-Schritte */\n  padding: round(up, 1.3rem, 0.5rem);\n}',
  keywords: ['runden', 'raster', 'schrittweite', 'mathe'],
  related: ['mod()', 'calc()', 'abs()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/round'
}, {
  lang: 'css', group: 'Funktionen', name: 'mod()',
  desc: 'Modulo: Rest einer Division mit dem Vorzeichen des Divisors.',
  details: '`mod(a, b)` liefert den Rest von `a / b`, wobei das Ergebnis dasselbe Vorzeichen wie `b` hat (anders als `rem()`). Beide Werte müssen denselben Typ haben, z. B. beide Winkel oder beide Längen. Praktisch für Winkel-Wraparound: `mod(370deg, 360deg)` ergibt `10deg`.',
  syntax: 'rotate: mod(var(--w), 360deg);',
  example: '.hand {\n  transform: rotate(mod(var(--angle), 360deg));\n}',
  keywords: ['modulo', 'rest', 'division', 'winkel', 'mathe'],
  related: ['round()', 'calc()', 'sign()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/mod'
}, {
  lang: 'css', group: 'Funktionen', name: 'abs()',
  desc: 'Liefert den Betrag (Absolutwert) eines Wertes.',
  details: '`abs(-20px)` ergibt `20px`. Besonders nützlich mit Variablen, deren Vorzeichen offen ist, z. B. Abstände zu einem Ziel. Die Funktion arbeitet mit Zahlen, Längen, Winkeln und Prozenten.',
  syntax: 'width: abs(var(--delta));',
  example: ':root { --delta: -12px; }\n\n.shift {\n  padding-left: abs(var(--delta));\n}',
  keywords: ['betrag', 'absolut', 'vorzeichen', 'mathe'],
  related: ['sign()', 'round()', 'calc()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/abs'
}, {
  lang: 'css', group: 'Funktionen', name: 'sign()',
  desc: 'Gibt das Vorzeichen eines Wertes zurück: -1, 0 oder 1.',
  details: '`sign(-5px)` ergibt `-1`, `sign(0px)` ergibt `0`, `sign(8px)` ergibt `1`. Das Ergebnis ist eine reine Zahl, die du multiplizieren kannst, um Richtungen umzukehren oder Werte zu normalisieren. Oft in Kombination mit `abs()` und `calc()` eingesetzt.',
  syntax: 'z-index: sign(var(--offset));',
  example: '.item {\n  --dir: sign(var(--x));\n  transform: translateX(calc(var(--dir) * 10px));\n}',
  keywords: ['vorzeichen', 'signum', 'richtung', 'mathe'],
  related: ['abs()', 'mod()', 'calc()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/sign'
}, {
  lang: 'css', group: 'Funktionen', name: 'sqrt() / pow()',
  desc: 'Mathematische Funktionen für Wurzel und Potenz (auch hypot, log, exp).',
  details: '`sqrt(16)` ergibt `4`, `pow(2, 3)` ergibt `8`. Die Argumente müssen reine Zahlen sein. Dazu kommen `hypot()`, `log()`, `exp()` sowie trigonometrische Funktionen wie `sin()`, `cos()` und `tan()`. Sinnvoll für Kreisanordnungen und nichtlineare Abstufungen.',
  syntax: 'width: calc(pow(2, var(--n)) * 1px);',
  example: '.dot {\n  --n: 3;\n  width: calc(pow(2, var(--n)) * 1rem);   /* 8rem */\n  --r: 100px;\n  translate: calc(cos(30deg) * var(--r)) calc(sin(30deg) * var(--r));\n}',
  keywords: ['wurzel', 'potenz', 'trigonometrie', 'sin', 'cos', 'mathe'],
  related: ['calc()', 'round()', 'abs()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/sqrt'
});

window.CHEAT.push({
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'Custom Properties (--name)',
  desc: 'Eigene CSS-Variablen, die per `var()` überall wiederverwendbar sind.',
  details: 'Mit `--name: wert;` definierst du einen Wert, der vererbt wird und per `var(--name)` abrufbar ist. Üblich ist die Deklaration auf `:root` (global) oder auf einer Komponente (lokal überschreibbar). Anders als bei Präprozessor-Variablen sind sie zur Laufzeit änderbar, auch per JavaScript. Namen sind case-sensitive: `--Farbe` und `--farbe` sind verschieden.',
  syntax: '--name: wert;\nproperty: var(--name, fallback);',
  example: ':root {\n  --brand: #b4367a;\n  --radius: 8px;\n  --space: 1rem;\n}\n\n.card {\n  border-radius: var(--radius);\n  padding: var(--space);\n  border: 2px solid var(--brand);\n}\n\n.card.compact { --space: 0.5rem; }',
  demo: '<style>.cp{--brand:#b4367a;--space:12px;border:2px solid var(--brand);padding:var(--space);border-radius:8px;margin:6px 0;color:#223}.cp.compact{--space:4px;--brand:#2a6}</style><div class="cp">Normal</div><div class="cp compact">Kompakt (Variablen überschrieben)</div>',
  tip: 'Registriere typisierte Variablen mit `@property`, um sie animieren zu können.',
  keywords: ['variable', 'css variables', 'token', 'theme', 'design tokens', 'var'],
  related: ['var()', '@property', 'inherit'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/--*'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'inherit',
  desc: 'Erzwingt die Übernahme des Wertes vom Elternelement.',
  details: '`inherit` holt den berechneten Wert der Eigenschaft vom Elternelement, auch bei nicht vererbbaren Eigenschaften wie `border` oder `background`. Praktisch, um z. B. Links die Textfarbe der Umgebung nehmen zu lassen. Gilt für jede CSS-Eigenschaft.',
  syntax: 'property: inherit;',
  example: 'a { color: inherit; text-decoration: inherit; }\n\nbutton, input, select, textarea {\n  font: inherit;\n}',
  demo: '<style>.ih{color:#b4367a;border:2px solid #b4367a;padding:6px}.ih span{border:inherit;color:inherit;padding:2px 6px}</style><div class="ih">Eltern<span>Kind erbt Rahmen und Farbe</span></div>',
  keywords: ['erben', 'vererbung', 'elternelement', 'global keyword'],
  related: ['initial', 'unset', 'revert'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/inherit'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'initial',
  desc: 'Setzt eine Eigenschaft auf ihren Standardwert laut CSS-Spezifikation.',
  details: '`initial` ignoriert das Browser-Stylesheet: Für `display` ergibt es `inline`, auch bei einem `<div>`. Das ist meist nicht gewünscht. Wenn du den Browser-Standard des Elements zurückhaben willst, nutze `revert`; für "erben oder initial" je nach Eigenschaft `unset`.',
  syntax: 'property: initial;',
  example: '.reset-color { color: initial; }   /* meist schwarz, nicht die Umgebungsfarbe */\n\ndiv.inline { display: initial; }   /* wird inline, nicht block */',
  tip: '`all: initial` setzt alle Eigenschaften zurück, sinnvoll für isolierte Widgets.',
  keywords: ['zurücksetzen', 'standardwert', 'reset', 'default'],
  related: ['unset', 'revert', 'inherit'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/initial'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'unset',
  desc: 'Erbt bei vererbbaren Eigenschaften, sonst wird `initial` verwendet.',
  details: '`unset` wirkt wie `inherit`, wenn die Eigenschaft von Natur aus vererbt wird (z. B. `color`), und wie `initial`, wenn nicht (z. B. `border`). Praktisch zum gezielten Entfernen von Regeln, ohne den Typ der Eigenschaft kennen zu müssen. `all: unset` entfernt alle gesetzten Styles, auch die des Browsers.',
  syntax: 'property: unset;',
  example: 'button.plain {\n  all: unset;\n  cursor: pointer;\n}\n\n.child { color: unset; }   /* erbt */\n.child { margin: unset; }  /* initial = 0 */',
  keywords: ['zurücksetzen', 'entfernen', 'all', 'reset'],
  related: ['initial', 'inherit', 'revert', 'revert-layer'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/unset'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'revert',
  desc: 'Setzt auf den Wert des Browser- bzw. Nutzer-Stylesheets zurück.',
  details: '`revert` verwirft alle Autoren-Styles der Eigenschaft und fällt auf den Browser-Standard zurück: ein `<div>` ist danach wieder `block`, ein `<li>` wieder `list-item`. Das ist genau das, was man meist meint, wenn man "zurücksetzen" sagt. Gegenüber `initial` bleibt also die Semantik des Elements erhalten.',
  syntax: 'property: revert;',
  example: '.content ul, .content ol {\n  list-style: revert;\n  margin: revert;\n  padding: revert;\n}',
  keywords: ['zurücksetzen', 'browser-standard', 'user agent', 'reset'],
  related: ['revert-layer', 'initial', 'unset'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/revert'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'revert-layer',
  desc: 'Setzt auf den Wert der vorherigen Cascade Layer zurück.',
  details: '`revert-layer` entfernt die Wirkung der aktuellen Cascade Layer für diese Eigenschaft, sodass der Wert aus einer früheren Layer greift. So kannst du Overrides in einer Layer wieder "aufheben", ohne den Wert zu kennen. Ohne Layer verhält es sich wie `revert`.',
  syntax: 'property: revert-layer;',
  example: '@layer base, theme;\n\n@layer base {\n  a { color: blue; }\n}\n\n@layer theme {\n  .plain a { color: revert-layer; }  /* zurück zu blue */\n}',
  keywords: ['layer', 'cascade layers', 'zurücksetzen'],
  related: ['@layer', 'revert', 'unset'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/revert-layer'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'currentColor',
  desc: 'Verweist auf den aktuellen Wert der Eigenschaft `color`.',
  details: 'Das Schlüsselwort nimmt die Textfarbe des Elements und eignet sich für Rahmen, Schatten, SVG-Füllungen und Icons, die sich automatisch mitfärben sollen. Ändert sich `color` (z. B. bei Hover), ziehen alle davon abhängigen Werte mit. Bei Rahmen ist es der Standardwert für `border-color`.',
  syntax: 'border-color: currentColor;',
  example: '.btn {\n  color: #b4367a;\n  border: 2px solid currentColor;\n}\n.btn:hover { color: #3a2a7a; }\n\nsvg { fill: currentColor; }',
  demo: '<style>.cc{display:inline-block;color:#b4367a;border:3px solid currentColor;padding:8px 14px;border-radius:6px;box-shadow:0 3px 0 currentColor}.cc:hover{color:#2a6}</style><span class="cc">Hover: alles ändert sich</span>',
  keywords: ['textfarbe', 'color', 'svg', 'icon', 'rahmenfarbe'],
  related: ['transparent', 'Benannte Farben'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/color_value#currentcolor_keyword'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'transparent',
  desc: 'Vollständig durchsichtige Farbe (`rgb(0 0 0 / 0)`).',
  details: '`transparent` ist eine Farbe mit Alpha 0 und gilt in modernen Browsern als vorberechnet, Übergänge dorthin sind daher fließend. Häufig bei `border-color` und `background`, etwa für unsichtbare Rahmen, die Platz reservieren. Fallstrick: Das Element bleibt klickbar, nur seine Darstellung ist durchsichtig.',
  syntax: 'background: transparent;',
  example: '.btn {\n  border: 2px solid transparent;\n  background: transparent;\n}\n.btn:focus-visible { border-color: #b4367a; }',
  demo: '<style>.tr{background:repeating-conic-gradient(#ddd 0 25%,#fff 0 50%) 0 0/16px 16px;padding:8px}.tr div{display:inline-block;width:60px;height:40px;margin:3px;border:3px solid #b4367a}</style><div class="tr"><div style="background:transparent"></div><div style="background:#b4367a80"></div><div style="background:#b4367a"></div></div>',
  keywords: ['durchsichtig', 'unsichtbar', 'alpha', 'rahmen'],
  related: ['currentColor', 'rgb()', 'Benannte Farben'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/named-color#transparent'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'auto',
  desc: 'Der Browser berechnet den Wert selbst (Größe, Abstand, Platzierung).',
  details: '`auto` hat je nach Eigenschaft eine andere Bedeutung: Bei `width` füllt ein Blockelement den Container, bei `height` richtet sich die Höhe nach dem Inhalt. Bei `margin-inline: auto` wird ein Element mit definierter Breite zentriert; bei Flex-Items schiebt `margin-left: auto` Elemente an den Rand. Bei `overflow` bedeutet es Scrollbalken nur bei Bedarf.',
  syntax: 'margin: 0 auto;\nwidth: auto;',
  values: [
    ['margin-inline: auto', 'Zentriert Elemente mit fester Breite'],
    ['width / height: auto', 'Größe aus Inhalt bzw. Container'],
    ['z-index / overflow: auto', 'Standardverhalten des Browsers'],
    ['grid-template-columns: auto', 'Spalte passt sich dem Inhalt an']
  ],
  example: '.container {\n  max-width: 60rem;\n  margin-inline: auto;\n}\n\n.nav .logout { margin-left: auto; }   /* im Flex-Container ganz nach rechts */\n\nimg { height: auto; }',
  demo: '<style>.au{display:flex;background:#eef;padding:6px;gap:6px}.au span{background:#b4367a;color:#fff;padding:6px 10px}.au .r{margin-left:auto}</style><div class="au"><span>Logo</span><span>Home</span><span class="r">Login</span></div>',
  keywords: ['automatisch', 'zentrieren', 'margin auto', 'standard'],
  related: ['none', 'initial'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/auto'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'none',
  desc: 'Schlüsselwort für "kein Wert" (kein Rahmen, keine Anzeige, kein Bild).',
  details: '`none` schaltet eine Funktion ab: `display: none` entfernt das Element samt Platz aus dem Layout (und aus dem Accessibility-Tree), `border: none` entfernt den Rahmen, `background-image: none` das Bild, `text-decoration: none` die Unterstreichung. Fallstrick: `display: none` blendet Inhalte auch für Screenreader aus; `visibility: hidden` behält den Platz.',
  syntax: 'display: none;\nborder: none;',
  example: '.hidden { display: none; }\na { text-decoration: none; }\nul.clean { list-style: none; padding: 0; }\n.card { box-shadow: none; }',
  demo: '<style>.nn span{display:inline-block;padding:6px 10px;margin:3px;background:#b4367a;color:#fff}</style><div class="nn"><span>sichtbar</span><span style="display:none">weg</span><span>sichtbar</span></div>',
  keywords: ['ausblenden', 'entfernen', 'nichts', 'display none', 'verstecken'],
  related: ['auto', 'initial'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/display#none'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'Benannte Farben',
  desc: 'Vordefinierte Farbnamen wie `red`, `rebeccapurple` oder `tomato`.',
  details: 'CSS kennt rund 148 Farbnamen (`navy`, `teal`, `coral`, `gold`, `hotpink` usw.), unabhängig von Groß-/Kleinschreibung. Gut für schnelle Prototypen und Debug-Rahmen. Für ein konsistentes Design sind eigene Farben per Custom Property und `oklch()`/`hsl()` meist besser. Auch `transparent` und `currentColor` zählen dazu.',
  syntax: 'color: rebeccapurple;',
  values: [
    ['red / green / blue', 'Grundfarben'],
    ['black / white / gray', 'Unbunte Farben (gray = grey)'],
    ['rebeccapurple', '#663399'],
    ['tomato / coral / gold', 'Weitere Beispiele'],
    ['transparent', 'Vollständig durchsichtig']
  ],
  example: '* { outline: 1px solid tomato; }  /* Debug-Rahmen */\n\nh1 { color: rebeccapurple; }\n.warn { background: gold; color: black; }',
  demo: '<style>.nf{display:inline-block;width:68px;height:40px;margin:3px;color:#fff;font-size:10px;text-shadow:0 0 3px #000;padding:2px;box-sizing:border-box}</style><div class="nf" style="background:tomato">tomato</div><div class="nf" style="background:rebeccapurple">rebecca-<br>purple</div><div class="nf" style="background:teal">teal</div><div class="nf" style="background:gold">gold</div><div class="nf" style="background:hotpink">hotpink</div><div class="nf" style="background:navy">navy</div>',
  keywords: ['farbnamen', 'named colors', 'schlüsselwort', 'rot', 'blau', 'x11'],
  related: ['Hex-Farben (#rrggbb)', 'rgb()', 'currentColor', 'transparent'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/named-color'
}, {
  lang: 'css', group: 'Variablen & Schlüsselwörter', name: 'Hex-Farben (#rrggbb)',
  desc: 'Farbangabe in hexadezimaler Schreibweise, mit optionaler Transparenz.',
  details: 'Die Formen `#rgb`, `#rrggbb`, `#rgba` und `#rrggbbaa` stehen für Rot, Grün, Blau und Alpha mit je 00-ff (0-255). `#f00` ist die Kurzform von `#ff0000`, `#b4367a80` ist 50 % deckend. Hex ist kompakt und weit verbreitet, aber schlecht lesbar zum Anpassen von Helligkeit; dafür sind `hsl()` und `oklch()` besser.',
  syntax: 'color: #rrggbb;\ncolor: #rrggbbaa;',
  values: [
    ['#rgb', 'Kurzform, jede Ziffer wird verdoppelt (#f0a = #ff00aa)'],
    ['#rrggbb', 'Standard: 2 Stellen je Kanal'],
    ['#rgba', 'Kurzform mit Alpha'],
    ['#rrggbbaa', 'Mit Alpha (ff = voll deckend, 80 = ca. 50 %)']
  ],
  example: '.btn {\n  background: #b4367a;\n  color: #fff;\n  border: 1px solid #b4367a80;   /* 50 % transparent */\n}',
  demo: '<style>.hx{display:inline-block;width:70px;height:46px;margin:3px;color:#fff;font-size:10px;padding:2px;box-sizing:border-box}</style><div class="hx" style="background:#b4367a">#b4367a</div><div class="hx" style="background:#f0a">#f0a</div><div class="hx" style="background:#b4367a80">#b4367a80</div><div class="hx" style="background:#2a6">#2a6</div>',
  keywords: ['hexadezimal', 'farbcode', 'hex', 'rgb', 'html color'],
  related: ['rgb()', 'hsl()', 'Benannte Farben'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/hex-color'
});
