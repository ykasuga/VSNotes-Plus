const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const { newNote, newNoteInWorkspace, delNote } = require('./src/note');
const listNotes = require('./src/listNotes');
const listTags = require('./src/listTags');
//const listTasks = require('./src/listTasks');
const setupNotes = require('./src/setupNotes');
const VSNotesTreeView = require('./src/treeView');
const commitPush = require('./src/commitPush');
const pull = require('./src/pull');
const search = require('./src/search');
const utils = require('./src/utils');
const FileLinkProvider = require('./src/fileLink');
const CompletionProvider = require('./src/completion');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  const tv = new VSNotesTreeView();
  vscode.window.registerTreeDataProvider('vsnotes', tv);

  // Refresh View
  vscode.commands.registerCommand('vsnotes.refresh', () => tv.refresh());

  // Go to
  vscode.commands.registerCommand('vsnotes.gotoTask', (item) => tv.goto(item));

  // Create a new directory
  const newDirectory = (node) => {
    let parentPath;
    if (node && node.path) {
      parentPath = node.path;
    } else {
      const noteFolder = vscode.workspace.getConfiguration('vsnotes').get('defaultNotePath');
      parentPath = utils.resolveHome(noteFolder);
    }

    vscode.window.showInputBox({
      prompt: 'Enter the name of the new directory'
    }).then(dirName => {
      if (dirName) {
        const newDirPath = path.join(parentPath, dirName);
        fs.mkdirSync(newDirPath);
        tv.refresh();
      }
    });
  };
  let newDirectoryDisposable = vscode.commands.registerCommand('vsnotes.newDirectory', newDirectory);
  context.subscriptions.push(newDirectoryDisposable);

  // Create a new note
  let newNoteDisposable = vscode.commands.registerCommand('vsnotes.newNote', newNote);
  context.subscriptions.push(newNoteDisposable);

  // Create a new note in a current workspace
  let newNoteInWorkspaceDisposable = vscode.commands.registerCommand('vsnotes.newNoteInWorkspace', newNoteInWorkspace);
  context.subscriptions.push(newNoteInWorkspaceDisposable);

  // Delete a note
  let delNoteDisposable = vscode.commands.registerCommand('vsnotes.delNote', delNote);
  context.subscriptions.push(delNoteDisposable);

  // Open a note
  let listNotesDisposable = vscode.commands.registerCommand('vsnotes.listNotes', listNotes);
  context.subscriptions.push(listNotesDisposable);

  // List tags
  let listTagsDisposable = vscode.commands.registerCommand('vsnotes.listTags', listTags);
  context.subscriptions.push(listTagsDisposable);

  // List tasks
  //let listTasksDisposable = vscode.commands.registerCommand('vsnotes.listTasks', listTasks);
  //context.subscriptions.push(listTasksDisposable);

  // Run setup
  let setupDisposable = vscode.commands.registerCommand('vsnotes.setupNotes', setupNotes);
  context.subscriptions.push(setupDisposable);

  // Commit and Push
  let commitPushDisposable = vscode.commands.registerCommand('vsnotes.commitPush', commitPush);
  context.subscriptions.push(commitPushDisposable);

  let pullDisposable = vscode.commands.registerCommand('vsnotes.pull', pull);
  context.subscriptions.push(pullDisposable);

  // Search
  let searchDisposable = vscode.commands.registerCommand('vsnotes.search', search, { context: context });
  context.subscriptions.push(searchDisposable);

  // Open note folder in new workspace
  let openNoteFolderDisposable = vscode.commands.registerCommand('vsnotes.openNoteFolder', () => {
    const noteFolder = vscode.workspace.getConfiguration('vsnotes').get('defaultNotePath');
    const folderPath = utils.resolveHome(noteFolder);
    const uri = vscode.Uri.file(folderPath);
    return vscode.commands.executeCommand('vscode.openFolder', uri, true);
  });
  context.subscriptions.push(openNoteFolderDisposable);

  // file link
  const fileLinkProvider = new FileLinkProvider();
  const disposable = vscode.languages.registerDocumentLinkProvider(
    { language: 'markdown' },
    fileLinkProvider
  );
  context.subscriptions.push(disposable);

  // completion
  const completionProvider = new CompletionProvider();
  const completionDisposable = vscode.languages.registerCompletionItemProvider(
    { language: 'markdown' },
    completionProvider,
    '['
  );
  context.subscriptions.push(completionDisposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
}
