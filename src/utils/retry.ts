/**
 * リトライユーティリティ
 */

import { logger } from './logger';

/**
 * リトライポリシー
 */
export interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

/**
 * デフォルトリトライポリシー
 */
export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  backoffMs: 1000,
  backoffMultiplier: 2,
};

/**
 * リトライ実行
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  policy: RetryPolicy = DEFAULT_RETRY_POLICY,
  context?: string
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= policy.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // リトライ可能なエラーかチェック
      if (policy.retryableErrors && !isRetryableError(lastError, policy.retryableErrors)) {
        throw lastError;
      }

      // 最後の試行の場合は即座にエラーをスロー
      if (attempt === policy.maxRetries) {
        logger.error(`リトライ失敗: ${context || 'unknown'}`, {
          attempts: attempt,
          error: lastError.message,
        });
        throw lastError;
      }

      // バックオフ待機
      const backoffTime = policy.backoffMs * Math.pow(policy.backoffMultiplier, attempt - 1);
      logger.warn(`リトライ中 (${attempt}/${policy.maxRetries}): ${context || 'unknown'}`, {
        backoffTime,
        error: lastError.message,
      });

      await sleep(backoffTime);
    }
  }

  throw lastError || new Error('予期しないエラー');
}

/**
 * リトライ可能なエラーか判定
 */
function isRetryableError(error: Error, retryableErrors: string[]): boolean {
  return retryableErrors.some((pattern) => error.message.includes(pattern));
}

/**
 * スリープ
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
