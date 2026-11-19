/*
 * timothydo.me interface
 * Screen switching, keyboard controls, the photo scene, the speech box,
 * the project list and the photo viewer. No dependencies.
 */
(function () {
  'use strict';

  var doc = document;
  var body = doc.body;
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var phone = window.matchMedia ? window.matchMedia('(max-width: 860px)') : { matches: false };

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isTyping(el) {
    return !!el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
  }

  /* ---------- Icons ---------- */
  var ICONS = {
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h12l-2.5 4 2.5 4H5"/>',
    list: '<path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    mail: '<path d="M3 6h18v12H3z"/><path d="M3 7l9 6 9-6"/>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
    bolt: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v6l-5.2 9a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7.5 15h9"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    wave: '<path d="M2 12h3l2-6 3 12 3-12 3 12 2-6h4"/>',
    gamepad: '<path d="M7 8h10a5 5 0 0 1 5 5v1.5a2.5 2.5 0 0 1-4.6 1.4L16 15H8l-1.4.9A2.5 2.5 0 0 1 2 14.5V13a5 5 0 0 1 5-5z"/><path d="M8 10.5v3M6.5 12h3"/><path d="M15.5 11.5h.01M17.5 13h.01"/>',
    people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14.3c2.6.4 4.5 2.7 4.5 5.7"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z"/>'
  };
  function icon(name) {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  }
  $all('[data-icon]').forEach(function (el) {
    el.insertAdjacentHTML('afterbegin', icon(el.getAttribute('data-icon')));
  });

  /* ---------- Scene: photographs behind the interface ---------- */
  var scene = (function () {
    var shots = $all('.scene-shot');
    function load(shot) {
      $all('[data-srcset]', shot).forEach(function (el) { el.setAttribute('srcset', el.getAttribute('data-srcset')); el.removeAttribute('data-srcset'); });
      $all('[data-src]', shot).forEach(function (el) { el.setAttribute('src', el.getAttribute('data-src')); el.removeAttribute('data-src'); });
    }
    function show(name) {
      var match = null;
      shots.forEach(function (shot) { if (shot.getAttribute('data-scene') === name) match = shot; });
      if (!match) return;
      load(match);
      shots.forEach(function (shot) { shot.classList.toggle('is-active', shot === match); });
    }
    // Fetch the other photographs once the first screen has settled, so switching screens is instant.
    window.addEventListener('load', function () {
      setTimeout(function () { shots.forEach(load); }, 1500);
    });

    // The scene and the figure shift slightly with the pointer, which gives the title screen depth.
    var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine && !reduceMotion && shots.length) {
      var queued = false, mx = 0, my = 0;
      window.addEventListener('pointermove', function (e) {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = (e.clientY / window.innerHeight) * 2 - 1;
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(function () {
          queued = false;
          doc.documentElement.style.setProperty('--mx', mx.toFixed(3));
          doc.documentElement.style.setProperty('--my', my.toFixed(3));
        });
      });
    }
    return { show: show };
  })();

  /* ---------- Key hints ---------- */
  var hints = $('.keyhints');
  function setHints(list) {
    if (!hints) return;
    hints.innerHTML = list.map(function (h) {
      return '<span>' + h.keys.map(function (k) { return '<kbd>' + esc(k) + '</kbd>'; }).join('') + ' ' + esc(h.label) + '</span>';
    }).join('');
  }

  /* ---------- Speech box on the About screen ---------- */
  var dialogue = (function () {
    var out = $('[data-dialogue]');
    var live = $('[data-dialogue-live]');
    var next = $('[data-dialogue-next]');
    if (!out || !next) return { start: function () {} };

    var lines = [
      'Welcome to my tab on the web! I’m Timothy.',
      'By day I push Physical AI at SiMa.ai, getting robots and language models to run on a chip at the edge.',
      'Off the clock you’ll find me in TheDoLab, behind a camera, or under a dark sky.',
      'I also play the euphonium. Let’s meet up and play some gigs!',
      'Want to build something together? Open the Contact screen and say hello.'
    ];
    var index = 0, timer = null, started = false;

    function finish() {
      if (timer) { clearInterval(timer); timer = null; }
      out.textContent = lines[index];
    }
    function say(i) {
      index = i % lines.length;
      var text = lines[index];
      if (live) live.textContent = text;
      if (timer) { clearInterval(timer); timer = null; }
      if (reduceMotion) { out.textContent = text; return; }
      var n = 0;
      out.textContent = '';
      timer = setInterval(function () {
        n += 1;
        out.textContent = text.slice(0, n);
        if (n >= text.length) { clearInterval(timer); timer = null; }
      }, 22);
    }
    function advance() {
      if (timer) { finish(); return; }
      say(index + 1);
    }
    next.addEventListener('click', advance);
    var avatar = $('.profile-bust');
    if (avatar) avatar.addEventListener('click', advance);

    return {
      start: function () { if (!started) { started = true; say(0); } }
    };
  })();

  /* ---------- Project log ---------- */
  var projectLogs = [];

  function initProjectLog(host) {
    var all = window.PROJECTS || [];
    var cats = window.PROJECT_CATEGORIES || [];
    if (!all.length) return null;

    var catBy = {};
    cats.forEach(function (c) { catBy[c.key] = c; });

    var full = host.getAttribute('data-projectlog') === 'full';
    var imgBase = host.getAttribute('data-img-base') || '';
    var pool = full ? all.slice() : all.filter(function (q) { return q.featured; });
    var state = { cat: 'all', query: '', id: null, open: true };
    var visible = [];

    host.innerHTML = '';

    var chips = [], search = null;
    if (full) {
      var tools = doc.createElement('div');
      tools.className = 'pl-tools';
      var chipHtml = '<button type="button" class="chip" data-cat="all" aria-pressed="true">' + icon('star') + 'All <small>' + pool.length + '</small></button>';
      cats.forEach(function (c) {
        var n = pool.filter(function (q) { return q.cat === c.key; }).length;
        if (n) chipHtml += '<button type="button" class="chip" data-cat="' + esc(c.key) + '" aria-pressed="false">' + icon(c.icon) + esc(c.label) + ' <small>' + n + '</small></button>';
      });
      tools.innerHTML =
        '<div class="chips" role="group" aria-label="Filter projects by type">' + chipHtml + '</div>' +
        '<label class="sr-only" for="pl-search">Search projects</label>' +
        '<input class="pl-search" id="pl-search" type="search" placeholder="Search projects, tools or years" autocomplete="off">';
      host.appendChild(tools);
      chips = $all('.chip', tools);
      search = $('.pl-search', tools);
    }

    var grid = doc.createElement('div');
    grid.className = 'projectlog' + (full ? ' projectlog--full' : '');
    grid.innerHTML = '<div class="pl-side"><ul class="pl-list"></ul></div><div class="pl-pane"></div>';
    host.appendChild(grid);
    var list = $('.pl-list', grid);
    var pane = $('.pl-pane', grid);
    var detail = doc.createElement('article');
    detail.className = 'pl-detail panel';

    function matches(q) {
      if (state.cat !== 'all' && q.cat !== state.cat) return false;
      if (!state.query) return true;
      var hay = (q.title + ' ' + q.blurb + ' ' + q.tags.join(' ') + ' ' + q.year + ' ' + (catBy[q.cat] ? catBy[q.cat].label : '')).toLowerCase();
      return state.query.split(/\s+/).every(function (word) { return hay.indexOf(word) !== -1; });
    }

    function itemHtml(q) {
      var c = catBy[q.cat] || {};
      return '<li><button type="button" class="pl-item" data-id="' + esc(q.id) + '">' + icon(c.icon || 'star') +
        '<span class="pl-item-title">' + esc(q.title) + '</span><span class="pl-item-year">' + esc(q.year) + '</span></button></li>';
    }

    function renderList() {
      var shown = pool.filter(matches);
      var html = '';
      visible = [];
      if (!shown.length) {
        html = '<li class="pl-empty">No projects match that search. Clear it, or choose All, to see every project.</li>';
      } else if (full && state.cat === 'all' && !state.query) {
        cats.forEach(function (c) {
          var group = shown.filter(function (q) { return q.cat === c.key; });
          if (!group.length) return;
          html += '<li class="pl-group" role="presentation">' + esc(c.label) + '<span>' + group.length + '</span></li>';
          group.forEach(function (q) { html += itemHtml(q); visible.push(q); });
        });
      } else {
        shown.forEach(function (q) { html += itemHtml(q); visible.push(q); });
      }
      if (detail.parentNode) detail.parentNode.removeChild(detail);
      list.innerHTML = html;

      var keep = visible.some(function (q) { return q.id === state.id; });
      if (!keep) { state.id = visible.length ? visible[0].id : null; state.open = true; }
      paint(false);
    }

    function detailHtml(q) {
      var c = catBy[q.cat] || {};
      var art = q.img
        ? '<div class="pl-art"><img src="' + esc(imgBase + q.img) + '" alt="" width="800" height="450" loading="lazy"></div>'
        : '<div class="pl-art pl-art--empty">' + icon(c.icon || 'star') + '</div>';
      var actions = '';
      if (q.live) actions += '<a class="btn btn--primary" href="' + esc(q.live) + '" target="_blank" rel="noopener">' + esc(q.liveLabel || 'Open Project') + '</a>';
      if (q.repo) actions += '<a class="btn' + (q.live ? '' : ' btn--primary') + '" href="' + esc(q.repo) + '" target="_blank" rel="noopener">View Source on GitHub</a>';
      return art +
        '<p class="pl-kind">' + icon(c.icon || 'star') + esc(c.label || '') + '<span>' + esc(q.year) + '</span></p>' +
        '<h3>' + esc(q.title) + '</h3>' +
        '<p>' + esc(q.blurb) + '</p>' +
        '<ul class="tags">' + q.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<div class="btn-row">' + actions + '</div>';
    }

    function paint(focusItem) {
      var current = null;
      $all('.pl-item', list).forEach(function (btn) {
        var on = btn.getAttribute('data-id') === state.id;
        if (on) { btn.setAttribute('aria-current', 'true'); current = btn; }
        else btn.removeAttribute('aria-current');
        if (phone.matches) btn.setAttribute('aria-expanded', on && state.open ? 'true' : 'false');
        else btn.removeAttribute('aria-expanded');
      });

      var project = null;
      pool.forEach(function (q) { if (q.id === state.id) project = q; });
      if (detail.parentNode) detail.parentNode.removeChild(detail);
      if (!project || !current) return;

      if (detail.getAttribute('data-id') !== project.id) {
        detail.innerHTML = detailHtml(project);
        detail.setAttribute('data-id', project.id);
        detail.setAttribute('aria-label', project.title);
      }
      if (phone.matches) {
        if (state.open) current.parentNode.appendChild(detail);
      } else {
        pane.appendChild(detail);
      }
      if (focusItem) {
        current.focus({ preventScroll: true });
        if (current.scrollIntoView) current.scrollIntoView({ block: 'nearest' });
      }
    }

    function select(id, focusItem) {
      if (phone.matches && id === state.id) state.open = !state.open;
      else state.open = true;
      state.id = id;
      paint(focusItem);
      if (full && window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#project-' + id);
      }
    }

    list.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.pl-item') : null;
      if (btn) select(btn.getAttribute('data-id'), false);
    });

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        state.cat = chip.getAttribute('data-cat');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        renderList();
      });
    });
    if (search) {
      search.addEventListener('input', function () {
        state.query = search.value.trim().toLowerCase();
        renderList();
      });
    }

    if (phone.addEventListener) phone.addEventListener('change', function () { paint(false); });
    else if (phone.addListener) phone.addListener(function () { paint(false); });

    // Deep link: portfolio/#project-neat-genai-studio
    function fromHash() {
      var wanted = (window.location.hash.match(/^#project-(.+)$/) || [])[1];
      if (!wanted || !pool.some(function (q) { return q.id === wanted; })) return false;
      var project = pool.filter(function (q) { return q.id === wanted; })[0];
      if (!matches(project)) {
        // The linked project is filtered out, so show everything again.
        state.cat = 'all'; state.query = '';
        if (search) search.value = '';
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-cat') === 'all' ? 'true' : 'false'); });
      }
      state.id = wanted; state.open = true;
      return true;
    }
    function reveal() {
      var target = $('.pl-item[aria-current="true"]', list);
      if (target && target.scrollIntoView) target.scrollIntoView({ block: 'center' });
    }
    var linked = fromHash();
    renderList();
    if (linked) reveal();
    if (full) {
      window.addEventListener('hashchange', function () {
        if (fromHash()) { renderList(); reveal(); }
      });
    }

    return {
      host: host,
      search: search,
      move: function (step) {
        if (!visible.length) return;
        var i = 0;
        visible.forEach(function (q, n) { if (q.id === state.id) i = n; });
        var j = Math.max(0, Math.min(visible.length - 1, i + step));
        state.open = true;
        state.id = visible[j].id;
        paint(true);
        if (full && window.history && window.history.replaceState) window.history.replaceState(null, '', '#project-' + state.id);
      }
    };
  }

  $all('[data-projectlog]').forEach(function (host) {
    var log = initProjectLog(host);
    if (log) projectLogs.push(log);
  });

  function activeProjectLog() {
    for (var i = 0; i < projectLogs.length; i++) {
      if (projectLogs[i].host.offsetParent !== null) return projectLogs[i];
    }
    return null;
  }

  /* ---------- Photo viewer ---------- */
  var lightbox = $('.lightbox');
  $all('.snap[data-full]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = btn.getAttribute('data-full');
      var caption = btn.getAttribute('data-caption') || '';
      if (!lightbox || typeof lightbox.showModal !== 'function') { window.open(src, '_blank', 'noopener'); return; }
      var img = $('img', lightbox);
      img.src = src; img.alt = caption;
      $('[data-lightbox-caption]', lightbox).textContent = caption;
      lightbox.showModal();
    });
  });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || (e.target.closest && e.target.closest('[data-lightbox-close]'))) lightbox.close();
    });
  }

  /* ---------- Screens ---------- */
  var screens = $all('.screen[data-screen]');
  var tabs = $all('.tabs a[data-tab]');
  var order = screens.map(function (s) { return s.getAttribute('data-screen'); });
  var hub = order.filter(function (n) { return n !== 'title'; });
  var titles = {};
  screens.forEach(function (s) { titles[s.getAttribute('data-screen')] = s.getAttribute('data-title') || ''; });
  // Anchors from the previous version of the site still land somewhere sensible.
  var legacy = { intro: 'title', one: 'about', two: 'experience', three: 'interests', contributions: 'interests' };
  var baseTitle = doc.title;
  // Which photograph sits behind each screen.
  var sceneFor = { contact: 'title' };

  function screenFromHash() {
    var name = window.location.hash.replace(/^#/, '');
    if (legacy[name]) name = legacy[name];
    return order.indexOf(name) !== -1 ? name : null;
  }

  function show(name, moveFocus) {
    screens.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-screen') === name); });
    body.setAttribute('data-screen', name);
    tabs.forEach(function (a) {
      if (a.getAttribute('data-tab') === name) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    doc.title = name === 'title' || !titles[name] ? baseTitle : titles[name] + ' | ' + baseTitle;
    window.scrollTo(0, 0);

    var list = [{ keys: ['←', '→'], label: 'Switch Screen' }];
    if (name === 'projects') list.push({ keys: ['↑', '↓'], label: 'Select Project' });
    list.push({ keys: ['Esc'], label: 'Title Screen' });
    setHints(list);

    if (name === 'about') dialogue.start();
    scene.show(sceneFor[name] || name);

    if (moveFocus) {
      var active = doc.activeElement;
      var lost = !active || active === body || active.offsetParent === null;
      if (lost) {
        var target = name === 'title' ? $('.title-menu a.is-cursor') : $('.screen.is-active [data-screen-heading]');
        if (target) target.focus({ preventScroll: true });
      }
    }
  }

  if (screens.length) {
    var menu = $all('.title-menu a');
    var cursor = 0;
    var setCursor = function (i, focus) {
      cursor = (i + menu.length) % menu.length;
      menu.forEach(function (a, n) { a.classList.toggle('is-cursor', n === cursor); });
      if (focus) menu[cursor].focus();
    };
    menu.forEach(function (a, n) {
      a.addEventListener('mouseenter', function () { setCursor(n, false); });
      a.addEventListener('focus', function () { setCursor(n, false); });
    });

    window.addEventListener('hashchange', function () {
      var name = screenFromHash();
      if (name) show(name, true);
      else if (!window.location.hash) show('title', true);
    });

    doc.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target)) return;
      if (lightbox && lightbox.open) return;
      var name = body.getAttribute('data-screen');

      if (name === 'title') {
        if (e.key === 'ArrowDown') { setCursor(cursor + 1, true); e.preventDefault(); }
        else if (e.key === 'ArrowUp') { setCursor(cursor - 1, true); e.preventDefault(); }
        else if (e.key === 'Enter' && (!doc.activeElement || doc.activeElement === body)) {
          window.location.hash = menu[cursor].getAttribute('href');
          e.preventDefault();
        }
        return;
      }

      var at = hub.indexOf(name);
      if (e.key === 'ArrowRight' && at < hub.length - 1) { window.location.hash = '#' + hub[at + 1]; e.preventDefault(); }
      else if (e.key === 'ArrowLeft' && at > 0) { window.location.hash = '#' + hub[at - 1]; e.preventDefault(); }
      else if (e.key === 'Escape') { window.location.hash = '#title'; e.preventDefault(); }
      else if (/^[1-9]$/.test(e.key) && hub[Number(e.key) - 1]) { window.location.hash = '#' + hub[Number(e.key) - 1]; e.preventDefault(); }
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var log = activeProjectLog();
        if (log) { log.move(e.key === 'ArrowDown' ? 1 : -1); e.preventDefault(); }
      }
    });

    show(screenFromHash() || 'title', false);
  } else {
    // Project log page: arrow keys walk the list, slash jumps to search.
    setHints([{ keys: ['↑', '↓'], label: 'Select Project' }, { keys: ['/'], label: 'Search' }]);
    doc.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      var log = activeProjectLog();
      if (!log) return;
      if (isTyping(e.target)) {
        if (e.key === 'Escape') e.target.blur();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { log.move(e.key === 'ArrowDown' ? 1 : -1); e.preventDefault(); }
      else if (e.key === '/' && log.search) { log.search.focus(); e.preventDefault(); }
    });
  }
})();
