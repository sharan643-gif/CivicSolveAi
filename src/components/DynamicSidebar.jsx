import React from 'react';
import { ROLE_NAVIGATION, ROLES } from '../services/rbacSystem';

export default function DynamicSidebar({ role, currentRoute, onNavigate, isMobile = false }) {
  const navItems = ROLE_NAVIGATION[role] || ROLE_NAVIGATION.citizen;
  const roleInfo = ROLES[role];

  if (isMobile) {
    // Bottom pill navigation for mobile
    const primaryItems = navItems.filter(item => item.isPrimary);
    const regularItems = navItems.filter(item => !item.isPrimary);
    const displayItems = regularItems.slice(0, 4);

    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(12, 16, 28, 0.92)', backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '8px 12px max(8px, env(safe-area-inset-bottom))',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        {displayItems.slice(0, 2).map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            padding: '6px 12px', borderRadius: '10px', border: 'none',
            background: currentRoute === item.id ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: currentRoute === item.id ? '#fff' : 'rgba(255,255,255,0.45)',
            cursor: 'pointer', minWidth: '56px',
          }}>
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            <span style={{ fontSize: '0.6rem', fontWeight: currentRoute === item.id ? 700 : 400 }}>{item.label}</span>
          </button>
        ))}
        {primaryItems.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9))',
            border: '2px solid rgba(255,255,255,0.2)',
            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            fontSize: '20px', marginTop: '-16px',
          }}>
            {item.icon}
          </button>
        ))}
        {displayItems.slice(2).map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            padding: '6px 12px', borderRadius: '10px', border: 'none',
            background: currentRoute === item.id ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: currentRoute === item.id ? '#fff' : 'rgba(255,255,255,0.45)',
            cursor: 'pointer', minWidth: '56px',
          }}>
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            <span style={{ fontSize: '0.6rem', fontWeight: currentRoute === item.id ? 700 : 400 }}>{item.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Desktop sidebar — role badge
  return (
    <div style={{
      position: 'fixed', top: '100px', left: '16px', zIndex: 50,
      display: 'flex', flexDirection: 'column', gap: '4px',
    }}>
      <div style={{
        padding: '6px 10px', borderRadius: '8px',
        background: `${roleInfo?.color || '#3b82f6'}12`,
        border: `1px solid ${roleInfo?.color || '#3b82f6'}25`,
        fontSize: '0.68rem', color: roleInfo?.color || '#3b82f6',
        fontWeight: 700, textAlign: 'center', marginBottom: '4px',
      }}>
        {roleInfo?.icon} {roleInfo?.label || role}
      </div>
    </div>
  );
}
