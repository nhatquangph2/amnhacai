# 02 — Nhận diện thương hiệu

## 1. Ý tưởng cốt lõi

**"Chiếc hộp"** là biểu tượng trung tâm: mỗi video/bài hát là một chiếc hộp nhỏ chứa một khoảnh khắc bình yên.
Mọi hình ảnh nên có dấu ấn "hộp": khung cửa sổ, căn phòng nhỏ, hộp nhạc, hộp quà ánh sáng, chiếc đèn lồng.

## 2. Logo

- Biểu tượng: chiếc hộp đang hé mở, ánh sáng ấm (hoặc nốt nhạc / chiếc lá) bay ra.
- Phong cách: tối giản, nét mảnh, bo góc mềm. Đọc rõ ở kích thước avatar 98×98px.
- Phiên bản cần có: `logo-full` (biểu tượng + chữ), `logo-icon` (chỉ biểu tượng), bản sáng / bản tối, PNG nền trong suốt + SVG.
- Lưu tại `brand/logo/`.

## 3. Bảng màu

| Vai trò | Màu | HEX | Dùng cho |
|---|---|---|---|
| Chủ đạo | Kem ấm (Warm Cream) | `#F5EDE0` | Nền, chữ trên nền tối |
| Nhấn | Nâu gỗ (Wood Brown) | `#8B6B4F` | Logo, chữ tiêu đề |
| Dịu | Xanh sương (Mist Sage) | `#A8B5A2` | Series thiền, sáng |
| Đêm | Xanh đêm (Night Indigo) | `#2B3150` | Series ngủ, mưa đêm |
| Ánh sáng | Vàng đèn (Lamp Gold) | `#E8B96A` | Điểm nhấn, ánh đèn |

Mỗi series dùng **một màu chủ đạo riêng** trên thumbnail để khán giả nhận ra ngay:
`rain-piano` → Night Indigo • `lofi-study` → Lamp Gold • `deep-sleep` → Indigo đậm • `morning-calm` → Cream • `zen-meditation` → Mist Sage.

## 4. Typography

- Tiêu đề thumbnail: font có dấu tiếng Việt tốt, mềm mại — gợi ý **Be Vietnam Pro**, **Quicksand**, **Lora** (serif, cho cảm giác thơ).
- Chữ phụ/mô tả: **Be Vietnam Pro** hoặc **Inter**.
- Tất cả đều là font miễn phí trên Google Fonts (dùng thương mại được). Lưu tại `brand/fonts/`.

## 5. Phong cách hình ảnh (Visual direction)

- Tranh minh họa phong cách anime/Ghibli-inspired **nhưng không sao chép nhân vật/tác phẩm có bản quyền**.
- Bối cảnh Việt: phố cổ Hội An mưa, gác nhỏ Hà Nội, đồi thông Đà Lạt, ruộng lúa sớm, bàn học cạnh cửa sổ.
- Ánh sáng ấm, độ bão hòa thấp, nhiều khoảng thở.
- Video: ảnh tĩnh + chuyển động nhẹ (mưa rơi, khói trà, rèm bay, đèn nhấp nháy) loop 10–30 giây.
- **Nhân vật mascot (tùy chọn):** một cô/cậu bé + chú mèo — xuất hiện xuyên suốt để tạo nhận diện (giống "lofi girl").

## 6. Thumbnail — quy tắc

1. Hình chiếm ≥ 80%, chữ ≤ 4–5 từ.
2. Chữ lớn, tương phản cao, không đặt ở góc dưới phải (bị che bởi thời lượng video).
3. Logo nhỏ cố định ở một góc — nhất quán mọi video.
4. Mỗi series một layout cố định → mở `brand/visuals/` để lưu template (Canva/Photoshop/Figma).

## 7. Giọng văn (Tone of voice)

- Nhẹ nhàng, ấm áp, như một người bạn thì thầm. Không giật tít, không hứa hẹn quá đà.
- ✅ "Mưa rơi ngoài hiên, pha một tách trà và để piano ru bạn chậm lại 🌧️"
- ❌ "NHẠC CHỮA KHỎI MẤT NGỦ 100% NGHE LÀ NGỦ NGAY!!!"
- **Không** đưa ra tuyên bố y khoa (chữa bệnh, chữa trầm cảm, "tần số chữa lành DNA"...). Dùng từ "thư giãn", "dễ ngủ hơn", "giảm căng thẳng".

## 8. Mẫu "Giới thiệu kênh" (About)

**Tiếng Việt**
> Healing Box — chiếc hộp nhỏ chứa những giai điệu bình yên. 🎧
> Nhạc piano, lofi, ambient giúp bạn thư giãn, học tập, làm việc và ngủ ngon hơn.
> Video mới mỗi Thứ 3 – Thứ 5 – Chủ nhật.
> 🎵 Âm nhạc được sáng tác với sự hỗ trợ của công cụ AI, được tuyển chọn và hoàn thiện thủ công bởi Healing Box.
> 📩 Liên hệ hợp tác / license nhạc: healingbox.music@gmail.com

**English**
> Healing Box — a little box of peaceful melodies. 🎧
> Piano, lofi and ambient music to relax, study, work and sleep better.
> New videos every Tue – Thu – Sun.
> 🎵 Music created with the help of AI tools, curated and finished by hand at Healing Box.
> 📩 Business / licensing: healingbox.music@gmail.com
