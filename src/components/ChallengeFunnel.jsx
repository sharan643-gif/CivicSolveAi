import React from 'react';
import { BarChart3, TrendingUp, Filter } from 'lucide-react';

export default function ChallengeFunnel() {
  const steps = [
    { label: '1. Reports Received', count: 10000, pct: 100, color: '#3b82f6' },
    { label: '2. AI & Gov Validated', count: 6200, pct: 62, color: '#06b6d4' },
    { label: '3. Challenge Published', count: 3800, pct: 38, color: '#10b981' },
    { label: '4. Teams Formed', count: 2100, pct: 21, color: '#f59e0b' },
    { label: '5. Solutions Built', count: 1400, pct: 14, color: '#8b5cf6' },
    { label: '6. Field Pilots Active', count: 760, pct: 7.6, color: '#ec4899' },
    { label: '7. Scaled & Implemented', count: 420, pct: 4.2, color: '#10b981' }
  ];

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
            National Challenge Conversion Funnel Analytics
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Problem-to-Implementation Funnel Throughput</p>
        </div>
        <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '100px', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
          Statewide Demo Metrics
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {steps.map(s => (
          <div key={s.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>{s.label}</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>{s.count.toLocaleString()} ({s.pct}%)</span>
            </div>
            <div style={{ height: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
