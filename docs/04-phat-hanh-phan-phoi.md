# 04 — Phát hành & Phân phối

## 1. Sơ đồ

```
                     ┌──► Distributor ──► Spotify, Apple Music, YouTube Music, TikTok/CapCut library,
Bài hoàn thiện ──────┤                    Amazon, Deezer, Tidal...
                     ├──► YouTube: lyric video (chính) + Shorts + tuyển tập
                     └──► TikTok / Reels / Threads / Facebook: trích lời, câu chuyện bài hát
```

## 1b. Ma trận nền tảng

| Nền tảng | Cách lên | Vai trò | Hồ sơ nghệ sĩ |
|---|---|---|---|
| **Spotify** | Distributor | Nghe chính, playlist, save rate | Spotify for Artists |
| **Apple Music / iTunes** | Distributor | Nghe, Shazam | Apple Music for Artists |
| **YouTube Music** | Distributor | Nghe, kênh Topic | Official Artist Channel |
| **YouTube** | Tự đăng | Lyric video, Shorts, tuyển tập, câu chuyện | `@senoremusic` |
| **TikTok / CapCut** | Distributor (âm thanh) + tự đăng (video) | Lan truyền, sound | TikTok Artist account |
| **Instagram / Facebook** | Distributor (âm thanh) + tự đăng | Reels, trích lời | Tài khoản Creator / Trang Musician |
| **Threads** | Tự đăng | Trích lời, hậu trường | theo Instagram |
| **Amazon, Deezer, Tidal…** | Distributor | Phủ sóng | for Artists |
| **Musixmatch / Genius** | Tự claim | Lời bài hát hiển thị | Musixmatch for Artists / Genius Verified |

👉 **Hướng dẫn thiết lập từng tài khoản theo thứ tự:** [`setup/thiet-lap-nen-tang.md`](setup/thiet-lap-nen-tang.md) · theo dõi tại `catalog/platforms.csv`

## 2. Chiến lược "single-first"

Với nhạc có lời, **mỗi bài là một sự kiện**:
- Phát hành **1 single mỗi 2 tuần** (GĐ2) → **mỗi tuần** (GĐ3+), luôn vào **Thứ 6**.
- Nộp distributor **trước ≥ 3 tuần**, **pitch editorial** Spotify for Artists **≥ 7 ngày** trước.
- Sau 3–4 single → gom thành **EP** (single cũ + 1–2 bài mới) — "waterfall" giúp dồn lượt nghe.
- Mỗi quý một **concept EP/album** xoay quanh một chủ đề.

## 3. Chọn distributor

| Tiêu chí | Tại sao |
|---|---|
| **Chính sách nhạc AI** | Một số nơi từ chối/giới hạn, hoặc yêu cầu khai báo |
| Có trường **Lyricist / Songwriter** | Ghi tên bạn là người viết lời |
| Gửi được **lời bài hát** (lyrics) lên Spotify/Apple | Lời hiện trong app — rất quan trọng với dự án này |
| Phí theo năm vs theo bài | Ra đều → gói năm thường rẻ hơn |
| Tắt được YouTube Content ID | Tránh claim nhầm (mục 6) |

> Lời bài hát trên Spotify thường được cung cấp qua Musixmatch — tạo tài khoản Musixmatch for Artists để gửi/đồng bộ lời
> nếu distributor không hỗ trợ.

## 4. Credits khi nộp bài

| Trường | Điền |
|---|---|
| Primary Artist | `Senore` — **giống hệt** ở mọi bài |
| Lyricist / Songwriter | **Họ tên thật của bạn** |
| Composer / Producer | Theo hướng dẫn của distributor về nhạc AI (một số yêu cầu ghi rõ) |
| Khai báo AI | Có trường thì khai trung thực |
| Language | Vietnamese · Explicit: No (trừ khi có) |
| Genre | Pop / Singer-Songwriter / Hip-Hop (bài rap) |

## 5. YouTube

1. **Lyric video** đăng cùng ngày phát hành (lên lịch trước).
2. Tiêu đề: `[Tên bài] - Senore (Lyric Video)` · ví dụ: `Sau Mùa Giông - Senore (Lyric Video)`
   - Kèm câu hook ở tuyển tập/Shorts: `"Bão không quật ngã — bão lay… rễ sâu" | Sau Mùa Giông`
3. Mô tả: câu chuyện bài hát → **lời đầy đủ** (Google index lời → người tìm lời sẽ tìm thấy bạn) → link nghe → credits → khai báo AI.
4. Playlist theo 4 chủ đề + playlist "Tất cả bài hát".
5. Khi có kênh "Topic" (YouTube Music tự tạo từ distributor) → liên kết để thành **Official Artist Channel** (gộp Topic + kênh chính).
6. Danh mục: Music · không dành cho trẻ em.

## 6. Content ID ⚠️

Nhạc AI có thể có bản gần giống do người khác tạo → claim chồng chéo. **Tắt Content ID** ít nhất năm đầu,
hoặc bật chỉ khi đã whitelist kênh của bạn.

## 7. Lịch nội dung mẫu (1 bài / 2 tuần)

| Ngày | Nội dung |
|---|---|
| T-7 | Short teaser #1: câu hook, chưa có nhạc đầy đủ |
| T-3 | Short teaser #2: hậu trường viết lời (ảnh chụp trang nháp) |
| **T-0 (Thứ 6)** | Single + lyric video + bài đăng câu chuyện |
| T+1 → T+10 | 5–8 Shorts: mỗi đoạn hay của bài, "POV", trích lời trên hình |
| T+14 | Single tiếp theo |

Quản lý tại `catalog/content-calendar.csv`.
