import React from "react";

/**
 * 🐾 THƯ VIỆN ĐỘNG VẬT NGHỆ THUẬT CHUẨN STUDIO SENORE (Universal Animal Art Library)
 * Thiết kế theo ngôn ngữ: Papercraft cắt dán, Linocut mộc bản & Sơn bột Gouache.
 * Giữ vững giá trị hình bóng (Silhouette Value), chuyển động có nhịp sinh học tự nhiên.
 */

// ============================================================================
// 1. LOÀI CHIM (Birds: Chim én, Chim sẻ, Cò trắng)
// ============================================================================

export type BirdSpecies = "swallow" | "sparrow" | "crane";

export const StudioBird: React.FC<{
  species?: BirdSpecies;
  x: number;
  y: number;
  scale?: number;
  t: number;
  flapSpeed?: number;
  facing?: 1 | -1;
  glide?: boolean;
  color?: string;
  opacity?: number;
}> = ({
  species = "swallow",
  x,
  y,
  scale = 1.0,
  t,
  flapSpeed = 8.5,
  facing = 1,
  glide = false,
  color,
  opacity = 1.0,
}) => {
  // Chu kỳ vỗ cánh (sin wave)
  const flap = glide ? 0.1 : Math.sin(t * flapSpeed);
  const wingY = flap * 16;
  const wingAngle = flap * 32;

  // Bảng màu theo loài
  const defaultColor =
    species === "swallow"
      ? "#1F2937" // Đen chàm én
      : species === "crane"
      ? "#F3F4F6" // Cò trắng muốt
      : "#8B5A2B"; // Nâu sẻ đồng

  const bodyCol = color ?? defaultColor;
  const bellyCol = species === "swallow" ? "#F9FAFB" : species === "crane" ? "#E5E7EB" : "#D2B48C";
  const beakCol = species === "crane" ? "#D97706" : "#E5A93C";

  if (species === "crane") {
    // Cò trắng: Cổ dài, chân dài thon, sải cánh rộng uy nghi
    return (
      <g
        transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}
        opacity={opacity}
      >
        {/* Chân duỗi dài ra sau khi bay */}
        <line x1="-15" y1="6" x2="-45" y2="14" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-12" y1="9" x2="-42" y2="18" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />

        {/* Cánh sau */}
        <g transform={`rotate(${-wingAngle * 0.7} 5 0)`}>
          <path d="M 0 -4 Q -20 -38 -55 -45 Q -25 -25 0 0 Z" fill="#D1D5DB" />
        </g>

        {/* Thân mình thon thả */}
        <ellipse cx="0" cy="2" rx="22" ry="10" fill={bodyCol} />
        {/* Cổ dài cong hình chữ S */}
        <path d="M 16 0 Q 32 -10 40 -6 Q 30 4 18 6 Z" fill={bodyCol} />
        {/* Đầu & Mỏ nhọn dài */}
        <circle cx="41" cy="-6" r="5" fill={bodyCol} />
        <polygon points="45,-7 68,-4 45,-3" fill={beakCol} />

        {/* Cánh trước */}
        <g transform={`rotate(${wingAngle} 5 0)`}>
          <path d="M 4 -2 Q -18 -42 -58 -52 Q -28 -28 2 2 Z" fill={bodyCol} />
          {/* Lông vũ đen ở chóp cánh cò */}
          <path d="M -38 -45 Q -58 -52 -56 -42 Q -42 -35 -34 -38 Z" fill="#111827" />
        </g>
      </g>
    );
  }

  // Chim én / Chim sẻ
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}
      opacity={opacity}
    >
      {/* Đuôi én chẻ đôi đặc trưng */}
      {species === "swallow" ? (
        <path d="M -12 2 L -34 -6 L -20 5 L -35 14 L -12 6 Z" fill={bodyCol} />
      ) : (
        <polygon points="-10,0 -24,-3 -22,7 -10,4" fill={bodyCol} />
      )}

      {/* Cánh sau */}
      <path
        d={`M -2 -2 Q -14 ${-28 + wingY * 0.6} -32 ${-38 + wingY} Q -16 -12 2 4 Z`}
        fill="#374151"
      />

      {/* Thân mình */}
      <ellipse cx="0" cy="2" rx="14" ry="7" fill={bodyCol} />
      {/* Bụng sáng màu */}
      <ellipse cx="2" cy="4" rx="10" ry="5" fill={bellyCol} />

      {/* Đầu & Mỏ */}
      <circle cx="12" cy="0" r="5.5" fill={bodyCol} />
      <polygon points="16,-2 23,0 16,3" fill={beakCol} />
      <circle cx="13" cy="-1.5" r="1.2" fill="#FFFFFF" />

      {/* Cánh trước */}
      <path
        d={`M 0 0 Q -12 ${-32 - wingY} -34 ${-44 - wingY * 1.2} Q -16 -14 6 2 Z`}
        fill={bodyCol}
      />
    </g>
  );
};

