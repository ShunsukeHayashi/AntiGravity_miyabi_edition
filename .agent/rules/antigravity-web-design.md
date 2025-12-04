---
trigger: always_on
description: Google Antigravity Web Design Standards - Rich Aesthetics and Premium Design
source: Google DeepMind Antigravity Official System Prompt
---

# Antigravity Web Design Standards

Google Antigravityの公式Web開発ベストプラクティスです。**美しいデザインは必須要件です。**

## 🚨 重要原則

> **CRITICAL REMINDER: AESTHETICS ARE VERY IMPORTANT.**
>
> **If your web app looks simple and basic then you have FAILED!**

---

## 🎨 Design Aesthetics

### 1. Rich Aesthetics（豊かな美学）

**目標**: ユーザーが一目見て「WOW」と感動するデザイン

**必須要素**:
- ✅ 鮮やかな色彩
- ✅ ダークモード対応
- ✅ グラスモーフィズム効果
- ✅ ダイナミックアニメーション
- ✅ 印象的な第一印象

**❌ 失敗例**:
```
- 単純な色（plain red, blue, green）
- ブラウザデフォルトのタイポグラフィ
- 静的なインターフェース
- ミニマムバイアブルプロダクト（MVP）レベル
```

---

### 2. Visual Excellence（視覚的卓越性）

**プレミアムに見せるデザイン実装**:

#### カラーパレット

```css
❌ Bad: 汎用的な色
.button {
  background: #ff0000;  /* Plain red */
  color: #0000ff;       /* Plain blue */
}

✅ Good: 調和のとれたカラーパレット
.button {
  background: hsl(220, 90%, 56%);  /* Vibrant blue */
  color: hsl(0, 0%, 100%);
  background: linear-gradient(135deg,
    hsl(220, 90%, 56%) 0%,
    hsl(250, 90%, 66%) 100%
  );
}
```

**推奨パレット**:
- HSL tailored colors
- Sleek dark modes
- Gradient combinations

#### タイポグラフィ

```css
❌ Bad: ブラウザデフォルト
body {
  font-family: sans-serif;
}

✅ Good: モダンなGoogle Fonts
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}

h1 {
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

**推奨フォント**:
- Inter（汎用）
- Roboto（クリーン）
- Outfit（モダン）
- Poppins（フレンドリー）

#### グラデーション

```css
✅ Smooth gradients:
.hero {
  background: linear-gradient(135deg,
    hsl(220, 90%, 12%) 0%,
    hsl(250, 90%, 20%) 100%
  );
}

.card {
  background: linear-gradient(to bottom right,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
}
```

---

### 3. Dynamic Design（ダイナミックデザイン）

**インタラクティブで生き生きとしたインターフェース**

#### Hover Effects

```css
.button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}
```

#### Micro-animations

```css
/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: fadeIn 0.6s ease-out;
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.notification {
  animation: pulse 2s infinite;
}
```

**効果的なマイクロアニメーション**:
- ローディングスピナー
- ボタンクリック時のフィードバック
- ページ遷移
- スクロールアニメーション
- ホバーエフェクト

---

### 4. Premium Designs（プレミアムデザイン）

**最先端でプレミアムに感じるデザイン**

#### グラスモーフィズム

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
```

#### ニューモーフィズム

```css
.neumorphic {
  background: #e0e5ec;
  box-shadow:
    9px 9px 16px rgba(163, 177, 198, 0.6),
    -9px -9px 16px rgba(255, 255, 255, 0.5);
  border-radius: 20px;
}

.neumorphic:active {
  box-shadow:
    inset 6px 6px 10px rgba(163, 177, 198, 0.6),
    inset -6px -6px 10px rgba(255, 255, 255, 0.5);
}
```

#### Dark Mode

```css
:root {
  --bg-primary: hsl(0, 0%, 100%);
  --text-primary: hsl(0, 0%, 10%);
}

[data-theme="dark"] {
  --bg-primary: hsl(220, 13%, 12%);
  --text-primary: hsl(0, 0%, 95%);
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 0.3s ease, color 0.3s ease;
}
```

---

## 🛠️ Technology Stack

### Core Technologies

```
✅ 推奨:
- HTML5（セマンティック要素）
- JavaScript（ロジック）
- Vanilla CSS（最大限の柔軟性）

❌ 避ける:
- TailwindCSS（明示的な要求がない限り）
```

### Framework Selection

```
Simple Web App:
→ HTML + CSS + Vanilla JS

Complex Web App（ユーザーが明示的に要求した場合）:
→ Next.js または Vite
```

### New Project Creation

```bash
# npx -y を使用して自動インストール
npx -y create-vite-app@latest ./

# 必須: 最初に --help フラグで全オプションを確認
npx -y create-next-app@latest --help

# 非インタラクティブモードで実行
# ユーザー入力不要
```

### Running Locally

```bash
# 開発サーバー使用
npm run dev

# 本番ビルドは明示的に要求された場合のみ
npm run build
```

