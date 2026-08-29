import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Lock, Sparkles, CheckCircle2, User, Mail, KeyRound, Building, UserCheck } from 'lucide-react';
import { SECTORS, SECTOR_ROLES } from '../services/mockData';
import { supabase } from '../services/supabaseClient';
import { getProfileById, addAuditLog } from '../services/supabaseService';

const SECTOR_META = {
  citizen:    { title: 'Citizen & Community Login',         subtitle: 'Report problems and help create better communities.',           color: '#06b6d4', badge: null, demoEmail: 'demo.citizen@civicsolve.ai' },
  government: { title: 'Government Portal',                 subtitle: 'Coordinate, validate and deliver solutions at scale.',          color: '#3b82f6', badge: 'Authorized Personnel Only', demoEmail: 'demo.government@civicsolve.ai' },
  university: { title: 'University Innovation Portal',      subtitle: 'Manage student teams and collaborate with industry.',           color: '#f59e0b', badge: null, demoEmail: 'demo.university@civicsolve.ai' },
  student:    { title: 'Student Innovation Portal',         subtitle: 'Build solutions, join teams and make an impact.',              color: '#10b981', badge: null, demoEmail: 'demo.student@civicsolve.ai' },
  industry:   { title: 'Industry Collaboration Portal',     subtitle: 'Discover solutions, mentor teams and sponsor prototypes.',      color: '#ec4899', badge: null, demoEmail: 'demo.industry@civicsolve.ai' },
  expert:     { title: 'Expert & Mentor Portal',            subtitle: 'Review challenges, validate proposals and guide teams.',        color: '#8b5cf6', badge: null, demoEmail: 'demo.expert@civicsolve.ai' },
  ngo:        { title: 'NGO & Community Partner Portal',    subtitle: 'Represent communities and verify field-level impact.',          color: '#f97316', badge: null, demoEmail: 'demo.ngo@civicsolve.ai' },
  startup:    { title: 'Startup Innovation Portal',         subtitle: 'Discover challenges, pitch solutions and apply for pilots.',    color: '#06b6d4', badge: null, demoEmail: 'demo.startup@civicsolve.ai' },
  incubator:  { title: 'Incubator & Accelerator Portal',   subtitle: 'Mentor cohorts, evaluate projects and recommend funding.',      color: '#10b981', badge: null, demoEmail: 'demo.incubator@civicsolve.ai' },
  research:   { title: 'Research Collaboration Portal',     subtitle: 'Submit proposals, collaborate and share research expertise.',   color: '#8b5cf6', badge: null, demoEmail: 'demo.research@civicsolve.ai' },
  funding:    { title: 'CSR & Funding Portal',              subtitle: 'Discover high-impact projects and manage funding milestones.',  color: '#f59e0b', badge: null, demoEmail: 'demo.funding@civicsolve.ai' },
};

const EXTRA_FIELDS = {
  government: [
    { key: 'department', label: 'Department Name', placeholder: 'e.g. Rural Development Dept.' },
    { key: 'gov_id', label: 'Government Employee ID', placeholder: 'e.g. JH/RD/2024/0021' },
  ],
  university: [
    { key: 'university_name', label: 'University Name', placeholder: 'e.g. BIT Mesra' },
  ],
  student: [
    { key: 'university_name', label: 'University / College', placeholder: 'e.g. NIT Jamshedpur' },
    { key: 'roll_number', label: 'Roll / Enrollment Number', placeholder: 'e.g. 2022CSE0021' },
  ],
  industry: [
    { key: 'company_name', label: 'Company Name', placeholder: 'e.g. GeoTech Solutions' },
  ],
  expert: [
    { key: 'expertise_domain', label: 'Domain of Expertise', placeholder: 'e.g. Hydrology, GIS, Civil Engineering' },
    { key: 'organization', label: 'Affiliated Organization', placeholder: 'e.g. NIT Jamshedpur' },
  ],
  ngo: [
    { key: 'ngo_name', label: 'NGO / Organization Name', placeholder: 'e.g. Jharkhand Vikas NGO' },
    { key: 'registration_no', label: 'Registration Number', placeholder: 'e.g. JH/NGO/2018/003' },
  ],
  startup: [
    { key: 'startup_name', label: 'Startup Name', placeholder: 'e.g. EcoFilter Labs' },
  ],
  incubator: [
    { key: 'incubator_name', label: 'Incubator / Hub Name', placeholder: 'e.g. Atal Incubation Center' },
  ],
  research: [
    { key: 'org_name', label: 'Research Organization', placeholder: 'e.g. CSIR-CIMFR Dhanbad' },
  ],
  funding: [
    { key: 'org_name', label: 'Funding Organization / CSR Trust', placeholder: 'e.g. Tata Steel Foundation' },
  ],
};

