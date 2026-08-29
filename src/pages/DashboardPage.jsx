import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileText, Lightbulb, Users, BarChart3, Settings,
  Shield, CheckCircle, Building, BookOpen, GraduationCap, Rocket,
  Globe, Award, Zap, Bell, Activity, TrendingUp, Eye, PlusCircle,
  Clock, Star, MessageSquare, MapPin, Search, Filter, ChevronRight,
  AlertTriangle, DollarSign, Briefcase, FlaskConical, Heart, LogOut,
  UserCheck, Database, Flag, Target, Lock, Cpu, Users2, FolderKanban, Brain, Trophy
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
      { icon: Brain,           label: 'AI Intelligence', id: 'intelligence' },
      { icon: Users,           label: 'Expert Marketplace', id: 'experts' },
      { icon: Settings,        label: 'System Settings', id: 'settings' },
    ]
  }
};

// ─── Section Content per Sector ────────────────────────────────────────────
function DashboardOverview({ currentUser, challenges, sectorConfig, isMobile }) {
  const color = sectorConfig?.color || '#003087';
  const sector = currentUser?.sector || 'citizen';
  const role = currentUser?.role || 'Citizen';

  const quickStats = getQuickStats(sector, challenges);
  const recentActivity = getRecentActivity(sector);
  const priorityChallenges = challenges.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome Banner — High Contrast Deep Navy Gov Style */}
      <div style={{
        background: 'linear-gradient(135deg, #003087 0%, #001d5a 100%)',
        borderBottom: '4px solid #FF6200',
        borderRadius: '8px',
        padding: isMobile ? '20px' : '28px 32px',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%' }} />
        <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '6px' }}>{sectorConfig?.icon || '👤'}</div>
        <h2 style={{ fontSize: isMobile ? '1.3rem' : '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.01em' }}>
          Welcome, {(currentUser?.name || currentUser?.email || 'User').split(' ')[0]}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.88)' }}>
          Role: <strong style={{ color: '#FF6200', background: 'rgba(255, 98, 0, 0.2)', padding: '2px 8px', borderRadius: '4px', marginLeft: '4px' }}>{role}</strong>
          {currentUser?.organization ? ` · ${currentUser.organization}` : ''}
          {currentUser?.verification === 'pending_verification' && (
            <span style={{ marginLeft: '8px', color: '#fbbf24', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700 }}>⏳ Pending Verification</span>
          )}
        </p>
      </div>

      {/* Quick Stats - 2-col on mobile, 4-col on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px' }}>
        {quickStats.map((stat, i) => (
          <div key={i} style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '20px', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: stat.color || color }} />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>{stat.value}</div>
            <div style={{ fontSize: '0.72rem', color: stat.trend > 0 ? 'var(--success)' : 'var(--text-muted)', marginTop: '6px', fontWeight: 600 }}>
              {stat.trend > 0 ? '↑' : ''} {stat.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Challenges & Activity Grid - stacked on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: '16px' }}>
        {/* Challenges List */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Priority Challenges</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{challenges.length} total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {priorityChallenges.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--primary-light)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {c.sector_icon || '📋'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{c.location} · {c.status_label || c.status}</div>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: c.priority_score > 80 ? 'var(--danger)' : c.priority_score > 60 ? 'var(--warning)' : 'var(--success)' }}>
                  {c.priority_score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-xs)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.text}</div>
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
    { label: 'Total Users', value: users.length.toString(), color: 'var(--primary)', sub: 'All sectors' },
    { label: 'Active Challenges', value: challenges.length.toString(), color: 'var(--success)', sub: `${challenges.filter(c => c.priority_score > 70).length} high priority` },
    { label: 'Sectors Active', value: '12', color: '#8b5cf6', sub: 'All operational' },
    { label: 'Pending Approvals', value: users.filter(u => u.verification === 'pending_verification').length.toString(), color: '#f59e0b', sub: 'Require review' },
  ];

  const pendingUsers = users.filter(u => u.verification === 'pending_verification');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '10px' : '16px' }}>
        {platformStats.map((s, i) => (
          <div key={i} style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '20px', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.color }} />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: isMobile ? '14px' : '20px', boxShadow: 'var(--shadow-xs)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>All Registered Users</h3>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {users.map(u => (
                <div key={u.id} style={{ display: 'flex', gap: '10px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '4px', border: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{u.avatar || '👤'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.84rem' }}>{u.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', background: '#e2e8f0', padding: '1px 6px', borderRadius: '4px' }}>{u.sector}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', background: '#e2e8f0', padding: '1px 6px', borderRadius: '4px' }}>{u.role}</span>
                      <span style={{
                        padding: '1px 6px', borderRadius: '100px', fontSize: '0.64rem', fontWeight: 700,
                        background: u.verification === 'verified' ? 'var(--success-light)' : u.verification === 'pending_verification' ? 'var(--warning-light)' : 'var(--danger-light)',
                        color: u.verification === 'verified' ? 'var(--success)' : u.verification === 'pending_verification' ? 'var(--warning)' : 'var(--danger)'
                      }}>
                        {u.verification === 'verified' ? '✓ Verified' : u.verification === 'pending_verification' ? '⏳ Pending' : '● Active'}
                      </span>
                    </div>
                  </div>
                  {u.verification === 'pending_verification' && (
                    <button
                      onClick={() => handleApprove(u.id)}
                      style={{ background: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: '4px', padding: '6px 12px', color: 'var(--success)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
                  {['Avatar', 'Name / Email', 'Sector', 'Role', 'Verification', 'Action'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '20px' }}>{u.avatar || '👤'}</span></td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{u.sector}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{u.role}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '100px', fontSize: '0.68rem', fontWeight: 700,
                        background: u.verification === 'verified' ? 'var(--success-light)' : u.verification === 'pending_verification' ? 'var(--warning-light)' : 'var(--danger-light)',
                        color: u.verification === 'verified' ? 'var(--success)' : u.verification === 'pending_verification' ? 'var(--warning)' : 'var(--danger)'
                      }}>
                        {u.verification === 'verified' ? '✓ Verified' : u.verification === 'pending_verification' ? '⏳ Pending' : '● Active'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {u.verification === 'pending_verification' && (
                        <button
                          onClick={() => handleApprove(u.id)}
                          style={{ background: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: '4px', padding: '4px 10px', color: 'var(--success)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}>
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
      </div>

      {/* Audit Logs */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: isMobile ? '14px' : '20px', boxShadow: 'var(--shadow-xs)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Audit Log (Recent)</h3>
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
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                alignItems: isMobile ? 'flex-start' : 'center',
                fontSize: '0.78rem'
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.68rem', flexShrink: 0 }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>{log.action}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{log.user}</span>
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
    <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '60px 40px', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
      <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', border: '1px solid var(--border-medium)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Icon size={28} color="var(--primary)" />
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{label}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto' }}>
        This section is under active development. Full implementation coming in the next phase.
      </p>
      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', marginTop: '16px', padding: '6px 14px', borderRadius: '100px', background: 'var(--primary-light)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
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
      { label: 'Open Challenges', value: challenges.length.toString(), sub: 'Across all depts.', trend: 1, color: '#3b82f6' },
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
    // Handle new feature sections
    if (activeSection === 'leaderboard') {
      return <div className="fade-in"><LeaderboardSection /></div>;
    }
    if (activeSection === 'experts') {
      return <div className="fade-in"><ExpertSection /></div>;
    }
    if (activeSection === 'intelligence') {
      return <div className="fade-in"><IntelligenceSection /></div>;
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
        <div className="glass-l1" style={{ overflowX: 'auto', display: 'flex', gap: '4px', padding: '8px 16px', borderBottom: 'none', scrollbarWidth: 'none', borderRadius: '0' }}>
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
      {/* ── Sidebar — Government Portal Style ────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? '240px' : '60px',
        background: '#ffffff',
        borderRight: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-xs)',
        padding: '20px 0',
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
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.2 }}>{sectorConfig.label}</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', fontSize: '1.1rem' }}>‹</button>
              </div>
            </>
          ) : (
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '20px', padding: '0' }}>
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
                  padding: sidebarOpen ? '11px 16px' : '11px',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                  cursor: 'pointer',
                  color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 800 : 500,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  whiteSpace: 'nowrap'
                }}>
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? 'var(--primary)' : 'var(--text-secondary)'} />
                {sidebarOpen && item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        {onLogout && (
          <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <button onClick={onLogout}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: sidebarOpen ? '10px 16px' : '10px', justifyContent: sidebarOpen ? 'flex-start' : 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>
              <LogOut size={16} />
              {sidebarOpen && 'Sign Out'}
            </button>
          </div>
        )}
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '28px', minWidth: 0, overflowX: 'hidden' }}>
        {/* Section header */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          <span>{sectorConfig.label}</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
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

// ─── Leaderboard Section ──────────────────────────────────────────────────────
function LeaderboardSection() {
  const LEADERBOARD = [
    { name: 'Aman Kumar', score: 420, problems: 3, helped: 156, avatar: '👤' },
    { name: 'Priya Singh', score: 380, problems: 5, helped: 120, avatar: '👩' },
    { name: 'BIT Mesra', score: 890, projects: 12, students: 45, avatar: '🎓' },
    { name: 'Dr. Pathak', score: 940, reviews: 28, mentored: 6, avatar: '🕵️' },
    { name: 'GeoTech Solutions', score: 820, sponsored: 5, invested: 1250000, avatar: '🏢' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>🏆 Civic Leaderboard</h3>
      {LEADERBOARD.map((item, i) => (
        <div key={i} style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'default', boxShadow: 'var(--shadow-xs)' }}>
          <span style={{ fontSize: '1.4rem' }}>{item.avatar}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.problems || item.projects || item.reviews || item.sponsored} items</div>
          </div>
          <div style={{ fontWeight: 900, color: '#f59e0b', fontSize: '1.1rem' }}>{item.score}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Expert Section ───────────────────────────────────────────────────────────
function ExpertSection() {
  const EXPERTS = [
    { name: 'Dr. Ramesh Pathak', expertise: 'Hydrology & IoT', rating: 4.8, available: true, avatar: '🕵️' },
    { name: 'Dr. S. K. Bose', expertise: 'Civil Engineering', rating: 4.9, available: true, avatar: '🕵️' },
    { name: 'Prof. Meera Jha', expertise: 'Environmental Science', rating: 4.7, available: false, avatar: '🕵️' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>🕵️ Expert Marketplace</h3>
      {EXPERTS.map((exp, i) => (
        <div key={i} style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'default', boxShadow: 'var(--shadow-xs)' }}>
          <span style={{ fontSize: '1.4rem' }}>{exp.avatar}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{exp.name}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{exp.expertise} · ⭐ {exp.rating}</div>
          </div>
          <span style={{ padding: '3px 8px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 700, background: exp.available ? 'var(--success-light)' : 'var(--warning-light)', color: exp.available ? 'var(--success)' : 'var(--warning)' }}>
            {exp.available ? 'Available' : 'Busy'}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Intelligence Section ─────────────────────────────────────────────────────
function IntelligenceSection() {
  const ALERTS = [
    { title: 'Monsoon flooding escalation in Dumka', severity: 'critical', trend: '+45%' },
    { title: 'Water contamination in Ranchi Ward 14', severity: 'high', trend: '+32%' },
    { title: 'School infrastructure damage reports', severity: 'medium', trend: '+28%' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>🧠 AI Intelligence Alerts</h3>
      {ALERTS.map((alert, i) => (
        <div key={i} style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderLeft: '4px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'default', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{alert.title}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 700, marginTop: '2px' }}>Severity: {alert.severity.toUpperCase()} · Trend: {alert.trend}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
