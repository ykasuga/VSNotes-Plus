# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

VSNotes-Plus is a VS Code extension (plain JavaScript, CommonJS modules, no TypeScript compilation step). The entry point is [`extension.js`](extension.js) at the root — not under `src/`.

## Commands

```bash
npm run lint          # ESLint only
npm test              # Run tests via @vscode/test-cli (requires VS Code instance)
npm run testByElectron # Alternative: run tests via @vscode/test-electron
```

### Single test / test file

There is no built-in mechanism to run a single test. All `*.test.js` files under `test/suite/` are collected automatically by [`test/suite/index.js`](test/suite/index.js). Tests use Mocha `tdd` UI (`suite`/`test`, not `describe`/`it`).

Test configuration is in [`.vscode-test.js`](.vscode-test.js): it looks for compiled files at `out/test/**/*.test.js`. When using `npm test` (`@vscode/test-cli`), tests must be under `out/`, but the repo has no build step — `npm run testByElectron` uses the source files directly via [`test/runTest.js`](test/runTest.js).

## Architecture

- [`extension.js`](extension.js) — registers all VS Code commands and providers on activation
- [`src/treeView.js`](src/treeView.js) — single `VSNotesTreeView` class drives the sidebar (Files / Tags / Tasks sections)
- [`src/getTasks.js`](src/getTasks.js) — exports `patternTask`, `getTaskNode`, `getTasks`; constants for groupBy/prefix modes are exported and used directly in tests
- [`src/utils.js`](src/utils.js) — exports `resolveHome` (handles `~/` prefix) and `walk`; used across the codebase for path resolution
- [`src/note.js`](src/note.js) — note creation uses `fs-extra`'s `ensureFile` (creates parent dirs automatically); token replacement (`{title}`, `{dt}`, `{ext}`) via `replaceTokens`

## Code Style

- **CommonJS only** (`require`/`module.exports`); `jsconfig.json` targets ES6 but source type is `module` in ESLint (`.eslintrc.json`) — mixed config, do not change
- All ESLint rules are set to `warn`, never `error`; the linter will not block builds
- `vscode.workspace.getConfiguration('vsnotes')` is called fresh inside each function — not cached at module level
- `listTasks` command is commented out in `extension.js` (intentionally disabled)

## Key Patterns

- Task node shape: `{ type: "task", task, group, path, line, state }` — `state` is boolean (true = completed)
- Task regex: `/\s*-\s+\[([xX\s]{1})\]\s+(.+)/i` — match[1] is checkbox char, match[2] is task text
- Prefix pattern (for grouping): `/(?:([^:]+):\s)*(.+)/i` — "Prefix: Task name" splits on first `:`
- When `isCommand=true` is passed to `getTasks()`, groupBy and prefix are always forced to `"flat"` and `"ignore"` regardless of config
- TreeView icon paths use `path.join(__filename, "..", "..", "media", ...)` — `__filename` is the `.js` file itself, so two levels up reaches the project root

## Testing

- Test data lives in [`test/suite/test-data.js`](test/suite/test-data.js) — shared fixtures across all test files
- Tests call `getTaskNode` directly (pure function, no VS Code API needed for unit tests)
- The `vscode` module is imported in test files for `showInformationMessage` only — actual assertions are pure
