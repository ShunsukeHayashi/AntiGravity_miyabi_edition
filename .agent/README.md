# .agent ディレクトリ

このディレクトリは AntiGravity IDE の Miyabi Framework による自律型開発システムの設定を管理します。

## ディレクトリ構造

```
.agent/
├── README.md                          # このファイル
├── ANTIGRAVITY_FEATURES.md            # AntiGravity機能仕様
├── rules/                             # コーディング規約
│   ├── README.md                      # 規約概要
│   ├── planning-mode-guard.md         # Planning Mode制御 ⭐
│   ├── task-classification.md         # タスク分類戦略 ⭐
│   ├── code-style-guide.md            # TypeScript規約
│   └── code-generation-guide.md       # AI生成ガイドライン
└── workflows/                         # ワークフロー定義
    ├── README.md                      # ワークフロー概要
    ├── generate-unit-tests.md         # ユニットテスト生成
    ├── implement-feature.md           # 機能実装
    ├── refactor-code.md               # コードリファクタリング
    └── fix-bug.md                     # バグ修正
```

## Miyabi Framework について

Miyabi Framework は識学理論（Shikigaku Theory）に基づく自律型開発システムです。

### 7つの自律エージェント

1. **CoordinatorAgent** - タスク統括・並列実行制御
2. **IssueAgent** - Issue分析・ラベル管理
3. **CodeGenAgent** - AI駆動コード生成
4. **ReviewAgent** - コード品質判定
5. **PRAgent** - Pull Request自動作成
6. **DeploymentAgent** - CI/CDデプロイ自動化
7. **TestAgent** - テスト自動実行

エージェントの詳細は `.claude/agents/` ディレクトリを参照してください。

## 使い方

### Claude Code からエージェントを実行

```bash
/agent-run
```

### カスタムコマンドの使用

Claude Code で以下のコマンドが使用可能です：

- `/test` - テスト実行
- `/create-issue` - Issue作成
- `/agent-run` - エージェント実行（Issue自動処理パイプライン）
- `/generate-docs` - ドキュメント生成
- `/deploy` - デプロイ実行
- `/verify` - 動作確認
- `/security-scan` - セキュリティスキャン

詳細は `.claude/commands/` ディレクトリを参照してください。

## コーディング規約

### スタイルガイド

`rules/code-style-guide.md` に従って開発します：

- TypeScript strict mode
- Prettier フォーマット（2スペースインデント）
- ESLint 準拠

### コード生成ガイドライン

`rules/code-generation-guide.md` に AI によるコード生成の原則が記載されています。

## ワークフロー

`workflows/` ディレクトリには一般的な開発ワークフローのテンプレートがあります：

- **generate-unit-tests** - ユニットテスト自動生成
- **implement-feature** - 新機能実装手順
- **refactor-code** - リファクタリング手順
- **fix-bug** - バグ修正手順

## 関連ドキュメント

- [プロジェクト概要](../CLAUDE.md) - プロジェクト全体の説明とClaude設定
- [ANTIGRAVITY_FEATURES.md](./ANTIGRAVITY_FEATURES.md) - AntiGravity機能仕様
- [Miyabi Framework](https://github.com/ShunsukeHayashi/Autonomous-Operations)

---

🌸 **Miyabi** - Beauty in Autonomous Development
