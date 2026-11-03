window.CHEAT = window.CHEAT || [];
(function () {
  var B = '*{box-sizing:border-box}body{margin:0;font:14px sans-serif}.c{background:#eef;padding:6px;border:1px dashed #99b}.c>*{background:#b4367a;color:#fff;padding:8px 12px;border-radius:4px}';
  function d(css, html) { return '<style>' + B + css + '</style>' + html; }
  function n(k, cls) {
    var s = '';
    for (var i = 1; i <= k; i++) s += '<div' + (cls ? ' class="' + cls + '"' : '') + '>' + i + '</div>';
    return s;
  }
  function box(cls, k) { return '<div class="c ' + cls + '">' + n(k) + '</div>'; }
  var M = 'https://developer.mozilla.org/de/docs/Web/CSS/';

  window.CHEAT.push(
  // ---------------- Flexbox ----------------
  {
    lang: 'css', group: 'Flexbox', name: 'flex-direction',
    desc: 'Legt die Hauptachse eines Flex-Containers fest.',
    details: 'Gehört auf den Flex-Container und bestimmt, in welche Richtung die Items angeordnet werden. Mit `column` wird die Hauptachse vertikal, und `justify-content` wirkt dann auf die Vertikale. Die `-reverse`-Varianten ändern nur die visuelle Reihenfolge, nicht die Tab-Reihenfolge, was für die Barrierefreiheit problematisch sein kann.',
    syntax: 'flex-direction: row | row-reverse | column | column-reverse;',
    values: [['row', 'Zeilenweise von links nach rechts (Standard, abhängig von der Schreibrichtung)'], ['row-reverse', 'Zeilenweise, umgekehrte Reihenfolge'], ['column', 'Spaltenweise von oben nach unten'], ['column-reverse', 'Spaltenweise von unten nach oben']],
    initial: 'row', inherited: false,
    example: '.menu {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}',
    demo: d('.c{display:flex;gap:6px;margin-bottom:8px}.col{flex-direction:column;width:120px}', '<p>row</p>' + box('', 3) + '<p>column</p>' + box('col', 3)),
    tip: 'Bei `column` braucht der Container eine Höhe, damit `justify-content` sichtbar wirkt.',
    keywords: ['richtung', 'hauptachse', 'direction', 'spalte', 'zeile', 'main axis'],
    related: ['flex-wrap', 'flex-flow', 'justify-content', 'display'], mdn: M + 'flex-direction'
  },
  {
    lang: 'css', group: 'Flexbox', name: 'flex-wrap',
    desc: 'Bestimmt, ob Flex-Items in mehrere Zeilen umbrechen dürfen.',
    details: 'Wird auf den Flex-Container gesetzt. Standardmäßig bleiben alle Items in einer Zeile und werden dabei geschrumpft (`nowrap`); mit `wrap` brechen sie in neue Zeilen um, sobald der Platz nicht reicht. Bei mehreren Zeilen verteilt `align-content` den Platz zwischen den Zeilen.',
    syntax: 'flex-wrap: nowrap | wrap | wrap-reverse;',
    values: [['nowrap', 'Alle Items in einer Zeile (Standard)'], ['wrap', 'Umbruch in weitere Zeilen'], ['wrap-reverse', 'Umbruch, neue Zeilen erscheinen oberhalb']],
    initial: 'nowrap', inherited: false,
    example: '.tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}',
    demo: d('.c{display:flex;flex-wrap:wrap;gap:6px;width:200px}.c>*{width:70px}', box('', 6)),
    tip: 'Ohne `wrap` quetscht Flexbox Items zusammen, statt umzubrechen.',
    keywords: ['umbruch', 'mehrzeilig', 'wrap', 'zeilenumbruch'],
    related: ['flex-direction', 'flex-flow', 'align-content', 'gap'], mdn: M + 'flex-wrap'
  },
  {
    lang: 'css', group: 'Flexbox', name: 'flex-flow',
    desc: 'Kurzschreibweise für flex-direction und flex-wrap.',
    details: 'Gehört auf den Flex-Container und fasst `flex-direction` und `flex-wrap` in einer Deklaration zusammen. Die Reihenfolge der beiden Werte ist beliebig. Fehlt ein Wert, wird der Standardwert (`row` bzw. `nowrap`) verwendet.',
    syntax: 'flex-flow: <flex-direction> <flex-wrap>;',
    values: [['row wrap', 'Zeilen mit Umbruch'], ['column nowrap', 'Eine Spalte ohne Umbruch'], ['column wrap', 'Mehrere Spalten nebeneinander']],
    initial: 'row nowrap', inherited: false,
    example: '.gallery {\n  display: flex;\n  flex-flow: row wrap;\n}',
    demo: d('.c{display:flex;flex-flow:row wrap;gap:6px;width:200px}.c>*{width:70px}', box('', 5)),
    keywords: ['shorthand', 'kurzform', 'richtung umbruch'],
    related: ['flex-direction', 'flex-wrap'], mdn: M + 'flex-flow'
  },
  {
    lang: 'css', group: 'Flexbox', name: 'flex',
    desc: 'Kurzschreibweise für flex-grow, flex-shrink und flex-basis eines Flex-Items.',
    details: 'Wird auf das Flex-Item gesetzt und steuert, wie es wächst, schrumpft und welche Ausgangsgröße es hat. `flex: 1` steht für `1 1 0%` und lässt Items den Platz gleichmäßig teilen, `flex: none` macht sie starr. Vorsicht: Ein einzelner Wert ohne Einheit wird als `flex-grow` gelesen, ein Wert mit Einheit als `flex-basis`.',
    syntax: 'flex: <grow> <shrink> <basis>;  |  flex: auto | none | initial | <zahl>',
    values: [['initial', '0 1 auto (Standard)'], ['auto', '1 1 auto: wächst und schrumpft ab Inhaltsgröße'], ['none', '0 0 auto: völlig starr'], ['1', '1 1 0%: gleich breite Items'], ['2 1 200px', 'Doppelter Wachstumsanteil, Basis 200px']],
    initial: '0 1 auto', inherited: false,
    example: '.sidebar { flex: 0 0 240px; }\n.content { flex: 1; }',
    demo: d('.c{display:flex;gap:6px}.a{flex:1}.b{flex:2}.s{flex:none;width:60px}', '<div class="c"><div class="s">fix</div><div class="a">flex: 1</div><div class="b">flex: 2</div></div>'),
    tip: 'Immer die Kurzform `flex` statt der Einzeleigenschaften verwenden, sie setzt sinnvolle Standardwerte.',
    keywords: ['shorthand', 'wachsen', 'schrumpfen', 'grow', 'shrink', 'basis', 'verteilen'],
    related: ['flex-grow', 'flex-shrink', 'flex-basis', 'display'], mdn: M + 'flex'
  },
  {
    lang: 'css', group: 'Flexbox', name: 'flex-grow',
    desc: 'Legt fest, wie stark ein Flex-Item freien Platz aufnimmt.',
    details: 'Wird auf das Flex-Item gesetzt. Der übrige Platz im Container wird im Verhältnis der `flex-grow`-Werte aller Items verteilt; bei `0` wächst ein Item nicht. Der Wert ist ein Verhältnis, nicht ein Prozentwert: `2` bekommt doppelt so viel Zusatzplatz wie `1`, nicht doppelt so viel Gesamtbreite.',
    syntax: 'flex-grow: <zahl>;',
    values: [['0', 'Wächst nicht (Standard)'], ['1', 'Nimmt gleichen Anteil am Restplatz'], ['2', 'Nimmt doppelten Anteil am Restplatz']],
    initial: '0', inherited: false,
    example: '.item { flex-grow: 1; }\n.item--wide { flex-grow: 3; }',
    demo: d('.c{display:flex;gap:6px}.c>*{flex-basis:50px}.c>:nth-child(2){flex-grow:1}.c>:nth-child(3){flex-grow:2}', box('', 3)),
    keywords: ['wachsen', 'platz verteilen', 'grow'],
    related: ['flex', 'flex-shrink', 'flex-basis'], mdn: M + 'flex-grow'
  },
  {
    lang: 'css', group: 'Flexbox', name: 'flex-shrink',
    desc: 'Legt fest, wie stark ein Flex-Item bei Platzmangel schrumpft.',
    details: 'Wird auf das Flex-Item gesetzt und greift, wenn die Items zusammen größer als der Container sind. Bei `0` behält das Item seine Größe, bei höheren Werten wird es stärker verkleinert. Ein Item mit `flex-shrink: 0` kann überlaufen, wenn nichts anderes nachgibt.',
    syntax: 'flex-shrink: <zahl>;',
    values: [['1', 'Schrumpft anteilig (Standard)'], ['0', 'Schrumpft nie'], ['3', 'Schrumpft dreimal so stark']],
    initial: '1', inherited: false,
    example: '.logo { flex-shrink: 0; }',
    demo: d('.c{display:flex;gap:6px;width:240px}.c>*{flex-basis:100px}.c>:nth-child(1){flex-shrink:0}.c>:nth-child(3){flex-shrink:3}', box('', 3)),
    keywords: ['schrumpfen', 'verkleinern', 'shrink'],
    related: ['flex', 'flex-grow', 'flex-basis'], mdn: M + 'flex-shrink'
  },
  {
    lang: 'css', group: 'Flexbox', name: 'flex-basis',
    desc: 'Ausgangsgröße eines Flex-Items entlang der Hauptachse.',
    details: 'Wird auf das Flex-Item gesetzt und legt die Größe vor dem Verteilen von Platz fest. Bei `auto` wird `width` bzw. `height` (oder die Inhaltsgröße) verwendet; ein gesetzter Wert überschreibt `width` in einer Zeile. Das Item kann durch `flex-grow`/`flex-shrink` davon abweichen und wird zudem von `min-width` und `max-width` begrenzt.',
    syntax: 'flex-basis: auto | content | <länge> | <prozent>;',
    values: [['auto', 'Nimmt width/height oder Inhaltsgröße (Standard)'], ['0', 'Start bei null, Platz wird komplett verteilt'], ['200px', 'Feste Ausgangsbreite'], ['content', 'Größe nur nach dem Inhalt']],
    initial: 'auto', inherited: false,
    example: '.card {\n  flex-basis: 250px;\n  flex-grow: 1;\n}',
    demo: d('.c{display:flex;gap:6px}.c>:nth-child(1){flex-basis:50%}.c>:nth-child(2){flex-basis:100px}', box('', 3)),
    keywords: ['ausgangsgröße', 'basisbreite', 'basis'],
    related: ['flex', 'flex-grow', 'flex-shrink'], mdn: M + 'flex-basis'
  },
  {
    lang: 'css', group: 'Flexbox', name: 'order',
    desc: 'Ändert die visuelle Reihenfolge von Flex- und Grid-Items.',
    details: 'Wird auf das Item gesetzt. Items werden aufsteigend nach `order` sortiert, bei Gleichstand gilt die Reihenfolge im HTML. Die Tab-Reihenfolge und die Vorlese-Reihenfolge bleiben unverändert, deshalb sollte `order` nicht für inhaltlich wichtige Umsortierungen genutzt werden.',
    syntax: 'order: <ganzzahl>;',
    values: [['0', 'Standardposition'], ['-1', 'Vor alle Items mit 0'], ['1', 'Hinter alle Items mit 0']],
    initial: '0', inherited: false,
    example: '.sidebar { order: -1; }',
    demo: d('.c{display:flex;gap:6px}.c>:nth-child(1){order:3}.c>:nth-child(3){order:-1}', box('', 3) + '<p>Item 1 hat order 3, Item 3 hat order -1.</p>'),
    tip: 'Mobile-Umsortierung per `order` besser nur dekorativ einsetzen, nicht für den Lesefluss.',
    keywords: ['reihenfolge', 'sortieren', 'umsortieren'],
    related: ['flex-direction', 'grid-area'], mdn: M + 'order'
  },

  // ---------------- Ausrichtung ----------------
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'justify-content',
    desc: 'Verteilt Flex- bzw. Grid-Inhalte entlang der Hauptachse bzw. Zeilenachse.',
    details: 'Wirkt auf den Container (`display: flex` oder `grid`). In Flexbox verteilt es freien Platz auf der Hauptachse (bei `row` horizontal, bei `column` vertikal), in Grid richtet es das gesamte Raster in der Zeilenachse aus. Es hat nur Wirkung, wenn überhaupt freier Platz vorhanden ist.',
    syntax: 'justify-content: <wert>;',
    values: [['flex-start / start', 'Am Anfang (Standard bei flex)'], ['center', 'Zentriert'], ['flex-end / end', 'Am Ende'], ['space-between', 'Erstes und letztes Item am Rand, Rest gleichmäßig dazwischen'], ['space-around', 'Gleicher Abstand um jedes Item (außen halb so groß)'], ['space-evenly', 'Überall gleich große Abstände']],
    initial: 'normal', inherited: false,
    example: '.nav {\n  display: flex;\n  justify-content: space-between;\n}',
    demo: d('.c{display:flex;margin-bottom:6px}.a{justify-content:center}.b{justify-content:space-between}.e{justify-content:space-evenly}', '<p>center</p>' + box('a', 3) + '<p>space-between</p>' + box('b', 3) + '<p>space-evenly</p>' + box('e', 3)),
    tip: 'Die Querachse steuert `align-items`.',
    keywords: ['ausrichten', 'zentrieren', 'horizontal', 'hauptachse', 'verteilen', 'justify'],
    related: ['align-items', 'place-content', 'gap', 'display'], mdn: M + 'justify-content'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'align-items',
    desc: 'Richtet alle Items eines Containers auf der Querachse aus.',
    details: 'Gehört auf den Container und wirkt auf jedes Item. In Flexbox ist es die Querachse (bei `row` vertikal), in Grid die Blockachse innerhalb der Zelle. Der Standard `stretch` dehnt Items auf die volle Höhe; für Einzelausnahmen gibt es `align-self`.',
    syntax: 'align-items: <wert>;',
    values: [['stretch', 'Items füllen die Querachse (Standard)'], ['flex-start / start', 'Am Anfang der Querachse'], ['center', 'Mittig'], ['flex-end / end', 'Am Ende der Querachse'], ['baseline', 'An der Textgrundlinie ausgerichtet']],
    initial: 'normal', inherited: false,
    example: '.toolbar {\n  display: flex;\n  align-items: center;\n}',
    demo: d('.c{display:flex;gap:6px;height:90px;margin-bottom:6px}.c>:nth-child(2){padding:20px 12px}.s{align-items:stretch}.m{align-items:center}.e{align-items:flex-end}', '<div style="display:flex;gap:10px"><div style="flex:1">stretch' + box('s', 3) + '</div><div style="flex:1">center' + box('m', 3) + '</div><div style="flex:1">flex-end' + box('e', 3) + '</div></div>'),
    keywords: ['vertikal zentrieren', 'querachse', 'cross axis'],
    related: ['align-self', 'justify-content', 'place-items', 'align-content'], mdn: M + 'align-items'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'align-content',
    desc: 'Verteilt mehrere Flex-Zeilen bzw. Grid-Spuren auf der Querachse.',
    details: 'Gehört auf den Container und wirkt nur, wenn mehrere Zeilen vorhanden sind (Flexbox mit `flex-wrap: wrap`) oder das Grid kleiner als der Container ist. Bei einer einzeiligen Flexbox hat es keine Wirkung, dort greift `align-items`. Verwechslungsgefahr: `align-items` richtet Items in ihrer Zeile aus, `align-content` die Zeilen selbst.',
    syntax: 'align-content: <wert>;',
    values: [['stretch', 'Zeilen dehnen sich (Standard)'], ['start / flex-start', 'Zeilen am Anfang'], ['center', 'Zeilen zentriert'], ['end / flex-end', 'Zeilen am Ende'], ['space-between', 'Zeilen mit Abstand dazwischen'], ['space-around / space-evenly', 'Gleichmäßige Abstände um die Zeilen']],
    initial: 'normal', inherited: false,
    example: '.wrap {\n  display: flex;\n  flex-wrap: wrap;\n  height: 300px;\n  align-content: flex-start;\n}',
    demo: d('.c{display:flex;flex-wrap:wrap;gap:6px;height:150px;width:180px;align-content:space-between}.c>*{width:70px;height:30px}', box('', 4)),
    keywords: ['zeilen verteilen', 'mehrzeilig'],
    related: ['align-items', 'justify-content', 'flex-wrap', 'place-content'], mdn: M + 'align-content'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'align-self',
    desc: 'Überschreibt align-items für ein einzelnes Item.',
    details: 'Wird auf das Item gesetzt und richtet nur dieses auf der Querachse aus. Es akzeptiert dieselben Werte wie `align-items` plus `auto` (übernimmt den Wert des Containers). Praktisch, um ein Item (z. B. einen Button) einmalig nach unten zu setzen.',
    syntax: 'align-self: auto | stretch | flex-start | center | flex-end | baseline;',
    values: [['auto', 'Wert von align-items übernehmen (Standard)'], ['flex-start / start', 'Am Anfang'], ['center', 'Mittig'], ['flex-end / end', 'Am Ende'], ['stretch', 'Streckt auf volle Höhe']],
    initial: 'auto', inherited: false,
    example: '.card__footer {\n  align-self: flex-end;\n}',
    demo: d('.c{display:flex;gap:6px;height:100px;align-items:flex-start}.c>:nth-child(2){align-self:center}.c>:nth-child(3){align-self:flex-end}', box('', 3)),
    keywords: ['einzelnes item', 'ausnahme'],
    related: ['align-items', 'justify-self', 'place-self'], mdn: M + 'align-self'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'justify-items',
    desc: 'Richtet alle Grid-Items in ihrer Zelle auf der Zeilenachse aus.',
    details: 'Gehört auf den Grid-Container und bestimmt die horizontale Ausrichtung der Items innerhalb ihrer Zellen. In Flexbox wird `justify-items` ignoriert, dort ist `justify-content` zuständig. Mit einem anderen Wert als `stretch` schrumpfen die Items auf ihre Inhaltsbreite.',
    syntax: 'justify-items: start | end | center | stretch | baseline;',
    values: [['stretch', 'Füllt die Zelle (Standard bei Grid)'], ['start', 'Am Zellenanfang'], ['center', 'Zentriert in der Zelle'], ['end', 'Am Zellenende']],
    initial: 'legacy', inherited: false,
    example: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  justify-items: center;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;justify-items:center}', box('', 3)),
    tip: 'Funktioniert nur in Grid, nicht in Flexbox.',
    keywords: ['grid ausrichten', 'horizontal', 'zelle'],
    related: ['justify-self', 'align-items', 'place-items', 'justify-content'], mdn: M + 'justify-items'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'justify-self',
    desc: 'Richtet ein einzelnes Grid-Item in seiner Zelle auf der Zeilenachse aus.',
    details: 'Wird auf das Item gesetzt und überschreibt `justify-items` des Containers. Es wirkt in Grid-Layouts und bei absolut positionierten Elementen, nicht aber bei Flex-Items; dort nutzt man automatische Ränder (`margin-left: auto`).',
    syntax: 'justify-self: auto | start | end | center | stretch;',
    values: [['auto', 'Wert von justify-items übernehmen (Standard)'], ['start', 'Am Zellenanfang'], ['center', 'Zentriert'], ['end', 'Am Zellenende'], ['stretch', 'Füllt die Zelle']],
    initial: 'auto', inherited: false,
    example: '.badge {\n  justify-self: end;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.c>:nth-child(1){justify-self:start}.c>:nth-child(2){justify-self:center}.c>:nth-child(3){justify-self:end}', box('', 3)),
    keywords: ['einzelnes grid item', 'horizontal'],
    related: ['justify-items', 'align-self', 'place-self'], mdn: M + 'justify-self'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'place-items',
    desc: 'Kurzschreibweise für align-items und justify-items.',
    details: 'Gehört auf den Container. Der erste Wert gilt für `align-items`, der zweite für `justify-items`; bei nur einem Wert gilt er für beide. `place-items: center` zentriert Grid-Items in ihren Zellen in beide Richtungen.',
    syntax: 'place-items: <align-items> <justify-items>;',
    values: [['center', 'Beide Achsen zentriert'], ['start end', 'Oben (block-start), rechts (inline-end)'], ['stretch', 'Standard']],
    initial: 'normal legacy', inherited: false,
    example: '.grid {\n  display: grid;\n  place-items: center;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;height:100px;place-items:center}', box('', 3)),
    keywords: ['shorthand', 'zentrieren', 'kurzform'],
    related: ['align-items', 'justify-items', 'place-content', 'place-self'], mdn: M + 'place-items'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'place-content',
    desc: 'Kurzschreibweise für align-content und justify-content.',
    details: 'Gehört auf den Container. Der erste Wert steht für `align-content`, der zweite für `justify-content`. Mit `place-content: center` sitzt der gesamte Inhalt in der Mitte des Containers, sofern dieser größer als der Inhalt ist.',
    syntax: 'place-content: <align-content> <justify-content>;',
    values: [['center', 'Inhalt mittig in beide Richtungen'], ['space-between center', 'Vertikal verteilt, horizontal zentriert']],
    initial: 'normal', inherited: false,
    example: '.hero {\n  display: grid;\n  min-height: 100vh;\n  place-content: center;\n}',
    demo: d('.c{display:grid;grid-template-columns:50px 50px;gap:6px;height:130px;place-content:center}', box('', 4)),
    keywords: ['shorthand', 'zentrieren', 'kurzform'],
    related: ['align-content', 'justify-content', 'place-items'], mdn: M + 'place-content'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'place-self',
    desc: 'Kurzschreibweise für align-self und justify-self.',
    details: 'Wird auf das Item gesetzt. Der erste Wert gilt für `align-self`, der zweite für `justify-self`. Nützlich, um ein einzelnes Grid-Item in seiner Zelle zu zentrieren.',
    syntax: 'place-self: <align-self> <justify-self>;',
    values: [['center', 'In Zelle zentriert'], ['end start', 'Unten links']],
    initial: 'auto', inherited: false,
    example: '.icon {\n  place-self: center;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;height:90px}.c>:nth-child(2){place-self:center}.c>:nth-child(3){place-self:end}', box('', 3)),
    keywords: ['shorthand', 'einzelnes item'],
    related: ['align-self', 'justify-self', 'place-items'], mdn: M + 'place-self'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'gap',
    desc: 'Abstand zwischen Zeilen und Spalten in Flex-, Grid- und Mehrspalten-Layouts.',
    details: 'Wird auf den Container gesetzt und erzeugt Zwischenräume nur zwischen den Items, nicht am Außenrand. Ein Wert gilt für beide Richtungen, zwei Werte sind Zeilenabstand und Spaltenabstand. Das ersetzt Außenabstände (`margin`) an Items und vermeidet Sonderfälle für erstes/letztes Element.',
    syntax: 'gap: <zeilenabstand> [<spaltenabstand>];',
    values: [['16px', 'Gleicher Abstand in beide Richtungen'], ['10px 30px', 'Zeilenabstand 10px, Spaltenabstand 30px'], ['1rem', 'Relativ zur Schriftgröße']],
    initial: 'normal', inherited: false,
    example: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px 24px;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 30px}', box('', 6)),
    keywords: ['abstand', 'lücke', 'gutter', 'zwischenraum', 'grid-gap'],
    related: ['row-gap', 'column-gap', 'display'], mdn: M + 'gap'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'row-gap',
    desc: 'Abstand zwischen den Zeilen.',
    details: 'Wird auf den Container gesetzt und legt nur den vertikalen Abstand zwischen Zeilen fest. In einer einzeiligen Flexbox gibt es keinen Effekt, da keine Zeilen aufeinanderfolgen. Meist reicht die Kurzform `gap`.',
    syntax: 'row-gap: <länge>;',
    values: [['normal', 'Standard (0, bei Spalten 1em)'], ['20px', 'Feste Länge'], ['2%', 'Prozent der Containerhöhe']],
    initial: 'normal', inherited: false,
    example: '.list {\n  display: grid;\n  row-gap: 20px;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);column-gap:4px;row-gap:24px}', box('', 6)),
    keywords: ['zeilenabstand', 'vertikaler abstand'],
    related: ['gap', 'column-gap'], mdn: M + 'row-gap'
  },
  {
    lang: 'css', group: 'Ausrichtung (Flex & Grid)', name: 'column-gap',
    desc: 'Abstand zwischen den Spalten.',
    details: 'Wird auf den Container gesetzt und legt den horizontalen Abstand zwischen Spalten fest. Funktioniert in Flexbox, Grid und Mehrspalten-Layouts (dort ist der Standardwert `1em`). Meist nutzt man die Kurzform `gap`.',
    syntax: 'column-gap: <länge>;',
    values: [['normal', 'Standard (0 bei Flex/Grid, 1em bei Mehrspalten)'], ['30px', 'Feste Länge'], ['5%', 'Prozent der Containerbreite']],
    initial: 'normal', inherited: false,
    example: '.row {\n  display: flex;\n  column-gap: 30px;\n}',
    demo: d('.c{display:flex;column-gap:30px}', box('', 3)),
    keywords: ['spaltenabstand', 'horizontaler abstand'],
    related: ['gap', 'row-gap', 'column-count'], mdn: M + 'column-gap'
  },

  // ---------------- Grid ----------------
  {
    lang: 'css', group: 'Grid', name: 'grid-template-columns',
    desc: 'Definiert Anzahl und Breite der Grid-Spalten.',
    details: 'Gehört auf den Grid-Container (`display: grid`). Jede angegebene Größe erzeugt eine Spalte; erlaubt sind Längen, Prozent, `fr`, `auto`, `minmax()` und `repeat()`. Items, die nicht in die definierten Spalten passen, erzeugen implizite Spalten mit `grid-auto-columns`.',
    syntax: 'grid-template-columns: <spurgröße>+;',
    values: [['none', 'Keine explizite Spalte (Standard)'], ['200px 1fr 1fr', 'Eine feste, zwei flexible Spalten'], ['repeat(3, 1fr)', 'Drei gleich breite Spalten'], ['[start] 1fr [end]', 'Mit benannten Linien']],
    initial: 'none', inherited: false,
    example: '.layout {\n  display: grid;\n  grid-template-columns: 200px 1fr 2fr;\n  gap: 10px;\n}',
    demo: d('.c{display:grid;grid-template-columns:80px 1fr 2fr;gap:6px}', box('', 3)),
    keywords: ['spalten', 'raster', 'columns', 'spurbreite'],
    related: ['grid-template-rows', 'repeat()', 'fr', 'minmax()', 'display'], mdn: M + 'grid-template-columns'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-template-rows',
    desc: 'Definiert Anzahl und Höhe der Grid-Zeilen.',
    details: 'Wird auf den Grid-Container gesetzt und legt die expliziten Zeilen fest. Prozentwerte und `fr` brauchen eine definierte Containerhöhe, sonst verhalten sich die Zeilen wie `auto`. Weitere Items erzeugen implizite Zeilen mit `grid-auto-rows`.',
    syntax: 'grid-template-rows: <spurgröße>+;',
    values: [['none', 'Keine explizite Zeile (Standard)'], ['60px 1fr 40px', 'Kopf, flexibler Inhalt, Fuß'], ['repeat(2, 100px)', 'Zwei Zeilen à 100px']],
    initial: 'none', inherited: false,
    example: '.page {\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n}',
    demo: d('.c{display:grid;grid-template-rows:30px 1fr 50px;gap:6px;height:180px}', box('', 3)),
    keywords: ['zeilen', 'rows', 'zeilenhöhe'],
    related: ['grid-template-columns', 'grid-auto-rows', 'repeat()', 'fr'], mdn: M + 'grid-template-rows'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-template-areas',
    desc: 'Beschreibt das Layout durch benannte Bereiche als ASCII-Raster.',
    details: 'Gehört auf den Grid-Container. Jeder String ist eine Zeile, jedes Wort eine Zelle; gleiche Namen bilden einen rechteckigen Bereich, ein Punkt `.` eine leere Zelle. Items werden über `grid-area: name` zugewiesen. Bereiche müssen Rechtecke sein und alle Zeilen gleich viele Zellen haben.',
    syntax: "grid-template-areas: 'name name' 'name name';",
    values: [['none', 'Keine Bereiche (Standard)'], ["'header header' 'nav main'", 'Zwei Zeilen mit Bereichsnamen'], ['.', 'Leere Zelle']],
    initial: 'none', inherited: false,
    example: ".page {\n  display: grid;\n  grid-template-columns: 160px 1fr;\n  grid-template-areas:\n    'header header'\n    'nav    main'\n    'footer footer';\n}\n.page > header { grid-area: header; }",
    demo: d(".c{display:grid;grid-template-columns:70px 1fr;grid-template-areas:'h h' 'n m' 'f f';gap:6px}.h{grid-area:h}.n{grid-area:n}.m{grid-area:m;height:50px}.f{grid-area:f}", '<div class="c"><div class="h">header</div><div class="n">nav</div><div class="m">main</div><div class="f">footer</div></div>'),
    keywords: ['bereiche', 'areas', 'layout', 'benannt'],
    related: ['grid-area', 'grid-template', 'grid-template-columns'], mdn: M + 'grid-template-areas'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-template',
    desc: 'Kurzschreibweise für grid-template-rows, -columns und -areas.',
    details: 'Wird auf den Grid-Container gesetzt und vereint die drei Template-Eigenschaften. Zeilenhöhen stehen hinter den Area-Strings, Spaltenbreiten folgen nach einem Schrägstrich. Es setzt die impliziten Auto-Eigenschaften nicht zurück, im Gegensatz zu `grid`.',
    syntax: "grid-template: <rows> / <columns>;  |  grid-template: 'a a' 40px 'b c' 1fr / 100px 1fr;",
    values: [['100px 1fr / auto auto', 'Zeilen / Spalten'], ["'h h' auto 'n m' 1fr / 80px 1fr", 'Areas mit Zeilenhöhe und Spalten']],
    initial: 'none', inherited: false,
    example: ".layout {\n  display: grid;\n  grid-template:\n    'header header' 60px\n    'nav    main'   1fr\n    / 150px 1fr;\n}",
    demo: d(".c{display:grid;grid-template:'h h' 30px 'n m' 60px / 70px 1fr;gap:6px}.h{grid-area:h}.n{grid-area:n}.m{grid-area:m}", '<div class="c"><div class="h">header</div><div class="n">nav</div><div class="m">main</div></div>'),
    keywords: ['shorthand', 'kurzform'],
    related: ['grid-template-areas', 'grid-template-columns', 'grid-template-rows', 'grid'], mdn: M + 'grid-template'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid',
    desc: 'Sammel-Kurzschreibweise für Template- und Auto-Eigenschaften des Grids.',
    details: 'Wird auf den Container gesetzt und setzt alle Grid-Eigenschaften auf einmal, auch die nicht genannten auf ihre Standardwerte zurück. Gebräuchlich sind `grid: <rows> / <columns>` und `grid: auto-flow dense / 100px`. Weil es viel überschreibt, ist es unübersichtlich; meist sind die Einzelangaben besser lesbar.',
    syntax: 'grid: <grid-template> | <rows> / auto-flow [dense] <auto-columns>',
    values: [['100px 1fr / 1fr 1fr', 'Wie grid-template'], ['auto-flow / repeat(3, 1fr)', 'Zeilen automatisch, drei Spalten'], ['auto-flow dense / 120px', 'Dichte Packung, Auto-Spalten 120px']],
    initial: 'none', inherited: false,
    example: '.grid {\n  display: grid;\n  grid: auto-flow 80px / repeat(3, 1fr);\n  gap: 8px;\n}',
    demo: d('.c{display:grid;grid:auto-flow 40px / repeat(3,1fr);gap:6px}', box('', 6)),
    tip: 'Setzt auch `grid-auto-*` zurück, daher nicht zusammen mit separaten Einzelwerten mischen.',
    keywords: ['shorthand', 'kurzform'],
    related: ['grid-template', 'grid-auto-flow', 'grid-auto-rows', 'grid-auto-columns'], mdn: M + 'grid'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-area',
    desc: 'Platziert ein Item in einem benannten Bereich oder über vier Linien.',
    details: 'Wird auf das Grid-Item gesetzt. Mit einem Namen verweist es auf einen Bereich aus `grid-template-areas`. Alternativ steht es als Kurzform für `grid-row-start / grid-column-start / grid-row-end / grid-column-end`, also in der Reihenfolge oben, links, unten, rechts.',
    syntax: 'grid-area: <name>;  |  grid-area: <row-start> / <col-start> / <row-end> / <col-end>;',
    values: [['header', 'Bereichsname'], ['1 / 2 / 3 / 4', 'Zeile 1 bis 3, Spalte 2 bis 4'], ['span 2 / span 2', 'Belegt 2 Zeilen und 2 Spalten']],
    initial: 'auto', inherited: false,
    example: '.header { grid-area: header; }\n.hero   { grid-area: 1 / 1 / 3 / 4; }',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:34px;gap:6px}.big{grid-area:1/2/3/4;background:#2a7de1}', '<div class="c"><div>1</div><div class="big">grid-area: 1 / 2 / 3 / 4</div><div>3</div><div>4</div></div>'),
    keywords: ['bereich', 'platzieren', 'area', 'positionieren'],
    related: ['grid-template-areas', 'grid-row', 'grid-column'], mdn: M + 'grid-area'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-column',
    desc: 'Kurzschreibweise für grid-column-start und -end.',
    details: 'Wird auf das Item gesetzt und bestimmt, über welche Spaltenlinien es sich erstreckt. Mit `span n` belegt es n Spalten, ohne selbst eine Endlinie zu nennen. Linien werden ab 1 gezählt, negative Werte zählen vom Ende (`-1` ist die letzte Linie).',
    syntax: 'grid-column: <start> / <end>;',
    values: [['1 / 3', 'Von Linie 1 bis Linie 3 (zwei Spalten)'], ['span 2', 'Zwei Spalten breit'], ['1 / -1', 'Über alle expliziten Spalten']],
    initial: 'auto', inherited: false,
    example: '.wide { grid-column: 1 / -1; }\n.double { grid-column: span 2; }',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.w{grid-column:1/-1;background:#2a7de1}.d{grid-column:span 2;background:#2a7de1}', '<div class="c"><div class="w">1 / -1</div><div>2</div><div class="d">span 2</div><div>4</div></div>'),
    keywords: ['spalten überspannen', 'span', 'colspan'],
    related: ['grid-row', 'grid-column-start / grid-column-end', 'grid-area'], mdn: M + 'grid-column'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-row',
    desc: 'Kurzschreibweise für grid-row-start und -end.',
    details: 'Wird auf das Item gesetzt und bestimmt, über welche Zeilenlinien es sich erstreckt. `span n` lässt es n Zeilen belegen. Zeilen werden ab Linie 1 gezählt; negative Werte zählen vom Ende des expliziten Grids.',
    syntax: 'grid-row: <start> / <end>;',
    values: [['1 / 3', 'Von Linie 1 bis 3 (zwei Zeilen)'], ['span 2', 'Zwei Zeilen hoch'], ['2', 'Startet in Zeile 2']],
    initial: 'auto', inherited: false,
    example: '.tall { grid-row: span 2; }',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:34px;gap:6px}.t{grid-row:span 2;background:#2a7de1}', '<div class="c"><div class="t">span 2</div><div>2</div><div>3</div><div>4</div><div>5</div></div>'),
    keywords: ['zeilen überspannen', 'span', 'rowspan'],
    related: ['grid-column', 'grid-row-start / grid-row-end', 'grid-area'], mdn: M + 'grid-row'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-column-start / grid-column-end',
    desc: 'Start- und Endlinie eines Items in der Spaltenrichtung.',
    details: 'Beide Eigenschaften gehören auf das Grid-Item. Werte sind Linienummern, Linien-Namen oder `span n`; das Ende ist exklusiv, `grid-column-start: 2` und `grid-column-end: 4` ergeben also Spalte 2 und 3. Meist schreibt man die Kurzform `grid-column`.',
    syntax: 'grid-column-start: <linie>;\ngrid-column-end: <linie> | span <n>;',
    values: [['auto', 'Automatische Platzierung (Standard)'], ['2', 'Linie 2'], ['span 2', 'Zwei Spalten belegen'], ['-1', 'Letzte Linie']],
    initial: 'auto', inherited: false,
    example: '.item {\n  grid-column-start: 2;\n  grid-column-end: 4;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.x{grid-column-start:2;grid-column-end:4;background:#2a7de1}', '<div class="c"><div>1</div><div class="x">start 2, end 4</div><div>3</div></div>'),
    keywords: ['spaltenlinie', 'start', 'end'],
    related: ['grid-column', 'grid-row-start / grid-row-end', 'grid-area'], mdn: M + 'grid-column-start'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-row-start / grid-row-end',
    desc: 'Start- und Endlinie eines Items in der Zeilenrichtung.',
    details: 'Beide Eigenschaften gehören auf das Grid-Item und nehmen Linienummern, Namen oder `span n`. Die Endlinie ist exklusiv: Start 1 und Ende 3 umfasst die Zeilen 1 und 2. Üblich ist die Kurzform `grid-row`.',
    syntax: 'grid-row-start: <linie>;\ngrid-row-end: <linie> | span <n>;',
    values: [['auto', 'Automatisch (Standard)'], ['1', 'Linie 1'], ['span 3', 'Drei Zeilen belegen'], ['-1', 'Letzte Linie']],
    initial: 'auto', inherited: false,
    example: '.item {\n  grid-row-start: 1;\n  grid-row-end: span 2;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:34px;gap:6px}.x{grid-row-start:1;grid-row-end:span 3;background:#2a7de1}', '<div class="c"><div class="x">span 3</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div></div>'),
    keywords: ['zeilenlinie', 'start', 'end'],
    related: ['grid-row', 'grid-column-start / grid-column-end', 'grid-area'], mdn: M + 'grid-row-start'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-auto-flow',
    desc: 'Steuert, wie automatisch platzierte Items ins Grid einsortiert werden.',
    details: 'Gehört auf den Grid-Container. Standard ist zeilenweises Auffüllen; `column` füllt spaltenweise. Mit `dense` füllt der Algorithmus Lücken mit später folgenden Items auf, was aber die Quellreihenfolge optisch durcheinanderbringt.',
    syntax: 'grid-auto-flow: row | column | dense | row dense | column dense;',
    values: [['row', 'Zeilenweise füllen (Standard)'], ['column', 'Spaltenweise füllen'], ['dense', 'Lücken nachträglich füllen']],
    initial: 'row', inherited: false,
    example: '.gallery {\n  display: grid;\n  grid-auto-flow: dense;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-flow:row dense;gap:6px}.w{grid-column:span 2;background:#2a7de1}', '<div class="c"><div>1</div><div class="w">2 (span 2)</div><div class="w">3 (span 2)</div><div>4</div></div>'),
    keywords: ['automatische platzierung', 'dense', 'auffüllen'],
    related: ['grid-auto-rows', 'grid-auto-columns', 'grid'], mdn: M + 'grid-auto-flow'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-auto-columns',
    desc: 'Größe implizit erzeugter Spalten.',
    details: 'Gehört auf den Grid-Container. Implizite Spalten entstehen, wenn Items außerhalb der definierten Spalten liegen oder bei `grid-auto-flow: column`. Ohne Angabe sind sie `auto` groß. Mehrere Werte wiederholen sich im Muster.',
    syntax: 'grid-auto-columns: <spurgröße>+;',
    values: [['auto', 'Größe nach Inhalt (Standard)'], ['120px', 'Feste Breite'], ['minmax(100px, 1fr)', 'Flexibel mit Minimum']],
    initial: 'auto', inherited: false,
    example: '.slider {\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: 150px;\n}',
    demo: d('.c{display:grid;grid-auto-flow:column;grid-auto-columns:70px;gap:6px;overflow:hidden}', box('', 4)),
    keywords: ['implizit', 'auto spalten'],
    related: ['grid-auto-rows', 'grid-auto-flow', 'grid-template-columns'], mdn: M + 'grid-auto-columns'
  },
  {
    lang: 'css', group: 'Grid', name: 'grid-auto-rows',
    desc: 'Höhe implizit erzeugter Zeilen.',
    details: 'Gehört auf den Grid-Container und bestimmt die Höhe aller Zeilen, die nicht in `grid-template-rows` stehen. Mit `minmax(100px, auto)` wachsen Zeilen mit ihrem Inhalt, haben aber eine Mindesthöhe. Ein häufiger Anwendungsfall ist ein Karten-Grid mit einheitlicher Zeilenhöhe.',
    syntax: 'grid-auto-rows: <spurgröße>+;',
    values: [['auto', 'Höhe nach Inhalt (Standard)'], ['80px', 'Feste Höhe'], ['minmax(80px, auto)', 'Mindestens 80px, wächst bei Bedarf']],
    initial: 'auto', inherited: false,
    example: '.cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-auto-rows: minmax(80px, auto);\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:minmax(50px,auto);gap:6px}', box('', 6)),
    keywords: ['implizit', 'auto zeilen', 'zeilenhöhe'],
    related: ['grid-auto-columns', 'grid-auto-flow', 'grid-template-rows', 'minmax()'], mdn: M + 'grid-auto-rows'
  },
  {
    lang: 'css', group: 'Grid', name: 'repeat()',
    desc: 'Wiederholt Spurgrößen in grid-template-columns/-rows.',
    details: 'Die Funktion spart Schreibarbeit: `repeat(3, 1fr)` ist dasselbe wie `1fr 1fr 1fr`. Als Anzahl sind eine Ganzzahl oder `auto-fill` bzw. `auto-fit` möglich; mehrere Spurgrößen werden als Muster wiederholt. Verschachtelte `repeat()`-Aufrufe sind nicht erlaubt.',
    syntax: 'repeat(<anzahl> | auto-fill | auto-fit, <spurgröße>+)',
    values: [['repeat(4, 1fr)', 'Vier gleich breite Spalten'], ['repeat(2, 50px 1fr)', 'Muster 50px 1fr 50px 1fr'], ['repeat(auto-fill, 100px)', 'So viele 100px-Spalten wie passen']],
    example: '.grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}', box('', 8)),
    keywords: ['wiederholen', 'repeat', 'spuren'],
    related: ['grid-template-columns', 'auto-fill / auto-fit', 'minmax()', 'fr'], mdn: M + 'repeat'
  },
  {
    lang: 'css', group: 'Grid', name: 'minmax()',
    desc: 'Definiert einen Größenbereich mit Minimum und Maximum für eine Spur.',
    details: 'Nutzbar in `grid-template-columns`, `-rows` und den Auto-Varianten. Die Spur ist mindestens so groß wie der erste Wert und höchstens so groß wie der zweite; mit `fr` als Maximum teilt sie sich den Restplatz. Typisch ist `minmax(0, 1fr)`, damit lange Inhalte die Spalte nicht aufweiten.',
    syntax: 'minmax(<min>, <max>)',
    values: [['minmax(100px, 1fr)', 'Mindestens 100px, sonst flexibel'], ['minmax(0, 1fr)', 'Darf unter die Inhaltsgröße schrumpfen'], ['minmax(80px, auto)', 'Mindesthöhe 80px, wächst mit Inhalt']],
    example: '.grid {\n  display: grid;\n  grid-template-columns: minmax(120px, 1fr) 2fr;\n}',
    demo: d('.c{display:grid;grid-template-columns:minmax(100px,150px) 1fr;gap:6px}', box('', 2) + '<p>Erste Spalte: zwischen 100px und 150px.</p>'),
    keywords: ['minimum', 'maximum', 'bereich', 'spurgröße'],
    related: ['repeat()', 'grid-template-columns', 'grid-auto-rows', 'fr'], mdn: M + 'minmax'
  },
  {
    lang: 'css', group: 'Grid', name: 'auto-fill / auto-fit',
    desc: 'Automatische Spaltenanzahl in repeat(): so viele Spuren wie hineinpassen.',
    details: 'Beide Schlüsselwörter stehen in `repeat()` und erzeugen so viele Spuren, wie in den Container passen. `auto-fill` behält leere Spuren bei, `auto-fit` klappt leere Spuren auf Breite 0 zusammen, sodass vorhandene Items den Platz mit `1fr` ausfüllen. Mit `repeat(auto-fit, minmax(200px, 1fr))` entsteht ein responsives Raster ohne Media Queries.',
    syntax: 'repeat(auto-fill | auto-fit, minmax(<min>, 1fr))',
    values: [['auto-fill', 'Leere Spuren bleiben bestehen'], ['auto-fit', 'Leere Spuren werden zusammengeklappt, Items dehnen sich']],
    example: '.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n  gap: 12px;\n}',
    demo: d('.c{display:grid;gap:6px;margin-bottom:8px}.f{grid-template-columns:repeat(auto-fill,minmax(80px,1fr))}.t{grid-template-columns:repeat(auto-fit,minmax(80px,1fr))}', '<p>auto-fill (leere Spuren bleiben)</p>' + box('f', 2) + '<p>auto-fit (Items dehnen sich)</p>' + box('t', 2)),
    tip: 'Der Unterschied zeigt sich nur, wenn weniger Items als Spuren vorhanden sind.',
    keywords: ['responsive', 'automatisch', 'ohne media query', 'raster'],
    related: ['repeat()', 'minmax()', 'grid-template-columns', 'Rezept: Responsives Karten-Grid'], mdn: M + 'repeat#auto-fill_und_auto-fit'
  },
  {
    lang: 'css', group: 'Grid', name: 'subgrid',
    desc: 'Verschachteltes Grid übernimmt die Spuren des übergeordneten Grids.',
    details: 'Wird als Wert von `grid-template-columns` und/oder `grid-template-rows` auf ein Grid-Item gesetzt, das selbst `display: grid` ist. Dessen Kinder richten sich dann an den Linien des Eltern-Grids aus, sodass z. B. Titel und Text mehrerer Karten bündig stehen. Funktioniert in allen aktuellen Browsern; das Item muss über die gewünschten Spuren gespannt sein (`grid-row: span 3`).',
    syntax: 'grid-template-columns: subgrid;\ngrid-template-rows: subgrid;',
    values: [['subgrid', 'Übernimmt Spuren des Eltern-Grids in dieser Achse']],
    example: '.card {\n  display: grid;\n  grid-row: span 3;\n  grid-template-rows: subgrid;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;padding:6px}.card{display:grid;grid-row:span 2;grid-template-rows:subgrid;gap:4px;background:#d9c2e5;padding:6px;border-radius:4px}.card>*{background:#b4367a;margin:0}', '<div class="c"><div class="card"><div>Kurzer Titel</div><div>Text A<br>zweite Zeile</div></div><div class="card"><div>Titel</div><div>Text B</div></div></div>'),
    keywords: ['verschachtelt', 'nested grid', 'ausrichten', 'spuren erben'],
    related: ['grid-template-columns', 'grid-template-rows', 'grid-row'], mdn: M + 'CSS_grid_layout/Subgrid'
  },

  // ---------------- Mehrspaltiger Text ----------------
  {
    lang: 'css', group: 'Mehrspaltiger Text', name: 'columns',
    desc: 'Kurzschreibweise für column-width und column-count.',
    details: 'Wird auf einen Block-Container gesetzt, dessen Inhalt in Zeitungsspalten fließt. Ein Wert mit Einheit wird als `column-width`, eine reine Zahl als `column-count` gelesen. Der Browser wählt bei gegebener Breite so viele Spalten wie passen.',
    syntax: 'columns: <breite> || <anzahl>;',
    values: [['3', 'Drei Spalten'], ['200px', 'Mindestens 200px breite Spalten'], ['200px 3', 'Breite 200px, maximal 3 Spalten']],
    initial: 'auto auto', inherited: false,
    example: 'article {\n  columns: 250px 3;\n  column-gap: 24px;\n}',
    demo: d('.t{columns:3;column-gap:16px;background:#eef;padding:8px}', '<div class="t">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.</div>'),
    keywords: ['spalten', 'zeitung', 'multi-column', 'shorthand'],
    related: ['column-count', 'column-width', 'column-gap', 'column-rule'], mdn: M + 'columns'
  },
  {
    lang: 'css', group: 'Mehrspaltiger Text', name: 'column-count',
    desc: 'Anzahl der Spalten eines Mehrspalten-Containers.',
    details: 'Wird auf den Container gesetzt und legt (maximal) die Spaltenanzahl fest. Ist zusätzlich `column-width` gesetzt, ist `column-count` die Obergrenze. Der Inhalt fließt von Spalte zu Spalte, Elemente können dabei umbrochen werden (steuerbar mit `break-inside: avoid`).',
    syntax: 'column-count: auto | <ganzzahl>;',
    values: [['auto', 'Bestimmt durch column-width (Standard)'], ['2', 'Zwei Spalten'], ['4', 'Vier Spalten']],
    initial: 'auto', inherited: false,
    example: '.text {\n  column-count: 2;\n}',
    demo: d('.t{column-count:2;column-gap:16px;background:#eef;padding:8px}', '<div class="t">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>'),
    keywords: ['spaltenanzahl', 'anzahl spalten'],
    related: ['columns', 'column-width', 'column-gap'], mdn: M + 'column-count'
  },
  {
    lang: 'css', group: 'Mehrspaltiger Text', name: 'column-width',
    desc: 'Optimale Mindestbreite einer Spalte.',
    details: 'Wird auf den Container gesetzt; der Browser erzeugt so viele Spalten dieser Breite, wie hineinpassen, und vergrößert sie dann gleichmäßig. So wird der Text ohne Media Queries responsiv. Die tatsächliche Breite kann also größer als der Wert sein.',
    syntax: 'column-width: auto | <länge>;',
    values: [['auto', 'Bestimmt durch column-count (Standard)'], ['12em', 'Spalten mindestens 12em breit'], ['200px', 'Spalten mindestens 200px breit']],
    initial: 'auto', inherited: false,
    example: '.text {\n  column-width: 18em;\n}',
    demo: d('.t{column-width:120px;column-gap:16px;background:#eef;padding:8px}', '<div class="t">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>'),
    keywords: ['spaltenbreite', 'responsive'],
    related: ['columns', 'column-count', 'column-gap'], mdn: M + 'column-width'
  },
  {
    lang: 'css', group: 'Mehrspaltiger Text', name: 'column-rule',
    desc: 'Trennlinie zwischen Spalten (Kurzschreibweise).',
    details: 'Wird auf den Container gesetzt und zeichnet zwischen den Spalten eine Linie, wie `border`: Breite, Stil, Farbe. Die Linie nimmt keinen eigenen Platz weg, sondern liegt mittig im `column-gap`. Sie erscheint nur zwischen gefüllten Spalten.',
    syntax: 'column-rule: <breite> <stil> <farbe>;',
    values: [['1px solid #999', 'Dünne durchgezogene Linie'], ['2px dashed red', 'Gestrichelte rote Linie']],
    initial: 'medium none currentcolor', inherited: false,
    example: '.text {\n  columns: 2;\n  column-gap: 32px;\n  column-rule: 1px solid #ccc;\n}',
    demo: d('.t{columns:2;column-gap:32px;column-rule:2px dashed #b4367a;background:#eef;padding:8px}', '<div class="t">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>'),
    keywords: ['trennlinie', 'linie', 'rule', 'trenner'],
    related: ['columns', 'column-gap', 'column-count'], mdn: M + 'column-rule'
  },
  {
    lang: 'css', group: 'Mehrspaltiger Text', name: 'column-span',
    desc: 'Lässt ein Element über alle Spalten hinweg laufen.',
    details: 'Wird auf ein Kind-Element im Mehrspalten-Container gesetzt, typischerweise auf eine Überschrift. Mit `all` bricht das Element die Spalten, überspannt die volle Breite und danach beginnt das Spaltenlayout von Neuem. Es gibt nur `none` und `all`, ein Teilbereich ist nicht möglich.',
    syntax: 'column-span: none | all;',
    values: [['none', 'Bleibt in der Spalte (Standard)'], ['all', 'Überspannt alle Spalten']],
    initial: 'none', inherited: false,
    example: '.text h2 {\n  column-span: all;\n}',
    demo: d('.t{columns:2;column-gap:16px;background:#eef;padding:8px}.t h3{column-span:all;margin:0 0 6px;background:#b4367a;color:#fff;padding:4px}', '<div class="t"><h3>Überschrift über alle Spalten</h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</div>'),
    keywords: ['überspannen', 'überschrift', 'span all'],
    related: ['columns', 'column-count', 'column-fill'], mdn: M + 'column-span'
  },
  {
    lang: 'css', group: 'Mehrspaltiger Text', name: 'column-fill',
    desc: 'Legt fest, wie der Inhalt auf die Spalten verteilt wird.',
    details: 'Wird auf den Container gesetzt. Mit `balance` (Standard) werden alle Spalten gleich hoch gefüllt. Mit `auto` füllt der Browser Spalte für Spalte bis zur vorgegebenen Containerhöhe; das setzt eine feste `height` voraus. Bei Containern ohne Höhe gibt es keinen Unterschied.',
    syntax: 'column-fill: balance | auto;',
    values: [['balance', 'Spalten gleich hoch (Standard)'], ['auto', 'Nacheinander füllen bis zur Containerhöhe']],
    initial: 'balance', inherited: false,
    example: '.text {\n  columns: 3;\n  height: 200px;\n  column-fill: auto;\n}',
    demo: d('.t{columns:3;column-gap:12px;height:90px;column-fill:auto;background:#eef;padding:8px}', '<div class="t">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div><p>column-fill: auto, die erste Spalte wird komplett gefüllt.</p>'),
    keywords: ['balance', 'füllen', 'ausgleichen'],
    related: ['columns', 'column-span', 'column-count'], mdn: M + 'column-fill'
  },

  // ---------------- Layout-Rezepte ----------------
  {
    lang: 'css', group: 'Layout-Rezepte', name: 'Rezept: Element zentrieren',
    desc: 'Ein Element horizontal und vertikal im Elternelement zentrieren.',
    details: 'Der kürzeste Weg ist Grid mit `place-items: center` auf dem Elternelement. Alternativ funktioniert Flexbox mit `justify-content` und `align-items: center`. Für die vertikale Zentrierung muss der Container eine Höhe haben, z. B. `min-height: 100vh`. Rein horizontal reicht für Blockelemente `margin-inline: auto` zusammen mit einer `width`.',
    values: [['display: grid + place-items: center', 'Kürzeste Variante'], ['display: flex + justify-content + align-items', 'Flexbox-Variante'], ['margin-inline: auto', 'Nur horizontal, Block mit Breite']],
    example: '/* Grid */\n.parent {\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n}\n\n/* Flexbox */\n.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
    demo: d('.c{display:grid;place-items:center;height:140px}.c>div{padding:16px 28px}', '<div class="c"><div>zentriert</div></div>'),
    keywords: ['center', 'mittig', 'vertikal zentrieren', 'horizontal zentrieren', 'mitte'],
    related: ['place-items', 'justify-content', 'align-items', 'display'], mdn: 'https://developer.mozilla.org/de/docs/Web/CSS/CSS_box_alignment'
  },
  {
    lang: 'css', group: 'Layout-Rezepte', name: 'Rezept: Holy-Grail-Layout',
    desc: 'Klassisches Seitenlayout: Kopf, Fuß, Inhalt und zwei Seitenleisten.',
    details: 'Mit Grid und `grid-template-areas` entsteht das Layout in wenigen Zeilen: Kopf und Fuß über die volle Breite, in der Mitte Navigation, Inhalt und Zusatzspalte. Die mittlere Zeile erhält `1fr` und nimmt den restlichen Platz ein. Für Mobilgeräte stellt man mit einer Media Query auf eine einzelne Spalte um.',
    example: ".page {\n  display: grid;\n  min-height: 100vh;\n  grid-template-columns: 180px 1fr 180px;\n  grid-template-rows: auto 1fr auto;\n  grid-template-areas:\n    'header header header'\n    'nav    main   aside'\n    'footer footer footer';\n}\nheader { grid-area: header; }\nnav    { grid-area: nav; }\nmain   { grid-area: main; }\naside  { grid-area: aside; }\nfooter { grid-area: footer; }",
    demo: d(".p{display:grid;grid-template-columns:50px 1fr 50px;grid-template-rows:auto 1fr auto;grid-template-areas:'h h h' 'n m a' 'f f f';gap:6px;height:200px}.p>div{display:flex;align-items:center;justify-content:center}.h{grid-area:h}.n{grid-area:n}.m{grid-area:m;background:#2a7de1!important}.a{grid-area:a}.f{grid-area:f}", '<div class="c p"><div class="h">Header</div><div class="n">Nav</div><div class="m">Main</div><div class="a">Aside</div><div class="f">Footer</div></div>'),
    keywords: ['seitenlayout', 'page layout', 'header footer sidebar', 'drei spalten'],
    related: ['grid-template-areas', 'grid-area', 'grid-template-columns', 'fr'], mdn: M + 'grid-template-areas'
  },
  {
    lang: 'css', group: 'Layout-Rezepte', name: 'Rezept: Responsives Karten-Grid',
    desc: 'Karten, die sich automatisch auf die verfügbare Breite verteilen.',
    details: 'Mit `repeat(auto-fit, minmax(220px, 1fr))` ordnet Grid so viele Spalten an, wie mit mindestens 220px passen, und verteilt den Rest gleichmäßig. Es ist keine Media Query nötig. Bei sehr schmalen Containern kann `min(220px, 100%)` im `minmax()` Überlauf verhindern.',
    example: '.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));\n  gap: 16px;\n}',
    demo: d('.c{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px}.c>*{padding:22px 8px;text-align:center}', box('', 6)),
    tip: 'Die Größe des Browserfensters ändern, um das Umbrechen zu sehen.',
    keywords: ['cards', 'responsive', 'galerie', 'kacheln', 'raster'],
    related: ['auto-fill / auto-fit', 'repeat()', 'minmax()', 'gap'], mdn: M + 'repeat'
  },
  {
    lang: 'css', group: 'Layout-Rezepte', name: 'Rezept: Sticky Footer',
    desc: 'Fußzeile bleibt unten, auch wenn der Inhalt kurz ist.',
    details: 'Der Body wird zum Flex-Container in Spaltenrichtung mit mindestens Bildschirmhöhe; der Hauptbereich erhält `flex: 1` und schiebt den Footer nach unten. Bei langem Inhalt wandert der Footer einfach mit. Alternativ funktioniert Grid mit `grid-template-rows: auto 1fr auto`. Mit `100dvh` statt `100vh` vermeidet man Sprünge durch mobile Adressleisten.',
    example: 'body {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n  margin: 0;\n}\nmain {\n  flex: 1;\n}',
    demo: d('.pg{display:flex;flex-direction:column;height:180px}.pg>main{flex:1;background:#2a7de1}.pg>*{padding:8px 12px;color:#fff;background:#b4367a}', '<div class="c pg" style="padding:0"><header>Header</header><main>Main (flex: 1)</main><footer>Footer unten</footer></div>'),
    keywords: ['footer unten', 'fußzeile', 'footer', 'seitenende'],
    related: ['flex', 'flex-direction', 'grid-template-rows'], mdn: M + 'flex'
  },
  {
    lang: 'css', group: 'Layout-Rezepte', name: 'Rezept: Navigation mit Flexbox',
    desc: 'Logo links, Links rechts: eine flexible Kopf-Navigation.',
    details: 'Der Container ist ein Flex-Container mit `align-items: center`. Ein automatischer rechter Rand (`margin-right: auto`) am Logo schiebt alle folgenden Elemente an den rechten Rand. Die Links stehen in einer eigenen Flex-Liste mit `gap`. Mit `flex-wrap: wrap` bricht die Navigation auf kleinen Bildschirmen um.',
    example: '.nav {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.nav .logo { margin-right: auto; }\n.nav ul {\n  display: flex;\n  gap: 12px;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}',
    demo: d('.n{display:flex;align-items:center;gap:12px}.n .logo{margin-right:auto;background:#2a7de1}', '<nav class="c n"><div class="logo">Logo</div><div>Home</div><div>Blog</div><div>Kontakt</div></nav>'),
    keywords: ['navbar', 'menü', 'header', 'navigation', 'menu'],
    related: ['justify-content', 'align-items', 'gap', 'flex-wrap'], mdn: M + 'justify-content'
  },
  {
    lang: 'css', group: 'Layout-Rezepte', name: 'Rezept: Seitenleiste + Inhalt',
    desc: 'Feste Seitenleiste neben flexiblem Hauptinhalt.',
    details: 'Mit Grid reicht `grid-template-columns: 240px 1fr`: Die Leiste ist fest, der Inhalt nimmt den Rest. Für Inhalte mit langen Wörtern oder Tabellen besser `minmax(0, 1fr)` verwenden, damit die Spalte nicht überläuft. Auf schmalen Bildschirmen wechselt man per Media Query auf eine Spalte.',
    example: '.layout {\n  display: grid;\n  grid-template-columns: 240px minmax(0, 1fr);\n  gap: 24px;\n}\n@media (max-width: 700px) {\n  .layout { grid-template-columns: 1fr; }\n}',
    demo: d('.c{display:grid;grid-template-columns:80px minmax(0,1fr);gap:8px;height:110px}.c>:nth-child(2){background:#2a7de1}', '<div class="c"><div>Sidebar</div><div>Inhalt (1fr)</div></div>'),
    keywords: ['sidebar', 'zwei spalten', 'seitenleiste', 'inhalt'],
    related: ['grid-template-columns', 'fr', 'minmax()', 'gap'], mdn: M + 'grid-template-columns'
  }
  );
})();
