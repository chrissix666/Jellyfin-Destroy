const POPS = [];
const POP_MAX = 4;
const eggSeen = new WeakSet();
const eggCool = {};
let eggWords = 0, eggStreak = [], eggFont = null, eggPage = null, eggLastPop = 0;
const pick = (list) => list[(Math.random() * list.length) | 0];
const POP_STYLE = {
  actor: ['#fff36a', '#ff9a1c'], self: ['#ffb3ff', '#e0309a'], text: ['#c8fbff', '#2fb8ff'],
  ui: ['#d8ffb0', '#3fc23a'], sys: ['#d8ffb0', '#3fc23a'], streak: ['#ffe0a0', '#ff3a1c'], film: ['#ffffff', '#b8b8c8'], quote: ['#fff7d6', '#e8c46a'],
};

function popText(text, x, y, kind, big) {
  if (kind !== 'streak' && kind !== 'sys' && !oneLinersOn()) return;
  const now = performance.now();
  if (POPS.length >= POP_MAX) POPS.shift();
  for (const pop of POPS) if (Math.abs(pop.x - x) < 200 && Math.abs(pop.y - y) < 40) y = pop.y - 40;
  POPS.push({ text, x, y, t0: now, kind, size: big ? 30 : 22, rot: (Math.random() - 0.5) * 0.09, dur: 1.9 + Math.min(2.2, text.length / 30) });
  eggLastPop = now;
}
function cool(cat, ms) {
  const now = performance.now();
  if ((eggCool[cat] || 0) > now) return false;
  eggCool[cat] = now + ms;
  return true;
}
function popLines(ctx, pop) {
  const maxW = Math.min(S.VW - 40, 620);
  const words = pop.text.split(' '), lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (cur && ctx.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  if (lines.length > 3) { lines.length = 3; lines[2] += '...'; }
  pop.lines = lines;
  pop.w = Math.max(...lines.map((l) => ctx.measureText(l).width));
}
function drawPops(ctx) {
  if (!POPS.length) return;
  if (!eggFont) eggFont = '"Noto Sans", ' + (getComputedStyle(game).fontFamily || 'sans-serif');
  const now = performance.now();
  ctx.save();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  for (let i = POPS.length - 1; i >= 0; i--) {
    const pop = POPS[i], t = (now - pop.t0) / 1000, DUR = pop.dur;
    if (t > DUR) { POPS.splice(i, 1); continue; }
    const k = t < 0.16 ? 1 + 0.35 * Math.sin((t / 0.16) * Math.PI) * (1 - t / 0.16) - (1 - t / 0.16) * 0.6 : 1;
    const alpha = t > DUR - 0.4 ? (DUR - t) / 0.4 : 1;
    const y = Math.max(pop.y - t * 22, S.view.y + 100);
    const [topColor, bottomColor] = POP_STYLE[pop.kind] || POP_STYLE.actor;
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    const size = pop.text.length > 60 ? Math.round(pop.size * 0.8) : pop.size;
    ctx.font = `italic 900 ${size}px ${eggFont}`;
    if (!pop.lines) popLines(ctx, pop);
    const sx = Math.min(Math.max(pop.x - S.view.x, pop.w / 2 + 12), S.VW - pop.w / 2 - 12);
    ctx.translate(Math.round(sx), Math.round(y - S.view.y));
    ctx.rotate(pop.rot); ctx.scale(k, k);
    const lh = size * 1.15, y0 = -((pop.lines.length - 1) * lh) / 2;
    pop.lines.forEach((line, j) => {
      const ly = y0 + j * lh;
      const grad = ctx.createLinearGradient(0, ly - size / 2, 0, ly + size / 2);
      grad.addColorStop(0, topColor); grad.addColorStop(1, bottomColor);
      ctx.lineWidth = 7; ctx.strokeStyle = '#000'; ctx.strokeText(line, 3, ly + 3);
      ctx.strokeText(line, 0, ly);
      ctx.fillStyle = grad; ctx.fillText(line, 0, ly);
    });
  }
  ctx.restore();
}

const EGG_GEN = [
  'Who needs {a}?', '{N} this!', 'Oops, {n} gone', '{N}: deleted', 'No more {n}', 'RIP {n}', '{N} not found',
  'Error 404: {n}', '{N}.exe has stopped working', 'Goodbye, {n}', '{The} {has} left the building', '{N}? Overrated.',
  'Who put {a} here anyway?', 'Deleted {the}. Felt good.', 'Nobody will miss {the}', '{The}: WASTED', '{The} {is} history',
  'Press F for {the}', 'Not {the}!', 'Well, there goes {the}', 'Fixed {the}', '{The} had it coming', 'Shot {the}. Twice.',
  '{The} {was} asking for it', 'Uninstalled {the}', '{N}? Not anymore.', 'Patch notes: removed {n}', 'Bug fixed: {n}',
  '{The} {is} now open-air', 'Ctrl+Z will not save {the}', '{N}: 0 HP', 'Achievement unlocked: no {n}',
  '!s One less {n}', '!s {N}, meet bullet', '!p {N}, meet bullets', '!s Who designed this {n}?', '!p Who designed these {n}?',
  '?w {W} vs. {n}: {W} wins', '?w Solved {the} with {a_w}', '?w {N}? Meet my {w}', '?w {W}: the universal remover of {n}',
];
const EGG_UI = [];
function EU(sel, n, options, ...lines) { EGG_UI.push({ sel, n, o: options || {}, lines }); }

EU('.headerSearchButton, .MuiIconButton-root[href*="search"]', 'search', { the: 'search', a: 'a search' },
  'Who needs a search?', 'Search and destroy', 'Nothing to find here', 'Searched. Destroyed.', '404: search not found',
  'Looking for something? Too late.', 'Search party cancelled', 'Seek and you shall NOT find');
EU('.headerCastButton, [aria-controls^="app-remote-play"]', 'cast button', null,
  'No cast for you', 'Cast away', 'Casting couch closed', 'Chromecast? Chrome-crashed.', 'The TV will not save you',
  'Streaming to: the void', 'Cast iron? Cast ironed.');
EU('.headerSyncButton, [aria-controls="app-sync-play-menu"]', 'SyncPlay', { the: 'SyncPlay', a: 'SyncPlay' },
  'SyncPlay? SoloPlay!', 'Out of sync', 'Friends? What friends', 'Watch party cancelled', 'Group watch: party of one',
  'Nobody is in sync with you now');
EU('.headerUserButton, [aria-controls="app-user-menu"], .headerUsername', 'profile', null,
  'Identity crisis', 'Who am I?', 'Logged out the hard way', 'Profile deleted. Manually.', 'Avatar: unrecognisable',
  'User not found. Ever.', 'You shot yourself. Profile-wise.');
EU('.headerHomeButton', 'home button', null,
  "There's no place like home", 'Homeless', 'Home sweet rubble', 'Home is where the crater is', 'E.T. cannot phone this home');
EU('.headerBackButton, .MuiToolbar-root > .MuiIconButton-root[aria-label*="ack"]', 'back button', null,
  'No way back', 'Point of no return', 'Back? Only forward.', 'History: deleted', 'You can never go back. Literally.');
EU('.mainDrawerButton, header.MuiAppBar-root .MuiToolbar-root > .MuiIconButton-root:first-child', 'menu', null,
  'Menu? What menu', 'Burger destroyed', 'Hamburger: well done', 'Three lines, zero lines', 'The menu is off the menu',
  'Kitchen closed');
EU('.headerAudioPlayerButton', 'music button', null, 'The music stopped', 'Silence is golden', 'Now playing: gunfire',
  'Drop the beat. Dropped.');
EU('.pageTitle', 'page title', null, 'Untitled document', 'Title: TBA', 'Name withheld', 'Page title? Page rubble.');
EU('.currentTimeText, .osdTimeText', 'clock', null, "Time's up", 'Clock stopped', 'It is now: destruction o\'clock',
  'Time flies when you shoot things', 'No time for this');
EU('#jf-destroy-btn', 'destroy button', null, 'Destroyed the destroyer', 'Self-destruct!', 'Who destroys the destroyer?',
  'Inception: destruction inside destruction', 'Meta-destruction');
EU('.headerTabs .emby-tab-button, .emby-tab-button, .guide-date-tab-button', 'tab', null,
  '{txt}? Closed.', 'Tab closed. Ctrl+Shift+T will not help.', 'One tab fewer', '{txt}: cancelled', 'Tabs? Not on my watch.');

EU('.btnLogout', 'sign out button', null, 'Signed out. Forcefully.', 'Leaving so soon?', 'Exit wound', 'Logout complete(ly destroyed)');
EU('.lnkManageServer, a[href*="dashboard"]', 'dashboard link', null, 'Admin rights: revoked', 'Server says ouch',
  'Dashboard? Smashboard.', 'Sysadmin is crying');
EU('.editorViewMenu, a[href*="metadata"]', 'metadata editor', null, 'Metadata: meta-dead', 'Nothing left to edit',
  'Edited. With bullets.');
EU('.btnSelectServer, .btnAddServer', 'server button', null, 'Server: down', 'No server, no problem',
  'It was a 500 anyway', 'Server room on fire');
EU('.btnSettings, .lnkDisplayPreferences, .lnkHomePreferences, .lnkPlaybackPreferences, .lnkSubtitlePreferences, .lnkUserProfile, .lnkQuickConnectPreferences, .clientSettings, .lnkControlsPreferences, .downloadManager',
  'settings', { pl: true, the: 'the settings', a: 'settings' },
  'Settings: unsettled', 'Preferences: none left', 'Settled it', 'Factory reset, manual edition', 'Configured to explode');
EU('.exitApp', 'exit button', null, 'Exit? Here is one.', 'No exit', 'Emergency exit used');
EU('.libraryMenuOptions .navMenuOption, .lnkMediaFolder, .MuiDrawer-paper .MuiListItemButton-root, .navMenuOption',
  'library link', null, '{txt}: closed for renovation', '{txt} burned down', 'Library card revoked',
  'Late fees: everything', '{txt}? Never heard of it.', 'Shelves cleared');
EU('.sidebarHeader, #libraries-subheader, [id$="-subheader"]', 'heading', null, 'Headless', 'Header? Header shot.',
  'Section without a title');

EU('.homeLibraryButton, .homeLibraryButtonContainer .emby-button', 'library button', null,
  '{txt} burned down', '{txt}: permanently closed', 'My Media: Not My Media anymore', 'Library card shredded', '{txt}? Empty now.');
EU('.sectionTitleTextButton, .sectionTitle', 'section title', null,
  'Untitled', 'Headless', 'Section closed', '{txt}: cancelled', '{txt}? Not anymore.', 'Continue watching? Discontinued.',
  'Next up: nothing', 'Latest: last');
EU('.emby-scrollbuttons-button, .emby-scrollbuttons', 'scroll arrow', null,
  'Scrolling is cancelled', 'No more left or right', 'Stuck in the middle', 'Arrows: blunted');
EU('.centerMessage, .noItemsMessage', 'empty message', null, 'It was empty anyway', 'Nothing to see, now even less',
  'Shot the void');

EU('.btnShuffle, .btnShuffleQueue, .MuiButton-root[title="Shuffle"]', 'shuffle button', null,
  'Shuffled into pieces', 'Random destruction', 'Shuffle? Scatter!', 'Order restored. By force.', 'Dice: broken');
EU('.btnPlayAll, .MuiButton-root[title="Play All"]', 'play-all button', null,
  'Play all? Destroy all!', 'All of it, gone', 'Marathon cancelled', 'Binge interrupted');
EU('.btnQueue, .MuiButton-root[title="Add to play queue"]', 'queue', null, 'Queue jumped', 'Queue: out of order',
  'The line ends here');
EU('.btnSort, .btnSortText, .btnSortIcon, [title="Sort"]', 'sort button', null,
  'Sorted. By calibre.', 'Order: chaos', 'Sort by: destruction', 'Alphabetical? Ballistical.', 'A to Z? A to zero.');
EU('.btnFilter, [title="Filter"], [title="Reset filters"]', 'filter', null,
  'Filter: everything', 'Unfiltered destruction', 'Only rubble matches', 'Filtered out. Permanently.');
EU('.btnSelectView, .btnViewSettings, .btnChangeLayout, [title="View settings"], .btnGuideViewSettings', 'view settings',
  { pl: true, the: 'the view settings', a: 'view settings' },
  'View: obstructed', 'New layout: crater', 'Grid? Grit.', 'Viewing angle: from below');
EU('.btnNewCollection, .btnNewItem', 'new button', null, 'Nothing new here', 'Created and destroyed', 'New? Old news.');
EU('.alphaPickerButton, .alphaPicker-fixed-right .MuiToggleButton-root', 'letter', null,
  'The letter {txt} is history', 'Today\'s show was brought to you by the letter {txt}. Was.', 'No more {txt}',
  'Alphabet minus one', '{txt} for "destroyed"', 'Spelling bee: lost');
EU('.alphaPicker', 'alphabet', null, 'ABC? RIP.', 'Illiterate now', 'The alphabet has left the chat');
EU('.listPaging, .paging, .MuiToolbar-root .MuiChip-root', 'item counter', null, 'Count: zero', 'Math: destroyed',
  'Counting is overrated', '{txt}? Fewer now.');
EU('.btnNextPage, .MuiToolbar-root [title="Next"]', 'next button', null, 'There is no next', 'The end',
  'Next page: last page');
EU('.btnPreviousPage, .MuiToolbar-root [title="Previous"]', 'back arrow', null, 'No way back', 'Previously on: nothing',
  'History: rewritten');
EU('[aria-controls="library-view-menu"]', 'view menu', null, 'View: obstructed', '{txt}? Viewed. Destroyed.');

const EGG_CARD = [];
function EC(sel, n, options, ...lines) { EGG_CARD.push({ sel, n, o: options || {}, lines }); }
EC('.cardOverlayFab-primary, .cardOverlayButton[data-action="play"], .cardOverlayButton[data-action="resume"], .cardOverlayButton-centered',
  'play button', null, 'Oops, play button gone', 'No time to watch', 'Play? Slay!', 'Playback error: bullet',
  'Press play to... oh.', 'Unplayable now');
EC('.cardOverlayButton[is="emby-ratingbutton"], .listItemButton[is="emby-ratingbutton"], [is="emby-ratingbutton"]',
  'heart', null, 'Heartbreaker', 'Love hurts', 'Unfavourited. Violently.', 'Broke a heart today', 'Achy breaky heart');
EC('.cardOverlayButton[is="emby-playstatebutton"], .listItemButton[is="emby-playstatebutton"], [is="emby-playstatebutton"]',
  'check mark', null, 'Unwatched now', 'Unchecked', 'Seen it? Not anymore.', 'Check, mate');
EC('.cardOverlayButton[data-action="menu"], .btnCardOptions, .listItemButton[data-action="menu"]', 'three dots',
  { pl: true, the: 'the three dots', a: 'three dots' }, 'Less commands', 'Dot dot... dead', 'Options: none',
  'Ellipsis: ended...');
EC('.playedIndicator', 'played badge', null, 'Seen it. Shot it.', 'Watched AND wrecked', 'Spoilers: destroyed',
  'Been there, destroyed that');
EC('.countIndicator, .unplayedItemCount, .childCountIndicator', 'unwatched counter', null, 'Counter: reset',
  '{txt} unwatched? Zero now.', 'Backlog cleared. Violently.', 'Catching up the hard way');
EC('.itemProgressBar, .itemProgressBarForeground', 'progress bar', null, 'Progress: lost', 'Resume? Ruin.',
  'Continue watching? Discontinued.', 'Loading... never', 'Progress is overrated');
EC('.mediaSourceIndicator', 'version badge', null, 'Versions: none', 'Director\'s cut: very cut', 'All versions, one crater');
EC('.missingIndicator', 'missing badge', null, 'Missing? Now really.', 'Missing presumed destroyed');
EC('.unairedIndicator', 'unaired badge', null, 'Will never air', 'Cancelled before the pilot', 'Unaired. Unloved.');
EC('.timerIndicator, .timerIcon, .seriesTimerIcon', 'recording dot', null, 'Recording stopped', 'Tape erased', 'REC? WRECK.');
EC('.cardImageIcon, .defaultCardBackground, .cardDefaultText', 'placeholder', null, 'It had no poster anyway',
  'Shot a placeholder', 'Image not found. Now really.');
EC('.cardFooterLogo', 'logo', null, 'Logo? No go.', 'Brand damage');

EU('.listViewDragHandle', 'drag handle', null, 'Nothing to drag anymore', 'Handled.', 'Drag and drop. Dropped.');
EU('.listItem-indexnumberleft', 'track number', null, 'Number {txt}: retired', 'Track {txt}: skipped forever',
  'Numbers are overrated');
EU('.listGroupHeader', 'group header', null, '{txt}: disbanded', 'Group split up');
EU('.listItem-overview, .listItem-bottomoverview', 'summary', null, 'Spoiler-free now', 'TL;DR', 'Plot: shredded');

EU('.btnPlay, .btnReplay, .btnResume, .btnPlayOrResume', 'play button', null,
  'Oops, play button gone', 'No time to watch', 'Play? Slay!', 'Rather shoot than watch', 'Playback error: bullet',
  'Watch later. Much later.', 'Press play to... oh.', 'Showtime cancelled');
EU('.btnPlayTrailer', 'trailer button', null, 'Spoiler-free now', 'Trailer park', 'Trailer: towed', 'In a world... without trailers',
  'Coming soon: never');
EU('.btnUserRating', 'favourite button', null, 'Heartbreaker', 'Not a favourite anymore', 'Love hurts', 'Unfavourited. Violently.',
  'It is not you, it is my {w}');
EU('.btnPlaystate', 'watched button', null, 'Unwatched now', 'Seen enough', 'Marked as destroyed', 'Watched: the explosion');
EU('.btnDownload', 'download button', null, 'Download complete(ly destroyed)', 'Offline. Forever.', '0 % downloaded',
  'You wouldn\'t download a crater');
EU('.btnInstantMix', 'instant mix', null, 'Instant mess', 'Mix: shaken AND stirred', 'Remix: destruction edition');
EU('.btnMoreCommands', 'more button', null, 'Less commands', 'No more options', 'Options: none', 'More? Less.');
EU('.btnSplitVersions', 'split button', null, 'Split. In two. Literally.', 'Versions: shredded');
EU('.btnCancelSeriesTimer, .btnCancelTimer, .btnRecord', 'record button', null, 'Recording: wrecked', 'REC? WRECK.',
  'Tape erased');
EU('.starRatingContainer, .starIcon', 'star rating', null, 'Everyone is a critic', 'Zero stars', 'Rating: destroyed',
  '{txt} stars? Make that zero.', 'Starless night');
EU('.mediaInfoCriticRating, .mediaInfoCriticRatingFresh, .mediaInfoCriticRatingRotten', 'tomato', null, 'Fresh? Rotten.',
  'Tomato: ketchup now', 'Splat!', '{txt}? Make that 0 %.');
EU('.mediaInfoOfficialRating', 'age rating', null, 'Rated {txt}? Now rated R for Ruined.', 'Parental guidance: none',
  'Not suitable for anyone now', '{txt}: re-rated', 'Age check failed');
EU('.endsAt, .endsAtText', 'end time', null, 'Ends at: now', '{txt}? It ends now.', 'Early finish', 'Spoiler: it ends here');
EU('.closedCaptionMediaInfoText', 'CC badge', null, '[EXPLOSION]', '[GUNFIRE INTENSIFIES]', 'Captions: closed. Very.');
EU('.itemMiscInfo-primary, .itemMiscInfo-secondary, .mediaInfoItem', 'info line', null, "Time's up", 'Runtime error',
  'Info: insufficient', '{txt}? Not anymore.', 'Facts: shot');
EU('.tagline', 'tagline', null, 'Who needs a tagline?', 'Tagline this!', 'No more catchphrase', 'Tagline: shot',
  'In a world... without taglines', 'This summer: nothing', 'Catchy. Caught.', 'Slogan: no longer applies');
EU('.overview-expand', 'more link', null, 'Read more? Read less.', 'Expanded. Explosively.');
EU('.itemGenres, .genresGroup, .detailsGroupItem a[href*="genre"]', 'genre', null, 'Genre-fluid', 'Genre: rubble',
  'New genre: destruction', '{txt}? Not anymore.', 'No more {txt} for you', 'Genre-bending. Literally.');
EU('.itemTags, .itemTags .button-link', 'tags', { pl: true, the: 'the tags', a: 'tags' }, 'Untagged', 'Tag, you are it',
  'Keywords: gone', '#{txt}? #gone', 'Tagged and bagged');
EU('.studiosGroup, .studios, .detailsGroupItem a[href*="studio"]', 'studio', null, '{txt} has been bought out',
  'Studio closed', 'Production halted', '{txt}: bankrupt now', 'Hostile takeover complete');
EU('.directorsGroup, .directors', 'director credit', null, 'Directed by: nobody now', '{txt}\'s cut: very cut',
  'Cut! Print! Destroy!', 'Director\'s cut. With {a_w}.');
EU('.writersGroup, .writers', 'writer credit', null, 'Rewrite complete', 'Writers\' room: closed', 'Plot holes: many',
  'Script: shredded');
EU('.itemDetailsGroup .button-link, .detailsGroupItem .button-link, .itemDetailsGroup', 'credit', null,
  'Credits: cut short', 'Uncredited now', 'Name: illegible');
EU('.itemExternalLinks, .itemExternalLinks .button-link', 'external link', null, '{txt}? Link rot.',
  'Link broken. Literally.', 'Click here to... no.', '404 for {txt}');
EU('.trackSelections, .selectSource, .selectVideo, .selectAudio, .selectSubtitles, .emby-select', 'dropdown', null,
  'No options left', 'Dropped down', 'Selection: none', 'Audio: gunfire only', 'Subtitles: [screaming]');
EU('.parentName, .musicParentName', 'series link', null, '{txt}: cancelled', 'Orphaned', 'No parent, no problem');
EU('.originalTitle', 'original title', null, 'Original? Not anymore.', 'Lost in translation', 'Remake pending');
EU('#childrenTitle, #peopleHeader', 'heading', null, 'Headless', '{txt}? None left.', 'Section closed');
EU('.nextUpSection', 'next up', { the: 'Next Up', a: 'a next up' }, 'Next up: nothing', 'Up next: rubble', 'Nothing is next');
EU('.similarContent, #similarCollapsible', 'recommendations', { pl: true, the: 'the recommendations', a: 'recommendations' },
  'More like this? Less like this.', 'Similar: destroyed', 'Algorithm: confused', 'Because you watched: nothing');
EU('#scenesContent, .chapterCard', 'chapter', null, 'Skipped a chapter', 'Scene deleted', 'Deleted scenes: all of them',
  'Chapter closed');
EU('#specialsContent, #additionalPartsContent', 'extras', { pl: true, the: 'the extras', a: 'extras' }, 'Bonus: destroyed',
  'Behind the scenes: rubble', 'Making-of: unmaking-of');
EU('#collectionsContent, .collectionItemsContainer', 'collection', null, 'Box set: boxed', 'Collection: scattered',
  'Complete collection? Incomplete.');
EU('#lyricsSection, .lyricsLine, .lyricsContainer', 'lyrics', { pl: true, the: 'the lyrics', a: 'lyrics' },
  'Lyrics: la la la... gone', 'Sing along? Shoot along.', 'Instrumental now');
EU('#itemBirthday, #itemBirthLocation', 'birthday', null, 'Cake: destroyed', 'Happy... oh.', 'Birthday candles: blown out');
EU('#seriesAirTime', 'air time', null, 'Off the air', 'Airs: never', 'Signal lost');

EU('.btnPause, .playPauseButton, .btnPlayPause', 'pause button', null, 'Paused forever', 'Unpausable now',
  'Play? Pause? Neither.', 'Freeze frame');
EU('.stopButton, .btnStop', 'stop button', null, 'Unstoppable now', 'Stop! Hammer time.', 'Cannot stop, will not stop');
EU('.btnRewind, .btnNowPlayingRewind, .btnPreviousTrack, .previousTrackButton, .btnPreviousChapter', 'rewind button', null,
  'No way back', 'Be kind, do not rewind', 'Previously on: rubble');
EU('.btnFastForward, .btnNowPlayingFastForward, .btnNextTrack, .nextTrackButton, .btnNextChapter', 'skip button', null,
  'Skipped to the end', 'Fast-forwarded into a wall', 'Skip this!');
EU('.osdPositionSlider, .nowPlayingBarPositionSlider, .nowPlayingPositionSlider, .mdl-slider, .sliderMarkerContainer', 'slider',
  null, 'Seek and destroy', 'Timeline: shattered', 'Lost track of time', 'Scrubbed. Hard.');
EU('.buttonMute, .muteButton, .osdVolumeSlider, .nowPlayingBarVolumeSlider', 'volume', { the: 'the volume', a: 'volume' },
  'Volume: 11. Then 0.', 'Silence!', 'Muted. Permanently.', 'LOUD NOISES', 'Turned it up to eleven');
EU('.btnSubtitles', 'subtitles button', null, '[UNINTELLIGIBLE]', 'Subtitles: [screaming]', 'Read my lips instead');
EU('.btnAudio, .btnAudioTracks', 'audio button', null, 'Audio: gunfire only', 'Dubbed in explosions', 'Language: violence');
EU('.btnFullscreen, .btnToggleFullscreen', 'fullscreen button', null, 'Full screen? Full crater.', 'Exit fullscreen. Forever.',
  'Screen: broken');
EU('.btnPip', 'picture-in-picture', { the: 'picture-in-picture', a: 'picture-in-picture' }, 'Picture in pieces',
  'PiP? RIP.');
EU('.btnVideoOsdSettings, .btnToggleContextMenu, .btnContextMenu, .bthShowSettings', 'settings gear', null,
  'Gears: grinded', 'Settings: unsettled');
EU('.btnAirPlay', 'AirPlay', { the: 'AirPlay', a: 'AirPlay' }, 'AirPlay? Air strike.', 'Air: polluted');
EU('.toggleRepeatButton, .btnRepeat', 'repeat button', null, 'Never again', 'Repeat? No repeat.', 'Groundhog day: over');
EU('.openLyricsButton, .btnLyrics', 'lyrics button', null, 'Lyrics: la la la... gone', 'Mumble rap now');
EU('.osdTitle, .nowPlayingBarText, .nowPlayingSongName, .nowPlayingPageTitle', 'title', null, '{txt}: interrupted',
  'Now playing: nothing', 'Title: TBA');
EU('.nowPlayingImage, .nowPlayingPageImage, .nowPlayingPageImageContainer', 'cover art', null, 'Cover blown',
  'Album art: abstract now', 'Judged a book by its cover');
EU('.skip-button', 'skip button', null, 'Skipped the skip button', 'Intro skipped. Permanently.', 'Skip? Strike!');
EU('.upNextContainer, .upNextDialog, .btnStartNow', 'up next', { the: 'Up Next', a: 'an up next' }, 'Up next: nothing',
  'Start now? End now.', 'Autoplay cancelled');
EU('.btnArrowUp, .btnArrowDown, .btnArrowLeft, .btnArrowRight, .btnOk', 'remote button', null, 'Remote: out of control',
  'Up, up, down, down... boom', 'OK? Not OK.');
EU('.videoSubtitles, .videoSubtitlesInner', 'subtitles', { pl: true, the: 'the subtitles', a: 'subtitles' }, '[GUNFIRE]',
  '[DRAMATIC SILENCE]', '[SUBTITLES DESTROYED]');
EU('.osdMediaStatus, .docspinner, .mdl-spinner, .progressring', 'spinner', null, 'Loading... never', 'Buffering: forever',
  'Spinner: dizzy', 'Please wait. Or do not.');

EU('.guideChannelName, .guideChannelNumber, .guideChannelImage, .guide-channelHeaderCell', 'channel', null,
  'Channel {txt}: no signal', 'Off the air', 'Zapped', 'Channel surfing: wipeout');
EU('.programCell, .guideProgramNameText, .guideProgramName', 'programme', null, '{txt}: cancelled', 'Programme interrupted',
  'We apologise for the interruption', 'Technical difficulties');
EU('.guideProgramIndicator, .liveTvProgram, .newTvProgram, .premiereTvProgram, .repeatTvProgram', 'badge', null,
  '{txt}? Not anymore.', 'Live? Dead.', 'New? Old news.', 'Repeat? Never again.');
EU('.timeslotHeader', 'time slot', null, 'Prime time: over', 'Time slot: vacant');

EU('.actionSheetMenuItem, #app-user-menu .MuiMenuItem-root, #library-view-menu .MuiMenuItem-root', 'menu option', null,
  '{txt}? Done. Differently.', 'Option removed', 'Selected: destruction');
EU('.btnCloseActionSheet, .formDialogHeader .btnCancel, .btnCancel', 'close button', null, 'Closed. Forcefully.',
  'Cannot close what is gone');
EU('.toast, .MuiSnackbar-root', 'notification', null, 'Notification dismissed. Violently.', 'Toast: burnt',
  'Do not disturb: enforced');
EU('.dialog, .MuiDialog-paper, .formDialogHeaderTitle', 'dialog', null, 'Conversation over', 'No more questions',
  'Are you sure? Too late.');
EU('.button-submit, .btnSubmit, .btnSave', 'save button', null, 'Saved? Shredded.', 'Changes lost. All of them.',
  'Submit to destruction');
EU('.emby-checkbox-label, .checkboxIcon, .mdl-switch, .mdl-radio', 'checkbox', null, 'Unchecked', 'Switched off. Hard.',
  'Option: none of the above');
EU('.emby-input, .emby-textarea, #txtManualName, #txtManualPassword, .searchfields-txtSearch', 'input field', null,
  'Nothing to type here', 'Input: rejected', 'Autocorrect: destroyed');

EU('#divUsers .card', 'user tile', null, 'Who? Never met.', 'User: unknown now', 'Wrong user. All of them.');
EU('.btnForgotPassword', 'forgot password', { the: 'Forgot Password', a: 'a forgot password' }, 'Forgot? Forgotten.',
  'Password: shot');
EU('.btnRefresh', 'scan button', null, 'Library scan: crater detected', 'Scanned. Shot.');
EU('#btnRestartServer, #btnShutdown', 'server button', null, 'Shut down. Manually.', 'Restart? Reshoot.',
  'Server says ouch');
EU('.activeDevices .card, .sessionNowPlayingName, .sessionDeviceName', 'device', null, 'Device disconnected. Physically.',
  'Session terminated');
EU('#divVirtualFolders .card, #mediaLibraryPage .MuiCard-root', 'library', null, 'Library: closed', 'Rescan this!',
  'Media: missing');
EU('.divScheduledTasks .listItem, #scheduledTasksPage .MuiListItem-root, .btnStartTask, .btnStopTask, .taskProgressOuter',
  'task', null, 'Task failed successfully', 'Scheduled: never', 'Cron job: cancelled');
EU('.serverLogs .listItem, #logPage .MuiListItem-root', 'log file', null, 'Logs: shredded', 'No evidence left',
  'Error: everything');
EU('#pluginsPage .MuiCard-root, .noConfigPluginCard', 'plugin', null, 'Plugin unplugged', 'Uninstalled the hard way',
  'Plugin: plug out');
EU('.localUsers .card, #userProfilesPage .card', 'user', null, 'User deleted. Manually.', 'Account closed');
EU('.dashboard-appBar, #dashboardPage .MuiPaper-root, .dashboardSection', 'dashboard', null, 'Dashboard? Smashboard.',
  'Sysadmin is crying', 'Uptime: 0');
EU('#serverActivityPage .MuiTableRow-root, .userActivityItems .listItem, .serverActivityItems .listItem', 'activity entry',
  null, 'Activity: destroying', 'Logged. Then shot.');

EU('.itemBackdrop, .backdropImage, .backdropContainer, #itemBackdrop', 'backdrop', null, 'Redecorating',
  'Background check: failed', 'Wallpaper: shredded', 'Scenery: ruined', 'Set design: demolished');
EU('.detailLogo', 'logo', null, 'Logo? No go', 'Brand damage', 'Rebranding in progress');
EU('.mainDetailButtons, .detailButton', 'button', null, 'Buttons: pushed. Too far.', 'Out of buttons');
EU('.nowPlayingBar, .videoOsdBottom', 'player', null, 'Player: eliminated', 'Game over for the player');
EU('.skinHeader, header.MuiAppBar-root', 'header', null, 'Headless', 'Header: shot', 'Off with its head');
EU('.appfooter', 'footer', null, 'Footer: footnote', 'Rock bottom');

const eggRecent = [];
const eggCap = (word) => word.charAt(0).toUpperCase() + word.slice(1);
const eggArt = (n) => (/^[aeiou]/i.test(n) ? 'an ' : 'a ') + n;
function eggTxt(el) {
  const t = ((el.getAttribute && (el.getAttribute('title') || el.getAttribute('aria-label'))) || el.textContent || '')
    .replace(/\s+/g, ' ').trim();
  return t.length >= 1 && t.length <= 28 && !/[{}]/.test(t) ? t : '';
}
function eggFill(tpl, e, txt) {
  const options = e.o, plural = !!options.pl, n = e.n;
  const the = options.the || 'the ' + n, article = options.a || (plural ? n : eggArt(n));
  const w = weaponName();
  return tpl.replace(/\{(\w+)\}/g, (match, k) => ({
    n, N: eggCap(n), the, The: eggCap(the), a: article, A: eggCap(article), txt, w: w || 'bullet', W: eggCap(w || 'bullet'),
    a_w: w ? eggArt(w) : 'a bullet', is: plural ? 'are' : 'is', was: plural ? 'were' : 'was', has: plural ? 'have' : 'has',
  })[k] ?? match);
}
function eggLine(e, el) {
  const txt = eggTxt(el), hasW = !!weaponName();
  const ok = (line) => (!/\{txt\}/.test(line) || txt) && (!/\{w\}/.test(line) || hasW);
  const own = e.lines.filter(ok);
  const gen = EGG_GEN.filter((line) => {
    if (line.startsWith('!s ')) return !e.o.pl;
    if (line.startsWith('!p ')) return !!e.o.pl;
    if (line.startsWith('?w ')) return hasW;
    return true;
  }).map((line) => line.replace(/^[!?][spw] /, ''));
  let t = '';
  for (let k = 0; k < 6; k++) {
    const pool = own.length && Math.random() < 0.62 ? own : gen;
    t = eggFill(pick(pool), e, txt);
    if (!eggRecent.includes(t)) break;
  }
  eggRecent.push(t);
  if (eggRecent.length > 12) eggRecent.shift();
  return t;
}
function eggMatch(list, el, within) {
  for (const e of list) {
    let hit = null;
    try { hit = el.matches && el.matches(e.sel) ? el : el.closest && el.closest(e.sel); } catch (x) { continue; }
    if (hit && (!within || within.contains(hit))) return [e, hit];
  }
  return null;
}

function weaponName() {
  const player = S.me;
  if (!player) return '';
  const w = (HIT && HIT.wn) || (WEAPONS[player.weapon] && WEAPONS[player.weapon].name) || '';
  return w.replace(/_/g, ' ');
}
function eggsStart() {
  POPS.length = 0; eggWords = 0; eggStreak = [];
  try { if (!S.party) initParty(); showParty(); } catch (e) { }
  if (!$('#djBot')) { const bb = document.createElement('div'); bb.id = 'djBot'; bb.textContent = 'AUTOPILOT  (B)'; $('#hud').appendChild(bb); }
  $('#djBot').classList.toggle('on', BOT.on);
  Object.assign(JU, { stop: 0, slow: 0, lights: [], embers: [], fall: [], special: 0, credits: false });
  fxReset();
  muteHud();
  eggPage = Promise.resolve(typeof pageItem === 'function' ? pageItem() : null).then((x) => x, () => null);
  try {
    const ids = [...document.querySelectorAll('.card[data-id]')].slice(0, 400).map((c) => c.getAttribute('data-id'));
    QUIP.prefetch(ids);
    QUIP.library();
    QP.prefetch(ids, eggPage, S && S.me && S.me.hero && S.me.hero.id);
    setTimeout(eggHeroLine, 2500);
  } catch (e) { }
}
let eggDestroyed = 0;
const heroId = () => (S && S.me && S.me.hero && S.me.hero.id) || null;
function eggPerson(pid, el, name, cx, cy) {
  Promise.resolve(eggPage).then(async (page) => {
    let t = null;
    try {
      if (name && Math.random() < 0.75) {
        if (page && page.Type !== 'Person') t = await QP.personIn(await QP.where(page), name);
        if (!t && heroId()) t = await QP.ensemble(heroId(), name);
      }
    } catch (e) { t = null; }
    if (t && S) { popText(t, cx, cy, 'quote'); return; }
    eggQuip('person', pid, el, cx, cy, 'actor', name ? `Bye bye ${name}` : null);
  });
}
function eggCard(id, el, cx, cy) {
  Promise.resolve(eggPage).then(async (page) => {
    let t = null;
    try {
      const w = await QP.where(await QUIP.item(id));
      if (w && page && page.Type === 'Person') t = await QP.personIn(w, page.Name);
      if (!t && w && Math.random() < 0.35) t = await QP.medium(w);
    } catch (e) { t = null; }
    if (t && S) { popText(t, cx, cy, 'quote'); return; }
    eggQuip('item', id, el, cx, cy, 'film', null);
  });
}
function eggHeroLine() {
  const h = heroId(); if (!h || !S || !S.me) return;
  QP.heroLine(h).then((t) => { if (t && S && S.me) popText(t, S.me.x, S.me.y - 110, 'quote', true); }, () => {});
}
function eggQuip(kind, id, el, cx, cy, style, fallback) {
  const hero = S.me && S.me.hero, weapon = weaponName();
  Promise.resolve(eggPage).then((page) => QUIP.say({ kind, id, el, hero, weapon, page }))
    .then((t) => t || fallback, () => fallback)
    .then((t) => { if (t && S) popText(t, cx, cy, /"/.test(t) ? 'quote' : style, /himself|Self|own role|vs\./.test(t)); });
}

function eggOnDestroy(block) {
  if (!S || S.mode === 'mp' || !S.me) return;
  const el = block.el, cx = block.x + block.w / 2, cy = block.y + Math.min(block.h / 2, 60);
  const now = performance.now();
  if (++eggDestroyed % 25 === 0 && cool('hero', 9000) && Math.random() < 0.6) eggHeroLine();
  eggStreak.push(now);
  while (eggStreak.length && eggStreak[0] < now - 1200) eggStreak.shift();
  if (eggStreak.length >= 30 && cool('streak', 6000)) popText(pick(['DEMOLITION!', 'FRENZY!', 'WRECKING BALL!', 'Insane destruction bonus', 'MULTI-WRECK!', 'Collateral damage: yes']), S.me.x, S.me.y - 110, 'streak', true);

  const person = el.closest && el.closest('.personCard, .card[data-type="Person"]');
  if (person) {
    if (eggSeen.has(person)) return;
    eggSeen.add(person);
    const nameEl = person.querySelector('.cardText');
    const name = nameEl ? nameEl.textContent.trim() : '';
    eggPerson(person.getAttribute('data-id'), person, name, cx, cy);
    return;
  }
  const card = el.closest && el.closest('.card[data-id], .listItem[data-id]');
  if (card) {
    const part = eggMatch(EGG_CARD, el, card);
    if (part && !eggSeen.has(part[1]) && Math.random() < 0.45 && cool('ui', 500)) {
      eggSeen.add(part[1]);
      popText(eggLine(part[0], part[1]), cx, cy, 'ui');
      return;
    }
    if (eggSeen.has(card)) return;
    eggSeen.add(card);
    if (!cool('card', 900)) return;
    eggCard(card.getAttribute('data-id'), card, cx, cy);
    return;
  }
  const self = el.closest && el.closest('.detailImageContainer, .nameContainer, .detailLogo, .itemBackdrop');
  if (self && eggPage && cool('self', 4000)) {
    eggSeen.add(self);
    Promise.resolve(eggPage).then(async (page) => {
      if (!page) return;
      let t = null;
      if (Math.random() < 0.5) try { t = await QP.medium(await QP.where(page)); } catch (e) { t = null; }
      if (t && S) popText(t, cx, cy, 'quote'); else eggQuip('page', page.Id, self, cx, cy, 'film', null);
    });
    return;
  }
  const ui = eggMatch(EGG_UI, el, null);
  if (ui) {
    if (eggSeen.has(ui[1]) || !cool('ui', 500)) return;
    eggSeen.add(ui[1]);
    popText(eggLine(ui[0], ui[1]), cx, cy, 'ui');
    return;
  }
  if (block.kind === 'word') {
    eggWords++;
    const overview = el.closest && el.closest('.overview');
    if (eggWords >= 18 && cool('text', 4500)) {
      eggWords = 0;
      popText(pick(overview ? ['Spoiler-free now', 'TL;DR', 'Plot? What plot', 'Too much text', 'Synopsis: shredded', 'The summary was too long anyway']
        : ['Hates reading', 'Too much text', 'TL;DR', 'Words hurt', 'Reading is overrated', 'Spelling: destroyed', 'Wall of text: demolished', 'Typography crime scene']), cx, cy, 'text');
    }
  }
}
