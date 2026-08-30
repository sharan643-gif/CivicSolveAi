import React, { useEffect, useState, useRef } from 'react';
import { Search, ShieldAlert, Award, GraduationCap, Building, UserCheck, Settings, X, PlusCircle, BarChart3, Map } from 'lucide-react';

export default function CommandMenu({ isOpen, onClose, onSwitchRole, onNavigate, challenges = [] }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setClosing(false);
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 180);
  };

  if (!isOpen) return null;

  const roleItems = [
    { name: 'Citizen Portal', role: 'citizen', icon: ShieldAlert, desc: 'File reports & support community needs', color: '#06b6d4' },
    { name: 'Student Workspace', role: 'student', icon: Award, desc: 'Find matching projects & coordinate teams', color: '#10b981' },
    { name: 'University Admin', role: 'university', icon: GraduationCap, desc: 'Oversee student engineering capacity', color: '#f59e0b' },
    { name: 'Industry Collaborator', role: 'industry', icon: Building, desc: 'Fund solutions & provide technical mentorship', color: '#ec4899' },
    { name: 'Expert Validator', role: 'expert', icon: UserCheck, desc: 'Review engineering feasibility & grade pilots', color: '#8b5cf6' },
    { name: 'Central Admin Console', role: 'admin', icon: Settings, desc: 'Manage system metrics & approve releases', color: '#3b82f6' },
  ];

  const actionItems = [
    { label: 'Department Operations & Accountability Console', action: 'dept-dashboard', icon: Building, route: 'dept-dashboard', color: '#003087' },
    { label: 'Public Department Scorecard & SLA Metrics', action: 'departments', icon: Building, route: 'departments', color: '#003087' },
    { label: 'Report a New Challenge', action: 'report', icon: PlusCircle, route: 'report', color: '#ef4444' },
    { label: 'Browse Solutions Marketplace', action: 'solutions', icon: BarChart3, route: 'solutions', color: '#10b981' },
    { label: 'District Command Center & Heatmap', action: 'command', icon: Map, route: 'command-center', color: '#3b82f6' },
    { label: 'CSR & Project Funding Grants', action: 'funding', icon: BarChart3, route: 'funding', color: '#f59e0b' },
    { label: 'Research Papers & Datasets', action: 'research', icon: Map, route: 'research-hub', color: '#8b5cf6' },
    { label: 'Your Achievements & Badges', action: 'achievements', icon: Award, route: 'achievements', color: '#f59e0b' },
    { label: 'Civic Leaderboard Rankings', action: 'leaderboard', icon: BarChart3, route: 'leaderboard', color: '#10b981' },
    { label: 'Expert Marketplace', action: 'experts', icon: ShieldCheck, route: 'expert-marketplace', color: '#8b5cf6' },
    { label: 'NGO Matching System', action: 'ngo', icon: ShieldCheck, route: 'ngo-matching', color: '#10b981' },
    { label: 'Civic Analytics Dashboard', action: 'analytics', icon: BarChart3, route: 'analytics', color: '#3b82f6' },
    { label: 'AI Intelligence Dashboard', action: 'intelligence', icon: ShieldCheck, route: 'intelligence', color: '#8b5cf6' },
    { label: 'Innovation Challenges', action: 'challenges', icon: PlusCircle, route: 'civic-challenges', color: '#ef4444' },
    { label: 'Public Transparency Dashboard', action: 'transparency', icon: BarChart3, route: 'transparency', color: '#06b6d4' },
  ];

  const filteredRoles = roleItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase())
  );
  const filteredActions = actionItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );
  const filteredChallenges = challenges.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.district.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const selectRole = (role) => { onSwitchRole(role); handleClose(); };
  const selectRoute = (route) => { onNavigate(route); handleClose(); };

  const animBase = closing
    ? { animation: 'scaleOut 0.18s ease forwards' }
    : { animation: 'scaleIn 0.25s cubic-bezier(0.22, 1.2, 0.36, 1) forwards' };

  const overlayAnim = closing
    ? { animation: 'backdropFadeIn 0.18s ease reverse forwards' }
    : {};

  return (
    <div
      className="glass-overlay"
      style={{
        ...overlayAnim,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '92%',
          maxWidth: '580px',
          background: 'linear-gradient(165deg, rgba(14, 19, 32, 0.94) 0%, rgba(10, 14, 24, 0.96) 100%)',
          backdropFilter: 'blur(48px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(48px) saturate(1.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          boxShadow: `
            0 32px 80px -16px rgba(0,0,0,0.8),
            0 0 0 1px rgba(255,255,255,0.03),
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.2)
          `,
          overflow: 'hidden',
          position: 'relative',
          ...animBase,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Liquid glass top highlight */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
          pointerEvents: 'none', borderRadius: 'inherit', zIndex: 0,
        }} />

        {/* Search header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1))',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: '14px', flexShrink: 0,
            animation: 'searchPulse 2s ease infinite',
          }}>
            <Search size={17} style={{ color: '#3b82f6' }} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search challenges, dashboards, commands..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flexGrow: 1,
              background: 'transparent', border: 'none', outline: 'none',
              color: 'white', fontSize: '0.95rem',
              fontFamily: 'var(--font-body)', fontWeight: 400,
            }}
          />
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px',
              transition: 'all 0.15s ease',
              flexShrink: 0,
            }}
          >
            <X size={13} />
          </button>
        </div>

        {/* Results body */}
        <div style={{
          padding: '10px',
          maxHeight: '420px',
          overflowY: 'auto',
          position: 'relative', zIndex: 1,
        }}>
          {/* Section: Stakeholder Portals */}
          {filteredRoles.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{
                fontSize: '0.66rem', textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--text-muted)',
                padding: '6px 14px 8px', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3b82f6' }} />
                Access Stakeholder Dashboard
              </div>
              {filteredRoles.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.role}
                    onClick={() => selectRole(item.role)}
                    className="search-result-card"
                    style={{
                      animation: `resultSlideIn 0.3s cubic-bezier(0.22, 1.2, 0.36, 1) ${0.04 + idx * 0.04}s both`,
                    }}
                  >
                    <div style={{
                      padding: '8px',
                      borderRadius: '10px',
                      background: `${item.color}12`,
                      border: `1px solid ${item.color}25`,
                      color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <IconComp size={15} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{item.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '1px' }}>{item.desc}</div>
                    </div>
                    <div style={{
                      fontSize: '0.65rem', color: 'var(--text-muted)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '6px', padding: '3px 8px',
                      flexShrink: 0,
                    }}>→</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Section: Quick Actions */}
          {filteredActions.length > 0 && (
            <div style={{
              marginBottom: '10px',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '10px',
            }}>
              <div style={{
                fontSize: '0.66rem', textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--text-muted)',
                padding: '6px 14px 8px', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981' }} />
                Navigation Shortcuts
              </div>
              {filteredActions.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.action}
                    onClick={() => selectRoute(item.route)}
                    className="search-result-card"
                    style={{
                      animation: `resultSlideIn 0.3s cubic-bezier(0.22, 1.2, 0.36, 1) ${0.08 + idx * 0.04}s both`,
                    }}
                  >
                    <div style={{
                      padding: '8px',
                      borderRadius: '10px',
                      background: `${item.color}12`,
                      border: `1px solid ${item.color}25`,
                      color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <IconComp size={15} />
                    </div>
                    <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{item.label}</div>
                    <div style={{
                      fontSize: '0.65rem', color: 'var(--text-muted)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '6px', padding: '3px 8px',
                      flexShrink: 0,
                    }}>→</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Section: Matching Challenges */}
          {filteredChallenges.length > 0 && (
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '10px',
            }}>
              <div style={{
                fontSize: '0.66rem', textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--text-muted)',
                padding: '6px 14px 8px', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b' }} />
                Matching Challenges
              </div>
              {filteredChallenges.map((c, idx) => (
                <div
                  key={c.id}
                  onClick={() => selectRoute(`challenge/${c.id}`)}
                  className="search-result-card"
                  style={{
                    flexDirection: 'column', alignItems: 'flex-start',
                    animation: `resultSlideIn 0.3s cubic-bezier(0.22, 1.2, 0.36, 1) ${0.12 + idx * 0.04}s both`,
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{c.title}</div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '4px', padding: '1px 6px',
                      color: '#fbbf24', fontSize: '0.65rem', fontWeight: 500,
                    }}>{c.category}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>📍 {c.location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {filteredRoles.length === 0 && filteredActions.length === 0 && filteredChallenges.length === 0 && (
            <div style={{
              padding: '32px 20px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
            }}>
              <Search size={28} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <div>No results found for "{query}"</div>
              <div style={{ fontSize: '0.72rem', marginTop: '6px', color: 'var(--text-muted)' }}>
                Try a different search term
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 18px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '0.66rem', color: 'var(--text-muted)',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>↑↓</kbd>
              navigate
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>↵</kbd>
              select
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Press <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
}
