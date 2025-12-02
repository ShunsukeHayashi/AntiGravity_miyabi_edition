アプリケーションをデプロイします。

**デプロイ環境を選択:**

1. **development** - 開発環境（自動デプロイ）
2. **staging** - ステージング環境（自動デプロイ）
3. **production** - 本番環境（手動承認必要）

**実行手順:**

1. 環境を確認：
```bash
# 現在のブランチ確認
git branch --show-current

# 変更確認
git status
```

2. ビルド実行：
```bash
npm run build
```

3. テスト実行：
```bash
npm test
```

4. パッケージング：
```bash
npm run package
```

5. デプロイ実行：
```bash
# 本番環境の場合は確認を求める
echo "本番環境にデプロイします。よろしいですか？ (yes/no)"
```

6. ヘルスチェック：
```bash
# デプロイ後の動作確認
curl http://localhost:3000/health
```

7. 結果レポート：
   - デプロイ成功/失敗
   - 所要時間
   - バージョン情報
