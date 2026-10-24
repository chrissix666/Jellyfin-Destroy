function heroLabel(id) { const h = HEROES.find((x) => x.id === id); return h ? h.name + (h.tag ? ' · ' + h.tag : '') : id; }
function shuffled(list) { const copy = list.slice(); for (let i = copy.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; const t = copy[i]; copy[i] = copy[j]; copy[j] = t; } return copy; }

function heroesForIds(ids, type, person) {
  const hits = [];
  for (const cid in HERO_INDEX) {
    const x = HERO_INDEX[cid];
    let ok = false;
    if (person) ok = x.actors.indexOf(person) >= 0;
    else if (type === 'BoxSet') ok = !!ids.Tmdb && x.coll.indexOf(ids.Tmdb) >= 0;
    else if (type === 'Series') ok = (!!ids.Tmdb && x.tv.indexOf(ids.Tmdb) >= 0) || (!!ids.Imdb && x.imdb.indexOf(ids.Imdb) >= 0);
    else ok = (!!ids.Tmdb && x.tmdb.indexOf(ids.Tmdb) >= 0) || (!!ids.Imdb && x.imdb.indexOf(ids.Imdb) >= 0);
    if (ok && HEROES.some((h) => h.id === cid)) hits.push(cid);
  }
  return hits.map((base) => {
    const variant = HEROES.find((h) => h.variantOf === base && h.match &&
        ((ids.Tmdb && ((type === 'BoxSet' ? h.match.tmdbCollections : h.match.tmdb) || []).indexOf(ids.Tmdb) >= 0) ||
         (ids.TmdbCollection && (h.match.tmdbCollections || []).indexOf(ids.TmdbCollection) >= 0)));
    return variant ? variant.id : base;
  });
}

function heroPlan(fitting) {
  const fit = shuffled(fitting);
  const rest = shuffled(HEROES.map((h) => h.id).filter((id) => fit.indexOf(id) < 0));
  const order = fit.concat(rest);
  return { hero: order[0], order: order, fit: fit.length };
}

function pageItem() {
  try {
    const api = window.ApiClient;
    const route = jfcompat.getRoute();
    const id = route.params.get('id');
    if (!api || !id || route.name !== 'details') return Promise.resolve(null);
    const uid = api.getCurrentUserId();
    const get = (iid) => api.getItem(uid, iid);
    const work = get(id).then((item) => {
      if (item && (item.Type === 'Season' || item.Type === 'Episode') && item.SeriesId) return get(item.SeriesId);
      return item;
    }).catch(() => null);
    return Promise.race([work, new Promise((res) => setTimeout(() => res(null), 1500))]);
  } catch (e) { return Promise.resolve(null); }
}

function heroesForItem(item) {
  if (!item) return Promise.resolve([]);
  const ids = item.ProviderIds || {};
  if (item.Type === 'Person') return Promise.resolve(heroesForIds({}, 'Person', item.Name));
  const own = heroesForIds(ids, item.Type);
  if (item.Type !== 'BoxSet') return Promise.resolve(own);
  try {
    const api = window.ApiClient, uid = api.getCurrentUserId();
    const work = Promise.resolve(api.getItems(uid, { ParentId: item.Id, Fields: 'ProviderIds', IncludeItemTypes: 'Movie,Series', EnableImages: false, EnableUserData: false }))
      .then((result) => {
        const out = own.slice(), add = (list) => list.forEach((h) => { if (out.indexOf(h) < 0) out.push(h); });
        for (const child of (result && result.Items) || []) {
          const childIds = child.ProviderIds || {};
          add(heroesForIds(childIds, child.Type));
          if (childIds.TmdbCollection) add(heroesForIds({ Tmdb: childIds.TmdbCollection }, 'BoxSet'));
        }
        if (typeof diag === 'function') diag('page', 'collection', 'info', { films: ((result && result.Items) || []).length, heroes: out.length, own: own.length });
        return out;
      }).catch(() => own);
    return Promise.race([work, new Promise((res) => setTimeout(() => res(own), 1500))]);
  } catch (e) { return Promise.resolve(own); }
}
function detectHero() {
  return pageItem().then((item) => heroesForItem(item).then((fit) => {
    if (typeof diag === 'function') diag('page', 'heroMatch', fit.length ? 'info' : 'warn', { type: item ? item.Type : null, fit: fit.slice(0, 16) });
    return heroPlan(fit);
  }));
}
