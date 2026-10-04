# 15. VISDEV: THƯ VIỆN ĐỘNG VẬT & NÂNG CẤP NHÂN VẬT CHUẨN STUDIO
> **Tài liệu Kỹ thuật Studio Senore — Phiên bản 1.0 (2026)**  
> *Định hướng: Universal Animal Art Library & High-Fidelity Character System (Nghệ thuật Papercraft, Linocut & Gouache)*

---

## 1. NÂNG CẤP HỆ THỐNG NHÂN VẬT NGƯỜI: TẠM BIỆT HÌNH VẼ "SƠ XÀI"

### 1.1. Vấn đề nhận diện từ người sáng tạo
Các video ban đầu (HB-001, HB-002) sở hữu hệ khung xương `Figure.tsx` với 11 khớp giải phẫu, tay chân dạng con nhộng mềm mại (`capsule limbs`), áo khoác rủ tự nhiên và khăn quàng bay theo gió. Tuy nhiên khi chuyển sang HB-004, một số phân cảnh đã bị rút gọn thành các đường kẻ thẳng (stick lines) đơn sơ, làm giảm chiều sâu cảm xúc của nhân vật.

### 1.2. Giải pháp: Bộ Nhân vật Toàn năng (`StudioCharacter.tsx`)
Hệ thống mới tái lập và nâng cấp toàn diện giải phẫu nhân vật:
* **Khung xương 11 khớp đầy đủ**: Hông, đùi, đầu gối, cẳng chân, cổ chân, vai, cẳng tay trên, cùi chỏ, cẳng tay dưới.
* **Đầu & Cổ thực tế**: Đầu có góc nghiêng, tóc gáy uốn cong mềm mại phủ sau ót, cổ áo liên kết tự nhiên với thân mình.
* **Trang phục có độ rủ & nếp bóng**: Áo khoác dài có vạt bay theo gió (`wind flap`), nếp gấp bóng đổ (`inner shadow`).
* **Khăn quàng Ember 5 đốt sóng**: Đuôi khăn quàng phấp phới tự nhiên trong luồng gió sông.
* **Giày/Boots có đế & Bàn tay màu da**: Bàn chân uốn theo bước đi, bàn tay màu da ấm áp cử động theo từng tư thế (`row`, `wave`, `heart`, `reach`, `push`).

---

## 2. THƯ VIỆN ĐỘNG VẬT ĐỒNG HÀNH (`video/src/library/animals.tsx`)

Trong vũ trụ triết lý và giàu chất thơ của Senore, các loài vật không chỉ là chi tiết trang trí mà là **"nhân vật đồng hành" (Companions)** phản ánh tâm trạng và mang lại sinh khí cho bối cảnh.

### 2.1. Loài Chim (`StudioBird`)
* **Chim én (`swallow`)**: Đuôi chẻ đôi đặc trưng, bụng trắng muốt, lưng chàm đen. Bay liệng chao nghiêng theo luồng gió, biểu trưng cho mùa xuân, niềm hy vọng và sự trở về.
* **Chim sẻ đồng (`sparrow`)**: Nâu đất mộc mạc, vỗ cánh nhanh, đậu nghiêng đầu ngơ ngác trên mạn thuyền hoặc cành cây.
* **Cò trắng / Diệc nước (`crane`)**: Cổ dài chữ S, chân thon dài duỗi ra sau, chóp cánh điểm lông đen uy nghi. Biểu trưng cho sự thanh thản, thiền định bên dòng sông.

### 2.2. Chó vàng Trung thành (`StudioDog`)
* **Đặc điểm**: Bộ lông vàng gụ ấm áp (`#D97706`), chiếc vòng cổ đỏ may mắn (`#DC2626`), đuôi cong vẫy nhịp nhàng đón chủ.
* **Tập tính**: Đứng ngóng trên bến đá, ngồi trầm ngâm cạnh chủ nhân, lon ton chạy theo bóng thuyền.
* **Ý nghĩa**: Biểu tượng của sự thủy chung, tình thân và sự chờ đợi bình yên nơi quê nhà.

### 2.3. Mèo lười Sưởi nắng (`StudioCat`)
* **Đặc điểm**: Dáng ngồi giọt nước thanh nhã, tai tam giác dựng đứng đón âm thanh, đuôi ngoe nguẩy nhẹ nhàng.
* **Tư thế ngủ (`sleep`)**: Cuộn tròn như quả cầu lông êm ái, nhịp thở nhấp nhô bên khung cửa sổ ngắm mưa tuyết.

### 2.4. Hươu rừng Thanh khiết (`StudioDeer`)
* **Đặc điểm**: Thân thon thả màu nâu gụ, đốm hoa mai trắng trên lưng, cặp gạc mỹ thuật vươn cao như cành cây khô mùa đông, tai vểnh đón gió rừng.
* **Ý nghĩa**: Đại diện cho sự nguyên sơ, thuần khiết của thiên nhiên hoang dã.

### 2.5. Đàn cá Dưới lòng sông (`StudioFishSchool`)
* **Đặc điểm**: Đàn cá 5–8 con uốn lượn hình sin mềm mại, lấp lánh ánh vảy bạc xanh (`#93C5FD`) dưới làn nước trong vắt.
* **Ý nghĩa**: Nhịp thở ngầm của dòng sông cuộc sống, bơi cùng con thuyền người tìm kiếm.

---

## 3. THỰC THI KIỂM CHỨNG TRÊN HB-004

Tại phân cảnh **00:25 (SH-05: Bến cầu đá ban mai)**:
* Nhân vật Người Tìm Kiếm đã được nâng cấp tóc gáy, vạt áo rủ, giày boots và khăn quàng Ember bay mềm mại.
* Chú chó vàng trung thành (`StudioDog`) ngồi đợi ngoan ngoãn bên cạnh trên bến đá.
* Đàn chim én (`StudioBird`) chao liệng trên nền trời sương sớm.
* Đàn cá (`StudioFishSchool`) bơi lội dưới chân mạn thuyền.
* Đứa trẻ nội tâm trên thuyền có mái tóc trẻ thơ, áo xanh ngọc và giày nhỏ nhắn.

📁 Khung hình render kiểm chứng: [`video/out/HB-004_anim_25s.png`](file:///Users/tranhuykhiem/Documents/amnhacai/video/out/HB-004_anim_25s.png)
