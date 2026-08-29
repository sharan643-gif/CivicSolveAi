import React from 'react';
import { ShieldOff, ArrowLeft, Home, Lock } from 'lucide-react';
import { hasPermission, isRouteAllowed, ROLES } from '../services/rbacSystem';

// ─── Access Denied Page ──────────────────────────────────────────────────────

export function AccessDeniedPage({ reason, onNavigate, requiredRole, currentRole }) {
  return (
    <div className="fade-in" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: '40px 20px', textAlign: 'center',
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
      }}>
        <ShieldOff size={36} color="#ef4444" />
      </div>

      <h1 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '8px' }}>
        Access Restricted
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '8px' }}>
        {reason || "You don't have permission to access this resource."}
      </p>

      {requiredRole && (
        <div style={{
          padding: '8px 16px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.2)', marginBottom: '24px',
        }}>
          <span style={{ fontSize: '0.82rem', color: '#fbbf24' }}>
            Required: <strong>{requiredRole}</strong>
            {currentRole && <> · Your role: <strong>{ROLES[currentRole]?.label || currentRole}</strong></>}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <button onClick={() => onNavigate('dashboard')} className="btn btn-primary" style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
        }}>
          <Home size={14} /> Go to Dashboard
        </button>
        <button onClick={() => onNavigate(-1)} className="btn btn-secondary" style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
        }}>
          <ArrowLeft size={14} /> Go Back
        </button>
      </div>
    </div>
  );
}

// ─── Protected Route Wrapper ─────────────────────────────────────────────────

export function ProtectedRoute({ children, route, role, onNavigate, onAccessDenied }) {
  if (!isRouteAllowed(role, route)) {
    if (onAccessDenied) onAccessDenied();
    return <AccessDeniedPage onNavigate={onNavigate} currentRole={role} />;
  }
  return children;
}

// ─── Permission Guard Component ──────────────────────────────────────────────

export function PermissionGuard({ children, permission, role, context, fallback, onNavigate }) {
  if (!hasPermission(role, permission, context)) {
    if (fallback) return fallback;
    return null;
  }
  return children;
}

// ─── Permission Button ──────────────────────────────────────────────────────

export function PermissionButton({ children, permission, role, context, style, className, onClick, disabled, ...props }) {
  const allowed = hasPermission(role, permission, context);

  if (!allowed) return null;

  return (
    <button
      className={className}
      style={{
        ...style,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Permission Indicator ───────────────────────────────────────────────────

export function PermissionIndicator({ permission, role, context, showDenied = false }) {
  const allowed = hasPermission(role, permission, context);

  if (!allowed && !showDenied) return null;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px',
      background: allowed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
      color: allowed ? '#10b981' : '#ef4444',
      border: `1px solid ${allowed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
    }}>
      <Lock size={9} />
      {allowed ? 'Allowed' : 'Restricted'}
    </span>
  );
}

export default { AccessDeniedPage, ProtectedRoute, PermissionGuard, PermissionButton, PermissionIndicator };