// ============================================================================
// 2. CHÓ VÀNG TRUNG THÀNH (Faithful Companion Dog)
// ============================================================================

export type DogPose = "stand" | "sit" | "walk" | "run" | "alert";

export const StudioDog: React.FC<{
  x: number;
  y: number;
  scale?: number;
  t: number;
  pose?: DogPose;
  facing?: 1 | -1;
  color?: string;
  collar?: string;
  opacity?: number;
}> = ({
  x,
  y,
  scale = 1.0,
  t,
  pose = "stand",
  facing = 1,
  color = "#D97706", // Vàng gụ ấm áp
  collar = "#DC2626", // Vòng cổ đỏ may mắn
  opacity = 1.0,
}) => {
  // Nhịp đuôi vẫy mừng vui vẻ
  const tailWag = Math.sin(t * 9) * 22;
  // Nhịp bước chân
  const walkPhase = Math.sin(t * 5.5);
  const legFL = pose === "walk" ? walkPhase * 18 : 0;
  const legFR = pose === "walk" ? -walkPhase * 18 : 0;
  const legBL = pose === "walk" ? -walkPhase * 16 : 0;
  const legBR = pose === "walk" ? walkPhase * 16 : 0;

  const isSitting = pose === "sit";

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}
      opacity={opacity}
    >
      {/* Đuôi cong vẫy nhịp nhàng */}
      <g transform={`translate(-26 ${isSitting ? 2 : -12}) rotate(${tailWag - 35})`}>
        <path d="M 0 0 Q -16 -18 -8 -30 Q 0 -18 3 0 Z" fill={color} />
      </g>

      {/* Chân sau (xa) */}
      {!isSitting && (
        <line
          x1="-18"
          y1="0"
          x2={-20 + legBL}
          y2="28"
          stroke="#B45309"
          strokeWidth="6"
          strokeLinecap="round"
        />
      )}

      {/* Chân trước (xa) */}
      <line
        x1="16"
        y1="2"
        x2={18 + legFR}
        y2="28"
        stroke="#B45309"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* Thân mình */}
      {isSitting ? (
        <ellipse cx="-8" cy="6" rx="20" ry="16" fill={color} transform="rotate(-30 -8 6)" />
      ) : (
        <ellipse cx="0" cy="-4" rx="28" ry="15" fill={color} />
      )}

      {/* Chân sau (gần) */}
      {isSitting ? (
        <path d="M -24 18 Q -10 24 -6 28 L -28 28 Z" fill={color} />
      ) : (
        <line
          x1="-22"
          y1="0"
          x2={-24 + legBR}
          y2="28"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
      )}

      {/* Chân trước (gần) */}
      <line
        x1="20"
        y1="2"
        x2={22 + legFL}
        y2="28"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Cổ & Vòng cổ đỏ */}
      <path d="M 12 -12 L 26 -28 L 34 -22 L 22 -6 Z" fill={color} />
      <line x1="20" y1="-20" x2="30" y2="-14" stroke={collar} strokeWidth="4" strokeLinecap="round" />

      {/* Đầu & Mõm */}
      <circle cx="32" cy="-28" r="10" fill={color} />
      {/* Mõm thon đen nhẹ đầu mũi */}
      <ellipse cx="41" cy="-26" rx="7" ry="5" fill={color} />
      <ellipse cx="47" cy="-27" rx="2.5" ry="2" fill="#1F2937" />

      {/* Tai cụp tự nhiên */}
      <path d="M 28 -34 Q 22 -22 24 -16 Q 30 -22 32 -32 Z" fill="#92400E" />

      {/* Mắt tròn hiền từ */}
      <circle cx="34" cy="-30" r="1.8" fill="#1F2937" />
      <circle cx="34.5" cy="-30.5" r="0.6" fill="#FFFFFF" />
    </g>
  );
};

