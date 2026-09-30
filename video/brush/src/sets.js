// sets.js: bối cảnh & đạo cụ cho "Hai tác phẩm của thời gian" (STORYBOARD.md bản 3). Vẽ trong toạ độ thế giới 1920×1080.
const TAM = {
  child: { coat: '#6F8FB0', pants: '#4A3A2C', shoe: '#C99A74', skin: '#D9A27C', hair: '#1C1715' },
  young: { coat: '#4F6D8C', pants: '#3A3F5C', shoe: '#C99A74', skin: '#C99A74', hair: '#1C1715' },
  mid:   { coat: '#4F6D8C', pants: '#3A3F5C', shoe: '#C99A74', skin: '#C3906C', hair: '#4A4540' },
  old:   { coat: '#5E7488', pants: '#3A3634', shoe: '#C3906C', skin: '#C3906C', hair: '#E6E2DA' },
};
const VILLAGERS = [
  { coat: '#6B5236', pants: '#3A2F26', shoe: '#C99A74', skin: '#D9A27C', hair: '#1C1715' },
  { coat: '#8A3F3A', pants: '#2C2A30', shoe: '#C99A74', skin: '#D8AA86', hair: '#1C1715' },
  { coat: '#2F3A52', pants: '#26242A', shoe: '#C99A74', skin: '#D2A07C', hair: '#1C1715' },
  { coat: '#6F7A5A', pants: '#3A3634', shoe: '#C99A74', skin: '#C99A74', hair: '#2A201A' },
  { coat: '#C9A56A', pants: '#4A4540', shoe: '#C99A74', skin: '#E0B08C', hair: '#1C1715' },
  { coat: '#B55A36', pants: '#3A3634', shoe: '#C99A74', skin: '#EFC4A0', hair: '#2B2233' },
];
const bg = (col, key = 'bg') => { boilSeed(key); paint(rectPts(-600, -600, W + 1200, H + 1200, 4), { wash: col, ink: null }); };

// ---------- Ánh sáng dẫn lối: đốm sáng ấm, lõi sao, đuôi hạt sáng
function lightOrb(x, y, k, t, key = 'orb') {
  if (k <= .01) return;
  const b = 1 + .15 * Math.sin(t * 5);
  glow(x, y, 160 * k * b, '#FFE2A0', k);
  glow(x, y, 60 * k, '#FFF6DC', k);
  boilSeed(key); paint(starPts(x, y, 22 * k * b, .22, 4, t * .6), { wash: '#FFFBEE', ink: null });
  for (let i = 0; i < 6; i++) { const a = t * 1.5 + i * 1.05, r = 40 + 18 * Math.sin(t * 3 + i); boilSeed(key + i); paint(ellPts(x + Math.cos(a) * r * k, y + Math.sin(a) * r * .6 * k + 10, 4, 4, 6), { wash: '#FFF1C8', washOp: 220 * k, ink: null }); }
}

