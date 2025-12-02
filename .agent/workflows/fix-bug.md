---
description: Fix bugs systematically with proper testing and documentation
---

# バグ修正ワークフロー

バグを体系的に修正し、再発を防止するための標準手順です。

## 目的

- バグの原因を特定
- 適切な修正を実施
- リグレッションテストを追加
- 再発を防止
- 修正内容をドキュメント化

## 前提条件

- バグレポートが存在する（Issue または詳細な説明）
- 再現手順が明確
- 開発環境がセットアップ済み
- Git で作業ブランチを作成済み

## 手順

### ステップ 1: バグの再現

まず、バグを確実に再現できることを確認します。

**再現手順の確認**:
```markdown
## バグレポート
- **タイトル**: AgentManager が null を返す
- **発生条件**: タスクIDが空文字列の場合
- **期待動作**: エラーを投げる
- **実際の動作**: null を返す
- **影響**: ユーザーに適切なエラーメッセージが表示されない

## 再現手順
1. AgentManager を初期化
2. executeTask('') を呼び出す
3. 結果が null になる
```

**再現確認**:
```typescript
// 再現用コード
const manager = new AgentManager();
const result = await manager.executeTask(''); // null が返される

// または
npm test -- --grep "empty task ID"
```

**チェックポイント**:
- [ ] バグが確実に再現できる
- [ ] 再現手順が明確
- [ ] 影響範囲が把握できている

### ステップ 2: 原因の特定

デバッガーやログを使ってバグの原因を特定します。

**デバッグ手法**:

1. **ブレークポイント**
```typescript
// VS Code でブレークポイントを設定
async executeTask(taskId: string): Promise<TaskResult> {
  debugger; // ここで停止

  if (!taskId) {
    // この条件分岐が実行されない？
  }
}
```

2. **ロギング**
```typescript
async executeTask(taskId: string): Promise<TaskResult> {
  console.log('[DEBUG] taskId:', taskId, typeof taskId);

  if (!taskId) {
    console.log('[DEBUG] Empty taskId detected');
  }
}
```

3. **テストケース**
```typescript
// 問題を分離するテスト
it('should handle empty task ID', async () => {
  const manager = new AgentManager();

  // どのような動作になるか確認
  const result = await manager.executeTask('');
  console.log('Result:', result);
});
```

**原因の記録**:
```markdown
## バグ原因
- ファイル: src/agent/agent-manager.ts:45
- 問題: taskId の検証が !== undefined のみ
- 詳細: 空文字列 '' は undefined ではないため、検証を通過
- 修正方針: taskId.trim().length > 0 で検証
```

**チェックポイント**:
- [ ] 原因が特定できた
- [ ] なぜバグが発生したか理解できた
- [ ] 修正方針が明確

### ステップ 3: リグレッションテストの作成

修正前に、バグを検証するテストを作成します（TDD アプローチ）。

**失敗するテストを作成**:
```typescript
// src/agent/agent-manager.test.ts
describe('AgentManager - Bug Fix: Empty Task ID', () => {
  let manager: AgentManager;

  beforeEach(() => {
    manager = new AgentManager();
  });

  it('should throw AgentError for empty task ID', async () => {
    // このテストは最初は失敗する（バグがあるため）
    await expect(manager.executeTask('')).rejects.toThrow(AgentError);
    await expect(manager.executeTask('')).rejects.toThrow('Task ID cannot be empty');
  });

  it('should throw AgentError for whitespace-only task ID', async () => {
    await expect(manager.executeTask('   ')).rejects.toThrow(AgentError);
  });

  it('should accept valid task ID', async () => {
    // 正常系も確認
    const result = await manager.executeTask('valid-task-id');
    expect(result).toBeDefined();
  });
});
```

**テスト実行（失敗を確認）**:
```bash
npm test -- --grep "Bug Fix: Empty Task ID"
# 期待: テストが失敗する（バグがあるため）
```

**チェックポイント**:
- [ ] バグを検証するテストが作成された
- [ ] テストが失敗する（バグがまだ存在するため）
- [ ] 正常系のテストも含まれている

### ステップ 4: バグの修正

特定した原因に基づいてバグを修正します。

**修正前のコード**:
```typescript
// src/agent/agent-manager.ts
async executeTask(taskId: string): Promise<TaskResult> {
  // 不十分な検証
  if (taskId !== undefined) {
    const agent = this.findAgent(taskId);
    return agent.execute(taskId);
  }

  return null; // バグ: null を返している
}
```

**修正後のコード**:
```typescript
// src/agent/agent-manager.ts
import { AgentError } from './errors';

async executeTask(taskId: string): Promise<TaskResult> {
  // 適切な検証
  if (!taskId || taskId.trim().length === 0) {
    throw new AgentError(
      'Task ID cannot be empty',
      'INVALID_TASK_ID',
      { taskId }
    );
  }

  const agent = this.findAgent(taskId);

  if (!agent) {
    throw new AgentError(
      `No agent found for task: ${taskId}`,
      'AGENT_NOT_FOUND',
      { taskId }
    );
  }

  return agent.execute(taskId);
}
```

**修正のポイント**:
- 空文字列と空白文字列をチェック
- null を返すのではなくエラーを投げる
- カスタムエラーで詳細な情報を提供

**チェックポイント**:
- [ ] バグが修正された
- [ ] エラーハンドリングが適切
- [ ] エッジケースも考慮されている

### ステップ 5: テストの検証

修正後、テストが成功することを確認します。

