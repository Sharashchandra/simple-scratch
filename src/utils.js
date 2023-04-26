const vscode = require("vscode");
const constants = require("./constants.js");
let languageMap = require("language-map");

// Get Configuration
function getConfiguration() {
  let config = vscode.workspace.getConfiguration(constants.APP_NAME);
  return config;
}

async function checkIfGlobalScratchEnabled() {
  const config = getConfiguration();
  const isGlobalEnabled = config.get(
    "enableGlobalScratch",
    constants.GLOBAL_SCRATCH_ENABLED
  );
  console.log(`isGlobalEnabled: ${isGlobalEnabled}`);
  return isGlobalEnabled;
}

async function checkIfAutoPasteEnabled() {
  const config = getConfiguration();
  const autoPasteEnabled = config.get(
    "enableAutoPaste",
    constants.AUTO_PASTE_ENABLED
  );
  console.log(`autoPasteEnabled: ${autoPasteEnabled}`);
  return autoPasteEnabled;
}

// Get Scratch Base Folder Paths
async function getWorkspaceRoot() {
  const workspace = await vscode.workspace.workspaceFolders;
  if (workspace !== undefined) {
    let path = workspace[0].uri.fsPath.toString();
    return path;
  } else {
    return;
  }
}

function getGlobalFolderPath({ context }) {
  return context.globalStorageUri.path.toString();
}

// Get Scratch File/Folder Names
async function getDefaultFileName({ scratchUri }) {
  const config = getConfiguration();
  const isGlobal = await checkIfGlobalScratchEnabled();
  let defaultFileName;
  if (isGlobal) {
    defaultFileName = config.get(
      "defaultGlobalScratchFileName",
      constants.GLOBAL_DEFAULT_SCRATCH_FILE_NAME
    );
  } else {
    defaultFileName = config.get(
      "defaultScratchFileName",
      constants.DEFAULT_SCRATCH_FILE_NAME
    );
  }
  let allFiles;
  try {
    allFiles = await listFiles({ scratchUri: scratchUri });
  } catch (err) { console.log(err); }
  if (allFiles !== undefined && allFiles.length > 0) {
    defaultFileName = `${defaultFileName}${allFiles.length.toString()}`;
  }
  console.log(`defaultFileName: ${defaultFileName}`);
  return defaultFileName;
}

function getScratchFolderName({ global }) {
  let config = getConfiguration();
  let scratchFolderName;
  if (global) {
    scratchFolderName = config.get(
      "globalScratchFolderName",
      constants.GLOBAL_DEFAULT_SCRATCH_FOLDER_NAME
    );
  } else {
    scratchFolderName = config.get(
      "scratchFolderName",
      constants.DEFAULT_SCRATCH_FOLDER_NAME
    );
  }
  console.log(`scratchFolderName: ${scratchFolderName}`);
  return scratchFolderName;
}

// Get full scratch paths
async function getWorkspaceScratchPath() {
  let workspaceRoot = await getWorkspaceRoot();
  let scratchFolderName = getScratchFolderName({ global: false });
  let scratchUri = vscode.Uri.parse(`${workspaceRoot}/${scratchFolderName}`);
  console.log(`Scratch Uri: ${scratchUri.path.toString()}`);
  return scratchUri;
}

function getGlobalScratchPath({ context }) {
  let globalFolderPath = getGlobalFolderPath({ context: context });
  let scratchFolderName = getScratchFolderName({ global: true });
  let scratchUri = vscode.Uri.parse(`${globalFolderPath}/${scratchFolderName}`);
  console.log(`Scratch Uri: ${scratchUri.path.toString()}`);
  return scratchUri;
}

async function getScratchPath({ context }) {
  const isGlobalEnabled = await checkIfGlobalScratchEnabled();
  if (!isGlobalEnabled) {
    return await getWorkspaceScratchPath();
  }

  let location = await vscode.window.showQuickPick(["workspace", "global"], {
    placeHolder: "Workspace or Global",
  });
  if (location === undefined) {
    return;
  } else if (location === "workspace") {
    return await getWorkspaceScratchPath();
  } else {
    return getGlobalScratchPath({ context: context });
  }
}

// Get all supported languages with extension in vscode
async function getLanguageMap() {
  let allSupportedLanguages = {};
  for (const [name, data] of Object.entries(languageMap)) {
    if (data.extensions) {
      let fileExtension = data.extensions[0];
      let displayName = `${name} (${fileExtension})`;
      allSupportedLanguages[displayName] = fileExtension;
    }
  }
  return allSupportedLanguages;
}

// File exists check
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

// Util to open file
async function openFile({ filePath }) {
  console.log(`Opening file: ${filePath}`);
  let document;
  document = await vscode.workspace.openTextDocument(filePath);

  vscode.window.showTextDocument(document);
  return;
}

// Util to list all files
async function listFiles({ scratchUri }) {
  let files;
  files = await vscode.workspace.fs.readDirectory(scratchUri);
  const fileNames = [];

  for (const f of files) {
    fileNames.push(f[0]);
  }
  return fileNames;
}

// Util to get the conten
async function getFileContent() {
  const autoPasteEnabled = await checkIfAutoPasteEnabled()
  if (autoPasteEnabled) {
    let clipboardContent = await vscode.env.clipboard.readText();
    return new TextEncoder().encode(clipboardContent);
  }
  else {
    return new Uint8Array(0);
  }
}

module.exports = {
  getWorkspaceRoot,
  getScratchPath,
  checkIfFileExists,
  openFile,
  getLanguageMap,
  getDefaultFileName,
  listFiles,
  getFileContent
};
