// people.js: mọi nhân vật của "Câu chuyện tảng đá", vẽ tay bằng p5.brush, CÙNG MỘT CỠ VẼ u
// (người lớn cao hơn trẻ con theo tỉ lệ thật — không có người tí hon).
// Nhìn nghiêng, quay mặt sang phải (flip: true để quay trái). Dựng bằng khớp nên mọi dáng liền một khối.
//
// person(x, y, u, o): (x, y) = điểm chạm đất giữa hai chân (khi ngồi: điểm hông trên mặt ngồi).
//   o.body   'child' | 'teen' | 'adult' | 'old'
//   o.pal    { coat, coatDk, pants, pantsDk, shoe, shoeDk, skin, hair }  (thiếu thì lấy mặc định)
//   o.hair   'bob' | 'short' | 'bun' | 'pony' | 'long'      o.hat 'hood' | 'non' | null      o.hood 0..1 (với hat 'hood')
//   o.outfit 'coat' (áo mưa chuông) | 'shirt' (áo ngắn + quần) | 'dress' (áo dài/áo tứ thân dài)
//   o.walk   pha bước (radian) · null = đứng      o.crouch 0..1      o.sit 0..1 (y = mặt ngồi)   o.swing pha đung đưa chân
//   o.lean   nghiêng người    o.dy nhấc người (u)   o.sq co giãn    o.reach 0..1 + o.reachTo [x,y] thế giới (tay gần với tới)
//   o.armN / o.armF  [góc vai, gập khuỷu] ghi đè tay gần / xa (từ phương thẳng xuống, + = về trước)
//   o.lookUp −1..1   o.eyes 'dot' | 'happy' | 'closed' | 'wide' | 'sad'   o.smile −1..1 (âm = mếu)   o.blush 0..1   o.tear 0..1
//   o.hold   'umbrella' | 'pole' | 'book' | 'brush' | 'bag' | null     o.umbrella màu ô
//   o.key    khoá boil riêng · o.alpha 0..1 (mờ — người lướt qua khi tua nhanh)
const BODY = {
  child: { L1: 1.2, L2: 1.15, T: 2.3, r: 1.9, A1: 1.0, A2: .9, lw: .72, aw: .6 },
  teen:  { L1: 1.85, L2: 1.75, T: 3.0, r: 1.7, A1: 1.4, A2: 1.25, lw: .7, aw: .56 },
  adult: { L1: 2.4, L2: 2.3, T: 3.4, r: 1.55, A1: 1.6, A2: 1.45, lw: .78, aw: .6 },
  old:   { L1: 2.2, L2: 2.1, T: 3.2, r: 1.55, A1: 1.5, A2: 1.35, lw: .74, aw: .58 },
};
const PAL_DEF = { coat: '#D9622B', coatDk: '#A8471C', pants: '#3B3F5C', pantsDk: '#2A2D45', shoe: '#E8AA38', shoeDk: '#B98320', skin: '#F2C9A5', hair: '#2B2233' };
const ORANGE = { coat: '#D9622B', coatDk: '#A8471C', pants: '#3B3F5C', pantsDk: '#2A2D45', shoe: '#E8AA38', shoeDk: '#B98320', skin: '#F2C9A5', hair: '#2B2233' };
const darker = c => mixCol(c, '#2B2233', .3);

