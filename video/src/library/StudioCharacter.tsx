import React from "react";

/**
 * 🎭 HỆ THỐNG NHÂN VẬT CHUẨN STUDIO SENORE (Universal Studio Character Kit)
 * Kế thừa và nâng cấp từ khung xương giải phẫu tinh tế của Video 001 & 002.
 * Thay thế hoàn toàn các hình vẽ đơn sơ/que gậy bằng đồ họa cắt giấy vector có cấu trúc giải phẫu 11 khớp,
 * chuyển động mượt mà, thớ vải bay theo gió và ánh sáng viền (Rim Light).
 */

export type StudioPoseName =
  | "stand"
  | "walk"
  | "run"
  | "walkWind"
  | "row" // Chèo thuyền nhịp nhàng
  | "push" // Đẩy thuyền rời bến
  | "point" // Chỉ tay về phía chân trời
  | "wave" // Vẫy tay chào đón / từ biệt
  | "heart" // Đặt tay lên ngực trái
  | "reach" // Vươn tay với lấy
  | "look" // Ngẩng đầu nhìn trời / mây
  | "lookDown" // Cúi đầu trầm ngâm
  | "crouch" // Ngồi xổm
  | "sit" // Ngồi thẳng
  | "sitEdge" // Ngồi mép thuyền đung đưa chân
  | "desk"; // Ngồi bàn làm việc

type PoseJoints = {
  torso: number; // Góc nghiêng thân (-/+)
  head: number; // Góc cúi/ngẩng đầu
  hipL: number;
  kneeL: number;
  hipR: number;
  kneeR: number;
  shL: number;
  elL: number;
  shR: number;
  elR: number;
  bob?: number; // Độ nhún trọng tâm
};

const deg = (d: number) => (d * Math.PI) / 180;
type Pt = [number, number];
const down = (o: Pt, len: number, a: number): Pt => [
  o[0] + Math.sin(deg(a)) * len,
  o[1] + Math.cos(deg(a)) * len,
];
const up = (o: Pt, len: number, a: number): Pt => [
  o[0] + Math.sin(deg(a)) * len,
  o[1] - Math.cos(deg(a)) * len,
];

