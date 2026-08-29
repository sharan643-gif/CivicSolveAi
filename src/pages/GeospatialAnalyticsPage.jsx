import React, { useState } from 'react';
import { Map, TrendingUp, AlertTriangle, Users, DollarSign, Clock, CheckCircle, Target, Globe, ChevronRight } from 'lucide-react';
import { trendForecastingService, geospatialHeatmapService, geographicComparisonService, impactROIService } from '../services/advanced40Service';

export default function GeospatialAnalyticsPage() {
  const [view, setView] = useState('trends');
  const trends = trendForecastingService.getData();
  const heatmap = geospatialHeatmapService.getData();
  const geoComp = geographicComparisonService.getData();
  const impactROI = impactROIService.getData();

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#047857', marginBottom: '8px', fontWeight: 700 }}>
          <Map size={13} color="#047857" /> Geospatial Analytics
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Civic Intelligence Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Heatmaps, trend forecasting, geographic comparison, and social impact ROI.</p>
      </div>

      <div className="filter-row-mobile" style={{ display: 'flex', gap: '4px', background: '#ffffff', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)', width: 'fit-content', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[
          { id: 'trends', label: 'Trends' },
          { id: 'heatmap', label: 'Heatmap' },
          { id: 'comparison', label: 'Geographic' },
          { id: 'roi', label: 'Impact ROI' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: view === v.id ? 'var(--primary)' : 'transparent', color: view === v.id ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: view === v.id ? 700 : 500, transition: 'all 0.15s ease' }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Trend Forecasting */}
      {view === 'trends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}><TrendingUp size={16} color="#047857" /> Monthly Trend Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px' }}>
              {trends.monthly.map(m => (
                <div key={m.month} style={{ textAlign: 'center', padding: '10px 4px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>{m.month}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: `${(m.resolved / 50) * 36}px`, background: '#10b981', borderRadius: '3px', minHeight: '4px' }} />
                    <div style={{ width: '100%', height: `${((m.reported - m.resolved) / 50) * 36}px`, background: '#ef4444', borderRadius: '3px', minHeight: '4px', opacity: 0.8 }} />
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 600 }}>{m.reported}↑ {m.resolved}↓</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '14px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ef4444' }} /> Reported</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981' }} /> Resolved</span>
            </div>
          </div>

          {/* AI Forecast */}
          <div className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>🔮 AI Forecast</h3>
            {trends.forecast.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>{f.month}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '8px', fontWeight: 500 }}>Confidence: {f.confidence}%</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>~{f.predicted}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>predicted reports</div>
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>📊 Key Insights</h3>
            {trends.insights.map((insight, i) => (
              <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-primary)', padding: '10px 14px', borderRadius: '6px', background: 'var(--primary-light)', borderLeft: '4px solid var(--primary)', marginBottom: '8px', lineHeight: 1.5 }}>
                {insight}
              </div>
            ))}
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '8px' }}>
              ⚠️ Forecasts are based on historical data patterns and have inherent limitations. Use as guidance, not definitive predictions.
            </p>
          </div>
        </div>
      )}

      {/* Heatmap */}
      {view === 'heatmap' && (
        <div className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '14px', fontWeight: 700 }}>🔥 Civic Issue Heatmap</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {heatmap.map((point, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: '10px', background: point.intensity > 0.7 ? '#fef2f2' : point.intensity > 0.4 ? '#fffbeb' : '#f0fdf4', border: `1px solid ${point.intensity > 0.7 ? '#fecaca' : point.intensity > 0.4 ? '#fde68a' : '#bbf7d0'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 700 }}>{point.district}</span>
                  <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, background: point.intensity > 0.7 ? '#dc2626' : point.intensity > 0.4 ? '#d97706' : '#059669', color: '#ffffff' }}>
                    {point.intensity > 0.7 ? 'Critical' : point.intensity > 0.4 ? 'Moderate' : 'Low'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{point.count} issues · {point.category}</div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '4px', borderRadius: '2px', background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${point.intensity * 100}%`, background: point.intensity > 0.7 ? '#ef4444' : point.intensity > 0.4 ? '#f59e0b' : '#10b981', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Geographic Comparison */}
      {view === 'comparison' && (
        <div className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}><Globe size={16} color="#047857" /> District Comparison</h3>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(5, 1fr)', gap: '1px', background: 'var(--border-subtle)', borderRadius: '8px', overflow: 'hidden', minWidth: '600px' }}>
              {/* Header */}
              {['District', 'Reported', 'Resolved', 'Avg Days', 'Satisfaction', 'Participation'].map((h, i) => (
                <div key={i} style={{ padding: '10px 12px', background: 'var(--primary)', fontSize: '0.75rem', color: '#ffffff', fontWeight: 700, textTransform: 'uppercase' }}>{h}</div>
              ))}
              {/* Rows */}
              {geoComp.map((d, i) => (
                <React.Fragment key={i}>
                  <div style={{ padding: '10px 12px', background: '#ffffff', fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 700 }}>{d.district}</div>
                  <div style={{ padding: '10px 12px', background: '#ffffff', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{d.reported}</div>
                  <div style={{ padding: '10px 12px', background: '#ffffff', fontSize: '0.82rem', color: '#047857', fontWeight: 700 }}>{d.resolved}</div>
                  <div style={{ padding: '10px 12px', background: '#ffffff', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{d.avgDays}d</div>
                  <div style={{ padding: '10px 12px', background: '#ffffff', fontSize: '0.82rem', color: d.satisfaction >= 4 ? '#047857' : '#b45309', fontWeight: 600 }}>⭐ {d.satisfaction}</div>
                  <div style={{ padding: '10px 12px', background: '#ffffff', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{d.participation.toLocaleString()}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Impact ROI */}
      {view === 'roi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {impactROI.map(roi => (
            <div key={roi.projectId} className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>{roi.title}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                {[
                  { label: 'Investment', value: `₹${(roi.investment / 1000).toFixed(0)}K`, color: '#b45309', icon: <DollarSign size={14} /> },
                  { label: 'Citizens Benefited', value: roi.citizensBenefited.toLocaleString(), color: '#047857', icon: <Users size={14} /> },
                  { label: 'Cost per Citizen', value: `₹${roi.costPerCitizen}`, color: '#003087', icon: <Target size={14} /> },
                  { label: 'Time Saved', value: `${roi.estimatedTimeSaved} hrs`, color: '#7c3aed', icon: <Clock size={14} /> },
                  { label: 'Resources Saved', value: `₹${(roi.resourcesSaved / 1000).toFixed(0)}K`, color: '#0284c7', icon: <CheckCircle size={14} /> },
                ].map((m, i) => (
                  <div key={i} style={{ padding: '12px 8px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ color: m.color, marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{m.icon}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{m.value}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 700 }}>🌍 Environmental Impact: </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{roi.environmentalImpact}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
