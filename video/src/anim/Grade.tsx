// Lớp chỉnh màu & ánh sáng theo thời gian bài (song.grade) — phủ lên mọi cảnh kiểu anim:
//   wash   — ám màu chủ đạo của chặng (soft-light)
//   haze   — sương không khí quanh đường chân trời → lớp xa nhạt dần, tạo chiều sâu (screen)
//   shadow — tiền cảnh tối dần xuống đáy khung (multiply)
//   key    — quầng sáng của nguồn sáng chính: mặt trời, trăng, đèn (screen)
//   vignette, contrast, saturate
import React from "react";
import { AbsoluteFill } from "remotion";
import type { GradeKey } from "../types";

const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixC = (a: string, b: string, k: number) => `rgb(${rgb(a).map((v, i) => Math.round(lerp(v, rgb(b)[i], k))).join(",")})`;
const ease = (k: number) => k * k * (3 - 2 * k);

const DEF: Required<Omit<GradeKey, "t">> = {
  wash: "#808080", washOpacity: 0, haze: "#ffffff", hazeOpacity: 0, horizon: 0.6, shadow: "#000000", shadowOpacity: 0,
  key: "#ffffff", keyX: 0.75, keyY: 0.2, keyStrength: 0, vignette: 0.4, contrast: 1, saturate: 1,
};

/** Giá trị grade tại thời điểm t: giữ nguyên từng mốc, chuyển mượt trong `blend` giây trước mốc kế tiếp */
export const gradeAt = (keys: GradeKey[], t: number, blend = 1.6) => {
  const ks = keys.map((k) => ({ ...DEF, ...k }));
  let i = 0;
  while (i < ks.length - 1 && t >= ks[i + 1].t) i++;
  const a = ks[i], b = ks[i + 1];
  const k = b ? ease(clamp((t - (b.t - blend)) / blend)) : 0;
  if (!b || k <= 0) return a;
  const n = (x: number, y: number) => lerp(x, y, k);
  return {
    ...a,
    wash: mixC(a.wash, b.wash, k), washOpacity: n(a.washOpacity, b.washOpacity), haze: mixC(a.haze, b.haze, k), hazeOpacity: n(a.hazeOpacity, b.hazeOpacity),
    horizon: n(a.horizon, b.horizon), shadow: mixC(a.shadow, b.shadow, k), shadowOpacity: n(a.shadowOpacity, b.shadowOpacity), key: mixC(a.key, b.key, k),
    keyX: n(a.keyX, b.keyX), keyY: n(a.keyY, b.keyY), keyStrength: n(a.keyStrength, b.keyStrength), vignette: n(a.vignette, b.vignette),
    contrast: n(a.contrast, b.contrast), saturate: n(a.saturate, b.saturate),
  };
};

/** Bọc cảnh: tương phản / bão hoà áp lên chính cảnh, các lớp ánh sáng phủ bên trên */
export const Graded: React.FC<{ keys?: GradeKey[]; t: number; children: React.ReactNode }> = ({ keys, t, children }) => {
  if (!keys?.length) return <>{children}</>;
  const g = gradeAt(keys, t);
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `contrast(${g.contrast.toFixed(3)}) saturate(${g.saturate.toFixed(3)})` }}>{children}</AbsoluteFill>
      {g.washOpacity > 0 && <AbsoluteFill style={{ background: g.wash, opacity: g.washOpacity, mixBlendMode: "soft-light" }} />}
      {g.hazeOpacity > 0 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(to bottom, transparent ${pct(g.horizon - 0.42)}, ${g.haze} ${pct(g.horizon - 0.03)}, transparent ${pct(g.horizon + 0.04)})`,
            opacity: g.hazeOpacity,
            mixBlendMode: "screen",
          }}
        />
      )}
      {g.keyStrength > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 55% 60% at ${pct(g.keyX)} ${pct(g.keyY)}, ${g.key} 0%, transparent 70%)`,
            opacity: g.keyStrength,
            mixBlendMode: "screen",
          }}
        />
      )}
      {g.shadowOpacity > 0 && (
        <AbsoluteFill style={{ background: `linear-gradient(to bottom, transparent ${pct(g.horizon + 0.08)}, ${g.shadow} 100%)`, opacity: g.shadowOpacity, mixBlendMode: "multiply" }} />
      )}
      {g.vignette > 0 && (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 48%, transparent 55%, rgba(8,6,10,0.95) 100%)", opacity: g.vignette, mixBlendMode: "multiply" }} />
      )}
    </AbsoluteFill>
  );
};
