import React, { useState } from 'react';
import { Trophy, TrendingUp, Users, Building, Award, Star, Building2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { leaderboardService } from '../services/featureService';
import { accountabilityService } from '../services/accountabilityService';
import DeptPerformanceBadge from '../components/DeptPerformanceBadge';

export default function LeaderboardPage({ onNavigate }) {
  const [category, setCategory] = useState('departments');
  const [period, setPeriod] = useState('all');

  const categories = [
    { id: 'departments', label: 'Government Departments', icon: Building2, color: '#003087' },
    { id: 'citizens', label: 'Top Citizens', icon: Users, color: '#003087' },
    { id: 'universities', label: 'Top Universities', icon: Building, color: '#b45309' },
    { id: 'experts', label: 'Top Experts', icon: Award, color: '#8b5cf6' },
    { id: 'ngos', label: 'Top NGOs', icon: Trophy, color: '#10b981' },
    { id: 'industry', label: 'Industry Partners', icon: Star, color: '#FF6200' },
  ];

  const deptLeaderboard = accountabilityService.getDepartmentLeaderboard();
  const data = category === 'departments' ? [] : leaderboardService.get(category, period);

  const getRankBadge = (idx) => {
    if (idx === 0) return { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '🥇', label: 'Gold', color: '#ffffff' };
    if (idx === 1) return { bg: 'linear-gradient(135deg, #94a3b8, #64748b)', icon: '🥈', label: 'Silver', color: '#ffffff' };
    if (idx === 2) return { bg: 'linear-gradient(135deg, #d97706, #b45309)', icon: '🥉', label: 'Bronze', color: '#ffffff' };
    return { bg: '#f1f5f9', icon: `#${idx + 1}`, label: '', color: 'var(--text-secondary)' };
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#b45309', marginBottom: '8px', fontWeight: 700 }}>
          <TrendingUp size={13} color="#b45309" /> Public Civic Accountability
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>
          Civic & Department Leaderboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Transparent public performance rankings for government departments and community contributors.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="reveal" style={{ display: 'flex', gap: '6px', padding: '4px', borderRadius: '12px', overflowX: 'auto', background: '#ffffff', border: '1px solid var(--border-subtle)', scrollbarWidth: 'none' }}>
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = category === cat.id;
          return (
            <button 
              key={cat.id} 
              onClick={() => setCategory(cat.id)} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '9px 14px', 
                borderRadius: '8px', 
                border: 'none', 
                background: isActive ? 'var(--primary)' : 'transparent', 
                color: isActive ? '#ffffff' : 'var(--text-secondary)', 
                fontSize: '0.82rem', 
                fontWeight: isActive ? 700 : 500, 
                cursor: 'pointer', 
                whiteSpace: 'nowrap', 
                transition: 'all 0.15s ease' 
              }}
            >
              <Icon size={14} /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Period Filter (for non-departments) */}
      {category !== 'departments' && (
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['all', 'weekly', 'monthly', 'yearly'].map(p => (
            <button 
              key={p} 
              onClick={() => setPeriod(p)} 
              style={{ 
                padding: '6px 14px', 
                borderRadius: '100px', 
                border: period === p ? '1px solid var(--primary)' : '1px solid var(--border-subtle)', 
                background: period === p ? 'var(--primary-light)' : '#ffffff', 
                color: period === p ? 'var(--primary)' : 'var(--text-secondary)', 
                cursor: 'pointer', 
                fontSize: '0.78rem', 
                fontWeight: period === p ? 700 : 500, 
                textTransform: 'capitalize' 
              }}
            >
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>
      )}

      {/* DEPARTMENTS LEADERBOARD VIEW */}
      {category === 'departments' ? (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {deptLeaderboard.map((dept, idx) => {
            const rank = getRankBadge(idx);
            return (
              <div
                key={dept.id}
                className="glass-card"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Rank Badge */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: rank.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: idx < 3 ? '1.2rem' : '0.88rem',
                    fontWeight: 800,
                    color: rank.color,
                    flexShrink: 0
                  }}
                >
                  {rank.icon}
                </div>

                {/* Icon */}
                <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>
                  {dept.icon}
                </div>

                {/* Department Info */}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {dept.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: '100px',
                        background: dept.tier === 'Excellent' ? '#f0fdf4' : dept.tier === 'Good Standing' ? '#f0f9ff' : '#fef2f2',
                        color: dept.tier === 'Excellent' ? '#059669' : dept.tier === 'Good Standing' ? '#0284c7' : '#dc2626',
                        fontWeight: 700
                      }}
                    >
                      {dept.tier}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Head: {dept.head} · Legal SLA: {dept.slaDays} Days
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', padding: '0 8px' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>{dept.slaCompliance}%</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>SLA Rate</div>
                  </div>

                  <div style={{ textAlign: 'center', padding: '0 8px' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0284c7' }}>{dept.citizenSatisfaction}★</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Satisfaction</div>
                  </div>

                  <div style={{ textAlign: 'center', padding: '0 8px' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: dept.escalationsCount > 2 ? '#dc2626' : '#b45309' }}>
                      {dept.escalationsCount}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Escalations</div>
                  </div>

                  {/* Overall Credit Score */}
                  <div style={{ textAlign: 'right', minWidth: '90px', paddingLeft: '10px', borderLeft: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: dept.badgeColor, fontFamily: 'var(--font-display)' }}>
                      {dept.score}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/100</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      Credit Score
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* OTHER CATEGORIES LIST */
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.map((item, idx) => {
            const rank = getRankBadge(idx);
            return (
              <div key={item.id} className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'default', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: rank.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: idx < 3 ? '1.1rem' : '0.82rem', fontWeight: 800, color: rank.color, flexShrink: 0 }}>
                  {rank.icon}
                </div>
                <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{item.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {category === 'citizens' && `${item.problemsReported} problems · ${item.helped} helped`}
                    {category === 'universities' && `${item.projects} projects · ${item.students} students`}
                    {category === 'experts' && `${item.reviews} reviews · ${item.rating}★ rating`}
                    {category === 'ngos' && `${item.projects} projects · ${item.beneficiaries?.toLocaleString()} beneficiaries`}
                    {category === 'industry' && `₹${(item.invested / 100000).toFixed(1)}L invested · ${item.sponsored} sponsored`}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                    {item.score.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Points</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
