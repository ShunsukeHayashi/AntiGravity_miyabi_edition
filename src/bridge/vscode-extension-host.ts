/**
 * VS Code Extension Host Bridge
 * Connects VS Code Extension API to AntiGravity Agent System
 */

import { AgentOrchestrator } from '../orchestrator/agent-orchestrator';
import { MessageBus, AgentMessage } from '../orchestrator/message-bus';
import { TaskQueue, Task } from '../orchestrator/task-queue';

export interface WorkspaceState {
  folders: string[];
  activeFile?: string;
  openFiles: string[];
  gitBranch?: string;
  gitStatus?: string;
}

export interface ExtensionContext {
  subscriptions: { dispose: () => void }[];
  extensionPath: string;
  globalState: Map<string, unknown>;
  workspaceState: Map<string, unknown>;
}

export interface CommandHandler {
  command: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => void | Promise<void> | unknown;
}

/**
 * AntiGravity Extension Bridge
 * Bridges VS Code Extension API with AntiGravity Agent System
 */
export class AntiGravityExtensionBridge {
  private orchestrator: AgentOrchestrator;
  private messageBus: MessageBus;
  private taskQueue: TaskQueue;
  private commands: Map<string, CommandHandler>;
  private workspaceState: WorkspaceState;

  constructor() {
    this.orchestrator = new AgentOrchestrator();
    this.messageBus = new MessageBus();
    this.taskQueue = new TaskQueue();
    this.commands = new Map();
    this.workspaceState = {
      folders: [],
      openFiles: [],
    };
  }

  /**
   * Initialize the extension bridge
   */
  async initialize(): Promise<void> {
    console.log('[AntiGravity] Initializing Extension Bridge...');

    // Register core commands
    this.registerCoreCommands();

    // Start message bus
    this.messageBus.start();

    // Initialize orchestrator
    await this.orchestrator.initialize(this.messageBus);

    console.log('[AntiGravity] Extension Bridge initialized');
  }

  /**
   * Register AntiGravity commands
   */
  registerCommands(context: ExtensionContext): void {
    // Mission Control
    this.registerCommand(context, {
      command: 'antigravity.openMissionControl',
      title: 'AntiGravity: Open Mission Control',
      handler: () => this.openMissionControl(),
    });

    // Agent management
    this.registerCommand(context, {
      command: 'antigravity.startAgent',
      title: 'AntiGravity: Start Agent',
      handler: (agentType: string) => this.orchestrator.startAgent(agentType),
    });

    this.registerCommand(context, {
      command: 'antigravity.stopAgent',
      title: 'AntiGravity: Stop Agent',
      handler: (agentType: string) => this.orchestrator.stopAgent(agentType),
    });

    this.registerCommand(context, {
      command: 'antigravity.restartAgent',
      title: 'AntiGravity: Restart Agent',
      handler: async (agentType: string) => {
        await this.orchestrator.stopAgent(agentType);
        await this.orchestrator.startAgent(agentType);
      },
    });

    // Task execution
    this.registerCommand(context, {
      command: 'antigravity.executeTask',
      title: 'AntiGravity: Execute Task',
      handler: async (taskDescription: string) => {
        if (taskDescription) {
          await this.orchestrator.executeTask(taskDescription);
        }
      },
    });

    // Quick actions
    this.registerCommand(context, {
      command: 'antigravity.generateCode',
      title: 'AntiGravity: Generate Code',
      handler: async (prompt: string) => {
        const task: Task = {
          id: crypto.randomUUID(),
          description: prompt,
          priority: 'normal',
          dependencies: [],
          assignedAgent: 'codegen',
          status: 'pending',
        };
        this.taskQueue.enqueue(task);
        await this.orchestrator.executeTask(prompt, 'codegen');
      },
    });

    this.registerCommand(context, {
      command: 'antigravity.reviewCode',
      title: 'AntiGravity: Review Code',
      handler: async (filePath?: string) => {
        const file = filePath || this.workspaceState.activeFile;
        if (file) {
          await this.orchestrator.executeTask(`Review code in ${file}`, 'review');
        }
      },
    });

    this.registerCommand(context, {
      command: 'antigravity.runTests',
      title: 'AntiGravity: Run Tests',
      handler: async () => {
        await this.orchestrator.executeTask('Run all tests', 'test');
      },
    });

    this.registerCommand(context, {
      command: 'antigravity.createPR',
      title: 'AntiGravity: Create Pull Request',
      handler: async () => {
        await this.orchestrator.executeTask('Create pull request', 'pr');
      },
    });

    this.registerCommand(context, {
      command: 'antigravity.analyzeIssue',
      title: 'AntiGravity: Analyze Issue',
      handler: async (issueNumber: number) => {
        await this.orchestrator.executeTask(`Analyze issue #${issueNumber}`, 'issue');
      },
    });

    // Status commands
    this.registerCommand(context, {
      command: 'antigravity.getStatus',
      title: 'AntiGravity: Get Status',
      handler: () => this.getStatus(),
    });

    this.registerCommand(context, {
      command: 'antigravity.showAgentLogs',
      title: 'AntiGravity: Show Agent Logs',
      handler: (agentType?: string) => this.showAgentLogs(agentType),
    });
  }

