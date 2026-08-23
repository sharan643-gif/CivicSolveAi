import React from 'react';
import { Clock, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function SlaTracker() {

  const slaItems = [
    { title: 'Monsoon Rural Road Accessibility', dept: 'Rural Development Dept', validationTime: '14 hrs (SLA 24h)', status: 'ontime', deadline: '2 days left' },
    { title: 'Water Pipeline Leakage Detection', dept: 'Ranchi Urban Water Board', validationTime: '22 hrs (SLA 24h)', status: 'atrisk', deadline: '4 hrs left' },
    { title: 'Soil Nutrient Depletion', dept: 'Agriculture & Krishi Dept', validationTime: '48 hrs (SLA 24h)', status: 'overdue', deadline: 'Overdue by 24h' }
  ];

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="#3b82f6" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Government SLA & Service Target Tracking</h4>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: 24h Validation / 30d Resolution</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {slaItems.map((item, i) => (
          <div key={i} style={{ background: 'var(--bg-elevated)', border: `1px solid ${item.status === 'ontime' ? 'rgba(16,185,129,0.2)' : item.status === 'atrisk' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{item.title}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.dept} · Validation: {item.validationTime}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700,
                background: item.status === 'ontime' ? 'rgba(16,185,129,0.15)' : item.status === 'atrisk' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                color: item.status === 'ontime' ? '#10b981' : item.status === 'atrisk' ? '#f59e0b' : '#ef4444'
              }}>
                {item.status === 'ontime' ? '🟢 On Time' : item.status === 'atrisk' ? '🟠 At Risk' : '🔴 Overdue'}
              </span>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.deadline}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
