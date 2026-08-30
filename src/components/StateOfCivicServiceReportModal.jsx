import React from 'react';
import { X, FileText, Download, Award, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { civicIntelligenceEngine } from '../services/civicIntelligenceEngine';

export default function StateOfCivicServiceReportModal({ onClose }) {
  const report = civicIntelligenceEngine.generateMonthlyReport();

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}
    >
      <div
        className="glass-card fade-in"
        style={{
          width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto',
          background: '#ffffff', borderRadius: '16px', padding: '28px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '20px',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.74rem' }}>
              <FileText size={14} />
              <span>Official Government & Public Accountability Audit</span>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0' }}>
              State of Civic Service Report — {report.month}
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Published transparently for citizens, media, and district oversight commissions.
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        {/* Top Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
          <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>{report.totalReported}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Complaints</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #dcfce7', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#059669' }}>{report.overallResolutionRate}</div>
            <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 600 }}>Resolution Rate</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>{report.avgResolutionTimeDays}d</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg SLA Days</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#7c3aed' }}>{report.totalCitizensEngaged.toLocaleString()}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Citizens Engaged</div>
          </div>
        </div>

        {/* Department Honors & Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Executive Department Citations:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '0.8rem' }}>
              <strong style={{ color: '#065f46' }}>🏆 Top Performing Department:</strong>
              <div style={{ color: '#047857', marginTop: '2px' }}>{report.topPerformingDept}</div>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#f0f9ff', border: '1px solid #bae6fd', fontSize: '0.8rem' }}>
              <strong style={{ color: '#0369a1' }}>⚡ Fastest Field Response:</strong>
              <div style={{ color: '#0284c7', marginTop: '2px' }}>{report.fastestTeam}</div>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#faf5ff', border: '1px solid #e9d5ff', fontSize: '0.8rem' }}>
              <strong style={{ color: '#6b21a8' }}>🛡️ Highest SLA Compliance:</strong>
              <div style={{ color: '#7c3aed', marginTop: '2px' }}>{report.highestSlaCompliance}</div>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#fffbeb', border: '1px solid #fef3c7', fontSize: '0.8rem' }}>
              <strong style={{ color: '#92400e' }}>📈 Most Improved Service:</strong>
              <div style={{ color: '#b45309', marginTop: '2px' }}>{report.mostImprovedDept}</div>
            </div>
          </div>
        </div>

        {/* Preventive Operations */}
        <div style={{ padding: '12px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong>Preventive Operations Summary:</strong> {report.hotspotsIdentified} systemic failure hotspots identified by AI; {report.preventiveInspectionsCompleted} preventive work orders executed; {report.disputeAuditsResolved} citizen reality disputes resolved through field vigilance squads.
        </div>

        {/* Export / Print */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => {
              window.print();
            }}
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={15} /> Export Audit Report (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
