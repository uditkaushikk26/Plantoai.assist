# Welcome to Your VS Code Extension

## What's in the Folder

* This folder contains all the files necessary for your extension.
* `package.json` - This is the manifest file in which you declare your extension and command.
  * The sample plugin registers a command and defines its title and command name. With this information, VS Code can show the command in the command palette. It doesn’t yet need to load the plugin.
* `extension.js` - This is the main file where you will provide the implementation of your command.
  * The file exports one function, `activate`, which is called the very first time your extension is activated (in this case by executing the command). Inside the `activate` function, we call `registerCommand`.
  * We pass the function containing the implementation of the command as the second parameter to `registerCommand`.
* `sidebarProvider.js` - This file contains the implementation of the `SidebarProvider` class, which handles the sidebar webview and its interactions.

## Get Up and Running Straight Away

* Press `F5` to open a new window with your extension loaded.
* Run your command from the command palette by pressing (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and typing `Hello World`.
* Set breakpoints in your code inside `extension.js` to debug your extension.
* Find output from your extension in the debug console.

## Make Changes

* You can relaunch the extension from the debug toolbar after changing code in `extension.js` or `sidebarProvider.js`.
* You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.

## SidebarProvider Class

* The `SidebarProvider` class is responsible for creating and managing the sidebar webview.
* It handles various commands such as `explainCode`, `generateCode`, `debugCode`, and `runCode` by making POST requests to the respective endpoints and displaying the results in the webview.

## Run Tests

* Install the [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner).
* Open the Testing view from the activity bar and click the "Run Test" button, or use the hotkey `Ctrl/Cmd + ; A`.
* See the output of the test result in the Test Results view.
* Make changes to `test/extension.test.js` or create new test files inside the `test` folder.
  * The provided test runner will only consider files matching the name pattern `**.test.js`.
  * You can create folders inside the `test` folder to structure your tests any way you want.

## Go Further

* [Follow UX guidelines](https://code.visualstudio.com/api/ux-guidelines/overview) to create extensions that seamlessly integrate with VS Code's native interface and patterns.
* [Publish your extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) on the VS Code extension marketplace.
* Automate builds by setting up [Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).