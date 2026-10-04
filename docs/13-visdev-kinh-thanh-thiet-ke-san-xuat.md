# 13 — VisDev: Kinh Thánh Thiết Kế Sản Xuất & Phát Triển Thị Giác (Production Bible)

> *"Sự khác biệt giữa một người làm video nghiệp dư và một Studio hoạt hình đỉnh cao nằm ở **Hệ Thống Thiết Kế Sản Xuất (Production Design System)**. Trong khi người nghiệp dư mò mẫm vẽ từng cảnh mới từ con số không, Studio sở hữu một cuốn **Kinh Thánh Phát Triển Thị Giác (VisDev Bible)** — nguồn chân lý duy nhất (Single Source of Truth) định nghĩa toàn bộ quy luật vật lý, màu sắc, nhân vật và ánh sáng của cả một vũ trụ nghệ thuật."*  
> *(Học hỏi từ phương pháp luận VisDev của **Studio Ghibli, Pixar Animation Studios, Sony Pictures Animation — Spider-Verse**).*

---

## 🏛️ PHẦN 1: TRIẾT LÝ VISDEV & CƠ CHẾ VẬN HÀNH STUDIO

Trong ngành hoạt hình và điện ảnh thế giới, tài liệu sáng tạo chia làm 2 cấp độ:
1.  **Pitch Bible (Hồ sơ ý tưởng):** Dùng để giới thiệu cảm hứng ban đầu, định hướng đề tài.
2.  **Production Bible (Kinh Thánh Thiết Kế Sản Xuất):** Cuốn cẩm nang kỹ thuật vận hành chi tiết. Mọi họa sĩ, lập trình viên Remotion, chuyên gia prompt AI khi bước vào dự án đều tuân thủ 100% các quy tắc trong cuốn sách này để đảm bảo: **100 video sản xuất ra đều như cùng thuộc về một linh hồn nghệ thuật duy nhất.**

### 3 Quy Luật Bất Biến Của Vũ Trụ Thị Giác Senore:
*   **Quy luật 1: Chất liệu xúc giác (Tactile Materiality):** Thế giới của Senore được làm từ *giấy Dó thủ công, mực tàu mài, màu bột Gouache Nhật Bản, gỗ mộc và đá tảng*. Tuyệt đối không dùng phong cách 3D bóng loáng giả tạo, không dùng màu neon kẹo ngọt sáo rỗng.
*   **Quy luật 2: Trọng lượng điện ảnh (Cinematic Weight & Inertia):** Mọi chuyển động của nhân vật, camera và gió bão đều có quán tính vật lý thực tế. Không lia máy ngẫu nhiên, không zoom giật cục vô nghĩa.
*   **Quy luật 3: Màu sắc là tâm lý (Color as Psychology):** Ánh sáng không dùng để trang trí; ánh sáng là biểu đồ dòng chảy tâm lý vô thức của nhân vật theo phương pháp Ralph Eggleston (Pixar).

---

## 👥 PHẦN 2: MA TRẬN 22 HÌNH MẪU NHÂN VẬT ĐA THẾ HỆ (Master Cast Matrix)

