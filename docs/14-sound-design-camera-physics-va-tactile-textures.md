# 14. TIÊU CHUẨN THIẾT KẾ ÂM THANH FOLEY, ĐỘNG LỰC HỌC CAMERA & CHẤT LIỆU VẬT LÝ THỦ CÔNG
> **Tài liệu Kỹ thuật Studio Senore — Phiên bản 1.0 (2026)**  
> *Định hướng: Cinematic Papercraft, Gouache Dreamscape & Linocut (Nghệ thuật cắt giấy, sơn bột màu & khắc gỗ điện ảnh)*

---

## 1. TRIẾT LÝ NGHỆ THUẬT: ĐỐI NGHỊCH VỚI "SỰ HOÀN HẢO VÔ HỒN" CỦA MÁY TÍNH

Trong kỷ nguyên của video số và hình ảnh AI, nhược điểm chí mạng khiến khán giả dễ chán là **"sự trơn láng vô hồn"**:
* Hình ảnh phẳng lỳ như nhựa ép, các chuyển động zoom/xoay máy quay nhanh bất thường, không trọng lực.
* Video chỉ có tiếng nhạc nền phát đơn điệu từ đầu đến cuối mà thiếu đi **"không gian vật lý"** của đời thực.

Hệ thống sản xuất của Studio Senore giải quyết triệt để vấn đề này qua 3 trụ cột kỹ thuật:
1. **Chất liệu vật lý xúc giác (Tactile Textures)**: Sợi xơ giấy dó, thớ vải canvas, vệt loang bột màu gouache, nét khắc mộc bản linocut.
2. **Động lực học camera thực tế (Cinematic Physics)**: Ray trượt dolly có khối lượng quán tính, xóa phông quang học (Shallow DOF) và chuyển tiêu cự (Rack Focus).
3. **Thiết kế âm thanh đời sống (Sound Design & Foley Ducking)**: Không gian âm thanh sống động với tiếng tích tắc đồng hồ, nước vỗ mạn thuyền, mưa rơi, gió hú và bộ điều phối âm lượng thông minh tự động né giọng hát (Audio Ducking).

---

## 2. BỘ TRÌNH CHIẾU CHẤT LIỆU VẬT LÝ (`video/src/library/shaders.tsx`)

Mỗi MV hoạt hình của Senore được phủ các lớp shader chất liệu thực nghiệm (Texture Overlays):

| Tên Shader | Kỹ thuật Đồ họa Vector / Filter | Cảm giác Thị giác Mang lại | Áp dụng Tiêu chuẩn |
| :--- | :--- | :--- | :--- |
| **`DoPaperFiberOverlay`** | SVG vector sợi xơ tự nhiên ngẫu nhiên, viền cong `Q`, màu nâu xám vỏ cây (`#8C7A6B`) | Tái hiện sợi vỏ cây dó truyền thống Việt Nam, tạo bề mặt giấy thủ công độc bản. | MV Papercraft, Hồi ức, Đoạn kết |
| **`PaperTextureOverlay`** | `feTurbulence` (fractalNoise 0.04) + `feDiffuseLighting` góc nghiêng sáng $45^\circ / 60^\circ$ | Nếp gấp, độ ráp sần và độ phồng nhẹ của trang giấy thô khi bắt ánh sáng. | Toàn bộ các cảnh kiểu `anim` |
| **`CanvasWeaveOverlay`** | Pattern chữ thập hạt vuông $6\times 6$px (`warp & weft` vải toan) | Cảm giác tranh sơn dầu / acrylic vẽ trên toan vải bố mỹ thuật. | Cảnh phong cảnh, triển lãm, phòng vẽ |
| **`WatercolorBleedOverlay`**| `feDisplacementMap` + `feMorphology` tụ sắc tố ở mép | Vệt loang màu nước ẩm ướt, mép màu sậm hơn lòng vệt (pigment pooling). | Cảnh sông nước, giọt lệ, mưa rơi |
| **`LinocutInkOverlay`** | `feTurbulence` sọc ngang + độ loang mực in mộc bản | Vết khắc dao tỉa và viền mực thấm không đều của tranh khắc gỗ dân gian. | Tiêu đề, phân cảnh bão giông, ký ức đen trắng |
| **`FilmGrainOverlay`** | `feTurbulence` hạt mịn 0.75, đổi seed liên tục theo frame | Nhịp thở phim nhựa 35mm hữu cơ, xóa bỏ cảm giác tĩnh chết của ảnh số. | Lớp phủ toàn khung |
| **`CinemaScopeBars`** | Dải đen trên dưới chuẩn 2.39:1 kèm góc quang học (Corner Ticks) | Bố cục màn ảnh rộng điện ảnh kinh điển. | Toàn bộ MV 16:9 |

---

## 3. QUY TẮC CAMERA ĐIỆN ẢNH THỰC TẾ (`video/src/library/cinematographyPhysics.tsx`)

