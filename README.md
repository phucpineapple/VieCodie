# DTR-Mart — Digital Tech Resolution

Trang landing thương mại điện tử **cộng đồng 9 ngôn ngữ**, chạy tĩnh (không build, không backend).
Mở trực tiếp bằng trình duyệt là chạy.

## Cách chạy

1. Mở `index.html` bằng Chrome/Edge/Firefox — trang tự chạy trên `file://`.
2. Mở `manager.html` (bảng cấu hình) — nhập nội dung, bấm **Lưu**.
3. Quay lại `index.html` (Ctrl+F5) — nội dung mới áp dụng.
   - PHẢI mở bằng **cùng trình duyệt** vì cấu hình lưu trong `localStorage`.
   - Cần internet: ba.js tải từ CDN (`unpkg.com/three@0.160.0`), chữ Google Fonts.

## Sơ đồ cấu trúc

```
Default Project\
└── Khung Sản Project\          ← dự án chạy thật
    ├── index.html              ← trang chính (26 KB)
    ├── index.html.bak          ← bản single-file gốc (127 KB) — chỉ lưu tham khảo
    ├── manager.html            ← bảng cấu hình: logo, favicon, ảnh intro, chữ...
    ├── README.md               ← file này
    ├── css\                    ← 11 file CSS, tách theo khu vực
    │   ├── 01-nen.css          ← biến màu, body, canvas địa cầu
    │   ├── 02-thanh-dieu-huong.css ← thanh điều hướng, logo góc trái
    │   ├── 03-menu-troi.css    ← menu trượt
    │   ├── 04-man-hinh-chao.css ← splash + hiệu ứng gõ
    │   ├── 05-gioi-thieu.css   ← giới thiệu (ảnh doanh nghiệp)
    │   ├── 06-dia-cau.css      ← vùng địa cầu sticky
    │   ├── 07-hanh-trinh.css   ← hành trình
    │   ├── 08-su-menh.css      ← sứ mệnh
    │   ├── 09-ho-tro-khach-hang.css ← hỗ trợ khách hàng
    │   ├── 10-chan-trang.css   ← chân trang (logo footer)
    │   └── 11-thich-nghi.css   ← responsive
    └── js\
        ├── ngon-ngu\
        │   ├── tu-dien.js      ← từ điển 9 ngôn ngữ (I18N — 44 KB, nạp đầu tiên)
        │   └── dich-thuat.js   ← dịch DOM theo ngôn ngữ đã chọn
        ├── canh-3d\            ← cảnh 3D (three.js, file cổ điển chạy được trên file://)
        │   ├── vu-tru.js       ← sao, hiệu ứng nền
        │   ├── dia-cau.js      ← quả địa cầu, marker quốc gia, tuyến thương mại
        │   ├── tuong-tac.js    ← kéo xoay + tooltip + tiến độ cuộn
        │   └── dieu-phoi.js    ← entry: scene/camera/render, đồng bộ 4 file trên
        ├── apply-config.js     ← đọc cấu hình từ manager.html (sau tu-dien.js)
        ├── man-hinh-chao.js    ← splash gõ chữ "digital tech resolution"
        ├── hien-khi-cuon.js    ← hiện dần section khi cuộn
        ├── chon-ngon-ngu.js    ← chọn ngôn ngữ
        └── menu-troi.js        ← menu trượt
```

## Thứ tự nạp script (quan trọng)

```html
importmap (three CDN)
→ tu-dien.js        (I18N phải có trước)
→ apply-config.js   (ghi đè nội dung từ manager)
→ dich-thuat.js
→ man-hinh-chao.js  (đọc window.DTR.config.typed)
→ hien-khi-cuon.js → chon-ngon-ngu.js → menu-troi.js
→ vu-tru.js → dia-cau.js → tuong-tac.js → dieu-phoi.js (entry cảnh 3D)
```

## Bảng cấu hình manager.html

Cấu hình lưu vào `localStorage` khóa **`dtrmart.config`**, `index.html` tự đọc qua `apply-config.js`:

| Trường | Ảnh hưởng ở index.html |
|---|---|
| Logo thương hiệu | Ảnh thay ô vuông M + chữ "DTR-Mart" ở góc trái **và chân trang** |
| Favicon | Đổi icon tab (để trống = icon M sáng/tối mặc định) |
| Chữ "Mart" | Chữ to màn hình chào + chữ "-Mart" (khi chưa có logo ảnh) |
| Ảnh giới thiệu | Thay ảnh ở mục giới thiệu doanh nghiệp |
| Tiêu đề tab | Đổi title trình duyệt |
| Dòng gõ màn hình chào | Cụm được gõ ra ở splash (mặc định: digital tech resolution) |
| Mô tả giới thiệu | Mô tả trong mục giới thiệu (9 ngôn ngữ) |
| Mô tả chân trang | Đoạn mô tả dưới logo chân trang (9 ngôn ngữ) |

## Tương tác địa cầu 3D

- **Máy tính**: kéo chuột xoay mọi hướng (ngang 360°, dọc nghiêng ±90°), hover marker hiện tên quốc gia.
- **Điện thoại**: chạm **trên quả cầu** → xoay tự do 2 chiều; chạm **vùng trống** xung quanh → cuộn trang.
- Vùng bắt kéo giới hạn `globeProgress 0.15–0.85` (đầu/cuối vùng địa cầu cho cuộn).

## Ghi chú

- `index.html.bak` là bản single-file gốc, KHÔNG dùng lại.
- `Khung Sản Project.zip` — bản đóng gói của thư mục trên.
- Chỉ dùng cho trình duyệt hỗ trợ `localStorage` trên `file://` (Chrome/Edge/Firefox — OK).
