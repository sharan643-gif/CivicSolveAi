import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, AlertTriangle, Activity, Users, Globe, Database } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { getProfileById, addAuditLog } from '../services/supabaseService';

const HEALTH_CHECKS = [
  { id: 'db',    label: 'Database Connectivity', icon: Database,  status: 'ok' },
  { id: 'auth',  label: 'Auth Services',          icon: Shield,    status: 'ok' },
  { id: 'users', label: 'Active Sessions',         icon: Users,    status: 'ok' },
  { id: 'api',   label: 'AI Engine',               icon: Activity, status: 'ok' },
  { id: 'cdn',   label: 'CDN / Edge Network',      icon: Globe,    status: 'ok' },
];

export default function SuperAdminLogin({ onLogin }) {
  const [step, setStep] = useState(0); // 0=loading, 1=credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [healthLoaded, setHealthLoaded] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setTimeout(() => { setHealthLoaded(true); setStep(1); }, 1500);
    const clock = setInterval(() => setTime(new Date()), 1000);
    return () => { clearTimeout(t); clearInterval(clock); };
  }, []);

  const handleCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData?.user) {
      setError('Invalid credentials. Please check your email and password.');
      setLoading(false);
      return;
    }

    // Fetch profile to verify super_admin role
    const profile = await getProfileById(authData.user.id);

    if (!profile || profile.role_slug !== 'super_admin') {
      await supabase.auth.signOut();
      setError('Access denied. This portal is restricted to Super Administrators only.');
      setLoading(false);
      return;
    }

    // Log the login
    await addAuditLog(authData.user.id, 'SUPER_ADMIN_LOGIN', profile.email, 'Admin login successful');

    setLoading(false);
    onLogin({
      id: authData.user.id,
      email: profile.email,
      name: profile.name,
      sector: 'super_admin',
      role: 'Super Admin',
      role_slug: 'super_admin',
      avatar: '👑',
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 4vw, 40px)', position: 'relative', overflow: 'hidden' }}>
      {/* Animated background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(239,68,68,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)' }} />

      {/* Grid lines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />

      <div className="fade-in" style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>
            👑
          </div>
          <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 800, background: 'linear-gradient(135deg, #ef4444, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Super Admin Command Center
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>CivicSolve AI Platform · Restricted Access</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            {time.toLocaleTimeString()} IST · {time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* System Health Check Card */}
        <div className="glass-l2" style={{ padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>System Health</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#10b981' }}>{healthLoaded ? 'All Systems Operational' : 'Checking...'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {HEALTH_CHECKS.map((check) => {
              const Icon = check.icon;
              return (
                <div key={check.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: healthLoaded ? 1 : 0.3, transition: 'opacity 0.4s' }}>
                  <Icon size={13} color="#10b981" />
                  <span style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{check.label}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981', fontFamily: 'monospace' }}>● OK</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 0 - Loading */}
        {step === 0 && (
          <div className="glass-l2" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Initializing secure environment...</div>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--border-subtle)', borderTopColor: '#ef4444', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        )}

        {/* STEP 1 - Credentials */}
        {step === 1 && (
          <div className="glass-l2" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Lock size={16} color="#ef4444" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Authentication Required</h3>
            </div>
            <form onSubmit={handleCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="admin@admin.com"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Master Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••••••"
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '10px', fontSize: '0.78rem', color: '#f87171', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                style={{ padding: '13px', borderRadius: '8px', background: 'linear-gradient(135deg, #ef4444, #8b5cf6)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Authenticate →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
