// Kiểu tóc cho nhân vật có màu (Figure, chế độ palette) — nhìn nghiêng, mặt hướng +x, mặt trơn kiểu cắt giấy.
// Toạ độ viết theo đơn vị u quanh tâm đầu (x về phía mặt, y xuống dưới); sọ ≈ rộng 10u, cao 12u.
import React from "react";

export type HairStyle =
  // cổ điển
  | "short" | "buzz" | "curly" | "bob" | "long" | "ponytail" | "braid" | "bunLow" | "pixie"
  // hiện đại — nam
  | "twoBlock" | "comma" | "pompadour" | "perm" | "frenchCrop" | "mullet" | "manBun"
  // hiện đại — nữ
  | "curtain" | "wolf" | "bobBangs" | "wavy" | "messyBun" | "halfUp" | "spaceBuns" | "pixieLayer"
  // người già
  | "bald" | "bunGrey" | "khanVan"
  // trẻ em
  | "mushroom" | "twinBuns" | "twinBraids" | "peachTuft" | "topKnot" | "spiky"
  // mũ (thay tóc)
  | "beanie" | "cap";

export const HAIR_LABEL: Record<HairStyle, string> = {
  short: "Ngắn gọn", buzz: "Đầu đinh", curly: "Xoăn bồng", bob: "Ngang vai", long: "Dài thẳng", ponytail: "Đuôi ngựa", braid: "Tết một bím",
  bunLow: "Búi thấp", pixie: "Tóc tém", twoBlock: "Two-block", comma: "Mái phẩy", pompadour: "Side part vuốt cao", perm: "Uốn phồng Hàn",
  frenchCrop: "French crop", mullet: "Mullet", manBun: "Búi củ tỏi nam", curtain: "Mái bay + layer", wolf: "Wolf cut", bobBangs: "Bob mái thưa",
  wavy: "Uốn sóng lơi", messyBun: "Búi rối cao", halfUp: "Búi nửa đầu", spaceBuns: "Hai búi tròn", pixieLayer: "Tém layer", bald: "Hói, tóc bạc thưa",
  bunGrey: "Búi tóc bạc", khanVan: "Khăn vấn", mushroom: "Đầu nấm", twinBuns: "Hai búi hai bên", twinBraids: "Hai bím", peachTuft: "Chỏm trái đào",
  topKnot: "Cột chùm đỉnh", spiky: "Ngắn lởm chởm", beanie: "Mũ len", cap: "Mũ lưỡi trai",
};

type Ctx = { hx: number; hy: number; u: number; hair: string; dark: string; light: string; shaved: string; skin: string; accent: string; t: number; wind: number; mono: boolean };

/** Đổi chuỗi path viết theo u (cặp số x,y) sang toạ độ thật */
const sp = (c: Ctx, d: string) => {
  let i = 0, rel = false;
  return d.replace(/[A-Za-z]|-?\d*\.?\d+/g, (tok) => {
    if (/[A-Za-z]/.test(tok)) { rel = tok === tok.toLowerCase(); i = 0; return tok; }
    const v = parseFloat(tok) * c.u, r = rel ? v : v + (i % 2 === 0 ? c.hx : c.hy);
    i++;
    return " " + r.toFixed(1);
  });
};
const P = (c: Ctx, d: string, fill: string, key?: string | number) => <path key={key} d={sp(c, d)} fill={fill} />;
const Circ = (c: Ctx, x: number, y: number, r: number, fill: string, key?: string | number) => <circle key={key} cx={c.hx + x * c.u} cy={c.hy + y * c.u} r={r * c.u} fill={fill} />;
/** Nhóm xoay quanh điểm gắn (đuôi tóc, bím đung đưa) */
const Swing = (c: Ctx, x: number, y: number, deg: number, children: React.ReactNode, key?: string) => (
  <g key={key} transform={`rotate(${deg.toFixed(1)} ${(c.hx + x * c.u).toFixed(1)} ${(c.hy + y * c.u).toFixed(1)})`}>{children}</g>
);
const sway = (c: Ctx, amp: number, speed = 2.2) => Math.sin(c.t * speed) * amp + c.wind * 14;

