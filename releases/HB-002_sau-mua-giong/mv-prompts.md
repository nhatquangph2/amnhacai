# 🎥 Prompt tạo clip — 8 cảnh xương sống (MV Sau Mùa Giông)

> Bản rút gọn của [`mv-script.md`](mv-script.md) mục 7. Chỉ 8 clip, phủ trọn 4:35 nhờ **dùng lại, lật ngang,
> chạy chậm** — danh sách cảnh đã ghi sẵn trong `video/src/songs/HB-002.json` (`scenes`).
> Bản đầy đủ 26 cảnh: `mv-scenes-full.json`.

## 0. Làm theo thứ tự này

1. **Tạo 3 ảnh tham chiếu** (mục 1) — bước quan trọng nhất: mọi clip bắt đầu từ ảnh này nên cái cây giống nhau suốt MV.
2. **Tạo 8 clip** (mục 3) bằng *image-to-video*: ảnh tham chiếu làm **khung đầu** + prompt. Mỗi cảnh tạo 2–3 bản, chọn bản đẹp nhất.
3. Clip ghi **20s**: tạo 10s rồi dùng tính năng **Extend / nối dài** (+10s) với prompt nối dài đi kèm.
4. Đặt tên đúng `S02.mp4, S03.mp4, S06.mp4, S07.mp4, S08.mp4, S14.mp4, S19.mp4, S22.mp4` vào một thư mục, rồi:
   ```bash
   cd video && npm run prep -- HB-002 --scenes ~/Downloads/mv-hb002 && npm run render -- HB-002
   ```

**Cài đặt chung:** 16:9 · 1080p trở lên · chế độ chất lượng cao (Pro/Master) · chuyển động camera **thấp/chậm**.
Công cụ gợi ý: Kling (có khung đầu + negative prompt + extend), Veo, Runway, Hailuo — kiểm tra gói có **quyền thương mại** (docs/09).

**Negative prompt dùng cho MỌI clip** (công cụ nào có ô này thì dán vào):
```
text, letters, watermark, logo, subtitles, people, person, animals, birds, cartoon, anime, illustration, painting, oversaturated colors, neon, fast camera movement, shaky camera, zoom burst, morphing, second tree, extra trees, forest, buildings, fence, road
```

## 1. Ba ảnh tham chiếu (Midjourney / Ideogram / Flux / Firefly)

Bố cục **giống ảnh bìa**: cây ở giữa, đường đồi cong ở 1/3 dưới, bầu trời chiếm phần trên.

**Ảnh A — cây đủ lá** (khung đầu cho S02, S03)
```
cinematic 35mm film still, a single large old broad-leafed tree with a thick trunk and a wide dense canopy of dark green leaves, standing alone on the crest of a low rounded grassy hill, centered, a small gray boulder half-buried at the base of the trunk, horizon in the lower third, dusk before a storm, heavy night-blue clouds gathering, faint ember orange glow on the horizon, muted desaturated palette, fine film grain, photorealistic, 16:9 --ar 16:9 --style raw
```

**Ảnh B — cùng cây, trơ trụi** (khung đầu cho S06, S07, S08, S14, S22)
```
cinematic 35mm film still, the same single large old tree now completely bare, no leaves, thick trunk and wide spreading bare branches, standing alone on the crest of a low rounded grassy hill, centered, a small gray boulder at the base, horizon in the lower third, stone gray storm light, muted desaturated palette, fine film grain, photorealistic, 16:9 --ar 16:9 --style raw
```
> Mẹo: tạo B bằng cách **chỉnh sửa ảnh A** (vary region / inpaint phần tán lá → "bare branches") để giữ đúng dáng cây.

**Ảnh C — lòng đất** (khung đầu cho S19)
```
cinematic cross-section view deep underground beneath a tree, dark layered soil and small stones, a vast network of thick and thin tree roots wrapping tightly around a large gray boulder, roots faintly glowing warm ember orange from within, floating dust particles, dramatic low-key lighting, photorealistic, fine film grain, 16:9 --ar 16:9 --style raw
```

