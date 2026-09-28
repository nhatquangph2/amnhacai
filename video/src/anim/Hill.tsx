// Cảnh đồi: cây (cùng thuật toán ảnh bìa), trời nhiều lớp, đồi xa trong sương, mưa 2 lớp, chớp,
// lá rụng theo chùm, lòng đất & rễ. Có thể đặt nhân vật lên sườn đồi.
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Song } from "../types";
import { Figure, PoseName } from "./Figure";
import { AnimKey, World, css, mix, rgb, skyColors, worldAt } from "./params";
import { CX, DEEP_STONE, Seg, TOP, W, WORLD_BOTTOM, buildScenery, hillY } from "./scenery";
import { boltPath, flashAt, useStorm } from "./storm";

export const SC = buildScenery(23); // cùng seed với ảnh bìa (make_cover.py --seed 23)
const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);

const INK = rgb("#100f0f");
const FROST = rgb("#a3aebb");
const ROOT = rgb("#4e3e32");
const EMBER = rgb("#D9622B");
const LEAF_TONES = [rgb("#121a13"), rgb("#1f2c1d"), rgb("#31442a")];

export type HillFigure = { pose: PoseName; x: number; H: number; flip?: boolean };

// Cành thuôn & cong: tứ giác bo từ bề rộng gốc w tới bề rộng ngọn w2
const branchPath = (s: Seg) => {
  const dx = s.x2 - s.x1;
  const dy = s.y2 - s.y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const mx = (s.x1 + s.x2) / 2 + nx * s.bend;
  const my = (s.y1 + s.y2) / 2 + ny * s.bend;
  const a = s.w / 2;
  const b = s.w2 / 2;
  const m = (a + b) / 2;
  const f = (v: number) => v.toFixed(1);
  return `M${f(s.x1 + nx * a)},${f(s.y1 + ny * a)} Q${f(mx + nx * m)},${f(my + ny * m)} ${f(s.x2 + nx * b)},${f(s.y2 + ny * b)} L${f(s.x2 - nx * b)},${f(s.y2 - ny * b)} Q${f(mx - nx * m)},${f(my - ny * m)} ${f(s.x1 - nx * a)},${f(s.y1 - ny * a)} Z`;
};
const PATHS = new Map<Seg, string>();
const pathOf = (s: Seg) => {
  let p = PATHS.get(s);
  if (!p) PATHS.set(s, (p = branchPath(s)));
  return p;
};

const Branch: React.FC<{ s: Seg; t: number; w: World; color: string; leafCols: string[]; hidden: Set<number> }> = ({ s, t, w, color, leafCols, hidden }) => {
  const gust = 0.55 * Math.sin(2 * Math.PI * 0.33 * t + s.phase) + 0.45 * Math.sin(1.1 * t) * Math.sin(0.43 * t + 1);
  const amp = (0.12 + w.wind) * (0.5 + s.level * 0.85);
  const deg = amp * gust + w.wind * (s.level + 1) * 0.9;
  return (
    <g transform={`rotate(${deg.toFixed(3)} ${s.x1.toFixed(1)} ${s.y1.toFixed(1)})`}>
      <path d={pathOf(s)} fill={color} />
      {s.children.map((c, i) => (
        <Branch key={i} s={c} t={t} w={w} color={color} leafCols={leafCols} hidden={hidden} />
      ))}
      {s.leaves.map((l) =>
        w.leaves > l.th && !hidden.has(l.id) ? (
          <ellipse key={l.id} cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} transform={`rotate(${l.rot} ${l.x} ${l.y})`} fill={leafCols[l.tone]} />
        ) : null,
      )}
      {s.tip && w.sprouts > 0 && s.level % 2 === 0 && (
        // Chồi non: hai lá nhỏ tách ra ở đầu cành
        <g opacity={clamp(w.sprouts * 1.5)} transform={`translate(${s.x2} ${s.y2}) scale(${0.3 + 0.7 * w.sprouts})`}>
          <ellipse cx="-3" cy="-3" rx="5" ry="2.2" transform="rotate(-40 -3 -3)" fill="#6f8f45" />
          <ellipse cx="3" cy="-3.5" rx="5" ry="2.2" transform="rotate(35 3 -3.5)" fill="#8fb05a" />
        </g>
      )}
    </g>
  );
};

