# Repository Guidelines

## Project Structure & Module Organization
- Core TypeScript lives in `src/` (main process, agent system, browser, editor, UI). Add new modules under the closest domain folder.
- Extensions go in `extensions/`; shared assets (icons, packaging files) in `resources/`; build tooling in `build/` and helper scripts in `scripts/`.
- Tests belong in `test/` and run from compiled output under `out/`. Keep fixtures beside the specs they serve.

## Build, Test, and Development Commands
- `npm install` — install dependencies (Node 18+/npm 9+)
- `npm run build` — type-check and emit JS to `out/`
- `npm run watch` — incremental build on file changes
- `npm run lint` / `npm run lint:fix` — ESLint over `src/**/*.ts` with optional fixes
- `npm run format` / `npm run format:check` — Prettier write/check for `src/**/*.ts`
- `npm test` — runs pretest chain (`build` + `lint`) then executes compiled tests via `out/test/runTest.js`
- `npm run dev` — launch Electron app from `out/main.js` (after build/watch)

## Coding Style & Naming Conventions
- TypeScript-first, ESNext modules. Prefer 2-space indentation; single quotes unless tooling changes them.
- Keep functions small; place helpers in their domain folder (`agent/`, `browser/`, etc.).
- Use descriptive names (`getActiveAgent`, `AgentSessionStore`); avoid cryptic abbreviations.
- Let Prettier/ESLint settle formatting; do not hand-format around tool output.

## Testing Guidelines
- Place specs under `test/` mirroring source paths (`src/agent/session.ts` → `test/agent/session.test.ts`).
- Favor fast, deterministic tests; mock network/browser surfaces when needed.
- Document skips; aim for coverage on new code paths.
- Run `npm test` before pushing; for quick checks, run `npm run build` then targeted specs.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`).
- Keep commits small and reversible; avoid mixing refactors with feature work.
- PRs (internal only) should note: summary, rationale, tests run (`npm test`/`lint`), and UI/workflow impacts. Link tracking issues when relevant.
- Avoid committing generated artifacts (`out/`, `dist/`); keep `package-lock.json` in sync after dependency changes.

## Security & Configuration Tips
- Follow `SECURITY.md`; report vulnerabilities privately.
- Use the `build` config in `package.json` for packaging; never embed secrets. Keep environment values outside the repo and document required env vars in PRs.
