import React, { useState } from 'react';
import { Trophy, TrendingUp, Users, Building, Award, Star, Filter } from 'lucide-react';
import { leaderboardService } from '../services/featureService';

export default function LeaderboardPage() {
  const [category, setCategory] = useState('citizens');
  const [period, setPeriod] = useState('all');

  const categories = [
    { id: 'citizens', label: 'Top Citizens', icon: Users, color: '#06b6d4' },
    { id: 'universities', label: 'Top Universities', icon: Building, color: '#f59e0b' },
    { id: 'experts', label: 'Top Experts', icon: Award, color: '#8b5cf6' },
    { id: 'ngos', label: 'Top NGOs', icon: Trophy, color: '#10b981' },
    { id: 'industry', label: 'Industry Partners', icon: Star, color: '#ec4899' },
  ];

  const data = leaderboardService.get(category, period);
  const activeCat = categories.find(c => c.id === category);

  const getRankBadge = (idx) => {
    if (idx === 0) return { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '🥇', label: 'Gold' };
    if (idx === 1) return { bg: 'linear-gradient(135deg, #94a3b8, #64748b)', icon: '🥈', label: 'Silver' };
    if (idx === 2) return { bg: 'linear-gradient(135deg, #cd7f32, #a0522d)', icon: '🥉', label: 'Bronze' };
    return { bg: 'rgba(255,255,255,0.06)', icon: `#${idx + 1}`, label: '' };
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#f59e0b', marginBottom: '8px' }}>
          <TrendingUp size={12} /> Civic Leaderboard
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Civic Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Recognizing the most impactful contributors across all sectors.</p>
      </div>

      {/* Category Tabs */}
      <div className="glass-l1 reveal" style={{ display: 'flex', gap: '4px', padding: '6px', borderRadius: '14px', overflowX: 'auto' }}>
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = category === cat.id;
          return (
            <button key={cat.id} onClick={() => setCategory(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: isActive ? `${cat.color}18` : 'transparent', color: isActive ? cat.color : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease' }}>
              <Icon size={14} /> {cat.label}
            </button>
          );
        })}
      </div>

      {/* Period Filter */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {['all', 'weekly', 'monthly', 'yearly'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: period === p ? 'rgba(59,130,246,0.12)' : 'transparent', color: period === p ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: period === p ? 700 : 400, textTransform: 'capitalize' }}>
            {p === 'all' ? 'All Time' : p}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {data.map((item, idx) => {
          const rank = getRankBadge(idx);
          return (
            <div key={item.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'default' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: rank.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: idx < 3 ? '1.2rem' : '0.8rem', fontWeight: 800, color: idx < 3 ? '#fff' : 'var(--text-secondary)', flexShrink: 0 }}>
                {rank.icon}
              </div>
              <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{item.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{item.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {category === 'citizens' && `${item.problemsReported} problems · ${item.helped} helped`}
                  {category === 'universities' && `${item.projects} projects · ${item.students} students`}
                  {category === 'experts' && `${item.reviews} reviews · ${item.rating}★ rating`}
                  {category === 'ngos' && `${item.projects} projects · ${item.beneficiaries?.toLocaleString()} beneficiaries`}
                  {category === 'industry' && `₹${(item.invested / 100000).toFixed(1)}L invested · ${item.sponsored} sponsored`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: activeCat?.color || '#fff', fontFamily: 'var(--font-display)' }}>
                  {item.score.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Points</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
