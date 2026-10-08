/* ============================================================
   core.js — THEME ENGINE, LOADER, SCROLL REVEAL, CURSOR GLOW
   ============================================================
   - Persistent Dark/Light theme with localStorage
   - System preference fallback (matchMedia)
   - Default: NVIDIA Dark Mode
   - Dispatches 'dtr:theme-change' event for globe3d.js
   ============================================================ */

const DTR_CORE = (function () {
  'use strict';

  const THEME_KEY = 'dtr_theme';

  /* ============================================================
     THEME ENGINE
     ============================================================ */
  function detectTheme() {
    // Priority 1: localStorage
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) { /* ignore */ }

    // Priority 2: System preference
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch (e) { /* ignore */ }

    // Priority 3: Default to dark (NVIDIA Dark Mode)
    return 'dark';
  }

  function applyTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') theme = 'dark';
    document.documentElement.setAttribute('data-theme', theme);

    // Save
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }

    // Dispatch event for globe3d.js to update scene
    window.dispatchEvent(new CustomEvent('dtr:theme-change', { detail: { theme } }));

    // Update toggle button state
    const themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light' : 'Switch to dark');
      themeBtn.classList.toggle('is-light', theme === 'light');
    }

    return theme;
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ============================================================
     LOADER
     ============================================================ */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    const fill = loader.querySelector('.loader-fill');
    const pct = loader.querySelector('.loader-text .pct');
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (fill) fill.style.width = '100%';
        if (pct) pct.textContent = '100%';
        setTimeout(() => {
          loader.classList.add('done');
          const nav = document.getElementById('nav');
          if (nav) nav.classList.add('show');
          document.body.classList.add('loaded');
        }, 400);
      } else {
        if (fill) fill.style.width = progress + '%';
        if (pct) pct.textContent = Math.floor(progress) + '%';
      }
    }, 120);
  }

  /* ============================================================
     SCROLL REVEAL — IntersectionObserver
     ============================================================ */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .globe-title, .globe-stats, .spark');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in', 'active');
          const fills = entry.target.querySelectorAll('.stat-progress-fill');
          fills.forEach((f, i) => {
            const val = f.dataset.value || '100';
            setTimeout(() => { f.style.width = val + '%'; }, 200 + i * 150);
          });
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ============================================================
     INTRO WORD-BY-WORD REVEAL
     ============================================================ */
  function initIntroReveal() {
    const intro = document.querySelector('.intro');
    if (!intro) return;

    const words = [];

    function processNodes(nodes, parent) {
      Array.from(nodes).forEach(node => {
        if (node.nodeType === 3) {
          const parts = node.textContent.split(/(\s+)/);
          parts.forEach(part => {
            if (part.trim()) {
              const span = document.createElement('span');
              span.className = 'word';
              span.textContent = part;
              words.push(span);
              parent.insertBefore(span, node);
            } else {
              parent.insertBefore(document.createTextNode(part), node);
            }
          });
          parent.removeChild(node);
        } else if (node.nodeType === 1) {
          processNodes(node.childNodes, node);
        }
      });
    }

    processNodes(intro.childNodes, intro);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          words.forEach((w, i) => {
            setTimeout(() => w.classList.add('in'), i * 40);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(intro);
  }

  /* ============================================================
     CURSOR GLOW
     ============================================================ */
  function initCursorGlow() {
    const glow = document.querySelector('.bg-glow');
    if (!glow) return;

    let mx = 50, my = 30;
    let tx = 50, ty = 30;

    window.addEventListener('pointermove', (e) => {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
    }, { passive: true });

    function lerp() {
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;
      glow.style.setProperty('--mx', mx + '%');
      glow.style.setProperty('--my', my + '%');
      requestAnimationFrame(lerp);
    }
    lerp();
  }

  /* ============================================================
     CARD HOVER GLOW
     ============================================================ */
  function initCardGlow() {
    document.querySelectorAll('.card, .support-card').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = ((e.clientX - rect.left) / rect.width) * 100;
        const cy = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--cx', cx + '%');
        card.style.setProperty('--cy', cy + '%');
      });
    });
  }

  /* ============================================================
     SMOOTH SCROLL
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============================================================
     MARQUEE — duplicate content INSIDE track for seamless loop
     ============================================================ */
  function initMarquee() {
    document.querySelectorAll('.marquee-track').forEach(track => {
      if (track.children.length > 0 && !track.dataset.duplicated) {
        // Mark as duplicated to prevent re-init on language change
        track.dataset.duplicated = 'true';
        // Clone all children and append to the SAME track
        const children = Array.from(track.children);
        children.forEach(child => {
          const clone = child.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          track.appendChild(clone);
        });
      }
    });
  }

  /* ============================================================
     NAV — mobile menu toggle
     ============================================================ */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const menuBtn = nav.querySelector('.nav-mobile-toggle');
    const menu = nav.querySelector('.nav-mobile-menu');

    if (menuBtn && menu) {
      menuBtn.addEventListener('click', () => {
        menu.classList.toggle('open');
        menuBtn.classList.toggle('active');
      });
    }

    // Theme toggle button
    const themeBtn = nav.querySelector('.theme-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Nav scrolled state
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     SCROLL HINT + LIVE TRAFFIC COUNTER
     ============================================================ */
  function initScrollHintAndTraffic() {
    // Scroll hint
    const hint = document.getElementById('scrollHint');
    if (hint) {
      setTimeout(() => hint.classList.add('active'), 1200);
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) hint.classList.remove('active');
        else hint.classList.add('active');
      }, { passive: true });
    }

    // Live traffic counter
    const liveUsers = document.getElementById('liveUsers');
    const liveTxn = document.getElementById('liveTxn');
    const liveCountries = document.getElementById('liveCountries');
    const statCountries = document.getElementById('statCountries');

    if (liveUsers) {
      let users = 12847;
      setInterval(() => {
        users += Math.floor(Math.random() * 21) - 10;
        if (users < 11000) users = 11000 + Math.floor(Math.random() * 500);
        if (users > 15000) users = 14500 + Math.floor(Math.random() * 300);
        liveUsers.textContent = users.toLocaleString();
      }, 2000);
    }
    if (liveTxn) {
      let txn = 2431;
      setInterval(() => {
        txn = 2300 + Math.floor(Math.random() * 250);
        liveTxn.textContent = txn.toLocaleString();
      }, 1500);
    }
    if (liveCountries) {
      let c = 47;
      setInterval(() => {
        c = 44 + Math.floor(Math.random() * 7);
        liveCountries.textContent = c;
      }, 5000);
    }
  }

  /* ============================================================
     INIT — only theme (UI effects moved to extras.js)
     ============================================================ */
  function init() {
    // Apply theme FIRST (before paint to avoid FOUC)
    applyTheme(detectTheme());
    initThemeButton();
  }

  function initThemeButton() {
    const btn = document.querySelector('.theme-btn');
    if (!btn) return;
    btn.addEventListener('click', () => toggleTheme());
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    applyTheme,
    toggleTheme,
    detectTheme,
    init
  };
})();

window.DTR_CORE = DTR_CORE;
