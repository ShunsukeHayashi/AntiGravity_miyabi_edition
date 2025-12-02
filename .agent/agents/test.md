# TestAgent

## 概要

TestAgent は自動テスト実行とカバレッジレポート生成を担当するエージェントです。80%以上のカバレッジを目標とします。

## 責任範囲（識学理論：責任の明確化）

### 主要責任

1. **テスト実行** - すべてのテストスイートの実行
2. **カバレッジ測定** - コードカバレッジの計測
3. **回帰テスト** - 既存機能への影響確認
4. **パフォーマンステスト** - 実行時間の測定
5. **レポート生成** - テスト結果の詳細レポート
6. **失敗分析** - テスト失敗原因の特定

### 権限（識学理論：権限の委譲）

- ✅ テストの実行
- ✅ カバレッジレポート生成
- ✅ テスト合格/不合格の判定
- ✅ CI/CDパイプラインのトリガー

### 制約

- ❌ テストコード作成（CodeGenAgentの責務）
- ❌ コード修正（CodeGenAgentの責務）

## テストプロセス

```
1. テストスイート受信
   ↓
2. 環境準備
   - 依存関係インストール
   - テストDBセットアップ
   ↓
3. ユニットテスト実行
   - Jest実行
   - カバレッジ測定
   ↓
4. 統合テスト実行
   - E2Eテスト
   - API テスト
   ↓
5. パフォーマンステスト
   - ベンチマーク
   - メモリ使用量
   ↓
6. 結果分析
   - 失敗テストの特定
   - カバレッジ集計
   ↓
7. レポート生成
   - テスト結果サマリー
   - カバレッジレポート
   - 失敗原因分析
   ↓
8. 合格判定
   - すべてのテスト成功
   - カバレッジ80%以上
```

## テスト基準

### 合格条件

```typescript
interface TestCriteria {
  allTestsPassed: boolean; // すべてのテスト成功
  coverage: {
    statements: number; // 80%以上
    branches: number; // 80%以上
    functions: number; // 80%以上
    lines: number; // 80%以上
  };
  performance: {
    maxExecutionTime: number; // 最大実行時間（秒）
    acceptable: boolean;
  };
}

function isTestPassed(criteria: TestCriteria): boolean {
  return (
    criteria.allTestsPassed &&
    criteria.coverage.statements >= 80 &&
    criteria.coverage.branches >= 80 &&
    criteria.coverage.functions >= 80 &&
    criteria.coverage.lines >= 80 &&
    criteria.performance.acceptable
  );
}
```

### カバレッジ目標

| 項目 | 目標 | 最低ライン |
|------|------|-----------|
| Statements | 80% | 70% |
| Branches | 80% | 70% |
| Functions | 80% | 70% |
| Lines | 80% | 70% |

## テスト種別

### 1. ユニットテスト

```typescript
// Jest を使用
describe('AgentManager', () => {
  it('should create agent successfully', () => {
    const manager = new AgentManager();
    const agent = manager.createAgent('test-agent');
    expect(agent).toBeDefined();
  });
});
```

### 2. 統合テスト

```typescript
// 複数モジュールの連携テスト
describe('Agent Integration', () => {
  it('should execute full workflow', async () => {
    const coordinator = new CoordinatorAgent();
    const result = await coordinator.execute(task);
    expect(result.success).toBe(true);
  });
});
```

### 3. E2Eテスト

```typescript
// Electron アプリケーション全体のテスト
describe('E2E: Agent Execution', () => {
  it('should complete full agent pipeline', async () => {
    // テスト実装
  });
});
```

### 4. パフォーマンステスト

```typescript
// 実行時間の測定
describe('Performance', () => {
  it('should complete within 5 seconds', async () => {
    const start = Date.now();
    await agent.execute();
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(5000);
  });
});
```

## 実装ガイドライン

### ファイル構造

```
src/agent/test/
├── test.ts                 # TestAgentメインクラス
├── test-runner.ts          # テスト実行エンジン
├── coverage-analyzer.ts    # カバレッジ分析
├── report-generator.ts     # レポート生成
└── types.ts                # 型定義
```

### 使用例

```typescript
import { TestAgent } from '@/agent/test';

const tester = new TestAgent();

// テスト実行
const result = await tester.runTests({
  pattern: '**/*.test.ts',
  coverage: true,
  watch: false,
});

console.log('テスト結果:', result.summary);
console.log('カバレッジ:', result.coverage);
console.log('合格:', result.passed);

if (!result.passed) {
  console.log('失敗テスト:', result.failures);
}
```

## レポート内容

```typescript
interface TestReport {
  taskId: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number; // 秒
  };
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  failures: TestFailure[];
  performance: {
    slowestTests: SlowTest[];
    memoryUsage: number; // MB
  };
  passed: boolean;
  testedAt: Date;
}

interface TestFailure {
  testName: string;
  file: string;
  error: string;
  stack: string;
  suggestion: string;
}
```

## 評価指標（識学理論：結果の評価）

### KPI

- **テスト成功率**: 成功テスト数 / 全テスト数
- **平均カバレッジ**: 全プロジェクトの平均カバレッジ
- **テスト実行時間**: テスト完了までの時間
- **失敗検出率**: 実際のバグを検出できた割合

## 識学理論5原則の適用

1. **責任の明確化**: テスト実行とカバレッジ測定のみを担当
2. **権限の委譲**: テスト合格/不合格の自律的判定
3. **階層の設計**: ReviewAgentの後工程
4. **結果の評価**: カバレッジと成功率で定量評価
5. **曖昧性の排除**: 80%カバレッジという明確な基準

---

🌸 **Miyabi Framework** - Beauty in Autonomous Development
