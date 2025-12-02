/**
 * 共通型定義
 * Miyabi Framework で使用される基本的な型定義
 */

/**
 * タスクタイプ
 */
export type TaskType = 'feature' | 'bug' | 'refactor' | 'docs' | 'test' | 'chore' | 'security';

/**
 * 優先度
 */
export type Priority = 'P0-Critical' | 'P1-High' | 'P2-Medium' | 'P3-Low';

/**
 * 複雑度
 */
export type Complexity = 'small' | 'medium' | 'large' | 'xlarge';

/**
 * エージェントタイプ
 */
export type AgentType =
  | 'coordinator'
  | 'issue'
  | 'codegen'
  | 'review'
  | 'test'
  | 'pr'
  | 'deployment';

/**
 * タスク状態
 */
export type TaskStatus =
  | 'pending'
  | 'analyzing'
  | 'implementing'
  | 'reviewing'
  | 'testing'
  | 'deploying'
  | 'done';

/**
 * 作業工数
 */
export type Effort = '1h' | '4h' | '1d' | '3d' | '1w' | '2w';

/**
 * 影響範囲
 */
export type Impact = 'breaking' | 'major' | 'minor' | 'patch';

/**
 * カテゴリ
 */
export type Category = 'frontend' | 'backend' | 'infra' | 'dx' | 'security';

/**
 * 実行ポリシー
 */
export type ExecutionPolicy = 'off' | 'auto' | 'turbo';

/**
 * プランニングモード
 */
export type PlanningMode = 'planning' | 'fast';

/**
 * タスク定義
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: Priority;
  complexity: Complexity;
  dependencies: string[];
  assignedAgent: AgentType;
  status: TaskStatus;
  estimatedEffort: Effort;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * タスク実行結果
 */
export interface TaskResult {
  taskId: string;
  success: boolean;
  data?: unknown;
  error?: Error;
  duration: number; // ミリ秒
  timestamp: Date;
}

/**
 * エージェント設定
 */
export interface AgentConfig {
  name: string;
  type: AgentType;
  enabled: boolean;
  maxRetries: number;
  timeout: number; // ミリ秒
}

/**
 * エラーコード
 */
export type ErrorCode =
  | 'AGENT_NOT_FOUND'
  | 'TASK_EXECUTION_FAILED'
  | 'INVALID_CONFIG'
  | 'TIMEOUT'
  | 'DEPENDENCY_ERROR'
  | 'VALIDATION_ERROR';

/**
 * カスタムエラー
 */
export class AgentError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly agentId?: string
  ) {
    super(message);
    this.name = 'AgentError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * ロガー設定
 */
export interface LoggerConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'text';
  output: 'console' | 'file';
}

/**
 * ログエントリ
 */
export interface LogEntry {
  timestamp: Date;
  level: string;
  message: string;
  context?: Record<string, unknown>;
  agentId?: string;
  taskId?: string;
}
