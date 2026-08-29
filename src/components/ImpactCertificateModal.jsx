import React, { useState } from 'react';
import { Award, X, Play, CheckCircle2, RotateCcw, ShieldCheck, Download } from 'lucide-react';
import { getImpactCertificate, REPLAY_TIMELINE_STAGES } from '../services/janSetuV2Service';

export default function ImpactCertificateModal({ isOpen, onClose, challenge }) {
  const cert = getImpactCertificate(challenge);
  const [activeStep, setActiveStep] = useState(REPLAY_TIMELINE_STAGES.length);
  const [isReplaying, setIsReplaying] = useState(false);

  if (!isOpen) return null;

  const handleStartReplay = () => {
    setIsReplaying(true);
    setActiveStep(1);
    let step = 1;
    const interval = setInterval(() => {
      step++;
      if (step > REPLAY_TIMELINE_STAGES.length) {
        clearInterval(interval);
        setIsReplaying(false);
      } else {
        setActiveStep(step);
      }
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#ffffff', width: '100%', maxWidth: '680px',
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px', background: '#003087', color: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#FF6200" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>JanSetu Verified Impact Certificate</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Official Certificate Card */}
          <div style={{
            border: '4px double #003087', background: '#fafbfc', padding: '24px',
            borderRadius: '6px', textAlign: 'center', position: 'relative'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              OFFICIAL JANSETU VERIFIED IMPACT RECORD
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#003087', margin: '8px 0 4px' }}>
              {cert.projectName}
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
              📍 {cert.district}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', margin: '20px 0', background: '#ffffff', padding: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CITIZENS SERVED</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{cert.citizensBenefited}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>WASHOUT REDUCTION</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)' }}>88%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>RESOLUTION TIME</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8b5cf6' }}>42 Days</div>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b', borderTop: '1px dashed #cbd5e1', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>ID: <strong>{cert.certificateId}</strong></span>
              <span>Issued: {cert.issuedDate}</span>
            </div>
          </div>

          {/* Replay Journey Section */}
          <div style={{ background: '#f1f5f9', borderRadius: '6px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Problem → Impact Replay Journey
              </div>
              <button
                onClick={handleStartReplay}
                disabled={isReplaying}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'var(--primary)', color: '#ffffff', border: 'none',
                  borderRadius: '4px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700,
                  cursor: isReplaying ? 'default' : 'pointer', fontFamily: 'inherit'
                }}
              >
                <Play size={14} /> {isReplaying ? 'Replaying Stage...' : 'Replay Journey'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {REPLAY_TIMELINE_STAGES.slice(0, activeStep).map(st => (
                <div
                  key={st.step}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '8px 12px', background: '#ffffff', borderRadius: '4px',
                    borderLeft: '3px solid var(--primary)', animation: 'fadeIn 0.25s ease'
                  }}
                >
                  <CheckCircle2 size={16} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Step {st.step}: {st.label} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>({st.time})</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{st.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
