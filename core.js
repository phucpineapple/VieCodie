/* ============================================================
   core.js — White-label core: load data/<brand>/<lang>.json, apply to page
   - No backend, no database, no auto-translation API calls.
   - [HUMAN] ?brand=&lang= convention, vi.json fallback, 4 langs (vi/ja/ko/zh).
   - [AI-ASSISTED: Claude] Implementation below written by Claude per that spec.
   ============================================================ */
(function () {
  'use strict';

  // [HUMAN] Only 4 languages. Default vi.
  var LANGS = ['vi', 'ja', 'ko', 'zh'];
  var DEFAULT_LANG = 'vi';
  var LANG_CODE = { vi: 'VI', ja: 'JA', ko: 'KO', zh: 'ZH' };

  var qs = new URLSearchParams(location.search);
  function pickLang(l) { return LANGS.indexOf(l) >= 0 ? l : DEFAULT_LANG; }

  // Shared state — page scripts read window.I18N / window.__currentLang
  window.__currentLang = pickLang(qs.get('lang'));
  window.I18N = { vi: {} };
  window.DTR = { brand: null, meta: null, ready: false };

  var cache = {};
  // [AI-ASSISTED: Claude] no-cache so judges always see fresh JSON after deploy
  function fetchJSON(path) {
    if (cache[path]) return Promise.resolve(cache[path]);
    return fetch(path, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(path + ' -> HTTP ' + r.status);
      return r.json();
    }).then(function (j) { cache[path] = j; return j; });
  }

  // Missing/empty key -> fall back to vi.json. Missing lang file -> pure vi.
  function loadDict(base, lang) {
    return fetchJSON(base + '/vi.json').then(function (vi) {
      if (lang === 'vi') return { vi: vi, dict: vi };
      return fetchJSON(base + '/' + lang + '.json').then(function (d) {
        var dict = {}, k;
        for (k in vi) dict[k] = vi[k];
        for (k in d) if (d[k] !== undefined && d[k] !== '') dict[k] = d[k];
        return { vi: vi, dict: dict };
      }, function () {
        console.warn('[core] missing ' + lang + '.json -> fallback vi');
        return { vi: vi, dict: vi };
      });
    });
  }

  // ---------- Theme / sections / media (language-independent) ----------
  function applyMeta(meta) {
    var root = document.documentElement, k, i;
    var theme = meta.theme || {};
    for (k in theme) if (k.indexOf('--') === 0) root.style.setProperty(k, theme[k]);

    // [AI-ASSISTED: Claude] Hidden sections also hide their nav / FAB / mobile links
    var sec = meta.sections || {};
    var sections = document.querySelectorAll('[data-section]');
    for (i = 0; i < sections.length; i++) {
      (function (el) {
        var on = sec[el.getAttribute('data-section')] !== false;
        el.hidden = !on;
        el.style.display = on ? '' : 'none';
        if (el.id) {
          var links = document.querySelectorAll('a[href="#' + el.id + '"]');
          for (var j = 0; j < links.length; j++) {
            var li = links[j].closest('li, .fab-item') || links[j];
            li.style.display = on ? '' : 'none';
          }
        }
      })(sections[i]);
    }

    // [AI-ASSISTED: Claude] Media URLs from meta; hiddenMedia hides img + parent card
    var m = meta.media || {};
    var imgs = document.querySelectorAll('[data-media]');
    for (i = 0; i < imgs.length; i++) {
      var key = imgs[i].getAttribute('data-media');
      if (m[key]) {
        if (imgs[i].tagName === 'LINK') imgs[i].href = m[key];
        else imgs[i].src = m[key];
      }
    }
    var fav = document.querySelector('link[rel="icon"]');
    if (fav && m.favicon) fav.href = m.favicon;
    var hidden = meta.hiddenMedia || [];
    for (i = 0; i < hidden.length; i++) {
      var hid = document.querySelectorAll('[data-media="' + hidden[i] + '"]');
      for (var h = 0; h < hid.length; h++) {
        hid[h].style.display = 'none';
        var card = hid[h].closest('.tech-icon');
        if (card) card.style.display = 'none';
      }
    }

    // [AI-ASSISTED: Claude] Configurable outbound links
    var links = meta.links || {};
    var partnerBtn = document.querySelector('#partner .btn-ghost');
    if (partnerBtn && links.partnerLearnMore) {
      partnerBtn.onclick = function () { window.open(links.partnerLearnMore, '_blank', 'noopener'); };
    }
    var globeLink = document.querySelector('.globe-learn-more');
    if (globeLink && links.globeLearnMore) globeLink.href = links.globeLearnMore;
  }

  // ---------- Text ----------
  function setMeta(sel, attr, val, createProp) {
    var el = document.querySelector(sel);
    if (!el && createProp) {
      el = document.createElement('meta');
      el.setAttribute('property', createProp);
      document.head.appendChild(el);
    }
    if (el && val) el.setAttribute(attr, val);
  }

  function applyDict(dict, lang) {
    document.documentElement.lang = lang;
    var i, els, v;
    els = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < els.length; i++) { v = dict[els[i].getAttribute('data-i18n')]; if (v !== undefined) els[i].textContent = v; }
    els = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < els.length; i++) { v = dict[els[i].getAttribute('data-i18n-html')]; if (v !== undefined) els[i].innerHTML = v; }
    els = document.querySelectorAll('[data-i18n-placeholder]');
    for (i = 0; i < els.length; i++) { v = dict[els[i].getAttribute('data-i18n-placeholder')]; if (v !== undefined) els[i].placeholder = v; }
    els = document.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < els.length; i++) { v = dict[els[i].getAttribute('data-i18n-aria')]; if (v !== undefined) els[i].setAttribute('aria-label', v); }

    if (dict['seo.title']) document.title = dict['seo.title'];
    var md = document.querySelector('meta[name="description"]');
    if (!md) { md = document.createElement('meta'); md.setAttribute('name', 'description'); document.head.appendChild(md); }
    if (dict['seo.description']) md.setAttribute('content', dict['seo.description']);
    setMeta('meta[property="og:title"]', 'content', dict['seo.title'], 'og:title');
    setMeta('meta[property="og:description"]', 'content', dict['seo.description'], 'og:description');
    setMeta('meta[property="og:locale"]', 'content', lang, 'og:locale');
    var logo = window.DTR.meta && window.DTR.meta.media && window.DTR.meta.media.logo;
    if (logo) setMeta('meta[property="og:image"]', 'content', logo, 'og:image');

    var btns = document.querySelectorAll('[data-lang]');
    for (i = 0; i < btns.length; i++) btns[i].classList.toggle('active', btns[i].getAttribute('data-lang') === lang);
    var lc = document.getElementById('langCode');
    if (lc) lc.textContent = LANG_CODE[lang] || lang.toUpperCase();
  }

  // ---------- Public API: switch language WITHOUT reload ----------
  window.applyLanguage = function (lang) {
    lang = pickLang(lang);
    var base = window.DTR.brand ? window.DTR.brand.path : null;
    window.__currentLang = lang;
    if (!base) return Promise.resolve();
    return loadDict(base, lang).then(function (res) {
      window.I18N = { vi: res.vi };
      window.I18N[lang] = res.dict;
      applyDict(res.dict, lang);
      var u = new URL(location.href);
      u.searchParams.set('lang', lang);
      history.replaceState(null, '', u);
      document.dispatchEvent(new CustomEvent('dtr:lang', { detail: { lang: lang } }));
    }, showError);
  };

  function showError(err) {
    console.error('[core]', err);
    if (document.getElementById('dtrErr')) return;
    var d = document.createElement('div');
    d.id = 'dtrErr';
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#2a1215;color:#ffb4b4;border:1px solid #6b2a2f;padding:10px 14px;border-radius:10px;font:13px system-ui';
    d.textContent = 'Không đọc được dữ liệu (' + err.message + '). Hãy mở trang bằng Live Server hoặc host http(s), không mở trực tiếp file://.';
    document.body.appendChild(d);
  }

  function boot() {
    fetchJSON('data/brands.json').then(function (idx) {
      var id = qs.get('brand') || idx.default;
      var brands = idx.brands || [];
      var brand = null, i;
      for (i = 0; i < brands.length; i++) if (brands[i].id === id) brand = brands[i];
      if (!brand) for (i = 0; i < brands.length; i++) if (brands[i].id === idx.default) brand = brands[i];
      window.DTR.brand = brand;
      return fetchJSON(brand.path + '/meta.json');
    }).then(function (meta) {
      window.DTR.meta = meta;
      applyMeta(meta);
      return window.applyLanguage(window.__currentLang);
    }).then(function () {
      window.DTR.ready = true;
    }, showError);
  }

  // Header language switch (VI | JA | KO | ZH)
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('#langSeg [data-lang]') : null;
    if (b) window.applyLanguage(b.getAttribute('data-lang'));
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