## 2. Bản đồ dùng clip (đã ghi trong `HB-002.json`)

| Đoạn nhạc | Thời gian | Clip | Cách dùng |
|---|---|---|---|
| Intro | 0:00 – 0:19 | **S02** | tốc độ gốc |
| Verse 1 | 0:19 – 0:42 | **S03** | chậm 0.87× |
| | 0:42 – 0:57 | **S06** | 15s đầu |
| | 0:57 – 1:07 | **S07** | xuống lòng đất lần 1 |
| Chorus 1 | 1:07 – 1:27 | **S08** | cắt thẳng vào điệp khúc |
| | 1:27 – 1:47 | S08 | **lật ngang** |
| | 1:47.45 | *cắt đen* | sau "quật ngã —" |
| | 1:48 – 1:52 | S07 | từ giây thứ 4 — rễ lao xuống |
| Nhạc dạo | 1:52 – 2:12 | S06 | lật ngang |
| Verse 2 | 2:12 – 2:34 | **S14** | chậm 0.9× |
| | 2:34 – 2:59 | S06 | từ giây 5, chậm 0.6× |
| Bridge | 2:59 – 3:23 | **S19** | chậm 0.84× — xuống lòng đất lần 2 |
| | 3:23 – 3:40 | S07 | lật ngang, chậm 0.56× |
| Final Chorus | 3:40 – 3:51 | S08 | cắt thẳng, từ giây 5 |
| | 3:51 – 4:17 | **S22** | chậm 0.75× — bình minh |
| Outro | 4:17 – 4:35 | *ảnh bìa* | khóa khung như ảnh bìa |

## 3. Prompt 8 clip

### S02 · Intro — cây đủ lá, bão kéo đến · **20s**
- **Khung đầu:** Ảnh A
- **Prompt (10s đầu):**
```
Static wide shot, very slow push-in. A single large old tree full of dark green leaves stands alone on a grassy hilltop at dusk. Heavy night-blue storm clouds roll in slowly from the left, the light dims, the first gusts of wind begin to stir the canopy and ripple the grass. Distant silent lightning flickers once deep inside the clouds. Calm, ominous, cinematic, muted colors, 35mm film grain.
```
- **Nối dài (+10s):**
```
The wind grows stronger, the whole canopy starts to sway, leaves shiver, grass bends in waves across the hill, clouds darken and cover the last ember glow on the horizon. Camera keeps slowly pushing in.
```

### S03 · Verse 1 — gió nổi, cây oằn mình · **20s**
- **Khung đầu:** Ảnh A (hoặc khung cuối của S02 cho liền mạch)
- **Prompt:**
```
Medium low-angle shot of the lone tree on the hill, locked-off camera. Strong wind bends the whole canopy to one side, leaves thrash violently, the first leaves are torn away and fly across the frame, light rain begins to fall diagonally. Dark night-blue storm sky. The trunk stays firm while the branches struggle. Cinematic, muted desaturated colors, 35mm film grain, slow and heavy motion.
```
- **Nối dài (+10s):**
```
Gusts intensify, leaves are ripped off in clusters and swirl through the air, a thin branch snaps and falls, the canopy is visibly thinner, rain gets heavier.
```

### S06 · Trơ trụi dưới mưa · **20s** (dùng 3 lần)
- **Khung đầu:** Ảnh B
- **Prompt:**
```
Wide shot of the completely bare leafless tree alone on the hilltop in heavy slanting rain, cold stone-gray light, low clouds moving fast overhead, rain sheets sweeping across the hill, grass flattened by wind. Static camera, slow and somber. Cinematic, muted desaturated palette, 35mm film grain.
```
- **Nối dài (+10s):**
```
The rain continues steadily, clouds keep drifting, the bare branches tremble slightly in the wind while the trunk stands perfectly still.
```

