// Nhân vật: hình bóng người mặc áo khoác dài, không lộ mặt, có viền sáng.
// Khung xương 2D nhìn nghiêng (mặt hướng +x); dáng = các góc khớp (độ), 0° = thõng thẳng xuống.
import React from "react";
import { HairStyle, hairBack, hairFront } from "./hair";

export type PoseName = "stand" | "walk" | "walkWind" | "sitKnees" | "sitLean" | "desk" | "window" | "reach" | "look" | "crouch" | "sitEdge" | "carry" | "cradle" | "holdLegs" | "shoulderPoint" | "run" | "skip" | "holdHand" | "sitFloor" | "point" | "row" | "push" | "wave" | "heart" | "lookDown" | "openArms";
export type Age = "adult" | "teen" | "child" | "toddler";

type Pose = {
  torso: number; // nghiêng thân về trước (+)
  head: number; // cúi đầu (+)
  hipL: number;
  kneeL: number; // gập gối (+ = cẳng chân gập ra sau)
  hipR: number;
  kneeR: number;
  shL: number;
  elL: number; // gập khuỷu (+ = cẳng tay gập về trước)
  shR: number;
  elR: number;
  bob?: number; // nhún khi bước (px theo H)
};

const deg = (d: number) => (d * Math.PI) / 180;
const SEATED_POSES = new Set<string>(["sitKnees", "sitLean", "desk", "sitEdge", "shoulderPoint", "sitFloor", "row"]);
const lerpP = (a: [number, number], b: [number, number], k: number): [number, number] => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

