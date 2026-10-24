const SLAB_MAX = 48;
const REMNANT_MAX = 80;

function samePicBox(block, other) {
  const area = block.w * block.h, otherArea = other.w * other.h;
  return otherArea >= area * 0.45 && otherArea <= area * 1.8 && Math.abs((other.x + other.w / 2) - (block.x + block.w / 2)) < block.w * 0.35 &&
    Math.abs((other.y + other.h / 2) - (block.y + block.h / 2)) < block.h * 0.35;
}
function opaqueAt(block, wx, wy) {
  try {
    if (block.kind === 'word') return true;
    if (block.am === undefined) {
      block.am = null;
      const cs = block.el.ownerDocument.defaultView.getComputedStyle(block.el), pic = breakSource(block, cs);
      if (pic.src && alphaOf(cs.backgroundColor) < 0.1) {
        const boxW = Math.max(1, Math.min(96, Math.round(block.w / 4))), boxH = Math.max(1, Math.min(96, Math.round(block.h / 4)));
        const canvas = document.createElement('canvas'); canvas.width = boxW; canvas.height = boxH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(pic.src, 0, 0, pic.SW, pic.SH, 0, 0, boxW, boxH);
        block.am = { W: boxW, H: boxH, d: ctx.getImageData(0, 0, boxW, boxH).data };
      }
    }
    if (!block.am) return true;
    const x = Math.floor((wx - block.x) / block.w * block.am.W), y = Math.floor((wy - block.y) / block.h * block.am.H);
    if (x < 0 || y < 0 || x >= block.am.W || y >= block.am.H) return true;
    return block.am.d[(y * block.am.W + x) * 4 + 3] > 24;
  } catch (e) { block.am = null; return true; }
}
function breakSource(block, cs) {
  const el = block.el, tag = el.tagName.toUpperCase();
  let src = null, SW = 0, SH = 0;
  const placeholder = !!(el.classList && el.classList.contains('blurhash-canvas'));
  if (placeholder) return { src: null, SW: 0, SH: 0, fill: null, edge: null, rad: 0, placeholder: true };
  if (tag === 'IMG' && el.complete && el.naturalWidth) { src = el; SW = el.naturalWidth; SH = el.naturalHeight; }
  else if (tag === 'CANVAS' && el.width && !placeholder) { src = el; SW = el.width; SH = el.height; }
  else if (tag === 'VIDEO' && el.videoWidth) { src = el; SW = el.videoWidth; SH = el.videoHeight; }
  if (!src && shell.bgSource) { const bg = shell.bgSource(el, cs, block.w, block.h); if (bg) { src = bg; SW = bg.width; SH = bg.height; } }
  let fill = null;
  if (alphaOf(cs.backgroundColor) >= 0.1) fill = cs.backgroundColor;
  else if (cs.backgroundImage && cs.backgroundImage !== 'none') {
    const cols = (cs.backgroundImage.match(/rgba?\([^)]*\)/g) || []).filter((c) => alphaOf(c) >= 0.1);
    if (cols.length) fill = cols[0];
  }
  const edge = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none' && alphaOf(cs.borderTopColor) > 0.1 ? cs.borderTopColor : null;
  const rr = String(cs.borderTopLeftRadius || '0'), rad = /%$/.test(rr) ? Math.min(block.w, block.h) * parseFloat(rr) / 100 : parseFloat(rr) || 0;
  return { src, SW, SH, fill: fill || edge || (block.kind === 'media' ? '#8a8ca0' : '#c8c8d0'), edge, rad: Math.min(rad, Math.min(block.w, block.h) / 2) };
}

function clipHalf(poly, origin, n) {
  const out = [], side = (p) => n[0] * (p[0] - origin[0]) + n[1] * (p[1] - origin[1]);
  for (let i = 0; i < poly.length; i++) {
    const from = poly[i], to = poly[(i + 1) % poly.length], sa = side(from), sb = side(to);
    if (sa >= 0) out.push(from);
    if ((sa >= 0) !== (sb >= 0)) { const t = sa / (sa - sb); out.push([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]); }
  }
  return out;
}
function centroid(poly) {
  let x = 0, y = 0;
  for (const point of poly) { x += point[0]; y += point[1]; }
  return [x / poly.length, y / poly.length];
}

