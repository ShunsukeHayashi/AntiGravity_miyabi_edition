/**
 * 基底エージェントクラス
 */

import type { IAgent } from '../types/agent';
import type { Task, TaskResult, AgentConfig, AgentType } from '../types/common';
import { logger } from '../utils/logger';
import { executeWithRetry } from '../utils/retry';

/**
 * 基底エージェント抽象クラス
 */
export abstract class BaseAgent implements IAgent {
  public readonly id: string;
  public readonly type: AgentType;
  public readonly config: AgentConfig;

  protected initialized: boolean = false;

  constructor(type: AgentType, config: Partial<AgentConfig> = {}) {
    this.id = `${type}-${Date.now()}`;
    this.type = type;
    this.config = {
      name: config.name || type,
      type,
      enabled: config.enabled !== undefined ? config.enabled : true,
      maxRetries: config.maxRetries || 3,
      timeout: config.timeout || 120000, // 2分
    };
  }

  /**
   * 初期化
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      logger.warn(`Agent ${this.id} is already initialized`);
      return;
    }

    logger.info(`Initializing agent: ${this.id}`);
    await this.onInitialize();
    this.initialized = true;
    logger.info(`Agent ${this.id} initialized successfully`);
  }

  /**
   * タスク実行
   */
  async execute(task: Task): Promise<TaskResult> {
    if (!this.initialized) {
      throw new Error(`Agent ${this.id} is not initialized`);
    }

    if (!this.config.enabled) {
      throw new Error(`Agent ${this.id} is disabled`);
    }

    const startTime = Date.now();
    logger.info(`Agent ${this.id} executing task: ${task.id}`, {
      taskTitle: task.title,
      taskType: task.type,
    });

    try {
      const result = await executeWithRetry(
        () => this.executeWithTimeout(task),
        {
          maxRetries: this.config.maxRetries,
          backoffMs: 1000,
          backoffMultiplier: 2,
        },
        `${this.id}:${task.id}`
      );

      const duration = Date.now() - startTime;
      logger.info(`Agent ${this.id} completed task: ${task.id}`, {
        duration,
        success: true,
      });

      return {
        taskId: task.id,
        success: true,
        data: result,
        duration,
        timestamp: new Date(),
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`Agent ${this.id} failed task: ${task.id}`, {
        duration,
        error: (error as Error).message,
      });

      return {
        taskId: task.id,
        success: false,
        error: error as Error,
        duration,
        timestamp: new Date(),
      };
    }
  }

  /**
   * タイムアウト付き実行
   */
  private async executeWithTimeout(task: Task): Promise<unknown> {
    return Promise.race([
      this.onExecute(task),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Execution timeout')), this.config.timeout)
      ),
    ]);
  }

  /**
   * 停止
   */
  async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    logger.info(`Shutting down agent: ${this.id}`);
    await this.onShutdown();
    this.initialized = false;
    logger.info(`Agent ${this.id} shut down successfully`);
  }

  /**
   * ヘルスチェック
   */
  async healthCheck(): Promise<boolean> {
    try {
      return await this.onHealthCheck();
    } catch (error) {
      logger.error(`Health check failed for agent: ${this.id}`, {
        error: (error as Error).message,
      });
      return false;
    }
  }

  /**
   * 初期化時のフック（サブクラスで実装）
   */
  protected abstract onInitialize(): Promise<void>;

  /**
   * 実行時のフック（サブクラスで実装）
   */
  protected abstract onExecute(task: Task): Promise<unknown>;

  /**
   * 停止時のフック（サブクラスで実装）
   */
  protected abstract onShutdown(): Promise<void>;

  /**
   * ヘルスチェックのフック（サブクラスで実装）
   */
  protected abstract onHealthCheck(): Promise<boolean>;
}
