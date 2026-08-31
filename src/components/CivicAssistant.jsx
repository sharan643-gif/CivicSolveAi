import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Trash2 } from 'lucide-react';
import { geminiService } from '../services/geminiClientService';

export default function CivicAssistant({ challenges = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your JanSetu AI Assistant powered by Google Gemini. Ask me how to report potholes, water supply, road accessibility, or track civic solutions across Jharkhand.',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messageEndRef = useRef(null);

  const suggestedQuestions = [
    "How do I report a pothole near my house?",
    "Which department handles garbage complaints?",
    "Help me write a civic complaint.",
    "Explain my complaint status."
  ];

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const handleSend = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text, text, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setHasError(false);

    try {
      const payload = updatedMessages.map(m => ({ role: m.role, content: m.content || m.text }));
      const response = await geminiService.generateCivicResponse(payload);
      
      if (response && response.includes('temporarily unavailable')) {
        setHasError(true);
      }

      const assistantMsg = { 
        role: 'assistant', 
        content: response, 
        text: response, 
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error('[CivicAssistant] Send error:', e);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: 'Conversation cleared. How can I assist you with JanSetu civic issues today?',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setHasError(false);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div style={{ position: 'fixed', bottom: isMobile ? '88px' : '24px', right: isMobile ? '14px' : '24px', zIndex: 980, fontFamily: 'var(--font-body)' }}>
      {/* Floating Action Launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open JanSetu AI Assistant"
          style={{
            height: '42px',
            padding: '0 16px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
            border: '2px solid var(--accent)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.82rem',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 16px rgba(27,42,74, 0.3)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
            fontFamily: 'inherit',
          }}
        >
          <Bot size={18} color="var(--accent)" />
          <span>JanSetu Assistant</span>
        </button>
      )}

      {/* Chat Window Panel — High Contrast Government Portal Theme */}
      {isOpen && (
        <div
          style={{
            width: isMobile ? 'calc(100vw - 28px)' : '380px',
            height: isMobile ? '72vh' : '520px',
            maxHeight: isMobile ? '72vh' : '520px',
            background: '#ffffff',
            border: '1px solid var(--border-medium)',
            borderRadius: isMobile ? '16px' : '12px',
            boxShadow: '0 12px 36px rgba(27,42,74, 0.25)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'scaleIn 0.2s ease forwards',
            position: 'relative',
            right: isMobile ? 0 : 'auto',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'var(--primary)',
            borderBottom: '3px solid var(--accent)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'var(--accent)',
                width: '34px', height: '34px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}>
                <Bot size={18} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                  JanSetu AI Assistant
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }}></span>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Gemini Powered Telemetry</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleClearChat}
                title="Clear Conversation"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: '#ffffff',
                  padding: '5px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s ease',
                }}
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: '#ffffff',
                  padding: '5px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s ease',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
            {messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                    maxWidth: '88%',
                  }}
                >
                  <div
                    style={{
                      background: isAssistant ? '#ffffff' : 'var(--primary)',
                      border: isAssistant ? '1px solid #cbd5e1' : 'none',
                      borderRadius: isAssistant ? '10px 10px 10px 2px' : '10px 10px 2px 10px',
                      padding: '10px 14px',
                      fontSize: '0.84rem',
                      lineHeight: '1.45',
                      color: isAssistant ? '#0f172a' : '#ffffff',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '3px', alignSelf: isAssistant ? 'flex-start' : 'flex-end', fontWeight: 500 }}>
                    {msg.date}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', gap: '6px', alignSelf: 'flex-start', padding: '10px 14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px 10px 10px 2px' }}>
                <span className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%' }}></span>
                <span className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%', animationDelay: '0.15s' }}></span>
                <span className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%', animationDelay: '0.3s' }}></span>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && !loading && (
            <div style={{ padding: '8px 16px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px', fontWeight: 700 }}>
                Suggested Inquiries
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      textAlign: 'left',
                      fontSize: '0.78rem',
                      color: '#1e293b',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      lineHeight: 1.4,
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.color = 'var(--primary)';
                      e.currentTarget.style.background = '#e8eef8';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.color = '#1e293b';
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <form
            onSubmit={e => { e.preventDefault(); handleSend(input); }}
            style={{
              padding: '12px 16px',
              background: '#ffffff',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex', gap: '8px',
            }}
          >
            <input
              type="text"
              placeholder="Ask JanSetu AI..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              style={{
                flexGrow: 1,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                color: '#0f172a',
                padding: '10px 12px',
                fontSize: '0.84rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 2px rgba(27,42,74, 0.15)';
              }}
              onBlur={e => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
