
function padTarget(x, y, ang) {
  let best = null, bs = Infinity;
  queryRect(x - 900, y - 900, 1800, 1800, (block) => {
    if (block.kind !== 'media' && !(block.kind === 'box' && block.el.closest && block.el.closest('.card'))) return;
    const cx = block.x + block.w / 2, cy = block.y + block.h / 2, dist = Math.hypot(cx - x, cy - y);
    if (dist < 30) return;
    let da = Math.atan2(cy - y, cx - x) - ang; while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
    if (Math.abs(da) > 0.21) return;
    const score = Math.abs(da) + dist / 6000;
    if (score < bs) { bs = score; best = block; }
  });
  return best;
}
function aimTag(player, first, x, y, ang, tx, ty) {
  if (player !== S.me || tx === undefined) return;
  const byPad = pad.aimActive;
  let tb = byPad ? padTarget(x, y, ang) : blockAt(tx, ty);
  if (tb && tb.w * tb.h > S.VW * S.VH * 0.25) tb = null;
  const reach = tb ? Math.hypot(tb.x + tb.w / 2 - x, tb.y + tb.h / 2 - y) : byPad ? 0 : Math.hypot(tx - x, ty - y);
  if (!tb && reach < 20) return;
  const aimState = { tb, x0: x, y0: y, reach: tb && !byPad ? Math.hypot(tx - x, ty - y) : reach };
  for (let i = first; i < S.projectiles.length; i++) {
    const pr = S.projectiles[i];
    if (pr.t === 'bullet' || pr.t === 'rocket' || pr.t === 'missile' || pr.stick) pr.aim = aimState;
  }
}
game.addEventListener('mousemove', () => { pad.aimActive = false; });
function aimReached(pr) { const aimState = pr.aim; return !!aimState && Math.hypot(pr.x - aimState.x0, pr.y - aimState.y0) >= aimState.reach - 3; }
function aimEnd(pr) {
  if (hitRemnant(pr.x, pr.y, (pr.vx || 0) * 0.2)) return;
  const big = pr.dmg > 25;
  holeCircle(pr.x, pr.y, big ? 5 : 3, false);
  backdropMark(pr.x, pr.y, big);
  for (let k = 0; k < 3; k++) S.particles.push({ t: 'spark', x: pr.x, y: pr.y, vx: rand(-120, 120), vy: rand(-160, 40), life: rand(0.1, 0.25), max: 0.25 });
}
function aimHits(pr, block) {
  const aimState = pr.aim;
  if (!aimState) return true;
  return Math.hypot(pr.x - aimState.x0, pr.y - aimState.y0) >= aimState.reach - 3;
}
function aimBlockAt(pr) { const block = blockAt(pr.x, pr.y); return block && aimHits(pr, block) ? block : null; }

