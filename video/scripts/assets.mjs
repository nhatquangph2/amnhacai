#!/usr/bin/env node
// Tạo tranh cho MV tự động bằng AI có sẵn trên máy — không cần API key:
//   • agy   (mặc định) — Google Antigravity CLI, Nano Banana, dùng tài khoản Google
//   • codex             — Codex CLI trong app ChatGPT/GPT, gpt-image (tốn hạn mức ChatGPT hơn)
//   • pollinations      — gen.pollinations.ai, cần key MIỄN PHÍ (enter.pollinations.ai → Keys), lưu vào video/.env:
//                         POLLINATIONS_KEY=sk_…   (model: POLLINATIONS_MODEL, mặc định openai/gpt-image-2)
//
//   npm run assets -- HB-001                     # vẽ các tranh còn thiếu trong assets/HB-001.json
//   npm run assets -- HB-001 --only girl         # chỉ vẽ tranh có id chứa "girl"
//   npm run assets -- HB-001 --redo plate-town   # vẽ lại một tranh
//   npm run assets -- HB-001 --provider codex    # dùng Codex thay Antigravity
//   npm run assets -- HB-001 --wait              # hết hạn mức Antigravity → tự chờ tới giờ reset rồi vẽ tiếp (chạy nền qua đêm)
//   npm run assets -- HB-001 --fallback codex    # hết hạn mức Antigravity → chuyển sang Codex cho phần còn lại
//   npm run assets -- HB-001 --fallback pollinations   # … hoặc sang Pollinations (miễn phí, hợp tranh phụ)
//
// Manifest (assets/HB-xxx.json):
//   { "style": "…phong cách chung…",
//     "assets": [ { "id": "plate-wild", "prompt": "…" },
//                 { "id": "plate-town", "edit": "plate-wild", "prompt": "Giữ nguyên bố cục… thêm…" },
//                 { "id": "girl-walk", "refs": ["girl-sheet"], "prompt": "…", "key": true } ] }
//   edit: sửa trên tranh có sẵn (giữ bố cục) · refs: tranh mẫu để giữ nhân vật giống · key: tách nền xanh → PNG trong suốt
//   aspect: "16:9" (mặc định tranh nền) · "2:3" (mặc định nhân vật key) · "3:2" · "1:1" …
// Tranh lưu ở public/HB-xxx/art/<id>.png; nhật ký prompt ở assets/HB-xxx.log.json (bằng chứng nguồn gốc — docs/05).
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CODEX = process.env.CODEX_BIN ?? "/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex";
const AGY = process.env.AGY_BIN ?? path.join(os.homedir(), ".local/bin/agy");
const AGY_BRAIN = path.join(os.homedir(), ".gemini/antigravity-cli/brain");
const PY = path.join(VIDEO, ".venv/bin/python");

const args = process.argv.slice(2);
const id = args[0];
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i > 0 ? args[i + 1] : undefined;
};
const manifestFile = path.join(VIDEO, "assets", `${id}.json`);
if (!id || !fs.existsSync(manifestFile)) {
  console.error("Dùng: npm run assets -- HB-001 [--only <chuỗi>] [--redo <id>] [--jobs 2] [--provider agy|codex|pollinations] [--fallback …] [--wait]");
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
let provider = opt("provider") ?? manifest.provider ?? "agy";
const binOf = (p) => (p === "codex" ? CODEX : AGY);
// Key Pollinations: biến môi trường hoặc video/.env (đã gitignore)
const envFile = path.join(VIDEO, ".env");
if (fs.existsSync(envFile))
  for (const l of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
const checkProvider = (p) => {
  if (p === "pollinations") {
    if (!process.env.POLLINATIONS_KEY) throw new Error("Thiếu POLLINATIONS_KEY — tạo key miễn phí ở https://enter.pollinations.ai rồi ghi vào video/.env");
  } else if (!fs.existsSync(binOf(p))) throw new Error(`Không thấy ${p} ở ${binOf(p)}`);
};
checkProvider(provider);
const waitOnQuota = args.includes("--wait");
const fallback = opt("fallback");
if (fallback) checkProvider(fallback);

const outDir = path.join(VIDEO, "public", id, "art");
fs.mkdirSync(outDir, { recursive: true });
const logFile = path.join(VIDEO, "assets", `${id}.log.json`);
const log = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, "utf8")) : {};
const fileOf = (aid) => path.join(outDir, `${aid}.png`);
const redo = opt("redo");
const only = opt("only");
const jobs = Number(opt("jobs") ?? 2);

