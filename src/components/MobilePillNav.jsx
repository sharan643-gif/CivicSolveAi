import React from 'react';
import { Home, Compass, Plus, Lightbulb, LayoutDashboard, Sparkles, User } from 'lucide-react';

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
  );
}
