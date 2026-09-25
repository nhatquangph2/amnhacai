# 03 — Quy trình sản xuất (SOP)

```
① Brief ──► ② Tạo nhạc AI ──► ③ Tuyển chọn ──► ④ Hậu kỳ ──► ⑤ QC ──► ⑥ Hình ảnh/Video ──► ⑦ Đóng gói ──► Phát hành
```

## ① Brief — lên ý tưởng (15 phút/batch)

Dùng `templates/song-brief.md`. Một brief = một batch 5–15 bài cùng series. Trả lời:
- Khoảnh khắc nào? (vd: "11 giờ đêm, mưa ngoài cửa sổ, ngồi viết nhật ký")
- Series, mood, BPM, nhạc cụ chính, key/scale gợi ý
- Không có lời hay có lời? Nếu có lời → **tự viết lời** (tăng yếu tố sáng tạo của con người, xem `05`)
- Dùng cho video dài hay single Spotify?

## ② Tạo nhạc bằng AI

**Công cụ chính:** công cụ tạo nhạc AI có gói trả phí cấp quyền thương mại (vd: Suno Pro/Premier).
Luôn đọc lại ToS hiện hành — chính sách các công cụ AI nhạc thay đổi liên tục (2025–2026 có nhiều thỏa thuận với hãng đĩa).

**Nguyên tắc viết prompt** (xem kho mẫu ở `prompts/`):
- Công thức: `[Thể loại] + [Mood] + [Nhạc cụ] + [Tempo/BPM] + [Không khí/Chất liệu âm thanh] + [Cấu trúc]`
- Ví dụ: `soft solo piano, melancholic but hopeful, 70 bpm, warm felt piano, gentle rain ambience, slow intro, no drums, instrumental`
- **Không** dùng tên nghệ sĩ/bài hát thật trong prompt (vd: "như Yiruma", "giống River Flows in You") → rủi ro bản quyền + vi phạm ToS.
- Với bài không lời: bật chế độ Instrumental.
- Tạo theo batch, đặt tên bản nháp theo mã: `HB-012_draft-a`, `HB-012_draft-b`...

**Luôn tải bản WAV** của bài được chọn ngay khi tạo (Suno: nút ⋯ → Download → WAV) và lưu vào Drive `01-Audio-goc`.

**Lưu bằng chứng sáng tác** (bắt buộc cho mọi bài được chọn):
prompt đầy đủ, lời bài hát, link/ID bản gốc trên công cụ, ngày tạo, gói đăng ký đang dùng → ghi vào `releases/HB-xxx/metadata.yaml`.

## ③ Tuyển chọn (Curation)

Nghe mỗi bản nháp ít nhất 60 giây đầu + đoạn giữa + đoạn cuối. Loại ngay nếu:
- Có giọng hát/tiếng lạ lọt vào bản instrumental, lỗi "méo tiếng" (artifacts), tiếng rè kim loại
- Giai điệu quá giống một bài hát nổi tiếng (nếu nghe thấy "quen quen" → bỏ)
- Nhịp bị lệch, kết thúc đột ngột mà không cứu được
- Không đúng mood của series

Chấm điểm 1–5 cho: **Giai điệu – Âm sắc – Cảm xúc – Độ "sạch"**. Chỉ giữ bài có tổng ≥ 15/20.

## ④ Hậu kỳ (Post-production) — nơi con người tạo khác biệt

Công cụ: DAW miễn phí/giá rẻ (**Audacity**, **Reaper**, **BandLab**, **Cakewalk**) hoặc chuyên nghiệp (Logic, Ableton, FL Studio).

| Bước | Việc | Chuẩn |
|---|---|---|
| 1. Tách stems (tùy chọn) | Tách piano/pad/beat để xử lý riêng | Công cụ tách stems của nền tảng AI hoặc UVR |
| 2. Chỉnh sửa | Cắt đoạn lỗi, ghép phần hay, kéo dài/rút ngắn cấu trúc | Không để lộ điểm cắt |
| 3. Thêm lớp âm thanh | Tiếng mưa, lửa, chim, sóng (nguồn có license: Freesound CC0, Pixabay, Epidemic...) | Nền không lấn nhạc |
| 4. EQ / Reverb nhẹ | Giảm chói 3–6 kHz, bớt bùn 200–400 Hz | Ấm, mềm tai khi nghe lâu |
| 5. Fade | Fade-in 2–5s, fade-out 5–10s | Ghép mix mượt |
| 6. Master | Limiter, chuẩn hóa độ lớn (nhanh: `scripts/master.py`) | **-14 LUFS** (lofi/piano), **-16 đến -18 LUFS** (sleep/ambient); True Peak ≤ **-1 dBTP** |
| 7. Xuất file | WAV 44.1kHz/24-bit (master) + MP3 320kbps (preview) | Đặt tên: `HB-012_mua-tren-hien-nha_master.wav` |

> Các bước 2–4 **không chỉ để hay hơn** — chúng còn là bằng chứng "đóng góp sáng tạo của con người",
> quan trọng cho cả bản quyền lẫn việc được duyệt kiếm tiền trên YouTube.

## ⑤ Kiểm soát chất lượng (QC)

Chạy checklist `templates/qc-checklist.md`. Nghe trên **3 thiết bị**: tai nghe, loa, điện thoại.
Nếu là nhạc ngủ: nghe thử ở âm lượng nhỏ trong phòng tối — có âm nào "giật mình" không?

## ⑥ Hình ảnh & Video

| Sản phẩm | Kích thước | Công cụ gợi ý |
|---|---|---|
| Ảnh nền video | 3840×2160 hoặc 1920×1080 | Midjourney, Ideogram, Leonardo, Flux (kiểm tra quyền thương mại) |
| Chuyển động loop | 10–30s, 1080p/4K | Runway, Kling, Pika, hoặc After Effects/CapCut (mưa, khói, đèn) |
| Thumbnail | 1280×720, < 2MB | Canva / Photoshop / Figma theo template series |
| Ảnh bìa Spotify | 3000×3000, JPG/PNG | Không chứa URL, logo mạng xã hội, chữ mờ |
| Shorts/Reels | 1080×1920, 15–45s | CapCut |

Dựng video mix dài: `scripts/build_mix.py` (ghép audio + ảnh/loop + sinh chapters tự động).

## ⑦ Đóng gói phát hành

Mỗi bài/mix có một thư mục trong `releases/` (tạo bằng `scripts/new_track.py`):
```
releases/HB-012_mua-tren-hien-nha/
├── metadata.yaml        ← thông tin bài, prompt, bằng chứng, trạng thái
├── audio/               ← master.wav, preview.mp3, stems/
├── artwork/             ← cover 3000x3000, thumbnail
└── video/               ← video YouTube, shorts
```
Cập nhật cột `status` trong `catalog/tracks.csv`: `idea → draft → selected → mastered → packaged → scheduled → released`.

## ⏱️ Năng suất mục tiêu (1 người)

| Công đoạn | Thời gian |
|---|---|
| Brief + tạo 60 bản nháp | 3h |
| Tuyển chọn còn ~12 bài | 1.5h |
| Hậu kỳ 12 bài | 4h |
| Hình ảnh cho 3 video | 3h |
| Dựng mix + metadata + lên lịch | 2h |
| **Tổng / tuần** | **~13–14h cho 3 video dài + 1 single** |
