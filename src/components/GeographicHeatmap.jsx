import React, { useState, useEffect } from 'react';
import { MapPin, Layers, Maximize2, Minimize2, ArrowLeft, Info, Users, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from 'react-leaflet';
import { JHARKHAND_DISTRICTS } from '../services/mockData';
import { getChallenges } from '../services/supabaseService';
import 'leaflet/dist/leaflet.css';

// ─── Jharkhand District Coordinates ───────────────────────────────────────────
const DISTRICT_COORDS = {
  'Ranchi': [23.3441, 85.3096],
  'Dhanbad': [23.7957, 86.4304],
  'East Singhbhum (Jamshedpur)': [22.8046, 86.2029],
  'Bokaro': [23.6693, 86.1511],
  'Hazaribagh': [23.9984, 85.3604],
  'Dumka': [24.2646, 87.2396],
  'Deoghar': [24.4769, 86.6942],
  'Giridih': [24.1906, 86.3006],
  'Palamu': [23.8247, 84.0676],
  'West Singhbhum': [22.3596, 85.8174],
  'Latehar': [23.7448, 84.4984],
  'Khunti': [23.0746, 85.2799],
  'Gumla': [23.0443, 84.5397],
  'Simdega': [22.6174, 84.5000],
  'Lohardaga': [23.4335, 84.6794],
  'Ramgarh': [23.6333, 85.5167],
  'Chatra': [24.2068, 84.8718],
  'Koderma': [24.0387, 85.5398],
  'Godda': [24.8260, 87.2163],
  'Sahibganj': [25.2500, 87.6500],
  'Pakur': [24.6300, 87.8500],
  'Jamtara': [23.9625, 86.8417],
  'Garhwa': [24.1850, 83.8100],
  'Saraikela Kharsawan': [22.6950, 85.8250],
};

const DISTRICT_DATA = {
  'Ranchi': { critical: 6, high: 22, medium: 45, population: '2.9M', activePilots: 5, description: 'State capital and largest urban center' },
  'Dumka': { critical: 4, high: 12, medium: 18, population: '1.3M', activePilots: 2, description: 'Divisional headquarters, tribal belt' },
  'Dhanbad': { critical: 3, high: 15, medium: 30, population: '2.6M', activePilots: 3, description: 'Coal capital of India' },
  'Bokaro': { critical: 2, high: 9, medium: 21, population: '2.0M', activePilots: 1, description: 'Steel city, industrial hub' },
  'East Singhbhum (Jamshedpur)': { critical: 5, high: 18, medium: 34, population: '2.3M', activePilots: 4, description: 'Jamshedpur, Tata Steel city' },
  'Hazaribagh': { critical: 1, high: 7, medium: 15, population: '1.8M', activePilots: 1, description: 'Historic town, coal belt' },
  'Deoghar': { critical: 2, high: 8, medium: 12, population: '1.5M', activePilots: 1, description: 'Religious tourism center' },
  'Giridih': { critical: 1, high: 6, medium: 14, population: '2.4M', activePilots: 0, description: 'Mining and mica region' },
  'Latehar': { critical: 3, high: 10, medium: 8, population: '0.7M', activePilots: 2, description: 'Forest region, naxal-affected' },
  'Palamu': { critical: 2, high: 7, medium: 11, population: '1.0M', activePilots: 1, description: 'Daltongad, wildlife sanctuary' },
};

const TILE_LAYERS = {
  dark: { name: 'Dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', icon: '🌙' },
  satellite: { name: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', icon: '🛰️' },
  terrain: { name: 'Terrain', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', icon: '🏔️' },
  streets: { name: 'Streets', url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', icon: '🛣️' },
};

// ─── Jharkhand center point ──────────────────────────────────────────────────
const JHARKHAND_CENTER = [23.35, 85.33];
const JHARKHAND_BOUNDS = [[21.95, 83.30], [25.30, 87.95]];

function CenterOnDistrict({ coords, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, zoom || 9, { animate: true, duration: 0.5 });
    }
  }, [coords, zoom, map]);
  return null;
}

function FitJharkhand() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(JHARKHAND_BOUNDS, { padding: [30, 30] });
  }, [map]);
  return null;
}

