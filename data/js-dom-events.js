window.CHEAT = window.CHEAT || [];
(function () {
  var M = 'https://developer.mozilla.org/de/docs/Web/';
  var S = '<style>*{box-sizing:border-box}body{font:14px sans-serif}button{padding:4px 10px;margin:2px}input,select,textarea{padding:4px;margin:2px}ul{margin:4px 0;padding-left:20px}.box{border:1px dashed #99b;background:#eef;padding:6px;margin:4px 0}.hit{background:#ffd54a;outline:2px solid #b4367a}.on{background:#b4367a;color:#fff}</style>';
  function d(html) { return S + html; }
  function c() { return Array.prototype.join.call(arguments, '\n'); }
  function E(g, o) { o.lang = 'js'; o.group = g; o.run = true; return o; }
  var A = 'DOM auswählen', V = 'DOM verändern', EV = 'Events';

  window.CHEAT.push(
  // ---------------- DOM auswählen ----------------
  E(A, {
    name: 'document.querySelector()',
    desc: 'Liefert das erste Element, das zu einem CSS-Selektor passt.',
    details: 'Nimmt einen beliebigen CSS-Selektor entgegen und gibt das erste passende Element in Dokumentreihenfolge zurück, sonst `null`. Man kann die Methode auch auf einem Element aufrufen, um nur in dessen Nachfahren zu suchen. Fallstricke: Bei `null` führt ein Zugriff auf Eigenschaften zu einem `TypeError`, und ein ungültiger Selektor wirft einen `SyntaxError`.',
    syntax: 'const el = document.querySelector(selektor);\nconst el = element.querySelector(selektor);',
    values: [['"#id"', 'Element mit dieser ID'], ['".klasse"', 'Erstes Element mit dieser Klasse'], ['"ul > li:first-child"', 'Beliebige CSS-Kombinatoren und Pseudoklassen'], ['null', 'Rückgabewert, wenn nichts passt']],
    example: c('const titel = document.querySelector("#titel");', 'titel.classList.add("hit");', 'console.log(titel.textContent);', '', 'const fehlt = document.querySelector(".gibt-es-nicht");', 'console.log(fehlt); // null', '', '// Suche nur innerhalb eines Elements', 'const erster = document.querySelector("ul .item");', 'console.log(erster.textContent);'),
    demo: d('<h3 id="titel">Überschrift</h3><ul><li class="item">Eins</li><li class="item">Zwei</li></ul>'),
    tip: 'Immer auf `null` prüfen, wenn das Element optional ist: `el?.classList.add("x")`.',
    keywords: ['selektor', 'element finden', 'select', 'css selector', 'auswählen'],
    related: ['querySelectorAll()', 'getElementById()', 'closest()'], mdn: M + 'API/Document/querySelector'
  }),
  E(A, {
    name: 'querySelectorAll()',
    desc: 'Liefert alle Elemente, die zu einem CSS-Selektor passen, als statische NodeList.',
    details: 'Gibt eine `NodeList` mit allen Treffern zurück, bei keinem Treffer eine leere Liste (nie `null`). Die Liste ist statisch und aktualisiert sich nicht, wenn das DOM später geändert wird. Sie hat `forEach()`, aber kein `map()` oder `filter()`: dafür mit `Array.from()` oder `[...liste]` umwandeln.',
    syntax: 'const liste = document.querySelectorAll(selektor);\nliste.forEach(el => ...);',
    values: [['NodeList', 'Statisch, iterierbar, hat forEach()'], ['Array.from(liste)', 'Echtes Array für map(), filter() usw.'], ['liste.length', 'Anzahl der Treffer (0 = keine)']],
    example: c('const items = document.querySelectorAll(".item");', 'console.log("Anzahl:", items.length);', '', 'items.forEach((li, i) => {', '  li.textContent = (i + 1) + ". " + li.textContent;', '});', '', 'const texte = Array.from(items).map(li => li.textContent);', 'console.log(texte);'),
    demo: d('<ul><li class="item">Apfel</li><li class="item">Birne</li><li class="item">Kirsche</li></ul>'),
    tip: 'Die Liste ist ein Schnappschuss: später hinzugefügte Elemente tauchen darin nicht auf.',
    keywords: ['alle', 'nodelist', 'liste', 'select all', 'mehrere elemente'],
    related: ['document.querySelector()', 'getElementsByClassName()'], mdn: M + 'API/Document/querySelectorAll'
  }),
  E(A, {
    name: 'getElementById()',
    desc: 'Liefert das Element mit der angegebenen ID oder null.',
    details: 'Sehr schnell und eindeutig, da IDs im Dokument nur einmal vorkommen sollten. Der Parameter ist die reine ID ohne `#`. Die Methode gibt es nur auf `document` (und Dokumentfragmenten), nicht auf normalen Elementen.',
    syntax: 'const el = document.getElementById("id");',
    values: [['"id"', 'ID ohne Raute'], ['null', 'Kein Element mit dieser ID']],
    example: c('const out = document.getElementById("out");', 'out.textContent = "Hallo aus getElementById!";', 'console.log(out.id, out.tagName);', '', 'console.log(document.getElementById("nope")); // null'),
    demo: d('<p id="out">Noch leer</p>'),
    tip: 'Mit `#` im Parameter (`"#out"`) findet die Methode nichts, das gehört zu `querySelector`.',
    keywords: ['id', 'element by id', 'finden'],
    related: ['document.querySelector()', 'getElementsByClassName()'], mdn: M + 'API/Document/getElementById'
  }),
  E(A, {
    name: 'getElementsByClassName()',
    desc: 'Liefert eine live aktualisierte HTMLCollection aller Elemente mit einer Klasse.',
    details: 'Die zurückgegebene `HTMLCollection` ist live: Sie spiegelt spätere DOM-Änderungen wider. Das kann beim Iterieren überraschen, wenn man dabei Klassen entfernt oder Elemente löscht, weil sich die Liste währenddessen verkürzt. Die Collection hat kein `forEach()`; mit `Array.from()` oder `querySelectorAll()` ist man meist besser bedient.',
    syntax: 'const coll = document.getElementsByClassName("a b");',
    values: [['"a b"', 'Elemente, die beide Klassen besitzen'], ['HTMLCollection', 'Live-Liste, Zugriff per [i] oder item(i)']],
    example: c('const rot = document.getElementsByClassName("rot");', 'console.log("Vorher:", rot.length);', '', 'document.getElementById("neu").addEventListener("click", () => {', '  const p = document.createElement("p");', '  p.className = "rot";', '  p.textContent = "Neu";', '  document.body.append(p);', '  console.log("Live-Länge:", rot.length);', '});'),
    demo: d('<p class="rot">A</p><p class="rot">B</p><button id="neu">Absatz mit Klasse "rot" anhängen</button>'),
    tip: 'Beim Entfernen in einer for-Schleife rückwärts iterieren oder vorher in ein Array kopieren.',
    keywords: ['klasse', 'class', 'live collection', 'htmlcollection'],
    related: ['querySelectorAll()', 'getElementById()'], mdn: M + 'API/Document/getElementsByClassName'
  }),
  E(A, {
    name: 'closest()',
    desc: 'Sucht vom Element aus aufwärts den nächsten Vorfahren (oder sich selbst) passend zum Selektor.',
    details: 'Beginnt beim Element selbst und geht Elternknoten für Elternknoten nach oben, bis der Selektor passt; sonst `null`. Ideal in der Event-Delegation, um vom angeklickten Kindelement zur Zeile oder Karte zu gelangen. Die Suche geht nie in Kindelemente hinein.',
    syntax: 'const vorfahre = element.closest(selektor);',
    values: [['null', 'Kein passender Vorfahre']],
    example: c('document.addEventListener("click", (e) => {', '  const zeile = e.target.closest("tr");', '  if (!zeile) return;', '  document.querySelectorAll("tr").forEach(r => r.classList.remove("hit"));', '  zeile.classList.add("hit");', '  console.log("Zeile:", zeile.dataset.id);', '});'),
    demo: d('<table border="1" cellpadding="4"><tr data-id="1"><td><b>Anna</b></td><td>Berlin</td></tr><tr data-id="2"><td><b>Ben</b></td><td>Köln</td></tr></table><p>Klicke in eine Zeile.</p>'),
    tip: '`e.target` kann ein Textknoten-naher Kindknoten sein; `closest()` macht den Code robust dagegen.',
    keywords: ['vorfahre', 'ancestor', 'parent', 'nächster', 'delegation'],
    related: ['matches()', 'Event-Delegation', 'children / parentElement'], mdn: M + 'API/Element/closest'
  }),
  E(A, {
    name: 'matches()',
    desc: 'Prüft, ob ein Element zu einem CSS-Selektor passt, und gibt true oder false zurück.',
    details: 'Nützlich, um in Event-Handlern oder Schleifen Elemente zu filtern, ohne selbst Klassen oder Tags zu vergleichen. Es wird nur das Element selbst geprüft, nicht seine Vorfahren (dafür `closest()`). Ältere Namen wie `webkitMatchesSelector` sind überflüssig.',
    syntax: 'const ok = element.matches(selektor);',
    values: [['true', 'Element passt zum Selektor'], ['false', 'Element passt nicht']],
    example: c('const buttons = document.querySelectorAll("button");', 'buttons.forEach(b => {', '  console.log(b.textContent, "->", b.matches(".primary"), b.matches("[disabled]"));', '});'),
    demo: d('<button class="primary">Speichern</button><button>Abbrechen</button><button disabled>Gesperrt</button>'),
    keywords: ['selektor prüfen', 'test', 'passt', 'filter'],
    related: ['closest()', 'document.querySelector()'], mdn: M + 'API/Element/matches'
  }),
  E(A, {
    name: 'children / parentElement',
    desc: 'Navigiert im DOM-Baum zu Kind- und Elternelementen.',
    details: '`children` ist eine live `HTMLCollection` nur der Kind-Elemente (ohne Text- und Kommentarknoten), `firstElementChild` und `lastElementChild` greifen auf das erste und letzte zu. `parentElement` liefert das Elternelement (oder `null`), `parentNode` kann zusätzlich auch `document` sein. Die Varianten `childNodes` und `firstChild` enthalten auch Leerraum-Textknoten und führen oft zu Überraschungen.',
    syntax: 'el.children   el.firstElementChild   el.lastElementChild\nel.childElementCount   el.parentElement',
    values: [['children', 'Live-Collection der Kind-Elemente'], ['firstElementChild', 'Erstes Kind-Element'], ['childElementCount', 'Anzahl der Kind-Elemente'], ['parentElement', 'Elternelement oder null'], ['childNodes', 'Alle Knoten inkl. Text und Kommentare']],
    example: c('const liste = document.querySelector("ul");', 'console.log("Kinder:", liste.children.length);', 'console.log("Erstes:", liste.firstElementChild.textContent);', 'console.log("Letztes:", liste.lastElementChild.textContent);', 'console.log("Eltern:", liste.parentElement.tagName);', 'console.log("childNodes:", liste.childNodes.length); // inkl. Leerraum', '', 'liste.lastElementChild.classList.add("hit");'),
    demo: d('<div><ul>\n  <li>Eins</li>\n  <li>Zwei</li>\n  <li>Drei</li>\n</ul></div>'),
    keywords: ['kind', 'eltern', 'parent', 'child', 'baum', 'traversieren', 'navigation'],
    related: ['nextElementSibling / previousElementSibling', 'closest()'], mdn: M + 'API/Element/children'
  }),
  E(A, {
    name: 'nextElementSibling / previousElementSibling',
    desc: 'Liefert das nächste bzw. vorherige Geschwister-Element.',
    details: 'Gibt das direkt folgende bzw. vorangehende Element auf derselben Ebene zurück oder `null`, wenn es keines gibt. Anders als `nextSibling` und `previousSibling` werden Textknoten und Kommentare übersprungen. Typisch für Akkordeons, Listennavigation und Formularfelder.',
    syntax: 'el.nextElementSibling   el.previousElementSibling',
    values: [['null', 'Kein weiteres Geschwister in dieser Richtung']],
    example: c('const zwei = document.querySelector("#zwei");', 'zwei.nextElementSibling.classList.add("hit");', 'zwei.previousElementSibling.classList.add("on");', 'console.log(zwei.nextElementSibling.textContent);', 'console.log(zwei.nextElementSibling.nextElementSibling); // null'),
    demo: d('<ul><li>Eins</li><li id="zwei">Zwei</li><li>Drei</li></ul>'),
    keywords: ['geschwister', 'sibling', 'nächstes', 'vorheriges', 'next', 'previous'],
    related: ['children / parentElement', 'closest()'], mdn: M + 'API/Element/nextElementSibling'
  }),

  // ---------------- DOM verändern ----------------
  E(V, {
    name: 'createElement()',
    desc: 'Erzeugt ein neues, noch nicht eingefügtes HTML-Element.',
    details: 'Das Element existiert zunächst nur im Speicher; erst `append()` oder ähnliche Methoden fügen es in die Seite ein. Eigenschaften und Inhalte lassen sich vorher setzen, was Reflows spart. Texte setzt man mit `textContent`, nicht mit `innerHTML`, wenn sie von Nutzern stammen.',
    syntax: 'const el = document.createElement("tagname");',
    values: [['"div"', 'Beliebiger HTML-Tagname'], ['{ is: "..." }', 'Zweites Argument für Customized Built-ins']],
    example: c('const li = document.createElement("li");', 'li.textContent = "Neuer Eintrag";', 'li.className = "item";', 'document.querySelector("ul").append(li);', 'console.log(li.outerHTML);'),
    demo: d('<ul><li>Bestehend</li></ul>'),
    keywords: ['erstellen', 'neues element', 'create', 'anlegen'],
    related: ['append() / prepend()', 'textContent', 'cloneNode()'], mdn: M + 'API/Document/createElement'
  }),
  E(V, {
    name: 'append() / prepend()',
    desc: 'Fügt Knoten oder Text am Ende bzw. Anfang eines Elements ein.',
    details: 'Beide Methoden nehmen beliebig viele Elemente oder Strings entgegen; Strings werden als Text eingefügt (nicht als HTML). Ein bereits im DOM befindlicher Knoten wird dabei verschoben, nicht kopiert. `appendChild()` ist die ältere Variante und akzeptiert nur einen Knoten.',
    syntax: 'parent.append(...knotenOderText);\nparent.prepend(...knotenOderText);',
    values: [['append()', 'Am Ende einfügen'], ['prepend()', 'Am Anfang einfügen'], ['appendChild(node)', 'Älter: ein Knoten, gibt ihn zurück']],
    example: c('const liste = document.querySelector("ul");', '', 'document.getElementById("hinten").onclick = () => {', '  const li = document.createElement("li");', '  li.textContent = "Hinten " + (liste.children.length + 1);', '  liste.append(li);', '};', 'document.getElementById("vorne").onclick = () => {', '  const li = document.createElement("li");', '  li.textContent = "Vorne";', '  liste.prepend(li);', '};'),
    demo: d('<button id="vorne">prepend</button><button id="hinten">append</button><ul><li>Mitte</li></ul>'),
    tip: 'Ein Strings-Argument wird escaped. Wer HTML-Text einfügen will, braucht `insertAdjacentHTML()`.',
    keywords: ['anhängen', 'einfügen', 'hinzufügen', 'appendChild', 'push'],
    related: ['before() / after()', 'createElement()', 'insertAdjacentHTML()'], mdn: M + 'API/Element/append'
  }),
  E(V, {
    name: 'before() / after()',
    desc: 'Fügt Knoten oder Text direkt vor bzw. hinter einem Element ein.',
    details: 'Im Unterschied zu `append()` wird auf Geschwisterebene eingefügt, das Element selbst bleibt unverändert. Das Element muss ein Elternelement haben, sonst passiert nichts. Wie bei `append()` werden Strings als Text eingefügt.',
    syntax: 'el.before(...knoten);\nel.after(...knoten);',
    example: c('const mitte = document.getElementById("mitte");', 'document.getElementById("b").onclick = () => {', '  const p = document.createElement("li");', '  p.textContent = "vor Mitte";', '  mitte.before(p);', '};', 'document.getElementById("a").onclick = () => {', '  const p = document.createElement("li");', '  p.textContent = "nach Mitte";', '  mitte.after(p);', '};'),
    demo: d('<button id="b">before</button><button id="a">after</button><ul><li id="mitte">Mitte</li></ul>'),
    keywords: ['davor', 'danach', 'einfügen', 'insertBefore', 'sibling'],
    related: ['append() / prepend()', 'replaceWith()', 'insertAdjacentHTML()'], mdn: M + 'API/Element/before'
  }),
  E(V, {
    name: 'remove()',
    desc: 'Entfernt ein Element aus dem DOM.',
    details: 'Löscht das Element samt Kindern aus dem Baum; die Referenz bleibt in JavaScript gültig, das Element kann also später wieder eingefügt werden. Event-Listener bleiben am Objekt erhalten. Für alle Inhalte eines Elements eignet sich `replaceChildren()` ohne Argumente.',
    syntax: 'element.remove();\nparent.replaceChildren(); // alle Kinder entfernen',
    example: c('document.querySelector("ul").addEventListener("click", (e) => {', '  const li = e.target.closest("li");', '  if (li) li.remove();', '  console.log("Übrig:", document.querySelectorAll("li").length);', '});'),
    demo: d('<p>Klicke einen Eintrag zum Entfernen:</p><ul><li>Eins</li><li>Zwei</li><li>Drei</li></ul>'),
    tip: 'Alte Browser kannten nur `parent.removeChild(kind)`, `remove()` ist heute überall verfügbar.',
    keywords: ['löschen', 'entfernen', 'delete', 'removeChild'],
    related: ['replaceWith()', 'append() / prepend()'], mdn: M + 'API/Element/remove'
  }),
  E(V, {
    name: 'replaceWith()',
    desc: 'Ersetzt ein Element durch andere Knoten oder Text.',
    details: 'Das Element wird aus dem Baum entfernt und an seiner Stelle werden die übergebenen Knoten eingefügt. Strings landen als Text, nicht als HTML. Mehrere Argumente sind erlaubt. Bereits eingefügte Knoten werden verschoben.',
    syntax: 'alt.replaceWith(...neu);',
    example: c('const alt = document.querySelector("#alt");', 'document.getElementById("go").onclick = () => {', '  const neu = document.createElement("strong");', '  neu.textContent = "Ersetzt!";', '  alt.replaceWith(neu);', '  console.log(alt.isConnected, neu.isConnected);', '};'),
    demo: d('<p>Hier: <em id="alt">altes Element</em></p><button id="go">Ersetzen</button>'),
    keywords: ['austauschen', 'replace', 'ersetzen', 'replaceChild'],
    related: ['remove()', 'before() / after()'], mdn: M + 'API/Element/replaceWith'
  }),
  E(V, {
    name: 'cloneNode()',
    desc: 'Erstellt eine Kopie eines Knotens, optional samt aller Nachfahren.',
    details: 'Mit `true` wird tief kopiert (inklusive Kindern), mit `false` nur das Element selbst. Attribute werden kopiert, Event-Listener, die per `addEventListener` registriert wurden, aber nicht. Achtung: Doppelte `id`-Attribute entstehen, wenn man die Kopie einfügt, ohne die ID zu ändern.',
    syntax: 'const kopie = node.cloneNode(deep);',
    values: [['true', 'Tiefe Kopie mit allen Nachfahren'], ['false', 'Nur der Knoten selbst (Standard)']],
    example: c('const karte = document.querySelector(".karte");', 'document.getElementById("dup").onclick = () => {', '  const kopie = karte.cloneNode(true);', '  kopie.removeAttribute("id");', '  kopie.querySelector("b").textContent = "Kopie";', '  document.getElementById("ziel").append(kopie);', '};', 'console.log("Flach:", karte.cloneNode(false).childNodes.length);'),
    demo: d('<div class="box karte" id="orig"><b>Original</b> mit Inhalt</div><button id="dup">Klonen</button><div id="ziel"></div>'),
    keywords: ['kopieren', 'duplizieren', 'clone', 'deep copy'],
    related: ['<template> klonen', 'createElement()'], mdn: M + 'API/Node/cloneNode'
  }),
  E(V, {
    name: 'textContent',
    desc: 'Liest oder setzt den reinen Text eines Elements und seiner Nachfahren.',
    details: 'Beim Setzen wird der Inhalt komplett durch einen Textknoten ersetzt und Sonderzeichen werden nicht als HTML interpretiert; das macht `textContent` zur sicheren Standardwahl für Nutzereingaben. Beim Lesen werden alle Textknoten inklusive versteckter Elemente geliefert. `innerText` berücksichtigt dagegen das Layout (z. B. `display: none`) und ist langsamer.',
    syntax: 'const text = el.textContent;\nel.textContent = "neuer Text";',
    values: [['textContent', 'Rohtext, schnell, kein HTML-Parsing'], ['innerText', 'Gerenderter Text, layoutabhängig'], ['innerHTML', 'HTML-String, XSS-Risiko']],
    example: c('const out = document.getElementById("out");', 'const eingabe = document.getElementById("txt");', 'eingabe.addEventListener("input", () => {', '  out.textContent = eingabe.value; // <b> bleibt Text', '});', 'console.log(out.textContent);'),
    demo: d('<input id="txt" value="<b>fett?</b>" size="24"><p id="out">Vorschau</p>'),
    tip: 'Tippe HTML-Tags ein: Sie erscheinen als Text. Mit `innerHTML` würden sie ausgeführt.',
    keywords: ['text', 'inhalt', 'innerText', 'sicher', 'xss'],
    related: ['innerHTML', 'createElement()'], mdn: M + 'API/Node/textContent'
  }),
  E(V, {
    name: 'innerHTML',
    desc: 'Liest oder setzt den HTML-Inhalt eines Elements als String.',
    details: 'Beim Setzen wird der String als HTML geparst und ersetzt alle Kinder; dabei gehen Event-Listener der alten Kinder verloren. Sicherheitsrisiko: Nutzer- oder Fremddaten in `innerHTML` ermöglichen Cross-Site-Scripting (XSS), etwa über `<img onerror=...>`. Für reinen Text `textContent` verwenden; für HTML-Fragmente aus Fremdquellen zuvor sanitizen (z. B. `setHTML()` bzw. DOMPurify).',
    syntax: 'const html = el.innerHTML;\nel.innerHTML = "<p>Neu</p>";',
    values: [['el.innerHTML = ""', 'Alle Kinder leeren'], ['el.innerHTML += "..."', 'Parst alles neu, Listener gehen verloren'], ['el.outerHTML', 'Inklusive des Elements selbst']],
    example: c('const out = document.getElementById("out");', 'out.innerHTML = "<strong>Fett</strong> und <em>kursiv</em>";', 'console.log(out.innerHTML);', '', '// Unsicher mit Fremddaten:', 'const eingabe = "<img src=x onerror=\\"console.log(\'XSS!\')\\">";', 'document.getElementById("gefahr").onclick = () => {', '  out.innerHTML = eingabe; // führt Code aus', '};', 'document.getElementById("sicher").onclick = () => {', '  out.textContent = eingabe; // bleibt Text', '};'),
    demo: d('<div id="out" class="box"></div><button id="gefahr">innerHTML (gefährlich)</button><button id="sicher">textContent</button>'),
    tip: '`innerHTML += x` in einer Schleife ist langsam und zerstört bestehende Listener. Besser `insertAdjacentHTML()` oder `append()`.',
    keywords: ['html setzen', 'xss', 'sicherheit', 'outerHTML', 'security', 'sanitize'],
    related: ['textContent', 'insertAdjacentHTML()', 'createElement()'], mdn: M + 'API/Element/innerHTML'
  }),
  E(V, {
    name: 'insertAdjacentHTML()',
    desc: 'Fügt einen HTML-String an einer von vier Positionen relativ zum Element ein.',
    details: 'Parst den String und fügt ihn ein, ohne bestehende Kinder zu zerstören oder neu zu parsen; das ist schneller und listener-freundlicher als `innerHTML +=`. Wie bei `innerHTML` besteht XSS-Gefahr bei unvertrauten Daten, solche Werte vorher escapen oder per `textContent` setzen. Der Positionsparameter ist case-insensitive.',
    syntax: 'el.insertAdjacentHTML(position, htmlString);',
    values: [['"beforebegin"', 'Vor dem Element selbst'], ['"afterbegin"', 'Im Element, vor dem ersten Kind'], ['"beforeend"', 'Im Element, nach dem letzten Kind'], ['"afterend"', 'Nach dem Element selbst']],
    example: c('const ziel = document.getElementById("ziel");', 'ziel.insertAdjacentHTML("beforebegin", "<p class=\\"box\\">beforebegin</p>");', 'ziel.insertAdjacentHTML("afterbegin", "<i>afterbegin </i>");', 'ziel.insertAdjacentHTML("beforeend", "<i> beforeend</i>");', 'ziel.insertAdjacentHTML("afterend", "<p class=\\"box\\">afterend</p>");', 'console.log(ziel.parentElement.innerHTML);'),
    demo: d('<div><span id="ziel" style="background:#ffd54a">Ziel</span></div>'),
    keywords: ['position', 'html einfügen', 'beforeend', 'afterbegin', 'adjacent'],
    related: ['innerHTML', 'append() / prepend()', 'before() / after()'], mdn: M + 'API/Element/insertAdjacentHTML'
  }),
  E(V, {
    name: 'classList',
    desc: 'Liest und ändert die CSS-Klassen eines Elements über eine komfortable API.',
    details: 'Statt den `className`-String selbst zu bearbeiten, bietet `classList` die Methoden `add`, `remove`, `toggle`, `contains` und `replace`. `add` und `remove` akzeptieren mehrere Klassen, `toggle` kann mit einem zweiten Boolean-Parameter erzwungen werden. Klassennamen dürfen keine Leerzeichen enthalten, sonst wird ein `InvalidCharacterError` geworfen.',
    syntax: 'el.classList.add("a", "b");\nel.classList.remove("a");\nel.classList.toggle("a", erzwingen);\nel.classList.contains("a");',
    values: [['add(...)', 'Fügt Klassen hinzu'], ['remove(...)', 'Entfernt Klassen'], ['toggle(k, force?)', 'Umschalten, gibt neuen Zustand zurück'], ['contains(k)', 'Prüft, ob die Klasse gesetzt ist'], ['replace(alt, neu)', 'Tauscht eine Klasse aus']],
    example: c('const box = document.getElementById("box");', 'document.getElementById("t").onclick = () => {', '  const aktiv = box.classList.toggle("on");', '  console.log("on:", aktiv, "| Klassen:", box.className);', '};', 'document.getElementById("h").onclick = () => {', '  box.classList.add("hit");', '  console.log(box.classList.contains("hit"));', '};'),
    demo: d('<div id="box" class="box">Ich bin eine Box</div><button id="t">toggle("on")</button><button id="h">add("hit")</button>'),
    tip: 'Nutze Klassen für Zustände und lass das Aussehen im CSS definieren statt es per `style` zu setzen.',
    keywords: ['css klasse', 'class', 'toggle', 'add', 'remove', 'className'],
    related: ['style (Inline-Styles)', 'dataset', 'setAttribute() / getAttribute()'], mdn: M + 'API/Element/classList'
  }),
  E(V, {
    name: 'dataset',
    desc: 'Greift auf data-*-Attribute eines Elements als Objekt zu.',
    details: 'Das Attribut `data-user-id` wird zu `el.dataset.userId` (kebab-case wird camelCase). Alle Werte sind Strings, Zahlen oder Booleans müssen selbst umgewandelt werden. Neue Werte setzt man einfach per Zuweisung, entfernen mit `delete el.dataset.key`.',
    syntax: 'el.dataset.meinWert = "x";   // data-mein-wert="x"\nconst v = el.dataset.meinWert;',
    values: [['data-user-id', 'dataset.userId'], ['delete el.dataset.x', 'Attribut entfernen'], ['Number(el.dataset.n)', 'Umwandlung nötig, Werte sind Strings']],
    example: c('const btn = document.getElementById("btn");', 'console.log(btn.dataset.userId, typeof btn.dataset.userId);', 'btn.addEventListener("click", () => {', '  btn.dataset.clicks = Number(btn.dataset.clicks || 0) + 1;', '  console.log(btn.outerHTML);', '});'),
    demo: d('<button id="btn" data-user-id="42">Klick mich</button>'),
    keywords: ['data-attribut', 'data attribute', 'benutzerdefiniert', 'custom attribute'],
    related: ['setAttribute() / getAttribute()', 'classList', 'Event-Delegation'], mdn: M + 'API/HTMLElement/dataset'
  }),
  E(V, {
    name: 'setAttribute() / getAttribute()',
    desc: 'Setzt bzw. liest ein HTML-Attribut als String.',
    details: 'Arbeitet mit dem Attribut im Markup, nicht mit der gleichnamigen Property: `getAttribute("value")` liefert den Anfangswert, `input.value` den aktuellen. Fehlt das Attribut, gibt `getAttribute()` `null` zurück. Für `class`, `style`, `data-*` gibt es komfortablere Schnittstellen. Boolesche Attribute wie `disabled` sind gesetzt, sobald sie existieren, egal welchen Wert sie haben.',
    syntax: 'el.setAttribute(name, wert);\nconst wert = el.getAttribute(name);\nel.hasAttribute(name);',
    values: [['getAttribute(n)', 'String oder null'], ['setAttribute(n, v)', 'Setzt/überschreibt das Attribut'], ['hasAttribute(n)', 'Boolean']],
    example: c('const link = document.getElementById("lnk");', 'console.log(link.getAttribute("href"));', 'link.setAttribute("href", "https://example.org/neu");', 'link.setAttribute("target", "_blank");', 'link.setAttribute("rel", "noopener");', 'console.log(link.outerHTML);', 'console.log(link.getAttribute("title")); // null'),
    demo: d('<a id="lnk" href="#">Ein Link</a>'),
    tip: 'Bei Eingabefeldern ist die Property (`input.value`, `checkbox.checked`) meist die richtige Wahl.',
    keywords: ['attribut', 'attribute', 'href', 'src', 'aria'],
    related: ['removeAttribute() / toggleAttribute()', 'dataset', 'classList'], mdn: M + 'API/Element/setAttribute'
  }),
  E(V, {
    name: 'removeAttribute() / toggleAttribute()',
    desc: 'Entfernt ein Attribut bzw. schaltet ein boolesches Attribut um.',
    details: '`removeAttribute()` löscht das Attribut vollständig (sinnvoll z. B. bei `disabled`, da `disabled="false"` trotzdem deaktiviert). `toggleAttribute()` fügt ein leeres Attribut hinzu oder entfernt es und gibt zurück, ob es danach vorhanden ist; ein zweiter Boolean-Parameter erzwingt den Zustand.',
    syntax: 'el.removeAttribute(name);\nel.toggleAttribute(name, force?);',
    values: [['toggleAttribute(n)', 'Umschalten, liefert neuen Zustand'], ['toggleAttribute(n, true)', 'Setzen erzwingen'], ['toggleAttribute(n, false)', 'Entfernen erzwingen']],
    example: c('const feld = document.getElementById("feld");', 'document.getElementById("t").onclick = () => {', '  const aus = feld.toggleAttribute("disabled");', '  console.log("disabled:", aus);', '};', 'document.getElementById("r").onclick = () => {', '  feld.removeAttribute("disabled");', '  console.log(feld.outerHTML);', '};'),
    demo: d('<input id="feld" value="Text" disabled><br><button id="t">toggleAttribute("disabled")</button><button id="r">removeAttribute</button>'),
    tip: '`setAttribute("disabled", "false")` macht das Feld nicht aktiv. Attribut entfernen oder `el.disabled = false` setzen.',
    keywords: ['disabled', 'hidden', 'attribut löschen', 'boolean attribute'],
    related: ['setAttribute() / getAttribute()', 'classList'], mdn: M + 'API/Element/toggleAttribute'
  }),
  E(V, {
    name: 'style (Inline-Styles)',
    desc: 'Liest und setzt Inline-CSS eines Elements über die style-Property.',
    details: 'CSS-Eigenschaften werden in camelCase geschrieben (`backgroundColor`), Werte sind Strings samt Einheit. Mit `style.setProperty("--farbe", "red")` lassen sich auch CSS-Variablen setzen. `style` liest nur Inline-Styles, nicht das berechnete Ergebnis aus Stylesheets, dafür `getComputedStyle()`. Für größere Änderungen sind CSS-Klassen wartbarer.',
    syntax: 'el.style.backgroundColor = "red";\nel.style.setProperty("--x", "10px");\nel.style.removeProperty("color");',
    values: [['el.style.cssText', 'Ganzen Inline-Stil als String'], ['setProperty(n, v)', 'Auch für Custom Properties'], ['removeProperty(n)', 'Inline-Wert entfernen']],
    example: c('const box = document.getElementById("box");', 'document.getElementById("a").onclick = () => {', '  box.style.backgroundColor = "#b4367a";', '  box.style.color = "white";', '  box.style.padding = "16px";', '  console.log(box.getAttribute("style"));', '};', 'document.getElementById("b").onclick = () => {', '  box.removeAttribute("style");', '};'),
    demo: d('<div id="box" class="box">Stil-Box</div><button id="a">Styles setzen</button><button id="b">Zurücksetzen</button>'),
    keywords: ['inline style', 'css setzen', 'camelCase', 'cssText', 'setProperty'],
    related: ['getComputedStyle()', 'classList'], mdn: M + 'API/HTMLElement/style'
  }),
  E(V, {
    name: 'getComputedStyle()',
    desc: 'Liefert die tatsächlich angewendeten (berechneten) CSS-Werte eines Elements.',
    details: 'Das Ergebnis ist ein schreibgeschütztes, live aktualisiertes `CSSStyleDeclaration`-Objekt mit aufgelösten Werten, etwa `rgb(...)` statt Farbnamen und Pixel statt `em`. Werte werden mit `getPropertyValue("--var")` oder Property-Namen gelesen. Der Aufruf kann einen Reflow auslösen und sollte nicht übermäßig oft in Schleifen stehen.',
    syntax: 'const cs = getComputedStyle(element, pseudoElement?);\ncs.getPropertyValue("margin-top");',
    values: [['cs.color', 'Aufgelöste Farbe, z. B. rgb(...)'], ['cs.getPropertyValue("--x")', 'Custom Property lesen'], ['getComputedStyle(el, "::before")', 'Pseudoelement abfragen']],
    example: c('const box = document.getElementById("box");', 'const cs = getComputedStyle(box);', 'console.log("Farbe:", cs.color);', 'console.log("Breite:", cs.width);', 'console.log("Padding:", cs.paddingTop);', 'console.log("Variable:", cs.getPropertyValue("--akzent"));'),
    demo: d('<style>#box{--akzent:#b4367a;color:crimson;width:50%;padding:1em;background:#eef}</style><div id="box">Berechneter Stil</div>'),
    keywords: ['berechnet', 'computed', 'aktueller stil', 'css lesen'],
    related: ['style (Inline-Styles)', 'getBoundingClientRect()'], mdn: M + 'API/Window/getComputedStyle'
  }),
  E(V, {
    name: 'getBoundingClientRect()',
    desc: 'Liefert Größe und Position eines Elements relativ zum Viewport.',
    details: 'Das `DOMRect` enthält `x`, `y`, `width`, `height`, `top`, `right`, `bottom`, `left` in Pixeln und berücksichtigt CSS-Transformationen. Die Koordinaten sind viewportbezogen und ändern sich beim Scrollen; für Dokumentkoordinaten `scrollY` bzw. `scrollX` addieren. Der Aufruf erzwingt ein Layout und sollte nicht ständig in Schleifen genutzt werden.',
    syntax: 'const r = element.getBoundingClientRect();',
    values: [['top / left', 'Abstand zum Viewport-Rand'], ['width / height', 'Größe inkl. Padding und Border'], ['bottom / right', 'top + height bzw. left + width']],
    example: c('const box = document.getElementById("box");', 'function zeige() {', '  const r = box.getBoundingClientRect();', '  console.log(`top=${Math.round(r.top)} left=${Math.round(r.left)} w=${Math.round(r.width)} h=${Math.round(r.height)}`);', '}', 'zeige();', 'document.getElementById("s").onclick = () => {', '  window.scrollBy(0, 20);', '  zeige();', '};'),
    demo: d('<div id="box" class="box" style="width:120px;height:40px;margin:30px">Messbox</div><button id="s">Scrollen und messen</button><div style="height:300px"></div>'),
    keywords: ['position', 'größe', 'abmessungen', 'rect', 'offsetWidth', 'viewport'],
    related: ['scrollIntoView()', 'getComputedStyle()', 'Scroll & Resize'], mdn: M + 'API/Element/getBoundingClientRect'
  }),
  E(V, {
    name: 'scrollIntoView()',
    desc: 'Scrollt das Element in den sichtbaren Bereich.',
    details: 'Scrollt alle nötigen scrollbaren Vorfahren, damit das Element sichtbar wird. Über das Options-Objekt lassen sich sanftes Scrollen (`behavior: "smooth"`) und die Ausrichtung (`block`, `inline`) steuern. Berücksichtigt `scroll-margin` und `scroll-padding` aus CSS, daher werden feste Header oft dort ausgeglichen.',
    syntax: 'el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });',
    values: [['behavior: "smooth"', 'Animiert scrollen'], ['block: "start" | "center" | "end" | "nearest"', 'Vertikale Ausrichtung'], ['inline: "start" | "center" | "end" | "nearest"', 'Horizontale Ausrichtung']],
    example: c('const ziel = document.getElementById("ziel");', 'document.getElementById("go").onclick = () => {', '  ziel.scrollIntoView({ behavior: "smooth", block: "center" });', '  ziel.classList.add("hit");', '  console.log("gescrollt");', '};'),
    demo: d('<button id="go">Zum Ziel scrollen</button><div style="height:260px"></div><div id="ziel" class="box">Ziel</div><div style="height:120px"></div>'),
    tip: 'Für Fokus auf Formulare: `el.focus({ preventScroll: true })` verhindert unerwünschtes Springen.',
    keywords: ['scrollen', 'sichtbar', 'smooth', 'anker'],
    related: ['getBoundingClientRect()', 'Scroll & Resize'], mdn: M + 'API/Element/scrollIntoView'
  }),
  E(V, {
    name: 'DocumentFragment',
    desc: 'Leichtgewichtiger Container, um viele Knoten auf einmal ins DOM einzufügen.',
    details: 'Ein Fragment lebt außerhalb des Dokuments; Knoten darin verursachen keine Layout-Berechnungen. Beim Einfügen mit `append()` wird nur der Inhalt eingefügt und das Fragment ist danach leer. Sinnvoll, wenn in einer Schleife viele Elemente erzeugt werden und man nur einmal ins DOM schreiben möchte.',
    syntax: 'const frag = document.createDocumentFragment();\nfrag.append(a, b, c);\nziel.append(frag);',
    example: c('const frag = document.createDocumentFragment();', 'for (let i = 1; i <= 5; i++) {', '  const li = document.createElement("li");', '  li.textContent = "Eintrag " + i;', '  frag.append(li);', '}', 'console.log("Im Fragment:", frag.childElementCount);', 'document.querySelector("ul").append(frag);', 'console.log("Danach im Fragment:", frag.childElementCount);'),
    demo: d('<ul></ul>'),
    keywords: ['fragment', 'batch', 'performance', 'viele elemente', 'createDocumentFragment'],
    related: ['<template> klonen', 'append() / prepend()', 'createElement()'], mdn: M + 'API/DocumentFragment'
  }),
  E(V, {
    name: '<template> klonen',
    desc: 'Nutzt ein HTML-<template> als wiederverwendbare Vorlage und klont dessen Inhalt.',
    details: 'Der Inhalt eines `<template>` wird nicht gerendert und liegt in `template.content`, einem `DocumentFragment`. Mit `cloneNode(true)` entsteht eine Kopie, die man befüllen und einfügen kann. Das ist sicherer und übersichtlicher als HTML-Strings, wenn Texte per `textContent` gesetzt werden.',
    syntax: 'const kopie = template.content.cloneNode(true);\nziel.append(kopie);',
    example: c('const tpl = document.getElementById("zeile");', 'const liste = document.getElementById("liste");', 'for (const name of ["Anna", "Ben", "Cem"]) {', '  const kopie = tpl.content.cloneNode(true);', '  kopie.querySelector(".name").textContent = name;', '  liste.append(kopie);', '}', 'console.log(liste.children.length, "Zeilen erzeugt");'),
    demo: d('<template id="zeile"><li><b class="name"></b> ist dabei</li></template><ul id="liste"></ul>'),
    tip: 'Die Elemente im Template sind inert: IDs im Template kollidieren nicht mit Seiten-IDs, solange sie nicht eingefügt werden.',
    keywords: ['template', 'vorlage', 'content', 'wiederverwenden', 'component'],
    related: ['DocumentFragment', 'cloneNode()', 'innerHTML'], mdn: M + 'HTML/Element/template'
  }),
  E(V, {
    name: 'Formularwerte lesen (value, checked)',
    desc: 'Liest den aktuellen Zustand von Eingabefeldern über Properties.',
    details: '`input.value` liefert immer einen String (auch bei `type="number"`), `checked` einen Boolean bei Checkbox und Radio, `select.value` den Wert der gewählten Option. Für ganze Formulare ist `new FormData(form)` bequem. Zahlen mit `valueAsNumber` oder `Number()` konvertieren und Leerzeichen bei Bedarf mit `trim()` entfernen.',
    syntax: 'input.value   checkbox.checked   select.value\nconst fd = new FormData(form);   fd.get("name");',
    values: [['input.value', 'String'], ['input.valueAsNumber', 'Zahl bei type="number"'], ['checkbox.checked', 'Boolean'], ['select.selectedOptions', 'Gewählte Optionen'], ['new FormData(form)', 'Alle Felder per Name']],
    example: c('const form = document.getElementById("f");', 'document.getElementById("lies").onclick = () => {', '  console.log("Name:", form.elements.name.value);', '  console.log("Alter:", form.elements.alter.valueAsNumber);', '  console.log("AGB:", form.elements.agb.checked);', '  console.log("Land:", form.elements.land.value);', '  console.log(Object.fromEntries(new FormData(form)));', '};'),
    demo: d('<form id="f"><input name="name" value="Anna" size="8"> <input name="alter" type="number" value="30" style="width:50px"> <label><input name="agb" type="checkbox" checked> AGB</label> <select name="land"><option value="de">DE</option><option value="at">AT</option></select></form><button id="lies">Werte lesen</button>'),
    tip: 'Nicht angekreuzte Checkboxen fehlen in `FormData` komplett. `value` einer Checkbox ist nicht der Zustand.',
    keywords: ['eingabe', 'formular', 'input', 'wert', 'FormData', 'form value'],
    related: ['Formular-Events (input, change, submit)', 'setAttribute() / getAttribute()'], mdn: M + 'API/HTMLInputElement/value'
  }),

  // ---------------- Events ----------------
  E(EV, {
    name: 'addEventListener()',
    desc: 'Registriert eine Funktion, die bei einem Ereignis auf einem Ziel aufgerufen wird.',
    details: 'Das ist die empfohlene Art, Events zu behandeln: Es lassen sich mehrere Listener pro Ereignis registrieren, und Optionen wie `once` oder `capture` sind möglich. Eine identische Funktionsreferenz mit identischen Optionen wird nur einmal registriert. Pfeilfunktionen haben kein eigenes `this`; `e.currentTarget` liefert verlässlich das Element, an dem der Listener hängt.',
    syntax: 'target.addEventListener(typ, listener, options?);',
    values: [['typ', 'String wie "click", "input", "keydown"'], ['listener', 'Funktion(event) oder Objekt mit handleEvent'], ['options', 'Boolean (capture) oder Objekt { once, passive, capture, signal }']],
    example: c('const btn = document.getElementById("btn");', 'let n = 0;', 'btn.addEventListener("click", (e) => {', '  n++;', '  console.log("Klick Nr.", n, "auf", e.currentTarget.id);', '});', 'btn.addEventListener("click", () => console.log("Zweiter Listener"));'),
    demo: d('<button id="btn">Klick mich</button>'),
    tip: 'Nicht `addEventListener("click", fn())` schreiben: Das ruft `fn` sofort auf und übergibt das Ergebnis.',
    keywords: ['event', 'listener', 'handler', 'onclick', 'ereignis', 'registrieren'],
    related: ['removeEventListener()', 'Event-Objekt', 'Optionen (once, passive, signal)'], mdn: M + 'API/EventTarget/addEventListener'
  }),
  E(EV, {
    name: 'removeEventListener()',
    desc: 'Entfernt einen zuvor registrierten Event-Listener.',
    details: 'Funktioniert nur, wenn dieselbe Funktionsreferenz, derselbe Typ und derselbe `capture`-Wert wie bei der Registrierung übergeben werden. Anonyme Funktionen oder Pfeilfunktionen inline lassen sich daher nicht entfernen; die Funktion muss benannt oder in einer Variablen gespeichert sein. Alternative: `once` oder ein `AbortSignal`.',
    syntax: 'target.removeEventListener(typ, listener, options?);',
    example: c('const btn = document.getElementById("btn");', 'function hallo() {', '  console.log("Hallo!");', '}', 'btn.addEventListener("click", hallo);', 'document.getElementById("off").onclick = () => {', '  btn.removeEventListener("click", hallo);', '  console.log("Listener entfernt");', '};'),
    demo: d('<button id="btn">Sag Hallo</button><button id="off">Listener entfernen</button>'),
    tip: 'Listener nicht mit Inline-Funktionen anlegen, wenn man sie später entfernen will.',
    keywords: ['entfernen', 'abmelden', 'unregister', 'aufräumen', 'memory leak'],
    related: ['addEventListener()', 'Optionen (once, passive, signal)'], mdn: M + 'API/EventTarget/removeEventListener'
  }),
  E(EV, {
    name: 'Event-Objekt',
    desc: 'Das Objekt, das jedem Listener übergeben wird und das Ereignis beschreibt.',
    details: '`e.target` ist das Element, an dem das Ereignis ausgelöst wurde; `e.currentTarget` ist das Element, an dem der Listener hängt. `e.type`, `e.timeStamp` und `e.isTrusted` (true bei echten Nutzeraktionen) liefern weitere Informationen. Spezifische Events bringen eigene Felder mit, etwa `clientX` bei Mausereignissen oder `key` bei Tastaturereignissen.',
    syntax: 'el.addEventListener("click", (e) => { e.target; e.currentTarget; e.type; });',
    values: [['e.target', 'Auslösendes Element'], ['e.currentTarget', 'Element mit dem Listener'], ['e.type', 'Ereignisname'], ['e.isTrusted', 'true bei echten Nutzeraktionen'], ['e.defaultPrevented', 'Wurde preventDefault aufgerufen?']],
    example: c('const box = document.getElementById("box");', 'box.addEventListener("click", (e) => {', '  console.log("type:", e.type);', '  console.log("target:", e.target.tagName);', '  console.log("currentTarget:", e.currentTarget.id);', '  console.log("Position:", e.clientX, e.clientY);', '  console.log("isTrusted:", e.isTrusted);', '});'),
    demo: d('<div id="box" class="box">Klicke auf den <b>fetten</b> Text oder daneben</div>'),
    keywords: ['event', 'target', 'currentTarget', 'ereignisobjekt', 'event object'],
    related: ['addEventListener()', 'Event-Delegation', 'Maus-Events (click, dblclick, mouseenter …)'], mdn: M + 'API/Event'
  }),
  E(EV, {
    name: 'preventDefault()',
    desc: 'Verhindert die Standardaktion des Browsers für ein Ereignis.',
    details: 'Typische Fälle: Link-Navigation, Formular-Absenden oder Kontextmenü unterdrücken. Die Methode stoppt weder die Weitergabe des Events (das macht `stopPropagation()`) noch weitere Listener. Bei Listenern mit `passive: true` (z. B. `touchstart`, `wheel`) wird `preventDefault()` ignoriert und eine Warnung ausgegeben. Nicht alle Events sind abbrechbar, prüfbar über `e.cancelable`.',
    syntax: 'event.preventDefault();',
    example: c('document.getElementById("lnk").addEventListener("click", (e) => {', '  e.preventDefault();', '  console.log("Navigation verhindert, abbrechbar:", e.cancelable);', '});', 'document.getElementById("f").addEventListener("submit", (e) => {', '  e.preventDefault();', '  console.log("Eigene Verarbeitung statt Neuladen");', '});'),
    demo: d('<a id="lnk" href="https://example.org">Link (wird nicht geöffnet)</a><form id="f"><input value="Daten"> <button>Senden</button></form>'),
    keywords: ['standardverhalten', 'abbrechen', 'default action', 'submit', 'link'],
    related: ['stopPropagation()', 'Formular-Events (input, change, submit)', 'Optionen (once, passive, signal)'], mdn: M + 'API/Event/preventDefault'
  }),
  E(EV, {
    name: 'stopPropagation()',
    desc: 'Stoppt die Weitergabe eines Ereignisses an weitere Elemente im Baum.',
    details: 'Das Event wird nicht mehr an Eltern (Bubbling) bzw. Kinder (Capturing) weitergegeben. Andere Listener auf demselben Element laufen dennoch; um auch diese zu stoppen, gibt es `stopImmediatePropagation()`. Sparsam verwenden, da es globale Listener (z. B. Delegation, Analytics oder „außerhalb klicken“) blockiert.',
    syntax: 'event.stopPropagation();\nevent.stopImmediatePropagation();',
    values: [['stopPropagation()', 'Keine Weitergabe an andere Elemente'], ['stopImmediatePropagation()', 'Zusätzlich keine weiteren Listener am selben Element']],
    example: c('document.getElementById("aussen").addEventListener("click", () => console.log("außen"));', 'document.getElementById("a").addEventListener("click", () => console.log("A (bubbelt)"));', 'document.getElementById("b").addEventListener("click", (e) => {', '  e.stopPropagation();', '  console.log("B (gestoppt)");', '});'),
    demo: d('<div id="aussen" class="box">Außen<br><button id="a">A bubbelt</button> <button id="b">B stoppt</button></div>'),
    tip: 'Oft besser: im Außen-Listener `e.target` prüfen, statt Propagation global zu stoppen.',
    keywords: ['bubbling stoppen', 'weitergabe', 'propagation', 'stopImmediatePropagation'],
    related: ['preventDefault()', 'Bubbling & Capturing', 'Event-Delegation'], mdn: M + 'API/Event/stopPropagation'
  }),
  E(EV, {
    name: 'Bubbling & Capturing',
    desc: 'Die beiden Phasen, in denen ein Ereignis durch den DOM-Baum wandert.',
    details: 'Ein Ereignis läuft zuerst von `window` nach unten zum Ziel (Capturing), erreicht das Ziel und steigt danach wieder auf (Bubbling). Listener reagieren standardmäßig im Bubbling; mit `{ capture: true }` bereits in der Capturing-Phase. Manche Events (z. B. `focus`, `blur`, `mouseenter`) bubbeln nicht, für sie gibt es `focusin`/`focusout` bzw. `mouseover`.',
    syntax: 'el.addEventListener("click", fn, { capture: true });',
    values: [['capture: false', 'Bubbling (Standard)'], ['capture: true', 'Capturing-Phase'], ['e.eventPhase', '1 = Capture, 2 = Ziel, 3 = Bubble']],
    example: c('const boxen = document.querySelectorAll(".box");', 'boxen.forEach(b => {', '  b.addEventListener("click", () => console.log("bubble:", b.id), false);', '  b.addEventListener("click", () => console.log("capture:", b.id), true);', '});', 'console.log("Klicke das innere Feld.");'),
    demo: d('<div id="eins" class="box">eins<div id="zwei" class="box">zwei<div id="drei" class="box">drei (klick mich)</div></div></div>'),
    keywords: ['capture', 'bubble', 'phase', 'event flow', 'ereignisfluss', 'aufsteigen'],
    related: ['stopPropagation()', 'Event-Delegation', 'Optionen (once, passive, signal)'], mdn: M + 'API/Event/eventPhase'
  }),
  E(EV, {
    name: 'Event-Delegation',
    desc: 'Ein einzelner Listener am Elternelement behandelt Ereignisse vieler Kinder.',
    details: 'Nutzt das Bubbling: Der Listener liegt am Container, und `e.target.closest(selektor)` ermittelt das betroffene Kind. Spart Listener und funktioniert automatisch für später hinzugefügte Elemente. Wichtig ist die Prüfung, ob der Treffer innerhalb des Containers liegt (`container.contains(el)`), besonders bei verschachtelten Strukturen; nicht bubbelnde Events wie `focus` brauchen `focusin`.',
    syntax: 'container.addEventListener("click", (e) => {\n  const el = e.target.closest(".item");\n  if (!el || !container.contains(el)) return;\n});',
    example: c('const liste = document.getElementById("liste");', 'liste.addEventListener("click", (e) => {', '  const btn = e.target.closest("button[data-id]");', '  if (!btn || !liste.contains(btn)) return;', '  console.log("Löschen:", btn.dataset.id);', '  btn.closest("li").remove();', '});', 'document.getElementById("neu").onclick = () => {', '  const id = liste.children.length + 10;', '  liste.insertAdjacentHTML("beforeend", `<li>Neu ${id} <button data-id="${id}">x</button></li>`);', '};'),
    demo: d('<ul id="liste"><li>Eins <button data-id="1">x</button></li><li>Zwei <button data-id="2">x</button></li></ul><button id="neu">Eintrag hinzufügen</button>'),
    tip: 'Auch dynamisch erzeugte Einträge funktionieren sofort, ohne dass Listener neu angelegt werden müssen.',
    keywords: ['delegation', 'delegieren', 'dynamische elemente', 'event bubbling', 'closest'],
    related: ['closest()', 'Bubbling & Capturing', 'dataset'], mdn: 'https://developer.mozilla.org/de/docs/Learn_web_development/Core/Scripting/Event_bubbling'
  }),
  E(EV, {
    name: 'Optionen (once, passive, signal)',
    desc: 'Das dritte Argument von addEventListener steuert Verhalten und Lebensdauer des Listeners.',
    details: '`once: true` entfernt den Listener nach dem ersten Aufruf automatisch. `passive: true` verspricht, dass kein `preventDefault()` aufgerufen wird, was Scroll-Performance bei `touchstart`, `wheel` verbessert. Mit `signal` lassen sich beliebig viele Listener über einen einzigen `AbortController.abort()` entfernen, ideal fürs Aufräumen.',
    syntax: 'el.addEventListener(typ, fn, { once: true, passive: true, capture: false, signal });',
    values: [['once: true', 'Nach erstem Aufruf automatisch entfernt'], ['passive: true', 'preventDefault() wird ignoriert, besseres Scrollen'], ['capture: true', 'Capturing-Phase'], ['signal: AbortSignal', 'Entfernen per controller.abort()']],
    example: c('const btn = document.getElementById("btn");', 'btn.addEventListener("click", () => console.log("nur einmal!"), { once: true });', '', 'const ctrl = new AbortController();', 'btn.addEventListener("click", () => console.log("A"), { signal: ctrl.signal });', 'btn.addEventListener("pointerenter", () => console.log("B"), { signal: ctrl.signal });', 'document.getElementById("stop").onclick = () => {', '  ctrl.abort();', '  console.log("alle signal-Listener entfernt");', '};'),
    demo: d('<button id="btn">Klick / Hover</button><button id="stop">abort()</button>'),
    tip: 'Eine Zeile `ctrl.abort()` räumt viele Listener auf, etwa beim Entfernen einer Komponente.',
    keywords: ['once', 'passive', 'signal', 'abortcontroller', 'capture', 'options'],
    related: ['addEventListener()', 'removeEventListener()', 'Bubbling & Capturing'], mdn: M + 'API/EventTarget/addEventListener#options'
  }),
  E(EV, {
    name: 'CustomEvent / dispatchEvent()',
    desc: 'Erzeugt eigene Ereignisse mit Daten und löst sie auf einem Element aus.',
    details: '`new CustomEvent(name, { detail, bubbles, cancelable })` erzeugt ein Ereignis, dessen Nutzdaten in `e.detail` liegen. `dispatchEvent()` löst es synchron aus und gibt `false` zurück, falls ein Listener `preventDefault()` aufgerufen hat. Ohne `bubbles: true` erreicht das Ereignis keine Eltern-Listener; so entkoppelt man Komponenten.',
    syntax: 'const ev = new CustomEvent("name", { detail: daten, bubbles: true });\nel.dispatchEvent(ev);',
    values: [['detail', 'Beliebige Nutzdaten'], ['bubbles', 'Ereignis steigt im DOM auf (Standard: false)'], ['cancelable', 'preventDefault() möglich (Standard: false)']],
    example: c('const karte = document.getElementById("karte");', 'document.body.addEventListener("karte:gewaehlt", (e) => {', '  console.log("Empfangen:", e.detail);', '});', 'karte.addEventListener("click", () => {', '  karte.dispatchEvent(new CustomEvent("karte:gewaehlt", {', '    detail: { id: 7, titel: "Hallo" },', '    bubbles: true', '  }));', '});'),
    demo: d('<div id="karte" class="box">Klick löst ein CustomEvent aus</div>'),
    keywords: ['eigenes event', 'custom event', 'dispatch', 'auslösen', 'detail', 'trigger'],
    related: ['addEventListener()', 'Bubbling & Capturing', 'Event-Objekt'], mdn: M + 'API/CustomEvent'
  }),
  E(EV, {
    name: 'DOMContentLoaded / load',
    desc: 'Ereignisse, die melden, wann Dokument bzw. alle Ressourcen geladen sind.',
    details: '`DOMContentLoaded` feuert, sobald das HTML vollständig geparst ist (ohne auf Bilder und Stylesheets zu warten), und ist meist der richtige Zeitpunkt für DOM-Zugriffe. `load` auf `window` feuert erst, wenn auch alle Ressourcen geladen sind. Skripte mit `defer` oder `type="module"` laufen bereits nach dem Parsen und brauchen oft keinen Listener; prüfen kann man das über `document.readyState`.',
    syntax: 'document.addEventListener("DOMContentLoaded", fn);\nwindow.addEventListener("load", fn);',
    values: [['DOMContentLoaded', 'HTML geparst'], ['load', 'Alle Ressourcen geladen'], ['document.readyState', '"loading" | "interactive" | "complete"']],
    example: c('console.log("readyState jetzt:", document.readyState);', 'document.addEventListener("DOMContentLoaded", () => {', '  console.log("DOMContentLoaded");', '  document.getElementById("status").textContent = "DOM bereit";', '});', 'window.addEventListener("load", () => {', '  console.log("load");', '  document.getElementById("status").textContent += " + alles geladen";', '});'),
    demo: d('<p id="status">Lade …</p>'),
    tip: 'Kommt das Skript später, ist das Ereignis eventuell schon vorbei. Dann `readyState` prüfen.',
    keywords: ['ready', 'geladen', 'onload', 'dom ready', 'readyState', 'init'],
    related: ['addEventListener()', 'Scroll & Resize'], mdn: M + 'API/Document/DOMContentLoaded_event'
  }),
  E(EV, {
    name: 'Maus-Events (click, dblclick, mouseenter …)',
    desc: 'Ereignisse für Klicks und Mausbewegungen auf Elementen.',
    details: '`click` feuert nach Drücken und Loslassen, auch bei Tastaturaktivierung von Buttons; `dblclick` bei Doppelklick, `contextmenu` bei Rechtsklick. `mouseenter` und `mouseleave` bubbeln nicht, `mouseover` und `mouseout` schon. Im Event-Objekt liefern `clientX/clientY`, `button` und Modifier wie `shiftKey` weitere Details; für Touch und Stift sind Pointer-Events besser geeignet.',
    syntax: 'el.addEventListener("click", (e) => { e.clientX; e.button; e.shiftKey; });',
    values: [['click', 'Klick (auch per Tastatur bei Buttons)'], ['dblclick', 'Doppelklick'], ['contextmenu', 'Rechtsklick/Kontextmenü'], ['mouseenter / mouseleave', 'Zeiger betritt/verlässt das Element, ohne Bubbling'], ['mouseover / mouseout', 'Wie oben, aber mit Bubbling'], ['mousemove', 'Zeiger bewegt sich'], ['mousedown / mouseup', 'Taste gedrückt/losgelassen']],
    example: c('const box = document.getElementById("box");', 'box.addEventListener("click", (e) => console.log("click", e.clientX, e.clientY, e.shiftKey ? "+Shift" : ""));', 'box.addEventListener("dblclick", () => console.log("dblclick"));', 'box.addEventListener("contextmenu", (e) => { e.preventDefault(); console.log("Rechtsklick"); });', 'box.addEventListener("mouseenter", () => box.classList.add("hit"));', 'box.addEventListener("mouseleave", () => box.classList.remove("hit"));'),
    demo: d('<div id="box" class="box" style="padding:20px">Klick, Doppelklick, Rechtsklick und Hover</div>'),
    keywords: ['maus', 'mouse', 'klick', 'hover', 'doppelklick', 'rechtsklick'],
    related: ['Pointer-Events', 'Event-Objekt', 'Bubbling & Capturing'], mdn: M + 'API/MouseEvent'
  }),
  E(EV, {
    name: 'Pointer-Events',
    desc: 'Einheitliche Ereignisse für Maus, Touch und Stift.',
    details: 'Pointer-Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) ersetzen separate Maus- und Touch-Handler. `e.pointerType` verrät das Gerät (`mouse`, `touch`, `pen`). Mit `setPointerCapture(e.pointerId)` bekommt ein Element alle weiteren Events der Eingabe auch außerhalb seines Bereichs, ideal für Ziehen. Für Touch-Gesten muss meist `touch-action: none` im CSS gesetzt werden.',
    syntax: 'el.addEventListener("pointerdown", (e) => el.setPointerCapture(e.pointerId));',
    values: [['pointerdown / pointerup', 'Aufsetzen/Loslassen'], ['pointermove', 'Bewegung'], ['pointercancel', 'Browser übernimmt die Geste (z. B. Scrollen)'], ['e.pointerType', '"mouse" | "touch" | "pen"'], ['setPointerCapture()', 'Alle Events an das Element binden']],
    example: c('const fl = document.getElementById("fl");', 'let aktiv = false;', 'fl.addEventListener("pointerdown", (e) => {', '  aktiv = true;', '  fl.setPointerCapture(e.pointerId);', '  console.log("down:", e.pointerType);', '});', 'fl.addEventListener("pointermove", (e) => {', '  if (!aktiv) return;', '  const r = fl.parentElement.getBoundingClientRect();', '  fl.style.left = Math.max(0, Math.min(r.width - 40, e.clientX - r.left - 20)) + "px";', '});', 'fl.addEventListener("pointerup", () => { aktiv = false; console.log("up"); });'),
    demo: d('<div class="box" style="position:relative;height:60px"><div id="fl" style="position:absolute;top:10px;left:10px;width:40px;height:40px;background:#b4367a;border-radius:6px;cursor:grab;touch-action:none"></div></div><small>Ziehe das Quadrat.</small>'),
    keywords: ['touch', 'stift', 'pen', 'drag', 'ziehen', 'pointer', 'gerätunabhängig'],
    related: ['Maus-Events (click, dblclick, mouseenter …)', 'Optionen (once, passive, signal)'], mdn: M + 'API/Pointer_events'
  }),
  E(EV, {
    name: 'Tastatur-Events (keydown, key, code)',
    desc: 'Ereignisse beim Drücken und Loslassen von Tasten.',
    details: '`keydown` feuert beim Drücken (bei gehaltener Taste wiederholt, erkennbar an `e.repeat`), `keyup` beim Loslassen. `e.key` liefert das erzeugte Zeichen bzw. den Namen (`"Enter"`, `"a"`, `"ArrowLeft"`) und hängt vom Tastaturlayout ab, `e.code` die physische Taste (`"KeyW"`). Für Spiel-Steuerung eignet sich `code`, für Kürzel und Eingaben `key`; `keypress` ist veraltet.',
    syntax: 'el.addEventListener("keydown", (e) => { e.key; e.code; e.ctrlKey; });',
    values: [['e.key', 'Zeichen/Name, layoutabhängig'], ['e.code', 'Physische Taste, layoutunabhängig'], ['e.repeat', 'true bei gehaltener Taste'], ['e.ctrlKey / shiftKey / altKey / metaKey', 'Modifier gedrückt'], ['e.isComposing', 'IME-Eingabe läuft']],
    example: c('const feld = document.getElementById("feld");', 'feld.addEventListener("keydown", (e) => {', '  console.log(`key=${e.key} code=${e.code} repeat=${e.repeat}`);', '  if (e.key === "Enter") console.log("Enter!");', '  if (e.ctrlKey && e.key.toLowerCase() === "s") {', '    e.preventDefault();', '    console.log("Strg+S abgefangen");', '  }', '});'),
    demo: d('<input id="feld" placeholder="Tippe hier …" size="24">'),
    tip: 'Auf `isComposing` prüfen, damit Enter bei Eingaben per IME nicht fälschlich auslöst.',
    keywords: ['tastatur', 'keyboard', 'taste', 'shortcut', 'tastenkürzel', 'keyup', 'keydown'],
    related: ['Formular-Events (input, change, submit)', 'preventDefault()', 'Event-Objekt'], mdn: M + 'API/KeyboardEvent'
  }),
  E(EV, {
    name: 'Formular-Events (input, change, submit)',
    desc: 'Ereignisse für Eingaben in Formularfeldern und das Absenden des Formulars.',
    details: '`input` feuert bei jeder Änderung des Werts (live), `change` erst beim Bestätigen, etwa beim Verlassen des Feldes oder bei Auswahländerungen. `submit` wird auf dem `<form>` ausgelöst, auch per Enter-Taste; dort mit `e.preventDefault()` das Neuladen verhindern und Daten per `new FormData(e.target)` lesen. Zusätzlich gibt es `reset` und `invalid` für die Validierung.',
    syntax: 'input.addEventListener("input", fn);\nform.addEventListener("submit", (e) => { e.preventDefault(); });',
    values: [['input', 'Bei jeder Wertänderung'], ['change', 'Bei Bestätigung/Verlassen'], ['submit', 'Formular wird abgesendet (am form)'], ['reset', 'Formular wird zurückgesetzt'], ['invalid', 'Validierung fehlgeschlagen']],
    example: c('const f = document.getElementById("f");', 'f.elements.name.addEventListener("input", (e) => console.log("input:", e.target.value));', 'f.elements.farbe.addEventListener("change", (e) => console.log("change:", e.target.value));', 'f.addEventListener("submit", (e) => {', '  e.preventDefault();', '  console.log("submit:", Object.fromEntries(new FormData(f)));', '});'),
    demo: d('<form id="f"><input name="name" required placeholder="Name"> <select name="farbe"><option>rot</option><option>grün</option><option>blau</option></select> <button>Senden</button></form>'),
    tip: '`submit` auf dem Formular abfangen, nicht `click` auf dem Button: So funktioniert auch Enter und die Browser-Validierung.',
    keywords: ['formular', 'eingabe', 'submit', 'change', 'input', 'validierung', 'form'],
    related: ['Formularwerte lesen (value, checked)', 'preventDefault()', 'Fokus-Events (focus, blur, focusin)'], mdn: M + 'API/HTMLFormElement/submit_event'
  }),
  E(EV, {
    name: 'Fokus-Events (focus, blur, focusin)',
    desc: 'Ereignisse, wenn ein Element den Tastaturfokus erhält oder verliert.',
    details: '`focus` und `blur` bubbeln nicht, daher eignen sie sich nicht für Event-Delegation. `focusin` und `focusout` sind die bubbelnden Varianten und funktionieren am Container. `e.relatedTarget` zeigt, woher der Fokus kam bzw. wohin er geht. Der Fokus lässt sich per `el.focus()` setzen, `:focus-within` in CSS kann viele Fälle ohne JavaScript lösen.',
    syntax: 'container.addEventListener("focusin", fn);   el.focus();   el.blur();',
    values: [['focus / blur', 'Kein Bubbling'], ['focusin / focusout', 'Mit Bubbling, für Delegation'], ['e.relatedTarget', 'Gegenstück beim Fokuswechsel']],
    example: c('const gruppe = document.getElementById("gruppe");', 'gruppe.addEventListener("focusin", (e) => {', '  gruppe.classList.add("hit");', '  console.log("focusin:", e.target.name);', '});', 'gruppe.addEventListener("focusout", (e) => {', '  if (!gruppe.contains(e.relatedTarget)) gruppe.classList.remove("hit");', '  console.log("focusout:", e.target.name);', '});'),
    demo: d('<div id="gruppe" class="box"><input name="vorname" placeholder="Vorname"> <input name="nachname" placeholder="Nachname"></div>'),
    keywords: ['fokus', 'focus', 'blur', 'focusout', 'tab', 'eingabefeld'],
    related: ['Event-Delegation', 'Formular-Events (input, change, submit)', 'Bubbling & Capturing'], mdn: M + 'API/Element/focusin_event'
  }),
  E(EV, {
    name: 'Scroll & Resize',
    desc: 'Ereignisse, die beim Scrollen und bei Größenänderungen des Fensters feuern.',
    details: '`scroll` feuert auf scrollbaren Elementen (und `window`) sehr oft und sollte nur leichtgewichtigen Code ausführen oder gedrosselt werden. `resize` gibt es nur auf `window`; für einzelne Elemente ist `ResizeObserver` geeigneter. Scroll-Listener am besten `passive` registrieren; die aktuelle Position steht in `scrollTop` bzw. `window.scrollY`.',
    syntax: 'el.addEventListener("scroll", fn, { passive: true });\nwindow.addEventListener("resize", fn);',
    values: [['el.scrollTop', 'Vertikale Scrollposition'], ['window.scrollY', 'Scrollposition der Seite'], ['window.innerWidth', 'Fensterbreite'], ['scrollHeight - clientHeight', 'Maximale Scrollstrecke']],
    example: c('const feld = document.getElementById("scroller");', 'const bar = document.getElementById("bar");', 'feld.addEventListener("scroll", () => {', '  const max = feld.scrollHeight - feld.clientHeight;', '  const prozent = Math.round(feld.scrollTop / max * 100);', '  bar.style.width = prozent + "%";', '  console.log("scrollTop:", Math.round(feld.scrollTop), "->", prozent + "%");', '}, { passive: true });', 'window.addEventListener("resize", () => console.log("Fensterbreite:", innerWidth));'),
    demo: d('<div style="height:6px;background:#ddd"><div id="bar" style="height:6px;width:0;background:#b4367a"></div></div><div id="scroller" style="height:70px;overflow:auto;border:1px solid #99b"><div style="height:300px;padding:4px">Scrolle in diesem Feld …</div></div>'),
    tip: 'Für „Element wird sichtbar“ ist `IntersectionObserver` effizienter als Scroll-Listener.',
    keywords: ['scroll', 'resize', 'fenstergröße', 'viewport', 'scrollposition'],
    related: ['Debounce & Throttle', 'getBoundingClientRect()', 'scrollIntoView()'], mdn: M + 'API/Element/scroll_event'
  }),
  E(EV, {
    name: 'Debounce & Throttle',
    desc: 'Begrenzt, wie oft eine Funktion bei schnellen Ereignisfolgen ausgeführt wird.',
    details: 'Debounce wartet, bis für eine bestimmte Zeit kein neues Ereignis mehr kam, und führt die Funktion dann einmal aus (z. B. Suche nach dem Tippen). Throttle führt sie höchstens einmal pro Zeitintervall aus (z. B. bei `scroll` oder `mousemove`). Beide sind Funktionen höherer Ordnung; Bibliotheken wie Lodash liefern fertige Versionen, eigene sind aber schnell geschrieben.',
    syntax: 'const gedrosselt = debounce(fn, 300);\nel.addEventListener("input", gedrosselt);',
    values: [['Debounce', 'Läuft einmal nach Ruhe von n ms'], ['Throttle', 'Läuft höchstens alle n ms'], ['clearTimeout', 'Setzt den Debounce-Timer zurück']],
    example: c('function debounce(fn, ms) {', '  let t;', '  return (...args) => {', '    clearTimeout(t);', '    t = setTimeout(() => fn(...args), ms);', '  };', '}', 'function throttle(fn, ms) {', '  let letzte = 0;', '  return (...args) => {', '    const jetzt = Date.now();', '    if (jetzt - letzte >= ms) { letzte = jetzt; fn(...args); }', '  };', '}', 'const feld = document.getElementById("feld");', 'feld.addEventListener("input", debounce((e) => console.log("debounce:", e.target.value), 400));', 'feld.addEventListener("input", throttle((e) => console.log("throttle:", e.target.value), 400));'),
    demo: d('<input id="feld" placeholder="Schnell tippen …" size="24">'),
    tip: 'Debounce für „Endergebnis“ (Suche), Throttle für „laufende Updates“ (Scroll, Drag).',
    keywords: ['entprellen', 'drosseln', 'performance', 'rate limit', 'lodash', 'verzögern'],
    related: ['Scroll & Resize', 'Formular-Events (input, change, submit)', 'addEventListener()'], mdn: 'https://developer.mozilla.org/de/docs/Web/API/Window/setTimeout'
  })
  );
})();
