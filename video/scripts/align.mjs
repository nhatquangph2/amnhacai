#!/usr/bin/env node
// Căn lời tự động từ bản chép lời Whisper (MacWhisper, whisper, whisper.cpp...):
//   npm run align -- HB-002                         (mặc định: transcripts/HB-002.whisper.json từ `npm run whisper`)
//   npm run align -- HB-002 ~/Downloads/Sau-Mua-Giong.srt
//
// Whisper nghe tiếng Việt do AI hát hay sai chữ, nên KHÔNG dùng chữ của Whisper —
// chỉ mượn MỐC THỜI GIAN: ghép từng âm tiết lời gốc với âm tiết Whisper nghe được
// (so khớp có/không dấu, kiểu Needleman–Wunsch), rồi suy ra giờ bắt đầu/kết thúc từng dòng.
// Nhận .srt, .vtt, .json (whisper / whisper.cpp, có hoặc không word timestamps), .csv, .txt có mốc [mm:ss].
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [id, arg] = process.argv.slice(2);
const songFile = path.join(VIDEO, "src/songs", `${id}.json`);
const input = arg ?? path.join(VIDEO, "transcripts", `${id}.whisper.json`);
if (!id || !fs.existsSync(songFile) || !fs.existsSync(input.replace(/^~(?=\/)/, process.env.HOME))) {
  console.error("Dùng: npm run align -- HB-002 <file .srt|.vtt|.json|.csv từ MacWhisper>");
  process.exit(1);
}
const file = path.resolve(input.replace(/^~(?=\/)/, process.env.HOME));
const raw = fs.readFileSync(file, "utf8").replace(/^﻿/, "");

// ---------- 1. Đọc bản Whisper → danh sách đoạn {start, end, text, words?} ----------
const ts = (s) => {
  if (typeof s === "number") return s;
  const p = String(s).trim().replace(",", ".").split(":").map(Number);
  return p.reduce((acc, v) => acc * 60 + v, 0);
};

const parseCues = (text) => {
  // SRT / VTT / txt: "00:00:20,880 --> 00:00:24,500" hoặc "[00:20.88 -> 00:24.50]"
  const out = [];
  const re = /(\d{1,2}:\d{2}(?::\d{2})?[.,]\d{1,3})\s*-->?\s*(\d{1,2}:\d{2}(?::\d{2})?[.,]\d{1,3})\]?(.*)/;
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (!m) continue;
    let body = m[3].trim();
    while (i + 1 < lines.length && lines[i + 1].trim() && !re.test(lines[i + 1]) && !/^\d+$/.test(lines[i + 1].trim())) {
      body += " " + lines[++i].trim();
    }
    out.push({ start: ts(m[1]), end: ts(m[2]), text: body.replace(/<[^>]+>/g, "") });
  }
  return out;
};

const parseJson = (data) => {
  // whisper: {segments:[{start,end,text,words:[{word,start,end}]}]}
  // whisper.cpp: {transcription:[{offsets:{from,to} (ms), text}]}
  const segs = data.segments ?? data.transcription ?? (Array.isArray(data) ? data : null);
  if (!segs) throw new Error("JSON không có segments/transcription");
  return segs.map((s) => {
    const start = s.offsets ? s.offsets.from / 1000 : ts(s.start ?? s.startTime ?? s.from);
    const end = s.offsets ? s.offsets.to / 1000 : ts(s.end ?? s.endTime ?? s.to);
    const words = (s.words ?? s.tokens ?? [])
      .filter((w) => (w.word ?? w.text ?? "").trim() && w.start != null)
      .map((w) => ({ text: (w.word ?? w.text).trim(), start: ts(w.start), end: ts(w.end) }));
    return { start, end, text: s.text ?? "", words: words.length ? words : undefined };
  });
};

