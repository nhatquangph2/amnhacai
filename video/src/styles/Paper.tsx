// Kiểu "Trang giấy": nền giấy cũ, chữ in mờ sẵn, mực thấm đậm dần qua từng chữ đúng lúc được hát.
// Hợp bài tự sự, thơ.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, Grain, KaraokeText, SANS, SERIF, TitleCards, Vignette, lineAt, lineOpacity } from "../common";
import type { StyleProps } from "./index";

export const Paper: React.FC<StyleProps> = (props) => {
  const { song, t, duration, vertical } = props;
  const { line, prev } = lineAt(song.lines, t);
  const fontSize = vertical ? 76 : 82;

  return (
    <AbsoluteFill style={{ background: C.paper, color: C.ink }}>
      {/* Thớ giấy: nhiễu tĩnh, nhân màu */}
      <Grain opacity={0.18} blend="multiply" />
      <Vignette strength={0.22} />

      <TitleCards song={song} t={t} duration={duration} color={C.ink} accent={song.accent} vertical={vertical} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: vertical ? "0 90px" : "0 220px",
          textAlign: "center",
        }}
      >
        {/* Dòng trước mờ dần phía trên như mực đã khô */}
        {prev && t - prev.end < 1.2 && t >= prev.end && (
          <div
            style={{
              fontFamily: SERIF,
              fontSize: fontSize * 0.62,
              opacity: interpolate(t - prev.end, [0, 1.2], [0.35, 0], { extrapolateRight: "clamp" }),
              marginBottom: 40,
              fontStyle: "italic",
            }}
          >
            {prev.text}
          </div>
        )}
        {line && (
          <div style={{ opacity: lineOpacity(line, t, 0.2), fontFamily: SERIF, fontSize, lineHeight: 1.35 }}>
            <KaraokeText line={line} t={t} song={song} base="rgba(30,30,30,0.18)" fill={C.ink} lift={2} />
          </div>
        )}
      </AbsoluteFill>

      {line?.section && (
        <div
          style={{
            position: "absolute",
            top: vertical ? 160 : 70,
            left: vertical ? 90 : 90,
            fontFamily: SANS,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.4,
          }}
        >
          {line.section}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: vertical ? 180 : 60,
          right: 90,
          fontFamily: SERIF,
          fontSize: 26,
          fontStyle: "italic",
          opacity: 0.45,
        }}
      >
        {song.title} · senore
      </div>
    </AbsoluteFill>
  );
};
