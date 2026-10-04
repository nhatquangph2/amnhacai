// Nhân vật: hình bóng người mặc áo khoác dài, không lộ mặt, có viền sáng.
// Khung xương 2D nhìn nghiêng (mặt hướng +x); dáng = các góc khớp (độ), 0° = thõng thẳng xuống.
import React from "react";

export type PoseName = "stand" | "walk" | "walkWind" | "sitKnees" | "sitLean" | "desk" | "window" | "reach" | "look" | "crouch" | "sitEdge" | "carry" | "cradle" | "holdLegs" | "shoulderPoint";

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
    case "window":
      return { torso: 2, head: 6, hipL: 3, kneeL: 2, hipR: -4, kneeR: 3, shL: 6, elL: 10, shR: 118, elR: -12 };
    default:
      return { torso: 0, head: 3 + 2 * Math.sin(t * 0.6), hipL: 3, kneeL: 1, hipR: -3, kneeR: 1, shL: 6, elL: 8, shR: -4, elR: 8 };
  }
};

type Pt = [number, number];
const down = (o: Pt, len: number, a: number): Pt => [o[0] + Math.sin(deg(a)) * len, o[1] + Math.cos(deg(a)) * len];
const up = (o: Pt, len: number, a: number): Pt => [o[0] + Math.sin(deg(a)) * len, o[1] - Math.cos(deg(a)) * len];

/** Tính vị trí các khớp; hông ở (0,0). */
const skeleton = (p: Pose, H: number) => {
  const hip: Pt = [0, 0];
  const sh = up(hip, H * 0.3, p.torso);
  const head = up(sh, H * 0.1, p.torso + p.head);
  const kneeL = down(hip, H * 0.25, p.hipL);
  const footL = down(kneeL, H * 0.25, p.hipL - p.kneeL);
  const kneeR = down(hip, H * 0.25, p.hipR);
  const footR = down(kneeR, H * 0.25, p.hipR - p.kneeR);
  const elbL = down(sh, H * 0.17, p.shL);
  const handL = down(elbL, H * 0.16, p.shL + p.elL);
  const elbR = down(sh, H * 0.17, p.shR);
  const handR = down(elbR, H * 0.16, p.shR + p.elR);
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
};

export type FigurePalette = { coat: string; pants: string; skin: string; hair: string; shoe?: string };

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

export const Figure: React.FC<FigureProps> = ({ pose, t, x, y, H, color = "#0d0c0c", rim, rimDir = [-1, -1], wind = 0, flip, scarf = "#D9622B", palette, hat, stoop = 0, load }) => {
  const p0 = poseAt(pose, t);
  const p = stoop ? { ...p0, torso: p0.torso + stoop, head: p0.head - stoop * 0.4 } : p0;
  const k = skeleton(p, H);
  const seated = pose === "sitKnees" || pose === "sitLean" || pose === "desk" || pose === "sitEdge";
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
      {/* tóc: phủ sau gáy */}
      <path
        d={`M${k.head[0] - H * 0.058},${k.head[1] + H * 0.02} Q${k.head[0] - H * 0.07},${k.head[1] - H * 0.07} ${k.head[0] + H * 0.01},${k.head[1] - H * 0.068} Q${k.head[0] + H * 0.05},${k.head[1] - H * 0.06} ${k.head[0] + H * 0.045},${k.head[1] - H * 0.03} L${k.head[0] - H * 0.02},${k.head[1] - H * 0.02} Z`}
        fill={pal.hair}
      />
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
  const s = H / 300;
  return (
    <g transform={`translate(${x} ${y + oy})${flip ? " scale(-1 1)" : ""}`}>
      {rim && <g transform={`translate(${rimDir[0] * 2.4 * s} ${rimDir[1] * 2.4 * s})`}>{body(rim, false)}</g>}
      {body(color, true)}
    </g>
  );
};
