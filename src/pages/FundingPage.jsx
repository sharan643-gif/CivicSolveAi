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
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#f59e0b', marginBottom: '8px' }}>
            <DollarSign size={12} /> CSR & Project Capital Ecosystem
          </div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
            CSR Grants & Project Funding
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sponsor prototypes, review grant applications, and audit milestone disbursements.
          </p>
        </div>

        <div className="glass-l1" style={{ display: 'flex', gap: '6px', padding: '4px', borderRadius: '10px' }}>
          <button onClick={() => setActiveTab('projects')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activeTab === 'projects' ? 'rgba(245,158,11,0.15)' : 'transparent', color: activeTab === 'projects' ? '#f59e0b' : 'var(--text-secondary)' }}>
            Active Projects ({fundedProjects.length})
          </button>
          <button onClick={() => setActiveTab('grant-workflow')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activeTab === 'grant-workflow' ? 'rgba(59,130,246,0.15)' : 'transparent', color: activeTab === 'grant-workflow' ? '#60a5fa' : 'var(--text-secondary)' }}>
            Grant Application Workflow
          </button>
          <button onClick={() => setActiveTab('cost-estimator')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activeTab === 'cost-estimator' ? 'rgba(139,92,246,0.15)' : 'transparent', color: activeTab === 'cost-estimator' ? '#a78bfa' : 'var(--text-secondary)' }}>
            ✨ AI Cost Estimator
          </button>
        </div>
      </div>

      {/* Projects List */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {fundedProjects.map((p, i) => {
            const pct = Math.round((p.received / p.required) * 100);
            return (
              <div key={i} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.68rem', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>
                      {p.status}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 800 }}>{pct}% Funded</span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{p.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Challenge: {p.challenge}</p>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>Raised: ₹{p.received.toLocaleString()}</span>
                      <span>Target: ₹{p.required.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#10b981' : '#f59e0b', borderRadius: '3px' }} />
                    </div>
                  </div>

                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                    Sponsors: <strong style={{ color: '#fff' }}>{p.sponsors.join(', ')}</strong>
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
        <div className="glass-l2" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', position: 'relative' }}>National Innovation Grant Pipeline Workflow</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
            {[
              { step: '1. Submission', status: 'done' },
              { step: '2. Tech Review', status: 'done' },
              { step: '3. Impact Review', status: 'done' },
              { step: '4. CSR Approval', status: 'current' },
              { step: '5. Fund Release', status: 'pending' },
              { step: '6. Milestone Audit', status: 'pending' },
            ].map((s, idx) => (
              <div key={idx} style={{ background: s.status === 'done' ? 'rgba(16,185,129,0.1)' : s.status === 'current' ? 'rgba(59,130,246,0.15)' : 'var(--bg-elevated)', border: `1px solid ${s.status === 'done' ? 'rgba(16,185,129,0.3)' : s.status === 'current' ? '#3b82f6' : 'var(--border-subtle)'}`, padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: s.status === 'done' ? '#10b981' : s.status === 'current' ? '#60a5fa' : 'var(--text-muted)' }}>{s.step}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {s.status === 'done' ? '✓ Passed' : s.status === 'current' ? '● In Progress' : 'Pending'}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Grant Application #GR-2026-042</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Applied by Team InnoVators (BIT Mesra) · Requested: ₹5,00,000</div>
            </div>
            <button onClick={() => alert('Grant approved! Moved to Step 5: Fund Release.')} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              Approve Grant & Authorize Disbursement →
            </button>
          </div>
        </div>
      )}

      {/* AI Cost Estimator View */}
      {activeTab === 'cost-estimator' && (
        <div className="glass-l2" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', borderColor: 'rgba(139,92,246,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#8b5cf6" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>AI Solution Budget & Cost Estimator</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Indicative automated budget generated based on hardware, deployment & software requirements.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hardware & Sensors Component (₹)</label>
                <input type="number" value={estHardware} onChange={e => setEstHardware(Number(e.target.value))} className="form-input" style={{ marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Software & Cloud Subscriptions (₹)</label>
                <input type="number" value={estSoftware} onChange={e => setEstSoftware(Number(e.target.value))} className="form-input" style={{ marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Field Deployment & Logistics (₹)</label>
                <input type="number" value={estDeployment} onChange={e => setEstDeployment(Number(e.target.value))} className="form-input" style={{ marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Annual Maintenance & Support (₹)</label>
                <input type="number" value={estMaintenance} onChange={e => setEstMaintenance(Number(e.target.value))} className="form-input" style={{ marginTop: '4px' }} />
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#a78bfa', textTransform: 'uppercase', fontWeight: 700 }}>Total Indicative Estimated Budget</span>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#8b5cf6', fontFamily: 'var(--font-display)', margin: '8px 0' }}>
                ₹{totalEst.toLocaleString()}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                *Indicative AI calculation. Manually editable by domain experts & financial evaluators.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