export default function GeographicHeatmap({ onBack }) {
  const [selectedDistrict, setSelectedDistrict] = useState('Ranchi');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [challenges, setChallenges] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tileLayer, setTileLayer] = useState('dark');
  const [showLayerPicker, setShowLayerPicker] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => { getChallenges().then(setChallenges); }, []);
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isFullscreen]);

  const curr = DISTRICT_DATA[selectedDistrict] || { critical: 2, high: 5, medium: 10, population: '1.0M', activePilots: 1, description: '' };
  const center = DISTRICT_COORDS[selectedDistrict] || JHARKHAND_CENTER;

  const districtMarkers = Object.entries(DISTRICT_COORDS).map(([name, coords]) => {
    const data = DISTRICT_DATA[name] || { critical: 1, high: 3, medium: 5, population: '1.0M', activePilots: 0, description: '' };
    return { name, coords, data, totalIssues: data.critical + data.high + data.medium };
  });

  const filteredMarkers = districtMarkers.filter(m => {
    if (severityFilter === 'all') return true;
    if (severityFilter === 'critical') return m.data.critical > 0;
    if (severityFilter === 'high') return m.data.high > 0;
    if (severityFilter === 'medium') return m.data.medium > 0;
    return true;
  });

  const getRadius = (total) => Math.max(6, Math.min(22, total * 0.7));
  const getColor = (data) => {
    if (data.critical > data.high && data.critical > data.medium) return '#ef4444';
    if (data.high >= data.medium) return '#f59e0b';
    return '#10b981';
  };
  const currentTile = TILE_LAYERS[tileLayer];
  const totalIssues = curr.critical + curr.high + curr.medium;

  const layerPicker = (pos = 'right') => (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowLayerPicker(!showLayerPicker)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem' }}>
        {currentTile.icon} <Layers size={12} />
      </button>
      {showLayerPicker && (
        <div style={{ position: 'absolute', top: '36px', [pos]: 0, background: 'rgba(14,19,32,0.95)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '6px', zIndex: 100, minWidth: '150px' }}>
          {Object.entries(TILE_LAYERS).map(([key, layer]) => (
            <button key={key} onClick={() => { setTileLayer(key); setShowLayerPicker(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '7px 10px', borderRadius: '8px', border: 'none', background: tileLayer === key ? 'rgba(59,130,246,0.15)' : 'transparent', color: tileLayer === key ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', textAlign: 'left' }}>
              <span>{layer.icon}</span><span>{layer.name}</span>
              {tileLayer === key && <span style={{ marginLeft: 'auto', color: '#3b82f6', fontSize: '0.7rem' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const filterBtns = (
    <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
      {['all', 'critical', 'high', 'medium'].map(sev => (
        <button key={sev} onClick={() => setSeverityFilter(sev)} style={{ padding: '5px 8px', fontSize: '0.68rem', borderRadius: '6px', border: 'none', background: severityFilter === sev ? 'rgba(59,130,246,0.2)' : 'transparent', color: severityFilter === sev ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', textTransform: 'capitalize', fontWeight: severityFilter === sev ? 700 : 400, whiteSpace: 'nowrap' }}>
          {sev}
        </button>
      ))}
    </div>
  );

  const mapComponent = (height) => (
    <MapContainer center={JHARKHAND_CENTER} zoom={7} style={{ height, width: '100%', background: '#0a0d16' }} zoomControl={false} attributionControl={false}>
      <TileLayer key={tileLayer} url={currentTile.url} subdomains="abcd" maxZoom={19} />
      <ZoomControl position="bottomright" />
      <FitJharkhand />
      <CenterOnDistrict coords={center} zoom={9} />
      {filteredMarkers.map(district => {
        const isSelected = district.name === selectedDistrict;
        const color = getColor(district.data);
        return (
          <CircleMarker key={district.name} center={district.coords} radius={isSelected ? getRadius(district.totalIssues) + 3 : getRadius(district.totalIssues)} fillColor={color} fillOpacity={isSelected ? 0.75 : 0.45} color={isSelected ? '#fff' : color} weight={isSelected ? 2.5 : 1.5} eventHandlers={{ click: () => setSelectedDistrict(district.name) }}>
            <Popup closeButton={false} offset={[0, -8]}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', minWidth: '200px', color: '#1e293b' }}>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{district.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>{district.data.description}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', fontSize: '12px' }}>
                  <div style={{ color: '#ef4444' }}>🔴 Critical: {district.data.critical}</div>
                  <div style={{ color: '#f59e0b' }}>🟠 High: {district.data.high}</div>
                  <div style={{ color: '#eab308' }}>🟡 Medium: {district.data.medium}</div>
                  <div style={{ color: '#10b981' }}>🚀 Pilots: {district.data.activePilots}</div>
                </div>
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
                  Pop: {district.data.population} · {district.totalIssues} total issues
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
      <style>{`
        .leaflet-popup-content-wrapper { background: rgba(255,255,255,0.98) !important; border-radius: 12px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important; }
        .leaflet-popup-content { margin: 10px 12px !important; line-height: 1.4 !important; }
        .leaflet-popup-tip { background: rgba(255,255,255,0.98) !important; }
        .leaflet-control-zoom a { background: rgba(14,19,32,0.85) !important; color: white !important; border-color: rgba(255,255,255,0.1) !important; }
        .leaflet-control-zoom { border: none !important; }
        .leaflet-control-attribution { display: none !important; }
      `}</style>
    </MapContainer>
  );

  // ─── Fullscreen ────────────────────────────────────────────────────────────
  if (isFullscreen) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', padding: '12px', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>🗺️ Jharkhand Heatmap — Fullscreen</h4>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ESC to exit</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {filterBtns}
            {layerPicker()}
            <button onClick={() => setIsFullscreen(false)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
              <Minimize2 size={13} /> Exit
            </button>
          </div>
        </div>
        <div style={{ flex: 1, borderRadius: '14px', border: '1px solid var(--border-subtle)', overflow: 'hidden', minHeight: 0 }}>
          {mapComponent('100%')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', flexShrink: 0 }}>
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 700 }}>Critical</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>{curr.critical}</div>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700 }}>High</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{curr.high}</div>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>Pilots</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{curr.activePilots}</div>
          </div>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Population</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{curr.population}</div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Normal View ───────────────────────────────────────────────────────────
  return (
    <div className="glass-l2" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Back Button */}
      {onBack && (
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, alignSelf: 'flex-start', transition: 'all 0.2s ease' }}>
          <ArrowLeft size={14} /> Back to Command Center
        </button>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
            Jharkhand Geographic Challenge Heatmap
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {currentTile.icon} {currentTile.name} View · Real-time issue distribution across 24 districts
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {filterBtns}
        {layerPicker()}
        <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} className="form-select" style={{ fontSize: '0.78rem', padding: '5px 8px', minWidth: '120px' }}>
          {JHARKHAND_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={() => setShowDetails(!showDetails)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', background: showDetails ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: showDetails ? '#a78bfa' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.72rem' }}>
          <Info size={12} /> Details
        </button>
        <button onClick={() => setIsFullscreen(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, marginLeft: 'auto' }}>
          <Maximize2 size={12} /> Fullscreen
        </button>
      </div>

      {/* Map */}
      <div style={{ height: '400px', borderRadius: '14px', border: '1px solid var(--border-subtle)', overflow: 'hidden', position: 'relative' }}>
        {mapComponent('100%')}
        {/* Overlay label */}
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(7,9,14,0.88)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-subtle)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', color: '#fff', zIndex: 1000, pointerEvents: 'none' }}>
          📍 <strong>{selectedDistrict}</strong> · {totalIssues} issues · {curr.description}
        </div>
      </div>

      {/* Selected District Details */}
      {showDetails && (
        <div className="glass-l1" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="#3b82f6" />
            <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{selectedDistrict} District</h5>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>· {curr.description}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.06)' }}>
              <AlertTriangle size={14} color="#ef4444" />
              <div><div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Critical</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444' }}>{curr.critical}</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(245,158,11,0.06)' }}>
              <AlertTriangle size={14} color="#f59e0b" />
              <div><div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>High</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b' }}>{curr.high}</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(234,179,8,0.06)' }}>
              <AlertTriangle size={14} color="#eab308" />
              <div><div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Medium</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#eab308' }}>{curr.medium}</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(16,185,129,0.06)' }}>
              <Users size={14} color="#10b981" />
              <div><div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Population</div><div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>{curr.population}</div></div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 700 }}>Critical</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444' }}>{curr.critical}</div>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 700 }}>High</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>{curr.high}</div>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>Pilots</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>{curr.activePilots}</div>
        </div>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Population</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{curr.population}</div>
        </div>
      </div>
    </div>
  );
}
