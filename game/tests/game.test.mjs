import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGame,
  applyAction,
  previewWork,
  foodStatus,
  availableTechnology,
  TECHNOLOGY_ROUNDS,
  availableRound,
  CARDS,
  stock,
  parseSave,
  score,
  adjacent,
} from '../lib/game.ts';
const invest = () => {
  const g = createGame(['A', 'B']);
  g.phase = 'invest';
  g.players.forEach((p) => {
    p.resources = { food: 30, industry: 30, science: 30, money: 30 };
    p.left = 0;
  });
  return g;
};
test('21 technologies, exactly seven per branch, unique IDs', () => {
  assert.equal(CARDS.length, 21);
  for (const b of ['industry', 'transport', 'food'])
    assert.equal(CARDS.filter((c) => c.branch === b).length, 7);
  assert.equal(new Set(CARDS.map((c) => c.id)).size, 21);
});
test('work rotates players and enters investment phase only after all work', () => {
  let g = createGame(['A', 'B']);
  for (let i = 0; i < 4; i++) {
    const before = g;
    g = applyAction(g, { type: 'work', job: 'science' });
    assert.notEqual(g, before);
  }
  assert.equal(g.phase, 'invest');
  assert.equal(g.active, 0);
  assert.equal(g.players[0].resources.science, 6);
  assert.throws(() => applyAction(g, { type: 'work', job: 'money' }));
});
test('locked, occupied, invalid and wetland placement are rejected without mutation', () => {
  const g = createGame(['A', 'B']);
  const before = JSON.stringify(g);
  for (const tile of [-1, 16, 4, 1.5])
    assert.throws(() => applyAction(g, { type: 'work', tile }));
  assert.equal(JSON.stringify(g), before);
  g.players[0].tiles[0].workers = 1;
  assert.throws(() => applyAction(g, { type: 'work', tile: 0 }));
  g.players[0].rows = 2;
  assert.throws(() => applyAction(g, { type: 'work', tile: 5 }));
});
test('research costs an investment and cannot be bought twice', () => {
  let g = invest();
  g.round = 2;
  g = applyAction(g, { type: 'research', id: 'drill' });
  assert.equal(g.players[0].resources.science, 27);
  assert.equal(g.players[0].investments, 1);
  assert.throws(() => applyAction(g, { type: 'research', id: 'drill' }));
  g = applyAction(g, { type: 'research', id: 'rotation' });
  assert.throws(() => applyAction(g, { type: 'research', id: 'roads' }));
});
test('specialized stock is shared and prerequisites are enforced', () => {
  let g = invest();
  g.round = 6;
  assert.throws(() => applyAction(g, { type: 'research', id: 'watt' }));
  g = applyAction(g, { type: 'research', id: 'jenny' });
  assert.equal(
    stock(
      g,
      CARDS.find((c) => c.id === 'jenny'),
    ),
    0,
  );
  g.active = 1;
  assert.throws(() => applyAction(g, { type: 'research', id: 'jenny' }));
});
test('roads open one row, cannot exceed four; occupied land cannot be built over', () => {
  let g = invest();
  g.players[0].techs = ['roads'];
  g = applyAction(g, { type: 'build', id: 'road' });
  assert.equal(g.players[0].rows, 2);
  g.players[0].rows = 4;
  assert.throws(() => applyAction(g, { type: 'build', id: 'road' }));
  g.players[0].tiles[2].workers = 1;
  assert.throws(() => applyAction(g, { type: 'build', id: 'farm', tile: 2 }));
});
test('first worker seed drill bonus only once; thresher activates exactly one eligible neighbor', () => {
  let g = createGame(['A', 'B']);
  const p = g.players[0];
  p.techs = ['drill', 'thresher'];
  p.tiles[1].kind = 'farm';
  g = applyAction(g, { type: 'work', tile: 0 });
  assert.equal(g.players[0].resources.food, 11);
  assert.equal(g.players[0].tiles[1].auto, true);
  g.active = 0;
  assert.throws(() => applyAction(g, { type: 'work', tile: 1 }));
  assert.equal(adjacent(3, 4), false);
});
test('trade consumes received capacity, never allows science, negative loops or equal resources', () => {
  let g = invest();
  g = applyAction(g, { type: 'trade', from: 'money', to: 'food' });
  g = applyAction(g, { type: 'trade', from: 'food', to: 'money' });
  assert.equal(g.players[0].resources.money, 29);
  assert.equal(g.players[0].resources.food, 29);
  assert.throws(() =>
    applyAction(g, { type: 'trade', from: 'money', to: 'food' }),
  );
  assert.throws(() =>
    applyAction(invest(), { type: 'trade', from: 'science', to: 'food' }),
  );
  assert.throws(() =>
    applyAction(invest(), { type: 'trade', from: 'food', to: 'food' }),
  );
  const h = invest();
  h.players[0].techs = ['chronometer'];
  const j = applyAction(h, { type: 'trade', from: 'money', to: 'food' });
  assert.equal(j.players[0].tradeUsed, 2);
  assert.equal(j.players[0].resources.food, 32);
});
test('growth is bounded and new population does not work until next round', () => {
  let g = invest();
  g = applyAction(g, { type: 'grow' });
  assert.equal(g.players[0].population, 3);
  assert.equal(g.players[0].left, 0);
  assert.throws(() => applyAction(g, { type: 'grow' }));
  g = finishTurn(g);
  g = finishTurn(g);
  assert.equal(g.round, 2);
  assert.equal(g.players[0].left, 3);
  assert.equal(g.active, 1);
});
test('food shortage and rotation resolve before next round', () => {
  let g = invest();
  g.players[0].resources.food = 0;
  g.players[0].population = 3;
  g.players[1].resources.food = 0;
  g.players[1].techs = ['rotation'];
  g.players[1].tiles[0].workers = 1;
  g.players[1].tiles[1] = { kind: 'farm', workers: 1 };
  g = finishTurn(g);
  g = finishTurn(g);
  assert.equal(g.players[0].population, 1);
  assert.equal(g.players[1].population, 2);
  assert.equal(g.players[1].resources.food, 0);
});
test('full 2–5 player games terminate legally and round-trip save at every action', () => {
  for (let n = 2; n <= 5; n++) {
    let g = createGame(Array.from({ length: n }, (_, i) => String(i)));
    let count = 0;
    while (g.phase !== 'finished' && count < 500) {
      const p = g.players[g.active];
      g = applyAction(
        g,
        g.phase === 'work'
          ? !p.tiles[0].workers
            ? { type: 'work', tile: 0 }
            : { type: 'work', job: 'science' }
          : g.phase === 'food'
            ? {
                type: 'feed',
                amount: Math.min(foodStatus(p).need, foodStatus(p).available),
              }
            : { type: 'pass' },
      );
      g = parseSave(JSON.stringify(g));
      count++;
    }
    assert.equal(g.phase, 'finished');
    assert.equal(g.round, 8);
    assert.ok(g.winner.length > 0);
    assert.ok(g.players.every((p) => score(p) >= 0));
    assert.throws(() => applyAction(g, { type: 'pass' }));
  }
});
test('bad save input rejected', () => {
  for (const text of ['null', '{}', 'bad', '{"version":99}'])
    assert.throws(() => parseSave(text));
  const g = createGame(['A', 'B']);
  g.players[0].resources.food = -1;
  assert.throws(() => parseSave(JSON.stringify(g)));
});