const CAP = "M4.6,-1.8 C4.4,-6.2 0.5,-7.4 -2,-7.2 C-6.6,-7 -7.4,-2.5 -6.4,1.8 C-5.4,4.2 -3.6,5 -2.6,4.6 C-3,1.2 -1.4,-2.2 1.2,-3 C2.6,-3.4 4,-2.6 4.6,-1.8 Z";
const SLEEK = "M4.6,-2.5 C4,-6.6 0,-7.6 -2.6,-7.2 C-6.4,-6.6 -7.2,-2.5 -6.2,1.6 C-5.4,3.8 -3.8,4.6 -2.8,4.2 C-3.2,1 -1.6,-2.8 1.2,-3.6 C2.6,-3.9 3.8,-3.3 4.6,-2.5 Z";
const LONG_BACK = "M3,-5.6 C-4,-9.6 -8.6,-6 -7.6,0 C-7.8,5 -7.2,9 -6,12.6 L-1.8,12.4 C-2.8,8 -2.6,3 -0.4,0 Z";

/** Lớp tóc vẽ SAU đầu (phần buông sau gáy) */
export const hairBack = (s: HairStyle, c: Ctx): React.ReactNode => {
  const sw = sway(c, 4);
  switch (s) {
    case "bob": return P(c, "M3,-5 C-4,-9.6 -8.6,-6 -7.2,0.5 C-6.8,3.8 -6,6.2 -3.4,6.4 C-1.6,6.4 -0.8,5.6 -0.2,5 C-1.6,3.6 -2,2 -1,0 Z", c.dark);
    case "bobBangs": return P(c, "M3,-5 C-4,-9.6 -8.6,-6 -7.4,0 C-7,3.6 -6,5.6 -3.6,6 C-1.8,6.2 -0.6,5.6 0,5 C-1.4,4 -2,2 -1,0 Z", c.dark);
    case "long": return Swing(c, -5, -2, sw * 0.5, P(c, LONG_BACK, c.dark));
    case "halfUp": return Swing(c, -5, -2, sw * 0.5, P(c, "M2,-5 C-4,-9 -8.4,-6 -7.4,0 C-7.6,4 -7,7.4 -5.8,9.6 L-2,9.4 C-2.8,6 -2.6,2.6 -0.6,0 Z", c.dark));
    case "curtain": return Swing(c, -5, -2, sw * 0.5, P(c, "M3,-5.5 C-3,-9 -8.6,-6 -7.6,0 C-7.8,5 -7.2,9 -6,12 L-5,11 L-4.4,12.8 L-3.4,11.2 L-2.4,12.4 L-1.8,10 C-2.6,6 -2.2,2 -0.4,0 Z", c.dark));
    case "wolf": return P(c, "M3,-6 C-4,-10.6 -9.4,-6 -8,-1 L-7.4,1 L-8.2,3 L-6.6,3.4 L-7,6 L-5.4,5.4 L-5,8 L-3.6,6 C-3,3 -2,1 -0.4,0 Z", c.dark);
    case "wavy": return Swing(c, -5, -2, sw * 0.6, P(c, "M3,-5.6 C-4,-9.6 -9,-5.6 -7.6,0 C-9,3 -6.6,5 -7.8,8 C-8.6,10.6 -6,12.4 -6.6,14.6 L-3.4,14.4 C-4,12 -2,10.6 -3.2,8 C-4,6 -2,4 -2.6,2 C-2.8,0.6 -1.4,-0.4 -0.4,0 Z", c.dark));
    case "mullet": return Swing(c, -4, 2, sw * 0.3, P(c, "M-6.4,0 C-6.8,4 -6,8.4 -4.5,10 L-2.4,9.6 C-3.2,7 -3,5 -2.6,4.4 Z", c.dark));
    case "twinBraids": return Swing(c, -3.6, 2.6, sway(c, 9, 3), <g>{[0, 1, 2, 3, 4].map((i) => Circ(c, -4.2 + i * 0.1, 3.4 + i * 1.7, 1.25 - i * 0.08, i % 2 ? c.dark : c.hair, i))}{Circ(c, -3.8, 12, 0.7, c.accent, "tie")}</g>);
    case "twinBuns": return Circ(c, -3.2, -7.4, 2.3, c.dark);
    case "spaceBuns": return Circ(c, -5, -6.8, 2.1, c.dark);
    default: return null;
  }
};

