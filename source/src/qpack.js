const QP = (() => {
  const BASE = (() => { try { const url = document.currentScript && document.currentScript.src; return url ? url.replace(/[^/]*$/, '') : ''; } catch (e) { return ''; } })();
  const slug = (text) => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const blocks = new Map();
  let heroes = null, stats = { loads: 0, ms: 0, misses: 0 };
  const recent = [];
  function weight(row) {
    const line = row[0], n = line.length;
    let w = row[5] === 0 ? 3 : 1;
    w *= n <= 60 ? 2 : n <= 100 ? 1.4 : 1;
    if (/(--|—|\.\.\.)\s*$/.test(line) || /^(and|but|so|er|uh|um)/i.test(line)) w *= 0.35;
    if (recent.includes(line)) w *= 0.02;
    return w;
  }
  function pick(rows) {
    if (!rows.length) return null;
    let sum = 0; const totals = rows.map((row) => (sum += weight(row)));
    const x = Math.random() * sum, row = rows[totals.findIndex((v) => v >= x)] || rows[rows.length - 1];
    recent.push(row[0]); if (recent.length > 40) recent.shift();
    return row;
  }
  async function gz(url) {
    const t0 = performance.now();
    const response = await fetch(url);
    if (!response.ok || !response.body || typeof DecompressionStream !== 'function') { stats.misses++; return null; }
    const j = await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).json();
    stats.loads++; stats.ms += performance.now() - t0;
    return j;
  }
  const keyOf = (pack) => (pack.m ? 'm' + pack.m : pack.v ? 'v' + pack.v : null);
  function load(key) {
    if (!key || !BASE || !oneLinersOn()) return Promise.resolve(null);
    if (!blocks.has(key)) blocks.set(key, gz(BASE + 'quotes/packed/' + key + '.json.gz').catch(() => null));
    return blocks.get(key);
  }
  function loadHeroes() {
    if (!oneLinersOn()) return Promise.resolve(null);
    if (!heroes) heroes = (BASE ? gz(BASE + 'quotes/packed/heroes.json.gz').catch(() => null) : Promise.resolve(null)).then((arr) => {
      const byKey = new Map();
      for (const pack of arr || []) { const k = keyOf(pack); if (k) byKey.set(k, pack); }
      return byKey;
    });
    return heroes;
  }
  const rowPeople = (pack, row) => { const x = row[1]; return (Array.isArray(x) ? x : x == null ? [] : [x]).map((i) => slug(pack.p[i])); };
  const rowRole = (pack, row) => (row[2] == null || !pack.r ? null : slug(pack.r[row[2]]));
  async function where(it) {
    if (!it) return null;
    const t = it.Type;
    if (t === 'Movie') return it.ProviderIds && it.ProviderIds.Tmdb ? { key: 'm' + it.ProviderIds.Tmdb } : null;
    if (t === 'Series') return it.ProviderIds && it.ProviderIds.Tvdb ? { key: 'v' + it.ProviderIds.Tvdb } : null;
    if ((t === 'Season' || t === 'Episode') && it.SeriesId) {
      const ser = await QUIP.item(it.SeriesId);
      const w = ser && ser.ProviderIds && ser.ProviderIds.Tvdb ? { key: 'v' + ser.ProviderIds.Tvdb } : null;
      if (!w || (ser.DisplayOrder && ser.DisplayOrder !== '')) return w;
      if (t === 'Season') w.s = it.IndexNumber;
      else { w.s = it.ParentIndexNumber; w.e = it.IndexNumber; w.e2 = it.IndexNumberEnd || it.IndexNumber; }
      return w;
    }
    return null;
  }
  function byPlace(pack, rows, place) {
    if (place && place.s != null && Math.random() < 0.8) {
      if (place.e != null) { const ep = rows.filter((r) => r[3] === place.s && r[4] >= place.e && r[4] <= place.e2); if (ep.length) return ep; }
      const se = rows.filter((r) => r[3] === place.s); if (se.length) return se;
    }
    return rows;
  }
  const say = (row) => (row ? '"' + row[0].replace(/[.\s]+$/, '') + '"' : null);
  async function personIn(place, name) {
    const pack = place && await load(place.key); if (!pack) return null;
    const n = slug(name), rows = pack.q.filter((r) => rowPeople(pack, r).includes(n));
    return rows.length ? say(pick(byPlace(pack, rows, place))) : null;
  }
  async function medium(place) {
    const pack = place && await load(place.key); if (!pack || !pack.q.length) return null;
    return say(pick(byPlace(pack, pack.q, place)));
  }
  const pairs = (heroId) => (typeof HERO_PAIRS === 'object' && HERO_PAIRS[heroId]) || [];
  async function heroLine(heroId) {
    const heroPacks = await loadHeroes(), rows = [];
    for (const [key, actor, roles] of pairs(heroId)) {
      const pack = heroPacks.get(key); if (!pack) continue;
      for (const row of pack.q) if (rowPeople(pack, row).includes(actor) && (!roles || roles.includes(rowRole(pack, row)))) rows.push(row);
    }
    return rows.length ? say(pick(rows)) : null;
  }
  async function ensemble(heroId, name) {
    const n = slug(name), own = new Set(pairs(heroId).map((x) => x[1]));
    if (own.has(n)) return null;
    const rows = [];
    for (const key of new Set(pairs(heroId).map((x) => x[0]))) {
      const pack = await load(key); if (!pack) continue;
      for (const row of pack.q) if (rowPeople(pack, row).includes(n)) rows.push(row);
    }
    return rows.length ? say(pick(rows)) : null;
  }
  function prefetch(ids, page, heroId) {
    loadHeroes();
    if (heroId) for (const k of new Set(pairs(heroId).map((x) => x[0]))) load(k);
    Promise.resolve(page).then((p) => where(p)).then((w) => w && load(w.key));
    for (const id of ids.slice(0, 60)) QUIP.item(id).then(where).then((w) => w && load(w.key), () => {});
  }
  return { where, personIn, medium, heroLine, ensemble, prefetch, load, loadHeroes, stats, N: slug };
})();
