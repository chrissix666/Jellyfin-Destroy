let padMode = false;
const GPK_FILL = '#2a2a2e', GPK_EDGE = '#9aa0aa', GPK_TEXT = '#f2f2f2';
function gpSvgButton(letter, color) {
  return '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="' + color + '" stroke="#00000055" stroke-width="1"/><text x="8" y="11.5" font-size="9" font-family="Arial,sans-serif" font-weight="bold" text-anchor="middle" fill="#fff">' + letter + '</text></svg>';
}
function gpSvgShoulder(label) {
  const t = label[1] === 'T';
  return '<svg width="22" height="16" viewBox="0 0 22 16"><path d="' + (t ? 'M3 15 H19 V6 C19 3 16 1 11 1 C6 1 3 3 3 6 Z' : 'M1.5 14.5 H20.5 V7 C20.5 5 19 3.5 17 3.5 H5 C3 3.5 1.5 5 1.5 7 Z') +
    '" fill="' + GPK_FILL + '" stroke="' + GPK_EDGE + '" stroke-width="1"/><text x="11" y="' + (t ? 12 : 12.3) + '" font-size="7" font-family="Arial,sans-serif" font-weight="bold" text-anchor="middle" fill="' + GPK_TEXT + '">' + label + '</text></svg>';
}
function gpSvgStick(letter) {
  return '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="' + GPK_FILL + '" stroke="' + GPK_EDGE + '" stroke-width="1"/><circle cx="8" cy="8" r="3.4" fill="' + GPK_EDGE + '"/>' +
    (letter ? '<text x="8" y="10.4" font-size="5" font-family="Arial,sans-serif" font-weight="bold" text-anchor="middle" fill="' + GPK_FILL + '">' + letter + '</text>' : '') + '</svg>';
}
function gpSvgDpad(dir) {
  const on = GPK_EDGE, off = '#4a4a52';
  const arm = (side) => (dir === side || (dir === 'lr' && (side === 'l' || side === 'r')) ? on : off);
  return '<svg width="16" height="16" viewBox="0 0 16 16"><rect x="6" y="1" width="4" height="6" rx="1" fill="' + arm('u') + '"/><rect x="6" y="9" width="4" height="6" rx="1" fill="' + arm('d') + '"/>' +
    '<rect x="1" y="6" width="6" height="4" rx="1" fill="' + arm('l') + '"/><rect x="9" y="6" width="6" height="4" rx="1" fill="' + arm('r') + '"/><rect x="6" y="6" width="4" height="4" fill="' + off + '"/></svg>';
}
const GP_GLYPH = {
  A: gpSvgButton('A', '#3fae4c'), B: gpSvgButton('B', '#d9433c'), X: gpSvgButton('X', '#2d6fc4'), Y: gpSvgButton('Y', '#d8a84e'),
  LB: gpSvgShoulder('LB'), RB: gpSvgShoulder('RB'), LT: gpSvgShoulder('LT'), RT: gpSvgShoulder('RT'),
  L: gpSvgStick('L'), R: gpSvgStick('R'), R3: gpSvgStick('R3'),
  '▲': gpSvgDpad('u'), '▼': gpSvgDpad('d'), '◀': gpSvgDpad('l'), '▶': gpSvgDpad('r'),
  VIEW: '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="' + GPK_FILL + '" stroke="' + GPK_EDGE + '" stroke-width="1"/><rect x="4.5" y="4.5" width="5" height="5" rx="0.8" fill="none" stroke="' + GPK_TEXT + '" stroke-width="1.2"/><rect x="7" y="7" width="5" height="5" rx="0.8" fill="' + GPK_FILL + '" stroke="' + GPK_TEXT + '" stroke-width="1.2"/></svg>',
  MENU: '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="' + GPK_FILL + '" stroke="' + GPK_EDGE + '" stroke-width="1"/><rect x="4" y="5" width="8" height="1.4" rx="0.7" fill="' + GPK_TEXT + '"/><rect x="4" y="7.3" width="8" height="1.4" rx="0.7" fill="' + GPK_TEXT + '"/><rect x="4" y="9.6" width="8" height="1.4" rx="0.7" fill="' + GPK_TEXT + '"/></svg>',
};
const gpGlyphImg = new Map();
function gpGlyphCanvas(svg) {
  const w = parseFloat(/width="([\d.]+)"/.exec(svg)[1]), h = parseFloat(/height="([\d.]+)"/.exec(svg)[1]);
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(w * dpr); canvas.height = Math.ceil(h * dpr);
  canvas.className = 'gpk'; canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  let img = gpGlyphImg.get(svg);
  if (!img) { img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')); gpGlyphImg.set(svg, img); }
  const draw = () => { const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); ctx.drawImage(img, 0, 0, w, h); };
  if (img.complete && img.naturalWidth) draw(); else img.addEventListener('load', draw, { once: true });
  return canvas;
}
function padHintGlyphs() {
  const box = $('#hints');
  if (!box || box.dataset.glyphs) return;
  box.dataset.glyphs = '1';
  box.querySelectorAll('.gp kbd').forEach((k) => {
    const svg = GP_GLYPH[k.textContent.trim()];
    if (svg) k.replaceWith(gpGlyphCanvas(svg));
  });
}
function setPadMode(on) { const was = padMode; padMode = !!on && padAllowed(); if (was !== padMode) { diagCount('input.' + (padMode ? 'pad' : 'kbm')); diag('input', 'device', 'debug', { pad: padMode }); } }
window.addEventListener('mousemove', (e) => { if (padMode && e.isTrusted && (Math.abs(e.movementX) + Math.abs(e.movementY) > 2)) setPadMode(false); }, true);
window.addEventListener('mousedown', (e) => { if (e.isTrusted) setPadMode(false); }, true);
window.addEventListener('keydown', (e) => { if (e.isTrusted) setPadMode(false); }, true);
