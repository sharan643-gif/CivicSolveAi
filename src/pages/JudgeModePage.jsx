import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Award, ChevronRight, RotateCcw, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { REPLAY_TIMELINE_STAGES } from '../services/janSetuV2Service';

export default function JudgeModePage({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    let timer;
    if (autoPlay && currentStep < REPLAY_TIMELINE_STAGES.length) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3000);
    } else if (currentStep >= REPLAY_TIMELINE_STAGES.length) {
      setAutoPlay(false);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, currentStep]);

  const activeStage = REPLAY_TIMELINE_STAGES[currentStep - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)',
        color: '#ffffff', padding: '32px 24px', borderRadius: 'var(--radius-md)',
        borderBottom: '4px solid var(--accent)', textAlign: 'center'
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Smart India Hackathon 2026 · Dedicated Presentation Mode
        </span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '12px 0 6px', letterSpacing: '-0.02em' }}>
          JanSetu End-to-End Civic Operating System Demo
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', maxWidth: '640px', margin: '0 auto 20px' }}>
          Experience how JanSetu converts scattered local signals into verified intelligence, connects multidisciplinary teams, deploys solutions, and measures lasting societal impact.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={() => { setCurrentStep(1); setAutoPlay(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--accent)', color: '#ffffff', border: 'none',
              borderRadius: '4px', padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            <Play size={16} /> {autoPlay ? 'Auto-Advancing Stages...' : 'Start Automated Guided Journey'}
          </button>
          <button
            onClick={() => { setCurrentStep(1); setAutoPlay(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: '4px', padding: '12px 20px', fontSize: '0.95rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Stage Navigator Progress Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${REPLAY_TIMELINE_STAGES.length}, 1fr)`, gap: '4px', background: '#e2e8f0', padding: '4px', borderRadius: '6px' }}>
        {REPLAY_TIMELINE_STAGES.map(st => (
          <button
            key={st.step}
            onClick={() => { setCurrentStep(st.step); setAutoPlay(false); }}
            style={{
              background: st.step === currentStep ? 'var(--primary)' : st.step < currentStep ? '#94a3b8' : '#ffffff',
              color: st.step <= currentStep ? '#ffffff' : 'var(--text-muted)',
              border: 'none', borderRadius: '4px', padding: '8px 2px', fontSize: '0.7rem', fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease'
            }}
          >
            {st.step}
          </button>
        ))}
      </div>

      {/* Stage Detail Spotlight Card */}
      {activeStage && (
        <div style={{
          background: '#ffffff', border: '2px solid var(--primary)', borderRadius: 'var(--radius-md)',
          padding: '24px', boxShadow: 'var(--shadow-md)', animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
              Stage {activeStage.step} of 9 · {activeStage.time}
            </span>
            <span style={{ fontSize: '0.78rem', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
              LIVE DEMO STEP
            </span>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {activeStage.label}
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            {activeStage.desc}
          </p>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--border-medium)', background: '#ffffff', cursor: currentStep === 1 ? 'default' : 'pointer', fontFamily: 'inherit' }}
            >
              Previous Step
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(REPLAY_TIMELINE_STAGES.length, prev + 1))}
              disabled={currentStep === REPLAY_TIMELINE_STAGES.length}
              style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: 'var(--primary)', color: '#ffffff', fontWeight: 700, cursor: currentStep === REPLAY_TIMELINE_STAGES.length ? 'default' : 'pointer', fontFamily: 'inherit' }}
            >
              Next Step →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