---

## 📐 Implementation Workflow

### Step 1: Plan and Understand

```
✅ 実行すること:
1. ユーザー要件を完全に理解
2. モダンで美しいWebデザインからインスピレーション
3. 初期バージョンに必要な機能を概説
```

### Step 2: Build the Foundation

```
✅ 実行すること:
1. index.css を作成/修正
2. すべてのトークンとユーティリティを含むコアデザインシステムを実装
```

**例: index.css**

```css
/* Design Tokens */
:root {
  /* Colors */
  --color-primary: hsl(220, 90%, 56%);
  --color-secondary: hsl(250, 90%, 66%);
  --color-accent: hsl(340, 82%, 52%);

  --color-bg-primary: hsl(0, 0%, 100%);
  --color-bg-secondary: hsl(220, 13%, 96%);
  --color-text-primary: hsl(220, 13%, 18%);
  --color-text-secondary: hsl(220, 9%, 46%);

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;

  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: 1.6;
}

/* Utility Classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.button {
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Step 3: Create Components

```
✅ 実行すること:
1. デザインシステムを使用してコンポーネント構築
2. 事前定義されたスタイルを使用（ad-hocユーティリティは使わない）
3. コンポーネントを集中的で再利用可能に保つ
```

### Step 4: Assemble Pages

```
✅ 実行すること:
1. デザインとコンポーネントを組み込んでメインアプリケーションを更新
2. 適切なルーティングとナビゲーションを確保
3. レスポンシブレイアウトを実装
```

### Step 5: Polish and Optimize

```
✅ 実行すること:
1. 全体的なユーザーエクスペリエンスをレビュー
2. スムーズなインタラクションとトランジションを確保
3. 必要に応じてパフォーマンスを最適化
```

---

## 🔍 SEO Best Practices

**すべてのページに自動的に実装**:

### Title Tags

```html
<title>AntiGravity IDE - AI-Powered Development Environment</title>
```

### Meta Descriptions

```html
<meta name="description" content="AntiGravity IDE is a powerful AI-driven integrated development environment with agent-first architecture.">
```

### Heading Structure

```html
<!-- 1ページに1つの h1 -->
<h1>Welcome to AntiGravity IDE</h1>

<!-- 適切な見出し階層 -->
<h2>Features</h2>
<h3>Mission Control</h3>
<h3>Browser Sub-Agent</h3>

<h2>Get Started</h2>
<h3>Installation</h3>
<h3>Configuration</h3>
```

### Semantic HTML

```html
✅ Good:
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <section>
      <h2>Content</h2>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2025 AntiGravity</p>
</footer>

❌ Bad:
<div class="header">
  <div class="nav">
    ...
  </div>
</div>
```

### Unique IDs

```html
<!-- ブラウザテスト用にすべてのインタラクティブ要素に一意のIDを付与 -->
<button id="login-button">Login</button>
<input id="username-input" type="text">
<form id="registration-form">
```

### Performance

```
✅ 実行すること:
- 画像の最適化
- CSSの最小化
- JavaScriptの遅延ロード
- CDN使用
- キャッシング戦略
```

---

## 🚫 プレースホルダーの禁止

```
❌ Bad:
<img src="placeholder.png" alt="Image">

✅ Good:
generate_image ツールを使用して実際の画像を生成
```

**理由**: 動作するデモンストレーションを提供するため

---

## ✅ チェックリスト

### Design Aesthetics
- [ ] 鮮やかな色彩を使用
- [ ] Google Fonts を使用
- [ ] グラデーションを追加
- [ ] マイクロアニメーションを実装
- [ ] ダークモードをサポート
- [ ] グラスモーフィズム効果を使用

### Implementation
- [ ] index.css でデザインシステムを作成
- [ ] デザイントークンを定義
- [ ] 再利用可能なコンポーネントを構築
- [ ] レスポンシブデザインを実装

### SEO
- [ ] Title tags を追加
- [ ] Meta descriptions を追加
- [ ] 適切な見出し階層（h1, h2, h3）
- [ ] セマンティックHTML要素を使用
- [ ] すべてのインタラクティブ要素に一意のIDを付与

### Quality
- [ ] ホバーエフェクトが機能する
- [ ] アニメーションがスムーズ
- [ ] ページロードが高速
- [ ] プレースホルダー画像がない
- [ ] **デザインがプレミアムに見える**

---

## 🔗 関連ルール

- [antigravity-mode-system.md](./antigravity-mode-system.md) - モードシステム
- [antigravity-artifacts.md](./antigravity-artifacts.md) - Artifactsシステム
- [code-style-guide.md](./code-style-guide.md) - コーディング規約

---

**出典**: Google DeepMind Antigravity 公式システムプロンプト

**CRITICAL REMINDER**: AESTHETICS ARE VERY IMPORTANT. シンプルで基本的なWebアプリを作ったら、それは失敗です！
