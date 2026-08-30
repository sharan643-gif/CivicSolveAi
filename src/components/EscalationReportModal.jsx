import React, { useState } from 'react';
import { X, AlertTriangle, Camera, UploadCloud, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { accountabilityService } from '../services/accountabilityService';
import { geminiService } from '../services/geminiClientService';

export default function EscalationReportModal({ challenge, onClose, onSuccess }) {
  const [reason, setReason] = useState('Ground work was not performed');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAuditVerdict, setAiAuditVerdict] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    'Ground work was not performed',
    'Partial work only / Incomplete repair',
    'Same problem recurred within 48 hours',
    'Wrong location was repaired',
    'Inferior quality materials used',
    'Dangerous hazard left behind'
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      setPhoto(base64);
      setPhotoPreview(base64);

      // Trigger Gemini Vision AI audit on the escalation evidence photo
      setIsAnalyzing(true);
      try {
        const visionResult = await geminiService.analyzeImage(base64, file.type || 'image/jpeg');
        setAiAuditVerdict(visionResult);
      } catch (err) {
        console.warn('AI Vision audit fallback:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      alert('Please upload a photo of the current ground condition as evidence for the field vigilance squad.');
      return;
    }

    setIsSubmitting(true);
    try {
      accountabilityService.submitCitizenVerification(
        challenge.id,
        'not_resolved',
        `${reason}: ${comment}`,
        photo
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Escalation submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="glass-card fade-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          padding: '24px',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(220, 38, 38, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626'
              }}
            >
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Raise Citizen Dispute & Escalation
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Complaint #{challenge.id?.slice(0, 8)} · Trigger physical field inspection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Warning Notice */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#9f1239',
            fontSize: '0.8rem',
            lineHeight: 1.4
          }}
        >
          <strong>⚠️ Official Accountability Action:</strong> Submitting this dispute triggers an immediate 48-hour field vigilance investigation. If verified that the department submitted false resolution data, their credit score will be penalized by <strong>15 points</strong>.
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Reason Selection */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Select Dispute Category:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                outline: 'none',
                background: '#f8fafc'
              }}
            >
              {reasons.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Ground Reality Description:
            </label>
            <textarea
              rows={3}
              placeholder="Describe what is still broken, hazards, or why the work is unacceptable..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'vertical',
                background: '#f8fafc'
              }}
            />
          </div>

          {/* Mandatory Photo Evidence Upload */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <Camera size={14} color="#dc2626" />
              <span>Mandatory Field Evidence Photo (Current State):</span>
            </label>

            <div
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '10px',
                padding: '16px',
                textAlign: 'center',
                background: photoPreview ? '#ffffff' : '#f8fafc',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />

              {photoPreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <img
                    src={photoPreview}
                    alt="Evidence Preview"
                    style={{ maxHeight: '140px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                    ✓ Photo attached. Click to replace.
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <UploadCloud size={28} color="#64748b" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Upload live photo proof
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    JPG, PNG or WEBP (Max 5MB)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gemini AI Vision Verification Analysis */}
          {isAnalyzing && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(0, 48, 135, 0.05)',
                border: '1px solid rgba(0, 48, 135, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--primary)'
              }}
            >
              <Sparkles size={16} className="spin-slow" />
              <span>Gemini Vision AI analyzing photo evidence for ground validation...</span>
            </div>
          )}

          {aiAuditVerdict && !isAnalyzing && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                fontSize: '0.78rem',
                color: '#065f46',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Gemini AI Pre-Audit:</strong> Detected "{aiAuditVerdict.detected_issue || 'Unresolved civic hazard'}". Confidence: {Math.round((aiAuditVerdict.confidence || 0.92) * 100)}%. Photo logged for field dispatch.
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: '#ffffff',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !photo}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: !photo || isSubmitting ? 'not-allowed' : 'pointer',
                opacity: !photo || isSubmitting ? 0.6 : 1,
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
              }}
            >
              {isSubmitting ? 'Dispatching Field Investigation...' : 'Submit Escalation & Dispatch Squad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