const bfWhy = (k) => { if (!S.breakStats) S.breakStats = {}; S.breakStats[k] = (S.breakStats[k] || 0) + 1; return false; };
function breakFancy(block, cs) {
  if (!S.slabs) S.slabs = [];
  if (block.kind === 'word') return false;
  const twins = [];
  for (const other of S.blocks) {
    if (other === block || !other.alive || other.kind === 'word') continue;
    if (Math.abs(other.x - block.x) < 8 && Math.abs(other.y - block.y) < 8 && Math.abs(other.w - block.w) < Math.max(8, block.w * 0.12) && Math.abs(other.h - block.h) < Math.max(8, block.h * 0.12)) twins.push(other);
  }
  let twinPic = null;
  for (const other of twins) { if (twinPic) break; try { const tp = breakSource(other, other.el.ownerDocument.defaultView.getComputedStyle(other.el)); if (tp.src) twinPic = tp; } catch (e) { } }
  for (const other of twins) destroyBlock(other, false, true);
  const area = block.w * block.h;
  const hit = HIT || {}, blast = IMP && IMP.x !== undefined;
  let pic = breakSource(block, cs);
  if (!pic.src && twinPic) pic = twinPic;
  if (!pic.src) {
    queryRect(block.x, block.y, block.w, block.h, (other) => {
      if (pic.src || other === block || other.kind === 'word' || !samePicBox(block, other)) return;
      let ocs = null; try { ocs = other.el.ownerDocument.defaultView.getComputedStyle(other.el); } catch (e) { return; }
      const op = breakSource(other, ocs);
      if (op.src) { pic = op; if (other.alive) destroyBlock(other, false, true); }
    });
  }
  if (!pic.src && block.el && block.el.closest) {
    try {
      const card = block.el.closest('.cardBox, .cardScalable, .card'), im = card && (card.querySelector('img') || card.querySelector('div.cardImageContainer'));
      if (im && im !== block.el) {
        const op = breakSource({ el: im, w: block.w, h: block.h, kind: 'media' }, im.ownerDocument.defaultView.getComputedStyle(im));
        if (op.src) {
          pic = op;
          const ib = im.__bi !== undefined ? S.blocks[im.__bi] : null;
          if (ib && ib.alive && ib.el === im) destroyBlock(ib, false, true);
        }
      }
    } catch (e) { }
  }
  block.pic = pic.src ? pic : null;
  if (S.slabs.length >= SLAB_MAX) return bfWhy('-full');
  if (area < 1400 || area > 180000 || block.w < 24 || block.h < 18) return bfWhy('-size');
  const isPic = !!pic.src;
  if (!isPic && (block.kind === 'media' || materialOf(block) === 'paper'))
    diagAnomaly('break', 'noPicture', diagEl(block.el), { el: diagEl(block.el, block), bg: String(cs.backgroundImage || '').slice(0, 80), tag: block.el.tagName,
      card: !!(block.el.closest && block.el.closest('.cardScalable')), lazy: !!(block.el.classList && block.el.classList.contains('lazy')), blur: !!(block.el.querySelector && block.el.querySelector('canvas')) }, true);
  const TABLE = hit.type === 'melee' ? (isPic ? [['split', 0.4], ['chunk', 0.35], ['tear', 0.12]] : [['split', 0.6], ['chunk', 0.25]])
    : blast ? (isPic ? [['chunk', 0.2], ['tear', 0.18], ['drop', 0.16], ['split', 0.14], ['hinge', 0.1], ['crumble', 0.08]] : [['split', 0.2], ['drop', 0.2], ['crumble', 0.15], ['chunk', 0.2]])
    : isPic ? [['hinge', 0.18], ['chunk', 0.22], ['tear', 0.12], ['mirror', 0.1], ['drop', 0.1], ['split', 0.1], ['tip', 0.06], ['crumble', 0.04]]
    : block.kind === 'box' ? [['mirror', 0.08], ['hinge', 0.12], ['drop', 0.14], ['chunk', 0.2], ['split', 0.14], ['tip', 0.08], ['crumble', 0.08]]
    : block.kind === 'ctrl' ? [['split', 0.2], ['drop', 0.2], ['chunk', 0.2], ['tip', 0.12], ['hinge', 0.1]] : [];
  if (!S.breakRecent) S.breakRecent = [];
  const weights = TABLE.map(([choice, chance]) => [choice, chance * (S.breakRecent.includes(choice) ? 0.3 : 1)]);
  const keep = 1 - TABLE.reduce((s, x) => s + x[1], 0);
  const sumW = weights.reduce((s, x) => s + x[1], 0) + Math.max(0, keep);
  let mode = null, acc = 0; const roll = Math.random() * sumW;
  for (const [choice, chance] of weights) { acc += chance; if (roll < acc) { mode = choice; break; } }
  if (block.forceMode && isPic) mode = block.forceMode;
  if (isPic && (block.burn > 0 || (block.fz && block.fz.length) || hit.type === 'flame') && Math.random() < 0.22 && burnouts() < 3) mode = 'burnout';
  if (!mode) return bfWhy('-shatter');
  S.breakRecent.push(mode); if (S.breakRecent.length > 3) S.breakRecent.shift();
  if (!S.breakStats) S.breakStats = {};
  S.breakStats[mode] = (S.breakStats[mode] || 0) + 1;
  if (!pic.src && area > 15000) {
    bfWhy('-board');
    for (let i = 0; i < 6; i++) fxDust(block.x + rand(0, block.w), block.y + rand(0.3, 1) * block.h, rand(-60, 60), rand(-40, 10), rand(6, 12), rand(0.5, 1));
    return true;
  }
  const width = block.w, height = block.h, cx = block.x + width / 2, cy = block.y + height / 2;
  const rect = [[-width / 2, -height / 2], [width / 2, -height / 2], [width / 2, height / 2], [-width / 2, height / 2]];
  const base = { src: pic.src, SW: pic.SW, SH: pic.SH, fill: pic.fill, edge: pic.edge, rad: pic.rad, fire: block.dropFire || 0, w: width, h: height, age: 0, ob: { x: block.x, y: block.y, w: block.w, h: block.h }, mode };
  const side = IMP && IMP.dx ? Math.sign(IMP.dx) : hit.vx ? Math.sign(hit.vx) : Math.random() < 0.5 ? -1 : 1;
  const pop = () => {};
  if (mode === 'tear') { paperTear(block, base, cx, cy, width, height); pop(); return true; }
  if (mode === 'burnout') {
    const zone = block.fz && block.fz[0], ix = zone ? zone.ox / width : rand(0.2, 0.8), iy = zone ? zone.oy / height : rand(0.7, 1);
    S.slabs.push(Object.assign(base, { x: cx, y: cy, ox: -width / 2, oy: -height / 2, poly: rect, vx: 0, vy: 0, rot: 0, vr: 0, hang: 0, burnout: (block.burnPre && block.burnPre.w0 === width && block.burnPre.h0 === height) ? block.burnPre : burnGrid(width, height, ix, iy) }));
    block.burnPre = null;
    if (block.burnStop) S.slabs[S.slabs.length - 1].burnout.stopAt = block.burnStop;
    return true;
  }
  if (mode === 'drop' || mode === 'crumble') {
    S.slabs.push(Object.assign(base, { x: cx, y: cy, ox: -width / 2, oy: -height / 2, poly: rect, vx: side * rand(10, 60) + (blast ? side * rand(80, 220) : 0), vy: blast ? -rand(80, 200) : -10,
      rot: 0, vr: rand(-0.8, 0.8), hang: blast ? 0 : rand(0.15, 0.45), wob: true, bounce: Math.random() < 0.4 ? 1 : 0, crumble: mode === 'crumble' ? 0.08 : 0 }));
    pop(); return true;
  }
  if (mode === 'hinge' || mode === 'tip') {
    const pxl = -side * width / 2, pyl = mode === 'hinge' ? -height / 2 : height / 2;
    S.slabs.push(Object.assign(base, { x: cx, y: cy, ox: -width / 2, oy: -height / 2, poly: rect, vx: 0, vy: 0, rot: 0, vr: mode === 'tip' ? side * rand(0.4, 0.9) : side * rand(0.2, 0.8), hang: 0,
      hinge: { px: cx + pxl, py: cy + pyl, dx: -pxl, dy: -pyl, I: (width * width + height * height) / 3, t: mode === 'hinge' ? rand(2, 7) : 9, tip: mode === 'tip' },
      bounce: Math.random() < 0.3 ? 1 : 0 }));
    pop(); return true;
  }
  if (mode === 'chunk') {
    const hx = (hit.x !== undefined ? hit.x : cx + side * width / 3) - cx, hy = (hit.y !== undefined ? hit.y : cy + rand(-height / 3, height / 3)) - cy;
    let nx = hx, ny = hy; const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
    const ang = Math.atan2(ny, nx) + rand(-0.5, 0.5); nx = Math.cos(ang); ny = Math.sin(ang);
    const depth = rand(0.2, 0.45), reach = Math.abs(nx * width) / 2 + Math.abs(ny * height) / 2, origin = [nx * reach * (1 - 2 * depth), ny * reach * (1 - 2 * depth)];
    const piece = clipHalf(rect, origin, [nx, ny]), rest = clipHalf(rect, origin, [-nx, -ny]);
    if (piece.length < 3 || rest.length < 3) return false;
    const center = centroid(piece);
    S.slabs.push(Object.assign({}, base, { x: cx + center[0], y: cy + center[1], ox: -width / 2 - center[0], oy: -height / 2 - center[1], poly: piece.map((q) => [q[0] - center[0], q[1] - center[1]]),
      vx: nx * rand(80, 200) + side * 30, vy: ny * rand(60, 140) - rand(40, 120), rot: 0, vr: Math.sign(nx || 1) * rand(1, 4), hang: 0, bounce: Math.random() < 0.3 ? 1 : 0 }));
    if (!S.remnants) S.remnants = [];
    if (S.remnants.length >= REMNANT_MAX) S.remnants.shift();
    S.remnants.push(Object.assign({}, base, { x: cx, y: cy, ox: -width / 2, oy: -height / 2, poly: rest, rot: 0, vx: 0, vy: 0 }));
    pop(); return true;
  }
  if (mode === 'mirror') {
    S.slabs.push(Object.assign(base, { x: cx, y: cy, ox: -width / 2, oy: -height / 2, poly: rect, vx: IMP ? IMP.dx * 40 || 0 : 0, vy: -30, rot: 0, vr: rand(-0.5, 0.5), hang: 0.16, glass: true }));
    return true;
  }
  let ang = hit.type === 'melee' ? (hit.ang || 0) + Math.PI / 2 + rand(-0.4, 0.4)
    : hit.vx !== undefined ? Math.atan2(hit.vy, hit.vx) + rand(-0.25, 0.25) : rand(0, Math.PI);
  const px = clamp((hit.x !== undefined ? hit.x : cx + rand(-width / 4, width / 4)) - cx, -width / 3, width / 3);
  const py = clamp((hit.y !== undefined ? hit.y : cy + rand(-height / 4, height / 4)) - cy, -height / 3, height / 3);
  const n = [-Math.sin(ang), Math.cos(ang)];
  for (const sgn of [1, -1]) {
    const poly = clipHalf(rect, [px, py], [n[0] * sgn, n[1] * sgn]);
    if (poly.length < 3) continue;
    const center = centroid(poly), push = (hit.type === 'melee' ? rand(160, 260) : rand(90, 180)) * sgn;
    S.slabs.push(Object.assign({}, base, {
      x: cx + center[0], y: cy + center[1], ox: -width / 2 - center[0], oy: -height / 2 - center[1], poly: poly.map((p) => [p[0] - center[0], p[1] - center[1]]),
      vx: n[0] * push + (IMP && IMP.dx ? IMP.dx * 60 : 0), vy: n[1] * push - rand(60, 160), rot: 0, vr: sgn * rand(1.5, 4.5), hang: 0, glass: false,
      cut: hit.wn === 'LIGHTSABER',
    }));
  }
  if (hit.wn === 'LIGHTSABER') smoulderAt(cx + px, cy + py, Math.min(width, 40), 1.5);
  return true;
}

const idleDo = window.requestIdleCallback ? (f) => requestIdleCallback(f, { timeout: 400 }) : (f) => setTimeout(() => f({ timeRemaining: () => 6, didTimeout: true }), 16);
function prewarmStart() {
  const job = S.prewarm = { list: [], i: 0, done: 0, t0: performance.now() };
  try { if (!FXC.spr) fxBake(); } catch (e) { }
  const vy = S.view ? S.view.y + S.VH / 2 : 0;
  job.list = S.blocks.filter((block) => block.alive && block.kind !== 'word' && block.w * block.h >= 600)
    .sort((a, b) => Math.abs(a.y + a.h / 2 - vy) - Math.abs(b.y + b.h / 2 - vy)).slice(0, 400);
  const game = S;
  const step = (dl) => {
    if (S !== game || S.prewarm !== job) return;
    let n = 0;
    while (job.i < job.list.length && (dl.timeRemaining() > 3 || (dl.didTimeout && n < 2))) {
      const block = job.list[job.i++]; n++;
      if (!block.alive) continue;
      try {
        const pic = breakSource(block, block.el.ownerDocument.defaultView.getComputedStyle(block.el));
        if (pic.src && !pic.src.__pending) { opaqueAt(block, block.x, block.y); job.done++; }
      } catch (e) { }
    }
    if (job.i < job.list.length) idleDo(step);
    else diag('perf', 'prewarm', 'info', { pictures: job.done, blocks: job.list.length, ms: Math.round(performance.now() - job.t0) });
  };
  idleDo(step);
}
function burnPrebuild(block) {
  idleDo(() => {
    if (!S || !block.alive || block.burnPre) return;
    const zone = block.fz && block.fz[0];
    block.burnPre = burnGrid(block.w, block.h, zone ? zone.ox / block.w : rand(0.2, 0.8), zone ? zone.oy / block.h : rand(0.7, 1));
    block.burnPre.w0 = block.w; block.burnPre.h0 = block.h;
  });
}
function updateSlabs(dt) {
  if (!S.prewarm) prewarmStart();
  cardStackTick();
  if (S.stuck) for (let i = S.stuck.length - 1; i >= 0; i--) {
    const k = S.stuck[i]; k.life -= dt;
    if (k.life <= 0 || (k.b && !k.b.alive)) {
      if (k.b && !k.b.alive) addDebris({ x: k.x, y: k.y, w: 6, h: 2, vx: rand(-40, 40), vy: rand(-80, 0), rot: k.ang, vr: rand(-6, 6), src: null, fill: '#c9ced8', edge: null, rest: false, check: 0.3, cells: null });
      S.stuck.splice(i, 1);
    }
  }
  if (!S.slabs || !S.slabs.length) return;
  for (let i = S.slabs.length - 1; i >= 0; i--) {
    const slab = S.slabs[i];
    slab.age += dt;
    if (slab.burnout) { if (burnTick(slab, dt)) S.slabs.splice(i, 1); continue; }
    sweepSlab(slab);
    if (slab.fire > 0) {
      slab.fire -= dt;
      const radius = Math.max(slab.w, slab.h) * 0.4, n = dt * 22 * fxK();
      for (let k = 0; k < n; k++) fxFire(slab.x + rand(-radius, radius) * 0.6, slab.y + rand(-radius, radius) * 0.6, rand(-10, 10) - (slab.vx || 0) * 0.2, -rand(20, 60) - (slab.vy || 0) * 0.1, rand(3, 7), rand(0.25, 0.55), true);
      if (Math.random() < dt * 8) fxEmber(slab.x + rand(-radius, radius), slab.y + rand(-radius, radius), rand(-30, 30), -rand(20, 60), rand(0.6, 1.4));
      if (Math.random() < dt * 3) fxSmoke(slab.x, slab.y, rand(-8, 8), -rand(15, 30), rand(4, 7), rand(1.5, 3), true, 'fall');
    }
    if (slab.hinge) {
      const pivot = slab.hinge, cosr = Math.cos(slab.rot), sinr = Math.sin(slab.rot), rx = pivot.dx * cosr - pivot.dy * sinr, ry = pivot.dx * sinr + pivot.dy * cosr;
      slab.vr += (GRAV * rx / pivot.I) * dt;
      if (!pivot.tip) slab.vr *= 1 - 0.9 * dt;
      slab.rot += slab.vr * dt;
      slab.x = pivot.px + rx; slab.y = pivot.py + ry;
      pivot.t -= dt;
      if (pivot.t <= 0 || (pivot.tip && Math.abs(slab.rot) > 1.25)) {
        slab.vx = -slab.vr * ry; slab.vy = slab.vr * rx; slab.hinge = null;
        if (inView(slab.x, slab.y)) Sound.play('hit', 0.4);
      }
      continue;
    }
    if (slab.hang > 0) {
      slab.hang -= dt;
      if (slab.wob) slab.rot = Math.sin(slab.age * 38) * 0.06 * Math.min(1, slab.hang * 4); else slab.x += rand(-0.6, 0.6);
      continue;
    }
    if (slab.paper) {
      slab.vy = Math.min(slab.vy + GRAV * 0.22 * dt, 130); slab.vx = slab.vx * (1 - 1.5 * dt) + Math.sin(slab.age * 4 + slab.ph) * 160 * dt * 4;
      slab.vr = Math.sin(slab.age * 3 + slab.ph) * 2.4; slab.x += slab.vx * dt; slab.y += slab.vy * dt; slab.rot += slab.vr * dt;
      if (slab.y > S.worldH - 4) { S.slabs.splice(i, 1); puff(slab.x, slab.y, 1); }
      else if (belowView(slab.y, Math.max(slab.w, slab.h))) S.slabs.splice(i, 1);
      continue;
    }
    if (slab.crumble && (slab.crumbleT = (slab.crumbleT || 0) - dt) <= 0) {
      slab.crumbleT = slab.crumble;
      const qx = rand(slab.ox, slab.ox + slab.w), qy = rand(slab.oy, slab.oy + slab.h), cosr = Math.cos(slab.rot), sinr = Math.sin(slab.rot);
      addDebris({ x: slab.x + qx * cosr - qy * sinr, y: slab.y + qx * sinr + qy * cosr, w: rand(3, 7), h: rand(3, 7), vx: slab.vx + rand(-60, 60), vy: slab.vy + rand(-40, 20), rot: 0, vr: rand(-8, 8),
        src: null, fill: slab.fill, edge: null, rest: false, check: 0.2, cells: null });
    }
    slab.vy = Math.min(slab.vy + GRAV * dt, 1400);
    slab.vx *= 1 - 0.3 * dt;
    const prevY = slab.y;
    slab.x += slab.vx * dt; slab.y += slab.vy * dt; slab.rot += slab.vr * dt;
    const halfH = (Math.abs(Math.sin(slab.rot)) * slab.w + Math.abs(Math.cos(slab.rot)) * slab.h) / 2 * (slab.glass ? 1 : 0.6);
    if (belowView(slab.y, Math.max(slab.w, slab.h)) || slab.x < -200 || slab.x > S.worldW + 200) { S.slabs.splice(i, 1); continue; }
    const land = slab.y + halfH >= S.worldH;
    if (land && slab.bounce > 0 && slab.vy > 260 && slab.age < 4) {
      slab.bounce--; slab.vy = -slab.vy * 0.32; slab.vx *= 0.6; slab.vr = -slab.vr * 0.5 + rand(-1, 1);
      if (inView(slab.x, slab.y)) Sound.play('hit', 0.5);
      for (let q = 0; q < 2; q++) puff(slab.x + rand(-slab.w / 4, slab.w / 4), slab.y + halfH, 1);
      continue;
    }
    if (land) { shardSlab(slab); S.slabs.splice(i, 1); }
  }
}

