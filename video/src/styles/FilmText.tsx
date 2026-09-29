// Lớp chữ & khung của kiểu điện ảnh — dùng chung cho "film" (nền clip/ảnh) và "anim" (MV hoạt hình):
// phụ đề karaoke, câu hook phóng lớn, khung 2.39:1, hạt phim, thẻ tên bài.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, Grain, KaraokeText, SANS, SERIF, TitleCards, Vignette, lineAt, lineOpacity } from "../common";
import type { StyleProps } from "./index";

export const FilmText: React.FC<StyleProps & { hideLyrics?: boolean }> = ({ song, t, duration, vertical, hideLyrics }) => {
  const found = lineAt(song.lines, t).line;
  const line = hideLyrics ? null : found;
  const bar = vertical ? 0 : 138; // tỉ lệ 2.39:1 trên khung 16:9
  const hook = line?.hook;
  return (
    <>
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
            justifyContent: hook ? "center" : song.lyricsTop ? "flex-start" : "flex-end",
            alignItems: "center",
            paddingBottom: hook || song.lyricsTop ? 0 : vertical ? 520 : bar + 70,
            paddingTop: song.lyricsTop && !hook ? (vertical ? 260 : bar + 60) : 0,
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
    </>
  );
};
