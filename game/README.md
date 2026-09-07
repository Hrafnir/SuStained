# Sustained — playable Tier I prototype

Norwegian local hotseat board game for 2–5 people. Eight rounds, 15 historically grounded technologies (five industry, five transport, five food), a 4×4 land board, worker allocation, research, construction, limited trading, population growth, food upkeep and final scoring.

## Run

Node.js 24 or later:

```sh
npm ci
npm run dev
```

## Verify and export

```sh
npm run typecheck
npm test
GITHUB_PAGES=true npm run build
```

The static export is `dist/client/`. The GitHub Pages path is `/SuStained/`; local development uses `/`. The repository workflow tests and publishes pushes to `main`.

## Rules and persistence

The in-game rulebook documents the complete prototype. `lib/game.ts` is the shared rule engine and card data. Actions validate before mutating a cloned state. Saves are versioned JSON, validated on import and stored locally in the browser; they are not uploaded to a server. Export a save to move it to another device. Undo history is session-local.

## Scope of version 0.1

This is the first playable milestone, not the completed two-phase campaign. Tier II, Tier III, cooperative phase, online multiplayer, full balancing and final physical production remain on the roadmap. All people share one device. Historical sources are linked on the technology cards. Dates describe specific inventions or periods of adoption; rule effects are documented game abstractions. Artwork represents environments rather than exact museum objects.

## Assets

`public/art/valley.png` and `public/art/atlas.png` were generated with built-in ImageGen. The atlas provides nine coherent illustrated environments. Card typography, costs and rules remain editable separately from the art. See `design/art-prompts.md` for prompts. The print stylesheet provides a draft 63×102 mm card layout; this is not a laser-ready production file.

The optional WebMCP interface exposes `read_game` and `play_game_action` through the same engine. Unsupported browsers skip registration. Both tools were verified in the local browser: a legal action changed the shared state and an illegal tile placement failed without mutation.
