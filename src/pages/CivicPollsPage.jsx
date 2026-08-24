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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#60a5fa', marginBottom: '8px' }}>
          <Vote size={12} /> Civic Polls
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Community Polls</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Vote on civic priorities and help shape local policy decisions.</p>
      </div>

      <div className="filter-row-mobile" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {['all', 'active', 'closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: filter === f ? 'rgba(59,130,246,0.12)' : 'transparent', color: filter === f ? '#60a5fa' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: filter === f ? 700 : 400, textTransform: 'capitalize' }}>
          {f === 'all' ? 'All Polls' : f}
        </button>
      ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(poll => {
          const hasVoted = !!votedPolls[poll.id];
          const winningOption = [...poll.options].sort((a, b) => b.votes - a.votes)[0];
          return (
            <div key={poll.id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '100px', background: poll.active ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.12)', color: poll.active ? '#10b981' : '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
                      {poll.active ? '● Active' : '● Closed'}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{poll.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700, marginBottom: '4px' }}>{poll.question}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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
                    <div key={option.id} onClick={() => poll.active && handleVote(poll.id, option.id)} style={{ cursor: poll.active && !hasVoted ? 'pointer' : 'default', position: 'relative', overflow: 'hidden', borderRadius: '8px', border: `1px solid ${isSelected ? 'rgba(59,130,246,0.4)' : 'var(--border-subtle)'}`, transition: 'all 0.2s ease' }}>
                      <div style={{ position: 'absolute', inset: 0, background: isSelected ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.02)', borderRadius: 'inherit', zIndex: 0 }} />
                      {hasVoted && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${option.percentage}%`, background: isSelected ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)', borderRadius: 'inherit', zIndex: 0, transition: 'width 0.5s ease' }} />}
                      <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isSelected ? <CheckCircle2 size={16} color="#3b82f6" /> : <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--border-subtle)' }} />}
                          <span style={{ fontSize: '0.85rem', color: '#fff' }}>{option.text}</span>
                        </div>
                        {hasVoted && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? '#3b82f6' : 'var(--text-secondary)' }}>{option.percentage}%</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>({option.votes})</span>
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
