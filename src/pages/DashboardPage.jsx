import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileText, Lightbulb, Users, BarChart3, Settings,
  Shield, CheckCircle, Building, BookOpen, GraduationCap, Rocket,
  Globe, Award, Zap, Bell, Activity, TrendingUp, Eye, PlusCircle,
  Clock, Star, MessageSquare, MapPin, Search, Filter, ChevronRight,
  AlertTriangle, DollarSign, Briefcase, FlaskConical, Heart, LogOut,
  UserCheck, Database, Flag, Target, Lock, Cpu, Users2, FolderKanban
} from 'lucide-react';
import { db } from '../services/mockData';
import { getProfiles, getAuditLogs, updateProfileVerification } from '../services/supabaseService';

// ─── Sidebar Definitions per Sector ──────────────────────────────────────────
const SIDEBAR_CONFIG = {
  citizen: {
    color: '#06b6d4',
    icon: '👤',
    label: 'Citizen Portal',
    nav: [
      { icon: LayoutDashboard, label: 'My Dashboard', id: 'overview' },
      { icon: PlusCircle,      label: 'Report a Problem', id: 'report' },
      { icon: FileText,        label: 'My Submissions', id: 'my-submissions' },
      { icon: Activity,        label: 'Track Progress', id: 'track' },
      { icon: Globe,           label: 'Community Feed', id: 'community' },
      { icon: Bell,            label: 'Notifications', id: 'notifications' },
    ]
  },
  government: {
    color: '#3b82f6',
    icon: '🏛️',
    label: 'Government Portal',
    nav: [
      { icon: LayoutDashboard, label: 'Command Dashboard', id: 'overview' },
      { icon: Shield,          label: 'Validate Challenges', id: 'validate' },
      { icon: FileText,        label: 'Department Challenges', id: 'dept-challenges' },
      { icon: CheckCircle,     label: 'Approve Solutions', id: 'approve' },
      { icon: BarChart3,       label: 'Analytics & Reports', id: 'analytics' },
      { icon: Briefcase,       label: 'Pilot Programs', id: 'pilots' },
      { icon: Users,           label: 'Stakeholders', id: 'stakeholders' },
      { icon: Database,        label: 'Audit Logs', id: 'audit' },
      { icon: Settings,        label: 'Department Settings', id: 'settings' },
    ]
  },
  university: {
    color: '#f59e0b',
    icon: '🏛',
    label: 'University Portal',
    nav: [
      { icon: LayoutDashboard, label: 'University Dashboard', id: 'overview' },
      { icon: Users,           label: 'Student Teams', id: 'teams' },
      { icon: FolderKanban,    label: 'Active Projects', id: 'projects' },
      { icon: Lightbulb,       label: 'Solution Pipeline', id: 'pipeline' },
      { icon: Building,        label: 'Industry Partnerships', id: 'partnerships' },
      { icon: Award,           label: 'Rankings & Awards', id: 'awards' },
      { icon: BarChart3,       label: 'Research Metrics', id: 'metrics' },
      { icon: Settings,        label: 'Institute Settings', id: 'settings' },
    ]
  },
  student: {
    color: '#10b981',
    icon: '🎓',
    label: 'Student Portal',
    nav: [
      { icon: LayoutDashboard, label: 'My Dashboard', id: 'overview' },
      { icon: Search,          label: 'Find Challenges', id: 'find' },
      { icon: Users2,          label: 'My Teams', id: 'teams' },
      { icon: Lightbulb,       label: 'My Solutions', id: 'solutions' },
      { icon: Rocket,          label: 'Hackathons', id: 'hackathons' },
      { icon: Award,           label: 'My Badges & Points', id: 'badges' },
      { icon: BookOpen,        label: 'Learning Resources', id: 'learn' },
      { icon: MessageSquare,   label: 'Mentors', id: 'mentors' },
    ]
  },
  industry: {
    color: '#ec4899',
    icon: '🏢',
    label: 'Industry Portal',
    nav: [
      { icon: LayoutDashboard, label: 'Industry Dashboard', id: 'overview' },
      { icon: Search,          label: 'Browse Challenges', id: 'browse' },
      { icon: Lightbulb,       label: 'Sponsored Solutions', id: 'sponsored' },
      { icon: Users,           label: 'Mentored Teams', id: 'teams' },
      { icon: DollarSign,      label: 'Funding & CSR', id: 'funding' },
      { icon: Briefcase,       label: 'Pilot Partnerships', id: 'pilots' },
      { icon: BarChart3,       label: 'Impact Dashboard', id: 'impact' },
      { icon: Settings,        label: 'Company Profile', id: 'settings' },
    ]
  },
  expert: {
    color: '#8b5cf6',
    icon: '🔬',
    label: 'Expert Portal',
    nav: [
      { icon: LayoutDashboard, label: 'Expert Dashboard', id: 'overview' },
      { icon: FileText,        label: 'Review Queue', id: 'review' },
      { icon: CheckCircle,     label: 'Validations', id: 'validations' },
      { icon: Users,           label: 'Mentored Teams', id: 'teams' },
      { icon: Star,            label: 'My Ratings', id: 'ratings' },
      { icon: BarChart3,       label: 'Expertise Stats', id: 'stats' },
    ]
  },
  ngo: {
    color: '#f97316',
    icon: '🤝',
    label: 'NGO Portal',
    nav: [
      { icon: LayoutDashboard, label: 'NGO Dashboard', id: 'overview' },
      { icon: Heart,           label: 'Community Issues', id: 'issues' },
      { icon: MapPin,          label: 'Field Reports', id: 'field' },
      { icon: CheckCircle,     label: 'Impact Verification', id: 'verify' },
      { icon: Users,           label: 'Beneficiary Tracker', id: 'beneficiaries' },
      { icon: BarChart3,       label: 'SDG Alignment', id: 'sdg' },
    ]
  },
  startup: {
    color: '#06b6d4',
    icon: '🚀',
    label: 'Startup Portal',
    nav: [
      { icon: LayoutDashboard, label: 'Startup Dashboard', id: 'overview' },
      { icon: Search,          label: 'Challenge Marketplace', id: 'marketplace' },
      { icon: Lightbulb,       label: 'My Pitches', id: 'pitches' },
      { icon: Rocket,          label: 'Pilot Applications', id: 'pilots' },
      { icon: DollarSign,      label: 'Funding Pipeline', id: 'funding' },
      { icon: Building,        label: 'Incubator Connect', id: 'incubator' },
      { icon: BarChart3,       label: 'Traction Metrics', id: 'metrics' },
    ]
  },
  incubator: {
    color: '#10b981',
    icon: '🌱',
    label: 'Incubator Portal',
    nav: [
      { icon: LayoutDashboard, label: 'Incubator Dashboard', id: 'overview' },
      { icon: Users,           label: 'Cohort Management', id: 'cohort' },
      { icon: Briefcase,       label: 'Evaluate Projects', id: 'evaluate' },
      { icon: DollarSign,      label: 'Funding Recommendations', id: 'funding' },
      { icon: Building,        label: 'Industry Bridge', id: 'industry' },
      { icon: BarChart3,       label: 'Portfolio Metrics', id: 'portfolio' },
    ]
  },
  research: {
    color: '#8b5cf6',
    icon: '🔭',
    label: 'Research Portal',
    nav: [
      { icon: LayoutDashboard,  label: 'Research Dashboard', id: 'overview' },
      { icon: FlaskConical,     label: 'Active Research', id: 'research' },
      { icon: FileText,         label: 'Proposals', id: 'proposals' },
      { icon: Users,            label: 'Collaborators', id: 'collaborators' },
      { icon: BookOpen,         label: 'Publications', id: 'publications' },
      { icon: BarChart3,        label: 'Impact Metrics', id: 'metrics' },
    ]
  },
  funding: {
    color: '#f59e0b',
    icon: '💰',
    label: 'CSR & Funding Portal',
    nav: [
      { icon: LayoutDashboard, label: 'Funding Dashboard', id: 'overview' },
      { icon: Search,          label: 'Discover Projects', id: 'discover' },
      { icon: DollarSign,      label: 'Active Grants', id: 'grants' },
      { icon: CheckCircle,     label: 'Milestone Approvals', id: 'milestones' },
      { icon: BarChart3,       label: 'Impact Reports', id: 'impact' },
      { icon: Settings,        label: 'Organization Profile', id: 'settings' },
    ]
  },
  super_admin: {
    color: '#ef4444',
    icon: '👑',
    label: 'Command Center',
    nav: [
      { icon: LayoutDashboard, label: 'Platform Overview', id: 'overview' },
      { icon: Users,           label: 'All Users', id: 'users' },
      { icon: Shield,          label: 'Roles & Permissions', id: 'rbac' },
      { icon: Globe,           label: 'All Sectors', id: 'sectors' },
      { icon: FileText,        label: 'All Challenges', id: 'challenges' },
      { icon: CheckCircle,     label: 'Pending Approvals', id: 'approvals' },
      { icon: Database,        label: 'Audit Logs', id: 'audit' },
      { icon: Cpu,             label: 'AI Engine Settings', id: 'ai' },
      { icon: Activity,        label: 'System Health', id: 'health' },
      { icon: Flag,            label: 'Content Moderation', id: 'moderation' },
      { icon: BarChart3,       label: 'Platform Analytics', id: 'analytics' },
      { icon: Settings,        label: 'System Settings', id: 'settings' },
    ]
  }
};

