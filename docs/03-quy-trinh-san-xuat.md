# 03 — Quy trình sản xuất (SOP)

```
① Hạt giống ──► ② Viết lời ──► ③ Tạo nhạc AI ──► ④ Chọn bản ──► ⑤ Hậu kỳ & master ──► ⑥ QC ──► ⑦ Hình ảnh ──► ⑧ Đóng gói
   (ý tưởng)       (NGƯỜI)         (Suno)
```

## ① Hạt giống — sổ ý tưởng

Luôn mang theo một nơi ghi nhanh (Notes điện thoại). Ghi lại:
- Một câu chợt nghĩ ra ("bão không quật ngã, bão lay rễ sâu")
- Một hình ảnh (tảng đá dưới lòng sông)
- Một câu hỏi (sống có ý nghĩa là gì?)
- Một khoảnh khắc thật của bạn hoặc người quanh bạn

Cuối tuần chuyển những ý tốt nhất vào `templates/song-brief.md`.

## ② Viết lời — phần quan trọng nhất ✍️

**Quy trình 5 bước:**
1. **Một thông điệp duy nhất** — viết thành 1 câu. Nếu không viết được 1 câu, bài chưa rõ.
2. **Chọn ẩn dụ trung tâm** — một hình ảnh mang cả bài (cây, đá, sông...). Giữ nhất quán từ đầu đến cuối.
3. **Hành trình**: Verse 1 (hiện tại/nỗi đau) → Verse 2 (đấu tranh/hiểu ra) → Bridge (lật chuyển) → Chorus cuối (đã khác đi).
4. **Hook**: điệp khúc ngắn, có câu dễ nhớ để trích dẫn — đây là câu sẽ lên TikTok.
5. **Câu kết lật nghĩa** — chữ ký của bạn.

**Kỹ thuật cho AI hát tiếng Việt tốt:**
- Câu ngắn, nhịp đều (thể thơ 6–8 / lục bát rất hợp — như "Sau Mùa Giông").
- Tránh chuỗi dài nhiều thanh sắc/nặng liên tiếp; tránh từ dễ bị hát sai dấu.
- Ghi nhãn cấu trúc rõ: `[Verse 1]`, `[Pre-Chorus]`, `[Chorus]`, `[Bridge]`, `[Rap]`, `[Outro]`.
- Có thể thêm chỉ dẫn trong ngoặc: `[Spoken]`, `[Whisper]`, `[Build up]`, `[Instrumental break]`.
- Kiểm tra chính tả trước khi dán vào Suno.

**Bằng chứng tác giả:** lưu bản nháp lời có ngày (Notes, Google Docs có lịch sử phiên bản) → Drive `01-Loi-goc`.

## ③ Tạo nhạc bằng AI

- Công cụ: Suno (gói trả phí). Chế độ **Custom**: dán lời của bạn + mô tả phong cách.
- Mọi prompt phong cách bắt đầu từ **"âm thanh chung"** của dự án (`prompts/_am-thanh-chung.md`) + phần riêng theo chủ đề.
- Giữ giọng hát nhất quán (Persona nếu gói hỗ trợ).
- **Không** dùng tên ca sĩ/nhạc sĩ/bài hát thật trong prompt.
- Tạo 20–40 bản cho một lời. Có thể "Extend"/"Replace section" để sửa một đoạn thay vì tạo lại cả bài.
- **Tải bản WAV ngay** khi chọn được bản ưng (⋯ → Download → WAV) → Drive `02-Audio-goc`.

## ④ Chọn bản

Chấm 1–5 mỗi tiêu chí, chỉ giữ bản ≥ 20/25:

| Tiêu chí | Câu hỏi |
|---|---|
| **Phát âm** | Mọi câu có hát đúng dấu, nghe rõ lời không? (lời là linh hồn — lỗi ở đây là loại) |
| **Cảm xúc** | Giọng hát có "tin" vào lời mình hát không? |
| **Cao trào** | Điệp khúc có bùng lên đúng chỗ? Bridge có tạo được lật chuyển? |
| **Độ sạch** | Không artifact, méo tiếng, rè kim loại |
| **Bản sắc** | Có nghe ra "chất" của dự án không? |

## ⑤ Hậu kỳ & master

| Bước | Việc | Chuẩn |
|---|---|---|
| Sửa cấu trúc | Cắt đoạn thừa, ghép bản tốt nhất của từng đoạn (từ nhiều bản tạo) | Không lộ điểm cắt |
| Tách stems (tùy chọn) | Tách vocal/nhạc để chỉnh riêng | Stems của Suno hoặc UVR |
| EQ / de-ess vocal | Bớt chói "s", "x" | Lời rõ, không gắt |
| Master | `scripts/master.py` hoặc DAW | **-14 LUFS**, True Peak ≤ **-1 dBTP** |
| Xuất | WAV 44.1kHz/24-bit | `HB-002_sau-mua-giong_master.wav` |

## ⑥ QC

Checklist `templates/qc-checklist.md`. **Đọc lời trong khi nghe** — so từng chữ. Nghe trên tai nghe + loa + điện thoại.

## ⑦ Hình ảnh

| Sản phẩm | Kích thước | Công cụ |
|---|---|---|
| Ảnh bìa | 3000×3000 | Midjourney/Ideogram/Firefly + Canva (chữ) |
| Lyric video | 1920×1080 | CapCut (auto-caption → sửa lại), After Effects, Canva video |
| Shorts/TikTok | 1080×1920, 15–40s | CapCut |
| Spotify Canvas | 1080×1920, 3–8s loop | CapCut / Runway |

## ⑧ Đóng gói

`python3 scripts/new_track.py ...` tạo thư mục `releases/HB-xxx_ten-bai/` gồm `metadata.yaml`, `lyrics.txt`, `review.md`.
Cập nhật `status` trong `catalog/tracks.csv`: `idea → lyrics → generating → selected → mastered → packaged → scheduled → released`.

## ⏱️ Thời gian cho 1 bài (ước tính)

| Việc | Thời gian |
|---|---|
| Viết + sửa lời | 2–6h |
| Tạo & chọn bản | 1.5–2h |
| Hậu kỳ, master | 0.5–1h |
| Ảnh bìa + lyric video + 6 Shorts | 3–4h |
| **Tổng** | **~7–13h/bài** → 2 bài/tháng lúc đầu, 1 bài/tuần khi đã quen |
