import React, { useState } from 'react';
import { ShieldCheck, Lock, Play, AlertCircle, Cpu, CheckCircle2, XCircle } from 'lucide-react';
import { getDeploymentReadiness, simulateIntervention } from '../services/janSetuV2Service';

export default function DeploymentReadinessCard({ challenge, onSimulateClick }) {
  const readiness = getDeploymentReadiness(challenge);
  const [showSim, setShowSim] = useState(false);
  const sim = simulateIntervention(challenge?.id, 'iot');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── DEPLOYMENT READINESS CARD ──────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderTop: `3px solid ${readiness.overallScore >= 80 ? 'var(--success)' : 'var(--danger)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color={readiness.overallScore >= 80 ? 'var(--success)' : 'var(--danger)'} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Deployment Readiness Gate
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: readiness.overallScore >= 80 ? 'var(--success)' : 'var(--danger)' }}>
              {readiness.overallScore}/100
            </span>
            <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
              {readiness.status}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Functional deployment gates must all be satisfied before pilot launch:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
          {readiness.gates.map((g, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '8px 10px', background: 'var(--bg-primary)', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {g.passed ? <CheckCircle2 size={15} color="var(--success)" /> : <XCircle size={15} color="var(--danger)" />}
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</span>
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: g.passed ? 'var(--success)' : 'var(--danger)' }}>
                {g.score}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowSim(!showSim)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              background: 'var(--primary)', color: '#ffffff', border: 'none',
              borderRadius: '4px', padding: '10px', fontSize: '0.84rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <Play size={14} /> What If We Intervene? (Simulate Scenario)
          </button>
        </div>
      </div>

      {/* ── INTERVENTION SIMULATOR OVERLAY ─────────────────────────────── */}
      {showSim && (
        <div style={{
          background: '#f8fafc', border: '2px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '18px',
          animation: 'fadeIn 0.25s ease'
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
            📊 Intervention Scenario Simulator (Modelled Estimates)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '12px' }}>
            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>CURRENT STATE</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>5,000 Affected</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>60% Service Availability</div>
            </div>

            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '4px', border: '2px solid var(--primary)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>PROPOSED PILOT</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--success)', marginTop: '4px' }}>1,600 Affected (-68%)</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Est Cost: ₹3.5 Lakh (45 Days)</div>
            </div>

            <div style={{ background: '#ffffff', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.68rem', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase' }}>DISTRICT SCALE</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#8b5cf6', marginTop: '4px' }}>22,400 Served</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>25 Villages (+82% Efficiency)</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
