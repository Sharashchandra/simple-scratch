const vscode = require("vscode");
const utils = require("./utils.js");

async function createFolder(scratchUri) {
  await vscode.workspace.fs.createDirectory(scratchUri);
  return;
}

async function getFileName(fileExtension) {
  const defaultFileName = await utils.getDefaultFileName();
  let scratchFileName = await vscode.window.showInputBox({
    placeHolder: `${defaultFileName}${fileExtension} (default)`,
  });
  if (scratchFileName === undefined) {
    return;
  } else if (scratchFileName === "") {
    scratchFileName = defaultFileName;
  }
  return `${scratchFileName}${fileExtension}`;
}

async function getFileExtension() {
  const allExtensions = await utils.getAllSupportedFileExtensions();
  const selectedExtension = await vscode.window.showQuickPick(
    Object.keys(allExtensions),
    { placeHolder: "Select file extension" }
  );
  return allExtensions[selectedExtension];
}

async function createFile(scratchUri, fileName) {
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

async function newScratch() {
  let scratchUri = await utils.getScratchPath();

  let fileExtension = await getFileExtension();
  if (fileExtension === undefined) {
    return;
  }

  let fileName = await getFileName(fileExtension);
  if (fileName === undefined) {
    return;
  }

  await createFolder(scratchUri);

  let newFile = await createFile(scratchUri, fileName);

  await utils.openFile(newFile, true);
  return;
}

module.exports = newScratch;
