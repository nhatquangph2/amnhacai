# 11 — Tiền Kỳ Điện Ảnh Chuẩn Studio (Pre-Production Standards)

> *"Một bộ phim hay hay dở đã được quyết định xong trước khi máy quay bấm nút ghi hình đầu tiên."*  
> Quy chuẩn tiền kỳ này đúc kết từ thực tiễn của các studio hoạt hình và điện ảnh hàng đầu thế giới (**Pixar, Disney, Studio Ghibli, StudioBinder**) cùng các quy trình AI/Hybrid tiên tiến nhất hiện nay (**ComfyUI IP-Adapter, Midjourney consistency, ControlNet, Remotion**).

---

## 🏛️ Triết lý: 3 Cột Trụ Tiền Kỳ Bắt Buộc

Trong sản xuất MV nghệ thuật, việc nhảy thẳng vào vẽ chi tiết hoặc tạo clip AI khi chưa chốt tiền kỳ luôn dẫn đến 3 thảm họa kinh điển:
1. **Nhân vật trôi dạt (Character Drift):** Mỗi cảnh một mặt, một kiểu tóc, lệch tuổi và trang phục.
2. **Loạn màu sắc và ánh sáng (Visual Disconnect):** Các cảnh ghép lại như một mớ clip rời rạc, không có dòng chảy cảm xúc.
3. **Gãy nhịp điệu (Pacing & Rhythm Failure):** Chuyển cảnh lệch nhịp nhạc, đoạn cần thở bị lướt nhanh, đoạn thừa lại kéo dài lê thê.

Để triệt tiêu các lỗi trên, mọi bài hát trước khi bước vào **Production** (render/dựng) bắt buộc phải hoàn tất **3 Hồ Sơ Tiền Kỳ**:

```
[ Ý TƯỞNG & LỜI BÀI HÁT ]
           │
           ▼
[ 1. KỊCH BẢN PHÂN CẢNH ] (Storyboard / Shot List theo từng giây nhạc)
           │
     ┌─────┴─────────────────────────┐
     ▼                               ▼
[ 2. BẢNG KHÓA NHÂN VẬT ]     [ 3. COLOR SCRIPT & LIGHTING ]
(Character Model Sheet)       (Biểu đồ cảm xúc thị giác theo Ralph Eggleston)
     │                               │
     └─────┬─────────────────────────┘
           ▼
[ 4. ANIMATIC / PRE-VISUALIZATION ] (Story Reel khớp audio + HUD đạo diễn)
           │
           ▼  (ĐẠT DUYỆT 100%)
[ SẢN XUẤT FINAL: Remotion / 3D / AI Generation ]
```

---

## 👤 PHẦN 1: BẢNG KHÓA NHÂN VẬT & MODEL KIT (Character Model Sheet)

### 1. Tiêu chuẩn Turnaround 360° (Theo chuẩn Disney & Pixar)
Bảng khóa nhân vật không phải là một bức tranh minh họa nghệ thuật, mà là **bản vẽ kỹ thuật chuẩn xác (Technical Blueprint)**:
*   **5 Góc phối cảnh cơ bản:**
    1.  **Front View (Chính diện):** Xác định chiều cao, chiều rộng cơ thể, khoảng cách mắt, vị trí cổ áo và độ dài chân.
    2.  **3/4 Front View (Góc nghiêng ba phần tư):** Hiển thị khối lượng cơ thể (volume), sống mũi, độ phồng của tóc và trang phục.
    3.  **Profile 90° (Nhìn ngang):** Xác định chiều sâu silhouette, độ vươn của cằm, dáng đứng thẳng hay gù.
    4.  **3/4 Back View (Góc nghiêng từ sau):** Hiển thị cách trang phục ôm quanh lưng, nếp gấp áo.
    5.  **Back View (Chính diện sau lưng):** Bắt buộc phải có để dựng các cảnh máy quay đi theo sau lưng nhân vật (Follow Tracking Shot).
*   **Thước gióng tỷ lệ (Horizontal Construction Lines):**
    *   Bắt buộc kẻ 6 đường gióng ngang xuyên suốt 5 góc nhìn: (1) Đỉnh đầu, (2) Ngang mắt, (3) Vai, (4) Thắt lưng/Hông, (5) Đầu gối, (6) Gót chân.
    *   Mọi chi tiết trang phục ở góc quay nào cũng phải nằm đúng vị trí của đường gióng ngang.

