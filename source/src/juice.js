const JU = { stop: 0, slow: 0, slowK: 1, lights: [], embers: [], fall: [], special: 0, credits: false, fps: 0, frames: 0, t0: 0 };

function juiceDt(dt) {
  JU.frames++;
  const now = performance.now();
  fxFrameMark(now);
  if (now - JU.t0 > 1000) { JU.fps = Math.round(JU.frames * 1000 / (now - JU.t0)); JU.frames = 0; JU.t0 = now; }
  if (JU.stop > 0) { JU.stop -= dt; return dt * 0.04; }
  if (JU.slow > 0) { JU.slow -= dt; return dt * JU.slowK; }
  return dt;
}
function hitStop(sec, shake) {
  JU.stop = Math.min(0.12, Math.max(JU.stop, sec * 0.7));
  if (shake && S && S.cam) S.cam.shake = Math.min(8, S.cam.shake + shake * 0.35);
}
function bulletTime(sec, k) {
  if (JU.slow > 0) return;
  JU.slow = sec; JU.slowK = k || 0.35;
  if (S && S.me) popText(pick(['BULLET TIME', 'SLOW-MO', 'WHOA.']), S.me.x, S.me.y - 130, 'streak', true);
}

function juLight(x, y, radius, col, life) {
  if (JU.lights.length > 40) JU.lights.shift();
  JU.lights.push({ x, y, r: radius, col, life, max: life });
}
function drawLights(ctx, vx, vy) {
  if (!JU.lights.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const light of JU.lights) {
    const alpha = light.life / light.max, x = light.x - vx, y = light.y - vy;
    if (x < -light.r || y < -light.r || x > S.VW + light.r || y > S.VH + light.r) continue;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, light.r);
    glow.addColorStop(0, light.col.replace('A', (0.42 * alpha).toFixed(3)));
    glow.addColorStop(1, light.col.replace('A', '0'));
    ctx.fillStyle = glow; ctx.fillRect(x - light.r, y - light.r, light.r * 2, light.r * 2);
  }
  ctx.restore();
}
function juiceFire(player, wi) {
  const w = WEAPONS[wi]; if (!w || !player) return;
  if (w.type === 'flame' && Math.random() < 0.15) S.particles.push({ t: 'smoke', x: player.x + Math.cos(player.aim || 0) * 60, y: player.y - SHOULDER + Math.sin(player.aim || 0) * 60, vx: Math.cos(player.aim || 0) * 80, vy: rand(-60, -20), s: rand(4, 8), life: rand(1, 1.8), max: 1.8 });
  const col = w.type === 'rail' ? 'rgba(160,230,255,A)' : w.type === 'flame' ? 'rgba(255,150,60,A)' : 'rgba(255,220,150,A)';
  const big = w.type === 'rocket' || w.name === 'SHOTGUN' || (w.dmg || 0) > 40;
  if (w.type !== 'melee') juLight(player.x + Math.cos(player.aim || 0) * 24, player.y - SHOULDER + Math.sin(player.aim || 0) * 24, big ? 160 : 90, col, big ? 0.14 : 0.07);
  if (w.type === 'melee' && (w.dmg || 0) >= 80) hitStop(0.05, 4);
}

