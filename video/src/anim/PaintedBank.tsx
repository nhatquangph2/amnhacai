// Bờ sông bằng TRANH VẼ (tạo bằng `npm run assets`) — bản nâng cấp của Riverbank, chạy được cả bài.
// Tranh nền đổi theo thời kỳ (cùng bố cục vì mỗi tranh được "sửa" từ tranh gốc), có chiều sâu 2.5D nếu song.depth
// (npm run depth); code lo ánh sáng ngày–đêm, mưa, lũ, mặt nước lấp lánh, người qua đường theo thời kỳ,
// MÙA thay cho ngày–đêm khi tua nhanh (season: 0 xuân · 1 hạ · 2 thu · 3 đông, tăng tiếp 4, 5… = năm sau):
// chỉnh màu tranh + hoa đào / lá vàng rơi / sương, mưa phùn mùa đông; đêm chỉ còn khi đặt "dark".
// sự kiện (thuyền, đám cưới, dời làng) và cô bé lớn dần: bé → thiếu nữ → mẹ dắt con → bà ngồi với cháu.
// Tranh nào chưa vẽ (không có trong song.art) thì phần đó tự bỏ qua.
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, staticFile } from "remotion";
import type { Song } from "../types";
import { AnimKey, World, integralOf } from "./params";

const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const band = (x: number, a: number, b: number, f: number) => clamp((x - a) / f + 0.5) * clamp((b - x) / f + 0.5);

// Tranh 1536×1024 phủ khung 1920×1080: phóng 1.25 → 1920×1280, dịch lên 100px
const SCALE = 1.25;
const OFFY = -100;
const P = (x: number, y: number) => [x * SCALE, y * SCALE + OFFY] as const; // toạ độ tranh → màn hình
const [STONE_X, STONE_TOP] = P(950, 640);
const [, PATH_Y] = P(0, 845); // chân người trên lối mòn
const [, RIVER_Y] = P(0, 470); // giữa lòng sông (thuyền)
const [, BANK_Y] = P(0, 690); // mép nước bờ gần

// Tranh nền theo thời kỳ (era) — hoà dần sang tranh kế trong 0.3 era cuối
const PLATES: { id: string; era: number }[] = [
  { id: "plate-wild", era: 0 },
  { id: "plate-hut", era: 1 },
  { id: "plate-village", era: 2 },
  { id: "plate-abandoned", era: 3 },
  { id: "plate-town", era: 4 },
  { id: "plate-city", era: 5 },
];

// Tranh "có chiều sâu" (npm run depth): video DepthFlow lặp 12s, phóng 1/0.96 so với tranh gốc
// → các lớp vẽ bằng code (nhân vật, nước) phóng cùng tỉ lệ quanh tâm khung (tâm tranh = tâm màn hình).
const DEPTH_LOOP = 12 * 30;
const DEPTH_ZOOM = 1 / 0.96;

const Plate: React.FC<{ song: Song; id: string; opacity?: number }> = ({ song, id, opacity = 1 }) => {
  const style = { position: "absolute" as const, left: 0, top: OFFY, width: 1536 * SCALE, opacity };
  return song.depth ? (
    <Loop durationInFrames={DEPTH_LOOP}>
      <OffthreadVideo muted src={staticFile(`${song.id}/depth/${id}.mp4`)} style={style} />
    </Loop>
  ) : (
    <Img src={staticFile(`${song.id}/art/${id}.png`)} style={style} />
  );
};

