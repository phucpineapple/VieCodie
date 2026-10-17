# DTR-Market — Câu chuyện của một dự án ba người

> **Web Design 2026 · MPC Club – Trường Đại học Mở TP.HCM**
> Nhóm: **Phúc** (Hệ thống thông tin) · **Hiếu** (Khoa học máy tính) · **Đạt** (Ngôn ngữ Anh)
>
> **Lưu ý về tài liệu này:** Phần 1–2 (chức năng, kiến trúc) được đọc trực tiếp từ mã nguồn. Phần 3–5 (quá trình làm việc, phân vai từng người, cảm xúc) là **suy luận và tưởng tượng** dựa trên dấu vết trong code, tài liệu và đặc thù ngành học của từng người. Các bạn hãy chỉnh lại những chỗ không đúng với thực tế.

---

## 1. DTR-Market là gì?

**DTR** = *Digital Tech Resolution*. DTR-Market là một website thương mại điện tử **thuần HTML/CSS/JS**, chạy hoàn toàn trên trình duyệt, **không backend, không framework UI, không bước build**. Dữ liệu nằm trong file JSON và `localStorage`.

Tagline: *Phim rạp · Công nghiệp · Điện tử · Kĩ thuật số*, tức bốn nhóm hàng chính:

| Nhóm | Ví dụ trong dữ liệu |
|---|---|
| Phim rạp | Đặt vé theo vị trí, sơ đồ ghế, combo bắp nước |
| Công nghiệp | Cánh tay robot MechaArm X2 |
| Điện tử | Laptop DTR-Book Pro, điện thoại AeroPhone Z1, tai nghe AetherPods Pro |
| Kĩ thuật số | Game NeonQuest 2088, Gift Card (ZenoPay, AstroCard, CyberPlay…) |

Điểm đặc biệt là **kiến trúc "White Label"**: cùng một bộ mã nguồn có thể đổi thương hiệu (màu, font, logo, chữ, banner, sản phẩm) chỉ bằng cách sửa dữ liệu, không sửa code. Dự án có hẳn 3 thương hiệu mẫu: **DTR—Mart**, **NovaCargo** và **Sakura Trade**.

---

## 2. Danh sách chức năng

### 2.1 Cửa hàng (Marketplace)
- **Trang chủ** (`marketplace.html`): hero banner trượt, danh mục lĩnh vực, sản phẩm ưu đãi, sản phẩm bán chạy. Thứ tự các khối có thể sắp xếp lại (`applyHomeOrder`).
- **Hero banner render động từ JSON** (`renderHeroBanners`), kèm chấm điều hướng. Không còn hardcode trong HTML.
- **Danh mục** (`category.html`) và **chi tiết sản phẩm** (`detail_product_hero.html`), có **xem 3D bằng `<model-viewer>`**.
- **Thẻ sản phẩm dùng chung** (`buildProductCardHtml`), cùng bộ công cụ lọc/sắp xếp catalog (`mountCatalogTools`).
- **Tìm kiếm toàn site** (`site-search.js`) có **lưu lịch sử tìm kiếm** (`dtr_search_history`).
- **Yêu thích (Wishlist)** và **So sánh sản phẩm** dạng ngăn kéo (`openWishlist`, `openComparison`).
- **Giỏ hàng** dạng drawer: thêm/bớt/xóa, tăng giảm số lượng, huy hiệu số lượng trên header.
- **Trang Ưu đãi** (`deals.html`): đếm ngược theo giờ, giảm giá chung theo sự kiện (ví dụ *Đại Lễ Cyber Sale 10/10*) và giảm giá theo thương hiệu. Có thương hiệu tài trợ (`isSponsored`) và ưu đãi kết thúc sớm.
- **Gift Card** có giao diện thẻ riêng theo từng thương hiệu (`renderGiftcards`).

### 2.2 Đặt vé phim
- **Chọn vị trí theo cấp**: Quốc gia → Tỉnh/Thành → Quận → Đường (`cinema.html`), nhớ lại lựa chọn lần trước.
- **Chi tiết đặt vé** (`detail_cinema.html`): **sơ đồ ghế** (ghế đã có người ngồi hiển thị khác), chọn **combo bắp nước**, tính tiền.

