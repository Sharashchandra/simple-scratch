const vscode = require("vscode");
const utils = require("./utils.js");
const constants = require("./constants.js");

class CreateScratch {
  constructor({context}) {
    this._scratchUri = undefined;
    this.context = context;
  }

  async getScratchUri() {
    if (this._scratchUri === undefined) {
      this._scratchUri = await utils.getScratchPath({context: this.context});
      return this._scratchUri;
    }
    return this._scratchUri;
  }

  async createFolder() {
    let scratchUri = await this.getScratchUri();
    await vscode.workspace.fs.createDirectory(scratchUri);
    return;
  }

  async getFileExtension() {
    const allExtensions = await utils.getAllSupportedFileExtensions();
    const selectedExtension = await vscode.window.showQuickPick(
      Object.keys(allExtensions),
      { placeHolder: "Select file extension" }
    );
    return allExtensions[selectedExtension];
  }

  async getFileName({ fileExtension }) {
    const defaultFileName = await utils.getDefaultFileName(); // Need to modify
    let scratchFileName = await vscode.window.showInputBox({
      placeHolder: `${defaultFileName}${fileExtension} (default)`,
      validateInput: text => {
        const re = new RegExp(constants.VALID_FILENAME_REGEX);
        return text === "" || re.test(text) ? null : "Invalid filename"
      }
    });
    if (scratchFileName === undefined) {
      return;
    } else if (scratchFileName === "") {
      scratchFileName = defaultFileName;
    }
    return `${scratchFileName}${fileExtension}`;
  }

  async createFile({ fileName }) {
    let scratchUri = await this.getScratchUri();
    let fileUri = vscode.Uri.parse(`${scratchUri.path.toString()}/${fileName}`);
    let doesFileExist = await utils.checkIfFileExists(fileUri);
    if (doesFileExist) {
      vscode.window.showErrorMessage(
        `${fileName} already exists in workspace scratch folder`
      );
      return;
    } else {
      vscode.workspace.fs.writeFile(fileUri, new Uint8Array(0));
      return fileUri;
    }
  }

  async newScratch() {
    await this.getScratchUri();
    let fileExtension = await this.getFileExtension();
    if (fileExtension === undefined) {
      return;
    }

    let fileName = await this.getFileName({ fileExtension: fileExtension });
    if (fileName === undefined) {
      return;
    }

    await this.createFolder();
    let newFile = await this.createFile({ fileName: fileName });

    await utils.openFile({ filePath: newFile, isNewFile: true });
    return;
  }
}

module.exports = { CreateScratch };