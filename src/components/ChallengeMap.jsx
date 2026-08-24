import React, { useState, useEffect } from 'react';
import { MapPin, Eye, Layers, Maximize2, Minimize2, ArrowLeft, Info, Users, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MAP_MARKERS = [
  { id: 'monsoon-road-accessibility', title: 'Monsoon Rural Road Accessibility', district: 'Dumka', location: 'Sikaripara Block, Dumka', priority: 91, severity: 'high', population: 1800, status: 'prototype', lat: 24.2548, lng: 87.4265, description: 'Village roads become impassable during heavy rainfall' },
  { id: 'water-pipeline-leakage', title: 'Water Pipeline Leakage Detection', district: 'Ranchi', location: 'Ward 14, Kokar, Ranchi', priority: 85, severity: 'high', population: 3200, status: 'team_formation', lat: 23.3768, lng: 85.3486, description: 'Major water distribution mainlines suffer from cracks' },
  { id: 'rural-drone-delivery', title: 'Medical Supply Drone Routing', district: 'Latehar', location: 'Mahuadanr Forests, Latehar', priority: 88, severity: 'critical', population: 5000, status: 'prototype', lat: 23.7448, lng: 84.4984, description: 'Remote forest villages lack medical supply access' },
  { id: 'dhanbad-municipal-waste', title: 'Municipal Solid Waste Smart Bin Router', district: 'Dhanbad', location: 'Jharia Market, Dhanbad', priority: 72, severity: 'medium', population: 12000, status: 'implemented', lat: 23.7957, lng: 86.4304, description: 'Smart waste collection routing for urban areas' },
  { id: 'agricultural-soil-nutrients', title: 'Agricultural Soil Nutrient Mapping', district: 'Hazaribagh', location: 'Chalkusa Block, Hazaribagh', priority: 64, severity: 'medium', population: 1200, status: 'pilot', lat: 23.9984, lng: 85.3604, description: 'IoT sensors for real-time soil health monitoring' },
];

const TILE_LAYERS = {
  dark: { name: 'Dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', icon: '🌙' },
  satellite: { name: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', icon: '🛰️' },
  terrain: { name: 'Terrain', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', icon: '🏔️' },
  streets: { name: 'Streets', url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', icon: '🛣️' },
};

const JHARKHAND_CENTER = [23.35, 85.33];
const JHARKHAND_BOUNDS = [[21.95, 83.30], [25.30, 87.95]];

function FitJharkhand() {
  const map = useMap();
  useEffect(() => { map.fitBounds(JHARKHAND_BOUNDS, { padding: [40, 40] }); }, [map]);
  return null;
}

function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      map.fitBounds(markers.map(m => [m.lat, m.lng]), { padding: [50, 50], maxZoom: 10 });
    }
  }, [markers, map]);
  return null;
}

