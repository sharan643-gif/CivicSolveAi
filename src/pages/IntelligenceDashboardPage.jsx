import React, { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, FileText, MapPin, Clock, Zap, Shield } from 'lucide-react';
import { intelligenceService } from '../services/featureService';

export default function IntelligenceDashboardPage() {
  const data = intelligenceService.getData();
  const brief = intelligenceService.getWeeklyBrief();

  const sections = [
    { id: 'emerging', label: 'Emerging Problems', icon: TrendingUp, color: '#dc2626' },
    { id: 'hotspots', label: 'Hotspots', icon: MapPin, color: '#b45309' },
    { id: 'risks', label: 'Risk Predictions', icon: AlertTriangle, color: '#8b5cf6' },
    { id: 'actions', label: 'Recommended Actions', icon: Target, color: 'var(--primary)' },
    { id: 'impact', label: 'Impact Opportunities', icon: Lightbulb, color: '#10b981' },
    { id: 'brief', label: 'Weekly Brief', icon: FileText, color: '#06b6d4' },
  ];

  const [activeSection, setActiveSection] = useState('emerging');

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', border: '1px solid rgba(27,42,74,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 700 }}>
          <Brain size={13} color="var(--primary)" /> AI Civic Intelligence
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Civic Intelligence Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>AI-powered platform-wide analysis providing actionable insights for administrators.</p>
      </div>

      {/* Section Tabs */}
      <div className="reveal" style={{ display: 'flex', gap: '6px', padding: '4px', borderRadius: '12px', overflowX: 'auto', background: '#ffffff', border: '1px solid var(--border-subtle)', scrollbarWidth: 'none' }}>
        {sections.map(sec => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button 
              key={sec.id} 
              onClick={() => setActiveSection(sec.id)} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '9px 14px', 
                borderRadius: '8px', 
                border: 'none', 
                background: isActive ? 'var(--primary)' : 'transparent', 
                color: isActive ? '#ffffff' : 'var(--text-secondary)', 
                fontSize: '0.78rem', 
                fontWeight: isActive ? 700 : 500, 
                cursor: 'pointer', 
                whiteSpace: 'nowrap', 
                transition: 'all 0.15s ease' 
              }}
            >
              <Icon size={14} /> {sec.label}
            </button>
          );
        })}
      </div>

      {/* Emerging Problems */}
      {activeSection === 'emerging' && (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>🚨 Emerging Problems</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '4px' }}>Problems with rapidly increasing report frequency.</p>
          {data.emergingProblems.map((p, i) => (
            <div key={i} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', borderLeft: `4px solid ${p.severity === 'critical' ? '#ef4444' : p.severity === 'high' ? '#f97316' : '#eab308'}`, background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{p.title}</h4>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{p.category} · {p.trend}</div>
              </div>
              <span className={`badge badge-${p.severity}`}>{p.severity}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hotspots */}
      {activeSection === 'hotspots' && (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>📍 Geographic Hotspots</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '4px' }}>Locations experiencing multiple related problems.</p>
          {data.hotspots.map((h, i) => (
            <div key={i} className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{h.location}</h4>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{h.problems} related problems · ~{h.population.toLocaleString()} population affected</div>
              </div>
              <span className={`badge badge-${h.severity}`}>{h.severity}</span>
            </div>
          ))}
        </div>
      )}

      {/* Risk Predictions */}
      {activeSection === 'risks' && (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>⚠️ AI Risk Predictions</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '4px' }}>Potential problems likely to escalate based on pattern analysis.</p>
          {data.riskPredictions.map((r, i) => (
            <div key={i} className="glass-card" style={{ padding: '16px 20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.prediction}</h4>
                <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.25)' }}>{r.probability} probability</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.76rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span><Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Timeframe: {r.timeframe}</span>
                <span><Shield size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Impact: {r.impact}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Actions */}
      {activeSection === 'actions' && (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>🎯 AI Recommended Actions</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '4px' }}>Prioritized actions for administrators based on AI analysis.</p>
          {data.recommendedActions.map((a, i) => (
            <div key={i} className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{a.action}</h4>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Department: {a.department}</div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, background: a.priority === 'Critical' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: a.priority === 'Critical' ? '#dc2626' : '#b45309', border: `1px solid ${a.priority === 'Critical' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}` }}>
                {a.priority}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Impact Opportunities */}
      {activeSection === 'impact' && (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>💡 Impact Opportunities</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '4px' }}>Problems where intervention could create the highest social impact.</p>
          {data.impactOpportunities.map((o, i) => (
            <div key={i} className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{o.opportunity}</h4>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Impact: {o.impact} · Cost: {o.cost}</div>
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#047857' }}>{o.roi} ROI</span>
            </div>
          ))}
        </div>
      )}

      {/* Weekly Brief */}
      {activeSection === 'brief' && (
        <div className="glass-l2 reveal" style={{ padding: '24px 20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>📰 Weekly Civic Brief</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#dc2626', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Major Problems</h4>
              {brief.majorProblems.map((p, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fee2e2', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>• {p}</div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#047857', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Major Improvements</h4>
              {brief.majorImprovements.map((p, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: '6px', background: '#f0fdf4', border: '1px solid #dcfce7', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>• {p}</div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#b45309', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emerging Trends</h4>
              {brief.emergingTrends.map((p, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: '6px', background: '#fffbeb', border: '1px solid #fef3c7', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>• {p}</div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Priorities</h4>
              {brief.recommendedPriorities.map((p, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--primary-light)', border: '1px solid rgba(27,42,74,0.15)', marginBottom: '6px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>• {p}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