### S07 · Xuống lòng đất — rễ âm thầm sâu hơn · **10s** (dùng 3 lần)
- **Khung đầu:** Ảnh B (cận gốc cây)
- **Prompt:**
```
Camera starts at the base of the bare tree trunk beside a small gray boulder, then tilts smoothly and continuously straight down through the ground surface into an underground cross-section of dark layered soil, revealing a network of tree roots faintly glowing warm ember orange from within. One thick root slowly pushes deeper into the earth. Seamless single continuous camera move, cinematic, photorealistic, fine film grain.
```
> Cảnh khó nhất. Nếu công cụ không làm được cú hạ liền mạch: tạo từ **Ảnh C** với prompt *"slow downward camera move through underground soil, glowing roots growing deeper"* — vẫn dùng được.

### S08 · Điệp khúc — bão lớn nhất, cây đứng yên · **20s** (dùng 3 lần)
- **Khung đầu:** Ảnh B
- **Prompt:**
```
Low-angle shot of the bare tree standing firm on the hilltop during a violent thunderstorm. Multiple lightning bolts strike across the dark sky, illuminating the tree in brief white flashes, horizontal rain lashes the frame, clouds churn. The camera is completely locked-off and steady, and the tree barely moves. Powerful, epic but restrained, cinematic, muted colors, 35mm film grain.
```
- **Nối dài (+10s):**
```
The storm keeps raging with more lightning flashes and driving rain, the tree remains unmoved, a strong silhouette against each flash.
```

### S14 · Verse 2 — mùa đông, sương giá, lặng · **20s**
- **Khung đầu:** Ảnh B
- **Prompt:**
```
The bare tree alone on the hilltop in deep winter at pale dawn. Frost covers every branch, the grass is silver and frozen, thin mist drifts slowly across the hill, a few snowflakes fall. Absolutely still and quiet. Very slow push-in. Cold desaturated silver-blue palette, cinematic, 35mm film grain.
```
- **Nối dài (+10s):**
```
Mist keeps drifting, frost glitters faintly as the light grows slightly brighter, camera continues a very slow push toward the trunk.
```

### S19 · Bridge — rễ ôm tảng đá (lòng đất lần 2) · **20s**
- **Khung đầu:** Ảnh C
- **Prompt:**
```
Deep underground cross-section beneath the tree. Very slow downward and forward camera glide through dark soil revealing a vast network of roots wrapped tightly around a large gray boulder, roots faintly glowing warm ember orange, soft pulses of light travelling slowly along the roots, floating dust particles in the air. Quiet, reverent, cinematic, photorealistic, fine film grain.
```
- **Nối dài (+10s):**
```
The camera keeps gliding deeper, more roots reveal themselves reaching further down, the glowing pulses slow and steady like a heartbeat.
```

### S22 · Final Chorus — mây rách, bình minh Ember · **20s**
- **Khung đầu:** Ảnh B
- **Prompt:**
```
The storm clouds tear apart above the hill and a deep ember-orange sunrise glows directly behind the bare tree, strong rays of light break through the clouds, the tree becomes a sharp dark silhouette against the warm sky, wet grass glistens. Static camera, very slow push-in. Hopeful, majestic but quiet, cinematic, 35mm film grain.
```
- **Nối dài (+10s):**
```
The sun rises a little higher, the light spreads warmly across the whole hill, remaining clouds drift away, the scene becomes calm and still.
```
> Muốn thêm **chồi non** (S23 trong bản đầy đủ) mà không tốn thêm clip: dùng tính năng tạo ảnh để làm 1 ảnh macro chồi xanh trên cành trụi, Claude sẽ chèn 4–5 giây với hiệu ứng phóng chậm ở 4:01.

## 4. Kiểm tra trước khi gửi Claude dựng

- [ ] Cây ở 8 clip **cùng một dáng** (so với Ảnh A/B)
- [ ] Không có chữ, logo, người, chim lọt vào khung
- [ ] Clip ghi 20s đã nối dài đủ 20s (thiếu vài giây vẫn được — Claude chỉnh `rate`)
- [ ] Ghi công cụ + gói + ngày tạo từng clip vào `third_party_assets` trong `metadata.yaml`
