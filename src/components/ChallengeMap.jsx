import React, { useState } from 'react';
import { AlertCircle, MapPin, Eye, Filter } from 'lucide-react';

const MAP_MARKERS = [
  { id: 'monsoon-road-accessibility', title: 'Monsoon Rural Road Accessibility', district: 'Dumka', location: 'Sikaripara Block, Dumka', priority: 91, severity: 'high', population: 1800, status: 'prototype', x: 380, y: 150 },
  { id: 'water-pipeline-leakage', title: 'Water Pipeline Leakage Detection', district: 'Ranchi', location: 'Ward 14, Kokar, Ranchi', priority: 85, severity: 'high', population: 3200, status: 'team_formation', x: 200, y: 250 },
  { id: 'rural-drone-delivery', title: 'Medical Supply Drone Routing', district: 'Latehar', location: 'Mahuadanr Forests, Latehar', priority: 88, severity: 'critical', population: 5000, status: 'prototype', x: 120, y: 210 },
  { id: 'dhanbad-municipal-waste', title: 'Municipal Solid Waste Smart Bin Router', district: 'Dhanbad', location: 'Jharia Market, Dhanbad', priority: 72, severity: 'medium', population: 12000, status: 'implemented', x: 360, y: 230 },
  { id: 'agricultural-soil-nutrients', title: 'Agricultural Soil Nutrient Mapping', district: 'Hazaribagh', location: 'Chalkusa Block, Hazaribagh', priority: 64, severity: 'medium', population: 1200, status: 'pilot', x: 260, y: 160 }
];

export default function ChallengeMap({ onSelectChallenge }) {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredMarkers = MAP_MARKERS.filter(m => 
    filterSeverity === 'all' || m.severity === filterSeverity
  );

  const getMarkerColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ef4444'; // Red
      case 'high': return '#f97316';     // Orange
      case 'medium': return '#eab308';   // Yellow
      default: return '#10b981';         // Green
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px', minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>Live Challenge Hotspots</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click radar markers to view detailed challenge diagnostics.</p>
        </div>
        
        {/* Severity Filters */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          {['all', 'critical', 'high', 'medium'].map(sev => (
            <button 
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                borderRadius: '6px',
                background: filterSeverity === sev ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                borderColor: filterSeverity === sev ? 'var(--primary)' : 'transparent',
                color: filterSeverity === sev ? 'white' : 'var(--text-secondary)',
                textTransform: 'capitalize'
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0d16', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden', padding: '20px' }}>
        {/* SVG Tactical Vector Map of Jharkhand */}
        <svg viewBox="0 0 500 360" style={{ width: '100%', maxHeight: '380px', background: 'radial-gradient(circle, #0e1424 0%, #080a10 100%)' }}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Jharkhand Outline - stylized polygon */}
          <polygon 
            points="140,80 200,60 280,80 340,60 410,90 430,160 380,240 390,320 330,340 280,310 200,320 120,290 80,240 60,180 80,120 110,110"
            fill="rgba(59, 130, 246, 0.02)"
            stroke="rgba(59, 130, 246, 0.15)"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Connected network vectors */}
          <path 
            d="M 120,210 L 200,250 M 200,250 L 260,160 M 260,160 L 380,150 M 360,230 L 200,250 M 360,230 L 380,150"
            fill="none" 
            stroke="rgba(255, 255, 255, 0.04)" 
            strokeWidth="1.5" 
          />

          {/* District Labels */}
          <text x="200" y="275" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle" fontFamily="var(--font-display)">RANCHI HUB</text>
          <text x="380" y="135" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle" fontFamily="var(--font-display)">DUMKA</text>
          <text x="120" y="195" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle" fontFamily="var(--font-display)">LATEHAR FORESTS</text>
          <text x="360" y="250" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle" fontFamily="var(--font-display)">DHANBAD</text>
          <text x="260" y="145" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle" fontFamily="var(--font-display)">HAZARIBAGH</text>

          {/* Radar Hotspot Markers */}
          {filteredMarkers.map(m => {
            const color = getMarkerColor(m.severity);
            const isSelected = selectedMarker && selectedMarker.id === m.id;
            
            return (
              <g 
                key={m.id} 
                onClick={() => setSelectedMarker(isSelected ? null : m)}
                style={{ cursor: 'pointer' }}
              >
                {/* Glowing outward rings */}
                <circle cx={m.x} cy={m.y} r={14} fill="none" stroke={color} strokeWidth="1" opacity="0.3">
                  <animate attributeName="r" values="6;16;6" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                </circle>
                
                {/* Core radar dot */}
                <circle cx={m.x} cy={m.y} r={isSelected ? 6 : 4} fill={color} stroke="white" strokeWidth={isSelected ? 1.5 : 0} />
              </g>
            );
          })}
        </svg>

        {/* Hover/Click Popover details */}
        {selectedMarker && (
          <div className="fade-in" style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            left: '16px',
            background: 'rgba(14, 19, 32, 0.95)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${getMarkerColor(selectedMarker.severity)}88`,
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span className={`badge badge-${selectedMarker.severity}`} style={{ marginBottom: '6px' }}>
                  {selectedMarker.severity} severity
                </span>
                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>{selectedMarker.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <MapPin size={12} />
                  <span>{selectedMarker.location}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Priority</span>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: getMarkerColor(selectedMarker.severity) }}>
                  {selectedMarker.priority}/100
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginTop: '10px' }}>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div>Affected: <strong style={{ color: 'white' }}>{selectedMarker.population.toLocaleString()}</strong></div>
                <div>Status: <strong style={{ color: 'white', textTransform: 'capitalize' }}>{selectedMarker.status.replace('_', ' ')}</strong></div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setSelectedMarker(null)} 
                  className="btn" 
                  style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'transparent', borderColor: 'var(--border-subtle)' }}
                >
                  Close
                </button>
                <button 
                  onClick={() => onSelectChallenge(selectedMarker.id)} 
                  className="btn btn-primary" 
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  <Eye size={12} />
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
