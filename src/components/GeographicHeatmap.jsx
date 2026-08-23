import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Layers, AlertCircle } from 'lucide-react';
import { JHARKHAND_DISTRICTS } from '../services/mockData';
import { getChallenges } from '../services/supabaseService';

export default function GeographicHeatmap() {
  const [selectedDistrict, setSelectedDistrict] = useState('Dumka');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    getChallenges().then(setChallenges);
  }, []);

  const districtData = {
    Dumka: { critical: 4, high: 12, medium: 18, population: '1.3M', activePilots: 2 },
    Ranchi: { critical: 6, high: 22, medium: 45, population: '2.9M', activePilots: 5 },
    Dhanbad: { critical: 3, high: 15, medium: 30, population: '2.6M', activePilots: 3 },
    Bokaro: { critical: 2, high: 9, medium: 21, population: '2.0M', activePilots: 1 },
    'East Singhbhum (Jamshedpur)': { critical: 5, high: 18, medium: 34, population: '2.3M', activePilots: 4 }
  };

  const curr = districtData[selectedDistrict] || { critical: 2, high: 5, medium: 10, population: '1.0M', activePilots: 1 };

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
            Jharkhand Geographic Challenge Heatmap
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Real-Time Density & Issue Distribution Map</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} className="form-select" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            {JHARKHAND_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Simulated Map Visual Box */}
      <div style={{ height: '260px', background: 'radial-gradient(ellipse at center, rgba(30,41,59,0.9), rgba(15,23,42,0.95))', border: '1px solid var(--border-subtle)', borderRadius: '12px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Decorative Grid Lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* Heatmap Pulsing Rings */}
        <div style={{ position: 'absolute', top: '35%', left: '42%', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(239,68,68,0.2)', border: '2px dashed rgba(239,68,68,0.6)', animation: 'pulse 2s infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 12px #ef4444' }} />
        </div>

        <div style={{ position: 'absolute', top: '55%', left: '60%', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
        </div>

        <div style={{ position: 'absolute', bottom: '25%', left: '25%', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.5)' }} />

        {/* Overlay Label */}
        <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'rgba(7,9,14,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: '8px', fontSize: '0.78rem', color: '#fff' }}>
          📍 Selected Region: <strong>{selectedDistrict} District</strong> · {curr.critical + curr.high + curr.medium} Active Issues
        </div>
      </div>

      {/* District Aggregated Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 700 }}>Critical Severity</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{curr.critical}</div>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700 }}>High Priority</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>{curr.high}</div>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>Active Pilots</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{curr.activePilots}</div>
        </div>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Est. Population</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{curr.population}</div>
        </div>
      </div>
    </div>
  );
}
