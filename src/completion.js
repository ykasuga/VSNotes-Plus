const vscode = require('vscode');
const path = require('path');
const utils = require('./utils');

class CompletionProvider {
  provideCompletionItems(document, position, token, context) {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    if (!linePrefix.endsWith('[[')) {
      return undefined;
    }

    const noteFolder = vscode.workspace.getConfiguration('vsnotes').get('defaultNotePath');
    if (!noteFolder) {
      return undefined;
    }
    const root = utils.resolveHome(noteFolder);
    const files = utils.walk(root);

    return files.map(file => {
      const fileName = path.basename(file, '.md');
      return new vscode.CompletionItem(fileName, vscode.CompletionItemKind.File);
    });
  }
}

module.exports = CompletionProvider;
