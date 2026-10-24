
const SETTINGS_KEY = 'jf-destroy-settings';
const PRESETS = ['Alt+Shift+D', 'Alt+Shift+X', 'Ctrl+Alt+K', 'F9'];

const RESERVED = new Set([
    'Ctrl+T', 'Ctrl+N', 'Ctrl+W', 'Ctrl+Shift+T', 'Ctrl+Shift+N', 'Ctrl+Shift+W', 'Ctrl+Shift+Q',
    'Ctrl+Tab', 'Ctrl+Shift+Tab', 'Ctrl+PageUp', 'Ctrl+PageDown', 'Ctrl+F4', 'Alt+F4',
    'Ctrl+L', 'Alt+D', 'Ctrl+K', 'Ctrl+E', 'Ctrl+R', 'Ctrl+Shift+R', 'Ctrl+F', 'Ctrl+G', 'Ctrl+Shift+G',
    'Ctrl+P', 'Ctrl+S', 'Ctrl+O', 'Ctrl+U', 'Ctrl+H', 'Ctrl+J', 'Ctrl+D', 'Ctrl+Shift+D', 'Ctrl+Shift+B', 'Ctrl+Shift+O',
    'Ctrl+A', 'Ctrl+C', 'Ctrl+V', 'Ctrl+X', 'Ctrl+Z', 'Ctrl+Y', 'Ctrl+Shift+Z', 'Ctrl+Shift+V',
    'Ctrl+Shift+I', 'Ctrl+Shift+J', 'Ctrl+Shift+C', 'Ctrl+Shift+K', 'Ctrl+Shift+Delete', 'Ctrl+Shift+M',
    'Ctrl+Equal', 'Ctrl+Minus', 'Ctrl+Digit0', 'Ctrl+NumpadAdd', 'Ctrl+NumpadSubtract', 'Ctrl+Numpad0',
    'Alt+ArrowLeft', 'Alt+ArrowRight', 'Alt+Home', 'Alt+F', 'Alt+E',
    'F1', 'F3', 'F5', 'F6', 'F7', 'F10', 'F11', 'F12', 'Shift+F5', 'Shift+F10', 'Ctrl+F5',
]);
const MODIFIER_CODES = /^(Control|Shift|Alt|Meta|OS|AltGraph|CapsLock|NumLock|ScrollLock|Fn)/;
const NO_MAIN_KEY = new Set(['Escape', 'Tab', 'Enter', 'NumpadEnter', 'Space', 'Backspace', 'ContextMenu', 'PrintScreen']);

function comboId(combo) {
    return (combo.ctrl ? 'Ctrl+' : '') + (combo.alt ? 'Alt+' : '') + (combo.shift ? 'Shift+' : '') + (combo.meta ? 'Meta+' : '') + combo.code.replace(/^Key/, '');
}
function keyLabel(code, key) {
    if (/^Key[A-Z]$/.test(code)) return (key && key.length === 1 && /\p{L}/u.test(key) ? key : code.slice(3)).toUpperCase();
    if (/^Digit\d$/.test(code)) return code.slice(5);
    if (/^Numpad\d$/.test(code)) return 'Num ' + code.slice(6);
    if (/^F\d{1,2}$/.test(code)) return code;
    return (key && key.length === 1 && key !== ' ') ? key.toUpperCase() : code;
}
function comboLabel(combo) {
    return (combo.ctrl ? 'Ctrl+' : '') + (combo.alt ? 'Alt+' : '') + (combo.shift ? 'Shift+' : '') + (combo.meta ? 'Win+' : '') + combo.label;
}
function parseCombo(text) {
    const parts = String(text || '').split('+').map((p) => p.trim()).filter(Boolean);
    if (!parts.length) return null;
    const combo = { ctrl: false, alt: false, shift: false, meta: false, code: '', label: '' };
    for (const part of parts) {
        const word = part.toLowerCase();
        if (word === 'ctrl' || word === 'strg' || word === 'control') combo.ctrl = true;
        else if (word === 'alt') combo.alt = true;
        else if (word === 'shift' || word === 'umschalt') combo.shift = true;
        else if (word === 'win' || word === 'meta' || word === 'cmd') combo.meta = true;
        else if (/^[a-z]$/.test(word)) { combo.code = 'Key' + word.toUpperCase(); combo.label = word.toUpperCase(); }
        else if (/^\d$/.test(word)) { combo.code = 'Digit' + word; combo.label = word; }
        else if (/^f\d{1,2}$/.test(word)) { combo.code = combo.label = word.toUpperCase(); }
        else { combo.code = part; combo.label = part; }
    }
    return combo.code ? combo : null;
}