function shardSlab(slab) {
  const roll = Math.random(), paperish = !slab.glass && !slab.final;
  if (paperish && roll < 0.3 && slab.w * slab.h < 60000) { slabWhole(slab); return; }
  if (paperish && roll < 0.65) { slabPieces(slab, 2 + ((Math.random() * 3) | 0)); return; }
  const area = slab.w * slab.h, ps = clamp(Math.sqrt(area / clamp(Math.round(area / 380), 4, 36)), 6, 26);
  const cosr = Math.cos(slab.rot), sinr = Math.sin(slab.rot);
  const inside = (x, y) => {
    const points = slab.poly; let sign = 0;
    for (let i = 0; i < points.length; i++) {
      const from = points[i], to = points[(i + 1) % points.length], cr = (to[0] - from[0]) * (y - from[1]) - (to[1] - from[1]) * (x - from[0]);
      if (cr !== 0) { if (sign === 0) sign = Math.sign(cr); else if (Math.sign(cr) !== sign) return false; }
    }
    return true;
  };
  let n = 0;
  const x0 = slab.ox, y0 = slab.oy;
  for (let gy = y0; gy < y0 + slab.h && n < 40; gy += ps) {
    for (let gx = x0; gx < x0 + slab.w && n < 40; gx += ps) {
      const qw = Math.min(ps, x0 + slab.w - gx), qh = Math.min(ps, y0 + slab.h - gy), qx = gx + qw / 2, qy = gy + qh / 2;
      if (qw < 3 || qh < 3 || !inside(qx, qy)) continue;
      const wx = slab.x + qx * cosr - qy * sinr, wy = slab.y + qx * sinr + qy * cosr;
      const dirx = qx / (slab.w / 2 || 1);
      addDebris({
        x: wx, y: wy, w: qw, h: qh, vx: dirx * rand(80, 200) + slab.vx * 0.3 + rand(-50, 50), vy: rand(-340, -90), rot: slab.rot, vr: rand(-10, 10),
        src: slab.src, sx: (gx - x0) / slab.w * slab.SW, sy: (gy - y0) / slab.h * slab.SH, sw: qw / slab.w * slab.SW, sh: qh / slab.h * slab.SH,
        fill: slab.fill, edge: null, rest: false, check: rand(0, 0.3), cells: null,
      });
      n++;
    }
  }
  if (slab.glass) {
    for (let i = 0; i < 22; i++) S.particles.push({ t: 'spark', x: slab.x + rand(-slab.w / 2, slab.w / 2), y: slab.y + rand(-4, 4), vx: rand(-260, 260), vy: rand(-380, -60), life: rand(0.3, 0.8), max: 0.8, g: 1, col: i % 3 ? '#e6f6ff' : '#ffffff' });
  }
  for (let i = 0; i < 3; i++) puff(slab.x + rand(-slab.w / 3, slab.w / 3), slab.y, 1);
  if (inView(slab.x, slab.y)) Sound.play('break', slab.glass ? 0.9 : 0.6);
}

