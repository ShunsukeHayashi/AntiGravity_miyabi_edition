import React from 'react';
import styles from '../../app/layout.module.css';
import { AgentView } from '../Agent/AgentView';

interface SidebarProps {
  activeView: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView }) => {
  const getTitle = () => {
    switch (activeView) {
      case 'explorer': return 'エクスプローラー';
      case 'search': return '検索';
      case 'source-control': return 'ソース管理';
      case 'agent': return 'エージェントマネージャー';
      case 'extensions': return '拡張機能';
      case 'browser': return 'ブラウザマネージャー';
      default: return '';
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        {getTitle()}
      </div>
      <div className={styles.sidebarContent} style={{ padding: activeView === 'agent' ? 0 : '10px', display: 'flex', flexDirection: 'column' }}>
        {activeView === 'agent' && <AgentView />}
        {activeView === 'explorer' && (
          <div>
            <p>ファイルツリー</p>
          </div>
        )}
      </div>
    </div>
  );
};
