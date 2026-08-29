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

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #003087 0%, #001d5a 100%)',
        color: '#ffffff',
        padding: '48px 0 40px',
        borderBottom: '4px solid #FF6200',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px', padding: '6px 14px',
                fontSize: '0.78rem', fontWeight: 600, marginBottom: '20px',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4caf50', display: 'inline-block' }} />
                SIH 2026 · Live Portal
              </div>

              <h1 style={{
                fontSize: '2.4rem', lineHeight: 1.2, fontWeight: 800,
                color: '#ffffff', marginBottom: '16px',
                letterSpacing: '-0.02em',
              }}>
                National Civic Issue<br />
                <span style={{ color: '#FF6200' }}>Resolution Platform</span>
              </h1>

              <p style={{
                fontSize: '1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.65,
                maxWidth: '480px', marginBottom: '28px',
              }}>
                CivicSolve AI connects citizens, universities, industry, and government to transform societal challenges into measurable, accountable outcomes.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigate('report')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#FF6200', color: '#ffffff',
                    border: '2px solid #FF6200', borderRadius: '4px',
                    padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700,
                    cursor: 'pointer', transition: 'background 0.15s ease',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#cc4e00'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FF6200'}
                >
                  <FileText size={16} />
                  Report an Issue
                </button>
                <button
                  onClick={() => onNavigate('explore')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'transparent', color: '#ffffff',
                    border: '2px solid rgba(255,255,255,0.5)', borderRadius: '4px',
                    padding: '12px 24px', fontSize: '0.95rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'border-color 0.15s ease',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#ffffff'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
                >
                  <Search size={16} />
                  Browse Challenges
                </button>
              </div>

              <div style={{ display: 'flex', gap: '24px', marginTop: '28px', flexWrap: 'wrap' }}>
                {[
                  '✔ AI-powered duplicate detection',
                  '✔ Real-time priority scoring',
                  '✔ Verified expert matching',
                ].map(t => (
                  <span key={t} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Right — Quick Links Panel */}
            <div style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px', padding: '24px',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
                Quick Access
              </div>
              {[
                { label: '🏆 SIH Hackathon Judge Mode', desc: 'Guided interactive end-to-end presentation', route: 'demo', icon: '⭐' },
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
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '4px', padding: '12px 14px', cursor: 'pointer',
                    marginBottom: '8px', transition: 'background 0.15s ease', textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                >
                  <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{link.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>{link.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{link.desc}</div>
                  </div>
                  <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Statistics Bar ─────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0' }}>
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '20px 16px', flex: '1 1 0', minWidth: '160px',
                  borderRight: idx < statCards.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  gap: '6px',
                }}>
                  <div style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
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

          <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '6px', overflow: 'hidden' }}>
            {steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '20px',
                  padding: '18px 24px',
                  borderBottom: idx < steps.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  background: idx % 2 === 0 ? '#ffffff' : '#fafbfc',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#fafbfc'}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--primary)', color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{step.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.desc}</div>
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
                    borderTop: '3px solid var(--primary)', borderRadius: '4px',
                    padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px',
                  }}
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
