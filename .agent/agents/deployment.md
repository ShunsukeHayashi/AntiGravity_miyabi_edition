# DeploymentAgent

## 概要

DeploymentAgent は CI/CD パイプラインの実行とデプロイ自動化を担当するエージェントです。自動デプロイ、ヘルスチェック、ロールバック機能を提供します。

## 責任範囲（識学理論：責任の明確化）

### 主要責任

1. **自動デプロイ** - PRマージ後の自動デプロイ
2. **CI/CD実行** - GitHub Actions ワークフローの実行
3. **ヘルスチェック** - デプロイ後の動作確認
4. **自動ロールバック** - 失敗時の自動復旧
5. **環境管理** - dev/staging/production の管理
6. **デプロイレポート** - デプロイ結果のレポート生成

### 権限（識学理論：権限の委譲）

- ✅ PRのマージ
- ✅ GitHub Actions のトリガー
- ✅ デプロイの実行
- ✅ ロールバックの実行
- ✅ 環境変数の管理

### 制約

- ❌ コード変更（CodeGenAgentの責務）
- ❌ 本番DBの直接操作（DBA権限が必要）

## デプロイプロセス

```
1. PRマージ検知
   ↓
2. ビルド実行
   - npm run build
   - TypeScript コンパイル
   ↓
3. テスト実行
   - npm test
   - E2Eテスト
   ↓
4. パッケージング
   - electron-builder
   - アーティファクト生成
   ↓
5. デプロイ実行
   - 環境に応じたデプロイ
   - ダウンタイム最小化
   ↓
6. ヘルスチェック
   - エンドポイント確認
   - 基本機能チェック
   ↓
7. 結果判定
   - 成功: 通知 → 完了
   - 失敗: ロールバック → 通知
   ↓
8. レポート生成
   - デプロイサマリー
   - パフォーマンス指標
```

## デプロイ環境

### 環境一覧

| 環境 | ブランチ | 自動デプロイ | 承認 |
|------|---------|------------|------|
| development | `develop` | ✅ 自動 | 不要 |
| staging | `staging` | ✅ 自動 | 不要 |
| production | `main` | ⚠️ 手動承認 | 必要 |

### デプロイ戦略

#### 1. ブルー/グリーンデプロイ

```typescript
interface BlueGreenDeploy {
  currentEnvironment: 'blue' | 'green';
  newVersion: string;
  steps: [
    'Deploy to inactive environment',
    'Run health checks',
    'Switch traffic',
    'Monitor',
    'Decommission old environment',
  ];
}
```

#### 2. カナリアリリース

```typescript
interface CanaryRelease {
  percentage: number; // 段階的にトラフィックを増やす
  stages: [
    { traffic: 10, duration: '5min' },
    { traffic: 50, duration: '10min' },
    { traffic: 100, duration: 'stable' },
  ];
}
```

## ヘルスチェック

### チェック項目

```typescript
interface HealthCheck {
  endpoint: string;
  method: 'GET' | 'POST';
  expectedStatus: number;
  timeout: number; // ms
  retries: number;
}

const healthChecks: HealthCheck[] = [
  {
    endpoint: '/health',
    method: 'GET',
    expectedStatus: 200,
    timeout: 5000,
    retries: 3,
  },
  {
    endpoint: '/api/version',
    method: 'GET',
    expectedStatus: 200,
    timeout: 3000,
    retries: 2,
  },
];
```

### ヘルスチェック判定

```typescript
async function performHealthCheck(checks: HealthCheck[]): Promise<boolean> {
  for (const check of checks) {
    let success = false;

    for (let i = 0; i < check.retries; i++) {
      try {
        const response = await fetch(check.endpoint, {
          method: check.method,
          timeout: check.timeout,
        });

        if (response.status === check.expectedStatus) {
          success = true;
          break;
        }
      } catch (error) {
        if (i === check.retries - 1) {
          return false;
        }
        await sleep(1000 * (i + 1)); // Exponential backoff
      }
    }

    if (!success) {
      return false;
    }
  }

  return true;
}
```

