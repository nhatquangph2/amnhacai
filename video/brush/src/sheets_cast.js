// Bảng nhân vật: node render.mjs --loop=cast --sheet=0.1,0.5 …
LOOPS.cast = t => {
  paint(rectPts(-50, -50, W + 100, H + 100), { wash: '#EFE6D6', ink: null });
  inkLine([[0, 900], [W, 900]], 1, PAL.ink);
  const U = 25, g = 900;
  girl(150, g, U, { hood: 1, walk: t * 7 });
  girl(330, g, U, { hood: 0, eyes: 'happy', smile: 1 });
  person(560, g, U, { body: 'teen', pal: { ...ORANGE, coat: '#D9622B' }, outfit: 'coat', hair: 'pony', hold: 'book', walk: t * 6, key: 'teen' });
  person(820, g, U, { body: 'adult', pal: { coat: '#B55A36', pants: '#3A3634', shoe: '#5A4032', skin: '#EFC4A0', hair: '#2B2233' }, outfit: 'coat', hair: 'bun', hold: 'umbrella', umbrella: '#2F3C7A', key: 'mom' });
  person(1080, g, U, { body: 'adult', pal: { coat: '#6B5236', pants: '#3A2F26', shoe: '#3A2F26', skin: '#D9A27C', hair: '#1C1715' }, outfit: 'dress', hat: 'non', hold: 'pole', walk: t * 5, key: 'vw' });
  person(1330, g, U, { body: 'adult', pal: { coat: '#4A3A2C', pants: '#4A3A2C', shoe: '#3A2F26', skin: '#C99A74', hair: '#1C1715' }, outfit: 'shirt', hat: 'non', hair: 'short', walk: t * 5 + 1, key: 'vm', flip: true });
  person(1560, g, U, { body: 'old', pal: { coat: '#8A5A44', pants: '#3A3634', shoe: '#3A2F26', skin: '#EBC0A0', hair: '#D9D6D0' }, outfit: 'coat', hair: 'bun', smile: .8, key: 'old' });
  person(1780, g, U, { body: 'child', pal: { coat: '#5E7FA8', pants: '#3A3F5C', shoe: '#6B4A2E', skin: '#E8B894', hair: '#1C1715' }, outfit: 'shirt', hair: 'short', walk: t * 8, key: 'kid', flip: true });
};
LOOPS.cast.len = 2;
