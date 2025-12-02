---
description: Implement a new feature following AntiGravity IDE standards
---

# 新機能実装ワークフロー

新しい機能を実装するための標準手順です。このワークフローに従うことで、型安全で保守性の高いコードを生成できます。

## 目的

- 新機能を段階的に実装
- モジュール分割による保守性の確保
- テストファーストアプローチ
- 品質基準（80点以上）の達成

## 前提条件

- TypeScript 開発環境がセットアップ済み
- `npm install` が完了している
- Git で作業ブランチを作成済み

## 手順

### ステップ 1: 要件の明確化

機能要件を明確にします：

- **機能名**: 何を実装するか
- **目的**: なぜ必要か
- **入力/出力**: どのようなデータを扱うか
- **依存関係**: 他のモジュールとの関係

**例**:
```
機能名: AgentManager
目的: 複数のAgentを統括管理する
入力: AgentConfig, TaskId
出力: TaskResult
依存関係: Agent, Task, Logger
```

### ステップ 2: 型定義の作成

まず型定義ファイルを作成します（型ファースト）。

**ファイル**: `src/<category>/<feature-name>.types.ts`

```typescript
// src/agent/agent-manager.types.ts

/**
 * Agent設定
 */
export interface AgentConfig {
  name: string;
  type: AgentType;
  maxRetries: number;
  timeout: number;
}

/**
 * Agentタイプ
 */
export type AgentType = 'coordinator' | 'codegen' | 'review' | 'test';

/**
 * タスク実行結果
 */
export interface TaskResult {
  success: boolean;
  taskId: string;
  duration: number;
  error?: Error;
}

/**
 * Agent Manager オプション
 */
export interface AgentManagerOptions {
  maxConcurrency: number;
  defaultTimeout: number;
}
```

**チェックポイント**:
- [ ] すべての型がエクスポートされている
- [ ] JSDoc コメントが記述されている
- [ ] `any` を使用していない

### ステップ 3: 実装ファイルの作成

型定義に基づいて実装します。

**ファイル**: `src/<category>/<feature-name>.ts`

```typescript
// src/agent/agent-manager.ts
import type { AgentConfig, AgentManagerOptions, TaskResult } from './agent-manager.types';
import { logger } from '@/utils/logger';

/**
 * Agent Manager
 * 複数のAgentを統括管理するクラス
 */
export class AgentManager {
  private agents: Map<string, Agent> = new Map();
  private options: AgentManagerOptions;

  constructor(options: AgentManagerOptions) {
    this.options = options;
    logger.info('AgentManager initialized', { options });
  }

  /**
   * Agentを登録
   */
  registerAgent(config: AgentConfig): void {
    const agent = this.createAgent(config);
    this.agents.set(config.name, agent);
    logger.info('Agent registered', { name: config.name });
  }

  /**
   * タスクを実行
   */
  async executeTask(taskId: string): Promise<TaskResult> {
    const startTime = Date.now();

    try {
      // 実装ロジック
      const agent = this.findAgentForTask(taskId);

      if (!agent) {
        throw new AgentError('No suitable agent found', 'AGENT_NOT_FOUND');
      }

      const result = await agent.execute(taskId);
      const duration = Date.now() - startTime;

      logger.info('Task executed', { taskId, duration });

      return {
        success: true,
        taskId,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      logger.error('Task execution failed', { taskId, error, duration });

      return {
        success: false,
        taskId,
        duration,
        error: error as Error,
      };
    }
  }

  private createAgent(config: AgentConfig): Agent {
    // Agent 作成ロジック
  }

  private findAgentForTask(taskId: string): Agent | undefined {
    // タスクに適したAgentを検索
  }
}
```

**チェックポイント**:
- [ ] モジュール分割されている（main.ts に書いていない）
- [ ] エラーハンドリングが適切
- [ ] ロギングが適切
- [ ] JSDoc コメントが記述されている
- [ ] async/await を使用

### ステップ 4: テストファイルの作成

実装と同時にテストを作成します。

**ファイル**: `src/<category>/<feature-name>.test.ts`

```typescript
// src/agent/agent-manager.test.ts
import { AgentManager } from './agent-manager';
import type { AgentConfig } from './agent-manager.types';

describe('AgentManager', () => {
  let manager: AgentManager;

  beforeEach(() => {
    manager = new AgentManager({
      maxConcurrency: 3,
      defaultTimeout: 5000,
    });
  });

  describe('registerAgent', () => {
    it('should register agent successfully', () => {
      const config: AgentConfig = {
        name: 'test-agent',
        type: 'codegen',
        maxRetries: 3,
        timeout: 5000,
      };

      expect(() => manager.registerAgent(config)).not.toThrow();
    });

    it('should throw error for invalid config', () => {
      const config = { name: '' } as AgentConfig;
      expect(() => manager.registerAgent(config)).toThrow();
    });
  });

  describe('executeTask', () => {
    beforeEach(() => {
      manager.registerAgent({
        name: 'test-agent',
        type: 'codegen',
        maxRetries: 3,
        timeout: 5000,
      });
    });

    it('should execute task successfully', async () => {
      const result = await manager.executeTask('task-1');

      expect(result.success).toBe(true);
      expect(result.taskId).toBe('task-1');
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should handle task execution error', async () => {
      const result = await manager.executeTask('invalid-task');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should respect timeout setting', async () => {
      // タイムアウトのテスト
    });
  });
});
```