function checkCombo(combo, e) {
    if (!combo || !combo.code || MODIFIER_CODES.test(combo.code)) return 'Keep the modifier keys down and press one more key.';
    if (NO_MAIN_KEY.has(combo.code)) return 'That key is needed elsewhere - pick a letter, a number or F1 to F12.';
    const fkey = /^F\d{1,2}$/.test(combo.code);
    if (!combo.ctrl && !combo.alt && !combo.meta && !fkey) return 'Add Ctrl or Alt - a single key would fire while you type.';
    if (combo.meta) return 'The Windows key belongs to the system - use Ctrl or Alt.';
    if (RESERVED.has(comboId(combo))) return comboLabel(combo) + ' belongs to the browser.';
    if (combo.ctrl && combo.alt && e && (e.getModifierState && e.getModifierState('AltGraph') ||
        (e.key && e.key.length === 1 && !/\p{L}|\d/u.test(e.key)))) {
        return comboLabel(combo) + ' types a character on this keyboard (AltGr) - pick another.';
    }
    return null;
}
function fromEvent(e) {
    return { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, meta: e.metaKey, code: e.code, label: keyLabel(e.code, e.key) };
}
const sameCombo = (a, b) => !!a && !!b && a.code === b.code && !!a.ctrl === !!b.ctrl && !!a.alt === !!b.alt && !!a.shift === !!b.shift && !!a.meta === !!b.meta;

function oneLinersOn() { return !settings || settings.lines !== false; }

const personalAllowed = () => !DJ_ADMIN || DJ_ADMIN.AllowPersonalSettings !== false;
function defaults() {
    const admin = DJ_ADMIN;
    const raw = admin ? (admin.ShortcutEnabled !== false ? admin.Shortcut || '' : '') : CONFIG.SHORTCUT;
    const parsed = parseCombo(raw);
    const fxq = admin && ['auto', 'high', 'medium', 'low'].includes(String(admin.EffectQuality || '').toLowerCase()) ? String(admin.EffectQuality).toLowerCase() : 'auto';
    return {
        shortcut: (raw && parsed && !checkCombo(parsed)) ? parsed : null,
        button: admin ? admin.ShowPlayButton !== false : CONFIG.SHOW_HEADER_BUTTON !== false,
        pad: admin ? admin.ControllerEnabled !== false && admin.ControllerStart !== false : CONFIG.GAMEPAD_START !== false,
        hero: admin ? (admin.Hero && (admin.Hero === 'auto' || HEROES.some((h) => h.id === admin.Hero)) ? admin.Hero : 'auto') : CONFIG.HERO || 'auto',
        fxq, lines: admin ? admin.ShowOneLiners !== false : true };
}
function loadSettings() {
    const settings = defaults();
    if (!personalAllowed()) return settings;
    const plugin = !!DJ_ADMIN, shortcutOn = !plugin || DJ_ADMIN.ShortcutEnabled !== false;
    try {
        const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
        if (stored && typeof stored === 'object') {
            if ('shortcut' in stored && shortcutOn) settings.shortcut = stored.shortcut && stored.shortcut.code && !checkCombo(stored.shortcut) ? stored.shortcut : null;
            if (!plugin && typeof stored.button === 'boolean') settings.button = stored.button;
            if (!plugin && typeof stored.pad === 'boolean') settings.pad = stored.pad;
            if (['auto', 'high', 'medium', 'low'].includes(stored.fxq)) settings.fxq = stored.fxq;
            if (typeof stored.lines === 'boolean') settings.lines = stored.lines;
            if (typeof stored.hero === 'string' && (stored.hero === 'auto' || HEROES.some((h) => h.id === stored.hero))) settings.hero = stored.hero;
        }
    } catch (e) { }
    return settings;
}
let settings = loadSettings();
function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { }
    updateButtonTitle();
    replaceButton();
}
function resetSettings() {
    try { localStorage.removeItem(SETTINGS_KEY); } catch (e) { }
    settings = loadSettings();
    updateButtonTitle();
    replaceButton();
}
function updateButtonTitle() {
    const btn = document.getElementById(BUTTON_ID);
    if (!btn) return;
    const t = 'Destroy this page' + (settings.shortcut ? ' (' + comboLabel(settings.shortcut) + ')' : '');
    btn.title = t; btn.setAttribute('aria-label', t);
}

