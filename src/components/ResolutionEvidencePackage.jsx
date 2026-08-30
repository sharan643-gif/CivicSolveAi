import React, { useState } from 'react';
import { Camera, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Eye, UploadCloud } from 'lucide-react';
import { geminiService } from '../services/geminiClientService';

export default function ResolutionEvidencePackage({
  challenge,
  initialBeforePhoto,
  initialAfterPhoto
}) {
  const [beforePhoto, setBeforePhoto] = useState(
    initialBeforePhoto || challenge?.evidence?.[0]?.url || challenge?.evidence_files?.[0]?.url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500'
  );
  const [afterPhoto, setAfterPhoto] = useState(
    initialAfterPhoto || 'https://images.unsplash.com/photo-1584463699039-4d621b790d56?w=500'
  );
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);

  const handleRunAiAudit = async () => {
    setIsComparing(true);
    try {
      const result = await geminiService.compareResolutionEvidence(beforePhoto, afterPhoto, {
        title: challenge?.title || 'Civic site repair',
        category: challenge?.category || 'Infrastructure'
      });
      setComparisonResult(result);
    } catch (e) {
      console.warn('Comparison error:', e);
    } finally {
      setIsComparing(false);
    }
  };

  const handleAfterPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAfterPhoto(event.target.result);
      setComparisonResult(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 800, fontSize: '0.78rem' }}>
            <ShieldCheck size={15} />
            <span>AI Resolution Evidence & Ground Truth Package</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Before vs After Forensic Comparison
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Departments cannot simply click "Resolved". Visual before/after proof is verified by Gemini Vision AI.
          </p>
        </div>

        <button
          onClick={handleRunAiAudit}
          disabled={isComparing}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
          }}
        >
          <Sparkles size={14} className={isComparing ? 'spin-slow' : ''} />
          <span>{isComparing ? 'Auditing with Gemini Vision...' : 'Run AI Forensic Audit'}</span>
        </button>
      </div>

      {/* Side-by-Side Photo Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {/* Before Photo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🔴 Before: Original Complaint
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Citizen Reported</span>
          </div>
          <div style={{ height: '180px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #fee2e2', background: '#000' }}>
            <img src={beforePhoto} alt="Before Problem" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* After Photo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🟢 After: Department Rectification
            </span>
            <label style={{ fontSize: '0.7rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700 }}>
              Upload Proof
              <input type="file" accept="image/*" onChange={handleAfterPhotoUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <div style={{ height: '180px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #bbf7d0', background: '#000', position: 'relative' }}>
            <img src={afterPhoto} alt="After Resolution" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* AI Forensic Verdict Card */}
      {comparisonResult && (
        <div
          className="fade-in"
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: comparisonResult.is_verified_fixed ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${comparisonResult.is_verified_fixed ? '#bbf7d0' : '#fecaca'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {comparisonResult.is_verified_fixed ? (
                <CheckCircle2 size={20} color="#059669" />
              ) : (
                <AlertTriangle size={20} color="#dc2626" />
              )}
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: comparisonResult.is_verified_fixed ? '#065f46' : '#991b1b', margin: 0 }}>
                {comparisonResult.verification_verdict}
              </h4>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: comparisonResult.is_verified_fixed ? '#059669' : '#dc2626' }}>
              {comparisonResult.confidence_score}% Forensic Confidence
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
            {comparisonResult.audit_summary}
          </p>

          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--border-subtle)', paddingTop: '6px' }}>
            <strong>Recommended Governance Action:</strong> {comparisonResult.recommended_next_step}
          </div>
        </div>
      )}
    </div>
  );
}
