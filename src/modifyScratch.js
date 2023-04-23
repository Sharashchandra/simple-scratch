const vscode = require("vscode");
const utils = require("./utils.js");

class ModifyScratch {
  constructor({ context }) {
    this._scratchUri = undefined;
    this.context = context;
  }

  async getScratchUri() {
    if (this._scratchUri === undefined) {
      this._scratchUri = await utils.getScratchPath({ context: this.context });
      return this._scratchUri;
    }
    return this._scratchUri;
  }

  async chooseFile({ allowMultipleSelect }) {
    let allFiles;
    try {
      allFiles = await utils.listFiles({
        scratchUri: await this.getScratchUri(),
      });
    } catch (err) {
      vscode.window.showErrorMessage(
        "There are no scratch files in this workspace, check the simple-scratch.scratchFolderName or simple-scratch.globalScratchFolderName value"
      );
      return;
    }
    if (!allFiles || allFiles.length == 0) {
      vscode.window.showErrorMessage(
        "There are no scratch files in this workspace, check the simple-scratch.scratchFolderName or simple-scratch.globalScratchFolderName value"
      );
      return;
    }
    const selected = await vscode.window.showQuickPick(allFiles, {
      placeHolder: "Select a file",
      canPickMany: allowMultipleSelect,
    });

    if (typeof selected === "string") {
      return [selected];
    } else {
      return selected;
    }
  }

  async getTargetFileUris({ allowMultipleSelect }) {
    let chosenFileNames = await this.chooseFile({
      allowMultipleSelect: allowMultipleSelect,
    });
    if (chosenFileNames && chosenFileNames.length > 0) {
      console.log(`${chosenFileNames} are the chosen one(s) to be modified`);
      let scratchUri = await this.getScratchUri();
      let files = [];
      for (const _fName of chosenFileNames) {
        let fileUri = vscode.Uri.parse(
          `${scratchUri.path.toString()}/${_fName}`
        );
        files.push(fileUri);
      }
      return files;
    }
    return;
  }
}

class OpenScratch extends ModifyScratch {
  constructor({ context }) {
    super({ context: context });
  }

  async openScratch() {
    let fileUris = await super.getTargetFileUris({
      allowMultipleSelect: false,
    });
    if (fileUris && fileUris.length > 0) {
      for (const _fUri of fileUris) {
        await utils.openFile({ filePath: _fUri });
      }
    }
    return;
  }
}

class DeleteScratch extends ModifyScratch {
  constructor({ context }) {
    super({ context: context });
  }

  async deleteScratch({ isBulkDelete }) {
    let fileUris = await super.getTargetFileUris({
      allowMultipleSelect: isBulkDelete,
    });
    if (fileUris) {
      const confirmation = await vscode.window.showQuickPick(["yes", "no"], {
        placeHolder: "Confirm deletion?",
      });
      if (confirmation === "yes") {
        for (const _fUri of fileUris) {
          await vscode.workspace.fs.delete(_fUri);
        }
      }
    }
    return;
  }

  async bulkDeleteScratch() {
    this.deleteScratch({ isBulkDelete: true });
  }
}

module.exports = {
  OpenScratch,
  DeleteScratch,
};
