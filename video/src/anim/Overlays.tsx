// Hai cảnh phủ toàn khung: vòng gỗ (Bridge) và cận chồi non (Final Chorus)
import React from "react";
import { AbsoluteFill } from "remotion";
import { World as WorldState, css, rng, skyColors } from "./params";

const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);

// ---- Cảnh vòng gỗ (Bridge): mỗi vòng sẫm là một mùa giông
export const Rings: React.FC<{ w: WorldState; t: number }> = ({ w, t }) => {
  const N = 30;
  const scars = new Set([5, 10, 16, 21, 26]);
  const shown = w.ringsGrow * N;
  return (
    <AbsoluteFill style={{ opacity: w.rings }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="wood" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#6b4a31" />
            <stop offset="70%" stopColor="#3d2a1c" />
            <stop offset="100%" stopColor="#140d09" />
          </radialGradient>
          <radialGradient id="warm" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(217,98,43,0.35)" />
            <stop offset="100%" stopColor="rgba(217,98,43,0)" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="#0e0907" />
        <g transform={`translate(960 540) scale(${1.05 + w.ringsGrow * 0.35}) rotate(${t * 0.6})`}>
          <circle r={14 + N * 15 + 20} fill="url(#wood)" />
          {Array.from({ length: N }, (_, i) => {
            const vis = clamp(shown - i);
            if (vis <= 0) return null;
            const rr = 14 + i * 15;
            const d = Array.from({ length: 73 }, (_, k) => {
              const a = (k / 72) * Math.PI * 2;
              const q = rr * (1 + 0.025 * Math.sin(3 * a + i) + 0.018 * Math.sin(7 * a + i * 1.7));
              return `${k ? "L" : "M"}${(Math.cos(a) * q).toFixed(1)},${(Math.sin(a) * q).toFixed(1)}`;
            }).join(" ");
            const scar = scars.has(i);
            return <path key={i} d={d} fill="none" stroke={scar ? "#1f140e" : "#a07a56"} strokeWidth={scar ? 5 : 1.6} opacity={vis * (scar ? 0.95 : 0.55)} />;
          })}
          <circle r="6" fill="#2a1a10" />
        </g>
        <rect width="1920" height="1080" fill="url(#warm)" />
      </svg>
    </AbsoluteFill>
  );
};

// ---- Cảnh cận chồi non (Final Chorus)
export const Bud: React.FC<{ w: WorldState; t: number }> = ({ w, t }) => {
  const g = w.budGrow;
  const [top, mid, hor] = skyColors(3.3);
  const open = clamp((g - 0.35) / 0.65);
  const r = rng(11);
  const bokeh = Array.from({ length: 18 }, () => ({ x: r() * 1920, y: r() * 1080, rr: 20 + r() * 70, a: 0.05 + r() * 0.12 }));
  return (
    <AbsoluteFill style={{ opacity: w.bud }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="budsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={css(top)} />
            <stop offset="55%" stopColor={css(mid)} />
            <stop offset="100%" stopColor={css(hor)} />
          </linearGradient>
          <radialGradient id="sunb" cx="72%" cy="62%" r="45%">
            <stop offset="0%" stopColor="rgba(255,196,130,0.8)" />
            <stop offset="100%" stopColor="rgba(255,196,130,0)" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#budsky)" />
        <rect width="1920" height="1080" fill="url(#sunb)" />
        {bokeh.map((b, i) => (
          <circle key={i} cx={b.x + Math.sin(t * 0.3 + i) * 12} cy={b.y} r={b.rr} fill={`rgba(255,210,160,${b.a})`} />
        ))}
        <g transform={`translate(${-30 * g} ${10 * g}) scale(${1 + 0.06 * g})`}>
          {/* Cành chéo, viền sáng ngược nắng */}
          <path d="M-60,1000 C300,860 700,700 1180,560 L1250,540" stroke="#140f0d" strokeWidth="46" fill="none" strokeLinecap="round" />
          <path d="M-60,975 C300,835 700,676 1180,537" stroke="rgba(255,170,100,0.55)" strokeWidth="4" fill="none" />
          <path d="M760,690 C800,640 830,600 880,575" stroke="#140f0d" strokeWidth="16" fill="none" strokeLinecap="round" />
          {/* Giọt nước còn đọng sau mưa */}
          <ellipse cx="560" cy={795 + Math.sin(t * 1.5) * 2} rx="9" ry="12" fill="rgba(255,230,200,0.55)" />
          {/* Chồi: búp nhú rồi hai lá non tách ra */}
          <g transform={`translate(1252 538) scale(${0.5 + g * 1.6})`}>
            <path d={`M0,0 C-20,-30 -18,-70 0,-95 C18,-70 20,-30 0,0`} fill="#5d7f3a" transform={`rotate(${-18 - open * 38})`} />
            <path d={`M0,0 C-20,-30 -18,-70 0,-95 C18,-70 20,-30 0,0`} fill="#6f9446" transform={`rotate(${18 + open * 38})`} />
            <path d={`M0,0 C-10,-20 -9,-48 0,-62 C9,-48 10,-20 0,0`} fill="#86a957" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

