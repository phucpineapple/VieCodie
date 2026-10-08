/* ============================================================
   extras.js — LOADER + CURSOR + BG EFFECTS + UI INTERACTIONS
   Rebuilt to match source gốc (Rockstar navy + Genshin cinematic)
   ============================================================ */

(function () {
  'use strict';

  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));

  /* ============================================================
     LOADER — D mark + spinner + bar + pct
     ============================================================ */
  function runLoader() {
    return new Promise((resolve) => {
      const fill = $('#loaderFill');
      const pct = $('#loaderPct');
      if (!fill || !pct) return resolve();
      const t0 = performance.now();
      const dur = 1800;
      (function tick(now) {
        const p = Math.min(1, (now - t0) / dur);
        const v = Math.floor(p * 100);
        fill.style.width = v + '%';
        pct.textContent = v + '%';
        if (p < 1) requestAnimationFrame(tick);
        else setTimeout(() => {
          $('#loader').classList.add('done');
          document.body.classList.remove('no-cursor');
          resolve();
        }, 250);
      })(t0);
    });
  }

  /* ============================================================
     CURSOR — refined (32px ring + 4px dot) with mix-blend
     ============================================================ */
  function initCursor() {
    if (matchMedia('(hover:none)').matches) return;
    const cur = $('#cursor'), dot = $('#cursorDot');
    if (!cur || !dot) return;
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cur.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, .mission-card, .support-card, .globe-stat, .timeline-item, [data-magnetic]'))
        cur.classList.add('hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, .mission-card, .support-card, .globe-stat, .timeline-item, [data-magnetic]'))
        cur.classList.remove('hover');
    });
  }

  /* ============================================================
     BG GLOW + HERO PARALLAX
     ============================================================ */
  function initMouseEffects() {
    const glow = $('#bgGlow');
    const heroBg = $('#heroBg');
    if (!glow) return;
    let mx = innerWidth / 2, my = 300;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function tick() {
      glow.style.setProperty('--mx', mx + 'px');
      glow.style.setProperty('--my', my + 'px');
      if (heroBg) {
        const dx = (mx / innerWidth - 0.5) * 30;
        const dy = (my / innerHeight - 0.5) * 30;
        heroBg.style.transform = `translate(${dx}px, ${dy}px)`;
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ============================================================
     PARTICLES CANVAS — lime dots + connecting lines
     ============================================================ */
  function initParticles() {
    const canvas = $('#particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles, dpr;

    function resize() {
      dpr = Math.min(devicePixelRatio, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor(innerWidth * innerHeight / 22000);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.2 + 0.4
        });
      }
    }

    function loop() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const maxDist = 130;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(197,255,61,0.35)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(197,255,61,${(1 - d / maxDist) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(loop);
    }
    window.addEventListener('resize', resize);
    resize();
    loop();
  }

  /* ============================================================
     REVEAL on scroll
     ============================================================ */
  function initReveal() {
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal, .mission-card, .support-card, .timeline-item').forEach(el => io.observe(el));

    const sparkIO = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          sparkIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    $$('.spark').forEach(el => sparkIO.observe(el));
  }

  /* ============================================================
     SPLIT WORDS — word-by-word reveal for [data-split]
     ============================================================ */
  function initSplitWords() {
    $$('[data-split]').forEach(el => {
      const html = el.innerHTML;
      // Tokenize while preserving inner tags
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const out = [];
      tmp.childNodes.forEach(node => {
        if (node.nodeType === 3) {
          const parts = node.textContent.split(/(\s+)/);
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) out.push(p);
            else out.push(`<span class="word">${p}</span>`);
          });
        } else {
          out.push(node.outerHTML);
        }
      });
      el.innerHTML = out.join('');
      const io = new IntersectionObserver(es => {
        es.forEach(e => {
          if (e.isIntersecting) {
            el.querySelectorAll('.word').forEach((w, i) => {
              setTimeout(() => w.classList.add('in'), i * 30);
            });
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      io.observe(el);
    });
  }

  /* ============================================================
     COUNTERS — animate [data-count] values
     ============================================================ */
  function initCounters() {
    const ease = t => 1 - Math.pow(1 - t, 3);
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const t0 = performance.now(), dur = 1800;
        (function tick(now) {
          const p = Math.min(1, (now - t0) / dur);
          const v = Math.round(target * ease(p));
          el.innerHTML = v + '<span class="u">' + suffix + '</span>';
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    $$('[data-count]').forEach(el => io.observe(el));

    // Progress fills (data-prog)
    const progIO = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.prog + '%';
          progIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    $$('[data-prog]').forEach(el => progIO.observe(el));

    // stat-progress-fill (legacy class)
    const statIO = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          const fill = e.target;
          const v = fill.dataset.value;
          if (v) fill.style.width = v + '%';
          statIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    $$('.stat-progress-fill').forEach(el => statIO.observe(el));
  }

  /* ============================================================
     TILT — 3D perspective tilt on cards
     ============================================================ */
  function initTilt() {
    $$('.tilt, .mission-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(1000px) rotateX(${(y - 0.5) * -4}deg) rotateY(${(x - 0.5) * 4}deg) translateY(-2px)`;
        card.style.setProperty('--cx', (x * 100) + '%');
        card.style.setProperty('--cy', (y * 100) + '%');
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
    $$('.support-card').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--cx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--cy', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ============================================================
     MAGNETIC — buttons attract toward cursor
     ============================================================ */
  function initMagnetic() {
    $$('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.6s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.35s';
        btn.style.transform = '';
        setTimeout(() => btn.style.transition = '', 600);
      });
    });
  }

  /* ============================================================
     SCROLL HINT / NAV scrolled
     ============================================================ */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ============================================================
     GLOBE STICKY — fade title + stats + canvas while in section
     ============================================================ */
  function initGlobeScroll() {
    const section = $('#network');
    const title = $('#globeTitle');
    const stats = $('#globeStats');
    const canvas = $('#scene');
    if (!section) return;
    function update() {
      const r = section.getBoundingClientRect();
      const total = section.offsetHeight - innerHeight;
      const scrolled = Math.max(0, Math.min(total, -r.top));
      const p = total > 0 ? scrolled / total : 0;
      if (p > 0.12 && p < 0.92) {
        title?.classList.add('active');
        stats?.classList.add('active');
        canvas?.classList.add('active');
      } else {
        title?.classList.remove('active');
        stats?.classList.remove('active');
        canvas?.classList.remove('active');
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ============================================================
     LIVE TRAFFIC — pulse numbers
     ============================================================ */
  function initLiveTraffic() {
    const u = $('#liveUsers');
    const t = $('#liveTxn');
    const c = $('#liveCountries');
    if (u) {
      let n = 12847;
      setInterval(() => {
        n += Math.floor(Math.random() * 21) - 10;
        if (n < 11000) n = 11000 + Math.floor(Math.random() * 500);
        if (n > 15000) n = 14500 + Math.floor(Math.random() * 300);
        u.textContent = n.toLocaleString();
      }, 2000);
    }
    if (t) {
      let n = 2431;
      setInterval(() => { n = 2300 + Math.floor(Math.random() * 250); t.textContent = n.toLocaleString(); }, 1500);
    }
    if (c) {
      let n = 47;
      setInterval(() => { n = 44 + Math.floor(Math.random() * 7); c.textContent = n; }, 5000);
    }
  }

  /* ============================================================
     CART BUTTON — pulse + placeholder toast (no real shop yet)
     ============================================================ */
  function initCart() {
    const btn = document.querySelector('.nav-btn-cart');
    const badge = document.getElementById('cartBadge');
    if (!btn) return;

    // Demo count — replace with real store integration later
    let count = 0;
    if (badge) badge.textContent = count;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.remove('cart-pulse');
      // restart animation
      void btn.offsetWidth;
      btn.classList.add('cart-pulse');
      // Mini toast placeholder — wired to be replaced by real cart drawer
      showMiniToast('Giỏ hàng của bạn đang trống. Tính năng sẽ hoàn thiện sau.');
    });
  }

  function showMiniToast(text) {
    let t = document.getElementById('dtr-mini-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'dtr-mini-toast';
      t.style.cssText = [
        'position:fixed', 'right:24px', 'bottom:24px', 'z-index:9999',
        'padding:14px 20px', 'border-radius:14px',
        'background:rgba(20,24,32,.96)', 'color:#fff9cb',
        'border:1px solid rgba(197,255,61,.35)',
        'font-family:var(--sans,system-ui)', 'font-size:13px',
        'box-shadow:0 18px 40px rgba(0,0,0,.4)',
        'opacity:0', 'transform:translateY(8px)',
        'transition:opacity .25s ease, transform .25s ease',
        'max-width:320px', 'pointer-events:none'
      ].join(';');
      document.body.appendChild(t);
    }
    t.textContent = text;
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
    });
    clearTimeout(showMiniToast._t);
    showMiniToast._t = setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(8px)';
    }, 2600);
  }

  /* ============================================================
     BOOT — order matters
     ============================================================ */
  function init() {
    initCursor();
    initMouseEffects();
    initParticles();
    initReveal();
    initSplitWords();
    initCounters();
    initTilt();
    initMagnetic();
    initNav();
    initGlobeScroll();
    initLiveTraffic();
    initCart();
    return runLoader();
  }

  // Reveal only after DOM + scripts (i18n, logistics, globe3d) ready
  function ready() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // small delay so other scripts set up first
        setTimeout(init, 50);
      });
    } else {
      setTimeout(init, 50);
    }
  }
  ready();
})();