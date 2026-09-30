// Sinh cây, rễ, lá, cỏ, đá — cùng thuật toán cành đệ quy với scripts/make_cover.py (ảnh bìa),
// thu nhỏ về khung 1920×1080. Thế giới kéo dài xuống dưới mặt đất để máy quay "xuống lòng đất".
import { rng } from "./params";

export const W = 1920;
export const CX = 960;
const BASE = 915;
export const hillY = (x: number) => BASE - 140 * Math.exp(-(((x - CX) / (W * 0.32)) ** 2));
export const TOP = hillY(CX); // đỉnh đồi = gốc cây
export const WORLD_BOTTOM = 2300;
export const DEEP_STONE = { x: CX + 150, y: 1500, r: 115 };

// Lá mọc thành chùm; tone 0 tối (mặt dưới) → 2 sáng (mặt trên, đón sáng)
export type Leaf = { x: number; y: number; rx: number; ry: number; rot: number; tone: number; th: number; id: number };
export type Seg = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  w: number;
  w2: number; // bề rộng ở đầu cành (thuôn dần)
  bend: number; // độ cong của cành
  level: number;
  phase: number;
  children: Seg[];
  leaves: Leaf[];
  tip: boolean;
};


export const buildScenery = (seed = 23) => {
  const r = rng(seed);
  const U = (a: number, b: number) => a + (b - a) * r();
  let leafId = 0;

  const branch = (x: number, y: number, ang: number, len: number, w: number, depth: number, level: number, up: boolean): Seg | null => {
    if (depth === 0 || len < 6) return null;
    const x2 = x + Math.cos(ang) * len;
    const y2 = up ? y - Math.sin(ang) * len : y + Math.sin(ang) * len;
    const seg: Seg = { x1: x, y1: y, x2, y2, w, w2: w * 0.6, bend: U(-0.14, 0.14) * len, level, phase: r() * Math.PI * 2, children: [], leaves: [], tip: false };
    const n = depth > 2 ? 2 : [1, 2, 2, 3][Math.floor(r() * 4)];
    for (let i = 0; i < n; i++) {
      const spread = U(0.25, 0.7) * (r() < 0.5 ? 1 : -1);
      const c = branch(x2, y2, ang + spread, len * U(0.62, 0.8), w * 0.66, depth - 1, level + 1, up);
      if (c) seg.children.push(c);
    }
    seg.tip = seg.children.length === 0;
    if (seg.children.length) seg.w2 = Math.max(...seg.children.map((c) => c.w));
    else seg.w2 = Math.max(w * 0.35, 0.8);
    // Lá mọc thành chùm ở cành nhỏ (cấp ≥ 4): chùm to ở ngọn, chùm nhỏ dọc cành
    if (up && level >= 4) {
      const count = seg.tip ? 11 : 4;
      const R = seg.tip ? U(13, 22) : U(7, 12);
      const th = r(); // cả chùm rụng gần cùng lúc
      const k = seg.tip ? 1 : U(0.4, 0.8);
      const cx = x + (x2 - x) * k;
      const cy = y + (y2 - y) * k - R * 0.3;
      for (let i = 0; i < count; i++) {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r()) * R;
        const ly = cy + Math.sin(a) * d * 0.8;
        const up01 = (cy - ly) / (R * 0.8); // -1 dưới … 1 trên
        seg.leaves.push({
          x: cx + Math.cos(a) * d,
          y: ly,
          rx: U(7, 13),
          ry: U(4, 7),
          rot: U(0, 180),
          tone: up01 > 0.35 ? 2 : up01 > -0.3 ? 1 : 0,
          th: Math.min(Math.max(th + U(-0.04, 0.04), 0.001), 0.999),
          id: leafId++,
        });
      }
      // Vẽ lá tối trước, sáng sau để chùm có khối
      seg.leaves.sort((p, q) => p.tone - q.tone);
    }
    return seg;
  };
  const leaves: Leaf[] = [];

  // Thân (tứ giác thuôn như ảnh bìa, hơi nghiêng)
  const trunk = [
    [CX - 33, TOP + 12],
    [CX + 33, TOP + 12],
    [CX + 12, TOP - 245],
    [CX - 8, TOP - 245],
  ];

  // Cành lớn
  const limbs: Seg[] = [];
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 2 + U(-0.95, 0.85) - 0.12;
    const y0 = TOP - U(300, 520) * 0.46;
    const s = branch(CX + 2, y0, a, U(230, 330) * 0.42, (34 - i * 2) * 0.5, 7, 0, true);
    if (s) limbs.push(s);
  }

  // Rễ: 7 rễ tỏa như ảnh bìa + 2 rễ cái đâm về phía tảng đá sâu
  const roots: Seg[] = [];
  for (let i = 0; i < 7; i++) {
    const s = branch(CX + U(-14, 14), TOP + 6, Math.PI / 2 + U(-0.9, 0.9), U(130, 190) * 1.15, 12, 7, 0, false);
    if (s) roots.push(s);
  }
  for (const dx of [-10, 12]) {
    const sx = CX + dx;
    const ang = Math.atan2(DEEP_STONE.y - DEEP_STONE.r * 0.6 - TOP, DEEP_STONE.x - sx);
    const s = branch(sx, TOP + 6, ang, 250, 15, 7, 0, false);
    if (s) roots.push(s);
  }

  // Rễ ôm tảng đá: các cung bám quanh mép đá (hiện ở cuối, khi rễ gần mọc hết)
  const wraps = Array.from({ length: 7 }, (_, i) => {
    const a0 = -Math.PI * 0.95 + i * 0.22 + U(-0.05, 0.05);
    const a1 = a0 + U(1.2, 2.2);
    const rr = DEEP_STONE.r + U(2, 9);
    return { a0, a1, rr, w: U(3, 7) };
  });

  // Cành gãy dưới chân cây (như ảnh bìa)
  const debris = Array.from({ length: 4 }, () => {
    const x = CX + (r() < 0.5 ? -1 : 1) * U(120, 340);
    const y = hillY(x) - 3;
    const ang = U(-0.25, 0.25);
    const L = U(75, 135);
    return { x, y, x2: x + Math.cos(ang) * L, y2: y - Math.sin(ang) * L };
  });

  // Cỏ dọc sườn đồi (dày hơn quanh gốc cây)
  const grass = Array.from({ length: 520 }, (_, i) => {
    const x = i < 160 ? CX + U(-420, 420) : U(-20, W + 20);
    return { x, y: hillY(x) + U(1, 5), h: U(8, 26), lean: U(-0.35, 0.35), phase: r() * 6.28, shade: U(0, 1) };
  });

  // Dãy đồi xa (2 lớp, mờ dần vào sương) — tạo chiều sâu
  const ridge = (base: number, amp: number, seedOff: number) => {
    const ph = [U(0, 6), U(0, 6), U(0, 6)];
    return Array.from({ length: 50 }, (_, i) => {
      const x = -200 + i * 48;
      const y = base - amp * (0.55 * Math.sin(x / 260 + ph[0] + seedOff) + 0.3 * Math.sin(x / 110 + ph[1]) + 0.15 * Math.sin(x / 47 + ph[2]));
      return [x, y];
    });
  };
  const farHills = [ridge(835, 55, 0), ridge(872, 38, 2)];

  // Hạt mưa bắn tóe trên mặt đất
  const splashes = Array.from({ length: 90 }, () => ({ x: U(0, W), ph: r(), sp: U(0.7, 1.3) }));

  // Lòng đất: vỉa đất + sỏi
  const strata = Array.from({ length: 7 }, (_, i) => {
    const y = TOP + 150 + i * 200 + U(-30, 30);
    const pts = Array.from({ length: 13 }, (_, k) => [k * 160, y + U(-18, 18)]);
    return pts;
  });
  const pebbles = Array.from({ length: 70 }, () => {
    const x = U(0, W);
    return { x, y: U(hillY(x) + 40, WORLD_BOTTOM), rx: U(4, 16), ry: U(3, 10), rot: U(0, 180), shade: U(0.18, 0.32) };
  });
  const stonePoly = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const rr = DEEP_STONE.r * U(0.86, 1.06);
    return [DEEP_STONE.x + Math.cos(a) * rr * 1.15, DEEP_STONE.y + Math.sin(a) * rr * 0.85];
  });

  // Giọt mưa, bông tuyết, lá đã gom
  // Mưa 2 lớp: xa (mảnh, mờ, chậm) và gần (dày, rõ, nhanh)
  const drops = Array.from({ length: 520 }, (_, i) => {
    const near = i % 4 === 0;
    return { x: U(0, W + 400), y: U(0, 1080), len: near ? U(40, 70) : U(14, 28), sp: near ? U(1.3, 1.6) : U(0.8, 1.05), near };
  });
  const flakes = Array.from({ length: 220 }, () => ({ x: U(0, W), y: U(0, 1080), r: U(1.2, 3.2), sp: U(0.5, 1.1), ph: r() * 6.28 }));
  const collect = (s: Seg) => {
    leaves.push(...s.leaves);
    s.children.forEach(collect);
  };
  limbs.forEach(collect);
  const tips: Seg[] = [];
  const collectTips = (s: Seg) => (s.tip && s.level >= 4 ? tips.push(s) : s.children.forEach(collectTips));
  limbs.forEach(collectTips);
  const clouds = Array.from({ length: 16 }, () => ({ x: U(-400, W), y: U(20, 560), w: U(500, 1100), h: U(90, 200), sp: U(0.6, 1.4) }));

  const trunkTop = Math.min(...limbs.map((l) => l.y1)) - 4; // thân kết thúc ở cành cao nhất
  return { trunkTop, trunk, limbs, roots, wraps, debris, grass, strata, pebbles, stonePoly, drops, flakes, leaves, tips, clouds, farHills, splashes };
};

export type Scenery = ReturnType<typeof buildScenery>;
