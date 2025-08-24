const vscode = require('vscode');
const path = require('path');
const utils = require('./utils');
const { getTags } = require('./getTags');

class CompletionProvider {
  async provideCompletionItems(document, position, token, context) {
    // Note completion
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    if (linePrefix.endsWith('[[')) {
      const noteFolder = vscode.workspace.getConfiguration('vsnotes').get('defaultNotePath');
      if (!noteFolder) return undefined;
      const root = utils.resolveHome(noteFolder);
      const files = utils.walk(root);
      return files.map(file => {
        const fileName = path.basename(file, '.md');
        return new vscode.CompletionItem(fileName, vscode.CompletionItemKind.File);
      });
    }

    // Tag completion
    if (this.isInsideTags(document, position)) {
      const noteFolder = vscode.workspace.getConfiguration('vsnotes').get('defaultNotePath');
      if (!noteFolder) return undefined;
      const root = utils.resolveHome(noteFolder);
      const tagsInNote = await getTags(root, true);
      const allTags = Object.keys(tagsInNote);
      return allTags.map(tag => new vscode.CompletionItem(tag, vscode.CompletionItemKind.Keyword));
    }

    return undefined;
  }

  isInsideTags(document, position) {
    // Check for front matter
    if (document.lineCount < 2 || document.lineAt(0).text !== '---') {
      return false;
    }

    let inFrontMatter = true;
    let inTagsContext = false;

    // Iterate through lines to determine the context of the cursor position
    for (let i = 1; i <= position.line; i++) {
      const line = document.lineAt(i);

      if (inFrontMatter) {
        // Check for the end of front matter
        if (line.text === '---') {
          inFrontMatter = false;
          break;
        }

        // Check if the line defines a new key (assumes keys are not indented)
        if (/^\S/.test(line.text)) {
          if (line.text.startsWith('tags:')) {
            inTagsContext = true;
          } else {
            inTagsContext = false;
          }
        }
      }
    }

    // Completion should only be provided if the cursor is within the front matter and in the tags context
    return inFrontMatter && inTagsContext;
  }
}

module.exports = CompletionProvider;
