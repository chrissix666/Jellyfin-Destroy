const touch = { on: false, ui: null, held: new Set(), stickId: null, sx: 0, sy: 0, aimId: null, jumpUp: false };
const TOUCH_CSS = `
#game.dj-touching #hints { display: none; }
.dj-touch { position: absolute; inset: 0; pointer-events: none; font-family: 'Press Start 2P', monospace; }
.dj-stick { position: absolute; width: 120px; height: 120px; margin: -60px 0 0 -60px; border-radius: 50%;
  background: rgba(20,22,34,.35); box-shadow: 0 0 0 2px rgba(255,255,255,.25) inset; display: none; }
.dj-stick i { position: absolute; left: 50%; top: 50%; width: 48px; height: 48px; margin: -24px 0 0 -24px; border-radius: 50%;
  background: rgba(242,196,60,.75); box-shadow: 0 0 0 2px var(--ink); }
.dj-tb { position: absolute; pointer-events: auto; border: 0; color: var(--ink); font: inherit; font-size: 9px;
  background: linear-gradient(180deg, #ffe07a, var(--gold) 55%, #d8a02a); box-shadow: inset 2px 2px 0 #fff2b0, inset -2px -2px 0 var(--gold-lo), 0 0 0 2px var(--ink);
  opacity: .85; touch-action: none; user-select: none; -webkit-user-select: none; }
.dj-tb.on { filter: brightness(1.25); transform: translate(1px, 1px); }
.dj-jump { right: 18px; bottom: 96px; width: 84px; height: 84px; border-radius: 50%; }
.dj-gren { right: 112px; bottom: 120px; width: 70px; height: 44px; }
.dj-weap { right: 112px; bottom: 66px; width: 70px; height: 44px; }
.dj-pause { right: 14px; top: 64px; width: 44px; height: 36px; }
.dj-hero { right: 66px; top: 64px; width: 60px; height: 36px; }
`;
function touchHold(code, on) {
  if (on && !touch.held.has(code)) { touch.held.add(code); keys.add(code); }
  else if (!on && touch.held.has(code)) { touch.held.delete(code); keys.delete(code); }
}
function touchReleaseAll() {
  for (const code of touch.held) keys.delete(code);
  touch.held.clear(); touch.stickId = null; touch.aimId = null; touch.jumpUp = false;
  if (touch.ui) touch.ui.querySelector('.dj-stick').style.display = 'none';
  mouse.down = false;
}
function touchButton(cls, label, down, up) {
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'dj-tb ' + cls; button.textContent = label;
  button.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); touchInput(); button.classList.add('on'); if (S && !S.paused) down(); }, { passive: false });
  const end = (e) => { e.preventDefault(); e.stopPropagation(); button.classList.remove('on'); if (up) up(); };
  button.addEventListener('touchend', end, { passive: false });
  button.addEventListener('touchcancel', end, { passive: false });
  return button;
}
function buildTouchUi() {
  if (touch.ui) return;
  const st = document.createElement('style'); st.textContent = TOUCH_CSS; game.appendChild(st);
  const ui = document.createElement('div'); ui.className = 'dj-touch';
  ui.innerHTML = '<div class="dj-stick"><i></i></div>';
  ui.appendChild(touchButton('dj-jump', 'JUMP', () => { onJumpPress(); touchHold('Space', true); }, () => touchHold('Space', false)));
  ui.appendChild(touchButton('dj-gren', 'BOMB', () => throwGrenade()));
  ui.appendChild(touchButton('dj-weap', 'GUN', () => { if (S.me) selectWeapon((S.me.weapon + 1) % WEAPONS.length); }));
  ui.appendChild(touchButton('dj-pause', 'II', () => { touchReleaseAll(); togglePause(true); }));
  ui.appendChild(touchButton('dj-hero', 'HERO', () => switchHero(1)));
  game.appendChild(ui);
  touch.ui = ui;
}
function stickUpdate(x, y) {
  const dx = x - touch.sx, dy = y - touch.sy, k = touch.ui.querySelector('.dj-stick i');
  const len = Math.min(42, Math.hypot(dx, dy)), angle = Math.atan2(dy, dx);
  k.style.transform = `translate(${Math.cos(angle) * len}px, ${Math.sin(angle) * len}px)`;
  touchHold('KeyA', dx < -18);
  touchHold('KeyD', dx > 18);
  touchHold('KeyS', dy > 34);
  const up = dy < -34;
  if (up && !touch.jumpUp) onJumpPress();
  touch.jumpUp = up;
  touchHold('Space', up);
}
game.addEventListener('touchstart', (e) => {
  if (!S || S.paused || e.target.closest('.overlay')) return;
  e.preventDefault();
  Sound.init(); touchInput();
  if (!touch.on) { touch.on = true; game.classList.add('dj-touching'); buildTouchUi(); }
  for (const t of e.changedTouches) {
    if (touch.stickId === null && t.clientX < window.innerWidth * 0.36 && t.clientY > window.innerHeight * 0.35) {
      touch.stickId = t.identifier; touch.sx = t.clientX; touch.sy = t.clientY;
      const stick = touch.ui.querySelector('.dj-stick'); stick.style.display = 'block'; stick.style.left = t.clientX + 'px'; stick.style.top = t.clientY + 'px';
      stickUpdate(t.clientX, t.clientY);
    } else if (touch.aimId === null) {
      touch.aimId = t.identifier; mouse.x = t.clientX; mouse.y = t.clientY; mouse.down = true;
      pad.aimActive = false; kbAim.on = false;
    }
  }
}, { passive: false });
game.addEventListener('touchmove', (e) => {
  if (!touch.on || !S) return;
  e.preventDefault();
  for (const t of e.changedTouches) {
    if (t.identifier === touch.stickId) stickUpdate(t.clientX, t.clientY);
    else if (t.identifier === touch.aimId) { mouse.x = t.clientX; mouse.y = t.clientY; }
  }
}, { passive: false });
const touchEnd = (e) => {
  if (!touch.on) return;
  for (const t of e.changedTouches) {
    if (t.identifier === touch.stickId) {
      touch.stickId = null; touch.jumpUp = false;
      ['KeyA', 'KeyD', 'KeyS', 'Space'].forEach((c) => touchHold(c, false));
      touch.ui.querySelector('.dj-stick').style.display = 'none';
    } else if (t.identifier === touch.aimId) { touch.aimId = null; mouse.down = false; }
  }
};
game.addEventListener('touchend', touchEnd, { passive: false });
game.addEventListener('touchcancel', touchEnd, { passive: false });

