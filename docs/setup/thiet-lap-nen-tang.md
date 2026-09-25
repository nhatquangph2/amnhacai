# Thiết lập toàn bộ nền tảng phát hành — Senore

> Làm **một lần từ đầu**, theo đúng thứ tự: có những tài khoản **chỉ tạo được sau khi** bài đầu tiên đã lên distributor.
> Chỗ có `✍️` là bạn điền. Theo dõi tiến độ ở `catalog/platforms.csv`.
> 🔒 Mọi tài khoản đăng ký bằng **Gmail của kênh** (`senoremusic@gmail.com` hoặc email bạn đã tạo), bật 2FA nếu có.

## Bức tranh tổng thể

```
                               ┌── Spotify ──────────── Spotify for Artists (claim sau khi upload)
                               ├── Apple Music/iTunes ─ Apple Music for Artists (+ Shazam)
 File WAV + ảnh bìa + lời ──►  │   DISTRIBUTOR          ├── YouTube Music ─────── Kênh "Topic" → gộp thành Official Artist Channel
 (Senore, 1 lần upload)        │   (DistroKid)          ├── TikTok / CapCut ───── TikTok Artist account
                               ├── Instagram/Facebook ─ thư viện nhạc Reels/Story
                               └── Amazon, Deezer, Tidal ...

 Tự đăng trực tiếp: YouTube (lyric video, Shorts) · TikTok · Instagram · Facebook · Threads
 Lời bài hát: distributor / Musixmatch → hiện lời trên Spotify, Apple, Instagram · Genius
```

---

## GIAI ĐOẠN A — Làm ngay (trước khi upload bài) · ~2 giờ

### A1. Gmail + YouTube → xem `ngay-1-tai-khoan.md`

### A2. TikTok `@senoremusic` (10 phút)
1. Cài TikTok → Đăng ký bằng **email kênh** → username `senoremusic`, tên hiển thị `Senore`.
2. Hồ sơ → Bio: `Senore — những bài hát về cuộc sống ✍️ Lời tự viết · bài mới mỗi Thứ 6`
3. Để **tài khoản cá nhân (Personal/Creator)** — *không* chuyển sang Business (tài khoản Business bị giới hạn thư viện nhạc).
   Sau khi bài đầu tiên lên TikTok qua distributor → đăng ký **Artist account** (mục B4).
4. Đăng 1–2 video "giữ chỗ" (ảnh bìa + câu hook) để tài khoản không trống.

### A3. Facebook Page "Senore" (10 phút)
1. Facebook → Trang → Tạo Trang mới · Tên: `Senore` · Hạng mục: **Nhạc sĩ/Ban nhạc** (Musician/Band).
2. Tên người dùng Trang: `senoremusic` · Tiểu sử: dòng nhận diện.
3. Thêm email kênh làm quản trị viên (Meta Business Suite → Cài đặt → Người dùng).

### A4. Instagram `@senoremusic` + Threads (10 phút)
1. Tạo tài khoản bằng email kênh → username `senoremusic`, tên `Senore`.
2. Cài đặt → Loại tài khoản → **Tài khoản chuyên nghiệp → Nhà sáng tạo (Creator)** → hạng mục **Nhạc sĩ/Ban nhạc**.
3. Liên kết với Trang Facebook "Senore" (Cài đặt → Trung tâm tài khoản).
4. Bật **Threads** bằng chính tài khoản Instagram này.

### A5. Distributor — DistroKid (khuyến nghị) (30 phút)
**Vì sao DistroKid:** gói năm không giới hạn bài · chấp nhận nhạc tạo bằng AI **nếu khai báo và có quyền thương mại** ·
có trang pre-save (HyperFollow) · hỗ trợ lời bài hát · cấp quyền Spotify for Artists nhanh.
*(Thay thế: TuneCore, CD Baby, Amuse, RouteNote — nhưng hãy đọc chính sách AI trước khi chọn.)*

1. Vào `distrokid.com` → Đăng ký bằng **email kênh**.
2. Gói: **Musician** (1 tên nghệ sĩ, không giới hạn bài) là đủ.
3. **Tên nghệ sĩ:** `Senore` — gõ đúng từng chữ, sau này mọi bài đều chọn đúng tên này.
4. Khi upload bài đầu (mục A6): ở câu hỏi về Spotify/Apple, chọn **"Đây là bài đầu tiên của tôi / tạo hồ sơ nghệ sĩ mới"**
   → **không** chọn nhầm hồ sơ của ai trùng tên.
5. **Thanh toán & thuế:** Bank → điền thông tin thuế **W-8BEN** (cá nhân ngoài Mỹ) → phương thức nhận tiền (PayPal / chuyển khoản).
6. **Cài đặt quan trọng:**
   - [ ] **YouTube Content ID: TẮT** (không chọn "YouTube Content ID" / "Shorts monetization" — xem `docs/04` mục 6)
   - [ ] Store: chọn đủ các nền tảng lớn — Spotify, Apple Music/iTunes, YouTube Music, TikTok/CapCut, Instagram/Facebook, Amazon, Deezer, Tidal
   - [ ] Mỗi lần upload: trả lời **trung thực câu hỏi về việc dùng công cụ AI**
7. Lưu hóa đơn gói DistroKid vào Drive `06-Phap-ly`.

✍️ Distributor: ________ · Gói: ________ · Ngày đăng ký: ________

