import React, { useState, useEffect } from 'react';
import { MapPin, Users, Heart, Share2, Brain, Code, UserCheck, Wrench, Shield, CheckSquare, Plus, MessageSquare, Award, Building2, Clock, Sparkles, AlertTriangle, User, Flame, ThumbsUp } from 'lucide-react';
import { getChallenges, getTeams, getChallengeById, updateChallenge } from '../services/supabaseService';
import { accountabilityService } from '../services/accountabilityService';
import { civicIntelligenceEngine } from '../services/civicIntelligenceEngine';
import { geminiService } from '../services/geminiClientService';
import JanSetuLoop from '../components/JanSetuLoop';
import ProblemDnaCard from '../components/ProblemDnaCard';
import CapabilityGapCard from '../components/CapabilityGapCard';
import DeploymentReadinessCard from '../components/DeploymentReadinessCard';
import SolutionDnaCard from '../components/SolutionDnaCard';
import CollaborationGraph from '../components/CollaborationGraph';
import ImpactCertificateModal from '../components/ImpactCertificateModal';
import AiClassificationCard from '../components/AiClassificationCard';
import SlaCountdownTimer from '../components/SlaCountdownTimer';
import ComplaintTimeline from '../components/ComplaintTimeline';
import CitizenVerificationPanel from '../components/CitizenVerificationPanel';
import DeptPerformanceBadge from '../components/DeptPerformanceBadge';
import AiDeepAnalysisReport from '../components/AiDeepAnalysisReport';
import CitizenRealityCheckModal from '../components/CitizenRealityCheckModal';

