import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, XCircle, Camera, Sparkles, ShieldCheck } from 'lucide-react';
import { accountabilityService } from '../services/accountabilityService';

export default function CitizenRealityCheckModal({ challenge, onClose, onSuccess }) {
  const [verdict, setVerdict] = useState('completely_fixed');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target.result);
      setPhotoPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      accountabilityService.submitCitizenVerification(
        challenge.id,
        verdict === 'completely_fixed' ? 'resolved' : 'not_resolved',
        `[Reality Check: ${verdict.toUpperCase().replace('_', ' ')}] ${comment}`,
        photo
      );
      if (onSuccess) onSuccess(verdict);
      onClose();
    } catch (e) {
      console.warn('Reality check error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          width: '100%', maxWidth: '520px', background: '#ffffff',
          borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Citizen Reality Check: "Is this REALLY fixed?"
            </h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Ticket #{challenge?.id?.slice(0, 8)} · Ground Truth Audit
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Tri-state Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { id: 'completely_fixed', label: 'Completely Fixed', icon: <CheckCircle size={16} />, color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
              { id: 'partially_fixed', label: 'Partially Fixed', icon: <AlertCircle size={16} />, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
              { id: 'not_fixed', label: 'Not Fixed', icon: <XCircle size={16} />, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setVerdict(opt.id)}
                style={{
                  padding: '12px 8px',
                  borderRadius: '8px',
                  border: verdict === opt.id ? `2px solid ${opt.color}` : '1px solid var(--border-subtle)',
                  background: verdict === opt.id ? opt.bg : '#ffffff',
                  color: verdict === opt.id ? opt.color : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              Ground Remarks / Observation:
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Surface was paved smoothly / Loose gravel left on shoulder / Nothing was done..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required={verdict !== 'completely_fixed'}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', outline: 'none' }}
            />
          </div>

          {verdict !== 'completely_fixed' && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Camera size={14} color="#dc2626" />
                <span>Upload Current Photo Proof:</span>
              </label>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ fontSize: '0.8rem' }} />
              {photoPreview && (
                <div style={{ marginTop: '8px', height: '100px', borderRadius: '6px', overflow: 'hidden' }}>
                  <img src={photoPreview} alt="Dispute Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: '#fff', cursor: 'pointer', fontSize: '0.82rem' }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 20px', borderRadius: '6px', border: 'none',
                background: verdict === 'completely_fixed' ? 'linear-gradient(135deg, #059669, #047857)' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: '#fff', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer'
              }}
            >
              {isSubmitting ? 'Recording Audit...' : 'Submit Reality Check'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
