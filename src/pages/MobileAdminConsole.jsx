import React, { useState } from 'react';
import { Shield, Users, FileText, CheckCircle, Database, Menu, X, ChevronRight } from 'lucide-react';
import { getProfiles, getChallenges, updateProfileVerification } from '../services/supabaseService';

export default function MobileAdminConsole() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [users, setUsers] = React.useState([]);
  const [challenges, setChallenges] = React.useState([]);

  React.useEffect(() => {
    Promise.all([getProfiles(), getChallenges()]).then(([u, c]) => {
      setUsers(u);
      setChallenges(c);
    });
  }, []);

  const pendingUsers = users.filter(u => u.verification === 'pending_verification' || u.verification === 'unverified');

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '90px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>Super Admin Center</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>Command Center</h2>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="touch-target" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: '#fff', cursor: 'pointer' }}>
          <Menu size={20} />
        </button>
      </div>

      {/* Operational Banner */}
      <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>All 12 Platform Sectors Operational</span>
      </div>

      {/* Stacked Admin Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card" style={{ padding: '16px', cursor: 'default' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Users</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>{users.length}</div>
          <span style={{ fontSize: '0.68rem', color: '#3b82f6' }}>Across 12 sectors</span>
        </div>

        <div className="glass-card" style={{ padding: '16px', cursor: 'default' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Reviews</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>{pendingUsers.length}</div>
          <span style={{ fontSize: '0.68rem', color: '#f59e0b' }}>Action required</span>
        </div>
      </div>

      {/* Pending Approvals List */}
      <div className="glass-l2" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Pending User Approvals</h4>
        {pendingUsers.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No pending user approvals.</p>
        ) : (
          pendingUsers.map(u => (
            <div key={u.id} className="glass-l1" style={{ borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#fff', fontSize: '0.82rem', display: 'block' }}>{u.name}</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.role} · {u.sector}</span>
              </div>
              <button
                onClick={async () => {
                  await updateProfileVerification(u.id, 'verified');
                  setUsers(prev => prev.map(x => x.id === u.id ? { ...x, verification: 'verified' } : x));
                }}
                className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                Approve
              </button>
            </div>
          ))
        )}
      </div>

      {/* Expandable Full-Screen Admin Drawer */}
      {drawerOpen && (
        <div className="glass-l4" style={{ position: 'fixed', inset: 0, zIndex: 1200, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>Admin Modules</h3>
            <button onClick={() => setDrawerOpen(false)} className="touch-target" style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Users Management', 'Roles & RBAC', 'Challenge Clusters', 'AI Engine Settings', 'System Health', 'Audit Logs'].map(m => (
              <button key={m} onClick={() => setDrawerOpen(false)} className="glass-l1" style={{ padding: '14px', color: '#fff', fontSize: '0.9rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                {m} <ChevronRight size={16} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