export const poseAt = (name: PoseName, t: number): Pose => {
  switch (name) {
    case "walk": {
      const s = Math.sin(t * 4.2);
      return { torso: 4, head: 4, hipL: 24 * s, kneeL: 8 + 30 * Math.max(0, -s), hipR: -24 * s, kneeR: 8 + 30 * Math.max(0, s), shL: -20 * s, elL: 18, shR: 20 * s, elR: 18, bob: 0.012 * Math.abs(Math.cos(t * 4.2)) };
    }
    case "walkWind": {
      const s = Math.sin(t * 3.2);
      return { torso: 20, head: 14, hipL: 18 * s + 6, kneeL: 12 + 26 * Math.max(0, -s), hipR: -18 * s + 6, kneeR: 12 + 26 * Math.max(0, s), shL: 25 - 10 * s, elL: 30, shR: 112, elR: 98, bob: 0.01 * Math.abs(Math.cos(t * 3.2)) };
    }
    case "sitKnees":
      return { torso: -6, head: 38 + 3 * Math.sin(t * 0.8), hipL: 122, kneeL: 132, hipR: 118, kneeR: 128, shL: 40, elL: 58, shR: 34, elR: 62 };
    case "sitLean":
      return { torso: -10, head: -8 + 2 * Math.sin(t * 0.5), hipL: 84, kneeL: 55, hipR: 92, kneeR: 72, shL: 25, elL: 25, shR: 35, elR: 35 };
    case "desk":
      return { torso: 24, head: 30 + 2 * Math.sin(t * 0.7), hipL: 90, kneeL: 90, hipR: 88, kneeR: 86, shL: 55, elL: 45, shR: 72 + 3 * Math.sin(t * 5.5), elR: 22 + 4 * Math.sin(t * 7.3) };
    case "reach": // đưa tay ra phía trước (mời, gọi)
      return { torso: 6, head: 2, hipL: 6, kneeL: 4, hipR: -6, kneeR: 2, shL: 8, elL: 10, shR: 82, elR: 6 + 3 * Math.sin(t * 1.5) };
    case "look": // đứng, ngẩng lên
      return { torso: -3, head: -12, hipL: 3, kneeL: 1, hipR: -3, kneeR: 1, shL: 6, elL: 8, shR: -4, elR: 8 };
    case "crouch": // ngồi xổm, tay chạm xuống phía trước
      return { torso: 38, head: 22, hipL: 105, kneeL: 150, hipR: 100, kneeR: 145, shL: 70, elL: 10, shR: 55, elR: 20 };
    case "sitEdge": { // ngồi trên mép đá, chân đung đưa
      const sw = Math.sin(t * 2.2) * 12;
      return { torso: 2, head: 4 + 2 * Math.sin(t * 0.6), hipL: 88, kneeL: 80 + sw, hipR: 84, kneeR: 72 - sw, shL: 20, elL: 30, shR: 28, elR: 30 };
    }
    case "carry": { // gánh đòn gánh, bước nhanh
      const s = Math.sin(t * 5);
      return { torso: 8, head: 4, hipL: 20 * s, kneeL: 8 + 26 * Math.max(0, -s), hipR: -20 * s, kneeR: 8 + 26 * Math.max(0, s), shL: 170, elL: 15, shR: -10 + 12 * s, elR: 15, bob: 0.02 * Math.abs(Math.cos(t * 5)) };
    }
    case "cradle": // bế đứa trẻ trước ngực, cúi nhìn
      return { torso: 3, head: 24 + 2 * Math.sin(t * 0.7), hipL: 3, kneeL: 1, hipR: -3, kneeR: 1, shL: 30, elL: 100, shR: 22, elR: 112 };
    case "holdLegs": // cõng con trên vai: hai tay giữ chân con trước ngực
      return { torso: 0, head: -8, hipL: 3, kneeL: 1, hipR: -3, kneeR: 1, shL: 35, elL: 110, shR: 45, elR: 105 };
    case "shoulderPoint": { // ngồi trên vai bố, chân thả trước ngực, tay chỉ lên
      const sw = Math.sin(t * 2.4) * 8;
      return { torso: -4, head: -22, hipL: 80, kneeL: 70 + sw, hipR: 76, kneeR: 64 - sw, shL: 30, elL: 40, shR: 150 + 6 * Math.sin(t * 1.3), elR: -8 };
    }
    case "run": { // chạy (trẻ em: bước ngắn, tay đánh rộng)
      const s = Math.sin(t * 7);
      return { torso: 12, head: -2, hipL: 40 * s, kneeL: 20 + 60 * Math.max(0, -s), hipR: -40 * s, kneeR: 20 + 60 * Math.max(0, s), shL: -45 * s, elL: 70, shR: 45 * s, elR: 70, bob: 0.03 * Math.abs(Math.cos(t * 7)) };
    }
    case "skip": { // nhảy chân sáo
      const s = Math.sin(t * 5);
      return { torso: 2, head: -6, hipL: 30 * s + 10, kneeL: 30 + 40 * Math.max(0, -s), hipR: -30 * s + 10, kneeR: 30 + 40 * Math.max(0, s), shL: -40 * s, elL: 30, shR: 40 * s, elR: 30, bob: 0.05 * Math.abs(Math.sin(t * 5)) };
    }
    case "holdHand": { // đi, tay trước giơ lên nắm tay người lớn
      const s = Math.sin(t * 5.2);
      return { torso: 2, head: -10, hipL: 24 * s, kneeL: 10 + 30 * Math.max(0, -s), hipR: -24 * s, kneeR: 10 + 30 * Math.max(0, s), shL: 150, elL: 0, shR: 20 * s, elR: 25, bob: 0.02 * Math.abs(Math.cos(t * 5.2)) };
    }
    case "sitFloor": // ngồi bệt, chân duỗi
      return { torso: -4, head: 6 + 2 * Math.sin(t * 0.8), hipL: 88, kneeL: 10, hipR: 84, kneeR: 22, shL: 22, elL: 40, shR: 30, elR: 46 };
    case "point": // đứng chỉ tay về phía trước, ngẩng lên
      return { torso: -2, head: -10, hipL: 3, kneeL: 1, hipR: -3, kneeR: 1, shL: 6, elL: 10, shR: 125 + 4 * Math.sin(t * 1.4), elR: -6 };
    case "row": { // chèo thuyền: ngả trước đẩy → kéo mạnh về sau
      const s = Math.sin(t * 2.8);
      return { torso: s > 0 ? -15 * s : -8 * s, head: 12 - s * 8, hipL: 75, kneeL: 90, hipR: 78, kneeR: 88, shL: 45 - s * 35, elL: 50 + s * 25, shR: 40 - s * 35, elR: 45 + s * 25 };
    }
    case "push": // đẩy thuyền rời bến
      return { torso: 26, head: 18, hipL: 28, kneeL: 35, hipR: -18, kneeR: 15, shL: 75, elL: 25, shR: 85, elR: 20 };
    case "wave": { // vẫy tay
      const sw = Math.sin(t * 6.5) * 22;
      return { torso: 2, head: -4, hipL: 4, kneeL: 2, hipR: -4, kneeR: 2, shL: 145, elL: 45 + sw, shR: 8, elR: 12 };
    }
    case "heart": // đặt tay lên ngực
      return { torso: 3, head: 14, hipL: 4, kneeL: 2, hipR: -4, kneeR: 2, shL: 35, elL: 108, shR: 8, elR: 12 };
    case "lookDown": // cúi đầu trầm ngâm
      return { torso: 8, head: 28, hipL: 4, kneeL: 2, hipR: -4, kneeR: 2, shL: 6, elL: 12, shR: 8, elR: 14 };
    case "openArms": // dang rộng hai tay
      return { torso: -4, head: -10, hipL: 4, kneeL: 2, hipR: -4, kneeR: 2, shL: 100, elL: 8, shR: -95, elR: -8 };
    case "window":
      return { torso: 2, head: 6, hipL: 3, kneeL: 2, hipR: -4, kneeR: 3, shL: 6, elL: 10, shR: 118, elR: -12 };
    default:
      return { torso: 0, head: 3 + 2 * Math.sin(t * 0.6), hipL: 3, kneeL: 1, hipR: -3, kneeR: 1, shL: 6, elL: 8, shR: -4, elR: 8 };
  }
};

type Pt = [number, number];
const down = (o: Pt, len: number, a: number): Pt => [o[0] + Math.sin(deg(a)) * len, o[1] + Math.cos(deg(a)) * len];
const up = (o: Pt, len: number, a: number): Pt => [o[0] + Math.sin(deg(a)) * len, o[1] - Math.cos(deg(a)) * len];

