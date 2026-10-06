/* ==========================================================================
   dich-thuat.js — DỊCH UI THEO NGÔN NGỮ
   Tách từ index.html, không đổi logic: script dòng 2099–2130.
   applyLanguage(lang): áp từ điển vào mọi [data-i18n]/[data-i18n-html]/[data-i18n-placeholder]; gọi window.setCurrentLang (do dieu-phoi.js cung cấp). Xuất window.applyLanguage.
   ========================================================================== */
function applyLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const dict = I18N[key];
    if (!dict) return;
    const val = dict[lang] || dict['en-US'] || dict.vi;
    if (val !== undefined) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    const dict = I18N[key];
    if (!dict) return;
    const val = dict[lang] || dict['en-US'] || dict.vi;
    if (val !== undefined) el.innerHTML = val;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const dict = I18N[key];
    if (!dict) return;
    const val = dict[lang] || dict['en-US'] || dict.vi;
    if (val !== undefined) el.placeholder = val;
  });

  document.documentElement.lang = lang;

  if (typeof window.setCurrentLang === 'function') {
    window.setCurrentLang(lang);
  }
}
window.applyLanguage = applyLanguage;