\# DTR WHITE LABEL — PROJECT CONTEXT

\# Version: 1.0 | Competition: Web Design 2026



═══════════════════════════════════════════════════════════════

1\. COMPETITION INFO

═══════════════════════════════════════════════════════════════

\- Name: Web Design 2026 — MPC Club, HCMC Open University

\- Theme: White Label for Enterprises

\- Deadline: Nov 10, 2026, 13:00 (qualifying round)

\- Budget: 10M Claude tokens (8M work + 2M fix reserve)

\- Model: Claude Sonnet 4.5 (do NOT use Haiku or Opus)



═══════════════════════════════════════════════════════════════

2\. RUBRIC — 100 POINTS TOTAL

═══════════════════════════════════════════════════════════════

| Criterion                    | Points |

|------------------------------|--------|

| White Label mechanism        | 25     |

| Landing page quality         | 20     |

| Aesthetics / creativity      | 20     |

| UX \& Responsive              | 10     |

| Clean Code                   | 10     |

| AI application               | 10     |

| Teamwork                     | 5      |



═══════════════════════════════════════════════════════════════

3\. BANNED TECHNOLOGY (from BTC rules)

═══════════════════════════════════════════════════════════════

\- Frameworks: React, Vue, Angular, Svelte, Next.js

\- UI Kits: Bootstrap, Tailwind UI, DaisyUI, Flowbite, MUI, Ant Design

\- Backend: Node.js, PHP, Python server, SQL, Firebase Realtime,

&#x20; Supabase Realtime, any database

\- Build tools: Vite, Webpack, Sass, TypeScript

\- Translation APIs: Google Translate API, DeepL API



═══════════════════════════════════════════════════════════════

4\. ALLOWED LIBRARIES

═══════════════════════════════════════════════════════════════

\- GSAP 3.12.5 (Standard "No Charge" license)

\- Three.js 0.160.0 (MIT)

\- Inline SVG icons (no library)

\- Google Fonts, Fontshare fonts

\- Vanilla HTML/CSS/JS only



═══════════════════════════════════════════════════════════════

5\. CURRENT PROJECT STATE

═══════════════════════════════════════════════════════════════

Path: C:\\Users\\banhv\\Downloads\\dtr-white-label\\dtr-white-label\\



Files present:

\- index.html                 (the deepseek HTML — 2500 lines monolithic)

\- manager.html               (older version — to be replaced)

\- 4 rule files (PDF/DOCX)

\- data/ (may not exist yet)



Issues in current index.html:

\- window.I18N hardcoded (5 languages including English)

\- All images have hardcoded src="" URLs

\- Emoji used as UI icons (🛫 ✈️ 📦 🇻🇳 🇨🇳 🇯🇵 🇰🇷)

\- 6 floating product cards (should be 3)

\- Cursor uses mix-blend-mode:difference

