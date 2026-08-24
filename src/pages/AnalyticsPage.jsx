import React, { useState } from 'react';
import { BarChart3, TrendingUp, MapPin, Building, Users, Activity, Clock, CheckCircle } from 'lucide-react';
import { analyticsService, departmentService } from '../services/featureService';

export default function AnalyticsPage({ challenges = [] }) {
  const analyticsData = analyticsService.getData();
  const deptPerformance = departmentService.getPerformance();

  const stats = [
    { label: 'Total Problems', value: analyticsData.problemsByCategory.reduce((s, c) => s + c.count, 0), icon: Activity, color: '#3b82f6' },
    { label: 'Resolution Rate', value: '48%', icon: CheckCircle, color: '#10b981' },
    { label: 'Avg Resolution', value: '21.5 days', icon: Clock, color: '#f59e0b' },
    { label: 'Active Projects', value: '18', icon: TrendingUp, color: '#8b5cf6' },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#60a5fa', marginBottom: '8px' }}>
          <BarChart3 size={12} /> Civic Analytics
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Civic Analytics Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Data-driven insights into civic problem patterns and resolution performance.</p>
      </div>

      {/* Key Metrics */}
      <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center', cursor: 'default' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <Icon size={20} color={stat.color} />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Problems by Category */}
        <div className="glass-l2 reveal" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Problems by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {analyticsData.problemsByCategory.map((cat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', width: '130px', flexShrink: 0 }}>{cat.category}</span>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cat.percentage}%`, background: `linear-gradient(90deg, var(--primary), var(--ai-purple))`, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', width: '40px', textAlign: 'right' }}>{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="glass-l2 reveal" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Monthly Trend</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', padding: '0 4px' }}>
            {analyticsData.monthlyTrend.map((m, i) => {
              const maxVal = Math.max(...analyticsData.monthlyTrend.map(x => x.reported));
              const barH1 = (m.reported / maxVal) * 100;
              const barH2 = (m.resolved / maxVal) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '150px' }}>
                    <div style={{ width: '12px', height: `${barH1}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
                    <div style={{ width: '12px', height: `${barH2}%`, background: '#10b981', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{m.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px', fontSize: '0.7rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--primary)' }} /> Reported</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }} /> Resolved</span>
          </div>
        </div>
      </div>

      {/* Location Distribution */}
      <div className="glass-l2 reveal" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Problems by Location</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {analyticsData.problemsByLocation.map((loc, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{loc.district}</div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem' }}>
                <span style={{ color: '#ef4444' }}>🔴 {loc.critical}</span>
                <span style={{ color: '#f97316' }}>🟠 {loc.high}</span>
                <span style={{ color: '#eab308' }}>🟡 {loc.medium}</span>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginTop: '6px' }}>{loc.count} total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Performance */}
      <div className="glass-l2 reveal" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Department Performance</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {deptPerformance.map((dept, i) => (
            <div key={i} style={{ padding: '16px', borderRadius: '12px', background: `${dept.color}08`, border: `1px solid ${dept.color}20`, textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: dept.color, marginBottom: '6px' }}>{dept.name}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>{dept.resolved}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>resolved</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Avg: {dept.avgDays} days</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
