
const HERO_F = 32;
const HERO_X0 = 8;
const HERO_Y0 = 3;
const HERO_HIP = 22;
const HERO_FOOT = 29;
const HERO_SHOULDER = [18, 15];
const HERO_INK = [12, 10, 16];

const HERO_GUNS = {
  pistol: ['.......lllllll.', 'aaaaahhgggGgggx', 'AAAAAhhGgGGGGG.', '.......ww......', '.......Ww......'],
  revolver: ['.......llllllll.', 'aaaaahhgGgggggggx', 'AAAAAhhgGGG......', '.......ww........', '.......Ww........'],
  usp: ['.......xllllll', 'aaaaahhgggggGgl', 'AAAAAhhGGGGGG.', '.......GG.....', '.......GG.....'],
  auto9: ['.......xlllllllll', 'aaaaahhgggggggggGgl', 'AAAAAhhGGGGgGG.....', '.......GG..........', '.......GG..........'],
  shotgun: ['......wwglllllllllllx', 'aaaaahhwwwgggggggggggg', 'AAAAAhhW..WWWWWGGGG..', '.........wwww........'],
  mg: ['....wwwglllllllllllll', 'aaaaahhwwwgggggggGgggggx', 'AAAAAhhWW.GGGg.....G...', '.........G.yy......G...', '..........yy......G.G..'],
  minigun: ['......lllllllllllllx', 'aaaaahhGgGgGgGgGgGgGgx', 'AAAAAhhgggggggggggggl', '......GGG.yy.........', '.........yy..........', '..........y..........'],
  pulse: ['.....gggggggggggggggg', 'aaaaahhglllllllllllgGx', 'AAAAAhhggGGGGGGGGGGg..', '.......gGGGGGGGr......', '........GG............'],
  dual: ['.......lllllll.', 'aaaaahhgggGgggx', 'AAAAAhhGgGGGGG.', '.......lllllll.', '.......gggGgggx', '.......GG......'],
  repulsor: ['.......hhc.', 'aaaaahhhhcC', 'AAAAAhhhhc.'],
  batarang: ['........k..k', 'aaaaahh.kkkk', 'AAAAAhh..kk.'],
  whip: ['........WWW', 'aaaaahhwW..W', 'AAAAAhhw....W'],
  saber: ['.......cccccccccccc', 'aaaaahhlCCCCCCCCCCCC', 'AAAAAhhgcccccccccccc'],
};
const HERO_SIGS = {
  shotgun:  { name: 'SHOTGUN', type: 'bullet', rate: 0.55, dmg: 14, speed: 1300, spread: 0.22, count: 9, life: 0.4, sfx: 'shotgun' },
  minigun:  { name: 'MINIGUN', type: 'bullet', rate: 0.035, dmg: 9, speed: 1700, spread: 0.09, count: 1, sfx: 'smg' },
  auto9:    { name: 'AUTO-9', type: 'bullet', rate: 0.09, dmg: 16, speed: 1800, spread: 0.02, count: 1, sfx: 'pistol' },
  usp:      { name: 'USP', type: 'bullet', rate: 0.13, dmg: 24, speed: 1900, spread: 0.008, count: 1, sfx: 'pistol' },
  dual:     { name: 'GUN KATA', type: 'dual', rate: 0.07, dmg: 14, speed: 1800, spread: 0.05, count: 2, sfx: 'pistol' },
  pulse:    { name: 'PULSE RIFLE', type: 'bullet', rate: 0.06, dmg: 13, speed: 1700, spread: 0.04, count: 1, sfx: 'smg' },
  m60:      { name: 'M60', type: 'bullet', rate: 0.07, dmg: 15, speed: 1600, spread: 0.06, count: 1, sfx: 'smg' },
  beretta:  { name: 'BERETTA', type: 'bullet', rate: 0.16, dmg: 20, speed: 1700, spread: 0.012, count: 1, sfx: 'pistol' },
  repulsor: { name: 'REPULSOR', type: 'rail', rate: 0.4, dmg: 55, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#9ff6ff' },
  batarang: { name: 'BATARANG', type: 'boomerang', rate: 0.5, dmg: 34, speed: 900, spread: 0, count: 1, sfx: 'throw' },
  whip:     { name: 'WHIP', type: 'melee', rate: 0.42, dmg: 42, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 120, arc: 0.5, col: '#8a5a32' },
  saber:    { name: 'LIGHTSABER', type: 'melee', rate: 0.28, dmg: 70, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 70, arc: 1.1, col: '#80ff90' },
};
const GUN_COLS = { g: '#4a4d57', G: '#24252b', l: '#80858f', x: '#c9ced8', w: '#8a5a32', W: '#5a381e', y: '#d8b048', k: '#141418', c: '#c8fcff', C: '#5fd8f0', r: '#e04030' };

const HEROES = [
  {
    id: 'jellinator', name: 'Jellinator', role: 'T-800 (The Terminator)',
    pal: { h: '#3a2a20', s: '#d8a07a', S: '#a8724e', k: '#141418', r: '#ff3020', q: '#8a4a3a', j: '#2c2a30', J: '#16151a', g: '#8c8e98' },
    upper: [
      '...hhhhhhhh.....',
      '..hhhhhhhhhh....',
      '..hsssssssssS...',
      '..hssssssssss...',
      '..hkmkkkkmkkS....',
      '..hskkkskkksS...',
      '..SsssssssSsS...',
      '..SsssqqqqsS....',
      '...SsssssSSS....',
      '....SSSSSS......',
      '.....SSS........',
      '.jjjjggggjjjj...',
      'jjjjjggggjjjjj..',
      'jjJjjggggjjJjj..',
      'jjJjjggggjjJjj..',
      'jJJjjggggjjJJj..',
      'jJjjjggggjjjJj..',
      '.JjjjggggjjjJ...',
      '.JJjjggggjjJJ...',
    ],
    legs: { pants: '#2c2a30', pantsD: '#16151a', boots: '#141418', bootsD: '#0a0a0c' },
    arm: { a: '#2c2a30', A: '#16151a', h: '#d8a07a', H: '#a8724e' }, gun: 'minigun', sig: 'minigun',
  },
  {
    id: 'robojelly', name: 'RoboJelly', role: 'RoboCop / Alex Murphy',
    pal: { a: '#b8c4d8', A: '#7a86a0', v: '#1a1c26', s: '#e0a888', S: '#b07a5a', q: '#8a4a3a' },
    upper: [
      '...aaaaaaaa.....',
      '..aaaaaaaaaa....',
      '..aaaaaaaaaaA...',
      '..avvvvvvvvvA...',
      '..avvvvvvvvvA...',
      '..aaaassssssA...',
      '..AaasssssssA...',
      '..AaassqqqssA...',
      '...AasssssSA....',
      '....AAAAAAA.....',
      '....aAAAAa......',
      'aaaaaaaaaaaaaa..',
      'aAaaaaaaaaaaAa..',
      'aAaaAAaaAAaaAa..',
      'aAaaaaaaaaaaAa..',
      'AAaaAAAAAAaaAA..',
      'AAaaaaaaaaaaAA..',
      '.AaaaaaaaaaaA...',
      '.AAAAAAAAAAAA...',
    ],
    legs: { pants: '#b8c4d8', pantsD: '#7a86a0', boots: '#5a6680', bootsD: '#3a4458', knee: '#7a86a0' },
    arm: { a: '#b8c4d8', A: '#7a86a0', h: '#7a86a0', H: '#5a6680' }, gun: 'auto9', sig: 'auto9',
  },
  {
    id: 'johnjick', name: 'John Jick', role: 'John Wick',
    pal: { h: '#1c1814', s: '#d8a07a', S: '#a8724e', k: '#141418', b: '#2a221c', q: '#7a3a2c', j: '#24242c', J: '#121218', w: '#f0f0f4', t: '#141418' },
    upper: [
      '...hhhhhhhh.....',
      '..hhhhhhhhhh....',
      '.hhhssssssshh...',
      '.hhsssssssssh...',
      '.hhwksswkssS....',
      '.hhssssssssS....',
      '.hhbsssssbbS....',
      '.hhbbbqqbbbb....',
      '.hh.bbbbbbb.....',
      '.h...bbbbb......',
      '.....SSS........',
      '.jjjjwwtwwjjj...',
      'jjjjjwwtwwjjjj..',
      'jjJjjjwtwjjjJj..',
      'jjJjjjwtwjjjJj..',
      'jJJjjjjtjjjjJj..',
      'jJjjjjjjjjjjJj..',
      '.JjjjjjjjjjjJ...',
      '.JJjjjjjjjjJJ...',
    ],
    legs: { pants: '#24242c', pantsD: '#121218', boots: '#141418', bootsD: '#0a0a0c' },
    arm: { a: '#24242c', A: '#121218', h: '#d8a07a', H: '#a8724e' }, gun: 'usp', sig: 'usp',
  },
  {
    id: 'anderfin', name: 'Mr. Anderfin', role: 'Neo / Thomas Anderson (The Matrix)',
    pal: { h: '#141418', s: '#e2b090', S: '#b07c5c', k: '#0a0a0c', q: '#8a4a3a', c: '#1e2024', C: '#0e0f12', g: '#3a4a3c' },
    upper: [
      '...hhhhhhhh.....',
      '..hhhhhhhhhh....',
      '..hhsssssssh....',
      '..hsssssssss....',
      '..hkmkkkkmkkk....',
      '..hskkksskkkS...',
      '..hSssssssSS....',
      '...SssqqsssS....',
      '...SssssssSS....',
      '....SSSSSS......',
      '...cccSSccc.....',
      '.ccccccccccccc..',
      'cccccccgcccccc..',
      'ccCcccccgcccCc..',
      'ccCcccccccccCc..',
      'cCCcccccccccCc..',
      'cCcccccccccccCc.',
      'cCcccccccccccCc.',
      'cCCccccccccccCC.',
      'cCc..........Cc.',
      'cC............Cc',
      'C..............C',
    ],
    legs: { pants: '#1e2024', pantsD: '#0e0f12', boots: '#0a0a0c', bootsD: '#050506' },
    arm: { a: '#1e2024', A: '#0e0f12', h: '#e2b090', H: '#b07c5c' }, gun: 'dual', sig: 'dual',
  },
  {
    id: 'ripfin', name: 'Ellen Ripfin', role: 'Ellen Ripley (Alien)',
    pal: { h: '#5a3420', H: '#3a2014', s: '#e8b48e', S: '#b8845e', k: '#1c140e', q: '#a85a4a', t: '#8a8c78', T: '#5e604e' },
    upper: [
      '..hhhhhhhh......',
      '.hhHhhhhhhh.....',
      'hhhhssssshhh....',
      'hhhssssssssh....',
      'hhhwkswksssh....',
      'hhhssssssssS....',
      'hhHSsssssSS.....',
      'hhh.SsqqsS......',
      'hHh..SssS.......',
      'hh....SS........',
      '.....SSS........',
      '.ssttttttttss...',
      'ssstttttttttss..',
      'ssSttttttttTss..',
      'sSStttttttttTs..',
      'sStttttttttTTs..',
      'sStttttttttTSs..',
      '.SttttttttTTS...',
      '..TTTTTTTTTT....',
    ],
    legs: { pants: '#6a6448', pantsD: '#4a4632', boots: '#2e2a24', bootsD: '#1c1a16' },
    arm: { a: '#e8b48e', A: '#b8845e', h: '#e8b48e', H: '#b8845e' }, gun: 'pulse', sig: 'pulse',
  },
  {
    id: 'ramjelly', name: 'Ramjelly', role: 'John Rambo',
    pal: { h: '#1e1814', b: '#d0242c', B: '#8e1820', s: '#c88a5a', S: '#9a6440', k: '#1a1210', q: '#7a3428', y: '#d8b048', l: '#4a3a28' },
    upper: [
      '...hhhhhhh......',
      '..hhhhhhhhh.....',
      'bbbbbbbbbbbh....',
      'B.hssssssshh....',
      'B.hswkswksSh....',
      '.Bhssssssssh....',
      '..hSsssssSSh....',
      '..hSsqqqsSSh....',
      '..hhSssssSh.....',
      '..hh.SSSS.h.....',
      '..h...SS........',
      '..ssssssssss....',
      '.sssysssssssS...',
      '.ssssyssssSsS...',
      '.sSsssysssSsS...',
      '.sSssssysSssS...',
      '.sSsssssySssS...',
      '..SSssssSySS....',
      '..llllllllll....',
    ],
    legs: { pants: '#5c6638', pantsD: '#3e4626', boots: '#2e2620', bootsD: '#1c1814' },
    arm: { a: '#c88a5a', A: '#9a6440', h: '#c88a5a', H: '#9a6440' }, gun: 'mg', sig: 'm60',
  },
  {
    id: 'mcjelly', name: 'John McJelly', role: 'John McClane (Die Hard)',
    pal: { h: '#5a3c24', s: '#d8a07e', S: '#a8724e', k: '#1a1410', z: '#9a7a62', q: '#8a3a2c', w: '#ece6d6', W: '#b8ae94', d: '#9a8a6a' },
    upper: [
      '...hhhhhhh......',
      '..hhhhhhhhh.....',
      '..hssssssshh....',
      '..sssssssssh....',
      '..swkswksssS....',
      '..sssssssssS....',
      '..szzzzzzzSS....',
      '..szzqqqzzS.....',
      '...zzzzzzz......',
      '....SSSSS.......',
      '.....SSS........',
      '.ssswwwwwwsss...',
      'sssswwwwwwwsss..',
      'ssSswwwdwwwsSs..',
      'sSSswwwwwwwsSs..',
      'sSsswwwwwdwsSs..',
      'sS.swwwwwwws.S..',
      '...WwwwwwwwW....',
      '...WWwwwwwWW....',
    ],
    legs: { pants: '#3e4250', pantsD: '#262934', boots: '#d8a07e', bootsD: '#a8724e' },
    arm: { a: '#d8a07e', A: '#a8724e', h: '#d8a07e', H: '#a8724e' }, gun: 'pistol', sig: 'beretta',
  },
  {
    id: 'ironjelly', name: 'Iron Jelly', role: 'Tony Stark / Iron Man',
    pal: { r: '#d0242e', R: '#8c141e', g: '#f0c050', G: '#b08028', c: '#c8fcff', w: '#ffffff' },
    upper: [
      '...rrrrrrrr.....',
      '..rrrrrrrrrr....',
      '..rrggggggrrR...',
      '..rggggggggrR...',
      '..rgcccgcccgR...',
      '..rggggggggrR...',
      '..RgGggggGgRR...',
      '..RggGGGGggR....',
      '...RggggggR.....',
      '....RRRRRR......',
      '.....RRR........',
      'gggrrrrrrrrggg..',
      'ggrrrrrrrrrrgg..',
      'grrrrrcccrrrrg..',
      'rrrrrcwwcrrrrR..',
      'rRrrrrcccrrrrR..',
      'rRrrrrrrrrrrRR..',
      '.RrgrrrrrrgrR...',
      '.RRggggggggRR...',
    ],
    legs: { pants: '#d0242e', pantsD: '#8c141e', boots: '#f0c050', bootsD: '#b08028', knee: '#f0c050' },
    arm: { a: '#d0242e', A: '#8c141e', h: '#f0c050', H: '#b08028' }, gun: 'repulsor', sig: 'repulsor',
  },
  {
    id: 'batjelly', name: 'Batjelly', role: 'Bruce Wayne / Batman',
    pal: { c: '#2c2e38', C: '#16171e', g: '#7e8290', G: '#555866', y: '#f2c63c', k: '#141418', w: '#ffffff', s: '#d8a07a', q: '#8a4a3a', S: '#a8724e' },
    upper: [
      '..c......c......',
      '..cc....cc......',
      '..cccccccccc....',
      '..ccccccccccC...',
      '..ccwwccwwccC...',
      '..cccccccccC....',
      '..cccssssssC....',
      '..CcsssqqssC....',
      '..Cc.ssssss.....',
      '..CC..SSSS......',
      'CC...cccc.......',
      'CCcgggggggggc...',
      'CcggggyyyggggC..',
      'CcgggykkkyggGC..',
      'CcggggyyyggggC..',
      'CcGgggggggggGC..',
      'CcGgggggggggGC..',
      'Cc.yyyyyyyyy....',
      'Cc..gggggggg....',
      'Cc..............',
      'C...............',
    ],
    legs: { pants: '#7e8290', pantsD: '#555866', boots: '#2c2e38', bootsD: '#16171e' },
    arm: { a: '#7e8290', A: '#555866', h: '#2c2e38', H: '#16171e' }, gun: 'batarang', sig: 'batarang',
  },
  {
    id: 'batjelly-tdk', variantOf: 'batjelly', name: 'Batjelly', tag: 'The Dark Knight', role: 'Batman - The Dark Knight trilogy',
    match: { tmdbCollections: ['263'], tmdb: ['272', '155', '49026'] },
    pal: { c: '#1c1d22', C: '#0c0c10', a: '#34363e', A: '#222329', k: '#0a0a0c', w: '#e8e8ec', s: '#d8a07a', S: '#a8724e', q: '#8a4a3a', y: '#8a7440', Y: '#5e4e2a' },
    upper: [
      '...c....c.......',
      '..cc...cc.......',
      '..cccccccccc....',
      '..ccccccccccC...',
      '..cckkcckkccC...',
      '..cccccccccC....',
      '..cCcssssssC....',
      '..CcsssqqssC....',
      '..CcCssssssC....',
      '..CCC.SSSS......',
      'CC..aaaaaa......',
      'CCaaaaaaaaaaa...',
      'CcaAaaakaaaAaC..',
      'CcaaakkkkkaaaC..',
      'CcAaaaakaaaaAC..',
      'CcaAaAaaaAaAaC..',
      'CcAaaaaaaaaaAC..',
      'Cc.yYyYyYyYy....',
      'Cc..aaaaaaaa....',
      'Cc..............',
      'CC..............',
      'C...............',
    ],
    legs: { pants: '#2a2c32', pantsD: '#18191e', boots: '#121216', bootsD: '#08080a', knee: '#3a3c44' },
    arm: { a: '#2a2c32', A: '#18191e', h: '#121216', H: '#08080a' }, gun: 'batarang', sig: 'batarang',
  },
  {
    id: 'indianafins', name: 'Indiana Fins', role: 'Indiana Jones',
    pal: { f: '#8a6440', F: '#5e4228', b: '#3a281a', s: '#d8a07a', S: '#a8724e', k: '#1a1410', z: '#9a7a62', q: '#8a3a2c', j: '#7a4e2c', J: '#52331c', t: '#c8b48a', T: '#9a8862', l: '#5a3c22' },
    upper: [
      '....ffffff......',
      '...ffffffff.....',
      '...bbbbbbbb.....',
      'ffffffffffffff..',
      '...ssssssssS....',
      '...swkswksSS....',
      '...ssssssssS....',
      '...szzzzzzSS....',
      '...szzqqzzS.....',
      '....zzzzzz......',
      '.....SSS........',
      '.jjjjtttttjjj...',
      'jjjjjttlttjjjj..',
      'jjJjjtltttjjJj..',
      'jjJjjltttTjjJj..',
      'jJJjltttTTjjJj..',
      'jJjltttttTjjJj..',
      '.JjttttttTTjJ...',
      '..bbbbbbbbbb....',
    ],
    legs: { pants: '#b8a47a', pantsD: '#8a7852', boots: '#5a3c22', bootsD: '#3a2614' },
    arm: { a: '#7a4e2c', A: '#52331c', h: '#d8a07a', H: '#a8724e' }, gun: 'whip', sig: 'whip',
  },
];

const heroHex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
function heroGrid(w, h) { return { w: w, h: h, c: new Array(w * h).fill(null) }; }
function heroPx(grid, x, y, col) { x |= 0; y |= 0; if (col && x >= 0 && y >= 0 && x < grid.w && y < grid.h) grid.c[y * grid.w + x] = col; }
function heroRect(grid, x, y, w, h, col) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) heroPx(grid, x + i, y + j, col); }
function heroArt(grid, rows, pal, ox, oy) {
  rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const k = row[i]; if (k !== '.' && pal[k]) heroPx(grid, ox + i, oy + j, pal[k]); } });
}
function heroPal(obj) { const palette = {}; for (const k in obj) palette[k] = heroHex(obj[k]); return palette; }
function heroFillGaps(grid, yMax) {
  for (let pass = 0; pass < 6; pass++) {
    let changed = false;
    const out = grid.c.slice();
    for (let y = 0; y < Math.min(yMax, grid.h); y++) for (let x = 0; x < grid.w; x++) {
      if (grid.c[y * grid.w + x]) continue;
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => (x + dx >= 0 && y + dy >= 0 && x + dx < grid.w && y + dy < grid.h ? grid.c[(y + dy) * grid.w + x + dx] : null)).filter(Boolean);
      if (n.length < 3) continue;
      const cnt = new Map(); let best = n[0], bestVotes = 0;
      for (const color of n) { const k = color.join(','); const votes = (cnt.get(k) || 0) + 1; cnt.set(k, votes); if (votes > bestVotes) { bestVotes = votes; best = color; } }
      out[y * grid.w + x] = best; changed = true;
    }
    grid.c = out;
    if (!changed) break;
  }
}
function heroInk(grid) {
  const out = grid.c.slice();
  for (let y = 0; y < grid.h; y++) for (let x = 0; x < grid.w; x++) {
    if (grid.c[y * grid.w + x]) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < grid.w && ny < grid.h && grid.c[ny * grid.w + nx]) { out[y * grid.w + x] = HERO_INK; break; }
    }
  }
  grid.c = out;
}

