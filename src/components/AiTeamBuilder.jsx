import React, { useState } from 'react';
import { Users, UserPlus, Sparkles, CheckCircle2, Award, Zap, ShieldCheck } from 'lucide-react';

export default function AiTeamBuilder({ onTeamCreated }) {
  const [created, setCreated] = useState(false);

  const candidates = [
    { name: 'Aarav Mehta', role: 'Student Developer', domain: 'AI & Data Science', match: 97, avatar: '🎓', skills: ['Python', 'GIS Analytics', 'PyTorch'] },
    { name: 'Priya Sharma', role: 'Student Developer', domain: 'Backend & IoT Systems', match: 94, avatar: '💻', skills: ['Node.js', 'ESP32 IoT', 'PostgreSQL'] },
    { name: 'Rohan Gupta', role: 'UI/UX Designer', domain: 'Mobile & Web Frontend', match: 88, avatar: '🎨', skills: ['React', 'Figma', 'GIS Visualization'] },
    { name: 'Dr. Ramesh Pathak', role: 'Domain Expert', domain: 'Civil & Hydro Engineering', match: 92, avatar: '🕵️', skills: ['Structural Engineering', 'Soil Dynamics'] }
  ];

  const handleBuild = () => {
    setCreated(true);
    if (onTeamCreated) onTeamCreated();
  };

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'rgba(16,185,129,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>AI Team Builder</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Automated Complementary Skill & Role Matching</span>
          </div>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>
          100% Skill Coverage
        </span>
      </div>

      {created ? (
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
          <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Recommended Team Cohort Created!</h5>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Invitations sent to 3 Students and 1 Domain Expert. Workspace initialized.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {candidates.map(c => (
              <div key={c.name} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>{c.avatar}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{c.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.role} · {c.domain}</div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    {c.skills.slice(0, 2).map(s => (
                      <span key={s} style={{ background: 'rgba(255,255,255,0.04)', fontSize: '0.62rem', padding: '1px 5px', borderRadius: '4px', color: 'var(--text-secondary)' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-display)' }}>
                  {c.match}%
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleBuild} className="btn btn-primary" style={{ padding: '12px', width: '100%', fontSize: '0.85rem', borderRadius: '8px' }}>
            <UserPlus size={16} /> Create Recommended Innovation Team
          </button>
        </>
      )}
    </div>
  );
}