function drawSlabs(ctx) {
  for (const thrown of S.stuck || []) {
    if (!inView(thrown.x, thrown.y, 50)) continue;
    const sprite = THROWN_SPR[thrown.spr] || THROWN_SPR.knife;
    ctx.save(); ctx.translate(lx(thrown.x), ly(thrown.y)); ctx.rotate(Math.round(thrown.ang / (Math.PI / 8)) * (Math.PI / 8));
    ctx.drawImage(sprite, -sprite.width + 2, -(sprite.height >> 1)); ctx.restore();
  }
}
function slabCut(slab) {
  let left = 1e9, top = 1e9, right = -1e9, bottom = -1e9;
  for (const point of slab.poly) { left = Math.min(left, point[0]); top = Math.min(top, point[1]); right = Math.max(right, point[0]); bottom = Math.max(bottom, point[1]); }
  const pad = 2, boxW = Math.max(2, Math.ceil(right - left) + pad * 2), boxH = Math.max(2, Math.ceil(bottom - top) + pad * 2);
  const canvas = slab.pc && slab.pc.width === boxW && slab.pc.height === boxH ? slab.pc : document.createElement('canvas');
  canvas.width = boxW; canvas.height = boxH;
  const ctx = canvas.getContext('2d'), tx = pad - left, ty = pad - top;
  ctx.imageSmoothingEnabled = true;
  ctx.translate(tx, ty);
  ctx.beginPath();
  slab.poly.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
  ctx.closePath();
  ctx.save();
  ctx.clip();
  if (slab.rad > 1 && ctx.roundRect) { ctx.beginPath(); ctx.roundRect(slab.ox, slab.oy, slab.w, slab.h, slab.rad); ctx.clip(); }
  let drawn = false;
  if (slab.src && slab.SW) { try { ctx.drawImage(slab.src, 0, 0, slab.SW, slab.SH, slab.ox, slab.oy, slab.w, slab.h); drawn = true; } catch (e) { } }
  if (!drawn) { ctx.fillStyle = slab.fill; ctx.fillRect(slab.ox, slab.oy, slab.w, slab.h); }
  if (slab.glass) {
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    ctx.beginPath(); ctx.moveTo(slab.ox, slab.oy); ctx.lineTo(slab.ox + slab.w * 0.45, slab.oy); ctx.lineTo(slab.ox, slab.oy + slab.h * 0.45); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(slab.w * 0.3, -slab.h * 0.2); ctx.moveTo(0, 0); ctx.lineTo(-slab.w * 0.2, slab.h * 0.35); ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = slab.cut ? '#ffb070' : 'rgba(10,10,14,0.85)'; ctx.lineWidth = slab.rest ? 1.5 : 1; ctx.stroke();
  slab.pc = canvas; slab.pcPoly = slab.poly; slab.pcX = left - pad; slab.pcY = top - pad;
}
function drawPoly(ctx, slab, vx, vy) {
  if (!slab.pc || slab.pcPoly !== slab.poly || (slab.src && slab.src.__v !== undefined && slab.pcV !== slab.src.__v)) { slabCut(slab); slab.pcV = slab.src && slab.src.__v; }
  const scale = S.dpr, cosr = Math.cos(slab.rot || 0) * scale, sinr = Math.sin(slab.rot || 0) * scale;
  ctx.setTransform(cosr, sinr, -sinr, cosr, (slab.x - vx) * scale, (slab.y - vy) * scale);
  if (slab.paper) ctx.globalAlpha = 0.82 + 0.18 * Math.abs(Math.sin(slab.age * 4 + slab.ph));
  ctx.drawImage(slab.pc, slab.pcX, slab.pcY);
  ctx.globalAlpha = 1;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
function drawSlabsHi(ctx, vx, vy) {
  const any = (S.remnants && S.remnants.length) || (S.slabs && S.slabs.length);
  if (!any) return;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  for (const slab of S.remnants || []) if (inView(slab.x, slab.y, 300)) drawPoly(ctx, Object.assign(slab, { rest: true }), vx, vy);
  for (const slab of S.slabs || []) {
    if (!inView(slab.x, slab.y, 300)) continue;
    if (slab.burnout) { drawBurnout(ctx, slab, vx, vy); continue; }
    drawPoly(ctx, slab, vx, vy);
    if (slab.hinge && !slab.hinge.tip) {
      ctx.fillStyle = '#20222a'; ctx.beginPath(); ctx.arc(slab.hinge.px - vx, slab.hinge.py - vy, 2.5, 0, TAU); ctx.fill();
      ctx.fillStyle = '#c8ccd8'; ctx.beginPath(); ctx.arc(slab.hinge.px - vx - 0.6, slab.hinge.py - vy - 0.6, 1.2, 0, TAU); ctx.fill();
    }
  }
  ctx.restore();
}

function backdropGeom(img) {
  if (S.bdGeom) return S.bdGeom;
  let x = 0, y = 0, w = S.artW * PX, h = S.VH, ov = null;
  try {
    const doc = iframe.contentDocument, win = doc.defaultView;
    const el = doc.querySelector('.backdropImage.displayingBackdropImage');
    if (el) { const rect = el.getBoundingClientRect(); x = rect.left + win.scrollX; y = rect.top + win.scrollY; w = rect.width; h = rect.height; }
    const bc = doc.querySelector('.backgroundContainer');
    if (bc) {
      const bcs = win.getComputedStyle(bc), match = /rgba?\(([^)]+)\)/.exec(bcs.backgroundColor || '');
      const alpha = alphaOf(bcs.backgroundColor) * (parseFloat(bcs.opacity) || 1);
      if (match && alpha > 0) { const parts = match[1].split(/[ ,/]+/).filter(Boolean); ov = `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha})`; }
    }
  } catch (e) { }
  const iw = img.naturalWidth, ih = img.naturalHeight, k = Math.max(w / iw, h / ih);
  return (S.bdGeom = { x: x + (w - iw * k) / 2, y: y + (h - ih * k) / 2, w: iw * k, h: ih * k, bx: x, by: y, bw: w, bh: h, ov });
}
function backdropBandArt(w, h, bi, img) {
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d'), geom = backdropGeom(img), y0 = bi * h;
  ctx.fillStyle = wallColour(); ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.beginPath(); ctx.rect(geom.bx / PX, geom.by / PX - y0, geom.bw / PX, geom.bh / PX); ctx.clip();
  ctx.imageSmoothingEnabled = true;
  try { ctx.drawImage(img, geom.x / PX, geom.y / PX - y0, geom.w / PX, geom.h / PX); } catch (e) { }
  if (geom.ov) { ctx.fillStyle = geom.ov; ctx.fillRect(0, 0, w, h); }
  ctx.restore();
  return canvas;
}
function wallColour() {
  if (S.wallCol) return S.wallCol;
  setTimeout(() => diag('layer', 'wall', 'info', { col: S.wallCol, backdrop: !!(shell.backdrop && shell.backdrop()) }), 0);
  let col = '#101010';
  try {
    const doc = iframe.contentDocument, w = doc.defaultView;
    for (const el of [doc.querySelector('.backgroundContainer'), doc.querySelector('.skinBody'), doc.body, doc.documentElement]) {
      if (!el) continue;
      const bg = w.getComputedStyle(el).backgroundColor;
      if (bg && alphaOf(bg) > 0.5) { col = bg; break; }
    }
  } catch (e) { }
  return (S.wallCol = col);
}
function wallBandArt(w, h, bi) {
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = wallColour(); ctx.fillRect(0, 0, w, h);
  return canvas;
}
function bdLayer(y) {
  if (y < 0 || y >= S.nb * BAND_H) return null;
  const layer = band(Math.floor(y / BAND_H));
  if (!layer.dmg) { layer.dmg = document.createElement('canvas'); layer.dmg.width = S.artW; layer.dmg.height = BAND_H; layer.dctx = layer.dmg.getContext('2d'); }
  return layer;
}
function bdDot(x, y, col) { const layer = bdLayer(y); if (layer) { layer.dctx.fillStyle = col; layer.dctx.fillRect(x, y % BAND_H, 1, 1); } }
function backdropMark(wx, wy, big) {
  wallCrater(wx, wy, big ? rand(6, 9) : rand(3, 4.5));
  for (let k = 0; k < 2; k++) S.particles.push({ t: 'spark', x: wx, y: wy, vx: rand(-120, 120), vy: rand(-160, 40), life: rand(0.1, 0.25), max: 0.25 });
  return true;
}
function backdropMarkOld(wx, wy, big) {
  const cx = Math.round(wx / PX), cy = Math.round(wy / PX), radius = big ? 2 : 1;
  for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) if (dx * dx + dy * dy <= radius * radius) bdDot(cx + dx, cy + dy, 'rgba(6,4,8,0.92)');
  for (let i = 0; i < 3; i++) {
    let x = cx, y = cy, angle = Math.random() * TAU;
    for (let j = 0; j < 3 + (Math.random() * 4 | 0); j++) { angle += (Math.random() - 0.5) * 0.7; x += Math.cos(angle); y += Math.sin(angle); bdDot(Math.round(x), Math.round(y), 'rgba(0,0,0,0.6)'); }
  }
  bdDot(cx + radius, cy + radius, 'rgba(255,255,255,0.35)');
  for (let k = 0; k < 2; k++) S.particles.push({ t: 'spark', x: wx, y: wy, vx: rand(-120, 120), vy: rand(-160, 40), life: rand(0.1, 0.25), max: 0.25 });
  return true;
}
function backdropBurn(wx, wy, wr, k) {
  const cx = wx / PX, cy = wy / PX, radius = Math.max(2, wr / PX), alpha = k || 0.75;
  for (let n = 0; n < 3; n++) {
    const sx = cx + rand(-0.3, 0.3) * radius, sy = cy + rand(-0.3, 0.3) * radius, sr = radius * rand(0.6, 1);
    for (let bi = Math.floor((sy - sr) / BAND_H); bi <= Math.floor((sy + sr) / BAND_H); bi++) {
      const layer = bdLayer(bi * BAND_H);
      if (!layer) continue;
      const y = sy - bi * BAND_H, glow = layer.dctx.createRadialGradient(sx, y, 0, sx, y, sr);
      glow.addColorStop(0, `rgba(14,9,6,${(alpha * 0.55).toFixed(2)})`); glow.addColorStop(0.6, `rgba(30,16,8,${(alpha * 0.3).toFixed(2)})`); glow.addColorStop(1, 'rgba(40,20,8,0)');
      layer.dctx.fillStyle = glow; layer.dctx.fillRect(sx - sr, y - sr, sr * 2, sr * 2);
    }
  }
}

function backdropRoast(wx, wy) {
  const cx = Math.round(wx / PX), cy = Math.round(wy / PX);
  if (Math.random() < 0.12) S.particles.push({ t: 'smoke', x: wx + rand(-4, 4), y: wy, vx: rand(-12, 12), vy: rand(-50, -20), s: rand(3, 6), life: rand(0.8, 1.6), max: 1.6 });
  if (Math.random() < 0.5) backdropBurn(wx + rand(-4, 4), wy + rand(-4, 4), rand(5, 9), 0.22);
  if (Math.random() < 0.04) { const e = fxEmber(wx, wy, 0, 0, rand(2, 5)); e.st = 1; }
  if (Math.random() < 0.06) smoulderAt(wx, wy, 12, 2.5);
}

function inPoly(points, x, y) {
  let sign = 0;
  for (let i = 0; i < points.length; i++) {
    const from = points[i], to = points[(i + 1) % points.length], cr = (to[0] - from[0]) * (y - from[1]) - (to[1] - from[1]) * (x - from[0]);
    if (cr !== 0) { if (sign === 0) sign = Math.sign(cr); else if (Math.sign(cr) !== sign) return false; }
  }
  return true;
}
function hitRemnant(wx, wy, pushX) {
  for (let i = (S.remnants || []).length - 1; i >= 0; i--) {
    const slab = S.remnants[i];
    if (!inPoly(slab.poly, wx - slab.x, wy - slab.y)) continue;
    slab.hits = (slab.hits || 0) + 1;
    let area = 0; for (let k = 0; k < slab.poly.length; k++) { const a = slab.poly[k], c = slab.poly[(k + 1) % slab.poly.length]; area += a[0] * c[1] - c[0] * a[1]; }
    area = Math.abs(area) / 2;
    if (area > slab.w * slab.h * 0.06) {
      const localX = wx - slab.x, localY = wy - slab.y, center = centroid(slab.poly);
      let nx = localX - center[0], ny = localY - center[1]; const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
      const a = Math.atan2(ny, nx) + rand(-0.6, 0.6); nx = Math.cos(a); ny = Math.sin(a);
      const origin = [center[0] + nx * rand(2, 14), center[1] + ny * rand(2, 14)];
      const piece = clipHalf(slab.poly, origin, [nx, ny]), rest = clipHalf(slab.poly, origin, [-nx, -ny]);
      if (piece.length >= 3 && rest.length >= 3) {
        const pc = centroid(piece);
        if (S.slabs.length < SLAB_MAX) S.slabs.push(Object.assign({}, slab, { x: slab.x + pc[0], y: slab.y + pc[1], ox: slab.ox - pc[0], oy: slab.oy - pc[1], poly: piece.map((q) => [q[0] - pc[0], q[1] - pc[1]]),
          vx: nx * rand(60, 180) + (pushX || 0) * 0.3, vy: ny * rand(40, 120) - rand(30, 100), rot: 0, vr: rand(-4, 4), hang: 0, age: 0, bounce: Math.random() < 0.3 ? 1 : 0 }));
        slab.poly = rest;
        for (let k = 0; k < 6; k++) S.particles.push({ t: 'spark', x: wx, y: wy, vx: rand(-160, 160), vy: rand(-200, 40), life: rand(0.15, 0.35), max: 0.35 });
        puff(wx, wy, 1);
        if (inView(wx, wy)) Sound.play('paper', 0.6);
        return true;
      }
    }
    if (area > slab.w * slab.h * 0.06) return true;
    S.remnants.splice(i, 1);
    shardSlab(Object.assign(slab, { vx: pushX || 0, vy: 0, final: 1 }));
    return true;
  }
  for (const slab of S.slabs || []) {
    if (!slab.hinge || slab.hinge.tip) continue;
    const c = Math.cos(-slab.rot), sn = Math.sin(-slab.rot), dx = wx - slab.x, dy = wy - slab.y;
    if (!inPoly(slab.poly, dx * c - dy * sn, dx * sn + dy * c)) continue;
    const pivot = slab.hinge, rc = Math.cos(slab.rot), rs = Math.sin(slab.rot), rx = pivot.dx * rc - pivot.dy * rs, ry = pivot.dx * rs + pivot.dy * rc;
    slab.vx = -slab.vr * ry + (pushX || 0) * 0.5; slab.vy = slab.vr * rx - 60; slab.hinge = null;
    if (inView(slab.x, slab.y)) Sound.play('hit', 0.5);
    return true;
  }
  return false;
}
function hitRemnantsIn(wx, wy, wr) {
  let n = 0;
  for (let k = 0; k < 6 && n < 12; k++) {
    let hit = false;
    for (const slab of (S.remnants || []).slice()) if (Math.hypot(slab.x - wx, slab.y - wy) < wr + Math.max(slab.w, slab.h) / 2 && hitRemnant(slab.x, slab.y, (slab.x - wx) * 3)) { hit = true; n++; }
    if (!hit) break;
  }
}

