# 05 — Pháp lý, bản quyền & chính sách nền tảng ⚠️

> **Đây là tài liệu quan trọng nhất.** Kênh nhạc AI thất bại phần lớn không vì nhạc dở, mà vì:
> bị từ chối kiếm tiền, bị gỡ bài, bị claim bản quyền, hoặc không có quyền thương mại với nhạc mình tạo.
>
> *Lưu ý: tài liệu này là hướng dẫn vận hành, không phải tư vấn pháp lý. Chính sách AI thay đổi rất nhanh —
> kiểm tra lại mỗi quý và trước khi ký hợp đồng license lớn.*
> *Cập nhật lần cuối: 09/2026.*

## 1. Quyền sử dụng nhạc tạo bằng AI

| Rủi ro | Cách xử lý |
|---|---|
| Gói **miễn phí** của hầu hết công cụ AI nhạc **không cho phép dùng thương mại** | Chỉ phát hành bài tạo khi **đang có gói trả phí** cấp quyền thương mại |
| ToS thay đổi (các công cụ AI nhạc đã ký thỏa thuận với hãng đĩa lớn trong 2025–2026, kéo theo thay đổi về tải xuống/quyền sở hữu) | Chụp màn hình/lưu PDF ToS mỗi khi có thay đổi → `docs/legal/` (tạo khi cần). Ghi gói đăng ký vào `metadata.yaml` từng bài |
| Một số nền tảng không còn cho tải file về hoặc chỉ cho nghe trong ứng dụng | Chỉ dùng công cụ cho phép **tải xuống + phân phối thương mại** |
| Bài giống bài hát có bản quyền | Không dùng tên nghệ sĩ/bài hát trong prompt; loại bài "nghe quen"; có thể kiểm tra nhanh bằng app nhận diện nhạc (Shazam) |

## 2. Quyền tác giả với nhạc AI

- Tại nhiều quốc gia (Mỹ, Việt Nam...) **tác giả phải là con người**; phần do AI tạo ra hoàn toàn thường **không được bảo hộ quyền tác giả**.
- Hệ quả: người khác có thể dùng lại mà bạn khó khiếu nại; bạn cũng khó đăng ký bản quyền.
- **Tăng phần đóng góp của con người** để vừa có giá trị bảo hộ vừa có nội dung khác biệt:
  - Tự viết lời bài hát (ca khúc có lời)
  - Chỉnh sửa, cắt ghép, sắp xếp lại cấu trúc; thêm lớp âm thanh, nhạc cụ tự chơi (nếu có thể)
  - Mix/master, tuyển chọn và biên tập thành mix có chủ đề
- **Lưu bằng chứng**: prompt, lời, file project DAW, ảnh chụp timeline → mỗi bài một thư mục trong `releases/`.

## 3. YouTube — điều kiện kiếm tiền (YPP)

- Điều kiện cơ bản: **1.000 subscribers + 4.000 giờ xem công khai (12 tháng)** hoặc 10 triệu lượt xem Shorts/90 ngày (có thể thay đổi — kiểm tra YouTube Help).
- Từ **07/2025**, YouTube đổi tên chính sách "repetitious content" thành **"inauthentic content"** (nội dung không chân thực):
  nội dung **sản xuất hàng loạt, lặp lại, theo khuôn mẫu, ít khác biệt giữa các video** có thể bị **từ chối/mất quyền kiếm tiền**.
- Kênh nhạc AI là nhóm dễ bị ảnh hưởng. Healing Box phòng tránh bằng:

| ❌ Tránh | ✅ Làm |
|---|---|
| Cùng 1 ảnh nền, đổi nhạc, đăng 5 video/ngày | Mỗi video có concept, hình ảnh, câu chuyện riêng |
| Tiêu đề/mô tả copy-paste | Mô tả viết riêng: câu chuyện về khoảnh khắc, gợi ý cách nghe |
| Ghép bài thô từ AI | Hậu kỳ, thêm âm thanh môi trường, sắp xếp mix có mạch cảm xúc |
| Đăng lại cùng một bài ở nhiều video | Giới hạn tái sử dụng; video "Best of" ghi rõ là tổng hợp |
| Kênh "vô danh", không tương tác | Mascot, tab Cộng đồng, trả lời bình luận, poll |

