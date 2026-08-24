import React, { useState } from 'react';
import { ShieldAlert, MapPin, Layers, Clock, AlertTriangle, GitMerge, CheckCircle, BarChart3 } from 'lucide-react';
import GeographicHeatmap from '../components/GeographicHeatmap';
import SlaTracker from '../components/SlaTracker';
import { JHARKHAND_DISTRICTS } from '../services/mockData';

export default function CommandCenterPage() {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [stateName, setStateName] = useState('Jharkhand');
  const [district, setDistrict] = useState('Dumka');
  const [block, setBlock] = useState('Sikaripara Block');
  const [village, setVillage] = useState('All Villages');

  const clusters = [
    { id: 'cl-1042', name: 'Monsoon Infrastructure Degradation', reportsCount: 43, locationsCount: 7, affectedPop: 3120, evidenceCount: 12, status: 'Active Cluster' },
    { id: 'cl-1088', name: 'Urban Mainline Water Contamination', reportsCount: 28, locationsCount: 4, affectedPop: 4500, evidenceCount: 8, status: 'Under Investigation' }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Emergency Mode Banner Header */}
      {emergencyMode && (
        <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(220,38,38,0.4))', border: '2px solid #ef4444', borderRadius: '16px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 0 40px rgba(239,68,68,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', background: '#ef4444', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px', animation: 'pulse 1s infinite' }}>
              🚨
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>
                EMERGENCY DISASTER MODE ACTIVE
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#fca5a5' }}>
                Priority Escalation Active · Fast-Track Validation Enabled · Emergency Response Teams Notified
              </p>
            </div>
          </div>
          <button onClick={() => setEmergencyMode(false)} className="btn" style={{ background: '#fff', color: '#dc2626', fontWeight: 800, padding: '10px 20px', borderRadius: '8px' }}>
            Deactivate Emergency Mode
          </button>
        </div>
      )}

      {/* Page Title & Emergency Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#60a5fa', marginBottom: '8px' }}>
            <ShieldAlert size={12} /> National & District Command Operations
          </div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
            District Command Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Geographic monitoring, cluster management, SLA tracking, and emergency priority escalation.
          </p>
        </div>

        {!emergencyMode && (
          <button onClick={() => setEmergencyMode(true)} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontWeight: 700, padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            🚨 Trigger Emergency Mode
          </button>
        )}
      </div>

      {/* State → District → Block → Village Administrative Drilldown */}
      <div className="glass-l2" style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block' }}>State</label>
          <select value={stateName} onChange={e => setStateName(e.target.value)} className="form-select" style={{ padding: '8px' }}>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Bihar">Bihar</option>
            <option value="Odisha">Odisha</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block' }}>District</label>
          <select value={district} onChange={e => setDistrict(e.target.value)} className="form-select" style={{ padding: '8px' }}>
            {JHARKHAND_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block' }}>Block</label>
          <select value={block} onChange={e => setBlock(e.target.value)} className="form-select" style={{ padding: '8px' }}>
            <option value="Sikaripara Block">Sikaripara Block</option>
            <option value="Dumka Sadar">Dumka Sadar</option>
            <option value="Ranishwar">Ranishwar</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'block' }}>Village / Ward</label>
          <select value={village} onChange={e => setVillage(e.target.value)} className="form-select" style={{ padding: '8px' }}>
            <option value="All Villages">All Villages (12)</option>
            <option value="Pattabari Village">Pattabari Village</option>
            <option value="Asanboni">Asanboni</option>
          </select>
        </div>
      </div>

      {/* Map Heatmap & SLA Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        <GeographicHeatmap />
        <SlaTracker />
      </div>

      {/* Challenge Clusters Section */}
      <div className="glass-l2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitMerge size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
              Regional Challenge Clusters (#1042)
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grouped by AI Semantic Similarity</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {clusters.map(cl => (
            <div key={cl.id} className="glass-l1" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontFamily: 'monospace' }}>{cl.id}</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{cl.name}</h4>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '16px' }}>
                  <span>📊 {cl.reportsCount} Individual Reports</span>
                  <span>📍 {cl.locationsCount} Village Locations</span>
                  <span>👥 ~{cl.affectedPop.toLocaleString()} Affected Residents</span>
                  <span>📁 {cl.evidenceCount} Evidence Files</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => alert(`Cluster ${cl.id} merged into master regional issue.`)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                  Merge Reports
                </button>
                <button onClick={() => alert(`Department assigned to ${cl.id}.`)} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                  Assign Dept →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
