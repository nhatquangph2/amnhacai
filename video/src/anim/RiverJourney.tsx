import React from "react";
import type { SceneProps } from "./Scenes";
import { Figure, FigurePalette, PoseName } from "./Figure";
import { Branch, BridgeRailing, CamCtx, CastShadow, DepthDefs, Glitter, HazePlane, Light, Parallax, Posts, RainStreaks, Reeds, SceneLight, StormRocks, StreetLamp, SunDisc, WindowFrame, toLight, useLight } from "./DepthLight";
import { StudioBird, StudioDog, StudioFishSchool, StudioWaterfowl } from "../library/animals";


const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

const lerp = (a: number, b: number, t: number) =>
  a + (b - a) * t;

const ease = (t: number) =>
  t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

const smooth = (t: number) =>
  t * t * (3 - 2 * t);

const pulse = (t: number, speed = 1) =>
  (Math.sin(t * speed) + 1) / 2;

/* ============================================================
   TIMELINE
   ============================================================ */

const SHOTS = [
  [1, 0, 4.5],
  [2, 4.5, 8.5],
  [3, 8.5, 15],
  [4, 15, 21.8],
  [5, 21.8, 28.5],
  [6, 28.5, 35.5],
  [7, 35.5, 43.7],
  [8, 43.7, 53.5],

  [9, 53.5, 58.5],
  [10, 58.5, 63.1],
  [11, 63.1, 70],
  [12, 70, 76],
  [13, 76, 83.5],
  [14, 83.5, 91],

  [15, 91, 96],
  [16, 96, 102],
  [17, 102, 106.5],
  [18, 106.5, 112.5],
  [19, 112.5, 117.5],

  [20, 117.5, 123],
  [21, 123, 128],
  [22, 128, 132.5],
  [23, 132.5, 137],
  [24, 137, 141.5],

  [25, 141.5, 148.5],
  [26, 148.5, 156.5],
  [27, 156.5, 164],
  [28, 164, 168.5],
  [29, 168.5, 180.5],
  [30, 180.5, 193.5],
  [31, 193.5, 206.9],
] as const;

type Camera = {
  x: number;
  y: number;
  w: number;
  h: number;
};

function resolveShot(t: number) {
  for (let i = 0; i < SHOTS.length; i++) {
    const [id, start, end] = SHOTS[i];

    if (
      t >= start &&
      (i === SHOTS.length - 1 ? t <= end : t < end)
    ) {
      return {
        id,
        start,
        end,
        p: clamp((t - start) / (end - start)),
      };
    }
  }

  return {
    id: 31,
    start: 193.5,
    end: 206.9,
    p: 1,
  };
}

/* ============================================================
   DEFINITIONS
   ============================================================ */

const Defs = () => (
  <defs>
    <linearGradient id="sky-grey" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#29313b" />
      <stop offset="58%" stopColor="#73808a" />
      <stop offset="100%" stopColor="#d9c8b3" />
    </linearGradient>

    <linearGradient id="sky-wonder" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#255f92" />
      <stop offset="48%" stopColor="#84b9d7" />
      <stop offset="100%" stopColor="#f1c887" />
    </linearGradient>

    <linearGradient id="sky-memory" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#07101d" />
      <stop offset="65%" stopColor="#182d45" />
      <stop offset="100%" stopColor="#1f3d59" />
    </linearGradient>

    <linearGradient id="sky-home" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#505f93" />
      <stop offset="42%" stopColor="#c66e70" />
      <stop offset="100%" stopColor="#efbd6a" />
    </linearGradient>

    <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#5f93b3" />
      <stop offset="22%" stopColor="#386f96" />
      <stop offset="65%" stopColor="#1d4769" />
      <stop offset="100%" stopColor="#0c2236" />
    </linearGradient>

    <filter id="soft-shadow">
      <feDropShadow
        dx="0"
        dy="8"
        stdDeviation="8"
        floodColor="#0f172a"
        floodOpacity=".3"
      />
    </filter>

    <filter id="glow">
      <feGaussianBlur stdDeviation="12" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="blur">
      <feGaussianBlur stdDeviation="8" />
    </filter>
  </defs>
);

/* ============================================================
   CHARACTER
   Không dùng "stick figure" đơn giản nữa.
   Silhouette phải đọc được tư thế ngay cả ở wide shot.
   ============================================================ */

