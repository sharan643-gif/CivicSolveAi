import React, { useState } from 'react';
import { FileText, CheckCircle2, ShieldCheck, PenTool, Lock } from 'lucide-react';

export default function CollaborationAgreement({ challengeTitle = 'Monsoon Rural Road Accessibility' }) {
  const [stage, setStage] = useState('review'); // 'draft' | 'review' | 'signed'
  const [signedByUniversity, setSignedByUniversity] = useState(true);
  const [signedByIndustry, setSignedByIndustry] = useState(false);
  const [signedByGovernment, setSignedByGovernment] = useState(false);

  const handleSignIndustry = () => {
    setSignedByIndustry(true);
    if (signedByUniversity && true) {
      setStage('signed');
    }
  };

  return (
    <div className="glass-l2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={20} color="#3b82f6" />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Digital Collaboration Agreement (MOU)</h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Project: {challengeTitle}</span>
          </div>
        </div>

        <span style={{
          padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
          background: stage === 'signed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
          color: stage === 'signed' ? '#10b981' : '#f59e0b',
          border: `1px solid ${stage === 'signed' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`
        }}>
          {stage === 'signed' ? '✓ Fully Signed & Active' : '✍ Pending Signatures'}
        </span>
      </div>

      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        <p><strong>Parties Engaged:</strong> BIT Mesra (University Host), GeoTech Solutions Pvt Ltd (Industry Sponsor), Dept of Rural Development (Govt Observer).</p>
        <p><strong>Terms:</strong> Industry agrees to provide ₹2,50,000 seed grant and 3 technical mentors for the Sikaripara Block pilot. University agrees to provide laboratory soil testing facilities and oversee student development team.</p>
        <p><strong>IP & Licensing:</strong> All research outputs remain Open Civic Data under MIT License for government implementation across Jharkhand districts.</p>
      </div>

      {/* Signatures status grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ background: 'var(--bg-elevated)', border: `1px solid ${signedByUniversity ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`, padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>University Signatory</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Dr. S. K. Bose</div>
          <div style={{ fontSize: '0.68rem', color: signedByUniversity ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
            {signedByUniversity ? '✓ e-Signed 22 Aug 2026' : 'Awaiting Signature'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-elevated)', border: `1px solid ${signedByIndustry ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`, padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Industry Partner</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Vivek Anand (GeoTech)</div>
          {signedByIndustry ? (
            <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '4px' }}>✓ e-Signed 22 Aug 2026</div>
          ) : (
            <button onClick={handleSignIndustry} className="btn btn-primary" style={{ marginTop: '4px', padding: '4px 10px', fontSize: '0.68rem', width: '100%' }}>
              <PenTool size={10} /> Sign MOU Digitally
            </button>
          )}
        </div>

        <div style={{ background: 'var(--bg-elevated)', border: `1px solid ${signedByGovernment ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`, padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Government Nodal Officer</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>Shri R. K. Verma</div>
          <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '4px' }}>✓ Countersigned 22 Aug 2026</div>
        </div>
      </div>
    </div>
  );
}
