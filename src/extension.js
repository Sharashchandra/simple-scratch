const vscode = require("vscode");
const newScratch = require("./newScratch.js");
const modifyScratch = require("./modifyScratch.js");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "simple-scratch" is now active!'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("simple-scratch.newScratch", newScratch)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "simple-scratch.openScratch",
      modifyScratch.openScratch
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "simple-scratch.deleteScratch",
      modifyScratch.deleteScratch
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "simple-scratch.bulkDeleteScratch",
      modifyScratch.bulkDeleteScratch
    )
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
