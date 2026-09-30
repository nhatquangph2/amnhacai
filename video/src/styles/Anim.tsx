// Kiểu "Hoạt hình": MV vẽ bằng code — tuyến cây (đồi, lòng đất) song song tuyến người (phòng, phố, bàn viết).
// "shots" chọn cảnh theo thời gian; "anim" điều khiển thời tiết/ánh sáng/máy quay; chữ karaoke như kiểu film.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Grain, Vignette } from "../common";
import { HillScene, SC } from "../anim/Hill";
import { Bud, Rings } from "../anim/Overlays";
import { Desk, Notebook, Room, SceneProps, Street } from "../anim/Scenes";
import { Riverbank } from "../anim/Riverbank";
import { PaintedBank } from "../anim/PaintedBank";
import { BrushScene } from "../anim/BrushScene";
import { DeepScene, GenesisScene } from "../anim/StoneJourney";
import { HoleView, LiftScene, NightRoad, PersonScene, PlazaScene, RidgeScene, TruckScene } from "../anim/StoneJourney2";
import { worldAt } from "../anim/params";
import { flashAt, useStorm } from "../anim/storm";
import type { Shot } from "../types";
import { FilmText } from "./FilmText";
import type { StyleProps } from "./index";

const FADE = 0.8;
const SCENES = { room: Room, street: Street, desk: Desk, notebook: Notebook, bank: Riverbank as React.FC<SceneProps>, painted: PaintedBank as React.FC<SceneProps>, brush: BrushScene as React.FC<SceneProps>, genesis: GenesisScene, deep: DeepScene, lift: LiftScene, truck: TruckScene, ridge: RidgeScene, nightroad: NightRoad, plaza: PlazaScene, holeview: HoleView, person: PersonScene };

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
      const list = [...(shot.figure ? [shot.figure] : []), ...(shot.figures ?? [])];
      const figs = list.map((f) => ({ pose: f.pose, x: f.x0 + ((f.x1 ?? f.x0) - f.x0) * p, H: f.H, flip: f.flip, scarf: f.scarf }));
      return <HillScene song={song} keys={keys} t={t} vertical={vertical} figures={figs} />;
    }
    const Scene = SCENES[shot.scene] as React.FC<SceneProps>;
    return <Scene t={t + (shot.tOff ?? 0)} p={p} w={w} flash={flash} vertical={vertical} song={song} keys={keys} shot={shot} />;
  };

  return (
    <AbsoluteFill>
      {layers.map(({ shot, end, opacity }) => (
        <AbsoluteFill key={shot.at} style={{ opacity }} from={3}>
          {render(shot, end)}
        </AbsoluteFill>
      ))}
      {w.rings > 0 && <Rings w={w} t={t} />}
      {w.bud > 0 && <Bud w={w} t={t} />}
      {w.black > 0 && <AbsoluteFill style={{ background: "#000", opacity: w.black }} />}
      {s.scene !== "bank" && s.scene !== "painted" && s.scene !== "brush" && <Vignette strength={0.5} />}
      <Grain opacity={0.09} />
      <FilmText {...props} hideLyrics={s.scene === "notebook" && fadeIn >= 1} />
    </AbsoluteFill>
  );
};
