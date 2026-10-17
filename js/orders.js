(function () {
  'use strict';

  const ORDERS_KEY = 'dtr_orders';
  const STATUS_LIST = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
  const STATUS_LABEL = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
  };
  const STATUS_COLOR = {
    pending: '#f59e0b',
    confirmed: '#22d3ee',
    shipping: '#a3e635',
    delivered: '#10b981',
    cancelled: '#f43f5e'
  };
  function readStoredOrders() {
    let raw, arr;
    try {
      raw = localStorage.getItem(ORDERS_KEY);
      arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }
  function saveStoredOrders(arr) {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(arr || []));
      return true;
    } catch (e) {
      return false;
    }
  }
  function createOrderId() {
    let hex = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase();
    while (hex.length < 4) hex = '0' + hex;
    return 'DTR-ORD-' + Date.now() + '-' + hex;
  }
  function createTrackingCode() {
    let i;
    const num = Math.floor(1000 + Math.random() * 9000);
    let letters = '';
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    for (i = 0; i < 2; i++) {
      letters += abc[Math.floor(Math.random() * abc.length)];
    }
    return 'DTR-TRK-' + num + '-' + letters;
  }
  function normalizeStatus(s) {
    return STATUS_LIST.indexOf(s) !== -1 ? s : 'pending';
  }
  function calculateOrderTotals(items, shippingFee) {
    let subtotal = 0;
    (items || []).forEach(function (it) {
      subtotal += (Number(it.price) || 0) * (Number(it.qty) || 1);
    });
    const ship = Number(shippingFee) || 0;
    return {
      subtotal: subtotal,
      shippingFee: ship,
      total: subtotal + ship
    };
  }
  function formatPrice(n) {
    return Number(n || 0).toLocaleString('vi-VN') + 'đ';
  }
  function formatDate(ts) {
    if (!ts) return '--';
    const d = new Date(ts);
    const pad = function (n) {
      return n < 10 ? '0' + n : '' + n;
    };
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' · ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function createOrder(items, options) {
    options = options || {};
    if (!Array.isArray(items) || items.length === 0) return null;
    const cleanItems = items.map(function (it) {
      if (!it || !it.id || !it.name || !Number.isFinite(Number(it.price)) || Number(it.price) < 0 || !Number.isInteger(Number(it.qty)) || Number(it.qty) < 1) return null;
      return {
        id: it.id || '',
        name: it.name || '',
        price: Number(it.price) || 0,
        qty: Number(it.qty) || 1,
        img: it.img || ''
      };
    });
    if (cleanItems.some(function (item) {
      return !item;
    })) return null;
    const totals = calculateOrderTotals(cleanItems, options.shippingFee);
    const discount = Math.max(0, Math.min(totals.subtotal, Math.round(Number(options.discountAmount) || 0)));
    const taxRate = Math.max(0, Math.min(1, Number(options.taxRate) || 0));
    const tax = Math.round((totals.subtotal - discount) * taxRate);
    const now = Date.now();
    const order = {
      id: createOrderId(),
      trackingCode: createTrackingCode(),
      createdAt: now,
      updatedAt: now,
      customer: {
        email: options.customer && options.customer.email || 'guest',
        name: options.customer && options.customer.name || 'Khách vãng lai'
      },
      items: cleanItems,
      subtotal: totals.subtotal,
      shippingFee: totals.shippingFee,
      discount: discount,
      tax: tax,
      taxRate: taxRate,
      total: totals.total - discount + tax,
      paymentMethod: ['qr', 'card', 'gplay', 'bank', 'crypto'].indexOf(options.paymentMethod) !== -1 ? options.paymentMethod : '',
      paymentStatus: 'demo',
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        at: now,
        note: 'Đơn hàng đã được khởi tạo'
      }],
      adminNote: '',
      customerNote: options.customerNote || '',
      deleted: false
    };
    const all = readStoredOrders();
    all.push(order);
    return saveStoredOrders(all) ? order : null;
  }
  function getAll() {
    return readStoredOrders().filter(function (o) {
      return o && !o.deleted;
    }).sort(function (a, b) {
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }
  function getByTracking(code) {
    let i;
    if (!code) return null;
    const target = String(code).trim().toUpperCase();
    const all = readStoredOrders();
    for (i = 0; i < all.length; i++) {
      if (all[i] && !all[i].deleted && String(all[i].trackingCode || '').toUpperCase() === target) {
        return all[i];
      }
    }
    return null;
  }
  function getByEmail(email) {
    if (!email) return [];
    const target = String(email).trim().toLowerCase();
    return getAll().filter(function (o) {
      return o.customer && String(o.customer.email || '').toLowerCase() === target;
    });
  }
  function updateStatus(id, newStatus, note) {
    let i, current, next, currentIndex;
    const all = readStoredOrders();
    for (i = 0; i < all.length; i++) {
      if (all[i] && !all[i].deleted && all[i].id === id) {
        current = normalizeStatus(all[i].status);
        next = normalizeStatus(newStatus);
        currentIndex = STATUS_LIST.indexOf(current);
        if (next !== 'cancelled' && (currentIndex >= 3 || STATUS_LIST.indexOf(next) !== currentIndex + 1)) return null;
        if (next === 'cancelled' && (current === 'delivered' || current === 'cancelled')) return null;
        all[i].status = next;
        all[i].updatedAt = Date.now();
        all[i].statusHistory = all[i].statusHistory || [];
        all[i].statusHistory.push({
          status: all[i].status,
          at: Date.now(),
          note: note || 'Đổi trạng thái sang ' + STATUS_LABEL[all[i].status]
        });
        return saveStoredOrders(all) ? all[i] : null;
      }
    }
    return null;
  }
  function updateAdminNote(id, note) {
    let i;
    const all = readStoredOrders();
    for (i = 0; i < all.length; i++) {
      if (all[i] && all[i].id === id) {
        all[i].adminNote = String(note || '');
        all[i].updatedAt = Date.now();
        return saveStoredOrders(all) ? all[i] : null;
      }
    }
    return null;
  }
  function deleteOrder(id) {
    let i;
    const all = readStoredOrders();
    for (i = 0; i < all.length; i++) {
      if (all[i] && all[i].id === id) {
        all[i].deleted = true;
        all[i].updatedAt = Date.now();
        return saveStoredOrders(all);
      }
    }
    return false;
  }
  function subscribe(callback) {
    if (typeof callback !== 'function') return;
    window.addEventListener('storage', function (e) {
      if (e.key === ORDERS_KEY) {
        callback(getAll());
      }
    });
  }
  window.DTR = window.DTR || {};
  window.DTR.orders = {
    create: createOrder,
    getAll: getAll,
    getByTracking: getByTracking,
    getByEmail: getByEmail,
    updateStatus: updateStatus,
    updateAdminNote: updateAdminNote,
    remove: deleteOrder,
    subscribe: subscribe,
    STATUS_LIST: STATUS_LIST,
    STATUS_LABEL: STATUS_LABEL,
    STATUS_COLOR: STATUS_COLOR,
    formatPrice: formatPrice,
    formatDate: formatDate
  };
})();
