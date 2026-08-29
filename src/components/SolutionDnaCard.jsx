import React from 'react';
import { Cpu, AlertTriangle, BookOpen, Sparkles, CheckCircle2, RotateCcw, Wrench } from 'lucide-react';
import { SOLUTION_DNA_ITEMS } from '../services/janSetuV2Service';

export default function SolutionDnaCard({ solution = SOLUTION_DNA_ITEMS[0] }) {
  if (!solution) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── 1. SOLUTION DNA OVERVIEW ───────────────────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderTop: '3px solid var(--success)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Cpu size={20} color="var(--success)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Solution DNA: {solution.title}
          </h3>
          <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, marginLeft: 'auto' }}>
            Proven Solution DNA
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.84rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Technology Stack</div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>{solution.technology}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Estimated Cost Range</div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>{solution.costRange}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Deployment Environment</div>
            <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{solution.deploymentEnvironment}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Implementation Duration</div>
            <div style={{ color: 'var(--text-primary)', marginTop: '2px' }}>{solution.implementationDuration}</div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Measurable Outcomes</div>
            <div style={{ color: 'var(--success)', fontWeight: 700, marginTop: '2px' }}>✓ {solution.measurableOutcomes}</div>
          </div>
        </div>
      </div>

      {/* ── 2. SOLUTION ADAPTATION RECOMMENDATION ──────────────────────── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderLeft: '4px solid #8b5cf6',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <RotateCcw size={18} color="#8b5cf6" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Recommended Adaptation Engine
          </h4>
          <span style={{ fontSize: '0.75rem', background: '#f3e8ff', color: '#6b21a8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, marginLeft: 'auto' }}>
            {solution.adaptationRecommendations.similarity}% Match Similarity
          </span>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Adaptation recommendations generated based on historical field conditions:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {solution.adaptationRecommendations.recommendedChanges.map((change, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-primary)', background: '#faf5ff', padding: '6px 10px', borderRadius: '4px' }}>
              <Sparkles size={14} color="#8b5cf6" />
              <span>{change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. FAILURE KNOWLEDGE ("WHAT DIDN'T WORK") ──────────────────── */}
      <div style={{
        background: '#fff5f5',
        border: '1px solid #fed7d7',
        borderLeft: '4px solid var(--danger)',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <AlertTriangle size={18} color="var(--danger)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--danger)', margin: 0 }}>
            What Didn't Work (Failure Knowledge)
          </h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {solution.failureKnowledge.map((fail, idx) => (
            <div key={idx} style={{ fontSize: '0.82rem', color: '#9b2c2c', lineHeight: 1.5 }}>
              ⚠️ {fail}
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. LESSON REUSE FROM SIMILAR PROJECTS ───────────────────────── */}
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderLeft: '4px solid var(--success)',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <BookOpen size={18} color="var(--success)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#166534', margin: 0 }}>
            Lessons Learned From Similar Deployments
          </h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {solution.lessonsLearned.map((lesson, idx) => (
            <div key={idx} style={{ fontSize: '0.82rem', color: '#14532d', lineHeight: 1.5 }}>
              💡 {lesson}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
