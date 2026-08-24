import React from 'react';
import { Eye, TrendingUp, Users, Clock, CheckCircle, Building, Globe, Heart } from 'lucide-react';
import { transparencyService } from '../services/featureService';

export default function TransparencyDashboardPage() {
  const stats = transparencyService.getStats();

  const metrics = [
    { label: 'Problems Reported', value: stats.totalReported, icon: '📋', color: '#3b82f6', sub: 'All time' },
    { label: 'Problems Resolved', value: stats.totalResolved, icon: '✅', color: '#10b981', sub: `${Math.round((stats.totalResolved / stats.totalReported) * 100)}% resolution rate` },
    { label: 'Avg Resolution Time', value: `${stats.avgResolutionDays} days`, icon: '⏱️', color: '#f59e0b', sub: 'Target: 30 days' },
    { label: 'Active Projects', value: stats.activeProjects, icon: '🚀', color: '#8b5cf6', sub: 'Currently in progress' },
    { label: 'Citizens Participating', value: stats.citizensParticipating.toLocaleString(), icon: '👥', color: '#06b6d4', sub: 'Registered users' },
    { label: 'Communities Benefited', value: stats.communitiesBenefited, icon: '🏘️', color: '#ec4899', sub: 'Across Jharkhand' },
    { label: 'Universities Involved', value: stats.universitiesInvolved, icon: '🎓', color: '#f59e0b', sub: 'Academic partners' },
    { label: 'NGOs Partnered', value: stats.ngosPartnered, icon: '🤝', color: '#10b981', sub: 'Field organizations' },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>
      <div className="reveal" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#60a5fa', marginBottom: '12px' }}>
          <Eye size={12} /> Public Transparency
        </div>
        <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>Civic Transparency Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Open, anonymized statistics showing how CivicSolve AI is making a real difference in communities across Jharkhand. No private user data is exposed.
        </p>
      </div>

      {/* Big Number Hero */}
      <div className="glass-l2 reveal" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Total Citizens Impacted</div>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, var(--primary), var(--ai-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>1.2M+</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Lives improved through collaborative civic problem-solving</div>
      </div>

      {/* Metrics Grid */}
      <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {metrics.map((m, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center', cursor: 'default' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{m.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: m.color, fontFamily: 'var(--font-display)' }}>{m.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '4px' }}>{m.label}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Trust Section */}
      <div className="glass-l2 reveal" style={{ padding: '32px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Our Commitment to Transparency</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          All statistics shown are anonymized and aggregated. No individual user data, private reports, or sensitive location information is exposed. This dashboard is updated in real-time from our platform data.
        </p>
      </div>
    </div>
  );
}
