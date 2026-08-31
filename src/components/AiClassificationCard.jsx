import React from 'react';
import { Sparkles, Building2, Clock, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { accountabilityService } from '../services/accountabilityService';

export default function AiClassificationCard({
  department,
  category,
  severity = 'medium',
  confidence = 94,
  slaDays,
  routingReason,
  style = {}
}) {
  const dept = typeof department === 'string'
    ? accountabilityService.getDepartmentById(department) || accountabilityService.matchDepartment(category, department)
    : department || accountabilityService.matchDepartment(category);

  const effectiveSla = slaDays || dept?.slaDays || 5;

  return (
    <div
      className="glass-card"
      style={{
        padding: '16px 20px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(27,42,74, 0.04), rgba(2, 132, 199, 0.06))',
        border: '1px solid rgba(27,42,74, 0.18)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        ...style
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem' }}>
          <Sparkles size={16} color="var(--primary)" />
          <span>AI Issue Classification & Automated Route</span>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            padding: '3px 10px',
            borderRadius: '100px',
            background: 'rgba(5, 150, 105, 0.12)',
            color: '#059669',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <ShieldCheck size={12} /> {confidence}% Match Confidence
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {/* Department Info */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(27,42,74, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              flexShrink: 0
            }}
          >
            {dept?.icon || '🏛️'}
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
              Assigned Authority
            </div>
            <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {dept?.name || 'Municipal Works Authority'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Head: {dept?.head || 'Officer in Charge'}
            </div>
          </div>
        </div>

        {/* SLA & Priority */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: 1,
              minWidth: '110px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
              <Clock size={12} /> Legal SLA
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary)', marginTop: '2px' }}>
              {effectiveSla} Days Max
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: '110px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.68rem', fontWeight: 600 }}>
              <AlertCircle size={12} /> Severity Tier
            </div>
            <div
              style={{
                fontSize: '0.88rem',
                fontWeight: 800,
                marginTop: '4px',
                textTransform: 'capitalize',
                color: severity === 'critical' ? '#dc2626' : severity === 'high' ? '#d97706' : '#0284c7'
              }}
            >
              {severity} Priority
            </div>
          </div>
        </div>
      </div>

      {routingReason && (
        <div
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            background: 'rgba(255,255,255,0.7)',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px dashed var(--border-subtle)',
            lineHeight: 1.4
          }}
        >
          <strong style={{ color: 'var(--text-primary)' }}>AI Routing Rationale:</strong> {routingReason}
        </div>
      )}
    </div>
  );
}
