import React, { useState } from 'react';
import { Flag, AlertTriangle, ShieldCheck, CheckCircle2, UserX, Eye } from 'lucide-react';
import { db } from '../services/mockData';

export default function TrustSafetyPanel() {
  const [flags, setFlags] = useState([
    { id: 'flag-1', type: 'AI Evidence Check', title: 'Potential Duplicate Image Detected', details: 'Uploaded image matches 98% with an earlier submission in Dhanbad.', reporter: 'AI Guard Engine', status: 'Pending Review', severity: 'medium' },
    { id: 'flag-2', type: 'Suspicious Voting', title: 'Rapid Support Spike', details: '45 votes registered within 60 seconds from same IP subnet.', reporter: 'Spam Prevention Sentinel', status: 'Pending Review', severity: 'high' }
  ]);

  const handleResolve = (id) => {
    setFlags(flags.map(f => f.id === id ? { ...f, status: 'Resolved' } : f));
  };

  return (
    <div className="glass-l2" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flag size={18} color="#ef4444" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Trust & Safety Verification Center</h4>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>
          {flags.filter(f => f.status === 'Pending Review').length} Pending Reviews
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {flags.map(f => (
          <div key={f.id} style={{ background: 'var(--bg-elevated)', border: `1px solid ${f.status === 'Resolved' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.68rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>{f.type}</span>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{f.title}</h5>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{f.details}</div>
            </div>

            {f.status === 'Pending Review' ? (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => handleResolve(f.id)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                  Dismiss / Mark Valid
                </button>
                <button onClick={() => { alert('Account warned and submission held.'); handleResolve(f.id); }} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
                  Flag & Warn User
                </button>
              </div>
            ) : (
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>✓ Resolved</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