\- Fake cart badge (increments but doesn't save)

\- Pink orb (.orb-2) with no purpose

\- Empty <script> blocks

\- No data-section, no data-media attributes

\- No core.js, no JSON data files

\- No docs folder



═══════════════════════════════════════════════════════════════

6\. TARGET STRUCTURE (create these)

═══════════════════════════════════════════════════════════════

dtr-white-label/

├── index.html                (refactored — same visuals)

├── core.js                   (NEW — white label core)

├── manager.html              (NEW — full CMS)

├── README.md                 (NEW)

├── AI\_DECLARATION.md         (NEW)

├── QA\_PREP.txt               (NEW — study guide for oral exam)

├── docs/

│   ├── ARCHITECTURE.md       (NEW)

│   ├── ALGORITHMS.md         (NEW)

│   └── DECISIONS.md          (NEW)

└── data/

&#x20;   ├── brands.json           (NEW)

&#x20;   ├── brand-1/              (DTR—Mart — lime #c5ff3d)

&#x20;   │   ├── meta.json

&#x20;   │   ├── vi.json

&#x20;   │   ├── ja.json

&#x20;   │   ├── ko.json

&#x20;   │   ├── zh.json

&#x20;   │   ├── shipments.json

&#x20;   │   └── live-stats.json

&#x20;   ├── brand-2/              (NovaCargo — cyan #4fd1ff)

&#x20;   │   └── (same 7 files)

&#x20;   ├── brand-3/              (Sakura Trade — pink #ff9bb8)

&#x20;   │   └── (same 7 files)

&#x20;   └── \_defaults/            (backup copies)

&#x20;       ├── brand-1/

&#x20;       ├── brand-2/

&#x20;       └── brand-3/



═══════════════════════════════════════════════════════════════

7\. DATA SCHEMA

═══════════════════════════════════════════════════════════════



\### meta.json structure:

{

&#x20; "theme": {

&#x20;   "--lime": "#c5ff3d",

&#x20;   "--lime-rgb": "197,255,61",

&#x20;   "--cream": "#fff9cb",

&#x20;   "--pink": "#ffb0c4",

&#x20;   "--bg": "#0b0d12",

&#x20;   "--bg-2": "#11141b"

&#x20; },

&#x20; "sections": {

&#x20;   "hero": true,

&#x20;   "marquee": true,

&#x20;   "brand": true,

&#x20;   "journey": true,

&#x20;   "features": true,

&#x20;   "cta": true,

&#x20;   "globe": true,

&#x20;   "skywatch": true,

&#x20;   "partner": true

&#x20; },

&#x20; "hiddenMedia": \[],

&#x20; "links": {

&#x20;   "partnerLearnMore": "",

&#x20;   "globeLearnMore": ""

&#x20; },

&#x20; "media": {

&#x20;   "favicon": "URL",

&#x20;   "logo": "URL",

&#x20;   "loader": "URL",

&#x20;   "dashboard": "URL",

&#x20;   "product1": "URL",

&#x20;   "product2": "URL",

&#x20;   "product3": "URL",

&#x20;   "product4": "URL",

&#x20;   "product5": "URL",

&#x20;   "product6": "URL"

&#x20; }

}



\### <lang>.json structure (vi.json, ja.json, ko.json, zh.json):

Flat key-value pairs using dot notation. NO English.

Examples:

{

&#x20; "loader.text": "Đang tải",

&#x20; "brand.name": "DTR—Mart",

&#x20; "brand.tag": "Digital Tech Resolution",

&#x20; "seo.title": "...",

&#x20; "seo.description": "...",

&#x20; "nav.platform": "Nền tảng",

&#x20; "nav.journey": "Hành trình",

&#x20; ...

}



\### shipments.json structure:

{

&#x20; "shipments": \[

&#x20;   {

&#x20;     "id": "DTR-TRL-9821-VN",

&#x20;     "status": "in\_transit",

&#x20;     "progress": 62,

&#x20;     "origin": { "code": "HAN", "city": "Hà Nội", "country": "VN" },

&#x20;     "destination": { "code": "SIN", "city": "Singapore", "country": "SG" },

&#x20;     "eta": "2026-10-10T14:30:00Z",

&#x20;     "fleetKey": "skyfreight",

&#x20;     "cargoKey": "electronics",

&#x20;     "cargoWeight": "2.4t",

&#x20;     "events": \[

&#x20;       { "type": "departed", "at": "2026-10-08T08:15:00Z", "locationKey": "HAN", "noteKey": "loaded\_ontime" }

&#x20;     ]

&#x20;   }

&#x20; ]

}



\### live-stats.json structure:

{

&#x20; "baseUsers": 12847,

&#x20; "baseTxn": 2431,

&#x20; "baseCountries": 47,

&#x20; "businessHoursBoost": 1.35,

&#x20; "peakHourUTC": 14

}



\### brands.json structure:

{

&#x20; "default": "brand-1",

&#x20; "brands": \[

&#x20;   { "id": "brand-1", "label": "DTR—Mart", "path": "data/brand-1" },

&#x20;   { "id": "brand-2", "label": "NovaCargo", "path": "data/brand-2" },

&#x20;   { "id": "brand-3", "label": "Sakura Trade", "path": "data/brand-3" }

&#x20; ]

}



═══════════════════════════════════════════════════════════════

8\. NEW I18N KEYS TO ADD (not in original HTML)

═══════════════════════════════════════════════════════════════

track.liveBtn, track.liveDesc

ship.fleet.skyfreight, ship.cargo.electronics, ship.cargo.pharma

ship.airport.HAN, ship.airport.SIN, ship.airport.NRT

ship.region.SCS, ship.region.SEA\_ECO, ship.region.GOT, ship.region.PAC\_ECO

ship.note.loaded\_ontime, ship.note.fl380\_normal, ship.note.eco\_route\_42,

ship.note.approach\_sin, ship.note.temp\_verified, ship.note.eco\_route\_pac,

ship.note.docs\_verified



═══════════════════════════════════════════════════════════════

9\. core.js RESPONSIBILITIES

═══════════════════════════════════════════════════════════════

\- LANGS = \['vi', 'ja', 'ko', 'zh']

\- fetchJSON(path) with cache:'no-cache'

\- loadDict(base, lang): fetch vi.json first, then merge lang.json

&#x20; on top (fallback to vi for missing/empty keys)

\- applyMeta(meta):

&#x20; \* Set CSS custom properties from meta.theme

&#x20; \* Hide sections where meta.sections\[key] === false

&#x20;   Also hide nav links / FAB items / mobile-nav links that point

&#x20;   to that section's id

&#x20; \* Set img.src from meta.media\[img.dataset.media]

&#x20; \* Hide images in meta.hiddenMedia (display:none, also hide parent

&#x20;   .tech-icon element if applicable)

&#x20; \* Attach meta.links.partnerLearnMore to #partner .btn-ghost

&#x20;   using window.open

&#x20; \* Set meta.links.globeLearnMore as href of .globe-learn-more

\- applyDict(dict, lang): handle data-i18n (textContent),

&#x20; data-i18n-html (innerHTML), data-i18n-placeholder, data-i18n-aria

\- window.applyLanguage(lang): switch without reload,

&#x20; history.replaceState, dispatch 'dtr:lang' event

\- window.DTR = { brand, meta, ready }

\- Auto-boot: read ?brand=\&lang=, load brands.json, find brand,

&#x20; load meta + dict, apply all

\- Error banner on fetch fail (fixed position, red)



═══════════════════════════════════════════════════════════════

10\. INDEX.HTML — SPECIFIC PATCHES

═══════════════════════════════════════════════════════════════

DO NOT rewrite. Only PATCH these specific sections.



1\. Remove <script>window.I18N={...}</script> block entirely

2\. Remove <script>window.applyLanguage=function...}</script> block

