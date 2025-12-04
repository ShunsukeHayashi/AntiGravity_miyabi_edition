/**
 * Mission Control Webview Provider
 * Provides the Mission Control UI as a VS Code webview
 */

import * as vscode from 'vscode';

export class MissionControlProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'missionControl';

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlContent(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage((message) => {
      this._handleMessage(message);
    });
  }

  private _handleMessage(message: { command: string; data?: unknown }) {
    switch (message.command) {
      case 'executeTask':
        vscode.commands.executeCommand('antigravity.executeTask');
        break;
      case 'startAgent':
        vscode.commands.executeCommand(
          'antigravity.startAgent',
          message.data
        );
        break;
      case 'stopAgent':
        vscode.commands.executeCommand('antigravity.stopAgent', message.data);
        break;
      case 'getStatus':
        vscode.commands.executeCommand('antigravity.getStatus');
        break;
    }
  }

  public updateStatus(status: unknown) {
    if (this._view) {
      this._view.webview.postMessage({ type: 'statusUpdate', data: status });
    }
  }

  private _getHtmlContent(webview: vscode.Webview): string {
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css')
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'unsafe-inline';">
  <title>Mission Control</title>
  <style>
    :root {
      --bg-primary: #1e1e2e;
      --bg-secondary: #313244;
      --bg-tertiary: #45475a;
      --text-primary: #cdd6f4;
      --text-secondary: #a6adc8;
      --accent-blue: #89b4fa;
      --accent-green: #a6e3a1;
      --accent-red: #f38ba8;
      --accent-yellow: #f9e2af;
      --accent-purple: #cba6f7;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 16px;
      min-height: 100vh;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .header h1 {
      font-size: 18px;
      font-weight: 600;
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .logo {
      font-size: 24px;
    }

    .section {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .agent-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .agent-card {
      background: var(--bg-tertiary);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .agent-card:hover {
      border-color: var(--accent-blue);
      transform: translateY(-2px);
    }

    .agent-card.running {
      border-color: var(--accent-green);
    }

    .agent-card.stopped {
      opacity: 0.6;
    }

    .agent-name {
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .agent-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-red);
    }

    .agent-status.running {
      background: var(--accent-green);
      box-shadow: 0 0 8px var(--accent-green);
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .btn {
      background: var(--bg-tertiary);
      border: 1px solid var(--bg-tertiary);
      color: var(--text-primary);
      padding: 10px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .btn:hover {
      background: var(--accent-blue);
      border-color: var(--accent-blue);
      color: var(--bg-primary);
    }

    .btn.primary {
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
      border: none;
    }

    .btn.primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .stat-card {
      text-align: center;
      padding: 12px;
      background: var(--bg-tertiary);
      border-radius: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--accent-blue);
    }

    .stat-label {
      font-size: 11px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .quick-action {
      background: var(--bg-tertiary);
      border: none;
      color: var(--text-primary);
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .quick-action:hover {
      background: var(--accent-purple);
      color: var(--bg-primary);
    }

    .quick-action-icon {
      font-size: 20px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .agent-status.running {
      animation: pulse 2s infinite;
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="logo">🚀</span>
    <h1>Mission Control</h1>
  </div>

  <div class="section">
    <div class="section-title">Quick Stats</div>
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value" id="running-agents">1</div>
        <div class="stat-label">Running</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="pending-tasks">0</div>
        <div class="stat-label">Pending</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="completed-tasks">0</div>
        <div class="stat-label">Completed</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Agents</div>
    <div class="agent-grid">
      <div class="agent-card running" onclick="toggleAgent('coordinator')">
        <div class="agent-name">
          <span class="agent-status running"></span>
          Coordinator
        </div>
      </div>
      <div class="agent-card stopped" onclick="toggleAgent('codegen')">
        <div class="agent-name">
          <span class="agent-status"></span>
          CodeGen
        </div>
      </div>
      <div class="agent-card stopped" onclick="toggleAgent('review')">
        <div class="agent-name">
          <span class="agent-status"></span>
          Review
        </div>
      </div>
      <div class="agent-card stopped" onclick="toggleAgent('test')">
        <div class="agent-name">
          <span class="agent-status"></span>
          Test
        </div>
      </div>
      <div class="agent-card stopped" onclick="toggleAgent('issue')">
        <div class="agent-name">
          <span class="agent-status"></span>
          Issue
        </div>
      </div>
      <div class="agent-card stopped" onclick="toggleAgent('pr')">
        <div class="agent-name">
          <span class="agent-status"></span>
          PR
        </div>
      </div>
      <div class="agent-card stopped" onclick="toggleAgent('deployment')">
        <div class="agent-name">
          <span class="agent-status"></span>
          Deploy
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Quick Actions</div>
    <div class="quick-actions">
      <button class="quick-action" onclick="executeTask()">
        <span class="quick-action-icon">✨</span>
        New Task
      </button>
      <button class="quick-action" onclick="generateCode()">
        <span class="quick-action-icon">💻</span>
        Generate
      </button>
      <button class="quick-action" onclick="reviewCode()">
        <span class="quick-action-icon">🔍</span>
        Review
      </button>
      <button class="quick-action" onclick="runTests()">
        <span class="quick-action-icon">🧪</span>
        Test
      </button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Actions</div>
    <div class="action-buttons">
      <button class="btn primary" onclick="executeTask()">
        🎯 Execute Task
      </button>
      <button class="btn" onclick="refreshStatus()">
        🔄 Refresh Status
      </button>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    function toggleAgent(agentType) {
      const card = event.currentTarget;
      const isRunning = card.classList.contains('running');

      if (isRunning) {
        vscode.postMessage({ command: 'stopAgent', data: agentType });
        card.classList.remove('running');
        card.classList.add('stopped');
        card.querySelector('.agent-status').classList.remove('running');
      } else {
        vscode.postMessage({ command: 'startAgent', data: agentType });
        card.classList.remove('stopped');
        card.classList.add('running');
        card.querySelector('.agent-status').classList.add('running');
      }

      updateRunningCount();
    }

    function updateRunningCount() {
      const running = document.querySelectorAll('.agent-card.running').length;
      document.getElementById('running-agents').textContent = running;
    }

    function executeTask() {
      vscode.postMessage({ command: 'executeTask' });
    }

    function generateCode() {
      vscode.postMessage({ command: 'executeCommand', data: 'antigravity.generateCode' });
    }

    function reviewCode() {
      vscode.postMessage({ command: 'executeCommand', data: 'antigravity.reviewCode' });
    }

    function runTests() {
      vscode.postMessage({ command: 'executeCommand', data: 'antigravity.runTests' });
    }

    function refreshStatus() {
      vscode.postMessage({ command: 'getStatus' });
    }

    // Handle messages from extension
    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.type) {
        case 'statusUpdate':
          updateUI(message.data);
          break;
      }
    });

    function updateUI(status) {
      if (status.taskQueue) {
        document.getElementById('pending-tasks').textContent = status.taskQueue.pending || 0;
      }
    }
  </script>
</body>
</html>`;
  }
}
