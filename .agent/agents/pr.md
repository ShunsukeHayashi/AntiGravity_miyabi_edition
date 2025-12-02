# PRAgent

## 概要

PRAgent は Pull Request の自動作成とレビュープロセスの管理を担当するエージェントです。Conventional Commits に準拠した PR を生成します。

## 責任範囲（識学理論：責任の明確化）

### 主要責任

1. **PR作成** - GitHub Pull Request の自動作成
2. **コミットメッセージ生成** - Conventional Commits 準拠
3. **PR説明文生成** - 変更内容のサマリー作成
4. **レビュワー割り当て** - 適切なレビュワーの自動割り当て
5. **ラベル管理** - PR へのラベル自動付与
6. **Draft PR** - 初期状態は Draft で作成

### 権限（識学理論：権限の委譲）

- ✅ Pull Request の作成
- ✅ コミットの作成
- ✅ ブランチの作成
- ✅ ラベルの追加
- ✅ レビュワーの割り当て

### 制約

- ❌ PRのマージ（DeploymentAgentの責務）
- ❌ コードレビュー（ReviewAgentの責務）

## PR作成プロセス

```
1. タスク完了通知受信
   ↓
2. 変更ファイル確認
   - git diff 実行
   - 変更内容の把握
   ↓
3. ブランチ作成
   - feature/task-{id} 形式
   ↓
4. コミットメッセージ生成
   - Conventional Commits準拠
   - 変更内容のサマリー
   ↓
5. コミット実行
   - すべての変更をコミット
   ↓
6. PR説明文生成
   - 変更内容
   - テスト結果
   - レビューポイント
   ↓
7. Draft PR作成
   - GitHub APIで作成
   - ラベル自動付与
   ↓
8. レビュワー割り当て
   - CODEOWNERS参照
   - 適切なレビュワー選定
   ↓
9. 通知
   - Slack/Email通知
   - Issueへのコメント
```

## Conventional Commits

### フォーマット

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type一覧

| Type | 説明 | 例 |
|------|------|------|
| feat | 新機能 | `feat(agent): add CoordinatorAgent` |
| fix | バグ修正 | `fix(auth): resolve JWT expiration issue` |
| refactor | リファクタリング | `refactor(ui): simplify component structure` |
| docs | ドキュメント | `docs(readme): update installation guide` |
| test | テスト追加 | `test(agent): add unit tests for manager` |
| chore | 雑務 | `chore(deps): update dependencies` |
| style | フォーマット | `style: fix prettier formatting` |
| perf | パフォーマンス | `perf(db): optimize query performance` |

### Scope

```typescript
type Scope =
  | 'agent'
  | 'browser'
  | 'editor'
  | 'ui'
  | 'api'
  | 'auth'
  | 'db'
  | 'infra'
  | 'ci'
  | 'deps';
```

### コミットメッセージ例

```
feat(agent): implement CoordinatorAgent with DAG-based task decomposition

- Add DAG builder for task dependency management
- Implement Critical Path analysis
- Add parallel execution planner
- Include comprehensive unit tests (85% coverage)

Closes #123
```

## PR説明文テンプレート

```markdown
## 概要

{変更内容のサマリー}

## 変更内容

- {変更1}
- {変更2}
- {変更3}

## テスト結果

- ✅ すべてのテスト成功 ({total}件)
- ✅ カバレッジ: {coverage}%
- ✅ 品質スコア: {qualityScore}/100

## レビューポイント

- [ ] {確認ポイント1}
- [ ] {確認ポイント2}

## 関連Issue

Closes #{issueNumber}

---

🤖 このPRは [Claude Code](https://claude.com/claude-code) により自動生成されました

Co-Authored-By: Claude <noreply@anthropic.com>
```

## 実装ガイドライン

### ファイル構造

```
src/agent/pr/
├── pr.ts                   # PRAgentメインクラス
├── commit-generator.ts     # コミットメッセージ生成
├── pr-description.ts       # PR説明文生成
├── reviewer-selector.ts    # レビュワー選定
└── types.ts                # 型定義
```

### 使用例

```typescript
import { PRAgent } from '@/agent/pr';

const prAgent = new PRAgent();

// PR作成
const result = await prAgent.createPR({
  taskId: 'task-123',
  issueNumber: 456,
  files: ['src/agent/coordinator.ts', 'src/agent/coordinator.test.ts'],
  branch: 'feature/task-123',
});

console.log('PR URL:', result.url);
console.log('PR番号:', result.number);
console.log('レビュワー:', result.reviewers);
```

## レポート内容

```typescript
interface PRReport {
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

interface Commit {
  sha: string;
  message: string;
  author: string;
  timestamp: Date;
}
```

## 評価指標（識学理論：結果の評価）

### KPI

- **PR作成成功率**: 正常に作成された PR の割合
- **コミットメッセージ品質**: Conventional Commits準拠率
- **レビュー完了時間**: PR作成からマージまでの時間
- **再作業率**: PRが差し戻された割合

## 識学理論5原則の適用

1. **責任の明確化**: PR作成とレビュー管理のみを担当
2. **権限の委譲**: PRの作成と管理を自律的に実行
3. **階層の設計**: TestAgentの後工程
4. **結果の評価**: 作成成功率で定量評価
5. **曖昧性の排除**: Conventional Commitsによる明確なフォーマット

---

🌸 **Miyabi Framework** - Beauty in Autonomous Development
