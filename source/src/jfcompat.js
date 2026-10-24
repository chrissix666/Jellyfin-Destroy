const jfcompat = (function () {
    'use strict';
    const VERSION = '1.1';

    function serverVersion() {
        try {
            const api = window.ApiClient;
            const version = api && typeof api.serverVersion === 'function' && api.serverVersion();
            if (version) {
                const [major, minor] = String(version).split('.').map(Number);
                return { major: major, minor: minor || 0, raw: String(version) };
            }
        } catch (e) { }
        return null;
    }
    function isNewModel() {
        const version = serverVersion();
        if (version) return version.major > 10 || (version.major === 10 && version.minor >= 11);
        return document.documentElement.hasAttribute('data-theme');
    }

    function isModernLayoutModel() {
        const version = serverVersion();
        if (version) return version.major >= 12;
        return isNewModel();
    }

    function getRoute() {
        const h = window.location.hash || '';
        const match = /^#!?\/([^?]*)(?:\?(.*))?$/.exec(h);
        const name = match ? match[1].replace(/\.html$/i, '').toLowerCase() : '';
        return { name: name, params: new URLSearchParams(match && match[2] ? match[2] : '') };
    }
    function isRoute() {
        const n = getRoute().name;
        for (let i = 0; i < arguments.length; i++) if (arguments[i] === n) return true;
        return false;
    }
    const NO_SUFFIX = ['details', 'video', ''];
    function routeUrl(name, params) {
        const query = params ? new URLSearchParams(params).toString() : '';
        const suffix = (!isNewModel() && NO_SUFFIX.indexOf(name) < 0) ? '.html' : '';
        return '#/' + name + suffix + (query ? '?' + query : '');
    }
    function go(name, params) {
        const url = routeUrl(name, params);
        if (window.Emby && window.Emby.Page && typeof window.Emby.Page.show === 'function') {
            window.Emby.Page.show(url.slice(1));
        } else {
            window.location.hash = url;
        }
    }

    const LEGACY_12 = ['desktop-legacy', 'mobile-legacy', 'tv'];
    const MUI_SEARCH = '.MuiAppBar-root a[href^="#/search"]';
    let cachedLayout = null;
    function getLayout() {
        if (cachedLayout) return cachedLayout;
        if (getRoute().name !== 'video') {
            if (document.querySelector(MUI_SEARCH)) return (cachedLayout = 'mui');
            const sk = document.querySelector('.skinHeader:not(.osdHeader)');
            if (sk && sk.getClientRects().length > 0 && sk.querySelector('.headerRight')) return (cachedLayout = 'classic');
        }
        let saved = '';
        try { saved = localStorage.getItem('layout') || ''; } catch (e) { }
        if (isModernLayoutModel()) return LEGACY_12.indexOf(saved) >= 0 ? 'classic' : 'mui';
        return saved === 'experimental' ? 'mui' : 'classic';
    }
    function isMui() { return getLayout() === 'mui'; }

    function isShown(el) { return !!el && el.getClientRects().length > 0; }
    function getSearchLink() {
        if (isMui()) return document.querySelector(MUI_SEARCH);
        const button = document.querySelector('.skinHeader:not(.osdHeader) .headerRight .headerSearchButton');
        return isShown(button) ? button : null;
    }
    function getHeaderBox() {
        if (isMui()) { const link = document.querySelector(MUI_SEARCH); return link ? link.parentElement : null; }
        const box = document.querySelector('.skinHeader:not(.osdHeader) .headerRight');
        return isShown(box) ? box : null;
    }
    function onHeaderBoxChange(cb) {
        let queued = false;
        const run = function () { queued = false; cb(getHeaderBox()); };
        const start = function () {
            if (!document.body) { setTimeout(start, 200); return; }
            run();
            new MutationObserver(function () {
                if (!queued) { queued = true; setTimeout(run, 50); }
            }).observe(document.body, { childList: true, subtree: true });
        };
        start();
    }

    function getThemeId() {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme) return theme;
        const link = document.querySelector('link[href*="themes/"][href$="theme.css"]');
        const match = link && /themes\/([^/]+)\/theme\.css/.exec(link.getAttribute('href') || '');
        return match ? match[1] : 'dark';
    }
    function getMuiHoverColor() {
        const old = /^(light|appletv)$/.test(getThemeId()) ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)';
        if (!document.documentElement.hasAttribute('data-theme')) return old;
        const cs = getComputedStyle(document.documentElement);
        const ch = cs.getPropertyValue('--jf-palette-action-activeChannel').trim();
        const op = cs.getPropertyValue('--jf-palette-action-hoverOpacity').trim();
        return (ch && op) ? 'rgba(' + ch + ' / ' + op + ')' : old;
    }

    function accessToken() {
        try {
            const api = window.ApiClient;
            const t = api && typeof api.accessToken === 'function' && api.accessToken();
            if (t) return t;
        } catch (e) { }
        try {
            const credentials = JSON.parse(localStorage.getItem('jellyfin_credentials') || '{}');
            const server = (credentials.Servers || []).find(function (x) { return x.AccessToken; });
            return server ? server.AccessToken : null;
        } catch (e) { return null; }
    }
    function authHeaders(extra) {
        const h = Object.assign({}, extra || {});
        const t = accessToken();
        if (t) h.Authorization = 'MediaBrowser Token="' + t + '"';
        return h;
    }
    function withApiKey(url) {
        const t = accessToken();
        if (!t) return url;
        return url + (url.indexOf('?') < 0 ? '?' : '&') + 'ApiKey=' + encodeURIComponent(t);
    }

    const REACT_LIBRARY_ROUTES = ['movies', 'tv', 'music', 'livetv', 'boxsets', 'homevideos',
        'musicvideos', 'mixed', 'books', 'playlists', 'home'];
    function isReactLibraryPage() {
        return isNewModel() && isMui() && REACT_LIBRARY_ROUTES.indexOf(getRoute().name) >= 0;
    }

    function getOsdBar() {
        return document.querySelector('.videoOsdBottom .osdControls .buttons');
    }

    const api = {
        VERSION: VERSION, serverVersion: serverVersion, isNewModel: isNewModel,
        getRoute: getRoute, isRoute: isRoute, routeUrl: routeUrl, go: go,
        getLayout: getLayout, isMui: isMui,
        getSearchLink: getSearchLink, getHeaderBox: getHeaderBox, onHeaderBoxChange: onHeaderBoxChange,
        getThemeId: getThemeId, getMuiHoverColor: getMuiHoverColor,
        accessToken: accessToken, authHeaders: authHeaders, withApiKey: withApiKey,
        isReactLibraryPage: isReactLibraryPage, getOsdBar: getOsdBar
    };
    if (!window.jfcompat) window.jfcompat = api;
    return api;
})();
