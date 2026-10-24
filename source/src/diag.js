const DIAG = { sid: null, q: [], cnt: {}, anom: {}, t0: 0, statsT: 0, flushT: 0, snaps: 0, timeline: [], open: false };
function diagOn() { return !!(DJ_PLUGIN && DJ_ADMIN && DJ_ADMIN.RecordDiagnostics) || window.__djDiag === true; }
function diagPage() {
    try { const route = jfcompat.getRoute(); return route.name + (route.params.get('id') ? ':' + route.params.get('id').slice(0, 8) : ''); } catch (e) { return ''; }
}
function diag(cat, ev, lvl, data) {
    if (!diagOn() || !DIAG.sid) return;
    if (lvl === 'debug' && !(DJ_ADMIN && String(DJ_ADMIN.DiagnosticsDebug || '').split(',').map((x) => x.trim()).includes(cat))) return;
    DIAG.q.push({ t: Math.round(performance.now() - DIAG.t0), cat, ev, lvl: lvl || 'info', page: diagPage(), data: data || null });
    if (DIAG.q.length >= 300) diagFlush();
}
function diagCount(key, n) { if (DIAG.sid) DIAG.cnt[key] = (DIAG.cnt[key] || 0) + (n || 1); }
function diagAnomaly(cat, ev, key, data, snap) {
    if (!diagOn() || !DIAG.sid) return;
    const k = cat + '.' + ev + '|' + (key || '');
    const anomaly = DIAG.anom[k] || (DIAG.anom[k] = { n: 0 });
    anomaly.n++;
    if (anomaly.n <= 3) diag(cat, ev, 'warn', Object.assign({ key: key || '', n: anomaly.n }, data || {}));
    if (snap && anomaly.n === 1 && DIAG.snaps < 8) diagSnap(cat + '-' + ev);
}
function diagSnap(name) {
    try {
        const source = host && host.shadowRoot && host.shadowRoot.querySelector('canvas#fx');
        if (!source || !source.width) return;
        const k = Math.min(1, 480 / source.width), canvas = document.createElement('canvas');
        canvas.width = Math.round(source.width * k); canvas.height = Math.round(source.height * k);
        canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
        DIAG.snaps++;
        diag('snap', name, 'info', { img: canvas.toDataURL('image/jpeg', 0.6) });
    } catch (e) { }
}
function diagEl(el, block) {
    try {
        const cls = (typeof el.className === 'string' ? el.className : (el.getAttribute && el.getAttribute('class')) || '').trim().split(/\s+/).slice(0, 4).join('.');
        return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls ? '.' + cls : '') + (block ? ' ' + Math.round(block.w) + 'x' + Math.round(block.h) : '');
    } catch (e) { return '?'; }
}
function diagStart(info) {
    if (!diagOn()) { DIAG.sid = null; return; }
    DIAG.sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    DIAG.q = []; DIAG.cnt = {}; DIAG.anom = {}; DIAG.t0 = performance.now(); DIAG.statsT = DIAG.t0; DIAG.flushT = DIAG.t0; DIAG.snaps = 0; DIAG.timeline = []; DIAG.open = true;
    let jf = '';
    try { jf = window.ApiClient && ApiClient.serverVersion ? ApiClient.serverVersion() : ''; } catch (e) { }
    diag('session', 'start', 'info', Object.assign({ v: DJ_VERSION, jellyfin: jf, ua: navigator.userAgent, screen: [screen.width, screen.height, window.devicePixelRatio],
        view: [window.innerWidth, window.innerHeight], admin: DJ_ADMIN, personal: (function () { try { return settings; } catch (e) { return null; } })() }, info || {}));
    diagLoaf();
}
function diagLoaf() {
    try {
        if (DIAG.loaf) DIAG.loaf.disconnect();
        if (!window.PerformanceObserver || !(PerformanceObserver.supportedEntryTypes || []).includes('long-animation-frame')) return;
        DIAG.loafN = 0;
        DIAG.loaf = new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
                if (!DIAG.open || e.duration < 50 || DIAG.loafN >= 40) continue;
                DIAG.loafN++;
                const end = e.startTime + e.duration, sc = (e.scripts || []).slice().sort((a, b) => b.duration - a.duration).slice(0, 4);
                diag('perf', 'loaf', 'warn', {
                    ms: Math.round(e.duration), block: Math.round(e.blockingDuration || 0),
                    render: e.renderStart ? Math.round(end - e.renderStart) : 0,
                    styleLayout: e.styleAndLayoutStart ? Math.round(end - e.styleAndLayoutStart) : 0,
                    scripts: sc.map((script) => ({ ms: Math.round(script.duration), inv: String(script.invoker || '').slice(0, 60), type: script.invokerType || '',
                        fn: String(script.sourceFunctionName || '').slice(0, 40), src: String(script.sourceURL || '').split('/').pop().slice(0, 40), at: script.sourceCharPosition,
                        forced: Math.round(script.forcedStyleAndLayoutDuration || 0), pause: Math.round(script.pauseDuration || 0) })),
                    fx: (function () { try { return game && game.stats ? (game.stats().fx || {}).quality : null; } catch (x) { return null; } })(),
                });
            }
        });
        DIAG.loaf.observe({ type: 'long-animation-frame', buffered: false });
    } catch (e) { }
}
function diagTick(sample) {
    if (!DIAG.sid || !DIAG.open) return;
    const now = performance.now();
    if (now - (DIAG.lastSec || 0) >= 1000) {
        DIAG.lastSec = now;
        try { DIAG.timeline.push([Math.round((now - DIAG.t0) / 1000)].concat(sample())); } catch (e) { }
    }
    if (now - DIAG.statsT >= 5000) {
        DIAG.statsT = now;
        diag('stats', 'tick', 'info', { cnt: DIAG.cnt, tl: DIAG.timeline.splice(0) });
        DIAG.cnt = {};
    }
    if (now - DIAG.flushT >= 10000) diagFlush();
}
function diagEnd(reason) {
    if (!DIAG.sid || !DIAG.open) return;
    DIAG.open = false;
    try { if (DIAG.loaf) { DIAG.loaf.disconnect(); DIAG.loaf = null; } } catch (e) { }
    const kinds = {}; for (const k in DIAG.anom) kinds[k] = DIAG.anom[k].n;
    let st = null; try { st = game && game.stats ? game.stats() : null; } catch (e) { }
    diag('session', 'end', 'info', { reason: reason || '', secs: Math.round((performance.now() - DIAG.t0) / 1000), anomalies: kinds, cnt: DIAG.cnt, tl: DIAG.timeline.splice(0), stats: st });
    diagFlush(true);
}
function diagFlush(last) {
    if (!DIAG.q.length || !DIAG.sid) return;
    DIAG.flushT = performance.now();
    const lines = DIAG.q.splice(0), api = window.ApiClient;
    if (!api || !api.accessToken) return;
    try {
        fetch(api.getUrl('Destroy/Diagnostics'), { method: 'POST', keepalive: !!last && JSON.stringify(lines).length < 60000,
            headers: { 'Content-Type': 'application/json', Authorization: 'MediaBrowser Token="' + api.accessToken() + '"' },
            body: JSON.stringify({ sid: DIAG.sid, lines }) }).catch(() => { });
    } catch (e) { }
}
window.addEventListener('error', (e) => {
    if (!DIAG.sid || !e || !/Destroy\/script\.js/.test(e.filename || '')) return;
    diagAnomaly('error', 'exception', String(e.message).slice(0, 80), { msg: String(e.message), line: e.lineno, col: e.colno }, true);
});
window.addEventListener('pagehide', () => diagEnd('pagehide'));
