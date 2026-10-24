
const SKIN = {
  light: ['#e0b088', '#b07a58'], fair: ['#ecc4a0', '#c0906c'], pale: ['#f0d4bc', '#c8a48a'], tan: ['#c8956a', '#96643e'],
  brown: ['#9a6844', '#6e4428'], dark: ['#6a4430', '#482c1c'], green: ['#6aa84a', '#467a2e'], olive: ['#7a8a46', '#56622e'],
  grey: ['#a8a8b0', '#78787f'], purple: ['#8a6aa8', '#5e4478'], white: ['#ecece8', '#b8b8b4'], red: ['#c84030', '#8a2a1e'],
  yellow: ['#f2d230', '#c8a818'],
  navi: ['#4a8ad8', '#2a5aa8'], drax: ['#7a8a8a', '#56625e'], gamora: ['#5a9a5a', '#3a6a3a'],
};
const HAIR = {
  black: ['#1c1814', '#0a0806'], brown: ['#5a3a22', '#38220f'], dbrown: ['#3a2618', '#20140a'], blond: ['#e0c070', '#a8883a'],
  dblond: ['#b8944e', '#80622c'], red: ['#b04a24', '#742c12'], grey: ['#a8a8b0', '#6e6e76'], white: ['#ecece8', '#b0b0b4'],
  orange: ['#e86a1c', '#a8480c'], platinum: ['#f2ead2', '#c4b694'], auburn: ['#8a3a22', '#56200e'], salt: ['#8a8a90', '#5a5a60'],
};

const KW = 18;
function kGrid(h) { const grid = []; for (let i = 0; i < h; i++) grid.push(new Array(KW).fill('.')); return grid; }
function kSet(grid, x, y, ch) { if (y >= 0 && y < grid.length && x >= 0 && x < KW) grid[y][x] = ch; }
function kGet(grid, x, y) { return y >= 0 && y < grid.length && x >= 0 && x < KW ? grid[y][x] : '.'; }
function kRow(grid, y, x0, x1, ch) { for (let x = x0; x <= x1; x++) kSet(grid, x, y, ch); }
function kCol(grid, x, y0, y1, ch) { for (let y = y0; y <= y1; y++) kSet(grid, x, y, ch); }
function kArt(grid, rows, ox, oy) { rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] !== '.') kSet(grid, ox + i, oy + j, row[i]); }); }
function kOn(grid, x, y, ch) { if (kGet(grid, x, y) !== '.') kSet(grid, x, y, ch); }

function kFace(grid, hero) {
  const fem = hero.sex === 'f';
  if (hero.hair === 'bald' || hero.hair === 'mohawk' || hero.hair === 'shaved') { kRow(grid, 1, 4, 9, 's'); }
  kRow(grid, 2, 4, 9, 's'); kSet(grid, 3, 2, 's'); kSet(grid, 10, 2, 'S');
  for (let y = 3; y <= 5; y++) { kRow(grid, y, 3, 9, 's'); kSet(grid, 10, y, 'S'); }
  if (fem) {
    kRow(grid, 6, 3, 10, 's'); kSet(grid, 3, 6, 'S'); kSet(grid, 10, 6, 'S');
    kRow(grid, 7, 4, 9, 's'); kSet(grid, 4, 7, 'S'); kSet(grid, 9, 7, 'S');
    kRow(grid, 8, 5, 8, 's'); kSet(grid, 5, 8, 'S'); kSet(grid, 8, 8, 'S');
    kRow(grid, 9, 6, 7, 'S');
    kRow(grid, 10, 6, 7, 'S');
  } else {
    kRow(grid, 6, 3, 10, 's'); kSet(grid, 10, 6, 'S');
    kRow(grid, 7, 3, 10, 's'); kSet(grid, 3, 7, 'S'); kSet(grid, 10, 7, 'S');
    kRow(grid, 8, 4, 9, 's'); kSet(grid, 4, 8, 'S'); kSet(grid, 9, 8, 'S');
    kRow(grid, 9, 5, 8, 'S');
    kRow(grid, 10, 5, 7, 'S');
  }
  kSet(grid, 4, 4, 'w'); kSet(grid, 5, 4, 'k'); kSet(grid, 8, 4, 'w'); kSet(grid, 9, 4, 'k');
  if (fem) kRow(grid, 7, 6, 7, 'q'); else kRow(grid, 7, 6, 8, 'q');
}

const EYES = {
  normal: () => {},
  shades: (grid) => { kRow(grid, 4, 3, 9, 'k'); kRow(grid, 5, 4, 5, 'k'); kRow(grid, 5, 8, 9, 'k'); kSet(grid, 4, 4, 'm'); kSet(grid, 8, 4, 'm'); },
  roundshades: (grid) => { kRow(grid, 4, 4, 9, 'k'); kRow(grid, 5, 4, 5, 'k'); kRow(grid, 5, 8, 9, 'k'); kSet(grid, 4, 4, 'm'); kSet(grid, 8, 4, 'm'); },
  glasses: (grid) => { kRow(grid, 3, 3, 10, 'm'); kSet(grid, 3, 4, 'm'); kSet(grid, 6, 4, 'm'); kSet(grid, 7, 4, 'm'); kSet(grid, 10, 4, 'm'); },
  visor: (grid) => { kRow(grid, 4, 3, 10, 'e'); kRow(grid, 3, 4, 9, 'k'); kRow(grid, 5, 4, 9, 'k'); },
  patch: (grid) => { kRow(grid, 3, 3, 10, 'k'); kRow(grid, 4, 8, 9, 'k'); kRow(grid, 5, 8, 9, 'k'); },
  glow: (grid) => { kSet(grid, 4, 4, 'e'); kSet(grid, 5, 4, 'e'); kSet(grid, 8, 4, 'e'); kSet(grid, 9, 4, 'e'); },
  angry: (grid) => { kSet(grid, 4, 3, 'S'); kSet(grid, 5, 3, 'S'); kSet(grid, 8, 3, 'S'); kSet(grid, 9, 3, 'S'); },
  tired: (grid) => { kSet(grid, 4, 5, 'S'); kSet(grid, 5, 5, 'S'); kSet(grid, 8, 5, 'S'); kSet(grid, 9, 5, 'S'); },
  bigglasses: (grid) => { kRow(grid, 3, 4, 5, 'k'); kRow(grid, 3, 8, 9, 'k'); kRow(grid, 6, 4, 5, 'k'); kRow(grid, 6, 8, 9, 'k'); for (const x of [3, 6, 7, 10]) { kSet(grid, x, 4, 'k'); kSet(grid, x, 5, 'k'); } kSet(grid, 4, 4, 'w'); kSet(grid, 5, 4, 'k'); kRow(grid, 5, 4, 5, 'w'); kSet(grid, 8, 4, 'w'); kSet(grid, 9, 4, 'k'); kRow(grid, 5, 8, 9, 'w'); kSet(grid, 2, 4, 'k'); },
  wide: (grid) => { kSet(grid, 6, 4, 'w'); kSet(grid, 10, 4, 'w'); },
  sus: (grid) => { kSet(grid, 4, 4, 'k'); kSet(grid, 5, 4, 'w'); kSet(grid, 8, 4, 'k'); kSet(grid, 9, 4, 'w'); },
};
const FACE_EXTRA = {
  scar: (grid) => { kSet(grid, 7, 2, 'S'); kSet(grid, 7, 3, 'S'); kSet(grid, 7, 5, 'S'); },
  cheekscar: (grid) => { kSet(grid, 4, 5, 'S'); kSet(grid, 4, 6, 'S'); kSet(grid, 5, 6, 'S'); },
  freckles: (grid) => { kOn(grid, 4, 5, 'S'); kOn(grid, 9, 5, 'S'); kOn(grid, 6, 6, 'S'); },
  blood: (grid) => { kSet(grid, 9, 6, 'r'); kSet(grid, 9, 7, 'r'); },
  grease: (grid) => { kRow(grid, 2, 3, 10, 'v'); kRow(grid, 3, 3, 10, 'v'); },
  war: (grid) => { kRow(grid, 4, 3, 10, 'v'); kRow(grid, 5, 3, 10, 'v'); kSet(grid, 4, 4, 'w'); kSet(grid, 5, 4, 'k'); kSet(grid, 8, 4, 'w'); kSet(grid, 9, 4, 'k'); },
  clown: (grid) => { kRow(grid, 7, 5, 9, 'r'); kSet(grid, 4, 6, 'r'); kSet(grid, 10, 6, 'r'); },
  sideburns: (grid) => { kCol(grid, 3, 3, 6, 'h'); },
  navi: (grid) => { kOn(grid, 5, 2, 'S'); kOn(grid, 7, 2, 'S'); kOn(grid, 4, 6, 'S'); kOn(grid, 9, 6, 'S'); kOn(grid, 3, 5, 'S'); },
  maul: (grid) => { for (const [x, y] of [[4, 2], [6, 2], [8, 2], [3, 5], [6, 5], [10, 5], [4, 6], [9, 6], [5, 8], [8, 8]]) kOn(grid, x, y, 'k'); },
  drax: (grid) => { for (const [x, y] of [[4, 2], [5, 3], [9, 2], [9, 5], [8, 6], [4, 7]]) kOn(grid, x, y, 'r'); },
  gamora: (grid) => { kOn(grid, 4, 6, 'm'); kOn(grid, 9, 6, 'm'); kOn(grid, 4, 2, 'm'); },
  crooked: (grid) => { kRow(grid, 7, 5, 9, 'w'); kSet(grid, 6, 7, 'q'); kSet(grid, 8, 7, 'S'); },
  smile: (grid) => { kRow(grid, 7, 6, 9, 'w'); },
  grin: (grid) => { kRow(grid, 7, 4, 9, 'w'); kSet(grid, 4, 7, 'k'); kSet(grid, 9, 7, 'k'); kRow(grid, 8, 5, 8, 'k'); },
};

function kBack(grid, y0, y1, x) { for (let y = y0; y <= y1; y++) kSet(grid, x === undefined ? 2 : x, y, y === y1 ? 'H' : 'h'); }
function kTop(grid) { kRow(grid, 0, 4, 9, 'h'); kRow(grid, 1, 3, 10, 'h'); kSet(grid, 9, 0, 'H'); kSet(grid, 3, 2, 'h'); }
const HAIRSTYLE = {
  bald: () => {},
  shaved: (grid) => { kRow(grid, 1, 4, 9, 'H'); kSet(grid, 3, 2, 'H'); },
  crew: (grid) => { kRow(grid, 0, 5, 8, 'H'); kRow(grid, 1, 4, 9, 'h'); kSet(grid, 3, 2, 'h'); },
  short: (grid) => { kTop(grid); kSet(grid, 3, 3, 'H'); kBack(grid, 2, 5); },
  side: (grid) => { kTop(grid); kRow(grid, 2, 3, 6, 'h'); kSet(grid, 6, 2, 'H'); kSet(grid, 3, 3, 'H'); kBack(grid, 2, 5); },
  slick: (grid) => { kRow(grid, 0, 4, 10, 'h'); kRow(grid, 1, 3, 10, 'h'); kSet(grid, 10, 1, 'H'); kSet(grid, 3, 2, 'h'); kSet(grid, 3, 3, 'H'); kBack(grid, 2, 5); },
  quiff: (grid) => { kRow(grid, 0, 5, 10, 'h'); kRow(grid, 1, 3, 10, 'h'); kSet(grid, 10, 0, 'H'); kSet(grid, 9, 2, 'h'); kSet(grid, 3, 2, 'h'); kBack(grid, 2, 5); },
  spiky: (grid) => { [4, 6, 8].forEach((x) => { kSet(grid, x, 0, 'h'); }); kSet(grid, 10, 0, 'h'); kRow(grid, 1, 3, 10, 'h'); kSet(grid, 5, 1, 'H'); kSet(grid, 9, 1, 'H'); kSet(grid, 3, 2, 'h'); kBack(grid, 2, 5); },
  messy: (grid) => { kTop(grid); kSet(grid, 5, 0, 'H'); kSet(grid, 7, 0, 'H'); kRow(grid, 2, 3, 5, 'h'); kSet(grid, 8, 2, 'h'); kBack(grid, 2, 6); },
  curly: (grid) => { kTop(grid); kSet(grid, 5, 0, 'H'); kSet(grid, 8, 1, 'H'); kSet(grid, 4, 1, 'H'); kRow(grid, 2, 3, 4, 'h'); kSet(grid, 10, 2, 'h'); kBack(grid, 2, 7); kSet(grid, 2, 3, 'H'); kSet(grid, 2, 5, 'H'); },
  pixie: (grid) => { kRow(grid, 0, 4, 9, 'h'); kRow(grid, 1, 3, 10, 'h'); kSet(grid, 10, 1, 'H'); kRow(grid, 2, 3, 5, 'h'); kSet(grid, 3, 3, 'h'); kBack(grid, 2, 4); },
  bob: (grid) => { kTop(grid); kRow(grid, 2, 3, 4, 'h'); kRow(grid, 2, 9, 10, 'h'); kBack(grid, 2, 8); kCol(grid, 3, 3, 8, 'h'); kSet(grid, 3, 8, 'H'); kCol(grid, 11, 2, 6, 'h'); kSet(grid, 11, 6, 'H'); },
  longf: (grid) => { kTop(grid); kRow(grid, 2, 3, 4, 'h'); kSet(grid, 10, 2, 'h'); kBack(grid, 2, 12, 2); kBack(grid, 3, 12, 1); kCol(grid, 3, 3, 9, 'h'); kSet(grid, 3, 9, 'H'); kCol(grid, 11, 2, 7, 'h'); kSet(grid, 11, 7, 'H'); kSet(grid, 0, 11, 'H'); kSet(grid, 0, 12, 'H'); },
  longm: (grid) => { kTop(grid); kSet(grid, 3, 3, 'h'); kBack(grid, 2, 11, 2); kBack(grid, 3, 11, 1); kSet(grid, 3, 4, 'H'); },
  shoulder: (grid) => { kTop(grid); kRow(grid, 2, 3, 4, 'h'); kBack(grid, 2, 9, 2); kBack(grid, 3, 9, 1); kCol(grid, 3, 3, 7, 'h'); kSet(grid, 3, 7, 'H'); },
  ponytail: (grid) => { kTop(grid); kSet(grid, 3, 3, 'H'); kBack(grid, 2, 4); kCol(grid, 1, 3, 9, 'h'); kSet(grid, 1, 9, 'H'); kSet(grid, 0, 5, 'h'); kSet(grid, 0, 7, 'H'); kSet(grid, 1, 3, 'H'); },
  pigtails: (grid) => { kTop(grid); kSet(grid, 3, 3, 'h'); kBack(grid, 2, 3); kCol(grid, 1, 1, 7, 'v'); kCol(grid, 0, 2, 6, 'v'); kSet(grid, 1, 7, 'V'); kCol(grid, 11, 1, 7, 'r'); kCol(grid, 12, 2, 6, 'r'); kSet(grid, 11, 7, 'R'); kSet(grid, 2, 1, 'h'); kSet(grid, 11, 0, '.'); },
  braid: (grid) => { kTop(grid); kRow(grid, 2, 3, 4, 'h'); kBack(grid, 2, 7); kSet(grid, 3, 3, 'h'); kCol(grid, 11, 2, 5, 'h'); for (let y = 6; y <= 13; y++) kSet(grid, y % 2 ? 11 : 10, y, y % 2 ? 'H' : 'h'); },
  sidebun: (grid) => { kTop(grid); kRow(grid, 2, 3, 4, 'h'); kBack(grid, 2, 6); kRow(grid, 3, 0, 1, 'h'); kRow(grid, 4, 0, 1, 'H'); kRow(grid, 5, 0, 1, 'h'); kRow(grid, 6, 0, 1, 'H'); kSet(grid, 1, 2, 'H'); },
  topbun: (grid) => { kTop(grid); kRow(grid, 0, 2, 3, 'h'); kSet(grid, 2, 1, 'H'); kBack(grid, 2, 5); },
  mullet: (grid) => { kTop(grid); kSet(grid, 3, 3, 'H'); kBack(grid, 2, 10, 2); kBack(grid, 5, 10, 1); },
  afro: (grid) => { kRow(grid, 0, 3, 10, 'h'); kRow(grid, 1, 2, 11, 'h'); kSet(grid, 6, 0, 'H'); kSet(grid, 9, 1, 'H'); kBack(grid, 1, 7, 2); kBack(grid, 2, 6, 1); kSet(grid, 11, 2, 'h'); kSet(grid, 3, 2, 'h'); },
  wild: (grid) => { kRow(grid, 1, 2, 3, 'h'); kBack(grid, 2, 8, 2); kBack(grid, 3, 7, 1); kSet(grid, 0, 3, 'h'); kSet(grid, 0, 5, 'H'); kSet(grid, 3, 2, 'h'); kSet(grid, 3, 3, 'H'); },
  dreads: (grid) => { kTop(grid); kBack(grid, 2, 12, 2); kBack(grid, 3, 12, 1); kBack(grid, 4, 11, 0); for (let y = 3; y <= 12; y += 2) { kSet(grid, 1, y, 'H'); kSet(grid, 2, y + 1, 'H'); } kSet(grid, 3, 3, 'h'); },
  feathered: (grid) => { kRow(grid, 0, 3, 10, 'h'); kRow(grid, 1, 2, 11, 'h'); kRow(grid, 2, 3, 5, 'h'); kSet(grid, 10, 2, 'h'); kSet(grid, 9, 2, 'h'); for (const [x, y] of [[4, 0], [6, 0], [9, 0], [3, 1], [5, 1], [8, 1], [10, 1], [4, 2], [9, 2], [1, 4], [2, 5], [1, 6], [2, 7], [1, 8], [2, 9]]) kSet(grid, x, y, 'H'); kBack(grid, 2, 10, 2); kBack(grid, 3, 10, 1); kSet(grid, 0, 5, 'h'); kSet(grid, 0, 8, 'H'); kSet(grid, 3, 3, 'h'); },
  perm: (grid) => { kRow(grid, 0, 3, 10, 'h'); kRow(grid, 1, 2, 11, 'h'); for (const [x, y] of [[4, 0], [7, 0], [10, 0], [3, 1], [6, 1], [9, 1]]) kSet(grid, x, y, 'H'); kRow(grid, 2, 3, 6, 'h'); kSet(grid, 4, 2, 'H'); kSet(grid, 10, 2, 'h'); kBack(grid, 2, 9, 2); kBack(grid, 3, 9, 1); kSet(grid, 1, 5, 'H'); kSet(grid, 2, 7, 'H'); kSet(grid, 3, 3, 'h'); },
  mohawk: (grid) => { kRow(grid, 0, 5, 8, 'h'); kRow(grid, 1, 5, 8, 'H'); },
  bowl: (grid) => { kRow(grid, 0, 4, 9, 'h'); kRow(grid, 1, 3, 10, 'h'); kRow(grid, 2, 3, 10, 'h'); kSet(grid, 10, 2, 'H'); kBack(grid, 2, 5); },
  fringe: (grid) => { kCol(grid, 2, 3, 7, 'h'); kSet(grid, 2, 7, 'H'); kCol(grid, 3, 4, 6, 'h'); },
  receding: (grid) => { kRow(grid, 1, 3, 4, 'h'); kBack(grid, 2, 5); kSet(grid, 3, 2, 'h'); kSet(grid, 3, 3, 'H'); },
};

const BEARDS = {
  stubble: (grid) => { kRow(grid, 6, 5, 9, 'z'); kRow(grid, 7, 3, 5, 'z'); kRow(grid, 7, 9, 10, 'Z'); kRow(grid, 8, 4, 9, 'z'); kSet(grid, 4, 8, 'Z'); kSet(grid, 9, 8, 'Z'); kRow(grid, 9, 5, 8, 'Z'); },
  full: (grid) => { kCol(grid, 3, 4, 7, 'b'); kSet(grid, 4, 6, 'b'); kSet(grid, 4, 7, 'b'); kRow(grid, 6, 5, 9, 'b'); kSet(grid, 10, 6, 'b'); kSet(grid, 5, 7, 'b'); kSet(grid, 9, 7, 'b'); kSet(grid, 10, 7, 'b'); kRow(grid, 7, 6, 8, 'q'); kRow(grid, 8, 3, 10, 'b'); kRow(grid, 9, 4, 9, 'b'); kRow(grid, 10, 5, 8, 'B'); kSet(grid, 3, 8, 'B'); kSet(grid, 10, 8, 'B'); },
  short: (grid) => { kCol(grid, 3, 5, 7, 'b'); kRow(grid, 6, 5, 9, 'b'); kSet(grid, 4, 7, 'b'); kSet(grid, 9, 7, 'b'); kRow(grid, 8, 4, 9, 'b'); kRow(grid, 9, 5, 8, 'B'); },
  goatee: (grid) => { kRow(grid, 6, 6, 8, 'b'); kSet(grid, 5, 7, 'b'); kSet(grid, 9, 7, 'b'); kRow(grid, 8, 6, 8, 'b'); kRow(grid, 9, 6, 7, 'B'); },
  mustache: (grid) => { kRow(grid, 6, 5, 9, 'b'); kSet(grid, 5, 7, 'B'); kSet(grid, 9, 7, 'B'); },
  chevron: (grid) => { kRow(grid, 6, 5, 9, 'b'); kRow(grid, 5, 6, 8, 'B'); },
  horseshoe: (grid) => { kRow(grid, 6, 5, 9, 'b'); kCol(grid, 5, 7, 9, 'b'); kCol(grid, 9, 7, 9, 'b'); },
  chops: (grid) => { kCol(grid, 3, 3, 8, 'h'); kCol(grid, 4, 6, 8, 'h'); kRow(grid, 6, 5, 9, 'h'); kSet(grid, 3, 8, 'H'); },
  soul: (grid) => { kRow(grid, 6, 6, 8, 'b'); kSet(grid, 7, 8, 'b'); kSet(grid, 7, 9, 'B'); },
  wizard: (grid) => { BEARDS.full(grid); kRow(grid, 10, 4, 9, 'b'); kSet(grid, 9, 10, 'B'); },
};
function kBeardChest(grid, kind) {
  if (kind === 'wizard') { kRow(grid, 11, 4, 9, 'b'); kRow(grid, 12, 5, 9, 'b'); kRow(grid, 13, 5, 8, 'b'); kRow(grid, 14, 6, 7, 'B'); kSet(grid, 9, 12, 'B'); }
}

