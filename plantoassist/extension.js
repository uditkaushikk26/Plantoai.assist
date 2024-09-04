const vscode = require("vscode");
const SidebarProvider = require("./sidebarProvider");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
  // Create an instance of SidebarProvider
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  // Register the SidebarProvider to the "planto-sidebar" view
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("planto-sidebar", sidebarProvider)
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

// Export the activate and deactivate functions
module.exports = {
  activate,
  deactivate,
};
