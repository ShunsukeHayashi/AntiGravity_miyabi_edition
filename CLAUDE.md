# AntiGravity IDE - Claude Code Context

## プロジェクト概要

**AntiGravity IDE** - AI-powered IDE with Agent-First Architecture + Miyabi Framework

Google AntiGravityにインスパイアされたAI駆動のIDEで、VS Codeをベースに以下の特徴を持ちます：

- **Electron 28.0.0** ベースのデスクトップアプリケーション
- **Agent-First設計** - 複数のAI Agentが協調動作
- **Mission Control** - Agent統括インターフェース
- **Browser Sub-Agent** - Chrome自動化・Webスクレイピング
- **Miyabi Framework統合** - 識学理論による自律型開発

### 技術スタック

- **Runtime**: Electron (v28.0.0)
- **Language**: TypeScript (strict mode, ES2020)
- **Build**: TypeScript compiler → `out/`
- **Package**: electron-builder → `dist/`
- **Framework**: Miyabi (Autonomous Operations)

## 🌸 Miyabi Framework

### 7つの自律エージェント

1. **CoordinatorAgent** - タスク統括・並列実行制御
   - DAG（Directed Acyclic Graph）ベースのタスク分解
   - Critical Path特定と並列実行最適化

2. **IssueAgent** - Issue分析・ラベル管理
   - 識学理論65ラベル体系による自動分類
   - タスク複雑度推定（小/中/大/特大）

3. **CodeGenAgent** - AI駆動コード生成
   - Claude Sonnet 4による高品質コード生成
   - TypeScript strict mode完全対応

4. **ReviewAgent** - コード品質判定
   - 静的解析・セキュリティスキャン
   - 品質スコアリング（100点満点、80点以上で合格）

5. **PRAgent** - Pull Request自動作成
   - Conventional Commits準拠
   - Draft PR自動生成

6. **DeploymentAgent** - CI/CDデプロイ自動化
   - 自動デプロイ・ヘルスチェック
   - 自動Rollback機能

7. **TestAgent** - テスト自動実行
   - テスト実行・カバレッジレポート
   - 80%+カバレッジ目標

## GitHub OS Integration

このプロジェクトは「GitHubをOSとして扱う」設計思想で構築されています:

### 自動化されたワークフロー

1. **Issue作成** → IssueAgentが自動ラベル分類
2. **CoordinatorAgent** → タスクをDAG分解、並列実行プラン作成
3. **CodeGenAgent** → コード実装、テスト生成
4. **ReviewAgent** → 品質チェック（80点以上で次へ）
5. **TestAgent** → テスト実行（カバレッジ確認）
6. **PRAgent** → Draft PR作成
7. **DeploymentAgent** → マージ後に自動デプロイ


## 🏆 公式 Google Antigravity ルール

AntiGravity IDEは、**Google DeepMindの公式Antigravityシステムプロンプト**に基づいて構築されています。

### 1. Antigravity Mode System

**3つのモード**:
- **PLANNING Mode** - コードベース調査、要件理解、実装計画作成
- **EXECUTION Mode** - コード実装、ファイル変更
- **VERIFICATION Mode** - テスト実行、動作確認、walkthrough作成

**詳細**: `.agent/rules/antigravity-mode-system.md`

### 2. Artifacts System

**3つのArtifacts**:
- **task.md** - タスクチェックリスト（[ ], [/], [x]マーカー）
- **implementation_plan.md** - 実装計画書（ユーザー承認必須）
- **walkthrough.md** - 完了報告書（スクリーンショット含む）

**詳細**: `.agent/rules/antigravity-artifacts.md`

### 3. Web Design Standards

**必須要件**:
- ✅ Rich Aesthetics（鮮やかな色彩、ダークモード、グラスモーフィズム）
- ✅ Visual Excellence（Google Fonts、グラデーション、マイクロアニメーション）
- ✅ Premium Design（最先端でプレミアムに感じるデザイン）
- ⚠️ **重要**: "If your web app looks simple and basic then you have FAILED!"

**詳細**: `.agent/rules/antigravity-web-design.md`



## ラベル体系（識学理論準拠）

### 10カテゴリー、53ラベル

- **type:** bug, feature, refactor, docs, test, chore, security
- **priority:** P0-Critical, P1-High, P2-Medium, P3-Low
- **state:** pending, analyzing, implementing, reviewing, testing, deploying, done
- **agent:** codegen, review, deployment, test, coordinator, issue, pr
- **complexity:** small, medium, large, xlarge
- **phase:** planning, design, implementation, testing, deployment
- **impact:** breaking, major, minor, patch
- **category:** frontend, backend, infra, dx, security
- **effort:** 1h, 4h, 1d, 3d, 1w, 2w
- **blocked:** waiting-review, waiting-deployment, waiting-feedback

## 開発ガイドライン

