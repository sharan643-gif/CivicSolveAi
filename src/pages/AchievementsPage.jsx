import React from 'react';
import { Trophy, Star, Award, Target, Lock, CheckCircle, Zap, TrendingUp, Medal } from 'lucide-react';
import { achievementService } from '../services/featureService';

export default function AchievementsPage({ currentUser }) {
  const achievements = achievementService.getAll();
  const unlocked = achievementService.getUnlocked();
  const badges = achievementService.getCitizenBadges();
  const impactScore = achievementService.getCitizenImpactScore(currentUser?.id);
  const currentBadge = achievementService.getBadgeForScore(impactScore);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#f59e0b', marginBottom: '8px' }}>
          <Trophy size={12} /> Gamification & Achievements
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Your Civic Impact</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track your contributions, earn badges, and climb the civic leaderboard.</p>
      </div>

      {/* Impact Score Card */}
      <div className="glass-l2 reveal" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(${currentBadge.color} ${impactScore}%, rgba(255,255,255,0.06) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: currentBadge.color, fontFamily: 'var(--font-display)' }}>{impactScore}</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Impact Score</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${currentBadge.color}15`, border: `1px solid ${currentBadge.color}30`, padding: '6px 14px', borderRadius: '100px', fontSize: '0.85rem', color: currentBadge.color, fontWeight: 700 }}>
            {currentBadge.icon} {currentBadge.name}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '8px' }}>
            {impactScore < 100 ? `${100 - impactScore} points to Community Helper` : impactScore < 300 ? `${300 - impactScore} points to Civic Champion` : 'You are a civic leader!'}
          </p>
        </div>
      </div>

      {/* Badge Progress */}
      <div className="glass-l2 reveal" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Badge Progression</h3>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '8px 0' }}>
          {badges.map((badge, idx) => {
            const isUnlocked = impactScore >= badge.minScore;
            return (
              <div key={idx} style={{ flex: '0 0 140px', textAlign: 'center', padding: '16px 12px', borderRadius: '14px', background: isUnlocked ? `${badge.color}10` : 'rgba(255,255,255,0.02)', border: `1px solid ${isUnlocked ? badge.color + '30' : 'var(--border-subtle)'}`, opacity: isUnlocked ? 1 : 0.5 }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{badge.icon}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isUnlocked ? badge.color : 'var(--text-muted)' }}>{badge.name}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>{badge.minScore}+ pts</div>
                {isUnlocked && <CheckCircle size={14} color={badge.color} style={{ marginTop: '6px' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="reveal">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Achievements ({unlocked.length}/{achievements.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {achievements.map(ach => (
            <div key={ach.id} className="glass-card" style={{ padding: '20px', opacity: ach.unlocked ? 1 : 0.5, cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: ach.unlocked ? `${ach.color}18` : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                  {ach.unlocked ? ach.icon : <Lock size={18} color="var(--text-muted)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: ach.unlocked ? '#fff' : 'var(--text-muted)' }}>{ach.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{ach.description}</div>
                </div>
                {ach.unlocked && <CheckCircle size={18} color={ach.color} />}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                Requirement: {ach.requirement}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
