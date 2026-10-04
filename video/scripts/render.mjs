#!/usr/bin/env node
// Xuất video:
//   npm run render -- HB-002                 → out/HB-002_paper.mp4 (1920×1080, kiểu trong JSON)
//   npm run render -- HB-002 --style dark    → thử kiểu khác mà không sửa JSON
//   npm run render -- HB-002 --short         → out/HB-002_short.mp4 (1080×1920, điệp khúc đầu)
//   npm run render -- HB-002 --short --from 62 --to 95
//   npm run render -- HB-001 --clean         → out/HB-001_anim_clean.mp4: không phụ đề, để dựng tiếp trong Resolve (npm run resolve)
//   npm run render -- HB-002 --still 90      → ảnh 1 khung hình ở giây 90 để duyệt nhanh
//                                              (với --short: tính từ đầu đoạn cắt)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("--"));
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && i < args.length - 1 ? args[i + 1] : undefined;
};
const songFile = path.join(VIDEO, "src/songs", `${id}.json`);
if (!id || !fs.existsSync(songFile)) {
  console.error("Dùng: npm run render -- HB-004 [--animatic] [--style paper|film|dark] [--short [--from s --to s]] [--still giây]");
  process.exit(1);
}
const song = JSON.parse(fs.readFileSync(songFile, "utf8"));
if (!song.audio) throw new Error(`Chưa có audio — npm run prep -- ${id} --audio <file>`);
if (!song.synced) console.warn("⚠️  Lời CHƯA được căn thời gian (npm run sync) — video chỉ để xem bố cục.\n");

const style = opt("style") ?? song.style;
const short = args.includes("--short");
const animatic = args.includes("--animatic");
const clean = args.includes("--clean");
const props = { song: { ...song, style, ...(clean ? { noLyrics: true } : {}) } };
for (const [flag, key] of [["from", "clipStart"], ["to", "clipEnd"]]) {
  if (opt(flag) === undefined) continue;
  const v = Number(opt(flag));
  if (!Number.isFinite(v)) throw new Error(`--${flag} phải là số giây, nhận được "${opt(flag)}"`);
  props[key] = v;
}

const comp = animatic ? `${id}-animatic` : (short ? `${id}-short` : id);
const still = opt("still");
const out = path.join(
  "out",
  still
    ? `${id}_${animatic ? "animatic" : style}_${still}s${short ? "_short" : ""}.png`
    : animatic
      ? `${id}_animatic${opt("from") ? `_clip-${opt("from")}s` : ""}.mp4`
      : `${id}_${short ? "short" : ""}${opt("from") ? `${short ? "-" : "clip-"}${opt("from")}s` : ""}${short || opt("from") ? "_" : ""}${style}${clean ? "_clean" : ""}.mp4`,
);
const propsFile = path.join(VIDEO, "out", `.props-${path.basename(out)}.json`); // riêng từng file → render song song được
fs.mkdirSync(path.dirname(propsFile), { recursive: true });
fs.writeFileSync(propsFile, JSON.stringify(props));

const cli = still
  ? ["remotion", "still", "src/index.ts", comp, out, `--props=${propsFile}`, `--frame=${Math.round(Number(still) * (song.fps ?? 30))}`]
  : ["remotion", "render", "src/index.ts", comp, out, `--props=${propsFile}`, "--crf=18", "--timeout=120000", ...(opt("concurrency") ? [`--concurrency=${opt("concurrency")}`] : ["--concurrency=4"])];
const r = spawnSync("npx", cli, { cwd: VIDEO, stdio: "inherit" });
if (r.status === 0) console.log(`\n✓ ${path.join("video", out)}`);
process.exit(r.status ?? 1);
