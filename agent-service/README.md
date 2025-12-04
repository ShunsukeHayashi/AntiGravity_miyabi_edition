# agent-service

Antigravity IDE のバックエンドエージェントサービスです。WebSocketサーバーとして動作し、IDEからのリクエストを処理してエージェントの思考プロセスをシミュレートします。

## アーキテクチャ

### 技術スタック
- **Runtime**: Node.js
- **Protocol**: WebSocket (ws)
- **Server**: Express (HTTP server for WS upgrade)

### 通信プロトコル

#### Client -> Server

**User Request**:
```json
{
  "type": "user_request",
  "content": "ログイン機能を実装して"
}
```

#### Server -> Client

**Task Boundary Update**:
```json
{
  "type": "task_boundary",
  "data": {
    "mode": "PLANNING",  // PLANNING | EXECUTION | VERIFICATION | IDLE
    "taskName": "Processing User Request",
    "taskStatus": "Analyzing requirements",
    "taskSummary": "Received request..."
  }
}
```

## 動作ロジック (`server.js`)

現在は簡易的なシミュレーションロジックを実装しています：

1.  **IDLE**: 接続時の初期状態
2.  **PLANNING**: ユーザーリクエスト受信後、即座に遷移
3.  **EXECUTION**: 2秒後に遷移（実装作業をシミュレート）
4.  **IDLE**: 5秒後に完了として遷移

将来的には、ここに実際のLLM呼び出しやツール実行ロジック（Miyabi System）を統合する予定です。
