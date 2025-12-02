---
description: Refactor existing code to improve quality and maintainability
---

# コードリファクタリングワークフロー

既存のコードをリファクタリングして、可読性・保守性・パフォーマンスを改善するための標準手順です。

## 目的

- コードの可読性向上
- 保守性の改善
- パフォーマンスの最適化
- 技術的負債の解消
- テストカバレッジの維持・向上

## 前提条件

- 既存コードが動作している
- テストが存在する（または作成する）
- リファクタリングの目的が明確
- Git で作業ブランチを作成済み

## 手順

### ステップ 1: 現状分析

リファクタリング対象のコードを分析します。

**分析項目**:
- コードの複雑度（Cyclomatic Complexity）
- 重複コード（Code Duplication）
- 長すぎる関数・クラス
- 命名の不適切さ
- 型安全性の欠如
- テストカバレッジ

**ツール**:
```bash
# ESLint で問題を特定
npm run lint

# TypeScript の型エラーを確認
npm run typecheck

# テストカバレッジを確認
npm run test:coverage
```

**ドキュメント化**:
```markdown
## リファクタリング対象
- ファイル: src/agent/manager.ts
- 問題:
  - executeTask メソッドが長すぎる（150行）
  - エラーハンドリングが不十分
  - 型定義が不明確（any の使用）
- 目標:
  - メソッドを分割（各30行以下）
  - カスタムエラーを導入
  - 型安全性を確保
```

### ステップ 2: テストの準備

リファクタリング前に、現在の動作を保証するテストを作成または確認します。

**既存テストの確認**:
```bash
# 対象ファイルのテストを実行
npm test -- agent-manager.test.ts

# カバレッジを確認
npm run test:coverage
```

**不足しているテストを追加**:
```typescript
// リファクタリング前に既存動作を保証
describe('AgentManager - Before Refactoring', () => {
  it('should maintain current behavior', async () => {
    const manager = new AgentManager();
    const result = await manager.executeTask('task-1');

    // 現在の動作を記録
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
```

**チェックポイント**:
- [ ] すべてのテストが成功
- [ ] カバレッジが既存レベル以上
- [ ] 主要な機能がテストされている

### ステップ 3: リファクタリング計画

具体的なリファクタリング手順を計画します。

**リファクタリングパターン**:

1. **関数の抽出（Extract Function）**
   - 長い関数を小さな関数に分割

2. **変数の抽出（Extract Variable）**
   - 複雑な式を変数に置き換え

3. **クラスの抽出（Extract Class）**
   - 大きなクラスを責任ごとに分割

4. **条件式の分解（Decompose Conditional）**
   - 複雑な条件式を関数に抽出

5. **マジックナンバーの定数化**
   - 数値リテラルを定数に置き換え

**計画例**:
```markdown
## リファクタリング計画

### Phase 1: 関数の分割
- executeTask を以下に分割:
  1. validateTask
  2. findAgent
  3. executeWithAgent
  4. handleResult

### Phase 2: 型定義の改善
- any を具体的な型に置き換え
- カスタムエラー型を定義

### Phase 3: エラーハンドリングの改善
- try-catch を適切に配置
- カスタムエラークラスを使用
```

### ステップ 4: 段階的なリファクタリング

小さな変更を繰り返し、各ステップでテストを実行します。

**Phase 1: 関数の分割**

```typescript
// Before: 長いメソッド
class AgentManager {
  async executeTask(taskId: string): Promise<TaskResult> {
    // 150行の処理...
  }
}

// After: 分割されたメソッド
class AgentManager {
  async executeTask(taskId: string): Promise<TaskResult> {
    const task = await this.validateTask(taskId);
    const agent = this.findAgent(task);
    const result = await this.executeWithAgent(agent, task);
    return this.handleResult(result);
  }

  private async validateTask(taskId: string): Promise<Task> {
    // バリデーション処理（30行以下）
  }

  private findAgent(task: Task): Agent {
    // Agent検索処理（30行以下）
  }

  private async executeWithAgent(agent: Agent, task: Task): Promise<RawResult> {
    // 実行処理（30行以下）
  }

  private handleResult(rawResult: RawResult): TaskResult {
    // 結果処理（30行以下）
  }
}
```

**テスト実行**:
```bash
npm test -- agent-manager.test.ts
```

**Phase 2: 型定義の改善**

```typescript
// Before: any の使用
function processData(data: any): any {
  return data.process();
}

// After: 具体的な型
interface ProcessableData {
  id: string;
  type: DataType;
  content: string;
}

interface ProcessedResult {
  success: boolean;
  processedData: string;
  timestamp: number;
}

function processData(data: ProcessableData): ProcessedResult {
  return {
    success: true,
    processedData: data.content.toUpperCase(),
    timestamp: Date.now(),
  };
}
```

**Phase 3: エラーハンドリングの改善**

