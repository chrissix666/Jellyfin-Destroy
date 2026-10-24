const SWEEP_Q = [];
function sweepTear(block, delay, dx, dy, force) {
  if (!block || !block.alive || block.kind !== 'word' || block.swept) return;
  block.swept = 1;
  SWEEP_Q.push({ b: block, t: delay, dx, dy, f: force });
}
function sweepWordsIn(x, y, w, h, fn) {
  queryRect(x, y, w, h, (o) => { if (o.kind === 'word' && o.alive && !o.swept) fn(o); });
}
function sweepEllipsis(el) {
  try {
    for (let e = el.parentElement, k = 0; e && k < 4; e = e.parentElement, k++) {
      if (e.ownerDocument.defaultView.getComputedStyle(e).textOverflow === 'ellipsis') { e.style.textOverflow = 'clip'; return; }
    }
  } catch (e) { }
}
function sweepDestroyed(block) {
  try {
    if (block.kind === 'word') { sweepEllipsis(block.el); return; }
    const card = block.el.closest && block.el.closest('.card');
    if (!card || !card.querySelector('.cardScalable') || !(block.el.closest('.cardScalable'))) return;
    if (!breakSource(block, block.el.ownerDocument.defaultView.getComputedStyle(block.el)).src) return;
    const imp = IMP;
    for (const el of card.querySelectorAll('*')) {
      const word = el.__bi !== undefined ? S.blocks[el.__bi] : null;
      if (!word || !word.alive || word.kind !== 'word' || word.el !== el) continue;
      let dx = rand(-0.35, 0.35), dy = 1, force = rand(120, 260);
      if (imp && imp.x !== undefined) { const ax = word.x + word.w / 2 - imp.x, ay = word.y + word.h / 2 - imp.y, dist = Math.hypot(ax, ay) || 1; dx = ax / dist; dy = ay / dist; force = imp.f * 0.8; }
      else if (imp) { dx = imp.dx; dy = imp.dy; force = imp.f * 0.6; }
      sweepTear(word, rand(0.06, 0.4), dx, dy, force);
    }
    diagCount('sweep.card');
  } catch (e) { }
}
function sweepBlast(x, y, radius) {
  const reach = radius * 1.6;
  let n = 0;
  sweepWordsIn(x - reach, y - reach, reach * 2, reach * 2, (word) => {
    const cx = word.x + word.w / 2, cy = word.y + word.h / 2, dist = Math.hypot(cx - x, cy - y);
    if (dist > reach) return;
    const k = 1 - dist / reach;
    sweepTear(word, dist / 1400, (cx - x) / (dist || 1), (cy - y) / (dist || 1), 180 + 620 * k);
    n++;
  });
  if (n) diagCount('sweep.blast', n);
}
function sweepHit(hx, hy, vx, vy) {
  const reach = 22, sp = Math.hypot(vx || 0, vy || 0) || 1;
  sweepWordsIn(hx - reach, hy - reach, reach * 2, reach * 2, (word) => {
    const cx = word.x + word.w / 2, cy = word.y + word.h / 2;
    if (Math.hypot(cx - hx, cy - hy) > reach || Math.random() > 0.75) return;
    sweepTear(word, rand(0, 0.08), (vx || 0) / sp * 0.6 + (cx - hx) / reach * 0.4, (vy || 0) / sp * 0.6 - 0.3, rand(140, 320));
    diagCount('sweep.hit');
  });
}
function sweepFlame(x, y) {
  const reach = 16;
  sweepWordsIn(x - reach, y - reach, reach * 2, reach * 2, (word) => {
    if (word.wburn) return;
    word.wburn = rand(0.45, 0.9);
    try { word.el.style.color = '#1a120c'; word.el.style.textShadow = '0 0 3px #ff7a1a, 0 0 1px #ffb060'; } catch (e) { }
    diagCount('sweep.burn');
  });
}
function sweepSlab(slab) {
  if (slab.hinge || slab.burnout || (slab.age || 0) < 0.05) return;
  const speed = Math.hypot(slab.vx || 0, slab.vy || 0);
  if (speed < 140) return;
  if ((S.frame || 0) % 2) return;
  const radius = Math.max(slab.w, slab.h) * 0.5;
  sweepWordsIn(slab.x - radius, slab.y - radius, radius * 2, radius * 2, (o) => sweepTear(o, 0, slab.vx / speed, slab.vy / speed, Math.min(700, speed * 0.9)));
}
function sweepUpdate(dt) {
  S.frame = (S.frame || 0) + 1;
  if (S.frame % 3 === 0) for (const block of S.blocks) {
    if (!block.wburn || !block.alive) continue;
    block.wburn -= dt * 3;
    if (Math.random() < 0.3) fxEmber(block.x + Math.random() * block.w, block.y + block.h * 0.5, rand(-10, 10), -rand(10, 40), rand(0.4, 0.9));
    if (block.wburn <= 0) {
      for (let k = 0; k < 3; k++) fxAsh(block.x + Math.random() * block.w, block.y + Math.random() * block.h, rand(-20, 20), rand(-30, 10), Math.random() < 0.5);
      sweepTear(block, 0, rand(-0.2, 0.2), 0.4, 60);
    }
  }
  for (let i = SWEEP_Q.length - 1; i >= 0; i--) {
    const tear = SWEEP_Q[i];
    if ((tear.t -= dt) > 0) continue;
    SWEEP_Q.splice(i, 1);
    if (!tear.b.alive) continue;
    const keep = IMP;
    IMP = { dx: tear.dx, dy: tear.dy, f: tear.f };
    destroyBlock(tear.b, false, false);
    IMP = keep;
  }
}
function railTrench(x1, y1, x2, y2) {
  const ax = x1 / PX, ay = y1 / PX, bx = x2 / PX, by = y2 / PX;
  const firstBand = Math.floor(Math.min(ay, by) / BAND_H), lastBand = Math.floor(Math.max(ay, by) / BAND_H);
  const len = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / (len || 1), ny = (bx - ax) / (len || 1);
  const pts = [];
  for (let dist = 0; dist <= len; dist += 6) { const t = dist / (len || 1), j = rand(-0.6, 0.6); pts.push([ax + (bx - ax) * t + nx * j, ay + (by - ay) * t + ny * j]); }
  for (let bi = firstBand; bi <= lastBand; bi++) {
    const layer = bdLayer(bi * BAND_H); if (!layer) continue;
    const ctx = layer.dctx, oy = bi * BAND_H;
    const line = (w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] - oy) : ctx.moveTo(p[0], p[1] - oy))); ctx.stroke(); };
    line(7, 'rgba(24,16,12,0.30)');
    line(3.6, 'rgba(8,6,6,0.80)');
    line(1.4, 'rgba(0,0,0,0.92)');
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    for (let k = 0; k < pts.length; k += 2) { const point = pts[k]; ctx.fillRect(Math.round(point[0] - nx * 2.4), Math.round(point[1] - ny * 2.4 - oy), 1, 1); }
  }
  for (let k = 0; k < Math.min(40, len / 12); k++) { const t = Math.random(); const e = fxEmber(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 0, 0, rand(0.8, 2.2)); e.st = 1; e.sz = rand(1, 2); }
}
