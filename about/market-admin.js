(function () {
  'use strict';

  let api;
  let catalog = null;
  let dirty = false;
  let entity = 'products';
  let shopPanel = 'campaigns';
  let draftTimer;
  let draftNoticeShown = false;
  let draftPaused = false;
  const DRAFT_KEY = 'dtr_manager_catalog_draft';
  const productSelection = new Set();
  const productFilters = { query: '', brand: '', promotion: 'all' };
  let lastProductEdit = null;
  const HOME = ['heroBanner', 'categories-section', 'promo-products', 'products'];
  const LANDING = ['hero', 'marquee', 'brand', 'journey', 'features', 'cta', 'globe', 'skywatch', 'faq', 'partner'];
  const LABELS = {
    heroBanner: 'Banner chính',
    'categories-section': 'Danh mục',
    'promo-products': 'Sản phẩm ưu đãi',
    products: 'Sản phẩm',
    hero: 'Phần mở đầu',
    marquee: 'Dải thông tin',
    brand: 'Thương hiệu',
    journey: 'Hành trình',
    features: 'Dịch vụ',
    cta: 'Lời mời liên hệ',
    globe: 'Mạng lưới',
    skywatch: 'Tra cứu',
    faq: 'Câu hỏi thường gặp',
    partner: 'Đại lý'
  };
  const COLLECTIONS = {
    products: 'Sản phẩm',
    giftcards: 'Thẻ quà tặng',
    categories: 'Danh mục',
    brands: 'Thương hiệu',
    majorGroups: 'Nhóm hàng',
    movies: 'Phim',
    theaters: 'Rạp phim',
    combos: 'Combo rạp',
    banners: 'Banner'
  };
  const FIELDS = {
    products: [
      'id', 'category', 'brand', 'price', 'priceOld', 'badge', 'isPromo', 'img', 'sold',
      'name', 'name_en', 'name_ja', 'name_zh',
      'desc', 'desc_en', 'desc_ja', 'desc_zh'
    ],
    giftcards: ['id', 'name', 'name_en', 'name_ja', 'name_zh', 'brand', 'priceRange', 'defaultPrice'],
    categories: ['id', 'name', 'group', 'icon'],
    brands: ['id', 'name'],
    majorGroups: ['id', 'name', 'icon', 'desc'],
    banners: ['id', 'brandId', 'brandName', 'title', 'subtitle', 'img'],
    movies: ['id', 'title', 'genre', 'duration', 'age', 'rating', 'basePrice', 'img', 'desc'],
    theaters: ['id', 'brandName', 'badge', 'surcharge', 'showtimes', 'occupiedSeats'],
    combos: ['id', 'name', 'desc', 'price', 'img']
  };
  const FIELD_LABELS = {
    id: 'Mã',
    name: 'Tên SP (VI - Tiếng Việt)',
    name_en: 'Tên SP (EN - English)',
    name_ja: 'Tên SP (JA - 日本語)',
    name_zh: 'Tên SP (ZH - 中文)',
    desc: 'Mô tả SP (VI - Tiếng Việt)',
    desc_en: 'Mô tả SP (EN - English)',
    desc_ja: 'Mô tả SP (JA - 日本語)',
    desc_zh: 'Mô tả SP (ZH - 中文)',
    title: 'Tiêu đề', group: 'Nhóm hàng',
    category: 'Danh mục', brand: 'Thương hiệu', price: 'Giá bán (đ)', priceOld: 'Giá trước giảm (đ)',
    badge: 'Nhãn hiển thị (hot/sale/new)', isPromo: 'Đang khuyến mãi', img: 'Đường dẫn ảnh',
    rating: 'Điểm đánh giá', sold: 'Số lượt bán', priceRange: 'Khoảng giá', defaultPrice: 'Mệnh giá mặc định (đ)',
    icon: 'Biểu tượng', brandId: 'Mã thương hiệu', brandName: 'Tên thương hiệu', subtitle: 'Mô tả ngắn',
    genre: 'Thể loại', duration: 'Thời lượng', age: 'Độ tuổi', basePrice: 'Giá vé từ (đ)',
    surcharge: 'Phụ thu (đ)', showtimes: 'Suất chiếu, cách nhau bằng dấu phẩy',
    occupiedSeats: 'Ghế đã đặt, cách nhau bằng dấu phẩy', startTime: 'Bắt đầu', endTime: 'Kết thúc'
  };
  function persistDraft() {
    if (!dirty || !catalog || draftPaused) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 1, savedAt: new Date().toISOString(), catalog }));
    } catch (error) {
      if (!draftNoticeShown) api.toast('Không lưu được bản nháp. Hãy tải bản sao để giữ các chỉnh sửa.', 'warn');
      draftNoticeShown = true;
    }
  }
  function markDirty() {
    dirty = true;
    draftPaused = false;
    clearTimeout(draftTimer);
    draftTimer = setTimeout(persistDraft, 500);
  }
  function downloadCatalog(value, filename) {
    const url = URL.createObjectURL(new Blob([api.pretty(value)], { type: 'application/json' }));
    const link = node('a', { href: url, download: filename });
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importCatalog(file) {
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('Bản lưu vượt quá 5 MB.');
      const imported = JSON.parse(await file.text());
      if (!imported || typeof imported !== 'object' || Array.isArray(imported)) throw new Error('File không chứa bản lưu cửa hàng.');
      const candidate = Array.isArray(imported.products) ? imported : imported.globalEvent && Array.isArray(imported.banners) ? { ...catalog, promoConfig: imported } : null;
      validate(candidate);
      if (!confirm('Nhập bản lưu sẽ thay các thiết lập hiện tại. Bạn vẫn cần bấm Lưu thay đổi để áp dụng cho cửa hàng. Tiếp tục?')) return;
      catalog = candidate;
      lastProductEdit = null;
      productSelection.clear();
      markDirty();
      render(api.state.currentView);
      api.toast('Đã nhận bản lưu. Kiểm tra nội dung trước khi lưu.', 'ok');
    } catch (error) {
      api.toast('Không nhập được bản lưu: ' + error.message, 'err');
    }
  }
  function renderDataTools(parent) {
    const tools = node('details', { class: 'manager-data-tools' });
    tools.appendChild(node('summary', {}, 'Bản lưu và bản nháp'));
    tools.appendChild(node('p', { class: 'sub' }, 'Bản nháp tự lưu trên thiết bị này. Tải bản sao để chuyển sang máy khác; bản sao không chứa tài khoản hay đơn hàng.'));
    const actions = node('div', { class: 'campaign-actions' });
    button(actions, 'Tải bản sao cửa hàng', () => downloadCatalog(catalog, 'cua-hang-' + new Date().toISOString().slice(0, 10) + '.json'), 'btn btn-sm');
    button(actions, 'Tải riêng ưu đãi', () => downloadCatalog(catalog.promoConfig, 'uu-dai.json'), 'btn btn-sm');
    const picker = node('input', { type: 'file', accept: '.json,application/json', hidden: '', 'aria-label': 'Chọn bản lưu cửa hàng' });
    picker.addEventListener('change', () => {
      importCatalog(picker.files?.[0]);
      picker.value = '';
    });
    actions.appendChild(picker);
    button(actions, 'Nhập bản lưu', () => picker.click(), 'btn btn-sm');
    button(actions, 'Khôi phục bản nháp', () => {
      try {
        const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
        if (!draft || draft.version !== 1) return api.toast('Chưa có bản nháp trên thiết bị này.', 'warn');
        assertCatalogShape(draft.catalog);
        if (!confirm('Khôi phục các chỉnh sửa trong bản nháp?')) return;
        catalog = draft.catalog;
        lastProductEdit = null;
        productSelection.clear();
        markDirty();
        render(api.state.currentView);
        api.toast('Đã khôi phục bản nháp. Bấm Lưu thay đổi khi đã kiểm tra xong.', 'ok');
      } catch (error) {
        api.toast('Không khôi phục được bản nháp: ' + error.message, 'err');
      }
    }, 'btn btn-sm');
    tools.appendChild(actions);
    button(actions, 'Xóa bản nháp đã lưu', () => {
      if (!confirm('Xóa bản nháp trên thiết bị này? Các chỉnh sửa đang mở vẫn được giữ.')) return;
      try {
        clearTimeout(draftTimer);
        draftPaused = true;
        localStorage.removeItem(DRAFT_KEY);
        api.toast('Đã xóa bản nháp. Khi tiếp tục chỉnh sửa, một bản nháp mới sẽ được tạo.', 'ok');
      } catch (error) {
        api.toast('Không xóa được bản nháp trên thiết bị này.', 'err');
      }
    }, 'btn btn-sm');
    parent.appendChild(tools);
  }
  function node(tag, attrs, text) {
    const n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      n.setAttribute(key, attrs[key]);
    });
    if (text != null) n.textContent = text;
    return n;
  }
  function line(parent, label, value, onChange, type, trackChanges = true) {
    const wrap = node('label', {
      class: 'field'
    });
    wrap.appendChild(node('span', {
      class: 'field-label'
    }, label));
    const input = node('input', {
      class: 'inp',
      type: type || 'text'
    });
    if (type === 'checkbox') input.checked = !!value;else input.value = value == null ? '' : value;
    input.addEventListener('input', function () {
      onChange(type === 'checkbox' ? input.checked : type === 'number' ? Number(input.value) : input.value);
      if (trackChanges) markDirty();
    });
    wrap.appendChild(input);
    parent.appendChild(wrap);
    return input;
  }
  function card(parent, title) {
    const c = node('div', {
      class: 'card'
    });
    c.appendChild(node('h2', {
      class: 'card-title'
    }, title));
    parent.appendChild(c);
    return c;
  }
  function button(parent, title, click, cls) {
    const b = node('button', {
      class: cls || 'btn',
      type: 'button'
    }, title);
    b.addEventListener('click', click);
    parent.appendChild(b);
    return b;
  }
  function normalize(saved, known) {
    return (Array.isArray(saved) ? saved : []).concat(known).filter(function (key, index, all) {
      return known.indexOf(key) !== -1 && all.indexOf(key) === index;
    });
  }
  function orderList(parent, order, onMove) {
    order.forEach(function (key, i) {
      const row = node('div', {
        class: 'toggle-row'
      });
      row.appendChild(node('span', {
        class: 'toggle-row-name'
      }, LABELS[key] || key));
      button(row, '↑', function () {
        onMove(i, -1);
      }, 'btn btn-sm').disabled = i === 0;
      button(row, '↓', function () {
        onMove(i, 1);
      }, 'btn btn-sm').disabled = i === order.length - 1;
      parent.appendChild(row);
    });
  }
  function move(list, index, direction) {
    const next = index + direction;
    if (next < 0 || next >= list.length) return;
    const tmp = list[index];
    list[index] = list[next];
    list[next] = tmp;
  }
  function renderLandingOrder(inner) {
    if (!api) return;
    const section = card(inner, 'Thứ tự các phần · thương hiệu hiện tại');
    const order = normalize(api.state.meta.sectionOrder, LANDING);
    api.state.meta.sectionOrder = order;
    orderList(section, order, function (i, d) {
      move(order, i, d);
      api.state.dirty = true;
      api.renderEditor();
    });
  }
  function matchesProduct(product) {
    const query = productFilters.query.trim().toLocaleLowerCase('vi');
    return (!query || [product.name, product.id, product.desc].some(value => String(value || '').toLocaleLowerCase('vi').includes(query)))
      && (!productFilters.brand || product.brand === productFilters.brand)
      && (productFilters.promotion === 'all' || Boolean(product.isPromo) === (productFilters.promotion === 'promo'));
  }
  function applyProductChanges(discount, operation) {
    const selected = catalog.products.filter(product => productSelection.has(product.id));
    if (!selected.length) return api.toast('Chọn ít nhất một sản phẩm.', 'warn');
    if (operation === 'discount' && (!Number.isFinite(discount) || discount <= 0 || discount >= 100)) return api.toast('Nhập mức giảm lớn hơn 0 và nhỏ hơn 100%.', 'err');
    if (operation === 'discount' && selected.some(product => !Number.isFinite(product.price) || product.price < 0)) return api.toast('Kiểm tra giá bán của các sản phẩm đã chọn trước khi giảm giá.', 'err');
    if (!confirm('Cập nhật ' + selected.length + ' sản phẩm đã chọn?')) return;
    lastProductEdit = selected.map(product => ({ id: product.id, price: product.price, priceOld: product.priceOld, isPromo: product.isPromo }));
    selected.forEach(product => {
      if (operation === 'discount') {
        const original = Math.max(Number(product.priceOld) || 0, Number(product.price) || 0);
        product.priceOld = original;
        product.price = Math.round(original * (1 - discount / 100));
        product.isPromo = true;
      } else {
        product.isPromo = operation === 'enable';
      }
    });
    markDirty();
    render('products');
    api.toast('Đã cập nhật sản phẩm. Bấm Lưu thay đổi để áp dụng.', 'ok');
  }
  function renderProductWorkspace(parent) {
    const controls = node('div', { class: 'manager-product-tools' });
    const result = node('div');
    const refresh = () => {
      result.replaceChildren();
      renderCollection(result, 'products');
    };
    const search = line(controls, 'Tìm tên hoặc mã sản phẩm', productFilters.query, value => {
      productFilters.query = value;
      refresh();
    }, 'search', false);
    search.placeholder = 'Nhập tên hoặc mã…';
    const brandLabel = node('label', { class: 'field' });
    brandLabel.appendChild(node('span', { class: 'field-label' }, 'Thương hiệu'));
    const brandPicker = node('select', { class: 'inp' });
    brandPicker.appendChild(node('option', { value: '' }, 'Tất cả thương hiệu'));
    (catalog.brands || []).forEach(brand => brandPicker.appendChild(node('option', { value: brand.id }, brand.name)));
    brandPicker.value = productFilters.brand;
    brandPicker.addEventListener('change', () => {
      productFilters.brand = brandPicker.value;
      refresh();
    });
    brandLabel.appendChild(brandPicker);
    controls.appendChild(brandLabel);
    const promotionLabel = node('label', { class: 'field' });
    promotionLabel.appendChild(node('span', { class: 'field-label' }, 'Ưu đãi'));
    const promotionPicker = node('select', { class: 'inp' });
    [['all', 'Tất cả sản phẩm'], ['promo', 'Đang khuyến mãi'], ['regular', 'Không khuyến mãi']].forEach(([value, text]) => promotionPicker.appendChild(node('option', { value }, text)));
    promotionPicker.value = productFilters.promotion;
    promotionPicker.addEventListener('change', () => {
      productFilters.promotion = promotionPicker.value;
      refresh();
    });
    promotionLabel.appendChild(promotionPicker);
    controls.appendChild(promotionLabel);
    parent.appendChild(controls);
    const bulk = node('details', { class: 'manager-data-tools' });
    const selectionTitle = node('summary', { id: 'managerSelectionTitle' }, 'Chỉnh nhiều sản phẩm · ' + productSelection.size + ' đã chọn');
    bulk.appendChild(selectionTitle);
    const actions = node('div', { class: 'campaign-actions' });
    button(actions, 'Chọn kết quả đang lọc', () => {
      catalog.products.filter(matchesProduct).filter(product => product.id).forEach(product => productSelection.add(product.id));
      selectionTitle.textContent = 'Chỉnh nhiều sản phẩm · ' + productSelection.size + ' đã chọn';
      refresh();
    }, 'btn btn-sm');
    button(actions, 'Bỏ chọn tất cả', () => {
      productSelection.clear();
      selectionTitle.textContent = 'Chỉnh nhiều sản phẩm · 0 đã chọn';
      refresh();
    }, 'btn btn-sm');
    button(actions, 'Bật khuyến mãi', () => applyProductChanges(0, 'enable'), 'btn btn-sm');
    button(actions, 'Tắt khuyến mãi', () => applyProductChanges(0, 'disable'), 'btn btn-sm');
    bulk.appendChild(actions);
    const rate = line(bulk, 'Mức giảm so với giá trước giảm (%)', '', () => {}, 'number', false);
    rate.min = '1';
    rate.max = '99';
    bulk.appendChild(node('p', { class: 'sub' }, 'Giá trước giảm được giữ lại. Tắt khuyến mãi chỉ gỡ sản phẩm khỏi danh sách ưu đãi, không đổi giá bán.'));
    button(bulk, 'Áp dụng mức giảm', () => applyProductChanges(Number(rate.value), 'discount'), 'btn btn-sm');
    button(bulk, 'Hoàn tác lần chỉnh nhóm gần nhất', () => {
      if (!lastProductEdit || !confirm('Khôi phục giá và trạng thái ưu đãi trước lần chỉnh nhóm gần nhất?')) return;
      lastProductEdit.forEach(previous => {
        const product = catalog.products.find(item => item.id === previous.id);
        if (product) Object.assign(product, previous);
      });
      lastProductEdit = null;
      markDirty();
      render('products');
      api.toast('Đã hoàn tác lần chỉnh nhóm.', 'ok');
    }, 'btn btn-sm').disabled = !lastProductEdit;
    parent.appendChild(bulk);
    parent.appendChild(result);
    refresh();
  }
  function renderCollection(parent, key) {
    let items = key === 'banners' ? catalog.promoConfig.banners : ['movies', 'theaters', 'combos'].indexOf(key) >= 0 ? catalog.cinemaData[key] : catalog[key];
    if (!Array.isArray(items)) items = [];
    const title = COLLECTIONS[key] || key;
    const visibleCount = key === 'products' ? items.filter(matchesProduct).length : items.length;
    const head = card(parent, title + ' · ' + visibleCount + (key === 'products' ? ' / ' + items.length : ''));
    button(head, '+ Thêm ' + title.toLowerCase(), function () {
      const item = {};
      FIELDS[key].forEach(function (field) {
        item[field] = field === 'isPromo' ? false : ['showtimes', 'occupiedSeats'].indexOf(field) >= 0 ? [] : ['price', 'priceOld', 'rating', 'sold', 'defaultPrice', 'basePrice', 'surcharge'].indexOf(field) >= 0 ? 0 : '';
      });
      items.push(item);
      if (key === 'products') Object.assign(productFilters, { query: '', brand: '', promotion: 'all' });
      markDirty();
      render(api.state.currentView);
    }, 'btn btn-primary btn-sm');
    items.forEach(function (item, index) {
      if (key === 'products' && !matchesProduct(item)) return;
      const row = card(parent, (item.name || item.title || item.id || title) + ' · ' + (index + 1));
      if (key === 'products') {
        const selection = line(row, 'Chọn để chỉnh theo nhóm', productSelection.has(item.id), checked => {
          if (checked) productSelection.add(item.id); else productSelection.delete(item.id);
          const summary = document.getElementById('managerSelectionTitle');
          if (summary) summary.textContent = 'Chỉnh nhiều sản phẩm · ' + productSelection.size + ' đã chọn';
        }, 'checkbox', false);
        selection.disabled = !item.id;
      }
      FIELDS[key].forEach(function (field) {
        const type = field === 'isPromo' ? 'checkbox' : typeof item[field] === 'number' || ['price', 'priceOld', 'rating', 'sold', 'defaultPrice', 'basePrice', 'surcharge'].indexOf(field) >= 0 ? 'number' : 'text';
        line(row, FIELD_LABELS[field] || field, Array.isArray(item[field]) ? item[field].join(', ') : item[field], function (value) {
          if (key === 'products' && field === 'id' && productSelection.delete(item.id) && value) productSelection.add(value);
          item[field] = ['showtimes', 'occupiedSeats'].indexOf(field) >= 0 ? String(value).split(',').map(function (s) {
            return s.trim();
          }).filter(Boolean) : value;
        }, type);
      });
      button(row, 'Xóa', function () {
        if (!confirm('Xóa mục ' + (item.name || item.id || '') + '?')) return;
        if (key === 'products') productSelection.delete(item.id);
        items.splice(index, 1);
        markDirty();
        render(api.state.currentView);
      }, 'btn btn-sm btn-danger');
    });
    if (!visibleCount) head.insertAdjacentHTML('beforeend', window.DTRUI.emptyStateMarkup({ icon: 'filter', title: 'Chưa có sản phẩm phù hợp', message: 'Thử tên khác hoặc chọn lại thương hiệu và trạng thái ưu đãi.' }));
  }
  function renderCinemaLocations(parent) {
    const box = card(parent, 'Khu vực đặt vé');
    const locations = catalog.cinemaData.locations || (catalog.cinemaData.locations = {});
    const fields = node('div', { class: 'manager-product-tools' });
    const inputs = ['Quốc gia', 'Tỉnh / thành phố', 'Quận / huyện', 'Đường / khu vực'].map(label => line(fields, label, '', () => {}, 'text', false));
    box.appendChild(fields);
    button(box, 'Thêm khu vực', () => {
      const [country, city, district, street] = inputs.map(input => input.value.trim());
      if ([country, city, district, street].some(value => !value || value.length > 120 || ['__proto__', 'constructor', 'prototype'].includes(value))) return api.toast('Điền đủ bốn cấp địa điểm, mỗi mục tối đa 120 ký tự.', 'err');
      if (!Object.hasOwn(locations, country)) locations[country] = {};
      if (!Object.hasOwn(locations[country], city)) locations[country][city] = {};
      if (!Object.hasOwn(locations[country][city], district)) locations[country][city][district] = [];
      const streets = locations[country][city][district];
      if (streets.includes(street)) return api.toast('Khu vực này đã có trong danh sách.', 'warn');
      streets.push(street);
      markDirty();
      render('products');
    }, 'btn btn-sm');
    Object.entries(locations).forEach(([country, cities]) => Object.entries(cities).forEach(([city, districts]) => Object.entries(districts).forEach(([district, streets]) => streets.forEach(street => {
      const row = node('div', { class: 'toggle-row' });
      row.appendChild(node('span', { class: 'toggle-row-name' }, [street, district, city, country].join(' · ')));
      button(row, 'Xóa', () => {
        if (!confirm('Xóa khu vực ' + street + '?')) return;
        districts[district] = streets.filter(value => value !== street);
        if (!districts[district].length) delete districts[district];
        if (!Object.keys(districts).length) delete cities[city];
        if (!Object.keys(cities).length) delete locations[country];
        markDirty();
        render('products');
      }, 'btn btn-sm btn-danger');
      box.appendChild(row);
    }))));
  }
  function renderBrandPromos(parent) {
    const promos = catalog.promoConfig.brandPromos || (catalog.promoConfig.brandPromos = {});
    const box = card(parent, 'Ưu đãi theo thương hiệu');
    (catalog.brands || []).forEach(function (brand) {
      const row = node('div', {
        class: 'media-item'
      });
      row.appendChild(node('h3', {
        class: 'card-title'
      }, brand.name || brand.id));
      const current = promos[brand.id];
      line(row, 'Bật ưu đãi', !!current, function (enabled) {
        if (enabled) promos[brand.id] = {
          brandId: brand.id,
          brandName: brand.name,
          startTime: '',
          endTime: '',
          isSponsored: false
        };else delete promos[brand.id];
        render('shop');
      }, 'checkbox');
      if (current) {
        ['startTime', 'endTime'].forEach(function (field) {
          line(row, FIELD_LABELS[field], current[field], function (value) {
            current[field] = value;
          }, 'datetime-local');
        });
        line(row, 'Ưu tiên hiển thị trên trang ưu đãi', current.isSponsored, function (value) {
          current.isSponsored = value;
        }, 'checkbox');
      }
      box.appendChild(row);
    });
  }
  function renderItemEarlyEnds(parent) {
    const dates = catalog.promoConfig.itemEarlyEnds || (catalog.promoConfig.itemEarlyEnds = {});
    const box = card(parent, 'Thời hạn riêng từng sản phẩm');
    const picker = node('select', {
      class: 'inp',
      'aria-label': 'Chọn sản phẩm'
    });
    picker.appendChild(node('option', {
      value: ''
    }, 'Chọn sản phẩm…'));
    (catalog.products || []).filter(function (p) {
      return !dates[p.id];
    }).forEach(function (p) {
      picker.appendChild(node('option', {
        value: p.id
      }, p.name));
    });
    box.appendChild(picker);
    button(box, '+ Thêm thời hạn', function () {
      if (!picker.value) return;
      dates[picker.value] = '';
      markDirty();
      render('shop');
    }, 'btn btn-sm');
    Object.keys(dates).forEach(function (id) {
      const row = node('div', {
        class: 'toggle-row'
      });
      const product = (catalog.products || []).find(function (p) {
        return p.id === id;
      });
      row.appendChild(node('span', {
        class: 'toggle-row-name'
      }, product ? product.name : id));
      line(row, 'Kết thúc', dates[id], function (value) {
        dates[id] = value;
      }, 'datetime-local');
      button(row, 'Xóa', function () {
        delete dates[id];
        markDirty();
        render('shop');
      }, 'btn btn-sm btn-danger');
      box.appendChild(row);
    });
  }
  function campaignStatus(start, end, enabled = true) {
    if (!enabled) return 'Đã tắt';
    const begins = Date.parse(start);
    const ends = Date.parse(end);
    if (!Number.isFinite(begins) || !Number.isFinite(ends) || ends <= begins) return 'Chưa đủ lịch';
    if (Date.now() < begins) return 'Sắp diễn ra';
    return Date.now() >= ends ? 'Đã kết thúc' : 'Đang diễn ra';
  }
  function renderCampaignOverview(parent) {
    const box = card(parent, 'Lịch ưu đãi');
    const event = catalog.promoConfig.globalEvent || {};
    const campaigns = [{ name: event.name || 'Ưu đãi toàn cửa hàng', ...event }].concat(
      Object.values(catalog.promoConfig.brandPromos || {}).map(promo => ({ name: promo.brandName || promo.brandId, ...promo }))
    );
    campaigns.forEach(campaign => {
      const row = node('div', { class: 'campaign-row' });
      row.appendChild(node('span', {}, campaign.name));
      const status = campaignStatus(campaign.startTime, campaign.endTime, campaign.enabled !== false);
      row.appendChild(node('span', { class: 'campaign-status', 'data-active': String(status === 'Đang diễn ra') }, status));
      const format = value => Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Chưa đặt';
      row.appendChild(node('span', { class: 'campaign-date' }, format(campaign.startTime) + ' — ' + format(campaign.endTime)));
      box.appendChild(row);
    });
    button(box, 'Cập nhật trạng thái', () => render('shop'), 'btn btn-sm');
  }
  function renderSharedSchedule(parent) {
    const box = card(parent, 'Dùng lịch chung cho thương hiệu');
    box.appendChild(node('p', { class: 'sub' }, 'Chọn thương hiệu rồi áp dụng thời gian của sự kiện chung. Các lịch đang có sẽ được thay thế.'));
    const selected = new Set();
    (catalog.brands || []).forEach(brand => {
      line(box, brand.name || brand.id, false, checked => {
        if (checked) selected.add(brand.id); else selected.delete(brand.id);
      }, 'checkbox');
    });
    button(box, 'Áp dụng lịch cho thương hiệu đã chọn', () => {
      const event = catalog.promoConfig.globalEvent || {};
      if (!selected.size) return api.toast('Chọn ít nhất một thương hiệu.', 'warn');
      if (campaignStatus(event.startTime, event.endTime) === 'Chưa đủ lịch') return api.toast('Điền thời gian bắt đầu và kết thúc hợp lệ cho sự kiện chung.', 'err');
      if (!confirm('Thay lịch ưu đãi của ' + selected.size + ' thương hiệu đã chọn?')) return;
      const promos = catalog.promoConfig.brandPromos || (catalog.promoConfig.brandPromos = {});
      (catalog.brands || []).filter(brand => selected.has(brand.id)).forEach(brand => {
        promos[brand.id] = { ...promos[brand.id], brandId: brand.id, brandName: brand.name, startTime: event.startTime, endTime: event.endTime };
      });
      markDirty();
      render('shop');
      api.toast('Đã áp dụng lịch. Bấm Lưu thay đổi để lưu.', 'ok');
    }, 'btn btn-sm');
  }
  function renderBanners(parent) {
    const banners = catalog.promoConfig.banners || (catalog.promoConfig.banners = []);
    const head = card(parent, 'Banner ưu đãi · ' + banners.length);
    head.appendChild(node('p', { class: 'sub' }, 'Banner hiển thị theo thứ tự bên dưới. Khách bấm vào ảnh để xem sản phẩm của thương hiệu.'));
    button(head, 'Thêm banner', () => {
      banners.push({ id: 'banner-' + Date.now(), title: '', subtitle: '', img: '', brandId: '', brandName: '' });
      markDirty();
      render('shop');
    }, 'btn btn-primary');
    if (!banners.length) head.insertAdjacentHTML('beforeend', window.DTRUI.emptyStateMarkup({ icon: 'filter', title: 'Chưa có banner', message: 'Thêm ảnh và chọn thương hiệu để giới thiệu ưu đãi.' }));
    banners.forEach((banner, index) => {
      const box = card(parent, banner.title || 'Banner mới');
      const image = node('img', { class: 'campaign-banner-preview', alt: banner.title || 'Xem trước banner', loading: 'lazy' });
      const imageStatus = node('p', { class: 'sub', role: 'status' });
      const updateImage = () => {
        const source = String(banner.img || '').trim();
        const safe = source && !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(source) || /^https?:\/\//i.test(source);
        image.hidden = !safe;
        imageStatus.textContent = !source ? 'Thêm đường dẫn ảnh để xem trước.' : !safe ? 'Dùng đường dẫn ảnh trong dự án hoặc địa chỉ bắt đầu bằng https://.' : '';
        if (safe) image.src = source; else image.removeAttribute('src');
      };
      image.addEventListener('error', () => {
        image.hidden = true;
        imageStatus.textContent = 'Không tải được ảnh. Kiểm tra lại đường dẫn.';
      });
      updateImage();
      box.appendChild(image);
      box.appendChild(imageStatus);
      ['title', 'subtitle', 'img'].forEach(field => line(box, FIELD_LABELS[field], banner[field], value => {
        banner[field] = value;
        image.alt = banner.title || 'Xem trước banner';
        if (field === 'img') updateImage();
      }));
      const brandLabel = node('label', { class: 'field' });
      brandLabel.appendChild(node('span', { class: 'field-label' }, 'Thương hiệu liên kết'));
      const select = node('select', { class: 'inp' });
      select.appendChild(node('option', { value: '' }, 'Chọn thương hiệu'));
      (catalog.brands || []).forEach(brand => {
        const option = node('option', { value: brand.id }, brand.name);
        option.selected = brand.id === banner.brandId;
        select.appendChild(option);
      });
      select.addEventListener('change', () => {
        banner.brandId = select.value;
        banner.brandName = (catalog.brands || []).find(brand => brand.id === select.value)?.name || '';
        markDirty();
      });
      brandLabel.appendChild(select);
      box.appendChild(brandLabel);
      const actions = node('div', { class: 'campaign-actions' });
      [[-1, 'Đưa lên'], [1, 'Đưa xuống']].forEach(([direction, label]) => {
        button(actions, label, () => {
          move(banners, index, direction);
          markDirty();
          render('shop');
        }, 'btn btn-sm').disabled = index + direction < 0 || index + direction >= banners.length;
      });
      button(actions, 'Nhân bản', () => {
        banners.splice(index + 1, 0, { ...banner, id: 'banner-' + Date.now(), title: banner.title + ' (bản sao)' });
        markDirty();
        render('shop');
      }, 'btn btn-sm');
      button(actions, 'Xóa', () => {
        if (!confirm('Xóa banner này?')) return;
        banners.splice(index, 1);
        markDirty();
        render('shop');
      }, 'btn btn-sm btn-danger');
      box.appendChild(actions);
    });
  }
  function renderHeroBannersManager(parent) {
    const banners = catalog.heroBanners || (catalog.heroBanners = [
      {
        id: 'hb_01',
        title: 'Thiết Bị Điện Tử & Công Nghệ Số',
        subtitle: 'Flagship, Laptop & Phụ Kiện Đỉnh Cao',
        img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1600&q=80',
        link: 'category.html?group=electronics'
      },
      {
        id: 'hb_02',
        title: 'Rạp Chiếu Phim Đỉnh Cao Cyber Cinema',
        subtitle: 'Trải nghiệm âm thanh AetherSound 3D sống động',
        img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
        link: 'cinema.html'
      },
      {
        id: 'hb_03',
        title: 'Kỹ Thuật Số & Bản Quyền Game',
        subtitle: 'Trò chơi bom tấn & Thẻ nạp quà tặng Gift Card',
        img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
        link: 'category.html?group=digital'
      },
      {
        id: 'hb_04',
        title: 'Tự Động Hóa & Thiết Bị Công Nghiệp',
        subtitle: 'Giải pháp IoT và cánh tay Robot nhà máy',
        img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
        link: 'category.html?group=industrial'
      }
    ]);

    const head = card(parent, 'Banner Trang Chủ (Marketplace) · ' + banners.length);
    head.appendChild(node('p', { class: 'sub' }, 'Quản lý các slide hình ảnh lướt hiển thị trên đầu trang Marketplace. Nạp động từ JSON.'));
    button(head, 'Thêm banner trang chủ', () => {
      banners.push({ id: 'hb_' + Date.now(), title: 'Banner mới', subtitle: 'Mô tả ngắn', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80', link: 'marketplace.html' });
      markDirty();
      render('shop');
    }, 'btn btn-primary');

    if (!banners.length) head.insertAdjacentHTML('beforeend', window.DTRUI.emptyStateMarkup({ icon: 'filter', title: 'Chưa có banner trang chủ', message: 'Thêm ảnh và liên kết để hiển thị slide đầu trang Marketplace.' }));

    banners.forEach((banner, index) => {
      const box = card(parent, banner.title || 'Slide ' + (index + 1));
      const image = node('img', { class: 'campaign-banner-preview', alt: banner.title || 'Xem trước banner', loading: 'lazy' });
      const imageStatus = node('p', { class: 'sub', role: 'status' });
      const updateImage = () => {
        const source = String(banner.img || '').trim();
        const safe = source && (!/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(source) || /^https?:\/\//i.test(source));
        image.hidden = !safe;
        imageStatus.textContent = !source ? 'Thêm đường dẫn ảnh để xem trước.' : !safe ? 'Dùng đường dẫn ảnh hợp lệ.' : '';
        if (safe) image.src = source; else image.removeAttribute('src');
      };
      image.addEventListener('error', () => {
        image.hidden = true;
        imageStatus.textContent = 'Không tải được ảnh. Kiểm tra lại đường dẫn.';
      });
      updateImage();
      box.appendChild(image);
      box.appendChild(imageStatus);

      [['title', 'Tiêu đề slide'], ['subtitle', 'Phụ đề / Mô tả ngắn'], ['img', 'Đường dẫn ảnh slide'], ['link', 'Liên kết khi click']].forEach(([field, label]) => {
        line(box, label, banner[field], value => {
          banner[field] = value;
          image.alt = banner.title || 'Xem trước banner';
          if (field === 'img') updateImage();
          markDirty();
        });
      });

      const actions = node('div', { class: 'campaign-actions' });
      [[-1, 'Đưa lên'], [1, 'Đưa xuống']].forEach(([direction, label]) => {
        button(actions, label, () => {
          move(banners, index, direction);
          markDirty();
          render('shop');
        }, 'btn btn-sm').disabled = index + direction < 0 || index + direction >= banners.length;
      });
      button(actions, 'Nhân bản', () => {
        banners.splice(index + 1, 0, { ...banner, id: 'hb_' + Date.now(), title: banner.title + ' (bản sao)' });
        markDirty();
        render('shop');
      }, 'btn btn-sm');
      button(actions, 'Xóa', () => {
        if (!confirm('Xóa slide banner này?')) return;
        banners.splice(index, 1);
        markDirty();
        render('shop');
      }, 'btn btn-sm btn-danger');
      box.appendChild(actions);
    });
  }
  function renderShop(parent) {
    const links = card(parent, 'Truy cập nhanh');
    [['Xem cửa hàng', '../marketplace.html'], ['Xem trang ưu đãi', '../deals.html']].forEach(function (entry) {
      links.appendChild(node('a', {
        class: 'btn',
        href: entry[1],
        target: '_blank',
        rel: 'noopener'
      }, entry[0]));
    });
    if (!api.state.root) {
      button(links, 'Tắt bản xem thử', function () {
        if (dirty && !confirm('Bỏ bản xem thử và các thay đổi cửa hàng chưa lưu?')) return;
        try {
          localStorage.removeItem('dtr_catalog_preview');
          localStorage.removeItem('dtr_promo_config');
          dirty = false;
          clearTimeout(draftTimer);
          reload();
        } catch (error) {
          api.toast('Không tắt được bản xem thử vì trình duyệt đang chặn lưu trữ.', 'err');
        }
      }, 'btn btn-sm');
    }
    const tabs = node('div', { class: 'campaign-tabs', role: 'group', 'aria-label': 'Thiết lập cửa hàng' });
    [['campaigns', 'Ưu đãi'], ['heroBanners', 'Banner Trang Chủ (Marketplace)'], ['banners', 'Banner Khuyến Mãi (Deals)'], ['layout', 'Bố cục']].forEach(([key, title]) => {
      const tab = button(tabs, title, () => {
        shopPanel = key;
        render('shop');
      }, 'btn btn-sm');
      tab.setAttribute('aria-pressed', String(shopPanel === key));
    });
    parent.appendChild(tabs);
    if (shopPanel === 'heroBanners') return renderHeroBannersManager(parent);
    if (shopPanel === 'banners') return renderBanners(parent);
    if (shopPanel === 'layout') {
      const layout = card(parent, 'Thứ tự các phần trên cửa hàng');
      catalog.layout = catalog.layout || {};
      const order = normalize(catalog.layout.homeSections, HOME);
      catalog.layout.homeSections = order;
      orderList(layout, order, function (i, d) {
        move(order, i, d);
        markDirty();
        render('shop');
      });
      return;
    }
    renderCampaignOverview(parent);
    const event = card(parent, 'Sự kiện khuyến mãi');
    const global = catalog.promoConfig.globalEvent || (catalog.promoConfig.globalEvent = {});
    line(event, 'Bật sự kiện', global.enabled, function (v) {
      global.enabled = v;
    }, 'checkbox');
    ['name', 'name_en', 'name_ja', 'name_zh', 'startTime', 'endTime'].forEach(function (key) {
      const label = key === 'name' ? 'Tên sự kiện (VI)' :
                    key === 'name_en' ? 'Tên sự kiện (EN)' :
                    key === 'name_ja' ? 'Tên sự kiện (JA)' :
                    key === 'name_zh' ? 'Tên sự kiện (ZH)' : FIELD_LABELS[key];
      line(event, label, global[key], function (v) {
        global[key] = v;
      }, key.endsWith('Time') ? 'datetime-local' : 'text');
    });
    renderBrandPromos(parent);
    renderItemEarlyEnds(parent);
    renderSharedSchedule(parent);
  }
  function renderOrders(parent) {
    const orders = window.DTR && window.DTR.orders;
    if (!orders) {
      card(parent, 'Không nạp được quản lý đơn hàng');
      return;
    }
    const all = orders.getAll();
    card(parent, 'Đơn hàng · ' + all.length + ' · dữ liệu trên trình duyệt này');
    all.forEach(function (order) {
      const box = card(parent, (order.trackingCode || order.id) + ' · ' + orders.formatPrice(order.total));
      box.appendChild(node('p', {
        class: 'card-sub'
      }, orders.formatDate(order.createdAt) + ' · ' + (order.customer && order.customer.email || 'guest')));
      (order.items || []).forEach(function (item) {
        box.appendChild(node('div', {
          class: 'toggle-row'
        }, (item.name || item.id) + ' × ' + item.qty + ' · ' + orders.formatPrice(item.price)));
      });
      const selector = node('select', {
        class: 'inp',
        'aria-label': 'Trạng thái đơn hàng'
      });
      orders.STATUS_LIST.forEach(function (status) {
        const option = node('option', {
          value: status
        }, orders.STATUS_LABEL[status]);
        if (status === order.status) option.selected = true;
        const currentIndex = orders.STATUS_LIST.indexOf(order.status);
        if (status !== order.status && !(status === orders.STATUS_LIST[currentIndex + 1] && currentIndex < 3) && !(status === 'cancelled' && currentIndex < 3)) option.disabled = true;
        selector.appendChild(option);
      });
      selector.addEventListener('change', function () {
        if (!orders.updateStatus(order.id, selector.value)) api.toast('Không thể đổi trạng thái', 'err');else {
          api.toast('Đã cập nhật đơn hàng', 'ok');
          render('orders');
        }
      });
      box.appendChild(selector);
      const note = line(box, 'Ghi chú quản lý', order.adminNote || '', function () {}, 'text');
      button(box, 'Lưu ghi chú', function () {
        if (orders.updateAdminNote(order.id, note.value)) api.toast('Đã lưu ghi chú', 'ok');else api.toast('Không thể lưu ghi chú', 'err');
      }, 'btn btn-sm');
      button(box, 'Ẩn đơn hàng', function () {
        if (confirm('Ẩn đơn hàng này khỏi danh sách?') && orders.remove(order.id)) render('orders');
      }, 'btn btn-sm btn-danger');
    });
  }
  function renderCustomers(parent) {
    let users = {};
    try {
      users = JSON.parse(localStorage.getItem('dtr_users') || '{}');
    } catch (e) {}
    const list = Array.isArray(users) ? users : Object.keys(users || {}).map(function (key) {
      return users[key];
    });
    const orders = window.DTR && window.DTR.orders;
    card(parent, 'Khách hàng · ' + list.length + ' · dữ liệu trên trình duyệt này');
    list.forEach(function (user) {
      if (!user || !user.email) return;
      const history = orders ? orders.getByEmail(user.email) : [];
      const box = card(parent, user.name || user.email);
      box.appendChild(node('p', {
        class: 'card-sub'
      }, user.email + ' · ' + (user.role || 'customer')));
      box.appendChild(node('p', {}, history.length + ' đơn hàng · ' + (orders ? orders.formatPrice(history.reduce(function (sum, order) {
        return sum + Number(order.total || 0);
      }, 0)) : '0đ')));
    });
  }
  function render(view) {
    if (!api) return;
    api.state.currentView = view;
    const editor = document.getElementById('editor');
    editor.replaceChildren();
    const inner = node('div', {
      class: 'editor-inner'
    });
    editor.appendChild(inner);
    const titles = {
      shop: 'Quản lý cửa hàng',
      products: 'Danh sách sản phẩm',
      orders: 'Đơn hàng',
      customers: 'Khách hàng',
      pages: 'Các trang trong cửa hàng'
    };
    document.getElementById('viewTitle').textContent = titles[view] || view;
    document.getElementById('viewSub').textContent = view === 'orders' || view === 'customers' ? 'Dữ liệu lưu trên trình duyệt này' : 'Chỉnh sửa sản phẩm, ưu đãi và cách hiển thị trên cửa hàng';
    document.getElementById('btnSave').hidden = view === 'orders' || view === 'customers';
    if (view === 'orders') return renderOrders(inner);
    if (view === 'customers') return renderCustomers(inner);
    if (view === 'pages') {
      document.getElementById('btnSave').hidden = true;
      document.getElementById('viewSub').textContent = 'Mở trang cần xem để kiểm tra nội dung và trải nghiệm mua hàng.';
      const links = card(inner, 'Mở trang');
      [
        ['Trang giới thiệu', '../index.html'], ['Cửa hàng', '../marketplace.html'],
        ['Danh mục sản phẩm', '../category.html'], ['Ưu đãi', '../deals.html'],
        ['Phim đang chiếu', '../cinema.html'], ['Thanh toán', '../12.html'],
        ['Dịch vụ và đơn hàng', '../services.html'], ['Đăng nhập', '../login.html']
      ].forEach(([title, href]) => {
        links.appendChild(node('a', { class: 'btn campaign-page-link', href, target: '_blank', rel: 'noopener' }, title));
      });
      return;
    }
    if (!catalog) {
      card(inner, 'Đang tải sản phẩm…');
      return;
    }
    renderDataTools(inner);
    if (view === 'shop') return renderShop(inner);
    const picker = node('select', {
      class: 'inp',
      'aria-label': 'Loại dữ liệu'
    });
    Object.keys(COLLECTIONS).filter(function (key) {
      return key !== 'banners';
    }).forEach(function (key) {
      const option = node('option', {
        value: key
      }, COLLECTIONS[key]);
      if (key === entity) option.selected = true;
      picker.appendChild(option);
    });
    picker.addEventListener('change', function () {
      entity = picker.value;
      render('products');
    });
    inner.appendChild(picker);
    if (entity === 'products') renderProductWorkspace(inner);
    else renderCollection(inner, entity);
    if (['movies', 'theaters'].includes(entity)) renderCinemaLocations(inner);
  }

  function assertCatalogShape(candidate) {
    const isRecord = value => value && typeof value === 'object' && !Array.isArray(value);
    if (!isRecord(candidate) || !isRecord(candidate.cinemaData) || !isRecord(candidate.promoConfig)) throw new Error('Bản lưu thiếu thiết lập cửa hàng hoặc rạp phim.');
    ['products', 'giftcards', 'categories', 'brands', 'majorGroups', 'movies', 'theaters', 'combos', 'banners'].forEach(key => {
      const list = ['movies', 'theaters', 'combos'].includes(key) ? candidate.cinemaData[key] : key === 'banners' ? candidate.promoConfig.banners : candidate[key];
      if (!Array.isArray(list) || list.some(item => !isRecord(item))) throw new Error('Danh sách ' + (COLLECTIONS[key] || key) + ' không hợp lệ.');
    });
    const promos = candidate.promoConfig;
    if (!isRecord(promos.globalEvent) || !isRecord(promos.brandPromos) || !isRecord(promos.itemEarlyEnds) || Object.values(promos.brandPromos).some(promo => !isRecord(promo))) throw new Error('Thiết lập ưu đãi không hợp lệ.');
    const locations = candidate.cinemaData.locations || {};
    const checkKeys = value => isRecord(value) && !Object.keys(value).some(key => ['__proto__', 'constructor', 'prototype'].includes(key));
    if (!checkKeys(locations) || Object.values(locations).some(cities => !checkKeys(cities) || Object.values(cities).some(districts => !checkKeys(districts) || Object.values(districts).some(streets => !Array.isArray(streets) || streets.some(street => typeof street !== 'string'))))) throw new Error('Danh sách khu vực đặt vé không hợp lệ.');
  }
  function validate(candidate = catalog) {
    assertCatalogShape(candidate);
    if (!candidate || !Array.isArray(candidate.products)) throw new Error('Thiếu danh sách sản phẩm');
    ['products', 'giftcards', 'categories', 'brands', 'majorGroups', 'movies', 'theaters', 'combos'].forEach(function (key) {
      const ids = {};
      const list = ['movies', 'theaters', 'combos'].indexOf(key) >= 0 ? candidate.cinemaData[key] : candidate[key];
      (list || []).forEach(function (item) {
        if (!item.id || ids[item.id]) throw new Error('ID trống hoặc trùng trong ' + key + ': ' + item.id);
        ids[item.id] = true;
        if ((key === 'products' || key === 'giftcards') && !item.name) throw new Error('Thiếu tên ở ' + key + ': ' + item.id);
        if (key === 'products' && (!Number.isFinite(item.price) || item.price < 0)) throw new Error('Giá không hợp lệ: ' + item.id);
      });
    });
    if (!candidate.promoConfig || !Array.isArray(candidate.promoConfig.banners)) throw new Error('Banner không hợp lệ');
    if (!candidate.cinemaData || typeof candidate.cinemaData !== 'object') throw new Error('Dữ liệu rạp phim không hợp lệ');
    const event = candidate.promoConfig.globalEvent || {};
    if (event.enabled && campaignStatus(event.startTime, event.endTime) === 'Chưa đủ lịch') throw new Error('Thời gian sự kiện không hợp lệ');
    Object.keys(candidate.promoConfig.brandPromos || {}).forEach(function (id) {
      const promo = candidate.promoConfig.brandPromos[id];
      if (campaignStatus(promo.startTime, promo.endTime) === 'Chưa đủ lịch') throw new Error('Thời gian ưu đãi không hợp lệ: ' + (promo.brandName || id));
    });
    Object.keys(candidate.promoConfig.itemEarlyEnds || {}).forEach(function (id) {
      if (!Number.isFinite(Date.parse(candidate.promoConfig.itemEarlyEnds[id]))) throw new Error('Hạn sản phẩm không hợp lệ: ' + id);
    });
    candidate.promoConfig.banners.forEach(banner => {
      if (!String(banner.title || '').trim() || !String(banner.img || '').trim()) throw new Error('Điền tiêu đề và đường dẫn ảnh cho mỗi banner.');
      if (!(candidate.brands || []).some(brand => brand.id === banner.brandId)) throw new Error('Chọn thương hiệu cho banner: ' + banner.title);
    });
  }
  async function save(view) {
    let output;
    if (['orders', 'customers', 'pages'].includes(view)) return;
    try {
      document.querySelectorAll('textarea.ta.mono').forEach(function (area) {
        JSON.parse(area.value);
      });
      validate();
      output = api.pretty(catalog);
      await api.writeText('../products.json', output);
      if (api.state.root) {
        localStorage.removeItem('dtr_catalog_preview');
        localStorage.removeItem('dtr_promo_config');
        api.toast('Đã lưu thay đổi cho cửa hàng.', 'ok');
      } else {
        localStorage.setItem('dtr_catalog_preview', output);
        localStorage.setItem('dtr_promo_config', JSON.stringify(catalog.promoConfig));
        api.toast('Đã tải bản lưu và áp dụng bản xem thử trên trình duyệt này.', 'ok');
      }
      dirty = false;
      clearTimeout(draftTimer);
      try { localStorage.removeItem(DRAFT_KEY); } catch (error) {
        api.toast('Đã lưu cửa hàng nhưng chưa xóa được bản nháp cũ.', 'warn');
      }
    } catch (e) {
      api.toast('Không lưu được: ' + e.message, 'err');
    }
  }
  async function reload() {
    if (dirty && !confirm('Tải lại sẽ bỏ các thay đổi cửa hàng chưa lưu. Tiếp tục?')) return;
    try {
      const saved = await api.readJSON('../products.json');
      assertCatalogShape(saved);
      let loaded = saved;
      let draftAvailable = false;
      try {
        const preview = !api.state.root && localStorage.getItem('dtr_catalog_preview');
        if (preview) loaded = JSON.parse(preview);
        const promo = localStorage.getItem('dtr_promo_config');
        if (promo) loaded = { ...loaded, promoConfig: JSON.parse(promo) };
        assertCatalogShape(loaded);
        draftAvailable = Boolean(localStorage.getItem(DRAFT_KEY));
      } catch (error) {
        loaded = saved;
        api.toast('Không đọc được bản lưu trên trình duyệt. Đang dùng dữ liệu từ file cửa hàng.', 'warn');
      }
      catalog = loaded;
      catalog.layout = catalog.layout || {};
      catalog.promoConfig = catalog.promoConfig || {};
      assertCatalogShape(catalog);
      lastProductEdit = null;
      productSelection.clear();
      dirty = false;
      if (api.state.currentView !== 'landing') render(api.state.currentView);
      if (draftAvailable) api.toast('Có bản nháp chưa áp dụng. Mở mục Bản lưu và bản nháp trong phần Cửa hàng để khôi phục.', 'warn');
    } catch (e) {
      api.toast('Không tải được sản phẩm: ' + e.message, 'err');
    }
  }
  window.DTRAdminExtension = {
    render: render,
    renderLandingOrder: renderLandingOrder,
    save: save,
    flushDraft: persistDraft,
    hasUnsavedChanges: () => dirty,
    reload: reload
  };
  document.addEventListener('DOMContentLoaded', function () {
    api = window.DTRManager;
    if (!api) return;
    reload();
    window.addEventListener('pagehide', persistDraft);
    window.addEventListener('storage', function (e) {
      if (e.key === 'dtr_orders' && api.state.currentView === 'orders') render('orders');
      if (e.key === 'dtr_users' && api.state.currentView === 'customers') render('customers');
    });
  });
})();
