# Antigravity Clone - Agent-First IDE Prototype

Google Antigravity IDE のリバースエンジニアリング・プロトタイプへようこそ。
本プロジェクトは、**Agent-First Architecture** を採用した次世代IDEのコンセプト実証実装です。

## 🚀 クイックスタート

本プロトタイプは、フロントエンド (`ide-core`) とバックエンド (`agent-service`) の2つのコンポーネントで構成されています。

### 前提条件
- Node.js (v18以上)
- npm

### 起動手順

2つのターミナルを開き、それぞれで以下のコマンドを実行してください。

**Terminal 1: エージェントサービス (Backend)**
```bash
# 依存関係のインストール（初回のみ）
cd agent-service
npm install

# サーバー起動
node server.js
```
> エージェントサービスは `ws://localhost:3001` で待機します。

**Terminal 2: IDE Core (Frontend)**
```bash
# 依存関係のインストール（初回のみ）
cd ide-core
npm install

# 開発サーバー起動
npm run dev
```
> ブラウザで `http://localhost:3000` にアクセスしてください。

## 📁 プロジェクト構造

```
AntiGravity/
├── ide-core/           # Next.js ベースのIDEフロントエンド
│   ├── src/app/        # App Router ページ定義
│   └── src/components/ # UIコンポーネント (ActivityBar, Sidebar, etc.)
│
├── agent-service/      # WebSocket ベースのエージェントバックエンド
│   └── server.js       # エージェントロジックのモック実装
│
├── docs/               # プロジェクトドキュメント
│   ├── VSCODE_VS_ANTIGRAVITY.md # コンセプト比較（Vision）
│   └── IMPLEMENTATION_STATUS.md # 実装状況（Reality）
│
└── .agent/             # エージェント設定（Antigravity仕様）
```

## 🌟 主な機能（プロトタイプ）

1.  **Agent Manager UI**: エージェントとのチャット対話インターフェース
2.  **Browser Subagent**: ブラウザ操作のシミュレーションとオーバーレイ表示
3.  **Task State Simulation**: Planning → Execution → Verification の状態遷移

## 📚 ドキュメント

- [Vision: VS Code vs Antigravity](./docs/VSCODE_VS_ANTIGRAVITY.md) - 目指すべき姿の定義
- [Implementation Status](./docs/IMPLEMENTATION_STATUS.md) - 現在の実装状況とロードマップ