test('planning, moving and cancelling never mutate committed resources or bonuses', () => {
  const g = createGame(['A', 'B']);
  g.players[0].techs = ['drill'];
  const before = structuredClone(g);
  const first = previewWork(g, [{ tile: 0 }]);
  assert.equal(first.players[0].resources.food, 8);
  const moved = previewWork(g, [{ job: 'money' }]);
  assert.equal(moved.players[0].resources.food, 4);
  assert.equal(moved.players[0].resources.money, 6);
  assert.deepEqual(moved.players[0].used, []);
  assert.deepEqual(previewWork(g, []), g);
  assert.deepEqual(g, before);
});
test('locking applies exactly the preview and hands over only after the whole plan', () => {
  const g = createGame(['A', 'B']);
  const placements = [{ tile: 0 }, { job: 'science' }];
  const locked = applyAction(g, { type: 'work_plan', placements });
  assert.deepEqual(locked, previewWork(g, placements));
  assert.equal(locked.active, 1);
  assert.equal(locked.players[0].left, 0);
  assert.equal(locked.players[1].left, 2);
  const done = applyAction(locked, { type: 'work_plan', placements });
  assert.equal(done.phase, 'invest');
  assert.equal(done.active, done.first);
});
test('invalid complete plans fail atomically; partial plans cannot be locked', () => {
  const g = createGame(['A', 'B']);
  const before = structuredClone(g);
  for (const placements of [
    [{ tile: 0 }],
    [{ tile: 0 }, { tile: 0 }],
    [{ tile: 1 }, { tile: 99 }],
    [{ tile: 0, job: 'money' }, { tile: 1 }],
  ]) {
    assert.throws(() => applyAction(g, { type: 'work_plan', placements }));
    assert.deepEqual(g, before);
  }
});
test('full games using locked plans terminate and preserve valid saves', () => {
  for (let count = 2; count <= 5; count++) {
    let g = createGame(Array.from({ length: count }, (_, i) => String(i)));
    let actions = 0;
    while (g.phase !== 'finished' && actions++ < 200) {
      g = applyAction(
        g,
        g.phase === 'work'
          ? {
              type: 'work_plan',
              placements: Array.from(
                { length: g.players[g.active].left },
                () => ({ job: 'money' }),
              ),
            }
          : g.phase === 'food'
            ? { type: 'feed', amount: 0 }
            : { type: 'pass' },
      );
      assert.deepEqual(parseSave(JSON.stringify(g)), g);
    }
    assert.equal(g.phase, 'finished');
  }
});

