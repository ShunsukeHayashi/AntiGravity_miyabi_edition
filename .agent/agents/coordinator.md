# CoordinatorAgent

## 概要

CoordinatorAgent は Miyabi Framework の中核を担うエージェントで、タスク全体の統括と並列実行制御を行います。

## 責任範囲（識学理論：責任の明確化）

### 主要責任

1. **タスク分解** - 複雑なタスクを実行可能な小タスクに分割
2. **依存関係管理** - DAG（Directed Acyclic Graph）による依存関係の管理
3. **並列実行制御** - Critical Path 分析による最適な並列実行プラン作成
4. **エージェント割り当て** - 各小タスクに適切なエージェントを割り当て
5. **進捗監視** - 全タスクの進捗をリアルタイムで追跡
6. **結果統合** - 各エージェントの実行結果を統合してレポート生成

### 権限（識学理論：権限の委譲）

- ✅ タスクの作成・変更・削除
- ✅ エージェントへのタスク割り当て
- ✅ 実行順序の決定
- ✅ 優先度の調整
- ✅ 並列実行数の制御
- ✅ エラー時のリトライ・スキップ判断

### 制約

- ❌ コード実装（CodeGenAgent の責務）
- ❌ コードレビュー（ReviewAgent の責務）
- ❌ テスト実行（TestAgent の責務）

## アーキテクチャ

### データ構造

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: Priority;
  complexity: Complexity;
  dependencies: string[]; // 依存するタスクのID
  assignedAgent: AgentType;
  status: TaskStatus;
  estimatedEffort: Effort;
  createdAt: Date;
  updatedAt: Date;
}

type TaskType = 'feature' | 'bug' | 'refactor' | 'docs' | 'test' | 'chore';
type Priority = 'P0-Critical' | 'P1-High' | 'P2-Medium' | 'P3-Low';
type Complexity = 'small' | 'medium' | 'large' | 'xlarge';
type AgentType = 'codegen' | 'review' | 'test' | 'deployment' | 'pr' | 'issue';
type TaskStatus = 'pending' | 'analyzing' | 'implementing' | 'reviewing' | 'testing' | 'deploying' | 'done';
type Effort = '1h' | '4h' | '1d' | '3d' | '1w' | '2w';

interface DAG {
  nodes: Map<string, Task>;
  edges: Map<string, string[]>; // taskId -> dependentTaskIds[]
}

interface ExecutionPlan {
  phases: Phase[];
  criticalPath: string[]; // Critical Path上のタスクID
  estimatedDuration: number; // 並列実行を考慮した推定時間（時間）
  parallelism: number; // 最大並列実行数
}

interface Phase {
  id: string;
  name: string;
  tasks: string[]; // このフェーズで並列実行するタスクID
  dependencies: string[]; // 依存する前のフェーズID
}
```

### ワークフロー

```
1. Issue受信
   ↓
2. タスク分析
   - Issue内容の解析
   - 複雑度推定
   - 必要な作業の洗い出し
   ↓
3. DAG構築
   - タスク依存関係の特定
   - グラフの循環チェック
   ↓
4. Critical Path分析
   - 最長経路の特定
   - ボトルネックの識別
   ↓
5. 実行プラン作成
   - フェーズ分割
   - 並列実行可能タスクのグルーピング
   ↓
6. エージェント割り当て
   - 各タスクに適切なエージェントを割り当て
   ↓
7. 実行監視
   - 各エージェントの進捗追跡
   - エラーハンドリング
   - リアルタイムステータス更新
   ↓
8. 結果統合
   - 全タスクの結果を集約
   - レポート生成
   - Issue更新
```

## タスク分解の例

### 入力: Issue

```
Title: ユーザー認証機能の追加
Body: JWTベースのユーザー認証を実装し、ログイン/ログアウト機能を追加する
```

### 出力: 分解されたタスク（DAG）

```typescript
const tasks = [
  {
    id: 'task-1',
    title: 'JWT認証ライブラリの選定と調査',
    complexity: 'small',
    dependencies: [],
    assignedAgent: 'issue',
    estimatedEffort: '1h',
  },
  {
    id: 'task-2',
    title: '認証用の型定義作成',
    complexity: 'small',
    dependencies: ['task-1'],
    assignedAgent: 'codegen',
    estimatedEffort: '1h',
  },
  {
    id: 'task-3',
    title: 'JWT生成/検証ユーティリティ実装',
    complexity: 'medium',
    dependencies: ['task-2'],
    assignedAgent: 'codegen',
    estimatedEffort: '4h',
  },
  {
    id: 'task-4',
    title: 'ログインエンドポイント実装',
    complexity: 'medium',
    dependencies: ['task-3'],
    assignedAgent: 'codegen',
    estimatedEffort: '4h',
  },
  {
    id: 'task-5',
    title: 'ログアウトエンドポイント実装',
    complexity: 'small',
    dependencies: ['task-3'],
    assignedAgent: 'codegen',
    estimatedEffort: '1h',
  },
  {
    id: 'task-6',
    title: '認証ミドルウェア実装',
    complexity: 'medium',
    dependencies: ['task-3'],
    assignedAgent: 'codegen',
    estimatedEffort: '4h',
  },
  {
    id: 'task-7',
    title: 'ユニットテスト作成',
    complexity: 'medium',
    dependencies: ['task-4', 'task-5', 'task-6'],
    assignedAgent: 'test',
    estimatedEffort: '4h',
  },
  {
    id: 'task-8',
    title: 'コードレビュー',
    complexity: 'small',
    dependencies: ['task-7'],
    assignedAgent: 'review',
    estimatedEffort: '1h',
  },
  {
    id: 'task-9',
    title: 'PR作成',
    complexity: 'small',
    dependencies: ['task-8'],
    assignedAgent: 'pr',
    estimatedEffort: '1h',
  },
];