### TypeScript設定

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "target": "ES2022"
  }
}
```

### セキュリティ

- **機密情報は環境変数で管理**: `GITHUB_TOKEN`, `ANTHROPIC_API_KEY`
- **.env を .gitignore に含める**
- **Webhook検証**: HMAC-SHA256署名検証

### テスト

```bash
npm test                    # 全テスト実行
npm run test:watch          # Watch mode
npm run test:coverage       # カバレッジレポート
```

目標: 80%+ カバレッジ

## 使用方法

### Issue作成（Claude Code推奨）

```bash
# Claude Code から直接実行
gh issue create --title "機能追加: ユーザー認証" --body "JWT認証を実装"
```

または Claude Code のスラッシュコマンド:

```
/create-issue
```

### 状態確認

```bash
npx miyabi status          # 現在の状態
npx miyabi status --watch  # リアルタイム監視
```

### Agent実行

```bash
/agent-run                 # Claude Code から実行
```

## プロジェクト構造

```
AntiGravity/
├── .claude/               # Claude Code設定
│   ├── agents/           # 6つのAgent定義
│   ├── commands/         # 12個のスラッシュコマンド
│   ├── skills/           # 3つのスキル (electron-dev, agent-debug, browser-automation)
│   ├── mcp-servers/      # 4つのカスタムMCPサーバー
│   ├── hooks/            # Claude Hooks
│   ├── mcp.json          # MCP設定 (7サーバー統合)
│   └── settings.example.json  # 設定テンプレート
├── .github/
│   └── workflows/        # 14+ GitHub Actions
├── src/                  # ソースコード（未実装）
│   ├── main.ts           # Mainプロセスエントリーポイント
│   ├── app/              # アプリケーション管理
│   │   ├── lifecycle.ts
│   │   ├── menu.ts
│   │   └── window.ts
│   ├── agent/            # Agent System
│   │   ├── manager.ts    # Agent統括
│   │   ├── mission-control.ts  # Mission Control UI
│   │   ├── inbox.ts      # タスクInbox
│   │   └── workspace.ts  # Workspace管理
│   ├── browser/          # Browser Sub-Agent
│   │   ├── controller.ts
│   │   ├── automation.ts
│   │   └── scraper.ts
│   ├── editor/           # Editor Core
│   │   ├── core.ts
│   │   ├── commands.ts
│   │   └── suggestions.ts
│   └── ui/               # UI Layer
│       ├── components/
│       └── views/
├── out/                  # TypeScriptビルド出力
├── dist/                 # electron-builderパッケージ出力
├── docs/                 # ドキュメント
├── CLAUDE.md             # このファイル
├── AGENTS.md             # Agent運用プロトコル
└── package.json
```

## AntiGravity IDE 固有機能

### Execution Policies

| ポリシー | 動作 |
|---------|------|
| **Off** | 手動モード - すべての操作でユーザー確認 |
| **Auto** | バランスモード - ルーチンタスクは自動、重要な操作は確認 |
| **Turbo** | 最大自動化 - AI判断で最小限の確認 |

### Planning Modes

| モード | 動作 |
|--------|------|
| **Planning** | 詳細なステップバイステップ計画を作成してから実行 |
| **Fast** | 軽量な計画で高速実行 |

### Browser Sub-Agent

- **Chrome統合**: 専用プロファイルで分離
- **Web自動化**: Puppeteer/Playwright
- **スクレイピング**: データ抽出
- **セキュリティ**: Allowlist/Denylist
- **Artifacts**: スクリーンショット・録画を自動保存

### Mission Control

- **Inbox**: タスク一覧・進捗管理
- **Workspace**: プロジェクト整理
- **Agent Manager**: Agent実行・モニタリング

## 開発コマンド

### ビルド・実行

```bash
npm run build          # TypeScriptコンパイル
npm run watch          # ウォッチモード
npm run dev            # Electronアプリ起動
npm run package        # リリースパッケージ作成
```

### コード品質

```bash
npm run lint           # ESLintチェック
npm run lint:fix       # ESLint自動修正
npm run typecheck      # TypeScript型チェック
npm run format         # Prettier実行
npm run format:check   # Prettier確認
```

### テスト

```bash
npm test               # テスト実行
npm run pretest        # ビルド + Lint
```

## カスタムスラッシュコマンド

Claude Code で以下のコマンドが使用可能:

### AntiGravity IDE コマンド
- `/test` - プロジェクト全体のテストを実行
- `/verify` - システム動作確認（環境・コンパイル・テスト）
- `/deploy` - デプロイ実行
- `/security-scan` - セキュリティ脆弱性スキャン実行
- `/generate-docs` - コードからドキュメント自動生成

### Miyabi統合コマンド
- `/agent-run` - Autonomous Agent実行（Issue自動処理パイプライン）
- `/create-issue` - Agent実行用Issueを対話的に作成
- `/miyabi-status` - Miyabiプロジェクト状態確認
- `/miyabi-agent` - Miyabi Agent実行
- `/miyabi-auto` - Water Spider全自動モード起動
- `/miyabi-init` - 新規Miyabiプロジェクト作成
- `/miyabi-todos` - TODOコメント自動検出

## Claude Code スキル

以下のスキルが利用可能（`.claude/skills/`）:

- **electron-dev** - Electronアプリ開発支援
- **agent-debug** - Agent開発・デバッグ支援
- **browser-automation** - ブラウザ自動化支援

スキルを呼び出すには、関連するタスクを依頼するだけです。Claude Codeが自動的に適切なスキルを選択します。

## 識学理論（Shikigaku Theory）5原則

1. **責任の明確化** - 各AgentがIssueに対する責任を負う
2. **権限の委譲** - Agentは自律的に判断・実行可能
3. **階層の設計** - CoordinatorAgent → 各専門Agent
4. **結果の評価** - 品質スコア、カバレッジ、実行時間で評価
5. **曖昧性の排除** - DAGによる依存関係明示、状態ラベルで進捗可視化

## MCP Servers 統合

AntiGravity IDEは7つのMCPサーバーと統合されています（`.claude/mcp.json`）:

| MCP Server | 状態 | 機能 |
|-----------|------|------|
| **ide-integration** | ✅ 有効 | VS Code診断、Jupyter実行 |
| **github-enhanced** | ✅ 有効 | Issue/PR管理、Projects V2 |
| **project-context** | ✅ 有効 | package.json解析、依存関係 |
| **filesystem** | ✅ 有効 | ファイル読み書き |
| **miyabi** | ✅ 有効 | Miyabi CLI統合 |
| **dev3000** | ✅ 有効 | UI/UXデバッグツール |
| **context-engineering** | ⏸️ 無効 | AIコンテキスト分析 (外部依存未インストール) |

詳細: `.claude/README.md`

## 環境変数

```bash
# GitHub Personal Access Token（必須 - Miyabi Agent実行時）
GITHUB_TOKEN=ghp_xxxxx

