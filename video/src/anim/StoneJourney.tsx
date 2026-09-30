// "Câu chuyện tảng đá" (bản 4) — hành trình của tảng đá, phong cách hoạt hình code kiểu "Sau Mùa Giông"
// (bóng đen điện ảnh, kể bằng ánh sáng/nước). Mốc thời gian theo STORYBOARD.md ("Chi tiết từng nhịp").
//   GenesisScene 0–16.6 s: ánh sáng đầu tiên → núi lửa → dung nham nguội thành đá → mưa, đá lăn xuống sông
//   DeepScene   16.6–45.7 s: chìm xuống đáy → tua nhanh ngày đêm, kỷ băng → dòng xiết mài mòn, lỗ thủng → đêm trăng
import React from "react";
import { AbsoluteFill } from "remotion";
import type { SceneProps } from "./Scenes";

const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = (x: number) => { const k = clamp(x); return k * k * (3 - 2 * k); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (v: number) => v.toFixed(1);
const VB = (vertical: boolean) => (vertical ? "656 0 607 1080" : "0 0 1920 1080");

// ------------------------------------------------------------------ dáng tảng đá
// Dáng cuối: khối cao uốn lượn như ngọn lửa, nghiêng trái, khía ở vai phải; lỗ thủng khi mài đủ lâu.
const FINAL: [number, number][] = [
  [-0.62, 0], [-0.66, -0.1], [-0.55, -0.24], [-0.5, -0.4], [-0.57, -0.56], [-0.47, -0.72], [-0.31, -0.86], [-0.12, -0.97],
  [0.08, -1.0], [0.23, -0.93], [0.19, -0.84], [0.06, -0.8], [0.12, -0.66], [0.27, -0.54], [0.31, -0.38], [0.24, -0.24], [0.43, -0.12], [0.61, 0],
];
function catmull(P: [number, number][], closed = true, n = 6) {
  const out: [number, number][] = [], L = P.length;
  for (let i = 0; i < (closed ? L : L - 1); i++) {
    const p0 = P[(i - 1 + L) % L], p1 = P[i], p2 = P[(i + 1) % L], p3 = P[(i + 2) % L];
    for (let k = 0; k < n; k++) {
      const u = k / n, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map((d) => 0.5 * (2 * p1[d] + (p2[d] - p0[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * u3)) as [number, number]);
    }
  }
  return out;
}
/** Đường viền tảng đá (evenodd: ngoài + lỗ). erode 0 = thô ráp sắc cạnh · 1 = dáng cuối có lỗ thủng. */
export function stonePath(x: number, y: number, H: number, erode: number, rot = 0) {
  const e = clamp(erode);
  // xen điểm giữa lồi/lõm (vách đá) — biên độ giảm dần khi mài
  const pts: [number, number][] = [];
  FINAL.forEach((p, i) => {
    const q = FINAL[(i + 1) % FINAL.length];
    const rough = (1 - e) * (0.1 * (hash(i * 3.1) - 0.5));
    pts.push([p[0] * (1 + rough), p[1] * (1 + rough * 0.6)]);
    if (i < FINAL.length - 1) {
      const m: [number, number] = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], nx = -(q[1] - p[1]), ny = q[0] - p[0], len = Math.hypot(nx, ny) || 1;
      const crag = (1 - e) * 0.09 * (hash(i * 7.7) > 0.5 ? 1 : -0.6);
      pts.push([m[0] + (nx / len) * crag, m[1] + (ny / len) * crag]);
    }
  });
  // thô: đường gấp khúc · mài: cong mượt
  const smooth = e > 0.35 ? catmull(pts, true, 5) : pts;
  const c = Math.cos(rot), s = Math.sin(rot), P = ([px, py]: [number, number]) => { const X = px * H, Y = py * H + H * 0.5; return [x + X * c - Y * s, y - H * 0.5 + X * s + Y * c]; };
  let d = "M" + smooth.map((p) => P(p).map(f1).join(",")).join(" L") + " Z";
  const hk = clamp((e - 0.55) / 0.4);
  if (hk > 0) {
    const hx = -0.2, hy = -0.62, rx = 0.1 * hk, ry = 0.14 * hk;
    const hole = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; return P([hx + Math.cos(a) * rx, hy + Math.sin(a) * ry]); });
    d += " M" + hole.map((p) => p.map(f1).join(",")).join(" L") + " Z";
  }
  return d;
}

