import React from 'react';
import { GitBranch, AlertCircle, Check } from 'lucide-react';
import styles from '../../app/layout.module.css';

export const StatusBar: React.FC = () => {
  return (
    <div className={styles.statusBar}>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
        <GitBranch size={14} style={{ marginRight: '5px' }} />
        <span>main</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
        <AlertCircle size={14} style={{ marginRight: '5px' }} />
        <span>0</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
        <span style={{ marginRight: '10px' }}>Ln 1, Col 1</span>
        <span style={{ marginRight: '10px' }}>UTF-8</span>
        <span style={{ marginRight: '10px' }}>TypeScript React</span>
        <Check size={14} />
      </div>
    </div>
  );
};
