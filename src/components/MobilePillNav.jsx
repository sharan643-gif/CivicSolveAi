import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Home, Search, Plus, User, Sparkles, FileText, Building, ShieldCheck } from 'lucide-react';
import BottomSheet from './BottomSheet';
import Aurora from './Aurora';

export default function MobilePillNav({ activeTab, onSelectTab, currentUser, onOpenAction }) {
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [pressedIdx, setPressedIdx] = useState(null);
  const [pillStyle, setPillStyle] = useState({});
  const pillRefs = useRef([]);
  const containerRef = useRef(null);

  const role = currentUser?.role || 'Citizen';
  const sector = currentUser?.sector || 'citizen';

  const getNavItems = () => {
    switch (sector) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'explore', label: 'Find', icon: Search },
          { id: 'action', label: 'Create', icon: Plus, isPrimary: true },
          { id: 'solutions', label: 'Solutions', icon: Sparkles },
          { id: 'dashboard', label: 'Profile', icon: User },
        ];
      case 'government':
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'command-center', label: 'Command', icon: Search },
          { id: 'action', label: 'Validate', icon: Plus, isPrimary: true },
          { id: 'explore', label: 'Issues', icon: FileText },
          { id: 'dashboard', label: 'Profile', icon: User },
        ];
      case 'industry':
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'funding', label: 'Grants', icon: Search },
          { id: 'action', label: 'Sponsor', icon: Plus, isPrimary: true },
          { id: 'solutions', label: 'Solutions', icon: Sparkles },
          { id: 'dashboard', label: 'Profile', icon: User },
        ];
      default:
        return [
          { id: 'landing', label: 'Home', icon: Home },
          { id: 'explore', label: 'Explore', icon: Search },
          { id: 'action', label: 'Report', icon: Plus, isPrimary: true },
          { id: 'funding', label: 'Funding', icon: Sparkles },
          { id: 'dashboard', label: 'Profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  const getActiveIdx = () => {
    return navItems.findIndex(item => !item.isPrimary && item.id === activeTab);
  };

  const activeIdx = getActiveIdx();

  useEffect(() => {
    if (activeIdx < 0 || !pillRefs.current[activeIdx]) {
      setPillStyle({ opacity: 0, width: 0 });
      return;
    }

    const el = pillRefs.current[activeIdx];
    if (!el) return;

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setPillStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, [activeIdx, navItems.length]);

  const handleItemClick = (item) => {
    if (item.isPrimary) {
      setIsActionOpen(true);
    } else {
      onSelectTab(item.id);
    }
  };

  return (
    <>
      {/* ── Floating Glass Pill Navigation (Liquid Glass) ──────── */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: 'calc(100% - 28px)',
          maxWidth: '400px',
          height: '64px',
          background: 'rgba(16, 20, 34, 0.42)',
          backdropFilter: 'blur(48px) saturate(2.2)',
          WebkitBackdropFilter: 'blur(48px) saturate(2.2)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '9999px',
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          boxShadow:
            '0 20px 56px -16px rgba(0, 0, 0, 0.75), ' +
            '0 8px 24px -8px rgba(0, 0, 0, 0.5), ' +
            'inset 0 1px 0 rgba(255, 255, 255, 0.12), ' +
            '0 0 0 1px rgba(255, 255, 255, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Aurora WebGL Animated Background Canvas */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0.5,
          zIndex: 0,
        }}>
          <Aurora colorStops={['#5227FF', '#7cff67', '#5227FF']} blend={0.5} amplitude={1.0} speed={0.4} />
        </div>

        {/* Glass Reflection */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '150%', height: '100%',
          background: 'linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 60%, transparent 80%)',
          transform: 'rotate(25deg)', opacity: 0.7, animation: 'moveReflection 8s infinite linear', pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Inner highlight overlay */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 40%)',
          pointerEvents: 'none', opacity: 0.5,
        }} />

        {/* Animated Active Indicator */}
        <div
          style={{
            position: 'absolute',
            top: '6px',
            bottom: '6px',
            left: pillStyle.left || 0,
            width: pillStyle.width || 0,
            opacity: pillStyle.opacity || 0,
            background: 'rgba(255, 255, 255, 0.10)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '9999px',
            boxShadow:
              'inset 0 1px 3px rgba(255,255,255,0.18), ' +
              '0 4px 12px rgba(59, 130, 246, 0.08)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Nav Items */}
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = !item.isPrimary && activeTab === item.id;
          const isPressed = pressedIdx === idx;

          if (item.isPrimary) {
            return (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                className="touch-target"
                onTouchStart={() => setPressedIdx(idx)}
                onTouchEnd={() => setTimeout(() => setPressedIdx(null), 150)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.92), rgba(139,92,246,0.92))',
                  border: '1px solid rgba(255,255,255,0.22)',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transform: isPressed ? 'scale(0.92)' : 'translateY(-2px)',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '6px',
                  marginRight: '6px',
                }}
              >
                <Plus size={24} color="#fff" strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={idx}
              ref={el => pillRefs.current[idx] = el}
              onClick={() => handleItemClick(item)}
              onTouchStart={() => setPressedIdx(idx)}
              onTouchEnd={() => setTimeout(() => setPressedIdx(null), 150)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                borderRadius: '9999px',
                padding: '8px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                minHeight: '54px',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Icon
                size={isActive ? 24 : 20}
                color={isActive ? '#ffffff' : 'rgba(255,255,255,0.45)'}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isActive ? 'scale(1.1) translateY(-2px)' : 'scale(1)',

                }}
              />
              <span style={{
                fontSize: '0.62rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.02em',
                opacity: isActive ? 1 : 0.8,
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Action Menu Bottom Sheet ─────────────────────────────── */}
      <BottomSheet isOpen={isActionOpen} onClose={() => setIsActionOpen(false)} title="Quick Action Menu">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '8px 0' }}>
          <button
            onClick={() => { setIsActionOpen(false); onSelectTab('report'); }}
            className="touch-target"
            style={{
              background: 'rgba(16, 20, 34, 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6,182,212,0.12)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(6,182,212,0.18)' }}>
              <FileText size={18} />
            </div>
            <div>
              <strong style={{ color: '#fff', fontSize: '0.82rem', display: 'block' }}>Report Issue</strong>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>AI-guided submission</span>
            </div>
          </button>

          <button
            onClick={() => { setIsActionOpen(false); onSelectTab('solutions'); }}
            className="touch-target"
            style={{
              background: 'rgba(16, 20, 34, 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.18)' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <strong style={{ color: '#fff', fontSize: '0.82rem', display: 'block' }}>Submit Solution</strong>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>Publish prototype</span>
            </div>
          </button>

          <button
            onClick={() => { setIsActionOpen(false); onSelectTab('command-center'); }}
            className="touch-target"
            style={{
              background: 'rgba(16, 20, 34, 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59,130,246,0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59,130,246,0.18)' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <strong style={{ color: '#fff', fontSize: '0.82rem', display: 'block' }}>District Command</strong>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>Heatmap & SLAs</span>
            </div>
          </button>

          <button
            onClick={() => { setIsActionOpen(false); onSelectTab('funding'); }}
            className="touch-target"
            style={{
              background: 'rgba(16, 20, 34, 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245,158,11,0.18)' }}>
              <Building size={18} />
            </div>
            <div>
              <strong style={{ color: '#fff', fontSize: '0.82rem', display: 'block' }}>CSR Grants</strong>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>Sponsor projects</span>
            </div>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
