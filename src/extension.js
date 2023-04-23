const vscode = require("vscode");
const createScratch = require("./createScratch.js");
const modifyScratch = require("./modifyScratch.js");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "simple-scratch" is now active!'
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("simple-scratch.newScratch", async () =>
      new createScratch.CreateScratch().newScratch()
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("simple-scratch.openScratch", async () =>
      new modifyScratch.OpenScratch().openScratch()
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("simple-scratch.deleteScratch", async () =>
      new modifyScratch.DeleteScratch().deleteScratch({
        isBulkDelete: false,
      })
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "simple-scratch.bulkDeleteScratch",
      async () => new modifyScratch.DeleteScratch().bulkDeleteScratch()
    )
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
