import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronRight, DollarSign, Shield, Clock, AlertTriangle, TrendingUp, Search, Lightbulb, Target, Activity, Zap, BookOpen, BarChart3, MessageSquare, ThumbsUp, ThumbsDown, Minus, HelpCircle } from 'lucide-react';
import { rootCauseService, summaryService, debateService, sentimentService, feasibilityService, costEstimatorService, roadmapService, riskPredictionService, policySimulatorService, knowledgeSearchService } from '../services/advanced40Service';

const TAB_LIST = [
  { id: 'root-cause', label: 'Root Cause', icon: Brain },
  { id: 'summary', label: 'Summary', icon: BookOpen },
  { id: 'feasibility', label: 'Feasibility', icon: Target },
  { id: 'cost', label: 'Cost Est.', icon: DollarSign },
  { id: 'roadmap', label: 'Roadmap', icon: Clock },
  { id: 'risks', label: 'Risks', icon: AlertTriangle },
  { id: 'debate', label: 'Debate', icon: MessageSquare },
  { id: 'sentiment', label: 'Sentiment', icon: Activity },
  { id: 'policy', label: 'Policy Sim', icon: Zap },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
];

function RootCauseTree({ tree }) {
  const [expanded, setExpanded] = useState(new Set(['rc-1', 'rc-2', 'rc-3']));

  const toggle = (id) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  if (!tree) return <EmptyState message="No root cause analysis available for this challenge." />;

  const nodes = tree.tree.filter(n => n.depth === 0 || expanded.has(n.id.replace(/-\d+$/, '')));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        AI-generated root cause decomposition for <strong style={{ color: '#fff' }}>{tree.rootProblem}</strong>
      </p>
      {tree.tree.map(node => {
        const isExpanded = expanded.has(node.id);
        const hasChildren = node.children.length > 0;
        return (
          <div key={node.id} style={{ paddingLeft: `${node.depth * 24}px` }}>
            <div
              onClick={() => hasChildren && toggle(node.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px', borderRadius: '8px', cursor: hasChildren ? 'pointer' : 'default',
                background: node.depth === 0 ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${node.depth === 0 ? 'rgba(59,130,246,0.2)' : 'var(--border-subtle)'}`,
                transition: 'all 0.15s ease',
              }}
            >
              {hasChildren ? (
                isExpanded ? <ChevronDown size={14} color="var(--text-muted)" /> : <ChevronRight size={14} color="var(--text-muted)" />
              ) : <span style={{ width: 14 }} />}
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: node.depth === 0 ? '#3b82f6' : node.depth === 1 ? '#8b5cf6' : '#10b981', flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: node.depth === 0 ? 700 : 400 }}>{node.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProblemSummary({ summary }) {
  if (!summary) return <EmptyState message="No AI summary available." />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[
        { label: 'Problem', value: summary.problem, icon: '📋' },
        { label: 'Community Opinion', value: summary.communityOpinion, icon: '👥' },
        { label: 'Current Status', value: summary.currentStatus, icon: '📊' },
      ].map((section, i) => (
        <div key={i}>
          <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{section.icon}</span> {section.label}
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{section.value}</p>
        </div>
      ))}
      <div>
        <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '8px' }}>🚨 Main Concerns</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {summary.mainConcerns.map((c, i) => (
            <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '6px 10px', background: 'rgba(239,68,68,0.06)', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
              {c}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '8px' }}>💡 Proposed Solutions</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {summary.proposedSolutions.map((s, i) => (
            <span key={i} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '100px', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeasibilityCalculator({ scores }) {
  if (!scores) return <EmptyState message="No feasibility data available." />;
  const dimensions = [
    { key: 'technical', label: 'Technical', color: '#3b82f6', note: scores.technicalNote },
    { key: 'financial', label: 'Financial', color: '#f59e0b', note: scores.financialNote },
    { key: 'operational', label: 'Operational', color: '#8b5cf6', note: scores.operationalNote },
    { key: 'social', label: 'Social', color: '#10b981', note: scores.socialNote },
    { key: 'environmental', label: 'Environmental', color: '#06b6d4', note: scores.environmentalNote },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(59,130,246,0.08)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.15)' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: scores.overall >= 75 ? '#10b981' : scores.overall >= 50 ? '#f59e0b' : '#ef4444', fontFamily: 'var(--font-display)' }}>
          {scores.overall}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Overall Feasibility Score</div>
      </div>
      {dimensions.map(d => (
        <div key={d.key}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{d.label}</span>
            <span style={{ fontSize: '0.85rem', color: d.color, fontWeight: 800 }}>{scores[d.key]}/100</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${scores[d.key]}%`, background: d.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{d.note}</p>
        </div>
      ))}
    </div>
  );
}

function CostEstimator({ estimate }) {
  if (!estimate) return <EmptyState message="No cost estimate available." />;
  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(245,158,11,0.08)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.15)' }}>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-display)' }}>{fmt(estimate.total)}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Estimated Total Cost</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
        {[
          { label: 'Infrastructure', value: estimate.infrastructure, color: '#3b82f6' },
          { label: 'Labor', value: estimate.labor, color: '#10b981' },
          { label: 'Technology', value: estimate.technology, color: '#8b5cf6' },
          { label: 'Maintenance', value: estimate.maintenance, color: '#f59e0b' },
        ].map(c => (
          <div key={c.label} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: c.color }}>{fmt(c.value)}</div>
          </div>
        ))}
      </div>
      <div>
        <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '8px' }}>Cost Breakdown</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {estimate.breakdown.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.item}</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{fmt(item.cost)}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        ⚠️ These are approximate estimates based on configurable assumptions. Actual costs may vary.
      </p>
    </div>
  );
}

