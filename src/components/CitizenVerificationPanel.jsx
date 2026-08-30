import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, ShieldCheck, Camera, Sparkles, MessageSquare } from 'lucide-react';
import { accountabilityService } from '../services/accountabilityService';
import EscalationReportModal from './EscalationReportModal';

export default function CitizenVerificationPanel({ challenge, onVerified }) {
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedVerdict, setSubmittedVerdict] = useState(null);

  const handleConfirmResolved = async () => {
    setIsSubmitting(true);
    try {
      accountabilityService.submitCitizenVerification(challenge.id, 'resolved', comment || 'Verified completely fixed on ground.');
      setSubmittedVerdict('resolved');
      if (onVerified) onVerified('resolved');
    } catch (e) {
      console.warn('Verification error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscalationSuccess = () => {
    setShowEscalationModal(false);
    setSubmittedVerdict('not_resolved');
    if (onVerified) onVerified('not_resolved');
  };

  if (submittedVerdict === 'resolved') {
    return (
      <div
        className="glass-card"
        style={{
          padding: '20px',
          borderRadius: '12px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#059669',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <CheckCircle size={24} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#065f46' }}>
            Citizen Verification Confirmed ✅
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#047857', marginTop: '2px' }}>
            Thank you for confirming resolution. The department's accountability score has been credited.
          </p>
        </div>
      </div>
    );
  }

  if (submittedVerdict === 'not_resolved') {
    return (
      <div
        className="glass-card"
        style={{
          padding: '20px',
          borderRadius: '12px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#dc2626',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#991b1b' }}>
            Field Dispute Logged & Escalation Triggered 🚨
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#b91c1c', marginTop: '2px' }}>
            A formal complaint audit has been dispatched to the District Field Vigilance Squad. Department score penalized.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="glass-card"
        style={{
          padding: '24px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
          border: '2px solid rgba(0, 48, 135, 0.2)',
          boxShadow: '0 8px 24px rgba(0, 48, 135, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🏛️</span>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Citizen Ground Verification Required
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                The department has marked this problem as 100% resolved. As the reporter or local resident, please confirm the ground reality.
              </p>
            </div>
          </div>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '100px',
              background: 'rgba(217, 119, 6, 0.12)',
              color: '#b45309',
              fontSize: '0.74rem',
              fontWeight: 700
            }}
          >
            ⏳ 7-Day Audit Window Active
          </span>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Optional Citizen Ground Remarks:
          </label>
          <input
            type="text"
            placeholder="e.g. Work is solid and clean / Pothole was only partially filled..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.84rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={handleConfirmResolved}
            disabled={isSubmitting}
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #059669, #047857)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <CheckCircle size={18} />
            <span>Yes, Fully Resolved</span>
          </button>

          <button
            onClick={() => setShowEscalationModal(true)}
            disabled={isSubmitting}
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              color: '#dc2626',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <XCircle size={18} />
            <span>No, Issue Still Exists (Escalate)</span>
          </button>
        </div>
      </div>

      {showEscalationModal && (
        <EscalationReportModal
          challenge={challenge}
          onClose={() => setShowEscalationModal(false)}
          onSuccess={handleEscalationSuccess}
        />
      )}
    </>
  );
}
