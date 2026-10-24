const WF_MAX = 1.6;
function wfBand(bi) {
  const layer = band(bi);
  if (!layer.wf) {
    const n = S.artW * BAND_H;
    layer.wf = { d: new Float32Array(n), s: new Float32Array(n) };
    layer.wall = document.createElement('canvas'); layer.wall.width = S.artW; layer.wall.height = BAND_H; layer.wctx = layer.wall.getContext('2d');
  }
  return layer;
}
function wfDig(wx, wy, radius, power, soot) {
  const cx = wx / PX, cy = wy / PX, pixRadius = radius / PX, spokes = 14, jitter = [];
  for (let i = 0; i < spokes; i++) jitter.push(rand(0.72, 1.12));
  const ext = pixRadius * 1.9, y0 = Math.floor(cy - ext), y1 = Math.ceil(cy + ext), x0 = Math.max(0, Math.floor(cx - ext)), x1 = Math.min(S.artW - 1, Math.ceil(cx + ext));
  let here = 0; { const bi = Math.floor(cy / BAND_H); if (bi >= 0 && bi < S.nb) { const layer = wfBand(bi), iy = Math.round(cy) - bi * BAND_H, ix = Math.round(cx); if (ix >= 0 && ix < S.artW && iy >= 0 && iy < BAND_H) here = layer.wf.d[iy * S.artW + ix]; } }
  const grow = 1 + Math.min(1, here) * 0.55;
  for (let y = y0; y <= y1; y++) {
    if (y < 0 || y >= S.nb * BAND_H) continue;
    const bi = Math.floor(y / BAND_H), layer = wfBand(bi), row = (y - bi * BAND_H) * S.artW;
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx, dy = y - cy, dist = Math.hypot(dx, dy);
      const slot = (Math.atan2(dy, dx) + Math.PI) / TAU * spokes, spoke = Math.floor(slot) % spokes, blend = slot - Math.floor(slot);
      const rad = pixRadius * grow * (jitter[spoke] * (1 - blend) + jitter[(spoke + 1) % spokes] * blend);
      const ratio = dist / rad, k = row + x;
      if (ratio < 1) {
        const add = power * Math.pow(1 - ratio * ratio, 0.75);
        const cur = layer.wf.d[k];
        layer.wf.d[k] = Math.min(WF_MAX, cur > 0.04 ? cur + add * 0.65 : Math.max(cur, add));
      }
      if (soot && ratio < 1.8) layer.wf.s[k] = Math.min(0.75, layer.wf.s[k] + soot * (1 - ratio / 1.8));
    }
  }
  wfRender(x0 - 2, y0 - 2, x1 + 2, y1 + 2);
}
function wfSoot(wx, wy, radius, amount) { wfDig(wx, wy, radius * 0.5, 0, amount); }
function wfRender(x0, y0, x1, y1) {
  x0 = Math.max(0, x0); x1 = Math.min(S.artW - 1, x1);
  const pic = !!(shell.backdrop && shell.backdrop()), stride = S.artW;
  for (let bi = Math.max(0, Math.floor(y0 / BAND_H)); bi <= Math.min(S.nb - 1, Math.floor(y1 / BAND_H)); bi++) {
    const layer = wfBand(bi), depthMap = layer.wf.d, sootMap = layer.wf.s;
    const ya = Math.max(0, y0 - bi * BAND_H), yb = Math.min(BAND_H - 1, y1 - bi * BAND_H);
    if (yb < ya) continue;
    const w = x1 - x0 + 1, h = yb - ya + 1, img = layer.wctx.createImageData(w, h), pixels = img.data;
    const at = (x, y) => (x < 0 || x >= stride || y < 0 || y >= BAND_H ? 0 : depthMap[y * stride + x]);
    for (let yy = 0; yy < h; yy++) {
      const y = ya + yy;
      for (let xx = 0; xx < w; xx++) {
        const x = x0 + xx, k = y * stride + x, depth = depthMap[k], soot = sootMap[k], j = (yy * w + xx) * 4;
        let red = 0, green = 0, blue = 0, alpha = 0;
        if (depth > 0.04) {
          if (depth < 0.2) { const t = (depth - 0.04) / 0.16; red = green = blue = pic ? 255 : 150; alpha = 0.08 + 0.08 * t; }
          else if (depth < 0.55) { const t = (depth - 0.2) / 0.35; red = green = blue = 12; alpha = 0.42 + 0.35 * t; }
          else { const t = Math.min(1, (depth - 0.55) / 0.6); red = green = blue = 0; alpha = 0.78 + 0.2 * t; }
          if (depth >= 0.2) {
            const slope = at(x + 1, y + 1) - at(x - 1, y - 1);
            if (slope > 0.05) alpha = Math.min(1, alpha + Math.min(0.2, slope * 0.6));
            else if (slope < -0.05 && depth < 0.5) { red = green = blue = pic ? 200 : 120; alpha = Math.max(alpha * 0.6, 0.18); }
          }
        }
        if (soot > 0.01) { const sa = soot * 0.55; red = red * alpha / (alpha + sa + 1e-6); green = green * alpha / (alpha + sa + 1e-6); blue = blue * alpha / (alpha + sa + 1e-6); alpha = alpha + sa * (1 - alpha); }
        pixels[j] = red; pixels[j + 1] = green; pixels[j + 2] = blue; pixels[j + 3] = Math.round(Math.min(1, alpha) * 255);
      }
    }
    layer.wctx.putImageData(img, x0, ya);
  }
}