### 2. Tỷ lệ giải phẫu học (Head Units Proportion)
*   Đo lường cơ thể bằng số đơn vị đầu (Head Counts):
    *   **Người lớn chiêm nghiệm (Adult Seeker):** Chuẩn 6.5 – 7.0 đầu (thanh mảnh, tĩnh tại, mang nét phong trần).
    *   **Đứa trẻ bên trong (Inner Child):** Chuẩn 4.0 – 4.5 đầu (đầu to hơn thân, thân ngắn, chân tay nhanh nhẹn).
    *   **Tỷ lệ tương quan (Scale Relation):** Khi hai nhân vật đứng cạnh nhau, đỉnh đầu đứa trẻ chỉ chạm đến thắt lưng hoặc khuỷu tay người lớn.

### 3. Bảng mã màu phẳng (Flat Color Palette Specification)
*   Không dùng màu có bóng đổ phức tạp trên model sheet. Chỉ dùng màu phẳng (Flat Color) kèm mã HEX chính xác:
    *   `Base Color` (Màu nền): Màu gốc của tóc, da, áo, quần, phụ kiện.
    *   `Shadow Tone` (Màu đổ bóng): Sắc độ khi đi vào vùng tối (thường ngả về màu mát hơn).
    *   `Highlight Tone` (Màu bắt sáng): Sắc độ khi đón ánh nắng hoặc đèn rọi.
    *   `Accent Identity` (Màu nhận diện): Màu nhấn biểu tượng của nhân vật (vd: Khăn quàng màu Ember `#D9622B`).

### 4. Giao thức khóa nhân vật đa nền tảng (AI & Code Locking Protocol)
*   **Với Midjourney:**
    *   Chạy prompt tạo sheet: `Character turnaround sheet of [Name], front view, side view, back view, neutral pose, orthographic projection, white background, flat color, animation model sheet --ar 16:9 --style raw`.
    *   Khi sinh các shot tiếp theo: Sử dụng `--cref [URL_MODEL_SHEET] --cw 80` (để giữ khuôn mặt và trang phục) hoặc `--cw 25` (để giữ mặt nhưng đổi động tác).
*   **Với ComfyUI:**
    *   Sử dụng node `IP-Adapter PlusV2 / FaceID` nạp ảnh cắt từ Character Sheet làm reference cố định.
    *   Kết hợp `ControlNet OpenPose` + `ControlNet Depth` để khóa dáng và chiều sâu cơ thể.
*   **Với Remotion SVG/Canvas:**
    *   Định nghĩa hằng số tọa độ và tỷ lệ cố định trong file TypeScript (như `Figure.tsx`). Mọi biến thể pose (`stand`, `walk`, `sit`, `lookUp`) phải tham chiếu chung một bộ thông số tỷ lệ đầu-thân.

---

## 🎨 PHẦN 2: COLOR SCRIPT & ÁNH SÁNG CẢM XÚC (Emotional Lighting)

### 1. Phương pháp Ralph Eggleston (Pixar)
Ralph Eggleston (đạo diễn nghệ thuật của *Toy Story, Finding Nemo, Wall-E, Up*) đã phát minh ra Color Script như một **dải cảm xúc thị giác liên tục**:
> *"Màu sắc và ánh sáng trong phim không phải để trang trí; chúng là hệ thống dẫn đường tâm lý vô thức cho khán giả."*

Một Color Script chuẩn studio gồm 4 thông số bắt buộc cho từng phân đoạn:
1.  **Dominant Hue (Sắc độ chủ đạo):** Màu chiếm 60–70% khung hình, phản ánh trạng thái nội tâm của nhân vật.
    *   *Xám chì / Xanh thép lạnh:* Bế tắc, cô đơn, guồng quay mệt mỏi.
    *   *Vàng mật ong / Hổ phách ấm:* Khát khao, hồi tưởng, kỳ diệu, tình người.
    *   *Xanh ngọc / Xanh lục biếc:* Tươi mới, tái sinh, tự do, hy vọng.
    *   *Đỏ đun / Cam gỉ:* Năng lượng bùng nổ, hiểm nguy, xung đột, đối mặt.
2.  **Value & Contrast Ratio (Tương quan Sáng – Tối):**
    *   *Low Contrast (Tương phản thấp, xám nhờ):* Cảm giác ngột ngạt, vô định, thời gian ngừng trôi.
    *   *High Contrast (Tương phản cao, bóng đen sâu, ánh sáng gắt):* Kịch tính, căng thẳng, bão dông, xung đột cao trào.
    *   *Key High-light (Ánh sáng tỏa rạng, viền sáng Rim Light):* Khai sáng, chữa lành, buông bỏ muộn phiền.
