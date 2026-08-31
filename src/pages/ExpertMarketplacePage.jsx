import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Award, ExternalLink, Filter, Briefcase } from 'lucide-react';
import { expertService } from '../services/featureService';

export default function ExpertMarketplacePage() {
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const experts = expertService.getAll().filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.expertise.some(ex => ex.toLowerCase().includes(search.toLowerCase()));
    const matchesAvail = availabilityFilter === 'all' || e.availability.toLowerCase() === availabilityFilter;
    return matchesSearch && matchesAvail;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#7c3aed', marginBottom: '8px', fontWeight: 700 }}>
          <Award size={13} color="#7c3aed" /> Expert Marketplace
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Expert Marketplace</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Connect with accredited domain experts for civic project guidance and technical validation.</p>
      </div>

      {/* Search & Filters */}
      <div className="glass-l2 reveal" style={{ padding: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="form-input" placeholder="Search experts by name or expertise..." style={{ paddingLeft: '38px', width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'available', 'busy'].map(f => (
            <button key={f} onClick={() => setAvailabilityFilter(f)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: availabilityFilter === f ? 'var(--primary-light)' : '#ffffff', color: availabilityFilter === f ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: availabilityFilter === f ? 700 : 500, textTransform: 'capitalize' }}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Expert Cards */}
      <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {experts.map(expert => (
          <div key={expert.id} className="glass-card" style={{ padding: '20px', cursor: 'default', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '2.2rem' }}>{expert.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{expert.name}</h3>
                    <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, background: expert.availability === 'Available' ? '#f0fdf4' : '#fffbeb', color: expert.availability === 'Available' ? '#047857' : '#b45309', border: `1px solid ${expert.availability === 'Available' ? '#bbf7d0' : '#fde68a'}` }}>
                      {expert.availability}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{expert.organization}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#b45309' }}><Star size={12} fill="#b45309" color="#b45309" /> {expert.rating} ({expert.reviews})</span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={12} /> {expert.location}</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>{expert.bio}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {expert.expertise.map(ex => (
                  <span key={ex} style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(27,42,74,0.06)', border: '1px solid rgba(27,42,74,0.15)', color: 'var(--primary)', fontWeight: 600 }}>{ex}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {expert.experience} exp · {expert.projects} projects · {expert.hourlyRate}
              </div>
              <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.78rem' }} onClick={() => alert(`Request sent to ${expert.name}!`)}>
                Request Expertise
              </button>
            </div>
          </div>
        ))}
      </div>

      {experts.length === 0 && (
        <div className="glass-l2" style={{ padding: '50px 20px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🕵️</div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 700 }}>No experts found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