const HATS = {
  fedora: (grid) => { kRow(grid, 0, 4, 9, 'g'); kRow(grid, 1, 4, 9, 'G'); kRow(grid, 2, 2, 11, 'g'); kSet(grid, 2, 2, 'G'); kSet(grid, 11, 2, 'G'); kSet(grid, 6, 0, 'G'); },
  cowboy: (grid) => { kRow(grid, 0, 4, 9, 'g'); kRow(grid, 1, 4, 9, 'G'); kRow(grid, 2, 1, 12, 'g'); kSet(grid, 6, 0, 'G'); },
  cap: (grid) => { kRow(grid, 0, 4, 9, 'g'); kRow(grid, 1, 3, 10, 'g'); kRow(grid, 2, 9, 13, 'G'); kSet(grid, 3, 2, 'G'); },
  beanie: (grid) => { kRow(grid, 0, 4, 9, 'g'); kRow(grid, 1, 3, 10, 'g'); kRow(grid, 2, 3, 10, 'G'); },
  bandana: (grid) => { kRow(grid, 2, 3, 11, 'g'); kSet(grid, 2, 2, 'G'); kSet(grid, 1, 3, 'G'); kSet(grid, 1, 4, 'g'); },
  headband: (grid) => { kRow(grid, 2, 3, 11, 'g'); kSet(grid, 2, 3, 'G'); },
  helmet: (grid) => { kRow(grid, 0, 4, 10, 'g'); kRow(grid, 1, 3, 11, 'g'); kRow(grid, 2, 2, 11, 'G'); kSet(grid, 2, 1, 'g'); kCol(grid, 10, 3, 6, 'G'); },
  tophat: (grid) => { kRow(grid, 0, 4, 9, 'g'); kRow(grid, 1, 4, 9, 'G'); kRow(grid, 2, 2, 11, 'g'); },
  tricorn: (grid) => { kRow(grid, 0, 5, 8, 'g'); kRow(grid, 1, 3, 10, 'g'); kRow(grid, 2, 2, 11, 'G'); kSet(grid, 6, 1, 'w'); kSet(grid, 2, 1, 'g'); kSet(grid, 11, 1, 'g'); },
  wizardtall: (grid) => { kRow(grid, 0, 4, 9, 'g'); kSet(grid, 9, 0, 'G'); kRow(grid, 1, 3, 10, 'G'); kRow(grid, 2, 0, 13, 'g'); kSet(grid, 0, 2, 'G'); kSet(grid, 13, 2, 'G'); },
  wizard: (grid) => { kSet(grid, 9, 0, 'G'); kRow(grid, 1, 4, 9, 'g'); kRow(grid, 2, 1, 12, 'g'); kSet(grid, 1, 2, 'G'); kSet(grid, 12, 2, 'G'); },
  horns: (grid) => { kRow(grid, 0, 3, 3, 'y'); kRow(grid, 0, 10, 10, 'y'); kRow(grid, 1, 3, 4, 'y'); kRow(grid, 1, 9, 10, 'y'); kRow(grid, 2, 3, 10, 'y'); kSet(grid, 6, 2, 'G'); kSet(grid, 7, 2, 'G'); },
  crown: (grid) => { kSet(grid, 4, 0, 'y'); kSet(grid, 6, 0, 'r'); kSet(grid, 9, 0, 'y'); kRow(grid, 1, 4, 9, 'y'); },
  tiara: (grid) => { kRow(grid, 2, 4, 9, 'y'); kSet(grid, 6, 1, 'y'); kSet(grid, 7, 1, 'r'); },
  spartan: (grid) => { kRow(grid, 0, 4, 9, 'r'); kRow(grid, 1, 3, 10, 'y'); for (let y = 2; y <= 8; y++) kRow(grid, y, 3, y > 6 ? 9 : 10, 'y'); for (let y = 3; y <= 8; y++) kRow(grid, y, 6, 9, 's'); kSet(grid, 6, 3, 'y'); kSet(grid, 8, 4, 'w'); kSet(grid, 9, 4, 'k'); kCol(grid, 3, 2, 8, 'G'); kSet(grid, 10, 2, 'G'); },
  winged: (grid) => { kRow(grid, 0, 4, 9, 'm'); kRow(grid, 1, 3, 10, 'm'); kRow(grid, 0, 1, 2, 'w'); kSet(grid, 2, 1, 'w'); kRow(grid, 0, 11, 12, 'w'); kSet(grid, 11, 1, 'w'); kSet(grid, 6, 0, 'M'); },
  pilot: (grid) => { kRow(grid, 0, 4, 10, 'g'); kRow(grid, 1, 3, 11, 'g'); kRow(grid, 2, 3, 11, 'G'); kRow(grid, 3, 4, 10, 'm'); kSet(grid, 5, 3, 'e'); kSet(grid, 8, 3, 'e'); kSet(grid, 11, 3, 'G'); },
  hood: (grid) => { kRow(grid, 0, 3, 10, 'g'); kRow(grid, 1, 2, 11, 'g'); kRow(grid, 2, 2, 11, 'g'); kCol(grid, 2, 3, 9, 'g'); kCol(grid, 3, 3, 9, 'G'); kSet(grid, 11, 3, 'g'); },
  straw: (grid) => { kRow(grid, 0, 4, 9, 'g'); kRow(grid, 1, 3, 10, 'G'); kRow(grid, 2, 0, 13, 'g'); kSet(grid, 0, 2, 'G'); kSet(grid, 13, 2, 'G'); },
};

const EMBLEMS = {
  star: ['..e..', '.eee.', 'eeeee', '.e.e.', 'e...e'],
  spider: ['e.e.e', '.eee.', 'eeeee', '.eee.', 'e.e.e'],
  bat: ['e...e', 'ee.ee', 'eeeee', '.eee.', '..e..'],
  s: ['eeeee', 'e.ttt', 'eeeee', 'ttt.e', 'eeeee'],
  w: ['e...e', 'e.e.e', 'eeeee', '.e.e.', '.....'],
  bolt: ['...e.', '..ee.', '.eee.', '.ee..', '.e...'],
  arc: ['.eee.', 'eewee', 'ewwwe', 'eewee', '.eee.'],
  circle: ['.eee.', 'e...e', 'e.e.e', 'e...e', '.eee.'],
  hourglass: ['.....', 'eeeee', '.eee.', 'eeeee', '.....'],
  badge: ['.....', '..y..', '.yyy.', '..y..', '.....'],
  delta: ['..y..', '.yky.', '.yyy.', 'y...y', '.....'],
  eagle: ['e...e', 'ee.ee', '.eee.', '..e..', '.....'],
};

const T_MALE = [[1, 12], [0, 13], [0, 13], [0, 13], [0, 13], [0, 13], [1, 12], [1, 12]];
const T_FEM = [[2, 11], [1, 12], [1, 12], [2, 11], [2, 11], [1, 12], [1, 12], [2, 11]];
const T_FEM_TANK = [[2, 11], [1, 12], [1, 12], [1, 12], [1, 12], [1, 12], [1, 12], [2, 11]];
const T_FAT = [[2, 11], [1, 12], [1, 13], [1, 14], [1, 15], [1, 15], [1, 15], [2, 14]];
function kTorso(grid, outfit, fem) {
  const top = 11, shape = outfit.fat ? T_FAT : fem && outfit.cut === 'tank' ? T_FEM_TANK : fem ? T_FEM : T_MALE;
  const base = outfit.cut === 'bare' ? 's' : outfit.cut === 'fur' ? 'h' : outfit.cut === 'armor' ? 'm' : 'j';
  const dark = { s: 'S', h: 'H', m: 'M', j: 'J' }[base];
  shape.forEach(([x0, x1], i) => kRow(grid, top + i, x0, x1, base));
  const left = fem ? 3 : 2, right = fem ? 10 : 11;
  for (let y = top + 2; y <= top + 5; y++) { kSet(grid, left, y, dark); kSet(grid, right, y, dark); }
  kSet(grid, shape[4][0], top + 4, dark); kSet(grid, shape[5][0], top + 5, dark); kSet(grid, shape[6][0], top + 6, dark); kSet(grid, shape[7][0], top + 7, dark);
  const on = (x, y, ch) => kOn(grid, x, y, ch);
  const rowOn = (y, x0, x1, ch) => { for (let x = x0; x <= x1; x++) on(x, y, ch); };
  switch (outfit.cut) {
    case 'tee': rowOn(top, 6, 8, 's'); break;
    case 'vneck': rowOn(top, 5, 8, 's'); rowOn(top + 1, 6, 7, 's'); break;
    case 'scoop': rowOn(top, 5, 8, 's'); rowOn(top + 1, 5, 8, 's'); break;
    case 'suit': rowOn(top, 5, 8, 'w'); rowOn(top + 1, 5, 8, 'w'); rowOn(top + 2, 6, 7, 'w'); rowOn(top + 3, 6, 7, 'w'); if (outfit.tie !== false) for (let y = top; y <= top + 4; y++) on(7, y, 't'); else { on(6, top, 's'); on(7, top, 's'); } break;
    case 'tank': for (let y = top; y <= top + 5; y++) { rowOn(y, 0, fem ? 3 : 2, 's'); rowOn(y, fem ? 10 : 11, 13, 's'); on(left, y, 'S'); on(right, y, 'S'); } rowOn(top, 5, 8, 's'); break;
    case 'bare': on(4, top + 2, 'S'); on(5, top + 2, 'S'); on(8, top + 2, 'S'); on(9, top + 2, 'S'); on(7, top + 4, 'S'); on(7, top + 5, 'S'); on(6, top + 6, 'S'); on(8, top + 6, 'S'); break;
    case 'armor': rowOn(top + 2, 3, 10, 'M'); rowOn(top + 5, 3, 10, 'M'); for (let y = top; y <= top + 7; y++) on(7, y, 'M'); rowOn(top, 0, 3, 'm'); rowOn(top, 10, 13, 'm'); rowOn(top + 1, 0, 3, 'M'); rowOn(top + 1, 10, 13, 'M'); break;
    case 'jacket': for (let y = top; y <= top + 7; y++) rowOn(y, 5, 8, 'u'); on(5, top, 'J'); on(8, top, 'J'); break;
    case 'leather': for (let y = top; y <= top + 7; y++) on(6, y, 'm'); rowOn(top, 3, 4, 'J'); rowOn(top, 9, 10, 'J'); rowOn(top + 1, 4, 5, 'J'); on(4, top + 3, 'u'); on(4, top + 4, 'u'); break;
    case 'coat': case 'robe': for (let y = top; y <= top + 7; y++) rowOn(y, 5, 8, outfit.inner ? 'u' : 'J'); if (outfit.cut === 'robe') rowOn(top + 6, 0, 13, 'l'); break;
    case 'uniform': rowOn(top + 2, 3, 4, 'J'); rowOn(top + 3, 3, 4, 'J'); rowOn(top + 2, 9, 10, 'J'); rowOn(top + 3, 9, 10, 'J'); for (let y = top; y <= top + 7; y++) on(7, y, 'J'); rowOn(top, 6, 8, 'J'); break;
    case 'bodysuit': break;
    case 'catsuit': on(6, top, 's'); on(7, top, 's'); for (let y = top + 1; y <= top + 7; y++) on(4, y, 'u'); break;
    case 'fur': for (let y = top; y <= top + 7; y++) for (let x = 0; x < 14; x++) if (grid[y][x] === 'h' && (x + y) % 3 === 0) grid[y][x] = 'H'; break;
    case 'hoodie': rowOn(top, 3, 10, 'J'); on(6, top + 1, 'w'); on(8, top + 1, 'w'); on(6, top + 2, 'w'); on(8, top + 2, 'w'); rowOn(top + 5, 4, 9, 'J'); break;
    case 'shirt': rowOn(top, 5, 8, 'J'); for (let y = top + 1; y <= top + 7; y++) on(7, y, 'J'); on(7, top + 2, 'w'); on(7, top + 4, 'w'); break;
    case 'vest': for (let y = top; y <= top + 7; y++) rowOn(y, 5, 8, 'u'); rowOn(top, 0, 2, 's'); rowOn(top, 11, 13, 's'); break;
    case 'vestshirt': for (let y = top; y <= top + 7; y++) rowOn(y, 5, 8, 'u'); rowOn(top, 0, 3, 'u'); rowOn(top, 10, 13, 'u'); rowOn(top + 1, 0, 2, 'u'); rowOn(top + 1, 11, 13, 'u'); break;
    case 'dress': rowOn(top, 5, 8, 's'); break;
  }
  for (const x of outfit.extras || []) {
    switch (x) {
      case 'belt': rowOn(top + 6, 0, 13, 'l'); on(7, top + 6, 'y'); break;
      case 'bandolier': for (let i = 0; i < 8; i++) { on(2 + i, top + i, 'l'); if (i % 2) on(3 + i, top + i, 'y'); } break;
      case 'bandolier2': for (let i = 0; i < 8; i++) { on(11 - i, top + i, 'l'); if (i % 2) on(10 - i, top + i, 'y'); } break;
      case 'cape': for (let y = top; y <= top + 7; y++) { kSet(grid, 0, y, 'c'); kSet(grid, 1, y, 'C'); } kSet(grid, 2, top, 'c'); break;
      case 'scarf': rowOn(top, 4, 9, 'o'); kSet(grid, 3, top + 1, 'o'); kSet(grid, 3, top + 2, 'O'); kSet(grid, 2, top + 3, 'O'); break;
      case 'quiver': for (let y = top - 2; y <= top + 4; y++) { kSet(grid, 0, y, 'l'); kSet(grid, 1, y, 'L'); } kSet(grid, 0, top - 3, 'w'); kSet(grid, 1, top - 3, 'w'); break;
      case 'suspenders': for (let y = top; y <= top + 7; y++) { on(4, y, 'l'); on(9, y, 'l'); } break;
      case 'chain': rowOn(top + 1, 5, 8, 'y'); on(7, top + 2, 'y'); break;
      case 'tags': on(6, top + 1, 'm'); on(7, top + 2, 'm'); on(7, top + 3, 'm'); break;
      case 'tie': for (let y = top; y <= top + 4; y++) on(7, y, 't'); break;
      case 'bowtie': on(6, top, 't'); on(8, top, 't'); on(7, top, 'T'); break;
      case 'collar': rowOn(top, 3, 5, 'u'); rowOn(top, 8, 10, 'u'); break;
      case 'pads': rowOn(top, 0, 3, 'u'); rowOn(top, 10, 13, 'u'); rowOn(top + 1, 0, 3, 'U'); rowOn(top + 1, 10, 13, 'U'); break;
      case 'stripes': rowOn(top + 3, 0, 13, 'u'); rowOn(top + 5, 0, 13, 'u'); break;
      case 'sidestripe': for (let y = top; y <= top + 7; y++) { on(fem ? 3 : 2, y, 'k'); on(fem ? 10 : 11, y, 'k'); } break;
      case 'jacketopen': for (let y = top; y <= top + 7; y++) rowOn(y, 5, 8, 'u'); break;
      case 'pack': for (let y = top; y <= top + 6; y++) { kSet(grid, 0, y, 'm'); kSet(grid, 1, y, 'M'); } kSet(grid, 0, top - 1, 'M'); break;
      case 'holster': on(12, top + 6, 'l'); on(12, top + 7, 'L'); break;
      case 'necklace': rowOn(top, 5, 8, 'y'); break;
    }
  }
  if (outfit.fat) { for (let i = 2; i < 8; i++) kSet(grid, shape[i][1], top + i, dark); kRow(grid, top + 7, 9, shape[7][1], dark); }
  if (outfit.emblem) kArt(grid, EMBLEMS[outfit.emblem], 5, top + 1);
  const tail = outfit.tail || (outfit.cut === 'coat' ? 4 : outfit.cut === 'robe' ? 6 : outfit.cut === 'dress' ? 4 : 0);
  if (tail) for (let i = 0; i < tail; i++) {
    if (outfit.cut === 'dress' || outfit.closed) { kRow(grid, 19 + i, 1 - Math.min(1, i >> 1), 12 + Math.min(1, i >> 1), 'j'); kSet(grid, 1, 19 + i, 'J'); }
    else { kRow(grid, 19 + i, 1, 5, 'j'); kRow(grid, 19 + i, 8, 12, 'j'); kSet(grid, 1, 19 + i, 'J'); kSet(grid, 12, 19 + i, 'J'); if (outfit.cut === 'robe') kRow(grid, 19 + i, 6, 7, 'J'); }
  }
  if ((outfit.extras || []).includes('cape')) for (let i = 0; i < (outfit.capeLen || 4); i++) { kSet(grid, 0, 19 + i, 'c'); kSet(grid, 1, 19 + i, 'C'); kSet(grid, 2, 19 + i, i > 1 ? 'C' : '.'); }
}

function kHairClean(grid) {
  const hair = (ch) => ch === 'h' || ch === 'H';
  for (let pass = 0; pass < 2; pass++) for (let y = 1; y <= 10; y++) for (let x = 0; x < 16; x++) {
    if (!hair(grid[y][x])) continue;
    let n = 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (ny >= 0 && ny < grid.length && nx >= 0 && nx < 16 && grid[ny][nx] !== '.') n++; }
    if (n <= 1) grid[y][x] = '.';
  }
  const left = (y) => grid[y].findIndex((ch) => ch !== '.');
  const right = (y) => { for (let x = 15; x >= 0; x--) if (grid[y][x] !== '.') return x; return -1; };
  for (let pass = 0; pass < 4; pass++) {
    let changed = false;
    for (let y = 1; y <= 10; y++) {
      const prevLeft = left(y - 1), leftX = left(y), prevRight = right(y - 1), rightX = right(y);
      if (prevLeft >= 0 && leftX >= 0 && leftX < prevLeft - 1 && hair(grid[y][leftX])) { grid[y][leftX] = '.'; changed = true; }
      if (prevRight >= 0 && rightX >= 0 && rightX > prevRight + 1 && hair(grid[y][rightX])) { grid[y][rightX] = '.'; changed = true; }
    }
    for (let y = 1; y <= 9; y++) {
      const leftX = left(y), rightX = right(y);
      if (leftX >= 0 && leftX < left(y - 1) && leftX < left(y + 1) && hair(grid[y][leftX])) { grid[y][leftX] = '.'; changed = true; }
      if (rightX >= 0 && rightX > right(y - 1) && rightX > right(y + 1) && hair(grid[y][rightX])) { grid[y][rightX] = '.'; changed = true; }
    }
    if (!changed) break;
  }
  for (let y = 5; y <= 10; y++) for (let x = 1; x <= 6; x++) {
    if (grid[y][x] !== '.' || !hair(grid[y][x - 1])) continue;
    const n = grid[y][x + 1] !== '.' ? 1 : grid[y][x + 2] !== '.' && grid[y][x + 1] === '.' ? 2 : 0;
    if (!n || hair(grid[y][x + n])) continue;
    for (let k = 0; k < n; k++) grid[y][x + k] = 'H';
  }
}

function kPolish(grid, hero) {
  let shine = 0;
  for (const [x, y] of [[5, 1], [6, 1], [6, 0]]) if (shine < 1 && grid[y][x] === 'h') { grid[y][x] = 'i'; shine++; }
  if (grid[3][4] === 's') grid[3][4] = 'n';
  const base = hero.torso.cut === 'bare' ? ['s', 'n'] : hero.torso.cut === 'armor' || hero.torso.cut === 'fur' ? null : ['j', 'x'];
  if (base) for (const [x, y] of [[2, 11], [3, 11], [1, 12], [4, 11]]) if (grid[y][x] === base[0]) grid[y][x] = base[1];
}

function kCompose(hero) {
  const outfit = hero.torso, fem = hero.sex === 'f';
  const tail = Math.max(outfit.tail || 0, outfit.cut === 'coat' ? 4 : 0, outfit.cut === 'robe' ? 6 : 0, outfit.cut === 'dress' ? 4 : 0, (outfit.extras || []).includes('cape') ? (outfit.capeLen || 4) : 0, hero.lower ? hero.lower.length : 0);
  const grid = kGrid(19 + tail);
  kTorso(grid, outfit, fem);
  if (hero.head) kArt(grid, hero.head, 0, 0);
  else {
    kFace(grid, hero);
    (EYES[hero.eyes || 'normal'] || EYES.normal)(grid);
    for (const extra of hero.face || []) FACE_EXTRA[extra](grid);
    if (hero.torso.fat) { kRow(grid, 9, 4, 9, 's'); kSet(grid, 9, 9, 'S'); kRow(grid, 10, 4, 9, 'S'); }
    if (hero.beard) { BEARDS[hero.beard](grid); kBeardChest(grid, hero.beard); }
    (HAIRSTYLE[hero.hair] || HAIRSTYLE.short)(grid);
    if (hero.beads) { kSet(grid, 1, 6, 'y'); kSet(grid, 0, 9, 'r'); }
    if (hero.hat) HATS[hero.hat](grid);
    kHairClean(grid);
    kPolish(grid, hero);
  }
  if (hero.lower) kArt(grid, hero.lower, 0, 19);
  if (hero.over) kArt(grid, hero.over, 0, 0);
  return grid.map((row) => row.join(''));
}

