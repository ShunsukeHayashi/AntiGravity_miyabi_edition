# VS Code Fork Integration Architecture

## Overview

AntiGravity IDE is built as an **architectural fork** of VS Code, not a traditional code fork. This approach allows us to:

1. **Maintain upstream compatibility** - Pull VS Code updates without merge conflicts
2. **Layer agent features** - Add agent orchestration without modifying core VS Code
3. **Preserve extension ecosystem** - Keep VS Code extension API compatibility

## Architecture Strategy

### Hybrid Approach: Submodule + Extension Layer

```
AntiGravity/
├── vscode-upstream/          # VS Code as git submodule
├── src/                      # AntiGravity agent layer
│   ├── agent/               # Agent implementations
│   ├── mission-control/     # Mission Control UI
│   ├── bridge/              # VS Code API bridge
│   └── orchestrator/        # Agent orchestration
├── extensions/              # Custom extensions
└── ide-core/                # Web UI (alternative interface)
```

### Integration Layers

#### Layer 1: VS Code Core (Submodule)
- **Source**: Microsoft VS Code (https://github.com/microsoft/vscode)
- **Version Strategy**: Track stable releases (e.g., 1.85.x)
- **Modifications**: Minimal - only build configuration
- **Update Process**: `git submodule update --remote`

#### Layer 2: Extension Bridge
- **Purpose**: Connect VS Code Extension API to AntiGravity agents
- **Location**: `src/bridge/vscode-extension-host.ts`
- **Key Components**:
  - Extension API proxy
  - Agent command registry
  - Event bus integration
  - Workspace state synchronization

#### Layer 3: Agent Orchestration
- **Purpose**: Manage agent lifecycle and communication
- **Location**: `src/orchestrator/`
- **Key Components**:
  - Agent lifecycle manager
  - Task queue manager
  - Inter-agent message bus
  - Resource allocator

#### Layer 4: Mission Control UI
- **Purpose**: Unified dashboard for agent management
- **Location**: `src/mission-control/`
- **Implementation Options**:
  - Option A: VS Code Webview Panel (embedded)
  - Option B: Separate Electron window
  - Option C: Browser-based (ide-core/)

## Build Integration

### Build Process Flow

```
1. Build VS Code Core
   └─> yarn install (in vscode-upstream/)
   └─> yarn watch (continuous build)

2. Build AntiGravity Layer
   └─> npm run build (TypeScript compilation)
   └─> Bundle agents + Mission Control

3. Package Application
   └─> Merge VS Code output + AntiGravity layer
   └─> Generate Electron app bundle
   └─> Sign and notarize (macOS)
```

### Configuration Files

#### package.json Extensions

```json
{
  "scripts": {
    "build:vscode": "cd vscode-upstream && yarn && yarn compile",
    "build:antigravity": "tsc -p ./tsconfig.json",
    "build": "npm run build:vscode && npm run build:antigravity",
    "watch:vscode": "cd vscode-upstream && yarn watch",
    "watch:antigravity": "tsc -watch -p ./tsconfig.json",
    "watch": "concurrently \"npm run watch:vscode\" \"npm run watch:antigravity\"",
    "package": "npm run build && electron-builder",
    "start": "npm run build && electron ./out/main.js"
  }
}
```

#### tsconfig.json Integration

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "vscode": ["./vscode-upstream/src/vs/vscode.d.ts"]
    }
  },
  "include": [
    "src/**/*",
    "vscode-upstream/src/vs/vscode.d.ts"
  ]
}
```

## Extension API Bridge

### VS Code Extension Host Integration

```typescript
// src/bridge/vscode-extension-host.ts

import * as vscode from 'vscode';
import { AgentOrchestrator } from '../orchestrator';

export class AntiGravityExtensionBridge {
  private orchestrator: AgentOrchestrator;

  constructor() {
    this.orchestrator = new AgentOrchestrator();
  }