let HIT = null;
const CALIBRE = {
  PISTOL: 'pistol', BERETTA: 'pistol', 'GUN KATA': 'pistol', GLOCK: 'pistol',
  SMG: 'smg', SHOTGUN: 'pellet', USP: 'heavy', 'AUTO-9': 'ap',
  M60: 'rifle', MINIGUN: 'rifle', 'PULSE RIFLE': 'explosive',
};
function calibreOf(wn) {
  if (!wn) return null;
  if (CALIBRE[wn]) return CALIBRE[wn];
  if (/SHOTGUN|SAWED|BOOMSTICK|AA-12|POOFS/.test(wn)) return 'pellet';
  if (/UZI|SMG|MP5|LEG GUN|HEIST|TWIN PISTOLS|QUAD/.test(wn)) return 'smg';
  if (/RIFLE|MORITA|AMP SUIT|M60|MINIGUN/.test(wn)) return 'rifle';
  if (/MAGNUM|PYTHON|COLT|SNUB|SAMARITAN|ELEPHANT|EAGLE|\.45|EZEKIEL|FLINTLOCK|LAWGIVER|BANG/.test(wn)) return 'heavy';
  if (/BOW|SLINGSHOT|CROSSBOW/.test(wn)) return 'arrow';
  return 'pistol';
}
const SHARP = /SWORD|KATANA|KNIFE|KNIVES|MACHETE|AXE|CLAW|BLADE|SABER|SCALPEL|NEEDLE|SPEAR|TRIDENT|GLAIVE|SAW|DRILL|LONGCLAW|GLADIUS|GODSLAYER|CHAKRAM|SPOON|SPATULA|STAKE|POINTY/;
function dent(cx, cy) {
  holeDisc(cx, cy, 1); ring(cx, cy, 2, HM_RING); ring(cx, cy, 3, HM_SOFT);
  cracks(cx, cy, 4 + (Math.random() * 3 | 0), 4, 9);
}
function scorch(cx, cy) {
  if (Math.random() < 0.12) smoulderAt(cx * PX, cy * PX, 8, rand(3, 5));
  for (let radius = 1; radius <= 4; radius++) ring(cx, cy, radius, `rgba(24,14,8,${0.75 - radius * 0.14})`);
  if (Math.random() < 0.3) sdot(cx + 1, cy - 1, EMBERS[(Math.random() * 3) | 0]);
}
const HM_DARK = 'rgba(6,4,8,0.95)', HM_RING = 'rgba(0,0,0,0.68)', HM_SOFT = 'rgba(0,0,0,0.34)';
const HM_LIT = 'rgba(255,255,255,0.5)', HM_CRACK = 'rgba(0,0,0,0.72)', HM_CRACK_L = 'rgba(255,255,255,0.42)';
const sdot = (x, y, col) => paintRow('s', x, y, 1, col);
const hole = (x, y) => revealRow(x, y, 1);
function holeDisc(cx, cy, radius, jag) {
  for (let dy = -radius; dy <= radius; dy++) {
    const dx = Math.max(0, Math.floor(Math.sqrt(radius * radius - dy * dy) + (jag ? Math.round(Math.random() * 2 - 1) : 0)));
    revealRow(cx - dx, cy + dy, dx * 2 + 1);
  }
  const ri = Math.max(0, radius - 1);
  for (let dy = -ri; dy <= ri; dy++) { const dx = Math.floor(Math.sqrt(ri * ri - dy * dy)); paintRow('r', cx - dx, cy + dy, dx * 2 + 1, 'rgba(0,0,0,0.55)'); }
  paintRow('r', cx - radius, cy - radius, radius * 2 + 1, 'rgba(0,0,0,0.5)');
}
function ring(cx, cy, radius, col) {
  for (let angle = 0; angle < TAU; angle += 0.5 / Math.max(1, radius)) sdot(Math.round(cx + Math.cos(angle) * radius), Math.round(cy + Math.sin(angle) * radius), col);
}
function crack(cx, cy, len, ang, straight) {
  let x = cx, y = cy, angle = ang;
  for (let i = 0; i < len; i++) {
    if (!straight) angle += (Math.random() - 0.5) * 0.7;
    x += Math.cos(angle); y += Math.sin(angle);
    const px = Math.round(x), py = Math.round(y);
    sdot(px, py, HM_CRACK);
    if (i % 2) sdot(px + 1, py + 1, HM_CRACK_L);
    if (!straight && len > 5 && i === (len >> 1) && Math.random() < 0.35) crack(px, py, len >> 1, angle + (Math.random() < 0.5 ? 0.8 : -0.8));
  }
}
function cracks(cx, cy, n, minLen, maxLen, straight) {
  const startAngle = Math.random() * TAU;
  for (let i = 0; i < n; i++) crack(cx, cy, minLen + Math.floor(Math.random() * (maxLen - minLen + 1)), startAngle + (i / n) * TAU + (Math.random() - 0.5) * 0.9, straight);
}
function specks(cx, cy, n, spread, dirx, diry) {
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * TAU, dist = 2 + Math.random() * spread;
    sdot(Math.round(cx + Math.cos(angle) * dist + dirx * dist * 0.6), Math.round(cy + Math.sin(angle) * dist + diry * dist * 0.6), Math.random() < 0.6 ? HM_DARK : HM_LIT);
  }
}