const Root: React.FC<{ s: Seg; t: number; w: World }> = ({ s, t, w }) => {
  const frac = clamp(w.roots * 8 - s.level);
  if (frac <= 0) return null;
  const x2 = s.x1 + (s.x2 - s.x1) * frac;
  const y2 = s.y1 + (s.y2 - s.y1) * frac;
  const pulse = 0.7 + 0.3 * Math.sin(t * 2.2 - s.level * 0.9);
  const col = css(mix(ROOT, EMBER, w.glow * 0.65 * pulse));
  const mx = (s.x1 + x2) / 2 + (s.bend * 0.6 * (y2 - s.y1)) / (Math.hypot(s.x2 - s.x1, s.y2 - s.y1) || 1);
  const my = (s.y1 + y2) / 2;
  const d = `M${s.x1.toFixed(1)},${s.y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  return (
    <>
      {w.glow > 0 && <path d={d} stroke={css(EMBER, 0.16 * w.glow * pulse)} strokeWidth={s.w * 3.4 + 5} strokeLinecap="round" fill="none" />}
      <path d={d} stroke={col} strokeWidth={Math.max(1, s.w)} strokeLinecap="round" fill="none" />
      {frac >= 1 && s.children.map((c, i) => <Root key={i} s={c} t={t} w={w} />)}
    </>
  );
};

const arc = (cx: number, cy: number, rr: number, a0: number, a1: number) =>
  Array.from({ length: 25 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / 24;
    return `${i ? "L" : "M"}${(cx + Math.cos(a) * rr * 1.15).toFixed(1)},${(cy + Math.sin(a) * rr * 0.85).toFixed(1)}`;
  }).join(" ");

const ridgePath = (pts: number[][], bottom: number) => `M${pts.map((p) => p.join(",")).join(" L")} L${W + 200},${bottom} L-200,${bottom} Z`;

export const HillScene: React.FC<{ song: Song; keys: AnimKey[]; t: number; vertical: boolean; figure?: HillFigure; figureX?: number }> = ({
  song,
  keys,
  t,
  vertical,
  figure,
  figureX,
}) => {
  const w = worldAt(keys, t);
  const { detach, bolts } = useStorm(song, keys, SC.leaves);
  const { flash: rawFlash, bolt } = flashAt(bolts, t);
  const flash = rawFlash * w.lightning;
  const [skyTop, skyMid, skyHor] = skyColors(w.sky);
  const under = clamp(w.cam);
  const off = w.cam <= 1 ? w.cam * 620 : 620 + (w.cam - 1) * 1000;
  const cam = `translate(${CX} 540) scale(${w.zoom}) translate(${-CX} ${-540 - off})`;

  // Ánh sáng: nắng + chớp làm sáng viền lá/thân
  const light = clamp(w.sun * 0.8 + flash);
  const lightCol = flash > w.sun ? rgb("#dfe6ff") : mix(skyHor, rgb("#ffb070"), 0.4);
  const branchColor = css(mix(INK, FROST, w.frost * 0.55));
  const leafCols = LEAF_TONES.map((c, i) => css(mix(mix(c, FROST, w.frost * 0.3), lightCol, light * 0.12 * i)));
  const hazeCol = mix(skyHor, skyMid, 0.35);

  const hidden = new Set<number>();
  const flying: { l: (typeof SC.leaves)[number]; dt: number; wind: number }[] = [];
  for (const l of SC.leaves) {
    const d = detach.get(l.id);
    if (d && t >= d.t) {
      hidden.add(l.id);
      if (t - d.t < 6) flying.push({ l, dt: t - d.t, wind: d.wind });
    }
  }

  const slant = 0.2 + w.wind * 0.55;
  const rainShown = Math.round(SC.drops.length * w.rain * (1 - under));
  const nFlakes = Math.round(SC.flakes.length * w.snow * (1 - under));
  const soilPath = `M-200,${hillY(-200)} ${Array.from({ length: 59 }, (_, i) => `L${-200 + i * 40},${hillY(-200 + i * 40).toFixed(1)}`).join(" ")} L${W + 200},${WORLD_BOTTOM} L-200,${WORLD_BOTTOM} Z`;
  const bp = bolt ? boltPath(bolt.x, bolt.seed, TOP - 60) : null;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg viewBox={vertical ? "656 0 607 1080" : "0 0 1920 1080"} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="h-sky" x1="0" y1="-400" x2="0" y2={TOP + 80} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={css(mix(skyTop, rgb("#8894b8"), flash * 0.5))} />
            <stop offset="55%" stopColor={css(mix(skyMid, rgb("#aab4d4"), flash * 0.45))} />
            <stop offset="100%" stopColor={css(mix(skyHor, rgb("#c8d0e8"), flash * 0.35))} />
          </linearGradient>
          <radialGradient id="h-sun" cx={CX + 250} cy={TOP - 10} r="620" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,190,120,1)" />
            <stop offset="12%" stopColor="rgba(255,150,80,0.8)" />
            <stop offset="40%" stopColor="rgba(217,98,43,0.35)" />
            <stop offset="100%" stopColor="rgba(217,98,43,0)" />
          </radialGradient>
          <radialGradient id="h-cloud">
            <stop offset="0%" stopColor={css(mix(rgb("#0e0f14"), skyMid, 0.25), 0.9)} />
            <stop offset="60%" stopColor={css(mix(rgb("#0e0f14"), skyMid, 0.35), 0.45)} />
            <stop offset="100%" stopColor="rgba(14,15,20,0)" />
          </radialGradient>
          <linearGradient id="h-mist" x1="0" y1={TOP - 160} x2="0" y2={TOP + 120} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={css(hazeCol, 0)} />
            <stop offset="55%" stopColor={css(hazeCol, 0.55)} />
            <stop offset="100%" stopColor={css(hazeCol, 0)} />
          </linearGradient>
          <linearGradient id="h-soil" x1="0" y1={TOP} x2="0" y2={WORLD_BOTTOM} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={css(mix(rgb("#171515"), FROST, w.frost * 0.3))} />
            <stop offset="6%" stopColor="#1b1512" />
            <stop offset="100%" stopColor="#0b0907" />
          </linearGradient>
          <radialGradient id="h-stone" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#6a6a6e" />
            <stop offset="100%" stopColor="#2a2a2d" />
          </radialGradient>
          <linearGradient id="h-trunk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={css(mix(mix(INK, FROST, w.frost * 0.55), lightCol, light * 0.35))} />
            <stop offset="28%" stopColor={branchColor} />
            <stop offset="100%" stopColor={css(mix(INK, rgb("#000000"), 0.4))} />
          </linearGradient>
        </defs>

        <g transform={cam}>
          {/* Trời & mặt trời & tia nắng */}
          <rect x={-800} y={-1400} width={W + 1600} height={TOP + 1560} fill="url(#h-sky)" />
          {w.sun > 0 && (
            <>
              <circle cx={CX + 250} cy={TOP - 10} r="620" fill="url(#h-sun)" opacity={w.sun} />
              {Array.from({ length: 9 }, (_, i) => {
                const a = -Math.PI * 0.95 + i * 0.12 + Math.sin(t * 0.1 + i) * 0.01;
                const x2 = CX + 250 + Math.cos(a) * 1600;
                const y2 = TOP - 10 + Math.sin(a) * 1600;
                const a2 = a + 0.035;
                return (
                  <polygon
                    key={i}
                    points={`${CX + 250},${TOP - 10} ${x2},${y2} ${CX + 250 + Math.cos(a2) * 1600},${TOP - 10 + Math.sin(a2) * 1600}`}
                    fill={`rgba(255,190,130,${(0.05 + 0.03 * Math.sin(t * 0.7 + i * 1.7)) * w.sun * (1 - w.clouds * 0.6)})`}
                  />
                );
              })}
            </>
          )}
          {SC.clouds.map((c, i) => {
            const x = ((c.x + t * (8 + w.wind * 70) * c.sp + 700) % (W + 1400)) - 700;
            return <ellipse key={i} cx={x} cy={c.y} rx={c.w / 2} ry={c.h / 2} fill="url(#h-cloud)" opacity={w.clouds} />;
          })}
          {bp && (
            <g opacity={flash} stroke="rgba(238,242,255,0.95)" fill="none" strokeLinejoin="round">
              <path d={bp.main} strokeWidth="9" stroke="rgba(180,200,255,0.25)" />
              <path d={bp.main} strokeWidth="3" />
              {bp.forks.map((f, i) => (
                <path key={i} d={f} strokeWidth="1.6" />
              ))}
            </g>
          )}

          {/* Đồi xa trong sương */}
          <path d={ridgePath(SC.farHills[0], TOP + 300)} fill={css(mix(hazeCol, INK, 0.55))} />
          <path d={ridgePath(SC.farHills[1], TOP + 300)} fill={css(mix(hazeCol, INK, 0.78))} />
          <rect x={-800} y={TOP - 160} width={W + 1600} height={280} fill="url(#h-mist)" opacity={0.35 + 0.35 * w.frost + 0.2 * w.rain} />

          {/* Lòng đất */}
          <path d={soilPath} fill="url(#h-soil)" />
          {SC.strata.map((pts, i) => (
            <polyline key={i} points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#2a211b" strokeWidth="2" opacity="0.5" />
          ))}
          {SC.pebbles.map((p, i) => (
            <ellipse key={i} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} transform={`rotate(${p.rot} ${p.x} ${p.y})`} fill={`rgba(120,110,100,${p.shade})`} />
          ))}
          <polygon points={SC.stonePoly.map((p) => p.join(",")).join(" ")} fill="url(#h-stone)" />
          <g opacity={0.25 + 0.75 * under}>
            {SC.roots.map((s, i) => (
              <Root key={i} s={s} t={t} w={w} />
            ))}
          </g>
          {SC.wraps.map((a, i) => {
            const f = clamp((w.roots - 0.8) / 0.2);
            if (f <= 0) return null;
            const pulse = 0.7 + 0.3 * Math.sin(t * 2.2 - 6);
            return (
              <path key={i} d={arc(DEEP_STONE.x, DEEP_STONE.y, a.rr, a.a0, a.a0 + (a.a1 - a.a0) * f)} stroke={css(mix(ROOT, EMBER, w.glow * 0.65 * pulse))} strokeWidth={a.w} fill="none" strokeLinecap="round" />
            );
          })}

          {/* Mặt đất: đá, cành gãy, thân, tán */}
          <ellipse cx={CX + 58} cy={TOP + 4} rx="26" ry="14" fill="#2c2c2f" />
          <ellipse cx={CX + 52} cy={TOP} rx="18" ry="7" fill={css(mix(rgb("#3d3d41"), lightCol, light * 0.3))} />
          {SC.debris.map((d, i) => (
            <line key={i} x1={d.x} y1={d.y} x2={d.x2} y2={d.y2} stroke={branchColor} strokeWidth="6" strokeLinecap="round" />
          ))}
          <path
            d={(() => {
              const h = TOP - SC.trunkTop;
              return `M${CX - 36},${TOP + 14} C${CX - 22},${TOP - h * 0.35} ${CX - 12},${TOP - h * 0.7} ${CX - 3},${SC.trunkTop} L${CX + 7},${SC.trunkTop} C${CX + 14},${TOP - h * 0.7} ${CX + 26},${TOP - h * 0.35} ${CX + 38},${TOP + 14} Z`;
            })()}
            fill="url(#h-trunk)"
          />
          {/* vân vỏ cây */}
          {[-16, -5, 7, 18].map((dx, i) => (
            <path key={i} d={`M${CX + dx},${TOP + 5} C${CX + dx * 0.7},${TOP - 70} ${CX + dx * 0.45},${TOP - 130} ${CX + dx * 0.2},${SC.trunkTop + 20}`} stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" fill="none" />
          ))}
          {SC.limbs.map((s, i) => (
            <Branch key={i} s={s} t={t} w={w} color={branchColor} leafCols={leafCols} hidden={hidden} />
          ))}

          {/* Cỏ cong theo gió */}
          {SC.grass.map((g, i) => {
            const sway = g.lean + w.wind * 0.9 * (0.6 + 0.4 * Math.sin(t * 3 + g.phase)) + 0.1 * Math.sin(t + g.phase);
            const tx = g.x + sway * g.h;
            const ty = g.y - g.h * (1 - Math.abs(sway) * 0.15);
            const col = css(mix(mix(rgb("#0f0f0e"), rgb("#262a1f"), g.shade * 0.6), FROST, w.frost * 0.6));
            return <path key={i} d={`M${g.x - 1.5},${g.y} Q${g.x + sway * g.h * 0.3},${g.y - g.h * 0.6} ${tx},${ty} Q${g.x + sway * g.h * 0.3 + 1},${g.y - g.h * 0.55} ${g.x + 1.5},${g.y} Z`} fill={col} />;
          })}

          {figure && (
            <Figure
              pose={figure.pose}
              t={t}
              x={figureX ?? figure.x}
              y={hillY(figureX ?? figure.x) + (figure.pose === "sitLean" ? -figure.H * 0.02 : 2)}
              H={figure.H}
              flip={figure.flip}
              wind={w.wind}
              color="#0b0a0a"
              rim={css(lightCol, 0.25 + light * 0.6)}
              rimDir={[1, -1]}
            />
          )}

          {/* Lá đang bay */}
          {flying.map(({ l, dt, wind }) => {
            const x = l.x + dt * (140 + 320 * wind) + 30 * Math.sin(dt * 3 + l.id);
            const y = l.y + dt * 50 + dt * dt * 7 + 22 * Math.sin(dt * 2.1 + l.id);
            return (
              <ellipse
                key={l.id}
                cx={x}
                cy={y}
                rx={l.rx * 0.8}
                ry={l.ry * (0.35 + 0.65 * Math.abs(Math.sin(dt * 4 + l.id)))}
                transform={`rotate(${l.rot + dt * (180 + (l.id % 5) * 60)} ${x} ${y})`}
                fill={leafCols[Math.min(l.tone + 1, 2)]}
                opacity={clamp(1 - dt / 5.5)}
              />
            );
          })}

          {/* Mưa bắn tóe trên đất */}
          {w.rain > 0.3 &&
            SC.splashes.slice(0, Math.round(SC.splashes.length * w.rain)).map((s, i) => {
              const cyc = (t * 2.2 * s.sp + s.ph) % 1;
              const y = hillY(s.x);
              return <ellipse key={i} cx={s.x} cy={y - 1} rx={2 + cyc * 9} ry={1 + cyc * 2.5} fill="none" stroke={`rgba(200,210,225,${0.35 * (1 - cyc)})`} strokeWidth="1" />;
            })}
        </g>

        {/* Mưa 2 lớp & tuyết (không gian màn hình) */}
        {SC.drops.slice(0, rainShown).map((d, i) => {
          const y = ((d.y + t * 1300 * d.sp) % 1160) - 40;
          const x = ((d.x + t * 1300 * d.sp * slant) % (W + 400)) - 200;
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x - d.len * slant}
              y2={y - d.len}
              stroke={d.near ? `rgba(215,222,235,${0.4 + flash * 0.4})` : `rgba(190,200,215,${0.22 + flash * 0.3})`}
              strokeWidth={d.near ? 2 : 1}
            />
          );
        })}
        {SC.flakes.slice(0, nFlakes).map((f, i) => {
          const y = ((f.y + t * 60 * f.sp) % 1100) - 10;
          const x = (f.x + Math.sin(t * 0.8 + f.ph) * 25 + t * w.wind * 40 + W) % W;
          return <circle key={i} cx={x} cy={y} r={f.r} fill="rgba(235,240,245,0.75)" />;
        })}
      </svg>
      {flash > 0 && <AbsoluteFill style={{ background: "#dfe6ff", opacity: 0.18 * flash * (1 - under), mixBlendMode: "screen" }} />}
    </AbsoluteFill>
  );
};
