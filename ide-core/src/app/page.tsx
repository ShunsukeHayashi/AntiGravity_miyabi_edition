'use client';

import React, { useState } from 'react';
import styles from './layout.module.css';
import { ActivityBar } from '@/components/Layout/ActivityBar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { EditorArea } from '@/components/Layout/EditorArea';
import { StatusBar } from '@/components/Layout/StatusBar';
import { BrowserView } from '@/components/Browser/BrowserView';

export default function Home() {
  const [activeView, setActiveView] = useState('agent');

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <ActivityBar activeView={activeView} onViewChange={setActiveView} />
        <Sidebar activeView={activeView} />
        {activeView === 'browser' ? <BrowserView /> : <EditorArea />}
      </div>
      <StatusBar />
    </div>
  );
}
