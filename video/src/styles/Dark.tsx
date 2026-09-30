// Kiểu "Tối giản đen": nền tối, chữ trắng lớn giữa màn hình, sáng dần theo từng chữ được hát (karaoke),
// từ khóa màu nhấn. Hợp rap / spoken word / đoạn điệp khúc mạnh.
import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { C, Grain, KaraokeText, SANS, SERIF, TitleCards, lineAt, lineOpacity } from "../common";
import type { StyleProps } from "./index";

export const Dark: React.FC<StyleProps> = ({ song, t, duration, vertical, fps }) => {
  const { line } = lineAt(song.lines, t);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, ${C.stone} 0%, #141416 75%)`, color: "#F5F2EC" }}>
      <Grain opacity={0.1} />
      <TitleCards song={song} t={t} duration={duration} color="#F5F2EC" accent={song.accent} vertical={vertical} />

      {line && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: vertical ? "0 70px" : "0 160px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              opacity: lineOpacity(line, t, 0.15),
              transform: `scale(${interpolate(spring({ frame: Math.round((t - line.start) * fps), fps, config: { damping: 16 } }), [0, 1], [0.94, 1])})`,
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: vertical ? 96 : 104,
              lineHeight: 1.25,
            }}
          >
            <KaraokeText line={line} t={t} song={song} base="rgba(245,242,236,0.22)" fill="#F5F2EC" glow="rgba(255,255,255,0.35)" lift={6} />
          </div>
        </AbsoluteFill>
      )}

      <div
        style={{
          position: "absolute",
          bottom: vertical ? 180 : 56,
          width: "100%",
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 22,
          letterSpacing: 8,
          opacity: 0.35,
          textTransform: "lowercase",
        }}
      >
        {song.artist} · {song.title}
      </div>
    </AbsoluteFill>
  );
};