# Anthropic API Key（必須 - Agent実行時）
ANTHROPIC_API_KEY=sk-ant-xxxxx

# リポジトリ名（オプション - GitHub MCP）
REPOSITORY=owner/repo
```

## 🌸 Miyabi Infrastructure

### Configuration Files

**`.miyabi/config.yml`** - Miyabiフレームワーク設定
- プロジェクト情報
- Agent Orchestra設定
- GitHub統合設定
- ラベル体系（65ラベル）
- AI設定（Claude Sonnet 4）
- MCP設定
- ビルド・テスト設定
- デプロイ設定

**`.miyabi/agents.yml`** - 21 Agent定義
- **Coding Agents (7)**: Coordinator, CodeGen, Review, Issue, PR, Deployment, Test
- **Business Agents (14)**: Entrepreneur, SelfAnalysis, MarketResearch, Persona, ProductConcept, ProductDesign, ContentCreation, FunnelDesign, SNSStrategy, Marketing, Sales, CRM, Analytics, YouTube
- Workflows定義
- Agent通信プロトコル
- Agent権限設定

### Utility Scripts

**`scripts/miyabi-init.sh`** - Miyabi初期化スクリプト
- 環境変数設定
- エイリアス定義（30+個）
- Agent切り替え機能
- ステータス表示

使用方法:
```bash
source scripts/miyabi-init.sh
ag-info              # クイックヘルプ
ag-miyabi-status     # 詳細ステータス
ag-agent-switch coordinator  # Agent切り替え
```

**`scripts/setup-orchestra.sh`** - Agent Orchestra セットアップ
- tmuxセッション作成（10ウィンドウ）
- Agent別ウィンドウ配置
- Conductor + 7 Agents + IDE-Core + Service

使用方法:
```bash
./scripts/setup-orchestra.sh
# Ctrl+b 0-9 でウィンドウ切り替え
# Ctrl+b d でデタッチ
```

**`scripts/mcp-launcher.sh`** - MCP Server管理
- MCPサーバーリスト表示
- サーバーステータス確認
- サーバーテスト
- サーバー起動

使用方法:
```bash
./scripts/mcp-launcher.sh list
./scripts/mcp-launcher.sh status github-enhanced
./scripts/mcp-launcher.sh launch github-enhanced
```

### Context Documentation

**`.claude/context/`** - Claude Code コンテキストモジュール

- **`README.md`** - コンテキスト概要
- **`agents.md`** - Miyabi Agent システム詳細（21 Agents、ワークフロー）
- **`development.md`** - 開発ガイドライン（コーディング規約、テスト、Git workflow）
- **`mcp.md`** - MCP Server統合（5サーバー、使用方法）

Claude Codeはこれらのファイルを自動的に参照してプロジェクト理解を深めます。

### 開発フロー

```bash
# 1. Miyabi初期化
source scripts/miyabi-init.sh

# 2. Agent Orchestraセットアップ
./scripts/setup-orchestra.sh

# 3. MCPサーバー起動（必要に応じて）
./scripts/mcp-launcher.sh launch github-enhanced

# 4. 開発開始
ag-build        # ビルド
ag-test         # テスト
ag-dev          # Electronアプリ起動
```

## サポート

- **Framework**: [Miyabi](https://github.com/ShunsukeHayashi/Autonomous-Operations)
- **Documentation**: README.md
- **Issues**: GitHub Issues で管理

---

🌸 **Miyabi** - Beauty in Autonomous Development

*このファイルは Claude Code が自動的に参照します。プロジェクトの変更に応じて更新してください。*
- LANG : ALL JA