// ============================================================================
// 3. MÈO LƯỜI SƯỞI NẮNG (Contemplative Cat)
// ============================================================================

export type CatPose = "sleep" | "stretch" | "sit" | "walk";

export const StudioCat: React.FC<{
  x: number;
  y: number;
  scale?: number;
  t: number;
  pose?: CatPose;
  facing?: 1 | -1;
  color?: string;
  opacity?: number;
}> = ({
  x,
  y,
  scale = 1.0,
  t,
  pose = "sit",
  facing = 1,
  color = "#4B5563", // Mèo tam thể / xám tro
  opacity = 1.0,
}) => {
  const tailSway = Math.sin(t * 3.2) * 14;

  if (pose === "sleep") {
    // Mèo cuộn tròn ngủ yên bình
    const breathe = Math.sin(t * 1.8) * 1.5;
    return (
      <g
        transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}
        opacity={opacity}
      >
        {/* Thân cuộn tròn */}
        <ellipse cx="0" cy="0" rx={18 + breathe * 0.5} ry={12 + breathe} fill={color} />
        {/* Đầu gối vào đuôi */}
        <circle cx="14" cy="2" r="7.5" fill={color} />
        <polygon points="12,-4 15,-10 17,-4" fill={color} />
        <polygon points="17,-3 20,-9 21,-2" fill={color} />
        {/* Đuôi bao quanh */}
        <path d="M -16 6 Q -12 14 12 12 Q 22 8 20 2" stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  // Mèo ngồi ngắm trời
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}
      opacity={opacity}
    >
      {/* Đuôi ngoe nguẩy chậm */}
      <path
        d={`M -8 18 Q ${-20 + tailSway} 12 ${-18 - tailSway} -2`}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Thân ngồi dáng giọt nước thanh nhã */}
      <ellipse cx="0" cy="8" rx="11" ry="14" fill={color} transform="rotate(-10 0 8)" />
      {/* Bàn chân trước gọn gàng */}
      <ellipse cx="7" cy="21" rx="4" ry="2" fill={color} />
      <ellipse cx="1" cy="21" rx="4" ry="2" fill={color} />

      {/* Đầu & Tai tam giác dựng đứng */}
      <circle cx="3" cy="-8" r="8" fill={color} />
      <polygon points="-2,-13 0,-21 5,-14" fill={color} />
      <polygon points="4,-14 9,-21 10,-12" fill={color} />

      {/* Mắt lim dim */}
      <line x1="4" y1="-8" x2="8" y2="-7" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
};

// ============================================================================
// 4. HƯƠU RỪNG THANH KHIẾT (Forest Deer)
// ============================================================================

