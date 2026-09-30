// hb001.js: "Câu chuyện tảng đá" — "Hai tác phẩm của thời gian" (STORYBOARD.md bản 3, 53 cảnh).
// Thời gian = thời gian bài. Máy quay dùng thời gian thật (mượt), nhân vật dùng t đã giữ hình (koma-uchi).
(() => {
  const U = 25;
  const R = (t, lt) => TREAL - t + lt;                        // thời gian thật trong cảnh (cho máy quay)
  const cam = (cx, cy, z) => camBegin(cx, cy, z);
  const walkP = (t, sp = 6) => t * sp;
  const tam = (age, o = {}) => ({ body: age === 'child' ? 'child' : age === 'teen' ? 'teen' : age === 'old' ? 'old' : 'adult', pal: TAM[age === 'teen' ? 'young' : age], outfit: 'shirt', hair: 'short', key: 'tam', ...o });
  const split = (key, col) => { boilSeed(key); paint(rectPts(960, -60, 1100, 1200, 2), { wash: col, ink: null }); };
  const splitLine = () => inkLine([[960, -60], [960, 1140]], 3, PAL.ink, 'ink', 0);

  // ================================================================ cận cực: bàn tay đặt lên mặt đá (cảnh 1 & 51)
  function handOnStone(t, lt, dur, old = true) {
    cam(960, 540, lerp(1.0, 1.06, seg(R(t, lt), 0, dur)));
    bg('#E8DFC8', 'hsBg'); glow(1500, 200, 700, '#FFE9C0', .8);
    boilSeed('hsStone'); paint([[-100, 1200], [-100, 380], [400, 260], [900, 220], [1500, 250], [2100, 340], [2100, 1200]], { wash: '#B9B2A2', fill: '#9A9284', fillOp: 140, bleed: .08, tex: .8, border: .5, hatch: { d: 14, a: .5, o: { rand: .35, gradient: .4 }, b: 'charcoal', c: '#7A7266', w: .8 }, ink: PAL.ink, sw: 2, curv: .5 });
    boilSeed('hsCrack'); inkLine([[300, 520], [420, 600], [470, 760], [560, 900]], 2, '#6E675C', 'ink', .5);
    const f = ease(seg(lt, .3, .8)); glow(1180, 560, 80 + 300 * f, '#FFE6A8', f); boilSeed('hsFleck'); paint(starPts(1180, 560, 14 + 40 * f, .22, 4, t * .5), { wash: '#FFF8E6', ink: null });
    const k = ease(seg(lt, 0, .5)), s = old ? 1 : .6, hx = lerp(1700, 1250, k), hy = lerp(900, 600, k);
    const skin = old ? '#C3906C' : '#F2C9A5', skinDk = mixCol(skin, '#7A4E36', .25);
    boilSeed('hsArm'); paint(ribbon([[hx + 900 * s, hy + 420 * s], [hx + 420 * s, hy + 150 * s], [hx + 90 * s, hy + 20 * s]], 190 * s, 150 * s), { wash: old ? '#5E7488' : '#D9622B', ink: PAL.ink, sw: 1.4 });
    boilSeed('hsCuff'); paint(ellPts(hx + 110 * s, hy + 30 * s, 40 * s, 80 * s, 14, 2, .35), { wash: old ? '#4A5E70' : '#A8471C', ink: PAL.ink, sw: 1 });
    // mu bàn tay úp xuống, ngón tay duỗi về trái, ôm theo mặt đá
    boilSeed('hsBack'); paint([[hx + 90 * s, hy - 50 * s], [hx - 60 * s, hy - 70 * s], [hx - 150 * s, hy - 40 * s], [hx - 160 * s, hy + 40 * s], [hx - 40 * s, hy + 70 * s], [hx + 100 * s, hy + 60 * s]], { wash: skin, ink: PAL.ink, sw: 1.3, curv: .5 });
    for (let i = 0; i < 4; i++) {
      const fy = hy - 50 * s + i * 30 * s, len = (i === 0 || i === 3 ? 150 : 185) * s;
      boilSeed('hsF' + i); paint(ribbon([[hx - 140 * s, fy], [hx - 140 * s - len * .55, fy + 6 * s], [hx - 140 * s - len, fy + 14 * s]], 34 * s, 26 * s), { wash: skin, ink: PAL.ink, sw: 1.1 });
      if (old) { boilSeed('hsK' + i); inkLine([[hx - 150 * s - len * .5, fy - 8 * s], [hx - 150 * s - len * .5, fy + 10 * s]], .8, skinDk, 'inkfine', .3); }
    }
    boilSeed('hsThumb'); paint(ribbon([[hx - 40 * s, hy + 60 * s], [hx - 110 * s, hy + 100 * s], [hx - 170 * s, hy + 110 * s]], 40 * s, 30 * s), { wash: skin, ink: PAL.ink, sw: 1.1 });
    if (old) for (let i = 0; i < 6; i++) { boilSeed('hsW' + i); inkLine([[hx - 20 + i * 18, hy - 40], [hx - 10 + i * 18, hy + 40]], .7, skinDk, 'inkfine', .6); }
    camEnd();
  }
  function closeWater(t, lt, dur) {
    cam(960, 540, 1); bg('#4E8FA8', 'cwBg');
    boilSeed('cwStone'); paint([[-100, 1200], [-100, 500], [500, 430], [1000, 460], [1300, 560], [1500, 1200]], { wash: '#8C8579', hatch: { d: 12, a: .5, o: { rand: .35 }, b: 'charcoal', c: '#4E4A42', w: .8 }, ink: PAL.ink, sw: 2, curv: lerp(.05, .6, seg(lt, 0, dur)) });
    for (let i = 0; i < 16; i++) { boilSeed('cw' + i); const y = 380 + (i * 41) % 400, x = ((i * 190 + t * 900) % 2400) - 300; paint(ribbon([[x, y], [x + 120, y + 20 + 30 * Math.sin(i)], [x + 260, y + 10]], 14, 4), { wash: '#DDEFF4', washOp: 220, ink: null }); }
    camEnd();
  }
  function closeShoulder(t, lt, dur) {
    cam(960, 540, 1); bg('#E6D6B8', 'shBg');
    boilSeed('shBody'); paint([[500, 1200], [560, 560], [900, 430], [1300, 470], [1500, 1200]], { wash: '#4F6D8C', ink: PAL.ink, sw: 2, curv: .5 });
    boilSeed('shNeck'); paint([[860, 440], [880, 200], [1080, 200], [1100, 450]], { wash: '#C99A74', ink: PAL.ink, sw: 1.6, curv: .5 });
    const press = 10 * pulse(t, 4);
    boilSeed('shPole'); paint(ribbon([[-100, 470 + press], [960, 440 + press], [2100, 470 + press]], 60, 60), { wash: '#7A5634', ink: PAL.ink, sw: 1.6 });
    boilSeed('sweat'); paint(ellPts(1060, 260 + 200 * frac(t * .8), 10, 16, 8), { wash: '#BFE2F4', ink: PAL.ink, sw: .7 });
    camEnd();
  }

  // ================================================================ 0–16 s: mở đầu, sáng thế ↔ chào đời
  function s1(t, lt, dur) { handOnStone(t, lt, dur, true); if (lt > dur - .1) flash(1, '#1A1420'); }
  function s2(t, lt, dur) { cam(960, 540, lerp(1.25, 1.0, easeOut(seg(R(t, lt), 0, dur)))); genesis(t, { k: 0, view: 'wide' }); camEnd(); if (lt < .25) flash(1 - lt / .25, '#1A1420'); }
  function s3(t, lt, dur) { const r = seg(R(t, lt), 0, dur); cam(lerp(900, 960, r), lerp(380, 620, r), 1.1); genesis(t, { k: .15, view: 'wide' }); camEnd(); }
  function s4(t, lt, dur) { cam(960, 600, lerp(1.0, 1.15, seg(R(t, lt), 0, dur))); genesis(t, { k: seg(lt, 0, dur), view: 'close' }); camEnd(); }
  function s5(t, lt, dur) { cam(lerp(920, 960, seg(R(t, lt), 0, dur)), 700, lerp(1.9, 1.7, seg(R(t, lt), 0, dur))); hutNight(t, {}); camEnd(); }
  function s6(t, lt, dur) {
    const k = seg(lt, .3, dur - .4), s = { era: 0, season: 1, rain: .8, erode: 0, flood: .4 };
    cam(lerp(700, 1150, seg(R(t, lt), 0, dur)), 600, 1.0);
    bank(t, s);
    const p = arcPt([400, 250], [STONE.x, STONE.y], 120, ease(k));
    push(); translate(p[0] - STONE.x, p[1] - STONE.y); drawStone(t, { ...s, erode: 0 }); pop();
    weather(t, s); camEnd();
  }
  function s7(t, lt, dur) {
    cam(960, 540, 1); riverSection(t, { erode: .1, fleck: .1 }); camEnd();
    split('split7', '#BFE0EE');
    cam(960, 540, 1);
    boilSeed('rRiv'); paint(rectPts(962, 540, 1000, 240, 3), { wash: '#78AEB6', ink: null });
    boilSeed('rBank'); paint(rectPts(962, 770, 1000, 400, 3), { wash: '#9CC47A', ink: null });
    const walk = seg(lt, 0, 2.2);
    person(lerp(1150, 1450, walk), 920, 30, tam('child', { walk: walk < 1 ? walkP(t, 5) : null, crouch: ease(seg(lt, 2.4, 2.9)), reach: ease(seg(lt, 2.8, 3.3)), reachTo: [1560, 920], eyes: lt > 3.3 ? 'happy' : 'dot', smile: 1 }));
    boilSeed('pebble'); paint(ellPts(1560, 918, 12, 8, 8), { wash: '#9A9284', ink: PAL.ink, sw: .8 });
    splitLine(); camEnd();
  }

  // ================================================================ verse 16.6–45.7: mài mòn song song
  function vVillage(t, lt, dur, who) {
    const s = { era: .9, season: kf(t, [[16.6, 1], [31, 2.2]]), erode: .5 };
    cam(lerp(1000, 1060, seg(R(t, lt), 0, dur)), 640, 1.35);
    bank(t, s); drawStone(t, s); who(t, lt, s); weather(t, s); camEnd();
  }
  function s8(t, lt, dur) {
    vVillage(t, lt, dur, (t) => {
      for (let i = 0; i < 3; i++) person(1450 + i * 110 + 30 * Math.sin(t * 4 + i), GROUND + 20, U, { body: 'child', pal: VILLAGERS[i + 1], outfit: 'shirt', hair: 'short', walk: walkP(t, 8) + i, eyes: 'happy', smile: 1, key: 'kid' + i });
      person(820, GROUND + 20, U, tam('child', { crouch: 1, eyes: 'sad', smile: -.3, lookUp: .2 }));
    });
  }
  function s9(t, lt, dur) { cam(960, 540, lerp(1.0, 1.1, seg(R(t, lt), 0, dur))); mapView(t, { age: seg(lt, 0, dur), season: 1 + seg(lt, 0, dur) * 8, fleck: .2 }); camEnd(); }
  function s10(t, lt, dur) {
    vVillage(t, lt, dur, (t, lt) => {
      person(980, GROUND, U, { body: 'adult', pal: VILLAGERS[0], outfit: 'shirt', hair: 'short', crouch: .8, armN: [1.8 + .3 * Math.sin(t * 3), .4], eyes: 'dot', smile: .6, key: 'father' });
      person(860, GROUND + 15, U, tam('child', { crouch: 1, lookUp: .3, eyes: 'wide', smile: .6 }));
      for (let i = 0; i < 6; i++) { boilSeed('row' + i); paint(ellPts(700 + i * 26, GROUND + 22, 9, 6, 8), { wash: '#9A9284', ink: PAL.ink, sw: .6 }); }
      if (lt > 1) glow(1060, 780, 60, '#FFE6A8', .7 * seg(lt, 1, 2));
    });
  }
  function s13(t, lt, dur) {
    const s = { era: 1, season: 2, rain: .8, flood: kf(lt, [[0, .3], [1.2, .95]]), erode: .7, night: .3 };
    cam(1000, 600, 1.1); bank(t, s);
    const sink = seg(lt, .5, 2.2);
    boilSeed('hutSink'); paint([[500, EDGE - 100 + sink * 200], [700, EDGE - 190 + sink * 200], [900, EDGE - 100 + sink * 200], [880, EDGE + sink * 200], [520, EDGE + sink * 200]], { wash: tone('#A08A4E', s), ink: PAL.ink, sw: 1 });
    boilSeed('roof'); paint(rectPts(1350, GROUND - 170, 220, 30, 3), { wash: tone('#A08A4E', s), ink: PAL.ink, sw: 1 });
    person(1450, GROUND - 170, U, tam('teen', { eyes: 'sad', smile: -.6, lookUp: -.1 }));
    weather(t, s); camEnd();
  }
  function s14(t, lt, dur) {
    cam(960, 540, 1); riverSection(t, { erode: 1, fleck: .15 }); camEnd();
    split('split14', '#BFE0EE');
    cam(960, 540, 1);
    boilSeed('r14'); paint(rectPts(962, 760, 1000, 400, 3), { wash: '#B89A6E', ink: null });
    const up = ease(seg(lt, 0, dur * .8));
    boilSeed('newHut'); paint(rectPts(1300, 760 - 160 * up, 300, 160 * up + 2, 2), { wash: '#C9A77E', ink: PAL.ink, sw: 1 });
    if (up > .9) paint([[1280, 610], [1450, 520], [1620, 610]], { wash: '#A08A4E', ink: PAL.ink, sw: 1 });
    person(1180, 900, 30, tam('young', { armN: [2.6, .2 + .4 * pulse(t, 4)], eyes: 'dot', smile: .4 }));
    splitLine(); camEnd();
  }
  function s15(t, lt, dur) {
    const s = { era: 1, season: 3, night: .9, erode: 1, fleck: .15 };
    cam(1080, 700, lerp(1.35, 1.5, seg(R(t, lt), 0, dur))); bank(t, s); drawStone(t, s);
    person(STONE.x - 200, GROUND, U, tam('young', { crouch: 1, eyes: 'dot', smile: -.2, lookUp: .3 }));
    weather(t, s); camEnd();
  }

  // ================================================================ pre 45.7–63.4: không ai dừng lại; buông gậy
  function stonePOV(t, lt, dur, o = {}) {
    cam(960, 540, 1);
    bg('#A9D4EC', 'povSky');
    boilSeed('povCloud'); paint(ellPts(700 + t * 10, 250, 420, 90, 18, 12), { fill: '#F6F2EA', fillOp: 180, bleed: .3, tex: .4, border: .2, ink: null });
    for (let i = 0; i < 30; i++) { boilSeed('pg' + i); const x = i * 70 - 40, h = 120 + 90 * hash(i); paint([[x - 18, 1100], [x + 10 * Math.sin(t * 2 + i), 1100 - h], [x + 18, 1100]], { wash: i % 2 ? '#5E8A48' : '#7FAE5C', ink: null }); }
    for (let i = 0; i < 3; i++) {
      const k = seg(lt, i * 1.1, i * 1.1 + 1.6); if (k <= 0 || k >= 1) continue;
      const x = lerp(-300, 2200, k), step = Math.sin(k * 18) * 90;
      boilSeed('leg' + i); paint(ribbon([[x + step, 1150], [x + step * .5, 700], [x, -100]], 150, 120), { wash: VILLAGERS[i].pants, ink: PAL.ink, sw: 1.6 });
      paint(ellPts(x + step + 40, 1120, 140, 50, 14), { wash: '#C99A74', ink: PAL.ink, sw: 1.4 });
    }
    const f = o.fleck || 0; if (f > 0) glow(960, 1060, 200 * f, '#FFE6A8', f);
    camEnd();
  }
  function s16(t, lt, dur) { stonePOV(t, lt, dur, { fleck: .6 * Math.max(0, Math.sin(lt * 2.4)) }); }
  function s17(t, lt, dur) {
    const s = { era: 1.2, season: 1, erode: 1, flood: .15 };
    cam(1000, 660, 1.3); bank(t, s);
    if (lt < 2.2) person(lerp(700, 1200, seg(lt, 0, 2.2)), GROUND - 10, U, tam('young', { walk: walkP(t, 4), eyes: 'dot', smile: -.2, lookUp: -.3 }));
    else {
      boilSeed('wallC'); paint(rectPts(1300, 300, 400, 600, 3), { wash: '#C9A77E', ink: PAL.ink, sw: 1.2 });
      boilSeed('stick'); inkLine([[1390, GROUND], [1420, 520]], 5, '#6B4A2E', 'ink', 0);
      person(1180, GROUND, U, tam('young', { flip: true, eyes: 'closed', smile: -.4 }));
    }
    weather(t, s); camEnd();
  }
  function s18(t, lt, dur) {
    cam(960, 540, 1); riverSection(t, { erode: 1, silt: seg(lt, 0, dur) * .8, fleck: .08 }); camEnd();
    split('split18', '#6E5A44');
    cam(960, 540, 1);
    boilSeed('stick18'); inkLine([[1350, 1000], [1420, 200]], 12, '#6B4A2E', 'ink', 0);
    for (let i = 0; i < Math.round(40 * seg(lt, 0, dur)); i++) { boilSeed('dust' + i); paint(ellPts(1350 + hash(i) * 70, 200 + hash(i * 5) * 800, 3, 3, 6), { wash: '#C9BCA6', ink: null }); }
    splitLine(); camEnd();
  }
  function s19(t, lt, dur) {
    const s = { era: 1.2, season: 3, night: .95, erode: 1 };
    cam(lerp(1050, 1000, seg(R(t, lt), 0, dur)), 660, 1.4); bank(t, s);
    person(1050, GROUND, U, tam('young', { crouch: 1, eyes: 'closed', smile: -.5, lookUp: -.5 }));
    weather(t, s); camEnd();
  }

  // ================================================================ chorus 1 63.4–95.1: Ánh sáng dẫn lối
  function s20(t, lt, dur) { cam(1000, 600, lerp(1.25, 1.45, seg(R(t, lt), 0, dur))); riverSection(t, { erode: 1, silt: .8, fleck: .25 + .2 * Math.sin(lt * 3), night: .8 }); camEnd(); }
  function nightBank(t, lt, dur, fn, camv) {
    const s = { era: 1.2, season: 3.2, night: .9, erode: 1, lamp: 0 };
    cam(...camv(R(t, lt))); bank(t, s); fn(t, lt, s); weather(t, s); camEnd();
  }
  function s21(t, lt, dur) {
    nightBank(t, lt, dur, (t, lt) => {
      person(1000, GROUND, U, tam('young', { crouch: 1, eyes: lt > .8 ? 'wide' : 'closed', smile: 0, lookUp: lt > .8 ? .3 : -.5 }));
      lightOrb(1250, lerp(700, 640, ease(seg(lt, 0, 1.5))), ease(seg(lt, 0, 1.2)), t);
    }, r => [1100, 680, 1.5]);
  }
  function s22(t, lt, dur) {
    cam(960, 540, 1); bg('#141A30', 'lowBg');
    for (let i = 0; i < 50; i++) { boilSeed('st22' + i); paint(starPts(hash(i) * W, hash(i * 3) * 600, 4, .4, 4), { wash: '#F4EEDC', ink: null }); }
    person(900, 1250, 70, tam('young', { lookUp: .8, eyes: 'wide', smile: .2 + .5 * seg(lt, 1, 2.5), key: 'tamBig' }));
    lightOrb(1250, 420 + 20 * Math.sin(t * 2), 1.3, t);
    camEnd();
  }
  function s23(t, lt, dur) {
    nightBank(t, lt, dur, (t, lt) => {
      const ox = lerp(1250, 1700, ease(seg(lt, 0, dur))), px = lerp(1000, 1450, ease(seg(lt, .4, dur)));
      lightOrb(ox, 640 + 30 * Math.sin(t * 2), 1, t);
      person(px, GROUND, U, tam('young', { walk: lt > .4 ? walkP(t, 5) : null, crouch: 1 - ease(seg(lt, 0, .4)), eyes: 'dot', smile: .3, lookUp: .2 }));
    }, r => [lerp(1100, 1500, seg(r, 0, 4)), 660, 1.3]);
  }
  function s24(t, lt, dur) {
    nightBank(t, lt, dur, (t, lt, s) => {
      dock(t, s); boat(DOCK.x - 20, DOCK.y + 40, t, s, 'oldBoat', 0);
      const k = ease(seg(lt, 0, dur));
      lightOrb(lerp(1400, DOCK.x + 175, k), lerp(600, DOCK.y - 190, k), 1, t);
      person(lerp(1600, DOCK.x + 330, k), GROUND - 20, U, tam('young', { walk: k < 1 ? walkP(t, 5) : null, flip: true, eyes: 'dot', smile: .3 }));
    }, r => [lerp(1100, 700, seg(r, 0, 3.5)), 640, 1.1]);
  }
  function s25(t, lt, dur) {
    const lit = ease(seg(lt, 2.2, 3.2)), r = R(t, lt);
    const s = { era: 1.2, season: 3.4, night: .9 - .2 * lit, erode: 1, lamp: lit };
    cam(lerp(DOCK.x + 175, DOCK.x + 60, seg(r, 2, dur)), lerp(DOCK.y - 180, DOCK.y - 120, seg(r, 2, dur)), lerp(3.0, 1.6, ease(seg(r, 2, dur))));
    bank(t, s); dock(t, s); boat(DOCK.x - 20, DOCK.y + 40, t, s, 'oldBoat', 0);
    lightOrb(DOCK.x + 175, DOCK.y - 190, 1 - lit, t);
    person(DOCK.x + 330, GROUND - 20, U, tam('young', { flip: true, reach: seg(lt, 1.2, 2.2), reachTo: [DOCK.x + 190, DOCK.y - 190], eyes: lit > .5 ? 'happy' : 'wide', smile: lit }));
    weather(t, s); camEnd();
  }
  function s26(t, lt, dur) {
    const s = { era: 1.3, season: 4.1, dusk: .3, erode: 1, lamp: 1 };
    cam(lerp(700, 1000, seg(R(t, lt), 0, dur)), 600, 1.1); bank(t, s); dock(t, s);
    const k = ease(seg(lt, 1, dur)), bx = lerp(DOCK.x - 20, 1500, k), by = boat(bx, lerp(DOCK.y + 40, 610, k), t, s, 'ferry', 1);
    person(bx - 90, by - 8, U, tam('young', { hat: 'non', armN: [1.2, .6], eyes: 'happy', smile: .8 }));
    boilSeed('oar26'); inkLine([[bx - 70, by - 90], [bx - 150, by + 40]], 4, '#6B4A2E', 'ink', 0);
    for (let i = 0; i < 3; i++) person(1650 + i * 70, 560, 14, { body: 'adult', pal: VILLAGERS[i + 2], outfit: 'shirt', hair: 'short', armN: i === 1 ? [2.8 + .3 * Math.sin(t * 10), .1] : undefined, eyes: 'happy', smile: 1, key: 'far' + i });
    weather(t, s); camEnd();
  }

  // ================================================================ nhạc dạo 95.1–125.6: một đời đưa đò
  function ferryRide(t, lt, dur, o) {
    const s = { era: 1.4 + (o.era || 0), season: o.season, night: o.night || 0, rain: o.rain || 0, dusk: o.dusk || 0, erode: 1 };
    cam(lerp(900, 1100, seg(R(t, lt), 0, dur)), 640, 1.25); bank(t, s);
    const bx = lerp(600, 1400, seg(lt, 0, dur)), by = boat(bx, 660, t, s, 'ride', o.night ? 1 : 0);
    person(bx - 120, by - 8, U, tam(o.age || 'young', { hat: 'non', armN: [1.2 + .3 * Math.sin(t * 3), .6], eyes: 'dot', smile: .6 }));
    boilSeed('oarR'); inkLine([[bx - 100, by - 90], [bx - 190 + 30 * Math.sin(t * 3), by + 40]], 4, '#6B4A2E', 'ink', 0);
    o.pass(t, lt, bx, by, s);
    weather(t, s); camEnd();
  }
  function s27(t, lt, dur) { ferryRide(t, lt, dur, { season: 4.2, pass: (t, lt, bx, by) => { for (let i = 0; i < 2; i++) person(bx + 20 + i * 70, by - 8, U, { body: 'child', pal: VILLAGERS[i + 2], outfit: 'shirt', hair: i ? 'pony' : 'short', hold: 'bag', eyes: 'happy', smile: 1, key: 'sch' + i }); } }); }
  function s28(t, lt, dur) { ferryRide(t, lt, dur, { season: 5.5, night: .85, rain: .7, pass: (t, lt, bx, by) => { person(bx + 60, by - 8, U, { body: 'adult', pal: VILLAGERS[1], outfit: 'shirt', hair: 'short', crouch: .6, armN: [1.5, 1.2], eyes: 'dot', smile: -.2, key: 'carer' }); boilSeed('sick'); paint(ellPts(bx + 110, by - 40, 60, 22, 12), { wash: '#EFE6D6', ink: PAL.ink, sw: .8 }); } }); }
  function s29(t, lt, dur) { ferryRide(t, lt, dur, { season: 6.2, dusk: .2, era: .2, pass: (t, lt, bx, by) => { person(bx + 40, by - 8, U, { body: 'adult', pal: { ...VILLAGERS[1], coat: '#C0392B' }, outfit: 'dress', hat: 'non', eyes: 'happy', smile: 1, key: 'bride' }); person(bx + 120, by - 8, U, { body: 'adult', pal: VILLAGERS[2], outfit: 'dress', hair: 'short', eyes: 'happy', smile: 1, key: 'groom' }); for (let i = 0; i < 8; i++) { boilSeed('conf' + i); paint(ellPts(bx + hash(i) * 300 - 100, by - 300 + ((hash(i * 3) * 300 + t * 120) % 300), 7, 4, 6, 0, t + i), { wash: i % 2 ? '#F4B0C4' : '#C0392B', ink: null }); } } }); }
  function s30(t, lt, dur) {
    const age = seg(lt, 0, dur), skin = mixCol('#C99A74', '#B98A66', age);
    cam(960, 540, 1); bg('#5E8FA8', 'oarBg');
    for (let i = 0; i < 10; i++) { boilSeed('ow' + i); const y = 700 + (i * 37) % 300, x = ((i * 233 + t * 200) % 2300) - 200; inkLine([[x, y], [x + 100, y - 8], [x + 200, y]], 2, '#DDEFF4', 'ink', .5); }
    const sw = 60 * Math.sin(t * 3);
    boilSeed('oar30'); paint(ribbon([[400 + sw, -100], [1000 + sw * .5, 600], [1300, 1200]], 40, 60), { wash: '#7A5634', ink: PAL.ink, sw: 1.6 });
    for (let h = 0; h < 2; h++) {
      const hx = 760 + h * 220 + sw * .6, hy = 300 + h * 170;
      boilSeed('sleeve' + h); paint(ribbon([[hx + 100, hy + 60], [hx + 400, hy + 300], [hx + 700, hy + 500]], 150, 190), { wash: '#4F6D8C', ink: PAL.ink, sw: 1.4 });
      boilSeed('oh' + h); paint(ellPts(hx, hy, 110, 80, 18, 3, .6), { wash: skin, ink: PAL.ink, sw: 1.4 });
      for (let i = 0; i < 4; i++) { boilSeed('of' + h + i); paint(ribbon([[hx - 60 + i * 38, hy - 30], [hx - 50 + i * 40, hy + 60], [hx - 30 + i * 40, hy + 80]], 32, 26), { wash: skin, ink: PAL.ink, sw: 1.1 }); }
      for (let i = 0; i < Math.round(8 * age); i++) { boilSeed('wr' + h + i); inkLine([[hx - 70 + i * 18, hy - 20], [hx - 60 + i * 18, hy + 20]], .8, '#7A4E36', 'inkfine', .5); }
    }
    camEnd();
  }
  function s31(t, lt, dur) { cam(960, 540, 1.05); mapView(t, { age: 1, season: 7 + seg(lt, 0, dur) * 6, ferry: 1, fleck: .15 }); camEnd(); }
  function s32(t, lt, dur) { ferryRide(t, lt, dur, { season: 13.2, age: 'mid', era: .4, pass: (t, lt, bx, by) => { person(bx + 50, by - 8, U, { body: 'adult', pal: VILLAGERS[3], outfit: 'shirt', hair: 'short', eyes: 'happy', smile: .8, key: 'grownKid' }); person(bx + 120, by - 8, U, { body: 'child', pal: VILLAGERS[4], outfit: 'shirt', hair: 'pony', eyes: 'happy', smile: 1, key: 'hisKid' }); } }); }

  // ================================================================ pre 2 125.6–142.7: cây cầu, bến vắng
  function s33(t, lt, dur) { const s = { era: 2, season: 14, erode: 1 }; cam(960, 560, 1.0); bank(t, s); bridge(t, s, seg(lt, 0, dur * .9)); dock(t, s); weather(t, s); camEnd(); }
  function s34(t, lt, dur) {
    const s = { era: 2.1, season: 14.5, erode: 1, dusk: .4 };
    cam(700, 640, 1.25); bank(t, s); bridge(t, s, 1); dock(t, s); boat(DOCK.x - 20, DOCK.y + 40, t, s, 'idle', 0);
    for (let i = 0; i < 6; i++) { const k = frac(t * .15 + i / 6); person(lerp(-200, 2100, k), EDGE - 250, 14, { body: 'adult', pal: VILLAGERS[i % 6], outfit: 'shirt', hair: 'short', walk: walkP(t, 7) + i, key: 'bw' + i }); }
    person(DOCK.x + 80, DOCK.y, U, tam('old', { crouch: 1, hat: 'non', eyes: 'dot', smile: -.2, lookUp: .4 }));
    weather(t, s); camEnd();
  }
  function s35(t, lt, dur) {
    const s = { era: 2.1, season: 15, erode: 1, dusk: .6, lamp: 1 - ease(seg(lt, 1.5, 3.5)) };
    cam(DOCK.x + 100, DOCK.y - 60, 2.4); bank(t, s); dock(t, s); boat(DOCK.x - 20, DOCK.y + 40, t, s, 'rot', 0);
    boilSeed('rotHole'); paint(ellPts(DOCK.x + 40, DOCK.y + 30, 40, 12, 10), { wash: '#3A2C24', ink: null });
    weather(t, s); camEnd();
  }
  function s36(t, lt, dur) {
    const s = { era: 2.2, season: 15.4, erode: 1, dusk: kf(lt, [[0, .8], [3, .3]]), night: kf(lt, [[1.5, 0], [4.4, .85]]), rain: kf(lt, [[2.5, 0], [4.4, .6]]) };
    cam(900, 620, lerp(1.2, 1.35, seg(R(t, lt), 0, dur))); bank(t, s); bridge(t, s, 1); dock(t, s); boat(DOCK.x - 20, DOCK.y + 40, t, s, 'rot', 0);
    person(DOCK.x + 80, DOCK.y, U, tam('old', { crouch: 1, hat: 'non', eyes: 'closed', smile: -.4, lookUp: -.4 }));
    weather(t, s); camEnd();
  }

  // ================================================================ rap 142.7–171.2: tiếng gọi, được tìm thấy, tác phẩm
  function s37(t, lt, dur) {
    if (lt < 1.9) { cam(1000, 600, 1.35); riverSection(t, { erode: 1, silt: .8, fleck: .3, night: .9 }); camEnd(); }
    else { const s = { era: 2.2, season: 15.6, night: .9, rain: .7, erode: 1 }; cam(DOCK.x + 110, DOCK.y - 110, 2.2); bank(t, s); dock(t, s); person(DOCK.x + 80, DOCK.y, U, tam('old', { crouch: 1, hat: 'non', eyes: 'closed', smile: -.3, lookUp: .1 })); weather(t, s); camEnd(); }
  }
  function s38(t, lt, dur) {
    const i = Math.floor(lt / .48) % 7;                       // mảnh ký ức: mỗi phách một hình
    if (i === 0) closeWater(t, lt, dur);
    else if (i === 1) closeShoulder(t, lt, dur);
    else if (i === 2) { cam(960, 540, 1); genesis(t, { k: .2, view: 'close' }); camEnd(); }
    else if (i === 3) { const s = { era: 1, season: 2, rain: .8, flood: .9, night: .4 }; cam(1000, 600, 1.1); bank(t, s); weather(t, s); camEnd(); }
    else if (i === 4) { const s = { era: 1.3, season: 4, night: .9, lamp: 1 }; cam(DOCK.x + 175, DOCK.y - 190, 2.8); bank(t, s); dock(t, s); camEnd(); }
    else if (i === 5) { const s = { era: 2, season: 14 }; cam(960, 500, 1.2); bank(t, s); bridge(t, s, 1); camEnd(); }
    else handOnStone(t, .6, 1, true);
    flash(.25 * Math.exp(-frac(lt / .48) * 8), '#FFF8E8');
  }
  function s39(t, lt, dur) {
    cam(960, 540, 1); riverSection(t, { erode: 1, silt: .8, fleck: .2, night: .9 }); camEnd();
    split('split39', '#1E2540');
    cam(960, 540, 1);
    for (let i = 0; i < 40; i++) { boilSeed('r39' + i); const x = 980 + hash(i) * 940, y = (hash(i * 3) * 1200 + t * 1300) % 1200 - 60; inkLine([[x, y], [x - 8, y + 36]], .8, '#9FAAD8', 'inkfine', 0); }
    person(1450, 960, 34, tam('old', { hat: 'non', crouch: 1, eyes: 'closed', smile: -.4, lookUp: -.2, key: 'tamR' }));
    splitLine(); camEnd();
  }
  function s40(t, lt, dur) {
    const s = { era: 2.2, season: 15.8, night: .9, rain: .3, erode: 1 };
    cam(lerp(DOCK.x + 200, 1100, seg(R(t, lt), 0, dur)), 680, 1.3); bank(t, s); dock(t, s);
    const k = ease(seg(lt, 0, dur));
    drawStone(t, { ...s, fleck: .3 + .5 * k, dust: .8 });
    lightOrb(lerp(DOCK.x + 250, STONE.x, k), lerp(DOCK.y - 200, STONE.y - 40, k), 1, t);
    person(lerp(DOCK.x + 80, DOCK.x + 380, k), GROUND, U, tam('old', { hat: 'non', walk: walkP(t, 4), eyes: 'wide', smile: .2, lookUp: .3 }));
    weather(t, s); camEnd();
  }
  function s41(t, lt, dur) {
    const s = { era: 2.2, season: 16, night: .85, erode: 1, dust: .8 * (1 - seg(lt, .4, 1.4)), fleck: kf(lt, [[0, .6], [.8, 1.3], [2, .9]]) };
    cam(STONE.x - 60, STONE.y - 20, lerp(2.2, 1.9, seg(R(t, lt), 0, dur))); bank(t, s); drawStone(t, s);
    person(STONE.x - 220, GROUND, U, tam('old', { hat: 'non', crouch: 1, reach: 1, reachTo: [STONE.x - 60 + 20 * Math.sin(t * 14), STONE.y - 20], eyes: lt > 1 ? 'closed' : 'wide', smile: lt > 1 ? .8 : .1 }));
    weather(t, s); camEnd();
  }
  function s42(t, lt, dur) {
    const s = { era: 2.2, season: 16.1, night: .6 * (1 - seg(lt, 0, 1.5)), dusk: .4 * seg(lt, 0, 1.5), erode: 1, fleck: .7, polish: .6 };
    cam(STONE.x - 100, STONE.y + 10, 1.8); bank(t, s); drawStone(t, s);
    person(STONE.x - 230, GROUND, U, tam('old', { crouch: 1, hat: 'non', reach: 1, reachTo: [STONE.x - 40, STONE.y - 50 + 30 * Math.sin(t * 4)], eyes: 'happy', smile: 1 }));
    for (let i = 0; i < 6; i++) { boilSeed('pour' + i); const y = STONE.y - 80 + ((hash(i) * 120 + t * 300) % 140); paint(ellPts(STONE.x - 60 + hash(i * 3) * 80, y, 5, 9, 6), { wash: '#CFE8F2', ink: null }); }
    camEnd();
  }
  function s43(t, lt, dur) {
    const cl = 1 - ease(seg(lt, .2, 1.2)), r = R(t, lt);
    cam(960, lerp(700, 560, ease(seg(r, 0, dur))), lerp(1.35, .95, ease(seg(r, 0, dur)))); plaza(t, { cloth: cl });
    for (let i = 0; i < 10; i++) person(300 + i * 150 + (i > 4 ? 300 : 0), 1000 + (i % 2) * 30, 26, { body: i % 4 === 3 ? 'child' : 'adult', pal: VILLAGERS[i % 6], outfit: i % 3 ? 'shirt' : 'dress', hair: i % 2 ? 'short' : 'bun', flip: i > 4, lookUp: .3, eyes: cl < .5 ? 'wide' : 'dot', smile: cl < .5 ? .8 : .2, key: 'crowd' + i });
    camEnd();
  }
  function s44(t, lt, dur) {
    cam(960, 540, 1); bg('#9CCBE8', 'p44');
    for (let L = 0; L < 2; L++) { boilSeed('m44' + L); const m = [[-200, 1000]]; for (let i = 0; i <= 12; i++) m.push([-200 + i * 200, 620 - L * 60 - 260 * hash(i * 2 + L)]); m.push([2200, 1000]); paint(m, { wash: L ? '#7E9A96' : '#A9BCC4', ink: '#4E6A62', sw: .8, curv: .4 }); }
    for (let i = 0; i < 5; i++) { const x = 250 + i * 360, k = ease(seg(lt, i * .15, .8 + i * .15)); person(x, 1300 - 60 * k, 50, { body: i === 2 ? 'child' : 'adult', pal: VILLAGERS[i], outfit: 'shirt', hair: i % 2 ? 'short' : 'bun', lookUp: -.6, eyes: 'happy', smile: 1, blush: .6, flip: i > 2, key: 'face' + i }); }
    camEnd();
  }
  function s45(t, lt, dur) { cam(960, 560, lerp(1.1, .95, seg(R(t, lt), 0, dur))); mapView(t, { plaza: 1 }); camEnd(); }

  // ================================================================ chorus cuối 171.2–200.7: con người cũng vậy
  function plazaScene(t, lt, dur, o) {
    cam(...o.cam(R(t, lt))); plaza(t, { dusk: o.dusk || 0 });
    person(1180, 1000, 28, tam('old', { crouch: .4, eyes: 'happy', smile: .9, lookUp: .2, ...(o.tam || {}) }));
    o.fn && o.fn(t, lt);
    camEnd();
  }
  function s46(t, lt, dur) {
    plazaScene(t, lt, dur, { cam: r => [lerp(1250, 1100, seg(r, 0, 6)), 700, 1.2], fn: (t, lt) => {
      for (let i = 0; i < 4; i++) { const k = ease(seg(lt, i * .6, 1.4 + i * .6)); person(lerp(1900, 1350 + i * 120, k), 1010 + (i % 2) * 20, 28, { body: i === 3 ? 'old' : 'adult', pal: VILLAGERS[i + 1], outfit: 'shirt', hair: i === 3 ? 'bun' : 'short', flip: true, walk: k < 1 ? walkP(t, 5) : null, eyes: k >= 1 ? 'happy' : 'dot', smile: 1, lean: k >= 1 ? .25 : 0, key: 'old' + i }); }
    } });
  }
  function s47(t, lt, dur) {
    handOnStone(t, 1, 1, true);
    boilSeed('split47'); paint(rectPts(-60, -60, 1020, 1200, 2), { wash: '#B9B2A2', hatch: { d: 12, a: .5, o: { rand: .35 }, b: 'charcoal', c: '#7A7266', w: .8 }, ink: null });
    boilSeed('crack47'); inkLine([[200, 100], [380, 360], [330, 620], [520, 980]], 4, '#5A5346', 'ink', .5); inkLine([[380, 360], [600, 420]], 3, '#5A5346', 'ink', .5);
    splitLine();
  }
  function s48(t, lt, dur) {
    plazaScene(t, lt, dur, { cam: r => [1150, 820, 1.55], tam: { armN: [1.4 + .2 * Math.sin(t * 2), .6] }, fn: () => {
      person(1290, 1005, 28, { body: 'child', pal: { ...VILLAGERS[5], coat: '#D9622B' }, outfit: 'coat', hair: 'bob', flip: true, reach: .8, reachTo: [1220, 890], lookUp: .5, eyes: 'wide', smile: .8, key: 'grand' });
    } });
  }
  function s49(t, lt, dur) {
    plazaScene(t, lt, dur, { dusk: seg(lt, 0, dur * .6), cam: r => [lerp(1100, 960, seg(r, 0, 10)), lerp(760, 560, seg(r, 0, 10)), lerp(1.4, .95, seg(r, 0, 10))], fn: (t) => {
      person(1290, 1005, 28, { body: 'child', pal: { ...VILLAGERS[5], coat: '#D9622B' }, outfit: 'coat', hair: 'bob', crouch: 1, lookUp: .3, eyes: 'happy', smile: 1, key: 'grand' });
    } });
  }

  // ================================================================ outro 200.7–225.8
  function s50(t, lt, dur) {
    cam(lerp(1000, 1060, seg(R(t, lt), 0, dur)), 720, 1.3); plaza(t, { dusk: .15 });
    lantern(1200, 900, .8, t, {}, 'memLamp');
    boilSeed('memStick'); inkLine([[1250, 1000], [1285, 820]], 5, '#6B4A2E', 'ink', 0);
    camEnd();
  }
  function s51(t, lt, dur) { handOnStone(t, lt, dur, false); }
  function s52(t, lt, dur) {
    const k = ease(seg(R(t, lt), 0, dur));
    cam(960, lerp(700, 200, k), lerp(1.2, .8, k));
    plaza(t, { dusk: .5 + .5 * k });
    boilSeed('night52'); paint(rectPts(-800, -1400, W + 1600, 1300, 3), { wash: '#1A2040', washOp: 255 * k, ink: null });
    lightOrb(1000, lerp(680, -500, k), 1, t, 'rise');
    for (let i = 0; i < 60; i++) { boilSeed('s52' + i); paint(starPts(hash(i) * 2400 - 240, -1400 + hash(i * 3) * 1300, 4 + 4 * hash(i * 7), .4, 4), { wash: '#F4EEDC', washOp: 255 * k, ink: null }); }
    camEnd();
  }
  function s53(t, lt, dur) {
    cam(960, 540, lerp(1, 1.6, ease(seg(R(t, lt), 0, dur))));
    bg('#141A30', 'end');
    for (let i = 0; i < 80; i++) { boilSeed('s53' + i); const a = hash(i) * TAU, r = 900 * hash(i * 3) * (1 - ease(seg(lt, 0, 4))); paint(starPts(960 + Math.cos(a) * r, 540 + Math.sin(a) * r, 4 + 3 * hash(i), .4, 4), { wash: '#F4EEDC', ink: null }); }
    glow(960, 540, 200 + 900 * ease(seg(lt, 2, 5)), '#FFF1D0', 1);
    camEnd();
    if (lt > dur - 2) flash(ease(seg(lt, dur - 2, dur - .2)), PAL.paper);
  }

  holds([
    [0, 1], [1.4, 2], [2.63, 1], [6.5, 2], [8.4, 3], [16.6, 3], [21.6, 2], [26.4, 3], [31.4, 1], [35.6, 2], [40.8, 3],
    [45.7, 2], [57.3, 3], [63.4, 3], [67.3, 2], [78.3, 2], [81.8, 1], [87.7, 2], [95.1, 2], [110.5, 3], [118.2, 2],
    [125.6, 2], [138.3, 3], [142.7, 2], [146.6, 1], [150.2, 3], [154.3, 2], [155.8, 1], [157.8, 2], [159.8, 1], [161.6, 2],
    [171.2, 2], [190, 3], [200.7, 3], [209, 1], [213, 2], [220, 3],
  ]);
  shots([
    [0, s1], [1.4, s2], [2.6, s3], [4.6, s4], [6.5, s5], [8.4, s6], [12.2, s7],
    [16.6, s8], [21.6, s9], [26.4, s10], [31.4, closeWater], [33.5, closeShoulder], [35.6, s13], [38.2, s14], [40.8, s15],
    [45.7, s16], [49.7, s17], [53.5, s18], [57.3, s19],
    [63.4, s20], [67.3, s21], [71.3, s22], [74.4, s23], [78.3, s24], [81.8, s25], [87.7, s26],
    [95.1, s27], [99.0, s28], [102.8, s29], [106.7, s30], [110.5, s31], [118.2, s32],
    [125.6, s33], [129.8, s34], [133.6, s35], [138.3, s36],
    [142.7, s37], [146.6, s38], [150.2, s39], [154.3, s40], [155.8, s41], [157.8, s42], [159.8, s43], [161.6, s44], [163.6, s45],
    [171.2, s46], [177.8, s47], [184.9, s48], [190.0, s49],
    [200.7, s50], [209.0, s51], [213.0, s52], [220.0, s53],
  ]);
})();
