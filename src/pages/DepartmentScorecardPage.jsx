import React, { useState } from 'react';
import { Building2, TrendingUp, TrendingDown, Minus, Clock, Users, ThumbsUp, CheckCircle, AlertTriangle, ShieldCheck, Award, ChevronRight } from 'lucide-react';
import { deptScorecardService, resolutionEfficiencyService, satisfactionService } from '../services/advanced40Service';
import { accountabilityService, DEPARTMENTS } from '../services/accountabilityService';
import DeptPerformanceBadge from '../components/DeptPerformanceBadge';

export default function DepartmentScorecardPage() {
  const depts = deptScorecardService.getAll();
  const efficiency = resolutionEfficiencyService.getData();
  const satisfaction = satisfactionService.getData();
  const [selectedDeptId, setSelectedDeptId] = useState(null);

  const trendIcons = {
    improving: <TrendingUp size={14} color="#047857" />,
    declining: <TrendingDown size={14} color="#dc2626" />,
    stable: <Minus size={14} color="#b45309" />
  };

  const selectedScore = selectedDeptId ? accountabilityService.getDepartmentScore(selectedDeptId) : null;
  const selectedDeptObj = selectedDeptId ? accountabilityService.getDepartmentById(selectedDeptId) : null;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#b45309', marginBottom: '8px', fontWeight: 700 }}>
          <Building2 size={13} color="#b45309" /> Public Department Scorecard
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>
          Department Performance & Credit Ratings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time accountability credit scoring (0–100), SLA resolution compliance, and citizen audit ratings.
        </p>
      </div>

      {/* Platform-wide Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
        {[
          { label: 'Avg Response Time', value: `${efficiency.avgResponseTime} days`, icon: <Clock size={16} />, color: '#003087' },
          { label: 'Avg Resolution Time', value: `${efficiency.avgResolutionTime} days`, icon: <CheckCircle size={16} />, color: '#047857' },
          { label: 'First Response Rate', value: `${efficiency.firstResponseRate}%`, icon: <ThumbsUp size={16} />, color: '#7c3aed' },
          { label: 'Escalation Rate', value: `${efficiency.escalationRate}%`, icon: <AlertTriangle size={16} />, color: '#b45309' },
          { label: 'Overall Satisfaction', value: `${satisfaction.overall}/5.0`, icon: <ThumbsUp size={16} />, color: '#0284c7' },
          { label: 'Audit Escalations', value: efficiency.reopenedCases, icon: <AlertTriangle size={16} />, color: '#dc2626' },
        ].map((m, i) => (
          <div key={i} className="glass-card" style={{ padding: '14px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
            <div style={{ color: m.color, marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>{m.icon}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{m.value}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Department Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '14px' }}>
        {DEPARTMENTS.map(dept => {
          const score = accountabilityService.getDepartmentScore(dept.id);
          const isSelected = selectedDeptId === dept.id;

          return (
            <div
              key={dept.id}
              className="glass-card"
              style={{
                padding: '18px',
                borderLeft: `5px solid ${dept.color}`,
                cursor: 'pointer',
                background: isSelected ? 'rgba(0, 48, 135, 0.03)' : '#ffffff',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.15s ease'
              }}
              onClick={() => setSelectedDeptId(isSelected ? null : dept.id)}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{dept.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', color: 'var(--text-primary)', fontWeight: 800, margin: 0 }}>
                      {dept.shortName}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{dept.category}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: score.badgeColor, fontFamily: 'var(--font-display)' }}>
                    {score.score}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>CREDIT</span>
                </div>
              </div>

              {/* Citizen Satisfaction */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Citizen Satisfaction</span>
                  <span style={{ fontSize: '0.74rem', color: dept.color, fontWeight: 700 }}>{score.citizenSatisfaction}/5.0</span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(score.citizenSatisfaction / 5) * 100}%`, background: dept.color, borderRadius: '3px' }} />
                </div>
              </div>

              {/* SLA Compliance */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>SLA Legal Compliance</span>
                  <span style={{ fontSize: '0.74rem', color: score.slaCompliance >= 80 ? '#047857' : '#dc2626', fontWeight: 700 }}>{score.slaCompliance}%</span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${score.slaCompliance}%`, background: score.slaCompliance >= 80 ? '#047857' : '#dc2626', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Quick Metrics Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <div style={{ textAlign: 'center', padding: '6px 4px', borderRadius: '6px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#047857' }}>{score.totalResolved}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolved</div>
                </div>
                <div style={{ textAlign: 'center', padding: '6px 4px', borderRadius: '6px', background: '#fffbeb', border: '1px solid #fef3c7' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#b45309' }}>{score.escalationsCount}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>Disputes</div>
                </div>
                <div style={{ textAlign: 'center', padding: '6px 4px', borderRadius: '6px', background: 'var(--primary-light)', border: '1px solid rgba(0,48,135,0.15)' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)' }}>{dept.slaDays}d</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>SLA Target</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