function juiceBlast(x, y, radius) {
  juLight(x, y, radius * 2.2, 'rgba(255,180,90,A)', 0.35);
  hitStop([0, 0.05, 0.1, 0.13][fxClass(radius)], 0);
  const reach = radius * 2.2;
  for (const slab of S.slabs || []) {
    const dx = slab.x - x, dy = slab.y - y, d = Math.hypot(dx, dy) || 1;
    if (d > reach) continue;
    const force = (1 - d / reach) * 900;
    if (slab.hinge) slab.vr += (dx > 0 ? 1 : -1) * force / 300;
    else { slab.vx += dx / d * force; slab.vy += dy / d * force - 150; slab.vr += (Math.random() - 0.5) * 6; }
  }
  for (const d of S.debris) {
    const dx = d.x - x, dy = d.y - y, dd = Math.hypot(dx, dy) || 1;
    if (dd > reach) continue;
    const force = (1 - dd / reach) * 700;
    d.vx = (d.vx || 0) + dx / dd * force; d.vy = (d.vy || 0) + dy / dd * force - 200; d.rest = false; d.vr = (d.vr || 0) + (Math.random() - 0.5) * 12;
  }
  hitRemnantsIn(x, y, radius * 0.8);
  queryRect(x - radius, y - radius, radius * 2, radius * 2, (b) => { if (Math.random() < 0.12) ignite(b, rand(1.5, 3)); });
  const tier = fxClass(radius);
  smoulderAt(x, y, radius * 0.6, [rand(2, 4), rand(5, 8), rand(7, 10), rand(9, 13)][tier]);
  for (let i = 0; i < 4 + tier * 3; i++) { const angle = Math.random() * TAU, d = rand(0.3, 1) * radius; const e = fxEmber(x + Math.cos(angle) * d, y + Math.sin(angle) * d * 0.6, 0, 0, rand(4, 10)); e.st = 1; e.sz = rand(1.5, 3); }
  for (let i = 0; i < 4 + tier * 5; i++) fxAsh(x + rand(-radius, radius), y - rand(0, radius), rand(-60, 60), -rand(40, 160), Math.random() < 0.3);
}

function kickPiles(x, y, radius, fx, fy) {
  for (const piece of S.debris) {
    if (Math.abs(piece.x - x) > radius || Math.abs(piece.y - y) > radius) continue;
    piece.rest = false; piece.vx = (piece.vx || 0) + fx * rand(0.6, 1.2); piece.vy = (piece.vy || 0) + fy * rand(0.6, 1.2); piece.vr = (piece.vr || 0) + rand(-10, 10);
  }
}

function juiceDestroyed(block) {
  if (!S || block.kind === 'word' || JU.fall.length > 60) return;
  const top = block.y;
  queryRect(block.x, top - 12, block.w, 14, (above) => {
    if (!above.alive || above === block || above.kind === 'word' || above.w * above.h > 160000 || above.h > 420) return;
    if (above.y + above.h > top + 6 || above.y + above.h < top - 8) return;
    if (above.el.contains(block.el) || block.el.contains(above.el)) return;
    JU.fall.push({ b: above, t: rand(0.12, 0.4) });
  });
}
function juSupported(block) {
  const y = block.y + block.h + 3;
  for (const fx of [0.2, 0.5, 0.8]) {
    const x = block.x + block.w * fx;
    const below = blockAt(x, y);
    if (below && below !== block && !block.el.contains(below.el)) return true;
  }
  return y >= S.worldH - 2;
}
function updateFall(dt) {
  for (let i = JU.fall.length - 1; i >= 0; i--) {
    const entry = JU.fall[i]; entry.t -= dt;
    if (entry.t > 0) continue;
    JU.fall.splice(i, 1);
    const block = entry.b;
    if (!block.alive || juSupported(block)) continue;
    if (!S.slabs) S.slabs = [];
    let cs = null; try { cs = block.el.ownerDocument.defaultView.getComputedStyle(block.el); } catch (e) { cs = null; }
    const pic = cs ? breakSource(block, cs) : null;
    if (pic && S.slabs.length < SLAB_MAX && block.w * block.h >= 600 && (pic.src || block.w * block.h <= 15000)) {
      const w = block.w, h = block.h;
      S.slabs.push({ src: pic.src, SW: pic.SW, SH: pic.SH, fill: pic.fill, edge: pic.edge, w, h, age: 0, x: block.x + w / 2, y: block.y + h / 2, ox: -w / 2, oy: -h / 2,
        poly: [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], vx: rand(-30, 30), vy: 0, rot: 0, vr: rand(-0.6, 0.6), hang: rand(0.05, 0.2), wob: true, bounce: Math.random() < 0.4 ? 1 : 0 });
      destroyBlock(block, true, true);
      juiceDestroyed(block);
    } else destroyBlock(block, true, false);
  }
}

