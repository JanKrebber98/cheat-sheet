window.CHEAT = window.CHEAT || [];
window.CHEAT.push(
{
  lang: 'html', group: 'Globale Attribute', name: 'id',
  desc: 'Eindeutige Kennung eines Elements im Dokument.',
  details: 'Darf pro Dokument nur einmal vorkommen und dient als Sprungziel (`#id`), für CSS-Selektoren (`#id`), `label for`, ARIA-Verweise und `document.getElementById()`. Erlaubt sind alle Zeichen außer Leerzeichen; für CSS-Selektoren sollte sie nicht mit einer Ziffer beginnen. Doppelte IDs sind ein häufiger Fehler und brechen Anker und Barrierefreiheit.',
  example: '<h2 id="kontakt">Kontakt</h2>\n<a href="#kontakt">Zum Kontakt springen</a>',
  keywords: ['kennung', 'anker', 'identifier', 'eindeutig'],
  related: ['class', 'href', 'for'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/id'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'class',
  desc: 'Eine oder mehrere durch Leerzeichen getrennte Klassen zur Gruppierung von Elementen.',
  details: 'Klassen sind der wichtigste Haken für CSS (`.klasse`) und JavaScript (`querySelectorAll`, `classList`). Ein Element kann beliebig viele Klassen tragen, eine Klasse beliebig vielen Elementen zugewiesen werden. Klassennamen sind case-sensitiv; sprechende Namen (was ist es, nicht wie sieht es aus) sind besser wartbar.',
  example: '<button class="btn btn-primary btn-large">Senden</button>',
  demo: '<style>.a{color:#fff;background:#b4367a;padding:6px 12px;border-radius:6px}.b{font-weight:bold}</style><span class="a b">Zwei Klassen</span>',
  keywords: ['klasse', 'css', 'selektor', 'classlist'],
  related: ['id', 'style'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/class'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'style',
  desc: 'Inline-CSS-Deklarationen direkt am Element.',
  details: 'Enthält CSS-Deklarationen ohne Selektor, getrennt durch Semikolon. Inline-Styles haben hohe Spezifität und lassen sich schwer überschreiben; außerdem können sie durch eine strikte Content-Security-Policy blockiert werden. Besser sind Klassen in einem Stylesheet – Inline-Styles eignen sich für dynamisch berechnete Werte, etwa CSS-Variablen.',
  example: '<p style="color: crimson; font-weight: bold;">Achtung</p>',
  demo: '<p style="color:crimson;font-weight:bold">Achtung</p>',
  keywords: ['inline', 'css', 'stil'],
  related: ['class'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/style'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'title',
  desc: 'Zusätzliche Information zum Element, meist als Tooltip.',
  details: 'Der Browser zeigt den Text beim Überfahren mit der Maus als Tooltip an. Auf Touchgeräten und per Tastatur ist er kaum erreichbar, daher dürfen wichtige Informationen nie nur im `title` stehen. Bei `<abbr>` liefert er die Auflösung, bei `<iframe>` einen zugänglichen Namen; bei `<input>` ersetzt er kein `<label>`.',
  example: '<abbr title="HyperText Markup Language">HTML</abbr>',
  demo: '<abbr title="HyperText Markup Language">HTML</abbr> (mit der Maus darüberfahren)',
  keywords: ['tooltip', 'hinweis', 'quickinfo'],
  related: ['aria-label', 'aria-describedby'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/title'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'lang',
  desc: 'Legt die Sprache des Elementinhalts fest (BCP-47-Code).',
  details: 'Wird üblicherweise am `<html>`-Element gesetzt (`lang="de"`) und gilt für alle Nachkommen; für fremdsprachige Passagen überschreibt man es lokal. Screenreader wählen danach die Aussprache, Browser Silbentrennung, Rechtschreibprüfung und Anführungszeichen (`:lang()`). Regionalcodes wie `de-AT` oder `en-GB` sind möglich.',
  example: '<html lang="de">\n  <body>\n    <p>Das nennt man <span lang="en">Fair Play</span>.</p>\n  </body>\n</html>',
  keywords: ['sprache', 'language', 'bcp47', 'de'],
  related: ['dir', 'translate', 'hreflang'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/lang'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'dir',
  desc: 'Textrichtung des Elementinhalts.',
  details: 'Steuert die Schreibrichtung bei gemischten Sprachen. Für Arabisch oder Hebräisch setzt man `rtl`; `auto` lässt den Browser anhand des Inhalts entscheiden und eignet sich für Nutzereingaben. Für das Layout selbst ist CSS (`direction`, logische Eigenschaften) zuständig – `dir` ist die semantische Auszeichnung.',
  values: [['ltr', 'Links nach rechts'], ['rtl', 'Rechts nach links'], ['auto', 'Richtung aus dem Inhalt ermitteln']],
  example: '<p lang="ar" dir="rtl">مرحبا بالعالم</p>',
  demo: '<p dir="rtl">Hallo Welt (rtl)</p><p dir="ltr">Hallo Welt (ltr)</p>',
  keywords: ['rtl', 'ltr', 'textrichtung', 'bidi'],
  related: ['lang'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/dir'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'hidden',
  desc: 'Blendet ein Element aus (nicht relevant für die aktuelle Seite).',
  details: 'Boolesches Attribut; der Browser stellt das Element per `display: none` nicht dar, auch Screenreader ignorieren es. Ein CSS-`display` mit höherer Spezifität kann `hidden` aushebeln, dann ist das Element trotzdem sichtbar. Mit `hidden="until-found"` bleibt der Inhalt durchsuchbar und wird bei einem Treffer oder Anker aufgeklappt.',
  values: [['hidden', 'Element komplett ausgeblendet'], ['until-found', 'Ausgeblendet, aber per Seitensuche/Anker auffindbar']],
  example: '<p hidden>Dieser Text ist nicht sichtbar.</p>\n<div hidden="until-found">Wird bei Suchtreffer sichtbar.</div>',
  demo: '<p>Vor dem versteckten Absatz</p><p hidden>Unsichtbar</p><p>Nach dem versteckten Absatz</p>',
  keywords: ['verstecken', 'ausblenden', 'display none'],
  related: ['aria-hidden', 'inert', 'open'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/hidden'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'tabindex',
  desc: 'Bestimmt, ob und in welcher Reihenfolge ein Element per Tab fokussierbar ist.',
  details: '`0` macht ein Element in der natürlichen Reihenfolge fokussierbar, `-1` nur per Skript (`focus()`), aber nicht per Tab. Positive Werte erzwingen eine eigene Reihenfolge und sind ein Anti-Pattern, weil sie sich schwer pflegen lassen. Native Elemente wie `<button>` und `<a href>` sind bereits fokussierbar – `tabindex="0"` auf `<div>` braucht zusätzlich Rolle und Tastatursteuerung.',
  values: [['0', 'Fokussierbar, natürliche Reihenfolge'], ['-1', 'Nur programmatisch fokussierbar'], ['1, 2, ...', 'Feste Tab-Reihenfolge (vermeiden)']],
  example: '<div tabindex="-1" id="ergebnis">Suchergebnisse</div>',
  keywords: ['fokus', 'tab-reihenfolge', 'focus', 'tastatur'],
  related: ['accesskey', 'autofocus', 'inert'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/tabindex'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'accesskey',
  desc: 'Tastenkürzel zum Aktivieren oder Fokussieren eines Elements.',
  details: 'Die Tastenkombination hängt von Browser und Betriebssystem ab (z. B. Alt+Taste, Alt+Shift+Taste oder Ctrl+Alt+Taste). Sie kollidiert leicht mit Kürzeln von Browser und Screenreader und ist je Tastaturlayout unterschiedlich, weshalb sie kaum empfohlen wird. Mehrere Zeichen können als Leerzeichen-getrennte Liste angegeben werden.',
  example: '<a href="/suche" accesskey="s">Suche</a>',
  keywords: ['tastenkürzel', 'shortcut', 'hotkey'],
  related: ['tabindex'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/accesskey'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'contenteditable',
  desc: 'Macht den Inhalt eines Elements direkt im Browser editierbar.',
  details: 'Nutzer können den Text per Klick bearbeiten, ohne dass ein Formularfeld nötig ist. Die Änderungen leben nur im DOM und müssen per JavaScript ausgelesen und gespeichert werden. Bei `plaintext-only` wird Formatierung beim Einfügen unterbunden; das Verhalten des Rich-Text-Editings ist zwischen Browsern uneinheitlich.',
  values: [['true', 'Editierbar (auch leerer String)'], ['false', 'Nicht editierbar'], ['plaintext-only', 'Nur Klartext editierbar']],
  example: '<div contenteditable="true">Klick mich und tippe los.</div>',
  demo: '<div contenteditable="true" style="border:1px dashed #999;padding:8px">Klick mich und tippe los.</div>',
  keywords: ['editierbar', 'wysiwyg', 'bearbeiten', 'editor'],
  related: ['spellcheck', 'inputmode'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/contenteditable'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'draggable',
  desc: 'Legt fest, ob ein Element per Drag-and-drop gezogen werden darf.',
  details: 'Bilder und Links sind standardmäßig ziehbar, alle anderen Elemente brauchen `draggable="true"`. Für eigene Drag-and-drop-Logik sind zusätzlich Event-Handler (`dragstart`, `dragover`, `drop`) nötig. Der Wert ist ein Aufzählungsattribut, nicht boolesch: `draggable="false"` ist gültig, ein leeres Attribut nicht.',
  values: [['true', 'Ziehbar'], ['false', 'Nicht ziehbar']],
  example: '<li draggable="true">Aufgabe 1</li>',
  keywords: ['drag', 'drop', 'ziehen'],
  related: ['onclick'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/draggable'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'spellcheck',
  desc: 'Schaltet die Rechtschreibprüfung für ein editierbares Element ein oder aus.',
  details: 'Wirkt auf Textfelder, `<textarea>` und `contenteditable`-Bereiche. Mit `false` unterdrückt man die roten Wellenlinien, etwa bei Benutzernamen, Codes oder E-Mail-Adressen. Die Sprache der Prüfung richtet sich nach dem `lang`-Attribut.',
  values: [['true', 'Rechtschreibprüfung aktiv'], ['false', 'Rechtschreibprüfung aus']],
  example: '<input type="text" name="benutzername" spellcheck="false">',
  keywords: ['rechtschreibung', 'korrektur'],
  related: ['lang', 'autocapitalize', 'contenteditable'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/spellcheck'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'translate',
  desc: 'Steuert, ob Inhalte bei einer Übersetzung mitübersetzt werden.',
  details: 'Mit `translate="no"` schützt man Markennamen, Codebeispiele oder Eigennamen vor automatischer Übersetzung durch Browser oder Übersetzungsdienste. Das Attribut wird vererbt und gilt auch für Attributtexte wie `title` und `alt`.',
  values: [['yes', 'Wird übersetzt (Standard)'], ['no', 'Nicht übersetzen']],
  example: '<p>Willkommen bei <span translate="no">Cheat Sheet</span>.</p>',
  keywords: ['übersetzung', 'google translate', 'markenname'],
  related: ['lang'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/translate'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'inert',
  desc: 'Deaktiviert Interaktion und Zugänglichkeit eines ganzen Teilbaums.',
  details: 'Ein Element mit `inert` und alle Nachkommen sind nicht klickbar, nicht fokussierbar, nicht auswählbar und für assistive Technik nicht erreichbar. Praktisch für den Hintergrund hinter einem modalen Dialog oder für ausgeblendete Off-Canvas-Menüs. Es verändert das Aussehen nicht – dafür braucht man eigenes CSS.',
  example: '<main inert>\n  <button>Nicht erreichbar</button>\n</main>',
  demo: '<div inert style="opacity:.5"><button>Nicht klickbar</button> <a href="#">Link</a></div>',
  keywords: ['deaktivieren', 'sperren', 'modal', 'hintergrund'],
  related: ['hidden', 'tabindex', 'aria-modal'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/inert'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'popover',
  desc: 'Macht ein Element zu einem Popover, das über der Seite eingeblendet wird.',
  details: 'Das Element ist zunächst verborgen und wird über einen Button mit `popovertarget` geöffnet. Es liegt in der Top Layer, schließt sich per Esc oder Klick daneben (`auto`) und braucht kein JavaScript. Mit `popover="manual"` bleibt es offen, bis man es selbst schließt.',
  values: [['auto', 'Schließt bei Klick daneben oder Esc (Standard)'], ['manual', 'Schließt nur explizit'], ['hint', 'Leichtgewichtig, z. B. für Tooltips']],
  example: '<button popovertarget="info">Info</button>\n<div id="info" popover>\n  Hier steht ein Hinweis.\n</div>',
  demo: '<button popovertarget="info">Info</button><div id="info" popover style="padding:12px">Hier steht ein Hinweis.</div>',
  keywords: ['overlay', 'tooltip', 'menü', 'top layer'],
  related: ['popovertarget', 'open', 'aria-haspopup'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/popover'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'popovertarget',
  desc: 'Verknüpft einen Button mit einem Popover per ID.',
  details: 'Gehört an `<button>` oder `<input type="button">` und verweist auf die `id` des Popovers. Mit `popovertargetaction` bestimmt man, ob der Button das Popover öffnet (`show`), schließt (`hide`) oder umschaltet (`toggle`, Standard). Der Button erhält automatisch die passende Zugänglichkeitssemantik.',
  values: [['popovertargetaction="toggle"', 'Umschalten (Standard)'], ['popovertargetaction="show"', 'Nur öffnen'], ['popovertargetaction="hide"', 'Nur schließen']],
  example: '<button popovertarget="menu" popovertargetaction="toggle">Menü</button>\n<nav id="menu" popover>...</nav>',
  keywords: ['popover öffnen', 'button'],
  related: ['popover', 'aria-controls'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/popover'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'autofocus',
  desc: 'Fokussiert das Element beim Laden der Seite automatisch.',
  details: 'Pro Dokument sollte nur ein Element `autofocus` tragen. Das Attribut kann Screenreader-Nutzer verwirren und auf Mobilgeräten die Tastatur ungewollt öffnen, deshalb sparsam einsetzen – sinnvoll z. B. im Suchfeld einer Suchseite oder im ersten Feld eines Dialogs.',
  example: '<input type="search" name="q" autofocus>',
  keywords: ['fokus', 'automatisch', 'focus'],
  related: ['tabindex'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/autofocus'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'inputmode',
  desc: 'Gibt der virtuellen Tastatur einen Hinweis, welche Eingabeart erwartet wird.',
  details: 'Beeinflusst nur die Bildschirmtastatur, nicht die Validierung. Typisch ist `inputmode="numeric"` für Postleitzahlen oder PINs, bei denen `type="number"` ungeeignet ist (führende Nullen, Spinner). Es funktioniert auf Eingabefeldern und `contenteditable`-Elementen.',
  values: [['text', 'Normale Tastatur'], ['numeric', 'Ziffernblock 0–9'], ['decimal', 'Ziffern mit Dezimaltrenner'], ['tel', 'Telefontastatur'], ['email', 'Tastatur mit @'], ['url', 'Tastatur mit / und .com'], ['search', 'Mit Such-Taste'], ['none', 'Keine Bildschirmtastatur']],
  example: '<input type="text" name="plz" inputmode="numeric" pattern="[0-9]{5}">',
  keywords: ['tastatur', 'mobil', 'numerisch', 'keyboard'],
  related: ['enterkeyhint', 'pattern', 'autocomplete'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/inputmode'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'enterkeyhint',
  desc: 'Bestimmt Beschriftung oder Symbol der Enter-Taste auf virtuellen Tastaturen.',
  details: 'Rein ein Hinweis für mobile Tastaturen, ohne Einfluss auf das Verhalten. Sinnvoll sind Werte, die zur Aktion passen, z. B. `search` im Suchfeld oder `send` im Chatfeld.',
  values: [['enter', 'Zeilenumbruch'], ['done', 'Fertig'], ['go', 'Los'], ['next', 'Weiter'], ['previous', 'Zurück'], ['search', 'Suchen'], ['send', 'Senden']],
  example: '<input type="search" name="q" enterkeyhint="search">',
  keywords: ['enter-taste', 'mobil', 'tastatur'],
  related: ['inputmode'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/enterkeyhint'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'autocapitalize',
  desc: 'Steuert die automatische Großschreibung bei virtuellen Tastaturen.',
  details: 'Betrifft nur Eingaben per Bildschirm- oder Sprachtastatur, nicht Hardwaretastaturen. Für Benutzernamen und E-Mail-Adressen setzt man `off`, für Namen `words`. Gilt für Textfelder, `<textarea>` und `contenteditable`.',
  values: [['off / none', 'Keine automatische Großschreibung'], ['sentences', 'Satzanfänge groß'], ['words', 'Jedes Wort groß'], ['characters', 'Alles in Großbuchstaben']],
  example: '<input type="text" name="vorname" autocapitalize="words">',
  keywords: ['großschreibung', 'mobil', 'versalien'],
  related: ['spellcheck', 'inputmode'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/autocapitalize'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'data-*',
  desc: 'Eigene Datenattribute zum Speichern von Zusatzinformationen am Element.',
  details: 'Der Name beginnt mit `data-`, gefolgt von Kleinbuchstaben und Bindestrichen (`data-user-id`). In JavaScript liest man sie über `element.dataset.userId` (kebab-case wird zu camelCase), in CSS über `[data-user-id]` oder `attr()`. Die Werte sind immer Strings; sensible Daten gehören nicht hinein, da sie im Quelltext sichtbar sind.',
  example: '<li data-id="42" data-status="offen">Aufgabe</li>\n<script>\n  const li = document.querySelector("li");\n  console.log(li.dataset.id); // "42"\n</script>',
  demo: '<style>li[data-status="offen"]{color:#b4367a;font-weight:bold}</style><ul><li data-status="offen">Offen</li><li data-status="erledigt">Erledigt</li></ul>',
  keywords: ['dataset', 'custom attribute', 'datenattribut'],
  related: ['id', 'class'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/data-*'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'is',
  desc: 'Erweitert ein eingebautes Element zu einem Customized Built-in Element.',
  details: 'Mit `is="mein-button"` bekommt z. B. ein `<button>` das Verhalten einer per JavaScript definierten Klasse, die von `HTMLButtonElement` erbt. Safari unterstützt Customized Built-ins nicht, daher sind eigenständige Autonomous Custom Elements (`<mein-button>`) meist portabler.',
  example: '<button is="fancy-button">Klick</button>',
  keywords: ['custom element', 'web component', 'customized built-in'],
  related: ['part', 'slot (attribute)'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/is'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'nonce',
  desc: 'Kryptografischer Einmalwert für eine Content-Security-Policy.',
  details: 'Erlaubt einzelne Inline-`<script>`- oder `<style>`-Blöcke, wenn derselbe Wert im CSP-Header (`script-src \'nonce-...\'`) steht. Der Wert muss bei jeder Antwort neu und unvorhersagbar erzeugt werden, sonst bietet er keinen Schutz. Der Browser versteckt das Attribut nach dem Parsen aus dem DOM.',
  example: '<script nonce="r4nd0m123">\n  console.log("erlaubt durch CSP");\n</script>',
  keywords: ['csp', 'content security policy', 'sicherheit'],
  related: ['integrity', 'crossorigin'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/nonce'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'part',
  desc: 'Markiert ein Element im Shadow DOM, damit es von außen per ::part() gestylt werden kann.',
  details: 'Innerhalb eines Web Components setzt man `part="name"`; das Stylesheet der Seite adressiert es dann als `komponente::part(name)`. Ein Element kann mehrere Part-Namen tragen (Leerzeichen-getrennt). So bleibt die Kapselung erhalten, während gezielte Stellen anpassbar werden.',
  example: '<!-- im Shadow DOM -->\n<button part="knopf">OK</button>\n\n/* im Seiten-CSS */\nmein-element::part(knopf) { background: tomato; }',
  keywords: ['shadow dom', '::part', 'web component'],
  related: ['slot (attribute)', 'is'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/part'
},
{
  lang: 'html', group: 'Globale Attribute', name: 'slot (attribute)',
  desc: 'Weist ein Element einem benannten Slot eines Web Components zu.',
  details: 'Kinder eines Custom Elements werden in den passenden `<slot name="...">` im Shadow DOM eingesetzt. Ohne `slot`-Attribut landet ein Element im unbenannten Standard-Slot. Das Attribut heißt tatsächlich `slot`; der Zusatz im Namen grenzt es nur vom Element `<slot>` ab.',
  example: '<mein-card>\n  <h3 slot="titel">Titel</h3>\n  <p>Inhalt im Standard-Slot</p>\n</mein-card>',
  keywords: ['slot', 'shadow dom', 'web component'],
  related: ['part', 'is'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Global_attributes/slot'
}
);


window.CHEAT.push(
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'href',
  desc: 'Ziel-URL eines Links oder Basis-URL einer Ressource.',
  details: 'Zentrales Attribut von `<a>`, `<area>`, `<link>` und `<base>`. Erlaubt sind absolute und relative URLs, Anker (`#id`), `mailto:`, `tel:` und weitere Schemata. Ein `<a>` ohne `href` ist kein Link und nicht per Tastatur fokussierbar; `javascript:`-URLs sollte man vermeiden.',
  example: '<a href="https://example.org/seite.html">Extern</a>\n<a href="/kontakt">Absolut vom Root</a>\n<a href="#unten">Anker</a>\n<a href="mailto:info@example.org">E-Mail</a>\n<a href="tel:+4930123456">Anrufen</a>',
  demo: '<a href="#ziel">Anker-Link</a>',
  keywords: ['link', 'url', 'verweis', 'anker', 'mailto', 'tel'],
  related: ['<a>', '<link>', 'target', 'rel', 'download'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/href'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'target',
  desc: 'Bestimmt, wo ein Link oder Formularergebnis angezeigt wird.',
  details: 'Gilt für `<a>`, `<area>` und `<form>`. Bei `_blank` sollte man `rel="noopener"` ergänzen; moderne Browser setzen das bei `_blank` inzwischen implizit, ältere nicht. Neue Tabs ohne Vorwarnung sind für Nutzer und Screenreader oft irritierend.',
  values: [['_self', 'Im selben Browsing-Kontext (Standard)'], ['_blank', 'In neuem Tab/Fenster'], ['_parent', 'Im übergeordneten Frame'], ['_top', 'Im obersten Frame (ganzes Fenster)'], ['Framename', 'In einem benannten iframe']],
  example: '<a href="https://example.org" target="_blank" rel="noopener noreferrer">Extern öffnen</a>',
  keywords: ['neuer tab', 'neues fenster', 'blank'],
  related: ['rel', 'href', '<a>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/a#target'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'rel',
  desc: 'Beschreibt die Beziehung zwischen aktuellem Dokument und Linkziel.',
  details: 'Gilt für `<a>`, `<area>`, `<form>` und `<link>`. Mehrere Werte werden mit Leerzeichen getrennt. Bei `<link>` bestimmt `rel`, was der Browser mit der Ressource tut (Stylesheet laden, Icon, Preload); bei `<a>` steuert es SEO-Signale und Sicherheit.',
  values: [['stylesheet', '(link) Lädt ein Stylesheet'], ['icon', '(link) Favicon'], ['preload', '(link) Ressource früh laden'], ['preconnect', '(link) Verbindung vorab aufbauen'], ['canonical', '(link) Kanonische URL der Seite'], ['noopener', '(a) Neuer Kontext erhält kein window.opener'], ['noreferrer', '(a) Kein Referer-Header, impliziert noopener'], ['nofollow', '(a) Suchmaschinen sollen dem Link nicht folgen'], ['sponsored', '(a) Bezahlter Link'], ['ugc', '(a) Nutzergenerierter Inhalt'], ['external', '(a) Verweist auf externe Seite'], ['alternate', 'Alternative Version (z. B. Sprache, Feed)'], ['author', 'Verweis auf den Autor'], ['next / prev', 'Nächste/vorherige Seite einer Reihe']],
  example: '<link rel="stylesheet" href="style.css">\n<link rel="icon" href="/favicon.svg">\n<a href="https://example.org" rel="nofollow noopener">Link</a>',
  keywords: ['relation', 'noopener', 'nofollow', 'stylesheet', 'preload', 'canonical'],
  related: ['href', 'target', '<link>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/rel'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'download',
  desc: 'Lädt das Linkziel herunter, statt es zu öffnen.',
  details: 'Funktioniert bei `<a>` und `<area>` nur für Same-Origin-URLs sowie `blob:` und `data:`. Ein Wert schlägt den Dateinamen vor, den der Server (`Content-Disposition`) aber überschreiben kann. Bei Cross-Origin-Links ignorieren Browser das Attribut.',
  example: '<a href="/files/bericht.pdf" download="Jahresbericht-2025.pdf">PDF herunterladen</a>',
  keywords: ['herunterladen', 'speichern', 'datei', 'download'],
  related: ['href', 'type'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/a#download'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'hreflang',
  desc: 'Sprache des verlinkten Dokuments.',
  details: 'Rein informativ für Browser und Suchmaschinen (BCP-47-Code). Besonders wichtig bei `<link rel="alternate" hreflang="...">`, um Sprachversionen einer Seite für Suchmaschinen zu verknüpfen. Es ändert nichts am Linkverhalten selbst.',
  example: '<link rel="alternate" hreflang="en" href="https://example.org/en/">\n<a href="/en/" hreflang="en">English</a>',
  keywords: ['sprachversion', 'i18n', 'seo', 'alternate'],
  related: ['lang', 'rel', 'href'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/a#hreflang'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'referrerpolicy',
  desc: 'Legt fest, welche Referrer-Informationen beim Laden mitgesendet werden.',
  details: 'Gilt für `<a>`, `<img>`, `<iframe>`, `<script>` und `<link>`. Kann die globale Referrer-Policy der Seite für ein einzelnes Element überschreiben. Für Datenschutz sind `no-referrer` oder `strict-origin-when-cross-origin` (Browser-Standard) sinnvoll.',
  values: [['no-referrer', 'Nie einen Referer senden'], ['origin', 'Nur Origin (ohne Pfad)'], ['same-origin', 'Nur bei gleicher Origin'], ['strict-origin-when-cross-origin', 'Voll bei same-origin, sonst nur Origin; nie bei HTTPS zu HTTP'], ['unsafe-url', 'Immer vollständige URL (unsicher)']],
  example: '<img src="https://cdn.example.org/bild.jpg" alt="" referrerpolicy="no-referrer">',
  keywords: ['referer', 'datenschutz', 'privacy'],
  related: ['rel', 'crossorigin'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/referrerpolicy'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'src',
  desc: 'URL der einzubettenden Ressource.',
  details: 'Gibt bei `<img>`, `<script>`, `<iframe>`, `<audio>`, `<video>`, `<source>`, `<track>`, `<embed>` und `<input type="image">` die Quelle an. Relative URLs werden gegen die Dokument-URL (oder `<base>`) aufgelöst. Ein leeres `src=""` löst in manchen Browsern unnötige Anfragen auf die eigene Seite aus.',
  example: '<img src="bilder/katze.jpg" alt="Eine Katze">\n<script src="app.js" defer></script>\n<iframe src="https://example.org/embed" title="Einbettung"></iframe>',
  keywords: ['quelle', 'bild', 'pfad', 'source'],
  related: ['srcset', 'alt', '<img>', 'href'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/img#src'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'alt',
  desc: 'Alternativtext für Bilder.',
  details: 'Pflicht bei `<img>` (und `<area>`, `<input type="image">`). Er beschreibt Inhalt oder Funktion des Bildes für Screenreader und wird angezeigt, wenn das Bild nicht lädt. Bei rein dekorativen Bildern setzt man ein leeres `alt=""`, damit Hilfstechnik es überspringt; das Attribut ganz wegzulassen ist ein Fehler.',
  example: '<img src="diagramm.png" alt="Umsatz steigt von 2023 bis 2025 um 40 Prozent">\n<img src="trenner.png" alt="">',
  keywords: ['alternativtext', 'barrierefreiheit', 'screenreader', 'bildbeschreibung'],
  related: ['src', 'title', '<img>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/img#alt'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'srcset',
  desc: 'Liste von Bildquellen für unterschiedliche Auflösungen oder Breiten.',
  details: 'Kandidaten werden mit Komma getrennt und mit Dichte (`2x`) oder Breite (`800w`) angegeben. Bei Breitenangaben muss `sizes` die dargestellte Breite beschreiben, damit der Browser passend wählt. `src` bleibt als Fallback bestehen.',
  values: [['bild.jpg 1x, bild@2x.jpg 2x', 'Auswahl nach Pixeldichte'], ['klein.jpg 480w, gross.jpg 960w', 'Auswahl nach Bildbreite (mit sizes)']],
  example: '<img\n  src="foto-800.jpg"\n  srcset="foto-400.jpg 400w, foto-800.jpg 800w, foto-1600.jpg 1600w"\n  sizes="(min-width: 800px) 50vw, 100vw"\n  alt="Berglandschaft">',
  keywords: ['responsive bilder', 'retina', 'auflösung'],
  related: ['sizes', 'src', '<picture>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/img#srcset'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'sizes',
  desc: 'Beschreibt die angezeigte Bildbreite für die Auswahl aus srcset.',
  details: 'Eine Liste aus Media-Condition und Breite (`(min-width: 800px) 50vw`), zuletzt ein Fallback. Der Browser kennt die Layoutbreite beim Laden noch nicht, daher ist `sizes` seine einzige Information. Ohne `sizes` nimmt er `100vw` an und lädt oft zu große Bilder.',
  example: '<img srcset="a-480.jpg 480w, a-960.jpg 960w" sizes="(min-width: 60em) 30em, 100vw" src="a-960.jpg" alt="">',
  keywords: ['responsive', 'viewport', 'bildbreite'],
  related: ['srcset', 'media'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/img#sizes'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'loading',
  desc: 'Steuert, ob ein Bild oder iframe sofort oder verzögert geladen wird.',
  details: 'Mit `lazy` lädt der Browser erst, wenn das Element in die Nähe des Viewports kommt – spart Daten bei langen Seiten. Das Bild im sichtbaren Bereich (z. B. Hero, LCP) sollte nicht `lazy` sein. Gib immer `width` und `height` an, damit kein Layout-Sprung entsteht.',
  values: [['eager', 'Sofort laden (Standard)'], ['lazy', 'Erst bei Annäherung an den Viewport laden']],
  example: '<img src="galerie-7.jpg" alt="Foto 7" width="800" height="600" loading="lazy">',
  keywords: ['lazy loading', 'performance', 'verzögert'],
  related: ['fetchpriority', 'decoding', 'width', 'height'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/img#loading'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'decoding',
  desc: 'Hinweis an den Browser, wie ein Bild dekodiert werden soll.',
  details: 'Nur ein Hinweis, keine Garantie. `async` erlaubt asynchrones Dekodieren, ohne anderen Inhalt zu blockieren; `sync` zeigt Bild und Umgebung gemeinsam an. Der Effekt ist meist gering; `auto` ist in der Regel richtig.',
  values: [['auto', 'Browser entscheidet (Standard)'], ['async', 'Asynchron dekodieren'], ['sync', 'Synchron dekodieren']],
  example: '<img src="gross.jpg" alt="Panorama" decoding="async">',
  keywords: ['bild', 'performance', 'dekodieren'],
  related: ['loading', 'fetchpriority'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/img#decoding'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'fetchpriority',
  desc: 'Gibt die relative Ladepriorität einer Ressource an.',
  details: 'Gilt für `<img>`, `<link>`, `<script>` und `<iframe>`. Mit `high` am Hero-Bild verbessert man oft den Largest Contentful Paint; `low` senkt die Priorität weniger wichtiger Bilder. Es ist ein Hinweis – sparsam einsetzen, sonst verliert die Priorisierung ihren Sinn.',
  values: [['high', 'Höhere Priorität'], ['low', 'Niedrigere Priorität'], ['auto', 'Browser entscheidet (Standard)']],
  example: '<img src="hero.jpg" alt="Titelbild" width="1200" height="600" fetchpriority="high">',
  keywords: ['priorität', 'lcp', 'performance', 'core web vitals'],
  related: ['loading', 'rel'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/fetchpriority'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'width',
  desc: 'Breite von Bildern, Videos, iframes und Canvas in CSS-Pixeln.',
  details: 'Der Wert ist eine reine Zahl ohne Einheit. Zusammen mit `height` reserviert der Browser vor dem Laden das richtige Seitenverhältnis und vermeidet Layout-Sprünge (CLS). Mit CSS (`max-width: 100%; height: auto`) bleibt das Bild trotzdem responsiv.',
  example: '<img src="logo.png" alt="Logo" width="200" height="80">',
  demo: '<img alt="Platzhalter" width="160" height="60" style="background:#cdd;display:block">',
  keywords: ['breite', 'größe', 'abmessung', 'cls'],
  related: ['height', 'loading', '<img>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/img#width'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'height',
  desc: 'Höhe von Bildern, Videos, iframes und Canvas in CSS-Pixeln.',
  details: 'Reine Zahl ohne Einheit, Gegenstück zu `width`. Beide Angaben ergeben das intrinsische Seitenverhältnis, das der Browser vor dem Laden reserviert. Bei `<td>`, `<table>` usw. ist `height` veraltet – dort CSS verwenden.',
  example: '<video src="clip.mp4" width="640" height="360" controls></video>',
  keywords: ['höhe', 'größe', 'abmessung', 'cls'],
  related: ['width', 'loading'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/img#height'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'crossorigin',
  desc: 'Steuert CORS-Anfragen für Ressourcen von fremden Domains.',
  details: 'Nötig für Skripte mit Fehlerdetails, Schriften, Canvas-Zugriff auf fremde Bilder und für `integrity` bei Cross-Origin-Ressourcen. Der Server muss passende CORS-Header (`Access-Control-Allow-Origin`) senden, sonst wird die Ressource blockiert. Ein leeres Attribut entspricht `anonymous`.',
  values: [['anonymous', 'CORS ohne Cookies/Zugangsdaten'], ['use-credentials', 'CORS mit Cookies/Zugangsdaten']],
  example: '<script src="https://cdn.example.org/lib.js" crossorigin="anonymous" integrity="sha384-..."></script>',
  keywords: ['cors', 'cross origin', 'anonymous'],
  related: ['integrity', 'referrerpolicy'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/crossorigin'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'integrity',
  desc: 'Subresource Integrity: Hash zur Prüfung geladener Skripte und Stylesheets.',
  details: 'Der Browser berechnet den Hash der geladenen Datei und führt sie nur aus, wenn er zum Wert passt – schützt vor manipulierten CDN-Dateien. Format: Algorithmus, Bindestrich, Base64-Hash (`sha384-...`). Bei Cross-Origin-Ressourcen ist zusätzlich `crossorigin` nötig; jede Änderung der Datei bricht den Hash.',
  example: '<link rel="stylesheet" href="https://cdn.example.org/lib.css"\n  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"\n  crossorigin="anonymous">',
  keywords: ['sri', 'subresource integrity', 'hash', 'sicherheit'],
  related: ['crossorigin', 'nonce'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Security/Subresource_Integrity'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'async',
  desc: 'Lädt ein Skript parallel und führt es aus, sobald es fertig ist.',
  details: 'Gilt für externe `<script src>`; die Ausführungsreihenfolge ist nicht garantiert und das HTML-Parsen wird beim Ausführen kurz unterbrochen. Geeignet für unabhängige Skripte wie Analytics. Für Skripte, die voneinander oder vom DOM abhängen, ist `defer` besser. Bei Modulen ist `async` ebenfalls möglich.',
  example: '<script src="analytics.js" async></script>',
  keywords: ['script', 'asynchron', 'laden', 'performance'],
  related: ['defer', 'type', '<script>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/script#async'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'defer',
  desc: 'Lädt ein Skript parallel und führt es nach dem HTML-Parsen aus.',
  details: 'Gilt für externe klassische Skripte; mehrere `defer`-Skripte laufen in Dokumentreihenfolge, vor `DOMContentLoaded`. Damit kann man Skripte im `<head>` laden, ohne das Rendern zu blockieren. Module (`type="module"`) verhalten sich automatisch wie `defer`.',
  example: '<script src="app.js" defer></script>',
  keywords: ['script', 'verzögert', 'laden', 'domcontentloaded'],
  related: ['async', 'type', '<script>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/script#defer'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'type',
  desc: 'Gibt den Typ eines Elements bzw. den MIME-Typ einer Ressource an.',
  details: 'Die Bedeutung hängt vom Element ab: bei `<input>` der Feldtyp (`text`, `email`, `checkbox` ...), bei `<button>` das Verhalten (`submit`, `button`, `reset`), bei `<script>` `module` oder `importmap`, bei `<source>`/`<link>` der MIME-Typ. Bei `<button>` ist der Standard `submit` – ein klassischer Fallstrick in Formularen.',
  values: [['<input type="...">', 'text, email, password, number, date, checkbox, radio, file ...'], ['<button type="...">', 'submit (Standard), button, reset'], ['<script type="...">', 'module, importmap, speculationrules'], ['<source type="...">', 'MIME-Typ, z. B. video/webm, image/avif']],
  example: '<input type="email" name="mail">\n<button type="button">Nur Klick</button>\n<script type="module" src="main.js"></script>\n<source srcset="bild.avif" type="image/avif">',
  keywords: ['input type', 'mime', 'button', 'module'],
  related: ['name', 'value', 'media'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'media',
  desc: 'Media-Query, unter der eine Ressource oder Quelle gilt.',
  details: 'Bei `<link rel="stylesheet">` wird das Stylesheet nur bei passender Bedingung angewendet (geladen wird es trotzdem, blockiert aber nicht das Rendern). Bei `<source>` in `<picture>` wählt es die passende Bildquelle (Art Direction). Typische Werte: `(min-width: 800px)`, `print`, `(prefers-color-scheme: dark)`.',
  example: '<link rel="stylesheet" href="print.css" media="print">\n<picture>\n  <source media="(min-width: 800px)" srcset="breit.jpg">\n  <img src="schmal.jpg" alt="Foto">\n</picture>',
  keywords: ['media query', 'responsive', 'print', 'picture'],
  related: ['sizes', 'srcset', 'rel'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/link#media'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'controls',
  desc: 'Zeigt die Standard-Bedienelemente von audio und video an.',
  details: 'Ohne `controls` ist das Medienelement nur per Skript bedienbar. Die Oberfläche ist browserabhängig, aber barrierefrei und tastaturbedienbar. Mit `controlslist` und `disablepictureinpicture` lassen sich einzelne Funktionen ausblenden.',
  example: '<video src="film.mp4" controls width="480"></video>\n<audio src="song.mp3" controls></audio>',
  demo: '<audio controls></audio>',
  keywords: ['player', 'bedienelemente', 'video', 'audio'],
  related: ['autoplay', 'muted', 'loop', 'preload'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/video#controls'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'autoplay',
  desc: 'Startet die Wiedergabe automatisch.',
  details: 'Browser erlauben Autoplay meist nur, wenn das Medium stumm ist (`muted`) oder der Nutzer bereits mit der Seite interagiert hat. Automatisch startender Ton ist ein Barrierefreiheits-Problem; für Hintergrundvideos kombiniert man `autoplay muted loop playsinline`.',
  example: '<video src="hintergrund.mp4" autoplay muted loop playsinline></video>',
  keywords: ['automatisch abspielen', 'video', 'audio'],
  related: ['muted', 'loop', 'playsinline', 'controls'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/video#autoplay'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'muted',
  desc: 'Schaltet den Ton des Mediums stumm.',
  details: 'Das Attribut setzt nur den Anfangszustand; der Nutzer kann über die Controls wieder einschalten. Es ist die Voraussetzung dafür, dass `autoplay` in den meisten Browsern funktioniert.',
  example: '<video src="clip.mp4" muted autoplay></video>',
  keywords: ['stumm', 'ton', 'sound'],
  related: ['autoplay', 'controls'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/video#muted'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'loop',
  desc: 'Spielt das Medium nach dem Ende erneut ab.',
  details: 'Das Medium startet am Ende automatisch von vorn. Häufig bei kurzen Hintergrundvideos oder Soundschleifen. Endlosschleifen können für manche Nutzer ablenkend sein – eine Pause-Möglichkeit sollte bestehen (WCAG 2.2.2).',
  example: '<audio src="loop.mp3" loop controls></audio>',
  keywords: ['wiederholen', 'endlos', 'schleife'],
  related: ['autoplay', 'controls'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/video#loop'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'poster',
  desc: 'Vorschaubild eines Videos vor dem Abspielen.',
  details: 'Wird angezeigt, bis die Wiedergabe beginnt. Fehlt es, zeigt der Browser meist das erste Frame, sobald es geladen ist (abhängig von `preload`). Ein passend dimensioniertes Poster verbessert die wahrgenommene Ladezeit.',
  example: '<video src="film.mp4" poster="cover.jpg" controls></video>',
  keywords: ['vorschaubild', 'thumbnail', 'video'],
  related: ['preload', 'controls', '<video>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/video#poster'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'preload',
  desc: 'Hinweis, wie viel vom Medium vorab geladen wird.',
  details: 'Gilt für `<audio>` und `<video>`. Nur ein Hinweis – bei `autoplay` wird ohnehin geladen, Mobilbrowser sparen oft Daten. `metadata` ist ein guter Kompromiss: Länge und Maße bekannt, ohne das ganze Video zu laden.',
  values: [['none', 'Nichts vorladen'], ['metadata', 'Nur Metadaten (Dauer, Größe)'], ['auto', 'Browser darf das ganze Medium laden']],
  example: '<video src="lang.mp4" preload="metadata" controls></video>',
  keywords: ['vorladen', 'bandbreite', 'video'],
  related: ['autoplay', 'poster'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/video#preload'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'playsinline',
  desc: 'Spielt Videos auf iOS inline ab statt im Vollbild.',
  details: 'Ohne `playsinline` öffnet Safari auf dem iPhone Videos historisch im Vollbild-Player. Für Hintergrundvideos und eingebettete Clips ist es daher meist notwendig, zusammen mit `muted autoplay`.',
  example: '<video src="clip.mp4" autoplay muted loop playsinline></video>',
  keywords: ['ios', 'iphone', 'inline', 'vollbild'],
  related: ['autoplay', 'muted'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/video#playsinline'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'allow',
  desc: 'Permissions Policy für ein iframe: erlaubte Browserfunktionen.',
  details: 'Ohne `allow` darf eingebetteter Fremdinhalt sensible APIs (Kamera, Mikrofon, Vollbild, Zahlung) nicht nutzen. Mehrere Features trennt man mit Semikolon. Nur die tatsächlich nötigen Rechte vergeben – am besten mit Origin-Einschränkung.',
  example: '<iframe src="https://www.youtube.com/embed/ID"\n  title="Video"\n  allow="fullscreen; picture-in-picture; autoplay"></iframe>',
  keywords: ['permissions policy', 'iframe', 'feature policy', 'kamera'],
  related: ['sandbox', 'srcdoc', '<iframe>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/iframe#allow'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'sandbox',
  desc: 'Schränkt die Rechte eines iframe-Inhalts ein.',
  details: 'Ohne Wert gelten alle Beschränkungen: keine Skripte, keine Formulare, keine Popups, eigene Origin. Mit Schlüsselwörtern (`allow-scripts`, `allow-forms`, `allow-same-origin`, `allow-popups` ...) lockert man gezielt. Achtung: `allow-scripts` zusammen mit `allow-same-origin` hebelt die Sandbox bei Same-Origin-Inhalten faktisch aus.',
  values: [['(leer)', 'Maximale Einschränkung'], ['allow-scripts', 'JavaScript erlauben'], ['allow-forms', 'Formulare absenden'], ['allow-same-origin', 'Eigene Origin behalten'], ['allow-popups', 'Popups/neue Fenster'], ['allow-modals', 'alert(), confirm() usw.'], ['allow-top-navigation', 'Das übergeordnete Fenster navigieren']],
  example: '<iframe src="widget.html" title="Widget" sandbox="allow-scripts allow-forms"></iframe>',
  keywords: ['iframe', 'sicherheit', 'isolation'],
  related: ['allow', 'srcdoc', '<iframe>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/iframe#sandbox'
},
{
  lang: 'html', group: 'Link- & Medien-Attribute', name: 'srcdoc',
  desc: 'HTML-Inhalt eines iframe direkt als Attributwert.',
  details: 'Statt einer URL steht das Dokument inline im Attribut; Anführungszeichen und `&` müssen escaped werden. `srcdoc` hat Vorrang vor `src`. Zusammen mit `sandbox` ideal für isolierte Vorschauen von Code.',
  example: '<iframe sandbox title="Vorschau"\n  srcdoc="&lt;h1&gt;Hallo&lt;/h1&gt;&lt;p&gt;Aus srcdoc&lt;/p&gt;"></iframe>',
  keywords: ['iframe', 'inline html', 'vorschau'],
  related: ['sandbox', 'src', 'allow'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/iframe#srcdoc'
}
);

window.CHEAT.push(
{
  lang: 'html', group: 'Formular-Attribute', name: 'action',
  desc: 'Ziel-URL, an die das Formular gesendet wird.',
  details: 'Gehört an `<form>` (oder überschreibend als `formaction` an Buttons). Fehlt es, wird an die aktuelle URL gesendet. Die URL kann relativ oder absolut sein; sie verarbeitet serverseitig die Daten.',
  example: '<form action="/anmelden" method="post">\n  <button>Senden</button>\n</form>',
  keywords: ['formular', 'absenden', 'ziel', 'url'],
  related: ['method', 'formaction', 'enctype', '<form>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/form#action'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'method',
  desc: 'HTTP-Methode zum Absenden des Formulars.',
  details: '`get` hängt die Daten als Query-String an die URL – geeignet für Suchen und lesende Abfragen. `post` sendet sie im Request-Body, nötig für Änderungen und sensible Daten (Passwörter nie per GET). `dialog` schließt ein `<dialog>` statt zu senden.',
  values: [['get', 'Daten in der URL (Standard)'], ['post', 'Daten im Request-Body'], ['dialog', 'Schließt den umgebenden dialog']],
  example: '<form action="/suche" method="get">\n  <input type="search" name="q">\n</form>',
  keywords: ['get', 'post', 'http'],
  related: ['action', 'enctype', '<form>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/form#method'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'enctype',
  desc: 'Kodierung der Formulardaten bei method="post".',
  details: 'Für Datei-Uploads ist `multipart/form-data` zwingend, sonst wird nur der Dateiname übertragen. Der Standard `application/x-www-form-urlencoded` genügt für reine Textfelder. `text/plain` ist nur für Debugging sinnvoll.',
  values: [['application/x-www-form-urlencoded', 'Standard, URL-kodiert'], ['multipart/form-data', 'Für Datei-Uploads'], ['text/plain', 'Unkodierter Text (selten)']],
  example: '<form action="/upload" method="post" enctype="multipart/form-data">\n  <input type="file" name="datei">\n</form>',
  keywords: ['upload', 'multipart', 'kodierung'],
  related: ['method', 'accept', '<form>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/form#enctype'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'novalidate',
  desc: 'Deaktiviert die Browser-Validierung beim Absenden.',
  details: 'Gilt für `<form>`; Felder mit `required`, `pattern` oder `type="email"` werden dann nicht mehr geprüft. Sinnvoll, wenn man eigene JavaScript-Validierung nutzt oder Entwürfe speichern will. Einzelne Submit-Buttons können mit `formnovalidate` dasselbe tun.',
  example: '<form action="/entwurf" method="post" novalidate>\n  <input type="email" name="mail" required>\n</form>',
  keywords: ['validierung', 'formular', 'prüfen'],
  related: ['required', 'pattern', '<form>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/form#novalidate'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'name',
  desc: 'Name eines Formularfelds – Schlüssel der gesendeten Daten.',
  details: 'Nur Felder mit `name` werden mit dem Formular übertragen (`name=wert`). Radiobuttons mit gleichem `name` bilden eine Gruppe, bei Checkboxen ergeben gleiche Namen mehrere Werte. Gilt auch für `<select>`, `<textarea>`, `<button>`, `<iframe>` (als target) und `<form>`.',
  example: '<input type="text" name="vorname">\n<input type="radio" name="farbe" value="rot"> Rot\n<input type="radio" name="farbe" value="blau"> Blau',
  keywords: ['feldname', 'formulardaten', 'schlüssel'],
  related: ['value', 'id', 'for', 'name (meta)'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/name'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'value',
  desc: 'Wert eines Formularelements bzw. Vorbelegung.',
  details: 'Bei Textfeldern ist es der Startwert, bei Checkbox/Radio der Wert, der gesendet wird, wenn sie ausgewählt sind (Standard `on`), bei `<button>` und `<option>` ein Wert bzw. Label. Bei `<li>` in `<ol>` setzt es die Listennummer, bei `<meter>`/`<progress>` den aktuellen Wert.',
  example: '<input type="text" name="land" value="Deutschland">\n<input type="checkbox" name="news" value="ja"> Newsletter\n<option value="de">Deutsch</option>',
  demo: '<input type="text" value="Vorbelegt">',
  keywords: ['vorbelegung', 'standardwert', 'default'],
  related: ['name', 'checked', 'placeholder'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/value'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'placeholder',
  desc: 'Platzhaltertext in leeren Eingabefeldern.',
  details: 'Zeigt ein Beispiel oder Format an und verschwindet bei Eingabe. Er ist kein Ersatz für ein `<label>`, hat oft zu geringen Kontrast und ist weg, sobald man tippt. Für `<input>` und `<textarea>`.',
  example: '<label>E-Mail <input type="email" name="mail" placeholder="name@beispiel.de"></label>',
  demo: '<input type="email" placeholder="name@beispiel.de">',
  keywords: ['platzhalter', 'hinweis', 'eingabehilfe'],
  related: ['value', 'for', 'aria-label'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/placeholder'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'required',
  desc: 'Markiert ein Feld als Pflichtfeld.',
  details: 'Der Browser verhindert das Absenden, solange das Feld leer ist, und zeigt eine Fehlermeldung. Gilt für `<input>`, `<select>` und `<textarea>`; bei Radiobuttons genügt es an einem der Gruppe. Das CSS kann mit `:required`, `:invalid` stylen. Serverseitige Prüfung bleibt trotzdem nötig.',
  example: '<input type="text" name="name" required>',
  demo: '<style>input:required{border:2px solid #b4367a}</style><form><input name="n" required placeholder="Pflichtfeld"> <button>Senden</button></form>',
  keywords: ['pflichtfeld', 'validierung', 'erforderlich'],
  related: ['aria-required', 'pattern', 'novalidate'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/required'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'disabled',
  desc: 'Deaktiviert ein Formularelement.',
  details: 'Deaktivierte Felder sind nicht fokussierbar, nicht klickbar und werden nicht mit dem Formular gesendet. Gilt für Buttons, Eingabefelder, `<select>`, `<textarea>`, `<fieldset>` (deaktiviert alle Kinder) und `<optgroup>`. Wenn der Wert trotzdem übertragen werden soll, nimmt man `readonly`.',
  example: '<button type="submit" disabled>Senden</button>\n<fieldset disabled>...</fieldset>',
  demo: '<input value="Gesperrt" disabled> <button disabled>Senden</button>',
  keywords: ['deaktivieren', 'sperren', 'ausgegraut'],
  related: ['readonly', 'aria-disabled', 'inert'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/disabled'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'readonly',
  desc: 'Feld ist sichtbar und fokussierbar, aber nicht änderbar.',
  details: 'Anders als `disabled` wird der Wert mit dem Formular gesendet und das Feld ist per Tab erreichbar. Gilt für Textfelder und `<textarea>`, nicht für Checkbox, Radio, `<select>` oder Buttons. Browser überspringen die Validierung schreibgeschützter Felder.',
  example: '<input type="text" name="kundennr" value="K-1042" readonly>',
  demo: '<input value="Nur lesen" readonly>',
  keywords: ['schreibgeschützt', 'nicht editierbar'],
  related: ['disabled', 'value'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/readonly'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'checked',
  desc: 'Checkbox oder Radiobutton ist vorausgewählt.',
  details: 'Setzt nur den Anfangszustand; der aktuelle Zustand liegt in der DOM-Eigenschaft `checked`. In einer Radiogruppe (gleiches `name`) darf nur eines `checked` haben. Mit CSS lässt sich der Zustand über `:checked` ansprechen.',
  example: '<label><input type="checkbox" name="agb" checked> AGB gelesen</label>',
  demo: '<input type="checkbox" checked> Vorausgewählt',
  keywords: ['ausgewählt', 'checkbox', 'radio', 'häkchen'],
  related: ['selected', 'value', 'aria-checked'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/checked'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'selected',
  desc: 'Markiert eine option in einem select als vorausgewählt.',
  details: 'Gilt nur für `<option>`. Ohne `selected` ist die erste Option vorgewählt (bei Einfachauswahl). Bei `multiple` dürfen mehrere Optionen `selected` sein.',
  example: '<select name="land">\n  <option value="de" selected>Deutschland</option>\n  <option value="at">Österreich</option>\n</select>',
  demo: '<select><option>A</option><option selected>B (vorausgewählt)</option></select>',
  keywords: ['vorauswahl', 'option', 'dropdown'],
  related: ['checked', 'multiple'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/option#selected'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'multiple',
  desc: 'Erlaubt Mehrfachauswahl bei select, Datei- und E-Mail-Eingabe.',
  details: 'Bei `<select>` wird aus dem Dropdown eine Listbox mit Strg/Cmd-Mehrfachauswahl, bei `<input type="file">` können mehrere Dateien gewählt werden, bei `<input type="email">` mehrere kommagetrennte Adressen. Auf dem Server kommen mehrere Werte unter demselben Namen an.',
  example: '<input type="file" name="bilder" accept="image/*" multiple>\n<select name="hobbys" multiple>...</select>',
  demo: '<select multiple size="3"><option>Eins</option><option>Zwei</option><option>Drei</option></select>',
  keywords: ['mehrfachauswahl', 'mehrere dateien'],
  related: ['accept', 'size', 'selected'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/multiple'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'pattern',
  desc: 'Regulärer Ausdruck, dem der Feldwert entsprechen muss.',
  details: 'Gilt für Texttypen (`text`, `tel`, `email`, `url`, `password`, `search`). Das Muster wird automatisch auf den gesamten Wert angewendet (wie `^(?:...)$`). Eine verständliche Fehlermeldung liefert man zusätzlich im `title` oder per `setCustomValidity`.',
  example: '<input type="text" name="plz" pattern="[0-9]{5}" title="Fünf Ziffern" required>',
  demo: '<form><input pattern="[0-9]{5}" title="Fünf Ziffern" placeholder="PLZ"> <button>Prüfen</button></form>',
  keywords: ['regex', 'regulärer ausdruck', 'validierung'],
  related: ['required', 'minlength', 'maxlength', 'inputmode'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/pattern'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'min',
  desc: 'Kleinster erlaubter Wert bei Zahl-, Datums- und Bereichsfeldern.',
  details: 'Gilt für `number`, `range`, `date`, `time`, `datetime-local`, `month`, `week` sowie `<meter>`. Bei Datumsfeldern gibt man ein ISO-Datum an (`2026-01-01`). Wird der Wert unterschritten, schlägt die Validierung fehl (`rangeUnderflow`).',
  example: '<input type="number" name="anzahl" min="1" max="10" value="1">',
  demo: '<input type="number" min="1" max="10" value="1">',
  keywords: ['minimum', 'untergrenze', 'zahl', 'datum'],
  related: ['max', 'step', 'minlength'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/min'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'max',
  desc: 'Größter erlaubter Wert bei Zahl-, Datums- und Bereichsfeldern.',
  details: 'Gegenstück zu `min` für `number`, `range`, Datum/Zeit-Typen und `<meter>`/`<progress>` (dort Gesamtwert). Wird er überschritten, schlägt die Validierung fehl (`rangeOverflow`). Für die Zeichenanzahl in Textfeldern dient `maxlength`.',
  example: '<input type="date" name="geburtstag" max="2010-12-31">',
  demo: '<input type="range" min="0" max="100" value="40">',
  keywords: ['maximum', 'obergrenze', 'zahl', 'datum'],
  related: ['min', 'step', 'maxlength'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/max'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'step',
  desc: 'Schrittweite für Zahl-, Datums- und Bereichsfelder.',
  details: 'Legt die erlaubten Abstände ab dem `min`-Wert fest, z. B. `step="5"` oder `step="0.01"` für Geldbeträge. Mit `step="any"` sind beliebige Dezimalwerte erlaubt. Der Standard bei `number` ist 1 – Dezimalzahlen sind daher ohne `step` ungültig.',
  example: '<input type="number" name="preis" min="0" step="0.01">\n<input type="range" min="0" max="100" step="10">',
  demo: '<input type="range" min="0" max="100" step="10" value="30">',
  keywords: ['schrittweite', 'inkrement', 'dezimal'],
  related: ['min', 'max'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/step'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'minlength',
  desc: 'Mindestanzahl an Zeichen in Text- und Textarea-Feldern.',
  details: 'Prüft die Länge des Werts (in UTF-16-Zeichen) beim Absenden und meldet `tooShort`. Die Prüfung greift erst nach einer Änderung durch den Nutzer, vorbelegte Werte werden nicht beanstandet. Für Zahlen nutzt man `min`.',
  example: '<input type="password" name="pw" minlength="8" required>',
  keywords: ['mindestlänge', 'zeichen', 'passwort'],
  related: ['maxlength', 'min', 'pattern'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/minlength'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'maxlength',
  desc: 'Höchstzahl an Zeichen in Text- und Textarea-Feldern.',
  details: 'Der Browser lässt keine längere Eingabe zu. Zeichen wie Emojis zählen in UTF-16 unter Umständen mehrfach, und Zeilenumbrüche in `<textarea>` können zwei Zeichen belegen. Ein Zeichenzähler per JavaScript verbessert die Bedienbarkeit.',
  example: '<textarea name="nachricht" maxlength="280"></textarea>',
  demo: '<input maxlength="5" placeholder="max. 5 Zeichen">',
  keywords: ['maximallänge', 'zeichenlimit', 'begrenzen'],
  related: ['minlength', 'max', 'size'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/maxlength'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'size',
  desc: 'Sichtbare Breite (Zeichen) eines Eingabefelds bzw. Zeilen eines select.',
  details: 'Bei Textfeldern legt es die sichtbare Breite in Zeichen fest, begrenzt die Eingabe aber nicht (das tut `maxlength`). Bei `<select>` bestimmt es, wie viele Optionen gleichzeitig sichtbar sind. Für das Layout ist CSS (`width`) in der Regel besser.',
  example: '<input type="text" name="plz" size="5">\n<select name="auswahl" size="4">...</select>',
  demo: '<input size="5" value="kurz"> <input size="30" value="länger">',
  keywords: ['breite', 'sichtbare zeilen', 'zeichen'],
  related: ['maxlength', 'multiple', 'width'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/size'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'autocomplete',
  desc: 'Steuert die Browser-Autovervollständigung eines Felds.',
  details: 'Mit passenden Tokens (`given-name`, `email`, `current-password`, `new-password`, `one-time-code`, `street-address` ...) füllt der Browser oder Passwortmanager Felder korrekt aus – das ist auch eine Barrierefreiheits-Anforderung (WCAG 1.3.5). `off` unterdrückt die Vervollständigung, Browser ignorieren das bei Login-Feldern aber oft.',
  values: [['on / off', 'Autovervollständigung an/aus'], ['email', 'E-Mail-Adresse'], ['username', 'Benutzername'], ['current-password', 'Aktuelles Passwort'], ['new-password', 'Neues Passwort'], ['one-time-code', 'Einmalcode (SMS, 2FA)'], ['given-name / family-name', 'Vor-/Nachname'], ['postal-code', 'Postleitzahl'], ['tel', 'Telefonnummer']],
  example: '<input type="email" name="mail" autocomplete="email">\n<input type="password" name="pw" autocomplete="current-password">',
  keywords: ['autofill', 'vervollständigung', 'passwortmanager'],
  related: ['name', 'inputmode', 'type'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/autocomplete'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'for',
  desc: 'Verknüpft ein label (oder output) mit einem Formularelement per ID.',
  details: 'Der Wert ist die `id` des Zielelements, nicht dessen `name`. Ein Klick auf das Label fokussiert bzw. aktiviert das Feld, und Screenreader lesen den Labeltext beim Fokussieren vor. Alternativ umschließt das `<label>` das Feld direkt, dann ist `for` nicht nötig.',
  example: '<label for="mail">E-Mail</label>\n<input type="email" id="mail" name="mail">',
  demo: '<label for="x">Klick mich</label> <input id="x" type="checkbox">',
  keywords: ['label', 'beschriftung', 'verknüpfen'],
  related: ['id', 'aria-labelledby', 'form'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/label#for'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'form',
  desc: 'Ordnet ein Element einem Formular per ID zu, auch außerhalb des form-Tags.',
  details: 'Gilt für Buttons, Eingabefelder, `<select>`, `<textarea>`, `<fieldset>`, `<label>`, `<output>` u. a. Nützlich, wenn ein Submit-Button weit entfernt vom `<form>` steht oder in einer Tabelle sitzt, in der ein `<form>` nicht erlaubt ist. Der Wert ist die `id` des Formulars.',
  example: '<form id="suche" action="/suche"></form>\n...\n<input type="search" name="q" form="suche">\n<button type="submit" form="suche">Suchen</button>',
  keywords: ['zuordnung', 'außerhalb', 'formular'],
  related: ['for', 'id', 'action'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/form'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'list',
  desc: 'Verknüpft ein Eingabefeld mit einer datalist per ID.',
  details: 'Die `<datalist>` liefert Vorschläge, der Nutzer kann aber weiterhin freien Text eingeben. Funktioniert mit Text-, URL-, E-Mail-, Zahl-, Datum- und Farbfeldern. Darstellung und Filterverhalten sind browserabhängig.',
  example: '<input type="text" name="browser" list="browser-liste">\n<datalist id="browser-liste">\n  <option value="Firefox">\n  <option value="Chrome">\n</datalist>',
  demo: '<input list="d" placeholder="Tippen…"><datalist id="d"><option value="Apfel"><option value="Birne"></datalist>',
  keywords: ['datalist', 'vorschläge', 'autocomplete'],
  related: ['autocomplete', 'id'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/list'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'accept',
  desc: 'Erlaubte Dateitypen für Datei-Uploads.',
  details: 'Gilt für `<input type="file">`. Akzeptiert kommagetrennte MIME-Typen (`image/png`), Wildcards (`image/*`) und Endungen (`.pdf`). Es filtert nur den Dateidialog – serverseitig muss man den Typ trotzdem prüfen.',
  example: '<input type="file" name="bild" accept="image/png, image/jpeg">\n<input type="file" name="dok" accept=".pdf,.docx">',
  keywords: ['upload', 'dateityp', 'mime', 'filter'],
  related: ['multiple', 'capture', 'enctype'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/accept'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'capture',
  desc: 'Bevorzugt Kamera oder Mikrofon des Geräts für Datei-Uploads.',
  details: 'Zusammen mit `accept="image/*"` oder `video/*` öffnet mobil direkt die Kamera. `user` wählt die Frontkamera, `environment` die Rückkamera. Desktopbrowser ignorieren es meist.',
  values: [['user', 'Frontkamera / Mikrofon'], ['environment', 'Rückkamera']],
  example: '<input type="file" accept="image/*" capture="environment">',
  keywords: ['kamera', 'foto', 'mobil'],
  related: ['accept', 'multiple'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes/capture'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'formaction',
  desc: 'Überschreibt das action-Ziel des Formulars für einen einzelnen Button.',
  details: 'Gilt für `<button type="submit">` und `<input type="submit|image">`. So kann ein Formular z. B. wahlweise speichern oder als Entwurf ablegen. Passende Geschwister sind `formmethod`, `formenctype`, `formtarget` und `formnovalidate`.',
  example: '<form action="/speichern" method="post">\n  <button>Speichern</button>\n  <button formaction="/entwurf">Als Entwurf</button>\n</form>',
  keywords: ['button', 'alternatives ziel', 'submit'],
  related: ['action', 'method', 'novalidate'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/button#formaction'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'rows',
  desc: 'Sichtbare Zeilenzahl eines textarea.',
  details: 'Legt die Höhe in Textzeilen fest; bei mehr Text erscheint ein Scrollbalken. Mit CSS (`height`, `field-sizing: content`) lässt sich die Höhe flexibler steuern. Standard ist 2.',
  example: '<textarea name="text" rows="6" cols="40"></textarea>',
  demo: '<textarea rows="4" cols="30">Vier Zeilen hoch</textarea>',
  keywords: ['textarea', 'höhe', 'zeilen'],
  related: ['cols', 'wrap', 'maxlength'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/textarea#rows'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'cols',
  desc: 'Sichtbare Spaltenbreite (Zeichen) eines textarea.',
  details: 'Breite in durchschnittlichen Zeichenbreiten; Standard ist 20. Im Layout setzt man heute meist CSS (`width: 100%`). Bei `<textarea wrap="hard">` bestimmt `cols` zusätzlich, wo beim Absenden umgebrochen wird.',
  example: '<textarea name="notiz" rows="4" cols="50"></textarea>',
  keywords: ['textarea', 'breite', 'spalten'],
  related: ['rows', 'wrap'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/textarea#cols'
},
{
  lang: 'html', group: 'Formular-Attribute', name: 'wrap',
  desc: 'Zeilenumbruch-Verhalten eines textarea.',
  details: 'Bei `soft` (Standard) bricht nur die Anzeige um, gesendet wird der Text ohne zusätzliche Umbrüche. Bei `hard` werden beim Absenden Umbrüche eingefügt – dazu muss `cols` gesetzt sein. `off` verhindert Umbruch und erzeugt horizontales Scrollen.',
  values: [['soft', 'Nur visuell umbrechen (Standard)'], ['hard', 'Umbrüche beim Senden einfügen (braucht cols)'], ['off', 'Kein Umbruch']],
  example: '<textarea name="code" wrap="off" rows="5" cols="40"></textarea>',
  keywords: ['textarea', 'umbruch', 'zeilenumbruch'],
  related: ['rows', 'cols'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/textarea#wrap'
}
);

window.CHEAT.push(
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'charset',
  desc: 'Zeichenkodierung des Dokuments.',
  details: 'Steht in `<meta charset="utf-8">` und muss innerhalb der ersten 1024 Bytes des Dokuments stehen, am besten als erstes Element im `<head>`. UTF-8 ist der einzige empfohlene Wert; ohne Angabe können Umlaute falsch dargestellt werden. Auch der HTTP-Header `Content-Type` kann die Kodierung festlegen und hat Vorrang.',
  example: '<head>\n  <meta charset="utf-8">\n  <title>Seite</title>\n</head>',
  keywords: ['utf-8', 'kodierung', 'umlaute', 'encoding'],
  related: ['content', 'http-equiv', '<meta>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/meta#charset'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'content',
  desc: 'Wert einer Meta-Angabe, zusammen mit name oder http-equiv.',
  details: 'Gilt für `<meta>` und enthält den eigentlichen Inhalt der Information: Beschreibung, Viewport-Einstellung, Robots-Anweisung usw. Bei Open-Graph-Tags (`property="og:..."`) steht der Wert ebenfalls in `content`.',
  example: '<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="description" content="Kurzbeschreibung der Seite">\n<meta property="og:title" content="Titel">',
  keywords: ['meta', 'viewport', 'description', 'open graph'],
  related: ['name (meta)', 'http-equiv', 'charset'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/meta#content'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'http-equiv',
  desc: 'Meta-Angabe, die einen HTTP-Header nachbildet.',
  details: 'Wird mit `content` kombiniert, z. B. `http-equiv="refresh"` für Weiterleitung/Neuladen oder `content-security-policy` für eine CSP im HTML. Echte HTTP-Header sind zuverlässiger und für die meisten Zwecke vorzuziehen; `refresh` mit kurzer Zeit schadet der Barrierefreiheit.',
  values: [['content-type', 'Zeichensatz (veraltet, besser charset)'], ['refresh', 'Neu laden oder weiterleiten'], ['content-security-policy', 'CSP-Regeln im Dokument'], ['x-ua-compatible', 'Historisch für IE (obsolet)']],
  example: '<meta http-equiv="refresh" content="5; url=https://example.org/neu">\n<meta http-equiv="content-security-policy" content="default-src \'self\'">',
  keywords: ['refresh', 'weiterleitung', 'csp', 'header'],
  related: ['content', 'charset'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/meta#http-equiv'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'name (meta)',
  desc: 'Name der Metadaten bei meta (nicht zu verwechseln mit dem Formular-name).',
  details: 'Zusammen mit `content` bildet `name` ein Schlüssel-Wert-Paar. Gängige Namen: `viewport`, `description`, `robots`, `theme-color`, `color-scheme`, `author`. Für Social-Media-Vorschauen nutzt Open Graph stattdessen `property`.',
  values: [['viewport', 'Breite/Skalierung für mobile Geräte'], ['description', 'Seitenbeschreibung für Suchergebnisse'], ['robots', 'Anweisung an Crawler (noindex, nofollow ...)'], ['theme-color', 'Farbe der Browser-Leiste'], ['color-scheme', 'Unterstützte Farbschemata (light dark)']],
  example: '<meta name="robots" content="noindex, nofollow">\n<meta name="theme-color" content="#b4367a">\n<meta name="color-scheme" content="light dark">',
  keywords: ['meta name', 'seo', 'robots', 'viewport', 'theme-color'],
  related: ['content', 'http-equiv', 'name'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/meta/name'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'colspan',
  desc: 'Anzahl der Spalten, über die sich eine Tabellenzelle erstreckt.',
  details: 'Gilt für `<td>` und `<th>`. Standard ist 1, Werte bis 1000 sind erlaubt. Die überdeckten Zellen der Zeile dürfen nicht zusätzlich im HTML stehen, sonst entsteht ein überlappendes Tabellenmodell.',
  example: '<tr>\n  <th colspan="2">Gesamt</th>\n</tr>',
  demo: '<style>table{border-collapse:collapse}td,th{border:1px solid #888;padding:4px 10px}</style><table><tr><th colspan="2">Über zwei Spalten</th></tr><tr><td>A</td><td>B</td></tr></table>',
  keywords: ['zellen verbinden', 'spalten', 'tabelle'],
  related: ['rowspan', 'headers', 'scope'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/td#colspan'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'rowspan',
  desc: 'Anzahl der Zeilen, über die sich eine Tabellenzelle erstreckt.',
  details: 'Gilt für `<td>` und `<th>`. Standard ist 1; `0` (bis zum Ende der Zeilengruppe) wird nur unvollständig unterstützt. In den folgenden Zeilen fehlt dann die entsprechende Zelle.',
  example: '<tr>\n  <th rowspan="2">Name</th>\n  <td>Vorname</td>\n</tr>\n<tr>\n  <td>Nachname</td>\n</tr>',
  demo: '<style>table{border-collapse:collapse}td,th{border:1px solid #888;padding:4px 10px}</style><table><tr><th rowspan="2">Name</th><td>Vorname</td></tr><tr><td>Nachname</td></tr></table>',
  keywords: ['zellen verbinden', 'zeilen', 'tabelle'],
  related: ['colspan', 'headers', 'scope'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/td#rowspan'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'scope',
  desc: 'Gibt an, für welche Zellen eine Tabellenüberschrift gilt.',
  details: 'Gilt für `<th>` und hilft Screenreadern, Zeilen- und Spaltenköpfe zuzuordnen. `col` bezieht sich auf die Spalte, `row` auf die Zeile; `colgroup` und `rowgroup` auf Gruppen. Bei einfachen Tabellen erkennt der Browser das oft selbst, bei komplexen ist `scope` oder `headers` nötig.',
  values: [['col', 'Überschrift für die Spalte darunter'], ['row', 'Überschrift für die Zeile daneben'], ['colgroup', 'Für eine Spaltengruppe'], ['rowgroup', 'Für eine Zeilengruppe']],
  example: '<tr>\n  <th scope="col">Produkt</th>\n  <th scope="col">Preis</th>\n</tr>\n<tr>\n  <th scope="row">Kaffee</th>\n  <td>3,50 €</td>\n</tr>',
  keywords: ['tabelle', 'barrierefreiheit', 'überschrift'],
  related: ['headers', 'colspan', 'rowspan'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/th#scope'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'headers',
  desc: 'Verknüpft eine Datenzelle mit den zugehörigen Kopfzellen per ID.',
  details: 'Gilt für `<td>` und `<th>` und enthält eine Leerzeichen-getrennte Liste von `id`s der Überschriften-Zellen. Nötig bei komplexen Tabellen mit mehreren Kopfebenen, in denen `scope` nicht ausreicht. Für einfache Tabellen ist `scope` leichter zu pflegen.',
  example: '<th id="q1">Q1</th>\n<th id="umsatz">Umsatz</th>\n<td headers="q1 umsatz">120.000 €</td>',
  keywords: ['tabelle', 'barrierefreiheit', 'zuordnung'],
  related: ['scope', 'id', 'colspan'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/td#headers'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'datetime',
  desc: 'Maschinenlesbares Datum bzw. Zeit für time, ins und del.',
  details: 'Bei `<time>` steht dort die ISO-Form des sichtbaren Textes (`2026-11-03`, `2026-11-03T14:30`, `PT2H30M` für Dauern), damit Suchmaschinen und Skripte das Datum auswerten können. Bei `<ins>` und `<del>` gibt es den Zeitpunkt der Änderung an.',
  example: '<p>Veröffentlicht am <time datetime="2026-11-03">3. November 2026</time></p>',
  demo: '<time datetime="2026-11-03">3. November 2026</time>',
  keywords: ['datum', 'zeit', 'iso 8601', 'time'],
  related: ['cite', '<time>', '<ins>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/time#datetime'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'cite',
  desc: 'URL der Quelle eines Zitats oder einer Änderung.',
  details: 'Gilt für `<blockquote>`, `<q>`, `<ins>` und `<del>`. Der Wert ist eine URL, die Browser nicht sichtbar darstellen – für Nutzer sollte die Quelle zusätzlich als Text oder Link (`<cite>`) erscheinen.',
  example: '<blockquote cite="https://example.org/rede">\n  <p>Ein berühmtes Zitat.</p>\n</blockquote>',
  keywords: ['zitat', 'quelle', 'blockquote'],
  related: ['datetime', '<blockquote>', '<q>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/blockquote#cite'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'open',
  desc: 'Zeigt details bzw. dialog im geöffneten Zustand.',
  details: 'Gilt für `<details>` (Inhalt aufgeklappt) und `<dialog>` (sichtbar, aber nicht modal – für modal `showModal()` nutzen). Der Browser setzt und entfernt das Attribut automatisch beim Umschalten, das `toggle`-Event meldet Änderungen. Mehrere `<details>` mit gleichem `name` verhalten sich wie ein Akkordeon.',
  example: '<details open>\n  <summary>Mehr anzeigen</summary>\n  <p>Versteckter Inhalt.</p>\n</details>',
  demo: '<details open><summary>Mehr anzeigen</summary><p>Versteckter Inhalt.</p></details>',
  keywords: ['aufklappen', 'accordion', 'dialog', 'details'],
  related: ['hidden', 'popover', 'aria-expanded'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/details#open'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'start',
  desc: 'Startnummer einer geordneten Liste.',
  details: 'Gilt für `<ol>` und nimmt eine ganze Zahl (auch negativ). Praktisch, wenn eine Liste nach einer Unterbrechung weiterzählt. Unabhängig vom Zähltyp: Bei `type="a"` bedeutet `start="3"` den Buchstaben c.',
  example: '<ol start="5">\n  <li>Fünftens</li>\n  <li>Sechstens</li>\n</ol>',
  demo: '<ol start="5"><li>Fünftens</li><li>Sechstens</li></ol>',
  keywords: ['liste', 'nummerierung', 'ol'],
  related: ['reversed', '<ol>', 'type'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/ol#start'
},
{
  lang: 'html', group: 'Meta- & Tabellen-Attribute', name: 'reversed',
  desc: 'Nummeriert eine geordnete Liste absteigend.',
  details: 'Boolesches Attribut für `<ol>`; praktisch für Ranglisten oder Countdowns. Mit `start` lässt sich die Anfangszahl bestimmen, sonst zählt die Liste von der Anzahl der Einträge herunter.',
  example: '<ol reversed>\n  <li>Platz 3</li>\n  <li>Platz 2</li>\n  <li>Platz 1</li>\n</ol>',
  demo: '<ol reversed><li>Drei</li><li>Zwei</li><li>Eins</li></ol>',
  keywords: ['liste', 'absteigend', 'countdown'],
  related: ['start', '<ol>'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Element/ol#reversed'
}
);

window.CHEAT.push(
{
  lang: 'html', group: 'Event-Attribute', name: 'onclick',
  desc: 'Inline-Handler: wird bei einem Klick ausgeführt.',
  details: 'Der Attributwert ist JavaScript-Code. Inline-Handler vermischen Struktur und Logik, funktionieren nicht mit strikter CSP (ohne `unsafe-inline`) und lassen sich schlecht testen. Meist ist `element.addEventListener("click", ...)` im Skript vorzuziehen. Nutze für klickbare Elemente native `<button>` statt `<div onclick>`.',
  example: '<button onclick="alert(\'Hallo!\')">Klick mich</button>',
  keywords: ['klick', 'event', 'handler', 'maus'],
  related: ['ondblclick', 'onkeydown'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/HTML/Attributes#event_handler_attributes'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'ondblclick',
  desc: 'Inline-Handler: wird bei einem Doppelklick ausgeführt.',
  details: 'Wird nach zwei schnellen Klicks ausgelöst. Auf Touchgeräten und per Tastatur ist Doppelklick schwer bedienbar – die Aktion sollte auch anders erreichbar sein. Meist ist `addEventListener("dblclick", ...)` im Skript vorzuziehen.',
  example: '<p ondblclick="this.contentEditable = true">Doppelklick zum Bearbeiten</p>',
  keywords: ['doppelklick', 'event', 'maus'],
  related: ['onclick', 'contenteditable'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Element/dblclick_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'oninput',
  desc: 'Inline-Handler: wird bei jeder Änderung des Eingabewerts ausgelöst.',
  details: 'Feuert sofort bei jedem Tastendruck, Einfügen oder Schieberegler-Bewegen in `<input>`, `<textarea>` und `contenteditable`. Ideal für Live-Vorschau oder Zeichenzähler. Meist ist `addEventListener("input", ...)` im Skript vorzuziehen.',
  example: '<input type="text" oninput="zaehler.textContent = this.value.length">\n<span id="zaehler">0</span>',
  keywords: ['eingabe', 'live', 'tastatur', 'event'],
  related: ['onchange', 'onkeydown'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Element/input_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onchange',
  desc: 'Inline-Handler: wird bei einer abgeschlossenen Wertänderung ausgelöst.',
  details: 'Bei Textfeldern erst nach dem Verlassen des Felds (Blur), bei `<select>`, Checkbox und Radio sofort bei der Auswahl. Wer jede Änderung live braucht, nutzt `oninput`. Meist ist `addEventListener("change", ...)` im Skript vorzuziehen.',
  example: '<select onchange="location.href = this.value">\n  <option value="/de">Deutsch</option>\n  <option value="/en">English</option>\n</select>',
  keywords: ['änderung', 'auswahl', 'select', 'event'],
  related: ['oninput', 'onblur'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/HTMLElement/change_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onsubmit',
  desc: 'Inline-Handler: wird beim Absenden eines Formulars ausgeführt.',
  details: 'Gilt für `<form>`. Gibt der Handler `false` zurück oder wird `event.preventDefault()` aufgerufen, wird das Formular nicht gesendet. Er feuert nicht beim Aufruf von `form.submit()`. Meist ist `addEventListener("submit", ...)` im Skript vorzuziehen.',
  example: '<form onsubmit="return confirm(\'Wirklich senden?\')">\n  <button>Senden</button>\n</form>',
  keywords: ['formular', 'absenden', 'validierung', 'event'],
  related: ['onreset', 'action', 'novalidate'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/HTMLFormElement/submit_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onreset',
  desc: 'Inline-Handler: wird beim Zurücksetzen eines Formulars ausgeführt.',
  details: 'Gilt für `<form>` und wird durch einen `type="reset"`-Button oder `form.reset()` ausgelöst. Mit `preventDefault()` kann man das Zurücksetzen verhindern. Reset-Buttons sind selten sinnvoll, da sie versehentlich alle Eingaben löschen. Meist ist `addEventListener("reset", ...)` vorzuziehen.',
  example: '<form onreset="return confirm(\'Alles zurücksetzen?\')">\n  <input name="x">\n  <button type="reset">Zurücksetzen</button>\n</form>',
  keywords: ['formular', 'zurücksetzen', 'reset', 'event'],
  related: ['onsubmit', 'type'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/HTMLFormElement/reset_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onload',
  desc: 'Inline-Handler: wird ausgeführt, sobald das Element fertig geladen ist.',
  details: 'Am `<body>` bzw. `window` feuert er, wenn die ganze Seite samt Ressourcen geladen ist; an `<img>`, `<iframe>`, `<script>`, `<link>` für die jeweilige Ressource. Für Skripte, die nur das DOM brauchen, ist `DOMContentLoaded` früher und besser. Meist ist `addEventListener("load", ...)` vorzuziehen.',
  example: '<img src="bild.jpg" alt="Foto" onload="this.classList.add(\'geladen\')">',
  keywords: ['geladen', 'seite laden', 'event', 'bild'],
  related: ['onerror', 'defer'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Window/load_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onerror',
  desc: 'Inline-Handler: wird bei einem Ladefehler oder Skriptfehler ausgeführt.',
  details: 'An `<img>`, `<script>`, `<audio>`, `<video>` oder `<link>` meldet er, dass die Ressource nicht geladen werden konnte – z. B. um ein Ersatzbild einzusetzen. Aufpassen auf Endlosschleifen, wenn das Ersatzbild selbst fehlt. Meist ist `addEventListener("error", ...)` vorzuziehen.',
  example: '<img src="avatar.jpg" alt="Avatar" onerror="this.onerror = null; this.src = \'fallback.png\'">',
  keywords: ['fehler', 'fallback', 'bild', 'event'],
  related: ['onload', 'alt'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/HTMLElement/error_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onkeydown',
  desc: 'Inline-Handler: wird beim Herunterdrücken einer Taste ausgeführt.',
  details: 'Feuert bei jeder gedrückten Taste und wiederholt sich bei gehaltener Taste. Über `event.key` und `event.code` erkennt man die Taste. Bei Eingaben in Text ist meist `oninput` besser geeignet. Meist ist `addEventListener("keydown", ...)` vorzuziehen; Tastaturnutzer dürfen bei eigenen Bedienelementen nicht ausgeschlossen werden.',
  example: '<input onkeydown="if (event.key === \'Enter\') suchen()">',
  keywords: ['taste', 'tastatur', 'keyboard', 'event', 'enter'],
  related: ['onkeyup', 'oninput'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Element/keydown_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onkeyup',
  desc: 'Inline-Handler: wird beim Loslassen einer Taste ausgeführt.',
  details: 'Feuert einmal pro losgelassener Taste, nachdem der Wert im Feld bereits aktualisiert wurde. Für Eingaben ist heute `oninput` zuverlässiger (z. B. bei Einfügen per Maus oder Spracheingabe). Meist ist `addEventListener("keyup", ...)` vorzuziehen.',
  example: '<input onkeyup="console.log(this.value)">',
  keywords: ['taste', 'tastatur', 'loslassen', 'event'],
  related: ['onkeydown', 'oninput'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Element/keyup_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onmouseover',
  desc: 'Inline-Handler: wird ausgeführt, wenn der Mauszeiger über das Element fährt.',
  details: 'Feuert beim Betreten des Elements oder eines seiner Kinder (mit Bubbling). Für reines Hover-Styling gehört das in CSS (`:hover`). Auf Touchgeräten gibt es kein echtes Hover – Funktionen nicht ausschließlich daran koppeln. Meist ist `addEventListener("mouseover", ...)` vorzuziehen.',
  example: '<img src="a.jpg" alt="" onmouseover="this.src = \'b.jpg\'" onmouseout="this.src = \'a.jpg\'">',
  keywords: ['hover', 'maus', 'event'],
  related: ['onmouseout', 'onfocus'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Element/mouseover_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onmouseout',
  desc: 'Inline-Handler: wird ausgeführt, wenn der Mauszeiger das Element verlässt.',
  details: 'Gegenstück zu `onmouseover`. Feuert auch beim Wechsel auf ein Kindelement; wer das vermeiden will, nutzt `mouseleave`/`mouseenter`. Reine Darstellungseffekte löst man besser mit CSS. Meist ist `addEventListener("mouseout", ...)` vorzuziehen.',
  example: '<div onmouseout="this.style.background = \'\'">Hover-Bereich</div>',
  keywords: ['hover', 'maus', 'verlassen', 'event'],
  related: ['onmouseover', 'onblur'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Element/mouseout_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onfocus',
  desc: 'Inline-Handler: wird ausgeführt, wenn ein Element den Fokus erhält.',
  details: 'Feuert z. B. beim Klick in ein Feld oder per Tab. Das Event bubbelt nicht (dafür `focusin`). Meist ist `addEventListener("focus", ...)` vorzuziehen; für Styling reicht `:focus` bzw. `:focus-visible` in CSS.',
  example: '<input onfocus="this.select()" value="Alles markieren">',
  keywords: ['fokus', 'focus', 'event', 'markieren'],
  related: ['onblur', 'tabindex', 'autofocus'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Element/focus_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onblur',
  desc: 'Inline-Handler: wird ausgeführt, wenn ein Element den Fokus verliert.',
  details: 'Typisch für Validierung nach dem Verlassen eines Felds. Das Event bubbelt nicht (dafür `focusout`). Meist ist `addEventListener("blur", ...)` vorzuziehen.',
  example: '<input type="email" onblur="pruefeMail(this)">',
  keywords: ['fokus verloren', 'blur', 'validierung', 'event'],
  related: ['onfocus', 'onchange'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Element/blur_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onscroll',
  desc: 'Inline-Handler: wird beim Scrollen eines Elements oder der Seite ausgeführt.',
  details: 'Feuert sehr häufig, daher sollte der Handler schlank sein oder gedrosselt werden. Für „Element wird sichtbar“ ist `IntersectionObserver` effizienter. Das Event bubbelt nicht, außer bei `document`. Meist ist `addEventListener("scroll", ..., { passive: true })` vorzuziehen.',
  example: '<div style="height:200px;overflow:auto" onscroll="console.log(this.scrollTop)">...</div>',
  keywords: ['scrollen', 'scroll', 'event', 'intersectionobserver'],
  related: ['onresize'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Element/scroll_event'
},
{
  lang: 'html', group: 'Event-Attribute', name: 'onresize',
  desc: 'Inline-Handler: wird bei Größenänderung des Fensters ausgeführt.',
  details: 'Als Attribut nur am `<body>` wirksam (entspricht `window.onresize`). Feuert sehr häufig beim Ziehen. Für Größenänderung einzelner Elemente nutzt man `ResizeObserver`, für Layout-Anpassungen CSS-Media-Queries oder Container Queries. Meist ist `addEventListener("resize", ...)` vorzuziehen.',
  example: '<body onresize="console.log(window.innerWidth)">',
  keywords: ['fenstergröße', 'resize', 'event', 'resizeobserver'],
  related: ['onscroll', 'onload'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/API/Window/resize_event'
}
);
window.CHEAT.push(
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'role',
  desc: 'Legt die semantische Rolle eines Elements für Hilfstechnik fest.',
  details: 'Erste Regel von ARIA: Wenn ein natives Element die Semantik schon mitbringt (`<button>`, `<nav>`, `<dialog>`), verwende dieses statt `role` auf einem `<div>`. Eine Rolle ändert nur, was Screenreader ansagen – nicht das Verhalten oder die Tastaturbedienung. Redundante Rollen (`<button role="button">`) sind überflüssig.',
  values: [['button', 'Schaltfläche'], ['dialog / alertdialog', 'Dialog / Warndialog'], ['alert', 'Wichtige Meldung, wird sofort vorgelesen'], ['status', 'Statusmeldung, höflich vorgelesen'], ['tablist / tab / tabpanel', 'Tab-Widget'], ['navigation, main, banner, contentinfo', 'Landmarks (besser: native Elemente)'], ['presentation / none', 'Semantik entfernen'], ['img', 'Als Bild behandeln (z. B. Icon-Gruppe)']],
  example: '<div role="alert">Speichern fehlgeschlagen.</div>\n<ul role="list">...</ul>',
  keywords: ['aria', 'rolle', 'semantik', 'accessibility', 'barrierefreiheit'],
  related: ['aria-label', 'aria-live', 'tabindex'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Roles'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-label',
  desc: 'Direkter zugänglicher Name eines Elements als Text.',
  details: 'Gibt Elementen ohne sichtbaren Text einen Namen, etwa einem Icon-Button (`<button aria-label="Schließen">✕</button>`) oder mehreren `<nav>`-Landmarks. Ist sichtbarer Text vorhanden, ist dieser dem Attribut vorzuziehen. Nicht auf Elementen ohne Rolle wie `<div>` oder `<span>` verwenden; der Text wird nicht automatisch übersetzt.',
  example: '<button aria-label="Menü schließen">\n  <svg aria-hidden="true">...</svg>\n</button>\n<nav aria-label="Hauptnavigation">...</nav>',
  keywords: ['zugänglicher name', 'screenreader', 'icon button', 'beschriftung'],
  related: ['aria-labelledby', 'aria-describedby', 'title', 'for'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-label'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-labelledby',
  desc: 'Benennt ein Element über die ID eines anderen sichtbaren Elements.',
  details: 'Der Wert ist eine Liste von `id`s (Leerzeichen-getrennt), deren Texte zum Namen zusammengesetzt werden. Hat Vorrang vor `aria-label` und nativen Beschriftungen. Ideal, um einen Dialog oder eine Region mit ihrer sichtbaren Überschrift zu verbinden.',
  example: '<section aria-labelledby="titel-news">\n  <h2 id="titel-news">Neuigkeiten</h2>\n  ...\n</section>',
  keywords: ['zugänglicher name', 'überschrift', 'region', 'dialog'],
  related: ['aria-label', 'aria-describedby', 'id', 'for'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-describedby',
  desc: 'Verweist auf Elemente, die eine ergänzende Beschreibung liefern.',
  details: 'Im Gegensatz zum Namen ist die Beschreibung eine Zusatzinformation, die nach dem Namen vorgelesen wird: Hinweise zum Passwortformat, Fehlermeldungen, Hilfetexte. Wert ist eine Liste von `id`s. Das referenzierte Element darf auch ausgeblendet sein.',
  example: '<input type="password" id="pw" aria-describedby="pw-hinweis">\n<p id="pw-hinweis">Mindestens 8 Zeichen.</p>',
  keywords: ['beschreibung', 'hilfetext', 'fehlermeldung', 'hinweis'],
  related: ['aria-labelledby', 'aria-invalid', 'title'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-describedby'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-hidden',
  desc: 'Versteckt ein Element vor der Hilfstechnik, nicht aber optisch.',
  details: 'Mit `aria-hidden="true"` blendet man rein dekorative Elemente wie Icons aus dem Accessibility-Tree aus. Niemals auf fokussierbare Elemente setzen – sie wären per Tab erreichbar, aber „unsichtbar“. Soll etwas für alle verschwinden, nimmt man `hidden`; für den Hintergrund eines Modals `inert`.',
  example: '<button>\n  <span aria-hidden="true">★</span> Favorit\n</button>',
  keywords: ['dekorativ', 'ausblenden', 'screenreader', 'icon'],
  related: ['hidden', 'inert', 'role'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-hidden'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-expanded',
  desc: 'Zeigt an, ob ein steuerbarer Bereich auf- oder zugeklappt ist.',
  details: 'Gehört an das Steuerelement (Button, Link), nicht an den Bereich. Werte `true`/`false`; muss per JavaScript synchron zum sichtbaren Zustand gehalten werden. Bei `<details>` ist der Zustand bereits eingebaut, dort nicht zusätzlich setzen.',
  values: [['true', 'Bereich ist geöffnet'], ['false', 'Bereich ist geschlossen']],
  example: '<button aria-expanded="false" aria-controls="menue">Menü</button>\n<ul id="menue" hidden>...</ul>',
  keywords: ['aufklappen', 'menü', 'accordion', 'dropdown'],
  related: ['aria-controls', 'aria-haspopup', 'open'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-expanded'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-controls',
  desc: 'Verweist auf das Element, das dieses Element steuert.',
  details: 'Wert ist die `id` (oder mehrere) des gesteuerten Bereichs, z. B. Panel eines Tabs oder aufklappbares Menü. Die Unterstützung durch Screenreader ist uneinheitlich, daher zusätzlich Zustand wie `aria-expanded` pflegen. Für `popover` übernimmt `popovertarget` diese Verknüpfung.',
  example: '<button aria-controls="panel1" aria-expanded="false">Details</button>\n<div id="panel1">...</div>',
  keywords: ['steuert', 'tab', 'panel', 'verknüpfung'],
  related: ['aria-expanded', 'popovertarget', 'id'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-controls'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-current',
  desc: 'Markiert das aktuelle Element in einer Menge zusammengehöriger Elemente.',
  details: 'Typisch ist `aria-current="page"` am Link zur aktuell geöffneten Seite in einer Navigation. Weitere Werte: `step` (Schritt im Ablauf), `location`, `date`, `time`; `true` ist allgemein. Ohne Attribut wird die aktuelle Seite nur visuell erkennbar.',
  values: [['page', 'Aktuelle Seite in einer Navigation'], ['step', 'Aktueller Schritt'], ['location', 'Aktueller Ort'], ['date / time', 'Aktuelles Datum / Zeit'], ['true', 'Allgemein aktuell'], ['false', 'Nicht aktuell (Standard)']],
  example: '<nav aria-label="Hauptnavigation">\n  <a href="/" aria-current="page">Start</a>\n  <a href="/kontakt">Kontakt</a>\n</nav>',
  demo: '<style>a[aria-current]{font-weight:bold;color:#b4367a}</style><nav><a href="#" aria-current="page">Start</a> | <a href="#">Kontakt</a></nav>',
  keywords: ['navigation', 'aktiv', 'aktuelle seite', 'menü'],
  related: ['aria-label', 'role'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-current'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-live',
  desc: 'Definiert eine Live-Region, deren Änderungen automatisch vorgelesen werden.',
  details: 'Die Region muss bereits beim Laden im DOM sein, erst ihr Inhalt wird später geändert. `polite` wartet, bis der Nutzer fertig ist, `assertive` unterbricht sofort – nur für Dringendes. Für typische Fälle genügen `role="status"` (polite) und `role="alert"` (assertive).',
  values: [['off', 'Keine Ansage (Standard)'], ['polite', 'Ansage bei nächster Gelegenheit'], ['assertive', 'Sofortige Ansage, unterbricht']],
  example: '<div aria-live="polite" id="status"></div>\n<!-- per JS: status.textContent = "3 Treffer gefunden" -->',
  keywords: ['live region', 'statusmeldung', 'screenreader', 'dynamisch'],
  related: ['role', 'aria-hidden'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-live'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-pressed',
  desc: 'Zustand eines Umschalt-Buttons (gedrückt oder nicht).',
  details: 'Macht aus einem Button einen Toggle-Button (z. B. „Fett“, „Stumm“). Der Name des Buttons sollte sich beim Umschalten nicht ändern, nur der Zustand. Werte `true`, `false` oder `mixed`. Für Auswahlfelder sind native Checkboxen besser.',
  values: [['true', 'Gedrückt / aktiv'], ['false', 'Nicht gedrückt'], ['mixed', 'Teilweise (Dreizustand)']],
  example: '<button type="button" aria-pressed="false">Stumm</button>',
  keywords: ['toggle', 'umschalter', 'button'],
  related: ['aria-checked', 'aria-expanded'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-pressed'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-checked',
  desc: 'Zustand eines benutzerdefinierten Checkbox-, Radio- oder Switch-Elements.',
  details: 'Nur für Elemente mit Rolle `checkbox`, `radio`, `switch`, `menuitemcheckbox` usw. nötig. Bei nativen `<input type="checkbox">` nicht verwenden – dort liefert `checked` den Zustand. Werte `true`, `false`, bei Checkboxen auch `mixed`.',
  example: '<div role="checkbox" aria-checked="true" tabindex="0">Newsletter</div>',
  keywords: ['checkbox', 'switch', 'zustand', 'custom'],
  related: ['checked', 'aria-pressed', 'role'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-checked'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-disabled',
  desc: 'Kennzeichnet ein Element als deaktiviert, ohne es zu sperren.',
  details: 'Anders als das native `disabled` bleibt das Element fokussierbar, Screenreader sagen aber „nicht verfügbar“. Das Verhalten (kein Absenden, kein Handler) muss man selbst implementieren. Bei nativen Formularfeldern ist `disabled` die bessere Wahl.',
  example: '<button type="button" aria-disabled="true">Weiter</button>',
  keywords: ['deaktiviert', 'ausgegraut', 'fokussierbar'],
  related: ['disabled', 'readonly'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-disabled'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-invalid',
  desc: 'Zeigt an, dass der Wert eines Felds ungültig ist.',
  details: 'Setze `aria-invalid="true"` erst nach der Prüfung (z. B. nach dem Absenden oder Blur) und verknüpfe die Fehlermeldung per `aria-describedby`. Bei Verwendung der nativen Validierung (`required`, `pattern`) ergänzen Browser den Zustand bereits selbst. Auch Farbe allein darf den Fehler nicht ausdrücken.',
  values: [['true', 'Wert ist ungültig'], ['false', 'Wert ist gültig (Standard)']],
  example: '<input type="email" aria-invalid="true" aria-describedby="mail-fehler">\n<p id="mail-fehler">Bitte eine gültige E-Mail eingeben.</p>',
  keywords: ['fehler', 'validierung', 'ungültig'],
  related: ['aria-describedby', 'required', 'pattern'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-invalid'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-required',
  desc: 'Kennzeichnet ein benutzerdefiniertes Feld als Pflichtfeld.',
  details: 'Für native Felder reicht das HTML-Attribut `required`, das zugleich die Browser-Validierung auslöst. `aria-required` ist nur für eigene Widgets mit passender Rolle (`combobox`, `textbox`, `listbox`) gedacht und validiert nichts.',
  example: '<div role="textbox" contenteditable aria-required="true"></div>',
  keywords: ['pflichtfeld', 'erforderlich', 'custom widget'],
  related: ['required', 'aria-invalid'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-required'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-haspopup',
  desc: 'Zeigt an, dass ein Element ein Popup (Menü, Dialog ...) öffnet.',
  details: 'Gehört an den auslösenden Button. Der Wert nennt den Typ des Popups: `menu`, `listbox`, `tree`, `grid`, `dialog`; `true` entspricht `menu`. Für einfache Disclosure-Muster ist stattdessen `aria-expanded` passend.',
  values: [['menu / true', 'Menü'], ['listbox', 'Auswahlliste'], ['tree', 'Baumstruktur'], ['grid', 'Raster'], ['dialog', 'Dialog'], ['false', 'Kein Popup (Standard)']],
  example: '<button aria-haspopup="menu" aria-expanded="false">Aktionen</button>',
  keywords: ['menü', 'popup', 'dropdown'],
  related: ['aria-expanded', 'popover', 'aria-controls'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup'
},
{
  lang: 'html', group: 'ARIA & Barrierefreiheit', name: 'aria-modal',
  desc: 'Kennzeichnet einen Dialog als modal: Inhalt dahinter ist nicht bedienbar.',
  details: 'Gehört an ein Element mit `role="dialog"` oder `alertdialog`. Es teilt Hilfstechnik nur mit, dass der Hintergrund inaktiv ist – man muss ihn selbst sperren (`inert`, Fokusfalle). Das native `<dialog>` mit `showModal()` erledigt all das automatisch und braucht kein `aria-modal`.',
  values: [['true', 'Modal'], ['false', 'Nicht modal (Standard)']],
  example: '<div role="dialog" aria-modal="true" aria-labelledby="dlg-titel">\n  <h2 id="dlg-titel">Löschen?</h2>\n</div>',
  keywords: ['modal', 'dialog', 'fokus', 'overlay'],
  related: ['role', 'inert', 'aria-labelledby', 'open'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/Accessibility/ARIA/Attributes/aria-modal'
}
);

window.CHEAT.push(
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&amp;',
  desc: 'Das kaufmännische Und-Zeichen &.',
  details: 'Das & leitet im HTML eine Entity ein und muss daher im Text (und in Attributwerten wie URLs mit mehreren Parametern) als `&amp;` geschrieben werden. Im Fließtext verzeihen Browser ein einzelnes &, aber nicht bei mehrdeutigen Folgen wie `&copy`.',
  example: '<p>Fish &amp; Chips</p>\n<a href="/suche?a=1&amp;b=2">Suche</a>',
  demo: '<p>Fish &amp; Chips</p>',
  keywords: ['und', 'ampersand', 'kaufmännisches und'],
  related: ['&lt;', 'Numerische Entities'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&lt;',
  desc: 'Das Kleiner-als-Zeichen <.',
  details: 'Damit Text nicht als Beginn eines Tags interpretiert wird, schreibt man `<` als `&lt;`. Unverzichtbar, wenn HTML-Code als Text auf einer Seite angezeigt werden soll.',
  example: '<p>Der Tag &lt;div&gt; ist ein Container.</p>',
  demo: '<p>Der Tag &lt;div&gt; ist ein Container.</p>',
  keywords: ['kleiner als', 'tag anzeigen', 'escape', 'less than'],
  related: ['&gt;', '&amp;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&gt;',
  desc: 'Das Größer-als-Zeichen >.',
  details: 'Im Text ist ein nacktes `>` erlaubt, wird aber zusammen mit `&lt;` konsequent als `&gt;` geschrieben, um HTML-Code lesbar darzustellen und Fehler zu vermeiden.',
  example: '<p>a &lt; b &gt; c</p>',
  demo: '<p>a &lt; b &gt; c</p>',
  keywords: ['größer als', 'tag anzeigen', 'escape', 'greater than'],
  related: ['&lt;', '&amp;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&quot;',
  desc: 'Das doppelte Anführungszeichen ".',
  details: 'Nötig innerhalb eines mit `"` begrenzten Attributwerts, damit das Zeichen den Wert nicht beendet. Im normalen Text kann man `"` direkt schreiben. Typografisch korrekte deutsche Anführungszeichen sind `&bdquo;` und `&ldquo;`.',
  example: '<input value="Er sagte &quot;Hallo&quot;">',
  demo: '<input value="Er sagte &quot;Hallo&quot;">',
  keywords: ['anführungszeichen', 'gänsefüßchen', 'quote', 'attribut'],
  related: ['&apos;', '&bdquo;', '&ldquo;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&apos;',
  desc: 'Das einfache Anführungszeichen / der Apostroph \'.',
  details: '`&apos;` ist in HTML5 definiert, in XHTML/XML ebenfalls; in altem HTML 4 und Internet Explorer nicht. Universell funktioniert die numerische Form `&#39;`. Nötig innerhalb eines mit `\'` begrenzten Attributwerts.',
  example: '<p title=\'Das ist&apos;s\'>Apostroph</p>\n<p>Das ist&#39;s auch möglich</p>',
  demo: '<p>Das ist&apos;s</p>',
  keywords: ['apostroph', 'einfaches anführungszeichen', 'single quote'],
  related: ['&quot;', 'Numerische Entities'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&nbsp;',
  desc: 'Geschütztes Leerzeichen (Non-Breaking Space).',
  details: 'Verhindert einen Zeilenumbruch an dieser Stelle und wird (anders als normale Leerzeichen) nicht zusammengefasst. Sinnvoll zwischen Zahl und Einheit (`10&nbsp;kg`) oder in Abkürzungen (`z.&nbsp;B.`). Nicht zum Layouten durch Mehrfachleerzeichen einsetzen – dafür gibt es CSS.',
  example: '<p>Preis: 10&nbsp;€, z.&nbsp;B. pro Stück</p>',
  demo: '<p>Zehn&nbsp;&nbsp;&nbsp;&nbsp;Leerzeichen bleiben erhalten, 10&nbsp;kg umbricht nicht.</p>',
  keywords: ['leerzeichen', 'geschützt', 'umbruch verhindern', 'non-breaking'],
  related: ['&shy;', 'Numerische Entities'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&shy;',
  desc: 'Weiches Trennzeichen (Soft Hyphen) für mögliche Silbentrennung.',
  details: 'Unsichtbar, solange das Wort in die Zeile passt; an der Stelle eines Umbruchs erscheint ein Trennstrich. Hilft bei langen deutschen Komposita in schmalen Spalten. Alternativ `hyphens: auto` in CSS zusammen mit korrektem `lang`.',
  example: '<p>Donau&shy;dampf&shy;schiff&shy;fahrts&shy;gesellschaft</p>',
  demo: '<p style="width:90px;border:1px solid #aaa">Donau&shy;dampf&shy;schiff&shy;fahrts&shy;gesellschaft</p>',
  keywords: ['trennung', 'silbentrennung', 'bindestrich', 'hyphen'],
  related: ['&nbsp;'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/hyphens'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&copy;',
  desc: 'Copyright-Zeichen ©.',
  details: 'Wird im Seitenfuß für Urheberrechtshinweise verwendet. Wenn die Datei als UTF-8 gespeichert ist, kann man © auch direkt schreiben; die Entity ist unabhängig von der Kodierung.',
  example: '<footer>&copy; 2026 Beispiel GmbH</footer>',
  demo: '<p>&copy; 2026 Beispiel GmbH</p>',
  keywords: ['urheberrecht', 'copyright', 'impressum', 'footer'],
  related: ['&reg;', '&trade;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&reg;',
  desc: 'Registered-Trademark-Zeichen ®.',
  details: 'Kennzeichnet eine eingetragene Marke. Wird meist hochgestellt hinter dem Markennamen verwendet (`<sup>`).',
  example: '<p>Marke<sup>&reg;</sup></p>',
  demo: '<p>Marke<sup>&reg;</sup></p>',
  keywords: ['marke', 'eingetragen', 'registered'],
  related: ['&trade;', '&copy;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&trade;',
  desc: 'Trademark-Zeichen ™.',
  details: 'Kennzeichnet eine (nicht zwingend eingetragene) Marke. Üblich ist die Hochstellung direkt nach dem Namen.',
  example: '<p>Produkt&trade;</p>',
  demo: '<p>Produkt&trade;</p>',
  keywords: ['marke', 'trademark', 'handelsmarke'],
  related: ['&reg;', '&copy;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&euro;',
  desc: 'Euro-Zeichen €.',
  details: 'Steht im Deutschen meist hinter dem Betrag mit geschütztem Leerzeichen (`19,99&nbsp;&euro;`). Das Zeichen fehlt in alten Zeichensätzen wie ISO-8859-1 – daher ist die Entity dort die sichere Wahl.',
  example: '<p>Preis: 19,99&nbsp;&euro;</p>',
  demo: '<p>Preis: 19,99&nbsp;&euro;</p>',
  keywords: ['euro', 'währung', 'preis', 'geld'],
  related: ['&nbsp;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&mdash;',
  desc: 'Langer Gedankenstrich —.',
  details: 'Geviertstrich, im Deutschen selten; hier verwendet man meist den Halbgeviertstrich `&ndash;`. Im Englischen markiert er Einschübe ohne umgebende Leerzeichen.',
  example: '<p>Das ist wichtig &mdash; wirklich.</p>',
  demo: '<p>Das ist wichtig &mdash; wirklich.</p>',
  keywords: ['gedankenstrich', 'geviertstrich', 'em dash', 'strich'],
  related: ['&ndash;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&ndash;',
  desc: 'Halbgeviertstrich – (Gedankenstrich, Bis-Strich).',
  details: 'Im Deutschen der übliche Gedankenstrich (mit Leerzeichen umgeben) und der „bis“-Strich bei Bereichen (`10&ndash;20`, `Mo&ndash;Fr`). Länger als der Bindestrich `-`, der nur in Wörtern steht.',
  example: '<p>Öffnungszeiten: Mo&ndash;Fr 9&ndash;18 Uhr</p>',
  demo: '<p>Öffnungszeiten: Mo&ndash;Fr 9&ndash;18 Uhr</p>',
  keywords: ['gedankenstrich', 'bis-strich', 'en dash', 'bereich'],
  related: ['&mdash;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&hellip;',
  desc: 'Auslassungspunkte …',
  details: 'Ein einziges Zeichen für drei Punkte, typografisch sauberer als `...`. Wird für Auslassungen, abgeschnittenen Text oder Hinweise wie „Laden…“ eingesetzt.',
  example: '<p>Wird geladen&hellip;</p>',
  demo: '<p>Wird geladen&hellip;</p>',
  keywords: ['punkte', 'auslassung', 'ellipsis', 'drei punkte'],
  related: ['&mdash;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&laquo;',
  desc: 'Doppeltes spitzes Anführungszeichen links «.',
  details: 'Guillemets sind in Frankreich, der Schweiz und (umgekehrt gesetzt) in Deutschland gebräuchlich: In Deutschland schreibt man `&raquo;Text&laquo;`, in der Schweiz und Frankreich `&laquo;Text&raquo;`. Die Alternative im Deutschen sind „…“ (`&bdquo;`/`&ldquo;`). Für semantische Zitate gibt es zudem `<q>`.',
  example: '<p>&raquo;Hallo&laquo; (DE) und &laquo;Salut&raquo; (CH)</p>',
  demo: '<p>&raquo;Hallo&laquo; (DE) und &laquo;Salut&raquo; (CH)</p>',
  keywords: ['guillemets', 'anführungszeichen', 'französisch', 'zitat'],
  related: ['&raquo;', '&bdquo;', '&ldquo;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&raquo;',
  desc: 'Doppeltes spitzes Anführungszeichen rechts ».',
  details: 'Gegenstück zu `&laquo;`. Wird in deutscher Typografie zum Öffnen eines Zitats verwendet (»Zitat«), in der Schweiz zum Schließen. Außerdem beliebt als Pfeil-Symbol in Links (`Weiter &raquo;`) oder Breadcrumbs.',
  example: '<a href="/weiter">Weiter &raquo;</a>',
  demo: '<a href="#">Weiter &raquo;</a>',
  keywords: ['guillemets', 'anführungszeichen', 'pfeil', 'weiter'],
  related: ['&laquo;', '&bdquo;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&bdquo;',
  desc: 'Doppeltes Anführungszeichen unten (öffnend im Deutschen) „.',
  details: 'Das deutsche öffnende Anführungszeichen steht unten; das schließende ist `&ldquo;` (oben, wie „ ... “). Ein typisches Gegenstück zu englischen “ ”. Alternativ erzeugt `<q>` mit `lang="de"` automatisch die passenden Zeichen.',
  example: '<p>Er sagte: &bdquo;Hallo!&ldquo;</p>',
  demo: '<p>Er sagte: &bdquo;Hallo!&ldquo;</p>',
  keywords: ['anführungszeichen', 'deutsch', 'gänsefüßchen', 'zitat'],
  related: ['&ldquo;', '&laquo;', '&quot;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&ldquo;',
  desc: 'Doppeltes Anführungszeichen oben links “ (im Deutschen schließend).',
  details: 'Im Deutschen steht es als schließendes Zeichen („Zitat“); im Englischen ist es das öffnende Zeichen (“quote”). Passend zu `&bdquo;` für deutsche Anführungszeichen. Das rechte Gegenstück ist `&rdquo;`.',
  example: '<p>&bdquo;Deutsch&ldquo; und &ldquo;English&rdquo;</p>',
  demo: '<p>&bdquo;Deutsch&ldquo; und &ldquo;English&rdquo;</p>',
  keywords: ['anführungszeichen', 'english quote', 'schließend'],
  related: ['&bdquo;', '&laquo;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&times;',
  desc: 'Multiplikationszeichen ×.',
  details: 'Das echte Malzeichen, typografisch korrekt statt des Buchstabens x (`3 &times; 4`) oder für Maße (`1920&times;1080`). Wird oft auch als „Schließen“-Symbol verwendet – dann gehört `aria-label` an den Button.',
  example: '<p>1920 &times; 1080 Pixel</p>\n<button aria-label="Schließen">&times;</button>',
  demo: '<p>3 &times; 4 = 12</p>',
  keywords: ['mal', 'multiplikation', 'kreuz', 'schließen'],
  related: ['&divide;', 'aria-label'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: '&divide;',
  desc: 'Divisionszeichen ÷.',
  details: 'Das Geteilt-durch-Zeichen für Rechenaufgaben und Taschenrechner. In Formeln mit größerer Struktur ist MathML besser geeignet.',
  example: '<p>12 &divide; 4 = 3</p>',
  demo: '<p>12 &divide; 4 = 3</p>',
  keywords: ['geteilt', 'division', 'mathe'],
  related: ['&times;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
},
{
  lang: 'html', group: 'Sonderzeichen (Entities)', name: 'Numerische Entities',
  desc: 'Beliebige Unicode-Zeichen per Codepoint: &#169; (dezimal) oder &#x00A9; (hexadezimal).',
  details: 'Schema `&#Dezimalzahl;` oder `&#xHexzahl;` mit dem Unicode-Codepoint. Damit lässt sich jedes Zeichen schreiben, auch wenn es keinen benannten Namen gibt oder die Datei nicht UTF-8 ist (`&#9731;` = ☃, `&#128512;` = 😀). Das Semikolon am Ende ist Pflicht.',
  syntax: '&#169;   &#x00A9;',
  example: '<p>&#169; &#x00A9; &#9731; &#128512;</p>',
  demo: '<p style="font-size:1.5em">&#169; &#x00A9; &#9731; &#128512;</p>',
  keywords: ['unicode', 'codepoint', 'hex', 'dezimal', 'emoji', 'zeichen'],
  related: ['&copy;', '&apos;', '&amp;'],
  mdn: 'https://developer.mozilla.org/de/docs/Glossary/Character_reference'
}
);
