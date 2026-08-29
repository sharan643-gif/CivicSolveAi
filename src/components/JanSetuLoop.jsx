import React from 'react';
import { Radio, Brain, Network, Cpu, ShieldCheck, BarChart3, RotateCcw } from 'lucide-react';

export default function JanSetuLoop({ activeStage = 'UNDERSTAND' }) {
  const stages = [
    { id: 'SIGNAL', label: 'SIGNAL', icon: Radio, desc: 'Citizen Reports' },
    { id: 'UNDERSTAND', label: 'UNDERSTAND', icon: Brain, desc: 'AI & DNA' },
    { id: 'CONNECT', label: 'CONNECT', icon: Network, desc: 'Govt & Uni Match' },
    { id: 'BUILD', label: 'BUILD', icon: Cpu, desc: 'Team & Prototype' },
    { id: 'VALIDATE', label: 'VALIDATE', icon: ShieldCheck, desc: 'Field & Community' },
    { id: 'MEASURE', label: 'MEASURE', icon: BarChart3, desc: 'Impact Verified' },
    { id: 'REUSE', label: 'REUSE', icon: RotateCcw, desc: 'Solution Scaling' },
  ];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border-subtle)',
      borderTop: '3px solid var(--primary)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '12px', flexWrap: 'wrap', gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>
            The JanSetu Loop
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            · Living Civic Operating Cycle
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
          Active Stage: {activeStage}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: '8px',
        alignItems: 'center',
      }}>
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isActive = st.id === activeStage;
          return (
            <div
              key={st.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '10px 8px',
                borderRadius: '6px',
                background: isActive ? 'var(--primary)' : '#f8f9fa',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-subtle)'}`,
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              <Icon size={16} color={isActive ? '#ffffff' : 'var(--primary)'} style={{ marginBottom: '4px' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                {st.label}
              </span>
              <span style={{ fontSize: '0.62rem', color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)', marginTop: '2px' }}>
                {st.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
