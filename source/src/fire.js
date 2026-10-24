const FZ_MAX = 4;
function fireSeed(block, x, y) {
  if (!block || block.kind === 'word') return;
  if (!block.fz) block.fz = [];
  const ox = clamp(x - block.x, 2, Math.max(2, block.w - 2)), oy = clamp(y - block.y, 2, Math.max(2, block.h - 2));
  for (const zone of block.fz) if (Math.hypot(zone.ox - ox, zone.oy - oy) < zone.r + 8) { zone.rmax = Math.min(zone.rmax * 1.15, zone.cap); zone.life = Math.max(zone.life, rand(2, 4)); return; }
  if (block.fz.length >= FZ_MAX) return;
  const cap = 10 + Math.min(block.w, block.h) * 0.35;
  const kind = pick(['lick', 'lick', 'lick', 'blaze', 'blaze', 'smoulder', 'smoulder']);
  const size = kind === 'blaze' ? rand(0.6, 1) : kind === 'lick' ? rand(0.3, 0.75) : rand(0.15, 0.4);
  block.fz.push({ ox, oy, r: rand(2, 4), rmax: size * cap, cap, kind, life: rand(4, 10) * (kind === 'smoulder' ? 1.5 : 1), age: 0, ph: rand(0, TAU), acc: 0, mark: 0, flare: 0, glow: 0 });
}
function fireZones(block, dt) {
  if (!block.fz || !block.fz.length) {
    if (!block.fz) block.fz = [];
    fireSeed(block, block.x + rand(0.15, 0.85) * block.w, block.y + block.h * rand(0.65, 0.95));
  }
  const k = fxK();
  block.charT = (block.charT || 0) + dt;
  if ((block.charN = (block.charN || 0) - dt) <= 0 && block.el && block.el.style) {
    block.charN = 0.3; const charring = Math.round(Math.min(1, block.charT / 8) * 8) / 8;
    if (charring !== block.charC) { block.charC = charring; block.el.style.filter = `brightness(${(1 - charring * 0.55).toFixed(2)}) sepia(${(charring * 0.6).toFixed(2)})`; }
  }
  for (let i = block.fz.length - 1; i >= 0; i--) {
    const zone = block.fz[i];
    zone.age += dt; zone.life -= dt;
    if (zone.life <= 0) {
      smoulderAt(block.x + zone.ox, block.y + zone.oy, zone.r, rand(4, 8));
      for (let j = 0; j < 3; j++) { const e = fxEmber(block.x + zone.ox + rand(-zone.r, zone.r), block.y + zone.oy + rand(-zone.r, zone.r) * 0.5, 0, 0, rand(3, 7)); e.st = 1; e.sz = rand(1.5, 2.8); }
      block.fz.splice(i, 1); continue;
    }
    const fade = Math.min(1, zone.life / 0.8);
    zone.r = Math.min(zone.rmax, zone.r + dt * rand(3, 9));
    zone.oy = Math.max(2, zone.oy - dt * rand(1, 4));
    if (zone.flare > 0) zone.flare -= dt; else if (Math.random() < (zone.kind === 'smoulder' ? 0.08 : 0.3) * dt) zone.flare = rand(0.3, 0.8);
    const flick = 0.7 + 0.3 * Math.sin(zone.age * 7.3 + zone.ph) * Math.sin(zone.age * 3.1 + zone.ph * 2);
    const radius = zone.r * flick * fade * (zone.flare > 0 ? 1.6 : 1), zx = block.x + zone.ox, zy = block.y + zone.oy;
    if ((zone.glow -= dt) <= 0) { zone.glow = 0.12; fxFire(zx, zy + 1, 0, -6, Math.max(3, radius * 0.9), 0.3); }
    const rate = zone.kind === 'smoulder' ? 1.5 + radius * 0.25 : zone.kind === 'blaze' ? 5 + radius * 0.9 : 3 + radius * 0.5;
    zone.acc += dt * rate * k * (zone.flare > 0 ? 2 : 1);
    while (zone.acc >= 1) {
      zone.acc -= 1;
      const spread = (Math.random() + Math.random() - 1);
      const tall = 1 - Math.abs(spread) * 0.55;
      if (zone.kind !== 'smoulder' && Math.random() < 0.75) {
        fxFire(zx + spread * radius * 0.8, zy + rand(0, 2), rand(-6, 6) + FXC.wind * 0.8, -rand(10, 30), Math.max(2.5, radius * rand(0.22, 0.4) * tall), rand(0.3, 0.6), true);
      } else {
        fxFire(zx + spread * radius * 0.8, zy - rand(0, radius * 0.5), rand(-12, 12) + FXC.wind * 0.5, -rand(40, 90) * (0.6 + radius / 25), Math.max(1.5, radius * rand(0.1, 0.22)), rand(0.2, 0.45));
      }
    }
    if (Math.random() < (zone.kind === 'smoulder' ? 1.4 : 0.5) * dt * k) fxSmoke(zx, zy - radius, rand(-8, 8), -rand(25, 45), 4 + radius * 0.4, rand(1.6, 2.8), true, 'zone');
    if (Math.random() < 2.5 * dt) fxAsh(zx + rand(-radius, radius), zy - radius, rand(-20, 20) + FXC.wind, -rand(30, 80), Math.random() < 0.4);
    if (Math.random() < 0.8 * dt) fxEmber(zx + rand(-radius, radius) * 0.5, zy - radius * 0.5, rand(-20, 20), -rand(30, 70), rand(0.6, 1.4));
    if ((zone.mark -= dt) <= 0) { zone.mark = 0.35; scorch(Math.round((zx + rand(-radius, radius) * 0.4) / PX), Math.round((zy + rand(-radius, radius) * 0.3) / PX)); }
    if (block.fz.length < FZ_MAX && zone.r > zone.rmax * 0.7 && Math.random() < 0.35 * dt) {
      const angle = -Math.PI / 2 + rand(-1.1, 1.1);
      fireSeed(block, zx + Math.cos(angle) * zone.r * 1.4, zy + Math.sin(angle) * zone.r * 1.4);
    }
    if (Math.random() < 0.2 * dt) {
      const nearTop = zone.oy < radius + 4, nearL = zone.ox < radius + 4, nearR = block.w - zone.ox < radius + 4;
      if (nearTop || ((nearL || nearR) && Math.random() < 0.33)) {
        const tx = nearL && !nearTop ? block.x - 6 : nearR && !nearTop ? block.x + block.w + 6 : zx, ty = nearTop ? block.y - 6 : zy;
        const neighbor = blockAt(tx, ty);
        if (neighbor && neighbor !== block && neighbor.alive && neighbor.kind !== 'word') { ignite(neighbor, rand(1.8, 3)); fireSeed(neighbor, tx, ty); }
      }
    }
  }
  if (block.fz.length) block.burn = Math.max(block.burn, 0.2);
  if (block.burn <= dt * 1.5) {
    for (const zone of block.fz) smoulderAt(block.x + zone.ox, block.y + zone.oy, zone.r, rand(2, 4));
    block.fz.length = 0;
  }
}

