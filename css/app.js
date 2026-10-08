import { renderApp } from './components/render.js';
import { initCursor } from './effects/cursor.js';
import { initParticles } from './effects/particles.js';
import { initTilt, initMagnetic } from './effects/tilt-magnetic.js';
import { initGlobe3D } from './modules/globe3d.js';
import { 
  initReveal, 
  initSplitWords, 
  initCounters, 
  initGlobeScroll, 
  initJourney, 
  initNav 
} from './modules/scroll-effects.js';

function runLoader() {
  return new Promise(resolve => {
    const fill = document.querySelector('#loaderFill');
    const pct = document.querySelector('#loaderPct');
    const t0 = performance.now();
    const dur = 1500;
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const v = Math.floor(p * 100);
      if (fill) fill.style.width = v + '%';
      if (pct) pct.textContent = v + '%';
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(() => {
        document.querySelector('#loader')?.classList.add('done');
        document.body.classList.remove('no-cursor');
        resolve();
      }, 200);
    })(t0);
  });
}

(async function boot() {
  try {
    const CFG = window.APP_CONFIG;
    renderApp(CFG);
    initCursor();
    initParticles();
    initReveal();
    initSplitWords();
    initCounters();
    initTilt();
    initMagnetic();
    initGlobeScroll();
    initJourney();
    initNav();
    await initGlobe3D();
    await runLoader();
  } catch (err) {
    console.error('[WhiteBoard] Boot error:', err);
    document.body.classList.remove('no-cursor');
    document.querySelector('#loader')?.classList.add('done');
  }
})();
