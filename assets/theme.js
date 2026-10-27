// Runs before paint: apply a saved theme choice (if any) and mark JS as available.
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t);
  } catch (e) { /* storage blocked: follow the system setting */ }
})();