3.  **Color Temperature (Nhiệt độ màu nguồn sáng - Kelvin):**
    *   *6500K – 7500K (Lạnh):* Bình minh sương mù, mưa rào, phòng làm việc nhân tạo.
    *   *4500K – 5000K (Trung tính):* Ánh sáng ban ngày tự nhiên, thực tế.
    *   *2400K – 3000K (Ấm):* Ánh nến, hoàng hôn, khói bếp quê nhà, đèn lồng.
4.  **Visual Metaphor Palette (Bảng màu ẩn dụ):**
    *   Màu đại diện cho "Vật thể hy vọng" (chiếc thuyền, cây xanh, dải khăn) luôn phải nổi bật tương phản bổ sung (Complementary Contrast) với môi trường xung quanh.

---

## ⏱️ PHẦN 3: ANIMATIC & PRE-VISUALIZATION (Story Reel / Leica Reel)

### 1. Vai trò sống còn của Animatic
Animatic là bản dựng video ghép các khung hình phác thảo tĩnh (hoặc chuyển động thô) chạy chính xác trên nền file nhạc master và âm thanh môi trường (SFX):
*   Kiểm tra **độ dài của từng cú máy (Shot Duration)**: Khán giả có kịp đọc hiểu chi tiết trong khung hình không?
*   Kiểm tra **nhịp cắt (Pacing on Beat)**: Điểm cắt có rơi đúng nhịp trống, nốt luyến của đàn hay câu thở của lời hát không?
*   Kiểm tra **luồng mắt nhìn (Eye Trace / Visual Flow)**: Khi cắt từ shot A sang shot B, mắt người xem có bị giật đột ngột từ góc này sang góc đối diện không?

### 2. Tiêu chuẩn hiển thị HUD trên Animatic (Director's Heads-Up Display)
Trong quá trình dựng thử nghiệm và nghiệm thu, video Animatic phải hiển thị dải thông tin kỹ thuật (HUD):
*   **Góc trên bên trái:** `SHOT ID` (vd: `SH-05`) + `TIME RANGE` (`00:21.8 - 00:28.5`).
*   **Góc trên bên phải:** `TIMECODE` chuẩn SMPTE (`HH:MM:SS:FF`) + `FRAME COUNT`.
*   **Dưới cùng màn hình:** Lời bài hát tương ứng + Cỡ cảnh (`Framing`) + Hướng chuyển động máy quay (`Camera Motion`).
*   **Thanh Swatch Màu:** 4 ô màu chủ đạo của phân đoạn đó theo Color Script.

---

## ✅ PHẦN 4: CHECKLIST NGHIỆM THU TIỀN KỲ (Pre-Production Gate Review)

Trước khi chuyển bất kỳ bài hát nào sang trạng thái `production`, người phụ trách phải kiểm tra đủ 10 tiêu chí:

| # | Tiêu chí nghiệm thu | Trạng thái | Ghi chú |
|---|---|:---:|---|
| 1 | Kịch bản phân cảnh đã khớp timeline audio chính xác đến 0.1s | ⬜ | Bảng shot list trong `docs/` hoặc `STORYBOARD.md` |
| 2 | Nhân vật chính có Character Model Sheet đủ 5 góc quay | ⬜ | Front, Profile, 3/4 Front, 3/4 Back, Back |
| 3 | Tỷ lệ đầu (Head counts) và chiều cao tương quan đã khóa | ⬜ | Thước gióng chiều cao ngang hàng |
| 4 | Bảng mã màu trang phục (Hex codes) cố định, không bóng | ⬜ | Base, Shadow, Highlight, Accent |
| 5 | Đã thiết lập Prompt Blueprint / Reference Kit cho AI hoặc SVG | ⬜ | `--cref`, IP-Adapter hoặc SVG Pivot |
| 6 | Color Script hoàn chỉnh từ Intro đến Outro | ⬜ | Đủ 4 thông số: Hue, Value, Temp (K), Metaphor |
| 7 | Bảng màu bám sát bộ nhận diện thương hiệu Senore (docs/02) | ⬜ | Ưu tiên Old Paper, Ink, Earth, Ember, Stone |
| 8 | Bản dựng Animatic đã render và xem thử cùng toàn bộ audio | ⬜ | Đã kiểm tra nhịp cắt và độ thở của cảnh |
| 9 | Mọi cú máy (Camera moves) đều tuân thủ vật lý điện ảnh | ⬜ | Không có zoom/xoay giật vô nghĩa |
| 10 | Đạo diễn duyệt 100% hồ sơ tiền kỳ | ⬜ | Ký duyệt trước khi cấp phép render nặng |
