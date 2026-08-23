import React, { useRef, useEffect, useState } from 'react';
import { Compass, Lightbulb, ShieldCheck, DollarSign, BookOpen, FileText, LayoutDashboard, Plus } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'solutions', label: 'Solutions', icon: Lightbulb },
  { id: 'command-center', label: 'Command', icon: ShieldCheck },
  { id: 'funding', label: 'Funding', icon: DollarSign },
  { id: 'research-hub', label: 'Research', icon: BookOpen },
  { id: 'report', label: 'Report', icon: FileText, isPrimary: true },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

// Using a keyframe animation defined via standard CSS since @emotion is not installed
const reflectionStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '150%',
  height: '100%',
  background: 'linear-gradient(100deg, transparent 20%, rgba(255, 255, 255, 0.1) 40%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 60%, transparent 80%)',
  transform: 'rotate(25deg)',
  opacity: 0.8,
  animation: 'moveReflection 6s infinite linear',
  pointerEvents: 'none',
  zIndex: 0,
};

const navContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 10px',
  background: 'rgba(20, 24, 38, 0.5)',
  backdropFilter: 'blur(40px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '9999px',
  boxShadow: 
    '0 12px 48px -8px rgba(0, 0, 0, 0.6), ' +
    '0 4px 16px -4px rgba(0, 0, 0, 0.4), ' +
    'inset 0 1px 0 rgba(255, 255, 255, 0.1), ' +
    '0 0 0 1px rgba(59, 130, 246, 0.05)',
  pointerEvents: 'auto',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};

export default function DesktopPillNav({ activeTab, onSelectTab, isScrolled }) {
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const activeItem = NAV_ITEMS.find(item => !item.isPrimary && item.id === activeTab);
  const activeIdx = NAV_ITEMS.findIndex(item => item === activeItem);

  useEffect(() => {
    if (activeIdx < 0 || !itemRefs.current[activeIdx] || !containerRef.current) {
      setIndicator(prev => ({ ...prev, opacity: 0 }));
      return;
    }

    const el = itemRefs.current[activeIdx];
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setIndicator({
      left: elRect.left - containerRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, [activeIdx, activeTab]);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div
      className="desktop-pill-nav"
      style={{
        position: 'sticky',
        top: isScrolled ? '48px' : '64px',
        zIndex: 800,
        display: 'flex',
        justifyContent: 'center',
        paddingTop: isScrolled ? '4px' : '12px',
        paddingBottom: isScrolled ? '4px' : '4px',
        transition: 'top 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s ease',
        pointerEvents: 'none',
      }}
    >
      <nav
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{
          ...navContainerStyle,
          transform: isScrolled ? 'scale(0.96)' : 'scale(1)',
          padding: isScrolled ? '4px 8px' : '6px 10px',
          boxShadow: isScrolled 
            ? '0 16px 48px -12px rgba(0, 0, 0, 0.7), 0 8px 24px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)'
            : navContainerStyle.boxShadow
        }}
      >
        {/* Glass Reflection */}
        <div style={reflectionStyle} />

        {/* Dynamic cursor light reflection */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `radial-gradient(800px circle at ${hoverPos.x}px ${hoverPos.y}px, rgba(255,255,255,0.06), transparent 40%)`,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            transition: 'background 0.1s ease',
          }}
        />
        
        {/* Inner top highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: 0.5,
        }} />

        {/* Animated Active Indicator */}
        <div
          style={{
            position: 'absolute',
            top: isScrolled ? '4px' : '6px',
            bottom: isScrolled ? '4px' : '6px',
            left: indicator.left,
            width: indicator.width,
            opacity: indicator.opacity,
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '9999px',
            boxShadow: 
              'inset 0 2px 4px rgba(255,255,255,0.2), ' +
              '0 4px 12px rgba(59, 130, 246, 0.1)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Nav Items */}
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = !item.isPrimary && activeTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-label="Create new entry"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  flexShrink: 0,
                  margin: '0 4px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.6), inset 0 2px 6px rgba(255,255,255,0.3)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,1), rgba(139,92,246,1))';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.4), inset 0 2px 4px rgba(255,255,255,0.2)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))';
                }}
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              ref={el => (itemRefs.current[idx] = el)}
              onClick={() => onSelectTab(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: isScrolled ? '8px 14px' : '10px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                fontSize: isScrolled ? '0.8rem' : '0.85rem',
                fontWeight: isActive ? 600 : 500,
                fontFamily: 'var(--font-body)',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                WebkitTapHighlightColor: 'transparent',
                minHeight: '44px',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }
              }}
            >
              <Icon
                size={isScrolled ? 16 : 17}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{
                  color: isActive ? 'rgba(255,255,255,1)' : 'inherit',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none',
                }}
              />
              <span style={{ letterSpacing: '0.01em', transition: 'font-size 0.3s ease' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