// ------------------------------------------------------------------ SÁNG THẾ 0–16.6 s
const GenesisPart: React.FC<SceneProps & { part: number }> = ({ t, vertical, part }) => {
  const W = 1920;
  // 0–2.6: ánh sáng đầu tiên
  if (part === 0) {
    const k = ease(seg(t, 0.8, 2.2)), breathe = 1 + 0.12 * Math.sin(t * 7), wf = seg(t, 2.2, 2.6);
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="g-first"><stop offset="0%" stopColor="#fffaf0" /><stop offset="25%" stopColor="rgba(255,236,200,0.7)" /><stop offset="100%" stopColor="rgba(255,200,140,0)" /></radialGradient>
          </defs>
          {k > 0 && <circle cx={960} cy={540} r={(20 + 260 * k) * breathe} fill="url(#g-first)" />}
          {k > 0 && <circle cx={960} cy={540} r={3 + 6 * k} fill="#fffdf6" />}
        </svg>
        {wf > 0 && <AbsoluteFill style={{ background: "#fff8ec", opacity: Math.sin(wf * Math.PI) }} />}
      </AbsoluteFill>
    );
  }
  // 2.6–6.5: núi lửa (máy quay nghiêng từ trời xuống)
  if (part === 1) {
    const tilt = lerp(-260, 0, ease(seg(t, 2.6, 5.2))), burst = Math.exp(-Math.max(0, t - 4.55) * 3) * (t >= 4.55 ? 1 : 0);
    const shake = burst * 10 * Math.sin(t * 60);
    return (
      <AbsoluteFill style={{ background: "#0a0506" }}>
        <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#120708" /><stop offset="60%" stopColor="#4a1410" /><stop offset="100%" stopColor="#8a2a14" /></linearGradient>
            <radialGradient id="g-crater"><stop offset="0%" stopColor="rgba(255,180,90,1)" /><stop offset="40%" stopColor="rgba(230,90,30,0.6)" /><stop offset="100%" stopColor="rgba(200,50,20,0)" /></radialGradient>
          </defs>
          <g transform={`translate(${shake} ${-tilt})`}>
            <rect x={-200} y={-600} width={W + 400} height={1900} fill="url(#g-sky)" />
            {/* mây tro */}
            {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={((i * 380 + t * 20) % 2400) - 200} cy={-120 + (i % 3) * 90} rx={380} ry={70} fill="rgba(20,10,12,0.75)" />)}
            <circle cx={960} cy={430} r={380 + 260 * burst} fill="url(#g-crater)" opacity={0.7 + 0.3 * burst} />
            {/* núi xa + núi lửa */}
            <path d="M-200,1080 L240,700 L520,860 L760,740 L1100,900 L1500,720 L2120,1080 Z" fill="#170b0c" />
            <path d="M420,1080 L860,450 L1060,450 L1500,1080 Z" fill="#0c0708" />
            {/* dòng dung nham chảy xuống sườn */}
            {[[-120, 0], [-40, 1], [60, 2], [150, 3]].map(([dx, i]) => {
              const k = ease(seg(t, 2.8 + i * 0.3, 6.5));
              const d = `M${960 + dx * 0.3},455 Q${960 + dx * 1.4},${650} ${960 + dx * 2.6},${lerp(460, 1080, k)}`;
              return <path key={i} d={d} stroke="#ff7a2a" strokeWidth={10 + i * 2} fill="none" strokeLinecap="round" opacity={0.9} style={{ filter: "drop-shadow(0 0 12px #ff5a1a)" }} />;
            })}
            {/* tàn lửa bắn */}
            {Array.from({ length: 46 }, (_, i) => {
              const life = 1.3 + hash(i) * 0.9, ph = ((t - 2.6 + hash(i * 3) * life) % life) / life;
              const a = -Math.PI / 2 + (hash(i * 5) - 0.5) * (1.1 + burst * 0.8), v = 500 + 700 * hash(i * 7) + burst * 600;
              const x = 960 + Math.cos(a) * v * ph, y = 450 + Math.sin(a) * v * ph + 900 * ph * ph;
              return <circle key={i} cx={x} cy={y} r={(3 + 4 * hash(i)) * (1 - ph)} fill={ph < 0.4 ? "#ffd27a" : "#ff6a2a"} />;
            })}
          </g>
        </svg>
        {burst > 0.02 && <AbsoluteFill style={{ background: "#ff9a4a", opacity: 0.35 * burst, mixBlendMode: "screen" }} />}
      </AbsoluteFill>
    );
  }
  // 6.5–10.3: dung nham nguội thành khối đá
  if (part === 2) {
    const cool = seg(t, 8.0, 10.2), rise = ease(seg(t, 7.8, 9.8)), z = lerp(1.0, 1.12, seg(t, 6.5, 10.3));
    const crack = cool < 0.5 ? `rgb(${255},${lerp(122, 60, cool * 2)},${lerp(42, 20, cool * 2)})` : `rgb(${lerp(255, 40, (cool - 0.5) * 2)},${lerp(60, 30, (cool - 0.5) * 2)},${lerp(20, 28, (cool - 0.5) * 2)})`;
    return (
      <AbsoluteFill style={{ background: "#0b0708" }}>
        <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="g-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28" /></filter>
            <radialGradient id="g-heat" cx="50%" cy="80%" r="70%"><stop offset="0%" stopColor={`rgba(255,110,40,${0.8 * (1 - cool)})`} /><stop offset="100%" stopColor="rgba(40,10,10,0)" /></radialGradient>
          </defs>
          <g transform={`translate(960 600) scale(${z}) translate(-960 -600)`}>
            <rect x={-200} y={-200} width={2400} height={1500} fill="url(#g-heat)" />
            <rect x={-200} y={780} width={2400} height={500} fill={`rgb(${lerp(60, 20, cool)},${lerp(18, 16, cool)},${lerp(14, 18, cool)})`} />
            {Array.from({ length: 14 }, (_, i) => {
              const x = hash(i) * 1920, w = 60 + 140 * hash(i * 3);
              return <path key={i} d={`M${x},${790 + 60 * hash(i * 5)} l${w * 0.4},${20 * (hash(i * 7) - 0.5)} l${w * 0.6},${30 * (hash(i * 9) - 0.5)}`} stroke={crack} strokeWidth={4 - 2 * cool} fill="none" strokeLinecap="round" />;
            })}
            <path d={stonePath(960, lerp(1150, 800, rise), 560, 0)} fill={`rgb(${lerp(70, 22, cool)},${lerp(26, 22, cool)},${lerp(22, 26, cool)})`} />
            {cool < 0.9 && <path d={stonePath(960, lerp(1150, 800, rise), 560, 0)} fill="none" stroke={crack} strokeWidth={3} opacity={1 - cool} />}
            {/* hơi nước */}
            <g filter="url(#g-blur)">{Array.from({ length: 12 }, (_, i) => {
              const ph = ((t * 0.35 + hash(i)) % 1);
              return <ellipse key={i} cx={760 + hash(i * 3) * 420 + 30 * Math.sin(t + i)} cy={lerp(620, 150, ph)} rx={50 + 90 * ph} ry={30 + 50 * ph} fill={`rgba(200,190,200,${0.22 * (1 - ph) * seg(t, 8, 9)})`} />;
            })}</g>
          </g>
        </svg>
      </AbsoluteFill>
    );
  }
  // 10.3–16.6: mưa đầu tiên, đá lăn xuống sông
  const rain = seg(t, 10.3, 12.2), roll = ease(seg(t, 13.5, 15.2)), sink = seg(t, 15.2, 16.6), splash = t >= 15.2 ? seg(t, 15.2, 16.4) : 0;
  const riverY = 860, p0 = [620, 610], p1 = [1320, riverY + 60];
  const sx = lerp(p0[0], p1[0], roll), sy = lerp(p0[1], p1[1], roll) - 180 * 4 * roll * (1 - roll) * 0.4 + sink * 160;
  const camX = lerp(0, -220, ease(seg(t, 13.2, 15.6)));
  const flash = Math.exp(-Math.pow((t - 11.6) / 0.08, 2)) + 0.6 * Math.exp(-Math.pow((t - 14.4) / 0.06, 2));
  return (
    <AbsoluteFill style={{ background: "#0d1016" }}>
      <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="g-rainsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0c0f16" /><stop offset="100%" stopColor="#2a3240" /></linearGradient>
        </defs>
        <g transform={`translate(${camX} 0)`}>
          <rect x={-400} y={-200} width={2800} height={1500} fill="url(#g-rainsky)" />
          <path d="M-400,560 L200,420 L620,600 L900,700 L1200,820 L1300,860 L2400,860 L2400,1300 L-400,1300 Z" fill="#0a0b0e" />
          <rect x={1180} y={riverY} width={1300} height={400} fill="#1a2230" />
          <path d={stonePath(sx, sy, 300, 0, roll * 2.6)} fill="#0e0f12" />
          {/* nước phủ lên phần đá đã chìm */}
          {sink > 0 && <rect x={1180} y={riverY} width={1300} height={400} fill="#1a2230" opacity={0.3 + 0.7 * sink} />}
          {splash > 0 && Array.from({ length: 18 }, (_, i) => {
            const a = -Math.PI / 2 + (i / 17 - 0.5) * 2.2, d = 60 + 260 * splash * (0.6 + 0.4 * hash(i)), y = riverY - 10 + Math.sin(a) * d + 700 * splash * splash;
            return <circle key={i} cx={1320 + Math.cos(a) * d} cy={y} r={10 * (1 - splash) + 2} fill="rgba(220,230,240,0.85)" />;
          })}
          {splash > 0 && <ellipse cx={1320} cy={riverY + 6} rx={80 + 420 * splash} ry={10 + 30 * splash} fill="none" stroke={`rgba(220,230,240,${1 - splash})`} strokeWidth={3} />}
        </g>
        {Array.from({ length: Math.round(220 * rain) }, (_, i) => {
          const y = ((hash(i) * 1200 + t * 1400 * (0.8 + 0.4 * hash(i * 3))) % 1200) - 60, x = ((hash(i * 7) * 2200 + t * 260) % 2200) - 140;
          return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 34} stroke={`rgba(200,210,225,${0.25 + 0.2 * (i % 3 === 0 ? 1 : 0)})`} strokeWidth={i % 3 === 0 ? 2 : 1} />;
        })}
      </svg>
      {flash > 0.02 && <AbsoluteFill style={{ background: "#dfe6ff", opacity: 0.35 * flash, mixBlendMode: "screen" }} />}
    </AbsoluteFill>
  );
};

