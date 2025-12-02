# コード生成ガイドライン

AntiGravity IDE プロジェクトにおける AI 駆動コード生成の原則とベストプラクティスです。

## 基本方針

### モジュール分割

- **main.ts はエントリーポイントのみ**: アプリケーションの起動処理のみを記述
- **機能ごとに独立したファイル**: 各機能は専用ファイルに実装
- **再利用可能な設計**: モジュール間の依存関係を最小化

### ファイル構成例

```
src/
├── main.ts                    # Electronメインプロセス（起動処理のみ）
├── agent/
│   ├── manager.ts            # AgentManager実装
│   ├── coordinator.ts        # CoordinatorAgent実装
│   └── types.ts              # Agent型定義
├── browser/
│   ├── controller.ts         # Browserコントローラー
│   └── automation.ts         # 自動化ロジック
└── utils/
    ├── logger.ts             # ロギングユーティリティ
    └── config.ts             # 設定管理
```

## コード生成の原則

### 1. 機能の独立性

新しい機能は必ず専用ファイルに実装します。

```typescript
// ❌ Bad: main.ts に直接実装
// main.ts
import { app } from 'electron';

function createAgent() {
  // エージェント作成ロジック...
}

app.on('ready', () => {
  createAgent();
});
```

```typescript
// ✅ Good: 専用ファイルに実装
// src/agent/factory.ts
export function createAgent(config: AgentConfig): Agent {
  // エージェント作成ロジック...
}

// main.ts
import { app } from 'electron';
import { createAgent } from './agent/factory';

app.on('ready', () => {
  const agent = createAgent(defaultConfig);
  agent.start();
});
```

### 2. デモ用コードの分離

機能のデモンストレーションは専用の関数/ファイルに記述します。

```typescript
// ✅ Good: デモ用関数を分離
// src/agent/demo.ts
import { AgentManager } from './manager';

/**
 * AgentManagerのデモンストレーション
 */
export async function demoAgentManager(): Promise<void> {
  const manager = new AgentManager();

  // デモ用のタスクを作成
  const task = await manager.createTask({
    title: 'サンプルタスク',
    type: 'feature',
  });

  // タスクを実行
  const result = await manager.executeTask(task.id);
  console.log('実行結果:', result);
}

// main.ts
import { demoAgentManager } from './agent/demo';

// デモを実行する場合
if (process.env.DEMO_MODE) {
  demoAgentManager();
}
```

### 3. 型安全性の確保

すべてのコードは TypeScript の strict mode で型安全に記述します。

```typescript
// ✅ Good: 明示的な型定義
interface AgentConfig {
  name: string;
  type: AgentType;
  maxRetries: number;
}

type AgentType = 'coordinator' | 'codegen' | 'review' | 'test';

function createAgent(config: AgentConfig): Agent {
  return new Agent(config);
}

// ❌ Bad: 型定義なし
function createAgent(config) {
  return new Agent(config);
}
```

### 4. エラーハンドリング

エラーは適切にハンドリングし、カスタムエラークラスを使用します。

```typescript
// ✅ Good: カスタムエラーとハンドリング
// src/agent/errors.ts
export class AgentError extends Error {
  constructor(
    message: string,
    public readonly code: AgentErrorCode,
    public readonly agentId?: string
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export type AgentErrorCode =
  | 'AGENT_NOT_FOUND'
  | 'TASK_EXECUTION_FAILED'
  | 'INVALID_CONFIG';

// src/agent/manager.ts
export class AgentManager {
  async executeTask(taskId: string): Promise<TaskResult> {
    const agent = this.agents.get(taskId);

    if (!agent) {
      throw new AgentError(
        `Agent not found: ${taskId}`,
        'AGENT_NOT_FOUND',
        taskId
      );
    }

    try {
      return await agent.execute();
    } catch (error) {
      throw new AgentError(
        'Task execution failed',
        'TASK_EXECUTION_FAILED',
        taskId
      );
    }
  }
}
```

### 5. 非同期処理

非同期処理は async/await を使用し、適切にエラーハンドリングします。

