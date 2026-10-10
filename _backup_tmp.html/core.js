/* ============================================================
   core.js — Lõi White Label: đọc data/<brand>/<lang>.json và áp vào trang
   - Không backend, không DB, KHÔNG gọi API dịch tự động.
   - [HUMAN] Quy ước ?brand=...&lang=... và fallback vi.json do yêu cầu dự án.
   - [AI-ASSISTED: Claude] Phần cài đặt bên dưới được Claude viết theo yêu cầu đó.
   ============================================================ */
(function () {
  'use strict';

  // [HUMAN] Chỉ hỗ trợ 4 ngôn ngữ: Việt – Nhật – Hàn – Trung. Mặc định vi.
  const LANGS = ['vi', 'ja', 'ko', 'zh'];
  const DEFAULT_LANG = 'vi';
  const META = {
    vi: { flag: '🇻🇳', code: 'VI' }, ja: { flag: '🇯🇵', code: 'JA' },
    ko: { flag: '🇰🇷', code: 'KO' }, zh: { flag: '🇨🇳', code: 'ZH' }
  };

  const qs = new URLSearchParams(location.search);
  const pickLang = (l) => (LANGS.includes(l) ? l : DEFAULT_LANG);

  // Trạng thái dùng chung — các script cũ của trang đọc window.I18N / __currentLang
  window.__currentLang = pickLang(qs.get('lang'));
  window.I18N = { vi: {} };
  window.DTR = { brand: null, meta: null, ready: false };

  const cache = {};
  // [AI-ASSISTED: Claude] no-cache để máy B luôn thấy JSON mới sau khi deploy
  async function getJSON(path) {
    if (cache[path]) return cache[path];
    const r = await fetch(path, { cache: 'no-cache' });
    if (!r.ok) throw new Error(path + ' → HTTP ' + r.status);
    return (cache[path] = await r.json());
  }

  // Thiếu key (hoặc rỗng) → lấy từ vi.json. Thiếu cả file ngôn ngữ → dùng nguyên vi.json.
  async function loadDict(base, lang) {
    const vi = await getJSON(base + '/vi.json');
    if (lang === 'vi') return { vi, dict: vi };
    let d = {};
    try { d = await getJSON(base + '/' + lang + '.json'); }
    catch (e) { console.warn('[core] thiếu', lang + '.json → fallback vi'); }
    const dict = { ...vi };
    for (const k in d) if (d[k] !== undefined && d[k] !== '') dict[k] = d[k];
    return { vi, dict };
  }

  // ---------- Áp dụng theme / section / media (dùng chung cho mọi ngôn ngữ) ----------
  function applyMeta(meta) {
    const root = document.documentElement;
    for (const k in (meta.theme || {})) if (k.startsWith('--')) root.style.setProperty(k, meta.theme[k]);

    const sec = meta.sections || {};
    document.querySelectorAll('[data-section]').forEach((el) => {
      const on = sec[el.dataset.section] !== false;
      el.hidden = !on;
      el.style.display = on ? '' : 'none';
      // ẩn luôn link điều hướng trỏ tới section đã tắt
      if (el.id) document.querySelectorAll('a[href="#' + el.id + '"]').forEach((a) => {
        const li = a.closest('li, .fab-item') || a; a.dataset.off = on ? '' : '1'; li.style.display = on ? '' : 'none';
      });
    });

    const m = meta.media || {};
    document.querySelectorAll('[data-media]').forEach((img) => { if (m[img.dataset.media]) img.src = m[img.dataset.media]; });
    const fav = document.querySelector('link[rel="icon"]');
    if (fav && m.favicon) fav.href = m.favicon;
  }

  // ---------- Áp dụng văn bản ----------
  function setMeta(sel, attr, val, create) {
    let el = document.querySelector(sel);
    if (!el && create) { el = document.createElement('meta'); el.setAttribute(create[0], create[1]); document.head.appendChild(el); }
    if (el && val) el.setAttribute(attr, val);
  }

  function applyDict(dict, lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { const v = dict[el.dataset.i18n]; if (v !== undefined) el.textContent = v; });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { const v = dict[el.dataset.i18nHtml]; if (v !== undefined) el.innerHTML = v; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { const v = dict[el.dataset.i18nPlaceholder]; if (v !== undefined) el.placeholder = v; });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => { const v = dict[el.dataset.i18nAria]; if (v !== undefined) el.setAttribute('aria-label', v); });

    // SEO
    if (dict['seo.title']) document.title = dict['seo.title'];
    setMeta('meta[name="description"]', 'content', dict['seo.description']);
    setMeta('meta[property="og:title"]', 'content', dict['seo.title'], ['property', 'og:title']);
    setMeta('meta[property="og:description"]', 'content', dict['seo.description'], ['property', 'og:description']);
    setMeta('meta[property="og:locale"]', 'content', lang, ['property', 'og:locale']);
    const logo = window.DTR.meta && window.DTR.meta.media && window.DTR.meta.media.logo;
    if (logo) setMeta('meta[property="og:image"]', 'content', logo, ['property', 'og:image']);

    // Trạng thái nút chọn ngôn ngữ
    document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
    const m = META[lang];
    const lc = document.getElementById('langCode'), lf = document.getElementById('langFlag');
    if (lc) lc.textContent = m.code; if (lf) lf.textContent = m.flag;
  }

  // ---------- Cầu nối với module SkyWatch (iframe cô lập) ----------
  // [AI-ASSISTED: Claude] Gửi ngôn ngữ + theme sang iframe; iframe báo chiều cao để không có thanh cuộn kép
  function syncSkywatch() {
    const f = document.getElementById('swFrame');
    if (!f || !f.contentWindow) return;
    f.contentWindow.postMessage({ type: 'dtr:sync', lang: window.__currentLang, theme: (window.DTR.meta || {}).theme || {} }, '*');
  }
  addEventListener('message', (e) => {
    const f = document.getElementById('swFrame');
    if (!f || e.source !== f.contentWindow || !e.data) return;
    if (e.data.type === 'dtr:ready') syncSkywatch();
    if (e.data.type === 'dtr:height' && Number.isFinite(e.data.h)) f.style.height = Math.min(Math.max(e.data.h, 400), 2400) + 'px';
  });

  // ---------- API công khai: chuyển ngôn ngữ KHÔNG reload ----------
  window.applyLanguage = async function (lang) {
    lang = pickLang(lang);
    const base = window.DTR.brand ? window.DTR.brand.path : null;
    window.__currentLang = lang;
    if (!base) return;
    try {
      const { vi, dict } = await loadDict(base, lang);
      window.I18N = { vi, [lang]: dict };
      applyDict(dict, lang);
      const u = new URL(location.href); u.searchParams.set('lang', lang);
      history.replaceState(null, '', u);   // chỉ đổi URL, không tải lại trang
      syncSkywatch();
      document.dispatchEvent(new CustomEvent('dtr:lang', { detail: { lang } }));
    } catch (err) { showError(err); }
  };

  function showError(err) {
    console.error('[core]', err);
    if (document.getElementById('dtrErr')) return;
    const d = document.createElement('div'); d.id = 'dtrErr';
    d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#2a1215;color:#ffb4b4;border:1px solid #6b2a2f;padding:10px 14px;border-radius:10px;font:13px system-ui';
    d.textContent = 'Không đọc được dữ liệu (' + err.message + '). Hãy mở trang bằng Live Server hoặc host http(s), không mở trực tiếp file://.';
    document.body.appendChild(d);
  }

  async function boot() {
    try {
      const idx = await getJSON('data/brands.json');
      const id = qs.get('brand') || idx.default;
      const brand = idx.brands.find((b) => b.id === id) || idx.brands.find((b) => b.id === idx.default);
      window.DTR.brand = brand;
      window.DTR.meta = await getJSON(brand.path + '/meta.json');
      applyMeta(window.DTR.meta);
      await window.applyLanguage(window.__currentLang);
      window.DTR.ready = true;
    } catch (err) { showError(err); }
  }

  // Công tắc ngôn ngữ trên header (VI | JA | KO | ZH)
  document.addEventListener('click', (e) => {
    const b = e.target.closest('#langSeg [data-lang]');
    if (b) window.applyLanguage(b.dataset.lang);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
