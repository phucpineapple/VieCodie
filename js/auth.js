(function () {
  'use strict';

  const USERS_KEY = 'dtr_users';
  const SESSION_KEY = 'dtr_session';
  const SALT = 'DTR_MART_2026_SALT_v1';
  const SECRET = 'DTR_2026_SECRET_KEY_v1';
  const SESSION_24H = 24 * 60 * 60 * 1000;
  const DEFAULT_REDIRECT = 'marketplace.html';
  function simpleHash(str) {
    const s = String(str || '');
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h = h & h;
    }
    return Math.abs(h).toString(36);
  }
  async function hashPassword(password) {
    const raw = String(password || '') + SALT;
    try {
      if (window.crypto?.subtle?.digest && typeof TextEncoder !== 'undefined') {
        const data = new TextEncoder().encode(raw);
        const buf = await window.crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {}
    return 'dtr_' + simpleHash(raw) + '_' + simpleHash(SALT + raw);
  }
  function makeSignature(payload) {
    if (!payload) return '';
    return simpleHash((payload?.email || '') + '|' + (payload?.expiresAt || 0) + '|' + SECRET);
  }
  function getUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }
  function saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users || {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  async function ensureDefaultDemoUser() {
    const users = getUsers();
    const demoEmail = 'demo@dtr-market.cyber';
    if (!users[demoEmail]) {
      const demoHash = await hashPassword('123456');
      users[demoEmail] = {
        email: demoEmail,
        name: 'Khách hàng Demo',
        passwordHash: demoHash,
        role: 'customer',
        createdAt: Date.now()
      };
      saveUsers(users);
    }
  }
  ensureDefaultDemoUser();
  async function registerUser(params) {
    const email = params?.email;
    const password = params?.password;
    const name = params?.name;
    const users = getUsers();
    const key = String(email || '').trim().toLowerCase();
    if (!key || !key.includes('@')) throw new Error('Email không hợp lệ');
    if (!password || String(password).length < 6) throw new Error('Mật khẩu tối thiểu 6 ký tự');
    if (!name || String(name).trim().length < 2) throw new Error('Tên tối thiểu 2 ký tự');
    if (users[key]) throw new Error('Email đã được đăng ký');
    const passwordHash = await hashPassword(password);
    users[key] = {
      email: key,
      name: String(name).trim(),
      passwordHash: passwordHash,
      role: 'customer',
      createdAt: Date.now()
    };
    if (!saveUsers(users)) throw new Error('Không thể lưu. Bộ nhớ trình duyệt bị khóa?');
    return {
      email: key,
      name: String(name).trim(),
      role: 'customer'
    };
  }
  async function verifyCredentials(email, password) {
    await ensureDefaultDemoUser();
    const users = getUsers();
    const key = String(email || '').trim().toLowerCase();
    const user = users?.[key];
    if (!user) return null;
    const inputHash = await hashPassword(password);
    const raw = String(password || '') + SALT;
    const fallbackHash = 'dtr_' + simpleHash(raw) + '_' + simpleHash(SALT + raw);
    if (inputHash !== user?.passwordHash && fallbackHash !== user?.passwordHash) {
      return null;
    }
    return {
      email: user.email,
      name: user.name,
      role: user.role || 'customer'
    };
  }
  function saveSession(user, remember) {
    if (!user?.email) return false;
    const defaultName = user.email.includes('@') ? user.email.split('@')[0] : user.email;
    const payload = {
      email: user.email,
      name: user.name || defaultName,
      role: user.role || 'customer',
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_24H
    };
    payload.signature = makeSignature(payload);
    try {
      if (remember) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
        sessionStorage.removeItem(SESSION_KEY);
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
        localStorage.removeItem(SESSION_KEY);
      }
      return true;
    } catch (e) {
      return false;
    }
  }
  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const payload = JSON.parse(raw);
      if (!payload || typeof payload !== 'object') {
        clearSession();
        return null;
      }
      if (payload.signature !== makeSignature(payload)) {
        clearSession();
        return null;
      }
      if (Date.now() >= (payload.expiresAt || 0)) {
        clearSession();
        return null;
      }
      return payload;
    } catch (e) {
      clearSession();
      return null;
    }
  }
  function clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }
  function isAuthenticated() {
    return getSession() !== null;
  }
  function requireAuth(loginUrl, returnUrl) {
    if (!getSession()) {
      const back = encodeURIComponent(returnUrl || location.pathname + location.search);
      location.replace((loginUrl || 'login.html') + '?return=' + back);
      return false;
    }
    return true;
  }
  function handleLoginSuccess(user, remember) {
    saveSession(user, remember);
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('return') || DEFAULT_REDIRECT;
    location.replace(returnUrl);
  }
  function logout() {
    clearSession();
    location.replace('login.html');
  }
  function remainingDays() {
    const s = getSession();
    if (!s?.expiresAt) return 0;
    return Math.max(0, Math.ceil((s.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)));
  }
  function remainingHours() {
    const s = getSession();
    if (!s?.expiresAt) return 0;
    return Math.max(0, Math.ceil((s.expiresAt - Date.now()) / (60 * 60 * 1000)));
  }
  window.DTRAuth = {
    isAuth: isAuthenticated,
    require: requireAuth,
    loginSuccess: handleLoginSuccess,
    logout: logout,
    get: getSession,
    clear: clearSession,
    remainingDays: remainingDays,
    remainingHours: remainingHours,
    register: registerUser,
    verify: verifyCredentials,
    getUsers: getUsers,
    hashPassword: hashPassword
  };
})();