export const studioPoseAt = (name: StudioPoseName, t: number): PoseJoints => {
  switch (name) {
    case "walk": {
      const s = Math.sin(t * 4.2);
      return {
        torso: 4,
        head: 4,
        hipL: 24 * s,
        kneeL: 8 + 30 * Math.max(0, -s),
        hipR: -24 * s,
        kneeR: 8 + 30 * Math.max(0, s),
        shL: -20 * s,
        elL: 18,
        shR: 20 * s,
        elR: 18,
        bob: 0.012 * Math.abs(Math.cos(t * 4.2)),
      };
    }
    case "run": {
      const s = Math.sin(t * 8.5);
      return {
        torso: 16,
        head: 8,
        hipL: 42 * s,
        kneeL: 20 + 55 * Math.max(0, -s),
        hipR: -42 * s,
        kneeR: 20 + 55 * Math.max(0, s),
        shL: -45 * s,
        elL: 65,
        shR: 45 * s,
        elR: 65,
        bob: 0.03 * Math.abs(Math.cos(t * 8.5)),
      };
    }
    case "walkWind": {
      const s = Math.sin(t * 3.2);
      return {
        torso: 20,
        head: 14,
        hipL: 18 * s + 6,
        kneeL: 12 + 26 * Math.max(0, -s),
        hipR: -18 * s + 6,
        kneeR: 12 + 26 * Math.max(0, s),
        shL: 25 - 10 * s,
        elL: 30,
        shR: 112,
        elR: 98,
        bob: 0.01 * Math.abs(Math.cos(t * 3.2)),
      };
    }
    case "row": {
      // Chu kỳ chèo thuyền 2.5s: ngả về trước đẩy mạn -> kéo mạnh về sau
      const s = Math.sin(t * 2.8);
      const pushPhase = s > 0;
      return {
        torso: pushPhase ? -15 * s : -8 * s,
        head: 12 - s * 8,
        hipL: 75,
        kneeL: 90,
        hipR: 78,
        kneeR: 88,
        shL: 45 - s * 35,
        elL: 50 + s * 25,
        shR: 40 - s * 35,
        elR: 45 + s * 25,
      };
    }
    case "push": {
      return {
        torso: 26,
        head: 18,
        hipL: 28,
        kneeL: 35,
        hipR: -18,
        kneeR: 15,
        shL: 75,
        elL: 25,
        shR: 85,
        elR: 20,
      };
    }
    case "point": {
      return {
        torso: -2,
        head: -8,
        hipL: 4,
        kneeL: 2,
        hipR: -4,
        kneeR: 2,
        shL: 10,
        elL: 12,
        shR: 78,
        elR: -6 + Math.sin(t * 1.5) * 3, // tay chỉ thẳng về trước, hơi rung nhẹ
      };
    }
    case "wave": {
      const sw = Math.sin(t * 6.5) * 22;
      return {
        torso: 2,
        head: -4,
        hipL: 4,
        kneeL: 2,
        hipR: -4,
        kneeR: 2,
        shL: 8,
        elL: 12,
        shR: 145, // tay giơ cao
        elR: 45 + sw, // vẫy cẳng tay
      };
    }
    case "heart": {
      return {
        torso: 3,
        head: 14,
        hipL: 4,
        kneeL: 2,
        hipR: -4,
        kneeR: 2,
        shL: 8,
        elL: 12,
        shR: 35,
        elR: 108, // gập cánh tay áp sát lên ngực
      };
    }
    case "reach": {
      return {
        torso: 6,
        head: 2,
        hipL: 6,
        kneeL: 4,
        hipR: -6,
        kneeR: 2,
        shL: 8,
        elL: 10,
        shR: 82,
        elR: 6 + 3 * Math.sin(t * 1.5),
      };
    }
    case "look": {
      return {
        torso: -4,
        head: -18,
        hipL: 3,
        kneeL: 1,
        hipR: -3,
        kneeR: 1,
        shL: 6,
        elL: 8,
        shR: -4,
        elR: 8,
      };
    }
    case "lookDown": {
      return {
        torso: 8,
        head: 28,
        hipL: 4,
        kneeL: 2,
        hipR: -4,
        kneeR: 2,
        shL: 6,
        elL: 12,
        shR: 8,
        elR: 14,
      };
    }
    case "sit":
    case "sitEdge": {
      const sw = Math.sin(t * 2.2) * 10;
      return {
        torso: 2,
        head: 4 + 2 * Math.sin(t * 0.6),
        hipL: 88,
        kneeL: 80 + sw,
        hipR: 84,
        kneeR: 72 - sw,
        shL: 20,
        elL: 30,
        shR: 28,
        elR: 30,
      };
    }
    case "desk": {
      return {
        torso: 24,
        head: 30 + 2 * Math.sin(t * 0.7),
        hipL: 90,
        kneeL: 90,
        hipR: 88,
        kneeR: 86,
        shL: 55,
        elL: 45,
        shR: 72,
        elR: 22,
      };
    }
    default: {
      return {
        torso: 0,
        head: 3 + 2 * Math.sin(t * 0.6),
        hipL: 3,
        kneeL: 1,
        hipR: -3,
        kneeR: 1,
        shL: 6,
        elL: 8,
        shR: -4,
        elR: 8,
      };
    }
  }
};

/** Khớp nối hình con nhộng mềm mại (Capsule limb) */
const capsuleLimb = (
  a: Pt,
  b: Pt,
  wa: number,
  wb: number,
  color: string,
  key: string
) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const f = (v: number) => v.toFixed(1);
  return (
    <g key={key}>
      <path
        d={`M${f(a[0] + (nx * wa) / 2)},${f(a[1] + (ny * wa) / 2)} L${f(
          b[0] + (nx * wb) / 2
        )},${f(b[1] + (ny * wb) / 2)} L${f(b[0] - (nx * wb) / 2)},${f(
          b[1] - (ny * wb) / 2
        )} L${f(a[0] - (nx * wa) / 2)},${f(a[1] - (ny * wa) / 2)} Z`}
        fill={color}
      />
      <circle cx={a[0]} cy={a[1]} r={wa / 2} fill={color} />
      <circle cx={b[0]} cy={b[1]} r={wb / 2} fill={color} />
    </g>
  );
};

