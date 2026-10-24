const QUIP = (() => {
  const FIELDS = 'Genres,Studios,Tags,People,ProviderIds,ChildCount,SeriesStudio';
  const slug = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const api = () => window.ApiClient;
  const uid = () => { const client = api(); return client && client.getCurrentUserId ? client.getCurrentUserId() : null; };
  const pick = (list) => list[(Math.random() * list.length) | 0];
  const THIS_YEAR = new Date().getFullYear();

  const items = new Map();
  const films = new Map();
  let lib = null;
  function fetchBatch(ids) {
    const client = api(), userId = uid();
    if (!client || !userId || !client.getItems) return Promise.resolve([]);
    return client.getItems(userId, { Ids: ids.join(','), Fields: FIELDS, EnableImages: false }).then((result) => (result && result.Items) || [], () => []);
  }
  function prefetch(ids) {
    const todo = [...new Set(ids)].filter((id) => id && !items.has(id));
    for (let i = 0; i < todo.length; i += 60) {
      const chunk = todo.slice(i, i + 60), batch = fetchBatch(chunk);
      for (const id of chunk) items.set(id, batch.then((list) => list.find((x) => x.Id === id) || null));
    }
  }
  function item(id) {
    if (!items.has(id)) {
      const client = api(), userId = uid();
      items.set(id, client && userId && client.getItem ? Promise.resolve(client.getItem(userId, id)).then((x) => x, () => null) : Promise.resolve(null));
    }
    return items.get(id);
  }
  function library() {
    if (!lib) {
      const client = api(), userId = uid();
      lib = !client || !userId || !client.getItems ? Promise.resolve(new Map())
        : client.getItems(userId, { Recursive: true, IncludeItemTypes: 'Movie', Fields: 'ProviderIds', EnableImages: false, Limit: 5000 }).then((result) => {
          const byCollection = new Map();
          for (const x of (result && result.Items) || []) {
            const collectionId = x.ProviderIds && x.ProviderIds.TmdbCollection;
            if (!collectionId) continue;
            if (!byCollection.has(collectionId)) byCollection.set(collectionId, []);
            byCollection.get(collectionId).push({ id: x.Id, year: x.ProductionYear || 0, name: x.Name });
          }
          for (const films of byCollection.values()) films.sort((p, q) => p.year - q.year);
          return byCollection;
        }, () => new Map());
    }
    return lib;
  }
  function personFilms(id) {
    if (!films.has(id)) {
      const client = api(), userId = uid();
      films.set(id, !client || !userId || !client.getItems ? Promise.resolve([])
        : client.getItems(userId, { PersonIds: id, Recursive: true, IncludeItemTypes: 'Movie,Series', Fields: 'ProviderIds,Studios,Tags', EnableImages: false, Limit: 300 })
          .then((result) => (result && result.Items) || [], () => []));
    }
    return films.get(id);
  }

  const FRANCHISE_RULES = [
    ['Marvel', /marvel/, /marvelcinematicuniverse|marvelcomics|mcu|avengers|xmen|mutant/, /avengers|ironman|captainamerica|thor|guardiansofthegalaxy|blackpanther|antman|deadpool|spiderman|xmen|wolverine|doctorstrange|blackwidow|eternals|shangchi|venom/],
    ['DC', /dcfilms|dccomics|dcentertainment|dcstudios/, /dcextendeduniverse|dceu|dccomics|batman|superman|wonderwoman|justiceleague/, /batman|superman|manofsteel|justiceleague|wonderwoman|aquaman|joker|shazam|suicidesquad|theflash|blackadam/],
    ['Star Wars', null, /starwars/, /starwars|rogueone|mandalorian/],
    ['Star Trek', null, /startrek/, /startrek/],
    ['James Bond', /eonproductions/, /jamesbond|mi6|britishsecretservice/, /jamesbond|007/],
    ['Harry Potter', null, /harrypotter|wizardingworld|hogwarts/, /harrypotter|fantastictierwesen|fantasticbeasts/],
    ['The Lord of the Rings', null, /middleearth|tolkien|lordoftherings/, /herrderringe|lordoftherings|hobbit/],
    ['Fast & Furious', null, /fastandfurious|streetracing/, /fastfurious|fastandthefurious|furious/],
    ['Mission: Impossible', null, /missionimpossible/, /missionimpossible/],
    ['Jurassic Park', null, /jurassicpark|dinosaur/, /jurassic/],
    ['Transformers', null, /transformers|autobots|decepticon/, /transformers/],
    ['Pixar', /pixar/, null, null],
    ['Disney', /waltdisneypictures|waltdisneyanimation/, null, null],
    ['Studio Ghibli', /ghibli/, null, null],
    ['DreamWorks', /dreamworksanimation/, null, null],
    ['Alien vs. Predator', null, null, /alienvspredator|avpr|aliensvspredator/],
    ['Alien', null, /alienpredatorfranchise|xenomorph|weyland/, /alien|prometheus/],
    ['Predator', null, /predator/, /predator/],
    ['MonsterVerse', null,
      /godzilla|kaiju|kingkong/, /godzilla|kong/],
    ['The Conjuring', null, /conjuringuniverse|annabelle|warren/, /conjuring|annabelle|nun/],
    ['Pirates of the Caribbean', null, /piratesofthecaribbean|jacksparrow/, /pirates|fluchderkaribik/],
    ['Twilight', null, /twilight|vampirelove/, /twilight/],
  ];
  const FR_BY_NAME = {};
  function franchisesOf(it) {
    const out = new Set();
    const coll = it.ProviderIds && it.ProviderIds.TmdbCollection;
    if (coll && COLL_FRANCHISE[coll]) out.add(COLL_FRANCHISE[coll]);
    const st = (it.Studios || []).map((x) => slug(x.Name)).join(' '), tg = (it.Tags || []).map(slug).join(' '), ti = slug(it.Name) + ' ' + slug(it.OriginalTitle);
    for (const [name, studioRe, k, t] of FRANCHISE_RULES) {
      if ((studioRe && studioRe.test(st)) || (k && k.test(tg)) || (t && t.test(ti))) out.add(name);
    }
    return [...out];
  }
  const RIVALS = [['Marvel', 'DC'], ['Star Wars', 'Star Trek'], ['Alien', 'Predator'], ['Terminator', 'RoboCop'], ['A Nightmare on Elm Street', 'Friday the 13th'], ['Harry Potter', 'The Lord of the Rings'], ['Fast & Furious', 'Mission: Impossible'], ['Rambo', 'Commando'], ['Halloween', 'Scream']];
  const rivalOf = (franchise, other) => RIVALS.some(([x, y]) => (x === franchise && y === other) || (x === other && y === franchise));

  const GENRE_KEY = {
    action: 'action', abenteuer: 'adventure', adventure: 'adventure', animation: 'animation', zeichentrick: 'animation',
    komodie: 'comedy', komoedie: 'comedy', comedy: 'comedy', krimi: 'crime', crime: 'crime', dokumentarfilm: 'documentary',
    documentary: 'documentary', drama: 'drama', familie: 'family', family: 'family', fantasy: 'fantasy', historie: 'history',
    history: 'history', horror: 'horror', musik: 'music', music: 'music', musical: 'music', mystery: 'mystery', liebesfilm: 'romance',
    romance: 'romance', sciencefiction: 'scifi', scifi: 'scifi', sciencefictionfantasy: 'scifi', thriller: 'thriller', kriegsfilm: 'war',
    krieg: 'war', war: 'war', western: 'western', tvfilm: 'tvmovie', tvmovie: 'tvmovie', anime: 'anime', sport: 'sport', biography: 'biography',
  };
  const GENRE_NAME = { scifi: 'sci-fi', tvmovie: 'TV movie' };
  const SEQUEL_TITLE = /(\s|:)(2|3|4|5|6|7|8|9|ii|iii|iv|v|vi|vii)(\s|:|$)|part\s?\w+|teil\s?\w+|chapter|kapitel|returns|reloaded|revolutions|resurrection|revenge|rises|strikes back|reckoning|forever|beyond/i;
  const ord = (n) => n + (n % 100 > 10 && n % 100 < 14 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');

  async function itemFacts(it, facts, slots) {
    const type = (it.Type || '').toLowerCase();
    slots.title = it.Name; slots.year = it.ProductionYear || '';
    facts.add('type:' + type);
    if (type === 'movie' || type === 'series' || type === 'boxset') facts.add('type:title');
    for (const genreName of it.Genres || []) { const k = GENRE_KEY[slug(genreName)]; if (k) { facts.add('genre:' + k); slots.genre = slots.genre || GENRE_NAME[k] || k; } }
    for (const t of it.Tags || []) { const k = slug(t); facts.add('kw:' + k); }
    if (it.Tags && it.Tags.length) slots.kw = pick(it.Tags.filter((t) => /^[a-z][a-z ,.'&()-]{3,30}$/.test(t)) .concat(['']).slice(0, 12)) || undefined;
    if (!slots.kw) delete slots.kw;
    const studios = (it.Studios || []).map((x) => x.Name);
    if (studios.length) slots.studio = studios[0];
    for (const x of studios) facts.add('studio:' + slug(x));
    const franchises = franchisesOf(it);
    if (franchises.length) { slots.franchise = franchises[0]; facts.add('franchise'); for (const name of franchises) facts.add('fr:' + slug(name)); }
    const score = it.CommunityRating;
    if (score) { slots.rating = score.toFixed(1); if (score >= 7.8) facts.add('rating:high'); else if (score < 5.6) facts.add('rating:low'); }
    const y = it.ProductionYear;
    if (y) {
      slots.age = THIS_YEAR - y; slots.decade = "'" + String(Math.floor(y / 10) * 10).slice(2) + 's';
      if (y < 1985) facts.add('old'); if (y < 1960) facts.add('ancient'); if (y >= THIS_YEAR - 1) facts.add('new');
    }
    const min = it.RunTimeTicks ? Math.round(it.RunTimeTicks / 6e8) : 0;
    if (min > 20) { slots.minutes = min; if (min >= 145) facts.add('long'); if (min <= 88 && type === 'movie') facts.add('short'); }
    const cert = slug(it.OfficialRating);
    if (/^(r|nc17|18|fsk18|de18|tvma)$/.test(cert)) facts.add('cert:adult');
    else if (/^(g|pg|0|6|fsk0|fsk6|de0|de6|tvy|tvg|tvpg)$/.test(cert)) facts.add('cert:kids');
    if (facts.has('kw:aftercreditsstinger') || facts.has('kw:duringcreditsstinger')) facts.add('credits');
    const coll = it.ProviderIds && it.ProviderIds.TmdbCollection;
    if (coll && type === 'movie') {
      const parts = (await library()).get(coll) || [];
      const i = parts.findIndex((x) => x.id === it.Id);
      if (parts.length > 1 && i >= 0) {
        slots.part = ord(i + 1); slots.partn = i + 1; slots.total = parts.length; facts.add('coll');
        if (i === 0) facts.add('first'); else facts.add('sequel');
        if (i === parts.length - 1 && i > 0) facts.add('latest');
      }
    }
    const pv = (type === 'movie' || type === 'series') && it.ProviderIds ? it.ProviderIds : {};
    const tm = pv.Tmdb, im = pv.Imdb, tv = pv.Tvdb;
    const quoteKey = tm ? (type === 'series' ? 't' : 'm') + tm : (im && ID_ALIAS['i' + im]) || (tv && ID_ALIAS['v' + tv]) || null;
    if (tv) facts.add('id:v' + tv);
    if (quoteKey && (type === 'movie' || type === 'series')) facts.add('id:' + quoteKey);
    if (im) facts.add('id:i' + im);
    const cl = pv.TmdbCollection;
    if (cl) facts.add('id:c' + cl);
    const quotes = (quoteKey && QUOTES[quoteKey]) || (im && QUOTES['i' + im]);
    if (quotes && quotes.length) { slots.quote = pick(quotes).replace(/[.\s]+$/, ''); facts.add('quote'); if (slots.quote.length <= 48) facts.add('quote:short'); }
    const top = (tm && type === 'movie' && TOP250['m' + tm]) || (im && TOP250['i' + im]);
    if (top) { slots.rank = top[0]; slots.imdb = top[1]; facts.add('top250'); if (top[0] <= 10) facts.add('top10'); }
    if (facts.has('kw:sequel') || (type === 'movie' && SEQUEL_TITLE.test(' ' + it.Name + ' '))) facts.add('sequel');
    if (facts.has('kw:prequel')) facts.add('prequel');
    if (facts.has('kw:remake')) facts.add('remake');
    if (facts.has('kw:reboot')) facts.add('reboot');
    if (facts.has('kw:spinoff')) facts.add('spinoff');
    if (facts.has('kw:basedonnovelorbook') || facts.has('kw:basedonnovel')) facts.add('book');
    if (facts.has('kw:basedoncomic') || facts.has('kw:basedoncomicbook')) facts.add('comic');
    if (facts.has('kw:basedonvideogame')) facts.add('game');
    if (['kw:basedontruestory', 'kw:basedonrealevents', 'kw:truecrime', 'kw:historicalfigure', 'kw:historicalevent', 'kw:biography', 'kw:biopic', 'kw:basedonrealperson',
      'genre:biography', 'genre:history', 'genre:documentary'].some((k) => facts.has(k))) facts.add('truestory');
    if (type === 'series') {
      if (/ended/i.test(it.Status || '')) facts.add('series:ended'); else if (it.Status) facts.add('series:running');
      if (it.ChildCount) { slots.seasons = it.ChildCount; if (it.ChildCount === 1) facts.add('series:one'); if (it.ChildCount >= 7) facts.add('series:long'); }
      const net = studios.map(slug).join(' ');
      for (const [k, re] of [['netflix', /netflix/], ['hbo', /hbo/], ['amazon', /amazon|primevideo/], ['disney', /disney/], ['apple', /apple/], ['bbc', /bbc/], ['fox', /fox/], ['cbs', /cbs/], ['nbc', /nbc/], ['amc', /amc/]]) if (re.test(net)) { facts.add('net:' + k); slots.network = studios.find((x) => re.test(slug(x))); break; }
    }
    if (type === 'season') { facts.add('type:season'); slots.n = it.IndexNumber || 1; slots.series = it.SeriesName || ''; }
    if (type === 'episode') { slots.series = it.SeriesName || ''; slots.s = it.ParentIndexNumber || 1; slots.e = it.IndexNumber || 1; }
    if ((type === 'season' || type === 'episode') && it.SeriesId) {
      const show = await item(it.SeriesId);
      const showIds = show && show.ProviderIds;
      if (showIds && showIds.Tmdb) { facts.add('id:t' + showIds.Tmdb); const showQuotes = QUOTES['t' + showIds.Tmdb]; if (showQuotes && showQuotes.length && !slots.quote) { slots.quote = pick(showQuotes).replace(/[.\s]+$/, ''); facts.add('quote'); } }
      if (showIds && showIds.Imdb) facts.add('id:i' + showIds.Imdb);
      if (showIds && showIds.Tvdb) { facts.add('id:v' + showIds.Tvdb); const alias = ID_ALIAS['v' + showIds.Tvdb]; if (alias && !showIds.Tmdb) facts.add('id:' + alias); }
      if (show) for (const name of franchisesOf(show)) { facts.add('fr:' + slug(name)); facts.add('franchise'); slots.franchise = slots.franchise || name; }
      if (show && /ended/i.test(show.Status || '')) facts.add('series:ended');
    }
    if (type === 'boxset') { slots.n = it.ChildCount || ''; }
    if (type === 'collectionfolder' || type === 'userview' || type === 'folder' || type === 'playlist') { facts.add('type:library'); slots.n = it.ChildCount || ''; }
    return franchises;
  }

  async function personFacts(id, el, facts, slots, page) {
    facts.add('type:person');
    const person = (await item(id)) || {};
    slots.name = person.Name || (el && el.querySelector('.cardText') && el.querySelector('.cardText').textContent.trim()) || '';
    if (!slots.name) return;
    const key = slug(slots.name);
    facts.add('who:' + key);
    if (person.ProviderIds && person.ProviderIds.Tmdb) facts.add('pid:' + person.ProviderIds.Tmdb);
    if (person.EndDate || DECEASED.has(key) || (person.ProviderIds && person.ProviderIds.Tmdb && DECEASED.has('p' + person.ProviderIds.Tmdb))) facts.add('deceased');
    if (person.PremiereDate && !person.EndDate) {
      const age = THIS_YEAR - new Date(person.PremiereDate).getFullYear();
      if (age > 5 && age < 110) { slots.pa = age; if (age >= 65) facts.add('veteran'); if (age < 30) facts.add('young'); }
    }
    const credit = page && page.People ? page.People.find((p) => p.Id === id) : null;
    if (credit) {
      facts.add('onpage'); slots.page = page.Name;
      if (credit.Role) { slots.role = credit.Role.split('/')[0].trim(); facts.add('role'); for (const character of credit.Role.split('/')) if (slug(character).length > 2) facts.add('char:' + slug(character)); }
      const t = slug(credit.Type);
      facts.add('ptype:' + t);
      if ((page.Type || '') === 'Series' && t === 'actor') {
        facts.add('seriesstar');
        if (page.People.indexOf(credit) < 4) facts.add('lead');
      }
      if (page.People.indexOf(credit) === 0) facts.add('lead');
    }
    const icons = ACTOR_ICONS[key];
    if (icons && icons.length) { slots.iconic = pick(icons); facts.add('iconic'); }
    if (PERSONAS[key]) facts.add('persona:' + key);
    const filmography = await personFilms(id);
    if (filmography.length) {
      slots.pn = filmography.length;
      if (filmography.length >= 12) facts.add('busy'); else if (filmography.length === 1) facts.add('rare');
      const count = {};
      for (const film of filmography) for (const franchise of franchisesOf(film)) count[franchise] = (count[franchise] || 0) + 1;
      const top = Object.keys(count).sort((a, b) => count[b] - count[a])[0];
      if (top) { slots.pfranchise = top; facts.add('pfranchise'); facts.add('pfr:' + slug(top)); }
    }
  }

  function heroFacts(facts, slots, ctx, franchises, it) {
    const h = ctx.hero;
    if (!h) return;
    slots.hero = h.name;
    const heroDef = HEROES.find((x) => x.id === h.id) || {};
    const ix = HERO_INDEX[h.id] || HERO_INDEX[heroDef.variantOf] || {};
    const heroFranchise = HERO_FRANCHISE[h.id] || HERO_FRANCHISE[heroDef.variantOf] || '';
    if (heroFranchise) { slots.herofr = heroFranchise; facts.add('herofr'); }
    if (it) {
      const tm = (it.Type === 'Movie' || it.Type === 'Series') && it.ProviderIds && it.ProviderIds.Tmdb;
      if (tm && ((ix.tmdb || []).includes(tm) || (ix.tv || []).includes(tm))) facts.add('hero:ownfilm');
      if (heroFranchise && franchises.includes(heroFranchise)) facts.add('hero:ownfr');
      if (heroFranchise && franchises.some((f) => rivalOf(f, heroFranchise))) { facts.add('hero:rival'); slots.rival = franchises.find((f) => rivalOf(f, heroFranchise)); }
    }
    if (slots.name) {
      if ((ix.actors || []).map(slug).includes(slug(slots.name))) facts.add('hero:self');
      if (slots.role && (ix.chars || []).some((c) => slug(c).length > 3 && slug(slots.role).includes(slug(c)))) facts.add('hero:selfrole');
    }
  }
  function pageFacts(facts, slots, page, item) {
    if (!page || !item) return;
    slots.page = page.Name;
    if (page.Id === item.Id) { facts.add('rel:self'); return; }
    const itemCollection = item.ProviderIds && item.ProviderIds.TmdbCollection, pageCollection = page.ProviderIds && page.ProviderIds.TmdbCollection;
    if (itemCollection && itemCollection === pageCollection) {
      facts.add('rel:coll');
      if ((item.ProductionYear || 0) > (page.ProductionYear || 0)) facts.add('rel:later'); else facts.add('rel:earlier');
    }
    const pageActors = new Set((page.People || []).filter((p) => p.Type === 'Actor').slice(0, 12).map((p) => p.Id));
    const sharedActor = (item.People || []).find((p) => p.Type === 'Actor' && pageActors.has(p.Id));
    if (sharedActor) { facts.add('rel:actor'); slots.shared = sharedActor.Name; }
    const pageDirector = (page.People || []).find((p) => p.Type === 'Director'), itemDirector = (item.People || []).find((p) => p.Type === 'Director');
    if (pageDirector && itemDirector && pageDirector.Id === itemDirector.Id) { facts.add('rel:director'); slots.director = pageDirector.Name; }
  }

  const ruleSets = [];
  const rule = (cond, ...t) => ruleSets.push({ need: cond ? cond.split(/\s*&\s*/) : [], t, w: 1 });
  const weightedRule = (w, cond, ...t) => ruleSets.push({ need: cond ? cond.split(/\s*&\s*/) : [], t, w });
  QUIP_LINES(rule, weightedRule);
  for (const k in PERSONAS) weightedRule(5, 'persona:' + k, ...PERSONAS[k]);
  for (const helper of HELPER_RULES) ruleSets.push({ need: helper.need, t: helper.t, w: helper.w || 1 });

  const recent = [];
  function holds(facts, need) {
    for (const cond of need) { if (cond[0] === '!' ? facts.has(cond.slice(1)) : !facts.has(cond)) return false; }
    return true;
  }
  function slotsOk(t, slots) {
    const keys = t.match(/\{(\w+)\}/g);
    return !keys || keys.every((x) => slots[x.slice(1, -1)] !== undefined && slots[x.slice(1, -1)] !== '');
  }
  function render(t, slots) {
    return t.replace(/\[([^\]]+)\]/g, (match, options) => pick(options.split('|'))).replace(/\{(\w+)\}/g, (match, k) => slots[k]);
  }
  const PREFIX = ['Breaking: ', 'Critics agree: ', 'Plot twist: ', 'Spoiler: ', 'Fun fact: ', 'Director\'s note: ', 'Studio memo: ', 'Rotten news: ', 'Leaked script: ', 'Trailer voice: '];
  const SUFFIX = [' (0/10)', ' - rated R for Rubble', ' No refunds.', ' Roll credits.', ' #{herotag}', ' - {weapon} approved', ' Fin.', ' Sequel cancelled.', ' Fresh: 0%', ' And scene.'];
  function choose(facts, slots) {
    let total = 0;
    const cand = [];
    for (const r of ruleSets) {
      if (!holds(facts, r.need)) continue;
      if (facts.has('deceased') && !r.need.includes('deceased')) continue;
      const ts = r.t.filter((t) => slotsOk(t, slots));
      if (!ts.length) continue;
      const spec = r.need.filter((c) => c[0] !== '!').length;
      for (const t of ts) {
        let w = r.w * Math.pow(1 + spec, 2.2) / ts.length;
        if (recent.includes(t)) w *= 0.02;
        cand.push([t, w]); total += w;
      }
    }
    if (!cand.length) return null;
    let x = Math.random() * total, t = cand[0][0];
    for (const [ct, w] of cand) { x -= w; if (x <= 0) { t = ct; break; } }
    recent.push(t); if (recent.length > 60) recent.shift();
    let out = render(t, slots);
    const r = Math.random();
    if (r < 0.12 && out.length < 34) out = pick(PREFIX) + (t[0] !== '{' && t[0] !== '"' && /^[A-Z][a-z]/.test(out) && !/^I/.test(out) ? out.charAt(0).toLowerCase() + out.slice(1) : out);
    else if (r > 0.9 && out.length < 34) { const sf = pick(SUFFIX); if (slotsOk(sf, slots)) out += (/[.!?)]$/.test(out) ? '' : '.') + render(sf, slots); }
    return out;
  }

  async function say(ctx) {
    const facts = new Set(), slots = { weapon: ctx.weapon, hero: ctx.hero && ctx.hero.name };
    if (slots.hero) slots.herotag = slots.hero.replace(/[^A-Za-z0-9]/g, '');
    if (!slots.weapon) delete slots.weapon;
    if (!slots.hero) delete slots.hero;
    const page = ctx.page || null;
    let it = null, franchises = [];
    try {
      if (ctx.kind === 'person') {
        await personFacts(ctx.id, ctx.el, facts, slots, page);
        if (!slots.name) return null;
      } else {
        it = await item(ctx.id);
        if (!it) return null;
        franchises = await itemFacts(it, facts, slots);
        pageFacts(facts, slots, page, it);
        if (ctx.kind === 'page') facts.add('rel:self');
      }
      heroFacts(facts, slots, ctx, franchises, it);
    } catch (e) { return null; }
    return choose(facts, slots);
  }
  return { say, prefetch, item, library, _rules: ruleSets };
})();