### 2.3 Thanh toán (Checkout)
- **5 phương thức**: QR, thẻ ngân hàng, Google Pay, chuyển khoản, **tiền mã hóa (quy đổi USDT)**.
- **Thẻ 3D lật mặt** xem trước số thẻ, tên, hạn dùng, CVV.
- **Kiểm tra thẻ thật sự**: thuật toán **Luhn**, kiểm tra ngày hết hạn, CVV 3–4 số, tự định dạng số thẻ.
- **Mã giảm giá** (voucher) + **VAT**, đọc từ cấu hình (`DTRVIP10`, `DTR50`).
- **Biên lai**: hiển thị sau thanh toán, tải về, sao chép mã.
- Thanh toán là **demo** (`paymentStatus: 'demo'`), nói rõ trong dữ liệu.

### 2.4 Đơn hàng và theo dõi
- Thanh toán xong, hệ thống **tạo đơn** (`orders.js`) với **mã đơn** `DTR-ORD-…` và **mã tracking** `DTR-TRK-1234-AB`.
- **5 trạng thái**: Chờ xử lý → Đã xác nhận → Đang giao → Đã giao / Đã hủy, mỗi trạng thái một màu, có **lịch sử trạng thái**.
- Dữ liệu đơn được **kiểm tra chặt** khi tạo (giá âm, số lượng không nguyên, thiếu id đều bị từ chối).

### 2.5 Tài khoản và Customer Portal
- **Đăng ký / đăng nhập** (`auth.js`, `login.js`): mật khẩu **băm** (không lưu thô), phiên đăng nhập có **ký chữ ký** và **"ghi nhớ đăng nhập"** kèm thời hạn.
- **Chỉ chặn các trang cần bảo vệ** (`checkout`, `services`, `manager`). Khách vẫn **duyệt web tự do**.
- **Customer Portal** (`services.html`): thông tin cá nhân, đổi mật khẩu, quản lý phiên, danh mục yêu thích, **tra cứu bằng mã tracking** (có timeline), **danh sách đơn của tôi**, kênh hỗ trợ (chat, email, hotline) và FAQ.

### 2.6 Trang quản trị (Admin / Manager)
- **`manager.html` (gốc)**: cấu hình thời gian ưu đãi (sự kiện chung, theo thương hiệu, kết thúc sớm), màu sắc và hiệu ứng giao diện, **quản lý Hero Banner 4 ngôn ngữ**, banner theo thương hiệu, **quản lý phim rạp 4 ngôn ngữ**, có bản lưu, khôi phục, xuất JSON.
- **Tab Quản lý đơn hàng**: xem đơn, đổi trạng thái, ghi chú của admin, hiển thị lại cho khách ở trang tra cứu.
- **`about/manager.html` (CMS lớn, 13 tab)**: sửa nội dung 4 ngôn ngữ, ảnh/logo, bật tắt từng section, đổi thương hiệu, ghi file trực tiếp bằng **File System Access API** (trình duyệt không hỗ trợ thì tải file về), **Restore** từ bản gốc `_defaults/`.
- **`market-admin.js`**: quản lý sản phẩm (lọc, chọn nhiều, sửa, khuyến mãi), có **tự lưu nháp** (`dtr_manager_catalog_draft`).

### 2.7 White Label và đa ngôn ngữ
- **Đồng bộ thương hiệu** từ Admin sang mọi trang qua `localStorage` (`dtr_brand_meta`): toàn bộ biến màu CSS, font, logo ở header và footer (`applyBranding`).
- **Footer dùng chung** được chèn tự động vào mọi trang (`injectSharedFooter`).
- **4 ngôn ngữ**: Việt, Anh, Nhật, Trung. Chuyển ngôn ngữ **không cần tải lại trang**, key nào thiếu thì **lấy tiếng Việt làm nền**, nên giao diện không bao giờ trống.
- **`sanitizeRealBrands`**: tự thay tên thương hiệu thật bằng tên hư cấu để **tránh vi phạm nhãn hiệu** (NovaPhone → AeroPhone Z1, CyberQuest 2077 → NeonQuest 2088…).

