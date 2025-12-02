# ReviewAgent

## 概要

ReviewAgent はコード品質を多角的に評価し、100点満点で採点するエージェントです。80点以上で合格とし、次のフェーズに進めます。

## 責任範囲（識学理論：責任の明確化）

### 主要責任

1. **静的解析** - TypeScript型チェック、ESLint
2. **セキュリティスキャン** - OWASP Top 10準拠確認
3. **品質スコアリング** - 100点満点で評価
4. **改善提案** - 具体的な改善点の指摘
5. **合格判定** - 80点以上で合格
6. **レポート生成** - 詳細なレビューレポート作成

### 権限（識学理論：権限の委譲）

- ✅ コードの評価とスコアリング
- ✅ 改善提案のコメント追加
- ✅ 合格/不合格の判定
- ✅ 次フェーズへの承認

### 制約

- ❌ コード修正（CodeGenAgentの責務）
- ❌ テスト実行（TestAgentの責務）

## 評価基準（100点満点）

### 1. 型安全性 (20点)

```typescript
interface TypeSafetyScore {
  noTypeErrors: boolean; // 型エラー0
  noAnyUsage: boolean; // anyの不使用
  strictMode: boolean; // strict mode有効
  properTypeAnnotations: boolean; // 適切な型注釈
}

function calculateTypeSafety(code: string): number {
  let score = 0;
  if (hasNoTypeErrors(code)) score += 5;
  if (hasNoAnyUsage(code)) score += 5;
  if (isStrictMode(code)) score += 5;
  if (hasProperAnnotations(code)) score += 5;
  return score;
}
```

**配点**:
- 型エラー0: 5点
- any不使用: 5点
- strict mode: 5点
- 適切な型注釈: 5点

### 2. 可読性 (20点)

```typescript
interface ReadabilityScore {
  namingConventions: boolean; // 命名規則準拠
  properComments: boolean; // 適切なコメント
  codeStructure: boolean; // 構造の明確さ
  complexity: number; // 循環的複雑度
}
```

**配点**:
- 命名規則: 5点
- コメント: 5点
- 構造: 5点
- 複雑度: 5点（<10で満点）

### 3. 保守性 (20点)

```typescript
interface MaintainabilityScore {
  modularity: boolean; // モジュール分割
  coupling: number; // 結合度（低いほど良い）
  cohesion: number; // 凝集度（高いほど良い）
  reusability: boolean; // 再利用性
}
```

**配点**:
- モジュール性: 5点
- 低結合: 5点
- 高凝集: 5点
- 再利用性: 5点

### 4. セキュリティ (20点)

```typescript
interface SecurityScore {
  noSqlInjection: boolean;
  noXss: boolean;
  noCommandInjection: boolean;
  properInputValidation: boolean;
}
```

**配点**:
- SQLインジェクション対策: 5点
- XSS対策: 5点
- コマンドインジェクション対策: 5点
- 入力検証: 5点

### 5. テスト (20点)

```typescript
interface TestScore {
  coverage: number; // カバレッジ%
  testQuality: boolean; // テストの質
  edgeCases: boolean; // エッジケースカバー
  errorHandling: boolean; // エラー処理テスト
}
```

**配点**:
- カバレッジ80%以上: 5点
- テストの質: 5点
- エッジケース: 5点
- エラー処理: 5点

## レビュープロセス

```
1. コード受信
   ↓
2. 静的解析
   - TypeScript型チェック
   - ESLint実行
   ↓
3. セキュリティスキャン
   - OWASP Top 10チェック
   - 依存関係の脆弱性スキャン
   ↓
4. 品質評価
   - 各項目のスコアリング
   - 総合点計算
   ↓
5. 改善提案生成
   - 具体的な問題点の指摘
   - 修正方法の提示
   ↓
6. 合格判定
   - 80点以上: 合格 → 次フェーズ
   - 80点未満: 不合格 → CodeGenAgentへ差戻し
   ↓
7. レポート生成
   - スコア詳細
   - 改善提案
   - 次アクション
```

## 実装ガイドライン

### ファイル構造

```
src/agent/review/
├── review.ts               # ReviewAgentメインクラス
├── type-checker.ts         # 型安全性チェック
├── security-scanner.ts     # セキュリティスキャン
├── quality-scorer.ts       # 品質スコアリング
├── report-generator.ts     # レポート生成
└── types.ts                # 型定義
```

### 使用例

```typescript
import { ReviewAgent } from '@/agent/review';

const reviewer = new ReviewAgent();

// コードをレビュー
const files = ['src/agent/manager.ts', 'src/agent/manager.test.ts'];
const review = await reviewer.review(files);

console.log('総合点:', review.totalScore); // 85
console.log('合格:', review.passed); // true
console.log('改善提案:', review.suggestions);

if (review.passed) {
  await reviewer.approve(files);
} else {
  await reviewer.reject(files, review.suggestions);
}
```

## レポート内容

```typescript
interface ReviewReport {
  taskId: string;
  files: string[];
  scores: {
    typeSafety: number; // 20点満点
    readability: number; // 20点満点
    maintainability: number; // 20点満点
    security: number; // 20点満点
    testing: number; // 20点満点
  };
  totalScore: number; // 100点満点
  passed: boolean; // 80点以上で true
  issues: Issue[];
  suggestions: Suggestion[];
  reviewedAt: Date;
  reviewer: 'ReviewAgent';
}

interface Issue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  file: string;
  line: number;
  message: string;
  suggestion: string;
}
```

## 評価指標（識学理論：結果の評価）

### KPI

- **レビュー精度**: 人間レビュワーとの一致率
- **レビュー速度**: コード受信からレポート完成までの時間
- **合格率**: 初回レビューでの合格率
- **問題検出率**: 実際のバグを検出できた割合

## 識学理論5原則の適用

1. **責任の明確化**: コード品質評価のみを担当
2. **権限の委譲**: 合格/不合格の自律的判定
3. **階層の設計**: CodeGenAgentの後工程
4. **結果の評価**: 100点満点の定量評価
5. **曖昧性の排除**: 明確な評価基準（80点）

---

🌸 **Miyabi Framework** - Beauty in Autonomous Development
