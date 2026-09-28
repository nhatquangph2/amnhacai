# 🎬 Kịch bản MV — Sau Mùa Giông (HB-002)

> Mốc thời gian lấy từ bản căn lời thật (`video/src/songs/HB-002.json`), khớp bản master 4:35.
> Mỗi cảnh = 1 clip AI 5–10 giây (Kling / Veo / Runway / Hailuo), chữ karaoke và dựng ghép làm bằng `video/`.

---

## 1. Ý tưởng

**Một câu:** *Một cái cây đơn độc trên đồi đi qua trọn một mùa giông — mất hết lá, gãy cành, trơ trụi —
và chỉ khi máy quay đi xuống lòng đất, ta mới thấy điều bài hát muốn nói: rễ đã sâu hơn.*

- **Cái cây chính là "tôi".** Không có nhân vật người kể chuyện. Người xem tự đặt mình vào cái cây.
- **Hai thế giới:** *trên mặt đất* là thứ ai cũng thấy (mất mát, bão, cành gãy); *dưới lòng đất* là thứ không ai thấy (rễ âm thầm lớn).
  MV đi xuống lòng đất đúng 3 lần, mỗi lần sâu hơn, đúng những câu hát về rễ.
- **Đúng tinh thần nhận diện (docs/02):** ẩn dụ thay vì minh họa, ít mà mạnh, không "người giơ nắm đấm trên đỉnh núi".
  Khoảnh khắc chiến thắng của MV không phải là tia nắng — mà là **một chồi non** rất nhỏ.

## 2. Nguyên tắc hình ảnh

| | |
|---|---|
| **Địa điểm** | Chỉ một: ngọn đồi thấp, một cây lớn lá rộng, cỏ dại, một tảng đá xám dưới gốc (tảng đá của HB-001 "Tảng Đá" — sợi chỉ nối hai bài). Luôn **cùng góc nhìn chính** như ảnh bìa để khán giả nhận ra. |
| **Thời gian** | Cơn bão từ lúc kéo đến → tan. Bridge là "mùa đông" lặng. Kết là bình minh. |
| **Mạch màu** | Night Blue `#23304A` → Stone `#3A3A3C` (bão) → lạnh xám bạc (đông) → **Ember `#D9622B`** (bình minh cuối). Dưới lòng đất: đất nâu Earth, rễ ánh Ember mờ. |
| **Chất liệu** | Điện ảnh, hạt phim, ánh sáng xiên, 24fps cảm giác chậm. Không màu kẹo, không hoạt hình dễ thương. |
| **Máy quay** | Chậm. Đẩy vào, hạ xuống, lượn nhẹ. Không rung lắc kiểu hành động — kể cả lúc bão to, máy vẫn đứng vững *như cái cây*. |
| **Chữ** | Kiểu **Khung phim** (`film`) + chữ chạy karaoke. Riêng câu hook *"Bão không quật ngã — bão lay… rễ sâu"* phóng lớn giữa màn hình (xem mục 5). |

## 3. Mạch cảm xúc

| Đoạn | Thời gian | Năng lượng | Hình ảnh chủ đạo | Màu |
|---|---|---|---|---|
| Intro | 0:00 – 0:19 | ▁ | Bóng tối, gió, chớp xa — cây còn đủ lá | Night Blue |
| Verse 1 | 0:19 – 1:07 | ▂▃ | Bão đến, lá rụng, cành gãy, cây trơ trụi · **xuống lòng đất lần 1** | Night Blue → Stone |
| Chorus 1 | 1:07 – 1:52 | ▅▆ | Bão lớn nhất, cây đứng yên · hook: **rễ lao xuống** | Stone, chớp trắng |
| Nhạc dạo | 1:52 – 2:12 | ▃ | Bão dịu, flycam lượn quanh đồi, đêm qua | Xám xanh |
| Verse 2 | 2:12 – 2:59 | ▃▄ | Mùa đông, sương giá · vết thương trên thân tự lành | Xám bạc |
| Bridge | 2:59 – 3:40 | ▂ | **Xuống lòng đất lần 2** (rễ ôm tảng đá) · **vòng gỗ** = những mùa giông | Earth, Ember mờ |
| Final Chorus | 3:40 – 4:16 | ▇█ | Cơn bão cuối — cây không lay · mây rách, bình minh · **chồi non** | Stone → Ember |
| Outro | 4:16 – 4:35 | ▂▁ | Toàn cảnh như ảnh bìa · (tùy chọn) một người ngồi tựa gốc cây | Ember → giấy |

