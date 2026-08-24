import React, { useState } from 'react';
import { Search, MapPin, Users, Heart, Star, Filter } from 'lucide-react';
import { ngoService } from '../services/featureService';

export default function NgoMatchingPage() {
  const [search, setSearch] = useState('');
  const [causeFilter, setCauseFilter] = useState('all');

  const ngos = ngoService.getRecommended('all').filter(n => {
    const matchesSearch = n.name.toLowerCase().includes(search.toLowerCase());
    const matchesCause = causeFilter === 'all' || n.causes.some(c => c.toLowerCase().includes(causeFilter.toLowerCase()));
    return matchesSearch && matchesCause;
  });

  const allCauses = [...new Set(ngos.flatMap(n => n.causes))];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#10b981', marginBottom: '8px' }}>
          <Heart size={12} /> NGO Matching
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>NGO Matching System</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>AI-recommended NGOs matched to your civic issues by cause, location, and expertise.</p>
      </div>

      <div className="glass-l2 reveal" style={{ padding: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="glass-input" placeholder="Search NGOs..." style={{ paddingLeft: '38px' }} />
        </div>
        <select value={causeFilter} onChange={e => setCauseFilter(e.target.value)} className="form-select" style={{ padding: '10px 12px', fontSize: '0.85rem', width: '180px' }}>
          <option value="all">All Causes</option>
          {allCauses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {ngos.map(ngo => (
          <div key={ngo.id} className="glass-card" style={{ padding: '24px', cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '2rem' }}>{ngo.avatar}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{ngo.name}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {ngo.location}
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 12px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>{ngo.compatibility}%</div>
                <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Match</div>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>{ngo.bio}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {ngo.causes.map(cause => (
                <span key={cause} style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: '#10b981' }}>{cause}</span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>{ngo.previousProjects} projects · {ngo.beneficiaries?.toLocaleString()} beneficiaries</span>
              <span className="badge" style={{ background: `${ngo.capacity === 'Large' ? 'rgba(16,185,129,0.12)' : ngo.capacity === 'Medium' ? 'rgba(59,130,246,0.12)' : 'rgba(245,158,11,0.12)'}`, color: ngo.capacity === 'Large' ? '#10b981' : ngo.capacity === 'Medium' ? '#3b82f6' : '#f59e0b', border: 'none', fontSize: '0.65rem' }}>{ngo.capacity}</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '14px', padding: '10px', fontSize: '0.82rem' }} onClick={() => alert(`Partnership request sent to ${ngo.name}!`)}>
              Request Partnership
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