function smoulderAt(x, y, w, sec) {
  if (!S.smoulder) S.smoulder = [];
  for (const spot of S.smoulder) if (Math.abs(spot.x - x) < 24 && Math.abs(spot.y - y) < 24) { spot.life = Math.max(spot.life, sec); spot.max = Math.max(spot.max, sec); return; }
  if (S.smoulder.length >= 48) S.smoulder.shift();
  S.smoulder.push({ x, y, w: Math.max(6, w), life: sec, max: sec, acc: 0 });
}
function updateSmoulder(dt) {
  if (!S.smoulder || !S.smoulder.length) return;
  for (let i = S.smoulder.length - 1; i >= 0; i--) {
    const spot = S.smoulder[i];
    spot.life -= dt;
    if (spot.life <= 0) { S.smoulder.splice(i, 1); continue; }
    const k = spot.life / spot.max;
    spot.acc += dt * (0.3 + 1.2 * k) * Math.min(1.6, spot.w / 30 + 0.5) * fxK();
    if (Math.random() < 0.6 * dt) fxAsh(spot.x + rand(-spot.w / 2, spot.w / 2), spot.y, rand(-15, 15), -rand(20, 50), true);
    while (spot.acc >= 1) {
      spot.acc -= 1;
      fxSmoke(spot.x + rand(-spot.w / 2, spot.w / 2), spot.y - rand(0, 4), rand(-10, 10) + 6, rand(-40, -18), rand(3, 5) + 3 * k, rand(1.8, 3.2), k > 0.6, 'smoulder');
      if (Math.random() < 0.25 * k) fxEmber(spot.x + rand(-spot.w / 2, spot.w / 2), spot.y, rand(-20, 20), rand(-60, -20), rand(0.8, 2));
    }
  }
}

function debrisShape() {
  let best = null, bestArea = -1;
  for (let tr = 0; tr < 4; tr++) {
    const n = 3 + ((Math.random() * 4) | 0), ts = [];
    for (let i = 0; i < n; i++) ts.push(Math.random() * 4);
    ts.sort((a, b) => a - b);
    const points = ts.map((t) => (t < 1 ? [t, 0] : t < 2 ? [1, t - 1] : t < 3 ? [3 - t, 1] : [0, 4 - t]));
    let area = 0;
    for (let i = 0; i < n; i++) { const from = points[i], to = points[(i + 1) % n]; area += from[0] * to[1] - to[0] * from[1]; }
    area = Math.abs(area) / 2;
    if (area > bestArea) { bestArea = area; best = points; }
    if (area > 0.42) break;
  }
  return bestArea > 0.2 ? best : null;
}
function debrisBody(ctx, piece, x0, y0, w, h) {
  if (piece.src && piece.sw >= 1) return;
  if (piece.shape === undefined) piece.shape = w >= 3 && h >= 3 && Math.random() < 0.85 ? debrisShape() : null;
  const points = piece.shape;
  if (!points) {
    ctx.fillStyle = INK; ctx.fillRect(x0 - 1, y0 - 1, w + 2, h + 2);
    let drawn = false;
    if (piece.src && piece.sw >= 1 && piece.sh >= 1) { try { ctx.drawImage(piece.src, piece.sx, piece.sy, piece.sw, piece.sh, x0, y0, w, h); drawn = true; } catch (e) { } }
    if (!drawn) { ctx.fillStyle = piece.fill || '#8a8ca0'; ctx.fillRect(x0, y0, w, h); }
    if (piece.edge) { ctx.fillStyle = piece.edge; ctx.fillRect(x0, y0, w, 1); ctx.fillRect(x0, y0, 1, h); }
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(x0, y0, w, 1); ctx.fillRect(x0, y0 + 1, 1, h - 1);
    ctx.fillStyle = 'rgba(0,0,0,0.32)'; ctx.fillRect(x0, y0 + h - 1, w, 1); ctx.fillRect(x0 + w - 1, y0, 1, h - 1);
    return;
  }
  if (!piece.cv || piece.cvw !== w || piece.cvh !== h || (piece.src && piece.src.__v !== undefined && piece.cvV !== piece.src.__v)) {
    piece.cvV = piece.src && piece.src.__v;
    const canvas = piece.cv || document.createElement('canvas'), art = canvas.getContext('2d');
    canvas.width = w + 2; canvas.height = h + 2; piece.cvw = w; piece.cvh = h; piece.cv = canvas;
    art.imageSmoothingEnabled = false;
    art.beginPath();
    for (let i = 0; i < points.length; i++) { const px = 1 + points[i][0] * w, py = 1 + points[i][1] * h; if (i) art.lineTo(px, py); else art.moveTo(px, py); }
    art.closePath();
    art.save(); art.clip();
    let drawn = false;
    if (piece.src && piece.sw >= 1 && piece.sh >= 1) { try { art.drawImage(piece.src, piece.sx, piece.sy, piece.sw, piece.sh, 1, 1, w, h); drawn = true; } catch (e) { } }
    if (!drawn) { art.fillStyle = piece.fill || '#8a8ca0'; art.fillRect(1, 1, w, h); }
    art.fillStyle = 'rgba(255,255,255,0.22)'; art.fillRect(1, 1, w, Math.max(1, h * 0.3));
    art.restore();
    art.strokeStyle = INK; art.lineWidth = 1; art.stroke();
  }
  ctx.drawImage(piece.cv, x0 - 1, y0 - 1);
}

function stageBreak(block, local) {
  if (block.staged || !block.alive || block.kind === 'word' || block.kind === 'ctrl') return false;
  const area = block.w * block.h;
  if (area < 2500 || area > 180000) return false;
  if (block.stT === undefined) block.stT = rand(0.45, 0.75);
  if (block.hp > block.max * block.stT) return false;
  if (block.hp <= 0 && Math.random() < 0.5) return false;
  const material = materialOf(block);
  if (material !== 'paper' && material !== 'glossy' && material !== 'card') return false;
  block.staged = true;
  const ST = [['chunk', 0.26], ['hinge', 0.2], ['drop', 0.13], ['tip', 0.08], ['tear', 0.1], ['split', 0.08], ['crumble', 0.06], ['mirror', 0.04], ['chunk2', 0.05]];
  const recent = S.breakRecent || [];
  let sum = 0; for (const entry of ST) sum += entry[1] * (recent.includes(entry[0]) ? 0.3 : 1);
  let roll = Math.random() * sum, choice = 'chunk';
  for (const entry of ST) { roll -= entry[1] * (recent.includes(entry[0]) ? 0.3 : 1); if (roll <= 0) { choice = entry[0]; break; } }
  block.forceMode = (block.burn > 0 || (block.fz && block.fz.length)) && Math.random() < 0.3 && burnouts() < 3 ? 'burnout' : choice === 'chunk2' ? 'chunk' : choice;
  destroyBlock(block, local);
  return true;
}

function slabWhole(slab) {
  const center = centroid(slab.poly), cosr = Math.cos(slab.rot), sinr = Math.sin(slab.rot);
  addDebris({ x: slab.x + center[0] * cosr - center[1] * sinr, y: slab.y + center[0] * sinr + center[1] * cosr, w: slab.w, h: slab.h, vx: slab.vx * 0.3 + rand(-40, 40), vy: -rand(40, 120), rot: slab.rot, vr: rand(-3, 3),
    src: slab.src, sx: 0, sy: 0, sw: slab.SW, sh: slab.SH, fill: slab.fill, edge: null, rest: false, check: 0.2, cells: null, shape: null, whole: 1 });
  for (let i = 0; i < 4; i++) fxDust(slab.x + rand(-slab.w / 2, slab.w / 2), slab.y + slab.h * 0.3, rand(-120, 120), -rand(10, 50), rand(6, 12), rand(0.5, 1));
  if (inView(slab.x, slab.y)) Sound.play('paper', 0.6);
}
function slabPieces(slab, n) {
  const xs = [0], ys = [0];
  const cols = n >= 3 ? 2 : (slab.w > slab.h ? 2 : 1), rows = Math.ceil(n / cols);
  for (let i = 1; i < cols; i++) xs.push(i / cols + rand(-0.15, 0.15)); xs.push(1);
  for (let i = 1; i < rows; i++) ys.push(i / rows + rand(-0.15, 0.15)); ys.push(1);
  const cosr = Math.cos(slab.rot), sinr = Math.sin(slab.rot);
  for (let col = 0; col < cols; col++) for (let row = 0; row < rows; row++) {
    const left = xs[col], right = xs[col + 1], top = ys[row], bottom = ys[row + 1];
    const qx = slab.ox + (left + right) / 2 * slab.w, qy = slab.oy + (top + bottom) / 2 * slab.h, w = (right - left) * slab.w, h = (bottom - top) * slab.h;
    if (w < 4 || h < 4) continue;
    addDebris({ x: slab.x + qx * cosr - qy * sinr, y: slab.y + qx * sinr + qy * cosr, w, h, vx: (left + right - 1) * rand(80, 200) + slab.vx * 0.3, vy: -rand(80, 240), rot: slab.rot, vr: rand(-6, 6),
      src: slab.src, sx: left * slab.SW, sy: top * slab.SH, sw: (right - left) * slab.SW, sh: (bottom - top) * slab.SH, fill: slab.fill, edge: null, rest: false, check: 0.2, cells: null });
  }
  for (let i = 0; i < 3; i++) fxDust(slab.x + rand(-slab.w / 3, slab.w / 3), slab.y, rand(-100, 100), -rand(10, 40), rand(5, 10), rand(0.4, 0.9));
  if (inView(slab.x, slab.y)) Sound.play('break', 0.5);
}

