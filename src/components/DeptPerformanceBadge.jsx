import React from 'react';
import { Award, ShieldAlert, CheckCircle, TrendingUp } from 'lucide-react';
import { accountabilityService } from '../services/accountabilityService';

export default function DeptPerformanceBadge({ deptId, score, showDetails = false }) {
  const metrics = score !== undefined ? { score, tier: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Needs Improvement' : 'Critical Review' } : accountabilityService.getDepartmentScore(deptId);
  const val = metrics.score;

  let bg = 'rgba(5, 150, 105, 0.12)';
  let color = '#059669';
  let border = 'rgba(5, 150, 105, 0.3)';

  if (val < 50) {
    bg = 'rgba(220, 38, 38, 0.12)';
    color = '#dc2626';
    border = 'rgba(220, 38, 38, 0.3)';
  } else if (val < 70) {
    bg = 'rgba(217, 119, 6, 0.12)';
    color = '#d97706';
    border = 'rgba(217, 119, 6, 0.3)';
  } else if (val < 85) {
    bg = 'rgba(2, 132, 199, 0.12)';
    color = '#0284c7';
    border = 'rgba(2, 132, 199, 0.3)';
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '100px',
        background: bg,
        color: color,
        border: `1px solid ${border}`,
        fontSize: '0.75rem',
        fontWeight: 800
      }}
    >
      <span>⭐ Credit Score: {val}/100</span>
      {showDetails && (
        <span style={{ fontSize: '0.68rem', fontWeight: 600, opacity: 0.9 }}>
          ({metrics.tier})
        </span>
      )}
    </div>
  );
}
