(function () {
  'use strict';

  let activeMethod = 'qr';
  let discountRate = 0;
  let lastOrder = null;
  let busy = false;
  const expiry = Date.now() + 10 * 60 * 1000;
  const getCheckoutElement = function (id) {
    return document.getElementById(id);
  };
  const formatCurrency = function (n) {
    return Math.round(n || 0).toLocaleString('vi-VN') + ' đ';
  };
  const readCart = function () {
    return window.DTR && window.DTR.cart ? window.DTR.cart.get() : [];
  };
  function showCheckoutNotice(message) {
    const box = getCheckoutElement('toast-container');
    box.textContent = message;
    box.setAttribute('role', 'status');
    box.classList.add('checkout-notice');
    clearTimeout(box._timer);
    box._timer = setTimeout(function () {
      box.textContent = '';
    }, 5000);
  }
  function resolveCartProducts() {
    return readCart().map(function (item) {
      const product = window.DTR.product.find(item);
      return product && Number.isFinite(Number(product.price)) && Number(product.price) >= 0 && Number.isInteger(Number(item.qty || 1)) && Number(item.qty || 1) > 0 ? {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty: Number(item.qty || 1),
        img: product.img || ''
      } : null;
    });
  }
  function calculateTotals() {
    const items = resolveCartProducts();
    let subtotal = 0;
    items.forEach(function (item) {
      if (item) subtotal += item.price * item.qty;
    });
    const discount = Math.round(subtotal * discountRate);
    const tax = Math.round((subtotal - discount) * 0.1);
    return {
      subtotal: subtotal,
      discount: discount,
      tax: tax,
      total: subtotal - discount + tax
    };
  }
  function updateTotals() {
    const t = calculateTotals();
    [['subtotal-val', t.subtotal], ['discount-val', -t.discount], ['vat-val', t.tax], ['total-val', t.total], ['pay-btn-amount', t.total]].forEach(function (pair) {
      getCheckoutElement(pair[0]).textContent = formatCurrency(pair[1]);
    });
    const config = window.DTR.catalog?.checkoutConfig || {};
    const rate = Number(config.usdtRate) || 25400;
    getCheckoutElement('usdt-amount').textContent = (t.total / rate).toFixed(2) + ' USDT';
    getCheckoutElement('qr-img').src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent('DEMO_DTR_' + t.total);
    getCheckoutElement('checkout-pay').disabled = !readCart().length || resolveCartProducts().some(function (item) {
      return !item;
    }) || Date.now() >= expiry || !!lastOrder;
  }
  function writeCart(items) {
    try {
      localStorage.setItem('dtr_cart', JSON.stringify(items));
      window.DTR.cart.updateBadge();
      return true;
    } catch (e) {
      showCheckoutNotice('Không lưu được giỏ hàng. Hãy giải phóng dung lượng trình duyệt rồi thử lại.');
      return false;
    }
  }
  function renderCart() {
    const container = getCheckoutElement('checkout-items');
    container.replaceChildren();
    const items = readCart();
    getCheckoutElement('checkout-count').textContent = items.length + ' món';
    if (!items.length) {
      container.innerHTML = window.DTRUI.emptyStateMarkup({ icon: 'cart', title: 'Giỏ hàng đang trống', message: 'Chọn sản phẩm trước khi tiếp tục thanh toán.', actionLabel: 'Khám phá sản phẩm', actionHref: 'marketplace.html' });
    }
    items.forEach(function (item, index) {
      item = item || {
        id: ''
      };
      const product = window.DTR.product.find(item);
      const row = document.createElement('article');
      row.className = 'checkout-item';
      const name = document.createElement('h3');
      name.textContent = product ? product.name : 'Sản phẩm không còn trong catalog';
      const price = document.createElement('p');
      price.className = 'checkout-money';
      price.textContent = product ? formatCurrency(product.price) : 'Hãy xóa món này để tiếp tục';
      const actions = document.createElement('div');
      actions.className = 'checkout-quantity';
      function action(label, delta) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.setAttribute('aria-label', label === 'Xóa' ? 'Xóa ' + name.textContent : (delta > 0 ? 'Tăng' : 'Giảm') + ' số lượng ' + name.textContent);
        button.addEventListener('click', function () {
          const current = readCart();
          if (!current[index] || current[index].id !== item.id) {
            renderCart();
            showCheckoutNotice('Giỏ hàng đã thay đổi. Hãy thử lại.');
            return;
          }
          if (delta === 0) current.splice(index, 1);else current[index].qty = Math.max(1, Math.min(99, Number(current[index].qty || 1) + delta));
          if (writeCart(current)) {
            lastOrder = null;
            renderCart();
          }
        });
        if (delta && String(item.id).indexOf('cinema_') === 0 && String(item.id).indexOf('cinema_combo_') !== 0) button.disabled = true;
        actions.appendChild(button);
      }
      action('−', -1);
      const quantity = document.createElement('span');
      quantity.textContent = item.qty || 1;
      actions.appendChild(quantity);
      action('+', 1);
      action('Xóa', 0);
      row.append(name, price, actions);
      container.appendChild(row);
    });
    updateTotals();
  }
  window.applyPromo = function () {
    const code = getCheckoutElement('promo-code').value.trim().toUpperCase();
    const vouchers = window.DTR.catalog?.checkoutConfig?.vouchers || {
      DTRVIP10: 0.1,
      DTR50: 0.5
    };
    const value = Number(vouchers[code]);
    discountRate = Number.isFinite(value) && value > 0 && value <= 1 ? value : 0;
    getCheckoutElement('promo-status').hidden = false;
    getCheckoutElement('promo-status').classList.remove('hidden');
    getCheckoutElement('promo-status').textContent = discountRate ? 'Đã áp dụng mã giảm ' + Math.round(discountRate * 100) + '%' : 'Mã không hợp lệ. Thử DTRVIP10 cho bản demo.';
    updateTotals();
  };
  window.selectMethod = function (method) {
    if (!['qr', 'card', 'gplay', 'bank', 'crypto'].includes(method)) return;
    activeMethod = method;
    document.querySelectorAll('.payment-method-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.id === 'tab-' + method);
      tab.setAttribute('aria-pressed', String(tab.id === 'tab-' + method));
    });
    document.querySelectorAll('.payment-view').forEach(function (view) {
      view.classList.toggle('hidden', view.id !== 'method-' + method);
    });
  };
  function luhn(value) {
    let i, n;
    if (!/^\d{13,19}$/.test(value) || /^0+$/.test(value)) return false;
    let sum = 0;
    let doubleDigit = false;
    for (i = value.length - 1; i >= 0; i--) {
      n = Number(value[i]);
      if (doubleDigit) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      doubleDigit = !doubleDigit;
    }
    return sum % 10 === 0;
  }
  function validExpiry(value) {
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
    if (!match) return false;
    return new Date(2000 + Number(match[2]), Number(match[1]), 1).getTime() > Date.now();
  }
  window.DTRCheckoutValidation = {
    luhn: luhn,
    validExpiry: validExpiry
  };
  window.formatCardNumber = function (input) {
    input.value = input.value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();
    window.updateCardPreview();
  };
  window.formatCardExpiry = function (input) {
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    input.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
    window.updateCardPreview();
  };
  window.flipCard = function (flipped) {
    document.querySelector('.card-3d-wrapper').classList.toggle('flipped', flipped);
  };
  window.updateCardPreview = function () {
    getCheckoutElement('preview-card-num').textContent = getCheckoutElement('card-number').value || '•••• •••• •••• ••••';
    getCheckoutElement('preview-card-name').textContent = getCheckoutElement('card-name').value || 'CHỦ THẺ';
    getCheckoutElement('preview-card-exp').textContent = getCheckoutElement('card-expiry').value || 'MM/YY';
    getCheckoutElement('preview-card-cvv').textContent = '•••';
  };
  window.processPayment = function () {
    if (busy || lastOrder || !window.DTR?.ready) return;
    const items = resolveCartProducts();
    if (!items.length || items.some(function (item) {
      return !item || !Number.isFinite(item.price) || item.price < 0 || !Number.isInteger(item.qty) || item.qty < 1;
    })) {
      showCheckoutNotice('Giỏ hàng có dữ liệu không hợp lệ. Hãy xóa món lỗi rồi thử lại.');
      return;
    }
    if (Date.now() >= expiry) {
      showCheckoutNotice('Phiên demo đã hết hạn. Tải lại trang để tiếp tục.');
      return;
    }
    if (activeMethod === 'card') {
      if (!luhn(getCheckoutElement('card-number').value.replace(/\s/g, ''))) {
        showCheckoutNotice('Số thẻ không vượt qua kiểm tra Luhn.');
        getCheckoutElement('card-number').focus();
        return;
      }
      if (!validExpiry(getCheckoutElement('card-expiry').value)) {
        showCheckoutNotice('Hạn thẻ phải có dạng MM/YY và chưa hết hạn.');
        getCheckoutElement('card-expiry').focus();
        return;
      }
      if (!getCheckoutElement('card-name').value.trim() || !/^\d{3,4}$/.test(getCheckoutElement('card-cvv').value)) {
        showCheckoutNotice('Nhập tên chủ thẻ và mã CVV gồm 3 hoặc 4 chữ số.');
        return;
      }
    }
    busy = true;
    getCheckoutElement('checkout-pay').disabled = true;
    const t = calculateTotals();
    const user = window.DTRAuth.get() || {};
    const order = window.DTR.orders.create(items, {
      customer: {
        name: user.name,
        email: user.email
      },
      discountAmount: t.discount,
      taxRate: 0.1,
      paymentMethod: activeMethod
    });
    if (!order) {
      busy = false;
      updateTotals();
      showCheckoutNotice('Không lưu được đơn hàng. Giỏ hàng vẫn được giữ lại để thử lại.');
      return;
    }
    lastOrder = order;
    if (!writeCart([])) showCheckoutNotice('Đơn đã lưu, nhưng chưa xóa được giỏ. Không thanh toán lại đơn này.');
    renderCart();
    getCheckoutElement('order-id-display').textContent = order.trackingCode;
    getCheckoutElement('rec-order-id').textContent = order.trackingCode;
    getCheckoutElement('rec-time').textContent = new Date(order.createdAt).toLocaleString('vi-VN');
    getCheckoutElement('receipt-track').href = 'index.html?tracking=' + encodeURIComponent(order.trackingCode) + '#skywatch';
    getCheckoutElement('rec-method').textContent = activeMethod.toUpperCase() + ' · demo';
    [['rec-subtotal', t.subtotal], ['rec-discount', -t.discount], ['rec-vat', t.tax], ['rec-total', t.total]].forEach(function (pair) {
      getCheckoutElement(pair[0]).textContent = formatCurrency(pair[1]);
    });
    getCheckoutElement('receipt-modal').classList.remove('hidden');
    getCheckoutElement('receipt-modal').setAttribute('role', 'dialog');
    getCheckoutElement('receipt-modal').setAttribute('aria-modal', 'true');
    getCheckoutElement('receipt-modal').querySelector('button, a').focus();
    getCheckoutElement('card-number').value = '';
    getCheckoutElement('card-name').value = '';
    getCheckoutElement('card-expiry').value = '';
    getCheckoutElement('card-cvv').value = '';
    window.updateCardPreview();
    busy = false;
  };
  window.downloadReceipt = function () {
    if (!lastOrder) return;
    const o = lastOrder;
    const lines = ['DTR-Market · BIÊN LAI DEMO', 'Mã tra cứu: ' + o.trackingCode, new Date(o.createdAt).toLocaleString('vi-VN'), ''];
    o.items.forEach(function (item) {
      lines.push(item.name + ' × ' + item.qty + ' · ' + formatCurrency(item.price * item.qty));
    });
    lines.push('', 'Tạm tính: ' + formatCurrency(o.subtotal), 'Voucher: -' + formatCurrency(o.discount), 'VAT 10%: ' + formatCurrency(o.tax), 'Tổng cộng: ' + formatCurrency(o.total), '', 'Đây là giao dịch thử nghiệm, không thu tiền.');
    const url = URL.createObjectURL(new Blob(['\uFEFF' + lines.join('\n')], {
      type: 'text/plain;charset=utf-8'
    }));
    const link = document.createElement('a');
    link.href = url;
    link.download = o.trackingCode + '.txt';
    link.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  };
  window.closeReceipt = function () {
    getCheckoutElement('receipt-modal').classList.add('hidden');
    document.querySelector('.checkout-header a').focus();
  };
  window.copyText = function (text) {
    if (!navigator.clipboard) {
      showCheckoutNotice('Trình duyệt chưa cho phép sao chép. Hãy chọn và sao chép nội dung trực tiếp.');
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      showCheckoutNotice('Đã sao chép');
    }, function () {
      showCheckoutNotice('Không thể sao chép. Hãy sao chép thủ công.');
    });
  };
  window.switchLang = function (lang, notify) {
    lang = lang === 'en' ? 'en' : 'vi';
    const dictionaries = {
      vi: {
        btn_back_shop: 'Quay lại cửa hàng',
        cart_title: 'Thông tin đơn hàng',
        lbl_promo: 'Mã giảm giá / Voucher',
        btn_apply: 'Áp dụng',
        lbl_subtotal: 'Tạm tính:',
        lbl_discount: 'Giảm giá (Voucher):',
        lbl_vat: 'VAT (10%):',
        lbl_total: 'Tổng thanh toán:',
        pay_header: 'Chọn phương thức thanh toán',
        pay_sub: 'Kiểm tra giỏ hàng và chọn cách thanh toán demo.',
        btn_confirm_pay: 'Xác nhận thanh toán demo'
      },
      en: {
        btn_back_shop: 'Back to shop',
        cart_title: 'Order summary',
        lbl_promo: 'Voucher code',
        btn_apply: 'Apply',
        lbl_subtotal: 'Subtotal:',
        lbl_discount: 'Voucher:',
        lbl_vat: 'VAT (10%):',
        lbl_total: 'Total:',
        pay_header: 'Choose payment method',
        pay_sub: 'Review your cart and choose a demo payment method.',
        btn_confirm_pay: 'Confirm demo payment'
      }
    };
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const text = dictionaries[lang][el.dataset.i18n];
      if (text) el.textContent = text;
    });
    document.documentElement.lang = lang;
    ['vi', 'en'].forEach(function (code) {
      getCheckoutElement('lang-' + code).classList.toggle('active', code === lang);
    });
    if (notify !== false) {
      try {
        localStorage.setItem('dtr_lang', lang);
      } catch (e) {}
      showCheckoutNotice(lang === 'en' ? 'English selected. Amounts stay in VND.' : 'Đã chọn tiếng Việt');
    }
  };
  function init() {
    if (!window.DTR?.ready || init.done) return;
    init.done = true;
    getCheckoutElement('card-number').maxLength = 23;
    ['card-number', 'card-expiry', 'card-cvv'].forEach(function (id) {
      getCheckoutElement(id).inputMode = 'numeric';
      getCheckoutElement(id).autocomplete = 'off';
    });
    getCheckoutElement('order-id-display').textContent = 'DEMO';
    renderCart();
    try {
      window.switchLang(localStorage.getItem('dtr_lang'), false);
    } catch (e) {
      window.switchLang('vi', false);
    }
    setInterval(function () {
      const seconds = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      getCheckoutElement('countdown-timer').textContent = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
      if (!seconds) updateTotals();
    }, 1000);
    window.addEventListener('storage', function (e) {
      if (e.key === 'dtr_cart') renderCart();
    });
    document.addEventListener('keydown', function (e) {
      let focusable, first, last;
      const modal = getCheckoutElement('receipt-modal');
      if (modal.classList.contains('hidden')) return;
      if (e.key === 'Escape') window.closeReceipt();
      if (e.key === 'Tab') {
        focusable = Array.from(modal.querySelectorAll('a[href], button'));
        first = focusable[0];
        last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
  document.addEventListener('dtr:ready', init);
  if (window.DTR?.ready) init();
})();
