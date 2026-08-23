import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, MessageSquare, Bot, RefreshCw, Trash2 } from 'lucide-react';
import { groqService } from '../services/groqClientService';

export default function CivicAssistant({ challenges = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your CivicSolve AI Assistant powered by Groq. Ask me how to report potholes, garbage issues, water leaks, or help draft a formal civic complaint.', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
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
      // Map to server payload format
      const payload = updatedMessages.map(m => ({ role: m.role, content: m.content || m.text }));
      const response = await groqService.generateCivicResponse(payload);
      
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
      { role: 'assistant', text: 'Conversation cleared. How can I assist you with civic issues today?', date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setHasError(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 500, fontFamily: 'var(--font-body)' }}>
      {/* Floating Action Button — Glass */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-ai"
          style={{
            width: '56px', height: '56px',
            borderRadius: '50%',
            padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
          }}
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* Chat Window Panel — Glass */}
      {isOpen && (
        <div
          style={{
            width: '380px', height: '500px',
            background: 'rgba(14, 19, 32, 0.92)',
            backdropFilter: 'blur(40px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: '0 24px 64px -16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'scaleIn 0.25s cubic-bezier(0.22, 1.2, 0.36, 1) forwards',
            position: 'relative',
          }}
        >
          {/* Header — Glass with gradient */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.12))',
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--ai-purple), var(--primary))',
                width: '34px', height: '34px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              }}>
                <Bot size={18} color="white" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>CivicSolve AI Assistant</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }}></span>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>Powered by Groq</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={handleClearChat}
                title="Clear Conversation"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '5px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '5px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                >
                  <div
                    style={{
                      background: isAssistant ? 'rgba(255,255,255,0.04)' : 'var(--primary)',
                      border: isAssistant ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                      borderRadius: isAssistant ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      lineHeight: '1.45',
                      color: '#ffffff',
                      backdropFilter: isAssistant ? 'blur(8px)' : 'none',
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '3px', alignSelf: isAssistant ? 'flex-start' : 'flex-end' }}>
                    {msg.date}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', gap: '6px', alignSelf: 'flex-start', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px 14px 14px 4px' }}>
                <span className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%' }}></span>
                <span className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%', animationDelay: '0.15s' }}></span>
                <span className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%', animationDelay: '0.3s' }}></span>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && !loading && (
            <div style={{ padding: '0 16px 8px 16px' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Suggested Inquiries</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      textAlign: 'left',
                      fontSize: '0.76rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.background = 'rgba(139, 92, 246, 0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar — Glass */}
          <form
            onSubmit={e => { e.preventDefault(); handleSend(input); }}
            style={{
              padding: '12px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', gap: '8px',
            }}
          >
            <input
              type="text"
              placeholder="Ask Civic AI..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              style={{
                flexGrow: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                color: 'white',
                padding: '10px 14px',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                e.target.style.boxShadow = '0 0 0 2px rgba(139, 92, 246, 0.1)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !input.trim()}
              style={{ padding: '10px 14px', borderRadius: '10px' }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
