/**
 * Retry ユーティリティ テスト
 */

import { executeWithRetry, sleep } from '../retry';

describe('executeWithRetry', () => {
  it('should succeed on first attempt', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const result = await executeWithRetry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');

    const result = await executeWithRetry(fn, {
      maxRetries: 3,
      backoffMs: 10,
      backoffMultiplier: 1,
    });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should throw after max retries', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('persistent failure'));

    await expect(
      executeWithRetry(fn, {
        maxRetries: 3,
        backoffMs: 10,
        backoffMultiplier: 1,
      })
    ).rejects.toThrow('persistent failure');

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should apply backoff', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');

    const startTime = Date.now();
    await executeWithRetry(fn, {
      maxRetries: 3,
      backoffMs: 100,
      backoffMultiplier: 1,
    });
    const duration = Date.now() - startTime;

    expect(duration).toBeGreaterThanOrEqual(100);
  });
});

describe('sleep', () => {
  it('should sleep for specified duration', async () => {
    const startTime = Date.now();
    await sleep(100);
    const duration = Date.now() - startTime;

    expect(duration).toBeGreaterThanOrEqual(100);
    expect(duration).toBeLessThan(150);
  });
});
