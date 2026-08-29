import React from 'react';
import { Users, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, UserPlus } from 'lucide-react';
import { getCapabilityGapAndTeam } from '../services/janSetuV2Service';

export default function CapabilityGapCard({ challenge }) {
  const cap = getCapabilityGapAndTeam(challenge);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── 1. CAPABILITY GAP ANALYSIS ─────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderLeft: '4px solid #f59e0b',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <AlertCircle size={18} color="#f59e0b" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Multidisciplinary Capability Gap Analysis
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          {cap.requiredCapabilities.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '6px 10px', background: item.present ? '#f0fdf4' : '#fff1f2', borderRadius: '4px', borderLeft: item.present ? '3px solid var(--success)' : '3px solid var(--danger)' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
              <span style={{ fontSize: '0.74rem', color: item.present ? '#166534' : '#9f1239', fontWeight: 700 }}>
                {item.present ? `✓ ${item.provider}` : '✕ MISSING (Capability Gap)'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: '#fffbe8', border: '1px solid #fef08a', padding: '10px 12px', borderRadius: '4px', fontSize: '0.8rem' }}>
          <strong style={{ color: '#854d0e' }}>Bridge Partner Recommendations:</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            {cap.recommendedBridgePartners.map((bp, idx) => (
              <div key={idx} style={{ color: '#713f12' }}>
                🤝 <strong>{bp.type} ({bp.name}):</strong> {bp.help}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. TEAM INTELLIGENCE RECOMMENDATIONS ───────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderTop: '3px solid var(--primary)',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--primary)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              AI Recommended Best-Fit Team Composition
            </h4>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>
            {cap.overallReadiness}% Team Readiness
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {cap.recommendedTeam.map((mem, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '8px 10px', background: 'var(--bg-primary)', borderRadius: '4px' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>{mem.name}</strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>({mem.branch} · {mem.role})</span>
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--success)' }}>
                {mem.readiness} Fit
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
