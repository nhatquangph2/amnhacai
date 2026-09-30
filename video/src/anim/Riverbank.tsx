// "Một khung hình, vạn năm" — MV Tảng Đá.
// Máy quay KHÔNG di chuyển: một bờ sông làng quê Việt Nam và một tảng đá. Chỉ thời gian thay đổi:
// mùa (xuân hoa đào · hạ · thu lá vàng · đông sương mù, mưa phùn), lũ, làng mọc lên (nhà tranh, lũy tre) → dời đi → thị trấn (mái ngói, cầu, cột điện) → phố (kè, lan can).
// Người là hình phẳng CÓ MÀU; nhân vật chính: bé gái áo mưa Ember, lớn lên thành bà.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Figure, FigurePalette, PoseName } from "./Figure";
import { AnimKey, RGB, World, css, integralOf, mix, rgb, rng } from "./params";

const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const band = (x: number, a: number, b: number, fade = 0.15) => clamp((x - a) / fade + 1) * clamp((b - x) / fade + 1); // 1 trong [a,b], mờ ở mép

// ---- Bố cục cố định
const HORIZON = 470; // chân núi
const FAR = 540; // mép bờ bên kia
const EDGE = 790; // mép bờ bên này (mực nước bình thường)
const PATH = 860; // lối mòn: chân người đi
const STONE = { x: 1340, y: 772, rx: 118, ry: 62 };

// ---- Bảng màu (ban ngày, hoàng hôn, đêm)
const SKY_DAY: [RGB, RGB, RGB] = [rgb("#9fbccb"), rgb("#cfd9d2"), rgb("#efe2c6")];
const SKY_GOLD: [RGB, RGB, RGB] = [rgb("#6a7b9c"), rgb("#d69a6a"), rgb("#f3b67c")];
const SKY_NIGHT: [RGB, RGB, RGB] = [rgb("#0b1222"), rgb("#16213a"), rgb("#27324a")];
const SKY_WINTER: [RGB, RGB, RGB] = [rgb("#aab4ba"), rgb("#c8cdcc"), rgb("#d9dad3")]; // trời đông xám nồm
const SEASON_GREEN = [rgb("#93b56d"), rgb("#6f9a52"), rgb("#c69a4c"), rgb("#aeb4ab")]; // xuân hạ thu đông
const seasonColor = (s: number) => {
  const i = Math.floor(((s % 4) + 4) % 4);
  const f = ((s % 1) + 1) % 1;
  return mix(SEASON_GREEN[i], SEASON_GREEN[(i + 1) % 4], f);
};

