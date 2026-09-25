# 01 — Lộ trình & Phân chia giai đoạn

Mỗi giai đoạn có: **Mục tiêu → Đầu việc (checklist) → Sản phẩm bàn giao → Điều kiện chuyển giai đoạn (Exit criteria)**.
Không chuyển giai đoạn khi chưa đạt exit criteria — đây là cách giữ dự án đi đúng hướng.

```
GĐ0 Nền tảng ──► GĐ1 Kho nhạc ──► GĐ2 Ra mắt ──► GĐ3 Tăng trưởng ──► GĐ4 Kiếm tiền ──► GĐ5 Mở rộng
 Tuần 1–2         Tuần 3–6         Tháng 2–3       Tháng 4–6           Tháng 7–9          Tháng 10–12+
```

---

## 🧱 GIAI ĐOẠN 0 — Nền tảng (Tuần 1–2)

**Mục tiêu:** Mọi thứ "hạ tầng" sẵn sàng để sản xuất và phát hành hợp pháp, chuyên nghiệp.

### Checklist
**Thương hiệu**
- [ ] Chốt tên hiển thị: `Healing Box` (kiểm tra trùng tên trên YouTube/Spotify/TikTok/Instagram)
- [ ] Chốt handle thống nhất: `@healingbox.music` / `@healingboxmusic` (chọn cái còn trống ở mọi nền tảng)
- [ ] Logo (hình chiếc hộp mở + nốt nhạc/ánh sáng), bảng màu, font → `brand/`
- [ ] Banner YouTube, avatar, ảnh bìa Spotify, template thumbnail cho từng series
- [ ] Viết "About" kênh (VN + EN) — xem mẫu trong `02-nhan-dien-thuong-hieu.md`

**Tài khoản & hạ tầng**
- [ ] Email riêng cho dự án (vd: healingbox.music@gmail.com), bật 2FA
- [ ] Kênh YouTube dạng **Brand Account** (để sau này thêm người quản lý)
- [ ] Đăng ký gói trả phí công cụ AI nhạc (Suno Pro/Premier hoặc tương đương) — **bắt buộc để có quyền thương mại**
- [ ] Tài khoản distributor (DistroKid / TuneCore / CD Baby / Amuse...) — đọc kỹ chính sách về nhạc AI
- [ ] Spotify for Artists, Apple Music for Artists, YouTube Studio (claim khi bài đầu tiên lên sóng)
- [ ] TikTok, Instagram, Facebook Page (giữ tên, chưa cần đăng nhiều)
- [ ] Google Drive / ổ cứng lưu trữ: backup audio gốc, stems, project file
- [ ] Clone repo này, dùng `catalog/tracks.csv` làm nguồn dữ liệu duy nhất

**Pháp lý**
- [ ] Đọc & lưu bản chụp Điều khoản sử dụng (ToS) của công cụ AI tại thời điểm tạo nhạc → `docs/05-...`
- [ ] Quy ước lưu bằng chứng sáng tác (prompt, lời, file project) cho mọi bài
- [ ] Quyết định: có đăng ký Content ID qua distributor hay không (khuyến nghị: **KHÔNG** ở giai đoạn đầu)

### Sản phẩm bàn giao
Brand kit hoàn chỉnh • Kênh đã setup đẹp • Tài khoản công cụ + distributor • Quy trình lưu trữ.

### Exit criteria
✅ Có thể tạo 1 bài → hậu kỳ → xuất video → upload thử (private) trọn vẹn một vòng.

---

## 🎼 GIAI ĐOẠN 1 — Xây kho nhạc đầu tiên (Tuần 3–6)

**Mục tiêu:** Có "vốn" nội dung đủ để ra mắt và duy trì lịch đăng 6–8 tuần mà không bị đuối.

### Checklist
- [ ] Viết **Series Bible** cho 3 series ưu tiên (mood, BPM, nhạc cụ, key, hình ảnh) → `prompts/`
- [ ] Mỗi tuần tạo 60–100 bản nháp AI → tuyển chọn còn 10–15 bài đạt chuẩn (tỉ lệ chọn ~15–20%)
- [ ] Hậu kỳ mọi bài: cắt đầu/đuôi, sửa lỗi, fade, cân âm lượng về chuẩn (xem `03-quy-trinh-san-xuat.md`)
- [ ] QC theo checklist `templates/qc-checklist.md` — nghe trọn bài trên loa + tai nghe + điện thoại
- [ ] Ghi toàn bộ vào `catalog/tracks.csv` (mỗi bài một mã `HB-xxx`)
- [ ] Dựng **8–10 video mix dài** (1–3h) + 20–30 Shorts/Reels cắt từ các bài hay nhất
- [ ] Chuẩn bị **EP đầu tiên** cho Spotify (5–8 bài cùng series)
- [ ] Soạn sẵn metadata (tiêu đề, mô tả, tags, chapters) cho video đầu

### Sản phẩm bàn giao
40–60 bài hoàn thiện • 8–10 video dài sẵn sàng • 1 EP • 20–30 Shorts.

### Exit criteria
✅ Có tối thiểu **6 tuần nội dung** đã sẵn sàng trong hàng đợi (buffer).

---

## 🚀 GIAI ĐOẠN 2 — Ra mắt (Tháng 2–3)

**Mục tiêu:** Lên sóng đều đặn, có những dữ liệu người xem thật đầu tiên.