// Tỷ lệ theo tuổi (theo H = chiều cao đứng): người lớn ~7.5 đầu · thiếu niên ~6 · trẻ 7–10 tuổi ~5 · trẻ 3–5 tuổi ~4
type Build = { thigh: number; shin: number; torso: number; neck: number; uarm: number; farm: number; head: number; w: number };
const BUILD: Record<Age, Build> = {
  adult: { thigh: 0.25, shin: 0.25, torso: 0.3, neck: 0.088, uarm: 0.17, farm: 0.16, head: 1.08, w: 1 },
  teen: { thigh: 0.245, shin: 0.245, torso: 0.29, neck: 0.095, uarm: 0.165, farm: 0.155, head: 1.12, w: 0.9 },
  child: { thigh: 0.16, shin: 0.15, torso: 0.22, neck: 0.03, uarm: 0.12, farm: 0.1, head: 1.5, w: 1.4 }, // ~3.7 đầu: đầu to tròn, thân ngắn tròn, tay chân ngắn mập
  toddler: { thigh: 0.13, shin: 0.12, torso: 0.22, neck: 0.02, uarm: 0.105, farm: 0.09, head: 1.6, w: 1.55 }, // ~3.1 đầu
};
export const buildOf = (age: Age = "adult"): Build => {
  // đầu to hơn thì tâm đầu phải cao hơn vai tương ứng (không để cằm chìm vào ngực)
  const b = BUILD[age], neck = b.neck + 0.07 * (b.head - 1), total = b.thigh + b.shin + b.torso + neck + 0.062 * b.head, k = 0.962 / total;
  return { thigh: b.thigh * k, shin: b.shin * k, torso: b.torso * k, neck: neck * k, uarm: b.uarm * k, farm: b.farm * k, head: b.head * k, w: b.w };
};

/** Tính vị trí các khớp; hông ở (0,0). */
const SILHOUETTE: Build = { thigh: 0.25, shin: 0.25, torso: 0.3, neck: 0.1, uarm: 0.17, farm: 0.16, head: 1, w: 1 }; // bóng đen kiểu HB-002 — giữ nguyên
const skeleton = (p: Pose, H: number, b: Build = SILHOUETTE) => {
  const hip: Pt = [0, 0];
  const sh = up(hip, H * b.torso, p.torso);
  const head = up(sh, H * b.neck, p.torso + p.head);
  const kneeL = down(hip, H * b.thigh, p.hipL);
  const footL = down(kneeL, H * b.shin, p.hipL - p.kneeL);
  const kneeR = down(hip, H * b.thigh, p.hipR);
  const footR = down(kneeR, H * b.shin, p.hipR - p.kneeR);
  const elbL = down(sh, H * b.uarm, p.shL);
  const handL = down(elbL, H * b.farm, p.shL + p.elL);
  const elbR = down(sh, H * b.uarm, p.shR);
  const handR = down(elbR, H * b.farm, p.shR + p.elR);
  return { hip, sh, head, kneeL, footL, kneeR, footR, elbL, handL, elbR, handR };
};

export type FigureProps = {
  pose: PoseName;
  t: number;
  x: number; // vị trí neo (bàn chân khi đứng/đi, hông khi ngồi)
  y: number;
  H: number; // chiều cao khi đứng (px)
  color?: string;
  rim?: string; // màu viền sáng
  rimDir?: [number, number]; // hướng nguồn sáng
  wind?: number; // gió làm vạt áo bay
  flip?: boolean; // quay mặt sang trái
  scarf?: string; // màu khăn quàng (mặc định Ember); "none" = không quàng
  palette?: FigurePalette; // tô màu từng phần (người có màu, không phải hình bóng)
  hat?: "non" | "hood"; // nón lá / mũ áo mưa
  stoop?: number; // còng lưng (độ) — người già
  load?: boolean; // gánh hai thúng hai đầu đòn
  age?: Age; // tỷ lệ cơ thể (người có màu): adult · teen · child · toddler
};

export type FigurePalette = {
  coat: string; pants: string; skin: string; hair: string; shoe?: string;
  hairStyle?: HairStyle; // kiểu tóc (người có màu) — xem hair.tsx
  garment?: "coat" | "jacket" | "dress" | "tshirt" | "shirt" | "hoodie" | "overalls"; // áo khoác dài · áo ngắn · váy · áo phông · sơ mi · hoodie · áo yếm
  bottom?: "pants" | "shorts" | "skirt"; // quần dài · quần soóc · chân váy
  redScarf?: boolean; // khăn quàng đỏ (đồng phục học sinh)
  accent?: string; // cổ áo / khăn vấn / mũ / dây buộc tóc
};

