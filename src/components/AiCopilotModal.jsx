import React, { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, Edit3, ShieldAlert, Cpu, Layers } from 'lucide-react';
import { CATEGORIES } from '../services/mockData';

export default function AiCopilotModal({ isOpen, onClose, rawInput, onAccept }) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Default AI generated output state derived or mocked from raw user input
  const [structured, setStructured] = useState(() => ({
    title: rawInput ? (rawInput.length > 50 ? rawInput.slice(0, 48) + '...' : rawInput) : 'Monsoon Rural Road Accessibility',
    category: 'Infrastructure',
    subcategory: 'Rural Transportation',
    summary: rawInput || 'Village connectivity pathways suffer severe erosion during seasonal rainfall, preventing access to emergency healthcare, schools, and markets.',
    causes: [
      'Heavy seasonal rainfall with inadequate drainage slopes',
      'High clay content soil subject to severe liquefaction and mud slip',
      'Absence of paved culverts or reinforced embankment retaining walls'
    ],
    severity: 'High',
    priority_score: 91,
    affected_population: 1800,
    suggested_technologies: ['GIS Mapping', 'Weather Predictive Analytics', 'Soil Stabilization Sensors', 'IoT Road Moisture Monitors'],
    skills_required: ['Civil Engineering', 'GIS Analysis', 'Python', 'IoT Embedded Systems', 'Data Science']
  }));

  if (!isOpen) return null;

  const handleRegenerate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setStructured(prev => ({
      ...prev,
      priority_score: Math.floor(88 + Math.random() * 8),
      summary: `AI Structured Analysis: ${prev.summary}`,
    }));
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="fade-in" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', background: 'var(--bg-surface)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 80px rgba(0,0,0,0.7)' }}>

        {/* Modal Header */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.1))', padding: '20px 28px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
                Civic AI Challenge Copilot
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Automated Problem Structuring & Priority Assessment</p>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '100px', padding: '4px 10px', color: '#a78bfa', fontWeight: 600 }}>
            ✨ AI-Generated Analysis
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', border: '3px solid var(--border-subtle)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Analyzing raw problem input with Gemini Engine...</p>
            </div>
          ) : (
            <>
              {/* Raw User Input Notice */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: '#fff', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Original Input:</strong>
                "{rawInput || 'Our village road gets damaged every monsoon and ambulances cannot reach the village.'}"
              </div>

              {/* Title & Priority Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '16px', alignItems: 'start' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Structured Title</label>
                  {isEditing ? (
                    <input type="text" value={structured.title} onChange={e => setStructured({ ...structured, title: e.target.value })} className="form-input" style={{ marginTop: '4px' }} />
                  ) : (
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{structured.title}</h4>
                  )}
                </div>

                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.68rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 700 }}>Priority Score</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-display)' }}>{structured.priority_score}/100</div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Severity: {structured.severity}</span>
                </div>
              </div>

              {/* Category & Subcategory */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</label>
                  {isEditing ? (
                    <select value={structured.category} onChange={e => setStructured({ ...structured, category: e.target.value })} className="form-select" style={{ marginTop: '4px' }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, marginTop: '4px' }}>{structured.category}</div>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subcategory</label>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{structured.subcategory}</div>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Affected Population</label>
                  <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>~{structured.affected_population.toLocaleString()} residents</div>
                </div>
              </div>

              {/* Problem Summary */}
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI Executive Summary</label>
                {isEditing ? (
                  <textarea value={structured.summary} onChange={e => setStructured({ ...structured, summary: e.target.value })} className="form-input" rows={3} style={{ marginTop: '4px' }} />
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '12px', borderRadius: '8px', marginTop: '4px', lineHeight: 1.5 }}>
                    {structured.summary}
                  </p>
                )}
              </div>

              {/* Potential Root Causes */}
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Potential Root Causes Identified</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {structured.causes.map((cause, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                      <span style={{ color: '#8b5cf6', fontWeight: 700 }}>•</span>
                      {cause}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies & Skills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Suggested Technologies</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {structured.suggested_technologies.map(t => (
                      <span key={t} style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa', padding: '3px 8px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Required Skills</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {structured.skills_required.map(s => (
                      <span key={s} style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', padding: '3px 8px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 28px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleRegenerate} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Regenerate
            </button>
            <button onClick={() => setIsEditing(!isEditing)} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
              <Edit3 size={14} /> {isEditing ? 'Done Editing' : 'Edit AI Result'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>Cancel</button>
            <button onClick={() => { onAccept(structured); onClose(); }} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> Accept Analysis & Submit
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
