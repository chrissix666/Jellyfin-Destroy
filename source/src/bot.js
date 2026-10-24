const BOT = { on: false, t: null, retarget: 0, burst: 0, pause: 0, wSwitch: 0, hSwitch: 0, gren: 0, spec: 0, keys: new Set(), errors: [], wob: [0, 0] };
function botSet(on) {
  BOT.on = on == null ? !BOT.on : !!on;
  for (const k of BOT.keys) keys.delete(k);
  BOT.keys.clear(); mouse.down = false; BOT.t = null;
  if (S && S.me) popText(BOT.on ? 'AUTOPILOT ON' : 'AUTOPILOT OFF', S.me.x, S.me.y - 120, 'sys', true);
  const el = $('#djBot'); if (el) el.classList.toggle('on', BOT.on);
  return BOT.on;
}
function muteHud() { const el = $('#djMute'); if (el) el.textContent = Sound.isMuted() ? 'Sound off' : 'Sound on'; }
function botKey(code, on) {
  if (on) { if (!keys.has(code)) { keys.add(code); BOT.keys.add(code); } }
  else if (BOT.keys.has(code)) { keys.delete(code); BOT.keys.delete(code); }
}
function botPick() {
  if (!S.view) return null;
  const player = S.me, vx = S.view.x, vy = S.view.y, candidates = [];
  queryRect(vx - 200, vy - 150, S.VW + 400, S.VH + 300, (block) => {
    if (!block.alive || block.w * block.h > S.VW * S.VH * 0.25) return;
    const w = block.kind === 'media' ? 6 : block.kind === 'box' ? 3 : block.kind === 'ctrl' ? 2 : 1;
    const below = block.y + block.h / 2 - player.y;
    const down = below > -120 ? 1 + Math.min(2, Math.max(0, below) / 500) : 0.3;
    candidates.push([block, w * down / (1 + Math.hypot(block.x + block.w / 2 - player.x, block.y + block.h / 2 - player.y) / 400)]);
  });
  if (!candidates.length) {
    queryRect(0, 0, S.worldW, S.worldH, (block) => { if (block.alive && block.kind !== 'word' && candidates.length < 400) candidates.push([block, 1 / (1 + Math.abs(block.y - player.y) / 600)]); });
  }
  if (!candidates.length) return null;
  let sum = 0; for (const entry of candidates) sum += entry[1];
  let x = Math.random() * sum;
  for (const entry of candidates) { x -= entry[1]; if (x <= 0) return entry[0]; }
  return candidates[candidates.length - 1][0];
}
function botTick(dt) {
  if (!BOT.on || !S || !S.me || S.me.dead || (typeof rosterOpen === 'function' && rosterOpen())) return;
  try {
    const player = S.me;
    BOT.retarget -= dt; BOT.wSwitch -= dt; BOT.hSwitch -= dt; BOT.gren -= dt; BOT.spec -= dt;
    if (!BOT.t || !BOT.t.alive || BOT.retarget <= 0) {
      BOT.t = botPick(); BOT.retarget = rand(1.2, 3);
      BOT.wob = [rand(-0.3, 0.3), rand(-0.3, 0.3)];
      const wt = (WEAPONS[player.weapon] || {}).type, close = wt === 'flame' || wt === 'melee';
      BOT.spot = [(Math.random() < 0.5 ? -1 : 1) * (close ? rand(50, 140) : rand(110, 300)), -rand(20, close ? 90 : 180)];
    }
    const t = BOT.t;
    if (!t) { botKey('KeyD', false); botKey('KeyA', false); mouse.down = false; return; }
    const ax = t.x + t.w * (0.5 + BOT.wob[0] * Math.sin(S.stats.time * 3)), ay = t.y + t.h * (0.5 + BOT.wob[1] * Math.cos(S.stats.time * 2.3));
    mouse.x = (ax - S.cam.x) * S.scale; mouse.y = (ay - S.cam.y) * S.scale;
    const sp = BOT.spot || [180, -80], hx = t.x + t.w / 2 + sp[0], hy = t.y + t.h / 2 + sp[1];
    const ddx = hx - player.x, ddy = hy - player.y;
    botKey('KeyD', ddx > 40); botKey('KeyA', ddx < -40);
    if (player.onGround && (ddy < -30 || Math.random() < 0.03)) onJumpPress();
    botKey('Space', !player.onGround && (ddy < -10 || (player.vy > 220 && ddy < 80)));
    if (!player.onGround && player.airJump && Math.random() < 0.5 * dt) onJumpPress();
    botKey('KeyS', ddy > 120 && player.onGround);
    if (BOT.pause > 0) { BOT.pause -= dt; mouse.down = false; }
    else { mouse.down = true; BOT.burst -= dt; if (BOT.burst <= 0) { BOT.burst = rand(0.6, 2.2); BOT.pause = rand(0.1, 0.5); } }
    if (BOT.wSwitch <= 0) {
      BOT.wSwitch = rand(2.5, 5);
      if (!BOT.wOrder || !BOT.wOrder.length) { BOT.wOrder = WEAPONS.map((w, i) => i); for (let i = BOT.wOrder.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [BOT.wOrder[i], BOT.wOrder[j]] = [BOT.wOrder[j], BOT.wOrder[i]]; } }
      selectWeapon(BOT.wOrder.pop());
    }
    if (BOT.hSwitch <= 0) { BOT.hSwitch = rand(10, 18); if (typeof switchHero === 'function') switchHero(1); BOT.wOrder = null; }
    if (BOT.gren <= 0) { BOT.gren = rand(6, 14); throwGrenade(); }
    if (BOT.spec <= 0) { BOT.spec = rand(10, 18); special(); }
  } catch (e) { diagAnomaly('error', 'loop', String(e && e.message || e).slice(0, 80), { stack: String(e && e.stack || '').split('\n').slice(0, 4).join(' < ') }, true); BOT.errors.push(String(e && e.message || e) + ' | ' + String(e && e.stack || '').split('\n').slice(1, 4).join(' < ')); if (BOT.errors.length > 50) BOT.errors.shift(); }
}
function botStats() {
  const alive = S ? S.blocks.filter((b) => b.alive).length : 0;
  return { on: BOT.on, fps: JU.fps, blocks: S ? S.blocks.length : 0, alive, destroyed: S && S.totalArea ? +(S.destroyedArea / S.totalArea * 100).toFixed(1) : 0,
    slabs: S && S.slabs ? S.slabs.length : 0, remnants: S && S.remnants ? S.remnants.length : 0, debris: S ? S.debris.length : 0, particles: S ? S.particles.length : 0,
    lights: JU.lights.length, embers: JU.embers.length, falling: JU.fall.length, hero: S && S.hero ? S.hero.id : null, weapon: S && S.me ? (WEAPONS[S.me.weapon] || {}).name : null,
    backdrop: (() => { const img = shell.backdrop && shell.backdrop(); if (!img) return null;
      let lum = null; try { const canvas = document.createElement('canvas'); canvas.width = canvas.height = 8; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, 8, 8); const pixels = ctx.getImageData(0, 0, 8, 8).data; let sum = 0; for (let i = 0; i < pixels.length; i += 4) sum += pixels[i] + pixels[i + 1] + pixels[i + 2]; lum = Math.round(sum / 192); } catch (e) { lum = 'tainted'; }
      let band = null; try { const firstBand = S.bands && S.bands.find((x) => x); if (firstBand) { const ctx = firstBand.art.getContext('2d'), pixels = ctx.getImageData(0, 0, firstBand.art.width, firstBand.art.height).data; let sum = 0, n = 0; for (let i = 0; i < pixels.length; i += 400) { sum += pixels[i] + pixels[i + 1] + pixels[i + 2]; n++; } band = Math.round(sum / n / 3); } } catch (e) { band = 'err ' + e.message; }
      return { size: img.naturalWidth + 'x' + img.naturalHeight, lum, band, src: img.src.slice(-60) }; })(),
    breaks: S && S.breakStats ? S.breakStats : {},
    fx: fxStats(),
    errors: BOT.errors.slice(-10) };
}
window.addEventListener('keydown', (e) => {
  if (!S || !S.me || e.repeat) return;
  if (e.code === 'KeyB') { botSet(); e.preventDefault(); }
  if (e.code === 'KeyM' && !e.ctrlKey && !e.altKey && !e.metaKey) { Sound.setMuted(!Sound.isMuted()); muteHud(); popText(Sound.isMuted() ? 'SOUND OFF' : 'SOUND ON', S.me.x, S.me.y - 120, 'sys', true); e.preventDefault(); }
}, true);

