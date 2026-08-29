import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Award, FileText, ArrowRight, ShieldCheck, PieChart, Sparkles } from 'lucide-react';

export default function FundingPage() {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'grant-workflow' | 'cost-estimator'

  const fundedProjects = [
    { title: 'GeoPave IoT Sensor & Slag Pavement Pilot', challenge: 'Monsoon Rural Road Accessibility', required: 500000, received: 320000, sponsors: ['GeoTech Solutions', 'Tata CSR'], status: 'Active Funding' },
    { title: 'Acoustic Pipe Leakage Sensor Mesh', challenge: 'Water Pipeline Leakage Detection', required: 250000, received: 250000, sponsors: ['Ranchi Municipal Corp'], status: 'Fully Funded' },
    { title: 'Soil Nutrient Telemetry & Automated Irrigation', challenge: 'Soil Health & Crop Irrigation', required: 300000, requiredFormatted: '₹3,00,000', received: 120000, sponsors: ['Jharkhand Krishi Vikas'], status: 'Funding Open' }
  ];

  // AI Cost Estimator state
  const [estHardware, setEstHardware] = useState(180000);
  const [estSoftware, setEstSoftware] = useState(80000);
  const [estDeployment, setEstDeployment] = useState(60000);
  const [estMaintenance, setEstMaintenance] = useState(40000);

  const totalEst = estHardware + estSoftware + estDeployment + estMaintenance;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#b45309', marginBottom: '8px', fontWeight: 700 }}>
            <DollarSign size={13} color="#b45309" /> CSR & Project Capital Ecosystem
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>
            CSR Grants & Project Funding
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sponsor verified prototypes, review grant applications, and audit milestone disbursements.
          </p>
        </div>

        <div className="glass-l1" style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '10px', background: '#ffffff', border: '1px solid var(--border-subtle)', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <button onClick={() => setActiveTab('projects')} style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: activeTab === 'projects' ? 700 : 500, background: activeTab === 'projects' ? 'var(--primary)' : 'transparent', color: activeTab === 'projects' ? '#ffffff' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Active Projects ({fundedProjects.length})
          </button>
          <button onClick={() => setActiveTab('grant-workflow')} style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: activeTab === 'grant-workflow' ? 700 : 500, background: activeTab === 'grant-workflow' ? 'var(--primary)' : 'transparent', color: activeTab === 'grant-workflow' ? '#ffffff' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Grant Pipeline
          </button>
          <button onClick={() => setActiveTab('cost-estimator')} style={{ padding: '7px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: activeTab === 'cost-estimator' ? 700 : 500, background: activeTab === 'cost-estimator' ? 'var(--primary)' : 'transparent', color: activeTab === 'cost-estimator' ? '#ffffff' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            ✨ AI Cost Estimator
          </button>
        </div>
      </div>

      {/* Projects List */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {fundedProjects.map((p, i) => {
            const pct = Math.round((p.received / p.required) * 100);
            return (
              <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.68rem', background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>
                      {p.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 800 }}>{pct}% Funded</span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>Challenge: {p.challenge}</p>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>Raised: ₹{p.received.toLocaleString()}</span>
                      <span>Target: ₹{p.required.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#047857' : '#ea580c', borderRadius: '3px' }} />
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Sponsors: <strong style={{ color: 'var(--text-primary)' }}>{p.sponsors.join(', ')}</strong>
                  </div>
                </div>

                <button onClick={() => alert(`Initiated CSR funding commitment for ${p.title}`)} className="btn btn-primary" style={{ marginTop: '16px', padding: '10px', width: '100%', fontSize: '0.82rem' }}>
                  Commit CSR Funds / Sponsor →
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Grant Application Workflow View */}
      {activeTab === 'grant-workflow' && (
        <div className="glass-l2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>National Innovation Grant Pipeline Workflow</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
            {[
              { step: '1. Submission', status: 'done' },
              { step: '2. Tech Review', status: 'done' },
              { step: '3. Impact Review', status: 'done' },
              { step: '4. CSR Approval', status: 'current' },
              { step: '5. Fund Release', status: 'pending' },
              { step: '6. Milestone Audit', status: 'pending' },
            ].map((s, idx) => (
              <div key={idx} style={{ background: s.status === 'done' ? '#f0fdf4' : s.status === 'current' ? 'var(--primary-light)' : '#f8fafc', border: `1px solid ${s.status === 'done' ? '#bbf7d0' : s.status === 'current' ? 'var(--primary)' : 'var(--border-subtle)'}`, padding: '10px 8px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: s.status === 'done' ? '#047857' : s.status === 'current' ? 'var(--primary)' : 'var(--text-muted)' }}>{s.step}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
                  {s.status === 'done' ? '✓ Passed' : s.status === 'current' ? '● In Progress' : 'Pending'}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>Grant Application #GR-2026-042</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Applied by Team InnoVators (BIT Mesra) · Requested: ₹5,00,000</div>
            </div>
            <button onClick={() => alert('Grant approved! Moved to Step 5: Fund Release.')} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.84rem' }}>
              Approve Grant & Authorize Disbursement →
            </button>
          </div>
        </div>
      )}

      {/* AI Cost Estimator View */}
      {activeTab === 'cost-estimator' && (
        <div className="glass-l2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>AI Solution Budget & Cost Estimator</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Automated indicative budget computation based on hardware, logistics & software requirements.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Hardware & Sensors Component (₹)</label>
                <input type="number" value={estHardware} onChange={e => setEstHardware(Number(e.target.value))} className="form-input" style={{ marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Software & Cloud Subscriptions (₹)</label>
                <input type="number" value={estSoftware} onChange={e => setEstSoftware(Number(e.target.value))} className="form-input" style={{ marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Field Deployment & Logistics (₹)</label>
                <input type="number" value={estDeployment} onChange={e => setEstDeployment(Number(e.target.value))} className="form-input" style={{ marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Annual Maintenance & Support (₹)</label>
                <input type="number" value={estMaintenance} onChange={e => setEstMaintenance(Number(e.target.value))} className="form-input" style={{ marginTop: '4px' }} />
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Indicative Estimated Budget</span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-display)', margin: '8px 0' }}>
                ₹{totalEst.toLocaleString()}
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                *Indicative AI calculation. Manually editable by domain experts & financial evaluators.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
