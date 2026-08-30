import React, { useState } from 'react';
import { MapPin, Activity, ThumbsUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { civicIntelligenceEngine } from '../services/civicIntelligenceEngine';

export default function VoiceOfTheAreaCard({ defaultWard = 'Ward 14 (Upper Market)' }) {
  const [selectedWard, setSelectedWard] = useState(defaultWard);
  const data = civicIntelligenceEngine.getWardHealthReport(selectedWard);

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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.78rem' }}>
            <Activity size={15} />
            <span>"Voice of the Area" Locality Health Report</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Digital Ward Health Card: {data.wardName}
          </h2>
        </div>

        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            fontWeight: 700,
            outline: 'none',
            background: '#f8fafc'
          }}
        >
          <option value="Ward 14 (Upper Market)">Ward 14 (Upper Market)</option>
          <option value="Ward 22 (Kokar)">Ward 22 (Kokar)</option>
          <option value="Ward 31 (Kanke)">Ward 31 (Kanke)</option>
          <option value="Ward 08 (Doranda)">Ward 08 (Doranda)</option>
        </select>
      </div>

      {/* Metric Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
        <div style={{ padding: '12px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #dcfce7', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>{data.healthScore}/100</div>
          <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 600 }}>Health Score ({data.grade})</div>
        </div>

        <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>{data.resolvedThisMonth}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolved this Month</div>
        </div>

        <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0284c7' }}>{data.avgResolutionDays}d</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Resolution Time</div>
        </div>

        <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7c3aed' }}>{data.citizenSatisfaction}★</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Citizen Rating ({data.verifiedResolutionsPct}% verified)</div>
        </div>
      </div>

      {/* Breakdown */}
      <div>
        <h4 style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Top Problem Categories in this Locality:
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
          {data.topComplaints.map((c, i) => (
            <div key={i} style={{ padding: '8px 10px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span>{c.category}</span>
              <strong>{c.count} ({c.pct}%)</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
