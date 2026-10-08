import { safeRender } from '../utils.js';

const ICONS = {
  help:  '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  chat:  '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  box:   '<path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
  check: '<path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.66 0 3.22.45 4.56 1.24"/>'
};
const svg = name => `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`;

export function renderHero(cfg){
  const meta = cfg.hero.meta.map(m => `<span class="chip">${m.live?'<span class="live"></span>':''}${m.text}</span>`).join('');
  const title = cfg.hero.title.map(l => `<span class="${l.cls}">${l.text}</span>`).join('');

  return `
    <section class="hero">
      <div class="hero-bg-layer" id="heroBg"><div class="orb orb-1"></div><div class="orb orb-2"></div></div>
      <div class="hero-content">
        <div class="hero-meta">${meta}</div>
        <h1 class="hero-title">${title}</h1>
        <div class="hero-bottom">
          <p class="hero-desc">${cfg.hero.desc}</p>
          <div class="hero-actions">
            <a href="#globe" class="btn btn-primary" data-magnetic>${cfg.hero.btn1} <span class="arrow">→</span></a>
            <a href="#journey" class="btn btn-ghost">${cfg.hero.btn2}</a>
          </div>
        </div>
      </div>
      <div class="scroll-hint">SCROLL TO DRAW</div>
    </section>`;
}

export function renderMarquee(cfg){
  const items = cfg.marquee.map(m => `<span class="item"><b>${m.b}</b> ${m.t} <span class="sep"></span></span>`).join('');
  return `<div class="marquee"><div class="marquee-track">${items}${items}</div></div>`;
}

export function renderIntro(cfg){
  return `
    <section class="section" id="platform">
      <div class="section-head reveal"><div class="section-label"><span class="num">[ 01 ]</span>${cfg.intro.label}</div></div>
      <h2 class="section-title reveal" style="margin-bottom:56px">${cfg.intro.title}</h2>
      <p class="intro" data-split>${cfg.intro.text}</p>
    </section>`;
}

export function renderGlobe(cfg){
  const stats = cfg.globe.stats.map(s => `
    <div class="globe-stat">
      <span class="stat-idx">${s.idx}</span>
      <div class="val" data-count="${s.value}" data-suffix="${s.suffix}">0<span class="u">${s.suffix}</span></div>
      <div class="lbl">${s.label}</div>
      <div class="stat-progress"><div class="stat-progress-fill" data-prog="${s.prog}"></div></div>
    </div>`).join('');

  return `
    <section class="globe-section" id="globe">
      <div class="globe-sticky">
        <canvas id="globe-canvas"></canvas>
        <div class="globe-content">
          <h2 class="globe-title" id="globeTitle">${cfg.globe.title}</h2>
          <div class="globe-stats" id="globeStats">${stats}</div>
        </div>
      </div>
      <div class="globe-tooltip" id="globeTooltip"></div>
    </section>`;
}

export function renderJourney(cfg){
  const panels = cfg.journey.items.map(p => `
    <div class="tl-panel">
      <div class="tl-year">${p.year}</div>
      <h3 class="tl-title">${p.title}</h3>
      <p class="tl-desc">${p.desc}</p>
    </div>`).join('');

  return `
    <section class="journey-scroll" id="journey">
      <div class="journey-sticky">
        <div class="journey-head">
          <div>
            <div class="section-label"><span class="num">[ 03 ]</span>${cfg.journey.label}</div>
            <h2 class="section-title">${cfg.journey.title}</h2>
          </div>
        </div>
        <div class="journey-track" id="journeyTrack">${panels}</div>
        <div class="tl-progress" id="journeyProgress"></div>
      </div>
    </section>`;
}

