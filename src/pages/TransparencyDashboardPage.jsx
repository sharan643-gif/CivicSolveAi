import React from 'react';
import { Eye, TrendingUp, Users, Clock, CheckCircle, Building, Globe, Heart } from 'lucide-react';
import { transparencyService } from '../services/featureService';

export default function TransparencyDashboardPage() {
  const stats = transparencyService.getStats();

  const metrics = [
    { label: 'Problems Reported', value: stats.totalReported, icon: '📋', color: '#003087', sub: 'All time' },
    { label: 'Problems Resolved', value: stats.totalResolved, icon: '✅', color: '#10b981', sub: `${Math.round((stats.totalResolved / stats.totalReported) * 100)}% resolution rate` },
    { label: 'Avg Resolution Time', value: `${stats.avgResolutionDays} days`, icon: '⏱️', color: '#b45309', sub: 'Target: 30 days' },
    { label: 'Active Projects', value: stats.activeProjects, icon: '🚀', color: '#8b5cf6', sub: 'Currently in progress' },
    { label: 'Citizens Participating', value: stats.citizensParticipating.toLocaleString(), icon: '👥', color: '#06b6d4', sub: 'Registered users' },
    { label: 'Communities Benefited', value: stats.communitiesBenefited, icon: '🏘️', color: '#ec4899', sub: 'Across Districts' },
    { label: 'Universities Involved', value: stats.universitiesInvolved, icon: '🎓', color: '#f59e0b', sub: 'Academic partners' },
    { label: 'NGOs Partnered', value: stats.ngosPartnered, icon: '🤝', color: '#10b981', sub: 'Field organizations' },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      <div className="reveal" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', border: '1px solid rgba(0,48,135,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '12px', fontWeight: 700 }}>
          <Eye size={13} /> Public Transparency
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.3rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Civic Transparency Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
          Open, anonymized statistics showing how CivicSolve AI is making a measurable difference in communities across Jharkhand.
        </p>
      </div>

      {/* Big Number Hero */}
      <div className="glass-l2 reveal" style={{ padding: '36px 20px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontWeight: 700 }}>Total Citizens Impacted</div>
        <div style={{ fontSize: 'clamp(2.5rem, 7vw, 3.6rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--primary)', lineHeight: 1.1 }}>1.2M+</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 500 }}>Lives improved through collaborative civic problem-solving</div>
      </div>

      {/* Metrics Grid */}
      <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {metrics.map((m, i) => (
          <div key={i} className="glass-card" style={{ padding: '18px 14px', textAlign: 'center', cursor: 'default', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{m.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: m.color, fontFamily: 'var(--font-display)' }}>{m.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '4px', fontWeight: 700 }}>{m.label}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Trust Section */}
      <div className="glass-l2 reveal" style={{ padding: '28px 20px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>Our Commitment to Transparency</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          All statistics shown are anonymized and aggregated. No individual user data, private reports, or sensitive location information is exposed. This dashboard is updated in real-time from our platform data.
        </p>
      </div>
    </div>
  );
}