**チェックポイント**:
- [ ] 主要な機能をテスト
- [ ] エラーケースをテスト
- [ ] カバレッジ 80% 以上
- [ ] テストが独立している

### ステップ 5: デモファイルの作成（オプション）

機能のデモンストレーションを作成します。

**ファイル**: `src/<category>/demo-<feature-name>.ts`

```typescript
// src/agent/demo-agent-manager.ts
import { AgentManager } from './agent-manager';
import type { AgentConfig } from './agent-manager.types';

/**
 * AgentManager のデモンストレーション
 */
export async function demoAgentManager(): Promise<void> {
  console.log('=== AgentManager Demo ===\n');

  // 1. AgentManager を作成
  const manager = new AgentManager({
    maxConcurrency: 3,
    defaultTimeout: 5000,
  });
  console.log('✓ AgentManager created');

  // 2. Agent を登録
  const agentConfigs: AgentConfig[] = [
    { name: 'codegen', type: 'codegen', maxRetries: 3, timeout: 5000 },
    { name: 'review', type: 'review', maxRetries: 2, timeout: 3000 },
    { name: 'test', type: 'test', maxRetries: 3, timeout: 10000 },
  ];

  for (const config of agentConfigs) {
    manager.registerAgent(config);
    console.log(`✓ Agent registered: ${config.name}`);
  }

  // 3. タスクを実行
  console.log('\nExecuting tasks...');

  const result = await manager.executeTask('demo-task-1');

  if (result.success) {
    console.log(`✓ Task completed in ${result.duration}ms`);
  } else {
    console.log(`✗ Task failed: ${result.error?.message}`);
  }

  console.log('\n=== Demo Complete ===');
}

// main.ts から呼び出す場合
// import { demoAgentManager } from './agent/demo-agent-manager';
// if (process.env.DEMO_MODE) {
//   await demoAgentManager();
// }
```

**チェックポイント**:
- [ ] 主要な機能を実演
- [ ] 実行可能なコード
- [ ] わかりやすいコメント

### ステップ 6: main.ts への統合

必要に応じて main.ts から呼び出します。

```typescript
// main.ts
import { app } from 'electron';
import { AgentManager } from './agent/agent-manager';

// デモモードの場合
if (process.env.DEMO_MODE) {
  import('./agent/demo-agent-manager').then(({ demoAgentManager }) => {
    demoAgentManager();
  });
}

// 本番モード
app.on('ready', () => {
  const manager = new AgentManager({
    maxConcurrency: 3,
    defaultTimeout: 5000,
  });

  // 初期化処理...
});
```

## 品質チェック

実装後、以下をすべて確認します：

```bash
# 型チェック
npm run typecheck

# リント
npm run lint

# フォーマット
npm run format

# テスト
npm test

# カバレッジ
npm run test:coverage
```

## チェックリスト

実装完了前に以下を確認：

- [ ] 型定義ファイルが作成されている
- [ ] 実装ファイルが作成されている
- [ ] テストファイルが作成されている（カバレッジ 80%以上）
- [ ] デモファイルが作成されている（オプション）
- [ ] JSDoc コメントが記述されている
- [ ] エラーハンドリングが適切
- [ ] `npm run typecheck` が成功
- [ ] `npm run lint` がエラーゼロ
- [ ] `npm test` がすべて成功
- [ ] ReviewAgent の評価が 80点以上
- [ ] `any` 型を使用していない
- [ ] main.ts に直接実装していない

## 成果物

このワークフローの完了時、以下のファイルが生成されます：

```
src/<category>/
├── <feature-name>.types.ts      # 型定義
├── <feature-name>.ts            # 実装
├── <feature-name>.test.ts       # テスト
└── demo-<feature-name>.ts       # デモ（オプション）
```

## エスカレーション

以下の場合は TechLead にエスカレーションします：

- アーキテクチャ判断が必要
- 既存システムへの大規模な変更が必要
- 外部ライブラリの追加が必要
- セキュリティ懸念がある

## 参考資料

- [コーディング規約](../rules/code-style-guide.md)
- [コード生成ガイドライン](../rules/code-generation-guide.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

🌸 **Miyabi Framework** - 識学理論に基づく自律型開発