const FATES = [['out', 0.28], ['burnout', 0.18], ['partial', 0.2], ['drop', 0.16], ['ash', 0.18]];
function fireFate(block, dt) {
  if (!(block.kind === 'media' || materialOf(block) === 'paper')) return false;
  if (block.fate === 'done') return true;
  if (!block.fate) {
    let roll = Math.random(), outcome = 'out';
    for (const [k, w] of FATES) { if ((roll -= w) < 0) { outcome = k; break; } }
    if ((outcome === 'burnout' || outcome === 'partial') && burnouts() >= 4) outcome = Math.random() < 0.5 ? 'out' : 'drop';
    block.fate = outcome; block.fateT = rand(2.5, 10);
    if (outcome === 'burnout' || outcome === 'partial') burnPrebuild(block);
    diagCount('fire.' + outcome);
  }
  if ((block.fateT -= dt) > 0) return true;
  const outcome = block.fate; block.fate = 'done';
  if (outcome === 'out') {
    for (const zone of block.fz || []) {
      const zx = block.x + zone.ox, zy = block.y + zone.oy;
      for (let k = 0; k < 3; k++) scorch(Math.round((zx + rand(-zone.r, zone.r) * 0.6) / PX), Math.round((zy + rand(-zone.r, zone.r) * 0.5) / PX));
      smoulderAt(zx, zy, zone.r, rand(3, 7));
      for (let k = 0; k < 3; k++) fxSmoke(zx + rand(-zone.r, zone.r), zy, rand(-6, 6), -rand(20, 40), rand(5, 9), rand(2.5, 4.5), true, 'out');
    }
    if (block.fz) block.fz.length = 0;
    block.burn = 0; S.burning.delete(block);
    try { block.el.style.filter = 'brightness(' + rand(0.55, 0.8).toFixed(2) + ') sepia(' + rand(0.15, 0.45).toFixed(2) + ')'; } catch (e) { }
    return true;
  }
  block.burn = 0; S.burning.delete(block);
  if (outcome === 'burnout' || outcome === 'partial') { block.forceMode = 'burnout'; block.burnStop = outcome === 'partial' ? rand(0.25, 0.65) : 0; }
  else if (outcome === 'drop') { block.forceMode = Math.random() < 0.5 ? 'drop' : 'hinge'; block.dropFire = rand(2.5, 5); }
  else {
    block.forceMode = 'crumble';
    for (let k = 0; k < 18; k++) fxAsh(block.x + Math.random() * block.w, block.y + Math.random() * block.h, rand(-30, 30), rand(-40, 10), Math.random() < 0.6);
    for (let k = 0; k < 8; k++) fxFire(block.x + Math.random() * block.w, block.y + Math.random() * block.h, rand(-10, 10), -rand(20, 60), rand(4, 9), rand(0.3, 0.7), true);
  }
  const keep = IMP; IMP = { dx: rand(-0.2, 0.2), dy: 0.6, f: 60 };
  destroyBlock(block, false, false);
  IMP = keep;
  return true;
}
