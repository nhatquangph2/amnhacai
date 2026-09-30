// test.js: đoạn thử kiểu cel/Ghibli, 69–77 s — cô bé khóc bên đá, thấy vết sáng, lau, đá bừng sáng, cô bé cười.
const SPR = {};
// Nạp tranh nhân vật trước khi trang báo "sẵn sàng": core đặt window.ready = true sau setup → ta giữ lại tới khi ảnh xong.
(() => {
  let coreReady = false, loaded = false;
  Object.defineProperty(window, 'ready', {
    configurable: true,
    get: () => coreReady && loaded,
    set: v => {
      coreReady = v;
      if (v && !loaded) {
        const load = src => new Promise(res => { const r = loadImage(src, img => res(img), () => res(null)); if (r && r.then) r.then(res, () => res(null)); });
        Promise.all([load(SPRITE_DATA['cry-a']), load(SPRITE_DATA['cry-b'])]).then(([a, b]) => { SPR.a = a; SPR.b = b; loaded = true; console.warn('sprites loaded', !!a, !!b); });
      }
    },
  });
})();
(() => {
  const ST = { x: 1230, y: 800, rx: 200, ry: 120 };
  const FL = [ST.x - 30, ST.y - 78];
  const GROUND = 905;

  // ---------- nền
  function sky(t) {
    CEL.sky.forEach((c, i) => { boilSeed('sky' + i); gouache(rectPts(-400, -300 + i * 150, W + 800, i === 4 ? 520 : 170), c, { tex: .35, fillOp: 40 }); });
    // mây tích khối lớn: phần sáng phía trên-trái, bóng xanh phía dưới, đáy phẳng
    const drift = (t - 60) * 6;
    const puffs = [[0, 0, 150], [-150, 60, 120], [150, 50, 130], [-60, -110, 120], [80, -120, 110], [-250, 130, 95], [260, 130, 100], [10, -210, 90], [-170, -40, 100], [190, -40, 95]];
    const cx = 1350 + drift, cy = 260;
    boilSeed('cloudSh2'); gouache([[cx - 360, cy + 190], [cx + 370, cy + 190], [cx + 330, cy + 120], [cx - 330, cy + 120]], CEL.cloudSh2, { curv: .5 });
    puffs.forEach(([dx, dy, r], i) => { boilSeed('cs' + i); gouache(blob(cx + dx + 8, cy + dy + 18, r, r * .9, 18, i), CEL.cloudSh, { fillOp: 30 }); });
    puffs.forEach(([dx, dy, r], i) => { boilSeed('cl' + i); gouache(blob(cx + dx - 6, cy + dy - 6, r * .86, r * .76, 18, i + 3), CEL.cloud, { fillOp: 20 }); });
    // mây nhỏ bên trái
    for (let j = 0; j < 3; j++) { boilSeed('small' + j); const x = 220 + j * 260 + drift * .6, y = 170 + j * 40; gouache(blob(x, y + 8, 90, 34, 14, j), CEL.cloudSh, { fillOp: 30 }); gouache(blob(x - 6, y, 80, 28, 14, j + 5), CEL.cloud, { fillOp: 20 }); }
  }
  function far(t) {
    boilSeed('mtn1'); gouache([[-200, 560], [100, 430], [330, 470], [560, 400], [820, 470], [1100, 420], [1400, 470], [1700, 410], [2100, 480], [2100, 560]], CEL.mtnFar, { curv: .6 });
    boilSeed('mtn2'); gouache([[-200, 570], [200, 490], [520, 520], [900, 480], [1300, 520], [1650, 470], [2100, 520], [2100, 580]], CEL.mtnNear, { curv: .6 });
    // hàng cây bờ bên kia: lớp tối → vừa → sáng (nắng từ trái)
    for (let i = 0; i < 10; i++) {
      const x = -80 + i * 230 + hash(i) * 90, y = 580, r = 70 + hash(i + 4) * 60, tall = 1 + hash(i * 3) * .8, sway = 3 * Math.sin(t * 1.3 + i);
      boilSeed('tt' + i); cel([[x - 8, y], [x - 5, y - r * tall * .9], [x + 6, y - r * tall * .9], [x + 9, y]], '#5A4032', { ink: null });
      const cl = [[0, -r * tall, 1], [-r * .6, -r * tall * .75, .7], [r * .65, -r * tall * .7, .72], [-r * .2, -r * tall * 1.35, .6], [r * .3, -r * tall * 1.2, .55]];
      cl.forEach(([dx, dy, k], j) => { boilSeed('tk' + i + j); gouache(blob(x + dx, y + dy + 10, r * k, r * .82 * k, 16, i * 5 + j, .16), CEL.treeDk); });
      cl.forEach(([dx, dy, k], j) => { boilSeed('tm' + i + j); gouache(blob(x + dx - r * .1 * k + sway, y + dy, r * k * .8, r * .62 * k, 16, i * 3 + j, .18), CEL.tree); });
      cl.forEach(([dx, dy, k], j) => { boilSeed('tl' + i + j); gouache(blob(x + dx - r * .28 * k + sway, y + dy - r * .2 * k, r * k * .42, r * .3 * k, 12, i + j, .2), CEL.treeLt); });
      boilSeed('th' + i); gouache(blob(x - r * .5 + sway, y - r * tall * 1.15, r * .2, r * .13, 10, i, .2), CEL.treeHi);
    }
    boilSeed('bankfar'); gouache(rectPts(-200, 570, W + 400, 30), CEL.grassDk);
  }
  function river(t) {
    boilSeed('water'); gouache(rectPts(-200, 598, W + 400, 200), CEL.water, { tex: .3, fillOp: 60 });
    boilSeed('waterDk'); gouache(rectPts(-200, 598, W + 400, 22), CEL.waterDk);
    // phản chiếu mây + cây (mờ, rung nhẹ theo sóng)
    for (let i = 0; i < 5; i++) { boilSeed('rf' + i); gouache(blob(1250 + (t - 60) * 6 + (i - 2) * 140, 690 + i % 2 * 12, 120, 16, 12, i), CEL.waterLt, { op: 150 }); }
    for (let i = 0; i < 26; i++) {
      const y = 630 + (i * 23) % 160, x = ((i * 157 + t * 40) % 2200) - 150, l = 30 + hash(i) * 70;
      boilSeed('sp' + i); gouache(rectPts(x, y, l, 3), '#E8F4FA', { op: 200 });
    }
  }
  function nearBank(t) {
    boilSeed('bankEdge'); gouache([[-200, 800], [400, 786], [900, 796], [1500, 782], [2100, 796], [2100, 1200], [-200, 1200]], CEL.grass, { curv: .5, fillOp: 60 });
    boilSeed('bankLt'); gouache([[-200, 860], [700, 846], [1400, 870], [2100, 850], [2100, 1200], [-200, 1200]], CEL.grassLt, { curv: .5, op: 150 });
    // lối mòn đất
    boilSeed('path'); gouache([[-200, 900], [800, 885], [1600, 905], [2100, 895], [2100, 960], [1400, 975], [600, 965], [-200, 975]], '#D6B98A', { curv: .5, fillOp: 50 });
  }
  function grassFront(t, gust) {
    // cỏ tiền cảnh lay theo gió (lớp tối trước, lớp sáng sau)
    for (let i = 0; i < 90; i++) {
      const x = hash(i * 3.1) * 2300 - 200, y = 990 + hash(i * 1.7) * 130, h = 30 + hash(i) * 90;
      const bend = (18 + 30 * gust) * Math.sin(t * 2.2 + x * .004) + 25 * gust;
      boilSeed('g' + i);
      cel([[x - 7, y], [x + bend * .5, y - h * .55], [x + bend, y - h], [x + bend * .5 + 3, y - h * .5], [x + 7, y]], i % 3 ? CEL.grassDk : CEL.grass, { ink: null, curv: .6 });
    }
    for (let i = 0; i < 30; i++) {
      const x = hash(i * 7.3) * 2000, y = 920 + hash(i * 2.9) * 60, h = 30 + hash(i + 1) * 30, bend = 12 * Math.sin(t * 2 + i) + 18 * gust;
      boilSeed('gl' + i); cel([[x - 4, y], [x + bend, y - h], [x + 4, y]], CEL.grassHi, { ink: null, curv: .5 });
      if (i % 5 === 0) { boilSeed('fl' + i); cel(blob(x + bend, y - h - 4, 6, 6, 8, i), '#FFF3F6', { ink: null }); cel(blob(x + bend, y - h - 4, 2.4, 2.4, 6, i), '#F4C542', { ink: null }); }
    }
  }
  function stone(t, fleck) {
    boilSeed('stShadow'); gouache(blob(ST.x + 20, ST.y + 70, ST.rx * 1.1, 26, 20, 1, .05), '#4E7A34', { op: 170 });
    const pts = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, k = 1 + .06 * Math.sin(i * 2.3) + .04 * Math.cos(i * 4.1); pts.push([ST.x + Math.cos(a) * ST.rx * k, ST.y + Math.sin(a) * ST.ry * k * (Math.sin(a) > 0 ? .6 : 1)]); }
    boilSeed('st'); cel(pts, CEL.stone, { sw: .8, curv: .5 });
    // bóng phía phải-dưới (nắng từ trái trên)
    boilSeed('stSh'); cel([[ST.x + 40, ST.y - ST.ry * .9], [ST.x + ST.rx * .95, ST.y - 20], [ST.x + ST.rx * .9, ST.y + 55], [ST.x - 40, ST.y + 68], [ST.x + 30, ST.y + 20], [ST.x + 70, ST.y - 40]], CEL.stoneSh, { ink: null, curv: .6 });
    boilSeed('stLt'); cel([[ST.x - ST.rx * .8, ST.y - 30], [ST.x - 80, ST.y - ST.ry * .95], [ST.x + 20, ST.y - ST.ry * .98], [ST.x - 40, ST.y - 70], [ST.x - 130, ST.y - 30]], CEL.stoneLt, { ink: null, curv: .6 });
    boilSeed('moss'); cel(blob(ST.x + 100, ST.y + 40, 60, 16, 12, 2), CEL.moss, { ink: null }); cel(blob(ST.x - 150, ST.y + 45, 40, 12, 10, 4), CEL.moss, { ink: null });
    boilSeed('crack'); inkLine([[ST.x + 10, ST.y - 60], [ST.x + 30, ST.y - 20], [ST.x + 22, ST.y + 10]], .5, CEL.line, 'cel', .4);
    // vết sáng
    boilSeed('fleck'); cel(starPts(FL[0], FL[1], 8 + 6 * fleck, .45, 4, .3), mixCol('#D8D3C0', '#FFF6D8', clamp(fleck + .2)), { ink: null });
    if (fleck > .03) { glow(FL[0], FL[1], 50 + 260 * fleck, '#FFE9B0', clamp(fleck)); boilSeed('flStar'); cel(starPts(FL[0], FL[1], 12 + 40 * fleck, .16, 4, 0), '#FFFBEE', { ink: null }); }
  }

  // ---------- cô bé (tỉ lệ thật hơn, cel 2 tông) — ngồi co gối bên trái tảng đá, quay phải
  function girlCel(x, y, o) {
    const S = 1.5;
    const sob = o.sob || 0, look = o.look || 0, reach = o.reach || 0, rt = o.reachTo || [0, 0], happy = o.happy || 0;
    const shake = sob * 2.5 * Math.sin(o.t * 26);
    const P = (px, py) => [x + px * S, y + py * S];
    // ủng + chân co (phần lớn khuất sau áo)
    boilSeed('gBoot'); cel([P(-38, -22), P(12, -26), P(34, -12), P(36, 0), P(-40, 0)], CEL.boot, { sw: .6 });
    cel([P(-30, -14), P(30, -10), P(34, 0), P(-36, 0)], CEL.bootSh, { ink: null });
    boilSeed('gLeg'); cel([P(-10, -24), P(40, -96), P(62, -86), P(20, -20)], CEL.pants, { sw: .6 });
    // áo mưa: khối chuông ôm gối
    const sh = [P(-6, -150 + shake), P(30, -150 + shake)];
    boilSeed('gCoat'); cel([sh[0], sh[1], P(62, -112 + shake * .5), P(70, -70), P(52, -24), P(-60, -18), P(-78, -60), P(-52, -120 + shake * .5)], CEL.coat, { sw: .7 });
    boilSeed('gCoatSh'); cel([P(-52, -120 + shake * .5), P(-10, -140 + shake), P(-26, -60), P(-10, -22), P(-60, -18), P(-78, -60)], CEL.coatSh, { ink: null, curv: .5 });
    boilSeed('gCoatLt'); cel([P(20, -146 + shake), P(52, -118), P(40, -110), P(14, -134 + shake)], CEL.coatLt, { ink: null });
    boilSeed('gSeam'); inkLine([P(28, -140 + shake), P(50, -80), P(44, -28)], .45, CEL.coatSh, 'cel', .5);
    // đầu (ngẩng lên khi nhìn vết sáng)
    const hx = x + (14 + look * 6) * S, hy = y + (-188 - look * 8 + shake) * S, R = 38 * S;
    const Q = (dx, dy) => [hx + dx * S, hy + dy * S];
    boilSeed('gHairB'); cel(blob(hx - 8 * S, hy + 2 * S, R * 1.05, R * 1.05, 20, 1, .04), CEL.hair, { sw: .7 });
    boilSeed('gFace'); cel(blob(hx + 6 * S, hy + 6 * S, R * .86, R * .92, 20, 2, .02), CEL.skin, { sw: .7 });
    boilSeed('gFaceSh'); cel([Q(-22, 10), Q(-10, 34), Q(20, 42), Q(-20, 30)], CEL.skinSh, { ink: null, curv: .6 });
    // mái tóc + tóc mai (vệt sáng xanh tím kiểu anime)
    boilSeed('gBang'); cel([Q(-34, -6), Q(-26, -34), Q(4, -44), Q(36, -30), Q(40, -8), Q(26, -16), Q(14, -6), Q(2, -18), Q(-10, -4)], CEL.hair, { sw: .7, curv: .45 });
    boilSeed('gHairHi'); cel([Q(-20, -30), Q(8, -38), Q(2, -32), Q(-16, -26)], CEL.hairLt, { ink: null });
    boilSeed('gSide'); cel([Q(-36, -6), Q(-30, 30), Q(-18, 38), Q(-22, 4)], CEL.hair, { sw: .6 });
    // mặt 3/4 quay phải
    const ex = hx + 20 * S, ey = hy + (6 - look * 3) * S, E = (dx, dy) => [ex + dx * S, ey + dy * S];
    boilSeed('gEye');
    if (o.eyes === 'closed') inkLine([E(-9, 0), E(0, 4), E(9, 1)], .7, CEL.line, 'cel', .6);
    else if (happy > .5) inkLine([E(-9, 3), [ex, ey - 5], E(9, 3)], .75, CEL.line, 'cel', .6);
    else {
      cel(blob(ex, ey, 6.5 * S, 9.5 * S, 12, 0, 0), '#3A2624', { ink: null });
      cel(blob(ex + 1.5 * S, ey + 2 * S, 3.5 * S, 5 * S, 10, 0, 0), '#6B3F2A', { ink: null });
      cel(blob(ex + 2.5 * S, ey - 3.5 * S, 2.2 * S, 2.2 * S, 8, 0, 0), '#FFFFFF', { ink: null });
      if (o.eyes === 'wide') cel(blob(ex - 2 * S, ey + 3 * S, 1.3 * S, 1.3 * S, 6, 0, 0), '#FFFFFF', { ink: null });
    }
    inkLine([E(-10, -15 + (o.brow || 0)), E(8, -16 - (o.brow || 0) * .5)], .6, CEL.hair, 'cel', .4);
    inkLine([Q(38, 14), Q(41, 19)], .45, CEL.skinSh, 'cel', 0);                         // mũi
    boilSeed('gCheek'); cel(blob(ex - 4 * S, ey + 16 * S, 8 * S, 4 * S, 10, 0, 0), CEL.cheek, { ink: null, op: 90 + 120 * happy });
    const mx = hx + 30 * S, my = hy + 30 * S;
    if (sob > .3) cel([[mx - 5 * S, my], [mx + 5 * S, my - S], [mx + 3 * S, my + 5 * S], [mx - 3 * S, my + 5 * S]], '#7A3A34', { sw: .5 });
    else inkLine([[mx - 6 * S, my - S], [mx, my + (2 + happy * 3) * S], [mx + 6 * S, my - 2 * S]], .6, CEL.line, 'cel', .6);
    if (o.tear > 0) { boilSeed('gTear'); const ty = ey + (8 + 22 * frac(o.t * 1.3)) * S; cel(blob(ex - 3 * S, ty, 2.6 * S, 4 * S, 8, 0, 0), '#BFE2F4', { sw: .4 }); inkLine([E(-2, 8), E(-4, 26)], .6, '#BFE2F4', 'cel', .3); }
    // tay gần: ôm gối, hoặc với ra lau vết sáng
    const shP = P(26, -138 + shake), hug = P(48, -86);
    const hand = [lerp(hug[0], rt[0], reach), lerp(hug[1], rt[1], reach)];
    const elb = [lerp(shP[0] + 14 * S, (shP[0] + hand[0]) / 2 - 10, reach), lerp(shP[1] + 34 * S, (shP[1] + hand[1]) / 2 + 40, reach)];
    boilSeed('gArm'); paint(ribbon([shP, elb, hand], 24 * S, 17 * S), { wash: CEL.coat, ink: CEL.line, sw: .6, br: 'cel', curv: .5 });
    boilSeed('gHand'); cel(blob(hand[0], hand[1], 10 * S, 9 * S, 10, 0, .05), CEL.skin, { sw: .6 });
  }

  function shot(t, lt, dur) {
    const tr = TREAL;
    const gust = Math.exp(-Math.pow((t - 75.4) / .6, 2));
    const fleck = kf(t, [[69, .08], [71.3, .08], [71.6, .9], [72.3, .5], [74.4, .7], [75.4, 1.15], [77, 1]]);
    camBegin(kf(tr, [[69, 1060], [71.3, 1040], [74.4, 1060], [77, 1080]]), kf(tr, [[69, 520], [71.3, 640], [74.4, 700], [77, 600]]), kf(tr, [[69, 1.05], [71.3, 1.3], [74.4, 1.5], [77, 1.25]]));
    sky(t); far(t); river(t); nearBank(t); stone(t, fleck);
    // tia nắng xiên khi đá bừng sáng
    const beam = clamp((fleck - .5) * 1.6);
    if (beam > 0) for (let i = 0; i < 4; i++) { boilSeed('beam' + i); gouache([[300 + i * 160, -200], [380 + i * 160, -200], [FL[0] + 30 + i * 20, FL[1]], [FL[0] - 10 + i * 20, FL[1]]], '#FFF4D6', { op: 55 * beam, fillOp: 0 }); }
    // Cô bé: tranh cel do Antigravity vẽ (cry-a / cry-b), luân phiên theo koma khi nấc; ánh sáng làm cô thôi nấc
    const calm = seg(t, 71.6, 72.6), sob = 1 - calm;
    const frameId = sob > .5 ? (Math.floor(t * 4) % 2 ? 'b' : 'a') : 'a';
    const img = SPR[frameId];
    if (img) {
      const h = 360, w = h * img.width / img.height, gx = ST.x - ST.rx - 150, gy = GROUND + 20;
      const bob = sob * 4 * Math.sin(t * 16), breathe = 1 + .012 * Math.sin(t * 2.4);
      push(); translate(gx, gy); scale(1, breathe); image(img, -w / 2, -h + bob, w, h); pop();
      // ánh sáng ấm từ vết sáng tràn xuống người cô bé
      if (fleck > .3) glow(gx + 40, gy - 220, 240 * clamp(fleck), '#FFE2A8', .5 * clamp(fleck));
    }
    grassFront(t, gust);
    // cánh hoa bay theo cơn gió
    if (gust > .05 || t > 75) for (let i = 0; i < 16; i++) {
      const k = seg(t, 74.8 + i * .06, 77), x = lerp(300 + i * 40, 2000, k), y = 700 + 200 * Math.sin(i * 1.7) - 180 * k + 20 * Math.sin(t * 4 + i);
      if (k > 0 && k < 1) { boilSeed('pt' + i); cel(blob(x, y, 7, 4, 8, i, .1), i % 2 ? '#FFFFFF' : '#F7C9D6', { ink: null }); }
    }
    camEnd();
  }
  holds([[0, 3], [71.2, 2]]);
  shots([[0, shot]]);
})();
