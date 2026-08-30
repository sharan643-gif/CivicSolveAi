import React, { useState } from 'react';
import { X, Sparkles, Send, Brain, ArrowRight, BarChart2, CheckCircle2 } from 'lucide-react';
import { geminiService } from '../services/geminiClientService';

export default function AskCivicAnalyticsModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const sampleQueries = [
    'Which ward has the highest unresolved road complaints?',
    'Which department has the worst SLA performance this month?',
    'Show me recurring complaints in Zone 2',
    'Which locations require preventive inspection?'
  ];

  const handleSearch = async (textToSearch) => {
    const q = textToSearch || query;
    if (!q.trim()) return;
    setIsAnalyzing(true);
    try {
      const data = await geminiService.queryCivicAnalytics(q);
      setResult(data);
    } catch (e) {
      console.warn('Analytics error:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}
    >
      <div
        className="glass-card fade-in"
        style={{
          width: '100%', maxWidth: '600px', background: '#ffffff',
          borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(0, 48, 135, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Brain size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Ask Civic AI — Municipal Intelligence
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Query civic telemetry, department delays, and systemic hotspots in natural language.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="e.g. Which ward has the highest unresolved potholes?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
              fontSize: '0.86rem', outline: 'none', background: '#f8fafc'
            }}
          />
          <button
            onClick={() => handleSearch()}
            disabled={isAnalyzing || !query.trim()}
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.84rem' }}
          >
            <Sparkles size={15} className={isAnalyzing ? 'spin-slow' : ''} />
            <span>Analyze</span>
          </button>
        </div>

        {/* Quick Suggestions */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(sq);
                handleSearch(sq);
              }}
              style={{
                padding: '4px 10px', borderRadius: '100px', border: '1px solid var(--border-subtle)',
                background: '#ffffff', color: 'var(--text-secondary)', fontSize: '0.72rem', cursor: 'pointer'
              }}
            >
              🔍 {sq}
            </button>
          ))}
        </div>

        {/* Results Card */}
        {result && (
          <div
            className="fade-in"
            style={{
              padding: '16px', borderRadius: '12px', background: '#f8fafc',
              border: '1px solid rgba(0, 48, 135, 0.15)', display: 'flex', flexDirection: 'column', gap: '10px'
            }}
          >
            <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--primary)' }}>
              💡 {result.headline}
            </div>

            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {result.key_findings.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <div style={{ background: '#f0fdf4', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.78rem', color: '#065f46' }}>
              <strong>Recommended Municipal Action:</strong> {result.recommended_administrative_action}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
