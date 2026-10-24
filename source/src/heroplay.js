const SIG = 7;
const heroCache = new Map();
function gridCanvas(grid) {
  const canvas = document.createElement('canvas'); canvas.width = grid.w; canvas.height = grid.h;
  const x = canvas.getContext('2d'), img = x.createImageData(grid.w, grid.h);
  for (let i = 0; i < grid.c.length; i++) { const rgb = grid.c[i]; if (!rgb) continue; img.data[i * 4] = rgb[0]; img.data[i * 4 + 1] = rgb[1]; img.data[i * 4 + 2] = rgb[2]; img.data[i * 4 + 3] = 255; }
  x.putImageData(img, 0, 0);
  return canvas;
}
function loadHero(id) {
  if (heroCache.has(id)) return heroCache.get(id);
  const heroDef = HEROES.find((h) => h.id === id);
  if (!heroDef) return null;
  const sprites = buildHeroSprites(heroDef);
  const cv = (grid) => ({ cv: gridCanvas(grid), bob: grid.bob || 0, w: grid.w, h: grid.h, pivot: grid.pivot, hand: grid.hand });
  const hero = { id: sprites.id, name: sprites.name, sig: sprites.sig, idle: cv(sprites.idle), jump: cv(sprites.jump), walk: sprites.walk.map(cv),
    gun: cv(sprites.gun), arm: cv(sprites.arm), shoulder: sprites.shoulder, foot: sprites.foot, cx: sprites.cx };
  hero.sigKey = heroDef.sig;
  const hi = weaponHi(HERO_SIG_MODEL[heroDef.sig]);
  hero.sig.gun = hi ? hi.w - hi.grip[0] : (hero.gun.w - hero.gun.pivot[0]) * U;
  heroCache.set(id, hero);
  return hero;
}
const STD_MODEL = ['glock', 'mp5', 'remington', 'rpg7', 'railgun', 'flamer', 'pod'];
const HERO_SIG_MODEL = { minigun: 'minigun', auto9: 'auto9', usp: 'usp', dual: 'beretta', pulse: 'pulse', m60: 'm60', beretta: 'beretta', shotgun: 'remington',
  pistol: 'beretta', coolglock: 'glock', ezekiel: 'beretta', vega45: 'usp', hkp7: 'usp', sigp228: 'glock', browning: 'beretta', mauser: 'beretta',
  ppk: 'glock', lawgiver: 'usp', deagle: 'usp', alicedual: 'beretta',
  python: 'webley', colt: 'webley', magnum: 'webley', snub: 'webley', samaritan: 'webley',
  uzi: 'mp5', dalismg: 'mp5', ampgun: 'minigun', rifle: 'm60', morita: 'pulse', leggun: 'm60',
  sawedoff: 'remington', boomstick: 'remington', aa12: 'remington', elephantgun: 'remington',
  rocketl: 'rpg7', rocketbig: 'rpg7', littlefriend: 'rpg7', sidewinder: 'pod', flamer: 'flamer', flameduel: 'flamer' };
