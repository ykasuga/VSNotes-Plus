const vscode = require('vscode');
const path = require('path');
const utils = require('./utils');

class FileLinkProvider {
  provideDocumentLinks(document, token) {
    const links = [];
    const text = document.getText();
    const linkPattern = /\[\[([^\]]+)\]\]/g;
    let match;

    while ((match = linkPattern.exec(text)) !== null) {
      const linkText = match[1];
      const startPos = document.positionAt(match.index + 2);
      const endPos = document.positionAt(match.index + 2 + linkText.length);
      const range = new vscode.Range(startPos, endPos);
      const noteFolder = vscode.workspace.getConfiguration('vsnotes').get('defaultNotePath');
      const root = utils.resolveHome(noteFolder);
      const files = utils.walk(root);
      const targetFile = files.find(file => path.basename(file, '.md') === linkText);

      if (targetFile) {
        const uri = vscode.Uri.file(targetFile);
        const link = new vscode.DocumentLink(range, uri);
        links.push(link);
      }
    }
    return links;
  }
}

module.exports = FileLinkProvider;
