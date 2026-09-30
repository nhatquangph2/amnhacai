// world.js: bờ sông và tảng đá — một thế giới dùng cho cả bài, đổi theo thời kỳ, mùa, thời tiết.
// bank(t, s) vẽ toàn bộ nền (trời → núi → bờ bên kia → sông → bờ bên này → tảng đá) trong toạ độ thế giới 1920×1080.
//   s.era     0 hoang · 1 làng · 2 thị trấn · 3 phố (số lẻ = đang dựng dần)
//   s.season  0 xuân · 1 hạ · 2 thu · 3 đông (liên tục; 4 = xuân năm sau)
//   s.night · s.dusk · s.rain · s.flood · s.mist (0..1)
//   s.erode 0 sắc cạnh → 1 tròn nhẵn · s.fleck độ sáng vết sáng · s.scratch vết xước · s.xmark dấu X đỏ · s.polish bóng
//   s.rail 0..1 lan can (phố) · s.dig 0..1 máy xúc vào sát đá
const STONE = { x: 1180, y: 790, rx: 165, ry: 92 };
const EDGE = 770, GROUND = 905, FLECK = [STONE.x + 38, STONE.y - 58];

const SEASON = {
  tree: ['#8DBF6A', '#5E9A4E', '#D98B2B', '#8E8E86'], grass: ['#9CC47A', '#7FAE5C', '#C9A24E', '#A8AA96'],
  sky: [['#BFE0EE', '#F6E3CF'], ['#A9D4EC', '#EFE6C8'], ['#E9C9A0', '#F4DDB8'], ['#B8C2C8', '#DADCD6']],
};
const sPick = (arr, s) => { const p = ((s % 4) + 4) % 4, i = Math.floor(p), f = p - i; return mixCol(arr[i], arr[(i + 1) % 4], f); };
const sNear = (s, c) => { const p = ((s % 4) + 4) % 4, d = Math.min(Math.abs(p - c), 4 - Math.abs(p - c)); return clamp(1 - d * 1.3); };
const NIGHT = (c, s) => mixCol(c, '#1F2550', .78 * (s.night || 0));
const DUSK = (c, s) => mixCol(c, '#E8906A', .28 * (s.dusk || 0) * (1 - (s.night || 0)));
const tone = (c, s) => NIGHT(DUSK(mixCol(c, '#7E8796', .35 * (s.rain || 0)), s), s);
const band = (x, a, b, f = .2) => clamp((x - a) / f + .5) * clamp((b - x) / f + .5);

function stoneShape(erode, j = 2) {
  const pts = [], n = 22;
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU, sharp = (i % 3 === 0 ? .22 : i % 3 === 1 ? -.12 : .05) * (1 - erode);
    const k = 1 + sharp + .06 * Math.sin(i * 2.7) * (1 - erode * .5);
    pts.push([STONE.x + Math.cos(a) * STONE.rx * k + jit(j), STONE.y + Math.sin(a) * STONE.ry * k * (Math.sin(a) > 0 ? .55 : 1) + jit(j)]);
  }
  return pts;
}