export function renderMission(cfg){
  const M = cfg.mission.cards;
  const rowsHTML = M.countries.rows.map(r => `
    <div class="mini-row">
      <span class="m-idx">${r.idx}</span>
      <span class="m-name">${r.name}</span>
      <span class="m-status${r.hub?' hub':''}">${r.status}</span>
    </div>`).join('');
  const tagsHTML = M.tags.tags.map(t => `<span class="tag">${t}</span>`).join('');

  return `
    <section class="section" id="mission">
      <div class="section-head reveal"><div class="section-label"><span class="num">[ 04 ]</span>${cfg.mission.label}</div></div>
      <h2 class="section-title reveal" style="margin-bottom:56px">${cfg.mission.title}</h2>

      <div class="bento">
        <div class="card c-big tilt reveal">
          <div>
            <div class="label">${M.big1.label}</div>
            <h3>${M.big1.h}</h3>
            <p>${M.big1.p}</p>
          </div>
          <div>
            <svg class="spark" viewBox="0 0 400 64" preserveAspectRatio="none">
              <path d="M0 54 L40 44 L80 48 L120 32 L160 40 L200 22 L240 28 L280 14 L320 22 L360 8 L400 6"/>
            </svg>
            <div class="big-num">${M.big1.num}<span class="u">${M.big1.unit}</span></div>
          </div>
        </div>

        <div class="card c-mid reveal">
          <div class="label">${M.countries.label}</div>
          <h3>${M.countries.h}</h3>
          <div class="mini-list">${rowsHTML}</div>
        </div>

        <div class="card c-mid reveal">
          <div class="label">${M.latency.label}</div>
          <h3>${M.latency.h}</h3>
          <div class="big-num" style="margin-top:24px">${M.latency.num}<span class="u">${M.latency.unit}</span></div>
          <p style="margin-top:20px">${M.latency.p}</p>
        </div>

        <div class="card c-small reveal">
          <div class="label">${M.uptime.label}</div>
          <div class="big-num">${M.uptime.num}<span class="u">${M.uptime.unit}</span></div>
        </div>

        <div class="card c-small reveal">
          <div class="label">${M.txn.label}</div>
          <div class="big-num">${M.txn.num}<span class="u">${M.txn.unit}</span></div>
        </div>

        <div class="card c-small reveal">
          <div class="label">${M.tags.label}</div>
          <div class="tags">${tagsHTML}</div>
        </div>
      </div>
    </section>`;
}

export function renderSupport(cfg){
  const items = cfg.support.items.map(i => `
    <a href="#" class="support-card">
      <div class="support-icon">${svg(i.icon)}</div>
      <div class="support-content">
        <h4>${i.h}</h4>
        <p>${i.p}</p>
      </div>
    </a>`).join('');

  return `
    <section class="section" id="support">
      <div class="section-head reveal"><div class="section-label"><span class="num">[ 05 ]</span>${cfg.support.label}</div></div>
      <h2 class="section-title reveal" style="margin-bottom:56px">${cfg.support.title}</h2>
      <div class="support-grid">${items}</div>
    </section>`;
}

export function renderCTA(cfg){
  return `
    <section class="cta-section" id="cta">
      <div class="cta-eyebrow reveal">${cfg.cta.eyebrow}</div>
      <h2 class="cta-title reveal">${cfg.cta.title}</h2>
      <a href="#" class="cta-big-btn reveal" data-magnetic>
        ${cfg.cta.btn}
        <span class="arrow">→</span>
      </a>
    </section>`;
}

export function renderFooter(cfg){
  const cols = cfg.footer.cols.map(c => `
    <div class="footer-col">
      <h4>${c.title}</h4>
      ${c.links.map(l => `<a href="#">${l}</a>`).join('')}
    </div>`).join('');

  return `
    <footer class="footer">
      <div class="footer-top">
        <div>
          <div class="footer-brand">${cfg.footer.brand}</div>
          <p class="footer-brand-sub">${cfg.footer.tagline}</p>
        </div>
        ${cols}
      </div>
      <div class="footer-bottom">
        <span>${cfg.footer.bottom.left}</span>
        <span>${cfg.footer.bottom.right}</span>
      </div>
    </footer>`;
}

export function renderApp(cfg) {
  const app = document.querySelector('#app');
  app.innerHTML = [
    safeRender('hero', renderHero, cfg),
    safeRender('marquee', renderMarquee, cfg),
    safeRender('intro', renderIntro, cfg),
    safeRender('globe', renderGlobe, cfg),
    safeRender('journey', renderJourney, cfg),
    safeRender('mission', renderMission, cfg),
    safeRender('support', renderSupport, cfg),
    safeRender('cta', renderCTA, cfg),
    safeRender('footer', renderFooter, cfg)
  ].join('');
  document.title = `${cfg.brand.name} · ${cfg.brand.tag}`;
}