### 2.8 Landing page "DTR—Mart" (`index.html` + `about/`)
- Trang giới thiệu nhiều section: hero, marquee, thương hiệu, hành trình, tính năng, mạng lưới địa cầu (globe), tra cứu, FAQ, đối tác, CTA. Dùng **GSAP + ScrollTrigger**.
- **Bộ đếm "trực tiếp" mô phỏng**: số người dùng, giao dịch, quốc gia, tính theo giờ cao điểm UTC, có nhiễu ngẫu nhiên và lưu theo ngày. **Tài liệu ghi rõ đây là mô phỏng**, không giả vờ là dữ liệu thật.
- **Tra cứu vận đơn** ngay trên landing, escape HTML đầu vào.
- **SkyWatch** (`about/modules/skywatch.html`): demo theo dõi vận chuyển **3D (Three.js)** trên địa cầu, mở ở tab riêng.

### 2.9 Tài liệu cho ban giám khảo
`ARCHITECTURE.md`, `DECISIONS.md` (9 quyết định kèm lý do và cái giá phải trả), `ALGORITHMS.md` (4 thuật toán giải thích được trong 1 phút), cùng bản khai báo sử dụng AI và bộ câu hỏi phản biện.

---

## 3. Ba con người, ba góc nhìn

Nhìn vào cách dự án được tổ chức, ta có thể hình dung vai trò của từng người như sau.

### 🟢 Phúc (Hệ thống thông tin) — "Người vẽ bản đồ"
Sinh viên HTTT quen nghĩ theo **dữ liệu, quy trình và hệ thống**. Dấu ấn rõ nhất:
- **Tư duy white-label và tách dữ liệu khỏi giao diện**: `brands.json`, `meta.json`, `products.json`, thư mục `_defaults/` để khôi phục.
- **Thiết kế luồng nghiệp vụ**: giỏ hàng → thanh toán → tạo đơn → mã tracking → admin đổi trạng thái → khách tra cứu. Đây là một vòng đời đơn hàng đầy đủ.
- **Hệ thống quản trị (CMS/Manager)**: chỗ để người không biết code vẫn điều hành được cả cửa hàng.
- **Định hướng và điều phối**: viết các yêu cầu theo kiểu "tiêu chí thành công", chia task, đọc luật thi, giữ ràng buộc *không backend, không framework, giải thích được khi bảo vệ*.
- Làm việc với AI như một công cụ, có file luật thi và quy tắc làm việc riêng, rồi tự kiểm chứng kết quả.

### 🔵 Hiếu (Khoa học máy tính) — "Người xây động cơ"
Sinh viên KHMT thích **thuật toán, độ đúng và hiệu năng**. Những phần nặng kỹ thuật là chỗ của Hiếu:
- **Xác thực**: băm mật khẩu, chữ ký phiên, hạn phiên, guard chặn trang.
- **Kiểm tra thanh toán**: thuật toán **Luhn**, kiểm tra hạn thẻ, thẻ 3D lật, quy đổi USDT, tính tổng/VAT/giảm giá chuẩn.
- **Xử lý dữ liệu an toàn**: lập trình phòng thủ (`try/catch` quanh `localStorage` và `fetch`), kiểm tra đầu vào khi tạo đơn, chống chèn HTML.
- **Phần đồ họa nặng**: địa cầu 3D, SkyWatch bằng Three.js, mô hình 3D sản phẩm, thuật toán bộ đếm mô phỏng.
- **Công cụ tìm kiếm, lọc, so sánh, sắp xếp** và cơ chế đồng bộ nhiều tab qua sự kiện `storage`.
- Chịu trách nhiệm cho câu hỏi khó nhất trong buổi bảo vệ: *"Em giải thích đoạn code này chạy thế nào?"*