```typescript
// ✅ Good: async/await とエラーハンドリング
async function loadAndExecuteAgent(configPath: string): Promise<Result> {
  try {
    const config = await loadConfig(configPath);
    const agent = await createAgent(config);
    const result = await agent.execute();
    return result;
  } catch (error) {
    logger.error('Agent execution failed', { error, configPath });
    throw error;
  }
}

// ❌ Bad: Promise チェーンの多用
function loadAndExecuteAgent(configPath: string): Promise<Result> {
  return loadConfig(configPath)
    .then(config => createAgent(config))
    .then(agent => agent.execute())
    .catch(error => {
      logger.error('Failed', error);
      throw error;
    });
}
```

## AI コード生成時の注意点

### CodeGenAgent による生成

CodeGenAgent がコードを生成する際は、以下を遵守します：

1. **既存コードの分析**: 既存のパターンとスタイルを踏襲
2. **依存関係の最小化**: 新しい外部ライブラリの追加は慎重に
3. **テストコードの同時生成**: 実装と同時にテストも生成
4. **ドキュメントの生成**: JSDoc コメントを必ず含める

### 生成コードのレビュー基準

ReviewAgent は以下の基準でコードを評価します（100点満点、80点以上で合格）：

- **型安全性** (20点): strict mode での型チェックに合格
- **可読性** (20点): 命名規則とコメントの適切性
- **保守性** (20点): モジュール分割と再利用性
- **セキュリティ** (20点): 脆弱性の不在
- **テスト** (20点): カバレッジ 80% 以上

## 実装パターン

### パターン 1: 新機能の追加

```typescript
// 1. 型定義（src/types/feature-x.ts）
export interface FeatureXConfig {
  enabled: boolean;
  options: Record<string, unknown>;
}

export interface FeatureXResult {
  success: boolean;
  data?: unknown;
  error?: Error;
}

// 2. 実装（src/features/feature-x.ts）
import type { FeatureXConfig, FeatureXResult } from '@/types/feature-x';

export class FeatureX {
  constructor(private config: FeatureXConfig) {}

  async execute(): Promise<FeatureXResult> {
    try {
      // 実装ロジック
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

// 3. テスト（src/features/feature-x.test.ts）
import { FeatureX } from './feature-x';

describe('FeatureX', () => {
  it('should execute successfully', async () => {
    const feature = new FeatureX({ enabled: true, options: {} });
    const result = await feature.execute();
    expect(result.success).toBe(true);
  });
});

// 4. デモ（src/features/demo-feature-x.ts）
import { FeatureX } from './feature-x';

export async function demoFeatureX(): Promise<void> {
  console.log('=== FeatureX Demo ===');

  const feature = new FeatureX({
    enabled: true,
    options: { debug: true },
  });

  const result = await feature.execute();
  console.log('Result:', result);
}

// 5. main.ts からの呼び出し
import { demoFeatureX } from './features/demo-feature-x';

if (process.env.DEMO_MODE) {
  await demoFeatureX();
}
```

### パターン 2: ユーティリティの追加

```typescript
// src/utils/string-helper.ts
/**
 * 文字列をケバブケースに変換
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * 文字列をキャメルケースに変換
 */
export function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

// テスト（src/utils/string-helper.test.ts）
import { toKebabCase, toCamelCase } from './string-helper';

describe('StringHelper', () => {
  describe('toKebabCase', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(toKebabCase('agentManager')).toBe('agent-manager');
    });
  });

  describe('toCamelCase', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(toCamelCase('agent-manager')).toBe('agentManager');
    });
  });
});
```

## コミット前チェックリスト

コード生成後、以下を確認します：

- [ ] TypeScript の型チェックが通る（`npm run typecheck`）
- [ ] ESLint でエラーがない（`npm run lint`）
- [ ] Prettier でフォーマット済み（`npm run format`）
- [ ] テストが全て成功（`npm test`）
- [ ] テストカバレッジが 80% 以上（`npm run test:coverage`）
- [ ] JSDoc コメントが記述されている
- [ ] デモコードが動作する

## 禁止事項

- ❌ main.ts に機能実装を直接記述
- ❌ テストなしでコード生成
- ❌ any 型の多用
- ❌ console.log のまま放置（logger を使用）
- ❌ エラーハンドリングの欠如
- ❌ 型定義の省略

## まとめ

このガイドラインに従うことで：

1. **保守性の高いコード**: モジュール分割により変更が容易
2. **品質の高いコード**: 型安全性とテストの確保
3. **一貫性のあるコード**: 統一されたパターンとスタイル
4. **自律的な開発**: AI エージェントによる自動生成と品質保証

が実現できます。

---

🌸 **Miyabi Framework** - 識学理論に基づく自律型開発
