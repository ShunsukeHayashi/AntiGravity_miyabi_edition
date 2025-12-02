/**
 * ロガーユーティリティ
 */

import type { LogEntry, LoggerConfig } from '../types/common';

/**
 * ロガークラス
 */
export class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: config.level || 'info',
      format: config.format || 'text',
      output: config.output || 'console',
    };
  }

  /**
   * デバッグログ
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      this.log('debug', message, context);
    }
  }

  /**
   * 情報ログ
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      this.log('info', message, context);
    }
  }

  /**
   * 警告ログ
   */
  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      this.log('warn', message, context);
    }
  }

  /**
   * エラーログ
   */
  error(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      this.log('error', message, context);
    }
  }

  /**
   * ログ出力の判定
   */
  private shouldLog(level: LoggerConfig['level']): boolean {
    const levels: LoggerConfig['level'][] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const targetLevelIndex = levels.indexOf(level);
    return targetLevelIndex >= currentLevelIndex;
  }

  /**
   * ログ出力
   */
  private log(
    level: LoggerConfig['level'],
    message: string,
    context?: Record<string, unknown>
  ): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
    };

    if (this.config.format === 'json') {
      console.log(JSON.stringify(entry));
    } else {
      const contextStr = context ? ` ${JSON.stringify(context)}` : '';
      console.log(`[${entry.timestamp.toISOString()}] [${level.toUpperCase()}] ${message}${contextStr}`);
    }
  }
}

/**
 * グローバルロガーインスタンス
 */
export const logger = new Logger();