// ---------- sáng thế
function genesis(t, s) {
  // s.k: 0 lửa dữ dội → 1 nguội; s.view: 'wide' | 'close'
  const heat = 1 - (s.k || 0);
  bg(mixCol('#2A1E2E', '#1A1A2A', 1 - heat), 'gSky');
  glow(960, 700, 900, '#FF7A3A', .8 * heat);
  if (s.view !== 'close') {
    boilSeed('volc'); paint([[300, 1100], [760, 380], [880, 350], [1000, 360], [1500, 1100]], { wash: '#2B1E22', fill: '#3A2528', fillOp: 180, bleed: .1, tex: .8, border: .5, hatch: { d: 16, a: .8, o: { rand: .4 }, b: 'charcoal', c: '#150F14', w: .8 }, ink: PAL.ink, sw: 1.4 });
    boilSeed('farV'); paint([[-200, 1100], [180, 560], [520, 1100]], { wash: '#221A26', ink: null }); paint([[1300, 1100], [1700, 520], [2200, 1100]], { wash: '#221A26', ink: null });
    for (let i = 0; i < 5; i++) {
      boilSeed('lava' + i);
      const x0 = 850 + i * 30 - 60, wig = 30 * Math.sin(t * 1.5 + i);
      paint(ribbon([[x0, 370], [x0 - 120 + i * 60 + wig, 600], [x0 - 260 + i * 130, 900], [x0 - 380 + i * 190, 1100]], 26, 60), { wash: mixCol('#FF8A3A', '#8A2A1A', 1 - heat), ink: null });
    }
    glow(880, 360, 260, '#FFB060', heat);
    for (let i = 0; i < 26; i++) {
      const p = frac(t * .6 + hash(i)), a = -Math.PI / 2 + (hash(i * 3) - .5) * 1.4, d = 700 * p;
      boilSeed('ember' + i); paint(ellPts(880 + Math.cos(a) * d, 360 + Math.sin(a) * d + 900 * p * p, 9 * (1 - p), 9 * (1 - p), 6), { wash: '#FFC76A', ink: null });
    }
    boilSeed('smoke'); paint(ellPts(900, 180, 420, 160, 20, 30), { fill: '#3E3440', fillOp: 180, bleed: .3, tex: .6, border: .2, ink: null });
  } else {
    // khối đá mới nguội: nứt đỏ tắt dần, hơi nước bốc
    boilSeed('newRock');
    paint(stoneShape(0, 1).map(([x, y]) => [960 + (x - STONE.x) * 3, 620 + (y - STONE.y) * 3]), { wash: mixCol('#5A3A34', '#6E6A62', 1 - heat), hatch: { d: 12, a: .5, o: { rand: .4 }, b: 'charcoal', c: '#2A2224', w: .9 }, ink: PAL.ink, sw: 2, curv: .05 });
    for (let i = 0; i < 7; i++) { boilSeed('crack' + i); const x = 700 + i * 80; inkLine([[x, 520 + 30 * hash(i)], [x + 30, 600], [x + 10, 690]], 4, mixCol('#FF7A2A', '#3A2E2C', clamp(1 - heat * 1.2)), 'ink', .3); }
    if (heat > .1) glow(960, 620, 400, '#FF6A2A', heat * .8);
    for (let i = 0; i < 8; i++) { const p = frac(t * .4 + i / 8); boilSeed('steam' + i); paint(ellPts(760 + i * 60 + 30 * Math.sin(t + i), 470 - 300 * p, 40 + 60 * p, 30 + 40 * p, 12, 4), { wash: '#C9C4C8', washOp: 150 * (1 - p) * (1 - heat * .5), ink: null }); }
  }
}