## 4. Phân cảnh

> **Cột "Prompt"** dùng cho image-to-video: luôn đưa **ảnh tham chiếu cây** (mục 6) làm khung đầu để cây giống nhau ở mọi cảnh.
> Thêm vào cuối mọi prompt: `cinematic, 35mm film grain, muted colors, 16:9, slow camera, no text, no people`
> (trừ cảnh S24 có người). ♻️ = clip lặp được, dùng lại ở cảnh khác.

### Intro · 0:00 – 0:19

| # | Thời gian | Lời | Hình ảnh | Máy quay | Prompt |
|---|---|---|---|---|---|
| S01 | 0:00 – 0:08 | *(nhạc dạo)* | Màn đen. Chớp rất xa lóe lên 2 lần, mỗi lần thấy thoáng đường viền ngọn đồi và cái cây. Thẻ tên bài hiện. | Tĩnh | `pitch black night, distant silent lightning briefly reveals the silhouette of a lone tree on a low hill, dark blue storm clouds` |
| S02 | 0:08 – 0:19 | | Toàn cảnh đồi lúc chạng vạng bão, cây **còn đủ lá xanh thẫm**, cỏ bắt đầu lay, mây kéo đến. | Đẩy vào rất chậm | `wide shot of a lone broad-leafed tree full of dark green leaves on a grassy hill at dusk, storm clouds rolling in, grass starting to sway, night blue sky` |

### Verse 1 · 0:19 – 1:07

| # | Thời gian | Lời | Hình ảnh | Máy quay | Prompt |
|---|---|---|---|---|---|
| S03 | 0:19 – 0:30 | Tôi như cây đứng giữa trời / Một mình nghe gió gọi mời bão giông | Cây ở trung cảnh, gió mạnh dần, tán lá ào ào nghiêng về một phía. | Góc thấp, tĩnh | `medium low-angle shot of a lone tree on a hill, strong wind bending its canopy to one side, leaves thrashing, dark storm sky` ♻️ |
| S04 | 0:30 – 0:42 | Bao lần lá rụng về không / Bao lần cành gãy mà lòng chưa thôi | Lá bị giật khỏi cành bay qua ống kính; một cành gãy rời, rơi chậm. | Cận, slow-motion | `close-up of leaves being torn from branches by violent wind, flying past the camera in slow motion, a branch snaps and falls, rain beginning` |
| S05 | 0:42 – 0:52 | Gió qua, gió cứ qua đời / Mang đi những thứ một thời tưởng thân | Time-lapse: mây chạy vùn vụt, ngày đêm lướt qua, tán lá thưa dần. | Tĩnh, time-lapse | `time-lapse of a lone tree on a hill, clouds racing overhead, day and night flickering, the tree gradually losing its leaves` |
| S06 | 0:52 – 0:57 | Đến khi trơ trụi bao lần | Cây **trơ trụi hoàn toàn** dưới mưa quất, xám lạnh. | Toàn cảnh, tĩnh | `wide shot of a completely bare leafless tree on a hill in heavy slanting rain, cold stone gray light` ♻️ |
| S07 | 0:57 – 1:07 | **Mới hay rễ đã âm thầm sâu hơn** | ⬇️ **Xuống lòng đất lần 1.** Máy hạ từ gốc cây xuống xuyên qua mặt đất: mặt cắt đất, rễ ánh Ember mờ, một sợi rễ nhích sâu hơn. | Hạ dọc liền mạch | `camera tilts down from the base of a tree through the ground into a cross-section of dark soil, revealing a network of roots faintly glowing warm orange, one root slowly growing deeper` |

