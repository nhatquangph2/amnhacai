#!/usr/bin/env node
// Chuẩn bị một bài để dựng video:
//   npm run prep -- HB-002 --audio ~/Drive/03-Master/HB-002_sau-mua-giong_master.wav
//   npm run prep -- HB-002 --background ~/Downloads/kling-cay-trong-bao.mp4 --style film
//   npm run prep -- HB-002 --scenes ~/Downloads/mv-hb002     (clip MV S01.mp4, S02.mp4… theo mv-script.md)
//
// - chép font thương hiệu, audio, ảnh bìa, nền vào public/ (không commit)
// - lần đầu: tạo src/songs/HB-002.json từ releases/HB-002_*/lyrics.txt với thời gian ƯỚC LƯỢNG
//   → sau đó chạy `npm run sync -- HB-002` để căn thời gian thật.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.resolve(VIDEO, "..");
const PUBLIC = path.join(VIDEO, "public");

const ACCENT = { "dung-day": "#D9622B", "doi-nguoi": "#7A5C43", "y-nghia": "#23304A", "nghe-thuat": "#6B7A4B" };
const STYLES = ["paper", "film", "dark"];

const args = process.argv.slice(2);
const id = args[0];
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i > 0 ? args[i + 1] : undefined;
};
if (!id || !/^HB-\d+$/.test(id)) {
  console.error("Dùng: npm run prep -- HB-002 [--audio file.wav] [--background ảnh|video] [--scenes thư-mục-clip] [--style paper|film|dark]");
  process.exit(1);
}
const style = opt("style");
if (style && !STYLES.includes(style)) throw new Error(`--style phải là: ${STYLES.join(", ")}`);

const releaseDir = fs
  .readdirSync(path.join(ROOT, "releases"))
  .map((d) => path.join(ROOT, "releases", d))
  .find((d) => path.basename(d).startsWith(`${id}_`));
if (!releaseDir) throw new Error(`Không thấy releases/${id}_*/`);

const copy = (src, destRel) => {
  const dest = path.join(PUBLIC, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  ✓ ${path.relative(ROOT, src)} → public/${destRel}`);
  return destRel;
};

// 1. Font
copy(path.join(ROOT, "brand/fonts/Lora[wght].ttf"), "fonts/Lora.ttf");
copy(path.join(ROOT, "brand/fonts/BeVietnamPro-Medium.ttf"), "fonts/BeVietnamPro-Medium.ttf");

// 2. Ảnh bìa
const cover = path.join(releaseDir, "cover.jpg");
if (fs.existsSync(cover)) copy(cover, `${id}/cover.jpg`);

// 3. Audio / nền
const expand = (p) => path.resolve(p.replace(/^~(?=\/)/, process.env.HOME));
const audioArg = opt("audio");
const audio = audioArg ? copy(expand(audioArg), `${id}/audio${path.extname(audioArg).toLowerCase()}`) : undefined;
const bgArg = opt("background");
const background = bgArg ? copy(expand(bgArg), `${id}/bg${path.extname(bgArg).toLowerCase()}`) : undefined;
const scenesArg = opt("scenes");
if (scenesArg) {
  const dir = expand(scenesArg);
  const clips = fs.readdirSync(dir).filter((f) => /\.(mp4|mov|webm|jpe?g|png)$/i.test(f));
  for (const f of clips) copy(path.join(dir, f), `${id}/scenes/${f}`);
  console.log(`  ✓ ${clips.length} clip cảnh → public/${id}/scenes/ (khớp với "scenes" trong JSON theo tên file)`);
}

// 4. Hồ sơ bài hát
const songFile = path.join(VIDEO, "src/songs", `${id}.json`);
const meta = fs.readFileSync(path.join(releaseDir, "metadata.yaml"), "utf8");
const field = (k) => meta.match(new RegExp(`^${k}:\\s*"?([^"#\\n]*)"?`, "m"))?.[1]?.trim();

let song;
if (fs.existsSync(songFile)) {
  song = JSON.parse(fs.readFileSync(songFile, "utf8"));
} else {
  const SECTION = /^\[(.+)\]$|^((?:verse|pre-?chorus|chorus|final chorus|bridge|intro|outro|hook|rap|điệp khúc)[^:]*):?$/i;
  const lines = [];
  let section;
  for (const raw of fs.readFileSync(path.join(releaseDir, "lyrics.txt"), "utf8").split("\n")) {
    const text = raw.trim();
    if (!text) continue;
    const m = text.match(SECTION);
    if (m) section = (m[1] ?? m[2]).trim();
    else lines.push({ text, section });
  }
  // Thời gian ước lượng: rải đều từ 8% → 92% độ dài bài (để xem trước bố cục)
  const dur = Number(meta.match(/duration_sec:\s*([\d.]+)/)?.[1] ?? 180);
  const a = dur * 0.08;
  const step = (dur * 0.84) / lines.length;
  song = {
    id,
    title: field("title"),
    artist: field("artist") || "Senore",
    style: "paper",
    accent: ACCENT[field("series")] ?? "#D9622B",
    audio: "",
    emphasis: [],
    synced: false,
    lines: lines.map((l, i) => ({
      start: +(a + i * step).toFixed(2),
      end: +(a + (i + 1) * step - 0.2).toFixed(2),
      text: l.text,
      ...(l.section ? { section: l.section } : {}),
    })),
  };
  console.log(`  ✓ tạo src/songs/${id}.json (${lines.length} dòng, thời gian ước lượng)`);
}

if (audio) song.audio = audio;
if (background) song.background = background;
if (style) song.style = style;
if (!song.audio) {
  const found = fs.existsSync(path.join(PUBLIC, id)) && fs.readdirSync(path.join(PUBLIC, id)).find((f) => f.startsWith("audio."));
  if (found) song.audio = `${id}/${found}`;
}
fs.mkdirSync(path.dirname(songFile), { recursive: true });
fs.writeFileSync(songFile, JSON.stringify(song, null, 2) + "\n");

console.log(`\n${song.title} — kiểu "${song.style}", ${song.synced ? "đã căn thời gian" : "CHƯA căn thời gian"}`);
if (!song.audio) console.log(`⚠️  Chưa có audio: npm run prep -- ${id} --audio <file master .wav>`);
else if (!song.synced) console.log(`→ Căn lời: npm run sync -- ${id}`);
else console.log(`→ Xem trước: npm run studio   ·   Xuất: npm run render -- ${id}`);
