# Game Time XO

A local two-player tic-tac-toe game with turn indicators, win/draw detection, round reset, and a session scoreboard for X, O, and draws.

Built with React, TypeScript, TanStack Start, Vite, and Tailwind CSS. This project is connected to Lovable; preserve published Git history when updating it.

## Development

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Use `npm run build` for a production build and `npx tsc --noEmit` for the TypeScript check. Dependencies are also tracked in `bun.lock`; avoid committing an additional npm lockfile when using npm locally.

Scores live in page state and reset when the page reloads. Multiplayer networking and persistent accounts are not part of the current game.
