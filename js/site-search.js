(function () {
  'use strict';

  const HISTORY_KEY = 'dtr_search_history';
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, ' ').trim();

  function buildIndex(catalog) {
    const brands = new Map((catalog.brands || []).filter(Boolean).map(brand => [brand.id, brand.name]));
    const categories = new Map((catalog.categories || []).filter(Boolean).map(category => [category.id, category.name]));
    const products = (catalog.products || []).filter(product => product?.id && product.name).map(product => ({
      title: product.name,
      type: 'Sản phẩm',
      detail: [brands.get(product.brand), categories.get(product.category)].filter(Boolean).join(' · '),
      price: Number.isFinite(Number(product.price)) ? Number(product.price).toLocaleString('vi-VN') + 'đ' : '',
      href: 'detail_product_hero.html?product=' + encodeURIComponent(product.id),
      keywords: [product.id, product.desc, product.brand, brands.get(product.brand), categories.get(product.category)].join(' ')
    }));
    const movies = (catalog.cinemaData?.movies || []).filter(movie => movie?.id && movie.title).map(movie => ({
      title: movie.title,
      type: 'Phim',
      detail: [movie.genre, movie.duration].filter(Boolean).join(' · '),
      href: 'detail_cinema.html?movie=' + encodeURIComponent(movie.id),
      keywords: movie.desc || ''
    }));
    const pages = [
      ['Trang giới thiệu', 'index.html', 'DTR liên hệ hành trình mạng lưới'],
      ['Danh mục sản phẩm', 'category.html', 'mua sắm điện tử công nghiệp kỹ thuật số'],
      ['Ưu đãi hôm nay', 'deals.html', 'khuyến mãi giảm giá'],
      ['Đặt vé xem phim', 'cinema.html', 'rạp lịch chiếu khu vực'],
      ['Đơn hàng và vận chuyển', 'services.html', 'tra cứu vận đơn tracking lịch sử đơn hàng'],
      ['Thanh toán', '12.html', 'giỏ hàng đơn mua'],
      ['Quản lý cửa hàng', 'about/manager.html', 'manager banner bố cục thương hiệu']
    ].map(([title, href, keywords]) => ({ title, href, keywords, type: 'Trang', detail: 'Mở trang' }));
    return products.concat(movies, pages).map(item => ({ ...item, normalizedTitle: normalize(item.title), searchText: normalize([item.title, item.detail, item.keywords].join(' ')) }));
  }

  function findResults(index, query) {
    const normalized = normalize(query);
    if (normalized.length < 2) return [];
    const terms = normalized.split(' ');
    return index.filter(item => terms.every(term => item.searchText.includes(term))).map(item => ({
      ...item,
      score: item.normalizedTitle === normalized ? 3 : item.normalizedTitle.startsWith(normalized) ? 2 : item.normalizedTitle.includes(normalized) ? 1 : 0
    })).sort((first, second) => second.score - first.score || first.title.localeCompare(second.title, 'vi'));
  }

  function init() {
    const input = document.getElementById('searchInput');
    const submit = document.getElementById('searchBtn');
    if (!input || !submit || input.dataset.siteSearchReady) return;
    input.dataset.siteSearchReady = 'true';
    let index = [];
    let timer;
    let composing = false;
    const region = document.createElement('section');
    region.id = 'siteSearchResults';
    region.className = 'site-search-results';
    region.setAttribute('aria-label', 'Kết quả tìm kiếm');
    region.hidden = true;
    input.parentElement.after(region);
    input.type = 'search';
    input.setAttribute('aria-label', 'Tìm sản phẩm, phim hoặc trang trong website');
    input.setAttribute('aria-controls', region.id);
    input.autocomplete = 'off';
    input.maxLength = 160;
    submit.setAttribute('aria-label', 'Tìm kiếm');

    function readHistory() {
      try {
        const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        return Array.isArray(stored) ? stored.filter(value => typeof value === 'string' && value.trim() && value.length <= 160).slice(0, 5) : [];
      } catch (error) {
        return [];
      }
    }
    function saveQuery() {
      const query = input.value.trim();
      if (normalize(query).length < 2) return;
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify([query, ...readHistory().filter(value => normalize(value) !== normalize(query))].slice(0, 5)));
      } catch (error) {
        input.dataset.historyAvailable = 'false';
      }
    }
    function appendText(tag, className, text, parent) {
      const element = document.createElement(tag);
      element.className = className;
      element.textContent = text;
      parent.appendChild(element);
      return element;
    }
    function render() {
      region.replaceChildren();
      const query = input.value.trim();
      region.hidden = false;
      const status = appendText('p', 'site-search-status', '', region);
      status.setAttribute('role', 'status');
      if (!query) {
        const history = readHistory();
        if (!history.length) { region.hidden = true; return; }
        status.textContent = 'Tìm kiếm gần đây';
        history.forEach(value => {
          const button = appendText('button', 'site-search-recent', value, region);
          button.type = 'button';
          button.addEventListener('click', () => { input.value = value; render(); input.focus(); });
        });
        const clear = appendText('button', 'site-search-clear', 'Xóa lịch sử tìm kiếm', region);
        clear.type = 'button';
        clear.addEventListener('click', () => {
          try { localStorage.removeItem(HISTORY_KEY); region.hidden = true; }
          catch (error) { status.textContent = 'Không xóa được lịch sử. Kiểm tra quyền lưu trữ của trình duyệt.'; }
        });
        return;
      }
      if (!window.DTR?.ready) { status.textContent = 'Đang tải dữ liệu tìm kiếm…'; return; }
      if (normalize(query).length < 2) { status.textContent = 'Nhập ít nhất 2 ký tự để tìm kiếm.'; return; }
      const results = findResults(index, query);
      status.textContent = results.length + ' kết quả cho “' + query + '”';
      if (!results.length) {
        region.insertAdjacentHTML('beforeend', window.DTRUI.emptyStateMarkup({ icon: 'search', title: 'Chưa tìm thấy kết quả phù hợp', message: 'Thử tên sản phẩm, thương hiệu hoặc tên phim ngắn hơn. Bạn có thể nhập tiếng Việt không dấu.', actionLabel: 'Xem danh mục sản phẩm', actionHref: 'category.html' }));
        return;
      }
      ['Sản phẩm', 'Phim', 'Trang'].forEach(type => {
        const matches = results.filter(result => result.type === type);
        if (!matches.length) return;
        appendText('h3', 'site-search-heading', type + ' · ' + matches.length, region);
        matches.slice(0, type === 'Sản phẩm' ? 8 : 4).forEach(result => {
          const link = document.createElement('a');
          link.className = 'site-search-result';
          link.href = result.href;
          const content = appendText('span', 'site-search-result-copy', '', link);
          appendText('span', 'site-search-result-title', result.title, content);
          appendText('span', 'site-search-result-detail', result.detail, content);
          if (result.price) appendText('span', 'site-search-result-price', result.price, link);
          link.addEventListener('click', saveQuery);
          region.appendChild(link);
        });
        if (matches.length > 8 && type === 'Sản phẩm') appendText('p', 'site-search-status', 'Đang hiện 8 sản phẩm phù hợp nhất. Thêm từ khóa để thu hẹp kết quả.', region);
      });
    }
    const submitSearch = () => {
      clearTimeout(timer);
      render();
      saveQuery();
    };
    input.addEventListener('input', () => {
      clearTimeout(timer);
      if (!composing) timer = setTimeout(render, 160);
    });
    input.addEventListener('compositionstart', () => { composing = true; clearTimeout(timer); });
    input.addEventListener('compositionend', () => { composing = false; render(); });
    input.addEventListener('focus', () => { if (!input.value.trim()) render(); });
    input.addEventListener('keydown', event => {
      if (event.isComposing) return;
      if (event.key === 'Enter') { event.preventDefault(); submitSearch(); }
      if (event.key === 'ArrowDown') {
        const first = region.querySelector('a, button');
        if (first) { event.preventDefault(); first.focus(); }
      }
      if (event.key === 'Escape') { clearTimeout(timer); region.hidden = true; input.blur(); }
    });
    submit.addEventListener('click', submitSearch);
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        input.focus();
        input.select();
      }
      if (event.key === 'Escape' && region.contains(document.activeElement)) { clearTimeout(timer); input.focus(); region.hidden = true; }
    });
    document.addEventListener('click', event => {
      if (event.target.closest('#resetCatFilterBtn')) { clearTimeout(timer); input.value = ''; region.hidden = true; }
    }, true);
    const ready = () => {
      index = buildIndex(window.DTR.catalog);
      if (input.value.trim()) render();
    };
    document.addEventListener('dtr:ready', ready);
    if (window.DTR?.ready) ready();
    const incoming = new URLSearchParams(location.search).get('q');
    if (incoming) { input.value = incoming.slice(0, 160); render(); }
    if (location.hash === '#searchInput') input.focus();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