const HI_SCALE = 1.3;
const hiCache = new Map();
function weaponHi(modelId) {
  if (!modelId || !WEAPON_MODELS[modelId]) return null;
  if (hiCache.has(modelId)) return hiCache.get(modelId);
  const model = WEAPON_MODELS[modelId], grid = renderWeaponE(model, model.ppcm * HI_SCALE);
  const hi = { cv: gridCanvas(grid), w: grid.w, h: grid.h, grip: grid.grip };
  for (let x = grid.w - 1; x >= 0 && !hi.mz; x--) {
    let n = 0, sy = 0;
    for (let y = 0; y < grid.h; y++) if (grid.c[y * grid.w + x]) { n++; sy += y; }
    if (n) hi.mz = [x + 1, sy / n + 0.5];
  }
  if (!hi.mz) hi.mz = [grid.w, grid.grip[1]];
  hiCache.set(modelId, hi);
  return hi;
}
function weaponHiFor(i) {
  if (i === SIG) return S && S.hero ? weaponHi(HERO_SIG_MODEL[S.hero.sigKey]) : null;
  return weaponHi(STD_MODEL[i]);
}
STD_MODEL.forEach((id, i) => { const hi = weaponHi(id); if (hi && WEAPONS[i]) WEAPONS[i].gun = hi.w - hi.grip[0]; });
function heroShoulder(player) {
  const figure = player.hero, dir = player.facing || 1;
  let frame = figure.idle; if (!player.onGround) frame = figure.jump; else if (Math.abs(player.vx) > 20) frame = figure.walk[(((player.run / TAU) * 8) | 0) % 8];
  return { x: player.x + dir * (figure.shoulder[0] - figure.cx) * U, y: player.y + (figure.shoulder[1] + frame.bob - figure.foot) * U };
}
const HERO_ARM = 12;
const HI_STEP = Math.PI / 32, ARM_STEP = Math.PI / 16;
function gunMuzzle(player) {
  const hi = weaponHiFor(player.weapon);
  if (hi) {
    const shoulderAt = heroShoulder(player), hx = shoulderAt.x + Math.cos(player.aim) * HERO_ARM, hy = shoulderAt.y + Math.sin(player.aim) * HERO_ARM;
    const angle = Math.round(player.aim / HI_STEP) * HI_STEP, fy = Math.cos(player.aim) < 0 ? -1 : 1;
    const mx = hi.mz[0] - hi.grip[0], my = (hi.mz[1] - hi.grip[1]) * fy;
    return { x: hx + Math.cos(angle) * mx - Math.sin(angle) * my, y: hy + Math.sin(angle) * mx + Math.cos(angle) * my };
  }
  const figure = player.hero, dir = player.facing || 1;
  let frame = figure.idle; if (!player.onGround) frame = figure.jump; else if (Math.abs(player.vx) > 20) frame = figure.walk[(((player.run / TAU) * 8) | 0) % 8];
  const sig = player.weapon === SIG && WEAPONS[SIG];
  let tipX;
  if (sig) tipX = figure.gun.w - figure.gun.pivot[0];
  else { const gs = GUN_SPR[player.weapon]; tipX = (figure.arm.hand[0] - figure.arm.pivot[0]) - 2 + gs.w; }
  const aimL = dir < 0 ? Math.PI - player.aim : player.aim, aq = Math.round(aimL / ARM_STEP) * ARM_STEP;
  const ox = -figure.cx, oy = 13 - figure.foot, sx = ox + figure.shoulder[0], sy = oy + figure.shoulder[1] + frame.bob;
  let x = Math.cos(aq) * (tipX + 1) + sx, y = Math.sin(aq) * (tipX + 1) + sy;
  x *= dir;
  const rot = player.flip > 0 ? player.flipDir * (1 - player.flip) * TAU : 0;
  if (rot) { const cosRot = Math.cos(rot), sinRot = Math.sin(rot), turnedX = x * cosRot - y * sinRot; y = x * sinRot + y * cosRot; x = turnedX; }
  return { x: player.x + x * U, y: player.y - 13 * U + y * U };
}
let hiGuns = [];
function drawHiGuns(ctx, vx, vy) {
  for (const gun of hiGuns) {
    ctx.save();
    ctx.translate(Math.round(gun.x - vx), Math.round(gun.y - vy));
    ctx.rotate(Math.round(gun.ang / HI_STEP) * HI_STEP);
    if (Math.cos(gun.ang) < 0) ctx.scale(1, -1);
    if (gun.alpha < 1) ctx.globalAlpha = gun.alpha;
    ctx.drawImage(gun.hi.cv, -gun.hi.grip[0], -gun.hi.grip[1]);
    if (gun.dual) ctx.drawImage(gun.hi.cv, -gun.hi.grip[0] + 3, -gun.hi.grip[1] + 5);
    ctx.restore();
  }
  hiGuns = [];
}
function weaponIcon(i) {
  const hi = weaponHiFor(i);
  const src = hi ? hi.cv : GUN_SPR[i].c;
  const canvas = document.createElement('canvas'); canvas.width = src.width; canvas.height = src.height;
  canvas.getContext('2d').drawImage(src, 0, 0);
  const k = Math.min(62 / src.width, 26 / src.height, hi ? 1.2 : 3);
  canvas.style.width = Math.round(src.width * k) + 'px'; canvas.style.height = Math.round(src.height * k) + 'px';
  canvas.style.imageRendering = 'pixelated';
  return canvas;
}