// Hai nhân vật dùng chung bộ nhân vật vẽ bằng code (Figure, chế độ có màu): tóc, áo hai tông, bàn tay, giày, khăn quàng Ember.
// Toạ độ cũ giữ nguyên: người lớn đứng cao ~113 đơn vị (đỉnh đầu -85, gót +28, hông -10); trẻ ~75 (đỉnh -58, gót +17, hông -7).
const ADULT_PAL: FigurePalette = { coat: "#315e89", pants: "#1c2333", skin: "#d9a67e", hair: "#1b1512", shoe: "#141822", hairStyle: "short", garment: "jacket", accent: "#efe6d6" };
const CHILD_PAL: FigurePalette = { coat: "#2a9d8f", pants: "#264653", skin: "#e0ac82", hair: "#3a2a20", shoe: "#e9dcc4", hairStyle: "mushroom", garment: "hoodie", bottom: "shorts", accent: "#efe6d6" };
const SHADE = "#1b2333";
const hx2 = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, k: number) => { const A = hx2(a), B = hx2(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",")})`; };
const lit = (p: FigurePalette, shade: string, k: number): FigurePalette => ({ ...p, coat: mixHex(p.coat, shade, k), pants: mixHex(p.pants, shade, k), skin: mixHex(p.skin, shade, k), hair: mixHex(p.hair, shade, k), shoe: mixHex(p.shoe ?? p.pants, shade, k) });
const ADULT_POSE: Record<string, PoseName> = { walk: "walk", run: "run", still: "stand", row: "row", reach: "reach", sit: "sitEdge", float: "openArms", wave: "wave", openArms: "openArms", heart: "heart", push: "push", lookDown: "lookDown" };
const CHILD_POSE: Record<string, PoseName> = { still: "stand", point: "point", reach: "reach", wave: "wave", heart: "heart", shore: "reach" };
const SEATED = new Set<PoseName>(["sitEdge", "row"]);

const Adult: React.FC<{
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  pose?: "walk" | "run" | "still" | "row" | "reach" | "sit" | "float" | "wave" | "openArms" | "heart" | "push" | "lookDown";
  t: number;
  opacity?: number;
  ground?: boolean; // đứng trên đất/bến (có bóng đổ); trên thuyền thì không
}> = ({ x, y, scale = 1, facing = 1, pose = "still", t, opacity = 1, ground }) => {
  const fp = ADULT_POSE[pose] ?? "stand", H = 113 * scale * 1.15; // người lớn cao hơn hẳn em bé
  const light = useLight();
  const rimDir = rimFrom(light, facing === -1);
  const feetY = y + 28 * scale;
  return (
    <g opacity={opacity}>
      {light && ground && !SEATED.has(fp) && <CastShadow x={x} y={feetY} h={H} light={light} />}
      <Figure pose={fp} t={t} x={x} y={SEATED.has(fp) ? y - 10 * scale : feetY} H={H} flip={facing === -1} scarf="#d9622b" wind={0.35} palette={lit(ADULT_PAL, light?.ambient ?? SHADE, light ? 0.22 : 0.16)} rim={light ? rimColor(light) : "rgba(255,225,185,0.55)"} rimDir={rimDir} />
    </g>
  );
};
// Viền sáng nằm ở phía hướng về nguồn sáng (đảo trục x khi nhân vật quay mặt trái)
const rimFrom = (light: Light | null, flipped: boolean): [number, number] => {
  if (!light) return [-1, -1];
  const [dx, dy] = toLight(light, 960, 640);
  return [dx * (flipped ? -1 : 1) * 1.2, dy * 1.2];
};
const rimColor = (l: Light) => l.color;

const Child: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: "still" | "point" | "reach" | "wave" | "heart" | "shore";
  t: number;
  opacity?: number;
  facing?: 1 | -1;
}> = ({ x, y, scale = 1, pose = "still", t, opacity = 1, facing }) => (
  <g opacity={opacity}>
    {/* Em bé thường đứng mũi thuyền / bên phải người lớn: với tay, đặt tay lên ngực, vẫy là hướng về người lớn (bên trái);
        đứng yên hay chỉ đường là nhìn về phía trước (bên phải) */}
    <ChildFigure pose={pose} t={t} x={x} y={y} scale={scale} facing={facing} />
  </g>
);
const ChildFigure: React.FC<{ pose: string; t: number; x: number; y: number; scale: number; facing?: 1 | -1 }> = ({ pose, t, x, y, scale, facing }) => {
  const light = useLight();
  const flipped = (facing ?? (pose === "reach" || pose === "heart" || pose === "wave" || pose === "shore" ? -1 : 1)) === -1;
  return (
    <Figure pose={CHILD_POSE[pose] ?? "stand"} t={t} x={x} y={y + 17 * scale} H={75 * scale * 0.78} age="child" flip={flipped} scarf="#e76f51" wind={0.35} palette={lit(CHILD_PAL, light?.ambient ?? SHADE, light ? 0.2 : 0.14)} rim={light ? rimColor(light) : "rgba(255,225,185,0.55)"} rimDir={rimFrom(light, flipped)} />
  );
};

const Boat: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  t: number;
  adult?: React.ReactNode;
  child?: React.ReactNode;
  text?: string;
  sailWind?: number;
}> = ({
  x,
  y,
  scale = 1,
  rotation = 0,
  t,
  sailWind = 0,
  adult,
  child,
  text,
}) => (
  <g
    transform={`translate(${x} ${y}) scale(${scale}) rotate(${rotation})`}
    filter="url(#soft-shadow)"
  >
    {/* bóng thuyền & cột buồm in xuống mặt nước */}
    <ellipse cx={0} cy={60} rx={160} ry={10} fill="rgba(5,15,28,0.22)" />
    <path
      d="
        M -150 -8
        Q -130 48 0 55
        Q 125 50 155 -10
        Q 60 13 -150 -8
        Z
      "
      fill="#754427"
    />

    <path
      d="M -142 -12 Q 0 18 150 -13"
      stroke="#ba7741"
      strokeWidth="8"
      fill="none"
    />

    <line
      x1="14"
      y1="-15"
      x2="14"
      y2="-175"
      stroke="#51331e"
      strokeWidth="8"
    />

    <path
      d={`M 20 -166 Q ${108+sailWind*(16+Math.sin(t*1.5)*5)} -115 25 -30 Z`}
      fill="#f0ebdd"
    />

    <path
      d="
        M 8 -154
        Q -55 -112 7 -42
        Z
      "
      fill="#769eb5"
      opacity=".8"
    />

    {adult}
    {child}

    {text && (
      <text
        x="0"
        y="25"
        textAnchor="middle"
        fill="#f6ddb0"
        fontSize={text.length > 12 ? 17 : 20}
        fontWeight="600"
        letterSpacing={text.length > 12 ? 1 : 2}
      >
        {text}
      </text>
    )}
  </g>
);

/* ============================================================
   GLOBAL ATMOSPHERE
   ============================================================ */

const Water = ({
  t,
  dark = false,
  violent = false,
}: {
  t: number;
  dark?: boolean;
  violent?: boolean;
}) => (
  <>
    <path
      d="
        M 0 715
        Q 320 660 650 710
        T 1280 705
        T 1920 710
        L 1920 1080
        L 0 1080 Z
      "
      fill={dark ? "#10253c" : "url(#river)"}
    />

    {Array.from({ length: violent ? 12 : 6 }).map((_, i) => {
      const y = 750 + i * 35;
      const a = Math.sin(t * (violent ? 7 : 2) + i) *
        (violent ? 35 : 9);

      return (
        <path
          key={i}
          d={`M 0 ${y}
              Q 280 ${y + a}
                600 ${y - a}
              T 1200 ${y + a}
              T 1920 ${y}`}
          stroke={dark ? "#527792" : "#98c6dc"}
          strokeWidth={violent ? 5 : 2}
          opacity={violent ? .65 : .32}
          fill="none"
        />
      );
    })}
  </>
);

const Vignette = () => (
  <>
    <rect
      width="1920"
      height="1080"
      fill="none"
      stroke="#020617"
      strokeWidth="100"
      opacity=".08"
    />
  </>
);

/* ============================================================
   CAMERA
   ============================================================ */

function cameraFor(id: number, p: number): Camera {
  switch (id) {
    case 1:
      return { x: 800, y: 330, w: 320, h: 180 };

    case 2:
      return {
        x: lerp(670, 0, ease(p)),
        y: lerp(240, 0, ease(p)),
        w: lerp(650, 1920, ease(p)),
        h: lerp(366, 1080, ease(p)),
      };

    case 3:
      return {
        x: lerp(580, 620, p),
        y: 390,
        w: 760,
        h: 428,
      };

    case 4:
      return {
        x: 350,
        y: 450,
        w: 900,
        h: 506.25,
      };

    case 5:
      return {
        x: 450,
        y: 400,
        w: 1150,
        h: 646.875,
      };

    case 6:
      return {
        x: 600,
        y: 420,
        w: 1000,
        h: 562.5,
      };

    case 7:
      return {
        x: lerp(600, 450, ease(p)),
        y: 480,
        w: 1120,
        h: 630,
      };

    case 8:
      return {
        x: lerp(300, 650, p),
        y: 400,
        w: 1180,
        h: 664,
      };

    case 9:
      return {
        x: lerp(240, 0, ease(p)),
        y: lerp(300, 0, ease(p)),
        w: lerp(1400, 1920, ease(p)),
        h: lerp(788, 1080, ease(p)),
      };

    case 10:
      return {
        x: 100,
        y: 150,
        w: 1600,
        h: 900,
      };

    case 11:
      return { x: 430, y: 280, w: 1250, h: 703 };

    case 12:
      return {
        x: lerp(560, 760, p),
        y: 320,
        w: 1050,
        h: 590.625,
      };

    case 13:
      return { x: 0, y: 0, w: 1920, h: 1080 };

    case 14:
      return {
        x: lerp(420, 620, p),
        y: 390,
        w: 1080,
        h: 608,
      };

    case 15:
      return {
        x: 280,
        y: lerp(70, 280, ease(p)),
        w: 1360,
        h: 765,
      };

    case 16:
      return { x: 430, y: 480, w: 1100, h: 618.75 };

    case 17:
      return { x: 460, y: 430, w: 1000, h: 562.5 };

    case 18:
      return {
        x: lerp(120, 450, p),
        y: 280,
        w: 1380,
        h: 776,
      };

    case 19:
      return { x: 410, y: 350, w: 1100, h: 618.75 };

    case 20:
      return { x: 140, y: 150, w: 1600, h: 900 };

    case 21:
      return {
        x: lerp(380, 600, p),
        y: 410,
        w: 1080,
        h: 608,
      };

    case 22:
      return {
        x: 480,
        y: lerp(400, 600, ease(p)),
        w: 960,
        h: 540,
      };

    case 23:
      return { x: 440, y: 300, w: 1120, h: 630 };

    case 24:
      return {
        x: 440,
        y: lerp(300, 230, ease(p)),
        w: 1120,
        h: 630,
      };

    case 25:
      return { x: 480, y: 330, w: 1120, h: 630 };

    case 26:
      return { x: 520, y: 450, w: 1080, h: 608 };

    case 27:
      return {
        x: lerp(500, 0, ease(p)),
        y: lerp(380, 0, ease(p)),
        w: lerp(1050, 1920, ease(p)),
        h: lerp(591, 1080, ease(p)),
      };

    case 28:
      return {
        x: lerp(430, 650, p),
        y: 410,
        w: 800,
        h: 450,
      };

    case 29:
      return { x: 580, y: 400, w: 900, h: 506.25 };

    case 30:
      return {
        x: lerp(560, 400, ease(p)),
        y: 400,
        w: lerp(900, 1250, ease(p)),
        h: lerp(506, 703, ease(p)),
      };

    default:
      return {
        x: lerp(500, 0, ease(p)),
        y: lerp(360, 0, ease(p)),
        w: lerp(1100, 1920, ease(p)),
        h: lerp(619, 1080, ease(p)),
      };
  }
}

/* ============================================================
   MAIN SCENE
   ============================================================ */

// Nguồn sáng chính của từng cảnh (vị trí trong khung 1920×1080, màu, độ cao so với chân trời, màu bóng/ánh sáng môi trường)
// --- HỒI 1: Sương sớm, phố thị, bến sông đón thuyền (Shots 1 - 8) ---
const DAWN_MIST: Light = { x: 960, y: 280, color: "#dbe5ed", elev: 22, ambient: "#212930" };
const DAWN_STREET: Light = { x: 1550, y: 460, color: "#ede2d5", elev: 18, ambient: "#222a34" };
const DAWN_RIVER: Light = { x: 1480, y: 500, color: "#f5e2cb", elev: 15, ambient: "#243444" };
const MORNING: Light = { x: 1480, y: 520, color: "#ffd9a0", elev: 14, ambient: "#24384f" };
const MORNING_DEPART: Light = { x: 1520, y: 490, color: "#ffd9a0", elev: 16, ambient: "#24384f" };
const MORNING_GATE: Light = { x: 1450, y: 470, color: "#ffe0b2", elev: 18, ambient: "#26384a" };

// --- HỒI 2: Thung lũng mộng tưởng, bánh răng, rừng đêm (Shots 9 - 14) ---
const VALLEY_GOLD: Light = { x: 1420, y: 440, color: "#ffe699", elev: 22, ambient: "#20342b" };
const GEAR_TOWN: Light = { x: 1460, y: 400, color: "#ffd280", elev: 20, ambient: "#2d2235" };
const VALLEY_SUN: Light = { x: 1400, y: 420, color: "#ffd78a", elev: 20, ambient: "#22332a" };
const VALLEY_BLOOM: Light = { x: 1440, y: 430, color: "#ffe094", elev: 18, ambient: "#223228" };
const DUSK_FALL: Light = { x: 1500, y: 460, color: "#ffad66", elev: 12, ambient: "#221626" };
const MOON: Light = { x: 1418, y: 300, color: "#cfe0ff", elev: 32, ambient: "#0a1424" };

// --- HỒI 3: Hồ ký ức sâu thẳm & Làng quê an bình (Shots 15 - 19) ---
const LAKE_NIGHT: Light = { x: 960, y: 260, color: "#a8c8ea", elev: 35, ambient: "#09101d" };
const LAKE_TEAR: Light = { x: 960, y: 640, color: "#38efd8", elev: 12, ambient: "#08101a" };
const LAKE_GLOW: Light = { x: 960, y: 580, color: "#52ffd9", elev: 25, ambient: "#081520" };
const VILLAGE_WARM: Light = { x: 1380, y: 450, color: "#f8b878", elev: 16, ambient: "#362216" };
const HEARTH_LIGHT: Light = { x: 1050, y: 460, color: "#ffa852", elev: 20, ambient: "#2a1810" };

// --- HỒI 4: Thác lũ bão dông & Buông bỏ (Shots 20 - 24) ---
const STORM_APPROACH: Light = { x: 1300, y: 320, color: "#9ac0dd", elev: 28, ambient: "#121a28" };
const STORM_FLASH: Light = { x: 980, y: 200, color: "#b0f2ff", elev: 45, ambient: "#0e1824" };
const STORM_WAVE: Light = { x: 1100, y: 220, color: "#a5e5ff", elev: 40, ambient: "#0c1522" };
const STORM_RELEASE: Light = { x: 1200, y: 280, color: "#b8dcf2", elev: 35, ambient: "#0f1826" };
const STORM_CALM: Light = { x: 1350, y: 380, color: "#d0e4f0", elev: 25, ambient: "#141e2a" };

// --- HỒI 5: Đại hòa ca — Hoàng hôn quê hương & Chia tay (Shots 25 - 31) ---
const SUN_BREAK: Light = { x: 1450, y: 450, color: "#ffd485", elev: 16, ambient: "#2e2232" };
const SUNSET_RIVER: Light = { x: 1480, y: 440, color: "#ffba70", elev: 12, ambient: "#341e2e" };
const SUNSET: Light = { x: 1490, y: 430, color: "#ffc27a", elev: 7, ambient: "#3a2236" };
const SUNSET_DOCK: Light = { x: 1510, y: 450, color: "#ffa866", elev: 6, ambient: "#381e2a" };
const SUNSET_FAREWELL: Light = { x: 1520, y: 460, color: "#ff9955", elev: 5, ambient: "#341a24" };
const TWILIGHT_WALK: Light = { x: 1540, y: 480, color: "#f0886c", elev: 4, ambient: "#2c1620" };
const HORIZON_DAWN: Light = { x: 1560, y: 500, color: "#e8806a", elev: 3, ambient: "#26121c" };

const lightFor = (id: number): Light => {
  switch (id) {
    case 1: return DAWN_MIST;
    case 2:
    case 3: return DAWN_STREET;
    case 4: return DAWN_RIVER;
    case 5:
    case 6: return MORNING;
    case 7: return MORNING_DEPART;
    case 8: return MORNING_GATE;
    case 9: return VALLEY_GOLD;
    case 10: return GEAR_TOWN;
    case 11: return VALLEY_SUN;
    case 12: return VALLEY_BLOOM;
    case 13: return DUSK_FALL;
    case 14: return MOON;
    case 15: return LAKE_NIGHT;
    case 16: return LAKE_TEAR;
    case 17: return LAKE_GLOW;
    case 18: return VILLAGE_WARM;
    case 19: return HEARTH_LIGHT;
    case 20: return STORM_APPROACH;
    case 21: return STORM_FLASH;
    case 22: return STORM_WAVE;
    case 23: return STORM_RELEASE;
    case 24: return STORM_CALM;
    case 25: return SUN_BREAK;
    case 26: return SUNSET_RIVER;
    case 27: return SUNSET;
    case 28: return SUNSET_DOCK;
    case 29: return SUNSET_FAREWELL;
    case 30: return TWILIGHT_WALK;
    case 31: return HORIZON_DAWN;
    default: return MORNING;
  }
};

// Bờ xa: hàng cây bụi thấp sát mép nước (lớp giữa)
const FarBank = ({ tone }: { tone: string }) => (
  <g fill={tone}>
    {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={i * 68 + (i % 3) * 9} cy={706 - (i % 4) * 6} rx={46 + (i % 5) * 9} ry={24 + (i % 3) * 8} />)}
    <rect x={0} y={700} width={1920} height={20} />
  </g>
);
// Thân cây gần (lớp giữa–gần của rừng đêm)
const NearTrunks = () => (
  <g fill="#020608">
    {[470, 1230, 1760].map((x, i) => <path key={i} d={`M${x},-50 L${x + 46},-50 L${x + 60 + i * 6},760 L${x - 14},760 Z`} />)}
  </g>
);

const RiverJourneyFrame: React.FC<SceneProps> = ({ t }) => {
  const shot = resolveShot(t);
  const { p } = shot;
  const id = shot.id;

  const camera = t >= 163
    ? endingCamera(t)
    : id >= 22 && id <= 25
    ? {x: 480, y: 330, w: 1120, h: 630}
    : cameraFor(id, p);

  const x = clamp(camera.x, 0, 1920 - camera.w);
  const y = clamp(camera.y, 0, 1080 - camera.h);

  const vb = `${x} ${y} ${camera.w} ${camera.h}`;

  return (
    <svg
      viewBox={vb}
      preserveAspectRatio="xMidYMid slice"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    >
      <Defs />
      <DepthDefs />
      <CamCtx.Provider value={{ x, y, w: camera.w, h: camera.h }}>
      <SceneLight.Provider value={lightFor(id)}>

      <rect
        width="1920"
        height="1080"
        fill={
          id <= 8
            ? "url(#sky-grey)"
            : id <= 14
              ? "url(#sky-wonder)"
              : id <= 17
                ? "url(#sky-memory)"
                : id <= 19
                  ? "#d5b17b"
                  : id <= 24
                    ? "#172333"
                    : "url(#sky-home)"
        }
      />

      {/* =====================================================
          HỒI 1
          ===================================================== */}

      {id === 1 && (
        <>
          <SunDisc light={DAWN_MIST} r={65} core="#f0f5fa" glow={0.6} />
          <Parallax depth={0.6}>
            <Town opacity={0.25} />
          </Parallax>
          <HazePlane color="#b8c5d0" opacity={0.36} />

          <rect
            x="650"
            y="405"
            width="620"
            height="300"
            fill="#4a382d"
          />

          <circle
            cx="960"
            cy="425"
            r="78"
            fill="#b3783d"
            filter="url(#soft-shadow)"
          />

          <circle
            cx="960"
            cy="425"
            r="64"
            fill="#efe1c3"
          />

          <line
            x1="960"
            y1="425"
            x2="960"
            y2="380"
            stroke="#172033"
            strokeWidth="6"
          />

          <line
            x1="960"
            y1="425"
            x2={
              960 +
              Math.sin(Math.floor(t * 2) * Math.PI / 30) * 53
            }
            y2={425 - Math.cos(Math.floor(t * 2) * Math.PI / 30) * 53}
            stroke="#a93232"
            strokeWidth="3"
          />
        </>
      )}

      {id === 2 && (
        <>
          <SunDisc light={DAWN_STREET} r={48} core="#fff1e0" glow={0.8} />
          <Parallax depth={0.6}><Town opacity={0.45} /></Parallax>
          <HazePlane color="#c8d2db" opacity={0.28} />
          <Town opacity={1} />
          <Crowd t={t} />
        </>
      )}

      {id === 3 && (
        <>
          <SunDisc light={DAWN_STREET} r={52} core="#fff1e0" glow={0.8} />
          <Parallax depth={0.55}><Town opacity={0.35} /></Parallax>
          <HazePlane color="#c8d2db" opacity={0.24} />
          <Town opacity={0.75} />
          <Crowd t={t} />

          <Adult
            x={940}
            y={725}
            scale={1.65}
            pose="walk"
            t={t}
            ground
          />

          <rect
            width="1920"
            height="1080"
            fill="#26313b"
            opacity=".12"
          />

          <BridgeRailing x={450} y={780} w={950} color="#10151c" rim="#f2dfce" />
        </>
      )}

      {id === 4 && (
        <>
          <SunDisc light={DAWN_RIVER} r={46} core="#fff2db" glow={0.85} />
          <Parallax depth={0.65}><Town opacity={.4} /></Parallax>
          <HazePlane color="#cbd7df" opacity={0.25} />
          <Parallax depth={0.85}><FarBank tone="#5c6e7a" /></Parallax>
          <HazePlane color="#cbd7df" opacity={0.1} y0={600} y1={740} />
          <Water t={t} />
          <Glitter x={DAWN_RIVER.x} horizon={712} t={t} color="#f5e2cb" strength={0.8} />
          <Landing />
          <Adult x={lerp(610, 700, ease(clamp(p/.55)))} y={712} scale={1}
            pose={p < .55 ? "walk" : "still"} t={t} ground />
          <ellipse cx="704" cy="750" rx="29" ry="6" fill="#343b35" opacity=".3" />
        </>
      )}

      {id === 5 && (
        <>
          <SunDisc light={MORNING} r={46} core="#fff3d6" glow={0.9} />
          <Parallax depth={0.7}><Town opacity={.3} /></Parallax>
          <HazePlane color="#f3d9b5" opacity={0.25} />
          <Parallax depth={0.85}><FarBank tone="#6c7c68" /></Parallax>
          <HazePlane color="#f3d9b5" opacity={0.1} y0={600} y1={740} />
          {/* Đàn chim én chao liệng trên bầu trời ban mai */}
          <StudioBird species="swallow" x={lerp(650, 1400, (p * 1.3) % 1)} y={515 + Math.sin(t * 2.8) * 16} scale={0.75} t={t} />
          <StudioBird species="swallow" x={lerp(550, 1300, ((p * 1.3) + 0.35) % 1)} y={550 + Math.cos(t * 2.2) * 14} scale={0.62} t={t} />
          <Water t={t} />
          <Glitter x={MORNING.x} horizon={712} t={t} color="#ffe2b0" strength={0.85} />
          <Landing />
          {/* Chú chó vàng ngồi đợi cùng Người Tìm Kiếm trên bến cầu đá */}
          <Adult x={700} y={712} scale={.82} pose="still" t={t} ground />
          <StudioDog x={625} y={726} scale={0.72} t={t} pose="sit" facing={1} />
          {/* Đàn cá bơi lội dưới làn nước trong gần mạn thuyền */}
          <StudioFishSchool x={1180} y={885} t={t} count={5} scale={0.75} />
          <Boat x={lerp(1320, 1050, ease(p))} y={795} scale={1.1} t={t}
            child={<Child x={-70} y={-20} scale={1} pose="reach" t={t} />} />
        </>
      )}

      {id === 6 && (
        <>
          <SunDisc light={MORNING} r={46} core="#fff3d6" />
          <Parallax depth={0.7}><Town opacity={.3} /></Parallax>
          <HazePlane color="#f3d9b5" opacity={0.26} />
          <Parallax depth={0.85}><FarBank tone="#6c7c68" /></Parallax>
          <HazePlane color="#f3d9b5" opacity={0.1} y0={600} y1={740} />
          <Water t={t} />
          <Glitter x={MORNING.x} horizon={712} t={t} color="#ffe2b0" strength={0.9} />
          <Landing />
          {/* A visible gangway makes the decision to board a continuous action. */}
          <path d="M 710 732 L 915 781 L 908 797 L 705 747 Z" fill="#bd986c" />
          <Boat x={1050} y={795} scale={1.1} t={t} text="VỀ THÔI NÀO"
            child={<Child x={-70} y={-20} scale={1} pose="reach" t={t} />} />
          <Adult x={lerp(700, 995, ease(clamp((p-.2)/.7)))}
            y={lerp(712, 772, ease(clamp((p-.2)/.7)))} scale={.82}
            pose={p < .2 ? "reach" : p < .9 ? "walk" : "still"} t={t} ground />
        </>
      )}

      {/* =====================================================
          HỒI 1.5 + HỒI 2
          HÀNH TRÌNH THỰC SỰ BẮT ĐẦU
          SH-07 → SH-14
          ===================================================== */}

      {id === 7 && (
        <>
          <SunDisc light={MORNING_DEPART} r={48} core="#fff4d9" glow={0.9} />
          <Parallax depth={0.65}><Mountains /></Parallax>
          <HazePlane color="#f3d9b5" opacity={0.22} />
          <Parallax depth={0.85}><FarBank tone="#627560" /></Parallax>
          <HazePlane color="#f3d9b5" opacity={0.1} y0={600} y1={740} />
          <Water t={t} />
          <Glitter x={MORNING_DEPART.x} horizon={712} t={t} color="#ffe2b0" strength={0.85} />

          {/* SH07:
              Adult vừa bước lên nên thuyền chao mạnh.
              Child giữ lấy cột buồm, Adult mất thăng bằng.
              Sau đó cả hai cùng bật cười.
          */}

          <Boat
            x={lerp(1080, 930, ease(p))}
            y={760 + Math.sin(p * Math.PI * 2) * 12}
            scale={1.14}
            rotation={
              p < 0.45
                ? Math.sin(p * Math.PI * 5) * 4
                : lerp(2, 0, (p - 0.45) / 0.55)
            }
            t={t}
            adult={
              <Adult
                x={-58}
                y={-22}
                scale={0.76}
                pose={p < 0.4 ? "reach" : "still"}
                t={t}
              />
            }
            child={
              <Child
                x={78}
                y={-22}
                scale={0.94}
                pose={p < 0.4 ? "reach" : "still"}
                t={t}
              />
            }
          />

          {/* Gợn nước do Adult vừa bước xuống */}
          {p < 0.42 && (
            <>
              {[0, 1, 2].map((i) => {
                const rp = clamp((p - i * 0.04) / 0.38);

                return (
                  <ellipse
                    key={i}
                    cx="950"
                    cy="810"
                    rx={lerp(5, 120 + i * 25, rp)}
                    ry={lerp(2, 20 + i * 3, rp)}
                    fill="none"
                    stroke="#A8D5E5"
                    strokeWidth="3"
                    opacity={1 - rp}
                  />
                );
              })}
            </>
          )}

          {/* Adult quay đầu nhìn lại thị trấn */}
          {p > 0.55 && (
            <g opacity={clamp((p - 0.55) / 0.2)}>
              <Parallax depth={0.7}><Town opacity={0.24} /></Parallax>

              <path
                d="M 1060 690 Q 1010 675 965 690"
                fill="none"
                stroke="#F4D7A1"
                strokeWidth="3"
                opacity=".45"
              />
            </g>
          )}
        </>
      )}

      {id === 8 && (
        <>
          <SunDisc light={MORNING_GATE} r={48} core="#fff7e0" glow={0.95} />
          <Parallax depth={0.65}><Mountains /></Parallax>
          <HazePlane color="#f0d5b2" opacity={0.2} />
          <Parallax depth={0.85}><FarBank tone="#687864" /></Parallax>
          <HazePlane color="#f0d5b2" opacity={0.1} y0={600} y1={740} />
          <Water t={t} />
          <Glitter x={MORNING_GATE.x} horizon={712} t={t} color="#ffe2b0" strength={0.9} />

          {/* Động vật bơi lội & bay lượn trong Shot 8 */}
          <StudioWaterfowl species="mallard" x={480} y={740} scale={0.7} t={t} facing={1} />
          <StudioWaterfowl species="duck" x={430} y={755} scale={0.55} t={t} facing={1} />
          <StudioBird species="crane" x={lerp(450, 1100, (p * 0.9) % 1)} y={460 + Math.sin(t * 1.5) * 12} scale={0.72} t={t} facing={1} />
          <StudioFishSchool x={860} y={820} t={t} count={4} scale={0.7} />

          {/* SH08 có 3 beat:
              1. Adult chèo quá mạnh
              2. Child ra hiệu dừng
              3. Adult bỏ chèo, thử dang tay cảm nhận gió
          */}

          <Boat
            x={lerp(1060, 720, ease(p))}
            y={750 + Math.sin(t * 1.7) * 5}
            scale={1.18}
            rotation={Math.sin(t * 1.2) * 1.2}
            t={t}
            adult={
              <Adult
                x={-68}
                y={-24}
                scale={0.76}
                pose={
                  p < 0.42
                    ? "row"
                    : p < 0.66
                      ? "still"
                      : "openArms"
                }
                t={t}
              />
            }
            child={
              <Child
                x={82}
                y={-24}
                scale={0.94}
                pose={
                  p < 0.34
                    ? "still"
                    : p < 0.58
                      ? "reach"
                      : "point"
                }
                t={t}
              />
            }
          />

          {/* Mái chèo rơi nhẹ xuống sàn khi Adult chịu dừng */}
          {p > 0.43 && (
            <g
              transform={`
                translate(
                  ${lerp(895, 875, clamp((p - 0.43) / 0.25))}
                  ${lerp(720, 782, clamp((p - 0.43) / 0.25))}
                )
                rotate(${lerp(-35, 8, clamp((p - 0.43) / 0.25))})
              `}
            >
              <line
                x1="-50"
                y1="0"
                x2="40"
                y2="0"
                stroke="#754427"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M35 -8 L60 0 L35 8Z"
                fill="#754427"
              />
            </g>
          )}

          {/* Gió xuất hiện rõ hơn sau khi Adult chịu dừng */}
          {p > 0.58 && (
            <WindLines
              opacity={clamp((p - 0.58) / 0.25)}
              t={t}
            />
          )}
        </>
      )}

      {id === 9 && (
        <>
          {/* SH09:
              Không reveal fantasy ngay.
              Thuyền chui qua một khe tối → ánh sáng tràn vào.
          */}
          <SunDisc light={VALLEY_GOLD} r={55} core="#fff8e7" glow={1.1} />

          <rect
            width="1920"
            height="1080"
            fill="#17232D"
          />

          {/* Ánh sáng phía trước */}
          <ellipse
            cx="1320"
            cy="510"
            rx={lerp(100, 650, ease(p))}
            ry={lerp(150, 500, ease(p))}
            fill="#F2D18B"
            opacity={lerp(0.12, 0.75, ease(p))}
            filter="url(#glow)"
          />

          {/* Hai vách khe núi mở dần */}
          <path
            d={`
              M0 0
              L${lerp(820, 420, ease(p))} 0
              L${lerp(1050, 650, ease(p))} 1080
              L0 1080 Z
            `}
            fill="#203C42"
          />

          <path
            d={`
              M1920 0
              L${lerp(1100, 1500, ease(p))} 0
              L${lerp(870, 1270, ease(p))} 1080
              L1920 1080 Z
            `}
            fill="#203C42"
          />

          <Water t={t} />
          <Glitter x={VALLEY_GOLD.x} horizon={712} t={t} color="#ffe699" strength={0.9} />

          <Boat
            x={lerp(760, 1020, p)}
            y={760}
            scale={1.04}
            t={t}
            adult={
              <Adult
                x={-65}
                y={-22}
                scale={0.74}
                pose="still"
                t={t}
              />
            }
            child={
              <Child
                x={78}
                y={-22}
                scale={0.92}
                pose="point"
                t={t}
              />
            }
          />
        </>
      )}

      {id === 10 && (
        <>
          <SunDisc light={GEAR_TOWN} r={50} core="#fff3db" glow={1} />
          <Parallax depth={0.65}><Mountains wonder /></Parallax>
          <HazePlane color="#c7e6ea" opacity={0.22} />
          <Parallax depth={0.85}><FarBank tone="#4a6e68" /></Parallax>
          <HazePlane color="#c7e6ea" opacity={0.1} y0={600} y1={740} />
          <Water t={t} />
          <Glitter x={GEAR_TOWN.x} horizon={712} t={t} color="#ffd280" strength={0.9} />

          {/* SH10:
              Adult ban đầu đang nhìn xuống nước,
              Child kéo tay áo → Adult mới nhìn lên.
          */}

          <Boat
            x={lerp(980, 800, p)}
            y={750 + Math.sin(t * 1.8) * 4}
            scale={1.08}
            t={t}
            adult={
              <Adult
                x={-66}
                y={-23}
                scale={0.74}
                pose={p < 0.38 ? "sit" : "still"}
                t={t}
              />
            }
            child={
              <Child
                x={76}
                y={-23}
                scale={0.94}
                pose={p < 0.36 ? "reach" : "point"}
                t={t}
              />
            }
          />

          {/* Cá chỉ xuất hiện sau khi Adult nhìn lên */}
          {p > 0.3 && (
            <FlyingFishCinematic
              t={t}
              opacity={clamp((p - 0.3) / 0.2)}
            />
          )}

          {/* Một con cá lớn bay rất gần camera để tạo cảm giác cinematic */}
          {p > 0.62 && (
            <g
              transform={`
                translate(
                  ${lerp(1550, 550, (p - 0.62) / 0.38)}
                  ${lerp(260, 330, (p - 0.62) / 0.38)}
                )
                rotate(-6)
                scale(2.4)
              `}
              opacity={clamp((p - 0.62) / 0.15)}
              filter="url(#soft-shadow)"
            >
              <path
                d="M-38 0 Q0 -24 42 0 Q0 24 -38 0Z"
                fill="#A6DCE7"
              />

              <path
                d="M38 0 L68 -24 L63 3 L68 24Z"
                fill="#7EB8CE"
              />

              <path
                d="M-10 -12 Q0 -30 15 -15"
                fill="none"
                stroke="#DDF3F6"
                strokeWidth="5"
              />
            </g>
          )}
        </>
      )}

      {id === 11 && (
        <>
          {/* SH11:
              Fantasy đột ngột bị thay bằng một nơi cực kỳ bận rộn.
              Adult nhận ra đây giống thế giới mình vừa rời đi.
          */}
          <SunDisc light={VALLEY_SUN} r={50} core="#fff5e0" glow={0.9} />
          <Parallax depth={0.6}><ClockTownCinematic t={t} /></Parallax>
          <HazePlane color="#d8cce0" opacity={0.2} />

          <Water t={t} />
          <Glitter x={VALLEY_SUN.x} horizon={712} t={t} color="#ffd78a" strength={0.85} />

          <Boat
            x={lerp(1180, 820, p)}
            y={765}
            scale={1.04}
            t={t}
            adult={
              <Adult
                x={-66}
                y={-22}
                scale={0.74}
                pose="still"
                t={t}
              />
            }
            child={
              <Child
                x={78}
                y={-22}
                scale={0.92}
                pose="still"
                t={t}
              />
            }
          />

          {/* Các silhouette máy móc đi vòng tròn */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = t * 1.2 + i * (Math.PI * 2 / 12);

            return (
              <g
                key={i}
                transform={`
                  translate(
                    ${960 + Math.cos(a) * 440}
                    ${650 + Math.sin(a) * 120}
                  )
                `}
                opacity=".35"
              >
                <circle
                  cx="0"
                  cy="-25"
                  r="9"
                  fill="#28313A"
                />

                <rect
                  x="-8"
                  y="-16"
                  width="16"
                  height="34"
                  fill="#38434C"
                />
              </g>
            );
          })}
        </>
      )}

      {id === 12 && (
        <>
          <SunDisc light={VALLEY_BLOOM} r={46} core="#fff3d6" glow={0.85} />
          <Parallax depth={0.6}><ClockTownCinematic t={t} /></Parallax>
          <HazePlane color="#dacde0" opacity={0.2} />

          {/* SH12:
              Thuyền đi ngang một tủ kính.
              Adult nhìn thấy reflection của chính mình ở thế giới cũ.
          */}

          <Water t={t} />
          <Glitter x={VALLEY_BLOOM.x} horizon={712} t={t} color="#ffe094" strength={0.8} />

          <Boat
            x={lerp(1150, 800, p)}
            y={770}
            scale={1}
            t={t}
            adult={
              <Adult
                x={-65}
                y={-22}
                scale={0.74}
                pose="still"
                t={t}
              />
            }
            child={
              <Child
                x={78}
                y={-22}
                scale={0.92}
                pose={p > 0.48 ? "reach" : "still"}
                t={t}
              />
            }
          />

          {/* Tủ kính foreground */}
          <g
            transform={`translate(${lerp(1360, 520, p)} 520)`}
            opacity=".92"
            filter="url(#dl-blur-s)"
          >
            <rect
              x="-170"
              y="-120"
              width="340"
              height="280"
              rx="12"
              fill="#24303B"
              opacity=".72"
              stroke="#B7D5E0"
              strokeWidth="5"
            />

            {/* reflection Adult mệt mỏi */}
            <g
              transform="translate(-35 90)"
              opacity={lerp(.55, .16, p)}
            >
              <Adult
                x={0}
                y={0}
                scale={1.05}
                pose="walk"
                t={t * 1.8}
              />
            </g>

            {/* đồng hồ cát */}
            <path
              d="M70 -80 L130 -80 L100 -15 Z"
              fill="#E7C875"
            />

            <path
              d="M100 -15 L70 75 L130 75 Z"
              fill="#C89447"
            />
          </g>
        </>
      )}

      {id === 13 && (
        <>
          <SunDisc light={DUSK_FALL} r={52} core="#ffe0b8" glow={1} />
          <Parallax depth={0.65}><Mountains /></Parallax>
          <HazePlane color="#f0b890" opacity={0.24} />
          <RiverFork t={t} />
          <Glitter x={DUSK_FALL.x} horizon={712} t={t} color="#ffad66" strength={0.85} />
          {/* Pause at the fork, then follow the child's pointing hand into the forest. */}
          <Boat x={lerp(940, 1400, ease(clamp((p-.35)/.65)))}
            y={lerp(805, 650, ease(clamp((p-.35)/.65)))}
            scale={lerp(1.05,.86,ease(clamp((p-.35)/.65)))}
            rotation={lerp(0,-5,ease(clamp((p-.35)/.65)))} t={t}
            adult={<Adult x={-65} y={-22} scale={.74} pose={p < .2 ? "row" : p < .45 ? "still" : "row"} t={t} />}
            child={<Child x={78} y={-22} scale={.92} pose={p < .2 ? "still" : "point"} t={t} />} />
        </>
      )}

      {id === 14 && (
        <>
          {/* SH14:
              Rời khỏi sự ồn ào.
              Không còn fantasy spectacle.
              Rừng tối nhưng yên.
              Child thôi chỉ đường và ngồi xuống.
          */}

          <ForestScene t={t} p={p} />
          <SunDisc light={MOON} r={26} core="#eef3ff" glow={0.8} />
          <HazePlane color="#22364f" opacity={0.24} />
          <Parallax depth={1.15}><NearTrunks /></Parallax>

          <Water t={t} dark />
          <Glitter x={MOON.x} horizon={715} t={t} color="#cfe0ff" strength={0.6} spread={0.6} />

          <Boat
            x={lerp(1080, 770, ease(p))}
            y={750 + Math.sin(t * 1.1) * 3}
            scale={1}
            t={t}
            adult={
              <Adult
                x={-62}
                y={-22}
                scale={0.74}
                pose="still"
                t={t}
              />
            }
            child={
              <Child
                x={70}
                y={-20}
                scale={0.9}
                pose="still"
                t={t}
              />
            }
          />

          {/* Đom đóm dẫn đến hồ ký ức */}
          {Array.from({ length: 16 }).map((_, i) => {
            const px =
              600 +
              i * 65 +
              Math.sin(t * 1.2 + i) * 18;

            const py =
              510 +
              Math.sin(i * 1.8) * 100 +
              Math.cos(t + i) * 12;

            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={3 + (i % 3)}
                fill="#F5DE8C"
                opacity={0.35 + pulse(t + i, 2) * 0.55}
                filter="url(#glow)"
              />
            );
          })}
        </>
      )}

      {/* =====================================================
          HỒI 3
          ===================================================== */}

      {id >= 15 && id <= 17 && (
        <>
          {id === 15 && (
            <>
              <SunDisc light={LAKE_NIGHT} r={32} core="#d5e8ff" glow={0.7} />
              <HazePlane color="#132438" opacity={0.3} />
              <MirrorLake />
              <Glitter x={960} horizon={650} bottom={950} t={t} color="#a8c8ea" strength={0.5} spread={0.7} />
              <Boat
                x={960}
                y={755}
                scale={1}
                t={t}
                adult={
                  <Adult
                    x={-52}
                    y={-20}
                    scale={.72}
                    pose="sit"
                    t={t}
                  />
                }
                child={
                  <Child
                    x={55}
                    y={-20}
                    scale={.9}
                    pose="still"
                    t={t}
                  />
                }
              />
            </>
          )}

          {id === 16 && (
            <>
              <HazePlane color="#0e1f2c" opacity={0.25} />
              <MirrorLake />
              <circle cx="960" cy="740" r={40 + p * 120} fill="#38efd8" opacity={0.35 * (1 - p * 0.5)} filter="url(#dl-blur-m)" />
              <Boat
                x={960}
                y={755}
                scale={1}
                t={t}
                adult={
                  <Adult
                    x={-52}
                    y={-20}
                    scale={.72}
                    pose="lookDown"
                    t={t}
                  />
                }
                child={
                  <Child
                    x={55}
                    y={-20}
                    scale={.9}
                    pose={p > .35 ? "reach" : "still"}
                    t={t}
                  />
                }
              />
              <RememberedChildhood t={t} p={p} />
            </>
          )}

          {id === 17 && (
            <>
              <SunDisc light={LAKE_GLOW} r={70} core="#d0fff4" glow={1.2} />
              <HazePlane color="#0d282e" opacity={0.28} />
              <MirrorLake />
              <AcceptanceOnLake t={t} p={p} />
            </>
          )}
        </>
      )}

      {id === 18 && (
        <>
          <SunDisc light={VILLAGE_WARM} r={55} core="#fff1d6" glow={1.1} />
          <HazePlane color="#ebd4b0" opacity={0.26} />
          <Village t={t} p={p} />
        </>
      )}

      {id === 19 && (
        <>
          <SharedMeal t={t} />
        </>
      )}

      {/* =====================================================
          HỒI 4
          ===================================================== */}

      {id >= 20 && id <= 21 && (
        <>
          {id === 20 && (
            <>
              <SunDisc light={STORM_APPROACH} r={36} core="#d5e8f5" glow={0.6} />
              <Parallax depth={0.65}><StormSky t={t} /></Parallax>
              <HazePlane color="#152232" opacity={0.28} />
              <Water t={t} dark violent />
              <Glitter x={STORM_APPROACH.x} horizon={715} t={t} color="#9ac0dd" strength={0.5} spread={0.7} />
            </>
          )}

          {id === 21 && (
            <>
              <SunDisc light={STORM_FLASH} r={46} core="#dffbff" glow={1.2} />
              <Parallax depth={0.65}><StormSky t={t} /></Parallax>
              <HazePlane color="#101d2a" opacity={0.32} />
              {/* Tia chớp lóe sáng */}
              {pulse(t * 4.2) > 0.65 && (
                <g opacity={0.65}>
                  <path d="M 980 160 L 960 270 L 990 310 L 965 410 L 980 440" stroke="#e0f8ff" strokeWidth="3" fill="none" filter="url(#glow)" />
                  <rect x={-400} y={-200} width={2720} height={1500} fill="#b0f2ff" opacity={0.12} />
                </g>
              )}
              <Water t={t} dark violent />
              <Glitter x={STORM_FLASH.x} horizon={715} t={t} color="#b0f2ff" strength={0.8} spread={0.9} />
            </>
          )}

          <Boat
            x={930 + Math.sin(t * 6) * 24}
            y={760 + Math.cos(t * 5) * 16}
            rotation={Math.sin(t * 7) * 5}
            scale={1.05}
            t={t}
            adult={
              <Adult
                x={-62}
                y={-20}
                scale={.74}
                pose="row"
                t={t}
              />
            }
            child={
              <Child
                x={78}
                y={-20}
                scale={.9}
                pose="still"
                t={t}
              />
            }
          />

          <BowSplash
            x={930 + Math.sin(t * 6) * 24 + 140}
            y={760 + Math.cos(t * 5) * 16 + 10}
            t={t}
            strength={id === 21 ? 1.5 : 1}
          />

          <CinematicRain
            t={t}
            intensity={
              id === 20
                ? lerp(0.4, 0.9, p)
                : 1
            }
          />
        </>
      )}

      {id >= 22 && id <= 25 && <WindToShore t={t} />}

      {id === 26 && (
        <>
          <SunDisc light={SUNSET_RIVER} r={62} core="#fff0d6" glow={1.1} />
          <Parallax depth={0.65}><Town warm opacity={0.88} /></Parallax>
          <HazePlane color="#f4bfa0" opacity={0.26} />
          <Water t={t} />
          <Glitter x={SUNSET_RIVER.x} horizon={712} t={t} color="#ffba70" strength={0.9} />
          <Landing />
          <path d="M 710 732 L 915 781 L 908 797 L 705 747 Z" fill="#bd986c" />
          <Boat x={1050} y={795} scale={1.1} t={t}
            child={<Child x={70} y={-20} scale={1} pose="still" t={t} />} />
          <Adult x={lerp(995, 700, ease(p))} y={lerp(772, 712, ease(p))}
            scale={.82} facing={-1} pose={p < .85 ? "walk" : "still"} t={t} ground />
          {/* Chó vàng mừng rỡ đón ở bến */}
          <StudioDog x={655} y={710} scale={0.68} t={t} pose="sit" facing={1} />
          <StudioBird species="swallow" x={lerp(700, 1300, (p * 1.2) % 1)} y={480 + Math.sin(t * 2.5) * 14} scale={0.6} t={t} />
        </>
      )}

      {id === 27 && t < 163 && (
        <>
          <SunDisc light={SUNSET} r={70} core="#ffe2a6" />
          <Parallax depth={0.6}><g transform="translate(240 120) scale(0.75)"><Town warm opacity={0.9} /></g></Parallax>
          <HazePlane color="#f4b98a" opacity={0.36} />
          <Parallax depth={0.8}><Town warm /></Parallax>
          <HazePlane color="#f4b98a" opacity={0.12} />
          <Water t={t} />
          <Glitter x={SUNSET.x} horizon={712} t={t} color="#ffcf7a" strength={1} />
          <Landing />

          {/* Chú chó vàng trung thành đứng kề bên Adult nhìn con thuyền trôi về phía hoàng hôn */}
          <StudioDog x={655} y={715} scale={0.65} t={t} pose="sit" facing={1} />

          <Adult
            x={700}
            y={715}
            scale={.7}
            pose="still"
            t={t}
            ground
          />

          <Boat
            x={1120}
            y={805}
            scale={.85}
            t={t}
            child={
              <Child
                x={75}
                y={-20}
                scale={.9}
                pose="still"
                t={t}
              />
            }
          />

          {/* Chim hạc bay về phía vầng thái dương hoàng hôn */}
          <StudioBird species="crane" x={lerp(1050, 1550, (p * 0.7) % 1)} y={430 + Math.sin(t * 1.2) * 10} scale={0.68} t={t} facing={1} />
        </>
      )}

      {t >= 163 && <EndingJourney t={t} />}

      </SceneLight.Provider>
      </CamCtx.Provider>
      <Vignette />
    </svg>
  );
};

/* ============================================================
   SUPPORTING ENVIRONMENTS
   ============================================================ */

const Mountains = ({ wonder = false }: { wonder?: boolean }) => (
  <>
    <path
      d="M0 610 L250 350 L520 520 L820 280 L1160 500 L1500 320 L1920 560 L1920 750 L0 750Z"
      fill={wonder ? "#62839a" : "#586573"}
      opacity=".42"
    />

    <path
      d="M0 675 L350 480 L700 610 L1080 430 L1470 600 L1920 450 L1920 760 L0 760Z"
      fill={wonder ? "#496f7d" : "#3f4d58"}
      opacity=".62"
    />
  </>
);

const Town = ({
  opacity = 1,
  warm = false,
}: {
  opacity?: number;
  warm?: boolean;
}) => (
  <g opacity={opacity}>
    {Array.from({ length: 11 }).map((_, i) => {
      const x = 130 + i * 170;
      const h = 100 + (i % 4) * 24;

      return (
        <g key={i}>
          <rect
            x={x}
            y={650 - h}
            width="125"
            height={h}
            fill={
              warm
                ? "#cfb991"
                : "#899198"
            }
          />

          <polygon
            points={`${x - 10},${650 - h}
                     ${x + 62},${600 - h}
                     ${x + 135},${650 - h}`}
            fill={
              warm
                ? "#ae634d"
                : "#555e66"
            }
          />

          <rect
            x={x + 25}
            y={610 - h / 2}
            width="18"
            height="25"
            fill={
              warm
                ? "#f0d17f"
                : "#b8b5a6"
            }
          />
        </g>
      );
    })}
  </g>
);

const Crowd = ({ t }: { t: number }) => (
  <g opacity=".42">
    {Array.from({ length: 18 }).map((_, i) => {
      const x =
        (i * 130 + t * (i % 2 ? 60 : -50) + 2100) %
        2100 -
        100;

      return (
        <g key={i} transform={`translate(${x} 760)`}>
          <circle cx="0" cy="-45" r="10" fill="#29323a" />
          <rect
            x="-9"
            y="-35"
            width="18"
            height="40"
            rx="4"
            fill="#424d55"
          />
        </g>
      );
    })}
  </g>
);

const Bridge = () => (
  <g filter="url(#soft-shadow)">
    <path
      d="
        M 610 840
        Q 960 715 1310 840
        L 1340 790
        Q 960 675 580 790
        Z
      "
      fill="#77736c"
    />

    <path
      d="M 600 785 Q 960 675 1320 785"
      fill="none"
      stroke="#4d4a46"
      strokeWidth="18"
    />
  </g>
);

const WindLines = ({
  t,
  opacity = 1,
}: {
  t: number;
  opacity?: number;
}) => (
  <g opacity={opacity} pointerEvents="none">
    {Array.from({ length: 8 }).map((_, i) => {
      const x = ((i * 240 + t * 450) % 2200) - 100;
      const y = 480 + (i % 4) * 60 + Math.sin(t * 3 + i) * 12;
      return (
        <path
          key={i}
          d={`M${x} ${y} q80 -18 160 0`}
          fill="none"
          stroke="#F8FAFC"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity={0.4}
        />
      );
    })}
  </g>
);

const FlyingFishCinematic = ({
  t,
  opacity = 1,
}: {
  t: number;
  opacity?: number;
}) => (
  <g opacity={opacity}>
    {Array.from({ length: 9 }).map((_, i) => {
      const depth = 0.45 + (i % 4) * 0.22;

      const x =
        280 +
        i * 180 +
        Math.sin(t * 0.6 + i) * 55;

      const y =
        300 +
        Math.sin(t * 1.15 + i * 0.7) * 120;

      const rot =
        Math.sin(t * 0.8 + i) * 12;

      return (
        <g
          key={i}
          transform={`
            translate(${x} ${y})
            rotate(${rot})
            scale(${depth})
          `}
          opacity={0.45 + depth * 0.4}
          filter={
            depth < 0.7
              ? "url(#blur)"
              : undefined
          }
        >
          <path
            d="
              M -55 0
              Q -18 -30 35 -10
              Q 58 0 35 12
              Q -18 30 -55 0
              Z
            "
            fill="#94D5DF"
          />

          <path
            d="
              M 30 -8
              L 72 -38
              L 60 0
              L 72 38
              L 30 10
              Z
            "
            fill="#70ADC2"
          />

          <path
            d="
              M -5 -15
              Q 8 -42 30 -18
            "
            fill="none"
            stroke="#CCEAEF"
            strokeWidth="7"
          />

          <circle
            cx="-35"
            cy="-7"
            r="4"
            fill="#223642"
          />
        </g>
      );
    })}
  </g>
);

const ClockFace = ({
  x,
  y,
  r,
  speed,
  t,
}: {
  x: number;
  y: number;
  r: number;
  speed: number;
  t: number;
}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle
      r={r}
      fill="#D0AB6F"
      stroke="#735A3B"
      strokeWidth={Math.max(4, r * 0.08)}
    />

    <line
      x1="0"
      y1="0"
      x2={Math.sin(t * speed) * r * 0.55}
      y2={-Math.cos(t * speed) * r * 0.55}
      stroke="#28313A"
      strokeWidth={Math.max(3, r * 0.06)}
    />

    <line
      x1="0"
      y1="0"
      x2={Math.sin(t * speed * 0.3) * r * 0.38}
      y2={-Math.cos(t * speed * 0.3) * r * 0.38}
      stroke="#28313A"
      strokeWidth={Math.max(4, r * 0.075)}
    />
  </g>
);

const ClockTownCinematic = ({ t }: { t: number }) => (
  <>
    <rect
      width="1920"
      height="1080"
      fill="#9B8B73"
      opacity=".18"
    />

    {/* silhouette nhà xiên lệch */}
    {Array.from({ length: 9 }).map((_, i) => {
      const x = 100 + i * 220;
      const h = 180 + (i % 4) * 55;

      return (
        <g
          key={`house-${i}`}
          transform={`
            translate(${x} ${720 - h})
            rotate(${i % 2 ? 2.5 : -2})
          `}
        >
          <rect
            width="160"
            height={h}
            fill="#6E6254"
          />

          <polygon
            points="-15,0 80,-65 175,0"
            fill="#554B43"
          />

          <ClockFace
            x={80}
            y={50 + h * 0.18}
            r={32 + (i % 3) * 10}
            speed={2 + i * 0.4}
            t={t}
          />
        </g>
      );
    })}

    {/* clock foreground tạo depth */}
    <g
      transform="translate(1550 430)"
      opacity=".7"
      filter="url(#soft-shadow)"
    >
      <ClockFace
        x={0}
        y={0}
        r={150}
        speed={5.5}
        t={t}
      />
    </g>
  </>
);

const MazeRiver = ({ p }: { p: number }) => (
  <g>
    <rect width="1920" height="1080" fill="#1C2D37" />
    {/* Nhánh sông mê cung */}
    <path
      d="M 960 1080 Q 820 850 620 720 T 320 480"
      fill="none"
      stroke="#385F71"
      strokeWidth="90"
      strokeLinecap="round"
    />
    <path
      d="M 960 1080 Q 940 850 1150 700 T 1520 450"
      fill="none"
      stroke="#4C809E"
      strokeWidth="80"
      strokeLinecap="round"
    />
    {/* Bờ vách uốn quanh */}
    <path
      d="M 0 650 Q 500 580 960 680 T 1920 620 L 1920 1080 L 0 1080 Z"
      fill="#13222B"
      opacity={0.85}
    />
  </g>
);

const ForestScene = ({ t, p }: { t: number; p: number }) => (
  <>
    <rect width="1920" height="1080" fill="#0C1B1F" />
    {/* Hàng cây bóng tối đan xen */}
    {Array.from({ length: 14 }).map((_, i) => {
      const tx = i * 150 - 50;
      const th = 550 + (i % 5) * 80;
      return (
        <g key={i} transform={`translate(${tx} ${720 - th})`} opacity={0.65 + (i % 3) * 0.15}>
          <rect x="30" y="0" width="22" height={th} fill="#061214" />
          <polygon points={`0,${th * 0.4} 41,0 82,${th * 0.4}`} fill="#0A1E22" />
          <polygon points={`5,${th * 0.6} 41,${th * 0.2} 77,${th * 0.6}`} fill="#0B2328" />
        </g>
      );
    })}
  </>
);

const idOpacity = (p: number) =>
  .14 + Math.sin(p * Math.PI) * .12;

const ForestGate = () => (
  <>
    <path
      d="M 0 700 Q 280 300 500 700 Z"
      fill="#193d38"
    />
    <path
      d="M 1920 700 Q 1650 300 1420 700 Z"
      fill="#193d38"
    />
  </>
);

const MirrorLake = () => (
  <>
    <rect y="620" width="1920" height="460" fill="#071320" />

    <ellipse
      cx="960"
      cy="750"
      rx="650"
      ry="95"
      fill="#5488a2"
      opacity=".42"
    />
  </>
);

const TearScene = ({ p }: { p: number }) => (
  <>
    {p < .42 && (
      <g
        transform="translate(950 655)"
        opacity={1 - p / .42}
      >
        <path
          d="M-100 0 Q0 -48 100 0 Q0 40 -100 0Z"
          fill="#d9d7cd"
          stroke="#172033"
          strokeWidth="4"
        />

        <circle r="28" fill="#23334b" />
        <circle cx="8" cy="-8" r="7" fill="#fff" />
      </g>
    )}

    {p >= .25 && p < .68 && (
      <circle
        cx="950"
        cy={lerp(655, 750, (p - .25) / .43)}
        r="8"
        fill="#8ed2e8"
        filter="url(#glow)"
      />
    )}

    {p >= .62 && (
      <>
        <circle
          cx="950"
          cy="750"
          r={lerp(0, 220, (p - .62) / .38)}
          stroke="#73bfd8"
          strokeWidth="5"
          fill="none"
          opacity={1 - (p - .62) / .38}
        />

        <circle
          cx="950"
          cy="750"
          r={lerp(0, 120, (p - .62) / .38)}
          fill="#81c8dc"
          opacity={lerp(.35, 0, (p - .62) / .38)}
          filter="url(#glow)"
        />
      </>
    )}
  </>
);

const Village = ({ t, p }: { t: number; p: number }) => (
  <>
    <rect width="1920" height="1080" fill="#d9b477" />

    <path
      d="M0 720 Q420 650 850 700 T1920 680 L1920 1080 L0 1080Z"
      fill="#65845e"
    />

    <rect
      x="300"
      y="520"
      width="250"
      height="170"
      fill="#e3d0a8"
    />

    <polygon
      points="260,520 425,425 590,520"
      fill="#a55343"
    />

    <path
      d={`
        M 500 460
        Q ${530 + Math.sin(t) * 25} 370
          500 310
        Q ${465 + Math.cos(t) * 20} 250
          510 190
      `}
      stroke="#ece6dc"
      strokeWidth="12"
      fill="none"
      opacity=".45"
    />

    <Water t={t} />

    {/* Đứa bé quê đứng bên bờ - phân biệt với Inner Child bằng áo nâu mộc mạc và nón lá */}
    <g transform="translate(710 690) scale(0.65)">
      {/* Nón lá */}
      <polygon points="-24,-52 0,-70 24,-52" fill="#d8b273" />
      <circle cx="0" cy="-48" r="9" fill="#2d221b" />
      {/* Áo bà ba nâu quê hương */}
      <path d="M -12 -38 Q 0 -44 12 -37 L 14 -7 L -14 -7 Z" fill="#6d482f" />
      {/* Quần sẫm màu */}
      <line x1="-5" y1="-7" x2="-6" y2="16" stroke="#231912" strokeWidth="5" />
      <line x1="5" y1="-7" x2="6" y2="16" stroke="#231912" strokeWidth="5" />
      {/* Tay vẫy chào nhẹ */}
      <line x1="8" y1="-30" x2={22 + Math.sin(t * 3) * 4} y2="-44" stroke="#6d482f" strokeWidth="4" strokeLinecap="round" />
    </g>

    {/* Quả cam tuổi thơ trôi êm ả theo dòng nước (dùng p thay vì teleport) */}
    <g transform={`translate(${lerp(720, 1150, p)} ${765 + Math.sin(t * 2.5 + p * 4) * 8})`}>
      <circle cx="0" cy="0" r="14" fill="#df762c" />
      <ellipse cx="-3" cy="-4" rx="4" ry="2" fill="#f89e58" opacity="0.6" />
      {/* Cuống và lá nhỏ */}
      <path d="M 0 -13 Q 5 -20 10 -18 Q 6 -13 0 -13" fill="#4d7c3b" />
      {/* Gợn nước quanh quả cam */}
      <ellipse cx="0" cy="10" rx="18" ry="4" fill="none" stroke="#b0d8ea" strokeWidth="1.5" opacity="0.5" />
    </g>
  </>
);

const RiceMemory = ({ t }: { t: number }) => (
  <>
    <rect
      x="300"
      y="620"
      width="1320"
      height="350"
      fill="#69432c"
    />

    <ellipse
      cx="960"
      cy="665"
      rx="125"
      ry="35"
      fill="#e8e5da"
    />

    <path
      d="M835 665 Q960 800 1085 665Z"
      fill="#f2eee2"
    />

    <ellipse
      cx="960"
      cy="650"
      rx="115"
      ry="45"
      fill="#fff"
    />

    {[-30, 10, 45].map((x, i) => (
      <path
        key={i}
        d={`
          M ${960 + x} 615
          Q ${930 + x + Math.sin(t + i) * 18} 555
            ${960 + x} 500
          Q ${990 + x + Math.cos(t + i) * 18} 445
            ${960 + x} 390
        `}
        stroke="#f9ead1"
        strokeWidth="7"
        fill="none"
        opacity=".5"
      />
    ))}
  </>
);

const StormSky = ({ t }: { t: number }) => (
  <>
    {Array.from({ length: 7 }).map((_, i) => (
      <ellipse
        key={i}
        cx={200 + i * 300 + Math.sin(t + i) * 40}
        cy={230 + (i % 3) * 60}
        rx="250"
        ry="100"
        fill="#192231"
        opacity=".88"
      />
    ))}
  </>
);

const CinematicRain = ({
  t,
  intensity = 1,
}: {
  t: number;
  intensity?: number;
}) => {
  return (
    <g pointerEvents="none">
      {/* Layer xa: mưa mỏng, blur */}
      <g
        opacity={0.16 * intensity}
        filter="url(#blur)"
      >
        {Array.from({ length: 22 }).map((_, i) => {
          const x =
            (i * 137 + t * 180 + 2000) % 2100 - 100;

          const y =
            (i * 91 + t * 310) % 1150 - 50;

          return (
            <path
              key={`far-${i}`}
              d={`M${x} ${y} l-18 55`}
              stroke="#C8E0EA"
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Layer giữa */}
      <g opacity={0.3 * intensity}>
        {Array.from({ length: 18 }).map((_, i) => {
          const x =
            (i * 181 + t * 390 + 2200) % 2200 - 120;

          const y =
            (i * 123 + t * 620) % 1200 - 60;

          return (
            <path
              key={`mid-${i}`}
              d={`M${x} ${y} q-10 28 -23 74`}
              stroke="#B1D1DD"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
      </g>

      {/* Foreground: chỉ vài giọt rất lớn */}
      <g
        opacity={0.45 * intensity}
        filter="url(#blur)"
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const x =
            (i * 337 + t * 650 + 2100) % 2100 - 80;

          const y =
            (i * 191 + t * 900) % 1150;

          return (
            <path
              key={`near-${i}`}
              d={`M${x} ${y} l-45 125`}
              stroke="#E1F0F4"
              strokeWidth="9"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* mist/haze gần mặt nước */}
      <rect
        x="0"
        y="650"
        width="1920"
        height="430"
        fill="#9DB7C2"
        opacity={0.07 * intensity}
      />
    </g>
  );
};

const BowSplash = ({x,y,t,strength=1}: {x:number;y:number;t:number;strength?:number}) => (
  <g transform={`translate(${x} ${y+12})`} opacity={clamp(.6*strength)}>
    {/* Low foam at the waterline, with separate droplets rather than a radial fan. */}
    <path d="M-42 4 Q-24 -5 -7 2 Q8 -5 25 4 Q11 12 -8 9 Q-26 14 -42 4Z" fill="#d7eaf0" opacity=".7" />
    <path d="M-58 16 Q-22 23 20 15" stroke="#a9d3df" strokeWidth="2.5" fill="none" />
    {[0,1,2,3,4].map(i=>{
      const k=(t*1.7+i*.21)%1;
      return <ellipse key={i} cx={-5+k*(32+i*8)} cy={-Math.sin(k*Math.PI)*(12+i*4)*Math.min(strength,1.4)}
        rx={2+i%2} ry={3+i%2} fill="#d9edf2" opacity={Math.sin(k*Math.PI)*.75} />;
    })}
  </g>
);

const UnderwaterConflict = ({ t, p }: {t: number; p: number}) => (
  <>
    <rect width="1920" height="1080" fill="#17394c" />
    <path d="M400 450 Q960 390 1550 440" stroke="#8cbdc8" strokeWidth="8" fill="none" opacity=".5" />
    {/* Dark currents trail behind and dissolve when the grip on the oar loosens. */}
    {[0,1,2].map(i=><path key={i} d={`M${600+i*35} ${790+i*25} Q780 ${680+i*30} 950 755`}
      stroke="#0b2438" strokeWidth="14" fill="none" opacity={.5*(1-p)} />)}
    <Boat x={990} y={lerp(780, 735, ease(p))} scale={1.12}
      rotation={lerp(12, 3, ease(p))} t={t}
      adult={<Adult x={-25} y={-22} scale={.82} pose={p < .4 ? "row" : "reach"} t={t} />}
      child={<Child x={39} y={-28} scale={1} pose="reach" t={t} />} />
    {/* The oar drifts away as the adult accepts the child's outstretched hand. */}
    {p > .4 && <g opacity={1-clamp((p-.4)/.6)} transform={`translate(${820-p*100} ${790+p*80}) rotate(-25)`}>
      <path d="M0 0 L100 0 L120 -9 L120 9 L100 0" stroke="#cda677" strokeWidth="6" fill="#cda677" />
    </g>}
    {[0,1,2,3,4].map(i=><circle key={i} cx={820+i*85} cy={850-((t*28+i*45)%350)} r={4+i%3} fill="none" stroke="#b9e3df" opacity=".45" />)}
  </>
);

const UnderwaterRelease = ({ t, p }: {t: number; p: number}) => (
  <>
    <rect width="1920" height="1080" fill="#214e64" />
    {[0,1,2,3].map(i=><path key={i} d={`M ${760+i*110} 180 L ${590+i*210} 1000 L ${700+i*210} 1000 Z`}
      fill="#f6e5ad" opacity={.06 + p*.1} />)}
    <ellipse cx="990" cy="420" rx="350" ry="38" fill="#cfe3cb" opacity={.2+p*.5} />
    <Boat x={990} y={lerp(735, 650, ease(p))} scale={1.12} rotation={lerp(3, 0, ease(p))} t={t}
      adult={<Adult x={-25} y={-22} scale={.82} pose="reach" t={t} />}
      child={<Child x={39} y={-28} scale={1} pose="reach" t={t} />} />
    <rect width="1920" height="1080" fill="#f2dba6" opacity={clamp((p-.8)/.2)*.65} />
  </>
);

const AwakeningEye = ({ p }: { p: number }) => (
  <>
    <rect
      width="1920"
      height="1080"
      fill="#edc983"
    />

    <g transform="translate(960 650)">
      <path
        d={`
          M -150 0
          Q 0 ${lerp(-4, -65, ease(p))}
            150 0
          Q 0 ${lerp(4, 55, ease(p))}
            -150 0 Z
        `}
        fill="#eee3cf"
        stroke="#1a2330"
        strokeWidth="5"
      />

      <circle
        r={lerp(15, 38, ease(p))}
        fill="#263647"
      />

      <circle
        cx="12"
        cy="-12"
        r="10"
        fill="#f3ba55"
        filter="url(#glow)"
      />
    </g>
  </>
);

const PathToFuture = () => (
  <>
    <path
      d="M0 820 Q700 650 1920 500 L1920 1080 L0 1080Z"
      fill="#938060"
    />

    <circle
      cx="1500"
      cy="410"
      r="140"
      fill="#e9b35b"
      opacity=".65"
      filter="url(#glow)"
    />
  </>
);

const Leaf = ({
  x,
  y,
  t,
}: {
  x: number;
  y: number;
  t: number;
}) => (
  <g
    transform={`translate(${x} ${y}) rotate(${Math.sin(t * 3) * 45})`}
  >
    <path
      d="M0 -22 L7 -7 L20 -9 L10 3 L15 18 L0 10 L-15 18 L-10 3 L-20 -9 L-7 -7Z"
      fill="#c85b3a"
    />
  </g>
);

// The same stone landing at departure and return makes the journey circular.
const Landing = () => (
  <g>
    <path d="M0 660 Q300 645 680 700 L720 745 L0 800 Z" fill="#778265" />
    <path d="M470 698 L730 710 L730 748 L470 736 Z" fill="#a99b80" />
    {[0,1,2,3,4].map(i=><path key={i} d={`M${470+i*52} 701 L${470+i*52} 734`} stroke="#716c61" strokeWidth="3" />)}
    <path d="M0 710 Q330 685 600 714" stroke="#ccbc98" strokeWidth="28" fill="none" />
  </g>
);

const RememberedChildhood = ({t, p}: {t: number; p: number}) => {
  const remember=ease(clamp((p-.15)/.4));
  return <>
    <defs><clipPath id="memory-reflection"><ellipse cx="930" cy="919" rx="165" ry="112" /></clipPath></defs>
    {/* One reflection, directly beneath the adult, changes from his present self into his childhood self. */}
    <path d="M810 815 Q960 890 1110 815Z" fill="#ad845b" opacity=".16" />
    <path d="M974 816 V986" stroke="#b89876" strokeWidth="4" opacity=".12" />
    <g clipPath="url(#memory-reflection)">
      <g transform={`translate(${908+Math.sin(t*.8)*2} 899) scale(.9 -.9)`} stroke="#bad8d3" strokeWidth="1.5">
        <Adult x={0} y={0} pose="still" t={t} opacity={.65*(1-remember)} />
        <Child x={0} y={0} scale={1.5} pose={p > .55 ? "heart" : "still"} t={t} opacity={.95*remember} />
        <circle cx="0" cy="-72" r="14" fill="#c0ac8f" stroke="#bad8d3" opacity={.6*remember} />
      </g>
      {/* Thin horizontal ripples establish the image as a water reflection. */}
      {[0,1,2,3,4,5].map(i=><path key={i} d={`M760 ${866+i*27} Q915 ${862+i*27+Math.sin(t+i)*3} 1090 ${866+i*27}`}
        stroke="#82a8b8" strokeWidth="2" fill="none" opacity=".45" />)}
    </g>
    <path d="M900 811 Q870 831 898 854" stroke="#a5ceca" strokeWidth="2" fill="none" opacity=".35" />
    <ellipse cx="908" cy="960" rx="78" ry="12" fill="none" stroke="#b0d9d0" strokeWidth="2" opacity={remember*.25} />
  </>;
};

const AcceptanceOnLake = ({t, p}: {t: number; p: number}) => (
  <>
    <Boat x={960} y={755} scale={1.15} t={t}
      adult={<Adult x={-25} y={-22} scale={.82} pose="reach" t={t} />}
      child={<Child x={39} y={-28} scale={1} pose="reach" t={t} />} />
    <circle cx="925" cy={lerp(650, 830, clamp(p/.45))} r="5" fill="#c6e9e1" opacity={1-clamp((p-.45)/.1)} />
    {[0,1,2].map(i=>{
      const k=clamp((p-.35-i*.08)/.5);
      return <ellipse key={i} cx="925" cy="835" rx={10+k*330} ry={4+k*65}
        stroke="#91d2c2" strokeWidth="3" fill="none" opacity={k > 0 ? (1-k)*.8 : 0} />;
    })}
    <ellipse cx="960" cy="835" rx={p*410} ry={p*75} fill="#80c7b5" opacity={p*.12} />
  </>
);

const SharedMeal = ({t}: {t: number}) => (
  <>
    <rect width="1920" height="1080" fill="#c6a171" />
    <rect x="600" y="400" width="710" height="330" fill="#e0c59a" />
    <rect x="840" y="410" width="260" height="150" fill="#c87e64" />
    <path d="M970 410 V560 M840 485 H1100" stroke="#8d6850" strokeWidth="10" />
    <Adult x={740} y={730} scale={1.4} pose="sit" t={t} />
    <Child x={1175} y={718} scale={1.7} pose="reach" t={t} />
    <path d="M760 687 L1170 687 L1220 730 L710 730 Z" fill="#896044" />
    <path d="M750 730 V835 M1175 730 V835" stroke="#694e3d" strokeWidth="15" />
    {[870,1025].map(x=><g key={x}>
      <path d={`M${x-35} 674 Q${x} 731 ${x+35} 674Z`} fill="#eee2cc" />
      <ellipse cx={x} cy="674" rx="35" ry="8" fill="#faf1dd" />
      <path d={`M${x} 654 Q${x+Math.sin(t)*8} 630 ${x} 610`} stroke="#f4e7cf" strokeWidth="3" opacity=".55" fill="none" />
    </g>)}
  </>
);

const ReturnToLanding = ({t, p}: {t: number; p: number}) => (
  <>
    <Town warm />
    <Water t={t} />
    <Landing />
    <Boat x={lerp(1250,1050,ease(p))} y={795} scale={1.1} t={t}
      adult={<Adult x={-50} y={-22} scale={.82} pose={p < .4 ? "sit" : "still"} t={t} />}
      child={<Child x={70} y={-20} scale={1} pose="point" t={t} />} />
    <path d="M710 732 L915 781 L908 797 L705 747Z" fill="#bd986c" opacity={clamp((p-.65)/.35)} />
  </>
);

const RiverFork = ({t}: {t:number}) => (
  <>
    <rect width="1920" height="1080" fill="#809fa8" />
    <path d="M0 350 Q320 260 700 360 T1920 320 L1920 1080 L0 1080Z" fill="#647c67" />
    {/* Town on the left bank, continuing the clock motif from the preceding shots. */}
    {[0,1,2,3,4].map(i=><g key={i} transform={`translate(${90+i*110} ${410+(i%2)*20})`}>
      <rect width="90" height="155" fill="#9d927c" />
      <path d="M-10 0 L45 -42 L100 0Z" fill="#665d54" />
      <circle cx="45" cy="44" r="22" fill="#e0c795" />
      <path d="M45 27 V44 L57 49" stroke="#625749" strokeWidth="3" fill="none" />
      <rect x="30" y="110" width="26" height="45" fill="#4c5958" />
    </g>)}
    {/* Two broad waterways are separated by a visible island. */}
    <path d="M0 565 Q320 570 570 670 Q810 760 960 830 Q1190 750 1440 580 Q1670 485 1920 500 L1920 710 Q1650 680 1440 780 Q1200 900 1130 1080 L650 1080 Q650 890 460 820 Q200 750 0 770Z" fill="url(#river)" />
    <path d="M570 520 Q930 465 1340 470 L1490 540 Q1260 640 1010 780 Q800 640 570 600Z" fill="#6a805f" />
    <path d="M580 600 Q820 665 1010 780 Q1250 645 1490 540" stroke="#b7ad83" strokeWidth="12" fill="none" />
    {/* Actual walking figures establish the busy route without abstract dots. */}
    {[0,1,2,3,4,5].map(i=><Adult key={i} x={110+i*85+Math.sin(t+i)*6} y={538+i%2*5} scale={.55} pose="walk" t={t+i} opacity={.75} />)}
    {/* Forest along the right branch; warm gaps invite the boat onward. */}
    {[0,1,2,3,4,5,6].map(i=><g key={i} transform={`translate(${1260+i*95} ${440-i%3*22})`}>
      <path d="M0 90 L32 -105 L68 90Z" fill={i%2 ? '#344f43' : '#436451'} />
      <path d="M32 60 V145" stroke="#405044" strokeWidth="13" />
    </g>)}
    {[0,1,2,3,4].map(i=><path key={i} d={`M${1120+i*90} ${790-i*40} q50 -32 105 -35`} stroke="#acd0d4" strokeWidth="3" fill="none" opacity=".55" />)}
    <path d="M580 890 Q800 875 960 920 M40 690 Q220 660 390 730" stroke="#a7c8ce" strokeWidth="3" fill="none" opacity=".45" />
  </>
);

// A continuous passage from struggle to trust, calm water and the familiar shore.
const WindToShore = ({t}: {t:number}) => {
  const throwAt = 130 + 26 / 30; // Studio timecode 02:10.26 at 30 fps
  const thrown = t >= throwAt;
  const toss = clamp((t-throwAt)/1.4);
  const settle = ease(clamp((t-throwAt)/10.5));
  const dock = ease(clamp((t-141.5)/7));
  const motion = 1-settle;
  const bx = lerp(930,1050,ease(clamp((t-128)/20.5)));
  const by = lerp(760,795,dock)+Math.sin(t*2.5)*12*motion;
  const angle = Math.sin(t*2.2)*5*motion;
  return <>
    <rect width="1920" height="1080" fill="url(#sky-home)" />
    <rect width="1920" height="1080" fill="#172333" opacity={1-settle} />

    {/* Bầu trời giông bão khi còn sóng gió */}
    {motion > 0.02 && (
      <g opacity={motion}>
        <Parallax depth={0.65}>
          <StormSky t={t} />
        </Parallax>
        <HazePlane color="#152232" opacity={0.28} />
      </g>
    )}

    {/* Ánh bình minh / hửng nắng khi cập bến */}
    {dock > 0.02 && (
      <g opacity={dock}>
        <SunDisc light={SUN_BREAK} r={55} core="#fff1d0" glow={1.1} />
        <Parallax depth={0.65}>
          <Town warm opacity={0.9} />
        </Parallax>
        <HazePlane color="#f4c898" opacity={0.22} />
      </g>
    )}

    <path d="M0 700 Q480 695 960 700 T1920 700 L1920 1080 L0 1080Z" fill="url(#river)" />
    <rect y="710" width="1920" height="370" fill="#10253c" opacity={motion*.8} />

    {/* Phản chiếu nước */}
    {motion > 0.05 && (
      <Glitter x={1150} horizon={712} t={t} color="#a5e5ff" strength={0.45 * motion} spread={0.8} />
    )}
    {dock > 0.05 && (
      <Glitter x={SUN_BREAK.x} horizon={712} t={t} color="#ffd485" strength={0.85 * dock} />
    )}

    {Array.from({length:9}).map((_,i)=>{
      const y=730+i*35;
      const a=Math.sin(t*(2+motion*3)+i)*(2+motion*30);
      return <path key={i} d={`M0 ${y} Q320 ${y+a} 640 ${y-a} T1280 ${y} T1920 ${y}`}
        stroke="#a3c8d8" strokeWidth={lerp(4,1.5,settle)} opacity={lerp(.55,.24,settle)} fill="none" />;
    })}

    <g opacity={dock}><Landing /></g>
    {dock > .65 && <path d="M710 732 L915 781 L908 797 L705 747Z" fill="#bd986c" opacity={clamp((dock-.65)/.35)} />}
    <Boat x={bx} y={by} scale={lerp(1.05,1.1,dock)} rotation={angle} t={t} sailWind={thrown ? 1 : .3}
      adult={<Adult x={-62} y={-22} scale={.78}
        facing={thrown && toss < .7 ? -1 : 1}
        pose={!thrown ? "row" : toss < .7 ? "reach" : "still"} t={t} />}
      child={<Child x={70} y={-20} scale={.96} pose={settle > .8 ? "point" : "still"} t={t} />} />
    {/* The detached oar leaves his hand at Studio frame 3926 (02:10.26) and falls into the wake. */}
    {thrown && toss < 1 && <g
      transform={`translate(${bx-55-toss*230} ${by-40-Math.sin(toss*Math.PI)*100+toss*100}) rotate(${-40-toss*180})`}
      opacity={1-clamp((toss-.8)/.2)}>
      <path d="M-45 0 H42 L65 -10 L65 10 L42 0" stroke="#bb8d5e" strokeWidth="6" fill="#bb8d5e" />
    </g>}
    {t >= throwAt+1 && t < throwAt+2.2 && <ellipse cx={bx-270} cy={by+60}
      rx={12+clamp((t-throwAt-1)/1.2)*55} ry="8" fill="none" stroke="#c2dce3"
      strokeWidth="2" opacity={1-clamp((t-throwAt-1)/1.2)} />}
    <WindLines t={t*.13} opacity={thrown ? .13+.1*motion : .08} />
    <CinematicRain t={t} intensity={motion*.85} />
  </>;
};

function endingCamera(t:number): Camera {
  if(t >= 180) {
    const p=ease(clamp((t-180)/23));
    const w=lerp(760,1500,p);
    return {x:clamp(lerp(400,1000,p),0,1920-w),y:lerp(390,140,p),w,h:w*9/16};
  }
  t = 163 + (t-163)*30/17;
  const pull=ease(clamp((t-193)/11));
  return {x:lerp(420,0,pull),y:lerp(380,0,pull),w:lerp(1150,1920,pull),h:lerp(646.875,1080,pull)};
}

const FarewellAtDock = ({t}: {t:number}) => {
  const pause=clamp((t-163)/5);
  const farewell=clamp((t-180)/13);
  const future=ease(clamp((t-193)/11));
  const launch=ease(clamp((t-180.8)/2.5));
  const childHeart=t >= 168 && t < 172;
  const childShore=t >= 172 && t < 177;
  const adultHeart=t >= 173 && t < 180;
  const pushing=t >= 180.8 && t < 183.3;
  const bx=t < 168 ? lerp(1050,900,ease(pause)) : t < 180 ? 900 : t < 193 ? lerp(900,1430,ease(farewell)) : lerp(1430,1730,future);
  const boatScale=t < 180 ? 1.1 : t < 193 ? lerp(1.1,.82,ease(farewell)) : lerp(.82,.4,future);
  const descend=clamp((t-180)/.8);
  const returnUp=clamp((t-183.3)/1.5);
  const ax=t < 180 ? lerp(700,720,ease(pause)) : t < 183.3 ? lerp(720,750,descend) : t < 193 ? lerp(750,700,returnUp) : lerp(700,320,future);
  const ay=t < 180 ? 712 : t < 183.3 ? lerp(712,755,descend) : t < 193 ? lerp(755,712,returnUp) : lerp(712,625,future);
  return <>
    <SunDisc light={SUNSET_DOCK} r={72} core="#ffe3ae" glow={1.25} />
    <Parallax depth={0.6}><g transform="translate(200 100) scale(0.8)"><Town warm opacity={0.88} /></g></Parallax>
    <HazePlane color="#f4b584" opacity={0.32} />
    <Parallax depth={0.8}><Town warm opacity={0.96} /></Parallax>
    <HazePlane color="#f4b584" opacity={0.12} />

    <Water t={t*.25} />
    <Glitter x={SUNSET_DOCK.x} horizon={712} t={t} color="#ffa866" strength={1.05} />
    <Landing />
    {/* A path leads back to the familiar town, rather than an empty horizon. */}
    <path d="M690 722 Q520 710 330 645 L290 617" stroke="#cebb94" strokeWidth="28" fill="none" />
    <path d="M715 735 H742 V752 H766 V778 H790 V798 H740 V766 H715Z" fill="#a99b80" />
    <Boat x={bx} y={t < 193 ? 795 : lerp(795,735,future)} scale={boatScale} t={t} sailWind={.5}
      text={t >= 180 ? "HÃY ĐI TIẾP NÀO" : undefined}
      child={<Child x={70} y={-20} scale={1}
        pose={childHeart ? "heart" : childShore ? "shore" : t >= 184 && t < 193 ? "wave" : "still"} t={t*.65} />} />
    <Adult x={ax} y={ay} scale={t < 193 ? .95 : lerp(.95,.8,future)}
      facing={t >= 193 ? -1 : 1}
      pose={t >= 193 ? "walk" : t >= 192 ? "heart" : pushing ? "push" : adultHeart ? "heart" : t >= 185 ? "wave" : t < 165 ? "walk" : "still"}
      t={t*.48} ground />
    {/* Chú chó vàng trung thành kề bên Adult trên bến cảng */}
    <StudioDog x={ax - 55} y={ay + 2} scale={0.7} t={t} pose="sit" facing={1} />
    {/* Chim hạc bay về phía hoàng hôn */}
    <StudioBird species="crane" x={lerp(1050, 1650, ((t - 163) / 17) % 1)} y={420 + Math.sin(t * 1.5) * 14} scale={0.72} t={t} facing={1} />
    {/* A final quiet touch to the chest before walking towards his adult life. */}
    {launch > 0 && launch < 1 && <ellipse cx={bx-160} cy="826" rx={20+launch*60} ry="9"
      stroke="#c0d8df" strokeWidth="2" fill="none" opacity={1-launch} />}

    <rect width="1920" height="1080" fill="#080b10" opacity={clamp((t-204)/2.9)} />
  </>;
};

const EndingJourney = ({t}: {t:number}) => {
  if(t < 180) return <FarewellAtDock t={163+(t-163)*30/17} />;
  const p=clamp((t-180)/24);
  const runnerX=lerp(660,1460,ease(p));
  const lightX=runnerX+155;
  return <>
    {/* Repeat the opening street, with a changed purpose and a living ray of light. */}
    <rect width="1920" height="1080" fill="url(#sky-grey)" />
    <rect width="1920" height="1080" fill="url(#sky-home)" opacity={ease(p)*.75} />

    <SunDisc light={TWILIGHT_WALK} r={56} core="#ffd499" glow={1.25} />
    <Parallax depth={0.6}><Town opacity={0.35} /></Parallax>
    <HazePlane color="#e2c8b8" opacity={0.22} />
    <Parallax depth={0.8}><Town opacity={0.8} warm /></Parallax>

    <path d="M0 680 Q960 650 1920 680 L1920 1080 L0 1080Z" fill="#727b7c" />
    <path d="M0 775 Q960 740 1920 775" fill="none" stroke="#a9a8a0" strokeWidth="5" opacity=".5" />
    <Crowd t={t} />
    <path d={`M${runnerX-80} 758 Q${runnerX+35} 725 ${lightX} 747 Q${lightX+180} 790 1840 665`}
      stroke="#f4cc75" strokeWidth="9" fill="none" opacity=".5" filter="url(#glow)" />
    <path d={`M${runnerX} 750 Q${runnerX+60} 736 ${lightX} 745`}
      stroke="#fff0b3" strokeWidth="3" fill="none" opacity=".9" />
    <ellipse cx={lightX} cy={704+Math.sin(t*1.6)*10} rx="14" ry="7" fill="#ffe7a0" filter="url(#glow)" />
    <path d={`M${lightX} 720 L${lightX+135} 300 L${lightX+250} 300Z`} fill="#f7d28e" opacity=".09" />
    <CastShadow x={runnerX} y={758} h={130} light={TWILIGHT_WALK} opacity={0.42} />
    <Adult x={runnerX} y={729-Math.abs(Math.sin(t*10))*4} scale={1}
      pose={t < 203.5 ? "run" : "still"} t={t} />

    <rect width="1920" height="1080" fill="#080b10" opacity={clamp((t-204)/2.9)} />
  </>;
};

// Blend complete rendered shots, including their camera framing, at actual cuts.
// The wind-to-shore passage stays continuous across its internal timeline markers.
const RIVER_CUTS = [4.5,8.5,15,21.8,28.5,35.5,43.7,53.5,58.5,63.1,70,76,83.5,91,96,102,106.5,112.5,117.5,123,128,148.5,156.5,163,180];
export const RiverJourneyScene: React.FC<SceneProps> = (props) => {
  const cut = RIVER_CUTS.find(at => props.t >= at && props.t < at + .45);
  if(cut === undefined) return <RiverJourneyFrame {...props} />;
  const opacity = smooth(clamp((props.t-cut)/.45));
  return <div style={{position:'absolute',inset:0}}>
    <div style={{position:'absolute',inset:0}}>
      <RiverJourneyFrame {...props} t={cut-1/30} />
    </div>
    <div style={{position:'absolute',inset:0,opacity}}>
      <RiverJourneyFrame {...props} />
    </div>
  </div>;
};
