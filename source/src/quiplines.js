
const PERSONAS = {
  samueljackson: ['Enough of these #@!%-ing [cards|posters] on this #@!%-ing [page|screen]!', 'Say "what" again. I dare you.', '[#@!%|$#!@|%&#@!] - [that card|that poster] is GONE', 'English, #@!%! Do you speak it?', 'The path of the righteous man... ends here', 'Hold on to your [cards|butts]!', 'Nick Fury is NOT pleased, #@!%'],
  samuelljackson: ['Enough of these #@!%-ing [cards|posters] on this #@!%-ing [page|screen]!', 'Say "what" again. I dare you.', '[#@!%|$#!@|%&#@!] - [that card|that poster] is GONE', 'English, #@!%! Do you speak it?', 'Hold on to your [cards|butts]!', 'Nick Fury is NOT pleased, #@!%'],
  leonardodicaprio: ['Who raises the glass now?', 'Nobody raises a glass for this one', 'I\'m the king of the [rubble|world]!', 'Finally won something: [a bullet|a rocket]', 'Never let go... oops', 'Inception: a hole within a hole', 'The Wolf of [Wall Street|Rubble Street]'],
  keanureeves: ['You\'re breathtaking! ...and broken', 'Whoa.', 'Dodged nothing this time', 'There is no [card|spoon]', 'Keanu will come for you. You killed his [card|dog]', 'Excellent! *air guitar*'],
  arnoldschwarzenegger: ['He won\'t be back', 'Hasta la vista, [baby|card]', 'Get to the [choppa|rubble]!', 'It\'s not a tumor! It\'s a [hole|crater]', 'Consider that a divorce', 'Stick around... not', 'Dillon! You son of a [card|poster]!'],
  sylvesterstallone: ['Yo, Adrian! I did it! ...wait', 'They drew first blood, not me', 'Nothing is over! ...it is now', 'Ding ding - knocked out', 'Live for nothing, die for [your poster|nothing]'],
  brucewillis: ['Yippee-ki-yay, [card|poster|mother-#@!%]', 'Welcome to the party, pal!', 'Now I have a machine gun. Ho-ho-ho.', 'Die Harder', 'I see dead [cards|pixels]', 'Zed\'s dead, baby. Zed\'s dead.', 'We\'re gonna nuke this [card|poster]'],
  tomcruise: ['Did his own stunt. Missed.', 'Mission: Impossible? Mission: done.', 'You can\'t handle the [truth|rubble]!', 'Show me the [money|rubble]!', 'Feel the need - the need for [speed|destruction]'],
  harrisonford: ['I have a bad feeling about this', 'It belongs in a [museum|bin]!', 'Get off my [plane|page]!', 'Snakes. Why did it have to be [snakes|bullets]?', 'Never tell me the odds'],
  nicolascage: ['Not the [bees|bullets]! NOT THE [BEES|BULLETS]!', 'Face/Off. Literally.', 'Put... the card... back', 'Going to steal the [Declaration|debris]', 'Ka-boom. Cage-style.'],
  jasonstatham: ['Transported. To the bin.', 'Crank\'d', 'Bald. Brutal. Broken.', 'The Expendables? Expended.'],
  vindiesel: ['Family. Destroyed.', 'One quarter mile at a time. Gone in one.', 'I am [Groot|rubble]', 'Nobody drives this card anymore'],
  dwaynejohnson: ['Can you smell what {hero} is [cooking|shooting]?', 'The Rock, meet the rocket', 'Jumanji? Jumandone.'],
  liamneeson: ['A very particular set of [skills|holes]', 'I will find you. I did.', 'Taken. Out.', 'Release the [Kraken|rockets]!'],
  jackiechan: ['Did his own stunt. And this one.', 'Rush hour: over', 'Drunken master, sober bullet'],
  jeanclaudevandamme: ['Split. Into pieces.', 'Bloodsport: card edition', 'Kickboxer? Kicked out.'],
  stevenseagal: ['Under siege. Lost.', 'Hard to kill? Easy, actually.'],
  chucknorris: ['Chuck Norris let you do that', 'The bullet asked Chuck for permission first', 'Chuck Norris counted to infinity. Twice. This card: once.', 'Walker, Texas Ranger: walked'],
  robertdowneyjr: ['I am Iron [Man|rubble]', 'Snapped.', 'Proof that Tony Stark has a [heart|hole]', 'Genius, billionaire, playboy, [debris|shredded]'],
  chrisevans: ['I can do this all day. The card couldn\'t.', 'Avengers... disassemble!', 'Language! ...#@!%'],
  chrishemsworth: ['Struck by [lightning|lead]', 'Thor: Rubblenarok', 'He\'s a friend from work... was'],
  hughjackman: ['Healing factor not included', 'Snikt. Gone.', 'Bub, that\'s gonna leave a mark'],
  ryanreynolds: ['Maximum effort. Minimum poster.', 'Fourth wall: also destroyed', 'Chimichangas!', 'Hey, that\'s my [card|face]!'],
  tomholland: ['Spoiled the ending - of his card', 'Mr. Stark, I don\'t feel so good...', 'Spider-sense: offline', 'Hey guys, you ever see that really old movie? This card.'],
  zendaya: ['MJ forgot about him anyway', 'Euphoria: over', 'Dune? Done.', 'Even the multiverse can\'t fix this card'],
  tobeymaguire: ['With great power comes great [rubble|responsibility]', 'Bully Maguire: bullied', 'Pizza time!'],
  andrewgarfield: ['Amazingly gone', 'The Amazing Spider-[Man|Wreck]'],
  willemdafoe: ['Goblin\'d', 'You know, I\'m something of a [shooter|scientist] myself', 'Light-house? Lights out.'],
  jacknicholson: ['Here\'s [Johnny|nothing]!', 'You can\'t handle the [truth|rubble]!', 'Ever dance with the devil in the pale [moonlight|muzzle flash]?'],
  anthonyhopkins: ['Had him for dinner. With fava beans.', 'Hello, Clarice. Goodbye, card.', 'The lambs have stopped screaming'],
  sigourneyweaver: ['Nuked from orbit. Only way to be sure.', 'Get away from her, you [card|poster]!', 'In space, no one hears you [scream|shoot]'],
  lindahamilton: ['No fate but what you [make|shoot]', 'Sarah Connor? Sarah Gone-or'],
  michaeljfox: ['Great Scott!', 'Where we\'re going we don\'t need [roads|cards]', 'Back to the [future|rubble]'],
  christopherlloyd: ['1.21 gigawatts of lead!', 'Great Scott! The card!'],
  markhamill: ['No... that\'s not true! That\'s impossible!', 'Use the Force, [Luke|{hero}]'],
  ewanmcgregor: ['Hello there. Goodbye there.', 'You were the chosen [one|card]!', 'I have the high ground!'],
  danielradcliffe: ['Expelliarmus!', 'Avada Ka-boom-ra', 'Yer a [wizard|wreck], Harry'],
  emmawatson: ['It\'s Levi-O-sa, not Destroy-a', 'Ten points from {hero}'],
  rupertgrint: ['Bloody hell!', 'Why spiders? Why bullets?'],
  elijahwood: ['One does not simply keep this card', 'My precious... [card|poster]'],
  ianmckellen: ['You shall not pass! ...it passed', 'Fly, you fools!', 'A wizard is never late. This card was.'],
  viggomortensen: ['Not this day? This day.', 'For Frodo! ...and for {hero}'],
  orlandobloom: ['Elf on the shelf. Shelf gone.', 'They\'re taking the [hobbits|cards] to Isengard!'],
  johnnydepp: ['Why is the [rum|card] gone?', 'You will always remember this as the day you almost shot Captain Jack Sparrow', 'Savvy? Shattered.'],
  margotrobbie: ['Barbie\'s dream house: demolished', 'Harley quit'],
  joaquinphoenix: ['We live in a society... of debris', 'Are you not entertained?!', 'Put on a happy [face|hole]'],
  russellcrowe: ['Are you not entertained?!', 'My name is Maximus... card destroyed', 'Strength and [honor|holes]'],
  christianbale: ['Swear to me! ...SWEAR TO ME!', 'I\'m Batman. Was.', 'Let\'s see Paul Allen\'s card...', 'Where is the [detonator|card]?!'],
  benaffleck: ['Sad Affleck, sadder card', 'Bat-fleck? Bat-wreck.', 'Armageddon? Arma-done.', 'Drill, baby, drill'],
  henrycavill: ['Kneel before {hero}', 'Toss a coin to your [Witcher|wrecker]', 'Man of Steel, card of paper'],
  galgadot: ['Wonder where it went', 'Lasso of truth: it\'s gone'],
  jasonmomoa: ['My man! ...my card', 'Aqua-man? Aqua-mess.', 'Winter is coming. So is {weapon}.'],
  clinteastwood: ['Do you feel lucky? It didn\'t.', 'Go ahead, make my [day|crater]', 'The Good, the Bad and the [Debris|Shredded]'],
  mattdamon: ['Bourne again? No.', 'Saving Private [Ryan|nobody]', 'Had to science the #@!% out of this'],
  danielcraig: ['Shaken, not stirred. Shattered.', 'Bond. James Bond. Gone.', 'Knives out. Bullets in.'],
  piercebrosnan: ['GoldenEye? Closed eye.', 'Tomorrow never [dies|came]'],
  kurtrussell: ['Snake? Snake?! SNAAAKE!', 'Escape from [New York|nothing]', 'It\'s all in the reflexes'],
  billmurray: ['Who you gonna call? Nobody.', 'Same card, every day. Not anymore.'],
  danaykroyd: ['Who you gonna call? Not him.', 'We came, we saw, we kicked its #@!%'],
  jimcarrey: ['Alrighty then!', 'Somebody stop me!', 'Smokin\'!', 'In case I don\'t see ya: good afternoon, good evening and goodnight'],
  morganfreeman: ['Narrator: it did not survive.', 'Get busy living, or get busy [dying|shooting]', 'What\'s in the [box|card]?!'],
  bradpitt: ['What\'s in the box?!', 'First rule: you do not talk about this card', 'Inglourious [Basterds|debris]'],
  edwardnorton: ['First rule of Fight Club: you do not [talk|shoot]... oops', 'I am Jack\'s complete lack of [poster|surprise]'],
  tomhanks: ['Life is like a box of [debris|chocolates]', 'Houston, we have a [problem|hole]', 'WILSON!', 'Run, [Forrest|card], run!'],
  tomhardy: ['Witness me!', 'You merely adopted the [dark|rubble]', 'Nobody cared who I was until I put on the [mask|crater]'],
  charlizetheron: ['Witness this!', 'Furiosa? Furi-gone.'],
  milajovovich: ['Multipass! Declined.', 'Leeloo Dallas, [multipass|multi-hole]'],
  millajovovich: ['Multipass! Declined.', 'Leeloo Dallas, [multipass|multi-hole]', 'My name is Alice', 'Umbrella Corporation? Umbrella closed.'],
  angelinajolie: ['Tomb raided', 'Mr. & Mrs. Smith, Mrs. Shot'],
  umathurman: ['Kill Bill. Kill card.', 'Revenge is a dish best served [cold|with {weapon}]', 'Don\'t be a... [square|card]', 'That\'s a five-dollar shake'],
  jeffbridges: ['The Dude does not abide', 'That card really tied the room together', 'Careful, man, there\'s a [beverage|bullet] here!'],
  johngoodman: ['Mark it zero!', 'Over the line! Shot.', 'This is what happens when you [find a stranger in the alps|shoot a card]!'],
  brucecampbell: ['Groovy.', 'Hail to the [king|rubble], baby', 'Shop smart. Shop S-Mart.'],
  jamieleecurtis: ['Halloween is over', 'The Final Girl? Final card.'],
  robertenglund: ['Nightmare over', 'One, two, {hero}\'s coming for you'],
  dannyglover: ['I\'m getting too old for this #@!%', 'Too old for this card'],
  rutgerhauer: ['All those moments will be lost in time, like tears in [rain|rubble]'],
  harrisonfordbladerunner: ['Like tears in rain'],
  alpacino: ['Say hello to my little [friend|{weapon}]!', 'Just when I thought I was out... they pull me back in!', 'Hoo-ah!'],
  robertdeniro: ['You talkin\' to me? YOU TALKIN\' TO ME?', 'Forget about it'],
  joepesci: ['Funny how? Funny like a clown?', 'Kevin! ...the card is gone'],
  macaulayculkin: ['Keep the change, ya filthy [animal|card]', 'AAAAHHHH!'],
  gerardbutler: ['THIS! IS! [SPARTA|RUBBLE]!', 'Tonight we dine in [hell|holes]!'],
  kevinbacon: ['Six degrees of destruction', 'Footloose. Card loose.'],
  sigourneyweaverghost: ['There is no Dana, only {weapon}'],
  emmastone: ['La La Land? Ka Ka Boom.'],
  ryangosling: ['Hey girl, I shot your card', 'Literally me. Literally gone.', 'I\'m just Ken. Kenough.'],
  cillianmurphy: ['By order of the Peaky [Blinders|Shooters]', 'Now I am become [death|debris]'],
  oscarisaac: ['Moon Knight? Moon fright.', 'Poe-ff. Gone.'],
  pedropascal: ['This is the way... to the bin', 'Mando? Man-done.'],
  scarlettjohansson: ['Black Widow, white flag', 'Her? Gone.'],
  tildaswinton: ['The Ancient One saw this coming'],
  benedictcumberbatch: ['Dormammu, I\'ve come to [bargain|shoot]', 'Elementary: it\'s gone', 'We\'re in the endgame now'],
  stanlee: ['Excelsior! (cameo destroyed)'],
  jimparsons: ['Bazinga!', 'That\'s my spot. Was.', 'Knock knock knock, [card|poster]. Knock knock knock, [card|poster]. Gone.', 'Rock, paper, scissors, lizard, [Spock|shotgun]', 'I\'m not crazy, my mother had me tested'],
  kaleycuoco: ['Holy crap on a cracker!', 'Cheesecake Factory is closed', 'Sweetie, it\'s gone'],
  simonhelberg: ['I went to space. This card did not.', 'NASA engineer, not your engineer'],
  charliesheen: ['Winning!', 'Duh. Winning.', 'Tiger blood!', 'Two and a half [cards|posters] left'],
  joncryer: ['Charlie, help!', 'The half man strikes back', 'Can I stay? No? Okay.'],
  mattleblanc: ['How you doin\'?', 'Joey doesn\'t share [food|cards]!', 'It\'s a moo point'],
  davidschwimmer: ['PIVOT! PIVOT! PIVOT!', 'We were on a break!', 'Unagi'],
  neilpatrickharris: ['Suit up!', 'Legen... wait for it... DARY!', 'Challenge accepted!', 'True story'],
  dancastellaneta: ['D\'oh!', 'Mmm... [rubble|debris]', 'Woohoo!', 'Why you little...!'],
  nancycartwright: ['Eat my shorts!', 'Ay, caramba!', 'Don\'t have a cow, man', 'I didn\'t do it'],
  sethmacfarlane: ['Freakin\' sweet!', 'Roadhouse!', 'Hehehehe'],
  treyparker: ['Respect my authoritah!', 'Screw you guys, I\'m going home', 'Oh my God, they killed [the card|Kenny]!'],
  johndimaggio: ['Bite my shiny metal [card|poster]!', 'I\'m gonna build my own website', 'Kill all humans... and posters'],
  kevinjames: ['IPS delivery: shredded', 'Doug wants a snack', 'King of [Queens|rubble]'],
  edoneill: ['Four touchdowns in one game!', 'Polk High forever', 'Hand in the waistband'],
  bryancranston: ['I am the one who [knocks|shoots]', 'Say my name', 'Malcolm? Not in the middle anymore'],
  zachbraff: ['Eagle!', 'Daydream: [destruction|rubble]', 'Guy love'],
  rainnwilson: ['False.', 'Bears. Beets. Battlestar Galactica.', 'Identity theft is not a joke!'],
  andysamberg: ['Cool cool cool cool cool. No doubt no doubt.', 'Noice!'],
  rowanatkinson: ['Teddy!', '...', 'Mr. Bean was here'],
  kiefersutherland: ['DAMN IT!', 'We are running out of time!', 'Tell me where the card is!'],
  wentworthmiller: ['The plan is on my skin', 'I\'m breaking out', 'Fox River? Fox gone.'],
  michaelchall: ['Tonight\'s the night', 'Dark passenger approves', 'Blood never lies. Cards do.'],
  travisfimmel: ['Don\'t waste your time looking back', 'Valhalla awaits', 'Who wants to be king?'],
  lvaromorte: ['Bella ciao!', 'Let the heist begin', 'Plan Paris'],
  leejungjae: ['Red light!', 'Green light!', 'Player 456 eliminated a card'],
  jennaortega: ['I don\'t smile', 'Woe is me. Woe is it.', 'Thing, fetch!'],
  bobodenkirk: ['Better call Saul!', 'S\'all good, man!', 'Objection!'],
  hughlaurie: ['Everybody lies', 'It\'s never lupus', 'Diagnosis: destroyed'],
  davidtennant: ['Allons-y!', 'Wibbly wobbly, timey wimey', 'I don\'t want to go!'],
  davidduchovny: ['The truth is out there', 'I want to believe', 'Trust no one'],
  davidhasselhoff: ['Don\'t hassle the Hoff!', 'Looking for freedom', 'Slow-motion run!'],
  tomkenny: ['I\'m ready!', 'Is mayonnaise an instrument?', 'Barnacles!'],
  katebeckinsale: ['Vampires 1, posters 0', 'Underworld? Under rubble.', 'Lycans hate this card'],
  georgeclooney: ['Santa Mira, here we come', 'Last call at the bar', 'Ocean\'s Eleven minus one'],
  quentintarantino: ['Bloody. Very bloody.', 'Chapter Two: the card'],
  johntravolta: ['Royale with cheese', 'Twist contest: won', 'Oops, I shot the card'],
  samworthington: ['I see you', 'Unobtainium? Un-destroyable? No.', 'Toruk Makto was here'],
  zoesaldaa: ['I see you', 'Most dangerous woman in the galaxy', 'Neytiri approves'],
  stephenlang: ['You are not in Kansas anymore', 'Get some!'],
  chrispratt: ['I am Star-Lord, man', 'Awesome Mix, Vol. 1', 'Dance-off, bro!'],
  bradleycooper: ['I need that guy\'s leg', 'Ain\'t no thing like me, except me!'],
  davebautista: ['Nothing goes over my head', 'Invisible. Very still.'],
  ralphfiennes: ['Avada Kedavra!', 'He-Who-Must-Not-Be-Named did this'],
  frankoz: ['Do or do not, there is no try', 'Destroyed, this card is', 'Judge me by my size, do you?'],
  raypark: ['At last we will reveal ourselves', 'Double the blade, double the damage'],
  adamdriver: ['MORE!', 'Let the past die. Kill it if you have to.'],
  daisyridley: ['I\'m no one', 'Scavenger, salvaged'],
  laurencefishburne: ['What if I told you... it\'s gone', 'Red pill or blue pill?', 'He is the One. You are not.'],
  willsmith: ['Bad boys, bad boys...', 'Welcome to Earth!', 'Aw hell no', 'Gettin\' jiggy with it'],
  martinlawrence: ['Woosah...', 'Bad boys for life', 'Aw, man!'],
  eddiemurphy: ['Banana in the tailpipe', 'Axel Foley, Detroit PD'],
  aaronpaul: ['Yeah, science!', 'Yeah, magnets!', 'Yo, yo, yo!'],
  emiliaclarke: ['Dracarys', 'Mother of Dragons, destroyer of cards'],
  maisiewilliams: ['Not today', 'Stick \'em with the pointy end', 'A girl has no card'],
  peterdinklage: ['I drink and I know things', 'A Lannister always pays his debts'],
  normanreedus: ['Crossbow: reloaded', 'Daryl doesn\'t talk much'],
  jeffreydeanmorgan: ['Eeny, meeny, miny, moe...', 'Lucille is thirsty'],
  danaigurira: ['Michonne. Katana. Done.', 'Wakanda forever'],
  davidharbour: ['Mornings are for coffee and contemplation', 'Hopper out'],
  joekeery: ['The hair? Farrah Fawcett spray', 'Steve the babysitter'],
  gilliananderson: ['There\'s a rational explanation', 'Mulder, it\'s me', 'Trust no card'],
  anadearmas: ['Ballerina from the world of John Wick', 'Pirouette. Bang.', 'Fire fights fire'],
  patrickstewart: ['Make it so', 'Engage!', 'Tea. Earl Grey. Hot.', 'The line must be drawn HERE!'],
  paulfusco: ['HA! I kill me!', 'Ah, what the heck', 'No problem!'],
  mikemyers: ['Yeah, baby, yeah!', 'Groovy, baby!', 'Oh, behave!', 'One million [cards|dollars]!', 'Shagadelic!'],
  terencehill: ['Trinity is still my name', 'Faster than his shadow', 'They call me Trinity', 'Beans first, fists later'],
};

