/**
 * Agent Orchestrator
 * Manages agent lifecycle, task distribution, and coordination
 */

import { MessageBus, AgentMessage } from './message-bus';
import { TaskQueue, Task, TaskPriority } from './task-queue';
import { WorkspaceState } from '../bridge/vscode-extension-host';

export type AgentType =
  | 'coordinator'
  | 'codegen'
  | 'review'
  | 'issue'
  | 'pr'
  | 'deployment'
  | 'test';

export type AgentStatus = 'stopped' | 'starting' | 'running' | 'stopping' | 'error';

export interface AgentInfo {
  type: AgentType;
  status: AgentStatus;
  startedAt?: number;
  lastActivity?: number;
  currentTask?: string;
  completedTasks: number;
  failedTasks: number;
}

export interface OrchestratorConfig {
  autoStart: boolean;
  defaultAgents: AgentType[];
  taskTimeout: number;
  maxRetries: number;
}

const DEFAULT_CONFIG: OrchestratorConfig = {
  autoStart: true,
  defaultAgents: ['coordinator'],
  taskTimeout: 300000, // 5 minutes
  maxRetries: 3,
};

/**
 * Agent Orchestrator - Central coordinator for all agents
 */
export class AgentOrchestrator {
  private agents: Map<AgentType, AgentInfo>;
  private messageBus: MessageBus | null;
  private taskQueue: TaskQueue;
  private config: OrchestratorConfig;
  private workspaceContext: WorkspaceState | null;
  private initialized: boolean;
  private unsubscribe: (() => void) | null;

  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.agents = new Map();
    this.messageBus = null;
    this.taskQueue = new TaskQueue();
    this.workspaceContext = null;
    this.initialized = false;
    this.unsubscribe = null;

