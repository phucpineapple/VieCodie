# Tuyên bố sử dụng AI

Mục đích: minh bạch phần nào do AI hỗ trợ trong dự án này.

## Quy ước chú thích trong code
- `// [HUMAN]` — quyết định/yêu cầu do con người đặt ra (phạm vi, quy tắc, ràng buộc).
- `// [AI-ASSISTED: DeepSeek]` / `// [AI-ASSISTED: Claude]` — phần cài đặt do AI viết; con người cần rà soát.

## Phần có AI tham gia
| Phần | Công cụ | Ghi chú |
|---|---|---|
| Landing gốc (HTML/CSS/JS, bộ từ điển 5 ngôn ngữ ban đầu, tra cứu cũ) | DeepSeek | Tệp `deepseek_html_…html` do chủ dự án cung cấp |
| SkyWatch Earth (mô phỏng chuyến bay/đơn hàng) | Theo tệp do chủ dự án cung cấp | Claude chỉ vá: skin, nhận ngôn ngữ/theme, báo chiều cao |
| `core.js`, `manager.html`, tách từ điển thành JSON, `index.html` mới, README | Claude | Viết theo đặc tả của chủ dự án |
| Nội dung brand-2 (NovaCargo) và brand-3 (Sakura Trade), `seo.*`, `skywatch.subtitle` mới (VI/JA/KO/ZH) | Claude | Bản soạn thảo viết tay bởi AI, **không qua API dịch** |

## Về dịch thuật
- Trong code **không có** lời gọi API dịch tự động; mọi chuỗi nằm sẵn trong JSON.
- Bản dịch JA/KO/ZH do AI soạn (các khoá cũ từ DeepSeek, khoá mới từ Claude) **chưa được người bản ngữ duyệt**. Cần người bản ngữ rà soát trước khi công khai, đặc biệt văn phong trang trọng.

## Việc con người cần làm
- [ ] Đọc lại code, thay các thẻ `[AI-ASSISTED]` bằng `[HUMAN]` ở phần bạn đã tự xem xét/sửa.
- [ ] Nhờ người bản ngữ duyệt bản dịch JA/KO/ZH.
- [ ] Thay nội dung/số liệu demo của brand-2, brand-3 bằng dữ liệu thật.
