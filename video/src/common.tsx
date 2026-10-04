import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { LyricLine, Song, WordTime } from "./types";

// Bảng màu "Giấy cũ & Mực" — docs/02-nhan-dien-thuong-hieu.md
export const C = {
  paper: "#EFE8DC",
  ink: "#1E1E1E",
  stone: "#3A3A3C",
  earth: "#7A5C43",
  ember: "#D9622B",
  night: "#23304A",
  moss: "#6B7A4B",
};

export const SERIF = "Lora, 'Noto Serif', Georgia, serif";
export const SANS = "'Be Vietnam Pro', 'Helvetica Neue', sans-serif";

// Font nằm ở public/fonts (npm run prep chép từ brand/fonts)
const FONTS: [string, string, string][] = [
  ["Lora", "fonts/Lora.ttf", "400 700"],
  ["Be Vietnam Pro", "fonts/BeVietnamPro-Medium.ttf", "500"],
];

export const useBrandFonts = () => {
  const [handle] = useState(() => delayRender("Tải font thương hiệu"));
  useEffect(() => {
    Promise.all(
      FONTS.map(([family, file, weight]) => {
        const face = new FontFace(family, `url(${staticFile(file)})`, { weight });
        document.fonts.add(face);
        return face.load();
      }),
    )
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, [handle]);
};

/** Dòng lời đang hát tại thời điểm t (giây), kèm dòng trước đó. */
export const lineAt = (lines: LyricLine[], t: number) => {
  let index = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].start <= t) index = i;
    else break;
  }
  const line = index >= 0 && t < lines[index].end ? lines[index] : null;
  return { index, line, prev: index > 0 ? lines[index - 1] : null };
};

