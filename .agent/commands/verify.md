システム全体の動作確認を実行します。

**検証項目:**

1. **環境確認**
```bash
node --version  # Node.js 18以上
npm --version   # npm 9以上
git --version
```

2. **依存関係確認**
```bash
npm install
npm audit
```

3. **コンパイル確認**
```bash
npm run typecheck
npm run build
```

4. **リント確認**
```bash
npm run lint
```

5. **フォーマット確認**
```bash
npm run format:check
```

6. **テスト実行**
```bash
npm test
```

7. **アプリケーション起動**
```bash
# 開発モードで起動
npm run dev

# 正常に起動することを確認
```

**結果:**
- ✅ すべての検証が成功した場合、システムは正常です
- ❌ 失敗した項目がある場合、エラーメッセージを表示して修正方法を提案
