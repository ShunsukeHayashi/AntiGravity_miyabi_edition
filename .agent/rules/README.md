# Rules - コーディング規約

このディレクトリには AntiGravity IDE プロジェクトのコーディング規約とガイドラインが含まれています。

## 📋 規約一覧

### 公式 Google Antigravity ルール 🏆

#### 1. antigravity-mode-system.md 🏆
**Google Antigravity 公式モードシステム**

**内容:**
- **PLANNING Mode** - 計画作成、承認取得
- **EXECUTION Mode** - コード実装
- **VERIFICATION Mode** - テスト・検証
- task_boundary / notify_user ツール
- TaskName / TaskSummary / TaskStatus
- モード遷移ルール

**対象:** すべての複雑なタスク
**重要度:** 🔴 最重要
**出典:** Google DeepMind Antigravity 公式システムプロンプト

---

#### 2. antigravity-artifacts.md 🏆
**Google Antigravity Artifacts システム**

**内容:**
- **task.md** - タスクチェックリスト
- **implementation_plan.md** - 実装計画書
- **walkthrough.md** - 完了報告書
- Markdown フォーマットガイドライン
- GitHub Alerts の使用方法
- Carousel の使用方法

**対象:** すべてのタスク（Planning, Execution, Verification）
**重要度:** 🔴 最重要
**出典:** Google DeepMind Antigravity 公式システムプロンプト

---

#### 3. antigravity-web-design.md 🏆
**Google Antigravity Web Design Standards**

**内容:**
- **Rich Aesthetics** - 鮮やかな色彩、ダークモード
- **Visual Excellence** - プレミアムデザイン
- **Dynamic Design** - マイクロアニメーション
- Technology Stack（HTML/CSS/JS）
- Implementation Workflow
- SEO Best Practices

**対象:** すべてのWeb開発
**重要度:** 🔴 最重要
**警告:** *"If your web app looks simple and basic then you have FAILED!"*
**出典:** Google DeepMind Antigravity 公式システムプロンプト

---

### Miyabi Framework ルール 🌸

#### 4. planning-mode-guard.md ⭐
**Planning Mode 動作制御**

**内容:**
- Planning Mode での動作ルール
- 実装前の計画承認プロセス
- 言語プロトコル（ユーザーの言語で応答）
- Execution Mode への移行条件

**対象:** すべてのAI Agent
**重要度:** 🔴 最重要
**出典:** windsurf-antigravity-rules (MIT)

---

#### 5. task-classification.md ⭐
**タスク分類と実行戦略**

**内容:**
- 🟢 軽量タスク（即座に実行）
- 🟡 標準タスク（チェックリスト提示後に実行）
- 🔴 重要タスク（詳細計画書＋承認必須）
- 並列処理戦略
- 品質基準

**対象:** すべてのタスク実行
**重要度:** 🔴 最重要
**出典:** windsurf-antigravity-rules (MIT)

---

### TypeScript / AI コード生成ルール

#### 6. code-style-guide.md
**TypeScript コーディングスタイルガイド**

**内容:**
- TypeScript設定（strict mode）
- フォーマット規則（Prettier）
- 命名規則（camelCase, PascalCase, UPPER_SNAKE_CASE）
- 型定義のベストプラクティス
- インポート順序
- エラーハンドリング
- テストコード規約

**対象:** すべての TypeScript コード

---

#### 7. code-generation-guide.md
**AI駆動コード生成ガイドライン**

**内容:**
- モジュール分割の原則
- 機能の独立性
- デモコードの分離
- 型安全性の確保
- エラーハンドリング
- 非同期処理
- 実装パターン

**対象:** CodeGenAgent による自動生成コード

## 🎯 規約の適用

### 自動チェック

以下のコマンドで自動的に規約準拠をチェックできます：

```bash
# 型チェック
npm run typecheck

# リントチェック
npm run lint

# フォーマットチェック
npm run format:check
```

### 自動修正

以下のコマンドで自動修正が可能です：

```bash
# リント自動修正
npm run lint:fix

# フォーマット自動適用
npm run format
```

## ✅ 品質基準

### コード品質（ReviewAgent評価）

すべてのコードは以下の基準で評価されます（100点満点、80点以上で合格）：

| 項目 | 配点 | 基準 |
|------|------|------|
| 型安全性 | 20点 | strict mode、型エラー0 |
| 可読性 | 20点 | 命名規則、コメント |
| 保守性 | 20点 | モジュール分割、再利用性 |
| セキュリティ | 20点 | OWASP Top 10準拠 |
| テスト | 20点 | カバレッジ80%以上 |

### 必須要件

- ✅ TypeScript strict mode
- ✅ ESLint エラー0
- ✅ Prettier フォーマット済み
- ✅ テストカバレッジ 80%以上
- ✅ JSDoc コメント（公開API）
- ✅ 型定義の明示

### 禁止事項

- ❌ `any` 型の多用
- ❌ `eval()` の使用
- ❌ `var` の使用（`const`/`let`を使用）
- ❌ console.log の本番コード残存
- ❌ 未使用の変数・インポート
- ❌ 型定義の省略

## 📚 学習リソース

### TypeScript

- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Prettier

- [Prettier 公式ドキュメント](https://prettier.io/docs/)

### ESLint

- [ESLint 公式ドキュメント](https://eslint.org/docs/)
- [typescript-eslint](https://typescript-eslint.io/)

## 🔄 規約の更新

規約は定期的に見直され、プロジェクトの成長に合わせて更新されます。

更新の提案がある場合は、GitHub Issue で議論してください。

## 🎨 コードレビュー

すべてのコードは ReviewAgent によって自動レビューされます：

1. **静的解析**: TypeScript、ESLint
2. **セキュリティスキャン**: OWASP Top 10
3. **品質スコアリング**: 100点満点で評価
4. **改善提案**: 具体的な修正案の提示

合格基準: **80点以上**

## 🔗 関連ドキュメント

- [ワークフロー](../workflows/README.md)
- [エージェント定義](../agents/)
- [プロジェクト概要](../../CLAUDE.md)

---

🌸 **Miyabi Framework** - Beauty in Autonomous Development
