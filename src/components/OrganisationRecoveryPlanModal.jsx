import React from 'react';
import { X, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight, Activity } from 'lucide-react';
import { civicIntelligenceEngine } from '../services/civicIntelligenceEngine';

export default function OrganisationRecoveryPlanModal({ deptId = 'water_board', onClose }) {
  const plan = civicIntelligenceEngine.generateRecoveryPlan(deptId);

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}
    >
      <div
        className="glass-card fade-in"
        style={{
          width: '100%', maxWidth: '580px', background: '#ffffff',
          borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', gap: '16px', border: '2px solid #f59e0b'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 800, fontSize: '0.74rem' }}>
              <TrendingUp size={14} />
              <span>AI Performance Recovery Mode Engine</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0' }}>
              {plan.deptName} — Recovery Plan
            </h3>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        {/* Score Target Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffbeb', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fef3c7' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700 }}>CURRENT SCORE</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#dc2626' }}>{plan.currentScore}/100</div>
          </div>
          <ArrowRight size={20} color="#b45309" />
          <div>
            <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700 }}>TARGET 14-DAY GOAL</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#059669' }}>{plan.targetScore}/100</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 700 }}>RECOVERY WINDOW</span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{plan.recoveryPeriodDays} Days</div>
          </div>
        </div>

        {/* Identified Bottlenecks */}
        <div>
          <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            AI-Identified Root Bottlenecks:
          </h4>
          <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.78rem', color: '#991b1b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {plan.bottlenecksIdentified.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>

        {/* Action Plan */}
        <div>
          <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Step-by-Step Municipal Recovery Protocol:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {plan.aiActionPlan.map((p, i) => (
              <div key={i} style={{ padding: '8px 12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
                <strong style={{ color: 'var(--primary)' }}>{p.phase}:</strong> {p.action}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
            {plan.expectedImpact}
          </span>
          <button
            onClick={() => {
              alert('Recovery plan activated and task priority escalated to zone field supervisors!');
              onClose();
            }}
            style={{
              padding: '8px 18px', borderRadius: '6px', border: 'none',
              background: 'linear-gradient(135deg, #d97706, #b45309)', color: '#fff',
              fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
            }}
          >
            Activate Recovery Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
