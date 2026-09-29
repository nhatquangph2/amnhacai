// Các cảnh có nhân vật (tuyến "người" song song với tuyến "cây"):
// phòng tối mưa, phố mưa đêm, bàn viết mùa đông, cận trang sổ lời bài hát.
// Mỗi cảnh nhận t (giây trong bài), p (0→1 tiến độ của cảnh) và trạng thái thế giới w (mưa, gió, chớp…).
import React from "react";
import { AbsoluteFill } from "remotion";
import { KaraokeText, SERIF, lineAt } from "../common";
import type { Shot, Song } from "../types";
import { Figure } from "./Figure";
import { SC } from "./Hill";
import { AnimKey, World, css, mix, rgb, rng, skyColors } from "./params";
import type { Seg } from "./scenery";

const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
export type SceneProps = { t: number; p: number; w: World; flash: number; vertical: boolean; song: Song; keys: AnimKey[]; shot?: Shot };
const VB = (vertical: boolean, cx = 960) => (vertical ? `${cx - 303} 0 607 1080` : "0 0 1920 1080");

// ---- Cây nhỏ nhìn qua cửa sổ (cùng dáng cây trên đồi, rụng lá theo cùng thông số)
const MiniBranch: React.FC<{ s: Seg; w: World; t: number }> = ({ s, w, t }) => {
  const deg = (0.12 + w.wind) * (0.5 + s.level * 0.85) * Math.sin(2 * Math.PI * 0.33 * t + s.phase) + w.wind * (s.level + 1) * 0.9;
  return (
    <g transform={`rotate(${deg.toFixed(2)} ${s.x1} ${s.y1})`}>
      <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#07080b" strokeWidth={Math.max(1.5, s.w)} strokeLinecap="round" />
      {s.children.map((c, i) => (
        <MiniBranch key={i} s={c} w={w} t={t} />
      ))}
      {s.tip && w.leaves > 0.05 && <circle cx={s.x2} cy={s.y2} r={16 * clamp(w.leaves * 1.4)} fill="#07080b" />}
    </g>
  );
};
const MiniTree: React.FC<{ w: World; t: number }> = ({ w, t }) => (
  <g transform={w.grow < 1 ? `translate(960 780) scale(${(0.08 + 0.92 * Math.pow(Math.max(w.grow, 0), 0.8)).toFixed(3)}) translate(-960 -780)` : undefined} opacity={w.grow > 0.01 ? 1 : 0}>
    <path d={`M${960 - 36},${780} L${957},${SC.trunkTop} L${967},${SC.trunkTop} L${960 + 38},${780} Z`} fill="#07080b" />
    {SC.limbs.map((s, i) => (
      <MiniBranch key={i} s={s} w={w} t={t} />
    ))}
  </g>
);

// Mưa chảy trên kính: vệt nước trượt xuống
const glassDrops = (() => {
  const r = rng(99);
  return Array.from({ length: 70 }, () => ({ x: r(), y0: r(), sp: 0.03 + r() * 0.08, len: 0.02 + r() * 0.06, w: 1 + r() * 2.5 }));
})();

