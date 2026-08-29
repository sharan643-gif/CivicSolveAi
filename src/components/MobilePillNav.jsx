import React from 'react';
import { Home, Compass, Plus, Lightbulb, LayoutDashboard, User, Mic } from 'lucide-react';

export default function MobilePillNav({ activeTab, onSelectTab, currentUser, onOpenVoice }) {
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

        {/* Voice AI — floating top-right of nav pill */}
        {onOpenVoice && (
          <button
            onClick={() => { if (navigator.vibrate) navigator.vibrate(30); onOpenVoice(); }}
            title="Open Voice AI Assistant"
            style={{
              position: 'absolute',
              top: '-14px',
              right: '6px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: '9999px',
              background: 'var(--accent)',
              border: '2px solid #ffffff',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.65rem',
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              whiteSpace: 'nowrap',
              boxShadow: '0 3px 10px rgba(255, 98, 0, 0.4)',
              pointerEvents: 'auto',
              transition: 'transform 0.15s ease',
              lineHeight: 1,
            }}
          >
            <Mic size={12} strokeWidth={2.5} />
            <span>Voice AI</span>
          </button>
        )}

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '6px 8px',
            background: '#ffffff',
            border: '1px solid var(--border-medium)',
            borderRadius: '9999px',
            boxShadow: '0 8px 30px rgba(0, 48, 135, 0.18), 0 2px 8px rgba(0, 0, 0, 0.06)',
            pointerEvents: 'auto',
            position: 'relative',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isPrimary) {
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title="Report Societal Issue"
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    border: '3px solid #ffffff',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255, 98, 0, 0.45)',
                    transform: 'translateY(-10px)',
                    transition: 'transform 0.15s ease',
                    flexShrink: 0,
                  }}
                >
                  <Plus size={22} strokeWidth={3} />
                </button>
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