export const StudioDeer: React.FC<{
  x: number;
  y: number;
  scale?: number;
  t: number;
  facing?: 1 | -1;
  headUp?: boolean;
  color?: string;
  opacity?: number;
}> = ({
  x,
  y,
  scale = 1.0,
  t,
  facing = 1,
  headUp = true,
  color = "#9A6B43",
  opacity = 1.0,
}) => {
  const earTwitch = Math.sin(t * 1.5) * 6;
  const breath = Math.sin(t * 2.1) * 1.2;

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}
      opacity={opacity}
    >
      {/* Chân sau (xa) */}
      <line x1="-36" y1="12" x2="-42" y2="72" stroke="#7A5230" strokeWidth="5" strokeLinecap="round" />
      {/* Chân trước (xa) */}
      <line x1="28" y1="14" x2="32" y2="72" stroke="#7A5230" strokeWidth="4.5" strokeLinecap="round" />

      {/* Thân mình thon thanh nhã */}
      <ellipse cx="0" cy={10 + breath} rx="46" ry="22" fill={color} />
      {/* Đốm hoa mai trắng trên lưng hươu sao */}
      <circle cx="-15" cy="5" r="2.2" fill="#FDF6EE" opacity="0.75" />
      <circle cx="-2" cy="2" r="2" fill="#FDF6EE" opacity="0.75" />
      <circle cx="12" cy="7" r="2.4" fill="#FDF6EE" opacity="0.75" />
      <circle cx="-8" cy="14" r="1.8" fill="#FDF6EE" opacity="0.75" />

      {/* Chân sau (gần) */}
      <line x1="-30" y1="14" x2="-34" y2="74" stroke={color} strokeWidth="5.5" strokeLinecap="round" />
      {/* Chân trước (gần) */}
      <line x1="34" y1="16" x2="38" y2="74" stroke={color} strokeWidth="5" strokeLinecap="round" />

      {/* Cổ cao thanh thoát */}
      <path d="M 24 6 L 44 -26 L 56 -20 L 38 16 Z" fill={color} />

      {/* Đầu & Mõm */}
      <ellipse cx="54" cy="-28" rx="14" ry="9" fill={color} transform="rotate(-15 54 -28)" />
      <ellipse cx="66" cy="-29" rx="3" ry="2" fill="#1F2937" />
      <circle cx="53" cy="-31" r="2.2" fill="#1F2937" />

      {/* Tai vểnh đón gió */}
      <g transform={`rotate(${earTwitch} 46 -36)`}>
        <ellipse cx="42" cy="-38" rx="8" ry="4" fill={color} transform="rotate(-40 42 -38)" />
      </g>

      {/* Gạc hươu mỹ thuật thanh mảnh */}
      <path
        d="
          M 46 -34
          Q 40 -56 34 -72
          M 40 -48 Q 28 -56 22 -58
          M 36 -62 Q 24 -70 18 -72
          M 34 -72 Q 38 -84 32 -94
          M 35 -78 Q 44 -86 46 -90
        "
        stroke="#EFE8DC"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
};

// ============================================================================
// 5. ĐÀN CÁ BƠI DƯỚI NƯỚC (River Fish School)
// ============================================================================

export const StudioFishSchool: React.FC<{
  x: number;
  y: number;
  count?: number;
  t: number;
  scale?: number;
  color?: string;
  opacity?: number;
}> = ({
  x,
  y,
  count = 6,
  t,
  scale = 1.0,
  color = "#93C5FD", // Ánh bạc xanh dưới lòng sông
  opacity = 0.65,
}) => {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      {Array.from({ length: count }).map((_, i) => {
        // Từng con cá bơi so le với độ trễ và nhịp uốn riêng
        const xOff = i * 28 + Math.cos(t * 1.5 + i) * 12;
        const yOff = Math.sin(t * 2.2 + i * 0.9) * 8 + (i % 2 === 0 ? 10 : -10);
        const wiggle = Math.sin(t * 6.5 + i * 1.4) * 8;

        return (
          <g key={i} transform={`translate(${xOff} ${yOff})`}>
            {/* Đuôi cá vẫy hình sin */}
            <path
              d={`M -12 0 Q -18 ${wiggle} -26 ${wiggle * 1.4} L -24 0 L -26 ${-wiggle * 1.4} Z`}
              fill={color}
              opacity="0.8"
            />
            {/* Thân cá thoi dài */}
            <ellipse cx="0" cy="0" rx="14" ry="5.5" fill={color} />
            {/* Mắt cá chấm nhỏ */}
            <circle cx="8" cy="-1.5" r="1.2" fill="#1E3A8A" />
          </g>
        );
      })}
    </g>
  );
};

