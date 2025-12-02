import React from 'react';
import styles from '../../app/layout.module.css';

export const EditorArea: React.FC = () => {
  return (
    <div className={styles.editorArea}>
      <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>
        <h1>Welcome to Antigravity IDE</h1>
        <p>エージェント主導の開発環境へようこそ。</p>
        <br />
        <p>ショートカット:</p>
        <ul>
          <li>Cmd+P: ファイルを開く</li>
          <li>Cmd+Shift+F: 全体検索</li>
        </ul>
      </div>
    </div>
  );
};