### Chorus 1 · 1:07 – 1:52

| # | Thời gian | Lời | Hình ảnh | Máy quay | Prompt |
|---|---|---|---|---|---|
| S08 | 1:07 – 1:17 | Cứ giông đi, cứ bão đi / Còn tôi, tôi vẫn đứng lì với tôi | Bão cực đại: chớp rạch trời, mưa ngang. Cây trơ trụi **đứng yên**. | Góc thấp, **tuyệt đối tĩnh** | `lone bare tree standing firm on a hill during a violent thunderstorm, lightning strikes across the sky, horizontal rain, the tree barely moves` ♻️ |
| S09 | 1:17 – 1:27 | Cứ đau đi, cứ rã rời / Sau cơn gió dữ, còn tôi với mình | Macro vỏ cây, nước mưa chảy thành dòng qua **một vết nứt sâu** (vết thương — sẽ lành ở S14). | Macro, trượt dọc thân | `extreme macro of rough tree bark with rainwater streaming down, a deep fresh crack in the bark, dark and wet` |
| S10 | 1:27 – 1:37 | Cành nào yếu, gió mang đi / Rễ nào còn lại, khắc ghi đất này | Chia khung trên/dưới: trên — cành cuối cùng bị gió giật đi; dưới — rễ siết chặt quanh đá. | Tĩnh | `split view cross-section: above ground a weak branch is ripped away by wind, below ground roots tighten their grip around rocks in dark soil` |
| S11 | 1:37 – 1:47 | Thì ra qua những tháng ngày / **Bão không quật ngã —** | Cận gốc cây trong bão. Đúng chữ "ngã —": **cắt đen 0.5s** (dàn dựng trong `video/`). | Đẩy vào chậm | *(dùng lại S08, đẩy sát gốc)* |
| S12 | 1:47 – 1:52 | **bão lay… rễ sâu.** | ⬇️ Mặt cắt lòng đất: rễ **lao xuống** theo từng phách, ánh Ember đập theo nhịp. | Lao dọc xuống | `underground cross-section, tree roots surging rapidly downward through dark soil, pulses of warm orange light running along the roots` |

### Nhạc dạo · 1:52 – 2:12

| # | Thời gian | Lời | Hình ảnh | Máy quay | Prompt |
|---|---|---|---|---|---|
| S13 | 1:52 – 2:12 | *(nhạc)* | Bão dịu thành mưa phùn, đêm trôi qua, ánh xám đầu tiên. Không chữ — để khán giả thở. | Flycam lượn vòng chậm quanh đồi | `slow aerial drone orbit around a lone bare tree on a hill in light drizzle, storm passing, night turning into gray pre-dawn light` |

### Verse 2 · 2:12 – 2:59

| # | Thời gian | Lời | Hình ảnh | Máy quay | Prompt |
|---|---|---|---|---|---|
| S14 | 2:12 – 2:23 | Tôi từng sợ những mùa đông / Sợ cơn gió lớn, sợ không còn mình | Mùa đông: sương giá phủ cành, cỏ bạc, im lặng, hơi thở của đất. | Tĩnh, trung cảnh | `bare tree on a hill in winter, frost covering every branch, silver frozen grass, still air, pale cold light, quiet` ♻️ |
| S15 | 2:23 – 2:34 | Rồi quen với những chông chênh / Quen nghe thân gỗ tự lành vết đau | Macro **cùng vết nứt ở S09** — time-lapse vỏ cây liền sẹo. | Macro, tĩnh | `extreme macro time-lapse of a crack in tree bark slowly healing, new bark growing over the wound forming a scar, soft winter light` |
| S16 | 2:34 – 2:45 | Chẳng mong trời hết mưa mau / Chẳng mong gió sẽ vì nhau nhẹ nhàng | Mưa lại rơi, nhưng dịu; cây không động đậy. | Lượn nửa vòng chậm | `gentle rain falling on a calm bare tree on a hill, camera slowly orbiting, peaceful gray atmosphere` |
| S17 | 2:45 – 2:59 | Chỉ mong sau mỗi điêu tàn / Tôi còn đứng đó — vững vàng hơn tôi | Kéo lùi ra toàn cảnh; **tia Ember đầu tiên** lướt ngang sườn đồi rồi tắt. | Kéo lùi | `camera pulls back to a wide shot of the lone tree on the hill, a single thin ray of warm orange light sweeps across the hillside` |