// ---------- nhà tranh đêm bão, đèn dầu, người mẹ bế con
function hutNight(t, s) {
  bg('#2A2230', 'hutBg');
  boilSeed('wall'); paint(rectPts(-100, -100, W + 200, 900, 4), { wash: '#4A3A30', fill: '#3E3028', fillOp: 150, bleed: .1, tex: .8, border: .5, ink: null });
  boilSeed('floor'); paint(rectPts(-100, 820, W + 200, 400, 4), { wash: '#3A2C24', ink: PAL.ink, sw: 1 });
  // cửa sổ: mưa bão, chớp
  const fl = Math.exp(-Math.pow((frac(t * .37) - .5) / .03, 2));
  boilSeed('win'); paint(rectPts(1300, 200, 360, 300, 3), { wash: mixCol('#1E2436', '#C9D6F2', fl), ink: PAL.ink, sw: 1.6 });
  inkLine([[1480, 200], [1480, 500]], 3, PAL.ink); inkLine([[1300, 350], [1660, 350]], 3, PAL.ink);
  for (let i = 0; i < 16; i++) { boilSeed('wr' + i); const x = 1310 + hash(i) * 340, y = 210 + ((hash(i * 3) * 280 + t * 900) % 280); inkLine([[x, y], [x - 6, y + 22]], .8, '#9FAAD8', 'inkfine', 0); }
  // đèn dầu
  const lamp = [700, 560];
  glow(lamp[0], lamp[1] - 40, 420, '#FFB860', .9 + .08 * Math.sin(t * 9));
  boilSeed('lamp'); paint(ellPts(lamp[0], lamp[1], 40, 22, 14), { wash: '#8A6A4E', ink: PAL.ink, sw: 1 });
  paint(ellPts(lamp[0], lamp[1] - 45, 26, 42, 14), { wash: '#F4E6C8', washOp: 150, ink: PAL.ink, sw: .8 });
  paint(ellPts(lamp[0], lamp[1] - 45 + 2 * Math.sin(t * 11), 7, 16, 8), { wash: '#FFD27A', ink: null });
  // mẹ ngồi bế con, cha đứng cạnh
  boilSeed('bed'); paint(rectPts(880, 800, 300, 30, 2), { wash: '#8A6A4E', ink: PAL.ink, sw: 1 }); for (const x of [890, 1160]) paint(rectPts(x, 830, 14, 70, 1), { wash: '#6B4A2E', ink: PAL.ink, sw: .8 });
  person(1000, 800, 28, { body: 'adult', pal: VILLAGERS[5], outfit: 'dress', hair: 'bun', sit: 1, armN: [1.0, 1.4], armF: [.9, 1.5], eyes: 'closed', smile: .8, lookUp: -.4, key: 'mother' });
  boilSeed('baby'); paint(ellPts(1070, 730, 50, 30, 14, 2, -.2), { wash: '#EFE6D6', ink: PAL.ink, sw: 1 }); paint(ellPts(1105, 716, 19, 18, 12), { wash: '#F2C9A5', ink: PAL.ink, sw: .8 }); inkLine([[1100, 714], [1108, 716]], .8, PAL.ink, 'inkfine', 0);
  person(820, 905, 28, { body: 'adult', pal: VILLAGERS[0], outfit: 'shirt', hair: 'short', eyes: 'happy', smile: 1, lookUp: -.2, key: 'father' });
}

