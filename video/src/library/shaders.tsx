import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * 📜 1. LỚP PHỦ CHẤT LIỆU GIẤY DÓ & SẦN CANVAS (Tactile Papercraft Texture)
 * Tạo cảm giác vật lý thủ công, che mờ sự phẳng lỳ nhân tạo của đồ họa máy tính.
 */
export const PaperTextureOverlay: React.FC<{
  opacity?: number;
  tone?: "oldPaper" | "slateStone" | "warmWhite";
}> = ({ opacity = 0.12, tone = "oldPaper" }) => {
  const bgMap = {
    oldPaper: "#EFE8DC",
    slateStone: "#3A3A3C",
    warmWhite: "#FAF6EE",
  };

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "multiply",
        opacity,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="paperNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="4"
            result="noise"
          />
          <feDiffuseLighting in="noise" lightingColor={bgMap[tone]} surfaceScale="1.5">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>
        <rect width="100%" height="100%" filter="url(#paperNoise)" fill={bgMap[tone]} />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * 🎞️ 2. HẠT PHIM 35MM HỮU CƠ (Organic 35mm Film Grain)
 * Hạt phim chuyển động liên tục từng frame (seed ngẫu nhiên theo frame) tạo nhịp thở điện ảnh sống động.
 */
export const FilmGrainOverlay: React.FC<{
  intensity?: number;
}> = ({ intensity = 0.07 }) => {
  const frame = useCurrentFrame();
  const seed = (frame % 30) + 1;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "overlay",
        opacity: intensity,
      }}
    >
      <svg width="100%" height="100%">
        <filter id={`filmGrain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            seed={seed}
            result="grain"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#filmGrain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * 🕶️ 3. QUẦNG TỐI QUANG HỌC ĐIỆN ẢNH (Cinematic Vignette)
 * Hút mắt người xem vào vùng hành động trung tâm, làm dịu 4 góc màn hình.
 */
export const CinematicVignette: React.FC<{
  intensity?: number;
  radius?: number; // 0 - 100%
}> = ({ intensity = 0.45, radius = 65 }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse at center, rgba(0,0,0,0) ${radius}%, rgba(5,7,10,${intensity}) 100%)`,
      }}
    />
  );
};

/**
 * ☀️ 4. VỆT NẮNG XIÊN THỂ TÍCH (Volumetric God Rays)
 * Những chùm sáng vàng ấm rọi xiên qua mây hoặc cửa sổ tạo vẻ đẹp thiêng liêng.
 */