3\. Remove trailing <script>(function(){boot...})()</script> block

4\. Add <script src="core.js"></script> in <head> BEFORE importmap

5\. Add data-section="hero|marquee|brand|journey|features|cta|

&#x20;  globe|skywatch|partner" to the 9 <section> tags

6\. Add data-media attributes and REMOVE src="" from:

&#x20;  - .loader-logo → data-media="loader"

&#x20;  - nav .logo-img → data-media="logo"

&#x20;  - hero .btn-logo → data-media="logo"

&#x20;  - .dashboard-screen → data-media="dashboard"

&#x20;  - .tech-icon ti-1 → data-media="product1"

&#x20;  - .tech-icon ti-3 → data-media="product3"

&#x20;  - .tech-icon ti-5 → data-media="product5"

&#x20;  - DELETE .tech-icon ti-2, ti-4, ti-6 (HTML + CSS rules)

&#x20;  - cta .btn-logo → data-media="logo"

&#x20;  - .partner-logo → data-media="logo"

&#x20;  - partner .btn-logo → data-media="logo"

&#x20;  - footer .brand-lock img → data-media="logo"

7\. favicon: <link rel="icon" data-media="favicon" href="data:,">

8\. fab-lang buttons: remove emoji flags 🇻🇳🇨🇳🇯🇵🇰🇷

&#x20;  → replace text with "VI", "ZH", "JA", "KO" only

9\. Remove fake cart: nav-btn-cart, nav-cart-badge, mobileCartBtn,

&#x20;  cartBadge, cartBadgeMobile elements + initCartBadges() function

10\. Cursor CSS: remove mix-blend-mode:difference. Replace:

&#x20;   .cursor{width:2px;height:24px;background:var(--fg);border:none;

&#x20;           border-radius:0;mix-blend-mode:normal;

