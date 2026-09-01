import React from 'react';
import { Sparkles, ArrowRight, Mic, Camera, ChevronRight, Zap, Globe } from 'lucide-react';

export default function MobileLandingPage({ onNavigate, stats, onOpenVoice, onOpenCamera }) {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '80px' }}>

      {/* Hero Header */}
      <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
        <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', border: '1px solid rgba(27,42,74,0.2)', padding: '5px 12px', borderRadius: '100px', fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>
          <Sparkles size={12} /> SIH 2026 Innovation Platform
        </div>

        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
          Turn real-world <span style={{ color: 'var(--primary)' }}>problems</span> into real-world <span style={{ color: 'var(--accent)' }}>solutions.</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
          JanSetu AI connects communities, universities, industry, and government to transform raw societal challenges into measurable impact.
        </p>
      </div>

      {/* Compact CTAs */}
      <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => onNavigate('report')} className="btn btn-primary touch-target" style={{ padding: '14px', fontSize: '0.92rem', borderRadius: '8px', width: '100%', justifyContent: 'center' }}>
          Report a Challenge <ArrowRight size={16} />
        </button>
        <button onClick={() => onNavigate('explore')} className="btn btn-secondary touch-target" style={{ padding: '14px', fontSize: '0.92rem', borderRadius: '8px', width: '100%', justifyContent: 'center' }}>
          Explore Active Issues
        </button>
      </div>

      {/* Voice & Camera AI Modules — Quick Access */}
      <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #c8860a, #a06d08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="#fff" />
          </div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            AI-Powered Report
          </h3>
        </div>

        {/* Voice Assistant Card */}
        <button
          onClick={() => onOpenVoice ? onOpenVoice() : onNavigate('voice')}
          style={{
            background: 'linear-gradient(135deg, #0f1729 0%, #1b2a4a 60%, #243b6a 100%)',
            border: '1px solid rgba(200,134,10,0.2)',
            borderRadius: '14px',
            padding: '18px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: '50px', height: '50px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #c8860a, #a06d08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(200,134,10,0.4)',
            flexShrink: 0,
          }}>
            <Mic size={24} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)' }}>Voice Assistant</span>
              <span style={{ fontSize: '0.55rem', background: 'rgba(200,134,10,0.25)', color: '#d4a843', padding: '2px 6px', borderRadius: '100px', fontWeight: 700 }}>LIVE</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>
              Speak naturally — AI captures problem details in English or Hindi
            </p>
          </div>
          <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
        </button>

        {/* Camera Inspection Card */}
        <button
          onClick={() => onOpenCamera ? onOpenCamera() : onNavigate('inspect')}
          style={{
            background: '#ffffff',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '18px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            width: '50px', height: '50px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(22,163,74,0.3)',
            flexShrink: 0,
          }}>
            <Camera size={24} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>AI Camera</span>
              <span style={{ fontSize: '0.55rem', background: 'rgba(22,163,74,0.1)', color: '#16a34a', padding: '2px 6px', borderRadius: '100px', fontWeight: 700 }}>VISION</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Point camera at issue — Gemini AI identifies and categorizes instantly
            </p>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </button>

        {/* Quick Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <Globe size={13} color="var(--primary)" />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Works in English & Hindi • Powered by Gemini AI</span>
        </div>
      </div>

      {/* Stats Cards — Clean White Cards */}
      <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card" style={{ padding: '18px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
            {(stats?.totalChallenges || 12840).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Challenges Reported</span>
        </div>
        <div className="glass-card" style={{ padding: '18px', textAlign: 'center', background: '#ffffff', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-display)' }}>
            {(stats?.implemented || 4820).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Solutions Built</span>
        </div>
      </div>

    </div>
  );
}