/** Độ hiện của một dòng: vào nhanh, ra mềm. */
export const lineOpacity = (line: LyricLine, t: number, fade = 0.35) =>
  interpolate(
    t,
    [line.start, line.start + fade, line.end - fade, line.end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

const normalize = (w: string) =>
  w.toLocaleLowerCase("vi").normalize("NFC").replace(/[.,!?;:…—–\-"“”'()]/g, "");

export const isEmphasis = (word: string, song: Song) => {
  const syllables = new Set(
    (song.emphasis ?? []).flatMap((e) => e.split(/\s+/).map(normalize)),
  );
  return syllables.has(normalize(word));
};

/** Hạt phim / thớ giấy — đổi seed mỗi 2 frame cho cảm giác sống. */
export const Grain: React.FC<{ opacity?: number; blend?: string }> = ({
  opacity = 0.12,
  blend = "overlay",
}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(random(`grain-${Math.floor(frame / 2)}`) * 1000);
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: blend as React.CSSProperties["mixBlendMode"], pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.45 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** Thẻ tên bài ở đoạn dạo đầu và dòng nhận diện ở cuối bài. */
export const TitleCards: React.FC<{
  song: Song;
  t: number;
  duration: number;
  color: string;
  accent: string;
  vertical: boolean;
}> = ({ song, t, duration, color, accent, vertical }) => {
  const first = song.lines[0]?.start ?? 0;
  const last = song.lines[song.lines.length - 1]?.end ?? duration;
  const [introStart, introEnd] = song.titleAt ?? [0.3, Math.min(first - 0.3, 8)];
  const intro =
    introEnd - introStart > 1.2
      ? interpolate(t, [introStart, introStart + 1, introEnd - 0.8, introEnd], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const outro =
    duration - last > 2
      ? interpolate(t, [song.outroAt ?? last + 0.6, (song.outroAt ?? last + 0.6) + 1.2, duration - 0.6, duration], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const logo = song.logoAt
    ? interpolate(t, [song.logoAt[0], song.logoAt[0] + 0.6, song.logoAt[1] - 0.5, song.logoAt[1]], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  if (intro <= 0 && outro <= 0 && logo <= 0) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center", color }}>
      {intro > 0 && (
        <div style={{ opacity: intro, transform: `translateY(${(1 - intro) * 12}px)` }}>
          <div style={{ fontFamily: SERIF, fontSize: vertical ? 110 : 120, fontWeight: 500, letterSpacing: 1 }}>
            {song.title}
          </div>
          <div style={{ width: 60, height: 2, background: accent, margin: "36px auto" }} />
          <div style={{ fontFamily: SANS, fontSize: 34, letterSpacing: 10, textTransform: "lowercase", opacity: 0.8 }}>
            {song.artist}
          </div>
        </div>
      )}
      {logo > 0 && (
        <div style={{ position: "absolute", opacity: logo, transform: `scale(${0.92 + 0.08 * logo})` }}>
          <Img src={staticFile("brand/senore-logo.png")} style={{ height: vertical ? 560 : 500, filter: "drop-shadow(0 0 40px rgba(255,200,120,0.35))" }} />
        </div>
      )}
      {outro > 0 && (
        <div style={{ opacity: outro, transform: `scale(${0.92 + 0.08 * outro})` }}>
          {/* logo Senore (tách nền từ brand/logo, npm run prep chép vào public/brand) */}
          <Img src={staticFile("brand/senore-logo.png")} style={{ height: vertical ? 560 : 500, filter: "drop-shadow(0 0 40px rgba(255,200,120,0.35))" }} />
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Thời gian từng chữ; dòng chưa có (căn tay bằng sync) thì chia đều trong dòng. */
export const wordsOf = (line: LyricLine): WordTime[] => {
  if (line.words?.length) return line.words;
  const tokens = line.text.split(/\s+/).filter(Boolean);
  const a = line.start + 0.15;
  const step = Math.max(line.end - 0.3 - a, 0.5) / tokens.length;
  return tokens.map((t, i) => ({ t, s: a + i * step, e: a + (i + 1) * step }));
};

/**
 * Chữ chạy kiểu karaoke: cả dòng hiện sẵn màu nhạt, màu đậm "lan" qua từng chữ đúng lúc được hát.
 * Chữ trong `song.emphasis` lan màu nhấn. Chữ đang hát nhích lên nhẹ.
 */
export const KaraokeText: React.FC<{
  line: LyricLine;
  t: number;
  song: Song;
  base: string; // màu chữ chưa hát
  fill: string; // màu chữ đã hát
  glow?: string; // quầng sáng quanh chữ đang hát
  lift?: number; // px nhích lên khi đang hát
}> = ({ line, t, song, base, fill, glow, lift = 4 }) => (
  <>
    {wordsOf(line).map((raw, i) => {
      // Hát liền sang câu sau → chữ cuối phải chạy màu xong trước khi dòng mờ đi
      const e = Math.min(raw.e, line.end - 0.25);
      const w = { ...raw, s: Math.min(raw.s, e - 0.06), e };
      const p = interpolate(t, [w.s, w.e], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const active = t >= w.s && t < w.e + 0.15;
      const color = isEmphasis(w.t, song) ? song.accent : fill;
      // Viền cắt vượt ra ngoài hộp chữ theo chiều dọc để không xén dấu tiếng Việt (ẫ, ặ, ỗ...)
      const edge = `${(p * 100).toFixed(2)}%`;
      return (
        <React.Fragment key={i}>
          {i > 0 && " "}
          <span
            style={{
              position: "relative",
              display: "inline-block",
              color: base,
              transform: `translateY(${active ? -lift * Math.sin(Math.min(p, 1) * Math.PI) : 0}px)`,
            }}
          >
            {w.t}
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                color,
                clipPath: `polygon(0 -60%, ${edge} -60%, ${edge} 160%, 0 160%)`,
                textShadow: glow && active ? `0 0 18px ${glow}` : undefined,
                whiteSpace: "nowrap",
              }}
            >
              {w.t}
            </span>
          </span>
        </React.Fragment>
      );
    })}
  </>
);