// ---------- lát cắt lòng sông: đá nằm dưới nước
function riverSection(t, s) {
  // s.silt 0..1 bùn phủ · s.fleck · s.erode · s.night · s.flow
  const n = s.night || 0;
  bg(mixCol('#9CC7D8', '#1E2540', n), 'secSky');
  boilSeed('surf'); paint(rectPts(-300, 160, W + 600, 30, 4), { wash: mixCol('#DCEEF2', '#3A4A70', n), ink: null });
  boilSeed('water'); paint(rectPts(-300, 180, W + 600, 820, 4), { wash: mixCol('#4E8FA8', '#1A2446', n), fill: mixCol('#3E7A96', '#141C38', n), fillOp: 180, bleed: .2, tex: .5, border: .2, ink: null });
  for (let i = 0; i < 5; i++) { boilSeed('ray' + i); paint([[200 + i * 380, 170], [300 + i * 380, 170], [520 + i * 380, 1000], [380 + i * 380, 1000]], { wash: '#E6F4F2', washOp: 40 * (1 - n), ink: null }); }
  for (let i = 0; i < 18; i++) { boilSeed('fl' + i); const y = 260 + (i * 47) % 560, x = ((i * 233 + t * 180 * (s.flow || 1)) % 2300) - 200; inkLine([[x, y], [x + 70, y - 6], [x + 140, y]], 1.2, mixCol('#CFE6EE', '#5A6A9A', n), 'inkfine', .5); }
  // đáy sông
  boilSeed('bed'); paint([[-300, 820], [400, 800], [900, 830], [1500, 805], [2300, 825], [2300, 1300], [-300, 1300]], { wash: mixCol('#8A7A5A', '#2A2A3A', n), hatch: { d: 12, a: 0, o: { rand: .5 }, b: 'charcoal', c: '#5A4E3A', w: .6 }, ink: PAL.ink, sw: 1, curv: .5 });
  for (let i = 0; i < 14; i++) { boilSeed('peb' + i); paint(ellPts(hash(i) * 1900, 850 + hash(i * 3) * 160, 14 + 20 * hash(i + 2), 9 + 10 * hash(i + 5), 10, 2), { wash: mixCol('#9A9284', '#3A3A48', n), ink: PAL.ink, sw: .6 }); }
  // tảng đá
  boilSeed('secStone');
  const pts = stoneShape(s.erode ?? 1, 2).map(([x, y]) => [960 + (x - STONE.x) * 2.2, 740 + (y - STONE.y) * 2.2]);
  paint(pts, { wash: mixCol('#8C8579', '#4A4A58', n), fill: '#6E6A62', fillOp: 130, bleed: .08, tex: .8, border: .5, hatch: { d: 10, a: .5, o: { rand: .35, gradient: .4 }, b: 'charcoal', c: '#4E4A42', w: .8 }, ink: PAL.ink, sw: 1.6, curv: .15 + .35 * (s.erode ?? 1) });
  // bùn phủ dần
  if (s.silt > 0) { boilSeed('silt'); const top = lerp(840, 560, s.silt); paint([[-300, top + 20], [600, top], [960, top - 20], [1300, top], [2300, top + 20], [2300, 1300], [-300, 1300]], { wash: mixCol('#6E5E44', '#26243A', n), fill: '#5A4A34', fillOp: 120, bleed: .1, tex: .7, border: .4, ink: PAL.ink, sw: .8, curv: .5 }); }
  // vết sáng
  const fx = 1045, fy = 610, f = s.fleck || 0;
  if (f > 0) { glow(fx, fy, 60 + 260 * f, '#FFE6A8', clamp(f)); boilSeed('secFleck'); paint(starPts(fx, fy, 10 + 34 * f, .22, 4, t * .4), { wash: '#FFF8E6', ink: null }); }
  // cá
  for (let i = 0; i < 3; i++) { const x = ((i * 700 + t * 90) % 2400) - 200, y = 360 + i * 120; boilSeed('fish' + i); paint([[x, y], [x + 50, y - 16], [x + 90, y], [x + 50, y + 16]], { wash: mixCol('#5E7E8A', '#2A3050', n), ink: null, curv: .6 }); paint([[x, y], [x - 26, y - 14], [x - 26, y + 14]], { wash: mixCol('#5E7E8A', '#2A3050', n), ink: null }); }
}

