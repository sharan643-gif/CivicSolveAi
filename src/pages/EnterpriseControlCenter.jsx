import React, { useState } from 'react';
import { Shield, Activity, Users, Building2, Globe, Brain, AlertTriangle, TrendingUp, TrendingDown, Eye, Zap, Heart, DollarSign, Target, CheckCircle, Clock, BarChart3, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { platformHealthService, aiUsageService, civicHealthService, securityEventService, complianceService, backupStatusService, incidentService, earlyWarningService } from '../services/enterprise100Service';
import { DEPT_SCORECARDS } from '../services/advanced40Service';

function StatCard({ icon, label, value, sub, color, trend }) {
  return (
    <div className="glass-card" style={{ padding: '14px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
      <div style={{ color, marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
      {trend && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '4px' }}>
        {trend === 'up' ? <ArrowUpRight size={12} color="#047857" /> : trend === 'down' ? <ArrowDownRight size={12} color="#dc2626" /> : <Minus size={12} color="#b45309" />}
        <span style={{ fontSize: '0.65rem', color: trend === 'up' ? '#047857' : trend === 'down' ? '#dc2626' : '#b45309', fontWeight: 700 }}>{trend}</span>
      </div>}
    </div>
  );
}

function HealthBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '0.78rem', color, fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

export default function EnterpriseControlCenter() {
  const [view, setView] = useState('overview');
  const platformHealth = platformHealthService.getData();
  const aiUsage = aiUsageService.getData();
  const civicHealth = civicHealthService.getData();
  const securityEvents = securityEventService.getAll();
  const compliance = complianceService.getAll();
  const backup = backupStatusService.getData();
  const incidents = incidentService.getAll();
  const warnings = earlyWarningService.getData();
  const deptScores = DEPT_SCORECARDS;

  const views = [
    { id: 'overview', label: 'Overview', icon: <Eye size={13} /> },
    { id: 'platform', label: 'Platform', icon: <Shield size={13} /> },
    { id: 'civic', label: 'Civic Health', icon: <Heart size={13} /> },
    { id: 'operations', label: 'Operations', icon: <Activity size={13} /> },
    { id: 'ai', label: 'AI Engine', icon: <Brain size={13} /> },
    { id: 'security', label: 'Security', icon: <Shield size={13} /> },
    { id: 'incidents', label: 'Incidents', icon: <AlertTriangle size={13} /> },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#dc2626', marginBottom: '8px', fontWeight: 700 }}>
          <Shield size={13} color="#dc2626" /> Enterprise Control Center
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>CivicSolve AI Command</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Platform intelligence, health telemetry, SLA tracking, and administrative control.</p>
      </div>

      {/* View Tabs */}
      <div className="mobile-scroll-tabs" style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px', background: '#ffffff', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)', scrollbarWidth: 'none' }}>
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '6px', border: 'none', flexShrink: 0, background: view === v.id ? 'var(--primary)' : 'transparent', color: view === v.id ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: view === v.id ? 700 : 500, whiteSpace: 'nowrap' }}>
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {view === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <StatCard icon={<Users size={18} />} label="Total Users" value="2,847" color="var(--primary)" trend="up" />
            <StatCard icon={<Building2 size={18} />} label="Organizations" value="34" color="#7c3aed" trend="up" />
            <StatCard icon={<Target size={18} />} label="Active Projects" value="18" color="#047857" />
            <StatCard icon={<AlertTriangle size={18} />} label="Critical Cases" value="7" color="#dc2626" trend="down" />
            <StatCard icon={<Heart size={18} />} label="Civic Health" value={`${civicHealth.overall}%`} color="#b45309" trend="up" />
            <StatCard icon={<Brain size={18} />} label="AI Requests" value={`${(aiUsage.totalRequests/1000).toFixed(1)}K`} color="#0284c7" />
            <StatCard icon={<DollarSign size={18} />} label="Total Funding" value="₹2.5Cr" color="#047857" />
            <StatCard icon={<CheckCircle size={18} />} label="Problems Resolved" value="67" color="#047857" trend="up" />
          </div>

          {/* Platform Health */}
          <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}><Activity size={14} color="#047857" /> Platform Health</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {Object.entries(platformHealth).map(([key, val]) => (
                <div key={key} style={{ padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'capitalize', fontWeight: 600 }}>{key}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: val.status === 'healthy' ? '#047857' : '#dc2626' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700, textTransform: 'capitalize' }}>{val.status}</span>
                  </div>
                  {val.latency && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>{val.latency}ms</div>}
                  {val.uptime && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{val.uptime}%</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Early Warnings */}
          <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}><AlertTriangle size={14} color="#b45309" /> Early Warnings</h3>
            {warnings.map(w => (
              <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: w.severity === 'critical' ? '#fef2f2' : '#f8fafc', marginBottom: '6px', border: `1px solid ${w.severity === 'critical' ? '#fecaca' : 'var(--border-subtle)'}` }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: w.severity === 'critical' ? '#dc2626' : w.severity === 'high' ? '#d97706' : 'var(--primary)', flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500 }}>{w.alert}</div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>{w.date}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PLATFORM */}
      {view === 'platform' && (
        <>
          <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>Backup Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
              {[
                { label: 'Status', value: backup.status, color: '#047857' },
                { label: 'Last Backup', value: new Date(backup.lastBackup).toLocaleDateString(), color: 'var(--primary)' },
                { label: 'Size', value: backup.size, color: '#7c3aed' },
                { label: 'Retention', value: backup.retention, color: '#b45309' },
              ].map((b, i) => (
                <div key={i} style={{ padding: '12px 10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{b.label}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: b.color, marginTop: '2px' }}>{b.value}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>{backup.note}</p>
          </div>

          <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>Compliance Status</h3>
            {compliance.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.status === 'compliant' ? '#047857' : '#d97706', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>{c.policy}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.evidence}</div>
                </div>
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, background: c.status === 'compliant' ? '#f0fdf4' : '#fffbeb', color: c.status === 'compliant' ? '#047857' : '#b45309', border: `1px solid ${c.status === 'compliant' ? '#bbf7d0' : '#fde68a'}` }}>{c.status}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CIVIC HEALTH */}
      {view === 'civic' && (
        <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: 'var(--primary-light)', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>{civicHealth.overall}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Overall Civic Health Index</div>
          </div>
          {civicHealth.categories.map(cat => (
            <HealthBar key={cat.name} label={`${cat.icon} ${cat.name}`} score={cat.score} color={cat.score >= 75 ? '#047857' : cat.score >= 60 ? '#d97706' : '#dc2626'} />
          ))}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 700 }}>Trend History</h4>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '50px', background: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
              {civicHealth.history.map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h.score}</span>
                  <div style={{ width: '100%', height: `${h.score * 0.4}px`, background: 'var(--primary)', borderRadius: '3px' }} />
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{h.month.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OPERATIONS */}
      {view === 'operations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          {deptScores.map(dept => (
            <div key={dept.deptId} className="glass-card" style={{ padding: '16px', borderLeft: `4px solid ${dept.color}`, background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 700 }}>{dept.shortName}</span>
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, background: dept.trend === 'improving' ? '#f0fdf4' : dept.trend === 'declining' ? '#fef2f2' : '#fffbeb', color: dept.trend === 'improving' ? '#047857' : dept.trend === 'declining' ? '#dc2626' : '#b45309' }}>{dept.trend}</span>
              </div>
              <HealthBar label="SLA Compliance" score={dept.slaCompliance} color={dept.slaCompliance >= 80 ? '#047857' : dept.slaCompliance >= 60 ? '#d97706' : '#dc2626'} />
              <HealthBar label="Satisfaction" score={dept.citizenSatisfaction * 20} color={dept.citizenSatisfaction >= 4 ? '#047857' : dept.citizenSatisfaction >= 3.5 ? '#d97706' : '#dc2626'} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 500 }}>
                <span>✅ {dept.completedProjects} resolved</span>
                <span>⏳ {dept.pendingCases} pending</span>
                <span>📅 {dept.resolutionTime}d avg</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI */}
      {view === 'ai' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <StatCard icon={<Zap size={18} />} label="Total Requests" value={`${(aiUsage.totalRequests/1000).toFixed(1)}K`} color="var(--primary)" />
            <StatCard icon={<Brain size={18} />} label="Avg Latency" value={`${aiUsage.avgLatency}ms`} color="#7c3aed" />
            <StatCard icon={<AlertTriangle size={18} />} label="Error Rate" value={`${aiUsage.errorRate}%`} color="#047857" />
            <StatCard icon={<TrendingUp size={18} />} label="Tokens Used" value={`${(aiUsage.totalTokens/1000000).toFixed(1)}M`} color="#b45309" />
          </div>
          <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>Daily AI Usage</h3>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '60px', background: '#f8fafc', padding: '8px', borderRadius: '8px' }}>
              {aiUsage.dailyUsage.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontWeight: 600 }}>{d.requests}</span>
                  <div style={{ width: '100%', height: `${(d.requests / 1500) * 44}px`, background: 'var(--primary)', borderRadius: '3px' }} />
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{d.date.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>AI Providers</h3>
            {aiUsage.providers.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)', marginBottom: '6px', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{p.name} — {p.model}</span>
                <span style={{ color: 'var(--text-muted)' }}>{p.requests} req · {p.avgLatency}ms · {p.errorRate}% err</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SECURITY */}
      {view === 'security' && (
        <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>Security Events</h3>
          {securityEvents.map(e => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: e.severity === 'high' ? '#fef2f2' : '#f8fafc', marginBottom: '6px', border: `1px solid ${e.severity === 'high' ? '#fecaca' : 'var(--border-subtle)'}` }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: e.severity === 'high' ? '#dc2626' : e.severity === 'medium' ? '#d97706' : '#047857', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 700 }}>{e.type.replace(/_/g, ' ').toUpperCase()}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{e.details}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>User: {e.user} · {new Date(e.time).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INCIDENTS */}
      {view === 'incidents' && (
        <div className="glass-card" style={{ padding: '18px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 700 }}>System Incidents</h3>
          {incidents.map(inc => (
            <div key={inc.id} style={{ padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{inc.title}</span>
                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, background: inc.severity === 'high' ? '#fef2f2' : '#fffbeb', color: inc.severity === 'high' ? '#dc2626' : '#b45309', border: `1px solid ${inc.severity === 'high' ? '#fecaca' : '#fde68a'}` }}>{inc.severity}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{inc.impact}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Root Cause: {inc.rootCause}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {new Date(inc.startTime).toLocaleString()} → {inc.endTime ? new Date(inc.endTime).toLocaleString() : 'Ongoing'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
