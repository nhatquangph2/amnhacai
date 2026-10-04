// Dữ liệu một bài hát — mỗi bài là một file src/songs/HB-xxx.json
// (tạo bằng `npm run prep`, căn thời gian bằng tools/tap-sync.html)

import type { AnimKey } from "./anim/params";
import type { PoseName } from "./anim/Figure";

export type FigureSpec = { pose: PoseName; x0: number; x1?: number; H: number; flip?: boolean; scarf?: string };

// Một cảnh của MV hoạt hình (kiểu "anim"): cây trên đồi hoặc các cảnh của nhân vật
export type Shot = {
  at: number; // giây bắt đầu
  scene: "hill" | "room" | "street" | "desk" | "notebook" | "bank" | "painted" | "brush" | "genesis" | "deep" | "lift" | "truck" | "ridge" | "nightroad" | "plaza" | "holeview" | "person";
  tOff?: number; // lệch thời gian cảnh (dùng lại cảnh cũ trong đoạn hồi ức)
  cut?: boolean; // cắt thẳng (mặc định mờ chéo 0.8s)
  // Nhân vật trên đồi: đi từ x0 → x1 trong suốt cảnh
  figure?: FigureSpec;
  figures?: FigureSpec[]; // nhiều người trên đồi
};

export type StyleId = "paper" | "film" | "dark" | "anim";

export type WordTime = {
  t: string; // chữ (giữ nguyên dấu câu)
  s: number; // bắt đầu hát (giây)
  e: number; // hát xong (giây)
};

export type LyricLine = {
  start: number; // giây — dòng hiện lên
  end: number; // giây — dòng tắt
  text: string;
  section?: string; // "Verse 1", "Chorus"...
  words?: WordTime[]; // thời gian từng chữ cho karaoke (npm run whisper / align)
  hook?: boolean; // câu hook: phóng lớn giữa màn hình (kiểu film)
};

// Một cảnh MV (kiểu film): clip AI / ảnh trong public/, hoặc "black" để cắt đen
export type Scene = {
  id?: string; // S01... theo kịch bản
  at: number; // giây bắt đầu cảnh
  src: string; // "HB-002/scenes/S01.mp4" | ảnh | "black"
  rate?: number; // tốc độ phát clip (0.6 = chậm lại cho đủ dài cảnh)
  cut?: boolean; // true = cắt thẳng, mặc định mờ chéo 0.8s
  offset?: number; // bắt đầu clip từ giây này (dùng lại một clip ở đoạn khác)
  flip?: boolean; // lật ngang — dùng lại clip mà không lộ là lặp
};

export type Song = {
  id: string; // HB-002
  title: string;
  artist: string;
  style: StyleId;
  accent: string; // màu nhấn theo series (docs/02)
  audio: string; // đường dẫn trong public/, vd "HB-002/audio.wav"
  background?: string; // ảnh hoặc video nền trong public/ (kiểu "film")
  emphasis?: string[]; // từ khóa tô màu nhấn, vd ["giông", "rễ"]
  scenes?: Scene[]; // phân cảnh MV — thiếu file thì cảnh đó tự dùng nền mặc định
  shots?: Shot[]; // phân cảnh MV hoạt hình (tuyến người + tuyến cây)
  anim?: AnimKey[]; // kịch bản chuyển động cho kiểu "anim" (MV hoạt hình) — xem src/anim/params.ts
  synced: boolean; // false = thời gian đang là ước lượng, chưa tap-sync
  titleAt?: [number, number]; // thời điểm hiện thẻ tên bài (mặc định đoạn dạo đầu, tối đa 8 s)
  logoAt?: [number, number]; // logo Senore mở đầu (giây bắt đầu, kết thúc)
  outroAt?: number; // thời điểm hiện dòng "senore" cuối bài (mặc định ngay sau câu cuối)
  noBars?: boolean; // không dùng dải đen điện ảnh 2.39:1
  fps?: number; // khung hình/giây của bài (mặc định 30; 24 cho hoạt hình vẽ trên 2s/3s)
  brush?: { at: number; src: string }[]; // video màu nước p5.brush (brush/) theo thời gian bài — cảnh "brush"
  art?: string[]; // tranh đã vẽ trong public/HB-xxx/art (npm run assets tự ghi) — cảnh "painted" bỏ qua tranh chưa có
  depth?: boolean; // tranh nền dùng video chiều sâu 2.5D (npm run depth) thay ảnh tĩnh — kiểu anim, cảnh "painted"
  noLyrics?: boolean; // bản "sạch" không phụ đề (npm run render -- --clean) để dựng tiếp trong DaVinci Resolve
  lyricsTop?: boolean; // phụ đề ở phía trên khung (khi hành động diễn ra ở nửa dưới)
  lines: LyricLine[];
};

export type LyricVideoProps = {
  song: Song;
  // Chỉ dùng cho Shorts: cắt một đoạn của bài
  clipStart?: number;
  clipEnd?: number;
  // Điền tự động từ file audio (calculateMetadata)
  songDuration?: number;
};