function QUIP_LINES(rule, weightedRule) {
  weightedRule(0.4, 'type:title', '[Bye bye|So long|Farewell], {title}', '{title}? [Not anymore|Never heard of it|Gone]', '{title}: [destroyed|shredded|wrecked|deleted]', 'No more {title}', '{title} has left the [building|library]', 'Watched it. Shot it.', '{weapon} review: {title}', '{title}: [zero stars|one star|minus three stars]', 'Not a fan of {title}', 'Remake that, {title}', '{title}: [director\'s|bullet] cut', 'Shelf space freed');
  weightedRule(0.4, 'type:movie', 'Saved you {minutes} minutes', 'That\'s {minutes} minutes you\'ll never get back', 'Already seen it. Didn\'t like it.', 'Movie night: cancelled', 'Popcorn wasted', 'The [projector|cinema] is down', 'Not on my watchlist', 'Fast-forwarded to the end');

  weightedRule(3, 'quote', '"{quote}" - not anymore', 'Famous last words: "{quote}"', '"{quote}" *BANG*', '"{quote}" ...said nobody, ever again', 'Quote of the day: "{quote}" Day over.', '"{quote}" - {hero}, probably', 'Remember "{quote}"? Forget it.');
  weightedRule(3, 'quote:short', '"{quote}" ...famous last words', '{title}: "{quote}" - {weapon}: *BANG*', '"{quote}" Not today.', 'They said "{quote}". {hero} said {weapon}.');
  weightedRule(3, 'top250', 'IMDb Top 250: no more', 'Rank #{rank}? Unranked now', '#{rank} of 250. Now 249.', 'Number {rank} with a bullet', 'Top 250 just got a vacancy', 'IMDb {imdb}? {hero} rates it 0', 'Masterpiece #{rank}: in pieces', 'Rated {imdb} by millions. Shot by one.');
  weightedRule(3, 'top10', 'Top 10? Top gone.', 'IMDb #{rank} - and {hero} did not care', 'One of the greatest films ever. Was.', 'The critics will never forgive this');

  weightedRule(2, 'sequel', 'Hates sequels', 'Sequel? Squelched.', 'The first one was better', 'Part {partn}? Not on my watch', '{part} time\'s the charm? No.', 'Nobody asked for part {partn}', 'Sequelitis: cured', 'Another one? [Gone|Shot|Nope]', 'Straight to the bargain bin', 'Franchise fatigue', 'Return of the {title}? Return to sender.');
  weightedRule(2, 'sequel & coll', 'Part {partn} of {total}: cancelled', '{total} films. Now {total} minus one.', 'Breaking the {franchise} marathon at part {partn}', 'Binge-watch interrupted at part {partn}');
  rule('first & coll', 'Killed the franchise at birth', 'No sequels for you', 'Part one: also the last', 'Origin story: ended', 'Where it all began. And ended.', 'Prevented {total} sequels');
  rule('latest & coll', 'The latest one? Already outdated.', 'Shot the newest. {total} to go.');
  rule('prequel', 'Prequel? Pre-destroyed.', 'We know how it ends anyway', 'Origin story nobody needed', 'Before it all began: gone');
  rule('remake', 'Remake of a remake: unmade', 'The original was better', 'Remade. Unmade.', 'Hollywood ran out of ideas, {hero} ran out of patience');
  rule('reboot', 'Rebooted? Shut down.', 'Have you tried turning it off and on again?', 'Reboot failed: blue screen of death');
  rule('spinoff', 'Spin-off? Spun out.', 'Nobody needed that spin-off');
  rule('rel:coll & rel:later', 'Shot the sequel of the film you\'re on', 'Spoiler: the next part is gone', 'Now you\'ll never know how it continues', 'To be continued... not');
  rule('rel:coll & rel:earlier', 'Shot the film before this one', 'Prequel? Pre-destroyed.', 'Rewrote the backstory', 'Now this one makes no sense');
  rule('rel:actor', '{shared} is in this one too. Was.', 'Sorry, {shared}', '{shared} just lost a credit', 'Six degrees of {shared}');
  rule('rel:director', '{director} won\'t like this', 'Same director, same fate');
  rule('rel:self', 'Destroyed the film you were looking at', 'Shot the very thing you came for', 'Self-review: 0/10', 'Watching it? Not anymore.');

  weightedRule(1.5, 'franchise', 'Does not like {franchise} movies', '{franchise}? [Not a fan|Overrated|Next!]', 'Team anti-{franchise}', 'One less {franchise} movie', '{franchise} fans are crying now', '{franchise} universe: shrinking', 'Cancelled the {franchise} marathon');
  rule('fr:marvel', 'Does not like Marvel movies', 'Snapped out of existence', 'No post-credits scene for you', 'Avengers... disassemble!', 'Phase {partn}? Phase out.', 'Marvel fatigue: cured', 'I am inevitable. So is {weapon}.', 'Wakanda forever? Wakanda never.', 'Multiverse of Rubble', 'Endgame.', 'Kevin Feige felt that');
  rule('fr:dc', 'Does not like DC movies', 'Darkest. Grittiest. Gone.', 'Snyder cut it', 'Why so serious?', 'Martha!', 'Justice League? Justice leak.', 'DC: Destroyed Cinema');
  rule('fr:starwars', 'These aren\'t the posters you\'re looking for', 'Should have used the Force', 'It\'s a trap!', 'I felt a great disturbance in the Force', 'Order 66: executed', 'A long time ago, in a library far, far away', 'Pew pew!', 'Lucas would have added CGI to this explosion');
  rule('fr:startrek', 'He\'s dead, Jim', 'Beamed into pieces', 'Resistance is futile', 'Set phasers to [stun|destroy]', 'Live long and... no', 'Shields down!', 'Red shirt down');
  rule('fr:jamesbond', 'Shaken, not stirred. Shattered.', 'Licence to kill: used', 'Bond. James Bond. Gone.', 'No time to [die|watch]', 'The world is not enough. Neither is this card.', 'From Russia with lead', 'You only live twice. Posters once.');
  rule('fr:harrypotter', 'Expelliarmus!', 'Avada Ka-boom-ra', 'Ten points from Gryffindor', 'Mischief managed', 'You\'re a wreck, Harry', 'Obliviated', 'The poster who lived? No.');
  rule('fr:thelordoftherings', 'One does not simply keep this poster', 'You shall not pass!', 'My precious... gone', 'Fly, you fools!', 'They\'re taking the hobbits to the bin', 'The extended edition: shortened');
  rule('fr:thelordoftheringsthehobbit', 'There and back again? Just there.', 'One does not simply keep this poster');
  rule('fr:fastfurious', 'Family. Destroyed.', 'Quarter mile at a time - gone in one', 'NOS? No.', 'Fast & Furious? Fast & Finished.', 'Not even family could save it', 'Space car can\'t save you');
  rule('fr:missionimpossible', 'This poster will self-destruct in five seconds', 'Mission: accomplished', 'Should you choose to accept it... too late', 'Disavowed.');
  rule('fr:jurassicpark', 'Life finds a way. Not today.', 'Clever girl.', 'Spared no expense. Spared no poster.', 'Objects in mirror are closer than they appear', 'Extinct. Again.');
  rule('fr:transformers', 'Roll out! In pieces.', 'Transformed into rubble', 'More than meets the eye: holes', 'Michael Bay would add more explosions');
  rule('fr:pixar', 'To infinity and the bin', 'You\'ve got a friend in... no', 'Just keep shooting', 'Pixar lamp: squashed');
  rule('fr:disney', 'Let it go!', 'Hakuna matata: no worries, no poster', 'The happiest place on earth: rubble', 'The Mouse will sue');
  rule('fr:studioghibli', 'Spirited away', 'No-Face, no poster', 'Totoro is sad now');
  rule('fr:alien', 'In space, no one can hear you shoot', 'Game over, man! Game over!', 'Nuked from orbit. Only way to be sure.', 'Get away from her, you [card|poster]!', 'Facehugged.', 'Chestburst.');
  rule('fr:predator', 'Get to the choppa!', 'If it bleeds, we can kill it', 'Ain\'t got time to bleed', 'Ugly motherf- card', 'Invisible now. Literally.');
  rule('fr:alienvspredator', 'Whoever wins, we lose', 'Alien vs. Predator vs. {hero}');
  rule('fr:terminator', 'Hasta la vista, poster', 'I\'ll be back. It won\'t.', 'Judgment Day came early', 'Skynet is down', 'No fate but what you shoot', 'Terminated.');
  rule('fr:robocop', 'Dead or alive, you\'re destroyed', 'I\'d buy that for a dollar!', 'Your move, creep', 'Prime directive: delete');
  rule('fr:rambo', 'They drew first blood', 'Nothing is over! ...it is now', 'Live for nothing, die for nothing', 'Rambo would\'ve used a bow');
  rule('fr:rocky', 'Ding ding! Knocked out.', 'Yo, Adrian!', 'Eye of the [tiger|rocket]', 'Down for the count');
  rule('fr:diehard', 'Yippee-ki-yay', 'Welcome to the party, pal', 'Die Hard? Died easy.', 'Now I have a machine gun. Ho-ho-ho.', 'Is it a Christmas movie? Not anymore.');
  rule('fr:johnwick', 'Not the dog! (he will come for you)', 'Excommunicado.', 'Consider this a gold coin', 'Yeah, I\'m thinking he\'s back. Too late.', 'Dog-friendly destruction');
  rule('fr:thematrix', 'There is no poster', 'Red pill. Blue pill. {weapon}.', 'Whoa.', 'Déjà vu - a glitch in the Matrix', 'Dodge this.', 'Free your mind. And your shelf.');
  rule('fr:madmax', 'Witness me!', 'Shiny and chrome... and gone', 'Fury Road? Fury rubble.', 'Valhalla awaits');
  rule('fr:indianajones', 'It belongs in a museum!', 'Snakes. Why did it have to be snakes?', 'X never marks the spot', 'Fortune and glory, kid. Gone.', 'Choose wisely. You didn\'t.');
  rule('fr:backtothefuture', 'Great Scott!', 'Where we\'re going, we don\'t need posters', '1.21 gigawatts!', 'This is heavy', 'Erased from the timeline');
  rule('fr:piratesofthecaribbean', 'Why is the rum gone?', 'Savvy?', 'Davy Jones\' locker: full', 'Not all treasure is silver and gold. This was rubble.');
  rule('fr:thehungergames', 'May the odds be ever in your... no', 'Tribute down', 'Mockingjay? Mocking-gone.');
  rule('fr:twilight', 'Sparkled to death', 'Team Edward? Team {hero}.', 'Spider monkey down');
  rule('fr:monsterverse', 'Kaiju-sized hole', 'Godzilla stepped on it', 'King of the rubble');
  rule('fr:theconjuring', 'Exorcised.', 'Annabelle\'s shelf is empty', 'Based on a true destruction');
  rule('fr:anightmareonelmstreet', 'One, two, {hero}\'s coming for you', 'Wake up! It\'s gone.', 'Never sleep again? Sleep fine now.');
  rule('fr:fridaythe13th', 'Ki ki ki, ma ma ma', 'Camp Crystal Lake: closed', 'Jason has a new victim: his poster');
  rule('fr:halloween', 'Halloween is over', 'The Shape: shattered', 'Trick or treat? Trick.');
  rule('fr:scream', 'What\'s your favourite scary poster?', 'Don\'t answer the phone', 'Rules of horror: never shoot the poster');
  rule('fr:saw', 'Game over.', 'Let the game begin. And end.', 'Live or die. Make your choice. Died.', 'I want to play a game... with {weapon}');
  rule('fr:childsplay', 'Hi, I\'m Chucky, wanna play? No.', 'Friend till the end. The end.');
  rule('fr:hellraiser', 'We have such sights to show you. Holes, mostly.', 'Puzzle box: solved by force');
  rule('fr:thetexaschainsawmassacre', 'Chainsaw vs. {weapon}: {weapon} wins');
  rule('fr:evildead', 'Groovy.', 'Swallow this!', 'Shop smart.');
  rule('fr:ghostbusters', 'Who you gonna call? Nobody.', 'We came, we saw, we shot it', 'Don\'t cross the streams! Too late.', 'I ain\'t afraid of no poster');
  rule('fr:meninblack', 'Flash! You forgot this poster ever existed', 'Neuralyzed.', 'Here come the men in [black|rubble]');
  rule('fr:marvelxmen', 'Mutant down', 'Magneto pulled the bullets in', 'X gone');
  rule('fr:marvelxmen', 'Mutant down', 'Snikt. Gone.', 'Cerebro can\'t find it either');
  rule('fr:blade', 'Some motherf-s are always trying to ice-skate uphill', 'Daywalker? Day-wrecked.');
  rule('fr:bladerunner', 'Like tears in rain', 'Retired.', 'Replicant? Rubble-icant.', 'Enhance! ...nothing left');
  rule('fr:gladiator', 'Are you not entertained?!', 'Strength and honour. And holes.', 'Thumbs down.');
  rule('fr:300', 'THIS! IS! RUBBLE!', 'Tonight we dine in holes!', 'Our arrows will blot out the poster');
  rule('fr:theexpendables', 'Expended.', 'Too many action heroes, not enough posters');
  rule('fr:lethalweapon', 'I\'m getting too old for this', 'Diplomatic immunity: revoked');
  rule('fr:killbill', 'Kill Bill. Kill poster.', 'Revenge is a dish best served with {weapon}', 'Five point palm exploding poster technique');
  rule('fr:startrek & hero:rival', 'Star Wars fans shooting Star Trek. Classic.');
  rule('fr:thewalkingdead', 'Aim for the head', 'Walker down', 'Shouldn\'t have shot Glenn\'s poster');
  rule('fr:breakingbad', 'Say my name. Gone.', 'I am the one who [knocks|shoots]', 'Jesse, we need to shoot', 'Better call... nobody');
  rule('fr:gameofthrones', 'Winter came. Spring didn\'t.', 'Red Wedding: card edition', 'You know nothing, poster', 'Season 8 deserved this', 'Dracarys!');
  rule('fr:strangerthings', 'Upside down. Then down.', 'Eleven out of ten. Now zero.', 'Friends don\'t lie. Cards do.');
  rule('fr:theboys', 'Diabolical!', 'Homelander is not amused');
  rule('fr:themandalorian', 'This is the way... to the bin', 'I have spoken.', 'Baby Yoda is sad now');

  weightedRule(3, 'hero:ownfilm', 'Shot his own movie', '{hero} hates his own film', 'Self-sabotage!', 'The star shot the poster', '{hero} never liked that one', 'Career suicide', 'Royalties: gone', 'No sequel for {hero}');
  weightedRule(2, 'hero:ownfr & !hero:ownfilm', '{hero} vs. his own franchise', 'Friendly fire in the {franchise} universe', '{hero} wants to be the only {franchise} movie', 'Franchise civil war');
  weightedRule(3, 'hero:rival', '{herofr} vs. {rival}: 1-0', '{herofr} fan spotted', 'The {rival} vs. {herofr} war goes on', 'Typical {herofr} fan', '{rival}? Overrated. - {hero}', 'The rivalry continues');
  weightedRule(1.5, 'herofr & franchise & !hero:ownfr & !hero:rival', 'Crossover nobody asked for: {hero} vs. {franchise}', '{hero} invades the {franchise} universe', 'Multiverse incursion: {hero} in {franchise}');

  rule('kw:aftercreditsstinger', 'Missed the post-credits scene', 'Wait for the post-credits scene! ...never mind', 'Stay for the end credits? No.');
  rule('kw:duringcreditsstinger', 'Credits scene: cut', 'Nobody stays for the credits anyway');
  rule('kw:timetravel', 'Already destroyed it tomorrow', 'Grandfather paradox: solved', 'Time travel? Time to go.', 'It never existed. Timeline fixed.');
  rule('kw:zombie', 'Double tap!', 'Aim for the head', 'Rule #2: double tap');
  rule('kw:vampire', 'Stake? Bullet works too.', 'Garlic-free solution');
  rule('kw:dog', 'Hope the dog survived', 'Not the dog!', 'The dog was the best actor anyway');
  rule('kw:cat', 'Nine lives. This poster had one.');
  rule('kw:shark', 'Gonna need a bigger gun', 'Jumped the shark');
  rule('kw:dinosaur', 'Extinct. Again.', 'Meteor: {weapon}');
  rule('kw:alien', 'They came in peace. Left in pieces.', 'Close encounter of the {weapon} kind');
  rule('kw:alieninvasion', 'Independence Day: early', 'Welcome to Earth!');
  rule('kw:robot', 'Unplugged.', 'Battery: 0%');
  rule('kw:artificialintelligenceai', 'AI says: error 404 poster not found', 'The AI saw this coming', 'Ctrl+Alt+Destroyed');
  rule('kw:cyberpunk', 'Hacked. With bullets.', 'High tech, low poster');
  rule('kw:dystopia', 'Dystopia achieved', 'The future is rubble');
  rule('kw:postapocalypticfuture', 'Post-apocalyptic? Now it is.', 'The apocalypse came early');
  rule('kw:heist', 'Heist cancelled', 'Ocean\'s zero');
  rule('kw:hitman', 'Contract fulfilled', 'Hitman, hit.');
  rule('kw:assassin', 'Assassinated.', 'The assassin got assassinated');
  rule('kw:serialkiller', 'Caught. Permanently.', 'The killer got killed');
  rule('kw:slasher', 'Final girl: {hero}', 'Slashed. Then shot.');
  rule('kw:revenge', 'Revenge served cold', 'Revenge of the {hero}', 'Vengeance is mine');
  rule('kw:superhero', 'Not so super now', 'Superhero fatigue: cured', 'With great power comes great rubble', 'Cape? Escape.');
  rule('kw:basedoncomic', 'Read the comic instead', 'Back to panel one');
  rule('kw:basedonnovelorbook', 'The book was better', 'Read the book. Shot the movie.');
  rule('kw:basedonvideogame', 'Game over', 'Continue? 10... 9... 8...', 'Video game movies: still cursed');
  rule('kw:basedontruestory', 'Based on a true destruction', 'Historically inaccurate now');
  rule('kw:christmas', 'Christmas: cancelled', 'Grinch mode on', 'Ho-ho-hole');
  rule('kw:halloween', 'Trick or treat? Trick.');
  rule('kw:wedding', 'Objection!', 'The wedding is off');
  rule('kw:divorce', 'Divorced from the poster', 'Irreconcilable differences', 'Split. In pieces.');
  rule('kw:lovetriangle', 'Love triangle? Love rubble.', 'Nobody gets the girl');
  rule('kw:teenagelove', 'Teen love? Teen rubble.');
  rule('kw:romance', 'Love is dead', 'Broke up. In pieces.');
  rule('kw:friendship', 'Friendship ended with {title}');
  rule('kw:roadtrip', 'Road trip: cancelled');
  rule('kw:space', 'Lost in space', 'Houston, we have a hole');
  rule('kw:spacecraft', 'Ship down', 'Hull breach!');
  rule('kw:spaceopera', 'Space opera: final aria');
  rule('kw:martialarts', 'Kung fu? Gun fu.', 'Wax on, blown off');
  rule('kw:spy', 'Cover blown', 'Mission compromised', 'Spy vs. {weapon}');
  rule('kw:secretidentity', 'Secret identity: revealed. As rubble.');
  rule('kw:secretagent', 'Licence revoked', 'Agent down');
  rule('kw:mi6', 'MI6 will hear about this');
  rule('kw:police', 'Officer down. Poster down.');
  rule('kw:prison', 'Prison break. Literally.', 'Escaped. In pieces.');
  rule('kw:mafia', 'Sleeps with the fishes', 'An offer it couldn\'t refuse', 'Whacked.');
  rule('kw:newyorkcity', 'New York, New York: no more', 'Big Apple, little poster');
  rule('kw:losangelescalifornia', 'L.A. story: over');
  rule('kw:londonengland', 'Mind the gap!', 'Keep calm and shoot posters');
  rule('kw:magic', 'Abracadabra - gone', 'Now you see it, now you don\'t');
  rule('kw:wizard', 'Wizard? Wizzard.', 'Magic missile? Real missile.');
  rule('kw:witch', 'Ding dong, the poster\'s dead');
  rule('kw:ghost', 'Ghosted.', 'Busted.');
  rule('kw:dragon', 'Dragon slain', 'Dracarys!');
  rule('kw:mutant', 'Mutation: rubble');
  rule('kw:dreams', 'Wake up!', 'It was all a dream');
  rule('kw:mask', 'Unmasked.', 'Behind the mask: a hole');
  rule('kw:torture', 'Mercy kill');
  rule('kw:gore', 'Too gory. Now too holey.');
  rule('kw:showdown', 'Showdown won by {hero}');
  rule('kw:mostexpensivefilms', 'Millions of dollars - gone', 'Most expensive poster, cheapest bullet', 'Budget: {weapon}');
  rule('kw:musical', 'The music stopped', 'Last song');
  rule('kw:highschool', 'Graduated. Into pieces.', 'Detention.');

  rule('genre:horror', 'Too scary. Had to go.', 'Scared? Shoot it.', 'Jump scare: {hero}', 'Don\'t go in there! ...it did');
  rule('genre:comedy', 'Not funny', 'Laugh track: stopped', 'Who\'s laughing now?', 'Punchline: {weapon}');
  rule('genre:romance', 'Love is dead', 'Not in the mood', 'Romance? Bromance with {weapon}.');
  rule('genre:drama', 'Too much drama', 'Drama queen: dethroned', 'Oscar bait: eaten');
  rule('genre:documentary', 'Documented: destroyed', 'Facts don\'t matter now');
  rule('genre:animation', 'Cartoon physics don\'t apply', 'Frame by frame: gone');
  rule('genre:anime', 'Omae wa mou shindeiru', 'NANI?!', 'Plot armour: pierced');
  rule('genre:family', 'Family movie night: cancelled', 'Not suitable for {hero}');
  rule('genre:music', 'The music stopped');
  rule('genre:western', 'This town ain\'t big enough', 'Draw!', 'High noon. Low poster.');
  rule('genre:war', 'War is hell. So is {weapon}.', 'Friendly fire!');
  rule('genre:scifi', 'Science fiction. Science fact: holes.', 'Beam me up - in pieces');
  rule('genre:fantasy', 'Fantasy over. Reality: {weapon}.', 'No magic can fix this');
  rule('genre:thriller', 'Suspense: resolved', 'Thrilling. Then killed.');
  rule('genre:crime', 'Case closed', 'Guilty as charged');
  rule('genre:mystery', 'Mystery solved: {hero} did it', 'The butler did it. With {weapon}.');
  rule('genre:history', 'History rewritten');
  rule('genre:action', 'More action than the movie', 'Action! Cut!', 'Explosion budget: exceeded');
  rule('genre:adventure', 'Adventure over');
  rule('genre:biography', 'Biography? Obituary.');
  rule('genre:tvmovie', 'Made for TV, destroyed for fun');

  rule('rating:high', 'Overrated ({rating})', 'IMDb {rating}? Now 0.0', 'Masterpiece? Master-pieces.', 'Critics loved it. {hero} didn\'t.', 'Rated {rating}. Shot anyway.');
  rule('rating:low', 'Did everyone a favour', 'Only {rating}? Mercy kill.', 'Rotten. Now really rotten.', 'Rated {rating} for a reason', 'Bad movie, good riddance');
  rule('old', 'Too old for this', '{age} years old and still shot', 'Classic? Classic hole.', 'Back in the {decade} this would\'ve survived', 'Retro destroyed');
  rule('ancient', 'Older than your grandpa', 'Black and white and dead all over', 'Silent movie, loud bullet');
  rule('new', 'Fresh out of the cinema. Into the bin.', 'Brand new, brand gone', 'Not even on streaming yet');
  rule('long', '{minutes} minutes? Nobody has time for that', 'Too long, didn\'t watch', 'Intermission: forever', 'Director\'s cut: cut');
  rule('short', 'Short film? Shorter now.');
  rule('cert:adult', 'Rated R for Rubble', 'Adults only. Now nobody.');
  rule('cert:kids', 'Not for kids anymore', 'Rated G for Gone', 'Bedtime.');
  rule('book', 'The book was better', 'Read the book');
  rule('comic', 'Back to the comic shop', 'Comic relief: none');
  rule('game', 'Game over', 'Insert coin to continue');
  rule('truestory', 'Based on a true destruction', 'The real one was better');

  weightedRule(2, 'type:series & series:ended', 'Cancelled. Again.', '{title}: cancelled', 'Cancelled after {seasons} seasons', 'The finale nobody wanted', 'No revival for {title}', 'Ended. Then ended harder.', 'Series finale: {weapon}', 'Already cancelled. Double cancelled.');
  weightedRule(2, 'type:series & series:running', 'Cancelled after {seasons} seasons', 'Season {seasons} was the last', 'No renewal for {title}', 'The network called. It\'s over.', 'Cliffhanger forever', '{title}: on indefinite hiatus');
  rule('type:series & series:one', 'One season wonder', 'Cancelled after one season. Classic.', 'They never gave it a chance');
  rule('type:series & series:long', '{seasons} seasons? Nobody has time for that', 'Should have ended {seasons} seasons ago', 'Jumped the shark');
  rule('type:series', 'Binge over', 'Skip intro. Skip series.', 'Still watching? No.', 'Removed from Continue Watching', 'Unsubscribed', '{title}: previously on... nothing');
  rule('net:netflix', 'Netflix cancelled it first', 'Are you still watching? No.');
  rule('net:hbo', 'It\'s not TV. It\'s rubble.');
  rule('net:amazon', 'Returned to sender', 'Prime delivery: one bullet');
  rule('net:disney', 'The Mouse will sue');
  rule('net:apple', 'Think different. Think gone.');
  rule('net:bbc', 'Licence fee wasted');
  rule('net:fox', 'Fox cancelled it. Again.');
  rule('net:cbs', 'Rerun cancelled');
  rule('type:season', 'Season {n} cancelled', 'Skipped season {n}', 'Season {n}: the bad one', 'Nobody liked season {n}');
  rule('type:episode', 'Skipped S{s}E{e}', 'S{s}E{e}: the filler episode', 'Previously on {series}... nothing', 'Next episode in 5... 4... never', 'Episode {e}: the one where it got shot');
  rule('type:boxset', 'Collection incomplete', '{title}: scattered', 'Box set? Box upset.', 'Gotta catch them all? Lost them all.', '{n} films, one bullet');
  rule('type:library', '{title} closed', 'Library closed for renovation', '{title}: 0 items', 'Your server admin will hear about this', 'Rescan library? Nothing left.');

  weightedRule(0.6, 'type:person', 'Does not like {name}', '{weapon} for {name}', 'Bye bye {name}', '{name} is out', 'No more {name}', '{name} got cut', '{name}: recast!', '{name} was replaced by a cardboard cutout', '{name}\'s agent is calling', '{name}: career over', 'Cancelled: {name}', '{name}? Never heard of them', 'Autograph: shredded', '{name} left the set');
  rule('role', 'Bye bye {role}', '{role} got written out', '{role}: recast with {hero}', '{role} did not survive the first act', '{name} as {role}? Not anymore.', 'Rest in pieces, {role}');
  weightedRule(2, 'seriesstar', '{name} was written out', '{name} was written out of {page}', '{role} moved to a farm upstate', '{role} left for "creative differences"', 'Contract not renewed: {name}', '{name} won\'t be in season 2', 'Killed off: {role}', '{name}: written out, effective immediately');
  rule('lead', 'Shot the lead. Plot holes everywhere.', 'No star, no movie', '{name} was top billing. Was.');
  rule('iconic', '{iconic} would have dodged that', 'Even {iconic} can\'t help now', 'Not even {iconic} survives {weapon}', '{name}, a.k.a. {iconic}: down');
  rule('busy', '{name} is in {pn} of your films. Was.', '{pn} films with {name} - now with holes', '{name} was everywhere. Now nowhere.', 'Typecast as rubble');
  rule('rare', '{name}: one film, one bullet');
  rule('pfranchise', '{name}: {pfranchise} actor down', 'Even {pfranchise} can\'t save {name}', '{pfranchise} will recast {name}');
  rule('veteran', '{pa} years old, one bullet', 'Too old for this #@!%', 'Respect the elders? No.');
  rule('young', 'Career ended at {pa}', 'Child star? Not anymore.');
  rule('ptype:director', 'Director down. Who\'s calling "cut" now?', 'Director\'s cut: the director', 'And... cut!', '{name} won\'t direct again');
  rule('ptype:writer', 'Writer\'s block: permanent', 'Rewrite this, {name}', 'Plot hole: {name}');
  rule('ptype:producer', 'Budget cut: {name}', 'Producer down. No money left.');
  rule('ptype:composer', 'The music stopped', 'Composer down. Silence.');
  weightedRule(4, 'hero:self', 'Does not like himself', 'Self-hate!', 'Identity crisis', 'Bad day in the mirror', '{hero} vs. {name}', 'Shot himself. Kind of.', 'Self-destruct sequence initiated', '{name} would not approve');
  weightedRule(4, 'hero:selfrole', 'Killed his own role', 'Role reversal', 'Recast!', '{hero} wanted the part');
  rule('deceased', '{name}: a legend. The card, not so much.', 'The card is gone. {name} stays a legend.', 'Only the card. {name} is unforgettable.', 'Legends do not break. Cards do.', '{name} lives on in the films. Not in this card.', 'Respect to {name}. None to the card.');
  rule('deceased & role', '{role} lives on. The card does not.', 'Shot the card, not {role}');
}
