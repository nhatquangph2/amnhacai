# 🎧 Healing Box — Kênh âm nhạc AI chữa lành

> *"Một chiếc hộp nhỏ, mở ra là bình yên."*

Healing Box là dự án kênh âm nhạc chữa lành (healing / relaxing / lofi / sleep / piano / ambient)
được sáng tác với sự hỗ trợ của AI, phát hành trên **YouTube, Spotify, Apple Music, TikTok** và các nền tảng số khác.

Repo này là **"bộ não vận hành"** của kênh: kế hoạch, quy trình chuẩn (SOP), template, kho prompt,
danh mục bài hát và script tự động hóa.

---

## 🗺️ Lộ trình tổng quan (12 tháng)

| Giai đoạn | Thời gian | Mục tiêu chính | Kết quả bàn giao |
|---|---|---|---|
| **0. Nền tảng** | Tuần 1–2 | Thương hiệu, tài khoản, pháp lý, công cụ | Brand kit, kênh đã setup, tài khoản distributor |
| **1. Kho nhạc đầu tiên** | Tuần 3–6 | Sản xuất 40–60 bài đạt chuẩn | 3 series nhạc, 8–10 video dài sẵn sàng đăng |
| **2. Ra mắt** | Tháng 2–3 | Launch YouTube + Spotify | 12+ video, 2 EP/single trên Spotify |
| **3. Tăng trưởng** | Tháng 4–6 | Tối ưu theo dữ liệu, Shorts, playlist | Đạt/tiến gần điều kiện YPP |
| **4. Kiếm tiền** | Tháng 7–9 | Bật doanh thu, đa dạng nguồn thu | YPP, royalty streaming, membership |
| **5. Mở rộng** | Tháng 10–12+ | Hệ thống hóa, livestream 24/7, kênh phụ | Quy trình chạy được mà không cần "ôm" |

👉 Chi tiết: [`docs/01-lo-trinh-giai-doan.md`](docs/01-lo-trinh-giai-doan.md)

---

## 📁 Cấu trúc thư mục

```
amnhacai/
├── README.md                     ← Bạn đang ở đây
├── docs/                         ← Kế hoạch & SOP (đọc theo thứ tự số)
│   ├── 00-tong-quan-du-an.md         Tầm nhìn, định vị, khán giả mục tiêu
│   ├── 01-lo-trinh-giai-doan.md      5 giai đoạn, checklist, KPI từng giai đoạn
│   ├── 02-nhan-dien-thuong-hieu.md   Brand identity: tên, màu, font, giọng văn
│   ├── 03-quy-trinh-san-xuat.md      Pipeline: ý tưởng → AI → hậu kỳ → QC
│   ├── 04-phat-hanh-phan-phoi.md     YouTube, Spotify, distributor, lịch đăng
│   ├── 05-phap-ly-ban-quyen.md       ⚠️ Bản quyền AI, chính sách nền tảng
│   ├── 06-marketing-tang-truong.md   SEO, Shorts, playlist, cộng đồng
│   ├── 07-kiem-tien.md               Các nguồn doanh thu & dự phóng
│   ├── 08-kpi-bao-cao.md             Chỉ số, nhịp báo cáo tuần/tháng
│   └── 09-cong-cu-ngan-sach.md       Bộ công cụ & ngân sách đề xuất
├── brand/                        ← Logo, font, hình nền, template thumbnail
├── prompts/                      ← Kho prompt AI (nhạc, ảnh, video) theo series
├── templates/                    ← Mẫu: brief bài hát, metadata, checklist, báo cáo
├── catalog/                      ← Danh mục toàn bộ bài hát & lịch nội dung (CSV)
├── releases/                     ← Mỗi bài/mix một thư mục riêng (tạo bằng script)
├── reports/                      ← Báo cáo tuần/tháng
└── scripts/                      ← Tự động hóa (tạo track mới, dựng mix dài, chapters)
```

---

## ⚡ Bắt đầu nhanh

```bash
# 1. Tạo hồ sơ cho một bài hát mới (tự sinh mã HB-xxx + thêm vào catalog)
python3 scripts/new_track.py --title "Mưa Trên Hiên Nhà" --series rain-piano --mood calm

# 2. Dựng một video mix dài từ nhiều bài (cần ffmpeg)
python3 scripts/build_mix.py releases/mix-001/audio --image brand/visuals/rain.jpg \
    --out releases/mix-001/healing-box-mix-001.mp4

# 3. Chỉ sinh timestamps (chapters) cho mô tả YouTube, không render
#    (tên bài có dấu: thêm --titles titles.txt, mỗi dòng một tên)
python3 scripts/build_mix.py releases/mix-001/audio --chapters-only
```

---

## ✅ Việc cần làm ngay trong tuần này

1. Đọc [`docs/05-phap-ly-ban-quyen.md`](docs/05-phap-ly-ban-quyen.md) — **quan trọng nhất**, quyết định kênh có kiếm tiền được hay không.
2. Chốt nhận diện theo [`docs/02-nhan-dien-thuong-hieu.md`](docs/02-nhan-dien-thuong-hieu.md).
3. Đăng ký gói **trả phí** của công cụ AI nhạc (bắt buộc để có quyền thương mại).
4. Tạo kênh YouTube (Brand Account), email riêng cho dự án, tài khoản distributor.
5. Làm 10 bài thử đầu tiên theo [`docs/03-quy-trinh-san-xuat.md`](docs/03-quy-trinh-san-xuat.md).

> 💾 File audio/video (`.wav`, `.mp3`, `.mp4`...) **không** được commit lên git (xem `.gitignore`) —
> lưu bản gốc trên Google Drive/ổ cứng theo quy tắc 3-2-1. Git chỉ giữ metadata, prompt, kế hoạch.