/** Lớp tóc vẽ TRƯỚC đầu (vòm tóc, mái, búi, đuôi) */
export const hairFront = (s: HairStyle, c: Ctx): React.ReactNode => {
  const sw = sway(c, 5);
  const shine = !c.mono && <path d={sp(c, "M-4,-4.5 Q-1,-6.8 2.5,-5.6")} stroke={c.light} strokeWidth={c.u * 0.45} fill="none" opacity={0.55} />;
  const mixSkin = c.shaved; // tóc cạo sát / tóc mỏng: pha màu da
  switch (s) {
    case "short": return <>{P(c, CAP, c.hair)}{shine}</>;
    case "buzz": return P(c, "M4.2,-3 C3.8,-6.4 0,-7 -2.5,-6.8 C-6,-6.4 -6.6,-2 -5.8,1.5 C-5.2,3 -4,3.6 -3.6,3 C-4,0 -2.5,-3.8 0.5,-4.8 C2,-5 3.6,-4 4.2,-3 Z", mixSkin);
    case "curly":
    case "perm": {
      const big = s === "curly" ? 1.25 : 1;
      const pts: [number, number, number][] = [[-5.6, 0.6, 2.4], [-6, -2.8, 2.6], [-4.4, -5.8, 2.7], [-1.4, -7.4, 2.7], [1.8, -7, 2.5], [4, -4.8, 2.1], [4.8, -2.4, 1.5], [-3.8, 3, 2]];
      return <>{P(c, CAP, c.hair)}{pts.map(([x, y, r], i) => Circ(c, x, y, r * big, i % 2 ? c.hair : c.dark, i))}{s === "perm" && P(c, "M5,-2.6 C6,-0.8 5.4,0.8 4.2,0.6 C4.8,-0.4 4.6,-1.4 3.6,-1.8 Z", c.hair, "fr")}{shine}</>;
    }
    case "bob": return <>{P(c, CAP, c.hair)}{shine}</>;
    case "bobBangs": return <>{P(c, "M5.6,-1.4 L5.4,-4.4 C4,-7.4 0,-7.8 -2,-7.4 C-5.8,-6.6 -7,-3 -6.4,1 C-5.6,3.6 -4,4.4 -3,4 C-3.4,1 -2.2,-1.6 0,-2.4 C2,-2.2 3.8,-1.8 5.6,-1.4 Z", c.hair)}{shine}</>;
    case "long": case "halfUp": case "curtain": case "wavy":
      return (
        <>
          {P(c, "M5.6,1.5 C6.2,-1 5.6,-4 4.2,-5.4 C2,-7.6 -1.6,-7.6 -3.4,-6.8 C-6.4,-5.6 -7.2,-2 -6.4,1.6 C-5.6,3.8 -4,4.6 -3,4.2 C-3.4,1 -2,-2.6 1.2,-3.6 C3.2,-3.4 4.4,-1 5,1.6 Z", c.hair)}
          {s === "halfUp" && Circ(c, -4.8, -6.6, 1.7, c.hair, "hb")}
          {s === "curtain" && P(c, "M5,1.6 C5.6,-0.4 5.4,-2.6 4.2,-4.2 C4.6,-2.4 4.6,-0.6 4,1.2 Z", c.dark, "cb")}
          {shine}
        </>
      );
    case "ponytail":
      return (
        <>
          {Swing(c, -6, -3.6, sw, P(c, "M-6,-4.6 C-9.6,-4 -10.6,1 -9.4,6 C-9,8 -8,9 -7.6,8.4 C-8.4,4 -7.6,-0.6 -5.6,-2.6 Z", c.dark), "tail")}
          {P(c, SLEEK, c.hair)}
          {Circ(c, -6, -3.6, 0.8, c.accent)}
          {shine}
        </>
      );
    case "braid":
      return (
        <>
          {Swing(c, -5.4, 1.6, sw * 0.6, <g>{Array.from({ length: 7 }, (_, i) => Circ(c, -5.6 + i * 0.12, 2.2 + i * 1.6, 1.3 - i * 0.07, i % 2 ? c.dark : c.hair, i))}{Circ(c, -4.8, 13.4, 0.75, c.accent, "tie")}</g>, "braid")}
          {P(c, SLEEK, c.hair)}
          {shine}
        </>
      );
    case "bunLow": case "bunGrey": return <>{P(c, SLEEK, c.hair)}{Circ(c, -6.6, 1.6, 2.5, c.hair)}{Circ(c, -6.4, 1.2, 1.2, c.dark)}{shine}</>;
    case "pixie": return <>{P(c, "M5.6,-1 C5.8,-3 4.6,-6.2 1,-7.6 C-3,-8.6 -6.6,-6 -6.6,-2 C-6.6,1 -5.4,3.6 -3.6,4.2 L-3.4,2.6 L-2.8,3.6 C-3,1 -2,-2 0,-3 C2,-3.4 4,-2.4 5.6,-1 Z", c.hair)}{shine}</>;
    case "pixieLayer": return <>{P(c, "M5.6,-1 C5.8,-3 4.6,-6.2 1,-7.6 C-3,-8.6 -6.6,-6 -6.6,-2 L-7.2,0 L-6,0.6 L-6.4,2.6 L-4.8,2.4 L-4.4,4.4 L-3.2,3 C-3,1 -2,-2 0,-3 C2,-3.4 4,-2.4 5.6,-1 Z", c.hair)}{P(c, "M5.6,-1 L6.4,1 L4.6,-0.4 L4.4,1.2 L3.4,-1.2 Z", c.hair, "sw")}{shine}</>;
    case "twoBlock": case "comma":
      return (
        <>
          {P(c, "M-6.6,-3.6 C-7,-0.5 -6,3 -4.2,4.4 L-2.8,4.2 C-3.4,1 -3.2,-1.6 -1.5,-3 Z", mixSkin)}
          {P(c, "M5.6,-1 C6.2,-4.6 4.4,-8.6 -0.5,-8.6 C-4.8,-8.6 -6.8,-6 -6.6,-3.6 L-5.8,-3 C-3.4,-3.6 -1,-3.4 1.5,-2.6 C3,-2 4.6,-1 5.6,-1 Z", c.hair)}
          {s === "comma" && P(c, "M5.6,-1.2 C6.6,0 6,1.6 4.8,1.4 C5.4,0.6 5.2,-0.2 4.4,-0.6 Z", c.hair, "c")}
          {shine}
        </>
      );
    case "pompadour":
      return (
        <>
          {P(c, "M5.4,-3.5 C5.6,-8.6 -1,-9.8 -4,-8 C-6.8,-6.4 -7,-2 -6.2,1.8 C-5.6,3.6 -4.4,4.2 -3.6,3.6 C-3.8,0.5 -2.8,-2.6 0,-3.6 C2,-4.2 4,-3.6 5.4,-3.5 Z", c.hair)}
          {!c.mono && <path d={sp(c, "M-1,-7.4 Q1.6,-7 3.8,-5.6")} stroke={c.light} strokeWidth={c.u * 0.4} fill="none" />}
        </>
      );
    case "frenchCrop":
      return (
        <>
          {P(c, "M5.2,-1.4 L5,-4.8 C3.6,-7.6 -1,-7.8 -3.5,-7 C-6.4,-6 -7,-2 -6.2,1.6 C-5.6,3.4 -4.6,4 -3.8,3.6 C-4,0.6 -3,-1.6 -1,-1.8 Z", c.hair)}
          {P(c, "M-4,-6.8 l1,-1.4 l0.8,1.1 l1,-1.4 l0.8,1.2 l1,-1.3 l0.7,1.2 l0.9,-1 l0.4,1.4 Z", c.hair, "spk")}
        </>
      );
    case "mullet": return <>{P(c, CAP, c.hair)}{shine}</>;
    case "manBun": return <>{P(c, SLEEK, c.hair)}{Circ(c, -5.6, -6.2, 2.3, c.hair)}{Circ(c, -5.4, -6.4, 1.1, c.dark)}{shine}</>;
    case "wolf":
      return (
        <>
          {P(c, "M5.4,-2 C6,-6 3,-9.6 -1,-9.4 C-5,-9.2 -7.4,-6 -7,-2.6 L-5.4,-3.6 L-5,-2 L-3.6,-3.6 C-1,-4 2,-3.4 5.4,-2 Z", c.hair)}
          {P(c, "M5.4,-2 L5.8,0.2 L4.6,-1 L4.2,0.4 L3.6,-1.4 Z", c.hair, "w")}
          {shine}
        </>
      );
    case "messyBun":
      return (
        <>
          {P(c, SLEEK, c.hair)}
          {[[-2.4, -9, 2], [-0.6, -9.6, 1.5], [-3.8, -8.4, 1.4], [-1.6, -10.4, 1.2]].map(([x, y, r], i) => Circ(c, x, y, r, i % 2 ? c.dark : c.hair, i))}
          {!c.mono && <path d={sp(c, "M-5.6,-1 Q-7,2 -5.8,4.6")} stroke={c.hair} strokeWidth={c.u * 0.5} fill="none" />}
          {shine}
        </>
      );
    case "spaceBuns": return <>{P(c, SLEEK, c.hair)}{Circ(c, -1.2, -8.4, 2.1, c.hair)}{shine}</>;
    case "bald":
      return (
        <>
          {P(c, "M-6.2,-1 C-6.8,1.6 -5.6,3.8 -3.6,4.4 C-3.6,2 -3,0.4 -2,0 C-3,-0.6 -4.8,-1.6 -6.2,-1 Z", c.hair)}
          {!c.mono && <path d={sp(c, "M-3,-6.6 Q-1,-7.6 1.4,-6.8")} stroke={c.hair} strokeWidth={c.u * 0.35} fill="none" opacity={0.7} />}
        </>
      );
    case "khanVan":
      return (
        <>
          {P(c, "M-6,1.6 C-6.2,3.4 -5,4.6 -3.4,4.6 C-3.6,3 -3.4,2 -2.8,1.4 Z", c.hair)}
          {P(c, "M5.6,-2.6 C6.2,-9.6 -3,-11.2 -6.6,-7.4 C-8.8,-5 -8.4,-1.2 -6.6,1.2 L-3.4,-0.2 C-4,-2.6 -2.4,-4.6 0.6,-4.8 C2.6,-4.8 4.4,-4 5.6,-2.6 Z", c.accent)}
          {!c.mono && P(c, "M5.4,-3.4 C5.6,-8.2 -2.6,-9.4 -5.8,-6.4 C-4.4,-8.8 2.6,-9 5.4,-3.4 Z", "rgba(255,255,255,0.12)", "hl")}
          {!c.mono && [0, 1, 2].map((i) => <path key={i} d={sp(c, `M${-5.6 + i * 0.4},${-5.6 + i * 1.4} Q${-1 + i * 0.4},${-8.6 + i * 1.3} ${4.6 - i * 0.3},${-4.6 + i * 0.6}`)} stroke="rgba(0,0,0,0.22)" strokeWidth={c.u * 0.3} fill="none" />)}
        </>
      );
    case "mushroom": return <>{P(c, "M5.6,-1 L5.6,-3 C5,-7.6 0,-8.6 -2.6,-8.2 C-7,-7.4 -7.8,-3 -7.2,1.6 L-5,1.6 C-4.8,-0.6 -3.6,-1 -2.6,-1.1 Z", c.hair)}{shine}</>;
    case "twinBuns": return <>{P(c, SLEEK, c.hair)}{Circ(c, -1.6, -6.4, 2.4, c.hair)}{shine}</>;
    case "twinBraids": return <>{P(c, SLEEK, c.hair)}{shine}</>;
    case "peachTuft": return <>{P(c, "M4.2,-3 C3.8,-6.4 0,-7 -2.5,-6.8 C-6,-6.4 -6.6,-2 -5.8,1.5 C-5.2,3 -4,3.6 -3.6,3 C-4,0 -2.5,-3.8 0.5,-4.8 C2,-5 3.6,-4 4.2,-3 Z", mixSkin)}{Swing(c, 1.6, -6.6, sway(c, 6, 3), P(c, "M0.6,-6.4 C1.6,-9.8 4.6,-9 3.6,-7.4 C3,-8 2.2,-7.8 2,-6.4 Z", c.hair), "tuft")}</>;
    case "topKnot": return <>{P(c, SLEEK, c.hair)}{Swing(c, -1, -7.4, sway(c, 8, 3), P(c, "M-1.8,-7 C-3.4,-10.6 0.2,-11.8 1.4,-9.8 C0.2,-10 -0.6,-9 -0.4,-7.2 Z", c.hair), "knot")}{Circ(c, -1.1, -7.4, 0.7, c.accent)}</>;
    case "spiky": return <>{P(c, CAP, c.hair)}{P(c, "M-6.4,-3 l-1.2,-1.6 l1.6,-0.4 l-1,-1.8 l1.8,0 l-0.4,-2 l1.8,0.8 l0.4,-1.8 l1.4,1.2 l1,-1.6 l0.8,1.6 l1.4,-1.2 l0.2,1.8 l1.6,-0.6 l-0.6,1.8 l1.6,0.2 L4,-3 Z", c.hair, "s")}</>;
    case "beanie": return <>{P(c, "M5.4,-2.2 C5.6,-9.4 -6.8,-9.8 -7,-2 Z", c.accent)}{P(c, "M5.6,-2.4 L-7.1,-1.9 L-7,0.2 L5.6,-0.4 Z", c.mono ? c.accent : c.dark, "fold")}</>;
    case "cap": return <>{P(c, CAP, c.hair)}{P(c, "M4.4,-3 C4,-8.4 -6,-8.8 -6.6,-2.6 Z", c.accent, "crown")}{P(c, "M3.6,-3.4 L9.4,-2.6 L9,-1.8 L3.2,-2.4 Z", c.accent, "brim")}</>;
    default: return P(c, CAP, c.hair);
  }
};
