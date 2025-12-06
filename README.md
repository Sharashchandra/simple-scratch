# Simple Scratch

A simple VS Code extension to manage scratch files in your current workspace and globally.

## Highlights

- Create multiple scratch files
- Support for all languages recognized by VS Code
- Create separate scratch files in the current workspace or globally
- Enjoy VS Code IntelliSense in your scratch files
- Scratch files don't interfere with your project or source control
- Bulk delete scratch files when you're done

## Available Commands

| Command                               | Description                           |
| ------------------------------------- | ------------------------------------- |
| `Simple Scratch: New Scratch`         | Creates a new scratch file            |
| `Simple Scratch: Open Scratch`        | Opens an existing scratch file        |
| `Simple Scratch: Delete Scratch`      | Delete an existing scratch file       |
| `Simple Scratch: Bulk Delete Scratch` | Delete multiple scratch files at once |

## Extension Settings

This extension contributes the following settings:

### Workspace Scratch Settings

| Setting                                 | Description                                               | Default   |
| --------------------------------------- | --------------------------------------------------------- | --------- |
| `simple-scratch.scratchFolderPath`      | Path to the scratch folder relative to the workspace root | `null`    |
| `simple-scratch.scratchFolderName`      | Name of the scratch folder in the current workspace       | `scratch` |
| `simple-scratch.defaultScratchFileName` | Base name of scratch files in the current workspace       | `scratch` |

### Global Scratch Settings

| Setting                                       | Description                         | Default   |
| --------------------------------------------- | ----------------------------------- | --------- |
| `simple-scratch.enableGlobalScratch`          | Enable/disable global scratch files | `true`    |
| `simple-scratch.globalScratchFolderName`      | Name of the global scratch folder   | `scratch` |
| `simple-scratch.defaultGlobalScratchFileName` | Base name of global scratch files   | `scratch` |

### Other Settings

| Setting                          | Description                                                  | Default |
| -------------------------------- | ------------------------------------------------------------ | ------- |
| `simple-scratch.enableAutoPaste` | Automatically paste clipboard content into new scratch files | `true`  |

## Example: Custom Scratch Folder Path

You can configure a custom path for your scratch files. This can be set globally in your VS Code settings or per-workspace in `.vscode/settings.json`.

### Example 1: Custom path with default folder name

```json
{
  "simple-scratch.scratchFolderPath": ".vscode"
}
```

Scratch files will be stored under `.vscode/scratch/` (using the default `scratchFolderName`).

### Example 2: Custom path with custom folder name

```json
{
  "simple-scratch.scratchFolderPath": ".vscode",
  "simple-scratch.scratchFolderName": "temp"
}
```

Scratch files will be stored under `.vscode/temp/`.

### Example 3: Nested custom path

```json
{
  "simple-scratch.scratchFolderPath": "notes/drafts"
}
```

Scratch files will be stored under `notes/drafts/scratch/`.

> **Note:** When configured in `.vscode/settings.json`, these settings apply only to the current workspace and override any global settings.
