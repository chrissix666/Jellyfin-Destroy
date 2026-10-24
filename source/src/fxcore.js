const FXC = {
  pools: { smoke: [], dust: [], ash: [], fire: [], spark: [], ember: [], shred: [], burst: [] },
  cap: { smoke: 300, dust: 240, ash: 160, fire: 600, spark: 900, ember: 420, shred: 200, burst: 32 },
  free: [], spr: null,
  qual: 'auto', auto: 1, lowS: 0, goodS: 0, secT: 0,
  ms: { upd: 0, back: 0, front: 0 }, long: 0, longLog: [], lastT: 0, frames: 0, tStart: 0, tBack: 0, tEnd: 0, tBackEnd: 0, tFront: 0,
  trauma: 0, wind: 0, windGoal: 0, windT: 0, src: {},
};
const FXQ = { high: 1, medium: 0.6, low: 0.35 };
const SPARK_COLS = ['#fffbe0', '#ffd860', '#ff9a30', '#e0502a'];

function fxMode() { try { const mode = shell.fxQuality && shell.fxQuality(); return mode && (mode === 'auto' || FXQ[mode]) ? mode : 'auto'; } catch (e) { return 'auto'; } }
function fxK() { return FXC.qual === 'auto' ? FXC.auto : FXQ[FXC.qual]; }
function fxReset() {
  for (const k in FXC.pools) { for (const particle of FXC.pools[k]) FXC.free.push(particle); FXC.pools[k].length = 0; }
  FXC.trauma = 0; FXC.src = {}; FXC.long = 0; FXC.longLog.length = 0; FXC.lastT = 0; FXC.qual = fxMode();
}