### Lịch đăng đề xuất
| Kênh | Tần suất | Ghi chú |
|---|---|---|
| YouTube video dài | **2–3 video/tuần** | Cố định ngày giờ, vd: T3–T5–CN 19:00 |
| YouTube Shorts | 1/ngày | Cắt 15–45s đoạn hay nhất + hình đẹp, dẫn về video dài |
| Spotify / Apple Music | 1 single mỗi 1–2 tuần, 1 EP/tháng | Pitch editorial qua Spotify for Artists **≥ 7 ngày trước** ngày phát hành |
| TikTok / Reels | 3–5/tuần | Tái sử dụng Shorts |

### Checklist
- [ ] Tuần launch: đăng 3–4 video cùng lúc để kênh không "trống"
- [ ] Tạo 3 playlist trên YouTube theo series + 1 playlist "Healing Box – Best of"
- [ ] Phát hành EP đầu tiên trên Spotify, gửi pitch
- [ ] Tạo playlist Spotify của chính kênh (trộn bài của mình + bài cùng mood của nghệ sĩ khác để tăng giá trị)
- [ ] Ghim bình luận, trả lời **mọi** bình luận trong 24h đầu
- [ ] Báo cáo tuần đầu tiên theo `templates/weekly-report.md`

### Exit criteria
✅ ≥ 20 video dài đã đăng • CTR trung bình ≥ 4% • Có số liệu 4 tuần để phân tích.

---

## 📈 GIAI ĐOẠN 3 — Tăng trưởng & tối ưu (Tháng 4–6)

**Mục tiêu:** Nhân bản cái đang hiệu quả, cắt bỏ cái không hiệu quả. Tiến tới điều kiện YPP.

### Checklist
- [ ] Phân tích top 20% video theo **thời lượng xem trung bình** và **CTR** → tìm điểm chung (series, thumbnail, tiêu đề, độ dài)
- [ ] A/B test thumbnail (YouTube Studio "Test & Compare")
- [ ] Làm video "theo mùa/sự kiện": mùa thi, mùa mưa, Trung thu, Tết, Giáng sinh
- [ ] Thử định dạng mới: 8–10h nhạc ngủ, Pomodoro 25/5, "Study with me"
- [ ] Gửi nhạc tới curator playlist độc lập (SubmitHub, Groover...) — chọn lọc, không mua stream
- [ ] Hợp tác với kênh/Tiktoker về thiền, yoga, học tập (cho dùng nhạc miễn phí kèm credit)
- [ ] Xây cộng đồng: tab Cộng đồng, poll chọn mood cho video tiếp theo
- [ ] Bắt đầu song ngữ tiêu đề/mô tả (VN + EN) cho các series có tiềm năng quốc tế

### Exit criteria
✅ Đạt (hoặc sắp đạt) **1.000 subs + 4.000 giờ xem công khai trong 12 tháng** → nộp YPP.

---

## 💰 GIAI ĐOẠN 4 — Kiếm tiền (Tháng 7–9)

**Mục tiêu:** Có dòng tiền từ nhiều nguồn, không phụ thuộc một nền tảng.

### Checklist
- [ ] Nộp & được duyệt **YouTube Partner Program** (chuẩn bị giải thích "giá trị con người" — xem `05`)
- [ ] Bật membership kênh (khi đủ điều kiện): cấp bậc "Hộp nhỏ / Hộp vàng" — quyền lợi: bản nhạc không quảng cáo, vote mood
- [ ] Royalty streaming từ Spotify/Apple (theo dõi ngưỡng tối thiểu của Spotify: bài cần đạt đủ lượt nghe/năm mới được trả tiền)
- [ ] Mở dịch vụ **license nhạc**: cho spa, quán cà phê, studio yoga, creator (bảng giá đơn giản)
- [ ] Sản phẩm số: bộ "Sleep Pack", "Study Pack" (file MP3 không quảng cáo) bán qua Gumroad/Ko-fi
- [ ] Nhận tài trợ/brand deal phù hợp (app thiền, tai nghe, trà, nến thơm...)

### Exit criteria
✅ Doanh thu hàng tháng ≥ tổng chi phí vận hành • Có ≥ 2 nguồn thu.

---

## 🌐 GIAI ĐOẠN 5 — Mở rộng & hệ thống hóa (Tháng 10–12+)

**Mục tiêu:** Kênh chạy như một "studio nhỏ", không phụ thuộc hoàn toàn vào sức một người.

### Checklist
- [ ] **Livestream 24/7** (radio lofi/healing) — nguồn giờ xem và subs rất lớn
- [ ] Viết SOP chi tiết cho từng vai trò → thuê cộng tác viên (thumbnail, upload)
- [ ] Mở kênh phụ theo ngôn ngữ/thị trường (vd: Healing Box Japan-style, Healing Box Sleep)
- [ ] Album tổng hợp năm, video "1 năm Healing Box"
- [ ] Đánh giá lại toàn bộ chiến lược, lập kế hoạch năm 2

---

## 🔁 Nhịp làm việc hàng tuần (áp dụng từ GĐ1)

| Ngày | Việc |
|---|---|
| **Thứ 2** | Đọc số liệu tuần trước → báo cáo tuần → chọn chủ đề tuần này |
| **Thứ 3** | Sáng tác: tạo bản nháp AI theo brief (batch) |
| **Thứ 4** | Tuyển chọn + hậu kỳ |
| **Thứ 5** | Hình ảnh: ảnh nền, thumbnail, video loop |
| **Thứ 6** | Dựng mix, metadata, lên lịch đăng (đi trước **2 tuần**) |
| **Thứ 7** | Shorts/TikTok, tương tác cộng đồng |
| **Chủ nhật** | Nghỉ / nghe nhạc tham khảo, tìm cảm hứng |

> Quy tắc **"Buffer 2 tuần"**: luôn có sẵn nội dung cho 2 tuần kế tiếp. Ốm, bận vẫn không đứt lịch.
