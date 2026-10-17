(function () {
  'use strict';

  const icons = {
    cart: '<path d="M3 4h2l2 12h11l3-9H6M9 20h.01M17 20h.01"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'
  };
  const escapeText = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  function emptyStateMarkup(options) {
    const { icon = 'search', title, message, actionLabel, actionHref } = options;
    const safeHref = typeof actionHref === 'string' && /^(?:[a-zA-Z0-9_-]+\.html(?:[?#].*)?|#[a-zA-Z][\w-]*)$/.test(actionHref);
    const action = actionLabel && safeHref
      ? '<a class="interface-empty__action" href="' + escapeText(actionHref) + '">' + escapeText(actionLabel) + '</a>'
      : '';
    return '<div class="interface-empty" role="status"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (icons[icon] || icons.search) + '</svg><p class="interface-empty__title">' + escapeText(title) + '</p>' + (message ? '<p class="interface-empty__message">' + escapeText(message) + '</p>' : '') + action + '</div>';
  }

  window.DTRUI = { emptyStateMarkup };

  function initLoadingSurface() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', 'Đang tải nội dung');
    const image = loader.querySelector('.loader-logo');
    const mark = loader.querySelector('.loader-mark');
    if (!image || !mark) return;
    const fallback = () => { image.hidden = true; mark.classList.add('is-missing-logo'); };
    image.addEventListener('error', fallback);
    image.addEventListener('load', () => { image.hidden = false; mark.classList.remove('is-missing-logo'); });
    if (image.complete && !image.naturalWidth) fallback();
  }

  /* ========================================================
     WHITE LABEL BRANDING SYNC & THEME ENGINE
     ======================================================== */
  const BRAND_PRESETS = {
    'brand-1': {
      id: 'brand-1',
      label: 'DTR—Mart',
      theme: {
        '--lime': '#c5ff3d',
        '--lime-rgb': '197,255,61',
        '--cream': '#fff9cb',
        '--pink': '#ffb0c4',
        '--bg': '#0b0d12',
        '--bg-2': '#11141b',
        '--bg-3': '#181d27',
        '--color-primary': '#c5ff3d',
        '--color-bg': '#0b0d12',
        '--wl-primary': '#c5ff3d',
        '--wl-secondary': '#38bdf8',
        '--wl-bg-dark': '#0b0d12',
        '--wl-card-bg': '#11141b',
        '--font-heading': "'Be Vietnam Pro', sans-serif"
      },
      media: {
        logo: "https://scontent.fsgn2-9.fna.fbcdn.net/v/t1.15752-9/837090217_1838708297575574_9035449063746888478_n.png?stp=dst-png_s2048x2048&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHsTynfi-mpXvKnUmCSGCRlA9phdcaf0jYD2mF1xp_SNnjTUSsilZXeH2NqzkxuOQxCJHrbIz9eAS_adSA-BkAu&_nc_ohc=GkPaAjM9dKEQ7kNvwFYBwKf&_nc_oc=AdqFB0LFlvR5XVV6WucxYdlAAmDEuB-fqHyWDTG1f1AebXJ89MjrCaC1xlLGcqDkGn-iGcXihccdjMJr_Dg22JkF&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_ss=7b2a8&oh=03_Q7cD6gHbprmEUCeKhqstWvVHxMK80sJlG1fBiMN2XVkzSy33kA&oe=6AF05B29"
      }
    },
    'brand-2': {
      id: 'brand-2',
      label: 'NovaCargo',
      theme: {
        '--lime': '#38bdf8',
        '--lime-rgb': '56,189,248',
        '--cream': '#e0f2fe',
        '--pink': '#818cf8',
        '--bg': '#07101e',
        '--bg-2': '#0c1b33',
        '--bg-3': '#102445',
        '--color-primary': '#38bdf8',
        '--color-bg': '#07101e',
        '--wl-primary': '#38bdf8',
        '--wl-secondary': '#a3e635',
        '--wl-bg-dark': '#07101e',
        '--wl-card-bg': '#0c1b33',
        '--font-heading': "'Space Grotesk', sans-serif"
      },
      media: {
        logo: "https://scontent.fsgn2-9.fna.fbcdn.net/v/t1.15752-9/837090217_1838708297575574_9035449063746888478_n.png?stp=dst-png_s2048x2048&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHsTynfi-mpXvKnUmCSGCRlA9phdcaf0jYD2mF1xp_SNnjTUSsilZXeH2NqzkxuOQxCJHrbIz9eAS_adSA-BkAu&_nc_ohc=GkPaAjM9dKEQ7kNvwFYBwKf&_nc_oc=AdqFB0LFlvR5XVV6WucxYdlAAmDEuB-fqHyWDTG1f1AebXJ89MjrCaC1xlLGcqDkGn-iGcXihccdjMJr_Dg22JkF&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_ss=7b2a8&oh=03_Q7cD6gHbprmEUCeKhqstWvVHxMK80sJlG1fBiMN2XVkzSy33kA&oe=6AF05B29"
      }
    },
    'brand-3': {
      id: 'brand-3',
      label: 'Sakura Trade',
      theme: {
        '--lime': '#ff9bb8',
        '--lime-rgb': '255,155,184',
        '--cream': '#fff0f4',
        '--pink': '#ffd27a',
        '--bg': '#120b0f',
        '--bg-2': '#1a1016',
        '--bg-3': '#261520',
        '--color-primary': '#ff9bb8',
        '--color-bg': '#120b0f',
        '--wl-primary': '#ff9bb8',
        '--wl-secondary': '#ffd27a',
        '--wl-bg-dark': '#120b0f',
        '--wl-card-bg': '#1a1016',
        '--font-heading': "'Be Vietnam Pro', sans-serif"
      },
      media: {
        logo: "https://scontent.fsgn2-9.fna.fbcdn.net/v/t1.15752-9/837090217_1838708297575574_9035449063746888478_n.png?stp=dst-png_s2048x2048&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHsTynfi-mpXvKnUmCSGCRlA9phdcaf0jYD2mF1xp_SNnjTUSsilZXeH2NqzkxuOQxCJHrbIz9eAS_adSA-BkAu&_nc_ohc=GkPaAjM9dKEQ7kNvwFYBwKf&_nc_oc=AdqFB0LFlvR5XVV6WucxYdlAAmDEuB-fqHyWDTG1f1AebXJ89MjrCaC1xlLGcqDkGn-iGcXihccdjMJr_Dg22JkF&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_ss=7b2a8&oh=03_Q7cD6gHbprmEUCeKhqstWvVHxMK80sJlG1fBiMN2XVkzSy33kA&oe=6AF05B29"
      }
    }
  };

  function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return null;
    let h = hex.trim().replace(/^#/, '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    if (h.length !== 6) return null;
    const num = parseInt(h, 16);
    return ((num >> 16) & 255) + ', ' + ((num >> 8) & 255) + ', ' + (num & 255);
  }

  function applyBranding(customMeta) {
    try {
      const qs = new URLSearchParams(window.location.search);
      const urlBrand = qs.get('brand');
      if (urlBrand && BRAND_PRESETS[urlBrand]) {
        try { localStorage.setItem('dtr_current_brand', urlBrand); } catch (e) {}
      }

      const curBrandId = urlBrand || localStorage.getItem('dtr_current_brand') || 'brand-1';
      const basePreset = BRAND_PRESETS[curBrandId] || BRAND_PRESETS['brand-1'];

      let savedMeta = null;
      if (!customMeta) {
        try {
          const raw = localStorage.getItem('dtr_brand_meta');
          if (raw) savedMeta = JSON.parse(raw);
        } catch (e) {}
      }

      const meta = customMeta || savedMeta || basePreset;
      const theme = Object.assign({}, basePreset.theme, meta?.theme || {});
      const root = document.documentElement;
      if (!root) return;

      Object.keys(theme).forEach(function (k) {
        if (theme[k]) root.style.setProperty(k, theme[k]);
      });

      const primary = theme['--lime'] || theme['--color-primary'] || theme['primaryColor'] || '#c5ff3d';
      root.style.setProperty('--lime', primary);
      root.style.setProperty('--color-primary', primary);
      root.style.setProperty('--wl-primary', primary);
      const rgb = hexToRgb(primary);
      if (rgb) root.style.setProperty('--lime-rgb', rgb);

      const bg = theme['--bg'] || theme['--color-bg'] || theme['bgDark'] || '#0b0d12';
      root.style.setProperty('--bg', bg);
      root.style.setProperty('--color-bg', bg);
      root.style.setProperty('--wl-bg-dark', bg);

      const bg2 = theme['--bg-2'] || theme['--bg-3'] || theme['cardBg'] || '#11141b';
      root.style.setProperty('--bg-2', bg2);
      root.style.setProperty('--bg-3', bg2);
      root.style.setProperty('--wl-card-bg', bg2);

      const font = theme['--font-heading'] || theme['fontFamily'];
      if (font) {
        root.style.setProperty('--font-heading', font);
        if (document.body) document.body.style.fontFamily = font;
      }

      const effects = meta?.effects;
      if (effects && typeof effects === 'object' && document.body) {
        if (effects.grid === false) document.body.classList.remove('cyber-grid-bg');
        else if (effects.grid === true) document.body.classList.add('cyber-grid-bg');

        if (effects.glow === false) {
          root.style.setProperty('--shadow-neon-card', 'none');
          root.classList.add('no-neon-glow');
        } else {
          root.style.removeProperty('--shadow-neon-card');
          root.classList.remove('no-neon-glow');
        }
      }

      const logoUrl = meta?.media?.logo || basePreset.media?.logo;
      const brandName = meta?.name || basePreset.label || 'DTR—Market';
      const logoBox = document.getElementById('brandLogoContainer');
      const footBox = document.getElementById('brandFooterLogoContainer');

      if (logoUrl) {
        if (logoBox) {
          logoBox.innerHTML = '<img src="' + logoUrl + '" alt="Brand Logo" class="w-auto h-8 sm:h-9 object-contain" onerror="this.style.display=\'none\'">';
        }
        if (footBox) {
          footBox.innerHTML = '<img src="' + logoUrl + '" alt="Brand Logo" class="w-auto h-8 sm:h-9 object-contain" onerror="this.style.display=\'none\'"><span class="text-base font-extrabold text-white">' + brandName + '</span>';
        }
        document.querySelectorAll('img[data-media="logo"], .loader-logo, .footer-brand img').forEach(function (img) {
          img.src = logoUrl;
        });
      } else {
        if (footBox) {
          footBox.innerHTML = '<div class="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--lime)]/50 text-[var(--lime)] font-extrabold text-sm bg-[var(--lime)]/15">DTR</div><span class="text-base font-extrabold text-white">' + brandName + '</span>';
        }
      }

      // Inject dynamic CSS rules to guarantee mobile FAB, panel, cinema buttons, and product hero buttons update instantly
      let dynStyle = document.getElementById('dtr-brand-dynamic-styles');
      if (!dynStyle) {
        dynStyle = document.createElement('style');
        dynStyle.id = 'dtr-brand-dynamic-styles';
        document.head.appendChild(dynStyle);
      }
      const pColor = primary;
      const rgbColor = rgb || '163, 230, 53';
      dynStyle.textContent = `
        :root {
          --lime: ${pColor} !important;
          --lime-rgb: ${rgbColor} !important;
          --color-primary: ${pColor} !important;
          --wl-primary: ${pColor} !important;
          --ed-lime: ${pColor} !important;
          --ed-lime-hover: ${pColor} !important;
          --ed-lime-soft: rgba(${rgbColor}, 0.08) !important;
          --ed-lime-line: rgba(${rgbColor}, 0.28) !important;
        }
        /* Mobile FAB Button & Highlights */
        .dtr-fab, #dtrFabBtn {
          background: ${pColor} !important;
          color: #040914 !important;
          box-shadow: 0 10px 32px rgba(${rgbColor}, 0.45), 0 0 0 1px rgba(${rgbColor}, 0.4) !important;
        }
        .dtr-fab-panel {
          border-top: 1px solid rgba(${rgbColor}, 0.35) !important;
        }
        .dtr-fab-panel-tag {
          color: ${pColor} !important;
        }
        .dtr-fab-close:hover {
          background: rgba(${rgbColor}, 0.15) !important;
          border-color: rgba(${rgbColor}, 0.4) !important;
          color: ${pColor} !important;
        }
        .dtr-fab-item:hover {
          background: rgba(${rgbColor}, 0.08) !important;
          border-color: rgba(${rgbColor}, 0.45) !important;
        }
        .dtr-fab-item-icon {
          background: rgba(${rgbColor}, 0.15) !important;
          border-color: rgba(${rgbColor}, 0.35) !important;
          color: ${pColor} !important;
        }
        /* Mobile Nav */
        .dtr-mobile-nav {
          border-color: rgba(${rgbColor}, 0.3) !important;
        }
        .dtr-mobile-nav a:hover, .dtr-mobile-nav button:hover,
        .dtr-mobile-nav a.active, .dtr-mobile-nav button.active {
          color: ${pColor} !important;
          background: rgba(${rgbColor}, 0.12) !important;
        }
        /* Product Hero 3D Cam Buttons */
        body[data-page="product-hero"] .pd-cam-btn:hover, body[data-page="product-hero"] .pd-cam-btn.active {
          border-color: ${pColor} !important;
          color: ${pColor} !important;
          background: rgba(${rgbColor}, 0.12) !important;
        }
        .lang-seg button.active, .fab-lang.active {
          background: ${pColor} !important;
          color: #040914 !important;
        }
        /* Product Hero Detail Page Buy Now */
        body[data-page="product-hero"] .pd-btn-buy, #pdBuyNow {
          background: ${pColor} !important;
          color: #040914 !important;
        }
        body[data-page="product-hero"] .pd-btn-buy:hover, #pdBuyNow:hover {
          filter: brightness(1.15) !important;
        }
        body[data-page="product-hero"] .pd-btn-cart:hover, #pdAddCart:hover {
          border-color: ${pColor} !important;
          color: ${pColor} !important;
          background: rgba(${rgbColor}, 0.08) !important;
        }
        body[data-page="product-hero"] .pd-opt.active {
          border-color: ${pColor} !important;
          color: ${pColor} !important;
          background: rgba(${rgbColor}, 0.1) !important;
        }
        /* Cinema Order & Search Buttons */
        #submitCinemaOrderBtn, #findMoviesByLocBtn, .mp-cart-checkout {
          background: ${pColor} !important;
          color: #040914 !important;
          box-shadow: 0 0 20px rgba(${rgbColor}, 0.4) !important;
        }
        #submitCinemaOrderBtn:hover:not(:disabled), #findMoviesByLocBtn:hover:not(:disabled), .mp-cart-checkout:hover {
          filter: brightness(1.15) !important;
        }
        .seat-cell.selected {
          background: ${pColor} !important;
          color: #040914 !important;
          border-color: ${pColor} !important;
        }
        /* Hero dots */
        .hero-dot.active, .hero-dot.bg-\\[\\#a3e635\\] {
          background: ${pColor} !important;
          box-shadow: 0 0 8px ${pColor} !important;
        }
        /* Utility color overrides */
        .text-\\[\\#a3e635\\] { color: ${pColor} !important; }
        .bg-\\[\\#a3e635\\] { background-color: ${pColor} !important; }
        .border-\\[\\#a3e635\\] { border-color: ${pColor} !important; }
        .border-\\[\\#a3e635\\]\\/50 { border-color: rgba(${rgbColor}, 0.5) !important; }
        .border-\\[\\#a3e635\\]\\/40 { border-color: rgba(${rgbColor}, 0.4) !important; }
        .bg-\\[\\#a3e635\\]\\/15 { background-color: rgba(${rgbColor}, 0.15) !important; }
        .bg-\\[\\#a3e635\\]\\/20 { background-color: rgba(${rgbColor}, 0.2) !important; }
        .via-\\[\\#a3e635\\] { --tw-gradient-stops: var(--tw-gradient-from), ${pColor}, var(--tw-gradient-to) !important; }
        .focus\\:border-\\[\\#a3e635\\]:focus { border-color: ${pColor} !important; }
        .hover\\:bg-\\[\\#b5f347\\]:hover { filter: brightness(1.12) !important; }
        .hover\\:text-\\[\\#a3e635\\]:hover { color: ${pColor} !important; }
        .hover\\:border-\\[\\#a3e635\\]:hover { border-color: ${pColor} !important; }
        .shadow-neon-lime { box-shadow: 0 0 25px rgba(${rgbColor}, 0.45) !important; }
        [data-cf-group].bg-\\[\\#a3e635\\] { background-color: ${pColor} !important; border-color: ${pColor} !important; }
        [data-cat].bg-\\[\\#a3e635\\] { background-color: ${pColor} !important; border-color: ${pColor} !important; }
      `;
    } catch (err) {
      console.warn('[BrandSync]', err);
    }
  }

  /* ========================================================
     GLOBAL 4-LANGUAGE (VI, EN, JA, ZH) I18N ENGINE
     ======================================================== */
  const I18N_DICT = {
    vi: {
      "topbar.back": "Trang chủ",
      "brand.tag": "Digital Tech Resolution",
      "login.title.1": "Thương mại",
      "login.title.2": "không biên giới,",
      "login.title.3": "vận hành",
      "login.title.4": "bằng dữ liệu.",
      "login.b1": "50+ quốc gia",
      "login.b2": "38K+ sản phẩm",
      "login.b3": "12K+ đối tác",
      "login.title": "Đăng nhập",
      "login.sub": "Chào mừng trở lại hệ thống DTR.",
      "login.email": "Email",
      "login.password": "Mật khẩu",
      "login.remember": "Lưu phiên đăng nhập",
      "login.forgot": "Quên mật khẩu?",
      "login.submit": "Đăng nhập",
      "login.noAccount": "Chưa có tài khoản?",
      "login.create": "Đăng ký ngay",
      "register.title": "Đăng ký tài khoản",
      "register.sub": "Tạo tài khoản mới để trải nghiệm DTR.",
      "register.name": "Họ và tên",
      "register.confirm": "Xác nhận mật khẩu",
      "register.submit": "Tạo tài khoản",
      "register.hasAccount": "Đã có tài khoản?",
      "register.err.name": "Tên tối thiểu 2 ký tự",
      "register.err.email": "Email không hợp lệ hoặc đã tồn tại",
      "register.err.pass": "Mật khẩu tối thiểu 6 ký tự",
      "register.err.confirm": "Mật khẩu xác nhận không khớp",
      "register.haveAccount": "Đã có tài khoản?",
      "register.login": "Đăng nhập",
      "nav.home": "Trang chủ",
      "nav.store": "Cửa hàng",
      "nav.manager": "Quản lý",
      "fab.storeDesc": "Mua sắm và đặt vé",
      "nav.categories": "Danh mục sản phẩm",
      "nav.orders": "Đơn hàng",
      "nav.category": "Danh mục",
      "nav.electronics": "Điện tử",
      "nav.deals": "Ưu đãi",
      "nav.cinema": "Phim rạp",
      "nav.services": "Dịch vụ",
      "nav.account": "Tài khoản",
      "nav.cart": "Giỏ hàng",
      "search.placeholder": "Tìm sản phẩm, phim hoặc trang…",
      "btn.addToCart": "Thêm vào giỏ",
      "btn.buyNow": "Mua ngay",
      "btn.viewDetail": "Xem chi tiết",
      "btn.seeAll": "Xem tất cả",
      "cat.all": "Tất cả sản phẩm",
      "cat.filterSync": "Lọc đồng bộ theo danh mục",
      "cat.select": "Chọn danh mục",
      "cat.reset": "Bỏ lọc",
      "promo.title": "Sản phẩm ưu đãi",
      "promo.subtitle": "Giảm giá sự kiện lễ · Flash Sale giới hạn",
      "best.title": "Sản phẩm bán chạy",
      "best.subtitle": "Xếp hạng từ bán chạy nhất",
      "cart.title": "Giỏ hàng DTR-Market",
      "cart.total": "Tổng cộng",
      "cart.clear": "Xóa hết",
      "cart.checkout": "Thanh toán ngay",
      "modal.fieldPre": "Khám phá hệ sinh thái DTR-Market",
      "modal.fieldTitle": "Chọn Lĩnh Vực Sản Phẩm",
      "modal.fieldSub": "Chọn lĩnh vực để mở trang danh mục tương ứng",
      "field.cinema": "Phim rạp",
      "field.cinemaDesc": "Đặt vé & chọn ghế",
      "field.industrial": "Công Nghiệp",
      "field.industrialDesc": "Thiết bị & Tự động hóa",
      "field.electronics": "Điện Tử",
      "field.electronicsDesc": "Điện thoại, Máy tính, Gear",
      "field.digital": "Kĩ Thuật Số",
      "field.digitalDesc": "Trò chơi, Nhạc, Gift Card",
      "modal.filterPre": "Bộ lọc nâng cao",
      "modal.filterTitle": "Chọn Danh Mục Sản Phẩm",
      "modal.filterSub": "Chọn lĩnh vực hoặc danh mục để lọc sản phẩm.",
      "modal.filterSearchPlaceholder": "Tìm nhanh danh mục...",
      "modal.filterGroup": "Lĩnh vực:",
      "modal.filterCat": "Danh mục sản phẩm:",
      "fab.quick": "Truy cập nhanh",
      "fab.title": "Chọn chức năng",
      "fab.homeDesc": "Về Marketplace",
      "fab.dealsDesc": "Deal hôm nay",
      "fab.servicesDesc": "Hỗ trợ khách hàng",
      "fab.about": "Về DTR",
      "fab.aboutDesc": "Trang giới thiệu",
      "fab.manager": "Manager",
      "fab.managerDesc": "Cấu hình hệ thống",
      "fab.accountDesc": "Đăng nhập / Đăng ký",
      "fab.nav.home": "Trang chủ",
      "fab.nav.home.desc": "Về landing page DTR—Mart",
      "fab.nav.login": "Đăng nhập",
      "fab.nav.login.desc": "Chuyển về form đăng nhập",
      "fab.nav.register": "Đăng ký",
      "fab.nav.register.desc": "Tạo tài khoản mới",
      "fab.nav.journey": "Hành trình",
      "fab.nav.journey.desc": "Câu chuyện doanh nghiệp",
      "fab.nav.support": "Hỗ trợ",
      "fab.nav.support.desc": "Tra cứu đơn hàng",
      "fab.nav.partner": "Đại lý",
      "fab.nav.partner.desc": "Trở thành đối tác",
      "fab.tag": "Truy cập nhanh",
      "fab.lang": "Ngôn ngữ",
      "ui.prodDesc": "Mô tả sản phẩm",
      "ui.prodDescSub": "Thông số & tính năng chi tiết của sản phẩm",
      "ui.sold": "Đã bán",
      "ui.compare": "So sánh",
      "ui.wishlist": "Yêu thích",
      "ui.emptyPromo": "Không có sản phẩm ưu đãi nào.",
      "ui.emptyProducts": "Không tìm thấy sản phẩm nào phù hợp.",
      "footer.desc": "Nền tảng thương mại số toàn cầu — kết nối doanh nghiệp với 50+ quốc gia bằng công nghệ và dữ liệu thế hệ mới.",
      "footer.platform": "Nền tảng",
      "footer.shop": "Cửa hàng",
      "footer.electronics": "Thiết bị điện tử",
      "footer.deals": "Ưu đãi hôm nay",
      "footer.cinema": "Rạp chiếu phim",
      "footer.orders": "Đơn hàng",
      "footer.company": "Công ty",
      "footer.about": "Về DTR",
      "footer.journey": "Hành trình",
      "footer.partner": "Trở thành đại lý",
      "footer.manager": "Manager chính",
      "footer.support": "Hỗ trợ & Bảo mật",
      "footer.help": "Trung tâm trợ giúp",
      "footer.terms": "Điều khoản dịch vụ",
      "footer.privacy": "Chính sách bảo mật",
      "footer.status": "Trạng thái hệ thống:",
      "footer.good": "Tốt",
      "footer.copyright": "Digital Tech Resolution — Made with precision in Vietnam.",
      "footer.terms_short": "Điều khoản",
      "footer.privacy_short": "Quyền riêng tư",
      "footer.cookies": "Cookies",
      "cinema.back_mp": "Về Marketplace",
      "cinema.step1": "Bước 1 · Xác định tọa độ khách hàng",
      "cinema.title": "Chọn Vị Trí Hiện Tại Để Tìm Phim Khả Thi",
      "cinema.desc": "Vui lòng chọn đầy đủ từ Quốc gia → Thành Phố → Quận/Phường/Tiểu Bang → Đường để hệ thống lọc suất chiếu gần bạn nhất.",
      "cinema.lbl_country": "1. Quốc gia",
      "cinema.lbl_city": "2. Thành Phố",
      "cinema.lbl_district": "3. Quận / Phường / Tiểu Bang",
      "cinema.lbl_street": "4. Đường",
      "cinema.status_incomplete": "Trạng thái: Chưa hoàn tất chọn địa điểm 4 cấp.",
      "cinema.btn_find": "Hiển thị tất cả Phim khả thi tại đây",
      "cinema.available_movies": "Phim Đang Chiếu Khả Thi Tại Khu Vực Của Bạn",
      "detail_cinema.back": "Quay lại",
      "detail_cinema.step1": "Chọn Thương Hiệu Rạp Thầu Chiếu Phim Tại Khu Vực",
      "detail_cinema.step2": "Chọn Khung Giờ Lịch Chiếu",
      "detail_cinema.step3": "Sơ Đồ Ghế Phòng Chiếu",
      "detail_cinema.step4": "Chọn Sản Phẩm Đi Kèm",
      "detail_cinema.step4_desc": "Chọn combo bắp nước hoặc quà lưu niệm theo phim.",
      "detail_cinema.summary_title": "Thông Tin Đặt Vé & Combo",
      "detail_cinema.lbl_movie": "Phim:",
      "detail_cinema.lbl_location": "Vị trí:",
      "detail_cinema.lbl_theater": "Rạp:",
      "detail_cinema.lbl_showtime": "Suất chiếu:",
      "detail_cinema.lbl_seats": "Ghế",
      "detail_cinema.lbl_combos": "Combo:",
      "detail_cinema.lbl_total": "Tổng:",
      "detail_cinema.btn_submit": "Xác Nhận Order Vé & Combo",
      "cinema.seat_normal": "Thường",
      "cinema.seat_vip": "VIP",
      "cinema.seat_selected": "Chọn",
      "cinema.seat_occupied": "Đã đặt",
      "cinema.screen": "MÀN HÌNH (SCREEN)",
      "cinema.unselected": "Chưa chọn",
      "cinema.no_combo": "Không có",
      "cinema.area": "Khu vực: "
    },
    en: {
      "topbar.back": "Home",
      "brand.tag": "Digital Tech Resolution",
      "login.title.1": "Commerce",
      "login.title.2": "without borders,",
      "login.title.3": "driven by",
      "login.title.4": "pure data.",
      "login.b1": "50+ countries",
      "login.b2": "38K+ products",
      "login.b3": "12K+ partners",
      "login.title": "Sign In",
      "login.sub": "Welcome back to DTR platform.",
      "login.email": "Email address",
      "login.password": "Password",
      "login.remember": "Remember me",
      "login.forgot": "Forgot password?",
      "login.submit": "Sign In",
      "login.noAccount": "Don't have an account?",
      "login.create": "Register now",
      "register.title": "Create Account",
      "register.sub": "Join DTR global marketplace today.",
      "register.name": "Full name",
      "register.confirm": "Confirm password",
      "register.submit": "Sign Up",
      "register.hasAccount": "Already registered?",
      "register.err.name": "Name must be at least 2 characters",
      "register.err.email": "Invalid email or already registered",
      "register.err.pass": "Password must be at least 6 characters",
      "register.err.confirm": "Passwords do not match",
      "register.haveAccount": "Already have an account?",
      "register.login": "Sign In",
      "nav.home": "Home",
      "nav.store": "Store",
      "nav.manager": "Manager",
      "fab.storeDesc": "Shop & Book Tickets",
      "nav.categories": "Categories",
      "nav.orders": "Orders",
      "nav.category": "Categories",
      "nav.electronics": "Electronics",
      "nav.deals": "Deals",
      "nav.cinema": "Cinema",
      "nav.services": "Services",
      "nav.account": "Account",
      "nav.cart": "Cart",
      "search.placeholder": "Search products, movies or pages…",
      "btn.addToCart": "Add to Cart",
      "btn.buyNow": "Buy Now",
      "btn.viewDetail": "Details",
      "btn.seeAll": "See All",
      "cat.all": "All Products",
      "cat.filterSync": "Synchronized category filter",
      "cat.select": "Categories",
      "cat.reset": "Clear Filter",
      "promo.title": "Promotional Products",
      "promo.subtitle": "Holiday sales event · Limited flash sale",
      "best.title": "Best Sellers",
      "best.subtitle": "Ranked by total purchases",
      "cart.title": "DTR-Market Cart",
      "cart.total": "Total",
      "cart.clear": "Clear All",
      "cart.checkout": "Checkout Now",
      "modal.fieldPre": "Explore DTR-Market Ecosystem",
      "modal.fieldTitle": "Select Product Category",
      "modal.fieldSub": "Choose a field to browse corresponding categories",
      "field.cinema": "Cinema",
      "field.cinemaDesc": "Book tickets & select seats",
      "field.industrial": "Industrial",
      "field.industrialDesc": "Equipment & Automation",
      "field.electronics": "Electronics",
      "field.electronicsDesc": "Phones, Computers, Gear",
      "field.digital": "Digital Goods",
      "field.digitalDesc": "Games, Music, Gift Cards",
      "modal.filterPre": "Advanced Filters",
      "modal.filterTitle": "Select Product Category",
      "modal.filterSub": "Select a category or group to filter items.",
      "modal.filterSearchPlaceholder": "Quick category search...",
      "modal.filterGroup": "Sectors:",
      "modal.filterCat": "Product Categories:",
      "fab.quick": "Quick Access",
      "fab.title": "Select Action",
      "fab.homeDesc": "To Marketplace",
      "fab.dealsDesc": "Today's Deals",
      "fab.servicesDesc": "Customer Support",
      "fab.about": "About DTR",
      "fab.aboutDesc": "Introductory Page",
      "fab.manager": "Manager",
      "fab.managerDesc": "System Settings",
      "fab.accountDesc": "Sign In / Register",
      "fab.nav.home": "Home",
      "fab.nav.home.desc": "Back to DTR landing page",
      "fab.nav.login": "Sign In",
      "fab.nav.login.desc": "Switch to sign in form",
      "fab.nav.register": "Sign Up",
      "fab.nav.register.desc": "Create a new account",
      "fab.nav.journey": "Journey",
      "fab.nav.journey.desc": "Company milestones & story",
      "fab.nav.support": "Support",
      "fab.nav.support.desc": "Order tracking & assistance",
      "fab.nav.partner": "Partners",
      "fab.nav.partner.desc": "Become an authorized partner",
      "fab.tag": "Quick Access",
      "fab.lang": "Language",
      "ui.prodDesc": "Product Description",
      "ui.prodDescSub": "Detailed specifications & product features",
      "ui.sold": "Sold",
      "ui.compare": "Compare",
      "ui.wishlist": "Favorite",
      "ui.emptyPromo": "No promotional products available.",
      "ui.emptyProducts": "No matching products found.",
      "footer.desc": "Global digital commerce platform — connecting businesses across 50+ countries with next-generation data and tech.",
      "footer.platform": "Platform",
      "footer.shop": "Shop",
      "footer.electronics": "Electronics",
      "footer.deals": "Today's Deals",
      "footer.cinema": "Cinema",
      "footer.orders": "Orders",
      "footer.company": "Company",
      "footer.about": "About DTR",
      "footer.journey": "Journey",
      "footer.partner": "Become a Partner",
      "footer.manager": "Main Manager",
      "footer.support": "Support & Security",
      "footer.help": "Help Center",
      "footer.terms": "Terms of Service",
      "footer.privacy": "Privacy Policy",
      "footer.status": "System Status:",
      "footer.good": "Operational",
      "footer.copyright": "Digital Tech Resolution — Made with precision in Vietnam.",
      "footer.terms_short": "Terms",
      "footer.privacy_short": "Privacy",
      "footer.cookies": "Cookies",
      "cinema.back_mp": "Back to Marketplace",
      "cinema.step1": "Step 1 · Customer Location Coordinates",
      "cinema.title": "Select Location to Find Available Movies",
      "cinema.desc": "Please select Country → City → District/State → Street so the system can locate the nearest showtimes.",
      "cinema.lbl_country": "1. Country",
      "cinema.lbl_city": "2. City",
      "cinema.lbl_district": "3. District / State",
      "cinema.lbl_street": "4. Street",
      "cinema.status_incomplete": "Status: 4-level location selection incomplete.",
      "cinema.btn_find": "Show all available movies here",
      "cinema.available_movies": "Available Movies in Your Area",
      "detail_cinema.back": "Back",
      "detail_cinema.step1": "1. Select Cinema Brand in Your Area",
      "detail_cinema.step2": "2. Select Screening Showtime",
      "detail_cinema.step3": "3. Theater Seat Layout",
      "detail_cinema.step4": "4. Select Concessions & Add-ons",
      "detail_cinema.step4_desc": "Choose popcorn, drinks or limited movie merchandise.",
      "detail_cinema.summary_title": "Booking Summary & Combos",
      "detail_cinema.lbl_movie": "Movie:",
      "detail_cinema.lbl_location": "Location:",
      "detail_cinema.lbl_theater": "Cinema:",
      "detail_cinema.lbl_showtime": "Showtime:",
      "detail_cinema.lbl_seats": "Seats",
      "detail_cinema.lbl_combos": "Combos:",
      "detail_cinema.lbl_total": "Total:",
      "detail_cinema.btn_submit": "Confirm Tickets & Combos Order",
      "cinema.seat_normal": "Standard",
      "cinema.seat_vip": "VIP",
      "cinema.seat_selected": "Selected",
      "cinema.seat_occupied": "Booked",
      "cinema.screen": "SCREEN",
      "cinema.unselected": "Not selected",
      "cinema.no_combo": "None",
      "cinema.area": "Area: "
    },
    ja: {
      "topbar.back": "ホーム",
      "brand.tag": "Digital Tech Resolution",
      "login.title.1": "国境なき",
      "login.title.2": "デジタル商業,",
      "login.title.3": "データで駆動する",
      "login.title.4": "グローバル基盤。",
      "login.b1": "50カ国以上",
      "login.b2": "3.8万点の商品",
      "login.b3": "1.2万社の提携",
      "login.title": "ログイン",
      "login.sub": "DTRシステムへようこそ。",
      "login.email": "メールアドレス",
      "login.password": "パスワード",
      "login.remember": "ログイン状態を保持",
      "login.forgot": "パスワードをお忘れですか？",
      "login.submit": "ログイン",
      "login.noAccount": "アカウントをお持ちでない方",
      "login.create": "今すぐ新規登録",
      "register.title": "新規アカウント作成",
      "register.sub": "DTRの最新サービスをご利用いただけます。",
      "register.name": "お名前",
      "register.confirm": "パスワード確認",
      "register.submit": "登録する",
      "register.hasAccount": "アカウントをお持ちの方",
      "register.err.name": "お名前は2文字以上で入力してください",
      "register.err.email": "有効なメールアドレスを入力してください",
      "register.err.pass": "パスワードは6文字以上で入力してください",
      "register.err.confirm": "確認用パスワードが一致しません",
      "register.haveAccount": "アカウントをお持ちの方",
      "register.login": "ログイン",
      "nav.home": "ホーム",
      "nav.store": "ストア",
      "nav.manager": "管理",
      "fab.storeDesc": "ショッピング＆予約",
      "nav.categories": "商品カテゴリ",
      "nav.orders": "注文履歴",
      "nav.category": "カテゴリー",
      "nav.electronics": "電子機器",
      "nav.deals": "特売セール",
      "nav.cinema": "映画チケット",
      "nav.services": "サービス",
      "nav.account": "アカウント",
      "nav.cart": "カート",
      "search.placeholder": "商品、映画、ページを検索…",
      "btn.addToCart": "カートに入れる",
      "btn.buyNow": "今すぐ購入",
      "btn.viewDetail": "詳細を見る",
      "btn.seeAll": "すべて見る",
      "cat.all": "すべての商品",
      "cat.filterSync": "カテゴリー別同期フィルター",
      "cat.select": "カテゴリー選択",
      "cat.reset": "フィルター解除",
      "promo.title": "セール対象商品",
      "promo.subtitle": "ホリデーセール · 期間限定フラッシュセール",
      "best.title": "ベストセラー商品",
      "best.subtitle": "売上順ランキング",
      "cart.title": "DTR-Market カート",
      "cart.total": "合計",
      "cart.clear": "全削除",
      "cart.checkout": "お会計へ進む",
      "modal.fieldPre": "DTR-Marketエコシステムを探す",
      "modal.fieldTitle": "製品分野を選択",
      "modal.fieldSub": "分野を選択して該当するカテゴリーを開きます",
      "field.cinema": "映画館",
      "field.cinemaDesc": "座席指定・チケット予約",
      "field.industrial": "産業機器",
      "field.industrialDesc": "設備・自動化システム",
      "field.electronics": "電子機器",
      "field.electronicsDesc": "スマホ・PC・周辺機器",
      "field.digital": "デジタル",
      "field.digitalDesc": "ゲーム・音楽・ギフト券",
      "modal.filterPre": "高度なフィルター",
      "modal.filterTitle": "カテゴリー選択",
      "modal.filterSub": "分野またはカテゴリーで絞り込みます。",
      "modal.filterSearchPlaceholder": "カテゴリーを検索...",
      "modal.filterGroup": "分野:",
      "modal.filterCat": "商品カテゴリー:",
      "fab.quick": "クイックアクセス",
      "fab.title": "機能を選択",
      "fab.homeDesc": "マーケットプレイスへ",
      "fab.dealsDesc": "本日の特売セール",
      "fab.servicesDesc": "カスタマーサポート",
      "fab.about": "DTRについて",
      "fab.aboutDesc": "ご紹介ページ",
      "fab.manager": "管理画面",
      "fab.managerDesc": "システム設定",
      "fab.accountDesc": "ログイン / 新規登録",
      "fab.nav.home": "ホーム",
      "fab.nav.home.desc": "DTR公式トップページへ",
      "fab.nav.login": "ログイン",
      "fab.nav.login.desc": "ログイン画面へ切り替え",
      "fab.nav.register": "新規登録",
      "fab.nav.register.desc": "新しいアカウントを作成",
      "fab.nav.journey": "歩み",
      "fab.nav.journey.desc": "企業の歩みと実績",
      "fab.nav.support": "サポート",
      "fab.nav.support.desc": "注文履歴とサポート窓口",
      "fab.nav.partner": "代理店",
      "fab.nav.partner.desc": "提携パートナーになる",
      "fab.tag": "クイックアクセス",
      "fab.lang": "言語設定",
      "ui.prodDesc": "製品説明",
      "ui.prodDescSub": "製品の仕様と詳細な特徴",
      "ui.sold": "販売済",
      "ui.compare": "比較",
      "ui.wishlist": "お気に入り",
      "ui.emptyPromo": "セール対象商品はありません。",
      "ui.emptyProducts": "該当する商品が見つかりません。",
      "footer.desc": "グローバルデジタル商業基盤 — 次世代の技術とデータで50カ国以上の企業と顧客を繋ぎます。",
      "footer.platform": "プラットフォーム",
      "footer.shop": "ショップ",
      "footer.electronics": "電子機器",
      "footer.deals": "本日のセール",
      "footer.cinema": "映画館",
      "footer.orders": "注文履歴",
      "footer.company": "企業情報",
      "footer.about": "DTRについて",
      "footer.journey": "軌跡と歩み",
      "footer.partner": "パートナー加盟",
      "footer.manager": "管理マネージャー",
      "footer.support": "サポート＆セキュリティ",
      "footer.help": "ヘルプセンター",
      "footer.terms": "利用規約",
      "footer.privacy": "プライバシーポリシー",
      "footer.status": "システム状況:",
      "footer.good": "正常稼働中",
      "footer.copyright": "Digital Tech Resolution — Made with precision in Vietnam.",
      "footer.terms_short": "利用規約",
      "footer.privacy_short": "プライバシー",
      "footer.cookies": "クッキー設定",
      "cinema.back_mp": "マーケットプレイスへ戻る",
      "cinema.step1": "ステップ1 · お客様の位置座標の特定",
      "cinema.title": "現在地を選択して上映中の映画を探す",
      "cinema.desc": "最寄りの上映回を絞り込むため、国 → 都市 → 地区/都道府県 → 通りを順に選択してください。",
      "cinema.lbl_country": "1. 国",
      "cinema.lbl_city": "2. 都市",
      "cinema.lbl_district": "3. 地区 / 都道府県",
      "cinema.lbl_street": "4. 通り / 路線",
      "cinema.status_incomplete": "ステータス: 4段階の地域指定が未完了です。",
      "cinema.btn_find": "この地域で上映可能な全作品を表示",
      "cinema.available_movies": "お近くのエリアで上映中の作品一覧",
      "detail_cinema.back": "戻る",
      "detail_cinema.step1": "1. 上映映画館ブランドを選択",
      "detail_cinema.step2": "2. 上映スケジュール・時間を選択",
      "detail_cinema.step3": "3. シアター座席表",
      "detail_cinema.step4": "4. フード・グッズの追加",
      "detail_cinema.step4_desc": "ポップコーンやドリンク、映画限定グッズを選択。",
      "detail_cinema.summary_title": "予約内容＆コンボ詳細",
      "detail_cinema.lbl_movie": "作品名:",
      "detail_cinema.lbl_location": "場所:",
      "detail_cinema.lbl_theater": "映画館:",
      "detail_cinema.lbl_showtime": "上映回:",
      "detail_cinema.lbl_seats": "座席",
      "detail_cinema.lbl_combos": "コンボ:",
      "detail_cinema.lbl_total": "合計:",
      "detail_cinema.btn_submit": "チケット＆コンボを注文する",
      "cinema.seat_normal": "一般席",
      "cinema.seat_vip": "VIP席",
      "cinema.seat_selected": "選択中",
      "cinema.seat_occupied": "予約済",
      "cinema.screen": "スクリーン (SCREEN)",
      "cinema.unselected": "未選択",
      "cinema.no_combo": "なし",
      "cinema.area": "エリア: "
    },
    zh: {
      "topbar.back": "首页",
      "brand.tag": "Digital Tech Resolution",
      "login.title.1": "无界商业,",
      "login.title.2": "全方位数字化,",
      "login.title.3": "数据驱动",
      "login.title.4": "全球未来。",
      "login.b1": "50+ 国家服务",
      "login.b2": "3.8万+ 数字化商品",
      "login.b3": "1.2万+ 合作伙伴",
      "login.title": "账号登录",
      "login.sub": "欢迎回到 DTR 数字化平台。",
      "login.email": "电子邮箱",
      "login.password": "账户密码",
      "login.remember": "记住登录状态",
      "login.forgot": "忘记密码？",
      "login.submit": "立即登录",
      "login.noAccount": "还没有账号？",
      "login.create": "立即注册",
      "register.title": "注册新账号",
      "register.sub": "创建您的专属 DTR 账户。",
      "register.name": "您的姓名",
      "register.confirm": "确认密码",
      "register.submit": "确认注册",
      "register.hasAccount": "已有账号？",
      "register.err.name": "姓名至少需要2个字符",
      "register.err.email": "邮箱格式不正确或已注册",
      "register.err.pass": "密码长度至少需要6个字符",
      "register.err.confirm": "两次输入的密码不一致",
      "register.haveAccount": "已有账号？",
      "register.login": "立即登录",
      "nav.home": "商城首页",
      "nav.store": "官方商城",
      "nav.manager": "管理后台",
      "fab.storeDesc": "购物选购与影票预订",
      "nav.categories": "商品分类",
      "nav.orders": "我的订单",
      "nav.category": "商品分类",
      "nav.electronics": "电子数码",
      "nav.deals": "今日特惠",
      "nav.cinema": "影院订票",
      "nav.services": "服务支持",
      "nav.account": "我的账户",
      "nav.cart": "购物车",
      "search.placeholder": "搜索商品、电影或页面…",
      "btn.addToCart": "加入购物车",
      "btn.buyNow": "立即购买",
      "btn.viewDetail": "查看详情",
      "btn.seeAll": "查看全部",
      "cat.all": "全部商品",
      "cat.filterSync": "按分类同步筛选",
      "cat.select": "选择分类",
      "cat.reset": "重置筛选",
      "promo.title": "特惠商品",
      "promo.subtitle": "节日活动折扣 · 限时秒杀",
      "best.title": "畅销商品",
      "best.subtitle": "按销量从高到低排序",
      "cart.title": "DTR-Market 购物车",
      "cart.total": "合计",
      "cart.clear": "清空购物车",
      "cart.checkout": "立即结算",
      "modal.fieldPre": "探索 DTR-Market 生态系统",
      "modal.fieldTitle": "选择产品领域",
      "modal.fieldSub": "选择领域以进入对应的产品分类页面",
      "field.cinema": "院线影票",
      "field.cinemaDesc": "在线选座 & 购票",
      "field.industrial": "工业设备",
      "field.industrialDesc": "自动化设备 & 传感器",
      "field.electronics": "电子数码",
      "field.electronicsDesc": "手机、电脑与智能装备",
      "field.digital": "数字商品",
      "field.digitalDesc": "游戏、音乐与礼品卡",
      "modal.filterPre": "高级筛选",
      "modal.filterTitle": "选择商品分类",
      "modal.filterSub": "选择领域或分类以筛选所需商品。",
      "modal.filterSearchPlaceholder": "快速搜索分类...",
      "modal.filterGroup": "领域:",
      "modal.filterCat": "商品分类:",
      "fab.quick": "快捷导航",
      "fab.title": "选择功能",
      "fab.homeDesc": "返回商城首页",
      "fab.dealsDesc": "今日特惠秒杀",
      "fab.servicesDesc": "客户服务与支持",
      "fab.about": "关于 DTR",
      "fab.aboutDesc": "品牌官方介绍",
      "fab.manager": "管理后台",
      "fab.managerDesc": "系统与商城配置",
      "fab.accountDesc": "登录 / 注册新账号",
      "fab.nav.home": "官网首页",
      "fab.nav.home.desc": "返回 DTR 官网主页",
      "fab.nav.login": "账号登录",
      "fab.nav.login.desc": "切换至登录表单",
      "fab.nav.register": "注册账号",
      "fab.nav.register.desc": "创建新的平台账户",
      "fab.nav.journey": "发展历程",
      "fab.nav.journey.desc": "企业历程与故事",
      "fab.nav.support": "服务支持",
      "fab.nav.support.desc": "订单查询与技术支持",
      "fab.nav.partner": "招商合作",
      "fab.nav.partner.desc": "成为官方合作伙伴",
      "fab.tag": "快捷导航",
      "fab.lang": "语言选择",
      "ui.prodDesc": "产品详情描述",
      "ui.prodDescSub": "产品规格参数与详细功能说明",
      "ui.sold": "已售",
      "ui.compare": "对比",
      "ui.wishlist": "收藏",
      "ui.emptyPromo": "暂无特惠商品。",
      "ui.emptyProducts": "未找到匹配的商品。",
      "footer.desc": "全球数字化商业平台 — 以新一代数据与科技连接50多个国家与地区的商业生态。",
      "footer.platform": "平台生态",
      "footer.shop": "商城总览",
      "footer.electronics": "数码电子",
      "footer.deals": "今日特惠",
      "footer.cinema": "院线影城",
      "footer.orders": "订单查询",
      "footer.company": "公司介绍",
      "footer.about": "关于 DTR",
      "footer.journey": "发展历程",
      "footer.partner": "招商合作",
      "footer.manager": "后台管理",
      "footer.support": "服务与安全",
      "footer.help": "帮助中心",
      "footer.terms": "服务条款",
      "footer.privacy": "隐私政策",
      "footer.status": "系统状态:",
      "footer.good": "正常运行",
      "footer.copyright": "Digital Tech Resolution — Made with precision in Vietnam.",
      "footer.terms_short": "条款",
      "footer.privacy_short": "隐私",
      "footer.cookies": "Cookie 设置",
      "cinema.back_mp": "返回商城首页",
      "cinema.step1": "步骤 1 · 确定客户地理坐标",
      "cinema.title": "选择当前地理位置以查找可排期电影",
      "cinema.desc": "请完整选择 国家 → 城市 → 区域/省份 → 街道，以便系统为您匹配最近的放映影城。",
      "cinema.lbl_country": "1. 国家",
      "cinema.lbl_city": "2. 城市",
      "cinema.lbl_district": "3. 区域 / 省份",
      "cinema.lbl_street": "4. 街道",
      "cinema.status_incomplete": "状态: 尚未完整选择四级区域位置。",
      "cinema.btn_find": "显示当前区域所有可上映电影",
      "cinema.available_movies": "您所在区域的热映电影",
      "detail_cinema.back": "返回",
      "detail_cinema.step1": "1. 选择影院品牌",
      "detail_cinema.step2": "2. 选择排片场次时间",
      "detail_cinema.step3": "3. 影厅座位图",
      "detail_cinema.step4": "4. 选择卖品与周边",
      "detail_cinema.step4_desc": "选择爆米花饮料套餐或电影周边纪念品。",
      "detail_cinema.summary_title": "订票与套餐明细",
      "detail_cinema.lbl_movie": "电影:",
      "detail_cinema.lbl_location": "位置:",
      "detail_cinema.lbl_theater": "影院:",
      "detail_cinema.lbl_showtime": "场次:",
      "detail_cinema.lbl_seats": "座位",
      "detail_cinema.lbl_combos": "套餐:",
      "detail_cinema.lbl_total": "合计:",
      "detail_cinema.btn_submit": "确认订票与套餐订单",
      "cinema.seat_normal": "普通席",
      "cinema.seat_vip": "VIP席",
      "cinema.seat_selected": "已选择",
      "cinema.seat_occupied": "已售出",
      "cinema.screen": "银幕 (SCREEN)",
      "cinema.unselected": "未选择",
      "cinema.no_combo": "无",
      "cinema.area": "区域: "
    }
  };

  const LANG_FLAGS = {
    vi: { flag: '🇻🇳', code: 'VI', label: 'Tiếng Việt' },
    en: { flag: '🇬🇧', code: 'EN', label: 'English' },
    ja: { flag: '🇯🇵', code: 'JA', label: '日本語' },
    zh: { flag: '🇨🇳', code: 'ZH', label: '中文' }
  };

  function applyLanguage(targetLang, updateUrl) {
    const validLangs = ['vi', 'en', 'ja', 'zh'];
    let lang = targetLang;
    if (!validLangs.includes(lang)) {
      lang = (new URLSearchParams(window.location.search)).get('lang') || localStorage.getItem('dtr_lang') || 'vi';
      if (!validLangs.includes(lang)) lang = 'vi';
    }

    try {
      localStorage.setItem('dtr_lang', lang);
    } catch (e) {}

    window.__currentLang = lang;

    // Synchronize browser address bar URL ?lang=...
    if (updateUrl !== false) {
      try {
        const u = new URL(window.location.href);
        if (u.searchParams.get('lang') !== lang) {
          u.searchParams.set('lang', lang);
          window.history.replaceState(null, '', u.toString());
        }
      } catch (err) {}
    }

    const aboutDict = (window.ABOUT_I18N_DICTS && (window.ABOUT_I18N_DICTS[lang] || window.ABOUT_I18N_DICTS.vi)) || (window.I18N && (window.I18N[lang] || window.I18N.vi)) || {};
    const dict = Object.assign({}, I18N_DICT[lang] || I18N_DICT.vi, aboutDict);

    if (window.ABOUT_I18N_DICTS) {
      window.I18N = {
        vi: Object.assign({}, I18N_DICT.vi, window.ABOUT_I18N_DICTS.vi || {})
      };
      window.I18N[lang] = dict;
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const k = el.getAttribute('data-i18n');
      if (dict[k]) el.textContent = dict[k];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const k = el.getAttribute('data-i18n-placeholder');
      if (dict[k]) el.placeholder = dict[k];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const k = el.getAttribute('data-i18n-html');
      if (dict[k]) el.innerHTML = dict[k];
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      const k = el.getAttribute('data-i18n-aria');
      if (dict[k]) el.setAttribute('aria-label', dict[k]);
    });

    if (dict['seo.title']) document.title = dict['seo.title'];

    const m = LANG_FLAGS[lang] || LANG_FLAGS.vi;
    document.querySelectorAll('#mpLangFlag').forEach(function (el) { el.textContent = m.flag; });
    document.querySelectorAll('#mpLangCode').forEach(function (el) { el.textContent = m.code; });
    document.querySelectorAll('#langCode').forEach(function (el) { el.textContent = m.code; });

    document.querySelectorAll('[data-lang]').forEach(function (b) {
      const bLang = b.getAttribute('data-lang');
      const active = bLang === lang;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('.lang-seg button, .fab-lang, .dtr-mobile-nav button').forEach(function (b) {
      const bLang = b.getAttribute('data-lang');
      if (bLang) {
        b.classList.toggle('active', bLang === lang);
      }
    });

    // Notify all scripts to re-render localized catalogs
    document.dispatchEvent(new CustomEvent('dtr:lang', { detail: { lang: lang } }));

    if (typeof window.rerenderCurrentPageForLanguage === 'function') {
      window.rerenderCurrentPageForLanguage();
    }
  }

  // Global click listener for language switches across all pages
  document.addEventListener('click', function (e) {
    // 1. Language option button click
    const langBtn = e.target && typeof e.target.closest === 'function' ? e.target.closest('[data-lang]') : null;
    if (langBtn) {
      const selectedLang = langBtn.getAttribute('data-lang');
      if (selectedLang) {
        e.preventDefault();
        applyLanguage(selectedLang, true);
        const openDropdown = document.querySelector('#mpLang.open, .mp-lang.open');
        if (openDropdown) openDropdown.classList.remove('open');
      }
      return;
    }

    // 2. Language dropdown trigger toggle
    const toggleBtn = e.target && typeof e.target.closest === 'function' ? e.target.closest('#mpLangBtn, .mp-lang-btn') : null;
    if (toggleBtn) {
      e.preventDefault();
      e.stopPropagation();
      const parentWrap = toggleBtn.closest('#mpLang, .mp-lang');
      if (parentWrap) parentWrap.classList.toggle('open');
      return;
    }

    // 3. Click outside closes dropdown
    const openMenu = document.querySelector('#mpLang.open, .mp-lang.open');
    if (openMenu && !openMenu.contains(e.target)) {
      openMenu.classList.remove('open');
    }
  });

  window.applyLanguage = applyLanguage;
  window.applyBranding = applyBranding;
  window.DTRBrand = {
    apply: applyBranding,
    setLanguage: applyLanguage,
    presets: BRAND_PRESETS
  };

  window.addEventListener('storage', function (e) {
    if (e.key === 'dtr_brand_meta' || e.key === 'dtr_current_brand') {
      applyBranding();
    }
    if (e.key === 'dtr_lang') {
      applyLanguage(e.newValue, false);
    }
  });

  function boot() {
    initLoadingSurface();
    applyBranding();
    const urlLang = (new URLSearchParams(window.location.search)).get('lang');
    const savedLang = urlLang || localStorage.getItem('dtr_lang') || 'vi';
    applyLanguage(savedLang, !!urlLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
