import React, { useState } from 'react';
import { Bell, Clock, Filter } from 'lucide-react';
import { activityFeedService, auditLogService } from '../services/advanced40Service';

export default function ActivityCenterPage() {
  const [view, setView] = useState('activity');
  const activities = activityFeedService.getAll();
  const auditLogs = auditLogService.getRecent(20);

  const actionColors = { ROLE_CHANGE: '#7c3aed', STATUS_CHANGE: '#003087', ASSIGNMENT: '#b45309', APPROVAL: '#047857', COMMENT: '#0284c7', DUPLICATE_DETECTED: '#dc2626', USER_LOGIN: '#475569', DELETION: '#dc2626' };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#0891b2', marginBottom: '8px', fontWeight: 700 }}>
          <Bell size={13} color="#0891b2" /> Activity Center & Audit Trail
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Activity Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Unified live feed of all platform activities and verifiable administrative audit trail.</p>
      </div>

      <div style={{ display: 'flex', gap: '4px', background: '#ffffff', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
        {[
          { id: 'activity', label: 'Activity Feed' },
          { id: 'audit', label: 'Audit Log' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ padding: '7px 16px', borderRadius: '6px', border: 'none', background: view === v.id ? 'var(--primary)' : 'transparent', color: view === v.id ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: view === v.id ? 700 : 500 }}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'activity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activities.map(item => (
            <div key={item.id} className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.text}</div>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                <Clock size={11} />
                {new Date(item.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'audit' && (
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
          <div style={{ minWidth: '600px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.2fr', gap: '8px', padding: '8px 12px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>User</span><span>Action</span><span>Resource</span><span>Change</span><span>Time</span>
            </div>
            {auditLogs.map(log => (
              <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.2fr', gap: '8px', padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.8rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.user}</span>
                <span style={{ padding: '2px 8px', borderRadius: '100px', background: `${actionColors[log.action] || '#64748b'}15`, color: actionColors[log.action] || '#64748b', fontSize: '0.68rem', fontWeight: 700, display: 'inline-block', width: 'fit-content' }}>{log.action}</span>
                <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.resource}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>{log.prevState ? `${log.prevState} → ${log.newState}` : log.newState}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{new Date(log.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
