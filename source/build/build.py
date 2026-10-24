import hashlib
import unicodedata
import json
import os
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
UP = ROOT / 'upstream' / 'public'
JFCOMPAT = ROOT / 'src' / 'jfcompat.js'
SHELL = ROOT / 'src' / 'shell.js'
SETTINGS = ROOT / 'src' / 'settings.js'
GAMEPAD = (ROOT / 'src' / 'gamepad.js').read_text(encoding='utf-8')
PADHINTS = (ROOT / 'src' / 'padhints.js').read_text(encoding='utf-8')
REMOTE = (ROOT / 'src' / 'remote.js').read_text(encoding='utf-8')
TOUCH = (ROOT / 'src' / 'touch.js').read_text(encoding='utf-8')
HEROPLAY = (ROOT / 'src' / 'heroplay.js').read_text(encoding='utf-8')
FX = (ROOT / 'src' / 'fx.js').read_text(encoding='utf-8')
IMPACT = (ROOT / 'src' / 'impact.js').read_text(encoding='utf-8')
EGGS = (ROOT / 'src' / 'eggs.js').read_text(encoding='utf-8')
BREAKFX = (ROOT / 'src' / 'breakfx.js').read_text(encoding='utf-8')
WALLFIELD = (ROOT / 'src' / 'wallfield.js').read_text(encoding='utf-8')
SWEEP = (ROOT / 'src' / 'sweep.js').read_text(encoding='utf-8')
FXCORE = (ROOT / 'src' / 'fxcore.js').read_text(encoding='utf-8')
MATERIAL = (ROOT / 'src' / 'material.js').read_text(encoding='utf-8')
FIRE = (ROOT / 'src' / 'fire.js').read_text(encoding='utf-8')
JUICE = (ROOT / 'src' / 'juice.js').read_text(encoding='utf-8')
BOT = (ROOT / 'src' / 'bot.js').read_text(encoding='utf-8')
GUN_SPR_NEW = (ROOT / 'src' / 'guns.js').read_text(encoding='utf-8').rstrip('\n')
HEROES_JS = ROOT / 'src' / 'heroes.js'
HEROES2_JS = ROOT / 'src' / 'heroes2.js'
MATCH_JS = ROOT / 'src' / 'match.js'
WPARTS_JS = ROOT / 'src' / 'weaponparts.js'
ROSTER = ROOT / 'data' / 'roster.json'
QUIPS_JS = ROOT / 'src' / 'quips.js'
QPACK_JS = ROOT / 'src' / 'qpack.js'
QUIPLINES_JS = ROOT / 'src' / 'quiplines.js'
QUOTES_JSON = ROOT / 'data' / 'quotes.json'
TOP250_JSON = ROOT / 'data' / 'top250.json'
OUT = ROOT / 'dist' / 'Jellyfin-Destroy.js'
VERSION = '0.1.0'
GAME_PATCHES = [
    ("(() => {\n'use strict';\n\nconst $ = (s) => document.querySelector(s);",
     "function destroyGame(root, shell) {\n'use strict';\n\n"
     "\n"
     "const $ = (s) => root.querySelector(s);"),
    ("const menu = $('#menu'), game = $('#game')",
     "const game = $('#game')"),

    ("window.addEventListener('keydown', (e) => {\n  if (!S || !S.running) return;\n",
     "window.addEventListener('keydown', (e) => {\n  if (!S) return;\n  e.stopPropagation();\n"
     "  if (shell.settingsKey && shell.settingsKey(e)) return;\n"
     "  if (rosterKey(e)) return;\n"
     "  if (!S.running) return;\n"),
    ("  keys.add(e.code);\n});",
     "  keys.add(e.code);\n}, true);"),
    ("window.addEventListener('keyup', (e) => {\n  keys.delete(e.code);",
     "window.addEventListener('keyup', (e) => {\n  if (S) e.stopPropagation();\n  keys.delete(e.code);"),
    ("  if (e.code === 'Tab') { showScore = false; $('#score').classList.add('hidden'); }\n});",
     "  if (e.code === 'Tab') { showScore = false; $('#score').classList.add('hidden'); }\n}, true);"),
    ("  S = newState(opts);\n  menu.classList.add('hidden');",
     "  S = newState(opts);\n  shell.show();\n  startLoop();\n  padReset();\n"
     "  S.hero = opts.hero ? loadHero(opts.hero) : null;\n"
     "  S.heroOrder = opts.order || (S.hero ? [S.hero.id] : []);\n  S.heroFit = opts.fit || 0;\n"
     "  setHeroWeapon(S.hero);"),

    ("  const src = opts.url === 'demo' ? '/demo.html'\n"
     "    : S.mode === 'mp' ? `/proxy?room=${encodeURIComponent(S.room)}`\n"
     "    : `/proxy?url=${encodeURIComponent(opts.url)}`;\n"
     "  const myState = S;",
     "\n"
     "  S.html = opts.html;\n"
     "  const myState = S;"),
    ("    iframe.src = src;\n  });",
     "    iframe.srcdoc = opts.html;\n  });"),

    ("  prepareDom(doc);\n  await nextFrame(); await nextFrame();",
     "  if (shell.prepare) shell.prepare(doc);\n  prepareDom(doc);\n  await nextFrame(); await nextFrame();"),


    ("// ============================================================ main loop\n",
     GAMEPAD + PADHINTS + REMOTE + TOUCH +"\n"),
    ("  if (!S || !S.running || !S.me) return;\n  const frozen",
     "  if (!S || !S.running || !S.me) return;\n  if (padAllowed()) pollPad();\n  if (!S.paused) pollKeysAim();\n  const frozen"),

    ("game.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });",
     "game.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; pad.aimActive = false; });"),



    ("  else if (tag === 'VIDEO' && el.videoWidth) { src = el; SW = el.videoWidth; SH = el.videoHeight; }\n",
     "  else if (tag === 'VIDEO' && el.videoWidth) { src = el; SW = el.videoWidth; SH = el.videoHeight; }\n"
     "  if (!src && shell.bgSource) { const bg = shell.bgSource(el, cs, b.w, b.h); if (bg) { src = bg; SW = bg.width; SH = bg.height; } }\n"),
    ("const tx = lx(pr.px ?? pr.x), ty = ly(pr.py ?? pr.y);",
     "const tx = lx(pr.px != null ? pr.px : pr.x), ty = ly(pr.py != null ? pr.py : pr.y);"),




    ("  S.VW = S.mode === 'mp' ? MP_WIDTH : clamp(window.innerWidth, 900, 1920);",
     "  S.VW = S.mode === 'mp' ? MP_WIDTH : Math.max(320, window.innerWidth);"),



    ("      if (LEAF_TAGS.has(tag)) {\n        if (el.closest && el.closest('svg') && tag !== 'SVG') continue;\n",
     "      if (LEAF_TAGS.has(tag)) {\n        if (el.closest && el.closest('svg') && tag !== 'SVG') continue;\n"
     "        const lcs = win.getComputedStyle(el);\n"
     "        if (lcs.display === 'none' || lcs.visibility === 'hidden' || parseFloat(lcs.opacity) < 0.05) continue;\n"),
    ("const SMOKE_RAMP = ['#8a8494', '#6e6878', '#57525f', '#423e4a'];\n",
     "const SMOKE_RAMP = ['#8a8494', '#6e6878', '#57525f', '#423e4a'];\n" + HEROPLAY + FX + IMPACT + BREAKFX + WALLFIELD + SWEEP + FXCORE + MATERIAL + FIRE + JUICE + BOT + EGGS),
    ("  S.me = me;\n",
     "  S.me = me;\n  if (S.hero) { me.hero = S.hero; me.weapon = SIG; me.nameUntil = performance.now() + 2200; updateWeaponBar(); initParty(); showParty(); }\n"),
    ("  if (S.mode === 'mp') for (const p of S.players.values()) if (!p.dead && inView(p.x, p.y - 20)) nameTag(g, p);",
     "  if (S.mode === 'mp') for (const p of S.players.values()) if (!p.dead && inView(p.x, p.y - 20)) nameTag(g, p);\n"
     "  if (S.me && S.me.hero && !S.me.dead) drawHeroName(g, S.me);"),

    ("  if (/^Digit[1-7]$/.test(e.code)) selectWeapon(+e.code.slice(5) - 1);",
     "  if (/^Digit[0-7]$/.test(e.code)) { const n = +e.code.slice(5); if (n > 0) selectWeapon(n - 1); else if (WEAPONS.length > SIG) selectWeapon(SIG); }"),

    ("  flashCenter(S.mode === 'mp' ? `FIRST TO ${net.room ? net.room.firstTo : 10} KILLS` : 'DESTROY EVERYTHING!', 1800);",
     "  flashCenter(S.mode === 'mp' ? `FIRST TO ${net.room ? net.room.firstTo : 10} KILLS` : (S.hero ? esc(S.hero.name.toUpperCase()) + '<br>DESTROY EVERYTHING!' : 'DESTROY EVERYTHING!'), 2200);"),

    ("  p.muzzleT = 0.06;\n  switch (w.type) {",
     "  p.muzzleT = 0.06;\n  fxMuzzle(p, w, x, y, ang);\n"
     "  if (fireHeroWeapon(p, w, x, y, ang, R)) return;\n  switch (w.type) {"),

    ("      S.beams.push({ x1: x, y1: y, x2: ex, y2: ey, life: 0.35, max: 0.35, col: p.color });",
     "      S.beams.push({ x1: x, y1: y, x2: ex, y2: ey, life: 0.35, max: 0.35, col: w.col || p.color });"),

    ("        damageBlock(b, pr.dmg, undefined, undefined, local);\n        IMP = null;\n        if (b.alive) { b.burn = 2.5;",
     "        HIT = { type: 'flame', wn: pr.wn };\n        sweepFlame(pr.x, pr.y);\n        damageBlock(b, pr.dmg, pr.x, pr.y, local);\n        HIT = null;\n        IMP = null;\n        if (b.alive) { b.burn = 2.5;"),

    ("b = S.bands[i] = { art: makeBandArt(S.artW, BAND_H, S.artSeed, i), reveal,",
     "b = S.bands[i] = { art: shell.backdrop && shell.backdrop() ? backdropBandArt(S.artW, BAND_H, i, shell.backdrop()) : wallBandArt(S.artW, BAND_H, i), reveal,"),
    ("    g.drawImage(b.reveal, -vx, dy, S.artW * PX, BAND_H * PX);\n  }",
     "    g.drawImage(b.reveal, -vx, dy, S.artW * PX, BAND_H * PX);\n    if (b.wall) g.drawImage(b.wall, -vx, dy, S.artW * PX, BAND_H * PX);\n    if (b.dmg) g.drawImage(b.dmg, -vx, dy, S.artW * PX, BAND_H * PX);\n  }"),
    ("  const local = owner === S.me.id;\n  holeCircle(x, y, radius * 0.55);",
     "  const local = owner === S.me.id;\n  holeCircle(x, y, radius * 0.55);\n  hitRemnantsIn(x, y, radius); backdropBurn(x, y, radius * 0.45);"),
    ("        if (d % 8 === 0) holeCircle(ex, ey, 7, false);",
     "        if (d % 8 === 0) { holeCircle(ex, ey, 7, false); hitRemnant(ex, ey, dx * 200); }\n"
     "        if (d % 24 === 0 && S.particles.length < 2400) { S.particles.push({ t: 'smoke', x: ex, y: ey, vx: rand(-10, 10), vy: rand(-40, -15), s: rand(3, 6), life: rand(1, 2.2), max: 2.2 }); if (d % 96 === 0) smoulderAt(ex, ey, 8, 2); }"),

    ("      const b = blockAt(pr.x, pr.y);\n      if (b && !pr.hit.has(b)) {",
     "      const b = blockAt(pr.x, pr.y);\n      if (!b && Math.random() < 0.5) backdropRoast(pr.x, pr.y);\n      if (b && !pr.hit.has(b)) {"),

    ("    if (!S.paused) updateMe(dt);", "    if (!S.paused) { botTick(dt); updateMe(dt); }"),

    ("  g.drawImage(S.low, LO.ox - vx, LO.oy - vy, S.low.width * U, S.low.height * U);",
     "  drawSlabsHi(g, vx, vy);\n  drawDebrisHi(g, vx, vy);\n  fxBack(g, vx, vy);\n  g.drawImage(S.low, LO.ox - vx, LO.oy - vy, S.low.width * U, S.low.height * U);\n  drawLights(g, vx, vy);\n  fxFront(g, vx, vy);"),

    ("function updateParticles(dt) {\n  const P = S.particles;\n", "function updateParticles(dt) {\n  const P = S.particles;\n  fxAdopt(P);\n"),

    ("    if (!inView(p.x, p.y, 60)) continue;\n    const a = clamp(p.life / p.max, 0, 1);",
     "    if (!inView(p.x, p.y, 60) || p.t === 'smoke' || p.t === 'fire' || p.t === 'flash' || p.t === 'spark') continue;\n    const a = clamp(p.life / p.max, 0, 1);"),


    ("  // fx\n  const P = S.particles;\n  P.push({ t: 'flash', x, y, r: radius * 0.3, R: radius * 1.1, life: 0.25, max: 0.25 });\n  for (let i = 0; i < 26; i++) {\n    const a = rand(0, TAU), s = rand(60, 380);\n    P.push({ t: 'fire', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, s: rand(4, 10), life: rand(0.3, 0.7), max: 0.7 });\n  }\n  for (let i = 0; i < 14; i++) {\n    const a = rand(0, TAU), s = rand(20, 120);\n    P.push({ t: 'smoke', x: x + rand(-20, 20), y: y + rand(-20, 20), vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, s: rand(8, 18), life: rand(0.8, 1.6), max: 1.6 });\n  }\n  for (let i = 0; i < 12; i++) {\n    const a = rand(0, TAU), s = rand(200, 600);\n    P.push({ t: 'spark', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(0.2, 0.5), max: 0.5 });\n  }\n  S.cam.shake = Math.min(24, S.cam.shake + radius / 6 * volAt(x, y));\n",
     '  fxExplode(x, y, radius, weaponName);\n'),

    ("  blastDebris(x, y, radius);\n", "  blastDebris(x, y, radius);\n  sweepBlast(x, y, radius);\n"),
    ("      S.beams.push({ x1: x, y1: y, x2: ex, y2: ey, life: 0.35, max: 0.35, col: w.col || p.color });", "      railTrench(x, y, ex, ey);\n      S.beams.push({ x1: x, y1: y, x2: ex, y2: ey, life: 0.35, max: 0.35, col: w.col || p.color });"),

    ("      if (Math.random() < 0.9) S.particles.push({ t: 'smoke', x: pr.x - Math.cos(pr.ang) * 8, y: pr.y - Math.sin(pr.ang) * 8, vx: rand(-15, 15), vy: rand(-25, 0), s: pr.t === 'rocket' ? rand(4, 7) : rand(2, 4), life: 0.6, max: 0.6 });\n      S.particles.push({ t: 'fire', x: pr.x - Math.cos(pr.ang) * 8, y: pr.y - Math.sin(pr.ang) * 8, vx: -pr.vx * 0.1, vy: -pr.vy * 0.1, s: 3, life: 0.08, max: 0.1 });\n",
     '      fxTrail(pr);\n'),

    ("      case 'flame': {\n        const a = clamp(pr.life / pr.max, 0, 1), s = Math.round((6 + (1 - a) * 14) / U);\n        L.fillStyle = FIRE_RAMP[Math.min(5, Math.floor((1 - a) * 5.5))];\n        L.fillRect(x - (s >> 1), y - (s >> 1), s, s);\n        if (a > 0.5) { L.fillStyle = FIRE_RAMP[0]; L.fillRect(x - 1, y - 1, 2, 2); }\n        break;\n      }\n",
     "      case 'flame': break;\n"),

    ("    if (Math.random() < 0.5 && S.particles.length < 2400) S.particles.push({ t: 'fire', x: b.x + rand(0, b.w), y: b.y + rand(0, b.h), vx: rand(-20, 20), vy: rand(-120, -50), s: rand(3, 6), life: rand(0.3, 0.6), max: 0.6 });\n", '    fireZones(b, dt);\n'),
    ('        if (b.alive) { b.burn = 2.5; if (S.burning.size < 400) S.burning.add(b); }\n        pr.vx *= 0.3; pr.vy *= 0.3;\n', '        if (b.alive) { b.burn = 2.5; if (S.burning.size < 400) S.burning.add(b); fireSeed(b, pr.x, pr.y); }\n        pr.vx *= 0.3; pr.vy *= 0.3;\n'),

    ('life: 0.5 + R() * 0.15, max: 0.65', 'life: 1.0 + R() * 0.15, max: 1.15'),
    ('      pr.vx *= 1 - 1.8 * dt; pr.vy = pr.vy * (1 - 1.8 * dt) - 240 * dt;\n', '      pr.vx *= 1 - 0.7 * dt; pr.vy = pr.vy * (1 - 0.7 * dt) - 140 * dt;\n'),

    ("  { name: 'FLAMER',   rate: 0.028, dmg: 3, speed: 520,  spread: 0.16,", "  { name: 'FLAMER',   rate: 0.028, dmg: 3, speed: 820,  spread: 0.12,"),
    ("    case 'flame':\n      for (let i = 0; i < 2; i++) {", "    case 'flame':\n      for (let i = 0; i < 4; i++) {"),

    ("    L.fillStyle = INK; L.fillRect(x0 - 1, y0 - 1, w + 2, h + 2);\n    let drawn = false;\n    if (d.src && d.sw >= 1 && d.sh >= 1) { try { L.drawImage(d.src, d.sx, d.sy, d.sw, d.sh, x0, y0, w, h); drawn = true; } catch {} }\n    if (!drawn) { L.fillStyle = d.fill || '#8a8ca0'; L.fillRect(x0, y0, w, h); }\n    if (d.edge) { L.fillStyle = d.edge; L.fillRect(x0, y0, w, 1); L.fillRect(x0, y0, 1, h); }\n    // bevel so every shard reads as a chunky 3D piece\n    L.fillStyle = 'rgba(255,255,255,0.3)'; L.fillRect(x0, y0, w, 1); L.fillRect(x0, y0 + 1, 1, h - 1);\n    L.fillStyle = 'rgba(0,0,0,0.32)'; L.fillRect(x0, y0 + h - 1, w, 1); L.fillRect(x0 + w - 1, y0, 1, h - 1);\n", '    debrisBody(L, d, x0, y0, w, h);\n'),

    ('  const el = b.el;\n  const dmgK = 1 - b.hp / b.max;\n  el.style.transform =', "  const el = b.el;\n  const now = performance.now();\n  if (b.shT && now - b.shT < 90) return;\n  b.shT = now;\n  const dmgK = 1 - b.hp / b.max;\n  el.style.transform ="),

    ('  let ac, noise, master;\n', "  let ac, noise, master;\n  let muted = (() => { try { const v = localStorage.getItem('jf-destroy-muted'); return v === null ? null : v !== '0'; } catch (e) { return null; } })();\n"),
    ('      master = ac.createGain(); master.gain.value = 0.35; master.connect(ac.destination);\n', '      master = ac.createGain(); master.gain.value = (muted === null ? adminMuted() : muted) ? 0 : 0.35; master.connect(ac.destination);\n'),

    ('  return { init, play };\n', "  function setMuted(m) { muted = !!m; if (master) master.gain.value = muted ? 0 : 0.35; try { localStorage.setItem('jf-destroy-muted', muted ? '1' : '0'); } catch (e) {  } }\n  return { init, play, setMuted, isMuted: () => (muted === null ? adminMuted() : muted) };\n"),


    ('  b.hp -= dmg;\n', '  b.hp -= dmg;\n  if (stageBreak(b, local)) return;\n'),

    ('  const cx0 = Math.floor(x0 / DCELL), cx1 = Math.floor(x1 / DCELL), cy0 = Math.floor((y0 - 1) / DCELL), cy1 = Math.floor(y1 / DCELL);\n', '  SURF_D = false;\n  const cx0 = Math.floor(x0 / DCELL), cx1 = Math.floor(x1 / DCELL), cy0 = Math.floor((y0 - 1) / DCELL), cy1 = Math.floor(y1 / DCELL);\n'),
    ('      if (top >= y0 - 0.5 && top <= y1 && o.x + o.rw / 2 > x0 && o.x - o.rw / 2 < x1 && (best === null || top < best)) { best = top; SURF_X0 = o.x - o.rw / 2; SURF_X1 = o.x + o.rw / 2; }\n', '      if (top >= y0 - 0.5 && top <= y1 && o.x + o.rw / 2 > x0 && o.x - o.rw / 2 < x1 && (best === null || top < best)) { best = top; SURF_X0 = o.x - o.rw / 2; SURF_X1 = o.x + o.rw / 2; SURF_D = true; }\n'),
    ('        if (surfaceBelow(d.x - d.rw * 0.3, d.x + d.rw * 0.3, bot - 2, bot + 2, d) === null) {\n          d.rest = false;', '        if ((debrisSurface(d.x - d.rw * 0.45, d.x + d.rw * 0.45, bot - 12, bot + d.rh * 0.6 + 4, d) === null ? ++d.miss : (d.miss = 0)) >= 2) {\n          d.miss = 0; d.rest = false;'),
    ('        d.check = 0.25 + Math.random() * 0.1;\n', '        d.check = 0.25 + Math.random() * 0.1;\n        if (d.miss === undefined) d.miss = 0;\n'),

    ('            d.y = top - d.rh / 2; d.vx = d.vy = d.vr = 0;\n', '            d.y = top - d.rh / 2; d.vx = d.vy = d.vr = 0; d.miss = 0;\n            if (SURF_D && !d.whole) { const sink = Math.min(d.rh * rand(0.25, 0.55), 8); d.y += sink; d.rot += rand(-0.35, 0.35); d.x += rand(-3, 3); }\n'),

    ('let SURF_X0 = 0, SURF_X1 = 0; // horizontal extent of the last surface found\n', 'let SURF_X0 = 0, SURF_X1 = 0, SURF_D = false;\n'),

    ('    if (d.y > S.worldH + 100 || d.x < -200 || d.x > S.worldW + 200) { dgridRemove(d); continue; }\n', '    if (d.y > S.worldH + 100 || d.x < -200 || d.x > S.worldW + 200 || belowView(d.y, Math.max(d.w, d.h))) { dgridRemove(d); continue; }\n'),
    ('        const top = surfaceBelow(d.x - half, d.x + half, prevB, d.y + r, d);\n', '        const top = debrisSurface(d.x - half, d.x + half, prevB, d.y + r, d);\n'),

    ('  const dpr = Math.min(window.devicePixelRatio || 1, 2);\n', '  const dpr = Math.min(window.devicePixelRatio || 1, fxDprCap());\n'),

    ("function holeRect(b) {\n  const x0 = Math.floor(b.x / PX), x1 = Math.ceil((b.x + b.w) / PX);\n  const y0 = Math.floor(b.y / PX), y1 = Math.ceil((b.y + b.h) / PX);\n  const big = b.kind !== 'word' && x1 - x0 > 10 && y1 - y0 > 6;\n  for (let y = y0; y < y1; y++) {\n    const edge = big ? Math.round(Math.random() * 1.4) : 0;\n    const x = x0 + edge, w = Math.max(1, x1 - x0 - edge * 2 + Math.round(Math.random() * edge));\n    revealRow(x, y, w);\n    if (big) { paintRow('r', x, y, 1, HOLE_SHADE); paintRow('r', x + w - 1, y, 1, HOLE_LIT); }\n  }\n  if (big) { paintRow('r', x0, y0, x1 - x0, HOLE_SHADE); paintRow('r', x0, y0 + 1, x1 - x0, HOLE_SHADE2); }\n}\n", 'function holeRect(b) { holeJagged(b); }\n'),
    ("      paintRow('s', Math.round(cx + Math.cos(a) * d), Math.round(cy + Math.sin(a) * d), 1, EMBERS[(Math.random() * 3) | 0]);",
     "      if (Math.random() < 0.35) { const e = fxEmber(Math.round(cx + Math.cos(a) * d) * PX, Math.round(cy + Math.sin(a) * d) * PX, 0, 0, rand(2, 7)); e.st = 1; e.sz = rand(1, 2); }"),

    ("    damageBlock(b, 9 * dt, undefined, undefined, false);\n", "    if (!fireFate(b, dt)) damageBlock(b, 9 * dt, undefined, undefined, false);\n"),
    ('  // inner wall shading: light comes from top-left, so the top/left rim is in shadow\n  if (r >= 3) {\n', "\n  if (r >= 3 && shell.backdrop && shell.backdrop()) {\n"),

    ("  S.cam.shake = Math.max(0, S.cam.shake - dt * 40);\n  const sx = S.cam.shake ? rand(-S.cam.shake, S.cam.shake) * 0.5 : 0;\n  const sy = S.cam.shake ? rand(-S.cam.shake, S.cam.shake) * 0.5 : 0;",
     "  const shk = fxShake(dt);\n  const sx = shk ? rand(-shk, shk) : 0;\n  const sy = shk ? rand(-shk, shk) : 0;"),

    ("  hitRemnantsIn(x, y, radius); backdropBurn(x, y, radius * 0.45);", "  hitRemnantsIn(x, y, radius); backdropBurn(x, y, radius * 0.45); wallCrater(x, y, radius * 0.22); wfSoot(x, y, radius * 1.4, 0.22); juiceBlast(x, y, radius);"),

    ("  holeCircle(x, y, radius * 0.55);\n", "  holeCircle(x, y, radius * 0.55, false);\n"),
    ("    if (inView(b.x + b.w / 2, b.y + b.h / 2)) Sound.play('break', 0.7);",
     "    if (inView(b.x + b.w / 2, b.y + b.h / 2)) Sound.play(b.kind === 'media' ? (Math.random() < 0.5 ? 'glass' : 'paper') : b.kind === 'ctrl' ? 'metal' : b.kind === 'box' ? 'thud' : 'break', 0.7);"),
    ("      case 'spawn': tone(0.25, 300, 900, 0.12 * vol, 'triangle'); break;",
     "      case 'spawn': tone(0.25, 300, 900, 0.12 * vol, 'triangle'); break;\n"
     "      case 'glass': tone(0.18, 2400 + Math.random() * 1600, 1800, 0.06 * vol, 'sine'); burst(0.12, 6000, 4, 0.18 * vol, 'highpass'); break;\n"
     "      case 'metal': tone(0.3, 520 + Math.random() * 200, 480, 0.08 * vol, 'triangle'); burst(0.05, 3000, 6, 0.15 * vol, 'bandpass'); break;\n"
     "      case 'paper': burst(0.16, 2200, 0.6, 0.22 * vol, 'highpass', 900); break;\n"
     "      case 'thud': burst(0.12, 400, 1, 0.35 * vol, 'lowpass', 120); tone(0.08, 120, 60, 0.12 * vol, 'sine'); break;"),
    ("  holeRect(b);\n  if (local && S.mode === 'mp')", "  holeRect(b);\n  juiceDestroyed(b);\n  sweepDestroyed(b);\n  if (local && S.mode === 'mp')"),
    ("    const s = document.createElement('span'); s.textContent = w.name; d.appendChild(s);",
     "    const s = document.createElement('span'); s.textContent = w.name; d.appendChild(s);\n"
     "    if (w.name.length > 11) s.classList.add(w.name.length > 16 ? 'xl' : 'l');"),


    ("      S.cam.shake = Math.min(20, S.cam.shake + 6 * vol);", "      S.cam.shake = Math.min(6, S.cam.shake + 2 * vol);"),
    ("  S.view = { x: Math.round(S.cam.x + sx), y: Math.round(S.cam.y + sy) };",
     "  S.view = { x: Math.round(clamp(S.cam.x + sx, 0, Math.max(0, S.worldW - S.VW))), y: Math.round(clamp(S.cam.y + sy, 0, Math.max(0, S.worldH - S.VH))) };"),

    ("  $('#hints').classList.toggle('show', !S.paused && performance.now() - lastInput > HINT_IDLE_MS);",
     "  $('#hints').classList.toggle('show', !S.paused);\n  padHintGlyphs();\n  $('#hints').classList.toggle('pad', padMode);"),

    ("      if (pr.life <= 0) { explode(pr.x, pr.y, GRENADE.radius, GRENADE.dmg, pr.owner, GRENADE.name); dead = true; }\n    }\n    if (dead) PR.splice(i, 1);",
     "      if (pr.life <= 0) { explode(pr.x, pr.y, GRENADE.radius, GRENADE.dmg, pr.owner, GRENADE.name); dead = true; }\n"
     "    } else if (pr.t === 'boomerang') {\n      dead = updateBoomerang(pr, dt);\n    }\n    if (dead) PR.splice(i, 1);"),
    ("      case 'grenade':\n        L.save(); L.translate(x, y); L.rotate(Math.round(pr.rot / (Math.PI / 4)) * (Math.PI / 4));",
     "      case 'boomerang':\n        L.save(); L.translate(x, y); L.rotate(Math.round(pr.rot / (Math.PI / 4)) * (Math.PI / 4));\n"
     "        { const sp = (pr.spr && THROWN_SPR[pr.spr]) || BATARANG_SPR; L.drawImage(sp, -(sp.width >> 1), -(sp.height >> 1)); } L.restore(); break;\n"
     "      case 'grenade':\n        L.save(); L.translate(x, y); L.rotate(Math.round(pr.rot / (Math.PI / 4)) * (Math.PI / 4));"),
    ("function drawStickman(L, p) {\n",
     "function drawStickman(L, p) {\n  if (p.hero) return drawHero(L, p);\n"),

    ("  WEAPONS.forEach((w, i) => {\n    const d = document.createElement('div');\n    d.className = 'slot';",
     "  const order = WEAPONS.length > SIG ? [SIG, 0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5, 6];\n"
     "  order.forEach((i) => {\n    const w = WEAPONS[i];\n    const d = document.createElement('div');\n"
     "    d.className = 'slot' + (i === SIG ? ' sig' : '');\n    d.dataset.i = i;"),
    ("    d.innerHTML = `<b>${i + 1}</b>`;",
     "    d.innerHTML = `<b>${i === SIG ? 0 : i + 1}</b>`;"),
    ("  [...$('#weapons').children].forEach((el, k) => el.classList.toggle('on', k === i));",
     "  [...$('#weapons').children].forEach((el) => el.classList.toggle('on', +el.dataset.i === i));"),

    ("  b.alive = false;\n  b.el.style.visibility = 'hidden';",
     "  b.alive = false;\n  b.el.style.visibility = 'hidden';\n  if (local && shell.onBlockDestroyed) shell.onBlockDestroyed(b.el);"),
    ("$('#resumeBtn').addEventListener('click', () => togglePause(false));",
     "$('#resumeBtn').addEventListener('click', () => togglePause(false));\n$('#heroesBtn').addEventListener('click', () => { togglePause(false); openRoster(); });"),

    ("          for (let k = 0; k < 3; k++) S.particles.push({ t: 'spark', x: pr.x, y: pr.y, vx: -pr.vx * 0.1 + rand(-120, 120), vy: -pr.vy * 0.1 + rand(-120, 120), life: rand(0.1, 0.25), max: 0.25 });",
     "          for (let k = 0; k < 3; k++) S.particles.push({ t: 'spark', x: pr.x, y: pr.y, vx: -pr.vx * 0.1 + rand(-120, 120), vy: -pr.vy * 0.1 + rand(-120, 120), life: rand(0.1, 0.25), max: 0.25 });\n"
     "          fxImpact(pr.x, pr.y, pr.vx, pr.vy, b);"),

    ("  Sound.play('explode', volAt(x, y));\n}",
     "  Sound.play('explode', volAt(x, y));\n  fxRubble(x, y, radius);\n}"),

    ("      case 'pop': {\n        const x0 = lx(p.x) - 1,",
     "      case 'mflash': case 'dove': case 'feather':\n        fxDraw(L, p, x, y, a); break;\n"
     "      case 'pop': {\n        const x0 = lx(p.x) - 1,"),
    ("    if (p.t === 'flash' || p.t === 'pop') { P[j++] = p; continue; }",
     "    if (p.t === 'flash' || p.t === 'pop' || p.t === 'mflash') { P[j++] = p; continue; }"),

    ("      pr.px = pr.x - pr.vx * 0.012; pr.py = pr.y - pr.vy * 0.012;",
     "      pr.px = pr.x - pr.vx * 0.024; pr.py = pr.y - pr.vy * 0.024;"),

    ("  const dt = Math.min(0.033, (t - lastT) / 1000);",
     "  const rdt = Math.min(0.033, (t - lastT) / 1000);\n  const dt = juiceDt(rdt * fxTimeScale(rdt));"),
    ("    p.vy = -FLIP_V; p.airJump = false; p.flip = 1; p.flipDir = p.facing;",
     "    p.vy = -FLIP_V; p.airJump = false; p.flip = 1; p.flipDir = p.facing;\n    if (p === S.me && mouse.down) fxSlowmo(0.9);"),

    ("  g.drawImage(S.low, LO.ox - vx, LO.oy - vy, S.low.width * U, S.low.height * U);",
     "  g.drawImage(S.low, LO.ox - vx, LO.oy - vy, S.low.width * U, S.low.height * U);\n  drawHiGuns(g, vx, vy);"),

    ("  const len = 9 + w.gun;\n  return { x: p.x + Math.cos(p.aim) * len, y: p.y - SHOULDER + Math.sin(p.aim) * len };",
     "  const len = 9 + w.gun;\n"
     "  if (p.hero) return gunMuzzle(p);\n"
     "  return { x: p.x + Math.cos(p.aim) * len, y: p.y - SHOULDER + Math.sin(p.aim) * len };"),

    ("    const c = GUN_SPR[i].c.cloneNode();\n    c.getContext('2d').drawImage(GUN_SPR[i].c, 0, 0);\n    c.style.width = GUN_SPR[i].w * 3 + 'px'; c.style.height = GUN_SPR[i].h * 3 + 'px';",
     "    const c = weaponIcon(i);"),


    ("function fire(p, wi, x, y, ang, seed, tx, ty) {\n  const w = WEAPONS[wi];",
     "function fire(p, wi, x, y, ang, seed, tx, ty) {\n  const n0 = S.projectiles.length;\n  fireShot(p, wi, x, y, ang, seed, tx, ty);\n"
     "  aimTag(p, n0, x, y, ang, tx, ty);\n  juiceFire(p, wi);\n}\nfunction fireShot(p, wi, x, y, ang, seed, tx, ty) {\n  const w = WEAPONS[wi];"),

    ("        const b = blockAt(pr.x, pr.y);\n        if (b) {\n          dead = true;",
     "        const b = blockAt(pr.x, pr.y);\n        if (b && aimHits(pr, b)) {\n          dead = true;"),


    ("        const b = blockAt(pr.x, pr.y);\n        if (b && aimHits(pr, b)) {",
     "        const b = blockAt(pr.x, pr.y);\n"
     "        if (!b && pr.aim && aimReached(pr)) { aimEnd(pr); dead = true; break; }\n"
     "        if (!b && !pr.aim && hitRemnant(pr.x, pr.y, pr.vx * 0.2)) { dead = true; break; }\n"
     "        if (b && aimHits(pr, b)) {"),
    ("          damageBlock(b, pr.dmg, pr.x, pr.y, local);\n          IMP = null;",
     "          HIT = pr;\n          damageBlock(b, pr.dmg, pr.x, pr.y, local);\n          HIT = null;\n          IMP = null;"),

    ("(armed && blockAt(pr.x, pr.y))", "(armed && (aimBlockAt(pr) || aimReached(pr)))"),
    ("  if (b.kind !== 'word' && hx !== undefined) {\n    holeCircle(hx, hy, dmg > 20 ? 6 : 3, false);\n",
     "  if (b.kind !== 'word' && hx !== undefined) {\n    impactMark(b, hx, hy, dmg);\n"),
    ("  if (e.button === 0) mouse.down = true;\n  if (e.button === 2) throwGrenade();",
     "  mouse.x = e.clientX; mouse.y = e.clientY;\n"
     "  if (e.button === 0) { mouse.down = true; mouse.tap = true; }\n"
     "  if (e.button === 2) throwGrenade();"),
    ("  if (mouse.down && p.cd <= 0) {\n    const w = WEAPONS[p.weapon];\n    p.cd = w.rate;",
     "  if ((mouse.down || mouse.tap) && p.cd <= 0) {\n    mouse.tap = false;\n    const w = WEAPONS[p.weapon];\n    p.cd = w.rate;"),



    ("    body{overflow:visible!important}",
     "    body{overflow-y:visible!important;overflow-x:clip!important}"),
    ("  S.worldW = Math.max(S.VW, de.scrollWidth, doc.body ? doc.body.scrollWidth : 0);",
     "  S.worldW = S.VW;"),

    ("  shell.show();\n  startLoop();",
     "  S.startY = window.scrollY || 0;\n  shell.show();\n  startLoop();"),
    ("(first ? b.y < S.VH * 0.9 : true)",
     "(first ? b.y > S.startY + 30 && b.y < S.startY + S.VH * 0.9 : true)"),

    ("  S.startY = window.scrollY || 0;\n",
     "  S.startY = window.scrollY || 0;\n  eggsStart();\n"),



    ("  // impact pop: a quick white frame where the element was\n  S.particles.push({ t: 'pop', x: b.x, y: b.y, w: b.w, h: b.h, life: 0.14, max: 0.14 });\n",
     "  if (b.kind !== 'word' && clearBox(b, cs)) return;\n"),

    ("  if (!src && shell.bgSource) { const bg = shell.bgSource(el, cs, b.w, b.h); if (bg) { src = bg; SW = bg.width; SH = bg.height; } }\n  const hasBorder",
     "  if (!src && shell.bgSource) { const bg = shell.bgSource(el, cs, b.w, b.h); if (bg) { src = bg; SW = bg.width; SH = bg.height; } }\n"
     "  if (!src && b.pic && b.pic.src) { src = b.pic.src; SW = b.pic.SW; SH = b.pic.SH; }\n  const hasBorder"),
    ("    shatter(b, cs);\n    const n = clamp(Math.round(b.w / 24), 2, 10);",
     "    if (!breakFancy(b, cs)) shatter(b, cs);\n    const n = clamp(Math.round(b.w / 24), 2, 10);"),
    ("    updateDebris(dt);\n    if (S.me.muzzleT > 0) S.me.muzzleT -= dt;",
     "    updateDebris(dt);\n    updateSlabs(dt);\n    updateSmoulder(dt);\n    updateJuice(dt);\n    if (S.me.muzzleT > 0) S.me.muzzleT -= dt;"),
    ("  drawDebris(L);\n", "  drawDebris(L);\n  drawSlabs(L);\n"),

    ("  Sound.play('explode', volAt(x, y));\n  fxRubble(x, y, radius);\n}",
     "  Sound.play('explode', volAt(x, y));\n  fxRubble(x, y, radius);\n"
     "  smoulderAt(x, y, radius * 0.6, 4 + radius / 40);\n"
     "  if (radius > 60) { smoulderAt(x - radius * 0.45, y + 8, radius * 0.3, 3); smoulderAt(x + radius * 0.45, y + 8, radius * 0.3, 3); }\n}"),

    ("    if (b.burn <= 0) S.burning.delete(b);",
     "    if (b.burn <= 0) { S.burning.delete(b); smoulderAt(b.x + b.w / 2, b.y + b.h / 2, Math.min(b.w, 50), 3); }"),

    ("  S.burning.delete(b);\n  holeRect(b);",
     "  if (b.burn > 0) smoulderAt(b.x + b.w / 2, b.y + b.h * 0.7, Math.min(b.w, 60), 4);\n  S.burning.delete(b);\n  holeRect(b);"),

    ("  if (local && shell.onBlockDestroyed) shell.onBlockDestroyed(b.el);",
     "  if (local && shell.onBlockDestroyed) shell.onBlockDestroyed(b.el);\n  eggOnDestroy(b);"),

    ("  if (S.me && S.me.hero && !S.me.dead) drawHeroName(g, S.me);",
     "  if (S.me && S.me.hero && !S.me.dead) drawHeroName(g, S.me);\n  drawPops(g);"),

    (re.compile(r"// guns: grip on the left, barrel pointing right; `ay` = row the hand holds\nconst GUN_SPR = \[.*?\]\.map\(\(s\) => \(\{ \.\.\.s, c: sprite\(s\.rows\), w: s\.rows\[0\]\.length, h: s\.rows\.length \}\)\);", re.S),
     GUN_SPR_NEW),
    ("    $('#scoreTitle').textContent = 'STATS';", "    $('#scoreTitle').textContent = 'Stats';"),

    ("function frame(t) {\n  requestAnimationFrame(frame);",
     "function frame(t) {\n  if (!S) { loopOn = false; return; }\n  requestAnimationFrame(frame);"),
    ("requestAnimationFrame(frame);\nwindow.__daw =",
     "let loopOn = false;\n"
     "function startLoop() { if (!loopOn) { loopOn = true; lastT = performance.now(); requestAnimationFrame(frame); } }\n"
     "window.__daw ="),

    ("  iframe.src = 'about:blank';\n"
     "  if (net.ws) { net.ws.close(); net.ws = null; }\n"
     "  net.room = null;\n"
     "  history.replaceState(null, '', location.pathname);\n"
     "  game.classList.add('hidden');\n"
     "  menu.classList.remove('hidden');",
     "  iframe.removeAttribute('srcdoc'); iframe.src = 'about:blank';\n"
     "  if (net.ws) { net.ws.close(); net.ws = null; }\n"
     "  net.room = null;\n"
     "  game.classList.add('hidden');\n"
     "  shell.hide();"),

    (re.compile(r"function readName\(\) \{.*?\n\}\n\n\$\('#resumeBtn'\)", re.S),
     "$('#resumeBtn')"),
    ("$('#reloadBtn').addEventListener('click', () => { const u = S.url; togglePause(false); startGame({ mode: 'sp', url: u }); });",
     "$('#reloadBtn').addEventListener('click', () => { const u = S.url, h = S.html, hero = S.hero && S.hero.id, order = S.heroOrder; togglePause(false); startGame({ mode: 'sp', url: u, html: h, hero, order, fit: S.heroFit }); });"),
    (re.compile(r"\n// menu background: animated pixel art\n.*\n\}\)\(\);\n\}\)\(\);\n?$", re.S),
     "\n"
     "return { start: (html, hero, order, fit) => startGame({ mode: 'sp', url: 'jellyfin', html, hero, order, fit }), quit: goMenu, isOpen: () => !!S,\n"
     "  rescue: (id) => heroJoins(id, 'rescued'), heroId: () => (S && S.hero ? S.hero.id : null),\n"
     "  bot: (on) => botSet(on), stats: () => botStats(), test: () => (window.__djTest === true ? TESTAPI : null) };\n}\n"),
]

