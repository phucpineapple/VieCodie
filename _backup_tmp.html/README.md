# 🌐 DTR White Label — Digital Tech Resolution
> **Landing page đa brand, đa ngôn ngữ (VI · EN · JA · KO · ZH) — Nền tảng thương mại số toàn cầu vận hành bằng dữ liệu & AI.**

![DTR-Mart Banner](https://img.shields.io/badge/Platform-DTR--Mart-c5ff3d?style=for-the-badge&logo=rocket)
![Architecture](https://img.shields.io/badge/Architecture-White_Label_|_No--Backend-blueviolet?style=for-the-badge)
![Coverage](https://img.shields.io/badge/Global-50%2B_Countries-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5_|_GSAP_|_Three.js-orange?style=for-the-badge)

Thuần **HTML/CSS/JS**, **không backend, không DB**. Mọi dữ liệu nội dung, cấu hình brand và ngôn ngữ được quản lý tập trung qua các file JSON trong thư mục `data/`.

---

## 🚀 1. Câu Chuyện Khởi Nguồn: Cảm Hứng Từ NVIDIA & "Cú Vấp" Giá Cạc Đồ Họa

Tất cả bắt đầu vào một đêm mưa bão năm 2018. Lúc đó, team sáng lập gồm 6 kỹ sư (vẫn còn thức ăn mì gói) ngồi xem sự kiện Jensen Huang (CEO NVIDIA) trình làng kiến trúc GPU Turing tại GTC. Nhìn những dải ánh sáng Ray Tracing đổ bóng theo thời gian thực, một ý nghĩ điên rồ lóe lên:

> *"Tại sao Nvidia có thể dùng sức mạnh tính toán để render cả thế giới 3D real-time, mà ngành thương mại điện tử vẫn cứ lẹt đẹt với những cái bảng dữ liệu tĩnh, chậm chạp và nhàm chán?"*

Ngay đêm đó, cả nhóm quyết định nghỉ việc, gom hết tiền tiết kiệm để mua một dàn cạc RTX mới nhất về dựng server thử nghiệm. Nhưng "đời không như là mơ", cơn sốt đào coin bùng nổ, giá GPU tăng gấp 3 lần. Thiếu tiền mua GPU, nhóm đành... tự tay tối ưu hóa thuật toán render và AI định tuyến trên chính những chiếc laptop cùi bắp. Từ đống tro tàn của cơn khát linh kiện phần cứng, **DTR—Mart** ra đời như một lời thách thức: **Mang trải nghiệm siêu máy tính vào hạ tầng thương mại toàn cầu.**

---

## 🔍 2. Bí Mật Về Chữ "D" Trong Thương Hiệu DTR

Rất nhiều người hỏi chúng tôi: *Chữ D trong DTR có phải là Digital không?*
Câu trả lời là **VỪA ĐÚNG VỪA KHÔNG**. Chữ **D** mang 3 tầng ý nghĩa bí mật:

1. **Digital (Kỹ thuật số):** Lớp nghĩa bề nổi — Số hóa toàn diện mọi chuỗi cung ứng từ truyền thống sang thời gian thực.
2. **Dynamic (Động lực học):** Lớp nghĩa kỹ thuật — Hệ thống tự xoay chuyển và định tuyến lại theo thời gian thực giống như cách các luồng nhân CUDA của Nvidia phân tích hạt dữ liệu.
3. **Deep-pockets-no-more (Hư cấu):** Lớp nghĩa "xương máu" — Nhắc nhở team về ngày xưa không có tiền mua cạc đồ họa Nvidia đắt đỏ nên phải dùng trí tuệ để tối ưu code vượt giới hạn phần cứng!

👉 **DTR = Digital Tech Resolution** *(Giải pháp Công nghệ Số Trọn vẹn)*.

---

## 💣 3. Những Khó Khăn "Dở Khóc Dở Cười" Khi Phát Triển

Để dựng nên giao diện Cyberpunk tích hợp Trái Đất 3D real-time và hệ thống đa ngôn ngữ/đa brand không cần backend, team dev đã trải qua những "kiếp nạn" chưa từng có:

* **Trái Đất 3D "Ăn" RAM Như Hạm:** Lần đầu tiên nhét quả địa cầu Three.js kết hợp với bản đồ radar 2D SkyWatch Earth vào web, 9/10 chiếc máy tính thử nghiệm bị tràn RAM và sập trình duyệt. Team đã phải thức 3 đêm liền để "vặt lông" từng mesh Polygon, đưa Uptime lên 99% mà không làm giật lag máy người dùng.
* **Ma Trận Ngôn Ngữ & Multilingual Fallback:** Việc hỗ trợ 5 ngôn ngữ (VI, EN, ZH, JA, KO) khiến file JS biến thành một "mớ bòng bống". Cứ mỗi lần sửa một chữ Tiếng Việt là giao diện Tiếng Nhật lại bị nhảy dòng tràn ra khỏi màn hình. Team phải xây dựng cơ chế Fallback tự động: nếu thiếu key ở ngôn ngữ đích, hệ thống sẽ tự động lấy từ `vi.json` để giao diện không bao giờ bị trắng chữ.
* **Cuộc Chiến Với Con Trỏ Cursor:** Tạo hiệu ứng con trỏ chuột tùy chỉnh `mix-blend-mode: difference` cực ngầu, nhưng khi chuyển sang màn hình cảm ứng điện thoại thì con trỏ đứng im một chỗ che mất nút "Mua Hàng". Hệ quả là team phải cấp tốc viết lại logic phát hiện thiết bị mobile để ẩn Cursor custom.

---

## 📂 4. Cấu Trúc Thư Mục Dự Án

```text
index.html          Landing dùng chung (đọc ?brand=…&lang=…)
core.js             Lõi: nạp JSON, fallback vi, theme, section, media, SEO
manager.html        Công cụ quản lý content — CHỈ chạy cục bộ (Live Server)
modules/skywatch.html SkyWatch Earth (giám sát chuyến bay/đơn hàng real-time), nhúng bằng iframe
data/
  brands.json       Danh sách landing page + brand mặc định
  brand-1/ …        Mỗi brand: vi.json, en.json, ja.json, ko.json, zh.json + meta.json + images/
  _defaults/        Bản gốc để “Khôi phục mặc định” (đừng sửa tay)