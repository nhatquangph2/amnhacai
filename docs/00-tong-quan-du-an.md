# 00 — Tổng quan dự án

## 1. Tầm nhìn & Sứ mệnh

- **Tầm nhìn:** Trở thành một "người kể chuyện bằng âm nhạc" mà người trẻ Việt tìm đến khi cần
  một câu hát để đứng dậy, để nghĩ sâu hơn, hoặc để thấy mình không cô đơn.
- **Sứ mệnh:** Viết những bài hát **có lời thật sự đáng nghe** — về cuộc sống, nghệ thuật, ý nghĩa và động lực —
  và dùng AI như một ban nhạc, một phòng thu, để đưa những lời đó đến người nghe nhanh hơn.
- **Tuyên ngôn:** *Lời là linh hồn. AI là nhạc cụ.*

## 2. Định vị

| Tiêu chí | Senore |
|---|---|
| Loại hình | **Dự án nghệ sĩ – nhạc sĩ (singer-songwriter)**, không phải kênh nhạc nền |
| Cốt lõi | **Lời tiếng Việt do tác giả tự viết**: giàu hình ảnh, có chiều sâu, có thể là thơ (lục bát, tự do) hoặc rap/spoken word |
| Thể loại nhạc | Ballad, indie/folk, pop rock, cinematic, rap/spoken word — linh hoạt theo bài, nhưng giữ **một "chất giọng" nhận diện** |
| Khác biệt | Hầu hết kênh nhạc AI làm nhạc nền không lời hoặc lời do AI viết. Ở đây **lời là của con người** — đây vừa là giá trị nghệ thuật, vừa là lợi thế pháp lý & chính sách (xem `05`) |
| Minh bạch | Công khai: "Lời: [tác giả]. Nhạc & giọng hát: tạo với hỗ trợ của AI" |

### Chữ ký sáng tác (từ 2 bài đầu)
Hai bài đầu đã cho thấy một phong cách rõ ràng — hãy giữ nó làm **bản sắc**:
- **Ẩn dụ thiên nhiên – vật thể** để nói về con người: cây/rễ/giông (Sau Mùa Giông), đá/dòng sông (Tảng Đá).
- **Hành trình biến đổi:** từ tổn thương → bền bỉ → hiểu ra điều gì đó.
- **Câu kết lật nghĩa:** *"Bão không quật ngã — bão lay… rễ sâu"*, *"Tôi là tác phẩm mang dáng hình không cần chứng minh"*.

## 3. Khán giả mục tiêu

| Persona | Mô tả | Họ cần gì từ bài hát | Nơi tìm thấy họ |
|---|---|---|---|
| **Khoa — Người trẻ đang vật lộn** (20–28) | Mới đi làm/thất nghiệp, áp lực, hay tự hỏi "mình đang làm gì với đời mình" | Một câu hát để đứng dậy, cảm giác được thấu hiểu | TikTok, YouTube, Spotify |
| **Vy — Sinh viên nghĩ nhiều** (18–23) | Thích đọc sách, triết lý, viết nhật ký | Lời sâu, có thể trích làm caption, suy ngẫm | TikTok, Threads, Instagram |
| **Anh Tuấn — Người đi qua giông bão** (28–40) | Từng thất bại, đang làm lại | Sự đồng cảm, động lực trưởng thành, không sáo rỗng | YouTube, Facebook |
| **Người làm sáng tạo** (20–35) | Họa sĩ, nhà văn, nhạc sĩ, designer | Bài hát về hành trình sáng tạo, sự cô độc của người làm nghệ thuật | Instagram, Spotify |

## 4. Bốn chủ đề chính (Content Pillars)

Mỗi chủ đề có "bible" riêng trong `prompts/` (phong cách nhạc, prompt, hình ảnh, gợi ý đề tài).

| Mã | Chủ đề | Nội dung | Bài hiện có |
|---|---|---|---|
| `dung-day` | 🔥 **Đứng Dậy** — động lực & kiên cường | Vượt khó, thất bại, bắt đầu lại, bền bỉ | Sau Mùa Giông |
| `doi-nguoi` | 🌊 **Đời Người** — bài học cuộc sống | Thời gian, trưởng thành, gia đình, cô đơn, được tìm thấy | Tảng Đá |
| `y-nghia` | 🌌 **Câu Hỏi Lớn** — ý nghĩa & triết lý | Sống để làm gì, hạnh phúc, tự do, cái chết, bản ngã | — |
| `nghe-thuat` | 🎨 **Người Sáng Tạo** — nghệ thuật | Hành trình sáng tạo, người nghệ sĩ, cái đẹp, sự cô độc của người làm nghề | — |

**Định dạng đặc biệt** (dùng chung cho mọi chủ đề):
- **Thơ phổ nhạc** — bạn viết thơ trước, rồi phổ nhạc bằng AI.
- **Rap / Spoken word** — phần lời dài, kể chuyện, như đoạn rap trong "Tảng Đá".
- **Phiên bản khác** — acoustic / piano của bài đã có (giới hạn, không đăng tràn lan).

## 5. Mục tiêu 12 tháng

| Chỉ số | Tháng 3 | Tháng 6 | Tháng 12 |
|---|---|---|---|
| Số bài đã phát hành | 4–6 | 15–20 | 40–50 |
| Spotify monthly listeners | 300 | 3.000 | 15.000 |
| Subscribers YouTube | 300 | 2.000 | 10.000 |
| TikTok: lượt dùng sound của kênh | 50 | 1.000 | 10.000 |
| Doanh thu/tháng | 0 | Bắt đầu có | ≥ chi phí vận hành + có lãi |

> Nhạc có lời phát triển **chậm hơn nhưng bền hơn** nhạc nền: một bài "chạm" được người nghe có thể sống nhiều năm.
> Chỉ số quan trọng nhất không phải view mà là **lưu bài (save), chia sẻ, và bình luận trích lời**.

## 6. Vai trò (đội 1 người)

| Vai trò | Việc chính | Thời gian/tuần |
|---|---|---|
| **Người viết lời** ⭐ | Viết, sửa lời — phần giá trị nhất, không giao cho AI | 4–6h |
| Music Director | Viết prompt, tạo bản nhạc, chọn bản hay nhất | 3–4h |
| Producer | Hậu kỳ, master | 2h |
| Visual | Lyric video, ảnh bìa, Shorts | 4–5h |
| Channel Manager | Upload, SEO, tương tác | 2–3h |

**Tổng: ~15–20h/tuần.** Khi có doanh thu, thuê ngoài phần Visual (lyric video) trước để bạn dành thời gian cho lời.
