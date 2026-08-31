import React from 'react';
import { ArrowRight, ChevronRight, FileText, Search, Shield, Users, BarChart3, Globe } from 'lucide-react';

export default function LandingPage({ onNavigate, stats = {}, featuredChallenges = [] }) {
  const steps = [
    { num: '01', title: 'Report', desc: 'Citizens submit a real-world local challenge through a structured form.' },
    { num: '02', title: 'Understand', desc: 'AI categorizes, analyzes, and prioritizes the input automatically.' },
    { num: '03', title: 'Validate', desc: 'Experts and government administrators verify the reported issue.' },
    { num: '04', title: 'Match', desc: 'Algorithms suggest qualified teams and experts based on their skills.' },
    { num: '05', title: 'Collaborate', desc: 'Students and industry partners work in shared workspace environments.' },
    { num: '06', title: 'Deploy', desc: 'The solution moves from prototype to field pilot testing.' },
    { num: '07', title: 'Measure', desc: 'Impact dashboards measure actual benefits delivered to communities.' },
  ];

  const statCards = [
    { value: (stats.totalChallenges || 12840).toLocaleString(), label: 'Challenges Reported', icon: FileText },
    { value: (stats.implemented || 4820).toLocaleString(), label: 'Solutions Implemented', icon: Shield },
    { value: (stats.universities || 236).toString(), label: 'Universities Registered', icon: Users },
    { value: (stats.industryPartners || 182).toString(), label: 'Industry Partners', icon: Globe },
    { value: (stats.peopleImpacted || 1248420).toLocaleString(), label: 'Citizens Impacted', icon: BarChart3 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', paddingBottom: '40px' }}>

      {/* ── Government Banner ──────────────────────────────────────────── */}
      <div className="gov-top-banner" style={{ marginBottom: '0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span>🇮🇳</span>
          <span>An official platform of the Government of India · Smart India Hackathon 2026</span>
          <span style={{ marginLeft: 'auto', opacity: 0.8, fontSize: '0.72rem' }}>
            Last Updated: August 2026
          </span>
        </div>
      </div>

      {/* ── Hero Section — Premium Design ─────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1729 0%, #1b2a4a 35%, #243b6a 70%, #1a2545 100%)',
        color: '#ffffff',
        padding: '56px 0 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle decorative elements */}
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,134,10,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-30px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,134,10,0.06) 0%, transparent 60%)', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(200,134,10,0.15)', border: '1px solid rgba(200,134,10,0.35)',
                borderRadius: '9999px', padding: '6px 16px',
                fontSize: '0.72rem', fontWeight: 700, marginBottom: '24px',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: '#d4a843',
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
                Live Platform · SIH 2026
              </div>

              <h1 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.15, fontWeight: 800,
                color: '#ffffff', marginBottom: '20px',
                letterSpacing: '-0.025em',
              }}>
                National Civic Issue<br />
                <span style={{
                  background: 'linear-gradient(135deg, #d4a843 0%, #f0c864 50%, #d4a843 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Resolution Platform</span>
              </h1>

              <p style={{
                fontSize: '1.02rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7,
                maxWidth: '460px', marginBottom: '32px',
              }}>
                Connecting citizens, universities, industry, and government to transform societal challenges into measurable, accountable outcomes.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <button
                  onClick={() => onNavigate('report')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'linear-gradient(135deg, #c8860a, #b07508)',
                    color: '#ffffff',
                    border: 'none', borderRadius: 'var(--radius-md)',
                    padding: '13px 28px', fontSize: '0.92rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 20px rgba(200,134,10,0.35)',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(200,134,10,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,134,10,0.35)'; }}
                >
                  <FileText size={16} />
                  Report an Issue
                </button>
                <button
                  onClick={() => onNavigate('explore')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(255,255,255,0.07)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-md)',
                    padding: '13px 28px', fontSize: '0.92rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    backdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <Search size={16} />
                  Browse Challenges
                </button>
              </div>

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {[
                  { text: 'AI-powered duplicate detection', icon: '✓' },
                  { text: 'Real-time priority scoring', icon: '✓' },
                  { text: 'Verified expert matching', icon: '✓' },
                ].map(t => (
                  <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(200,134,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#d4a843', fontWeight: 700, flexShrink: 0 }}>{t.icon}</span>
                    {t.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Quick Links Panel */}
            <div style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-lg)', padding: '24px',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '18px', height: '2px', background: 'var(--accent)', borderRadius: '2px' }} />
                Quick Access
              </div>
              {[
                { label: 'SIH Hackathon Judge Mode', desc: 'Guided interactive end-to-end presentation', route: 'demo', icon: '🏆' },
                { label: 'Emerging Problems Radar', desc: 'Early warning signals & surge alerts', route: 'emerging-problems', icon: '📡' },
                { label: 'District Scorecard & Ledger', desc: 'Cumulative verified impact metrics', route: 'district-scorecard', icon: '📊' },
                { label: 'Report a Civic Issue', desc: 'Submit and track local problems', route: 'report', icon: '📋' },
                { label: 'Explore Active Challenges', desc: 'Browse issues in your area', route: 'explore', icon: '🔍' },
                { label: 'View Solutions Marketplace', desc: 'Discover implemented solutions', route: 'solutions', icon: '💡' },
                { label: 'Funding & CSR Portal', desc: 'Find grants and CSR opportunities', route: 'funding', icon: '💰' },
              ].map(link => (
                <button
                  key={link.route}
                  onClick={() => onNavigate(link.route)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)', padding: '11px 14px', cursor: 'pointer',
                    marginBottom: '6px', transition: 'all 0.2s ease', textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{link.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.3 }}>{link.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{link.desc}</div>
                  </div>
                  <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Bottom accent line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.6 }} />
      </section>

      {/* ── Statistics Bar — Premium ────────────────────────────────────── */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0' }}>
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '24px 16px', flex: '1 1 0', minWidth: '160px',
                  borderRight: idx < statCards.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  gap: '8px',
                  transition: 'background 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-primary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Icon size={18} color="var(--accent)" style={{ marginBottom: '2px' }} />
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="gov-section-header">
            <h2 style={{ fontSize: '1.4rem', marginBottom: '4px', color: 'var(--primary)' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              A structured pipeline converting citizen reports into operational, measurable solutions.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
            {steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '20px',
                  padding: '18px 24px',
                  borderBottom: idx < steps.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  background: idx % 2 === 0 ? '#ffffff' : 'var(--bg-secondary)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.paddingLeft = '28px'; }}
                onMouseLeave={e => { e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : 'var(--bg-secondary)'; e.currentTarget.style.paddingLeft = '24px'; }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                  background: idx === 0 ? 'var(--accent)' : 'var(--primary)', color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.78rem', flexShrink: 0,
                  boxShadow: idx === 0 ? '0 2px 8px rgba(200,134,10,0.3)' : '0 2px 8px rgba(27,42,74,0.15)',
                }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '0.92rem' }}>{step.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Challenges ────────────────────────────────────────── */}
      {featuredChallenges.length > 0 && (
        <section style={{ padding: '0 0 48px', background: 'var(--bg-primary)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div className="gov-section-header" style={{ marginBottom: 0 }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '4px', color: 'var(--primary)' }}>High Priority Challenges</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Critically rated issues awaiting university match and proposals.</p>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'transparent', border: '1px solid var(--primary)',
                  borderRadius: '4px', padding: '8px 14px',
                  color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'background 0.15s ease', flexShrink: 0,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {featuredChallenges.slice(0, 2).map(challenge => (
                <div
                  key={challenge.id}
                  style={{
                    background: '#ffffff', border: '1px solid var(--border-subtle)',
                    borderTop: '3px solid var(--accent)', borderRadius: 'var(--radius-lg)',
                    padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <span className={`badge badge-${challenge.severity}`}>{challenge.severity}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#d35400' }}>
                      Priority: {challenge.priority_score}/100
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {challenge.title}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55,
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {challenge.description}
                  </p>
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span>Affected: <strong style={{ color: 'var(--text-primary)' }}>{challenge.affected_population}</strong></span>
                      <span style={{ margin: '0 8px' }}>·</span>
                      <span>District: <strong style={{ color: 'var(--text-primary)' }}>{challenge.district}</strong></span>
                    </div>
                    <button
                      onClick={() => onNavigate(`challenge/${challenge.id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'var(--primary)', color: '#ffffff',
                        border: '1px solid var(--primary)', borderRadius: '4px',
                        padding: '7px 14px', fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        transition: 'background 0.15s ease', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                    >
                      View Details <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Information / Notice Section ───────────────────────────────── */}
      <section style={{ padding: '0 0 48px', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="gov-info-box">
            <strong>ℹ️ Notice:</strong> CivicSolve AI is an official digital platform under the Smart India Hackathon 2026 initiative.
            All submitted challenges are reviewed by verified government administrators before public listing.
            For technical support, contact{' '}
            <a href="mailto:support@civicai.gov.in" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              support@civicai.gov.in
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
