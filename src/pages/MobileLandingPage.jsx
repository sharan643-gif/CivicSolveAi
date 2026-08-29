import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Users, GraduationCap, Building, LineChart } from 'lucide-react';

export default function MobileLandingPage({ onNavigate, stats }) {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '80px' }}>

      {/* Hero Header */}
      <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
        <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', border: '1px solid rgba(0,48,135,0.2)', padding: '5px 12px', borderRadius: '100px', fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>
          <Sparkles size={12} /> SIH 2026 Innovation Platform
        </div>

        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
          Turn real-world <span style={{ color: 'var(--primary)' }}>problems</span> into real-world <span style={{ color: 'var(--accent)' }}>solutions.</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
          JanSetu AI connects communities, universities, industry, and government to transform raw societal challenges into measurable impact.
        </p>
      </div>

      {/* Compact CTAs */}
      <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => onNavigate('report')} className="btn btn-primary touch-target" style={{ padding: '14px', fontSize: '0.92rem', borderRadius: '8px', width: '100%', justifyContent: 'center' }}>
          Report a Challenge <ArrowRight size={16} />
        </button>
        <button onClick={() => onNavigate('explore')} className="btn btn-secondary touch-target" style={{ padding: '14px', fontSize: '0.92rem', borderRadius: '8px', width: '100%', justifyContent: 'center' }}>
          Explore Active Issues
        </button>
      </div>

      {/* Ecosystem Journey — Clean White Card */}
      <div className="glass-card reveal" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={14} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            End-to-End Innovation Flow
          </h3>
        </div>

        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
          {[
            { stage: '1. Citizen Reports', desc: 'Local issues captured with evidence', color: 'var(--primary)', icon: '👤' },
            { stage: '2. AI Analysis', desc: 'Priority score & duplicate check', color: 'var(--accent)', icon: '🤖' },
            { stage: '3. University Cohort', desc: 'Student engineering team assigned', color: '#f59e0b', icon: '🎓' },
            { stage: '4. Industry CSR', desc: 'Prototype seed grant & mentorship', color: '#ec4899', icon: '🏢' },
            { stage: '5. Gov Field Pilot', desc: 'Department validated scale-up', color: 'var(--primary)', icon: '🏛️' },
            { stage: '6. Measured Impact', desc: '1.2M+ citizens impacted', color: 'var(--success)', icon: '📈' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-xs)' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <div>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem', display: 'block' }}>{item.stage}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards — Clean White Cards */}
      <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card" style={{ padding: '18px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
            {(stats?.totalChallenges || 12840).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Challenges Reported</span>
        </div>
        <div className="glass-card" style={{ padding: '18px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-display)' }}>
            {(stats?.implemented || 4820).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Solutions Built</span>
        </div>
      </div>

    </div>
  );
}