function kHero(id, name, role, hero) {
  const skinTone = SKIN[hero.skin] || SKIN.light, hairTone = HAIR[hero.hairCol] || HAIR.brown, beardTone = HAIR[hero.beardCol || hero.hairCol] || HAIR.brown;
  const fem = hero.sex === 'f';
  const secondary = hero.col2 || ['#e8e8ec', '#b8b8c0'], hat = hero.hatCol || ['#4a4a52', '#2a2a30'], cape = hero.cape || ['#b02020', '#781414'], extra = hero.extra || ['#d84020', '#982a14'];
  const mixHex = (from, to, k) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(from.slice(i, i + 2), 16) * (1 - k) + parseInt(to.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');
  const pal = Object.assign({
    z: mixHex(skinTone[1], beardTone[0], 0.45), Z: mixHex(skinTone[1], beardTone[1], 0.6),
    i: mixHex(hairTone[0], '#ffffff', parseInt(hairTone[0].slice(1, 3), 16) < 0x40 ? 0.1 : 0.22), x: mixHex(hero.col[0], '#ffffff', 0.22), n: mixHex(skinTone[0], '#ffffff', parseInt(skinTone[0].slice(1, 3), 16) < 0xa0 ? 0.14 : 0.3),
    s: skinTone[0], S: skinTone[1], h: hairTone[0], H: hairTone[1], b: beardTone[0], B: beardTone[1], k: '#141418', w: '#f0f0f4',
    q: hero.lips || (fem ? '#b84a58' : '#7a3a2c'), j: hero.col[0], J: hero.col[1], u: secondary[0], U: secondary[1],
    t: hero.accent || '#b02020', T: '#701414', g: hat[0], G: hat[1], e: hero.glow || '#f0d040', l: '#5a3c22', L: '#3a2614',
    m: '#9a9ea8', M: '#62666e', c: cape[0], C: cape[1], y: '#e0b040', r: '#c82820', R: '#801818', o: extra[0], O: extra[1],
    v: '#2a5ad8', V: '#1a3a98',
  }, hero.pal || {});
  const legColors = hero.legs || [hero.col[0], hero.col[1], '#2a2420', '#16120e'];
  const bareArm = hero.torso.cut === 'bare' || hero.torso.cut === 'tank' || hero.torso.cut === 'vest' || hero.torso.cut === 'dress';
  const arm = hero.arm || (bareArm ? [skinTone[0], skinTone[1]] : [pal.j, pal.J]);
  const hand = hero.hand || skinTone;
  return {
    id, name, role, sex: fem ? 'f' : 'm', pal, upper: kCompose(hero), top: hero.top,
    legs: { pants: legColors[0], pantsD: legColors[1], boots: legColors[2], bootsD: legColors[3], knee: hero.knee, none: hero.noLegs },
    arm: { a: arm[0], A: arm[1], h: hand[0], H: hand[1] }, gun: hero.gun || ({ beretta: 'pistol', m60: 'mg' })[hero.sig] || hero.sig, sig: hero.sig,
  };
}

const HEADS = {
  predator: ['....dd.dd.dd....', '...gggggggggg...', '..ggGgggggGggd..', '..gmmmmmmmmmgd..', '..gmekmmmmkemd..', '..gmmmmmmmmmg...', '.dgGmmmmmmmGgd..', '.d.ggqgqgqggd...', '.d..qgqgqgq.d...', '.d...ggggg..d...', '.....GGG........'],
  xeno: ['................', '...kkkkkkkk.....', '..kGGGGGGGGkk...', '.kGgggggggGGGkkk', '.kGgxgggggggGGGk', '..kGggggggggkkk.', '...kGgwwwwwk....', '....kGwkwkwk....', '.....kGggGk.....', '......kGGk......', '......kGk.......'],
  vader: ['....kkkkkkk.....', '...kGGGGGGGk....', '..kGgggggggGk...', '..kGgggggggGk...', '..kGkkkGkkkGk...', '..kGgMMgMMggk...', '.kGgggMkMgggGk..', '.kGggMMkMMggGk..', '.kGgMMmmmMMgGk..', '..kkkkMMMkkkk...', '.....kkkk.......'],
  boba: ['...gggggggg.....', '..gggggggggg....', '..ggGkkkkkkkr...', '..ggkkkkkkkk....', '..gggkkkkggg....', '..gggggkgggg....', '..Gggggkgggg....', '..GggggkgggG....', '...Gggggggg.....', '....GGGGGG......', '.....MMM........'],
  mando: ['...mmmmmmmm.....', '..mmmmmmmmmm....', '..mmMkkkkkkk....', '..mmmmmmmkmm....', '..mmmmmmmkmm....', '..mmmmmmmkmm....', '..MmmmmmmkmM....', '..MmmmmmmmmM....', '...MmmmmmmM.....', '....MMMMMM......', '.....MMM........'],
  trooper: ['...wwwwwwww.....', '..wwwwwwwwww....', '..wwkkwwwkkw....', '..wwkkwwwkkw....', '..wwwwwwwwww....', '..wwwkkwkkww....', '..wwkwkwkwkw....', '..Wwwkkkkkww....', '...Wwwwwwww.....', '....WWWWWW......', '.....MMM........'],
  spidey: ['...rrrrrrrr.....', '..rrrkrrrkrr....', '..rrkrrrrrkrS...', '..rkrwwrwwrrS...', '..rkwwwrwwwkS...', '..rrkwwrwwkrS...', '..RrkrrrrrkRS...', '..RrrkrrrkrR....', '...RrrkkkrRR....', '....RRRRRR......', '.....RRR........'],
  deadpool: ['...rrrrrrrr.....', '..rrrrrrrrrr....', '..rkkkrrkkkrS...', '..kwwkrrkwwkS...', '..kkkkrrkkkkS...', '..rkkrrrrkkrS...', '..RrrrrrrrrrS...', '..RrrrrrrrrR....', '...RrrrrrrRR....', '....RRRRRR......', '.....RRR........'],
  hockey: ['....wwwwwww.....', '...wwwwwwwww....', '..wwrwwwwwrwS...', '..wwwwwwwwwwS...', '..wwkkwwwkkwS...', '..wwwkwwkwwwS...', '..wwrwwkwwrwS...', '..Wwwkwkwkww....', '...Wwwwwwww.....', '....WWWWWW......', '.....SSS........'],
  myers: ['...hhhhhhhh.....', '..hhhhhhhhhh....', '..hwwwwwwwwwW...', '..hwwwwwwwwwW...', '..hwkkwwwkkwW...', '..hwwwwwwwwwW...', '..hWwwwwwwwWW...', '..hWwwwkkwwW....', '...WwwwwwwWW....', '....WWWWWW......', '.....SSS........'],
  ghostface: ['....kkkkkk......', '...kkkkkkkkk....', '..kkwwwwwwwkk...', '..kwwwwwwwwwk...', '..kwkkwwwkkwk...', '..kwkkwwwkkwk...', '..kwwwwwwwwwk...', '..kwwwkkkwwwk...', '..kkwwkkkwwkk...', '...kkwwkwwkk....', '....kkkkkkk.....'],
  leatherface: ['..hhhhhhhhhh....', '.hhhhhhhhhhhh...', '.hhwwWwwWwwhh...', '.hhwWwwwwWwwh...', '.hhwkkwwkkwwh...', '.hhwwWwwwWwwh...', '.hhWwwwwwwwWh...', '.hhWwkkkkkwW....', '..hWwwwwwwwW....', '....WWWWWW......', '.....SSS........'],
  pinhead: ['...smsmsmsmsm...', '..smsmsmsmsmsS..', '..msmsmsmsmsmS..', '..smsmksmksmsS..', '..msmsmsmsmsmS..', '..smsmsmsmsmsS..', '..SmsmsmsmsmS...', '..SmsmqqqsmS....', '...SsmsmsmSS....', '....SSSSSS......', '.....SSS........'],
  pennywise: ['.oo.........oo..', 'oooowwwwwwwoooo.', 'ooowwwwwwwwwooo.', '..wwwwwwwwwwW...', '..wwrkwwwrkwW...', '..wwrwwwwwrwW...', '..WwwwwrrwwwW...', '..WrrwwwwrrW....', '...WrrrrrrWW....', '....WWWWWW......', '.....www........'],
  chucky: ['..oooooooooo....', '.ooooooooooooo..', '.oosssssssssoS..', '.oossssssssss...', '.ooswksswkssS...', '.ooSssssssssS...', '..SsSsssSsssS...', '..SssqqqqqsS....', '...SssssssSS....', '....SSSSSS......', '.....SSS........'],
  freddy: ['....gggggg......', '...gggggggg.....', '...GGGGGGGG.....', 'gggggggggggggg..', '...SrSssrSsS....', '...rwksswksS....', '...SsrSSssrS....', '...rSssSrsSS....', '...SrqqqqrS.....', '....SrSSrS......', '.....SSS........'],
  jigsaw: ['................', '...SSSSSSSS.....', '..SSssssssss....', '..Ssssssssss....', '..Sswksswkss....', '..SssssssssS....', '..SSsssssssS....', '..SSssqqqssS....', '...SSssssSS.....', '....SSSSSS......', '.....SSS........'],
  billy: ['...wwwwwwww.....', '..wwwwwwwwww....', '..wrrwwwwwrrw...', '..wkkwwwwwkkw...', '..wkkwwwwwkkw...', '..wwwwwwwwwww...', '..wrrwwrwwrrw...', '..wrwkkkkkwrw...', '...wwwwwwwww....', '....wwwwwww.....', '.....SSS........'],
  grogu: ['................', '................', '................', '................', '................', 'ss...ssssss...ss', 'sssssssssssssss.', '.SssskSsskSssS..', '..Sssssssssss...', '...SssssssS.....', '....SSSSSS......'],
  chewie: ['...hhhhhhhh.....', '..hhHhhhhHhh....', '..hhhhhhhhhhH...', '..hhhHhhhhHhh...', '..hhkkhhhkkhH...', '..hhhhhhhhhhH...', '..HhhhhhSShhH...', '..HhhhSkkkSH....', '...HhhhhhhHH....', '....HHHHHH......', '.....HHH........'],
  hulk: ['...hhhhhhhh.....', '..hhhhhhhhhh....', '.hssssssssssS...', '.hsssssssssss...', '.hswkssswkssS...', '.hssssssssssS...', '.SssssssssssS...', '.SssskkkkssS....', '..SssssssssS....', '...SSSSSSSS.....', '....SSSS........'],
  thanos: ['....gggggg......', '...gggggggg.....', '..gsssssssssS...', '..gsSsssSsssS...', '..gswkssswksS...', '..gsssssssssS...', '..SsSsssSsSsS...', '..SsSsqqqsSS....', '...SsSsSsSS.....', '....SSSSSS......', '.....SSS........'],
  joker: ['...hhhhhhhh.....', '..hhhhhhhhhh....', '.hhswwwwwwwhh...', '.hhwwwwwwwwwh...', '.hhwkkwwkkwwh...', '.hhwwwwwwwwwh...', '.hhrwwwwwwrwh...', '.hhrrrrrrrrh....', '.h..rrrrrrr.....', '....wwwwww......', '.....www........'],
  dredd: ['...gggggggg.....', '..gggggggggg....', '..gyyyyyyyyy....', '..ggkkkkkkkkk...', '..ggkkkkkkkkk...', '..ggsssssssS....', '..gGsssssssS....', '..gGsqqqqssS....', '...GsssssSS.....', '....SSSSSS......', '.....SSS........'],
  ironcowl: ['...gggggggg.....', '..gggggggggg....', '..gggGgggggg....', '..gwwgggwwgg....', '..ggggggggggG...', '..ggsssssssS....', '..gGsssssssS....', '..gGssqqqssS....', '...GsssssSS.....', '....SSSSSS......', '.....SSS........'],
  flash: ['...rrrrrrrr.....', '.yrrrrrrrrrry...', 'yyrrkkrrrkkrryy.', '..rrkwrrrkwrr...', '..rrssssssssS...', '..Rrsssssssss...', '..RrsssssssS....', '..Rrssqqqss.....', '...RsssssSS.....', '....SSSSSS......', '.....RRR........'],
  bender: ['......m.........', '......M.........', '....mmmmm.......', '...mmmmmmm......', '..mmkkkkkkk.....', '..mmkwwkwwk.....', '..mmkkkkkkk.....', '..mmmmmmmmM.....', '..mmwkwkwkM.....', '..MmwwwwwwM.....', '...MMMMMMM......'],
  spongebob: ['..ssssssssss....', '..sossssssos....', '..sswwsswwss....', '..swkwswkwSs....', '..sswwsswwss....', '..ossssssoss....', '..sqqqqqqqqs....', '..ssswwsssss....', '..osssssssos....', '..SSSSSSSSSS....', '..wwwwwwwwww....'],
  yoda: ['................', '................', '.....w..w.......', '....ssssss......', 'ss.sssssssS.ss..', 'sssskSsskSssss..', '.SsssssssssS....', '..SsSSsSSsS.....', '...SsqqqsS......', '....SSSSS.......', '....SSSS........'],
  groot: ['....l..l.l......', '...llLllLll.....', '..lLllllLlll....', '..llLlllllLl....', '..lwklllwkLl....', '..lLllllllll....', '..llLlllLlll....', '..lLlqqqllL.....', '...llLlllLl.....', '....lLLll.......', '.....lll........'],
  rocket: ['...h.....h......', '..hH....hH......', '..hhhhhhhhh.....', '.hhhhhhhhhhh....', '.hkkwkhkkwkh....', '.hkkkkhkkkkh....', '..hhhhwwhhh.....', '..hhwwwwkwh.....', '...hwwwwwh......', '....hhhhh.......', '.....hhh........'],
  alf: ['....hhhHhhhHhhh...', '...hhHhhhhHhhhHh..', 'sS.hhhhhhhhhhhhh..', 'sSShhhhhkkkhhkkh..', 'sSShhhhkkwhhhkwh..', '.sShhhhhhhhhSssS..', '..shhhhhhhhSssssS.', '..hhhhhhhhSsssssss', '..hhhhhhhhSssksksS', '..hhhhhqqqqqSsssS.', '...hhhhqqqqqqwq...'],
  furiosa: ['................', '...sssssssss....', '..sssssssssss...', '..ssssssssssS...', '..kkkkkkkskkS...', '..kkskssssksS...', '..kkssssssssS...', '..Ssssqqqss.....', '...SsssssSS.....', '....SSSSSS......', '.....SSS........'],
};

const P = { black: ['#24242c', '#121218'], ink: ['#18181c', '#08080a'], navy: ['#283a6a', '#18244a'], blue: ['#2a5ad8', '#1a3a98'], red: ['#c02828', '#801818'],
  green: ['#3a6a2a', '#24461a'], olive: ['#5a6a34', '#3c4822'], khaki: ['#b8a47a', '#8a7852'], brown: ['#7a4e2c', '#52331c'],
  tan: ['#a88a5a', '#7a603c'], grey: ['#6a6c74', '#46484e'], lgrey: ['#a8acb4', '#7a7e86'], white: ['#e8e8ec', '#b8b8c0'],
  yellow: ['#e8c030', '#b08c18'], purple: ['#6a3a9a', '#46246a'], orange: ['#e07020', '#a04a10'], denim: ['#3a5a8a', '#24406a'],
  leather: ['#3a2a20', '#22180e'], gold: ['#d8a838', '#a07820'], teal: ['#2a8a8a', '#1a5e5e'], maroon: ['#6a1a20', '#460e12'], pink: ['#e070a8', '#a84a7a'],
  gloss: ['#5a5a66', '#3a3a44'] };
const LEG = (pants, boots) => [pants[0], pants[1], (boots || ['#2a2420', '#16120e'])[0], (boots || ['#2a2420', '#16120e'])[1]];
const BOOT = { black: ['#141418', '#0a0a0c'], brown: ['#5a3c22', '#3a2614'], white: ['#d8d8dc', '#a8a8b0'], red: ['#a02020', '#681414'], gold: ['#c89830', '#8a6418'], grey: ['#4a4c54', '#2e3036'], yellow: ['#e8c030', '#b08c18'] };
const SKINLEG = (skin, boots) => [SKIN[skin][0], SKIN[skin][1], (boots || BOOT.brown)[0], (boots || BOOT.brown)[1]];

const HEROES2 = [
  kHero('dutchfin', 'Dutch Fin', 'Major Alan "Dutch" Schaefer (Predator)', { skin: 'tan', hair: 'short', hairCol: 'brown', eyes: 'angry', torso: { cut: 'tank', extras: ['bandolier', 'tags'] }, col: P.olive, legs: LEG(P.olive, BOOT.black), sig: 'rifle' }),
  kHero('jellydator', 'Jellydator', 'the Predator', { head: HEADS.predator, pal: { d: '#2a2418', m: '#8a8e98', M: '#5a5e68', g: '#6a7a3a', G: '#46522a', e: '#ff4020', s: '#7a8a46', S: '#56622e' }, torso: { cut: 'armor', extras: ['bandolier2'] }, col: P.olive, legs: LEG(['#6a7a3a', '#46522a'], BOOT.grey), arm: ['#7a8a46', '#56622e'], hand: ['#7a8a46', '#56622e'], sig: 'plasma' }),
  kHero('jellmando', 'Jellmando', 'John Matrix (Commando)', { skin: 'light', hair: 'short', hairCol: 'dbrown', eyes: 'angry', face: ['war'], pal: { v: '#3a4a2a' }, torso: { cut: 'tank', extras: ['bandolier', 'belt'] }, col: P.green, legs: LEG(P.olive, BOOT.black), sig: 'rocketl' }),
  kHero('martinjiggs', 'Martin Jiggs', 'Martin Riggs (Lethal Weapon)', { skin: 'light', hair: 'mullet', hairCol: 'brown', beard: 'stubble', torso: { cut: 'jacket' }, col: P.denim, col2: P.white, legs: LEG(P.denim, BOOT.brown), sig: 'beretta' }),
  kHero('rockyfinboa', 'Rocky Finboa', 'Rocky Balboa (Rocky)', { skin: 'light', hair: 'short', hairCol: 'black', eyes: 'tired', torso: { cut: 'bare' }, col: ['#e0b088', '#b07a58'], legs: LEG(['#e8e8ec', '#c02828'], BOOT.black), hand: ['#c02828', '#801818'], sig: 'glove' }),
  kHero('finmax', 'Fin Max', 'Max Rockatansky (Mad Max)', { skin: 'light', hair: 'messy', hairCol: 'brown', beard: 'stubble', eyes: 'angry', torso: { cut: 'leather', extras: ['pads'] }, col: P.leather, col2: ['#4a3a30', '#2a1e16'], legs: LEG(P.leather, BOOT.black), sig: 'sawedoff' }),
  kHero('snakefinskin', 'Snake Finskin', 'Snake Plissken (Escape from New York)', { skin: 'light', hair: 'longm', hairCol: 'brown', eyes: 'patch', beard: 'stubble', torso: { cut: 'tank', extras: ['belt'] }, col: P.black, legs: LEG(P.grey, BOOT.black), sig: 'uzi' }),
  kHero('jellybride', 'The Jelly Bride', 'The Bride / Beatrix Kiddo (Kill Bill)', { sex: 'f', skin: 'fair', hair: 'longf', hairCol: 'blond', torso: { cut: 'catsuit', extras: ['sidestripe'] }, col: P.yellow, col2: ['#f4dc70', '#e8c030'], legs: LEG(P.yellow, BOOT.yellow), sig: 'katana' }),
  kHero('impossifin', 'Mission Impossifin', 'Ethan Hunt (Mission: Impossible)', { skin: 'light', hair: 'side', hairCol: 'dbrown', torso: { cut: 'tee' }, col: P.black, legs: LEG(P.black, BOOT.black), sig: 'pistol' }),
  kHero('doublejelly7', 'Double Jelly Seven', 'James Bond 007', { skin: 'light', hair: 'slick', hairCol: 'dbrown', torso: { cut: 'suit', tie: false, extras: ['bowtie'] }, col: P.ink, accent: '#141418', legs: LEG(P.ink, BOOT.black), sig: 'ppk' }),
  kHero('jellyinblack', 'Jelly in Black', 'Agent J (Men in Black)', { skin: 'dark', hair: 'crew', hairCol: 'black', eyes: 'shades', torso: { cut: 'suit' }, col: P.ink, accent: '#141418', legs: LEG(P.ink, BOOT.black), sig: 'cricket' }),
  kHero('jellkman', 'Peter Jellkman', 'Peter Venkman (Ghostbusters)', { skin: 'light', hair: 'messy', hairCol: 'brown', torso: { cut: 'uniform', extras: ['pack', 'belt'] }, col: P.khaki, legs: LEG(P.khaki, BOOT.black), sig: 'proton' }),
  kHero('martymcjelly', 'Marty McJelly', 'Marty McFly (Back to the Future)', { skin: 'fair', hair: 'side', hairCol: 'brown', torso: { cut: 'jacket' }, col: P.red, col2: P.white, arm: P.denim, legs: LEG(P.denim, BOOT.white), sig: 'skateboard' }),
  kHero('finsolo', 'Fin Solo', 'Han Solo (Star Wars)', { skin: 'light', hair: 'side', hairCol: 'brown', torso: { cut: 'vestshirt', extras: ['holster', 'belt'] }, col: P.black, col2: ['#e8e4dc', '#b8b4ac'], arm: ['#e8e4dc', '#b8b4ac'], legs: LEG(P.navy, BOOT.black), sig: 'blaster' }),
  kHero('darthjelly', 'Darth Jelly', 'Darth Vader (Star Wars)', { head: HEADS.vader, pal: { g: '#2a2a32', G: '#16161a', M: '#5a5e68', m: '#8a8e98' }, torso: { cut: 'armor', extras: ['cape'], capeLen: 7 }, col: P.ink, cape: ['#1a1a1e', '#0a0a0c'], legs: LEG(P.ink, BOOT.black), arm: P.ink, hand: ['#1a1a1e', '#0a0a0c'], sig: 'saberred' }),
  kHero('jellolorian', 'The Jellolorian', 'Din Djarin (The Mandalorian)', { head: HEADS.mando, pal: { m: '#a8acb4', M: '#7a7e86' }, torso: { cut: 'armor', extras: ['cape'], capeLen: 5 }, col: P.lgrey, cape: ['#6a5a44', '#4a3e2e'], legs: LEG(['#6a5a44', '#4a3e2e'], BOOT.brown), arm: P.lgrey, hand: ['#3a2a20', '#22180e'], sig: 'amban' }),
  kHero('captainjirk', 'Captain Jirk', 'James T. Kirk (Star Trek)', { skin: 'light', hair: 'side', hairCol: 'brown', torso: { cut: 'bodysuit', emblem: 'delta' }, col: P.gold, legs: LEG(P.black, BOOT.black), sig: 'phaser' }),
  kHero('jackfinrow', 'Jack Finrow', 'Jack Sparrow (Pirates of the Caribbean)', { skin: 'tan', hair: 'dreads', beads: true, hairCol: 'black', beard: 'goatee', beardCol: 'black', hat: 'tricorn', hatCol: ['#3a2a20', '#22180e'], torso: { cut: 'coat', inner: true, extras: ['scarf', 'belt'] }, col: ['#3a2a20', '#22180e'], col2: P.white, extra: ['#b02020', '#781414'], legs: LEG(['#3a2a20', '#22180e'], BOOT.brown), sig: 'flintlock' }),
  kHero('jellagorn', 'Jellagorn', 'Aragorn (The Lord of the Rings)', { skin: 'light', hair: 'longm', hairCol: 'dbrown', beard: 'short', beardCol: 'dbrown', torso: { cut: 'coat', extras: ['belt'] }, col: ['#3a3e2c', '#24281a'], legs: LEG(['#3a3e2c', '#24281a'], BOOT.brown), sig: 'sword' }),
  kHero('harryfinter', 'Harry Finter', 'Harry Potter', { skin: 'fair', hair: 'messy', hairCol: 'black', eyes: 'glasses', face: ['scar'], torso: { cut: 'robe', extras: ['scarf'] }, col: P.ink, extra: ['#a02020', '#d8a838'], legs: LEG(P.ink, BOOT.black), sig: 'wand' }),
  kHero('domjelletto', 'Dom Jelletto', 'Dominic Toretto (Fast & Furious)', { skin: 'tan', hair: 'bald', eyes: 'angry', torso: { cut: 'tank', extras: ['chain'] }, col: P.white, legs: LEG(P.denim, BOOT.black), sig: 'shotgun' }),
  kHero('larajelly', 'Lara Jelly', 'Lara Croft (Tomb Raider)', { sex: 'f', skin: 'light', hair: 'ponytail', hairCol: 'brown', torso: { cut: 'tank', extras: ['holster', 'bandolier2'] }, col: P.teal, legs: LEG(P.khaki, BOOT.brown), sig: 'dual' }),
  kHero('captainjelly', 'Captain Jelly', 'Steve Rogers / Captain America (Marvel)', { head: ['...vvvvvvv......', '..vvvvvvvvv.....', '..vvvvwvvvvV....', '..vvvwwwvvvV....', '..vvssssssvV....', '..vvwkswksSV....', '..vSsssssssS....', '..vSssqqqsS.....', '...SsssssS......', '....SSSSS.......', '.....SSS........'], pal: { v: '#2a4ab0', V: '#1a2e78' }, torso: { cut: 'bodysuit', emblem: 'star', extras: ['stripes'] }, col: P.navy, col2: ['#c02828', '#801818'], glow: '#f0f0f4', legs: LEG(P.navy, BOOT.red), hand: ['#a02020', '#681414'], sig: 'shield' }),
  kHero('finthor', 'Finthor', 'Thor (Marvel)', { skin: 'light', hair: 'longm', hairCol: 'blond', beard: 'short', beardCol: 'dblond', torso: { cut: 'armor', extras: ['cape'], capeLen: 5 }, col: P.grey, cape: ['#b02020', '#781414'], pal: { m: '#5a5c64', M: '#3a3c42' }, legs: LEG(P.black, BOOT.grey), arm: ['#e0b088', '#b07a58'], sig: 'mjolnir' }),
  kHero('incrediblejelly', 'The Incredible Jelly', 'Bruce Banner / Hulk (Marvel)', { head: HEADS.hulk, skin: 'green', hairCol: 'black', torso: { cut: 'bare' }, col: ['#6aa84a', '#467a2e'], legs: LEG(P.purple, ['#6aa84a', '#467a2e']), sig: 'smash' }),
  kHero('spiderfin', 'Spider-Fin', 'Peter Parker / Spider-Man (Marvel)', { head: HEADS.spidey, pal: { r: '#d02828', R: '#901818' }, torso: { cut: 'bodysuit', emblem: 'spider' }, col: ['#d02828', '#901818'], glow: '#141418', legs: LEG(P.blue, ['#d02828', '#901818']), arm: ['#d02828', '#901818'], hand: ['#d02828', '#901818'], sig: 'web' }),
  kHero('wolverfin', 'Wolverfin', 'Logan / Wolverine (X-Men)', { skin: 'light', hair: 'spiky', hairCol: 'black', beard: 'chops', eyes: 'angry', torso: { cut: 'tank' }, col: P.white, legs: LEG(P.denim, BOOT.brown), sig: 'claws' }),
  kHero('jellypool', 'Jellypool', 'Wade Wilson / Deadpool (Marvel)', { head: HEADS.deadpool, pal: { r: '#c02020', R: '#801414' }, torso: { cut: 'bodysuit', extras: ['bandolier', 'belt'] }, col: ['#c02020', '#801414'], legs: LEG(['#c02020', '#801414'], BOOT.black), arm: ['#c02020', '#801414'], hand: ['#1a1a1e', '#0a0a0c'], sig: 'katanas' }),
  kHero('superfin', 'Superfin', 'Clark Kent / Superman (DC)', { skin: 'light', hair: 'quiff', hairCol: 'black', torso: { cut: 'bodysuit', emblem: 's', extras: ['cape'], capeLen: 6 }, col: P.blue, glow: '#d02828', accent: '#e8c030', cape: ['#c02020', '#801414'], legs: LEG(P.blue, BOOT.red), sig: 'heatvision' }),
  kHero('wonderjelly', 'Wonder Jelly', 'Diana Prince / Wonder Woman (DC)', { sex: 'f', skin: 'tan', hair: 'longf', hairCol: 'black', hat: 'tiara', torso: { cut: 'scoop', emblem: 'w', extras: ['belt'] }, col: ['#b02028', '#781418'], glow: '#e0b040', legs: SKINLEG('tan', BOOT.red), arm: SKIN.tan, hand: ['#c8c8d0', '#9a9aa4'], sig: 'lasso', pal: { l: '#e0b040' } }),
  kHero('sarahjellnor', 'Sarah Jellnor', 'Sarah Connor (Terminator 2)', { sex: 'f', skin: 'light', hair: 'ponytail', hairCol: 'dbrown', eyes: 'shades', torso: { cut: 'tank' }, col: P.black, legs: LEG(P.olive, BOOT.black), sig: 'rifle' }),
  kHero('t1000', 'The T-Thousfin', 'T-1000 (Terminator 2)', { skin: 'light', hair: 'crew', hairCol: 'dblond', torso: { cut: 'uniform', emblem: 'badge' }, col: P.navy, legs: LEG(P.navy, BOOT.black), sig: 'bladearm' }),
  kHero('vanjelly', 'Van Jelly', 'Jean-Claude Van Damme (his roles)', { skin: 'light', hair: 'side', hairCol: 'brown', torso: { cut: 'bare' }, col: ['#e0b088', '#b07a58'], legs: LEG(P.white, BOOT.white), sig: 'kick' }),
  kHero('douglasquelly', 'Douglas Quelly', 'Douglas Quaid (Total Recall)', { skin: 'light', hair: 'short', hairCol: 'dbrown', torso: { cut: 'tee' }, col: P.lgrey, legs: LEG(P.denim, BOOT.brown), sig: 'rifle' }),
  kHero('finnan', 'Finnan the Barbarian', 'Conan (Conan the Barbarian)', { skin: 'tan', hair: 'longm', hairCol: 'black', eyes: 'angry', torso: { cut: 'bare', extras: ['bandolier'] }, col: ['#c8956a', '#96643e'], legs: LEG(['#5a3c22', '#3a2614'], BOOT.brown), sig: 'broadsword' }),
  kHero('demolitionjelly', 'Demolition Jelly', 'John Spartan (Demolition Man)', { skin: 'light', hair: 'crew', hairCol: 'black', torso: { cut: 'uniform', extras: ['belt'] }, col: P.black, legs: LEG(P.black, BOOT.black), sig: 'magnum' }),
  kHero('findredd', 'Fin Dredd', 'Judge Dredd', { head: HEADS.dredd, pal: { g: '#2a2a32', G: '#16161a' }, torso: { cut: 'armor', extras: ['belt'], emblem: 'eagle' }, col: P.black, glow: '#e0b040', legs: LEG(P.black, BOOT.black), arm: P.black, hand: ['#1a1a1e', '#0a0a0c'], sig: 'lawgiver' }),
  kHero('finlander', 'The Finlander', 'Connor MacLeod (Highlander)', { skin: 'light', hair: 'ponytail', hairCol: 'brown', torso: { cut: 'coat', inner: true }, col: P.leather, col2: P.lgrey, legs: LEG(P.black, BOOT.black), sig: 'katana' }),
  kHero('bladefin', 'Bladefin', 'Blade', { skin: 'dark', hair: 'crew', hairCol: 'black', eyes: 'shades', torso: { cut: 'coat', extras: ['belt'] }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'glaive' }),
  kHero('xenojelly', 'Xenojelly', 'Xenomorph (Alien)', { head: HEADS.xeno, pal: { g: '#2a2a34', G: '#16161c', x: '#5a5e70', w: '#c8ccd8' }, torso: { cut: 'armor' }, col: ['#2a2a34', '#16161c'], pal2: { m: '#2a2a34', M: '#16161c' }, legs: LEG(['#2a2a34', '#16161c'], BOOT.black), arm: ['#2a2a34', '#16161c'], hand: ['#2a2a34', '#16161c'], sig: 'acidtail' }),
  kHero('furifin', 'Imperator Furifin', 'Imperator Furiosa (Mad Max: Fury Road)', { sex: 'f', skin: 'fair', hair: 'shaved', hairCol: 'brown', face: ['grease'], pal: { v: '#1a1a1e' }, torso: { cut: 'tank', extras: ['pads'] }, col: P.leather, legs: LEG(P.leather, BOOT.black), sig: 'rifle' }),
  kHero('egonfinler', 'Egon Finler', 'Egon Spengler (Ghostbusters)', { skin: 'fair', hair: 'curly', hairCol: 'brown', eyes: 'glasses', torso: { cut: 'uniform', extras: ['pack', 'belt'] }, col: P.khaki, legs: LEG(P.khaki, BOOT.black), sig: 'proton' }),
  kHero('docjelly', 'Doc Jelly', 'Dr. Emmett Brown (Back to the Future)', { skin: 'fair', hair: 'wild', hairCol: 'white', eyes: 'wide', torso: { cut: 'coat', inner: true }, col: P.white, col2: ['#e8c030', '#b08c18'], legs: LEG(P.grey, BOOT.black), sig: 'flux' }),
  kHero('lukeskyjelly', 'Luke Skyjelly', 'Luke Skywalker (Star Wars)', { skin: 'fair', hair: 'side', hairCol: 'dblond', torso: { cut: 'robe', extras: ['belt'] }, col: P.ink, legs: LEG(P.ink, BOOT.black), hand: ['#1a1a1e', '#0a0a0c'], sig: 'saber' }),
  kHero('princessjella', 'Princess Jella', 'Leia Organa (Star Wars)', { sex: 'f', skin: 'fair', hair: 'sidebun', hairCol: 'brown', torso: { cut: 'dress', extras: ['belt'], tail: 7 }, col: P.white, pal: { l: '#b8bcc4' }, legs: LEG(P.white, BOOT.white), sig: 'blaster' }),
  kHero('chewbjelly', 'Chewbjelly', 'Chewbacca (Star Wars)', { head: HEADS.chewie, pal: { h: '#7a5232', H: '#52361e' }, torso: { cut: 'fur', extras: ['bandolier'] }, col: ['#7a5232', '#52361e'], legs: LEG(['#7a5232', '#52361e'], ['#52361e', '#3a2414']), arm: ['#7a5232', '#52361e'], hand: ['#7a5232', '#52361e'], sig: 'bowcaster' }),
  kHero('bobafin', 'Boba Fin', 'Boba Fett (Star Wars)', { head: HEADS.boba, pal: { g: '#5a7a4a', G: '#3a5230', r: '#c02020' }, torso: { cut: 'armor', extras: ['pack', 'belt'] }, col: ['#6a7a5a', '#46523a'], legs: LEG(['#8a7a5a', '#5e523a'], BOOT.brown), arm: ['#8a7a5a', '#5e523a'], hand: ['#3a2a20', '#22180e'], sig: 'wristflame' }),
  kHero('spjelly', 'Mr. Spjelly', 'Spock (Star Trek)', { skin: 'fair', hair: 'bowl', hairCol: 'black', eyes: 'angry', over: ['................', '................', '...s............', '...s............'], torso: { cut: 'bodysuit', emblem: 'delta' }, col: P.blue, legs: LEG(P.black, BOOT.black), sig: 'pinch' }),
  kHero('barbojelly', 'Barbojelly', 'Hector Barbossa (Pirates of the Caribbean)', { skin: 'tan', hair: 'longm', hairCol: 'salt', beard: 'full', beardCol: 'salt', hat: 'tricorn', hatCol: ['#5a3a22', '#3a2414'], torso: { cut: 'coat', inner: true, extras: ['belt'] }, col: P.maroon, col2: P.white, legs: LEG(P.brown, BOOT.brown), sig: 'flintlock' }),
  kHero('fingalf', 'Fingalf', 'Gandalf (The Lord of the Rings)', { skin: 'fair', hair: 'longm', hairCol: 'grey', beard: 'wizard', beardCol: 'grey', hat: 'wizardtall', hatCol: ['#8a8c94', '#5a5c64'], top: ['..gG............', '..ggG...........', '...gggG.........'], torso: { cut: 'robe', extras: ['belt'] }, col: ['#8a8c94', '#62646c'], legs: LEG(['#8a8c94', '#62646c'], BOOT.brown), sig: 'staff' }),
  kHero('legojelly', 'Legojelly', 'Legolas (The Lord of the Rings)', { skin: 'fair', hair: 'longm', hairCol: 'platinum', over: ['................', '................', '...s............', '..ss............'], torso: { cut: 'jacket', extras: ['quiver', 'belt'] }, col: P.green, col2: ['#7a8a5a', '#56623a'], legs: LEG(['#5a4a34', '#3e3222'], BOOT.brown), sig: 'bow' }),
  kHero('maximjelly', 'Maximjelly', 'Maximus (Gladiator)', { skin: 'light', hair: 'crew', hairCol: 'dbrown', beard: 'short', beardCol: 'dbrown', torso: { cut: 'armor', extras: ['pads', 'belt'] }, col: P.leather, pal: { m: '#7a5232', M: '#52361e' }, legs: LEG(['#6a1a20', '#460e12'], BOOT.brown), arm: ['#e0b088', '#b07a58'], sig: 'gladius' }),
  kHero('leonifin', 'Leonifin', 'King Leonidas (300)', { skin: 'tan', hair: 'short', hairCol: 'black', beard: 'full', beardCol: 'black', hat: 'spartan', top: ['.....rrr........', '...rrrrrr.......', '...rrrrrrr......'], torso: { cut: 'bare', extras: ['cape'], capeLen: 5 }, col: ['#c8956a', '#96643e'], cape: ['#b02020', '#781414'], legs: LEG(['#5a3c22', '#3a2614'], BOOT.brown), sig: 'spear' }),
  kHero('jellyheart', 'Jellyheart', 'William Wallace (Braveheart)', { skin: 'light', hair: 'longm', hairCol: 'auburn', face: ['war'], pal: { v: '#3a6ab8' }, torso: { cut: 'tee', extras: ['bandolier', 'belt', 'stripes'] }, col: P.green, col2: ['#4a7ab0', '#2a4a7a'], legs: LEG(P.green, BOOT.brown), sig: 'claymore' }),
  kHero('jellinity', 'Jellinity', 'Trinity (The Matrix)', { sex: 'f', skin: 'pale', hair: 'pixie', hairCol: 'black', eyes: 'roundshades', lips: '#8a4a52', torso: { cut: 'catsuit', tail: 4 }, col: P.ink, col2: P.gloss, legs: LEG(P.ink, BOOT.black), sig: 'dual' }),
  kHero('agentfin', 'Agent Fin', 'Agent Smith (The Matrix)', { skin: 'light', hair: 'slick', hairCol: 'dbrown', eyes: 'shades', torso: { cut: 'suit' }, col: P.ink, accent: '#2a3a24', legs: LEG(P.ink, BOOT.black), sig: 'deagle' }),
  kHero('rickjellkard', 'Rick Jellkard', 'Rick Deckard (Blade Runner)', { skin: 'light', hair: 'messy', hairCol: 'brown', torso: { cut: 'coat', inner: true, extras: ['tie'] }, col: ['#6a5a44', '#4a3e2e'], col2: P.white, accent: '#3a3a40', legs: LEG(P.grey, BOOT.brown), sig: 'deckard' }),
  kHero('agentjellyk', 'Agent Jelly K', 'Agent K (Men in Black)', { skin: 'light', hair: 'crew', hairCol: 'salt', eyes: 'shades', torso: { cut: 'suit' }, col: P.ink, accent: '#141418', legs: LEG(P.ink, BOOT.black), sig: 'deatomizer' }),
  kHero('jasonfinne', 'Jason Finne', 'Jason Bourne (Bourne)', { skin: 'light', hair: 'crew', hairCol: 'brown', torso: { cut: 'jacket' }, col: P.grey, col2: P.black, legs: LEG(P.denim, BOOT.brown), sig: 'pistol' }),
  kHero('ivanjellgo', 'Ivan Jellgo', 'Ivan Drago (Rocky IV)', { skin: 'fair', hair: 'crew', hairCol: 'blond', eyes: 'angry', torso: { cut: 'bare' }, col: ['#ecc4a0', '#c0906c'], legs: LEG(['#c02828', '#801818'], BOOT.white), hand: ['#c02828', '#801818'], sig: 'glove' }),
  kHero('blackjellow', 'Black Jellow', 'Natasha Romanoff / Black Widow (Marvel)', { sex: 'f', skin: 'fair', hair: 'bob', hairCol: 'red', torso: { cut: 'catsuit', emblem: 'hourglass', extras: ['belt'] }, col: P.ink, col2: P.gloss, glow: '#c02020', legs: LEG(P.ink, BOOT.black), sig: 'batons' }),
  kHero('hawkfin', 'Hawkfin', 'Clint Barton / Hawkeye (Marvel)', { skin: 'light', hair: 'crew', hairCol: 'dblond', torso: { cut: 'vest', extras: ['quiver'] }, col: P.purple, col2: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'bow' }),
  kHero('blackfinther', 'Black Finther', "T'Challa / Black Panther (Marvel)", { head: ['..mk.....km.....', '..kkkkkkkkk.....', '..kkkkkkkkkk....', '..kkkkkkkkkk....', '..kkwwkkwwkk....', '..kkkkkkkkkk....', '..kkkkkmkkkk....', '...kkkkkkkk.....', '....kkkpkk......', '....kkkkkk......', '.....kkk........'], pal: { p: '#a8a0d8', k: '#1a1a22', m: '#b8bcc8', w: '#e8e8f0', y: '#c8ccd8' }, torso: { cut: 'bodysuit', extras: ['necklace'] }, col: ['#1a1a22', '#0e0e14'], pal2: 1, legs: LEG(['#1a1a22', '#0e0e14'], BOOT.black), arm: ['#1a1a22', '#0e0e14'], hand: ['#1a1a22', '#0e0e14'], sig: 'claws' }),
  kHero('doctorjelly', 'Doctor Jelly', 'Stephen Strange / Doctor Strange (Marvel)', { skin: 'light', hair: 'slick', hairCol: 'black', beard: 'goatee', beardCol: 'salt', torso: { cut: 'robe', extras: ['cape', 'belt'], capeLen: 5 }, col: P.navy, cape: ['#b02020', '#781414'], legs: LEG(P.navy, BOOT.brown), sig: 'eldritch' }),
  kHero('finos', 'Finos', 'Thanos (Marvel)', { head: HEADS.thanos, skin: 'purple', hatCol: ['#d8a838', '#a07820'], torso: { cut: 'armor' }, col: P.gold, pal: { m: '#d8a838', M: '#a07820' }, legs: LEG(['#2a3a8a', '#1a2660'], BOOT.gold), arm: ['#8a6aa8', '#5e4478'], hand: ['#d8a838', '#a07820'], sig: 'snap' }),
  kHero('jelloki', 'Jelloki', 'Loki (Marvel)', { skin: 'pale', hair: 'shoulder', hairCol: 'black', hat: 'horns', top: ['.y.......y......', '.yy......yy.....', '..yy......yy....'], torso: { cut: 'coat', inner: true, extras: ['cape'] }, col: P.green, col2: P.ink, cape: ['#2a6a2a', '#1a461a'], legs: LEG(P.ink, BOOT.black), sig: 'sceptre' }),
  kHero('jelloker', 'The Jelloker', 'The Joker (DC)', { head: HEADS.joker, pal: { h: '#3a8a2a', H: '#24581a' }, torso: { cut: 'suit', extras: ['tie'] }, col: P.purple, col2: ['#3a8a2a', '#24581a'], accent: '#e07020', legs: LEG(P.purple, BOOT.black), sig: 'bang' }),
  kHero('harleyfinn', 'Harley Finn', 'Harley Quinn (DC)', { sex: 'f', skin: 'white', hair: 'pigtails', hairCol: 'platinum', lips: '#c82848', pal: { v: '#2a5ad8', V: '#1a3a98', r: '#d02848', R: '#901830' }, torso: { cut: 'jacket', extras: ['belt'] }, col: ['#c02040', '#801428'], col2: ['#e8e8ec', '#b8b8c0'], legs: LEG(['#2a5ad8', '#1a3a98'], BOOT.black), sig: 'bat' }),
  kHero('aquajelly', 'Aquajelly', 'Arthur Curry / Aquaman (DC)', { skin: 'tan', hair: 'longm', hairCol: 'dbrown', beard: 'full', beardCol: 'dbrown', torso: { cut: 'armor', extras: ['belt'] }, col: ['#d8a838', '#a07820'], pal: { m: '#d8a838', M: '#3a8a5a' }, legs: LEG(['#2a6a4a', '#1a4a32'], ['#2a6a4a', '#1a4a32']), arm: SKIN.tan, sig: 'trident' }),
  kHero('thefin', 'The Fin', 'Barry Allen / The Flash (DC)', { head: HEADS.flash, torso: { cut: 'bodysuit', emblem: 'bolt' }, col: ['#c02020', '#801414'], glow: '#f0d040', legs: LEG(['#c02020', '#801414'], BOOT.gold), arm: ['#c02020', '#801414'], hand: ['#c02020', '#801414'], sig: 'lightning' }),
  kHero('macjelly', 'MacJelly', 'Angus MacGyver (MacGyver)', { skin: 'light', hair: 'feathered', hairCol: 'dblond', face: ['smile'], torso: { cut: 'leather' }, col: P.brown, col2: ['#7a5a3a', '#5a3e26'], extra: P.grey, legs: LEG(P.denim, BOOT.brown), sig: 'swissknife' }),
  kHero('bajellracus', 'B.A. Jellracus', 'B.A. Baracus (The A-Team)', { skin: 'dark', hair: 'mohawk', hairCol: 'black', beard: 'horseshoe', beardCol: 'black', eyes: 'angry', torso: { cut: 'vest', extras: ['chain', 'necklace'] }, col: P.denim, legs: LEG(P.olive, BOOT.brown), sig: 'm60' }),
  kHero('jelldellwalker', 'Jelldell Walker', 'Cordell Walker (Walker, Texas Ranger)', { skin: 'light', hair: 'short', hairCol: 'auburn', beard: 'full', beardCol: 'auburn', hat: 'cowboy', hatCol: ['#d8c8a8', '#a8987a'], torso: { cut: 'shirt', extras: ['belt'] }, col: P.denim, legs: LEG(P.denim, BOOT.brown), sig: 'kick' }),
  kHero('michaeljelly', 'Michael Jelly', 'Michael Knight (Knight Rider)', { skin: 'light', hair: 'curly', hairCol: 'brown', torso: { cut: 'leather' }, col: P.ink, legs: LEG(P.denim, BOOT.black), sig: 'pistol' }),
  kHero('heisenfin', 'Heisenfin', 'Walter White / Heisenberg (Breaking Bad)', { skin: 'fair', hair: 'bald', beard: 'goatee', beardCol: 'brown', eyes: 'glasses', hat: 'fedora', hatCol: ['#24242c', '#121218'], torso: { cut: 'jacket' }, col: P.khaki, col2: P.white, legs: LEG(P.khaki, BOOT.brown), sig: 'm60' }),
  kHero('rickjellimes', 'Rick Jellimes', 'Rick Grimes (The Walking Dead)', { skin: 'light', hair: 'curly', hairCol: 'dbrown', beard: 'short', beardCol: 'dbrown', torso: { cut: 'uniform', emblem: 'badge', extras: ['belt'] }, col: P.khaki, legs: LEG(P.brown, BOOT.brown), sig: 'python' }),
  kHero('jonfin', 'Jon Fin', 'Jon Snow (Game of Thrones)', { skin: 'fair', hair: 'shoulder', hairCol: 'black', beard: 'short', beardCol: 'black', torso: { cut: 'coat', extras: ['belt', 'cape'] }, col: P.ink, cape: ['#3a3430', '#22201c'], legs: LEG(P.ink, BOOT.black), sig: 'longclaw' }),
  kHero('elfin', 'Elfin', 'Eleven (Stranger Things)', { sex: 'f', skin: 'fair', hair: 'shaved', hairCol: 'brown', face: ['blood'], torso: { cut: 'dress' }, col: P.pink, legs: SKINLEG('fair', BOOT.white), sig: 'psychic' }),
  kHero('finnyslayer', 'Finny the Vampire Slayer', 'Buffy Summers (Buffy)', { sex: 'f', skin: 'fair', hair: 'longf', hairCol: 'blond', torso: { cut: 'leather' }, col: P.maroon, legs: LEG(P.ink, BOOT.black), sig: 'stake' }),
  kHero('xefina', 'Xefina', 'Xena (Xena: Warrior Princess)', { sex: 'f', skin: 'light', hair: 'longf', hairCol: 'black', torso: { cut: 'armor', extras: ['pads'] }, col: P.leather, pal: { m: '#5a3c22', M: '#3a2614' }, col2: ['#c89830', '#8a6418'], legs: SKINLEG('light', BOOT.brown), arm: SKIN.light, sig: 'chakram' }),
  kHero('jellogu', 'Jellogu', 'Grogu (The Mandalorian)', { head: HEADS.grogu, pal: { s: '#8ab86a', S: '#5e8a46' }, torso: { cut: 'robe', tail: 6, closed: true }, col: ['#a8946a', '#7a6a48'], noLegs: true, legs: LEG(['#a8946a', '#7a6a48'], ['#a8946a', '#7a6a48']), arm: ['#a8946a', '#7a6a48'], hand: ['#8ab86a', '#5e8a46'], sig: 'force' }),
  kHero('homejelly', 'Homejelly', 'Homelander (The Boys)', { skin: 'fair', hair: 'slick', hairCol: 'blond', torso: { cut: 'bodysuit', emblem: 'eagle', extras: ['cape', 'chain'], capeLen: 6 }, col: P.navy, glow: '#e0b040', cape: ['#e8e8ec', '#c02828'], legs: LEG(P.navy, BOOT.red), sig: 'laser' }),
  kHero('hellfin', 'Hellfin', 'Hellboy', { skin: 'red', hair: 'topbun', hairCol: 'black', eyes: 'angry', over: ['................', '................', '...HH...HH......'], torso: { cut: 'coat', inner: true, extras: ['belt'] }, col: P.brown, col2: P.ink, legs: LEG(P.ink, BOOT.black), hand: ['#6a6c74', '#46484e'], sig: 'samaritan' }),
  kHero('jellycrow', 'The Jelly Crow', 'Eric Draven (The Crow)', { skin: 'white', hair: 'longm', hairCol: 'black', over: ['................', '................', '.....k...k......', '.....k...k......', '....km..km......', '.....k...k......', '................', '......kkk.......', '.......k........'], torso: { cut: 'coat' }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'pistol' }),
  kHero('jellydude', 'The Jelly Dude', 'The Dude (The Big Lebowski)', { skin: 'light', hair: 'shoulder', hairCol: 'brown', beard: 'full', beardCol: 'brown', eyes: 'tired', torso: { cut: 'robe', inner: true, tail: 3 }, col: ['#a8946a', '#7a6a48'], col2: P.white, legs: LEG(P.khaki, ['#b8a080', '#8a7454']), sig: 'bowling' }),
  kHero('tylerfinden', 'Tyler Finden', 'Tyler Durden (Fight Club)', { skin: 'light', hair: 'spiky', hairCol: 'dblond', torso: { cut: 'leather' }, col: ['#7a2018', '#521410'], legs: LEG(P.black, BOOT.brown), sig: 'punch' }),
  kHero('noname', 'The Jelly with No Name', 'The Man with No Name (Dollars trilogy)', { skin: 'tan', hair: 'short', hairCol: 'brown', beard: 'stubble', eyes: 'angry', hat: 'cowboy', hatCol: ['#8a6440', '#5e4228'], torso: { cut: 'tee', extras: ['belt'] }, col: ['#8a6a3a', '#5a4c26'], over: ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', 'jjjjjjjjjjjjjj..', 'jJjjjujjujjjJj..', 'jjjujjjjjjujjj..'], col2: ['#c8a870', '#8a7044'], legs: LEG(P.khaki, BOOT.brown), sig: 'colt' }),
  kHero('jellango', 'Jellango', 'Django (Django Unchained)', { skin: 'dark', hair: 'short', hairCol: 'black', beard: 'goatee', beardCol: 'black', eyes: 'roundshades', hat: 'cowboy', hatCol: ['#3a2a20', '#22180e'], torso: { cut: 'coat', inner: true }, col: ['#3a6a4a', '#24462e'], col2: P.white, legs: LEG(P.brown, BOOT.brown), sig: 'colt' }),
  kHero('alanfint', 'Alan Fint', 'Dr. Alan Grant (Jurassic Park)', { skin: 'light', hair: 'short', hairCol: 'brown', beard: 'short', beardCol: 'brown', hat: 'fedora', hatCol: ['#b8a47a', '#8a7852'], torso: { cut: 'shirt', extras: ['scarf'] }, col: P.denim, extra: ['#c02020', '#801818'], legs: LEG(P.khaki, BOOT.brown), sig: 'flare' }),
  kHero('katfin', 'Katfin Everdeen', 'Katniss Everdeen (The Hunger Games)', { sex: 'f', skin: 'light', hair: 'braid', hairCol: 'dbrown', torso: { cut: 'leather', extras: ['quiver'] }, col: P.leather, legs: LEG(P.ink, BOOT.brown), sig: 'bow' }),
  kHero('freddyjellger', 'Freddy Jellger', 'Freddy Krueger (A Nightmare on Elm Street)', { head: HEADS.freddy, pal: { s: '#c87a5a', S: '#8a4a34', r: '#7a2a20', g: '#5a4a34', G: '#3a2e20' }, torso: { cut: 'bodysuit', extras: ['stripes'] }, col: ['#a82020', '#701414'], col2: ['#2a6a2a', '#1a461a'], legs: LEG(P.brown, BOOT.brown), sig: 'freddyglove' }),
  kHero('jellsonvoorhees', 'Jellson Voorhees', 'Jason Voorhees (Friday the 13th)', { head: HEADS.hockey, torso: { cut: 'jacket' }, col: ['#4a4e3a', '#30342a'], col2: P.grey, legs: LEG(['#3a3a34', '#24241e'], BOOT.black), sig: 'machete' }),
  kHero('michaelfiners', 'Michael Finers', 'Michael Myers (Halloween)', { head: HEADS.myers, pal: { h: '#3a2a20', H: '#22180e' }, torso: { cut: 'uniform' }, col: ['#3a4a5e', '#24303e'], legs: LEG(['#3a4a5e', '#24303e'], BOOT.black), sig: 'knife' }),
  kHero('jellcky', 'Jellcky', 'Chucky (Child\'s Play)', { head: HEADS.chucky, pal: { o: '#d8582a', O: '#a8401a' }, torso: { cut: 'vest', extras: ['stripes'] }, col: P.denim, col2: ['#c02020', '#e8e8ec'], arm: ['#c02020', '#801818'], legs: LEG(P.denim, BOOT.white), sig: 'knife' }),
  kHero('leatherfin', 'Leatherfin', 'Leatherface (The Texas Chainsaw Massacre)', { head: HEADS.leatherface, pal: { w: '#d8b898', W: '#a8886a', h: '#3a2a20', H: '#22180e' }, torso: { cut: 'shirt', extras: ['tie'] }, col: ['#c8c0b0', '#9a9284'], accent: '#3a2a20', over: ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '..llllllllll....', '..llllllllll....', '..lllllllllll...', '..lllllllllll...', '..lllllllllll...', '..llllllllll....', '..llllllllll....'], legs: LEG(P.brown, BOOT.brown), sig: 'chainsaw' }),
  kHero('ghostfin', 'Ghostfin', 'Ghostface (Scream)', { head: HEADS.ghostface, torso: { cut: 'robe', tail: 6 }, col: ['#1a1a1e', '#0a0a0c'], legs: LEG(['#1a1a1e', '#0a0a0c'], BOOT.black), arm: ['#1a1a1e', '#0a0a0c'], hand: ['#1a1a1e', '#0a0a0c'], sig: 'knife' }),
  kHero('pinfin', 'Pinfin', 'Pinhead (Hellraiser)', { head: HEADS.pinhead, pal: { s: '#ecece8', S: '#b8b8b4', m: '#4a4c54' }, torso: { cut: 'robe', extras: ['belt'] }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'chains' }),
  kHero('pennyjelly', 'Pennyjelly', 'Pennywise (It)', { head: HEADS.pennywise, pal: { o: '#e86a1c', w: '#ecece8', W: '#b8b8b4' }, torso: { cut: 'bodysuit', extras: ['collar'] }, col: ['#c8c4b8', '#9a968a'], col2: ['#ecece8', '#b8b8b4'], legs: LEG(['#c8c4b8', '#9a968a'], BOOT.white), hand: ['#ecece8', '#b8b8b4'], sig: 'balloon' }),
  kHero('hanniballjellter', 'Hannibal Jellter', 'Hannibal Lecter', { skin: 'fair', hair: 'slick', hairCol: 'salt', over: ['................', '................', '................', '................', '................', '....mmmmmmm.....', '....mkmkmkm.....', '....mmmmmmm.....', '................'], pal: { m: '#b8bcc4' }, torso: { cut: 'uniform' }, col: P.white, legs: LEG(P.white, BOOT.white), sig: 'scalpel' }),
  kHero('jigfin', 'Jigfin', 'Jigsaw / John Kramer (Saw)', { head: HEADS.jigsaw, pal: { s: '#ecc4a0', S: '#c0906c' }, torso: { cut: 'robe' }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'saw' }),
  kHero('ashjelliams', 'Ash Jelliams', 'Ash Williams (Evil Dead)', { skin: 'light', hair: 'quiff', hairCol: 'dbrown', beard: 'stubble', torso: { cut: 'shirt', extras: ['bandolier'] }, col: P.denim, legs: LEG(P.khaki, BOOT.brown), sig: 'boomstick' }),
  kHero('jellchete', 'Jellchete', 'Machete', { skin: 'tan', hair: 'longm', hairCol: 'black', beard: 'horseshoe', beardCol: 'black', eyes: 'angry', face: ['cheekscar'], torso: { cut: 'vest', extras: ['bandolier'] }, col: P.leather, legs: LEG(P.ink, BOOT.black), sig: 'machete' }),
  kHero('barneyfinn', 'Barney Finn', 'Barney Ross (The Expendables)', { skin: 'light', hair: 'slick', hairCol: 'black', beard: 'stubble', torso: { cut: 'vest', extras: ['tags'] }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'aa12' }),
  kHero('leejellmas', 'Lee Jellmas', 'Lee Christmas (The Expendables)', { skin: 'light', hair: 'shaved', hairCol: 'dbrown', beard: 'stubble', torso: { cut: 'leather' }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'knives' }),
  kHero('jelldock', 'Col. James Jelldock', 'Col. James Braddock (Missing in Action)', { skin: 'light', hair: 'short', hairCol: 'auburn', beard: 'full', beardCol: 'auburn', torso: { cut: 'tank', extras: ['bandolier'] }, col: P.olive, legs: LEG(P.olive, BOOT.black), sig: 'm60' }),
  kHero('chucknorfin', 'Chuck Norfin', 'Chuck Norris (his roles)', { skin: 'light', hair: 'short', hairCol: 'auburn', beard: 'full', beardCol: 'auburn', eyes: 'angry', torso: { cut: 'shirt' }, col: P.denim, legs: LEG(P.denim, BOOT.brown), sig: 'kick' }),
  kHero('jellofessional', 'The Jellofessional', 'Léon (Léon: The Professional)', { skin: 'light', hair: 'crew', hairCol: 'dbrown', beard: 'stubble', eyes: 'roundshades', hat: 'beanie', hatCol: ['#24242c', '#121218'], torso: { cut: 'coat', inner: true }, col: ['#5a5244', '#3e382e'], col2: P.white, legs: LEG(P.grey, BOOT.black), sig: 'beretta' }),
  kHero('desperajelly', 'Desperajelly', 'El Mariachi (Desperado)', { skin: 'tan', hair: 'longm', hairCol: 'black', beard: 'stubble', beardCol: 'black', torso: { cut: 'suit', tie: false }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'guitarcase' }),
  kHero('jellyshiptrooper', 'Jellyship Trooper', 'Johnny Rico (Starship Troopers)', { skin: 'light', hair: 'crew', hairCol: 'brown', hat: 'helmet', hatCol: ['#5a6a8a', '#3a4660'], torso: { cut: 'armor', extras: ['belt'] }, col: ['#5a6a8a', '#3a4660'], pal: { m: '#6a7a9a', M: '#46526a' }, legs: LEG(['#4a5a7a', '#2e3a52'], BOOT.black), sig: 'morita' }),
  kHero('burtjellmer', 'Burt Jellmer', 'Burt Gummer (Tremors)', { skin: 'light', hair: 'crew', hairCol: 'brown', beard: 'chevron', beardCol: 'brown', hat: 'cap', hatCol: ['#5a6a34', '#3c4822'], torso: { cut: 'shirt', extras: ['bandolier', 'belt'] }, col: P.olive, legs: LEG(P.olive, BOOT.black), sig: 'elephantgun' }),
  kHero('chevjellios', 'Chev Jellios', 'Chev Chelios (Crank)', { skin: 'light', hair: 'shaved', hairCol: 'dbrown', beard: 'stubble', torso: { cut: 'suit', tie: false }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'pistol' }),
  kHero('caseyjellback', 'Casey Jellback', 'Casey Ryback (Under Siege)', { skin: 'light', hair: 'ponytail', hairCol: 'black', eyes: 'tired', torso: { cut: 'uniform', extras: ['belt'] }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'knife' }),
  kHero('sethfinndle', 'Seth Finndle', 'Seth Brundle (The Fly)', { skin: 'light', hair: 'curly', hairCol: 'black', eyes: 'wide', torso: { cut: 'leather' }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'acid' }),
  kHero('jellyteer', 'The Jellyteer', 'Cliff Secord (The Rocketeer)', { skin: 'light', hair: 'short', hairCol: 'brown', hat: 'pilot', hatCol: ['#d8a838', '#a07820'], torso: { cut: 'leather', extras: ['pack'] }, col: P.brown, pal: { m: '#c8ccd4', M: '#8a8e98' }, legs: LEG(P.khaki, BOOT.brown), sig: 'mauser' }),
  kHero('jellden', 'Jellden', 'Raiden (Mortal Kombat)', { skin: 'fair', hair: 'longm', hairCol: 'white', eyes: 'glow', glow: '#9ff6ff', hat: 'straw', hatCol: ['#d8c8a0', '#a89870'], top: ['......gG........', '.....gggG.......'], torso: { cut: 'robe', extras: ['belt'] }, col: P.white, pal: { l: '#2a5ad8' }, legs: LEG(P.white, BOOT.white), sig: 'lightning' }),
  kHero('finlee', 'Fin Lee', 'Bruce Lee (his roles)', { skin: 'light', hair: 'side', hairCol: 'black', torso: { cut: 'catsuit', extras: ['sidestripe'] }, col: P.yellow, col2: ['#f4dc70', '#e8c030'], legs: LEG(P.yellow, BOOT.black), sig: 'nunchaku' }),
  kHero('dirtyfinny', 'Dirty Finny', 'Harry Callahan (Dirty Harry)', { skin: 'light', hair: 'side', hairCol: 'brown', eyes: 'angry', torso: { cut: 'suit' }, col: ['#7a6a4a', '#56482e'], accent: '#8a3a2a', legs: LEG(['#6a5a3a', '#4a3e26'], BOOT.brown), sig: 'magnum' }),
  kHero('boondockjellies', 'The Boondock Jellies', 'Connor & Murphy MacManus (The Boondock Saints)', { skin: 'fair', hair: 'short', hairCol: 'dbrown', beard: 'stubble', torso: { cut: 'coat', inner: true }, col: P.ink, col2: P.grey, legs: LEG(P.denim, BOOT.black), sig: 'dual' }),
  kHero('cherryjellying', 'Cherry Jellying', 'Cherry Darling (Planet Terror)', { sex: 'f', skin: 'fair', hair: 'longf', hairCol: 'black', lips: '#c82030', torso: { cut: 'dress', tail: 2 }, col: P.red, legs: SKINLEG('fair', BOOT.black), sig: 'leggun' }),
  kHero('drunkenfinster', 'Drunken Finster', 'Wong Fei-hung (Drunken Master)', { skin: 'light', hair: 'ponytail', hairCol: 'black', eyes: 'tired', torso: { cut: 'robe', extras: ['belt'], tail: 3 }, col: ['#c8b08a', '#9a845e'], legs: LEG(P.ink, BOOT.black), sig: 'punch' }),
  kHero('rjjellready', 'R.J. Jellready', 'R.J. MacReady (The Thing)', { skin: 'light', hair: 'shoulder', hairCol: 'brown', beard: 'full', beardCol: 'brown', hat: 'cowboy', hatCol: ['#5a3a22', '#3a2414'], torso: { cut: 'coat', inner: true, extras: ['belt'] }, col: P.brown, col2: ['#e8e8ec', '#b8b8c0'], legs: LEG(P.khaki, BOOT.brown), sig: 'flamer' }),
  kHero('finiversal', 'Finiversal Soldier', 'Luc Deveraux (Universal Soldier)', { skin: 'light', hair: 'crew', hairCol: 'brown', over: ['................', '................', '................', '................', '.......mmmm.....'], torso: { cut: 'armor', extras: ['belt'] }, col: P.black, pal: { m: '#4a4c54', M: '#2e3036' }, legs: LEG(P.black, BOOT.black), sig: 'rifle' }),
  kHero('timejelly', 'Time Jelly', 'Max Walker (Timecop)', { skin: 'light', hair: 'slick', hairCol: 'brown', torso: { cut: 'uniform', extras: ['belt'] }, col: P.black, legs: LEG(P.black, BOOT.black), sig: 'pistol' }),
  kHero('sheljelly', 'Sheljelly Cooper', 'Sheldon Cooper (The Big Bang Theory)', { skin: 'fair', hair: 'side', hairCol: 'brown', torso: { cut: 'tee', emblem: 'bolt' }, col: ['#c02828', '#801818'], glow: '#f0d040', arm: ['#5a6a8a', '#3a4660'], legs: LEG(P.khaki, BOOT.brown), sig: 'lizardspock' }),
  kHero('pennyfin', 'Pennyfin', 'Penny (The Big Bang Theory)', { sex: 'f', skin: 'fair', hair: 'longf', hairCol: 'blond', torso: { cut: 'scoop' }, col: P.pink, legs: LEG(P.denim, BOOT.brown), sig: 'cheesecake' }),
  kHero('howjelly', 'Howjelly Wolowitz', 'Howard Wolowitz (The Big Bang Theory)', { skin: 'fair', hair: 'bowl', hairCol: 'dbrown', torso: { cut: 'tee', extras: ['belt'] }, col: ['#a83a8a', '#7a2464'], legs: LEG(['#c8a838', '#9a7c20'], BOOT.white), sig: 'roverarm' }),
  kHero('charlieharpfin', 'Charlie Harpfin', 'Charlie Harper (Two and a Half Men)', { skin: 'light', hair: 'short', hairCol: 'dbrown', beard: 'stubble', torso: { cut: 'shirt', extras: ['stripes'] }, col: ['#d8c8a0', '#a8987a'], col2: ['#c06a2a', '#8a4a18'], legs: LEG(P.khaki, BOOT.white), sig: 'piano' }),
  kHero('alanharpjelly', 'Alan Harpjelly', 'Alan Harper (Two and a Half Men)', { skin: 'fair', hair: 'receding', hairCol: 'brown', torso: { cut: 'vest' }, col: ['#7a8aa8', '#56627a'], col2: ['#e8e8ec', '#b8b8c0'], arm: ['#e8e8ec', '#b8b8c0'], legs: LEG(P.khaki, BOOT.brown), sig: 'chiro' }),
  kHero('joeytribbjelly', 'Joey Tribbjelly', 'Joey Tribbiani (Friends)', { skin: 'tan', hair: 'slick', hairCol: 'black', torso: { cut: 'leather' }, col: P.leather, legs: LEG(P.denim, BOOT.black), sig: 'meatballsub' }),
  kHero('rossgellfin', 'Ross Gellfin', 'Ross Geller (Friends)', { skin: 'light', hair: 'short', hairCol: 'dbrown', torso: { cut: 'jacket' }, col: ['#5a4a3a', '#3e3226'], col2: ['#a8b8c8', '#7a8a9a'], legs: LEG(P.khaki, BOOT.brown), sig: 'pivot' }),
  kHero('chandlerbjelly', 'Chandler Bjelly', 'Chandler Bing (Friends)', { skin: 'fair', hair: 'side', hairCol: 'brown', torso: { cut: 'vestshirt' }, col: ['#4a5a7a', '#2e3a52'], col2: ['#8a7a5a', '#5e523a'], legs: LEG(P.khaki, BOOT.brown), sig: 'duck' }),
  kHero('barneystinfin', 'Barney Stinfin', 'Barney Stinson (How I Met Your Mother)', { skin: 'fair', hair: 'slick', hairCol: 'dblond', torso: { cut: 'suit' }, col: ['#3a3e4a', '#22262e'], accent: '#c02828', legs: LEG(['#3a3e4a', '#22262e'], BOOT.black), sig: 'suitup' }),
  kHero('homerjellpson', 'Homer Jellpson', 'Homer Simpson (The Simpsons)', { skin: 'yellow', hair: 'bald', beard: 'stubble', beardCol: 'brown', eyes: 'wide', over: ['......k.k.......'], torso: { cut: 'shirt', fat: true }, col: P.white, legs: LEG(['#5a7ab8', '#3a5a8a'], ['#3a2a20', '#22180e']), sig: 'donut' }),
  kHero('bartjellpson', 'Bart Jellpson', 'Bart Simpson (The Simpsons)', { skin: 'yellow', hair: 'spiky', hairCol: 'blond', eyes: 'wide', pal: { h: '#f2d230', H: '#c8a818' }, torso: { cut: 'tee' }, col: ['#e8582a', '#b03a14'], legs: LEG(['#2a5ad8', '#1a3a98'], BOOT.white), hand: ['#f2d230', '#c8a818'], sig: 'slingshot' }),
  kHero('petergrifjelly', 'Peter Grifjelly', 'Peter Griffin (Family Guy)', { skin: 'pale', hair: 'short', hairCol: 'dbrown', eyes: 'bigglasses', torso: { cut: 'shirt', fat: true }, col: P.white, legs: LEG(['#3a6a2a', '#24461a'], BOOT.black), sig: 'beerbottle' }),
  kHero('cartjelly', 'Cartjelly', 'Eric Cartman (South Park)', { skin: 'pale', hair: 'short', hairCol: 'brown', hat: 'beanie', hatCol: ['#2a9ab8', '#e0c040'], torso: { cut: 'jacket' }, col: ['#c02828', '#801818'], col2: ['#e0c040', '#b09018'], legs: LEG(['#8a6a3a', '#5e482a'], BOOT.black), sig: 'cheesypoofs' }),
  kHero('benderfin', 'Benderfin', 'Bender (Futurama)', { head: HEADS.bender, pal: { m: '#a8acb8', M: '#70747e' }, torso: { cut: 'armor' }, col: ['#a8acb8', '#70747e'], legs: LEG(['#a8acb8', '#70747e'], BOOT.grey), arm: ['#a8acb8', '#70747e'], hand: ['#a8acb8', '#70747e'], sig: 'girder' }),
  kHero('dougheffjelly', 'Doug Heffjelly', 'Doug Heffernan (The King of Queens)', { skin: 'fair', hair: 'crew', hairCol: 'dbrown', torso: { cut: 'uniform', emblem: 'badge' }, col: ['#6a4e2a', '#46331c'], legs: LEG(['#6a4e2a', '#46331c'], BOOT.black), sig: 'ipsbox' }),
  kHero('albunfin', 'Al Bunfin', 'Al Bundy (Married... with Children)', { skin: 'light', hair: 'side', hairCol: 'black', eyes: 'tired', torso: { cut: 'shirt', extras: ['tie'] }, col: P.white, accent: '#3a3e6a', legs: LEG(['#3a3a40', '#24242a'], BOOT.black), sig: 'shoehorn' }),
  kHero('haljelly', 'Haljelly', 'Hal (Malcolm in the Middle)', { skin: 'fair', hair: 'receding', hairCol: 'brown', eyes: 'wide', torso: { cut: 'shirt' }, col: ['#8a6a9a', '#5e4670'], legs: LEG(P.khaki, BOOT.brown), sig: 'drill' }),
  kHero('jdjelly', 'J.D. Jelly', 'John "J.D." Dorian (Scrubs)', { skin: 'fair', hair: 'messy', hairCol: 'brown', torso: { cut: 'vneck', extras: ['necklace'] }, col: ['#3a8aa8', '#24627a'], legs: LEG(['#3a8aa8', '#24627a'], BOOT.white), sig: 'stethoscope' }),
  kHero('dwightschrujelly', 'Dwight Schrujelly', 'Dwight Schrute (The Office)', { skin: 'pale', hair: 'side', hairCol: 'brown', eyes: 'glasses', torso: { cut: 'suit' }, col: ['#b89a3a', '#8a7020'], accent: '#5a3a22', legs: LEG(['#b89a3a', '#8a7020'], BOOT.brown), sig: 'beetcannon' }),
  kHero('jakeperjelly', 'Jake Perjelly', 'Jake Peralta (Brooklyn Nine-Nine)', { skin: 'light', hair: 'short', hairCol: 'black', beard: 'stubble', torso: { cut: 'jacket', extras: ['tie'] }, col: P.black, col2: P.white, accent: '#3a5a8a', legs: LEG(P.denim, BOOT.black), sig: 'coolglock' }),
  kHero('mrjellybean', 'Mr. Jelly Bean', 'Mr. Bean', { skin: 'fair', hair: 'side', hairCol: 'dbrown', eyes: 'wide', torso: { cut: 'suit' }, col: ['#6a4e34', '#46331f'], accent: '#a02828', legs: LEG(['#6a4e34', '#46331f'], BOOT.black), sig: 'teddy' }),
  kHero('jackbaufin', 'Jack Baufin', 'Jack Bauer (24)', { skin: 'fair', hair: 'short', hairCol: 'dblond', beard: 'stubble', beardCol: 'dblond', eyes: 'angry', torso: { cut: 'jacket', extras: ['holster'] }, col: P.black, col2: ['#4a5a7a', '#2e3a52'], legs: LEG(P.denim, BOOT.black), sig: 'usp' }),
  kHero('michaelscofjelly', 'Michael Scofjelly', 'Michael Scofield (Prison Break)', { skin: 'light', hair: 'shaved', hairCol: 'dbrown', torso: { cut: 'tank' }, col: ['#3a5a8a', '#24406a'], arm: ['#4a6a8a', '#2e4a66'], legs: LEG(P.denim, BOOT.black), sig: 'spoon' }),
  kHero('dexjelly', 'Dexjelly', 'Dexter Morgan (Dexter)', { skin: 'light', hair: 'short', hairCol: 'dbrown', torso: { cut: 'shirt' }, col: ['#4a5a4a', '#2e3a2e'], legs: LEG(P.khaki, BOOT.brown), sig: 'slides' }),
  kHero('tonysopfino', 'Tony Sopfino', 'Tony Soprano (The Sopranos)', { skin: 'light', hair: 'receding', hairCol: 'salt', torso: { cut: 'robe', inner: true, tail: 3 }, col: ['#e8e8ec', '#b8b8c0'], col2: ['#e8e8ec', '#c8c8cc'], legs: LEG(['#3a3a40', '#24242a'], BOOT.brown), sig: 'snub' }),
  kHero('tommyshelfin', 'Tommy Shelfin', 'Thomas Shelby (Peaky Blinders)', { skin: 'pale', hair: 'shaved', hairCol: 'dbrown', hat: 'cap', hatCol: ['#4a4640', '#2e2c28'], torso: { cut: 'coat', inner: true, extras: ['chain'] }, col: ['#2a2a30', '#18181c'], col2: ['#5a5650', '#3a3834'], legs: LEG(['#3a3a40', '#24242a'], BOOT.black), sig: 'razorcap' }),
  kHero('ragnarjellbrok', 'Ragnar Jellbrok', 'Ragnar Lothbrok (Vikings)', { skin: 'fair', hair: 'mohawk', hairCol: 'dblond', beard: 'short', beardCol: 'dblond', eyes: 'angry', torso: { cut: 'leather', extras: ['belt', 'pads'] }, col: P.leather, col2: ['#5a5650', '#3a3834'], legs: LEG(P.leather, BOOT.brown), sig: 'beardaxe' }),
  kHero('gerjelly', 'Gerjelly of Rivia', 'Geralt of Rivia (The Witcher)', { skin: 'pale', hair: 'longm', hairCol: 'white', beard: 'stubble', beardCol: 'white', eyes: 'glow', glow: '#f0c040', torso: { cut: 'leather', extras: ['bandolier', 'belt'] }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'silversword' }),
  kHero('eljellesor', 'El Jellesor', 'The Professor (Money Heist)', { skin: 'light', hair: 'short', hairCol: 'black', beard: 'short', beardCol: 'black', eyes: 'glasses', torso: { cut: 'bodysuit', extras: ['belt'] }, col: ['#c02828', '#801818'], legs: LEG(['#c02828', '#801818'], BOOT.black), sig: 'dalismg' }),
  kHero('player456fin', 'Player 456-Fin', 'Seong Gi-hun / Player 456 (Squid Game)', { skin: 'light', hair: 'messy', hairCol: 'black', torso: { cut: 'jacket' }, col: ['#2a8a7a', '#1a5e52'], col2: P.white, legs: LEG(['#2a8a7a', '#1a5e52'], BOOT.white), sig: 'dalgona' }),
  kHero('wednesfin', 'Wednesfin', 'Wednesday Addams (Wednesday)', { sex: 'f', skin: 'pale', hair: 'pigtails', hairCol: 'black', lips: '#5a2a3a', pal: { v: '#1c1814', V: '#0a0806', r: '#1c1814', R: '#0a0806' }, torso: { cut: 'dress', extras: ['collar'] }, col: P.ink, col2: P.white, legs: LEG(P.ink, BOOT.black), sig: 'thing' }),
  kHero('saulgoodfin', 'Saul Goodfin', 'Saul Goodman (Better Call Saul)', { skin: 'light', hair: 'receding', hairCol: 'brown', torso: { cut: 'suit' }, col: ['#5a8a9a', '#3a6270'], accent: '#e0b040', legs: LEG(['#5a8a9a', '#3a6270'], BOOT.brown), sig: 'lawbook' }),
  kHero('drjellhouse', 'Dr. Jellhouse', 'Dr. Gregory House (House M.D.)', { skin: 'fair', hair: 'messy', hairCol: 'salt', beard: 'stubble', beardCol: 'salt', eyes: 'tired', torso: { cut: 'jacket' }, col: ['#3a3a40', '#24242a'], col2: ['#8a5a8a', '#5e3e5e'], legs: LEG(P.denim, BOOT.white), sig: 'cane' }),
  kHero('sherjelly', 'Sherjelly', 'Sherlock Holmes (Sherlock)', { skin: 'pale', hair: 'curly', hairCol: 'black', torso: { cut: 'coat', extras: ['scarf'] }, col: P.ink, extra: ['#2a3a6a', '#18244a'], legs: LEG(P.ink, BOOT.black), sig: 'violin' }),
  kHero('thejellector', 'The Jellector', 'The Tenth Doctor (Doctor Who)', { skin: 'fair', hair: 'quiff', hairCol: 'brown', torso: { cut: 'suit' }, col: ['#5a4630', '#3e301e'], accent: '#a02828', legs: LEG(['#5a4630', '#3e301e'], BOOT.white), sig: 'sonic' }),
  kHero('foxmuljelly', 'Fox Muljelly', 'Fox Mulder (The X-Files)', { skin: 'light', hair: 'side', hairCol: 'brown', torso: { cut: 'suit' }, col: ['#3a3e4a', '#22262e'], accent: '#5a6a8a', legs: LEG(['#3a3e4a', '#22262e'], BOOT.black), sig: 'tractor' }),
  kHero('mitchbuchanfin', 'Mitch Buchanfin', 'Mitch Buchannon (Baywatch)', { skin: 'tan', hair: 'curly', hairCol: 'brown', torso: { cut: 'bare', extras: ['necklace'] }, col: ['#c8956a', '#96643e'], legs: SKINLEG('tan', ['#c8956a', '#96643e']), sig: 'rescuecan' }),
  kHero('ricksanjelly', 'Rick Sanjelly', 'Rick Sanchez (Rick and Morty)', { skin: 'pale', hair: 'spiky', hairCol: 'grey', eyes: 'tired', pal: { h: '#a8d8f0', H: '#6aa8c8' }, torso: { cut: 'coat', inner: true }, col: P.white, col2: ['#7ab8d8', '#4a8aa8'], legs: LEG(['#8a6a3a', '#5e482a'], BOOT.black), sig: 'portalgun' }),
  kHero('spongejelly', 'SpongeJelly', 'SpongeBob SquarePants', { head: HEADS.spongebob, pal: { s: '#f2e040', S: '#c8b820', o: '#b8a818' }, torso: { cut: 'shirt', extras: ['tie'] }, col: P.white, accent: '#c02828', legs: LEG(['#8a5a2a', '#5e3c1a'], BOOT.black), arm: ['#f2e040', '#c8b820'], hand: ['#f2e040', '#c8b820'], sig: 'spatula' }),
  kHero('selenjelly', 'Selenjelly', 'Selene (Underworld)', { sex: 'f', skin: 'pale', hair: 'bob', hairCol: 'black', lips: '#6a2a3a', torso: { cut: 'coat', extras: ['belt'] }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'dual' }),
  kHero('sethjellko', 'Seth Jellko', 'Seth Gecko (From Dusk Till Dawn)', { skin: 'light', hair: 'crew', hairCol: 'dbrown', torso: { cut: 'suit', tie: false }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'python' }),
  kHero('richiejellko', 'Richie Jellko', 'Richie Gecko (From Dusk Till Dawn)', { skin: 'fair', hair: 'receding', hairCol: 'dbrown', eyes: 'glasses', torso: { cut: 'suit', tie: false }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'pistol' }),
  kHero('julesjellfield', 'Jules Jellfield', 'Jules Winnfield (Pulp Fiction)', { skin: 'dark', hair: 'shoulder', hairCol: 'black', beard: 'chops', eyes: 'angry', torso: { cut: 'suit' }, col: P.ink, accent: '#18181c', legs: LEG(P.ink, BOOT.black), sig: 'ezekiel' }),
  kHero('vincentjellga', 'Vincent Jellga', 'Vincent Vega (Pulp Fiction)', { skin: 'light', hair: 'ponytail', hairCol: 'black', torso: { cut: 'suit' }, col: P.ink, accent: '#18181c', legs: LEG(P.ink, BOOT.black), sig: 'vega45' }),
  kHero('miajellace', 'Mia Jellace', 'Mia Wallace (Pulp Fiction)', { sex: 'f', skin: 'pale', hair: 'bob', hairCol: 'black', lips: '#c82030', torso: { cut: 'shirt' }, col: P.white, legs: LEG(P.ink, BOOT.black), sig: 'milkshake' }),
  kHero('butchjellidge', 'Butch Jellidge', 'Butch Coolidge (Pulp Fiction)', { skin: 'light', hair: 'shaved', hairCol: 'dbrown', eyes: 'angry', torso: { cut: 'leather' }, col: P.leather, legs: LEG(P.denim, BOOT.brown), sig: 'katana' }),
  kHero('harrystjelly', 'Harry Stjelly', 'Harry Stamper (Armageddon)', { skin: 'light', hair: 'shaved', hairCol: 'dbrown', beard: 'stubble', torso: { cut: 'armor', extras: ['belt'] }, col: ['#d8d8dc', '#a8a8b0'], pal: { m: '#d8d8dc', M: '#e07020' }, legs: LEG(['#d8d8dc', '#a8a8b0'], BOOT.grey), arm: ['#d8d8dc', '#a8a8b0'], sig: 'nuke' }),
  kHero('ajfrostfin', 'A.J. Frostfin', 'A.J. Frost (Armageddon)', { skin: 'light', hair: 'bald', hairCol: 'brown', hat: 'helmet', hatCol: ['#e8e8ec', '#b8b8c0'], glow: '#bfefff', over: ['................', '................', '..g........g....', '..g.......eg....', '..g.......eg....', '..g........g....', '..g........g....', '..G........G....', '..GG......GG....', '...GGggggGG.....'],
    torso: { cut: 'armor' }, col: ['#d8d8dc', '#a8a8b0'], pal: { m: '#d8d8dc', M: '#e07020' }, legs: LEG(['#d8d8dc', '#a8a8b0'], BOOT.grey), arm: ['#d8d8dc', '#a8a8b0'], hand: ['#d8d8dc', '#a8a8b0'], sig: 'spacedrill' }),
  kHero('jakesjelly', 'Jake Sjelly', 'Jake Sully (Avatar)', { skin: 'navi', hair: 'longm', hairCol: 'black', eyes: 'glow', glow: '#f0d040', face: ['navi'], torso: { cut: 'bare', extras: ['necklace'] }, col: SKIN.navi, legs: LEG(['#6a4a2a', '#46301a'], SKIN.navi), sig: 'navibow' }),
  kHero('neytjelly', 'Neytjelly', 'Neytiri (Avatar)', { sex: 'f', skin: 'navi', hair: 'longf', hairCol: 'black', eyes: 'glow', glow: '#f0d040', lips: '#2a4a8a', face: ['navi'], torso: { cut: 'tank', extras: ['necklace'] }, col: ['#8a6a3a', '#5e482a'], legs: LEG(['#6a4a2a', '#46301a'], SKIN.navi), sig: 'navibow' }),
  kHero('jellitch', 'Colonel Jellitch', 'Colonel Miles Quaritch (Avatar)', { skin: 'tan', hair: 'crew', hairCol: 'dbrown', eyes: 'angry', face: ['scar', 'cheekscar'], torso: { cut: 'tank', extras: ['tags', 'belt'] }, col: P.olive, legs: LEG(P.olive, BOOT.black), sig: 'ampgun' }),
  kHero('starjellord', 'Star-Jellord', 'Peter Quill / Star-Lord (Guardians of the Galaxy)', { skin: 'fair', hair: 'side', hairCol: 'auburn', beard: 'stubble', torso: { cut: 'leather' }, col: ['#8a2a20', '#5e1a14'], legs: LEG(P.ink, BOOT.brown), sig: 'quadblaster' }),
  kHero('rocketfin', 'Rocketfin', 'Rocket (Guardians of the Galaxy)', { head: HEADS.rocket, pal: { h: '#8a7a6a', H: '#5e5246' }, torso: { cut: 'uniform', extras: ['belt'] }, col: P.orange, legs: LEG(P.orange, BOOT.black), arm: P.orange, hand: ['#8a7a6a', '#5e5246'], sig: 'rocketbig' }),
  kHero('jellgroot', 'I Am Jellgroot', 'Groot (Guardians of the Galaxy)', { head: HEADS.groot, pal: { s: '#8a6a44', S: '#5e4a2e' }, torso: { cut: 'bare' }, col: ['#8a6a44', '#5e4a2e'], legs: LEG(['#8a6a44', '#5e4a2e'], ['#6a4e30', '#46331f']), arm: ['#8a6a44', '#5e4a2e'], hand: ['#8a6a44', '#5e4a2e'], sig: 'branch' }),
  kHero('gamorfin', 'Gamorfin', 'Gamora (Guardians of the Galaxy)', { sex: 'f', skin: 'gamora', hair: 'longf', hairCol: 'black', lips: '#3a2a3a', face: ['gamora'], torso: { cut: 'leather' }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'godslayer' }),
  kHero('draxjelly', 'Drax the Jellstroyer', 'Drax the Destroyer (Guardians of the Galaxy)', { skin: 'drax', hair: 'bald', eyes: 'angry', face: ['drax'], torso: { cut: 'bare' }, col: SKIN.drax, legs: LEG(P.leather, BOOT.black), sig: 'draxknives' }),
  kHero('hermjelly', 'Hermione Jellger', 'Hermione Granger (Harry Potter)', { sex: 'f', skin: 'fair', hair: 'longf', hairCol: 'brown', torso: { cut: 'robe', extras: ['scarf'] }, col: P.ink, extra: ['#a02828', '#e0b040'], legs: LEG(P.grey, BOOT.black), sig: 'leviosa' }),
  kHero('ronjellsley', 'Ron Jellsley', 'Ron Weasley (Harry Potter)', { skin: 'pale', hair: 'bowl', hairCol: 'orange', face: ['freckles'], torso: { cut: 'robe', extras: ['scarf'] }, col: P.ink, extra: ['#a02828', '#e0b040'], legs: LEG(P.grey, BOOT.black), sig: 'brokenwand' }),
  kHero('jelldemort', 'Lord Jelldemort', 'Lord Voldemort (Harry Potter)', { skin: 'white', hair: 'bald', eyes: 'glow', glow: '#c02828', torso: { cut: 'robe', tail: 6, closed: true }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'avada' }),
  kHero('hagjelly', 'Rubeus Hagjelly', 'Rubeus Hagrid (Harry Potter)', { skin: 'light', hair: 'longm', hairCol: 'black', beard: 'wizard', beardCol: 'black', torso: { cut: 'coat', extras: ['belt'] }, col: P.brown, legs: LEG(P.brown, BOOT.brown), sig: 'umbrella' }),
  kHero('obijelly', 'Obi-Jelly Kenobi', 'Obi-Wan Kenobi (Star Wars)', { skin: 'light', hair: 'side', hairCol: 'auburn', beard: 'short', beardCol: 'auburn', torso: { cut: 'robe', inner: true, extras: ['belt'] }, col: ['#8a6a44', '#5e4a2e'], col2: ['#d8c8a8', '#a8987a'], legs: LEG(['#d8c8a8', '#a8987a'], BOOT.brown), sig: 'saberblue' }),
  kHero('jelloda', 'Jelloda', 'Yoda (Star Wars)', { head: HEADS.yoda, pal: { s: '#8ab86a', S: '#5e8a46' }, torso: { cut: 'robe', tail: 6, closed: true }, col: ['#a8946a', '#7a6a48'], noLegs: true, legs: LEG(['#a8946a', '#7a6a48'], ['#a8946a', '#7a6a48']), arm: ['#a8946a', '#7a6a48'], hand: ['#8ab86a', '#5e8a46'], sig: 'sabergreen' }),
  kHero('darthjellmaul', 'Darth Jellmaul', 'Darth Maul (Star Wars)', { skin: 'red', hair: 'bald', eyes: 'glow', glow: '#f0d040', face: ['maul'], top: ['...m.m.m.m......'], torso: { cut: 'robe', extras: ['belt'] }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'saberdouble' }),
  kHero('kylojellen', 'Kylo Jellen', 'Kylo Ren (Star Wars)', { skin: 'pale', hair: 'shoulder', hairCol: 'black', face: ['scar'], torso: { cut: 'robe', extras: ['belt', 'cape'] }, col: P.ink, cape: ['#24242c', '#121218'], legs: LEG(P.ink, BOOT.black), sig: 'sabercross' }),
  kHero('reyfin', 'Reyfin', 'Rey (Star Wars)', { sex: 'f', skin: 'light', hair: 'topbun', hairCol: 'brown', torso: { cut: 'tank', extras: ['belt'] }, col: ['#d8c8a8', '#a8987a'], legs: LEG(['#d8c8a8', '#a8987a'], BOOT.brown), sig: 'reystaff' }),
  kHero('jellpheus', 'Jellpheus', 'Morpheus (The Matrix)', { skin: 'dark', hair: 'bald', eyes: 'roundshades', torso: { cut: 'coat', tail: 6 }, col: ['#2a3a2a', '#1a241a'], legs: LEG(P.ink, BOOT.black), sig: 'kungfu' }),
  kHero('hansjellber', 'Hans Jellber', 'Hans Gruber (Die Hard)', { skin: 'fair', hair: 'slick', hairCol: 'dbrown', beard: 'short', beardCol: 'dbrown', torso: { cut: 'suit' }, col: ['#5a5c64', '#3a3c42'], accent: '#3a5a8a', legs: LEG(['#5a5c64', '#3a3c42'], BOOT.black), sig: 'hkp7' }),
  kHero('tonyjelltana', 'Tony Jelltana', 'Tony Montana (Scarface)', { skin: 'tan', hair: 'slick', hairCol: 'black', face: ['cheekscar'], torso: { cut: 'suit', tie: false }, col: P.white, legs: LEG(P.white, BOOT.black), sig: 'littlefriend' }),
  kHero('jellmask', 'The Jellmask', 'The Mask / Stanley Ipkiss (The Mask)', { skin: 'green', hair: 'bald', eyes: 'wide', face: ['grin'], hat: 'fedora', hatCol: ['#e8c030', '#b08c18'], torso: { cut: 'suit' }, col: ['#e8c030', '#b08c18'], accent: '#c02828', legs: LEG(['#e8c030', '#b08c18'], ['#e8e8ec', '#c02828']), hand: SKIN.green, sig: 'mallet' }),
  kHero('acejellura', 'Ace Jellura', 'Ace Ventura (Ace Ventura)', { skin: 'light', hair: 'quiff', hairCol: 'dbrown', eyes: 'wide', torso: { cut: 'shirt', extras: ['stripes'] }, col: ['#e07020', '#a04a10'], col2: ['#2a8a8a', '#1a5e5e'], legs: LEG(P.white, BOOT.white), sig: 'plunger' }),
  kHero('kevinmcjellister', 'Kevin McJellister', 'Kevin McCallister (Home Alone)', { skin: 'fair', hair: 'side', hairCol: 'dblond', eyes: 'wide', torso: { cut: 'tee' }, col: P.red, legs: LEG(P.denim, BOOT.white), sig: 'paintcans' }),
  kHero('forrestjelly', 'Forrest Jelly', 'Forrest Gump (Forrest Gump)', { skin: 'light', hair: 'crew', hairCol: 'brown', torso: { cut: 'suit', tie: false }, col: ['#d8d0b8', '#a8a088'], legs: LEG(['#d8d0b8', '#a8a088'], BOOT.white), sig: 'pingpong' }),
  kHero('mikejellrey', 'Mike Jellrey', 'Mike Lowrey (Bad Boys)', { skin: 'dark', hair: 'crew', hairCol: 'black', beard: 'goatee', beardCol: 'black', eyes: 'shades', torso: { cut: 'shirt' }, col: P.ink, legs: LEG(P.ink, BOOT.black), sig: 'deagle' }),
  kHero('marcusjellnett', 'Marcus Jellnett', 'Marcus Burnett (Bad Boys)', { skin: 'dark', hair: 'shaved', hairCol: 'black', beard: 'mustache', beardCol: 'black', eyes: 'wide', torso: { cut: 'shirt' }, col: ['#5a6a8a', '#3a4660'], legs: LEG(P.khaki, BOOT.brown), sig: 'beretta' }),
  kHero('axeljelley', 'Axel Jelley', 'Axel Foley (Beverly Hills Cop)', { skin: 'dark', hair: 'short', hairCol: 'black', torso: { cut: 'jacket' }, col: ['#2a5aa8', '#1a3a7a'], col2: P.white, legs: LEG(P.denim, BOOT.white), sig: 'browning' }),
  kHero('maverjelly', 'Maverjelly', 'Pete "Maverick" Mitchell (Top Gun)', { skin: 'light', hair: 'short', hairCol: 'dbrown', eyes: 'shades', torso: { cut: 'leather', extras: ['pads'] }, col: P.brown, col2: ['#7a5a3a', '#5a3e26'], legs: LEG(P.denim, BOOT.brown), sig: 'sidewinder' }),
  kHero('jacktorjelly', 'Jack Torjelly', 'Jack Torrance (The Shining)', { skin: 'light', hair: 'receding', hairCol: 'black', eyes: 'angry', face: ['grin'], torso: { cut: 'jacket' }, col: ['#7a2028', '#521418'], col2: ['#e8e8ec', '#b8b8c0'], legs: LEG(P.denim, BOOT.brown), sig: 'fireaxe' }),
  kHero('jessejellman', 'Jesse Jellman', 'Jesse Pinkman (Breaking Bad)', { skin: 'fair', hair: 'crew', hairCol: 'dblond', beard: 'goatee', beardCol: 'dblond', hat: 'beanie', hatCol: ['#5a5c64', '#3a3c42'], torso: { cut: 'hoodie' }, col: P.yellow, legs: LEG(P.yellow, BOOT.black), sig: 'science' }),
  kHero('daenerjelly', 'Daenerjelly', 'Daenerys Targaryen (Game of Thrones)', { sex: 'f', skin: 'pale', hair: 'longf', hairCol: 'platinum', torso: { cut: 'coat', inner: true }, col: ['#3a3a5a', '#24243a'], col2: ['#c8c8d8', '#9a9aaa'], legs: LEG(['#3a3a5a', '#24243a'], BOOT.black), sig: 'dracarys' }),
  kHero('aryafin', 'Arya Fin', 'Arya Stark (Game of Thrones)', { sex: 'f', skin: 'fair', hair: 'ponytail', hairCol: 'brown', torso: { cut: 'leather', extras: ['belt'] }, col: P.grey, legs: LEG(P.leather, BOOT.brown), sig: 'needle' }),
  kHero('tyrjellion', 'Tyrjellion', 'Tyrion Lannister (Game of Thrones)', { skin: 'fair', hair: 'messy', hairCol: 'dblond', beard: 'short', beardCol: 'dblond', face: ['scar'], torso: { cut: 'coat', inner: true }, col: P.maroon, col2: ['#e0b040', '#a07820'], legs: LEG(P.ink, BOOT.brown), sig: 'goblet' }),
  kHero('daryljelly', 'Daryl Jellxon', 'Daryl Dixon (The Walking Dead)', { skin: 'fair', hair: 'shoulder', hairCol: 'brown', beard: 'stubble', torso: { cut: 'vest' }, col: P.leather, legs: LEG(P.denim, BOOT.brown), sig: 'crossbow' }),
  kHero('negjelly', 'Negjelly', 'Negan (The Walking Dead)', { skin: 'light', hair: 'slick', hairCol: 'salt', beard: 'short', beardCol: 'salt', torso: { cut: 'leather', extras: ['scarf'] }, col: P.ink, extra: ['#a02828', '#701818'], legs: LEG(P.ink, BOOT.black), sig: 'lucille' }),
  kHero('michjellonne', 'Michjellonne', 'Michonne (The Walking Dead)', { sex: 'f', skin: 'dark', hair: 'dreads', hairCol: 'black', torso: { cut: 'vest' }, col: P.leather, legs: LEG(P.olive, BOOT.brown), sig: 'katana' }),
  kHero('jellopper', 'Jim Jellopper', 'Jim Hopper (Stranger Things)', { skin: 'light', hair: 'short', hairCol: 'brown', beard: 'full', beardCol: 'brown', hat: 'cowboy', hatCol: ['#8a7a5a', '#5e523a'], torso: { cut: 'uniform', emblem: 'badge', extras: ['belt'] }, col: P.khaki, legs: LEG(P.brown, BOOT.brown), sig: 'shotgun' }),
  kHero('stevejellington', 'Steve Jellington', 'Steve Harrington (Stranger Things)', { skin: 'fair', hair: 'quiff', hairCol: 'brown', torso: { cut: 'jacket' }, col: ['#a8a8b0', '#7a7e86'], col2: ['#c02828', '#801818'], legs: LEG(P.denim, BOOT.white), sig: 'nailbat' }),
  kHero('danascjelly', 'Dana Scjelly', 'Dana Scully (The X-Files)', { sex: 'f', skin: 'pale', hair: 'bob', hairCol: 'red', torso: { cut: 'suit', tie: false }, col: ['#4a4c54', '#2e3036'], legs: LEG(['#4a4c54', '#2e3036'], BOOT.black), sig: 'sigp228' }),
  kHero('jellice', 'Jellice', 'Alice (Resident Evil)', { sex: 'f', skin: 'fair', hair: 'bob', hairCol: 'auburn', pal: { h: '#b8743e', H: '#7e4a24' }, torso: { cut: 'tank' }, col: ['#8a2a1e', '#5e1a12'], lower: ['.jjjjjjkkkkk..', '.jjjjjjkkkk...', '.jjjjj........', '.jjjj.........', '.jjj..........', '.Jj...........'], legs: SKINLEG('fair', BOOT.black), sig: 'alicedual' }),
  kHero('ballerjellina', 'Ballerjellina', 'Eve Macarro (Ballerina)', { sex: 'f', skin: 'light', hair: 'ponytail', hairCol: 'black', lips: '#b01e24', torso: { cut: 'tank' }, col: ['#8a2a5e', '#5e1a40'], over: ['................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '................', '........x.......', '....x......x....', '.......x........', '...x......x.....', '......x.........'], lower: ['..jjjjjjjjjj..', '..jjjxjjjjjj..', '..jjjjjjj.jj..', '..jjxjjjj..j..', '..jjjjjjj.....', '..jjjjxjj.....', '..jjjjjjJ.....', '..JJJJJJJ.....'], legs: SKINLEG('light', BOOT.black), sig: 'evknives' }),
  kHero('jellcard', 'Captain Jellcard', 'Jean-Luc Picard (Star Trek)', { skin: 'fair', hair: 'fringe', hairCol: 'salt', torso: { cut: 'bodysuit', emblem: 'delta', extras: ['pads'] }, col: ['#a82020', '#701414'], col2: ['#1a1a20', '#0e0e12'], legs: LEG(['#1a1a20', '#0e0e12'], BOOT.black), sig: 'engage' }),
  kHero('alfjelly', 'ALFjelly', 'ALF / Gordon Shumway (ALF)', { head: HEADS.alf, top: ['......hHhhHh......'], over: ['', '', '', '', '', '', '', '', '', '', '', '....hhhhhhhh......'], pal: { h: '#b8783e', H: '#a0662e', s: '#d8a060', S: '#8a5428', q: '#5a2410', k: '#141418', w: '#f4f0e8' }, torso: { cut: 'fur' }, col: ['#b8783e', '#a0662e'], legs: LEG(['#b8783e', '#a0662e'], ['#8a5a30', '#5e3c1e']), arm: ['#b8783e', '#a0662e'], hand: ['#b8783e', '#a0662e'], sig: 'melmac' }),
  kHero('austinjellpowers', 'Austin Jellpowers', 'Austin Powers (Austin Powers)', { skin: 'fair', hair: 'messy', hairCol: 'brown', eyes: 'bigglasses', face: ['crooked'], torso: { cut: 'suit', tie: false, extras: ['collar'] }, col: ['#2a3aa8', '#1a2470'], col2: P.white, legs: LEG(['#2a3aa8', '#1a2470'], BOOT.black), hand: ['#ecc4a0', '#c0906c'], sig: 'mojo' }),
  kHero('budjellcer', 'Bud Jellcer', 'Bud Spencer (his roles)', { skin: 'tan', hair: 'short', hairCol: 'black', beard: 'full', beardCol: 'black', hat: 'cowboy', hatCol: ['#24242c', '#121218'], torso: { cut: 'vestshirt', fat: true, extras: ['belt'] }, col: ['#5a4a3a', '#3e3226'], col2: ['#2a2a30', '#18181c'], legs: LEG(['#3a3a40', '#24242a'], BOOT.brown), sig: 'dampfhammer' }),
  kHero('terencejell', 'Terence Jell', 'Terence Hill (his roles)', { skin: 'light', hair: 'short', hairCol: 'dblond', beard: 'stubble', beardCol: 'dblond', hat: 'cowboy', hatCol: ['#6a5a44', '#46392a'], torso: { cut: 'shirt', extras: ['belt'] }, col: ['#a8b0b8', '#7a828a'], legs: LEG(['#8a7a5a', '#5e523a'], BOOT.brown), sig: 'slaps' }),
];

Object.assign(GUN_COLS, { v: '#2a5ad8', V: '#1a3a98', o: '#ff8a8a', O: '#e02020', p: '#c88aff', P: '#7a3ac8', u: '#f0c840', U: '#b08c18', e: '#9aff8a', E: '#3ac83a', n: '#ff9a3c', N: '#c85a10' });
Object.assign(HERO_GUNS, {
  rifle: ['.......lll.........', 'aaaaahhgggggggggggx', 'AAAAAhhGGgGG.......', '.......G..GG.......', '..........G........'],
  rocketl: ['......gggggggggggg.', 'aaaaahhGGGGGGGGGGGx', 'AAAAAhhgggggggggggg', '.......GG..........'],
  glove: ['......OOO', 'aaaaahOOOO', 'AAAAAhOOOO', '......OOO'],
  punch: ['.......', 'aaaaahhHH', 'AAAAAhhHH'],
  kick: ['.......', 'aaaaahhHH', 'AAAAAhhHH'],
  smash: ['......hhh', 'aaaaahhhhh', 'AAAAAhhhhh', '......HHH'],
  sawedoff: ['......wwllllll', 'aaaaahhwwgggggggx', 'AAAAAhhW..GGGGG..'],
  uzi: ['.......lllll', 'aaaaahhggggggGx', 'AAAAAhhGG.GG...', '.......G.......', '.......G.......'],
  katana: ['.......x', 'aaaaahhkkxxxxxxxxxxxx', 'AAAAAhhk.lllllllllll.'],
  katanas: ['.......xxxxxxxxxxx', 'aaaaahhkkxxxxxxxxxxxx', 'AAAAAhhk.lllllllllll.'],
  sword: ['.......y', 'aaaaahhyllllllllllx', 'AAAAAhhylllllllllll.', '.......y'],
  broadsword: ['.......y.', 'aaaaahhyllllllllllllx', 'AAAAAhhylllllllllllll', '.......y'],
  claymore: ['.......y', 'aaaaahhyylllllllllllllx', 'AAAAAhhyylllllllllllll.', '.......y'],
  longclaw: ['.......k', 'aaaaahhkxllllllllllx', 'AAAAAhhk.lllllllllll', '.......k'],
  gladius: ['.......y', 'aaaaahhyllllllx', 'AAAAAhhylllllll', '.......y'],
  knife: ['.......', 'aaaaahhkxxxxl', 'AAAAAhhk.lll.'],
  scalpel: ['.......', 'aaaaahhxxxl', 'AAAAAhh....'],
  machete: ['.......', 'aaaaahhwwllllllllx', 'AAAAAhhW.llllllll.'],
  claws: ['........xxxxx', 'aaaaahh.xxxxxx', 'AAAAAhhxxxxxx.', '........xxxxx'],
  freddyglove: ['.......xxxx', 'aaaaahOxxxxx', 'AAAAAhOxxxxx', '.......xxxx'],
  bladearm: ['.......', 'aaaaaaxxxxxxxxxl', 'AAAAAAxxxxxxxxx.'],
  chainsaw: ['......uuuu', 'aaaaahhuuuuuxxxxxxxx', 'AAAAAhhuuuuukkkkkkkk', '.......GG'],
  bow: ['.......w', 'aaaaahhwkkkkkkx', 'AAAAAhhw', '.......w', '......ww'],
  wand: ['.......', 'aaaaahhwwwwwwx', 'AAAAAhh......'],
  staff: ['.......x', 'aaaaahhwwwwwwwwxx', 'AAAAAhh........x'],
  spear: ['.......', 'aaaaahhwwwwwwwwwwwwlx', 'AAAAAhh............l.'],
  trident: ['..................u', 'aaaaahhuuuuuuuuuuuuuu', 'AAAAAhh...........u'],
  mjolnir: ['.......llll', 'aaaaahhwwllll', 'AAAAAhh..llll'],
  shield: ['.......OOOO', 'aaaaahhOwwwwO', 'AAAAAhhOwvvwO', '.......OwwwwO', '........OOOO'],
  chakram: ['.......lll', 'aaaaahhl.l', 'AAAAAhhlll'],
  lasso: ['.......uu', 'aaaaahhu..u', 'AAAAAhh.uu.'],
  bat: ['.......', 'aaaaahhwwwwwwW', 'AAAAAhh...WWWW'],
  nunchaku: ['.......w', 'aaaaahhwwk', 'AAAAAhh..kww', '..........w'],
  stake: ['.......', 'aaaaahhwwwwl', 'AAAAAhh.....'],
  glaive: ['.......x.x', 'aaaaahhxxx', 'AAAAAhh.x.'],
  flintlock: ['.......', 'aaaaahhwwgggggggx', 'AAAAAhhWW.......', '.......W'],
  colt: ['.......llllll', 'aaaaahhgGgggggx', 'AAAAAhhgGG.....', '.......ww', '.......Ww'],
  python: ['.......lllllll', 'aaaaahhgGggggggx', 'AAAAAhhgGG......', '.......ww', '.......Ww'],
  magnum: ['.......lllllllll', 'aaaaahhgGgggggggggx', 'AAAAAhhgGGG.......', '.......ww', '.......Ww'],
  deagle: ['.......xllllll', 'aaaaahhggggggggx', 'AAAAAhhGGGGGGG.', '.......GG', '.......GG'],
  ppk: ['.......lllll', 'aaaaahhgggggx', 'AAAAAhhGG....', '.......G'],
  blaster: ['.......lll.', 'aaaaahhgggGgggggx', 'AAAAAhhGGG..GG...', '.......G'],
  deckard: ['.......lll', 'aaaaahhGGGGGGgx', 'AAAAAhhggOG....', '.......ww'],
  bowcaster: ['.......ww.w', 'aaaaahhggggggggx', 'AAAAAhhGG.w.w..'],
  phaser: ['.......', 'aaaaahhxxxxxc', 'AAAAAhhGG....'],
  cricket: ['.......', 'aaaaahhxxc', 'AAAAAhh...'],
  deatomizer: ['.......xxxxxxxx', 'aaaaahhxcccccccxx', 'AAAAAhhGGGGGGGG..'],
  proton: ['.......', 'aaaaahhkkkkkkkkO', 'AAAAAhhGG.......'],
  lawgiver: ['.......llllll', 'aaaaahhgggggggGx', 'AAAAAhhGGGOG...', '.......GG'],
  samaritan: ['.......llllllll', 'aaaaahhGGGGGGGGGGx', 'AAAAAhhGGGGG.....', '.......ww'],
  elephantgun: ['......wwllllllllllllll', 'aaaaahhwwgggggggggggggx', 'AAAAAhhW..............'],
  morita: ['.......lllll......', 'aaaaahhGGGGGGGGGGGx', 'AAAAAhhgGG.ggg.....', '.......G...........'],
  guitarcase: ['.......WWWWWWWWW', 'aaaaahhWwwwwwwwwk', 'AAAAAhhWWWWWWWWW'],
  leggun: ['....wwwglllllllllllll', 'aaaaahhwwwgggggggGgggggx', 'AAAAAhhWW.GGGg.....G...'],
  flamer: ['.......gg', 'aaaaahhggggggggOn', 'AAAAAhhGG.....GG.'],
  wristflame: ['.......', 'aaaaahhgggn', 'AAAAAhhGGG.'],
  mauser: ['.......lll', 'aaaaahhgggggggx', 'AAAAAhhwwG.....', '.......ww'],
  skateboard: ['.......', 'aaaaahhOOOOOOOO', 'AAAAAhh.k....k.'],
  bowling: ['.......kk', 'aaaaahhkkkk', 'AAAAAhhkkkk', '.......kk'],
  balloon: ['........OO', 'aaaaahh.OOO', 'AAAAAhh.OO', '........w'],
  snap: ['.......uu', 'aaaaahhuuuu', 'AAAAAhhuOvu'],
  sceptre: ['.......', 'aaaaahhuuuuuuvc', 'AAAAAhh.......'],
  eldritch: ['.......nn', 'aaaaahhnnnn', 'AAAAAhh.nn'],
  psychic: ['.......', 'aaaaahhh', 'AAAAAhhh'],
  force: ['.......', 'aaaaahhh', 'AAAAAhhh'],
  heatvision: ['.......', 'aaaaahhh', 'AAAAAhhh'],
  laser: ['.......', 'aaaaahhh', 'AAAAAhhh'],
  web: ['.......w', 'aaaaahhhw', 'AAAAAhhh'],
  lightning: ['.......c', 'aaaaahhhcc', 'AAAAAhhh.c'],
  flux: ['.......', 'aaaaahhgcc', 'AAAAAhhGG.'],
  flare: ['.......', 'aaaaahhOOOOn', 'AAAAAhh.....'],
  chains: ['.......m.m', 'aaaaahhmmmm', 'AAAAAhh.m.m'],
  saw: ['.......xxxx', 'aaaaahhxxxxx', 'AAAAAhh.kkkk'],
  bang: ['.......llllll.OO', 'aaaaahhgGgggggwO', 'AAAAAhhgGG....OO', '.......ww'],
  swissknife: ['.......', 'aaaaahhOOxxx', 'AAAAAhhOO...'],
  pinch: ['.......', 'aaaaahhh', 'AAAAAhhh'],
  batons: ['.......', 'aaaaahhkkkkkc', 'AAAAAhh......'],
  boomstick: ['......wwllllllll', 'aaaaahhwwgggggggggx', 'AAAAAhhW..GGGGGGG..'],
  aa12: ['......lllllllll', 'aaaaahhgggggggggggx', 'AAAAAhhGG.GGGG.....', '.......G..GG.......'],
  knives: ['.......', 'aaaaahhkxxxxl', 'AAAAAhhk.lll.'],
  acid: ['.......', 'aaaaahhhe', 'AAAAAhhh.'],
  acidtail: ['.......', 'aaaaahhhGGGGx', 'AAAAAhhh.....'],
  amban: ['.......llll', 'aaaaahhwwwwgggggggcx', 'AAAAAhhWW.........'],
  plasma: ['.......', 'aaaaahhmmmO', 'AAAAAhhMM..'],
  saberred: ['.......oooooooooooo', 'aaaaahhlOOOOOOOOOOOO', 'AAAAAhhgoooooooooooo'],
  lizardspock: ['.......h.h', 'aaaaahhhhh', 'AAAAAhhhh'],
  cheesecake: ['.......uuu', 'aaaaahhuuuu', 'AAAAAhhwwww'],
  roverarm: ['.......llll', 'aaaaahhggggggx', 'AAAAAhhGG...x'],
  piano: ['.......kkkkk', 'aaaaahhkxkxkxk', 'AAAAAhhkkkkkk', '.......k...k'],
  chiro: ['.......', 'aaaaahhHH', 'AAAAAhhHH'],
  meatballsub: ['.......www', 'aaaaahhwOOOOw', 'AAAAAhhwwwww'],
  pivot: ['.......OOOOOO', 'aaaaahhOOOOOOO', 'AAAAAhhO.....O'],
  suitup: ['.......', 'aaaaahhkkkkO', 'AAAAAhh.....'],
  donut: ['.......oo', 'aaaaahhoWo', 'AAAAAhhoo'],
  slingshot: ['.......w.w', 'aaaaahhwww', 'AAAAAhh.w.'],
  chickenfight: ['.......', 'aaaaahhHH', 'AAAAAhhHH'],
  cheesypoofs: ['.......nnn', 'aaaaahhnnnn', 'AAAAAhhNNN'],
  girder: ['.......', 'aaaaahhlllllllll', 'AAAAAhhllllllll.'],
  ipsbox: ['.......wwww', 'aaaaahhwWWw', 'AAAAAhhwwww'],
  shoehorn: ['.......', 'aaaaahhyyyyyy', 'AAAAAhh....yy'],
  drill: ['.......uuu', 'aaaaahhuuuuxxx', 'AAAAAhhkk', '.......kk'],
  stethoscope: ['.......k.k', 'aaaaahhkkkkkx', 'AAAAAhh....'],
  beetcannon: ['.......ggggg', 'aaaaahhgggggggP', 'AAAAAhhGG.....'],
  coolglock: ['.......lllllll.', 'aaaaahhgggGgggx', 'AAAAAhhGgGGGGG.', '.......ww......', '.......Ww......'],
  teddy: ['.......w.w', 'aaaaahhwWww', 'AAAAAhhwww'],
  spoon: ['.......', 'aaaaahhxxxl', 'AAAAAhh...ll'],
  slides: ['.......xxx', 'aaaaahhxOx', 'AAAAAhhxxx'],
  snub: ['.......llll', 'aaaaahhgGggx', 'AAAAAhhgGG..', '.......ww', '.......Ww'],
  razorcap: ['.......kkkk', 'aaaaahhkkkkkx', 'AAAAAhh.....'],
  beardaxe: ['............xx', 'aaaaahhwwwwwwxxx', 'AAAAAhh.....xx'],
  silversword: ['.......k', 'aaaaahhkxxxxxxxxxxx', 'AAAAAhhk.xxxxxxxxxx', '.......k'],
  dalismg: ['.......lllll', 'aaaaahhggggggGx', 'AAAAAhhGG.GG...', '.......G.......', '.......G.......'],
  dalgona: ['.......nn', 'aaaaahhnUn', 'AAAAAhhnn'],
  thing: ['.......hh', 'aaaaahhhhhh', 'AAAAAhh.h.h'],
  lawbook: ['.......OOO', 'aaaaahhOuO', 'AAAAAhhOOO'],
  cane: ['.......', 'aaaaahhwwwwwwwww', 'AAAAAhh........W'],
  violin: ['.......www', 'aaaaahhwWwwkkkkx', 'AAAAAhhwww'],
  sonic: ['.......', 'aaaaahhllllC', 'AAAAAhh....'],
  tractor: ['.......ggg', 'aaaaahhgEEEgx', 'AAAAAhhGGG'],
  rescuecan: ['.......OOOO', 'aaaaahhOxxOO', 'AAAAAhhOOOO'],
  portalgun: ['.......lll', 'aaaaahhlllEE', 'AAAAAhhGG..'],
  spatula: ['.......', 'aaaaahhwwwwwlll', 'AAAAAhh.....lll'],
  duck: ['.......uu', 'aaaaahhuuuu', 'AAAAAhh.uu'],
  beerbottle: ['.......', 'aaaaahhWWWWWWw', 'AAAAAhhWuuuW'],
  ezekiel: ['.......lllllll.', 'aaaaahhgggGgggx', 'AAAAAhhGgGGGGG.', '.......ww......', '.......Ww......'],
  vega45: ['.......llllll', 'aaaaahhgggggGx', 'AAAAAhhGGGGG.', '.......ww....', '.......Ww....'],
  milkshake: ['.......x', 'aaaaahhxOx', 'AAAAAhhxOx', '.......xxx'],
  nuke: ['.......llll', 'aaaaahhlkOlk', 'AAAAAhhllll'],
  spacedrill: ['.......uuu', 'aaaaahhuuuuxxxxx', 'AAAAAhhkkk.xxxx', '.......kk'],
  navibow: ['.......w', 'aaaaahhwlllllllx', 'AAAAAhhw', '.......w', '......ww'],
  ampgun: ['......lllllllllllx', 'aaaaahhGgGgGgGgGgGx', 'AAAAAhhggggggggggl', '......GGG..........'],
  quadblaster: ['.......lllll', 'aaaaahhggggcx', 'AAAAAhhGG...', '.......lllll', '.......ggggcx'],
  rocketbig: ['......gggggggggggggg', 'aaaaahhGGGGGGGGGGGGGOx', 'AAAAAhhggggggggggggggg', '.......GG.....GG'],
  branch: ['.......w.w', 'aaaaahhwwwwwwwwwe', 'AAAAAhh..w..w..'],
  godslayer: ['.......k', 'aaaaahhkxxxxxxxxxx', 'AAAAAhhk.xxxxxxxxx.', '.......k'],
  draxknives: ['.......', 'aaaaahhkxxxxxl', 'AAAAAhhk.lllx'],
  leviosa: ['.......', 'aaaaahhwwwwwwu', 'AAAAAhh......'],
  brokenwand: ['.......', 'aaaaahhwwwW.ww', 'AAAAAhh......'],
  avada: ['.......', 'aaaaahhxxxxxxe', 'AAAAAhh......'],
  umbrella: ['.......o', 'aaaaahhoOoOoOo', 'AAAAAhh.w', '.......w'],
  saberblue: ['.......cccccccccccc', 'aaaaahhlCCCCCCCCCCCC', 'AAAAAhhgcccccccccccc'],
  sabergreen: ['.......eeeeeeeeeeee', 'aaaaahhlEEEEEEEEEEEE', 'AAAAAhhgeeeeeeeeeeee'],
  saberdouble: ['.......oooooooooooo', 'aaaaahhlOOOOOOOOOOOO', 'AAAAAhhgoooooooooooo'],
  sabercross: ['.......o', 'aaaaahhlOOOOOOOOOOOO', 'AAAAAhhgoooooooooooo', '.......o'],
  reystaff: ['.......', 'aaaaahhwwwwwwwwwwwwwl', 'AAAAAhh.............'],
  kungfu: ['.......', 'aaaaahhHH', 'AAAAAhhHH'],
  hkp7: ['.......llllll', 'aaaaahhggggggx', 'AAAAAhhGGGGG.', '.......GG....', '.......GG....'],
  littlefriend: ['......ggg.lllllllll', 'aaaaahhgggggggggggx', 'AAAAAhhGGGGGGGGG...', '.......GG.G........'],
  mallet: ['.......wwww', 'aaaaahhwwwwWWWWW', 'AAAAAhh..WWWWW', '.........wwww'],
  plunger: ['.......', 'aaaaahhwwwwwwOOO', 'AAAAAhh......OOO'],
  paintcans: ['.......lll', 'aaaaahhlvvl', 'AAAAAhhlll'],
  pingpong: ['.......OO', 'aaaaahhwOOO', 'AAAAAhh.OO'],
  browning: ['.......llllll.', 'aaaaahhgggGggx', 'AAAAAhhGgGGGG.', '.......ww.....', '.......Ww.....'],
  sidewinder: ['.......llllllll', 'aaaaahhlllllllllOx', 'AAAAAhh..l.....l.'],
  fireaxe: ['............OO', 'aaaaahhwwwwwwOOx', 'AAAAAhh.....OO'],
  science: ['.......x', 'aaaaahhxEx', 'AAAAAhhxEEx'],
  dracarys: ['.......nn', 'aaaaahhhnnN', 'AAAAAhhh.n'],
  needle: ['.......', 'aaaaahhkxxxxxxxxx', 'AAAAAhhk'],
  goblet: ['.......uuu', 'aaaaahhuOu', 'AAAAAhh.u', '.......uuu'],
  crossbow: ['.......l.l', 'aaaaahhwwwwwwwx', 'AAAAAhhW.l.l', '.......l...l'],
  lucille: ['.......l.l.l', 'aaaaahhwwwwwwWWW', 'AAAAAhh..l.l.l'],
  nailbat: ['.......l.l.l', 'aaaaahhwwwwwwWWW', 'AAAAAhh..l.l.l'],
  mojo: ['.......', 'aaaaahhhH', 'AAAAAhhh.'],
  dampfhammer: ['......HHH', 'aaaaahhHHH', 'AAAAAhhHHH', '......HHH'],
  slaps: ['.......', 'aaaaahhhh', 'AAAAAhhh.'],
  engage: ['.......', 'aaaaahhlllllc', 'AAAAAhhGG....'],
  melmac: ['.......uu', 'aaaaahhuOuO', 'AAAAAhhuuuu'],
  alicedual: ['.......lllllll.', 'aaaaahhgggGgggx', 'AAAAAhhGgGGGGG.', '.......lllllll.', '.......gggGgggx', '.......GgGGGGG.'],
  evknives: ['.......x', 'aaaaahhkxxxl', 'AAAAAhhk.xxxl'],
  flameduel: ['.......gg', 'aaaaahhggggggOn', 'AAAAAhhGG....GG'],
  sigp228: ['.......llllll', 'aaaaahhggggggx', 'AAAAAhhGGGGG.', '.......GG....', '.......GG....'],
});
Object.assign(HERO_SIGS, {
  rifle:      { name: 'ASSAULT RIFLE', type: 'bullet', rate: 0.09, dmg: 15, speed: 1800, spread: 0.04, count: 1, sfx: 'smg' },
  rocketl:    { name: 'ROCKET LAUNCHER', type: 'rocket', rate: 0.8, dmg: 100, speed: 560, spread: 0, count: 1, sfx: 'rocket', radius: 100 },
  glove:      { name: 'BOXING GLOVES', type: 'melee', rate: 0.22, dmg: 34, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 44, arc: 0.6, col: '#ffffff' },
  punch:      { name: 'FISTS', type: 'melee', rate: 0.2, dmg: 30, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 40, arc: 0.6, col: '#ffffff' },
  kick:       { name: 'ROUNDHOUSE KICK', type: 'melee', rate: 0.35, dmg: 55, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 60, arc: 1.4, col: '#ffffff' },
  smash:      { name: 'SMASH', type: 'melee', rate: 0.45, dmg: 110, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 70, arc: 1.2, col: '#9aff8a' },
  sawedoff:   { name: 'SAWED-OFF', type: 'bullet', rate: 0.6, dmg: 16, speed: 1200, spread: 0.34, count: 10, life: 0.3, sfx: 'shotgun' },
  uzi:        { name: 'UZI', type: 'bullet', rate: 0.05, dmg: 9, speed: 1600, spread: 0.09, count: 1, sfx: 'smg' },
  katana:     { name: 'KATANA', type: 'melee', rate: 0.24, dmg: 60, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 74, arc: 1.0, col: '#e8eaf2' },
  katanas:    { name: 'KATANAS', type: 'melee', rate: 0.18, dmg: 48, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 74, arc: 1.3, col: '#e8eaf2' },
  sword:      { name: 'SWORD', type: 'melee', rate: 0.3, dmg: 58, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 74, arc: 1.0, col: '#e8eaf2' },
  broadsword: { name: 'BROADSWORD', type: 'melee', rate: 0.42, dmg: 80, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 82, arc: 1.2, col: '#e8eaf2' },
  claymore:   { name: 'CLAYMORE', type: 'melee', rate: 0.45, dmg: 85, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 90, arc: 1.2, col: '#e8eaf2' },
  longclaw:   { name: 'LONGCLAW', type: 'melee', rate: 0.32, dmg: 62, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 80, arc: 1.0, col: '#c8ccd8' },
  gladius:    { name: 'GLADIUS', type: 'melee', rate: 0.25, dmg: 50, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 60, arc: 1.0, col: '#e8eaf2' },
  knife:      { name: 'KNIFE', type: 'melee', rate: 0.18, dmg: 38, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 44, arc: 0.8, col: '#e8eaf2' },
  scalpel:    { name: 'SCALPEL', type: 'melee', rate: 0.15, dmg: 34, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 40, arc: 0.6, col: '#e8eaf2' },
  machete:    { name: 'MACHETE', type: 'melee', rate: 0.28, dmg: 58, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 66, arc: 1.1, col: '#e8eaf2' },
  claws:      { name: 'CLAWS', type: 'melee', rate: 0.16, dmg: 44, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 52, arc: 1.0, col: '#e8eaf2' },
  freddyglove: { name: 'CLAW GLOVE', type: 'melee', rate: 0.2, dmg: 46, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 54, arc: 1.0, col: '#e8eaf2' },
  bladearm:   { name: 'BLADE ARM', type: 'melee', rate: 0.22, dmg: 54, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 70, arc: 0.9, col: '#c8ccd8' },
  chainsaw:   { name: 'CHAINSAW', type: 'melee', rate: 0.07, dmg: 18, speed: 0, spread: 0, count: 1, sfx: 'flame', reach: 60, arc: 0.5, col: '#f0c840' },
  bow:        { name: 'BOW', type: 'bullet', rate: 0.32, dmg: 40, speed: 1400, spread: 0.005, count: 1, sfx: 'throw' },
  wand:       { name: 'WAND', type: 'rail', rate: 0.35, dmg: 50, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff5040' },
  staff:      { name: 'STAFF', type: 'rail', rate: 0.5, dmg: 70, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ffffff' },
  spear:      { name: 'SPEAR', type: 'melee', rate: 0.35, dmg: 64, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 100, arc: 0.4, col: '#e8eaf2' },
  trident:    { name: 'TRIDENT', type: 'melee', rate: 0.38, dmg: 70, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 100, arc: 0.6, col: '#f0c840' },
  mjolnir:    { name: 'MJOLNIR', type: 'boomerang', rate: 0.6, dmg: 70, speed: 950, spread: 0, count: 1, sfx: 'throw', thrown: 'hammer' },
  shield:     { name: 'SHIELD', type: 'boomerang', rate: 0.55, dmg: 52, speed: 950, spread: 0, count: 1, sfx: 'throw', thrown: 'shield' },
  chakram:    { name: 'CHAKRAM', type: 'boomerang', rate: 0.45, dmg: 40, speed: 1000, spread: 0, count: 1, sfx: 'throw', thrown: 'chakram' },
  glaive:     { name: 'GLAIVE', type: 'boomerang', rate: 0.45, dmg: 44, speed: 1000, spread: 0, count: 1, sfx: 'throw', thrown: 'glaive' },
  skateboard: { name: 'HOVERBOARD', type: 'boomerang', rate: 0.6, dmg: 36, speed: 850, spread: 0, count: 1, sfx: 'throw', thrown: 'skateboard' },
  bowling:    { name: 'BOWLING BALL', type: 'boomerang', rate: 0.7, dmg: 60, speed: 700, spread: 0, count: 1, sfx: 'throw', thrown: 'bowling' },
  balloon:    { name: 'RED BALLOON', type: 'boomerang', rate: 0.6, dmg: 40, speed: 500, spread: 0, count: 1, sfx: 'throw', thrown: 'balloon' },
  knives:     { name: 'THROWING KNIVES', type: 'boomerang', rate: 0.3, dmg: 34, speed: 1200, spread: 0, count: 1, sfx: 'throw', thrown: 'knife' },
  lasso:      { name: 'LASSO OF TRUTH', type: 'melee', rate: 0.4, dmg: 50, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 130, arc: 0.5, col: '#f0c840' },
  bat:        { name: 'BASEBALL BAT', type: 'melee', rate: 0.3, dmg: 52, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 60, arc: 1.2, col: '#ffffff' },
  nunchaku:   { name: 'NUNCHAKU', type: 'melee', rate: 0.14, dmg: 32, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 54, arc: 1.6, col: '#ffffff' },
  stake:      { name: 'MR. POINTY', type: 'melee', rate: 0.2, dmg: 46, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 44, arc: 0.6, col: '#c8a070' },
  batons:     { name: 'WIDOW BITES', type: 'melee', rate: 0.2, dmg: 40, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 54, arc: 1.0, col: '#9ff6ff' },
  swissknife: { name: 'SWISS ARMY KNIFE', type: 'melee', rate: 0.2, dmg: 36, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 44, arc: 0.8, col: '#e8eaf2' },
  pinch:      { name: 'VULCAN NERVE PINCH', type: 'melee', rate: 0.5, dmg: 120, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 36, arc: 0.4, col: '#9ff6ff' },
  saw:        { name: 'BONE SAW', type: 'melee', rate: 0.1, dmg: 22, speed: 0, spread: 0, count: 1, sfx: 'flame', reach: 46, arc: 0.6, col: '#e8eaf2' },
  chains:     { name: 'HOOKED CHAINS', type: 'melee', rate: 0.4, dmg: 60, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 140, arc: 0.9, col: '#a8acb4' },
  acidtail:   { name: 'TAIL', type: 'melee', rate: 0.3, dmg: 58, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 90, arc: 1.4, col: '#9aff8a' },
  saberred:   { name: 'RED LIGHTSABER', type: 'melee', rate: 0.28, dmg: 72, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 70, arc: 1.1, col: '#ff6060' },
  flintlock:  { name: 'FLINTLOCK', type: 'bullet', rate: 0.7, dmg: 60, speed: 1300, spread: 0.03, count: 1, sfx: 'shotgun' },
  colt:       { name: 'COLT SAA', type: 'bullet', rate: 0.22, dmg: 34, speed: 1600, spread: 0.01, count: 1, sfx: 'pistol' },
  python:     { name: 'COLT PYTHON', type: 'bullet', rate: 0.28, dmg: 40, speed: 1700, spread: 0.01, count: 1, sfx: 'pistol' },
  magnum:     { name: '.44 MAGNUM', type: 'bullet', rate: 0.4, dmg: 55, speed: 1800, spread: 0.008, count: 1, sfx: 'shotgun' },
  deagle:     { name: 'DESERT EAGLE', type: 'bullet', rate: 0.3, dmg: 44, speed: 1800, spread: 0.01, count: 1, sfx: 'shotgun' },
  ppk:        { name: 'WALTHER PPK', type: 'bullet', rate: 0.14, dmg: 22, speed: 1700, spread: 0.01, count: 1, sfx: 'pistol' },
  pistol:     { name: 'PISTOL', type: 'bullet', rate: 0.15, dmg: 22, speed: 1700, spread: 0.012, count: 1, sfx: 'pistol' },
  blaster:    { name: 'BLASTER', type: 'rail', rate: 0.25, dmg: 36, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff4040' },
  deckard:    { name: 'BLASTER (2019)', type: 'bullet', rate: 0.35, dmg: 50, speed: 1800, spread: 0.01, count: 1, sfx: 'shotgun' },
  bowcaster:  { name: 'BOWCASTER', type: 'rail', rate: 0.5, dmg: 70, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#80ff90' },
  phaser:     { name: 'PHASER', type: 'rail', rate: 0.3, dmg: 40, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff8040' },
  cricket:    { name: 'NOISY CRICKET', type: 'rocket', rate: 0.9, dmg: 120, speed: 900, spread: 0, count: 1, sfx: 'rocket', radius: 110 },
  deatomizer: { name: 'DE-ATOMIZER', type: 'rail', rate: 0.6, dmg: 90, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#9ff6ff' },
  proton:     { name: 'PROTON PACK', type: 'rail', rate: 0.1, dmg: 18, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff9a3c' },
  lawgiver:   { name: 'LAWGIVER', type: 'bullet', rate: 0.12, dmg: 24, speed: 1900, spread: 0.01, count: 1, sfx: 'pistol' },
  samaritan:  { name: 'SAMARITAN', type: 'bullet', rate: 0.6, dmg: 80, speed: 1500, spread: 0.01, count: 1, sfx: 'shotgun' },
  elephantgun: { name: 'ELEPHANT GUN', type: 'bullet', rate: 0.9, dmg: 120, speed: 2000, spread: 0.005, count: 1, sfx: 'shotgun' },
  morita:     { name: 'MORITA RIFLE', type: 'bullet', rate: 0.08, dmg: 16, speed: 1800, spread: 0.05, count: 1, sfx: 'smg' },
  guitarcase: { name: 'GUITAR CASE', type: 'rocket', rate: 0.7, dmg: 90, speed: 600, spread: 0, count: 1, sfx: 'rocket', radius: 90 },
  leggun:     { name: 'LEG GUN', type: 'bullet', rate: 0.06, dmg: 14, speed: 1600, spread: 0.07, count: 1, sfx: 'smg' },
  flamer:     { name: 'FLAMETHROWER', type: 'flame', rate: 0.028, dmg: 4, speed: 560, spread: 0.16, count: 1, sfx: 'flame' },
  wristflame: { name: 'WRIST FLAMER', type: 'flame', rate: 0.035, dmg: 3, speed: 480, spread: 0.2, count: 1, sfx: 'flame' },
  acid:       { name: 'ACID', type: 'flame', rate: 0.04, dmg: 4, speed: 420, spread: 0.25, count: 1, sfx: 'flame' },
  mauser:     { name: 'MAUSER C96', type: 'bullet', rate: 0.14, dmg: 22, speed: 1700, spread: 0.015, count: 1, sfx: 'pistol' },
  snap:       { name: 'INFINITY GAUNTLET', type: 'rail', rate: 1.2, dmg: 150, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#c88aff' },
  sceptre:    { name: 'SCEPTRE', type: 'rail', rate: 0.45, dmg: 60, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#6ad0f6' },
  eldritch:   { name: 'ELDRITCH MAGIC', type: 'rail', rate: 0.4, dmg: 58, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff9a3c' },
  psychic:    { name: 'TELEKINESIS', type: 'rail', rate: 0.5, dmg: 75, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff8ad8' },
  force:      { name: 'THE FORCE', type: 'rail', rate: 0.6, dmg: 70, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#9aff8a' },
  heatvision: { name: 'HEAT VISION', type: 'rail', rate: 0.15, dmg: 30, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff3020' },
  laser:      { name: 'LASER EYES', type: 'rail', rate: 0.15, dmg: 30, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff3020' },
  web:        { name: 'WEB SHOOTER', type: 'rail', rate: 0.25, dmg: 30, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#f0f0f4' },
  lightning:  { name: 'LIGHTNING', type: 'rail', rate: 0.2, dmg: 40, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#c8fcff' },
  flux:       { name: '1.21 GIGAWATTS', type: 'rail', rate: 0.5, dmg: 70, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#c8fcff' },
  flare:      { name: 'FLARE', type: 'rocket', rate: 0.7, dmg: 50, speed: 500, spread: 0, count: 1, sfx: 'rocket', radius: 60 },
  bang:       { name: 'BANG! GUN', type: 'bullet', rate: 0.35, dmg: 46, speed: 1500, spread: 0.02, count: 1, sfx: 'pistol' },
  boomstick:  { name: 'BOOMSTICK', type: 'bullet', rate: 0.6, dmg: 15, speed: 1300, spread: 0.26, count: 10, life: 0.4, sfx: 'shotgun' },
  aa12:       { name: 'AA-12', type: 'bullet', rate: 0.18, dmg: 12, speed: 1300, spread: 0.24, count: 6, life: 0.4, sfx: 'shotgun' },
  amban:      { name: 'AMBAN RIFLE', type: 'rail', rate: 0.8, dmg: 95, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#c8fcff' },
  plasma:     { name: 'PLASMA CASTER', type: 'rocket', rate: 0.6, dmg: 70, speed: 900, spread: 0, count: 1, sfx: 'rail', radius: 70 },
  lizardspock: { name: 'LIZARD-SPOCK', type: 'boomerang', rate: 0.4, dmg: 42, speed: 1000, spread: 0, count: 1, sfx: 'throw', thrown: 'hand' },
  cheesecake: { name: 'CHEESECAKE', type: 'boomerang', rate: 0.5, dmg: 46, speed: 850, spread: 0, count: 1, sfx: 'throw', thrown: 'cheesecake' },
  roverarm:   { name: 'MARS ROVER ARM', type: 'melee', rate: 0.35, dmg: 56, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 110, arc: 0.5, col: '#c8ccd8' },
  piano:      { name: 'BABY GRAND', type: 'rocket', rate: 0.9, dmg: 120, speed: 520, spread: 0, count: 1, sfx: 'rocket', radius: 110 },
  chiro:      { name: 'CHIRO CRACK', type: 'melee', rate: 0.25, dmg: 38, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 44, arc: 0.7, col: '#ffffff' },
  meatballsub: { name: 'MEATBALL SUB', type: 'boomerang', rate: 0.5, dmg: 48, speed: 900, spread: 0, count: 1, sfx: 'throw', thrown: 'sub' },
  pivot:      { name: 'PIVOT!', type: 'melee', rate: 0.5, dmg: 80, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 80, arc: 1.4, col: '#ff8a8a' },
  suitup:     { name: 'SUIT UP!', type: 'rail', rate: 0.2, dmg: 34, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff3020' },
  donut:      { name: 'DONUTS', type: 'boomerang', rate: 0.3, dmg: 36, speed: 950, spread: 0, count: 1, sfx: 'throw', thrown: 'donut' },
  slingshot:  { name: 'SLINGSHOT', type: 'bullet', rate: 0.3, dmg: 34, speed: 1300, spread: 0.02, count: 1, sfx: 'throw' },
  chickenfight: { name: 'CHICKEN FIGHT', type: 'melee', rate: 0.22, dmg: 40, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 54, arc: 1.4, col: '#ffe0a0' },
  cheesypoofs: { name: 'CHEESY POOFS', type: 'bullet', rate: 0.5, dmg: 12, speed: 1100, spread: 0.3, count: 8, life: 0.4, sfx: 'shotgun' },
  girder:     { name: 'GIRDER', type: 'melee', rate: 0.45, dmg: 90, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 80, arc: 1.2, col: '#c8ccd8' },
  ipsbox:     { name: 'IPS PARCEL', type: 'boomerang', rate: 0.5, dmg: 50, speed: 850, spread: 0, count: 1, sfx: 'throw', thrown: 'box' },
  shoehorn:   { name: 'SHOE HORN', type: 'melee', rate: 0.25, dmg: 46, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 56, arc: 1.0, col: '#f0c840' },
  drill:      { name: 'POWER DRILL', type: 'melee', rate: 0.07, dmg: 16, speed: 0, spread: 0, count: 1, sfx: 'flame', reach: 50, arc: 0.4, col: '#f0c840' },
  stethoscope: { name: 'STETHOSCOPE', type: 'melee', rate: 0.3, dmg: 44, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 110, arc: 0.7, col: '#c8ccd8' },
  beetcannon: { name: 'BEET CANNON', type: 'rocket', rate: 0.6, dmg: 70, speed: 750, spread: 0, count: 1, sfx: 'rocket', radius: 70 },
  coolglock:  { name: 'COOL COOL GLOCK', type: 'bullet', rate: 0.14, dmg: 24, speed: 1800, spread: 0.01, count: 1, sfx: 'pistol' },
  teddy:      { name: 'TEDDY', type: 'boomerang', rate: 0.5, dmg: 40, speed: 850, spread: 0, count: 1, sfx: 'throw', thrown: 'teddy' },
  spoon:      { name: 'SPOON', type: 'melee', rate: 0.15, dmg: 30, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 40, arc: 0.6, col: '#e8eaf2' },
  slides:     { name: 'EVIDENCE SLIDES', type: 'boomerang', rate: 0.3, dmg: 34, speed: 1200, spread: 0, count: 1, sfx: 'throw', thrown: 'slide' },
  snub:       { name: '.38 SNUB NOSE', type: 'bullet', rate: 0.28, dmg: 38, speed: 1600, spread: 0.015, count: 1, sfx: 'pistol' },
  razorcap:   { name: 'RAZOR CAP', type: 'boomerang', rate: 0.5, dmg: 54, speed: 1000, spread: 0, count: 1, sfx: 'throw', thrown: 'cap' },
  beardaxe:   { name: 'BEARDED AXE', type: 'melee', rate: 0.4, dmg: 76, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 70, arc: 1.2, col: '#e8eaf2' },
  silversword: { name: 'SILVER SWORD', type: 'melee', rate: 0.3, dmg: 64, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 80, arc: 1.1, col: '#e8eaf2' },
  dalismg:    { name: 'HEIST SMG', type: 'bullet', rate: 0.06, dmg: 10, speed: 1600, spread: 0.08, count: 1, sfx: 'smg' },
  dalgona:    { name: 'DALGONA', type: 'boomerang', rate: 0.4, dmg: 40, speed: 950, spread: 0, count: 1, sfx: 'throw', thrown: 'dalgona' },
  thing:      { name: 'THING', type: 'boomerang', rate: 0.45, dmg: 44, speed: 900, spread: 0, count: 1, sfx: 'throw', thrown: 'thing' },
  lawbook:    { name: 'LAW BOOK', type: 'boomerang', rate: 0.5, dmg: 48, speed: 900, spread: 0, count: 1, sfx: 'throw', thrown: 'book' },
  cane:       { name: 'CANE', type: 'melee', rate: 0.3, dmg: 48, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 66, arc: 1.0, col: '#c8a070' },
  violin:     { name: 'VIOLIN', type: 'melee', rate: 0.25, dmg: 42, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 60, arc: 1.0, col: '#c8a070' },
  sonic:      { name: 'SONIC SCREWDRIVER', type: 'rail', rate: 0.25, dmg: 40, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#6ad0f6' },
  tractor:    { name: 'TRACTOR BEAM', type: 'rail', rate: 0.12, dmg: 22, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#9aff8a' },
  rescuecan:  { name: 'RESCUE CAN', type: 'boomerang', rate: 0.5, dmg: 48, speed: 900, spread: 0, count: 1, sfx: 'throw', thrown: 'buoy' },
  portalgun:  { name: 'PORTAL GUN', type: 'rail', rate: 0.45, dmg: 66, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#9aff8a' },
  spatula:    { name: 'SPATULA', type: 'melee', rate: 0.2, dmg: 40, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 54, arc: 1.0, col: '#e8eaf2' },
  ezekiel:    { name: 'EZEKIEL 25:17', type: 'bullet', rate: 0.2, dmg: 32, speed: 1800, spread: 0.01, count: 1, sfx: 'pistol' },
  vega45:     { name: '.45 AUTO', type: 'bullet', rate: 0.18, dmg: 28, speed: 1700, spread: 0.012, count: 1, sfx: 'pistol' },
  milkshake:  { name: '$5 SHAKE', type: 'boomerang', rate: 0.45, dmg: 40, speed: 900, spread: 0, count: 1, sfx: 'throw', thrown: 'shake' },
  nuke:       { name: 'NUKE', type: 'rocket', rate: 1.1, dmg: 150, speed: 450, spread: 0, count: 1, sfx: 'rocket', radius: 140 },
  spacedrill: { name: 'ASTEROID DRILL', type: 'melee', rate: 0.07, dmg: 18, speed: 0, spread: 0, count: 1, sfx: 'flame', reach: 64, arc: 0.4, col: '#f0c840' },
  navibow:    { name: "NA'VI BOW", type: 'bullet', rate: 0.3, dmg: 44, speed: 1500, spread: 0.005, count: 1, sfx: 'throw' },
  ampgun:     { name: 'AMP SUIT GUN', type: 'bullet', rate: 0.05, dmg: 12, speed: 1700, spread: 0.08, count: 1, sfx: 'smg' },
  quadblaster: { name: 'QUAD BLASTERS', type: 'dual', rate: 0.1, dmg: 16, speed: 1800, spread: 0.04, count: 2, sfx: 'pistol' },
  rocketbig:  { name: 'BIG GUN', type: 'rocket', rate: 0.75, dmg: 110, speed: 650, spread: 0, count: 1, sfx: 'rocket', radius: 110 },
  branch:     { name: 'I AM GROOT', type: 'melee', rate: 0.4, dmg: 66, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 120, arc: 0.6, col: '#c8a070' },
  godslayer:  { name: 'GODSLAYER', type: 'melee', rate: 0.26, dmg: 60, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 74, arc: 1.1, col: '#e8eaf2' },
  draxknives: { name: 'TWIN KNIVES', type: 'melee', rate: 0.16, dmg: 40, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 50, arc: 1.2, col: '#e8eaf2' },
  leviosa:    { name: 'WINGARDIUM LEVIOSA', type: 'rail', rate: 0.35, dmg: 48, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ffe0a0' },
  brokenwand: { name: 'BROKEN WAND', type: 'rail', rate: 0.4, dmg: 44, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#9aff8a' },
  avada:      { name: 'AVADA KEDAVRA', type: 'rail', rate: 0.6, dmg: 90, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#3aff4a' },
  umbrella:   { name: 'PINK UMBRELLA', type: 'rail', rate: 0.45, dmg: 56, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff8ad8' },
  saberblue:  { name: 'BLUE LIGHTSABER', type: 'melee', rate: 0.28, dmg: 70, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 70, arc: 1.1, col: '#6ad0f6' },
  sabergreen: { name: 'GREEN LIGHTSABER', type: 'melee', rate: 0.2, dmg: 64, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 60, arc: 1.6, col: '#9aff8a' },
  saberdouble: { name: 'DOUBLE-BLADED SABER', type: 'melee', rate: 0.24, dmg: 68, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 70, arc: 2.6, col: '#ff6060' },
  sabercross: { name: 'CROSSGUARD SABER', type: 'melee', rate: 0.32, dmg: 78, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 72, arc: 1.2, col: '#ff6060' },
  reystaff:   { name: 'QUARTERSTAFF', type: 'melee', rate: 0.26, dmg: 52, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 96, arc: 1.4, col: '#c8a070' },
  kungfu:     { name: 'I KNOW KUNG FU', type: 'melee', rate: 0.14, dmg: 34, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 46, arc: 1.2, col: '#9aff8a' },
  hkp7:       { name: 'HK P7', type: 'bullet', rate: 0.15, dmg: 24, speed: 1800, spread: 0.01, count: 1, sfx: 'pistol' },
  littlefriend: { name: 'MY LITTLE FRIEND', type: 'rocket', rate: 0.7, dmg: 100, speed: 700, spread: 0, count: 1, sfx: 'rocket', radius: 100 },
  mallet:     { name: 'CARTOON MALLET', type: 'melee', rate: 0.45, dmg: 100, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 70, arc: 1.3, col: '#f0c840' },
  plunger:    { name: 'PLUNGER', type: 'boomerang', rate: 0.45, dmg: 40, speed: 950, spread: 0, count: 1, sfx: 'throw', thrown: 'plunger' },
  paintcans:  { name: 'PAINT CANS', type: 'boomerang', rate: 0.5, dmg: 50, speed: 850, spread: 0, count: 1, sfx: 'throw', thrown: 'paint' },
  pingpong:   { name: 'PING-PONG', type: 'boomerang', rate: 0.15, dmg: 22, speed: 1300, spread: 0, count: 1, sfx: 'throw', thrown: 'ball' },
  browning:   { name: 'BROWNING HI-POWER', type: 'bullet', rate: 0.15, dmg: 24, speed: 1800, spread: 0.01, count: 1, sfx: 'pistol' },
  sidewinder: { name: 'SIDEWINDER', type: 'rocket', rate: 0.8, dmg: 110, speed: 900, spread: 0, count: 1, sfx: 'rocket', radius: 100 },
  fireaxe:    { name: 'FIRE AXE', type: 'melee', rate: 0.42, dmg: 82, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 70, arc: 1.2, col: '#e8eaf2' },
  science:    { name: 'YEAH, SCIENCE!', type: 'boomerang', rate: 0.45, dmg: 46, speed: 900, spread: 0, count: 1, sfx: 'throw', thrown: 'flask' },
  dracarys:   { name: 'DRACARYS', type: 'flame', rate: 0.025, dmg: 5, speed: 600, spread: 0.18, count: 1, sfx: 'flame' },
  needle:     { name: 'NEEDLE', type: 'melee', rate: 0.14, dmg: 36, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 64, arc: 0.4, col: '#e8eaf2' },
  goblet:     { name: 'WINE GOBLET', type: 'boomerang', rate: 0.4, dmg: 38, speed: 900, spread: 0, count: 1, sfx: 'throw', thrown: 'goblet' },
  crossbow:   { name: 'CROSSBOW', type: 'bullet', rate: 0.45, dmg: 60, speed: 1600, spread: 0.004, count: 1, sfx: 'throw' },
  lucille:    { name: 'LUCILLE', type: 'melee', rate: 0.38, dmg: 74, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 64, arc: 1.3, col: '#e8eaf2' },
  nailbat:    { name: 'NAIL BAT', type: 'melee', rate: 0.32, dmg: 58, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 62, arc: 1.2, col: '#e8eaf2' },
  mojo:       { name: 'MOJO', type: 'rail', rate: 0.3, dmg: 44, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff8ad8' },
  dampfhammer: { name: 'DAMPFHAMMER', type: 'melee', rate: 0.55, dmg: 130, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 64, arc: 1.4, col: '#ffffff' },
  slaps:      { name: 'SLAP SLAP SLAP', type: 'melee', rate: 0.09, dmg: 22, speed: 0, spread: 0, count: 1, sfx: 'rail', reach: 46, arc: 1.0, col: '#ffffff' },
  engage:     { name: 'ENGAGE!', type: 'rail', rate: 0.3, dmg: 42, speed: 0, spread: 0, count: 1, sfx: 'rail', col: '#ff8040' },
  melmac:     { name: 'MELMAC SNACKS', type: 'boomerang', rate: 0.35, dmg: 38, speed: 950, spread: 0, count: 1, sfx: 'throw', thrown: 'pizza' },
  alicedual:  { name: 'TWIN PISTOLS', type: 'dual', rate: 0.08, dmg: 15, speed: 1800, spread: 0.05, count: 2, sfx: 'pistol' },
  evknives:   { name: 'THROWING KNIVES', type: 'stick', rate: 0.13, dmg: 30, speed: 1350, spread: 0.02, count: 1, sfx: 'throw', thrown: 'tknife' },
  flameduel:  { name: 'FLAMETHROWER DUEL', type: 'flame', rate: 0.028, dmg: 4, speed: 560, spread: 0.16, count: 1, sfx: 'flame' },
  sigp228:    { name: 'SIG P228', type: 'bullet', rate: 0.14, dmg: 24, speed: 1800, spread: 0.01, count: 1, sfx: 'pistol' },
  beerbottle: { name: 'PAWTUCKET PATRIOT', type: 'boomerang', rate: 0.35, dmg: 42, speed: 950, spread: 0, count: 1, sfx: 'throw', thrown: 'bottle' },
  duck:       { name: 'THE DUCK', type: 'boomerang', rate: 0.45, dmg: 40, speed: 900, spread: 0, count: 1, sfx: 'throw', thrown: 'duck' },
});

for (const h of HEROES2) HEROES.push(h);
