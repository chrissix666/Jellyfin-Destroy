const R_ = (material, x, y, w, h, detail) => ({ k: 'rect', m: material, x: x, y: y, w: w, h: h, d: !!detail });
const P_ = (material, pts, detail) => ({ k: 'poly', m: material, pts: pts, d: !!detail });
const O_ = (material, x, y, w, h, t) => ({ k: 'ring', m: material, x: x, y: y, w: w, h: h, t: t || 0.9 });

const WEAPON_MODELS = {
  auto9: { name: 'AUTO-9', ppcm: 1.0, grip: [3, 6], parts: [
    R_('poly', 0.3, 13.8, 4.4, 5.8), R_('steelD', 0.1, 19.2, 4.8, 0.8),
    P_('poly', [[1, 5], [6.6, 5], [5.2, 14], [0, 14]]),
    R_('black', 1.6, 7, 3, 0.4, 1), R_('black', 1.3, 9, 3, 0.4, 1), R_('black', 1.0, 11, 3, 0.4, 1),
    O_('steel', 6, 5.2, 6.6, 4.4, 0.9),
    R_('steelD', 8.4, 5.6, 0.8, 2.4),
    R_('steel', 4, 3.4, 18, 2.1),
    R_('steelD', 15.6, 5.5, 1.6, 5.2), R_('steel', 15.2, 5.4, 2.4, 1),
    R_('steel', 0, 0, 21, 3.5),
    R_('black', 1.8, 0.6, 0.35, 2.2, 1), R_('black', 2.6, 0.6, 0.35, 2.2, 1), R_('black', 3.4, 0.6, 0.35, 2.2, 1),
    R_('steelL', 0, 0, 21, 0.5),
    R_('steelD', 18.6, -1.2, 13.8, 6.2),
    R_('steelL', 19, -1.2, 13.2, 0.6),
    R_('black', 20.4, 0.4, 1.4, 1.5, 1), R_('black', 23, 0.4, 1.4, 1.5, 1), R_('black', 25.6, 0.4, 1.4, 1.5, 1), R_('black', 28.2, 0.4, 1.4, 1.5, 1),
    R_('black', 20.4, 3, 10.5, 0.4, 1),
    R_('steel', 30.6, -2.8, 1.2, 1.6),
    R_('steel', 0.6, -2.4, 2.2, 2.5), R_('black', 1.4, -2.4, 0.5, 1.2, 1),
    R_('steelD', -0.7, 0.4, 1.1, 1.9),
    R_('black', 32.4, 1.2, 0.6, 1.8, 1),
    R_('steelL', 5.6, 3.6, 1.2, 0.7),
  ] },
  beretta: { name: 'BERETTA 92', ppcm: 1.0, grip: [3, 6], parts: [
    R_('steelD', -0.4, 13.4, 5, 0.9),
    P_('wood', [[1, 4.6], [6, 4.6], [4.6, 13.5], [-0.4, 13.5]]),
    R_('steelL', 2.1, 6.2, 0.8, 0.8, 1), R_('steelL', 1.2, 11.4, 0.8, 0.8, 1),
    R_('black', 1.8, 8, 2.6, 0.3, 1), R_('black', 1.5, 9.6, 2.6, 0.3, 1),
    O_('steel', 5.2, 4.8, 5.4, 3.8, 0.8),
    R_('steelD', 7.2, 5, 0.8, 2.2),
    R_('steel', 4.6, 3.3, 16.6, 1.8),
    R_('steel', 0, 0, 21.7, 3.4),
    R_('steelL', 8.6, 0, 8.6, 1.3),
    R_('black', 1.4, 0.7, 0.3, 2.1, 1), R_('black', 2.1, 0.7, 0.3, 2.1, 1), R_('black', 2.8, 0.7, 0.3, 2.1, 1),
    R_('steelL', 5.2, 1.5, 1.6, 0.8),
    R_('steel', 20.6, -0.7, 0.8, 0.7), R_('steel', 1.4, -0.7, 1.2, 0.7),
    R_('steelD', -0.6, 0.6, 1.0, 1.7),
    R_('black', 21.7, 1.3, 0.5, 1.1, 1),
  ] },
  m60: { name: 'M60', ppcm: 0.55, grip: [43, 12], parts: [
    P_('poly', [[0, 1], [27, 1.6], [27, 8.5], [10, 9.5], [0, 14]]),
    R_('black', 0, 1, 1.4, 13, 1),
    R_('steelD', 4, 3.6, 12, 0.6, 1),
    R_('steel', 27, 0, 34, 8.6),
    R_('steelD', 36, -2, 22, 2.4), R_('steelL', 36, -2, 22, 0.6),
    R_('steelD', 56.5, -2.6, 2, 0.9),
    R_('steelD', 30, 1.8, 5, 0.7, 1), R_('black', 47, 5.4, 6, 1.2, 1),
    P_('poly', [[40, 8.6], [47, 8.6], [45, 19.5], [38.5, 19.5]]),
    O_('steel', 46.5, 8.4, 8.5, 4.8, 1.0), R_('steelD', 48.6, 8.8, 1, 2.6),
    R_('brass', 34, 8.6, 2.6, 7.5), R_('brass', 36.8, 9.8, 2.6, 7.5), R_('brass', 33, 16, 2.6, 4),
    R_('black', 34, 10.6, 2.6, 0.5, 1), R_('black', 36.8, 12, 2.6, 0.5, 1), R_('black', 34, 13.4, 2.6, 0.5, 1),
    R_('poly', 61, 0.8, 19, 7.8),
    R_('black', 63, 2.4, 2.2, 1.4, 1), R_('black', 67, 2.4, 2.2, 1.4, 1), R_('black', 71, 2.4, 2.2, 1.4, 1), R_('black', 75, 2.4, 2.2, 1.4, 1),
    R_('black', 63, 5.2, 2.2, 1.4, 1), R_('black', 67, 5.2, 2.2, 1.4, 1), R_('black', 71, 5.2, 2.2, 1.4, 1), R_('black', 75, 5.2, 2.2, 1.4, 1),
    R_('steelL', 80, 2.8, 26, 2.6),
    R_('steel', 80, 5.8, 15, 1.6),
    O_('steelD', 66, -6.5, 15, 7.3, 1.2),
    R_('steelD', 84, 7.4, 20, 1.1), R_('steelD', 84, 8.6, 18, 0.9),
    R_('steel', 102.5, 6.8, 2, 2.4),
    R_('steel', 105.5, 0.6, 1.2, 2.2),
    R_('steelD', 106, 2.2, 5, 3.4), R_('black', 107.5, 2.2, 0.5, 3.4, 1), R_('black', 109, 2.2, 0.5, 3.4, 1),
  ] },
  minigun: { name: 'M134 MINIGUN', ppcm: 0.55, grip: [9, 13], parts: [
    R_('steel', 0, 0, 30, 11), R_('steelD', 0, 0, 4, 11),
    R_('steelD', 18, 1, 9, 9), R_('steelL', 19, 2, 7, 1.2),
    O_('steelD', 7, -5.5, 18, 6, 1.4),
    R_('poly', 2, 11, 5.5, 10), R_('steelD', 6.8, 12, 1.4, 3),
    R_('brass', 14, 11, 5.6, 9), R_('black', 14, 12.5, 5.6, 0.5, 1), R_('black', 14, 15, 5.6, 0.5, 1), R_('black', 14, 17.5, 5.6, 0.5, 1),
    R_('brass', 12, 20, 9.6, 2.4),
    R_('steelL', 30, 0.8, 54, 1.9), R_('steel', 30, 3.2, 54, 1.9), R_('steelL', 30, 5.6, 54, 1.9), R_('steel', 30, 8.0, 54, 1.9),
    R_('black', 30, 2.7, 54, 0.5, 1), R_('black', 30, 5.1, 54, 0.5, 1), R_('black', 30, 7.5, 54, 0.5, 1),
    R_('steelD', 50, -0.2, 3.4, 10.8), R_('steelD', 77, -0.2, 3.4, 10.8),
    R_('black', 84, 0.8, 1, 9.1, 1),
  ] },
  glock: { name: 'GLOCK 17', ppcm: 1.0, grip: [3, 5.5], parts: [
    R_('steelD', -0.6, 12.6, 5.3, 0.8),
    P_('poly', [[0.5, 4.2], [5.6, 4.2], [4.4, 12.7], [-0.6, 12.7]]),
    R_('black', 1.2, 6.5, 3.4, 0.3, 1), R_('black', 1.0, 8, 3.4, 0.3, 1), R_('black', 0.7, 9.5, 3.4, 0.3, 1),
    O_('poly', 5, 4.4, 4.8, 3.2, 0.8), R_('steelD', 6.6, 4.6, 0.7, 1.9),
    R_('poly', 3, 2.9, 14, 1.8), R_('black', 11, 3.9, 4.5, 0.4, 1),
    R_('steel', 0, 0, 18.6, 3.0), R_('steelL', 0, 0, 18.6, 0.45),
    R_('black', 1.2, 0.6, 0.3, 2, 1), R_('black', 1.9, 0.6, 0.3, 2, 1), R_('black', 2.6, 0.6, 0.3, 2, 1),
    R_('black', 9, 0.5, 4, 0.8, 1),
    R_('steel', 17.6, -0.6, 0.7, 0.6), R_('steel', 1.0, -0.6, 1.2, 0.6),
    R_('black', 18.6, 1.1, 0.4, 1.0, 1),
  ] },
  usp: { name: 'USP', ppcm: 1.0, grip: [3, 5.8], parts: [
    R_('steelD', -0.6, 13.2, 5.4, 0.9),
    P_('poly', [[0.4, 4.5], [5.8, 4.5], [4.6, 13.3], [-0.6, 13.3]]),
    R_('black', 1.2, 7, 3.4, 0.3, 1), R_('black', 0.9, 8.6, 3.4, 0.3, 1), R_('black', 0.6, 10.2, 3.4, 0.3, 1),
    O_('poly', 5.2, 4.6, 5.2, 3.4, 0.9), R_('steelD', 6.9, 4.8, 0.7, 2),
    R_('poly', 3.2, 3.2, 15.4, 1.9), R_('black', 12, 4.3, 0.6, 0.6, 1), R_('black', 13.4, 4.3, 0.6, 0.6, 1), R_('black', 14.8, 4.3, 0.6, 0.6, 1),
    R_('steel', 0, 0, 19.4, 3.3), R_('steelL', 0, 0, 19.4, 0.5),
    R_('black', 1.2, 0.7, 0.3, 2.2, 1), R_('black', 1.9, 0.7, 0.3, 2.2, 1), R_('black', 2.6, 0.7, 0.3, 2.2, 1),
    R_('black', 8.6, 0.5, 4.4, 0.9, 1), R_('steelL', 4.2, 2.2, 1.6, 0.7),
    R_('steel', 18.4, -0.7, 0.7, 0.7), R_('steel', 0.8, -0.7, 1.4, 0.7),
    R_('steelD', -0.7, 0.6, 1.0, 1.6), R_('black', 19.4, 1.1, 0.4, 1.1, 1),
  ] },
  webley: { name: 'WEBLEY', ppcm: 1.0, grip: [3, 6], parts: [
    P_('wood', [[1, 4], [5.6, 4], [4.2, 12], [-0.6, 12.5]]), R_('black', 1.2, 7, 2.8, 0.3, 1), R_('black', 0.8, 9, 2.8, 0.3, 1),
    O_('steel', 5, 4.4, 4.6, 3.2, 0.8), R_('steelD', 6.5, 4.6, 0.7, 1.8),
    R_('steel', 4, 0.4, 3.6, 4.4), R_('steelD', 7.6, -0.2, 6.4, 5.2),
    R_('black', 8.4, 0.8, 4.8, 0.4, 1), R_('black', 8.4, 2.2, 4.8, 0.4, 1), R_('black', 8.4, 3.6, 4.8, 0.4, 1),
    R_('steel', 14, 0.6, 12, 2.0), R_('steelL', 4, -0.4, 22, 0.8),
    R_('steel', 25.2, -1, 0.8, 0.8), R_('steelD', 2.6, -1.2, 1.6, 1.8),
    R_('black', 26, 1.0, 0.4, 1.2, 1),
  ] },
  mp5: { name: 'MP5', ppcm: 0.72, grip: [19, 6.5], parts: [
    R_('steelD', 0, -0.2, 1.4, 6), R_('steel', 1.4, 1, 9, 0.7), R_('steel', 1.4, 3.6, 9, 0.7),
    P_('poly', [[27.5, 5], [31.5, 5], [33.5, 16], [29.5, 16.6]]), R_('black', 28.5, 8, 3.4, 0.4, 1),
    P_('poly', [[16.5, 5], [21.5, 5], [20.2, 13.2], [15.2, 13.2]]),
    O_('poly', 21, 4.8, 5.2, 3.6, 0.8), R_('steelD', 22.6, 5, 0.7, 2),
    R_('steel', 10, 0, 34, 5.2), R_('steelL', 10, 0, 34, 0.6),
    R_('steelD', 31, -0.1, 13, 1.4), R_('black', 33, 0.2, 4, 0.5, 1),
    P_('poly', [[33, 5.2], [45, 4.2], [45, 8], [34, 9]]),
    R_('steelL', 45, 1.6, 6.2, 1.5), O_('steelD', 45.2, -2.4, 2.4, 3, 0.6),
    R_('steelD', 11.5, -2.2, 3.2, 2.3), R_('black', 12.4, -1.8, 1.4, 1.2, 1),
    R_('black', 51.2, 1.8, 0.4, 1.1, 1),
  ] },
  remington: { name: 'REMINGTON 870', ppcm: 0.5, grip: [31, 7.5], parts: [
    P_('wood', [[0, 3], [24, 1.5], [24, 7.5], [13, 7.4], [0, 11.5]]), R_('black', 0, 3, 1.2, 8.5, 1),
    R_('steel', 24, 0, 20, 6.6), R_('steelL', 24, 0, 20, 0.7), R_('black', 33, 2.2, 6, 1.6, 1),
    O_('steel', 30, 6.4, 7.5, 3, 0.8), R_('steelD', 32, 6.6, 0.8, 1.8),
    R_('steelL', 44, 0.6, 56, 1.9), R_('steel', 44, 3, 42, 2),
    P_('wood', [[50, 2.4], [68, 2.4], [68, 6.2], [50, 6.2]]), R_('black', 52, 3.6, 14, 0.4, 1), R_('black', 52, 5, 14, 0.4, 1),
    R_('steelL', 99, -0.5, 0.8, 1.1), R_('black', 100, 0.8, 0.4, 1.5, 1),
  ] },
  rpg7: { name: 'RPG-7', ppcm: 0.42, grip: [49, 10], parts: [
    R_('green', 0, 3.2, 96, 4), R_('black', 0, 3.2, 1.4, 4, 1),
    P_('green', [[0, 1.6], [6, 3.2], [6, 7.2], [0, 8.8]]),
    R_('wood', 34, 2.2, 22, 6.2), R_('black', 40, 2.2, 0.5, 6.2, 1), R_('black', 47, 2.2, 0.5, 6.2, 1),
    P_('poly', [[47, 7.2], [52, 7.2], [51, 15], [46, 15]]), O_('steel', 51, 7, 6, 3.4, 0.8),
    R_('poly', 38, 7.2, 3, 5.8),
    R_('black', 46, -1.6, 9, 3.6), R_('black', 52, -2.4, 3, 1.2),
    P_('green', [[96, 3.6], [104, 0.6], [114, 0.6], [121, 5.2], [114, 9.8], [104, 9.8], [96, 6.8]]),
    R_('black', 104, 0.6, 0.6, 9.2, 1), R_('steelD', 121, 4.4, 2.4, 1.6),
  ] },
  railgun: { name: 'RAILGUN', ppcm: 0.5, grip: [22, 11], parts: [
    P_('steel', [[0, 2], [16, 0], [60, 0], [60, 9], [16, 9], [0, 7]]),
    R_('steelD', 60, 0.6, 32, 2), R_('steelD', 60, 6.4, 32, 2),
    R_('blue', 64, 2.6, 1.6, 3.8), R_('blue', 70, 2.6, 1.6, 3.8), R_('blue', 76, 2.6, 1.6, 3.8), R_('blue', 82, 2.6, 1.6, 3.8), R_('blue', 88, 2.6, 1.6, 3.8),
    R_('blue', 24, 1.6, 30, 1.2), R_('led', 40, 4.4, 8, 1.4),
    P_('poly', [[19, 9], [25, 9], [23.5, 17.5], [17.5, 17.5]]), O_('steel', 25, 8.8, 6, 3.6, 0.8),
  ] },
  flamer: { name: 'M2 FLAMER', ppcm: 0.55, grip: [26, 9], parts: [
    R_('red', 0, 0, 14, 15), R_('steelD', 3, -1.4, 8, 1.6), R_('black', 0, 5, 14, 0.5, 1), R_('black', 0, 10, 14, 0.5, 1),
    R_('steelD', 14, 7, 6, 1.4),
    R_('steel', 18, 4, 40, 3.6), R_('steelL', 18, 4, 40, 0.6),
    P_('poly', [[23, 7.6], [28, 7.6], [27, 15], [22, 15]]), R_('poly', 44, 7.6, 3, 5.6),
    R_('black', 58, 3, 4, 5.6), R_('led', 59, 8.6, 2, 1.2),
  ] },
  pod: { name: 'MISSILE POD', ppcm: 0.55, grip: [12, 16], parts: [
    R_('steel', 0, 0, 34, 14.5), R_('steelL', 0, 0, 34, 0.7), R_('black', 0, 7, 34, 0.5, 1),
    R_('red', 34, 1, 4, 5.4), R_('red', 34, 8, 4, 5.4), R_('steelD', 38, 2, 1.6, 3.4), R_('steelD', 38, 9, 1.6, 3.4),
    P_('poly', [[9, 14.5], [15, 14.5], [14, 23], [8, 23]]), R_('led', 26, 2, 4, 2),
  ] },
  pulse: { name: 'M41A PULSE RIFLE', ppcm: 0.62, grip: [19, 12], parts: [
    P_('steel', [[0, 3], [14, 0], [62, 0], [62, 10.5], [14, 10.5], [0, 8.5]]),
    R_('black', 3, 4.4, 9, 2.2, 1),
    R_('steelL', 14, 0, 48, 0.8),
    R_('steelD', 50, 1.8, 20, 6.8),
    R_('black', 53, 3.2, 2, 1.4, 1), R_('black', 57, 3.2, 2, 1.4, 1), R_('black', 61, 3.2, 2, 1.4, 1), R_('black', 65, 3.2, 2, 1.4, 1),
    R_('steel', 28, 10.5, 34, 5), R_('black', 28, 12.6, 34, 0.5, 1),
    R_('poly', 51, 10.5, 9, 6.8), R_('black', 52, 12, 7, 0.4, 1), R_('black', 52, 14, 7, 0.4, 1),
    P_('poly', [[17, 10.5], [24, 10.5], [22, 20], [15, 20]]),
    O_('steel', 23, 10.2, 6, 4.2, 0.8),
    R_('steelD', 29, 10.5, 5.5, 8), R_('steelL', 29, 17.6, 5.5, 0.8),
    R_('black', 39.4, 1.0, 5.2, 2.8), R_('led', 40, 1.4, 4, 2),
    R_('black', 70, 3.4, 0.8, 3.6, 1),
  ] },
};

function inPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function partHas(part, x, y) {
  if (part.k === 'rect') return x >= part.x && x < part.x + part.w && y >= part.y && y < part.y + part.h;
  if (part.k === 'ring') return x >= part.x && x < part.x + part.w && y >= part.y && y < part.y + part.h && !(x >= part.x + part.t && x < part.x + part.w - part.t && y >= part.y + part.t && y < part.y + part.h - part.t);
  return inPoly(x, y, part.pts);
}
function bounds(model) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const part of model.parts) {
    const pts = part.k === 'poly' ? part.pts : [[part.x, part.y], [part.x + part.w, part.y + part.h]];
    for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  }
  return { x0, y0, x1, y1 };
}
function rasterWeapon(model, sx, sy, details) {
  const box = bounds(model);
  const w = Math.ceil((box.x1 - box.x0) * sx) + 1, h = Math.ceil((box.y1 - box.y0) * sy) + 1;
  const idx = new Array(w * h).fill(-1);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const cx = box.x0 + (x + 0.5) / sx, cy = box.y0 + (y + 0.5) / sy;
    for (let i = model.parts.length - 1; i >= 0; i--) {
      const part = model.parts[i];
      if (part.d && !details) continue;
      if (partHas(part, cx, cy)) { idx[y * w + x] = i; break; }
    }
  }
  return { w: w, h: h, idx: idx, grip: [Math.round((model.grip[0] - box.x0) * sx), Math.round((model.grip[1] - box.y0) * sy)] };
}

