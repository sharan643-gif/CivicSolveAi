import React, { useState } from 'react';
import { BarChart3, CheckCircle2, Clock, Users, Vote } from 'lucide-react';
import { civicPollService } from '../services/advanced40Service';

export default function CivicPollsPage() {
  const [polls, setPolls] = useState(civicPollService.getAll());
  const [votedPolls, setVotedPolls] = useState({});
  const [filter, setFilter] = useState('all');

  const handleVote = (pollId, optionId) => {
    if (votedPolls[pollId]) return;
    const updated = civicPollService.vote(pollId, optionId);
    setPolls(prev => prev.map(p => p.id === pollId ? updated : p));
    setVotedPolls(prev => ({ ...prev, [pollId]: optionId }));
  };

  const filtered = polls.filter(p => filter === 'all' || (filter === 'active' ? p.active : !p.active));

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', border: '1px solid rgba(0,48,135,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 700 }}>
          <Vote size={13} color="var(--primary)" /> Civic Polls & Referendums
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Community Polls</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Vote on civic priorities and help shape local policy decisions in your locality.</p>
      </div>

      <div className="filter-row-mobile" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {['all', 'active', 'closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: '100px', border: filter === f ? '1px solid var(--primary)' : '1px solid var(--border-subtle)', background: filter === f ? 'var(--primary)' : '#ffffff', color: filter === f ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: filter === f ? 700 : 500, textTransform: 'capitalize', boxShadow: filter === f ? '0 2px 8px rgba(0,48,135,0.2)' : 'var(--shadow-xs)' }}>
            {f === 'all' ? 'All Polls' : f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map(poll => {
          const hasVoted = !!votedPolls[poll.id];
          const winningOption = [...poll.options].sort((a, b) => b.votes - a.votes)[0];
          return (
            <div key={poll.id} className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', background: poll.active ? '#f0fdf4' : '#f1f5f9', color: poll.active ? '#047857' : '#64748b', fontWeight: 700, textTransform: 'uppercase', border: `1px solid ${poll.active ? '#bbf7d0' : '#e2e8f0'}` }}>
                      {poll.active ? '● Active' : '● Closed'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{poll.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '4px' }}>{poll.question}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.74rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> {poll.totalVotes} votes</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {poll.active ? `Ends ${poll.deadline}` : 'Ended'}</span>
                    <span>By {poll.createdBy}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                {poll.options.map(option => {
                  const isWinner = hasVoted && option.id === winningOption.id;
                  const isSelected = votedPolls[poll.id] === option.id;
                  return (
                    <div key={option.id} onClick={() => poll.active && handleVote(poll.id, option.id)} style={{ cursor: poll.active && !hasVoted ? 'pointer' : 'default', position: 'relative', overflow: 'hidden', borderRadius: '8px', border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`, background: '#f8fafc', transition: 'all 0.2s ease' }}>
                      {hasVoted && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${option.percentage}%`, background: isSelected ? 'rgba(0,48,135,0.12)' : 'rgba(0,0,0,0.04)', borderRadius: 'inherit', zIndex: 0, transition: 'width 0.5s ease' }} />}
                      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isSelected ? <CheckCircle2 size={16} color="var(--primary)" /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--border-medium)' }} />}
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: isSelected ? 700 : 500 }}>{option.text}</span>
                        </div>
                        {hasVoted && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-secondary)' }}>{option.percentage}%</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({option.votes})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
