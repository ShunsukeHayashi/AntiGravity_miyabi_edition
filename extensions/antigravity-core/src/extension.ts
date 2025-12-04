/**
 * AntiGravity Core Extension
 * Main entry point for VS Code extension
 */

import * as vscode from 'vscode';
import { MissionControlProvider } from './mission-control-provider';
import { AgentStatusProvider } from './agent-status-provider';
import { TaskInboxProvider } from './task-inbox-provider';

let missionControlProvider: MissionControlProvider;
let agentStatusProvider: AgentStatusProvider;
let taskInboxProvider: TaskInboxProvider;

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('[AntiGravity] Extension activating...');

  // Initialize providers
  missionControlProvider = new MissionControlProvider(context.extensionUri);
  agentStatusProvider = new AgentStatusProvider();
  taskInboxProvider = new TaskInboxProvider();

  // Register webview provider for Mission Control
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'missionControl',
      missionControlProvider
    )
  );

  // Register tree data providers
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('agentStatus', agentStatusProvider)
  );
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('taskInbox', taskInboxProvider)
  );

  // Register commands
  registerCommands(context);

  // Auto-start agents if configured
  const config = vscode.workspace.getConfiguration('antigravity');
  if (config.get('autoStartAgents')) {
    const defaultAgents = config.get<string[]>('defaultAgents') || ['coordinator'];
    for (const agent of defaultAgents) {
      vscode.commands.executeCommand('antigravity.startAgent', agent);
    }
  }

  console.log('[AntiGravity] Extension activated');
}

/**
 * Register all commands
 */
function registerCommands(context: vscode.ExtensionContext) {
  // Mission Control
  context.subscriptions.push(
    vscode.commands.registerCommand('antigravity.openMissionControl', () => {
      vscode.commands.executeCommand('workbench.view.extension.antigravity');
      vscode.window.showInformationMessage('Mission Control opened');
    })
  );

  // Execute Task
  context.subscriptions.push(
    vscode.commands.registerCommand('antigravity.executeTask', async () => {
      const taskDescription = await vscode.window.showInputBox({
        prompt: 'Describe your task in natural language',
        placeHolder: 'e.g., "Implement user authentication with JWT"',
      });

      if (taskDescription) {
        vscode.window.showInformationMessage(
          `Task queued: ${taskDescription}`
        );
        // TODO: Send to orchestrator
        taskInboxProvider.addTask(taskDescription);
      }
    })
  );

  // Generate Code
  context.subscriptions.push(
    vscode.commands.registerCommand('antigravity.generateCode', async () => {
      const prompt = await vscode.window.showInputBox({
        prompt: 'What code should I generate?',
        placeHolder: 'e.g., "React component for user profile"',
      });

      if (prompt) {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Generating code...',
            cancellable: true,
          },
          async () => {
            // TODO: Send to CodeGen agent
            await new Promise((resolve) => setTimeout(resolve, 2000));
            vscode.window.showInformationMessage('Code generated!');
          }
        );
      }
    })
  );

  // Review Code
  context.subscriptions.push(
    vscode.commands.registerCommand('antigravity.reviewCode', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('No active editor');
        return;
      }

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Reviewing code...',
          cancellable: true,
        },
        async () => {
          // TODO: Send to Review agent
          await new Promise((resolve) => setTimeout(resolve, 2000));
          vscode.window.showInformationMessage(
            `Code review complete for ${editor.document.fileName}`
          );
        }
      );
    })
  );

  // Run Tests
  context.subscriptions.push(
    vscode.commands.registerCommand('antigravity.runTests', async () => {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Running tests...',
          cancellable: true,
        },
        async () => {
          // TODO: Send to Test agent
          const terminal = vscode.window.createTerminal('AntiGravity Tests');
          terminal.show();
          terminal.sendText('npm test');
        }
      );
    })
  );

  // Create PR
  context.subscriptions.push(
    vscode.commands.registerCommand('antigravity.createPR', async () => {
      const title = await vscode.window.showInputBox({
        prompt: 'Pull Request Title',
        placeHolder: 'feat: Add new feature',
      });

      if (title) {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Creating Pull Request...',
            cancellable: true,
          },
          async () => {
            // TODO: Send to PR agent
            await new Promise((resolve) => setTimeout(resolve, 2000));
            vscode.window.showInformationMessage(`PR created: ${title}`);
          }
        );
      }
    })
  );

  // Analyze Issue
  context.subscriptions.push(
    vscode.commands.registerCommand('antigravity.analyzeIssue', async () => {
      const issueNumber = await vscode.window.showInputBox({
        prompt: 'Issue Number',
        placeHolder: '123',
      });

      if (issueNumber) {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `Analyzing issue #${issueNumber}...`,
            cancellable: true,
          },
          async () => {
            // TODO: Send to Issue agent
            await new Promise((resolve) => setTimeout(resolve, 2000));
            vscode.window.showInformationMessage(
              `Issue #${issueNumber} analyzed`
            );
          }
        );
      }
    })
  );

  // Start Agent
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'antigravity.startAgent',
      async (agentType?: string) => {
        if (!agentType) {
          agentType = await vscode.window.showQuickPick(
            [
              'coordinator',
              'codegen',
              'review',
              'issue',
              'pr',
              'deployment',
              'test',
            ],
            { placeHolder: 'Select agent to start' }
          );
        }

        if (agentType) {
          agentStatusProvider.setAgentStatus(agentType, 'running');
          vscode.window.showInformationMessage(`Agent ${agentType} started`);
        }
      }
    )
  );

  // Stop Agent
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'antigravity.stopAgent',
      async (agentType?: string) => {
        if (!agentType) {
          agentType = await vscode.window.showQuickPick(
            [
              'coordinator',
              'codegen',
              'review',
              'issue',
              'pr',
              'deployment',
              'test',
            ],
            { placeHolder: 'Select agent to stop' }
          );
        }

        if (agentType) {
          agentStatusProvider.setAgentStatus(agentType, 'stopped');
          vscode.window.showInformationMessage(`Agent ${agentType} stopped`);
        }
      }
    )
  );

  // Get Status
  context.subscriptions.push(
    vscode.commands.registerCommand('antigravity.getStatus', () => {
      const status = agentStatusProvider.getStatus();
      const running = status.filter((a) => a.status === 'running').length;
      vscode.window.showInformationMessage(
        `AntiGravity: ${running}/${status.length} agents running`
      );
    })
  );
}

/**
 * Extension deactivation
 */
export function deactivate() {
  console.log('[AntiGravity] Extension deactivating...');
}