## 自動ロールバック

### ロールバック条件

```typescript
interface RollbackConditions {
  healthCheckFailed: boolean; // ヘルスチェック失敗
  errorRate: number; // エラー率が閾値超過
  responseTime: number; // レスポンスタイムが閾値超過
  crashDetected: boolean; // クラッシュ検知
}

function shouldRollback(conditions: RollbackConditions): boolean {
  return (
    conditions.healthCheckFailed ||
    conditions.errorRate > 5 || // 5%以上のエラー率
    conditions.responseTime > 1000 || // 1秒以上のレスポンスタイム
    conditions.crashDetected
  );
}
```

### ロールバック手順

```
1. 異常検知
   ↓
2. トラフィック停止
   - 新バージョンへのトラフィックを停止
   ↓
3. 旧バージョンへ切り戻し
   - 前バージョンのイメージをデプロイ
   ↓
4. ヘルスチェック
   - 旧バージョンの動作確認
   ↓
5. トラフィック再開
   - 旧バージョンへトラフィック流入
   ↓
6. 通知
   - ロールバック完了の通知
   - 原因調査の依頼
```

## CI/CD パイプライン

### GitHub Actions ワークフロー

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

      - name: Package
        run: npm run package

      - name: Deploy
        run: |
          # デプロイスクリプト実行
          ./scripts/deploy.sh production

      - name: Health Check
        run: |
          # ヘルスチェック実行
          ./scripts/health-check.sh

      - name: Notify
        if: always()
        run: |
          # 結果通知
          ./scripts/notify.sh
```

## 実装ガイドライン

### ファイル構造

```
src/agent/deployment/
├── deployment.ts           # DeploymentAgentメインクラス
├── deployer.ts             # デプロイ実行
├── health-checker.ts       # ヘルスチェック
├── rollback.ts             # ロールバック
└── types.ts                # 型定義
```

### 使用例

```typescript
import { DeploymentAgent } from '@/agent/deployment';

const deployer = new DeploymentAgent();

// デプロイ実行
const result = await deployer.deploy({
  environment: 'production',
  version: 'v1.2.3',
  prNumber: 456,
  strategy: 'blue-green',
});

console.log('デプロイ状態:', result.status);
console.log('URL:', result.url);

if (!result.success) {
  console.log('ロールバック実行中...');
  await deployer.rollback(result.deploymentId);
}
```

## レポート内容

```typescript
interface DeploymentReport {
  deploymentId: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  prNumber: number;
  strategy: 'blue-green' | 'canary' | 'rolling';
  startedAt: Date;
  completedAt: Date;
  duration: number; // 秒
  status: 'success' | 'failed' | 'rolled-back';
  healthChecks: {
    endpoint: string;
    status: 'passed' | 'failed';
    responseTime: number;
  }[];
  metrics: {
    buildTime: number;
    testTime: number;
    deployTime: number;
  };
  rollback: {
    executed: boolean;
    reason?: string;
    duration?: number;
  };
}
```

## 評価指標（識学理論：結果の評価）

### KPI

- **デプロイ成功率**: 成功したデプロイ数 / 全デプロイ数
- **平均デプロイ時間**: デプロイ完了までの平均時間
- **ロールバック率**: ロールバックが発生した割合
- **ダウンタイム**: デプロイに伴うダウンタイムの合計

### SLA

| 指標 | 目標 |
|------|------|
| デプロイ成功率 | 95%以上 |
| 平均デプロイ時間 | 15分以内 |
| ロールバック率 | 5%以下 |
| ダウンタイム | 0分（ゼロダウンタイム） |

## 識学理論5原則の適用

1. **責任の明確化**: デプロイとロールバックのみを担当
2. **権限の委譲**: デプロイの実行を自律的に判断
3. **階層の設計**: PRAgentの後工程
4. **結果の評価**: 成功率と時間で定量評価
5. **曖昧性の排除**: 明確なヘルスチェック基準

---

🌸 **Miyabi Framework** - Beauty in Autonomous Development