function ignite(block, sec) { if (!block || !block.alive || block.kind === 'word' || block.burn > 0 || S.burning.size >= 400) return; block.burn = sec || 2.5; S.burning.add(block); }
function updateFire(dt) {
  for (const block of S.burning) {
    if (Math.random() < 0.25 * dt * fxK()) fxSmoke(block.x + rand(0, block.w), block.y + rand(0, block.h * 0.6), rand(-15, 15), rand(-70, -30), rand(6, 11), rand(1.6, 3), true, 'burning');
    if (block.burn < 0.15 && !block.smould) { block.smould = true; smoulderAt(block.x + block.w / 2, block.y + block.h / 2, Math.min(block.w, 70), rand(5, 9)); }
  }
  if (S.burning && S.burning.size && JU.embers.length < 80) {
    for (const block of S.burning) {
      if (Math.random() < 0.25 * dt) JU.embers.push({ x: block.x + rand(0, block.w), y: block.y + block.h, vx: rand(-20, 20), vy: rand(0, 60), life: 2.5 });
      if (JU.embers.length >= 80) break;
    }
  }
  for (let i = JU.embers.length - 1; i >= 0; i--) {
    const e = JU.embers[i];
    e.vy = Math.min(e.vy + GRAV * 0.35 * dt, 420); e.x += e.vx * dt; e.y += e.vy * dt; e.life -= dt;
    if (Math.random() < 0.15) S.particles.push({ t: 'spark', x: e.x, y: e.y, vx: rand(-10, 10), vy: rand(-20, 0), life: 0.25, max: 0.25, col: EMBERS[(Math.random() * 3) | 0] });
    const block = blockAt(e.x, e.y);
    if (block && block.alive && block.kind !== 'word' && !(block.burn > 0)) { block.burn = 1.8; if (S.burning.size < 400) S.burning.add(block); fireSeed(block, e.x, e.y); JU.embers.splice(i, 1); continue; }
    if (!block && e.life < 2.3 && Math.random() < 0.05) backdropRoast(e.x, e.y);
    if (e.life <= 0 || e.y > S.worldH) JU.embers.splice(i, 1);
  }
}

function paperTear(block, base, cx, cy, w, hh) {
  let pieces = [[[-w / 2, -hh / 2], [w / 2, -hh / 2], [w / 2, hh / 2], [-w / 2, hh / 2]]];
  for (let c = 0; c < 3; c++) {
    const next = [];
    for (const poly of pieces) {
      const cc = centroid(poly), ang = rand(0, Math.PI), n = [-Math.sin(ang), Math.cos(ang)], cutPoint = [cc[0] + rand(-w / 8, w / 8), cc[1] + rand(-hh / 8, hh / 8)];
      const half = clipHalf(poly, cutPoint, n), other = clipHalf(poly, cutPoint, [-n[0], -n[1]]);
      if (half.length >= 3 && other.length >= 3) next.push(half, other); else next.push(poly);
    }
    pieces = next;
  }
  for (const poly of pieces) {
    const c = centroid(poly);
    S.slabs.push(Object.assign({}, base, { x: cx + c[0], y: cy + c[1], ox: -w / 2 - c[0], oy: -hh / 2 - c[1], poly: poly.map((q) => [q[0] - c[0], q[1] - c[1]]),
      vx: c[0] * rand(1, 3) + rand(-40, 40), vy: rand(-140, -20), rot: 0, vr: rand(-3, 3), hang: 0, paper: true, ph: rand(0, TAU) }));
  }
  if (inView(cx, cy)) Sound.play('paper', 0.8);
}