// ─── Section Content per Sector ────────────────────────────────────────────
function DashboardOverview({ currentUser, challenges, sectorConfig, isMobile }) {
  const color = sectorConfig?.color || '#3b82f6';
  const sector = currentUser?.sector || 'citizen';
  const role = currentUser?.role || 'Citizen';

  const quickStats = getQuickStats(sector, challenges);
  const recentActivity = getRecentActivity(sector);
  const priorityChallenges = challenges.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome Banner */}
      <div style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `1px solid ${color}25`, borderRadius: '14px', padding: isMobile ? '20px' : '28px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: `${color}12`, borderRadius: '50%' }} />
        <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '6px' }}>{sectorConfig?.icon || '👤'}</div>
        <h2 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
          Welcome, {(currentUser?.name || currentUser?.email || 'User').split(' ')[0]}
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Role: <strong style={{ color }}>{role}</strong>
          {currentUser?.organization ? ` · ${currentUser.organization}` : ''}
          {currentUser?.verification === 'pending_verification' && (
            <span style={{ marginLeft: '8px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '100px', padding: '2px 8px', fontSize: '0.72rem' }}>⏳ Pending Verification</span>
          )}
        </p>
      </div>

      {/* Quick Stats - 2-col on mobile, 4-col on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px' }}>
        {quickStats.map((stat, i) => (
          <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${stat.color || color}, transparent)` }} />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
            <div style={{ fontSize: '0.72rem', color: stat.trend > 0 ? '#10b981' : 'var(--text-muted)', marginTop: '4px' }}>
              {stat.trend > 0 ? '↑' : ''} {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Challenges & Activity Grid - stacked on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: '16px' }}>
        {/* Challenges List */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Priority Challenges</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{challenges.length} total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {priorityChallenges.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--bg-elevated)', borderRadius: '8px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', background: `${color}18`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {c.sector_icon || '📋'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{c.location} · {c.status_label || c.status}</div>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: c.priority_score > 80 ? '#ef4444' : c.priority_score > 60 ? '#f59e0b' : '#10b981' }}>
                  {c.priority_score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${item.color || color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.text}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SuperAdminOverview({ challenges, isMobile }) {
  const [users, setUsers] = React.useState([]);
  const [auditLogs, setAuditLogs] = React.useState([]);
  const [loadingUsers, setLoadingUsers] = React.useState(true);

  React.useEffect(() => {
    Promise.all([getProfiles(), getAuditLogs(50)]).then(([u, logs]) => {
      setUsers(u);
      setAuditLogs(logs);
      setLoadingUsers(false);
    });
  }, []);

  const handleApprove = async (userId) => {
    await updateProfileVerification(userId, 'verified');
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verification: 'verified' } : u));
  };

  const platformStats = [
    { label: 'Total Users', value: users.length.toString(), color: '#3b82f6', sub: 'All sectors' },
    { label: 'Active Challenges', value: challenges.length.toString(), color: '#10b981', sub: `${challenges.filter(c => c.priority_score > 70).length} high priority` },
    { label: 'Sectors Active', value: '12', color: '#8b5cf6', sub: 'All operational' },
    { label: 'Pending Approvals', value: users.filter(u => u.verification === 'pending_verification').length.toString(), color: '#f59e0b', sub: 'Require review' },
  ];

  const pendingUsers = users.filter(u => u.verification === 'pending_verification');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '16px' }}>
        {platformStats.map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.color }} />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.sub}</div>
          </div>
        ))}
      </div>        {/* Users Table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: isMobile ? '14px' : '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>All Registered Users</h3>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {users.map(u => (
                <div key={u.id} style={{ display: 'flex', gap: '10px', padding: '12px', background: 'var(--bg-elevated)', borderRadius: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{u.avatar || '👤'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.82rem' }}>{u.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '4px' }}>{u.sector}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '4px' }}>{u.role}</span>
                      <span style={{
                        padding: '1px 6px', borderRadius: '100px', fontSize: '0.64rem', fontWeight: 700,
                        background: u.verification === 'verified' ? 'rgba(16,185,129,0.1)' : u.verification === 'pending_verification' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: u.verification === 'verified' ? '#10b981' : u.verification === 'pending_verification' ? '#f59e0b' : '#ef4444'
                      }}>
                        {u.verification === 'verified' ? '✓ Verified' : u.verification === 'pending_verification' ? '⏳ Pending' : '● Active'}
                      </span>
                    </div>
                  </div>
                  {u.verification === 'pending_verification' && (
                    <button
                      onClick={() => handleApprove(u.id)}
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '6px', padding: '6px 12px', color: '#10b981', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Avatar', 'Name / Email', 'Sector', 'Role', 'Verification', 'Action'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '20px' }}>{u.avatar || '👤'}</span></td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{u.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{u.sector}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{u.role}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '100px', fontSize: '0.68rem', fontWeight: 700,
                        background: u.verification === 'verified' ? 'rgba(16,185,129,0.1)' : u.verification === 'pending_verification' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: u.verification === 'verified' ? '#10b981' : u.verification === 'pending_verification' ? '#f59e0b' : '#ef4444',
                        border: `1px solid ${u.verification === 'verified' ? 'rgba(16,185,129,0.2)' : u.verification === 'pending_verification' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`
                      }}>
                        {u.verification === 'verified' ? '✓ Verified' : u.verification === 'pending_verification' ? '⏳ Pending' : '● Active'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {u.verification === 'pending_verification' && (
                        <button
                          onClick={() => handleApprove(u.id)}
                          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '6px', padding: '4px 10px', color: '#10b981', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}>
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>        {/* Audit Logs */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: isMobile ? '14px' : '20px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Audit Log (Recent)</h3>
        {auditLogs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', padding: '20px' }}>No audit logs yet. Actions will appear here.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '6px' }}>
            {auditLogs.slice(-10).reverse().map((log, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '4px' : '12px',
                padding: isMobile ? '10px 12px' : '10px',
                background: 'var(--bg-elevated)',
                borderRadius: '8px',
                alignItems: isMobile ? 'flex-start' : 'center',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.68rem', flexShrink: 0 }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span style={{ color: '#3b82f6', fontWeight: 700, flexShrink: 0 }}>{log.action}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{log.user}</span>
                  {log.details && <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{log.details}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Generic Placeholder Section ─────────────────────────────────────────────
function PlaceholderSection({ label, icon: Icon, color }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '60px 40px', textAlign: 'center' }}>
      <div style={{ width: '64px', height: '64px', background: `${color}15`, border: `1px solid ${color}25`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Icon size={28} color={color} />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{label}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto' }}>
        This section is under active development. Full implementation coming in the next phase.
      </p>
      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', marginTop: '16px', padding: '6px 14px', borderRadius: '100px', background: `${color}10`, border: `1px solid ${color}20`, fontSize: '0.75rem', color }}>
        <Zap size={12} /> AI-powered features will be enabled here
      </div>
    </div>
  );
}

// ─── Data Helpers ─────────────────────────────────────────────────────────────
function getQuickStats(sector, challenges) {
  const map = {
    citizen:    [
      { label: 'Problems Reported', value: '3', sub: '1 this month', trend: 1 },
      { label: 'In Progress', value: '2', sub: 'Being worked on', trend: 1, color: '#f59e0b' },
      { label: 'Solved', value: '1', sub: 'Implemented', trend: 1, color: '#10b981' },
      { label: 'Community Points', value: '420', sub: 'Top 10%', trend: 1, color: '#8b5cf6' }
    ],
    government: [
      { label: 'Open Challenges', value: challenges.length.toString(), sub: 'Across all depts.', trend: 1 },
      { label: 'Pending Validation', value: '8', sub: 'Require review', trend: 0, color: '#f59e0b' },
      { label: 'Approved Solutions', value: '14', sub: 'This quarter', trend: 1, color: '#10b981' },
      { label: 'Active Pilots', value: '5', sub: 'In implementation', trend: 1, color: '#8b5cf6' }
    ],
    university: [
      { label: 'Student Teams', value: '23', sub: 'Active', trend: 1 },
      { label: 'Active Projects', value: '15', sub: 'In pipeline', trend: 1, color: '#f59e0b' },
      { label: 'Industry Partners', value: '7', sub: 'Collaborating', trend: 1, color: '#10b981' },
      { label: 'Patents Filed', value: '2', sub: 'This year', trend: 1, color: '#8b5cf6' }
    ],
    student: [
      { label: 'Open Challenges', value: challenges.length.toString(), sub: 'Available to join', trend: 1 },
      { label: 'My Teams', value: '2', sub: 'Active', trend: 1, color: '#f59e0b' },
      { label: 'Solutions Built', value: '3', sub: 'All time', trend: 1, color: '#10b981' },
      { label: 'Hackathon Points', value: '1240', sub: 'Top 5%', trend: 1, color: '#8b5cf6' }
    ],
    industry: [
      { label: 'Challenges Viewed', value: '18', sub: 'This quarter', trend: 1 },
      { label: 'Teams Mentored', value: '4', sub: 'Active', trend: 1, color: '#f59e0b' },
      { label: 'CSR Invested', value: '₹12L', sub: 'This FY', trend: 1, color: '#10b981' },
      { label: 'Pilots Running', value: '2', sub: 'In field', trend: 1, color: '#8b5cf6' }
    ],
    expert: [
      { label: 'Reviews Pending', value: '5', sub: 'Awaiting your input', trend: 0, color: '#f59e0b' },
      { label: 'Completed Reviews', value: '28', sub: 'All time', trend: 1, color: '#10b981' },
      { label: 'Teams Mentored', value: '6', sub: 'Active', trend: 1 },
      { label: 'Expertise Rating', value: '4.8★', sub: 'Out of 5', trend: 1, color: '#8b5cf6' }
    ],
    default: [
      { label: 'Active Challenges', value: challenges.length.toString(), sub: 'Platform wide', trend: 1 },
      { label: 'Solutions', value: '47', sub: 'Submitted', trend: 1, color: '#f59e0b' },
      { label: 'Collaborators', value: '120', sub: 'Across sectors', trend: 1, color: '#10b981' },
      { label: 'Impact Score', value: '8.7', sub: 'SDG Aligned', trend: 1, color: '#8b5cf6' }
    ]
  };
  return map[sector] || map.default;
}

function getRecentActivity(sector) {
  const common = [
    { icon: '🤖', text: 'AI matched 3 new challenges to your profile', time: '2 min ago', color: '#8b5cf6' },
    { icon: '✅', text: 'Government validated: Rural Road Accessibility', time: '1 hour ago', color: '#10b981' },
    { icon: '💬', text: 'New comment on Flood Warning System', time: '3 hours ago', color: '#3b82f6' },
    { icon: '🏆', text: 'Team InnoVators submitted prototype video', time: 'Yesterday', color: '#f59e0b' },
    { icon: '💰', text: 'GeoTech Solutions offered ₹2.5L funding', time: '2 days ago', color: '#ec4899' },
  ];
  return common;
}

// ─── Main Dashboard Page Component ──────────────────────────────────────────
export default function DashboardPage({ activeRole, currentUser, onNavigate, onLogout, challenges: propChallenges = [] }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mobile viewport detection
  const checkMobile = () => window.innerWidth <= 768 || (window.innerHeight / window.innerWidth) > 1.15;
  const [isMobile, setIsMobile] = useState(checkMobile);
  useEffect(() => {
    const handler = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // challenges is passed as prop from App.jsx (already loaded from Supabase)
  const challenges = (propChallenges || []);

  // Determine which sector config to use
  const sector = currentUser?.sector || 'citizen';
  const sectorConfig = SIDEBAR_CONFIG[sector] || SIDEBAR_CONFIG.citizen;
  const color = sectorConfig.color;

  const renderSection = () => {
    if (sector === 'super_admin' && activeSection === 'overview') {
      return <SuperAdminOverview challenges={challenges} isMobile={isMobile} />;
    }
    if (activeSection === 'overview') {
      return <DashboardOverview currentUser={currentUser} challenges={challenges} sectorConfig={sectorConfig} isMobile={isMobile} />;
    }
    // Find the nav item to get icon & label
    const navItem = sectorConfig.nav.find(n => n.id === activeSection);
    return <PlaceholderSection label={navItem?.label || activeSection} icon={navItem?.icon || LayoutDashboard} color={color} />;
  };

  // ─── Guest Mode (not logged in) ──────────────────────────────────────────
  if (!currentUser) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Sign In to Access Your Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
          Each sector has its own personalized dashboard with role-specific tools, workflows and permissions.
        </p>
        <button onClick={() => onNavigate('sector-select')} className="btn btn-primary" style={{ padding: '12px 24px' }}>
          Choose Your Sector & Sign In →
        </button>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '12px' }}>
          12 sectors available: Citizen, Government, University, Student, Industry, Expert, NGO, Startup, Incubator, Research, Funding & Super Admin
        </p>
      </div>
    );
  }

  // ─── Mobile: render top horizontal tabs instead of sidebar ─────────────
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', minHeight: 'calc(100vh - 60px)', position: 'relative' }}>
        {/* Mobile Top Tab Strip */}
        <div style={{ overflowX: 'auto', display: 'flex', gap: '4px', padding: '8px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', scrollbarWidth: 'none' }}>
          {sectorConfig.nav.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '7px 12px', borderRadius: '100px', border: 'none',
                  background: isActive ? `${color}20` : 'transparent',
                  color: isActive ? color : 'var(--text-muted)',
                  fontSize: '0.75rem', fontWeight: isActive ? 700 : 400,
                  whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                  borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent'
                }}
              >
                <Icon size={13} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Content */}
        <div style={{ flex: 1, padding: '20px 16px', minWidth: 0, overflowX: 'hidden' }}>
          {currentUser?.verification === 'pending_verification' && (
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#fbbf24' }}>
              <AlertTriangle size={14} />
              <span>Account pending admin verification. Some features are restricted.</span>
            </div>
          )}
          <div className="fade-in">{renderSection()}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '0', minHeight: 'calc(100vh - 70px - 100px)', position: 'relative' }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? '240px' : '60px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        borderRadius: '12px 0 0 12px',
        padding: sidebarOpen ? '20px 0' : '20px 0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.25s ease',
        overflow: 'hidden'
      }}>
        {/* Sector badge at top */}
        <div style={{ padding: '0 16px 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
          {sidebarOpen ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{sectorConfig.icon}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color, lineHeight: 1.2 }}>{sectorConfig.label}</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}>‹</button>
              </div>
            </>
          ) : (
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color, fontSize: '20px', padding: '0' }}>
              {sectorConfig.icon}
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {sectorConfig.nav.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                title={!sidebarOpen ? item.label : ''}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: sidebarOpen ? '10px 16px' : '10px',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  background: isActive ? `${color}15` : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? `3px solid ${color}` : '3px solid transparent',
                  cursor: 'pointer',
                  color: isActive ? color : 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  whiteSpace: 'nowrap'
                }}>
                <Icon size={16} />
                {sidebarOpen && item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        {onLogout && (
          <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <button onClick={onLogout}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: sidebarOpen ? '10px 16px' : '10px', justifyContent: sidebarOpen ? 'flex-start' : 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '0.8rem' }}>
              <LogOut size={16} />
              {sidebarOpen && 'Sign Out'}
            </button>
          </div>
        )}
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '28px', minWidth: 0, overflowX: 'hidden' }}>
        {/* Section header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <span>{sectorConfig.label}</span>
          <ChevronRight size={14} />
          <span style={{ color: '#fff', fontWeight: 600 }}>
            {sectorConfig.nav.find(n => n.id === activeSection)?.label || 'Overview'}
          </span>
        </div>

        {/* Permission badge for restricted roles */}
        {currentUser?.verification === 'pending_verification' && (
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#fbbf24' }}>
            <AlertTriangle size={16} />
            <span>Your account is pending admin verification. Some features are restricted until approved.</span>
          </div>
        )}

        <div className="fade-in">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
