Miyabi Framework の自律型エージェントパイプラインを実行します。

**実行フロー:**

1. **IssueAgent**: Issue を分析
   - ラベル自動付与
   - 複雑度・工数推定

2. **CoordinatorAgent**: タスク分解
   - DAG構築
   - Critical Path分析
   - 実行プラン作成

3. **CodeGenAgent**: コード実装
   - 要件に基づく実装
   - テストコード生成

4. **ReviewAgent**: 品質評価
   - 100点満点で採点
   - 80点以上で合格

5. **TestAgent**: テスト実行
   - 全テスト実行
   - カバレッジ測定（80%目標）

6. **PRAgent**: PR作成
   - Conventional Commits準拠
   - Draft PR作成

7. **DeploymentAgent**: デプロイ
   - 自動デプロイ
   - ヘルスチェック

**使用方法:**

```bash
# 特定のIssueを処理
/agent-run <issue-number>

# 最新のIssueを処理
/agent-run
```

**注意:**
- 各エージェントの実行結果を確認しながら進めます
- エラーが発生した場合は自動でリトライします
- 最終的な実行レポートを生成します
