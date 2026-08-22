const vscode = require("vscode");
const path = require("path");
const { getNotes } = require("./getNotes");
const { getTags } = require("./getTags");
const { getTasks } = require("./getTasks");
const { resolveHome } = require("./utils");

class VSNotesTreeView {
  constructor() {
    const config = vscode.workspace.getConfiguration("vsnotes");
    this.baseDir = resolveHome(config.get("defaultNotePath") || "");
    const ignorePatterns = config.get("ignorePatterns") || [];
    this.ignorePattern = new RegExp(
      ignorePatterns
        .map(function (pattern) { return "(" + pattern + ")"; })
        .join("|") || "(?!x)x");
    this.hideTags = config.get("treeviewHideTags") || false;
    this.hideTasks = config.get("treeviewHideTasks") || false;
    this.hideFiles = config.get("treeviewHideFiles") || false;


    this.emitter = new vscode.EventEmitter();
    this.onDidChangeTreeData = this.emitter.event;

    // let fileWatcher = vscode.workspace.createFileSystemWatcher(this.baseDir);
    // fileWatcher.onDidChange(() => {
    //   this.refresh();
    // });
  }

  refresh() {
    this.emitter.fire();
  }

  goto(node) {
    if (node.path === undefined) return;
    vscode.workspace.openTextDocument(node.path).then(document => {
      vscode.window.showTextDocument(document).then(editor => {
        let pos = new vscode.Position(node.line, 0);
        editor.selection = new vscode.Selection(pos, pos);
        editor.revealRange(new vscode.Range(pos, pos));
      }
      );
    });
  }

  getChildren(node) {
    if (node) {
      switch (node.type) {
        case "rootTag":
          if (!this.baseDir) return Promise.resolve([]);
          return getTags(this.baseDir).catch(() => []);
        case "rootTask":
          if (!this.baseDir) return Promise.resolve([]);
          return getTasks(this.baseDir).catch(() => []);
        case "rootFile":
          if (!this.baseDir) return Promise.resolve([]);
          return getNotes(this.baseDir).catch(() => []);
        case "tag":
          const children = node.children || [];
          const files = node.files || [];
          return Promise.resolve([...children, ...files]);
        case "taskGroup":
          return Promise.resolve(node.tasks && node.tasks.length > 0 ? node.tasks : []);
        case "task":
          return Promise.resolve([]);
        case "file":
          return getNotes(node.path).catch(() => []);
      }
    } else {
      const treeview = [];
      if (!this.hideFiles) {
        treeview.push({
          type: "rootFile",
        });
      }
      if (!this.hideTags) {
        treeview.push({
          type: "rootTag",
        });
      }
      if (!this.hideTasks) {
        treeview.push({
          type: "rootTask",
        });
      }
      return treeview;
    }
  }

  getTreeItem(node) {
    switch (node.type) {
      case "rootTag":
        let rootTagTreeItem = new vscode.TreeItem("Tags", vscode.TreeItemCollapsibleState.Expanded);
        rootTagTreeItem.contextValue = "rootTag";
        rootTagTreeItem.iconPath = {
          light: path.join(__filename, "..", "..", "media", "light", "tag.svg"),
          dark: path.join(__filename, "..", "..", "media", "dark", "tag.svg"),
        };
        return rootTagTreeItem;
      case "rootTask":
        let rootTaskTreeItem = new vscode.TreeItem("Tasks", vscode.TreeItemCollapsibleState.Expanded);
        rootTaskTreeItem.contextValue = "rootTask";
        rootTaskTreeItem.iconPath = {
          light: path.join(__filename, "..", "..", "media", "light", "tasks.svg"),
          dark: path.join(__filename, "..", "..", "media", "dark", "tasks.svg"),
        };
        return rootTaskTreeItem;
      case "rootFile":
        let rootFileTreeItem = new vscode.TreeItem("Files", vscode.TreeItemCollapsibleState.Expanded);
        rootFileTreeItem.contextValue = "rootFile";
        rootFileTreeItem.iconPath = {
          light: path.join(__filename, "..", "..", "media", "light", "file-directory.svg"),
          dark: path.join(__filename, "..", "..", "media", "dark", "file-directory.svg"),
        };
        return rootFileTreeItem;
      case "tag":
        const tagState = node.children
          ? vscode.TreeItemCollapsibleState.Collapsed
          : vscode.TreeItemCollapsibleState.None;
        let tagTreeItem = new vscode.TreeItem(
          node.tag,
          node.files && node.files.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : tagState
        );
        tagTreeItem.contextValue = "tag";
        tagTreeItem.iconPath = {
          light: path.join(__filename, "..", "..", "media", "light", "tag.svg"),
          dark: path.join(__filename, "..", "..", "media", "dark", "tag.svg"),
        };
        return tagTreeItem;
      case "taskGroup":
        let taskGroupTreeItem = new vscode.TreeItem(
          node.group,
          vscode.TreeItemCollapsibleState.Collapsed
        );
        taskGroupTreeItem.contextValue = "taskGroup";
        taskGroupTreeItem.iconPath = {
          light: path.join(__filename, "..", "..", "media", "light", "group.svg"),
          dark: path.join(__filename, "..", "..", "media", "dark", "group.svg"),
        };
        return taskGroupTreeItem;
      case "task":
        let taskTreeItem = new vscode.TreeItem(
          node.task,
          vscode.TreeItemCollapsibleState.None
        );
        taskTreeItem.contextValue = "task";

        taskTreeItem.command = {
          command: "vsnotes.gotoTask",
          title: "",
          arguments: [node]
        };

        let icon = node.state ? "completed.svg" : "task.svg";
        taskTreeItem.iconPath = {
          light: path.join(__filename, "..", "..", "media", "light", icon),
          dark: path.join(__filename, "..", "..", "media", "dark", icon),
        };
        return taskTreeItem;
      case "file":
        const isDir = node.stats.isDirectory();
        const state = isDir
          ? vscode.TreeItemCollapsibleState.Collapsed
          : vscode.TreeItemCollapsibleState.None;
        let fileTreeItem = new vscode.TreeItem(node.file, state);
        fileTreeItem.contextValue = isDir ? "files-directory" : "files-file";
        fileTreeItem.iconPath = {
          light: path.join(__filename, "..", "..", "media", "light", isDir ? "file-directory.svg" : "file.svg"),
          dark: path.join(__filename, "..", "..", "media", "dark", isDir ? "file-directory.svg" : "file.svg"),
        };
        if (!isDir) {
          fileTreeItem.command = {
            command: "vscode.open",
            title: "",
            arguments: [vscode.Uri.file(node.path)],
          };
        }
        return fileTreeItem;
    }
  }
}

module.exports = VSNotesTreeView;
