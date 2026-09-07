export type Resource = 'food' | 'industry' | 'science' | 'money';
export type Branch = 'industry' | 'transport' | 'food';
export type TileKind =
  | 'forest'
  | 'farm'
  | 'workshop'
  | 'school'
  | 'wetland'
  | 'mine'
  | 'ironworks'
  | 'mill';
export type Cost = Partial<Record<Resource, number>>;
export interface Card {
  id: string;
  name: string;
  branch: Branch;
  year: string;
  cost: number;
  special?: boolean;
  requires?: string;
  art: number;
  effect: string;
  history: string;
  source: string;
  build?: string;
}
const museum =
  'https://www.imeche.org/about-us/imeche-engineering-history/mechanical-engineering-history-timeline/1600-1799';
export const CARDS: Card[] = [
  {
    id: 'newcomen',
    name: 'Atmosfærisk dampmaskin',
    branch: 'industry',
    year: '1712 · Newcomen',
    cost: 3,
    art: 6,
    effect: 'Den første bemannede gruven hver runde gir +2 industri.',
    history:
      'Pumping av vann gjorde dypere gruvedrift mulig. Bonusen gjelder gruver, ikke tømmerhogst.',
    source: museum,
  },
  {
    id: 'coke',
    name: 'Koksfyrt masovn',
    branch: 'industry',
    year: '1709 · Darby',
    cost: 3,
    art: 2,
    build: 'ironworks',
    effect:
      'Bygg jernverk for 2 industri + 1 penge. Hver arbeider produserer 4 industri.',
    history: 'Koks som brensel bidro til å øke produksjonen av støpejern.',
    source: 'https://www.ironbridge.org.uk/our-story/the-iron-bridge/',
  },
  {
    id: 'jenny',
    name: 'Spinning Jenny',
    branch: 'industry',
    year: '1764 · Hargreaves',
    cost: 3,
    special: true,
    art: 5,
    effect:
      'Første arbeider i verksted eller tekstilmølle hver runde gir +1 industri.',
    history: 'Flere spindler lot én arbeider spinne flere tråder samtidig.',
    source: museum,
  },
  {
    id: 'waterframe',
    name: 'Vannkraftdrevet spinning',
    branch: 'industry',
    year: '1769 · Arkwright',
    cost: 4,
    art: 5,
    build: 'mill',
    effect:
      'Bygg tekstilmølle for 3 industri + 1 penge. To arbeiderplasser, 3 industri per arbeider.',
    history:
      'Vannkraft og maskiner samlet tekstilproduksjon i større fabrikker. Spinning Jenny er ikke et hardt krav.',
    source:
      'https://www.nationalarchives.gov.uk/education/resources/georgian-britain-age-modernity/arkwrights-spinning-frame/',
  },
  {
    id: 'watt',
    name: 'Separat kondensator',
    branch: 'industry',
    year: '1769 · Watt',
    cost: 4,
    requires: 'newcomen',
    special: true,
    art: 2,
    effect:
      'Første gruve eller jernverk hver runde gir +1 industri. Kan kombineres med Newcomen.',
    history:
      'En separat kondensator reduserte brenselbehovet i dampmaskinen. I denne økonomien representeres effektiviteten som større nyttig utbytte.',
    source:
      'https://blog.sciencemuseum.org.uk/james-watt-and-the-separate-condenser/',
  },
  {
    id: 'roads',
    name: 'Forbedrede landeveier',
    branch: 'transport',
    year: '1700-tallet · Veibygging',
    cost: 3,
    art: 3,
    build: 'road',
    effect:
      'Bygg vei for 1 industri + 2 penger. Åpne neste landrad. Kan bygges flere ganger.',
    history:
      'Bedre finansiert veivedlikehold og utbygging bandt lokale markeder sammen. Kortet representerer utbredelse, ikke oppfinnelsen av veien.',
    source:
      'https://www.parliament.uk/about/living-heritage/transformingsociety/transportcomms/roadsrail/overview/turnpikestolls/',
  },
  {
    id: 'canals',
    name: 'Kanalbygging',
    branch: 'transport',
    year: '1761 · Bridgewater',
    cost: 3,
    art: 3,
    build: 'canal',
    effect:
      'Bygg kanal for 3 industri + 1 penge. Åpne neste landrad og få +1 handel per runde.',
    history:
      'Kanaler muliggjorde transport av tunge varer. 1761 viser til Bridgewater-kanalen, ikke den første kanalen.',
    source:
      'https://historicengland.org.uk/images-books/publications/dlsg-transport-buildings/heag120-infrastructure-transport-lsg/',
  },
  {
    id: 'octant',
    name: 'Oktant',
    branch: 'transport',
    year: '1731 · Hadley',
    cost: 3,
    art: 7,
    effect: 'Øk handelskapasiteten med 2 per runde.',
    history:
      'Vinkelmåling mellom himmellegemer og horisont gjorde bestemmelse av breddegrad sikrere. Handel er en forenklet spillvirkning.',
    source: 'https://americanhistory.si.edu/collections/object/nmah_1106937',
  },
  {
    id: 'chronometer',
    name: 'Marint kronometer',
    branch: 'transport',
    year: '1759 · Harrison H4',
    cost: 4,
    special: true,
    art: 7,
    effect:
      'Handle 3 ressurser mot 2, i stedet for 2 mot 1. Kapasiteten regnes i mottatte enheter.',
    history:
      'Presis tid gjorde det mulig å bestemme lengdegrad på sjøen. Lavere handelsfriksjon er spillets abstraksjon.',
    source: 'https://www.rmg.co.uk/collections/objects/rmgc-object-79142',
  },
  {
    id: 'bridge',
    name: 'Støpejernsbro',
    branch: 'transport',
    year: '1779 · Iron Bridge',
    cost: 4,
    requires: 'coke',
    special: true,
    art: 3,
    build: 'bridge',
    effect:
      'Bygg én bro for 3 industri + 2 penger. Åpne neste rad og få +2 handel per runde.',
    history:
      'Iron Bridge viste at støpejern kunne brukes i store bærende brokonstruksjoner. Åpnet for trafikk i 1781.',
    source:
      'https://www.english-heritage.org.uk/visit/places/iron-bridge/history',
  },
  {
    id: 'drill',
    name: 'Såmaskin',
    branch: 'food',
    year: '1701 · Tull',
    cost: 3,
    art: 1,
    effect: 'Første arbeider på en åker hver runde gir +1 mat.',
    history:
      'Såing i ordnede rader ga bedre utnyttelse av frø og enklere etterarbeid.',
    source: 'https://www.reading.ac.uk/adlib/Details/collect/4446',
  },
  {
    id: 'rotation',
    name: 'Fireårig vekselbruk',
    branch: 'food',
    year: '1700-tallet · Norfolk',
    cost: 3,
    art: 1,
    effect:
      'Ved rundeslutt: to bemannede, sidetilstøtende åkre gir samlet +2 mat. Maks én gang.',
    history:
      'Veksling mellom korn, rotvekster og fôrvekster reduserte behovet for brakk. Utbredelse over tid, ikke én oppfinnelsesdato.',
    source: 'https://www.persee.fr/doc/hsr_1254-728x_1998_num_10_1_1067',
  },
  {
    id: 'breeding',
    name: 'Systematisk husdyravl',
    branch: 'food',
    year: '1700-tallet · Bakewell',
    cost: 4,
    special: true,
    art: 1,
    effect:
      'Har du bemannet en åker denne runden, reduseres matbehovet med 1 per 3 innbyggere.',
    history:
      'Målrettet avl utviklet husdyr med ønskede egenskaper. Matrabatten representerer økt utbytte.',
    source:
      'https://merl.reading.ac.uk/wp-content/uploads/sites/10/2020/02/B24244-MERL-LR-02-Breeding-WEB.pdf',
  },
  {
    id: 'thresher',
    name: 'Mekanisk treskeverk',
    branch: 'food',
    year: '1786 · Meikle',
    cost: 4,
    art: 1,
    effect:
      'Én åkerarbeider per runde aktiverer også én sidetilstøtende ledig åker: +3 mat, uten ekstra bonuser.',
    history:
      'Mekanisk tresking reduserte arbeidet med å skille korn fra strå. Tidlige maskiner kunne drives av hest, vind eller vann.',
    source:
      'https://www.nms.ac.uk/discover-catalogue/autumn-harvest-in-8-rural-snapshots',
  },
  {
    id: 'drainage',
    name: 'Systematisk jorddrenering',
    branch: 'food',
    year: '1700-tallet · Jordforbedring',
    cost: 3,
    art: 1,
    build: 'drain',
    effect:
      'Drener våtmark for 1 industri + 1 penge. Den blir en åker som gir 4 mat per arbeider.',
    history:
      'Drenering gjorde våte områder dyrkbare, men endret naturen varig. Kortet representerer utbredte jordforbedringer.',
    source:
      'https://historicengland.org.uk/images-books/publications/historic-farmsteads-preliminary-character-statement-east-midlands/historic-farmsteads-east-midlands-part2/',
  },
];
export const BRANCHES = {
  industry: 'Industri',
  transport: 'Transport',
  food: 'Mat',
};
export const RESOURCES = {
  food: 'Mat',
  industry: 'Industri',
  science: 'Forskning',
  money: 'Penger',
};
export const TILE_NAMES: Record<TileKind, string> = {
  forest: 'Skog',
  farm: 'Åker',
  workshop: 'Verksted',
  school: 'Lærested',
  wetland: 'Våtmark',
  mine: 'Gruve',
  ironworks: 'Jernverk',
  mill: 'Tekstilmølle',
};
export const TILE_ART: Record<TileKind, number> = {
  forest: 0,
  farm: 1,
  workshop: 5,
  school: 4,
  wetland: 0,
  mine: 6,
  ironworks: 2,
  mill: 5,
};
export interface Tile {
  kind: TileKind;
  workers: number;
  drained?: boolean;
  auto?: boolean;
}
export interface Player {
  name: string;
  population: number;
  resources: Record<Resource, number>;
  tiles: Tile[];
  techs: string[];
  rows: number;
  trade: number;
  tradeUsed: number;
  left: number;
  investments: number;
  passed: boolean;
  used: string[];
  buildings: string[];
  history: number;
  growth: boolean;
}
export interface Game {
  version: 1;
  round: number;
  phase: 'work' | 'invest' | 'finished';
  active: number;
  first: number;
  players: Player[];
  log: string[];
  seed: number;
  winner?: number[];
}
export const ROUND_YEARS = [1700, 1715, 1730, 1745, 1760, 1775, 1790, 1800];
export const BUILDINGS = [
  {
    id: 'farm',
    name: 'Dyrk åker',
    cost: { industry: 1, money: 1 },
    desc: 'Gjør skog til åker. En arbeider gir 3 mat.',
    tile: true,
  },
  {
    id: 'workshop',
    name: 'Bygg verksted',
    cost: { industry: 2, money: 1 },
    desc: 'Gjør skog til verksted. En arbeider gir 3 industri.',
    tile: true,
  },
  {
    id: 'mine',
    name: 'Åpne gruve',
    cost: { industry: 2, money: 1 },
    desc: 'Gjør skog til gruve. En arbeider gir 3 industri.',
    tile: true,
  },
  {
    id: 'school',
    name: 'Utvid lærestedet',
    cost: { industry: 2, money: 3 },
    desc: 'Én gang: Forskning gir 3 i stedet for 2.',
    tile: false,
  },
  {
    id: 'culture',
    name: 'Bygg bibliotek',
    cost: { industry: 3, money: 4 },
    desc: 'Én gang: 5 prestisjepoeng ved spillets slutt.',
    tile: false,
  },
  {
    id: 'ironworks',
    name: 'Bygg jernverk',
    cost: { industry: 2, money: 1 },
    desc: 'Oppgrader et verksted. Gir 4 industri per arbeider.',
    tile: true,
    requires: 'coke',
  },
  {
    id: 'mill',
    name: 'Bygg tekstilmølle',
    cost: { industry: 3, money: 1 },
    desc: 'Oppgrader verksted. To plasser med 3 industri hver.',
    tile: true,
    requires: 'waterframe',
  },
  {
    id: 'road',
    name: 'Bygg vei',
    cost: { industry: 1, money: 2 },
    desc: 'Åpner neste landrad.',
    tile: false,
    requires: 'roads',
  },
  {
    id: 'canal',
    name: 'Bygg kanal',
    cost: { industry: 3, money: 1 },
    desc: 'Åpner neste rad og gir +1 handelskapasitet.',
    tile: false,
    requires: 'canals',
  },
  {
    id: 'bridge',
    name: 'Bygg jernbro',
    cost: { industry: 3, money: 2 },
    desc: 'Én gang: åpner neste rad og gir +2 handelskapasitet.',
    tile: false,
    requires: 'bridge',
  },
  {
    id: 'drain',
    name: 'Drener våtmark',
    cost: { industry: 1, money: 1 },
    desc: 'Våtmark blir åker med 4 mat per arbeider.',
    tile: true,
    requires: 'drainage',
  },
];
export type Action =
  | { type: 'work'; tile?: number; job?: 'science' | 'money' }
  | { type: 'research'; id: string }
  | { type: 'build'; id: string; tile?: number }
  | { type: 'trade'; from: Resource; to: Resource }
  | { type: 'grow' }
  | { type: 'pass' };