&#x20;           transition:height .3s var(--ease-out),

&#x20;                      background .3s}

&#x20;   .cursor-dot{display:none}

&#x20;   .cursor.hover{width:2px;height:32px;background:var(--lime);

&#x20;                 border:none}

11\. Remove .orb-2 (both HTML div and CSS rule)

12\. Remove empty <script></script> after "LOGISTICS: SkyWatch 

&#x20;   tracking" comment

13\. Replace skywatch section HTML with simple tracker:

&#x20;   <section class="skywatch-section" id="skywatch" data-section="skywatch">

&#x20;     <div class="skywatch-header reveal">

&#x20;       <h2 data-i18n-html="skywatch.title">...</h2>

&#x20;       <p data-i18n="skywatch.subtitle">...</p>

&#x20;     </div>

&#x20;     <div class="track-search reveal">

&#x20;       <input type="text" id="trackInput" autocomplete="off"

&#x20;              spellcheck="false" data-i18n-placeholder="skywatch.placeholder">

&#x20;       <button id="trackBtn" type="button" data-i18n="skywatch.btn">...</button>

&#x20;     </div>

&#x20;     <div id="skywatch-container"></div>

&#x20;     <a href="track-live.html" class="track-live-cta" target="\_blank">

&#x20;       <strong data-i18n="track.liveBtn">Xem demo theo dõi trực tiếp</strong>

&#x20;       <em data-i18n="track.liveDesc">Bản xem trước</em>

&#x20;     </a>

&#x20;   </section>

14\. Add new JS block (before closing body) for tracker:

&#x20;   - Fetch data/<brand>/shipments.json

&#x20;   - Render shipment card with SVG stroke icons (NO emoji)

&#x20;   - SVG icons needed: plane, ship, truck, box, package, check,

&#x20;     location, clock, search

&#x20;   - Re-render on 'dtr:lang' event

&#x20;   - Empty state: SVG search + i18n message

&#x20;   - No-result state: SVG + query + i18n hint

15\. Patch initLiveTraffic() function:

&#x20;   - Fetch live-stats.json

&#x20;   - Time multiplier based on peak hour UTC

&#x20;   - Soft-bounce drift toward base \* multiplier

&#x20;   - Save to localStorage by day (refresh doesn't reset)

&#x20;   - Format number per language locale



═══════════════════════════════════════════════════════════════

11\. manager.html SPEC

═══════════════════════════════════════════════════════════════

Layout: 260px sidebar (left) + main content (right) using CSS grid.



SIDEBAR:

\- Brand picker dropdown at top

\- Nav groups:

&#x20; \* "Cửa hàng": Nền tảng mua sắm, Sản phẩm, Đơn hàng, Khách hàng

&#x20;   (all with "Soon" badge, not clickable)

&#x20; \* "Giao diện": Landing Page (ACTIVE), Theme \& Màu sắc (Soon),

&#x20;   Trang phụ (Soon)

&#x20; \* "Hệ thống": Phân tích (Soon), Cài đặt (Soon)

\- Footer buttons:

&#x20; \* 📂 Chọn thư mục dự án

&#x20; \* ⇄ Hoán đổi 2 brand

&#x20; \* ↺ Khôi phục nguyên bản



TOPBAR:

\- Title: "Landing Page" + subtitle

\- Actions: Xem trước, Tải lại, Khôi phục brand này, Lưu thay đổi



TABS (13): General, Media, Hero, Marquee, Brand, Journey,

Features, CTA, Globe, SkyWatch, Partner, Footer, Sections



TAB CONTENT:

\- General: brand.name, brand.tag, seo.title, seo.description,

&#x20; loader.text, nav.\* (5), mnav.\* (5), fab.\* (11)

\- Media: favicon, logo, loader (no toggle) + dashboard (toggle)

&#x20; + product1-6 (toggle) — all as URL inputs with thumbnails

\- Hero: hero.live, hero.countries, hero.partners, hero.title.1-4,

&#x20; hero.desc, hero.cta

\- Marquee: marquee.1-6

\- Brand: brand.01.word/desc, brand.02.word/desc, brand.03.word/desc

\- Journey: journey.tag/title/sub + tl.2018/2020/2022/2024/2026

