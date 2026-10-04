// "Hẹn Ngày Nở Hoa" (HB-003) — Nghệ thuật cắt giấy đa lớp (Multi-plane Layered Papercraft & Gouache)
// Vẽ hoàn toàn bằng code (React + SVG toán học + Remotion).
// 5 nhân vật mang 5 nhạc cụ (Piano, Cello, French Horn, Violin, Harp) lần lượt xuất hiện và cùng biểu diễn hồi sinh khu vườn.
import React from "react";
import type { SceneProps } from "./Scenes";
import { StudioCat, StudioDog, StudioDeer, StudioBird } from "../library";

const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// Capsule limb helper for articulated character anatomy
const capsuleLimb = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w1: number,
  w2: number,
  fill: string,
  stroke = "rgba(0,0,0,0.18)",
  strokeW = 1
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const p1x = x1 + nx * (w1 / 2);
  const p1y = y1 + ny * (w1 / 2);
  const p2x = x2 + nx * (w2 / 2);
  const p2y = y2 + ny * (w2 / 2);
  const p3x = x2 - nx * (w2 / 2);
  const p3y = y2 - ny * (w2 / 2);
  const p4x = x1 - nx * (w1 / 2);
  const p4y = y1 - ny * (w1 / 2);
  return (
    <g>
      <polygon points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y} ${p4x},${p4y}`} fill={fill} stroke={stroke} strokeWidth={strokeW} />
      <circle cx={x1} cy={y1} r={w1 / 2} fill={fill} />
      <circle cx={x2} cy={y2} r={w2 / 2} fill={fill} />
    </g>
  );
};


// Màu sắc nhận diện của 5 nhân vật & phong cảnh
export const PALETTE = {
  cartographer: "#E8C15A", // Vàng nhạt (Piano)
  gardener:     "#9E6B42", // Nâu đất (Cello)
  builder:      "#D44A3A", // Đỏ son (Horn)
  artist:       "#4A7BB0", // Xanh lam (Violin)
  creator:      "#9D72B8", // Tím nhạt (Harp)
  paperBase:    "#F2EDE2", // Nền giấy thô
  paperShadow:  "rgba(15, 20, 25, 0.42)",
  ivyGreen:     "#4D7349",
  ivyDark:      "#2D452B",
  bloomColors:  ["#E86A7A", "#F4A261", "#E9C46A", "#2A9D8F", "#A267AC", "#E76F51", "#FFD166"],
};

// ------------------------------------------------------------------ Bộ lọc cắt giấy & Gradients bầu trời
export const PaperFilters: React.FC = () => (
  <defs>
    {/* Đổ bóng giữa các lớp cắt giấy */}
    <filter id="paper-drop" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="3" dy="7" stdDeviation="5" floodColor={PALETTE.paperShadow} floodOpacity="0.38" />
    </filter>
    <filter id="paper-drop-deep" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="5" dy="14" stdDeviation="10" floodColor={PALETTE.paperShadow} floodOpacity="0.5" />
    </filter>
    <filter id="paper-bevel">
      <feDropShadow dx="0" dy="1.5" stdDeviation="0.8" floodColor="#FFFFFF" floodOpacity="0.6" />
    </filter>

    {/* 1. Bình minh sớm (0s - 32s) - Hồng cam sương mai êm dịu */}
    <linearGradient id="sky-dawn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#4A7596" />
      <stop offset="30%" stopColor="#789DB5" />
      <stop offset="60%" stopColor="#EAB28C" />
      <stop offset="82%" stopColor="#E5907E" />
      <stop offset="100%" stopColor="#D4776D" />
    </linearGradient>

    {/* 2. Sáng sớm nắng lên (32s - 75s) - Bắt đầu sáng dần, trời xanh mây trắng nắng ấm */}
    <linearGradient id="sky-morning" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#3E8DC5" />
      <stop offset="35%" stopColor="#6DB4DE" />
      <stop offset="70%" stopColor="#F5D0A1" />
      <stop offset="88%" stopColor="#F7B58D" />
      <stop offset="100%" stopColor="#ECA38A" />
    </linearGradient>

    {/* 3. Ban ngày chan hòa rực rỡ nhất (75s - 125s & Finale 155s - 175s) - Bầu trời xanh biếc, ngập tràn ánh sáng */}
    <linearGradient id="sky-midday" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#258CD6" />
      <stop offset="38%" stopColor="#5BBCE8" />
      <stop offset="72%" stopColor="#A2E3F7" />
      <stop offset="90%" stopColor="#FFF1BE" />
      <stop offset="100%" stopColor="#FFE099" />
    </linearGradient>

    {/* 4. Giông bão kịch tính Timpani (125s - 155s) */}
    <linearGradient id="sky-storm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1E2834" />
      <stop offset="45%" stopColor="#353D4C" />
      <stop offset="80%" stopColor="#484254" />
      <stop offset="100%" stopColor="#2F2D3A" />
    </linearGradient>

    {/* 5. Chiều tà vàng óng / Golden Hour (175s - 188s) */}
    <linearGradient id="sky-golden" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#3A5384" />
      <stop offset="28%" stopColor="#755B8A" />
      <stop offset="55%" stopColor="#C96860" />
      <stop offset="78%" stopColor="#EE8F4E" />
      <stop offset="100%" stopColor="#FDB851" />
    </linearGradient>

    {/* 6. Hoàng hôn rực rỡ tím đỏ lộng lẫy / Cảnh kết Outro (188s - 203s) */}
    <linearGradient id="sky-sunset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1F1A3A" />
      <stop offset="25%" stopColor="#482552" />
      <stop offset="50%" stopColor="#8C2E56" />
      <stop offset="72%" stopColor="#D84E43" />
      <stop offset="88%" stopColor="#F17E3A" />
      <stop offset="100%" stopColor="#FBB954" />
    </linearGradient>

    {/* Vầng hào quang mặt trời buổi sớm */}
    <radialGradient id="sun-glow-dawn" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFF9EE" stopOpacity="0.95" />
      <stop offset="35%" stopColor="#FDE1A2" stopOpacity="0.65" />
      <stop offset="70%" stopColor="#F7A581" stopOpacity="0.25" />
      <stop offset="100%" stopColor="#F7A581" stopOpacity="0" />
    </radialGradient>

    {/* Mặt trời ban trưa chói lọi */}
    <radialGradient id="sun-glow-bright" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
      <stop offset="25%" stopColor="#FFFEE2" stopOpacity="0.9" />
      <stop offset="55%" stopColor="#FFEA88" stopOpacity="0.6" />
      <stop offset="85%" stopColor="#FFC857" stopOpacity="0.25" />
      <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
    </radialGradient>

    {/* Mặt trời hoàng hôn đỏ rực */}
    <radialGradient id="sun-glow-sunset" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFF2D6" stopOpacity="1" />
      <stop offset="30%" stopColor="#FFA048" stopOpacity="0.85" />
      <stop offset="65%" stopColor="#E64A19" stopOpacity="0.45" />
      <stop offset="100%" stopColor="#C2185B" stopOpacity="0" />
    </radialGradient>

    {/* Luồng nắng xiên (God rays / Sunbeams) rọi từ mặt trời xuống khu vườn */}
    <linearGradient id="sunbeam-light" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0.55" />
      <stop offset="50%" stopColor="#FFEAA7" stopOpacity="0.22" />
      <stop offset="100%" stopColor="#FFF4D0" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="sunbeam-golden" x1="0" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stopColor="#FFAA5B" stopOpacity="0.45" />
      <stop offset="60%" stopColor="#FF7E47" stopOpacity="0.18" />
      <stop offset="100%" stopColor="#D44A3A" stopOpacity="0" />
    </linearGradient>
  </defs>
);

// ------------------------------------------------------------------ Luồng nắng xiên rọi từ mặt trời (Volumetric Sunbeams / God rays)
export const SunBeams: React.FC<{
  sunX: number;
  sunY: number;
  t: number;
  stormWeight: number;
}> = ({ sunX, sunY, t, stormWeight }) => {
  if (stormWeight >= 0.8) return null; // Ẩn hoàn toàn trong tâm bão

  // Nắng xiên đổi màu và góc theo giờ trong ngày
  const isSunset = t >= 176.0;
  const isMorning = t < 52.5;
  const beamGrad = isSunset ? "url(#sunbeam-golden)" : "url(#sunbeam-light)";

  // Độ sáng của luồng nắng tăng dần khi ngày sáng lên, rực rỡ nhất buổi trưa và sau mưa
  let beamAlpha = 0.22;
  if (isMorning) {
    beamAlpha = lerp(0.18, 0.32, t / 52.5);
  } else if (t < 122.6) {
    beamAlpha = lerp(0.32, 0.48, (t - 52.5) / 70.1);
  } else if (t < 153.5) {
    beamAlpha = 0.08;
  } else if (t < 176.0) {
    beamAlpha = 0.52; // Sau mưa bừng sáng lộng lẫy
  } else {
    beamAlpha = lerp(0.45, 0.20, clamp((t - 176.0) / 26.9));
  }
  beamAlpha *= (1 - stormWeight * 0.95);

  // Dao động nhẹ của luồng nắng như ánh bụi vàng trong gió
  const shimmer = Math.sin(t * 1.5) * 8;

  // Hướng góc chiếu: xiên từ mặt trời sunX, sunY xuống tiền cảnh khu vườn (y=1080)
  // Các nan quạt chùm tia nắng (5 vệt sáng hình quạt)
  const angles = [-38, -22, -6, 12, 28];

  return (
    <g opacity={beamAlpha} style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      {angles.map((angDeg, idx) => {
        const rad = ((angDeg + (sunX > 1000 ? -25 : 15)) * Math.PI) / 180;
        const dx = Math.sin(rad) * 1150 + shimmer;
        const beamW1 = 30 + idx * 8;
        const beamW2 = 140 + idx * 30;

        return (
          <polygon
            key={idx}
            points={`
              ${sunX - beamW1},${sunY} 
              ${sunX + beamW1},${sunY} 
              ${sunX + dx + beamW2},1080 
              ${sunX + dx - beamW2},1080
            `}
            fill={beamGrad}
          />
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ Mây cắt giấy bồng bềnh chuyển động (Animated Paper Clouds)
export const PaperClouds: React.FC<{ t: number }> = ({ t }) => {
  const clouds = [
    { x0: 150,  y: 120, scale: 1.15, speed: 28,  opacity: 0.92 },
    { x0: 680,  y: 80,  scale: 0.85, speed: 18,  opacity: 0.85 },
    { x0: 1200, y: 160, scale: 1.3,  speed: 34,  opacity: 0.95 },
    { x0: 1680, y: 100, scale: 0.95, speed: 22,  opacity: 0.88 },
  ];

  return (
    <g filter="url(#paper-drop)">
      {clouds.map((c, i) => {
        const curX = ((c.x0 + t * c.speed) % 2300) - 200;
        return (
          <g key={i} transform={`translate(${curX}, ${c.y}) scale(${c.scale})`} opacity={c.opacity}>
            <path
              d="M 0, 40 Q 25, 0 65, 15 Q 110, -25 160, 10 Q 210, -10 240, 40 Q 260, 65 240, 85 L 10, 85 Q -20, 65 0, 40 Z"
              fill="#F5EFE6"
              filter="url(#paper-bevel)"
            />
            <path
              d="M 20, 45 Q 45, 18 80, 30 Q 120, -5 165, 25 Q 195, 15 220, 50 L 30, 50 Z"
              fill="#FFFFFF"
              opacity="0.8"
            />
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ Đàn chim đa sắc kéo đến theo giai điệu (Colorful Flock of Birds)
export const PaperBirds: React.FC<{ t: number }> = ({ t }) => {
  // Danh sách 18 chú chim đa sắc bay liệng thành đàn lượn sóng
  const allBirds = [
    // Đàn 1 (Xuất hiện từ đầu - Piano): 3 chú chim én
    { x0: 220,  y0: 160, s: 1.15, speed: 75, flap: 8.5, color: "#F4D03F", group: 0 }, // Hoàng yến vàng
    { x0: 380,  y0: 210, s: 0.95, speed: 68, flap: 9.0, color: "#48C9B0", group: 0 }, // Lam ngọc
    { x0: 520,  y0: 175, s: 1.05, speed: 72, flap: 8.2, color: "#F1948A", group: 0 }, // Hồng đào

    // Đàn 2 (Cello 28s kéo đến): thêm 3 chú chim rực rỡ
    { x0: 680,  y0: 140, s: 1.25, speed: 80, flap: 7.8, color: "#BB8FCE", group: 1 }, // Tím biếc
    { x0: 840,  y0: 225, s: 1.00, speed: 70, flap: 8.8, color: "#5DADE2", group: 1 }, // Lam thanh
    { x0: 980,  y0: 165, s: 1.10, speed: 74, flap: 8.4, color: "#F39C12", group: 1 }, // Cam hổ phách

    // Đàn 3 (Horn 52.5s kéo đến): thêm 3 chú chim sải cánh rộng
    { x0: 1150, y0: 130, s: 1.30, speed: 82, flap: 7.5, color: "#E74C3C", group: 2 }, // Đỏ son
    { x0: 1300, y0: 195, s: 1.10, speed: 72, flap: 8.6, color: "#52BE80", group: 2 }, // Xanh ngọc
    { x0: 1460, y0: 155, s: 1.20, speed: 76, flap: 8.0, color: "#F4D03F", group: 2 }, // Hoàng yến

    // Đàn 4 (Violin 72s kéo đến): thêm 3 chú chim lượn nhịp nhàng
    { x0: 1620, y0: 230, s: 1.05, speed: 68, flap: 9.2, color: "#AF7AC5", group: 3 }, // Tím hoa cà
    { x0: 1780, y0: 145, s: 1.25, speed: 78, flap: 8.1, color: "#3498DB", group: 3 }, // Xanh dương
    { x0: 1940, y0: 180, s: 1.15, speed: 74, flap: 8.7, color: "#E67E22", group: 3 }, // Cam rực

    // Đàn 5 (Harp 104.5s kéo đến): thêm đàn chim thiên đường
    { x0: 320,  y0: 120, s: 1.35, speed: 85, flap: 7.6, color: "#EC7063", group: 4 }, // Đỏ hồng
    { x0: 740,  y0: 250, s: 1.15, speed: 70, flap: 8.5, color: "#48C9B0", group: 4 }, // Xanh ngọc
    { x0: 1220, y0: 115, s: 1.25, speed: 80, flap: 7.9, color: "#F7DC6F", group: 4 }, // Vàng chanh

    // Đàn 6 (Finale sau mưa 153.5s): chim chóc bay rợp bầu trời mừng ngày nở hoa
    { x0: 480,  y0: 260, s: 1.40, speed: 88, flap: 7.4, color: "#A569BD", group: 5 }, // Tím hoàng gia
    { x0: 1040, y0: 270, s: 1.30, speed: 82, flap: 8.2, color: "#E74C3C", group: 5 }, // Đỏ thắm
    { x0: 1580, y0: 110, s: 1.45, speed: 90, flap: 7.2, color: "#F39C12", group: 5 }, // Cam vàng
  ];

  // Kích hoạt từng nhóm chim theo mốc âm nhạc cụ thể
  const activeBirds = allBirds.filter((b) => {
    if (b.group === 0) return true; // Luôn có từ đầu (3 con)
    if (b.group === 1) return t >= 26; // Cello đến -> 6 con
    if (b.group === 2) return t >= 50; // Horn đến -> 9 con
    if (b.group === 3) return t >= 70; // Violin đến -> 12 con
    if (b.group === 4) return t >= 102; // Harp đến -> 15 con
    if (b.group === 5) return t >= 153; // Finale -> 18 con rợp trời
    return false;
  });

  return (
    <g>
      {activeBirds.map((b, i) => {
        const bx = ((b.x0 + t * b.speed) % 2500) - 200;
        const by = b.y0 + Math.sin(t * 1.6 + i * 0.7) * 16;
        const wing = Math.sin(t * b.flap) * 11;
        const sc = b.s;

        return (
          <g key={i} transform={`translate(${bx}, ${by}) scale(${sc})`} filter="url(#paper-bevel)">
            {/* Thân chim thủ công cắt giấy */}
            <path
              d={`M 0, 0 
                 Q ${-14 * sc}, ${(-9 + wing) * sc} ${-24 * sc}, ${wing * sc} 
                 Q ${-9 * sc}, ${3 * sc} 0, 0 
                 Q ${9 * sc}, ${3 * sc} ${24 * sc}, ${wing * sc} 
                 Q ${14 * sc}, ${(-9 + wing) * sc} 0, 0 Z`}
              fill={b.color}
              stroke="rgba(0,0,0,0.22)"
              strokeWidth="0.8"
            />
            {/* Đốm mắt và đuôi chim */}
            <circle cx="0" cy="-2" r="1.4" fill="#FFFFFF" />
            <polygon points={`0,2 ${-3 * sc},${8 * sc} ${3 * sc},${8 * sc}`} fill={b.color} opacity="0.85" />
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ Đàn bướm cắt giấy dập dờn quanh hoa và cây (Paper Butterflies)
export const PaperButterflies: React.FC<{ t: number }> = ({ t }) => {
  // Danh sách các chú bướm với màu sắc pastel/gouache cắt giấy tinh tế, cánh to bản rõ nét
  const butterflies = [
    // 1. Chú bướm cam đào gần hoa bên trái piano (y ~ 730)
    { x0: 670,  y0: 730, ampX: 75, ampY: 35, speed: 1.8,  flapRate: 14, colorTop: "#F4A261", colorBottom: "#E76F51", scale: 1.65, minT: 0 },
    // 2. Chú bướm vàng mơ quanh xích đu & tảng đá (y ~ 710)
    { x0: 340,  y0: 710, ampX: 85, ampY: 40, speed: 2.1,  flapRate: 16, colorTop: "#F9C74F", colorBottom: "#F8961E", scale: 1.55, minT: 15 },
    // 3. Chú bướm lam ngọc quanh Cello & luống hoa (y ~ 750)
    { x0: 560,  y0: 750, ampX: 65, ampY: 30, speed: 1.9,  flapRate: 15, colorTop: "#48CAE4", colorBottom: "#0096C7", scale: 1.50, minT: 28 },
    // 4. Chú bướm tím hoa cà quanh người thổi Horn (y ~ 730)
    { x0: 1220, y0: 730, ampX: 70, ampY: 35, speed: 2.2,  flapRate: 17, colorTop: "#C77DFF", colorBottom: "#9D4EDD", scale: 1.60, minT: 52 },
    // 5. Chú bướm hồng phấn quanh Violin & xích đu (y ~ 760)
    { x0: 440,  y0: 760, ampX: 60, ampY: 28, speed: 1.7,  flapRate: 14, colorTop: "#F72585", colorBottom: "#B5179E", scale: 1.45, minT: 72 },
    // 6. Chú bướm cánh xanh ngọc bích quanh đàn Harp & ghế gỗ (y ~ 720)
    { x0: 1540, y0: 720, ampX: 80, ampY: 38, speed: 2.0,  flapRate: 15, colorTop: "#52B788", colorBottom: "#2D6A4F", scale: 1.65, minT: 104 },
    // 7 & 8. Hai chú bướm rực rỡ lượn đôi trên thảm hoa ở đoạn Finale (hai bên rìa khu vườn x=220 và x=1700)
    { x0: 220,  y0: 720, ampX: 85, ampY: 42, speed: 2.3, flapRate: 18, colorTop: "#F4A261", colorBottom: "#E63946", scale: 1.70, minT: 153 },
    { x0: 1680, y0: 710, ampX: 85, ampY: 40, speed: 2.0, flapRate: 16, colorTop: "#90E0EF", colorBottom: "#0077B6", scale: 1.65, minT: 153 },
  ];

  const activeFlies = butterflies.filter((b) => t >= b.minT);

  return (
    <g filter="url(#paper-drop)">
      {activeFlies.map((b, i) => {
        // Quỹ đạo bay uốn lượn hình số 8 / elip tự nhiên quanh bụi hoa
        const bx = b.x0 + Math.sin(t * b.speed + i * 1.5) * b.ampX;
        const by = b.y0 + Math.cos(t * b.speed * 1.3 + i) * b.ampY;
        // Góc nghiêng thân bướm theo hướng bay
        const tilt = Math.cos(t * b.speed + i * 1.5) * 18;
        // Nhịp đập cánh dập dờn (phồng - xẹp theo tỉ lệ rx của ellipse)
        const wingFlap = Math.abs(Math.sin(t * b.flapRate + i));
        const wingSpan = lerp(0.18, 1.0, wingFlap);

        return (
          <g key={i} transform={`translate(${bx}, ${by}) rotate(${tilt}) scale(${b.scale})`} filter="url(#paper-bevel)">
            {/* Thân bướm thon mảnh cắt giấy */}
            <line x1="0" y1="-10" x2="0" y2="10" stroke="#1F1A17" strokeWidth="2.5" strokeLinecap="round" />
            {/* Hai râu bướm uốn lượn có đầu tròn */}
            <path d="M 0, -10 Q -5, -17 -8, -19" stroke="#1F1A17" strokeWidth="1.2" fill="none" />
            <path d="M 0, -10 Q 5, -17 8, -19" stroke="#1F1A17" strokeWidth="1.2" fill="none" />
            <circle cx="-8" cy="-19" r="1.1" fill="#1F1A17" />
            <circle cx="8" cy="-19" r="1.1" fill="#1F1A17" />

            {/* Cánh trái (trên & dưới) đập nhịp nhàng */}
            <g transform={`scale(${wingSpan}, 1)`}>
              {/* Cánh trên trái lớn bản */}
              <ellipse cx="-12" cy="-6" rx="12" ry="9" fill={b.colorTop} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              {/* Hoa văn cắt giấy lót bên trong cánh */}
              <ellipse cx="-11" cy="-6" rx="7" ry="4.5" fill="#FFFDF0" opacity="0.75" />
              <circle cx="-14" cy="-7" r="2" fill={b.colorBottom} opacity="0.85" />
              {/* Cánh dưới trái */}
              <ellipse cx="-8" cy="6" rx="8.5" ry="6.5" fill={b.colorBottom} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              <ellipse cx="-7" cy="6" rx="4.5" ry="3" fill="#FFFDF0" opacity="0.65" />
            </g>

            {/* Cánh phải (trên & dưới) đập nhịp nhàng */}
            <g transform={`scale(${wingSpan}, 1)`}>
              {/* Cánh trên phải lớn bản */}
              <ellipse cx="12" cy="-6" rx="12" ry="9" fill={b.colorTop} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              {/* Hoa văn cắt giấy lót bên trong cánh */}
              <ellipse cx="11" cy="-6" rx="7" ry="4.5" fill="#FFFDF0" opacity="0.75" />
              <circle cx="14" cy="-7" r="2" fill={b.colorBottom} opacity="0.85" />
              {/* Cánh dưới phải */}
              <ellipse cx="8" cy="6" rx="8.5" ry="6.5" fill={b.colorBottom} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              <ellipse cx="7" cy="6" rx="4.5" ry="3" fill="#FFFDF0" opacity="0.65" />
            </g>
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ Dãy núi cắt giấy đa tầng (3-Layered Mountain Ranges)
export const PaperMountains: React.FC<{ t: number }> = () => {
  return (
    <g>
      {/* TẦNG 1: DÃY NÚI CAO XA XÔI */}
      <path
        d="M 0, 860 L 0, 520 
           L 180, 440 L 340, 510 L 510, 390 L 720, 530 
           L 920, 410 L 1120, 520 L 1340, 380 L 1560, 500 
           L 1740, 430 L 1920, 490 L 1920, 860 Z"
        fill="#6E849E"
        opacity="0.75"
        filter="url(#paper-drop)"
      />
      <path
        d="M 510, 390 L 480, 420 L 530, 425 Z M 920, 410 L 895, 435 L 945, 440 Z M 1340, 380 L 1310, 415 L 1365, 420 Z"
        fill="#F5EFE6"
        opacity="0.8"
      />

      {/* TẦNG 2: DÃY NÚI TRUNG */}
      <path
        d="M 0, 860 L 0, 590 
           Q 240, 490 480, 580 
           Q 780, 460 1060, 590 
           Q 1380, 480 1680, 610 
           L 1920, 570 L 1920, 860 Z"
        fill="#4A7067"
        opacity="0.88"
        filter="url(#paper-drop)"
      />

      {/* TẦNG 3: ĐỒI THÔNG GẦN */}
      <path
        d="M 0, 860 L 0, 690 
           Q 360, 610 740, 680 
           Q 1150, 600 1520, 690 
           L 1920, 660 L 1920, 860 Z"
        fill="#39533B"
        filter="url(#paper-drop)"
      />
      <g fill="#273C29" opacity="0.9">
        {[80, 160, 240, 450, 520, 850, 930, 1020, 1320, 1400, 1680, 1780].map((px, i) => (
          <polygon key={i} points={`${px},675 ${px - 14},710 ${px + 14},710`} />
        ))}
      </g>
    </g>
  );
};

// ==================================================================
// CÁC NHẠC CỤ & NGHỆ SĨ BIỂU DIỄN (INSTRUMENTS & PERFORMERS)
// ==================================================================

// 1. PIANO & NGƯỜI VẼ BẢN ĐỒ (Ngồi đánh piano say mê từ giây đầu tiên)
export const GrandPianoAndPianist: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const headBob = Math.sin(t * 5.2) * 4;
  const handL = Math.sin(t * 8.5) * 5;
  const handR = Math.cos(t * 9.2) * 6;

  return (
    <g transform={`translate(${x}, ${y})`} filter="url(#paper-drop)">
      {/* CÂY ĐÀN GRAND PIANO CẮT GIẤY CỔ ĐIỂN */}
      <g>
        {/* Thùng đàn đen mun sang trọng */}
        <path
          d="M -30, -50 L 95, -50 Q 115, -95 160, -95 Q 210, -95 240, -45 L 240, 0 L -30, 0 Z"
          fill="#1C1B1F"
          filter="url(#paper-bevel)"
        />
        {/* Nắp đàn mở xiên đón ánh nắng */}
        <path
          d="M -25, -50 L 90, -130 L 220, -125 L 90, -50 Z"
          fill="#2B2930"
          filter="url(#paper-bevel)"
        />
        {/* Thanh chống nắp đàn bằng đồng */}
        <line x1="80" y1="-50" x2="110" y2="-120" stroke="#D4A373" strokeWidth="3" />

        {/* Bàn phím màu ngà trắng và phím đen */}
        <rect x="-35" y="-12" width="65" height="14" fill="#F8F4EA" rx="1.5" stroke="#222" strokeWidth="1" />
        {/* Phím đen */}
        {[-28, -20, -12, -4, 4, 12, 20].map((kx, i) => (
          <rect key={i} x={kx} y="-12" width="4.5" height="8" fill="#1A1A1E" />
        ))}

        {/* Chân đàn Piano */}
        <rect x="-22" y="0" width="8" height="42" fill="#1C1B1F" />
        <rect x="75" y="0" width="8" height="42" fill="#1C1B1F" />
        <rect x="220" y="0" width="8" height="42" fill="#1C1B1F" />
        {/* Pedal bàn đạp */}
        <rect x="80" y="32" width="14" height="6" fill="#D4A373" />

        {/* Ghế ngồi piano */}
        <rect x="-95" y="6" width="38" height="9" rx="2" fill="#3D291D" />
        <line x1="-90" y1="15" x2="-90" y2="42" stroke="#2B1D14" strokeWidth="4" />
        <line x1="-63" y1="15" x2="-63" y2="42" stroke="#2B1D14" strokeWidth="4" />

        {/* Cuốn sổ phác thảo / Bản nhạc trên giá */}
        <g transform="translate(15, -60) rotate(-10)">
          <rect x="-10" y="-14" width="20" height="26" rx="2" fill="#FBF0CC" stroke="#333" strokeWidth="1" />
          <line x1="-7" y1="-8" x2="6" y2="-8" stroke="#777" strokeWidth="1" />
          <line x1="-7" y1="-3" x2="4" y2="-3" stroke="#777" strokeWidth="1" />
          <line x1="-7" y1="2" x2="5" y2="2" stroke="#777" strokeWidth="1" />
        </g>

        {/* 🐱 Mèo trắng lười cuộn tròn ngủ trên nắp đàn piano đón nắng */}
        <StudioCat x={168} y={-96} scale={0.76} t={t} pose="sleep" color="#F8FAFC" />
      </g>

      {/* NGHỆ SĨ PIANO (Người vẽ bản đồ) NGỒI BIỂU DIỄN - CHUẨN GIẢI PHẪU STUDIO */}
      <g transform={`translate(-76, 6)`}>
        {/* Vạt áo khoác rủ sau ghế */}
        <path d="M -14 -12 Q -22 6 -18 24 L -10 24 Q -12 8 -6 -12 Z" fill="#1E293B" />

        {/* Đùi & Cẳng chân ngồi gập gối - Capsule limbs */}
        {capsuleLimb(-4, 0, 16, 16, 12, 10, "#1E293B")}
        {capsuleLimb(16, 16, 18, 35, 10, 8, "#1E293B")}

        {/* Giày da có đế đạp pedal */}
        <polygon points="12,34 26,35 28,40 12,40" fill="#0F172A" />
        <line x1="12" y1="40" x2="28" y2="40" stroke="#78350F" strokeWidth="1.5" />

        {/* Thân người áo vàng nhạt nghiêng về phía phím đàn */}
        <path
          d="M -16, -50 Q -12, -25 -8, 0 L 14, 0 Q 16, -25 12, -50 Z"
          fill="#1E293B"
        />
        {/* Áo gile màu Cartographer */}
        <path
          d="M -12, -48 Q 2, -40 10, -48 L 8, -18 Q 0, -12 -8, -18 Z"
          fill={PALETTE.cartographer}
          opacity="0.95"
        />
        {/* Cổ áo sơ mi trắng ngà */}
        <polygon points="-4,-48 0,-40 4,-48" fill="#FDF6EE" />

        {/* Cổ áo hình bóng nghệ thuật */}
        <rect x="-1" y="-56" width="6" height="8" rx="2" fill="#0F172A" />

        {/* Đầu & Khuôn mặt hình bóng điện ảnh Senore (Chuẩn HB-001 & HB-002) */}
        <g transform={`translate(2, ${-66 + headBob * 0.6})`}>
          <path
            d="M -2 -12 C 3 -12 7 -9 8 -5 C 8.5 -3 11 -1.5 11.5 0 C 10.5 1 9.5 1.5 10 3 C 10.5 4.5 10.5 5.5 9 7 C 6.5 8.5 1.5 9 -2 8 C -6.5 7 -10 1.5 -10 -3 C -10 -8 -6.5 -12 -2 -12 Z"
            fill="#0F172A"
          />
          {/* Viền sáng điện ảnh Rim Light */}
          <path
            d="M -2 -12 C 3 -12 7 -9 8 -5 C 8.5 -3 11 -1.5 11.5 0 M -2 -12 C -6.5 -12 -10 -8 -10 -3 C -10 2 -7 6 -3 7"
            fill="none"
            stroke="rgba(255,225,185,0.75)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>

        {/* Cánh tay lướt phím đàn có cổ tay & bàn tay màu da */}
        <g>
          {/* Tay trái */}
          {capsuleLimb(6, -34, 22, -22 + handL * 0.5, 9, 8, "#1E293B")}
          {capsuleLimb(22, -22 + handL * 0.5, 36, -16 + handL, 7.5, 6, "#1E293B")}
          <ellipse cx={38} cy={-16 + handL} rx={4} ry={2.5} fill="#E29578" />

          {/* Tay phải */}
          {capsuleLimb(8, -32, 26, -24 + handR * 0.5, 9, 8, "#1E293B")}
          {capsuleLimb(26, -24 + handR * 0.5, 42, -17 + handR, 7.5, 6, "#1E293B")}
          <ellipse cx={44} cy={-17 + handR} rx={4} ry={2.5} fill="#E29578" />
        </g>
      </g>
    </g>
  );
};

// 2. CELLO & NGƯỜI CHĂM CÂY (Xuất hiện giây 32)
export const CelloAndPlayer: React.FC<{ x: number; y: number; isWalking: boolean; t: number }> = ({
  x,
  y,
  isWalking,
  t,
}) => {
  const stepCycle = isWalking ? Math.sin(t * 7) : 0;
  const bob = isWalking ? Math.abs(Math.cos(t * 7)) * 4 : Math.sin(t * 2.5) * 1.5;
  const bowStroke = !isWalking ? Math.sin(t * 3.6) * 18 : 0;
  const sway = !isWalking ? Math.sin(t * 3.6) * 3 : 0;

  return (
    <g transform={`translate(${x}, ${y - bob})`} filter="url(#paper-drop)">
      {/* Người chăm cây (Sắc nâu đất - Chuẩn giải phẫu Studio) */}
      <g transform={`translate(${!isWalking ? -12 : 0}, 0)`}>
        {/* Chân & Giày đi bộ hoặc đứng vững */}
        {isWalking ? (
          <g>
            {/* Chân sau */}
            {capsuleLimb(-4, 0, -4 - stepCycle * 10, 16, 11, 9, "#1E293B")}
            {capsuleLimb(-4 - stepCycle * 10, 16, -6 - stepCycle * 16, 32, 9, 7.5, "#1E293B")}
            <polygon points={`${-14 - stepCycle * 16},30 ${-2 - stepCycle * 16},31 ${-1 - stepCycle * 16},36 ${-14 - stepCycle * 16},36`} fill="#0F172A" />

            {/* Chân trước */}
            {capsuleLimb(4, 0, 4 + stepCycle * 10, 16, 11, 9, "#1E293B")}
            {capsuleLimb(4 + stepCycle * 10, 16, 6 + stepCycle * 16, 32, 9, 7.5, "#1E293B")}
            <polygon points={`${-2 + stepCycle * 16},30 ${10 + stepCycle * 16},31 ${11 + stepCycle * 16},36 ${-2 + stepCycle * 16},36`} fill="#0F172A" />
          </g>
        ) : (
          <g>
            {/* Thế đứng chơi Cello chân mở vững vàng */}
            {capsuleLimb(-6, 0, -8, 16, 11, 9, "#1E293B")}
            {capsuleLimb(-8, 16, -10, 32, 9, 7.5, "#1E293B")}
            <polygon points="-18,30 -6,31 -5,36 -18,36" fill="#0F172A" />

            {capsuleLimb(6, 0, 8, 16, 11, 9, "#1E293B")}
            {capsuleLimb(8, 16, 8, 32, 9, 7.5, "#1E293B")}
            <polygon points="0,30 12,31 13,36 0,36" fill="#0F172A" />
          </g>
        )}

        {/* Áo khoác & Yếm làm vườn màu nâu đất */}
        <path d="M -18, -60 Q -20, -25 -22, 0 L 22, 0 Q 20, -25 18, -60 Z" fill="#1E293B" />
        <path d="M -16, -58 Q 0, -50 16, -58 L 13, -26 Q 0, -20 -13, -26 Z" fill={PALETTE.gardener} opacity="0.95" />
        {/* Khăn quàng cổ màu rêu đất */}
        <ellipse cx="0" cy="-60" rx="9" ry="4" fill="#3D5A38" />

        {/* Cổ áo hình bóng nghệ thuật */}
        <rect x="-1" y="-68" width="5" height="9" rx="2" fill="#0F172A" />
        <g transform="translate(0, -78)">
          {/* Đầu & Khuôn mặt hình bóng điện ảnh Senore (Chuẩn HB-001 & HB-002) */}
          <path
            d="M -2 -12 C 3 -12 7 -9 8 -5 C 8.5 -3 11 -1.5 11.5 0 C 10.5 1 9.5 1.5 10 3 C 10.5 4.5 10.5 5.5 9 7 C 6.5 8.5 1.5 9 -2 8 C -6.5 7 -10 1.5 -10 -3 C -10 -8 -6.5 -12 -2 -12 Z"
            fill="#0F172A"
          />
          {/* Viền sáng điện ảnh Rim Light */}
          <path
            d="M -2 -12 C 3 -12 7 -9 8 -5 C 8.5 -3 11 -1.5 11.5 0 M -2 -12 C -6.5 -12 -10 -8 -10 -3 C -10 2 -7 6 -3 7"
            fill="none"
            stroke="rgba(255,225,185,0.75)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>

        {/* Tay kéo vĩ Cello */}
        {!isWalking && (
          <g>
            {/* Tay trái giữ cần đàn */}
            {capsuleLimb(8, -42, 20, -42, 8, 7, "#1E293B")}
            {capsuleLimb(20, -42, 24, -50, 7, 6, "#1E293B")}
            <ellipse cx="25" cy="-51" rx="3.5" ry="3" fill="#E29578" />

            {/* Tay phải cầm cây vĩ kéo */}
            {capsuleLimb(-8, -40, -14, -26, 8, 7, "#1E293B")}
            {capsuleLimb(-14, -26, 8 + bowStroke, -22, 7, 6, "#1E293B")}
            <ellipse cx={9 + bowStroke} cy="-22" rx="3.5" ry="2.5" fill="#E29578" />
          </g>
        )}
      </g>

      {/* CÂY ĐÀN CELLO GỖ NÂU ĐỎ */}
      <g transform={`translate(${isWalking ? 12 : 14}, ${isWalking ? -15 : -8}) rotate(${!isWalking ? -8 + sway : 15})`}>
        {/* Chân chống chạm đất */}
        <line x1="0" y1="20" x2="0" y2="40" stroke="#777" strokeWidth="3" />
        {/* Thân đàn Cello dáng đồng hồ cát */}
        <path
          d="M -16, -30 Q -24, -15 -12, 0 Q -26, 12 -18, 26 L 18, 26 Q 26, 12 12, 0 Q 24, -15 16, -30 Z"
          fill="#843B22"
          stroke="#38170D"
          strokeWidth="1.5"
          filter="url(#paper-bevel)"
        />
        {/* Cần đàn vươn cao */}
        <rect x="-3" y="-62" width="6" height="34" fill="#1C1816" />
        <circle cx="0" cy="-66" r="4.5" fill="#843B22" />
        {/* Cây vĩ kéo Cello */}
        {!isWalking && (
          <line
            x1={-18 + bowStroke}
            y1="-2"
            x2={32 + bowStroke}
            y2="-8"
            stroke="#D4A373"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}
      </g>
    </g>
  );
};

// 3. FRENCH HORN & NGƯỜI DỰNG XÂY (Xuất hiện giây 55)
export const HornAndPlayer: React.FC<{ x: number; y: number; isWalking: boolean; t: number }> = ({
  x,
  y,
  isWalking,
  t,
}) => {
  const stepCycle = isWalking ? Math.sin(t * 7) : 0;
  const bob = isWalking ? Math.abs(Math.cos(t * 7)) * 4 : Math.sin(t * 3.0) * 1.5;
  const blowLift = !isWalking ? Math.sin(t * 4.2) * 4 : 0;

  return (
    <g transform={`translate(${x}, ${y - bob})`} filter="url(#paper-drop)">
      {/* Người dựng xây (Sắc đỏ son, dải khăn đỏ tung bay - Chuẩn giải phẫu Studio) */}
      <g>
        {/* Chân */}
        {isWalking ? (
          <g>
            {capsuleLimb(-4, 0, -4 - stepCycle * 10, 16, 11, 9, "#1E293B")}
            {capsuleLimb(-4 - stepCycle * 10, 16, -6 - stepCycle * 16, 32, 9, 7.5, "#1E293B")}
            <polygon points={`${-14 - stepCycle * 16},30 ${-2 - stepCycle * 16},31 ${-1 - stepCycle * 16},36 ${-14 - stepCycle * 16},36`} fill="#0F172A" />

            {capsuleLimb(4, 0, 4 + stepCycle * 10, 16, 11, 9, "#1E293B")}
            {capsuleLimb(4 + stepCycle * 10, 16, 6 + stepCycle * 16, 32, 9, 7.5, "#1E293B")}
            <polygon points={`${-2 + stepCycle * 16},30 ${10 + stepCycle * 16},31 ${11 + stepCycle * 16},36 ${-2 + stepCycle * 16},36`} fill="#0F172A" />
          </g>
        ) : (
          <g>
            {capsuleLimb(-6, 0, -8, 16, 11, 9, "#1E293B")}
            {capsuleLimb(-8, 16, -9, 32, 9, 7.5, "#1E293B")}
            <polygon points="-17,30 -5,31 -4,36 -17,36" fill="#0F172A" />

            {capsuleLimb(6, 0, 8, 16, 11, 9, "#1E293B")}
            {capsuleLimb(8, 16, 9, 32, 9, 7.5, "#1E293B")}
            <polygon points="1,30 13,31 14,36 1,36" fill="#0F172A" />
          </g>
        )}

        {/* Thân áo & Khăn đỏ son */}
        <path d="M -18, -60 Q -20, -25 -22, 0 L 22, 0 Q 20, -25 18, -60 Z" fill="#1E293B" />
        <path d="M -16, -58 Q 0, -50 16, -58 L 13, -26 Q 0, -20 -13, -26 Z" fill={PALETTE.builder} opacity="0.95" />

        {/* Dải khăn đỏ son tung bay */}
        <g transform="translate(10, -56)">
          <path d={`M 0, 0 Q ${16 + Math.sin(t * 4) * 8}, -6 ${28 + Math.sin(t * 4) * 6}, 2 Q 14, 8 0, 4 Z`} fill="#D44A3A" />
        </g>

        {/* Cổ áo hình bóng nghệ thuật */}
        <rect x="-1" y="-68" width="5" height="9" rx="2" fill="#0F172A" />
        <g transform="translate(0, -78)">
          {/* Đầu & Khuôn mặt hình bóng điện ảnh Senore (Chuẩn HB-001 & HB-002) */}
          <path
            d="M -2 -12 C 3 -12 7 -9 8 -5 C 8.5 -3 11 -1.5 11.5 0 C 10.5 1 9.5 1.5 10 3 C 10.5 4.5 10.5 5.5 9 7 C 6.5 8.5 1.5 9 -2 8 C -6.5 7 -10 1.5 -10 -3 C -10 -8 -6.5 -12 -2 -12 Z"
            fill="#0F172A"
          />
          {/* Viền sáng điện ảnh Rim Light */}
          <path
            d="M -2 -12 C 3 -12 7 -9 8 -5 C 8.5 -3 11 -1.5 11.5 0 M -2 -12 C -6.5 -12 -10 -8 -10 -3 C -10 2 -7 6 -3 7"
            fill="none"
            stroke="rgba(255,225,185,0.75)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>

        {/* Tay nâng kèn */}
        {!isWalking && (
          <g>
            {capsuleLimb(8, -44, 18, -40, 8, 7, "#1E293B")}
            {capsuleLimb(18, -40, 24, -48 + blowLift, 7, 6, "#1E293B")}
            <ellipse cx="25" cy={-48 + blowLift} rx="3.5" ry="3" fill="#E29578" />
          </g>
        )}
      </g>

      {/* CHIẾC KÈN FRENCH HORN BẰNG ĐỒNG VÀNG ÓNG */}
      <g transform={`translate(16, ${-46 + blowLift}) rotate(${!isWalking ? -15 : 20})`}>
        {/* Vòng ống kèn xoắn ốc */}
        <ellipse cx="0" cy="0" rx="14" ry="12" fill="none" stroke="#E5A93C" strokeWidth="4" />
        <circle cx="0" cy="0" r="7" fill="none" stroke="#D1942E" strokeWidth="3" />
        {/* Loa kèn lớn mở rộng hướng lên trời cao */}
        <path d="M 12, -6 Q 22, -18 32, -24 L 30, -6 Q 22, -2 12, -2 Z" fill="#F4BA42" stroke="#B87D1B" strokeWidth="1.2" />
        {/* Ống thổi kèn kề sát môi */}
        <line x1="-12" y1="-2" x2="-22" y2="-12" stroke="#E5A93C" strokeWidth="3" />
      </g>
    </g>
  );
};

// 4. VIOLIN & NGƯỜI LÀM NGHỆ THUẬT (Xuất hiện giây 75)
export const ViolinAndPlayer: React.FC<{ x: number; y: number; isWalking: boolean; t: number }> = ({
  x,
  y,
  isWalking,
  t,
}) => {
  const stepCycle = isWalking ? Math.sin(t * 6.5) : 0;
  const bob = isWalking ? Math.abs(Math.cos(t * 6.5)) * 4 : Math.sin(t * 2.8) * 1.5;
  const bowStroke = !isWalking ? Math.sin(t * 4.6) * 22 : 0;

  return (
    <g transform={`translate(${x}, ${y - bob})`} filter="url(#paper-drop)">
      {/* Người làm nghệ thuật (Sắc xanh lam - Chuẩn giải phẫu Studio) */}
      <g>
        {/* Chân */}
        {isWalking ? (
          <g>
            {capsuleLimb(-4, 0, -4 - stepCycle * 10, 16, 11, 9, "#1E293B")}
            {capsuleLimb(-4 - stepCycle * 10, 16, -6 - stepCycle * 16, 32, 9, 7.5, "#1E293B")}
            <polygon points={`${-14 - stepCycle * 16},30 ${-2 - stepCycle * 16},31 ${-1 - stepCycle * 16},36 ${-14 - stepCycle * 16},36`} fill="#0F172A" />

            {capsuleLimb(4, 0, 4 + stepCycle * 10, 16, 11, 9, "#1E293B")}
            {capsuleLimb(4 + stepCycle * 10, 16, 6 + stepCycle * 16, 32, 9, 7.5, "#1E293B")}
            <polygon points={`${-2 + stepCycle * 16},30 ${10 + stepCycle * 16},31 ${11 + stepCycle * 16},36 ${-2 + stepCycle * 16},36`} fill="#0F172A" />
          </g>
        ) : (
          <g>
            {capsuleLimb(-5, 0, -7, 16, 11, 9, "#1E293B")}
            {capsuleLimb(-7, 16, -8, 32, 9, 7.5, "#1E293B")}
            <polygon points="-16,30 -4,31 -3,36 -16,36" fill="#0F172A" />

            {capsuleLimb(5, 0, 7, 16, 11, 9, "#1E293B")}
            {capsuleLimb(7, 16, 8, 32, 9, 7.5, "#1E293B")}
            <polygon points="0,30 12,31 13,36 0,36" fill="#0F172A" />
          </g>
        )}

        {/* Thân & Áo màu Artist Blue */}
        <path d="M -18, -60 Q -20, -25 -22, 0 L 22, 0 Q 20, -25 18, -60 Z" fill="#1E293B" />
        <path d="M -16, -58 Q 0, -50 16, -58 L 13, -26 Q 0, -20 -13, -26 Z" fill={PALETTE.artist} opacity="0.95" />

        {/* Cổ áo hình bóng nghệ thuật */}
        <rect x="-1" y="-68" width="5" height="9" rx="2" fill="#0F172A" />
        <g transform={`translate(${!isWalking ? 4 : 0}, -78) rotate(${!isWalking ? 10 : 0})`}>
          {/* Đầu & Khuôn mặt hình bóng điện ảnh Senore (Chuẩn HB-001 & HB-002) */}
          <path
            d="M -2 -12 C 3 -12 7 -9 8 -5 C 8.5 -3 11 -1.5 11.5 0 C 10.5 1 9.5 1.5 10 3 C 10.5 4.5 10.5 5.5 9 7 C 6.5 8.5 1.5 9 -2 8 C -6.5 7 -10 1.5 -10 -3 C -10 -8 -6.5 -12 -2 -12 Z"
            fill="#0F172A"
          />
          {/* Viền sáng điện ảnh Rim Light */}
          <path
            d="M -2 -12 C 3 -12 7 -9 8 -5 C 8.5 -3 11 -1.5 11.5 0 M -2 -12 C -6.5 -12 -10 -8 -10 -3 C -10 2 -7 6 -3 7"
            fill="none"
            stroke="rgba(255,225,185,0.75)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>

        {/* Tay bấm phím & kéo vĩ Violin */}
        {!isWalking && (
          <g>
            {/* Tay trái nâng cần violin */}
            {capsuleLimb(8, -44, 18, -52, 7.5, 6, "#1E293B")}
            {capsuleLimb(18, -52, 16, -64, 6.5, 5, "#1E293B")}
            <ellipse cx="16" cy="-66" rx="3" ry="2.5" fill="#E29578" />

            {/* Tay phải cầm vĩ kéo */}
            {capsuleLimb(-6, -42, -12, -30, 7.5, 6, "#1E293B")}
            {capsuleLimb(-12, -30, 4 + bowStroke * 0.4, -48, 6.5, 5, "#1E293B")}
            <ellipse cx={5 + bowStroke * 0.4} cy="-49" rx="3" ry="2" fill="#E29578" />
          </g>
        )}

        {/* Cây đàn Violin kẹp trên vai */}
        <g transform={`translate(10, -62) rotate(${!isWalking ? 22 : 65})`}>
          <path
            d="M -6, -10 Q -10, -4 -5, 0 Q -12, 6 -8, 14 L 8, 14 Q 12, 6 5, 0 Q 10, -4 6, -10 Z"
            fill="#A6582B"
            stroke="#4A1E0D"
            strokeWidth="1"
          />
          <line x1="0" y1="-10" x2="0" y2="-26" stroke="#222" strokeWidth="2.5" />
          {/* Cây vĩ kéo violin */}
          {!isWalking && (
            <line
              x1={-16 + bowStroke}
              y1="-2"
              x2={28 + bowStroke}
              y2="-6"
              stroke="#D4A373"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </g>
      </g>
    </g>
  );
};

// 5. HARP & NGƯỜI SÁNG TẠO (Xuất hiện giây 102)
export const HarpAndPlayer: React.FC<{ x: number; y: number; isWalking: boolean; t: number }> = ({
  x,
  y,
  isWalking,
  t,
}) => {
  const stepCycle = isWalking ? Math.sin(t * 6.5) : 0;
  const bob = isWalking ? Math.abs(Math.cos(t * 6.5)) * 4 : Math.sin(t * 2.5) * 1.5;
  const pluck = !isWalking ? Math.sin(t * 5.2) * 6 : 0;

  return (
    <g transform={`translate(${x}, ${y - bob})`} filter="url(#paper-drop)">
      {/* Người sáng tạo (Sắc tím nhạt - Chuẩn giải phẫu Studio) */}
      <g transform="translate(-18, 0)">
        {/* Chân */}
        {isWalking ? (
          <g>
            {capsuleLimb(-4, 0, -4 - stepCycle * 10, 16, 11, 9, "#1E293B")}
            {capsuleLimb(-4 - stepCycle * 10, 16, -6 - stepCycle * 16, 32, 9, 7.5, "#1E293B")}
            <polygon points={`${-14 - stepCycle * 16},30 ${-2 - stepCycle * 16},31 ${-1 - stepCycle * 16},36 ${-14 - stepCycle * 16},36`} fill="#0F172A" />

            {capsuleLimb(4, 0, 4 + stepCycle * 10, 16, 11, 9, "#1E293B")}
            {capsuleLimb(4 + stepCycle * 10, 16, 6 + stepCycle * 16, 32, 9, 7.5, "#1E293B")}
            <polygon points={`${-2 + stepCycle * 16},30 ${10 + stepCycle * 16},31 ${11 + stepCycle * 16},36 ${-2 + stepCycle * 16},36`} fill="#0F172A" />
          </g>
        ) : (
          <g>
            {capsuleLimb(-5, 0, -7, 16, 11, 9, "#1E293B")}
            {capsuleLimb(-7, 16, -8, 32, 9, 7.5, "#1E293B")}
            <polygon points="-16,30 -4,31 -3,36 -16,36" fill="#0F172A" />

            {capsuleLimb(5, 0, 7, 16, 11, 9, "#1E293B")}
            {capsuleLimb(7, 16, 8, 32, 9, 7.5, "#1E293B")}
            <polygon points="0,30 12,31 13,36 0,36" fill="#0F172A" />
          </g>
        )}

        {/* Thân & Áo Creator Purple */}
        <path d="M -18, -60 Q -20, -25 -22, 0 L 22, 0 Q 20, -25 18, -60 Z" fill="#1E293B" />
        <path d="M -16, -58 Q 0, -50 16, -58 L 13, -26 Q 0, -20 -13, -26 Z" fill={PALETTE.creator} opacity="0.95" />

        {/* Cổ áo hình bóng nghệ thuật */}
        <rect x="-1" y="-68" width="5" height="9" rx="2" fill="#0F172A" />
        <g transform="translate(0, -78)">
          {/* Đầu & Khuôn mặt hình bóng điện ảnh Senore (Chuẩn HB-001 & HB-002) */}
          <path
            d="M -2 -12 C 3 -12 7 -9 8 -5 C 8.5 -3 11 -1.5 11.5 0 C 10.5 1 9.5 1.5 10 3 C 10.5 4.5 10.5 5.5 9 7 C 6.5 8.5 1.5 9 -2 8 C -6.5 7 -10 1.5 -10 -3 C -10 -8 -6.5 -12 -2 -12 Z"
            fill="#0F172A"
          />
          {/* Viền sáng điện ảnh Rim Light */}
          <path
            d="M -2 -12 C 3 -12 7 -9 8 -5 C 8.5 -3 11 -1.5 11.5 0 M -2 -12 C -6.5 -12 -10 -8 -10 -3 C -10 2 -7 6 -3 7"
            fill="none"
            stroke="rgba(255,225,185,0.75)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>

        {/* Tay vươn gảy dây đàn Harp */}
        {!isWalking && (
          <g>
            {/* Tay trên */}
            {capsuleLimb(6, -42, 20, -44, 7.5, 6, "#1E293B")}
            {capsuleLimb(20, -44, 30, -50 + pluck, 6.5, 5, "#1E293B")}
            <ellipse cx="32" cy={-50 + pluck} rx="3.5" ry="2.5" fill="#E29578" />

            {/* Tay dưới */}
            {capsuleLimb(8, -38, 22, -36, 7.5, 6, "#1E293B")}
            {capsuleLimb(22, -36, 34, -36 - pluck, 6.5, 5, "#1E293B")}
            <ellipse cx="36" cy={-36 - pluck} rx="3.5" ry="2.5" fill="#E29578" />
          </g>
        )}
      </g>

      {/* CÂY ĐÀN HẠC (HARP) ĐỨNG CONG QUÝ PHÁI */}
      <g transform="translate(18, 0)">
        {/* Khung đàn Hạc chữ S uốn lượn bằng gỗ quý viền vàng */}
        <path
          d="M 0, 32 L 0, -95 Q 26, -92 42, -72 Q 46, -42 22, -18 L 18, 32 Z"
          fill="#5E3F78"
          stroke="#D4A373"
          strokeWidth="2"
          filter="url(#paper-bevel)"
        />
        {/* Trụ đứng đàn hạc */}
        <line x1="0" y1="32" x2="0" y2="-95" stroke="#C9943C" strokeWidth="6" />
        {/* Các sợi dây đàn Hạc */}
        {[-82, -68, -54, -40, -26, -12].map((sy, i) => (
          <line
            key={i}
            x1="0"
            y1={sy}
            x2={lerp(18, 38, i / 5)}
            y2={lerp(-18, -72, i / 5)}
            stroke="#FDE1A2"
            strokeWidth="1.2"
            opacity="0.85"
          />
        ))}
      </g>
    </g>
  );
};


// ------------------------------------------------------------------ Cây trung tâm sinh trưởng & nở hoa
export const PaperTree: React.FC<{ x: number; y: number; growth: number; bloom?: boolean; t?: number }> = ({
  x,
  y,
  growth,
  bloom = false,
  t = 0,
}) => {
  const g = clamp(growth);
  const height = lerp(45, 230, g);
  const trunkWidth = lerp(8, 28, g);
  const sway = Math.sin((t || 0) * 1.5) * 4 * g;

  return (
    <g transform={`translate(${x}, ${y})`} filter="url(#paper-drop)">
      {/* Vết nứt trên lối đi lát gạch */}
      <path
        d="M -30, 4 L -12, 0 L 15, 2 L 35, 3 L 8, -1 L -15, 2 Z"
        fill="#262320"
        opacity="0.85"
      />
      {/* Thân cây */}
      <path
        d={`M ${-trunkWidth / 2}, 0 
           C ${-trunkWidth / 3}, ${-height * 0.4} ${-trunkWidth * 0.6 + sway * 0.3}, ${-height * 0.7} ${sway}, ${-height} 
           C ${trunkWidth * 0.6 + sway * 0.3}, ${-height * 0.7} ${trunkWidth / 3}, ${-height * 0.4} ${trunkWidth / 2}, 0 Z`}
        fill="#543A2C"
      />

      {/* Giai đoạn mầm non 2 lá (Intro) */}
      {g < 0.35 && (
        <g transform={`translate(${sway}, ${-height})`} filter="url(#paper-bevel)">
          <path d="M 0,0 Q -18,-14 -14,-25 Q -2,-20 0,0" fill="#7CB342" />
          <path d="M 0,0 Q 18,-14 14,-25 Q 2,-20 0,0" fill="#8BC34A" />
        </g>
      )}

      {/* Giai đoạn vươn nhánh */}
      {g >= 0.35 && g < 0.75 && (
        <g transform={`translate(${sway}, ${-height * 0.85})`}>
          <path d="M 0,0 Q -40,-25 -25,-45 Q 0,-30 0,0" fill="#558B2F" opacity="0.9" />
          <path d="M 0,0 Q 40,-20 30,-42 Q 5,-28 0,0" fill="#689F38" opacity="0.9" />
          <path d="M 0,-15 Q -15,-40 0,-60 Q 15,-40 0,-15" fill="#7CB342" />
        </g>
      )}

      {/* Giai đoạn đại thụ xum xuê (Finale) */}
      {g >= 0.75 && (
        <g transform={`translate(${sway}, ${-height})`}>
          <circle cx="-65" cy="-35" r="48" fill="#2E5C1B" opacity="0.95" />
          <circle cx="65" cy="-30" r="52" fill="#357A38" opacity="0.95" />
          <circle cx="-30" cy="-70" r="58" fill="#4B7C2A" />
          <circle cx="35" cy="-68" r="56" fill="#5C8F32" />
          <circle cx="0" cy="-90" r="54" fill="#7CB342" filter="url(#paper-bevel)" />

          {bloom && (
            <g filter="url(#paper-bevel)">
              {[
                { cx: -50, cy: -45, c: PALETTE.bloomColors[0], r: 11 },
                { cx: 55, cy: -40, c: PALETTE.bloomColors[1], r: 12 },
                { cx: -20, cy: -85, c: PALETTE.bloomColors[2], r: 13 },
                { cx: 30, cy: -80, c: PALETTE.bloomColors[3], r: 12 },
                { cx: 0, cy: -105, c: PALETTE.bloomColors[4], r: 14 },
                { cx: -60, cy: -75, c: PALETTE.bloomColors[5], r: 10 },
                { cx: 65, cy: -65, c: PALETTE.bloomColors[6], r: 11 },
              ].map((f, i) => (
                <g key={i} transform={`translate(${f.cx}, ${f.cy})`}>
                  <circle cx="0" cy="0" r={f.r} fill={f.c} />
                  <circle cx="0" cy="0" r={f.r * 0.35} fill="#FFF9C4" />
                </g>
              ))}
            </g>
          )}
        </g>
      )}
    </g>
  );
};

// ------------------------------------------------------------------ Hoa nở dần theo bản nhạc (Progressive Blooming Flowers)
export const ProgressiveFlowers: React.FC<{ t: number }> = ({ t }) => {
  // 28 điểm hoa phong phú khắp khu vườn: tiền cảnh, tảng đá, gốc cây, xích đu và ghế gỗ
  const flowerSpots = [
    // Giai đoạn 1: Nở từ nụ trong đoạn Piano (0s - 25s)
    { x: 120,  y: 846, bloomAt: 4,   color: PALETTE.bloomColors[0], r: 12, height: 18 },
    { x: 260,  y: 840, bloomAt: 10,  color: PALETTE.bloomColors[2], r: 13, height: 22 },
    { x: 380,  y: 848, bloomAt: 18,  color: PALETTE.bloomColors[1], r: 14, height: 20 },

    // Giai đoạn 2: Bừng nở khi Cello vào (27.5s)
    { x: 490,  y: 842, bloomAt: 27.5, color: PALETTE.bloomColors[4], r: 15, height: 24 },
    { x: 570,  y: 846, bloomAt: 29.0, color: PALETTE.bloomColors[3], r: 13, height: 20 },
    { x: 670,  y: 838, bloomAt: 32.0, color: PALETTE.bloomColors[0], r: 16, height: 26 },
    { x: 740,  y: 845, bloomAt: 38.0, color: PALETTE.bloomColors[5], r: 14, height: 22 },

    // Giai đoạn 3: Bừng nở khi French Horn vào (52.5s)
    { x: 890,  y: 842, bloomAt: 52.5, color: PALETTE.bloomColors[1], r: 15, height: 25 },
    { x: 990,  y: 847, bloomAt: 54.0, color: PALETTE.bloomColors[6], r: 14, height: 21 },
    { x: 1080, y: 840, bloomAt: 58.0, color: PALETTE.bloomColors[2], r: 16, height: 26 },
    { x: 1140, y: 845, bloomAt: 64.0, color: PALETTE.bloomColors[4], r: 15, height: 23 },

    // Giai đoạn 4: Bừng nở khi Violin so dây (72s)
    { x: 340,  y: 832, bloomAt: 72.0, color: PALETTE.bloomColors[0], r: 16, height: 28 }, // quanh xích đu
    { x: 440,  y: 835, bloomAt: 74.0, color: PALETTE.bloomColors[3], r: 17, height: 27 },
    { x: 1220, y: 838, bloomAt: 73.0, color: PALETTE.bloomColors[5], r: 16, height: 25 },
    { x: 1300, y: 843, bloomAt: 78.0, color: PALETTE.bloomColors[1], r: 15, height: 24 },
    { x: 1380, y: 839, bloomAt: 84.0, color: PALETTE.bloomColors[2], r: 17, height: 28 },

    // Giai đoạn 5: Bừng nở khi Harp vào (104.5s)
    { x: 1480, y: 835, bloomAt: 104.5, color: PALETTE.bloomColors[4], r: 18, height: 30 }, // quanh ghế gỗ
    { x: 1560, y: 840, bloomAt: 106.0, color: PALETTE.bloomColors[6], r: 16, height: 26 },
    { x: 1660, y: 834, bloomAt: 108.0, color: PALETTE.bloomColors[0], r: 18, height: 32 },
    { x: 1760, y: 842, bloomAt: 114.0, color: PALETTE.bloomColors[3], r: 15, height: 24 },

    // Giai đoạn 6: Cao trào nở hoa rực rỡ toàn bộ khu vườn sau bão giông (153.5s)
    { x: 80,   y: 848, bloomAt: 153.5, color: PALETTE.bloomColors[1], r: 18, height: 30 },
    { x: 220,  y: 843, bloomAt: 153.5, color: PALETTE.bloomColors[5], r: 19, height: 32 },
    { x: 620,  y: 836, bloomAt: 153.5, color: PALETTE.bloomColors[2], r: 20, height: 34 },
    { x: 830,  y: 846, bloomAt: 153.5, color: PALETTE.bloomColors[0], r: 19, height: 32 },
    { x: 1040, y: 838, bloomAt: 153.5, color: PALETTE.bloomColors[4], r: 21, height: 35 },
    { x: 1440, y: 842, bloomAt: 153.5, color: PALETTE.bloomColors[6], r: 20, height: 34 },
    { x: 1710, y: 836, bloomAt: 153.5, color: PALETTE.bloomColors[3], r: 22, height: 36 },
    { x: 1840, y: 844, bloomAt: 153.5, color: PALETTE.bloomColors[1], r: 19, height: 32 },
  ];

  return (
    <g filter="url(#paper-bevel)">
      {flowerSpots.map((f, i) => {
        // Chỉ bắt đầu xuất hiện và trồi lên từ nụ khi tới bloomAt
        const dt = t - f.bloomAt;
        if (dt < 0) return null; // Chưa tới giờ thì chưa mọc

        // Tiến trình vươn cành & bung nở từ 0 đến 1 trong 4 giây
        const growProgress = clamp(dt / 3.5);
        // Ở đoạn Finale, tất cả các bông hoa bung nở tối đa 1.35x
        const finalBoost = t >= 153.5 ? 1.35 : 1.0;
        const stemH = f.height * growProgress;
        const petalScale = growProgress * finalBoost;
        const sway = Math.sin(t * 2.4 + i * 0.8) * 3.5;

        return (
          <g key={i} transform={`translate(${f.x + sway}, ${f.y})`}>
            {/* Thân cành hoa vươn cao từ lòng đất */}
            <path
              d={`M 0, 0 Q ${-2 + Math.sin(t * 2 + i) * 2}, ${-stemH * 0.5} 0, ${-stemH}`}
              stroke="#2E5C1B"
              strokeWidth="2.8"
              fill="none"
              strokeLinecap="round"
            />
            {/* Hai lá nhỏ xanh mọc hai bên thân */}
            {growProgress > 0.4 && (
              <g transform={`translate(0, ${-stemH * 0.45}) scale(${growProgress})`}>
                <ellipse cx="-7" cy="-2" rx="6" ry="2.5" fill="#4B7C2A" transform="rotate(-20 -7 -2)" />
                <ellipse cx="7"  cy="-1" rx="6" ry="2.5" fill="#3E6B23" transform="rotate(20 7 -1)" />
              </g>
            )}

            {/* Bông hoa nở trên đỉnh cành */}
            <g transform={`translate(0, ${-stemH}) scale(${petalScale})`}>
              {/* Cánh hoa xòe tròn 5 cánh sắc nét */}
              <circle cx="-6" cy="-6" r={f.r * 0.65} fill={f.color} />
              <circle cx="6"  cy="-6" r={f.r * 0.65} fill={f.color} />
              <circle cx="0"  cy="-11" r={f.r * 0.65} fill={f.color} />
              <circle cx="-5" cy="4"  r={f.r * 0.65} fill={f.color} />
              <circle cx="5"  cy="4"  r={f.r * 0.65} fill={f.color} />
              {/* Nhụy hoa vàng tươi */}
              <circle cx="0"  cy="-3" r={f.r * 0.38} fill="#FFF9C4" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
            </g>
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ Tảng đá tác phẩm, Cây thế uốn lượn, Xích đu gỗ & Ghế dài
export const GardenArtAndSwing: React.FC<{ t: number }> = ({ t }) => {
  // Độ đung đưa của xích đu gỗ theo làn gió
  const swingAngle = Math.sin(t * 1.8) * 8; // đung đưa ±8 độ

  return (
    <g filter="url(#paper-drop)">
      {/* 1. CỤM TẢNG ĐÁ NGHỆ THUẬT / ĐÁ TÁC PHẨM CẮT GIẤY (bên trái) */}
      <g>
        {/* Tảng đá chính uy nghi, uốn lượn tự nhiên */}
        <path
          d="M 60, 850 Q 80, 720 140, 670 Q 200, 640 250, 700 Q 290, 750 310, 850 Z"
          fill="#5E5852"
          filter="url(#paper-bevel)"
        />
        {/* Mảng khía sáng trên mặt đá */}
        <path
          d="M 110, 710 Q 150, 660 190, 680 Q 170, 740 120, 780 Z"
          fill="#78726A"
          opacity="0.85"
        />
        {/* Tảng đá phụ bên cạnh */}
        <path
          d="M 270, 850 Q 290, 770 350, 760 Q 410, 780 430, 850 Z"
          fill="#4D4842"
        />
      </g>

      {/* 2. CÂY TÁC PHẨM NGHỆ THUẬT (Dáng bonsai cổ thụ uốn vươn che xích đu) */}
      <g>
        {/* Thân cây uốn lượn từ bờ đá vươn sang phải */}
        <path
          d="M 180, 850 
             C 210, 740 250, 660 320, 600 
             C 380, 550 470, 540 540, 560 
             C 480, 575 410, 585 360, 640 
             C 300, 710 260, 780 230, 850 Z"
          fill="#4A3425"
        />
        {/* Cành vươn đỡ xích đu */}
        <path
          d="M 350, 610 Q 420, 560 510, 570 Q 440, 590 380, 630 Z"
          fill="#3E2B1E"
        />
        {/* Các tán lá cắt giấy xếp tròn xanh mướt kiểu bonsai */}
        <circle cx="340" cy="570" r="42" fill="#2E5224" />
        <circle cx="420" cy="530" r="48" fill="#3D6B30" />
        <circle cx="510" cy="545" r="44" fill="#4E823E" filter="url(#paper-bevel)" />
        <circle cx="460" cy="495" r="38" fill="#609A4E" />
      </g>

      {/* 3. CHIẾC XÍCH ĐU GỖ TREO TỪ CÀNH CÂY ĐUNG ĐƯA (Wooden Swing) */}
      <g transform="translate(440, 565)">
        <g transform={`rotate(${swingAngle})`}>
          {/* 2 sợi dây thừng xích đu rủ xuống */}
          <line x1="-14" y1="0" x2="-14" y2="185" stroke="#8C6E4A" strokeWidth="2.5" />
          <line x1="14"  y1="0" x2="14"  y2="185" stroke="#8C6E4A" strokeWidth="2.5" />
          {/* Tấm ván gỗ ngồi xích đu */}
          <rect
            x="-26"
            y="185"
            width="52"
            height="9"
            rx="2"
            fill="#5C3D26"
            stroke="#382415"
            strokeWidth="1.2"
            filter="url(#paper-bevel)"
          />
        </g>
      </g>

      {/* 4. CHIẾC GHẾ GỖ DÀI (ở phía sau bên phải) */}
      <g transform="translate(1620, 825)">
        <rect x="-85" y="-28" width="170" height="10" rx="2.5" fill="#6B4B32" />
        <rect x="-75" y="-55" width="150" height="8" rx="2" fill="#573C27" />
        <line x1="-70" y1="-28" x2="-70" y2="-55" stroke="#3E2B1C" strokeWidth="5" />
        <line x1="70"  y1="-28" x2="70"  y2="-55" stroke="#3E2B1C" strokeWidth="5" />
        <line x1="-75" y1="-18" x2="-75" y2="35" stroke="#3E2B1C" strokeWidth="7" />
        <line x1="75"  y1="-18" x2="75"  y2="35" stroke="#3E2B1C" strokeWidth="7" />
      </g>
    </g>
  );
};

// ==================================================================
// CẢNH CHÍNH TỔNG HỢP (Main Garden Scene for Remotion)
// ==================================================================
export const GardenScene: React.FC<SceneProps> = (props) => {
  const { t, vertical } = props;
  const vb = vertical ? "420 0 1080 1080" : "0 0 1920 1080";

  // Phân đoạn timeline chuẩn khớp với diễn tiến âm nhạc chính xác
  // 0s - 27.5s: Intro & Solo Piano (1 người bắt đầu)
  // 27.5s - 52.5s: Cello bước vào & hòa tấu (ấm áp bền bỉ)
  // 52.5s - 72.0s: French horn bước vào (can đảm mở đường)
  // 72.0s - 104.5s: Violin bước vào (nét vẽ mềm mại)
  // 104.5s - 122.6s: Harp bước vào (sáng tạo lung linh)
  // 122.6s - 153.5s: Cơn bão Timpani & bè trầm (cùng nhau vượt qua thử thách)
  // 153.5s - 176.0s: Finale rực rỡ sau bão, cầu vồng & hoa nở rộ
  // 176.0s - 202.9s: Outro hoàng hôn buông xuống, chia tay và lời hẹn

  const isIntro    = t < 12;
  const isSection1 = t >= 12 && t < 27.5;
  const isSection2 = t >= 27.5 && t < 52.5;
  const isSection3 = t >= 52.5 && t < 72.0;
  const isSection4 = t >= 72.0 && t < 104.5;
  const isSection5 = t >= 104.5 && t < 122.6;
  const isStorm    = t >= 122.6 && t < 153.5;
  const isFinale   = t >= 153.5 && t < 176.0;
  const isOutro    = t >= 176.0;

  // Tăng trưởng cây trung tâm
  const treeGrowth = isIntro ? 0.12 :
                     isSection1 ? 0.22 :
                     isSection2 ? 0.35 :
                     isSection3 ? 0.48 :
                     isSection4 ? 0.62 :
                     isSection5 ? 0.74 :
                     isStorm ? 0.78 :
                     isFinale ? 1.0 : 0.95;

  // TIẾN TRÌNH BƯỚC VÀO & BIỂU DIỄN CỦA TỪNG NHÂN VẬT:
  // Nhân vật bước từ cổng bên trái vào vị trí trước 4-5s rồi dừng chân đúng nốt nhạc đầu tiên để biểu diễn:
  // 1. Cello: Bước vào từ 23s -> 27.5s, đúng 27.5s dừng tại x=650 bắt đầu so dây kéo Cello
  const celloWalking = t >= 23.0 && t < 27.5;
  const celloX = t < 23.0 ? -200 : celloWalking ? lerp(80, 650, clamp((t - 23.0) / 4.5)) : 650;

  // 2. Horn: Bước vào từ 48.0s -> 52.5s, đúng 52.5s dừng tại x=1180 nâng kèn thổi Horn
  const hornWalking = t >= 48.0 && t < 52.5;
  const hornX = t < 48.0 ? -200 : hornWalking ? lerp(80, 1180, clamp((t - 48.0) / 4.5)) : 1180;

  // 3. Violin: Bước vào từ 67.5s -> 72.0s, đúng 72.0s dừng tại x=520 so dây kéo Violin
  const violinWalking = t >= 67.5 && t < 72.0;
  const violinX = t < 67.5 ? -200 : violinWalking ? lerp(80, 520, clamp((t - 67.5) / 4.5)) : 520;

  // 4. Harp: Bước vào từ 100.0s -> 104.5s, đúng 104.5s dừng tại x=1420 gảy đàn Hạc
  const harpWalking = t >= 100.0 && t < 104.5;
  const harpX = t < 100.0 ? -200 : harpWalking ? lerp(80, 1420, clamp((t - 100.0) / 4.5)) : 1420;

  // =========================================================
  // TÍNH TOÁN ĐỘ MƯỢT CỦA CÁC LỚP CHUYỂN CẢNH (Smooth Crossfades)
  // =========================================================
  // 1. Bình minh sớm -> Nắng sớm (Morning): hòa trộn êm từ 25s - 45s
  const morningOpacity = clamp((t - 25.0) / 20.0);

  // 2. Nắng sớm -> Trưa rực rỡ (Midday): hòa trộn êm từ 65s - 85s
  const middayOpacity = t < 122.6 ? clamp((t - 65.0) / 20.0) : 0;

  // 3. Vào bão Timpani: trời tối dần và mưa kéo đến êm dịu từ 121s - 125s (fade-in 4s)
  const stormFadeIn = clamp((t - 121.0) / 4.0);
  // Hết bão: trời hửng sáng và tạnh mưa êm dịu từ 151s - 155s (fade-out 4s)
  const stormFadeOut = 1 - clamp((t - 151.0) / 4.0);
  const stormWeight = t >= 121.0 && t <= 155.0 ? Math.min(stormFadeIn, stormFadeOut) : 0;

  // 4. Finale bừng sáng sau bão: hòa trộn từ 152s - 156s
  const finaleBright = t >= 152.0 && t < 176.0 ? clamp((t - 152.0) / 4.0) : 0;

  // 5. Cầu vồng sau mưa: hiện dần từ 153.5s - 157.5s, mờ dần sang chiều từ 172s - 176s
  const rainbowFadeIn = clamp((t - 153.5) / 4.0);
  const rainbowFadeOut = 1 - clamp((t - 172.0) / 4.0);
  const rainbowOpacity = t >= 153.5 && t <= 176.0 ? Math.min(rainbowFadeIn, rainbowFadeOut) : 0;

  // 6. Chiều tà vàng óng (Golden Hour): chuyển êm từ 172s - 182s
  const goldenOpacity = clamp((t - 172.0) / 10.0);

  // 7. Hoàng hôn tím đỏ cảnh kết (Sunset): chuyển êm từ 182s - 192s
  const sunsetOpacity = clamp((t - 182.0) / 10.0);

  // =========================================================
  // TỌA ĐỘ MẶT TRỜI & ĐỘ SÁNG THEO QUỸ ĐẠO BẦU TRỜI
  // =========================================================
  let sunX = 1420;
  let sunY = 350;
  let sunGlow = "url(#sun-glow-dawn)";
  let sunDisc = "#FFFDF0";
  let sunR = 40;
  const sunStormDim = 1 - stormWeight * 0.9;

  if (t < 52.5) {
    // Bình minh mọc ở hướng đông
    const p = t / 52.5;
    sunX = lerp(1480, 1340, p);
    sunY = lerp(380, 290, p);
    sunGlow = "url(#sun-glow-dawn)";
    sunDisc = "#FFFDF0";
    sunR = 42;
  } else if (t < 122.6) {
    // Lên cao đỉnh trời trưa sáng rực
    const p = (t - 52.5) / 70.1;
    sunX = lerp(1340, 960, p);
    sunY = lerp(290, 180, p);
    sunGlow = "url(#sun-glow-bright)";
    sunDisc = "#FFFFFF";
    sunR = 48;
  } else if (t < 153.5) {
    // Trong bão
    sunX = 960;
    sunY = 190;
    sunGlow = "url(#sun-glow-bright)";
    sunDisc = "#FFFFFF";
    sunR = 40;
  } else if (t < 176.0) {
    // Finale nắng tràn sau mưa
    sunX = lerp(960, 880, (t - 153.5) / 22.5);
    sunY = lerp(180, 240, (t - 153.5) / 22.5);
    sunGlow = "url(#sun-glow-bright)";
    sunDisc = "#FFFFFF";
    sunR = 50;
  } else {
    // Hoàng hôn ngả bóng lặn dần về tây
    const p = clamp((t - 176.0) / 26.9);
    sunX = lerp(880, 380, p);
    sunY = lerp(240, 480, p);
    sunGlow = "url(#sun-glow-sunset)";
    sunDisc = "#FFE0B2";
    sunR = 54;
  }

  return (
    <svg viewBox={vb} style={{ width: "100%", height: "100%", display: "block" }}>
      <PaperFilters />

      {/* LỚP 1: BẦU TRỜI CHẠY TỪ BÌNH MINH -> TRƯA RỰC RỠ -> BÃO GIÔNG -> CẦU VỒNG -> HOÀNG HÔN (CROSSFADE MƯỢT MÀ) */}
      {/* Nền gốc: Bình minh êm dịu */}
      <rect x="0" y="0" width="1920" height="870" fill="url(#sky-dawn)" />

      {/* Lớp 1b: Nắng sớm morning (hòa trộn mượt 0 -> 1) */}
      {morningOpacity > 0 && (
        <rect x="0" y="0" width="1920" height="870" fill="url(#sky-morning)" opacity={morningOpacity} />
      )}

      {/* Lớp 1c: Trưa rực rỡ midday (hòa trộn mượt 0 -> 1) */}
      {middayOpacity > 0 && (
        <rect x="0" y="0" width="1920" height="870" fill="url(#sky-midday)" opacity={middayOpacity} />
      )}

      {/* Lớp 1d: Bão giông Timpani (hòa trộn vào và ra cực êm) */}
      {stormWeight > 0 && (
        <rect x="0" y="0" width="1920" height="870" fill="url(#sky-storm)" opacity={stormWeight} />
      )}

      {/* Lớp 1e: Finale bừng sáng trở lại sau mưa */}
      {finaleBright > 0 && (
        <rect x="0" y="0" width="1920" height="870" fill="url(#sky-midday)" opacity={finaleBright} />
      )}

      {/* Lớp 1f: Chiều tà vàng óng */}
      {goldenOpacity > 0 && (
        <rect x="0" y="0" width="1920" height="870" fill="url(#sky-golden)" opacity={goldenOpacity} />
      )}

      {/* Lớp 1g: Hoàng hôn tím đỏ kết thúc */}
      {sunsetOpacity > 0 && (
        <rect x="0" y="0" width="1920" height="870" fill="url(#sky-sunset)" opacity={sunsetOpacity} />
      )}

      {/* VẦNG THÁI DƯƠNG RỰC RỠ THEO QUỸ ĐẠO BẦU TRỜI */}
      <g transform={`translate(${sunX}, ${sunY})`} opacity={sunStormDim}>
        <circle cx="0" cy="0" r={sunR * 3.4} fill={sunGlow} />
        <circle cx="0" cy="0" r={sunR} fill={sunDisc} filter="url(#paper-bevel)" />
      </g>

      {/* LUỒNG NẮNG XIÊN (VOLUMETRIC GOD RAYS) TỎA XUỐNG DÃY NÚI VÀ KHU VƯỜN */}
      <SunBeams sunX={sunX} sunY={sunY} t={t} stormWeight={stormWeight} />

      {/* CẦU VỒNG SAU MƯA BẮC QUA BẦU TRỜI NÚI NON (XUẤT HIỆN & TAN DẦN MƯỢT MÀ) */}
      {rainbowOpacity > 0 && (
        <g opacity={rainbowOpacity * 0.75} filter="url(#paper-bevel)">
          <path d="M 260, 700 C 460, 200 1460, 200 1660, 700" fill="none" stroke="#E86A7A" strokeWidth="15" opacity="0.85" />
          <path d="M 260, 700 C 460, 200 1460, 200 1660, 700" fill="none" stroke="#F4A261" strokeWidth="15" opacity="0.85" transform="translate(0, 10)" />
          <path d="M 260, 700 C 460, 200 1460, 200 1660, 700" fill="none" stroke="#E9C46A" strokeWidth="15" opacity="0.85" transform="translate(0, 20)" />
          <path d="M 260, 700 C 460, 200 1460, 200 1660, 700" fill="none" stroke="#2A9D8F" strokeWidth="15" opacity="0.85" transform="translate(0, 30)" />
          <path d="M 260, 700 C 460, 200 1460, 200 1660, 700" fill="none" stroke="#4A7BB0" strokeWidth="15" opacity="0.85" transform="translate(0, 40)" />
          <path d="M 260, 700 C 460, 200 1460, 200 1660, 700" fill="none" stroke="#A267AC" strokeWidth="15" opacity="0.85" transform="translate(0, 50)" />
        </g>
      )}

      {/* MÂY CẮT GIẤY BỒNG BỀNH & ĐÀN CHIM BAY LIỆNG */}
      <PaperClouds t={t} />
      <PaperBirds t={t} />

      {/* LỚP 2: DÃY NÚI NON ĐA TẦNG CẮT GIẤY (3 Layers of Mountains) */}
      <PaperMountains t={t} />

      {/* LỚP 3: CÁC TẢNG ĐÁ NGHỆ THUẬT, CÂY THẾ TÁC PHẨM, XÍCH ĐU GỖ VÀ GHẾ GỖ */}
      <GardenArtAndSwing t={t} />

      {/* LỚP 4: MẶT ĐẤT HẠ THẤP & LỐI ĐI LÁT ĐÁ (Lower Horizon at y=860) */}
      <path
        d="M 0, 850 Q 480, 835 960, 850 Q 1440, 865 1920, 850 L 1920, 1080 L 0, 1080 Z"
        fill="#3A3229"
        filter="url(#paper-drop)"
      />
      <path
        d="M 0, 850 Q 480, 825 960, 845 Q 1440, 860 1920, 850 L 1920, 910 Q 1200, 930 0, 910 Z"
        fill={isFinale ? "#538641" : "#44593E"}
        opacity={isIntro ? 0.45 : 0.9}
      />
      <path
        d="M 160, 860 Q 460, 880 960, 855 Q 1380, 875 1920, 860 L 1920, 940 Q 1200, 970 0, 950 Z"
        fill="#C4B79D"
        opacity="0.35"
      />

      {/* BỤI CỎ VÀ HOA DẠI RUNG RINH THEO GIÓ */}
      <g fill="#435E3B">
        {[260, 400, 520, 720, 1080, 1240, 1480, 1720].map((gx, i) => {
          const windSway = Math.sin(t * 3.2 + i) * 6;
          return (
            <path
              key={i}
              d={`M ${gx}, 850 Q ${gx + windSway}, 825 ${gx + windSway * 1.5}, 810 Q ${gx + windSway * 0.5}, 835 ${gx + 8}, 850 Z`}
            />
          );
        })}
      </g>

      {/* HOA NỞ DẦN THEO TIẾN TRÌNH ÂM NHẠC & DÀN NHẠC */}
      <ProgressiveFlowers t={t} />

      {/* ĐÀN BƯỚM NGHỆ THUẬT CẮT GIẤY DẬP DỜN KHẮP KHU VƯỜN */}
      {!isStorm && <PaperButterflies t={t} />}

      {/* LỚP 5: CÂY TRUNG TÂM SINH TRƯỞNG & NỞ HOA RỰC RỠ */}
      <PaperTree x={1040} y={850} growth={treeGrowth} bloom={isFinale} t={t} />

      {/* ========================================================= */}
      {/* LỚP 6: DÀN NHẠC 5 NGƯỜI LẦN LƯỢT XUẤT HIỆN VÀ BIỂU DIỄN */}
      {/* ========================================================= */}

      {/* 1. NGƯỜI CHƠI PIANO (Ngồi biểu diễn ngay từ đầu tại trung tâm bên trái x=820) */}
      <GrandPianoAndPianist x={820} y={850} t={t} />

      {/* 2. NGƯỜI KÉO CELLO (Bước vào từ 23.0s, hòa tấu từ 27.5s) */}
      {t >= 23.0 && (
        <CelloAndPlayer x={celloX} y={850} isWalking={celloWalking} t={t} />
      )}

      {/* 3. NGƯỜI THỔI FRENCH HORN (Bước vào từ 48.0s, thổi kèn từ 52.5s) */}
      {t >= 48.0 && (
        <HornAndPlayer x={hornX} y={850} isWalking={hornWalking} t={t} />
      )}

      {/* 4. NGƯỜI KÉO VIOLIN (Bước vào từ 67.5s, kéo vĩ từ 72.0s tại x=520 cạnh xích đu) */}
      {t >= 67.5 && (
        <ViolinAndPlayer x={violinX} y={850} isWalking={violinWalking} t={t} />
      )}

      {/* 5. NGƯỜI GẢY HARP (Bước vào từ 100.0s, gảy đàn từ 104.5s tại x=1420 gần ghế gỗ) */}
      {t >= 100.0 && (
        <HarpAndPlayer x={harpX} y={850} isWalking={harpWalking} t={t} />
      )}

      {/* ========================================================= */}
      {/* LỚP 6b: ĐỘNG VẬT NGHỆ THUẬT LẮNG NGHE BẢN GIAO HƯỞNG (Studio Animal Art) */}
      {/* ========================================================= */}
      {/* 1. Hươu sao rừng thẳm đứng ngơ ngác lắng nghe bên tảng đá & cây bonsai (x=155, y=775) */}
      <StudioDeer x={155} y={775} scale={0.72} t={t} facing={1} color="#9A6B43" />

      {/* 2. Chú chó vàng trung thành ngồi ngoan ngoãn bên ghế gỗ lắng nghe giai điệu (x=1530, y=845) */}
      <StudioDog x={1530} y={845} scale={0.76} t={t} pose="sit" facing={-1} />

      {/* 3. Đôi hạc trắng sải cánh bay qua bầu trời núi xa khi dàn nhạc tấu vang (t >= 50s) */}
      {t >= 50 && (
        <g opacity={clamp((t - 50) / 4.0) * (isStorm ? 0.2 : 0.85)}>
          <StudioBird
            species="crane"
            x={((t - 50) * 45 + 100) % 2200 - 150}
            y={240 + Math.sin(t * 0.8) * 20}
            scale={0.75}
            t={t}
            facing={1}
          />
          <StudioBird
            species="crane"
            x={((t - 50) * 45 + 20) % 2200 - 150}
            y={275 + Math.sin(t * 0.8 + 0.6) * 18}
            scale={0.65}
            t={t}
            facing={1}
          />
        </g>
      )}

      {/* CƠN BÃO TIMPANI (Mưa xiên & sấm chớp - hiện và tan biến mượt mà theo stormWeight) */}
      {stormWeight > 0 && (
        <g opacity={stormWeight * 0.85}>
          {Array.from({ length: 70 }).map((_, i) => {
            const rx = (i * 37 + t * 550) % 1920;
            const ry = (i * 23 + t * 1100) % 1080;
            return (
              <line
                key={i}
                x1={rx}
                y1={ry}
                x2={rx - 20}
                y2={ry + 55}
                stroke="#CDE0F2"
                strokeWidth="2.2"
                opacity="0.85"
              />
            );
          })}
        </g>
      )}

      {/* ========================================================= */}
      {/* LỚP 7: ÁNH SÁNG TỔNG THỂ TĂNG DẦN RÕ RỆT & PHỦ HOÀNG HÔN CẢNH KẾT */}
      {/* ========================================================= */}
      {/* 1. Càng chơi nhạc, ánh sáng nắng vàng lan tỏa bừng sáng rõ rệt khắp khu vườn */}
      {t < 176.0 && (
        <rect
          x="0"
          y="0"
          width="1920"
          height="1080"
          fill="#FFF4D0"
          opacity={
            t < 27.5
              ? lerp(0.04, 0.10, t / 27.5) // Piano solo
              : t < 52.5
              ? lerp(0.10, 0.18, (t - 27.5) / 25.0) // Cello vào
              : t < 72.0
              ? lerp(0.18, 0.26, (t - 52.5) / 19.5) // Horn vào
              : t < 122.6
              ? lerp(0.26, 0.38, (t - 72.0) / 50.6) // Violin & Harp vào, trưa rực rỡ nhất!
              : t < 153.5
              ? 0.04 // Bão giông hạ tối
              : lerp(0.28, 0.40, clamp((t - 153.5) / 6.0)) // Finale bừng sáng huy hoàng
          }
          style={{ mixBlendMode: "screen", pointerEvents: "none" }}
        />
      )}

      {/* 2. Cảnh kết (t >= 176s): Ánh hoàng hôn vàng cam và tím đỏ phủ ấm toàn bộ khu vườn mượt mà */}
      {goldenOpacity > 0 && (
        <rect
          x="0"
          y="0"
          width="1920"
          height="1080"
          fill="#FF8C42"
          opacity={goldenOpacity * 0.28}
          style={{ mixBlendMode: "soft-light", pointerEvents: "none" }}
        />
      )}
      {sunsetOpacity > 0 && (
        <rect
          x="0"
          y="0"
          width="1920"
          height="1080"
          fill="#7B2869"
          opacity={sunsetOpacity * 0.24}
          style={{ mixBlendMode: "multiply", pointerEvents: "none" }}
        />
      )}

    </svg>
  );
};
