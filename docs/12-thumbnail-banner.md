# Ảnh thu nhỏ (thumbnail) & ảnh bìa kênh — nguyên tắc Senore

> Nghiên cứu 12/10/2026. Số liệu từ blog/công cụ bên thứ ba chỉ mang tính định hướng — kết quả **A/B test trên chính kênh** mới là thước đo thật.
> Hiện trạng kênh (28 ngày đến 10/10): CTR **2,1 %** · nhạc thường 2–5 %, thumbnail tốt 8–12 % (Chartlex).

## Hướng chính: ảnh thiết kế, không chỉ trích khung hình (12/10/2026)
Học từ MrBeast & các kênh top: thumbnail là **một bức ảnh được dàn dựng**, không phải khung hình cắt từ video.
- **Nhân vật tách nền, to 30–40 % khung**, viền sáng + bóng đổ, **cảm xúc mạnh** (khóc, ngỡ ngàng, quyết tâm).
- **Một tình huống đọc được trong 1 giây** và gây tò mò (cháu khóc dưới ngôi sao của ông → "chuyện gì đã xảy ra?").
- **Nền đơn giản, màu bão hoà, tương phản cao** (trời tím–cam, quầng sáng sau nhân vật).
- **Chữ 1–3 từ**, vàng/kem viền tối dày, nói *cảm xúc/câu hỏi* — tiêu đề video mới nói tên bài.
- Nhân vật lấy từ chính MV (render từ code ở độ phân giải cao), giữ đúng tạo hình đã duyệt.

## Chữ: tên bài là trung tâm — dàn chữ kiểu poster phim
Quyết định 12/10/2026: chữ trên thumbnail **luôn là tên bài** (không dùng câu hook tự đặt). Đẹp hay không nằm ở cách dàn chữ.
- **Kiểu chữ**: chữ không chân, đậm **ExtraBold/Black** — chữ mảnh & chữ có chân bị “mất nét” khi thu nhỏ & nén ảnh.
  Dùng **Be Vietnam Pro** (thiết kế riêng cho tiếng Việt, dấu thích ứng, có tới Black 900). Tránh Playfair cho tiêu đề đậm (lỗi canh dấu chồng).
  Tối đa **2 kiểu chữ**: tên bài (Black) + tên nghệ sĩ nhỏ (Medium, giãn 0.05–0.1em).
- **Khối tiêu đề (title lockup)** như poster phim: tên bài là một khối thống nhất, ngắt theo nghĩa, các dòng **cùng độ rộng hoặc có chủ–phụ rõ**
  (vd. `ĐỪNG OÁN TRÁCH` to · `THÊM CHI` nhỏ hơn); chữ **lồng vào cảnh** — nhân vật đứng *trước* một phần chữ, ánh sáng của cảnh hắt lên chữ.
- **Màu chữ lấy từ ánh sáng trong cảnh** (kem ấm / vàng đom đóm) thay vì màu dán lên; tương phản ≥ 4,5:1 nhờ nền tối cục bộ/bóng mềm,
  **viền tối mảnh 2–4 px** chỉ khi cần — không viền dày.
- **Thử ở cỡ 320 px** (cỡ thật trên điện thoại) — không đọc được ngay thì sửa.
- Chữ ≥ 64 px trên khung 1280×720; tránh góc dưới phải.

Nguồn bổ sung: [ThumbnailCreator — Visual hierarchy](https://www.thumbnailcreator.com/blog/visual-hierarchy-rules-thumbnails) ·
[1of10 — Best thumbnail fonts](https://1of10.com/blog/best-youtube-thumbnail-fonts/) ·
[ThumbnailCreator — Music video thumbnails](https://www.thumbnailcreator.com/blog/music-video-thumbnails-tips) ·
[Mervin Praison — CTR of 3,200 song thumbnails](https://mer.vin/2026/09/youtube-thumbnail-ctr-for-song-videos-what-3200-thumbnails-teach-us/) ·
[Google Fonts — Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro) ·
[google/fonts #10101 — lỗi dấu Playfair](https://github.com/google/fonts/issues/10101)

## Thumbnail — 8 quy tắc

1. **Một điểm nhìn chính.** Nhân vật cận cảnh chiếm ~⅓ khung, nét mặt có cảm xúc *đúng với bài* (không giật gân).
   Hai chủ thể to ngang nhau là lỗi bố cục phổ biến nhất.
2. **Chữ 2–4 từ, to, nằm ở vùng trống** — không đè mặt nhân vật. Tên bài *hoặc* một câu hook ngắn; tiêu đề video bổ sung ý, không lặp lại.
3. **Tương phản mạnh** — chữ sáng trên nền tối cục bộ (scrim); kiểm tra trên cả giao diện sáng & tối, cỡ nhỏ trên điện thoại.
4. **Lề an toàn 72 px**, tránh **góc dưới phải** (YouTube đè thời lượng video).
5. **Ngắt dòng theo nghĩa** (không cắt đôi cụm từ), giãn dòng ≥ 1.25 cho dấu tiếng Việt; không giãn chữ bằng dấu cách.
6. **Nhận diện nhất quán**: cùng font (Lora Bold), gạch nhấn Ember `#D9622B`, logo Senore nhỏ dưới tên bài — nhìn là biết của Senore.
7. **Không lấy khung hình ngẫu nhiên**: chọn khoảnh khắc cảm xúc nhất của MV, cắt bỏ phụ đề.
8. **Luôn thử A/B** bằng *Thử nghiệm A/B* (Test & Compare) của YouTube Studio: tối đa 3 phương án, YouTube chọn theo **tỷ lệ thời gian xem**, chạy vài ngày tới 2 tuần.
   Mỗi lần chỉ đổi **một** yếu tố (cảnh/nhân vật · chữ · màu).

## Ảnh bìa kênh (banner)
- Kích thước tải lên **2560×1440**, < 6 MB. Vùng **luôn hiển thị (điện thoại) 1546×423 ở giữa** — mọi chữ & logo nằm trong đó.
  Máy tính hiện 2560×423, máy tính bảng 1855×423, TV hiện toàn bộ.
- Không lặp tên/logo kênh (ảnh đại diện + tên đã hiện ngay dưới banner) → dùng chỗ đó để nói **kênh có gì & khi nào**:
  *"Những bài hát về cuộc sống · MV mới Thứ 3 & Thứ 6 — 20:00"*.
- Ngoài vùng an toàn chỉ để nền trang trí; xem trước trên cả 4 loại màn hình trước khi đăng.

## Nguồn
- [vidIQ — Thumbnail design tips 2026](https://vidiq.com/blog/post/youtube-thumbnail-design-tips/)
- [Chartlex — Thumbnail strategy for music videos 2026](https://www.chartlex.com/blog/marketing/youtube-thumbnail-strategy-music-videos-2026)
- [YouTube Help — A/B test titles & thumbnails](https://support.google.com/youtube/answer/16391400?hl=en)
- [vidIQ — Test & Compare](https://vidiq.com/blog/post/youtube-launches-new-thumbnail-testing-tool/)
- [Manypixels — Banner size & safe area](https://www.manypixels.co/blog/marketing-design/youtube-banner-size)
- [Lilach Bullock — Banner dimensions 2026](https://www.lilachbullock.com/youtube-channel-banner-dimensions/)
