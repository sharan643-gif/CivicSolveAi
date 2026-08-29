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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#b45309', marginBottom: '8px', fontWeight: 700 }}>
          <Clipboard size={13} color="#b45309" /> Field Operations
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Field Operations Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Inspections, dispatch, checklists, and field team productivity.</p>
      </div>

      <div className="mobile-scroll-tabs" style={{ display: 'flex', gap: '4px', overflowX: 'auto', background: '#ffffff', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)', scrollbarWidth: 'none' }}>
        {[
          { id: 'inspections', label: 'Inspections' }, { id: 'checklists', label: 'Checklists' },
          { id: 'dispatch', label: 'Dispatch' }, { id: 'timeline', label: 'Timeline' },
          { id: 'productivity', label: 'Productivity' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', flexShrink: 0, background: view === v.id ? 'var(--primary)' : 'transparent', color: view === v.id ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: view === v.id ? 700 : 500, whiteSpace: 'nowrap' }}>{v.label}</button>
        ))}
      </div>

      {view === 'inspections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {inspections.map(ins => (
            <div key={ins.id} className="glass-card" style={{ padding: '16px', borderLeft: `4px solid ${ins.priority === 'critical' ? '#dc2626' : ins.priority === 'high' ? '#d97706' : '#003087'}`, background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 700 }}>{ins.location}</span>
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, background: ins.status === 'completed' ? '#f0fdf4' : '#fffbeb', color: ins.status === 'completed' ? '#047857' : '#b45309', border: `1px solid ${ins.status === 'completed' ? '#bbf7d0' : '#fde68a'}` }}>{ins.status}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Officer: {ins.officer} · {ins.date} {ins.time}</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                {ins.checklist.map((c, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={11} color={ins.status === 'completed' ? '#047857' : 'var(--text-muted)'} /> {c}
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
            <div key={cl.id} className="glass-card" style={{ padding: '16px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <h3 style={{ fontSize: '0.98rem', color: 'var(--text-primary)', marginBottom: '10px', fontWeight: 700 }}>{cl.name}</h3>
              {cl.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: i < cl.items.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '2px solid var(--border-medium)' }} />
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {view === 'dispatch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dispatch.map(d => (
            <div key={d.id} className="glass-card" style={{ padding: '16px', borderLeft: `4px solid ${d.priority === 'critical' ? '#dc2626' : '#d97706'}`, background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 700 }}>{d.team}</span>
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, background: d.status === 'on_site' ? '#f0fdf4' : '#eff6ff', color: d.status === 'on_site' ? '#047857' : '#003087', border: `1px solid ${d.status === 'on_site' ? '#bbf7d0' : '#bfdbfe'}` }}>{d.status.replace('_', ' ')}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Members: {d.members.join(', ')}</div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '6px', flexWrap: 'wrap' }}>
                <span>📍 Current: {d.currentCase}</span>
                {d.nextCase && <span>→ Next: {d.nextCase}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          {timeline.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.type === 'inspection' ? '#003087' : t.type === 'evidence' ? '#047857' : '#d97706' }} />
                {i < timeline.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--border-subtle)' }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: '16px' }}>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 700 }}>{t.activity}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Case: {t.case} · Officer: {t.officer}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{new Date(t.time).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'productivity' && (
        <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Inspections', value: productivity.inspectionsCompleted, color: '#003087' },
              { label: 'Cases Visited', value: productivity.casesVisited, color: '#047857' },
              { label: 'Avg Response', value: `${productivity.avgResponseTime}d`, color: '#b45309' },
              { label: 'Pending', value: productivity.pendingTasks, color: '#dc2626' },
              { label: 'SLA', value: `${productivity.slaCompliance}%`, color: '#7c3aed' },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.label}</div>
              </div>
            ))}
          </div>
          <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 700 }}>Weekly Trend</h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '50px', background: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
            {productivity.weeklyTrend.map((w, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontWeight: 600 }}>{w.inspections}</span>
                <div style={{ width: '100%', height: `${(w.inspections / 15) * 36}px`, background: 'var(--primary)', borderRadius: '3px' }} />
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{w.week}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
