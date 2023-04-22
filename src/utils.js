const vscode = require("vscode");
const constants = require("./constants.js");

async function getWorkspaceRoot() {
  const workspace = await vscode.workspace.workspaceFolders;
  if (workspace !== undefined) {
    let path = workspace[0].uri.fsPath.toString();
    return path;
  } else {
    return;
  }
}

function getConfiguration() {
  let config = vscode.workspace.getConfiguration(constants.APP_NAME);
  return config;
}

function getScratchFolderName() {
  let config = getConfiguration();
  const scratchFolderName = config.get(
    "scratchFolderName",
    constants.DEFAULT_SCRATCH_FOLDER_NAME
  );
  console.log(`scratchFolderName: ${scratchFolderName}`);
  return scratchFolderName;
}

async function getScratchPath() {
  let workspaceRoot = await getWorkspaceRoot();
  let scratchFolderName = getScratchFolderName();
  let scratchUri = vscode.Uri.parse(`${workspaceRoot}/${scratchFolderName}`);
  console.log(`Scratch Uri: ${scratchUri.path.toString()}`);
  return scratchUri;
}

async function checkIfFileExists(uri) {
  return vscode.workspace.fs
    .stat(uri)
    .then((stat) => {
      return stat.type === vscode.FileType.File;
    })
    .catch(() => {
      return false;
    });
}

async function openFile(filePath, isNewFile = false) {
  console.log(`Opening file: ${filePath}`);
  let document;
  if (isNewFile) {
    document = await vscode.workspace.openTextDocument(
      filePath.with({ scheme: "untitled" })
    );
  } else {
    document = await vscode.workspace.openTextDocument(filePath);
  }
  vscode.window.showTextDocument(document);
  return;
}

async function getAllSupportedFileExtensions() {
  const extensions = await vscode.extensions.all;
  const fileExtensions = {};

  for (const extension of extensions) {
    const contributes = extension.packageJSON.contributes;
    if (contributes && Array.isArray(contributes.languages)) {
      for (const language of contributes.languages) {
        if (Array.isArray(language.extensions)) {
          fileExtensions[language.id] = language.extensions[0];
        }
      }
    }
  }

  return fileExtensions;
}

async function listFiles() {
  let scratchUri = await getScratchPath();
  let files;
  //   try {
  //     files = await vscode.workspace.fs.readDirectory(scratchUri);
  //   } catch (err) {
  //     vscode.window.showErrorMessage(
  //       "There are no scratch files in this workspace, check the simple-scratch.scratchFolderName value"
  //     );
  //     return;
  //   }
  files = await vscode.workspace.fs.readDirectory(scratchUri);
  const fileNames = [];

  for (const f of files) {
    fileNames.push(f[0]);
  }
  return fileNames;
}

async function getDefaultFileName() {
  const config = getConfiguration();
  let defaultFileName = config.get(
    "defaultScratchFileName",
    constants.DEFAULT_SCRATCH_FILE_NAME
  );
  let allFiles;
  try {
    allFiles = await listFiles();
  } catch (err) {}
  if (allFiles !== undefined && allFiles.length > 0) {
    defaultFileName = `${defaultFileName}${allFiles.length.toString()}`;
  }
  console.log(`defaultFileName: ${defaultFileName}`);
  return defaultFileName;
}

module.exports = {
  getWorkspaceRoot,
  getScratchPath,
  checkIfFileExists,
  openFile,
  getAllSupportedFileExtensions,
  getDefaultFileName,
  listFiles,
};