// ======================= PHÒNG TỐI =======================
export const Room: React.FC<SceneProps> = ({ t, p, w, flash, vertical }) => {
  const [skyTop, skyMid] = skyColors(w.sky);
  const win = { x: 1060, y: 150, w: 540, h: 560 };
  const z = 1 + p * 0.07;
  const lit = 0.15 + flash * 0.85;
  return (
    <AbsoluteFill style={{ background: "#07080b" }}>
      <svg viewBox={VB(vertical, 1100)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <clipPath id="r-glass">
            <rect x={win.x} y={win.y} width={win.w} height={win.h} />
          </clipPath>
          <linearGradient id="r-wall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0b0d12" />
            <stop offset="100%" stopColor="#151a24" />
          </linearGradient>
          <linearGradient id="r-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={css(mix(skyTop, rgb("#b8c2e0"), flash * 0.7))} />
            <stop offset="100%" stopColor={css(mix(skyMid, rgb("#c8d0ea"), flash * 0.6))} />
          </linearGradient>
          <linearGradient id="r-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(190,205,240,${0.12 * lit})`} />
            <stop offset="100%" stopColor="rgba(190,205,240,0)" />
          </linearGradient>
          <radialGradient id="r-spill">
            <stop offset="0%" stopColor="rgba(120,140,190,0.16)" />
            <stop offset="100%" stopColor="rgba(120,140,190,0)" />
          </radialGradient>
          <radialGradient id="r-phone" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(160,190,255,0.35)" />
            <stop offset="100%" stopColor="rgba(160,190,255,0)" />
          </radialGradient>
        </defs>
        <g transform={`translate(1100 560) scale(${z}) translate(-1100 -560)`}>
          <rect x="-100" y="-100" width="2200" height="1300" fill="url(#r-wall)" />
          {/* sàn */}
          <rect x="-100" y="790" width="2200" height="500" fill="#0b0c10" />
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={-100 + i * 260} y1="790" x2={-400 + i * 330} y2="1200" stroke="#14161c" strokeWidth="2" />
          ))}
          {/* ánh trời qua cửa sổ loang trên tường */}
          <ellipse cx={win.x + win.w / 2} cy={win.y + win.h / 2} rx={win.w * 1.1} ry={win.h * 0.9} fill="url(#r-spill)" opacity={0.5 + flash * 0.5} />
          {/* ô cửa sổ: trời bão + đồi + cây */}
          <g clipPath="url(#r-glass)">
            <rect x={win.x} y={win.y} width={win.w} height={win.h} fill="url(#r-sky)" />
            <g transform={`translate(${win.x + win.w / 2 - 960 * 0.42} ${win.y + win.h * 0.12}) scale(0.42)`}>
              <path d="M-200,900 Q960,690 2100,900 L2100,1400 L-200,1400 Z" fill="#07080b" />
              <MiniTree w={w} t={t} />
            </g>
            {/* mưa ngoài trời */}
            {Array.from({ length: Math.round(60 * w.rain) }, (_, i) => {
              const y = win.y + ((i * 97 + t * 900) % win.h);
              const x = win.x + ((i * 53 + t * 250) % win.w);
              return <line key={i} x1={x} y1={y} x2={x - 6} y2={y - 22} stroke="rgba(200,210,230,0.35)" strokeWidth="1" />;
            })}
            {/* vệt nước trên kính */}
            {glassDrops.map((d, i) => {
              const y = win.y + (((d.y0 + t * d.sp) % 1) * win.h);
              return <line key={i} x1={win.x + d.x * win.w} y1={y - d.len * win.h} x2={win.x + d.x * win.w + 2} y2={y} stroke="rgba(210,220,240,0.22)" strokeWidth={d.w} strokeLinecap="round" />;
            })}
          </g>
          {/* khung cửa */}
          <rect x={win.x - 18} y={win.y - 18} width={win.w + 36} height={win.h + 36} fill="none" stroke="#050608" strokeWidth="36" />
          <line x1={win.x + win.w / 2} y1={win.y} x2={win.x + win.w / 2} y2={win.y + win.h} stroke="#050608" strokeWidth="16" />
          <line x1={win.x} y1={win.y + win.h * 0.45} x2={win.x + win.w} y2={win.y + win.h * 0.45} stroke="#050608" strokeWidth="16" />
          {/* rèm */}
          <path
            d={`M${win.x - 60},${win.y - 60} C${win.x - 20 + Math.sin(t * 0.9) * 8},${win.y + 200} ${win.x - 70},${win.y + 420} ${win.x - 30 + Math.sin(t * 0.7) * 10},${win.y + win.h + 110} L${win.x - 170},${win.y + win.h + 110} L${win.x - 170},${win.y - 60} Z`}
            fill="#0d0f15"
          />
          {/* vệt sáng cửa sổ hắt xuống sàn (chớp làm sáng bừng) */}
          <polygon points={`${win.x},${win.y + win.h} ${win.x + win.w},${win.y + win.h} ${win.x + win.w - 300},1200 ${win.x - 520},1200`} fill="url(#r-beam)" />
          {/* giường */}
          <path d="M-100,560 L700,560 Q730,560 730,590 L730,800 L-100,800 Z" fill="#101219" />
          <path d="M-100,548 Q260,500 700,560 L700,610 Q300,585 -100,620 Z" fill="#1a1d27" />
          <rect x="-100" y="420" width="90" height="380" fill="#0d0f15" />
          {/* điện thoại sáng mờ trên sàn */}
          <ellipse cx="980" cy="815" rx="90" ry="26" fill="url(#r-phone)" opacity={0.6 + 0.4 * Math.sin(t * 0.5)} />
          <rect x="956" y="808" width="48" height="14" rx="3" fill="#1d2536" />
          {/* nhân vật ngồi ôm gối tựa giường, nhìn ra cửa sổ */}
          <Figure pose="sitKnees" t={t} x={800} y={800} H={380} color="#050507" rim={css(rgb("#aebde3"), 0.35 + flash * 0.6)} rimDir={[1.2, -0.5]} scarf="#8a4a2c" />
        </g>
      </svg>
      {flash > 0 && <AbsoluteFill style={{ background: "#cfd8ff", opacity: 0.12 * flash, mixBlendMode: "screen" }} />}
    </AbsoluteFill>
  );
};