// ============================================================================
// 6. VỊT NƯỚC & THIÊN NGA LỘI SÔNG (Waterfowl: Ducks & Swans)
// ============================================================================

export type WaterfowlSpecies = "duck" | "mallard" | "swan";

export const StudioWaterfowl: React.FC<{
  species?: WaterfowlSpecies;
  x: number;
  y: number;
  scale?: number;
  t: number;
  facing?: 1 | -1;
  ripples?: boolean;
  opacity?: number;
}> = ({
  species = "duck",
  x,
  y,
  scale = 1.0,
  t,
  facing = 1,
  ripples = true,
  opacity = 1.0,
}) => {
  // Nhịp nhấp nhô trên mặt nước
  const bob = Math.sin(t * 2.8) * 3;
  const tilt = Math.cos(t * 2.8) * 2;
  const rippleSpread = ((t * 0.8) % 1) * 30;
  const rippleAlpha = 1 - (rippleSpread / 30);

  const isSwan = species === "swan";
  const isMallard = species === "mallard";

  const bodyCol = isSwan ? "#FDFEFE" : isMallard ? "#4B3D30" : "#D4A373";
  const headCol = isSwan ? "#FDFEFE" : isMallard ? "#1E5E41" : "#8C6239"; // Đầu xanh mallard
  const beakCol = isSwan ? "#EA580C" : isMallard ? "#EAB308" : "#F59E0B";

  return (
    <g
      transform={`translate(${x} ${y + bob}) scale(${scale * facing} ${scale}) rotate(${tilt})`}
      opacity={opacity}
    >
      {/* Vòng sóng nước loang ra xung quanh */}
      {ripples && (
        <g opacity={rippleAlpha * 0.6}>
          <ellipse cx="4" cy="14" rx={24 + rippleSpread} ry={7 + rippleSpread * 0.28} fill="none" stroke="#BAE6FD" strokeWidth="1.5" />
          <ellipse cx="4" cy="14" rx={14 + rippleSpread * 0.5} ry={4.5 + rippleSpread * 0.15} fill="none" stroke="#E0F2FE" strokeWidth="1.2" />
        </g>
      )}

      {/* Đuôi hếch nhẹ */}
      <polygon points="-24,4 -36,-4 -28,8 -20,8" fill={bodyCol} />

      {/* Thân mình nổi trên mặt nước */}
      <ellipse cx="-4" cy="6" rx="24" ry="12" fill={bodyCol} />
      <path d={`M -26 6 Q -4 18 20 6 L 16 12 Q -4 20 -24 12 Z`} fill="rgba(0,0,0,0.12)" />

      {/* Cánh gập với lớp lông cách điệu */}
      <path
        d="M -16 2 Q -4 -6 10 2 Q 4 10 -12 8 Z"
        fill={isMallard ? "#2563EB" : isSwan ? "#F1F5F9" : "#B45309"}
        opacity="0.9"
      />

      {isSwan ? (
        // Thiên nga: Cổ chữ S kiêu hãnh
        <g>
          <path d="M 12 6 Q 24 -12 18 -28 Q 12 -42 22 -48 Q 28 -38 24 -24 Q 28 -8 18 6 Z" fill={bodyCol} />
          <circle cx="22" cy="-48" r="6" fill={bodyCol} />
          <polygon points="26,-49 38,-47 27,-44" fill={beakCol} />
          <polygon points="21,-49 26,-49 24,-45" fill="#0F172A" /> {/* Nốt sần đen mắt thiên nga */}
        </g>
      ) : (
        // Vịt / Uyên ương
        <g>
          <ellipse cx="14" cy="-4" rx="7" ry="12" fill={headCol} transform="rotate(20 14 -4)" />
          <circle cx="16" cy="-12" r="7" fill={headCol} />
          {/* Mõm vịt dẹp */}
          <ellipse cx="26" cy="-11" rx="6" ry="3" fill={beakCol} transform="rotate(6 26 -11)" />
          {/* Mắt */}
          <circle cx="17" cy="-14" r="1.5" fill="#0F172A" />
        </g>
      )}
    </g>
  );
};

