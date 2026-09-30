// "Câu chuyện tảng đá" (bản 4) — nửa sau hành trình (mốc theo STORYBOARD.md):
//   LiftScene   81.8–95.1  mùa nước cạn, cần cẩu nhấc đá lên lúc bình minh
//   TruckScene  95.1–110.5 xe tải chở đá qua thung lũng núi đá vôi
//   RidgeScene 110.5–125.6 nhìn cao: con đường uốn qua dãy núi, chấm đèn xe
//   NightRoad  125.6–142.7 đèo núi đêm, hai luồng đèn xe
//   PlazaScene 154.3–171.2 · 190–225.8 quảng trường giữa núi: mở vải, nắng xuyên lỗ thủng, hoàng hôn → sao → điểm sáng
//   PersonScene 171.2–190  con người: ô cửa ánh sáng đầu tiên → mưa, cúi đầu, đốm sáng trong ngực → tia sáng, ngẩng lên
import React from "react";
import { AbsoluteFill } from "remotion";
import type { SceneProps } from "./Scenes";
import { Figure, PoseName } from "./Figure";
import { stonePath } from "./StoneJourney";

const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = (x: number) => { const k = clamp(x); return k * k * (3 - 2 * k); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (v: number) => v.toFixed(1);
const VB = (vertical: boolean) => (vertical ? "656 0 607 1080" : "0 0 1920 1080");
const hex = (c: string) => (c.startsWith("rgb") ? (c.match(/\d+/g) ?? []).slice(0, 3).map(Number) : [0, 1, 2].map((i) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16)));
const mix = (a: string, b: string, k: number) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(k)))).join(",")})`; };
/** Nội suy bảng màu theo thời gian: [[t, c1, c2, ...], ...] */
const palAt = (keys: [number, ...string[]][], t: number) => {
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[i + 1], k = ease(seg(t, a[0], b[0]));
  return a.slice(1).map((c, j) => mix(c as string, b[j + 1] as string, k));
};

// Dãy núi mềm (sin chồng + nhiễu)
function ridge(seed: number, y0: number, amp: number, w0 = -600, w1 = 2520, n = 70) {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = w0 + ((w1 - w0) * i) / n, u = x / 1920;
    const h = 0.5 * Math.sin(u * 3.1 + seed) + 0.3 * Math.sin(u * 7.3 + seed * 2.1) + 0.2 * Math.sin(u * 15.7 + seed * 3.7) + (hash(i + seed * 31) - 0.5) * 0.18;
    pts.push(`L${f1(x)},${f1(y0 - amp * (0.55 + 0.45 * h))}`);
  }
  return `M${w0},2400 ${pts.join(" ")} L${w1},2400 Z`;
}
// Dãy núi hùng vĩ: các đỉnh nhọn [x, cao, nửa rộng]
type Peak = [number, number, number];
function range(seed: number, y0: number, peaks: Peak[], w0 = -600, w1 = 2520, n = 160) {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const x = w0 + ((w1 - w0) * i) / n;
    let h = 0;
    peaks.forEach(([px, ph, pw]) => { h = Math.max(h, ph * Math.pow(Math.max(0, 1 - Math.abs(x - px) / pw), 1.25)); });
    h += (hash(i * 1.7 + seed) - 0.5) * 16 + 8 * Math.sin(x * 0.05 + seed);
    pts.push(`L${f1(x)},${f1(y0 - Math.max(0, h))}`);
  }
  return `M${w0},2400 ${pts.join(" ")} L${w1},2400 Z`;
}
const snow = (peaks: Peak[], y0: number, c: string) =>
  peaks.filter((p) => p[1] > 260).map(([px, ph, pw], i) => {
    const d = 0.2 * ph, w = (pw * d) / ph;
    return <path key={i} d={`M${px},${y0 - ph} L${px - w},${y0 - ph + d} l${w * 0.35},${-d * 0.18} l${w * 0.3},${d * 0.14} l${w * 0.4},${-d * 0.2} l${w * 0.45},${d * 0.12} l${w * 0.5},${-d * 0.08} Z`} fill={c} />;
  });

// ------------------------------------------------------------------ xe tải chở đá phủ bạt (quay đầu sang trái)
const Truck: React.FC<{ x: number; y: number; s: number; t: number; roll: number; lights?: number; color?: string; tarp?: string; rim?: string }> = ({ x, y, s, t, roll, lights = 0, color = "#0b0d0f", tarp = "#2c3438", rim }) => {
  const wheel = (wx: number, i: number) => (
    <g key={i} transform={`translate(${wx} -42) rotate(${(roll * 57.3) % 360})`}>
      <circle r={42} fill={color} />
      <circle r={20} fill="#1b1f22" />
      {[0, 1, 2, 3, 4].map((j) => <line key={j} x1={0} y1={0} x2={18 * Math.cos(j * 1.2566)} y2={18 * Math.sin(j * 1.2566)} stroke="#050607" strokeWidth={4} />)}
    </g>
  );
  const bump = 3 * Math.sin(t * 9) * Math.sin(t * 2.3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {lights > 0 && (
        <>
          <polygon points="-352,-78 -1500,-240 -1500,120" fill="url(#hl)" opacity={lights} />
          <circle cx={-350} cy={-74} r={10} fill={`rgba(255,236,190,${lights})`} />
          <circle cx={352} cy={-70} r={7} fill={`rgba(220,40,30,${0.9 * lights})`} />
        </>
      )}
      <g transform={`translate(0 ${bump})`}>
        {/* bệ + thùng */}
        <path d="M-200,-96 L360,-96 L360,-64 L-200,-64 Z" fill={color} />
        {/* tảng đá dưới bạt */}
        <path d={stonePath(80, -96, 240, 1)} fill={tarp} fillRule="nonzero" />
        {[-0.65, -0.35, -0.05].map((k, i) => <path key={i} d={`M${80 - 200},${-96 + 240 * k} Q80,${-96 + 240 * k - 18} ${80 + 170},${-96 + 240 * k}`} stroke="rgba(10,10,10,0.7)" strokeWidth={3} fill="none" />)}
        {[-120, 60, 250].map((dx, i) => <line key={i} x1={dx} y1={-96} x2={dx - 30} y2={-96 - 200 + i * 30} stroke="rgba(10,10,10,0.55)" strokeWidth={3} />)}
        {rim && <path d={stonePath(80, -96, 240, 1)} fill="none" stroke={rim} strokeWidth={3} />}
        {/* cabin */}
        <path d="M-350,-64 L-350,-170 Q-348,-210 -300,-230 L-210,-236 L-196,-236 L-196,-64 Z" fill={color} />
        <path d="M-338,-150 Q-334,-196 -296,-212 L-226,-216 L-226,-150 Z" fill={lights > 0 ? `rgba(255,200,130,${0.18 * lights})` : "rgba(160,190,200,0.14)"} />
        {rim && <path d="M-350,-170 Q-348,-210 -300,-230 L-196,-236" stroke={rim} strokeWidth={3} fill="none" />}
      </g>
      {[-290, 60, 160, 280].map(wheel)}
    </g>
  );
};

// ------------------------------------------------------------------ 81.8–95.1 CẦN CẨU NHẤC ĐÁ LÚC BÌNH MINH
export const LiftScene: React.FC<SceneProps> = ({ t, vertical }) => {
  const [top, mid, hor] = palAt([[81.8, "#0e1426", "#3b3552", "#b0685a"], [88, "#1d2a44", "#6b5a78", "#e9a071"], [95.1, "#2f4a6a", "#b58a86", "#f5c890"]], t);
  const sunY = lerp(720, 520, ease(seg(t, 81.8, 94))), sunX = 1380;
  const burst = Math.sin(Math.PI * seg(t, 90.3, 93.5));
  const lift = ease(seg(t, 87.6, 93.6));
  const x0 = 800, y0 = 930, H = 560;
  const sy = y0 - 300 * lift, rot = 0.035 * Math.sin((t - 87.6) * 1.7) * lift * (1 - 0.5 * lift);
  const stoneTop = sy - H;
  const tip: [number, number] = [790, 120];
  const hookY = t < 87.6 ? lerp(160, stoneTop - 70, ease(seg(t, 82.2, 85))) : stoneTop - 70;
  const strap = ease(seg(t, 84.8, 86.6));
  const zoom = t < 87.6 ? lerp(0.9, 1.0, ease(seg(t, 81.8, 87.6))) : 1;
  const camY = 110 * ease(seg(t, 87.6, 94.5));
  // cần cẩu: gốc cần trên xe bên phải
  const base: [number, number] = [1600, 760];
  const bx = tip[0] - base[0], by = tip[1] - base[1], bl = Math.hypot(bx, by), nx = -by / bl, ny = bx / bl;
  const lattice = Array.from({ length: 16 }, (_, i) => {
    const a = i / 16, b = (i + 1) / 16, sgn = i % 2 ? 1 : -1;
    return `M${f1(base[0] + bx * a + nx * 16 * sgn)},${f1(base[1] + by * a + ny * 16 * sgn)} L${f1(base[0] + bx * b - nx * 16 * sgn)},${f1(base[1] + by * b - ny * 16 * sgn)}`;
  }).join(" ");
  const sp = (fx: number, fy: number) => { const X = fx * H, Y = fy * H, c = Math.cos(rot), s = Math.sin(rot); return [x0 + X * c - Y * s, sy + X * s + Y * c]; };
  const wL = sp(-0.6, -0.34), wR = sp(0.34, -0.3);
  return (
    <AbsoluteFill style={{ background: "#07070a" }}>
      <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="l-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={top} /><stop offset="55%" stopColor={mid} /><stop offset="100%" stopColor={hor} /></linearGradient>
          <radialGradient id="l-sun"><stop offset="0%" stopColor="rgba(255,240,200,1)" /><stop offset="18%" stopColor="rgba(255,210,150,0.8)" /><stop offset="100%" stopColor="rgba(255,170,110,0)" /></radialGradient>
          <linearGradient id="l-ray" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,215,160,0.35)" /><stop offset="100%" stopColor="rgba(255,215,160,0)" /></linearGradient>
        </defs>
        <g transform={`translate(960 ${600 + camY}) scale(${zoom}) translate(-960 -600)`}>
          <rect x={-600} y={-800} width={3100} height={1500} fill="url(#l-sky)" />
          <circle cx={sunX} cy={sunY} r={420 + 200 * burst} fill="url(#l-sun)" opacity={0.75 + 0.25 * burst} />
          <path d={ridge(3, 640, 190)} fill={mix("#4a4560", hor, 0.25)} opacity={0.9} />
          <path d={ridge(8, 690, 110)} fill="#241f2c" />
          {/* lòng sông cạn */}
          <rect x={-600} y={700} width={3100} height={900} fill="#15120f" />
          <path d={`M-600,780 Q300,740 960,775 T2500,760 L2500,800 Q1500,815 960,808 T-600,818 Z`} fill={hor} opacity={0.35} />
          {Array.from({ length: 90 }, (_, i) => <ellipse key={i} cx={hash(i) * 2600 - 340} cy={720 + Math.pow(hash(i * 3), 0.7) * 380} rx={6 + 22 * hash(i * 5) * (0.5 + hash(i * 3))} ry={4 + 9 * hash(i * 7)} fill={`rgba(${90 + 60 * hash(i * 9)},${80 + 50 * hash(i * 9)},${70 + 40 * hash(i * 9)},0.35)`} />)}
          {/* tia nắng sớm */}
          {/* hố lõm nơi đá từng nằm */}
          <ellipse cx={x0} cy={y0 + 6} rx={360} ry={30} fill="#0a0907" opacity={lift} />
          {/* xe cẩu */}
          <path d="M1440,900 L1440,800 L1560,780 L1760,780 L1760,720 L1880,720 Q1920,730 1930,780 L1940,900 Z" fill="#0b0c0e" />
          <path d="M1770,735 L1870,735 L1890,770 L1770,770 Z" fill="rgba(255,210,160,0.18)" />
          {[1500, 1620, 1860].map((wx, i) => <circle key={i} cx={wx} cy={900} r={40} fill="#070808" />)}
          <path d={`M${base[0] + nx * 18},${base[1] + ny * 18} L${tip[0] + nx * 10},${tip[1] + ny * 10} L${tip[0] - nx * 10},${tip[1] - ny * 10} L${base[0] - nx * 18},${base[1] - ny * 18} Z`} fill="none" stroke="#0b0c0e" strokeWidth={7} />
          <path d={lattice} stroke="#0b0c0e" strokeWidth={4} />
          <circle cx={base[0]} cy={base[1]} r={34} fill="#0b0c0e" />
          <line x1={tip[0]} y1={tip[1]} x2={tip[0]} y2={hookY} stroke="#0b0c0e" strokeWidth={4} />
          <path d={`M${tip[0] - 16},${hookY} l32,0 l-6,26 l-20,0 Z`} fill="#0b0c0e" />
          {/* dây đai */}
          {strap > 0 && [wL, wR].map((w, i) => <line key={i} x1={tip[0]} y1={hookY + 24} x2={lerp(tip[0], w[0], strap)} y2={lerp(hookY + 24, w[1], strap)} stroke="#b8702e" strokeWidth={6} />)}
          {/* tảng đá */}
          <path d={stonePath(x0, sy, H, 1, rot)} fill="#0a0b0d" fillRule="evenodd" />
          <path d={stonePath(x0, sy, H, 1, rot)} fill="none" stroke={`rgba(255,200,140,${0.35 + 0.4 * burst})`} strokeWidth={3} transform="translate(3 -2)" fillRule="evenodd" />
          {strap > 0 && <path d={`M${wL[0]},${wL[1]} Q${x0},${(wL[1] + wR[1]) / 2 + 26} ${wR[0]},${wR[1]}`} stroke="#b8702e" strokeWidth={7} fill="none" opacity={strap} />}
          {/* nước nhỏ giọt khi nhấc lên */}
          {lift > 0.02 && Array.from({ length: 14 }, (_, i) => {
            const ph = (t * 1.3 + hash(i)) % 1, dx = (hash(i * 3) - 0.5) * 520;
            return <line key={i} x1={x0 + dx} y1={sy - 6 + ph * 300} x2={x0 + dx} y2={sy + 10 + ph * 300} stroke={`rgba(230,220,200,${0.6 * (1 - ph) * seg(lift, 0, 0.2)})`} strokeWidth={2} />;
          })}
          {/* chim bay khi nắng bừng */}
          {t > 90 && Array.from({ length: 7 }, (_, i) => {
            const k = seg(t, 90 + i * 0.15, 95.1), bx2 = lerp(1250, 200 + i * 40, k) + i * 30, by2 = lerp(560, 180 + i * 25, k), fl = 10 * Math.sin(t * 12 + i);
            return <path key={i} d={`M${bx2 - 14},${by2 - fl} Q${bx2 - 6},${by2 - 4} ${bx2},${by2} Q${bx2 + 6},${by2 - 4} ${bx2 + 14},${by2 - fl}`} stroke="#141214" strokeWidth={3} fill="none" />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// Tháp đá vôi (karst): trụ cao đầu tròn
function karst(seed: number, x: number, y0: number, w: number, h: number) {
  const n = 14, pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = Math.PI * (i / n), r = 1 + (hash(seed * 7 + i) - 0.5) * 0.18;
    const px = x - Math.cos(a) * w * 0.5 * r * (0.8 + 0.2 * Math.sin(a)), py = y0 - h * Math.pow(Math.sin(a), 0.35) * r;
    pts.push(`${f1(px)},${f1(py)}`);
  }
  return `M${x - w * 0.62},${y0 + 400} L${pts.join(" L")} L${x + w * 0.62},${y0 + 400} Z`;
}
const KarstLayer: React.FC<{ seed: number; y0: number; scroll: number; hMin: number; hMax: number; wMin: number; wMax: number; gap: number; color: string }> = ({ seed, y0, scroll, hMin, hMax, wMin, wMax, gap, color }) => {
  const span = 2600, n = Math.ceil(span / gap);
  return (
    <g fill={color}>
      {Array.from({ length: n }, (_, i) => {
        const x = ((((i * gap + hash(i + seed) * gap * 0.5 + scroll) % span) + span) % span) - 340;
        return <path key={i} d={karst(i + seed * 10, x, y0, lerp(wMin, wMax, hash(i * 3 + seed)), lerp(hMin, hMax, hash(i * 5 + seed)))} />;
      })}
    </g>
  );
};

// ------------------------------------------------------------------ 95.1–110.5 XE TẢI QUA THUNG LŨNG
export const TruckScene: React.FC<SceneProps> = ({ t, vertical }) => {
  const T = t - 95.1, d = T * 260;
  const [top, hor] = palAt([[95.1, "#6f8fa6", "#f0d6b0"], [110.5, "#7c9bb0", "#e9dcc0"]], t);
  const zoom = lerp(1.12, 1.0, ease(seg(t, 95.1, 101)));
  return (
    <AbsoluteFill style={{ background: "#0a0c0e" }}>
      <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="t-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={top} /><stop offset="100%" stopColor={hor} /></linearGradient>
          <linearGradient id="t-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={hor} stopOpacity={0} /><stop offset="100%" stopColor={hor} stopOpacity={0.7} /></linearGradient>
        </defs>
        <g transform={`translate(0 -90) translate(960 760) scale(${zoom}) translate(-960 -760)`}>
          <rect x={-600} y={-400} width={3100} height={1500} fill="url(#t-sky)" />
          <circle cx={1500} cy={260} r={70} fill="rgba(255,248,228,0.85)" />
          {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={((i * 560 - T * 12) % 2800) + 200} cy={170 + 60 * hash(i)} rx={220 + 90 * hash(i * 3)} ry={26} fill="rgba(255,255,255,0.35)" />)}
          <KarstLayer seed={1} y0={760} scroll={d * 0.08} hMin={260} hMax={480} wMin={160} wMax={300} gap={210} color="#a9b8b8" />
          <rect x={-600} y={400} width={3100} height={400} fill="url(#t-haze)" />
          <KarstLayer seed={2} y0={800} scroll={d * 0.22} hMin={220} hMax={420} wMin={200} wMax={360} gap={330} color="#6d8285" />
          <KarstLayer seed={3} y0={850} scroll={d * 0.5} hMin={180} hMax={360} wMin={260} wMax={420} gap={560} color="#34453f" />
          {/* ruộng, đường */}
          <rect x={-600} y={840} width={3100} height={400} fill="#26332b" />
          {Array.from({ length: 16 }, (_, i) => <line key={i} x1={((i * 200 + d) % 3200) - 600} y1={850} x2={((i * 200 + d) % 3200) - 600 + 40} y2={870} stroke="rgba(160,190,150,0.25)" strokeWidth={3} />)}
          <rect x={-600} y={900} width={3100} height={70} fill="#1a1d1c" />
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={((i * 300 + d) % 3600) - 600} y={934} width={110} height={5} fill="rgba(230,225,200,0.45)" />)}
          {/* bụi sau xe */}
          {Array.from({ length: 10 }, (_, i) => { const ph = (T * 0.9 + i / 10) % 1; return <circle key={i} cx={1330 + ph * 500} cy={920 - ph * 60} r={20 + 60 * ph} fill={`rgba(220,205,170,${0.28 * (1 - ph)})`} />; })}
          <Truck x={960} y={960} s={1} t={t} roll={-d / 42} rim="rgba(255,236,200,0.5)" />
          {/* bụi cây gần, lướt nhanh */}
          {Array.from({ length: 6 }, (_, i) => { const x = ((i * 520 + d * 1.6) % 3120) - 600; return <ellipse key={i} cx={x} cy={1060} rx={120 + 60 * hash(i)} ry={70} fill="#0d110e" />; })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 110.5–125.6 NHÌN CAO: ĐƯỜNG UỐN QUA DÃY NÚI
const ROAD: [number, number][] = [[80, 1120], [380, 990], [760, 1010], [1040, 930], [790, 850], [990, 770], [1320, 790], [1470, 690], [1220, 620], [1400, 540], [1650, 500], [1900, 420], [2200, 380]];
function spline(P: [number, number][], n = 12) {
  const out: [number, number][] = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, P.length - 1)];
    for (let k = 0; k < n; k++) {
      const u = k / n, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map((d) => 0.5 * (2 * p1[d] + (p2[d] - p0[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * u3)) as [number, number]);
    }
  }
  out.push(P[P.length - 1]);
  return out;
}
const ROADPTS = spline(ROAD);
const ROADLEN = ROADPTS.reduce((acc, p, i) => (i ? [...acc, acc[i - 1] + Math.hypot(p[0] - ROADPTS[i - 1][0], p[1] - ROADPTS[i - 1][1])] : [0]), [] as number[]);
const roadAt = (k: number) => {
  const L = ROADLEN[ROADLEN.length - 1] * clamp(k);
  let i = 1;
  while (i < ROADLEN.length - 1 && ROADLEN[i] < L) i++;
  const u = (L - ROADLEN[i - 1]) / Math.max(ROADLEN[i] - ROADLEN[i - 1], 1e-3);
  return [lerp(ROADPTS[i - 1][0], ROADPTS[i][0], u), lerp(ROADPTS[i - 1][1], ROADPTS[i][1], u)];
};

export const RidgeScene: React.FC<SceneProps> = ({ t, vertical }) => {
  const k = seg(t, 110.5, 125.6);
  const [top, hor, far, near] = palAt([[110.5, "#6e7ea0", "#f2c48a", "#9a8fa0", "#2e2a36"], [118, "#5a5f88", "#eaa070", "#7d6c86", "#231f2c"], [125.6, "#232746", "#a0606a", "#4b4262", "#141220"]], t);
  const truck = roadAt(lerp(0.05, 0.92, k));
  const camY = lerp(0, -140, ease(k)), camX = lerp(0, -160, ease(k));
  const lights = seg(t, 119, 122);
  const layers = [0, 1, 2, 3, 4, 5];
  return (
    <AbsoluteFill style={{ background: "#0c0b12" }}>
      <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="r-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={top} /><stop offset="100%" stopColor={hor} /></linearGradient>
          <radialGradient id="r-dot"><stop offset="0%" stopColor="rgba(255,232,180,1)" /><stop offset="100%" stopColor="rgba(255,200,120,0)" /></radialGradient>
          <filter id="r-blur"><feGaussianBlur stdDeviation="18" /></filter>
        </defs>
        <g transform={`translate(${camX} ${-camY})`}>
          <rect x={-600} y={-600} width={3300} height={1200} fill="url(#r-sky)" />
          <circle cx={1650} cy={lerp(300, 470, k)} r={60} fill="rgba(255,236,200,0.9)" opacity={1 - seg(t, 121, 125)} />
          {layers.map((i) => (
            <path key={i} d={ridge(11 + i * 3, 420 + i * 120, 170 - i * 8)} fill={mix(far, near, i / 5)} />
          ))}
          <path d={"M" + ROADPTS.map((p) => p.map(f1).join(",")).join(" L")} stroke="rgba(235,220,190,0.5)" strokeWidth={5} fill="none" strokeLinecap="round" />
          <circle cx={truck[0]} cy={truck[1]} r={34 + 30 * lights} fill="url(#r-dot)" opacity={0.6 + 0.4 * lights} />
          <circle cx={truck[0]} cy={truck[1]} r={5} fill="#fff2d6" />
          {/* mây bay qua */}
          {Array.from({ length: 6 }, (_, i) => {
            const x = ((i * 520 + (t - 110.5) * (40 + 30 * hash(i))) % 3000) - 500;
            return <ellipse key={i} cx={x} cy={380 + i * 110} rx={300 + 160 * hash(i * 3)} ry={40 + 20 * hash(i * 5)} fill={`rgba(250,235,225,${0.22 + 0.2 * hash(i * 7)})`} filter="url(#r-blur)" />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 125.6–142.7 ĐÈO NÚI ĐÊM
export const NightRoad: React.FC<SceneProps> = ({ t, vertical }) => {
  const T = t - 125.6, d = T * 200;
  const wide = ease(seg(t, 133.5, 139));
  const zoom = lerp(1, 0.5, wide);
  const dim = seg(t, 140.5, 142.7);
  return (
    <AbsoluteFill style={{ background: "#020308" }}>
      <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="n-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#03050c" /><stop offset="100%" stopColor="#141c33" /></linearGradient>
          <linearGradient id="hl" x1="1" y1="0" x2="0" y2="0"><stop offset="0%" stopColor="rgba(255,230,170,0.55)" /><stop offset="100%" stopColor="rgba(255,230,170,0)" /></linearGradient>
        </defs>
        <rect x={-600} y={-600} width={3300} height={2400} fill="url(#n-sky)" />
        {Array.from({ length: 160 }, (_, i) => <circle key={i} cx={hash(i) * 1920} cy={hash(i * 3) * 700} r={0.8 + 1.6 * hash(i * 5)} fill={`rgba(235,240,255,${0.3 + 0.6 * hash(i * 7) * (0.7 + 0.3 * Math.sin(t * 2 + i))})`} />)}
        <circle cx={1560} cy={200} r={46} fill="#e8ecf4" />
        <circle cx={1560} cy={200} r={140} fill="rgba(200,215,245,0.08)" />
        <g transform={`translate(0 -110) translate(960 900) scale(${zoom}) translate(-960 -900)`}>
          <path d={ridge(21, 700, 380, -2600, 4500, 160)} fill="#0d1224" transform={`translate(${(d * 0.05) % 400} 0)`} />
          <path d={ridge(5, 800, 300, -2600, 4500, 160)} fill="#080b16" transform={`translate(${(d * 0.15) % 800} 0)`} />
          <path d={ridge(5, 800, 300, -2600, 4500, 160)} fill="none" stroke="rgba(170,190,230,0.18)" strokeWidth={2} transform={`translate(${(d * 0.15) % 800} -2)`} />
          <rect x={-2600} y={900} width={7100} height={1400} fill="#04050a" />
          <rect x={-2600} y={905} width={7100} height={60} fill="#0a0c12" />
          {Array.from({ length: 30 }, (_, i) => <rect key={i} x={((i * 300 + d) % 9000) - 2600} y={936} width={110} height={5} fill="rgba(230,225,200,0.25)" />)}
          {Array.from({ length: 14 }, (_, i) => { const x = ((i * 620 + d * 1.2) % 8680) - 2600; return <path key={i} d={`M${x},905 l6,-50 l6,50 Z`} fill="#10131c" />; })}
          <Truck x={1100} y={960} s={0.9} t={t} roll={-d / 42} lights={1} color="#05060a" tarp="#0f1318" rim="rgba(170,190,230,0.25)" />
        </g>
        <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.6 * dim} />
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ QUẢNG TRƯỜNG GIỮA NÚI (154.3–171.2, 190–225.8)
const PEAKS_FAR: Peak[] = [[-200, 360, 520], [320, 440, 520], [700, 330, 380], [1180, 360, 400], [1560, 470, 520], [2060, 380, 520]];
const PEAKS_NEAR: Peak[] = [[-100, 260, 460], [420, 210, 380], [1450, 240, 420], [1980, 290, 480]];
const CROWD: { x: number; y: number; H: number; pose: PoseName; flip?: boolean; from?: number }[] = [
  { x: 430, y: 880, H: 150, pose: "look", from: -500 }, { x: 520, y: 930, H: 170, pose: "stand", from: -400 }, { x: 330, y: 960, H: 190, pose: "look", flip: false, from: -600 },
  { x: 610, y: 870, H: 140, pose: "look" }, { x: 1380, y: 880, H: 150, pose: "look", flip: true, from: 2300 }, { x: 1500, y: 940, H: 175, pose: "stand", flip: true, from: 2400 },
  { x: 1630, y: 900, H: 160, pose: "look", flip: true, from: 2500 }, { x: 1280, y: 960, H: 190, pose: "look", flip: true },
];

export const PlazaScene: React.FC<SceneProps> = ({ t, vertical }) => {
  const [top, mid, hor] = palAt([
    [154.3, "#0d1224", "#3a2f4a", "#d9825a"], [158, "#2a4a6e", "#8aa6c0", "#f3c68e"], [171, "#3d6a92", "#9dbbd0", "#e8d6b0"],
    [190, "#3a4e78", "#d49a6a", "#f6c170"], [200.7, "#2b3050", "#b8645a", "#f0a060"], [208, "#141a33", "#3a3050", "#7a4a50"], [213, "#04060f", "#0a1022", "#141a30"], [226, "#020308", "#05070f", "#0a0e1c"],
  ], t);
  const X = 990, Y = 760, H = 440;
  const hole: [number, number] = [X - 0.2 * H, Y - 0.62 * H];
  // mặt trời: bình minh mọc trong khe núi phía sau lỗ thủng; hoàng hôn lặn xuống sau lỗ thủng
  const sun: [number, number] = t < 175 ? [hole[0], t < 157.8 ? lerp(700, 520, ease(seg(t, 154.3, 157.8))) : lerp(520, hole[1] - 30, seg(t, 157.8, 161.6))]
    : [lerp(1420, hole[0], ease(seg(t, 190, 204))), t < 204 ? lerp(330, hole[1], ease(seg(t, 190, 204))) : lerp(hole[1], 720, ease(seg(t, 206.5, 210)))];
  const beam = t < 175 ? ease(seg(t, 158.2, 159.2)) : Math.sin(Math.PI * seg(t, 202.2, 207.2));
  const sunA = t < 175 ? 1 : 1 - seg(t, 207, 210.5);
  const cloth = t < 175 ? 1 - ease(seg(t, 157.77, 158.9)) : 0;
  const person = t > 175;
  const night = seg(t, 205, 213);
  // máy quay: toàn cảnh cao → hạ xuống; 161.6 lao vào lỗ thủng; 215 ngửa lên trời, lùi xa
  let zoom = 1, fx = 960, fy = 600, tilt = 0;
  if (t < 157.8) { zoom = lerp(0.8, 1, ease(seg(t, 154.3, 157.8))); }
  else if (t < 175) { zoom = lerp(1, 16, Math.pow(seg(t, 161.6, 163.3), 2.2)); fx = hole[0]; fy = hole[1]; }
  else { zoom = lerp(1.08, 1, ease(seg(t, 190, 196))); tilt = 1500 * ease(seg(t, 214, 221)); }
  const white = t < 175 ? seg(t, 162.6, 163.3) : 0;
  const starK = seg(t, 208, 214);
  const conv = ease(seg(t, 219.5, 223.5)), fade = seg(t, 224.3, 225.8);
  const floor = mix("#2a2a2c", "#0c0d12", night);
  return (
    <AbsoluteFill style={{ background: "#020308" }}>
      <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="p-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={top} /><stop offset="60%" stopColor={mid} /><stop offset="100%" stopColor={hor} /></linearGradient>
          <radialGradient id="p-sun"><stop offset="0%" stopColor="rgba(255,248,225,1)" /><stop offset="15%" stopColor="rgba(255,220,160,0.85)" /><stop offset="100%" stopColor="rgba(255,180,110,0)" /></radialGradient>
          <linearGradient id="p-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,236,190,0.75)" /><stop offset="100%" stopColor="rgba(255,236,190,0)" /></linearGradient>
          <radialGradient id="p-pt"><stop offset="0%" stopColor="rgba(255,255,245,1)" /><stop offset="30%" stopColor="rgba(255,240,210,0.5)" /><stop offset="100%" stopColor="rgba(255,230,190,0)" /></radialGradient>
        </defs>
        <g transform={`translate(0 ${tilt})`}>
          <rect x={-600} y={-2200} width={3100} height={3000} fill="url(#p-sky)" />
          {/* sao */}
          {starK > 0 && Array.from({ length: 220 }, (_, i) => {
            const sx = hash(i) * 2400 - 240, sy = hash(i * 3) * 2300 - 1800;
            const cx = lerp(sx, 960, conv), cy = lerp(sy, 540 - tilt, conv);
            return <circle key={i} cx={cx} cy={cy} r={0.8 + 1.8 * hash(i * 5)} fill={`rgba(240,244,255,${starK * (0.3 + 0.6 * hash(i * 7)) * (1 - 0.5 * conv)})`} />;
          })}
          <g transform={`translate(${fx} ${fy}) scale(${zoom}) translate(${-fx} ${-fy})`}>
            {sunA > 0 && <circle cx={sun[0]} cy={sun[1]} r={t < 175 ? 520 : 420} fill="url(#p-sun)" opacity={sunA} />}
            <path d={range(4, 640, PEAKS_FAR)} fill={mix("#56607a", "#0a0d18", night)} opacity={0.95} />
            {snow(PEAKS_FAR, 640, mix("#e9e4dc", "#1c2236", night))}
            <path d={range(9, 660, PEAKS_NEAR)} fill={mix("#2c3040", "#06080f", night)} />
            {/* sàn quảng trường, đường lát hội tụ */}
            <rect x={-600} y={640} width={3100} height={900} fill={floor} />
            {Array.from({ length: 25 }, (_, i) => <line key={i} x1={960 + (i - 12) * 40} y1={640} x2={960 + (i - 12) * 330} y2={1200} stroke="rgba(0,0,0,0.25)" strokeWidth={2} />)}
            {Array.from({ length: 9 }, (_, i) => { const y = 640 + Math.pow(i / 8, 1.8) * 460; return <line key={i} x1={-600} y1={y} x2={2500} y2={y} stroke="rgba(0,0,0,0.22)" strokeWidth={2} />; })}
            <rect x={-600} y={640} width={3100} height={40} fill={hor} opacity={0.25 * (1 - night)} />
            {/* bệ đá */}
            <path d={`M${X - 330},${Y} L${X + 330},${Y} L${X + 370},${Y + 30} L${X + 410},${Y + 30} L${X + 430},${Y + 64} L${X - 430},${Y + 64} L${X - 410},${Y + 30} L${X - 370},${Y + 30} Z`} fill={mix("#1c1b1d", "#07080c", night)} />
            <line x1={X - 330} y1={Y} x2={X + 330} y2={Y} stroke={`rgba(255,220,170,${0.3 * (1 - night)})`} strokeWidth={2} />
            {/* tia nắng xuyên lỗ thủng */}
            {beam > 0 && (
              <g opacity={beam}>
                <polygon points={`${hole[0] - 34},${hole[1] - 20} ${hole[0] + 34},${hole[1] - 20} ${hole[0] + 160},${1100} ${hole[0] - 120},${1100}`} fill="url(#p-beam)" />
                {Array.from({ length: 10 }, (_, i) => { const a = -Math.PI * 0.9 + (i / 9) * Math.PI * 0.8; return <line key={i} x1={hole[0]} y1={hole[1]} x2={hole[0] + Math.cos(a) * 620} y2={hole[1] - Math.sin(a) * 480} stroke="rgba(255,230,180,0.07)" strokeWidth={30} strokeLinecap="round" />; })}
                <circle cx={hole[0]} cy={hole[1]} r={70} fill="url(#p-pt)" />
              </g>
            )}
            {/* tảng đá */}
            {cloth < 0.999 && <path d={stonePath(X, Y, H, 1)} fill="#0a0a0c" fillRule="evenodd" />}
            <path d={stonePath(X, Y, H, 1)} fill="none" opacity={1 - cloth} stroke={`rgba(255,215,160,${0.55 * (1 - night) + 0.2})`} strokeWidth={3} fillRule="evenodd" />
            {/* vải phủ: sụp xuống chân bệ */}
            {cloth > 0 && (
              <g transform={`translate(0 ${Y}) scale(1 ${Math.max(cloth, 0.04)}) translate(0 ${-Y})`}>
                <path d={stonePath(X + 4, Y + 4, H * 1.1, 1)} fill="#8a8c90" fillRule="nonzero" />
                {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${X - 250 + i * 80},${Y - 20} Q${X - 260 + i * 80 + 30 * Math.sin(i)},${Y - 200} ${X - 200 + i * 60},${Y - 380 + 30 * hash(i)}`} stroke="rgba(40,40,45,0.35)" strokeWidth={4} fill="none" />)}
              </g>
            )}
            {cloth < 1 && cloth > 0 && <ellipse cx={X} cy={Y + 10} rx={lerp(250, 300, cloth)} ry={lerp(18, 8, cloth)} fill="#4a4b4f" opacity={1 - cloth} />}
            {cloth === 0 && t < 175 && <ellipse cx={X + 60} cy={Y + 16} rx={250} ry={18} fill="#4a4b4f" />}
            {/* đám đông kéo đến */}
            {t < 175 && CROWD.map((c, i) => {
              const k = c.from !== undefined ? ease(seg(t, 154.3 + i * 0.2, 158.5 + i * 0.2)) : 1;
              const x = c.from !== undefined ? lerp(c.from, c.x, k) : c.x;
              return <Figure key={i} pose={k < 1 ? "walk" : c.pose} t={t + i} x={x} y={c.y} H={c.H} flip={c.flip} scarf="none" color="#0c0c0e" rim="rgba(255,215,165,0.4)" rimDir={[-1, -1]} />;
            })}
            {/* người ấy đứng cạnh tảng đá */}
            {person && <Figure pose="look" t={t} x={1370} y={825} H={250} flip scarf="none" color="#09090b" rim={`rgba(255,205,150,${0.6 * (1 - night) + 0.15})`} rimDir={[-1, -1]} />}
          </g>
        </g>
        {/* điểm sáng cuối (khép vòng với ánh sáng đầu tiên) */}
        {conv > 0 && <circle cx={960} cy={540} r={40 + 120 * conv} fill="url(#p-pt)" opacity={conv * (1 - fade)} />}
        {white > 0 && <rect x={0} y={0} width={1920} height={1080} fill="#fff6e4" opacity={white} />}
        {fade > 0 && <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={fade} />}
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 163.3–171.2 GÓC CỦA ĐÁ: nhìn qua lỗ thủng ra thế giới
export const HoleView: React.FC<SceneProps> = ({ t, vertical }) => {
  const k = seg(t, 163.3, 171.2);
  const white = 1 - seg(t, 163.3, 164.2);
  const zoom = lerp(1.0, 1.08, ease(k));
  return (
    <AbsoluteFill style={{ background: "#050507" }}>
      <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="h-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4d7ba0" /><stop offset="100%" stopColor="#f1dcb2" /></linearGradient>
          <mask id="h-hole"><rect x={0} y={0} width={1920} height={1080} fill="#000" /><ellipse cx={960} cy={520} rx={620} ry={440} fill="#fff" /></mask>
          <radialGradient id="h-edge"><stop offset="80%" stopColor="rgba(0,0,0,0)" /><stop offset="100%" stopColor="rgba(0,0,0,0.75)" /></radialGradient>
        </defs>
        <g mask="url(#h-hole)">
          <g transform={`translate(960 540) scale(${zoom}) translate(-960 -540)`}>
            <rect x={0} y={0} width={1920} height={1080} fill="url(#h-sky)" />
            <path d={range(2, 560, [[300, 300, 460], [900, 380, 500], [1500, 330, 460]])} fill="#6c7890" />
            {snow([[300, 300, 460], [900, 380, 500], [1500, 330, 460]], 560, "#eee8de")}
            <rect x={0} y={560} width={1920} height={600} fill="#3a3836" />
            {Array.from({ length: 21 }, (_, i) => <line key={i} x1={960 + (i - 10) * 50} y1={560} x2={960 + (i - 10) * 300} y2={1100} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />)}
            {/* mọi người đứng ngắm, bóng đổ về phía máy quay */}
            {Array.from({ length: 13 }, (_, i) => {
              const x = 440 + i * 85 + 30 * hash(i), H = 170 + 110 * hash(i * 3), y = 720 + 120 * hash(i * 5);
              return (
                <g key={i}>
                  <ellipse cx={x} cy={y + 60} rx={18} ry={70} fill="rgba(0,0,0,0.25)" />
                  <Figure pose={i % 3 ? "look" : "stand"} t={t + i} x={x} y={y} H={H} flip={i % 2 === 0} scarf="none" color="#141313" rim="rgba(255,225,180,0.55)" rimDir={[0, -1]} />
                </g>
              );
            })}
            {/* hạt bụi nắng */}
            {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={hash(i) * 1920} cy={(hash(i * 3) * 1080 - (t - 163) * 20 * (0.5 + hash(i))) % 1080} r={1.5 + 2 * hash(i * 5)} fill="rgba(255,240,210,0.5)" />)}
          </g>
        </g>
        <ellipse cx={960} cy={520} rx={620} ry={440} fill="url(#h-edge)" />
        <ellipse cx={960} cy={520} rx={620} ry={440} fill="none" stroke="rgba(255,220,170,0.35)" strokeWidth={4} />
        {white > 0 && <rect x={0} y={0} width={1920} height={1080} fill="#fff6e4" opacity={white} />}
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ 171.2–190 CON NGƯỜI
export const PersonScene: React.FC<SceneProps> = ({ t, vertical }) => {
  // phần 1: ô cửa (khớp hình với lỗ thủng) — ánh sáng đầu tiên của một đời người
  if (t < 177.8) {
    const k = seg(t, 171.2, 177.8);
    const sunY = lerp(760, 560, ease(k));
    const W = 1240, Hh = 880, cx = 960, cy = 520, r = W / 2, top = cy - Hh / 2;
    const win = `M${cx - r},${cy + Hh / 2} L${cx - r},${top + r} A${r},${r} 0 0 1 ${cx + r},${top + r} L${cx + r},${cy + Hh / 2} Z`;
    const glow = 0.4 + 0.6 * ease(seg(t, 173, 176));
    return (
      <AbsoluteFill style={{ background: "#07070a" }}>
        <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="w-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={mix("#1b2440", "#4d6f96", k)} /><stop offset="100%" stopColor={mix("#c07a62", "#f4cf9c", k)} /></linearGradient>
            <radialGradient id="w-sun"><stop offset="0%" stopColor="rgba(255,246,220,1)" /><stop offset="20%" stopColor="rgba(255,215,160,0.8)" /><stop offset="100%" stopColor="rgba(255,190,120,0)" /></radialGradient>
            <clipPath id="w-clip"><path d={win} /></clipPath>
          </defs>
          <g clipPath="url(#w-clip)">
            <rect x={0} y={0} width={1920} height={1080} fill="url(#w-sky)" />
            <circle cx={1180} cy={sunY} r={460} fill="url(#w-sun)" />
            <path d={ridge(6, 860, 140)} fill={mix("#3a3048", "#6a6a80", k)} />
            <path d={ridge(12, 920, 80)} fill={mix("#231c2c", "#3c3a48", k)} />
          </g>
          {/* khung cửa, song cửa */}
          <path d={win} fill="none" stroke="#050506" strokeWidth={26} />
          <line x1={cx} y1={top} x2={cx} y2={cy + Hh / 2} stroke="#050506" strokeWidth={14} />
          <line x1={cx - r} y1={top + r + 60} x2={cx + r} y2={top + r + 60} stroke="#050506" strokeWidth={14} />
          <rect x={0} y={cy + Hh / 2 - 6} width={1920} height={300} fill="#050506" />
          {/* người cha/mẹ nâng đứa trẻ về phía ánh sáng */}
          <Figure pose="cradle" t={t} x={820} y={1150} H={760} scarf="none" color="#060607" rim="rgba(255,210,160,0.55)" rimDir={[1, -1]} />
          <g transform="rotate(-8 955 560)"><ellipse cx={945} cy={562} rx={74} ry={36} fill="#0a0a0b" stroke="rgba(255,225,180,0.7)" strokeWidth={3} /><circle cx={1012} cy={548} r={27} fill="#0a0a0b" stroke="rgba(255,225,180,0.8)" strokeWidth={3} /></g>
          <circle cx={955} cy={556} r={110} fill="url(#w-sun)" opacity={0.35 * glow} />
        </svg>
      </AbsoluteFill>
    );
  }
  // phần 2–3: mưa, cúi đầu; đốm sáng trong ngực (khớp vết sáng dưới bùn) → tia sáng rọi, ngẩng lên
  const rain = 1 - seg(t, 184.9, 186.4);
  const sit = t >= 181.3 && t < 187.4;
  const beam = ease(seg(t, 185, 187));
  const dark = seg(t, 181.3, 183.5) * (1 - beam);
  const walk = t < 181.3;
  const d = walk ? (t - 177.8) * 180 : (181.3 - 177.8) * 180;
  const px = 960, py = 860, H = 420;
  const glowP: [number, number] = sit ? [px - 10, py - 0.25 * H] : [px - 8, py - 0.7 * H];
  const glow = t < 181.3 ? 0.25 : 0.4 + 0.6 * seg(t, 181.3, 184.9);
  const pose: PoseName = walk ? "walkWind" : sit ? "sitKnees" : "look";
  return (
    <AbsoluteFill style={{ background: "#04050a" }}>
      <svg viewBox={VB(vertical)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="q-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={mix("#0a0e18", "#2b3346", beam)} /><stop offset="100%" stopColor={mix("#1c2434", "#7a7282", beam)} /></linearGradient>
          <radialGradient id="q-glow"><stop offset="0%" stopColor="rgba(255,225,170,1)" /><stop offset="35%" stopColor="rgba(255,190,120,0.5)" /><stop offset="100%" stopColor="rgba(255,170,100,0)" /></radialGradient>
          <linearGradient id="q-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,240,205,0.9)" /><stop offset="100%" stopColor="rgba(255,230,190,0.15)" /></linearGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#q-sky)" />
        {/* mây mưa tan dần */}
        {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx={((i * 380 + (t - 177.8) * 30) % 2300) - 200} cy={120 + 50 * hash(i)} rx={340} ry={90} fill={`rgba(20,24,34,${0.8 * (1 - beam)})`} />)}
        <path d={ridge(15, 820, 90)} fill="#0b0e16" />
        <rect x={0} y={860} width={1920} height={300} fill="#07090e" />
        {/* mặt đất ướt phản chiếu */}
        {Array.from({ length: 10 }, (_, i) => <rect key={i} x={((i * 260 + d) % 2400) - 240} y={880 + (i % 3) * 40} width={120} height={3} fill="rgba(150,170,200,0.2)" />)}
        {beam > 0 && <polygon points={`${px - 60},0 ${px + 60},0 ${px + 280},1080 ${px - 260},1080`} fill="url(#q-beam)" opacity={beam * 0.8} />}
        {beam > 0 && <ellipse cx={px} cy={py + 6} rx={260} ry={34} fill="rgba(255,230,190,0.35)" opacity={beam} />}
        <Figure pose={pose} t={t} x={px} y={sit ? py - 0.05 * H : py} H={H} wind={walk ? 0.8 : 0} scarf="none" color="#050608" flip rim={beam > 0 ? `rgba(255,230,190,${0.3 + 0.6 * beam})` : "rgba(140,160,200,0.35)"} rimDir={[0, -1]} />
        <circle cx={glowP[0]} cy={glowP[1]} r={40 + 50 * glow + 6 * Math.sin(t * 3)} fill="url(#q-glow)" opacity={glow} />
        {/* mưa xiên */}
        {rain > 0 && Array.from({ length: 220 }, (_, i) => {
          const ph = (t * (1.6 + hash(i)) + hash(i * 3)) % 1, x = hash(i * 5) * 2300 - 200 + ph * -180, y = ph * 1200 - 100;
          return <line key={i} x1={x} y1={y} x2={x - 22} y2={y + 60} stroke={`rgba(170,190,220,${0.35 * rain})`} strokeWidth={1.6} />;
        })}
        {dark > 0 && <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.55 * dark} />}
        {dark > 0 && <circle cx={glowP[0]} cy={glowP[1]} r={30 + 40 * glow} fill="url(#q-glow)" opacity={glow * dark} />}
      </svg>
    </AbsoluteFill>
  );
};
