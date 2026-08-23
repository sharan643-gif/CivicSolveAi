import React from 'react';
import { Activity, ShieldCheck, Users, FileCheck, Award } from 'lucide-react';

export default function ChallengeHealthBadge({ challenge }) {
  // Calculate breakdown
  const evidenceScore = challenge?.evidence?.length ? Math.min(100, 70 + challenge.evidence.length * 15) : 45;
  const communityScore = Math.min(100, Math.round(((challenge?.support_count || 12) / 350) * 100));
  const validationScore = challenge?.status === 'validated' || challenge?.status === 'prototype' || challenge?.status === 'pilot' ? 95 : 60;
  const readinessScore = challenge?.skills_required?.length ? Math.min(100, 60 + challenge.skills_required.length * 8) : 50;

  const totalHealth = Math.round((evidenceScore * 0.25) + (communityScore * 0.35) + (validationScore * 0.25) + (readinessScore * 0.15));

  const getColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const mainColor = getColor(totalHealth);

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color={mainColor} />
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Challenge Health Score</h4>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Real-Time Data Completeness</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Circular Progress Gauge */}
        <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={mainColor} strokeWidth="3.2" strokeDasharray={`${totalHealth}, 100`} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{totalHealth}</span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block' }}>/100</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Evidence Quality', score: evidenceScore, icon: FileCheck, color: '#3b82f6' },
            { label: 'Community Support', score: communityScore, icon: Users, color: '#8b5cf6' },
            { label: 'Validation Status', score: validationScore, icon: ShieldCheck, color: '#10b981' },
            { label: 'Solution Readiness', score: readinessScore, icon: Award, color: '#f59e0b' },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <item.icon size={11} color={item.color} /> {item.label}
                </span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{item.score}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.score}%`, background: item.color, borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
