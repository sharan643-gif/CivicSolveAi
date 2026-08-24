import React, { useState } from 'react';
import { Shield, Activity, Users, Building2, Globe, Brain, AlertTriangle, TrendingUp, TrendingDown, Eye, Zap, Heart, DollarSign, Target, CheckCircle, Clock, BarChart3, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { platformHealthService, aiUsageService, civicHealthService, securityEventService, complianceService, backupStatusService, incidentService, earlyWarningService } from '../services/enterprise100Service';
import { DEPT_SCORECARDS } from '../services/advanced40Service';

function StatCard({ icon, label, value, sub, color, trend }) {
  return (
    <div className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
      <div style={{ color, marginBottom: '6px' }}>{icon}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
      {trend && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '4px' }}>
        {trend === 'up' ? <ArrowUpRight size={10} color="#10b981" /> : trend === 'down' ? <ArrowDownRight size={10} color="#ef4444" /> : <Minus size={10} color="#f59e0b" />}
        <span style={{ fontSize: '0.6rem', color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#f59e0b' }}>{trend}</span>
      </div>}
    </div>
  );
}

function HealthBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '0.75rem', color, fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
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
    { id: 'ai', label: 'AI', icon: <Brain size={13} /> },
    { id: 'security', label: 'Security', icon: <Shield size={13} /> },
    { id: 'incidents', label: 'Incidents', icon: <AlertTriangle size={13} /> },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#f87171', marginBottom: '8px' }}>
          <Shield size={12} /> Enterprise Control Center
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>CivicSolve AI Command</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ultimate platform intelligence, health monitoring, and administrative control.</p>
      </div>

      {/* View Tabs */}
      <div className="mobile-scroll-tabs" style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', border: 'none', flexShrink: 0, background: view === v.id ? 'rgba(239,68,68,0.12)' : 'transparent', color: view === v.id ? '#f87171' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: view === v.id ? 700 : 400, whiteSpace: 'nowrap' }}>
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {view === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <StatCard icon={<Users size={18} />} label="Total Users" value="2,847" color="#3b82f6" trend="up" />
            <StatCard icon={<Building2 size={18} />} label="Organizations" value="34" color="#8b5cf6" trend="up" />
            <StatCard icon={<Target size={18} />} label="Active Projects" value="18" color="#10b981" />
            <StatCard icon={<AlertTriangle size={18} />} label="Critical Cases" value="7" color="#ef4444" trend="down" />
            <StatCard icon={<Heart size={18} />} label="Civic Health" value={`${civicHealth.overall}%`} color="#f59e0b" trend="up" />
            <StatCard icon={<Brain size={18} />} label="AI Requests" value={`${(aiUsage.totalRequests/1000).toFixed(1)}K`} color="#06b6d4" />
            <StatCard icon={<DollarSign size={18} />} label="Total Funding" value="₹2.5Cr" color="#10b981" />
            <StatCard icon={<CheckCircle size={18} />} label="Problems Resolved" value="67" color="#10b981" trend="up" />
          </div>

          {/* Platform Health */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} color="#10b981" /> Platform Health</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {Object.entries(platformHealth).map(([key, val]) => (
                <div key={key} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: val.status === 'healthy' ? '#10b981' : '#ef4444' }} />
                    <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>{val.status}</span>
                  </div>
                  {val.latency && <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px' }}>{val.latency}ms</div>}
                  {val.uptime && <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{val.uptime}%</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Early Warnings */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertTriangle size={14} color="#f59e0b" /> Early Warnings</h3>
            {warnings.map(w => (
              <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: w.severity === 'critical' ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)', marginBottom: '6px', border: `1px solid ${w.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'var(--border-subtle)'}` }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: w.severity === 'critical' ? '#ef4444' : w.severity === 'high' ? '#f59e0b' : '#3b82f6', flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: '0.82rem', color: '#fff' }}>{w.alert}</div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>{w.date}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PLATFORM */}
      {view === 'platform' && (
        <>
          <div className="glass-card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>Backup Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
              {[
                { label: 'Status', value: backup.status, color: '#10b981' },
                { label: 'Last Backup', value: new Date(backup.lastBackup).toLocaleDateString(), color: '#3b82f6' },
                { label: 'Size', value: backup.size, color: '#8b5cf6' },
                { label: 'Retention', value: backup.retention, color: '#f59e0b' },
              ].map((b, i) => (
                <div key={i} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{b.label}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: b.color, marginTop: '2px' }}>{b.value}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>{backup.note}</p>
          </div>

          <div className="glass-card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>Compliance</h3>
            {compliance.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', marginBottom: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.status === 'compliant' ? '#10b981' : '#f59e0b', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', color: '#fff' }}>{c.policy}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{c.evidence}</div>
                </div>
                <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: c.status === 'compliant' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: c.status === 'compliant' ? '#10b981' : '#f59e0b' }}>{c.status}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CIVIC HEALTH */}
      {view === 'civic' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(16,185,129,0.06)', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-display)' }}>{civicHealth.overall}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Overall Civic Health Index</div>
          </div>
          {civicHealth.categories.map(cat => (
            <HealthBar key={cat.name} label={`${cat.icon} ${cat.name}`} score={cat.score} color={cat.score >= 75 ? '#10b981' : cat.score >= 60 ? '#f59e0b' : '#ef4444'} />
          ))}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '8px' }}>Trend</h4>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '50px' }}>
              {civicHealth.history.map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{h.score}</span>
                  <div style={{ width: '100%', height: `${h.score * 0.5}px`, background: '#10b981', borderRadius: '3px', opacity: 0.7 }} />
                  <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>{h.month.split(' ')[0]}</span>
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
            <div key={dept.deptId} className="glass-card" style={{ padding: '14px', borderLeft: `3px solid ${dept.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>{dept.shortName}</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: dept.trend === 'improving' ? 'rgba(16,185,129,0.1)' : dept.trend === 'declining' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: dept.trend === 'improving' ? '#10b981' : dept.trend === 'declining' ? '#ef4444' : '#f59e0b' }}>{dept.trend}</span>
              </div>
              <HealthBar label="SLA Compliance" score={dept.slaCompliance} color={dept.slaCompliance >= 80 ? '#10b981' : dept.slaCompliance >= 60 ? '#f59e0b' : '#ef4444'} />
              <HealthBar label="Satisfaction" score={dept.citizenSatisfaction * 20} color={dept.citizenSatisfaction >= 4 ? '#10b981' : dept.citizenSatisfaction >= 3.5 ? '#f59e0b' : '#ef4444'} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
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
            <StatCard icon={<Zap size={18} />} label="Total Requests" value={`${(aiUsage.totalRequests/1000).toFixed(1)}K`} color="#06b6d4" />
            <StatCard icon={<Brain size={18} />} label="Avg Latency" value={`${aiUsage.avgLatency}ms`} color="#8b5cf6" />
            <StatCard icon={<AlertTriangle size={18} />} label="Error Rate" value={`${aiUsage.errorRate}%`} color="#10b981" />
            <StatCard icon={<TrendingUp size={18} />} label="Tokens Used" value={`${(aiUsage.totalTokens/1000000).toFixed(1)}M`} color="#f59e0b" />
          </div>
          <div className="glass-card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>Daily AI Usage</h3>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '60px' }}>
              {aiUsage.dailyUsage.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{d.requests}</span>
                  <div style={{ width: '100%', height: `${(d.requests / 1500) * 60}px`, background: '#06b6d4', borderRadius: '3px', opacity: 0.7 }} />
                  <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>{d.date.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>AI Providers</h3>
            {aiUsage.providers.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', marginBottom: '4px', fontSize: '0.82rem' }}>
                <span style={{ color: '#fff' }}>{p.name} — {p.model}</span>
                <span style={{ color: 'var(--text-muted)' }}>{p.requests} req · {p.avgLatency}ms · {p.errorRate}% err</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SECURITY */}
      {view === 'security' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>Security Events</h3>
          {securityEvents.map(e => (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: e.severity === 'high' ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)', marginBottom: '6px', border: `1px solid ${e.severity === 'high' ? 'rgba(239,68,68,0.15)' : 'var(--border-subtle)'}` }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: e.severity === 'high' ? '#ef4444' : e.severity === 'medium' ? '#f59e0b' : '#10b981', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{e.type.replace(/_/g, ' ').toUpperCase()}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{e.details}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>User: {e.user} · {new Date(e.time).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INCIDENTS */}
      {view === 'incidents' && (
        <div className="glass-card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '12px' }}>System Incidents</h3>
          {incidents.map(inc => (
            <div key={inc.id} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{inc.title}</span>
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '100px', background: inc.severity === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: inc.severity === 'high' ? '#ef4444' : '#f59e0b' }}>{inc.severity}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{inc.impact}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Root Cause: {inc.rootCause}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {new Date(inc.startTime).toLocaleString()} → {inc.endTime ? new Date(inc.endTime).toLocaleString() : 'Ongoing'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