const Sprite: React.FC<{ song: Song; id: string; x: number; y: number; h: number; flip?: boolean; opacity?: number; blur?: number }> = ({ song, id, x, y, h, flip, opacity = 1, blur = 0 }) =>
  // (x, y) = điểm giữa chân; h = chiều cao hiển thị
  !song.art || song.art.includes(id) ? (
    <Img
      src={staticFile(`${song.id}/art/${id}.png`)}
      style={{
        position: "absolute",
        left: x,
        top: y - h,
        height: h,
        transform: `translateX(-50%)${flip ? " scaleX(-1)" : ""}`,
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    />
  ) : null;

// Mùa: trọng số 4 mùa (hoà tuyến tính giữa hai mùa kề nhau), hạ = tranh gốc (không chỉnh màu)
const seasonWeights = (s: number) => {
  const p = ((s % 4) + 4) % 4;
  const i = Math.floor(p);
  const f = p - i;
  const out = [0, 0, 0, 0];
  out[i] += 1 - f;
  out[(i + 1) % 4] += f;
  return out; // [xuân, hạ, thu, đông]
};
// Bộ lọc màu từng mùa: [saturate, hue-rotate°, sepia, brightness, contrast]
const GRADE = [
  [1.18, 12, 0, 1.06, 1.0], // xuân: xanh non, sáng (xoay vàng → xanh)
  [1, 0, 0, 1, 1], // hạ: tranh gốc
  [1.08, -14, 0.32, 1.0, 1.03], // thu: vàng cam
  [0.5, 8, 0.05, 0.9, 0.94], // đông: xám lạnh
];
const TINT = ["#e8f5d0", "#ffffff", "#e0913a", "#9fb2c4"]; // phủ soft-light theo mùa
const TINT_OP = [0.18, 0, 0.22, 0.3];

// Cánh hoa (xuân) / lá (thu) rơi — rơi chéo, đung đưa
const Falling: React.FC<{ t: number; n: number; colors: string[]; size: number; seed: number }> = ({ t, n, colors, size, seed }) => (
  <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: n }, (_, i) => {
      const k = i * 7.13 + seed;
      const sp = 70 + ((i * 37) % 60);
      const y = ((k * 131 + t * sp) % 1200) - 60;
      const x = ((k * 263 + t * 25 + Math.sin(t * 1.3 + i) * 40) % 2000) - 40;
      const r = t * (60 + (i % 5) * 30) + i * 40;
      return <ellipse key={i} cx={x} cy={y} rx={size * (0.7 + (i % 3) * 0.2)} ry={size * 0.45} fill={colors[i % colors.length]} opacity={0.85} transform={`rotate(${r} ${x} ${y})`} />;
    })}
  </svg>
);

type Passer = { id: string; h: number; sp: number; x0: number; dir: 1 | -1 };
// Người qua đường theo thời kỳ: làng (era ~1–3) · thị trấn / phố (era ≥ 3.8)
const VILLAGERS: Passer[] = [
  { id: "village-woman", h: 300, sp: 70, x0: 300, dir: 1 },
  { id: "village-man", h: 305, sp: 80, x0: 1500, dir: -1 },
  { id: "village-woman", h: 295, sp: 65, x0: 1100, dir: -1 },
  { id: "village-man", h: 300, sp: 85, x0: 2000, dir: 1 },
];
const TOWNSFOLK: Passer[] = [
  { id: "town-man", h: 300, sp: 90, x0: 200, dir: 1 },
  { id: "town-woman", h: 305, sp: 75, x0: 1400, dir: -1 },
  { id: "town-bike", h: 290, sp: 210, x0: 700, dir: 1 },
  { id: "town-man", h: 290, sp: 85, x0: 2100, dir: -1 },
  { id: "town-woman", h: 300, sp: 70, x0: 900, dir: 1 },
];

