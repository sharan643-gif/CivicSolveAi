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
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#b45309', marginBottom: '8px', fontWeight: 700 }}>
          <Trophy size={13} color="#b45309" /> Gamification & Achievements
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Your Civic Impact</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track your contributions, earn badges, and climb the civic leaderboard.</p>
      </div>

      {/* Impact Score Card */}
      <div className="glass-l2 reveal" style={{ padding: '28px 20px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(${currentBadge.color} ${impactScore}%, #e2e8f0 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: currentBadge.color, fontFamily: 'var(--font-display)' }}>{impactScore}</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Impact Score</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: `${currentBadge.color}15`, border: `1px solid ${currentBadge.color}35`, padding: '6px 16px', borderRadius: '100px', fontSize: '0.85rem', color: currentBadge.color, fontWeight: 700 }}>
            {currentBadge.icon} {currentBadge.name}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '8px' }}>
            {impactScore < 100 ? `${100 - impactScore} points to Community Helper` : impactScore < 300 ? `${300 - impactScore} points to Civic Champion` : 'You are a civic leader!'}
          </p>
        </div>
      </div>

      {/* Badge Progress */}
      <div className="glass-l2 reveal" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>Badge Progression</h3>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
          {badges.map((badge, idx) => {
            const isUnlocked = impactScore >= badge.minScore;
            return (
              <div key={idx} style={{ flex: '0 0 130px', textAlign: 'center', padding: '14px 10px', borderRadius: '10px', background: isUnlocked ? `${badge.color}12` : '#f8f9fa', border: `1px solid ${isUnlocked ? badge.color + '40' : 'var(--border-subtle)'}`, opacity: isUnlocked ? 1 : 0.6 }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{badge.icon}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isUnlocked ? badge.color : 'var(--text-muted)' }}>{badge.name}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>{badge.minScore}+ pts</div>
                {isUnlocked && <CheckCircle size={14} color={badge.color} style={{ marginTop: '6px' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="reveal">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>Achievements ({unlocked.length}/{achievements.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {achievements.map(ach => (
            <div key={ach.id} className="glass-card" style={{ padding: '16px', opacity: ach.unlocked ? 1 : 0.6, cursor: 'default', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: ach.unlocked ? `${ach.color}18` : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  {ach.unlocked ? ach.icon : <Lock size={16} color="var(--text-muted)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: ach.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>{ach.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{ach.description}</div>
                </div>
                {ach.unlocked && <CheckCircle size={16} color={ach.color} />}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', fontWeight: 500 }}>
                Requirement: {ach.requirement}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
