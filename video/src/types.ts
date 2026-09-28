// Dữ liệu một bài hát — mỗi bài là một file src/songs/HB-xxx.json
// (tạo bằng `npm run prep`, căn thời gian bằng tools/tap-sync.html)

export type StyleId = "paper" | "film" | "dark";

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
  synced: boolean; // false = thời gian đang là ước lượng, chưa tap-sync
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
