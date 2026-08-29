import React, { useState } from 'react';
import {
  Dna, Award, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck,
  Users, MapPin, Activity, HelpCircle, Layers, FileText, Plus
} from 'lucide-react';
import {
  getProblemDNA,
  getCivicOpportunityScore,
  getWhyThisMattersStory,
  getEvidenceWeight,
  getCommunityPulse
} from '../services/janSetuV2Service';

export default function ProblemDnaCard({ challenge, onAffectedClick }) {
  const [affectedCount, setAffectedCount] = useState(challenge?.reports_count || 127);
  const [userConfirmed, setUserConfirmed] = useState(false);

  const dna = getProblemDNA(challenge);
  const oppScore = getCivicOpportunityScore(challenge);
  const story = getWhyThisMattersStory(challenge);
  const evidence = getEvidenceWeight(challenge);
  const pulse = getCommunityPulse(challenge);

  const handleIAmAffected = () => {
    if (!userConfirmed) {
      setUserConfirmed(true);
      setAffectedCount(prev => prev + 1);
      if (onAffectedClick) onAffectedClick();
    }
  };

  if (!dna) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── 1. WHY THIS MATTERS STORY & PULSE BAR ───────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderLeft: '4px solid var(--primary)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Why This Matters
            </span>
            <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>
              {pulse.momentum}
            </span>
          </div>

          <button
            onClick={handleIAmAffected}
            disabled={userConfirmed}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: userConfirmed ? '#e2e8f0' : 'var(--accent)',
              color: userConfirmed ? 'var(--text-muted)' : '#ffffff',
              border: 'none', borderRadius: '4px',
              padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700,
              cursor: userConfirmed ? 'default' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            <Plus size={14} />
            {userConfirmed ? '✓ You Confirmed "I Am Affected Too"' : '+ I Am Affected Too'}
          </button>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
          {story?.summary}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px', background: 'var(--bg-primary)', padding: '12px', borderRadius: '4px' }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Affected People</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{story?.stats.affectedPeople}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Villages</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{story?.stats.villages}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Reports</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{affectedCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>60-Day Trend</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d97706' }}>{story?.stats.trend}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Health Risk</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--danger)' }}>{story?.stats.healthRisk}</div>
          </div>
        </div>

        {/* Live Community Pulse */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Community Pulse: {pulse.percentage}%</span>
            <span style={{ color: 'var(--text-muted)' }}>{pulse.state}</span>
          </div>
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pulse.percentage}%`, background: 'linear-gradient(90deg, #3b82f6, #f59e0b)', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>

      {/* ── 2. SCORES DUAL DISPLAY (PRIORITY vs CIVIC OPPORTUNITY) ───────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Priority Score */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Problem Priority Score
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)', lineHeight: 1 }}>{oppScore.priorityScore}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Measures current urgency, affected population & severity level.
          </p>
        </div>

        {/* Civic Opportunity Score */}
        <div style={{ background: '#ffffff', border: '2px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '16px', position: 'relative' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={14} /> Civic Opportunity Score
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{oppScore.score}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Measures how valuable & actionable it is to intervene right now.
          </p>
        </div>
      </div>

      {/* Opportunity Drivers Breakdown */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
          Why is this an Actionable Civic Opportunity?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {oppScore.why.map((w, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={14} color="var(--success)" style={{ flexShrink: 0 }} />
              <span>{w.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. CITIZEN EVIDENCE CONFIDENCE WEIGHT ───────────────────────── */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="var(--primary)" /> Evidence Confidence Score
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
            {evidence.confidence}% Confidence
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {evidence.breakdown.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '6px 10px', background: 'var(--bg-primary)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>{item.points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. PROBLEM DNA MATRIX ───────────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderTop: '3px solid #6366f1',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Dna size={20} color="#6366f1" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Structured Problem DNA
          </h3>
          <span style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, marginLeft: 'auto' }}>
            System DNA v2.4
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Category & Subcategory</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {dna.category} → {dna.subcategory}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Urgency & Severity</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--danger)', marginTop: '2px' }}>
              {dna.urgency}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Root Causes Identified</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {dna.rootCauses.map((rc, idx) => (
                <div key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-primary)', background: '#f8fafc', padding: '6px 10px', borderRadius: '4px', borderLeft: '3px solid var(--primary)' }}>
                  • {rc}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Vulnerable Groups</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              {dna.vulnerableGroups.join(', ')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Geographic Traits</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              {dna.geographicCharacteristics.terrain} ({dna.geographicCharacteristics.soilType})
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Recurring Pattern</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '4px' }}>
              {dna.recurringPattern}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Required Expertise</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
              {dna.requiredExpertise.map((exp, idx) => (
                <span key={idx} style={{ fontSize: '0.7rem', background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '3px', border: '1px solid #cbd5e1' }}>
                  {exp}
                </span>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Economic & Environmental Impact</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              💰 {dna.economicImpact} | 🌿 {dna.environmentalImpact}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