export default function ChallengeMap({ onSelectChallenge, onBack }) {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tileLayer, setTileLayer] = useState('dark');
  const [showLayerPicker, setShowLayerPicker] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isFullscreen]);

  const filteredMarkers = MAP_MARKERS.filter(m => filterSeverity === 'all' || m.severity === filterSeverity);
  const getColor = (s) => s === 'critical' ? '#ef4444' : s === 'high' ? '#f97316' : s === 'medium' ? '#eab308' : '#10b981';
  const getRadius = (p) => p >= 85 ? 10 : p >= 70 ? 8 : 6;
  const currentTile = TILE_LAYERS[tileLayer];

  const layerPicker = (pos = 'right') => (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShowLayerPicker(!showLayerPicker)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.72rem' }}>
        {currentTile.icon} <Layers size={12} />
      </button>
      {showLayerPicker && (
        <div style={{ position: 'absolute', top: '34px', [pos]: 0, background: 'rgba(14,19,32,0.95)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '6px', zIndex: 100, minWidth: '140px' }}>
          {Object.entries(TILE_LAYERS).map(([key, layer]) => (
            <button key={key} onClick={() => { setTileLayer(key); setShowLayerPicker(false); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', padding: '6px 10px', borderRadius: '8px', border: 'none', background: tileLayer === key ? 'rgba(59,130,246,0.15)' : 'transparent', color: tileLayer === key ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'left' }}>
              <span>{layer.icon}</span><span>{layer.name}</span>
              {tileLayer === key && <span style={{ marginLeft: 'auto', color: '#3b82f6', fontSize: '0.65rem' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const filterBtns = (
    <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.03)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
      {['all', 'critical', 'high', 'medium'].map(sev => (
        <button key={sev} onClick={() => setFilterSeverity(sev)} style={{ padding: '4px 8px', fontSize: '0.68rem', borderRadius: '6px', border: 'none', background: filterSeverity === sev ? 'rgba(59,130,246,0.18)' : 'transparent', color: filterSeverity === sev ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', textTransform: 'capitalize', fontWeight: filterSeverity === sev ? 700 : 400, whiteSpace: 'nowrap' }}>
          {sev}
        </button>
      ))}
    </div>
  );

  const renderMarkers = () => filteredMarkers.map(marker => {
    const color = getColor(marker.severity);
    const isSelected = selectedMarker?.id === marker.id;
    return (
      <CircleMarker key={marker.id} center={[marker.lat, marker.lng]} radius={isSelected ? getRadius(marker.priority) + 3 : getRadius(marker.priority)} fillColor={color} fillOpacity={isSelected ? 0.8 : 0.55} color={isSelected ? '#fff' : color} weight={isSelected ? 2.5 : 1.5} eventHandlers={{ click: () => setSelectedMarker(isSelected ? null : marker) }}>
        <Popup closeButton={false} offset={[0, -10]}>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', minWidth: '220px', color: '#1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', flex: 1, paddingRight: '8px' }}>{marker.title}</div>
              <span style={{ padding: '2px 6px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, background: `${color}20`, color, border: `1px solid ${color}40` }}>{marker.severity}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>{marker.description}</div>
            <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>📍 {marker.location}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', fontSize: '12px', marginBottom: '8px' }}>
              <div>Priority: <strong>{marker.priority}/100</strong></div>
              <div>Affected: <strong>{marker.population.toLocaleString()}</strong></div>
              <div>Status: <strong style={{ textTransform: 'capitalize' }}>{marker.status.replace('_', ' ')}</strong></div>
              <div>District: <strong>{marker.district}</strong></div>
            </div>
            <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
              <button onClick={(e) => { e.stopPropagation(); setSelectedMarker(null); }} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #ddd', background: 'transparent', cursor: 'pointer', fontSize: '12px' }}>Close</button>
              <button onClick={(e) => { e.stopPropagation(); onSelectChallenge(marker.id); }} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>View Details →</button>
            </div>
          </div>
        </Popup>
      </CircleMarker>
    );
  });

  const mapComp = (h) => (
    <MapContainer center={JHARKHAND_CENTER} zoom={7} style={{ height: h, width: '100%', background: '#0a0d16' }} zoomControl={false} attributionControl={false}>
      <TileLayer key={tileLayer} url={currentTile.url} subdomains="abcd" maxZoom={19} />
      <ZoomControl position="bottomright" />
      <FitBounds markers={filteredMarkers} />
      {renderMarkers()}
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
            <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 800 }}>🗺️ Challenge Hotspots — Fullscreen</h3>
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
          {mapComp('100%')}
        </div>
      </div>
    );
  }

  // ─── Normal View ───────────────────────────────────────────────────────────
  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Back Button */}
      {onBack && (
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, alignSelf: 'flex-start' }}>
          <ArrowLeft size={14} /> Back to Explore
        </button>
      )}

      {/* Header */}
      <div>
        <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>Live Challenge Hotspots</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{currentTile.icon} {currentTile.name} View · {filteredMarkers.length} challenges across Jharkhand</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        {filterBtns}
        {layerPicker()}
        <button onClick={() => setShowDetails(!showDetails)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', background: showDetails ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: showDetails ? '#a78bfa' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.72rem' }}>
          <Info size={12} /> Details
        </button>
        <button onClick={() => setIsFullscreen(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, marginLeft: 'auto' }}>
          <Maximize2 size={12} /> Fullscreen
        </button>
      </div>

      {/* Map */}
      <div style={{ height: '380px', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        {mapComp('100%')}
      </div>

      {/* Selected Challenge Details */}
      {showDetails && selectedMarker && (
        <div className="glass-l1" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color={getColor(selectedMarker.severity)} />
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{selectedMarker.title}</h5>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedMarker.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '6px', background: 'rgba(59,130,246,0.06)' }}>
              <AlertTriangle size={12} color="#f59e0b" />
              <div><div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Priority</div><div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{selectedMarker.priority}/100</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '6px', background: 'rgba(16,185,129,0.06)' }}>
              <Users size={12} color="#10b981" />
              <div><div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Affected</div><div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{selectedMarker.population.toLocaleString()}</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '6px', background: 'rgba(139,92,246,0.06)' }}>
              <MapPin size={12} color="#8b5cf6" />
              <div><div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>District</div><div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{selectedMarker.district}</div></div>
            </div>
          </div>
        </div>
      )}

      {/* Challenge List */}
      {showDetails && !selectedMarker && (
        <div className="glass-l1" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Click a marker on the map to see details, or browse all challenges:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filteredMarkers.map(m => (
              <div key={m.id} onClick={() => setSelectedMarker(m)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getColor(m.severity), flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{m.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.district} · Priority {m.priority}</div>
                </div>
                <span className={`badge badge-${m.severity}`} style={{ fontSize: '0.6rem' }}>{m.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
