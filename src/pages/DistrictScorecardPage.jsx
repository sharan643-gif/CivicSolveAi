import React from 'react';
import { Award, BarChart3, Building, Users, ShieldCheck, HeartHandshake, TrendingUp } from 'lucide-react';
import { JANSETU_IMPACT_LEDGER, DISTRICT_SCORECARDS } from '../services/janSetuV2Service';

export default function DistrictScorecardPage({ onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #0f172a 100%)',
        color: '#ffffff', padding: '32px 24px', borderRadius: 'var(--radius-md)',
        borderBottom: '4px solid var(--accent)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Award size={24} color="var(--accent)" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            District Innovation Scorecard & Impact Ledger
          </h1>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', maxWidth: '640px', margin: 0 }}>
          Cumulative platform-wide impact telemetry and civic innovation health profiles across all 24 districts of Jharkhand.
        </p>
      </div>

      {/* ── JANSETU CUMULATIVE IMPACT LEDGER ───────────────────────────── */}
      <div style={{
        background: '#ffffff', border: '1px solid var(--border-subtle)',
        borderTop: '3px solid var(--primary)', borderRadius: 'var(--radius-md)',
        padding: '20px', boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
          JanSetu Cumulative Verified Impact Ledger
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>CITIZENS BENEFITED</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
              {JANSETU_IMPACT_LEDGER.citizensBenefited.toLocaleString()}+
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>ESTIMATED SAVINGS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', marginTop: '2px' }}>
              {JANSETU_IMPACT_LEDGER.estimatedSavings}
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>SOLUTIONS DEPLOYED</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8b5cf6', marginTop: '2px' }}>
              {JANSETU_IMPACT_LEDGER.solutionsDeployed.toLocaleString()}
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>DISTRICTS IMPACTED</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {JANSETU_IMPACT_LEDGER.districtsImpacted} / 24
            </div>
          </div>
        </div>
      </div>

      {/* ── DISTRICT INNOVATION SCORECARD TABLE ────────────────────────── */}
      <div style={{
        background: '#ffffff', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
          District Innovation Health Profiles
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>District</th>
                <th>Innovation Score</th>
                <th>Challenges Reported</th>
                <th>Resolved Issues</th>
                <th>Active Universities</th>
                <th>Health Profile</th>
              </tr>
            </thead>
            <tbody>
              {DISTRICT_SCORECARDS.map((ds, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{ds.district}</td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{ds.score}/100</span>
                  </td>
                  <td>{ds.challenges}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 700 }}>{ds.resolved}</td>
                  <td>{ds.universities}</td>
                  <td>
                    <span style={{ fontSize: '0.74rem', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                      {ds.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
