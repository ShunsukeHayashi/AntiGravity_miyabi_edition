/**
 * Agent Status Tree Data Provider
 * Provides agent status information for the VS Code tree view
 */

import * as vscode from 'vscode';

interface AgentInfo {
  name: string;
  status: 'running' | 'stopped' | 'error';
  icon: string;
  completedTasks: number;
}

export class AgentStatusProvider
  implements vscode.TreeDataProvider<AgentItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    AgentItem | undefined | null | void
  > = new vscode.EventEmitter<AgentItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    AgentItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private agents: Map<string, AgentInfo> = new Map([
    [
      'coordinator',
      { name: 'Coordinator', status: 'stopped', icon: '🎯', completedTasks: 0 },
    ],
    [
      'codegen',
      { name: 'CodeGen', status: 'stopped', icon: '💻', completedTasks: 0 },
    ],
    [
      'review',
      { name: 'Review', status: 'stopped', icon: '🔍', completedTasks: 0 },
    ],
    [
      'issue',
      { name: 'Issue', status: 'stopped', icon: '📝', completedTasks: 0 },
    ],
    ['pr', { name: 'PR', status: 'stopped', icon: '🔀', completedTasks: 0 }],
    [
      'deployment',
      { name: 'Deployment', status: 'stopped', icon: '🚀', completedTasks: 0 },
    ],
    ['test', { name: 'Test', status: 'stopped', icon: '🧪', completedTasks: 0 }],
  ]);

  getTreeItem(element: AgentItem): vscode.TreeItem {
    return element;
  }

  getChildren(_element?: AgentItem): Thenable<AgentItem[]> {
    const items: AgentItem[] = [];

    for (const [type, info] of this.agents) {
      items.push(new AgentItem(type, info));
    }

    return Promise.resolve(items);
  }

  setAgentStatus(
    agentType: string,
    status: 'running' | 'stopped' | 'error'
  ): void {
    const agent = this.agents.get(agentType);
    if (agent) {
      agent.status = status;
      this._onDidChangeTreeData.fire();
    }
  }

  incrementCompletedTasks(agentType: string): void {
    const agent = this.agents.get(agentType);
    if (agent) {
      agent.completedTasks++;
      this._onDidChangeTreeData.fire();
    }
  }

  getStatus(): AgentInfo[] {
    return Array.from(this.agents.values());
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class AgentItem extends vscode.TreeItem {
  constructor(
    public readonly agentType: string,
    public readonly info: AgentInfo
  ) {
    super(info.name, vscode.TreeItemCollapsibleState.None);

    this.tooltip = `${info.name} Agent - ${info.status}\nCompleted tasks: ${info.completedTasks}`;
    this.description = info.status;

    // Set icon based on status
    if (info.status === 'running') {
      this.iconPath = new vscode.ThemeIcon(
        'debug-start',
        new vscode.ThemeColor('charts.green')
      );
    } else if (info.status === 'error') {
      this.iconPath = new vscode.ThemeIcon(
        'error',
        new vscode.ThemeColor('errorForeground')
      );
    } else {
      this.iconPath = new vscode.ThemeIcon('debug-stop');
    }

    // Context value for menus
    this.contextValue =
      info.status === 'running' ? 'runningAgent' : 'stoppedAgent';

    // Command on click
    this.command = {
      command:
        info.status === 'running'
          ? 'antigravity.stopAgent'
          : 'antigravity.startAgent',
      title: info.status === 'running' ? 'Stop Agent' : 'Start Agent',
      arguments: [agentType],
    };
  }
}
