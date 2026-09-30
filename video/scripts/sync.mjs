#!/usr/bin/env node
// Máy chủ nhỏ cho công cụ căn lời tools/tap-sync.html
//   npm run sync -- HB-002    → mở http://localhost:3123
// Nghe bài, gõ Space đúng lúc mỗi dòng bắt đầu hát, bấm Lưu → ghi vào src/songs/HB-002.json
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const id = process.argv[2];
const songFile = path.join(VIDEO, "src/songs", `${id}.json`);
if (!id || !fs.existsSync(songFile)) {
  console.error(`Dùng: npm run sync -- HB-002   (chạy "npm run prep -- ${id ?? "HB-xxx"} --audio ..." trước)`);
  process.exit(1);
}
const PORT = Number(process.env.PORT ?? 3123);
const MIME = { ".wav": "audio/wav", ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".flac": "audio/flac" };

const serveAudio = (req, res) => {
  const song = JSON.parse(fs.readFileSync(songFile, "utf8"));
  const file = path.join(VIDEO, "public", song.audio || "__none__");
  if (!song.audio || !fs.existsSync(file)) return res.writeHead(404).end("Chưa có audio — chạy npm run prep với --audio");
  const size = fs.statSync(file).size;
  const type = MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  // Hỗ trợ Range để tua được trong trình duyệt
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? "");
  if (m) {
    const start = m[1] ? Number(m[1]) : 0;
    const end = m[2] ? Number(m[2]) : size - 1;
    res.writeHead(206, {
      "Content-Type": type,
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
    });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
  fs.createReadStream(file).pipe(res);
};

http
  .createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(fs.readFileSync(path.join(VIDEO, "tools/tap-sync.html")));
    }
    if (req.method === "GET" && req.url === "/song") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(fs.readFileSync(songFile));
    }
    if (req.method === "GET" && req.url === "/audio") return serveAudio(req, res);
    if (req.method === "POST" && req.url === "/song") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        try {
          const song = JSON.parse(body);
          if (!Array.isArray(song.lines)) throw new Error("thiếu lines");
          fs.writeFileSync(songFile, JSON.stringify(song, null, 2) + "\n");
          console.log(`✓ Đã lưu ${path.relative(VIDEO, songFile)} (${song.lines.length} dòng)`);
          res.writeHead(200).end("ok");
        } catch (e) {
          res.writeHead(400).end(String(e));
        }
      });
      return;
    }
    res.writeHead(404).end();
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log(`Căn lời ${id}: http://localhost:${PORT}   (Ctrl+C để dừng)`);
  });
