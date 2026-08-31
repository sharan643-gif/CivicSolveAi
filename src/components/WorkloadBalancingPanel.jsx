import React, { useState } from 'react';
import { Users, Scale, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { civicIntelligenceEngine } from '../services/civicIntelligenceEngine';

export default function WorkloadBalancingPanel() {
  const [officers, setOfficers] = useState(() => civicIntelligenceEngine.getOfficerWorkloads());
  const [rebalanced, setRebalanced] = useState(false);

  const handleRebalance = () => {
    const updated = civicIntelligenceEngine.rebalanceWorkloads();
    setOfficers([...updated]);
    setRebalanced(true);
    setTimeout(() => setRebalanced(false), 3000);
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.78rem' }}>
            <Scale size={15} />
            <span>AI Smart Workload Balancing & Queue Optimization</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Field Officer Workload Distribution
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Prevents SLA breaches by dynamically leveling active queue tasks across nearby specialist officers.
          </p>
        </div>

        <button
          onClick={handleRebalance}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--primary), #0284c7)',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(27,42,74, 0.2)'
          }}
        >
          <RefreshCw size={14} className={rebalanced ? 'spin-slow' : ''} />
          <span>{rebalanced ? 'Workload Rebalanced! ✓' : 'Auto-Balance Workload'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {officers.map(off => {
          const isOverloaded = off.activeTasks >= 7;
          return (
            <div
              key={off.id}
              style={{
                padding: '14px',
                borderRadius: '10px',
                background: isOverloaded ? '#fff1f2' : '#f8fafc',
                border: isOverloaded ? '1px solid #fecaca' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{off.avatar}</span>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {off.name}
                    </h4>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{off.zone}</span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    background: isOverloaded ? '#fee2e2' : '#f0fdf4',
                    color: isOverloaded ? '#dc2626' : '#059669'
                  }}
                >
                  {isOverloaded ? 'Overloaded' : 'Normal Load'}
                </span>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Spec: <strong>{off.specialization}</strong>
              </div>

              {/* Task Meter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  <span>Active Tasks: <strong>{off.activeTasks}</strong></span>
                  <span>SLA: <strong>{off.slaRate}%</strong></span>
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (off.activeTasks / 10) * 100)}%`,
                      background: isOverloaded ? '#dc2626' : 'var(--primary)',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