CSS_PATCHES = [

    (":root {", ":host {"),
    ("html, body { margin: 0; height: 100%; background: #0f0f18; color: var(--text); overflow: hidden; }\n"
     "body { font-family: 'VT323', monospace; font-size: 20px; -webkit-font-smoothing: none; }",
     ":host { all: initial; position: fixed; inset: 0; z-index: 2147483000; background: #0f0f18; color: var(--text);\n"
     "  font-family: 'VT323', monospace; font-size: 20px; -webkit-font-smoothing: none; }\n"
     ":host([hidden]) { display: none; }"),




    (".slot.on b { color: var(--gold-lo); }",
     ".slot.on b { color: var(--gold-lo); }\n.slot.sig { box-shadow: var(--bevel), 0 0 0 2px var(--red); }\n.slot.sig.on { box-shadow: inset 2px 2px 0 #fff2b0, inset -2px -2px 0 var(--gold-lo), 0 0 0 2px var(--red), 0 0 0 4px rgba(208,68,74,.45); }"),
    ("#game { background: #000; cursor: none; user-select: none; }",
     "#game { background: #000; cursor: none; user-select: none; touch-action: none; -webkit-user-select: none; }"),
    (".hints.show { opacity: 1; transform: none; }",
     ".hints.show { opacity: 1; transform: none; }\n"
     "@media (max-width: 760px) {\n"
     "  .hud-tc { left: auto; right: 14px; transform: none; }\n"
     "  .meter.wide { width: 160px; }\n"
     "  .hud-tr { top: 96px; }\n"
     "}\n"
     "@media (max-width: 640px) {\n"
     "  .hud-bc { flex-wrap: wrap; justify-content: center; width: calc(100% - 20px); bottom: 10px; gap: 6px; }\n"
     "  .slot { width: 60px; height: 44px; }\n"
     "  .slot.on { transform: translateY(-2px); }\n"
     "  .hints { display: none; }\n"
     "  .overlay .box { min-width: 0; width: calc(100% - 32px); }\n"
     "}\n"
     "@media (max-width: 480px) {\n"
     "  .hud-tc { top: 84px; }\n"
     "  .hud-tr { top: 160px; }\n"
     "}"),
]

