const vscode = require("vscode");
const utils = require("./utils");

async function chooseFile(multipleSelect) {
  let allFiles;
  try {
    allFiles = await utils.listFiles();
  } catch (err) {
    vscode.window.showErrorMessage(
      "There are no scratch files in this workspace, check the simple-scratch.scratchFolderName value"
    );
    return;
  }
  if (!allFiles || allFiles.length == 0) {
    vscode.window.showErrorMessage(
      "There are no scratch files in this workspace, check the simple-scratch.scratchFolderName value"
    );
    return;
  }
  const selected = await vscode.window.showQuickPick(allFiles, {
    placeHolder: "Select a file",
    canPickMany: multipleSelect,
  });

  if (typeof selected === "string") {
    return [selected];
  } else {
    return selected;
  }
}

async function getTargetFileUri(multipleSelect = false) {
  let chosenFileNames = await chooseFile(multipleSelect);
  if (chosenFileNames && chosenFileNames.length > 0) {
    console.log(`${chosenFileNames} are the chosen one(s) to be modified`);
    let scratchUri = await utils.getScratchPath();
    let files = [];
    for (const _fname of chosenFileNames) {
      let fileUri = vscode.Uri.parse(`${scratchUri.path.toString()}/${_fname}`);
      files.push(fileUri);
    }
    return files;
  }
  return;
}

async function openScratch() {
  let fileUris = await getTargetFileUri();
  if (fileUris && fileUris.length > 0) {
    for (const _fname of fileUris) {
      await utils.openFile(_fname);
    }
  }
  return;
}

async function deleteScratch(bulkDelete = false) {
  let fileUris = await getTargetFileUri(bulkDelete);
  if (fileUris) {
    const confirmation = await vscode.window.showQuickPick(["yes", "no"], {
      placeHolder: "Confirm deletion?",
    });
    if (confirmation === "yes") {
      for (const _fname of fileUris) {
        await vscode.workspace.fs.delete(_fname);
      }
    }
  }
  return;
}

async function bulkDeleteScratch() {
  await deleteScratch(true);
}

module.exports = {
  openScratch,
  deleteScratch,
  bulkDeleteScratch,
};