function dupCheck() {
  const out = [], overlap = (box, other) => {
    const x = Math.max(0, Math.min(box.x + box.w, other.x + other.w) - Math.max(box.x, other.x)), y = Math.max(0, Math.min(box.y + box.h, other.y + other.h) - Math.max(box.y, other.y));
    return x * y / Math.max(1, Math.min(box.w * box.h, other.w * other.h));
  };
  for (const slab of [...(S.remnants || []), ...(S.slabs || [])]) {
    if (!slab.ob) continue;
    queryRect(slab.ob.x, slab.ob.y, slab.ob.w, slab.ob.h, (block) => {
      if (block.kind === 'word' || overlap(block, slab.ob) < 0.5) return;
      let has = false;
      try { has = !!breakSource(block, block.el.ownerDocument.defaultView.getComputedStyle(block.el)).src; } catch (e) { }
      if (has && out.length < 20) out.push({ tag: block.el.tagName, cls: String(block.el.className || '').slice(0, 40), mode: slab.mode || '', remnant: (S.remnants || []).includes(slab), bx: Math.round(block.x), sx: Math.round(slab.ob.x), bw: Math.round(block.w), sw: Math.round(slab.ob.w) });
    });
  }
  return out;
}

function debrisCut(piece) {
  const w = Math.max(2, Math.round(piece.w)), h = Math.max(2, Math.round(piece.h));
  if (piece.shape === undefined) piece.shape = !piece.whole && w >= 5 && h >= 5 && Math.random() < 0.85 ? debrisShape() : null;
  const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
  canvas.width = w + 2; canvas.height = h + 2;
  ctx.imageSmoothingEnabled = true;
  ctx.beginPath();
  if (piece.shape) { const points = piece.shape; for (let i = 0; i < points.length; i++) { const px = 1 + points[i][0] * w, py = 1 + points[i][1] * h; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.closePath(); }
  else ctx.rect(1, 1, w, h);
  ctx.save(); ctx.clip();
  try { ctx.drawImage(piece.src, piece.sx, piece.sy, piece.sw, piece.sh, 1, 1, w, h); } catch (e) { ctx.fillStyle = piece.fill || '#8a8ca0'; ctx.fillRect(1, 1, w, h); }
  const sheen = ctx.createLinearGradient(0, 0, 0, h);
  sheen.addColorStop(0, 'rgba(255,255,255,0.18)'); sheen.addColorStop(0.4, 'rgba(255,255,255,0)'); sheen.addColorStop(1, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = sheen; ctx.fillRect(1, 1, w, h);
  ctx.restore();
  ctx.strokeStyle = 'rgba(12,12,16,0.85)'; ctx.lineWidth = 1; ctx.stroke();
  piece.hc = canvas;
}
function drawDebrisHi(ctx, vx, vy) {
  const scale = S.dpr;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  for (const piece of S.debris) {
    if (!piece.src || !(piece.sw >= 1) || !inView(piece.x, piece.y, 60)) continue;
    if (!piece.hc || (piece.src && piece.src.__v !== undefined && piece.hcV !== piece.src.__v)) { debrisCut(piece); piece.hcV = piece.src && piece.src.__v; }
    const cosr = Math.cos(piece.rot) * scale, sinr = Math.sin(piece.rot) * scale;
    ctx.setTransform(cosr, sinr, -sinr, cosr, (piece.x - vx) * scale, (piece.y - vy) * scale);
    ctx.drawImage(piece.hc, -piece.hc.width / 2, -piece.hc.height / 2);
  }
  ctx.restore();
}

function belowView(y, size) { return !!S.view && y - size > S.view.y + S.VH + 120; }
function debrisSurface(x0, x1, y0, y1, self) {
  if (y1 >= S.worldH) { SURF_X0 = -1e9; SURF_X1 = 1e9; SURF_D = false; return S.worldH; }
  let best = null;
  SURF_D = false;
  const startCol = Math.floor(x0 / DCELL), endCol = Math.floor(x1 / DCELL), startRow = Math.floor((y0 - 1) / DCELL), endRow = Math.floor(y1 / DCELL);
  for (let gy = startRow; gy <= endRow; gy++) for (let gx = startCol; gx <= endCol; gx++) {
    const cell = S.dgrid.get(gy * 65536 + gx);
    if (!cell) continue;
    for (const other of cell) {
      if (other === self) continue;
      const top = other.y - other.rh / 2;
      if (top >= y0 - 0.5 && top <= y1 && other.x + other.rw / 2 > x0 && other.x - other.rw / 2 < x1 && (best === null || top < best)) { best = top; SURF_X0 = other.x - other.rw / 2; SURF_X1 = other.x + other.rw / 2; SURF_D = true; }
    }
  }
  return best;
}

function burnGrid(w, h, ix, iy) {
  let scale = clamp(S.dpr || 1, 1, 2.5);
  if (w * h * scale * scale > 150000) scale = Math.max(0.6, Math.sqrt(150000 / (w * h)));
  const gw = Math.max(24, Math.round(w * scale)), gh = Math.max(16, Math.round(h * scale)), times = new Float32Array(gw * gh);
  const ph = [rand(0, 9), rand(0, 9), rand(0, 9), rand(0, 9), rand(0, 9), rand(0, 9)];
  const cu = (f) => { const a = new Float32Array(gw); for (let x = 0; x < gw; x++) a[x] = f((x + 0.5) / gw); return a; };
  const cv = (f) => { const a = new Float32Array(gh); for (let y = 0; y < gh; y++) a[y] = f((y + 0.5) / gh); return a; };
  const U1 = cu((u) => Math.sin(u * 7 + ph[0])), V1 = cv((v) => Math.cos(v * 6 + ph[1]));
  const U2s = cu((u) => Math.sin(u * 17 + ph[2])), U2c = cu((u) => Math.cos(u * 17 + ph[2])), V2c = cv((v) => Math.cos(v * 11)), V2s = cv((v) => Math.sin(v * 11));
  const U3 = cu((u) => Math.sin(u * 37 + ph[3])), V3 = cv((v) => Math.sin(v * 41 + ph[4]));
  const U4 = cu((u) => Math.sin(u * 83 + ph[5])), V4 = cv((v) => Math.sin(v * 97 + ph[0]));
  const U5s = cu((u) => Math.sin(u * 191 + ph[1])), U5c = cu((u) => Math.cos(u * 191 + ph[1])), V5a = cv((v) => Math.cos(v * 23) * Math.sin(v * 173 + ph[2])), V5b = cv((v) => Math.sin(v * 23) * Math.sin(v * 173 + ph[2]));
  const U6 = cu((u) => Math.sin(u * 389 + ph[4])), V6 = cv((v) => Math.sin(v * 353 + ph[5]));
  let mx = 0;
  for (let y = 0; y < gh; y++) {
    const v = (y + 0.5) / gh, dy = (v - iy) * h / w, dyk = dy * (dy < 0 ? 0.45 : 1.8);
    const v1 = V1[y], v2c = V2c[y], v2s = V2s[y], v3 = V3[y], v4 = V4[y], v5a = V5a[y], v5b = V5b[y], v6 = V6[y];
    for (let x = 0; x < gw; x++) {
      const dx = (x + 0.5) / gw - ix;
      const wob = 0.09 * U1[x] * v1 + 0.05 * (U2s[x] * v2c + U2c[x] * v2s) + 0.025 * U3[x] * v3 + 0.012 * U4[x] * v4
        + 0.006 * (U5s[x] * v5a + U5c[x] * v5b) + 0.003 * U6[x] * v6;
      const dist = Math.sqrt(dx * dx + dyk * dyk) + wob + Math.random() * 0.004;
      times[y * gw + x] = dist; if (dist > mx) mx = dist;
    }
  }
  let mn = 1e9; for (let i = 0; i < times.length; i++) mn = Math.min(mn, times[i]);
  for (let i = 0; i < times.length; i++) times[i] = (times[i] - mn) / (mx - mn);
  const maskCanvas = document.createElement('canvas'); maskCanvas.width = gw; maskCanvas.height = gh;
  const tintCanvas = document.createElement('canvas'); tintCanvas.width = gw; tintCanvas.height = gh;
  const glowCanvas = document.createElement('canvas'); glowCanvas.width = gw; glowCanvas.height = gh;
  const noise = new Float32Array(gw * gh); for (let i = 0; i < noise.length; i++) noise[i] = Math.random();
  const pr = Math.max(1, scale / 0.625), pe = Math.ceil(3.2 * pr);
  for (let k = 0; k < Math.round(gw * gh / (900 * pr * pr)); k++) {
    const px = (Math.random() * gw) | 0, py = (Math.random() * gh) | 0, radius = (1 + Math.random() * 2.2) * pr;
    for (let y = Math.max(0, py - pe); y < Math.min(gh, py + pe + 1); y++) for (let x = Math.max(0, px - pe); x < Math.min(gw, px + pe + 1); x++) {
      const dd = Math.hypot(x - px, y - py); if (dd < radius) times[y * gw + x] = Math.max(0, times[y * gw + x] - 0.07 * (1 - dd / radius));
    }
  }
  const NB = 1024, cnt = new Uint32Array(NB + 1), ord = new Uint32Array(gw * gh);
  for (let i = 0; i < times.length; i++) cnt[Math.min(NB - 1, (Math.max(0, times[i]) * NB) | 0) + 1]++;
  for (let bin = 0; bin < NB; bin++) cnt[bin + 1] += cnt[bin];
  const fill = cnt.slice(0, NB);
  for (let i = 0; i < times.length; i++) ord[fill[Math.min(NB - 1, (Math.max(0, times[i]) * NB) | 0)]++] = i;
  const maskData = maskCanvas.getContext('2d').createImageData(gw, gh);
  for (let i = 3; i < maskData.data.length; i += 4) maskData.data[i] = 255;
  return { N: noise, gw, gh, R: scale, T: times, ord, cnt, NB, lo: 0, p: 0, dur: rand(12, 20), mask: maskCanvas, tint: tintCanvas, glow: glowCanvas, m: maskData, ti: tintCanvas.getContext('2d').createImageData(gw, gh), gi: glowCanvas.getContext('2d').createImageData(gw, gh), rim: [], cv: null, acc: 0, stain: 0, gone: new Uint8Array(gw * gh) };
}
function burnTick(slab, dt) {
  const burn = slab.burnout;
  if (burn.frozen) return false;
  burn.p += dt / burn.dur * 1.1;
  if (burn.stopAt && burn.p >= burn.stopAt) {
    burn.p = burn.stopAt; burn.cool = (burn.cool || 0) + dt;
    if (burn.cool > 3.2) { burn.frozen = true; burn.glow.getContext('2d').clearRect(0, 0, burn.gw, burn.gh); smoulderAt(slab.x, slab.y, Math.min(slab.w, 60) * 0.5, rand(3, 6)); return false; }
  }
  slab.age += dt;
  const progress = burn.p, rim = burn.rim, fresh = [];
  rim.length = 0;
  const NB = burn.NB, cool = burn.cool ? Math.max(0, 1 - burn.cool / 3) : 1;
  const hotEnd = Math.min(NB, Math.ceil((progress + 0.024) * NB) + 1);
  burn.tq = ((burn.tq || 0) + 1) % 3;
  const ranges = [[Math.max(0, Math.floor(burn.lo * NB)), hotEnd]];
  if (burn.tq === 0 || !burn.lo) ranges.push([Math.max(0, Math.floor((progress + 0.02) * NB)), Math.min(NB, Math.ceil((progress + 0.125) * NB) + 1)]);
  burn.lo = Math.max(1e-6, progress - 0.012);
  const md = burn.m.data, td = burn.ti.data, gd = burn.gi.data, times = burn.T, noise = burn.N, ord = burn.ord;
  let iMin = 1e9, iMax = -1;
  for (const [from, to] of ranges) for (let n = burn.cnt[from], ne = burn.cnt[to]; n < ne; n++) {
    const i = ord[n], burnAt = times[i], k = i * 4;
    if (i < iMin) iMin = i; if (i > iMax) iMax = i;
    let alpha = 255, tr = 0, tg = 0, tb = 0, ta = 0, ga = 0;
    const mo = noise[i];
    if (burnAt < progress - 0.008) { alpha = 0; if (!burn.gone[i]) { burn.gone[i] = 1; fresh.push(i); } }
    else if (burnAt < progress) { ta = 230; ga = 255 * (0.45 + 0.55 * mo) * (0.6 + 0.4 * (1 - (progress - burnAt) / 0.008)); rim.push(i); }
    else if (burnAt < progress + 0.022) { tr = tg = tb = (mo * 22) | 0; ta = 240; }
    else if (burnAt < progress + 0.05) { const t = (burnAt - progress - 0.022) / 0.028; tr = 30 + mo * 20; tg = 14 + mo * 10; tb = 6; ta = 235 - 90 * t; }
    else if (burnAt < progress + 0.12) { const t = (burnAt - progress - 0.05) / 0.07; tr = 70 + mo * 30; tg = 40 + mo * 14; tb = 12; ta = (120 + mo * 50) * (1 - t); }
    md[k + 3] = alpha;
    td[k] = tr; td[k + 1] = tg; td[k + 2] = tb; td[k + 3] = ta;
    if (ga > 0) {
      const jitter = Math.random();
      gd[k] = 255; gd[k + 1] = 120 + ((mo * 90 + jitter * 30) | 0); gd[k + 2] = 30 + ((mo * 40) | 0); gd[k + 3] = ga * (0.7 + jitter * 0.3) * cool;
    } else gd[k + 3] = 0;
  }
  if (iMax >= 0) {
    const y0r = (iMin / burn.gw) | 0, dh = ((iMax / burn.gw) | 0) - y0r + 1;
    burn.mask.getContext('2d').putImageData(burn.m, 0, 0, 0, y0r, burn.gw, dh);
    burn.tint.getContext('2d').putImageData(burn.ti, 0, 0, 0, y0r, burn.gw, dh);
    burn.glow.getContext('2d').putImageData(burn.gi, 0, 0, 0, y0r, burn.gw, dh);
  }
  const x0 = slab.x + slab.ox, y0 = slab.y + slab.oy, cw = slab.w / burn.gw, ch = slab.h / burn.gh;
  if ((burn.stain -= dt) <= 0 && fresh.length) {
    burn.stain = 0.4;
    for (let n = 0; n < 2; n++) { const i = fresh[(Math.random() * fresh.length) | 0]; backdropBurn(x0 + (i % burn.gw + 0.5) * cw, y0 + (((i / burn.gw) | 0) + 0.5) * ch, Math.max(cw, ch) * 3, 0.35); }
  }
  burn.acc += dt * Math.min(9, 1.5 + rim.length * 0.08) * fxK() * (burn.cool ? Math.max(0, 1 - burn.cool / 2) : 1);
  while (burn.acc >= 1 && rim.length) {
    burn.acc -= 1;
    const i = rim[(Math.random() * rim.length) | 0], fx = x0 + (i % burn.gw + Math.random()) * cw, fy = y0 + (((i / burn.gw) | 0) + Math.random()) * ch;
    fxFire(fx, fy, rand(-5, 5) + FXC.wind * 0.6, -rand(8, 22), rand(2, 4.5), rand(0.35, 0.7), true);
    if (Math.random() < 0.3) fxEmber(fx, fy, rand(-15, 15), -rand(20, 50), rand(0.8, 2));
    if (Math.random() < 0.08) fxSmoke(fx, fy - 6, rand(-8, 8), -rand(15, 35), rand(4, 8), rand(2, 3.5), true, 'burnout');
    if (Math.random() < 0.15) fxAsh(fx, fy, rand(-15, 15), rand(-10, 20), Math.random() < 0.3);
  }
  if (burn.p < 1.08) return false;
  backdropBurn(slab.x, slab.y, Math.max(slab.w, slab.h) * 0.5, 0.8);
  for (let k = 0; k < 5; k++) { const e = fxEmber(x0 + Math.random() * slab.w, y0 + Math.random() * slab.h, 0, 0, rand(3, 8)); e.st = 1; e.sz = rand(1.4, 2.6); }
  smoulderAt(slab.x, slab.y + slab.h * 0.3, Math.min(slab.w, 50), rand(4, 7));
  return true;
}
function drawBurnout(ctx, slab, vx, vy) {
  const burn = slab.burnout, ww = Math.max(2, Math.round(slab.w)), wh = Math.max(2, Math.round(slab.h)), w = burn.gw, h = burn.gh;
  if (!burn.cv) { burn.cv = document.createElement('canvas'); burn.cv.width = w; burn.cv.height = h; }
  const art = burn.cv.getContext('2d');
  art.globalCompositeOperation = 'source-over';
  art.clearRect(0, 0, w, h);
  art.imageSmoothingEnabled = true;
  try { if (slab.src && slab.SW) art.drawImage(slab.src, 0, 0, slab.SW, slab.SH, 0, 0, w, h); else { art.fillStyle = slab.fill; art.fillRect(0, 0, w, h); } } catch (e) { art.fillStyle = slab.fill; art.fillRect(0, 0, w, h); }
  art.imageSmoothingEnabled = false;
  art.globalCompositeOperation = 'source-atop'; art.drawImage(burn.tint, 0, 0, w, h);
  art.globalCompositeOperation = 'destination-in'; art.drawImage(burn.mask, 0, 0, w, h);
  art.globalCompositeOperation = 'source-over';
  const x = slab.x + slab.ox - vx, y = slab.y + slab.oy - vy;
  ctx.drawImage(burn.cv, x, y, ww, wh);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.imageSmoothingEnabled = false; ctx.drawImage(burn.glow, x, y, ww, wh); ctx.restore();
}
function burnouts() { let n = 0; for (const slab of S.slabs || []) if (slab.burnout) n++; return n; }

function holeBite(cx, cy, radius, left, right, top, bottom, rim) {
  for (let dy = -radius; dy <= radius; dy++) {
    const y = cy + dy;
    if (y < top || y >= bottom) continue;
    const dx = Math.max(0, Math.floor(Math.sqrt(radius * radius - dy * dy)) + (radius > 4 ? Math.round(Math.random() * 2 - 1) : 0));
    const from = Math.max(left, cx - dx), to = Math.min(right, cx + dx + 1);
    if (to <= from) continue;
    revealRow(from, y, to - from);
    if (rim && radius >= 3) { if (from === cx - dx) paintRow('r', from, y, 2, HOLE_SHADE); if (to === cx + dx + 1) paintRow('r', to - 1, y, 1, HOLE_LIT); }
  }
  if (rim && radius >= 3) { const y = cy - radius; if (y >= top && y < bottom) paintRow('r', Math.max(left, cx - 2), y, 5, HOLE_SHADE); }
}
function clearBox(block, cs) {
  if (block.clear !== undefined) return block.clear;
  let clear = false;
  try {
    if (block.kind === 'word') return (block.clear = false);
    cs = cs || block.el.ownerDocument.defaultView.getComputedStyle(block.el);
    if ((block.el.classList && (block.el.classList.contains('blurhash-canvas') || block.el.classList.contains('lazy-hidden'))) || parseFloat(cs.opacity) === 0) return (block.clear = true);
    const pic = breakSource(block, cs);
    clear = !pic.src && !pic.edge && alphaOf(cs.backgroundColor) < 0.1 && (!cs.backgroundImage || cs.backgroundImage === 'none') &&
      (!cs.boxShadow || cs.boxShadow === 'none');
    if (clear && block.el.closest) {
      const card = block.el.closest('.cardBox, .cardScalable, .card');
      if (card && (card.querySelector('img') || card.querySelector('div.cardImageContainer'))) clear = false;
    }
    if (clear) queryRect(block.x, block.y, block.w, block.h, (other) => {
      if (other === block || other.kind === 'word' || !samePicBox(block, other)) return;
      try { if (breakSource(other, other.el.ownerDocument.defaultView.getComputedStyle(other.el)).src) { clear = false; return false; } } catch (e) { }
    });
  } catch (e) { clear = false; }
  if (clear) diagCount('layer.clearBox');
  return (block.clear = clear);
}

function holeJagged(block) {
  if (block.kind === 'word') return;
  try {
    const el = block.el, card = el.closest && el.closest('.cardScalable');
    if (!card || card === el) return;
    if (!breakSource(block, el.ownerDocument.defaultView.getComputedStyle(el)).src) return;
    if (!S.cardQ) S.cardQ = new Set();
    S.cardQ.add(card);
  } catch (e) { }
}
function cardStackTick() {
  if (!S.cardQ || !S.cardQ.size) return;
  let n = 0;
  for (const card of S.cardQ) {
    if (n++ >= 4) break;
    S.cardQ.delete(card);
    try {
      card.style.visibility = 'hidden';
      diagCount('layer.cardStack');
      for (const child of card.querySelectorAll('*')) {
        const block = child.__bi !== undefined ? S.blocks[child.__bi] : null;
        if (block && block.alive && block.el === child) destroyBlock(block, false, true);
      }
    } catch (e) { }
  }
}
function holeJaggedPainted(block) {
  if (clearBox(block)) return;
  const word = block.kind === 'word', margin = word ? 3 : 0;
  const left = Math.floor(block.x / PX) - margin, right = Math.ceil((block.x + block.w) / PX) + margin, top = Math.floor(block.y / PX) - margin, bottom = Math.ceil((block.y + block.h) / PX) + margin;
  const radius = clamp(Math.min(block.w, block.h) * (word ? 0.5 : 0.3), 4, 34) / PX;
  const width = right - left, height = bottom - top, huge = block.w * block.h > S.VW * S.VH * 0.25;
  const rimmed = !huge && !word && !!(shell.backdrop && shell.backdrop());
  const nx = Math.max(1, Math.round(width / (radius * 1.25))), ny = Math.max(1, Math.round(height / (radius * 1.25)));
  for (let iy = 0; iy < ny; iy++) for (let ix = 0; ix < nx; ix++) {
    holeBite(Math.round(left + (ix + 0.5) / nx * width + rand(-0.25, 0.25) * radius), Math.round(top + (iy + 0.5) / ny * height + rand(-0.25, 0.25) * radius), Math.max(1, Math.round(radius * rand(0.8, 1.2))), left, right, top, bottom, false);
  }
  const ne = Math.round((width + height) / (radius * 1.6)) + 2;
  for (let k = 0; k < ne; k++) {
    const t = Math.random() * 2 * (width + height), edgeRadius = Math.max(1, Math.round(radius * rand(0.4, 0.8)));
    const px = t < width ? left + t : t < width + height ? right - edgeRadius * 0.5 : t < 2 * width + height ? left + (2 * width + height - t) : left + edgeRadius * 0.5;
    const py = t < width ? top + edgeRadius * 0.5 : t < width + height ? top + (t - width) : t < 2 * width + height ? bottom - edgeRadius * 0.5 : top + (2 * (width + height) - t);
    holeBite(Math.round(px), Math.round(py), edgeRadius, left, right, top, bottom, rimmed);
  }
}

function bdPaint(wx, wy, wr, fn) {
  const cx = wx / PX, cy = wy / PX, radius = wr / PX;
  for (let bi = Math.floor((cy - radius) / BAND_H); bi <= Math.floor((cy + radius) / BAND_H); bi++) {
    const layer = bdLayer(bi * BAND_H);
    if (layer) fn(layer.dctx, cx, cy - bi * BAND_H, radius);
  }
}
function wallChunk(cl) {
  let cx = 0, cy = 0, lv = 0;
  for (const h of cl) { cx += h.x; cy += h.y; lv = Math.max(lv, h.lv); }
  cx /= cl.length; cy /= cl.length;
  let radius = 0; for (const h of cl) radius = Math.max(radius, Math.hypot(h.x - cx, h.y - cy) + h.r);
  radius = Math.min(radius * rand(0.95, 1.12), 70 + lv * 30);
  const level = Math.min(3, lv + 1), pic = !!(shell.backdrop && shell.backdrop());
  const corners = 13 + ((Math.random() * 6) | 0), rad = [], rim = [];
  for (let i = 0; i < corners; i++) { rad.push(rand(0.66, 1.04)); rim.push(rand(1.08, 1.32)); }
  bdPaint(cx, cy, radius * 1.6, (ctx, x, y) => {
    const reach = radius / PX;
    const poly = (arr, k) => { ctx.beginPath(); for (let i = 0; i < corners; i++) { const a = i / corners * TAU + k, q = reach * arr[i]; if (i) ctx.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); else ctx.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } ctx.closePath(); };
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 0.6;
    for (let crack = 0; crack < 4 + level * 2; crack++) {
      let angle = Math.random() * TAU, px = x + Math.cos(angle) * reach, py = y + Math.sin(angle) * reach;
      ctx.beginPath(); ctx.moveTo(px, py);
      for (let s = 0; s < 6; s++) { angle += rand(-0.45, 0.45); px += Math.cos(angle) * reach * 0.32; py += Math.sin(angle) * reach * 0.32; ctx.lineTo(px, py); }
      ctx.stroke();
    }
  });
  wfDig(cx, cy, radius * 0.85, 0.55 + level * 0.25, 0.05);
  const COL = pic ? ['#5a5450', '#3c3834', '#2a2622'] : ['#3a3a3e', '#2c2c30', '#4a4a50', '#222226'];
  const nk = Math.min(18, 5 + Math.round(radius / 7));
  for (let i = 0; i < nk; i++) {
    const angle = rand(0, TAU), dist = rand(0, radius * 0.7), sz = rand(3, 7 + level * 2);
    addDebris({ x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, w: sz, h: sz * rand(0.5, 0.9), vx: Math.cos(angle) * rand(60, 220), vy: rand(-260, -60), rot: rand(0, TAU), vr: rand(-6, 6),
      src: null, fill: COL[(Math.random() * COL.length) | 0], edge: null, rest: false, check: 0.2, cells: null });
  }
  for (let i = 0; i < 4 + level; i++) fxDust(cx + rand(-radius * 0.5, radius * 0.5), cy + rand(-radius * 0.4, radius * 0.4), rand(-50, 50), rand(-60, 0), rand(6, 11), rand(0.7, 1.3));
  if (inView(cx, cy)) Sound.play('break', 0.5);
  diagCount('wall.chunk' + level);
  return { x: cx, y: cy, r: radius * 0.8, lv: level };
}
function wallHitsAdd(wx, wy, radius) {
  if (!S.wallHits) S.wallHits = [];
  const hits = S.wallHits, near = [];
  for (const h of hits) if (Math.hypot(h.x - wx, h.y - wy) < (h.r + radius) * 1.15) near.push(h);
  if (near.length >= 2) {
    for (const h of near) hits.splice(hits.indexOf(h), 1);
    hits.push(wallChunk(near.concat([{ x: wx, y: wy, r: radius, lv: 0 }])));
  } else hits.push({ x: wx, y: wy, r: radius, lv: 0 });
  if (hits.length > 400) hits.shift();
}
function wallCrater(wx, wy, power) {
  if (!S.craterMap) S.craterMap = new Map();
  const key = Math.round(wx / 8) * 65536 + Math.round(wy / 8);
  const depth = Math.min(1, (S.craterMap.get(key) || 0) + power / 10);
  S.craterMap.set(key, depth);
  const radius = power * (0.8 + depth * 0.6), pic = !!(shell.backdrop && shell.backdrop());
  const corners = 9 + ((Math.random() * 5) | 0), rad = [], spall = [];
  for (let i = 0; i < corners; i++) { rad.push(rand(0.72, 1.08)); spall.push(rand(1.15, 1.7)); }
  bdPaint(wx, wy, radius * 3.2, (ctx, x, y, rr) => {
    const reach = radius / PX;
    const poly = (k, arr) => { ctx.beginPath(); for (let i = 0; i < corners; i++) { const a = i / corners * TAU + k, q = reach * arr[i]; if (i) ctx.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); else ctx.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } ctx.closePath(); };
    ctx.strokeStyle = `rgba(0,0,0,${(0.45 + depth * 0.3).toFixed(2)})`; ctx.lineWidth = 0.55;
    const nc = 3 + ((Math.random() * (3 + depth * 3)) | 0);
    for (let crack = 0; crack < nc; crack++) {
      let angle = Math.random() * TAU, px = x + Math.cos(angle) * reach * 0.9, py = y + Math.sin(angle) * reach * 0.9;
      const len = reach * rand(1.2, 2.6 + depth * 2);
      ctx.beginPath(); ctx.moveTo(px, py);
      for (let s = 0; s < 5; s++) {
        angle += rand(-0.5, 0.5); px += Math.cos(angle) * len / 5; py += Math.sin(angle) * len / 5; ctx.lineTo(px, py);
        if (s === 2 && Math.random() < 0.4) { const branch = angle + rand(0.5, 1) * (Math.random() < 0.5 ? -1 : 1); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(branch) * len / 4, py + Math.sin(branch) * len / 4); ctx.moveTo(px, py); }
      }
      ctx.stroke();
    }
  });
  wfDig(wx, wy, radius, 0.35 + depth * 0.45, 0.04);
  for (let i = 0; i < 2 + power * 0.4; i++) fxDust(wx, wy, rand(-60, 60), rand(-60, 0), rand(3, 6), rand(0.4, 0.8));
  wallHitsAdd(wx, wy, power * 1.2);
}
