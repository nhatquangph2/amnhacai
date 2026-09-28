// Kiểu "Hoạt hình": MV vẽ bằng code — tuyến cây (đồi, lòng đất) song song tuyến người (phòng, phố, bàn viết).
// "shots" chọn cảnh theo thời gian; "anim" điều khiển thời tiết/ánh sáng/máy quay; chữ karaoke như kiểu film.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Grain, Vignette } from "../common";
import { HillScene, SC } from "../anim/Hill";
import { Bud, Rings } from "../anim/Overlays";
import { Desk, Notebook, Room, SceneProps, Street } from "../anim/Scenes";
import { worldAt } from "../anim/params";
import { flashAt, useStorm } from "../anim/storm";
import type { Shot } from "../types";
import { FilmText } from "./FilmText";
import type { StyleProps } from "./index";

const FADE = 0.8;
const SCENES = { room: Room, street: Street, desk: Desk, notebook: Notebook };

export const Anim: React.FC<StyleProps> = (props) => {
  const { song, t, vertical } = props;
  const keys = song.anim ?? [];
  const w = worldAt(keys, t);
  const { bolts } = useStorm(song, keys, SC.leaves);
  const flash = flashAt(bolts, t).flash * w.lightning;
  const shots: Shot[] = song.shots?.length ? song.shots : [{ at: 0, scene: "hill" }];

  let cur = 0;
  for (let i = 0; i < shots.length; i++) if (shots[i].at <= t) cur = i;
  const layers: { shot: Shot; end: number; opacity: number }[] = [];
  const s = shots[cur];
  const fadeIn = s.cut || cur === 0 ? 1 : interpolate(t, [s.at, s.at + FADE], [0, 1], { extrapolateRight: "clamp" });
  if (fadeIn < 1) layers.push({ shot: shots[cur - 1], end: s.at + FADE, opacity: 1 });
  layers.push({ shot: s, end: shots[cur + 1]?.at ?? props.duration, opacity: fadeIn });

  const render = (shot: Shot, end: number) => {
    const p = Math.min(Math.max((t - shot.at) / Math.max(end - shot.at, 0.01), 0), 1);
    if (shot.scene === "hill") {
      const f = shot.figure;
      const fx = f ? f.x0 + ((f.x1 ?? f.x0) - f.x0) * p : undefined;
      return <HillScene song={song} keys={keys} t={t} vertical={vertical} figure={f ? { pose: f.pose, x: f.x0, H: f.H, flip: f.flip } : undefined} figureX={fx} />;
    }
    const Scene = SCENES[shot.scene] as React.FC<SceneProps>;
    return <Scene t={t} p={p} w={w} flash={flash} vertical={vertical} song={song} />;
  };

  return (
    <AbsoluteFill>
      {layers.map(({ shot, end, opacity }) => (
        <AbsoluteFill key={shot.at} style={{ opacity }}>
          {render(shot, end)}
        </AbsoluteFill>
      ))}
      {w.rings > 0 && <Rings w={w} t={t} />}
      {w.bud > 0 && <Bud w={w} t={t} />}
      {w.black > 0 && <AbsoluteFill style={{ background: "#000", opacity: w.black }} />}
      <Vignette strength={0.5} />
      <Grain opacity={0.09} />
      <FilmText {...props} hideLyrics={s.scene === "notebook" && fadeIn >= 1} />
    </AbsoluteFill>
  );
};