// ---------- bản đồ từ trên cao: khúc sông, đá là một chấm
function mapView(t, s) {
  // s.age 0..1: rừng/khủng long/núi · s.ferry: thuyền qua lại · s.plaza: quảng trường + dòng người
  bg(s.plaza ? '#B9B09C' : sPick(SEASON.grass, s.season || 1), 'mapBg');
  if (!s.plaza) {
    for (let i = 0; i < 40; i++) { const g = clamp((s.age || 0) * 3 - hash(i) * 1.5) * (1 - clamp(((s.age || 0) - .7) * 4 * hash(i * 2))); if (g <= 0) continue; boilSeed('forest' + i); paint(ellPts(hash(i * 3) * 1900, hash(i * 7) * 1080, 60 * g, 60 * g, 12, 6), { wash: mixCol('#3E6B3A', '#5E8A48', hash(i)), ink: '#2E4A2A', sw: .6 }); }
    const rv = []; for (let i = 0; i <= 12; i++) rv.push([-100 + i * 180, 540 + 180 * Math.sin(i * .7 + 1)]);
    boilSeed('mapRiver'); paint(ribbon(rv, 150, 150), { wash: '#5E9FC0', fill: '#4E8FB0', fillOp: 140, bleed: .1, tex: .5, border: .3, ink: '#2E5A70', sw: 1, curv: .5 });
    for (let i = 0; i < 10; i++) { boilSeed('mr' + i); const k = (i * .1 + t * .08) % 1, p = rv[Math.floor(k * 12)], q = rv[Math.min(12, Math.floor(k * 12) + 1)]; inkLine([[p[0], p[1] - 20], [lerp(p[0], q[0], .4), lerp(p[1], q[1], .4) - 20]], 1.2, '#DDF0F6', 'inkfine', .4); }
    // đá: một chấm với vết sáng
    boilSeed('mapStone'); paint(ellPts(960, 560, 22, 16, 10, 2), { wash: '#8C8579', ink: PAL.ink, sw: 1 }); if (s.fleck) glow(960, 555, 50, '#FFE6A8', s.fleck);
    // khủng long đi ngang (nhìn từ trên: thân + cổ dài)
    const dino = seg(s.age || 0, .25, .55);
    if (dino > 0 && dino < 1) for (let d = 0; d < 3; d++) { const x = lerp(-200, 2100, dino) - d * 160, y = 260 + d * 40; boilSeed('dino' + d); paint(ellPts(x, y, 60, 34, 12), { wash: '#7A8A5A', ink: PAL.ink, sw: 1 }); paint(ribbon([[x + 50, y], [x + 110, y - 20], [x + 150, y - 10]], 16, 10), { wash: '#7A8A5A', ink: PAL.ink, sw: .8 }); paint(ribbon([[x - 50, y], [x - 120, y + 10]], 16, 4), { wash: '#7A8A5A', ink: PAL.ink, sw: .8 }); }
    // núi nhô lên
    const mt = seg(s.age || 0, .5, .9);
    if (mt > 0) for (let i = 0; i < 7; i++) { const cx = -100 + i * 350, cy = i % 2 ? 1040 : 40; boilSeed('mtTop' + i); paint(ellPts(cx, cy, 240 * mt, 160 * mt, 16, 10), { wash: '#8A9A7E', ink: '#4E5E48', sw: .8, curv: .5 }); paint(ellPts(cx - 40, cy - 20, 130 * mt, 80 * mt, 14, 8), { wash: '#A9B89A', ink: null, curv: .5 }); }
    // đò qua lại
    if (s.ferry) for (let i = 0; i < 3; i++) { const k = (t * .25 + i / 3) % 1, x = 900 + 30 * i, y = lerp(420, 700, k < .5 ? k * 2 : 2 - k * 2); boilSeed('ferry' + i); paint(ellPts(x, y, 26, 9, 10, 1, .2), { wash: '#6B4A2E', ink: PAL.ink, sw: .8 }); glow(x, y, 26, '#FFD98A', .6); }
  } else {
    // quảng trường nhìn từ trên: vòng tròn lát đá, đá ở tâm, dòng người đổ về
    boilSeed('plzC'); paint(ellPts(960, 560, 620, 420, 40, 4), { wash: '#D9CFBC', ink: PAL.ink, sw: 1.2 });
    for (let r = 1; r <= 4; r++) { boilSeed('ring' + r); paint(ellPts(960, 560, 140 * r, 95 * r, 36, 2), { ink: '#B9AE98', sw: .8 }); }
    boilSeed('mapStoneP'); paint(ellPts(960, 560, 40, 28, 12, 2), { wash: '#8C8579', ink: PAL.ink, sw: 1.2 }); glow(960, 552, 90, '#FFE6A8', .9);
    for (let i = 0; i < 90; i++) { const a = hash(i) * TAU, k = clamp(1 - frac(t * .12 + hash(i * 3)) * 1.1), r = lerp(1100, 160 + 260 * hash(i * 5), ease(1 - k)); boilSeed('dot' + i); paint(ellPts(960 + Math.cos(a) * r, 560 + Math.sin(a) * r * .68, 9, 9, 6), { wash: VILLAGERS[i % 6].coat, ink: PAL.ink, sw: .5 }); }
    for (let i = 0; i < 10; i++) { boilSeed('mapMt' + i); const a = i / 10 * TAU, cx = 960 + Math.cos(a) * 980, cy = 560 + Math.sin(a) * 680; paint(ellPts(cx, cy, 330, 230, 18, 20), { wash: '#6E8A7A', ink: '#3E5A4E', sw: 1, curv: .5 }); paint(ellPts(cx - 60, cy - 40, 170, 110, 14, 10), { wash: '#8FA89A', ink: null, curv: .5 }); }
  }
}

