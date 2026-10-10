# Decisions — DTR White Label

Why each significant choice was made. Every entry: decision → reason →
trade-off accepted.

## 1. No framework, no backend, no build step

**Decision:** Vanilla HTML/CSS/JS + static JSON over HTTP.
**Why:** Competition bans React/Vue/Angular/Svelte, all UI kits, all
backends/DBs, and all bundlers. Beyond compliance, a static site deploys
anywhere (Vercel, GitHub Pages, any host) with zero cold starts.
**Trade-off:** No components/router — shared markup is one big `index.html`;
discipline (data-attributes, no hardcoded text) replaces tooling.

## 2. `vi.json` as complete fallback base

**Decision:** Every language merges over Vietnamese; missing/empty keys show VI.
**Why:** The team writes Vietnamese first and best. Fallback guarantees no
blank UI ever, and untranslated keys are self-announcing (VI text inside a
JA page). Alternative — English fallback — was rejected with English itself
(see #3).
**Trade-off:** Non-VI pages can briefly show Vietnamese for new keys until
translated; accepted as a feature (visibility) not a bug.

## 3. Four languages, English dropped

**Decision:** `LANGS = ['vi','ja','ko','zh']`.
**Why:** Target markets are Vietnam, Japan, Korea, China (brands: DTR—Mart,
NovaCargo, Sakura Trade). Cutting the fifth language removed ~150 keys ×
maintenance surface and matched the team's actual translation capacity.
**Trade-off:** International judges read Vietnamese fallback or use the demo
narrator; accepted, documented in QA prep.

## 4. Theme as CSS custom properties from `meta.json`

**Decision:** Colors live in `meta.theme`, applied via `setProperty`.
**Why:** A brand re-skin is 6 hex values, zero CSS edits. The 3D globe, GSAP
accents, and tracker all consume the same variables, so re-theming is atomic.
**Trade-off:** Theme keys must keep the exact `--` names the CSS expects;
manager.html documents them rather than allowing free-form keys.

## 5. Section toggles hide navigation too

**Decision:** `applyMeta` hides sections *and* their nav/FAB/mobile links.
**Why:** A hidden section with a visible link is a dead end — worse than no
link. One boolean stays consistent everywhere.
**Trade-off:** Section `<section>` elements need stable ids matching nav
hrefs; renaming an id requires updating both (grep-able, documented).

## 6. Tracker split: simple in-landing + full demo page

**Decision:** Landing embeds a lightweight lookup (input + card + SVG);
the heavy SkyWatch Earth 3D demo lives in `modules/skywatch.html`, opened
in a new tab.
**Why:** The iframe version bloated landing load and duplicated state. The
split keeps landing fast (rubric: UX) while the demo page can be as heavy
as it wants. Judges see both within one click.
**Trade-off:** Two tracking UIs to maintain; the landing one is deliberately
kept minimal so the cost stays near zero.

## 7. Simulated live counters, honestly labeled

**Decision:** `live-stats.json` bases × UTC business-hours multiplier +
jitter + daily localStorage, documented as simulation.
**Why:** No backend means no real realtime feed; faking it silently would be
dishonest, and static numbers look dead. The simulation is declared in docs
and QA answers ("mô phỏng phía client").
**Trade-off:** Numbers are illustrative, not real; the mechanism (multiplier,
persistence, locale formatting) is the real deliverable.

## 8. Manager as local CMS, File System Access first

**Decision:** `manager.html` edits JSON via File System Access API with
download fallback; pristine copies in `data/_defaults/`.
**Why:** No backend means the CMS can't `POST` anywhere — writing files
directly (Chromium) or downloading them (other browsers) is the honest
maximum. `_defaults/` makes "restore" a read, not a memory.
**Trade-off:** Firefox/Safari users download-then-copy instead of direct
save; the toast explains this. Manager is a local tool, never deployed.

## 9. SVG stroke icons only, no emoji UI

**Decision:** All functional icons are inline SVG (24×24, stroke 1.6);
emoji removed from tracker, language buttons, FAB.
**Why:** Emoji render inconsistently across judge machines (Windows vs
macOS fonts) and read as unprofessional in a B2B logistics UI. SVG inherits
`currentColor`, so it re-themes with the brand automatically.
**Trade-off:** Slightly more markup per icon; a shared SVG snippet pattern
in the tracker keeps it manageable.
