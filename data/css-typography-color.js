window.CHEAT = window.CHEAT || [];
(function () {
  var BASE = 'https://developer.mozilla.org/de/docs/Web/CSS/';
  function add(group, name, o) {
    var e = { lang: 'css', group: group, name: name, mdn: BASE + name };
    for (var k in o) e[k] = o[k];
    window.CHEAT.push(e);
  }
  var T = 'Schrift & Text';
  var D = '<style>.d{font:15px/1.5 system-ui,sans-serif;padding:10px;background:#fff;color:#222}</style>';

  /* ===================== Schrift & Text ===================== */
  add(T, 'font-family', {
    desc: 'Legt die Schriftfamilie bzw. eine Liste von Ersatzschriften fest.',
    details: 'Die Liste wird von links nach rechts abgearbeitet; der Browser nimmt die erste installierte oder per `@font-face` geladene Schrift. Schriftnamen mit Leerzeichen gehören in Anführungszeichen, am Ende sollte immer eine generische Familie wie `sans-serif` stehen. Ohne passenden Fallback fällt der Browser auf die Standardschrift zurück.',
    syntax: 'font-family: <name>, <name>, <generisch>;',
    values: [
      ['serif', 'Schrift mit Serifen (z. B. Times)'],
      ['sans-serif', 'Serifenlose Schrift (z. B. Arial)'],
      ['monospace', 'Schrift mit fester Zeichenbreite'],
      ['cursive / fantasy', 'Handschrift- bzw. Zierschrift'],
      ['system-ui', 'Standardschrift des Betriebssystems'],
      ['ui-monospace, ui-serif …', 'Weitere System-Schriften']
    ],
    initial: 'abhängig vom Browser',
    inherited: true,
    example: 'body {\n  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;\n}\ncode {\n  font-family: ui-monospace, "Cascadia Code", Consolas, monospace;\n}',
    demo: D + '<div class="d"><p style="font-family:Georgia,serif">Georgia, serif – Hamburgefonts</p><p style="font-family:system-ui,sans-serif">system-ui, sans-serif – Hamburgefonts</p><p style="font-family:Consolas,monospace">Consolas, monospace – Hamburgefonts</p></div>',
    tip: 'Eigennamen mit Leerzeichen oder Ziffern immer in Anführungszeichen setzen, generische Familien (`serif`, `sans-serif`) niemals.',
    keywords: ['schriftart', 'schrift', 'font', 'typeface', 'fallback'],
    related: ['font', 'font-size', 'font-weight']
  });

  add(T, 'font-size', {
    desc: 'Legt die Schriftgröße fest.',
    details: 'Akzeptiert absolute Längen (`px`), relative Einheiten (`rem`, `em`, `%`) und Schlüsselwörter. `rem` skaliert mit der Basisschrift des Nutzers und ist für Barrierefreiheit meist die beste Wahl. `em` bezieht sich auf die Schrift des Elternelements und kann sich bei Verschachtelung aufschaukeln.',
    syntax: 'font-size: <länge> | <prozent> | <schlüsselwort>;',
    values: [
      ['16px', 'Absolute Größe in Pixeln'],
      ['1.25rem', 'Vielfaches der Root-Schriftgröße'],
      ['120%', 'Prozent der Elternschrift'],
      ['medium, large, small …', 'Schlüsselwörter (medium ≈ 16px)'],
      ['larger / smaller', 'Eine Stufe größer bzw. kleiner als das Elternelement'],
      ['clamp(1rem, 2vw, 2rem)', 'Fließend skalierend mit Ober- und Untergrenze']
    ],
    initial: 'medium',
    inherited: true,
    example: 'html { font-size: 100%; }\nh1 {\n  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);\n}\nsmall { font-size: 0.875rem; }',
    demo: D + '<div class="d"><span style="font-size:12px">12px</span> <span style="font-size:16px">16px</span> <span style="font-size:1.5rem">1.5rem</span> <span style="font-size:2rem">2rem</span></div>',
    tip: 'Die Root-Größe nicht in `px` fixieren, sonst werden Browsereinstellungen der Nutzer ignoriert.',
    keywords: ['schriftgröße', 'größe', 'textgröße', 'size', 'rem', 'em'],
    related: ['rem', 'em', 'line-height', 'font']
  });

  add(T, 'font-weight', {
    desc: 'Steuert die Strichstärke der Schrift (normal, fett, Zwischenstufen).',
    details: 'Zahlen von 1 bis 1000 sind erlaubt, üblich sind 100 bis 900 in Hunderterschritten. `bold` entspricht 700. Ob es eine Abstufung wirklich gibt, hängt von der Schrift ab; bei Variable Fonts sind beliebige Zwischenwerte möglich. Fehlt ein Schnitt, wählt der Browser den nächstliegenden oder erzeugt künstlich Fett (Faux Bold).',
    syntax: 'font-weight: <1–1000> | normal | bold | bolder | lighter;',
    values: [
      ['normal', '400'],
      ['bold', '700'],
      ['100 – 900', 'Numerische Stufen (Thin bis Black)'],
      ['bolder / lighter', 'Relativ zum Elternelement']
    ],
    initial: 'normal',
    inherited: true,
    example: 'h1 { font-weight: 800; }\nstrong { font-weight: 600; }\n.hinweis { font-weight: 300; }',
    demo: D + '<div class="d" style="font-size:18px"><div style="font-weight:100">100 Thin</div><div style="font-weight:300">300 Light</div><div style="font-weight:400">400 Normal</div><div style="font-weight:600">600 Semibold</div><div style="font-weight:700">700 Bold</div><div style="font-weight:900">900 Black</div></div>',
    tip: 'Viele Systemschriften kennen nur 400 und 700, dazwischen sieht man keinen Unterschied.',
    keywords: ['fett', 'bold', 'schriftstärke', 'strichstärke', 'weight'],
    related: ['font-style', 'font-variation-settings', 'font']
  });

  add(T, 'font-style', {
    desc: 'Wählt normale, kursive oder geneigte Schrift.',
    details: '`italic` nutzt – falls vorhanden – den echten Kursivschnitt der Schrift, `oblique` neigt die normale Schrift künstlich. Mit einem Winkel (`oblique 12deg`) lässt sich die Neigung bei Variable Fonts genau einstellen. Wird der Kursivschnitt nicht mitgeladen, synthetisiert der Browser eine schräge Variante.',
    syntax: 'font-style: normal | italic | oblique <winkel>?;',
    values: [
      ['normal', 'Aufrechte Schrift'],
      ['italic', 'Kursivschnitt der Schrift'],
      ['oblique', 'Schräggestellte Normalschrift'],
      ['oblique 10deg', 'Schrägstellung mit festem Winkel']
    ],
    initial: 'normal',
    inherited: true,
    example: 'em, i { font-style: italic; }\n.zitat { font-style: oblique 8deg; }\naddress { font-style: normal; }',
    demo: D + '<div class="d" style="font-size:18px"><p style="font-style:normal">normal</p><p style="font-style:italic">italic</p><p style="font-style:oblique 14deg">oblique 14deg</p></div>',
    tip: '`<address>` ist im Browser standardmäßig kursiv – oft will man das mit `normal` zurücknehmen.',
    keywords: ['kursiv', 'italic', 'schräg', 'oblique'],
    related: ['font-weight', 'font', 'font-variant']
  });

  add(T, 'font-variant', {
    desc: 'Schaltet typografische Varianten wie Kapitälchen oder Ligaturen ein.',
    details: 'Kurzschreibweise für `font-variant-caps`, `-numeric`, `-ligatures`, `-east-asian` und `-alternates`. Am häufigsten genutzt wird `small-caps` für Kapitälchen. Echte Kapitälchen gibt es nur, wenn die Schrift sie enthält; sonst skaliert der Browser Großbuchstaben künstlich herunter.',
    syntax: 'font-variant: normal | small-caps | <font-variant-…>;',
    values: [
      ['normal', 'Keine besonderen Varianten'],
      ['small-caps', 'Kapitälchen'],
      ['all-small-caps', 'Auch Großbuchstaben als Kapitälchen'],
      ['tabular-nums', 'Ziffern gleicher Breite (via font-variant-numeric)'],
      ['no-common-ligatures', 'Standardligaturen aus (via font-variant-ligatures)']
    ],
    initial: 'normal',
    inherited: true,
    example: '.marke { font-variant: small-caps; }\n.tabelle td {\n  font-variant-numeric: tabular-nums;\n}',
    demo: D + '<div class="d" style="font-size:20px"><p style="font-variant:normal">Cheat Sheet Typografie 0123</p><p style="font-variant:small-caps">Cheat Sheet Typografie 0123</p><p style="font-variant-numeric:tabular-nums">1111 / 8888 (tabular)</p></div>',
    keywords: ['kapitälchen', 'small caps', 'ligaturen', 'ziffern', 'tabular-nums'],
    related: ['font-feature-settings', 'text-transform', 'font']
  });

  add(T, 'font', {
    desc: 'Kurzschreibweise für Stil, Stärke, Größe, Zeilenhöhe und Schriftfamilie.',
    details: 'Reihenfolge: optional Stil, Variante und Stärke, dann Pflichtangabe `font-size` und danach `font-family`; die Zeilenhöhe folgt der Größe nach einem Schrägstrich. Nicht angegebene Werte werden auf ihren Anfangswert zurückgesetzt – das überschreibt oft unbeabsichtigt vorherige Einstellungen. Ohne Größe und Familie ist die Deklaration ungültig.',
    syntax: 'font: [style] [variant] [weight] size[/line-height] family;',
    values: [
      ['italic bold 1rem/1.5 serif', 'Stil, Stärke, Größe, Zeilenhöhe, Familie'],
      ['16px sans-serif', 'Minimal gültige Form'],
      ['system-ui', 'Systemschrift-Schlüsselwörter wie caption, menu, status-bar']
    ],
    initial: 'siehe Einzeleigenschaften',
    inherited: true,
    example: 'body {\n  font: 400 1rem/1.6 system-ui, sans-serif;\n}\nh1 {\n  font: italic 700 2.5rem/1.1 Georgia, serif;\n}',
    demo: D + '<div class="d"><p style="font:italic 700 1.4rem/1.2 Georgia,serif">Italic 700 1.4rem/1.2 Georgia</p><p style="font:400 .9rem/1.8 system-ui,sans-serif">400 .9rem/1.8 system-ui – Fließtext mit etwas mehr Zeilenabstand, damit man ihn sieht.</p></div>',
    tip: 'Setzt Schriftvariante, Streckung und Zeilenhöhe zurück – am besten ganz oben im Stylesheet nutzen.',
    keywords: ['kurzschreibweise', 'shorthand', 'schrift', 'typografie'],
    related: ['font-family', 'font-size', 'font-weight', 'line-height']
  });

  add(T, 'line-height', {
    desc: 'Legt die Zeilenhöhe bzw. den Zeilenabstand fest.',
    details: 'Eine einheitenlose Zahl (z. B. `1.5`) wird mit der Schriftgröße des jeweiligen Elements multipliziert und vererbt sich als Faktor – das ist die robusteste Variante. Mit Längen oder Prozenten wird dagegen der berechnete Wert vererbt, was bei Kindelementen mit anderer Schriftgröße zu Überlappungen führen kann. Für Fließtext sind 1.4 bis 1.7 üblich.',
    syntax: 'line-height: normal | <zahl> | <länge> | <prozent>;',
    values: [
      ['normal', 'Browserabhängig, ca. 1.2'],
      ['1.5', 'Faktor der eigenen Schriftgröße (empfohlen)'],
      ['24px', 'Feste Länge'],
      ['150%', 'Prozent der eigenen Schriftgröße (berechnet vererbt)']
    ],
    initial: 'normal',
    inherited: true,
    example: 'body { line-height: 1.6; }\nh1, h2 { line-height: 1.2; }\n.button { line-height: 1; }',
    demo: D + '<div class="d" style="display:flex;gap:12px"><p style="line-height:1;background:#eef;margin:0;width:50%">line-height: 1 – dicht gedrängter Text, der über mehrere Zeilen läuft und eng wirkt.</p><p style="line-height:1.8;background:#efe;margin:0;width:50%">line-height: 1.8 – luftiger Text, der über mehrere Zeilen läuft und gut lesbar ist.</p></div>',
    tip: 'Barrierefreiheit (WCAG): Für Fließtext mindestens 1.5 anstreben.',
    keywords: ['zeilenhöhe', 'zeilenabstand', 'leading', 'zeilen'],
    related: ['font', 'font-size', 'letter-spacing']
  });

  add(T, 'letter-spacing', {
    desc: 'Verändert den Abstand zwischen einzelnen Buchstaben.',
    details: 'Positive Werte spreizen den Text, negative rücken ihn zusammen. Am besten in `em` angeben, damit der Abstand mit der Schriftgröße skaliert. Für Großbuchstaben-Überschriften sind leicht positive Werte typisch; bei Fließtext sollte man kaum eingreifen, und bei Schriften mit Ligaturen wie in Arabisch niemals.',
    syntax: 'letter-spacing: normal | <länge>;',
    values: [
      ['normal', 'Standardabstand der Schrift'],
      ['0.05em', 'Leicht gespreizt'],
      ['-0.02em', 'Enger gesetzt'],
      ['2px', 'Fester Zusatzabstand']
    ],
    initial: 'normal',
    inherited: true,
    example: '.label {\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n}\nh1 { letter-spacing: -0.02em; }',
    demo: D + '<div class="d" style="font-size:18px"><p style="letter-spacing:-.05em">Enger (-0.05em)</p><p>Normal</p><p style="letter-spacing:.15em">Weiter (0.15em)</p><p style="letter-spacing:.2em;text-transform:uppercase;font-size:13px">Label</p></div>',
    keywords: ['buchstabenabstand', 'tracking', 'laufweite', 'spacing'],
    related: ['word-spacing', 'text-transform', 'line-height']
  });

  add(T, 'word-spacing', {
    desc: 'Verändert den Abstand zwischen Wörtern.',
    details: 'Der Wert wird zum normalen Wortabstand addiert, negative Werte sind möglich. Prozentwerte beziehen sich auf die Breite des Leerzeichens. In der Praxis wird die Eigenschaft selten benötigt, etwa für sehr breite Überschriften oder feines Typografie-Tuning.',
    syntax: 'word-spacing: normal | <länge> | <prozent>;',
    values: [
      ['normal', 'Standardwortabstand'],
      ['0.3em', 'Zusätzlicher Abstand'],
      ['-2px', 'Wörter rücken näher'],
      ['50%', 'Anteil der Leerzeichenbreite']
    ],
    initial: 'normal',
    inherited: true,
    example: '.luftig { word-spacing: 0.25em; }\n.kompakt { word-spacing: -0.1em; }',
    demo: D + '<div class="d" style="font-size:18px"><p style="word-spacing:-.15em">Wortabstand enger gesetzt</p><p>Wortabstand normal</p><p style="word-spacing:.6em">Wortabstand weiter gesetzt</p></div>',
    keywords: ['wortabstand', 'wörter', 'spacing'],
    related: ['letter-spacing', 'text-align', 'white-space']
  });

  add(T, 'text-align', {
    desc: 'Richtet Inline-Inhalte (Text) innerhalb eines Blocks horizontal aus.',
    details: 'Wirkt auf den Block-Container und richtet dessen Zeilen aus, nicht den Block selbst. `start` und `end` sind schreibrichtungsabhängig und deshalb robuster als `left` und `right`. Blocksatz (`justify`) ohne Silbentrennung kann hässliche Lücken erzeugen – dann `hyphens: auto` ergänzen.',
    syntax: 'text-align: start | end | left | right | center | justify | match-parent;',
    values: [
      ['start', 'Zum Textanfang hin (Standard)'],
      ['end', 'Zum Textende hin'],
      ['left / right', 'Fest links bzw. rechts'],
      ['center', 'Zentriert'],
      ['justify', 'Blocksatz'],
      ['match-parent', 'Wie das Elternelement, aber start/end aufgelöst']
    ],
    initial: 'start',
    inherited: true,
    example: '.zitat { text-align: center; }\n.artikel p {\n  text-align: justify;\n  hyphens: auto;\n}',
    demo: D + '<div class="d"><p style="text-align:left;background:#f4f4f4">links ausgerichteter Text</p><p style="text-align:center;background:#f4f4f4">zentrierter Text</p><p style="text-align:right;background:#f4f4f4">rechts ausgerichteter Text</p><p style="text-align:justify;background:#f4f4f4">Blocksatz verteilt Wörter so, dass jede Zeile bis zum Rand reicht, nur die letzte Zeile nicht – das sieht man bei mehreren Zeilen.</p></div>',
    tip: 'Um ein Block-Element selbst zu zentrieren, braucht man `margin-inline: auto`, nicht `text-align`.',
    keywords: ['ausrichten', 'zentrieren', 'blocksatz', 'linksbündig', 'align'],
    related: ['text-align-last', 'text-indent', 'hyphens']
  });

  add(T, 'text-align-last', {
    desc: 'Richtet die letzte Zeile eines Blocks (oder vor einem erzwungenen Umbruch) aus.',
    details: 'Nützlich im Zusammenspiel mit `text-align: justify`: Normalerweise bleibt die letzte Zeile linksbündig, mit `text-align-last` lässt sie sich zentrieren oder ebenfalls strecken. Der Wert `auto` folgt `text-align`. Die Eigenschaft wird auch bei Zeilen angewendet, die direkt vor einem `<br>` enden.',
    syntax: 'text-align-last: auto | start | end | left | right | center | justify;',
    values: [
      ['auto', 'Wie text-align (Standard)'],
      ['center', 'Letzte Zeile zentriert'],
      ['justify', 'Letzte Zeile ebenfalls im Blocksatz'],
      ['right', 'Letzte Zeile rechtsbündig']
    ],
    initial: 'auto',
    inherited: true,
    example: 'p {\n  text-align: justify;\n  text-align-last: center;\n}',
    demo: D + '<div class="d"><p style="text-align:justify;text-align-last:center;background:#f4f4f4">Blocksatz mit zentrierter letzter Zeile: Dieser Text ist lang genug, um mehrere Zeilen zu füllen und das Ergebnis zu zeigen.</p></div>',
    keywords: ['letzte zeile', 'blocksatz', 'justify'],
    related: ['text-align', 'text-indent']
  });

  add(T, 'text-indent', {
    desc: 'Rückt die erste Zeile eines Textblocks ein.',
    details: 'Erlaubt Längen und Prozentwerte (bezogen auf die Breite des Blocks). Negative Werte erzeugen einen hängenden Einzug, wofür meist zusätzlich ein `padding-left` nötig ist. Mit `hanging` wird stattdessen alles außer der ersten Zeile eingerückt, und `each-line` wirkt auch nach harten Umbrüchen.',
    syntax: 'text-indent: <länge> | <prozent> [hanging] [each-line];',
    values: [
      ['2em', 'Erste Zeile um 2 Zeichenbreiten eingerückt'],
      ['-1em', 'Hängender Einzug (mit padding-left kombinieren)'],
      ['10%', 'Prozent der Blockbreite'],
      ['hanging', 'Kehrt die Wirkung um: alle anderen Zeilen eingerückt'],
      ['each-line', 'Auch nach erzwungenen Umbrüchen']
    ],
    initial: '0',
    inherited: true,
    example: 'p + p { text-indent: 1.5em; }\n.literatur li {\n  padding-left: 2em;\n  text-indent: -2em;\n}',
    demo: D + '<div class="d"><p style="text-indent:2em;margin:0 0 8px">Erste Zeile eingerückt: Dieser Absatz läuft über mehrere Zeilen, damit man den Einzug erkennt, der nur die erste Zeile betrifft.</p><p style="padding-left:2em;text-indent:-2em;margin:0">Hängender Einzug: Die erste Zeile beginnt links, alle weiteren Zeilen sind eingerückt, wie in Literaturlisten üblich.</p></div>',
    keywords: ['einzug', 'einrücken', 'erste zeile', 'indent'],
    related: ['text-align', 'padding', 'white-space']
  });

  add(T, 'text-transform', {
    desc: 'Wandelt die Darstellung von Text in Groß- oder Kleinbuchstaben um.',
    details: 'Ändert nur die Darstellung, nicht den Inhalt im DOM; Screenreader und Kopieren geben den Originaltext wieder. `capitalize` setzt den ersten Buchstaben jedes Wortes groß, erkennt aber keine Grammatikregeln. Lokale Besonderheiten (z. B. türkisches i) werden über das `lang`-Attribut berücksichtigt.',
    syntax: 'text-transform: none | uppercase | lowercase | capitalize | full-width;',
    values: [
      ['none', 'Keine Umwandlung'],
      ['uppercase', 'ALLES GROSS'],
      ['lowercase', 'alles klein'],
      ['capitalize', 'Jedes Wort Mit Großbuchstaben'],
      ['full-width', 'Zeichen in Vollbreite (ostasiatisch)']
    ],
    initial: 'none',
    inherited: true,
    example: '.button { text-transform: uppercase; }\n.name { text-transform: capitalize; }',
    demo: D + '<div class="d" style="font-size:17px"><p style="text-transform:none">none: Hallo Welt</p><p style="text-transform:uppercase">uppercase: Hallo Welt</p><p style="text-transform:lowercase">lowercase: Hallo Welt</p><p style="text-transform:capitalize">capitalize: hallo schöne welt</p></div>',
    tip: 'Für das deutsche „ß“ gilt: `uppercase` macht daraus „SS“.',
    keywords: ['großbuchstaben', 'kleinbuchstaben', 'versalien', 'uppercase', 'capitalize'],
    related: ['font-variant', 'letter-spacing']
  });

  add(T, 'text-decoration', {
    desc: 'Kurzschreibweise für Linie, Farbe, Stil und Stärke der Textdekoration.',
    details: 'Fasst `text-decoration-line`, `-color`, `-style` und `-thickness` zusammen. Typisch ist `none` zum Entfernen der Link-Unterstreichung; dabei sollte der Link anders erkennbar bleiben. Die Dekoration wird über alle Kinder gezeichnet und lässt sich in Kindelementen nicht wieder abschalten.',
    syntax: 'text-decoration: <line> <style> <color> <thickness>;',
    values: [
      ['none', 'Keine Dekoration'],
      ['underline', 'Unterstrichen'],
      ['overline', 'Überstrichen'],
      ['line-through', 'Durchgestrichen'],
      ['underline wavy red', 'Rote Wellenlinie (z. B. Fehlermarkierung)']
    ],
    initial: 'none',
    inherited: false,
    example: 'a { text-decoration: none; }\na:hover { text-decoration: underline; }\ndel { text-decoration: line-through #c00; }',
    demo: D + '<div class="d" style="font-size:18px"><p style="text-decoration:underline">underline</p><p style="text-decoration:line-through">line-through</p><p style="text-decoration:overline">overline</p><p style="text-decoration:underline wavy #d33">underline wavy rot</p><p style="text-decoration:underline dotted #07c 3px">underline dotted blau 3px</p></div>',
    tip: 'Die Eigenschaft wird nicht vererbt, wirkt aber optisch auf alle Nachfahren des Elements.',
    keywords: ['unterstrichen', 'durchgestrichen', 'underline', 'line-through', 'link'],
    related: ['text-decoration-line', 'text-decoration-color', 'text-decoration-style', 'text-underline-offset']
  });

  add(T, 'text-decoration-line', {
    desc: 'Bestimmt, welche Linien (unten, oben, durch) gezeichnet werden.',
    details: 'Mehrere Werte lassen sich kombinieren, z. B. `underline overline`. Mit `none` wird die Dekoration entfernt. Eigenständig ist die Eigenschaft nützlich, wenn nur die Linienart geändert werden soll, ohne Farbe und Stil zu überschreiben.',
    syntax: 'text-decoration-line: none | underline | overline | line-through;',
    values: [
      ['none', 'Keine Linie'],
      ['underline', 'Unterstrich'],
      ['overline', 'Oberstrich'],
      ['line-through', 'Durchstreichung'],
      ['underline overline', 'Kombination mehrerer Linien']
    ],
    initial: 'none',
    inherited: false,
    example: '.preis-alt { text-decoration-line: line-through; }\n.sprung { text-decoration-line: underline overline; }',
    demo: D + '<div class="d" style="font-size:18px"><p style="text-decoration-line:underline">underline</p><p style="text-decoration-line:underline overline">underline overline</p><p style="text-decoration-line:line-through">line-through</p></div>',
    keywords: ['linie', 'unterstreichen', 'durchstreichen'],
    related: ['text-decoration', 'text-decoration-style', 'text-decoration-color']
  });

  add(T, 'text-decoration-color', {
    desc: 'Legt die Farbe der Dekorationslinie fest.',
    details: 'Standardmäßig übernimmt die Linie die Textfarbe (`currentcolor`). Mit einer eigenen Farbe lassen sich Unterstreichungen dezent oder auffällig gestalten. Wirksam ist die Farbe nur, wenn auch eine Linie via `text-decoration-line` aktiv ist.',
    syntax: 'text-decoration-color: <farbe>;',
    values: [
      ['currentcolor', 'Textfarbe (Standard)'],
      ['#e63946', 'Beliebige Farbe']
    ],
    initial: 'currentcolor',
    inherited: false,
    example: 'a {\n  text-decoration: underline;\n  text-decoration-color: rgb(0 0 0 / 0.3);\n}\na:hover { text-decoration-color: currentcolor; }',
    demo: D + '<div class="d" style="font-size:20px"><p style="text-decoration:underline;text-decoration-color:#e63946;text-decoration-thickness:3px">Rote Unterstreichung</p><p style="text-decoration:underline;text-decoration-color:#2a9d8f;text-decoration-thickness:3px">Grüne Unterstreichung</p></div>',
    keywords: ['linienfarbe', 'unterstreichung farbe'],
    related: ['text-decoration', 'text-decoration-line', 'color']
  });

  add(T, 'text-decoration-style', {
    desc: 'Bestimmt den Linienstil: durchgezogen, doppelt, gepunktet, gestrichelt oder wellig.',
    details: 'Praktisch für Rechtschreibfehler-Markierungen (`wavy`) oder dezente Link-Unterstreichungen (`dotted`). Wirkt nur zusammen mit einer aktiven Dekorationslinie. Für `wavy` hängt die Darstellung der Wellenform vom Browser ab.',
    syntax: 'text-decoration-style: solid | double | dotted | dashed | wavy;',
    values: [
      ['solid', 'Durchgezogen (Standard)'],
      ['double', 'Doppelt'],
      ['dotted', 'Gepunktet'],
      ['dashed', 'Gestrichelt'],
      ['wavy', 'Wellenlinie']
    ],
    initial: 'solid',
    inherited: false,
    example: 'abbr[title] {\n  text-decoration: underline;\n  text-decoration-style: dotted;\n}\n.fehler {\n  text-decoration: underline wavy red;\n}',
    demo: D + '<div class="d" style="font-size:18px;text-decoration-line:underline"><p style="text-decoration-style:solid">solid</p><p style="text-decoration-style:double">double</p><p style="text-decoration-style:dotted">dotted</p><p style="text-decoration-style:dashed">dashed</p><p style="text-decoration-style:wavy">wavy</p></div>',
    keywords: ['wellenlinie', 'gepunktet', 'gestrichelt', 'wavy'],
    related: ['text-decoration', 'text-decoration-line', 'text-decoration-thickness']
  });

  add(T, 'text-decoration-thickness', {
    desc: 'Legt die Dicke der Dekorationslinie fest.',
    details: 'Mit `from-font` nutzt der Browser die in der Schrift hinterlegte Stärke, `auto` überlässt die Wahl dem Browser. Längen in `px` oder `em` geben volle Kontrolle; `em` skaliert mit der Schriftgröße. Besonders hübsch zusammen mit `text-underline-offset`.',
    syntax: 'text-decoration-thickness: auto | from-font | <länge> | <prozent>;',
    values: [
      ['auto', 'Browser entscheidet (Standard)'],
      ['from-font', 'Stärke aus der Schriftdatei'],
      ['2px', 'Feste Dicke'],
      ['0.1em', 'Relativ zur Schriftgröße']
    ],
    initial: 'auto',
    inherited: false,
    example: 'a {\n  text-decoration-thickness: 0.1em;\n  text-underline-offset: 0.2em;\n}',
    demo: D + '<div class="d" style="font-size:20px;text-decoration-line:underline"><p style="text-decoration-thickness:1px">1px</p><p style="text-decoration-thickness:3px">3px</p><p style="text-decoration-thickness:.2em;text-decoration-color:#b4367a">0.2em farbig</p></div>',
    keywords: ['linienstärke', 'dicke', 'unterstreichung'],
    related: ['text-decoration', 'text-underline-offset', 'text-decoration-color']
  });

  add(T, 'text-underline-offset', {
    desc: 'Verschiebt die Unterstreichung vom Text weg.',
    details: 'Ein größerer Abstand verhindert, dass die Linie Unterlängen (g, j, p) schneidet, und wirkt moderner. Gilt nur für `underline`, nicht für Über- oder Durchstreichung. Werte in `em` skalieren mit der Schrift mit.',
    syntax: 'text-underline-offset: auto | <länge> | <prozent>;',
    values: [
      ['auto', 'Browserstandard'],
      ['4px', 'Fester Abstand'],
      ['0.25em', 'Relativ zur Schriftgröße']
    ],
    initial: 'auto',
    inherited: true,
    example: 'a {\n  text-decoration: underline;\n  text-underline-offset: 0.25em;\n}',
    demo: D + '<div class="d" style="font-size:22px;text-decoration:underline"><p>Auto: gjpqy</p><p style="text-underline-offset:6px">Offset 6px: gjpqy</p><p style="text-underline-offset:.3em;text-decoration-thickness:2px">Offset 0.3em: gjpqy</p></div>',
    keywords: ['abstand unterstreichung', 'underline offset'],
    related: ['text-decoration-thickness', 'text-decoration', 'text-decoration-skip-ink']
  });

  add(T, 'text-shadow', {
    desc: 'Fügt dem Text einen oder mehrere Schatten hinzu.',
    details: 'Werte: horizontaler Versatz, vertikaler Versatz, optional Weichzeichnung und Farbe. Mehrere Schatten werden mit Komma getrennt und von oben nach unten gestapelt. Ein Schatten mit Radius 0 erzeugt harte Kanten, mehrere gleichfarbige Schatten ergeben Konturen oder Glüheffekte. Schatten sollten die Lesbarkeit nicht verschlechtern.',
    syntax: 'text-shadow: <x> <y> <blur>? <farbe>, …;',
    values: [
      ['none', 'Kein Schatten'],
      ['2px 2px 4px #0006', 'Weicher Schatten nach rechts unten'],
      ['0 0 8px #0af', 'Leuchteffekt ohne Versatz'],
      ['1px 1px 0 #fff, -1px -1px 0 #000', 'Mehrere Schatten']
    ],
    initial: 'none',
    inherited: true,
    example: '.hero h1 {\n  color: white;\n  text-shadow: 0 2px 8px rgb(0 0 0 / 0.5);\n}\n.neon {\n  text-shadow: 0 0 6px #0ff, 0 0 18px #0ff;\n}',
    demo: D + '<div class="d" style="font-size:28px;font-weight:700"><p style="text-shadow:2px 2px 4px rgba(0,0,0,.4)">Weicher Schatten</p><p style="background:#111;color:#0ff;padding:8px;text-shadow:0 0 6px #0ff,0 0 18px #0ff">Neon-Glühen</p><p style="color:#fff;background:#b4367a;padding:8px;text-shadow:3px 3px 0 #000">Harter Schatten</p></div>',
    keywords: ['schatten', 'glow', 'leuchten', 'shadow', 'kontur'],
    related: ['box-shadow', 'color', 'filter']
  });

  add(T, 'text-overflow', {
    desc: 'Legt fest, wie überlaufender Text dargestellt wird (z. B. mit Auslassungspunkten).',
    details: '`ellipsis` ersetzt den abgeschnittenen Rest durch „…“, funktioniert aber nur, wenn das Element `overflow` ungleich `visible` hat und der Text nicht umbricht (`white-space: nowrap`). Typisches Dreiergespann für einzeilige Kürzung. Mehrzeilig braucht man `line-clamp`.',
    syntax: 'text-overflow: clip | ellipsis | <zeichenkette>;',
    values: [
      ['clip', 'Hart abschneiden (Standard)'],
      ['ellipsis', 'Mit „…“ abkürzen'],
      ['"[…]"', 'Eigene Zeichenfolge (eingeschränkte Unterstützung)']
    ],
    initial: 'clip',
    inherited: false,
    example: '.titel {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 20rem;\n}',
    demo: D + '<div class="d"><p style="width:200px;white-space:nowrap;overflow:hidden;text-overflow:clip;background:#eef">clip: Dieser lange Text wird abgeschnitten</p><p style="width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#efe">ellipsis: Dieser lange Text wird gekürzt</p></div>',
    tip: 'Ohne `overflow: hidden` und `white-space: nowrap` passiert nichts.',
    keywords: ['ellipsis', 'abschneiden', 'drei punkte', 'kürzen', 'truncate'],
    related: ['white-space', 'overflow', 'line-clamp']
  });

  add(T, 'white-space', {
    desc: 'Steuert den Umgang mit Leerraum und Zeilenumbrüchen im Text.',
    details: 'Bestimmt, ob Leerzeichen zusammengefasst und ob Zeilen automatisch umbrochen werden. `nowrap` verhindert Umbrüche, `pre` übernimmt den Text wie geschrieben (wie `<pre>`), `pre-wrap` erhält Leerraum, bricht aber bei Platzmangel um. Seit neueren Spezifikationen ist `white-space` auch Kurzform für `white-space-collapse` und `text-wrap-mode`.',
    syntax: 'white-space: normal | nowrap | pre | pre-wrap | pre-line | break-spaces;',
    values: [
      ['normal', 'Leerraum zusammenfassen, Umbruch erlaubt (Standard)'],
      ['nowrap', 'Zusammenfassen, kein Umbruch'],
      ['pre', 'Leerraum und Umbrüche erhalten, kein Umbruch'],
      ['pre-wrap', 'Leerraum erhalten, Umbruch erlaubt'],
      ['pre-line', 'Umbrüche erhalten, Leerzeichen zusammenfassen'],
      ['break-spaces', 'Wie pre-wrap, Leerzeichen am Zeilenende bleiben umbruchfähig']
    ],
    initial: 'normal',
    inherited: true,
    example: '.badge { white-space: nowrap; }\n.log {\n  white-space: pre-wrap;\n  font-family: monospace;\n}',
    demo: D + '<div class="d" style="font-size:14px"><div style="width:230px;background:#eef;margin-bottom:6px;white-space:normal">normal:   viele   Leerzeichen und ein langer Text mit Umbruch</div><div style="width:230px;background:#efe;margin-bottom:6px;white-space:nowrap;overflow:hidden">nowrap: ein langer Text ohne Umbruch</div><div style="width:230px;background:#fee;white-space:pre-wrap">pre-wrap:   Leerzeichen\nund Umbrüche bleiben</div></div>',
    keywords: ['umbruch', 'nowrap', 'leerzeichen', 'pre', 'zeilenumbruch'],
    related: ['text-wrap', 'overflow-wrap', 'word-break', 'text-overflow']
  });

  add(T, 'word-break', {
    desc: 'Legt fest, ob Wörter an beliebiger Stelle umbrochen werden dürfen.',
    details: '`break-all` erlaubt Umbruch zwischen beliebigen Zeichen, nützlich für CJK-Text oder sehr lange Zeichenketten. `keep-all` verhindert Umbrüche in CJK-Text. Der Wert `break-word` ist veraltet; heute nimmt man stattdessen `overflow-wrap: anywhere`. Für normale Texte reicht meist `overflow-wrap`.',
    syntax: 'word-break: normal | break-all | keep-all | break-word;',
    values: [
      ['normal', 'Standardregeln der Schrift'],
      ['break-all', 'Umbruch zwischen beliebigen Zeichen'],
      ['keep-all', 'Kein Umbruch bei CJK-Text'],
      ['break-word', 'Veraltet, wirkt wie overflow-wrap: anywhere']
    ],
    initial: 'normal',
    inherited: true,
    example: '.url {\n  word-break: break-all;\n}',
    demo: D + '<div class="d" style="font-size:14px"><div style="width:180px;background:#eef;margin-bottom:6px;word-break:normal;overflow:hidden">normal: Donaudampfschifffahrtsgesellschaft</div><div style="width:180px;background:#efe;word-break:break-all">break-all: Donaudampfschifffahrtsgesellschaft</div></div>',
    keywords: ['umbrechen', 'lange wörter', 'break-all'],
    related: ['overflow-wrap', 'hyphens', 'white-space']
  });

  add(T, 'overflow-wrap', {
    desc: 'Erlaubt, zu lange Wörter zu umbrechen, damit sie nicht überlaufen.',
    details: 'Mit `break-word` wird ein Wort nur dann umbrochen, wenn es nicht in die Zeile passt. `anywhere` verhält sich ähnlich, beeinflusst aber zusätzlich die Berechnung der minimalen Inhaltsbreite, was in Flex- und Grid-Layouts wichtig ist. Der ältere Name lautet `word-wrap`.',
    syntax: 'overflow-wrap: normal | break-word | anywhere;',
    values: [
      ['normal', 'Nur an erlaubten Stellen umbrechen'],
      ['break-word', 'Notfalls mitten im Wort umbrechen'],
      ['anywhere', 'Wie break-word, senkt aber auch die min-content-Breite']
    ],
    initial: 'normal',
    inherited: true,
    example: '.kommentar {\n  overflow-wrap: break-word;\n}\n.flex-item {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}',
    demo: D + '<div class="d" style="font-size:14px"><div style="width:180px;background:#eef;margin-bottom:6px;overflow:hidden">normal: Donaudampfschifffahrtsgesellschaft</div><div style="width:180px;background:#efe;overflow-wrap:break-word">break-word: Donaudampfschifffahrtsgesellschaft</div></div>',
    tip: 'Lange URLs in Flex-Items brauchen oft zusätzlich `min-width: 0`.',
    keywords: ['word-wrap', 'umbrechen', 'überlaufen', 'lange wörter'],
    related: ['word-break', 'hyphens', 'white-space']
  });

  add(T, 'hyphens', {
    desc: 'Steuert die automatische Silbentrennung.',
    details: 'Für `auto` muss die Sprache per `lang`-Attribut (z. B. `<html lang="de">`) gesetzt sein, sonst trennt der Browser nicht. `manual` trennt nur an weichen Trennstellen (`&shy;`) oder harten Bindestrichen. Besonders sinnvoll bei schmalen Spalten und Blocksatz.',
    syntax: 'hyphens: none | manual | auto;',
    values: [
      ['manual', 'Nur an &shy; (Standard)'],
      ['auto', 'Browser trennt automatisch'],
      ['none', 'Nie trennen, auch nicht an &shy;']
    ],
    initial: 'manual',
    inherited: true,
    example: 'html { hyphenate-limit-chars: 6 3 3; }\np {\n  hyphens: auto;\n}',
    demo: D + '<div class="d" lang="de" style="font-size:15px"><p style="width:150px;background:#eef;hyphens:manual;margin:0 0 6px">manual: Donaudampfschifffahrtsgesellschaft ist lang.</p><p style="width:150px;background:#efe;hyphens:auto;margin:0">auto: Donaudampfschifffahrtsgesellschaft ist lang.</p></div>',
    tip: 'Ohne `lang="de"` am HTML-Element funktioniert `hyphens: auto` nicht.',
    keywords: ['silbentrennung', 'trennen', 'bindestrich', 'shy'],
    related: ['text-align', 'overflow-wrap', 'word-break']
  });

  add(T, 'text-wrap', {
    desc: 'Steuert den Umbruchalgorithmus: balanciert, hübsch oder kein Umbruch.',
    details: '`balance` verteilt Zeilen gleichmäßig, ideal für kurze Überschriften (Browser begrenzen das auf wenige Zeilen). `pretty` vermeidet einzelne Witwenwörter in der letzten Zeile von Absätzen. `nowrap` verhindert Umbrüche, `wrap` ist der Standard. Kurzform für `text-wrap-mode` und `text-wrap-style`.',
    syntax: 'text-wrap: wrap | nowrap | balance | pretty | stable;',
    values: [
      ['wrap', 'Normaler Umbruch (Standard)'],
      ['nowrap', 'Kein Umbruch'],
      ['balance', 'Zeilen gleichmäßig lang'],
      ['pretty', 'Vermeidet einzelne Wörter in der letzten Zeile'],
      ['stable', 'Umbruch bleibt beim Bearbeiten stabil']
    ],
    initial: 'wrap',
    inherited: true,
    example: 'h1, h2 { text-wrap: balance; }\np { text-wrap: pretty; }',
    demo: D + '<div class="d"><h3 style="width:230px;background:#eef;margin:0 0 8px;text-wrap:wrap">wrap: Eine längere Überschrift mit mehreren Wörtern</h3><h3 style="width:230px;background:#efe;margin:0;text-wrap:balance">balance: Eine längere Überschrift mit mehreren Wörtern</h3></div>',
    keywords: ['balance', 'pretty', 'witwe', 'überschrift', 'umbruch'],
    related: ['white-space', 'word-break', 'overflow-wrap']
  });

  add(T, 'line-clamp', {
    desc: 'Kürzt Text nach einer festen Zeilenzahl, meist mit Auslassungspunkten.',
    details: 'Das verbreitete Muster nutzt die Prefix-Variante: `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;`. Es funktioniert in allen gängigen Browsern. Die unprefixte Standard-Eigenschaft `line-clamp` ist noch nicht überall verfügbar. Die Zeilenanzahl muss eine ganze Zahl sein.',
    syntax: '-webkit-line-clamp: <zahl>;  /* Standard: line-clamp: <zahl>; */',
    values: [
      ['none', 'Keine Begrenzung'],
      ['3', 'Nach drei Zeilen abschneiden'],
      ['-webkit-box', 'Nötiger display-Wert beim Prefix-Muster']
    ],
    initial: 'none',
    inherited: false,
    example: '.vorschau {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 3;\n  line-clamp: 3;\n  overflow: hidden;\n}',
    demo: D + '<div class="d"><p style="width:260px;background:#eef;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;line-clamp:3;overflow:hidden;margin:0">Dieser Text ist bewusst sehr lang und würde normalerweise über viele Zeilen laufen. Mit Zeilenbegrenzung auf drei Zeilen wird er danach sauber mit Auslassungspunkten abgeschnitten, was in Kartenlayouts sehr praktisch ist.</p></div>',
    tip: 'Alle drei Teile des Musters (display, orient, clamp) und `overflow: hidden` sind nötig.',
    keywords: ['webkit-line-clamp', 'zeilen begrenzen', 'mehrzeilig kürzen', 'ellipsis', 'truncate'],
    related: ['text-overflow', 'white-space', 'overflow']
  });

  add(T, 'font-feature-settings', {
    desc: 'Schaltet OpenType-Funktionen einer Schrift gezielt per Code ein oder aus.',
    details: 'Syntax: vierstelliger Feature-Tag in Anführungszeichen, optional gefolgt von `1`/`0` oder einem Wert, z. B. `"liga" 0` oder `"ss01"`. Welche Features existieren, hängt von der Schrift ab. Wo möglich sind die Eigenschaften `font-variant-*` vorzuziehen, da sie lesbarer sind und sich besser mit anderen Einstellungen vertragen.',
    syntax: 'font-feature-settings: normal | "<tag>" <wert>, …;',
    values: [
      ['normal', 'Standardverhalten'],
      ['"liga" 0', 'Ligaturen aus'],
      ['"tnum"', 'Tabellenziffern'],
      ['"smcp"', 'Kapitälchen'],
      ['"ss01"', 'Stilistisches Set 1']
    ],
    initial: 'normal',
    inherited: true,
    example: '.zahlen {\n  font-feature-settings: "tnum" 1, "zero" 1;\n}\n.code {\n  font-feature-settings: "liga" 0;\n}',
    demo: D + '<div class="d" style="font-size:20px"><p>Standard: 1111 0000 fi fl</p><p style="font-feature-settings:\'tnum\' 1">tnum: 1111 0000</p><p style="font-feature-settings:\'smcp\' 1">smcp: Kapitälchen Beispiel</p></div>',
    tip: 'Ob sich etwas ändert, hängt komplett von der gewählten Schrift ab.',
    keywords: ['opentype', 'ligaturen', 'features', 'tnum', 'liga'],
    related: ['font-variant', 'font-variation-settings', 'font-kerning']
  });

  add(T, 'font-variation-settings', {
    desc: 'Steuert Achsen von Variable Fonts direkt (z. B. wght, wdth, slnt).',
    details: 'Jede Achse wird mit ihrem vierstelligen Tag und einem Zahlenwert angegeben: `"wght" 650, "wdth" 90`. Registrierte Achsen sollten besser über Standardeigenschaften (`font-weight`, `font-stretch`, `font-style`) gesteuert werden; die Eigenschaft hier ist vor allem für eigene Achsen (Großbuchstabentags) gedacht. Sie überschreibt andere Angaben und wird nicht kaskadierend zusammengeführt.',
    syntax: 'font-variation-settings: normal | "<achse>" <zahl>, …;',
    values: [
      ['normal', 'Standardachsen'],
      ['"wght" 700', 'Gewicht'],
      ['"wdth" 75', 'Breite'],
      ['"slnt" -10', 'Neigung'],
      ['"opsz" 24', 'Optische Größe']
    ],
    initial: 'normal',
    inherited: true,
    example: '.variabel {\n  font-family: "Inter Variable", sans-serif;\n  font-variation-settings: "wght" 650, "slnt" -6;\n}',
    demo: D + '<div class="d" style="font-size:22px"><p style="font-family:system-ui,sans-serif;font-variation-settings:\'wght\' 300">Wght 300 (nur bei Variable Fonts sichtbar)</p><p style="font-family:system-ui,sans-serif;font-variation-settings:\'wght\' 800">Wght 800 (nur bei Variable Fonts sichtbar)</p></div>',
    tip: 'Klappt nur mit einer Variable Font; Systemschriften reagieren oft nicht.',
    keywords: ['variable fonts', 'achsen', 'wght', 'wdth', 'opsz'],
    related: ['font-feature-settings', 'font-weight', 'font-optical-sizing']
  });

  add(T, 'font-kerning', {
    desc: 'Schaltet das Kerning (Unterschneidung von Buchstabenpaaren) ein oder aus.',
    details: 'Kerning korrigiert den Abstand bestimmter Buchstabenpaare wie „AV“ oder „To“. `auto` überlässt dem Browser die Entscheidung (meist an), `none` schaltet es ab. Wird das Kerning bei sehr vielen Textstellen verwendet, kann das die Renderleistung beeinflussen; in der Praxis lässt man es an.',
    syntax: 'font-kerning: auto | normal | none;',
    values: [
      ['auto', 'Browser entscheidet (Standard)'],
      ['normal', 'Kerning an'],
      ['none', 'Kerning aus']
    ],
    initial: 'auto',
    inherited: true,
    example: 'h1 {\n  font-kerning: normal;\n}\n.mono { font-kerning: none; }',
    demo: D + '<div class="d" style="font-size:44px;font-family:Georgia,serif"><div style="font-kerning:normal">AVATAR To</div><div style="font-kerning:none">AVATAR To</div></div>',
    keywords: ['unterschneidung', 'kerning', 'buchstabenpaare'],
    related: ['letter-spacing', 'font-feature-settings', 'font-optical-sizing']
  });

  add(T, 'font-optical-sizing', {
    desc: 'Steuert, ob die Schrift ihr Aussehen an die Größe anpasst (optische Größe).',
    details: 'Greift nur bei Schriften mit `opsz`-Achse. `auto` (Standard) passt die Zeichnung automatisch an die Schriftgröße an: kleine Größen werden robuster, große feiner. Mit `none` wird diese Anpassung ausgeschaltet.',
    syntax: 'font-optical-sizing: auto | none;',
    values: [
      ['auto', 'Optische Größe folgt der Schriftgröße (Standard)'],
      ['none', 'Keine automatische Anpassung']
    ],
    initial: 'auto',
    inherited: true,
    example: 'body { font-optical-sizing: auto; }\n.fix { font-optical-sizing: none; }',
    demo: D + '<div class="d" style="font-size:18px"><p style="font-optical-sizing:auto">auto – Wirkung nur bei Schriften mit opsz-Achse</p><p style="font-optical-sizing:none">none – Wirkung nur bei Schriften mit opsz-Achse</p></div>',
    keywords: ['optische größe', 'opsz', 'variable fonts'],
    related: ['font-variation-settings', 'font-size', 'font-kerning']
  });

  add(T, 'tab-size', {
    desc: 'Legt die Breite von Tabulatorzeichen fest.',
    details: 'Eine Zahl gibt die Breite in Leerzeichen an, eine Länge direkt in Pixeln o. Ä. Wirkt nur, wenn Tabulatoren erhalten bleiben, also mit `white-space: pre`, `pre-wrap` oder in `<pre>`/`<textarea>`. Der Browserstandard von 8 ist für Code oft zu breit; 2 oder 4 sind üblich.',
    syntax: 'tab-size: <zahl> | <länge>;',
    values: [
      ['8', 'Standard: acht Leerzeichen'],
      ['2', 'Zwei Leerzeichen'],
      ['4', 'Vier Leerzeichen'],
      ['24px', 'Feste Länge']
    ],
    initial: '8',
    inherited: true,
    example: 'pre, code {\n  tab-size: 2;\n}',
    demo: D + '<div class="d" style="font:13px monospace"><pre style="tab-size:2;margin:0 0 8px;background:#eef">tab-size: 2\n\tEingerückt\n\t\tNoch tiefer</pre><pre style="tab-size:8;margin:0;background:#efe">tab-size: 8\n\tEingerückt\n\t\tNoch tiefer</pre></div>',
    keywords: ['tabulator', 'einrückung', 'code', 'tab'],
    related: ['white-space', 'font-family']
  });

  add(T, 'writing-mode', {
    desc: 'Legt die Schreib- und Blockrichtung fest (horizontal oder vertikal).',
    details: 'Mit `vertical-rl` und `vertical-lr` fließt Text von oben nach unten, wie in ostasiatischen Schriften, aber auch nützlich für gedrehte Beschriftungen. Die logischen Eigenschaften (`inline-size`, `margin-inline`) passen sich automatisch an. `sideways-rl/lr` ist erst teilweise unterstützt.',
    syntax: 'writing-mode: horizontal-tb | vertical-rl | vertical-lr;',
    values: [
      ['horizontal-tb', 'Horizontal, Zeilen von oben nach unten (Standard)'],
      ['vertical-rl', 'Vertikal, Zeilen von rechts nach links'],
      ['vertical-lr', 'Vertikal, Zeilen von links nach rechts']
    ],
    initial: 'horizontal-tb',
    inherited: true,
    example: '.seitenleiste-titel {\n  writing-mode: vertical-rl;\n  transform: rotate(180deg);\n}',
    demo: D + '<div class="d" style="display:flex;gap:16px;height:130px"><div style="writing-mode:vertical-rl;background:#eef;padding:6px">vertical-rl: Text läuft vertikal</div><div style="writing-mode:vertical-lr;background:#efe;padding:6px">vertical-lr: Text läuft vertikal</div><div style="background:#fee;padding:6px">horizontal-tb</div></div>',
    keywords: ['vertikal', 'senkrecht', 'schreibrichtung', 'vertical text'],
    related: ['direction', 'text-align', 'text-orientation']
  });

  add(T, 'direction', {
    desc: 'Setzt die Textrichtung (links-nach-rechts oder rechts-nach-links).',
    details: 'Für Sprachen wie Arabisch oder Hebräisch (`rtl`). Im HTML sollte stattdessen das Attribut `dir` genutzt werden, da die Richtung zur Dokumentstruktur gehört. Zusammen mit `unicode-bidi` steuert sie gemischte Textrichtungen.',
    syntax: 'direction: ltr | rtl;',
    values: [
      ['ltr', 'Links nach rechts (Standard)'],
      ['rtl', 'Rechts nach links']
    ],
    initial: 'ltr',
    inherited: true,
    example: '.arabisch {\n  direction: rtl;\n}',
    demo: D + '<div class="d"><p style="direction:ltr;background:#eef">ltr: Anfang links, Ende rechts.</p><p style="direction:rtl;background:#efe">rtl: Satzzeichen wandern an die andere Seite!</p></div>',
    tip: 'Im HTML lieber `dir="rtl"` verwenden statt CSS.',
    keywords: ['rtl', 'ltr', 'arabisch', 'hebräisch', 'textrichtung'],
    related: ['writing-mode', 'text-align']
  });

  add(T, 'quotes', {
    desc: 'Legt fest, welche Anführungszeichen für `<q>` und `content: open-quote` gelten.',
    details: 'Es werden Paare angegeben: äußere Zeichen und danach die der inneren Verschachtelungsebene. Die Zeichen erscheinen nur, wenn `content: open-quote / close-quote` genutzt wird (bei `<q>` bereits im Browserstil enthalten). Der Browser wählt standardmäßig sprachabhängig; für Deutsch also „…“ und ‚…‘.',
    syntax: 'quotes: auto | none | <öffnend> <schließend> [<innen-öffnend> <innen-schließend>];',
    values: [
      ['auto', 'Je nach Sprache (lang-Attribut)'],
      ['none', 'Keine Anführungszeichen'],
      ['"„" "“" "‚" "‘"', 'Deutsche Anführungszeichen'],
      ['"«" "»"', 'Französische Guillemets']
    ],
    initial: 'auto',
    inherited: true,
    example: 'q { quotes: "„" "“" "‚" "‘"; }\nblockquote::before {\n  content: open-quote;\n}\nblockquote::after {\n  content: close-quote;\n}',
    demo: D + '<div class="d" style="font-size:18px"><q style="quotes:\'„\' \'“\' \'‚\' \'‘\'">Deutsch <q>innen</q></q><br><q style="quotes:\'«\' \'»\'">Français</q><br><q style="quotes:\'“\' \'”\'">English</q></div>',
    keywords: ['anführungszeichen', 'zitat', 'q', 'blockquote', 'open-quote'],
    related: ['content', 'font-family']
  });

  /* ===================== Listen & Zähler ===================== */
  var L = 'Listen & Zähler';

  add(L, 'list-style', {
    desc: 'Kurzschreibweise für Aufzählungszeichen, Position und Bild von Listen.',
    details: 'Fasst `list-style-type`, `-position` und `-image` zusammen; die Reihenfolge ist frei. `list-style: none` entfernt Aufzählungszeichen und ist der Standard-Reset für Navigationen. Für semantisch relevante Listen sollte man die Listensemantik trotzdem erhalten (bei VoiceOver in Safari geht sie mit `none` verloren; `role="list"` hilft).',
    syntax: 'list-style: <type> <position> <image>;',
    values: [
      ['none', 'Keine Marker'],
      ['disc inside', 'Punkt innerhalb des Textflusses'],
      ['square outside', 'Quadrat außerhalb'],
      ['url(icon.svg)', 'Bild als Marker']
    ],
    initial: 'disc outside none',
    inherited: true,
    example: 'nav ul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\nul.check { list-style: square inside; }',
    demo: D + '<div class="d" style="display:flex;gap:30px"><ul style="list-style:disc outside"><li>disc outside</li><li>Zweiter Punkt</li></ul><ul style="list-style:square inside"><li>square inside</li><li>Zweiter Punkt</li></ul><ul style="list-style:none;padding:0"><li>none</li><li>Zweiter Punkt</li></ul></div>',
    keywords: ['aufzählung', 'bullet', 'liste', 'marker', 'none'],
    related: ['list-style-type', 'list-style-position', 'list-style-image', '::marker']
  });

  add(L, 'list-style-type', {
    desc: 'Legt die Art des Listenmarkers fest (Punkt, Zahl, Buchstabe …).',
    details: 'Bei `<ul>` ist der Standard `disc`, bei `<ol>` `decimal`. Neben vordefinierten Werten sind auch eigene Zeichenketten und `@counter-style`-Definitionen möglich. Mit `::marker` lassen sich Farbe und Größe des Markers getrennt vom Text gestalten.',
    syntax: 'list-style-type: disc | circle | square | decimal | lower-alpha | … | "<zeichen>" | none;',
    values: [
      ['disc / circle / square', 'Punkt, Kreis, Quadrat'],
      ['decimal', '1, 2, 3'],
      ['decimal-leading-zero', '01, 02, 03'],
      ['lower-alpha / upper-alpha', 'a, b, c bzw. A, B, C'],
      ['lower-roman / upper-roman', 'i, ii, iii bzw. I, II, III'],
      ['"✔ "', 'Eigene Zeichenkette'],
      ['none', 'Kein Marker']
    ],
    initial: 'disc',
    inherited: true,
    example: 'ol.kapitel { list-style-type: upper-roman; }\nul.check { list-style-type: "✔ "; }',
    demo: D + '<div class="d" style="display:flex;gap:26px"><ul style="list-style-type:square"><li>square</li><li>Zweiter</li></ul><ol style="list-style-type:upper-roman"><li>upper-roman</li><li>Zweiter</li></ol><ol style="list-style-type:lower-alpha"><li>lower-alpha</li><li>Zweiter</li></ol><ul style="list-style-type:\'✔ \'"><li>Eigenes Zeichen</li><li>Zweiter</li></ul></div>',
    keywords: ['aufzählungszeichen', 'nummerierung', 'listentyp', 'bullet'],
    related: ['list-style', '::marker', 'counter-reset']
  });

  add(L, 'list-style-position', {
    desc: 'Bestimmt, ob der Marker außerhalb oder innerhalb des Listeneintrags sitzt.',
    details: '`outside` setzt den Marker links neben den Textblock, sodass Folgezeilen sauber unter dem Text beginnen. `inside` setzt ihn in den Textfluss, dann laufen Folgezeilen unter den Marker. Standard ist `outside`.',
    syntax: 'list-style-position: outside | inside;',
    values: [
      ['outside', 'Marker außerhalb des Textblocks (Standard)'],
      ['inside', 'Marker innerhalb des Textflusses']
    ],
    initial: 'outside',
    inherited: true,
    example: 'li { list-style-position: inside; }',
    demo: D + '<div class="d" style="display:flex;gap:24px"><ul style="width:150px;list-style-position:outside;background:#eef"><li>outside: ein längerer Listenpunkt mit Umbruch</li></ul><ul style="width:150px;list-style-position:inside;background:#efe"><li>inside: ein längerer Listenpunkt mit Umbruch</li></ul></div>',
    keywords: ['marker position', 'inside', 'outside', 'einrückung liste'],
    related: ['list-style', 'list-style-type', 'padding']
  });

  add(L, 'list-style-image', {
    desc: 'Verwendet ein Bild als Listenmarker.',
    details: 'Akzeptiert `url()` oder einen Gradient. Das Bild lässt sich nicht skalieren oder genau positionieren; dafür ist ein `::before`-Pseudoelement oder `::marker` mit `content` flexibler. Das Bild wird in seiner natürlichen Größe angezeigt, bei SVG ohne Maße kann das riesig werden.',
    syntax: 'list-style-image: none | url(<bild>) | <gradient>;',
    values: [
      ['none', 'Kein Bild (Standard)'],
      ['url(punkt.svg)', 'Bilddatei als Marker'],
      ['linear-gradient(...)', 'Gradient als Marker']
    ],
    initial: 'none',
    inherited: true,
    example: 'ul.pfeile {\n  list-style-image: url("pfeil.svg");\n}\nul.verlauf {\n  list-style-image: linear-gradient(#b4367a, #5b8def);\n}',
    demo: D + '<div class="d"><ul style="list-style-image:url(&quot;data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2714%27 height=%2714%27%3E%3Ccircle cx=%277%27 cy=%277%27 r=%276%27 fill=%27%23b4367a%27/%3E%3C/svg%3E&quot;)"><li>Rosa Kreis als Marker</li><li>Zweiter Eintrag</li></ul></div>',
    keywords: ['marker bild', 'icon liste', 'url'],
    related: ['list-style', 'list-style-type', '::marker']
  });

  add(L, 'counter-reset', {
    desc: 'Erzeugt oder setzt einen CSS-Zähler zurück (auf einen Startwert).',
    details: 'Zähler werden zusammen mit `counter-increment` und `content: counter(name)` verwendet, etwa für automatische Kapitelnummern. Ohne Zahl wird auf 0 gesetzt. Mehrere Zähler lassen sich mit Leerzeichen auflisten. Die Eigenschaft `counter-set` setzt einen Wert, ohne einen neuen verschachtelten Zähler anzulegen.',
    syntax: 'counter-reset: <name> <startwert>?, …;',
    values: [
      ['none', 'Kein Zähler (Standard)'],
      ['kapitel', 'Zähler „kapitel“ auf 0'],
      ['kapitel 5', 'Startwert 5'],
      ['a 0 b 10', 'Mehrere Zähler']
    ],
    initial: 'none',
    inherited: false,
    example: 'body { counter-reset: kapitel; }\nh2::before {\n  counter-increment: kapitel;\n  content: counter(kapitel) ". ";\n}',
    demo: D + '<style>.z{counter-reset:k}.z h4{margin:6px 0}.z h4::before{counter-increment:k;content:counter(k) ". ";color:#b4367a}</style><div class="d z"><h4>Einleitung</h4><h4>Grundlagen</h4><h4>Zusammenfassung</h4></div>',
    keywords: ['zähler', 'nummerierung', 'counter', 'kapitel'],
    related: ['counter-increment', 'content', 'list-style-type']
  });

  add(L, 'counter-increment', {
    desc: 'Erhöht (oder verringert) einen CSS-Zähler bei jedem passenden Element.',
    details: 'Der Zähler muss zuvor mit `counter-reset` erzeugt werden (wird er vergessen, legt der Browser implizit einen an). Standardschritt ist 1; negative Werte zählen rückwärts. Ausgegeben wird der Wert mit `counter()` oder `counters()` in der Eigenschaft `content`. Tipp: `display: none` Elemente zählen nicht mit.',
    syntax: 'counter-increment: <name> <schritt>?, …;',
    values: [
      ['none', 'Keine Änderung (Standard)'],
      ['kapitel', 'Erhöht um 1'],
      ['kapitel 2', 'Erhöht um 2'],
      ['kapitel -1', 'Verringert um 1']
    ],
    initial: 'none',
    inherited: false,
    example: 'ol.verschachtelt { counter-reset: nr; }\nol.verschachtelt li {\n  counter-increment: nr;\n}\nol.verschachtelt li::before {\n  content: counters(nr, ".") " ";\n}',
    demo: D + '<style>.q{counter-reset:s}.q p{margin:4px 0}.q p::before{counter-increment:s 2;content:"Schritt " counter(s) ": ";font-weight:700}</style><div class="d q"><p>Erste Zeile</p><p>Zweite Zeile</p><p>Dritte Zeile</p></div>',
    keywords: ['zähler erhöhen', 'counter', 'nummerierung', 'inkrement'],
    related: ['counter-reset', 'content', 'list-style-type']
  });

  add(L, 'content', {
    desc: 'Erzeugt Inhalte in Pseudo-Elementen (::before, ::after) und ersetzt Elementinhalte.',
    details: 'Funktioniert vor allem mit `::before`/`::after`, die ohne `content` gar nicht erzeugt werden. Erlaubt sind Zeichenketten, `attr()`, `counter()`, `url()`, Anführungszeichen-Schlüsselwörter und Gradients. Generierter Inhalt ist nicht auswählbar und für Screenreader teils vorlesbar; wichtige Inhalte gehören deshalb ins HTML. Mit Alternativtext: `content: "★" / "Favorit"`.',
    syntax: 'content: normal | none | <string> | attr(<name>) | counter(<name>) | url(<bild>) | open-quote;',
    values: [
      ['""', 'Leerer String (für reine Deko-Boxen nötig)'],
      ['"→ "', 'Text oder Symbol'],
      ['attr(href)', 'Wert eines Attributs'],
      ['counter(name)', 'Wert eines CSS-Zählers'],
      ['open-quote / close-quote', 'Anführungszeichen laut quotes'],
      ['url(icon.svg)', 'Bild']
    ],
    initial: 'normal',
    inherited: false,
    example: 'a[href^="http"]::after {\n  content: " ↗";\n}\na::after {\n  content: " (" attr(href) ")";\n}\n.deko::before {\n  content: "";\n  display: block;\n  height: 4px;\n  background: currentcolor;\n}',
    demo: D + '<style>.c a::after{content:" ↗";color:#b4367a}.c .h::before{content:"";display:inline-block;width:10px;height:10px;border-radius:50%;background:#2a9d8f;margin-right:6px}.c .i::before{content:attr(data-label) ": ";font-weight:700}</style><div class="d c"><p><a href="#">Externer Link</a></p><p class="h">Mit Deko-Punkt</p><p class="i" data-label="Autor">Max Mustermann</p></div>',
    tip: 'Ohne `content` (auch nur `""`) wird ein Pseudo-Element gar nicht gerendert.',
    keywords: ['before', 'after', 'pseudo-element', 'attr', 'generierter inhalt'],
    related: ['quotes', 'counter-increment', 'counter-reset']
  });

  /* ===================== Farben & Hintergrund ===================== */
  var F = 'Farben & Hintergrund';

  add(F, 'color', {
    desc: 'Legt die Vordergrund- bzw. Textfarbe fest.',
    details: 'Die Farbe vererbt sich an Kindelemente und dient außerdem als Wert für `currentcolor`, das Rahmen, Schatten und SVGs automatisch mit der Textfarbe verknüpft. Auf ausreichenden Kontrast zum Hintergrund achten (WCAG: mindestens 4.5:1 für normalen Text).',
    syntax: 'color: <farbe>;',
    values: [
      ['red / tomato …', 'Benannte Farben'],
      ['#1a2b3c', 'Hexadezimal'],
      ['rgb(26 43 60)', 'RGB-Funktion'],
      ['hsl(210 40% 20%)', 'HSL-Funktion'],
      ['currentcolor', 'Aktuelle Textfarbe'],
      ['inherit', 'Vom Elternelement übernehmen']
    ],
    initial: 'abhängig vom Browser (meist schwarz)',
    inherited: true,
    example: 'body { color: #222; }\na { color: #0b5cd5; }\n.card { border: 1px solid; /* nutzt currentcolor */ }',
    demo: D + '<div class="d" style="font-size:18px;font-weight:600"><span style="color:#c0392b">rot</span> <span style="color:#2a9d8f">grün</span> <span style="color:#0b5cd5">blau</span> <span style="color:rgb(120 80 200)">violett</span></div>',
    tip: 'Mit `border: 1px solid` ohne Farbangabe wird automatisch die Textfarbe (`currentcolor`) verwendet.',
    keywords: ['textfarbe', 'schriftfarbe', 'vordergrund', 'currentcolor'],
    related: ['background-color', 'opacity', 'accent-color']
  });

  add(F, 'opacity', {
    desc: 'Legt die Deckkraft eines Elements samt Inhalt fest.',
    details: 'Werte von 0 (komplett durchsichtig) bis 1 (deckend); Prozentwerte funktionieren ebenfalls. Betroffen ist das ganze Element inklusive aller Kinder – diese können nicht „wieder deckend“ gemacht werden. Für eine transparente Hintergrundfarbe ohne transparenten Text besser `rgb()`/`hsl()` mit Alphakanal nutzen. Werte unter 1 erzeugen einen neuen Stapelkontext.',
    syntax: 'opacity: <zahl 0–1> | <prozent>;',
    values: [
      ['1', 'Voll deckend (Standard)'],
      ['0.5', 'Halbtransparent'],
      ['0', 'Unsichtbar (nimmt aber weiter Platz ein, bleibt klickbar)']
    ],
    initial: '1',
    inherited: false,
    example: '.disabled { opacity: 0.5; }\n.overlay { background: rgb(0 0 0 / 0.6); }\n.bild:hover { opacity: 0.8; }',
    demo: D + '<div class="d" style="display:flex;gap:10px"><div style="width:70px;height:70px;background:#b4367a;opacity:1;color:#fff;padding:4px">1</div><div style="width:70px;height:70px;background:#b4367a;opacity:.6;color:#fff;padding:4px">0.6</div><div style="width:70px;height:70px;background:#b4367a;opacity:.3;color:#000;padding:4px">0.3</div></div>',
    tip: '`opacity: 0` blendet nur aus; das Element bleibt klickbar und für Screenreader sichtbar. Dafür besser `visibility` oder `display` nutzen.',
    keywords: ['transparenz', 'durchsichtig', 'deckkraft', 'alpha', 'fade'],
    related: ['background-color', 'visibility', 'filter']
  });

  add(F, 'background', {
    desc: 'Kurzschreibweise für alle Hintergrund-Eigenschaften.',
    details: 'Kann Farbe, Bild, Position, Größe, Wiederholung, Befestigung, Ursprung und Beschnitt enthalten. Die Größe folgt nach der Position mit einem Schrägstrich (`center / cover`). Mehrere Ebenen werden mit Komma getrennt, die erste liegt oben; die Hintergrundfarbe darf nur in der letzten Ebene stehen. Nicht angegebene Teile werden auf ihre Anfangswerte zurückgesetzt.',
    syntax: 'background: <bild> <position> / <größe> <wiederholung> <befestigung> <ursprung> <beschnitt> <farbe>;',
    values: [
      ['#eee', 'Nur Farbe'],
      ['url(bild.jpg) center / cover no-repeat', 'Vollflächiges Bild'],
      ['linear-gradient(...), #fff', 'Verlauf über Farbe'],
      ['none', 'Zurücksetzen']
    ],
    initial: 'transparent none repeat scroll 0 0 / auto',
    inherited: false,
    example: '.hero {\n  background:\n    linear-gradient(rgb(0 0 0 / .4), rgb(0 0 0 / .4)),\n    url("hero.jpg") center / cover no-repeat,\n    #222;\n}',
    demo: D + '<div class="d"><div style="height:110px;color:#fff;padding:10px;font-weight:700;background:linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)),linear-gradient(135deg,#b4367a,#2a9d8f) center / cover no-repeat,#222">Mehrere Hintergrundebenen</div></div>',
    tip: 'Die Kurzform setzt alles zurück, was nicht genannt wird (z. B. eine zuvor gesetzte `background-size`).',
    keywords: ['hintergrund', 'shorthand', 'kurzschreibweise', 'cover'],
    related: ['background-color', 'background-image', 'background-size', 'background-position']
  });

  add(F, 'background-color', {
    desc: 'Legt die Hintergrundfarbe eines Elements fest.',
    details: 'Der Hintergrund liegt hinter dem Inhalt und, je nach `background-clip`, hinter Padding und Rand (nicht hinter dem Außenabstand). Bei Hintergrundbildern bleibt die Farbe als Fallback und für transparente Bildbereiche sichtbar. Alphawerte (`rgb(0 0 0 / .5)`) erlauben Halbtransparenz ohne den Inhalt zu beeinflussen.',
    syntax: 'background-color: <farbe>;',
    values: [
      ['transparent', 'Durchsichtig (Standard)'],
      ['#f5f5f5', 'Hex-Farbe'],
      ['rgb(0 0 0 / 0.5)', 'Mit Transparenz'],
      ['currentcolor', 'Textfarbe']
    ],
    initial: 'transparent',
    inherited: false,
    example: '.karte { background-color: #fff; }\n.overlay { background-color: rgb(0 0 0 / 0.6); }',
    demo: D + '<div class="d" style="display:flex;gap:8px"><div style="padding:14px;background-color:#fde2e4">#fde2e4</div><div style="padding:14px;background-color:#2a9d8f;color:#fff">#2a9d8f</div><div style="padding:14px;background-color:rgba(11,92,213,.4)">rgba .4</div></div>',
    tip: 'Immer auch die Textfarbe prüfen, damit Text auf dem Hintergrund lesbar bleibt.',
    keywords: ['hintergrundfarbe', 'bgcolor', 'background color'],
    related: ['background', 'color', 'opacity', 'background-clip']
  });

  add(F, 'background-image', {
    desc: 'Setzt ein oder mehrere Hintergrundbilder oder Verläufe.',
    details: 'Akzeptiert `url()` und Gradient-Funktionen; mehrere Bilder werden mit Komma getrennt und übereinander gelegt (das erste liegt oben). Ein Hintergrundbild hat keine Bedeutung für Screenreader – inhaltliche Bilder gehören als `<img>` ins HTML. Ohne Größenangabe wird das Bild in Originalgröße und gekachelt gezeigt.',
    syntax: 'background-image: none | url(<bild>) | <gradient>, …;',
    values: [
      ['none', 'Kein Bild (Standard)'],
      ['url("bild.jpg")', 'Bilddatei'],
      ['linear-gradient(red, blue)', 'Verlauf'],
      ['url(a.png), url(b.png)', 'Mehrere Ebenen']
    ],
    initial: 'none',
    inherited: false,
    example: '.banner {\n  background-image: url("muster.svg");\n  background-size: 40px;\n}\n.verlauf {\n  background-image: linear-gradient(to right, #b4367a, #5b8def);\n}',
    demo: D + '<div class="d" style="display:flex;gap:8px"><div style="width:120px;height:80px;background-image:linear-gradient(to right,#b4367a,#5b8def)"></div><div style="width:120px;height:80px;background-image:radial-gradient(circle,#fff 20%,#2a9d8f 21%);background-size:20px 20px"></div></div>',
    keywords: ['hintergrundbild', 'bild', 'verlauf', 'gradient', 'url'],
    related: ['background', 'background-size', 'background-repeat', 'background-position']
  });

  add(F, 'background-size', {
    desc: 'Legt die Größe von Hintergrundbildern fest.',
    details: '`cover` skaliert das Bild so, dass es die Fläche komplett füllt (Rand wird beschnitten), `contain` so, dass es komplett sichtbar ist (evtl. mit leerem Rand). Mit zwei Werten gibt man Breite und Höhe an; `auto` behält das Seitenverhältnis. Bei Bildern ohne natürliche Größe wie Gradients wirkt `auto` wie die gesamte Fläche.',
    syntax: 'background-size: cover | contain | <breite> <höhe>?;',
    values: [
      ['auto', 'Originalgröße (Standard)'],
      ['cover', 'Fläche vollständig füllen, ggf. beschneiden'],
      ['contain', 'Ganz sichtbar, ggf. mit Rand'],
      ['50%', 'Breite relativ zur Fläche'],
      ['40px 40px', 'Feste Breite und Höhe']
    ],
    initial: 'auto',
    inherited: false,
    example: '.hero {\n  background: url("hero.jpg") center / cover no-repeat;\n}\n.icon { background-size: 1.5rem; }',
    demo: D + '<style>.s{width:140px;height:80px;border:1px solid #888;background:linear-gradient(135deg,#b4367a,#fcd34d) no-repeat center;display:inline-block;margin-right:8px;font-size:11px;vertical-align:top}</style><div class="d"><span class="s" style="background-size:cover">cover</span><span class="s" style="background-size:contain">contain</span><span class="s" style="background-size:50% 50%">50% 50%</span></div>',
    keywords: ['cover', 'contain', 'skalieren', 'bildgröße'],
    related: ['background', 'background-position', 'background-repeat', 'object-fit']
  });

  add(F, 'background-position', {
    desc: 'Legt die Startposition des Hintergrundbildes fest.',
    details: 'Ein oder zwei Werte: Schlüsselwörter (`left`, `center`, `right`, `top`, `bottom`), Längen oder Prozente. Mit vier Werten lässt sich der Abstand von einer Kante angeben (`right 10px bottom 20px`). Prozentwerte beziehen sich auf Container minus Bildgröße, daher richtet `50% 50%` das Bild mittig aus. Standard ist die obere linke Ecke.',
    syntax: 'background-position: <x> <y>;',
    values: [
      ['0% 0% (top left)', 'Obere linke Ecke (Standard)'],
      ['center', 'Mittig'],
      ['right bottom', 'Untere rechte Ecke'],
      ['20px 40px', 'Feste Verschiebung'],
      ['right 10px bottom 20px', 'Abstände von bestimmten Kanten']
    ],
    initial: '0% 0%',
    inherited: false,
    example: '.hero {\n  background: url("bild.jpg") no-repeat;\n  background-position: center top;\n}',
    demo: D + '<style>.p{width:110px;height:80px;border:1px solid #888;display:inline-block;margin-right:8px;background:radial-gradient(circle,#b4367a 0 14px,transparent 15px) no-repeat;background-size:40px 40px;font-size:11px;vertical-align:top}</style><div class="d"><span class="p" style="background-position:left top">left top</span><span class="p" style="background-position:center">center</span><span class="p" style="background-position:right bottom">right bottom</span></div>',
    keywords: ['position', 'zentrieren', 'ausrichten', 'bild'],
    related: ['background', 'background-size', 'background-origin']
  });

  add(F, 'background-repeat', {
    desc: 'Legt fest, ob und wie ein Hintergrundbild gekachelt wird.',
    details: 'Standardmäßig wird das Bild horizontal und vertikal wiederholt. `no-repeat` zeigt es nur einmal, `space` und `round` füllen die Fläche ohne angeschnittene Kacheln – `space` mit Lücken, `round` mit skalierten Kacheln. Zwei Werte steuern X und Y einzeln.',
    syntax: 'background-repeat: repeat | repeat-x | repeat-y | no-repeat | space | round;',
    values: [
      ['repeat', 'Kacheln in beide Richtungen (Standard)'],
      ['repeat-x / repeat-y', 'Nur horizontal bzw. vertikal'],
      ['no-repeat', 'Nur einmal'],
      ['space', 'Ganze Kacheln mit gleichmäßigen Lücken'],
      ['round', 'Ganze Kacheln, auf Platz skaliert']
    ],
    initial: 'repeat',
    inherited: false,
    example: '.muster { background: url("kachel.png") repeat-x; }\n.logo { background: url("logo.svg") no-repeat center; }',
    demo: D + '<style>.r{width:120px;height:80px;border:1px solid #888;display:inline-block;margin-right:8px;background:radial-gradient(circle,#b4367a 0 8px,transparent 9px);background-size:24px 24px;font-size:11px;vertical-align:top}</style><div class="d"><span class="r" style="background-repeat:repeat">repeat</span><span class="r" style="background-repeat:repeat-x">repeat-x</span><span class="r" style="background-repeat:no-repeat">no-repeat</span><span class="r" style="background-repeat:space">space</span></div>',
    keywords: ['kacheln', 'wiederholen', 'tile', 'pattern'],
    related: ['background', 'background-size', 'background-position']
  });

  add(F, 'background-attachment', {
    desc: 'Bestimmt, ob der Hintergrund mitscrollt oder fixiert bleibt.',
    details: '`scroll` bindet den Hintergrund an das Element, `fixed` an den Viewport (Parallax-Effekt) und `local` an den scrollenden Inhalt des Elements. `fixed` funktioniert auf Mobilgeräten oft nicht und kann Performance kosten. Moderne Alternative sind `position: sticky` oder `@supports`-gesteuerte Effekte.',
    syntax: 'background-attachment: scroll | fixed | local;',
    values: [
      ['scroll', 'Am Element befestigt (Standard)'],
      ['fixed', 'Am Viewport befestigt'],
      ['local', 'Scrollt mit dem Inhalt des Elements mit']
    ],
    initial: 'scroll',
    inherited: false,
    example: '.parallax {\n  background: url("berge.jpg") center / cover;\n  background-attachment: fixed;\n}',
    demo: D + '<div class="d"><div style="height:90px;overflow:auto;border:1px solid #888;background:linear-gradient(#fcd34d,#b4367a) local;background-size:100% 220px"><div style="height:220px;padding:6px">local: scrollen Sie in diesem Kasten – der Verlauf wandert mit dem Inhalt.</div></div></div>',
    tip: '`fixed` wird auf iOS meist ignoriert; ein Fallback ist ratsam.',
    keywords: ['parallax', 'fixiert', 'scroll', 'fixed'],
    related: ['background', 'background-position', 'position']
  });

  add(F, 'background-clip', {
    desc: 'Legt fest, bis wohin sich der Hintergrund erstreckt (Rand, Padding, Inhalt, Text).',
    details: 'Standard `border-box`: der Hintergrund reicht bis unter den Rahmen. `padding-box` und `content-box` schneiden früher ab. Mit `text` (anfangs als `-webkit-background-clip`) wird der Hintergrund nur innerhalb der Buchstaben gezeigt – für Verlaufsschrift zusammen mit `color: transparent`.',
    syntax: 'background-clip: border-box | padding-box | content-box | text;',
    values: [
      ['border-box', 'Bis zum äußeren Rand des Rahmens (Standard)'],
      ['padding-box', 'Bis zum Padding'],
      ['content-box', 'Nur Inhaltsbereich'],
      ['text', 'Nur hinter den Buchstaben']
    ],
    initial: 'border-box',
    inherited: false,
    example: '.verlaufstext {\n  background: linear-gradient(90deg, #b4367a, #5b8def);\n  -webkit-background-clip: text;\n  background-clip: text;\n  color: transparent;\n}',
    demo: D + '<div class="d"><p style="font-size:34px;font-weight:800;margin:0 0 10px;background:linear-gradient(90deg,#b4367a,#5b8def);-webkit-background-clip:text;background-clip:text;color:transparent">Verlaufsschrift</p><div style="display:flex;gap:10px"><div style="padding:12px;border:8px dashed #888;background:#fcd34d;background-clip:border-box">border-box</div><div style="padding:12px;border:8px dashed #888;background:#fcd34d;background-clip:padding-box">padding-box</div><div style="padding:12px;border:8px dashed #888;background:#fcd34d;background-clip:content-box">content-box</div></div></div>',
    tip: 'Für Textverläufe zusätzlich die Variante `-webkit-background-clip: text` angeben (ältere Browser).',
    keywords: ['verlaufstext', 'gradient text', 'clip', 'text-füllung'],
    related: ['background-origin', 'background', 'color']
  });

  add(F, 'background-origin', {
    desc: 'Legt den Bezugsbereich fest, an dem sich Position und Größe des Hintergrundbildes orientieren.',
    details: 'Standard ist `padding-box`: Position 0 0 liegt in der Ecke des Paddings, nicht unter dem Rahmen. Unterscheidet sich vom Beschnitt (`background-clip`): `origin` bestimmt, wo das Bild startet, `clip` wo es sichtbar ist. Bei `background-attachment: fixed` ohne Wirkung.',
    syntax: 'background-origin: border-box | padding-box | content-box;',
    values: [
      ['padding-box', 'Ab der Padding-Kante (Standard)'],
      ['border-box', 'Ab der Außenkante des Rahmens'],
      ['content-box', 'Ab dem Inhaltsbereich']
    ],
    initial: 'padding-box',
    inherited: false,
    example: '.box {\n  padding: 20px;\n  border: 10px dotted #999;\n  background: url("deko.svg") no-repeat;\n  background-origin: content-box;\n}',
    demo: D + '<style>.o{width:100px;height:60px;padding:16px;border:8px dashed #888;display:inline-block;margin-right:8px;background:radial-gradient(circle,#b4367a 0 10px,transparent 11px) no-repeat;background-size:30px 30px;font-size:11px}</style><div class="d"><span class="o" style="background-origin:border-box">border</span><span class="o" style="background-origin:padding-box">padding</span><span class="o" style="background-origin:content-box">content</span></div>',
    keywords: ['ursprung', 'bezugsbereich', 'origin'],
    related: ['background-clip', 'background-position', 'background']
  });

  add(F, 'background-blend-mode', {
    desc: 'Mischt mehrere Hintergrundebenen miteinander, ähnlich Ebenenmodi in Bildbearbeitung.',
    details: 'Bestimmt, wie sich Hintergrundbilder untereinander und mit der Hintergrundfarbe verrechnen. Typische Modi: `multiply`, `screen`, `overlay`, `luminosity`, `color`. Klassischer Trick: ein Foto mit `background-color` und `multiply` einfärben (Duotone-Effekt). Betrifft nur den Hintergrund; für das ganze Element gilt `mix-blend-mode`.',
    syntax: 'background-blend-mode: normal | multiply | screen | overlay | …;',
    values: [
      ['normal', 'Keine Mischung (Standard)'],
      ['multiply', 'Multiplizieren: dunkler'],
      ['screen', 'Negativ multiplizieren: heller'],
      ['overlay', 'Überlagern'],
      ['luminosity', 'Helligkeit der oberen Ebene']
    ],
    initial: 'normal',
    inherited: false,
    example: '.duotone {\n  background-color: #b4367a;\n  background-image: url("foto.jpg");\n  background-blend-mode: multiply;\n}',
    demo: D + '<style>.b{width:110px;height:70px;display:inline-block;margin-right:8px;background-color:#b4367a;background-image:linear-gradient(90deg,#fcd34d,#2a9d8f);color:#fff;font-size:11px;vertical-align:top}</style><div class="d"><span class="b" style="background-blend-mode:normal">normal</span><span class="b" style="background-blend-mode:multiply">multiply</span><span class="b" style="background-blend-mode:screen">screen</span><span class="b" style="background-blend-mode:difference">difference</span></div>',
    keywords: ['mischmodus', 'multiply', 'duotone', 'blend', 'überblenden'],
    related: ['mix-blend-mode', 'background-image', 'background-color']
  });

  add(F, 'accent-color', {
    desc: 'Färbt native Formularelemente (Checkbox, Radio, Range, Progress) in einer Akzentfarbe.',
    details: 'Ein einfacher Weg, Standard-Formularelemente an das Corporate Design anzupassen, ohne sie komplett nachzubauen. Der Browser wählt automatisch einen lesbaren Kontrast für das Häkchen. Betroffen sind `<input type="checkbox|radio|range">` und `<progress>`.',
    syntax: 'accent-color: auto | <farbe>;',
    values: [
      ['auto', 'Browser-/Systemfarbe (Standard)'],
      ['#b4367a', 'Beliebige Farbe'],
      ['currentcolor', 'Textfarbe']
    ],
    initial: 'auto',
    inherited: true,
    example: ':root {\n  accent-color: #b4367a;\n}',
    demo: D + '<div class="d" style="accent-color:#b4367a;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><label><input type="checkbox" checked> Check</label><label><input type="radio" checked> Radio</label><input type="range" value="60"><progress value="60" max="100"></progress></div>',
    keywords: ['checkbox farbe', 'formular', 'radio', 'range', 'akzentfarbe'],
    related: ['color', 'caret-color', 'color-scheme']
  });

  add(F, 'caret-color', {
    desc: 'Legt die Farbe des Texteingabe-Cursors (Caret) fest.',
    details: 'Wirkt in Eingabefeldern, Textareas und `contenteditable`-Elementen. Standard ist `auto`, meist die Textfarbe. Hilfreich auf dunklen Hintergründen oder um die Markenfarbe aufzugreifen. Mit `transparent` lässt sich der Cursor verstecken – das schadet jedoch der Bedienbarkeit.',
    syntax: 'caret-color: auto | <farbe>;',
    values: [
      ['auto', 'Standard (currentcolor)'],
      ['#b4367a', 'Beliebige Farbe'],
      ['transparent', 'Cursor unsichtbar']
    ],
    initial: 'auto',
    inherited: true,
    example: 'input, textarea {\n  caret-color: #b4367a;\n}',
    demo: D + '<div class="d"><input value="Cursor ist pink" style="caret-color:#b4367a;font-size:16px;padding:6px;width:220px"></div>',
    keywords: ['cursor', 'textcursor', 'eingabe', 'caret'],
    related: ['accent-color', 'color', 'cursor']
  });

  add(F, 'color-scheme', {
    desc: 'Teilt dem Browser mit, welche Farbschemata (hell/dunkel) die Seite unterstützt.',
    details: 'Mit `light dark` darf der Browser Systemelemente (Formularfelder, Scrollbars, Standardhintergrund und -textfarbe) abhängig von der Systemeinstellung dunkel darstellen. Zusammen mit `light-dark()` lassen sich Farben pro Schema in einer Zeile angeben. Die Eigenschaft ersetzt kein eigenes Dark-Theme, sondern ergänzt es.',
    syntax: 'color-scheme: normal | light | dark | light dark;',
    values: [
      ['normal', 'Nur Hell (Standard)'],
      ['light', 'Hell'],
      ['dark', 'Dunkel'],
      ['light dark', 'Beides, folgt dem System']
    ],
    initial: 'normal',
    inherited: true,
    example: ':root {\n  color-scheme: light dark;\n}\nbody {\n  background: light-dark(#fff, #111);\n  color: light-dark(#222, #eee);\n}',
    demo: D + '<div class="d" style="display:flex;gap:10px"><div style="color-scheme:light;padding:10px;background:Canvas;color:CanvasText;border:1px solid #888"><div>light</div><input value="Feld" style="width:80px"></div><div style="color-scheme:dark;padding:10px;background:Canvas;color:CanvasText;border:1px solid #888"><div>dark</div><input value="Feld" style="width:80px"></div></div>',
    keywords: ['dark mode', 'dunkelmodus', 'light-dark', 'theme', 'darkmode'],
    related: ['color', 'background-color', 'accent-color']
  });

  /* ===================== Tabellen-Styling ===================== */
  var TB = 'Tabellen-Styling';
  var TBL = '<style>table{font:14px system-ui,sans-serif}td,th{border:2px solid #b4367a;padding:6px 10px;background:#fff}</style>';

  add(TB, 'border-collapse', {
    desc: 'Legt fest, ob Zellränder zusammenfallen (collapse) oder getrennt bleiben (separate).',
    details: 'Mit `collapse` teilen sich benachbarte Zellen eine einzige Rahmenlinie – das gewohnte Raster einer sauberen Tabelle. Mit `separate` hat jede Zelle ihren eigenen Rand, dann greift `border-spacing`. Bei `collapse` hat `border-spacing` keine Wirkung, und Rahmen von Zeilen, Gruppen und Zellen konkurrieren nach definierten Regeln.',
    syntax: 'border-collapse: collapse | separate;',
    values: [
      ['separate', 'Getrennte Ränder (Standard)'],
      ['collapse', 'Verschmolzene Ränder']
    ],
    initial: 'separate',
    inherited: true,
    example: 'table {\n  border-collapse: collapse;\n  width: 100%;\n}\nth, td { border: 1px solid #ccc; padding: 0.5rem; }',
    demo: D + TBL + '<div class="d" style="display:flex;gap:20px"><table style="border-collapse:separate"><tr><td>separate</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></table><table style="border-collapse:collapse"><tr><td>collapse</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></table></div>',
    keywords: ['tabelle', 'rahmen', 'doppelte ränder', 'zellrand'],
    related: ['border-spacing', 'table-layout', 'border']
  });

  add(TB, 'border-spacing', {
    desc: 'Legt den Abstand zwischen Tabellenzellen fest.',
    details: 'Wirkt nur bei `border-collapse: separate` auf die Tabelle selbst. Ein Wert gilt für beide Richtungen, zwei Werte stehen für horizontal und vertikal. Der Abstand liegt zwischen den Zellrändern und auch zwischen Tabellenrand und äußeren Zellen.',
    syntax: 'border-spacing: <horizontal> <vertikal>?;',
    values: [
      ['2px', 'Standardabstand in vielen Browsern'],
      ['0', 'Kein Abstand'],
      ['10px 4px', 'Horizontal 10px, vertikal 4px']
    ],
    initial: '0',
    inherited: true,
    example: 'table {\n  border-collapse: separate;\n  border-spacing: 0 8px;\n}',
    demo: D + TBL + '<div class="d" style="display:flex;gap:20px"><table style="border-collapse:separate;border-spacing:0"><tr><td>0</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></table><table style="border-collapse:separate;border-spacing:10px 4px"><tr><td>10px 4px</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></table></div>',
    tip: 'Ohne `border-collapse: separate` bleibt der Wert wirkungslos.',
    keywords: ['zellabstand', 'cellspacing', 'abstand tabelle'],
    related: ['border-collapse', 'padding', 'table-layout']
  });

  add(TB, 'table-layout', {
    desc: 'Wählt den Algorithmus zur Berechnung der Spaltenbreiten.',
    details: 'Bei `auto` richten sich die Spaltenbreiten nach dem Inhalt aller Zellen, was langsamer ist und die Breite erst nach dem Laden der Tabelle klärt. `fixed` verwendet nur die Breiten der ersten Zeile und die Tabellenbreite – schneller und vorhersehbar, aber Inhalt kann überlaufen. Zusammen mit `text-overflow: ellipsis` ideal für Datentabellen.',
    syntax: 'table-layout: auto | fixed;',
    values: [
      ['auto', 'Breite richtet sich nach Inhalt (Standard)'],
      ['fixed', 'Feste Spaltenbreiten, Tabelle braucht eine width']
    ],
    initial: 'auto',
    inherited: false,
    example: 'table {\n  table-layout: fixed;\n  width: 100%;\n}\ntd {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}',
    demo: D + TBL + '<div class="d"><table style="table-layout:auto;margin-bottom:10px"><tr><td>auto</td><td>Ein sehr langer Zelleninhalt, der die Spalte aufweitet</td></tr></table><table style="table-layout:fixed;width:300px"><tr><td style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">fixed</td><td style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Ein sehr langer Zelleninhalt wird gekürzt</td></tr></table></div>',
    tip: 'Mit `fixed` ist eine explizite Tabellenbreite (z. B. `width: 100%`) zwingend.',
    keywords: ['spaltenbreite', 'tabelle', 'fixed', 'auto', 'performance'],
    related: ['border-collapse', 'text-overflow', 'width']
  });

  add(TB, 'caption-side', {
    desc: 'Legt die Position der Tabellenüberschrift (`<caption>`) fest.',
    details: 'Standard ist oberhalb der Tabelle. Mit `bottom` erscheint die Beschriftung darunter. Moderne Browser unterstützen außerdem die logischen Werte `block-start` und `block-end`, die sich an der Schreibrichtung orientieren. Die `<caption>` bleibt dabei ein Teil der Tabellenbox.',
    syntax: 'caption-side: top | bottom;',
    values: [
      ['top', 'Oberhalb der Tabelle (Standard)'],
      ['bottom', 'Unterhalb der Tabelle']
    ],
    initial: 'top',
    inherited: true,
    example: 'caption {\n  caption-side: bottom;\n  font-style: italic;\n  text-align: left;\n}',
    demo: D + TBL + '<div class="d" style="display:flex;gap:20px"><table><caption style="caption-side:top">top</caption><tr><td>A</td><td>B</td></tr></table><table><caption style="caption-side:bottom">bottom</caption><tr><td>A</td><td>B</td></tr></table></div>',
    keywords: ['tabellenüberschrift', 'caption', 'beschriftung'],
    related: ['border-collapse', 'text-align']
  });

  add(TB, 'empty-cells', {
    desc: 'Bestimmt, ob leere Tabellenzellen Rand und Hintergrund zeigen.',
    details: 'Greift nur bei `border-collapse: separate`. Mit `hide` verschwinden Rand und Hintergrund von Zellen ohne Inhalt, was bei lückenhaften Datentabellen aufgeräumter wirkt. Zellen mit nur einem Leerzeichen oder `&nbsp;` gelten nicht als leer.',
    syntax: 'empty-cells: show | hide;',
    values: [
      ['show', 'Rand und Hintergrund zeigen (Standard)'],
      ['hide', 'Bei leeren Zellen ausblenden']
    ],
    initial: 'show',
    inherited: true,
    example: 'table {\n  border-collapse: separate;\n  empty-cells: hide;\n}',
    demo: D + TBL + '<div class="d" style="display:flex;gap:20px"><table style="border-collapse:separate;empty-cells:show"><tr><td>show</td><td></td></tr><tr><td></td><td>D</td></tr></table><table style="border-collapse:separate;empty-cells:hide"><tr><td>hide</td><td></td></tr><tr><td></td><td>D</td></tr></table></div>',
    tip: 'Wirkt nicht mit `border-collapse: collapse`.',
    keywords: ['leere zellen', 'tabelle', 'hide', 'show'],
    related: ['border-collapse', 'border-spacing']
  });
})();
