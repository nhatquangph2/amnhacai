// girl.js: cô bé áo mưa cam — nhân vật chính của "Câu chuyện tảng đá", vẽ tay bằng p5.brush.
// Nhìn nghiêng, quay mặt sang phải (flip: true để quay trái). Dựng bằng khớp (hông → gối → cổ chân, vai → khuỷu → tay)
// nên mọi dáng đều liền một khối và có cử động theo nguyên tắc hoạt hình (đi, ngồi xổm, ngồi, nhảy).
//
// girl(x, y, u, o): (x, y) = điểm chạm đất giữa hai chân (khi ngồi: điểm hông trên mặt ngồi); u = đơn vị (cao ≈ 10u).
//   o.walk   pha bước (radian) — đi bộ; null = đứng
//   o.crouch 0..1 ngồi xổm        o.sit 0..1 ngồi (y là mặt ngồi)    o.swing pha đung đưa chân khi ngồi
//   o.lean   nghiêng người (+ = về trước)   o.dy nhấc cả người (u, âm = lên)   o.sq co giãn (+ = bẹp)
//   o.reach  0..1 với tay trước chạm vào vật   o.reachTo [x, y] điểm tay chạm (toạ độ thế giới)
//   o.hood   0..1 mũ trùm       o.lookUp −1..1 ngẩng/cúi   o.eyes 'dot' | 'happy' | 'closed' | 'wide'   o.smile 0..1
//   o.blush 0..1   o.key  khoá boil riêng (mặc định 'girl')
const GIRL = {
  coat: '#D9622B', coatDk: '#A8471C', coatLt: '#F2945C', skin: '#F2C9A5', skinDk: '#D9A27C', hair: '#2B2233',
  pants: '#3B3F5C', pantsDk: '#2A2D45', boot: '#E8AA38', bootDk: '#B98320', cheek: '#E88A8A'
};

