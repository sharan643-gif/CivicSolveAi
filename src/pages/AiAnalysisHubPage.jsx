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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        AI-generated root cause decomposition for <strong style={{ color: 'var(--text-primary)' }}>{tree.rootProblem}</strong>
      </p>
      {tree.tree.map(node => {
        const isExpanded = expanded.has(node.id);
        const hasChildren = node.children.length > 0;
        return (
          <div key={node.id} style={{ paddingLeft: `${node.depth * 18}px` }}>
            <div
              onClick={() => hasChildren && toggle(node.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 12px', borderRadius: '8px', cursor: hasChildren ? 'pointer' : 'default',
                background: node.depth === 0 ? 'var(--primary-light)' : '#f8fafc',
                border: `1px solid ${node.depth === 0 ? 'rgba(27,42,74,0.2)' : 'var(--border-subtle)'}`,
                marginBottom: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              {hasChildren ? (
                isExpanded ? <ChevronDown size={14} color="var(--text-muted)" /> : <ChevronRight size={14} color="var(--text-muted)" />
              ) : <span style={{ width: 14 }} />}
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: node.depth === 0 ? 'var(--primary)' : node.depth === 1 ? '#7c3aed' : '#047857', flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: node.depth === 0 ? 700 : 500 }}>{node.label}</span>
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
        { label: 'Problem Statement', value: summary.problem, icon: '📋' },
        { label: 'Community Feedback', value: summary.communityOpinion, icon: '👥' },
        { label: 'Current Status', value: summary.currentStatus, icon: '📊' },
      ].map((section, i) => (
        <div key={i} style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
            <span>{section.icon}</span> {section.label}
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{section.value}</p>
        </div>
      ))}
      <div>
        <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 700 }}>🚨 Main Concerns</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {summary.mainConcerns.map((c, i) => (
            <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-primary)', padding: '8px 12px', background: '#fef2f2', borderRadius: '6px', borderLeft: '4px solid #dc2626' }}>
              {c}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 700 }}>💡 Proposed Solutions</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {summary.proposedSolutions.map((s, i) => (
            <span key={i} style={{ fontSize: '0.78rem', padding: '4px 12px', borderRadius: '100px', background: '#f0fdf4', color: '#047857', border: '1px solid #bbf7d0', fontWeight: 600 }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeasibilityCalculator({ scores }) {
  if (!scores) return <EmptyState message="No feasibility assessment available." />;
  const dimensions = [
    { key: 'technical', label: 'Technical Feasibility', color: 'var(--primary)', note: scores.technicalNote },
    { key: 'financial', label: 'Financial Viability', color: '#b45309', note: scores.financialNote },
    { key: 'regulatory', label: 'Regulatory Compliance', color: '#7c3aed', note: scores.regulatoryNote },
    { key: 'social', label: 'Social Acceptance', color: '#047857', note: scores.socialNote },
    { key: 'environmental', label: 'Environmental Impact', color: '#0284c7', note: scores.environmentalNote },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ textAlign: 'center', padding: '20px', background: 'var(--primary-light)', borderRadius: '12px', border: '1px solid rgba(27,42,74,0.15)' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: scores.overall >= 75 ? '#047857' : scores.overall >= 50 ? '#b45309' : '#dc2626', fontFamily: 'var(--font-display)' }}>
          {scores.overall}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 600 }}>Overall Feasibility Score</div>
      </div>
      {dimensions.map(d => (
        <div key={d.key} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 700 }}>{d.label}</span>
            <span style={{ fontSize: '0.88rem', color: d.color, fontWeight: 800 }}>{scores[d.key]}/100</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${scores[d.key]}%`, background: d.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>{d.note}</p>
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
      <div style={{ textAlign: 'center', padding: '20px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7' }}>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#b45309', fontFamily: 'var(--font-display)' }}>{fmt(estimate.total)}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>Estimated Total Budget</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
        {[
          { label: 'Infrastructure', value: estimate.infrastructure, color: 'var(--primary)' },
          { label: 'Labor', value: estimate.labor, color: '#047857' },
          { label: 'Technology', value: estimate.technology, color: '#7c3aed' },
          { label: 'Maintenance', value: estimate.maintenance, color: '#b45309' },
        ].map(c => (
          <div key={c.label} style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{c.label}</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: c.color, marginTop: '2px' }}>{fmt(c.value)}</div>
          </div>
        ))}
      </div>
      <div>
        <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 700 }}>Cost Breakdown</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {estimate.breakdown.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.item}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{fmt(item.cost)}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        ⚠️ Estimates are algorithmically computed for initial feasibility. Formal tenders require engineering sign-off.
      </p>
    </div>
  );
}

function ImplementationRoadmap({ roadmap }) {
  if (!roadmap) return <EmptyState message="No roadmap available." />;
  const statusColors = { completed: '#047857', in_progress: 'var(--primary)', upcoming: 'var(--text-muted)' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {roadmap.map((phase, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0 }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: statusColors[phase.status], border: phase.status === 'in_progress' ? '3px solid rgba(27,42,74,0.3)' : 'none' }} />
            {i < roadmap.length - 1 && <div style={{ width: '2px', flex: 1, background: phase.status === 'completed' ? '#bbf7d0' : 'var(--border-subtle)', minHeight: '20px' }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColors[phase.status], textTransform: 'uppercase' }}>{phase.phase}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>· {phase.duration}</span>
              {phase.status === 'in_progress' && <span style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: '100px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700 }}>In Progress</span>}
            </div>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 700 }}>{phase.title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {phase.tasks.map((task, j) => (
                <div key={j} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)', flexShrink: 0 }} />
                  {task}
                </div>
              ))}
            </div>
            {phase.startDate && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>{phase.startDate} → {phase.endDate || 'Ongoing'}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function RiskPrediction({ risks }) {
  if (!risks.length) return <EmptyState message="No risk predictions available." />;
  const impactColors = { High: '#dc2626', Medium: '#b45309', Low: '#047857' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {risks.map((risk, i) => (
        <div key={i} style={{ padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{risk.risk}</span>
            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '100px', background: `${impactColors[risk.impact]}15`, color: impactColors[risk.impact], border: `1px solid ${impactColors[risk.impact]}30`, fontWeight: 700 }}>
              {risk.impact} Impact
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Probability:</span>
            <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${risk.probability}%`, background: risk.probability > 50 ? '#dc2626' : risk.probability > 30 ? '#b45309' : '#047857', borderRadius: '3px' }} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{risk.probability}%</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '8px 12px', background: '#f0fdf4', borderRadius: '6px', borderLeft: '4px solid #047857' }}>
            <strong style={{ color: '#047857' }}>Mitigation:</strong> {risk.mitigation}
          </div>
        </div>
      ))}
    </div>
  );
}