const WEAPON_MATS = { steel: '#3d4048', steelD: '#2a2c32', steelL: '#5a5f69', poly: '#2b2b2f', wood: '#6e4529', brass: '#b8913a',
  black: '#0a0a0c', led: '#e04a2a', red: '#9a2a24', green: '#4f5a2c', blue: '#2b6fd0' };
function renderWeaponE(model, pxPerCm) {
  const raster = rasterWeapon(model, pxPerCm, pxPerCm, true);
  const { w, h, idx } = raster;
  const hx = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  const mixc = (from, to, k) => from.map((v, i) => Math.round(v + (to[i] - v) * k));
  const at = (x, y) => (x >= 0 && y >= 0 && x < w && y < h ? idx[y * w + x] : -1);
  const width = w + 2, height = h + 2, colors = new Array(width * height).fill(null);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = idx[y * w + x]; if (i < 0) continue;
    const part = model.parts[i], base = hx(WEAPON_MATS[part.m] || '#ff00ff');
    let col = base;
    if (at(x, y - 1) !== i) col = mixc(base, [255, 255, 255], part.m === 'wood' ? 0.18 : 0.32);
    else if (at(x, y + 1) !== i) col = mixc(base, [0, 0, 0], 0.4);
    else if (at(x + 1, y) !== i && at(x - 1, y) === i) col = mixc(base, [0, 0, 0], 0.2);
    colors[(y + 1) * width + x + 1] = col;
  }
  const out = colors.slice(), ink = [12, 12, 14];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (!colors[y * width + x]) {
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < width && ny < height && colors[ny * width + nx]) { out[y * width + x] = ink; break; } }
  }
  return { w: width, h: height, c: out, grip: [raster.grip[0] + 1, raster.grip[1] + 1] };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { WEAPON_MODELS, rasterWeapon, renderWeaponE, WEAPON_MATS };