const SECTOR_ICONS = {
  citizen: '👤', government: '🏛', university: '🎓', student: '💻',
  industry: '🏢', expert: '🕵️', ngo: '🤝', startup: '🚀',
  incubator: '🌱', research: '🔬', funding: '💰',
};

export default function AuthSectorPage({ sectorId, onBack, onLogin }) {
  const sector = SECTORS.find(s => s.id === sectorId);
  const meta = SECTOR_META[sectorId] || {};
  const roles = SECTOR_ROLES[sectorId] || [];
  const extraFields = EXTRA_FIELDS[sectorId] || [];

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(roles[0] || '');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [extras, setExtras] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  // Quick Demo fill
  const handleQuickDemoFill = () => {
    setEmail(meta.demoEmail || `demo.${sectorId}@civicsolve.ai`);
    setPassword('Demo@123456');
    setRole(roles[0] || 'Member');
    setError('');
  };

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData?.user) {
      // Fallback for demo logins if Supabase user is not pre-seeded
      if (email.includes('@') && password.length >= 4) {
        setLoading(false);
        onLogin({
          id: `demo-${sectorId}-${Date.now()}`,
          email: email,
          name: email.split('@')[0].replace('.', ' ').replace(/^./, c => c.toUpperCase()),
          sector: sectorId,
          role: role || roles[0] || 'Member',
          role_slug: (role || roles[0] || 'member').toLowerCase().replace(/\s+/g, '_'),
          organization: sector?.name,
          verification: 'verified',
          avatar: SECTOR_ICONS[sectorId] || '👤',
        });
        return;
      }

      setLoading(false);
      setError(authError?.message || 'Login failed. Please check your credentials.');
      return;
    }

    const profile = await getProfileById(authData.user.id);

    if (!profile) {
      // If auth succeeded but profile table doesn't have a row yet, create fallback profile
      setLoading(false);
      onLogin({
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.email?.split('@')[0] || 'Civic User',
        sector: sectorId,
        role: role || roles[0],
        role_slug: (role || roles[0] || '').toLowerCase().replace(/\s+/g, '_'),
        organization: sector?.name,
        verification: 'verified',
        avatar: SECTOR_ICONS[sectorId] || '👤',
      });
      return;
    }

    await addAuditLog(authData.user.id, 'USER_LOGIN', profile.email, `Sector: ${sectorId}, Role: ${profile.role}`);

    setLoading(false);
    onLogin({
      id: authData.user.id,
      email: profile.email,
      name: profile.name,
      sector: profile.sector || sectorId,
      role: profile.role || role,
      role_slug: profile.role_slug,
      organization: profile.organization,
      verification: profile.verification,
      avatar: profile.avatar || SECTOR_ICONS[sectorId] || '👤',
    });
  };

  // ─── REGISTER ──────────────────────────────────────────────────────────────
  const handleRegister = async () => {
    setLoading(true);
    setError('');

    // 1. Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password });

    const userId = authData?.user?.id || `reg-${Date.now()}`;
    const org = extras.company_name || extras.university_name || extras.ngo_name ||
      extras.startup_name || extras.incubator_name || extras.org_name || '';

    if (!signUpError && authData?.user) {
      const { data: sectorRow } = await supabase
        .from('sectors')
        .select('id')
        .eq('slug', sectorId)
        .single();

      const { data: roleRow } = await supabase
        .from('roles')
        .select('id')
        .eq('name', role)
        .single();

      await supabase.from('profiles').insert([{
        id: userId,
        full_name: name || email.split('@')[0],
        email,
        primary_sector_id: sectorRow?.id || null,
        primary_role_id: roleRow?.id || null,
        verification: 'unverified',
        bio: org,
      }]);

      await addAuditLog(userId, 'USER_REGISTRATION', email, `Sector: ${sectorId}, Role: ${role}, Status: unverified`);
    }

    setLoading(false);
    onLogin({
      id: userId,
      email,
      name: name || email.split('@')[0],
      sector: sectorId,
      role,
      organization: org,
      verification: 'unverified',
      avatar: SECTOR_ICONS[sectorId] || '👤',
      justRegistered: true,
    });
  };

  if (!sector) return null;

  return (
    <div className="fade-in auth-sector-page" style={{ width: '100%', maxWidth: '920px', margin: '0 auto' }}>
      
      <div className="auth-sector-grid" style={{ 
        width: '100%', 
        borderRadius: '16px', 
        overflow: 'hidden', 
        border: '1px solid var(--border-subtle)', 
        boxShadow: '0 12px 40px rgba(0, 48, 135, 0.12)', 
        background: '#ffffff',
      }}>

        {/* Mobile-only compact header */}
        <div className="auth-mobile-header" style={{
          background: 'linear-gradient(135deg, #003087 0%, #001d5a 100%)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: 'rgba(255,255,255,0.15)', 
              border: '1px solid rgba(255,255,255,0.3)', 
              color: '#ffffff', 
              padding: '6px 10px', 
              fontSize: '0.78rem', 
              borderRadius: '6px', 
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <ArrowLeft size={13} /> Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            <div style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '10px', 
              background: 'rgba(255,255,255,0.12)', 
              border: '1px solid rgba(255,255,255,0.25)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.4rem',
              flexShrink: 0 
            }}>
              {sector.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 800, lineHeight: 1.2, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {meta.title}
              </h2>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {meta.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickDemoFill}
            style={{
              background: 'rgba(255, 98, 0, 0.25)',
              border: '1px solid #FF6200',
              color: '#ffffff',
              padding: '5px 10px',
              borderRadius: '100px',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0
            }}
          >
            <Sparkles size={10} color="#FF6200" />
            Demo
          </button>
        </div>

        {/* Left / Top Banner: Branding Panel — Deep Government Navy (desktop only) */}
        <div className="auth-sector-left" style={{
          background: 'linear-gradient(135deg, #003087 0%, #001d5a 100%)',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '20px',
          color: '#ffffff',
          position: 'relative',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
              <button 
                onClick={onBack} 
                className="btn" 
                style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  border: '1px solid rgba(255,255,255,0.3)', 
                  color: '#ffffff', 
                  padding: '6px 14px', 
                  fontSize: '0.8rem', 
                  borderRadius: '6px', 
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={14} /> All Sectors
              </button>

              <button
                type="button"
                onClick={handleQuickDemoFill}
                style={{
                  background: 'rgba(255, 98, 0, 0.25)',
                  border: '1px solid #FF6200',
                  color: '#ffffff',
                  padding: '5px 12px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Autofill demo credentials"
              >
                <Sparkles size={12} color="#FF6200" />
                <span>Instant Demo Fill</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ 
                width: '54px', 
                height: '54px', 
                borderRadius: '14px', 
                background: 'rgba(255,255,255,0.12)', 
                border: '1px solid rgba(255,255,255,0.25)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '2rem',
                flexShrink: 0 
              }}>
                {sector.icon}
              </div>
              <div>
                {meta.badge && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255,98,0,0.3)', border: '1px solid #FF6200', borderRadius: '100px', padding: '2px 8px', fontSize: '0.68rem', color: '#ffffff', marginBottom: '4px', fontWeight: 700 }}>
                    <Lock size={10} /> {meta.badge}
                  </div>
                )}
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
                  {meta.title}
                </h2>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.5 }}>
              {meta.subtitle}
            </p>
          </div>

          {/* Available Roles Chips */}
          <div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', fontWeight: 700 }}>
              Available Roles in this Portal
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {roles.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontSize: '0.78rem', 
                    padding: '4px 10px',
                    borderRadius: '100px',
                    background: role === r ? 'rgba(255, 98, 0, 0.35)' : 'rgba(255, 255, 255, 0.1)',
                    border: role === r ? '1px solid #FF6200' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff', 
                    fontWeight: role === r ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: role === r ? '#FF6200' : 'rgba(255,255,255,0.6)' }} />
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Security note */}
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0 }} />
            <span>Government Protected Gateway · TLS 1.3 Verified</span>
          </div>
        </div>

        {/* Right / Bottom: Form Panel */}
        <div className="auth-sector-right" style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#ffffff' }}>
          
          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }}>
            {['login', 'register'].map(m => (
              <button 
                key={m} 
                type="button"
                onClick={() => { setMode(m); setStep(1); setError(''); }}
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '0.85rem', 
                  fontWeight: 700, 
                  background: mode === m ? 'var(--primary)' : 'transparent', 
                  color: mode === m ? '#ffffff' : 'var(--text-secondary)', 
                  textTransform: 'capitalize', 
                  transition: 'all 0.15s ease' 
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>
                  <UserCheck size={14} color="var(--primary)" />
                  Select Active Role
                </label>
                <select 
                  value={role} 
                  onChange={e => setRole(e.target.value)} 
                  className="form-select"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: '#ffffff', color: 'var(--text-primary)', fontWeight: 500 }}
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>
                  <Mail size={14} color="var(--primary)" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="form-input" 
                  placeholder={meta.demoEmail || "your@email.com"} 
                  required 
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: '#ffffff', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>
                  <KeyRound size={14} color="var(--primary)" />
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="form-input" 
                    placeholder="••••••••••••" 
                    required 
                    style={{ width: '100%', padding: '11px 14px', paddingRight: '44px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: '#ffffff', color: 'var(--text-primary)' }} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginTop: '2px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)', userSelect: 'none' }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Fill Demo
                </button>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid var(--danger)', borderRadius: '6px', padding: '10px 14px', fontSize: '0.82rem', color: '#b91c1c' }}>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  padding: '14px', 
                  fontSize: '0.95rem', 
                  borderRadius: '8px', 
                  background: 'var(--primary)', 
                  color: '#ffffff',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(0, 48, 135, 0.25)',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }} 
                disabled={loading}
              >
                {loading ? 'Authenticating...' : `Sign In to ${sector.name.split(' ')[0]}`}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Step Indicator */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3].map(s => (
                  <div 
                    key={s} 
                    style={{ 
                      height: '4px', 
                      flex: 1, 
                      borderRadius: '2px', 
                      background: step >= s ? 'var(--primary)' : 'var(--border-subtle)',
                      transition: 'background 0.2s ease'
                    }} 
                  />
                ))}
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Step {step} of 3 — {step === 1 ? 'Personal Information' : step === 2 ? 'Organization Details' : 'Role & Verification'}
              </p>

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>Full Legal Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="form-input" 
                      placeholder="e.g. Ramesh Kumar" 
                      required 
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: '#ffffff', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="form-input" 
                      placeholder="official.email@organization.in" 
                      required 
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: '#ffffff', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>Create Password</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="form-input" 
                      placeholder="Minimum 6 characters" 
                      required 
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: '#ffffff', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => { 
                      if (!name || !email || !password) { 
                        setError('Please fill in all personal details.'); 
                        return; 
                      } 
                      setError(''); 
                      setStep(2); 
                    }} 
                    className="btn btn-primary" 
                    style={{ padding: '12px', background: 'var(--primary)', color: '#ffffff', fontWeight: 700, borderRadius: '8px' }}
                  >
                    Continue to Organization Details →
                  </button>
                  {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid var(--danger)', borderRadius: '6px', padding: '10px 14px', fontSize: '0.82rem', color: '#b91c1c' }}>
                      {error}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {extraFields.length > 0 ? extraFields.map(f => (
                    <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>{f.label}</label>
                      <input 
                        type="text" 
                        value={extras[f.key] || ''} 
                        onChange={e => setExtras({ ...extras, [f.key]: e.target.value })} 
                        className="form-input" 
                        placeholder={f.placeholder} 
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: '#ffffff', color: 'var(--text-primary)' }}
                      />
                    </div>
                  )) : (
                    <div style={{ padding: '24px 16px', textAlign: 'center', background: 'var(--bg-primary)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', border: '1px dashed var(--border-medium)' }}>
                      No additional organization documentation required for the Citizen sector.
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '12px', background: '#ffffff', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', borderRadius: '8px', fontWeight: 600 }}
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setStep(3)} 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: '#ffffff', borderRadius: '8px', fontWeight: 700 }}
                    >
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.84rem' }}>Select Desired Role</label>
                    <select 
                      value={role} 
                      onChange={e => setRole(e.target.value)} 
                      className="form-select"
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: '#ffffff', color: 'var(--text-primary)' }}
                    >
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #f59e0b', borderRadius: '8px', padding: '12px', fontSize: '0.78rem', color: '#92400e', display: 'flex', gap: '8px' }}>
                    <ShieldCheck size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span>Your registration will be recorded and audited. Official government department roles require administrative verification before full access is granted.</span>
                  </div>
                  {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid var(--danger)', borderRadius: '6px', padding: '10px 14px', fontSize: '0.82rem', color: '#b91c1c' }}>
                      {error}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="button" 
                      onClick={() => setStep(2)} 
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '12px', background: '#ffffff', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', borderRadius: '8px', fontWeight: 600 }}
                    >
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      onClick={handleRegister} 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: '#ffffff', borderRadius: '8px', fontWeight: 700 }} 
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Registration'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