const todo = manifest.assets.filter((a) => (!only || a.id.includes(only)) && (a.id === redo || !fs.existsSync(fileOf(a.id))));
if (!todo.length) {
  console.log("✓ Đủ tranh rồi. (--redo <id> để vẽ lại)");
  process.exit(0);
}

const run = (cmd, argv) =>
  new Promise((resolve) => {
    const p = spawn(cmd, argv, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ code, out }));
  });

// Nội dung yêu cầu vẽ (chung cho mọi provider)
const describe = (a) =>
  [
    a.edit
      ? "EDIT the first reference image: keep the exact same camera, framing, horizon line, river, and the large boulder in exactly the same place and size. Change only what is described."
      : "",
    a.refs?.length ? "Use the reference image(s) of the character only for look, proportions, clothing colors and art style — keep them consistent." : "",
    `Art style: ${manifest.style}`,
    a.key ? "Draw the subject alone, full body, centered, on a perfectly flat pure green (#00FF00) background. No ground, no shadow, no other objects, no text." : "No text, no watermark, no borders.",
    `Image: ${a.prompt}`,
  ]
    .filter(Boolean)
    .join("\n");

// --- Antigravity: gọi generate_image, lấy file từ thư mục "brain" của phiên (không cần quyền chạy lệnh)
const drawAgy = async (a, refs, aspect) => {
  const name = a.id.replace(/[^a-z0-9]+/gi, "_").toLowerCase().split("_").slice(0, 3).join("_");
  const prompt = [
    "Call the generate_image tool exactly ONCE with these arguments, then reply DONE. Do not run any commands or edit files.",
    `ImageName: "${name}"`,
    `AspectRatio: "${aspect}"`,
    refs.length ? `ImagePaths: ${JSON.stringify(refs)}` : "ImagePaths: (none)",
    "Prompt:",
    describe(a),
  ].join("\n");
  const { out } = await run(AGY, ["-p", prompt, "--output-format", "stream-json", "--print-timeout", "6m"]);
  // Hết hạn mức: báo giờ reset để vòng ngoài chờ hoặc chuyển provider
  if (/RESOURCE_EXHAUSTED|exhausted your capacity/.test(out)) {
    const reset = out.match(/quotaResetTimeStamp[^0-9]*([0-9T:\-]+Z)/)?.[1];
    return { quota: reset ? Date.parse(reset) : Date.now() + 60 * 60 * 1000 };
  }
  const conv = out.match(/"conversation_id":"([0-9a-f-]+)"/)?.[1];
  if (!conv) return { err: out.slice(-400) };
  const dir = path.join(AGY_BRAIN, conv);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).map((f) => path.join(dir, f)) : [];
  if (!files.length) {
    // Máy chủ ảnh của Google quá tải (503 MODEL_CAPACITY_EXHAUSTED): lỗi tạm thời → coi như chờ 5 phút rồi thử lại
    const tr = path.join(dir, ".system_generated/logs/transcript.jsonl");
    if (fs.existsSync(tr) && /MODEL_CAPACITY_EXHAUSTED|503 Service Unavailable/.test(fs.readFileSync(tr, "utf8"))) return { quota: Date.now() + 5 * 60 * 1000, busy: true };
    return { err: `Antigravity không tạo ảnh (phiên ${conv})` };
  }
  files.sort((x, y) => fs.statSync(y).mtimeMs - fs.statSync(x).mtimeMs);
  return { file: files[0], conv };
};