### 🟡 Đạt (Ngôn ngữ Anh) — "Người kể chuyện và là cầu nối"
Đạt không viết code nhiều nhưng **quyết định cảm nhận của người dùng và giám khảo**:
- **Nội dung 4 ngôn ngữ** (Việt, Anh, Nhật, Trung): cấu trúc key `dot.notation`, bản dịch, giọng văn thương hiệu, tên sự kiện, mô tả combo phim, FAQ.
- **Đặt tên thương hiệu và sản phẩm hư cấu**: AeroPhone, NeonQuest, ZenoPay, AstroCard, NovaCargo, Sakura Trade… nghe thật nhưng không đụng nhãn hiệu của ai.
- **Quyết định "thay tiếng Hàn bằng tiếng Anh"** trong `DECISIONS.md` rất hợp lý: nhóm không đủ sức dịch Hàn, và giám khảo quốc tế đọc được tiếng Anh.
- **Tài liệu và phần thuyết trình**: `ARCHITECTURE`, `DECISIONS`, `QA_PREP`, khai báo AI. Đây là phần giám khảo đọc đầu tiên và giữ ấn tượng lâu nhất.
- Kiểm tra **từng câu chữ trên giao diện** (nhãn nút, thông báo lỗi, placeholder), đảm bảo không có chỗ nào trống hay sai nghĩa khi đổi ngôn ngữ.

---

## 4. Hành trình làm việc (tưởng tượng)

**Tuần 0: Khởi động.** Ba người ngồi quán cà phê sau giờ học. Phúc mở đề thi và đọc to luật: *không backend, không React, được dùng GSAP/Three.js, phải white-label, phải bảo vệ code trực tiếp*. Hiếu thở dài vì không có Node hay database để "làm cho ra dáng". Đạt hỏi: *"Vậy mình bán cái gì?"* Cả nhóm chọn bốn nhóm hàng chạm đúng sở thích: phim, công nghiệp, điện tử và đồ số. Tên **DTR** ra đời, đọc là *Digital Tech Resolution*.

**Tuần 1: Dựng khung.** Phúc phác sơ đồ file và quyết định "dữ liệu nằm ở JSON, giao diện chỉ là lớp da". Hiếu dựng khung trang chủ, giỏ hàng, `localStorage`. Đạt bắt đầu viết bộ chữ tiếng Việt cho `vi.json`, đặt luật *"tiếng Việt là bản gốc, ngôn ngữ khác chỉ ghi đè"* cho đỡ rối. Đây là lúc "phiên bản cũ" như `original.html` xuất hiện: bản thử đầu tiên chưa tách dữ liệu.

**Tuần 2: Phình to.** Cửa hàng có thêm phim rạp, ghế ngồi, deal đếm ngược, wishlist, so sánh. Hiếu thức khuya để chỉnh sơ đồ ghế. Phúc thì lo bản quản trị vì "không lẽ sửa JSON bằng tay mỗi lần đổi banner?". Đạt dịch thêm tiếng Anh, Nhật, Trung, và phát hiện nhiều chỗ chữ dài ngắn khác nhau làm vỡ giao diện, nên gửi screenshot cho hai bạn kia sửa.

**Tuần 3: Vỡ lẽ về white-label.** Cả nhóm nhận ra màu, logo, footer vẫn chưa đồng bộ giữa Admin và các trang cửa hàng. Banner thì hardcode trong HTML, trang nào cũng bắt đăng nhập mới xem được. Phúc ngồi liệt kê thành **5 việc then chốt** (đồng bộ thương hiệu, banner động, auth chỉ chặn trang cần thiết, footer dùng chung, đổi tên sản phẩm vi phạm nhãn hiệu) rồi giao cho AI làm theo kiểu "chỉ patch, không viết lại cả file", kèm luật nghiêm ngặt. Hiếu review từng patch vì không tin code mình chưa đọc.

**Tuần 4: Đơn hàng và vòng đời.** Phúc muốn *"thanh toán xong phải ra cái gì đó thật sự"*. Cả nhóm thêm `orders.js`: mã đơn, mã tracking, trạng thái, tab quản lý đơn trong manager và ô tra cứu trong services. Hiếu viết phần kiểm tra thẻ Luhn vì ghét cảnh "ai nhập số gì cũng cho qua". Đạt kiểm tra từng thông báo lỗi, như *"Số thẻ không vượt qua kiểm tra Luhn"*, để chúng vừa rõ ràng vừa không dọa người dùng.