// ============================================================================
// 7. THỎ NGỌC HOANG DÃ (Meadow Rabbit)
// ============================================================================

export type RabbitPose = "sit" | "graze" | "hop" | "alert";

export const StudioRabbit: React.FC<{
  x: number;
  y: number;
  scale?: number;
  t: number;
  pose?: RabbitPose;
  facing?: 1 | -1;
  color?: string;
  opacity?: number;
}> = ({
  x,
  y,
  scale = 1.0,
  t,
  pose = "sit",
  facing = 1,
  color = "#F3F4F6", // Thỏ trắng muốt hoặc nâu nhạt
  opacity = 1.0,
}) => {
  const earTwitch = Math.sin(t * 4.2) * 5;
  const chew = Math.abs(Math.sin(t * 6.5)) * 1.5;

  const isGraze = pose === "graze";
  const isAlert = pose === "alert";

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}
      opacity={opacity}
    >
      {/* Đuôi bông tròn xoe */}
      <circle cx="-18" cy="8" r="4.5" fill={color} />

      {/* Đùi sau tròn trịa */}
      <ellipse cx="-8" cy="8" rx="12" ry="9" fill={color} transform="rotate(-15 -8 8)" />
      {/* Bàn chân sau chạm cỏ */}
      <ellipse cx="-6" cy="16" rx="9" ry="3.5" fill={color} />

      {/* Thân mình */}
      <ellipse cx="0" cy="4" rx="14" ry="11" fill={color} />

      {/* Chân trước nhỏ xinh */}
      <ellipse cx="8" cy="15" rx="3" ry="5" fill={color} />

      {/* Đầu thỏ */}
      <g transform={`translate(${isGraze ? 10 : 8} ${isGraze ? 6 : -4})`}>
        <circle cx="0" cy="0" r="7.5" fill={color} />
        {/* Mũi hồng */}
        <circle cx="6" cy={1 + chew} r="1.5" fill="#F472B6" />
        {/* Mắt tròn ngơ ngác */}
        <circle cx="2" cy="-2" r="1.6" fill="#1F2937" />
        <circle cx="2.5" cy="-2.5" r="0.6" fill="#FFFFFF" />

        {/* Đôi tai dài thon */}
        <g transform={`rotate(${isAlert ? -10 + earTwitch : -25 + earTwitch} -2 -6)`}>
          <ellipse cx="-4" cy="-14" rx="3.5" ry="11" fill={color} />
          <ellipse cx="-4" cy="-14" rx="1.8" ry="8" fill="#FBCFE8" opacity="0.8" />
        </g>
        <g transform={`rotate(${isAlert ? 8 - earTwitch : 5 - earTwitch} 2 -6)`}>
          <ellipse cx="2" cy="-13" rx="3.2" ry="10" fill={color} />
          <ellipse cx="2" cy="-13" rx="1.6" ry="7" fill="#FBCFE8" opacity="0.8" />
        </g>
      </g>
    </g>
  );
};

// ============================================================================
// 8. TRÂU NƯỚC THANH BÌNH (Peaceful Water Buffalo)
// ============================================================================

