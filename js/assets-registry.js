/* ============================================================
   assets-registry.js — WHITE LABEL ASSET REGISTRY
   ============================================================
   Central registry for brand assets (logos, colors, fonts).
   Allows runtime white-label rebranding via brand JSON config.
   ============================================================ */

const DTR_ASSETS = (function () {
  'use strict';

  // Default brand assets
  const DEFAULT_BRAND = {
    name: 'DTR—Mart',
    shortName: 'DTR',
    logo: {
      text: 'DTR—Mart',
      accent: 'Mart',
      icon: '◈'
    },
    colors: {
      primary: '#c5ff3d',
      secondary: '#d4af37',
      bgDark: '#0a0a0f',
      bgCard: '#101018',
      textMain: '#e8e8e8',
      textDim: '#5a5a6a'
    },
    fonts: {
      heading: 'Space Grotesk, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    contact: {
      email: 'contact@dtr-mart.example',
      phone: '+84 1900 xxxx',
      address: 'Ho Chi Minh City, Vietnam'
    }
  };

  let currentBrand = null;

  /* ============================================================
     LOAD BRAND FROM JSON
     ============================================================ */
  async function loadBrand(jsonPath) {
    try {
      const res = await fetch(jsonPath);
      if (!res.ok) throw new Error('Failed to load brand: ' + res.status);
      const brand = await res.json();
      setBrand(brand);
      return brand;
    } catch (err) {
      console.warn('[DTR_ASSETS] Using default brand:', err.message);
      setBrand(DEFAULT_BRAND);
      return DEFAULT_BRAND;
    }
  }

  /* ============================================================
     SET BRAND — apply to DOM
     ============================================================ */
  function setBrand(brand) {
    currentBrand = brand;

    // Apply CSS custom properties
    const root = document.documentElement;
    if (brand.colors) {
      root.style.setProperty('--color-primary', brand.colors.primary);
      root.style.setProperty('--color-secondary', brand.colors.secondary);
      root.style.setProperty('--color-bg', brand.colors.bgDark);
      root.style.setProperty('--color-card', brand.colors.bgCard);
      root.style.setProperty('--color-text', brand.colors.textMain);
      root.style.setProperty('--color-dim', brand.colors.textDim);
    }

    if (brand.fonts) {
      root.style.setProperty('--font-heading', brand.fonts.heading);
      root.style.setProperty('--font-body', brand.fonts.body);
      root.style.setProperty('--font-mono', brand.fonts.mono);
    }

    // Update logo text
    const logoEls = document.querySelectorAll('[data-brand-logo]');
    logoEls.forEach(el => {
      if (el.dataset.brandLogo === 'text') {
        el.innerHTML = brand.logo.text.replace(
          brand.logo.accent,
          `<span class="accent">${brand.logo.accent}</span>`
        );
      } else if (el.dataset.brandLogo === 'icon') {
        el.textContent = brand.logo.icon;
      }
    });

    // Update brand name
    const nameEls = document.querySelectorAll('[data-brand-name]');
    nameEls.forEach(el => { el.textContent = brand.name; });

    // Update contact info
    if (brand.contact) {
      const emailEls = document.querySelectorAll('[data-brand-email]');
      emailEls.forEach(el => { el.textContent = brand.contact.email; });

      const phoneEls = document.querySelectorAll('[data-brand-phone]');
      phoneEls.forEach(el => { el.textContent = brand.contact.phone; });

      const addrEls = document.querySelectorAll('[data-brand-address]');
      addrEls.forEach(el => { el.textContent = brand.contact.address; });
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('dtr:brand-change', { detail: { brand } }));
  }

  /* ============================================================
     GET BRAND CONFIG (for config.html dashboard)
     ============================================================ */
  function getBrand() {
    return currentBrand || DEFAULT_BRAND;
  }

  /* ============================================================
     EXPORT BRAND CONFIG
     ============================================================ */
  function exportBrand() {
    return JSON.stringify(getBrand(), null, 2);
  }

  /* ============================================================
     LIST AVAILABLE BRANDS
     ============================================================ */
  async function listBrands() {
    const files = ['data/brand-default.json', 'data/brand-sample.json'];
    const results = [];
    for (const f of files) {
      try {
        const res = await fetch(f);
        if (res.ok) {
          const data = await res.json();
          results.push({ file: f, name: data.name || 'Unknown' });
        }
      } catch (e) { /* skip */ }
    }
    return results;
  }

  // Initialize with default
  setBrand(DEFAULT_BRAND);

  return {
    loadBrand,
    setBrand,
    getBrand,
    exportBrand,
    listBrands,
    DEFAULT_BRAND
  };
})();

window.DTR_ASSETS = DTR_ASSETS;
