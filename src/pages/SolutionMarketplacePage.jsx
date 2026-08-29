import React, { useState } from 'react';
import { Rocket, Lightbulb, CheckCircle2, ShieldCheck, DollarSign, Award, Users, Filter, Search, ArrowRight, ExternalLink, Code, Layers, X } from 'lucide-react';

const DEMO_SOLUTIONS = [
  {
    id: 'sol-1',
    title: 'GeoPave IoT Sensor & Slag Stabilization Matrix',
    challengeId: 'monsoon-road-accessibility',
    challengeTitle: 'Monsoon Rural Road Accessibility',
    author: 'Team InnoVators (BIT Mesra)',
    stage: 'Prototype',
    category: 'Infrastructure',
    techStack: ['IoT Soil Moisture Sensors', 'Industrial Slag Polymer', 'GIS Mesh Dashboard'],
    estimatedCost: '₹3,50,000',
    impact: 'Prevents rural road mud-slip, enabling year-round connectivity for 1,800 residents.',
    rating: 4.9,
    reviews: 14,
    sponsors: ['GeoTech Solutions', 'Tata Steel Foundation'],
    repo: 'https://github.com/civicsolve/geopave-iot',
    demoUrl: 'https://geopave-demo.civicsolve.ai'
  },
  {
    id: 'sol-2',
    title: 'Acoustic Pipe Leakage Sensor Grid',
    challengeId: 'water-pipeline-leakage',
    challengeTitle: 'Water Pipeline Leakage Detection',
    author: 'EcoFilter Labs (Startup)',
    stage: 'Pilot Ready',
    category: 'Water Management',
    techStack: ['Acoustic Microphones', 'Edge AI Microcontrollers', 'LoRaWAN Mesh'],
    estimatedCost: '₹2,20,000',
    impact: 'Detects micro-cracks before main burst, reducing city water distribution loss by 30%.',
    rating: 4.8,
    reviews: 9,
    sponsors: ['Ranchi Municipal Corporation'],
    repo: 'https://github.com/civicsolve/pipe-leak-grid',
    demoUrl: 'https://pipeleak-demo.civicsolve.ai'
  },
  {
    id: 'sol-3',
    title: 'Soil Nutrient Telemetry & Automated Irrigation Sentinel',
    challengeId: 'soil-nutrient-depletion',
    challengeTitle: 'Soil Health & Crop Irrigation',
    author: 'AgriTech Cohort (NIT Jamshedpur)',
    stage: 'Prototype',
    category: 'Agriculture & Rural',
    techStack: ['NPK Soil Sensors', 'Solar Micro-Pumps', 'Flutter Mobile App'],
    estimatedCost: '₹1,80,000',
    impact: 'Optimizes fertilizer usage by 25% for smallholder farmers.',
    rating: 4.7,
    reviews: 11,
    sponsors: ['Jharkhand Krishi Vikas'],
    repo: 'https://github.com/civicsolve/agri-sentinel',
    demoUrl: 'https://agrisentinel.civicsolve.ai'
  }
];

export default function SolutionMarketplacePage({ onNavigate }) {
  const [stageFilter, setStageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSolution, setSelectedSolution] = useState(null);

  const filtered = DEMO_SOLUTIONS.filter(s => {
    const matchesStage = stageFilter === 'all' || s.stage.toLowerCase().replace(' ', '-') === stageFilter;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      {/* Header */}
      <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#047857', marginBottom: '8px', fontWeight: 700 }}>
            <Rocket size={13} color="#047857" /> Solution Marketplace & Repository
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>
            Proven & Prototype Solutions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Discover open innovations built by university teams, startups, and research institutions across India.
          </p>
        </div>

        <button onClick={() => alert('Solution publishing is open to verified Students, Universities & Startups.')} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
          + Publish New Solution
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-l2" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', padding: '12px 16px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="form-input" placeholder="Search solutions by keyword, tech, or challenge..." style={{ paddingLeft: '38px', width: '100%' }} />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['all', 'idea', 'prototype', 'pilot-ready', 'implemented'].map(st => (
            <button key={st} onClick={() => setStageFilter(st)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: stageFilter === st ? 'var(--primary-light)' : '#ffffff', color: stageFilter === st ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', textTransform: 'capitalize', fontWeight: stageFilter === st ? 700 : 500, whiteSpace: 'nowrap' }}>
              {st.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Solutions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.map(sol => (
          <div key={sol.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '3px solid var(--primary)', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ background: 'var(--primary-light)', border: '1px solid rgba(0,48,135,0.2)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>
                  {sol.stage}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700 }}>★ {sol.rating} ({sol.reviews})</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3 }}>{sol.title}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>By: <strong style={{ color: 'var(--text-primary)' }}>{sol.author}</strong></p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>{sol.impact}</p>

              {/* Tech stack */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {sol.techStack.map(t => (
                  <span key={t} style={{ background: '#f1f5f9', border: '1px solid var(--border-subtle)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t}</span>
                ))}
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '10px', borderRadius: '8px', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Cost: <strong style={{ color: 'var(--text-primary)' }}>{sol.estimatedCost}</strong></span>
                <span>Sponsors: <strong style={{ color: '#047857' }}>{sol.sponsors.length}</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setSelectedSolution(sol)} className="btn btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.8rem', background: '#ffffff', border: '1px solid var(--border-medium)', color: 'var(--text-primary)' }}>
                View Overview
              </button>
              <button onClick={() => alert(`Initiated collaboration request with ${sol.author}`)} className="btn btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.8rem' }}>
                Sponsor / Pilot →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Solution Detail Modal */}
      {selectedSolution && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="glass-l4 fade-in" style={{ width: '100%', maxWidth: '640px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-medium)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>{selectedSolution.stage} Solution</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{selectedSolution.title}</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Created by {selectedSolution.author}</p>
              </div>
              <button onClick={() => setSelectedSolution(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', padding: '14px', background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', fontSize: '0.82rem' }}>
              <div><strong>Addressed Challenge:</strong> {selectedSolution.challengeTitle}</div>
              <div><strong>Estimated Budget:</strong> {selectedSolution.estimatedCost}</div>
              <div><strong>Rating:</strong> ★ {selectedSolution.rating} ({selectedSolution.reviews} reviews)</div>
              <div><strong>Repository:</strong> <a href={selectedSolution.repo} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>GitHub Repo ↗</a></div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Impact Statement</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{selectedSolution.impact}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
              <button onClick={() => { alert('Collaboration agreement drafted.'); setSelectedSolution(null); }} className="btn btn-primary" style={{ flex: 1, padding: '12px', minWidth: '160px' }}>
                Collaborate & Sign
              </button>
              <button onClick={() => { alert('Funding request initiated.'); setSelectedSolution(null); }} className="btn btn-secondary" style={{ flex: 1, padding: '12px', minWidth: '160px', background: '#ffffff', border: '1px solid var(--border-medium)' }}>
                Sponsor Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
