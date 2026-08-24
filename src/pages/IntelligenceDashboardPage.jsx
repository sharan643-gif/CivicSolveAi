import React, { useState } from 'react';
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, FileText, MapPin, Clock, Zap, Shield } from 'lucide-react';
import { intelligenceService } from '../services/featureService';

export default function IntelligenceDashboardPage() {
  const data = intelligenceService.getData();
  const brief = intelligenceService.getWeeklyBrief();

  const sections = [
    { id: 'emerging', label: 'Emerging Problems', icon: TrendingUp, color: '#ef4444' },
    { id: 'hotspots', label: 'Hotspots', icon: MapPin, color: '#f59e0b' },
    { id: 'risks', label: 'Risk Predictions', icon: AlertTriangle, color: '#8b5cf6' },
    { id: 'actions', label: 'Recommended Actions', icon: Target, color: '#3b82f6' },
    { id: 'impact', label: 'Impact Opportunities', icon: Lightbulb, color: '#10b981' },
    { id: 'brief', label: 'Weekly Brief', icon: FileText, color: '#06b6d4' },
  ];

  const [activeSection, setActiveSection] = useState('emerging');

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))', border: '1px solid rgba(139,92,246,0.25)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#a78bfa', marginBottom: '8px' }}>
          <Brain size={12} /> AI Civic Intelligence
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Civic Intelligence Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>AI-powered platform-wide analysis providing actionable insights for administrators.</p>
      </div>

      {/* Section Tabs */}
      <div className="glass-l1 reveal" style={{ display: 'flex', gap: '4px', padding: '6px', borderRadius: '14px', overflowX: 'auto' }}>
        {sections.map(sec => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button key={sec.id} onClick={() => setActiveSection(sec.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '10px', border: 'none', background: isActive ? `${sec.color}18` : 'transparent', color: isActive ? sec.color : 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease' }}>
              <Icon size={14} /> {sec.label}
            </button>
          );
        })}
      </div>

      {/* Emerging Problems */}
      {activeSection === 'emerging' && (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>🚨 Emerging Problems</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Problems with rapidly increasing report frequency.</p>
          {data.emergingProblems.map((p, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: `3px solid ${p.severity === 'critical' ? '#ef4444' : p.severity === 'high' ? '#f97316' : '#eab308'}` }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{p.title}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{p.category} · {p.trend}</div>
              </div>
              <span className={`badge badge-${p.severity}`}>{p.severity}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hotspots */}
      {activeSection === 'hotspots' && (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>📍 Geographic Hotspots</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Locations experiencing multiple related problems.</p>
          {data.hotspots.map((h, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{h.location}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{h.problems} related problems · ~{h.population.toLocaleString()} population affected</div>
              </div>
              <span className={`badge badge-${h.severity}`}>{h.severity}</span>
            </div>
          ))}
        </div>
      )}

      {/* Risk Predictions */}
      {activeSection === 'risks' && (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>⚠️ AI Risk Predictions</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Potential problems likely to escalate based on pattern analysis.</p>
          {data.riskPredictions.map((r, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{r.prediction}</h4>
                <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>{r.probability} probability</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span><Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Timeframe: {r.timeframe}</span>
                <span><Shield size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Impact: {r.impact}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Actions */}
      {activeSection === 'actions' && (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>🎯 AI Recommended Actions</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Prioritized actions for administrators based on AI analysis.</p>
          {data.recommendedActions.map((a, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{a.action}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Department: {a.department}</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, background: a.priority === 'Critical' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: a.priority === 'Critical' ? '#ef4444' : '#f59e0b', border: `1px solid ${a.priority === 'Critical' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}` }}>
                {a.priority}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Impact Opportunities */}
      {activeSection === 'impact' && (
        <div className="reveal-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>💡 Impact Opportunities</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>Problems where intervention could create the highest social impact.</p>
          {data.impactOpportunities.map((o, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{o.opportunity}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Impact: {o.impact} · Cost: {o.cost}</div>
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>{o.roi} ROI</span>
            </div>
          ))}
        </div>
      )}

      {/* Weekly Brief */}
      {activeSection === 'brief' && (
        <div className="glass-l2 reveal" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>📰 Weekly Civic Brief</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Major Problems</h4>
              {brief.majorProblems.map((p, i) => (
                <div key={i} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>• {p}</div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Major Improvements</h4>
              {brief.majorImprovements.map((p, i) => (
                <div key={i} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(16,185,129,0.06)', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>• {p}</div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emerging Trends</h4>
              {brief.emergingTrends.map((p, i) => (
                <div key={i} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(245,158,11,0.06)', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>• {p}</div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Priorities</h4>
              {brief.recommendedPriorities.map((p, i) => (
                <div key={i} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(59,130,246,0.06)', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>• {p}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
