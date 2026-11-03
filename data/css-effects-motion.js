window.CHEAT = window.CHEAT || [];

/* ===== Effekte & Filter ===== */
window.CHEAT.push({
  lang: 'css',
  group: 'Effekte & Filter',
  name: 'box-shadow',
  desc: 'Zeichnet einen oder mehrere Schatten um bzw. in die Box eines Elements.',
  details: 'Ein Schatten besteht aus Versatz (x, y), optionalem Weichzeichner-Radius, optionaler Ausbreitung und Farbe; mit `inset` liegt er innen. Mehrere Schatten werden per Komma getrennt, der erste liegt oben. Der Schatten folgt `border-radius`, beeinflusst aber nie das Layout. Große Blur-Radien und animierte Schatten sind teuer – besser einen Pseudo-Element-Schatten per `opacity` einblenden.',
  syntax: 'box-shadow: <x> <y> <blur> <spread> <farbe>;\nbox-shadow: inset <x> <y> <blur> <farbe>;',
  values: [
    ['none', 'Kein Schatten (Standard)'],
    ['<x> <y>', 'Horizontaler und vertikaler Versatz (Pflicht)'],
    ['<blur>', 'Weichzeichner-Radius, nie negativ'],
    ['<spread>', 'Vergrößert (positiv) oder verkleinert (negativ) den Schatten'],
    ['<farbe>', 'Schattenfarbe, Standard ist `currentcolor`'],
    ['inset', 'Schatten innerhalb des Rahmens']
  ],
  initial: 'none',
  inherited: false,
  example: '.card {\n  box-shadow:\n    0 1px 2px rgb(0 0 0 / 0.2),\n    0 8px 24px rgb(0 0 0 / 0.15);\n}\n\n.input:focus {\n  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.5);\n}',
  demo: '<style>body{font-family:sans-serif;display:flex;gap:24px;padding:20px;background:#f4f4f8}.b{width:90px;height:70px;background:#fff;border-radius:10px;display:grid;place-items:center;font-size:12px}.a{box-shadow:0 8px 20px rgba(0,0,0,.25)}.c{box-shadow:inset 0 0 12px rgba(180,54,122,.6)}.d{box-shadow:0 0 0 4px #b4367a,0 0 0 8px #f3c}</style><div class="b a">weich</div><div class="b c">inset</div><div class="b d">Ringe</div>',
  tip: 'Für Fokusringe oder Rahmen ohne Layoutverschiebung eignet sich `box-shadow: 0 0 0 2px farbe` (Blur 0) – aber bei Windows-Kontrastmodus unsichtbar, daher zusätzlich `outline` setzen.',
  keywords: ['schatten', 'shadow', 'drop shadow', 'elevation', 'glow', 'inset'],
  related: ['filter', 'border-radius', 'outline'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/box-shadow'
}, {
  lang: 'css',
  group: 'Effekte & Filter',
  name: 'filter',
  desc: 'Wendet grafische Effekte wie Weichzeichnen oder Farbänderungen auf ein Element an.',
  details: 'Mit einer Liste von Filterfunktionen wird das gerenderte Element samt Kindern nachbearbeitet; die Funktionen werden von links nach rechts nacheinander angewendet. Ein Wert ungleich `none` erzeugt einen neuen Stacking Context und einen Containing Block für `position: fixed`-Nachfahren. Filter auf großen Flächen oder animiert kosten GPU-Leistung.',
  syntax: 'filter: <filterfunktion> [<filterfunktion> ...];',
  values: [
    ['none', 'Kein Filter (Standard)'],
    ['blur(4px)', 'Gaußscher Weichzeichner mit Radius'],
    ['brightness(1.2)', 'Helligkeit; 1 = unverändert, 0 = schwarz'],
    ['contrast(1.5)', 'Kontrast; 1 = unverändert, 0 = grau'],
    ['grayscale(1)', 'Graustufen; 0 bis 1 bzw. 0% bis 100%'],
    ['drop-shadow(2px 4px 6px #000)', 'Schatten, der der Alpha-Form des Inhalts folgt'],
    ['hue-rotate(90deg)', 'Dreht den Farbton im Farbkreis'],
    ['invert(1)', 'Invertiert die Farben'],
    ['saturate(2)', 'Sättigung; 1 = unverändert, 0 = grau'],
    ['sepia(1)', 'Sepia-Tönung'],
    ['opacity(0.5)', 'Deckkraft, wie `opacity`']
  ],
  initial: 'none',
  inherited: false,
  example: '.thumb {\n  filter: grayscale(1) contrast(1.1);\n  transition: filter 0.3s;\n}\n.thumb:hover {\n  filter: none;\n}\n\n.logo {\n  filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.3));\n}',
  demo: '<style>body{font-family:sans-serif;display:flex;flex-wrap:wrap;gap:10px;padding:12px}.i{width:70px;height:70px;border-radius:8px;background:linear-gradient(135deg,#f6d365,#fda085 40%,#4facfe 70%,#8e44ad);display:grid;place-items:end center;color:#fff;font-size:10px}</style><div class="i" style="filter:none">none</div><div class="i" style="filter:blur(3px)">blur</div><div class="i" style="filter:brightness(1.5)">bright</div><div class="i" style="filter:contrast(2)">contrast</div><div class="i" style="filter:grayscale(1)">gray</div><div class="i" style="filter:hue-rotate(120deg)">hue</div><div class="i" style="filter:invert(1)">invert</div><div class="i" style="filter:saturate(3)">saturate</div><div class="i" style="filter:sepia(1)">sepia</div>',
  tip: '`drop-shadow()` folgt transparenten Konturen (PNG/SVG), `box-shadow` immer der rechteckigen Box.',
  keywords: ['weichzeichnen', 'unscharf', 'graustufen', 'blur', 'grayscale', 'effekt', 'bildfilter'],
  related: ['backdrop-filter', 'mix-blend-mode', 'box-shadow', 'will-change'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/filter'
}, {
  lang: 'css',
  group: 'Effekte & Filter',
  name: 'backdrop-filter',
  desc: 'Wendet Filter auf den Bereich hinter einem Element an (z. B. Milchglas-Effekt).',
  details: 'Akzeptiert dieselben Funktionen wie `filter`, wirkt aber auf alles, was hinter dem Element gezeichnet wird. Das Element selbst muss (teil-)transparent sein, sonst ist der Effekt nicht sichtbar. Es entsteht ein neuer Stacking Context; wegen des hohen GPU-Aufwands sollte der Effekt sparsam und auf kleinen Flächen eingesetzt werden. Safari benötigte lange das Präfix `-webkit-backdrop-filter`.',
  syntax: 'backdrop-filter: <filterfunktion> [<filterfunktion> ...];',
  values: [
    ['none', 'Kein Effekt (Standard)'],
    ['blur(10px)', 'Weichzeichnen des Hintergrunds'],
    ['saturate(180%)', 'Sättigung erhöhen, oft kombiniert mit blur'],
    ['brightness()/contrast()', 'Helligkeit bzw. Kontrast des Hintergrunds ändern']
  ],
  initial: 'none',
  inherited: false,
  example: '.glass {\n  background: rgb(255 255 255 / 0.25);\n  -webkit-backdrop-filter: blur(12px) saturate(160%);\n  backdrop-filter: blur(12px) saturate(160%);\n  border: 1px solid rgb(255 255 255 / 0.4);\n}',
  demo: '<style>body{margin:0;font-family:sans-serif}.bg{height:150px;background:repeating-linear-gradient(45deg,#e74c3c 0 20px,#3498db 20px 40px,#f1c40f 40px 60px);display:grid;place-items:center}.glass{padding:20px 30px;color:#111;font-weight:bold;background:rgba(255,255,255,.3);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-radius:12px;border:1px solid rgba(255,255,255,.6)}</style><div class="bg"><div class="glass">Milchglas</div></div>',
  tip: 'Ohne halbtransparenten `background` ist nichts zu sehen. Als Fallback bei fehlender Unterstützung eine fast deckende Hintergrundfarbe verwenden (`@supports`).',
  keywords: ['milchglas', 'glassmorphism', 'frosted glass', 'hintergrund unscharf', 'blur'],
  related: ['filter', 'background', 'opacity'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/backdrop-filter'
}, {
  lang: 'css',
  group: 'Effekte & Filter',
  name: 'mix-blend-mode',
  desc: 'Legt fest, wie ein Element mit dem Inhalt dahinter verrechnet wird.',
  details: 'Übernimmt aus der Bildbearbeitung bekannte Mischmodi wie `multiply`, `screen` oder `difference`. Das Element wird mit den darunterliegenden Ebenen innerhalb seines Stacking Contexts gemischt. Mit `isolation: isolate` am Elternelement begrenzt man die Mischung, damit nicht versehentlich der Seitenhintergrund einbezogen wird.',
  syntax: 'mix-blend-mode: <modus>;',
  values: [
    ['normal', 'Keine Mischung (Standard)'],
    ['multiply', 'Abdunkeln, Weiß wird transparent'],
    ['screen', 'Aufhellen, Schwarz wird transparent'],
    ['overlay', 'Kombination aus multiply und screen je nach Hintergrund'],
    ['darken / lighten', 'Dunkleren bzw. helleren Wert pro Kanal wählen'],
    ['difference', 'Differenz der Farbwerte, ergibt Invertierungs-Effekte'],
    ['color-dodge / color-burn', 'Stark aufhellen bzw. abdunkeln'],
    ['hue / saturation / color / luminosity', 'Nicht-separable Modi, übernehmen einzelne Farbanteile']
  ],
  initial: 'normal',
  inherited: false,
  example: '.hero {\n  isolation: isolate;\n  background: url(hero.jpg) center / cover;\n}\n.hero h1 {\n  color: white;\n  mix-blend-mode: difference;\n}',
  demo: '<style>body{margin:0;font-family:sans-serif}.bg{display:flex;height:120px;isolation:isolate}.bg div{flex:1}.l{background:#fff}.r{background:linear-gradient(90deg,#222,#e74c3c)}.t{position:absolute;left:0;top:30px;width:100%;text-align:center;font-size:44px;font-weight:bold;color:#fff;mix-blend-mode:difference}.w{position:relative}</style><div class="w"><div class="bg"><div class="l"></div><div class="r"></div></div><div class="t">Difference</div></div>',
  tip: 'Für nur einen Container: `isolation: isolate` setzen, sonst mischt sich das Element bis zum Wurzelelement durch.',
  keywords: ['überblenden', 'blend', 'multiply', 'screen', 'difference', 'mischmodus'],
  related: ['filter', 'opacity', 'background'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/mix-blend-mode'
}, {
  lang: 'css',
  group: 'Effekte & Filter',
  name: 'clip-path',
  desc: 'Schneidet ein Element auf eine Form zu; alles außerhalb wird unsichtbar.',
  details: 'Akzeptiert Formfunktionen wie `circle()`, `ellipse()`, `inset()`, `polygon()` und `path()` oder einen Verweis auf ein SVG-`clipPath`. Außerhalb liegende Bereiche werden weder gezeichnet noch reagieren sie auf Mausereignisse. Schatten und Rahmen werden mit abgeschnitten, weshalb man Schatten über `filter: drop-shadow()` auf einem Elternelement setzt. Zwischen Formen mit gleicher Punktzahl ist ein Übergang animierbar.',
  syntax: 'clip-path: <form> | url(#id) | none;',
  values: [
    ['none', 'Kein Zuschnitt (Standard)'],
    ['circle(50% at 50% 50%)', 'Kreis mit Radius und Mittelpunkt'],
    ['ellipse(rx ry at x y)', 'Ellipse'],
    ['inset(10px round 8px)', 'Rechteck mit Abstand zu den Kanten, optional abgerundet'],
    ['polygon(x y, x y, ...)', 'Beliebiges Vieleck aus Punkten'],
    ['path("M ...")', 'SVG-Pfad']
  ],
  initial: 'none',
  inherited: false,
  example: '.avatar {\n  clip-path: circle(50%);\n}\n.banner {\n  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);\n}',
  demo: '<style>body{display:flex;gap:16px;padding:16px;font-family:sans-serif}.s{width:90px;height:90px;background:linear-gradient(135deg,#b4367a,#4facfe)}</style><div class="s" style="clip-path:circle(50%)"></div><div class="s" style="clip-path:polygon(50% 0,100% 100%,0 100%)"></div><div class="s" style="clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"></div><div class="s" style="clip-path:inset(10px round 20px)"></div>',
  tip: 'Eigener `box-shadow` wird mit abgeschnitten – Schatten auf einen Wrapper per `filter: drop-shadow()` legen.',
  keywords: ['zuschneiden', 'form', 'polygon', 'kreis', 'clip', 'ausschneiden', 'schräge kante'],
  related: ['mask-image', 'shape-outside', 'border-radius'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/clip-path'
}, {
  lang: 'css',
  group: 'Effekte & Filter',
  name: 'mask-image',
  desc: 'Blendet ein Element mit Hilfe eines Bildes oder Verlaufs teilweise aus.',
  details: 'Die Alpha-Werte (Standard `mask-mode: match-source`) des Maskenbildes bestimmen, wie sichtbar das Element ist: volle Deckkraft zeigt, transparent verbirgt. Typisch sind Verläufe für weiche Ränder oder SVGs als Formmasken. Gesteuert wird die Maske über `mask-size`, `mask-position`, `mask-repeat` und das Kürzel `mask`. Ältere Safari-/Chrome-Versionen brauchen das Präfix `-webkit-mask-image`.',
  syntax: 'mask-image: <bild> | <gradient> | none;',
  values: [
    ['none', 'Keine Maske (Standard)'],
    ['linear-gradient(...)', 'Verlauf als Maske, z. B. für ausblendende Ränder'],
    ['url(maske.svg)', 'SVG- oder PNG-Maske'],
    ['radial-gradient(...)', 'Runde Maske mit weichem Rand']
  ],
  initial: 'none',
  inherited: false,
  example: '.fade {\n  -webkit-mask-image: linear-gradient(to bottom, #000 60%, transparent);\n  mask-image: linear-gradient(to bottom, #000 60%, transparent);\n}',
  demo: '<style>body{margin:0;padding:12px;font-family:sans-serif;display:flex;gap:16px}.p{width:130px;height:110px;background:linear-gradient(135deg,#e67e22,#8e44ad)}.f{-webkit-mask-image:linear-gradient(to bottom,#000 40%,transparent);mask-image:linear-gradient(to bottom,#000 40%,transparent)}.r{-webkit-mask-image:radial-gradient(circle,#000 50%,transparent 51%);mask-image:radial-gradient(circle,#000 50%,transparent 51%)}</style><div class="p f"></div><div class="p r"></div>',
  tip: 'Für maximale Kompatibilität das `-webkit-`-Präfix zusätzlich schreiben.',
  keywords: ['maske', 'mask', 'ausblenden', 'fade', 'verlauf', 'alpha'],
  related: ['clip-path', 'filter', 'linear-gradient()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/mask-image'
}, {
  lang: 'css',
  group: 'Effekte & Filter',
  name: 'shape-outside',
  desc: 'Lässt Fließtext um eine Form statt um das rechteckige Float herumfließen.',
  details: 'Wirkt nur auf gefloatete Elemente (`float: left` oder `right`). Möglich sind Formfunktionen, `margin-box`-ähnliche Referenzboxen oder die Alpha-Form eines Bildes. Das Element selbst bleibt rechteckig – nur der umfließende Text weicht der Kontur aus; für kreisrunde Bilder kombiniert man es mit `clip-path` bzw. `border-radius`. Bei Bildern gilt für `url()` die CORS-Regel.',
  syntax: 'shape-outside: <form> | <bild> | <box> | none;',
  values: [
    ['none', 'Rechteckiger Umfluss (Standard)'],
    ['circle(50%)', 'Kreisförmige Kontur'],
    ['polygon(...)', 'Beliebiges Vieleck'],
    ['url(bild.png)', 'Kontur aus dem Alphakanal des Bildes'],
    ['margin-box / border-box / content-box', 'Referenzbox der Kontur']
  ],
  initial: 'none',
  inherited: false,
  example: '.portrait {\n  float: left;\n  width: 150px;\n  height: 150px;\n  shape-outside: circle(50%);\n  shape-margin: 12px;\n  border-radius: 50%;\n}',
  demo: '<style>body{font:13px/1.4 sans-serif;padding:10px}.c{float:left;width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#b4367a,#4facfe);shape-outside:circle(50%);shape-margin:8px}</style><div class="c"></div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  tip: 'Ohne `float` passiert nichts. Mit `shape-margin` bekommt der Text Abstand zur Kontur.',
  keywords: ['textumfluss', 'float', 'kontur', 'wrap', 'shape'],
  related: ['float', 'clip-path', 'border-radius'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/shape-outside'
});

/* ===== Transformationen ===== */
window.CHEAT.push({
  lang: 'css',
  group: 'Transformationen',
  name: 'transform',
  desc: 'Verschiebt, dreht, skaliert oder verzerrt ein Element in 2D und 3D.',
  details: 'Mehrere Funktionen werden von rechts nach links auf das Koordinatensystem angewendet, die Reihenfolge ändert also das Ergebnis. Transformationen verändern nicht das Layout (andere Elemente bleiben an ihrem Platz) und sind sehr performant, da sie meist auf der GPU laufen. Ein Wert ungleich `none` erzeugt einen Stacking Context und Containing Block für `position: fixed`. Bei Inline-Elementen wirkt `transform` nicht.',
  syntax: 'transform: <funktion> [<funktion> ...];',
  values: [
    ['none', 'Keine Transformation (Standard)'],
    ['translate(x, y)', 'Verschieben; auch `translateX()`, `translateY()`, `translateZ()`, `translate3d()`'],
    ['rotate(45deg)', 'Drehen um den Ursprung; 3D: `rotateX()`, `rotateY()`, `rotateZ()`, `rotate3d()`'],
    ['scale(1.2)', 'Skalieren; auch `scaleX()`, `scaleY()`, `scaleZ()`, `scale3d()`'],
    ['skew(10deg, 5deg)', 'Verzerren; auch `skewX()`, `skewY()`'],
    ['matrix(a, b, c, d, tx, ty)', 'Alle 2D-Transformationen als Matrix'],
    ['matrix3d(...)', '4x4-Matrix mit 16 Werten für 3D'],
    ['perspective(600px)', 'Perspektive direkt als Transformationsfunktion']
  ],
  initial: 'none',
  inherited: false,
  example: '.btn:hover {\n  transform: translateY(-2px) scale(1.05);\n}\n.icon {\n  transform: rotate(45deg);\n}\n.card3d {\n  transform: perspective(600px) rotateY(25deg);\n}',
  demo: '<style>body{display:flex;flex-wrap:wrap;gap:26px;padding:24px;font-family:sans-serif}.b{width:60px;height:60px;background:#b4367a;color:#fff;display:grid;place-items:center;font-size:11px}</style><div class="b" style="transform:translate(10px,10px)">translate</div><div class="b" style="transform:rotate(20deg)">rotate</div><div class="b" style="transform:scale(1.3)">scale</div><div class="b" style="transform:skew(20deg,0)">skew</div><div class="b" style="transform:perspective(200px) rotateY(40deg)">3D</div>',
  tip: 'Reihenfolge zählt: `translate(100px) rotate(45deg)` ≠ `rotate(45deg) translate(100px)`. Für einzelne Transformationen gibt es auch `translate`, `rotate`, `scale` als eigene Eigenschaften.',
  keywords: ['verschieben', 'drehen', 'skalieren', 'verzerren', 'rotate', 'scale', 'translate', 'skew', 'matrix', '3d'],
  related: ['translate', 'rotate', 'scale', 'transform-origin', 'perspective', 'will-change'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/transform'
}, {
  lang: 'css',
  group: 'Transformationen',
  name: 'translate',
  desc: 'Verschiebt ein Element als eigenständige Eigenschaft, ohne `transform`.',
  details: 'Gibt es als unabhängige Eigenschaft für x, y und optional z. Dadurch lassen sich Verschiebung, Drehung und Skalierung getrennt voneinander animieren oder per Klasse überschreiben, ohne den ganzen `transform`-Wert neu zu schreiben. Die Anwendungsreihenfolge ist fest: erst `translate`, dann `rotate`, dann `scale`, dann `transform`. Wird von allen aktuellen Browsern unterstützt.',
  syntax: 'translate: <x> [<y> [<z>]];',
  values: [
    ['none', 'Keine Verschiebung (Standard)'],
    ['20px', 'Nur horizontal'],
    ['20px 10px', 'Horizontal und vertikal'],
    ['20px 10px 5px', 'Mit Z-Achse (benötigt `perspective`)']
  ],
  initial: 'none',
  inherited: false,
  example: '.badge {\n  translate: 50% -50%;\n}\n.item:hover {\n  translate: 0 -4px;\n  transition: translate 0.2s;\n}',
  demo: '<style>body{padding:24px;font-family:sans-serif}.b{width:80px;height:50px;background:#b4367a;color:#fff;display:grid;place-items:center;transition:translate .3s;font-size:12px}.b:hover{translate:60px 10px}</style><div class="b">Hover</div><p style="font-size:12px">Fahre mit der Maus darüber.</p>',
  keywords: ['verschieben', 'versatz', 'offset', 'move'],
  related: ['transform', 'rotate', 'scale', 'inset'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/translate'
}, {
  lang: 'css',
  group: 'Transformationen',
  name: 'rotate',
  desc: 'Dreht ein Element als eigenständige Eigenschaft, ohne `transform`.',
  details: 'Akzeptiert einen Winkel (`deg`, `turn`, `rad`, `grad`) oder eine Achse mit Winkel für 3D-Drehungen. Praktisch, um nur die Drehung per Hover oder Animation zu ändern, ohne andere Transformationen zu überschreiben. Der Drehpunkt kommt aus `transform-origin`.',
  syntax: 'rotate: <winkel>;\nrotate: x|y|z <winkel>;\nrotate: <x> <y> <z> <winkel>;',
  values: [
    ['none', 'Keine Drehung (Standard)'],
    ['45deg', 'Drehung um die Z-Achse'],
    ['0.25turn', 'Eine Viertel-Umdrehung'],
    ['y 180deg', 'Drehung um die Y-Achse (3D)'],
    ['1 1 0 60deg', 'Drehung um eine beliebige Achse']
  ],
  initial: 'none',
  inherited: false,
  example: '.chevron {\n  transition: rotate 0.2s;\n}\ndetails[open] .chevron {\n  rotate: 90deg;\n}',
  demo: '<style>body{padding:24px;font-family:sans-serif}.b{width:60px;height:60px;background:#b4367a;color:#fff;display:grid;place-items:center;transition:rotate .5s;font-size:12px}.b:hover{rotate:180deg}</style><div class="b">Hover</div><p style="font-size:12px">Fahre mit der Maus darüber.</p>',
  keywords: ['drehen', 'rotation', 'winkel', 'turn', 'deg'],
  related: ['transform', 'translate', 'scale', 'transform-origin'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/rotate'
}, {
  lang: 'css',
  group: 'Transformationen',
  name: 'scale',
  desc: 'Skaliert ein Element als eigenständige Eigenschaft, ohne `transform`.',
  details: 'Ein Wert skaliert gleichmäßig, zwei Werte getrennt in x- und y-Richtung, drei Werte zusätzlich in z. Zahlen oder Prozentwerte sind erlaubt (`1.5` = `150%`). Negative Werte spiegeln das Element. Der Fixpunkt ist `transform-origin`. Das Layout bleibt unverändert – umliegende Elemente weichen nicht aus.',
  syntax: 'scale: <zahl> [<zahl> [<zahl>]];',
  values: [
    ['none', 'Keine Skalierung (Standard)'],
    ['1.2', 'Gleichmäßig auf 120 %'],
    ['1.5 0.8', 'x und y unterschiedlich'],
    ['-1 1', 'Horizontal spiegeln']
  ],
  initial: 'none',
  inherited: false,
  example: '.thumb {\n  transition: scale 0.2s;\n}\n.thumb:hover {\n  scale: 1.1;\n}',
  demo: '<style>body{padding:30px;font-family:sans-serif}.b{width:60px;height:60px;background:#b4367a;color:#fff;display:grid;place-items:center;transition:scale .3s;font-size:12px}.b:hover{scale:1.5}</style><div class="b">Hover</div><p style="font-size:12px;margin-top:40px">Fahre mit der Maus darüber.</p>',
  keywords: ['vergrößern', 'verkleinern', 'zoom', 'spiegeln'],
  related: ['transform', 'translate', 'rotate', 'transform-origin'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/scale'
}, {
  lang: 'css',
  group: 'Transformationen',
  name: 'transform-origin',
  desc: 'Legt den Fixpunkt fest, um den transformiert wird.',
  details: 'Standard ist die Mitte des Elements (`50% 50%`). Wer um eine Ecke drehen oder skalieren will, ändert den Ursprung, z. B. `top left`. Die Angabe nutzt Schlüsselwörter, Längen oder Prozent, optional mit z-Wert für 3D. Der Ursprung wirkt auf `transform`, `rotate`, `scale` – nicht auf `translate`.',
  syntax: 'transform-origin: <x> [<y> [<z>]];',
  values: [
    ['center', 'Mitte (Standard, `50% 50%`)'],
    ['top left', 'Obere linke Ecke'],
    ['bottom right', 'Untere rechte Ecke'],
    ['20px 40px', 'Absoluter Punkt von der linken oberen Ecke'],
    ['50% 100%', 'Untere Mitte']
  ],
  initial: '50% 50% 0',
  inherited: false,
  example: '.door {\n  transform-origin: left center;\n  transition: transform 0.4s;\n}\n.door:hover {\n  transform: rotateY(-70deg);\n}',
  demo: '<style>body{display:flex;gap:40px;padding:30px;font-family:sans-serif}.b{width:60px;height:60px;background:#b4367a;color:#fff;display:grid;place-items:center;font-size:11px;transition:transform .5s}.a{transform-origin:top left}.c{transform-origin:center}.a:hover,.c:hover{transform:rotate(45deg)}</style><div class="b a">top left</div><div class="b c">center</div><p style="font-size:12px">Fahre mit der Maus darüber.</p>',
  keywords: ['drehpunkt', 'ursprung', 'pivot', 'anker', 'fixpunkt'],
  related: ['transform', 'rotate', 'scale', 'perspective-origin'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/transform-origin'
}, {
  lang: 'css',
  group: 'Transformationen',
  name: 'transform-style',
  desc: 'Bestimmt, ob Kindelemente im 3D-Raum erhalten bleiben oder flach gerendert werden.',
  details: 'Mit `preserve-3d` leben die Kinder im gleichen 3D-Raum wie ihr Elternelement und können sich räumlich durchdringen, etwa für Würfel oder Karten-Flips. Standard `flat` plättet sie in die Ebene des Elternelements. Eigenschaften wie `overflow` (nicht `visible`), `opacity < 1`, `filter` oder `clip-path` am Elternelement erzwingen `flat` und brechen 3D-Effekte unbemerkt.',
  syntax: 'transform-style: flat | preserve-3d;',
  values: [
    ['flat', 'Kinder werden in die Ebene des Elternelements projiziert (Standard)'],
    ['preserve-3d', 'Kinder behalten ihre 3D-Position']
  ],
  initial: 'flat',
  inherited: false,
  example: '.cube {\n  transform-style: preserve-3d;\n  transform: rotateX(-20deg) rotateY(30deg);\n}\n.cube .face {\n  position: absolute;\n}',
  demo: '<style>body{padding:30px;font-family:sans-serif}.scene{width:80px;height:80px;perspective:300px}.cube{position:relative;width:80px;height:80px;transform-style:preserve-3d;transform:rotateX(-25deg) rotateY(35deg)}.f{position:absolute;width:80px;height:80px;display:grid;place-items:center;color:#fff;font-size:12px;opacity:.9}.f1{background:#e74c3c;transform:translateZ(40px)}.f2{background:#3498db;transform:rotateY(90deg) translateZ(40px)}.f3{background:#2ecc71;transform:rotateX(90deg) translateZ(40px)}</style><div class="scene"><div class="cube"><div class="f f1">vorne</div><div class="f f2">rechts</div><div class="f f3">oben</div></div></div>',
  tip: 'Funktioniert 3D nicht, prüfe Eltern auf `overflow`, `filter`, `opacity` – sie erzwingen `flat`.',
  keywords: ['3d', 'preserve-3d', 'würfel', 'raum', 'cube'],
  related: ['perspective', 'transform', 'backface-visibility'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/transform-style'
}, {
  lang: 'css',
  group: 'Transformationen',
  name: 'perspective',
  desc: 'Erzeugt einen 3D-Raum mit Tiefenwirkung für die direkten Kindelemente.',
  details: 'Der Wert gibt den Abstand des Betrachters zur Z=0-Ebene an: kleine Werte (z. B. `200px`) wirken dramatisch, große (`1500px`) dezent. Die Eigenschaft wird am Elternelement gesetzt und wirkt auf dessen Kinder, während die Funktion `perspective()` in `transform` nur das jeweilige Element betrifft. Sie erzeugt einen Stacking Context.',
  syntax: 'perspective: none | <länge>;',
  values: [
    ['none', 'Keine Perspektive (Standard)'],
    ['600px', 'Abstand des Betrachters; je kleiner, desto stärker der Effekt']
  ],
  initial: 'none',
  inherited: false,
  example: '.scene {\n  perspective: 800px;\n}\n.card {\n  transition: transform 0.6s;\n}\n.scene:hover .card {\n  transform: rotateY(40deg);\n}',
  demo: '<style>body{display:flex;gap:40px;padding:24px;font-family:sans-serif}.s{width:100px;height:80px}.b{width:100px;height:80px;background:#b4367a;color:#fff;display:grid;place-items:center;font-size:12px;transform:rotateY(45deg)}.p1{perspective:200px}.p2{perspective:800px}</style><div class="s p1"><div class="b">200px</div></div><div class="s p2"><div class="b">800px</div></div>',
  keywords: ['tiefe', '3d', 'betrachter', 'perspektive'],
  related: ['perspective-origin', 'transform-style', 'transform'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/perspective'
}, {
  lang: 'css',
  group: 'Transformationen',
  name: 'perspective-origin',
  desc: 'Legt die Blickposition des Betrachters für `perspective` fest.',
  details: 'Bestimmt den Fluchtpunkt der Perspektive; Standard ist die Mitte des Elements (`50% 50%`). Wie `perspective` wird sie am Elternelement der transformierten Kinder gesetzt. Ein Fluchtpunkt weiter links lässt Objekte z. B. von rechts betrachtet erscheinen.',
  syntax: 'perspective-origin: <x> [<y>];',
  values: [
    ['50% 50%', 'Mitte (Standard)'],
    ['left top', 'Blick von oben links'],
    ['100% 0', 'Blick von der oberen rechten Ecke'],
    ['20px 80px', 'Absolute Position']
  ],
  initial: '50% 50%',
  inherited: false,
  example: '.scene {\n  perspective: 600px;\n  perspective-origin: 25% 75%;\n}',
  demo: '<style>body{display:flex;gap:40px;padding:24px;font-family:sans-serif}.s{width:100px;height:80px;perspective:200px;outline:1px dashed #999}.b{width:100px;height:80px;background:#b4367a;color:#fff;display:grid;place-items:center;font-size:11px;transform:rotateX(45deg)}</style><div class="s" style="perspective-origin:50% 50%"><div class="b">Mitte</div></div><div class="s" style="perspective-origin:0 0"><div class="b">oben links</div></div>',
  keywords: ['fluchtpunkt', 'blickpunkt', 'vanishing point', '3d'],
  related: ['perspective', 'transform-origin', 'transform-style'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/perspective-origin'
}, {
  lang: 'css',
  group: 'Transformationen',
  name: 'backface-visibility',
  desc: 'Steuert, ob die Rückseite eines gedrehten Elements sichtbar ist.',
  details: 'Wird ein Element um mehr als 90° gedreht, zeigt es seine Rückseite als gespiegelte Vorderseite. Mit `hidden` wird diese Rückseite ausgeblendet. Klassisch für Flip-Cards: Vorder- und Rückseite liegen übereinander, beide mit `backface-visibility: hidden`, die Rückseite zusätzlich um 180° gedreht.',
  syntax: 'backface-visibility: visible | hidden;',
  values: [
    ['visible', 'Rückseite sichtbar (Standard)'],
    ['hidden', 'Rückseite unsichtbar']
  ],
  initial: 'visible',
  inherited: false,
  example: '.face {\n  position: absolute;\n  inset: 0;\n  backface-visibility: hidden;\n}\n.back {\n  transform: rotateY(180deg);\n}',
  demo: '<style>body{padding:20px;font-family:sans-serif}.s{width:120px;height:80px;perspective:400px}.c{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .6s}.s:hover .c{transform:rotateY(180deg)}.f{position:absolute;inset:0;display:grid;place-items:center;color:#fff;backface-visibility:hidden;-webkit-backface-visibility:hidden}.v{background:#b4367a}.h{background:#2c7fb8;transform:rotateY(180deg)}</style><div class="s"><div class="c"><div class="f v">Vorne</div><div class="f h">Hinten</div></div></div><p style="font-size:12px">Fahre mit der Maus darüber.</p>',
  keywords: ['rückseite', 'flip card', 'umdrehen', 'karte wenden'],
  related: ['transform-style', 'perspective', 'transform'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/backface-visibility'
});

/* ===== Übergänge & Animationen ===== */
window.CHEAT.push({
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'transition',
  desc: 'Kurzschreibweise: Eigenschaftsänderungen weich über die Zeit animieren.',
  details: 'Fasst `transition-property`, `-duration`, `-timing-function`, `-delay` und `-behavior` zusammen. Definiert wird sie im Ausgangszustand; sie greift, wenn sich ein Wert ändert (z. B. durch `:hover`). Mehrere Übergänge werden per Komma getrennt. Statt `all` besser die konkreten Eigenschaften nennen und möglichst `transform` und `opacity` animieren, da diese kein Layout auslösen. Die erste Zeitangabe ist die Dauer, die zweite die Verzögerung.',
  syntax: 'transition: <property> <duration> <timing-function> <delay>;',
  values: [
    ['all 0.3s ease', 'Alle animierbaren Eigenschaften, 0,3 s'],
    ['opacity 0.2s', 'Nur Deckkraft'],
    ['transform 0.3s ease-out 0.1s', 'Mit Timing-Funktion und Verzögerung'],
    ['a 1s, b 2s', 'Mehrere Übergänge kommagetrennt'],
    ['none', 'Kein Übergang']
  ],
  initial: 'all 0s ease 0s',
  inherited: false,
  example: '.btn {\n  background: #2c7fb8;\n  transform: translateY(0);\n  transition: background-color 0.2s ease, transform 0.2s ease-out;\n}\n.btn:hover {\n  background: #1d5a85;\n  transform: translateY(-2px);\n}',
  demo: '<style>body{padding:24px;font-family:sans-serif}.b{display:inline-block;padding:12px 24px;background:#2c7fb8;color:#fff;border-radius:6px;transition:background-color .3s ease,transform .3s ease-out,box-shadow .3s}.b:hover{background:#b4367a;transform:translateY(-4px);box-shadow:0 8px 14px rgba(0,0,0,.3)}</style><div class="b">Hover mich</div><p style="font-size:12px">Fahre mit der Maus darüber.</p>',
  tip: 'Übergänge funktionieren nur zwischen berechenbaren Werten; `display` und `height: auto` lassen sich nicht animieren (siehe `transition-behavior`, `interpolate-size`). Zum Ausschalten bei Bedarf `@media (prefers-reduced-motion: reduce)` nutzen.',
  keywords: ['übergang', 'animation', 'hover', 'weich', 'ease', 'transition'],
  related: ['transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay', 'animation', 'will-change'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/transition'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'transition-property',
  desc: 'Legt fest, welche CSS-Eigenschaften beim Wechsel animiert werden.',
  details: 'Nimmt `all`, `none` oder eine kommagetrennte Liste von Eigenschaftsnamen. Nur animierbare Eigenschaften zeigen einen Übergang. Mit mehreren Eigenschaften werden `transition-duration` & Co. der Reihe nach zugeordnet bzw. wiederholt. Explizite Namen sind performanter und vermeiden Überraschungen bei später hinzugefügten Eigenschaften.',
  syntax: 'transition-property: all | none | <eigenschaft> [, <eigenschaft> ...];',
  values: [
    ['all', 'Alle animierbaren Eigenschaften (Standard)'],
    ['none', 'Keine Eigenschaft'],
    ['opacity, transform', 'Liste einzelner Eigenschaften'],
    ['--meine-variable', 'Auch registrierte Custom Properties (`@property`)']
  ],
  initial: 'all',
  inherited: false,
  example: '.card {\n  transition-property: transform, box-shadow;\n  transition-duration: 0.3s;\n}',
  demo: '<style>body{padding:24px;font-family:sans-serif}.b{width:80px;height:50px;background:#2c7fb8;color:#fff;display:grid;place-items:center;font-size:11px;transition-property:background-color;transition-duration:.6s}.b:hover{background:#b4367a;width:140px}</style><div class="b">nur Farbe</div><p style="font-size:12px">Fahre mit der Maus darüber: die Breite springt, die Farbe blendet über.</p>',
  keywords: ['welche eigenschaften', 'all', 'animierbar'],
  related: ['transition', 'transition-duration', 'will-change'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/transition-property'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'transition-duration',
  desc: 'Bestimmt, wie lange ein Übergang dauert.',
  details: 'Zeitwert in Sekunden (`0.3s`) oder Millisekunden (`300ms`). Bei `0s` (Standard) findet kein sichtbarer Übergang statt. Für UI-Feedback haben sich 100–300 ms bewährt; längere Dauern wirken träge. Mehrere kommagetrennte Werte gelten der Reihe nach für die Eigenschaften in `transition-property`.',
  syntax: 'transition-duration: <zeit> [, <zeit> ...];',
  values: [
    ['0s', 'Sofort, kein Übergang (Standard)'],
    ['200ms', 'Kurzes Feedback'],
    ['1s', 'Deutlich sichtbar'],
    ['0.2s, 1s', 'Je Eigenschaft unterschiedlich']
  ],
  initial: '0s',
  inherited: false,
  example: '.menu {\n  transition-property: opacity, transform;\n  transition-duration: 150ms, 300ms;\n}',
  demo: '<style>body{padding:20px;font-family:sans-serif}.t{height:24px;margin:8px 0;background:#2c7fb8;width:40px;color:#fff;font-size:11px;padding-left:6px;line-height:24px}.f{transition:width .2s}.s{transition:width 2s}body:hover .t{width:240px}</style><div class="t f">0,2 s</div><div class="t s">2 s</div><p style="font-size:12px">Fahre mit der Maus darüber.</p>',
  keywords: ['dauer', 'zeit', 'duration', 'schnell', 'langsam'],
  related: ['transition', 'transition-delay', 'transition-timing-function', 'animation-duration'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/transition-duration'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'transition-timing-function',
  desc: 'Legt den zeitlichen Verlauf (Beschleunigungskurve) eines Übergangs fest.',
  details: 'Bestimmt, wie schnell der Übergang in welchem Abschnitt abläuft. Vordefiniert sind `ease`, `linear`, `ease-in`, `ease-out`, `ease-in-out`; frei definierbar sind `cubic-bezier()` und stufenweise `steps()`. `ease-out` fühlt sich für eintretende Elemente natürlich an, `ease-in` für verschwindende. Mit `linear()` lassen sich auch federnde Kurven beschreiben.',
  syntax: 'transition-timing-function: <kurve>;',
  values: [
    ['ease', 'Langsam-schnell-langsam, Standard'],
    ['linear', 'Konstantes Tempo'],
    ['ease-in', 'Langsamer Start, beschleunigt'],
    ['ease-out', 'Schneller Start, bremst am Ende'],
    ['ease-in-out', 'Langsamer Start und Ende, symmetrisch'],
    ['steps(4, end)', 'In 4 Schritten statt fließend'],
    ['cubic-bezier(0.4, 0, 0.2, 1)', 'Eigene Bézier-Kurve']
  ],
  initial: 'ease',
  inherited: false,
  example: '.drawer {\n  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.loader {\n  transition: width 2s steps(8);\n}',
  demo: '<style>body{padding:12px;font-family:sans-serif;font-size:11px}.r{margin:5px 0}.t{height:18px;width:30px;background:#2c7fb8;color:#fff;transition:width 2s}body:hover .t{width:230px}.l{transition-timing-function:linear}.i{transition-timing-function:ease-in}.o{transition-timing-function:ease-out}.io{transition-timing-function:ease-in-out}.s{transition-timing-function:steps(5)}.e{transition-timing-function:ease}</style><div class="t e">ease</div><div class="t l">linear</div><div class="t i">ease-in</div><div class="t o">ease-out</div><div class="t io">ease-in-out</div><div class="t s">steps(5)</div><p>Fahre mit der Maus darüber.</p>',
  keywords: ['easing', 'kurve', 'beschleunigung', 'bezier', 'steps', 'ease'],
  related: ['transition', 'animation-timing-function', 'cubic-bezier()', 'steps()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/transition-timing-function'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'transition-delay',
  desc: 'Verzögert den Start eines Übergangs.',
  details: 'Zeit, die nach der Wertänderung bis zum Beginn des Übergangs vergeht. Negative Werte starten den Übergang sofort, aber mitten im Ablauf. Verzögerungen eignen sich für gestaffelte Effekte (jedes Listenelement etwas später) oder um ein versehentliches Auslösen beim Überfahren zu verhindern. Beim Zurücklaufen gilt die Verzögerung des Zielzustands.',
  syntax: 'transition-delay: <zeit> [, <zeit> ...];',
  values: [
    ['0s', 'Sofort starten (Standard)'],
    ['0.5s', 'Eine halbe Sekunde warten'],
    ['-0.2s', 'Sofort starten, 0,2 s im Ablauf']
  ],
  initial: '0s',
  inherited: false,
  example: '.item:nth-child(1) { transition-delay: 0s; }\n.item:nth-child(2) { transition-delay: 0.1s; }\n.item:nth-child(3) { transition-delay: 0.2s; }',
  demo: '<style>body{padding:20px;font-family:sans-serif;font-size:11px}.t{height:20px;margin:6px 0;width:40px;background:#2c7fb8;transition:width .6s}body:hover .t{width:220px}.a{transition-delay:0s}.b{transition-delay:.4s}.c{transition-delay:.8s}</style><div class="t a"></div><div class="t b"></div><div class="t c"></div><p>Fahre mit der Maus darüber (0 s, 0,4 s, 0,8 s).</p>',
  keywords: ['verzögerung', 'warten', 'stagger', 'delay'],
  related: ['transition', 'transition-duration', 'animation-delay'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/transition-delay'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'transition-behavior',
  desc: 'Erlaubt Übergänge für diskrete Eigenschaften wie `display`.',
  details: 'Mit `allow-discrete` werden Eigenschaften, die nicht stufenlos interpolierbar sind (etwa `display` oder `overlay`), im Übergang mitgeschaltet: Beim Einblenden wechselt `display` am Anfang, beim Ausblenden erst am Ende. Zusammen mit `@starting-style` lassen sich so Ein- und Ausblend-Animationen für Dialoge und Popover ohne JavaScript bauen. Wird in aktuellen Browsern unterstützt, ältere ignorieren es.',
  syntax: 'transition-behavior: normal | allow-discrete;',
  values: [
    ['normal', 'Nur stufenlos animierbare Eigenschaften (Standard)'],
    ['allow-discrete', 'Auch diskrete Eigenschaften wie `display` wechseln im Übergang']
  ],
  initial: 'normal',
  inherited: false,
  example: '.dialog {\n  opacity: 0;\n  transition: opacity 0.3s, display 0.3s allow-discrete;\n}\n.dialog[open] {\n  opacity: 1;\n}\n@starting-style {\n  .dialog[open] { opacity: 0; }\n}',
  demo: '<style>body{padding:20px;font-family:sans-serif}.b{width:100px;height:50px;background:#2c7fb8;color:#fff;display:grid;place-items:center;font-size:11px;transition:opacity .5s,display .5s allow-discrete}.w:hover .b{opacity:0;display:none}.w{height:70px;width:130px;border:1px dashed #999}</style><div class="w"><div class="b">verschwindet</div></div><p style="font-size:12px">Fahre mit der Maus darüber (Rahmen).</p>',
  tip: 'Die Kurzschreibweise `transition` setzt `transition-behavior` zurück – daher `allow-discrete` in der Kurzform mitgeben.',
  keywords: ['allow-discrete', 'display animieren', 'starting-style', 'dialog', 'popover'],
  related: ['transition', '@starting-style', 'display', 'interpolate-size'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/transition-behavior'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'animation',
  desc: 'Kurzschreibweise: Wendet eine @keyframes-Animation auf ein Element an.',
  details: 'Fasst `animation-name`, `-duration`, `-timing-function`, `-delay`, `-iteration-count`, `-direction`, `-fill-mode`, `-play-state` und `-timeline` zusammen. Die erste Zeitangabe ist die Dauer, die zweite die Verzögerung. Animationen laufen automatisch und benötigen keinen Auslöser. Mehrere Animationen werden per Komma getrennt. Auch hier gilt: `transform` und `opacity` animieren, um Layoutberechnungen zu vermeiden.',
  syntax: 'animation: <name> <dauer> <timing> <delay> <anzahl> <richtung> <fill-mode> <play-state>;',
  values: [
    ['name 2s', 'Mindestangabe: Name und Dauer'],
    ['spin 1s linear infinite', 'Endlos drehend'],
    ['fade 0.5s ease-out forwards', 'Einmal ablaufen und Endzustand behalten'],
    ['a 1s, b 2s 1s', 'Mehrere Animationen']
  ],
  initial: 'none 0s ease 0s 1 normal none running auto',
  inherited: false,
  example: '@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50%      { transform: scale(1.15); }\n}\n.badge {\n  animation: pulse 1.5s ease-in-out infinite;\n}',
  demo: '<style>body{padding:24px;display:flex;gap:30px;font-family:sans-serif}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}@keyframes spin{to{transform:rotate(360deg)}}.b{width:50px;height:50px;background:#b4367a;color:#fff;display:grid;place-items:center;font-size:10px}.p{animation:pulse 1.5s ease-in-out infinite;border-radius:50%}.s{animation:spin 2s linear infinite}</style><div class="b p">pulse</div><div class="b s">spin</div>',
  tip: 'Respektiere Nutzer mit Bewegungsempfindlichkeit: `@media (prefers-reduced-motion: reduce) { * { animation: none; } }`.',
  keywords: ['animation', 'keyframes', 'bewegung', 'endlos', 'loop'],
  related: ['@keyframes', 'animation-name', 'animation-duration', 'transition', 'will-change'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/animation'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'animation-name',
  desc: 'Verweist auf den Namen einer @keyframes-Regel.',
  details: 'Der Name muss mit dem in `@keyframes` definierten Bezeichner übereinstimmen (Groß-/Kleinschreibung beachten). Mehrere Namen werden kommagetrennt, die anderen `animation-*`-Eigenschaften wirken dann der Reihe nach. Mit `none` wird die Animation abgeschaltet. Ohne `animation-duration` größer als `0s` ist nichts zu sehen.',
  syntax: 'animation-name: none | <name> [, <name> ...];',
  values: [
    ['none', 'Keine Animation (Standard)'],
    ['<name>', 'Name der @keyframes-Regel'],
    ['a, b', 'Mehrere Animationen gleichzeitig']
  ],
  initial: 'none',
  inherited: false,
  example: '@keyframes slide-in {\n  from { transform: translateX(-100%); }\n  to   { transform: translateX(0); }\n}\n.panel {\n  animation-name: slide-in;\n  animation-duration: 0.4s;\n}',
  demo: '<style>body{padding:20px;font-family:sans-serif}@keyframes slide-in{from{transform:translateX(-80px);opacity:0}to{transform:none;opacity:1}}.b{width:80px;height:40px;background:#b4367a;color:#fff;display:grid;place-items:center;font-size:11px;animation-name:slide-in;animation-duration:1s;animation-iteration-count:infinite}</style><div class="b">slide-in</div>',
  keywords: ['keyframes name', 'bezeichner'],
  related: ['animation', '@keyframes', 'animation-duration'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/animation-name'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'animation-duration',
  desc: 'Legt die Dauer eines Animationsdurchlaufs fest.',
  details: 'Zeit in `s` oder `ms`; der Standardwert `0s` führt dazu, dass die Animation praktisch nicht sichtbar ist (Events feuern aber trotzdem). Die Dauer bezieht sich auf einen einzelnen Durchlauf, nicht auf alle Wiederholungen. Bei scrollgebundenen Animationen (`animation-timeline`) wird sie meist als `auto` belassen.',
  syntax: 'animation-duration: auto | <zeit> [, <zeit> ...];',
  values: [
    ['0s', 'Keine sichtbare Dauer (Standard)'],
    ['300ms', 'Kurz'],
    ['2s', 'Zwei Sekunden pro Durchlauf'],
    ['auto', 'Bei scrollgebundenen Animationen: gesamte Timeline']
  ],
  initial: 'auto',
  inherited: false,
  example: '.spinner {\n  animation: spin 1s linear infinite;\n  animation-duration: 0.8s;\n}',
  demo: '<style>body{padding:20px;display:flex;gap:30px;font-family:sans-serif;font-size:11px}@keyframes spin{to{transform:rotate(360deg)}}.b{width:50px;height:50px;background:#b4367a;color:#fff;display:grid;place-items:center;animation:spin 1s linear infinite}.f{animation-duration:.4s}.s{animation-duration:3s}</style><div class="b f">0,4 s</div><div class="b s">3 s</div>',
  keywords: ['dauer', 'geschwindigkeit', 'duration', 'tempo'],
  related: ['animation', 'transition-duration', 'animation-delay'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/animation-duration'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'animation-timing-function',
  desc: 'Bestimmt die Beschleunigungskurve einer Animation.',
  details: 'Gleiche Werte wie bei `transition-timing-function`. Der Unterschied: Die Kurve gilt standardmäßig zwischen je zwei Keyframes, nicht über die gesamte Animation. Man kann sie daher auch innerhalb einzelner Keyframes überschreiben. Für gleichmäßiges Drehen oder Laufen eignet sich `linear`.',
  syntax: 'animation-timing-function: <kurve>;',
  values: [
    ['ease', 'Standard'],
    ['linear', 'Konstantes Tempo, z. B. für Spinner'],
    ['ease-in / ease-out / ease-in-out', 'Beschleunigen / Bremsen / beides'],
    ['steps(8)', 'Sprites oder Typewriter-Effekt'],
    ['cubic-bezier(...)', 'Eigene Kurve']
  ],
  initial: 'ease',
  inherited: false,
  example: '@keyframes bounce {\n  0%, 100% { transform: translateY(0); animation-timing-function: ease-out; }\n  50%      { transform: translateY(-40px); animation-timing-function: ease-in; }\n}\n.ball {\n  animation: bounce 1s infinite;\n}',
  demo: '<style>body{padding:12px;font-family:sans-serif;font-size:11px}@keyframes go{from{margin-left:0}to{margin-left:200px}}.t{width:24px;height:16px;background:#b4367a;margin:6px 0;animation:go 2s infinite alternate}.l{animation-timing-function:linear}.i{animation-timing-function:ease-in}.o{animation-timing-function:ease-out}.s{animation-timing-function:steps(5)}</style><div class="t l"></div><div class="t i"></div><div class="t o"></div><div class="t s"></div><p>linear, ease-in, ease-out, steps(5)</p>',
  keywords: ['easing', 'kurve', 'timing', 'bezier'],
  related: ['animation', 'transition-timing-function', '@keyframes'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/animation-timing-function'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'animation-delay',
  desc: 'Verzögert den Start einer Animation.',
  details: 'Wartezeit, bevor die Animation beginnt. Negative Werte starten sofort, aber so, als wäre die Animation schon entsprechend lange gelaufen – nützlich, um viele Elemente zeitlich zu versetzen. Während der Verzögerung gilt ohne `animation-fill-mode: backwards` noch der Normalzustand des Elements.',
  syntax: 'animation-delay: <zeit> [, <zeit> ...];',
  values: [
    ['0s', 'Sofort (Standard)'],
    ['1s', 'Eine Sekunde warten'],
    ['-0.5s', 'Sofort starten, bereits 0,5 s fortgeschritten']
  ],
  initial: '0s',
  inherited: false,
  example: '.dot:nth-child(2) { animation-delay: 0.15s; }\n.dot:nth-child(3) { animation-delay: 0.3s; }',
  demo: '<style>body{padding:20px;display:flex;gap:8px;font-family:sans-serif}@keyframes up{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}.d{width:16px;height:16px;border-radius:50%;background:#b4367a;animation:up .8s ease-in-out infinite}.d:nth-child(2){animation-delay:.15s}.d:nth-child(3){animation-delay:.3s}</style><div style="padding-top:26px;display:flex;gap:8px"><div class="d"></div><div class="d"></div><div class="d"></div></div>',
  keywords: ['verzögerung', 'versatz', 'stagger', 'warten'],
  related: ['animation', 'transition-delay', 'animation-fill-mode'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/animation-delay'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'animation-iteration-count',
  desc: 'Legt fest, wie oft eine Animation wiederholt wird.',
  details: 'Zahl (auch Dezimalzahlen wie `1.5`) oder `infinite` für Endlosschleifen. Bei `0` wird nicht animiert. Endlosanimationen belasten dauerhaft CPU/GPU und Akku, besonders auf Seiten, die im Hintergrund offen bleiben; sie sollten gezielt und sparsam eingesetzt werden.',
  syntax: 'animation-iteration-count: <zahl> | infinite;',
  values: [
    ['1', 'Einmal (Standard)'],
    ['3', 'Dreimal'],
    ['1.5', 'Eineinhalb Durchläufe'],
    ['infinite', 'Endlos']
  ],
  initial: '1',
  inherited: false,
  example: '.shake {\n  animation: shake 0.4s 3;\n}\n.loader {\n  animation: spin 1s linear infinite;\n}',
  demo: '<style>body{padding:20px;display:flex;gap:30px;font-family:sans-serif;font-size:11px}@keyframes grow{from{transform:scale(1)}to{transform:scale(1.4)}}.b{width:40px;height:40px;background:#b4367a;color:#fff;display:grid;place-items:center;animation:grow .6s ease-in-out}.a{animation-iteration-count:3}.c{animation-iteration-count:infinite;animation-direction:alternate}</style><div class="b a">3x</div><div class="b c">∞</div>',
  keywords: ['wiederholen', 'endlos', 'loop', 'infinite', 'anzahl'],
  related: ['animation', 'animation-direction', 'animation-fill-mode'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/animation-iteration-count'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'animation-direction',
  desc: 'Bestimmt, ob die Animation vorwärts, rückwärts oder abwechselnd läuft.',
  details: 'Mit `alternate` läuft jeder zweite Durchlauf rückwärts, wodurch Hin-und-her-Bewegungen ohne zusätzliche Keyframes entstehen. Bei `reverse`-Varianten wird auch die Timing-Funktion umgekehrt. Sichtbar wird der Unterschied erst bei mehr als einem Durchlauf (`animation-iteration-count`).',
  syntax: 'animation-direction: normal | reverse | alternate | alternate-reverse;',
  values: [
    ['normal', 'Immer 0 % bis 100 % (Standard)'],
    ['reverse', 'Immer 100 % bis 0 %'],
    ['alternate', 'Vorwärts, dann rückwärts, im Wechsel'],
    ['alternate-reverse', 'Rückwärts beginnend, dann im Wechsel']
  ],
  initial: 'normal',
  inherited: false,
  example: '.ball {\n  animation: move 1s ease-in-out infinite alternate;\n}',
  demo: '<style>body{padding:12px;font-family:sans-serif;font-size:11px}@keyframes go{from{margin-left:0}to{margin-left:200px}}.t{width:24px;height:16px;background:#b4367a;margin:6px 0;animation:go 1.5s linear infinite}.r{animation-direction:reverse}.a{animation-direction:alternate}.ar{animation-direction:alternate-reverse}</style><div class="t"></div><div class="t r"></div><div class="t a"></div><div class="t ar"></div><p>normal, reverse, alternate, alternate-reverse</p>',
  keywords: ['rückwärts', 'hin und her', 'alternate', 'reverse', 'pingpong'],
  related: ['animation', 'animation-iteration-count', '@keyframes'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/animation-direction'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'animation-fill-mode',
  desc: 'Legt fest, welche Stile vor dem Start und nach dem Ende der Animation gelten.',
  details: 'Ohne Wert springt das Element nach der Animation zum normalen Stil zurück. `forwards` behält den letzten Keyframe, `backwards` wendet den ersten Keyframe schon während der Verzögerung an, `both` kombiniert beides. Wichtig für Einblend-Animationen, die im Endzustand bleiben sollen.',
  syntax: 'animation-fill-mode: none | forwards | backwards | both;',
  values: [
    ['none', 'Vor und nach der Animation gilt der normale Stil (Standard)'],
    ['forwards', 'Nach dem Ende bleibt der letzte Keyframe bestehen'],
    ['backwards', 'Während der Verzögerung gilt der erste Keyframe'],
    ['both', 'Beides']
  ],
  initial: 'none',
  inherited: false,
  example: '.toast {\n  opacity: 0;\n  animation: fade-in 0.4s ease-out 0.2s forwards;\n}',
  demo: '<style>body{padding:20px;display:flex;gap:20px;font-family:sans-serif;font-size:11px}@keyframes mv{from{transform:translateX(0);background:#e74c3c}to{transform:translateX(60px);background:#2ecc71}}.b{width:50px;height:40px;color:#fff;display:grid;place-items:center;background:#999;animation:mv 1s 1s 1}.n{animation-fill-mode:none}.f{animation-fill-mode:forwards}.k{animation-fill-mode:backwards}.o{animation-fill-mode:both}</style><div style="display:flex;flex-direction:column;gap:6px"><div class="b n">none</div><div class="b f">forw.</div><div class="b k">backw.</div><div class="b o">both</div></div><p>Beim Laden: 1 s Verzögerung, dann Lauf.</p>',
  keywords: ['endzustand', 'forwards', 'both', 'behalten', 'fill'],
  related: ['animation', 'animation-delay', '@keyframes'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/animation-fill-mode'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'animation-play-state',
  desc: 'Hält eine Animation an oder lässt sie weiterlaufen.',
  details: 'Mit `paused` friert die Animation am aktuellen Punkt ein und läuft mit `running` von dort weiter. So lassen sich Animationen z. B. bei `:hover` pausieren oder per Checkbox-Hack steuern, ohne JavaScript. Mehrere Animationen werden per Komma einzeln gesteuert.',
  syntax: 'animation-play-state: running | paused;',
  values: [
    ['running', 'Animation läuft (Standard)'],
    ['paused', 'Animation ist angehalten']
  ],
  initial: 'running',
  inherited: false,
  example: '.marquee {\n  animation: scroll 10s linear infinite;\n}\n.marquee:hover {\n  animation-play-state: paused;\n}',
  demo: '<style>body{padding:24px;font-family:sans-serif}@keyframes spin{to{transform:rotate(360deg)}}.b{width:60px;height:60px;background:#b4367a;color:#fff;display:grid;place-items:center;font-size:11px;animation:spin 2s linear infinite}.b:hover{animation-play-state:paused}</style><div class="b">Hover = Pause</div><p style="font-size:12px">Fahre mit der Maus darüber.</p>',
  keywords: ['pause', 'anhalten', 'paused', 'running', 'stoppen'],
  related: ['animation', 'animation-delay', ':hover'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/animation-play-state'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'animation-timeline',
  desc: 'Koppelt den Fortschritt einer Animation an Scrollen statt an die Zeit.',
  details: 'Statt der Zeitachse dient eine Scroll- oder View-Timeline als Taktgeber: `scroll()` bindet an die Scrollposition eines Containers (z. B. Lesefortschrittsbalken), `view()` an die Sichtbarkeit des Elements im Scrollbereich (Einblend-Effekte). Dann `animation-duration` auf `auto` lassen; mit `animation-range` lässt sich der aktive Bereich eingrenzen. Unterstützt in Chromium-Browsern und Safari; in Firefox noch hinter einem Flag, daher `@supports (animation-timeline: scroll())` verwenden.',
  syntax: 'animation-timeline: auto | scroll() | view() | <name>;',
  values: [
    ['auto', 'Standard: Zeit-basierte Timeline des Dokuments'],
    ['scroll()', 'Fortschritt des nächsten Scroll-Containers, z. B. `scroll(root block)`'],
    ['view()', 'Fortschritt der Sichtbarkeit des Elements im Scrollport'],
    ['--name', 'Benannte Timeline via `scroll-timeline-name` / `view-timeline-name`']
  ],
  initial: 'auto',
  inherited: false,
  example: '@keyframes grow {\n  from { transform: scaleX(0); }\n  to   { transform: scaleX(1); }\n}\n.progress {\n  transform-origin: left;\n  animation: grow linear both;\n  animation-timeline: scroll(root);\n}\n\n.reveal {\n  animation: fade-in linear both;\n  animation-timeline: view();\n  animation-range: entry 0% cover 30%;\n}',
  demo: '<style>body{margin:0;font-family:sans-serif}@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}.sc{height:130px;overflow:auto;position:relative;scroll-timeline:--s block}.bar{position:sticky;top:0;height:8px;background:#b4367a;transform-origin:left;animation:grow linear both;animation-timeline:--s}.c{height:500px;padding:10px;font-size:12px;background:linear-gradient(#fff,#cde)}</style><div class="sc"><div class="bar"></div><div class="c">Scrolle in diesem Kasten nach unten. Der Balken oben füllt sich (nur in Browsern mit Scroll-Timelines).</div></div>',
  tip: 'Scrollgebundene Animationen laufen oft auf dem Compositor und sind flüssiger als JavaScript-Scroll-Listener.',
  keywords: ['scroll animation', 'scroll-driven', 'view timeline', 'scroll timeline', 'lesefortschritt', 'parallax'],
  related: ['animation', 'animation-duration', '@keyframes'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/animation-timeline'
}, {
  lang: 'css',
  group: 'Übergänge & Animationen',
  name: 'view-transition-name',
  desc: 'Markiert ein Element für die View Transitions API und gibt ihm einen Namen.',
  details: 'Elemente mit gleichem Namen vor und nach einem DOM- bzw. Seitenwechsel werden automatisch ineinander überblendet bzw. bewegt. Der Name muss im Dokument eindeutig sein, sonst bricht die Transition ab. Gesteuert wird sie über die Pseudo-Elemente `::view-transition-old(name)` und `::view-transition-new(name)`. Für Seitenwechsel über Dokumente hinweg genügt `@view-transition { navigation: auto; }`. Verfügbar in Chromium und Safari, Firefox zieht nach.',
  syntax: 'view-transition-name: none | <name>;',
  values: [
    ['none', 'Nimmt nicht an einer View Transition teil (Standard)'],
    ['<name>', 'Eindeutiger Bezeichner, z. B. `hero-image`'],
    ['auto', 'Browser vergibt Namen automatisch (neuere Spezifikation)']
  ],
  initial: 'none',
  inherited: false,
  example: '.product-image {\n  view-transition-name: product;\n}\n\n::view-transition-old(product),\n::view-transition-new(product) {\n  animation-duration: 0.4s;\n}',
  demo: '<style>body{padding:20px;font-family:sans-serif;font-size:12px}.b{width:100px;height:50px;background:#b4367a;color:#fff;display:grid;place-items:center;view-transition-name:demo-box}</style><div class="b">Name: demo-box</div><p>View Transitions werden per JavaScript (`document.startViewTransition`) ausgelöst und lassen sich in dieser Vorschau nicht zeigen.</p>',
  tip: 'Jeder Name darf pro Zustand nur einmal vorkommen. Bei Listen die Namen per Inline-Style mit der ID vergeben.',
  keywords: ['view transition', 'seitenübergang', 'morph', 'startViewTransition', 'shared element'],
  related: ['transition', 'animation', '@view-transition'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/view-transition-name'
});

/* ===== Interaktion & Bedienung ===== */
window.CHEAT.push({
  lang: 'css',
  group: 'Interaktion & Bedienung',
  name: 'cursor',
  desc: 'Legt die Form des Mauszeigers über einem Element fest.',
  details: 'Der Cursor signalisiert, was man mit dem Element tun kann: klicken (`pointer`), tippen (`text`), ziehen (`grab`) oder dass etwas nicht möglich ist (`not-allowed`). Man kann ein Bild per `url()` angeben, muss aber immer einen Standardwert als Fallback anhängen. Auf Touchgeräten gibt es keinen Cursor. Standardmäßig zeigen Links `pointer`; auf eigenen klickbaren Elementen muss man ihn selbst setzen.',
  syntax: 'cursor: [url(bild.png) x y,]* <schlüsselwort>;',
  values: [
    ['auto', 'Browser entscheidet (Standard)'],
    ['default', 'Standardpfeil'],
    ['pointer', 'Hand, für Links und Buttons'],
    ['text', 'Textcursor (I-Balken)'],
    ['move', 'Verschieben'],
    ['grab / grabbing', 'Offene bzw. geschlossene Hand zum Ziehen'],
    ['not-allowed', 'Aktion nicht erlaubt'],
    ['wait / progress', 'Warten bzw. Laden im Hintergrund'],
    ['help', 'Fragezeichen für Hilfe'],
    ['crosshair', 'Fadenkreuz'],
    ['zoom-in / zoom-out', 'Lupe zum Vergrößern bzw. Verkleinern'],
    ['col-resize / row-resize', 'Spalten- bzw. Zeilengröße ändern'],
    ['none', 'Cursor ausblenden']
  ],
  initial: 'auto',
  inherited: true,
  example: '.btn { cursor: pointer; }\n.btn:disabled { cursor: not-allowed; }\n.draggable { cursor: grab; }\n.draggable:active { cursor: grabbing; }',
  demo: '<style>body{display:flex;flex-wrap:wrap;gap:8px;padding:12px;font-family:sans-serif;font-size:11px}div{width:80px;height:36px;background:#eef;border:1px solid #99c;display:grid;place-items:center;border-radius:4px}</style><div style="cursor:default">default</div><div style="cursor:pointer">pointer</div><div style="cursor:text">text</div><div style="cursor:move">move</div><div style="cursor:grab">grab</div><div style="cursor:not-allowed">not-allowed</div><div style="cursor:wait">wait</div><div style="cursor:help">help</div><div style="cursor:crosshair">crosshair</div><div style="cursor:zoom-in">zoom-in</div><div style="cursor:col-resize">col-resize</div><div style="cursor:progress">progress</div>',
  tip: 'Deaktivierte Buttons: `cursor: not-allowed` zusammen mit `pointer-events: none` funktioniert nicht, da der Cursor dann nicht mehr greift.',
  keywords: ['mauszeiger', 'zeiger', 'hand', 'pointer', 'maus', 'cursor'],
  related: ['pointer-events', 'user-select', 'resize'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/cursor'
}, {
  lang: 'css',
  group: 'Interaktion & Bedienung',
  name: 'pointer-events',
  desc: 'Steuert, ob ein Element auf Maus-, Touch- und Zeigerereignisse reagiert.',
  details: 'Mit `none` ignoriert das Element Klicks und Hover, die Ereignisse gehen an das darunterliegende Element. Kinder können mit `pointer-events: auto` wieder aktiviert werden. Praktisch für Overlays, durch die man klicken können soll. Achtung: Die Tastatur-Bedienung wird dadurch nicht verhindert – Fokus und Aktivierung per Tab/Enter bleiben möglich, daher zusätzlich `disabled` bzw. `inert` nutzen.',
  syntax: 'pointer-events: auto | none;',
  values: [
    ['auto', 'Normales Verhalten (Standard)'],
    ['none', 'Element ist für Zeigerereignisse „durchsichtig“'],
    ['all / visiblePainted / ...', 'Weitere Werte nur für SVG']
  ],
  initial: 'auto',
  inherited: true,
  example: '.overlay {\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n}\n.overlay .close {\n  pointer-events: auto;\n}',
  demo: '<style>body{padding:20px;font-family:sans-serif;font-size:12px}.w{position:relative;width:200px;height:50px}.btn{position:absolute;inset:0;background:#2c7fb8;color:#fff;border:0;cursor:pointer}.btn:hover{background:#b4367a}.ov{position:absolute;inset:0;background:rgba(255,200,0,.4);pointer-events:none;display:grid;place-items:center;color:#000}</style><div class="w"><button class="btn">Klickbar (Hover)</button><div class="ov">Overlay mit pointer-events:none</div></div>',
  tip: 'Nur `pointer-events: none` verhindert nicht die Bedienung per Tastatur. Für echtes Deaktivieren `inert` oder `disabled` verwenden.',
  keywords: ['klicks ignorieren', 'durchklicken', 'overlay', 'deaktivieren', 'events'],
  related: ['cursor', 'user-select', 'touch-action'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/pointer-events'
}, {
  lang: 'css',
  group: 'Interaktion & Bedienung',
  name: 'user-select',
  desc: 'Steuert, ob Text vom Nutzer markiert werden kann.',
  details: '`none` verhindert die Textauswahl – sinnvoll für Buttons, Icons und Drag-Elemente, aber nicht für Inhalte, die jemand kopieren möchte. `all` markiert beim Klick den ganzen Block, praktisch für Codes oder IDs zum Kopieren. Safari benötigt weiterhin `-webkit-user-select`. Die Auswahl über die Tastatur oder Screenreader wird teils trotzdem möglich bleiben.',
  syntax: 'user-select: auto | none | text | all | contain;',
  values: [
    ['auto', 'Browserstandard'],
    ['none', 'Nicht markierbar'],
    ['text', 'Markierbar (auch wenn Eltern `none` haben)'],
    ['all', 'Ein Klick markiert den gesamten Inhalt']
  ],
  initial: 'auto',
  inherited: false,
  example: '.btn {\n  -webkit-user-select: none;\n  user-select: none;\n}\n.code-id {\n  user-select: all;\n}',
  demo: '<style>body{padding:16px;font-family:sans-serif;font-size:13px}p{margin:6px 0;padding:8px;background:#eef;border-radius:4px}</style><p style="user-select:none;-webkit-user-select:none">none: lässt sich nicht markieren</p><p style="user-select:all;-webkit-user-select:all">all: ein Klick markiert alles</p><p>auto: normal markierbar</p>',
  keywords: ['markieren', 'auswählen', 'kopieren', 'selection', 'textauswahl'],
  related: ['pointer-events', 'cursor', '::selection'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/user-select'
}, {
  lang: 'css',
  group: 'Interaktion & Bedienung',
  name: 'resize',
  desc: 'Macht ein Element vom Nutzer in der Größe veränderbar.',
  details: 'Zeigt unten rechts einen Anfasser an. Wirkt nur, wenn `overflow` nicht `visible` ist (bei `textarea` standardmäßig bereits gesetzt). `resize: vertical` ist bei Textfeldern die gängigste Wahl, um das Layout nicht zu sprengen. Mit `min-`/`max-width` bzw. `-height` begrenzt man den Bereich.',
  syntax: 'resize: none | both | horizontal | vertical | block | inline;',
  values: [
    ['none', 'Nicht änderbar (Standard)'],
    ['both', 'In beide Richtungen'],
    ['horizontal', 'Nur in der Breite'],
    ['vertical', 'Nur in der Höhe'],
    ['block / inline', 'Logische Richtungen']
  ],
  initial: 'none',
  inherited: false,
  example: 'textarea {\n  resize: vertical;\n  min-height: 4rem;\n  max-height: 20rem;\n}\n.panel {\n  overflow: auto;\n  resize: both;\n}',
  demo: '<style>body{padding:16px;font-family:sans-serif;font-size:12px}.p{width:180px;height:70px;overflow:auto;resize:both;border:2px solid #b4367a;padding:6px}</style><div class="p">Ziehe die Ecke unten rechts, um die Größe zu ändern.</div>',
  tip: 'Ohne `overflow` ungleich `visible` hat `resize` keine Wirkung.',
  keywords: ['größe ändern', 'textarea', 'ziehen', 'anfasser', 'resize'],
  related: ['overflow', 'min-width', 'max-height'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/resize'
}, {
  lang: 'css',
  group: 'Interaktion & Bedienung',
  name: 'appearance',
  desc: 'Schaltet das native Erscheinungsbild von Formularelementen ein oder aus.',
  details: 'Mit `appearance: none` wird die Standarddarstellung des Betriebssystems entfernt, sodass man Checkboxen, Selects oder Buttons komplett selbst gestalten kann. Danach fehlt z. B. der Dropdown-Pfeil beim `select`, den man per Hintergrundbild nachrüsten muss. Für Barrierefreiheit müssen Fokusstile selbst bereitgestellt werden. Safari kennt zusätzlich `-webkit-appearance`.',
  syntax: 'appearance: none | auto | menulist-button | textfield;',
  values: [
    ['auto', 'Native Darstellung (Standard)'],
    ['none', 'Native Darstellung entfernen'],
    ['textfield', 'Wie ein Textfeld darstellen, z. B. bei `input[type=number]`'],
    ['menulist-button', 'Wie ein Dropdown-Button']
  ],
  initial: 'none',
  inherited: false,
  example: 'input[type="checkbox"] {\n  appearance: none;\n  width: 1.25rem;\n  height: 1.25rem;\n  border: 2px solid #555;\n  border-radius: 4px;\n}\ninput[type="checkbox"]:checked {\n  background: #2c7fb8;\n}',
  demo: '<style>body{padding:16px;font-family:sans-serif;font-size:12px;display:flex;gap:20px;align-items:center}.c{appearance:none;-webkit-appearance:none;width:22px;height:22px;border:2px solid #555;border-radius:5px;margin:0;cursor:pointer}.c:checked{background:#b4367a;border-color:#b4367a}</style><label><input type="checkbox"> nativ</label><label><input type="checkbox" class="c"> eigen</label>',
  tip: 'Nach `appearance: none` auf `:focus-visible` achten, damit Tastaturnutzer den Fokus sehen.',
  keywords: ['formular', 'native darstellung', 'checkbox', 'select', 'custom', 'reset'],
  related: ['accent-color', 'outline', 'border-radius'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/appearance'
}, {
  lang: 'css',
  group: 'Interaktion & Bedienung',
  name: 'touch-action',
  desc: 'Legt fest, welche Touch-Gesten der Browser selbst behandeln darf.',
  details: 'Wird gesetzt, wenn eigene Gesten (Zeichnen, Karten, Slider) gebaut werden und das Scrollen oder Zoomen des Browsers stören würde. `touch-action: none` schaltet alle Browser-Gesten auf dem Element ab, `pan-y` erlaubt nur vertikales Scrollen (typisch für horizontale Karussells). `manipulation` entfernt die Doppeltipp-Zoom-Verzögerung von ca. 300 ms bei Buttons.',
  syntax: 'touch-action: auto | none | pan-x | pan-y | pinch-zoom | manipulation;',
  values: [
    ['auto', 'Alle Gesten erlaubt (Standard)'],
    ['none', 'Keine Browser-Gesten'],
    ['pan-x / pan-y', 'Nur horizontales bzw. vertikales Wischen'],
    ['pinch-zoom', 'Zoomen per Pinch erlaubt'],
    ['manipulation', 'Scrollen und Pinch-Zoom, aber kein Doppeltipp-Zoom']
  ],
  initial: 'auto',
  inherited: false,
  example: '.canvas {\n  touch-action: none;\n}\n.carousel {\n  touch-action: pan-y;\n}\nbutton {\n  touch-action: manipulation;\n}',
  demo: '<style>body{padding:16px;font-family:sans-serif;font-size:12px}.b{width:200px;height:70px;background:#eef;border:2px dashed #b4367a;display:grid;place-items:center;touch-action:none}</style><div class="b">touch-action: none (nur auf Touch-Geräten relevant)</div>',
  keywords: ['touch', 'gesten', 'wischen', 'zoom', 'scroll', 'mobil', 'pointer events'],
  related: ['pointer-events', 'overscroll-behavior', 'user-select'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/touch-action'
}, {
  lang: 'css',
  group: 'Interaktion & Bedienung',
  name: 'interpolate-size',
  desc: 'Erlaubt Animationen von und zu intrinsischen Größen wie `auto`.',
  details: 'Mit `interpolate-size: allow-keywords` lassen sich Übergänge zwischen `height: 0` und `height: auto` (sowie `min-content`, `max-content`, `fit-content`) animieren, was bisher nicht ging. Die Eigenschaft ist vererbbar, meist setzt man sie einmal auf `:root`. Verfügbar in Chromium-Browsern; Firefox und Safari ziehen nach, ältere Browser springen einfach ohne Animation.',
  syntax: 'interpolate-size: numeric-only | allow-keywords;',
  values: [
    ['numeric-only', 'Nur numerische Werte animierbar (Standard)'],
    ['allow-keywords', 'Auch Schlüsselwörter wie `auto` und `min-content`']
  ],
  initial: 'numeric-only',
  inherited: true,
  example: ':root {\n  interpolate-size: allow-keywords;\n}\n.panel {\n  height: 0;\n  overflow: hidden;\n  transition: height 0.3s;\n}\n.panel.open {\n  height: auto;\n}',
  demo: '<style>:root{interpolate-size:allow-keywords}body{padding:16px;font-family:sans-serif;font-size:12px}.p{height:0;overflow:hidden;background:#cde;transition:height .4s;width:200px}.w:hover .p{height:auto}.h{background:#b4367a;color:#fff;padding:8px;width:184px}</style><div class="w"><div class="h">Hover zum Aufklappen</div><div class="p"><p style="margin:8px">Dieser Inhalt hat eine automatische Höhe und klappt weich auf.<br>Zweite Zeile.<br>Dritte Zeile.</p></div></div>',
  keywords: ['height auto', 'aufklappen', 'accordion', 'auto animieren', 'allow-keywords'],
  related: ['transition', 'height', 'transition-behavior', 'calc-size()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/interpolate-size'
});

/* ===== Performance & Rendering ===== */
window.CHEAT.push({
  lang: 'css',
  group: 'Performance & Rendering',
  name: 'will-change',
  desc: 'Gibt dem Browser einen Hinweis, welche Eigenschaften sich bald ändern werden.',
  details: 'Der Browser kann das Element vorab auf eine eigene Ebene legen und Animationen so flüssiger darstellen. Nicht überall einsetzen: Jede zusätzliche Ebene verbraucht Speicher, und `will-change` auf zu vielen Elementen schadet der Performance. Am besten kurz vor der Animation setzen und danach entfernen, oder nur auf wenige gezielte Elemente anwenden. Einige Werte (z. B. `transform`, `opacity`) erzeugen einen Stacking Context.',
  syntax: 'will-change: auto | <eigenschaft> [, <eigenschaft> ...];',
  values: [
    ['auto', 'Kein Hinweis (Standard)'],
    ['transform', 'Element wird transformiert'],
    ['opacity', 'Deckkraft ändert sich'],
    ['scroll-position', 'Scrollposition ändert sich'],
    ['contents', 'Inhalt ändert sich häufig']
  ],
  initial: 'auto',
  inherited: false,
  example: '.menu {\n  transition: transform 0.3s;\n}\n.menu-wrapper:hover .menu {\n  will-change: transform;\n}',
  demo: '<style>body{padding:20px;font-family:sans-serif}.b{width:80px;height:50px;background:#b4367a;color:#fff;display:grid;place-items:center;font-size:11px;transition:transform .3s}.w:hover .b{will-change:transform;transform:translateX(60px)}.w{width:200px;border:1px dashed #999;padding:4px}</style><div class="w"><div class="b">transform</div></div><p style="font-size:12px">Fahre mit der Maus über den Rahmen.</p>',
  tip: 'Kein Allheilmittel: Nicht pauschal `* { will-change: transform }` setzen. Erst messen, ob es wirklich hilft.',
  keywords: ['gpu', 'ebene', 'layer', 'optimierung', 'compositing', 'leistung'],
  related: ['transform', 'animation', 'contain', 'content-visibility'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/will-change'
}, {
  lang: 'css',
  group: 'Performance & Rendering',
  name: 'contain',
  desc: 'Isoliert den Teilbaum eines Elements, damit der Browser weniger neu berechnen muss.',
  details: 'Man sagt dem Browser, dass Layout, Stil, Größe oder Darstellung eines Elements unabhängig vom Rest der Seite sind. Änderungen im Inneren lösen dann keine Neuberechnung außerhalb aus. `contain: content` fasst `layout`, `paint` und `style` zusammen, `strict` zusätzlich `size` (Größe muss dann explizit gesetzt sein, sonst fällt das Element auf 0 zusammen). Mit `paint` werden Inhalte außerhalb der Box abgeschnitten.',
  syntax: 'contain: none | strict | content | size | layout | style | paint;',
  values: [
    ['none', 'Keine Isolation (Standard)'],
    ['layout', 'Layout innen wirkt nicht nach außen'],
    ['paint', 'Nichts wird außerhalb der Box gezeichnet'],
    ['size', 'Größe hängt nicht von den Kindern ab'],
    ['style', 'Zähler und Zitate wirken nur innerhalb'],
    ['content', 'Kurzform für `layout paint style`'],
    ['strict', 'Kurzform für `size layout paint style`']
  ],
  initial: 'none',
  inherited: false,
  example: '.widget {\n  contain: content;\n}\n.list-item {\n  contain: layout paint;\n}',
  demo: '<style>body{padding:20px;font-family:sans-serif;font-size:12px;display:flex;gap:30px}.b{width:100px;height:60px;border:2px solid #b4367a;position:relative}.in{position:absolute;left:60px;top:30px;width:80px;height:50px;background:rgba(44,127,184,.7);color:#fff;font-size:11px}.c{contain:paint}</style><div class="b"><div class="in">ohne</div></div><div class="b c"><div class="in">contain: paint</div></div>',
  tip: '`contain: size` oder `strict` ohne feste Größe lässt das Element auf 0×0 schrumpfen.',
  keywords: ['isolation', 'layout', 'paint', 'strict', 'content', 'optimierung', 'rendering'],
  related: ['content-visibility', 'will-change', 'overflow'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/contain'
}, {
  lang: 'css',
  group: 'Performance & Rendering',
  name: 'content-visibility',
  desc: 'Überspringt Rendering von Inhalten außerhalb des sichtbaren Bereichs.',
  details: 'Mit `auto` rendert der Browser Elemente erst, wenn sie in die Nähe des Viewports kommen, und spart damit bei langen Seiten Layout- und Paint-Zeit. Weil nicht gerenderte Elemente keine Größe haben, springt die Scrollleiste; dies lässt sich mit `contain-intrinsic-size` (z. B. `auto 500px`) als Platzhalter abmildern. Inhalte bleiben für Suche, Fokus und Screenreader erreichbar. Von allen modernen Browsern unterstützt.',
  syntax: 'content-visibility: visible | auto | hidden;',
  values: [
    ['visible', 'Normal rendern (Standard)'],
    ['auto', 'Nur rendern, wenn nah am Sichtbereich'],
    ['hidden', 'Nie rendern, Zustand bleibt erhalten (schneller als `display: none` beim Wiedereinblenden)']
  ],
  initial: 'visible',
  inherited: false,
  example: '.article-section {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 600px;\n}',
  demo: '<style>body{padding:16px;font-family:sans-serif;font-size:12px}.s{content-visibility:auto;contain-intrinsic-size:auto 60px;background:#eef;margin:6px 0;padding:8px;border-radius:4px}</style><div class="s">Abschnitt 1 (content-visibility: auto)</div><div class="s">Abschnitt 2</div><div class="s">Abschnitt 3</div><p>Wirkung zeigt sich erst bei sehr langen Seiten.</p>',
  tip: 'Immer zusammen mit `contain-intrinsic-size` verwenden, sonst springt der Scrollbalken.',
  keywords: ['lazy rendering', 'offscreen', 'lange listen', 'rendering überspringen', 'core web vitals'],
  related: ['contain', 'will-change'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/content-visibility'
});

/* ===== Anchor Positioning ===== */
window.CHEAT.push({
  lang: 'css',
  group: 'Anchor Positioning',
  name: 'anchor-name',
  desc: 'Macht ein Element zum Anker, an dem andere Elemente positioniert werden können.',
  details: 'Vergibt einen Namen in Form eines Dashed Ident (`--name`), auf den andere Elemente per `position-anchor` oder `anchor()` verweisen. Gedacht für Tooltips, Popover und Menüs, die an einem Auslöser hängen, ohne JavaScript-Positionsberechnung. Unterstützt in Chromium-Browsern und Safari (aktuelle Versionen); Firefox hat es noch nicht im Stable-Kanal. Daher mit `@supports (anchor-name: --a)` absichern.',
  syntax: 'anchor-name: none | <dashed-ident> [, <dashed-ident> ...];',
  values: [
    ['none', 'Kein Anker (Standard)'],
    ['--name', 'Name des Ankers, muss mit `--` beginnen']
  ],
  initial: 'none',
  inherited: false,
  example: '.trigger {\n  anchor-name: --tip;\n}\n.tooltip {\n  position: absolute;\n  position-anchor: --tip;\n  position-area: top;\n}',
  demo: '<style>body{padding:60px 20px;font-family:sans-serif;font-size:12px}.t{anchor-name:--tip;display:inline-block;padding:8px 14px;background:#2c7fb8;color:#fff;border-radius:4px}.tip{position:absolute;position-anchor:--tip;position-area:top;background:#222;color:#fff;padding:4px 8px;border-radius:4px;margin-bottom:6px}</style><div class="t">Anker</div><div class="tip">Tooltip oben</div><p>Ohne Anchor-Positioning-Unterstützung erscheint der Tooltip an der Standardposition.</p>',
  keywords: ['anker', 'anchor', 'tooltip', 'popover', 'positionierung'],
  related: ['position-anchor', 'position-area', 'anchor()', 'position'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/anchor-name'
}, {
  lang: 'css',
  group: 'Anchor Positioning',
  name: 'position-anchor',
  desc: 'Wählt den Anker, an dem ein absolut positioniertes Element ausgerichtet wird.',
  details: 'Wird am positionierten Element (`position: absolute` oder `fixed`) gesetzt und verweist auf einen mit `anchor-name` benannten Anker. Danach können `anchor()` und `position-area` ohne Namensangabe verwendet werden. Ohne `position-anchor` kann ein impliziter Anker, etwa bei Popovern mit `popovertarget`, greifen. Die Browser-Unterstützung entspricht der von `anchor-name`: Chromium und Safari, Firefox noch nicht stabil.',
  syntax: 'position-anchor: auto | <dashed-ident>;',
  values: [
    ['auto', 'Impliziter Anker, z. B. bei Popover-Auslösern (Standard)'],
    ['--name', 'Name aus `anchor-name`']
  ],
  initial: 'auto',
  inherited: false,
  example: '.menu {\n  position: fixed;\n  position-anchor: --btn;\n  top: anchor(bottom);\n  left: anchor(left);\n}',
  demo: '<style>body{padding:20px;font-family:sans-serif;font-size:12px}.t{anchor-name:--b;display:inline-block;padding:8px 14px;background:#2c7fb8;color:#fff}.m{position:absolute;position-anchor:--b;top:anchor(bottom);left:anchor(left);background:#eee;padding:6px 10px;border:1px solid #999}</style><div class="t">Button</div><div class="m">Menü darunter</div>',
  keywords: ['anker zuweisen', 'anchor', 'verknüpfen'],
  related: ['anchor-name', 'position-area', 'anchor()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/position-anchor'
}, {
  lang: 'css',
  group: 'Anchor Positioning',
  name: 'position-area',
  desc: 'Platziert ein Element in einem 3×3-Raster relativ zu seinem Anker.',
  details: 'Das Raster wird um den Anker gelegt, die Werte bestimmen die Zelle für das positionierte Element, z. B. `top`, `bottom right` oder `span-all`. Spart manuelles Berechnen mit `anchor()`. Ergänzend sorgt `position-try-fallbacks` dafür, dass das Element bei Platzmangel auf die andere Seite springt. Unterstützt in Chromium und Safari, in Firefox noch nicht im Stable-Kanal.',
  syntax: 'position-area: <bereich>;',
  values: [
    ['none', 'Kein Bereich (Standard)'],
    ['top / bottom / left / right', 'Oberhalb, unterhalb, links, rechts des Ankers'],
    ['top left / bottom right', 'Diagonale Ecken'],
    ['center', 'Über dem Anker'],
    ['span-top / span-all', 'Mehrere Zellen überspannen'],
    ['block-start / inline-end', 'Logische Entsprechungen']
  ],
  initial: 'none',
  inherited: false,
  example: '.popover {\n  position: absolute;\n  position-anchor: --btn;\n  position-area: bottom span-right;\n  position-try-fallbacks: flip-block;\n}',
  demo: '<style>body{padding:60px 40px;font-family:sans-serif;font-size:12px}.t{anchor-name:--a;display:inline-block;padding:8px 14px;background:#2c7fb8;color:#fff}.p{position:absolute;position-anchor:--a;position-area:bottom;background:#222;color:#fff;padding:4px 8px;border-radius:4px;margin-top:6px}</style><div class="t">Anker</div><div class="p">unterhalb</div>',
  keywords: ['raster', 'grid', 'popover position', 'tooltip platzieren', 'anchor'],
  related: ['anchor-name', 'position-anchor', 'anchor()'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/position-area'
}, {
  lang: 'css',
  group: 'Anchor Positioning',
  name: 'anchor()',
  desc: 'Funktion, die einen Wert aus der Position eines Ankers liest, z. B. für `top` oder `left`.',
  details: 'Wird in Inset-Eigenschaften (`top`, `left`, `inset-inline-start` …) eines absolut positionierten Elements genutzt und liefert die Koordinate einer Seite des Ankers, z. B. `top: anchor(bottom)`. Ohne Namen gilt `position-anchor`, mit Namen `anchor(--name bottom)`. Es sind auch Prozentwerte und ein Fallback möglich. `anchor-size()` liefert entsprechend Breite/Höhe. Unterstützt in Chromium und Safari; Firefox noch nicht stabil.',
  syntax: 'anchor(<anker-name>? <seite>, <fallback>?)',
  values: [
    ['top / bottom / left / right', 'Physische Seite des Ankers'],
    ['start / end / self-start / self-end', 'Logische Seite'],
    ['center', 'Mitte des Ankers'],
    ['50%', 'Prozentuale Position entlang der Achse'],
    ['--name', 'Optional: Name des Ankers vor der Seite']
  ],
  initial: '–',
  inherited: false,
  example: '.tooltip {\n  position: absolute;\n  position-anchor: --tip;\n  bottom: anchor(top);\n  left: anchor(center);\n  translate: -50% 0;\n}',
  demo: '<style>body{padding:70px 40px;font-family:sans-serif;font-size:12px}.t{anchor-name:--x;display:inline-block;padding:8px 14px;background:#2c7fb8;color:#fff}.tip{position:absolute;position-anchor:--x;bottom:anchor(top);left:anchor(center);translate:-50% -6px;background:#222;color:#fff;padding:4px 8px;border-radius:4px;white-space:nowrap}</style><div class="t">Anker</div><div class="tip">mittig darüber</div>',
  tip: 'Für einfache Fälle ist `position-area` kürzer; `anchor()` bietet dafür pixelgenaue Kontrolle.',
  keywords: ['anker funktion', 'anchor function', 'top anchor', 'inset', 'tooltip'],
  related: ['anchor-name', 'position-anchor', 'position-area', 'position'],
  mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/anchor'
});
