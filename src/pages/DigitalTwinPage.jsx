import React, { useState } from 'react';
import { Map, Building2, Users, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { digitalTwinService, wardScoreService, riskRadarService, problemDependencyService, cascadeService, recurrenceService, rootProblemService, interventionSimService } from '../services/enterprise100Service';

export default function DigitalTwinPage() {
  const [view, setView] = useState('twin');
  const twin = digitalTwinService.getData();
  const wards = wardScoreService.getAll();
  const riskRadar = riskRadarService.getData();
  const dependencies = problemDependencyService.getData();
  const cascades = cascadeService.getData();
  const recurrences = recurrenceService.getData();
  const rootProblems = rootProblemService.getData();
  const interventions = interventionSimService.getData();

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#0891b2', marginBottom: '8px', fontWeight: 700 }}><Map size={13} color="#0891b2" /> Digital Twin Modeling</div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>{twin.cityName}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{twin.state} · Pop: {twin.population.toLocaleString()} · Area: {twin.area}</p>
      </div>

      <div className="mobile-scroll-tabs" style={{ display: 'flex', gap: '4px', overflowX: 'auto', background: '#ffffff', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)', scrollbarWidth: 'none' }}>
        {[
          { id: 'twin', label: 'City Overview' }, { id: 'wards', label: 'Wards' }, { id: 'risk', label: 'Risk Radar' },
          { id: 'dependencies', label: 'Dependencies' }, { id: 'cascade', label: 'Cascade' },
          { id: 'recurrence', label: 'Recurrence' }, { id: 'roots', label: 'Root Network' },
          { id: 'simulator', label: 'Simulator' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ padding: '7px 12px', borderRadius: '6px', border: 'none', flexShrink: 0, background: view === v.id ? 'var(--primary)' : 'transparent', color: view === v.id ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: view === v.id ? 700 : 500, whiteSpace: 'nowrap' }}>{v.label}</button>
        ))}
      </div>

      {view === 'twin' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            {Object.entries(twin.infrastructure).map(([k, v]) => (
              <div key={k} className="glass-card" style={{ padding: '14px 10px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>{v.toLocaleString()}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'capitalize', fontWeight: 600 }}>{k.replace(/([A-Z])/g, ' $1')}</div>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>City Services Status</h3>
            {Object.entries(twin.services).map(([k, v]) => (
              <div key={k} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span style={{ fontSize: '0.78rem', color: v >= 80 ? '#047857' : v >= 60 ? '#b45309' : '#dc2626', fontWeight: 700 }}>{v}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${v}%`, background: v >= 80 ? '#047857' : v >= 60 ? '#b45309' : '#dc2626', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>Administrative Zones</h3>
            {twin.zones.map(z => (
              <div key={z.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 700 }}>{z.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pop: {z.population.toLocaleString()} · {z.problems} problems · {z.projects} projects</div>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: z.healthScore >= 75 ? '#047857' : z.healthScore >= 60 ? '#b45309' : '#dc2626' }}>{z.healthScore}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'wards' && (
        <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          {wards.map(w => (
            <div key={w.id} style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{w.name}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: w.score >= 75 ? '#047857' : w.score >= 50 ? '#b45309' : '#dc2626' }}>{w.score}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', flexWrap: 'wrap' }}>
                <span>Prev: {w.prevScore}</span>
                <span>{w.problems} problems</span>
                <span>{w.resolved} resolved</span>
                <span>{w.participation} participants</span>
                <span style={{ color: w.risk === 'critical' ? '#dc2626' : w.risk === 'high' ? '#d97706' : '#047857', fontWeight: 700 }}>Risk: {w.risk}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'risk' && (
        <div className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 700 }}>Civic Risk Radar</h3>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px', margin: '0 auto', aspectRatio: '1' }}>
            <svg viewBox="0 0 300 300" style={{ width: '100%', height: '100%' }}>
              {[20, 40, 60, 80, 100].map(r => (
                <circle key={r} cx="150" cy="150" r={r * 1.1} fill="none" stroke="#e2e8f0" strokeWidth="1" />
              ))}
              {riskRadar.map((r, i) => {
                const angle = (i * 2 * Math.PI / riskRadar.length) - Math.PI / 2;
                const lx = 150 + 125 * Math.cos(angle);
                const ly = 150 + 125 * Math.sin(angle);
                return (
                  <React.Fragment key={i}>
                    <polygon
                      points={riskRadar.map((rr, j) => {
                        const a = (j * 2 * Math.PI / riskRadar.length) - Math.PI / 2;
                        return `${150 + (rr.score * 1.1) * Math.cos(a)},${150 + (rr.score * 1.1) * Math.sin(a)}`;
                      }).join(' ')}
                      fill="rgba(27,42,74,0.12)" stroke="var(--primary)" strokeWidth="2"
                    />
                    <text x={lx} y={ly} textAnchor="middle" fill="var(--primary)" fontSize="10" fontWeight="700">{r.category}</text>
                    <text x={lx} y={ly + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="8">{r.score}%</text>
                  </React.Fragment>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {view === 'dependencies' && (
        <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          {dependencies.map(d => (
            <div key={d.id} style={{ padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>🔗 {d.problem}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                {d.causes.map((c, i) => <span key={i} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', fontWeight: 600 }}>CAUSES: {c}</span>)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>↓ Leads to:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {d.effects.map((e, i) => <span key={i} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: '#fffbeb', border: '1px solid #fef3c7', color: '#b45309', fontWeight: 600 }}>{e}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'cascade' && (
        <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          {cascades.map((c, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fee2e2', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.9rem', color: '#dc2626', fontWeight: 700 }}>⚠️ {c.primary}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '6px 0' }}>Impact: {c.impact.toLocaleString()} people · Probability: {c.probability}%</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {c.secondary.map((s, j) => <span key={j} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: '#ffffff', border: '1px solid #fecaca', color: 'var(--text-primary)' }}>↓ {s}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'recurrence' && (
        <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          {recurrences.map((r, i) => (
            <div key={i} style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 700 }}>{r.problem}</span>
                <span style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 800 }}>{r.recurrences}x recurring</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Avg interval: {r.avgInterval} · Last fix: {r.lastSolution}</div>
              <div style={{ fontSize: '0.74rem', color: '#047857', marginTop: '4px', fontWeight: 600 }}>💡 Recommended: {r.recommended}</div>
            </div>
          ))}
        </div>
      )}

      {view === 'roots' && (
        <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          {rootProblems.map((r, i) => (
            <div key={i} style={{ padding: '12px', borderRadius: '8px', background: '#f5f3ff', border: '1px solid #ede9fe', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.9rem', color: '#7c3aed', fontWeight: 700 }}>🔗 {r.root} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({r.count} connected complaints)</span></div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {r.connected.map((c, j) => <span key={j} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: '#ffffff', border: '1px solid #ddd6fe', color: '#6d28d9' }}>{c}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'simulator' && (
        <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 700 }}>🎛️ Intervention Simulator</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Compare interventions before implementation. All outputs are simulated projection estimates.</p>
          {interventions.map((iv, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '8px' }}>{iv.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '6px' }}>
                {[
                  { label: 'Cost', value: `₹${(iv.cost/1000).toFixed(0)}K`, color: '#b45309' },
                  { label: 'Time', value: `${iv.time} months`, color: 'var(--primary)' },
                  { label: 'Impact', value: iv.impact.toLocaleString(), color: '#047857' },
                  { label: 'Risk', value: iv.risk, color: iv.risk === 'Low' ? '#047857' : '#b45309' },
                  { label: 'Affected', value: iv.citizensAffected.toLocaleString(), color: '#7c3aed' },
                ].map((m, j) => (
                  <div key={j} style={{ textAlign: 'center', padding: '6px', borderRadius: '6px', background: '#ffffff', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
