# ✍️ [Tên kênh] — Dự án âm nhạc về cuộc sống, ý nghĩa & động lực

> *"Lời do người viết. Nhạc do người và máy cùng dựng. Ý nghĩa do người nghe mang theo."*

**[Tên kênh]** là dự án âm nhạc **có lời tiếng Việt, lời do chính tác giả viết**, nói về
**cuộc sống, nghệ thuật, ý nghĩa, động lực và những điều sâu sắc**. Phần phối khí và giọng hát
được tạo với sự hỗ trợ của AI, sau đó tuyển chọn và hoàn thiện thủ công.
Nhạc phát hành trên **YouTube, Spotify, Apple Music, TikTok** và các nền tảng số.

> 🏷️ **Tên kênh chưa chốt** (tên cũ "Healing Box" không còn hợp với hướng đi mới và đã bị trùng) —
> xem `docs/setup/ngay-1-tai-khoan.md`. Chốt xong, thay `[Tên kênh]` trong toàn bộ repo.

Repo này là **"bộ não vận hành"** của dự án: kế hoạch, quy trình chuẩn (SOP), template, kho prompt,
danh mục bài hát và script tự động hóa.

---

## 🎵 Hai bài đầu tiên

| Mã | Bài | Chủ đề | Trạng thái |
|---|---|---|---|
| HB-001 | **Tảng Đá** | Được thời gian mài giũa → tìm thấy nơi mình thuộc về | Cần sửa lời, tải WAV |
| HB-002 | **Sau Mùa Giông** | Kiên cường: "bão không quật ngã — bão lay… rễ sâu" | ⭐ Single ra mắt, cần WAV |

---

## 🗺️ Lộ trình tổng quan (12 tháng)

| Giai đoạn | Thời gian | Mục tiêu chính | Kết quả bàn giao |
|---|---|---|---|
| **0. Nền tảng** | Tuần 1–2 | Tên, thương hiệu, tài khoản, pháp lý | Kênh đã setup, distributor, đăng ký bản quyền lời |
| **1. Bản sắc & kho bài** | Tuần 3–8 | Định hình "chất giọng" + 8–10 bài hoàn chỉnh | 8–10 bài, lyric video, 4 bài chờ phát hành |
| **2. Ra mắt** | Tháng 3–4 | Single đầu tay "Sau Mùa Giông" + EP đầu | 4–6 single, EP #1, 30+ Shorts |
| **3. Tăng trưởng** | Tháng 5–8 | TikTok sound, câu chuyện bài hát, cộng đồng | 1 bài/tuần, tuyển tập, cộng đồng người nghe |
| **4. Kiếm tiền** | Tháng 7–10 | Streaming, YouTube, sync/license, ấn phẩm | ≥ 2 nguồn thu |
| **5. Mở rộng** | Tháng 10–12+ | Album concept, ca sĩ thật thu lại bài hit, hợp tác | Album #1, bản live/acoustic |

👉 Chi tiết: [`docs/01-lo-trinh-giai-doan.md`](docs/01-lo-trinh-giai-doan.md)

---

## 📁 Cấu trúc thư mục

```
amnhacai/
├── README.md                     ← Bạn đang ở đây
├── docs/                         ← Kế hoạch & SOP (đọc theo thứ tự số)
│   ├── 00-tong-quan-du-an.md         Tầm nhìn, định vị, khán giả, 4 chủ đề chính
│   ├── 01-lo-trinh-giai-doan.md      5 giai đoạn, checklist, điều kiện chuyển giai đoạn
│   ├── 02-nhan-dien-thuong-hieu.md   Tên, màu, font, hình ảnh, giọng văn
│   ├── 03-quy-trinh-san-xuat.md      Lời → AI → tuyển chọn → hậu kỳ → QC
│   ├── 04-phat-hanh-phan-phoi.md     Chiến lược single, YouTube, Spotify, distributor
│   ├── 05-phap-ly-ban-quyen.md       ⚠️ Bản quyền lời & nhạc AI, chính sách nền tảng
│   ├── 06-marketing-tang-truong.md   TikTok, câu chuyện bài hát, cộng đồng
│   ├── 07-kiem-tien.md               Các nguồn doanh thu & dự phóng
│   ├── 08-kpi-bao-cao.md             Chỉ số, nhịp báo cáo tuần/tháng
│   ├── 09-cong-cu-ngan-sach.md       Bộ công cụ & ngân sách
│   └── setup/ngay-1-tai-khoan.md     Hướng dẫn Ngày 1 (điền vào chỗ ✍️)
├── brand/                        ← Logo, font, hình ảnh, template
├── prompts/                      ← "Bible" từng chủ đề: phong cách nhạc, prompt, prompt ảnh
├── templates/                    ← Brief bài hát, metadata, checklist, báo cáo
├── catalog/                      ← Danh mục bài hát & lịch nội dung (CSV)
├── releases/                     ← Mỗi bài một thư mục: metadata, lời, nhận xét
├── reports/                      ← Báo cáo tuần/tháng
└── scripts/                      ← Tạo bài mới, master âm thanh, dựng tuyển tập
```

---

## ⚡ Script

```bash
# Tạo hồ sơ cho một bài mới (tự sinh mã HB-xxx + thêm vào catalog)
python3 scripts/new_track.py --title "Người Gieo Hạt" --series dung-day --mood "bền bỉ"

# Master nhanh: chuẩn -14 LUFS, True Peak -1 dBTP → WAV 44.1kHz/24-bit
python3 scripts/master.py song.wav            # --measure để chỉ đo

# Dựng video tuyển tập dài + sinh timestamps (cần ffmpeg)
python3 scripts/build_mix.py releases/tuyen-tap-01/audio --image bg.jpg --crossfade 3 \
    --titles titles.txt --out releases/tuyen-tap-01/tuyen-tap-01.mp4
python3 scripts/build_mix.py releases/tuyen-tap-01/audio --chapters-only --titles titles.txt
```

> 💾 File audio/video (`.wav`, `.mp3`, `.mp4`...) **không** được commit lên git (xem `.gitignore`) —
> lưu bản gốc trên Google Drive/ổ cứng theo quy tắc 3-2-1. Git chỉ giữ metadata, lời, prompt, kế hoạch.