- **Khai báo AI:** YouTube yêu cầu khai báo nội dung tổng hợp "trông như thật" (altered/synthetic). Nhạc nền AI thường không thuộc nhóm bắt buộc,
  nhưng Healing Box **luôn ghi chú trong mô tả**: *"Âm nhạc được sáng tác với sự hỗ trợ của AI, tuyển chọn và hoàn thiện bởi Healing Box."*
- **Không** tạo giọng hát mô phỏng ca sĩ thật (deepfake giọng) — vi phạm chính sách và có thể bị kiện.

## 4. Spotify & các nền tảng streaming

- Spotify (từ 09/2025) công bố chính sách AI: **lọc spam** (hàng loạt bài ngắn, trùng lặp, thao túng SEO), **cấm mạo danh giọng/nghệ sĩ**,
  và ủng hộ **khai báo AI trong credits** theo chuẩn ngành (DDEX).
- Bài cần đạt **ngưỡng lượt nghe tối thiểu/năm** mới được tính royalty (áp dụng từ 2024) → tập trung ít bài chất lượng hơn là nhiều bài không ai nghe.
- **Tuyệt đối không mua stream/bot stream** → bị gỡ nhạc, phạt phí từ distributor, khóa tài khoản.
- Không upload nhiều bản trùng lặp của cùng một bài (vd: 1 bài + bản "slowed" + bản "rain" + bản "8D" đăng riêng hàng loạt).

## 5. Âm thanh, hình ảnh & font bên thứ ba

| Loại | Nguồn an toàn | Ghi chú |
|---|---|---|
| Âm thanh môi trường (mưa, chim, lửa) | Tự thu âm, Freesound (CC0), Pixabay, thư viện trả phí | Lưu link + license vào `metadata.yaml` |
| Ảnh AI | Công cụ có quyền thương mại ở gói đang dùng | Không tạo nhân vật có bản quyền (Totoro, Doraemon...) hay người nổi tiếng |
| Font | Google Fonts (OFL) | Font "free for personal use" **không** dùng cho kênh kiếm tiền |
| Footage | Tự quay, Pexels, Pixabay, thư viện trả phí | |

## 6. Tuyên bố sức khỏe

Không viết "chữa bệnh", "chữa trầm cảm", "chữa mất ngủ", "sửa DNA 528Hz"... Nền tảng có thể hạn chế nội dung gây hiểu lầm về y tế
và điều này làm giảm uy tín thương hiệu. Dùng: *thư giãn, giúp dễ ngủ hơn, giảm căng thẳng, tập trung*.

## 7. Thuế & thu nhập

- Thu nhập từ YouTube (AdSense) và distributor được trả từ nước ngoài → điền thông tin thuế Mỹ (W-8BEN) trong AdSense/distributor để áp dụng đúng mức khấu trừ.
- Thu nhập tại Việt Nam: kê khai thuế thu nhập cá nhân theo quy định hiện hành (cá nhân kinh doanh trên nền tảng số). Nên hỏi kế toán khi doanh thu ổn định.
- Khi doanh thu lớn/thuê người → cân nhắc thành lập hộ kinh doanh hoặc công ty để ký hợp đồng license, xuất hóa đơn.

## 8. Checklist pháp lý cho MỖI bài phát hành

- [ ] Tạo bằng gói trả phí có quyền thương mại (ghi rõ gói + ngày)
- [ ] Prompt không chứa tên nghệ sĩ/bài hát thật
- [ ] Đã nghe kiểm tra "không giống bài nổi tiếng"
- [ ] Âm thanh/ảnh/font bên thứ ba có license, đã ghi nguồn
- [ ] Có đóng góp con người (lời/hậu kỳ/sắp xếp) và lưu bằng chứng
- [ ] Mô tả có dòng khai báo AI; không có tuyên bố y khoa
- [ ] Content ID: tắt (hoặc đã whitelist kênh)