function heroBody(hero, pose) {
  const grid = heroGrid(HERO_F, HERO_F), legKit = hero.legs, oy = pose.bob;
  const pal = heroPal(hero.pal);
  const upper = hero.upper.slice(0, 19), tail = hero.upper.slice(19);
  if (!legKit.none) pose.legs.forEach(([dx, lift], i) => {
    const x = HERO_X0 + (i === 0 ? 3 : 8);
    const pantsColor = heroHex(i === 0 ? legKit.pantsD : legKit.pants), bootColor = heroHex(i === 0 ? legKit.bootsD : legKit.boots);
    const tdx = Math.round(dx / 2);
    heroRect(grid, x + tdx, HERO_HIP + oy, 4, 3, pantsColor);
    heroRect(grid, x + dx, HERO_HIP + 3 + oy - lift, 4, 3 - Math.min(lift, 1), pantsColor);
    if (legKit.knee) heroRect(grid, x + tdx + 1, HERO_HIP + 2 + oy, 2, 1, heroHex(legKit.knee));
    heroRect(grid, x + dx, HERO_FOOT - 1 - lift + Math.min(oy, 0), 5, 2, bootColor);
  });
  heroArt(grid, upper, pal, HERO_X0, HERO_Y0 + oy);
  if (hero.top) heroArt(grid, hero.top, pal, HERO_X0, HERO_Y0 + oy - hero.top.length);
  if (hero.top) heroArt(grid, hero.top, pal, HERO_X0, HERO_Y0 + oy - hero.top.length);
  heroFillGaps(grid, HERO_HIP + oy);
  if (tail.length) heroArt(grid, tail, pal, HERO_X0, HERO_Y0 + 19 + oy);
  grid.bob = oy;
  return grid;
}
function heroGun(hero, recoil) {
  const art = HERO_GUNS[hero.gun] || HERO_GUNS.pistol;
  const w = Math.max(...art.map((row) => row.length)) + 2, grid = heroGrid(w, art.length);
  const pal = heroPal(Object.assign({}, GUN_COLS, hero.arm));
  heroArt(grid, art, pal, -(recoil || 0) + 1, 0);
  grid.pivot = [1, 1];
  return grid;
}
function heroWalkPose(i, stride) {
  const angle = (i / 8) * Math.PI * 2, sine = Math.sin(angle), cosine = Math.cos(angle);
  return { bob: Math.abs(sine) > 0.7 ? 0 : 1, legs: [[Math.round(-sine * stride), cosine < -0.3 ? 2 : 0], [Math.round(sine * stride), cosine > 0.3 ? 2 : 0]] };
}
function heroFrame(hero, pose, recoil) {
  const body = heroBody(hero, pose), gun = heroGun(hero, recoil);
  const ox = HERO_SHOULDER[0] - gun.pivot[0], oy = HERO_SHOULDER[1] + pose.bob - gun.pivot[1];
  const width = HERO_F + 16, out = heroGrid(width, HERO_F);
  for (let y = 0; y < HERO_F; y++) for (let x = 0; x < HERO_F; x++) out.c[y * width + x] = body.c[y * HERO_F + x];
  for (let y = 0; y < gun.h; y++) for (let x = 0; x < gun.w; x++) { const color = gun.c[y * gun.w + x]; if (color) heroPx(out, ox + x, oy + y, color); }
  heroInk(out);
  return out;
}
function buildHero(hero) {
  const idle = heroFrame(hero, { bob: 0, legs: [[0, 0], [0, 0]] }, 0);
  const walk = []; for (let i = 0; i < 8; i++) walk.push(heroFrame(hero, heroWalkPose(i, 3), 0));
  const jump = heroFrame(hero, { bob: -1, legs: [[-1, 2], [2, 1]] }, 0);
  const fire = heroFrame(hero, { bob: 0, legs: [[0, 0], [0, 0]] }, 2);
  return { idle, walk, jump, fire };
}

