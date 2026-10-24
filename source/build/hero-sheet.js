'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const ctx = { console, Math, Object, Array, JSON, String, Number, Set, Map };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'src', 'heroes.js'), 'utf8').replace(/\nif \(typeof module[^\n]*\n?$/, '\n')
  + '\n' + fs.readFileSync(path.join(ROOT, 'src', 'heroes2.js'), 'utf8')
  + '\nthis.__H = { HEROES, HERO_SIGS, buildHero };', ctx);
const { HEROES, HERO_SIGS, buildHero } = ctx.__H;

const roster = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'roster.json'), 'utf8'));
const franchiseOf = {}; for (const r of roster) franchiseOf[r.id] = r.franchise || '';

const INK = [0x15, 0x11, 0x1c];
const frames = HEROES.map((H) => { const f = buildHero(H); return [f.idle].concat(f.walk); });
let fw = 0, fh = 0;
for (const fs_ of frames) for (const g of fs_) { fw = Math.max(fw, g.w); fh = Math.max(fh, g.h); }
const CW = fw + 2, CH = fh + 2, NF = 9, W = CW * NF, H = CH * HEROES.length;
const buf = Buffer.alloc(W * H * 4);
const put = (X, Y, c) => { const k = (Y * W + X) * 4; buf[k] = c[0]; buf[k + 1] = c[1]; buf[k + 2] = c[2]; buf[k + 3] = 255; };
frames.forEach((fs_, row) => fs_.forEach((g, i) => {
  const ox = i * CW + 1 + Math.floor((fw - g.w) / 2), oy = row * CH + 1 + (fh - g.h);
  const on = (x, y) => x >= 0 && y >= 0 && x < g.w && y < g.h && !!g.c[y * g.w + x];
  for (let y = -1; y <= g.h; y++) for (let x = -1; x <= g.w; x++) {
    if (on(x, y)) put(ox + x, oy + y, g.c[y * g.w + x]);
    else if (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) put(ox + x, oy + y, INK);
  }
}));

const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (b) => { let c = -1; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([l, td, c]); };
const raw = Buffer.alloc((W * 4 + 1) * H);
for (let y = 0; y < H; y++) buf.copy(raw, y * (W * 4 + 1) + 1, y * W * 4, (y + 1) * W * 4);
const ih = Buffer.alloc(13); ih.writeUInt32BE(W, 0); ih.writeUInt32BE(H, 4); ih[8] = 8; ih[9] = 6;
const OUT = path.join(ROOT, 'dist', 'heroes');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'sheet.png'), Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]));
const heroes = HEROES.map((h, row) => ({ id: h.id, name: h.name, role: h.role || '', franchise: franchiseOf[h.id] || franchiseOf[h.variantOf] || 'Other',
  weapon: ((HERO_SIGS[h.sig] || HERO_SIGS.usp || {}).name || '').replace(/_/g, ' '), row }));
fs.writeFileSync(path.join(OUT, 'sheet.json'), JSON.stringify({ cw: CW, ch: CH, frames: NF, heroes }));
console.log(`sheet.png ${W}x${H} (${HEROES.length} heroes, cell ${CW}x${CH}), ${fs.statSync(path.join(OUT, 'sheet.png')).size} bytes`);
