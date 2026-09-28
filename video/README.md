# 🎬 video/ — Xưởng dựng lyric video, MV & Shorts

Dựng video bằng **code** ([Remotion](https://www.remotion.dev): React → MP4) theo đúng bộ nhận diện
Senore (docs/02). Mỗi bài = 1 file JSON; đổi kiểu hình chỉ bằng 1 tham số; Claude Code sửa/viết thêm
cảnh mới trực tiếp trong `src/styles/`.

```
lyrics.txt + master WAV
      │
      ▼
npm run prep ──► npm run whisper ──► npm run studio ──► npm run render
(chép file,      (Whisper nghe bài,   (xem trước,        (MP4 16:9 +
 tạo JSON)        ghép lời gốc vào     chỉnh)             Shorts 9:16)
                  mốc thời gian)
```

## Cài một lần

```bash
cd video
npm install
# Whisper (Apple Silicon) — Python riêng trong video/.venv, không đụng Python hệ thống
brew install uv
uv venv .venv --python 3.12
uv pip install --python .venv/bin/python mlx-whisper soundfile scipy
```

Lần đầu: Remotion tự tải Chrome Headless Shell (~90 MB), Whisper tự tải model large-v3-turbo (~1,6 GB).
Không cần ffmpeg.

## Quy trình cho 1 bài

```bash
# 1. Chép audio master + ảnh bìa + font vào public/, tạo src/songs/HB-002.json từ lyrics.txt
npm run prep -- HB-002 --audio ../releases/HB-002_sau-mua-giong/audio/Senore_Sau-Mua-Giong_master.wav --style film

# 2. Căn lời tự động: Whisper nghe bài → ghép LỜI GỐC vào mốc thời gian từng từ
npm run whisper -- HB-002
#    Bảng in ra có ⚠️/❌ ở dòng khớp yếu → sửa tay: npm run sync -- HB-002 (bấm vào dòng, gõ Space)

# 3. Xem trước & tinh chỉnh (trình duyệt, tua từng khung hình)
npm run studio

# 4. Xuất
npm run render -- HB-002                         # out/HB-002_film.mp4 — 1920×1080, cả bài
npm run render -- HB-002 --short                 # out/HB-002_short_film.mp4 — 1080×1920, điệp khúc đầu
npm run render -- HB-002 --short --from 62 --to 95
npm run render -- HB-002 --style dark            # thử kiểu khác, không sửa JSON
npm run render -- HB-002 --still 90              # 1 ảnh PNG ở giây 90 để duyệt nhanh
```

Tốc độ tham khảo: Shorts 40s ≈ 1,5 phút render; cả bài 4–5 phút ≈ 12–15 phút.

### Vì sao chữ trên video không bị sai như Whisper?

Whisper nghe tiếng Việt do AI hát hay sai ("bão giông" → "bảo dông", "cành" → "canh") và đôi khi bịa
("Hãy đăng ký kênh"). `align` **không dùng chữ của Whisper**: nó so từng âm tiết lời gốc với âm tiết
Whisper nghe được (khớp cả khi sai dấu), chỉ mượn **thời điểm**. Dòng không khớp được thì nội suy và
đánh dấu ❌ để bạn sửa. Cũng nhận file `.srt/.vtt/.json/.csv` từ MacWhisper: `npm run align -- HB-002 file.srt`.

## 3 kiểu hình (docs/02 §5)

| `style` | Kiểu | Hợp với |
|---|---|---|
| `paper` | **Trang giấy** — nền giấy cũ, mực thấm đậm dần qua từng chữ được hát | Bài tự sự, thơ |
| `film` | **Khung phim** — clip/ảnh nền theo phân cảnh, khung 2.39:1, hạt phim, phụ đề serif | Bài cao trào, động lực, **MV** |
| `dark` | **Tối giản đen** — chữ lớn giữa màn hình, sáng dần theo từng chữ | Rap, spoken word |

Cả 3 kiểu đều chạy chữ **karaoke** theo thời gian từng chữ từ Whisper; từ trong `emphasis` chạy màu nhấn.

## File bài hát `src/songs/HB-xxx.json`

| Trường | Ý nghĩa |
|---|---|
| `style` | `paper` / `film` / `dark` |
| `accent` | Màu nhấn — tự lấy theo series (`dung-day` = Ember, `doi-nguoi` = Earth…) |
| `emphasis` | Từ khóa tô màu nhấn, vd `["giông", "bão", "rễ"]` |
| `background` | Ảnh/clip nền cho kiểu `film` (mặc định = ảnh bìa). Thêm bằng `npm run prep -- HB-002 --background clip.mp4` |
| `scenes[]` | Phân cảnh MV (kiểu `film`): `{ at, src, cut?, rate?, offset?, flip? }` — clip AI theo mốc giờ, `"black"` để cắt đen. Chép clip: `npm run prep -- HB-002 --scenes <thư-mục>` |
| `lines[]` | `start`/`end` (giây), `text`, `section`, `words[]` (thời gian từng chữ cho karaoke) — do `whisper`/`align` ghi. `"hook": true` = phóng lớn giữa màn hình |
| `synced` | `false` = thời gian còn ước lượng, chưa căn |

`public/`, `out/`, `.venv/` **không commit** (dựng lại được). JSON bài hát và `transcripts/` **có commit**.

## Làm việc cùng Claude Code

Mở Claude Code trong repo và nói thẳng điều bạn muốn, ví dụ:

- *"Render bản film của HB-002 và 3 Shorts ở 3 điệp khúc."*
- *"Thêm kiểu `rain`: mưa rơi chéo trên nền Night Blue, chữ hiện qua kính mờ, dùng cho bài y-nghia."*
- *"Ở Bridge của Sau Mùa Giông, cho rễ cây mọc dần từ đáy màn hình theo nhịp từng dòng."*
- *"Render --still ở giây 45, 120, 200 rồi xem và tự sửa chỗ chữ đè lên thân cây."*

Claude viết React trong `src/styles/`, tự render ảnh tĩnh để **tự nhìn và sửa** trước khi xuất bản cuối.
Skill chính thức của Remotion (`npx skills add remotion-dev/skills`) giúp Claude viết animation chuẩn hơn.

## Nền AI (tùy chọn, cho kiểu `film`)

Code lo chữ, nhịp, bố cục; **clip AI** lo hình ảnh điện ảnh. Tạo clip 5–10s (Kling, Runway, Veo, Hailuo…)
theo prompt ảnh trong `prompts/<series>.md`, rồi `npm run prep -- HB-xxx --background clip.mp4`.
Clip ngắn hơn bài sẽ dừng ở khung cuối — nên tạo clip loop hoặc nhờ Claude ghép nhiều clip theo từng đoạn.
Ghi nguồn + giấy phép clip vào `third_party_assets` trong `metadata.yaml` (docs/05).

## Giấy phép Remotion

Miễn phí cho cá nhân và công ty ≤ 3 người (kể cả thương mại). Lớn hơn cần mua license — xem remotion.dev/license.
