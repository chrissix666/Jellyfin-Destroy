
const HOST_ID = 'jf-destroy-host';
const BUTTON_ID = 'jf-destroy-btn';


const escAttr = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function collectStyles() {
    const parts = [];
    const media = (sheet) => (sheet.media && sheet.media.mediaText ? ` media="${escAttr(sheet.media.mediaText)}"` : '');
    const asStyle = (sheet, fallbackText) => {
        let text = '';
        try { text = Array.from(sheet.cssRules, (r) => r.cssText).join('\n'); } catch (e) { text = fallbackText || ''; }
        return `<style${media(sheet)}>${text.replace(/<\/style/gi, '<\\/style')}</style>`;
    };
    for (const sheet of Array.from(document.styleSheets)) {
        const owner = sheet.ownerNode;
        if (sheet.disabled || (owner && owner.closest && owner.closest('#' + HOST_ID))) continue;
        if (sheet.href) parts.push(`<link rel="stylesheet" href="${escAttr(sheet.href)}"${media(sheet)}>`);
        else parts.push(asStyle(sheet, owner ? owner.textContent : ''));
    }
    for (const sheet of Array.from(document.adoptedStyleSheets || [])) parts.push(asStyle(sheet, ''));
    return parts.join('\n');
}

const DROP = 'script, noscript, iframe, object, embed, template, style, link, base, '
    + 'meta[http-equiv], #' + HOST_ID + ', #' + BUTTON_ID
    + ', .logoart-text-measure, .logoart-text-rim';

const AP_HIDE_CLASSES = ['artworkplus-threejs-hold', 'artworkplus-pending', 'artworkplus-tile-pending',
    'artworkplus-poster-pending', 'artworkplus-case-tilt-pending', 'artworkplus-threejs-pending'];

function canvasBlank(canvas) {
    try {
        const thumb = document.createElement('canvas'); thumb.width = 16; thumb.height = 16;
        const ctx = thumb.getContext('2d'); ctx.drawImage(canvas, 0, 0, 16, 16);
        const pixels = ctx.getImageData(0, 0, 16, 16).data;
        for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 8) return false;
        return true;
    } catch (e) { return false; }
}

