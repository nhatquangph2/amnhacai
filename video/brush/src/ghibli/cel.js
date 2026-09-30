// cel.js: kiểu "phim hoạt hình Nhật cổ điển" (cảm hứng Ghibli) — vẽ bằng code, không dùng AI.
// Khác kiểu màu nước: nét viền mảnh, SẠCH, ĐỨNG YÊN (không rung); nhân vật tô cel = màu nền + 1 tông bóng + vệt sáng;
// nền gouache: mảng màu phẳng chồng lớp, không viền, có vân giấy nhẹ.
const CEL = {
  line: '#3B2A26',
  sky: ['#2F7FCB', '#4F9BDB', '#7DB9E6', '#B4D9F0', '#DDEDF2'],
  cloud: '#FDFCF6', cloudSh: '#C4D2E6', cloudSh2: '#A9BCD8',
  mtnFar: '#8FB4C8', mtnNear: '#6E9E8E',
  treeDk: '#2E5A34', tree: '#467F3C', treeLt: '#7FB256', treeHi: '#B9D878',
  water: '#5E9FC6', waterDk: '#3F7FA8', waterLt: '#A9D4EA',
  grass: '#5E9A3E', grassDk: '#3F7530', grassLt: '#9CCB5E', grassHi: '#CDE58A',
  stone: '#A3A091', stoneSh: '#77756B', stoneLt: '#D2CFBF', moss: '#6F8E48',
  coat: '#E0692E', coatSh: '#B04A22', coatLt: '#F59C5E', skin: '#F7D6B8', skinSh: '#E3AE8C', hair: '#2E2628', hairLt: '#565A74',
  pants: '#3D4260', boot: '#E8B23A', bootSh: '#B98320', cheek: '#F09A8E',
};

// Không rung: ghi đè draw() của core — BOILN cố định nên mọi nét đứng yên từ khung này sang khung khác.
draw = function () {
  if (!window.ready) return;
  if (!window.__celBrush) { brush.add('cel', { type: 'default', weight: 3, scatter: .03, sharpness: .95, grain: 0, opacity: 250, spacing: .12, pressure: [1.05, .95], rotate: 'natural', noise: 0 }); window.__celBrush = true; }
  LETTERS = []; CAM = LAST_CAM = null;
  push(); translate(-W / 2, -H / 2);
  BOILN = 0; CLAWD_N = 0; boilSeed('frame'); noiseSeed(77);
  image(paperG, 0, 0);
  drawWorld(T);
  pop();
};

// Một mảng cel: nền phẳng + viền mảnh sạch
function cel(pts, col, o = {}) { paint(pts, { wash: col, washOp: o.op ?? 255, ink: o.ink === null ? null : (o.ink || CEL.line), sw: o.sw ?? .55, br: 'cel', curv: o.curv ?? .5 }); }
// Mảng nền gouache: không viền, vân màu nhẹ
function gouache(pts, col, o = {}) { paint(pts, { wash: col, washOp: o.op ?? 255, ...(o.tex ? { fill: o.fill || col, fillOp: o.fillOp ?? 70, bleed: o.bleed ?? .04, tex: o.tex, border: .15 } : {}), ink: null, curv: o.curv ?? 0 }); }
// Đám hình tròn (tán cây, mây) thành một chuỗi điểm
function blob(cx, cy, rx, ry, n = 16, seed = 0, amp = .12) {
  const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU, k = 1 + amp * Math.sin(a * 3 + seed) + amp * .6 * Math.cos(a * 5 + seed * 2); p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); } return p;
}