Được chia theo 5 Vòng Đời của kiếp nhân sinh, sẵn sàng triệu tập cho bất kỳ bài hát nào trong 4 Series (`dung-day`, `doi-nguoi`, `y-nghia`, `nghe-thuat`):

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   VÒNG ĐỜI VŨ TRỤ NHÂN VẬT SENORE                                │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
  1. TUỔI THƠ (Childhood)        ➔  2. THIẾU NIÊN (Youth)          ➔  3. TRƯỞNG THÀNH (Adulthood)
  • Đứa Trẻ Bên Trong (4.2 đầu)     • Người Vẽ Bản Đồ (6.4 đầu)       • Người Kiếm Tìm (6.8 đầu)
  • Chú Bé Chăn Trâu (4.5 đầu)      • Người Dệt Ánh Sáng (6.2 đầu)    • Người Viết Đêm (6.5 đầu)
  • Cô Bé Thả Thuyền Giấy (4.0)     • Người Nhặt Ký Ức (6.3 đầu)      • Người Gieo Hạt (6.6 đầu)
  • Đứa Trẻ Bán Báo Mưa (4.8)       • Tay Đạp Xe Ngược Gió (6.7)      • Người Dựng Xây (7.0 đầu)
                                                                      • Người Thợ Gốm (6.6 đầu)
                                                                      • Người Đàn Bà Tựa Cửa (6.4)
                                 ➔  4. TRUNG NIÊN (Midlife)        ➔  5. LÃO NIÊN (Elderly)
                                    • Người Chở Đò Thời Gian (6.5)    • Bậc Trưởng Thượng (5.8 đầu)
                                    • Người Thắp Đèn Đêm (6.5 đầu)    • Ông Lão Trồng Rừng (6.0 đầu)
                                    • Người Giữ Hải Đăng (6.7 đầu)    • Nghệ Nhân Mộc Bản (6.0 đầu)
                                    • Người Kéo Lưới Sớm (6.6 đầu)
