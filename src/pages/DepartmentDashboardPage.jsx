import React, { useState, useEffect } from 'react';
import {
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserCheck,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  TrendingUp,
  Award,
  Calendar,
  Eye,
  RefreshCw,
  Scale,
  Zap,
  Activity
} from 'lucide-react';
import { accountabilityService, DEPARTMENTS } from '../services/accountabilityService';
import { civicIntelligenceEngine } from '../services/civicIntelligenceEngine';
import SlaCountdownTimer from '../components/SlaCountdownTimer';
import DeptPerformanceBadge from '../components/DeptPerformanceBadge';
import EmergencyCivicBanner from '../components/EmergencyCivicBanner';
import OrganisationRecoveryPlanModal from '../components/OrganisationRecoveryPlanModal';
import WorkloadBalancingPanel from '../components/WorkloadBalancingPanel';
import PredictiveMaintenanceCard from '../components/PredictiveMaintenanceCard';

export default function DepartmentDashboardPage({ currentUser, challenges = [], onNavigate }) {
  const [selectedDeptId, setSelectedDeptId] = useState('pwd_roads');
  const [dashboardTab, setDashboardTab] = useState('queue'); // 'queue' | 'workload' | 'predictive'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeComplaint, setActiveComplaint] = useState(null);
  const [updateText, setUpdateText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  const dept = accountabilityService.getDepartmentById(selectedDeptId);
  const scoreData = accountabilityService.getDepartmentScore(selectedDeptId);

  // Filter challenges routed to this department
  const deptChallenges = challenges.filter(c => {
    const matchedDept = c.department_id || accountabilityService.matchDepartment(c.category, c.title, c.description).id;
    return matchedDept === selectedDeptId;
  });

  const filteredChallenges = deptChallenges.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (c.title || '').toLowerCase().includes(q) || (c.location || '').toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate quick stats
  const totalCount = deptChallenges.length;
  const inProgressCount = deptChallenges.filter(c => ['in_progress', 'pilot', 'active_development'].includes(c.status)).length;
  const resolvedCount = deptChallenges.filter(c => c.status === 'resolved').length;
  const pendingCount = deptChallenges.filter(c => !['resolved', 'in_progress'].includes(c.status)).length;

  const handlePostUpdate = (challengeId, stageName, note) => {
    setIsUpdating(true);
    try {
      accountabilityService.addComplaintUpdate(challengeId, {
        stage: stageName,
        note: note || updateText,
        actor: currentUser?.name || dept.head,
        role: `${dept.shortName} Authority`
      });
      setUpdateText('');
      setRefreshKey(prev => prev + 1);
      alert('Status update posted to public complaint tracking ledger.');
    } catch (e) {
      console.warn('Update error:', e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (challengeId, newStatus) => {
    accountabilityService.addComplaintUpdate(challengeId, {
      stage: newStatus === 'resolved' ? 'resolved' : 'work_started',
      note: `Department transitioned status to "${newStatus.replace('_', ' ')}".`,
      actor: currentUser?.name || dept.head,
      role: `${dept.shortName} Authority`
    });

    const target = challenges.find(c => c.id === challengeId);
    if (target) {
      target.status = newStatus;
    }
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      
      {/* PILLAR 28: Emergency Civic Mode Protocol Banner */}
      <EmergencyCivicBanner />

      {/* Header */}
      <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(27,42,74,0.08)', border: '1px solid rgba(27,42,74,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 700 }}>
            <Building2 size={13} color="var(--primary)" /> Department Operations & Accountability Console
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>
            {dept.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Officer Head: <strong style={{ color: 'var(--text-primary)' }}>{dept.head}</strong> · Helpline: {dept.contact}
          </p>
        </div>

        {/* Dept Selector & Score Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: '#ffffff',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {DEPARTMENTS.map(d => (
              <option key={d.id} value={d.id}>
                {d.icon} {d.shortName}
              </option>
            ))}
          </select>

          <DeptPerformanceBadge deptId={selectedDeptId} showDetails={true} />

          {/* PILLAR 18: Organisation Recovery Mode Button */}
          <button
            onClick={() => setShowRecoveryModal(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(217, 119, 6, 0.4)',
              background: '#fffbeb',
              color: '#b45309',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <TrendingUp size={14} /> AI Recovery Plan
          </button>
        </div>
      </div>

      {/* Dashboard View Switcher */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
        {[
          { id: 'queue', label: `Assigned Queue (${deptChallenges.length})`, icon: <Building2 size={14} /> },
          { id: 'workload', label: 'Workload Balancing & Officers', icon: <Scale size={14} /> },
          { id: 'predictive', label: 'Predictive Maintenance Alerts', icon: <Sparkles size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setDashboardTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: dashboardTab === tab.id ? '1px solid var(--primary)' : '1px solid transparent',
              background: dashboardTab === tab.id ? 'var(--primary-light)' : 'transparent',
              color: dashboardTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: dashboardTab === tab.id ? 800 : 500,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {dashboardTab === 'workload' && <WorkloadBalancingPanel />}
      {dashboardTab === 'predictive' && <PredictiveMaintenanceCard />}

      {dashboardTab === 'queue' && <>
      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Assigned Issues', value: totalCount, icon: <Building2 size={18} />, color: 'var(--primary)' },
          { label: 'Pending Action', value: pendingCount, icon: <Clock size={18} />, color: '#d97706' },
          { label: 'Work In Progress', value: inProgressCount, icon: <TrendingUp size={18} />, color: '#0284c7' },
          { label: 'Resolved Tickets', value: resolvedCount, icon: <CheckCircle2 size={18} />, color: '#059669' },
          { label: 'SLA Compliance', value: `${scoreData.slaCompliance}%`, icon: <ShieldCheck size={18} />, color: scoreData.slaCompliance >= 80 ? '#059669' : '#dc2626' },
          { label: 'Credit Score', value: `${scoreData.score}/100`, icon: <Award size={18} />, color: scoreData.badgeColor }
        ].map((m, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '14px',
              textAlign: 'center',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px'
            }}
          >
            <div style={{ color: m.color, marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
              {m.icon}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Queue & Detail Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: activeComplaint ? '1fr 1fr' : '1fr', gap: '20px' }}>
        
        {/* Issue Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all', label: `All (${deptChallenges.length})` },
                { id: 'under_review', label: 'Pending' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'resolved', label: 'Resolved' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: statusFilter === f.id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: statusFilter === f.id ? 'var(--primary-light)' : '#ffffff',
                    color: statusFilter === f.id ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: statusFilter === f.id ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '4px 10px', width: '200px' }}>
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search ticket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.78rem', marginLeft: '6px', width: '100%' }}
              />
            </div>
          </div>

          {/* Cards List */}
          {filteredChallenges.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No issues found in this department queue.
            </div>
          ) : (
            filteredChallenges.map(c => {
              const isSelected = activeComplaint?.id === c.id;
              const effectiveSla = c.sla_deadline || accountabilityService.calculateSlaDeadline(c.created_at, dept.slaDays);

              return (
                <div
                  key={c.id}
                  className="glass-card"
                  onClick={() => setActiveComplaint(c)}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(27,42,74,0.03)' : '#ffffff',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: c.severity === 'critical' ? '#fee2e2' : '#fef3c7',
                          color: c.severity === 'critical' ? '#dc2626' : '#b45309',
                          marginRight: '6px'
                        }}
                      >
                        {c.severity || 'Medium'}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Ticket #{c.id.slice(0, 8)}
                      </span>
                    </div>

                    <SlaCountdownTimer slaDeadline={effectiveSla} isResolved={c.status === 'resolved'} compact={true} />
                  </div>

                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {c.title}
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {c.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 700 }}>
                      Manage Issue <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Complaint Detail & Action Workspace */}
        {activeComplaint && (
          <div
            className="glass-card"
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'sticky',
              top: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ticket #{activeComplaint.id.slice(0, 8)}</span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {activeComplaint.title}
                </h2>
              </div>
              <button
                onClick={() => onNavigate(`challenge/${activeComplaint.id}`)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <Eye size={14} /> View Full Detail
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {activeComplaint.description}
            </p>

            {/* Department Action Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Department Action Stage:
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  onClick={() => handleStatusChange(activeComplaint.id, 'in_progress')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #0284c7',
                    background: activeComplaint.status === 'in_progress' ? '#0284c7' : '#f0f9ff',
                    color: activeComplaint.status === 'in_progress' ? '#fff' : '#0284c7',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🚀 Accept & Start
                </button>

                <button
                  onClick={() => handleStatusChange(activeComplaint.id, 'pilot')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #d97706',
                    background: activeComplaint.status === 'pilot' ? '#d97706' : '#fffbeb',
                    color: activeComplaint.status === 'pilot' ? '#fff' : '#d97706',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🚧 Field Work
                </button>

                <button
                  onClick={() => handleStatusChange(activeComplaint.id, 'resolved')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #059669',
                    background: activeComplaint.status === 'resolved' ? '#059669' : '#f0fdf4',
                    color: activeComplaint.status === 'resolved' ? '#fff' : '#059669',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✅ Mark Resolved
                </button>
              </div>
            </div>

            {/* Post Progress Update */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Publish Public Progress Note:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. Field crew dispatched with 5 tons asphalt..."
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => handlePostUpdate(activeComplaint.id, 'progress_update', updateText)}
                  disabled={isUpdating || !updateText.trim()}
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.78rem' }}
                >
                  <Send size={14} /> Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </> }

      {/* PILLAR 18: Organisation Recovery Plan Modal */}
      {showRecoveryModal && (
        <OrganisationRecoveryPlanModal
          deptId={selectedDeptId}
          onClose={() => setShowRecoveryModal(false)}
        />
      )}
    </div>
  );
}
