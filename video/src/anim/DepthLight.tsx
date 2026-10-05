// Chiều sâu & ánh sáng đúng vật lý cho cảnh vẽ bằng code (SVG, toạ độ khung 1920×1080).
//  • SceneLight: một nguồn sáng chính / cảnh (vị trí, màu, độ cao so với chân trời) — nhân vật lấy viền sáng & bóng đổ từ đây
//  • Glitter: phản chiếu gương của nguồn sáng trên mặt nước — luôn nằm thẳng dưới nguồn sáng, loe rộng dần về phía máy quay
//  • HazePlane: sương không khí giữa các lớp (lớp càng xa càng nhiều lớp sương chồng lên → nhạt dần về màu trời)
//  • Parallax: lớp xa trượt chậm, lớp gần trượt nhanh theo máy quay
//  • Foreground: lau sậy / cọc bến / cành cây sát máy quay — tối, hơi nhoè (ngoài vùng nét)
import React, { createContext, useContext } from "react";

export type Light = { x: number; y: number; color: string; elev: number; ambient?: string };
export const SceneLight = createContext<Light | null>(null);
export const useLight = () => useContext(SceneLight);
export type Cam = { x: number; y: number; w: number; h: number };
export const CamCtx = createContext<Cam>({ x: 0, y: 0, w: 1920, h: 1080 });

const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (v: number) => v.toFixed(1);

/** Hướng (đơn vị) từ điểm (x,y) tới nguồn sáng — dùng cho viền sáng */
export const toLight = (l: Light, x: number, y: number): [number, number] => {
  const dx = l.x - x, dy = l.y - y, L = Math.hypot(dx, dy) || 1;
  return [dx / L, dy / L];
};

/** Bóng đổ trên mặt đất / sàn thuyền: hướng ngược nguồn sáng, dài theo 1/tan(độ cao) */
export const CastShadow: React.FC<{ x: number; y: number; h: number; light: Light; opacity?: number }> = ({ x, y, h, light, opacity = 0.32 }) => {
  const dir = light.x > x ? -1 : 1;
  const len = Math.min(h * 2.4, h / Math.tan((Math.max(light.elev, 6) * Math.PI) / 180));
  return (
    <g opacity={opacity}>
      <path d={`M${f1(x - h * 0.06)},${f1(y)} Q${f1(x + dir * len * 0.5)},${f1(y + h * 0.035)} ${f1(x + dir * len)},${f1(y + h * 0.012)} Q${f1(x + dir * len * 0.5)},${f1(y - h * 0.015)} ${f1(x + h * 0.06)},${f1(y)} Z`} fill={light.ambient ?? "#0b1220"} />
    </g>
  );
};

/** Sương không khí: phủ màu chân trời lên mọi thứ vẽ trước nó */
export const HazePlane: React.FC<{ color: string; opacity: number; y0?: number; y1?: number }> = ({ color, opacity, y0 = -200, y1 = 1300 }) => (
  <rect x={-400} y={y0} width={2720} height={y1 - y0} fill={color} opacity={opacity} />
);

