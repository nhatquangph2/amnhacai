// Nhân vật: hình bóng người mặc áo khoác dài, không lộ mặt, có viền sáng.
// Khung xương 2D nhìn nghiêng (mặt hướng +x); dáng = các góc khớp (độ), 0° = thõng thẳng xuống.
import React from "react";

export type PoseName = "stand" | "walk" | "walkWind" | "sitKnees" | "sitLean" | "desk" | "window";

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
  scarf?: string; // màu khăn quàng (mặc định Ember)
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

export const Figure: React.FC<FigureProps> = ({ pose, t, x, y, H, color = "#0d0c0c", rim, rimDir = [-1, -1], wind = 0, flip, scarf = "#D9622B" }) => {
  const p = poseAt(pose, t);
  const k = skeleton(p, H);
  const seated = pose === "sitKnees" || pose === "sitLean" || pose === "desk";
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

  const body = (c: string, withScarf: boolean) => (
    <>
      {limb(k.hip, k.kneeR, H * 0.075, H * 0.06, c, "tR")}
      {limb(k.kneeR, k.footR, H * 0.06, H * 0.045, c, "sR")}
      <ellipse cx={k.footR[0] + H * 0.025} cy={k.footR[1] + H * 0.008} rx={H * 0.042} ry={H * 0.018} fill={c} />
      {limb(k.sh, k.elbR, H * 0.055, H * 0.045, c, "uR")}
      {limb(k.elbR, k.handR, H * 0.045, H * 0.035, c, "fR")}
      <circle cx={k.handR[0]} cy={k.handR[1]} r={H * 0.024} fill={c} />
      {coat(c)}
      {limb(k.hip, k.kneeL, H * 0.078, H * 0.062, c, "tL")}
      {limb(k.kneeL, k.footL, H * 0.062, H * 0.046, c, "sL")}
      <ellipse cx={k.footL[0] + H * 0.025} cy={k.footL[1] + H * 0.008} rx={H * 0.042} ry={H * 0.018} fill={c} />
      {limb(k.sh, k.head, H * 0.045, H * 0.04, c, "neck")}
      <ellipse cx={k.head[0]} cy={k.head[1]} rx={H * 0.052} ry={H * 0.062} fill={c} transform={`rotate(${p.torso + p.head} ${k.head[0]} ${k.head[1]})`} />
      {/* tóc: phủ sau gáy */}
      <path
        d={`M${k.head[0] - H * 0.058},${k.head[1] + H * 0.02} Q${k.head[0] - H * 0.07},${k.head[1] - H * 0.07} ${k.head[0] + H * 0.01},${k.head[1] - H * 0.068} Q${k.head[0] + H * 0.05},${k.head[1] - H * 0.06} ${k.head[0] + H * 0.045},${k.head[1] - H * 0.03} L${k.head[0] - H * 0.02},${k.head[1] - H * 0.02} Z`}
        fill={c}
      />
      {withScarf && (
        <>
          <ellipse cx={neck[0]} cy={neck[1]} rx={H * 0.05} ry={H * 0.028} fill={scarf} />
          <path d={scarfPath} stroke={scarf} strokeWidth={H * 0.03} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      )}
      {limb(k.sh, k.elbL, H * 0.058, H * 0.047, c, "uL")}
      {limb(k.elbL, k.handL, H * 0.047, H * 0.036, c, "fL")}
      <circle cx={k.handL[0]} cy={k.handL[1]} r={H * 0.025} fill={c} />
    </>
  );
  const s = H / 300;
  return (
    <g transform={`translate(${x} ${y + oy})${flip ? " scale(-1 1)" : ""}`}>
      {rim && <g transform={`translate(${rimDir[0] * 2.4 * s} ${rimDir[1] * 2.4 * s})`}>{body(rim, false)}</g>}
      {body(color, true)}
    </g>
  );
};
