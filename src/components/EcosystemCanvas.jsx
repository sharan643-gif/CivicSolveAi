import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Cpu, Building2, GraduationCap, Building, LineChart } from 'lucide-react';

const NODES = [
  { id: 'center', label: 'CivicSolve AI', fullTitle: 'CivicSolve AI Core Engine', icon: Sparkles, color: '#8b5cf6', bg: 'rgba(139,92,246,0.2)', desc: 'AI-Powered Ecosystem Core: Dynamically ingests citizen reports, runs duplicate detection, calculates priority scores, and routes challenges to optimal university & industry cohorts.' },
  { id: 'citizen', label: 'Community', fullTitle: 'Community & Citizens', icon: Users, color: '#06b6d4', bg: 'rgba(6,182,212,0.15)', desc: 'Citizens report local challenges, confirm field evidence, and support community priorities.' },
  { id: 'ai', label: 'AI Suite', fullTitle: 'AI Intelligence Suite', icon: Cpu, color: '#a78bfa', bg: 'rgba(167,139,250,0.15)', desc: 'AI structures raw input into categories, generates root-cause analysis, and recommends team skills.' },
  { id: 'gov', label: 'Government', fullTitle: 'Government Agencies', icon: Building2, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', desc: 'Nodal officers validate issues, allocate department resources, monitor SLAs, and authorize field pilots.' },
  { id: 'uni', label: 'Universities', fullTitle: 'Universities & Students', icon: GraduationCap, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', desc: 'Student engineering cohorts & research labs build prototypes targeted at validated societal needs.' },
  { id: 'ind', label: 'Industry', fullTitle: 'Industry & CSR Partners', icon: Building, color: '#ec4899', bg: 'rgba(236,72,153,0.15)', desc: 'Corporates provide CSR seed funding, technical mentorship, dataset APIs, and pilot scaling support.' },
  { id: 'imp', label: 'Social Impact', fullTitle: 'Social Impact & Metrics', icon: LineChart, color: '#10b981', bg: 'rgba(16,185,129,0.15)', desc: 'Real-time telemetry tracks people impacted, cost savings, and verified SDG milestones.' },
];

export default function EcosystemCanvas() {
  const [activeNode, setActiveNode] = useState(NODES[0]);

  // Position map (percentages) ensuring plenty of breathing room between nodes
  const posMap = {
    center:  { left: '50%', top: '44%' },
    citizen: { left: '84%', top: '44%' },
    ai:      { left: '72%', top: '78%' },
    gov:     { left: '28%', top: '78%' },
    uni:     { left: '16%', top: '44%' },
    ind:     { left: '28%', top: '10%' },
    imp:     { left: '72%', top: '10%' },
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '480px', background: 'linear-gradient(145deg, rgba(14, 19, 32, 0.9), rgba(7, 9, 14, 0.95))', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '22px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
      
      {/* Background Tech Grid Lines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '24px 24px, 40px 40px', maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 90%)', pointerEvents: 'none' }} />
      {/* Inner highlight */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', borderRadius: 'inherit', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)', pointerEvents: 'none' }} />

      {/* Interactive Diagram Canvas */}
      <div style={{ position: 'relative', width: '100%', height: '330px', marginTop: '6px' }}>
        
        {/* SVG Animated Connector Beams */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal Outer Connecting Lines */}
          <polygon 
            points="72%,10% 84%,44% 72%,78% 28%,78% 16%,44% 28%,10%" 
            fill="none" 
            stroke="rgba(255,255,255,0.08)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
          />

          {/* Spokes from Center to Satellites */}
          {['citizen', 'ai', 'gov', 'uni', 'ind', 'imp'].map((id) => (
            <line
              key={id}
              x1="50%" y1="44%"
              x2={posMap[id].left} y2={posMap[id].top}
              stroke="url(#beamGrad)"
              strokeWidth="2"
              strokeOpacity="0.35"
              filter="url(#neonGlow)"
            />
          ))}
        </svg>

        {/* ── Center Node (CivicSolve AI) ────────────────────────────────────────────── */}
        <div
          onMouseEnter={() => setActiveNode(NODES[0])}
          style={{
            position: 'absolute',
            left: posMap.center.left,
            top: posMap.center.top,
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
            cursor: 'pointer'
          }}
        >
          {/* Animated Pulsing Ring */}
          <div style={{
            position: 'absolute',
            inset: '-12px',
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.4)',
            animation: 'pulse 2.5s infinite',
            pointerEvents: 'none'
          }} />
          
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            border: '2px solid #a78bfa',
            borderRadius: '100px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 30px rgba(139,92,246,0.6)',
          }}>
            <Sparkles size={16} color="#fff" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
              CivicSolve AI
            </span>
          </div>
        </div>

        {/* ── 6 Satellite Nodes ────────────────────────────────────────────────────── */}
        {NODES.slice(1).map((node) => {
          const Icon = node.icon;
          const pos = posMap[node.id];
          const isSelected = activeNode.id === node.id;

          return (
            <div
              key={node.id}
              onMouseEnter={() => setActiveNode(node)}
              style={{
                position: 'absolute',
                left: pos.left,
                top: pos.top,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                cursor: 'pointer'
              }}
            >
              <div style={{
                background: isSelected ? node.bg : 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                border: `1.5px solid ${isSelected ? node.color : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '100px',
                padding: '5px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isSelected ? `0 0 20px ${node.color}50` : '0 4px 15px rgba(0,0,0,0.4)',
                transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: `${node.color}25`, border: `1px solid ${node.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={12} color={node.color} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}

      </div>

      {/* ── Active Node Information Card ────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${activeNode.color}40`,
        borderLeft: `4px solid ${activeNode.color}`,
        borderRadius: '12px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${activeNode.color}20`, border: `1px solid ${activeNode.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {React.createElement(activeNode.icon, { size: 18, color: activeNode.color })}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
              {activeNode.fullTitle || activeNode.label}
            </h4>
            <span style={{ fontSize: '0.62rem', padding: '1px 6px', borderRadius: '100px', background: `${activeNode.color}20`, color: activeNode.color, fontWeight: 700, border: `1px solid ${activeNode.color}40` }}>
              Ecosystem Node
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px', lineHeight: 1.35 }}>
            {activeNode.desc}
          </p>
        </div>
      </div>

    </div>
  );
}
