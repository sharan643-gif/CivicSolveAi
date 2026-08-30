import React, { useState } from 'react';
import { Flame, AlertTriangle, ShieldCheck, MapPin, TrendingUp, Search, Eye, Filter } from 'lucide-react';
import { civicIntelligenceEngine, CIVIC_HOTSPOTS } from '../services/civicIntelligenceEngine';

export default function CivicHotspotMap({ onSelectHotspot }) {
  const [selectedHotspot, setSelectedHotspot] = useState(CIVIC_HOTSPOTS[0]);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = CIVIC_HOTSPOTS.filter(h => categoryFilter === 'all' || h.dominantCategory === categoryFilter);

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 800, fontSize: '0.78rem' }}>
            <Flame size={15} />
            <span>AI Hotspot & Systemic Failure Detection Engine</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Civic Hotspots & Chronic Infrastructure Failures
          </h2>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'Infrastructure', 'Water Management', 'Energy & Power', 'Healthcare & Sanitation'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: '4px 10px',
                borderRadius: '100px',
                border: categoryFilter === cat ? '1px solid #dc2626' : '1px solid var(--border-subtle)',
                background: categoryFilter === cat ? '#fef2f2' : '#ffffff',
                color: categoryFilter === cat ? '#dc2626' : 'var(--text-secondary)',
                fontSize: '0.72rem',
                fontWeight: categoryFilter === cat ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {cat === 'all' ? 'All Hotspots' : cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {filtered.map(hs => {
          const isSelected = selectedHotspot?.id === hs.id;
          return (
            <div
              key={hs.id}
              onClick={() => {
                setSelectedHotspot(hs);
                if (onSelectHotspot) onSelectHotspot(hs);
              }}
              style={{
                padding: '16px',
                borderRadius: '10px',
                background: isSelected ? 'rgba(220, 38, 38, 0.04)' : '#f8fafc',
                border: isSelected ? '2px solid #dc2626' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 800,
                    background: hs.riskLevel === 'critical' ? '#fee2e2' : '#fef3c7',
                    color: hs.riskLevel === 'critical' ? '#dc2626' : '#b45309'
                  }}
                >
                  🔥 {hs.repeatCount} Reported Failures
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{hs.ward}</span>
              </div>

              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {hs.name}
              </h3>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                {hs.systemicIssue}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '1px dashed var(--border-subtle)', paddingTop: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
                  ⚙️ {hs.status}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Preventive Flag Active
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
