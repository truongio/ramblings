/* Theme control.

   The stylesheet already follows the system on its own; this adds a way
   to override it. Three modes cycle on one button:

     auto   no stored preference — the system decides, and keeps
            deciding if it changes while the page is open
     light  pinned
     dark   pinned

   Auto is the absence of a stored value rather than a value of its own,
   so a first-time visitor and someone who has cycled back to auto are
   in exactly the same state. */
(function () {
  var KEY = 'theme';
  var MODES = ['auto', 'light', 'dark'];
  var NEXT = { auto: 'light', light: 'dark', dark: 'auto' };
  var LABEL = {
    auto:  'Theme: matching your system. Switch to light.',
    light: 'Theme: light. Switch to dark.',
    dark:  'Theme: dark. Switch to matching your system.'
  };
  var SAID = { auto: 'Theme now matches your system', light: 'Light theme', dark: 'Dark theme' };

  var root = document.documentElement;
  var query = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var button, status;

  function mode() {
    try {
      var v = localStorage.getItem(KEY);
      return MODES.indexOf(v) > 0 ? v : 'auto';   // index 0 is auto, never stored
    } catch (e) {
      return 'auto';                              // private mode, disabled storage
    }
  }

  /* The theme-color metas are media-scoped and can't know about an
     override, so point them at whatever the page actually resolved to.
     Read it back off the page rather than restating the hex here — the
     palette should only ever live in the stylesheet. */
  function paintBrowserChrome() {
    if (!document.body) return;
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    if (!metas.length) return;
    var paper = getComputedStyle(document.body).backgroundColor;
    for (var i = 0; i < metas.length; i++) metas[i].setAttribute('content', paper);
  }

  function apply(announce) {
    var current = mode();

    if (current === 'auto') delete root.dataset.theme;
    else root.dataset.theme = current;

    if (button) {
      button.setAttribute('aria-label', LABEL[current]);
      button.setAttribute('title', LABEL[current]);
    }
    /* Changing a button's own label doesn't get announced, so say it. */
    if (announce && status) status.textContent = SAID[current];

    paintBrowserChrome();
  }

  function cycle() {
    var next = NEXT[mode()];
    try {
      if (next === 'auto') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch (e) {}
    apply(true);
  }

  function build() {
    if (document.querySelector('.theme-toggle')) return;    // bfcache restore
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<mask id="tm-cut">' +
          '<rect width="24" height="24" fill="#fff"/>' +
          '<rect class="tm-half" x="24" y="-2" width="14" height="28" fill="#000"/>' +
          '<circle class="tm-cut" cx="30" cy="6" r="6" fill="#000"/>' +
        '</mask>' +
        '<circle class="tm-ring" cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<circle class="tm-disc" cx="12" cy="12" r="7" fill="currentColor" mask="url(#tm-cut)"/>' +
        '<g class="tm-rays" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
          '<line x1="12" y1="1.5" x2="12" y2="3.5"/><line x1="12" y1="20.5" x2="12" y2="22.5"/>' +
          '<line x1="1.5" y1="12" x2="3.5" y2="12"/><line x1="20.5" y1="12" x2="22.5" y2="12"/>' +
          '<line x1="4.6" y1="4.6" x2="6" y2="6"/><line x1="18" y1="18" x2="19.4" y2="19.4"/>' +
          '<line x1="4.6" y1="19.4" x2="6" y2="18"/><line x1="18" y1="6" x2="19.4" y2="4.6"/>' +
        '</g>' +
      '</svg>';
    button.addEventListener('click', cycle);

    status = document.createElement('span');
    status.className = 'tm-status';
    status.setAttribute('aria-live', 'polite');

    document.body.insertBefore(status, document.body.firstChild);
    document.body.insertBefore(button, document.body.firstChild);  // tab order matches its corner
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {
    build();
    apply(false);
  });

  /* On auto the system is still in charge, so keep the browser chrome in
     step when it flips. Also follow the same site in another tab. */
  if (query) {
    var watch = function () { apply(false); };
    if (query.addEventListener) query.addEventListener('change', watch);
    else if (query.addListener) query.addListener(watch);
  }
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) apply(false);
  });
})();