export const StudioWaterBuffalo: React.FC<{
  x: number;
  y: number;
  scale?: number;
  t: number;
  facing?: 1 | -1;
  color?: string;
  hornColor?: string;
  opacity?: number;
}> = ({
  x,
  y,
  scale = 1.0,
  t,
  facing = 1,
  color = "#374151", // Xám đen mộc bản
  hornColor = "#1F2937", // Sừng đen bóng
  opacity = 1.0,
}) => {
  const tailSway = Math.sin(t * 3.5) * 18;
  const breath = Math.sin(t * 1.6) * 1.8;
  const headNod = Math.sin(t * 1.6) * 3;

  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}
      opacity={opacity}
    >
      {/* Đuôi ngoe nguẩy đuổi ruồi */}
      <g transform={`translate(-48 -4) rotate(${tailSway - 15})`}>
        <path d="M 0 0 Q -10 18 -12 36 Q -14 42 -12 48" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Chùm lông chóp đuôi */}
        <path d="M -12 44 Q -16 52 -13 56 Q -9 50 -12 44 Z" fill="#111827" />
      </g>

      {/* Chân sau (xa) */}
      <rect x="-42" y="8" width="11" height="52" rx="4" fill="#1F2937" />
      {/* Móng chân */}
      <rect x="-42" y="56" width="11" height="7" rx="2" fill="#111827" />

      {/* Chân trước (xa) */}
      <rect x="22" y="8" width="10" height="52" rx="4" fill="#1F2937" />
      <rect x="22" y="56" width="10" height="7" rx="2" fill="#111827" />

      {/* Thân mình vạm vỡ, lưng cong tự nhiên */}
      <path
        d={`M -50, 0 
           Q -40, ${-28 + breath} 0, ${-26 + breath} 
           Q 34, ${-24 + breath} 46, -2 
           L 44, 24 Q 0, 32 -44, 24 Z`}
        fill={color}
      />

      {/* Chân sau (gần) */}
      <rect x="-34" y="10" width="12" height="54" rx="4" fill={color} />
      <rect x="-34" y="60" width="12" height="7" rx="2" fill="#111827" />

      {/* Chân trước (gần) */}
      <rect x="30" y="10" width="11" height="54" rx="4" fill={color} />
      <rect x="30" y="60" width="11" height="7" rx="2" fill="#111827" />

      {/* Đầu & Cổ trâu */}
      <g transform={`translate(44, ${-6 + headNod})`}>
        {/* Cổ lực lưỡng */}
        <path d="M -8 -16 L 16 -12 L 20 14 L -8 18 Z" fill={color} />

        {/* Đầu trâu */}
        <ellipse cx="22" cy="0" rx="18" ry="13" fill={color} transform="rotate(15 22 0)" />
        {/* Mõm rộng & Lỗ mũi */}
        <ellipse cx="36" cy="6" rx="9" ry="7" fill="#4B5563" />
        <circle cx="38" cy="5" r="2" fill="#1F2937" />

        {/* Mắt hiền hòa */}
        <ellipse cx="20" cy="-4" rx="3.5" ry="2" fill="#111827" />
        <circle cx="21" cy="-4.5" r="0.8" fill="#F9FAFB" />

        {/* Tai trâu to cụp ngang */}
        <ellipse cx="10" cy="2" rx="10" ry="5" fill={color} transform="rotate(25 10 2)" />

        {/* CẶP SỪNG CÁNH CUNG CONG VÚT ĐẶC TRƯNG CỦA TRÂU VIỆT */}
        {/* Sừng sau */}
        <path
          d="M 12 -12 Q -8 -26 -16 -46 Q -2 -34 16 -16 Z"
          fill="#1F2937"
        />
        {/* Sừng trước cong vút kiêu hãnh */}
        <path
          d="M 18 -10 Q 0 -28 -12 -52 Q 4 -40 24 -14 Z"
          fill={hornColor}
        />
        <path
          d="M -12 -52 Q 2 -36 20 -16"
          stroke="#D1D5DB"
          strokeWidth="1.2"
          fill="none"
          opacity="0.4"
        />
      </g>
    </g>
  );
};

