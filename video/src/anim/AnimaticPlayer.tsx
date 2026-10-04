import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, SERIF, SANS, lineAt, useBrandFonts } from "../common";
import type { LyricVideoProps, StoryboardBeat, WordTime } from "../types";

const formatTimecode = (seconds: number, fps: number): string => {
  const totalFrames = Math.floor(seconds * fps);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const frames = totalFrames % fps;

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
};

export const AnimaticPlayer: React.FC<LyricVideoProps> = ({
  song,
  clipStart = 0,
  songDuration,
}) => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const t = clipStart + frame / fps;
  const totalDuration = songDuration ?? durationInFrames / fps;

  // Tìm phân cảnh Storyboard hiện tại
  const beats: StoryboardBeat[] = song.storyboard ?? [];
  const currentBeat: StoryboardBeat =
    beats.find((b) => t >= b.start && t < b.end) ??
    (beats.length > 0 && t >= beats[beats.length - 1].end
      ? beats[beats.length - 1]
      : beats[0] ?? {
          id: "SH-01",
          start: 0,
          end: totalDuration,
          framing: "MASTER SHOT",
          camera: "STATIC",
          action: "Phân cảnh tiền kỳ chính",
          mood: "Neutral",
          palette: [C.paper, C.stone, C.earth, C.ember],
        });

  // Tìm câu hát đang chạy
  const { line } = lineAt(song.lines, t);

  // Bảng màu Color Script
  const palette = currentBeat.palette && currentBeat.palette.length >= 4
    ? currentBeat.palette
    : [C.paper, C.stone, C.earth, song.accent || C.ember];

  const shotDuration = Math.max(0.1, currentBeat.end - currentBeat.start);
  const shotProgress = Math.min(1, Math.max(0, (t - currentBeat.start) / shotDuration));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d0f12",
        color: "#ffffff",
        fontFamily: SANS,
        overflow: "hidden",
      }}
    >
      {/* 1. KHUNG HÌNH CHÍNH (VIEWPORT 16:9 / 2.39:1 LETTERBOX) */}
      <div
        style={{
          position: "absolute",
          top: 70,
          bottom: 120,
          left: 60,
          right: 60,
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          background: `radial-gradient(circle at 50% 50%, ${palette[0]}22 0%, #000000 95%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Nếu có ảnh sketch thật từ storyboard */}
        {currentBeat.image ? (
          <Img
            src={staticFile(currentBeat.image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          /* Card mô phỏng Storyboard điện ảnh (Procedural Beat Plate) */
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Lưới Quy tắc 1/3 (Rule of Thirds Grid) */}
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: 0.15,
                pointerEvents: "none",
              }}
            >
              <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="#fff" strokeDasharray="6 6" />
              <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="#fff" strokeDasharray="6 6" />
              <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="#fff" strokeDasharray="6 6" />
              <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="#fff" strokeDasharray="6 6" />
              {/* Tâm ngắm Crosshair */}
              <circle cx="50%" cy="50%" r="24" fill="none" stroke="#fff" strokeWidth="1" />
              <line x1="48%" y1="50%" x2="52%" y2="50%" stroke="#fff" strokeWidth="1.5" />
              <line x1="50%" y1="46%" x2="50%" y2="54%" stroke="#fff" strokeWidth="1.5" />
            </svg>

            {/* Dải màu Color Script Gradient đa tầng */}
            <div
              style={{
                position: "absolute",
                inset: 40,
                borderRadius: 12,
                border: `2px dashed ${palette[1]}66`,
                background: `linear-gradient(135deg, ${palette[0]}33 0%, ${palette[1]}22 50%, ${palette[2]}33 100%)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 48px",
                textAlign: "center",
              }}
            >
              {/* Badge Cỡ cảnh */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 16px",
                  borderRadius: 20,
                  backgroundColor: "rgba(0, 0, 0, 0.65)",
                  border: `1px solid ${palette[3]}aa`,
                  color: palette[3] || "#fff",
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                <span>🎬 {currentBeat.framing ?? "CINEMATIC FRAMING"}</span>
                <span style={{ opacity: 0.5 }}>|</span>
                <span>🎥 {currentBeat.camera ?? "DYNAMIC MOVE"}</span>
              </div>

              {/* Mô tả hành động & nội dung thị giác */}
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 28,
                  lineHeight: 1.45,
                  maxWidth: 1100,
                  color: "#f0f4f8",
                  textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                  marginBottom: 20,
                }}
              >
                "{currentBeat.action ?? "Hành động phân cảnh theo kịch bản"}"
              </div>

              {/* Thanh tiến trình của riêng Shot này */}
              <div
                style={{
                  width: 320,
                  height: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 2,
                  overflow: "hidden",
                  marginTop: 12,
                }}
              >
                <div
                  style={{
                    width: `${shotProgress * 100}%`,
                    height: "100%",
                    backgroundColor: palette[3] || C.ember,
                    transition: "width 0.1s linear",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 6,
                  fontFamily: "monospace",
                }}
              >
                SHOT TIMING: {shotProgress.toFixed(2)} / {shotDuration.toFixed(1)}s
              </div>
            </div>

            {/* Dấu góc thước phim (Corner Tick Marks) */}
            <div style={{ position: "absolute", top: 16, left: 16, width: 20, height: 20, borderTop: "2px solid #fff", borderLeft: "2px solid #fff" }} />
            <div style={{ position: "absolute", top: 16, right: 16, width: 20, height: 20, borderTop: "2px solid #fff", borderRight: "2px solid #fff" }} />
            <div style={{ position: "absolute", bottom: 16, left: 16, width: 20, height: 20, borderBottom: "2px solid #fff", borderLeft: "2px solid #fff" }} />
            <div style={{ position: "absolute", bottom: 16, right: 16, width: 20, height: 20, borderBottom: "2px solid #fff", borderRight: "2px solid #fff" }} />
          </div>
        )}
      </div>

      {/* 2. ĐẠO DIỄN HEADS-UP DISPLAY (HUD TOP BAR) */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 60,
          right: 60,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          paddingBottom: 10,
        }}
      >
        {/* Góc trái: SHOT ID & THỜI LƯỢNG */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              padding: "4px 12px",
              backgroundColor: C.ember,
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              borderRadius: 4,
              letterSpacing: 1.5,
              fontFamily: "monospace",
            }}
          >
            {currentBeat.id}
          </div>
          <div style={{ fontSize: 14, color: "#cbd5e1" }}>
            <span style={{ fontWeight: 600 }}>{song.title}</span> — {currentBeat.start.toFixed(1)}s ➔ {currentBeat.end.toFixed(1)}s
            <span style={{ opacity: 0.5, marginLeft: 8 }}>({shotDuration.toFixed(1)}s duration)</span>
          </div>
        </div>

        {/* Giữa: COLOR SCRIPT SWATCH STRIP (Theo Ralph Eggleston / Pixar) */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, letterSpacing: 1, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
            Color Script:
          </span>
          <div style={{ display: "flex", gap: 4, padding: "3px 6px", background: "rgba(255,255,255,0.06)", borderRadius: 6 }}>
            {palette.map((hex, idx) => (
              <div
                key={idx}
                title={hex}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 3,
                  backgroundColor: hex,
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
          {currentBeat.mood && (
            <span style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic", marginLeft: 4 }}>
              ({currentBeat.mood})
            </span>
          )}
        </div>

        {/* Góc phải: SMPTE TIMECODE & FRAME */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "monospace", fontSize: 14 }}>
          <div style={{ color: "#38bdf8" }}>
            REC ● <span style={{ fontWeight: 700, fontSize: 16 }}>{formatTimecode(t, fps)}</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)" }}>
            FR {frame} / {durationInFrames} ({fps} FPS)
          </div>
        </div>
      </div>

      {/* 3. ĐẠO DIỄN HEADS-UP DISPLAY (HUD BOTTOM BAR — LỜI HÁT & NHỊP DỰNG) */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 60,
          right: 60,
          height: 90,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          paddingTop: 8,
        }}
      >
        {/* Dòng Lời bài hát & Karaoke highlight */}
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 22,
            textAlign: "center",
            minHeight: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {line ? (
            line.words && line.words.length > 0 ? (
              line.words.map((w: WordTime, i: number) => {
                const isSinging = t >= w.s && t <= w.e;
                const isPassed = t > w.e;
                return (
                  <span
                    key={i}
                    style={{
                      color: isSinging ? "#fbbf24" : isPassed ? "#ffffff" : "rgba(255,255,255,0.4)",
                      transform: isSinging ? "scale(1.12)" : "scale(1)",
                      fontWeight: isSinging ? 700 : 400,
                      transition: "color 0.1s, transform 0.1s",
                      display: "inline-block",
                    }}
                  >
                    {w.t}
                  </span>
                );
              })
            ) : (
              <span style={{ color: "#ffffff" }}>{line.text}</span>
            )
          ) : (
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16, fontStyle: "italic" }}>
              [ Nhạc dạo / Khoảng lặng âm thanh ]
            </span>
          )}
        </div>

        {/* Thanh Timeline tổng quan phân cảnh (Shot Map Bar) */}
        <div
          style={{
            display: "flex",
            height: 10,
            width: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: 3,
            overflow: "hidden",
            marginTop: 10,
            position: "relative",
          }}
        >
          {beats.map((b) => {
            const startPct = (b.start / totalDuration) * 100;
            const widthPct = ((b.end - b.start) / totalDuration) * 100;
            const isCur = t >= b.start && t < b.end;
            return (
              <div
                key={b.id}
                title={`${b.id}: ${b.framing}`}
                style={{
                  position: "absolute",
                  left: `${startPct}%`,
                  width: `${widthPct}%`,
                  height: "100%",
                  backgroundColor: isCur ? C.ember : (b.palette?.[0] ? `${b.palette[0]}99` : "rgba(255,255,255,0.2)"),
                  borderRight: "1px solid rgba(0,0,0,0.5)",
                }}
              />
            );
          })}
          {/* Đầu đọc Playhead */}
          <div
            style={{
              position: "absolute",
              left: `${(t / totalDuration) * 100}%`,
              top: 0,
              bottom: 0,
              width: 3,
              backgroundColor: "#38bdf8",
              boxShadow: "0 0 8px #38bdf8",
            }}
          />
        </div>
      </div>

      {/* 4. ÂM THANH ĐỒNG BỘ NGUYÊN BẢN */}
      <Audio src={staticFile(song.audio)} trimBefore={Math.round(clipStart * fps)} />
    </AbsoluteFill>
  );
};
