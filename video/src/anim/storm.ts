// Tính trước theo bài (một lần): lúc từng chùm lá rụng, thời điểm chớp theo chữ được hát.
import { useMemo } from "react";
import { isEmphasis } from "../common";
import type { Song } from "../types";
import { AnimKey, World, rng, worldAt } from "./params";
import type { Leaf } from "./scenery";

export type Bolt = { t: number; x: number; seed: number };

export const useStorm = (song: Song, keys: AnimKey[], leaves: Leaf[]) =>
  useMemo(() => {
    const until = (song.lines[song.lines.length - 1]?.end ?? 300) + 30;
    const step = 0.1;
    const series: World[] = [];
    for (let t = 0; t <= until; t += step) series.push(worldAt(keys, t));
    const detach = new Map<number, { t: number; wind: number }>();
    for (const leaf of leaves) {
      const i = series.findIndex((w) => w.leaves < leaf.th);
      if (i >= 0) detach.set(leaf.id, { t: i * step, wind: series[i].wind });
    }
    // Chớp vào chữ giông/bão và chữ đầu câu, khi "lightning" đang bật
    const bolts: Bolt[] = [];
    const r = rng(7);
    for (const line of song.lines) {
      (line.words ?? []).forEach((w, i) => {
        const L = series[Math.min(Math.round(w.s / step), series.length - 1)]?.lightning ?? 0;
        if (L > 0.3 && (i === 0 || isEmphasis(w.t, song)) && r() < 0.45 + L * 0.5)
          bolts.push({ t: w.s, x: 200 + r() * 1520, seed: Math.floor(r() * 1e6) });
      });
    }
    return { detach, bolts };
  }, [song, keys, leaves]);

/** Độ sáng chớp tại t (0–1) và tia chớp đang hiện (nếu có). */
export const flashAt = (bolts: Bolt[], t: number) => {
  let flash = 0;
  let bolt: Bolt | null = null;
  for (const b of bolts) {
    const dt = t - b.t;
    if (dt >= 0 && dt < 0.7) {
      // hai nhịp lóe như chớp thật
      const f = Math.exp(-dt / 0.09) + 0.55 * Math.exp(-Math.abs(dt - 0.16) / 0.05);
      if (f > flash) {
        flash = Math.min(f, 1);
        bolt = dt < 0.25 ? b : bolt;
      }
    }
  }
  return { flash, bolt };
};

export const boltPath = (x: number, seed: number, bottom: number) => {
  const r = rng(seed);
  let px = x;
  const main: string[] = [`M${px},-400`];
  const forks: string[] = [];
  for (let y = -400; y < bottom; y += 30 + r() * 45) {
    px += (r() - 0.5) * 80;
    main.push(`L${px.toFixed(0)},${y.toFixed(0)}`);
    if (r() < 0.14) {
      let fx = px;
      let fy = y;
      const f = [`M${fx.toFixed(0)},${fy.toFixed(0)}`];
      const dir = r() < 0.5 ? -1 : 1;
      for (let k = 0; k < 4; k++) {
        fx += dir * (15 + r() * 35);
        fy += 25 + r() * 35;
        f.push(`L${fx.toFixed(0)},${fy.toFixed(0)}`);
      }
      forks.push(f.join(" "));
    }
  }
  return { main: main.join(" "), forks };
};