// Hoà chuyển giữa các phần: núi lửa → (máy quay lao vào dòng dung nham dưới chân núi) → hồ dung nham;
// khối đá nguội → (lùi ra, hoà) → sườn dốc dưới mưa.
export const GenesisScene: React.FC<SceneProps> = (props) => {
  const { t } = props;
  if (t >= 5.8 && t < 6.9) {
    const k = ease(seg(t, 5.8, 6.9));
    return (
      <AbsoluteFill style={{ background: "#0b0708" }}>
        <AbsoluteFill style={{ transform: `scale(${1 + 2.4 * k})`, transformOrigin: "50% 92%" }}>
          <GenesisPart {...props} part={1} t={Math.min(t, 6.49)} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: ease(seg(t, 6.25, 6.9)) }}>
          <GenesisPart {...props} part={2} t={Math.max(t, 6.5)} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (t >= 9.9 && t < 10.8) {
    const k = ease(seg(t, 9.9, 10.8));
    return (
      <AbsoluteFill style={{ background: "#0d1016" }}>
        <AbsoluteFill style={{ transform: `scale(${1 - 0.25 * k})`, transformOrigin: "50% 60%", opacity: 1 - k }}>
          <GenesisPart {...props} part={2} t={Math.min(t, 10.29)} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: k }}>
          <GenesisPart {...props} part={3} t={Math.max(t, 10.3)} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  const part = t < 2.6 ? 0 : t < 6.5 ? 1 : t < 10.3 ? 2 : 3;
  return <GenesisPart {...props} part={part} />;
};

