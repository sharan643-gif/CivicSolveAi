import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Activity } from 'lucide-react';

export default function ImpactGraph() {
  const [activeNode, setActiveNode] = useState(6); // Default active step

  const NODES = [
    { id: 1, stage: 'Citizen', label: 'Problem Reported', details: 'Aman Kumar (Dumka) submitted road access issue.', icon: '👤', color: '#06b6d4' },
    { id: 2, stage: 'AI Copilot', label: 'Structured Challenge', details: 'Priority Score 91/100, Infrastructure Category.', icon: '🤖', color: '#8b5cf6' },
    { id: 3, stage: 'Community', label: '86 Verified Reports', details: '127 citizen supporters & evidence verified.', icon: '👥', color: '#3b82f6' },
    { id: 4, stage: 'Government', label: 'Dept Validation', details: 'Validated by Shri R. K. Verma (Rural Dev Dept).', icon: '🏛️', color: '#f59e0b' },
    { id: 5, stage: 'University', label: 'BIT Mesra Matched', details: 'Faculty Dr. S.K. Bose assigned lab resources.', icon: '🎓', color: '#10b981' },
    { id: 6, stage: 'Student Team', label: 'Team InnoVators', details: 'Aarav Mehta & Priya Sharma formed project cohort.', icon: '💻', color: '#ec4899' },
    { id: 7, stage: 'Expert Review', label: 'Dr. Ramesh Pathak', icon: '🔬', details: 'Scored solution feasibility at 88/100.', color: '#8b5cf6' },
    { id: 8, stage: 'Industry Sponsor', label: 'GeoTech & Tata CSR', details: '₹2.5L Prototype Funding + Slag materials.', icon: '🏢', color: '#ec4899' },
    { id: 9, stage: 'Solution', label: 'GeoPave IoT Matrix', details: 'Slag polymer paving + moisture sensors.', icon: '💡', color: '#f59e0b' },
    { id: 10, stage: 'Pilot Program', label: 'Sikaripara 1.2 km', details: 'Field pilot active in Dumka district.', icon: '🚀', color: '#06b6d4' },
    { id: 11, stage: 'Implementation', label: 'State Scale-up', details: 'Adopted for 10 surrounding rural Panchayats.', icon: '✅', color: '#10b981' },
    { id: 12, stage: 'People Impacted', label: '1,800 Citizens', details: 'Year-round medical & school connectivity.', icon: '❤️', color: '#ef4444' }
  ];

  const curr = NODES.find(n => n.id === activeNode) || NODES[0];

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#10b981', marginBottom: '6px' }}>
            <Sparkles size={12} /> Interactive Platform Signature Feature
          </div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
            CivicSolve AI End-to-End Impact Graph
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Interactive lifecycle trace: Click any node to inspect real-time ecosystem collaboration.
          </p>
        </div>

        <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '100px', padding: '4px 12px', fontWeight: 700 }}>
          Live Connected Node Lifecycle
        </span>
      </div>

      {/* Node Graph Line */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '16px 0 24px', position: 'relative' }}>
        {NODES.map((node, i) => {
          const isActive = node.id === activeNode;
          return (
            <React.Fragment key={node.id}>
              <div
                onClick={() => setActiveNode(node.id)}
                style={{
                  minWidth: '110px',
                  background: isActive ? `${node.color}20` : 'var(--bg-elevated)',
                  border: `2px solid ${isActive ? node.color : 'var(--border-subtle)'}`,
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  boxShadow: isActive ? `0 0 20px ${node.color}40` : 'none'
                }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{node.icon}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{node.stage}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.label}</div>
              </div>

              {i < NODES.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--border-medium)', flexShrink: 0 }}>
                  <ArrowRight size={14} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Node Detail Card */}
      <div style={{ background: 'var(--bg-elevated)', border: `1px solid ${curr.color}`, borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${curr.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
          {curr.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.72rem', color: curr.color, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Node Step {curr.id} of 12 · {curr.stage}</div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{curr.label}</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{curr.details}</p>
        </div>
      </div>
    </div>
  );
}