const SPECIALS = {
  finthor: 'chain', jellden: 'chain', incrediblejelly: 'smash', anderfin: 'bullettime', sheljelly: 'bazinga', thefin: 'bullettime',
  superfin: 'smash', elfin: 'smash', fingalf: 'chain', doctorjelly: 'chain', jelloda: 'smash', budjellcer: 'smash', homerjellpson: 'bazinga',
};
function special() {
  if (!S || !S.me || S.me.dead || JU.special > 0) return;
  const id = S.hero && S.hero.id, kind = SPECIALS[id] || 'shockwave', player = S.me, x = player.x, y = player.y - SHOULDER;
  JU.special = kind === 'bullettime' ? 9 : 7;
  if (kind === 'chain') {
    let px = x, py = y; const hit = new Set();
    for (let k = 0; k < 8; k++) {
      let best = null, bd = 1e9;
      queryRect(px - 320, py - 320, 640, 640, (block) => { if (!block.alive || hit.has(block) || block.kind === 'word') return; const dist = Math.hypot(block.x + block.w / 2 - px, block.y + block.h / 2 - py); if (dist < bd && dist > 20) { bd = dist; best = block; } });
      if (!best) break;
      hit.add(best);
      const bx = best.x + best.w / 2, by = best.y + best.h / 2;
      S.beams.push({ x1: px, y1: py, x2: bx, y2: by, life: 0.4, max: 0.4, col: '#c8fcff' });
      juLight(bx, by, 140, 'rgba(180,240,255,A)', 0.3);
      IMP = { x: px, y: py, f: 500 }; damageBlock(best, 400, bx, by, true); IMP = null;
      px = bx; py = by;
    }
    Sound.play('rail', 1); hitStop(0.06, 8);
    popText(pick(['THUNDER!', 'CHAIN LIGHTNING', 'BZZZT!']), x, y - 100, 'streak', true);
  } else if (kind === 'bullettime') {
    bulletTime(3, 0.3);
  } else {
    const radius = kind === 'smash' ? 240 : 170;
    IMP = { x, y: y + 12, f: 900 };
    queryRect(x - radius, y - radius, radius * 2, radius * 2, (block) => { const dist = Math.hypot(block.x + block.w / 2 - x, block.y + block.h / 2 - y); if (dist < radius && block.kind !== 'word') damageBlock(block, 260 * (1 - dist / radius) + 40, undefined, undefined, true); });
    IMP = null;
    holeCircle(x, y + 10, radius * 0.25);
    juiceBlast(x, y, radius * 0.6);
    for (let i = 0; i < 40; i++) { const angle = (i / 40) * TAU; S.particles.push({ t: 'spark', x: x + Math.cos(angle) * 20, y: y + Math.sin(angle) * 20, vx: Math.cos(angle) * 520, vy: Math.sin(angle) * 520, life: 0.4, max: 0.4, col: '#ffffff' }); }
    Sound.play('explode', 1); hitStop(0.09, 16);
    popText(kind === 'bazinga' ? 'BAZINGA!' : kind === 'smash' ? pick(['SMASH!', 'HULK SMASH!', 'KA-BOOM!']) : pick(['SHOCKWAVE!', 'BOOM!']), x, y - 100, 'streak', true);
  }
}

function juiceCredits() {
  if (JU.credits || !S || !S.totalArea || S.destroyedArea / S.totalArea < 0.985) return;
  JU.credits = true;
  Promise.resolve(eggPage).then((page) => {
    const hero = S.hero ? S.hero.name : 'you';
    const rows = [['DESTROYED BY', hero]];
    if (page) {
      rows.push(['a Destroy production of', page.Name || '']);
      for (const person of (page.People || []).filter((x) => x.Type === 'Director').slice(0, 2)) rows.push(['directed by', person.Name]);
      for (const person of (page.People || []).filter((x) => x.Type === 'Actor').slice(0, 10)) rows.push([person.Role || 'as themselves', person.Name]);
    }
    rows.push(['special effects', 'Jellyfin + ' + (S.destroyedCount || 0) + ' destroyed things'], ['no websites were harmed', '(only this one)']);
    const el = document.createElement('div'); el.className = 'dj-credits';
    el.innerHTML = '<div class="dj-roll">' + rows.map(([a, b]) => `<p><i>${esc(a)}</i><b>${esc(b)}</b></p>`).join('') + '</div>';
    $('#hud').appendChild(el);
    setTimeout(() => el.remove(), 26000);
  });
}

