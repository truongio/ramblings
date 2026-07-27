/* Theme control.

   The stylesheet already follows the system; this only adds a manual
   override on top. Three states (auto / light / dark) hide behind a
   single button: picking the theme your system already asks for drops
   the override instead of pinning it, so toggling back to match your
   system quietly hands control to the system again. Nobody has to
   learn a three-way cycle to get auto back. */
(function () {
  var KEY = 'theme';
  var root = document.documentElement;
  var query = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var button;

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch (e) {
      return null;                       // private mode, disabled storage
    }
  }

  function system() { return query && query.matches ? 'dark' : 'light'; }
  function resolved() { return stored() || system(); }

  /* The media-scoped theme-color metas can't know about an override, so
     point them at whatever the page actually resolved to. Read it back
     off the page rather than restating the hex here — the palette
     should only ever live in the stylesheet. */
  function paintBrowserChrome() {
    if (!document.body) return;
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    if (!metas.length) return;
    var paper = getComputedStyle(document.body).backgroundColor;
    for (var i = 0; i < metas.length; i++) metas[i].setAttribute('content', paper);
  }

  function apply() {
    var override = stored();
    if (override) root.dataset.theme = override;
    else delete root.dataset.theme;

    var theme = resolved();
    root.dataset.resolved = theme;       // concrete side, for the icon

    if (button) {
      var next = theme === 'dark' ? 'light' : 'dark';
      var label = 'Switch to ' + next + ' theme';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    }
    paintBrowserChrome();
  }

  function toggle() {
    var next = resolved() === 'dark' ? 'light' : 'dark';
    try {
      if (next === system()) localStorage.removeItem(KEY);   // back to auto
      else localStorage.setItem(KEY, next);
    } catch (e) {}
    apply();
  }

  function build() {
    if (document.querySelector('.theme-toggle')) return;     // bfcache restore
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<mask id="tm-cut">' +
          '<rect width="24" height="24" fill="#fff"/>' +
          '<circle class="tm-cut" cx="30" cy="6" r="6" fill="#000"/>' +
        '</mask>' +
        '<circle class="tm-disc" cx="12" cy="12" r="5" fill="currentColor" mask="url(#tm-cut)"/>' +
        '<g class="tm-rays" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
          '<line x1="12" y1="1.5" x2="12" y2="3.5"/><line x1="12" y1="20.5" x2="12" y2="22.5"/>' +
          '<line x1="1.5" y1="12" x2="3.5" y2="12"/><line x1="20.5" y1="12" x2="22.5" y2="12"/>' +
          '<line x1="4.6" y1="4.6" x2="6" y2="6"/><line x1="18" y1="18" x2="19.4" y2="19.4"/>' +
          '<line x1="4.6" y1="19.4" x2="6" y2="18"/><line x1="18" y1="6" x2="19.4" y2="4.6"/>' +
        '</g>' +
      '</svg>';
    button.addEventListener('click', toggle);
    document.body.insertBefore(button, document.body.firstChild);  // tab order matches its corner
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    build();
    apply();
  });

  /* Follow the system while it's still in charge, and stay in step with
     the same site open in another tab. */
  if (query) {
    var watch = function () { apply(); };
    if (query.addEventListener) query.addEventListener('change', watch);
    else if (query.addListener) query.addListener(watch);
  }
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) apply();
  });
})();
