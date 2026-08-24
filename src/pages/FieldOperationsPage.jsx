import React, { useState } from 'react';
import { Clipboard, MapPin, Clock, CheckCircle, AlertTriangle, Users, Camera, FileText, Activity } from 'lucide-react';
import { fieldInspectionService, inspectionChecklistService, fieldDispatchService, fieldTimelineService, fieldProductivityService } from '../services/enterprise100Service';

export default function FieldOperationsPage() {
  const [view, setView] = useState('inspections');
  const inspections = fieldInspectionService.getAll();
  const checklists = inspectionChecklistService.getAll();
  const dispatch = fieldDispatchService.getAll();
  const timeline = fieldTimelineService.getAll();
  const productivity = fieldProductivityService.getData();

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#fbbf24', marginBottom: '8px' }}><Clipboard size={12} /> Field Operations</div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Field Operations Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Inspections, dispatch, checklists, and field productivity.</p>
      </div>

      <div className="mobile-scroll-tabs" style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
        {[
          { id: 'inspections', label: 'Inspections' }, { id: 'checklists', label: 'Checklists' },
          { id: 'dispatch', label: 'Dispatch' }, { id: 'timeline', label: 'Timeline' },
          { id: 'productivity', label: 'Productivity' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', flexShrink: 0, background: view === v.id ? 'rgba(245,158,11,0.12)' : 'transparent', color: view === v.id ? '#fbbf24' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: view === v.id ? 700 : 400, whiteSpace: 'nowrap' }}>{v.label}</button>
        ))}
      </div>

      {view === 'inspections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {inspections.map(ins => (
            <div key={ins.id} className="glass-card" style={{ padding: '14px', borderLeft: `3px solid ${ins.priority === 'critical' ? '#ef4444' : ins.priority === 'high' ? '#f59e0b' : '#3b82f6'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{ins.location}</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: ins.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: ins.status === 'completed' ? '#10b981' : '#f59e0b' }}>{ins.status}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Officer: {ins.officer} · {ins.date} {ins.time}</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                {ins.checklist.map((c, i) => (
                  <span key={i} style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={10} color={ins.status === 'completed' ? '#10b981' : 'var(--text-muted)'} /> {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'checklists' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {checklists.map(cl => (
            <div key={cl.id} className="glass-card" style={{ padding: '14px' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '10px' }}>{cl.name}</h3>
              {cl.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: i < cl.items.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '2px solid var(--border-subtle)' }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {view === 'dispatch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dispatch.map(d => (
            <div key={d.id} className="glass-card" style={{ padding: '14px', borderLeft: `3px solid ${d.priority === 'critical' ? '#ef4444' : '#f59e0b'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>{d.team}</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: d.status === 'on_site' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)', color: d.status === 'on_site' ? '#10b981' : '#3b82f6' }}>{d.status.replace('_', ' ')}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Members: {d.members.join(', ')}</div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>📍 Current: {d.currentCase}</span>
                {d.nextCase && <span>→ Next: {d.nextCase}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {timeline.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.type === 'inspection' ? '#3b82f6' : t.type === 'evidence' ? '#10b981' : '#f59e0b' }} />
                {i < timeline.length - 1 && <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: '16px' }}>
                <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{t.activity}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Case: {t.case} · Officer: {t.officer}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{new Date(t.time).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'productivity' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Inspections', value: productivity.inspectionsCompleted, color: '#3b82f6' },
              { label: 'Cases Visited', value: productivity.casesVisited, color: '#10b981' },
              { label: 'Avg Response', value: `${productivity.avgResponseTime}d`, color: '#f59e0b' },
              { label: 'Pending', value: productivity.pendingTasks, color: '#ef4444' },
              { label: 'SLA', value: `${productivity.slaCompliance}%`, color: '#8b5cf6' },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{m.label}</div>
              </div>
            ))}
          </div>
          <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '8px' }}>Weekly Trend</h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '50px' }}>
            {productivity.weeklyTrend.map((w, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{w.inspections}</span>
                <div style={{ width: '100%', height: `${(w.inspections / 15) * 50}px`, background: '#3b82f6', borderRadius: '3px', opacity: 0.7 }} />
                <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>{w.week}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
