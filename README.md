# simple-scratch README

A simple vscode extension to manage scratch files in the current workspace and globally.

## Highlights

* Create multiple scratch files.
* Create scratch files of all languages supported by vscode.
* Create seperate scratch files in the current workspace and globally.
* Enjoy VSCode intellisense in your scratch files.
* Scratch files are not interfering with your project / source control and can be removed at any time
* Option to bulk delete scratch files.

## Available Commands

* `Simple Scratch: New Scratch`
> Creates a new scratch file.
* `Simple Scratch: Open Scratch`
> Opens an existing scratch file.
* `Simple Scratch: Delete Scratch`
> Delete an existing scratch file.
* `Simple Scratch: Bulk Delete Scratch`
> Bulk delete multiple existing scratch files.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `simple-scratch.scratchFolderName`: Name of the scratch folder in the current workspace.
> *scratch* is the default value
* `simple-scratch.defaultScratchFileName`: Base name of the scratch file in the current workspace.
> *scratch* is the default value
* `simple-scratch.enableGlobalScratch`: Enable/disable global scratch files.
> *scratch* is the default valuefiles.
* `simple-scratch.globalScratchFolderName`: Name of the scratch folder globally.
> *scratch* is the default value
* `simple-scratch.defaultGlobalScratchFileName`: Base name of the scratch file globally.
> *scratch* is the default value


## Release Notes

### 1.0.0

Initial release of Simple Scratch extension
