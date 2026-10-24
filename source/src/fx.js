const FX_POWER = (w) => {
  if (!w) return 0;
  if (w.type === 'melee' || w.type === 'boomerang' || w.type === 'flame') return 0;
  if (w.type === 'rocket' || w.type === 'missile') return 1.6;
  if (w.type === 'rail') return 1.8;
  if (w.count > 2) return 2.0;
  if (w.rate < 0.08) return 1.15;
  return 1.0;
};
let fxSlow = 0;
function fxSlowmo(sec) { fxSlow = Math.max(fxSlow, sec); }
function fxTimeScale(rdt) { if (fxSlow > 0) { fxSlow -= rdt; return 0.4; } return 1; }

function fxMuzzle(player, w, x, y, ang) {
  const pw = FX_POWER(w);
  if (!pw) return;
  const list = S.particles;
  list.push({ t: 'mflash', x, y, ang, size: 9 + pw * 9, life: 0.055 + pw * 0.012, max: 0.055 + pw * 0.012 });
  for (let i = 0; i < 2 + pw * 3; i++) {
    const angle = ang + rand(-0.35, 0.35), speed = rand(300, 700);
    list.push({ t: 'spark', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: rand(0.05, 0.14), max: 0.14, col: i % 2 ? '#fff6d0' : '#ffd060' });
  }
  if (Math.random() < 0.15 + pw * 0.1) list.push({ t: 'smoke', x: x + Math.cos(ang) * 6, y: y + Math.sin(ang) * 6, vx: Math.cos(ang) * 40 + rand(-15, 15), vy: rand(-30, -8), s: 4 + pw * 3, life: rand(0.4, 0.8), max: 0.8 });
  if (w.type === 'bullet' || w.type === 'dual') {
    for (let i = 0; i < (w.count > 2 ? 1 : w.type === 'dual' ? 2 : 1); i++) {
      list.push({ t: 'chunk', col: '#e8b84a', x: player.x, y: player.y - SHOULDER, s: 2, vx: -player.facing * rand(90, 220), vy: rand(-340, -200), rot: 0, vr: rand(14, 30), life: 1.1, max: 1.1, g: 1 });
    }
    if (Math.random() < 0.15) setTimeout(() => Sound.play('bounce', 0.4), 300 + Math.random() * 200);
  }
  if (player === S.me) S.cam.shake = Math.min(18, S.cam.shake + 0.6 * pw * pw);
}

function fxImpact(x, y, vx, vy, block) {
  const list = S.particles, sp = Math.hypot(vx, vy) || 1, dx = vx / sp, dy = vy / sp;
  for (let i = 0; i < 9; i++) {
    const angle = Math.atan2(-dy, -dx) + rand(-0.9, 0.9), speed = rand(160, 520);
    list.push({ t: 'spark', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 80, life: rand(0.2, 0.5), max: 0.5, g: 1, col: i % 3 ? '#ffe070' : '#ffffff' });
  }
  const chip = block && block.kind === 'media' ? '#2e2824' : '#3a3a42';
  for (let i = 0; i < 3; i++) list.push({ t: 'chunk', col: chip, x, y, s: 2, vx: -dx * rand(60, 180) + rand(-80, 80), vy: rand(-260, -80), rot: 0, vr: rand(-4, 4), life: rand(0.6, 1), max: 1, g: 1 });
  list.push({ t: 'smoke', x, y, vx: -dx * 30, vy: -20, s: 5, life: 0.5, max: 0.5 });
  if (Math.random() < 0.18) {
    const angle = Math.atan2(-dy, -dx) + rand(-0.6, 0.6);
    S.beams.push({ x1: x, y1: y, x2: x + Math.cos(angle) * rand(40, 90), y2: y + Math.sin(angle) * rand(40, 90), life: 0.08, max: 0.08, col: '#ffe070' });
  }
}

function fxRubble(x, y, radius) {
  const list = S.particles, n = Math.min(26, Math.round(radius / 5));
  const COL = ['#3a3632', '#2a2622', '#55504a', '#1e1b18', '#4a4038'];
  for (let i = 0; i < n; i++) {
    const angle = rand(-Math.PI, 0) + rand(-0.4, 0.4), speed = rand(120, 420);
    list.push({ t: 'chunk', col: COL[(Math.random() * COL.length) | 0], x: x + rand(-8, 8), y: y + rand(-8, 8), s: Math.random() < 0.25 ? 3 : 2,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, rot: 0, vr: rand(-5, 5), life: rand(0.8, 1.6), max: 1.6, g: 1 });
  }
  for (let i = 0; i < Math.round(n * 0.6); i++) { const angle = rand(0, TAU), speed = rand(220, 560); list.push({ t: 'spark', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 80, life: rand(0.2, 0.55), max: 0.55, g: 1 }); }
  for (let i = 0; i < 4; i++) fxDust(x + rand(-radius * 0.3, radius * 0.3), y + rand(-10, 10), rand(-50, 50), rand(-40, 0), rand(5, 9), rand(0.6, 1.1));
}

const DOVE_UP = ['w...w', 'ww.ww', '.www.', '..w..'];
const DOVE_DN = ['.....', '.www.', 'wwwww', 'w.w.w'];
function fxDraw(ctx, particle, x, y, alpha) {
  if (particle.t === 'mflash') {
    const scale = particle.size / U * (0.65 + 0.7 * alpha);
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.round(particle.ang / (Math.PI / 16)) * (Math.PI / 16)); ctx.globalAlpha = 1;
    ctx.fillStyle = FIRE_RAMP[3]; ctx.fillRect(0, -scale * 0.22, scale * 1.9, scale * 0.44);
    ctx.fillStyle = FIRE_RAMP[2]; ctx.fillRect(0, -scale * 0.14, scale * 1.6, scale * 0.28);
    ctx.fillStyle = FIRE_RAMP[1]; ctx.fillRect(0, -scale * 0.07, scale * 1.25, scale * 0.14);
    ctx.fillStyle = FIRE_RAMP[2]; ctx.fillRect(scale * 0.32, -scale * 0.85, scale * 0.2, scale * 1.7);
    ctx.fillStyle = FIRE_RAMP[1]; ctx.fillRect(scale * 0.36, -scale * 0.55, scale * 0.12, scale * 1.1);
    pixCircle(ctx, Math.round(scale * 0.42), 0, scale * 0.42, FIRE_RAMP[1]);
    pixCircle(ctx, Math.round(scale * 0.42), 0, scale * 0.24, '#ffffff');
    ctx.restore();
    return true;
  }
  if (particle.t === 'dove') {
    const frame = ((particle.ph + (particle.max - particle.life) * 14) | 0) % 2 ? DOVE_UP : DOVE_DN;
    ctx.globalAlpha = Math.min(1, alpha * 2);
    const flip = particle.vx < 0;
    frame.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] === 'w') { ctx.fillStyle = j > 1 ? '#d4d6de' : '#ffffff'; ctx.fillRect(x + (flip ? 4 - i : i) - 2, y + j - 2, 1, 1); } });
    return true;
  }
  if (particle.t === 'feather') {
    ctx.globalAlpha = Math.min(1, alpha * 2);
    ctx.fillStyle = '#f4f4f8';
    const sway = Math.round(Math.sin(particle.ph + (particle.max - particle.life) * 5) * 1.5);
    ctx.fillRect(x + sway, y, 2, 1);
    return true;
  }
  return false;
}