    // Initialize agent info
    this.initializeAgentInfo();
  }

  /**
   * Initialize agent information
   */
  private initializeAgentInfo(): void {
    const agentTypes: AgentType[] = [
      'coordinator',
      'codegen',
      'review',
      'issue',
      'pr',
      'deployment',
      'test',
    ];

    for (const type of agentTypes) {
      this.agents.set(type, {
        type,
        status: 'stopped',
        completedTasks: 0,
        failedTasks: 0,
      });
    }
  }

  /**
   * Initialize the orchestrator
   */
  async initialize(messageBus: MessageBus): Promise<void> {
    if (this.initialized) {
      console.warn('[Orchestrator] Already initialized');
      return;
    }

    console.log('[Orchestrator] Initializing...');
    this.messageBus = messageBus;

    // Subscribe to messages
    this.unsubscribe = this.messageBus.subscribeToBroadcast((message) => {
      this.handleMessage(message);
    });

    // Start default agents if configured
    if (this.config.autoStart) {
      for (const agentType of this.config.defaultAgents) {
        await this.startAgent(agentType);
      }
    }

    this.initialized = true;
    console.log('[Orchestrator] Initialized');
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: AgentMessage): void {
    switch (message.type) {
      case 'TASK_COMPLETE':
        this.handleTaskComplete(message);
        break;
      case 'ERROR':
        this.handleAgentError(message);
        break;
      case 'STATUS_UPDATE':
        this.handleStatusUpdate(message);
        break;
    }
  }

  /**
   * Handle task completion
   */
  private handleTaskComplete(message: AgentMessage): void {
    const { taskId, result } = message.payload as {
      taskId: string;
      result: unknown;
    };
    this.taskQueue.complete(taskId, result);

    const agent = this.agents.get(message.from as AgentType);
    if (agent) {
      agent.completedTasks++;
      agent.lastActivity = Date.now();
      agent.currentTask = undefined;
    }

    // Process next task
    this.processNextTask();
  }

  /**
   * Handle agent error
   */
  private handleAgentError(message: AgentMessage): void {
    const { taskId, error } = message.payload as {
      taskId?: string;
      error: string;
    };

    if (taskId) {
      this.taskQueue.fail(taskId, error);
    }

    const agent = this.agents.get(message.from as AgentType);
    if (agent) {
      agent.failedTasks++;
      agent.lastActivity = Date.now();
      agent.currentTask = undefined;
    }

    console.error(`[Orchestrator] Agent ${message.from} error: ${error}`);
  }

  /**
   * Handle status update
   */
  private handleStatusUpdate(message: AgentMessage): void {
    const { status } = message.payload as { status: AgentStatus };
    const agent = this.agents.get(message.from as AgentType);
    if (agent) {
      agent.status = status;
      agent.lastActivity = Date.now();
    }
  }

  /**
   * Start an agent
   */
  async startAgent(agentType: AgentType | string): Promise<void> {
    const type = agentType as AgentType;
    const agent = this.agents.get(type);

    if (!agent) {
      console.error(`[Orchestrator] Unknown agent type: ${agentType}`);
      return;
    }

    if (agent.status === 'running') {
      console.log(`[Orchestrator] Agent ${type} already running`);
      return;
    }

    console.log(`[Orchestrator] Starting agent: ${type}`);
    agent.status = 'starting';

    // Simulate agent startup
    await new Promise((resolve) => setTimeout(resolve, 100));

    agent.status = 'running';
    agent.startedAt = Date.now();

    this.messageBus?.publish({
      id: crypto.randomUUID(),
      from: 'orchestrator',
      to: 'broadcast',
      type: 'AGENT_STARTED',
      payload: { agentType: type },
      timestamp: Date.now(),
    });

    console.log(`[Orchestrator] Agent ${type} started`);
  }

  /**
   * Stop an agent
   */
  async stopAgent(agentType: AgentType | string): Promise<void> {
    const type = agentType as AgentType;
    const agent = this.agents.get(type);

    if (!agent) {
      console.error(`[Orchestrator] Unknown agent type: ${agentType}`);
      return;
    }

    if (agent.status === 'stopped') {
      console.log(`[Orchestrator] Agent ${type} already stopped`);
      return;
    }

    console.log(`[Orchestrator] Stopping agent: ${type}`);
    agent.status = 'stopping';

    // Simulate agent shutdown
    await new Promise((resolve) => setTimeout(resolve, 100));

    agent.status = 'stopped';
    agent.currentTask = undefined;

    this.messageBus?.publish({
      id: crypto.randomUUID(),
      from: 'orchestrator',
      to: 'broadcast',
      type: 'AGENT_STOPPED',
      payload: { agentType: type },
      timestamp: Date.now(),
    });

    console.log(`[Orchestrator] Agent ${type} stopped`);
  }

  /**
   * Execute a task
   */
  async executeTask(
    description: string,
    assignedAgent?: AgentType | string
  ): Promise<string> {
    const taskId = crypto.randomUUID();

    const task: Task = {
      id: taskId,
      description,
      priority: this.inferPriority(description),
      dependencies: [],
      assignedAgent: assignedAgent as AgentType | undefined,
      status: 'pending',
      createdAt: Date.now(),
    };

    // Auto-assign agent if not specified
    if (!task.assignedAgent) {
      task.assignedAgent = this.determineAgent(description);
    }

    // Ensure agent is running
    if (task.assignedAgent && this.isValidAgentType(task.assignedAgent)) {
      const agent = this.agents.get(task.assignedAgent);
      if (agent?.status !== 'running') {
        await this.startAgent(task.assignedAgent);
      }
    }

    this.taskQueue.enqueue(task);
    console.log(
      `[Orchestrator] Task ${taskId} queued for ${task.assignedAgent || 'auto-assign'}`
    );

    // Trigger processing
    this.processNextTask();

    return taskId;
  }

  /**
   * Infer task priority from description
   */
  private inferPriority(description: string): TaskPriority {
    const lower = description.toLowerCase();

    if (
      lower.includes('critical') ||
      lower.includes('urgent') ||
      lower.includes('hotfix')
    ) {
      return 'critical';
    }
    if (
      lower.includes('important') ||
      lower.includes('high priority') ||
      lower.includes('security')
    ) {
      return 'high';
    }
    if (lower.includes('minor') || lower.includes('low priority')) {
      return 'low';
    }

    return 'normal';
  }

  /**
   * Determine which agent should handle a task
   */
  private determineAgent(description: string): AgentType {
    const lower = description.toLowerCase();

    if (
      lower.includes('generate') ||
      lower.includes('create') ||
      lower.includes('implement') ||
      lower.includes('write code')
    ) {
      return 'codegen';
    }
    if (lower.includes('review') || lower.includes('check')) {
      return 'review';
    }
    if (lower.includes('test') || lower.includes('coverage')) {
      return 'test';
    }
    if (lower.includes('issue') || lower.includes('bug') || lower.includes('analyze')) {
      return 'issue';
    }
    if (lower.includes('pr') || lower.includes('pull request') || lower.includes('merge')) {
      return 'pr';
    }
    if (lower.includes('deploy') || lower.includes('release')) {
      return 'deployment';
    }

    return 'coordinator';
  }

  /**
   * Check if string is valid agent type
   */
  private isValidAgentType(type: string): type is AgentType {
    return [
      'coordinator',
      'codegen',
      'review',
      'issue',
      'pr',
      'deployment',
      'test',
    ].includes(type);
  }

  /**
   * Process the next task in queue
   */
  private processNextTask(): void {
    const task = this.taskQueue.dequeue();
    if (!task) {
      return;
    }

    const agentTypeStr = task.assignedAgent || 'coordinator';
    const agentType: AgentType = this.isValidAgentType(agentTypeStr)
      ? agentTypeStr
      : 'coordinator';
    const agent = this.agents.get(agentType);

    if (!agent || agent.status !== 'running') {
      // Re-queue task
      task.status = 'pending';
      this.taskQueue.enqueue(task);
      return;
    }

    agent.currentTask = task.id;
    agent.lastActivity = Date.now();

    console.log(`[Orchestrator] Assigning task ${task.id} to ${agentType}`);

    // Send task to agent
    this.messageBus?.publish({
      id: crypto.randomUUID(),
      from: 'orchestrator',
      to: agentType,
      type: 'TASK_REQUEST',
      payload: {
        taskId: task.id,
        description: task.description,
        priority: task.priority,
        context: this.workspaceContext,
      },
      timestamp: Date.now(),
    });
  }

  /**
   * Update workspace context
   */
  updateContext(context: WorkspaceState): void {
    this.workspaceContext = context;

    this.messageBus?.publish({
      id: crypto.randomUUID(),
      from: 'orchestrator',
      to: 'broadcast',
      type: 'CONTEXT_UPDATE',
      payload: { context: context as unknown as Record<string, unknown> },
      timestamp: Date.now(),
    });
  }

  /**
   * Get orchestrator status
   */
  getStatus(): {
    initialized: boolean;
    agents: AgentInfo[];
    taskQueue: ReturnType<TaskQueue['getStats']>;
  } {
    return {
      initialized: this.initialized,
      agents: Array.from(this.agents.values()),
      taskQueue: this.taskQueue.getStats(),
    };
  }

  /**
   * Get agent info
   */
  getAgentInfo(agentType: AgentType): AgentInfo | undefined {
    return this.agents.get(agentType);
  }

  /**
   * Get running agents
   */
  getRunningAgents(): AgentInfo[] {
    return Array.from(this.agents.values()).filter(
      (agent) => agent.status === 'running'
    );
  }

  /**
   * Shutdown the orchestrator
   */
  async shutdown(): Promise<void> {
    console.log('[Orchestrator] Shutting down...');

    // Stop all running agents
    for (const [type, agent] of this.agents) {
      if (agent.status === 'running') {
        await this.stopAgent(type);
      }
    }

    // Unsubscribe from message bus
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    this.initialized = false;
    console.log('[Orchestrator] Shutdown complete');
  }
}
