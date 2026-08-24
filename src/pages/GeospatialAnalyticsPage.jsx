import React, { useState } from 'react';
import { Map, TrendingUp, BarChart3, Globe, DollarSign, ArrowUpRight, ArrowDownRight, Minus, Target, Users, CheckCircle, Clock } from 'lucide-react';
import { heatmapService, trendService, geoComparisonService, impactROIService } from '../services/advanced40Service';

function MiniBarChart({ data, maxVal, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '40px' }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, height: `${(val / maxVal) * 100}%`, background: color, borderRadius: '2px', opacity: 0.7, transition: 'height 0.3s ease' }} />
      ))}
    </div>
  );
}

export default function GeospatialAnalyticsPage() {
  const [view, setView] = useState('trends');
  const heatmap = heatmapService.getData();
  const trends = trendService.getData();
  const geoComp = geoComparisonService.getData();
  const impactROI = impactROIService.getData();

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#34d399', marginBottom: '8px' }}>
          <Map size={12} /> Geospatial Analytics
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Civic Intelligence Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Heatmaps, trend forecasting, geographic comparison, and impact ROI.</p>
      </div>

      <div className="filter-row-mobile" style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
        {[
          { id: 'trends', label: 'Trends' },
          { id: 'heatmap', label: 'Heatmap' },
          { id: 'comparison', label: 'Geographic' },
          { id: 'roi', label: 'Impact ROI' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: view === v.id ? 'rgba(16,185,129,0.15)' : 'transparent', color: view === v.id ? '#34d399' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: view === v.id ? 700 : 400 }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Trend Forecasting */}
      {view === 'trends' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={16} color="#34d399" /> Monthly Trend Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px' }}>
              {trends.monthly.map(m => (
                <div key={m.month} style={{ textAlign: 'center', padding: '10px 4px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{m.month}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: `${(m.resolved / 50) * 40}px`, background: '#10b981', borderRadius: '3px', opacity: 0.7 }} />
                    <div style={{ width: '100%', height: `${((m.reported - m.resolved) / 50) * 40}px`, background: '#ef4444', borderRadius: '3px', opacity: 0.5 }} />
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>{m.reported}↑ {m.resolved}↓</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ef4444', opacity: 0.5 }} /> Reported</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981', opacity: 0.7 }} /> Resolved</span>
            </div>
          </div>

          {/* AI Forecast */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '12px' }}>🔮 AI Forecast</h3>
            {trends.forecast.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', marginBottom: '6px' }}>
                <div>
                  <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{f.month}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '8px' }}>Confidence: {f.confidence}%</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#3b82f6' }}>~{f.predicted}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>predicted reports</div>
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '12px' }}>📊 Key Insights</h3>
            {trends.insights.map((insight, i) => (
              <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: '6px', background: 'rgba(59,130,246,0.06)', borderLeft: '3px solid #3b82f6', marginBottom: '6px' }}>
                {insight}
              </div>
            ))}
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '8px' }}>
              ⚠️ Forecasts are based on historical data patterns and have inherent limitations. Use as guidance, not definitive predictions.
            </p>
          </div>
        </div>
      )}

      {/* Heatmap */}
      {view === 'heatmap' && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '16px' }}>🔥 Civic Issue Heatmap</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {heatmap.map((point, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '10px', background: `rgba(${point.intensity > 0.7 ? '239,68,68' : point.intensity > 0.4 ? '245,158,11' : '16,185,129'},0.08)`, border: `1px solid rgba(${point.intensity > 0.7 ? '239,68,68' : point.intensity > 0.4 ? '245,158,11' : '16,185,129'},0.2)` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{point.district}</span>
                  <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '100px', background: `${point.intensity > 0.7 ? '#ef4444' : point.intensity > 0.4 ? '#f59e0b' : '#10b981'}20`, color: point.intensity > 0.7 ? '#ef4444' : point.intensity > 0.4 ? '#f59e0b' : '#10b981' }}>
                    {point.intensity > 0.7 ? 'Critical' : point.intensity > 0.4 ? 'Moderate' : 'Low'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{point.count} issues · {point.category}</div>
                <div style={{ marginTop: '6px' }}>
                  <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
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
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={16} color="#34d399" /> District Comparison</h3>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(5, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', overflow: 'hidden', minWidth: '600px' }}>
              {/* Header */}
              {['District', 'Reported', 'Resolved', 'Avg Days', 'Satisfaction', 'Participation'].map((h, i) => (
                <div key={i} style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.3)', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{h}</div>
              ))}
              {/* Rows */}
              {geoComp.map((d, i) => (
                <React.Fragment key={i}>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{d.district}</div>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{d.reported}</div>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', fontSize: '0.82rem', color: '#10b981' }}>{d.resolved}</div>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{d.avgDays}d</div>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', fontSize: '0.82rem', color: d.satisfaction >= 4 ? '#10b981' : d.satisfaction >= 3.5 ? '#f59e0b' : '#ef4444' }}>⭐ {d.satisfaction}</div>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{d.participation.toLocaleString()}</div>
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
            <div key={roi.projectId} className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '12px' }}>{roi.title}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                {[
                  { label: 'Investment', value: `₹${(roi.investment / 1000).toFixed(0)}K`, color: '#f59e0b', icon: <DollarSign size={14} /> },
                  { label: 'Citizens Benefited', value: roi.citizensBenefited.toLocaleString(), color: '#10b981', icon: <Users size={14} /> },
                  { label: 'Cost per Citizen', value: `₹${roi.costPerCitizen}`, color: '#3b82f6', icon: <Target size={14} /> },
                  { label: 'Time Saved', value: `${roi.estimatedTimeSaved} hrs`, color: '#8b5cf6', icon: <Clock size={14} /> },
                  { label: 'Resources Saved', value: `₹${(roi.resourcesSaved / 1000).toFixed(0)}K`, color: '#06b6d4', icon: <CheckCircle size={14} /> },
                ].map((m, i) => (
                  <div key={i} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                    <div style={{ color: m.color, marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{m.icon}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{m.value}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                <span style={{ fontSize: '0.82rem', color: '#34d399' }}>🌍 Environmental Impact: </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{roi.environmentalImpact}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


