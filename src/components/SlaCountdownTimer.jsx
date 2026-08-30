import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { accountabilityService } from '../services/accountabilityService';

export default function SlaCountdownTimer({
  slaDeadline,
  isResolved = false,
  compact = false
}) {
  const [slaInfo, setSlaInfo] = useState(() => accountabilityService.getSlaStatus(slaDeadline, isResolved));

  useEffect(() => {
    if (!slaDeadline || isResolved) return;
    const interval = setInterval(() => {
      setSlaInfo(accountabilityService.getSlaStatus(slaDeadline, isResolved));
    }, 60000);
    return () => clearInterval(interval);
  }, [slaDeadline, isResolved]);

  if (isResolved) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: compact ? '2px 8px' : '4px 12px',
          borderRadius: '100px',
          background: 'rgba(5, 150, 105, 0.12)',
          color: '#059669',
          border: '1px solid rgba(5, 150, 105, 0.3)',
          fontSize: compact ? '0.72rem' : '0.8rem',
          fontWeight: 700
        }}
      >
        <CheckCircle2 size={compact ? 12 : 14} /> Resolved within SLA
      </span>
    );
  }

  const { isOverdue, urgency, color, text } = slaInfo;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: compact ? '2px 8px' : '6px 12px',
        borderRadius: '8px',
        background: isOverdue ? 'rgba(220, 38, 38, 0.1)' : urgency === 'critical' ? 'rgba(225, 29, 72, 0.1)' : 'rgba(217, 119, 6, 0.1)',
        border: `1px solid ${color}40`,
        color: color,
        fontWeight: 700,
        fontSize: compact ? '0.74rem' : '0.82rem'
      }}
    >
      {isOverdue ? <AlertTriangle size={compact ? 13 : 15} /> : <Clock size={compact ? 13 : 15} />}
      <span>{text}</span>
      {isOverdue && (
        <span
          style={{
            background: '#dc2626',
            color: '#fff',
            fontSize: '0.62rem',
            padding: '1px 5px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          SLA Breached
        </span>
      )}
    </div>
  );
}
