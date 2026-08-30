import React from 'react';
import {
  FileText,
  Brain,
  Building2,
  Wrench,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { accountabilityService } from '../services/accountabilityService';

export default function ComplaintTimeline({ challenge }) {
  const steps = accountabilityService.getComplaintTimeline(challenge);

  const getStepIcon = (stage, completed) => {
    switch (stage) {
      case 'submitted':
        return <FileText size={16} color={completed ? '#fff' : '#64748b'} />;
      case 'ai_classified':
        return <Brain size={16} color={completed ? '#fff' : '#64748b'} />;
      case 'accepted':
        return <Building2 size={16} color={completed ? '#fff' : '#64748b'} />;
      case 'work_started':
        return <Wrench size={16} color={completed ? '#fff' : '#64748b'} />;
      case 'resolved':
        return <CheckCircle2 size={16} color={completed ? '#fff' : '#64748b'} />;
      case 'citizen_verified':
        return <UserCheck size={16} color={completed ? '#fff' : '#64748b'} />;
      default:
        return <Clock size={16} color={completed ? '#fff' : '#64748b'} />;
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '12px', background: '#ffffff', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Official Resolution Lifecycle
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Transparent real-time chain of custody from submission to citizen audit.
          </p>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            padding: '3px 10px',
            borderRadius: '100px',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontWeight: 700
          }}
        >
          {steps.filter(s => s.completed).length} of {steps.length} Stages Completed
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const isCurrent = step.completed && (idx === steps.length - 1 || !steps[idx + 1]?.completed);

          return (
            <div key={step.id || idx} style={{ display: 'flex', gap: '16px', position: 'relative', minHeight: '64px' }}>
              {/* Connector line */}
              {!isLast && (
                <div
                  style={{
                    position: 'absolute',
                    top: '32px',
                    left: '17px',
                    bottom: '-4px',
                    width: '2px',
                    background: step.completed ? 'var(--primary)' : '#e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                />
              )}

              {/* Node Icon */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: step.completed
                    ? 'linear-gradient(135deg, var(--primary), #0284c7)'
                    : isCurrent
                    ? 'rgba(0, 48, 135, 0.15)'
                    : '#f1f5f9',
                  border: isCurrent ? '2px solid var(--primary)' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 1,
                  boxShadow: isCurrent ? '0 0 0 4px rgba(0, 48, 135, 0.15)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {getStepIcon(step.stage, step.completed)}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: step.completed ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {step.actor} · <span style={{ color: 'var(--text-muted)' }}>{step.role}</span>
                    </div>
                  </div>
                  {step.timestamp && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      {new Date(step.timestamp).toLocaleDateString()} {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    fontSize: '0.8rem',
                    color: step.completed ? 'var(--text-secondary)' : 'var(--text-muted)',
                    marginTop: '4px',
                    lineHeight: 1.4,
                    background: isCurrent ? 'rgba(0, 48, 135, 0.04)' : 'transparent',
                    padding: isCurrent ? '8px 12px' : '0',
                    borderRadius: '6px',
                    border: isCurrent ? '1px solid rgba(0, 48, 135, 0.1)' : 'none'
                  }}
                >
                  {step.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
