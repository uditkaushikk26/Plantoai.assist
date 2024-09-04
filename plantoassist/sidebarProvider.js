const vscode = require("vscode");

class SidebarProvider {
  constructor(extensionUri) {
    // Store the extension URI for later use
    this._extensionUri = extensionUri;
  }

  resolveWebviewView(webviewView) {
    // Store the webview view
    this._view = webviewView;

    // Configure webview options
    webviewView.webview.options = {
      enableScripts: true, // Allow scripts to be run in the webview
      localResourceRoots: [this._extensionUri], // Restrict access to local resources
    };

    // Set the HTML content for the webview
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages received from the webview
    webviewView.webview.onDidReceiveMessage(async (message) => {
      try {
        switch (message.command) {
          case "explainCode":
            // Handle explain code command
            const explainCodeResponse = await this._postRequest(
              "https://plantoassist.onrender.com/explain-code",
              { code: message.prompt }
            );
            webviewView.webview.postMessage({
              command: "showExplanation",
              explanation: explainCodeResponse.explanation,
            });
            break;
          case "generateCode":
            // Handle generate code command
            const generateCodeResponse = await this._postRequest(
              "https://plantoassist.onrender.com/generate-code",
              { query: message.prompt }
            );
            webviewView.webview.postMessage({
              command: "showGeneratedCode",
              code: generateCodeResponse.code,
            });
            break;
          case "debugCode":
            // Handle debug code command
            const debugCodeResponse = await this._postRequest(
              "https://plantoassist.onrender.com/debug-code",
              { code: message.prompt }
            );
            webviewView.webview.postMessage({
              command: "showDebuggedCode",
              code: debugCodeResponse.code,
            });
            break;
          case "runCode":
            // Handle run code command
            const runCodeResponse = await this._postRequest(
              "https://plantoassist.onrender.com/run-code",
              { code: message.prompt }
            );
            webviewView.webview.postMessage({
              command: "showRunOutput",
              output: runCodeResponse.output,
            });
            break;
          default:
            throw new Error("Unknown command");
        }
      } catch (error) {
        // Show error message if any error occurs
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    });
  }

  // Helper method to make POST requests
  async _postRequest(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Helper method to get HTML content for the webview
  _getHtmlForWebview(webview) {
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "style.css")
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>Planto.AI</title>
</head>
<body>
    <h1 style="text-align: center; color: #333;">Planto.AI</h1>
    <div style="padding: 20px;">
        <textarea id="prompt" rows="5" placeholder="Enter your prompt here..." style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;"></textarea>
        <div style="text-align: center;">
            <button id="explain" style="padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; font-size: 16px; background-color: #007acc; color: white; cursor: pointer;">Explain Code</button>
            <button id="generate" style="padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; font-size: 16px; background-color: #28a745; color: white; cursor: pointer;">Generate Code</button>
            <button id="debug" style="padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; font-size: 16px; background-color: #dc3545; color: white; cursor: pointer;">Debug Code</button>
            <button id="run" style="padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; font-size: 16px; background-color: #ffc107; color: white; cursor: pointer;">Run Code</button>
        </div>
        <div id="response" style="margin-top: 20px; padding: 10px; background-color: white; border: 1px solid #ccc; border-radius: 4px; white-space: pre-wrap;"></div>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('explain').addEventListener('click', () => {
            const prompt = document.getElementById('prompt').value;
            vscode.postMessage({ command: 'explainCode', prompt: prompt });
        });
        document.getElementById('generate').addEventListener('click', () => {
            const prompt = document.getElementById('prompt').value;
            vscode.postMessage({ command: 'generateCode', prompt: prompt });
        });
        document.getElementById('debug').addEventListener('click', () => {
            const prompt = document.getElementById('prompt').value;
            vscode.postMessage({ command: 'debugCode', prompt: prompt });
        });
        document.getElementById('run').addEventListener('click', () => {
            const prompt = document.getElementById('prompt').value;
            vscode.postMessage({ command: 'runCode', prompt: prompt });
        });
        window.addEventListener('message', event => {
            const message = event.data;
            const responseDiv = document.getElementById('response');
            if (message.command === 'showExplanation') {
                responseDiv.innerHTML = message.explanation;
            } else if (message.command === 'showGeneratedCode') {
                responseDiv.textContent = message.code;
            } else if (message.command === 'showDebuggedCode') {
                responseDiv.textContent = message.code;
            } else if (message.command === 'showRunOutput') {
                responseDiv.textContent = message.output;
            }
        });
    </script>
</body>
</html>`;
  }
}

module.exports = SidebarProvider;