export const GodRaysOverlay: React.FC<{
  angle?: number; // Độ nghiêng (độ)
  color?: string;
  opacity?: number;
}> = ({ angle = -35, color = "#FFD166", opacity = 0.15 }) => {
  const frame = useCurrentFrame();
  const shimmer = Math.sin(frame * 0.05) * 0.03;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: opacity + shimmer,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "200%",
          top: "-50%",
          left: "-50%",
          transform: `rotate(${angle}deg)`,
          background: `repeating-linear-gradient(
            90deg,
            rgba(0,0,0,0) 0px,
            rgba(0,0,0,0) 60px,
            ${color}33 100px,
            ${color}66 140px,
            rgba(0,0,0,0) 180px
          )`,
          filter: "blur(24px)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * 🎬 5. KHUNG ĐIỆN ẢNH 2.39:1 VỚI DẤU GÓC QUANG HỌC (Cinematic Letterbox & Marks)
 */
export const CinemaScopeBars: React.FC<{
  showMarks?: boolean;
}> = ({ showMarks = true }) => {
  const { width, height } = useVideoConfig();
  // Với 1920x1080, dải 2.39:1 có chiều cao tương ứng ~804px, dải đen trên dưới mỗi bên ~138px
  const barHeight = Math.max(0, Math.round((height - (width / 2.39)) / 2));

  if (barHeight <= 0) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Dải đen trên */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: "#05070a",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      />
      {/* Dải đen dưới */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: "#05070a",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      />

      {/* Dấu góc quang học tinh tế (Corner Tick Marks) */}
      {showMarks && (
        <>
          <div style={{ position: "absolute", top: barHeight + 16, left: 24, width: 14, height: 14, borderTop: "2px solid rgba(255,255,255,0.4)", borderLeft: "2px solid rgba(255,255,255,0.4)" }} />
          <div style={{ position: "absolute", top: barHeight + 16, right: 24, width: 14, height: 14, borderTop: "2px solid rgba(255,255,255,0.4)", borderRight: "2px solid rgba(255,255,255,0.4)" }} />
          <div style={{ position: "absolute", bottom: barHeight + 16, left: 24, width: 14, height: 14, borderBottom: "2px solid rgba(255,255,255,0.4)", borderLeft: "2px solid rgba(255,255,255,0.4)" }} />
          <div style={{ position: "absolute", bottom: barHeight + 16, right: 24, width: 14, height: 14, borderBottom: "2px solid rgba(255,255,255,0.4)", borderRight: "2px solid rgba(255,255,255,0.4)" }} />
        </>
      )}
    </AbsoluteFill>
  );
};

/**
 * 🌿 6. LỚP PHỦ SỢI XƠ GIẤY DÓ VIỆT NAM (Vietnamese Dó Paper Fibers)
 * Tái hiện các sợi vỏ cây dó dài, uốn lượn tự nhiên, đan xen không đều trên nền giấy thủ công.
 */
export const DoPaperFiberOverlay: React.FC<{
  opacity?: number;
  density?: "sparse" | "medium" | "dense";
}> = ({ opacity = 0.16, density = "medium" }) => {
  const count = density === "sparse" ? 35 : density === "dense" ? 90 : 60;

  // Sinh tọa độ sợi xơ cố định theo công thức giả lập hạt hữu cơ (pseudo-random nhưng deterministic)
  const fibers = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const x = ((i * 137.5) % 100);
      const y = ((i * 223.7) % 100);
      const len = 15 + ((i * 31) % 40); // độ dài sợi 15 - 55px
      const angle = ((i * 73) % 360);
      const curve = (((i * 47) % 20) - 10);
      const strokeW = 0.6 + ((i % 5) * 0.25);
      const color = i % 3 === 0 ? "#8C7A6B" : i % 3 === 1 ? "#A69280" : "#594A3D";
      list.push({ x, y, len, angle, curve, strokeW, color });
    }
    return list;
  }, [count]);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "multiply",
        opacity,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {fibers.map((f, i) => (
          <path
            key={i}
            d={`M ${f.x} ${f.y} Q ${f.x + f.curve} ${f.y + f.len * 0.05} ${f.x + Math.sin(f.angle) * f.len * 0.08} ${f.y + Math.cos(f.angle) * f.len * 0.08}`}
            stroke={f.color}
            strokeWidth={f.strokeW * 0.12}
            strokeLinecap="round"
            fill="none"
            opacity={0.65}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/**
 * 🧵 7. LỚP PHỦ HẠT SẦN CANVAS / VẢI BỐ (Canvas Weave Texture)
 * Vân thớ vải dệt đan chữ thập (warp & weft) tạo cảm giác tranh vẽ trên toan vải thực tế.
 */
export const CanvasWeaveOverlay: React.FC<{
  opacity?: number;
}> = ({ opacity = 0.08 }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "multiply",
        opacity,
      }}
    >
      <svg width="100%" height="100%">
        <defs>
          <pattern id="canvasGrid" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="#2B2621" strokeWidth="1.2" opacity="0.4" />
            <line x1="3" y1="0" x2="3" y2="6" stroke="#FAF6EE" strokeWidth="1.2" opacity="0.4" />
            <rect x="0" y="0" width="3" height="3" fill="#D5CBB9" opacity="0.2" />
            <rect x="3" y="3" width="3" height="3" fill="#3D342B" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#canvasGrid)" />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * 🎨 8. VỆT LOANG MÀU NƯỚC / SƠN BỘT GOUACHE (Gouache Wash & Watercolor Bleed Edge)
 * Tạo viền tụ sắc tố (pigment pooling) và độ nhòe thấm mép hữu cơ quanh các mảng đồ họa.
 */
export const WatercolorBleedOverlay: React.FC<{
  opacity?: number;
}> = ({ opacity = 0.14 }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "multiply",
        opacity,
      }}
    >
      <svg width="100%" height="100%">
        <filter id="gouacheBleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feMorphology operator="dilate" radius="1.5" in="displaced" result="dilated" />
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 0.85 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#gouacheBleed)" fill="transparent" />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * 🪵 9. VẾT KHẮC MỘC BẢN & MỰC THẤM LINOCUT (Linocut Woodblock Texture)
 * Hiệu ứng mực in tranh khắc gỗ, các vết xước dao tỉa và viền mực thấm không hoàn hảo.
 */
export const LinocutInkOverlay: React.FC<{
  opacity?: number;
}> = ({ opacity = 0.1 }) => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity,
      }}
    >
      <svg width="100%" height="100%">
        <filter id="linocutCarve">
          <feTurbulence type="turbulence" baseFrequency="0.08 0.02" numOctaves="2" result="cut" />
          <feColorMatrix type="luminanceToAlpha" result="alphaCut" />
        </filter>
        <rect width="100%" height="100%" filter="url(#linocutCarve)" fill="#FFFFFF" />
      </svg>
    </AbsoluteFill>
  );
};