### 3.1. Máy quay vật lý (`PhysicalCamera`)
* **Khối lượng máy & Quán tính**: Máy quay không được đổi hướng tức thời. Mọi chuyển động Pan/Tilt đều có gia tốc đầu (Ease-in) và trượt theo quán tính (Inertia Damping) như máy quay cơ gắn trên ray trượt dolly nặng 150kg.
* **Độ thở hữu cơ (Organic Breathing Sway)**: Người điều khiển máy luôn có nhịp thở vi mô. Thành phần `PhysicalCamera` tạo độ rung lắc siêu chậm ($0.18$Hz, biên độ $\pm 2$px) và độ thở tiêu cự (Lens Breathing $0.05\%$) tạo cảm giác chân thực.

### 3.2. Chuyển tiêu cự quang học (`RackFocusLayer` & Shallow DOF)
Trong quang học điện ảnh, khẩu độ mở lớn ($f/1.4 - f/2.0$) tạo ra trường ảnh rất nông:
* **Mặt phẳng 0 (Tiền cảnh - Foreground)**: Vệt mạn thuyền, nhánh cây ven đường -> nhòe quang học (`blur: 6–8px`).
* **Mặt phẳng 1 (Chủ thể - Subject)**: Đứa trẻ áo xanh ngọc, chiếc thuyền buồm -> nét căng (`blur: 0px`).
* **Mặt phẳng 2 (Hậu cảnh - Background)**: Dãy nhà phố, rặng núi xa -> mờ dịu (`blur: 3–5px`).
* **Kỹ thuật Rack Focus (Kéo nét)**: Khi câu chuyện chuyển sự chú ý từ nhân vật sang một sự kiện phía sau (hoặc ngược lại), tiêu cự dịch chuyển mềm mại trong vòng $1.2$–$1.8$s.

---

## 4. BỘ THIẾT KẾ ÂM THANH FOLEY & SMART AUDIO DUCKING

### 4.1. Thư viện Foley Tự nhiên (`video/public/foley/`)
Được tạo bởi bộ tạo âm học vật lý `scripts/generate_foley.py`:
1. `clock_tick.wav`: Tiếng tích... tắc... hộp gỗ quả lắc cơ khí (bến sông lúc tinh sương).
2. `water_lap.wav`: Tiếng nước sông vỗ bì bõm vào mạn thuyền gỗ theo chu kỳ sóng dập dềnh.
3. `wind_howl.wav`: Tiếng gió rít lạnh buốt và tiếng rền hạ âm của thác lũ.
4. `rain_roof.wav`: Tiếng mưa rào rơi tí tách trên mái ngói và mái hiên.
5. `page_turn.wav`: Tiếng sột soạt lật trang sổ tay vẽ phác thảo.
6. `gentle_sigh.wav`: Tiếng thở dài nhẹ thanh thản trước khi ca từ mở đầu cất lên.

### 4.2. Bộ hòa âm thông minh (`FoleyMixer.tsx`) & Audio Ducking
* **Cơ chế hoạt động**:
  * Khi bài hát ở đoạn dạo đầu (Intro), gian tấu (Interlude) hoặc dạo kết (Outro): Âm thanh môi trường phát ở mức đầy đủ (**50% – 65%** âm lượng), tạo một không gian sống chân thực.
  * Khi ca sĩ chuẩn bị cất lời: Hệ thống bắt đầu fade-down âm lượng môi trường trước $0.45$s theo hàm $S$-curve (`smoothstep`).
  * Trong suốt câu hát (Verse / Chorus): Âm thanh môi trường chỉ còn **10% – 12%**, đủ để người nghe vẫn cảm nhận được dòng sông bên dưới mà hoàn toàn không tranh chấp với giọng hát chính.
  * Khi câu hát kết thúc: Âm thanh môi trường lại tự động nở lên êm ái.

---

## 5. HƯỚNG DẪN CẤU HÌNH TRONG SONG JSON

Trong bất kỳ bài hát nào thuộc `video/src/songs/HB-xxx.json`:

```json
{
  "id": "HB-004",
  "title": "Dòng chảy cuộc sống",
  "style": "anim",
  "foley": [
    {
      "id": "clock",
      "src": "foley/clock_tick.wav",
      "start": 0,
      "end": 22,
      "loop": true,
      "baseVolume": 0.65,
      "duckVolume": 0.15
    },
    {
      "id": "water",
      "src": "foley/water_lap.wav",
      "start": 15,
      "end": 207,
      "loop": true,
      "baseVolume": 0.50,
      "duckVolume": 0.12
    },
    {
      "id": "wind",
      "src": "foley/wind_howl.wav",
      "start": 115,
      "end": 145,
      "loop": true,
      "baseVolume": 0.60,
      "duckVolume": 0.18
    }
  ]
}
```

Hệ thống Remotion sẽ tự động nạp các rãnh âm thanh này, đồng bộ thời gian và xử lý ducking theo mili-giây mà không cần can thiệp thủ công ở phần mềm dựng ngoài.