// ------------------------------------------------------------------ sinh vật cổ đại (bóng đen, viền xanh mờ)
const SIL = "#05070a", RIM = "rgba(150,195,205,0.35)";
const Trilobite: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((d) => Array.from({ length: 6 }, (_, i) => <line key={`${d}${i}`} x1={-14 + i * 6} y1={0} x2={-16 + i * 6 + 3 * Math.sin(t * 12 + i)} y2={d * 14} stroke={SIL} strokeWidth={2} />))}
    <ellipse cx={0} cy={0} rx={26} ry={13} fill={SIL} stroke={RIM} strokeWidth={1} />
    <path d="M14,-10 Q28,0 14,10 Z" fill={SIL} />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-16 + i * 6} y1={-11} x2={-16 + i * 6} y2={11} stroke={RIM} strokeWidth={0.8} />)}
  </g>
);
const Anomalocaris: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={-60 + i * 12} cy={0} rx={9} ry={14 + 5 * Math.sin(t * 8 - i * 0.8)} fill={SIL} stroke={RIM} strokeWidth={0.8} />)}
    <ellipse cx={0} cy={0} rx={62} ry={10} fill={SIL} />
    {[-1, 1].map((d) => <path key={d} d={`M60,${d * 3} q22,${d * 4} 20,${d * 22} q-4,${d * 8} -10,${d * 2}`} stroke={SIL} strokeWidth={4} fill="none" strokeLinecap="round" />)}
    <path d="M-62,0 l-22,-12 l6,12 l-6,12 Z" fill={SIL} />
  </g>
);
const Dunkleosteus: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => {
  const jaw = 8 + 10 * Math.max(0, Math.sin(t * 3));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-150,0 Q-60,-40 60,-36 Q110,-30 130,-8 L130,${-2 + jaw * 0.2} Q60,40 -60,26 Q-120,18 -150,0 Z`} fill={SIL} stroke={RIM} strokeWidth={1.2} />
      <path d={`M60,-36 Q118,-34 142,-6 L120,${jaw} Q90,30 50,24 Z`} fill="#0c1116" stroke={RIM} strokeWidth={1.4} />
      <circle cx={100} cy={-16} r={5} fill="rgba(200,220,225,0.5)" />
      <path d={`M-150,0 l-50,${-34 + 8 * Math.sin(t * 5)} l18,34 l-18,34 Z`} fill={SIL} />
      <path d="M-20,-34 l30,-30 l20,30 Z" fill={SIL} />
    </g>
  );
};
const Ammonite: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${10 * Math.sin(t)})`}>
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M28,6 q${16 + i * 3},${-6 + i * 4 + 4 * Math.sin(t * 4 + i)} ${30 + i * 4},${8 + i * 3}`} stroke={SIL} strokeWidth={2.4} fill="none" />)}
    <circle cx={0} cy={0} r={30} fill={SIL} stroke={RIM} strokeWidth={1} />
    {[22, 15, 9, 4].map((r, i) => <circle key={i} cx={-(30 - r) * 0.4} cy={0} r={r} fill="none" stroke={RIM} strokeWidth={0.8} />)}
  </g>
);
const Plesiosaur: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => {
  const f = Math.sin(t * 2.2) * 18;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[[-50, 1], [50, 1], [-50, -1], [50, -1]].map(([dx, d], i) => <path key={i} d={`M${dx},${d * 20} q${-30},${d * (30 + (i % 2 ? f : -f))} ${-70},${d * (26 + (i % 2 ? f : -f))} q30,${-d * 6} 70,${-d * 22}`} fill={SIL} />)}
      <ellipse cx={0} cy={0} rx={110} ry={36} fill={SIL} stroke={RIM} strokeWidth={1.2} />
      <path d={`M100,-10 Q190,${-60 + 10 * Math.sin(t)} 260,-80 L270,-68 Q200,${-40 + 10 * Math.sin(t)} 104,12 Z`} fill={SIL} stroke={RIM} strokeWidth={1} />
      <ellipse cx={272} cy={-78} rx={20} ry={11} fill={SIL} />
      <path d="M-110,0 L-190,-8 L-190,8 Z" fill={SIL} />
    </g>
  );
};
const Fish: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M-20,0 Q0,-12 22,0 Q0,12 -20,0 Z M-20,0 l-12,${-9 + 3 * Math.sin(t * 14)} l0,18 Z`} fill={SIL} />
  </g>
);