function finishTurn(g) {
  g = applyAction(g, { type: 'pass' });
  const meal = foodStatus(g.players[g.active]);
  return applyAction(g, {
    type: 'feed',
    amount: Math.min(meal.need, meal.available),
  });
}
test('food screen pauses on the current player; preview and returning never consume food', () => {
  let g = invest();
  const before = structuredClone(g.players);
  g = applyAction(g, { type: 'pass' });
  assert.equal(g.phase, 'food');
  assert.equal(g.active, 0);
  assert.deepEqual(g.players, before);
  assert.deepEqual(parseSave(JSON.stringify(g)), g);
  assert.throws(() =>
    applyAction(g, { type: 'trade', from: 'money', to: 'food' }),
  );
  assert.throws(() => applyAction(g, { type: 'pass' }));
  g = applyAction(g, { type: 'resume_invest' });
  assert.equal(g.phase, 'invest');
  assert.deepEqual(g.players, before);
});
test('ration allocation is validated and shortage affects only the finishing player once', () => {
  let g = invest();
  g.players[0].population = 4;
  g.players[0].resources.food = 1;
  g = applyAction(g, { type: 'pass' });
  const before = structuredClone(g);
  for (const amount of [-1, 2, 1.5, NaN, Infinity])
    assert.throws(() => applyAction(g, { type: 'feed', amount }));
  assert.deepEqual(g, before);
  const preview = foodStatus(g.players[0], 1);
  g = applyAction(g, { type: 'feed', amount: 1 });
  assert.equal(g.players[0].population, 4 - preview.lost);
  assert.equal(g.players[0].resources.food, preview.remaining);
  assert.equal(g.players[1].population, 2);
  assert.equal(g.active, 1);
  assert.equal(g.phase, 'invest');
  assert.throws(() => applyAction(g, { type: 'feed', amount: 0 }));
});
test('rotation and cleaning bonuses are previewed, paid once, and never farmed by reopening', () => {
  let g = invest();
  const p = g.players[0];
  p.resources.food = 0;
  p.techs = ['rotation', 'winnowing'];
  p.tiles[0] = { kind: 'farm', workers: 1 };
  p.tiles[1] = { kind: 'farm', workers: 1 };
  for (let i = 0; i < 3; i++) {
    g = applyAction(g, { type: 'pass' });
    assert.equal(foodStatus(g.players[0]).available, 3);
    g = applyAction(g, { type: 'resume_invest' });
  }
  g = finishTurn(g);
  assert.equal(g.players[0].resources.food, 1);
});
test('technology releases are bounded, complete, permanent and enforced by research', () => {
  assert.deepEqual(
    new Set(TECHNOLOGY_ROUNDS.flat()),
    new Set(CARDS.map((c) => c.id)),
  );
  assert.equal(TECHNOLOGY_ROUNDS.flat().length, 21);
  for (const ids of TECHNOLOGY_ROUNDS)
    assert.ok(ids.length > 0 && ids.length <= 3);
  let g = invest();
  const card = CARDS.find((c) => c.id === 'boring');
  g.players[0].techs = ['newcomen'];
  assert.throws(() => applyAction(g, { type: 'research', id: card.id }));
  for (let round = 1; round <= 8; round++) {
    g.round = round;
    for (const c of CARDS)
      assert.equal(availableTechnology(g, c), availableRound(c.id) <= round);
  }
  g = applyAction(g, { type: 'research', id: card.id });
  assert.ok(g.players[0].techs.includes(card.id));
});
test('new production and navigation technologies have working bounded effects', () => {
  let g = createGame(['A', 'B']);
  const p = g.players[0];
  p.techs = ['plough', 'shuttle', 'boring', 'newcomen', 'almanac'];
  assert.equal(
    previewWork(g, [{ tile: 0 }]).players[0].resources.food,
    p.resources.food + 4,
  );
  assert.equal(
    previewWork(g, [{ tile: 1 }]).players[0].resources.industry,
    p.resources.industry + 4,
  );
  p.tiles[2] = { kind: 'mine', workers: 0 };
  assert.equal(
    previewWork(g, [{ tile: 2 }]).players[0].resources.industry,
    p.resources.industry + 6,
  );
  assert.equal(
    previewWork(g, [{ job: 'money' }, { job: 'money' }]).players[0].resources
      .money,
    p.resources.money + 5,
  );
  g = invest();
  g.round = 5;
  const trade = g.players[0].trade;
  g = applyAction(g, { type: 'research', id: 'sextant' });
  assert.equal(g.players[0].trade, trade + 1);
});

test('legacy investment saves require food for previously passed players without restoring investments', () => {
  const g = invest();
  g.version = 1;
  g.players[0].passed = true;
  g.players[0].investments = 1;
  g.active = 1;
  const migrated = parseSave(JSON.stringify(g));
  assert.equal(migrated.version, 2);
  assert.equal(migrated.players[0].passed, false);
  assert.equal(migrated.players[0].investments, 0);
  const fed = finishTurn(migrated);
  assert.equal(fed.round, 1);
  assert.equal(fed.active, 0);
  assert.equal(finishTurn(fed).round, 2);
});
