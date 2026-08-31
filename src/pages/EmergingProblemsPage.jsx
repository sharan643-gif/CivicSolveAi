import React from 'react';
import { AlertTriangle, TrendingUp, ShieldAlert, ChevronRight, Activity, Radar } from 'lucide-react';
import { EMERGING_PROBLEMS_LIST } from '../services/janSetuV2Service';

export default function EmergingProblemsPage({ onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)',
        color: '#ffffff', padding: '32px 24px', borderRadius: 'var(--radius-md)',
        borderBottom: '4px solid #f59e0b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Radar size={24} color="#f59e0b" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Emerging Problems Radar & Early Warning
          </h1>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', maxWidth: '600px', margin: 0 }}>
          Detecting rapidly rising, geographically spreading, and early-stage civic signals before they escalate into major regional crises.
        </p>
      </div>

      {/* Radar Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {EMERGING_PROBLEMS_LIST.map(item => (
          <div
            key={item.id}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderLeft: '4px solid #f59e0b',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex', flexDirection: 'column', gap: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  NEW EMERGING ISSUE · {item.category}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '6px 0 2px' }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  📍 District: {item.district} | Detected {item.detectedDaysAgo} days ago
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--danger)' }}>
                  {item.momentum} Momentum
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Confidence: {item.confidence}%
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', background: 'var(--bg-primary)', padding: '12px', borderRadius: '4px' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>VILLAGES SPREAD</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.villagesCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>REPORTS SURGE</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>{item.reportsCount}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>POTENTIAL ESCALATION</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--danger)' }}>{item.escalationRisk}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Signals & Early Warning Telemetry Detected:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {item.signals.map((sig, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={14} color="#f59e0b" />
                    <span>{sig}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => onNavigate('explore')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'var(--primary)', color: '#ffffff', border: 'none',
                  borderRadius: '4px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                Investigate Emerging Problem <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