function fxCanvas(n) { const canvas = document.createElement('canvas'); canvas.width = canvas.height = n; return canvas; }
function fxPuffSprite(rgb, n, blobs, shade) {
  const canvas = fxCanvas(n), x = canvas.getContext('2d');
  for (let k = 0; k < blobs; k++) {
    const cx = n / 2 + rand(-0.17, 0.17) * n, cy = n / 2 + rand(-0.17, 0.17) * n, rr = n * rand(0.2, 0.32);
    const gr = x.createRadialGradient(cx, cy, 0, cx, cy, rr);
    gr.addColorStop(0, `rgba(${rgb},0.5)`); gr.addColorStop(0.55, `rgba(${rgb},0.24)`); gr.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, n, n);
  }
  x.globalCompositeOperation = 'source-atop';
  if (shade) {
    const lg = x.createLinearGradient(n * 0.2, n * 0.2, n * 0.8, n * 0.8);
    lg.addColorStop(0, 'rgba(255,255,255,0.22)'); lg.addColorStop(0.5, 'rgba(255,255,255,0)'); lg.addColorStop(1, 'rgba(0,0,0,0.28)');
    x.fillStyle = lg; x.fillRect(0, 0, n, n);
  }
  for (let k = 0; k < 10; k++) {
    const angle = Math.random() * TAU, dist = Math.random() * n * 0.25, cx = n / 2 + Math.cos(angle) * dist, cy = n / 2 + Math.sin(angle) * dist, rr = n * rand(0.1, 0.18);
    const gr = x.createRadialGradient(cx, cy, 0, cx, cy, rr), tint = Math.random() < 0.5 ? '0,0,0' : '255,255,255';
    gr.addColorStop(0, `rgba(${tint},0.09)`); gr.addColorStop(1, `rgba(${tint},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, n, n);
  }
  return canvas;
}
function fxRadial(n, stops) {
  const canvas = fxCanvas(n), x = canvas.getContext('2d'), gr = x.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
  for (const [offset, col] of stops) gr.addColorStop(offset, col);
  x.fillStyle = gr; x.fillRect(0, 0, n, n);
  return canvas;
}
function fxTongueSprite(w, h, seed) {
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const x = canvas.getContext('2d'), bend = rand(-0.25, 0.25) * w, mid = w / 2;
  const path = (scale) => {
    const bw = w * 0.36 * scale, top = h * (1 - 0.92 * scale) + 2;
    x.beginPath();
    x.moveTo(mid + bend * scale, top);
    x.bezierCurveTo(mid + bw * 0.9 + bend * 0.3, h * 0.42, mid + bw * 1.15, h * 0.78, mid, h - 4);
    x.bezierCurveTo(mid - bw * 1.15, h * 0.78, mid - bw * 0.9 + bend * 0.3, h * 0.42, mid + bend * scale, top);
    x.closePath();
  };
  x.filter = 'blur(2px)';
  let gradient = x.createLinearGradient(0, h, 0, 0);
  gradient.addColorStop(0, 'rgba(255,120,30,0.95)'); gradient.addColorStop(0.45, 'rgba(255,90,20,0.7)'); gradient.addColorStop(1, 'rgba(200,40,10,0)');
  path(1); x.fillStyle = gradient; x.fill();
  gradient = x.createLinearGradient(0, h, 0, 0);
  gradient.addColorStop(0, 'rgba(255,250,220,1)'); gradient.addColorStop(0.35, 'rgba(255,215,100,0.9)'); gradient.addColorStop(1, 'rgba(255,160,40,0)');
  path(0.6); x.fillStyle = gradient; x.fill();
  x.filter = 'none';
  return canvas;
}
function fxBake() {
  const sprites = {};
  sprites.smokeL = []; sprites.smokeD = []; sprites.dust = [];
  for (let i = 0; i < 6; i++) { sprites.smokeL.push(fxPuffSprite('168,166,176', 96, 7, true)); sprites.smokeD.push(fxPuffSprite('64,62,70', 96, 7, true)); }
  for (let i = 0; i < 4; i++) sprites.dust.push(fxPuffSprite('128,118,108', 64, 5, false));
  sprites.hot = fxRadial(64, [[0, 'rgba(255,250,220,1)'], [0.35, 'rgba(255,200,90,0.75)'], [0.7, 'rgba(255,120,30,0.25)'], [1, 'rgba(255,120,30,0)']]);
  sprites.cool = fxRadial(64, [[0, 'rgba(255,190,80,0.9)'], [0.35, 'rgba(240,100,30,0.6)'], [0.7, 'rgba(180,40,20,0.2)'], [1, 'rgba(180,40,20,0)']]);
  sprites.disc = fxRadial(64, [[0, 'rgba(255,255,255,1)'], [0.6, 'rgba(255,255,240,0.9)'], [0.85, 'rgba(255,240,200,0.35)'], [1, 'rgba(255,240,200,0)']]);
  sprites.tongue = [];
  for (let i = 0; i < 5; i++) sprites.tongue.push(fxTongueSprite(48, 128, i));
  sprites.glow = fxRadial(64, [[0, 'rgba(255,150,60,0.5)'], [1, 'rgba(255,150,60,0)']]);
  FXC.spr = sprites;
}

function fxNew(kind) {
  const pool = FXC.pools[kind];
  let particle;
  if (pool.length >= FXC.cap[kind]) {
    let bi = 0, bk = 2;
    for (let k = 0; k < 8; k++) { const i = (Math.random() * pool.length) | 0, candidate = pool[i], lifeLeft = candidate.life / candidate.max; if (lifeLeft < bk) { bk = lifeLeft; bi = i; } }
    particle = pool[bi];
  } else { particle = FXC.free.pop() || {}; pool.push(particle); }
  particle.age = 0; particle.rot = 0; particle.spin = 0; particle.b = 0; particle.g = 0; particle.col = null; particle.wisp = 0; particle.st = 0; particle.tg = null;
  return particle;
}
function fxSmoke(x, y, vx, vy, radius, life, dark, tag) {
  FXC.src[tag || '?'] = (FXC.src[tag || '?'] || 0) + 1;
  const particle = fxNew('smoke'), set = dark ? FXC.spr.smokeD : FXC.spr.smokeL;
  particle.x = x; particle.y = y; particle.vx = vx; particle.vy = vy; particle.r0 = radius; particle.grow = 1.4; particle.life = particle.max = life; particle.a0 = dark ? 0.42 : 0.36;
  particle.img = set[(Math.random() * set.length) | 0]; particle.rot = Math.random() * TAU; particle.spin = rand(-1.5, 1.5);
  return particle;
}
function fxDust(x, y, vx, vy, radius, life) {
  const particle = fxNew('dust'), set = FXC.spr.dust;
  particle.x = x; particle.y = y; particle.vx = vx * 0.6; particle.vy = vy * 0.6; particle.r0 = radius * 1.8; particle.grow = 2.6; particle.life = particle.max = life * 1.4; particle.a0 = 0.2;
  particle.img = set[(Math.random() * set.length) | 0]; particle.rot = Math.random() * TAU; particle.spin = rand(-2, 2);
  return particle;
}
function fxFire(x, y, vx, vy, radius, life, tongue) {
  const particle = fxNew('fire');
  particle.x = x; particle.y = y; particle.vx = vx; particle.vy = vy; particle.r0 = radius; particle.life = particle.max = life;
  if (tongue) { if (!FXC.spr) fxBake(); particle.tg = FXC.spr.tongue[(Math.random() * FXC.spr.tongue.length) | 0]; particle.asp = rand(2, 3.6); particle.ph = Math.random() * TAU; }
  return particle;
}
function fxSpark(x, y, vx, vy, life, col, gravity) {
  const particle = fxNew('spark');
  particle.x = x; particle.y = y; particle.vx = vx; particle.vy = vy; particle.life = particle.max = life; particle.col = col || null; particle.g = gravity ? 1 : 0;
  return particle;
}
function fxAsh(x, y, vx, vy, glow) {
  const particle = fxNew('ash');
  particle.x = x; particle.y = y; particle.vx = vx; particle.vy = vy; particle.life = particle.max = rand(3, 8); particle.sz = rand(1.5, 3.5); particle.rot = Math.random() * TAU; particle.spin = rand(-6, 6); particle.ph = Math.random() * TAU; particle.gl = glow ? 1 : 0;
  return particle;
}
function fxFlash(x, y, startRadius, endRadius, life) {
  const particle = fxNew('burst');
  particle.x = x; particle.y = y; particle.r = startRadius; particle.R = endRadius; particle.life = particle.max = life;
  return particle;
}

function fxAdopt(list) {
  if (!FXC.spr) fxBake();
  const k = fxK();
  let j = 0;
  for (let i = 0; i < list.length; i++) {
    const particle = list[i];
    switch (particle.t) {
      case 'smoke':
        if (Math.random() < k) {
          if (particle.max <= 0.7) fxDust(particle.x, particle.y, particle.vx, particle.vy, (particle.s || 5) * 1.1, particle.life * 1.4);
          else fxSmoke(particle.x, particle.y, particle.vx, particle.vy, (particle.s || 5) * 1.2, particle.life * 1.3, false, 'adopt');
        }
        continue;
      case 'fire': if (Math.random() < k) fxFire(particle.x, particle.y, particle.vx, particle.vy, particle.s || 4, particle.life); continue;
      case 'flash': fxFlash(particle.x, particle.y, particle.r, particle.R, particle.max); continue;
      case 'spark': if (Math.random() < Math.max(0.5, k)) fxSpark(particle.x, particle.y, particle.vx, particle.vy, particle.life, particle.col, particle.g); continue;
    }
    list[j++] = particle;
  }
  list.length = j;
}

function fxUpdate(dt) {
  const t0 = performance.now();
  if (!FXC.spr) fxBake();
  if ((FXC.windT -= dt) <= 0) { FXC.windT = rand(3, 7); FXC.windGoal = rand(-14, 14); }
  FXC.wind += (FXC.windGoal - FXC.wind) * Math.min(1, dt * 0.5);
  fxRunQueue(dt);
  const floor = S.worldH - 3;
  for (const kind in FXC.pools) {
    const pool = FXC.pools[kind];
    for (let i = pool.length - 1; i >= 0; i--) {
      const particle = pool[i];
      particle.life -= dt; particle.age += dt;
      if (particle.life <= 0) {
        pool[i] = pool[pool.length - 1]; pool.pop(); FXC.free.push(particle);
        if (kind === 'spark' && Math.random() < 0.05) fxEmber(particle.x, particle.y, particle.vx * 0.1, -20, rand(0.8, 2));
        continue;
      }
      if (kind === 'burst') continue;
      if (kind === 'smoke') { particle.vx += (FXC.wind - particle.vx) * 0.6 * dt; particle.vy = particle.vy * (1 - 0.6 * dt) - 28 * dt; particle.rot += particle.spin * dt; }
      else if (kind === 'dust') { particle.vx *= 1 - 3 * dt; particle.vy = particle.vy * (1 - 3 * dt) + 10 * dt; particle.rot += particle.spin * dt; }
      else if (kind === 'fire') { particle.vx *= 1 - 3 * dt; particle.vy = particle.vy * (1 - 3 * dt) - 60 * dt; }
      else if (kind === 'spark') {
        particle.vy += (particle.g ? 1500 : 800) * dt; particle.vx *= 1 - 1.2 * dt;
        if (!particle.b && particle.y > floor && particle.vy > 0) {
          particle.b = 1; particle.vy *= -0.4; particle.vx *= 0.6;
          if (particle.life > 0.12 && Math.random() < fxK()) for (let j = 0; j < 2; j++) fxSpark(particle.x, floor, particle.vx * rand(0.3, 0.8) + rand(-60, 60), particle.vy * rand(0.4, 0.9), particle.life * 0.5, particle.col, 0).b = 1;
        }
      }
      else if (kind === 'ash') {
        particle.vx += (FXC.wind - particle.vx) * 0.8 * dt + Math.sin(particle.age * 4 + particle.ph) * 30 * dt; particle.vy = particle.vy * (1 - 1.2 * dt) + 18 * dt; particle.rot += particle.spin * dt;
      }
      else if (kind === 'ember') { if (particle.st) continue; particle.vx = particle.vx * (1 - 1.5 * dt) + Math.sin(particle.age * 3 + particle.ph) * 40 * dt; particle.vy = particle.vy * (1 - 1.5 * dt) - 22 * dt; }
      particle.x += particle.vx * dt; particle.y += particle.vy * dt;
    }
  }
  const now = performance.now();
  if (now - FXC.secT >= 1000) {
    FXC.secT = now; FXC.qual = fxMode();
    const fxMs = FXC.ms.upd + FXC.ms.back + FXC.ms.front;
    if (FXC.qual === 'auto' && JU.fps) {
      if (JU.fps < 50 && fxMs <= 2.5 && FXC.dprAuto > 1 && ++FXC.lowS >= 3) { FXC.lowS = 0; FXC.dprAuto = 1; layoutStage(); }
      if (JU.fps < 55 && fxMs > 2.5) { FXC.goodS = 0; if (++FXC.lowS >= 2) { FXC.lowS = 0; FXC.auto = Math.max(0.4, FXC.auto * 0.7); diag('fx', 'qualityDown', 'info', { auto: +FXC.auto.toFixed(2), fps: JU.fps, fxMs: +fxMs.toFixed(1) }); } }
      else { FXC.lowS = 0; if (JU.fps >= 59 && ++FXC.goodS >= 5 && FXC.auto < 1) { FXC.goodS = 0; FXC.auto = Math.min(1, FXC.auto + 0.1); diag('fx', 'qualityUp', 'debug', { auto: +FXC.auto.toFixed(2) }); } }
    }
  }
  FXC.ms.upd = FXC.ms.upd * 0.9 + (now - t0) * 0.1;
}

function fxFrameMark(now) {
  const gap = FXC.lastT ? now - FXC.lastT : 0;
  const upd = FXC.tBack - FXC.tStart, draw = FXC.tEnd - FXC.tBack, mid = FXC.tFront - FXC.tBackEnd, fr = FXC.tEnd - FXC.tFront, bk = FXC.tBackEnd - FXC.tBack;
  FXC.lastT = now; FXC.tStart = now; FXC.frames++;
  if (window.__djProf) fxProfFrame();
  if (gap > 25 && gap < 1000) {
    FXC.long++;
    if (FXC.longLog.length >= 12) FXC.longLog.shift();
    FXC.longLog.push({ ms: Math.round(gap), t: S && S.stats ? +S.stats.time.toFixed(1) : 0, n: fxCounts(), ms3: [+FXC.ms.upd.toFixed(2), +FXC.ms.back.toFixed(2), +FXC.ms.front.toFixed(2)], game: +upd.toFixed(1), draw: +draw.toFixed(1), parts: [+bk.toFixed(1), +mid.toFixed(1), +fr.toFixed(1)], browser: +(gap - Math.max(0, upd) - Math.max(0, draw)).toFixed(1) });
    if (gap > 50) diagAnomaly('perf', 'longFrame', gap > 200 ? '>200ms' : gap > 100 ? '100-200ms' : '50-100ms', FXC.longLog[FXC.longLog.length - 1], gap > 200);
  }
}

function fxShake(dt) {
  if (S.cam.shake > 0) { FXC.trauma = Math.max(FXC.trauma, Math.min(1, S.cam.shake / 10)); S.cam.shake = 0; }
  FXC.trauma = Math.max(0, FXC.trauma - 2.2 * dt);
  return 5 * FXC.trauma * FXC.trauma;
}

function fxPuffs(ctx, pool, vx, vy, scale) {
  for (let i = 0; i < pool.length; i++) {
    const particle = pool[i], lr = particle.age / (particle.age + particle.life);
    const radius = Math.min(120, particle.r0 * (1 + particle.grow * (1 - (1 - lr) * (1 - lr))));
    const x = particle.x - vx, y = particle.y - vy;
    if (x < -radius || y < -radius || x > S.VW + radius || y > S.VH + radius) continue;
    const alpha = particle.a0 * Math.min(1, lr * 10) * Math.min(1, (1 - lr) / 0.4);
    if (alpha < 0.01) continue;
    ctx.globalAlpha = alpha;
    const rotCos = Math.cos(particle.rot) * scale, rotSin = Math.sin(particle.rot) * scale;
    ctx.setTransform(rotCos, rotSin, -rotSin, rotCos, x * scale, y * scale);
    ctx.drawImage(particle.img, -radius, -radius, radius * 2, radius * 2);
  }
}
function fxBack(ctx, vx, vy) {
  const t0 = performance.now();
  FXC.tBack = t0;
  if (!FXC.spr) fxBake();
  const scale = S.dpr;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  fxPuffs(ctx, FXC.pools.dust, vx, vy, scale);
  fxPuffs(ctx, FXC.pools.smoke, vx, vy, scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  for (const particle of FXC.pools.ash) {
    const x = particle.x - vx, y = particle.y - vy;
    if (x < -10 || y < -10 || x > S.VW + 10 || y > S.VH + 10) continue;
    const alpha = Math.min(1, particle.life / 1.2), k = particle.life / particle.max, size = Math.max(0.7, particle.sz * 0.45);
    if (particle.gl && k > 0.45) {
      const hot = (k - 0.45) / 0.55;
      ctx.globalAlpha = alpha * 0.35 * hot; ctx.drawImage(FXC.spr.glow, x - 3, y - 3, 6, 6);
      ctx.globalAlpha = alpha; ctx.fillStyle = hot > 0.5 ? '#ff9a3a' : '#a8341a';
    } else { ctx.globalAlpha = alpha * 0.7; ctx.fillStyle = (particle.ph | 0) % 2 ? '#1c1916' : '#2e2924'; }
    ctx.beginPath(); ctx.ellipse(x, y, size, size * 0.8, particle.ph, 0, TAU); ctx.fill();
  }
  ctx.restore();
  FXC.tBackEnd = performance.now();
  FXC.ms.back = FXC.ms.back * 0.9 + (FXC.tBackEnd - t0) * 0.1;
}
function fxFront(ctx, vx, vy) {
  const t0 = performance.now();
  FXC.tFront = t0;
  if (!FXC.spr) fxBake();
  const scale = S.dpr, SP = FXC.spr;
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.globalCompositeOperation = 'lighter';
  for (const particle of FXC.pools.burst) {
    const t = 1 - particle.life / particle.max, burstRadius = lerp(particle.r, particle.R, Math.sqrt(t)), x = particle.x - vx, y = particle.y - vy;
    if (x < -burstRadius * 2 || y < -burstRadius * 2 || x > S.VW + burstRadius * 2 || y > S.VH + burstRadius * 2) continue;
    ctx.globalAlpha = Math.pow(1 - t, 1.2);
    ctx.drawImage(SP.hot, x - burstRadius * 1.2, y - burstRadius * 1.2, burstRadius * 2.4, burstRadius * 2.4);
    ctx.globalAlpha = 0.5 * (1 - t);
    ctx.drawImage(SP.glow, x - burstRadius * 2.2, y - burstRadius * 2.2, burstRadius * 4.4, burstRadius * 4.4);
    if (t < 0.3) { ctx.globalAlpha = 1 - t / 0.3; ctx.drawImage(SP.disc, x - burstRadius * 0.7, y - burstRadius * 0.7, burstRadius * 1.4, burstRadius * 1.4); }
  }
  ctx.globalCompositeOperation = 'lighter';
  for (const pr of S.projectiles) {
    if (pr.t !== 'flame') continue;
    const alpha = clamp(pr.life / pr.max, 0, 1), radius = 9 + (1 - alpha) * 26, x = pr.x - vx, y = pr.y - vy;
    if (x < -radius || y < -radius || x > S.VW + radius || y > S.VH + radius) continue;
    ctx.globalAlpha = Math.min(1, alpha * 1.8) * 0.55;
    ctx.drawImage(alpha > 0.55 ? SP.hot : SP.cool, x - radius, y - radius, radius * 2, radius * 2);
    if (alpha > 0.7) { ctx.globalAlpha = (alpha - 0.7) * 1.6; ctx.drawImage(SP.disc, x - radius * 0.35, y - radius * 0.35, radius * 0.7, radius * 0.7); }
  }
  ctx.globalCompositeOperation = 'source-over';
  for (const particle of FXC.pools.fire) {
    if (particle.tg) {
      const alpha = particle.life / particle.max, radius = particle.r0 * (0.6 + alpha * 0.6), x = particle.x - vx, y = particle.y - vy, hh = radius * particle.asp * (0.85 + 0.15 * Math.sin(particle.age * 21 + particle.ph));
      if (x < -radius * 2 || y < -hh || x > S.VW + radius * 2 || y > S.VH + radius) continue;
      const lean = clamp(particle.vx / 140, -0.5, 0.5), rotCos = Math.cos(lean) * scale, rotSin = Math.sin(lean) * scale;
      ctx.globalAlpha = Math.min(1, alpha * 2.2) * 0.9;
      ctx.setTransform(rotCos, rotSin, -rotSin, rotCos, x * scale, y * scale);
      ctx.drawImage(particle.tg, -radius, -hh, radius * 2, hh);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      continue;
    }
    const alpha = particle.life / particle.max, radius = particle.r0 * (0.5 + alpha * 0.9) * 1.6, x = particle.x - vx, y = particle.y - vy;
    if (x < -radius || y < -radius * 2 || x > S.VW + radius || y > S.VH + radius) continue;
    ctx.globalAlpha = Math.min(1, alpha * 1.6) * 0.85;
    ctx.drawImage(alpha > 0.5 ? SP.hot : SP.cool, x - radius, y - radius * 1.6, radius * 2, radius * 2.6);
  }
  for (const particle of FXC.pools.ember) {
    const x = particle.x - vx, y = particle.y - vy;
    if (x < -10 || y < -10 || x > S.VW + 10 || y > S.VH + 10) continue;
    const alpha = Math.min(1, particle.life / 0.6) * (0.55 + 0.45 * Math.sin(particle.age * 14 + particle.ph));
    if (!particle.st) { ctx.globalAlpha = alpha * 0.5; ctx.drawImage(SP.glow, x - 5, y - 5, 10, 10); }
    else { ctx.globalAlpha = alpha * 0.28; ctx.drawImage(SP.glow, x - 3.5, y - 3.5, 7, 7); }
    const k = particle.life / particle.max;
    ctx.globalAlpha = alpha; ctx.fillStyle = k > 0.6 ? '#ffd27a' : k > 0.3 ? '#ff8a3a' : '#b83a1c';
    ctx.beginPath(); ctx.arc(x, y, Math.max(0.6, particle.sz * 0.5), 0, TAU); ctx.fill();
  }
  const Pk = FXC.pools.spark;
  ctx.globalAlpha = 1; ctx.lineCap = 'round';
  for (let shade = 0; shade < 4; shade++) {
    ctx.beginPath(); let any = false;
    for (let i = 0; i < Pk.length; i++) {
      const particle = Pk[i];
      if (particle.col) continue;
      const alpha = particle.life / particle.max;
      if ((alpha > 0.7 ? 0 : alpha > 0.45 ? 1 : alpha > 0.2 ? 2 : 3) !== shade) continue;
      const x = particle.x - vx, y = particle.y - vy;
      if (x < -20 || y < -20 || x > S.VW + 20 || y > S.VH + 20) continue;
      ctx.moveTo(x - particle.vx * 0.022, y - particle.vy * 0.022); ctx.lineTo(x, y); any = true;
    }
    if (any) { ctx.strokeStyle = SPARK_COLS[shade]; ctx.lineWidth = shade ? 1.3 : 1.7; ctx.stroke(); }
  }
  let cols = null;
  for (let i = 0; i < Pk.length; i++) if (Pk[i].col) (cols || (cols = new Map())).set(Pk[i].col, 1);
  if (cols) for (const col of cols.keys()) {
    ctx.beginPath();
    for (let i = 0; i < Pk.length; i++) {
      const particle = Pk[i];
      if (particle.col !== col) continue;
      const x = particle.x - vx, y = particle.y - vy;
      if (x < -20 || y < -20 || x > S.VW + 20 || y > S.VH + 20) continue;
      ctx.moveTo(x - particle.vx * 0.022, y - particle.vy * 0.022); ctx.lineTo(x, y);
    }
    ctx.strokeStyle = col; ctx.lineWidth = 1.3; ctx.stroke();
  }
  ctx.restore();
  FXC.tEnd = performance.now();
  FXC.ms.front = FXC.ms.front * 0.9 + (FXC.tEnd - t0) * 0.1;
}

function fxCounts() { const counts = {}; for (const k in FXC.pools) counts[k] = FXC.pools[k].length; return counts; }
function fxStats() {
  return { pools: fxCounts(), ms: { upd: +FXC.ms.upd.toFixed(2), back: +FXC.ms.back.toFixed(2), front: +FXC.ms.front.toFixed(2) },
    quality: FXC.qual, k: +fxK().toFixed(2), frames: FXC.frames, longFrames: FXC.long, longLog: FXC.longLog.slice(-6), trauma: +FXC.trauma.toFixed(2), smokeBy: FXC.src, prof: window.__djProf ? Object.fromEntries(Object.entries(FXC.prof).map(([k, v]) => [k, [+v.avg.toFixed(2), +v.max.toFixed(1)]])) : null,
    materials: typeof materialCounts === 'function' ? materialCounts() : null, dups: dupCheck() };
}

FXC.queue = []; FXC.time = 0; FXC.words = [];
function fxLater(sec, fn) { if (FXC.queue.length < 64) FXC.queue.push({ at: FXC.time + sec, fn }); }
function fxRunQueue(dt) {
  FXC.time += dt;
  for (let i = FXC.queue.length - 1; i >= 0; i--) {
    const job = FXC.queue[i];
    if (job.at <= FXC.time) { FXC.queue.splice(i, 1); try { job.fn(); } catch (e) { } }
  }
}
const fxN = (n) => Math.max(1, Math.round(n * fxK()));

function fxWispSprite(n) {
  const canvas = fxCanvas(n), x = canvas.getContext('2d');
  x.filter = 'blur(2px)';
  x.strokeStyle = 'rgba(176,174,184,0.55)'; x.lineCap = 'round';
  x.lineWidth = n * rand(0.07, 0.11);
  const startAngle = rand(0, TAU), radius = n * 0.26;
  x.beginPath();
  x.arc(n / 2, n / 2, radius, startAngle, startAngle + rand(2.2, 3.6));
  x.quadraticCurveTo(n / 2 + rand(-radius, radius), n / 2 + rand(-radius, radius), n / 2 + rand(-radius, radius) * 0.4, n / 2 + rand(-radius, radius) * 0.4);
  x.stroke();
  x.filter = 'none';
  return canvas;
}
function fxCurls(particle) {
  if (!FXC.spr.wisp) { FXC.spr.wisp = []; for (let i = 0; i < 4; i++) FXC.spr.wisp.push(fxWispSprite(64)); }
  const radius = Math.min(120, particle.r0 * (1 + particle.grow)), n = 2 + (Math.random() < 0.4 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    const curl = fxNew('smoke');
    curl.x = particle.x + rand(-radius, radius) * 0.5; curl.y = particle.y + rand(-radius, radius) * 0.4; curl.vx = particle.vx + rand(-12, 12); curl.vy = particle.vy - rand(4, 14);
    curl.r0 = radius * rand(0.35, 0.55); curl.grow = 0.6; curl.life = curl.max = rand(0.7, 1.2); curl.a0 = 0.3; curl.wisp = 1;
    curl.img = FXC.spr.wisp[(Math.random() * 4) | 0]; curl.rot = Math.random() * TAU; curl.spin = rand(-1, 1);
  }
}

function fxEmber(x, y, vx, vy, life) {
  const particle = fxNew('ember');
  particle.x = x; particle.y = y; particle.vx = vx; particle.vy = vy; particle.life = particle.max = life; particle.ph = Math.random() * TAU; particle.sz = rand(1, 2.2);
  return particle;
}

function fxSparkJets(x, y, n, speed, upBias, col) {
  const jets = 2 + ((Math.random() * 3) | 0), dirs = [];
  for (let j = 0; j < jets; j++) dirs.push(-Math.PI / 2 + rand(-1.6, 1.6) * (1 - upBias * 0.5));
  for (let i = 0; i < n; i++) {
    const angle = dirs[i % jets] + rand(-0.22, 0.22), velocity = speed * rand(0.5, 1.1);
    fxSpark(x, y, Math.cos(angle) * velocity, Math.sin(angle) * velocity, rand(0.35, 0.8), col, 0);
  }
}
function fxSparkHalo(x, y, n, radius) {
  for (let i = 0; i < n; i++) { const angle = Math.random() * TAU, speed = radius * rand(4, 7); fxSpark(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, rand(0.12, 0.25), null, 0); }
}

const FX_WORDS = {
  RPG: ['KA-BOOM!', 'BOOM!', 'KRAKOOM!'], MISSILES: ['WHOOMP!', 'KRAKOOM!', 'FOOM!'], GRENADE: ['BLAM!', 'KA-BLAM!', 'BOOM!'],
  POD: ['FOOM!', 'KA-BLAM!'], _: ['BOOM!', 'KABOOM!', 'BLAMMO!', 'KA-POW!'],
};
function fxClass(radius) { return radius < 40 ? 0 : radius < 80 ? 1 : radius < 130 ? 2 : 3; }
function fxExplode(x, y, radius, wn, visualOnly) {
  if (!FXC.spr) fxBake();
  const tier = fxClass(radius), vol = volAt(x, y);
  fxFlash(x, y, radius * 0.3, radius * 1.1, 0.25);
  const nb = fxN([3, 6, 9, 12][tier]);
  for (let i = 0; i < nb; i++) {
    const angle = Math.random() * TAU, dist = radius * rand(0.05, 0.5), bx = x + Math.cos(angle) * dist, by = y + Math.sin(angle) * dist * 0.8;
    fxFire(bx, by, Math.cos(angle) * rand(20, 90), Math.sin(angle) * rand(20, 70) - rand(30, 90), radius * rand(0.16, 0.28) * (1 - dist / radius * 0.5), rand(0.3, 0.55));
    if (i % 2 === 0) fxSmoke(bx, by, Math.cos(angle) * 30, -rand(20, 50), radius * rand(0.18, 0.28), rand(1.0, 1.8), true, 'blast');
  }
  fxSparkJets(x, y, fxN([12, 24, 40, 60][tier]), 260 + radius * 3, 0.6);
  fxSparkHalo(x, y, fxN([4, 8, 14, 20][tier]), radius);
  const nd = fxN([4, 8, 12, 16][tier]);
  for (let i = 0; i < nd; i++) { const speed = (i % 2 ? 1 : -1) * rand(120, 260 + radius * 2); fxDust(x + rand(-10, 10), y + radius * 0.3, speed, -rand(10, 50), rand(6, 12) + radius * 0.08, rand(0.5, 0.9)); }
  const ns = fxN([3, 5, 8, 10][tier]);
  fxLater(0.18, () => { for (let i = 0; i < ns; i++) fxSmoke(x + rand(-radius, radius) * 0.4, y - rand(0, radius * 0.6), rand(-20, 20), -rand(25, 60), radius * rand(0.22, 0.34) + 6, rand(2.6, 4.6), Math.random() < 0.35, 'column'); });
  const ne = fxN([2, 5, 10, 16][tier]);
  for (let i = 0; i < ne; i++) { const angle = Math.random() * TAU, speed = rand(40, 200); fxEmber(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 80, rand(1, 2 + tier)); }
  if (visualOnly) return;
  const aftershocks = tier === 2 ? 1 + (Math.random() < 0.5 ? 1 : 0) : tier === 3 ? 2 + (Math.random() < 0.5 ? 1 : 0) : (tier === 1 && Math.random() < 0.35 ? 1 : 0);
  for (let i = 0; i < aftershocks; i++) fxLater(rand(0.2, 0.8), () => { const angle = Math.random() * TAU, dist = radius * rand(0.4, 0.9); fxExplode(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist * 0.7, radius * rand(0.25, 0.4), wn, true); Sound.play('hit', vol * 0.5); });
  if (tier >= 2) {
    const now = performance.now();
    FXC.words = FXC.words.filter((t) => now - t < 1900);
    if (FXC.words.length < 3 && Math.random() < 0.7) {
      const key = Object.keys(FX_WORDS).find((k) => k !== '_' && String(wn || '').toUpperCase().includes(k)) || '_';
      FXC.words.push(now); popText(pick(FX_WORDS[key]), x, y - radius * 0.8, 'streak', tier === 3);
    }
  }
  FXC.trauma = Math.max(FXC.trauma, [0.15, 0.3, 0.5, 0.7][tier] * vol);
}

function fxTrail(pr) {
  const big = pr.t === 'rocket', step = big ? 22 : 16, bx = pr.x - Math.cos(pr.ang) * 8, by = pr.y - Math.sin(pr.ang) * 8;
  if (pr.trX === undefined) { pr.trX = bx; pr.trY = by; }
  let dist = Math.hypot(bx - pr.trX, by - pr.trY);
  while (dist >= step) {
    const t = step / dist; pr.trX += (bx - pr.trX) * t; pr.trY += (by - pr.trY) * t; dist -= step;
    if (Math.random() < fxK()) fxSmoke(pr.trX, pr.trY, rand(-8, 8), -rand(4, 14), big ? 6 : 4, big ? rand(0.9, 1.3) : rand(0.6, 0.9), false, 'trail').grow = 1.6;
  }
  fxFire(bx, by, -pr.vx * 0.1, -pr.vy * 0.1, big ? 4 : 3, 0.09);
}

FXC.dprAuto = 1;
function fxDprCap() {
  if (typeof window.__djDpr === 'number') return window.__djDpr;
  const mode = fxMode();
  return mode === 'high' ? 2 : mode === 'medium' ? 1.5 : mode === 'low' ? 1 : FXC.dprAuto;
}

FXC.prof = {}; FXC.profFrame = {};
function fxProfWrap(name, fn) {
  return function () {
    if (!window.__djProf) return fn.apply(this, arguments);
    const t0 = performance.now();
    try { return fn.apply(this, arguments); } finally { FXC.profFrame[name] = (FXC.profFrame[name] || 0) + performance.now() - t0; }
  };
}
function fxProfFrame() {
  for (const k in FXC.profFrame) {
    const spent = FXC.profFrame[k], stat = FXC.prof[k] || (FXC.prof[k] = { avg: 0, max: 0, n: 0 });
    stat.avg = stat.avg * 0.97 + spent * 0.03; stat.max = Math.max(stat.max * 0.995, spent); stat.n++;
    FXC.profFrame[k] = 0;
  }
}
try { updateMe = fxProfWrap('updateMe', updateMe); } catch (e) { }
try { updateProjectiles = fxProfWrap('updateProjectiles', updateProjectiles); } catch (e) { }
try { updateBurning = fxProfWrap('updateBurning', updateBurning); } catch (e) { }
try { updateParticles = fxProfWrap('updateParticles', updateParticles); } catch (e) { }
try { updateWords = fxProfWrap('updateWords', updateWords); } catch (e) { }
try { updateDebris = fxProfWrap('updateDebris', updateDebris); } catch (e) { }
try { updateSlabs = fxProfWrap('updateSlabs', updateSlabs); } catch (e) { }
try { updateSmoulder = fxProfWrap('updateSmoulder', updateSmoulder); } catch (e) { }
try { updateJuice = fxProfWrap('updateJuice', updateJuice); } catch (e) { }
try { updateCamera = fxProfWrap('updateCamera', updateCamera); } catch (e) { }
try { render = fxProfWrap('render', render); } catch (e) { }
try { updateHud = fxProfWrap('updateHud', updateHud); } catch (e) { }
try { drawDebris = fxProfWrap('drawDebris', drawDebris); } catch (e) { }
try { drawParticles = fxProfWrap('drawParticles', drawParticles); } catch (e) { }
try { drawProjectiles = fxProfWrap('drawProjectiles', drawProjectiles); } catch (e) { }
try { drawWords = fxProfWrap('drawWords', drawWords); } catch (e) { }
try { drawSlabsHi = fxProfWrap('drawSlabsHi', drawSlabsHi); } catch (e) { }
try { drawDebrisHi = fxProfWrap('drawDebrisHi', drawDebrisHi); } catch (e) { }
try { drawLights = fxProfWrap('drawLights', drawLights); } catch (e) { }
try { drawHiGuns = fxProfWrap('drawHiGuns', drawHiGuns); } catch (e) { }
try { drawPops = fxProfWrap('drawPops', drawPops); } catch (e) { }
try { botTick = fxProfWrap('botTick', botTick); } catch (e) { }
try { damageBlock = fxProfWrap('damageBlock', damageBlock); } catch (e) { }
try { destroyBlock = fxProfWrap('destroyBlock', destroyBlock); } catch (e) { }
try { slabCut = fxProfWrap('slabCut', slabCut); } catch (e) { }
try { drawBurnout = fxProfWrap('drawBurnout', drawBurnout); } catch (e) { }
try { burnTick = fxProfWrap('burnTick', burnTick); } catch (e) { }
try { breakFancy = fxProfWrap('breakFancy', breakFancy); } catch (e) { }
try { holeJagged = fxProfWrap('holeJagged', holeJagged); } catch (e) { }
try { shardSlab = fxProfWrap('shardSlab', shardSlab); } catch (e) { }
try { debrisCut = fxProfWrap('debrisCut', debrisCut); } catch (e) { }
try { wallCrater = fxProfWrap('wallCrater', wallCrater); } catch (e) { }
try { spawnDebris = fxProfWrap('spawnDebris', spawnDebris); } catch (e) { }
try { fireZones = fxProfWrap('fireZones', fireZones); } catch (e) { }
try { breakSource = fxProfWrap('breakSource', breakSource); } catch (e) { }
try { bgSource = fxProfWrap('bgSource', bgSource); } catch (e) { }
try { juiceDestroyed = fxProfWrap('juiceDestroyed', juiceDestroyed); } catch (e) { }
try { holeCircle = fxProfWrap('holeCircle', holeCircle); } catch (e) { }