// ---- Thế giới sinh một lần
const W0 = (() => {
  const r = rng(515);
  const U = (a: number, b: number) => a + (b - a) * r();
  // Bờ bên kia: nhà theo từng thời kỳ
  type House = { x: number; w: number; h: number; kind: "tranh" | "ngoi" | "pho"; eIn: number; eOut: number };
  const houses: House[] = [];
  for (let i = 0; i < 9; i++) houses.push({ x: 120 + i * 190 + U(-40, 40), w: U(90, 130), h: U(46, 60), kind: "tranh", eIn: i === 4 ? 0.8 : U(1.3, 2.1), eOut: U(2.55, 3.05) });
  for (let i = 0; i < 11; i++) houses.push({ x: 60 + i * 170 + U(-30, 30), w: U(90, 140), h: U(55, 80), kind: "ngoi", eIn: U(3.7, 4.3), eOut: 99 });
  for (let i = 0; i < 16; i++) houses.push({ x: -40 + i * 125 + U(-20, 20), w: U(80, 150), h: U(140, 330), kind: "pho", eIn: U(4.6, 5.05), eOut: 99 });
  const bamboo = Array.from({ length: 14 }, () => ({ x: U(-40, 1960), h: U(70, 130), n: 7 + Math.floor(r() * 6), eIn: U(0.9, 1.6), eOut: U(3.4, 4.3) }));
  const wildTrees = Array.from({ length: 10 }, () => ({ x: U(-40, 1960), r: U(28, 55), h: U(40, 80) }));
  const poles = Array.from({ length: 8 }, (_, i) => ({ x: 80 + i * 260 }));
  const mountains = [
    Array.from({ length: 30 }, (_, i) => [i * 70 - 60, HORIZON - 70 - 60 * Math.sin(i * 0.55 + 1) - 35 * Math.sin(i * 1.3) - U(0, 20)]),
    Array.from({ length: 30 }, (_, i) => [i * 70 - 40, HORIZON - 25 - 35 * Math.sin(i * 0.8 + 2) - 20 * Math.sin(i * 1.9) - U(0, 15)]),
  ];
  const tufts = Array.from({ length: 160 }, () => ({ x: U(-20, 1940), y: U(EDGE + 20, 1080), h: U(8, 22), ph: r() * 6 }));
  const reeds = Array.from({ length: 40 }, () => ({ x: U(0, 1200), h: U(30, 70), ph: r() * 6 }));
  const ripples = Array.from({ length: 60 }, () => ({ x: U(0, 1920), y: U(FAR + 10, EDGE - 8), w: U(20, 70), sp: U(10, 30) }));
  const petals = Array.from({ length: 70 }, () => ({ x: U(0, 2000), y: U(0, 1100), sp: U(50, 110), sw: U(20, 60), ph: r() * 6, s: U(6, 11) }));
  const drops = Array.from({ length: 260 }, () => ({ x: U(0, 2200), y: U(0, 1080), len: U(14, 30), sp: U(0.9, 1.3) }));
  const stars = Array.from({ length: 90 }, () => ({ x: U(0, 1920), y: U(130, HORIZON - 60), r: U(0.8, 2) }));
  const birds = Array.from({ length: 5 }, () => ({ y: U(170, 330), sp: U(40, 90), off: U(0, 3000), s: U(6, 10) }));
  // Người qua lại: mỗi người thuộc một thời kỳ, có trang phục riêng
  const walkers = Array.from({ length: 34 }, (_, i) => {
    const era = i % 3; // 0 làng · 1 thị trấn · 2 phố
    const dir = r() < 0.5 ? 1 : -1;
    const villager: FigurePalette[] = [
      { coat: "#4a3a2c", pants: "#2c2622", skin: "#c99a74", hair: "#1c1715" },
      { coat: "#2f3a52", pants: "#26242a", skin: "#d2a07c", hair: "#1c1715" },
      { coat: "#6b5236", pants: "#3a2f26", skin: "#c3906c", hair: "#1c1715" },
    ];
    const town: FigurePalette[] = [
      { coat: "#e8e2d2", pants: "#3b4a5c", skin: "#d2a07c", hair: "#1c1715" },
      { coat: "#7c93a8", pants: "#2e2e33", skin: "#c99a74", hair: "#1c1715" },
      { coat: "#a8704a", pants: "#3a3530", skin: "#d8aa86", hair: "#241c18" },
    ];
    const city: FigurePalette[] = [
      { coat: "#3e5a74", pants: "#1f2126", skin: "#d8aa86", hair: "#1c1715" },
      { coat: "#c9c2b4", pants: "#4a4540", skin: "#c99a74", hair: "#2a201a" },
      { coat: "#6f7a5a", pants: "#26262b", skin: "#d2a07c", hair: "#1c1715" },
      { coat: "#8a3f3a", pants: "#2c2a30", skin: "#d8aa86", hair: "#1c1715" },
    ];
    const pal = [villager, town, city][era][Math.floor(r() * [3, 3, 4][era])];
    return {
      era,
      dir,
      sp: U(55, 95),
      x0: U(0, 2600),
      H: U(100, 122),
      pal,
      hat: era === 0 && r() < 0.7 ? ("non" as const) : undefined,
      load: era === 0 && r() < 0.35,
      lane: U(-8, 26),
      ph: r() * 10,
    };
  });
  const jag = Array.from({ length: 16 }, (_, i) => (i === 3 || i === 9 ? 0.25 : 0) + U(-0.14, 0.14));
  return { houses, bamboo, wildTrees, poles, mountains, tufts, reeds, ripples, petals, drops, stars, birds, walkers, jag };
})();