HTML_PATCHES = [


    ('<h2>PAUSED</h2>', '<h2>Paused</h2>'),
    ('<h2>LOADING WEBSITE</h2>', '<h2>Loading page</h2>'),
    ('<h2 id="overTitle">GAME OVER</h2>', '<h2 id="overTitle">Game over</h2>'),


    (re.compile(r'<div class="hints-title">CONTROLS</div>.*?<div><kbd>TAB</kbd><span>Score</span><kbd>ESC</kbd><span>Pause</span></div>', re.S),
     '<div class="kb"><div><kbd>A</kbd><kbd>D</kbd><span>Run</span></div><div><kbd>S</kbd><span>Drop through</span></div><div><kbd>SPACE</kbd><span>Jump · again: flip</span></div><div><kbd>SPACE</kbd><em>hold</em><span>Jetpack</span></div><div><kbd>LMB</kbd><span>Shoot</span></div><div><kbd>RMB</kbd><span>Grenade</span></div><div><kbd>F</kbd><span>Special</span></div><div><kbd>1-7</kbd><span>Weapon</span></div><div><kbd>H</kbd><span>Next hero</span></div><div><kbd>C</kbd><span>All heroes</span></div><div><kbd>B</kbd><span>Autopilot</span></div><div><kbd>M</kbd><span id="djMute">Sound off</span></div><div><kbd>TAB</kbd><span>Score</span></div><div><kbd>ESC</kbd><span>Pause</span></div></div><div class="gp"><div><kbd>L</kbd><span>Run</span></div><div><kbd>R</kbd><span>Aim</span></div><div><kbd>RT</kbd><span>Shoot</span></div><div><kbd>LT</kbd><span>Grenade</span></div><div><kbd>A</kbd><span>Jump · again: flip</span></div><div><kbd>A</kbd><em>hold</em><span>Jetpack</span></div><div><kbd>▼</kbd><span>Drop through</span></div><div><kbd>LB</kbd><kbd>RB</kbd><span>Weapon</span></div><div><kbd>Y</kbd><span>Next hero</span></div><div><kbd>◀</kbd><kbd>▶</kbd><span>Hero</span></div><div><kbd>▲</kbd><span>All heroes</span></div><div><kbd>R3</kbd><span>Special</span></div><div><kbd>VIEW</kbd><span>Score</span></div><div><kbd>MENU</kbd><span>Pause</span></div></div>'),

    ('<button class="btn" id="copyLinkBtn">Copy invite link</button>',
     '<button class="btn" id="heroesBtn">Characters</button>\n      <button class="btn" id="settingsBtn">Settings</button>\n      <button class="btn" id="copyLinkBtn">Copy invite link</button>'),
    ('<button class="btn" id="quitBtn">Main menu</button>', '<button class="btn" id="quitBtn">Back to Jellyfin</button>'),
    ('<button class="btn" id="overQuit">Main menu</button>', '<button class="btn" id="overQuit">Back to Jellyfin</button>'),
]
def apply(name, text, patches):
    for i, (old, new) in enumerate(patches, 1):
        if isinstance(old, re.Pattern):
            hits = len(old.findall(text))
            if hits != 1:
                sys.exit(f'{name} patch {i}: regex matched {hits}x (need 1)')
            text = old.sub(lambda _m: new, text)
        else:
            hits = text.count(old)
            if hits != 1:
                sys.exit(f'{name} patch {i}: matched {hits}x (need 1): {old[:70]!r}')
            text = text.replace(old, new)
    return text