function DebateAnalysis({ analysis }) {
  if (!analysis) return <EmptyState message="No debate analysis available." />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h4 style={{ fontSize: '0.92rem', color: '#047857', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
          <ThumbsUp size={14} /> Supporting Arguments ({analysis.supporting.length})
        </h4>
        {analysis.supporting.map((arg, i) => (
          <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '6px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>{arg.user} · Strength: {arg.strength}%</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{arg.argument}</div>
          </div>
        ))}
      </div>
      <div>
        <h4 style={{ fontSize: '0.92rem', color: '#dc2626', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
          <ThumbsDown size={14} /> Opposing Arguments ({analysis.opposing.length})
        </h4>
        {analysis.opposing.map((arg, i) => (
          <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', marginBottom: '6px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>{arg.user} · Strength: {arg.strength}%</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{arg.argument}</div>
          </div>
        ))}
      </div>
      <div>
        <h4 style={{ fontSize: '0.9rem', color: '#b45309', marginBottom: '8px', fontWeight: 700 }}>🤝 Common Ground</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {analysis.commonGround.map((g, i) => (
            <span key={i} style={{ fontSize: '0.76rem', padding: '4px 12px', borderRadius: '100px', background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontWeight: 600 }}>{g}</span>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 700 }}>💡 Top Suggestions</h4>
        {analysis.topSuggestions.map((s, i) => (
          <div key={i} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', padding: '8px 12px', background: 'var(--primary-light)', border: '1px solid rgba(27,42,74,0.15)', borderRadius: '6px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lightbulb size={13} color="var(--primary)" /> {s}
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
    { label: 'Positive', value: data.positive, color: '#047857' },
    { label: 'Neutral', value: data.neutral, color: '#64748b' },
    { label: 'Negative', value: data.negative, color: '#dc2626' },
    { label: 'Concerned', value: data.concerned, color: '#b45309' },
    { label: 'Supportive', value: data.supportive, color: 'var(--primary)' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ textAlign: 'center', padding: '16px', background: 'var(--primary-light)', borderRadius: '12px', border: '1px solid rgba(27,42,74,0.15)' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>{data.totalResponses}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Community Responses Analyzed</div>
      </div>
      {items.map(item => (
        <div key={item.label} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.label}</span>
            <span style={{ fontSize: '0.84rem', color: item.color, fontWeight: 700 }}>{item.value} ({Math.round((item.value / total) * 100)}%)</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: '#e2e8f0', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(item.value / total) * 100}%`, background: item.color, borderRadius: '3px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      ))}
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
        Simulate policy changes and see estimated effects. <em>Outputs are simulations, not factual predictions.</em>
      </p>
      {scenarios.map(s => (
        <div key={s.id} style={{ padding: '14px', borderRadius: '10px', background: selected === s.id ? 'var(--primary-light)' : '#f8fafc', border: `1px solid ${selected === s.id ? 'var(--primary)' : 'var(--border-subtle)'}`, cursor: 'pointer', transition: 'all 0.15s ease' }} onClick={() => handleSimulate(s)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{s.name}</span>
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '100px', background: '#f5f3ff', color: '#7c3aed', fontWeight: 600 }}>{s.category}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{s.description}</p>
          {selected === s.id && simulated && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginTop: '10px', padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {Object.entries(simulated.effects).map(([key, val]) => (
                <div key={key} style={{ textAlign: 'center', padding: '8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: val > 20 ? '#047857' : val > 10 ? '#b45309' : 'var(--primary)' }}>{val}%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'capitalize', fontWeight: 600 }}>{key.replace(/([A-Z])/g, ' $1')}</div>
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
          <input type="text" placeholder="Search civic knowledge base..." value={query} onChange={e => handleSearch(e.target.value)}
            className="form-input" style={{ width: '100%', paddingLeft: '32px' }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {results.map(item => (
          <div key={item.id} style={{ padding: '12px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 700 }}>{item.title}</span>
              <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700 }}>{item.relevance}% match</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>{item.category}</span>
              {item.tags?.slice(0, 3).map((tag, i) => (
                <span key={i} style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: '#e2e8f0', color: 'var(--text-secondary)' }}>{tag}</span>
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#7c3aed', marginBottom: '8px', fontWeight: 700 }}>
          <Brain size={13} color="#7c3aed" /> AI Civic Intelligence Hub
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>AI Civic Intelligence</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Deep AI-powered analysis, root causes, forecasting, and decision support for civic challenges.</p>
      </div>

      {/* Mobile-scrollable tabs */}
      <div className="reveal mobile-scroll-tabs" style={{ display: 'flex', gap: '4px', background: '#ffffff', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TAB_LIST.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 12px', borderRadius: '6px', border: 'none', flexShrink: 0,
              background: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.78rem', fontWeight: isActive ? 700 : 500,
              whiteSpace: 'nowrap', transition: 'all 0.15s ease',
            }}>
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="glass-card" style={{ padding: '20px', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        {renderContent()}
      </div>
    </div>
  );
}
