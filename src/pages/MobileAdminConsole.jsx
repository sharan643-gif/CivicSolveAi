import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, CheckCircle, Database, Menu, X, ChevronRight } from 'lucide-react';
import { getProfiles, getChallenges, updateProfileVerification } from '../services/supabaseService';

export default function MobileAdminConsole() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    Promise.all([getProfiles(), getChallenges(true)]).then(([u, c]) => {
      setUsers(u);
      setChallenges(c);
    });
  }, []);


  const pendingUsers = users.filter(u => u.verification === 'pending_verification' || u.verification === 'unverified');

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '90px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase' }}>Super Admin Center</span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Command Center</h2>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="touch-target" style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Menu size={20} />
        </button>
      </div>

      {/* Operational Banner */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#047857' }} />
        <span style={{ fontSize: '0.82rem', color: '#047857', fontWeight: 700 }}>All 12 Platform Sectors Operational</span>
      </div>

      {/* Stacked Admin Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="glass-card" style={{ padding: '16px', cursor: 'default', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Users</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>{users.length}</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>Across 12 sectors</span>
        </div>

        <div className="glass-card" style={{ padding: '16px', cursor: 'default', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Pending Reviews</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>{pendingUsers.length}</div>
          <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600 }}>Action required</span>
        </div>
      </div>

      {/* Pending Approvals List */}
      <div className="glass-l2" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>Pending User Approvals</h4>
        {pendingUsers.length === 0 ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No pending user approvals.</p>
        ) : (
          pendingUsers.map(u => (
            <div key={u.id} className="glass-l1" style={{ borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem', display: 'block' }}>{u.name}</strong>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{u.role} · {u.sector}</span>
              </div>
              <button
                onClick={async () => {
                  await updateProfileVerification(u.id, 'verified');
                  setUsers(prev => prev.map(x => x.id === u.id ? { ...x, verification: 'verified' } : x));
                }}
                className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.76rem' }}>
                Approve
              </button>
            </div>
          ))
        )}
      </div>

      {/* Expandable Full-Screen Admin Drawer */}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Admin Modules</h3>
            <button onClick={() => setDrawerOpen(false)} className="touch-target" style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '50%', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Users Management', 'Roles & RBAC', 'Challenge Clusters', 'AI Engine Settings', 'System Health', 'Audit Logs'].map(m => (
              <button key={m} onClick={() => setDrawerOpen(false)} style={{ padding: '14px', background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                {m} <ChevronRight size={16} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
