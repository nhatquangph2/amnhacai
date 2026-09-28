// Kiểu "Khung phim": hình ảnh điện ảnh chuyển động chậm + phụ đề serif chạy karaoke.
// Hợp bài cao trào, động lực. Nền = song.scenes (phân cảnh MV, clip AI) phủ lên song.background
// (ảnh/clip cho cả bài), mặc định là ảnh bìa — cảnh nào chưa có file thì lộ nền này.
import React, { useMemo } from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, Grain, KaraokeText, SANS, SERIF, TitleCards, Vignette, lineAt, lineOpacity } from "../common";
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
  const { line } = lineAt(song.lines, t);
  const bar = vertical ? 0 : 138; // tỉ lệ 2.39:1 trên khung 16:9
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

  const hook = line?.hook;

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
          <AbsoluteFill key={scene.at} style={{ opacity, transform: `scale(${z})`, filter: "saturate(0.85) contrast(1.05)" }}>
            <Sequence from={frame - Math.round((t - scene.at) * fps)} layout="none">
              <Media src={scene.src} style={fit} rate={scene.rate} />
            </Sequence>
          </AbsoluteFill>
        );
      })}

      <AbsoluteFill
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%)" }}
      />
      {/* Câu hook: hạ sáng khung hình để chữ lớn nổi lên */}
      {hook && line && <AbsoluteFill style={{ background: "#000", opacity: 0.45 * lineOpacity(line, t, 0.5) }} />}
      <Vignette strength={0.55} />
      <Grain opacity={0.14} />

      <TitleCards song={song} t={t} duration={duration} color={C.paper} accent={song.accent} vertical={vertical} />

      {line && (
        <AbsoluteFill
          style={{
            justifyContent: hook ? "center" : "flex-end",
            alignItems: "center",
            paddingBottom: hook ? 0 : vertical ? 520 : bar + 70,
            paddingLeft: vertical ? 80 : 200,
            paddingRight: vertical ? 80 : 200,
            textAlign: "center",
          }}
        >
          <div
            style={{
              opacity: lineOpacity(line, t, 0.45),
              transform: hook
                ? `scale(${interpolate(t - line.start, [0, 1.2], [0.96, 1], { extrapolateRight: "clamp" })})`
                : `translateY(${interpolate(t - line.start, [0, 0.6], [14, 0], { extrapolateRight: "clamp" })}px)`,
              fontFamily: SERIF,
              fontSize: hook ? (vertical ? 104 : 112) : vertical ? 70 : 58,
              fontWeight: hook ? 500 : 400,
              lineHeight: 1.3,
              color: C.paper,
              textShadow: "0 2px 18px rgba(0,0,0,0.6)",
            }}
          >
            <KaraokeText
              line={line}
              t={t}
              song={song}
              base="rgba(239,232,220,0.42)"
              fill={C.paper}
              glow="rgba(255,214,170,0.55)"
              lift={hook ? 7 : 4}
            />
          </div>
        </AbsoluteFill>
      )}

      {bar > 0 && (
        <>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: bar, background: "#000" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: bar, background: "#000" }} />
          <div
            style={{
              position: "absolute",
              bottom: bar / 2 - 12,
              left: 90,
              fontFamily: SANS,
              fontSize: 20,
              letterSpacing: 6,
              color: C.paper,
              opacity: 0.5,
              textTransform: "lowercase",
            }}
          >
            {song.artist} — {song.title}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