```

### Bảng Tra Cứu Nhanh 22 Nhân Vật:

| # | Mã nhân vật | Tên tiếng Việt | Tỷ lệ đầu | Series phù hợp | Bảng màu nhận diện chính | Vật bất ly thân |
|---|---|---|:---:|---|---|---|
| 1 | `innerChild` | **Đứa Trẻ Bên Trong** | **4.2** | *Cả 4 series* | `#2EC4B6` (Ngọc bích) · `#D9622B` (Ember) | Khăn len đỏ Ember bay dài sau lưng |
| 2 | `fluteBoy` | **Chú Bé Chăn Trâu** | **4.5** | `doi-nguoi`, `y-nghia` | `#6B7A4B` (Lá sen) · `#C8956E` (Da nâu) | Cây sáo trúc nhỏ quấn chỉ đỏ |
| 3 | `paperBoatGirl` | **Cô Bé Thả Thuyền Giấy** | **4.0** | `y-nghia`, `doi-nguoi` | `#E9C46A` (Vàng mơ) · `#FAF0CA` | Thuyền giấy gấp thả rãnh nước mưa |
| 4 | `rainstormPaperboy`| **Đứa Trẻ Bán Báo Phố Mưa**| **4.8** | `dung-day` | `#3A506B` (Xanh xám) · `#E9C46A` | Túi bạt nilong che báo, mũ nồi dạ |
| 5 | `cartographer` | **Người Vẽ Bản Đồ** | **6.4** | `nghe-thuat`, `dung-day`| `#E9C46A` (Hổ phách) · `#4A5568` | La bàn đồng, ống da đựng giấy cuộn |
| 6 | `artist` | **Người Dệt Ánh Sáng** | **6.2** | `nghe-thuat` | `#6B7A4B` (Moss Green) · `#9D4EDD` (Tím) | Lăng kính màu bắt ánh sáng cầu vồng |
| 7 | `memoryCollector` | **Người Nhặt Ký Ức** | **6.3** | `doi-nguoi`, `y-nghia` | `#7A5C43` (Nâu đất) · `#48CAE4` | Hộp gỗ cũ đựng mảnh gốm vỡ, vỏ ốc |
| 8 | `cyclist` | **Tay Đạp Xe Ngược Gió** | **6.7** | `dung-day` | `#D9622B` (Ember) · `#1D2D44` | Xe đạp khung sắt, ruy-băng đỏ |
| 9 | `seeker` | **Người Kiếm Tìm** | **6.8** | `dung-day`, `doi-nguoi` | `#2A4B6E` (Xanh thẫm) · `#EFE8DC` | Măng-tô xanh thẫm, giày da mòn gót |
| 10 | `writer` | **Người Viết Đêm** | **6.5** | `y-nghia` | `#23304A` (Night Blue) · `#D9622B` | Bút máy kim loại, kính tròn, sổ da |
| 11 | `gardener` | **Người Gieo Hạt** | **6.6** | `dung-day`, `nghe-thuat`| `#7A5C43` (Đất ấm) · `#6B7A4B` (Rêu) | Túi vải hạt giống, bình tưới đồng |
| 12 | `builder` | **Người Dựng Xây** | **7.0** | `dung-day` | `#9C4124` (Gỉ sắt) · `#D9622B` (Ember) | Dải vải đỏ buộc cổ tay, búa gỗ |
| 13 | `potter` | **Người Thợ Gốm** | **6.6** | `nghe-thuat`, `doi-nguoi`| `#BC6C25` (Đất nung) · `#2EC4B6` (Men rạn)| Bàn xoay gỗ thủ công, bình đất nung |
| 14 | `waitingWoman` | **Người Đàn Bà Tựa Cửa** | **6.4** | `doi-nguoi`, `y-nghia` | `#506169` (Khói mộc) · `#FAF0CA` | Ngọn đèn bão đặt bên bậu cửa gỗ |
| 15 | `ferryman` | **Người Chở Đò Thời Gian**| **6.5** | `doi-nguoi`, `y-nghia` | `#4A5866` (Chàm đá) · `#7A5C43` | Cây sào tre dài mộc mạc, nón lá cũ |
| 16 | `lamplighter` | **Người Thắp Đèn Đêm** | **6.5** | `y-nghia` | `#23304A` (Đêm sâu) · `#FFD166` (Lửa) | Sào châm lửa, lồng đèn bão bằng đồng |
| 17 | `lighthouseKeeper`| **Người Giữ Hải Đăng** | **6.7** | `dung-day`, `y-nghia` | `#1D2D44` (Xanh biển) · `#E9C46A` | Ống nhòm đồng, sổ hải trình bạc màu |
| 18 | `fisherman` | **Người Kéo Lưới Sớm** | **6.6** | `doi-nguoi`, `dung-day` | `#7A5C43` (Bùn đất) · `#00F5D4` (Bọt sóng) | Mẻ lưới tròn bung như cánh quạt |
| 19 | `elder` | **Bậc Trưởng Thượng** | **5.8** | `doi-nguoi` | `#5C4A3A` (Chàm bạc) · `#A68A72` (Khói) | Áo bà ba chàm, khăn rằn, tóc trắng |
| 20 | `forestElder` | **Ông Lão Trồng Rừng** | **6.0** | `dung-day`, `doi-nguoi` | `#6B7A4B` (Rêu rừng) · `#D9622B` | Gùi tre đựng mầm cây non trên lưng |
| 21 | `woodblockCarver`| **Nghệ Nhân Mộc Bản** | **6.0** | `nghe-thuat`, `doi-nguoi`| `#3A3A3C` (Xám tro) · `#D9622B` (Dấu son)| Bộ đục thép hoa văn, mộc bản gỗ thị |
| 22 | `soulVessel` | **Con Thuyền Gỗ Mộc** | *Vật thể*| *Cả 4 series* | `#7A5C43` (Sồi mộc) · `#FAF6EE` (Buồm) | Dòng chữ khắc *"Về thôi nào"* $\rightarrow$ *"Hãy đi tiếp nào"* |

---

## 🏞️ PHẦN 3: ATLAS 15 BỐI CẢNH ĐA TẦNG PARALLAX (Spatial World-Building)

Mỗi không gian được kiến tạo theo chuẩn **Thị sai 4 lớp (4 Parallax Layers)**, giúp tạo chiều sâu không gian quang học chân thực mà không cần dựng 3D phức tạp:

```
[ LỚP 1: TIỀN CẢNH (Foreground) ] ➔ Chuyển động nhanh nhất (Tốc độ 1.4x)
[ LỚP 2: TRUNG CẢNH (Midground)  ] ➔ Tốc độ chuẩn 1.0x (Nơi diễn ra hành động chính)
[ LỚP 3: HẬU CẢNH (Background)   ] ➔ Chuyển động chậm (Tốc độ 0.4x)
[ LỚP 4: VÒM TRỜI (Skybox)       ] ➔ Tĩnh hoặc trôi vô cực (Tốc độ 0.05x)
```