window.addEventListener('keydown', function (e) {
    if (!settings.shortcut || e.repeat || (game && game.isOpen())) return;
    if (e.target && e.target.closest && e.target.closest('.dsShortcutField')) return;
    if (!sameCombo(fromEvent(e), settings.shortcut)) return;
    if (!canPlay() || jfcompat.isRoute('video')) return;
    e.preventDefault();
    e.stopPropagation();
    startFrom('shortcut');
}, true);

const SETTINGS_HTML = `
<div id="djSettings" class="overlay hidden">
  <div class="box dj-settings">
    <h2>Settings</h2>
    <div class="dj-row"><span class="dj-lbl">Start shortcut</span>
      <button class="btn small dj-key" id="djKey" type="button"></button></div>
    <div class="dj-hint" id="djHint">Click the key above, then press the combination you want.</div>
    <div class="dj-row dj-presets"><span class="dj-lbl">Or pick one</span><span id="djPresets"></span></div>
    <div class="dj-row"><span class="dj-lbl">Character</span><select id="djHero" class="dj-select"></select></div>
    <div class="dj-hint">Automatic picks the hero of the film or series you are on. In the game: H / Shift+H (controller Y) switches.</div>
    <div class="dj-row"><span class="dj-lbl">Effects</span><select id="djFx" class="dj-select"><option value="auto">Auto (adapts to this computer)</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
    <label class="dj-row dj-check"><input type="checkbox" id="djLines"> One-liners: the funny pop-up lines</label>
    <label class="dj-row dj-check"><input type="checkbox" id="djButton"> Button in the Jellyfin header</label>
    <label class="dj-row dj-check"><input type="checkbox" id="djPad"> Controller: View + Menu starts the game</label>
    <div class="dj-row dj-end">
      <button class="btn small" id="djNoKey" type="button">No shortcut</button>
      <button class="btn small" id="djReset" type="button">Defaults</button>
      <button class="btn" id="djClose" type="button">Done</button>
    </div>
  </div>
</div>`;
const SETTINGS_CSS = `
.dj-settings { min-width: 440px; max-width: 92vw; }
.dj-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.dj-lbl { color: var(--muted); min-width: 130px; }
.dj-key { min-width: 160px; font-size: 11px; color: var(--gold); }
.dj-key.listening { color: var(--text); animation: djblink 1s steps(2) infinite; }
@keyframes djblink { 50% { filter: brightness(1.4); } }
.dj-hint { color: var(--muted); font-size: 18px; min-height: 22px; }
.dj-hint.bad { color: #ff8a8a; }
.dj-presets .btn { margin: 2px 6px 2px 0; }
.dj-check { color: var(--text); cursor: pointer; }
.dj-check input { width: 18px; height: 18px; padding: 0; box-shadow: none; accent-color: var(--gold); }
.dj-end { justify-content: flex-end; margin-top: 6px; }
.dj-select { font: inherit; font-size: 14px; padding: 0.5em 0.6em; border: 0; border-radius: 0.2em; min-width: 240px;
  background: var(--jf-raised, #303030); color: var(--jf-text, #fff); }
`;
let ui = null, listening = false;