export type StudioCharacterProps = {
  archetype?: "adult" | "child" | "elder" | "youth";
  pose?: StudioPoseName;
  t: number;
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  wind?: number;
  color?: string; // Khi muốn vẽ bóng đen silhouette
  palette?: {
    coat: string;
    pants: string;
    skin: string;
    hair: string;
    shoe?: string;
    scarf?: string;
  };
  rim?: string; // Ánh sáng ven viền (Rim Light)
  hat?: "none" | "non" | "hood";
  opacity?: number;
};

export const StudioCharacter: React.FC<StudioCharacterProps> = ({
  archetype = "adult",
  pose = "stand",
  t,
  x,
  y,
  scale = 1.0,
  facing = 1,
  wind = 0.2,
  color,
  palette,
  rim,
  hat = "none",
  opacity = 1.0,
}) => {
  // Chiều cao cơ bản chuẩn tỷ lệ
  const H = archetype === "child" ? 115 : archetype === "elder" ? 185 : 195;

  // Bảng màu mặc định theo archetype
  const defaultPal =
    archetype === "child"
      ? {
          coat: "#2A9D8F", // Áo xanh ngọc
          pants: "#264653",
          skin: "#E76F51",
          hair: "#1D2D44",
          shoe: "#1D2D44",
          scarf: "#E76F51", // Khăn cam Ember
        }
      : archetype === "elder"
      ? {
          coat: "#7A6B5D",
          pants: "#3E3832",
          skin: "#D1B19A",
          hair: "#C5C0B8",
          shoe: "#22201E",
          scarf: "#9E7B66",
        }
      : {
          coat: "#315E89", // Áo lam biển sâu
          pants: "#172033",
          skin: "#E29578",
          hair: "#0F141D",
          shoe: "#0B0E14",
          scarf: "#D9622B", // Khăn cam đất Ember
        };

  const pal = palette ?? defaultPal;
  const isSilhouette = Boolean(color);
  const curPal = isSilhouette
    ? {
        coat: color!,
        pants: color!,
        skin: color!,
        hair: color!,
        shoe: color!,
        scarf: color!,
      }
    : pal;

  const p = studioPoseAt(pose, t);

  // Tính khung xương giải phẫu
  const hip: Pt = [0, 0];
  const sh = up(hip, H * 0.3, p.torso);
  const head = up(sh, H * 0.1, p.torso + p.head);
  const kneeL = down(hip, H * 0.25, p.hipL);
  const footL = down(kneeL, H * 0.25, p.hipL - p.kneeL);
  const kneeR = down(hip, H * 0.25, p.hipR);
  const footR = down(kneeR, H * 0.25, p.hipR - p.kneeR);
  const elbL = down(sh, H * 0.17, p.shL);
  const handL = down(elbL, H * 0.16, p.shL + p.elL);
  const elbR = down(sh, H * 0.17, p.shR);
  const handR = down(elbR, H * 0.16, p.shR + p.elR);

  const seated =
    pose === "sit" || pose === "sitEdge" || pose === "desk" || pose === "row";
  const lowest = Math.max(footL[1], footR[1]);
  const oy = seated ? 0 : -lowest - (p.bob ?? 0) * H;

  // Pháp tuyến thân người cho áo khoác
  const ax = Math.sin(deg(p.torso));
  const ay = -Math.cos(deg(p.torso));
  const nx = -ay;
  const ny = ax;
  const flap = wind * H * 0.08 * (0.6 + 0.4 * Math.sin(t * 7));
  const hemLen = seated ? H * 0.06 : H * 0.24;

  const P = (o: Pt, along: number, side: number): string =>
    `${(o[0] + ax * along + nx * side).toFixed(1)},${(
      o[1] +
      ay * along +
      ny * side
    ).toFixed(1)}`;

  // Áo khoác rủ tự nhiên
  const coatPath = `M${P(sh, H * 0.01, -H * 0.1)} Q${P(
    sh,
    H * 0.04,
    0
  )} ${P(sh, H * 0.01, H * 0.095)}
    L${P(hip, 0, H * 0.085)} L${P(
    hip,
    -hemLen,
    H * 0.11 - flap * 0.2
  )}
    Q${P(hip, -hemLen - H * 0.015, 0)} ${P(
    hip,
    -hemLen + flap * 0.1,
    -H * 0.12 - flap
  )}
    L${P(hip, 0, -H * 0.09)} Z`;

  // Khăn quàng bay mềm mại
  const neck: Pt = [sh[0] + ax * H * 0.035, sh[1] + ay * H * 0.035];
  const tail = Array.from({ length: 6 }, (_, i) => {
    const u = i / 5;
    const wave = Math.sin(t * 6.5 - u * 4) * H * 0.02 * (0.3 + wind);
    return [
      neck[0] - u * H * (0.12 + wind * 0.15),
      neck[1] + u * H * (0.12 - wind * 0.1) + wave,
    ] as Pt;
  });
  const scarfWave = `M${tail
    .map((q) => q.map((v) => v.toFixed(1)).join(","))
    .join(" L")}`;

  const renderBody = (cPal: typeof curPal, isRim = false) => (
    <>
      {/* Chân sau */}
      {capsuleLimb(hip, kneeR, H * 0.075, H * 0.06, cPal.pants, "legR_top")}
      {capsuleLimb(kneeR, footR, H * 0.06, H * 0.045, cPal.pants, "legR_bot")}
      <ellipse
        cx={footR[0] + H * 0.025}
        cy={footR[1] + H * 0.008}
        rx={H * 0.042}
        ry={H * 0.018}
        fill={cPal.shoe ?? cPal.pants}
      />

      {/* Tay sau */}
      {capsuleLimb(sh, elbR, H * 0.055, H * 0.045, cPal.coat, "armR_top")}
      {capsuleLimb(elbR, handR, H * 0.045, H * 0.035, cPal.coat, "armR_bot")}
      <circle cx={handR[0]} cy={handR[1]} r={H * 0.025} fill={cPal.skin} />

      {/* Áo khoác thân chính */}
      <path d={coatPath} fill={cPal.coat} />

      {/* Chân trước */}
      {capsuleLimb(hip, kneeL, H * 0.078, H * 0.062, cPal.pants, "legL_top")}
      {capsuleLimb(kneeL, footL, H * 0.062, H * 0.046, cPal.pants, "legL_bot")}
      <ellipse
        cx={footL[0] + H * 0.025}
        cy={footL[1] + H * 0.008}
        rx={H * 0.042}
        ry={H * 0.018}
        fill={cPal.shoe ?? cPal.pants}
      />

      {/* Cổ & Đầu */}
      {capsuleLimb(sh, head, H * 0.045, H * 0.04, cPal.skin, "neck")}
      <ellipse
        cx={head[0]}
        cy={head[1]}
        rx={H * 0.052}
        ry={H * 0.062}
        fill={cPal.skin}
        transform={`rotate(${p.torso + p.head} ${head[0]} ${head[1]})`}
      />

      {/* Tóc gáy uốn cong tinh tế */}
      <path
        d={`M${head[0] - H * 0.058},${head[1] + H * 0.02} Q${head[0] - H * 0.07},${
          head[1] - H * 0.07
        } ${head[0] + H * 0.01},${head[1] - H * 0.068} Q${head[0] + H * 0.05},${
          head[1] - H * 0.06
        } ${head[0] + H * 0.045},${head[1] - H * 0.03} L${head[0] - H * 0.02},${
          head[1] - H * 0.02
        } Z`}
        fill={cPal.hair}
      />

      {/* Khăn quàng */}
      {cPal.scarf && (
        <>
          <ellipse
            cx={neck[0]}
            cy={neck[1]}
            rx={H * 0.052}
            ry={H * 0.03}
            fill={cPal.scarf}
          />
          <path
            d={scarfWave}
            stroke={cPal.scarf}
            strokeWidth={H * 0.032}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      )}

      {/* Tay trước */}
      {capsuleLimb(sh, elbL, H * 0.058, H * 0.047, cPal.coat, "armL_top")}
      {capsuleLimb(elbL, handL, H * 0.047, H * 0.036, cPal.coat, "armL_bot")}
      <circle cx={handL[0]} cy={handL[1]} r={H * 0.026} fill={cPal.skin} />
    </>
  );

  return (
    <g
      transform={`translate(${x} ${y + oy}) scale(${scale * facing} ${scale})`}
      opacity={opacity}
    >
      {/* Lớp Rim Light viền sáng nếu có */}
      {rim && (
        <g transform="translate(-1.5 -1.5)" opacity={0.6}>
          {renderBody(
            {
              coat: rim,
              pants: rim,
              skin: rim,
              hair: rim,
              shoe: rim,
              scarf: rim,
            },
            true
          )}
        </g>
      )}
      {renderBody(curPal)}
    </g>
  );
};
