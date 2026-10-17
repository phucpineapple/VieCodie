(function () {
  'use strict';

  function showToast(msg, isError) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.toggle('error', !!isError);
    t.classList.add('show');
    clearTimeout(t._tmr);
    t._tmr = setTimeout(() => t.classList.remove('show'), 2500);
  }
  const LoaderCtl = (() => {
    const el = document.getElementById('loader');
    const fill = document.getElementById('loaderFill');
    const pct = document.getElementById('loaderPct');
    const label = document.getElementById('loaderLabel');
    if (!el) return {
      run: () => Promise.resolve(),
      setText: () => {},
      hide: () => {}
    };
    let rafId = null;
    function run(duration = 1500) {
      return new Promise(resolve => {
        el.classList.remove('redirecting', 'done');
        const t0 = performance.now();
        cancelAnimationFrame(rafId);
        (function tick(now) {
          const p = Math.min(1, (now - t0) / duration);
          const v = Math.floor(p * 100);
          if (fill) fill.style.width = v + '%';
          if (pct) pct.textContent = v + '%';
          if (p < 1) rafId = requestAnimationFrame(tick);else setTimeout(resolve, 200);
        })(t0);
      });
    }
    function setText(msg) {
      if (label) label.textContent = msg;
      el?.classList?.add('redirecting');
    }
    function hide() {
      el?.classList?.add('done');
      document.body?.classList?.remove('is-loading');
    }
    return {
      run,
      setText,
      hide
    };
  })();
  const formsWrap = document.getElementById('formsWrap');
  const loginPanel = document.getElementById('loginPanel');
  const registerPanel = document.getElementById('registerPanel');
  function switchTo(target) {
    if (!formsWrap || !loginPanel || !registerPanel) return;
    const isRegister = target === 'register';
    const newPanel = isRegister ? registerPanel : loginPanel;
    const oldPanel = isRegister ? loginPanel : registerPanel;
    newPanel.classList.remove('hidden', 'reverse');
    const targetH = newPanel.offsetHeight;
    formsWrap.style.height = targetH + 'px';
    oldPanel.classList.add('hidden');
    if (isRegister) oldPanel.classList.add('reverse');
    setTimeout(() => {
      if (formsWrap) formsWrap.style.height = 'auto';
    }, 500);
    setTimeout(() => {
      const firstInput = newPanel?.querySelector('input');
      firstInput?.focus();
    }, 400);
  }
  (async function bootstrap() {
    try {
      await LoaderCtl.run(1500);
      if (window.DTRAuth?.isAuth?.()) {
        const params = new URLSearchParams(location.search);
        const returnUrl = params.get('return') || 'marketplace.html';
        LoaderCtl.setText('Đang chuyển hướng đến Marketplace...');
        await new Promise(r => setTimeout(r, 800));
        location.replace(returnUrl);
        return;
      }
    } catch (err) {
      console.error('[DTR Login Error]', err);
    } finally {
      LoaderCtl.hide();
      setTimeout(() => {
        if (formsWrap) formsWrap.style.height = 'auto';
      }, 100);
    }
  })();
  setTimeout(() => {
    if (formsWrap) formsWrap.style.height = 'auto';
  }, 100);
  document.getElementById('gotoRegister')?.addEventListener('click', () => switchTo('register'));
  document.getElementById('gotoLogin')?.addEventListener('click', () => switchTo('login'));
  if (location.hash === '#register') switchTo('register');
  document.querySelectorAll('[data-toggle-pass]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn?.dataset?.togglePass;
      const input = id ? document.getElementById(id) : null;
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const loginEmail = document.getElementById('loginEmail');
  const loginPass = document.getElementById('loginPassword');
  const rememberMe = document.getElementById('rememberMe');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!window.DTRAuth) {
        showToast('Không tìm thấy mô-đun xác thực (auth.js)', true);
        return;
      }
      const email = (loginEmail?.value || '').trim().toLowerCase();
      const password = loginPass?.value || '';
      const remember = !!rememberMe?.checked;
      if (!email || !email.includes('@')) {
        showToast('Email không hợp lệ', true);
        loginEmail?.focus();
        return;
      }
      if (!password || password.length < 6) {
        showToast('Mật khẩu tối thiểu 6 ký tự', true);
        loginPass?.focus();
        return;
      }
      const btnSpan = loginBtn?.querySelector('span');
      const origText = btnSpan ? btnSpan.textContent : 'Đăng nhập';
      if (btnSpan) btnSpan.textContent = 'Đang xử lý...';
      if (loginBtn) loginBtn.disabled = true;
      try {
        const user = await window.DTRAuth.verify(email, password);
        if (!user) {
          if (btnSpan) btnSpan.textContent = origText;
          if (loginBtn) loginBtn.disabled = false;
          showToast('Email hoặc mật khẩu không đúng', true);
          if (loginPass) {
            loginPass.value = '';
            loginPass.focus();
          }
          return;
        }
        window.DTRAuth.loginSuccess(user, remember);
      } catch (err) {
        if (btnSpan) btnSpan.textContent = origText;
        if (loginBtn) loginBtn.disabled = false;
        showToast(err?.message || 'Lỗi đăng nhập', true);
      }
    });
  }
  const registerForm = document.getElementById('registerForm');
  const registerBtn = document.getElementById('registerBtn');
  const regName = document.getElementById('regName');
  const regEmail = document.getElementById('regEmail');
  const regPass = document.getElementById('regPassword');
  const regConfirm = document.getElementById('regConfirm');
  [regName, regEmail, regPass, regConfirm].forEach(inp => {
    inp?.addEventListener('input', () => {
      const f = inp.closest('.field');
      if (f) f.classList.remove('invalid');
    });
  });
  function setError(fieldId, on) {
    const fieldEl = document.getElementById(fieldId);
    if (fieldEl) fieldEl.classList.toggle('invalid', !!on);
  }
  async function validateRegister() {
    let ok = true;
    const nameVal = (regName?.value || '').trim();
    const emailVal = (regEmail?.value || '').trim().toLowerCase();
    const passVal = regPass?.value || '';
    const confirmVal = regConfirm?.value || '';
    if (nameVal.length < 2) {
      setError('nameField', true);
      ok = false;
    } else setError('nameField', false);
    if (!emailVal.includes('@') || !emailVal.includes('.')) {
      setError('emailField', true);
      ok = false;
    } else {
      const users = window.DTRAuth?.getUsers?.() || {};
      if (users[emailVal]) {
        setError('emailField', true);
        ok = false;
      } else setError('emailField', false);
    }
    if (passVal.length < 6) {
      setError('passField', true);
      ok = false;
    } else setError('passField', false);
    if (confirmVal !== passVal || !confirmVal) {
      setError('confirmField', true);
      ok = false;
    } else setError('confirmField', false);
    return ok;
  }
  if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!window.DTRAuth) {
        showToast('Không tìm thấy mô-đun xác thực (auth.js)', true);
        return;
      }
      const valid = await validateRegister();
      if (!valid) {
        showToast('Vui lòng kiểm tra lại thông tin', true);
        return;
      }
      const btnSpan = registerBtn?.querySelector('span');
      const origText = btnSpan ? btnSpan.textContent : 'Đăng ký';
      if (btnSpan) btnSpan.textContent = 'Đang tạo tài khoản...';
      if (registerBtn) registerBtn.disabled = true;
      try {
        const user = await window.DTRAuth.register({
          email: (regEmail?.value || '').trim(),
          password: regPass?.value || '',
          name: (regName?.value || '').trim()
        });
        showToast('Đăng ký thành công! Đang chuyển hướng...');
        setTimeout(() => window.DTRAuth?.loginSuccess?.(user, true), 1000);
      } catch (err) {
        if (btnSpan) btnSpan.textContent = origText;
        if (registerBtn) registerBtn.disabled = false;
        showToast(err?.message || 'Đăng ký thất bại', true);
      }
    });
  }
  (function () {
    const fabBtn = document.getElementById('fabBtn');
    const fabPanel = document.getElementById('fabPanel');
    const fabOverlay = document.getElementById('fabOverlay');
    const fabClose = document.getElementById('fabClose');
    const fabLogin = document.getElementById('fabLogin');
    const fabRegister = document.getElementById('fabRegister');
    const fabLangs = document.getElementById('fabLangs');
    if (!fabBtn || !fabPanel || !fabOverlay) return;
    function openFab() {
      fabPanel.classList.add('open');
      fabOverlay.classList.add('open');
      fabBtn.classList.add('active');
      fabBtn.setAttribute('aria-expanded', 'true');
      if (document.body) document.body.style.overflow = 'hidden';
    }
    function closeFab() {
      fabPanel.classList.remove('open');
      fabOverlay.classList.remove('open');
      fabBtn.classList.remove('active');
      fabBtn.setAttribute('aria-expanded', 'false');
      if (document.body) document.body.style.overflow = '';
    }
    fabBtn.addEventListener('click', () => {
      fabPanel.classList.contains('open') ? closeFab() : openFab();
    });
    fabOverlay.addEventListener('click', closeFab);
    fabClose?.addEventListener('click', closeFab);
    fabLogin?.addEventListener('click', () => {
      switchTo('login');
      closeFab();
    });
    fabRegister?.addEventListener('click', () => {
      switchTo('register');
      closeFab();
    });
    fabPanel.querySelectorAll('a.fab-item').forEach(a => {
      a.addEventListener('click', closeFab);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && fabPanel.classList.contains('open')) closeFab();
    });
    if (fabLangs) {
      const CODES = {
        vi: 'VI',
        ja: 'JA',
        en: 'EN',
        zh: 'ZH'
      };
      const savedLang = localStorage.getItem('dtr_lang') || 'vi';
      fabLangs.querySelectorAll('.fab-lang').forEach(x => {
        x.classList.toggle('active', x?.dataset?.lang === savedLang);
      });
      fabLangs.querySelectorAll('.fab-lang').forEach(b => {
        b.addEventListener('click', () => {
          const lang = b?.dataset?.lang || 'vi';
          fabLangs.querySelectorAll('.fab-lang').forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          localStorage.setItem('dtr_lang', lang);
          if (document.documentElement) document.documentElement.lang = lang;
          if (typeof window.applyLanguage === 'function') window.applyLanguage(lang);else if (typeof window.setLang === 'function') window.setLang(lang);
          showToast('Ngôn ngữ: ' + (CODES[lang] || 'VI'));
        });
      });
    }
  })();
})();
