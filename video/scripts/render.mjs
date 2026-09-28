#!/usr/bin/env node
// Xuất video:
//   npm run render -- HB-002                 → out/HB-002_paper.mp4 (1920×1080, kiểu trong JSON)
//   npm run render -- HB-002 --style dark    → thử kiểu khác mà không sửa JSON
//   npm run render -- HB-002 --short         → out/HB-002_short.mp4 (1080×1920, điệp khúc đầu)
//   npm run render -- HB-002 --short --from 62 --to 95
//   npm run render -- HB-002 --still 90      → ảnh 1 khung hình ở giây 90 để duyệt nhanh
//                                              (với --short: tính từ đầu đoạn cắt)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const id = args[0];
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i > 0 ? args[i + 1] : undefined;
};
const songFile = path.join(VIDEO, "src/songs", `${id}.json`);
if (!id || !fs.existsSync(songFile)) {
  console.error("Dùng: npm run render -- HB-002 [--style paper|film|dark] [--short [--from s --to s]] [--still giây]");
  process.exit(1);
}
const song = JSON.parse(fs.readFileSync(songFile, "utf8"));
if (!song.audio) throw new Error(`Chưa có audio — npm run prep -- ${id} --audio <file>`);
if (!song.synced) console.warn("⚠️  Lời CHƯA được căn thời gian (npm run sync) — video chỉ để xem bố cục.\n");

const style = opt("style") ?? song.style;
const short = args.includes("--short");
const props = { song: { ...song, style } };
if (opt("from")) props.clipStart = Number(opt("from"));
if (opt("to")) props.clipEnd = Number(opt("to"));

const comp = short ? `${id}-short` : id;
const still = opt("still");
const out = path.join(
  "out",
  still ? `${id}_${style}_${still}s${short ? "_short" : ""}.png` : `${id}_${short ? "short_" : ""}${style}.mp4`,
);
const propsFile = path.join(VIDEO, "out", `.props-${id}.json`);
fs.mkdirSync(path.dirname(propsFile), { recursive: true });
fs.writeFileSync(propsFile, JSON.stringify(props));

const cli = still
  ? ["remotion", "still", "src/index.ts", comp, out, `--props=${propsFile}`, `--frame=${Math.round(Number(still) * 30)}`]
  : ["remotion", "render", "src/index.ts", comp, out, `--props=${propsFile}`, "--crf=18"];
const r = spawnSync("npx", cli, { cwd: VIDEO, stdio: "inherit" });
if (r.status === 0) console.log(`\n✓ ${path.join("video", out)}`);
process.exit(r.status ?? 1);
