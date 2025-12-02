# Agent Debugging Skill

このスキルは、AntiGravity IDE の Agent システムのデバッグと開発を支援します。

## Agent System概要

AntiGravity IDEは複数のAI Agentが協調動作するシステムです：

### Agent階層
```
Mission Control (ユーザーインターフェース)
    ↓
Agent Manager (オーケストレーション)
    ↓
Specialist Agents (タスク実行)
    - CodeGenAgent
    - ReviewAgent
    - BrowserAgent
    - etc.
```

### Execution Policy

| ポリシー | 動作 |
|---------|------|
| **Off** | 全てユーザー確認 |
| **Auto** | ルーチンタスクは自動、重要な操作は確認 |
| **Turbo** | 最大限自動化、確認最小限 |

### Planning Mode

| モード | 動作 |
|-------|------|
| **Planning** | 詳細なステップバイステップ計画 |
| **Fast** | 軽量な計画で高速実行 |

## デバッグ手順

### 1. Agent実行ログの確認

```bash
# ログディレクトリ確認
ls -la .ai/logs/

# 最新ログ表示
tail -f .ai/logs/latest.log
```

### 2. Agent Manager の状態確認

`src/agent/manager.ts` で以下を確認:
- 登録されているAgent一覧
- Agent実行キュー
- エラーハンドリング

### 3. Mission Control UI の確認

`src/agent/mission-control.ts` で以下を確認:
- Inbox表示
- タスク進捗
- ユーザー通知

### 4. 実行ポリシーの動作確認

```typescript
// Auto mode でのタスク実行
if (executionPolicy === 'auto') {
  // ルーチンタスク → 自動実行
  if (task.isRoutine) {
    await executeTask(task);
  } else {
    // 重要な操作 → ユーザー確認
    await requestUserApproval(task);
  }
}
```

## よくある問題

### Agent が応答しない
1. Claude API接続を確認
2. `ANTHROPIC_API_KEY` 環境変数を確認
3. タイムアウト設定を確認

### タスクが Inbox に表示されない
1. `src/agent/inbox.ts` のロジック確認
2. IPC通信が正常か確認
3. Renderer プロセスでエラーがないか確認

### Browser Agent が動作しない
1. Chrome が起動しているか確認
2. Chrome拡張機能がインストールされているか確認
3. allowlist/denylist 設定を確認

## Agent開発パターン

### 新しいAgentの作成

```typescript
// src/agent/my-agent.ts
export class MyAgent {
  async execute(task: Task): Promise<Result> {
    // 1. タスク分析
    const plan = await this.analyzTask(task);

    // 2. 実行
    const result = await this.executeSteps(plan);

    // 3. 結果報告
    return this.formatResult(result);
  }
}
```

### Agent Manager への登録

```typescript
// src/agent/manager.ts
import { MyAgent } from './my-agent';

export class AgentManager {
  private agents = {
    'my-agent': new MyAgent(),
    // ...
  };
}
```

## テスト

```bash
# Agent単体テスト
npm test -- agent/my-agent.test.ts

# 統合テスト
npm test -- integration/agent-flow.test.ts
```

## パフォーマンス最適化

### 1. Agent実行の並列化
- 依存関係のないタスクは並列実行
- `Promise.all()` を活用

### 2. キャッシング
- 頻繁にアクセスする情報はキャッシュ
- Claude API呼び出しを最小化

### 3. バックグラウンド実行
- 長時間タスクはWorker Threadsで実行
- UIブロッキングを回避

## 参考

- `docs/ARCHITECTURE.md` - システムアーキテクチャ
- `.agent/ANTIGRAVITY_FEATURES.md` - 機能仕様
- `AGENTS.md` - Agent運用プロトコル