// Màu: pha về đen (k>0) hoặc trắng (k<0) — nhận "#rrggbb" hoặc "rgb(r,g,b)"
const rgbOf = (c: string) => (c.startsWith("rgb") ? (c.match(/\d+/g) ?? []).slice(0, 3).map(Number) : [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)));
const tone = (c: string, k: number) => `rgb(${rgbOf(c).map((v) => Math.round(k > 0 ? v * (1 - k) : v + (255 - v) * -k)).join(",")})`;
const f1 = (v: number) => v.toFixed(1);
const mixC = (a: string, b: string, k: number) => { const A = rgbOf(a), Bc = rgbOf(b); return `rgb(${A.map((v, i) => Math.round(v + (Bc[i] - v) * k)).join(",")})`; };
// Chi thon có bắp (cạnh cong nhẹ) — dùng cho người có màu
const limb2 = (a: Pt, b: Pt, wa: number, wb: number, c: string, key: string, bulge = 0.18) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], wm = (wa + wb) / 2 * (1 + bulge);
  return (
    <g key={key}>
      <path d={`M${f1(a[0] + nx * wa / 2)},${f1(a[1] + ny * wa / 2)} Q${f1(m[0] + nx * wm / 2 * 1.08)},${f1(m[1] + ny * wm / 2 * 1.08)} ${f1(b[0] + nx * wb / 2)},${f1(b[1] + ny * wb / 2)} L${f1(b[0] - nx * wb / 2)},${f1(b[1] - ny * wb / 2)} Q${f1(m[0] - nx * wm / 2)},${f1(m[1] - ny * wm / 2)} ${f1(a[0] - nx * wa / 2)},${f1(a[1] - ny * wa / 2)} Z`} fill={c} />
      <circle cx={a[0]} cy={a[1]} r={wa / 2} fill={c} />
      <circle cx={b[0]} cy={b[1]} r={wb / 2} fill={c} />
    </g>
  );
};

// Chi thon: hình con nhộng từ khớp a (rộng wa) tới khớp b (rộng wb)
const limb = (a: Pt, b: Pt, wa: number, wb: number, c: string, key: string) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const f = (v: number) => v.toFixed(1);
  return (
    <g key={key}>
      <path d={`M${f(a[0] + nx * wa / 2)},${f(a[1] + ny * wa / 2)} L${f(b[0] + nx * wb / 2)},${f(b[1] + ny * wb / 2)} L${f(b[0] - nx * wb / 2)},${f(b[1] - ny * wb / 2)} L${f(a[0] - nx * wa / 2)},${f(a[1] - ny * wa / 2)} Z`} fill={c} />
      <circle cx={a[0]} cy={a[1]} r={wa / 2} fill={c} />
      <circle cx={b[0]} cy={b[1]} r={wb / 2} fill={c} />
    </g>
  );
};

