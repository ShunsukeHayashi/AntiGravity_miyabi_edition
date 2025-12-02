GitHub Issue を対話的に作成します。

**実行手順:**

1. ユーザーに以下を質問：
   - タイトル
   - 説明
   - タイプ（feature/bug/refactor/docs/test/chore）
   - 優先度（P0/P1/P2/P3）

2. Issue を作成：
```bash
gh issue create --title "{タイトル}" --body "{説明}"
```

3. IssueAgent による自動分析を待機：
   - ラベル自動付与
   - 複雑度推定
   - 工数見積もり

4. 作成された Issue の URL を表示