const parseCsv = (text) => {
  const rows = text.trim().split(/\r?\n/).map((r) => r.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"')));
  const head = rows[0].map((h) => h.toLowerCase());
  const si = head.findIndex((h) => h.includes("start"));
  const ei = head.findIndex((h) => h.includes("end"));
  const ti = head.findIndex((h) => /text|transcript|word/.test(h));
  const ms = /ms|milli/.test(head[si]);
  return rows.slice(1).map((r) => ({
    start: ts(r[si]) / (ms ? 1000 : 1),
    end: ts(r[ei]) / (ms ? 1000 : 1),
    text: r[ti] ?? "",
  }));
};

const ext = path.extname(file).toLowerCase();
const segments = ext === ".json" ? parseJson(JSON.parse(raw)) : ext === ".csv" ? parseCsv(raw) : parseCues(raw);
if (!segments.length) throw new Error(`Không đọc được mốc thời gian nào trong ${path.basename(file)}`);

// ---------- 2. Tách âm tiết ----------
const clean = (w) => w.toLocaleLowerCase("vi").normalize("NFC").replace(/[^\p{L}\p{N}]/gu, "");
const bare = (w) => w.normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d");
const syll = (text) => text.split(/[\s\-–—…]+/).map(clean).filter(Boolean);

// Âm tiết Whisper kèm thời gian (nếu không có word timestamps: chia đều trong đoạn)
const heard = [];
for (const s of segments) {
  if (s.words) {
    for (const w of s.words) {
      const parts = syll(w.text);
      parts.forEach((p, k) => {
        const d = (w.end - w.start) / parts.length;
        heard.push({ s: p, start: w.start + k * d, end: w.start + (k + 1) * d });
      });
    }
  } else {
    const parts = syll(s.text);
    const d = (s.end - s.start) / Math.max(parts.length, 1);
    parts.forEach((p, k) => heard.push({ s: p, start: s.start + k * d, end: s.start + (k + 1) * d }));
  }
}

const song = JSON.parse(fs.readFileSync(songFile, "utf8"));
const lyric = song.lines.flatMap((l, li) => syll(l.text).map((s) => ({ s, li })));

// ---------- 3. Ghép chuỗi (Needleman–Wunsch) ----------
const score = (a, b) => (a === b ? 2 : bare(a) === bare(b) ? 1.2 : -1);
const GAP_LYRIC = -0.3; // Whisper nghe sót một âm tiết lời — rất hay gặp khi có nhạc
const GAP_HEARD = -0.5; // Whisper nghe thừa (ảo giác, tiếng nền)
const n = lyric.length;
const m = heard.length;
const F = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
const B = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1)); // 0 chéo, 1 bỏ lời, 2 bỏ whisper
for (let i = 1; i <= n; i++) (F[i][0] = i * GAP_LYRIC), (B[i][0] = 1);
for (let j = 1; j <= m; j++) (F[0][j] = 0), (B[0][j] = 2); // bỏ qua tiếng ồn/ảo giác trước lời đầu: miễn phí
for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= m; j++) {
    const d = F[i - 1][j - 1] + score(lyric[i - 1].s, heard[j - 1].s);
    const u = F[i - 1][j] + GAP_LYRIC;
    const l = F[i][j - 1] + (i === n ? 0 : GAP_HEARD); // phần thừa sau lời cuối: miễn phí
    const best = Math.max(d, u, l);
    F[i][j] = best;
    B[i][j] = best === d ? 0 : best === u ? 1 : 2;
  }
}
const match = new Array(n).fill(null);
for (let i = n, j = m; i > 0 || j > 0; ) {
  const b = i === 0 ? 2 : j === 0 ? 1 : B[i][j];
  if (b === 0) {
    if (score(lyric[i - 1].s, heard[j - 1].s) > 0) match[i - 1] = heard[j - 1];
    i--, j--;
  } else if (b === 1) i--;
  else j--;
}

// ---------- 4. Suy ra thời gian từng dòng ----------
const SYL = 0.32; // độ dài trung bình 1 âm tiết khi hát (giây) — dùng để bù âm tiết không khớp
const result = song.lines.map((line, li) => {
  const idx = lyric.map((x, k) => (x.li === li ? k : -1)).filter((k) => k >= 0);
  const hits = idx.filter((k) => match[k]);
  if (!hits.length) return { start: null, end: null, conf: 0 };
  const first = hits[0];
  const last = hits[hits.length - 1];
  return {
    start: match[first].start - (first - idx[0]) * SYL,
    end: match[last].end + (idx[idx.length - 1] - last) * SYL,
    conf: hits.length / idx.length,
  };
});

