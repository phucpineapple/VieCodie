# Architecture — DTR White Label

## Big picture

One static landing page (`index.html`) + one JS core (`core.js`) + pure JSON
data. No server, no build, no framework. The "white label" is just:
**URL params → JSON files → DOM patching**.

```text
index.html?brand=brand-2&lang=ja
      │ core.js boot()
      ▼
data/brands.json ──► find brand-2 ──► path = data/brand-2
      │                                    ├─► meta.json      → applyMeta()
      │                                    ├─► vi.json        → base dict
      │                                    └─► ja.json        → merge on top → applyDict()
      ▼
index.html (same file, new skin + new language)
```

## Component map

| Component | File | Role |
|---|---|---|
| Shell | `index.html` | All markup/CSS/animations. Zero hardcoded text that matters — every string has `data-i18n*`, every brand image has `data-media`, every section has `data-section` |
| Core | `core.js` | Boot, fetch, vi-fallback merge, `applyMeta`, `applyDict`, `window.applyLanguage`, `window.DTR` state, error banner |
| Brand registry | `data/brands.json` | `{ default, brands: [{id, label, path}] }` |
| Brand config | `data/<brand>/meta.json` | `theme` (CSS vars), `sections` (9 booleans), `hiddenMedia`, `links`, `media` (10 URLs) |
| Copy | `data/<brand>/{vi,ja,ko,zh}.json` | Flat `dot.notation` keys. `vi.json` is the complete source of truth; other langs only override |
| Tracking data | `data/<brand>/shipments.json` | 2 shipments: ids, status, progress, origin/destination, events with `locationKey`/`noteKey` resolved through i18n |
| Live counters | `data/<brand>/live-stats.json` | Base numbers + business-hours multiplier config |
| Pristine backup | `data/_defaults/<brand>/*` | Exact copies. Manager "Restore" reads from here |
| CMS | `manager.html` | 13-tab editor, 4-lang grids, media thumbnails, section toggles, FS Access save + download fallback, restore, brand swap |
| Live demo | `modules/skywatch.html` | Heavy 3D tracking demo, opened in a new tab from the landing CTA |
| Docs | `docs/`, `README.md`, `AI_DECLARATION.md`, `QA_PREP.txt` | What judges read |

## Data flow: language switch (no reload)

```text
click [data-lang] → window.applyLanguage(lang)
  → loadDict(base, lang) → applyDict()
  → history.replaceState(?lang=)
  → dispatch 'dtr:lang' → tracker re-renders, live counters re-format
```

`window.I18N = { vi, [lang]: dict }` is kept so legacy inline scripts
that read `I18N[__currentLang]` keep working.

## Data flow: section toggle

`meta.sections.journey === false` → `[data-section="journey"]` gets
`hidden` + `display:none`, and every `a[href="#journey"]` (nav, FAB,
mobile nav) is hidden with it. Same mechanism drives all 9 sections.

## Constraints honored

- Allowed: GSAP 3.12.5, Three.js 0.160.0, Google/Fontshare fonts, inline SVG.
- Banned (none present): React/Vue/Angular/Svelte, Bootstrap/Tailwind UI,
  any backend/DB, Vite/Webpack/Sass/TS, Google/DeepL translate APIs.
- `file://` is intentionally unsupported (fetch needs HTTP) — the error
  banner tells the user to use Live Server.
