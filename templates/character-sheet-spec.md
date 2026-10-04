# 📋 Template: Bảng Khóa Nhân Vật Chuẩn Studio (Character Model Kit)

> Dùng template này để thiết lập hồ sơ khóa nhân vật cho mỗi bài hát mới trước khi tạo hình ảnh / render video.  
> Lưu tại: `releases/HB-xxx_ten-bai/CHARACTER_SHEET.md`

---

## 1. Thông Tin Nhận Diện Nhân Vật (Identity Profile)

*   **Tên nhân vật / Biệt danh:** [Ví dụ: Người Trưởng Thành (The Seeker) / Đứa Trẻ Bên Trong (Inner Child)]
*   **Vai trò trong bài hát:** [Nhân vật chính / Đồng hành / Biểu tượng tương phản]
*   **Độ tuổi cảm nhận:** [Ví dụ: 28 – 32 tuổi / 7 – 9 tuổi]
*   **Tính cách & Trạng thái nội tâm:** [Ví dụ: Mỏi mệt, trĩu nặng âu lo, khao khát bình an]
*   **Vật bất ly thân / Chi tiết nhận diện:** [Ví dụ: Khăn quàng màu Ember, cuốn sổ tay bọc da, bình tưới nước]

---

## 2. Thông Số Hình Thể & Thước Gióng Tỷ Lệ (Anatomy & Proportions)

*   **Tỷ lệ đầu (Head Count):** [Ví dụ: 6.8 đầu cho người lớn, 4.2 đầu cho trẻ em]
*   **Dáng người (Silhouette / Build):** [Ví dụ: Gầy cao, vai hơi chùng vì mệt mỏi, bước chân chậm rãi]
*   **Tỷ lệ tương quan (Scale Relation):** [Ví dụ: Chiều cao bằng 100% người lớn / Đỉnh đầu ngang thắt lưng người lớn (60%)]
*   **Thước gióng 6 điểm ngang (Guide lines):**
    1.  *Đỉnh đầu:* 100%
    2.  *Đường mắt:* 92%
    3.  *Đường vai:* 82%
    4.  *Đường thắt lưng / Hông:* 55%
    5.  *Đầu gối:* 28%
    6.  *Gót chân:* 0%

---

## 3. Khóa Màu Trang Phục & Chất Liệu (Costume & Material Specs)

> Toàn bộ màu sắc dùng mã HEX phẳng (Flat Color), không dùng màu đã qua bóng đổ phức tạp để làm mẫu chuẩn.

| Bộ phận | Mô tả chi tiết | Base Color (HEX) | Shadow Tone (HEX) | Highlight Tone (HEX) | Chất liệu vật lý |
|---|---|:---:|:---:|:---:|---|
| **Khuôn mặt & Da** | Tông da tự nhiên, hơi sạm nắng | `#F4D0B4` | `#D9A584` | `#FFF1E6` | Da mộc, không trang điểm |
| **Mái tóc** | Tóc đen hơi rối, xơ nhẹ | `#1F1D20` | `#111012` | `#3A363E` | Tóc tự nhiên không vuốt keo |
| **Áo ngoài** | Áo khoác dài qua hông, cổ cao | `#2A4B6E` | `#1B324A` | `#416791` | Vải dạ thô / cotton dày |
| **Áo trong** | Áo len cổ lọ dệt kim | `#EFE8DC` | `#D1C7B7` | `#FAF6F0` | Len mộc màu giấy cũ |
| **Quần** | Quần suông ống thẳng | `#2B2D42` | `#1C1D2B` | `#434661` | Vải kaki than tối |
| **Giày / Ủng** | Giày da buộc dây mòn đế | `#4A3525` | `#2F2217` | `#6B4D36` | Da sáp nâu đã qua thời gian |
| **Vật nhận diện** | Khăn len quàng cổ Senore Ember | `#D9622B` | `#A84517` | `#E87A47` | Len thô màu lửa ấm |

---

## 4. Ma Trận Biểu Cảm Cốt Lõi (Expression Matrix)

| Biểu cảm | Cơ mặt & Ánh mắt | Dùng trong phân cảnh |
|---|---|---|
| **Trung tính (Neutral)** | Môi khép nhẹ, ánh mắt nhìn thẳng tĩnh lặng, không cười | Cảnh mở đầu, thiết lập bối cảnh |
| **Trĩu nặng (Melancholy)** | Lông mày hơi nhíu, mí mắt trĩu, khóe môi buông lơi | Đi giữa dòng người phố thị, bến cầu đá |
| **Kinh ngạc (Awe)** | Mắt mở to sáng bừng, miệng khẽ hé | Nhìn thấy cá bay trên trời, thung lũng mộng |
| **Gồng mình (Straining)** | Răng cắn chặt, mắt tập trung cao độ, tay gân guốc | Giữ chèo giữa thác lũ bão dông |
| **Bình an (Peaceful Smile)** | Mắt cong nhẹ nụ cười hiền, cơ mặt thả lỏng tuyệt đối | Hoàng hôn cập bến, chào tạm biệt đứa trẻ |

---

## 5. Bản Đồ Turnaround 5 Góc (The 5 Orthographic Views)

*   **File hình ảnh Turnaround chuẩn:** `releases/HB-xxx/concept/character_turnaround.png`
*   **Yêu cầu kỹ thuật:**
    *   Tư thế đứng chữ A thả lỏng (A-pose / Relaxed Neutral), hai tay buông nhẹ cách thân mình 15 độ.
    *   Nền trắng hoàn toàn (`#FFFFFF`) hoặc xám trung tính (`#808080`) không chi tiết thừa.
    *   Hiển thị đồng thời: Front, 3/4 Front, Profile 90°, 3/4 Back, Back.

---

## 6. Giao Thức Khóa Nhân Vật Trong Công Cụ Tạo Hình (Locking Protocol)

### Cho Midjourney:
```
/imagine prompt: Character turnaround sheet of [Tên/Mô tả nhân vật], [Độ tuổi], [Trang phục chi tiết với màu sắc], orthographic 5-view turnaround: front view, three-quarter view, profile side view, back view, neutral pose, plain white background, flat color anime gouache style, high consistency --ar 16:9 --style raw --v 6.1
```
*   *Khi render phân cảnh:* Nạp URL ảnh turnaround vào `--cref [URL] --cw 80` (để giữ khuôn mặt và trang phục chuẩn).

### Cho ComfyUI:
*   *Model:* SDXL hoặc checkpoint hoạt hình nghệ thuật (Pony / Illustrious / Realistic Vision).
*   *IP-Adapter Node:* `IPAdapterUnifiedLoader` với model `PLUS (high strength)`, Weight: `0.75 - 0.85`.
*   *ControlNet:* `OpenPose` (điều khiển dáng người) + `Depth Midas` (điều khiển khoảng cách).

### Cho Remotion SVG / Canvas:
*   File khai báo hằng số: `video/src/anim/characters/[character_name].ts`
*   Pivot points: Cổ (`neck`), Hông (`hip`), Khớp gối (`knee`), Bàn chân (`foot`).
*   Đảm bảo tất cả các hàm vẽ pose đều nhận chung 1 prop `scale` và `colorPalette`.