### A6. Upload "Sau Mùa Giông" lên DistroKid (trước 02/10/2026)
Dùng thông tin trong `releases/HB-002_sau-mua-giong/release-kit.md`:
| Trường | Điền |
|---|---|
| Artist | Senore |
| Title | Sau Mùa Giông |
| Release date | **23/10/2026** (Thứ 6) |
| Language | Vietnamese |
| Genre | Pop (phụ: Singer-Songwriter) |
| Songwriter / Lyricist | ✍️ Họ tên thật của bạn |
| AI disclosure | Khai trung thực: nhạc & giọng hát tạo bằng Suno, lời do bạn viết |
| Explicit | No |
| Audio | WAV master (-14 LUFS, -1 dBTP) |
| Artwork | 3000×3000 JPG/PNG, không URL/logo mạng xã hội |
| Lyrics | Dán lời từ `lyrics.txt` |
| TikTok clip start | Chọn đoạn điệp khúc "Cứ giông đi, cứ bão đi…" (✍️ giây thứ ___) |

---

## GIAI ĐOẠN B — Sau khi upload (khoảng 3–10 ngày sau, trước ngày phát hành)

### B1. Spotify for Artists
1. Đợi bài được giao tới Spotify (DistroKid báo trong mục "Spotify for Artists access" / email).
2. `artists.spotify.com` → **Claim profile** → tìm "Senore" (hoặc dùng link DistroKid gửi) → đăng nhập bằng tài khoản Spotify của **email kênh**.
3. Hồ sơ: ảnh đại diện (≥ 750×750), ảnh header (2660×1140), **Bio** (từ `docs/02`), liên kết Instagram/TikTok/YouTube.
4. **Pitch** "Sau Mùa Giông" trước **16/10** (nội dung soạn sẵn trong release kit).
5. Thêm **Canvas** (video 3–8s dọc) cho bài.

### B2. Apple Music for Artists (+ Shazam)
1. `artists.apple.com` → đăng nhập Apple ID (tạo bằng email kênh) → **Request artist access** → tìm Senore.
2. Xác minh qua distributor hoặc liên kết mạng xã hội.
3. Ảnh hồ sơ, bio. Dữ liệu Shazam sẽ hiện ở đây.

### B3. YouTube Music → Official Artist Channel (OAC)
- Sau khi bài lên, YouTube tự tạo kênh **"Senore - Topic"**.
- Mục tiêu: gộp "Topic" + kênh `@senoremusic` thành **Official Artist Channel** (có nốt nhạc ♪ cạnh tên, gom subscribers).
- Điều kiện thường gặp: kênh có ≥ **3 bản phát hành chính thức** qua distributor, không vi phạm chính sách.
  → Gửi yêu cầu qua distributor (DistroKid có mục yêu cầu OAC) khi đủ 3 bài (dự kiến sau single #3).

### B4. TikTok Artist account
- Sau khi bài có trên TikTok: TikTok → Cài đặt → Tài khoản → **Đăng ký tài khoản nghệ sĩ** (hoặc qua TikTok for Artists)
  → liên kết bài hát với hồ sơ `@senoremusic` → nhãn "Nghệ sĩ" + trang nhạc.
- Tạo sẵn 6 video cho bài (release kit mục 6), dùng **âm thanh chính thức** của bài thay vì tải file lên.

### B5. Instagram / Facebook
- Bài có trong thư viện nhạc Reels/Story sau khi Meta nhận từ distributor → dùng âm thanh chính thức khi đăng Reels.

### B6. Trang liên kết (smart link / pre-save)
- DistroKid **HyperFollow**: trang pre-save trước phát hành → sau phát hành thành link "nghe ở mọi nền tảng".
- Đặt link này vào bio TikTok/Instagram/YouTube/Facebook.
- (Tùy chọn) Linktree/Beacons: `linktr.ee/senoremusic` gom mọi link.

### B7. Amazon Music for Artists · Deezer for Creators (5 phút mỗi nơi)
Claim hồ sơ "Senore" — ít quan trọng hơn, làm cho đủ bộ.

---

## GIAI ĐOẠN C — Sau ngày phát hành (23/10)

| Việc | Nơi | Ghi chú |
|---|---|---|
| Lời hiện trên Spotify/Instagram | **Musixmatch for Artists** (`musixmatch.com/artists`) | Claim hồ sơ, kiểm tra lời đúng từng chữ, đồng bộ theo thời gian nếu có thể |
| Trang lời bài hát | **Genius** | Tạo trang lời + xin "Verified Artist" khi có vài bài |
| Official Artist Channel | Qua distributor | Khi đủ 3 bài |
| Đăng ký quyền tác giả lời | Cục Bản quyền tác giả | Xem `docs/05` |

---

## 📋 Bảng kiểm tra đồng bộ hồ sơ (làm 1 lần, cập nhật khi đổi ảnh/bio)

| Thứ cần giống nhau ở mọi nơi | Giá trị |
|---|---|
| Tên | `Senore` |
| Handle | `@senoremusic` |
| Ảnh đại diện | ✍️ (một ảnh duy nhất, dùng mọi nơi) |
| Bio ngắn (≤ 80 ký tự) | `Senore — những bài hát về cuộc sống ✍️ Bài mới mỗi Thứ 6` |
| Bio dài | Xem `docs/02` mục 8 |
| Link chung | ✍️ HyperFollow / Linktree |
| Email liên hệ | ✍️ |

## Thứ tự làm tóm tắt

```
TUẦN NÀY    A1 Gmail+YouTube → A2 TikTok → A3 Facebook → A4 Instagram/Threads → A5 DistroKid
            → (có WAV + ảnh bìa) → A6 upload "Sau Mùa Giông" (hạn 02/10)
~09/10      B1 Spotify for Artists → B2 Apple → B4 TikTok Artist → B6 HyperFollow → B7 Amazon/Deezer
trước 16/10 Pitch Spotify
23/10       🚀 Phát hành → C: Musixmatch, Genius
Sau 3 bài   B3 Official Artist Channel
```
