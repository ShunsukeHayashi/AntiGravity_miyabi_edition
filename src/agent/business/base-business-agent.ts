/**
 * Base Business Agent
 * Foundation for all 14 business agents
 */

export interface BusinessAgentConfig {
  name: string;
  displayName: string;
  emoji: string;
  role: string;
  description: string;
  capabilities: string[];
  priority: number;
  maxConcurrent: number;
}

export interface BusinessTask {
  id: string;
  type: string;
  input: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface BusinessResult {
  success: boolean;
  agentName: string;
  taskId: string;
  output: Record<string, unknown>;
  duration: number;
  timestamp: number;
}

/**
 * Abstract base class for business agents
 */
export abstract class BaseBusinessAgent {
  protected config: BusinessAgentConfig;
  protected initialized: boolean = false;

  constructor(config: BusinessAgentConfig) {
    this.config = config;
  }

  get name(): string {
    return this.config.name;
  }

  get displayName(): string {
    return this.config.displayName;
  }

  get emoji(): string {
    return this.config.emoji;
  }

  async initialize(): Promise<void> {
    console.log(`[${this.emoji} ${this.displayName}] Initializing...`);
    await this.onInitialize();
    this.initialized = true;
    console.log(`[${this.emoji} ${this.displayName}] Initialized`);
  }

  async execute(task: BusinessTask): Promise<BusinessResult> {
    if (!this.initialized) {
      throw new Error(`${this.displayName} is not initialized`);
    }

    const startTime = Date.now();
    console.log(`[${this.emoji} ${this.displayName}] Executing task: ${task.id}`);

    try {
      const output = await this.onExecute(task);
      const duration = Date.now() - startTime;

      return {
        success: true,
        agentName: this.name,
        taskId: task.id,
        output,
        duration,
        timestamp: Date.now(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${this.emoji} ${this.displayName}] Task failed:`, error);

      return {
        success: false,
        agentName: this.name,
        taskId: task.id,
        output: { error: error instanceof Error ? error.message : 'Unknown error' },
        duration,
        timestamp: Date.now(),
      };
    }
  }

  async shutdown(): Promise<void> {
    console.log(`[${this.emoji} ${this.displayName}] Shutting down...`);
    await this.onShutdown();
    this.initialized = false;
  }

  getCapabilities(): string[] {
    return this.config.capabilities;
  }

  getStatus(): { initialized: boolean; config: BusinessAgentConfig } {
    return {
      initialized: this.initialized,
      config: this.config,
    };
  }

  protected abstract onInitialize(): Promise<void>;
  protected abstract onExecute(task: BusinessTask): Promise<Record<string, unknown>>;
  protected abstract onShutdown(): Promise<void>;
}
