import React from 'react';
import { Files, Search, GitGraph, Bot, Box, Globe } from 'lucide-react';
import styles from '../../app/layout.module.css';

interface ActivityBarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, onViewChange }) => {
  return (
    <div className={styles.activityBar}>
      <div 
        className={`${styles.iconButton} ${activeView === 'explorer' ? styles.active : ''}`}
        onClick={() => onViewChange('explorer')}
        title="エクスプローラー"
      >
        <Files size={24} />
      </div>
      <div 
        className={`${styles.iconButton} ${activeView === 'search' ? styles.active : ''}`}
        onClick={() => onViewChange('search')}
        title="検索"
      >
        <Search size={24} />
      </div>
      <div 
        className={`${styles.iconButton} ${activeView === 'source-control' ? styles.active : ''}`}
        onClick={() => onViewChange('source-control')}
        title="ソース管理"
      >
        <GitGraph size={24} />
      </div>
      <div 
        className={`${styles.iconButton} ${activeView === 'agent' ? styles.active : ''}`}
        onClick={() => onViewChange('agent')}
        title="エージェント"
      >
        <Bot size={24} />
      </div>
      <div 
        className={`${styles.iconButton} ${activeView === 'extensions' ? styles.active : ''}`}
        onClick={() => onViewChange('extensions')}
        title="拡張機能"
      >
        <Box size={24} />
      </div>
      <div 
        className={`${styles.iconButton} ${activeView === 'browser' ? styles.active : ''}`}
        onClick={() => onViewChange('browser')}
        title="ブラウザ"
      >
        <Globe size={24} />
      </div>
    </div>
  );
};
