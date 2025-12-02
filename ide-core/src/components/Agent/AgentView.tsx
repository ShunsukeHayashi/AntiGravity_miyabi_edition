'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface AgentStatus {
  mode: string;
  taskName: string;
  taskStatus: string;
  taskSummary: string;
}

export const AgentView: React.FC = () => {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to Agent Service');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'task_boundary') {
          setStatus(data.data);
        }
      } catch (e) {
        console.error('Error parsing message', e);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    wsRef.current.send(JSON.stringify({
      type: 'user_request',
      content: input
    }));
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Status Header */}
      <div style={{ 
        padding: '10px', 
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: status?.mode === 'PLANNING' ? '#3a2e00' : 
                         status?.mode === 'EXECUTION' ? '#002e3a' : 'transparent'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
          {status?.taskName || 'Agent Offline'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {status?.taskStatus}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? '#0e639c' : '#2d2d2d',
            padding: '8px 12px',
            borderRadius: '4px',
            maxWidth: '85%',
            fontSize: '13px'
          }}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ padding: '10px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="エージェントに指示..."
            style={{
              flex: 1,
              backgroundColor: '#3c3c3c',
              border: '1px solid #3c3c3c',
              color: 'white',
              padding: '6px 8px',
              borderRadius: '2px',
              outline: 'none'
            }}
          />
          <button 
            onClick={sendMessage}
            style={{
              backgroundColor: '#0e639c',
              border: 'none',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
