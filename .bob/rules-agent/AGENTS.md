# Project Coding Rules (Non-Obvious Only)

- **No build step**: Source files in `src/` are run directly. Do NOT add a compile/transpile step.
- **CommonJS only**: All files use `require`/`module.exports`. Do not use ES module `import`/`export`.
- **`fs-extra` for file ops**: Use `fs-extra` (already a dependency) for file creation — `fs.ensureFile()` creates parent directories automatically. Raw `fs` is used only for reads/stats.
- **Config always re-read**: Call `vscode.workspace.getConfiguration('vsnotes')` inside each function, never at module scope. Config may change between calls.
- **`resolveHome` is mandatory**: Any path from `vsnotes.defaultNotePath` config must be passed through `resolveHome()` from [`src/utils.js`](../../src/utils.js) before use — it handles `~/` prefixes.
- **Exported constants for tests**: Logic constants in [`src/getTasks.js`](../../src/getTasks.js) (`groupByFlat`, `prefixIgnore`, etc.) must remain exported — tests import and use them directly.
- **`listTasks` is intentionally disabled**: The `vsnotes.listTasks` command and its import are commented out in [`extension.js`](../../extension.js). Do not re-enable without checking the full intent.
- **TreeView icon paths**: Icons use `path.join(__filename, "..", "..", "media", ...)` — this is correct because `__filename` points to the `.js` file and two `..` levels reach the project root.
