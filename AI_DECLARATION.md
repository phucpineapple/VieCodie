# AI Declaration — DTR White Label (Web Design 2026)

Purpose: full transparency about which parts are human decisions and which
parts were AI-assisted, per competition rules.

## Comment convention (enforced in code)

- `[HUMAN]` — requirement, constraint, or decision made by a human.
- `[AI-ASSISTED: <tool>]` — implementation written by an AI tool from a
  human spec; a human must review before submission.

Git commits use Conventional Commits, e.g. `feat(AI/track): ...`,
`refactor(AI/core): ...`, `fix(AI/live-stats): ...`, `docs: ...`.

## Feature table: Idea | Code | Commit

| Feature | Idea (who) | Code (who) | Commit |
|---|---|---|---|
| White-label core (`core.js`, JSON schema, `?brand=&lang=`, vi-fallback) | [HUMAN] team lead | [AI-ASSISTED: Claude] | `refactor(AI/core): migrate i18n from hardcoded to core.js + JSON` |
| 3-brand content (NovaCargo, Sakura Trade VI text) | [HUMAN] team | [AI-ASSISTED: Claude] draft | `feat(AI/content): add brand-2/3 copy` |
| JA/KO/ZH translations (all keys) | [HUMAN] required 4 langs | [AI-ASSISTED: Claude] draft, **NOT via translation API** | same as above |
| Simple landing tracker (SVG icons, no emoji) | [HUMAN] team lead | [AI-ASSISTED: Claude] | `feat(AI/track): simplify landing tracking with SVG icons` |
| Live-stats simulation (UTC multiplier, localStorage) | [HUMAN] team | [AI-ASSISTED: Claude] | `feat(AI/live-stats): add client-side simulation` |
| Manager CMS (13 tabs, FS Access API, restore/swap) | [HUMAN] team lead | [AI-ASSISTED: Claude] | `feat(AI/manager): add white-label CMS with 4-lang inputs` |
| Original landing visuals, globe, animations | [HUMAN] + [AI-ASSISTED: ] base file | patched by [AI-ASSISTED: Claude] | `refactor(AI/core): ...` |
| Docs (README, ARCHITECTURE, ALGORITHMS, DECISIONS, QA_PREP) | [HUMAN] outline | [AI-ASSISTED: Claude] | `docs: add README, AI declaration, architecture docs` |
| Manager load-guard fix (Phase 2A: isLoading, seq, no auto-save) | [HUMAN] bug report (stale save destroyed brand-1) | [AI-ASSISTED: Claude] | `fix(AI/manager): guard loadBrand with isLoading + sequence` |
| Real JA/KO/ZH tracker translations (Phase 2A, 270 keys, no TODO left) | [HUMAN] terminology spec | [AI-ASSISTED: Claude] draft, **NOT via translation API** | `feat(AI/i18n): translate tracker keys ja/ko/zh` |
| Gradient/framework compliance audit (Phase 2A: 24 kept+annotated, 0 removed) | [HUMAN] audit spec | [AI-ASSISTED: Claude] | `docs: compliance audit + ALGORITHMS 5-8 + QA 26-30` |

## What AI did NOT do

- Did not choose the project idea, brands, or visual identity.
- Did not call any translation API — every string is hand-stored in JSON
  (JA/KO/ZH drafts still need native-speaker review, see below).
- Did not deploy, did not present, did not write the oral answers from
  experience — `QA_PREP.txt` answers were reviewed and personalized by humans.
- Did not make judging-criteria or scope decisions (rubric interpretation
  is human).

## Translation note

No auto-translation runs in code. JA/KO/ZH strings are static drafts
written by AI from the VI source. They have **not** been reviewed by native
speakers — formal tone especially needs a pass before any public release.

## Submission checklist

- [ ] Human re-reads every `[AI-ASSISTED]` block; replace tag with `[HUMAN]`
      where reviewed and edited.
- [ ] Native speakers review JA/KO/ZH JSON (formal tone first).
- [ ] Replace brand-2/brand-3 demo numbers with real data if available.
- [ ] Test `?brand=` × `?lang=` matrix (3 × 4 = 12 combos) over Live Server.
- [ ] Test manager save → refresh → restore round-trip.
- [ ] Remove scratch files (`_merge_keys.py`, backup HTML) from submission zip.
- [ ] Rehearse `QA_PREP.txt` demo flow (5 min) at least twice.
