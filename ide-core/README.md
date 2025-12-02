# ide-core

Antigravity IDE のフロントエンド実装です。Next.js (App Router) をベースに、VS CodeライクなUIとエージェント対話機能を提供します。

## アーキテクチャ

### 技術スタック
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules (VS Codeのテーマ変数を再現)
- **Icons**: Lucide React

### ディレクトリ構造

```
src/
├── app/
│   ├── layout.tsx       # グローバルレイアウト
│   ├── page.tsx         # メインビュー（条件付きレンダリング）
│   └── globals.css      # グローバルスタイル・変数定義
│
├── components/
│   ├── Layout/          # IDEシェルコンポーネント
│   │   ├── ActivityBar.tsx  # 左端のアクティビティバー
│   │   ├── Sidebar.tsx      # サイドバー（AgentView等をホスト）
│   │   ├── EditorArea.tsx   # エディタ領域
│   │   └── StatusBar.tsx    # ステータスバー
│   │
│   ├── Agent/           # エージェント機能
│   │   └── AgentView.tsx    # チャットUI + WebSocketクライアント
│   │
│   └── Browser/         # ブラウザ機能
│       └── BrowserView.tsx  # ブラウザエミュレーション + オーバーレイ
```

## 主要コンポーネント

### AgentView (`src/components/Agent/AgentView.tsx`)
`agent-service` と WebSocket で接続し、以下の機能を持ちます：
- ユーザー入力の送信
- エージェントからのステータス更新 (`task_boundary`) の受信と表示
- チャット履歴の表示

### BrowserView (`src/components/Browser/BrowserView.tsx`)
ブラウザサブエージェントの動作をシミュレートします：
- iframeによるコンテンツ表示（現在はダミー）
- 青枠のオーバーレイによる「エージェント操作中」状態の可視化
