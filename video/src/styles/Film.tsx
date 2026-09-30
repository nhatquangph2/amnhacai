// Kiểu "Khung phim": hình ảnh điện ảnh chuyển động chậm + phụ đề serif chạy karaoke.
// Hợp bài cao trào, động lực. Nền = song.scenes (phân cảnh MV, clip AI) phủ lên song.background
// (ảnh/clip cho cả bài), mặc định là ảnh bìa — cảnh nào chưa có file thì lộ nền này.
import React, { useMemo } from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmText } from "./FilmText";
import type { Scene } from "../types";
import type { StyleProps } from "./index";

const isVideo = (f: string) => /\.(mp4|mov|webm)$/i.test(f);
const FADE = 0.8; // giây mờ chéo giữa hai cảnh

const Media: React.FC<{ src: string; style: React.CSSProperties; rate?: number }> = ({ src, style, rate }) =>
  isVideo(src) ? (
    <OffthreadVideo src={staticFile(src)} muted playbackRate={rate ?? 1} style={style} />
  ) : (
    <Img src={staticFile(src)} style={style} />
  );

export const Film: React.FC<StyleProps> = ({ song, t, duration, vertical, fps }) => {
  const frame = useCurrentFrame();
  const files = useMemo(() => new Set(getStaticFiles().map((f) => f.name)), []);

  // --- Nền cả bài: Ken Burns rất chậm + trôi ngang nhẹ
  const bg = song.background ?? `${song.id}/cover.jpg`;
  const zoom = interpolate(t, [0, duration], [1.05, 1.22]);
  const drift = interpolate(t, [0, duration], [-1.5, 1.5]);
  const fit: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  // Ảnh bìa có tên bài in sẵn ở đáy → bản dọc phóng thêm, neo phía trên để giấu phần chữ đó
  const coverFit: React.CSSProperties =
    vertical && !song.background ? { ...fit, transform: "scale(1.35)", transformOrigin: "50% 0%" } : fit;

  // --- Phân cảnh: cảnh hiện tại + cảnh trước (khi đang mờ chéo)
  const scenes = useMemo(() => [...(song.scenes ?? [])].sort((a, b) => a.at - b.at), [song.scenes]);
  let cur = -1;
  for (let i = 0; i < scenes.length; i++) if (scenes[i].at <= t) cur = i;
  const layers: { scene: Scene; end: number; opacity: number }[] = [];
  if (cur >= 0) {
    const s = scenes[cur];
    const fadeIn = s.cut ? 1 : interpolate(t, [s.at, s.at + FADE], [0, 1], { extrapolateRight: "clamp" });
    if (fadeIn < 1 && cur > 0) layers.push({ scene: scenes[cur - 1], end: s.at + FADE, opacity: 1 });
    layers.push({ scene: s, end: scenes[cur + 1]?.at ?? duration, opacity: fadeIn });
  }

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${drift}%)`, filter: "saturate(0.85) contrast(1.05)" }}>
        <Media src={bg} style={coverFit} />
      </AbsoluteFill>

      {layers.map(({ scene, end, opacity }) => {
        if (scene.src === "black") return <AbsoluteFill key={scene.at} style={{ background: "#000", opacity }} />;
        if (!files.has(scene.src)) return null; // chưa có clip → lộ nền cả bài
        // Mỗi cảnh phóng nhẹ trong suốt thời lượng của nó; clip chạy từ đầu khi cảnh bắt đầu
        const z = interpolate(t, [scene.at, Math.max(end, scene.at + 1)], [1.02, 1.08], { extrapolateRight: "clamp" });
        return (
          <AbsoluteFill
            key={scene.at}
            style={{ opacity, transform: `scale(${scene.flip ? -z : z}, ${z})`, filter: "saturate(0.85) contrast(1.05)" }}
          >
            {/* offset: lùi điểm bắt đầu Sequence để clip vào cảnh từ giữa (tính theo thời gian clip, đã nhân rate) */}
            <Sequence
              from={frame - Math.round((t - scene.at) * fps) - Math.round(((scene.offset ?? 0) / (scene.rate ?? 1)) * fps)}
              layout="none"
            >
              <Media src={scene.src} style={fit} rate={scene.rate} />
            </Sequence>
          </AbsoluteFill>
        );
      })}

      <FilmText song={song} t={t} duration={duration} vertical={vertical} fps={fps} />
    </AbsoluteFill>
  );
};