function drawStone(t, s) {
  boilSeed('stoneShadow');
  paint(ellPts(STONE.x + 10, STONE.y + 52, STONE.rx * 1.05, 16, 20, 3), { wash: tone('#6E6452', s), washOp: 150, ink: null });
  boilSeed('stone');
  const base = mixCol('#A39C8E', '#B9B2A2', s.polish || 0);
  paint(stoneShape(s.erode ?? 1), { wash: tone(base, s), fill: tone('#8F877A', s), fillOp: 140, bleed: .08, tex: .8, border: .6,
    hatch: { d: 9, a: .5, o: { rand: .35, gradient: .4 }, b: 'charcoal', c: tone('#6E675C', s), w: .7 }, ink: PAL.ink, sw: 1.4, curv: .15 + .35 * (s.erode ?? 1) });
  boilSeed('stoneHi');
  inkLine([[STONE.x - 95, STONE.y - 50], [STONE.x - 20, STONE.y - 82], [STONE.x + 70, STONE.y - 66]], 2.2 + 3 * (s.polish || 0), tone('#F4EEDF', s), 'dry', .6);
  // bụi bám
  if (s.dust > 0) { boilSeed('dust'); paint(stoneShape(s.erode ?? 1, 1).map(([x, y]) => [lerp(STONE.x, x, .9), lerp(STONE.y, y, .9)]), { wash: '#8A7F6A', washOp: 110 * s.dust, ink: null }); }
  // vết xước (người ta mài dao)
  if (s.scratch > 0) for (let i = 0; i < 5; i++) { boilSeed('scr' + i); const x0 = STONE.x - 90 + i * 22, y0 = STONE.y - 30 + (i % 2) * 12; inkLine([[x0, y0], [x0 + 26, y0 + 8]], .7, tone('#5A5346', s), 'inkfine', 0); }
  // dấu X đỏ
  if (s.xmark > 0) {
    const k = s.xmark, c = [STONE.x - 20, STONE.y - 20];
    boilSeed('xm1'); inkLine([[c[0] - 45, c[1] - 35], [lerp(c[0] - 45, c[0] + 45, clamp(k * 2)), lerp(c[1] - 35, c[1] + 35, clamp(k * 2))]], 7, '#C0392B', 'dry', .2);
    if (k > .5) { boilSeed('xm2'); inkLine([[c[0] + 45, c[1] - 35], [lerp(c[0] + 45, c[0] - 45, clamp(k * 2 - 1)), lerp(c[1] - 35, c[1] + 35, clamp(k * 2 - 1))]], 7, '#C0392B', 'dry', .2); }
  }
  // VẾT SÁNG: luôn có một đốm nhỏ; sáng lên theo s.fleck
  boilSeed('fleck');
  paint(starPts(FLECK[0], FLECK[1], 7 + 5 * (s.fleck || 0), .45, 4, .3), { wash: mixCol('#CFC8B4', '#FFF5D8', clamp((s.fleck || 0) + .2)), ink: null });
  if ((s.fleck || 0) > .03) { glow(FLECK[0], FLECK[1], 40 + 180 * s.fleck, '#FFE6A8', clamp(s.fleck * 1.1)); boilSeed('fleckStar'); paint(starPts(FLECK[0], FLECK[1], 10 + 30 * s.fleck, .22, 4, t * .4), { wash: '#FFF8E6', ink: null }); }
}

