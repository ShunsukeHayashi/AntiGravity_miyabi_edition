'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search } from 'lucide-react';
import styles from '../../app/layout.module.css';

export const BrowserView: React.FC = () => {
  const [url, setUrl] = useState('https://example.com');
  const [isAgentActive, setIsAgentActive] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white' }}>
      {/* Browser Toolbar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px', 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f5f5f5',
        color: '#333'
      }}>
        <ArrowLeft size={16} style={{ marginRight: '10px', cursor: 'pointer' }} />
        <ArrowRight size={16} style={{ marginRight: '10px', cursor: 'pointer' }} />
        <RotateCw size={16} style={{ marginRight: '10px', cursor: 'pointer' }} />
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'white', 
          border: '1px solid #ccc', 
          borderRadius: '15px', 
          padding: '4px 12px',
          fontSize: '13px'
        }}>
          <Search size={12} style={{ marginRight: '8px', color: '#999' }} />
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%' }}
          />
        </div>
      </div>

      {/* Browser Content Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <iframe 
          src="about:blank" 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          title="Browser Content"
        />
        
        {/* Mock Content for demo since iframe is blank */}
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <h2 style={{ color: '#ccc' }}>Web Page Content</h2>
        </div>

        {/* Subagent Overlay */}
        {isAgentActive && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '4px solid #007acc',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#007acc',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              maxWidth: '300px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Browser Subagent</div>
              <div style={{ fontSize: '12px' }}>Reading page content...</div>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div style={{ padding: '10px', borderTop: '1px solid #ccc', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => setIsAgentActive(!isAgentActive)}
          style={{
            padding: '6px 12px',
            backgroundColor: isAgentActive ? '#d9534f' : '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isAgentActive ? 'Stop Agent' : 'Start Subagent'}
        </button>
      </div>
    </div>
  );
};