### 15 Bối Cảnh Chia Theo 5 Vùng Địa Lý Tâm Hồn:
1.  **Vùng Sông Nước:**
    *   `stonePier`: Bến Sông & Cầu Đá Cổ (5000K, ban mai sương sông, 35mm).
    *   `ferryCrossing`: Bến Đò Ngang Chiều Mưa (6000K, mưa rào mờ mịt, 50mm).
    *   `mangroveReeds`: Rặng Lau Sậy & Cửa Biển Hoàng Hôn (2800K, ngược sáng dát vàng, 85mm).
2.  **Vùng Làng Quê Cội Nguồn:**
    *   `grassyDyke`: Bờ Đê Lộng Gió & Cánh Đồng Lúa (4500K, nắng hè rực rỡ, 24mm).
    *   `riversideHearth`: Ngôi Làng Ven Suối & Bếp Lửa Quê (2200K, ấm cúng khói bếp, 50mm).
    *   `villageCourtyard`: Sân Đình Cây Đa Giếng Nước (4000K, trăng rằm thanh khiết, 35mm).
3.  **Vùng Cao & Bão Tố:**
    *   `solitaryHill`: Đồi Gió Đơn Độc & Cây Đại Thụ (8000K, chớp giật xé trời, 24mm).
    *   `mistyTerraces`: Ruộng Bậc Thang Mờ Sương Bình Minh (3800K, vệt nắng xiên God rays, 50mm).
    *   `waterfallGorge`: Hẻm Núi Thác Gầm & Vách Đá Tai Mèo (7000K, ghềnh thác cuộn sóng, 18mm).
4.  **Vùng Đô Thị Chiêm Nghiệm:**
    *   `clockworkTown`: Thị Trấn Bánh Răng & Tháp Đồng Hồ (6500K, xám lạnh bánh răng, 35mm).
    *   `rainyAlley`: Ngõ Phố Cổ Mưa Rào & Ban Công Rêu (3000K, đèn đường vàng phản chiếu vũng nước, 50mm).
    *   `writersAttic`: Căn Phòng Gác Mái & Bàn Viết Đêm (2200K, ánh nến bập bùng, 50mm).
5.  **Vùng Tâm Tưởng Siêu Thực:**
    *   `mirrorLake`: Hồ Ký Ức Đen & Biển Sao Ngân Hà (2400K, sóng ngọc bích phát quang, 35mm).
    *   `celestialValley`: Thung Lũng Cá Bay & Bầu Trời Lăng Kính (3500K, cá bơi trên không, 24mm).
    *   `restoredGarden`: Khu Vườn Hoang Phế Bung Nở Hoa (3200K, cầu vồng lăng kính, 35mm).

---

## 🎥 PHẦN 4: HỆ THỐNG ỐNG KÍNH & TÂM LÝ HỌC ĐIỆN ẢNH (Cinematography Bible)

### 1. Thang Tiêu Cự & Hiệu Ứng Tâm Lý:
*   **18mm – 24mm (Ultra-Wide):** *Sự Choáng Ngợp & Cô Đơn.* Nhân vật lọt thỏm giữa núi non hay biển bão, nhấn mạnh sự nhỏ bé của kiếp người trước thiên nhiên.
*   **35mm (Narrative Eye):** *Người Bạn Đồng Hành.* Tiêu cự kể chuyện kinh điển, tạo sự gắn kết mật thiết giữa nhân vật và môi trường sống.
*   **50mm (Human Eye):** *Sự Thật Trần Trụi & Chân Thành.* Không méo hình, chuẩn tỷ lệ mắt người nhìn thực tế.
*   **85mm – 105mm (Shallow DOF):** *Nội Tâm Khép Kín.* Xóa phông mờ mịt, cô lập giọt nước mắt, ánh mắt đứa trẻ khỏi thế giới ồn ào.
*   **135mm – 200mm (Telephoto Compression):** *Định Mệnh Áp Sát.* Nén phối cảnh, mang vầng thái dương hoàng hôn hay dãy núi khổng lồ áp sát ngay sau lưng người bước đi.