function bank(t, s) {
  s = { era: 0, season: 1, night: 0, dusk: 0, rain: 0, flood: 0, mist: 0, erode: 1, fleck: 0, ...s };
  const E = s.era, sea = s.season, win = sNear(sea, 3), spr = sNear(sea, 0), aut = sNear(sea, 2);
  // ---- trời
  const [sk0, sk1] = [sPick(SEASON.sky.map(v => v[0]), sea), sPick(SEASON.sky.map(v => v[1]), sea)];
  boilSeed('sky');
  paint(rectPts(-500, -400, W + 1000, 1000, 6), { wash: tone(sk1, s), fill: tone(sk0, s), fillOp: 220, bleed: .15, tex: .5, border: .2, ink: null });
  boilSeed('sky2'); paint(ellPts(900, 60, 1600, 360, 30, 20), { fill: tone(sk0, s), fillOp: 200, bleed: .25, tex: .6, border: .2, ink: null });
  for (let i = 0; i < 4; i++) {
    boilSeed('cloud' + i);
    const cx = ((200 + i * 560 + t * (8 + i * 3)) % 2600) - 300, cy = 140 + (i % 2) * 90;
    paint(ellPts(cx, cy, 300, 62, 18, 12), { fill: tone(mixCol('#FBF3EA', '#9AA3B5', s.rain), s), fillOp: 150, bleed: .3, tex: .5, border: .2, ink: null });
  }
  if (s.night > .3) for (let i = 0; i < 40; i++) { if (hash(i * 7) < .5) { boilSeed('st' + i); paint(starPts(hash(i) * W, hash(i * 3) * 300 + 20, 4 + 3 * hash(i * 5), .4, 4), { wash: '#F4EEDC', washOp: 255 * clamp(s.night * 1.4 - .4) * (1 - s.rain), ink: null }); } }
  if (s.dusk > .05 && s.night < .6) glow(1560, 330, 360, '#FFB870', s.dusk * (1 - s.night));
  // ---- núi đá vôi
  boilSeed('mtn');
  const m = [[-300, 520]]; for (let i = 0; i <= 14; i++) m.push([-300 + i * 180, 520 - 200 - 140 * hash(i * 3.1) - (i % 3 === 1 ? 90 : 0)]); m.push([2300, 520]);
  paint(m, { wash: tone(mixCol('#8FA89F', '#A8B3B8', win), s), fill: tone('#7F9A92', s), fillOp: 200, bleed: .1, tex: .6, border: .4, ink: tone('#5E756F', s), sw: .6, curv: .5 });
  // ---- bờ bên kia theo thời kỳ
  boilSeed('farbank'); paint(rectPts(-300, 505, W + 600, 45, 4), { wash: tone(sPick(SEASON.grass, sea), s), ink: null });
  const wildK = band(E, -1, 1.1, .3);
  if (wildK > 0) for (let i = 0; i < 9; i++) {
    // bụi cây ven bờ: thân + tán nhiều cụm chồng nhau, chân tán chạm bờ
    boilSeed('wt' + i);
    const x = -60 + i * 250 + hash(i) * 90, h = (50 + hash(i + 3) * 60) * wildK, r = (38 + hash(i + 9) * 28) * wildK, c = tone(sPick(SEASON.tree, sea), s), cd = tone(mixCol(sPick(SEASON.tree, sea), '#3C4A2E', .3), s);
    paint(ribbon([[x, 540], [x + 3, 540 - h * .7]], 9, 5), { wash: tone('#5A4032', s), ink: PAL.ink, sw: .6 });
    const blobs = [[0, -h, 1], [-r * .7, -h * .75, .75], [r * .7, -h * .8, .8], [0, -h * .55, .85]];
    blobs.forEach(([dx, dy, k], j) => paint(ellPts(x + dx, 540 + dy, r * k, r * .8 * k, 14, 4), { wash: j === 3 ? cd : c, ink: tone('#3C4A2E', s), sw: .7, curv: .6 }));
    if (spr > .1) for (let k = 0; k < 5; k++) paint(ellPts(x + (hash(i * 9 + k) - .5) * r * 1.6, 540 - h * .85 + (hash(k + i) - .5) * r, 8, 8, 6), { wash: '#F4B0C4', washOp: 255 * spr * wildK, ink: null });
  }
  // lau sậy mép nước bờ gần (hoang, làng)
  if (E < 2.4) for (let i = 0; i < 14; i++) {
    boilSeed('reed' + i);
    const x = hash(i * 5.3) * 2000 - 40, hgt = 50 + hash(i) * 50, sway = 6 * Math.sin(t * 1.5 + i);
    inkLine([[x, EDGE + 10], [x + sway * .4, EDGE + 10 - hgt * .6], [x + sway, EDGE + 10 - hgt]], 2.2, tone(mixCol(sPick(SEASON.grass, sea), '#6A7A46', .4), s), 'ink', .5);
    paint(ellPts(x + sway, EDGE + 10 - hgt, 5, 13, 8, 0, .2), { wash: tone(mixCol('#B59A62', sPick(SEASON.tree, sea), .3), s), ink: null });
  }
  // làng: nhà tranh + lũy tre
  const vilK = band(E, .7, 2.3, .3);
  if (vilK > 0) for (let i = 0; i < 8; i++) {
    const grow = clamp((E - .6 - i * .06) * 3) * vilK; if (grow <= 0) continue;
    boilSeed('hut' + i);
    const x = -40 + i * 250 + hash(i * 4) * 60, w = 120 + hash(i) * 40, h = 60 * grow, b = 532;
    paint(rectPts(x, b - h * .55, w, h * .55, 2), { wash: tone('#C9A77E', s), ink: PAL.ink, sw: .7 });
    paint([[x - 16, b - h * .5], [x + w / 2, b - h - 8], [x + w + 16, b - h * .5]], { wash: tone(mixCol('#A08A4E', '#7E7A6A', clamp(E - 1.6)), s), ink: PAL.ink, sw: .7 });
    if (s.night > .3) glow(x + w * .5, b - h * .3, 40, '#FFC766', s.night * .8);
    boilSeed('bb' + i);
    for (let k = 0; k < 5; k++) inkLine([[x + w + 20 + k * 5, 532], [x + w + 30 + k * 8 + 6 * Math.sin(t + k), 532 - 90 * grow - k * 6]], 2.2, tone(mixCol(sPick(SEASON.tree, sea), '#5B7A3C', .4), s), 'ink', .5);
  }
  // thị trấn: nhà mái ngói + cầu + cột điện
  const townK = band(E, 1.7, 9, .3);
  if (townK > 0) {
    for (let i = 0; i < 9; i++) {
      const grow = clamp((E - 1.6 - i * .05) * 3) * townK; if (grow <= 0) continue;
      boilSeed('town' + i);
      const x = -60 + i * 230 + hash(i * 7) * 40, w = 140 + hash(i + 2) * 40, h = 90 * grow, b = 532;
      paint(rectPts(x, b - h * .6, w, h * .6, 2), { wash: tone('#E6D6B8', s), ink: PAL.ink, sw: .7 });
      paint([[x - 12, b - h * .58], [x + w * .5, b - h], [x + w + 12, b - h * .58]], { wash: tone('#B4553C', s), ink: PAL.ink, sw: .7 });
      paint(rectPts(x + w * .15, b - h * .45, 18, 16, 1), { wash: s.night > .3 ? '#FFC766' : tone('#6F7FA0', s), ink: null });
    }
    boilSeed('bridge');
    paint([[-300, 470], [520, 470], [520, 488], [-300, 488]], { wash: tone('#BEB6A6', s), washOp: 255 * townK, ink: PAL.ink, sw: .7 });
    for (const x of [60, 260, 460]) paint(rectPts(x, 488, 18, 60), { wash: tone('#A59D8E', s), washOp: 255 * townK, ink: PAL.ink, sw: .6 });
  }
  // phố: nhà cao
  const cityK = clamp((E - 2.5) * 2);
  if (cityK > 0) for (let i = 0; i < 12; i++) {
    boilSeed('bld' + i);
    const x = -120 + i * 180 + hash(i) * 40, h = (100 + hash(i + 7) * 170) * clamp(cityK * 1.3 - i * .03), w = 110 + hash(i + 3) * 50;
    if (h < 5) continue;
    paint(rectPts(x, 505 - h, w, h, 3), { wash: tone(i % 2 ? '#D9CBB8' : '#E6D8C4', s), ink: tone('#8C7F70', s), sw: .5 });
    for (let k = 0; k < Math.floor(h / 45); k++) for (let j = 0; j < 2; j++) {
      const lit = hash(i * 31 + k * 7 + j) < .55, wx = x + 18 + j * (w / 2.2), wy = 505 - h + 18 + k * 45;
      paint(rectPts(wx, wy, 20, 16, 1), { wash: lit && s.night > .3 ? '#FFC766' : tone('#B9AB98', s), ink: null });
    }
    if (s.night > .3 && hash(i * 5) < .5) glow(x + w / 2, 505 - h / 2, 90, '#FFC766', .3 * s.night);
  }
  // ---- sông
  const water = tone(mixCol('#78AEB6', '#8C7A56', s.flood * .7), s);
  boilSeed('river'); paint(rectPts(-300, 545, W + 600, EDGE - 540, 3), { wash: water, fill: tone('#6FA0A8', s), fillOp: 180, bleed: .08, tex: .5, border: .3, ink: null });
  for (let i = 0; i < 16; i++) {
    boilSeed('rip' + i);
    const y = 575 + (i * 37) % 180, x = ((i * 263 + t * (30 + s.flood * 200)) % 2300) - 200, l = 60 + hash(i) * 90;
    inkLine([[x, y], [x + l * .5, y - 3], [x + l, y]], .6, tone('#E9F2EE', s), 'inkfine', .5);
  }
  // ---- bờ bên này
  const cityGround = clamp((E - 2.6) * 2.5);
  boilSeed('ground');
  paint(rectPts(-300, EDGE, W + 600, 700, 3), { wash: tone(mixCol(mixCol(sPick(SEASON.grass, sea), '#B89A6E', clamp(E - .6) * .6), '#C9BBA6', cityGround), s), fill: tone('#A8966E', s), fillOp: 90, bleed: .05, tex: .7, border: .5, ink: null });
  if (cityGround < 1) {
    // lối mòn + cỏ (hoang/làng/thị trấn)
    boilSeed('path'); paint(rectPts(-300, GROUND - 26, W + 600, 58, 5), { wash: tone('#C9AE82', s), washOp: 255 * clamp(E * 1.5) * (1 - cityGround), ink: null });
    for (let i = 0; i < 26; i++) {
      boilSeed('tuft' + i);
      const x = hash(i * 3.7) * 2100 - 90, y = EDGE + 18 + hash(i * 1.3) * 250, h = 16 + hash(i) * 22, sway = 3 * Math.sin(t * 1.8 + i);
      if (Math.abs(y - GROUND) < 34) continue;
      paint([[x - 5, y], [x + sway, y - h], [x + 5, y]], { wash: tone(mixCol(sPick(SEASON.tree, sea), '#4F6A38', .35), s), washOp: 255 * (1 - cityGround), ink: null });
    }
  } else {
    for (let i = 0; i < 9; i++) { boilSeed('tile' + i); inkLine([[-200 + i * 280, EDGE + 40], [-320 + i * 300, 1080]], .5, tone('#AE9F88', s), 'inkfine', .2); }
  }
  inkLine([[-300, EDGE + 4], [960, EDGE + 1], [2300, EDGE + 5]], 1.2, tone('#6F6456', s));
  // lan can chừa khoảng trống quanh tảng đá (phố)
  if (s.rail > 0) {
    const col = tone('#5C5650', s), gapL = STONE.x - STONE.rx - 40, gapR = STONE.x + STONE.rx + 40, y0 = EDGE - 72, k = s.rail;
    boilSeed('rail');
    inkLine([[-300, y0], [lerp(-300, gapL - 30, k), y0 + 2]], 1.3, col);
    inkLine([[2300, y0], [lerp(2300, gapR + 30, k), y0 + 2]], 1.3, col);
    if (k > .95) { inkLine([[gapL - 30, y0 + 2], [gapL, y0 + 12], [gapL - 6, y0 + 34], [gapL - 20, y0 + 30]], 1.2, col, 'ink', .8); inkLine([[gapR + 30, y0 + 2], [gapR, y0 + 12], [gapR + 6, y0 + 34], [gapR + 20, y0 + 30]], 1.2, col, 'ink', .8); }
    for (let x = -260; x < 2280; x += 64) if ((x < gapL - 20 && x < lerp(-300, gapL, k)) || (x > gapR + 20 && x > lerp(2300, gapR, k))) { boilSeed('post' + x); inkLine([[x, y0], [x, EDGE]], .8, col, 'inkfine', 0); }
  }
  // lũ: nước dâng trùm bờ
  if (s.flood > .02) {
    boilSeed('flood');
    const top = lerp(EDGE + 10, STONE.y - 40, s.flood);
    const pts = [[-300, 1200], [-300, top]]; for (let i = 0; i <= 12; i++) pts.push([-300 + i * 210, top + 10 * Math.sin(i * 1.3 + t * 3)]); pts.push([2300, 1200]);
    paint(pts, { wash: tone('#8C8A68', s), washOp: 215, fill: tone('#6F8A84', s), fillOp: 120, bleed: .1, tex: .6, border: .3, ink: tone('#4E5A52', s), sw: .8, curv: .5 });
    for (let i = 0; i < 12; i++) { boilSeed('fl' + i); const y = top + 25 + (i * 53) % 260, x = ((i * 211 + t * 260) % 2300) - 150; inkLine([[x, y], [x + 50, y - 4], [x + 100, y]], 1, tone('#EEF1EA', s), 'inkfine', .5); }
  }
}

