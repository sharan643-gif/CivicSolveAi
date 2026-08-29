import React from 'react';
import { SECTORS } from '../services/mockData';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function AuthLandingPage({ onSelect, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '90px', width: '100%', opacity: 1, visibility: 'visible' }}>
      
      {/* Hero header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'var(--primary-light)', border: '1px solid rgba(0,48,135,0.2)', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
          <Sparkles size={12} />
          <span>Multi-Sector Gateway Hub</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Welcome to JanSetu AI
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Choose how you participate in solving real-world challenges. Each sector operates its own workflows, roles, and collaboration permissions.
        </p>
      </div>

      {/* Grid of 12 Sectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {SECTORS.map(sec => (
          <div 
            key={sec.id}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              minHeight: '200px',
              padding: '22px',
              cursor: 'pointer',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              borderLeft: sec.id === 'super_admin' ? '4px solid var(--accent)' : '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 48, 135, 0.12)';
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>{sec.icon}</span>
                <span style={{ fontSize: '0.65rem', color: sec.id === 'super_admin' ? 'var(--accent)' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {sec.id === 'super_admin' ? 'SYSTEM CORE' : 'SECTOR ACCESS'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 700 }}>{sec.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{sec.desc}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <span 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  fontSize: '0.8rem', 
                  color: 'var(--primary)',
                  fontWeight: 700
                }}
              >
                {sec.id === 'super_admin' ? 'Open Command Center' : `Continue as ${sec.name.split(' ')[0]}`}
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        Looking for administration tools? Select the <strong>Super Admin Center</strong> card to open the secure Command Center dashboard.
      </div>
    </div>
  );
}
