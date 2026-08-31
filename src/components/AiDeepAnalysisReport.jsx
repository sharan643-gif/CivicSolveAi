import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, MapPin, AlertTriangle, ShieldCheck, Zap, Target, Users, Clock, ChevronDown, ChevronUp, Building2, Wrench, BarChart3 } from 'lucide-react';
import { getChallenges } from '../services/supabaseService';
import { accountabilityService, DEPARTMENTS } from '../services/accountabilityService';
import { civicIntelligenceEngine } from '../services/civicIntelligenceEngine';

export default function AiDeepAnalysisReport({ challenge }) {
  const [expanded, setExpanded] = useState(true);
  const [similarComplaints, setSimilarComplaints] = useState([]);
  const [hotspotData, setHotspotData] = useState(null);
  const [deptMetrics, setDeptMetrics] = useState(null);
  const [riskPrediction, setRiskPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!challenge) return;

    const loadAnalysis = async () => {
      setLoading(true);
      try {
        // 1. Find similar complaints from database
        const allChallenges = await getChallenges();
        const searchText = ((challenge.title || '') + ' ' + (challenge.description || '')).toLowerCase();
        const searchWords = new Set(searchText.split(/\W+/).filter(w => w.length > 3));

        const similar = allChallenges
          .filter(c => c.id !== challenge.id)
          .map(c => {
            const cText = ((c.title || '') + ' ' + (c.description || '') + ' ' + (c.category || '')).toLowerCase();
            const cWords = new Set(cText.split(/\W+/).filter(w => w.length > 3));
            let overlap = 0;
            for (const w of searchWords) { if (cWords.has(w)) overlap++; }
            const similarity = overlap / Math.max(1, searchWords.size + cWords.size - overlap);
            return { ...c, _similarity: similarity };
          })
          .filter(c => c._similarity > 0.1 || c.category === challenge.category)
          .sort((a, b) => b._similarity - a._similarity)
          .slice(0, 5)
          .map(({ _similarity, ...c }) => c);

        setSimilarComplaints(similar);

        // 2. Check hotspot data
        const hotspots = civicIntelligenceEngine.getCivicHotspots();
        const locationLower = (challenge.location || '').toLowerCase();
        const matchedHotspot = hotspots.find(h =>
          locationLower.includes((h.ward || '').toLowerCase()) ||
          locationLower.includes((h.name || '').toLowerCase()) ||
          (challenge.category || '').toLowerCase() === (h.dominantCategory || '').toLowerCase()
        );
        setHotspotData(matchedHotspot || null);

        // 3. Department performance metrics
        const deptId = challenge.department_id || accountabilityService.matchDepartment(challenge.category, challenge.title, challenge.description).id;
        const metrics = accountabilityService.getDepartmentScore(deptId);
        const dept = accountabilityService.getDepartmentById(deptId);
        setDeptMetrics({ ...dept, ...metrics });

        // 4. SLA breach risk prediction
        const risk = civicIntelligenceEngine.predictSlaRisk(challenge);
        setRiskPrediction(risk);

      } catch (err) {
        console.warn('[AiDeepAnalysisReport] Failed to load analysis:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [challenge]);

  if (!challenge) return null;

  const aiAnalysis = challenge.ai_analysis || {};
  const possibleCauses = aiAnalysis.possible_causes || [];
  const suggestedTech = aiAnalysis.suggested_technologies || [];
  const skillsRequired = aiAnalysis.skills_required || aiAnalysis.skills_required || challenge.skills_required || [];
  const riskFactors = aiAnalysis.risk_factors || [];

  return (
    <div
      className="glass-card"
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* Header */}
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
          }}>
            <Brain size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              AI Deep Analysis Report
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Powered by database intelligence — {similarComplaints.length} similar complaints, {hotspotData ? '1 hotspot match' : 'no hotspot match'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {challenge.priority_score && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: challenge.priority_score >= 85 ? '#dc2626' : challenge.priority_score >= 70 ? '#d97706' : '#059669' }}>
                {challenge.priority_score}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>/100 PRIORITY</div>
            </div>
          )}
          {expanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
        </div>
      </div>

      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Quick Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <QuickStat
              icon={<Target size={14} />}
              label="Severity"
              value={challenge.severity || 'medium'}
              color={challenge.severity === 'critical' ? '#dc2626' : challenge.severity === 'high' ? '#d97706' : '#0284c7'}
            />
            <QuickStat
              icon={<Users size={14} />}
              label="Affected"
              value={`${(challenge.affected_population || 0).toLocaleString()} people`}
              color="#7c3aed"
            />
            <QuickStat
              icon={<Clock size={14} />}
              label="SLA"
              value={`${challenge.sla_days || deptMetrics?.slaDays || '?'} days`}
              color="#059669"
            />
            <QuickStat
              icon={<Building2 size={14} />}
              label="Department"
              value={deptMetrics?.shortName || challenge.department_name || 'Assigning...'}
              color="#0369a1"
            />
          </div>

          {/* Root Cause Analysis */}
          {possibleCauses.length > 0 && (
            <AnalysisSection
              icon={<AlertTriangle size={15} color="#d97706" />}
              title="Root Cause Analysis"
              color="#d97706"
            >
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {possibleCauses.map((cause, i) => (
                  <li key={i} style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {cause}
                  </li>
                ))}
              </ul>
            </AnalysisSection>
          )}

          {/* Risk Factors */}
          {(riskFactors.length > 0 || riskPrediction) && (
            <AnalysisSection
              icon={<ShieldCheck size={15} color="#dc2626" />}
              title="Risk Assessment"
              color="#dc2626"
            >
              {riskPrediction && (
                <div style={{
                  padding: '10px 14px', borderRadius: '8px',
                  background: riskPrediction.isHighRisk ? '#fef2f2' : '#f0fdf4',
                  border: `1px solid ${riskPrediction.isHighRisk ? '#fecaca' : '#bbf7d0'}`,
                  marginBottom: riskFactors.length > 0 ? '10px' : 0
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: riskPrediction.color }}>
                      SLA Breach Risk: {riskPrediction.riskLevel}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: riskPrediction.color }}>
                      {riskPrediction.riskPercentage}%
                    </span>
                  </div>
                  {riskPrediction.reasons?.length > 0 && (
                    <div style={{ marginTop: '6px' }}>
                      {riskPrediction.reasons.map((r, i) => (
                        <div key={i} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>• {r}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {riskFactors.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {riskFactors.map((risk, i) => (
                    <span key={i} style={{
                      fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px',
                      background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', fontWeight: 600
                    }}>
                      ⚠ {risk}
                    </span>
                  ))}
                </div>
              )}
            </AnalysisSection>
          )}

          {/* Similar Complaints from Database */}
          {similarComplaints.length > 0 && (
            <AnalysisSection
              icon={<BarChart3 size={15} color="#7c3aed" />}
              title={`Similar Complaints in Database (${similarComplaints.length})`}
              color="#7c3aed"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {similarComplaints.map((c, i) => (
                  <div key={c.id || i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', borderRadius: '8px', background: '#f8f7f5',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {c.district || c.location || 'N/A'} • {c.category}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '8px' }}>
                      <span style={{
                        fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700,
                        background: c.status === 'resolved' || c.status === 'implemented' ? '#dcfce7' : c.status === 'under_review' ? '#fef3c7' : '#e0e7ff',
                        color: c.status === 'resolved' || c.status === 'implemented' ? '#166534' : c.status === 'under_review' ? '#92400e' : '#3730a3'
                      }}>
                        {(c.status || 'reported').replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {c.priority_score || '—'}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AnalysisSection>
          )}

          {/* Hotspot Warning */}
          {hotspotData && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #fef2f2, #fff7ed)',
              border: '1px solid #fecaca',
              display: 'flex', alignItems: 'flex-start', gap: '10px'
            }}>
              <MapPin size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b' }}>
                  Known Hotspot: {hotspotData.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#7f1d1d', marginTop: '2px' }}>
                  {hotspotData.ward} — {hotspotData.repeatCount} repeat complaints. Risk: {hotspotData.riskLevel}
                </div>
                {hotspotData.systemicIssue && (
                  <div style={{ fontSize: '0.75rem', color: '#991b1b', marginTop: '4px', fontStyle: 'italic' }}>
                    "{hotspotData.systemicIssue}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Department Performance */}
          {deptMetrics && (
            <AnalysisSection
              icon={<Building2 size={15} color="#0369a1" />}
              title="Department Performance Profile"
              color="#0369a1"
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                <MetricCard label="Credit Score" value={`${deptMetrics.score}/100`} sub={deptMetrics.tier} color={deptMetrics.badgeColor} />
                <MetricCard label="SLA Compliance" value={`${deptMetrics.slaCompliance}%`} sub="historical" color="#059669" />
                <MetricCard label="Resolution Rate" value={`${deptMetrics.resolvedRate}%`} sub={`${deptMetrics.totalResolved}/${deptMetrics.totalAssigned}`} color="#0284c7" />
                <MetricCard label="Avg Resolution" value={`${deptMetrics.avgResolutionDays?.toFixed(1)}d`} sub="per ticket" color="#7c3aed" />
              </div>
            </AnalysisSection>
          )}

          {/* Suggested Technologies & Skills */}
          {(suggestedTech.length > 0 || skillsRequired.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {suggestedTech.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Suggested Technologies
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                    {suggestedTech.map((tech, i) => (
                      <div key={i} style={{
                        fontSize: '0.78rem', color: 'var(--text-primary)', background: 'var(--primary-light)',
                        padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(27,42,74,0.12)', fontWeight: 600
                      }}>
                        <Wrench size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {skillsRequired.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Required Skills
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {skillsRequired.map((skill, i) => (
                      <span key={i} style={{
                        fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)',
                        padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontWeight: 600
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Analysis Confidence */}
          {aiAnalysis._dataGrounded && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
              borderRadius: '8px', background: '#f0f9ff', border: '1px solid #bae6fd',
              fontSize: '0.75rem', color: '#0369a1'
            }}>
              <Zap size={13} />
              <span>
                <strong>Data-Grounded Analysis</strong> — Used {similarComplaints.length} similar complaints, {hotspotData ? '1 hotspot match' : '0 hotspot matches'}, and department performance data for this analysis.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function QuickStat({ icon, label, value, color }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: '8px', background: '#f8f7f5',
      border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px'
    }}>
      <div style={{ color, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{value}</div>
      </div>
    </div>
  );
}

function AnalysisSection({ icon, title, color, children }) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: '10px',
      background: '#faf9f7', border: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column', gap: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon}
        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{
      padding: '10px', borderRadius: '8px', background: '#ffffff',
      border: '1px solid var(--border-subtle)', textAlign: 'center'
    }}>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 900, color, marginTop: '2px' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '1px' }}>{sub}</div>}
    </div>
  );
}
