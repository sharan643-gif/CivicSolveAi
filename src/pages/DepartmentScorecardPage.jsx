import React, { useState } from 'react';
import { Building2, TrendingUp, TrendingDown, Minus, Clock, Users, ThumbsUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { deptScorecardService, resolutionEfficiencyService, satisfactionService } from '../services/advanced40Service';

export default function DepartmentScorecardPage() {
  const depts = deptScorecardService.getAll();
  const efficiency = resolutionEfficiencyService.getData();
  const satisfaction = satisfactionService.getData();
  const [selectedDept, setSelectedDept] = useState(null);

  const trendIcons = { improving: <TrendingUp size={14} color="#10b981" />, declining: <TrendingDown size={14} color="#ef4444" />, stable: <Minus size={14} color="#f59e0b" /> };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#fbbf24', marginBottom: '8px' }}>
          <Building2 size={12} /> Department Scorecard
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Department Performance</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Compare department metrics, SLA compliance, and citizen satisfaction.</p>
      </div>

      {/* Platform-wide Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        {[
          { label: 'Avg Response Time', value: `${efficiency.avgResponseTime} days`, icon: <Clock size={16} />, color: '#3b82f6' },
          { label: 'Avg Resolution Time', value: `${efficiency.avgResolutionTime} days`, icon: <CheckCircle size={16} />, color: '#10b981' },
          { label: 'First Response Rate', value: `${efficiency.firstResponseRate}%`, icon: <ThumbsUp size={16} />, color: '#8b5cf6' },
          { label: 'Escalation Rate', value: `${efficiency.escalationRate}%`, icon: <AlertTriangle size={16} />, color: '#f59e0b' },
          { label: 'Overall Satisfaction', value: `${satisfaction.overall}/5.0`, icon: <ThumbsUp size={16} />, color: '#06b6d4' },
          { label: 'Reopened Cases', value: efficiency.reopenedCases, icon: <AlertTriangle size={16} />, color: '#ef4444' },
        ].map((m, i) => (
          <div key={i} className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ color: m.color, marginBottom: '6px' }}>{m.icon}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)' }}>{m.value}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Department Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {depts.map(dept => (
          <div key={dept.deptId} className="glass-card" style={{ padding: '16px', borderLeft: `4px solid ${dept.color}`, cursor: 'pointer' }} onClick={() => setSelectedDept(selectedDept === dept.deptId ? null : dept.deptId)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 700 }}>{dept.shortName}</h3>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{dept.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {trendIcons[dept.trend]}
                <span style={{ fontSize: '0.68rem', color: dept.trend === 'improving' ? '#10b981' : dept.trend === 'declining' ? '#ef4444' : '#f59e0b', textTransform: 'capitalize' }}>{dept.trend}</span>
              </div>
            </div>

            {/* Satisfaction Bar */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Citizen Satisfaction</span>
                <span style={{ fontSize: '0.72rem', color: dept.color, fontWeight: 700 }}>{dept.citizenSatisfaction}/5.0</span>
              </div>
              <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(dept.citizenSatisfaction / 5) * 100}%`, background: dept.color, borderRadius: '2px' }} />
              </div>
            </div>

            {/* SLA Compliance */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SLA Compliance</span>
                <span style={{ fontSize: '0.72rem', color: dept.slaCompliance >= 80 ? '#10b981' : dept.slaCompliance >= 60 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{dept.slaCompliance}%</span>
              </div>
              <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${dept.slaCompliance}%`, background: dept.slaCompliance >= 80 ? '#10b981' : dept.slaCompliance >= 60 ? '#f59e0b' : '#ef4444', borderRadius: '2px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '10px' }}>
              <div style={{ textAlign: 'center', padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>{dept.completedProjects}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Resolved</div>
              </div>
              <div style={{ textAlign: 'center', padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b' }}>{dept.pendingCases}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Pending</div>
              </div>
              <div style={{ textAlign: 'center', padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#3b82f6' }}>{dept.resolutionTime}d</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Avg Days</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
