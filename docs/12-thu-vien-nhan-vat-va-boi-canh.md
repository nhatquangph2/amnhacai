# 12 — Thư Viện Nhân Vật, Bối Cảnh & Ngôn Ngữ Điện Ảnh (Studio Asset Library)

> *"Không phải bắt đầu từ con số không cho mỗi bài hát. Một studio chuyên nghiệp sở hữu một vũ trụ thị giác nhất quán (Visual Universe), nơi mọi nhân vật, bối cảnh và bảng màu đều có linh hồn và sẵn sàng được triệu tập."*

Tài liệu này là **"Kinh Thánh Thị Giác" (Visual Bible)** dài hạn của dự án Senore, tương ứng với module code thực thi tại [`video/src/library/`](file:///Users/tranhuykhiem/Documents/amnhacai/video/src/library/). Khi bắt đầu bất kỳ bài hát mới nào (HB-005, HB-006...), đạo diễn chỉ việc chọn các Archetype và Bối cảnh từ thư viện này để ráp thành kịch bản hoàn chỉnh.

---

## 👥 PHẦN 1: HỆ THỐNG 8 HÌNH MẪU NHÂN VẬT CỐT LÕI (Character Archetypes)

Mỗi nhân vật được thiết kế để đại diện cho một tầng nghĩa triết lý sâu sắc thuộc 4 series âm nhạc của Senore:
- 🌿 `dung-day` (Động lực & kiên cường — Nhấn Ember `#D9622B`)
- 🪨 `doi-nguoi` (Chiêm nghiệm dòng thời gian — Nhấn Earth `#7A5C43`)
- 🌌 `y-nghia` (Câu hỏi lớn & tĩnh lặng — Nhấn Night Blue `#23304A`)
- 🎨 `nghe-thuat` (Sáng tạo & cái đẹp — Nhấn Moss `#6B7A4B`)

```
                      ┌─────────────────────────────────┐
                      │    ĐỨA TRẺ BÊN TRONG (4.2 đầu)   │ ◄─── Linh hồn & Hoa tiêu dẫn lối
                      │  Áo ngọc bích #2EC4B6 + Khăn đỏ  │      (Xuất hiện ở mọi series)
                      └────────────────┬────────────────┘
                                       │ (Đồng hành / Soi chiếu)
     ┌──────────────────┬──────────────┴─────┬──────────────────┐
     ▼                  ▼                    ▼                  ▼
[ NGƯỜI KIẾM TÌM ]  [ NGƯỜI VIẾT ĐÊM ]  [ BẬC TRƯỞNG THƯỢNG ] [ NGƯỜI GIEO HẠT ]
 (Seeker - 6.8 đầu)  (Writer - 6.5 đầu)   (Elder - 5.8 đầu)    (Gardener - 6.6 đầu)
 Va đập cuộc sống     Trầm tư sáng tạo     Tha thứ, cội nguồn   Bền bỉ, mọc rễ sâu
     │                  │                    │                  │
[ NGƯỜI VẼ BẢN ĐỒ]  [ NGƯỜI THỢ XÂY ]   [ NGƯỜI DỆT ÁNH SÁNG ] [ CÔ GÁI BÊN SÔNG ]
(Cartographer-6.4)  (Builder - 7.0)     (Artist - 6.2 đầu)     (Village Girl)
 Dám lạc để tìm lối   Hành động kiên gan   Biến đau thành đẹp   Tuổi thơ quê nhà
```

---

### Chi Tiết 8 Nhân Vật Cốt Lõi:

| Mã | Nhân vật | Tỷ lệ đầu | Series phù hợp | Bảng màu đặc trưng (Hex) | Vật bất ly thân | Prompt AI Blueprint (Midjourney / ComfyUI) |
|---|---|:---:|---|---|---|---|
| **`seeker`** | **Người Kiếm Tìm** | `6.8` | `dung-day`, `doi-nguoi` | Áo xanh `#2A4B6E` · Len `#EFE8DC` · Than `#2B2D42` | Măng-tô xanh thẫm, giày da mòn gót | `Vietnamese contemplative 30yo man, slender, slate blue wool coat #2A4B6E, cream turtleneck, worn leather boots` |
| **`innerChild`** | **Đứa Trẻ Bên Trong** | `4.2` | *Tất cả các series* | Xanh ngọc `#2EC4B6` · Đỏ `#D9622B` · Vàng `#E9C46A` | Khăn len Ember đỏ bay trong gió | `spirited 8yo Vietnamese child, bright joyful eyes, turquoise sweater #2EC4B6, flying ember red scarf #D9622B` |
| **`writer`** | **Người Viết Đêm** | `6.5` | `y-nghia` | Đêm sâu `#23304A` · Mực `#1E1E1E` · Lửa `#D9622B` | Bút máy kim loại, kính tròn, sổ da | `quiet Vietnamese writer, round spectacles, midnight blue cardigan #23304A, holding fountain pen, candle glow` |
| **`elder`** | **Bậc Trưởng Thượng**| `5.8` | `doi-nguoi` | Chàm bạc `#5C4A3A` · Khói `#A68A72` · Tóc trắng | Nón lá, áo bà ba chàm, khăn rằn mộc | `venerable elderly Vietnamese grandmother, gentle wrinkles, white hair, faded indigo linen tunic #5C4A3A` |
| **`gardener`** | **Người Gieo Hạt** | `6.6` | `dung-day`, `nghe-thuat`| Đất ấm `#7A5C43` · Rêu `#6B7A4B` · Bùn `#473C35` | Bình tưới đồng, túi hạt giống | `humble Vietnamese gardener, earth canvas shirt #7A5C43, kneeling on soil, touching green sprout with moss scarf` |
| **`cartographer`**| **Người Mở Đường** | `6.4` | `nghe-thuat`, `dung-day`| Vàng hổ phách `#E9C46A` · Xanh chì `#4A5568` | La bàn đồng, ống đựng bản đồ | `adventurous young Vietnamese cartographer girl, mustard field jacket #E9C46A, brass compass, leather bag` |
| **`builder`** | **Người Dựng Xây** | `7.0` | `dung-day` | Đỏ gỉ `#9C4124` · Ember `#D9622B` · Thép tối | Dải khăn đỏ buộc cổ tay, búa gỗ | `strong Vietnamese builder, rust red heavy-duty vest #9C4124, crimson wristband, rugged hands, wooden beam` |
| **`artist`** | **Người Dệt Ánh Sáng**| `6.2` | `nghe-thuat` | Rêu biếc `#6B7A4B` · Tím `#9D4EDD` · Giấy cũ | Lăng kính màu, cọ vẽ, bảng pha màu | `poetic Vietnamese girl artist, moss green linen dress #6B7A4B, glass prism catching rainbow light rays, dreamy smile` |

---

## 🏞️ PHẦN 2: THƯ VIỆN 7 BỐI CẢNH ĐIỆN ẢNH CHUẨN (Cinematic Environments)

Mỗi bối cảnh đã được cấu hình sẵn bảng màu Color Script, kiểu nguồn sáng (Lighting Quality), góc máy đề xuất và âm thanh môi trường (SFX Ambience):

### 1. Bến Sông & Cầu Đá Cổ (`stonePier`)
*   *Ẩn dụ:* Nơi dừng chân, đối diện dòng đời, điểm hẹn và chia tay.
*   *Màu chủ đạo:* `#8EA8C3` (Xanh sông sớm) · `#4A5866` (Đá xám) · `#7A5C43` (Gỗ mộc) · `#FAF6EE` (Buồm trắng).
*   *Ánh sáng:* `5000K` sương sớm khuếch tán.
*   *Foley SFX:* Tiếng sóng vỗ mạn thuyền gỗ bì bõm, tiếng bước chân gõ trên mặt cầu đá, tiếng lau sậy xào xạc.

### 2. Đồi Gió Đơn Độc & Cây Đại Thụ (`solitaryHill`)
*   *Ẩn dụ:* Biểu tượng bài *Sau Mùa Giông*: bão không quật ngã, bão lay rễ sâu.
*   *Màu chủ đạo:* `#23304A` (Mây đen) · `#6B7A4B` (Tán lá) · `#7A5C43` (Thân cây) · `#D9622B` (Lá đỏ chao liệng).
*   *Ánh sáng:* `7500K` sấm chớp giật cục (Strobe Lightning).
*   *Foley SFX:* Tiếng gió hú từng cơn rít qua cành cây, tiếng sấm rền từ xa, hạt mưa quất xối xả.

### 3. Thị Trấn Bánh Răng & Phố Mưa (`clockworkTown`)
*   *Ẩn dụ:* Guồng quay bất tận của thời gian, sự cuống cuồng mưu sinh và nỗi cô đơn thành thị.
*   *Màu chủ đạo:* `#B8C5D0` (Sương phố) · `#3A3A3C` (Ngói đá) · `#C77DFF` (Bánh răng tím ảo) · `#212930` (Dòng người tối).
*   *Ánh sáng:* `6500K` xám lạnh đô thị, bóng nước loang loáng.
*   *Foley SFX:* Tiếng kim đồng hồ cơ tích tắc khô khốc, chuông nhà thờ ngân dài, tiếng mưa rơi trên ô dù.

### 4. Hồ Ký Ức Đen & Rừng Thông Đêm (`mirrorLake`)
*   *Ẩn dụ:* Tầng sâu vô thức, soi chiếu tổn thương, thanh tẩy tâm hồn bằng giọt nước mắt.
*   *Màu chủ đạo:* `#0B132B` (Đáy hồ đen tuyền) · `#06D6A0` (Sóng ngọc bích phát quang) · `#1C2541` (Rừng thông đêm).
*   *Ánh sáng:* `2400K` phát quang sinh học (Bioluminescence).
*   *Foley SFX:* Khoảng lặng tuyệt đối (Absolute Silence), tiếng giọt nước tí tách rơi vang vọng, tiếng thông reo.

### 5. Ngôi Làng Ven Suối & Bếp Lửa Quê (`riversideHearth`)
*   *Ẩn dụ:* Hạnh phúc giản đơn, cội nguồn bình yên mà con người mải miết đi xa mới nhận ra.
*   *Màu chủ đạo:* `#FAF0CA` (Bát cơm trắng) · `#DDA15E` (Mái rạ vàng) · `#BC6C25` (Khói bếp) · `#7A5C43` (Vách gỗ).
*   *Ánh sáng:* `2400K` bếp lửa ấm áp, khói lam chiều bảng lảng.
*   *Foley SFX:* Tiếng suối reo róc rách, tiếng củi nổ lách tách, tiếng trẻ con cười đùa từ xa.

### 6. Căn Phòng Gác Mái & Bàn Viết Đêm (`writersAttic`)
*   *Ẩn dụ:* Không gian thai nghén nghệ thuật, nơi chuyển hóa nỗi buồn thành câu hát để đời.
*   *Màu chủ đạo:* `#23304A` (Trời đêm ngoài cửa) · `#1E1E1E` (Mực tàu) · `#EFE8DC` (Giấy cũ) · `#D9622B` (Ngọn nến nhỏ).
*   *Ánh sáng:* `2200K` ánh nến bập bùng, bóng đổ dài trên tường gỗ.
*   *Foley SFX:* Tiếng ngòi bút máy sột soạt trên giấy ráp, tiếng mưa gõ trên mái kính, tiếng thở dài nhẹ nhõm.

### 7. Khu Vườn Hoang Phế Được Hồi Sinh (`restoredGarden`)
*   *Ẩn dụ:* Biểu tượng bài *Hẹn Ngày Nở Hoa*: Sự chung tay gắn kết đánh thức sự sống diệu kỳ.
*   *Màu chủ đạo:* `#E9C46A` (Nắng vàng) · `#2EC4B6` (Chồi non) · `#9D4EDD` (Kính màu lấp lánh) · `#D9622B` (Nụ hoa bừng nở).
*   *Ánh sáng:* `3200K` cầu vồng khúc xạ qua lăng kính.
*   *Foley SFX:* Tiếng chim hót líu lo sau mưa, tiếng chuông gió kính màu leng keng, đại hòa tấu giao hưởng.

---

## 🎨 PHẦN 3: BỘ PRESET COLOR SCRIPT & ÁNH SÁNG CẢM XÚC

Khi lập Color Script cho bất kỳ bài hát mới nào, chỉ cần chọn kết hợp từ 6 Preset chuẩn này:

```
[ THANG NHIỆT ĐỘ MÀU & CẢM XÚC CHUẨN SENORE ]

8000K  │ ⛈️ STORM_RESOLVE      │ Xanh chàm bão & Chớp neon      │ Giằng xé, nguy nan, kiên cường
6500K  │ 🌫️ MIST_SOLITUDE      │ Xám chì & Xanh thép mờ         │ Lạc lõng, ngột ngạt, vô định
5000K  │ 🌤️ RIVER_DAWN         │ Sương mờ sông & Ánh ban mai     │ Nhen nhóm hy vọng, đón nhận
3500K  │ ☀️ GOLDEN_WONDER      │ Vàng mật ong & Xanh ngọc        │ Thức tỉnh, hồn nhiên, diệu kỳ
2800K  │ 🌅 SUNSET_LIBERATION  │ Cam đất nung & Tím hoàng hôn    │ Thanh thản, hòa giải, bước tiếp
2200K  │ 🔥 HEARTH_WARMTH      │ Nâu đất, Vàng rơm & Ánh lửa     │ An yên, cội nguồn, thương yêu
```

---

## 🎬 PHẦN 4: THƯ VIỆN NGÔN NGỮ ĐIỆN ẢNH & MATCH-CUT CỦA SENORE

Để các MV mang hơi thở điện ảnh thực thụ và không bị biến thành video slide ảnh trôi nổi, dự án quy chuẩn các mẫu chuyển cảnh Match-Cut và nhịp máy quay:

### 1. Bốn Quy Tắc Match-Cut "Chữ Ký" (Signature Match-Cuts):
1.  **Chuyển động vòng tròn (Rotational Match-Cut):**
    *   *Kim đồng hồ cơ giật nấc* $\rightarrow$ *Kim tháp chuông lớn* $\rightarrow$ *Bánh xe đạp người thợ* $\rightarrow$ *Vòng gỗ tuổi đời của cây*.
2.  **Giọt rơi buông bỏ (Falling Element Match-Cut):**
    *   *Giọt nước mắt rơi xuống hồ ký ức* $\rightarrow$ *Giọt mưa đầu mùa trên đồi gió* $\rightarrow$ *Chiếc lá phong đỏ chao liệng* $\rightarrow$ *Mái chèo rơi vào làn nước*.
3.  **Điểm sáng hy vọng (Luminous Match-Cut):**
    *   *Ngọn nến nhỏ phòng gác mái* $\rightarrow$ *Con đom đóm bờ suối* $\rightarrow$ *Mảnh kính màu bắt nắng* $\rightarrow$ *Ánh mắt sáng bừng của đứa trẻ*.
4.  **Bàn tay tiếp sức (Hand Connection Match-Cut):**
    *   *Bàn tay đứa trẻ kéo người lớn xuống thuyền* $\rightarrow$ *Bàn tay người chăm cây nâng mầm non* $\rightarrow$ *Năm bàn tay cùng nắm chặt thanh xà gỗ*.

### 2. Quy Chuẩn Động Lực Học Máy Quay (Camera Physics):
*   **Có trọng lượng, không bay giật:** Mọi chuyển động máy quay dùng thuật toán nội suy làm mượt (`cubic-bezier` hoặc `easeInOutCubic`).
*   **Quy tắc tiêu cự nông (Shallow Depth of Field):** Xóa phông tiền cảnh và hậu cảnh (Bokeh mềm mại) khi thể hiện nội tâm nhân vật; chuyển nét mượt mà (Rack Focus) từ vật thể gần sang vật thể xa.
*   **Quy tắc mắt nhìn (Eye Trace Continuity):** Điểm chú ý của khán giả ở khung hình trước phải trùng khớp với điểm bắt đầu của khung hình kế tiếp, tránh hiện tượng mắt phải nhảy từ góc này sang góc đối diện gây mỏi mệt.

---

## 💻 PHẦN 5: CÁCH TRIỆU TẬP THƯ VIỆN TRONG CODE REMOTION

Toàn bộ thư viện đã được xuất khẩu sẵn tại `video/src/library/`. Trong bất kỳ file style Remotion nào, bạn có thể gọi ra dùng ngay lập tức:

```typescript
import {
  CHARACTER_ARCHETYPES,
  ENVIRONMENT_SETTINGS,
  COLOR_PRESETS,
} from "../library";

// 1. Lấy thông số nhân vật
const seeker = CHARACTER_ARCHETYPES.seeker;
const innerChild = CHARACTER_ARCHETYPES.innerChild;

// 2. Lấy bối cảnh và màu sắc
const riverSetting = ENVIRONMENT_SETTINGS.stonePier;
const stormColor = COLOR_PRESETS.STORM_RESOLVE.palette;

// 3. Sử dụng tỷ lệ và màu sắc chuẩn trong SVG / Canvas
console.log(seeker.headRatio); // 6.8
console.log(innerChild.palette.accent); // "#D9622B" (Ember Red)
```

Bằng việc xây dựng một hệ thống thư viện lớn và hoàn chỉnh như trên, dự án Senore từ nay đã sở hữu **kho tài nguyên chuẩn mực trường tồn**, sẵn sàng sản xuất hàng chục MV chất lượng cao trong tương lai với tốc độ nhanh gấp 3 lần mà vẫn đảm bảo tính nhất quán nghệ thuật đỉnh cao!