### Bridge · 2:59 – 3:40

| # | Thời gian | Lời | Hình ảnh | Máy quay | Prompt |
|---|---|---|---|---|---|
| S18 | 2:59 – 3:08 | *(nhạc lặng)* · Nếu không có một mùa giông | Một giọt mưa rơi từ đầu cành, slow-motion cực chậm, chạm đất. | Macro | `extreme slow motion of a single raindrop falling from the tip of a bare branch and splashing on dark soil` |
| S19 | 3:08 – 3:22 | **Làm sao biết rễ đã lồng vào sâu?** | ⬇️ **Xuống lòng đất lần 2 — sâu nhất.** Mạng rễ khổng lồ, rễ ôm trọn **tảng đá** xám (HB-001). | Hạ dọc rất chậm | `deep underground cross-section, a vast network of tree roots wrapped tightly around a large gray boulder, faint warm orange glow, dust particles` |
| S20 | 3:22 – 3:40 | Nếu không có những vết đau / Làm sao thân gỗ biết đâu phần mình? | **Vòng gỗ:** máy lướt qua mặt cắt thân cây — mỗi vòng sẫm là một mùa giông đã qua. | Trượt ngang qua các vòng | `extreme close-up tracking shot across a tree trunk cross-section, growth rings, some rings dark and scarred, warm light` |

### Final Chorus · 3:40 – 4:16

| # | Thời gian | Lời | Hình ảnh | Máy quay | Prompt |
|---|---|---|---|---|---|
| S21 | 3:40 – 3:51 | Cứ giông đi, cứ bão đi / Còn tôi, tôi vẫn đứng lì với tôi | Cơn bão cuối — to hơn cả Chorus 1, nhưng cây **không lay một chút**. | Góc thấp, tĩnh | *(dùng lại S08, màu tối hơn)* ♻️ |
| S22 | 3:51 – 4:01 | Cứ đau đi, cứ rã rời / Sau cơn gió dữ, còn tôi với mình | **Mây rách**, mặt trời Ember nhô sau đồi — khung hình giống ảnh bìa. | Tĩnh | `storm clouds tearing apart, an ember orange sunrise glowing behind a lone bare tree on a hill, dramatic light rays, silhouette` |
| S23 | 4:01 – 4:11 | Cành nào yếu, gió mang đi / Rễ nào còn lại, khắc ghi đất này | **Chồi non** xanh nhú ra trên cành trụi, bung lá đầu tiên. | Macro, time-lapse | `macro time-lapse of a tiny green bud sprouting and unfolding its first leaf on a bare wet branch, warm morning backlight` |
| S24 | 4:11 – 4:17 | Đời tôi qua những lung lay | Toàn cảnh đồi trong nắng sớm, cỏ yên, giọt nước trên cành lấp lánh. | Đẩy vào chậm | `wide shot of a lone tree on a calm hill at golden sunrise, wet grass glistening, peaceful after the storm` |

### Outro · 4:17 – 4:35

