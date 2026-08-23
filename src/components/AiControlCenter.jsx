import React, { useState } from 'react';
import { Cpu, Activity, Zap, Sliders, ShieldCheck, Database, RefreshCw } from 'lucide-react';
import { db } from '../services/mockData';

export default function AiControlCenter() {
  const [duplicateDetection, setDuplicateDetection] = useState(true);
  const [priorityScoring, setPriorityScoring] = useState(true);
  const [teamMatching, setTeamMatching] = useState(true);
  const [threshold, setThreshold] = useState(75);
  const [model, setModel] = useState('google/gemini-2.5-flash');

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={20} color="#8b5cf6" />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>
              Super Admin AI Operations & Control Center
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Model Configuration, Request Performance & Feature Threshold Tuning</p>
          </div>
        </div>
        <span style={{ fontSize: '0.72rem', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', padding: '4px 10px', borderRadius: '100px', fontWeight: 700 }}>
          ● Engine Active
        </span>
      </div>

      {/* AI Performance Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>API Requests (Today)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>14,280</div>
          <div style={{ fontSize: '0.65rem', color: '#10b981' }}>99.98% Success Rate</div>
        </div>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Latency</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa', margin: '2px 0' }}>312 ms</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Edge Cached</div>
        </div>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duplicate Match Rate</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', margin: '2px 0' }}>94.2%</div>
          <div style={{ fontSize: '0.65rem', color: '#f59e0b' }}>342 Merged</div>
        </div>
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Token Consumption</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa', margin: '2px 0' }}>342.9K</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>OpenRouter Gemini</div>
        </div>
      </div>

      {/* Feature Toggles & Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature Modules</h4>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <span>Duplicate Challenge Detection</span>
            <input type="checkbox" checked={duplicateDetection} onChange={e => setDuplicateDetection(e.target.checked)} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <span>Automated Priority Scoring (0-100)</span>
            <input type="checkbox" checked={priorityScoring} onChange={e => setPriorityScoring(e.target.checked)} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <span>Smart Team & Skill Builder</span>
            <input type="checkbox" checked={teamMatching} onChange={e => setTeamMatching(e.target.checked)} />
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Threshold Tuning</h4>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Similarity Threshold</span>
              <strong style={{ color: '#8b5cf6' }}>{threshold}%</strong>
            </div>
            <input type="range" min="50" max="95" value={threshold} onChange={e => setThreshold(Number(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Selected Model Architecture</label>
            <select value={model} onChange={e => setModel(e.target.value)} className="form-select" style={{ marginTop: '4px', fontSize: '0.78rem' }}>
              <option value="google/gemini-2.5-flash">Google Gemini 2.5 Flash (Fast, Recommended)</option>
              <option value="google/gemini-2.5-pro">Google Gemini 2.5 Pro (Deep Reasoning)</option>
              <option value="meta-llama/llama-3-70b-instruct">Meta Llama 3 70B Instruct</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
