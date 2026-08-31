import React, { useState } from 'react';
import { SECTORS } from '../services/mockData';
import { ArrowRight, Sparkles, Search, Filter, ShieldCheck, User } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Sectors' },
  { id: 'public', label: 'Citizens & NGOs', sectors: ['citizen', 'ngo'] },
  { id: 'gov', label: 'Government', sectors: ['government'] },
  { id: 'academic', label: 'Universities & Students', sectors: ['university', 'student', 'research'] },
  { id: 'enterprise', label: 'Industry & Startups', sectors: ['industry', 'startup', 'incubator', 'funding'] },
  { id: 'admin', label: 'Administration', sectors: ['super_admin'] },
];

export default function AuthLandingPage({ onSelect, onBack }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSectors = SECTORS.filter(sec => {
    const matchesSearch = sec.name.toLowerCase().includes(search.toLowerCase()) || 
                          sec.desc.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;

    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    return cat ? cat.sectors.includes(sec.id) : true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '90px', width: '100%' }}>
      
      {/* Hero header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '8px', padding: '4px 14px', background: 'var(--primary-light)', border: '1px solid rgba(27,42,74,0.2)', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
          <Sparkles size={13} color="var(--primary)" />
          <span>Multi-Sector Gateway Hub</span>
        </div>
        
        <h1 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.3rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Choose Your Sector to Sign In
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
          CivicSolve AI connects citizens, government departments, universities, and innovators on a single unified platform. Select your portal to access specialized tools.
        </p>
      </div>

      {/* Search & Category Filter Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search sectors, portals, or roles..." 
            className="form-input" 
            style={{ width: '100%', padding: '11px 16px 11px 40px', borderRadius: '100px', border: '1px solid var(--border-medium)', background: '#ffffff', color: 'var(--text-primary)', fontSize: '0.88rem', boxShadow: 'var(--shadow-xs)' }}
          />
        </div>

        {/* Scrollable category pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                borderRadius: '100px',
                border: selectedCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: selectedCategory === cat.id ? 'var(--primary)' : '#ffffff',
                color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: selectedCategory === cat.id ? '0 2px 8px rgba(27,42,74, 0.2)' : 'var(--shadow-xs)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Sectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
        {filteredSectors.map(sec => (
          <div 
            key={sec.id}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              minHeight: '190px',
              padding: '20px',
              cursor: 'pointer',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              borderLeft: sec.id === 'super_admin' ? '4px solid var(--accent)' : '3px solid var(--primary)',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(27,42,74, 0.12)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = sec.id === 'super_admin' ? 'var(--accent)' : 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
              e.currentTarget.style.transform = 'none';
            }}
            onClick={() => onSelect(sec.id)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.8rem' }}>{sec.icon}</span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: sec.id === 'super_admin' ? 'var(--accent)' : 'var(--primary)', 
                  background: sec.id === 'super_admin' ? 'var(--accent-light)' : 'var(--primary-light)',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  textTransform: 'uppercase', 
                  fontWeight: 700 
                }}>
                  {sec.id === 'super_admin' ? 'RESTRICTED' : 'SECTOR ACCESS'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 700 }}>
                {sec.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {sec.desc}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <span 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  fontSize: '0.78rem', 
                  color: 'var(--primary)',
                  fontWeight: 700
                }}
              >
                {sec.id === 'super_admin' ? 'Open Command Center' : `Sign In as ${sec.name.split(' ')[0]}`}
                <ArrowRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
        Looking for administration tools? Select the <strong>Super Admin Center</strong> card to open the secure Command Center dashboard.
      </div>
    </div>
  );
}