function impactMark(block, hx, hy, dmg) {
  sweepHit(hx, hy, (HIT || {}).vx, (HIT || {}).vy);
  if (!opaqueAt(block, hx, hy)) { diagCount('hit.transparent'); return; }
  if (S.particles.length < 2300) {
    for (let k = 0; k < 9; k++) S.particles.push({ t: 'spark', x: hx, y: hy, vx: rand(-260, 260), vy: rand(-300, 80), life: rand(0.1, 0.45), max: 0.45, col: k % 4 ? undefined : '#fff2c0' });
    if (Math.random() < 0.5) fxDust(hx, hy, rand(-30, 30), rand(-35, -10), rand(3, 6), rand(0.35, 0.6));
    const nChip = 2 + ((Math.random() * 3) | 0), CH = block.kind === 'media' ? ['#2a2622', '#3a2e26', '#1c1814', '#4a3c32'] : ['#4a4a52', '#34343a', '#26262c'];
    for (let j = 0; j < nChip; j++) addDebris({ x: hx, y: hy, w: rand(1, 3), h: rand(1, 2.5), vx: rand(-160, 160), vy: rand(-240, -40), rot: 0, vr: rand(-4, 4), src: null, fill: CH[(Math.random() * CH.length) | 0], edge: null, rest: false, check: 0.2, cells: null });
    if (Math.random() < 0.5) fxEmber(hx, hy, rand(-140, 140), rand(-220, -60), rand(0.6, 1.4));
    if (Math.random() < 0.6) fxDust(hx, hy, rand(-60, 60), rand(-60, -10), rand(3, 7), rand(0.3, 0.6));
    if (Math.random() < 0.7) { const e = fxEmber(hx + rand(-2, 2), hy + rand(-2, 2), 0, 0, rand(3, 8)); e.st = 1; e.sz = rand(1.5, 3.2); }
    if (Math.random() < 0.45) smoulderAt(hx, hy, 3, rand(3, 7));
    if (Math.random() < 0.025 && block.kind !== 'word') { block.burn = 2.5; if (S.burning.size < 400) S.burning.add(block); fireSeed(block, hx, hy); }
  }
  const cx = Math.round(hx / PX), cy = Math.round(hy / PX);
  const h = HIT || {};
  const pic = block.kind === 'media';
  const sp = Math.hypot(h.vx || 0, h.vy || 0) || 1, dx = (h.vx || 0) / sp, dy = (h.vy || 0) / sp;
  if (h.type === 'melee') return SHARP.test(h.wn || '') ? slash(cx, cy, h.ang || 0, h.wn, true) : dent(cx, cy);
  if (h.type === 'flame') return scorch(cx, cy);
  if (h.type === 'stick') { const angle = h.ang || 0; for (let i = -2; i <= 2; i++) hole(Math.round(cx + Math.cos(angle) * i), Math.round(cy + Math.sin(angle) * i)); return; }
  if (h.type === 'boomerang') { crack(cx, cy, 4, -2.3, true); crack(cx, cy, 4, -0.8, true); hole(cx, cy); return; }
  const cal = calibreOf(h.wn);
  switch (cal) {
    case 'pellet':
      hole(cx, cy); sdot(cx, cy, HM_DARK); sdot(cx + 1, cy, HM_RING); sdot(cx, cy + 1, HM_RING); sdot(cx - 1, cy, HM_SOFT); sdot(cx + 1, cy + 1, HM_LIT);
      break;
    case 'smg':
      holeDisc(cx, cy, 1); ring(cx, cy, 2, HM_RING); sdot(cx + 2, cy + 1, HM_LIT);
      if (pic && Math.random() < 0.6) cracks(cx, cy, 2, 3, 5);
      break;
    case 'arrow':
      holeDisc(cx, cy, 1); crack(cx, cy, 6, Math.atan2(dy, dx), true); crack(cx, cy, 6, Math.atan2(-dy, -dx), true);
      break;
    case 'pistol':
      holeDisc(cx, cy, 2); ring(cx, cy, 3, HM_RING); ring(cx, cy, 4, HM_SOFT); sdot(cx + 3, cy + 2, HM_LIT); sdot(cx + 2, cy + 3, HM_LIT);
      cracks(cx, cy, pic ? 3 + (Math.random() * 2 | 0) : 2, 4, pic ? 8 : 5);
      break;
    case 'heavy':
      holeDisc(cx, cy, 3); ring(cx, cy, 4, HM_RING); ring(cx, cy, 5, HM_SOFT); sdot(cx + 4, cy + 3, HM_LIT); sdot(cx + 3, cy + 4, HM_LIT);
      cracks(cx, cy, pic ? 5 + (Math.random() * 2 | 0) : 3, 5, pic ? 12 : 7);
      break;
    case 'ap':
      holeDisc(cx, cy, 2); ring(cx, cy, 3, HM_RING);
      cracks(cx, cy, 4 + (Math.random() * 3 | 0), 8, 16, true);
      break;
    case 'rifle':
      holeDisc(cx, cy, 3, true); ring(cx, cy, 4, HM_RING); ring(cx, cy, 5, HM_SOFT);
      specks(cx, cy, 9, 7, dx, dy);
      cracks(cx, cy, pic ? 5 + (Math.random() * 3 | 0) : 3, 5, pic ? 13 : 8);
      break;
    case 'explosive':
      holeDisc(cx, cy, 2 + (Math.random() < 0.5 ? 1 : 0), true);
      ring(cx, cy, 4, 'rgba(28,18,14,0.75)'); ring(cx, cy, 5, 'rgba(28,18,14,0.45)'); ring(cx, cy, 6, 'rgba(28,18,14,0.2)');
      if (Math.random() < 0.35) smoulderAt(hx, hy, 4, 1.2);
      for (let i = 0; i < 3; i++) { const angle = Math.random() * TAU; sdot(Math.round(cx + Math.cos(angle) * 3), Math.round(cy + Math.sin(angle) * 3), EMBERS[(Math.random() * 3) | 0]); }
      break;
    default:
      holeCircle(hx, hy, dmg > 20 ? 6 : 3, false);
  }
}
function slash(cx, cy, ang, wn, sharp) {
  const angle = ang + Math.PI / 2 + (Math.random() - 0.5) * 0.8, len = 8 + (Math.random() * 6 | 0);
  const saber = wn === 'LIGHTSABER' || wn === 'SABER';
  for (let i = -len; i <= len; i++) {
    const x = Math.round(cx + Math.cos(angle) * i), y = Math.round(cy + Math.sin(angle) * i);
    if (saber) { hole(x, y); sdot(x, y - 1, EMBERS[2]); sdot(x, y + 1, EMBERS[1]); }
    else if (sharp) { hole(x, y); sdot(x, y - 1, HM_RING); if (i % 2) sdot(x + 1, y + 1, HM_CRACK_L); }
    else { sdot(x, y, HM_CRACK); if (i % 2) sdot(x + 1, y + 1, HM_CRACK_L); }
  }
}
