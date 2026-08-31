import React, { useState } from 'react';
import { Network, ChevronRight, User, Building, Landmark, GraduationCap, DollarSign, Cpu, HeartHandshake } from 'lucide-react';
import { COLLABORATION_GRAPH_NODES, COLLABORATION_GRAPH_EDGES } from '../services/janSetuV2Service';

export default function CollaborationGraph() {
  const [selectedNode, setSelectedNode] = useState(COLLABORATION_GRAPH_NODES[0]);

  const getNodeIcon = (type) => {
    switch (type) {
      case 'problem': return '🚨';
      case 'govt': return '🏛️';
      case 'university': return '🎓';
      case 'faculty': return '👨‍🏫';
      case 'student': return '💻';
      case 'startup': return '🏢';
      case 'csr': return '💰';
      case 'solution': return '⚡';
      case 'community': return '🤝';
      default: return '📍';
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border-subtle)',
      borderTop: '3px solid var(--primary)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            JanSetu Ecosystem Collaboration Graph
          </h3>
        </div>
        <span style={{ fontSize: '0.72rem', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
          Interactive Multi-Sector Network
        </span>
      </div>

      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Visualizing relationships across Citizens → Government → Universities → Students → Startups → CSR → Solutions → Impact.
      </p>

      {/* Visual Network Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px',
        background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px dashed #cbd5e1',
        marginBottom: '16px'
      }}>
        {COLLABORATION_GRAPH_NODES.map(node => {
          const isSelected = selectedNode?.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                padding: '12px 8px', borderRadius: '6px',
                background: isSelected ? 'var(--primary)' : '#ffffff',
                color: isSelected ? '#ffffff' : 'var(--text-primary)',
                border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                boxShadow: isSelected ? '0 4px 12px rgba(27,42,74,0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{getNodeIcon(node.type)}</span>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, lineHeight: 1.2 }}>{node.label}</span>
              <span style={{ fontSize: '0.62rem', color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', marginTop: '2px' }}>{node.group}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Node Details & Connected Edges */}
      {selectedNode && (
        <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '14px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Relationships for: {getNodeIcon(selectedNode.type)} {selectedNode.label} ({selectedNode.group})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {COLLABORATION_GRAPH_EDGES.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((edge, idx) => {
              const otherId = edge.from === selectedNode.id ? edge.to : edge.from;
              const otherNode = COLLABORATION_GRAPH_NODES.find(n => n.id === otherId);
              return (
                <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '6px 10px', borderRadius: '4px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{edge.label}</span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                  <span>{getNodeIcon(otherNode?.type)} {otherNode?.label} ({otherNode?.group})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
