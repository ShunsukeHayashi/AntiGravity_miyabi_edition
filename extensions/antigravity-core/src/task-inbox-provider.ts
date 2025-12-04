/**
 * Task Inbox Tree Data Provider
 * Provides task list for the VS Code tree view
 */

import * as vscode from 'vscode';

interface TaskInfo {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'critical' | 'high' | 'normal' | 'low';
  assignedAgent?: string;
  createdAt: number;
}

type TaskTreeItem = TaskItem | EmptyTaskItem;

export class TaskInboxProvider implements vscode.TreeDataProvider<TaskTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    TaskTreeItem | undefined | null | void
  > = new vscode.EventEmitter<TaskTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    TaskTreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  private tasks: TaskInfo[] = [];
  private taskIdCounter = 0;

  getTreeItem(element: TaskTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(_element?: TaskTreeItem): Thenable<TaskTreeItem[]> {
    if (this.tasks.length === 0) {
      return Promise.resolve([new EmptyTaskItem()]);
    }

    const items = this.tasks.map((task) => new TaskItem(task));
    return Promise.resolve(items);
  }

  addTask(
    description: string,
    priority: TaskInfo['priority'] = 'normal',
    assignedAgent?: string
  ): string {
    const taskId = `task-${++this.taskIdCounter}`;
    const task: TaskInfo = {
      id: taskId,
      description,
      status: 'pending',
      priority,
      assignedAgent,
      createdAt: Date.now(),
    };

    this.tasks.unshift(task);
    this._onDidChangeTreeData.fire();
    return taskId;
  }

  updateTaskStatus(
    taskId: string,
    status: TaskInfo['status']
  ): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      this._onDidChangeTreeData.fire();
    }
  }

  removeTask(taskId: string): void {
    const index = this.tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this._onDidChangeTreeData.fire();
    }
  }

  clearCompleted(): void {
    this.tasks = this.tasks.filter((t) => t.status !== 'completed');
    this._onDidChangeTreeData.fire();
  }

  getTaskCount(): { pending: number; inProgress: number; completed: number } {
    return {
      pending: this.tasks.filter((t) => t.status === 'pending').length,
      inProgress: this.tasks.filter((t) => t.status === 'in_progress').length,
      completed: this.tasks.filter((t) => t.status === 'completed').length,
    };
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class TaskItem extends vscode.TreeItem {
  constructor(public readonly task: TaskInfo) {
    super(task.description, vscode.TreeItemCollapsibleState.None);

    this.tooltip = `${task.description}\nStatus: ${task.status}\nPriority: ${task.priority}${task.assignedAgent ? `\nAgent: ${task.assignedAgent}` : ''}`;
    this.description = task.status;

    // Set icon based on status
    switch (task.status) {
      case 'pending':
        this.iconPath = new vscode.ThemeIcon('circle-outline');
        break;
      case 'in_progress':
        this.iconPath = new vscode.ThemeIcon(
          'loading~spin',
          new vscode.ThemeColor('charts.blue')
        );
        break;
      case 'completed':
        this.iconPath = new vscode.ThemeIcon(
          'check',
          new vscode.ThemeColor('charts.green')
        );
        break;
      case 'failed':
        this.iconPath = new vscode.ThemeIcon(
          'x',
          new vscode.ThemeColor('errorForeground')
        );
        break;
    }

    // Priority indicator
    if (task.priority === 'critical') {
      this.iconPath = new vscode.ThemeIcon(
        'flame',
        new vscode.ThemeColor('errorForeground')
      );
    }

    this.contextValue = `task-${task.status}`;
  }
}

class EmptyTaskItem extends vscode.TreeItem {
  constructor() {
    super('No tasks in inbox', vscode.TreeItemCollapsibleState.None);
    this.iconPath = new vscode.ThemeIcon('inbox');
    this.description = 'Use "Execute Task" to add tasks';
  }
}
