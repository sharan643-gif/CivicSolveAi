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
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
        boxShadow: '0 25px 70px rgba(15, 23, 42, 0.45), 0 0 0 1px rgba(27,42,74,0.05)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '80vh', overflow: 'hidden', position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px',
          background: 'linear-gradient(135deg, #0f1729 0%, #1b2a4a 60%, #243b6a 100%)',
          color: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,134,10,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', background: 'rgba(200,134,10,0.15)', border: '1px solid rgba(200,134,10,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="#d4a843" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>Ask JanSetu AI</h3>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                Civic Intelligence Assistant
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', background: 'rgba(200,134,10,0.15)', color: '#d4a843', padding: '2px 10px', borderRadius: 'var(--radius-pill)', fontWeight: 700, border: '1px solid rgba(200,134,10,0.25)' }}>
              {userRole}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', color: '#ffffff', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <X size={16} />
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
                background: m.sender === 'user' ? 'linear-gradient(135deg, var(--primary), var(--primary-hover))' : 'var(--bg-primary)',
                color: m.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                padding: '10px 14px', borderRadius: m.sender === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: '0.86rem', lineHeight: 1.5,
                border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                boxShadow: m.sender === 'user' ? '0 2px 8px rgba(27,42,74,0.15)' : 'var(--shadow-xs)',
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
        <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', background: 'var(--bg-secondary)' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. Which water problems are critical in Ranchi?"
            style={{
              flex: 1, border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)',
              padding: '10px 14px', fontSize: '0.86rem', fontFamily: 'inherit',
              background: '#ffffff', color: 'var(--text-primary)',
              outline: 'none', transition: 'border-color 0.2s ease',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-medium)'}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, var(--accent), #a06d08)', color: '#ffffff', border: 'none',
              borderRadius: 'var(--radius-md)', padding: '0 16px', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(200,134,10,0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