const stonePath = (erode: number, flood: number) => {
  const n = W0.jag.length;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + W0.jag[i] * (1 - erode);
    const flat = Math.sin(a) > 0 ? 0.55 : 1; // đáy phẳng, ngồi trên đất
    return [STONE.x + Math.cos(a) * STONE.rx * k, STONE.y + Math.sin(a) * STONE.ry * k * flat];
  });
  const f = (v: number) => v.toFixed(1);
  if (erode < 0.3) return `M${pts.map((p) => p.map(f).join(",")).join(" L")} Z`;
  const kk = ((erode - 0.3) / 0.7) / 6;
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) * kk)},${f(p1[1] + (p2[1] - p0[1]) * kk)} ${f(p2[0] - (p3[0] - p1[0]) * kk)},${f(p2[1] - (p3[1] - p1[1]) * kk)} ${f(p2[0])},${f(p2[1])}`;
  }
  void flood;
  return d + " Z";
};

// Nhà tranh / nhà mái ngói / nhà phố (bờ bên kia)
const House: React.FC<{ h: (typeof W0.houses)[number]; era: number; shade: (c: RGB) => string; lit: number }> = ({ h, era, shade, lit }) => {
  const vis = band(era, h.eIn, h.eOut, 0.12);
  if (vis <= 0) return null;
  const grow = clamp((era - h.eIn + 0.12) / 0.24); // dựng lên
  const decay = h.kind === "tranh" ? clamp((era - (h.eOut - 0.45)) / 0.4) : 0; // bỏ hoang: mái sập, bạc màu
  const base = FAR - 4;
  const H = h.h * grow;
  if (h.kind === "pho") {
    return (
      <g opacity={vis}>
        <rect x={h.x} y={HORIZON + 40 - H} width={h.w} height={H} fill={shade(rgb("#b9b4a8"))} />
        {Array.from({ length: Math.floor(H / 34) * 3 }, (_, i) => (
          <rect key={i} x={h.x + 12 + (i % 3) * (h.w / 3.2)} y={HORIZON + 40 - H + 14 + Math.floor(i / 3) * 34} width={h.w / 5} height="14" fill={lit > 0.2 && (i * 7 + Math.round(h.x)) % 3 === 0 ? `rgba(255,205,130,${lit})` : shade(rgb("#8c8a86"))} />
        ))}
      </g>
    );
  }
  const wall = h.kind === "tranh" ? mix(rgb("#b89a74"), rgb("#8b8478"), decay) : rgb("#e3d4b2");
  const roof = h.kind === "tranh" ? mix(rgb("#8b7a4c"), rgb("#6d6a60"), decay) : rgb("#a4513b");
  const sag = decay * 16;
  return (
    <g opacity={vis}>
      <rect x={h.x} y={base - H * 0.55} width={h.w} height={H * 0.55} fill={shade(wall)} />
      <rect x={h.x + h.w * 0.4} y={base - H * 0.32} width={h.w * 0.18} height={H * 0.32} fill={shade(rgb("#3a2e24"))} />
      {lit > 0.2 && h.kind === "ngoi" && <rect x={h.x + h.w * 0.12} y={base - H * 0.4} width={h.w * 0.16} height={H * 0.14} fill={`rgba(255,205,130,${lit})`} />}
      <path
        d={`M${h.x - 14},${base - H * 0.52} L${h.x + h.w / 2},${base - H - 4 + sag} L${h.x + h.w + 14},${base - H * 0.52} Z`}
        fill={shade(roof)}
      />
    </g>
  );
};

type BankProps = { t: number; w: World; keys: AnimKey[]; vertical: boolean };

export const Riverbank: React.FC<BankProps> = ({ t, w, keys, vertical }) => {
  // Thời gian trôi bằng MÙA (season đặt theo kịch bản: 0 xuân · 1 hạ · 2 thu · 3 đông · 4 xuân năm sau…),
  // không còn ngày–đêm khi tua; đêm chỉ khi đặt "dark"
  const season = w.season;
  const sp4 = ((season % 4) + 4) % 4;
  const near = (c: number) => clamp(1 - Math.min(Math.abs(sp4 - c), 4 - Math.abs(sp4 - c)) * 1.25); // gần mùa c
  const spring = near(0);
  const autumn = near(2);
  const lapse = 1 + w.cycle * 28; // người đi nhanh lên khi tua
  const sceneT = t + integralOf(keys, "cycle", t) * 28; // "thời gian cảnh" cho người đi lại
  const dark = clamp(w.dark);
  const dusk = w.dusk * (1 - dark);
  const winter = near(3);
  const skyDay = [0, 1, 2].map((i) => mix(SKY_DAY[i], SKY_WINTER[i], winter * 0.8)) as [RGB, RGB, RGB];
  const sky = [0, 1, 2].map((i) => mix(mix(skyDay[i], SKY_GOLD[i], dusk), SKY_NIGHT[i], dark)) as [RGB, RGB, RGB];
  const light = 1 - dark * 0.75;
  // Màu cảnh vật theo ánh sáng: tối về đêm, ấm lên lúc hoàng hôn
  const tint = mix(mix(rgb("#ffffff"), rgb("#ffcf9e"), dusk * 0.6), rgb("#3a4868"), dark * 0.85);
  const shade = (c: RGB) => css([c[0] * tint[0] / 255, c[1] * tint[1] / 255, c[2] * tint[2] / 255] as RGB);
  const green = seasonColor(season);
  const lit = clamp(dark * 1.3 - 0.1); // đèn nhà bật khi tối
  const era = w.era;
  const water = w.flood * 120;
  const edge = EDGE + water;

  // Mặt trời / mặt trăng: khi tua thì chạy ngang trời theo ngày
  const pm = 0;
  const lapsing = false; // không còn ngày–đêm khi tua
  const sunX = lapsing ? 960 + pm * 3200 : 1500 - dusk * 250;
  const sunY = lapsing ? 210 + pm * pm * 1500 : 230 + dusk * 210;
  const moonPm = pm >= 0 ? pm - 0.5 : pm + 0.5;
  const moonX = 960 + moonPm * 3200;
  const moonY = 220 + moonPm * moonPm * 1500;

  // Người qua lại (lọc theo thời kỳ)
  const eraOf = (e: number) => (e === 0 ? band(era, 0.9, 3.1, 0.25) : e === 1 ? band(era, 3.8, 4.9, 0.2) : band(era, 4.75, 9, 0.2));
  const nWalk = Math.round(W0.walkers.length * w.crowd);
  const ghost = 1 / (1 + w.cycle * 5); // tua nhanh → người như bóng mờ

  // Bé gái: tuổi → chiều cao, dáng, tóc
  const age = w.age;
  const gH = 62 + clamp(age / 0.35) * 48 + (age > 0.85 ? -8 : 0);
  const gPose: PoseName = (["walk", "crouch", "sitEdge", "stand"] as PoseName[])[Math.round(w.gpose)] ?? "stand";
  const gPal: FigurePalette = {
    coat: age < 0.55 ? "#D9622B" : age < 0.85 ? "#b55a36" : "#8a5a44",
    pants: age < 0.55 ? "#2f3440" : "#3a3634",
    skin: "#e0b08c",
    hair: css(mix(rgb("#1c1715"), rgb("#d9d6d0"), clamp((age - 0.75) / 0.2))),
    shoe: "#2a2420",
  };
  const onStone = gPose === "sitEdge";
  // Ngồi xổm: sát chân đá (lên khỏi lối đi) để tay chạm được đá
  const gY = onStone ? STONE.y - STONE.ry * 0.78 : gPose === "crouch" ? EDGE + 30 : PATH;

  const svgW = vertical ? "1043 0 607 1080" : "0 0 1920 1080";
  return (
    <AbsoluteFill style={{ background: css(sky[0]) }}>
      <svg viewBox={svgW} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="rb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={css(sky[0])} />
            <stop offset="60%" stopColor={css(sky[1])} />
            <stop offset="100%" stopColor={css(sky[2])} />
          </linearGradient>
          <linearGradient id="rb-water" x1="0" y1={FAR} x2="0" y2={EDGE + 140} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={shade(mix(rgb("#8fbdb5"), sky[2], 0.35))} />
            <stop offset="100%" stopColor={shade(mix(rgb("#5f958f"), rgb("#7a6a4a"), w.flood * 0.6))} />
          </linearGradient>
          <radialGradient id="rb-sun">
            <stop offset="0%" stopColor={dusk > 0.3 ? "rgba(255,200,140,1)" : "rgba(255,248,225,1)"} />
            <stop offset="40%" stopColor={dusk > 0.3 ? "rgba(255,170,100,0.5)" : "rgba(255,240,210,0.35)"} />
            <stop offset="100%" stopColor="rgba(255,230,200,0)" />
          </radialGradient>
          <linearGradient id="rb-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dfe3e2" stopOpacity="0" />
            <stop offset="45%" stopColor="#dfe3e2" stopOpacity="0.55" />
            <stop offset="75%" stopColor="#dfe3e2" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#dfe3e2" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="rb-lamp">
            <stop offset="0%" stopColor="rgba(255,210,140,0.7)" />
            <stop offset="100%" stopColor="rgba(255,190,120,0)" />
          </radialGradient>
          <linearGradient id="rb-stone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={shade(mix(rgb("#9b978e"), rgb("#c9c2b3"), w.polish * 0.5))} />
            <stop offset="100%" stopColor={shade(rgb("#5a5751"))} />
          </linearGradient>
        </defs>

        {/* Trời */}
        <rect x="0" y="0" width="1920" height={HORIZON + 80} fill="url(#rb-sky)" />
        {dark > 0.05 && W0.stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={`rgba(235,238,255,${dark * (0.5 + 0.4 * Math.sin(t * 2 + i))})`} />)}
        {(1 - dark) > 0.05 && <circle cx={sunX} cy={sunY} r="120" fill="url(#rb-sun)" opacity={1 - dark} />}
        {(1 - dark) > 0.05 && <circle cx={sunX} cy={sunY} r="30" fill={dusk > 0.3 ? "#ffd29a" : "#fff6e2"} opacity={1 - dark} />}
        {lapsing && dark > 0.2 && <circle cx={moonX} cy={moonY} r="22" fill={`rgba(235,238,250,${dark})`} />}
        {!lapsing && w.dark > 0.3 && <circle cx="420" cy="230" r="22" fill={`rgba(235,238,250,${w.dark})`} />}
        {/* Chim bay */}
        {W0.birds.map((b, i) => {
          const x = ((b.off + sceneT * b.sp) % 2600) - 300;
          const flap = Math.sin(sceneT * 8 + i) * 4;
          return <path key={i} d={`M${x - b.s},${b.y + flap} Q${x - b.s / 2},${b.y - 4} ${x},${b.y} Q${x + b.s / 2},${b.y - 4} ${x + b.s},${b.y + flap}`} stroke={shade(rgb("#3a3a40"))} strokeWidth="1.6" fill="none" opacity={(1 - dark) * ghost} />;
        })}

        {/* Núi xa */}
        <path d={`M-100,${HORIZON + 60} L${W0.mountains[0].map((p) => p.join(",")).join(" L")} L2020,${HORIZON + 60} Z`} fill={shade(mix(rgb("#a9b8b2"), sky[2], 0.35))} />
        <path d={`M-100,${HORIZON + 60} L${W0.mountains[1].map((p) => p.join(",")).join(" L")} L2020,${HORIZON + 60} Z`} fill={shade(mix(rgb("#8ea395"), sky[2], 0.2))} />

        {/* Phố cao phía sau (thời kỳ 5) vẽ trước dải đất bờ bên kia */}
        {W0.houses.filter((h) => h.kind === "pho").map((h, i) => <House key={`p${i}`} h={h} era={era} shade={shade} lit={lit} />)}

        {/* Dải đất bờ bên kia */}
        <path d={`M-20,${HORIZON + 40} Q960,${HORIZON + 22} 1940,${HORIZON + 40} L1940,${FAR} L-20,${FAR} Z`} fill={shade(mix(green, rgb("#7b8a64"), 0.4))} />
        {/* Cây hoang (thời kỳ 0 và sau khi làng dời đi) */}
        {W0.wildTrees.map((tr, i) => {
          const vis = Math.max(band(era, -1, 1.2, 0.3), band(era, 3.3, 3.95, 0.25));
          if (vis <= 0) return null;
          return (
            <g key={i} opacity={vis}>
              <rect x={tr.x - 3} y={FAR - 12 - tr.h * 0.6} width="6" height={tr.h * 0.6} fill={shade(rgb("#4a3d30"))} />
              <ellipse cx={tr.x} cy={FAR - 12 - tr.h * 0.6} rx={tr.r} ry={tr.r * 0.75} fill={shade(mix(green, rgb("#4e6a3e"), 0.35))} />
              {spring > 0.05 &&
                [0, 1, 2, 3, 4, 5].map((k) => (
                  <circle key={k} cx={tr.x + Math.cos(k * 2.1 + i) * tr.r * 0.6} cy={FAR - 12 - tr.h * 0.6 + Math.sin(k * 1.7 + i) * tr.r * 0.45} r={tr.r * 0.18} fill={`rgba(244,176,196,${spring * 0.9})`} />
                ))}
            </g>
          );
        })}
        {/* Lũy tre */}
        {W0.bamboo.map((b, i) => {
          const vis = band(era, b.eIn, b.eOut, 0.2);
          if (vis <= 0) return null;
          return (
            <g key={i} opacity={vis}>
              {Array.from({ length: b.n }, (_, k) => {
                const lean = (k - b.n / 2) * 6 + Math.sin(t * 1.3 + k + i) * 4;
                return <path key={k} d={`M${b.x + k * 3},${FAR - 6} Q${b.x + k * 3 + lean * 0.4},${FAR - b.h * 0.6} ${b.x + k * 3 + lean},${FAR - b.h}`} stroke={shade(mix(green, rgb("#5b7a3c"), 0.5))} strokeWidth="3" fill="none" />;
              })}
            </g>
          );
        })}
        {/* Nhà */}
        {W0.houses.filter((h) => h.kind !== "pho").map((h, i) => <House key={`h${i}`} h={h} era={era} shade={shade} lit={lit} />)}
        {/* Cột điện + dây (thị trấn) */}
        {band(era, 3.9, 9, 0.2) > 0 && (
          <g opacity={band(era, 3.9, 9, 0.2)}>
            {W0.poles.map((p, i) => (
              <g key={i}>
                <rect x={p.x} y={FAR - 110} width="5" height="106" fill={shade(rgb("#4a4642"))} />
                <rect x={p.x - 14} y={FAR - 106} width="33" height="4" fill={shade(rgb("#4a4642"))} />
                {i < W0.poles.length - 1 && <path d={`M${p.x + 2},${FAR - 104} Q${p.x + 132},${FAR - 86} ${W0.poles[i + 1].x + 2},${FAR - 104}`} stroke={shade(rgb("#3a3836"))} strokeWidth="1.2" fill="none" />}
              </g>
            ))}
          </g>
        )}

        {/* Sông */}
        <rect x="0" y={FAR} width="1920" height={edge - FAR + 2} fill="url(#rb-water)" />
        {W0.ripples.map((r, i) => {
          const x = ((r.x + sceneT * r.sp) % 2000) - 40;
          return <line key={i} x1={x} y1={r.y} x2={x + r.w} y2={r.y} stroke={css(mix(sky[2], rgb("#ffffff"), 0.4), 0.35 * light)} strokeWidth="2" strokeLinecap="round" />;
        })}
        {(1 - dark) > 0.1 && <ellipse cx={sunX} cy={FAR + 60} rx="60" ry="8" fill={css(rgb("#fff3dc"), 0.35 * (1 - dark))} />}
        {/* Cầu bê tông (thị trấn) */}
        {band(era, 3.95, 9, 0.2) > 0 && (
          <g opacity={band(era, 3.95, 9, 0.2)}>
            <path d={`M-60,${EDGE + 10} L400,${FAR - 6} L440,${FAR - 6} L-10,${EDGE + 30} Z`} fill={shade(rgb("#b5b0a6"))} />
            {[80, 200, 320].map((x, i) => (
              <rect key={i} x={x} y={EDGE - 60 - i * 70} width="14" height={70 + i * 18} fill={shade(rgb("#96918a"))} />
            ))}
          </g>
        )}
        {/* Thuyền nan */}
        {w.boat > 0 && w.boat < 1 && (() => {
          const bx = -200 + w.boat * 2400;
          const by = FAR + 90;
          return (
            <g>
              <path d={`M${bx - 70},${by} Q${bx},${by + 26} ${bx + 70},${by} Z`} fill={shade(rgb("#5a4632"))} />
              <Figure pose="stand" t={t} x={bx + 10} y={by} H={70} palette={{ coat: "#3b4a5c", pants: "#2c2622", skin: "#c99a74", hair: "#1c1715" }} hat="non" scarf="none" />
              <line x1={bx + 30} y1={by - 45} x2={bx + 70} y2={by + 20} stroke={shade(rgb("#6b5236"))} strokeWidth="3" />
            </g>
          );
        })()}

        {/* Bờ bên này */}
        <rect x="0" y={edge} width="1920" height={1080 - edge} fill={shade(mix(green, rgb("#8a7a58"), 0.55))} />
        <path d={`M-20,${edge} Q480,${edge - 8} 960,${edge + 4} T1940,${edge}`} fill="none" stroke={shade(rgb("#6a5a44"))} strokeWidth="6" />
        {/* Lối mòn → đường lát (theo thời kỳ) */}
        <rect x="0" y={PATH - 22} width="1920" height="44" fill={shade(mix(rgb("#b89a6e"), rgb("#9a968e"), clamp(era - 4)))} opacity={clamp((era - 0.8) * 2.5)} />
        {/* Kè bê tông + lan can uốn cong tránh tảng đá (phố) */}
        {band(era, 4.7, 9, 0.2) > 0 && (
          <g opacity={band(era, 4.7, 9, 0.2)}>
            <rect x="0" y={EDGE - 6} width="1920" height="34" fill={shade(rgb("#a9a59c"))} />
            {/* lan can dừng lại hai bên, đầu cuộn tròn — chừa chỗ cho tảng đá */}
            <path d={`M0,${EDGE - 40} L${STONE.x - 175},${EDGE - 40} q22,0 22,20 q0,20 -16,20`} stroke={shade(rgb("#5c5a57"))} strokeWidth="5" fill="none" />
            <path d={`M1920,${EDGE - 40} L${STONE.x + 175},${EDGE - 40} q-22,0 -22,20 q0,20 16,20`} stroke={shade(rgb("#5c5a57"))} strokeWidth="5" fill="none" />
            {Array.from({ length: 30 }, (_, i) => i * 66).filter((x) => Math.abs(x - STONE.x) > 180).map((x) => <rect key={x} x={x} y={EDGE - 40} width="4" height="40" fill={shade(rgb("#5c5a57"))} />)}
            {[300, 760].map((x) => (
              <g key={x}>
                <rect x={x} y={EDGE - 190} width="6" height="190" fill={shade(rgb("#3e3c3a"))} />
                <rect x={x - 10} y={EDGE - 196} width="26" height="8" fill={shade(rgb("#3e3c3a"))} />
                {lit > 0 && <circle cx={x + 3} cy={EDGE - 186} r="70" fill="url(#rb-lamp)" opacity={lit} />}
              </g>
            ))}
          </g>
        )}
        {/* Lau sậy mép nước (thời kỳ hoang) */}
        {W0.reeds.map((r, i) => (
          <path key={i} d={`M${r.x},${edge + 4} q${4 + Math.sin(t * 1.5 + r.ph) * 5},${-r.h * 0.6} ${8 + Math.sin(t * 1.5 + r.ph) * 8},${-r.h}`} stroke={shade(mix(green, rgb("#6a7a46"), 0.4))} strokeWidth="2.5" fill="none" opacity={band(era, -1, 4.6, 0.3)} />
        ))}

        {/* Tảng đá */}
        <path d={stonePath(w.erode, w.flood)} fill="url(#rb-stone)" />
        <path d={`M${STONE.x - 70},${STONE.y - 38} Q${STONE.x - 10},${STONE.y - 64} ${STONE.x + 60},${STONE.y - 44}`} stroke={css(mix(rgb("#ffffff"), rgb("#ffd9a8"), dusk), 0.2 + w.polish * 0.55)} strokeWidth={3 + w.polish * 7} fill="none" strokeLinecap="round" />
        {w.glint > 0 && (
          <g transform={`translate(${STONE.x + 30} ${STONE.y - 52}) scale(${w.glint * (0.7 + 0.3 * Math.sin(t * 6))})`}>
            <path d="M0,-26 L4,-4 L26,0 L4,4 L0,26 L-4,4 L-26,0 L-4,-4 Z" fill="rgba(255,244,215,0.95)" />
          </g>
        )}
        {/* nước vỗ quanh chân đá */}
        <path d={`M${STONE.x - 150},${edge + 2} q40,${-6 + Math.sin(t * 2) * 3} 80,0 t80,0 t80,0`} stroke={css(rgb("#e6f1ee"), 0.5 * light)} strokeWidth="2.5" fill="none" />

        {/* Cỏ */}
        {W0.tufts.map((g, i) => {
          if (g.y < edge + 10) return null;
          const sway = Math.sin(t * 1.8 + g.ph) * 3;
          return <path key={i} d={`M${g.x - 3},${g.y} Q${g.x + sway * 0.4},${g.y - g.h * 0.6} ${g.x + sway},${g.y - g.h} Q${g.x + 1},${g.y - g.h * 0.5} ${g.x + 3},${g.y} Z`} fill={shade(mix(green, rgb("#4f6a38"), 0.45))} opacity={1 - clamp(era - 4.6) * 0.8} />;
        })}

        {/* Người qua lại */}
        {W0.walkers.slice(0, nWalk).map((p, i) => {
          const vis = eraOf(p.era);
          if (vis <= 0) return null;
          const span = 2400;
          const x = ((((p.x0 + p.dir * p.sp * sceneT) % span) + span) % span) - 240;
          return (
            <g key={i} opacity={vis * (0.35 + 0.65 * ghost)}>
              <Figure pose={p.load ? "carry" : "walk"} t={sceneT * 1.1 + p.ph} x={x} y={PATH + p.lane} H={p.H} flip={p.dir < 0} palette={p.pal} hat={p.hat} load={p.load} scarf="none" />
            </g>
          );
        })}
        {/* Đám cưới áo dài đỏ */}
        {w.wedding > 0 && w.wedding < 1 &&
          Array.from({ length: 7 }, (_, i) => {
            const x = -300 + w.wedding * 2500 - i * 78;
            const red = i === 1 ? "#b8322b" : i === 2 ? "#2f4a7a" : i % 2 ? "#d0706a" : "#e6c9a0";
            return <Figure key={i} pose="walk" t={t * 1.4 + i} x={x} y={PATH + (i % 2) * 14} H={112} palette={{ coat: red, pants: "#f2ece0", skin: "#e0b08c", hair: "#1c1715" }} hat={i === 3 ? "non" : undefined} scarf="none" />;
          })}
        {/* Dời làng: tốp người gánh đồ đi về phía trái */}
        {w.leave > 0 && w.leave < 1 &&
          Array.from({ length: 6 }, (_, i) => {
            const x = 2150 - w.leave * 2600 + i * 95;
            return <Figure key={i} pose="carry" t={t * 1.2 + i} x={x} y={PATH + (i % 2) * 16} H={108 - (i === 4 ? 40 : 0)} flip palette={{ coat: ["#4a3a2c", "#2f3a52", "#6b5236"][i % 3], pants: "#2c2622", skin: "#c99a74", hair: "#1c1715" }} hat="non" load={i !== 4} scarf="none" />;
          })}

        {/* Bé gái áo mưa Ember → người mẹ → bà */}
        {w.girl > 0 && (
          <g opacity={w.girl}>
            <Figure pose={gPose} t={t} x={onStone ? STONE.x - 10 : w.gx} y={gY} H={gH} palette={gPal} hat={age < 0.3 ? "hood" : undefined} stoop={age > 0.85 ? 14 : 0} scarf="none" />
          </g>
        )}
        {w.kid > 0 && (
          // Đứa bé: đi theo khi người lớn bước, leo lên đá ngồi khi người lớn dừng
          <g opacity={w.kid}>
            {gPose === "walk" ? (
              <Figure pose="walk" t={t * 1.3 + 0.7} x={w.gx - 58} y={PATH + 10} H={66} palette={{ coat: "#e6b84a", pants: "#3a4a5c", skin: "#e8b894", hair: "#1c1715" }} scarf="none" />
            ) : (
              <Figure pose="sitEdge" t={t + 1.3} x={STONE.x + 62} y={STONE.y - STONE.ry * 0.78} H={66} palette={{ coat: "#e6b84a", pants: "#3a4a5c", skin: "#e8b894", hair: "#1c1715" }} scarf="none" />
            )}
          </g>
        )}

        {/* Mưa / tuyết */}
        {w.rain > 0 &&
          W0.drops.slice(0, Math.round(W0.drops.length * w.rain)).map((d, i) => {
            const y = ((d.y + t * 1100 * d.sp) % 1140) - 40;
            const x = ((d.x + t * 200) % 2200) - 140;
            return <line key={i} x1={x} y1={y} x2={x - 6} y2={y - d.len} stroke={css(mix(sky[2], rgb("#ffffff"), 0.5), 0.45)} strokeWidth="1.2" />;
          })}
        {/* Đông: sương mù trên sông + mưa phùn */}
        {winter > 0.05 && (
          <>
            <rect x="0" y={HORIZON - 160} width="1920" height={EDGE - HORIZON + 200} fill="url(#rb-mist)" opacity={winter * (1 - dark * 0.6)} />
            {W0.drops.slice(0, Math.round(90 * winter)).map((d, i) => {
              const y = ((d.y + t * 520 * d.sp) % 1140) - 40;
              const x = ((d.x + t * 60) % 2200) - 140;
              return <line key={i} x1={x} y1={y} x2={x - 2} y2={y - d.len * 0.5} stroke={css(rgb("#eef1f2"), 0.35 * winter)} strokeWidth="1" />;
            })}
          </>
        )}
        {/* Xuân: cánh hoa đào rơi · Thu: lá vàng rơi */}
        {Math.max(spring, autumn) > 0.05 &&
          W0.petals.map((p, i) => {
            const y = ((p.y + t * p.sp) % 1160) - 40;
            const x = ((p.x + t * 22 + Math.sin(t * 1.4 + p.ph) * p.sw) % 2000) - 40;
            const leaf = autumn > spring;
            const c = leaf ? ["#d98b2b", "#c2641f", "#e0b04a"][i % 3] : ["#f4b0c4", "#f7c9d6", "#eea0b8"][i % 3];
            return <ellipse key={i} cx={x} cy={y} rx={p.s * (leaf ? 1.4 : 1)} ry={p.s * 0.5} fill={c} opacity={Math.max(spring, autumn) * 0.9} transform={`rotate(${(t * 90 + i * 37) % 360} ${x} ${y})`} />;
          })}
      </svg>
    </AbsoluteFill>
  );
};
