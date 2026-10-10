# Algorithms — DTR White Label

Four small algorithms do the heavy lifting. Each is written to be explainable
to judges in under a minute.

## 1. i18n fallback merge (`core.js → loadDict`)

```text
dict = { ...vi }                 // Vietnamese is the complete base
for k in langFile:
  if langFile[k] not empty: dict[k] = langFile[k]   // override only real values
```

Missing lang file entirely → return pure `vi`. Missing/empty single key →
Vietnamese shows instead of a blank. The UI can therefore never render an
empty string because of a translation gap; untranslated keys are visually
obvious (Vietnamese text in a Japanese page) so they get fixed.

Cost: O(keys) per language switch, ~150 keys — negligible.

## 2. Live-traffic simulation (`initLiveTraffic`)

Honest client-side simulation (declared as such in docs and QA prep):

```text
dist  = circular distance between current UTC hour and peakHourUTC (14)
mult  = 1 + (businessHoursBoost − 1) × max(0, 1 − dist/12)
target.users = baseUsers × mult        // 12847 × up to 1.35
each 2.2s:
  users += sign(target − users) × 2% of gap   // soft-bounce toward target
         + random(−10 … +10)                  // organic jitter
  persist {users, txn, countries} to localStorage keyed by day
```

Why this shape: pure random walk drifts unrealistically; pure target snap
looks robotic. The 2%-of-gap pull plus jitter converges without snapping,
and the day-keyed `localStorage` means a refresh doesn't reset the numbers
(a judge refreshing the page sees continuity, not a restart).

## 3. Shipment lookup + localized render (`initTracker`)

```text
fetch shipments.json once → index by uppercased id
on search(q): q = trim().upper()
  q empty      → empty state (SVG + skywatch.empty)
  id found     → card: status color, progress bar, fleet/cargo via
                  ship.fleet.<fleetKey> / ship.cargo.<cargoKey>,
                  airports via ship.airport.<code>, regions via
                  ship.region.<key>, notes via ship.note.<noteKey>
  id unknown   → no-result state (query echoed escaped + skywatch.hint)
on 'dtr:lang'  → re-run last search with the new dictionary
```

All user input is HTML-escaped (`esc()`); the query is echoed inside
`<code>` so a judge typing `<img>` gets text, not markup.

## 4. Section-graph hiding (`applyMeta`)

```text
for each [data-section=X]:
  on = (meta.sections[X] !== false)
  hide/show the section
  hide/show every a[href="#<section-id>"]'s container (li / .fab-item)
```

One boolean in `meta.json` removes a section *and* every navigation path to
it (header nav, FAB panel, mobile nav) — no dead links. `hiddenMedia` works
the same way for images, additionally collapsing the parent `.tech-icon`
card so the floating-card ring stays symmetrical.

## 5. Manager load guard (`manager.html → loadBrand`)

```text
seq = ++_loadSeq; isLoading = true
wipe state (vi/ko/ja/zh/meta = {}) → render empty editor
await meta.json, then each lang file
after EVERY await: if seq != _loadSeq → abort (superseded)
on success: update sidebar header (name/tag/logo), render tabs + editor
finally: isLoading = false (only if still current seq)
saveAll: if isLoading → toast "Đang tải…" + block
```

Why: the Phase 1 bug — a slow brand fetch plus an auto-save on tab click
let stale state overwrite the wrong brand folder (destroyed brand-1 once).
The sequence counter makes concurrent loads safe: only the newest completes.
The state wipe means a half-loaded brand can never be saved.

## 6. Brand content swap (`manager.html → swapBrands`)

```text
prompt user for pair (e.g. "1 2") → confirm (destructive)
read ALL lang files + meta for both brands into memory first
then write A→B and B→A
reload current brand
```

Read-everything-before-writing-anything: a failed mid-swap write can't
leave the pair half-exchanged. Meta swap is best-effort (try/catch) since
older brands may lack `meta.json`.

## 7. Restore from pristine defaults (`restoreBrand` / `restoreAll`)

```text
for each file in [meta.json, vi/ko/ja/zh.json]:
  src = read('data/_defaults/<brand>/<file>')   // never written by CMS
  write('data/<brand>/<file>', src)
reload brand
```

`_defaults/` is read-only by convention (manager never writes there), so
restore is a pure copy — no reconstruction logic, no version tracking
needed. Per-file try/catch skips missing files instead of aborting.

## 8. Locale-aware number formatting (live counters)

```text
LOCALES = { vi:'vi-VN', ja:'ja-JP', ko:'ko-KR', zh:'zh-CN' }
fmt(n) = n.toLocaleString(LOCALES[__currentLang])
on 'dtr:lang' → repaint current values with new locale
```

Same number, four renderings (12.847 vs 12,847 vs 12 847). Repaint-on-event
keeps formatting correct after in-page language switches without touching
the simulation state.
