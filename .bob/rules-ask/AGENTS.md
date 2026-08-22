# Project Documentation Context (Non-Obvious Only)

- **Extension entry point is root-level**: `extension.js` is at the project root, not in `src/`. All command registrations are there.
- **`src/` is pure business logic**: Files in `src/` export functions/classes but register nothing with VS Code themselves — all VS Code API wiring is in `extension.js`.
- **Two test runners exist**: `npm test` uses `@vscode/test-cli` (looks for `out/test/**`), `npm run testByElectron` uses `@vscode/test-electron` (uses source directly). There is no TypeScript compilation, so `npm test` may fail if no `out/` directory exists.
- **Task prefix syntax**: In notes, `"Prefix: Task name"` (colon+space) triggers the prefix grouping feature. This is not documented in README but is the actual regex behavior in [`src/getTasks.js`](../../src/getTasks.js).
- **TreeView sections are independently hideable**: `treeviewHideTags`, `treeviewHideTasks`, `treeviewHideFiles` in config each independently remove a sidebar section, but **require application restart** to take effect.