// ---------- bến đò: cầu tàu, đò, đèn lồng (vẽ đè lên bank())
const DOCK = { x: 380, y: EDGE + 6 };
function dock(t, s) {
  boilSeed('dockDeck'); paint(rectPts(DOCK.x - 260, DOCK.y - 12, 420, 26, 2), { wash: tone('#8A6A4E', s), ink: PAL.ink, sw: 1 });
  for (let i = 0; i < 5; i++) { boilSeed('pile' + i); paint(rectPts(DOCK.x - 250 + i * 100, DOCK.y + 10, 14, 90, 1), { wash: tone('#5A4032', s), ink: PAL.ink, sw: .8 }); }
  // cột đèn lồng
  boilSeed('lpost'); inkLine([[DOCK.x + 140, DOCK.y], [DOCK.x + 140, DOCK.y - 230], [DOCK.x + 175, DOCK.y - 230]], 4, tone('#5A4032', s), 'ink', .2);
  lantern(DOCK.x + 175, DOCK.y - 210, s.lamp ?? 0, t, s, 'dockLamp');
}
function lantern(x, y, on, t, s, key) {
  boilSeed(key); inkLine([[x, y - 20], [x, y]], 1.4, PAL.ink, 'inkfine', 0);
  paint(ellPts(x, y + 22, 18, 24, 12), { wash: on > .1 ? mixCol('#E8A060', '#FFD98A', on) : tone('#8A5A44', s || {}), ink: PAL.ink, sw: .9 });
  paint(rectPts(x - 12, y - 2, 24, 6, 1), { wash: '#3A2C24', ink: null }); paint(rectPts(x - 12, y + 44, 24, 6, 1), { wash: '#3A2C24', ink: null });
  if (on > .02) glow(x, y + 22, 120 + 20 * Math.sin(t * 7), '#FFC766', on);
}
function boat(x, y, t, s, key = 'boat', lamp = 0) {
  const bob = 4 * Math.sin(t * 2);
  boilSeed(key); paint([[x - 170, y - 14 + bob], [x + 170, y - 22 + bob], [x + 130, y + 26 + bob], [x - 140, y + 28 + bob]], { wash: tone('#6B4A2E', s), ink: PAL.ink, sw: 1.2, curv: .4 });
  inkLine([[x - 150, y - 10 + bob], [x + 150, y - 18 + bob]], 1, tone('#A07A56', s), 'inkfine', .3);
  if (lamp) lantern(x + 150, y - 90 + bob, lamp, t, s, key + 'L');
  if (lamp) inkLine([[x + 150, y - 110 + bob], [x + 150, y - 20 + bob]], 2, PAL.ink, 'ink', 0);
  return y + bob;
}

// ---------- cây cầu bê tông bắc ngang sông
function bridge(t, s, k = 1) {
  const col = tone('#BEB6A6', s);
  for (let i = 0; i < 4; i++) { const h = 220 * clamp(k * 4 - i * .6); if (h < 2) continue; boilSeed('bp' + i); paint(rectPts(300 + i * 420, EDGE - h, 50, h, 2), { wash: tone('#A59D8E', s), ink: PAL.ink, sw: 1 }); }
  const deck = clamp(k * 1.6 - .6);
  if (deck > 0) { boilSeed('bdeck'); paint(rectPts(-100, EDGE - 250, (W + 200) * deck, 36, 2), { wash: col, ink: PAL.ink, sw: 1.2 }); for (let x = -80; x < (W + 100) * deck; x += 60) { boilSeed('br' + x); inkLine([[x, EDGE - 250], [x, EDGE - 290]], 1, tone('#6E6A62', s), 'inkfine', 0); } inkLine([[-100, EDGE - 290], [-100 + (W + 200) * deck, EDGE - 290]], 1.4, tone('#6E6A62', s)); }
}

