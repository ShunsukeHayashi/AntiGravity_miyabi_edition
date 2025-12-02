# IssueAgent

## 概要

IssueAgent は GitHub Issues の分析と分類を自動化するエージェントです。識学理論の65ラベル体系を用いて、Issueを自動的に分類し、複雑度を推定します。

## 責任範囲（識学理論：責任の明確化）

### 主要責任

1. **Issue分析** - Issue の内容を解析し、要件を抽出
2. **自動ラベル付け** - 65ラベル体系による自動分類
3. **複雑度推定** - タスクの複雑度を4段階（小/中/大/特大）で評価
4. **作業工数見積もり** - 実装に必要な時間を推定
5. **優先度判定** - P0〜P3 の優先度を自動設定
6. **影響範囲分析** - breaking/major/minor/patch の判定

### 権限（識学理論：権限の委譲）

- ✅ Issue ラベルの追加・更新
- ✅ Issue の状態変更
- ✅ 複雑度・工数の推定
- ✅ 優先度の設定
- ✅ Issue コメントの追加

### 制約

- ❌ Issue の削除（管理者権限が必要）
- ❌ コード実装（CodeGenAgent の責務）
- ❌ タスク分解（CoordinatorAgent の責務）

## ラベル体系（65ラベル）

### 1. type: タイプ (7ラベル)

- `type:feature` - 新機能
- `type:bug` - バグ修正
- `type:refactor` - リファクタリング
- `type:docs` - ドキュメント
- `type:test` - テスト
- `type:chore` - 雑務
- `type:security` - セキュリティ

### 2. priority: 優先度 (4ラベル)

- `priority:P0-Critical` - 緊急（即座対応）
- `priority:P1-High` - 高（1週間以内）
- `priority:P2-Medium` - 中（1ヶ月以内）
- `priority:P3-Low` - 低（時間があれば）

### 3. state: 状態 (7ラベル)

- `state:pending` - 保留中
- `state:analyzing` - 分析中
- `state:implementing` - 実装中
- `state:reviewing` - レビュー中
- `state:testing` - テスト中
- `state:deploying` - デプロイ中
- `state:done` - 完了

### 4. agent: 担当エージェント (7ラベル)

- `agent:coordinator` - CoordinatorAgent
- `agent:issue` - IssueAgent
- `agent:codegen` - CodeGenAgent
- `agent:review` - ReviewAgent
- `agent:test` - TestAgent
- `agent:pr` - PRAgent
- `agent:deployment` - DeploymentAgent

### 5. complexity: 複雑度 (4ラベル)

- `complexity:small` - 小（1ファイル、シンプル）
- `complexity:medium` - 中（複数ファイル、標準的）
- `complexity:large` - 大（多数ファイル、複雑）
- `complexity:xlarge` - 特大（アーキテクチャ変更）

### 6. phase: フェーズ (5ラベル)

- `phase:planning` - 計画
- `phase:design` - 設計
- `phase:implementation` - 実装
- `phase:testing` - テスト
- `phase:deployment` - デプロイ

### 7. impact: 影響範囲 (4ラベル)

- `impact:breaking` - 破壊的変更
- `impact:major` - メジャー変更
- `impact:minor` - マイナー変更
- `impact:patch` - パッチ

### 8. category: カテゴリ (5ラベル)

- `category:frontend` - フロントエンド
- `category:backend` - バックエンド
- `category:infra` - インフラ
- `category:dx` - 開発者体験
- `category:security` - セキュリティ

### 9. effort: 作業工数 (6ラベル)

- `effort:1h` - 1時間
- `effort:4h` - 4時間
- `effort:1d` - 1日
- `effort:3d` - 3日
- `effort:1w` - 1週間
- `effort:2w` - 2週間

### 10. blocked: ブロック理由 (3ラベル)

- `blocked:waiting-review` - レビュー待ち
- `blocked:waiting-deployment` - デプロイ待ち
- `blocked:waiting-feedback` - フィードバック待ち

## 分析ワークフロー

```
1. Issue受信
   ↓
2. 内容解析
   - タイトルと本文の自然言語処理
   - キーワード抽出
   - 要件の構造化
   ↓
3. ラベル自動付与
   - 65ラベル体系に基づく分類
   - 機械学習モデルによる推論
   ↓
4. 複雑度推定
   - 変更範囲の推定
   - 依存関係の分析
   - 4段階評価
   ↓
5. 作業工数見積もり
   - 過去データとの比較
   - 類似タスクの実績参照
   ↓
6. 優先度判定
   - 緊急度と重要度のマトリクス
   - ビジネスインパクト評価
   ↓
7. Issue更新
   - ラベル追加
   - コメント追加
   - 次のエージェントへ通知
```

## 複雑度推定アルゴリズム

### 評価基準