  /**
   * Register AntiGravity commands in VS Code command palette
   */
  registerCommands(context: vscode.ExtensionContext) {
    // Mission Control
    context.subscriptions.push(
      vscode.commands.registerCommand('antigravity.openMissionControl', () => {
        this.openMissionControl();
      })
    );

    // Agent management
    context.subscriptions.push(
      vscode.commands.registerCommand('antigravity.startAgent', (agentType) => {
        this.orchestrator.startAgent(agentType);
      })
    );

    // Natural language task
    context.subscriptions.push(
      vscode.commands.registerCommand('antigravity.executeTask', async () => {
        const taskDescription = await vscode.window.showInputBox({
          prompt: 'Describe your task in natural language',
          placeHolder: 'e.g., "Implement user authentication with JWT"'
        });

        if (taskDescription) {
          await this.orchestrator.executeTask(taskDescription);
        }
      })
    );
  }

  /**
   * Sync VS Code workspace state to agents
   */
  syncWorkspaceState() {
    const workspaceState = {
      folders: vscode.workspace.workspaceFolders,
      activeEditor: vscode.window.activeTextEditor,
      openDocuments: vscode.workspace.textDocuments
    };

    this.orchestrator.updateContext(workspaceState);
  }
}
```

### Extension Manifest

```json
// extensions/antigravity-core/package.json
{
  "name": "antigravity-core",
  "displayName": "AntiGravity Core",
  "version": "0.1.0",
  "publisher": "antigravity",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["Other"],
  "activationEvents": ["*"],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "antigravity.openMissionControl",
        "title": "AntiGravity: Open Mission Control",
        "icon": "$(dashboard)"
      },
      {
        "command": "antigravity.executeTask",
        "title": "AntiGravity: Execute Task",
        "icon": "$(rocket)"
      }
    ],
    "viewsContainers": {
      "activitybar": [
        {
          "id": "antigravity",
          "title": "AntiGravity",
          "icon": "resources/logo.svg"
        }
      ]
    },
    "views": {
      "antigravity": [
        {
          "id": "missionControl",
          "name": "Mission Control"
        },
        {
          "id": "agentStatus",
          "name": "Agent Status"
        },
        {
          "id": "taskInbox",
          "name": "Task Inbox"
        }
      ]
    }
  }
}
```

## Mission Control UI Integration

### Option A: VS Code Webview Panel (Recommended)

**Pros**:
- Native VS Code integration
- Share context with editor
- Single window experience

**Cons**:
- Limited by Webview API
- Potential performance constraints

```typescript
// src/mission-control/webview-provider.ts

export class MissionControlProvider implements vscode.WebviewViewProvider {
  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.html = this.getHtmlContent(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(message => {
      this.handleWebviewMessage(message);
    });
  }

