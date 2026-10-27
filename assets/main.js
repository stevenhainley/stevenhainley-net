// stevenhainley.net · no trackers, no network calls. Progressive enhancement only.
(function () {
  var d = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Theme toggle: system by default, remembers an explicit choice. */
  var btn = document.querySelector('.theme-btn');
  function current() {
    var t = d.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function label() {
    if (!btn) return;
    var next = current() === 'dark' ? 'light' : 'dark';
    btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }
  if (btn) {
    label();
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      d.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });
  }

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  /* Section reveals (once). */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealIO.observe(el); });

  /* Glim story lines: light up the line nearest the middle of the screen. */
  var lines = document.querySelectorAll('.story li');
  var storyIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('is-on'); });
  }, { rootMargin: '-40% 0px -40% 0px' });
  lines.forEach(function (li) { storyIO.observe(li); });

  /* Work ledger: the sticky frame shows the project you are reading. */
  var rows = document.querySelectorAll('.row');
  var figs = {};
  document.querySelectorAll('.media figure').forEach(function (f) { figs[f.dataset.for] = f; });
  var active = null;
  function activate(row) {
    if (active === row) return;
    active = row;
    rows.forEach(function (r) { r.classList.toggle('is-on', r === row); });
    var id = row.dataset.id;
    Object.keys(figs).forEach(function (k) { figs[k].classList.toggle('is-on', k === id); });
  }
  var rowIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) activate(e.target); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  rows.forEach(function (r) { rowIO.observe(r); });
  if (rows[0]) activate(rows[0]);

  /* Nav: mark the section in view. Margin Glim appears after the hero and hops (stepped) on section change. */
  var buddy = document.querySelector('.buddy');
  var navLinks = {};
  document.querySelectorAll('.nav__links a').forEach(function (a) { navLinks[a.getAttribute('href').slice(1)] = a; });
  var last = null;
  var secIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id;
      Object.keys(navLinks).forEach(function (k) {
        if (k === id) navLinks[k].setAttribute('aria-current', 'true'); else navLinks[k].removeAttribute('aria-current');
      });
      if (buddy) {
        buddy.classList.toggle('is-on', id !== 'top');
        if (last && last !== id && !reduce.matches) {
          buddy.classList.remove('is-hop'); void buddy.offsetWidth; buddy.classList.add('is-hop');
        }
      }
      last = id;
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  document.querySelectorAll('main > section[id], main > div[id]').forEach(function (s) { secIO.observe(s); });
})();