### 2. Sáu Mẫu Chuyển Cảnh Match-Cut "Chữ Ký":
1.  **Vòng Xoay Thời Gian:** *Kim đồng hồ cơ $\rightarrow$ Kim tháp chuông $\rightarrow$ Bánh xe đạp $\rightarrow$ Vòng gỗ cây*.
2.  **Giọt Rơi Buông Bỏ:** *Giọt nước mắt $\rightarrow$ Giọt mưa đầu mùa $\rightarrow$ Chiếc lá phong $\rightarrow$ Mái chèo rơi vào làn nước*.
3.  **Đốm Lửa Hy Vọng:** *Ngọn nến phòng gác mái $\rightarrow$ Đom đóm bờ suối $\rightarrow$ Mảnh kính màu $\rightarrow$ Ánh mắt đứa trẻ*.
4.  **Bàn Tay Tiếp Sức:** *Tay đứa trẻ kéo người lớn $\rightarrow$ Tay người chăm cây nâng mầm non $\rightarrow$ Năm bàn tay cùng giữ giàn gỗ*.
5.  **Cây Cầu Bến Đỗ:** *Bàn chân dừng lại trước cầu đá sớm $\rightarrow$ Bàn chân bước lên cầu ván gỗ hoàng hôn*.

---

## 🎨 PHẦN 5: BỘ LỌC CHẤT LIỆU & QUANG HỌC TRONG REMOTION (Shaders & FX)

Code thực thi tại [`video/src/library/shaders.tsx`](file:///Users/tranhuykhiem/Documents/amnhacai/video/src/library/shaders.tsx), có thể import vào bất kỳ Style nào:

```tsx
import {
  PaperTextureOverlay,  // Lớp giấy Dó và vải sần hữu cơ
  FilmGrainOverlay,      // Hạt phim 35mm nhảy động từng frame
  CinematicVignette,     // Quầng tối quang học hút mắt
  GodRaysOverlay,        // Vệt nắng xiên thể tích
  CinemaScopeBars,       // Dải đen 2.39:1 kèm dấu góc quang học
} from "../library";

export const MyScene: React.FC = () => (
  <AbsoluteFill>
    {/* Các layer hình ảnh vẽ SVG / Clip AI */}
    <CinemaScopeBars />
    <PaperTextureOverlay opacity={0.12} />
    <FilmGrainOverlay intensity={0.06} />
    <CinematicVignette intensity={0.4} />
  </AbsoluteFill>
);
```

---

## ⚡ PHẦN 6: CÔNG CỤ TRA CỨU CLI TRỰC TIẾP (`scripts/studio_atlas.py`)

Dành cho đạo diễn tra cứu nhanh khi đang viết lời hoặc lên kịch bản:

```bash
# 1. Liệt kê toàn bộ danh mục tài nguyên
python3 scripts/studio_atlas.py list

# 2. Xem hồ sơ chi tiết nhân vật (tỷ lệ, hex colors, prompt AI)
python3 scripts/studio_atlas.py char seeker
python3 scripts/studio_atlas.py char innerChild

# 3. Chỉ lấy chuỗi prompt AI để dán vào Midjourney / ComfyUI
python3 scripts/studio_atlas.py char artist --prompt

# 4. Xem bối cảnh điện ảnh kèm tiếng động môi trường Foley
python3 scripts/studio_atlas.py env solitaryHill --foley
python3 scripts/studio_atlas.py env mirrorLake

# 5. Tra cứu bảng mã màu cảm xúc Ralph Eggleston
python3 scripts/studio_atlas.py colors
```

Toàn bộ hệ thống giờ đây đã đạt cấp độ **Studio Production Design System**, tạo ra một thư viện khổng lồ, bài bản và chuyên nghiệp bậc nhất để bạn thỏa sức sáng tác và sản xuất các MV đỉnh cao trong nhiều năm tới!
