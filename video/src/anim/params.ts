// "Kịch bản chuyển động" của MV hoạt hình: các thông số thế giới thay đổi theo thời gian bài hát.
// Mỗi bài khai báo trong JSON: "anim": [{ "t": 0, "wind": 0.1, "leaves": 1 }, { "t": 30, "wind": 0.7 }, ...]
// Mỗi thông số nội suy mượt giữa các mốc có khai báo nó; mốc có "cut": true thì nhảy thẳng (cắt cảnh).

export const PARAMS = {
  sky: 0, // bảng màu trời: 0 chạng vạng bão · 1 giông · 2 đông · 3 bình minh Ember · 4 sáng
  clouds: 0.6, // độ dày mây 0–1
  wind: 0.1, // gió 0–1: cành lay, lá bay, mây chạy, cỏ rạp
  rain: 0, // mưa 0–1
  snow: 0, // tuyết 0–1
  frost: 0, // sương giá phủ cây 0–1
  lightning: 0, // 0–1: có chớp theo chữ được hát (giông/bão, đầu câu)
  leaves: 1, // tán lá còn lại 1 → 0 (lá rụng bay theo gió khi giảm)
  sprouts: 0, // chồi non trên đầu cành 0–1
  sun: 0.15, // quầng mặt trời sau đồi 0–1
  cam: 0, // máy quay: 0 mặt đất · 1 lòng đất (rễ) · 1.3 sâu tới tảng đá
  zoom: 1, // phóng
  roots: 0.25, // rễ đã mọc 0–1
  glow: 0, // rễ phát sáng Ember 0–1
  rings: 0, // cảnh vòng gỗ (độ hiện) 0–1
  ringsGrow: 0, // số vòng đã hiện 0–1
  bud: 0, // cảnh cận chồi non (độ hiện) 0–1
  budGrow: 0, // chồi nở 0–1
  black: 0, // màn đen 0–1
};

export type Param = keyof typeof PARAMS;
export type World = Record<Param, number>;
export type AnimKey = { t: number; cut?: boolean } & Partial<World>;

const smooth = (x: number) => x * x * (3 - 2 * x);

// Mỗi mốc kế thừa mọi thông số của mốc trước → thông số chỉ đổi giữa hai mốc liền nhau
// (vd "frost": 1 ở mốc 132.4 nghĩa là sương giá phủ dần từ mốc ngay trước đó tới 132.4).
const filledCache = new WeakMap<AnimKey[], { t: number; cut?: boolean; w: World }[]>();
const filled = (keys: AnimKey[]) => {
  let f = filledCache.get(keys);
  if (!f) {
    let cur: World = { ...PARAMS };
    f = [...keys]
      .sort((a, b) => a.t - b.t)
      .map((k) => {
        const { t, cut, ...vals } = k;
        cur = { ...cur, ...(vals as Partial<World>) };
        return { t, cut, w: cur };
      });
    filledCache.set(keys, f);
  }
  return f;
};

/** Giá trị mọi thông số tại thời điểm t. */
export const worldAt = (keys: AnimKey[], t: number): World => {
  const f = filled(keys);
  if (!f.length) return { ...PARAMS };
  if (t <= f[0].t) return f[0].w;
  let i = 0;
  while (i + 1 < f.length && f[i + 1].t <= t) i++;
  const a = f[i];
  const b = f[i + 1];
  if (!b || b.cut) return a.w;
  const x = smooth(Math.min(Math.max((t - a.t) / (b.t - a.t), 0), 1));
  const out = { ...a.w };
  for (const p of Object.keys(PARAMS) as Param[]) out[p] = a.w[p] + (b.w[p] - a.w[p]) * x;
  return out;
};

/** Lần đầu tiên thông số p tụt xuống dưới ngưỡng th (quét 0.1s) — dùng để biết lúc nào từng chiếc lá rụng. */
export const firstBelow = (keys: AnimKey[], p: Param, th: number, until: number) => {
  for (let t = 0; t <= until; t += 0.1) if (worldAt(keys, t)[p] < th) return t;
  return Infinity;
};

// ---- Màu
type RGB = [number, number, number];
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
export const mix = (a: RGB, b: RGB, x: number): RGB => a.map((v, i) => v + (b[i] - v) * x) as RGB;
export const css = (c: RGB, a = 1) => `rgba(${c.map((v) => Math.round(v)).join(",")},${a})`;
export const rgb = hex;

// Bảng màu trời [đỉnh, giữa, chân trời] — theo "Giấy cũ & Mực" + Night Blue / Stone / Ember (docs/02)
const SKIES: [RGB, RGB, RGB][] = [
  [hex("#121826"), hex("#23304A"), hex("#5a3b2e")], // 0 chạng vạng bão
  [hex("#0c0d11"), hex("#222428"), hex("#3a3a3c")], // 1 giông
  [hex("#252c38"), hex("#566070"), hex("#9aa3ad")], // 2 đông
  [hex("#1d2740"), hex("#7a4a35"), hex("#D9622B")], // 3 bình minh Ember
  [hex("#34465e"), hex("#a9775a"), hex("#f0b27a")], // 4 sáng
];

export const skyColors = (sky: number): [RGB, RGB, RGB] => {
  const i = Math.min(Math.max(Math.floor(sky), 0), SKIES.length - 2);
  const x = Math.min(Math.max(sky - i, 0), 1);
  return [0, 1, 2].map((k) => mix(SKIES[i][k], SKIES[i + 1][k], x)) as [RGB, RGB, RGB];
};

// ---- Số ngẫu nhiên cố định (mỗi lần render ra cùng một thế giới)
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
