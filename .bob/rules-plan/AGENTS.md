# Project Architecture Constraints (Non-Obvious Only)

- **Single-file command registration**: All VS Code commands must be registered in [`extension.js`](../../extension.js). Source modules in `src/` are stateless and export pure functions or classes — they do not self-register.
- **TreeView node types are a closed set**: `VSNotesTreeView.getTreeItem()` switches on `node.type` with no default/fallback. Adding a new type requires updates to both `getChildren()` and `getTreeItem()` in [`src/treeView.js`](../../src/treeView.js).
- **Task grouping is post-processing**: `getTasks()` collects all tasks into a flat map keyed by group, then transforms to the tree structure at the end. The group key `"root"` (constant `defaultGroup`) is the ungrouped fallback.
- **`isCommand` flag changes behavior silently**: When `getTasks(path, isCommand=true)` is called from a command (not the treeview), groupBy and prefix are hardcoded to `"flat"`/`"ignore"` — settings are ignored. This is intentional but not obvious.
- **No webview**: This extension uses only the TreeView API and VS Code commands — there is no webview panel. All UI is native VS Code (QuickPick, InputBox, TreeDataProvider).
- **File watching is disabled**: The file watcher in `VSNotesTreeView` constructor is commented out. Manual `vsnotes.refresh` command is the only way to update the tree.
