/* ==========================================================================
   apply-config.js — ÁP CẤU HÌNH TỪ manager.html (TRÌNH QUẢN LÝ NỘI DUNG)
   manager.html lưu cấu hình vào localStorage (khoá 'dtrmart.config'). Script
   này đọc rồi GHI ĐÈ lên index.html: logo góc trái, ảnh giới thiệu, tiêu đề
   tab, đoạn gõ màn hình chào, và các nội dung từ điển (intro.desc,
   footer.brand.desc). Nếu không có cấu hình -> index giữ nội dung mặc định.
   PHẢI NẠP: tu-dien.js -> apply-config.js -> (các script còn lại).
   ========================================================================== */
(function () {
  var raw = null;
  try { raw = localStorage.getItem('dtrmart.config'); } catch (e) { return; }
  if (!raw) return;

  var cfg;
  try { cfg = JSON.parse(raw); } catch (e) { return; }
  if (!cfg || typeof cfg !== 'object') return;

  window.DTR = window.DTR || {};
  window.DTR.config = cfg;

  function httpUrl(v) { return typeof v === 'string' && /^https?:\/\//.test(v); }

  /* 1) Chữ "Mart" — màn hình chào + logo góc trái (nav) */
  if (cfg.mart) {
    var wm = document.querySelector('.w-mart');
    if (wm) wm.textContent = cfg.mart;
    var mk = document.querySelector('.logo-text .market');
    if (mk) mk.textContent = '-' + cfg.mart;
  }

  /* 2) Logo hình ảnh thương hiệu — góc trái: thay cả ô vuông M + chữ DTR-Mart */
  if (httpUrl(cfg.logo)) {
    var navLogo = document.getElementById('navLogo');
    if (navLogo) {
      navLogo.src = cfg.logo;
      navLogo.style.display = 'inline-block';
    }
    var mark = document.querySelector('.nav .logo-mark');
    if (mark) mark.style.display = 'none';
    var lt = document.querySelector('.nav .logo-text');
    if (lt) lt.style.display = 'none';

    var footerLink = document.querySelector('.footer-brand .logo');
    if (footerLink) {
      var fm = footerLink.querySelector('.logo-mark');
      var ft = footerLink.querySelector('.logo-text');
      if (fm) fm.style.display = 'none';
      if (ft) ft.style.display = 'none';
      if (!footerLink.querySelector('.footer-logo-img')) {
        var fi = document.createElement('img');
        fi.className = 'footer-logo-img';
        fi.alt = 'Logo';
        footerLink.appendChild(fi);
      }
      var fImg = footerLink.querySelector('.footer-logo-img');
      fImg.src = cfg.logo;
      fImg.style.display = 'inline-block';
    }
  }

  /* 3) Ảnh giới thiệu doanh nghiệp (intro) */
  if (httpUrl(cfg.introImage)) {
    var img = document.querySelector('.intro-logo');
    if (img) img.src = cfg.introImage;
  }

  /* 4) Tiêu đề tab */
  if (cfg.title) document.title = cfg.title;

  /* 4b) Favicon tuỳ chỉnh — thay icon M mặc định */
  if (httpUrl(cfg.favicon)) {
    var icons = document.querySelectorAll('link[rel="icon"]');
    for (var i = icons.length - 1; i >= 0; i--) icons[i].parentNode.removeChild(icons[i]);
    var fav = document.createElement('link');
    fav.rel = 'icon';
    fav.href = cfg.favicon;
    document.head.appendChild(fav);
  }

  /* 5) Dòng gõ màn hình chào — man-hinh-chao.js đọc window.DTR.config.typed */

  /* 6) Từ điển nội dung (9 ngôn ngữ) */
  if (typeof I18N !== 'undefined') {
    var langs = ['vi', 'en-US', 'en-GB', 'zh', 'ko', 'ja', 'fr', 'de', 'es'];
    function fill(key, text) {
      if (!text) return;
      var o = {};
      langs.forEach(function (l) { o[l] = text; });
      I18N[key] = o;
    }
    fill('intro.desc', cfg.introDesc);
    if (cfg.footerDesc) {
      fill('footer.brand.desc', cfg.footerDesc);
      var fd = document.querySelector('[data-i18n="footer.brand.desc"]');
      if (fd) fd.textContent = cfg.footerDesc;
    }
  }
})();