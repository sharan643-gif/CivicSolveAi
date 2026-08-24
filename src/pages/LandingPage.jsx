import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ShieldAlert, Award, HelpCircle, BarChart3, ChevronRight, Activity, Globe } from 'lucide-react';
import EcosystemCanvas from '../components/EcosystemCanvas';
import ScrollExpand from '../components/ScrollExpand';

/* ─── Animated counter that counts up from 0 ──────────────────────── */
function AnimatedCounter({ target, duration = 1600, delay = 0, format }) {
  const [display, setDisplay] = useState('0');
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const startedRef = useRef(false);

  const easeOutExpo = useCallback(t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      startedRef.current = true;
      startRef.current = null;

      const tick = (now) => {
        if (startRef.current === null) startRef.current = now;
        const elapsed = now - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(easeOutExpo(progress) * target);
        setDisplay(format ? format(current) : current.toLocaleString());
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay, format, easeOutExpo]);

  return <>{display}</>;
}


export default function LandingPage({ onNavigate, stats = {}, featuredChallenges = [] }) {
  const steps = [
    { num: '01', title: 'Report', desc: 'Citizens submit a real-world local challenge.' },
    { num: '02', title: 'Understand', desc: 'AI categorizes, analyzes, and prioritizes the input.' },
    { num: '03', title: 'Validate', desc: 'Experts and government admins verify the issue.' },
    { num: '04', title: 'Match', desc: 'Matching algorithms suggest teams and experts based on skills.' },
    { num: '05', title: 'Collaborate', desc: 'Students and industry work in workspace environments.' },
    { num: '06', title: 'Deploy', desc: 'The solution goes from prototype to field pilot tests.' },
    { num: '07', title: 'Measure', desc: 'Social impact dashboards measure actual benefits.' }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '60px', paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '40px', alignItems: 'center', minHeight: '80vh', padding: '40px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px' }}>
          <div className="reveal glass-l1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.82rem', color: '#60a5fa', fontWeight: 600 }}>
            <Activity size={14} className="glow-blue" />
            <span>SIH 2026 Innovation Platform</span>
          </div>
          
          <h1 className="reveal" style={{ fontSize: '3.6rem', lineHeight: '1.08', fontFamily: 'var(--font-display)', fontWeight: 900, transitionDelay: '100ms' }}>
            Turn real-world <br/>
            <span className="gradient-text-primary">
              problems
            </span> into <br/>
            real-world solutions.
          </h1>
          
          <p className="reveal" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '520px', transitionDelay: '200ms' }}>
            CivicSolve AI connects communities, universities, industry, and government to transform raw societal challenges into measurable impact.
          </p>
          
          <div className="reveal" style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap', transitionDelay: '300ms' }}>
            <button onClick={() => onNavigate('report')} className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px' }}>
              Report a Challenge
              <ArrowRight size={18} />
            </button>
            <button onClick={() => onNavigate('explore')} className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px' }}>
              Explore Challenges
            </button>
            <button onClick={() => onNavigate('dashboard')} className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem', borderRadius: '12px', color: 'var(--text-secondary)' }}>
              Join as University
            </button>
          </div>

          <div className="reveal" style={{ display: 'flex', gap: '20px', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', transitionDelay: '400ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔍 Active Duplicate Scanning</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>⚡ 1.5s AI Priority Scoring</div>
          </div>
        </div>

        {/* Hero Ecosystem Visual */}
        <div className="reveal" style={{ display: 'flex', justifyContent: 'center', transitionDelay: '200ms' }}>
          <EcosystemCanvas />
        </div>
      </section>

      {/* City Image Showcase — scroll-expand animation */}
      <section style={{ position: 'relative', zIndex: 1, margin: '0 -24px' }}>
        <ScrollExpand
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80"
          alt="Smart city infrastructure"
          mediaType="image"
          useWindowScroll
          startWidth={70}
          startHeight={55}
          startRadius={24}
          endRadius={0}
          scrollDistance={1.0}
          holdDistance={0.3}
        >
          {/* Overlay text */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', maxWidth: '640px' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              Building Smarter Cities,
              <br />
              <span className="gradient-text-primary">
                One Challenge at a Time
              </span>
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              From infrastructure gaps to environmental hazards — real problems solved through collaborative intelligence.
            </p>
          </div>

          {/* Liquid glass list card */}
          <div className="se-liquid-card" style={{ animationDelay: '700ms' }}>
            {[
              { icon: '📍', target: 12840, format: v => v.toLocaleString() + '+', title: 'Challenges Mapped', delay: 700 },
              { icon: '🎓', target: 236, format: v => v.toLocaleString(), title: 'Universities Engaged', delay: 820 },
              { icon: '🚀', target: 4820, format: v => v.toLocaleString(), title: 'Solutions Deployed', delay: 940 },
              { icon: '🌍', target: 1200000, format: v => (v / 1000000).toFixed(1) + 'M+', title: 'Lives Impacted', delay: 1060 },
            ].map((row, i, arr) => (
              <div key={i} className="se-liquid-row" style={{ animationDelay: `${row.delay}ms` }}>
                <div className="se-liquid-row__left">
                  <span className="se-liquid-row__icon">{row.icon}</span>
                  <span className="se-liquid-row__title">{row.title}</span>
                </div>
                <span className="se-liquid-row__value">
                  <AnimatedCounter
                    target={row.target}
                    duration={1800}
                    delay={row.delay + 200}
                    format={row.format}
                  />
                </span>
                {i < arr.length - 1 && <div className="se-liquid-row__divider" />}
              </div>
            ))}
          </div>
        </ScrollExpand>
      </section>

      {/* Trust & Impact Stats Section */}
      <section className="reveal" style={{ position: 'relative', zIndex: 2, padding: '30px 0 40px' }}>
        <div className="reveal-stagger" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', padding: '0 24px' }}>
          {[
            { value: (stats.totalChallenges || 12840).toLocaleString(), label: 'Challenges Reported' },
            { value: (stats.implemented || 4820).toLocaleString(), label: 'Solutions Implemented' },
            { value: (stats.universities || 236).toString(), label: 'Universities Registered' },
            { value: (stats.industryPartners || 182).toString(), label: 'Industry Partners' },
            { value: (stats.peopleImpacted || 1248420).toLocaleString(), label: 'People Impacted' }
          ].map((stat, idx) => (
            <div key={idx} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '24px 28px 20px',
              flex: '1 1 0',
              minWidth: '0',
              maxWidth: '220px',
              cursor: 'default',
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'white', letterSpacing: '-0.03em', lineHeight: 1, position: 'relative' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', position: 'relative' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ position: 'relative', zIndex: 2, paddingTop: '10px' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'white' }}>Ecosystem Workflow</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            A complete collaborative pipeline converting raw community requests into operational systems.
          </p>
        </div>
        
        <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>
          {steps.map((step, idx) => (
            <div key={idx} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 18px 20px',
              minHeight: '200px',
              textAlign: 'center',
              alignItems: 'center',
              cursor: 'default',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', opacity: 0.7, marginBottom: '12px', fontFamily: 'var(--font-display)', lineHeight: 1, position: 'relative' }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: '0.95rem', color: 'white', marginBottom: '8px', fontWeight: 700, position: 'relative' }}>{step.title}</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.45, position: 'relative' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Challenges */}
      <section style={{ position: 'relative', zIndex: 2, paddingTop: '10px' }}>
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '4px', color: 'white' }}>Featured High Priority Challenges</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Critically rated issues awaiting university match and technical proposals.</p>
          </div>
          <button onClick={() => onNavigate('explore')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '10px' }}>
            View Marketplace
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="reveal-stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {featuredChallenges.slice(0, 2).map(challenge => (
            <div key={challenge.id} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
              cursor: 'default',
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className={`badge badge-${challenge.severity}`}>
                    {challenge.severity}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f97316' }}>
                    Priority: {challenge.priority_score}/100
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'white' }}>{challenge.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '16px', lineHeight: 1.5 }}>
                  {challenge.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <div>Affected: <strong style={{ color: 'white' }}>{challenge.affected_population}</strong></div>
                  <div>District: <strong style={{ color: 'white' }}>{challenge.district}</strong></div>
                </div>
                <button onClick={() => onNavigate(`challenge/${challenge.id}`)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '8px' }}>
                  View Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
