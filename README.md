# DTR White Label — Web Design 2026

White-label landing page: one shared `index.html` serves 3 brands × 4 languages
from JSON data files. No backend, no database, no build step.

- **Brand 1 — DTR—Mart** (`data/brand-1`): global digital-commerce platform, lime `#c5ff3d`
- **Brand 2 — NovaCargo** (`data/brand-2`): smart air-freight carrier, cyan `#4fd1ff`
- **Brand 3 — Sakura Trade** (`data/brand-3`): Vietnam–Japan trade bridge, pink `#ff9bb8`

Languages: Vietnamese (default/fallback) · 日本語 · 한국어 · 中文.

## Libraries

| Library | Version | License | Used for |
|---|---|---|---|
| GSAP + ScrollTrigger | 3.12.5 | Standard "No Charge" | Scroll reveals, hero/counters animation |
| Three.js | 0.160.0 | MIT | 3D globe in `#globe-section` |
| Google Fonts / Fontshare | — | OFL | Display + serif + sans typography |

No frameworks, no UI kits, no backend, no bundlers, no translation APIs.
Icons are hand-written inline SVG (`viewBox="0 0 24 24"`, stroke 1.6).

## How to run

JSON is loaded with `fetch`, so the page **must** be served over HTTP —
opening `index.html` via `file://` shows an error banner by design.

```bash
# VS Code: right-click index.html → "Open with Live Server"
# or any static server from the project root:
npx serve .
```

Then open the printed URL (e.g. `http://127.0.0.1:5500/index.html`).

`manager.html` (local CMS) works the same way — open it through Live Server.

## URL params

| Param | Values | Default | Effect |
|---|---|---|---|
| `?brand=` | `brand-1` `brand-2` `brand-3` | `brands.json → default` | Loads that brand's `meta.json` + lang files: theme colors, visible sections, media URLs, links, all text |
| `?lang=` | `vi` `ja` `ko` `zh` | `vi` | Loads `vi.json` first, merges `<lang>.json` on top (missing/empty keys fall back to Vietnamese) |

Examples:

```text
index.html?brand=brand-2&lang=ja
index.html?brand=brand-3&lang=ko
```

Language can also be switched in-page (header segment, FAB panel) without
reload — `core.js` updates the URL via `history.replaceState` and dispatches
a `dtr:lang` event that the tracker and live counters listen to.

## Folder structure

```text
index.html            shared landing (reads ?brand=&lang=)
core.js               white-label core: fetch JSON, vi-fallback merge,
                      apply theme/sections/media/links/text
manager.html          local CMS: edit all brands × 4 langs, save via
                      File System Access API (download fallback),
                      restore from data/_defaults/
modules/skywatch.html SkyWatch Earth live demo (linked from landing CTA)
data/
  brands.json         brand list + default
  brand-1/            DTR—Mart: meta.json, vi/ja/ko/zh.json,
  brand-2/            NovaCargo: shipments.json, live-stats.json
  brand-3/            Sakura Trade: (same 7 files)
  _defaults/          pristine copies — "Restore" source, do not edit
docs/
  ARCHITECTURE.md     data flow + component map
  ALGORITHMS.md       the 4 algorithms judges may ask about
  DECISIONS.md        why each design choice was made
QA_PREP.txt           oral-exam study guide (Vietnamese)
```

## Key mechanics (30-second version)

1. `core.js` boots: `brands.json` → brand `meta.json` → `vi.json` + `<lang>.json`.
2. `applyMeta`: CSS variables from `theme`, hide `sections.* === false`
   (plus their nav links), set `img[data-media]` URLs, hide `hiddenMedia`,
   wire `links.partnerLearnMore` / `links.globeLearnMore`.
3. `applyDict`: `data-i18n` (text), `data-i18n-html`, `data-i18n-placeholder`,
   `data-i18n-aria`, SEO tags, language-button state.
4. Tracker fetches `shipments.json`; live counters fetch `live-stats.json`
   and scale by UTC business-hours multiplier.