function person(x, y, u, o = {}) {
  const B = BODY[o.body || 'child'], pal = { ...PAL_DEF, ...(o.pal || {}) };
  pal.coatDk = o.pal?.coatDk || darker(pal.coat); pal.pantsDk = o.pal?.pantsDk || darker(pal.pants); pal.shoeDk = o.pal?.shoeDk || darker(pal.shoe);
  const skinDk = mixCol(pal.skin, '#8A5A44', .25);
  const f = o.flip ? -1 : 1, sq = o.sq || 0, key = o.key || 'p';
  const crouch = clamp(o.crouch || 0), sit = clamp(o.sit || 0), reach = clamp(o.reach || 0);
  const walking = o.walk != null && !sit && crouch < .5;
  const wp = o.walk || 0, { L1, L2, T, r } = B, legLen = L1 + L2;
  const outfit = o.outfit || (o.body === 'child' ? 'coat' : 'shirt');
  const stoop = o.body === 'old' ? .22 : 0;

  // ---- khung xương (đơn vị u, gốc = chân, y âm = lên, x dương = phía trước)
  const bob = walking ? -Math.abs(Math.cos(wp)) * .08 * legLen : 0;
  let hip = [lerp(0, -.3, crouch), lerp(-legLen * .985, -legLen * .44, crouch) + bob + (o.dy || 0)];
  if (sit) hip = [0, (o.dy || 0)];
  const lean = (o.lean || 0) + stoop + crouch * .35 - sit * .08 + (walking ? .06 : 0);
  const legAng = i => {
    if (sit) { const sw = .22 * Math.sin((o.swing || 0) + i * 2.4); return [Math.PI / 2 - .12, Math.PI / 2 - .1 + sw]; }
    if (crouch > 0 && !walking) return [lerp(0, 1.3 + i * .08, crouch), lerp(0, 2.3 + i * .05, crouch)];
    if (walking) { const p = wp + i * Math.PI; return [.42 * Math.sin(p), .9 * Math.max(0, -Math.cos(p)) + .08]; }
    return [i ? -.05 : .06, .05];
  };
  const legPts = i => {
    const [a, b] = legAng(i), k = [hip[0] + L1 * Math.sin(a), hip[1] + L1 * Math.cos(a)];
    const c = a - b; return [hip, k, [k[0] + L2 * Math.sin(c), k[1] + L2 * Math.cos(c)]];
  };
  const up = [Math.sin(lean), -Math.cos(lean)], fw = [Math.cos(lean), Math.sin(lean)];
  const P = (s, w) => [hip[0] + up[0] * s + fw[0] * w, hip[1] + up[1] * s + fw[1] * w];
  const neck = P(T, 0), shoulder = P(T - .3, .05);
  const armDef = i => {
    if (i === 0 && o.armN) return o.armN; if (i === 1 && o.armF) return o.armF;
    if (o.hold === 'umbrella' && i === 0) return [2.3, .25];
    if (o.hold === 'pole' && i === 0) return [2.9, -.2];
    if (o.hold === 'book' && i === 0) return [.9, 1.3];
    if (walking) return [-.5 * Math.sin(wp + i * Math.PI) + .1, .35];
    if (sit) return [i ? .15 : -.25, .5];
    return [lerp(.08 + (i ? .05 : 0), .35, crouch), lerp(.25, .6, crouch)];
  };
  const armPts = i => {
    const [a, b] = armDef(i), e = [shoulder[0] + B.A1 * Math.sin(a), shoulder[1] + B.A1 * Math.cos(a)];
    return [shoulder, e, [e[0] + B.A2 * Math.sin(a + b), e[1] + B.A2 * Math.cos(a + b)]];
  };

  // toạ độ cục bộ → thế giới (không dùng scale(): p5.brush sẽ làm nét đứt thành chấm)
  const Wp = p => [x + f * p[0] * u, y + p[1] * u * (1 - sq)];
  const al = o.alpha ?? 1, op = v => Math.round(255 * al * (v ?? 1));
  const pnt = (pts, q) => paint(pts.map(Wp), { ...q, washOp: op(q.washOp != null ? q.washOp / 255 : 1), ...(q.ink === null ? {} : { sw: (q.sw ?? 1 / u) * u, ink: al < .6 ? null : q.ink }) });
  const inkL = (pts, w, c, b, cv) => { if (al >= .6) inkLine(pts.map(Wp), w * u, c, b, cv); };
  const sw = 1.05 / u;

  let near = armPts(0);
  if (reach > 0 && o.reachTo) {
    const tx = (o.reachTo[0] - x) / (f * u), ty = (o.reachTo[1] - y) / (u * (1 - sq));
    const s = shoulder, dx = tx - s[0], dy = ty - s[1], D = Math.hypot(dx, dy) || .01, d = Math.min(D, (B.A1 + B.A2) * 1.3);
    const h = [s[0] + dx / D * d, s[1] + dy / D * d], e = [s[0] + dx / D * d * .52 - dy / D * .25, s[1] + dy / D * d * .52 + dx / D * .25];
    near = [s, [lerp(near[1][0], e[0], reach), lerp(near[1][1], e[1], reach)], [lerp(near[2][0], h[0], reach), lerp(near[2][1], h[1], reach)]];
  }

  const limb = (pts, w0, w1, col, k) => { boilSeed(key + k); pnt(ribbon(pts, w0, w1), { wash: col, ink: PAL.ink, sw, curv: .5 }); };
  const shoe = (a, col, k) => { boilSeed(key + k); const s = o.body === 'child' ? 1 : .9; pnt([[a[0] - .32 * s, a[1] - .42 * s], [a[0] + .18 * s, a[1] - .45 * s], [a[0] + .55 * s, a[1] - .12 * s], [a[0] + .62 * s, a[1] + .08], [a[0] - .38 * s, a[1] + .1]], { wash: col, ink: PAL.ink, sw, curv: .55 }); };
  const hand = (p, col, k) => { boilSeed(key + k); pnt(ellPts(p[0], p[1], .27, .27, 10), { wash: col, ink: PAL.ink, sw }); };

  // ---- đồ vật phía sau người (đòn gánh: quang gánh sau lưng)
  const lf = legPts(1), ln = legPts(0), af = armPts(1);
  if (o.hold === 'pole') {
    boilSeed(key + 'pole');
    const sh = P(T - .05, 0), A = [sh[0] - 3.2, sh[1] + .15], Bp = [sh[0] + 3.2, sh[1] - .15], sway = .15 * Math.sin(wp);
    pnt(ribbon([A, [sh[0], sh[1] - .1], Bp], .22, .22), { wash: '#7A5634', ink: PAL.ink, sw: sw * .7, curv: .5 });
    for (const [px, py] of [A, Bp]) {
      inkL([[px, py], [px - .6 + sway, py + 2.0]], .05, PAL.ink, 'inkfine', 0); inkL([[px, py], [px + .6 + sway, py + 2.0]], .05, PAL.ink, 'inkfine', 0);
      pnt([[px - 1.25 + sway, py + 1.95], [px + 1.25 + sway, py + 1.95], [px + 1.0 + sway, py + 3.2], [px - 1.0 + sway, py + 3.2]], { wash: '#C9A56A', ink: PAL.ink, sw, curv: .4 });
      pnt(ellPts(px + sway, py + 1.9, 1.1, .42, 10), { wash: '#6E9F58', ink: PAL.ink, sw });
    }
  }
  // ---- chân xa, tay xa (tối hơn)
  limb(lf, B.lw * .95, B.lw * .82, pal.pantsDk, 'lf'); shoe(lf[2], pal.shoeDk, 'sf');
  limb(af, B.aw, B.aw * .8, pal.coatDk, 'af'); hand(af[2], skinDk, 'hf');
  limb(ln, B.lw, B.lw * .86, pal.pants, 'ln'); shoe(ln[2], pal.shoe, 'sn');

  // ---- thân áo
  boilSeed(key + 'coat');
  if (outfit === 'coat') {
    const k = T / 2.3, hemS = lerp(-.75, -.4, sit) * (o.body === 'child' ? 1 : 1.6), hemF = lerp(1.55, 1.9, sit) * (o.body === 'child' ? 1 : .9), hemB = lerp(-1.35, -1.1, sit) * (o.body === 'child' ? 1 : .85);
    pnt([P(T + .1, -.6), P(T + .1, .55), P(1.8 * k, .95), P(.4 * k, 1.3), P(hemS, hemF), P(hemS - .12, .4), P(hemS - .08, -.5), P(hemS + .02, hemB), P(.5 * k, -1.1), P(1.8 * k, -.9)], { wash: pal.coat, ink: PAL.ink, sw: sw * 1.1, curv: .55 });
    boilSeed(key + 'btn');
    inkL([P(T - .2, .8), P(.9 * k, 1.1), P(hemS + .1, hemF - .1)], sw * .8, pal.coatDk, 'inkfine', .5);
    for (let i = 0; i < 3; i++) { const b = P((T - .5) - i * .6 * k, .98 + i * .1); pnt(ellPts(b[0], b[1], .1, .1, 8), { wash: pal.coatDk, ink: null }); }
  } else if (outfit === 'dress') {
    const hem = -legLen * .82;
    pnt([P(T + .05, -.55), P(T + .05, .5), P(T * .55, .75), P(.2, .75), P(hem, 1.15 + (walking ? .25 * Math.sin(wp) : 0)), P(hem - .05, -.9), P(.2, -.75), P(T * .55, -.7)], { wash: pal.coat, ink: PAL.ink, sw: sw * 1.1, curv: .5 });
  } else {
    pnt([P(T + .05, -.6), P(T + .05, .55), P(T * .5, .8), P(-.35, .95), P(-.45, -.95), P(T * .5, -.8)], { wash: pal.coat, ink: PAL.ink, sw: sw * 1.1, curv: .5 });
  }

  // ---- đầu
  const lookUp = o.lookUp || 0;
  const hc = [neck[0] + .2 * (1 - crouch) + fw[0] * .1, neck[1] - r * .87 - lookUp * .1];
  const hat = o.hat, hood = hat === 'hood' ? clamp(o.hood ?? 1) : 0, hair = o.hair || 'bob';
  boilSeed(key + 'head');
  if (hood > .02) pnt(ellPts(hc[0] - r * .22 * hood, hc[1] - r * .08, r * 1.12, r * 1.08, 22), { wash: pal.coat, ink: PAL.ink, sw, curv: .6 });
  else if (hair === 'bob' || hair === 'long') {
    const L = hair === 'long' ? 1.9 : .95;
    pnt([[hc[0] - r * 1.05, hc[1] - r * .1], [hc[0] - r * .8, hc[1] - r * .85], [hc[0], hc[1] - r * 1.08], [hc[0] + r * .7, hc[1] - r * .85], [hc[0] + r * .3, hc[1] - r * .3],
      [hc[0] - r * .2, hc[1] + r * .25], [hc[0] - r * .55, hc[1] + r * L], [hc[0] - r * 1.1, hc[1] + r * (L - .2)]], { wash: pal.hair, ink: PAL.ink, sw, curv: .6 });
  } else if (hair === 'pony') {
    pnt(ellPts(hc[0] - r * .1, hc[1] - r * .1, r * 1.0, r * .98, 18), { wash: pal.hair, ink: PAL.ink, sw, curv: .6 });
    pnt(ribbon([[hc[0] - r * .8, hc[1] - r * .35], [hc[0] - r * 1.45, hc[1] + r * .2 + .2 * Math.sin(wp)], [hc[0] - r * 1.35, hc[1] + r * .9]], r * .5, r * .15), { wash: pal.hair, ink: PAL.ink, sw, curv: .5 });
  } else if (hair === 'bun') {
    pnt(ellPts(hc[0] - r * .1, hc[1] - r * .1, r * 1.0, r * .98, 18), { wash: pal.hair, ink: PAL.ink, sw, curv: .6 });
    pnt(ellPts(hc[0] - r * .85, hc[1] - r * .55, r * .45, r * .42, 12), { wash: pal.hair, ink: PAL.ink, sw });
  } else {
    pnt(ellPts(hc[0] - r * .08, hc[1] - r * .2, r * .98, r * .9, 18), { wash: pal.hair, ink: PAL.ink, sw, curv: .6 });
  }
  pnt(ellPts(hc[0] + r * .12, hc[1] + r * .08, r * .92, r * .9, 20), { wash: pal.skin, ink: PAL.ink, sw, curv: .6 });
  if (!hood) pnt([[hc[0] - r * .55, hc[1] - r * .55], [hc[0] + r * .15, hc[1] - r * 1.02], [hc[0] + r * .95, hc[1] - r * .55], [hc[0] + r * .85, hc[1] - r * (hair === 'short' ? .4 : .18)],
    [hc[0] + r * .35, hc[1] - r * .35], [hc[0] - r * .1, hc[1] - r * .2]], { wash: pal.hair, ink: PAL.ink, sw, curv: .5 });
  // mặt
  const ey = [hc[0] + r * .6, hc[1] + r * (.05 - lookUp * .18)], es = r / 1.9;
  boilSeed(key + 'face');
  const eyes = o.eyes || 'dot';
  if (eyes === 'happy') inkL([[ey[0] - .26 * es, ey[1] + .06], [ey[0], ey[1] - .2 * es], [ey[0] + .26 * es, ey[1] + .06]], sw * .9, PAL.ink, 'inkfine', .6);
  else if (eyes === 'closed') inkL([[ey[0] - .22 * es, ey[1]], [ey[0], ey[1] + .1 * es], [ey[0] + .22 * es, ey[1]]], sw * .9, PAL.ink, 'inkfine', .6);
  else {
    pnt(ellPts(ey[0], ey[1], (eyes === 'wide' ? .19 : .15) * es, (eyes === 'wide' ? .27 : .22) * es, 10), { wash: PAL.ink, ink: null });
    if (eyes === 'sad') inkL([[ey[0] - .3 * es, ey[1] - .38 * es], [ey[0] + .22 * es, ey[1] - .28 * es]], sw * .8, PAL.ink, 'inkfine', .3);
  }
  if (o.blush !== 0) pnt(ellPts(ey[0] - .1, ey[1] + .55 * es, .32 * es, .18 * es, 10), { wash: '#E88A8A', washOp: 120 * (o.blush ?? (o.body === 'child' ? .8 : .35)), ink: null });
  if (o.tear > 0) { boilSeed(key + 'tear'); const ty = ey[1] + .3 + o.tear * .9; pnt(ellPts(ey[0] - .05, ty, .12, .18, 8), { wash: '#8EC3E6', ink: PAL.ink, sw: sw * .6 }); }
  const sm = o.smile ?? .4, my = hc[1] + r * (.58 - lookUp * .15);
  inkL([[hc[0] + r * .62, my - sm * .05], [hc[0] + r * .78, my + sm * .12], [hc[0] + r * .95, my - sm * .08]], sw * .8, PAL.ink, 'inkfine', .6);

  // ---- mũ: vành mũ trùm / nón lá
  boilSeed(key + 'brim');
  if (hood > .02) {
    const pts = [];
    for (let i = 0; i <= 12; i++) { const a = lerp(-.15, -2.35, i / 12); pts.push([hc[0] + r * .12 + Math.cos(a) * r, hc[1] + r * .06 + Math.sin(a) * r * .98]); }
    for (let i = 12; i >= 0; i--) { const a = lerp(-.25, -2.3, i / 12); pts.push([hc[0] + r * .12 + Math.cos(a) * r * .8, hc[1] + r * .12 + Math.sin(a) * r * .78]); }
    pnt(pts, { wash: pal.coat, ink: PAL.ink, sw, curv: .5 });
  } else if (hat === 'non') {
    const c = [hc[0] + r * .05, hc[1] - r * .55];
    pnt([[c[0] - r * 1.75, c[1] + r * .25], [c[0], c[1] - r * 1.05], [c[0] + r * 1.75, c[1] + r * .25], [c[0], c[1] + r * .38]], { wash: '#E6CF9A', ink: PAL.ink, sw, curv: .15 });
    inkL([[c[0] - r * .9, c[1] - r * .15], [c[0] + r * .9, c[1] - r * .15]], sw * .6, '#B59A62', 'inkfine', .3);
  } else if (hat === 'helmet') {
    pnt([[hc[0] - r * 1.05, hc[1] - r * .25], [hc[0] - r * .9, hc[1] - r * .9], [hc[0] + r * .1, hc[1] - r * 1.2], [hc[0] + r * 1.0, hc[1] - r * .8], [hc[0] + r * 1.35, hc[1] - r * .3]], { wash: '#E8AA38', ink: PAL.ink, sw, curv: .6 });
  }

  // ---- tay gần + đồ cầm tay
  limb(near, B.aw * 1.02, B.aw * .82, pal.coat, 'an');
  const hp = near[2];
  if (o.hold === 'book') { boilSeed(key + 'book'); pnt([[hp[0] - .2, hp[1] - 1.5], [hp[0] + 1.3, hp[1] - 1.6], [hp[0] + 1.35, hp[1] + .1], [hp[0] - .15, hp[1] + .2]], { wash: '#F4ECDC', ink: PAL.ink, sw, curv: .2 }); pnt(rectPts(hp[0] + .1, hp[1] - 1.2, .9, .7, .03), { wash: '#8FB3C9', washOp: 160, ink: null }); }
  if (o.hold === 'brush') { boilSeed(key + 'brush'); inkL([[hp[0], hp[1]], [hp[0] + .5, hp[1] - 1.1]], .12, '#6B4A2E', 'ink', 0); pnt(ellPts(hp[0] + .55, hp[1] - 1.2, .09, .2, 8), { wash: o.brushCol || '#D9622B', ink: null }); }
  if (o.hold === 'bag') { boilSeed(key + 'bag'); pnt(rrPts(-1.4, P(T - .8, 0)[1] - .2, 1.1, 1.6, .3), { wash: '#6F7FA0', ink: PAL.ink, sw }); }
  hand(hp, pal.skin, 'hn');
  if (o.hold === 'umbrella') {
    boilSeed(key + 'umb');
    const top = [hp[0] + .25, hp[1] - 3.2], R = o.body === 'child' ? 2.6 : 3.3;
    inkL([hp, top], .09, PAL.ink, 'inkfine', 0);
    const um = []; for (let i = 0; i <= 12; i++) { const a = Math.PI + i / 12 * Math.PI; um.push([top[0] + Math.cos(a) * R, top[1] + .3 + Math.sin(a) * R * .6]); }
    for (let i = 6; i >= 0; i--) um.push([top[0] - R + i / 6 * 2 * R, top[1] + .3 + .25 * Math.sin(i * Math.PI)]);
    pnt(um, { wash: o.umbrella || '#2F3C7A', ink: PAL.ink, sw, curv: .3 });
  }
  boilSeed(key + '-done');
  return { hand: Wp(hp), head: Wp(hc), top: Wp([hc[0], hc[1] - r]) };
}

// Cô bé áo mưa cam (dáng trẻ con mặc định)
function girl(x, y, u, o = {}) { return person(x, y, u, { body: 'child', pal: ORANGE, outfit: 'coat', hair: 'bob', hat: 'hood', ...o, key: o.key || 'girl' }); }