// ======================= PHỐ MƯA ĐÊM =======================
const city = (() => {
  const r = rng(314);
  const layer = (n: number, hMin: number, hMax: number, wMin: number, wMax: number) => {
    let x = -300;
    return Array.from({ length: n }, () => {
      const bw = wMin + r() * (wMax - wMin);
      const h = hMin + r() * (hMax - hMin);
      const cols = Math.max(2, Math.floor(bw / 60));
      const rows = Math.max(3, Math.floor(h / 80));
      const wins: { fx: number; fy: number; on: boolean }[] = [];
      for (let cI = 0; cI < cols; cI++) for (let rI = 0; rI < rows; rI++) wins.push({ fx: (cI + 0.5) / cols, fy: (rI + 0.5) / rows, on: r() < 0.14 });
      const b = { x, w: bw, h, wins, roof: r() < 0.4 };
      x += bw + r() * 30;
      return b;
    });
  };
  return { far: layer(40, 250, 520, 120, 260), near: layer(26, 380, 720, 180, 340) };
})();

export const Street: React.FC<SceneProps> = ({ t, p, w, flash, vertical }) => {
  const scroll = t * 70; // máy quay đi theo nhân vật
  const road = 860;
  const lampGap = 520;
  const lamps = Array.from({ length: 6 }, (_, i) => {
    const x = ((i * lampGap - scroll) % (lampGap * 6) + lampGap * 6) % (lampGap * 6) - 300;
    return x;
  });
  const slant = 0.25 + w.wind * 0.4;
  // Tấm ảnh tuột khỏi tay ở 30% cảnh, bay theo gió
  const release = 0.3;
  const dt = Math.max(0, (p - release) * 10);
  const photo = { x: 850 + dt * 150 + Math.sin(dt * 2) * 30, y: 650 - dt * 35 + Math.sin(dt * 3.1) * 25, rot: dt * 140 };
  const papers = Array.from({ length: 7 }, (_, i) => {
    const r = rng(40 + i);
    const s = ((t * (140 + r() * 120) + r() * 2400) % 2400) - 300;
    return { x: s, y: 300 + r() * 450 + Math.sin(t * 2 + i) * 40, rot: t * (120 + r() * 200), sc: 0.6 + r() * 0.6 };
  });
  return (
    <AbsoluteFill style={{ background: "#050609" }}>
      <svg viewBox={VB(vertical, 820)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="s-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={css(mix(rgb("#07080d"), rgb("#8e98bb"), flash * 0.5))} />
            <stop offset="100%" stopColor={css(mix(rgb("#1a1d27"), rgb("#aab3d2"), flash * 0.5))} />
          </linearGradient>
          <radialGradient id="s-glow">
            <stop offset="0%" stopColor="rgba(255,196,120,0.75)" />
            <stop offset="100%" stopColor="rgba(255,170,90,0)" />
          </radialGradient>
          <linearGradient id="s-cone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,190,110,0.13)" />
            <stop offset="100%" stopColor="rgba(255,190,110,0)" />
          </linearGradient>
          <linearGradient id="s-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d0e12" />
            <stop offset="100%" stopColor="#050506" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#s-sky)" />
        {/* nhà xa & gần (thị sai) */}
        {city.far.map((b, i) => {
          const x = ((b.x - scroll * 0.25) % 3000 + 3000) % 3000 - 400;
          return <rect key={`f${i}`} x={x} y={road - b.h} width={b.w} height={b.h} fill="#141722" opacity="0.9" />;
        })}
        {city.near.map((b, i) => {
          const x = ((b.x - scroll * 0.6) % 3600 + 3600) % 3600 - 500;
          return (
            <g key={`n${i}`}>
              <rect x={x} y={road - b.h} width={b.w} height={b.h} fill="#0c0d13" />
              <rect x={x} y={road - b.h} width={b.w} height="6" fill="#1c1f2b" />
              {b.roof && <polygon points={`${x - 8},${road - b.h} ${x + b.w / 2},${road - b.h - 60} ${x + b.w + 8},${road - b.h}`} fill="#0c0d13" />}
              {b.wins.map((wn, k) => (
                <rect
                  key={k}
                  x={x + wn.fx * b.w - 11}
                  y={road - b.h + 30 + wn.fy * (b.h - 150)}
                  width="22"
                  height="30"
                  fill={wn.on ? "rgba(255,190,120,0.6)" : "rgba(40,46,62,0.55)"}
                />
              ))}
            </g>
          );
        })}
        {/* mặt đường ướt + phản chiếu đèn */}
        <rect x="0" y={road} width="1920" height={1080 - road} fill="url(#s-road)" />
        {lamps.map((x, i) => (
          <g key={i}>
            <ellipse cx={x + 60} cy={road + 90} rx="26" ry="120" fill="rgba(255,180,100,0.12)" />
            <ellipse cx={x + 60} cy={road + 60} rx="10" ry="70" fill="rgba(255,200,130,0.18)" />
          </g>
        ))}
        {/* đèn đường */}
        {lamps.map((x, i) => (
          <g key={i}>
            <polygon points={`${x + 60},${300} ${x - 110},${road} ${x + 230},${road}`} fill="url(#s-cone)" />
            <rect x={x - 4} y={290} width="9" height={road - 290} fill="#030304" />
            <path d={`M${x},${296} Q${x + 30},${270} ${x + 60},${290}`} stroke="#030304" strokeWidth="7" fill="none" />
            <circle cx={x + 60} cy={298} r="90" fill="url(#s-glow)" />
            <ellipse cx={x + 60} cy={298} rx="14" ry="7" fill="#ffe0b0" />
          </g>
        ))}
        {/* giấy tờ bay */}
        {papers.map((q, i) => (
          <rect key={i} x={q.x} y={q.y} width={34 * q.sc} height={24 * q.sc} transform={`rotate(${q.rot} ${q.x} ${q.y}) skewX(${Math.sin(q.rot / 40) * 25})`} fill="rgba(225,220,205,0.7)" />
        ))}
        {/* tấm ảnh cũ bay khỏi tay */}
        {p > release - 0.02 && (
          <g transform={`rotate(${photo.rot} ${photo.x} ${photo.y})`} opacity={clamp(1 - dt / 9)}>
            <rect x={photo.x - 26} y={photo.y - 20} width="52" height="40" fill="#e6dfd0" />
            <rect x={photo.x - 21} y={photo.y - 15} width="42" height="26" fill="#6a5a4a" />
          </g>
        )}
        {/* nhân vật đi một mình trong mưa */}
        <Figure pose="walk" t={t} x={760} y={road + 4} H={340} color="#030304" rim={`rgba(255,190,120,${0.4 + flash * 0.4})`} rimDir={[1, -1]} wind={w.wind} />
        {p <= release && <rect x={846} y={640} width="30" height="22" fill="#e6dfd0" transform="rotate(-20 846 640)" />}
        {/* vũng nước bắn tóe */}
        {Array.from({ length: 40 }, (_, i) => {
          const cyc = (t * 2.3 + i * 0.137) % 1;
          const x = (i * 211) % 1920;
          return <ellipse key={i} cx={x} cy={road + 30 + (i % 5) * 38} rx={2 + cyc * 12} ry={1 + cyc * 3} fill="none" stroke={`rgba(220,210,190,${0.3 * (1 - cyc) * w.rain})`} strokeWidth="1" />;
        })}
        {/* mưa */}
        {Array.from({ length: Math.round(260 * w.rain) }, (_, i) => {
          const r = rng(i + 1000);
          const sp = 1 + r() * 0.5;
          const len = i % 4 ? 16 + r() * 14 : 40 + r() * 30;
          const y = ((r() * 1080 + t * 1300 * sp) % 1140) - 40;
          const x = ((r() * 2300 + t * 1300 * sp * slant) % 2300) - 200;
          return <line key={i} x1={x} y1={y} x2={x - len * slant} y2={y - len} stroke={i % 4 ? "rgba(200,205,220,0.22)" : "rgba(255,220,180,0.4)"} strokeWidth={i % 4 ? 1 : 1.8} />;
        })}
      </svg>
      {flash > 0 && <AbsoluteFill style={{ background: "#cfd8ff", opacity: 0.14 * flash, mixBlendMode: "screen" }} />}
    </AbsoluteFill>
  );
};

// ======================= BÀN VIẾT MÙA ĐÔNG =======================
export const Desk: React.FC<SceneProps> = ({ t, p, w, vertical }) => {
  const z = 1.04 - p * 0.04;
  const sunlight = clamp(w.sun * 1.5); // tia nắng đầu tiên chiếu vào bàn
  return (
    <AbsoluteFill style={{ background: "#0a0806" }}>
      <svg viewBox={VB(vertical, 900)} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="d-lamp" cx="560" cy="430" r="720" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,200,130,0.55)" />
            <stop offset="45%" stopColor="rgba(217,120,60,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <linearGradient id="d-win" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3342" />
            <stop offset="100%" stopColor="#5d6878" />
          </linearGradient>
          <linearGradient id="d-sun" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,170,100,0.35)" />
            <stop offset="100%" stopColor="rgba(255,170,100,0)" />
          </linearGradient>
        </defs>
        <g transform={`translate(900 560) scale(${z}) translate(-900 -560)`}>
          <rect x="-100" y="-100" width="2200" height="1300" fill="#120e0b" />
          {/* cửa sổ mùa đông */}
          <rect x="1180" y="140" width="520" height="480" fill="url(#d-win)" />
          {Array.from({ length: 70 }, (_, i) => {
            const r = rng(i + 500);
            const y = 140 + ((r() * 480 + t * 40 * (0.6 + r())) % 480);
            const x = 1180 + ((r() * 520 + Math.sin(t + i) * 12 + 520) % 520);
            return <circle key={i} cx={x} cy={y} r={1 + r() * 2.2} fill="rgba(240,244,250,0.8)" />;
          })}
          <path d="M1180,620 Q1300,560 1440,600 Q1580,570 1700,610 L1700,620 Z" fill="rgba(235,240,248,0.5)" />
          <rect x="1162" y="122" width="556" height="516" fill="none" stroke="#070504" strokeWidth="36" />
          <line x1="1440" y1="140" x2="1440" y2="620" stroke="#070504" strokeWidth="14" />
          {/* tia nắng đầu tiên */}
          {sunlight > 0 && <polygon points="1180,160 1700,160 900,900 200,900" fill="url(#d-sun)" opacity={sunlight} />}
          <rect x="-100" y="-100" width="2200" height="1300" fill="url(#d-lamp)" />
          {/* đèn bàn */}
          <path d="M470,380 L650,380 L600,300 L520,300 Z" fill="#1a1410" />
          <line x1="560" y1="380" x2="620" y2="700" stroke="#1a1410" strokeWidth="10" />
          <ellipse cx="560" cy="384" rx="92" ry="12" fill="rgba(255,215,150,0.85)" />
          {/* mặt bàn */}
          <rect x="200" y="700" width="1300" height="40" fill="#1c140e" />
          <rect x="220" y="740" width="30" height="400" fill="#140e0a" />
          <rect x="1450" y="740" width="30" height="400" fill="#140e0a" />
          <polygon points="560,700 800,700 820,694 585,694" fill="#e8dcc6" />
          <polygon points="560,700 800,700 800,704 560,704" fill="#b9ad97" />
          {/* tách trà & hơi nóng */}
          <path d="M1060,650 L1130,650 L1122,700 L1068,700 Z" fill="#2a211a" />
          <path d="M1130,662 Q1155,672 1128,688" stroke="#2a211a" strokeWidth="7" fill="none" />
          {[0, 1, 2].map((i) => {
            const ph = t * 0.8 + i * 2.1;
            const d = `M${1085 + i * 12},640 C${1070 + i * 12 + Math.sin(ph) * 18},600 ${1105 + i * 12 + Math.sin(ph + 1) * 18},560 ${1090 + i * 12 + Math.sin(ph + 2) * 22},510`;
            return <path key={i} d={d} stroke={`rgba(255,235,210,${0.14 + 0.06 * Math.sin(ph)})`} strokeWidth="5" fill="none" strokeLinecap="round" />;
          })}
          {/* ghế + nhân vật cúi viết */}
          <rect x="300" y="770" width="170" height="16" fill="#0d0907" />
          <rect x="300" y="560" width="14" height="220" fill="#0d0907" />
          <rect x="455" y="786" width="12" height="330" fill="#0d0907" />
          <Figure pose="desk" t={t} x={390} y={770} H={420} color="#060403" rim="rgba(255,190,120,0.55)" rimDir={[1, -0.6]} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ======================= CẬN TRANG SỔ: lời được viết dần =======================
export const Notebook: React.FC<SceneProps> = ({ t, p, song, vertical }) => {
  const { line, index } = lineAt(song.lines, t);
  // Các dòng đã viết trước đó trong cùng đoạn
  const cur = index >= 0 ? song.lines[index] : null;
  const prev = cur ? song.lines.slice(Math.max(0, index - 3), index).filter((l) => l.section === cur.section && t > l.end) : [];
  const drift = p * 30;
  return (
    <AbsoluteFill style={{ background: "#0d0907" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="n-lamp" cx="30%" cy="20%" r="85%">
            <stop offset="0%" stopColor="rgba(255,210,150,0.35)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="#21170f" />
        <g transform={`translate(${-drift} ${-drift * 0.3}) rotate(-4 960 540)`}>
          {/* trang sổ */}
          <rect x="300" y="60" width="1320" height="1000" fill="#e9dfcb" />
          <line x1="960" y1="60" x2="960" y2="1060" stroke="rgba(0,0,0,0.18)" strokeWidth="6" />
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1="990" y1={200 + i * 62} x2="1590" y2={200 + i * 62} stroke="rgba(80,110,150,0.25)" strokeWidth="1.5" />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1="330" y1={200 + i * 62} x2="930" y2={200 + i * 62} stroke="rgba(80,110,150,0.25)" strokeWidth="1.5" />
          ))}
        </g>
        <rect width="1920" height="1080" fill="url(#n-lamp)" />
      </svg>
      <AbsoluteFill style={{ transform: `translate(${-drift}px, ${-drift * 0.3}px) rotate(-4deg)` }}>
        <div style={{ position: "absolute", left: vertical ? 700 : 350, top: 250, width: 1200, fontFamily: SERIF, fontStyle: "italic", color: "#1d2433" }}>
          {prev.map((l, i) => (
            <div key={i} style={{ fontSize: 46, lineHeight: "62px", opacity: 0.85 }}>
              {l.text}
            </div>
          ))}
          {line && (
            <div style={{ fontSize: 46, lineHeight: "62px" }}>
              <KaraokeText line={line} t={t} song={song} base="rgba(0,0,0,0)" fill="#1d2433" lift={0} />
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