function snapshotHtml() {
    const live = document.documentElement.querySelectorAll('*');
    const clone = document.documentElement.cloneNode(true);
    const copy = clone.querySelectorAll('*');
    if (live.length !== copy.length) console.warn('[Destroy] snapshot: element count differs', live.length, copy.length);

    for (let i = 0; i < live.length && i < copy.length; i++) {
        const original = live[i], copied = copy[i];
        const tag = original.tagName;
        if (tag === 'CANVAS') {
            let url = '';
            try { if (original.width && original.height && !canvasBlank(original)) url = original.toDataURL(); } catch (e) { }
            if (url) {
                const img = document.createElement('img');
                for (const at of Array.from(original.attributes)) img.setAttribute(at.name, at.value);
                img.setAttribute('src', url);
                const rect = original.getBoundingClientRect();
                if (!original.style.width && rect.width) img.style.width = rect.width + 'px';
                if (!original.style.height && rect.height) img.style.height = rect.height + 'px';
                copied.replaceWith(img);
            } else {
                copied.remove();
            }
            continue;
        }
        if (tag === 'INPUT') {
            if (original.type === 'checkbox' || original.type === 'radio') { if (original.checked) copied.setAttribute('checked', ''); else copied.removeAttribute('checked'); }
            else if (original.type !== 'password' && original.type !== 'file') copied.setAttribute('value', original.value);
            else copied.removeAttribute('value');
        } else if (tag === 'TEXTAREA') {
            copied.textContent = original.value;
        } else if (tag === 'VIDEO' || tag === 'AUDIO') {
            copied.removeAttribute('autoplay'); copied.removeAttribute('src');
            copied.querySelectorAll('source').forEach((s) => s.remove());
        }
        const lazySrc = original.getAttribute('data-src');
        if (lazySrc && original.classList.contains('lazy')) {
            if (tag === 'IMG') copied.setAttribute('src', lazySrc);
            else copied.style.backgroundImage = "url('" + lazySrc.replace(/'/g, "\\'") + "')";
            copied.classList.remove('lazy-hidden');
        }
        if (original.scrollLeft || original.scrollTop) copied.setAttribute('data-jf-destroy-scroll', original.scrollLeft + ',' + original.scrollTop);
    }

    clone.querySelectorAll(DROP).forEach((el) => el.remove());
    for (const cls of AP_HIDE_CLASSES) {
        if (clone.classList.contains(cls)) clone.classList.remove(cls);
        clone.querySelectorAll('.' + cls).forEach((el) => el.classList.remove(cls));
    }
    clone.querySelectorAll('[autofocus]').forEach((el) => el.removeAttribute('autofocus'));

    let head = clone.querySelector('head');
    if (!head) { head = document.createElement('head'); clone.insertBefore(head, clone.firstChild); }
    head.insertAdjacentHTML('afterbegin',
        `<base href="${escAttr(document.baseURI)}"><meta name="referrer" content="no-referrer">` + collectStyles());
    return '<!DOCTYPE html>\n' + clone.outerHTML;
}

function prepareCopy(doc) {
    const st = doc.createElement('style');
    st.textContent = '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;animation-iteration-count:1!important}';
    (doc.head || doc.documentElement).appendChild(st);
    doc.querySelectorAll('[data-jf-destroy-scroll]').forEach((el) => {
        const [x, y] = el.getAttribute('data-jf-destroy-scroll').split(',').map(Number);
        el.scrollLeft = x; el.scrollTop = y;
    });
    fillLazyPictures(doc);
    preloadBackgrounds(doc);
    for (const im of doc.images) { if (im.complete && im.decode) im.decode().catch(() => {}); else im.addEventListener('load', () => { if (im.decode) im.decode().catch(() => {}); }, { once: true }); }
}

function fillLazyPictures(doc) {
    let n = 0;
    for (const el of doc.querySelectorAll('.lazy[data-src]')) {
        el.style.backgroundImage = 'url("' + el.getAttribute('data-src') + '")';
        el.classList.remove('lazy');
        if (++n > 1500) break;
    }
    const api = window.ApiClient;
    if (!api || typeof api.getScaledImageUrl !== 'function') return;
    const win = doc.defaultView;
    n = 0;
    for (const card of doc.querySelectorAll('.card[data-id]')) {
        const box = card.querySelector('.cardContent .cardImageContainer') || card.querySelector('div.cardImageContainer');
        if (!box || box.querySelector('img')) continue;
        const bi = win.getComputedStyle(box).backgroundImage;
        if (bi && bi !== 'none') continue;
        const id = card.getAttribute('data-id');
        const wide = /backdropCard|overflowBackdropCard|landscapeCard|thumbCard/.test(card.className);
        const img = doc.createElement('img');
        img.alt = '';
        img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:0;object-fit:cover';
        let tries = wide ? ['Thumb', 'Backdrop', 'Primary'] : ['Primary'];
        const next = () => {
            const type = tries.shift();
            if (!type) { img.remove(); return; }
            img.src = api.getScaledImageUrl(id, wide ? { type, fillWidth: 480, fillHeight: 270, quality: 90 } : { type, fillHeight: 540, fillWidth: 360, quality: 90 });
        };
        img.onerror = next;
        img.onload = () => { if (img.decode) img.decode().catch(() => {}); };
        next();
        box.appendChild(img);
        if (++n > 600) break;
    }
}

const bgImages = new Map();
const URL_RE = /url\(\s*(['"]?)(.*?)\1\s*\)/;

function preloadBackgrounds(doc) {
    const win = doc.defaultView;
    for (const el of doc.body ? doc.body.getElementsByTagName('*') : []) {
        const bi = el.style.backgroundImage || (win.getComputedStyle(el).backgroundImage);
        if (!bi || bi === 'none') continue;
        const match = URL_RE.exec(bi);
        if (!match) continue;
        const abs = new URL(match[2], doc.baseURI).href;
        if (bgImages.has(abs)) continue;
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => { if (img.decode) img.decode().catch(() => {}); };
        img.src = abs;
        bgImages.set(abs, img);
        if (bgImages.size > 1500) break;
    }
}

const firstLayer = (value) => { let depth = 0; for (let i = 0; i < value.length; i++) { const ch = value[i]; if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === ',' && !depth) return value.slice(0, i).trim(); } return value.trim(); };
const lenOf = (value, box) => (value.endsWith('%') ? parseFloat(value) / 100 * box : parseFloat(value));

const bgCache = new WeakMap();
function bgSource(el, cs, w, h) {
    const match = URL_RE.exec(cs.backgroundImage || '');
    if (!match || w < 4 || h < 4) return null;
    const key = match[2] + '|' + Math.round(w) + 'x' + Math.round(h) + '|' + cs.backgroundSize + '|' + cs.backgroundPositionX + '|' +
        cs.backgroundPositionY + '|' + cs.backgroundColor;
    const hit = bgCache.get(el);
    if (hit && hit.key === key) return hit.c;
    const canvas = bgRender(el, cs, w, h, match);
    if (canvas) bgCache.set(el, { key, c: canvas });
    return canvas;
}
const bgDpr = () => Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
function bgRender(el, cs, w, h, match) {
    const abs = new URL(match[2], document.baseURI).href;
    let img = bgImages.get(abs);
    if (!img) { img = new Image(); img.decoding = 'async'; img.src = abs; bgImages.set(abs, img); }
    if (!img.complete || !img.naturalWidth) {
        const canvas = document.createElement('canvas'), ratio = Math.min(bgDpr(), 1024 / Math.max(w, h));
        canvas.width = Math.max(1, Math.round(w * ratio)); canvas.height = Math.max(1, Math.round(h * ratio)); canvas.__v = 0; canvas.__pending = true;
        const placeholderCtx = canvas.getContext('2d');
        placeholderCtx.fillStyle = 'rgba(40,40,44,1)'; placeholderCtx.fillRect(0, 0, canvas.width, canvas.height);
        img.addEventListener('load', () => { const ready = bgRender(el, cs, w, h, match); if (ready && !ready.__pending) { placeholderCtx.clearRect(0, 0, canvas.width, canvas.height); placeholderCtx.drawImage(ready, 0, 0, canvas.width, canvas.height); canvas.__v++; canvas.__pending = false; } }, { once: true });
        return canvas;
    }
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const size = firstLayer(cs.backgroundSize || 'auto').split(/\s+/);
    let dw, dh;
    if (size[0] === 'cover' || size[0] === 'contain') {
        const k = size[0] === 'cover' ? Math.max(w / iw, h / ih) : Math.min(w / iw, h / ih);
        dw = iw * k; dh = ih * k;
    } else {
        const sw = size[0] || 'auto', sh = size[1] || 'auto';
        dw = sw === 'auto' ? null : lenOf(sw, w);
        dh = sh === 'auto' ? null : lenOf(sh, h);
        if (dw === null && dh === null) { dw = iw; dh = ih; }
        else if (dw === null) dw = iw * dh / ih;
        else if (dh === null) dh = ih * dw / iw;
    }
    const px = firstLayer(cs.backgroundPositionX || '50%'), py = firstLayer(cs.backgroundPositionY || '50%');
    const pos = (value, box, pic) => (value.endsWith('%') ? (box - pic) * parseFloat(value) / 100 : parseFloat(value) || 0);
    const k = Math.min(bgDpr(), 1024 / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * k)); canvas.height = Math.max(1, Math.round(h * k));
    const ctx = canvas.getContext('2d');
    ctx.scale(k, k);
    if (cs.backgroundColor && !/rgba\([^)]*,\s*0\)|transparent/.test(cs.backgroundColor)) { ctx.fillStyle = cs.backgroundColor; ctx.fillRect(0, 0, w, h); }
    try { ctx.drawImage(img, pos(px, w, dw), pos(py, h, dh), dw, dh); } catch (e) { return null; }
    return canvas;
}

let host = null, game = null, savedOverflow = null;

function themeVars() {
    const probe = (cls) => {
        const el = document.createElement('div');
        el.className = cls;
        el.style.cssText = 'position:absolute;left:-9999px;top:0;width:10px;height:10px;';
        document.body.appendChild(el);
        const cs = getComputedStyle(el), out = { bg: cs.backgroundColor, color: cs.color };
        el.remove();
        return out;
    };
    const solid = (color) => !!color && color !== 'transparent' && !/rgba\([^)]*,\s*0\)$/.test(color);
    const set = (name, val) => { if (solid(val)) host.style.setProperty(name, val); };
    try {
        const submit = probe('button-submit'), raised = probe('raised'), panel = probe('formDialogHeader'), sec = probe('fieldDescription');
        set('--jf-accent', submit.bg); set('--jf-accent-text', submit.color);
        set('--jf-raised', raised.bg); set('--jf-text', raised.color);
        set('--jf-panel', panel.bg); set('--jf-muted', sec.color);
        set('--jf-bg', getComputedStyle(document.documentElement).backgroundColor);
        const font = getComputedStyle(document.body).fontFamily;
        if (font) host.style.setProperty('--jf-font', font);
    } catch (e) { }
}

