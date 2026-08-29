import React, { useState } from 'react';
import { Building2, TrendingUp, TrendingDown, Minus, Clock, Users, ThumbsUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { deptScorecardService, resolutionEfficiencyService, satisfactionService } from '../services/advanced40Service';

export default function DepartmentScorecardPage() {
  const depts = deptScorecardService.getAll();
  const efficiency = resolutionEfficiencyService.getData();
  const satisfaction = satisfactionService.getData();
  const [selectedDept, setSelectedDept] = useState(null);

  const trendIcons = { improving: <TrendingUp size={14} color="#047857" />, declining: <TrendingDown size={14} color="#dc2626" />, stable: <Minus size={14} color="#b45309" /> };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#b45309', marginBottom: '8px', fontWeight: 700 }}>
          <Building2 size={13} color="#b45309" /> Department Scorecard
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Department Performance</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Compare department metrics, SLA resolution rates, and citizen satisfaction ratings.</p>
      </div>

      {/* Platform-wide Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
        {[
          { label: 'Avg Response Time', value: `${efficiency.avgResponseTime} days`, icon: <Clock size={16} />, color: '#003087' },
          { label: 'Avg Resolution Time', value: `${efficiency.avgResolutionTime} days`, icon: <CheckCircle size={16} />, color: '#047857' },
          { label: 'First Response Rate', value: `${efficiency.firstResponseRate}%`, icon: <ThumbsUp size={16} />, color: '#7c3aed' },
          { label: 'Escalation Rate', value: `${efficiency.escalationRate}%`, icon: <AlertTriangle size={16} />, color: '#b45309' },
          { label: 'Overall Satisfaction', value: `${satisfaction.overall}/5.0`, icon: <ThumbsUp size={16} />, color: '#0284c7' },
          { label: 'Reopened Cases', value: efficiency.reopenedCases, icon: <AlertTriangle size={16} />, color: '#dc2626' },
        ].map((m, i) => (
          <div key={i} className="glass-card" style={{ padding: '14px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
            <div style={{ color: m.color, marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>{m.icon}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{m.value}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Department Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {depts.map(dept => (
          <div key={dept.deptId} className="glass-card" style={{ padding: '18px', borderLeft: `4px solid ${dept.color}`, cursor: 'pointer', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }} onClick={() => setSelectedDept(selectedDept === dept.deptId ? null : dept.deptId)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.02rem', color: 'var(--text-primary)', fontWeight: 700 }}>{dept.shortName}</h3>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{dept.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {trendIcons[dept.trend]}
                <span style={{ fontSize: '0.7rem', color: dept.trend === 'improving' ? '#047857' : dept.trend === 'declining' ? '#dc2626' : '#b45309', textTransform: 'capitalize', fontWeight: 700 }}>{dept.trend}</span>
              </div>
            </div>

            {/* Satisfaction Bar */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Citizen Satisfaction</span>
                <span style={{ fontSize: '0.74rem', color: dept.color, fontWeight: 700 }}>{dept.citizenSatisfaction}/5.0</span>
              </div>
              <div style={{ height: '5px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(dept.citizenSatisfaction / 5) * 100}%`, background: dept.color, borderRadius: '3px' }} />
              </div>
            </div>

            {/* SLA Compliance */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>SLA Compliance</span>
                <span style={{ fontSize: '0.74rem', color: dept.slaCompliance >= 80 ? '#047857' : dept.slaCompliance >= 60 ? '#b45309' : '#dc2626', fontWeight: 700 }}>{dept.slaCompliance}%</span>
              </div>
              <div style={{ height: '5px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${dept.slaCompliance}%`, background: dept.slaCompliance >= 80 ? '#047857' : dept.slaCompliance >= 60 ? '#b45309' : '#dc2626', borderRadius: '3px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '12px' }}>
              <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '6px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#047857' }}>{dept.completedProjects}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolved</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '6px', background: '#fffbeb', border: '1px solid #fef3c7' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#b45309' }}>{dept.pendingCases}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: '6px', background: 'var(--primary-light)', border: '1px solid rgba(0,48,135,0.15)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>{dept.resolutionTime}d</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Days</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