// Thời tiết phủ trên cùng (trong camera): mưa, sương đông, hoa đào / lá rơi
function weather(t, s) {
  s = { season: 1, rain: 0, night: 0, ...s };
  const win = sNear(s.season, 3), spr = sNear(s.season, 0), aut = sNear(s.season, 2);
  const rain = Math.max(s.rain, win * .2);
  if (win > .05 || s.mist > 0) { boilSeed('mist'); paint(ellPts(960, 560, 1500, 120, 24, 20), { fill: '#E4E8E6', fillOp: 150 * Math.max(win, s.mist || 0), bleed: .3, tex: .3, border: .1, ink: null }); }
  if (rain > .01) for (let i = 0, n = Math.round(80 * rain); i < n; i++) {
    boilSeed('rain' + i);
    const sp = 1500 + hash(i) * 500, x = (hash(i * 3.3) * 2600 + t * 260) % 2600 - 350, y = (hash(i * 7.1) * 1400 + t * sp) % 1400 - 250, l = 40 + hash(i) * 30;
    inkLine([[x, y], [x - l * .25, y + l]], .7, mixCol('#E8EEF2', '#9FAAD8', s.night), 'inkfine', 0);
  }
  const fall = Math.max(spr, aut) * (1 - s.rain);
  if (fall > .05) for (let i = 0; i < 22; i++) {
    boilSeed('pet' + i);
    const sp = 60 + hash(i) * 50, x = (hash(i * 2.2) * 2400 + t * 55 + 40 * Math.sin(t * 1.3 + i)) % 2400 - 250, y = (hash(i * 5.7) * 1300 + t * sp) % 1300 - 200;
    const leaf = aut > spr;
    paint(ellPts(x, y, leaf ? 16 : 13, leaf ? 7 : 8, 8, 0, t * 2 + i), { wash: leaf ? ['#D98B2B', '#C2641F', '#E0B04A'][i % 3] : ['#F4B0C4', '#F7C9D6', '#EEA0B8'][i % 3], washOp: 255 * fall, ink: null });
  }
}