const TESTAPI = {
  S: () => S,
  shoot(wi, tx, ty, n) {
    const player = S.me; player.weapon = wi; player.facing = tx >= player.x ? 1 : -1;
    for (let i = 0; i < (n || 1); i++) {
      player.aim = Math.atan2(ty - (player.y - SHOULDER), tx - player.x);
      const tip = muzzle(player);
      fire(player, wi, tip.x, tip.y, Math.atan2(ty - tip.y, tx - tip.x), (Math.random() * 1e9) | 0, tx, ty);
    }
  },
  explode: (x, y, radius) => explode(x, y, radius, 70, S.me.id, 'TEST'),
  breakPadderFull() {
    const block = S.blocks.find((x) => x.alive && x.el && x.el.classList && x.el.classList.contains('cardPadder') && x.y > S.view.y + 60 && x.y + x.h < S.view.y + S.VH - 60);
    if (!block) return null;
    const keep = S.slabs, debrisBefore = S.debris.length;
    S.slabs = keep.slice(); while (S.slabs.length < SLAB_MAX) S.slabs.push(keep[0] || { w: 1, h: 1, age: 0 });
    try { destroyBlock(block, false, false); } finally { S.slabs = keep; }
    const newDebris = S.debris.slice(debrisBefore);
    return { debris: newDebris.length, pic: newDebris.filter((d) => d.src).length };
  },
  crater: (x, y, pw) => wallCrater(x, y, pw),
  weapons: () => WEAPONS.map((w, i) => ({ i, name: w.name, type: w.type })),
  muzzleError() {
    const player = S.me, out = [];
    const keep = { w: player.weapon, aim: player.aim, f: player.facing };
    for (let wi = 0; wi < WEAPONS.length; wi++) {
      const hi = weaponHiFor(wi); if (!hi) continue;
      for (const ang of [-1.3, -0.7, -0.2, 0, 0.4, 1.0, Math.PI - 0.4, Math.PI + 0.5, -Math.PI + 0.2]) {
        player.weapon = wi; player.aim = ang; player.facing = Math.cos(ang) >= 0 ? 1 : -1;
        const tip = gunMuzzle(player);
        const shoulderAt = heroShoulder(player), hx = shoulderAt.x + Math.cos(ang) * HERO_ARM, hy = shoulderAt.y + Math.sin(ang) * HERO_ARM;
        const angle = Math.round(ang / HI_STEP) * HI_STEP, fy = Math.cos(ang) < 0 ? -1 : 1;
        let best = 1e9;
        const pixels = hi.cv.getContext('2d').getImageData(0, 0, hi.w, hi.h).data;
        for (let x = hi.w - 1; x >= 0 && best === 1e9; x--) for (let y = 0; y < hi.h; y++) {
          if (pixels[(y * hi.w + x) * 4 + 3] < 10) continue;
          const lx = x + 1 - hi.grip[0], ly = (y + 0.5 - hi.grip[1]) * fy;
          const tx = hx + Math.cos(angle) * lx - Math.sin(angle) * ly, ty = hy + Math.sin(angle) * lx + Math.cos(angle) * ly;
          best = Math.min(best, Math.hypot(tx - tip.x, ty - tip.y));
        }
        out.push({ wi, ang: +ang.toFixed(2), err: +best.toFixed(1) });
      }
    }
    player.weapon = keep.w; player.aim = keep.aim; player.facing = keep.f;
    return out;
  },
  counts() {
    if (!S.slabs) S.slabs = []; if (!S.remnants) S.remnants = [];
    const isBlur = (src) => !!(src && src.classList && src.classList.contains('blurhash-canvas'));
    const allParticles = S.particles;
    return {
      slabs: S.slabs.length, slabsPic: S.slabs.filter((s) => s.src && !isBlur(s.src)).length, slabsBlur: S.slabs.filter((s) => isBlur(s.src)).length,
      remnants: S.remnants.length, remnantsPic: S.remnants.filter((s) => s.src && !isBlur(s.src)).length,
      debrisPic: S.debris.filter((d) => d.src).length, debris: S.debris.length,
      doves: allParticles.filter((p) => p.t === 'dove' || p.t === 'feather').length, pops: allParticles.filter((p) => p.t === 'pop').length,
      chunks: allParticles.filter((p) => p.t === 'chunk').length, breaks: Object.assign({}, S.breakStats || {}),
      wallLevels: (S.wallHits || []).reduce((tally, h) => { tally[h.lv] = (tally[h.lv] || 0) + 1; return tally; }, {}),
      party: (S.party || []).length, partyStars: S.partyFit ? S.party.filter((id) => S.partyFit.has(id)).length : 0,
      fps: JU.fps, fxLevel: +fxK().toFixed(2),
    };
  },
  layerPixels(which, x, y, w, h) {
    let n = 0;
    for (let yy = Math.floor(y / PX); yy < Math.ceil((y + h) / PX); yy += 2) {
      const bandIndex = Math.floor(yy / BAND_H), band = S.bands[bandIndex]; if (!band) continue;
      const canvas = which === 'dmg' ? band.dmg : which === 'scorch' ? band.scorch : band.reveal; if (!canvas) continue;
      const row = canvas.getContext('2d').getImageData(Math.max(0, Math.floor(x / PX)), yy - bandIndex * BAND_H, Math.max(1, Math.ceil(w / PX)), 1).data;
      for (let i = 3; i < row.length; i += 4) if (row[i] > 8) n++;
    }
    return n;
  },
  flameReach() {
    let farthest = 0; for (const shot of S.projectiles) if (shot.t === 'flame') farthest = Math.max(farthest, Math.hypot(shot.x - S.me.x, shot.y - (S.me.y - SHOULDER)));
    return Math.round(farthest);
  },
  ashLook() {
    return { ash: FXC.pools.ash.length, ember: FXC.pools.ember.length, dust: FXC.pools.dust.length };
  },
  burnRes: (w, h) => { const grid = burnGrid(w, h, 0.5, 0.9); return { gw: grid.gw, gh: grid.gh, cellPx: +(w / grid.gw).toFixed(1) }; },
  diag: () => ({ on: diagOn(), sid: DIAG.sid, queued: DIAG.q.length }),
  fate(block, kind) { block.burn = 1; S.burning.add(block); block.fate = kind; block.fateT = 0; return fireFate(block, 0.016); },
};