**Tuần 5: Đêm trước chung kết.** Mọi người thức trắng. Phúc nhắc *"code phải giải thích được"*, nên cả nhóm xóa những đoạn quá "ma thuật". Đạt viết `DECISIONS.md`, `ALGORITHMS.md`, `QA_PREP` và tờ khai báo sử dụng AI, đoán trước câu giám khảo sẽ hỏi. Hiếu tập trả lời những câu *"em chọn Luhn thay vì…"*, *"bộ đếm này có phải số thật không?"*. Cả ba thống nhất một nguyên tắc: **cái gì là mô phỏng thì nói thẳng là mô phỏng**.

---

## 5. Ý nghĩa và mục tiêu

### Mục tiêu cuộc thi
1. **Thắng (hoặc vào top) cuộc thi Web Design 2026** bằng một sản phẩm đầy đủ, chạy được, thuyết phục.
2. **Chứng minh làm được nhiều với ít**: không backend, không framework, vẫn có đăng nhập, giỏ hàng, thanh toán, đơn hàng, quản trị, đa ngôn ngữ, 3D.
3. **Đạt tiêu chí White Label**: một bộ code, nhiều thương hiệu, đổi bằng dữ liệu.
4. **Bảo vệ được từng dòng code** trước giám khảo, nên ưu tiên cái đơn giản và giải thích được hơn cái hào nhoáng.

### Ý nghĩa với ba người
| | Điều Phúc, Hiếu, Đạt mang theo |
|---|---|
| **Phúc** | Học cách biến một ý tưởng kinh doanh thành hệ thống có luồng dữ liệu rõ ràng. Quản lý dự án và làm việc với AI một cách có kỷ luật. |
| **Hiếu** | Hiểu rằng thuật toán hay chưa đủ, phải **đúng, an toàn và giải thích được**. Làm việc với đồ họa 3D và bảo mật cơ bản. |
| **Đạt** | Thấy ngôn ngữ không chỉ là "dịch", mà là **một nửa của sản phẩm**: tên gọi, giọng điệu, tài liệu quyết định người ta có tin sản phẩm hay không. |

### Ý nghĩa rộng hơn
- **Liên ngành là sức mạnh**: HTTT hiểu hệ thống, KHMT hiểu kỹ thuật, Ngôn ngữ Anh hiểu con người. Thiếu một người, dự án sẽ lệch.
- **Trung thực về công nghệ**: tài liệu ghi rõ thanh toán là demo, số liệu live là mô phỏng, có khai báo sử dụng AI. Đây là điều giám khảo và cả ngành công nghệ ngày càng coi trọng.
- **Một mô hình tái sử dụng được**: DTR-Market không chỉ là một shop. Đó là **khuôn mẫu** để một cửa hàng nhỏ dựng website riêng của mình chỉ bằng cách đổi dữ liệu.

---

## 6. Điểm mạnh, điểm có thể cải thiện (góc nhìn người xem code)

**Điểm mạnh**
- Phạm vi chức năng rộng so với ràng buộc kỹ thuật.
- Có tài liệu quyết định, thuật toán, kiến trúc, hiếm thấy ở dự án sinh viên.
- Lập trình phòng thủ, xử lý lỗi `localStorage`/`fetch`, escape đầu vào.
- Trung thực về phần mô phỏng.

**Có thể cải thiện sau cuộc thi**
- Trong thư mục còn nhiều file thừa hoặc trùng (`original.html`, `12.html`, `about.html` trùng `index.html`, hai bản `products.json`, `brand-2/data/brand-1/` lồng sai). Nên dọn trước khi nộp.
- `marketplace.js` dài hơn 3.400 dòng, nên tách thành module nhỏ để dễ bảo vệ.
- Mật khẩu băm ở client chỉ phù hợp bản demo. Khi có backend thật cần băm phía máy chủ.
- `about/manager.html` còn một tab ghi *"Tính năng đang phát triển"*.

---

*Tài liệu này mô tả bản mã nguồn nhóm cung cấp. Phần phân vai và dòng thời gian là phỏng đoán có căn cứ, hãy điều chỉnh cho đúng với câu chuyện thật của nhóm.*
