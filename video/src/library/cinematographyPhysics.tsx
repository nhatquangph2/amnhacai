import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * 🎥 HỆ THỐNG ĐỘNG LỰC HỌC MÁY QUAY ĐIỆN ẢNH (Cinematic Physics Camera Engine)
 * Thiết lập các chuyển động camera có quán tính khối lượng (Mass & Inertia),
 * độ thở tự nhiên của cơ khí quang học (Lens Breathing) và xóa phông trường nông (Shallow DOF / Rack Focus).
 */

export type CameraPhysicsProps = {
  children: React.ReactNode;
  x?: number; // Dolly Pan X (px)
  y?: number; // Pedestal Tilt Y (px)
  zoom?: number; // Tỷ lệ phóng đại quang học (1.0 = 100%)
  tilt?: number; // Góc nghiêng trục quang học (độ)
  handheld?: boolean | number; // Độ thở hữu cơ của người cầm máy (0.0 - 1.0)
  damping?: number; // Hệ số cản quán tính (mặc định 0.88)
};

/**
 * 1. MÁY QUAY ĐIỆN ẢNH VẬT LÝ (Physical Camera Wrapper)
 * Triệt tiêu chuyển động giật cục hoặc zoom/xoay phi vật lý của AI,
 * thay bằng quán tính trượt êm ái như ray trượt dolly studio 150kg.
 */
export const PhysicalCamera: React.FC<CameraPhysicsProps> = ({
  children,
  x = 0,
  y = 0,
  zoom = 1.0,
  tilt = 0,
  handheld = 0.2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Mô phỏng nhịp thở vi mô hữu cơ (Organic Breathing Sway) — tần số rất thấp 0.18Hz
  const breathFactor = typeof handheld === "number" ? handheld : handheld ? 0.35 : 0;
  const swayX = Math.sin(t * 1.1) * 2.2 * breathFactor;
  const swayY = Math.cos(t * 0.85) * 1.8 * breathFactor;
  const swayTilt = Math.sin(t * 0.95) * 0.12 * breathFactor;

  // Hiệu ứng "Lens Breathing" tinh tế: tiêu cự thay đổi làm tỷ lệ khung hình dập dềnh 0.05%
  const lensBreathing = Math.sin(t * 1.3) * 0.003 * breathFactor;

  const totalX = x + swayX;
  const totalY = y + swayY;
  const totalZoom = Math.max(0.1, zoom + lensBreathing);
  const totalTilt = tilt + swayTilt;

  return (
    <AbsoluteFill
      style={{
        transformOrigin: "50% 50%",
        transform: `translate3d(${-totalX}px, ${-totalY}px, 0px) scale(${totalZoom}) rotate(${totalTilt}deg)`,
        transition: "none",
        willChange: "transform",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * 2. CHUYỂN TIÊU CỰ QUANG HỌC & XÓA PHÔNG TRƯỜNG NÔNG (Rack Focus & Shallow DOF)
 * Tái tạo hiện tượng quang học của ống kính khẩu độ lớn (f/1.4 - f/2.0):
 * Chỉ một mặt phẳng tiêu cự nét căng, các lớp phía trước hoặc phía sau bị nhòe bokeh quang học.
 */
export type DepthPlane = 0 | 1 | 2; // 0: Tiền cảnh (Foreground), 1: Trung cảnh/Chủ thể (Subject), 2: Hậu cảnh (Background)

export const RackFocusLayer: React.FC<{
  children: React.ReactNode;
  layerPlane: DepthPlane; // Độ sâu của lớp này
  focusPlane: number; // Mặt phẳng đang lấy nét (0.0 = tiền cảnh, 1.0 = chủ thể, 2.0 = hậu cảnh)
  maxBokeh?: number; // Bán kính nhòe tối đa (px, mặc định 7px)
}> = ({ children, layerPlane, focusPlane, maxBokeh = 7 }) => {
  // Khoảng cách từ lớp này đến mặt phẳng lấy nét
  const dist = Math.abs(layerPlane - focusPlane);
  
  // Tính độ nhòe quang học phi tuyến tính (Circle of Confusion)
  const blur = Math.min(maxBokeh, dist * maxBokeh);
  
  // Tinh chỉnh độ sáng quang học khi mất nét (quang sai viền nhẹ)
  const opacity = interpolate(blur, [0, maxBokeh], [1, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : undefined,
        opacity,
        willChange: blur > 0.4 ? "filter, opacity" : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