&#x20; (each with tag/title/desc)

\- Features: features.tag/title/sub + features.f1-6 (title/desc)

\- CTA: cta.title/sub/btn1/btn2

\- Globe: globe.title, globe.stat.\* (4), live.\* (3) + link field

&#x20; for globeLearnMore

\- SkyWatch: skywatch.\* (7), ship.\* (6 statuses) + new ship.\* keys

\- Partner: partner.\* (6) + link field for partnerLearnMore

\- Footer: footer.\* (all — desc, 4 col titles, 15 links, news desc,

&#x20; news placeholder, news btn, copy, 4 legal, status badge)

\- Sections: 9 toggle switches



FEATURES:

\- File System Access API for save

\- Fallback: download JSON files if browser unsupported

\- 4-lang input grid (VI/KO/JA/ZH) for all i18n fields

\- URL inputs for media with live thumbnail preview

\- Toggle switches (green when on)

\- Link fields (URL input)

\- Toast notifications (success/warn/error)

\- Dirty state warning beforeunload

\- Restore reads from data/\_defaults/<brand>/

\- Swap 2 brands via prompt() for pair selection

\- Restore all brands vs restore current brand (2 buttons)



═══════════════════════════════════════════════════════════════

12\. DESIGN PRESERVATION RULES

═══════════════════════════════════════════════════════════════

DO NOT CHANGE:

\- Any CSS class name, selector, or property value

&#x20; (EXCEPT cursor mix-blend-mode + remove .orb-2)

\- HTML structure (only ADD data-\* attributes)

\- Layout, spacing, typography, colors, fonts

\- Three.js globe code (keep intact)

\- GSAP animations

\- Particles canvas, marquee, timeline, features grid

\- Loader structure, FAB panel, nav, mobile nav



DO:

\- Keep existing \[HUMAN] / \[AI-ASSISTED] comments

\- Add \[HUMAN] tag for requirements

\- Add \[AI-ASSISTED: Claude] tag for new code

\- Use SVG stroke icons (viewBox="0 0 24 24", fill="none",

&#x20; stroke="currentColor", stroke-width="1.6",

&#x20; stroke-linecap="round", stroke-linejoin="round")

\- Preserve ALL existing behavior



═══════════════════════════════════════════════════════════════

13\. AI DECLARATION RULES

═══════════════════════════════════════════════════════════════

Every code section must be tagged:

\- \[HUMAN] — requirement or decision by human

\- \[AI-ASSISTED: Claude] — code written by Claude



Git commits use Conventional Commits format:

\- feat(AI/scope): description

\- refactor(AI/scope): description

\- fix(AI/scope): description

\- docs(scope): description



Suggested commit sequence:

1\. refactor(AI/core): migrate i18n from hardcoded to core.js + JSON

2\. feat(AI/manager): add white-label CMS with 4-lang inputs

3\. feat(AI/track): simplify landing tracking with SVG icons

4\. feat(AI/live-stats): add client-side simulation

5\. docs: add README, AI declaration, architecture docs



═══════════════════════════════════════════════════════════════

14\. QA\_PREP.txt FORMAT (STUDY GUIDE FOR ORAL EXAM)

═══════════════════════════════════════════════════════════════

Plain text file (not markdown). Sections:



═══ PHẦN 1: GIỚI THIỆU DỰ ÁN (30 giây) ═══

\- Tên đội, doanh nghiệp giả tưởng, sản phẩm

\- Tagline 1 câu



═══ PHẦN 2: DEMO FLOW 5 PHÚT ═══

0:00-0:30 — Giới thiệu brand DTR—Mart

0:30-1:00 — Đổi URL ?brand=brand-2 → NovaCargo

1:00-1:30 — Đổi ?lang=ja → tiếng Nhật

1:30-3:00 — Mở manager.html → sửa text → save → refresh

3:00-4:00 — Mở docs/ALGORITHMS.md → chỉ vào thuật toán

4:00-5:00 — Tóm tắt điểm mạnh



═══ PHẦN 3: 25 CÂU HỎI BGK + TRẢ LỜI (≤100 từ/câu) ═══

1\. White Label hoạt động thế nào?

2\. Đổi brand không sửa code — chứng minh?

3\. Tại sao không dùng React/Vue?

4\. Tại sao không có backend?

5\. Số liệu users online lấy từ đâu?

6\. Tại sao không dùng Google Translate API?

7\. AI làm gì trong dự án?

8\. Em tự làm gì?

9\. Files nào là files chính?

10\. Nếu BGK chỉ vào 1 dòng code bất kỳ — em giải thích?

11\. Tại sao dùng 4 ngôn ngữ không phải 5?

12\. Tại sao bỏ tiếng Anh?

13\. Manager hoạt động ở đâu?

14\. Vercel deploy thế nào?

15\. Fallback i18n là gì?

16\. Nếu thiếu 1 key trong ja.json thì sao?

17\. \_defaults/ dùng để làm gì?

18\. Nút "Khôi phục" trong manager làm gì?

19\. Em học được gì từ cuộc thi?

20\. Điểm mạnh/yếu của dự án?

21\. Nếu có thêm 1 tuần, em làm gì?

22\. Tại sao dùng JSON không dùng database?

23\. Section toggle hoạt động thế nào?

24\. Tại sao tách tracking thành 2 tầng?

25\. Code này khác gì AI-generated?



═══ PHẦN 4: NHỮNG ĐIỀU KHÔNG NÊN NÓI ═══

❌ "Em copy trên mạng"

❌ "AI viết hết"

❌ "Em không hiểu đoạn này"

❌ "Em không test được"

❌ "Em quên rồi"



═══ PHẦN 5: NHỮNG ĐIỀU NÊN NÓI ═══

✅ "Dạ em xin phép mở docs để giải thích chi tiết"

✅ "Ý tưởng này em tự nghĩ, AI chỉ hỗ trợ code"

✅ "Em biết dự án còn X điểm yếu — đó là roadmap"

✅ "Đây là thuật toán em tâm đắc nhất — em xin demo"

✅ "Dạ em hiểu rõ đoạn code này, BGK hỏi thêm không ạ?"



═══ PHẦN 6: FILES QUAN TRỌNG CẦN NHỚ ═══

\- core.js — lõi white label

\- data/<brand>/<lang>.json — nội dung

\- data/<brand>/meta.json — theme + sections + media

\- manager.html — CMS local

\- docs/ALGORITHMS.md — thuật toán

\- docs/DECISIONS.md — lý do thiết kế

\- docs/ARCHITECTURE.md — kiến trúc



═══════════════════════════════════════════════════════════════

15\. EXECUTION ORDER

═══════════════════════════════════════════════════════════════

1\. core.js

2\. data/brands.json

3\. data/brand-1/meta.json

4\. data/brand-1/vi.json

5\. data/brand-1/ja.json

6\. data/brand-1/ko.json

7\. data/brand-1/zh.json

8\. data/brand-1/shipments.json

9\. data/brand-1/live-stats.json

10\. data/brand-2/\* (7 files — NovaCargo)

11\. data/brand-3/\* (7 files — Sakura Trade)

12\. data/\_defaults/brand-1/\* (copy)

13\. data/\_defaults/brand-2/\* (copy)

14\. data/\_defaults/brand-3/\* (copy)

15\. index.html (patched per §10)

16\. manager.html (per §11)

17\. README.md

18\. AI\_DECLARATION.md

19\. docs/ARCHITECTURE.md

20\. docs/ALGORITHMS.md

21\. docs/DECISIONS.md

22\. QA\_PREP.txt



Total: 22 files (some are multi-file folders)



═══════════════════════════════════════════════════════════════

16\. OUTPUT RULES

═══════════════════════════════════════════════════════════════

\- No preamble, no "I will now..."

\- No restating instructions

\- Files: write to disk directly, confirm "✓ <path>" only

\- Do NOT paste file content in chat — only confirmations

\- Tables for audit/plan output

\- If unsure about a decision, ASK — do not guess

\- Keep responses concise (< 200 words unless file content)

\- No "I hope this helps" or filler phrases

\- Stop between sessions only when told



═══════════════════════════════════════════════════════════════

END OF CONTEXT

═══════════════════════════════════════════════════════════════

