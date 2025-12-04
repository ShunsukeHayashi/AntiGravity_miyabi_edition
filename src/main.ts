/**
 * AntiGravity IDE - Main Entry Point
 * Electron メインプロセス
 */

import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { logger } from './utils';
import {
  CoordinatorAgent,
  IssueAgent,
  CodeGenAgent,
  ReviewAgent,
  TestAgent,
  PRAgent,
  DeploymentAgent,
} from './agent';

/**
 * メインウィンドウ
 */
let mainWindow: BrowserWindow | null = null;

/**
 * エージェントインスタンス
 */
const agents = {
  coordinator: new CoordinatorAgent(),
  issue: new IssueAgent(),
  codegen: new CodeGenAgent(),
  review: new ReviewAgent(),
  test: new TestAgent(),
  pr: new PRAgent(),
  deployment: new DeploymentAgent(),
};

/**
 * メインウィンドウ作成
 */
function createWindow(): void {
  logger.info('Creating main window...');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    title: 'AntiGravity IDE',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // HTMLファイルをロード
  const htmlPath = path.join(__dirname, '../src/renderer/index.html');
  mainWindow.loadFile(htmlPath);

  // 開発時はDevToolsを自動で開く
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  logger.info('Main window created successfully');
}

/**
 * エージェント初期化
 */
async function initializeAgents(): Promise<void> {
  logger.info('Initializing Miyabi agents...');

  try {
    await Promise.all([
      agents.coordinator.initialize(),
      agents.issue.initialize(),
      agents.codegen.initialize(),
      agents.review.initialize(),
      agents.test.initialize(),
      agents.pr.initialize(),
      agents.deployment.initialize(),
    ]);

    logger.info('All agents initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize agents', {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * エージェント停止
 */
async function shutdownAgents(): Promise<void> {
  logger.info('Shutting down Miyabi agents...');

  try {
    await Promise.all([
      agents.coordinator.shutdown(),
      agents.issue.shutdown(),
      agents.codegen.shutdown(),
      agents.review.shutdown(),
      agents.test.shutdown(),
      agents.pr.shutdown(),
      agents.deployment.shutdown(),
    ]);

    logger.info('All agents shut down successfully');
  } catch (error) {
    logger.error('Failed to shutdown agents', {
      error: (error as Error).message,
    });
  }
}

/**
 * アプリケーション起動
 */
app.on('ready', async () => {
  logger.info('AntiGravity IDE starting...');
  logger.info(`Version: ${app.getVersion()}`);
  logger.info(`Electron: ${process.versions.electron}`);
  logger.info(`Node: ${process.versions.node}`);

  try {
    // エージェント初期化
    await initializeAgents();

    // メインウィンドウ作成
    createWindow();

    logger.info('AntiGravity IDE started successfully');
  } catch (error) {
    logger.error('Failed to start AntiGravity IDE', {
      error: (error as Error).message,
    });
    app.quit();
  }
});

/**
 * 全ウィンドウが閉じられたとき
 */
app.on('window-all-closed', () => {
  // macOS以外ではアプリケーションを終了
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * アクティベート
 */
app.on('activate', () => {
  // macOSでウィンドウがない場合は作成
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * アプリケーション終了前
 */
app.on('before-quit', async (event) => {
  event.preventDefault();

  logger.info('AntiGravity IDE shutting down...');

  try {
    await shutdownAgents();
    logger.info('AntiGravity IDE shut down successfully');
  } catch (error) {
    logger.error('Error during shutdown', {
      error: (error as Error).message,
    });
  } finally {
    app.exit(0);
  }
});

/**
 * 未処理の例外
 */
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack,
  });
  app.quit();
});

/**
 * 未処理のPromise拒否
 */
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', {
    reason: String(reason),
  });
});

/**
 * エージェントをエクスポート（IPC通信などで使用）
 */
export { agents };
