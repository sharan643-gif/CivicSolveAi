import React, { useState } from 'react';
import { User, Award, Star, MapPin, Clock, BookOpen, Users, Target, Eye, Settings, Shield, TrendingUp, CheckCircle } from 'lucide-react';
import { achievementService } from '../services/featureService';

export default function UserProfilePage({ currentUser }) {
  const [activeTab, setActiveTab] = useState('overview');
  const achievements = achievementService.getAll();
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);
  const impactScore = achievementService.getCitizenImpactScore(currentUser?.id);
  const badge = achievementService.getBadgeForScore(impactScore);

  const civicStats = {
    problemsReported: 3,
    solutionsProposed: 1,
    projectsJoined: 2,
    volunteerHours: 24,
    discussionsStarted: 8,
    solutionsImplemented: 1,
    communityImpact: 156,
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      {/* Profile Header */}
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${badge.color}40, ${badge.color}20)`, border: `3px solid ${badge.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 12px' }}>
          {currentUser?.avatar || '👤'}
        </div>
        <h1 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 800 }}>{currentUser?.name || 'Civic User'}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
          <span style={{ padding: '3px 10px', borderRadius: '100px', background: `${badge.color}20`, color: badge.color, fontSize: '0.75rem', fontWeight: 700 }}>{badge.icon} {badge.name}</span>
          <span style={{ padding: '3px 10px', borderRadius: '100px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 600 }}>{currentUser?.role || 'Citizen'}</span>
        </div>
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: badge.color, fontFamily: 'var(--font-display)' }}>{impactScore}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Civic Impact Score</div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', maxWidth: '300px', margin: '8px auto 0' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (impactScore / 1000) * 100)}%`, background: `linear-gradient(90deg, ${badge.color}, ${badge.color}88)`, borderRadius: '3px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', margin: '4px auto 0', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
            <span>0</span><span>500</span><span>1000</span>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'contributions', label: 'Contributions', icon: TrendingUp },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '8px', border: 'none', flexShrink: 0, background: activeTab === tab.id ? 'rgba(59,130,246,0.12)' : 'transparent', color: activeTab === tab.id ? '#60a5fa' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: activeTab === tab.id ? 700 : 400 }}>
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {[
            { label: 'Problems Reported', value: civicStats.problemsReported, icon: <BookOpen size={16} />, color: '#3b82f6' },
            { label: 'Solutions Proposed', value: civicStats.solutionsProposed, icon: <Target size={16} />, color: '#10b981' },
            { label: 'Projects Joined', value: civicStats.projectsJoined, icon: <Users size={16} />, color: '#8b5cf6' },
            { label: 'Volunteer Hours', value: civicStats.volunteerHours, icon: <Clock size={16} />, color: '#f59e0b' },
            { label: 'Discussions', value: civicStats.discussionsStarted, icon: <Users size={16} />, color: '#06b6d4' },
            { label: 'Impact Created', value: civicStats.communityImpact, icon: <Star size={16} />, color: '#ec4899' },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
              <div style={{ color: stat.color, marginBottom: '6px' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '10px' }}>✅ Unlocked ({unlocked.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {unlocked.map(a => (
                <div key={a.id} style={{ padding: '14px', borderRadius: '10px', background: `${a.color}10`, border: `1px solid ${a.color}30`, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{a.icon}</div>
                  <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 700 }}>{a.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{a.description}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '10px' }}>🔒 Locked ({locked.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {locked.map(a => (
                <div key={a.id} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center', opacity: 0.5 }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '6px', filter: 'grayscale(1)' }}>{a.icon}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{a.requirement}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contributions Tab */}
      {activeTab === 'contributions' && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '16px' }}>Recent Activity</h3>
          {[
            { text: 'Reported "Monsoon Rural Road Accessibility"', time: '2 days ago', icon: '📋' },
            { text: 'Supported "Water Pipeline Leakage Detection"', time: '3 days ago', icon: '❤️' },
            { text: 'Joined IoT Monitoring Project', time: '1 week ago', icon: '👥' },
            { text: 'Earned "Civic Champion" badge', time: '1 week ago', icon: '🏆' },
            { text: 'Proposed drainage solution (125 votes)', time: '2 weeks ago', icon: '💡' },
            { text: 'Started discussion on sensor calibration', time: '2 weeks ago', icon: '💬' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.82rem', color: '#fff' }}>{item.text}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