/** Vệt nắng / trăng phản chiếu trên nước: cột vạch ngắn ngay dưới nguồn sáng, loe rộng & thưa dần về phía gần */
export const Glitter: React.FC<{ x: number; horizon: number; bottom?: number; t: number; color: string; strength?: number; spread?: number }> = ({ x, horizon, bottom = 1080, t, color, strength = 1, spread = 1 }) => {
  const rows = 26;
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id={`gl-col-${Math.round(x)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.55 * strength} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`M${x - 26 * spread},${horizon} L${x + 26 * spread},${horizon} L${x + 260 * spread},${bottom} L${x - 260 * spread},${bottom} Z`} fill={`url(#gl-col-${Math.round(x)})`} opacity={0.35} filter="url(#dl-blur-m)" />
      {Array.from({ length: rows }, (_, i) => {
        const k = (i + 0.5) / rows, y = horizon + Math.pow(k, 1.6) * (bottom - horizon);
        const halfW = (14 + 240 * k) * spread;
        return Array.from({ length: 3 }, (_, j) => {
          const s = hash(i * 7 + j * 13), ph = Math.sin(t * (2.2 + s * 2) + i * 1.7 + j * 2.3);
          if (ph < 0.15) return null;
          const cx = x + (s - 0.5) * 2 * halfW * 0.8, w = (10 + 70 * k) * (0.4 + s) * spread;
          return <rect key={`${i}-${j}`} x={cx - w / 2} y={y} width={w} height={1.2 + 3.2 * k} rx={1.5} fill={color} opacity={(0.25 + 0.6 * (1 - k)) * ph * strength} />;
        });
      })}
    </g>
  );
};

/** Lớp thị sai: depth < 1 = xa hơn chủ thể (trượt chậm), > 1 = gần máy quay (trượt nhanh) */
export const Parallax: React.FC<{ depth: number; children: React.ReactNode }> = ({ depth, children }) => {
  const cam = useContext(CamCtx);
  const cx = cam.x + cam.w / 2, cy = cam.y + cam.h / 2;
  const k = 1 - depth; // xa: kéo theo máy quay một phần
  return <g transform={`translate(${f1((cx - 960) * k)} ${f1((cy - 540) * k * 0.5)})`}>{children}</g>;
};

/** Mặt trời / trăng: đĩa + quầng loá */
export const SunDisc: React.FC<{ light: Light; r?: number; core?: string; glow?: number }> = ({ light, r = 60, core, glow = 1 }) => (
  <g>
    <circle cx={light.x} cy={light.y} r={r * 6} fill={light.color} opacity={0.1 * glow} filter="url(#dl-blur-l)" />
    <circle cx={light.x} cy={light.y} r={r * 2.6} fill={light.color} opacity={0.22 * glow} filter="url(#dl-blur-m)" />
    <circle cx={light.x} cy={light.y} r={r} fill={core ?? light.color} />
  </g>
);

/** Bộ lọc nhoè dùng chung (đặt một lần trong <svg>) */
export const DepthDefs = () => (
  <defs>
    <filter id="dl-blur-s" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
    <filter id="dl-blur-m" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" /></filter>
    <filter id="dl-blur-l" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60" /></filter>
  </defs>
);

/** Lau sậy tiền cảnh — bóng tối, nhoè nhẹ, đung đưa */
export const Reeds: React.FC<{ x: number; y: number; w: number; t: number; color?: string; tall?: number; rim?: string }> = ({ x, y, w, t, color = "#0a0f14", tall = 220, rim }) => (
  <g filter="url(#dl-blur-s)">
    {Array.from({ length: Math.round(w / 14) }, (_, i) => {
      const bx = x + i * 14 + hash(i) * 8, h = tall * (0.55 + 0.6 * hash(i * 3)), sw = Math.sin(t * 1.3 + i * 0.7) * 10 * (h / tall);
      const d = `M${f1(bx)},${y} Q${f1(bx + sw * 0.4)},${f1(y - h * 0.5)} ${f1(bx + sw)},${f1(y - h)}`;
      return (
        <g key={i}>
          <path d={d} stroke={color} strokeWidth={4 + 3 * hash(i * 5)} fill="none" strokeLinecap="round" />
          {rim && <path d={d} stroke={rim} strokeWidth={1.4} fill="none" opacity={0.5} transform="translate(2 -1)" />}
          {hash(i * 9) > 0.6 && <ellipse cx={bx + sw} cy={y - h - 10} rx={5} ry={16} fill={color} transform={`rotate(${f1(sw * 1.5)} ${f1(bx + sw)} ${f1(y - h - 10)})`} />}
        </g>
      );
    })}
    <rect x={x - 20} y={y - 6} width={w + 40} height={400} fill={color} />
  </g>
);

/** Cành cây rủ từ mép trên khung (tiền cảnh) */
export const Branch: React.FC<{ x: number; y: number; t: number; flip?: boolean; color?: string; scale?: number }> = ({ x, y, t, flip, color = "#070b10", scale = 1 }) => {
  const sw = Math.sin(t * 0.9) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} filter="url(#dl-blur-s)">
      <path d={`M-40,-20 C 120,10 260,40 420,${120 + sw}`} stroke={color} strokeWidth={18} fill="none" strokeLinecap="round" />
      {Array.from({ length: 14 }, (_, i) => {
        const u = i / 13, px = -20 + 440 * u, py = 10 + 110 * u * u + sw * u;
        return <ellipse key={i} cx={px} cy={py + 26 + 10 * hash(i)} rx={34 + 12 * hash(i * 3)} ry={13} fill={color} transform={`rotate(${f1(30 + 40 * hash(i * 5))} ${f1(px)} ${f1(py + 26)})`} />;
      })}
    </g>
  );
};

/** Cọc bến gỗ tiền cảnh */
export const Posts: React.FC<{ x: number; y: number; n?: number; gap?: number; color?: string; rim?: string }> = ({ x, y, n = 2, gap = 130, color = "#0b0d10", rim }) => (
  <g filter="url(#dl-blur-s)">
    {Array.from({ length: n }, (_, i) => (
      <g key={i}>
        <rect x={x + i * gap} y={y - 260 - i * 30} width={46} height={600} rx={8} fill={color} />
        {rim && <rect x={x + i * gap + 40} y={y - 255 - i * 30} width={4} height={590} fill={rim} opacity={0.45} />}
      </g>
    ))}
    <path d={`M${x + 20},${y - 200} Q${x + gap / 2 + 20},${y - 120} ${x + gap + 20},${y - 225}`} stroke={color} strokeWidth={7} fill="none" />
  </g>
);

