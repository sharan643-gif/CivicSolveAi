import React, { useState } from 'react';
import { Cpu, CheckCircle2, XCircle, Plus, Edit2, AlertCircle } from 'lucide-react';

export default function RootCauseAnalysis({ challenge, isExpert = false }) {
  const [causes, setCauses] = useState([
    { id: 1, text: 'Severe soil erosion due to monsoon overflow lacking side culverts', confidence: 94, status: 'confirmed', votes: 18 },
    { id: 2, text: 'Inadequate gravel compaction during sub-base road construction', confidence: 88, status: 'confirmed', votes: 12 },
    { id: 3, text: 'Illegal heavy mineral transport trucks bypassing load checkpoints', confidence: 76, status: 'review', votes: 7 },
    { id: 4, text: 'Blocked agricultural drainage channels causing water accumulation', confidence: 69, status: 'review', votes: 4 }
  ]);

  const [newCause, setNewCause] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleConfirm = (id) => {
    setCauses(causes.map(c => c.id === id ? { ...c, status: 'confirmed', votes: c.votes + 1 } : c));
  };

  const handleReject = (id) => {
    setCauses(causes.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
  };

  const handleAddCause = (e) => {
    e.preventDefault();
    if (!newCause.trim()) return;
    setCauses([...causes, { id: Date.now(), text: newCause, confidence: 80, status: 'confirmed', votes: 1 }]);
    setNewCause('');
    setIsAdding(false);
  };

  return (
    <div className="glass-l2" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="#8b5cf6" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>AI & Expert Root Cause Analysis</h4>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#a78bfa', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '100px', padding: '2px 10px' }}>
          ✨ AI Identified + Verified
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {causes.filter(c => c.status !== 'rejected').map((cause) => (
          <div key={cause.id} style={{ background: 'var(--bg-elevated)', border: `1px solid ${cause.status === 'confirmed' ? 'rgba(16,185,129,0.2)' : 'var(--border-subtle)'}`, borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: '#fff', lineHeight: 1.4 }}>{cause.text}</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>AI Confidence: <strong style={{ color: cause.confidence > 85 ? '#10b981' : '#f59e0b' }}>{cause.confidence}%</strong></span>
                <span>·</span>
                <span>{cause.votes} Expert Confirmations</span>
                {cause.status === 'confirmed' && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Verified</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => handleConfirm(cause.id)} title="Confirm Cause" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <CheckCircle2 size={14} />
              </button>
              <button onClick={() => handleReject(cause.id)} title="Reject Cause" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <XCircle size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <form onSubmit={handleAddCause} style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value={newCause} onChange={e => setNewCause(e.target.value)} className="form-input" placeholder="Add an additional expert root cause..." style={{ flex: 1 }} required />
          <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>Add</button>
          <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>Cancel</button>
        </form>
      ) : (
        <button onClick={() => setIsAdding(true)} style={{ background: 'transparent', border: '1px dashed var(--border-subtle)', borderRadius: '8px', padding: '10px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Plus size={14} /> Add Verified Root Cause (Experts & Gov Officers)
        </button>
      )}
    </div>
  );
}