let hudLayT = 0;
function layoutHud() {
  const query = (s) => $(s), tl = query('.hud-tl'), tc = query('.hud-tc'), party = query('#djParty'), bot = query('#djBot'), feed = query('#feed'), hints = query('#hints'), bar = query('#weapons');
  if (!tl || !tc) return;
  const viewW = game.clientWidth || S.VW, Hh = game.clientHeight || S.VH;
  const boxW = Math.max(tl.offsetWidth, tc.offsetWidth);
  tl.style.minHeight = tc.style.minHeight = '';
  if (party) party.style.minHeight = '';
  let boxH = Math.max(tl.offsetHeight, tc.offsetHeight);
  if (party) {
    partyArrange(party);
    const inRow = party.dataset.inrow === '1';
    party.style.top = (inRow ? 14 : 14 + boxH + 10) + 'px';
    if (inRow && party.dataset.rows === '1') { boxH = Math.max(boxH, party.offsetHeight); party.style.minHeight = boxH + 'px'; }
  }
  tl.style.minHeight = tc.style.minHeight = boxH + 'px';
  let y = 14 + boxH + 8;
  if (party && party.offsetTop > 20) y = party.offsetTop + party.offsetHeight + 8;
  if (bot) { bot.style.top = y + 'px'; if (bot.classList.contains('on')) y += bot.offsetHeight + 6; }
  if (feed) feed.style.top = y + 'px';
  if (hints && bar) {
    const hr = hints.getBoundingClientRect(), br = bar.getBoundingClientRect(), gr = game.getBoundingClientRect();
    const touches = gr.left + 10 + hr.width + 12 > br.left;
    hints.style.bottom = (touches ? Math.round(gr.bottom - br.top + 10) : 10) + 'px';
  }
}
function updateJuice(dt) {
  const hk = (game.clientWidth || 0) + 'x' + (game.clientHeight || 0) + '|' + (S.party ? S.party.length : 0) + '|' + BOT.on + '|' + (S.me ? S.me.weapon : 0) + '|' + (keys.size ? 0 : 1);
  if ((hudLayT -= dt) <= 0 || hk !== JU.hudKey) { if (hk !== JU.hudKey || hudLayT <= -3) { JU.hudKey = hk; hudLayT = 0; try { layoutHud(); } catch (e) { } } }
  fxUpdate(dt);
  diagTick(() => [JU.fps, +(FXC.ms.upd + FXC.ms.back + FXC.ms.front).toFixed(1), +fxK().toFixed(2), S.blocks.reduce((n, b) => n + (b.alive ? 1 : 0), 0),
    S.totalArea ? +(S.destroyedArea / S.totalArea * 100).toFixed(1) : 0, S.particles.length]);
  for (let i = JU.lights.length - 1; i >= 0; i--) { JU.lights[i].life -= dt; if (JU.lights[i].life <= 0) JU.lights.splice(i, 1); }
  if (JU.special > 0) JU.special -= dt;
  updateFall(dt);
  sweepUpdate(dt);
  updateFire(dt);
  const player = S.me;
  if (player && player.onGround && Math.abs(player.vx) > 60) kickPiles(player.x, player.y - 4, 12, player.vx * 0.8, -160);
  if (Math.random() < dt * 2) juiceCredits();
  if (eggStreak.length >= 40 && JU.slow <= 0 && Math.random() < 0.02) bulletTime(1.2, 0.35);
}
window.addEventListener('keydown', (e) => {
  if (!S || !S.me || e.repeat) return;
  if (e.code === 'KeyF') { special(); e.preventDefault(); }
}, true);