// ---------- quảng trường lớn giữa núi non hùng vĩ
function plaza(t, s) {
  // s.cloth 0..1 vải phủ (1 = phủ kín) · s.dusk · s.crowd 0..1 · s.years (nhiều năm sau)
  const d = s.dusk || 0, tn = c => mixCol(c, '#E8906A', .3 * d);
  bg(mixCol('#9CCBE8', '#F2B08A', d), 'pSky'); boilSeed('pSky2'); paint(rectPts(-400, 300, W + 800, 400, 5), { fill: mixCol('#DCEEF4', '#F7D2A8', d), fillOp: 200, bleed: .3, tex: .4, border: .2, ink: null });
  if (d > .1) glow(1500, 420, 500, '#FFB870', d);
  // núi hùng vĩ: 3 lớp, đỉnh tuyết/đá vôi
  const layers = [[420, '#A9BCC4', 360, 240], [520, '#7E9A96', 420, 190], [620, '#5E7E6E', 360, 150]];
  layers.forEach(([base, col, amp, step], L) => {
    boilSeed('pm' + L);
    const m = [[-400, base + 200]]; for (let i = 0; i <= Math.ceil(2800 / step); i++) m.push([-400 + i * step, base - amp * (.4 + .6 * hash(i * 3.3 + L)) - (i % 3 === 1 ? amp * .35 : 0)]); m.push([2400, base + 200]);
    paint(m, { wash: tn(col), fill: tn(mixCol(col, '#3E5A4E', .2)), fillOp: 150, bleed: .1, tex: .6, border: .4, ink: tn(mixCol(col, '#2E3E3A', .5)), sw: .8, curv: .35 });
  });
  boilSeed('mist'); paint(ellPts(960, 620, 1500, 90, 24, 12), { fill: '#F2F4F0', fillOp: 150, bleed: .3, tex: .3, border: .1, ink: null });
  // mặt quảng trường: lát đá, vòng tròn đồng tâm
  boilSeed('pGround'); paint(rectPts(-400, 660, W + 800, 800, 3), { wash: tn('#D9CFBC'), fill: tn('#C9BCA6'), fillOp: 90, bleed: .05, tex: .7, border: .5, ink: null });
  for (let r = 1; r <= 5; r++) { boilSeed('pr' + r); paint(ellPts(960, 900, 170 * r, 46 * r, 40, 2), { ink: tn('#B3A88F'), sw: .8 }); }
  // bệ đá + tảng đá
  boilSeed('ped'); paint([[800, 900], [1120, 900], [1100, 830], [820, 830]], { wash: tn('#B8AE9C'), ink: PAL.ink, sw: 1.2 });
  const sp = stoneShape(1, 2).map(([x, y]) => [960 + (x - STONE.x) * 1.15, 790 + (y - STONE.y) * 1.15]);
  boilSeed('pStone'); paint(sp, { wash: tn('#B9B2A2'), fill: tn('#8F877A'), fillOp: 130, bleed: .08, tex: .8, border: .5, hatch: { d: 9, a: .5, o: { rand: .35, gradient: .4 }, b: 'charcoal', c: tn('#6E675C'), w: .7 }, ink: PAL.ink, sw: 1.5, curv: .5 });
  boilSeed('pHi'); inkLine([[850, 740], [930, 710], [1030, 725]], 6, '#F4EEDF', 'dry', .6);
  glow(1000, 730, 120 + 60 * pulse(t, 3), '#FFE6A8', .8);
  boilSeed('pFleck'); paint(starPts(1000, 730, 20, .25, 4, t * .4), { wash: '#FFF8E6', ink: null });
  if (s.cloth > 0) {
    // vải phủ: kéo lên và bay đi theo s.cloth (1 phủ → 0 bay mất)
    const k = 1 - s.cloth, off = easeIn(k) * 900;
    boilSeed('cloth'); paint([[780 + off * .2, 900 - off], [1140 + off * .6, 900 - off * 1.1], [1120 + off * .5, 620 - off * 1.3], [960 + off * .4, 560 - off * 1.4], [800 + off * .2, 620 - off * 1.2]], { wash: '#C0392B', fill: '#9A2E24', fillOp: 120, bleed: .1, tex: .6, border: .3, ink: PAL.ink, sw: 1.2, curv: .5 });
  }
}
