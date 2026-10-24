const PAD_DEADZONE = 0.2;
const PAD_AIM_R = 230;
const pad = { prev: [], held: new Set(), fire: false, aim: null, aimActive: false };

function pickPad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let any = null;
  for (const gamepad of pads) {
    if (!gamepad || !gamepad.buttons || !gamepad.buttons.length) continue;
    if (gamepad.mapping === 'standard') return gamepad;
    if (!any) any = gamepad;
  }
  return any;
}
const padButtons = (gamepad) => gamepad ? gamepad.buttons.map((button) => !!(button && (button.pressed || button.value > 0.5))) : [];

function padHold(code, on) {
  if (on && !pad.held.has(code)) { pad.held.add(code); keys.add(code); }
  else if (!on && pad.held.has(code)) { pad.held.delete(code); keys.delete(code); }
}
function padRelease() {
  for (const code of pad.held) keys.delete(code);
  pad.held.clear();
  if (pad.fire) { pad.fire = false; mouse.down = false; }
}
function padReset() {
  padRelease();
  pad.prev = padButtons(pickPad());
  pad.aim = null; pad.aimActive = false;
}

function pollPad() {
  const gamepad = pickPad();
  if (!gamepad) { if (pad.held.size || pad.fire) padRelease(); pad.prev = []; return; }
  const now = padButtons(gamepad);
  const prev = pad.prev;
  pad.prev = now;
  const edge = (i) => now[i] && !prev[i];
  const ax = (i) => { const value = gamepad.axes[i] || 0; return Math.abs(value) > PAD_DEADZONE ? value : 0; };
  const lx = ax(0), ly = ax(1), rx = ax(2), ry = ax(3);
  if (now.some(Boolean) || lx || ly || rx || ry) { touchInput(); setPadMode(true); }

  if (rosterOpen()) { padRelease(); rosterPad(edge, ly, lx); return; }
  if (S.paused) {
    padRelease();
    if (shell.settingsOpen && shell.settingsOpen()) { if (edge(1) || edge(9)) shell.closeSettings(); return; }
    if (edge(0) || edge(9)) togglePause(false);
    else if (edge(3)) $('#reloadBtn').click();
    else if (edge(1)) goMenu();
    return;
  }
  if (edge(9)) { padRelease(); togglePause(true); return; }

  if (now[8] !== !!prev[8]) {
    showScore = now[8];
    if (showScore) renderScore();
    $('#score').classList.toggle('hidden', !showScore);
  }

  padHold('KeyA', lx < -0.35);
  padHold('KeyD', lx > 0.35);
  if (edge(14)) switchHero(-1);
  if (edge(15)) switchHero(1);
  if (edge(12)) { padRelease(); openRoster(); return; }
  padHold('KeyS', ly > 0.6 || now[13]);
  if (edge(0)) onJumpPress();
  padHold('Space', now[0]);

  if (edge(3)) switchHero(1);
  if (edge(11)) special();

  if (S.me) {
    if (edge(4)) selectWeapon((S.me.weapon - 1 + WEAPONS.length) % WEAPONS.length);
    if (edge(5)) selectWeapon((S.me.weapon + 1) % WEAPONS.length);
  }
  if (edge(6)) throwGrenade();
  if (now[7] !== pad.fire) { pad.fire = now[7]; mouse.down = now[7]; if (pad.fire) pad.aimActive = true; }

  if (rx || ry) { pad.aim = Math.atan2(ry, rx); pad.aimActive = true; }
  else if (lx && pad.aimActive && pad.aim === null) pad.aim = lx > 0 ? 0 : Math.PI;
  if (lx && !rx && !ry && pad.aimActive && Math.abs(Math.cos(pad.aim)) > 0.2 && Math.sign(Math.cos(pad.aim)) !== Math.sign(lx)) {
    pad.aim = Math.PI - pad.aim;
  }
  if (pad.aimActive && S.me) {
    const angle = pad.aim === null ? (S.me.facing > 0 ? 0 : Math.PI) : pad.aim;
    const wx = S.me.x + Math.cos(angle) * PAD_AIM_R, wy = S.me.y - SHOULDER + Math.sin(angle) * PAD_AIM_R;
    mouse.x = (wx - S.cam.x) * S.scale;
    mouse.y = (wy - S.cam.y) * S.scale;
  }
}