export const PaintedBank: React.FC<{ t: number; w: World; keys: AnimKey[]; song: Song }> = ({ t, w, keys, song }) => {
  const night = w.dark; // không còn ngày–đêm khi tua: thời gian trôi bằng mùa
  const sw = seasonWeights(w.season);
  const [spring, , autumn, winter] = sw;
  const g = GRADE[0].map((_, j) => sw.reduce((acc, wt, si) => acc + wt * GRADE[si][j], 0));
  const grade = `saturate(${g[0]}) hue-rotate(${g[1]}deg) sepia(${g[2]}) brightness(${g[3]}) contrast(${g[4]})`;
  const sceneT = t + integralOf(keys, "cycle", t) * 28;
  const ghost = 1 / (1 + w.cycle * 5);

  // Tranh nền: hoà giữa hai tranh gần nhất theo era
  let a = PLATES[0];
  for (const p of PLATES) if (p.era <= w.era) a = p;
  const b = PLATES.find((p) => p.era > w.era) ?? a;
  const mixAB = b === a ? 0 : clamp((w.era - (b.era - 0.3)) / 0.3);

  // Đám đông theo thời kỳ (hoà theo era)
  const crowds = [
    { list: VILLAGERS, vis: band(w.era, 0.9, 3.1, 0.25) },
    { list: TOWNSFOLK, vis: band(w.era, 3.8, 9, 0.2) },
  ];

  // Cô bé lớn dần theo age: <0.3 bé · <0.55 thiếu nữ · <0.85 mẹ dắt con · còn lại bà ngồi với cháu
  const pose = Math.round(w.gpose); // 0 đi · 1 ngồi xổm · 2 ngồi trên đá · 3 đứng
  const step = Math.floor(t * 4) % 2 ? "a" : "b";
  const bob = pose === 0 ? Math.abs(Math.sin(t * Math.PI * 4)) * 4 : 0;
  const girl = () => {
    const o = w.girl;
    if (w.age < 0.3) {
      if (pose === 2) return <Sprite song={song} id="girl-sit" x={STONE_X - 10} y={STONE_TOP + 150} h={200} opacity={o} />;
      if (pose === 1) return <Sprite song={song} id="girl-crouch" x={w.gx} y={PATH_Y - 55} h={175} opacity={o} />;
      return <Sprite song={song} id={`girl-walk-${pose === 0 ? step : "a"}`} x={w.gx} y={PATH_Y - bob} h={235} opacity={o} />;
    }
    if (w.age < 0.55) {
      if (pose === 0) return <Sprite song={song} id={`teen-walk-${step}`} x={w.gx} y={PATH_Y - bob} h={290} opacity={o} />;
      return <Sprite song={song} id="teen-sit" x={STONE_X - 5} y={STONE_TOP + 175} h={255} opacity={o} />;
    }
    if (w.age < 0.85) return <Sprite song={song} id={`momkid-walk-${pose === 0 ? step : "b"}`} x={w.gx} y={PATH_Y - bob} h={320} opacity={o} />;
    return <Sprite song={song} id="grandma-kid" x={STONE_X} y={STONE_TOP + 175} h={265} opacity={o} />;
  };

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: grade }}>
        <Plate song={song} id={a.id} />
        {mixAB > 0 && <Plate song={song} id={b.id} opacity={mixAB} />}
      </AbsoluteFill>

      <AbsoluteFill style={{ transform: song.depth ? `scale(${DEPTH_ZOOM})` : undefined }}>
        {/* Mặt sông lấp lánh (vùng nước trong tranh: y 420–700) */}
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 70 }, (_, i) => {
            const y = P(0, 430 + ((i * 37) % 260))[1];
            const x = ((i * 283 + sceneT * (12 + (i % 5) * 4)) % 2100) - 90;
            const len = 18 + (i % 7) * 9;
            return <line key={i} x1={x} y1={y} x2={x + len} y2={y} stroke={`rgba(255,250,235,${(0.18 + 0.12 * Math.sin(sceneT * 2 + i)) * (1 - night) * (1 - w.rain * 0.6)})`} strokeWidth="2" strokeLinecap="round" />;
          })}
        </svg>

        {/* Thuyền qua sông */}
        {w.boat > 0 && w.boat < 1 && <Sprite song={song} id="boat" x={lerp(-250, 2200, w.boat)} y={RIVER_Y + 20 + Math.sin(t * 2) * 3} h={125} opacity={band(w.boat, 0.02, 0.98, 0.04)} />}

        {/* Lũ: nước dâng tràn lên bờ */}
        {w.flood > 0 && (
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, filter: "blur(1.5px)" }}>
            <defs>
              <linearGradient id="flood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8fa7a6" stopOpacity="0.55" />
                <stop offset="0.25" stopColor="#7a8f86" stopOpacity="0.75" />
                <stop offset="1" stopColor="#6b6a52" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            {(() => {
              const top = lerp(BANK_Y + 60, STONE_TOP + 95, w.flood); // nước dâng tới nửa tảng đá
              return (
                <>
                  <path d={`M0,${top} ${Array.from({ length: 25 }, (_, i) => `L${i * 80},${top + Math.sin(i * 1.3 + t * 3) * 6}`).join(" ")} L1920,${top} L1920,1080 L0,1080 Z`} fill="url(#flood)" opacity={clamp(w.flood * 1.4)} />
                  {Array.from({ length: 30 }, (_, i) => {
                    const y = top + 20 + ((i * 53) % 300);
                    const x = ((i * 211 + t * 160) % 2100) - 100;
                    return <line key={i} x1={x} y1={y} x2={x + 40 + (i % 4) * 15} y2={y} stroke="rgba(235,240,230,0.5)" strokeWidth="2.5" strokeLinecap="round" opacity={w.flood} />;
                  })}
                </>
              );
            })()}
          </svg>
        )}

        {/* Người qua đường (tua nhanh → bóng mờ, vệt nhoè) */}
        {w.crowd > 0 &&
          crowds.map(({ list, vis }, ci) =>
            vis <= 0
              ? null
              : list.slice(0, Math.ceil(list.length * w.crowd)).map((p, i) => {
                  const span = 2500;
                  const x = ((((p.x0 + p.dir * p.sp * sceneT) % span) + span) % span) - 290;
                  return [0.12, 0.06, 0].map((lag, k) => (
                    <Sprite
                      key={`${ci}-${i}-${k}`}
                      song={song}
                      id={p.id}
                      x={x - p.dir * p.sp * lag * (1 + w.cycle * 28)}
                      y={PATH_Y + (i % 2) * 22}
                      h={p.h}
                      flip={p.dir < 0}
                      opacity={(k === 2 ? 1 : 0.25) * (0.3 + 0.7 * ghost) * vis}
                      blur={w.cycle > 0.05 ? 1.5 : 0}
                    />
                  ));
                }),
          )}

        {/* Đám cưới đi qua · cả làng dời đi */}
        {w.wedding > 0 && w.wedding < 1 && <Sprite song={song} id="wedding" x={lerp(-600, 2500, w.wedding)} y={PATH_Y + 10} h={310} />}
        {w.leave > 0 && w.leave < 1 && (
          <>
            <Sprite song={song} id="leaving" x={lerp(2500, -700, w.leave)} y={PATH_Y + 12} h={300} />
            <Sprite song={song} id="leaving" x={lerp(3300, 100, w.leave)} y={PATH_Y + 30} h={285} opacity={0.9} />
          </>
        )}

        {/* Mặt đá bóng lên vì bao người ngồi */}
        {w.polish > 0 && (
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
            <defs>
              <radialGradient id="polish">
                <stop offset="0" stopColor="#fff6e0" stopOpacity="0.55" />
                <stop offset="1" stopColor="#fff6e0" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx={STONE_X + 10} cy={STONE_TOP + 30} rx={110} ry={38} fill="url(#polish)" opacity={w.polish * (1 - night * 0.7)} />
          </svg>
        )}

        {/* Cô bé / thiếu nữ / mẹ / bà */}
        {w.girl > 0 && girl()}

        {/* Ánh nắng lóe trên đá */}
        {w.glint > 0 && (
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(${STONE_X + 40} ${STONE_TOP + 25}) scale(${w.glint * (0.8 + 0.2 * Math.sin(t * 7))})`}>
              <path d="M0,-34 L5,-5 L34,0 L5,5 L0,34 L-5,5 L-34,0 L-5,-5 Z" fill="rgba(255,246,220,0.95)" />
            </g>
          </svg>
        )}
      </AbsoluteFill>

      {/* Mùa: phủ màu, sương đông, hoa đào xuân, lá vàng thu, mưa phùn đông */}
      {sw.map((wt, si) => (wt > 0 && TINT_OP[si] > 0 ? <AbsoluteFill key={si} style={{ background: TINT[si], opacity: wt * TINT_OP[si], mixBlendMode: "soft-light" }} /> : null))}
      {winter > 0 && <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(210,220,228,0.0) 20%, rgba(210,220,228,0.55) 45%, rgba(210,220,228,0.15) 70%)", opacity: winter * 0.6 }} />}
      {spring > 0.05 && <div style={{ position: "absolute", inset: 0, opacity: spring }}><Falling t={t} n={48} colors={["#f7c6d4", "#f3a9bf", "#fde3ea"]} size={10} seed={3} /></div>}
      {autumn > 0.05 && <div style={{ position: "absolute", inset: 0, opacity: autumn }}><Falling t={t} n={30} colors={["#d98b2b", "#c2641f", "#e6b54a", "#9c4f1c"]} size={10} seed={11} /></div>}

      {/* Ánh sáng: hoàng hôn ấm, trời mưa xám, đêm xanh thẫm */}
      <AbsoluteFill style={{ background: "#ffb070", opacity: w.dusk * 0.18 * (1 - night), mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: "#4a5560", opacity: w.rain * 0.35, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "#0d1a36", opacity: night * 0.68, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "#1a2848", opacity: night * 0.25 }} />

      {/* Mưa: hai lớp gần/xa */}
      {Math.max(w.rain, winter * 0.22) > 0.01 && (
        <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: Math.round(220 * Math.max(w.rain, winter * 0.22)) }, (_, i) => {
            const near = i % 3 === 0;
            const len = near ? 46 : 26;
            const x = ((i * 97.3 + t * (near ? 260 : 170)) % 2040) - 60;
            const y = ((i * 151.7 + t * (near ? 1900 : 1200)) % 1180) - 100;
            return <line key={i} x1={x} y1={y} x2={x - len * 0.25} y2={y + len} stroke={`rgba(215,225,235,${near ? 0.45 : 0.25})`} strokeWidth={near ? 2 : 1.2} />;
          })}
        </svg>
      )}
    </AbsoluteFill>
  );
};
