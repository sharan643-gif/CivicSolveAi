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
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${badge.color}25, ${badge.color}10)`, border: `3px solid ${badge.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 12px' }}>
          {currentUser?.avatar || '👤'}
        </div>
        <h1 style={{ fontSize: '1.45rem', color: 'var(--text-primary)', fontWeight: 800 }}>{currentUser?.name || 'Civic User'}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
          <span style={{ padding: '3px 12px', borderRadius: '100px', background: `${badge.color}15`, color: badge.color, fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${badge.color}30` }}>{badge.icon} {badge.name}</span>
          <span style={{ padding: '3px 12px', borderRadius: '100px', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(27,42,74,0.2)' }}>{currentUser?.role || 'Citizen'}</span>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: badge.color, fontFamily: 'var(--font-display)' }}>{impactScore}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Civic Impact Score</div>
          <div style={{ height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden', maxWidth: '300px', margin: '8px auto 0' }}>
            <div style={{ height: '100%', width: `${Math.min(100, (impactScore / 1000) * 100)}%`, background: `linear-gradient(90deg, ${badge.color}, ${badge.color}aa)`, borderRadius: '3px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '300px', margin: '4px auto 0', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span>0 pts</span><span>500 pts</span><span>1000 pts</span>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'contributions', label: 'Contributions', icon: TrendingUp },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '8px 16px', 
                borderRadius: '100px', 
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)', 
                flexShrink: 0, 
                background: isActive ? 'var(--primary)' : '#ffffff', 
                color: isActive ? '#ffffff' : 'var(--text-secondary)', 
                cursor: 'pointer', 
                fontSize: '0.8rem', 
                fontWeight: isActive ? 700 : 500,
                boxShadow: isActive ? '0 2px 8px rgba(27,42,74,0.2)' : 'var(--shadow-xs)' 
              }}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {[
            { label: 'Problems Reported', value: civicStats.problemsReported, icon: <BookOpen size={16} />, color: 'var(--primary)' },
            { label: 'Solutions Proposed', value: civicStats.solutionsProposed, icon: <Target size={16} />, color: '#10b981' },
            { label: 'Projects Joined', value: civicStats.projectsJoined, icon: <Users size={16} />, color: '#8b5cf6' },
            { label: 'Volunteer Hours', value: civicStats.volunteerHours, icon: <Clock size={16} />, color: '#f59e0b' },
            { label: 'Discussions', value: civicStats.discussionsStarted, icon: <Users size={16} />, color: '#06b6d4' },
            { label: 'Impact Created', value: civicStats.communityImpact, icon: <Star size={16} />, color: 'var(--accent)' },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{ padding: '16px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div style={{ color: stat.color, marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '10px', fontWeight: 700 }}>✅ Unlocked Badges ({unlocked.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {unlocked.map(a => (
                <div key={a.id} style={{ padding: '14px', borderRadius: '10px', background: `${a.color}10`, border: `1px solid ${a.color}30`, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{a.icon}</div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 700 }}>{a.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{a.description}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 700 }}>🔒 Locked Badges ({locked.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {locked.map(a => (
                <div key={a.id} style={{ padding: '14px', borderRadius: '10px', background: '#f8f9fa', border: '1px solid var(--border-subtle)', textAlign: 'center', opacity: 0.6 }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '4px', filter: 'grayscale(1)' }}>{a.icon}</div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{a.requirement}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contributions Tab */}
      {activeTab === 'contributions' && (
        <div className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 700 }}>Recent Activity</h3>
          {[
            { text: 'Reported "Monsoon Rural Road Accessibility"', time: '2 days ago', icon: '📋' },
            { text: 'Supported "Water Pipeline Leakage Detection"', time: '3 days ago', icon: '❤️' },
            { text: 'Joined IoT Monitoring Project', time: '1 week ago', icon: '👥' },
            { text: 'Earned "Civic Champion" badge', time: '1 week ago', icon: '🏆' },
            { text: 'Proposed drainage solution (125 votes)', time: '2 weeks ago', icon: '💡' },
            { text: 'Started discussion on sensor calibration', time: '2 weeks ago', icon: '💬' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < 5 ? '1px solid var(--border-subtle)' : 'none' }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item.text}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
