import React, { useState } from 'react';
import { Bell, Clock, Filter } from 'lucide-react';
import { activityFeedService, auditLogService } from '../services/advanced40Service';

export default function ActivityCenterPage() {
  const [view, setView] = useState('activity');
  const activities = activityFeedService.getAll();
  const auditLogs = auditLogService.getRecent(20);

  const actionColors = { ROLE_CHANGE: '#8b5cf6', STATUS_CHANGE: '#3b82f6', ASSIGNMENT: '#f59e0b', APPROVAL: '#10b981', COMMENT: '#06b6d4', DUPLICATE_DETECTED: '#ef4444', USER_LOGIN: '#6b7280', DELETION: '#ef4444' };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#22d3ee', marginBottom: '8px' }}>
          <Bell size={12} /> Activity Center
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Activity Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Unified feed of all platform activities and administrative audit trail.</p>
      </div>

      <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
        {[
          { id: 'activity', label: 'Activity Feed' },
          { id: 'audit', label: 'Audit Log' },
        ].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: view === v.id ? 'rgba(6,182,212,0.15)' : 'transparent', color: view === v.id ? '#22d3ee' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: view === v.id ? 700 : 400 }}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'activity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activities.map(item => (
            <div key={item.id} className="glass-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.text}</div>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} />
                {new Date(item.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1fr', gap: '8px', padding: '8px 12px', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)' }}>
            <span>User</span><span>Action</span><span>Resource</span><span>Change</span><span>Time</span>
          </div>
          {auditLogs.map(log => (
            <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1fr', gap: '8px', padding: '10px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', fontSize: '0.78rem', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.user}</span>
              <span style={{ padding: '2px 6px', borderRadius: '4px', background: `${actionColors[log.action] || '#6b7280'}15`, color: actionColors[log.action] || '#6b7280', fontSize: '0.68rem', fontWeight: 600, display: 'inline-block', width: 'fit-content' }}>{log.action}</span>
              <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.resource}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{log.prevState ? `${log.prevState} → ${log.newState}` : log.newState}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{new Date(log.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