def strip_comments(js):
    
    import subprocess
    tsdir = os.environ.get('TYPESCRIPT') or str(pathlib.Path(os.environ.get('APPDATA', '')) / 'npm' / 'node_modules'
                                                 / 'netlify-cli' / 'node_modules' / 'typescript')
    code = ("const ts=require(process.argv[1]);let s='';process.stdin.setEncoding('utf8');"
            "process.stdin.on('data',d=>s+=d).on('end',()=>{const r=ts.transpileModule(s,{compilerOptions:"
            "{removeComments:true,target:ts.ScriptTarget.ESNext,module:ts.ModuleKind.None,newLine:ts.NewLineKind.LineFeed}});"
            "process.stdout.write(r.outputText);});")
    r = subprocess.run(['node', '-e', code, tsdir], input=js.encode('utf-8'), capture_output=True, check=False)
    if r.returncode or not r.stdout:
        sys.exit('comment strip failed:\n' + r.stderr.decode('utf-8', 'replace'))
    return r.stdout.decode('utf-8')

def main():
    game = apply('game.js', (UP / 'game.js').read_text(encoding='utf-8'), GAME_PATCHES)
    css = apply('style.css', (UP / 'style.css').read_text(encoding='utf-8'), CSS_PATCHES)
    css += '\n' + (ROOT / 'src' / 'skin.css').read_text(encoding='utf-8')
    if '--release' in sys.argv:
        css = re.sub(r'/\*.*?\*/\n?', '', css, flags=re.S)
    index = (UP / 'index.html').read_text(encoding='utf-8')
    m = re.search(r'<!-- ============ GAME ============ -->\n(.*?)\n\n<script src="game.js"></script>', index, re.S)
    if not m:
        sys.exit('index.html: game markup not found')
    html = apply('index.html', m.group(1), HTML_PATCHES)

    jfcompat = JFCOMPAT.read_text(encoding='utf-8').rstrip('\n')

    roster = json.loads(ROSTER.read_text(encoding='utf-8'))
    index = {}
    for c in roster:
        x = {'tmdb': [], 'tv': [], 'coll': [], 'imdb': [], 'actors': [],

             'chars': sorted({n.strip() for part in c['character'].split('/') for n in [part] + re.findall(r'"([^"]+)"', part) if len(n.strip()) > 3})}
        for f in c['films']:
            if f.get('tmdb'):
                (x['tv'] if f['type'] == 'series' else x['tmdb']).append(f['tmdb'])
            if f.get('imdb'): x['imdb'].append(f['imdb'])
            if f.get('tmdbCollection') and f['tmdbCollection'] not in x['coll']: x['coll'].append(f['tmdbCollection'])
            if f.get('actor') and f['actor'] not in x['actors']: x['actors'].append(f['actor'])
        index[c['id']] = x


    norm = lambda x: re.sub(r'[^a-z0-9]', '', (x or '').lower())
    coll_fr, icons, hero_fr = {}, {}, {}
    for c in roster:
        fr = c['franchise'].split(' / ')[0] if c['franchise'] not in ('The Lord of the Rings / The Hobbit',) else c['franchise']
        hero_fr[c['id']] = fr
        for f in c['films']:
            if f.get('tmdbCollection'):
                coll_fr.setdefault(f['tmdbCollection'], fr)
            if f.get('actor'):
                names = [re.sub(r'\s+', ' ', n).strip() for n in re.sub(r'"[^"]*"', '', c['character']).split('/') if len(n.strip()) > 2]
                lst = icons.setdefault(norm(f['actor']), [])
                for n in names[:1]:
                    if n not in lst:
                        lst.append(n)
    quotes, alias = {}, {}
    for q in json.loads(QUOTES_JSON.read_text(encoding='utf-8')):
        main = ('m' + q['tmdb']) if q.get('tmdb') else ('t' + q['tv']) if q.get('tv') else None
        if main and q.get('imdb'): alias.setdefault('i' + q['imdb'], main)
        if main and q.get('tvdb'): alias.setdefault('v' + str(q['tvdb']), main)
        for key in (('m' + q['tmdb']) if q.get('tmdb') else None, ('t' + q['tv']) if q.get('tv') else None, ('i' + q['imdb']) if q.get('imdb') else None):
            if key and q['q'] not in quotes.setdefault(key, []):
                quotes[key].append(q['q'])
    top = {}
    for t in json.loads(TOP250_JSON.read_text(encoding='utf-8')):
        if t.get('tmdb'): top['m' + t['tmdb']] = [t['r'], t['rt']]
        if t.get('imdb'): top['i' + t['imdb']] = [t['r'], t['rt']]


    helper_rules, helper_size = [], 0

    acc_file = ROOT / 'data' / 'helper-accepted.json'
    accepted = json.loads(acc_file.read_text(encoding='utf-8'))['files'] if acc_file.exists() else {}
    def _accepted(f):
        rel = f.relative_to(ROOT / 'helper').as_posix()
        return accepted.get(rel) == hashlib.md5(f.read_bytes()).hexdigest()
    for f in [x for x in sorted((ROOT / 'helper' / 'quips').glob('*.json')) if _accepted(x)] if (ROOT / 'helper' / 'quips').is_dir() else []:
        for r in json.loads(f.read_text(encoding='utf-8')):
            if r.get('tier', 'core') != 'core' or not isinstance(r.get('t'), list) or not isinstance(r.get('need', []), list):
                continue
            rr = {'need': r.get('need', []), 'w': r.get('w', 1), 't': [t for t in r['t'] if isinstance(t, str)]}
            ids = r.get('ids') or {}
            main = ('m' + str(ids['tmdb'])) if ids.get('tmdb') else ('t' + str(ids['tv'])) if ids.get('tv') else None
            if main and ids.get('imdb'): alias.setdefault('i' + str(ids['imdb']), main)
            if main and ids.get('tvdb'): alias.setdefault('v' + str(ids['tvdb']), main)
            size = len(json.dumps(rr, ensure_ascii=False))
            if helper_size + size > 2_000_000:
                break
            helper_rules.append(rr); helper_size += size
    if helper_rules:
        print(f'helper quips: {len(helper_rules)} rules, {helper_size // 1024} KB')


    dec_file = ROOT / 'data' / 'deceased.json'
    deceased = json.loads(dec_file.read_text(encoding='utf-8')) if dec_file.exists() else []


    nrm = lambda x: re.sub(r'[^a-z0-9]+', '', unicodedata.normalize('NFD', x or '').encode('ascii', 'ignore').decode().lower())
    hero_pairs = {}
    hj = ROOT / 'helper' / 'quotes' / 'heroes.json'
    if hj.exists() and accepted.get('quotes/heroes.json') == hashlib.md5(hj.read_bytes()).hexdigest():
        for hrec in json.loads(hj.read_text(encoding='utf-8')):
            for pr in hrec['pairs']:
                key = ('m' + str(pr['m'])) if pr.get('m') else ('v' + str(pr['v'])) if pr.get('v') else None
                if key and pr.get('quotes', 1):
                    hero_pairs.setdefault(hrec['hero'], []).append([key, nrm(pr['p']), [nrm(r) for r in pr['r']] if pr.get('r') else None])
    packed_out = OUT.parent / 'quotes' / 'packed'
    packed_out.mkdir(parents=True, exist_ok=True)
    for f in sorted((ROOT / 'helper' / 'quotes' / 'packed').glob('*.json.gz')) if (ROOT / 'helper' / 'quotes' / 'packed').is_dir() else []:
        if accepted.get('quotes/packed/' + f.name) == hashlib.md5(f.read_bytes()).hexdigest():
            (packed_out / f.name).write_bytes(f.read_bytes())
    print(f'packed quotes: {len(list(packed_out.glob("*.json.gz")))} files, hero pairs for {len(hero_pairs)} heroes')
    tables = ('const HERO_PAIRS = ' + json.dumps(hero_pairs, separators=(',', ':')) + ';' + chr(10) +
              'const ID_ALIAS = ' + json.dumps(alias, separators=(',', ':')) + ';' + chr(10) +
              'const DECEASED = new Set(' + json.dumps(deceased, separators=(',', ':')) + ');\n'
              'const HELPER_RULES = ' + json.dumps(helper_rules, separators=(',', ':'), ensure_ascii=False) + ';\n'
              'const COLL_FRANCHISE = ' + json.dumps(coll_fr, separators=(',', ':')) + ';\n'
              'const ACTOR_ICONS = ' + json.dumps(icons, separators=(',', ':'), ensure_ascii=False) + ';\n'
              'const HERO_FRANCHISE = ' + json.dumps(hero_fr, separators=(',', ':')) + ';\n'
              'const QUOTES = ' + json.dumps(quotes, separators=(',', ':'), ensure_ascii=False) + ';\n'
              'const TOP250 = ' + json.dumps(top, separators=(',', ':')) + ';\n')
    quipjs = (tables + QUIPLINES_JS.read_text(encoding='utf-8').rstrip('\n') + '\n\n' + QUIPS_JS.read_text(encoding='utf-8').rstrip('\n')
              + '\n\n' + QPACK_JS.read_text(encoding='utf-8').rstrip('\n'))
    heroes = (HEROES_JS.read_text(encoding='utf-8').replace('if (typeof module', '// node only: if (typeof module').rstrip('\n')
              + '\n\n' + HEROES2_JS.read_text(encoding='utf-8').rstrip('\n')
              + '\n\n' + WPARTS_JS.read_text(encoding='utf-8').rstrip('\n'))

    shell = ((ROOT / 'src' / 'diag.js').read_text(encoding='utf-8').rstrip('\n') + '\n\n'
             + SETTINGS.read_text(encoding='utf-8').rstrip('\n') + '\n\n' + MATCH_JS.read_text(encoding='utf-8').rstrip('\n')
             + '\n\n' + SHELL.read_text(encoding='utf-8').rstrip('\n'))
    upstream_rev = (ROOT / 'upstream' / '.git' / 'HEAD').read_text().strip()
    ref = ROOT / 'upstream' / '.git' / upstream_rev.split(' ', 1)[1] if upstream_rev.startswith('ref:') else None
    rev = ref.read_text().strip()[:7] if ref and ref.exists() else upstream_rev[:7]



    out = f"""/*! Destroy for Jellyfin {VERSION}
 * Run, jump and shoot your way through the page you are looking at in Jellyfin Web
 * (10.10.7 and 12.0+). One script, no server: the current page is copied into a
 * same-origin frame and the game plays on the copy - Jellyfin itself is untouched.
 *
 * Game: a port of "Destroy Any Website" (clone) by ychisbest,
 * https://github.com/ychisbest/destroy-any-website (upstream {rev}), MIT licence -
 * itself a remake of Hugo Duprez's game "Destroy Any Website".
 */
(function () {{
'use strict';
const CONFIG = {{
    SHORTCUT: 'Alt+Shift+D',
    SHOW_HEADER_BUTTON: true,
    GAMEPAD_START: true,
    HERO: 'auto',
}};
if (window.__destroyJellyfin) return;
window.__destroyJellyfin = {json.dumps(VERSION)};

const DJ_PLUGIN = /\/Destroy\/script\.js/i.test((document.currentScript && document.currentScript.src) || '');
let DJ_ADMIN = null;
const adminMuted = () => !DJ_ADMIN || DJ_ADMIN.StartMuted !== false;
const padAllowed = () => !DJ_ADMIN || DJ_ADMIN.ControllerEnabled !== false;

{jfcompat}

const DJ_VERSION = {json.dumps(VERSION)};
const DJ_CSS = {json.dumps(css)};
const DJ_HTML = {json.dumps(html)};

const HERO_INDEX = {json.dumps(index, separators=(',', ':'))};
{heroes}

{quipjs}

{game.rstrip()}

{shell}
}})();
"""
    if '--release' in sys.argv:
        out = strip_comments(out)
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(out, encoding='utf-8', newline='\n')
    md5 = hashlib.md5(OUT.read_bytes()).hexdigest()



    import subprocess

    def older(out, srcs):
        return not out.exists() or any(p.stat().st_mtime > out.stat().st_mtime for p in srcs if p.exists())
    if older(OUT.parent / 'heroes' / 'sheet.png', [ROOT / 'src' / 'heroes.js', ROOT / 'src' / 'heroes2.js', ROOT / 'data' / 'roster.json', ROOT / 'build' / 'hero-sheet.js']):
        subprocess.run(['node', str(ROOT / 'build' / 'hero-sheet.js')], check=True)
    packed = OUT.parent / 'quotes' / 'packed'
    if older(OUT.parent / 'quotes.zip', [packed, ROOT / 'build' / 'pack-quotes.py']):
        subprocess.run([sys.executable, str(ROOT / 'build' / 'pack-quotes.py')], check=True)
    lines = [f'{md5}  {OUT.name}']
    for rel in ('heroes/sheet.png', 'heroes/sheet.json', 'quotes.zip'):
        lines.append(f'{hashlib.md5((OUT.parent / rel).read_bytes()).hexdigest()}  {rel}')
    (OUT.parent / 'MANIFEST.md5').write_text('\n'.join(lines) + '\n', encoding='utf-8', newline='\n')
    print(f'{OUT.relative_to(ROOT)}  {OUT.stat().st_size} bytes  md5 {md5}  upstream {rev}')

if __name__ == '__main__':
    main()