export default function DetailPage({ challengeId, onNavigate, currentUserRole }) {
  const [challenges, setChallenges] = useState([]);
  const [teams, setTeams] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCertModal, setShowCertModal] = useState(false);
  const [tab, setTab] = useState('tracking');
  const [showRealityCheckModal, setShowRealityCheckModal] = useState(false);
  const [communityVotes, setCommunityVotes] = useState(() => civicIntelligenceEngine.getCommunityVotes(challengeId));

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cList, tList] = await Promise.all([getChallenges(true), getTeams()]);

      // Merge localStorage evidence data with database challenges
      try {
        const localEvidence = JSON.parse(localStorage.getItem('civicsolve_evidence') || '{}');
        cList.forEach(c => {
          if (localEvidence[c.id] && (!c.evidence || c.evidence.length === 0)) {
            c.evidence = localEvidence[c.id];
          }
        });
      } catch (lsErr) {
        console.warn('[DetailPage] Failed to load local evidence:', lsErr.message);
      }

      setChallenges(cList);
      setTeams(tList);
      setLoading(false);
    }
    loadData();
  }, [challengeId]);

  const challenge = challenges.find(c => c.id === challengeId);


  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading challenge details...
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Challenge not found</h2>
        <button onClick={() => onNavigate('explore')} className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Explore</button>
      </div>
    );
  }

  // Find team for this challenge
  const team = teams.find(t => t.challenge_id === challenge.id);
  const collab = collaborations.find(col => col.challenge_id === challenge.id);
  const mentor = mentors.find(m => m.id === team?.mentor_id);

  // Dynamic actions
  const handleSupport = async () => {
    const newSupportCount = (challenge.support_count || 0) + 1;
    await updateChallenge(challenge.id, { support_count: newSupportCount });
    setChallenges(prev => prev.map(c => c.id === challenge.id ? { ...c, support_count: newSupportCount } : c));
  };

  const handleToggleTask = (taskId) => {
    if (!team) return;
    const updatedTasks = team.tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: t.status === 'completed' ? 'in_progress' : 'completed' };
      }
      return t;
    });
    
    // Recalculate progress
    const completedCount = updatedTasks.filter(t => t.status === 'completed').length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedTeams = teams.map(t => {
      if (t.id === team.id) {
        return { ...t, tasks: updatedTasks, progress_percentage: progress };
      }
      return t;
    });

    setTeams(updatedTeams);
  };

  const handleCreateTeam = () => {
    // Dynamic Team Creation Simulator
    const newTeam = {
      id: `t-dynamic-${Math.floor(Math.random()*1000)}`,
      challenge_id: challenge.id,
      name: "Team AquaTech (Formed)",
      progress_percentage: 10,
      repository_url: "https://github.com/sih2026/aquatech-sih",
      lead_id: "st-aarav",
      university: "Birla Institute of Technology (BIT) Mesra",
      skills: challenge.skills_required,
      mentor_id: "exp-ramesh",
      milestones: [
        { id: "m1", title: "Project Inception", status: "completed", date: "Today" },
        { id: "m2", title: "Technology Selection", status: "in_progress", date: "Next week" }
      ],
      tasks: challenge.skills_required.map((skill, i) => ({
        id: `tsk-dyn-${i}`,
        title: `Implement ${skill} matching logic component`,
        status: i === 0 ? 'completed' : 'todo',
        assigned_to: i === 0 ? 'Aarav Mehta' : 'Team Member'
      })),
      members: [
        { id: "st-aarav", name: "Aarav Mehta", role: "AI / ML Engineer", compatibility: 97, branch: "Computer Science", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150" },
        { id: "st-priya", name: "Priya Sharma", role: "Backend Developer", compatibility: 94, branch: "Information Technology", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" }
      ]
    };

    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);

    // Update challenge status to team_formation / active_development
    const updatedChallenges = challenges.map(c => {
      if (c.id === challenge.id) {
        return { ...c, status: 'active_development' };
      }
      return c;
    });
    setChallenges(updatedChallenges);
    updateChallenge(challenge.id, { status: 'active_development' });
    
    // Add default collaboration
    const newCollab = {
      id: `col-dyn-${Math.floor(Math.random()*1000)}`,
      challenge_id: challenge.id,
      team_id: newTeam.id,
      company_name: "GeoTech Solutions",
      logo: "🌍",
      expertise: ["GIS Systems", "Data APIs"],
      contribution: "Telemetry API access",
      mentors: ["Vivek Anand"],
      funding: 150000,
      status: "Active Collaboration"
    };
    const updatedCollabs = [...collaborations, newCollab];
    setCollaborations(updatedCollabs);
  };

  const getSeverityColor = (sev) => {
    if (sev === 'critical') return '#ef4444';
    if (sev === 'high') return '#f97316';
    if (sev === 'medium') return '#eab308';
    return '#10b981';
  };

  // Civic intelligence derived values (safe — only runs when challenge is loaded)
  const slaRisk = civicIntelligenceEngine.predictSlaRisk(challenge);
  const assignedDept = accountabilityService.getDepartmentById(
    challenge.department_id || accountabilityService.matchDepartment(challenge.category).id
  );
  const officerAssignment = civicIntelligenceEngine.recommendOfficerAssignment(
    assignedDept.id, challenge.location, challenge.category
  );

  const handleVoteCommunity = (type) => {
    const updated = civicIntelligenceEngine.submitCommunityVote(challengeId, type);
    setCommunityVotes({ ...updated });
  };


  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      
      {/* Back button */}
      <div>
        <button onClick={() => onNavigate('explore')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          ← Back to Marketplace
        </button>
      </div>

      {/* Top Section / Header Summary */}
      <div className="glass-card reveal detail-header-row" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', borderLeft: `5px solid ${getSeverityColor(challenge.severity)}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className={`badge badge-${challenge.severity || 'medium'}`}>{challenge.severity || 'medium'}</span>
            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
              {(challenge.status || 'reported').replace('_', ' ')}
            </span>
            <SlaCountdownTimer
              slaDeadline={challenge.sla_deadline || accountabilityService.calculateSlaDeadline(challenge.created_at, challenge.sla_days || 7)}
              isResolved={challenge.status === 'resolved'}
            />
            <DeptPerformanceBadge
              deptId={assignedDept.id}
              showDetails={true}
            />

            {/* SLA Risk Prediction Badge */}
            {slaRisk && (
              <span
                style={{
                  fontSize: '0.74rem',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: `${slaRisk.color}15`,
                  color: slaRisk.color,
                  border: `1px solid ${slaRisk.color}40`,
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ⚠️ {slaRisk.riskPercentage}% Breach Risk ({slaRisk.riskLevel})
              </span>
            )}
          </div>
          
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 800 }}>{challenge.title}</h1>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} />
              <span>{challenge.location}</span>
            </div>
            <div>Affected: <strong style={{ color: 'var(--text-primary)' }}>{(challenge.affected_population || 0).toLocaleString()} residents</strong></div>
            <div>Reports: <strong style={{ color: 'var(--text-primary)' }}>{challenge.reports_count} files</strong></div>
          </div>

          {/* ONE ISSUE -> ONE OWNER ACCOUNTABILITY MATRIX (PILLAR 26) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              background: '#f8fafc',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.76rem'
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Officer: </span>
              <strong style={{ color: 'var(--text-primary)' }}>{officerAssignment?.assignedOfficer?.name || 'Er. Sandeep Verma'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Supervisor: </span>
              <strong style={{ color: 'var(--text-primary)' }}>{assignedDept.head.split(',')[0]}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Department: </span>
              <strong style={{ color: 'var(--primary)' }}>{assignedDept.shortName}</strong>
            </div>
          </div>

          {/* COMMUNITY VERIFICATION VOTING (PILLAR 21) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              👥 Community Ground Verification: "Is this problem still active?"
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleVoteCommunity('still_damaged')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: communityVotes.userVoted === 'still_damaged' ? '2px solid #dc2626' : '1px solid #fecaca',
                  background: communityVotes.userVoted === 'still_damaged' ? '#fee2e2' : '#ffffff',
                  color: '#dc2626',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Still Damaged ({communityVotes.stillDamaged})
              </button>

              <button
                onClick={() => handleVoteCommunity('partial')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: communityVotes.userVoted === 'partial' ? '2px solid #d97706' : '1px solid #fde68a',
                  background: communityVotes.userVoted === 'partial' ? '#fef3c7' : '#ffffff',
                  color: '#d97706',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Partially Fixed ({communityVotes.partiallyFixed})
              </button>

              <button
                onClick={() => handleVoteCommunity('fixed')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: communityVotes.userVoted === 'fixed' ? '2px solid #059669' : '1px solid #bbf7d0',
                  background: communityVotes.userVoted === 'fixed' ? '#dcfce7' : '#ffffff',
                  color: '#059669',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Fixed ({communityVotes.fixed})
              </button>
            </div>
          </div>
        </div>

        {/* Priority Score Shield */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Ecosystem Priority</span>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: getSeverityColor(challenge.severity), fontFamily: 'var(--font-display)' }}>
              {challenge.priority_score}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={handleSupport} className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
              <Heart size={14} fill="white" />
              Support ({challenge.support_count})
            </button>
            <button onClick={() => setShowCertModal(true)} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', background: 'var(--accent)', color: '#ffffff', border: 'none', fontWeight: 700 }}>
              <Award size={14} />
              Impact Certificate
            </button>
            <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* ── EVIDENCE GALLERY — Prominent display of uploaded photos/videos ── */}
      {(() => {
        // Collect and deduplicate all evidence items
        const rawList = [];
        if (Array.isArray(challenge.evidence)) rawList.push(...challenge.evidence);
        if (Array.isArray(challenge.evidence_files)) rawList.push(...challenge.evidence_files);
        if (Array.isArray(challenge.ai_analysis?.evidence)) rawList.push(...challenge.ai_analysis.evidence);

        // Also retrieve from localStorage if needed
        try {
          const localEvidence = JSON.parse(localStorage.getItem('civicsolve_evidence') || '{}');
          if (localEvidence[challenge.id]) rawList.push(...localEvidence[challenge.id]);
          if (challengeId && localEvidence[challengeId]) rawList.push(...localEvidence[challengeId]);
        } catch (e) {}

        // Deduplicate by name + size
        const seen = new Set();
        const allEvidence = rawList.filter(item => {
          if (!item) return false;
          const key = (item.name || '') + '_' + (item.size || '');
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        if (allEvidence.length === 0) return null;

        return (
          <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>📷</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Field Evidence & Uploaded Photos ({allEvidence.length} file{allEvidence.length > 1 ? 's' : ''})
                </h3>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>
                Verified Citizen Attachments
              </span>
            </div>

            {/* Main gallery grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {allEvidence.map((ev, idx) => {
                const hasUrl = Boolean(ev.url || ev.preview);
                const mediaUrl = ev.url || ev.preview || '';
                const isImg = (ev.type && ev.type.startsWith('image/')) || mediaUrl.startsWith('data:image') || mediaUrl.startsWith('http') || mediaUrl.startsWith('blob:') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(ev.name || '');
                const isVideo = ev.type && ev.type.startsWith('video/');

                return (
                  <div key={ev.id || `ev-${idx}`} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-medium)', background: '#f8fafc', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                    {isVideo && hasUrl ? (
                      <video src={mediaUrl} controls style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                    ) : hasUrl && isImg ? (
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={mediaUrl}
                          alt={ev.name || 'Evidence photo'}
                          style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                          onClick={() => window.open(mediaUrl, '_blank')}
                        />
                        <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px' }}>
                          Click to enlarge
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '2.2rem' }}>{ev.type?.includes('video') ? '📹' : ev.type?.includes('pdf') ? '📄' : '🖼️'}</span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>{ev.name || 'File Attached'}</span>
                      </div>
                    )}
                    <div style={{ padding: '8px 10px', background: '#ffffff', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        📎 {ev.name || 'Evidence file'}
                      </div>
                      {ev.size && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{(ev.size / 1024).toFixed(0)} KB</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* JanSetu Lifecycle Loop Signature */}
      <JanSetuLoop activeStage={challenge.status === 'prototype' ? 'BUILD' : challenge.status === 'pilot' ? 'VALIDATE' : challenge.status === 'implemented' ? 'MEASURE' : 'UNDERSTAND'} />

      {/* Tabs selectors */}
      <div className="reveal mobile-scroll-tabs" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px', overflowX: 'auto' }}>
        {[
          { id: 'tracking', label: 'Complaint Lifecycle & SLA Tracking', icon: Building2 },
          { id: 'overview', label: 'Problem DNA & Overview', icon: Shield },
          { id: 'ai', label: 'AI Forensics & Capability', icon: Brain },
          { id: 'team', label: team ? 'Team & Solution DNA' : 'University Matching', icon: Code }
        ].map(t => {
          const IconComp = t.icon;
          const isSelected = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="btn"
              style={{
                background: isSelected ? 'var(--primary-light)' : 'transparent',
                borderColor: isSelected ? 'var(--primary)' : 'transparent',
                color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                padding: '10px 16px',
                borderRadius: '6px 6px 0 0',
                whiteSpace: 'nowrap',
                fontWeight: isSelected ? 700 : 500
              }}
            >
              <IconComp size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 0. Complaint Lifecycle & SLA Tracking */}
      {tab === 'tracking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* PILLAR 23: "Why Is This Still Pending?" Transparent AI Explainer */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(27,42,74, 0.04), rgba(2, 132, 199, 0.06))',
              border: '1px solid rgba(27,42,74, 0.2)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <Sparkles size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                AI Transparency Status: "What is happening with this complaint right now?"
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '4px 0 0' }}>
                {civicIntelligenceEngine.getPendingExplanation(challenge)}
              </p>
            </div>
          </div>

          {/* AI Routing Overview Card */}
          <AiClassificationCard
            department={challenge.department_id || challenge.category}
            category={challenge.category}
            severity={challenge.severity}
            slaDays={challenge.sla_days || 7}
            routingReason={challenge.ai_analysis?.department_routing?.routing_reason || 'Automated AI classification matched to responsible government department.'}
          />

          {/* AI Deep Analysis Report — Root Causes, Similar Complaints, Hotspot Data, Risk Assessment */}
          <AiDeepAnalysisReport challenge={challenge} />

          {/* PILLAR 12: Citizen Reality Check Action Bar */}
          <div
            className="glass-card"
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Citizen Ground Audit: "Has the problem genuinely been solved?"
              </h4>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Help audit government performance by submitting your 3-option reality check.
              </span>
            </div>
            <button
              onClick={() => setShowRealityCheckModal(true)}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.82rem' }}
            >
              Take Reality Check Audit
            </button>
          </div>

          {/* Citizen Verification Panel if resolved */}
          {challenge.status === 'resolved' && (
            <CitizenVerificationPanel challenge={challenge} />
          )}

          {/* Lifecycle Stepper Timeline */}
          <ComplaintTimeline challenge={challenge} />
        </div>
      )}

      {showRealityCheckModal && (
        <CitizenRealityCheckModal
          challenge={challenge}
          onClose={() => setShowRealityCheckModal(false)}
          onSuccess={(verdict) => {
            alert(`Reality check audit logged: ${verdict.toUpperCase().replace('_', ' ')}`);
          }}
        />
      )}

      {/* TAB CONTENT: 1. Overview */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ProblemDnaCard challenge={challenge} />

          <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '8px' }}>Problem Description</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              {challenge.description}
            </p>

            {challenge.evidence && challenge.evidence.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '10px' }}>Submitted Photographic Evidence</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  {challenge.evidence.map((ev, evIdx) => (
                    <div key={ev.id || evIdx} style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      {ev.type && ev.type.startsWith('video/') ? (
                        <video src={ev.url} controls style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                      ) : ev.url && (ev.url.startsWith('http') || ev.url.startsWith('data:')) ? (
                        <img src={ev.url} alt={ev.name || 'Evidence'} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '140px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📎</div>
                      )}
                      <div style={{ padding: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)' }}>
                        📎 {ev.name || 'Evidence file'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }} className="responsive-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <CapabilityGapCard challenge={challenge} />
              <SolutionDnaCard />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <DeploymentReadinessCard challenge={challenge} />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. AI Analysis */}
      {tab === 'ai' && challenge.ai_analysis && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }} className="responsive-grid">
          
          {/* Forensics card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
              <Brain size={20} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700 }}>AI-Generated Structural Diagnostics</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Identified Subcategory</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{challenge.ai_analysis.subcategory || 'Urban Engineering'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Affected Estimate</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{challenge.ai_analysis.affected_population_estimate || challenge.affected_population} residents</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Semantic Root Causes</span>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(challenge.ai_analysis.possible_causes || ["Insufficient drainage channels"]).map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Recommended Technologies</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(challenge.ai_analysis.suggested_technologies || ["GIS Platforms", "IoT telemetry"]).map((tech, idx) => (
                  <div key={idx} style={{ fontSize: '0.8rem', padding: '6px 10px', background: 'var(--primary-light)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--primary)', fontWeight: 600 }}>
                    🛠 {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar alignment matches */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700 }}>Skill Alignment</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {challenge.skills_required.map((skill, idx) => (
                <span key={idx} style={{ fontSize: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', fontWeight: 600 }}>Recommended Stakeholders</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div>🎓 <strong style={{ color: 'var(--text-primary)' }}>University:</strong> Technical Institutes offering Geotechnical / Computer Science branches.</div>
                <div>🏢 <strong style={{ color: 'var(--text-primary)' }}>Industry:</strong> GIS platforms, IoT fabrication labs, local cement agencies.</div>
                <div>🏛 <strong style={{ color: 'var(--text-primary)' }}>Government:</strong> Rural Development Department, Municipal Water Supply Authority.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. Team Workspace or University Match */}
      {tab === 'team' && (
        <div>
          {team ? (
            /* Active Team Workspace Dashboard */
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }} className="responsive-grid">
              
              {/* Task list and core details */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700 }}>{team.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Registered to {team.university}</p>
                  </div>
                  
                  {/* Progress tracker wheel */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Workspace Progress</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
                      {team.progress_percentage}%
                    </div>
                  </div>
                </div>

                {/* Interactive Tasks checklist */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '12px' }}>Sprint Tasks checklist</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {team.tasks.map(task => (
                      <div 
                        key={task.id} 
                        onClick={() => handleToggleTask(task.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          background: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                      >
                        <input 
                          type="checkbox" 
                          checked={task.status === 'completed'} 
                          onChange={() => {}} // handled by div click
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ 
                          fontSize: '0.82rem', 
                          color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                          fontWeight: task.status === 'completed' ? 400 : 600,
                          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          flexGrow: 1
                        }}>
                          {task.title}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          👤 {task.assigned_to}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones list */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '10px' }}>Milestone Deadlines</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {team.milestones.map(m => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '6px 8px', background: 'var(--bg-primary)', borderRadius: '4px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{m.title}</span>
                        <span style={{ color: m.status === 'completed' ? 'var(--success)' : 'var(--warning)', fontWeight: 700 }}>
                          {m.status === 'completed' ? '✓ Completed' : `⏳ ${m.date}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar partner and mentor info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Industry Collaboration */}
                {collab && (
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>Corporate Sponsor</h4>
                      <span className="badge" style={{ background: 'var(--success-light)', color: 'var(--success)', fontWeight: 700 }}>
                        Active Collab
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '4px' }}>{collab.company_name}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      <strong>Contribution:</strong> {collab.contribution}
                    </p>
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Approved Funding</span>
                      <strong style={{ color: 'white' }}>₹{collab.funding.toLocaleString()}</strong>
                    </div>
                  </div>
                )}

                {/* Expert Review */}
                {mentor && (
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'white', marginBottom: '12px' }}>Expert Mentor & Feasibility</h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ background: 'rgba(255,255,255,0.04)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.2rem' }}>👨‍🏫</div>
                      <div>
                        <h4 style={{ fontSize: '0.85rem', color: 'white' }}>{mentor.name}</h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{mentor.designation}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Technical rating</span>
                      <strong style={{ color: 'var(--warning)' }}>⭐ {mentor.rating} / 5.0</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* AI Skill Matching recommendations (If no team formed yet) */
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '4px', fontWeight: 800 }}>AI-Powered Team Matching Recommendations</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>We have identified active students with complementary skills compatible with this challenge.</p>
              </div>

              {/* Skill checklist matching */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '12px', background: 'rgba(27,42,74, 0.05)', borderRadius: '8px', border: '1px solid rgba(27,42,74, 0.15)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>Challenge Demands:</span>
                {challenge.skills_required.map((skill, i) => (
                  <span key={i} style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 500 }}>✓ {skill}</span>
                ))}
              </div>

              {/* Recommended students */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '10px' }}>
                {[
                  { name: 'Aarav Mehta', role: 'AI / ML Specialist', compatibility: 97, avatar: '👨‍💻', skills: ['Python', 'Machine Learning', 'GIS'] },
                  { name: 'Priya Sharma', role: 'Backend Architect', compatibility: 94, avatar: '👩‍💻', skills: ['Python', 'IoT', 'Django'] },
                  { name: 'Rohan Das', role: 'IoT Firmware Developer', compatibility: 90, avatar: '👨‍💻', skills: ['IoT', 'Embedded C++', 'Civil Eng.'] }
                ].map((student, idx) => (
                  <div key={idx} style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>
                      {student.compatibility}% compatible
                    </div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{student.avatar}</div>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{student.name}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>{student.role}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {student.skills.map((s, i) => (
                        <span key={i} style={{ fontSize: '0.68rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  These recommended students represent complementary skill profiles across departments.
                </span>
                <button onClick={handleCreateTeam} className="btn btn-ai">
                  <Brain size={14} />
                  Assemble Cohort & Create Team
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