function setHeroWeapon(hero) {
  WEAPONS.length = SIG;
  if (GUN_SPR.length > SIG) GUN_SPR.length = SIG;
  if (!hero) return;
  WEAPONS.push(hero.sig);
  GUN_SPR.push({ c: hero.gun.cv, w: hero.gun.w, h: hero.gun.h, ay: hero.gun.pivot[1], hero: true });
}

function drawHero(ctx, player) {
  if (player.invuln > 0 && ((player.invuln * 12) | 0) % 2 === 0) return;
  const figure = player.hero, dir = player.facing || 1;
  let frame = figure.idle;
  if (!player.onGround) frame = figure.jump;
  else if (Math.abs(player.vx) > 20) frame = figure.walk[(((player.run / TAU) * 8) | 0) % 8];
  const bx = Math.round((player.x - LO.ox) / U), by = Math.round((player.y - LO.oy) / U);
  const rot = player.flip > 0 ? player.flipDir * (1 - player.flip) * TAU : 0;
  ctx.save();
  ctx.translate(bx, by - 13);
  if (rot) ctx.rotate(rot);
  if (dir < 0) ctx.scale(-1, 1);
  if (player.hurtT > 0) ctx.globalAlpha = 0.65;
  const ox = -figure.cx, oy = 13 - figure.foot;
  ctx.drawImage(frame.cv, ox, oy);
  const sx = ox + figure.shoulder[0], sy = oy + figure.shoulder[1] + frame.bob;
  const aim = dir < 0 ? Math.PI - player.aim : player.aim;
  ctx.translate(sx, sy);
  ctx.rotate(Math.round(aim / ARM_STEP) * ARM_STEP);
  const sig = player.weapon === SIG && WEAPONS[SIG];
  let muzzleX;
  const hi = weaponHiFor(player.weapon);
  if (hi) {
    ctx.drawImage(figure.arm.cv, -figure.arm.pivot[0], -figure.arm.pivot[1]);
    const shoulderAt = heroShoulder(player);
    hiGuns.push({ x: shoulderAt.x + Math.cos(player.aim) * HERO_ARM, y: shoulderAt.y + Math.sin(player.aim) * HERO_ARM, ang: player.aim, hi, dual: sig && sig.type === 'dual',
      alpha: player.hurtT > 0 ? 0.65 : 1 });
    muzzleX = -999;
  } else if (sig) {
    ctx.drawImage(figure.gun.cv, -figure.gun.pivot[0], -figure.gun.pivot[1]);
    muzzleX = figure.gun.w - figure.gun.pivot[0];
  } else {
    const gs = GUN_SPR[player.weapon];
    const hx = figure.arm.hand[0] - figure.arm.pivot[0], hy = figure.arm.hand[1] - figure.arm.pivot[1];
    ctx.drawImage(gs.c, hx - 2, hy - gs.ay);
    ctx.drawImage(figure.arm.cv, -figure.arm.pivot[0], -figure.arm.pivot[1]);
    muzzleX = hx - 2 + gs.w;
  }
  const wt = WEAPONS[player.weapon].type;
  if (player.muzzleT > 0 && muzzleX > -999 && wt !== 'flame' && wt !== 'melee' && wt !== 'boomerang') {
    ctx.fillStyle = FIRE_RAMP[2]; ctx.fillRect(muzzleX + 1, -2, 3, 5); ctx.fillRect(muzzleX + 4, -1, 3, 3);
    ctx.fillStyle = FIRE_RAMP[1]; ctx.fillRect(muzzleX + 1, -1, 3, 3);
    ctx.fillStyle = FIRE_RAMP[0]; ctx.fillRect(muzzleX + 1, 0, 2, 1);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function fireHeroWeapon(player, weapon, x, y, ang, random) {
  const owner = player.id, local = owner === S.me.id;
  if (weapon.type === 'dual') {
    for (const off of [-1, 1]) {
      const aim = ang + off * 0.06 + (random() - 0.5) * weapon.spread;
      S.projectiles.push({ t: 'bullet', owner, x: x - Math.sin(ang) * off * 6, y: y + Math.cos(ang) * off * 6, vx: Math.cos(aim) * weapon.speed, vy: Math.sin(aim) * weapon.speed, dmg: weapon.dmg, life: 1.1, wn: weapon.name });
    }
    return true;
  }
  if (weapon.type === 'melee') {
    const cx = player.x, cy = player.y - SHOULDER;
    IMP = { dx: Math.cos(ang), dy: Math.sin(ang), f: 520 };
    queryRect(cx - weapon.reach, cy - weapon.reach, weapon.reach * 2, weapon.reach * 2, (block) => {
      const hitX = clamp(cx + Math.cos(ang) * weapon.reach * 0.6, block.x, block.x + block.w), hitY = clamp(cy + Math.sin(ang) * weapon.reach * 0.6, block.y, block.y + block.h);
      const dx = hitX - cx, dy = hitY - cy, dist = Math.hypot(dx, dy);
      if (dist > weapon.reach) return;
      let turn = Math.atan2(dy, dx) - ang; while (turn > Math.PI) turn -= TAU; while (turn < -Math.PI) turn += TAU;
      if (Math.abs(turn) > weapon.arc && dist > 14) return;
      HIT = { type: 'melee', wn: weapon.name, ang };
      damageBlock(block, weapon.dmg, hitX, hitY, local);
      HIT = null;
    });
    IMP = null;
    hitRemnantsIn(cx + Math.cos(ang) * weapon.reach * 0.6, cy + Math.sin(ang) * weapon.reach * 0.6, weapon.reach * 0.5);
    for (let i = -3; i <= 3; i++) {
      const from = ang + (i / 3) * weapon.arc, to = ang + ((i + 1) / 3) * weapon.arc;
      if (i === 3) break;
      S.beams.push({ x1: cx + Math.cos(from) * weapon.reach * 0.9, y1: cy + Math.sin(from) * weapon.reach * 0.9, x2: cx + Math.cos(to) * weapon.reach * 0.9, y2: cy + Math.sin(to) * weapon.reach * 0.9, life: 0.14, max: 0.14, col: weapon.col || '#ffffff' });
    }
    return true;
  }
  if (weapon.type === 'stick') {
    const aim = ang + (random() - 0.5) * weapon.spread;
    S.projectiles.push({ t: 'boomerang', stick: true, owner, x, y, vx: Math.cos(aim) * weapon.speed, vy: Math.sin(aim) * weapon.speed, dmg: weapon.dmg, life: 1.6, out: 99, rot: aim, hit: new Set(), wn: weapon.name, spr: weapon.thrown });
    return true;
  }
  if (weapon.type === 'boomerang') {
    S.projectiles.push({ t: 'boomerang', owner, x, y, vx: Math.cos(ang) * weapon.speed, vy: Math.sin(ang) * weapon.speed, dmg: weapon.dmg, life: 2.4, out: 0.42, rot: 0, hit: new Set(), wn: weapon.name, spr: weapon.thrown });
    return true;
  }
  return false;
}
function updateBoomerang(shot, dt) {
  const local = shot.owner === S.me.id;
  if (shot.stick) {
    shot.vy += GRAV * 0.25 * dt; shot.rot = Math.atan2(shot.vy, shot.vx);
    shot.x += shot.vx * dt; shot.y += shot.vy * dt; shot.life -= dt;
    const touched = blockAt(shot.x, shot.y), struck = touched && aimHits(shot, touched) ? touched : null;
    if (!struck && aimReached(shot)) {
      backdropMark(shot.x, shot.y, false);
      if (!S.stuck) S.stuck = [];
      if (S.stuck.length >= 60) S.stuck.shift();
      S.stuck.push({ x: shot.x, y: shot.y, ang: shot.rot, spr: shot.spr, life: rand(6, 10), b: null });
      return true;
    }
    if (struck) {
      const speed = Math.hypot(shot.vx, shot.vy) || 1;
      IMP = { dx: shot.vx / speed, dy: shot.vy / speed, f: 300 }; HIT = { type: 'stick', wn: shot.wn, ang: shot.rot };
      damageBlock(struck, shot.dmg, shot.x, shot.y, shot.owner === S.me.id);
      HIT = null; IMP = null;
      if (!S.stuck) S.stuck = [];
      if (S.stuck.length >= 60) S.stuck.shift();
      S.stuck.push({ x: shot.x, y: shot.y, ang: shot.rot, spr: shot.spr, life: rand(6, 10), b: struck });
      Sound.play('hit', volAt(shot.x, shot.y));
      return true;
    }
    return shot.life <= 0 || shot.y > S.worldH + 50 || shot.x < -50 || shot.x > S.worldW + 50;
  }
  shot.rot += dt * 26;
  shot.out -= dt;
  if (shot.out <= 0) {
    const thrower = S.players.get(shot.owner);
    if (thrower) {
      const dx = thrower.x - shot.x, dy = thrower.y - SHOULDER - shot.y, dist = Math.hypot(dx, dy) || 1;
      shot.vx += (dx / dist * 1400 - shot.vx) * Math.min(1, dt * 4); shot.vy += (dy / dist * 1400 - shot.vy) * Math.min(1, dt * 4);
      if (dist < 16) return true;
      if (shot.out < -0.05 && shot.hit.size && shot.back !== true) { shot.back = true; shot.hit.clear(); }
    }
  }
  shot.x += shot.vx * dt; shot.y += shot.vy * dt;
  const block = blockAt(shot.x, shot.y);
  if (block && !shot.hit.has(block)) {
    shot.hit.add(block);
    const speed = Math.hypot(shot.vx, shot.vy) || 1;
    IMP = { dx: shot.vx / speed, dy: shot.vy / speed, f: 420 };
    HIT = { type: 'boomerang', wn: shot.wn };
    damageBlock(block, shot.dmg, shot.x, shot.y, local);
    HIT = null;
    IMP = null;
    Sound.play('hit', volAt(shot.x, shot.y));
  }
  return shot.life <= 0 || shot.x < -50 || shot.y < -50 || shot.x > S.worldW + 50 || shot.y > S.worldH + 50;
}
const BATARANG_SPR = sprite(['k.....k', 'kk...kk', '.kkkkk.', '..kxk..']);
const THROWN_SPR = {
  hammer: sprite(['mmmm', 'mlmm', 'mmmm', '.w..', '.w..']),
  shield: sprite(['.RRR.', 'RxxxR', 'RxbxR', 'RxxxR', '.RRR.']),
  chakram: sprite(['.lll.', 'l...l', 'l...l', '.lll.']),
  glaive: sprite(['x...x', '.xxx.', 'x...x']),
  skateboard: sprite(['RRRRRR', '.k..k.']),
  bowling: sprite(['.dd.', 'dddd', 'dkdd', '.dd.']),
  balloon: sprite(['.RR.', 'RRRR', '.RR.', '..x.']),
  knife: sprite(['xxxl']),
  tknife: sprite(['kkxxxxl', '..xxxx.']),
  hand: sprite(['.y.y', 'yyyy', 'yyyy', '.yy.']),
  cheesecake: sprite(['.xxx.', 'xxxxx', 'WWWWW']),
  sub: sprite(['.WWWWW.', 'WRRRRRW', '.WWWWW.']),
  donut: sprite(['.RR.', 'R..R', '.RR.']),
  box: sprite(['WWWW', 'WwwW', 'WWWW']),
  teddy: sprite(['W.W', 'WWW', '.W.', 'WWW']),
  slide: sprite(['xxxx', 'xRRx', 'xxxx']),
  cap: sprite(['.ddd.', 'ddddd', 'xxxxx']),
  dalgona: sprite(['.ooo.', 'oyoyo', '.ooo.']),
  thing: sprite(['y.y.y', 'yyyyy', '.yyy.']),
  book: sprite(['rrrr', 'ryyr', 'rrrr']),
  buoy: sprite(['.RRR.', 'RxRxR', '.RRR.']),
  duck: sprite(['.yy.', 'yyyo', '.yy.']),
  bottle: sprite(['.WWWW.', 'WyyyWWW', '.WWWW.']),
  shake: sprite(['.x.', 'xRx', 'xRx', 'xxx']),
  plunger: sprite(['.RR.', 'RRRR', '.W..', '.W..']),
  paint: sprite(['mmm', 'mBm', 'mBm']),
  ball: sprite(['xx', 'xx']),
  flask: sprite(['.x.', '.x.', 'xBx', 'BBB']),
  goblet: sprite(['yyy', '.y.', 'yyy']),
  pizza: sprite(['.yy.', 'yRyR', 'yyyy']),
};

const PARTY_SIZE = 6;
const SLOT_W = 50, SLOT_GAP = 5, STRIP_PAD = 8, STRIP_MAX = 720, PARTY_ROWS = 2, PARTY_ROWS_TOP = 3;
function partyPerRow() {
  const vw = ($('#hud') && $('#hud').clientWidth) || window.innerWidth;
  const w = Math.min(STRIP_MAX, vw - 24) - 2 * STRIP_PAD;
  return Math.max(1, Math.floor((w + SLOT_GAP) / (SLOT_W + SLOT_GAP)));
}
function partyArrange(el) {
  const n = (S.party || []).length; if (!el || !n) return;
  const tl = $('.hud-tl'), tc = $('.hud-tc'), hudWidth = ($('#hud') && $('#hud').clientWidth) || window.innerWidth;
  const boxW = Math.max(tl ? tl.offsetWidth : 0, tc ? tc.offsetWidth : 0);
  const fits = (w) => Math.max(0, Math.floor((w - 2 * STRIP_PAD + SLOT_GAP) / (SLOT_W + SLOT_GAP)));
  const perFree = fits(hudWidth - 2 * (14 + boxW + 12));
  const inRow = perFree >= 1 && Math.ceil(n / perFree) <= PARTY_ROWS_TOP;
  const per = inRow ? perFree : partyPerRow(), rows = Math.ceil(n / per), cols = Math.ceil(n / rows);
  el.style.width = (cols * (SLOT_W + SLOT_GAP) - SLOT_GAP + 2 * STRIP_PAD) + 'px';
  el.dataset.inrow = inRow ? '1' : '0'; el.dataset.rows = String(rows);
}
function initParty() {
  const order = S.heroOrder && S.heroOrder.length ? S.heroOrder : HEROES.map((h) => h.id);
  const fit = S.heroFit || 0;
  S.partyFit = new Set(order.slice(0, fit));
  S.party = order.slice(0, Math.max(PARTY_SIZE, Math.min(fit, partyPerRow() * PARTY_ROWS)));
  if (S.hero && S.party.indexOf(S.hero.id) < 0) S.party[0] = S.hero.id;
}
function setHero(id, how) {
  const hero = loadHero(id);
  if (!hero || !S || !S.me) return false;
  const wasSig = S.me.weapon === SIG;
  S.hero = hero; S.me.hero = hero;
  setHeroWeapon(hero);
  if (wasSig || S.me.weapon >= WEAPONS.length) S.me.weapon = SIG;
  buildWeaponBar();
  S.me.nameUntil = performance.now() + 1500;
  S.me.nameHow = how || '';
  Sound.play(how === 'rescued' ? 'spawn' : 'switch');
  for (let i = 0; i < 14; i++) S.particles.push({ t: 'spark', x: S.me.x, y: S.me.y - 24, vx: rand(-160, 160), vy: rand(-200, 60), life: 0.35, max: 0.35, col: '#00a4dc' });
  showParty();
  return true;
}
function switchHero(dir) {
  if (!S || !S.me) return;
  if (!S.party) initParty();
  if (S.party.length < 2) return;
  const cur = Math.max(0, S.party.indexOf(S.hero && S.hero.id));
  setHero(S.party[(cur + dir + S.party.length) % S.party.length]);
}
function heroJoins(id, how) {
  if (!S || !S.me) return;
  if (!S.party) initParty();
  if (S.party.indexOf(id) < 0) {
    if (how === 'rescued') {
      const fit = S.partyFit || new Set();
      let slot = S.party.findIndex((p) => !fit.has(p));
      if (slot < 0) slot = S.party.length < partyPerRow() * PARTY_ROWS ? S.party.length : S.party.length - 1;
      S.party[slot] = id;
    } else {
      S.party[Math.max(0, S.party.indexOf(S.hero && S.hero.id))] = id;
    }
  }
  setHero(id, how);
  if (how === 'rescued') flashCenter('RESCUED!', 900);
}

const portraitCache = new Map();
function heroPortrait(id) {
  if (portraitCache.has(id)) return portraitCache.get(id);
  const h = loadHero(id); if (!h) return null;
  const canvas = document.createElement('canvas'); canvas.width = 22; canvas.height = 18;
  canvas.getContext('2d').drawImage(h.idle.cv, h.cx - 11, 2, 22, 18, 0, 0, 22, 18);
  portraitCache.set(id, canvas);
  return canvas;
}
function portraitImg(id, scale) {
  const src = heroPortrait(id); if (!src) return document.createElement('span');
  const canvas = document.createElement('canvas'); canvas.width = src.width; canvas.height = src.height;
  canvas.getContext('2d').drawImage(src, 0, 0);
  canvas.style.width = src.width * scale + 'px'; canvas.style.height = src.height * scale + 'px'; canvas.style.imageRendering = 'pixelated';
  return canvas;
}

let partyTimer = 0;
function showParty() {
  let el = $('#djParty');
  if (!el) { el = document.createElement('div'); el.id = 'djParty'; el.className = 'dj-party'; $('#hud').appendChild(el); }
  el.innerHTML = '';
  partyArrange(el);
  S.party.forEach((id) => {
    const slot = document.createElement('div');
    slot.className = 'dj-pslot' + (S.hero && S.hero.id === id ? ' on' : '') + (S.partyFit && S.partyFit.has(id) ? ' fit' : '');
    slot.appendChild(portraitImg(id, 2));
    el.appendChild(slot);
  });
  const nm = document.createElement('div'); nm.className = 'dj-pname'; nm.textContent = S.hero ? S.hero.name : ''; el.appendChild(nm);
  el.classList.add('show');
}

let roster = null;
function rosterOpen() { return !!roster && !roster.el.classList.contains('hidden'); }
function openRoster() {
  if (!S || !S.me || S.paused) return;
  if (!S.party) initParty();
  if (!roster) {
    const el = document.createElement('div');
    el.id = 'djRoster'; el.className = 'overlay hidden';
    el.innerHTML = '<div class="box dj-roster"><h2>Characters</h2><div class="dj-grid"></div><div class="dj-hint">Arrows / D-pad choose · Enter / A play · Esc / B close</div></div>';
    game.appendChild(el);
    roster = { el: el, grid: el.querySelector('.dj-grid'), sel: 0, ids: [] };
  }
  roster.ids = HEROES.map((h) => h.id);
  roster.grid.innerHTML = '';
  roster.ids.forEach((id, i) => {
    const h = HEROES.find((x) => x.id === id), sig = HERO_SIGS[h.sig] || {};
    const card = document.createElement('button');
    card.type = 'button'; card.className = 'dj-card' + (S.party.indexOf(id) >= 0 ? ' inparty' : '');
    card.appendChild(portraitImg(id, 3));
    const n = document.createElement('div'); n.className = 'dj-cname'; n.textContent = h.name; card.appendChild(n);
    const subtitle = document.createElement('div'); subtitle.className = 'dj-csub'; subtitle.textContent = (h.tag ? h.tag + ' · ' : '') + (sig.name || ''); card.appendChild(subtitle);
    card.addEventListener('click', () => { closeRoster(); heroJoins(id); });
    card.addEventListener('mouseenter', () => rosterSelect(i));
    roster.grid.appendChild(card);
  });
  rosterSelect(Math.max(0, roster.ids.indexOf(S.hero && S.hero.id)));
  roster.el.classList.remove('hidden');
  S.paused = true; mouse.down = false; keys.clear();
}
function closeRoster() {
  if (!roster) return;
  roster.el.classList.add('hidden');
  if (S) S.paused = false;
}
function rosterSelect(i) {
  const cards = roster.grid.children;
  roster.sel = (i + cards.length) % cards.length;
  [...cards].forEach((c, k) => c.classList.toggle('sel', k === roster.sel));
  cards[roster.sel].scrollIntoView({ block: 'nearest' });
}
function rosterCols() {
  const cards = roster.grid.children; if (cards.length < 2) return 1;
  const top = cards[0].offsetTop; let n = 0; for (const card of cards) { if (card.offsetTop !== top) break; n++; } return n || 1;
}
function rosterMove(dx, dy) { rosterSelect(roster.sel + dx + dy * rosterCols()); }
function rosterPick() { const id = roster.ids[roster.sel]; closeRoster(); heroJoins(id); }
function rosterKey(e) {
  if (!S || !S.running) return false;
  if (rosterOpen()) {
    e.preventDefault();
    if (e.type !== 'keydown') return true;
    const k = e.key, c = e.code;
    if (c === 'ArrowLeft' || k === 'ArrowLeft' || c === 'KeyA') rosterMove(-1, 0);
    else if (c === 'ArrowRight' || k === 'ArrowRight' || c === 'KeyD') rosterMove(1, 0);
    else if (c === 'ArrowUp' || k === 'ArrowUp' || c === 'KeyW') rosterMove(0, -1);
    else if (c === 'ArrowDown' || k === 'ArrowDown' || c === 'KeyS') rosterMove(0, 1);
    else if (c === 'Enter' || c === 'NumpadEnter' || c === 'Space' || k === 'Enter' || e.keyCode === 13) rosterPick();
    else if (c === 'Escape' || c === 'KeyC' || k === 'GoBack' || e.keyCode === 461 || e.keyCode === 10009) closeRoster();
    return true;
  }
  if (e.type === 'keydown' && e.code === 'KeyC' && !e.repeat && !S.paused) { e.preventDefault(); openRoster(); return true; }
  return false;
}
function rosterPad(edge, ly, lx) {
  if (edge(14) || (lx < -0.6 && !roster.held)) rosterMove(-1, 0);
  else if (edge(15) || (lx > 0.6 && !roster.held)) rosterMove(1, 0);
  else if (edge(12) || (ly < -0.6 && !roster.held)) rosterMove(0, -1);
  else if (edge(13) || (ly > 0.6 && !roster.held)) rosterMove(0, 1);
  roster.held = Math.abs(lx) > 0.6 || Math.abs(ly) > 0.6;
  if (edge(0)) rosterPick();
  else if (edge(1) || edge(9)) closeRoster();
}
let heroFont = null;
function drawHeroName(ctx, player) {
  const left = player.nameUntil - performance.now();
  if (left <= 0) return;
  if (!heroFont) heroFont = getComputedStyle(game).fontFamily || 'sans-serif';
  const name = player.hero.name;
  const tag = player.nameHow === 'rescued' ? 'rescued!' : (HEROES.find((h) => h.id === player.hero.id) || {}).tag;
  ctx.save();
  ctx.globalAlpha = Math.min(1, left / 350);
  ctx.font = '700 13px ' + heroFont;
  const nameW = ctx.measureText(name).width;
  ctx.font = '400 10px ' + heroFont;
  const tagW = tag ? ctx.measureText(tag).width : 0;
  const w = Math.ceil(Math.max(nameW, tagW)) + 16, h = tag ? 34 : 22;
  const x = Math.round(player.x - w / 2), y = Math.round(Math.max(player.y - 72 - h, S.view.y + 92));
  ctx.fillStyle = 'rgba(16,16,16,0.88)'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#00a4dc'; ctx.fillRect(x, y + h - 2, w, 2);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff';
  ctx.font = '700 13px ' + heroFont; ctx.fillText(name, x + w / 2, y + 11);
  if (tag) { ctx.font = '400 10px ' + heroFont; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillText(tag, x + w / 2, y + 24); }
  ctx.restore();
}

