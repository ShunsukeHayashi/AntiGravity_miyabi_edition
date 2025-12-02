プロジェクトのドキュメントを自動生成します。

**生成内容:**

1. **API ドキュメント**
   - JSDoc コメントから自動生成
   - TypeDoc を使用

2. **README.md の更新**
   - 新機能の追加
   - 使用例の更新

3. **アーキテクチャ図**
   - モジュール構造の可視化
   - 依存関係図

**実行コマンド:**

```bash
# TypeDoc でAPIドキュメント生成
npx typedoc --out docs/api src/

# ドキュメント確認
open docs/api/index.html
```

**更新ファイル:**
- `docs/api/` - APIドキュメント
- `README.md` - プロジェクト概要
- `docs/ARCHITECTURE.md` - アーキテクチャ詳細
