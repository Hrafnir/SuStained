import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGame,
  applyAction,
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
test('15 technologies, exactly five per branch, unique IDs', () => {
  assert.equal(CARDS.length, 15);
  for (const b of ['industry', 'transport', 'food'])
    assert.equal(CARDS.filter((c) => c.branch === b).length, 5);
  assert.equal(new Set(CARDS.map((c) => c.id)).size, 15);
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
  g = applyAction(g, { type: 'research', id: 'drill' });
  assert.equal(g.players[0].resources.science, 27);
  assert.equal(g.players[0].investments, 1);
  assert.throws(() => applyAction(g, { type: 'research', id: 'drill' }));
  g = applyAction(g, { type: 'research', id: 'rotation' });
  assert.throws(() => applyAction(g, { type: 'research', id: 'roads' }));
});
test('specialized stock is shared and prerequisites are enforced', () => {
  let g = invest();
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
  g = applyAction(g, { type: 'pass' });
  g = applyAction(g, { type: 'pass' });
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
  g = applyAction(g, { type: 'pass' });
  g = applyAction(g, { type: 'pass' });
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