```typescript
interface ComplexityFactors {
  fileCount: number; // 変更が必要なファイル数
  lineCount: number; // 推定コード行数
  dependencies: number; // 依存関係の数
  newTechnology: boolean; // 新技術の導入有無
  architectureChange: boolean; // アーキテクチャ変更有無
  breakingChange: boolean; // 破壊的変更有無
}

function estimateComplexity(factors: ComplexityFactors): Complexity {
  let score = 0;

  // ファイル数（0-40点）
  if (factors.fileCount === 1) score += 10;
  else if (factors.fileCount <= 3) score += 20;
  else if (factors.fileCount <= 10) score += 30;
  else score += 40;

  // コード行数（0-30点）
  if (factors.lineCount <= 50) score += 10;
  else if (factors.lineCount <= 200) score += 20;
  else score += 30;

  // 依存関係（0-10点）
  score += Math.min(factors.dependencies * 2, 10);

  // 特殊要因（各+10点）
  if (factors.newTechnology) score += 10;
  if (factors.architectureChange) score += 10;
  if (factors.breakingChange) score += 10;

  // スコアから複雑度を決定
  if (score <= 30) return 'small';
  if (score <= 60) return 'medium';
  if (score <= 80) return 'large';
  return 'xlarge';
}
```

### 複雑度マッピング

| 複雑度 | スコア | ファイル数 | 行数 | 工数目安 |
|--------|--------|-----------|------|---------|
| small  | 0-30   | 1-2       | ~50  | 1-4h    |
| medium | 31-60  | 3-5       | 50-200 | 4h-1d |
| large  | 61-80  | 6-15      | 200-1000 | 1-3d |
| xlarge | 81-100 | 16+       | 1000+ | 3d-2w  |

## 優先度判定マトリクス

### 評価軸

1. **緊急度** (Urgency)
   - High: システムダウン、セキュリティ脆弱性
   - Medium: パフォーマンス問題、重要機能のバグ
   - Low: 軽微なバグ、改善要望

2. **重要度** (Importance)
   - High: ビジネスクリティカル、ユーザー影響大
   - Medium: ユーザー体験向上
   - Low: 内部改善

### マトリクス

```
         │ Importance
         │ High    Medium   Low
─────────┼─────────────────────
Urgency  │
  High   │ P0      P1       P2
  Medium │ P1      P2       P3
  Low    │ P2      P3       P3
```

## 機械学習モデル

### ラベル予測モデル

```typescript
interface MLModel {
  name: string;
  version: string;
  accuracy: number;
  trainedAt: Date;
}

interface Prediction {
  label: string;
  confidence: number; // 0-1
}

async function predictLabels(issueText: string): Promise<Prediction[]> {
  // Claude APIを使用した自然言語処理
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4',
    messages: [{
      role: 'user',
      content: `以下のIssueを分析し、適切なラベルを予測してください：\n\n${issueText}`,
    }],
  });

  return parseLabelsFromResponse(response);
}
```

### 学習データ

- 過去のIssueとラベル付けの履歴
- 実際の工数データ
- レビュースコア
- デプロイ結果

## 実装ガイドライン

### ファイル構造

```
src/agent/issue/
├── issue.ts                # IssueAgentメインクラス
├── analyzer.ts             # Issue内容解析
├── labeler.ts              # 自動ラベル付け
├── complexity-estimator.ts # 複雑度推定
├── effort-estimator.ts     # 工数見積もり
├── priority-calculator.ts  # 優先度判定
└── types.ts                # 型定義
```

### 使用例

```typescript
import { IssueAgent } from '@/agent/issue';

const issueAgent = new IssueAgent();

// Issueを分析
const issue = await getIssueById('123');
const analysis = await issueAgent.analyze(issue);

console.log('タイプ:', analysis.type);
console.log('複雑度:', analysis.complexity);
console.log('工数:', analysis.estimatedEffort);
console.log('優先度:', analysis.priority);

// ラベルを適用
await issueAgent.applyLabels(issue.id, analysis.labels);

// 状態を更新
await issueAgent.updateState(issue.id, 'analyzing');
```

## レポート内容

```typescript
interface IssueAnalysisReport {
  issueId: string;
  title: string;
  type: TaskType;
  complexity: Complexity;
  estimatedEffort: Effort;
  priority: Priority;
  labels: string[];
  impact: Impact;
  category: Category[];
  requirements: string[]; // 抽出した要件
  risks: string[]; // 特定されたリスク
  dependencies: string[]; // 依存関係
  recommendations: string[]; // 推奨事項
}
```

## 評価指標（識学理論：結果の評価）

### KPI

- **ラベル精度**: 正しくラベル付けされた割合
- **工数予測精度**: (実際の工数 / 予測工数) の平均
- **優先度適切性**: ステークホルダー評価
- **分析速度**: Issue受信から分析完了までの時間

## 識学理論5原則の適用

1. **責任の明確化**: Issue分析とラベル管理のみを担当
2. **権限の委譲**: ラベル付けと状態変更の自律的実行
3. **階層の設計**: CoordinatorAgentの配下で動作
4. **結果の評価**: 精度と速度で定量評価
5. **曖昧性の排除**: 65ラベル体系による明確な分類

---

🌸 **Miyabi Framework** - Beauty in Autonomous Development