export function createGame(names: string[], seed = 17): Game {
  if (names.length < 2 || names.length > 5) throw Error('Velg 2–5 spillere.');
  return {
    version: 1,
    round: 1,
    phase: 'work',
    active: 0,
    first: 0,
    seed,
    log: ['1700 · En ny tid begynner.'],
    players: names.map((name) => ({
      name: name.trim().slice(0, 24) || 'Land',
      population: 2,
      resources: { food: 4, industry: 3, science: 2, money: 4 },
      tiles: Array.from({ length: 16 }, (_, i) => ({
        kind:
          [
            {
              0: 'farm',
              1: 'workshop',
              2: 'forest',
              3: 'school',
              5: 'wetland',
              10: 'wetland',
            } as Record<number, TileKind>,
          ][0][i] || 'forest',
        workers: 0,
      })),
      techs: [],
      rows: 1,
      trade: 2,
      tradeUsed: 0,
      left: 2,
      investments: 2,
      passed: false,
      used: [],
      buildings: [],
      history: 0,
      growth: false,
    })),
  };
}
export function adjacent(a: number, b: number) {
  return (
    Math.abs(Math.floor(a / 4) - Math.floor(b / 4)) +
      Math.abs((a % 4) - (b % 4)) ===
    1
  );
}
export function afford(p: Player, c: Cost) {
  return Object.entries(c).every(
    ([k, v]) => p.resources[k as Resource] >= (v || 0),
  );
}
export function pay(p: Player, c: Cost) {
  if (!afford(p, c)) throw Error('Du har ikke nok ressurser.');
  for (const [k, v] of Object.entries(c)) p.resources[k as Resource] -= v || 0;
}
export function stock(g: Game, c: Card) {
  return (
    (c.special ? Math.ceil(g.players.length / 2) : g.players.length) -
    g.players.filter((p) => p.techs.includes(c.id)).length
  );
}
export function score(p: Player) {
  return (
    p.population * 2 +
    p.techs.length * 2 +
    (p.rows - 1) * 2 +
    p.buildings.filter((b) => b === 'culture').length * 5 +
    p.tiles.filter((t) => ['ironworks', 'mill'].includes(t.kind)).length * 2
  );
}
export function upkeep(p: Player) {
  return (
    p.population -
    (p.techs.includes('breeding') &&
    p.tiles.some((t) => t.kind === 'farm' && t.workers)
      ? Math.floor(p.population / 3)
      : 0)
  );
}
function once(p: Player, id: string) {
  if (p.used.includes(id)) return false;
  p.used.push(id);
  return true;
}
function next(g: Game, predicate: (p: Player) => boolean) {
  for (let n = 1; n <= g.players.length; n++) {
    const i = (g.active + n) % g.players.length;
    if (predicate(g.players[i])) {
      g.active = i;
      return;
    }
  }
}
function event(g: Game, text: string) {
  g.log.push(`R${g.round} · ${text}`);
}
export function buildReason(g: Game, id: string, tile?: number) {
  const p = g.players[g.active],
    b = BUILDINGS.find((x) => x.id === id);
  if (!b) return 'Ukjent bygg.';
  if (g.phase !== 'invest') return 'Bygg i investeringsfasen.';
  if (p.investments < 1) return 'Ingen investeringer igjen.';
  if (b.requires && !p.techs.includes(b.requires))
    return 'Krever ' + CARDS.find((c) => c.id === b.requires)?.name;
  if (['school', 'culture', 'bridge'].includes(id) && p.buildings.includes(id))
    return 'Allerede bygget.';
  if (['road', 'canal', 'bridge'].includes(id) && p.rows === 4)
    return 'Alle landrader er åpne.';
  if (!afford(p, b.cost)) return 'Ikke nok ressurser.';
  if (b.tile) {
    if (
      tile === undefined ||
      !Number.isInteger(tile) ||
      tile < 0 ||
      tile >= p.rows * 4
    )
      return 'Velg et tilgjengelig område.';
    const t = p.tiles[tile];
    if (t.workers || t.auto) return 'Velg et ubemannet område.';
    if (['ironworks', 'mill'].includes(id) && t.kind !== 'workshop')
      return 'Velg et verksted.';
    if (id === 'drain' && t.kind !== 'wetland') return 'Velg en våtmark.';
    if (['farm', 'workshop', 'mine'].includes(id) && t.kind !== 'forest')
      return 'Velg et skogområde.';
  }
  return '';
}
export function researchReason(g: Game, c: Card) {
  const p = g.players[g.active];
  if (g.phase !== 'invest') return 'Forsk i investeringsfasen.';
  if (p.investments < 1) return 'Ingen investeringer igjen.';
  if (p.techs.includes(c.id)) return 'Du kjenner denne teknologien.';
  if (!stock(g, c)) return 'Ingen eksemplarer igjen.';
  if (c.requires && !p.techs.includes(c.requires))
    return 'Krever ' + CARDS.find((x) => x.id === c.requires)?.name;
  if (p.resources.science < c.cost)
    return `Du mangler ${c.cost - p.resources.science} forskning.`;
  return '';
}
export function applyAction(original: Game, a: Action): Game {
  if (!a || typeof a !== 'object') throw Error('Ugyldig handling.');
  const g: Game = structuredClone(original);
  if (g.phase === 'finished') throw Error('Spillet er avsluttet.');
  const p = g.players[g.active];
  if (a.type === 'work') {
    if (g.phase !== 'work' || p.left < 1)
      throw Error('Du kan ikke plassere flere arbeidere nå.');
    let label = '',
      gain = 0,
      r: Resource = 'industry';
    if (a.job) {
      if (!['science', 'money'].includes(a.job)) throw Error('Ukjent arbeid.');
      r = a.job;
      gain = a.job === 'science' ? (p.buildings.includes('school') ? 3 : 2) : 2;
      label = a.job === 'science' ? 'forskning' : 'handelshuset';
    } else {
      if (
        a.tile === undefined ||
        !Number.isInteger(a.tile) ||
        a.tile < 0 ||
        a.tile >= p.rows * 4
      )
        throw Error('Området er ikke tilgjengelig.');
      const t = p.tiles[a.tile];
      if (t.workers >= (t.kind === 'mill' ? 2 : 1) || t.auto)
        throw Error('Området er allerede bemannet.');
      if (t.kind === 'wetland')
        throw Error('Våtmark må dreneres før den kan dyrkes.');
      t.workers++;
      label = TILE_NAMES[t.kind];
      if (t.kind === 'school') {
        r = 'science';
        gain = p.buildings.includes('school') ? 3 : 2;
      } else if (t.kind === 'farm') {
        r = 'food';
        gain = t.drained ? 4 : 3;
        if (p.techs.includes('drill') && once(p, 'drill')) gain++;
        if (p.techs.includes('thresher') && !p.used.includes('thresher')) {
          const ni = p.tiles.findIndex(
            (x, i) =>
              i < p.rows * 4 &&
              x.kind === 'farm' &&
              !x.workers &&
              !x.auto &&
              adjacent(i, a.tile!),
          );
          if (ni >= 0) {
            p.tiles[ni].auto = true;
            gain += 3;
            p.used.push('thresher');
          }
        }
      } else {
        gain = t.kind === 'forest' ? 2 : t.kind === 'ironworks' ? 4 : 3;
        if (
          t.kind === 'mine' &&
          p.techs.includes('newcomen') &&
          once(p, 'newcomen')
        )
          gain += 2;
        if (
          ['mill', 'workshop'].includes(t.kind) &&
          p.techs.includes('jenny') &&
          once(p, 'jenny')
        )
          gain++;
        if (
          ['mine', 'ironworks'].includes(t.kind) &&
          p.techs.includes('watt') &&
          once(p, 'watt')
        )
          gain++;
        if (t.kind !== 'forest') p.history += gain;
      }
    }
    p.resources[r] += gain;
    p.left--;
    event(g, `${p.name}: ${label}, +${gain} ${RESOURCES[r].toLowerCase()}.`);
    if (g.players.every((x) => x.left === 0)) {
      g.phase = 'invest';
      g.active = g.first;
      event(g, 'Arbeidet er ferdig. Hvert land har to investeringer.');
    } else next(g, (x) => x.left > 0);
  } else if (a.type === 'research') {
    const c = CARDS.find((x) => x.id === a.id);
    if (!c) throw Error('Ukjent teknologi.');
    const reason = researchReason(g, c);
    if (reason) throw Error(reason);
    pay(p, { science: c.cost });
    p.techs.push(c.id);
    p.investments--;
    if (c.id === 'octant') p.trade += 2;
    event(g, `${p.name} forsker frem ${c.name}.`);
  } else if (a.type === 'build') {
    const reason = buildReason(g, a.id, a.tile);
    if (reason) throw Error(reason);
    const b = BUILDINGS.find((x) => x.id === a.id)!;
    pay(p, b.cost);
    p.investments--;
    if (b.tile) {
      const t = p.tiles[a.tile!];
      t.kind = a.id === 'drain' ? 'farm' : (a.id as TileKind);
      if (a.id === 'drain') t.drained = true;
    } else {
      p.buildings.push(a.id);
      if (['road', 'canal', 'bridge'].includes(a.id)) p.rows++;
      if (a.id === 'canal') p.trade++;
      if (a.id === 'bridge') p.trade += 2;
    }
    event(g, `${p.name}: ${b.name.toLowerCase()}.`);
  } else if (a.type === 'trade') {
    if (g.phase !== 'invest') throw Error('Handle i investeringsfasen.');
    if (
      !['food', 'industry', 'money'].includes(a.from) ||
      !['food', 'industry', 'money'].includes(a.to) ||
      a.from === a.to
    )
      throw Error('Velg to forskjellige handelsressurser.');
    const improved = p.techs.includes('chronometer'),
      input = improved ? 3 : 2,
      output = improved ? 2 : 1;
    if (p.tradeUsed + output > p.trade)
      throw Error('Handelskapasiteten er brukt opp.');
    pay(p, { [a.from]: input });
    p.resources[a.to] += output;
    p.tradeUsed += output;
    event(
      g,
      `${p.name}: ${input} ${RESOURCES[a.from]} → ${output} ${RESOURCES[a.to]}.`,
    );
  } else if (a.type === 'grow') {
    if (g.phase !== 'invest' || p.investments < 1)
      throw Error('Vekst krever én investering.');
    if (p.growth || p.population >= 6)
      throw Error('Maks én vekst per runde og seks innbyggere.');
    pay(p, { food: 3, money: 1 });
    p.population++;
    p.growth = true;
    p.investments--;
    event(
      g,
      `${p.name} vokser til ${p.population} innbyggere. Ny arbeider fra neste runde.`,
    );
  } else if (a.type === 'pass') {
    if (g.phase !== 'invest') throw Error('Plasser arbeiderne dine først.');
    p.passed = true;
    event(g, `${p.name} avslutter investeringene.`);
    if (g.players.every((x) => x.passed)) {
      for (const x of g.players) {
        if (
          x.techs.includes('rotation') &&
          x.tiles.some(
            (t, i) =>
              t.kind === 'farm' &&
              t.workers > 0 &&
              x.tiles.some(
                (v, j) => v.kind === 'farm' && v.workers > 0 && adjacent(i, j),
              ),
          )
        ) {
          x.resources.food += 2;
          event(g, `${x.name}: vekselbruk gir +2 mat.`);
        }
        const need = upkeep(x),
          short = Math.max(0, need - x.resources.food);
        x.resources.food = Math.max(0, x.resources.food - need);
        if (short) {
          const lost = Math.min(short, x.population - 1);
          x.population -= lost;
          event(
            g,
            `${x.name} mangler ${short} mat og mister ${lost} innbyggere.`,
          );
        } else event(g, `${x.name} betaler ${need} mat.`);
      }
      if (g.round === 8) {
        g.phase = 'finished';
        const high = Math.max(...g.players.map(score));
        g.winner = g.players
          .map((x, i) => (score(x) === high ? i : -1))
          .filter((x) => x >= 0);
        event(g, '1800 · Oppfinnelsenes tid er over.');
      } else {
        g.round++;
        g.first = (g.first + 1) % g.players.length;
        g.active = g.first;
        g.phase = 'work';
        for (const x of g.players) {
          x.left = x.population;
          x.investments = 2;
          x.passed = false;
          x.tradeUsed = 0;
          x.used = [];
          x.growth = false;
          for (const t of x.tiles) {
            t.workers = 0;
            t.auto = false;
          }
        }
        event(g, `${ROUND_YEARS[g.round - 1]} · Ny runde.`);
      }
    } else next(g, (x) => !x.passed);
  } else throw Error('Ukjent handling.');
  return g;
}
export function parseSave(text: string): Game {
  if (text.length > 2000000) throw Error('Lagringsfilen er for stor.');
  let g: Game;
  try {
    g = JSON.parse(text);
  } catch {
    throw Error('Filen er ikke gyldig JSON.');
  }
  if (
    !g ||
    typeof g !== 'object' ||
    g.version !== 1 ||
    !Number.isInteger(g.round) ||
    g.round < 1 ||
    g.round > 8 ||
    !['work', 'invest', 'finished'].includes(g.phase) ||
    !Array.isArray(g.players) ||
    g.players.length < 2 ||
    g.players.length > 5 ||
    !Number.isInteger(g.active) ||
    g.active < 0 ||
    g.active >= g.players.length ||
    !Number.isInteger(g.first) ||
    g.first < 0 ||
    g.first >= g.players.length ||
    !Array.isArray(g.log) ||
    g.log.some((x) => typeof x !== 'string') ||
    g.log.length > 10000
  )
    throw Error('Ugyldig eller inkompatibel lagring.');
  for (const p of g.players) {
    if (
      !p ||
      typeof p !== 'object' ||
      typeof p.name !== 'string' ||
      p.name.length > 24 ||
      !Number.isInteger(p.population) ||
      p.population < 1 ||
      p.population > 6 ||
      !Number.isInteger(p.rows) ||
      p.rows < 1 ||
      p.rows > 4 ||
      !Array.isArray(p.tiles) ||
      p.tiles.length !== 16 ||
      p.tiles.some(
        (t) =>
          !t ||
          !Object.hasOwn(TILE_NAMES, t.kind) ||
          !Number.isInteger(t.workers) ||
          t.workers < 0 ||
          t.workers > (t.kind === 'mill' ? 2 : 1),
      ) ||
      !p.resources ||
      Object.keys(RESOURCES).some(
        (k) =>
          !Number.isInteger(p.resources[k as Resource]) ||
          p.resources[k as Resource] < 0 ||
          p.resources[k as Resource] > 100000,
      ) ||
      !Array.isArray(p.techs) ||
      p.techs.some((id) => !CARDS.some((c) => c.id === id)) ||
      new Set(p.techs).size !== p.techs.length ||
      !Array.isArray(p.used) ||
      !Array.isArray(p.buildings) ||
      p.buildings.some((id) => !BUILDINGS.some((b) => b.id === id)) ||
      ![p.left, p.investments, p.trade, p.tradeUsed, p.history].every(
        (n) => Number.isInteger(n) && n >= 0,
      ) ||
      p.left > 6 ||
      p.investments > 2 ||
      typeof p.passed !== 'boolean' ||
      typeof p.growth !== 'boolean'
    )
      throw Error('Ugyldige spillerdata.');
  }
  if (g.phase === 'finished') {
    const highest = Math.max(...g.players.map(score));
    g.winner = g.players
      .map((p, i) => (score(p) === highest ? i : -1))
      .filter((i) => i >= 0);
  } else {
    delete g.winner;
  }
  return g;
}
