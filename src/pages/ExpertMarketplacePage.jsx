import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Award, ExternalLink, Filter, Briefcase } from 'lucide-react';
import { expertService } from '../services/featureService';

export default function ExpertMarketplacePage() {
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [selectedExpert, setSelectedExpert] = useState(null);

  const experts = expertService.getAll().filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.expertise.some(ex => ex.toLowerCase().includes(search.toLowerCase()));
    const matchesAvail = availabilityFilter === 'all' || e.availability.toLowerCase() === availabilityFilter;
    return matchesSearch && matchesAvail;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#a78bfa', marginBottom: '8px' }}>
          <Award size={12} /> Expert Marketplace
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Expert Marketplace</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Connect with domain experts for civic project guidance and validation.</p>
      </div>

      {/* Search & Filters */}
      <div className="glass-l2 reveal" style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="glass-input" placeholder="Search experts by name or expertise..." style={{ paddingLeft: '38px' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'available', 'busy'].map(f => (
            <button key={f} onClick={() => setAvailabilityFilter(f)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: availabilityFilter === f ? 'rgba(139,92,246,0.12)' : 'transparent', color: availabilityFilter === f ? '#a78bfa' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: availabilityFilter === f ? 700 : 400, textTransform: 'capitalize' }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Expert Cards */}
      <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {experts.map(expert => (
          <div key={expert.id} className="glass-card" style={{ padding: '24px', cursor: 'default' }}>
            <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '2.2rem' }}>{expert.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{expert.name}</h3>
                  <span style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: '100px', fontWeight: 700, background: expert.availability === 'Available' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: expert.availability === 'Available' ? '#10b981' : '#f59e0b', border: `1px solid ${expert.availability === 'Available' ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}` }}>
                    {expert.availability}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{expert.organization}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Star size={12} color="#f59e0b" /> {expert.rating} ({expert.reviews})</span>
                  <span>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={12} /> {expert.location}</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>{expert.bio}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {expert.expertise.map(ex => (
                <span key={ex} style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa', fontWeight: 600 }}>{ex}</span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {expert.experience} exp · {expert.projects} projects · {expert.hourlyRate}
              </div>
              <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem' }} onClick={() => alert(`Request sent to ${expert.name}!`)}>
                Request Expertise
              </button>
            </div>
          </div>
        ))}
      </div>

      {experts.length === 0 && (
        <div className="glass-l2" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🕵️</div>
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>No experts found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
