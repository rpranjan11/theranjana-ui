# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **multi-app monorepo** ("App Store" pattern): a single React codebase that hosts several
independent mini-apps under one domain, dispatched by URL path prefix. The apps are:

| Path prefix     | App           | Source dir          | What it is |
| --------------- | ------------- | ------------------- | ---------- |
| `/portfolio`    | Portfolio     | `src/portfolio/`    | Personal portfolio site backed by Firebase Realtime Database |
| `/confer`       | Confer        | `src/confer/`       | Real-time presenter↔audience messaging over WebSocket (admin pushes topics/messages, audience receives live) |
| `/demo`         | Demo          | `src/demo/`         | Older/simpler prototype of Confer's admin+audience WebSocket flow |
| `/llmchatbot`   | LLM Chatbot   | `src/llmchatbot/`   | Chat UI (with PDF upload) that calls an external LLM HTTP API via axios |
| _(default)_     | HomePage      | `src/HomePage.js`   | The "App Store" landing grid linking to all apps |

## Commands

```bash
npm start            # CRA dev server at http://localhost:3000 (primary dev workflow)
npm run build        # CRA production build → build/  (this is what gets deployed)
npm test             # Jest + React Testing Library in watch mode
node ./src/confer/server/server.js   # Start the Confer WebSocket server on :8080 (HOST/PORT overridable)
```

Run a single test once (non-watch): `CI=true npm test -- --testPathPattern="App.test"`.
There is currently one test file: `src/portfolio/App.test.js`.

Lint runs as part of `react-scripts` (config in `package.json` → `eslintConfig`, extends `react-app`); there is no standalone lint script.

## Two build systems coexist — know which you're using

1. **Create React App (`react-scripts`) — the active/default path.** `npm start` / `npm run build` /
   `npm test` all use CRA with a **single entry point `src/index.js`**, producing one SPA bundle. This is
   what `firebase.json` deploys (`build/`). **Use this for normal development.**

2. **Custom Webpack (`webpack.config.js`) — alternative multi-bundle build, build-only.** Run with
   `npx webpack --config webpack.config.js` → emits a separate `[name].bundle.js` + HTML file per app
   (`portfolio.html`, `confer.html`, etc.) into `dist/`. Note its `devServer` block uses webpack-4
   `contentBase` syntax while webpack 5 is installed, so `webpack serve` is not expected to work — treat
   this flow as build-only. `dist/` is gitignored and not the deploy target.

If you add or rename a top-level app, you must update **both** `src/index.js` (the runtime dispatcher)
**and** `webpack.config.js` (`entry` + a matching `HtmlWebpackPlugin`) to keep the two systems in sync.

## Routing model (two layers)

Routing happens in two stages — this is the central architectural concept:

1. **Top-level path dispatch** in `src/index.js`: reads `window.location.pathname` and mounts exactly one
   app component (`ConferApp`, `DemoApp`, `LLMChatbot`, `Portfolio`, or `HomePage`). This is plain
   `if/else`, not React Router.
2. **Per-app React Router** inside each app. Each app owns its routes and sets its own basename, e.g.
   portfolio uses `<BrowserRouter basename="/portfolio">`; confer matches full paths like
   `/confer/profile/admin/*`. Because routes are absolute-path-prefixed, the prefix in `src/index.js` and
   the routes inside each app must agree.

Production SPA fallback (serve `index.html` for all paths) is configured **redundantly** for multiple
hosts: `firebase.json` rewrites, `public/_redirects` (Netlify-style), and `static.json`.

## Confer real-time architecture

- **Server** (`src/confer/server/`) is a standalone Node `ws` server, run separately from the React app.
  All state is **in-memory and non-persisted**: `sessionManager.js` enforces a **single active admin** at a
  time (audiences tracked in a `Map`, 30-min admin inactivity timeout, session transfer flow);
  `messageStore.js` holds the current topic's messages. Restarting the server wipes all state.