  private getHtmlContent(webview: vscode.Webview): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Mission Control</title>
        </head>
        <body>
          <div id="mission-control-root"></div>
          <script src="${webview.asWebviewUri(this.getScriptUri())}"></script>
        </body>
      </html>
    `;
  }
}
```

### Option B: Separate Electron Window

**Pros**:
- Full control over UI
- Better performance for complex dashboards
- Multi-monitor support

**Cons**:
- Separate window management
- Context sync complexity

```typescript
// src/mission-control/electron-window.ts

import { BrowserWindow } from 'electron';

export class MissionControlWindow {
  private window: BrowserWindow;

  create() {
    this.window = new BrowserWindow({
      width: 1400,
      height: 900,
      title: 'Mission Control - AntiGravity IDE',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this.window.loadFile('mission-control/index.html');
  }
}
```

## Agent Communication Architecture

### Message Bus

```typescript
// src/orchestrator/message-bus.ts

export interface AgentMessage {
  id: string;
  from: string;
  to: string | 'broadcast';
  type: 'STATUS_UPDATE' | 'TASK_REQUEST' | 'TASK_COMPLETE' | 'ERROR';
  payload: any;
  timestamp: number;
}

export class MessageBus {
  private subscribers: Map<string, Set<(msg: AgentMessage) => void>>;

  publish(message: AgentMessage) {
    if (message.to === 'broadcast') {
      this.broadcastToAll(message);
    } else {
      this.sendToAgent(message.to, message);
    }
  }

  subscribe(agentId: string, handler: (msg: AgentMessage) => void) {
    if (!this.subscribers.has(agentId)) {
      this.subscribers.set(agentId, new Set());
    }
    this.subscribers.get(agentId).add(handler);
  }
}
```

### Task Queue

```typescript
// src/orchestrator/task-queue.ts

export interface Task {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  dependencies: string[];
  assignedAgent?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export class TaskQueue {
  private queue: Task[] = [];

  enqueue(task: Task) {
    this.queue.push(task);
    this.queue.sort((a, b) => this.priorityValue(b.priority) - this.priorityValue(a.priority));
  }

  dequeue(): Task | undefined {
    // Find highest priority task with satisfied dependencies
    const index = this.queue.findIndex(task =>
      task.status === 'pending' &&
      this.dependenciesSatisfied(task)
    );

    if (index !== -1) {
      const task = this.queue[index];
      this.queue.splice(index, 1);
      return task;
    }

    return undefined;
  }
}
```

## Update Strategy

### Tracking Upstream VS Code

```bash
# Update VS Code submodule to latest stable
cd vscode-upstream
git fetch origin
git checkout release/1.85  # or desired version
cd ..
git add vscode-upstream
git commit -m "chore: update VS Code to 1.85.x"

# Test compatibility
npm run build
npm run test

# If issues arise, fix bridge layer
```

### Version Compatibility Matrix

| AntiGravity | VS Code | Electron | Node.js |
|-------------|---------|----------|---------|
| 0.1.x       | 1.85.x  | 28.x     | 18.x    |
| 0.2.x       | 1.86.x  | 28.x     | 18.x    |
| 0.3.x       | 1.87.x  | 29.x     | 20.x    |

## Deployment

### Packaging Strategy

```bash
# Build VS Code
cd vscode-upstream && yarn && yarn compile

# Build AntiGravity
npm run build:antigravity

# Merge outputs
mkdir -p dist/AntiGravity.app/Contents/Resources/app
cp -R vscode-upstream/out/* dist/AntiGravity.app/Contents/Resources/app/
cp -R out/* dist/AntiGravity.app/Contents/Resources/app/antigravity/

# Package with electron-builder
electron-builder --mac --publish never
```

### Distribution

- **macOS**: .dmg + auto-update via Electron Updater
- **Windows**: .exe installer (NSIS)
- **Linux**: .AppImage, .deb, .rpm

## Security Considerations

1. **Code Signing**: Sign all binaries with Apple Developer Certificate (macOS) and Authenticode (Windows)
2. **Auto-Update**: Use HTTPS for update manifest and delta updates
3. **Extension Security**: Sandbox third-party extensions
4. **Agent Isolation**: Run agents in separate processes with limited permissions

## Performance Optimization

1. **Lazy Loading**: Load agents on demand
2. **Worker Threads**: Run heavy computations in worker threads
3. **Caching**: Cache VS Code workspace state
4. **Incremental Builds**: Use webpack/esbuild for fast rebuilds

## Testing Strategy

1. **Unit Tests**: Agent logic, orchestrator, message bus
2. **Integration Tests**: VS Code API bridge, extension host
3. **E2E Tests**: Full workflows with Playwright
4. **Performance Tests**: Agent response time, memory usage

## Next Steps

1. ✅ Add VS Code as submodule
2. Configure build scripts
3. Implement extension bridge
4. Create Mission Control webview
5. Test agent integration
6. Package and distribute

---

**Last Updated**: 2025-12-02
**Author**: AntiGravity Development Team
