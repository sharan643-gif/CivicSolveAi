import React, { useState } from 'react';
import { Trophy, Clock, Users, Award, Calendar, Target, Zap, ChevronRight } from 'lucide-react';
import { innovationChallengeService } from '../services/featureService';

export default function CivicChallengesPage() {
  const [filter, setFilter] = useState('all');
  const challenges = innovationChallengeService.getAll().filter(c => filter === 'all' || c.status === filter);

  const getStatusColor = (status) => {
    if (status === 'open') return '#047857';
    if (status === 'judging') return '#b45309';
    return '#003087';
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#dc2626', marginBottom: '8px', fontWeight: 700 }}>
          <Zap size={13} color="#dc2626" /> Innovation Challenges
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Civic Innovation Challenges</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Compete to build the most impactful civic technology solutions and win pilot funding grants.</p>
      </div>

      <div className="filter-row-mobile" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {['all', 'open', 'judging'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: '100px', border: filter === f ? '1px solid var(--primary)' : '1px solid var(--border-subtle)', background: filter === f ? 'var(--primary)' : '#ffffff', color: filter === f ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: filter === f ? 700 : 500, textTransform: 'capitalize', boxShadow: filter === f ? '0 2px 8px rgba(0,48,135,0.2)' : 'var(--shadow-xs)' }}>
            {f === 'all' ? 'All Challenges' : f === 'open' ? 'Open' : 'Judging'}
          </button>
        ))}
      </div>

      <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {challenges.map(ch => (
          <div key={ch.id} className="glass-l2" style={{ padding: '24px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, background: `${getStatusColor(ch.status)}15`, color: getStatusColor(ch.status), border: `1px solid ${getStatusColor(ch.status)}30`, textTransform: 'uppercase' }}>
                    {ch.status}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>by {ch.organization}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>{ch.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '640px' }}>{ch.description}</p>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#b45309', fontFamily: 'var(--font-display)' }}>{ch.prize}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Prize Pool</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Calendar size={14} color="#dc2626" /> Deadline: {ch.deadline}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Users size={14} color="var(--primary)" /> {ch.submissions} submissions
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Target size={14} color="#7c3aed" /> {ch.eligibility}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.84rem' }} onClick={() => alert(`Submission portal opening for: ${ch.title}`)}>
                Submit Solution <ChevronRight size={14} />
              </button>
              <button className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: '0.84rem', background: '#ffffff', border: '1px solid var(--border-medium)' }}>
                View Leaderboard
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
