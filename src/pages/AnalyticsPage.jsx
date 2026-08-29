import React, { useState } from 'react';
import { BarChart3, TrendingUp, MapPin, Building, Users, Activity, Clock, CheckCircle } from 'lucide-react';
import { analyticsService, departmentService } from '../services/featureService';

export default function AnalyticsPage({ challenges = [] }) {
  const analyticsData = analyticsService.getData();
  const deptPerformance = departmentService.getPerformance();

  const stats = [
    { label: 'Total Problems', value: analyticsData.problemsByCategory.reduce((s, c) => s + c.count, 0), icon: Activity, color: '#003087' },
    { label: 'Resolution Rate', value: '48%', icon: CheckCircle, color: '#047857' },
    { label: 'Avg Resolution', value: '21.5 days', icon: Clock, color: '#b45309' },
    { label: 'Active Projects', value: '18', icon: TrendingUp, color: '#7c3aed' },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', border: '1px solid rgba(0,48,135,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 700 }}>
          <BarChart3 size={13} color="var(--primary)" /> Civic Analytics & Performance
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Civic Analytics Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Data-driven insights into civic problem patterns, geographical spread, and resolution efficiency.</p>
      </div>

      {/* Key Metrics */}
      <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '16px', textAlign: 'center', cursor: 'default', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <Icon size={18} color={stat.color} />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {/* Problems by Category */}
        <div className="glass-l2 reveal" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>Problems by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {analyticsData.problemsByCategory.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', width: '130px', flexShrink: 0, fontWeight: 500 }}>{cat.category}</span>
                <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cat.percentage}%`, background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', width: '36px', textAlign: 'right' }}>{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="glass-l2 reveal" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>Monthly Trend</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '150px', padding: '0 4px' }}>
            {analyticsData.monthlyTrend.map((m, i) => {
              const maxVal = Math.max(...analyticsData.monthlyTrend.map(x => x.reported));
              const barH1 = (m.reported / maxVal) * 100;
              const barH2 = (m.resolved / maxVal) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '120px' }}>
                    <div style={{ width: '12px', height: `${barH1}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
                    <div style={{ width: '12px', height: `${barH2}%`, background: '#047857', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '10px', fontSize: '0.72rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--text-secondary)' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary)' }} /> Reported</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--text-secondary)' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#047857' }} /> Resolved</span>
          </div>
        </div>
      </div>

      {/* Location Distribution */}
      <div className="glass-l2 reveal" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>Problems by Location</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
          {analyticsData.problemsByLocation.map((loc, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{loc.district}</div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', fontWeight: 600 }}>
                <span style={{ color: '#dc2626' }}>🔴 {loc.critical}</span>
                <span style={{ color: '#ea580c' }}>🟠 {loc.high}</span>
                <span style={{ color: '#ca8a04' }}>🟡 {loc.medium}</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '6px' }}>{loc.count} total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Performance */}
      <div className="glass-l2 reveal" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>Department Performance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {deptPerformance.map((dept, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: '10px', background: '#ffffff', border: `1px solid var(--border-subtle)`, borderTop: `3px solid ${dept.color}`, textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: dept.color, marginBottom: '4px' }}>{dept.name}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>{dept.resolved}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>resolved</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Avg: {dept.avgDays} days</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