  /**
   * Register a single command
   */
  private registerCommand(
    context: ExtensionContext,
    handler: CommandHandler
  ): void {
    this.commands.set(handler.command, handler);
    context.subscriptions.push({
      dispose: () => {
        this.commands.delete(handler.command);
      },
    });
  }

  /**
   * Register core internal commands
   */
  private registerCoreCommands(): void {
    // Agent message handler
    this.messageBus.subscribe('bridge', (message: AgentMessage) => {
      this.handleAgentMessage(message);
    });
  }

  /**
   * Handle agent messages
   */
  private handleAgentMessage(message: AgentMessage): void {
    switch (message.type) {
      case 'STATUS_UPDATE':
        console.log(`[Agent ${message.from}] Status: ${message.payload.status}`);
        break;
      case 'TASK_COMPLETE':
        console.log(`[Agent ${message.from}] Task completed: ${message.payload.taskId}`);
        break;
      case 'ERROR':
        console.error(`[Agent ${message.from}] Error: ${message.payload.error}`);
        break;
      default:
        console.log(`[Agent ${message.from}] ${message.type}: ${JSON.stringify(message.payload)}`);
    }
  }

  /**
   * Open Mission Control panel
   */
  openMissionControl(): void {
    console.log('[AntiGravity] Opening Mission Control...');
    // Emit event to open Mission Control UI
    this.messageBus.publish({
      id: crypto.randomUUID(),
      from: 'bridge',
      to: 'broadcast',
      type: 'MISSION_CONTROL_OPEN' as AgentMessage['type'],
      payload: {},
      timestamp: Date.now(),
    });
  }

  /**
   * Update workspace state from VS Code
   */
  syncWorkspaceState(state: Partial<WorkspaceState>): void {
    this.workspaceState = {
      ...this.workspaceState,
      ...state,
    };
    this.orchestrator.updateContext(this.workspaceState);
  }

  /**
   * Get current status
   */
  getStatus(): {
    orchestrator: ReturnType<AgentOrchestrator['getStatus']>;
    workspace: WorkspaceState;
    taskQueue: { pending: number; inProgress: number };
  } {
    return {
      orchestrator: this.orchestrator.getStatus(),
      workspace: this.workspaceState,
      taskQueue: {
        pending: this.taskQueue.getPendingCount(),
        inProgress: this.taskQueue.getInProgressCount(),
      },
    };
  }

  /**
   * Show agent logs
   */
  showAgentLogs(agentType?: string): void {
    console.log(`[AntiGravity] Showing logs for ${agentType || 'all agents'}`);
    // TODO: Implement log viewer
  }

  /**
   * Execute a registered command
   */
  async executeCommand(command: string, ...args: unknown[]): Promise<void> {
    const handler = this.commands.get(command);
    if (handler) {
      await handler.handler(...args);
    } else {
      console.warn(`[AntiGravity] Unknown command: ${command}`);
    }
  }

  /**
   * Dispose the extension bridge
   */
  async dispose(): Promise<void> {
    console.log('[AntiGravity] Disposing Extension Bridge...');
    await this.orchestrator.shutdown();
    this.messageBus.stop();
    this.commands.clear();
  }
}

// Export singleton instance
export const extensionBridge = new AntiGravityExtensionBridge();
