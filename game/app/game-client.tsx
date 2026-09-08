'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import {
  Sprout,
  Factory,
  TreePine,
  Users,
  Coins,
  FlaskConical,
  ArrowRight,
  BookOpen,
  LockKeyhole,
  Check,
  Download,
  Upload,
  Undo2,
  Plus,
  Landmark,
  ArrowLeftRight,
  Flag,
  Leaf,
  Settings2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  CARDS,
  BRANCHES,
  RESOURCES,
  TILE_NAMES,
  TILE_ART,
  BUILDINGS,
  ROUND_YEARS,
  createGame,
  applyAction,
  foodStatus,
  availableTechnology,
  availableRound,
  TECHNOLOGY_ROUNDS,
  previewWork,
  type WorkPlacement,
  parseSave,
  score,
  upkeep,
  stock,
  researchReason,
  buildReason,
  afford,
  type Game,
  type Action,
  type Card,
  type Resource,
  type Cost,
} from '@/lib/game';
const SAVE = 'sustained-v1';
const NAMES = ['Fjordland', 'Vestmark', 'Solheim', 'Nordvik', 'Østervang'];
const ICONS = {
  food: Sprout,
  industry: Factory,
  science: FlaskConical,
  money: Coins,
};
const atlas = (n: number): CSSProperties => ({
  backgroundImage: 'url(art/atlas.png)',
  backgroundSize: '300% 300%',
  backgroundPosition: `${(n % 3) * 50}% ${Math.floor(n / 3) * 50}%`,
});
function CostLabel({ cost }: { cost: Cost }) {
  return (
    <span className="cost-label">
      {Object.entries(cost).map(([k, v]) => {
        const I = ICONS[k as Resource];
        return (
          <span key={k} title={RESOURCES[k as Resource]}>
            <I size={15} />
            {v}
          </span>
        );
      })}
    </span>
  );
}
export default function Home() {
  const [game, setGame] = useState<Game>(() => createGame(NAMES.slice(0, 3)));
  const [foodAmount, setFoodAmount] = useState(0);
  const [draft, setDraft] = useState<(WorkPlacement | null)[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [drag, setDrag] = useState<{
    index: number;
    x: number;
    y: number;
  } | null>(null);
  const gesture = useRef<{
    index: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [view, setView] = useState(0);
  const [selected, setSelected] = useState<number>();
  const [card, setCard] = useState<Card | null>(null);
  const [modal, setModal] = useState<
    'rules' | 'setup' | 'build' | 'trade' | 'log' | null
  >(null);
  const [branch, setBranch] = useState('all');
  const [owned, setOwned] = useState(false);
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(3);
  const [names, setNames] = useState(NAMES);
  const [from, setFrom] = useState<Resource>('money');
  const [to, setTo] = useState<Resource>('food');
  const [undo, setUndo] = useState<Game[]>([]);
  const [saveError, setSaveError] = useState(false);
  const upload = useRef<HTMLInputElement>(null);
  const ref = useRef(game);
  useEffect(() => {
    ref.current = game;
  }, [game]);
  // Local storage is an external system hydrated only after the static page mounts.
  /* oxlint-disable react/react-compiler -- Synchronize browser-only persistence after static hydration. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE);
      if (raw) {
        const loaded = parseSave(raw);
        setGame(loaded);
        setView(loaded.active);
        setStarted(true);
      }
    } catch {
      setMessage(
        'Den lagrede filen kunne ikke åpnes. Du kan starte et nytt spill.',
      );
    }
    setReady(true);
  }, []);
  /* oxlint-enable react/react-compiler */
  // Persist the game and report browser quota or storage errors.
  /* oxlint-disable react/react-compiler -- Report persistence errors to the player. */
  useEffect(() => {
    if (ready && started) {
      try {
        localStorage.setItem(SAVE, JSON.stringify(game));
        setSaveError(false);
      } catch {
        setSaveError(true);
      }
    }
  }, [game, ready, started]);
  /* oxlint-enable react/react-compiler */
  function act(a: Action) {
    try {
      const previous = ref.current;
      const next = applyAction(previous, a);
      setUndo((u) => [...u.slice(-29), previous]);
      ref.current = next;
      setGame(next);
      setFoodAmount(0);
      setDraft([]);
      setChosen(null);
      setView(next.active);
      setSelected(undefined);
      setMessage(next.log.slice(previous.log.length).join(' '));
      setStarted(true);
      return next;
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Handlingen kunne ikke utføres.';
      setMessage(msg);
      throw Error(msg);
    }
  }
  function play(a: Action) {
    try {
      act(a);
    } catch {
      /* visible error already set */
    }
  }
  useEffect(() => {
    const context = (
      document as unknown as {
        modelContext?: {
          registerTool: (tool: unknown, options: unknown) => void;
        };
      }
    ).modelContext;
    if (!context) return;
    const controller = new AbortController();
    try {
      context.registerTool(
        {
          name: 'read_game',
          description: 'Read the current public hotseat board game state.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true },
          execute: () => ref.current,
        },
        { signal: controller.signal },
      );
      context.registerTool(
        {
          name: 'play_game_action',
          description:
            'Perform one legal action in the current hotseat game. Uses the same rules as the board.',
          inputSchema: {
            type: 'object',
            properties: {
              type: {
                enum: [
                  'work',
                  'work_plan',
                  'research',
                  'build',
                  'trade',
                  'grow',
                  'pass',
                  'feed',
                  'resume_invest',
                ],
              },
              placements: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    tile: { type: 'integer' },
                    job: { enum: ['science', 'money'] },
                  },
                  additionalProperties: false,
                },
              },
              amount: { type: 'integer', minimum: 0 },
              id: { type: 'string' },
              tile: { type: 'integer' },
              job: { enum: ['science', 'money'] },
              from: { enum: ['food', 'industry', 'money'] },
              to: { enum: ['food', 'industry', 'money'] },
            },
            required: ['type'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false },
          execute: (input: Action) => {
            let result: Game | undefined;
            flushSync(() => {
              result = act(input);
            });
            return {
              round: result!.round,
              phase: result!.phase,
              active: result!.active,
              lastEvent: result!.log.at(-1),
            };
          },
        },
        { signal: controller.signal },
      );
    } catch {
      /* Optional browser capability. */
    }
    return () => controller.abort();
  }, []);
  const p = game.players[view],
    current = game.players[game.active],
    isTurn = view === game.active && started && game.phase !== 'finished';
  const canInvest = isTurn && game.phase === 'invest';
  const filtered = CARDS.filter(
    (c) =>
      (branch === 'all' || c.branch === branch) &&
      (owned ? p.techs.includes(c.id) : availableTechnology(game, c)),
  );
  const need = upkeep(p);
  const meal = foodStatus(current, foodAmount);
  const natural = p.tiles.filter((t) =>
    ['forest', 'wetland'].includes(t.kind),
  ).length;
  function start() {
    const next = createGame(names.slice(0, count));
    ref.current = next;
    setGame(next);
    setDraft([]);
    setChosen(null);
    setView(0);
    setStarted(true);
    setUndo([]);
    setModal(null);
    setMessage('Velkommen til 1700. Plasser den første arbeideren på brettet.');
    setSelected(undefined);
  }
  function download() {
    const blob = new Blob([JSON.stringify(game, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sustained-runde-${game.round}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function tileClick(i: number) {
    if (!isTurn) {
      setMessage(
        started
          ? `Det er ${current.name} sin tur.`
          : 'Velg «Start spill» først.',
      );
      return;
    }
    if (game.phase === 'work') {
      placeWorker({ tile: i });
    } else {
      setSelected(i);
      setModal('build');
    }
  }
  const planning = isTurn && game.phase === 'work';
  const assignments = Array.from(
    { length: current.left },
    (_, i) => draft[i] ?? null,
  );
  const placed = assignments.filter((a): a is WorkPlacement => a !== null);
  const projected = planning ? previewWork(game, placed).players[view] : p;
  function placeWorker(target: WorkPlacement | null, index?: number) {
    if (!planning) return;
    const worker = index ?? chosen ?? assignments.findIndex((a) => a === null);
    if (worker < 0 || worker >= assignments.length) {
      setMessage('Velg en plassert arbeider for å flytte den.');
      return;
    }
    const next = [...assignments];
    next[worker] = target;
    try {
      previewWork(
        game,
        next.filter((a): a is WorkPlacement => a !== null),
      );
      setDraft(next);
      setChosen(null);
      setMessage(
        target
          ? 'Plasseringen er foreløpig. Flytt fritt, og lås når du er klar.'
          : 'Arbeideren er tilbake i reserven.',
      );
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  /* oxlint-disable jsx-a11y/prefer-tag-over-role -- Focusable worker tokens live inside board target buttons; avoid nested button elements. */
  function workerToken(index: number) {
    return (
      <span
        key={index}
        role="button"
        tabIndex={0}
        aria-label={`Arbeider ${index + 1}. Velg eller dra for å flytte.`}
        aria-pressed={chosen === index}
        className={`draft-worker p${view} ${chosen === index ? 'chosen' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          if (!suppressClick.current) setChosen(index);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setChosen(index);
          }
        }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          suppressClick.current = false;
          gesture.current = { index, x: e.clientX, y: e.clientY, moved: false };
        }}
        onPointerMove={(e) => {
          const g = gesture.current;
          if (!g || g.index !== index) return;
          if (Math.hypot(e.clientX - g.x, e.clientY - g.y) > 5) g.moved = true;
          if (g.moved) setDrag({ index, x: e.clientX, y: e.clientY });
        }}
        onPointerUp={(e) => {
          const g = gesture.current;
          if (!g) return;
          gesture.current = null;
          setDrag(null);
          suppressClick.current = g.moved;
          if (!g.moved) return;
          const target = document
            .elementFromPoint(e.clientX, e.clientY)
            ?.closest<HTMLElement>('[data-work-target]')?.dataset.workTarget;
          if (target === 'reserve') placeWorker(null, index);
          else if (target === 'science' || target === 'money')
            placeWorker({ job: target }, index);
          else if (target !== undefined)
            placeWorker({ tile: Number(target) }, index);
        }}
        onPointerCancel={() => {
          gesture.current = null;
          setDrag(null);
          suppressClick.current = true;
        }}
      >
        <Users size={20} />
        <small>{index + 1}</small>
      </span>
    );
  }
  /* oxlint-enable jsx-a11y/prefer-tag-over-role */
  function tileYield(i: number) {
    const t = projected.tiles[i];
    if (t.kind === 'wetland') return 'Kan dreneres';
    if (
      game.phase === 'work' &&
      projected.left > 0 &&
      i < p.rows * 4 &&
      t.workers < (t.kind === 'mill' ? 2 : 1) &&
      !t.auto
    ) {
      const preview = applyAction(
        {
          ...game,
          players: game.players.map((player, id) =>
            id === view ? projected : player,
          ),
          active: view,
        },
        { type: 'work', tile: i },
      );
      const resource: Resource =
        t.kind === 'farm'
          ? 'food'
          : t.kind === 'school'
            ? 'science'
            : 'industry';
      const amount =
        preview.players[view].resources[resource] -
        projected.resources[resource];
      return `${amount} ${RESOURCES[resource].toLowerCase()}${t.kind === 'mill' ? ' · 2 plasser' : ''}`;
    }
    const r =
      t.kind === 'farm'
        ? 'mat'
        : t.kind === 'school'
          ? 'forskning'
          : 'industri';
    const base =
      t.kind === 'forest'
        ? 2
        : t.kind === 'school'
          ? p.buildings.includes('school')
            ? 3
            : 2
          : t.kind === 'ironworks' || t.drained
            ? 4
            : 3;
    return `${base} ${r}${t.kind === 'mill' ? ' · 2 plasser' : ''}`;
  }
  return (
    <main className="game">
      <header className="masthead">
        <div className="wordmark">
          Sustained<span>ET LAND. EN NY TID.</span>
        </div>
        <div className="era">
          I <span>OPPFINNELSENES TID</span>
          <b>1700 — 1800</b>
        </div>
        <div className="header-buttons">
          <button className="quiet" onClick={() => setModal('rules')}>
            <BookOpen size={17} />
            <span>Spilleregler</span>
          </button>
          <button
            className="quiet"
            onClick={() => setModal('setup')}
            title="Nytt spill"
          >
            <Settings2 size={17} />
            <span>Nytt spill</span>
          </button>
        </div>
      </header>
      <nav className="nation-tabs" aria-label="Land">
        {game.players.map((n, i) => (
          <button
            key={i}
            onClick={() => {
              setView(i);
              setSelected(undefined);
            }}
            className={view === i ? 'active' : ''}
          >
            <span className={'player-dot p' + i} />
            {n.name}
            <small>
              {game.active === i && game.phase !== 'finished'
                ? 'Din tur'
                : `${score(n)} poeng`}
            </small>
            {n.passed && game.phase === 'invest' && <Check size={13} />}
          </button>
        ))}
      </nav>
      {!started && (
        <section className="welcome-strip">
          <div>
            <span className="eyebrow">SPILL SAMMEN PÅ ÉN SKJERM</span>
            <h2>Bygg et land. Sett spor i historien.</h2>
            <p>2–5 spillere · 8 runder · 21 teknologier · Tier I</p>
          </div>
          <button className="primary" onClick={() => setModal('setup')}>
            Start spill <ArrowRight size={18} />
          </button>
        </section>
      )}
      {game.phase === 'finished' && (
        <section className="result-banner">
          <Flag size={30} />
          <div>
            <p className="eyebrow">1800 · EN EPOKE ER OVER</p>
            <h2>
              {game.winner?.map((i) => game.players[i].name).join(' og ')}{' '}
              {game.winner?.length === 1 ? 'vinner' : 'deler seieren'}!
            </h2>
            <p>
              {game.players
                .map((x) => `${x.name}: ${score(x)} poeng`)
                .join(' · ')}
            </p>
            <small>
              Dette avslutter Tier I-prototypen. Senere epoker og
              samarbeidsfasen kommer i neste utviklingstrinn.
            </small>
          </div>
        </section>
      )}
      <section className="play-layout">
        <aside className="left-panel">
          <p className="eyebrow">DITT LAND</p>
          <h1>{p.name}</h1>
          <p className="muted">
            {score(p)} prestisje · {natural} naturområder
          </p>
          <div className="resources">
            {(Object.keys(RESOURCES) as Resource[]).map((r) => {
              const I = ICONS[r];
              return (
                <div key={r}>
                  <I size={20} />
                  <span>{RESOURCES[r]}</span>
                  <b>
                    {p.resources[r]}
                    {planning && projected.resources[r] > p.resources[r] && (
                      <em className="gain-preview">
                        {' '}
                        +{projected.resources[r] - p.resources[r]}
                      </em>
                    )}
                  </b>
                </div>
              );
            })}
          </div>
          <div
            className="worker-box"
            data-work-target={planning ? 'reserve' : undefined}
          >
            <Users />
            <b>
              {planning ? current.left - placed.length : p.left} /{' '}
              {p.population} ledige
            </b>
            <div className="meeple-row">
              {planning ? (
                assignments.map((a, i) => (a === null ? workerToken(i) : null))
              ) : (
                <span>{p.left} arbeidere i reserve</span>
              )}
            </div>
            {planning && (
              <button
                className="reserve-return"
                onClick={() => {
                  if (chosen !== null) placeWorker(null);
                }}
              >
                Tilbake til reserve
              </button>
            )}
            <p>
              {planning
                ? 'Dra arbeiderne til brettet. Eller velg en arbeider og trykk på et felt. Slipp dem her for å ta dem tilbake.'
                : 'Ny befolkning kan arbeide fra neste runde.'}
            </p>
          </div>
          <div
            className={
              'food-note ' + (p.resources.food < need ? 'warning' : '')
            }
          >
            <Sprout size={17} />
            <span>
              Mat ved rundeslutt: <b>{need}</b>
              {p.resources.food < need && (
                <small>Du mangler {need - p.resources.food} mat.</small>
              )}
            </span>
          </div>
          <div className="institution-icons">
            {p.buildings.includes('school') && (
              <span>
                <FlaskConical size={15} /> Utvidet lærested
              </span>
            )}
            {p.buildings.includes('culture') && (
              <span>
                <Landmark size={15} /> Bibliotek
              </span>
            )}
          </div>
        </aside>
        <section className="board-section">
          <div className="board-heading">
            <div>
              <p className="eyebrow">LANDSKAPET DITT</p>
              <h2>
                {ROUND_YEARS[game.round - 1]}{' '}
                <span className="heading-separator">/</span> Mulighetenes land
              </h2>
            </div>
            <span className="round-chip">Runde {game.round} / 8</span>
          </div>
          <div
            className="land-board illustrated"
            style={{ backgroundImage: 'url(art/valley.png)' }}
          >
            {projected.tiles.map((t, i) => {
              const locked = i >= p.rows * 4;
              return (
                <button
                  key={i}
                  data-work-target={planning ? i : undefined}
                  aria-label={`Område ${i + 1}: ${TILE_NAMES[t.kind]}. ${locked ? 'Låst.' : tileYield(i)} ${t.workers ? 'Bemannet.' : ''}`}
                  onClick={() =>
                    suppressClick.current
                      ? (suppressClick.current = false)
                      : locked
                        ? setMessage(
                            'Bygg vei, kanal eller bro i investeringsfasen for å åpne neste rad.',
                          )
                        : tileClick(i)
                  }
                  className={`land-tile ${locked ? 'locked' : ''} ${t.workers ? 'occupied' : ''} ${t.auto ? 'auto' : ''} ${selected === i ? 'selected' : ''}`}
                  style={
                    t.kind === 'forest' || locked ? {} : atlas(TILE_ART[t.kind])
                  }
                >
                  <span className="tile-coordinate">
                    {String.fromCharCode(65 + (i % 4))}
                    {Math.floor(i / 4) + 1}
                  </span>
                  {locked ? (
                    <LockKeyhole size={19} />
                  ) : planning && assignments.some((a) => a?.tile === i) ? (
                    <span className="tile-workers">
                      {assignments.map((a, index) =>
                        a?.tile === i ? workerToken(index) : null,
                      )}
                    </span>
                  ) : t.workers ? (
                    <div className={'worker-token p' + view}>
                      <Users size={22} />
                      {t.workers > 1 && <b>{t.workers}</b>}
                    </div>
                  ) : t.auto ? (
                    <Check size={24} />
                  ) : t.kind === 'forest' ? (
                    <TreePine size={26} />
                  ) : t.kind === 'wetland' ? (
                    <Leaf size={24} />
                  ) : null}
                  <span className="tile-title">{TILE_NAMES[t.kind]}</span>
                  <small>
                    {locked
                      ? `Landrad ${Math.floor(i / 4) + 1} · låst`
                      : t.auto
                        ? 'Aktivert av treskeverk'
                        : tileYield(i)}
                  </small>
                </button>
              );
            })}
          </div>
          {planning && (
            <div className="placement-plan">
              <div>
                <b>
                  Planlegg arbeidet · {placed.length}/{current.left}
                </b>
                <p>
                  Utbyttet vises med + i ressursoversikten. Brikkene er
                  foreløpige.
                </p>
              </div>
              <button
                onClick={() => {
                  setDraft([]);
                  setChosen(null);
                }}
              >
                Nullstill
              </button>
              <button
                className="primary"
                disabled={placed.length !== current.left || !placed.length}
                onClick={() => play({ type: 'work_plan', placements: placed })}
              >
                Lås plassering <Check size={17} />
              </button>
            </div>
          )}
          {drag && (
            <div className="drag-ghost" style={{ left: drag.x, top: drag.y }}>
              <Users size={28} />
              <b>{drag.index + 1}</b>
            </div>
          )}
          <div className="board-caption">
            <span>
              <TreePine size={16} />
              {natural} av 16 områder er intakt natur
            </span>
            <span>{p.rows} av 4 rader tilgjengelig</span>
          </div>
          <div className="general-jobs">
            <button
              data-work-target={planning ? 'science' : undefined}
              disabled={!planning}
              onClick={() => {
                if (suppressClick.current) {
                  suppressClick.current = false;
                  return;
                }
                placeWorker({ job: 'science' });
              }}
            >
              <FlaskConical size={19} />
              <span>
                Forskning
                {planning &&
                  assignments.map((a, i) =>
                    a?.job === 'science' ? workerToken(i) : null,
                  )}
                <small>
                  1 arbeider → {p.buildings.includes('school') ? 3 : 2}{' '}
                  forskning
                </small>
              </span>
              <Plus size={17} />
            </button>
            <button
              data-work-target={planning ? 'money' : undefined}
              disabled={!planning}
              onClick={() => {
                if (suppressClick.current) {
                  suppressClick.current = false;
                  return;
                }
                placeWorker({ job: 'money' });
              }}
            >
              <Coins size={19} />
              <span>
                Handelshuset
                {planning &&
                  assignments.map((a, i) =>
                    a?.job === 'money' ? workerToken(i) : null,
                  )}
                <small>1 arbeider → 2 penger</small>
              </span>
              <Plus size={17} />
            </button>
          </div>
        </section>
        <aside className="right-panel">
          <p className="eyebrow">
            {game.phase === 'finished'
              ? 'SPILLET ER FERDIG'
              : `${current.name.toUpperCase()} SIN TUR`}
          </p>
          <h2>
            {game.phase === 'work'
              ? 'Skap fremgang.'
              : game.phase === 'food'
                ? 'Sørg for alle.'
                : game.phase === 'invest'
                  ? 'Sett ideene i verk.'
                  : 'Et land i utvikling.'}
          </h2>
          <p>
            {game.phase === 'work'
              ? 'Dra arbeiderne dit de skal gjøre nytte. Se utbyttet, flytt dem rundt og lås plasseringen når du er klar.'
              : 'Forsk frem teknologi, bygg landet og sørg for at alle får mat.'}
          </p>
          <div
            className={'turn-step ' + (game.phase === 'work' ? 'active' : '')}
          >
            01 <b>Arbeiderplassering</b>
            {game.phase !== 'work' && <Check size={14} />}
          </div>
          <div
            className={'turn-step ' + (game.phase === 'invest' ? 'active' : '')}
          >
            02 <b>Investeringer</b>
            {game.phase === 'invest' && <span>{current.investments}/2</span>}
          </div>
          <div
            className={'turn-step ' + (game.phase === 'food' ? 'active' : '')}
          >
            03 <b>Status og matfordeling</b>
          </div>
          {view !== game.active && game.phase !== 'finished' ? (
            <button className="primary" onClick={() => setView(game.active)}>
              Til {current.name} <ArrowRight size={17} />
            </button>
          ) : (
            <>
              <button
                className="action-button"
                disabled={!canInvest || p.investments < 1}
                onClick={() => {
                  setSelected(undefined);
                  setModal('build');
                }}
              >
                <Factory size={17} /> Bygg infrastruktur <Plus size={16} />
              </button>
              <button
                className="action-button"
                disabled={!canInvest}
                onClick={() => setModal('trade')}
              >
                <ArrowLeftRight size={17} /> Handel{' '}
                <small>{p.trade - p.tradeUsed} igjen</small>
              </button>
              <button
                className="action-button"
                disabled={
                  !canInvest ||
                  p.investments < 1 ||
                  p.growth ||
                  p.population >= 6 ||
                  !afford(p, { food: 3, money: 1 })
                }
                onClick={() => play({ type: 'grow' })}
              >
                <Users size={17} /> Øk befolkningen{' '}
                <small>3 mat + 1 penge</small>
              </button>
              {game.phase === 'invest' && (
                <button
                  className="primary"
                  disabled={!canInvest}
                  onClick={() => play({ type: 'pass' })}
                >
                  Til status og mat <ArrowRight size={17} />
                </button>
              )}
            </>
          )}
          <div className="tip">
            <BookOpen size={15} />
            <p>
              {game.phase === 'work'
                ? 'Tips: Første forskning koster 3–4. Du starter med 2. En forsker gjør en teknologi mulig allerede i første runde.'
                : 'Teknologi og bygging bruker én investering hver. Handel bruker kapasitet, men ingen investering.'}
            </p>
          </div>
        </aside>
      </section>
      <output className="live-message" aria-live="polite">
        <span className="status-dot" />
        {message ||
          (!started
            ? 'Start et nytt spill når alle er klare.'
            : game.log.at(-1))}
      </output>
      <section className="market">
        <div className="section-title">
          <div>
            <p className="eyebrow">
              {owned ? 'LANDETS KUNNSKAP' : 'TEKNOLOGIMARKEDET'}
            </p>
            <h2>Små oppfinnelser. Store forandringer.</h2>
          </div>
          <button
            className={'quiet ' + (owned ? 'chosen' : '')}
            onClick={() => setOwned(!owned)}
          >
            <BookOpen size={16} />
            {owned ? 'Vis markedet' : `Mine teknologier (${p.techs.length})`}
          </button>
        </div>
        {!owned && (
          <div className="market-release">
            <b>
              Runde {game.round} ·{' '}
              {CARDS.filter((c) => availableTechnology(game, c)).length} av 21
              teknologier åpnet
            </b>
            <p>
              Nytt nå:{' '}
              {TECHNOLOGY_ROUNDS[game.round - 1]
                .map((id) => CARDS.find((c) => c.id === id)!.name)
                .join(' · ')}
            </p>
            <p>
              {game.round < 8
                ? `Neste runde: ${TECHNOLOGY_ROUNDS[game.round].map((id) => CARDS.find((c) => c.id === id)!.name).join(' · ')}`
                : 'Alle Tier I-teknologier er nå åpnet.'}{' '}
              Tidligere kort blir liggende så lenge det finnes eksemplarer.
            </p>
          </div>
        )}
        <div className="market-filters">
          <Tabs value={branch} onValueChange={(v) => setBranch(String(v))}>
            <TabsList>
              <TabsTrigger value="all">Alle teknologier</TabsTrigger>
              {Object.entries(BRANCHES).map(([k, v]) => (
                <TabsTrigger key={k} value={k}>
                  {v} · 7
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <span>Tier I · 1700–1800</span>
        </div>
        <div className="cards-row">
          {filtered.map((c) => (
            <button
              className={'tech-card ' + c.branch}
              key={c.id}
              onClick={() => setCard(c)}
            >
              <div className="card-art" style={atlas(c.art)}>
                <span className="card-tier">
                  {availableRound(c.id) === game.round ? 'NY · I' : 'I'}
                </span>
                <span className="card-year">{c.year.split(' · ')[0]}</span>
                {p.techs.includes(c.id) && (
                  <span className="researched">
                    <Check size={14} /> Forsket frem
                  </span>
                )}
              </div>
              <div className="card-body">
                <span className="eyebrow">
                  {BRANCHES[c.branch]}{' '}
                  {c.special ? '· SPESIALISERING' : '· GRUNNTEKNOLOGI'}
                </span>
                <h3>{c.name}</h3>
                <p>{c.effect}</p>
                <footer>
                  <span>
                    <FlaskConical size={16} /> {c.cost}
                  </span>
                  <span>
                    {p.techs.includes(c.id)
                      ? 'I ditt land'
                      : `${stock(game, c)} eksemplarer`}
                  </span>
                </footer>
              </div>
            </button>
          ))}
        </div>
        {!filtered.length && (
          <div className="empty-state">
            <BookOpen />
            <h3>Landets historie er ennå uskrevet.</h3>
            <p>Teknologiene du forsker frem, samles her.</p>
            <button className="quiet" onClick={() => setOwned(false)}>
              Utforsk markedet
            </button>
          </div>
        )}
      </section>
      <footer className="game-footer">
        <span>
          Sustained <b>·</b> Spillbar prototype 0.1 <b>·</b>{' '}
          {saveError
            ? 'Lagring er utilgjengelig – last ned partiet.'
            : started
              ? 'Lagret på denne enheten'
              : 'Spill på delt skjerm'}
        </span>
        <div>
          <button onClick={() => setModal('log')}>
            <BookOpen size={15} /> Historikk
          </button>
          <button
            disabled={!undo.length}
            onClick={() => {
              const prev = undo.at(-1)!;
              ref.current = prev;
              setGame(prev);
              setDraft([]);
              setChosen(null);
              setView(prev.active);
              setUndo((u) => u.slice(0, -1));
              setMessage('Siste handling er angret.');
            }}
          >
            <Undo2 size={15} /> Angre
          </button>
          <button onClick={download}>
            <Download size={15} /> Lagre fil
          </button>
          <button onClick={() => upload.current?.click()}>
            <Upload size={15} /> Åpne fil
          </button>
        </div>
        <input
          type="file"
          accept="application/json,.json"
          hidden
          ref={upload}
          onChange={async (e) => {
            try {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > 2000000) throw Error('Filen er for stor.');
              const loaded = parseSave(await f.text());
              ref.current = loaded;
              setGame(loaded);
              setDraft([]);
              setChosen(null);
              setView(loaded.active);
              setStarted(true);
              setUndo([]);
              setMessage('Det lagrede partiet er åpnet.');
            } catch (error) {
              setMessage(
                error instanceof Error
                  ? error.message
                  : 'Kunne ikke åpne filen.',
              );
            }
            e.target.value = '';
          }}
        />
      </footer>
      <Dialog
        open={started && game.phase === 'food'}
        onOpenChange={(open) => {
          if (!open) play({ type: 'resume_invest' });
        }}
      >
        <DialogContent className="game-dialog food-dialog">
          <p className="eyebrow">
            RUNDE {game.round} · {ROUND_YEARS[game.round - 1]} · LANDETS STATUS
          </p>
          <DialogTitle className="dialog-title">
            Et måltid til {current.name}.
          </DialogTitle>
          <DialogDescription>
            Fordel mat før turen går videre. Ingenting trekkes før du bekrefter.
          </DialogDescription>
          <div className="food-summary">
            <div>
              <Users />
              <b>{current.population}</b>
              <span>Innbyggere</span>
            </div>
            <div>
              <Sprout />
              <b>{meal.available}</b>
              <span>Mat tilgjengelig</span>
            </div>
            <div>
              <Factory />
              <b>{current.resources.industry}</b>
              <span>Industri</span>
            </div>
            <div>
              <FlaskConical />
              <b>{current.resources.science}</b>
              <span>Forskning</span>
            </div>
          </div>
          <p>
            Penger: {current.resources.money} · Matlager:{' '}
            {current.resources.food} · Vekselbruk: +{meal.rotation} ·
            Kornrensing: +{meal.cleaning}. Matbehov: <b>{meal.need}</b>
            {meal.need < current.population ? ' (redusert av husdyravl)' : ''}.
          </p>
          <div className="ration-row" aria-label="Matrasjoner">
            {Array.from({ length: meal.need }, (_, i) => (
              <button
                key={i}
                className={i < foodAmount ? 'ration filled' : 'ration'}
                aria-label={`Fordel ${i + 1} matrasjoner`}
                aria-pressed={i < foodAmount}
                disabled={i >= meal.available}
                onClick={() => setFoodAmount(i + 1 === foodAmount ? i : i + 1)}
              >
                <Sprout size={26} />
                <span>{i < foodAmount ? 'Mat fordelt' : 'Mangler mat'}</span>
              </button>
            ))}
          </div>
          <div className="ration-controls">
            <label htmlFor="food-amount">Fordel mat</label>
            <Input
              id="food-amount"
              type="number"
              min={0}
              max={Math.min(meal.need, meal.available)}
              value={foodAmount}
              onChange={(e) =>
                setFoodAmount(
                  Math.max(
                    0,
                    Math.min(
                      meal.need,
                      meal.available,
                      Math.floor(Number(e.target.value) || 0),
                    ),
                  ),
                )
              }
            />
            <button
              className="quiet"
              onClick={() => setFoodAmount(Math.min(meal.need, meal.available))}
            >
              Fordel så mye som mulig
            </button>
          </div>
          <div
            className={'meal-result ' + (meal.shortage ? 'shortage' : '')}
            aria-live="polite"
          >
            <b>
              {meal.shortage
                ? `${meal.shortage} matrasjoner mangler`
                : 'Alle får maten de trenger'}
            </b>
            <p>
              {meal.lost
                ? `Du mister ${meal.lost} innbyggere. ${current.population - meal.lost} blir igjen og kan arbeide neste runde.`
                : meal.shortage
                  ? 'Du beholder den siste innbyggeren, selv ved matmangel.'
                  : `${current.population} innbyggere beholdes.`}
            </p>
            <p>
              Mat etter fordeling: <b>{meal.remaining}</b> · Poeng etter
              fordeling: <b>{score(current) - meal.lost * 2}</b>
            </p>
          </div>
          <div className="meal-actions">
            <button
              className="quiet"
              onClick={() => play({ type: 'resume_invest' })}
            >
              Tilbake til investeringer og handel
            </button>
            <button
              className="primary"
              onClick={() => play({ type: 'feed', amount: foodAmount })}
            >
              {meal.lost
                ? `Bekreft · mist ${meal.lost} innbyggere`
                : 'Bekreft matfordeling'}{' '}
              <ArrowRight size={17} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={card !== null}
        onOpenChange={(open) => !open && setCard(null)}
      >
        <DialogContent className="game-dialog card-dialog">
          {card && (
            <>
              <div className="detail-art" style={atlas(card.art)}>
                <span className="card-tier">
                  {availableRound(card.id) === game.round ? 'NY · I' : 'I'}
                </span>
              </div>
              <div className="detail-content">
                <p className="eyebrow">
                  {BRANCHES[card.branch]} · {card.year}
                </p>
                <DialogTitle className="dialog-title">{card.name}</DialogTitle>
                <DialogDescription>
                  {card.special
                    ? 'Spesialisering · Begrenset antall'
                    : 'Grunnteknologi · Ett eksemplar per land'}
                </DialogDescription>
                <p className="rule-text">{card.effect}</p>
                {card.requires && (
                  <p className="requirement">
                    Forutsetning:{' '}
                    {CARDS.find((c) => c.id === card.requires)?.name}
                  </p>
                )}
                <div className="history-note">
                  <p>{card.history}</p>
                  <a href={card.source} target="_blank" rel="noreferrer">
                    Historisk kilde ↗
                  </a>
                </div>
                <button
                  className="primary"
                  disabled={!isTurn || !!researchReason(game, card)}
                  onClick={() => {
                    play({ type: 'research', id: card.id });
                    setCard(null);
                  }}
                >
                  <FlaskConical size={18} /> Forsk frem · {card.cost} forskning
                </button>
                <p className="disabled-reason">
                  {!started
                    ? 'Start et spill for å forske.'
                    : !isTurn
                      ? `Det er ${current.name} sin tur.`
                      : researchReason(game, card) ||
                        'Bruker én investering. Virker fra neste aktuelle handling.'}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={modal !== null}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent
          className={
            'game-dialog ' +
            (modal === 'build' || modal === 'rules' ? 'wide-dialog' : '')
          }
        >
          {modal === 'setup' && (
            <>
              <p className="eyebrow">OPPFINNELSENES TID</p>
              <DialogTitle className="dialog-title">
                Hvem former fremtiden?
              </DialogTitle>
              <DialogDescription>
                Spill etter tur på samme skjerm. Velg 2–5 land.
              </DialogDescription>
              <div className="count-buttons">
                {[2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={count === n ? 'active' : ''}
                    onClick={() => setCount(n)}
                  >
                    {n} spillere
                  </button>
                ))}
              </div>
              {names.slice(0, count).map((n, i) => (
                <label className="name-field" key={i}>
                  <span className={'player-dot p' + i} />
                  <span className="sr-only">Navn på land {i + 1}</span>
                  <Input
                    maxLength={24}
                    value={n}
                    onChange={(e) =>
                      setNames((old) =>
                        old.map((x, j) => (i === j ? e.target.value : x)),
                      )
                    }
                  />
                </label>
              ))}
              <p className="muted">
                8 runder gjennom 1700-tallet. Flest prestisjepoeng vinner.{' '}
                {started
                  ? 'Det nye spillet erstatter gjeldende parti. Lagre fil først hvis du vil beholde det.'
                  : ''}
              </p>
              <button className="primary" onClick={start}>
                La historien begynne <ArrowRight size={18} />
              </button>
            </>
          )}
          {modal === 'build' && (
            <>
              <p className="eyebrow">
                {p.name.toUpperCase()} · {p.investments} INVESTERINGER IGJEN
              </p>
              <DialogTitle className="dialog-title">
                Bygg landet videre.
              </DialogTitle>
              <DialogDescription>
                {selected === undefined
                  ? 'Velg et område nedenfor når bygget krever plass.'
                  : 'Valgt område: ' +
                    String.fromCharCode(65 + (selected % 4)) +
                    (Math.floor(selected / 4) + 1) +
                    ' · ' +
                    TILE_NAMES[p.tiles[selected].kind]}
              </DialogDescription>
              <div className="mini-board">
                {p.tiles.map((t, i) => (
                  <button
                    key={i}
                    disabled={i >= p.rows * 4 || !!t.workers || t.auto}
                    className={selected === i ? 'active' : ''}
                    onClick={() => setSelected(i)}
                    title={TILE_NAMES[t.kind]}
                  >
                    {String.fromCharCode(65 + (i % 4))}
                    {Math.floor(i / 4) + 1}
                    <small>{TILE_NAMES[t.kind]}</small>
                  </button>
                ))}
              </div>
              <div className="build-list">
                {BUILDINGS.map((b) => {
                  const reason = buildReason(game, b.id, selected);
                  return (
                    <div className="build-item" key={b.id}>
                      <div>
                        <h3>{b.name}</h3>
                        <p>{b.desc}</p>
                        {reason && <small>{reason}</small>}
                      </div>
                      <button
                        className="build-buy"
                        disabled={!!reason || !canInvest}
                        onClick={() => {
                          play({ type: 'build', id: b.id, tile: selected });
                          setModal(null);
                        }}
                      >
                        <CostLabel cost={b.cost} />
                        <span>
                          Bygg <Plus size={13} />
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {modal === 'trade' && (
            <>
              <p className="eyebrow">HANDEL OG FORBINDELSER</p>
              <DialogTitle className="dialog-title">
                Varer finner nye veier.
              </DialogTitle>
              <DialogDescription>
                {p.trade - p.tradeUsed} av {p.trade} mottatte enheter igjen
                denne runden. Forskning kan ikke handles.
              </DialogDescription>
              <div className="trade-row">
                <label>
                  Du gir
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value as Resource)}
                  >
                    {(['money', 'industry', 'food'] as Resource[]).map((r) => (
                      <option key={r} value={r}>
                        {RESOURCES[r]}
                      </option>
                    ))}
                  </select>
                </label>
                <ArrowRight />
                <label>
                  Du får
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value as Resource)}
                  >
                    {(['food', 'industry', 'money'] as Resource[]).map((r) => (
                      <option key={r} value={r}>
                        {RESOURCES[r]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="exchange-rate">
                {p.techs.includes('chronometer') ? '3 → 2' : '2 → 1'}
              </p>
              <p className="muted">
                {p.techs.includes('chronometer')
                  ? 'Kronometeret gir bedre vekslingsforhold.'
                  : 'Transportteknologi kan gi bedre kapasitet og vekslingsforhold.'}
              </p>
              <button
                className="primary"
                disabled={
                  !canInvest ||
                  from === to ||
                  p.resources[from] <
                    (p.techs.includes('chronometer') ? 3 : 2) ||
                  p.trade - p.tradeUsed <
                    (p.techs.includes('chronometer') ? 2 : 1)
                }
                onClick={() => play({ type: 'trade', from, to })}
              >
                Gjennomfør handel <ArrowLeftRight size={17} />
              </button>
              <output className="disabled-reason">{message}</output>
            </>
          )}
          {modal === 'log' && (
            <>
              <DialogTitle className="dialog-title">
                Landene skriver historie.
              </DialogTitle>
              <DialogDescription>
                Alle handlinger og rundeslutt, nyeste øverst.
              </DialogDescription>
              <ol className="event-log">
                {[...game.log].reverse().map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ol>
            </>
          )}
          {modal === 'rules' && (
            <>
              <p className="eyebrow">SUSTAINED · TIER I</p>
              <DialogTitle className="dialog-title">
                Fra natur til industrinasjon.
              </DialogTitle>
              <DialogDescription>
                2–5 spillere på samme skjerm. Åtte runder gjennom 1700-tallet.
              </DialogDescription>
              <div className="rules">
                <h3>1. Sett arbeiderne i arbeid</h3>
                <p>
                  Hvert land planlegger alle sine ledige arbeidere før turen går
                  videre. Dra brikkene til et felt, forskning eller
                  handelshuset. Flytt dem fritt eller tilbake til reserven. Du
                  kan også velge en brikke og klikke på målet. Ressursene kommer
                  først når du trykker «Lås plassering». Alle begynner med to
                  arbeidere. Feltene har én plass, unntatt tekstilmøller som har
                  to.
                </p>
                <h3>2. Invester i fremtiden</h3>
                <p>
                  Når alle arbeidere er plassert, får hvert land to
                  investeringer. Landet fullfører begge før neste land begynner.
                  En investering er én teknologi, ett bygg eller én
                  befolkningsvekst. Du kan handle før, mellom og etter
                  investeringene. Trykk «Til status og mat» når du er ferdig.
                </p>
                <p>
                  Teknologi kjøpes med forskning. Bygg krever industri og
                  penger. Kortene viser de eksakte effektene. Utbyttebonuser
                  gjelder fremtidige arbeiderplasseringer; de gir aldri
                  ressurser for handlinger du allerede har gjort. Bygg på
                  ubemannede felt. Vei, kanal og bro åpner én hel landrad.
                </p>
                <h3>3. Sørg for mat</h3>
                <p>
                  Etter dine investeringer åpnes landets statusside. Vekselbruk
                  og kornrensing inngår i matlageret. Fordel én mat per
                  innbygger og bekreft fordelingen før neste land overtar.
                  Husdyravl kan redusere behovet. Hver manglende mat koster én
                  innbygger, men du beholder alltid minst én. Resterende
                  ressurser beholdes. Startspilleren roterer.
                </p>
                <h3>Befolkning og handel</h3>
                <p>
                  En ny innbygger koster 3 mat, 1 penge og én investering. Maks
                  én per runde og seks totalt. Den spiser allerede denne runden,
                  men arbeider fra neste. Handel er 2 mot 1; kronometer gir 3
                  mot 2. Kapasiteten teller mottatte enheter, og nullstilles
                  hver runde.
                </p>
                <h3>Hvordan vinner du?</h3>
                <p>
                  Etter mating i runde 8: 2 poeng per innbygger, 2 per
                  teknologi, 2 per åpnet rad utover første, 2 per
                  jernverk/tekstil­mølle og 5 for bibliotek. Ubrukte ressurser
                  gir ingen poeng. Lik poengsum gir delt seier.
                </p>
                <h3>Presiseringer</h3>
                <p>
                  Tilstøtende betyr felles side, aldri diagonal. Treskeverk
                  aktiverer ett ledig nabofelt uten bonuser; feltet kan ikke
                  brukes igjen samme runde. Skogshøsting bevarer skogen. Åker,
                  verksted, gruve og drenering endrer naturen. Tier I har 21
                  kort, sju per område. Opptil tre nye teknologier åpnes hver
                  runde, i en fast historisk rekkefølge. Tidligere kort blir
                  tilgjengelige videre. Grunnkort finnes til alle,
                  spesialiseringer til halvparten av spillerne avrundet opp.
                </p>
                <h3>Om prototypen</h3>
                <p>
                  Dette er den spillbare Tier I-utgaven. Tier II (1800–1900),
                  Tier III (1900–1980) og samarbeidsfasen er planlagt videre.
                  Kortverdiene er prototyperegler; historisk tekst skiller
                  dokumenterte forhold fra spillmessige forenklinger.
                  Illustrasjonene er kunstneriske miljøbilder.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