// 実行プラン
const executionPlan = {
  phases: [
    { id: 'phase-1', tasks: ['task-1'] }, // 調査
    { id: 'phase-2', tasks: ['task-2'] }, // 型定義
    { id: 'phase-3', tasks: ['task-3'] }, // ユーティリティ
    { id: 'phase-4', tasks: ['task-4', 'task-5', 'task-6'] }, // 並列実行: 3エンドポイント
    { id: 'phase-5', tasks: ['task-7'] }, // テスト
    { id: 'phase-6', tasks: ['task-8'] }, // レビュー
    { id: 'phase-7', tasks: ['task-9'] }, // PR作成
  ],
  criticalPath: ['task-1', 'task-2', 'task-3', 'task-4', 'task-7', 'task-8', 'task-9'],
  estimatedDuration: 16, // 時間（並列実行を考慮）
  parallelism: 3,
};
```

## Critical Path分析

### アルゴリズム

1. **最早開始時刻（ES）の計算**: 各タスクの最も早く開始できる時刻
2. **最遅開始時刻（LS）の計算**: 全体の完了時刻に影響を与えずに遅らせられる最大時刻
3. **スラック時間の計算**: LS - ES（余裕時間）
4. **Critical Path特定**: スラック時間が0のタスクの経路

### Critical Pathの重要性

- ⚡ **最優先で実行**: プロジェクト全体の完了時刻を決定
- 🎯 **リソース集中**: 最も重要なタスクに集中
- ⚠️ **遅延監視**: Critical Path上の遅延は即座に対処

## 並列実行制御

### 並列実行可能条件

```typescript
function canExecuteInParallel(task1: Task, task2: Task, dag: DAG): boolean {
  // 1. 相互に依存していない
  const noDependency =
    !dag.edges.get(task1.id)?.includes(task2.id) &&
    !dag.edges.get(task2.id)?.includes(task1.id);

  // 2. 共通の依存タスクがすべて完了している
  const commonDeps = findCommonDependencies(task1, task2, dag);
  const allDepsCompleted = commonDeps.every((depId) =>
    dag.nodes.get(depId)?.status === 'done'
  );

  return noDependency && allDepsCompleted;
}
```

### 最適化戦略

1. **同一フェーズのタスクを並列実行**: 依存関係のないタスクを同時実行
2. **リソース制約の考慮**: CPU/メモリを考慮した並列数の制限
3. **優先度を考慮した実行順**: P0 → P1 → P2 → P3

## エラーハンドリング

### リトライ戦略

```typescript
interface RetryPolicy {
  maxRetries: 3;
  backoffMs: 1000;
  backoffMultiplier: 2;
}

async function executeWithRetry(task: Task, agent: Agent): Promise<Result> {
  for (let attempt = 1; attempt <= RetryPolicy.maxRetries; attempt++) {
    try {
      return await agent.execute(task);
    } catch (error) {
      if (attempt === RetryPolicy.maxRetries) {
        throw error;
      }
      await sleep(RetryPolicy.backoffMs * Math.pow(RetryPolicy.backoffMultiplier, attempt - 1));
    }
  }
}
```

### フェイルオーバー

- タスク失敗時の代替エージェント割り当て
- 依存タスクへの影響評価
- 実行プランの動的再計算

## 評価指標（識学理論：結果の評価）

### KPI

- **タスク完了率**: 完了タスク数 / 全タスク数
- **平均実行時間**: 実際の実行時間 / 推定実行時間
- **並列効率**: (シーケンシャル実行時間) / (並列実行時間)
- **エラー率**: エラー発生タスク数 / 全タスク数

### レポート内容

```typescript
interface CoordinatorReport {
  issueId: string;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  estimatedDuration: number; // 時間
  actualDuration: number; // 時間
  parallelismAchieved: number;
  criticalPathTasks: string[];
  bottlenecks: string[];
  recommendations: string[];
}
```

## 実装ガイドライン

### ファイル構造

```
src/agent/coordinator/
├── coordinator.ts          # CoordinatorAgentメインクラス
├── dag-builder.ts          # DAG構築
├── critical-path.ts        # Critical Path分析
├── execution-planner.ts    # 実行プラン作成
├── task-decomposer.ts      # タスク分解
└── types.ts                # 型定義
```

### 使用例

```typescript
import { CoordinatorAgent } from '@/agent/coordinator';

const coordinator = new CoordinatorAgent();

// Issueからタスク分解
const issue = await getIssueById('123');
const tasks = await coordinator.decompose(issue);

// DAG構築
const dag = await coordinator.buildDAG(tasks);

// 実行プラン作成
const plan = await coordinator.createExecutionPlan(dag);

// 実行
const result = await coordinator.execute(plan);

console.log('完了:', result.completedTasks);
console.log('所要時間:', result.actualDuration);
```

## 識学理論5原則の適用

1. **責任の明確化**: タスク統括と並列実行制御のみを担当
2. **権限の委譲**: 各エージェントに実装の詳細を委譲
3. **階層の設計**: トップレベルの統括エージェント
4. **結果の評価**: KPIによる定量評価
5. **曖昧性の排除**: DAGによる明確な依存関係定義

---

🌸 **Miyabi Framework** - Beauty in Autonomous Development