// Dòng không khớp được: nội suy giữa hai dòng lân cận
for (let i = 0; i < result.length; i++) {
  if (result[i].start != null) continue;
  let a = i - 1;
  while (a >= 0 && result[a].start == null) a--;
  let b = i + 1;
  while (b < result.length && result[b].start == null) b++;
  const t0 = a >= 0 ? result[a].end : Math.max(0, (result[b]?.start ?? 10) - 5 * (b - a));
  const t1 = b < result.length ? result[b].start : t0 + 5 * (b - a);
  const k = (i - a) / (b - a);
  const k1 = (i - a + 1) / (b - a);
  result[i] = { start: t0 + (t1 - t0) * k, end: t0 + (t1 - t0) * k1 - 0.1, conf: 0 };
}

const r2 = (x) => Math.round(x * 100) / 100;

// Thời gian TỪNG CHỮ (cho hiệu ứng karaoke): âm tiết khớp lấy giờ Whisper,
// âm tiết không khớp chia đều khoảng trống giữa hai âm tiết khớp gần nhất trong dòng.
const wordTimes = (li) => {
  const { start: ls, end: le } = result[li];
  const idx = lyric.map((x, k) => (x.li === li ? k : -1)).filter((k) => k >= 0);
  const times = idx.map((k) => (match[k] ? { s: match[k].start, e: match[k].end } : null));
  for (let i = 0; i < times.length; i++) {
    if (times[i]) continue;
    let j = i;
    while (j < times.length && !times[j]) j++;
    const from = i > 0 ? times[i - 1].e : ls;
    const to = j < times.length ? times[j].s : le;
    const step = Math.max(to - from, 0.1 * (j - i)) / (j - i);
    for (let k = i; k < j; k++) times[k] = { s: from + (k - i) * step, e: from + (k - i + 1) * step };
    i = j - 1;
  }
  // Không để chữ sau bắt đầu trước chữ trước
  for (let i = 1; i < times.length; i++) times[i].s = Math.max(times[i].s, times[i - 1].s + 0.05);
  const out = [];
  let k = 0;
  for (const token of song.lines[li].text.split(/\s+/).filter(Boolean)) {
    const nSyl = syll(token).length;
    const prevEnd = out.length ? out[out.length - 1].e : ls;
    if (!nSyl) {
      out.push({ t: token, s: r2(prevEnd), e: r2(prevEnd) });
      continue;
    }
    const first = times[k];
    const last = times[k + nSyl - 1];
    out.push({ t: token, s: r2(first.s), e: r2(Math.max(last.e, first.s + 0.08)) });
    k += nSyl;
  }
  return out;
};

let prevStart = -Infinity;
song.lines = song.lines.map((line, i) => {
  const cur = result[i];
  const next = result[i + 1];
  let start = Math.max(0, cur.start - 0.15, prevStart + 0.3); // hiện chữ sớm hơn giọng một chút, không đi lùi
  prevStart = start;
  // Giữ chữ thêm chút sau khi hát xong; nếu sau đó là nhạc dạo dài thì tắt sớm
  let end = cur.end + 0.6;
  if (next) end = next.start - cur.end > 3 ? cur.end + 1.2 : Math.max(end, next.start - 0.2);
  if (next) end = Math.min(end, Math.max(next.start, start + 1) - 0.2);
  // Giữ dòng đến khi chữ cuối chạy màu xong (karaoke), trừ khi dòng sau đã phải hiện
  const words = wordTimes(i);
  end = Math.max(end, words[words.length - 1].e + 0.35);
  if (next) end = Math.min(end, next.start - 0.25);
  return { ...line, start: r2(start), end: r2(Math.max(end, start + 0.8)), words };
});
song.synced = true;
fs.writeFileSync(songFile, JSON.stringify(song, null, 2) + "\n");

// ---------- 5. Báo cáo ----------
const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
console.log(`Whisper: ${segments.length} đoạn, ${heard.length} âm tiết · Lời: ${n} âm tiết\n`);
song.lines.forEach((l, i) => {
  const c = result[i].conf;
  const flag = c === 0 ? "❌ nội suy" : c < 0.5 ? "⚠️ " + Math.round(c * 100) + "%" : "  " + Math.round(c * 100) + "%";
  console.log(`${fmt(l.start).padStart(6)} → ${fmt(l.end).padStart(6)}  ${flag.padEnd(10)} ${l.text}`);
});
const weak = result.filter((r) => r.conf < 0.5).length;
console.log(`\n✓ Đã ghi src/songs/${id}.json` + (weak ? ` — ${weak} dòng khớp yếu (⚠️/❌): kiểm tra bằng npm run sync -- ${id} và bấm vào dòng để gõ lại` : ""));
