# Electron Development Skill

このスキルは、AntiGravity IDE の Electron アプリケーション開発を支援します。

## 提供機能

### 1. Electronアプリケーションのビルド・実行
- TypeScriptコンパイル (`npm run build`)
- 開発モード実行 (`npm run dev`)
- ウォッチモード (`npm run watch`)

### 2. 主要ファイル構造の理解
```
src/
├── main.ts              # Mainプロセス
├── app/                 # アプリケーションロジック
│   ├── lifecycle.ts     # ライフサイクル管理
│   ├── menu.ts          # メニュー
│   └── window.ts        # ウィンドウ管理
├── agent/               # Agentシステム
├── browser/             # Browser Sub-Agent
├── editor/              # Editor Core
└── ui/                  # UI Layer
```

### 3. 開発ワークフロー

#### コード変更時の確認手順
1. `npm run typecheck` - 型チェック
2. `npm run lint` - ESLintチェック
3. `npm run build` - ビルド
4. `npm run dev` - 実行確認

#### デバッグ
- Mainプロセス: `console.log()` または Chrome DevTools
- Rendererプロセス: Chrome DevTools (Cmd+Option+I)

### 4. よくある問題と解決策

#### ビルドエラー
- `out/` ディレクトリを削除して再ビルド
- `node_modules/` を削除して `npm install`

#### アプリが起動しない
- `out/main.js` が存在するか確認
- TypeScriptエラーがないか確認

#### IPC通信エラー
- チャネル名が main/renderer で一致しているか確認
- `ipcMain`/`ipcRenderer` の使い分けを確認

## 推奨コマンド

```bash
# 開発開始
npm run watch    # 別ターミナルで実行
npm run dev      # アプリ起動

# リリースビルド
npm run build
npm run package  # electronフォルダにパッケージ化

# コード品質チェック
npm run typecheck
npm run lint
npm run format
```

## Agent統合

AntiGravity IDEはAgent-first設計です。新機能実装時は以下を考慮:

1. **Agent Manager** - `src/agent/manager.ts` でAgent登録
2. **Mission Control** - `src/agent/mission-control.ts` でUI統合
3. **Execution Policy** - Off/Auto/Turboモードに対応
4. **Planning Mode** - Planning/Fastモードに対応

## 参考リソース

- [Electron公式ドキュメント](https://www.electronjs.org/docs/latest/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- AntiGravity IDE仕様: `docs/ARCHITECTURE.md`
