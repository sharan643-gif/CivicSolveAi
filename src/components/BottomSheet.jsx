import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function BottomSheet({ isOpen, onClose, title, children }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {/* Backdrop with blur */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      />

      {/* Sheet Body */}
      <div
        ref={sheetRef}
        style={{
          position: 'relative', zIndex: 10,
          background: 'rgba(12, 16, 28, 0.92)',
          backdropFilter: 'blur(48px) saturate(2)',
          WebkitBackdropFilter: 'blur(48px) saturate(2)',
          borderTop: '1px solid rgba(255, 255, 255, 0.14)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '28px 28px 0 0',
          padding: '12px 20px max(24px, env(safe-area-inset-bottom))',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -20px 56px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          animation: 'slideUpSheet 0.4s cubic-bezier(0.22, 1.2, 0.36, 1) forwards',
        }}
      >
        {/* Inner highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          borderRadius: 'inherit',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Drag Handle */}
        <div style={{
          width: '36px', height: '4px',
          background: 'rgba(255,255,255,0.18)',
          borderRadius: '2px',
          margin: '4px auto 14px',
          flexShrink: 0,
        }} />

        {/* Title Header */}
        {title && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px',
            flexShrink: 0,
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{title}</h3>
            <button 
              onClick={onClose} 
              className="touch-target"
              style={{ 
                background: 'rgba(255,255,255,0.06)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '50%', 
                color: 'var(--text-muted)', 
                cursor: 'pointer',
                width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s ease',
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Content Viewport */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '2px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