**テスト実行（成功を確認）**:
```bash
# リグレッションテスト
npm test -- --grep "Bug Fix: Empty Task ID"
# 期待: すべてのテストが成功

# 全テスト
npm test
# 期待: すべてのテストが成功（既存機能が壊れていないことを確認）
```

**カバレッジ確認**:
```bash
npm run test:coverage
# 修正部分がカバーされているか確認
```

**チェックポイント**:
- [ ] リグレッションテストが成功
- [ ] 既存のテストがすべて成功
- [ ] カバレッジが維持または向上

### ステップ 6: 関連コードの確認

同様のバグが他にないか確認します。

**パターン検索**:
```bash
# 同じパターンのコードを検索
grep -r "!== undefined" src/
grep -r "return null" src/

# または
npm run lint -- --fix
```

**同様のバグを修正**:
```typescript
// 他のメソッドでも同様の問題を修正
async deleteTask(taskId: string): Promise<void> {
  // 修正前: if (taskId !== undefined)
  // 修正後:
  if (!taskId || taskId.trim().length === 0) {
    throw new AgentError('Task ID cannot be empty', 'INVALID_TASK_ID');
  }

  // ...
}
```

**チェックポイント**:
- [ ] 同様のバグがないか確認した
- [ ] 見つかった場合は修正した
- [ ] テストを追加した

### ステップ 7: ドキュメントの更新

バグ修正の内容をドキュメント化します。

**JSDoc コメント更新**:
```typescript
/**
 * タスクを実行します
 *
 * @param taskId - 実行するタスクのID（空文字列不可）
 * @returns タスク実行結果
 * @throws {AgentError} taskIdが空の場合（INVALID_TASK_ID）
 * @throws {AgentError} Agentが見つからない場合（AGENT_NOT_FOUND）
 *
 * @example
 * ```typescript
 * const result = await manager.executeTask('task-123');
 * ```
 *
 * @remarks
 * バグ修正履歴:
 * - 2025-12-02: 空文字列のtaskIdでnullを返すバグを修正（Issue #123）
 */
async executeTask(taskId: string): Promise<TaskResult> {
  // ...
}
```

**CHANGELOG.md 更新**:
```markdown
## [Unreleased]

### Fixed
- AgentManager.executeTask() が空のtaskIDに対してnullを返すバグを修正 (#123)
  - 空文字列と空白文字列を適切に検証
  - AgentErrorを投げるように変更
```

**チェックポイント**:
- [ ] JSDoc が更新されている
- [ ] CHANGELOG に記載されている
- [ ] 修正内容が明確

### ステップ 8: コードレビュー

修正内容をレビューします。

**セルフレビュー**:
- [ ] バグが完全に修正されている
- [ ] 副作用がない
- [ ] エラーハンドリングが適切
- [ ] テストが網羅的
- [ ] ドキュメントが更新されている

**ReviewAgent チェック**:
```bash
npm run typecheck && npm run lint && npm test
```

**チェックポイント**:
- [ ] ReviewAgent の評価が 80点以上
- [ ] すべてのチェックが成功

## 品質チェック

```bash
# 完全なチェック
npm run typecheck
npm run lint
npm test
npm run test:coverage

# または一括
npm run pretest && npm test
```

## チェックリスト

バグ修正完了前に以下を確認：

- [ ] バグが確実に再現できた
- [ ] 原因が特定できた
- [ ] リグレッションテストが作成された
- [ ] バグが修正された
- [ ] テストがすべて成功
- [ ] 同様のバグが他にないか確認した
- [ ] ドキュメントが更新されている
- [ ] 型チェックが成功
- [ ] ESLint がエラーゼロ
- [ ] カバレッジが維持または向上
- [ ] ReviewAgent の評価が 80点以上

## 成果物

バグ修正完了時、以下が更新されます：

```
src/<category>/
├── <file-name>.ts           # 修正されたコード
├── <file-name>.test.ts      # リグレッションテスト追加
├── errors.ts                # カスタムエラー（必要に応じて）
└── CHANGELOG.md             # 変更履歴
```

## バグ修正パターン集

### パターン 1: null/undefined チェック不足

```typescript
// Before
function getUser(id: string) {
  return users.find(u => u.id === id); // undefined になり得る
}

// After
function getUser(id: string): User {
  const user = users.find(u => u.id === id);

  if (!user) {
    throw new UserError('User not found', 'USER_NOT_FOUND', { id });
  }

  return user;
}
```

### パターン 2: 境界値処理のミス

```typescript
// Before
function validateAge(age: number) {
  if (age > 0 && age < 120) { // 0と120が含まれない
    return true;
  }
  return false;
}

// After
function validateAge(age: number): boolean {
  return age >= 0 && age <= 120; // 0と120を含む
}
```

### パターン 3: 非同期処理のエラーハンドリング漏れ

```typescript
// Before
async function loadData() {
  const data = await fetchData(); // エラーがキャッチされない
  return data;
}

// After
async function loadData(): Promise<Data> {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    logger.error('Failed to load data', { error });
    throw new DataError('Data loading failed', 'LOAD_ERROR', { error });
  }
}
```

## エスカレーション

以下の場合は TechLead にエスカレーション：

- バグの原因が不明
- 修正に大規模な変更が必要
- セキュリティに関わるバグ
- データ損失のリスクがある
- 外部システムに影響がある

## 参考資料

- [コーディング規約](../rules/code-style-guide.md)
- [エラーハンドリングのベストプラクティス](../rules/code-generation-guide.md)
- [TypeScript Handbook - Error Handling](https://www.typescriptlang.org/docs/)

---

🌸 **Miyabi Framework** - 識学理論に基づく自律型開発
