import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { SECTORS, SECTOR_ROLES } from '../services/mockData';
import { supabase } from '../services/supabaseClient';
import { getProfileById, addAuditLog, upsertProfile } from '../services/supabaseService';

const SECTOR_META = {
  citizen:    { title: 'Citizen & Community Login',         subtitle: 'Report problems and help create better communities.',           color: '#06b6d4', badge: null },
  government: { title: 'Government Portal',                 subtitle: 'Coordinate, validate and deliver solutions at scale.',          color: '#3b82f6', badge: 'Authorized Personnel Only' },
  university: { title: 'University Innovation Portal',      subtitle: 'Manage student teams and collaborate with industry.',           color: '#f59e0b', badge: null },
  student:    { title: 'Student Innovation Portal',         subtitle: 'Build solutions, join teams and make an impact.',              color: '#10b981', badge: null },
  industry:   { title: 'Industry Collaboration Portal',     subtitle: 'Discover solutions, mentor teams and sponsor prototypes.',      color: '#ec4899', badge: null },
  expert:     { title: 'Expert & Mentor Portal',            subtitle: 'Review challenges, validate proposals and guide teams.',        color: '#8b5cf6', badge: null },
  ngo:        { title: 'NGO & Community Partner Portal',    subtitle: 'Represent communities and verify field-level impact.',          color: '#f97316', badge: null },
  startup:    { title: 'Startup Innovation Portal',         subtitle: 'Discover challenges, pitch solutions and apply for pilots.',    color: '#06b6d4', badge: null },
  incubator:  { title: 'Incubator & Accelerator Portal',   subtitle: 'Mentor cohorts, evaluate projects and recommend funding.',      color: '#10b981', badge: null },
  research:   { title: 'Research Collaboration Portal',     subtitle: 'Submit proposals, collaborate and share research expertise.',   color: '#8b5cf6', badge: null },
  funding:    { title: 'CSR & Funding Portal',              subtitle: 'Discover high-impact projects and manage funding milestones.',  color: '#f59e0b', badge: null },
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

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData?.user) {
      setLoading(false);
      setError(authError?.message || 'Login failed. Please check your credentials.');
      return;
    }

    const profile = await getProfileById(authData.user.id);

    if (!profile) {
      setLoading(false);
      setError('Account profile not found. Please contact support or register a new account.');
      return;
    }

    await addAuditLog(authData.user.id, 'USER_LOGIN', profile.email, `Sector: ${sectorId}, Role: ${profile.role}`);

    setLoading(false);
    onLogin({
      id: authData.user.id,
      email: profile.email,
      name: profile.name,
      sector: profile.sector || sectorId,
      role: profile.role,
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

    if (signUpError || !authData?.user) {
      setLoading(false);
      setError(signUpError?.message || 'Registration failed. Please try again.');
      return;
    }

    const userId = authData.user.id;

    // 2. Look up sector and role IDs from DB
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

    const org = extras.company_name || extras.university_name || extras.ngo_name ||
      extras.startup_name || extras.incubator_name || extras.org_name || '';

    // 3. Insert profile
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: userId,
      full_name: name || email.split('@')[0],
      email,
      primary_sector_id: sectorRow?.id || null,
      primary_role_id: roleRow?.id || null,
      verification: 'unverified',
      bio: org,
    }]);

    if (profileError) {
      console.error('[AuthSectorPage] profile insert error:', profileError.message);
    }

    await addAuditLog(userId, 'USER_REGISTRATION', email, `Sector: ${sectorId}, Role: ${role}, Status: unverified`);

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
    <div className="fade-in auth-sector-page" style={{ display: 'flex', minHeight: '90vh', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <div className="auth-sector-grid" style={{ width: '100%', maxWidth: '900px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 24px 80px -16px rgba(0,0,0,0.7)' }}>

        {/* Left: Branding Panel */}
        <div className="auth-sector-left" style={{
          background: `linear-gradient(145deg, ${meta.color}1a, rgba(0,0,0,0.6))`,
          borderRight: '1px solid var(--border-subtle)',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div>
            <button onClick={onBack} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem', marginBottom: '32px' }}>
              <ArrowLeft size={14} /> All Sectors
            </button>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{sector.icon}</div>
            {meta.badge && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '100px', padding: '4px 10px', fontSize: '0.7rem', color: '#f87171', marginBottom: '16px' }}>
                <Lock size={11} /> {meta.badge}
              </div>
            )}
            <h2 style={{ fontSize: '1.8rem', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px' }}>{meta.title}</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{meta.subtitle}</p>
          </div>

          {/* Roles available list */}
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Available Roles</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {roles.map(r => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: meta.color }} />
                  {r}
                </div>
              ))}
            </div>
          </div>

          {/* Info note */}
          <div style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}30`, borderRadius: '8px', padding: '12px 14px', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            🔒 Credentials are verified through Supabase Auth. New registrations require admin approval.
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="auth-sector-right glass-l2" style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '0' }}>
          {/* Mode toggle */}
          <div className="glass-l1" style={{ display: 'flex', gap: '2px', padding: '4px', borderRadius: '10px' }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setStep(1); setError(''); }}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, background: mode === m ? 'rgba(59,130,246,0.15)' : 'transparent', color: mode === m ? 'white' : 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="form-select">
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="your@email.com" required />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required style={{ paddingRight: '40px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  Remember me
                </label>
              </div>

              {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '10px', fontSize: '0.8rem', color: '#f87171' }}>{error}</div>}

              <button type="submit" className="btn btn-primary" style={{ padding: '14px', fontSize: '0.95rem', borderRadius: '8px' }} disabled={loading}>
                {loading ? 'Authenticating...' : `Sign In to ${sector.name}`}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Step Indicator */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ height: '3px', flex: 1, borderRadius: '2px', background: step >= s ? 'var(--primary)' : 'rgba(255,255,255,0.08)' }} />
                ))}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Step {step} of 3 — {step === 1 ? 'Personal Info' : step === 2 ? 'Organization Details' : 'Role & Verification'}
              </p>

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="Your legal name" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="Official email address" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="Create a strong password (min 6 chars)" required />
                  </div>
                  <button onClick={() => { if (!name || !email || !password) { setError('Please fill all fields.'); return; } setError(''); setStep(2); }} className="btn btn-primary" style={{ padding: '12px' }}>
                    Continue →
                  </button>
                  {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '10px', fontSize: '0.8rem', color: '#f87171' }}>{error}</div>}
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {extraFields.length > 0 ? extraFields.map(f => (
                    <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                      <label>{f.label}</label>
                      <input type="text" value={extras[f.key] || ''} onChange={e => setExtras({ ...extras, [f.key]: e.target.value })} className="form-input" placeholder={f.placeholder} />
                    </div>
                  )) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No organization details required for this sector.</div>
                  )}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>← Back</button>
                    <button onClick={() => setStep(3)} className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>Continue →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Select Your Role</label>
                    <select value={role} onChange={e => setRole(e.target.value)} className="form-select">
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '12px', fontSize: '0.78rem', color: '#fbbf24', display: 'flex', gap: '8px' }}>
                    <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span>Your registration will be reviewed by our admin team. You will receive email confirmation within 24 hours of verification approval.</span>
                  </div>
                  {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', padding: '10px', fontSize: '0.8rem', color: '#f87171' }}>{error}</div>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(2)} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>← Back</button>
                    <button onClick={handleRegister} className="btn btn-primary" style={{ flex: 1, padding: '12px' }} disabled={loading}>
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
