# 08 — KPI & Báo cáo

## 1. Bộ chỉ số theo dõi

### YouTube (YouTube Studio → Analytics)
| KPI | Ý nghĩa | Ngưỡng tốt cho ngách nhạc thư giãn |
|---|---|---|
| **CTR thumbnail** | % người thấy thumbnail rồi bấm | 4–10% |
| **Average view duration** | Thời gian xem trung bình | Càng dài càng tốt; video 3h có AVD 15–40 phút là ổn |
| **Watch time (giờ)** | Tổng giờ xem | Mục tiêu 4.000h/12 tháng cho YPP |
| Returning viewers | Người xem quay lại | Tăng đều = thương hiệu đang hình thành |
| Traffic source | Search / Suggested / Browse / Shorts | Ngách này mạnh nhất ở **Suggested + Search** |
| Subs / 1.000 views | Tỷ lệ chuyển đổi đăng ký | ≥ 3–5 |

### Spotify (Spotify for Artists)
| KPI | Ý nghĩa |
|---|---|
| Monthly listeners | Người nghe duy nhất 28 ngày |
| Streams / listener | Mức độ nghe lặp lại |
| Save rate | % người nghe lưu bài — chỉ báo quan trọng cho thuật toán |
| Nguồn nghe | Playlist editorial / algorithmic (Discover Weekly, Radio) / playlist người dùng |

### Sản xuất (nội bộ)
| KPI | Mục tiêu |
|---|---|
| Số bài đạt chuẩn/tuần | 10–15 |
| Tỷ lệ chọn lọc (chọn/nháp) | 15–25% |
| Buffer nội dung | ≥ 2 tuần |
| Đúng lịch đăng | 100% |

## 2. Nhịp báo cáo

| Chu kỳ | Mẫu | Lưu tại | Thời gian |
|---|---|---|---|
| Tuần (thứ 2) | `templates/weekly-report.md` | `reports/YYYY-Www.md` | 30 phút |
| Tháng (ngày 1) | `templates/monthly-review.md` | `reports/YYYY-MM.md` | 1–2 giờ |
| Quý | Đánh giá lại giai đoạn trong `docs/01` + cập nhật `docs/05` | — | Nửa ngày |

## 3. Quy tắc ra quyết định từ dữ liệu

- **Series có AVD & CTR trên trung bình kênh 2 tháng liên tiếp** → tăng tần suất.
- **Series dưới trung bình 2 tháng liên tiếp** → đổi concept hình ảnh/tiêu đề 1 lần; vẫn yếu → dừng.
- **CTR thấp nhưng AVD cao** → vấn đề ở thumbnail/tiêu đề, không phải nhạc.
- **CTR cao nhưng AVD thấp** → nhạc/đoạn đầu không đúng kỳ vọng thumbnail hứa hẹn.
- Thay đổi **một biến mỗi lần** để biết điều gì tạo khác biệt.