- **Client** state lives in `src/confer/profile/shared/WebSocketContext.js` — a React context
  (`WebSocketProvider` / `useWebSocket`) that owns the WebSocket connection, auto-reconnect, heartbeat, and a
  large `switch` over message `type`s (`push_message`, `topic_update`, `clear_messages`, `admin_*`, etc.).
  Both client and server must agree on these message-type strings.
- **Admin auth is client-side only**: `AdminAuth.js` compares the entered value to the build-time env var
  `REACT_APP_CONFER_ADMIN_CREDENTIAL` (baked into the bundle). Treat this as a soft gate, not real security.
- **Two config files exist** for the WebSocket URL. The live one imported by `WebSocketContext` is
  `src/confer/config/wsConfig.js` (uses `REACT_APP_CONFER_SERVER_ENV` / `REACT_APP_CONFER_API_HOST_URL` /
  `REACT_APP_CONFER_API_HOST` / `REACT_APP_CONFER_API_PORT`). The other, `src/confer/config.js` (uses
  `REACT_APP_WS_HOST` / `REACT_APP_WS_PORT` / `REACT_APP_CONFER_API_WS_URL`), appears legacy — prefer
  `config/wsConfig.js` when changing connection logic.
- Per-topic presentation content lives under `src/confer/confer_topic/<topic>/` (images +
  `data/predefinedMessages.js`).

## Portfolio + Firebase

- `src/portfolio/firebase/userContext.js` initializes Firebase and exposes a `FirebaseProvider` /
  `useFirebase` context with read helpers (`getProjects`, `getExperiences`, `getCertifications`,
  `getUsersBio`, `getVideos`, …) over the Realtime Database. The portfolio is **read-only at runtime**;
  content is authored directly in the Firebase database.
- `database.rules.json` grants **public read** but restricts write to a single hardcoded admin UID. The
  Firebase Hosting project is `pkr-space` (`.firebaserc`); deploy via `firebase deploy` after `npm run build`.

## Environment variables

All client config comes from `REACT_APP_*` env vars (a gitignored `.env` at the repo root; CRA inlines them
at build time, so none are secret in the shipped bundle). The vars actually referenced in code:

- **Firebase (portfolio):** `REACT_APP_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_DATABASE_URL`, `_PROJECT_ID`,
  `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID`, `_MEASUREMENT_ID`
- **Confer (client):** `REACT_APP_CONFER_SERVER_ENV`, `REACT_APP_CONFER_API_HOST_URL`,
  `REACT_APP_CONFER_API_HOST`, `REACT_APP_CONFER_API_PORT`, `REACT_APP_CONFER_ADMIN_CREDENTIAL`
- **Confer (server):** `HOST`, `PORT`
- **Demo:** `REACT_APP_DEMO_API_WS_URL`
- **LLM Chatbot:** `REACT_APP_LLMCHATBOT_API_URL` (base URL; the app POSTs `/uploadpdf` and GETs chat responses)

Note: `README.md` lists some differently-named vars (e.g. `REACT_APP_CONFER_SOCIALCUSTOMS_*`) that no longer
match the code — trust the names referenced in source over the README.

## Conventions

- Each app folder is self-contained: its own `App.js`, `index.js`, CSS, `components/`, and (where relevant)
  `pages/`. Keep new code within the owning app's directory.
- Styling is plain CSS imported per-component, plus Bootstrap / react-bootstrap and icon fonts
  (FontAwesome, Bootstrap Icons). There is no CSS-in-JS or design-system layer.
- `react-helmet` sets per-app `<title>` (e.g. "Confer | TheRanjana").

## Hard rules

- **Code Guardrails:** After every edit, run the build, run the test, and run the type check. If anything fails, treat it as a blocker and fix it before moving on.
- **Commits:** Conventional format `<type>: <subject>` (`feat|fix|refactor|chore|infra|docs|test`), imperative, lowercase, ≤72 chars, no trailing period, no Claude attribution.