import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, Database, ShieldCheck } from 'lucide-react';
import { askJanSetu } from '../services/janSetuV2Service';

export default function AskJanSetuModal({ isOpen, onClose, userRole = 'citizen' }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! I am Ask JanSetu, your civic operating system intelligence assistant. Ask me anything about problems, university capabilities, solutions, emerging risks, or scale opportunities.`,
      sources: ['JanSetu Knowledge Base'],
      confidence: '100%'
    }
  ]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    const botResponse = askJanSetu(query, userRole);
    const botMsg = {
      sender: 'bot',
      text: botResponse.answer,
      sources: botResponse.sources,
      confidence: botResponse.confidence
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setQuery('');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#ffffff', width: '100%', maxWidth: '600px',
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column',
        maxHeight: '80vh', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px', background: 'var(--primary)', color: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={20} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Ask JanSetu AI</h3>
            <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
              Role: {userRole}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.sender === 'user' ? 'var(--primary)' : '#f1f5f9',
                color: m.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                padding: '10px 14px', borderRadius: '8px', fontSize: '0.86rem', lineHeight: 1.5
              }}
            >
              {m.text}
              {m.sources && (
                <div style={{ fontSize: '0.68rem', marginTop: '6px', color: m.sender === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                  <span>📚 {m.sources.join(', ')}</span>
                  <span>✓ {m.confidence} Confidence</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Which water problems are critical in Ranchi?"
            style={{
              flex: 1, border: '1px solid var(--border-medium)', borderRadius: '4px',
              padding: '10px 12px', fontSize: '0.86rem', fontFamily: 'inherit'
            }}
          />
          <button
            type="submit"
            style={{
              background: 'var(--primary)', color: '#ffffff', border: 'none',
              borderRadius: '4px', padding: '0 16px', cursor: 'pointer'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