```typescript
// Before: 基本的な Error
throw new Error('Task execution failed');

// After: カスタムエラークラス
// src/agent/errors.ts
export class AgentError extends Error {
  constructor(
    message: string,
    public readonly code: AgentErrorCode,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export type AgentErrorCode =
  | 'AGENT_NOT_FOUND'
  | 'TASK_VALIDATION_FAILED'
  | 'EXECUTION_TIMEOUT'
  | 'INVALID_CONFIGURATION';

// 使用例
throw new AgentError(
  'Task validation failed',
  'TASK_VALIDATION_FAILED',
  { taskId, errors: validationErrors }
);
```

**各フェーズ後のチェック**:
```bash
# 型チェック
npm run typecheck

# テスト
npm test

# リント
npm run lint
```

### ステップ 5: テストの更新

リファクタリング後、テストを更新・追加します。

```typescript
describe('AgentManager - After Refactoring', () => {
  describe('executeTask', () => {
    it('should validate task before execution', async () => {
      // 新しい動作をテスト
    });

    it('should throw AgentError for invalid task', async () => {
      await expect(manager.executeTask('invalid')).rejects.toThrow(AgentError);
    });
  });

  describe('private methods', () => {
    // 必要に応じてプライベートメソッドをテスト
    // （publicインターフェース経由で）
  });
});
```

**カバレッジ確認**:
```bash
npm run test:coverage
# 目標: 80% 以上を維持
```

### ステップ 6: ドキュメントの更新

リファクタリング内容をドキュメント化します。

```typescript
/**
 * Agent Manager
 *
 * 複数のAgentを統括管理するクラス。
 *
 * @example
 * ```typescript
 * const manager = new AgentManager({
 *   maxConcurrency: 3,
 *   defaultTimeout: 5000,
 * });
 *
 * manager.registerAgent(agentConfig);
 * const result = await manager.executeTask('task-1');
 * ```
 *
 * @remarks
 * リファクタリング履歴:
 * - 2025-12-02: executeTaskメソッドを分割、型安全性を改善
 */
export class AgentManager {
  // ...
}
```

### ステップ 7: コードレビュー

リファクタリング内容をレビューします。

**ReviewAgent チェックリスト**:
- [ ] 型安全性: strict mode で型チェック合格
- [ ] 可読性: 関数が短く、命名が適切
- [ ] 保守性: モジュール分割が適切
- [ ] セキュリティ: 脆弱性なし
- [ ] テスト: カバレッジ 80% 以上

**手動レビュー**:
- コードの可読性が向上したか
- 保守性が改善されたか
- パフォーマンスが低下していないか
- すべてのテストが成功するか

## 品質チェック

```bash
# 完全なチェック
npm run typecheck && npm run lint && npm test && npm run test:coverage
```

## チェックリスト

リファクタリング完了前に以下を確認：

- [ ] すべてのテストが成功
- [ ] テストカバレッジが維持または向上
- [ ] 型チェックが成功
- [ ] ESLint がエラーゼロ
- [ ] Prettier でフォーマット済み
- [ ] JSDoc が更新されている
- [ ] パフォーマンスが低下していない
- [ ] 既存の動作が保証されている
- [ ] ReviewAgent の評価が 80点以上

## 成果物

リファクタリング完了時、以下が更新されます：

```
src/<category>/
├── <feature-name>.ts            # リファクタリング済み実装
├── <feature-name>.test.ts       # 更新されたテスト
├── <feature-name>.types.ts      # 改善された型定義（必要に応じて）
└── errors.ts                    # カスタムエラー（必要に応じて）
```

## リファクタリングパターン集

### パターン 1: 長い関数の分割

```typescript
// Before
function processOrder(order: any) {
  // 100行のコード
}

// After
function processOrder(order: Order): OrderResult {
  const validOrder = validateOrder(order);
  const payment = processPayment(validOrder);
  const shipment = arrangeShipment(validOrder, payment);
  return createOrderResult(validOrder, payment, shipment);
}
```

### パターン 2: 複雑な条件式の単純化

```typescript
// Before
if (user.role === 'admin' && user.isActive && user.permissions.includes('write')) {
  // ...
}

// After
function canUserWrite(user: User): boolean {
  return user.role === 'admin' && user.isActive && user.permissions.includes('write');
}

if (canUserWrite(user)) {
  // ...
}
```

### パターン 3: マジックナンバーの定数化

```typescript
// Before
if (retryCount > 3) { /* ... */ }
setTimeout(callback, 5000);

// After
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;

if (retryCount > MAX_RETRY_COUNT) { /* ... */ }
setTimeout(callback, DEFAULT_TIMEOUT_MS);
```

## エスカレーション

以下の場合は TechLead にエスカレーション：

- 大規模なアーキテクチャ変更が必要
- 既存の API を破壊する変更が必要
- パフォーマンス影響が大きい
- 複数モジュールに影響がある

## 参考資料

- [Refactoring: Improving the Design of Existing Code](https://refactoring.com/)
- [コーディング規約](../rules/code-style-guide.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

🌸 **Miyabi Framework** - 識学理論に基づく自律型開発