function girl(x, y, u, o = {}) {
  const f = o.flip ? -1 : 1, sq = o.sq || 0, key = o.key || 'girl';
  const crouch = clamp(o.crouch || 0), sit = clamp(o.sit || 0), reach = clamp(o.reach || 0);
  const walking = o.walk != null && !sit && crouch < .5;
  const wp = o.walk || 0;

  // ---- khung xương (đơn vị u, gốc = chân, y âm = lên, x dương = phía trước)
  const L1 = 1.2, L2 = 1.15;
  const bob = walking ? -Math.abs(Math.cos(wp)) * .18 : 0;
  let hip = [lerp(0, -.3, crouch), lerp(-2.45, -1.05, crouch) + bob + (o.dy || 0)];
  if (sit) hip = [0, (o.dy || 0)];
  const lean = (o.lean || 0) + crouch * .35 - sit * .08 + (walking ? .08 : 0);

  // chân: góc đùi a (từ phương thẳng đứng xuống, + = về trước), gập gối b
  const legAng = i => {
    if (sit) { const sw = .22 * Math.sin((o.swing || 0) + i * 2.4); return [Math.PI / 2 - .12, Math.PI / 2 - .1 + sw]; }
    if (crouch > 0 && !walking) return [lerp(0, 1.3 + i * .08, crouch), lerp(0, 2.3 + i * .05, crouch)];
    if (walking) { const p = wp + i * Math.PI; return [.45 * Math.sin(p), .95 * Math.max(0, -Math.cos(p)) + .08]; }
    return [i ? -.05 : .06, .05];
  };
  const legPts = i => {
    const [a, b] = legAng(i), k = [hip[0] + L1 * Math.sin(a), hip[1] + L1 * Math.cos(a)];
    const c = a - b, an = [k[0] + L2 * Math.sin(c), k[1] + L2 * Math.cos(c)];
    return [hip, k, an];
  };
  // thân: trục từ hông lên cổ
  const up = [Math.sin(lean), -Math.cos(lean)], fw = [Math.cos(lean), Math.sin(lean)];
  const P = (s, w) => [hip[0] + up[0] * s + fw[0] * w, hip[1] + up[1] * s + fw[1] * w];
  const neck = P(2.3, 0), shoulder = P(2.0, .05);
  // tay: góc cánh tay trên + gập khuỷu (từ phương thẳng xuống, + = về trước)
  const armPts = (i) => {
    let a, b;
    if (walking) { a = -.55 * Math.sin(wp + i * Math.PI) + .1; b = .35; }
    else if (sit) { a = i ? .15 : -.25; b = .5; }
    else { a = lerp(.08 + (i ? .05 : 0), .35, crouch); b = lerp(.25, .6, crouch); }
    const e = [shoulder[0] + 1.0 * Math.sin(a), shoulder[1] + 1.0 * Math.cos(a)];
    let h = [e[0] + .9 * Math.sin(a + b), e[1] + .9 * Math.cos(a + b)];
    return [shoulder, e, h];
  };

  // Toạ độ cục bộ (đơn vị u) → thế giới. Không dùng scale(): p5.brush không giãn khoảng cách chấm cọ theo scale,
  // nét sẽ đứt thành chấm. Độ dày nét (sw) tính theo u rồi nhân ra pixel.
  const Wp = p => [x + f * p[0] * u, y + p[1] * u * (1 - sq)];
  const pnt = (pts, o) => paint(pts.map(Wp), o.ink === null ? o : { ...o, sw: (o.sw ?? 1 / u) * u });
  const inkL = (pts, w, c, b, cv) => inkLine(pts.map(Wp), w * u, c, b, cv);
  const sw = 1.05 / u; // nét mực theo đơn vị (≈ 1 px thế giới)

  // tay gần với tới điểm reachTo (IK 2 đoạn, toạ độ thế giới → cục bộ)
  let near = armPts(0);
  if (reach > 0 && o.reachTo) {
    const tx = (o.reachTo[0] - x) / (f * u), ty = (o.reachTo[1] - y) / (u * (1 - sq));
    const s = shoulder, dx = tx - s[0], dy = ty - s[1], d = Math.min(Math.hypot(dx, dy), 2.5); // duỗi tay kiểu hoạt hình (tay thật 1.9u)
    const base = Math.atan2(dx, dy), bend = Math.acos(clamp((1 + d * d - .81) / (2 * 1 * Math.max(d, .01)), -1, 1));
    const aU = base - bend * .6, e = d > 1.85 ? [s[0] + dx / Math.hypot(dx, dy) * d * .52, s[1] + dy / Math.hypot(dx, dy) * d * .52] : [s[0] + Math.sin(aU), s[1] + Math.cos(aU)];
    const h = [s[0] + dx / Math.max(Math.hypot(dx, dy), .01) * d, s[1] + dy / Math.max(Math.hypot(dx, dy), .01) * d];
    near = [s, [lerp(near[1][0], e[0], reach), lerp(near[1][1], e[1], reach)], [lerp(near[2][0], h[0], reach), lerp(near[2][1], h[1], reach)]];
  }

  const limb = (pts, w0, w1, col, k) => { boilSeed(key + k); pnt(ribbon(pts, w0, w1), { wash: col, ink: PAL.ink, sw, curv: .5 }); };
  const boot = (an, kn, col, k) => {
    boilSeed(key + k);
    const a = an;
    pnt([[a[0] - .32, a[1] - .42], [a[0] + .18, a[1] - .45], [a[0] + .55, a[1] - .12], [a[0] + .62, a[1] + .08], [a[0] - .38, a[1] + .1]], { wash: col, ink: PAL.ink, sw, curv: .55 });
  };

  // ---- chân xa, tay xa (tối hơn)
  const lf = legPts(1), ln = legPts(0), af = armPts(1);
  limb(lf, .7, .6, GIRL.pantsDk, 'lf'); boot(lf[2], lf[1], GIRL.bootDk, 'bf');
  limb(af, .6, .48, GIRL.coatDk, 'af'); boilSeed(key + 'hf'); pnt(ellPts(af[2][0], af[2][1], .26, .26, 10), { wash: GIRL.skinDk, ink: PAL.ink, sw });
  // ---- chân gần
  limb(ln, .72, .62, GIRL.pants, 'ln'); boot(ln[2], ln[1], GIRL.boot, 'bn');

  // ---- áo mưa (một khối, loe ở gấu)
  boilSeed(key + 'coat');
  const hemF = lerp(1.55, 1.9, sit), hemB = lerp(-1.35, -1.1, sit), hemS = lerp(-.75, -.4, sit);
  const coat = [P(2.4, -.6), P(2.4, .55), P(1.8, .95), P(.4, 1.3), P(hemS, hemF), P(hemS - .12, .4), P(hemS - .08, -.5), P(hemS + .02, hemB), P(.5, -1.1), P(1.8, -.9)];
  pnt(coat, { wash: GIRL.coat, ink: PAL.ink, sw: sw * 1.1, curv: .55 });
  boilSeed(key + 'btn');
  inkL([P(2.1, .8), P(.9, 1.1), P(hemS + .1, hemF - .1)], sw * .8, GIRL.coatDk, 'inkfine', .5);
  for (let i = 0; i < 3; i++) { const b = P(1.8 - i * .6, .98 + i * .1); pnt(ellPts(b[0], b[1], .1, .1, 8), { wash: GIRL.coatDk, ink: null }); }

  // ---- đầu
  const lookUp = o.lookUp || 0;
  const hc = [neck[0] + .25 * (1 - crouch) + fw[0] * .1, neck[1] - 1.65 - lookUp * .1], r = 1.9;
  boilSeed(key + 'head');
  const hood = clamp(o.hood ?? 0);
  if (hood > .02) {
    // mũ trùm: một khối tròn bọc sau đầu (vẽ trước mặt), vành mũ ôm trán
    boilSeed(key + 'hood');
    const hx = hc[0] - r * .22 * hood, hy = hc[1] - r * .08;
    pnt(ellPts(hx, hy, r * 1.12, r * 1.08, 22), { wash: GIRL.coat, ink: PAL.ink, sw, curv: .6 });
  } else {
    // tóc sau gáy (tóc bob)
  pnt([[hc[0] - r * 1.05, hc[1] - r * .1], [hc[0] - r * .8, hc[1] - r * .85], [hc[0], hc[1] - r * 1.08], [hc[0] + r * .7, hc[1] - r * .85],
    [hc[0] + r * .3, hc[1] - r * .3], [hc[0] - r * .2, hc[1] + r * .25], [hc[0] - r * .55, hc[1] + r * .95], [hc[0] - r * 1.1, hc[1] + r * .75]], { wash: GIRL.hair, ink: PAL.ink, sw, curv: .6 });
  }
  // mặt
  pnt(ellPts(hc[0] + r * .12, hc[1] + r * .08, r * .92, r * .9, 20), { wash: GIRL.skin, ink: PAL.ink, sw, curv: .6 });
  // mái tóc
  pnt([[hc[0] - r * .55, hc[1] - r * .55], [hc[0] + r * .15, hc[1] - r * 1.02], [hc[0] + r * .95, hc[1] - r * .55], [hc[0] + r * .85, hc[1] - r * .18],
    [hc[0] + r * .35, hc[1] - r * .35], [hc[0] - r * .1, hc[1] - r * .2]], { wash: GIRL.hair, ink: PAL.ink, sw, curv: .5 });
  // mắt, má, miệng (nhìn nghiêng: một mắt phía trước)
  const ey = [hc[0] + r * .6, hc[1] + r * (.05 - lookUp * .18)];
  boilSeed(key + 'face');
  const eyes = o.eyes || 'dot';
  if (eyes === 'happy') inkL([[ey[0] - .26, ey[1] + .06], [ey[0], ey[1] - .2], [ey[0] + .26, ey[1] + .06]], sw * .9, PAL.ink, 'inkfine', .6);
  else if (eyes === 'closed') inkL([[ey[0] - .22, ey[1]], [ey[0], ey[1] + .1], [ey[0] + .22, ey[1]]], sw * .9, PAL.ink, 'inkfine', .6);
  else pnt(ellPts(ey[0], ey[1], eyes === 'wide' ? .19 : .15, eyes === 'wide' ? .27 : .22, 10), { wash: PAL.ink, ink: null });
  if (o.blush !== 0) pnt(ellPts(ey[0] - .1, ey[1] + .55, .32, .18, 10), { wash: GIRL.cheek, washOp: 120 * (o.blush ?? .8), ink: null });
  const sm = o.smile ?? .4, my = hc[1] + r * (.58 - lookUp * .15);
  inkL([[hc[0] + r * .62, my - sm * .05], [hc[0] + r * .78, my + sm * .12], [hc[0] + r * .95, my - sm * .08]], sw * .8, PAL.ink, 'inkfine', .6);

  // ---- vành mũ trùm ôm trán / cổ áo khi bỏ mũ
  boilSeed(key + 'brim');
  if (hood > .02) {
    const pts = [];
    for (let i = 0; i <= 12; i++) { const a = lerp(-.15, -2.35, i / 12); pts.push([hc[0] + r * .12 + Math.cos(a) * r * 1.0, hc[1] + r * .06 + Math.sin(a) * r * .98]); }
    for (let i = 12; i >= 0; i--) { const a = lerp(-.25, -2.3, i / 12); pts.push([hc[0] + r * .12 + Math.cos(a) * r * .8, hc[1] + r * .12 + Math.sin(a) * r * .78]); }
    pnt(pts, { wash: GIRL.coat, ink: PAL.ink, sw, curv: .5 });
  } else pnt(ellPts(neck[0] - .5, neck[1] - .15, .75, .4, 12), { wash: GIRL.coatDk, ink: PAL.ink, sw });

  // ---- tay gần + bàn tay
  limb(near, .62, .5, GIRL.coat, 'an');
  boilSeed(key + 'hn'); pnt(ellPts(near[2][0], near[2][1], .28, .28, 10), { wash: GIRL.skin, ink: PAL.ink, sw });
  boilSeed(key + '-done');
  // trả về vị trí bàn tay gần (thế giới) cho hiệu ứng chạm
  return { hand: [x + near[2][0] * f * u, y + near[2][1] * u * (1 - sq)] };
}
