#!/usr/bin/env node
// Xuất timeline sang DaVinci Resolve (bản miễn phí đọc được) để tự tinh chỉnh:
//   npm run render -- HB-001 --clean     # (nên) bản không phụ đề → đổi kiểu chữ ngay trong Resolve
//   npm run resolve -- HB-001            # → out/HB-001_resolve/HB-001.fcpxml + HB-001.srt
//   npm run resolve -- HB-001 --video out/HB-001_anim.mp4   # chọn bản render khác
//
// Trong Resolve: File → Import → Timeline… → chọn .fcpxml (tích "Automatically import source clips into media pool").
//   • V1: bản render cắt sẵn tại mỗi chuyển cảnh (shots/scenes trong JSON) → kéo, cắt, đổi thứ tự, chỉnh màu từng cảnh
//   • A1: nhạc gốc liền một dải (hình cắt thế nào nhạc cũng không lệch)
//   • Marker trên dải nhạc: Verse / Chorus / Rap… và từng câu hook
// Phụ đề: File → Import → Subtitle… → .srt, kéo vào track phụ đề.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FPS = 30;
const args = process.argv.slice(2);
const id = args[0];
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i > 0 ? args[i + 1] : undefined;
};
const songFile = path.join(VIDEO, "src/songs", `${id}.json`);
if (!id || !fs.existsSync(songFile)) {
  console.error("Dùng: npm run resolve -- HB-001 [--video out/<file>.mp4]");
  process.exit(1);
}
const song = JSON.parse(fs.readFileSync(songFile, "utf8"));

// Bản render: ưu tiên bản sạch (không phụ đề)
const pick = opt("video") ?? [`out/${id}_${song.style}_clean.mp4`, `out/${id}_${song.style}.mp4`].find((f) => fs.existsSync(path.join(VIDEO, f)));
if (!pick || !fs.existsSync(path.join(VIDEO, pick))) {
  console.error(`Chưa có bản render — chạy: npm run render -- ${id} --clean`);
  process.exit(1);
}
const videoFile = path.resolve(VIDEO, pick);
const audioFile = path.join(VIDEO, "public", song.audio);
if (pick.endsWith("_clean.mp4") === false) console.warn("⚠️  Bản render có phụ đề in sẵn — nên `npm run render -- " + id + " --clean` để chữ chỉ nằm trong Resolve.");

// Độ dài bằng ffprobe có sẵn trong Remotion
const probe = (f) => {
  const r = spawnSync("npx", ["remotion", "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { cwd: VIDEO, encoding: "utf8" });
  const d = parseFloat(r.stdout.trim().split("\n").pop());
  if (!Number.isFinite(d)) throw new Error(`Không đọc được độ dài ${f}: ${r.stderr}`);
  return d;
};
const vDur = probe(videoFile);
const aDur = probe(audioFile);

// Thời gian FCPXML: số khung / 30
const fr = (s) => Math.round(s * FPS);
const T = (s) => `${fr(s)}/${FPS}s`;
const url = (f) => "file://" + encodeURI(f).replace(/#/g, "%23").replace(/\?/g, "%3F");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Điểm cắt: mỗi shot (kiểu anim) hoặc scene (kiểu film) — đúng với bản render đang dùng
const style = path.basename(videoFile).match(/_(paper|film|dark|anim)(_clean)?\.mp4$/)?.[1] ?? song.style;
const parts = style === "anim" ? (song.shots ?? []) : style === "film" ? (song.scenes ?? []) : [];
const cuts = [...new Set([0, ...parts.map((s) => s.at)].map(fr))]
  .filter((f) => f < fr(vDur))
  .sort((a, b) => a - b);
const names = new Map();
for (const s of parts) names.set(fr(s.at), s.scene ?? s.id ?? path.basename(s.src));
const segs = cuts.map((f, i) => ({ f0: f, f1: cuts[i + 1] ?? fr(vDur), name: names.get(f) ?? "mở đầu" }));

// Marker: đầu mỗi đoạn + câu hook
const markers = [];
let sec;
for (const l of song.lines) {
  if (l.section && l.section !== sec) markers.push({ t: l.start, v: l.section });
  else if (l.hook) markers.push({ t: l.start, v: `hook: ${l.text}` });
  sec = l.section ?? sec;
}

const total = T(Math.max(vDur, aDur));
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <resources>
    <format id="r0" name="FFVideoFormat1080p30" frameDuration="1/${FPS}s" width="1920" height="1080"/>
    <asset id="r1" name="${esc(path.basename(videoFile))}" src="${url(videoFile)}" start="0s" duration="${T(vDur)}" hasVideo="1" hasAudio="1" format="r0" audioSources="1" audioChannels="2" audioRate="48000"/>
    <asset id="r2" name="${esc(path.basename(audioFile))}" src="${url(audioFile)}" start="0s" duration="${T(aDur)}" hasAudio="1" audioSources="1" audioChannels="2" audioRate="48000"/>
  </resources>
  <library>
    <event name="${esc(song.title)}">
      <project name="${esc(`${id} ${song.title} — MV`)}">
        <sequence format="r0" duration="${total}" tcStart="0s" tcFormat="NDF" audioLayout="stereo" audioRate="48k">
          <spine>
${segs
  .map(
    (s, i) => `            <asset-clip ref="r1" name="${esc(`${String(i + 1).padStart(2, "0")} ${s.name}`)}" offset="${s.f0}/${FPS}s" start="${s.f0}/${FPS}s" duration="${s.f1 - s.f0}/${FPS}s" srcEnable="video">${
      i === 0
        ? `
              <asset-clip ref="r2" lane="-1" name="${esc(song.title)} (nhạc gốc)" offset="0s" start="0s" duration="${T(aDur)}" srcEnable="audio">
${markers.map((m) => `                <marker start="${T(m.t)}" duration="1/${FPS}s" value="${esc(m.v)}"/>`).join("\n")}
              </asset-clip>
            `
        : ""
    }</asset-clip>`,
  )
  .join("\n")}
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
`;

// Phụ đề SRT (theo dòng lời đã căn Whisper)
const ts = (s) => {
  const ms = Math.round(s * 1000);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
const srt = song.lines.map((l, i) => `${i + 1}\n${ts(l.start)} --> ${ts(l.end)}\n${l.text}\n`).join("\n");

const outDir = path.join(VIDEO, "out", `${id}_resolve`);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `${id}.fcpxml`), xml);
fs.writeFileSync(path.join(outDir, `${id}.srt`), srt);
console.log(`✓ video/out/${id}_resolve/${id}.fcpxml — ${segs.length} cảnh, ${markers.length} marker, hình: ${path.basename(videoFile)}`);
console.log(`✓ video/out/${id}_resolve/${id}.srt — ${song.lines.length} dòng phụ đề`);
console.log("Resolve: File → Import → Timeline… (.fcpxml) · File → Import → Subtitle… (.srt)");