// ------------------------------------------------------------------ LÒNG SÔNG 16.6–45.7 s
export const DeepScene: React.FC<SceneProps> = ({ t, vertical }) => {
  // máy quay: chìm qua mặt nước (16.6–18) → cận mép đá (31.4–38.2) → lùi ra (38.2–45.7)
  const descend = ease(seg(t, 16.6, 18.2));
  const surfaceY = lerp(1000, 110, descend);
  const fleckP = [960 - 0.05 * 560, 930 - 0.8 * 560];
  const zoom = t < 31.4 ? 1 : t < 35.6 ? lerp(1, 1.9, ease(seg(t, 31.4, 32.4))) : t < 38.2 ? lerp(1.9, 1.35, ease(seg(t, 35.6, 36.6))) : t < 40.8 ? lerp(1.35, 1.0, ease(seg(t, 38.2, 39.6))) : t < 63.4 ? lerp(1.0, 0.86, ease(seg(t, 40.8, 45.7)))
    : t < 71.3 ? lerp(0.86, 2.2, ease(seg(t, 63.4, 70.5))) : t < 78.3 ? lerp(2.2, 1.0, ease(seg(t, 71.3, 75))) : lerp(1.0, 1.15, ease(seg(t, 78.3, 81.8)));
  const fk = ease(seg(t, 63.4, 66)) * (1 - ease(seg(t, 71.3, 75)));
  const focus = t < 35.6 ? [1180, 560] : [lerp(900, fleckP[0], fk), lerp(560, fleckP[1], fk)];
  // 45.7+: ngày trở lại, thuyền trôi qua; 53.5–63.4 bùn phủ, tối dần; 63.4 vết sáng le lói; 71.3 bùn trôi đi; 78.3 tia sáng rọi
  const siltUp = ease(seg(t, 53.5, 63.4)), wash = ease(seg(t, 71.3, 78.3));
  const silt = siltUp * (1 - 0.8 * wash);
  const ray = ease(seg(t, 78.3, 79.4));
  const fleck = t < 63.4 ? 0 : (0.3 + 0.4 * ease(seg(t, 63.4, 71.3)) + 0.3 * wash) * (1 + 0.12 * Math.sin(t * 3.1));
  // ánh sáng mặt nước: ngày đêm nhanh dần (21.6–31.4), kỷ băng (26.4–29), đêm trăng (40.8+)
  const day = 1;
  const ice = clamp(Math.min(seg(t, 27.3, 27.9), 1 - seg(t, 28.7, 29.3)));
  // mỗi thời kỳ: hiện – bơi qua – tan biến (sin 0→1→0)
  const era = (a: number, b: number) => { const k = seg(t, a, b); return { k, o: Math.sin(Math.PI * k) }; };
  const cam = era(21.6, 23.8), dev = era(23.4, 25.8), jur = era(25.4, 27.8), mod = era(29.1, 31.6);
  const night = seg(t, 40.8, 42.4) * (1 - seg(t, 45.7, 47.4));
  const dayK = Math.min(1, day * (1 - night) * (1 - 0.35 * ice) * (1 - 0.85 * siltUp * (1 - 0.6 * wash)) + 0.5 * ray);
  const erode = t < 31.4 ? 0.12 : t < 35.6 ? lerp(0.12, 0.85, seg(t, 31.4, 35.6)) : lerp(0.85, 1, seg(t, 35.6, 38.2));
  const fast = seg(t, 31.4, 32.2) * (1 - seg(t, 37.6, 38.4));
  const land = seg(t, 17.4, 19.2);
  const stoneX = 960, stoneY = 930, H = 560;
  const top = [stoneX - 0.03 * H, stoneY - H];
  const water = (a: string, b: string) => `rgb(${[0, 1, 2].map((i) => Math.round(lerp(parseInt(a.slice(1 + i * 2, 3 + i * 2), 16), parseInt(b.slice(1 + i * 2, 3 + i * 2), 16), dayK))).join(",")})`;
  return (
    <AbsoluteFill style={{ background: "#03060a" }}>
      <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="d-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={water("#0a1420", "#3f7a86")} />
            <stop offset="55%" stopColor={water("#050a12", "#1a3a48")} />
            <stop offset="100%" stopColor={water("#020408", "#0a1a22")} />
          </linearGradient>
          <linearGradient id="d-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(220,240,235,0.35)" /><stop offset="100%" stopColor="rgba(220,240,235,0)" /></linearGradient>
          <linearGradient id="d-sunray" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,236,190,0.85)" /><stop offset="100%" stopColor="rgba(255,220,170,0.25)" /></linearGradient>
          <radialGradient id="d-warm"><stop offset="0%" stopColor="rgba(255,210,150,0.8)" /><stop offset="100%" stopColor="rgba(255,190,120,0)" /></radialGradient>
        </defs>
        <g transform={`translate(${focus[0]} ${focus[1]}) scale(${zoom}) translate(${-focus[0]} ${-focus[1]})`}>
          <rect x={-800} y={-800} width={3600} height={2800} fill="url(#d-water)" />
          {/* bầu trời phía trên mặt nước (khi đang chìm xuống) */}
          {surfaceY > 110 && <rect x={-800} y={-800} width={3600} height={surfaceY + 800} fill="#1a2230" />}
          {/* mặt nước + băng */}
          <path d={`M-800,${surfaceY} ${Array.from({ length: 40 }, (_, i) => `L${-800 + i * 100},${f1(surfaceY + 6 * Math.sin(i * 0.9 + t * 2))}`).join(" ")} L3200,${surfaceY}`} stroke={`rgba(200,230,235,${0.25 + 0.4 * dayK})`} strokeWidth={3} fill="none" />
          {ice > 0 && <rect x={-800} y={surfaceY - 20} width={3600} height={20 + 70 * ice} fill={`rgba(220,236,245,${0.85 * ice})`} />}
          {ice > 0.5 && Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${hash(i) * 1920},${surfaceY} l${40 * (hash(i * 3) - 0.5)},${60 * ice} l${50 * (hash(i * 5) - 0.5)},${30 * ice}`} stroke="rgba(150,180,200,0.8)" strokeWidth={2} fill="none" />)}
          {/* tia sáng lọc qua mặt nước */}
          {Array.from({ length: 6 }, (_, i) => {
            const x = 200 + i * 320 + 40 * Math.sin(t * 0.3 + i);
            return <polygon key={i} points={`${x},${surfaceY} ${x + 70},${surfaceY} ${x + 260},${surfaceY + 900} ${x + 120},${surfaceY + 900}`} fill="url(#d-ray)" opacity={dayK * (1 - ice)} />;
          })}
          {/* lá / gỗ trôi in bóng (thời nay) */}
          {t > 29.1 && t < 31.6 && Array.from({ length: 4 }, (_, i) => {
            const x = ((i * 600 + (t - 29) * 900) % 2600) - 400;
            return <ellipse key={i} cx={x} cy={surfaceY + 30} rx={160 + 80 * hash(i)} ry={26} fill="rgba(0,0,0,0.45)" />;
          })}
          {/* trăng lăn tăn trên mặt nước (đêm) */}
          {night > 0 && Array.from({ length: 22 }, (_, i) => <line key={i} x1={1300 + (hash(i) - 0.5) * 260 + 20 * Math.sin(t + i)} y1={surfaceY + 8 + (i % 5) * 6} x2={1340 + (hash(i) - 0.5) * 260 + 20 * Math.sin(t + i)} y2={surfaceY + 8 + (i % 5) * 6} stroke={`rgba(230,238,255,${0.6 * night})`} strokeWidth={2} />)}
          {/* đáy sông */}
          <path d={`M-800,960 Q400,930 960,950 T2800,940 L2800,2000 L-800,2000 Z`} fill="#06080a" />
          {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={hash(i) * 2200 - 140} cy={960 + hash(i * 3) * 60} rx={14 + 30 * hash(i * 5)} ry={8 + 12 * hash(i * 7)} fill="#0b0e12" />)}
          {/* bụi phù sa khi đá chạm đáy */}
          {land > 0 && land < 1 && Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={stoneX + (i - 3.5) * 90 * (0.5 + land)} cy={950 - 40 * land} rx={80 + 120 * land} ry={30 + 40 * land} fill={`rgba(60,70,70,${0.35 * (1 - land)})`} />)}
          {/* tảng đá */}
          <path d={stonePath(stoneX, lerp(560, stoneY, ease(seg(t, 16.6, 17.8))), H, erode)} fill="#07090c" fillRule="evenodd" />
          {/* viền sáng mép trên-trái theo ánh sáng mặt nước */}
          <path d={stonePath(stoneX, lerp(560, stoneY, ease(seg(t, 16.6, 17.8))), H, erode)} fill="none" fillRule="evenodd" stroke={`rgba(${lerp(160, 200, night)},${lerp(200, 215, night)},${lerp(205, 245, night)},${0.15 + 0.35 * dayK + 0.45 * night})`} strokeWidth={2.5 + night} />
          {/* tia sáng ấm chạm đỉnh khi dáng hoàn chỉnh */}
          {t > 38.2 && t < 42 && <circle cx={top[0]} cy={top[1] + 30} r={180} fill="url(#d-warm)" opacity={Math.sin(Math.PI * seg(t, 38.2, 42))} />}
          {/* dòng xiết: vệt bọt quét qua đá */}
          {Array.from({ length: Math.round(18 + 40 * fast) }, (_, i) => {
            const sp = 120 + 900 * fast, y = 260 + ((i * 53) % 640), x = ((hash(i) * 2400 + t * sp) % 2600) - 400;
            return <path key={i} d={`M${x},${y} q60,${-8 - 10 * fast} 140,${4}`} stroke={`rgba(190,220,225,${0.12 + 0.35 * fast})`} strokeWidth={1.5 + 2 * fast} fill="none" />;
          })}
          {/* nước luồn qua lỗ thủng */}
          {t > 36.5 && Array.from({ length: 10 }, (_, i) => {
            const ph = ((t * 0.8 + i / 10) % 1), hx = stoneX - 0.12 * H, hy = stoneY - 0.55 * H;
            return <circle key={i} cx={hx - 140 + 280 * ph} cy={hy + 10 * Math.sin(ph * 6 + i)} r={3} fill={`rgba(210,235,240,${0.7 * Math.sin(Math.PI * ph)})`} />;
          })}
          {/* các thời kỳ sinh vật bơi qua rồi tan biến */}
          {cam.o > 0 && (
            <g opacity={cam.o}>
              {[0, 1, 2].map((i) => <Trilobite key={i} x={lerp(300 + i * 260, 900 + i * 260, cam.k)} y={955 - (i % 2) * 8} s={1.4 + 0.2 * i} t={t + i} />)}
              <Anomalocaris x={lerp(1900, 200, cam.k)} y={290} s={1.3} t={t} />
            </g>
          )}
          {dev.o > 0 && <g opacity={dev.o}><Dunkleosteus x={lerp(2200, -300, dev.k)} y={300} s={1.5} t={t} /></g>}
          {jur.o > 0 && (
            <g opacity={jur.o}>
              <Plesiosaur x={lerp(-400, 2200, jur.k)} y={260} s={1.2} t={t} />
              {[0, 1, 2].map((i) => <Ammonite key={i} x={lerp(1450 + i * 180, 1300 + i * 180, jur.k)} y={470 + i * 110 + 20 * Math.sin(t + i)} s={0.9 + 0.2 * i} t={t + i} />)}
            </g>
          )}
          {mod.o > 0 && <g opacity={mod.o}>{Array.from({ length: 14 }, (_, i) => <Fish key={i} x={lerp(-200, 2100, mod.k) + (hash(i) - 0.5) * 360} y={380 + hash(i * 3) * 260} s={1 + hash(i * 5) * 0.8} t={t + i} />)}</g>}
          {/* bụi tan biến khi một loài biến mất */}
          {[cam, dev, jur].map((e, j) => e.k > 0.8 && e.k < 1 ? <g key={j} opacity={Math.sin(Math.PI * seg(e.k, 0.8, 1))}>{Array.from({ length: 16 }, (_, i) => <circle key={i} cx={[600, 400, 1500][j] + (hash(i + j * 20) - 0.5) * 500} cy={[700, 300, 260][j] - 120 * seg(e.k, 0.8, 1) * hash(i * 3)} r={2 + 2 * hash(i)} fill="rgba(170,200,210,0.5)" />)}</g> : null)}
          {/* thuyền trôi qua trên mặt nước — không ai nhìn xuống */}
          {t > 45.7 && t < 54 && [0, 1, 2].map((i) => {
            const k = seg(t, 45.7 + i * 2.3, 50.7 + i * 2.3), dir = i % 2 ? -1 : 1;
            if (k <= 0 || k >= 1) return null;
            const bx = dir > 0 ? lerp(-500, 2400, k) : lerp(2400, -500, k), L = 260 + 80 * i;
            return (
              <g key={i}>
                <path d={`M${bx - L},${surfaceY} Q${bx},${surfaceY + 46} ${bx + L},${surfaceY} Z`} fill="#05080c" />
                <polygon points={`${bx - L * 0.8},${surfaceY + 20} ${bx + L * 0.8},${surfaceY + 20} ${bx + L * 1.4},${surfaceY + 700} ${bx - L * 0.6},${surfaceY + 700}`} fill="rgba(0,0,0,0.22)" />
                {[-1, 1].map((s2) => <line key={s2} x1={bx + s2 * L * 0.3} y1={surfaceY} x2={bx + s2 * L * 0.3 - dir * 60 * Math.sin(t * 2.4 + i)} y2={surfaceY + 70} stroke="#05080c" strokeWidth={5} />)}
              </g>
            );
          })}
          {/* bùn phù sa lắng dần, phủ kín tảng đá */}
          {silt > 0 && (
            <>
              {t < 71.3 && Array.from({ length: 40 }, (_, i) => { const ph = (t * 0.12 + hash(i)) % 1; return <circle key={i} cx={hash(i * 3) * 2400 - 240} cy={lerp(surfaceY, 960, ph)} r={1.5 + 2 * hash(i * 5)} fill={`rgba(120,120,105,${0.5 * seg(t, 53.5, 55)})`} />; })}
              <path d={`M-800,2000 L-800,960 ${Array.from({ length: 61 }, (_, i) => { const x = -800 + i * 60; return `L${x},${f1(958 - silt * (600 * Math.exp(-Math.pow((x - 960) / 560, 2)) + 50) + 6 * Math.sin(x * 0.03))}`; }).join(" ")} L2800,960 L2800,2000 Z`} fill="#0d0e0e" />
              <path d={`M-800,960 ${Array.from({ length: 61 }, (_, i) => { const x = -800 + i * 60; return `L${x},${f1(958 - silt * (600 * Math.exp(-Math.pow((x - 960) / 560, 2)) + 50) + 6 * Math.sin(x * 0.03))}`; }).join(" ")}`} fill="none" stroke={`rgba(150,160,150,${0.25 * silt})`} strokeWidth={2} />
              {wash > 0 && wash < 1 && Array.from({ length: 30 }, (_, i) => { const ph = (t * 0.5 + hash(i)) % 1; return <ellipse key={i} cx={600 + ph * 1400 + 200 * hash(i * 3)} cy={560 + 300 * hash(i * 5) - 60 * ph} rx={30 + 50 * ph} ry={12 + 10 * ph} fill={`rgba(70,72,64,${0.4 * (1 - ph) * Math.sin(Math.PI * wash)})`} />; })}
            </>
          )}
          {/* vết sáng le lói trong lòng đá */}
          {fleck > 0 && (
            <>
              <circle cx={fleckP[0]} cy={fleckP[1]} r={60 + 140 * fleck} fill="url(#d-warm)" opacity={Math.min(1, fleck)} />
              <circle cx={fleckP[0]} cy={fleckP[1]} r={3 + 4 * fleck} fill="rgba(255,240,210,0.95)" />
            </>
          )}
          {/* tia sáng xuyên mặt nước rọi thẳng xuống tảng đá */}
          {ray > 0 && (
            <g opacity={ray}>
              <polygon points={`${fleckP[0] + 120},${surfaceY} ${fleckP[0] + 300},${surfaceY} ${fleckP[0] + 150},${fleckP[1] + 30} ${fleckP[0] - 170},${fleckP[1] + 30}`} fill="url(#d-sunray)" />
              <circle cx={fleckP[0]} cy={fleckP[1]} r={320} fill="url(#d-warm)" opacity={0.8} />
              <path d={stonePath(stoneX, stoneY, H, erode)} fill="none" fillRule="evenodd" stroke="rgba(255,215,160,0.8)" strokeWidth={3.5} />
              {Array.from({ length: 24 }, (_, i) => { const ph = (t * 0.2 + hash(i)) % 1; return <circle key={i} cx={fleckP[0] - 150 + 380 * hash(i * 3) + 60 * ph} cy={lerp(surfaceY + 60, stoneY - 100, hash(i * 7)) + 40 * ph} r={2 + 2 * hash(i * 5)} fill={`rgba(255,235,200,${0.7 * Math.sin(Math.PI * ph)})`} />; })}
            </g>
          )}
          {/* bọt khí khi chìm */}
          {t < 20 && Array.from({ length: 16 }, (_, i) => {
            const ph = seg(t, 16.6 + hash(i) * 1.2, 18.6 + hash(i) * 1.5);
            return ph > 0 && ph < 1 ? <circle key={i} cx={stoneX + (hash(i * 3) - 0.5) * 300} cy={lerp(800, surfaceY, ph)} r={4 + 6 * hash(i * 5)} fill="none" stroke="rgba(210,235,240,0.6)" strokeWidth={1.5} /> : null;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