/** Cột đèn đường phố tiền cảnh — silhouette tối, nhoè nhẹ ngoài vùng nét */
export const StreetLamp: React.FC<{ x: number; y: number; scale?: number; color?: string; rim?: string; glow?: boolean }> = ({ x, y, scale = 1, color = "#0d131a", rim, glow = false }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} filter="url(#dl-blur-s)">
    <rect x="-14" y="0" width="28" height="650" rx="4" fill={color} />
    {rim && <rect x="10" y="0" width="3" height="650" fill={rim} opacity={0.4} />}
    <path d="M-28,650 L28,650 L20,550 L-20,550 Z" fill={color} />
    <path d="M-36,-40 L36,-40 L26,40 L-26,40 Z" fill={color} />
    <path d="M-22,-40 L22,-40 L16,-70 L-16,-70 Z" fill={color} />
    {glow && <circle cx="0" cy="0" r="28" fill="#ffd9a0" opacity={0.65} filter="url(#dl-blur-m)" />}
    <ellipse cx="0" cy="0" rx="14" ry="24" fill={glow ? "#fff2d6" : "#2a3440"} opacity={glow ? 0.9 : 0.4} />
  </g>
);

/** Lan can cầu đá / lan can sắt tiền cảnh */
export const BridgeRailing: React.FC<{ x: number; y: number; w?: number; color?: string; rim?: string }> = ({ x, y, w = 1920, color = "#0a1016", rim }) => (
  <g filter="url(#dl-blur-s)">
    <rect x={x - 40} y={y} width={w + 80} height={28} rx={6} fill={color} />
    {rim && <rect x={x - 40} y={y} width={w + 80} height={3} fill={rim} opacity={0.5} />}
    <rect x={x - 40} y={y + 110} width={w + 80} height={18} rx={4} fill={color} />
    {Array.from({ length: Math.round(w / 110) + 2 }, (_, i) => {
      const px = x + i * 110;
      return (
        <g key={i}>
          <rect x={px - 8} y={y + 24} width={16} height={90} rx={3} fill={color} />
          {i % 3 === 0 && <rect x={px - 14} y={y - 8} width={28} height={140} rx={4} fill={color} />}
        </g>
      );
    })}
    <rect x={x - 40} y={y + 125} width={w + 80} height={400} fill={color} />
  </g>
);

/** Khung cửa sổ / vách phòng tiền cảnh (góc nhìn ấm cúng từ trong phòng nhìn ra) */
export const WindowFrame: React.FC<{ color?: string }> = ({ color = "#100b08" }) => (
  <g filter="url(#dl-blur-s)">
    <rect x="0" y="0" width="180" height="1080" fill={color} />
    <rect x="1740" y="0" width="180" height="1080" fill={color} />
    <rect x="0" y="0" width="1920" height="140" fill={color} />
    <rect x="0" y="940" width="1920" height="140" fill={color} />
  </g>
);

/** Mỏm đá đen ven bờ thác ghềnh tiền cảnh (nhoè nhẹ, sẫm tối) */
export const StormRocks: React.FC<{ x: number; y: number; scale?: number; color?: string; flip?: boolean }> = ({ x, y, scale = 1, color = "#080c10", flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} filter="url(#dl-blur-s)">
    <path d="M-120,400 L-80,120 Q-40,40 20,70 Q80,100 140,20 L220,180 Q280,260 360,400 Z" fill={color} />
  </g>
);

/** Vệt mưa xiên tiền cảnh cho cảnh giông bão */
export const RainStreaks: React.FC<{ t: number; count?: number; color?: string }> = ({ t, count = 35, color = "rgba(180,220,240,0.35)" }) => (
  <g filter="url(#dl-blur-s)">
    {Array.from({ length: count }, (_, i) => {
      const s = hash(i * 19 + 7);
      const px = (((s * 2400 - t * 1400) % 2200) + 2200) % 2200 - 100;
      const py = (((i * 37 + t * 2200) % 1200) + 1200) % 1200 - 100;
      return (
        <line
          key={i}
          x1={px}
          y1={py}
          x2={px - 35}
          y2={py + 110}
          stroke={color}
          strokeWidth={2 + s * 2.5}
          strokeLinecap="round"
        />
      );
    })}
  </g>
);

