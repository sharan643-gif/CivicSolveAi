import React, { useState } from 'react';
import { Trophy, Clock, Users, Award, Calendar, Target, Zap, ChevronRight } from 'lucide-react';
import { innovationChallengeService } from '../services/featureService';

export default function CivicChallengesPage() {
  const [filter, setFilter] = useState('all');
  const challenges = innovationChallengeService.getAll().filter(c => filter === 'all' || c.status === filter);

  const getStatusColor = (status) => {
    if (status === 'open') return '#10b981';
    if (status === 'judging') return '#f59e0b';
    return '#3b82f6';
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#f87171', marginBottom: '8px' }}>
          <Zap size={12} /> Innovation Challenges
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Civic Innovation Challenges</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Compete to build the most impactful civic technology solutions.</p>
      </div>

      <div className="filter-row-mobile" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {['all', 'open', 'judging'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: filter === f ? 'rgba(239,68,68,0.12)' : 'transparent', color: filter === f ? '#f87171' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: filter === f ? 700 : 400, textTransform: 'capitalize' }}>
          {f === 'all' ? 'All Challenges' : f === 'open' ? 'Open' : 'Judging'}
        </button>
      ))}
      </div>

      <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {challenges.map(ch => (
          <div key={ch.id} className="glass-l2" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, background: `${getStatusColor(ch.status)}15`, color: getStatusColor(ch.status), border: `1px solid ${getStatusColor(ch.status)}25`, textTransform: 'uppercase' }}>
                    {ch.status}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>by {ch.organization}</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{ch.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '600px' }}>{ch.description}</p>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-display)' }}>{ch.prize}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Prize Pool</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Calendar size={14} color="#ef4444" /> Deadline: {ch.deadline}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Users size={14} color="#3b82f6" /> {ch.submissions} submissions
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <Target size={14} color="#8b5cf6" /> {ch.eligibility}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }} onClick={() => alert(`Submission portal opening for: ${ch.title}`)}>
                Submit Solution <ChevronRight size={14} />
              </button>
              <button className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                View Leaderboard
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
