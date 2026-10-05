// Bảng xem trước nhân vật vẽ bằng code (Figure, chế độ có màu): kiểu tóc theo nhóm, tỷ lệ theo tuổi.
//   npx remotion still src/index.ts CharacterSheet out/sheet-1.png --props='{"page":1}' --frame=20
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SANS, SERIF, useBrandFonts } from "./common";
import { Age, Figure, FigurePalette, PoseName } from "./anim/Figure";
import { HAIR_LABEL, HairStyle } from "./anim/hair";

type Cell = { hair: HairStyle; pal?: Partial<FigurePalette>; age?: Age; pose?: PoseName; label?: string; stoop?: number };
const BASE: FigurePalette = { coat: "#3f7cac", pants: "#2d3142", skin: "#e0ac82", hair: "#1f1713", shoe: "#1a1716", accent: "#efe6d6", garment: "jacket" };
const COATS = ["#c4553a", "#3f7cac", "#d8a03d", "#5b8c5a", "#b04a5a", "#6a5acd", "#2e8b8b", "#8b5e3c", "#e07b39", "#4a6fa5", "#a0527a", "#7a9a3a", "#c9c2b0", "#5a6b8c"];
const SKINS = ["#f1c9a5", "#e0ac82", "#c68c63", "#e8b994", "#9c6b4a"];

const PAGES: { title: string; rows: Cell[][] }[] = [
  {
    title: "Kiểu tóc nam — cổ điển & hiện đại",
    rows: [
      [{ hair: "short" }, { hair: "buzz" }, { hair: "curly" }, { hair: "pompadour" }, { hair: "twoBlock" }, { hair: "comma" }],
      [{ hair: "perm" }, { hair: "frenchCrop" }, { hair: "mullet" }, { hair: "manBun" }, { hair: "beanie", pal: { accent: "#c9a24a" } }, { hair: "cap", pal: { accent: "#2e3a5c" } }],
    ],
  },
  {
    title: "Kiểu tóc nữ — cổ điển & hiện đại",
    rows: [
      [{ hair: "bob" }, { hair: "long" }, { hair: "ponytail" }, { hair: "braid" }, { hair: "bunLow" }, { hair: "pixie" }, { hair: "curtain" }],
      [{ hair: "wolf" }, { hair: "bobBangs" }, { hair: "wavy" }, { hair: "messyBun" }, { hair: "halfUp" }, { hair: "spaceBuns" }, { hair: "pixieLayer" }],
    ],
  },
  {
    title: "Người già · trẻ em · tỷ lệ theo tuổi",
    rows: [
      [
        { hair: "bald", pal: { hair: "#cfcac2" }, stoop: 14, label: "Ông — hói, tóc bạc" },
        { hair: "bunGrey", pal: { hair: "#d6d1c8", garment: "coat", coat: "#7a5c8e" }, stoop: 10, label: "Bà — búi tóc bạc" },
        { hair: "khanVan", pal: { hair: "#d6d1c8", accent: "#2a1f1c", garment: "coat", coat: "#4a5a3a" }, stoop: 8, label: "Bà — khăn vấn" },
        { hair: "twoBlock", age: "adult", label: "Người lớn" },
        { hair: "ponytail", age: "teen", pal: { garment: "shirt", coat: "#f3f1ea", bottom: "skirt", pants: "#2d3142", redScarf: true }, label: "Thiếu niên 13–16" },
        { hair: "spiky", age: "child", pal: { garment: "tshirt", bottom: "shorts" }, label: "Trẻ 7–10" },
        { hair: "peachTuft", age: "toddler", pal: { garment: "overalls", pants: "#3f7cac", accent: "#f3e6c8" }, label: "Trẻ 3–5" },
      ],
      [
        { hair: "mushroom", age: "child", pal: { garment: "hoodie", bottom: "pants" } },
        { hair: "twinBuns", age: "child", pal: { garment: "dress", accent: "#b04a5a" } },
        { hair: "twinBraids", age: "child", pal: { garment: "tshirt", bottom: "skirt", accent: "#d23a2a" }, pose: "skip" },
        { hair: "peachTuft", age: "toddler", pal: { garment: "tshirt", bottom: "shorts" }, pose: "run" },
        { hair: "topKnot", age: "toddler", pal: { garment: "dress", accent: "#d8a03d" } },
        { hair: "spiky", age: "child", pal: { garment: "shirt", coat: "#f3f1ea", bottom: "shorts", pants: "#2d3142", redScarf: true }, pose: "point", label: "Đầu lởm chởm · đồng phục" },
        { hair: "mushroom", age: "child", pal: { garment: "tshirt", bottom: "shorts" }, pose: "sitFloor", label: "Đầu nấm · ngồi bệt" },
      ],
    ],
  },
  {
    title: "Kiểm tra động tác trẻ em (HB-004)",
    rows: [
      ([["stand", "Đứng"], ["point", "Chỉ"], ["reach", "Với tay"], ["wave", "Vẫy"], ["heart", "Tay lên ngực"], ["walk", "Đi"]] as [PoseName, string][]).map(([pose, label]) => ({ hair: "mushroom" as HairStyle, age: "child" as Age, pose, label, pal: { coat: "#2a9d8f", pants: "#264653", garment: "hoodie" as const, bottom: "shorts" as const } })),
    ],
  },
];

export const CharacterSheet: React.FC<{ page?: number }> = ({ page = 1 }) => {
  useBrandFonts();
  const frame = useCurrentFrame(), { fps } = useVideoConfig(), t = frame / fps;
  const pg = PAGES[Math.min(Math.max(page, 1), PAGES.length) - 1];
  const rowH = 470, top = 120;
  return (
    <AbsoluteFill style={{ background: "#EFE8DC" }}>
      <div style={{ position: "absolute", top: 34, left: 60, fontFamily: SERIF, fontSize: 44, color: "#2a2420" }}>{pg.title}</div>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {pg.rows.map((row, r) => {
          const n = row.length, cw = 1800 / n, baseY = top + rowH * (r + 1) - 70;
          return (
            <g key={r}>
              <line x1={60} x2={1860} y1={baseY + 4} y2={baseY + 4} stroke="rgba(60,50,40,0.18)" strokeWidth={2} />
              {row.map((c, i) => {
                const idx = r * 7 + i, age = c.age ?? "adult";
                const H = age === "adult" ? 360 : age === "teen" ? 320 : age === "child" ? 240 : 170;
                const pal: FigurePalette = { ...BASE, coat: COATS[idx % COATS.length], skin: SKINS[idx % SKINS.length], ...c.pal, hairStyle: c.hair };
                const x = 60 + cw * (i + 0.5);
                const pose = c.pose ?? "stand";
                return (
                  <g key={i}>
                    <Figure pose={pose} t={t + i} x={x - 10} y={pose === "sitFloor" ? baseY - H * 0.02 : baseY} H={H} age={age} palette={pal} scarf="none" stoop={c.stoop} />
                    <text x={x} y={baseY + 40} textAnchor="middle" fontFamily={SANS} fontSize={21} fill="#4a4038">{c.label ?? HAIR_LABEL[c.hair]}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