| # | Thời gian | Lời | Hình ảnh | Máy quay | Prompt |
|---|---|---|---|---|---|
| S25 | 4:17 – 4:25 | Mới hay… / cây lớn | *(Tùy chọn — khoảnh khắc con người duy nhất)* Một bóng người nhỏ bước lên đồi, ngồi tựa lưng vào gốc cây, nhìn bình minh. Quay lưng, không thấy mặt. | Toàn cảnh xa, tĩnh | `tiny silhouette of a person walking up a hill and sitting down leaning against the trunk of a lone tree, facing the ember sunrise, seen from behind, far wide shot` |
| S26 | 4:25 – 4:35 | là cây qua giông. | Khung hình khóa lại **đúng như ảnh bìa** → chuyển dần sang nền giấy cũ, dòng *"senore — những bài hát về cuộc sống"*. | Tĩnh → mờ | *(dùng ảnh bìa `cover.jpg`, không cần clip)* |

## 5. Chữ & dựng (làm trong `video/`)

- **Karaoke:** chữ kem nhạt hiện sẵn, sáng dần theo từng chữ được hát; từ khóa `giông · bão · rễ` chạy màu Ember.
- **Câu hook** — *"Bão không quật ngã — / bão lay… rễ sâu."* (1:42 – 1:52) và câu kết *"Mới hay… / cây lớn / là cây qua giông."* (4:17 – 4:30):
  chữ phóng lớn giữa màn hình, khung phim tối lại (`"hook": true` trong JSON). Cắt đen 0.45s ngay sau "quật ngã —" (cảnh `black` lúc 1:47.45).
- **Nhạc dạo 1:52 – 2:12 và Bridge 2:59 – 3:02:** không chữ.
- **Chuyển cảnh:** mờ chéo 0.8s là mặc định; **cắt thẳng theo phách** ở Chorus; **hạ dọc liền** khi xuống lòng đất (S07, S12, S19).
- **Bìa & kết:** thẻ tên bài ở S01 (có sẵn), thẻ `senore` ở S26 (có sẵn).

## 6. Sản xuất

1. **Ảnh tham chiếu cây (làm trước tiên):** tạo 1 ảnh "cây đủ lá" + 1 ảnh "cây trơ trụi" cùng góc với ảnh bìa
   (Midjourney/Ideogram, hoặc dùng thẳng `cover.jpg` cho cây trơ trụi). Mọi clip dùng image-to-video từ 2 ảnh này → cây nhất quán.
2. **Tạo clip:** 23 clip (S11, S21, S26 dùng lại). Tạo mỗi cảnh 2–3 bản, chọn bản đẹp nhất. Độ dài 10s cho cảnh ≥ 8s.
   Kiểm tra gói có **quyền thương mại** trước khi dùng (docs/09).
3. **Đặt tên & dựng:** lưu clip thành `S01.mp4 … S25.mp4` trong một thư mục, rồi:
   ```bash
   cd video && npm run prep -- HB-002 --scenes ~/Downloads/mv-hb002 && npm run render -- HB-002
   ```
   Danh sách cảnh (mốc giờ, cắt thẳng/mờ chéo, cảnh dùng lại) **đã ghi sẵn** trong `video/src/songs/HB-002.json` → `scenes`.
   Chưa đủ clip vẫn dựng được — cảnh thiếu tự dùng ảnh bìa, nên có thể xuất dần từng đợt để duyệt.
   Clip ngắn hơn cảnh: thêm `"rate": 0.7` vào cảnh đó để chạy chậm lại cho đủ dài.
4. **Ghi nguồn:** công cụ + gói + ngày tạo của từng clip vào `third_party_assets` trong `metadata.yaml` (docs/05).

## 7. Bản rút gọn (nếu thiếu thời gian / ngân sách)

Chỉ làm **8 clip "xương sống"**: S02 · S03 · S06 · S07 · S08 · S14 · S19 · S22 (+ ảnh bìa cho kết).
Mỗi clip trải dài một đoạn nhạc, chạy chậm lại (slow-mo). Vẫn giữ trọn mạch: *đủ lá → bão → trơ trụi → rễ → đông → rễ ôm đá → bình minh.*