function heroArmArt(hero) {
  const grid = heroGrid(9, 3), pal = heroPal(hero.arm);
  heroArt(grid, ['.......', 'aaaaahh', 'AAAAAhh'], pal, 1, 0);
  grid.pivot = [1, 1]; grid.hand = [7, 1];
  return grid;
}
function buildHeroSprites(hero) {
  const ink = (grid) => { const w = heroGrid(grid.w + 2, grid.h + 2); for (let y = 0; y < grid.h; y++) for (let x = 0; x < grid.w; x++) w.c[(y + 1) * w.w + x + 1] = grid.c[y * grid.w + x]; heroInk(w); w.bob = grid.bob; w.pivot = grid.pivot && [grid.pivot[0] + 1, grid.pivot[1] + 1]; w.hand = grid.hand && [grid.hand[0] + 1, grid.hand[1] + 1]; return w; };
  const body = (pose) => ink(heroBody(hero, pose));
  const walk = []; for (let i = 0; i < 8; i++) walk.push(body(heroWalkPose(i, 3)));
  return {
    id: hero.id, name: hero.name, sig: Object.assign({}, HERO_SIGS[hero.sig] || HERO_SIGS.usp),
    idle: body({ bob: 0, legs: [[0, 0], [0, 0]] }), walk: walk,
    jump: body({ bob: -1, legs: [[-1, 2], [2, 1]] }),
    gun: ink(heroGun(hero, 0)), arm: ink(heroArmArt(hero)),
    shoulder: [HERO_SHOULDER[0] + 1, HERO_SHOULDER[1] + 1], foot: HERO_FOOT + 1, cx: HERO_X0 + 8 + 1,
  };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { HEROES, HERO_SIGS, buildHero, buildHeroSprites, HERO_F };
