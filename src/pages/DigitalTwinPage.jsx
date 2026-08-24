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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#22d3ee', marginBottom: '8px' }}><Map size={12} /> Digital Twin</div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>{twin.cityName}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{twin.state} · Pop: {twin.population.toLocaleString()} · {twin.area}</p>
      </div>

      <div className="mobile-scroll-tabs" style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
        {[
          { id: 'twin', label: 'City Overview' }, { id: 'wards', label: 'Wards' }, { id: 'risk', label: 'Risk Radar' },
          { id: 'dependencies', label: 'Dependencies' }, { id: 'cascade', label: 'Cascade' },
          { id: 'recurrence', label: 'Recurrence' }, { id: 'roots', label: 'Root Network' },
          { id: 'simulator', label: 'Simulator' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', flexShrink: 0, background: view === v.id ? 'rgba(6,182,212,0.12)' : 'transparent', color: view === v.id ? '#22d3ee' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: view === v.id ? 700 : 400, whiteSpace: 'nowrap' }}>{v.label}</button>
        ))}
      </div>

      {view === 'twin' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            {Object.entries(twin.infrastructure).map(([k, v]) => (
              <div key={k} className="glass-card" style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{v.toLocaleString()}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</div>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>City Services</h3>
            {Object.entries(twin.services).map(([k, v]) => (
              <div key={k} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span style={{ fontSize: '0.78rem', color: v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{v}%</span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${v}%`, background: v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : '#ef4444', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>Zones</h3>
            {twin.zones.map(z => (
              <div key={z.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{z.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pop: {z.population.toLocaleString()} · {z.problems} problems · {z.projects} projects</div>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: z.healthScore >= 75 ? '#10b981' : z.healthScore >= 60 ? '#f59e0b' : '#ef4444' }}>{z.healthScore}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'wards' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          {wards.map(w => (
            <div key={w.id} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{w.name}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: w.score >= 75 ? '#10b981' : w.score >= 50 ? '#f59e0b' : '#ef4444' }}>{w.score}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>Prev: {w.prevScore}</span>
                <span>{w.problems} problems</span>
                <span>{w.resolved} resolved</span>
                <span>{w.participation} participants</span>
                <span style={{ color: w.risk === 'critical' ? '#ef4444' : w.risk === 'high' ? '#f59e0b' : w.risk === 'medium' ? '#f59e0b' : '#10b981' }}>Risk: {w.risk}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'risk' && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '16px' }}>Civic Risk Radar</h3>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px', margin: '0 auto', aspectRatio: '1' }}>
            <svg viewBox="0 0 300 300" style={{ width: '100%', height: '100%' }}>
              {[20, 40, 60, 80, 100].map(r => (
                <circle key={r} cx="150" cy="150" r={r * 1.2} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              ))}
              {riskRadar.map((r, i) => {
                const angle = (i * 2 * Math.PI / riskRadar.length) - Math.PI / 2;
                const x = 150 + (r.score * 1.2) * Math.cos(angle);
                const y = 150 + (r.score * 1.2) * Math.sin(angle);
                const lx = 150 + 130 * Math.cos(angle);
                const ly = 150 + 130 * Math.sin(angle);
                return (
                  <React.Fragment key={i}>
                    <polygon
                      points={riskRadar.map((rr, j) => {
                        const a = (j * 2 * Math.PI / riskRadar.length) - Math.PI / 2;
                        return `${150 + (rr.score * 1.2) * Math.cos(a)},${150 + (rr.score * 1.2) * Math.sin(a)}`;
                      }).join(' ')}
                      fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="1.5"
                    />
                    <text x={lx} y={ly} textAnchor="middle" fill={r.color} fontSize="10" fontWeight="600">{r.category}</text>
                    <text x={lx} y={ly + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="8">{r.score}%</text>
                  </React.Fragment>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {view === 'dependencies' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          {dependencies.map(d => (
            <div key={d.id} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, marginBottom: '6px' }}>🔗 {d.problem}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                {d.causes.map((c, i) => <span key={i} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>CAUSES: {c}</span>)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>↓ Leads to:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {d.effects.map((e, i) => <span key={i} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{e}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'cascade' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          {cascades.map((c, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 700 }}>⚠️ {c.primary}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '6px 0' }}>Impact: {c.impact.toLocaleString()} people · Probability: {c.probability}%</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {c.secondary.map((s, j) => <span key={j} style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>↓ {s}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'recurrence' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          {recurrences.map((r, i) => (
            <div key={i} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{r.problem}</span>
                <span style={{ fontSize: '0.82rem', color: '#ef4444', fontWeight: 800 }}>{r.recurrences}x recurring</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Avg interval: {r.avgInterval} · Last fix: {r.lastSolution}</div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '4px' }}>💡 Recommended: {r.recommended}</div>
            </div>
          ))}
        </div>
      )}

      {view === 'roots' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          {rootProblems.map((r, i) => (
            <div key={i} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 700 }}>🔗 {r.root} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({r.count} connected complaints)</span></div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {r.connected.map((c, j) => <span key={j} style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(139,92,246,0.1)', color: '#a78bfa' }}>{c}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'simulator' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>🎛️ Intervention Simulator</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Compare interventions before implementation. All outputs are simulations.</p>
          {interventions.map((iv, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600, marginBottom: '8px' }}>{iv.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '6px' }}>
                {[
                  { label: 'Cost', value: `₹${(iv.cost/1000).toFixed(0)}K`, color: '#f59e0b' },
                  { label: 'Time', value: `${iv.time} months`, color: '#3b82f6' },
                  { label: 'Impact', value: iv.impact.toLocaleString(), color: '#10b981' },
                  { label: 'Risk', value: iv.risk, color: iv.risk === 'Low' ? '#10b981' : '#f59e0b' },
                  { label: 'Affected', value: iv.citizensAffected.toLocaleString(), color: '#8b5cf6' },
                ].map((m, j) => (
                  <div key={j} style={{ textAlign: 'center', padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{m.label}</div>
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
