# 04 — Phát hành & Phân phối

## 1. Sơ đồ phân phối

```
                        ┌──► YouTube (upload trực tiếp: video dài, Shorts, Live 24/7)
Bài hát hoàn thiện ─────┤
                        ├──► Distributor ──► Spotify, Apple Music, YouTube Music, Amazon,
                        │    (DistroKid...)   Deezer, TikTok/CapCut library, Zing MP3*, NhacCuaTui*...
                        └──► TikTok / Instagram Reels / Facebook (clip ngắn)
```
\* Zing MP3/NhacCuaTui tùy distributor có hỗ trợ hay không — kiểm tra danh sách store trước khi chọn.

## 2. Chọn Distributor

| Tiêu chí cần kiểm tra | Tại sao |
|---|---|
| **Chính sách về nhạc AI** | Một số distributor từ chối/giới hạn nhạc tạo bởi AI, hoặc yêu cầu khai báo |
| Phí: theo năm hay theo bài | Kênh ra nhiều bài → gói theo năm (không giới hạn) thường rẻ hơn |
| % hoa hồng | 0% (DistroKid) đến 15–20% ở một số nơi |
| Hỗ trợ store Việt Nam | Nếu nhắm khán giả trong nước |
| Có tắt được YouTube Content ID / "Shorts monetization" không | Tránh bị claim nhầm (xem mục 5) |
| Split royalty, thanh toán về VN (PayPal/Payoneer/Wise) | Nhận tiền thuận tiện |

Gợi ý bắt đầu: **DistroKid** (gói năm, ra bài không giới hạn, nhanh) — nhưng hãy đọc kỹ chính sách AI hiện hành của họ trước khi trả phí.

## 3. YouTube — quy trình upload chuẩn

1. Upload ở chế độ **Private/Scheduled**, đi trước lịch 1–2 tuần.
2. Điền metadata theo `templates/youtube-metadata.md`:
   - **Tiêu đề** (≤ 70 ký tự hiển thị): `[Cảm xúc/Khoảnh khắc] 🌧️ [Thể loại] [Mục đích] | [Thời lượng]`
     - Ví dụ: `Mưa Đêm Phố Cổ 🌧️ Piano Nhẹ Nhàng Thư Giãn, Dễ Ngủ | 3 Giờ`
     - Bản EN: `Rainy Night in Old Town 🌧️ Soft Piano for Sleep & Relax | 3 Hours`
   - **Mô tả:** 2 dòng đầu chứa từ khóa chính; chapters (timestamps); tracklist; credit; khai báo AI; link Spotify.
   - **Tags / hashtags:** 3 hashtag đầu hiển thị trên tiêu đề.
3. Thumbnail tùy chỉnh theo template series.
4. **Khai báo nội dung AI:** trong YouTube Studio có mục "Altered or synthetic content". Quy định hiện hành chủ yếu
   áp dụng cho nội dung trông/nghe *như thật* (người thật, sự kiện thật). Nhạc nền AI thường không bắt buộc bật, nhưng
   Healing Box chọn **ghi rõ trong mô tả** để minh bạch. Kiểm tra lại quy định YouTube mỗi quý.
5. Thêm vào playlist series, bật End screen (video tiếp theo cùng series) + Card.
6. Không để "Made for Kids" (trừ khi nội dung nhắm trẻ em — sẽ mất bình luận & một số tính năng).
7. Chọn **danh mục: Music**, ngôn ngữ video, ngôn ngữ tiêu đề.

## 4. Spotify / Apple Music — chiến lược phát hành

- **Single-first:** phát hành từng single mỗi 1–2 tuần, rồi gom thành EP/album (chiến thuật "Waterfall" — các single cũ nằm trong release mới giúp giữ lượt nghe dồn).
- **Ngày phát hành:** Thứ 6 (ngày làm mới playlist toàn cầu). Nộp cho distributor **trước ≥ 3–4 tuần**.
- **Pitch editorial** qua Spotify for Artists **≥ 7 ngày** trước ngày phát hành (chỉ pitch được bài chưa phát hành).
- **Độ dài bài:** ≥ 2 phút (Spotify không trả tiền cho bài < 30s; bài quá ngắn/chia nhỏ để "câu stream" có thể bị coi là spam).
- **Không** tạo hàng trăm bài gần giống nhau / tên nghệ sĩ ảo hàng loạt — Spotify có bộ lọc spam dành cho nội dung AI hàng loạt.
- **Credits:** khai đúng tên nghệ sĩ (Healing Box), người viết lời (tên bạn, nếu có), và thông tin sử dụng AI nếu distributor có trường khai báo.
- Tên nghệ sĩ nhất quán ở mọi release: `Healing Box` — tránh tạo nhiều profile rời rạc.

## 5. Content ID — cảnh báo quan trọng ⚠️

Khi distributor đăng ký bài của bạn vào YouTube Content ID, hệ thống sẽ tự "claim" mọi video có đoạn nhạc tương tự.
Với nhạc AI, rủi ro là:
- **Claim nhầm chính video của bạn** (nếu không whitelist kênh), hoặc claim video người khác vô căn cứ → tranh chấp.
- Công cụ AI có thể tạo bản gần giống cho người dùng khác → hai bên claim lẫn nhau.
- Nhiều distributor **cấm** đăng ký Content ID cho nhạc AI hoặc nhạc có thành phần không độc quyền.

👉 Khuyến nghị: **tắt Content ID** ít nhất trong năm đầu. Nếu bật, phải whitelist kênh Healing Box trước.

## 6. Lịch nội dung

Quản lý tại `catalog/content-calendar.csv` — mỗi dòng là một lần đăng (video, short, single).
Ví dụ một tháng:

| Tuần | T3 (video dài) | T5 (video dài) | CN (video dài) | T6 (Spotify) |
|---|---|---|---|---|
| 1 | Rain Piano 3h | Lofi Study 2h | Deep Sleep 8h | Single #1 |
| 2 | Rain Piano 1h | Lofi Study 1h (Pomodoro) | Zen 2h | — |
| 3 | Rain Piano 3h (mới) | Lofi Study 2h | Deep Sleep 10h | Single #2 |
| 4 | Best of tháng 2h | Lofi Study 1h | Deep Sleep 3h | EP #1 (Waterfall) |
