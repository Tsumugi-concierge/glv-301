// Shared i18n utilities for 6-language support across all pages
// Languages: English (en), Japanese (ja), Simplified Chinese (zh), Korean (ko), French (fr), Spanish (es)

(function () {
  const SUPPORTED = ["en", "ja", "zh", "ko", "fr", "es"];
  const STORAGE_KEY = "lang";

  function normBrowserLang() {
    try {
      const nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
      // map like zh-CN -> zh, en-US -> en, ko-KR -> ko
      const cand = nav.split("-")[0];
      if (SUPPORTED.includes(cand)) return cand;
    } catch (e) {}
    return "en";
  }

  function findLangButton(lang) {
    const btns = document.querySelectorAll('.lang-btn');
    let best = null;
    btns.forEach(b => {
      const onl = b.getAttribute('onclick') || '';
      if (onl.includes(`setLang('${lang}'`) || onl.includes(`setLang("${lang}"`)) best = b;
    });
    if (!best) {
      // fallback match by label text
      const code = lang.toUpperCase();
      btns.forEach(b => {
        if (!best && (b.textContent || '').toUpperCase().includes(code)) best = b;
      });
    }
    return best || btns[0] || null;
  }

  function setActiveBtn(btn) {
    if (!btn) return;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  function applyAttrsForKeys(lang, dict) {
    if (!dict) return;
    // text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key in dict) el.textContent = dict[key];
    });
    // innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (key in dict) el.innerHTML = dict[key];
    });
    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key in dict) el.setAttribute('placeholder', dict[key]);
    });
    // aria-label
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (key in dict) el.setAttribute('aria-label', dict[key]);
    });
  }

  function persist(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function getSaved() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v && SUPPORTED.includes(v)) return v;
    } catch (e) {}
    return null;
  }

  function chooseInitial() {
    return getSaved() || normBrowserLang();
  }

  function afterLangChange(lang) {
    document.documentElement.setAttribute('lang', lang);
    persist(lang);
    const dict = (window.I18N_STRINGS && window.I18N_STRINGS[lang]) || null;
    if (dict) applyAttrsForKeys(lang, dict);
    // per-page hook, optional
    if (typeof window.onI18NChange === 'function') {
      try { window.onI18NChange(lang, dict); } catch (e) {}
    }
    // fire a custom event
    try {
      document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang, dict } }));
    } catch (e) {}
  }

  function wrapExistingSetLang() {
    const orig = window.setLang;
    if (typeof orig === 'function') {
      window.__origSetLang = orig;
      window.setLang = function(lang, btn) {
        // call original page routine first to keep existing behavior
        try { window.__origSetLang(lang, btn); } catch (e) {}
        // ensure active state and persistence
        setActiveBtn(btn || findLangButton(lang));
        afterLangChange(lang);
      };
    } else {
      // provide a generic setLang if none exists
      window.setLang = function(lang, btn) {
        setActiveBtn(btn || findLangButton(lang));
        afterLangChange(lang);
      };
    }
  }

  function init() {
    wrapExistingSetLang();
    const initLang = chooseInitial();
    const btn = findLangButton(initLang);
    // invoke through our setLang so both page and shared hooks run
    window.setLang(initLang, btn);
  }

  // Expose minimal API
  window.I18N = {
    supported: SUPPORTED.slice(),
    setLang: function(lang) { window.setLang(lang, findLangButton(lang)); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
