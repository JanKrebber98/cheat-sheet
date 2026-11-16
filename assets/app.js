(function () {
  'use strict';

  var LANGS = ['html', 'css', 'js', 'ts', 'java', 'py', 'sql'];
  var LANG_LABEL = { html: 'HTML', css: 'CSS', js: 'JS', ts: 'TS', java: 'Java', py: 'Python', sql: 'SQL' };
  var LANG_NAME = { html: 'HTML', css: 'CSS', js: 'JavaScript', ts: 'TypeScript', java: 'Java', py: 'Python', sql: 'SQL' };
  var PRISM_LANG = { html: 'markup', css: 'css', js: 'javascript', ts: 'typescript', java: 'java', py: 'python', sql: 'sql', sh: 'bash', toml: 'toml' };
  var DIALECTS = ['std', 'pg', 'mysql', 'mssql', 'sqlite'];
  var DIALECT_NAME = { std: 'Standard', pg: 'PostgreSQL', mysql: 'MySQL', mssql: 'SQL Server', sqlite: 'SQLite' };
  var usedIds = {};
  var data = (window.CHEAT || []).map(function (e, i) {
    e.id = e.id || uniqueId(e.lang, e.name);
    e._order = i;
    e._hay = [e.name, e.desc, e.group, (e.keywords || []).join(' ')].join(' ').toLowerCase();
    return e;
  });

  var state = { lang: 'all', query: '', dialect: 'all' };
  try { if (DIALECTS.indexOf(localStorage.getItem('sqlDialect')) >= 0) state.dialect = localStorage.getItem('sqlDialect'); } catch (err) {}
  var $ = function (s) { return document.querySelector(s); };
  var list = $('#list');
  var sidebar = $('#sidebar');
  var input = $('#q');

  // ---------- Hilfsfunktionen ----------
  // Operatoren wie "===" oder "&&" haben keine Buchstaben; dann Zeichencodes verwenden.
  function uniqueId(lang, name) {
    var base = slug(name);
    if (!/[a-z0-9]/.test(base)) {
      base = 'op-' + Array.prototype.map.call(name.replace(/\s+/g, ''), function (c) { return c.charCodeAt(0).toString(16); }).join('');
    }
    var id = lang + '-' + base;
    var n = 2;
    while (usedIds[id]) id = lang + '-' + base + '-' + n++;
    usedIds[id] = true;
    return id;
  }

  function slug(s) {
    return s.toLowerCase()
      .replace(/</g, '').replace(/>/g, '')
      .replace(/::/g, '-pe-').replace(/:/g, '-pc-').replace(/@/g, 'at-')
      .replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Erlaubt `code` im Fließtext, sonst wird alles escaped.
  function inline(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function highlight(text, q) {
    var html = esc(text);
    if (!q) return html;
    var i = text.toLowerCase().indexOf(q);
    if (i < 0) return html;
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }

  // ---------- SQL-Dialekte ----------
  // Inhalt eines Dialekt-Tabs: eigenes Beispiel, { none } oder (weggelassen) das Standard-Beispiel.
  function dialectOf(e, d) {
    var ds = e.dialects;
    if (!ds) return null;
    var v = ds[d];
    if (v && v.none) return { none: v.none, mdn: v.mdn };
    var std = ds.std && !ds.std.none ? ds.std : null;
    var own = !!(v && v.example);
    var base = own ? v : std;
    if (!base) return null;
    return {
      syntax: own ? v.syntax : std.syntax, example: base.example, exampleLang: base.exampleLang,
      note: v && v.note, mdn: v && v.mdn, inherited: !own && d !== 'std'
    };
  }
  function hasDialect(e, d) {
    var v = dialectOf(e, d);
    return !!(v && !v.none);
  }
  // Im SQL-Filter mit gewähltem Dialekt nur Einträge zeigen, die es dort gibt.
  function visible(e) {
    return !(state.lang === 'sql' && state.dialect !== 'all' && e.lang === 'sql' && e.dialects && !hasDialect(e, state.dialect));
  }
  function availability(e) {
    if (!e.dialects) return '';
    var real = DIALECTS.filter(function (d) { return d !== 'std'; });
    var yes = real.filter(function (d) { return hasDialect(e, d); });
    if (yes.length === real.length) return '';
    if (!hasDialect(e, 'std') && yes.length <= 2) return 'nur ' + yes.map(function (d) { return DIALECT_NAME[d]; }).join(', ');
    return 'nicht in ' + real.filter(function (d) { return yes.indexOf(d) < 0; }).map(function (d) { return DIALECT_NAME[d]; }).join(', ');
  }

  function groupsOf(lang) {
    var seen = {}, out = [];
    data.forEach(function (e) {
      if (e.lang !== lang || !visible(e)) return;
      if (!seen[e.group]) { seen[e.group] = { name: e.group, items: [] }; out.push(seen[e.group]); }
      seen[e.group].items.push(e);
    });
    return out;
  }

  function score(e, q) {
    if (!q) return 1;
    var n = e.name.toLowerCase();
    var bare = n.replace(/^[<:@]+|>$/g, '').replace(/^:+/, '');
    var qb = q.replace(/^[<:@]+|>$/g, '').replace(/^:+/, '');
    if (n === q || bare === qb) return 100;
    if (bare.indexOf(qb) === 0) return 60;
    if (n.indexOf(q) >= 0) return 40;
    if ((e.keywords || []).join(' ').toLowerCase().indexOf(q) >= 0) return 25;
    if (e._hay.indexOf(q) >= 0) return 10;
    // Mehrere Wörter: alle müssen vorkommen
    var words = q.split(/\s+/).filter(Boolean);
    if (words.length > 1 && words.every(function (w) { return e._hay.indexOf(w) >= 0; })) return 5;
    return 0;
  }

  // ---------- Sidebar ----------
  function renderSidebar() {
    var html = '';
    LANGS.forEach(function (lang) {
      if (state.lang !== 'all' && state.lang !== lang) return;
      html += '<div class="nav-lang" data-lang="' + lang + '"><h2>' + LANG_NAME[lang] + '</h2><ul>';
      groupsOf(lang).forEach(function (g) {
        html += '<li><a href="#g-' + slug(lang + '-' + g.name) + '">' + esc(g.name) + '<span>' + g.items.length + '</span></a></li>';
      });
      html += '</ul></div>';
    });
    sidebar.innerHTML = html;
  }

  // ---------- Liste ----------
  function renderList() {
    var q = state.query.trim().toLowerCase();
    var langs = state.lang === 'all' ? LANGS : [state.lang];
    var frag = '';
    var total = 0;

    if (q) {
      // Suchergebnisse: nach Relevanz sortiert, ohne Gruppen
      var hits = data.filter(function (e) { return langs.indexOf(e.lang) >= 0 && visible(e); })
        .map(function (e) { return { e: e, s: score(e, q) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s || a.e._order - b.e._order; });
      total = hits.length;
      if (total) {
        frag += '<section class="group"><div class="group-head"><h2>Treffer</h2></div>';
        hits.forEach(function (x) { frag += entryShell(x.e, q, true); });
        frag += '</section>';
      }
    } else {
      langs.forEach(function (lang) {
        groupsOf(lang).forEach(function (g) {
          total += g.items.length;
          frag += '<section class="group" data-lang="' + lang + '" id="g-' + slug(lang + '-' + g.name) + '">' +
            '<div class="group-head"><h2>' + esc(g.name) + '</h2><span class="lang-tag" data-lang="' + lang + '">' + LANG_LABEL[lang] + '</span></div>';
          g.items.forEach(function (e) { frag += entryShell(e, '', false); });
          frag += '</section>';
        });
      });
    }

    list.innerHTML = frag;
    $('#empty').hidden = total > 0;
    $('#count').textContent = q
      ? total + ' Treffer für „' + state.query.trim() + '“'
      : total + ' Einträge';

    // Bei wenigen Treffern direkt aufklappen
    if (q && total > 0 && total <= 3) {
      list.querySelectorAll('details.entry').forEach(function (d) { d.open = true; });
    }
  }

  function entryShell(e, q, showLang) {
    return '<details class="entry" id="' + e.id + '" data-lang="' + e.lang + '">' +
      '<summary>' +
        '<span class="entry-name">' + highlight(e.name, q) + '</span>' +
        '<span class="entry-desc">' + (showLang ? '<span class="lang-tag" data-lang="' + e.lang + '">' + LANG_LABEL[e.lang] + '</span> ' : '') + inline(e.desc) +
          (availability(e) ? ' <span class="dialect-avail">' + esc(availability(e)) + '</span>' : '') + '</span>' +
        '<span class="chev" aria-hidden="true"></span>' +
      '</summary>' +
    '</details>';
  }

  function codeBlock(code, lang) {
    return '<div class="code"><pre><code class="language-' + (PRISM_LANG[lang] || 'markup') + '">' + esc(code) + '</code></pre>' +
      '<button type="button" class="copy-btn">Kopieren</button></div>';
  }

  function entryBody(e) {
    var h = '<div class="entry-body">';
    if (e.details) h += '<h3>Was es macht</h3><p>' + inline(e.details) + '</p>';

    var badges = [];
    if (e.deprecated) badges.push('<span class="badge warn">Veraltet – nicht mehr verwenden</span>');
    if (e.inherited === true) badges.push('<span class="badge">Wird vererbt</span>');
    if (e.inherited === false) badges.push('<span class="badge">Wird nicht vererbt</span>');
    if (e.initial) badges.push('<span class="badge">Standardwert: ' + esc(e.initial) + '</span>');
    if (e.display) badges.push('<span class="badge">Darstellung: ' + esc(e.display) + '</span>');
    if (badges.length) h += '<div class="badges">' + badges.join('') + '</div>';

    if (e.syntax && !e.dialects) h += '<h3>Syntax</h3>' + codeBlock(e.syntax, e.lang);

    if (e.values && e.values.length) {
      h += '<h3>' + (e.lang === 'html' && e.group !== 'Globale Attribute' ? 'Attribute &amp; Werte' : 'Werte') + '</h3><table class="values"><tbody>';
      e.values.forEach(function (v) {
        h += '<tr><td><code>' + esc(v[0]) + '</code></td><td>' + inline(v[1]) + '</td></tr>';
      });
      h += '</tbody></table>';
    }

    if (e.dialects) h += dialectTabs(e);
    else if (e.example) {
      h += '<h3>Beispiel</h3>' + codeBlock(e.example, e.exampleLang || e.lang);
    }
    if (e.run) {
      h += '<div class="preview-wrap"><button type="button" class="preview-btn" aria-expanded="false" data-label="Code ausführen">Code ausführen</button></div>';
    } else if (e.demo) {
      h += '<div class="preview-wrap"><button type="button" class="preview-btn" aria-expanded="false" data-label="Live-Vorschau zeigen">Live-Vorschau zeigen</button></div>';
    }
    if (e.tip) h += '<p class="tip">' + inline(e.tip) + '</p>';

    var foot = [];
    if (e.related && e.related.length) {
      foot.push('<span class="related">Siehe auch: ' + e.related.map(function (r) {
        var t = findByName(r, e.lang);
        return t ? '<a href="#' + t.id + '">' + esc(r) + '</a>' : '<code>' + esc(r) + '</code>';
      }).join(', ') + '</span>');
    }
    if (e.mdn) foot.push(docLink(e.mdn));
    if (foot.length) h += '<div class="entry-foot">' + foot.join('') + '</div>';

    return h + '</div>';
  }

  function docLink(url) {
    var label = /typescriptlang\.org/.test(url) ? 'TypeScript-Dokumentation' : /docs\.oracle\.com|dev\.java/.test(url) ? 'Java-Dokumentation'
      : /docs\.python\.org/.test(url) ? 'Python-Dokumentation' : /postgresql\.org/.test(url) ? 'PostgreSQL-Dokumentation'
      : /sqlite\.org/.test(url) ? 'SQLite-Dokumentation' : /dev\.mysql\.com/.test(url) ? 'MySQL-Dokumentation'
      : /learn\.microsoft\.com/.test(url) ? 'SQL-Server-Dokumentation' : 'MDN-Dokumentation';
    return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + label + '</a>';
  }

  // Ein Tab je Dialekt; offen ist der gewählte Dialekt, sonst Standard bzw. der erste vorhandene.
  function dialectTabs(e) {
    var first = state.dialect !== 'all' ? state.dialect : hasDialect(e, 'std') ? 'std'
      : DIALECTS.filter(function (d) { return hasDialect(e, d); })[0] || 'std';
    var tabs = '', panels = '';
    DIALECTS.forEach(function (d) {
      var v = dialectOf(e, d) || { none: 'Kein Beispiel.' };
      var on = d === first;
      var tid = e.id + '--t-' + d, pid = e.id + '--p-' + d;
      tabs += '<button type="button" role="tab" id="' + tid + '" aria-controls="' + pid + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '"' +
        ' data-d="' + d + '"' + (v.none ? ' class="is-none" title="Gibt es in ' + DIALECT_NAME[d] + ' nicht"' : '') + '>' + DIALECT_NAME[d] + '</button>';
      var p = '';
      if (v.none) {
        p += '<p class="dialect-none"><strong>' + (d === 'std' ? 'Nicht im SQL-Standard.' : 'Gibt es in ' + DIALECT_NAME[d] + ' nicht.') + '</strong> ' + inline(v.none) + '</p>';
      } else {
        if (v.inherited) p += '<p class="dialect-same">Wie Standard-SQL</p>';
        if (v.note) p += '<p class="dialect-note">' + inline(v.note) + '</p>';
        if (v.syntax) p += '<h4>Syntax</h4>' + codeBlock(v.syntax, 'sql');
        p += '<h4>Beispiel</h4>' + codeBlock(v.example, v.exampleLang || 'sql');
      }
      if (v.mdn) p += '<p class="dialect-doc">' + docLink(v.mdn) + '</p>';
      panels += '<div role="tabpanel" class="dialect-panel" id="' + pid + '" aria-labelledby="' + tid + '"' + (on ? '' : ' hidden') + '>' + p + '</div>';
    });
    return '<h3>Syntax &amp; Beispiel</h3><div class="dialects"><div class="dialect-tabs" role="tablist" aria-label="SQL-Dialekt">' + tabs + '</div>' + panels + '</div>';
  }

  function selectTab(tab) {
    var box = tab.closest('.dialects');
    box.querySelectorAll('[role=tab]').forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }

  var byName = null;
  function findByName(name, lang) {
    if (!byName) {
      byName = {};
      data.forEach(function (e) { byName[e.lang + '|' + e.name.toLowerCase()] = e; });
    }
    var n = name.toLowerCase();
    if (byName[lang + '|' + n]) return byName[lang + '|' + n];
    for (var i = 0; i < LANGS.length; i++) {
      if (byName[LANGS[i] + '|' + n]) return byName[LANGS[i] + '|' + n];
    }
    return null;
  }

  function fill(details) {
    if (details.dataset.filled) return;
    var e = data.find(function (x) { return x.id === details.id; });
    if (!e) return;
    details.insertAdjacentHTML('beforeend', entryBody(e));
    details.dataset.filled = '1';
    if (window.Prism) details.querySelectorAll('pre code').forEach(function (c) { Prism.highlightElement(c); });
  }

  // Fängt console.* und Fehler ab und schreibt sie in die Konsole der Vorschau.
  var CONSOLE_SHIM = '(function(){var o=document.getElementById("__out");' +
    'function f(v){if(typeof v==="string")return v;if(v===undefined)return "undefined";if(typeof v==="function")return v.toString().split("\\n")[0];' +
    'if(typeof v==="bigint")return v+"n";if(typeof v==="symbol")return v.toString();' +
    'if(v instanceof Error)return v.name+": "+v.message;if(v instanceof Map)return "Map("+v.size+") "+f(Array.from(v));' +
    'if(v instanceof Set)return "Set("+v.size+") "+f(Array.from(v));if(typeof Node!=="undefined"&&v instanceof Node)return "<"+(v.nodeName||"").toLowerCase()+">";' +
    'try{var s=JSON.stringify(v);return s===undefined?String(v):s}catch(e){return String(v)}}' +
    'function w(cls,args){var l=document.createElement("div");l.className=cls;l.textContent=Array.prototype.map.call(args,f).join(" ");o.appendChild(l)}' +
    '["log","info","debug","table","dir"].forEach(function(k){console[k]=function(){w("log",arguments)}});' +
    'console.warn=function(){w("warn",arguments)};console.error=function(){w("err",arguments)};' +
    'window.onerror=function(m){w("err",["Fehler: "+m]);return true};' +
    'window.addEventListener("unhandledrejection",function(e){w("err",["Unbehandelte Promise-Ablehnung: "+f(e.reason)])});})();';

  function demoDoc(e) {
    var base = '<!doctype html><html><head><meta charset="utf-8"><style>' +
      'body{font-family:system-ui,sans-serif;margin:12px;color:#1e2433;background:#fff;line-height:1.5}' +
      '#__out{font:13px/1.6 Consolas,ui-monospace,monospace;white-space:pre-wrap;margin-top:8px}' +
      '#__out:empty::before{content:"(keine Konsolenausgabe)";color:#8a92a3}' +
      '#__out div{padding:2px 0;border-bottom:1px solid #eef0f4}#__out .warn{color:#8a6100}#__out .err{color:#c0262d}' +
      '</style></head><body>';
    if (!e.run) return base + e.demo + '</body></html>';
    var code = e.example.replace(/<\/script/gi, '<\\/script');
    return base + (e.demo || '') +
      '<div id="__out" role="log"></div>' +
      '<script>' + CONSOLE_SHIM + '<\/script>' +
      '<script type="module">' + code + '\n<\/script></body></html>';
  }

  // ---------- Ereignisse ----------
  list.addEventListener('toggle', function (ev) {
    if (ev.target.matches('details.entry') && ev.target.open) fill(ev.target);
  }, true);

  list.addEventListener('click', function (ev) {
    var tab = ev.target.closest('.dialect-tabs [role=tab]');
    if (tab) { selectTab(tab); return; }
    var copy = ev.target.closest('.copy-btn');
    if (copy) {
      var text = copy.parentNode.querySelector('code').textContent;
      var done = function () {
        copy.textContent = 'Kopiert';
        copy.classList.add('done');
        setTimeout(function () { copy.textContent = 'Kopieren'; copy.classList.remove('done'); }, 1400);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      else { fallbackCopy(text); done(); }
      return;
    }
    var pv = ev.target.closest('.preview-btn');
    if (pv) {
      var wrap = pv.parentNode;
      var frame = wrap.querySelector('iframe');
      if (frame) {
        frame.remove();
        pv.textContent = pv.dataset.label;
        pv.setAttribute('aria-expanded', 'false');
      } else {
        var e = data.find(function (x) { return x.id === pv.closest('details').id; });
        frame = document.createElement('iframe');
        frame.className = 'preview';
        frame.title = 'Vorschau: ' + e.name;
        // Skripte nur für ausführbare Beispiele; ohne allow-same-origin bleibt der Code isoliert.
        frame.setAttribute('sandbox', e.run ? 'allow-scripts allow-modals' : '');
        frame.srcdoc = demoDoc(e);
        wrap.appendChild(frame);
        pv.textContent = e.run ? 'Ausgabe schließen' : 'Vorschau ausblenden';
        pv.setAttribute('aria-expanded', 'true');
      }
    }
  });

  list.addEventListener('keydown', function (ev) {
    var tab = ev.target.closest('.dialect-tabs [role=tab]');
    if (!tab || ['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(ev.key) < 0) return;
    var all = Array.prototype.slice.call(tab.parentNode.children);
    var i = all.indexOf(tab);
    var n = ev.key === 'Home' ? 0 : ev.key === 'End' ? all.length - 1 : (i + (ev.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length;
    ev.preventDefault();
    selectTab(all[n]);
    all[n].focus();
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (err) {}
    ta.remove();
  }

  var t;
  input.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(function () { state.query = input.value; renderList(); }, 120);
  });

  document.addEventListener('keydown', function (ev) {
    var typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (ev.key === '/' && !typing) { ev.preventDefault(); input.focus(); input.select(); }
    if (ev.key === 'Escape' && document.activeElement === input) {
      input.value = ''; state.query = ''; renderList(); input.blur();
    }
  });

  document.querySelectorAll('.lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.lang = b.dataset.lang;
      document.querySelectorAll('.lang-switch button').forEach(function (x) {
        x.setAttribute('aria-checked', String(x === b));
      });
      dialectBar.hidden = state.lang !== 'sql';
      renderSidebar(); renderList();
      b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  });

  var dialectBar = $('#dialect-bar');
  function markDialect() {
    dialectBar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-checked', String(x.dataset.dialect === state.dialect)); });
  }
  dialectBar.querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.dialect = b.dataset.dialect;
      try { localStorage.setItem('sqlDialect', state.dialect); } catch (err) {}
      markDialect();
      renderSidebar(); renderList();
    });
  });
  markDialect();

  // Auf schmalen Bildschirmen scrollt die Sprachleiste; ein Verlauf rechts zeigt, dass noch Knöpfe folgen.
  var langBar = $('.lang-switch');
  function updateLangFade() {
    langBar.classList.toggle('is-clipped', langBar.scrollWidth - langBar.clientWidth - langBar.scrollLeft > 1);
  }
  langBar.addEventListener('scroll', updateLangFade, { passive: true });
  window.addEventListener('resize', updateLangFade);
  updateLangFade();

  $('#expand-all').addEventListener('click', function () {
    list.querySelectorAll('details.entry').forEach(function (d) { d.open = true; });
  });
  $('#collapse-all').addEventListener('click', function () {
    list.querySelectorAll('details.entry').forEach(function (d) { d.open = false; });
  });

  $('#theme-toggle').addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  var navToggle = $('#nav-toggle');
  navToggle.addEventListener('click', function () {
    var open = sidebar.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  sidebar.addEventListener('click', function (ev) {
    if (!ev.target.closest('a')) return;
    sidebar.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    // Bei aktiver Suche erst zurücksetzen, sonst existiert die Gruppe nicht
    if (state.query) { input.value = ''; state.query = ''; renderList(); }
  });

  // Aktive Gruppe in der Sidebar markieren
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        sidebar.querySelectorAll('a').forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-120px 0px -70% 0px' });
    var observe = function () { list.querySelectorAll('section.group[id]').forEach(function (s) { io.observe(s); }); };
    var origRender = renderList;
    renderList = function () { io.disconnect(); origRender(); observe(); };
  }

  // Deep-Link auf einen Eintrag (#id) öffnen
  function openHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (!el && state.query) { input.value = ''; state.query = ''; renderList(); el = document.getElementById(id); }
    if (el && el.matches('details.entry')) {
      el.open = true;
      el.scrollIntoView({ block: 'start' });
      el.querySelector('summary').focus({ preventScroll: true });
    }
  }
  window.addEventListener('hashchange', openHash);

  renderSidebar();
  renderList();
  openHash();
})();
