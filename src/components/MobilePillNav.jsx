import React, { useState, useRef, useCallback } from 'react';
import { Home, Compass, Plus, Lightbulb, LayoutDashboard, User, Mic } from 'lucide-react';

export default function MobilePillNav({ activeTab, onSelectTab, currentUser, onOpenVoice }) {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const longPressTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const longPressTriggeredRef = useRef(false);

  const LONG_PRESS_DURATION = 600; // ms

  // ─── Sound: pleasant ascending chime via Web Audio API ────────────────────
  const playOpenSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;

      // First note — soft rising tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523, now);       // C5
      osc1.frequency.exponentialRampToValueAtTime(659, now + 0.12); // E5
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc1.connect(gain1).connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Second note — higher chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(784, now + 0.08); // G5
      osc2.frequency.exponentialRampToValueAtTime(1047, now + 0.25); // C6
      gain2.gain.setValueAtTime(0.2, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);

      // Clean up
      setTimeout(() => ctx.close().catch(() => {}), 500);
    } catch (e) {
      // Audio not available — silent fallback
    }
  }, []);

  const startLongPress = useCallback(() => {
    longPressTriggeredRef.current = false;
    setIsLongPressing(true);
    setLongPressProgress(0);

    // Animate progress + haptic tick every 100ms
    const startTime = Date.now();
    let lastTickTime = 0;
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / LONG_PRESS_DURATION) * 100, 100);
      setLongPressProgress(pct);
      // Subtle haptic tick every 100ms
      if (elapsed - lastTickTime >= 100) {
        lastTickTime = elapsed;
        if (navigator.vibrate) navigator.vibrate(8);
      }
    }, 16);

    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      setIsLongPressing(false);
      setLongPressProgress(0);
      clearInterval(progressIntervalRef.current);
      // Vibrate + sound
      if (navigator.vibrate) navigator.vibrate(50);
      playOpenSound();
      // Open voice agent
      onOpenVoice?.();
    }, LONG_PRESS_DURATION);
  }, [onOpenVoice, playOpenSound]);

  const cancelLongPress = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsLongPressing(false);
    setLongPressProgress(0);
  }, []);

  const handlePlusClick = useCallback(() => {
    // If long press already triggered, don't fire click
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    onSelectTab('report');
  }, [onSelectTab]);
  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'report', label: 'Report', icon: Plus, isPrimary: true },
    { id: 'solutions', label: 'Solutions', icon: Lightbulb },
    { id: 'dashboard', label: currentUser ? 'Dashboard' : 'Portal', icon: currentUser ? LayoutDashboard : User },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'max(14px, var(--safe-bottom))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 950,
        width: 'calc(100% - 28px)',
        maxWidth: '420px',
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'relative' }}>


        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '6px 8px',
            background: '#ffffff',
            border: '1px solid var(--border-medium)',
            borderRadius: '9999px',
            boxShadow: '0 8px 30px rgba(27,42,74, 0.18), 0 2px 8px rgba(0, 0, 0, 0.06)',
            pointerEvents: 'auto',
            position: 'relative',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isPrimary) {
              const pressScale = isLongPressing ? 1.15 : 1;
              const pressGlow = isLongPressing
                ? '0 4px 20px rgba(45,122,79,0.5), 0 0 40px rgba(45,122,79,0.2)'
                : '0 4px 16px rgba(200,134,10, 0.4)';
              return (
                <div key={item.id} style={{ position: 'relative', flexShrink: 0 }}>
                  {/* Progress ring */}
                  {isLongPressing && (
                    <svg
                      width="54" height="54"
                      style={{
                        position: 'absolute', top: '-4px', left: '-4px',
                        transform: 'rotate(-90deg)', pointerEvents: 'none',
                      }}
                    >
                      <circle
                        cx="27" cy="27" r="24"
                        fill="none"
                        stroke="rgba(45,122,79,0.25)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="27" cy="27" r="24"
                        fill="none"
                        stroke="var(--success)"
                        strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - longPressProgress / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                      />
                    </svg>
                  )}
                  <button
                    onClick={handlePlusClick}
                    onMouseDown={startLongPress}
                    onMouseUp={cancelLongPress}
                    onMouseLeave={cancelLongPress}
                    onTouchStart={startLongPress}
                    onTouchEnd={cancelLongPress}
                    onTouchCancel={cancelLongPress}
                    title="Report Societal Issue — Hold for Voice"
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: isLongPressing
                        ? 'linear-gradient(135deg, var(--success), #1a5c3a)'
                        : 'linear-gradient(135deg, var(--accent), #a06d08)',
                      border: '3px solid #ffffff',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: pressGlow,
                      transform: `translateY(-10px) scale(${pressScale})`,
                      transition: 'transform 0.2s ease, background 0.3s ease, box-shadow 0.3s ease',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {isLongPressing ? <Mic size={20} strokeWidth={2.5} /> : <Plus size={22} strokeWidth={3} />}
                  </button>
                  {/* Tooltip hint */}
                  {isLongPressing && (
                    <div style={{
                      position: 'absolute', bottom: '-28px', left: '50%', transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap', fontSize: '0.6rem', fontWeight: 700,
                      color: 'var(--success)', background: '#fff', padding: '2px 8px',
                      borderRadius: 'var(--radius-md)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      animation: 'fadeIn 0.2s ease', pointerEvents: 'none',
                    }}>
                      🎙️ Keep holding...
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  padding: '6px 10px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flex: 1,
                  minWidth: '50px',
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: isActive ? 800 : 500,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