function wireSettings(root) {
    const style = document.createElement('style');
    style.textContent = SETTINGS_CSS;
    root.appendChild(style);
    root.getElementById('game').insertAdjacentHTML('beforeend', SETTINGS_HTML);
    const $s = (id) => root.getElementById(id);
    ui = { box: $s('djSettings'), key: $s('djKey'), hint: $s('djHint'), button: $s('djButton'), pad: $s('djPad'), hero: $s('djHero'), fx: $s('djFx'), lines: $s('djLines') };
    ui.fx.addEventListener('change', () => { settings.fxq = ui.fx.value; saveSettings(); });
    const opt = (key, label) => { const option = document.createElement('option'); option.value = key; option.textContent = label; ui.hero.appendChild(option); };
    opt('auto', 'Automatic (matches the film)');
    HEROES.forEach((h) => opt(h.id, h.name + (h.tag ? ' · ' + h.tag : '')));
    ui.hero.addEventListener('change', () => { settings.hero = ui.hero.value; saveSettings(); });
    const presets = $s('djPresets');
    for (const preset of PRESETS) {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'btn small'; btn.textContent = preset;
        btn.addEventListener('click', () => setShortcut(parseCombo(preset), null));
        presets.appendChild(btn);
    }
    ui.key.addEventListener('click', () => { listening = true; renderSettings('Press the keys...'); });
    ui.lines.addEventListener('change', () => { settings.lines = ui.lines.checked; saveSettings(); });
    ui.button.addEventListener('change', () => { settings.button = ui.button.checked; saveSettings(); });
    ui.pad.addEventListener('change', () => { settings.pad = ui.pad.checked; saveSettings(); });
    $s('djNoKey').addEventListener('click', () => { settings.shortcut = null; saveSettings(); renderSettings('No shortcut - start with the button or the controller.'); });
    $s('djReset').addEventListener('click', () => { resetSettings(); renderSettings('Back to the defaults.'); });
    $s('djClose').addEventListener('click', closeSettings);
    $s('settingsBtn').addEventListener('click', openSettings);
    applyPersonalUI();
}
function renderSettings(msg, bad) {
    ui.key.textContent = listening ? 'Press the keys...' : (settings.shortcut ? comboLabel(settings.shortcut) : 'None');
    ui.key.classList.toggle('listening', listening);
    ui.button.checked = settings.button;
    ui.pad.checked = settings.pad;
    ui.hero.value = settings.hero;
    ui.fx.value = settings.fxq;
    ui.lines.checked = settings.lines !== false;
    if (msg !== undefined) { ui.hint.textContent = msg; ui.hint.classList.toggle('bad', !!bad); }
}
function setShortcut(combo, e) {
    const why = checkCombo(combo, e);
    listening = false;
    if (why) { renderSettings(why, true); return; }
    settings.shortcut = { ctrl: combo.ctrl, alt: combo.alt, shift: combo.shift, meta: combo.meta, code: combo.code, label: combo.label };
    saveSettings();
    renderSettings('Saved: ' + comboLabel(settings.shortcut) + ' starts the game (this browser).');
}
function applyPersonalUI() {
    const button = ui && ui.box.getRootNode().getElementById('settingsBtn');
    if (button) button.style.display = personalAllowed() ? '' : 'none';
}
function openSettings() {
    const plugin = !!DJ_ADMIN, shortcutOn = !plugin || DJ_ADMIN.ShortcutEnabled !== false;
    ui.button.closest('label').style.display = plugin ? 'none' : '';
    ui.pad.closest('label').style.display = plugin ? 'none' : '';
    [ui.key.closest('.dj-row'), ui.hint, ui.box.querySelector('.dj-presets'), ui.box.querySelector('#djNoKey')].forEach((el) => { if (el) el.style.display = shortcutOn ? '' : 'none'; });
    listening = false; ui.box.classList.remove('hidden'); renderSettings('Click the key above, then press the combination you want.'); }
function closeSettings() { listening = false; ui.box.classList.add('hidden'); }
function settingsOpen() { return !!ui && !ui.box.classList.contains('hidden'); }

function settingsKey(e) {
    if (!settingsOpen()) return false;
    e.preventDefault();
    if (e.type !== 'keydown') return true;
    if (listening) {
        if (e.code === 'Escape' && !e.ctrlKey && !e.altKey && !e.shiftKey) { listening = false; renderSettings('Unchanged.'); return true; }
        if (MODIFIER_CODES.test(e.code)) { ui.key.textContent = comboLabel({ ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, meta: e.metaKey, label: '…' }); return true; }
        setShortcut(fromEvent(e), e);
        return true;
    }
    if (e.code === 'Escape') closeSettings();
    return true;
}
