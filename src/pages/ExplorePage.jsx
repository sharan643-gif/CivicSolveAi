import React, { useState } from 'react';
import { Search, MapPin, AlertTriangle, Users, GitPullRequest, ArrowUpDown, LayoutGrid, Map } from 'lucide-react';
import ChallengeMap from '../components/ChallengeMap';
import { JHARKHAND_DISTRICTS, CATEGORIES } from '../services/mockData';

export default function ExplorePage({ challenges = [], onNavigate }) {
  const checkMobile = () => window.innerWidth <= 768 || (window.innerHeight / window.innerWidth) > 1.15;
  const [isMobile, setIsMobile] = React.useState(checkMobile);
  React.useEffect(() => {
    const h = () => setIsMobile(checkMobile());
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [district, setDistrict] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase()) ||
                          c.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || c.category === category;
    const matchesDistrict = district === 'all' || c.district === district;
    const matchesSeverity = severity === 'all' || c.severity === severity;
    const matchesStatus = status === 'all' || c.status === status;
    return matchesSearch && matchesCategory && matchesDistrict && matchesSeverity && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'priority') return b.priority_score - a.priority_score;
    if (sortBy === 'supported') return b.support_count - a.support_count;
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  const getSeverityColor = (sev) => {
    if (sev === 'critical') return '#ef4444';
    if (sev === 'high') return '#f97316';
    if (sev === 'medium') return '#eab308';
    return '#10b981';
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', marginBottom: '6px' }}>Explore Societal Challenges</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Identify, match, and propose engineering solutions for validated community bottlenecks.</p>
        </div>
        
        {/* Grid/Map View Toggle */}
        <div className="glass-l1" style={{ display: 'flex', gap: '2px', padding: '4px', borderRadius: '12px' }}>
          <button 
            onClick={() => setViewMode('grid')}
            className="btn"
            style={{
              padding: '8px 12px',
              fontSize: '0.8rem',
              borderRadius: '8px',
              background: viewMode === 'grid' ? 'rgba(59,130,246,0.15)' : 'transparent',
              borderColor: viewMode === 'grid' ? 'rgba(59,130,246,0.3)' : 'transparent',
              color: viewMode === 'grid' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <LayoutGrid size={14} />
            Card Grid
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className="btn"
            style={{
              padding: '8px 12px',
              fontSize: '0.8rem',
              borderRadius: '8px',
              background: viewMode === 'map' ? 'rgba(59,130,246,0.15)' : 'transparent',
              borderColor: viewMode === 'map' ? 'rgba(59,130,246,0.3)' : 'transparent',
              color: viewMode === 'map' ? 'white' : 'var(--text-secondary)'
            }}
          >
            <Map size={14} />
            Radar Map
          </button>
        </div>
      </div>

      {/* Filter and Search Bar — Liquid Glass */}
      <div className="glass-l2 reveal" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: isMobile ? 'wrap' : 'nowrap', position: 'relative', zIndex: 2 }}>
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search challenges by keywords, ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="glass-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--text-secondary)' }} />
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="form-select"
              style={{ padding: '10px 32px 10px 12px', fontSize: '0.85rem', width: '160px' }}
            >
              <option value="priority">Highest Priority</option>
              <option value="supported">Most Supported</option>
              <option value="newest">Recently Reported</option>
            </select>
          </div>
        </div>

        {/* Detailed filters row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', position: 'relative', zIndex: 2 }}>
          <select value={category} onChange={e => setCategory(e.target.value)} className="form-select" style={{ fontSize: '0.8rem', padding: '8px 10px' }}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select value={district} onChange={e => setDistrict(e.target.value)} className="form-select" style={{ fontSize: '0.8rem', padding: '8px 10px' }}>
            <option value="all">All Districts</option>
            {JHARKHAND_DISTRICTS.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>

          <select value={severity} onChange={e => setSeverity(e.target.value)} className="form-select" style={{ fontSize: '0.8rem', padding: '8px 10px' }}>
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select value={status} onChange={e => setStatus(e.target.value)} className="form-select" style={{ fontSize: '0.8rem', padding: '8px 10px' }}>
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="under_review">Under Review</option>
            <option value="validated">Validated</option>
            <option value="published">Published</option>
            <option value="team_formation">Team Formation</option>
            <option value="active_development">Active Development</option>
            <option value="prototype">Prototype</option>
            <option value="pilot">Pilot</option>
            <option value="implemented">Implemented</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <ChallengeMap onSelectChallenge={(id) => onNavigate(`challenge/${id}`)} />
      ) : (
        <div>
          {/* Active Items Counter */}
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Found <strong style={{ color: 'white' }}>{filteredChallenges.length}</strong> active challenges waiting for review.</span>
            {filteredChallenges.length === 0 && <span style={{ color: 'var(--danger)' }}>Adjust your filters.</span>}
          </div>

          {/* Grid Layout */}
          <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredChallenges.map(item => (
              <div key={item.id} className="glass-card" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                minHeight: '300px',
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', position: 'relative' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>ID: #{item.id}</span>
                    <span className="badge" style={{
                      background: `${getSeverityColor(item.severity)}12`,
                      color: getSeverityColor(item.severity),
                      border: `1px solid ${getSeverityColor(item.severity)}22`
                    }}>
                      {item.severity} severity
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '8px' }}>{item.title}</h3>
                  
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '14px', lineHeight: '1.4', position: 'relative' }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px', position: 'relative' }}>
                    {item.skills_required.map((skill, sIdx) => (
                      <span key={sIdx} style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} />
                      <span>{item.location}</span>
                    </div>
                    <div style={{ fontWeight: 700, color: getSeverityColor(item.severity) }}>
                      Priority: {item.priority_score}/100
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div>Supports: <strong style={{ color: 'white' }}>{item.support_count || 0}</strong></div>
                      <div>Status: <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{item.status.replace('_', ' ')}</strong></div>
                    </div>
                    <button 
                      onClick={() => onNavigate(`challenge/${item.id}`)} 
                      className="btn btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                    >
                      View Challenge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredChallenges.length === 0 && (
            <div className="glass-l2 reveal" style={{ padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '2.5rem' }}>📭</div>
              <h3 style={{ fontSize: '1.2rem', color: 'white' }}>No challenges match filters</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto', fontSize: '0.85rem' }}>
                We couldn't find any challenges matching your search query. Try choosing 'All Districts' or reporting a new one.
              </p>
              <button onClick={() => { setSearch(''); setCategory('all'); setDistrict('all'); setSeverity('all'); setStatus('all'); }} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                Reset Filters
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