function ImplementationRoadmap({ roadmap }) {
  if (!roadmap) return <EmptyState message="No roadmap available." />;
  const statusColors = { completed: '#10b981', in_progress: '#3b82f6', upcoming: 'var(--text-muted)' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {roadmap.map((phase, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0 }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: statusColors[phase.status], border: phase.status === 'in_progress' ? '3px solid rgba(59,130,246,0.4)' : 'none', boxShadow: phase.status === 'completed' ? '0 0 8px rgba(16,185,129,0.4)' : 'none' }} />
            {i < roadmap.length - 1 && <div style={{ width: '2px', flex: 1, background: phase.status === 'completed' ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)', minHeight: '20px' }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColors[phase.status], textTransform: 'uppercase' }}>{phase.phase}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>· {phase.duration}</span>
              {phase.status === 'in_progress' && <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: '100px', background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>In Progress</span>}
            </div>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '6px' }}>{phase.title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {phase.tasks.map((task, j) => (
                <div key={j} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)', flexShrink: 0 }} />
                  {task}
                </div>
              ))}
            </div>
            {phase.startDate && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '6px' }}>{phase.startDate} → {phase.endDate || 'Ongoing'}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function RiskPrediction({ risks }) {
  if (!risks.length) return <EmptyState message="No risk predictions available." />;
  const impactColors = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {risks.map((risk, i) => (
        <div key={i} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{risk.risk}</span>
            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '100px', background: `${impactColors[risk.impact]}15`, color: impactColors[risk.impact], border: `1px solid ${impactColors[risk.impact]}25` }}>
              {risk.impact} Impact
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Probability:</span>
            <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${risk.probability}%`, background: risk.probability > 50 ? '#ef4444' : risk.probability > 30 ? '#f59e0b' : '#10b981', borderRadius: '2px' }} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{risk.probability}%</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '8px 10px', background: 'rgba(16,185,129,0.06)', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
            <strong style={{ color: '#10b981' }}>Mitigation:</strong> {risk.mitigation}
          </div>
        </div>
      ))}
    </div>
  );
}

function DebateAnalysis({ analysis }) {
  if (!analysis) return <EmptyState message="No debate analysis available." />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4 style={{ fontSize: '0.9rem', color: '#10b981', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ThumbsUp size={14} /> Supporting Arguments ({analysis.supporting.length})
        </h4>
        {analysis.supporting.map((arg, i) => (
          <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', marginBottom: '6px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{arg.user} · Strength: {arg.strength}%</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{arg.argument}</div>
          </div>
        ))}
      </div>
      <div>
        <h4 style={{ fontSize: '0.9rem', color: '#ef4444', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ThumbsDown size={14} /> Opposing Arguments ({analysis.opposing.length})
        </h4>
        {analysis.opposing.map((arg, i) => (
          <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', marginBottom: '6px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{arg.user} · Strength: {arg.strength}%</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{arg.argument}</div>
          </div>
        ))}
      </div>
      <div>
        <h4 style={{ fontSize: '0.9rem', color: '#f59e0b', marginBottom: '8px' }}>🤝 Common Ground</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {analysis.commonGround.map((g, i) => (
            <span key={i} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '100px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>{g}</span>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '8px' }}>💡 Top Suggestions</h4>
        {analysis.topSuggestions.map((s, i) => (
          <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '6px 10px', background: 'rgba(59,130,246,0.06)', borderRadius: '6px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={12} color="#3b82f6" /> {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function SentimentAnalysis({ data }) {
  if (!data) return <EmptyState message="No sentiment data available." />;
  const total = data.positive + data.neutral + data.negative + data.concerned + data.supportive;
  const items = [
    { label: 'Positive', value: data.positive, color: '#10b981' },
    { label: 'Neutral', value: data.neutral, color: '#6b7280' },
    { label: 'Negative', value: data.negative, color: '#ef4444' },
    { label: 'Concerned', value: data.concerned, color: '#f59e0b' },
    { label: 'Supportive', value: data.supportive, color: '#3b82f6' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(59,130,246,0.06)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.12)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>{data.totalResponses}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Community Responses Analyzed</div>
      </div>
      {items.map(item => (
        <div key={item.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.82rem', color: '#fff' }}>{item.label}</span>
            <span style={{ fontSize: '0.82rem', color: item.color, fontWeight: 700 }}>{item.value} ({Math.round((item.value / total) * 100)}%)</span>
          </div>
          <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(item.value / total) * 100}%`, background: item.color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      ))}
      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        ℹ️ Shows aggregated community sentiment. Individual citizen profiling is not performed.
      </p>
    </div>
  );
}

