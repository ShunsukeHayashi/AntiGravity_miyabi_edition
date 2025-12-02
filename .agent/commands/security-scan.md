セキュリティ脆弱性スキャンを実行します。

**スキャン項目:**

1. **依存関係の脆弱性**
```bash
npm audit
npm audit fix --dry-run
```

2. **コードの静的解析**
```bash
# ESLint セキュリティプラグイン
npm run lint -- --plugin security

# TypeScript strict mode チェック
npm run typecheck
```

3. **OWASP Top 10 チェック**
   - SQLインジェクション
   - XSS（クロスサイトスクリプティング）
   - CSRF（クロスサイトリクエストフォージェリ）
   - コマンドインジェクション
   - 機密情報の露出
   - アクセス制御の不備
   - セキュリティ設定ミス
   - XXE（XML外部エンティティ参照）
   - 安全でないデシリアライゼーション
   - 既知の脆弱性のあるコンポーネント

4. **環境変数チェック**
```bash
# .env ファイルが .gitignore に含まれているか確認
grep ".env" .gitignore

# 機密情報がコード内にハードコードされていないか確認
grep -r "API_KEY\|PASSWORD\|SECRET" src/
```

5. **ライセンスチェック**
```bash
# ライセンス互換性の確認
npx license-checker --summary
```

**レポート:**
- 検出された脆弱性のリスト
- 重要度（Critical/High/Medium/Low）
- 推奨される対応策
- 修正コマンド

**自動修正:**
重大な脆弱性が見つかった場合、自動で修正を提案：
```bash
npm audit fix
```