const shellApi = {
    show() {
        host.hidden = false;
        themeVars();
        host.focus({ preventScroll: true });
        if (savedOverflow === null) {
            savedOverflow = document.documentElement.style.overflow;
            document.documentElement.style.overflow = 'hidden';
        }
    },
    hide() {
        diagEnd('closed');
        host.hidden = true;
        if (savedOverflow !== null) { document.documentElement.style.overflow = savedOverflow; savedOverflow = null; }
        const btn = document.getElementById(BUTTON_ID);
        if (btn) btn.focus({ preventScroll: true });
    },
    prepare: prepareCopy,
    onBlockDestroyed: (el) => rescueFromPoster(el),
    bgSource: bgSource,
    fxQuality: () => settings.fxq,
    backdrop: () => bdImage,
    settingsKey: (e) => settingsKey(e),
    settingsOpen: () => settingsOpen(),
    closeSettings: () => closeSettings(),
};

function ensureHost() {
    if (host && host.isConnected) return;
    host = document.createElement('div');
    host.id = HOST_ID;
    host.hidden = true;
    host.tabIndex = -1;
    host.style.outline = 'none';
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${DJ_CSS}</style>${DJ_HTML}`;
    document.body.appendChild(host);
    game = destroyGame(root, shellApi);
    wireSettings(root);
}

const rescued = new Set();
function rescueFromPoster(el) {
    try {
        if (!el || !el.closest) return;
        const isPicture = el.tagName === 'IMG' || (el.classList && (el.classList.contains('cardImageContainer') || el.classList.contains('cardImage')));
        if (!isPicture) return;
        const card = el.closest('[data-id]');
        const id = card && card.getAttribute('data-id');
        const api = window.ApiClient;
        if (!id || rescued.has(id) || !api) return;
        rescued.add(id);
        api.getItem(api.getCurrentUserId(), id).then((item) => {
            if (!item) return null;
            if ((item.Type === 'Season' || item.Type === 'Episode') && item.SeriesId) return api.getItem(api.getCurrentUserId(), item.SeriesId);
            return item;
        }).then((item) => {
            if (!item || !game || !game.isOpen()) return;
            return heroesForItem(item).then((fit) => {
                if (!game || !game.isOpen()) return;
                const cur = game.heroId();
                const pick = fit.filter((h) => h !== cur);
                if (pick.length) game.rescue(pick[(Math.random() * pick.length) | 0]);
            });
        }).catch(() => {});
    } catch (e) { }
}

let bdImage = null;
function loadBackdrop() {
    if (window.__djNoBackdrop) return Promise.resolve(null);
    try {
        const box = document.querySelector('.backdropContainer');
        const el = box && !box.classList.contains('hide') && box.querySelector('.backdropImage.displayingBackdropImage');
        const match = el && /url\(\s*["']?([^"')]+)["']?\s*\)/.exec(el.style.backgroundImage || '');
        if (!match || getComputedStyle(box).display === 'none') return Promise.resolve(null);
        return new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = match[1]; });
    } catch (e) { return Promise.resolve(null); }
}
let startSrc = 'api', startWait = 0;
function startFrom(src) { startSrc = src; start(); }
function start(forceHero) {
    if (game && game.isOpen()) return;
    if (jfcompat.isRoute('video') || !canPlay()) return;
    if (document.querySelector('.docspinner.mdlSpinnerActive') && startWait < 12) { startWait++; setTimeout(() => start(forceHero), 250); return; }
    startWait = 0;
    ensureHost();
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    const html = snapshotHtml();
    const fixed = typeof forceHero === 'string' ? forceHero : (settings.hero !== 'auto' ? settings.hero : null);
    const bd = Promise.race([loadBackdrop(), new Promise((res) => setTimeout(() => res(null), 2500))]);
    Promise.all([detectHero(), bd]).then(([plan, img]) => {
        bdImage = img;
        if (typeof window.__djFit === 'number') plan.fit = Math.min(window.__djFit, plan.order.length);
        if (fixed && plan.order.indexOf(fixed) >= 0) plan = { hero: fixed, order: [fixed].concat(plan.order.filter((id) => id !== fixed)) };
        if (!game.isOpen()) {
            diagStart({ src: startSrc, page: diagPage(), hero: plan.hero, fit: plan.fit, fixed: fixed || null, backdrop: !!img, html: html.length });
            startSrc = 'api';
            game.start(html, plan.hero, plan.order, plan.fit);
        }
    });
}

const ICON_PATH = 'M189-160q-60 0-102.5-43T42-307q0-9 1-18t3-18l84-336q14-54 57-87.5t98-33.5h390q55 0 98 33.5t57 87.5l84 336q2 9 3.5 18.5T919-307q0 61-43.5 104T771-160q-42 0-78-22t-54-60l-28-58q-5-10-15-15t-21-5H385q-11 0-21 5t-15 15l-28 58q-18 38-54 60t-78 22Zm3-80q19 0 34.5-10t23.5-27l28-57q15-31 44-48.5t63-17.5h190q34 0 63 18t45 48l28 57q8 17 23.5 27t34.5 10q28 0 48-18.5t21-46.5q0 1-2-19l-84-335q-7-27-28-44t-49-17H285q-28 0-49.5 17T208-659l-84 335q-2 6-2 18 0 28 20.5 47t49.5 19Zm348-280q17 0 28.5-11.5T580-560q0-17-11.5-28.5T540-600q-17 0-28.5 11.5T500-560q0 17 11.5 28.5T540-520Zm80-80q17 0 28.5-11.5T660-640q0-17-11.5-28.5T620-680q-17 0-28.5 11.5T580-640q0 17 11.5 28.5T620-600Zm0 160q17 0 28.5-11.5T660-480q0-17-11.5-28.5T620-520q-17 0-28.5 11.5T580-480q0 17 11.5 28.5T620-440Zm80-80q17 0 28.5-11.5T740-560q0-17-11.5-28.5T700-600q-17 0-28.5 11.5T660-560q0 17 11.5 28.5T700-520Zm-360 60q13 0 21.5-8.5T370-490v-40h40q13 0 21.5-8.5T440-560q0-13-8.5-21.5T410-590h-40v-40q0-13-8.5-21.5T340-660q-13 0-21.5 8.5T310-630v40h-40q-13 0-21.5 8.5T240-560q0 13 8.5 21.5T270-530h40v40q0 13 8.5 21.5T340-460Z';

const HEADER_BUTTON_ORDER = ['randomMovieButton', 'jf-scroll-btn', 'jf-fullscreen-btn', 'jf-cinema-btn', BUTTON_ID];
function headerButtonRank(el) {
    return el.id === 'randomMovieButtonContainer' ? 0 : HEADER_BUTTON_ORDER.indexOf(el.id);
}
function placeInOrder(box, el) {
    const myRank = headerButtonRank(el);
    let ref = null;
    for (const child of box.children) {
        if (child === el) continue;
        const rank = headerButtonRank(child);
        if (rank === -1 || rank > myRank) { ref = child; break; }
    }
    if (el.parentElement !== box || el.nextElementSibling !== ref) box.insertBefore(el, ref);
}

function buildButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = BUTTON_ID;
    const icon = document.createElement('span');
    icon.className = 'material-icons';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" style="display:block"><path d="' + ICON_PATH + '"/></svg>';
    btn.appendChild(icon);
    btn.addEventListener('click', () => startFrom('button'));
    return btn;
}

function injectMuiStyle() {
    if (document.getElementById('jf-destroy-mui-style')) return;
    const style = document.createElement('style');
    style.id = 'jf-destroy-mui-style';
    style.textContent = `
        #${BUTTON_ID}.jf-mui-header-btn {
            display:inline-flex; align-items:center; justify-content:center;
            position:relative; box-sizing:border-box; flex:0 0 auto;
            padding:12px; margin:0; border:0; border-radius:50%;
            background-color:transparent; color:inherit; font-size:1.75rem;
            cursor:pointer; outline:0; vertical-align:middle;
            -webkit-tap-highlight-color:transparent;
            transition:background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }
        #${BUTTON_ID}.jf-mui-header-btn > .material-icons { font-size:1.5rem; line-height:1; }
        @media (hover: hover) {
            #${BUTTON_ID}.jf-mui-header-btn:hover { background-color:var(--jf-mui-hover, rgba(255, 255, 255, 0.08)); }
        }`;
    document.head.appendChild(style);
}

function canPlay() {
    if (DJ_PLUGIN && !DJ_ADMIN) return false;
    return !DJ_ADMIN || DJ_ADMIN.Enabled !== false;
}

function loadAdmin() {
    if (!DJ_PLUGIN) return;
    const api = window.ApiClient;
    if (!api || !api.getCurrentUserId || !api.getCurrentUserId() || !api.ajax) { setTimeout(loadAdmin, 1500); return; }
    api.ajax({ type: 'GET', url: api.getUrl('Destroy/ClientConfiguration'), dataType: 'json' }).then((cfg) => {
        DJ_ADMIN = cfg || {};
        settings = loadSettings();
        applyPersonalUI();
        updateButtonTitle();
        replaceButton();
        if (navigator.getGamepads && Array.from(navigator.getGamepads()).some(Boolean)) watchPads();
    }, () => setTimeout(loadAdmin, 5000));
}
setTimeout(loadAdmin, 0);

function placeButton(box) {
    if (!settings.button || !canPlay() || jfcompat.isRoute('video')) {
        const old = document.getElementById(BUTTON_ID);
        if (old) old.remove();
        return;
    }
    if (!box) return;
    let btn = document.getElementById(BUTTON_ID);
    if (!btn) { btn = buildButton(); }
    if (jfcompat.isMui()) {
        injectMuiStyle();
        btn.className = 'jf-mui-header-btn';
        btn.style.setProperty('--jf-mui-hover', jfcompat.getMuiHoverColor());
    } else {
        btn.className = 'headerButton headerButtonRight paper-icon-button-light';
    }
    updateButtonTitle();
    if (!jfcompat.isMui() && btn.parentElement === box) return;
    placeInOrder(box, btn);
}

jfcompat.onHeaderBoxChange(placeButton);

let padTimer = 0, comboPrev = false;
function pollStartCombo() {
    const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
    if (!pads.length) { clearInterval(padTimer); padTimer = 0; comboPrev = false; return; }
    if (!settings.pad || !canPlay() || document.hidden || (game && game.isOpen())) { comboPrev = true; return; }
    const combo = pads.some((pad) => pad.buttons[8] && pad.buttons[8].pressed && pad.buttons[9] && pad.buttons[9].pressed);
    if (combo && !comboPrev) startFrom('pad');
    comboPrev = combo;
}
function watchPads() { if (!padTimer) padTimer = setInterval(pollStartCombo, 120); }
const replaceButton = () => placeButton(jfcompat.getHeaderBox());
window.addEventListener('gamepadconnected', () => { watchPads(); replaceButton(); });
window.addEventListener('gamepaddisconnected', () => setTimeout(replaceButton, 0));
if (navigator.getGamepads && Array.from(navigator.getGamepads()).some(Boolean)) watchPads();

window.DestroyJellyfin = { version: DJ_VERSION, start: start, snapshot: snapshotHtml, detectHero: detectHero,
    heroes: HEROES.map((h) => h.id),
    quip: (ctx) => Promise.resolve(pageItem()).then((page) => QUIP.say(Object.assign({ page: page }, ctx))),
    bot: (on) => (game && game.isOpen() ? game.bot(on) : null),
    stats: () => (game && game.isOpen() ? game.stats() : null),
    test: () => (game && game.isOpen() && game.test ? game.test() : null),
    qp: QP,
    shortcut: { fromEvent: fromEvent, check: checkCombo, label: comboLabel, parse: parseCombo } };