function PolicySimulator() {
  const scenarios = policySimulatorService.getScenarios();
  const [selected, setSelected] = useState(null);
  const [simulated, setSimulated] = useState(null);

  const handleSimulate = (scenario) => {
    setSelected(scenario.id);
    const result = policySimulatorService.simulate(scenario.id);
    setSimulated(result);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        Simulate policy changes and see estimated effects. <em>Outputs are simulations, not factual predictions.</em>
      </p>
      {scenarios.map(s => (
        <div key={s.id} style={{ padding: '14px', borderRadius: '10px', background: selected === s.id ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selected === s.id ? 'rgba(59,130,246,0.25)' : 'var(--border-subtle)'}`, cursor: 'pointer', transition: 'all 0.15s ease' }} onClick={() => handleSimulate(s)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{s.name}</span>
            <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '100px', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>{s.category}</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{s.description}</p>
          {selected === s.id && simulated && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              {Object.entries(simulated.effects).map(([key, val]) => (
                <div key={key} style={{ textAlign: 'center', padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: val > 20 ? '#10b981' : val > 10 ? '#f59e0b' : '#3b82f6' }}>{val}%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function KnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(knowledgeSearchService.getAll());

  const handleSearch = (q) => {
    setQuery(q);
    setResults(q.length >= 2 ? knowledgeSearchService.search(q) : knowledgeSearchService.getAll());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search civic knowledge..." value={query} onChange={e => handleSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {results.map(item => (
          <div key={item.id} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{item.title}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.relevance}% match</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>{item.category}</span>
              {item.tags?.slice(0, 3).map((tag, i) => (
                <span key={i} style={{ fontSize: '0.62rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
      <HelpCircle size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
      <p style={{ fontSize: '0.85rem' }}>{message}</p>
    </div>
  );
}

export default function AiAnalysisHubPage({ challengeId = 'monsoon-road-accessibility', onNavigate }) {
  const [activeTab, setActiveTab] = useState('root-cause');

  const rootCause = rootCauseService.getTree(challengeId);
  const summary = summaryService.get(challengeId);
  const feasibility = feasibilityService.getScores(challengeId);
  const cost = costEstimatorService.getEstimate(challengeId);
  const roadmap = roadmapService.getRoadmap(challengeId);
  const risks = riskPredictionService.getRisks(challengeId);
  const debate = debateService.getAnalysis(challengeId);
  const sentiment = sentimentService.getData(challengeId);

  const renderContent = () => {
    switch (activeTab) {
      case 'root-cause': return <RootCauseTree tree={rootCause} />;
      case 'summary': return <ProblemSummary summary={summary} />;
      case 'feasibility': return <FeasibilityCalculator scores={feasibility} />;
      case 'cost': return <CostEstimator estimate={cost} />;
      case 'roadmap': return <ImplementationRoadmap roadmap={roadmap} />;
      case 'risks': return <RiskPrediction risks={risks} />;
      case 'debate': return <DebateAnalysis analysis={debate} />;
      case 'sentiment': return <SentimentAnalysis data={sentiment} />;
      case 'policy': return <PolicySimulator />;
      case 'knowledge': return <KnowledgeSearch />;
      default: return null;
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#a78bfa', marginBottom: '8px' }}>
          <Brain size={12} /> AI Analysis Hub
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>AI Civic Intelligence</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Deep AI-powered analysis, forecasting, and decision support for civic challenges.</p>
      </div>

      {/* Mobile-scrollable tabs */}
      <div className="reveal mobile-scroll-tabs" style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px', overflowX: 'auto' }}>
        {TAB_LIST.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '8px 8px 0 0', border: 'none', flexShrink: 0,
              background: isActive ? 'rgba(139,92,246,0.12)' : 'transparent',
              color: isActive ? '#a78bfa' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.78rem', fontWeight: isActive ? 700 : 400,
              whiteSpace: 'nowrap', transition: 'all 0.15s ease',
            }}>
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="glass-card" style={{ padding: '20px' }}>
        {renderContent()}
      </div>
    </div>
  );
}
