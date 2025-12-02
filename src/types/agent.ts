/**
 * エージェント関連の型定義
 */

import type { Task, TaskResult, AgentConfig, AgentType } from './common';

/**
 * 基底エージェントインターフェース
 */
export interface IAgent {
  readonly id: string;
  readonly type: AgentType;
  readonly config: AgentConfig;

  /**
   * エージェントを初期化
   */
  initialize(): Promise<void>;

  /**
   * タスクを実行
   */
  execute(task: Task): Promise<TaskResult>;

  /**
   * エージェントを停止
   */
  shutdown(): Promise<void>;

  /**
   * ヘルスチェック
   */
  healthCheck(): Promise<boolean>;
}

/**
 * CoordinatorAgent 固有の型
 */
export namespace CoordinatorAgent {
  /**
   * DAGノード
   */
  export interface DAGNode {
    taskId: string;
    task: Task;
    dependencies: string[];
    dependents: string[];
  }

  /**
   * DAGグラフ
   */
  export interface DAG {
    nodes: Map<string, DAGNode>;
    edges: Map<string, string[]>;
  }

  /**
   * 実行フェーズ
   */
  export interface ExecutionPhase {
    id: string;
    name: string;
    tasks: string[];
    dependencies: string[];
  }

  /**
   * 実行プラン
   */
  export interface ExecutionPlan {
    phases: ExecutionPhase[];
    criticalPath: string[];
    estimatedDuration: number;
    parallelism: number;
  }

  /**
   * レポート
   */
  export interface Report {
    issueId: string;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    estimatedDuration: number;
    actualDuration: number;
    parallelismAchieved: number;
    criticalPathTasks: string[];
    bottlenecks: string[];
    recommendations: string[];
  }
}

/**
 * IssueAgent 固有の型
 */
export namespace IssueAgent {
  /**
   * Issue分析結果
   */
  export interface AnalysisResult {
    issueId: string;
    title: string;
    type: Task['type'];
    complexity: Task['complexity'];
    estimatedEffort: Task['estimatedEffort'];
    priority: Task['priority'];
    labels: string[];
    impact: 'breaking' | 'major' | 'minor' | 'patch';
    category: string[];
    requirements: string[];
    risks: string[];
    dependencies: string[];
    recommendations: string[];
  }

  /**
   * ラベル予測
   */
  export interface Prediction {
    label: string;
    confidence: number;
  }
}

/**
 * CodeGenAgent 固有の型
 */
export namespace CodeGenAgent {
  /**
   * 生成されたコード
   */
  export interface GeneratedCode {
    files: Map<string, string>;
    tests: Map<string, string>;
    docs: Map<string, string>;
  }

  /**
   * コード生成レポート
   */
  export interface Report {
    taskId: string;
    filesGenerated: string[];
    linesOfCode: number;
    testCoverage: number;
    qualityScore: number;
    typeErrors: number;
    lintErrors: number;
    securityIssues: number;
    generationTime: number;
  }
}

/**
 * ReviewAgent 固有の型
 */
export namespace ReviewAgent {
  /**
   * レビュースコア
   */
  export interface ReviewScore {
    typeSafety: number; // 20点満点
    readability: number; // 20点満点
    maintainability: number; // 20点満点
    security: number; // 20点満点
    testing: number; // 20点満点
  }

  /**
   * Issue
   */
  export interface Issue {
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    file: string;
    line: number;
    message: string;
    suggestion: string;
  }

  /**
   * レビューレポート
   */
  export interface Report {
    taskId: string;
    files: string[];
    scores: ReviewScore;
    totalScore: number;
    passed: boolean;
    issues: Issue[];
    suggestions: string[];
    reviewedAt: Date;
    reviewer: 'ReviewAgent';
  }
}

/**
 * TestAgent 固有の型
 */
export namespace TestAgent {
  /**
   * テストサマリー
   */
  export interface TestSummary {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  }

  /**
   * カバレッジ
   */
  export interface Coverage {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  }

  /**
   * テスト失敗
   */
  export interface TestFailure {
    testName: string;
    file: string;
    error: string;
    stack: string;
    suggestion: string;
  }

  /**
   * テストレポート
   */
  export interface Report {
    taskId: string;
    summary: TestSummary;
    coverage: Coverage;
    failures: TestFailure[];
    performance: {
      slowestTests: Array<{ name: string; duration: number }>;
      memoryUsage: number;
    };
    passed: boolean;
    testedAt: Date;
  }
}

/**
 * PRAgent 固有の型
 */
export namespace PRAgent {
  /**
   * コミット
   */
  export interface Commit {
    sha: string;
    message: string;
    author: string;
    timestamp: Date;
  }

  /**
   * PRレポート
   */
  export interface Report {
    taskId: string;
    issueId: string;
    prNumber: number;
    prUrl: string;
    branch: string;
    commits: Commit[];
    filesChanged: number;
    additions: number;
    deletions: number;
    reviewers: string[];
    labels: string[];
    isDraft: boolean;
    createdAt: Date;
  }
}

/**
 * DeploymentAgent 固有の型
 */
export namespace DeploymentAgent {
  /**
   * デプロイ環境
   */
  export type Environment = 'development' | 'staging' | 'production';

  /**
   * デプロイ戦略
   */
  export type Strategy = 'blue-green' | 'canary' | 'rolling';

  /**
   * ヘルスチェック
   */
  export interface HealthCheck {
    endpoint: string;
    status: 'passed' | 'failed';
    responseTime: number;
  }

  /**
   * デプロイレポート
   */
  export interface Report {
    deploymentId: string;
    environment: Environment;
    version: string;
    prNumber: number;
    strategy: Strategy;
    startedAt: Date;
    completedAt: Date;
    duration: number;
    status: 'success' | 'failed' | 'rolled-back';
    healthChecks: HealthCheck[];
    metrics: {
      buildTime: number;
      testTime: number;
      deployTime: number;
    };
    rollback: {
      executed: boolean;
      reason?: string;
      duration?: number;
    };
  }
}
