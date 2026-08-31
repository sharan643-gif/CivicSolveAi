import React from 'react';
import { Sparkles, ShieldAlert, Clock, ArrowRight, Wrench, CheckCircle2 } from 'lucide-react';
import { civicIntelligenceEngine } from '../services/civicIntelligenceEngine';

export default function PredictiveMaintenanceCard({ onDispatchCrew }) {
  const alerts = civicIntelligenceEngine.getPredictiveAlerts();

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.04), rgba(27,42,74, 0.05))',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7c3aed', fontWeight: 800, fontSize: '0.78rem' }}>
            <Sparkles size={15} />
            <span>AI Predictive Civic Maintenance Engine</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Predictive Infrastructure Failure Warnings
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Shift from Reactive to Preventive Governance — AI detects breakdown patterns before citizen disruption occurs.
          </p>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            padding: '4px 12px',
            borderRadius: '100px',
            background: 'rgba(124, 58, 237, 0.12)',
            color: '#7c3aed',
            fontWeight: 800
          }}
        >
          ⚡ {alerts.length} Early Warnings Active
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '14px' }}>
        {alerts.map(a => (
          <div
            key={a.id}
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  fontWeight: 800,
                  background: a.probabilityOfFailure >= 90 ? '#fee2e2' : '#fef3c7',
                  color: a.probabilityOfFailure >= 90 ? '#dc2626' : '#b45309'
                }}
              >
                ⚠️ {a.probabilityOfFailure}% Risk of Failure
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {a.predictedFailureWindow}
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {a.asset}
              </h3>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{a.location}</div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0, background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
              <strong>AI Pattern Diagnostic:</strong> {a.aiRationale}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                💰 {a.estimatedSavings}
              </span>
              <button
                onClick={() => {
                  if (onDispatchCrew) onDispatchCrew(a);
                  alert(`Preventive maintenance work order dispatched for ${a.asset}!`);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: '#fff',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Wrench size={12} /> Dispatch Preventive Crew
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
