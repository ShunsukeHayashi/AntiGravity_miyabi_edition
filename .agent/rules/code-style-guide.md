# TypeScript コーディング規約

AntiGravity IDE プロジェクトの TypeScript コーディングスタイルガイドです。

## 基本原則

- **厳格な型チェック**: `strict: true` を使用
- **一貫性**: プロジェクト全体で統一されたスタイル
- **可読性**: 明確で理解しやすいコード
- **保守性**: 変更しやすく、拡張可能な設計

## TypeScript 設定

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## フォーマット規則

### Prettier 設定

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### インデント

- **2スペース** を使用（タブは使用しない）
- ネストは適切に行う

### セミコロン

- 常に使用する（Prettier により自動追加）

### クォート

- シングルクォート `'` を使用
- テンプレートリテラルは必要な場合のみ

```typescript
// ✅ Good
const message = 'Hello, AntiGravity';
const greeting = `Hello, ${name}`;

// ❌ Bad
const message = "Hello, AntiGravity";
const greeting = 'Hello, ' + name;
```

## 命名規則

### ファイル名

- **kebab-case** を使用: `agent-manager.ts`, `mission-control.ts`
- テストファイル: `agent-manager.test.ts`
- 型定義ファイル: `types.ts` または `*.types.ts`

### 変数・関数

- **camelCase** を使用

```typescript
// ✅ Good
const agentManager = new AgentManager();
function executeTask() {}

// ❌ Bad
const AgentManager = new AgentManager();
function ExecuteTask() {}
```

### クラス・インターフェース・型

- **PascalCase** を使用

```typescript
// ✅ Good
class AgentManager {}
interface IAgent {}
type ExecutionPolicy = 'off' | 'auto' | 'turbo';

// ❌ Bad
class agentManager {}
interface iAgent {}
type executionPolicy = 'off' | 'auto' | 'turbo';
```

### 定数

- **UPPER_SNAKE_CASE** を使用

```typescript
// ✅ Good
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 5000;

// ❌ Bad
const maxRetryCount = 3;
const defaultTimeout = 5000;
```

### プライベートメンバー

- アンダースコアプレフィックス `_` を使用（オプション）

```typescript
class Agent {
  private _state: string;
  private readonly _id: string;
}
```

## 型定義

### 明示的な型注釈

- 関数の戻り値は明示的に型を指定（推論が明確な場合は省略可）
- パラメータは必ず型を指定

```typescript
// ✅ Good
function createAgent(name: string, type: AgentType): Agent {
  return new Agent(name, type);
}

// ✅ Good (戻り値が明確な場合)
const add = (a: number, b: number) => a + b;

// ❌ Bad
function createAgent(name, type) {
  return new Agent(name, type);
}
```

### any の使用禁止

- `any` は原則使用しない
- 必要な場合は `unknown` を検討

```typescript
// ✅ Good
function processData(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  }
}

// ❌ Bad
function processData(data: any): void {
  console.log(data.toUpperCase());
}
```

### null と undefined

- 明示的に扱う
- オプショナル演算子 `?.` とnullish coalescing `??` を活用

```typescript
// ✅ Good
const result = agent?.execute() ?? 'default';

// ❌ Bad
const result = agent && agent.execute() ? agent.execute() : 'default';
```

## コメント

### JSDoc コメント

- 公開 API には JSDoc を記述

```typescript
/**
 * エージェントを実行します
 * @param taskId - 実行するタスクのID
 * @param options - 実行オプション
 * @returns 実行結果
 * @throws {AgentError} エージェントが無効な場合
 */
function executeAgent(taskId: string, options?: ExecutionOptions): Promise<Result> {
  // 実装
}
```

### インラインコメント

- 複雑なロジックには説明を追加
- 自明な内容にはコメント不要

```typescript
// ✅ Good
// DAGの循環依存をチェック
const hasCycle = detectCycle(graph);

// ❌ Bad
// iを1増やす
i++;
```

## インポート

### インポート順序

1. Node.js 標準モジュール
2. 外部ライブラリ
3. 内部モジュール（絶対パス）
4. 内部モジュール（相対パス）

```typescript
// ✅ Good
import { app } from 'electron';
import * as fs from 'fs';

import express from 'express';
import axios from 'axios';

import { AgentManager } from '@/agent/manager';
import { logger } from '@/utils/logger';

import { helper } from './helper';
import type { Agent } from './types';
```

### デフォルトエクスポート vs 名前付きエクスポート

- **名前付きエクスポート** を優先

```typescript
// ✅ Good
export class AgentManager {}
export function createAgent() {}

// ❌ Bad (特別な理由がない限り)
export default class AgentManager {}
```

## ベストプラクティス

### async/await

- Promise チェーンよりも `async/await` を使用

```typescript
// ✅ Good
async function loadAgent() {
  const config = await loadConfig();
  const agent = await createAgent(config);
  return agent;
}

// ❌ Bad
function loadAgent() {
  return loadConfig()
    .then((config) => createAgent(config))
    .then((agent) => agent);
}
```

### アロー関数

- コールバックにはアロー関数を使用
- メソッドには通常の関数を使用

```typescript
// ✅ Good
class Agent {
  execute() {
    return this.tasks.map((task) => task.run());
  }
}

// ❌ Bad
class Agent {
  execute = () => {
    return this.tasks.map(function(task) {
      return task.run();
    });
  }
}
```

### 分割代入

- オブジェクトと配列には分割代入を使用

```typescript
// ✅ Good
const { name, type } = agent;
const [first, ...rest] = tasks;

// ❌ Bad
const name = agent.name;
const type = agent.type;
const first = tasks[0];
```

### オブジェクトショートハンド

- プロパティ名と変数名が同じ場合は省略

```typescript
// ✅ Good
const agent = { name, type };

// ❌ Bad
const agent = { name: name, type: type };
```

## エラーハンドリング

### カスタムエラークラス

- エラーは適切に型付けする

```typescript
// ✅ Good
class AgentError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

throw new AgentError('Agent initialization failed', 'AGENT_INIT_ERROR');
```

### try-catch

- エラーハンドリングは適切に行う

```typescript
// ✅ Good
try {
  await agent.execute();
} catch (error) {
  if (error instanceof AgentError) {
    logger.error(`Agent error: ${error.message}`, { code: error.code });
  } else {
    logger.error('Unknown error', { error });
  }
}
```

## テスト

### テストファイル命名

- `*.test.ts` または `*.spec.ts`

### テストの構造

```typescript
describe('AgentManager', () => {
  describe('execute', () => {
    it('should execute agent successfully', async () => {
      const manager = new AgentManager();
      const result = await manager.execute('task-1');
      expect(result.success).toBe(true);
    });

    it('should throw error when agent not found', async () => {
      const manager = new AgentManager();
      await expect(manager.execute('invalid')).rejects.toThrow(AgentError);
    });
  });
});
```

## 禁止事項

- ❌ `eval()` の使用
- ❌ `with` 文の使用
- ❌ `var` の使用（`const` または `let` を使用）
- ❌ `console.log` の本番コードへの残存（開発時は OK）
- ❌ 未使用の変数・インポート
- ❌ 型アサーション `as any` の多用

## 自動化

### フォーマットとリント

```bash
# フォーマット
npm run format

# リント
npm run lint
npm run lint:fix

# 型チェック
npm run typecheck
```

### Pre-commit フック

- コミット前に自動フォーマット・リントを実行
- テストが失敗する場合はコミット拒否

---

このガイドに従うことで、統一された高品質な TypeScript コードを維持できます。
