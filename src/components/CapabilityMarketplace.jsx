import React, { useState } from 'react';
import { GraduationCap, Building, Award, Zap, CheckCircle2, Star, BookOpen, Layers, Users, ExternalLink } from 'lucide-react';

export default function CapabilityMarketplace({ challengeTitle = 'Monsoon Rural Road Accessibility' }) {
  const [activeTab, setActiveTab] = useState('universities'); // 'universities' | 'industry'

  const universities = [
    {
      id: 'u1',
      name: 'Birla Institute of Technology (BIT) Mesra',
      match: 94,
      location: 'Ranchi, Jharkhand',
      capabilities: { GIS: 95, 'AI/ML': 91, IoT: 87, 'Civil Engg': 84 },
      faculties: 42,
      activeProjects: 15,
      labEquipment: ['High-res UAV Drone LiDAR', 'Geotechnical Soil Testing Suite', 'IoT Edge Compute Grid'],
      score: '9.2/10',
      reason: 'Top match: Exceptionally strong GIS, Remote Sensing, and Civil Engineering research labs.'
    },
    {
      id: 'u2',
      name: 'National Institute of Technology (NIT) Jamshedpur',
      match: 89,
      location: 'Jamshedpur, Jharkhand',
      capabilities: { 'Civil Engg': 96, Hydrogeology: 90, IoT: 82, 'AI/ML': 78 },
      faculties: 38,
      activeProjects: 11,
      labEquipment: ['Hydraulic Flume Lab', 'Structural Stress Sensor Array'],
      score: '8.9/10',
      reason: 'Strong in Hydrology, Structural Stress Analysis, and Pavement Durability.'
    },
    {
      id: 'u3',
      name: 'IIT (ISM) Dhanbad',
      match: 87,
      location: 'Dhanbad, Jharkhand',
      capabilities: { Geotech: 98, Analytics: 89, Sensors: 85, Automation: 80 },
      faculties: 65,
      activeProjects: 24,
      labEquipment: ['Satellite Synthetic Aperture Radar', 'Subsurface Sonar Scanner'],
      score: '9.4/10',
      reason: 'Deep expertise in Geotechnical mining, Soil mechanics, and Satellite Radar data.'
    }
  ];

  const industryPartners = [
    {
      id: 'i1',
      name: 'GeoTech Solutions Pvt Ltd',
      match: 92,
      sector: 'GIS & Satellite Telemetry',
      support: '₹2,50,000 Seed Prototype Grant + 3 Senior Mentors',
      capabilities: ['Remote Sensing', 'Spatial Analytics', 'Cloud Data APIs', 'Drone Survey'],
      mentors: 5,
      fundingAvailable: '₹10,00,000',
      reason: 'Matches requirement for real-time spatial road displacement and elevation telemetry APIs.'
    },
    {
      id: 'i2',
      name: 'Tata Steel Infrastructure & Foundation',
      match: 88,
      sector: 'CSR & Structural Materials',
      support: 'Slag Polymer Pavement Materials + Technical Testing',
      capabilities: ['Sustainable Concrete', 'CSR Funding', 'Heavy Machinery', 'Field Testing'],
      mentors: 8,
      fundingAvailable: '₹25,00,000',
      reason: 'Provides eco-friendly recycled slag paving material ideal for rural monsoon roads.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
            AI Capability Matchmaker & Marketplace
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Automated recommendations for: <strong style={{ color: 'var(--primary)' }}>"{challengeTitle}"</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button onClick={() => setActiveTab('universities')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activeTab === 'universities' ? 'rgba(245,158,11,0.15)' : 'transparent', color: activeTab === 'universities' ? '#f59e0b' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GraduationCap size={14} /> Universities ({universities.length})
          </button>
          <button onClick={() => setActiveTab('industry')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activeTab === 'industry' ? 'rgba(236,72,153,0.15)' : 'transparent', color: activeTab === 'industry' ? '#ec4899' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building size={14} /> Industry Partners ({industryPartners.length})
          </button>
        </div>
      </div>

      {/* Universities View */}
      {activeTab === 'universities' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {universities.map(u => (
            <div key={u.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: u.match > 90 ? '3px solid #10b981' : '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{u.name}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📍 {u.location}</span>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', padding: '4px 10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-display)' }}>{u.match}%</span>
                    <span style={{ fontSize: '0.62rem', color: '#10b981', display: 'block' }}>Match</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '10px', fontSize: '0.75rem', color: '#a78bfa', marginBottom: '14px', border: '1px solid rgba(139,92,246,0.15)' }}>
                  ✨ <strong>Match Reason:</strong> {u.reason}
                </div>

                {/* Capability Bar Ratings */}
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>Capability Scores</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {Object.entries(u.capabilities).map(([skill, val]) => (
                      <div key={skill} style={{ background: 'var(--bg-elevated)', padding: '6px 10px', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          <span>{skill}</span>
                          <strong style={{ color: val > 90 ? '#10b981' : '#f59e0b' }}>{val}%</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                  <strong>Key Labs & Equipment:</strong> {u.labEquipment.join(', ')}
                </div>
              </div>

              <button className="btn btn-primary" style={{ marginTop: '16px', padding: '10px', width: '100%', fontSize: '0.82rem' }}>
                Invite University & Faculty Team →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Industry View */}
      {activeTab === 'industry' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {industryPartners.map(ind => (
            <div key={ind.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '3px solid #ec4899' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{ind.name}</h4>
                    <span style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 600 }}>{ind.sector}</span>
                  </div>
                  <div style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: '8px', padding: '4px 10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ec4899', fontFamily: 'var(--font-display)' }}>{ind.match}%</span>
                    <span style={{ fontSize: '0.62rem', color: '#ec4899', display: 'block' }}>Match</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '10px', fontSize: '0.75rem', color: '#f472b6', marginBottom: '14px', border: '1px solid rgba(236,72,153,0.15)' }}>
                  💡 <strong>Proposed Contribution:</strong> {ind.support}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {ind.capabilities.map(c => (
                    <span key={c} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '100px', padding: '3px 8px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{c}</span>
                  ))}
                </div>
              </div>

              <button className="btn btn-secondary" style={{ marginTop: '16px', padding: '10px', width: '100%', fontSize: '0.82rem', borderColor: 'rgba(236,72,153,0.3)', color: '#ec4899' }}>
                Request Industry Partnership / CSR Support →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
