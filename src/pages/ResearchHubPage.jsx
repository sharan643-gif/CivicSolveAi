import React, { useState } from 'react';
import { BookOpen, Database, Download, FileText, ExternalLink, ShieldCheck, Filter, Search } from 'lucide-react';

export default function ResearchHubPage() {
  const [activeTab, setActiveTab] = useState('papers'); // 'papers' | 'datasets'

  const papers = [
    { title: 'Monsoon Soil Liquefaction & Slag Pavement Performance in Chota Nagpur Plateau', authors: 'Dr. S. K. Bose, Aarav Mehta (BIT Mesra)', journal: 'Journal of Rural Infrastructure & Geotech', year: '2026', downloads: 340, link: '#' },
    { title: 'Acoustic LoRaWAN Sensor Grids for Micro-Crack Detection in Municipal Water Lines', authors: 'Dr. Ramesh Pathak (NIT Jamshedpur)', journal: 'IEEE Internet of Things Journal', year: '2025', downloads: 512, link: '#' }
  ];

  const datasets = [
    { title: 'Jharkhand Monsoon Rural Road Degradation Telemetry Dataset (2024-2026)', org: 'CSIR-CIMFR Dhanbad', size: '1.4 GB', records: '142,000 telemetry samples', license: 'Open Civic Data License' },
    { title: 'Ranchi Urban Pipeline Pressure & Loss Telemetry Log', org: 'Ranchi Municipal Corporation', size: '480 MB', records: '85,000 sensor readings', license: 'Restricted Research Access' }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#a78bfa', marginBottom: '8px' }}>
            <BookOpen size={12} /> Academic & Open Data Ecosystem
          </div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
            Research & Knowledge Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Access peer-reviewed papers, open engineering datasets, and technical reports linked to real challenges.
          </p>
        </div>

        <div className="glass-l1" style={{ display: 'flex', gap: '6px', padding: '4px', borderRadius: '10px' }}>
          <button onClick={() => setActiveTab('papers')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activeTab === 'papers' ? 'rgba(139,92,246,0.15)' : 'transparent', color: activeTab === 'papers' ? '#a78bfa' : 'var(--text-secondary)' }}>
            Research Publications ({papers.length})
          </button>
          <button onClick={() => setActiveTab('datasets')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activeTab === 'datasets' ? 'rgba(16,185,129,0.15)' : 'transparent', color: activeTab === 'datasets' ? '#10b981' : 'var(--text-secondary)' }}>
            Dataset Exchange ({datasets.length})
          </button>
        </div>
      </div>

      {/* Publications View */}
      {activeTab === 'papers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {papers.map((p, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{p.title}</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Authors: {p.authors} · <em>{p.journal}</em> ({p.year})
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  📥 {p.downloads} Downloads · Verified Peer Reviewed
                </div>
              </div>

              <button onClick={() => alert(`Downloading paper: ${p.title}`)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                <Download size={14} /> Download PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Datasets View */}
      {activeTab === 'datasets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {datasets.map((d, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '3px solid #10b981' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={16} color="#10b981" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{d.title}</h3>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Source: {d.org} · Size: {d.size} · Records: {d.records}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '4px' }}>
                  License: {d.license}
                </div>
              </div>

              <button onClick={() => alert(`Access request submitted for dataset: ${d.title}`)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                Request Dataset Access →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