// --- Codex: image_generation, tự lưu file theo đường dẫn
const drawCodex = async (a, refs, aspect) => {
  const tmp = path.join(outDir, `.${a.id}.codex.png`);
  const prompt = ["Use your image generation tool to create exactly ONE image.", `Aspect ratio: ${aspect}.`, describe(a), `Save the final image as PNG to exactly this path: ${tmp}`, "Reply with only the saved path."].join("\n");
  // prompt đặt TRƯỚC -i: cờ -i nhận nhiều giá trị nên sẽ "nuốt" mọi thứ phía sau
  const { out } = await run(CODEX, ["exec", "--skip-git-repo-check", "-C", outDir, prompt, ...refs.flatMap((r) => ["-i", r])]);
  return fs.existsSync(tmp) ? { file: tmp } : { err: out.split("\n").slice(-6).join(" ") };
};

// --- Pollinations: API kiểu OpenAI, tranh mẫu gửi dạng data URI (không cần tải ảnh lên đâu)
const POLL_SIZE = { "16:9": "1536x864", "9:16": "864x1536", "2:3": "1024x1536", "3:2": "1536x1024", "1:1": "1024x1024", "4:3": "1344x1008", "3:4": "1008x1344" };
const drawPollinations = async (a, refs, aspect) => {
  const model = process.env.POLLINATIONS_MODEL ?? "openai/gpt-image-2";
  // Sửa tranh: giữ đúng kích thước tranh gốc (đọc từ header PNG) để các lớp ghép bằng code không lệch
  const src = a.edit ? fs.readFileSync(refs[0]) : null;
  const size = src ? `${src.readUInt32BE(16)}x${src.readUInt32BE(20)}` : (POLL_SIZE[aspect] ?? "1536x864");
  const body = { model, prompt: describe(a), size, response_format: "b64_json" };
  if (refs.length) body.image = refs.map((r) => ({ image_url: `data:image/png;base64,${fs.readFileSync(r).toString("base64")}` }));
  const res = await fetch(`https://gen.pollinations.ai/v1/images/${refs.length ? "edits" : "generations"}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.POLLINATIONS_KEY}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(6 * 60 * 1000),
  }).catch((e) => ({ ok: false, status: 0, text: async () => String(e) }));
  if (!res.ok) {
    const txt = (await res.text()).slice(0, 300);
    // Hết Pollen / quá nhanh: coi như hết hạn mức, thử lại sau 1 giờ
    if (res.status === 402 || res.status === 429) return { quota: Date.now() + 60 * 60 * 1000 };
    return { err: `Pollinations ${res.status}: ${txt}` };
  }
  const b64 = (await res.json()).data?.[0]?.b64_json;
  if (!b64) return { err: "Pollinations không trả ảnh" };
  const tmp = path.join(outDir, `.${a.id}.poll.img`);
  fs.writeFileSync(tmp, Buffer.from(b64, "base64"));
  return { file: tmp, conv: model };
};

const PROVIDERS = { agy: drawAgy, codex: drawCodex, pollinations: drawPollinations };
const TOOL_NAME = {
  agy: "Google Antigravity CLI generate_image (Nano Banana)",
  codex: "Codex CLI image_generation (gpt-image)",
  pollinations: "Pollinations API",
};

const draw = async (a) => {
  const refIds = [...(a.edit ? [a.edit] : []), ...(a.refs ?? [])];
  const missing = refIds.filter((r) => !fs.existsSync(fileOf(r)));
  if (missing.length) return { a, ok: false, err: `thiếu tranh gốc: ${missing.join(", ")}` };
  const aspect = a.aspect ?? (a.key ? "2:3" : "16:9");
  const t0 = Date.now();
  const res = await PROVIDERS[provider](a, refIds.map(fileOf), aspect);
  if (res.quota) return { a, ok: false, quota: res.quota, busy: res.busy };
  if (!res.file) return { a, ok: false, err: res.err };
  // Chuẩn hoá về PNG; nhân vật: tách nền xanh
  const script = a.key ? path.join(VIDEO, "scripts/chroma.py") : null;
  const conv = script
    ? await run(PY, [script, res.file, fileOf(a.id)])
    : await run(PY, ["-c", "import sys;from PIL import Image;Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2])", res.file, fileOf(a.id)]);
  if (conv.code !== 0) return { a, ok: false, err: conv.out };
  if (res.file.startsWith(outDir)) fs.rmSync(res.file, { force: true });
  log[a.id] = {
    prompt: a.prompt,
    edit: a.edit,
    refs: a.refs,
    aspect,
    style: manifest.style,
    tool: TOOL_NAME[provider] + (provider === "pollinations" ? ` — ${res.conv}` : ""),
    session: res.conv,
    date: new Date().toISOString(),
    seconds: Math.round((Date.now() - t0) / 1000),
  };
  return { a, ok: true };
};

console.log(`Vẽ ${todo.length} tranh cho ${id} bằng ${provider} (song song ${jobs})…`);
// Vẽ theo "tầng": tranh gốc trước, tranh sửa/tham chiếu sau khi gốc đã có
const pending = [...todo];
const failed = [];
while (pending.length) {
  const ready = pending.filter((a) => [...(a.edit ? [a.edit] : []), ...(a.refs ?? [])].every((r) => !pending.some((p) => p.id === r)));
  if (!ready.length) {
    failed.push(...pending.map((a) => ({ a, err: "phụ thuộc tranh chưa vẽ được" })));
    break;
  }
  const results = await Promise.all(ready.slice(0, provider === "agy" ? 1 : jobs).map(draw));
  const quota = results.find((r) => r.quota)?.quota;
  const busy = results.find((r) => r.quota)?.busy;
  if (quota && busy) {
    // máy chủ ảnh quá tải (503) — không phải hết lượt: luôn chờ rồi thử lại
    console.log(`  ⏸ ${provider}: máy chủ ảnh của Google đang quá tải (503) — thử lại lúc ${new Date(quota).toLocaleTimeString("vi")}`);
    await new Promise((r) => setTimeout(r, Math.max(quota - Date.now(), 0)));
    for (const r of results) if (r.ok) pending.splice(pending.indexOf(r.a), 1), console.log(`  ✓ ${r.a.id}`);
    continue;
  }
  if (quota) {
    // Hết hạn mức: giữ tranh trong hàng đợi
    if (fallback && fallback !== provider) {
      console.log(`  ⏸ ${provider} hết hạn mức → chuyển sang ${fallback}`);
      provider = fallback;
    } else if (waitOnQuota) {
      const ms = Math.max(quota - Date.now(), 0) + 60 * 1000;
      console.log(`  ⏸ ${provider} hết hạn mức — chờ tới ${new Date(quota + 60000).toLocaleTimeString("vi")} (${Math.round(ms / 60000)} phút) rồi vẽ tiếp…`);
      await new Promise((r) => setTimeout(r, ms));
    } else {
      console.log(`  ⏸ ${provider} hết hạn mức, reset lúc ${new Date(quota).toLocaleTimeString("vi")}. Chạy lại với --wait (tự chờ) hoặc --fallback codex.`);
      failed.push(...pending.map((a) => ({ a, err: "chưa vẽ (hết hạn mức)" })));
      break;
    }
    for (const r of results) if (r.ok) pending.splice(pending.indexOf(r.a), 1), console.log(`  ✓ ${r.a.id}`);
    continue;
  }
  for (const r of results) {
    pending.splice(pending.indexOf(r.a), 1);
    if (r.ok) console.log(`  ✓ ${r.a.id}`);
    else {
      console.log(`  ✗ ${r.a.id}: ${r.err}`);
      failed.push(r);
    }
  }
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2) + "\n");
}
// Ghi danh sách tranh đã có vào bài hát → cảnh "painted" chỉ dùng tranh có thật
const songFile = path.join(VIDEO, "src/songs", `${id}.json`);
if (fs.existsSync(songFile)) {
  const song = JSON.parse(fs.readFileSync(songFile, "utf8"));
  song.art = fs.readdirSync(outDir).filter((f) => f.endsWith(".png") && !f.startsWith(".")).map((f) => f.slice(0, -4)).sort();
  fs.writeFileSync(songFile, JSON.stringify(song, null, 2) + "\n");
}
console.log(failed.length ? `\n${failed.length} tranh lỗi — chạy lại lệnh để thử tiếp` : `\n✓ Xong — public/${id}/art/`);
process.exit(failed.length ? 1 : 0);
