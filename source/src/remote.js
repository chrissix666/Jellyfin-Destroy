const kbAim = { on: false, fire: false };
const REMOTE_KEYS = { 461: 'back', 10009: 'back', 403: 'grenade', 404: 'next', 405: 'prev', 406: 'pause' };
const ARROW_CODE = { ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown', Left: 'ArrowLeft', Right: 'ArrowRight', Up: 'ArrowUp', Down: 'ArrowDown' };
const remoteHeld = new Set();

function remoteAction(e) {
  const c = e.code, k = e.key;
  if (c === 'KeyJ' || c === 'Enter' || c === 'NumpadEnter' || (!c && (k === 'Enter' || e.keyCode === 13))) return 'fire';
  if (c === 'KeyK') return 'grenade';
  if (c === 'KeyE') return 'next';
  if (c === 'KeyQ') return 'prev';
  if (k === 'GoBack' || k === 'BrowserBack' || k === 'XF86Back') return 'back';
  if (!c && REMOTE_KEYS[e.keyCode]) return REMOTE_KEYS[e.keyCode];
  if (k === 'ColorF0Red') return 'grenade';
  if (k === 'ColorF1Green') return 'next';
  if (k === 'ColorF2Yellow') return 'prev';
  if (k === 'ColorF3Blue') return 'pause';
  return null;
}
function pauseButtons() { return [...$('#pause').querySelectorAll('button')].filter((b) => !b.classList.contains('hidden')); }
function pauseNav(e) {
  const list = pauseButtons(); if (!list.length) return false;
  const i = list.indexOf(root.activeElement);
  const dir = ARROW_CODE[e.key] === 'ArrowDown' ? 1 : ARROW_CODE[e.key] === 'ArrowUp' ? -1 : 0;
  if (dir) { list[(i + dir + list.length) % list.length].focus(); return true; }
  if (remoteAction(e) === 'fire' && i >= 0) { list[i].click(); return true; }
  return false;
}

window.addEventListener('keydown', (e) => {
  if (!S || !S.running) return;
  if (shell.settingsOpen && shell.settingsOpen()) return;
  const act = remoteAction(e);
  if (S.paused) {
    if (pauseNav(e)) { e.preventDefault(); return; }
    if (act === 'back' || act === 'pause') { e.preventDefault(); togglePause(false); }
    return;
  }
  if (e.code === 'KeyH' && !e.repeat) { e.preventDefault(); touchInput(); switchHero(e.shiftKey ? -1 : 1); return; }
  if (act) {
    e.preventDefault();
    touchInput();
    if (act === 'fire') { kbAim.on = true; kbAim.fire = true; mouse.down = true; }
    else if (act === 'grenade') { kbAim.on = true; autoAim(); throwGrenade(); }
    else if (act === 'next' && S.me) selectWeapon((S.me.weapon + 1) % WEAPONS.length);
    else if (act === 'prev' && S.me) selectWeapon((S.me.weapon - 1 + WEAPONS.length) % WEAPONS.length);
    else if (act === 'back' || act === 'pause') { togglePause(true); setTimeout(() => { const first = pauseButtons()[0]; if (first) first.focus(); }, 0); }
    return;
  }
  const arrow = !e.code && ARROW_CODE[e.key];
  if (arrow) {
    e.preventDefault(); touchInput();
    if (!e.repeat && arrow === 'ArrowUp') onJumpPress();
    keys.add(arrow); remoteHeld.add(arrow);
  }
  if (/^Arrow|^Key[ADSW]$/.test(e.code || '') && !mouse.down) kbAim.on = kbAim.on || !mouseSeen;
}, true);
window.addEventListener('keyup', (e) => {
  if (!S) return;
  const act = remoteAction(e);
  if (act === 'fire' && kbAim.fire) { kbAim.fire = false; mouse.down = false; }
  const arrow = !e.code && ARROW_CODE[e.key];
  if (arrow && remoteHeld.has(arrow)) { remoteHeld.delete(arrow); keys.delete(arrow); }
}, true);

let mouseSeen = false;
game.addEventListener('mousemove', () => { mouseSeen = true; kbAim.on = false; });
game.addEventListener('mousedown', () => { mouseSeen = true; kbAim.on = false; });

function autoAim() {
  const player = S.me; if (!player) return;
  const left = keys.has('KeyA') || keys.has('ArrowLeft'), right = keys.has('KeyD') || keys.has('ArrowRight');
  const dir = left && !right ? -1 : right && !left ? 1 : (player.facing || 1);
  const sx = player.x, sy = player.y - SHOULDER;
  let best = null, bestScore = Infinity;
  queryRect(dir > 0 ? sx : sx - 600, sy - 300, 600, 600, (block) => {
    const cx = block.x + block.w / 2, cy = block.y + block.h / 2, dx = (cx - sx) * dir, dy = cy - sy;
    if (dx < 24 || Math.abs(dy) > dx * 0.5) return;
    const score = dx + Math.abs(dy) * 2;
    if (score < bestScore) { bestScore = score; best = [cx, cy]; }
  });
  const t = best || [sx + dir * 300, sy];
  mouse.x = (t[0] - S.cam.x) * S.scale;
  mouse.y = (t[1] - S.cam.y) * S.scale;
}
function pollKeysAim() { if (kbAim.on && !touch.on && !pad.aimActive) autoAim(); }