export const Figure: React.FC<FigureProps> = ({ pose, t, x, y, H, color = "#0d0c0c", rim, rimDir = [-1, -1], wind = 0, flip, scarf = "#D9622B", palette, hat, stoop = 0, load, age }) => {
  const p0 = poseAt(pose, t);
  const p1 = stoop ? { ...p0, torso: p0.torso + stoop, head: p0.head - stoop * 0.4 } : p0;
  // trẻ nhỏ: hơi ưỡn bụng, hai chân dạng nhẹ
  const kidAge = palette && (age === "child" || age === "toddler");
  const kidDamp = (v: number) => (SEATED_POSES.has(pose) ? v : v * 0.65); // trẻ nhỏ: bước ngắn, gối gập ít
  const p = kidAge
    ? { ...p1, torso: p1.torso - 4, hipL: kidDamp(p1.hipL) + 4, hipR: kidDamp(p1.hipR) - 4, kneeL: kidDamp(p1.kneeL), kneeR: kidDamp(p1.kneeR), ...(pose === "heart" ? { shL: 8, elL: 140, head: 12 } : {}) }
    : p1;
  const B = palette ? buildOf(age) : SILHOUETTE;
  const k = skeleton(p, H, B);
  const seated = pose === "sitKnees" || pose === "sitLean" || pose === "desk" || pose === "sitEdge" || pose === "shoulderPoint" || pose === "sitFloor" || pose === "row";
  const lowest = Math.max(k.footL[1], k.footR[1]);
  const oy = seated ? 0 : -lowest - (p.bob ?? 0) * H;

  // Trục thân (từ hông lên vai) và pháp tuyến
  const ax = Math.sin(deg(p.torso));
  const ay = -Math.cos(deg(p.torso));
  const nx = -ay;
  const ny = ax;
  const flap = wind * H * 0.07 * (0.6 + 0.4 * Math.sin(t * 7));
  const hemLen = seated ? H * 0.06 : H * 0.22;
  const P = (o: Pt, along: number, side: number): string => `${(o[0] + ax * along + nx * side).toFixed(1)},${(o[1] + ay * along + ny * side).toFixed(1)}`;
  const coat = (c: string) => (
    <path
      d={`M${P(k.sh, H * 0.01, -H * 0.1)} Q${P(k.sh, H * 0.04, 0)} ${P(k.sh, H * 0.01, H * 0.095)}
          L${P(k.hip, 0, H * 0.085)} L${P(k.hip, -hemLen, H * 0.11 - flap * 0.2)}
          Q${P(k.hip, -hemLen - H * 0.015, 0)} ${P(k.hip, -hemLen + flap * 0.1, -H * 0.12 - flap)}
          L${P(k.hip, 0, -H * 0.09)} Z`}
      fill={c}
    />
  );
  // Khăn quàng Ember: quấn cổ, đuôi bay ngược chiều mặt theo gió
  const neck: Pt = [k.sh[0] + ax * H * 0.035, k.sh[1] + ay * H * 0.035];
  const tail = Array.from({ length: 6 }, (_, i) => {
    const u = i / 5;
    const wave = Math.sin(t * 6 - u * 4) * H * 0.018 * (0.3 + wind);
    return [neck[0] - u * H * (0.1 + wind * 0.12), neck[1] + u * H * (0.12 - wind * 0.1) + wave] as Pt;
  });
  const scarfPath = `M${tail.map((q) => q.map((v) => v.toFixed(1)).join(",")).join(" L")}`;

  // Tô màu: mặc định cả người một màu (hình bóng); có palette thì mỗi phần một màu
  const body = (c: string, withScarf: boolean) => {
    const pal = withScarf && palette ? palette : { coat: c, pants: c, skin: c, hair: c, shoe: c };
    const shoe = pal.shoe ?? pal.pants;
    return (
    <>
      {limb(k.hip, k.kneeR, H * 0.075, H * 0.06, pal.pants, "tR")}
      {limb(k.kneeR, k.footR, H * 0.06, H * 0.045, pal.pants, "sR")}
      <ellipse cx={k.footR[0] + H * 0.025} cy={k.footR[1] + H * 0.008} rx={H * 0.042} ry={H * 0.018} fill={shoe} />
      {limb(k.sh, k.elbR, H * 0.055, H * 0.045, pal.coat, "uR")}
      {limb(k.elbR, k.handR, H * 0.045, H * 0.035, pal.coat, "fR")}
      <circle cx={k.handR[0]} cy={k.handR[1]} r={H * 0.024} fill={pal.skin} />
      {coat(pal.coat)}
      {limb(k.hip, k.kneeL, H * 0.078, H * 0.062, pal.pants, "tL")}
      {limb(k.kneeL, k.footL, H * 0.062, H * 0.046, pal.pants, "sL")}
      <ellipse cx={k.footL[0] + H * 0.025} cy={k.footL[1] + H * 0.008} rx={H * 0.042} ry={H * 0.018} fill={shoe} />
      {limb(k.sh, k.head, H * 0.045, H * 0.04, pal.skin, "neck")}
      <ellipse cx={k.head[0]} cy={k.head[1]} rx={H * 0.052} ry={H * 0.062} fill={pal.skin} transform={`rotate(${p.torso + p.head} ${k.head[0]} ${k.head[1]})`} />
      {/* tóc: ôm trọn vòm sọ và phủ nhẹ sau gáy */}
      {pal.hair !== pal.skin && (
        <path
          d={`M${k.head[0] + H * 0.035},${k.head[1] - H * 0.025}
              C${k.head[0] + H * 0.025},${k.head[1] - H * 0.065} ${k.head[0] - H * 0.01},${k.head[1] - H * 0.072} ${k.head[0] - H * 0.02},${k.head[1] - H * 0.072}
              C${k.head[0] - H * 0.065},${k.head[1] - H * 0.072} ${k.head[0] - H * 0.075},${k.head[1] - H * 0.03} ${k.head[0] - H * 0.065},${k.head[1] + H * 0.015}
              C${k.head[0] - H * 0.055},${k.head[1] + H * 0.045} ${k.head[0] - H * 0.035},${k.head[1] + H * 0.055} ${k.head[0] - H * 0.025},${k.head[1] + H * 0.055}
              C${k.head[0] - H * 0.025},${k.head[1] + H * 0.02} ${k.head[0] - H * 0.035},${k.head[1] - H * 0.01} ${k.head[0] - H * 0.01},${k.head[1] - H * 0.03}
              Z`}
          fill={pal.hair}
        />
      )}
      {hat === "non" && (
        <path d={`M${k.head[0] - H * 0.11},${k.head[1] - H * 0.02} L${k.head[0] + H * 0.005},${k.head[1] - H * 0.13} L${k.head[0] + H * 0.12},${k.head[1] - H * 0.02} Z`} fill={withScarf ? "#d8c79a" : c} />
      )}
      {hat === "hood" && (
        <path d={`M${k.head[0] - H * 0.066},${k.head[1] + H * 0.03} Q${k.head[0] - H * 0.075},${k.head[1] - H * 0.085} ${k.head[0] + H * 0.015},${k.head[1] - H * 0.08} Q${k.head[0] + H * 0.07},${k.head[1] - H * 0.06} ${k.head[0] + H * 0.06},${k.head[1] - H * 0.01} L${k.head[0] + H * 0.035},${k.head[1] - H * 0.035} Q${k.head[0] - H * 0.01},${k.head[1] - H * 0.06} ${k.head[0] - H * 0.035},${k.head[1] + H * 0.035} Z`} fill={pal.coat} />
      )}
      {load && (() => {
        // đòn gánh trên vai, hai thúng đung đưa
        const sw = Math.sin(t * 5) * H * 0.02;
        const a: Pt = [k.sh[0] - H * 0.3, k.sh[1] - H * 0.01];
        const b: Pt = [k.sh[0] + H * 0.3, k.sh[1] + H * 0.01];
        const col = withScarf ? "#7a5c3a" : c;
        return (
          <g>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={H * 0.018} strokeLinecap="round" />
            {[a, b].map((q, i) => (
              <g key={i}>
                <line x1={q[0]} y1={q[1]} x2={q[0] + sw} y2={q[1] + H * 0.22} stroke={col} strokeWidth={H * 0.006} />
                <path d={`M${q[0] + sw - H * 0.08},${q[1] + H * 0.22} L${q[0] + sw + H * 0.08},${q[1] + H * 0.22} L${q[0] + sw + H * 0.06},${q[1] + H * 0.3} L${q[0] + sw - H * 0.06},${q[1] + H * 0.3} Z`} fill={withScarf ? "#a88756" : c} />
              </g>
            ))}
          </g>
        );
      })()}
      {withScarf && scarf !== "none" && (
        <>
          <ellipse cx={neck[0]} cy={neck[1]} rx={H * 0.05} ry={H * 0.028} fill={scarf} />
          <path d={scarfPath} stroke={scarf} strokeWidth={H * 0.03} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}
      {limb(k.sh, k.elbL, H * 0.058, H * 0.047, pal.coat, "uL")}
      {limb(k.elbL, k.handL, H * 0.047, H * 0.036, pal.coat, "fL")}
      <circle cx={k.handL[0]} cy={k.handL[1]} r={H * 0.025} fill={pal.skin} />
    </>
    );
  };
  // Người có màu: tỷ lệ theo tuổi, tóc (hair.tsx), mặt trơn kiểu cắt giấy, áo hai tông, nếp áo, bàn tay, giày
  // (mono = một màu cho lớp viền sáng)
  const detailed = (pal: FigurePalette, mono?: string) => {
    const C = (c: string) => mono ?? c;
    const D = (c: string, k = 0.22) => mono ?? tone(c, k);
    const W = B.w, TR = B.torso / 0.3; // bề ngang & độ dài thân so với người lớn
    const Q = (o: Pt, along: number, side: number) => P(o, along * TR, side * W);
    const shoe = pal.shoe ?? tone(pal.pants, 0.3);
    const garment = pal.garment ?? "coat", bottom = pal.bottom ?? (garment === "dress" ? "skirt" : "pants");
    const kid = age === "child" || age === "toddler";
    const short = garment === "tshirt" || garment === "overalls";
    const hem = seated ? H * 0.06 : garment === "coat" ? H * 0.22 : garment === "dress" ? H * (kid ? 0.13 : 0.2) : garment === "jacket" || garment === "hoodie" ? H * 0.045 : H * 0.03;
    const flare = garment === "dress" ? H * 0.045 : 0;
    const legSkin = bottom !== "pants";
    const hand = (h: Pt, e: Pt, key: string) => {
      const a = Math.atan2(h[1] - e[1], h[0] - e[0]) * 57.3;
      return (
        <g key={key} transform={`rotate(${f1(a)} ${f1(h[0])} ${f1(h[1])})`}>
          <ellipse cx={h[0] + H * 0.012 * W} cy={h[1]} rx={H * 0.026 * W} ry={H * 0.017 * W} fill={C(pal.skin)} />
          <ellipse cx={h[0] + H * 0.004 * W} cy={h[1] - H * 0.014 * W} rx={H * 0.01 * W} ry={H * 0.007 * W} fill={D(pal.skin, 0.08)} />
        </g>
      );
    };
    const leg = (hip: Pt, knee: Pt, foot: Pt, back: boolean, key: string) => {
      const pc = back ? D(pal.pants, 0.18) : C(pal.pants), sc = back ? D(pal.skin, 0.12) : C(pal.skin);
      const knee2 = lerpP(hip, knee, 0.88);
      return (
        <g key={key}>
          {limb2(hip, knee, H * 0.078 * W, H * 0.062 * W, legSkin ? sc : pc, key + "t")}
          {limb2(knee, foot, H * 0.062 * W, H * 0.044 * W, legSkin ? sc : pc, key + "s", 0.12)}
          {bottom === "shorts" && limb2(hip, knee2, H * 0.084 * W, H * 0.072 * W, pc, key + "sh", 0.05)}
          <path d={`M${f1(foot[0] - H * 0.022 * W)},${f1(foot[1] - H * 0.012 * W)} Q${f1(foot[0] + H * 0.03 * W)},${f1(foot[1] - H * 0.02 * W)} ${f1(foot[0] + H * 0.062 * W)},${f1(foot[1] + H * 0.008 * W)} L${f1(foot[0] + H * 0.062 * W)},${f1(foot[1] + H * 0.018 * W)} L${f1(foot[0] - H * 0.024 * W)},${f1(foot[1] + H * 0.018 * W)} Z`} fill={back ? D(shoe, 0.15) : C(shoe)} />
        </g>
      );
    };
    const arm = (elb: Pt, hnd: Pt, back: boolean, key: string) => {
      const top = garment === "overalls" ? pal.accent ?? "#efe6d6" : pal.coat;
      const c = back ? D(top, 0.2) : C(top), sk = back ? D(pal.skin, 0.12) : C(pal.skin);
      const edge = !back && !mono ? tone(top, 0.32) : null, e = H * 0.007;
      const cuff = lerpP(elb, hnd, 0.86);
      return (
        <g key={key}>
          {short ? (
            <>
              {limb2(k.sh, elb, H * 0.056 * W, H * 0.046 * W, sk, key + "u")}
              {limb2(elb, hnd, H * 0.046 * W, H * 0.038 * W, sk, key + "f", 0.1)}
              {edge && limb2(k.sh, lerpP(k.sh, elb, 0.5), H * 0.07 * W + e, H * 0.064 * W + e, edge, key + "sle", 0)}
              {limb2(k.sh, lerpP(k.sh, elb, 0.5), H * 0.07 * W, H * 0.064 * W, c, key + "sl", 0)}
            </>
          ) : (
            <>
              {edge && limb2(k.sh, elb, H * 0.064 * W + e, H * 0.05 * W + e, edge, key + "ue")}
              {edge && limb2(elb, hnd, H * 0.05 * W + e, H * 0.042 * W + e, edge, key + "fe", 0.1)}
              {limb2(k.sh, elb, H * 0.064 * W, H * 0.05 * W, c, key + "u")}
              {limb2(elb, hnd, H * 0.05 * W, H * 0.042 * W, c, key + "f", 0.1)}
              <circle cx={cuff[0]} cy={cuff[1]} r={H * 0.023 * W} fill={mono ?? tone(pal.accent ?? pal.coat, back ? 0.3 : 0.12)} />
            </>
          )}
          {hand(hnd, elb, key + "h")}
        </g>
      );
    };
    // thân áo: vai, ngực, eo, vạt (bay theo gió)
    const Sb = Q(k.sh, -H * 0.005, -H * 0.078), Sf = Q(k.sh, -H * 0.005, H * 0.07), top = Q(k.sh, H * 0.03, 0);
    const belly = kid ? 1.16 : 1;
    const Cf = Q(k.sh, -H * 0.12, H * 0.082 * belly), Wf = Q(k.hip, H * 0.07, H * 0.07 * belly), Wb = Q(k.hip, H * 0.07, -H * 0.072), Bk = Q(k.sh, -H * 0.11, -H * 0.086);
    const Hf = P(k.hip, -hem, (H * 0.1 + flare) * W - flap * 0.15), Hb = P(k.hip, -hem, -(H * 0.105 + flare) * W - flap);
    const torso = `M${Sb} Q${top} ${Sf} Q${Q(k.sh, -H * 0.05, H * 0.092)} ${Cf} L${Wf} Q${P(k.hip, -hem * 0.5, (H * 0.09 + flare * 0.5) * W)} ${Hf} Q${P(k.hip, -hem - H * 0.012, 0)} ${Hb} Q${P(k.hip, -hem * 0.5, -(H * 0.095 + flare * 0.5) * W)} ${Wb} L${Bk} Q${Q(k.sh, -H * 0.03, -H * 0.092)} ${Sb} Z`;
    const shade = `M${Sb} L${Bk} L${Wb} L${Hb} L${P(k.hip, -hem, -H * 0.05 * W)} L${Q(k.hip, H * 0.06, -H * 0.035)} L${Q(k.sh, -H * 0.03, -H * 0.035)} Z`;
    // chân váy (váy rời / chân váy trẻ em) vẽ đè lên đùi
    const skirtLen = H * (kid ? 0.11 : 0.17);
    const skirt = bottom === "skirt" && garment !== "dress" && !seated
      ? `M${Q(k.hip, H * 0.03, -H * 0.075)} L${Q(k.hip, H * 0.03, H * 0.072)} L${P(k.hip, -skirtLen, H * 0.11 * W - flap * 0.1)} Q${P(k.hip, -skirtLen - H * 0.01, 0)} ${P(k.hip, -skirtLen, -H * 0.115 * W - flap * 0.4)} Z`
      : "";
    // đầu nghiêng (mặt hướng +x): sọ + mũi + cằm, tóc theo kiểu
    const [hx, hy] = k.head, rot = p.torso + p.head, hs: HairStyle = pal.hairStyle ?? "short", hsc = B.head;
    const ctx = { hx, hy, u: H * 0.01, hair: C(pal.hair), dark: D(pal.hair, 0.25), light: mono ?? tone(pal.hair, -0.3), shaved: mono ?? mixC(pal.hair, pal.skin, 0.55), skin: C(pal.skin), accent: C(pal.accent ?? "#2a1f1c"), t, wind, mono: !!mono };
    const head = (
      <g transform={`rotate(${f1(rot)} ${f1(hx)} ${f1(hy)}) translate(${f1(hx)} ${f1(hy)}) scale(${hsc.toFixed(3)}) translate(${f1(-hx)} ${f1(-hy)})`}>
        {hairBack(hs, ctx)}
        {kid ? (
          <>
            <circle cx={hx - H * 0.002} cy={hy - H * 0.006} r={H * 0.057} fill={C(pal.skin)} />
            <ellipse cx={hx + H * 0.026} cy={hy + H * 0.026} rx={H * 0.03} ry={H * 0.024} fill={C(pal.skin)} />
            <circle cx={hx + H * 0.055} cy={hy + H * 0.006} r={H * 0.0075} fill={C(pal.skin)} />
          </>
        ) : <path d={`M${hx - H * 0.048},${hy} C${hx - H * 0.05},${hy - H * 0.07} ${hx + H * 0.05},${hy - H * 0.072} ${hx + H * 0.05},${hy - H * 0.005} L${hx + H * (kid ? 0.056 : 0.061)},${hy + H * 0.014} L${hx + H * 0.05},${hy + H * 0.02} C${hx + H * 0.05},${hy + H * 0.045} ${hx + H * 0.03},${hy + H * 0.06} ${hx + H * 0.006},${hy + H * 0.058} C${hx - H * 0.03},${hy + H * 0.055} ${hx - H * 0.047},${hy + H * 0.035} ${hx - H * 0.048},${hy} Z`} fill={C(pal.skin)} />}
        {/* không vẽ mắt/miệng: mặt trơn kiểu cắt giấy, chỉ giữ dáng mũi và tai để biết hướng nhìn */}
        {!mono && H * hsc >= 110 && <ellipse cx={hx - H * 0.006} cy={hy + H * 0.008} rx={H * 0.011} ry={H * 0.016} fill={tone(pal.skin, 0.1)} />}
        {hairFront(hs, ctx)}
      </g>
    );
    return (
      <>
        {leg(k.hip, k.kneeR, k.footR, true, "lR")}
        {arm(k.elbR, k.handR, true, "aR")}
        {limb2(k.sh, P(k.sh, H * B.neck * 0.6, H * 0.004).split(",").map(Number) as Pt, H * 0.04 * W, H * 0.036 * W, C(pal.skin), "neck", 0)}
        {garment === "hoodie" && <ellipse cx={+Q(k.sh, -H * 0.005, -H * 0.05).split(",")[0]} cy={+Q(k.sh, -H * 0.005, -H * 0.05).split(",")[1]} rx={H * 0.04 * W} ry={H * 0.02 * W} fill={D(pal.coat, 0.18)} />}
        <path d={torso} fill={C(garment === "overalls" ? pal.accent ?? "#efe6d6" : pal.coat)} />
        {!mono && <path d={shade} fill={tone(garment === "overalls" ? pal.accent ?? "#efe6d6" : pal.coat, 0.2)} />}
        {!mono && garment === "overalls" && <path d={`M${Q(k.sh, -H * 0.13, H * 0.075)} L${Q(k.sh, -H * 0.13, -H * 0.07)} L${Wb} L${Hb} L${Hf} L${Wf} Z`} fill={pal.pants} />}
        {!mono && garment === "overalls" && <path d={`M${Q(k.sh, -H * 0.13, H * 0.06)} L${Q(k.sh, 0, H * 0.035)}`} stroke={pal.pants} strokeWidth={H * 0.012 * W} />}
        {!mono && (garment === "coat" || garment === "jacket") && <path d={`M${Q(k.sh, -H * 0.08, H * 0.06)} L${P(k.hip, -hem + H * 0.01, H * 0.08 * W - flap * 0.15)}`} stroke={tone(pal.coat, 0.32)} strokeWidth={H * 0.004} />}
        {!mono && (garment === "coat" || garment === "jacket" || garment === "shirt") && <path d={`M${Sf} L${Q(k.sh, -H * 0.085, H * 0.05)} L${Q(k.sh, -H * 0.015, H * 0.02)} Z`} fill={tone(pal.accent ?? pal.coat, pal.accent ? 0 : -0.16)} />}
        {!mono && garment === "hoodie" && <path d={`M${Q(k.hip, H * 0.1, H * 0.065)} L${Q(k.hip, H * 0.1, H * 0.0)} L${Q(k.hip, H * 0.035, H * 0.0)}`} stroke={tone(pal.coat, 0.25)} strokeWidth={H * 0.004} fill="none" />}
        {!mono && garment === "coat" && !seated && <path d={`M${P(k.hip, -hem * 0.25, H * 0.02)} Q${P(k.hip, -hem * 0.55, H * 0.03 + flap * 0.1)} ${P(k.hip, -hem * 0.9, H * 0.01)}`} stroke={tone(pal.coat, 0.18)} strokeWidth={H * 0.004} fill="none" />}
        {pal.redScarf && <path d={`M${Q(k.sh, H * 0.005, H * 0.03)} L${Q(k.sh, -H * 0.09, H * 0.085)} L${Q(k.sh, -H * 0.075, H * 0.06)} L${Q(k.sh, -H * 0.02, H * 0.06)} Z`} fill={C("#d23a2a")} />}
        {skirt && <path d={skirt} fill={C(pal.pants)} />}
        {scarf !== "none" && (
          <>
            <ellipse cx={neck[0]} cy={neck[1]} rx={H * 0.05 * W} ry={H * 0.026 * W} fill={C(scarf)} />
            <path d={scarfPath} stroke={C(scarf)} strokeWidth={H * 0.028 * W} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {!mono && <ellipse cx={neck[0]} cy={neck[1] + H * 0.008} rx={H * 0.05 * W} ry={H * 0.012} fill={tone(scarf, 0.22)} />}
          </>
        )}
        {leg(k.hip, k.kneeL, k.footL, false, "lL")}
        {skirt && <path d={skirt} fill={C(pal.pants)} />}
        {!kid && head}
        {arm(k.elbL, k.handL, false, "aL")}
        {kid && head}
      </>
    );
  };

  const s = H / 300;
  if (palette) {
    return (
      <g transform={`translate(${x} ${y + oy})${flip ? " scale(-1 1)" : ""}`}>
        {rim && <g transform={`translate(${rimDir[0] * 2.4 * s} ${rimDir[1] * 2.4 * s})`}>{detailed(palette, rim)}</g>}
        {detailed(palette)}
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y + oy})${flip ? " scale(-1 1)" : ""}`}>
      {rim && <g transform={`translate(${rimDir[0] * 2.4 * s} ${rimDir[1] * 2.4 * s})`}>{body(rim, false)}</g>}
      {body(color, true)}
    </g>
  );
};
