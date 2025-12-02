# Browser Automation Skill

このスキルは、AntiGravity IDE の Browser Sub-Agent 機能の開発を支援します。

## Browser Sub-Agent 概要

Browser Sub-Agentは、Chromeブラウザを制御してWeb自動化を実行するAgentです。

### 主要機能

1. **Web自動化** - フォーム入力、クリック操作など
2. **スクレイピング** - Webページからデータ抽出
3. **スクリーンショット/録画** - 画面キャプチャと動画記録
4. **セキュリティ** - allowlist/denylist による安全な実行

### アーキテクチャ

```
AntiGravity IDE (Electron)
    ↓ IPC
Browser Controller
    ↓ Chrome DevTools Protocol (CDP)
Chrome Browser (Separate Profile)
    ↓ DOM Manipulation
Chrome Extension (AntiGravity Agent)
```

## 開発ガイド

### 1. Browser Controller の実装

`src/browser/controller.ts`:

```typescript
export class BrowserController {
  private chromeInstance: any;

  async launch(): Promise<void> {
    // Chromeを専用プロファイルで起動
    this.chromeInstance = await launchChrome({
      userDataDir: './chrome-profile',
      headless: false,
    });
  }

  async navigate(url: string): Promise<void> {
    // セキュリティチェック
    if (!this.isAllowedUrl(url)) {
      throw new Error(`URL not allowed: ${url}`);
    }

    await this.chromeInstance.goto(url);
  }
}
```

### 2. Web自動化の実装

`src/browser/automation.ts`:

```typescript
export class BrowserAutomation {
  async fillForm(selector: string, value: string): Promise<void> {
    await this.page.type(selector, value);
  }

  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  async screenshot(options?: ScreenshotOptions): Promise<Buffer> {
    return await this.page.screenshot(options);
  }
}
```

### 3. Webスクレイピング

`src/browser/scraper.ts`:

```typescript
export class WebScraper {
  async extractData(selectors: Record<string, string>): Promise<any> {
    const data = {};

    for (const [key, selector] of Object.entries(selectors)) {
      data[key] = await this.page.$eval(selector, el => el.textContent);
    }

    return data;
  }
}
```

### 4. セキュリティ設定

#### Allowlist (ローカル設定)

```json
{
  "allowedDomains": [
    "github.com",
    "stackoverflow.com",
    "*.example.com"
  ]
}
```

#### Denylist (サーバー側)

```
malicious-site.com
phishing-*.com
```

### 5. スクリーンショット/録画

```typescript
// スクリーンショット
const screenshot = await browser.screenshot({
  fullPage: true,
  type: 'png'
});

// 録画開始
await browser.startRecording({
  fps: 30,
  quality: 'high'
});

// 録画停止
const video = await browser.stopRecording();
```

## Chrome Extension 統合

### Manifest V3 設定

`chrome-extension/manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "AntiGravity Agent",
  "version": "1.0.0",
  "permissions": [
    "activeTab",
    "scripting",
    "storage"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
```

### Content Script との通信

```typescript
// Main Process → Extension
await chrome.runtime.sendMessage({
  type: 'EXECUTE_ACTION',
  payload: { action: 'click', selector: '#button' }
});

// Extension → Main Process
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ACTION_COMPLETE') {
    sendResponse({ success: true });
  }
});
```

## デバッグ

### Chrome DevTools Protocol のデバッグ

```bash
# Chromeをリモートデバッグモードで起動
chrome --remote-debugging-port=9222 --user-data-dir=./chrome-profile

# localhost:9222 でDevToolsにアクセス
```

### ログ確認

```typescript
// Browser Controllerのログ
console.log('[BrowserController]', 'Navigate to:', url);

// Chrome Extensionのログ
chrome.devtools.panels.create('AntiGravity', ...);
```

## Artifact 自動保存

Browser Agentが実行したタスクは自動的にArtifactとして保存:

```
.artifacts/
├── screenshots/
│   └── 2025-12-02_task-123.png
└── recordings/
    └── 2025-12-02_task-123.webm
```

## ベストプラクティス

### 1. セキュリティ
- 常に allowlist/denylist チェックを実行
- ユーザーデータを扱う際は暗号化
- CSPヘッダーを尊重

### 2. パフォーマンス
- 不要なリソース読み込みをブロック
- ページロードのタイムアウト設定
- メモリリークに注意

### 3. エラーハンドリング
- ネットワークエラーに対応
- セレクタが見つからない場合のフォールバック
- タイムアウト処理

## ライブラリ推奨

- **Puppeteer** - Chrome自動化
- **Playwright** - マルチブラウザ対応
- **Cheerio** - HTML解析

## テスト

```bash
# Browser Automation テスト
npm test -- browser/automation.test.ts

# E2Eテスト
npm test -- e2e/browser-flow.test.ts
```

## 参考

- [Puppeteer Documentation](https://pptr.dev/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/)
