import React, { useState, useEffect } from 'react';
import { MapPin, Users, Heart, Share2, Brain, Code, UserCheck, Wrench, Shield, CheckSquare, Plus, MessageSquare } from 'lucide-react';
import { getChallenges, getTeams, getChallengeById, updateChallenge } from '../services/supabaseService';

export default function DetailPage({ challengeId, onNavigate, currentUserRole }) {
  const [challenges, setChallenges] = useState([]);
  const [teams, setTeams] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cList, tList] = await Promise.all([getChallenges(), getTeams()]);
      setChallenges(cList);
      setTeams(tList);
      setLoading(false);
    }
    loadData();
  }, [challengeId]);

  const challenge = challenges.find(c => c.id === challengeId);
  const activeTab = 'overview';
  const [tab, setTab] = useState('overview');

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

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      
      {/* Back button */}
      <div>
        <button onClick={() => onNavigate('explore')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          ← Back to Marketplace
        </button>
      </div>

      {/* Top Section / Header Summary */}
      <div className="glass-card reveal" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', borderLeft: `5px solid ${getSeverityColor(challenge.severity)}` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge badge-${challenge.severity}`}>{challenge.severity}</span>
            <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
              {challenge.status.replace('_', ' ')}
            </span>
          </div>
          
          <h1 style={{ fontSize: '2rem', color: '#fff' }}>{challenge.title}</h1>
          
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} />
              <span>{challenge.location}</span>
            </div>
            <div>Affected: <strong style={{ color: 'white' }}>{challenge.affected_population.toLocaleString()} residents</strong></div>
            <div>Reports: <strong style={{ color: 'white' }}>{challenge.reports_count} files</strong></div>
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
            <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Tabs selectors */}
      <div className="reveal" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        {[
          { id: 'overview', label: 'Overview & Reports', icon: Shield },
          { id: 'ai', label: 'AI Forensics Engine', icon: Brain },
          { id: 'team', label: team ? 'Team Workspace' : 'University Matching', icon: Code }
        ].map(t => {
          const IconComp = t.icon;
          const isSelected = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="btn"
              style={{
                background: isSelected ? 'rgba(59,130,246,0.1)' : 'transparent',
                borderColor: isSelected ? 'var(--primary)' : 'transparent',
                color: isSelected ? 'white' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                padding: '10px 16px',
                borderRadius: '6px 6px 0 0'
              }}
            >
              <IconComp size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. Overview */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'white' }}>Problem Description</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {challenge.description}
            </p>

            {challenge.evidence && challenge.evidence.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'white', marginBottom: '10px' }}>Submitted Photographic Evidence</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {challenge.evidence.map(ev => (
                    <div key={ev.id} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <img src={ev.url} alt={ev.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                      <div style={{ padding: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)' }}>
                        📎 {ev.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar: Stages and Comments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Lifecyle stage widget */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '16px' }}>Challenge Lifecycle</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', paddingLeft: '20px' }}>
                <div style={{ position: 'absolute', left: '4px', top: '6px', bottom: '6px', width: '2px', background: 'rgba(255,255,255,0.06)' }}></div>
                
                {/* Simplified timeline */}
                {[
                  { label: 'Reported & AI Analyzed', active: true },
                  { label: 'Feasibility Validated', active: challenge.status !== 'reported' && challenge.status !== 'under_review' },
                  { label: 'Published & Matching Open', active: !['reported', 'under_review', 'validated'].includes(challenge.status) },
                  { label: 'Team Formed & Coding', active: !['reported', 'under_review', 'validated', 'published', 'team_formation'].includes(challenge.status) },
                  { label: 'Pilot Field Testing', active: ['pilot', 'implemented', 'resolved'].includes(challenge.status) },
                  { label: 'Implemented & Social Impact measured', active: ['implemented', 'resolved'].includes(challenge.status) }
                ].map((st, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: st.active ? 'var(--success)' : 'rgba(255,255,255,0.1)',
                      border: st.active ? '2px solid white' : 'none',
                      position: 'absolute',
                      left: '0px',
                      boxShadow: st.active ? '0 0 8px var(--success)' : 'none'
                    }}></div>
                    <span style={{ color: st.active ? 'white' : 'var(--text-muted)' }}>{st.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support list comment simulator */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '12px' }}>Discussion Hub</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', marginBottom: '12px' }}>
                {challenge.comments && challenge.comments.length > 0 ? (
                  challenge.comments.map(c => (
                    <div key={c.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.78rem' }}>
                      <strong style={{ color: 'white', display: 'block', marginBottom: '2px' }}>{c.user}</strong>
                      <span style={{ color: 'var(--text-secondary)' }}>{c.text}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                    No comments yet. Support this challenge to begin thread.
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="text" placeholder="Add to the conversation..." className="form-input" style={{ padding: '6px 8px', fontSize: '0.75rem' }} />
                <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '0.75rem' }}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. AI Analysis */}
      {tab === 'ai' && challenge.ai_analysis && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          
          {/* Forensics card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ai-purple)' }}>
              <Brain size={20} />
              <h3 style={{ fontSize: '1.1rem', color: 'white' }}>AI-Generated Structural Diagnostics</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Identified Subcategory</span>
                <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>{challenge.ai_analysis.subcategory || 'Urban Engineering'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Affected Estimate</span>
                <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>{challenge.ai_analysis.affected_population_estimate || challenge.affected_population} residents</span>
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
                  <div key={idx} style={{ fontSize: '0.8rem', padding: '6px 10px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: '6px', color: '#fff' }}>
                    🛠 {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar alignment matches */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1rem', color: 'white' }}>Skill Alignment</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {challenge.skills_required.map((skill, idx) => (
                <span key={idx} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', padding: '4px 8px', borderRadius: '4px', color: 'white' }}>
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', fontWeight: 600 }}>Recommended Stakeholders</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <div>🎓 <strong style={{ color: 'white' }}>University:</strong> Technical Institutes offering Geotechnical / Computer Science branches.</div>
                <div>🏢 <strong style={{ color: 'white' }}>Industry:</strong> GIS platforms, IoT fabrication labs, local cement agencies.</div>
                <div>🏛 <strong style={{ color: 'white' }}>Government:</strong> Rural Development Department, Municipal Water Supply Authority.</div>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
              
              {/* Task list and core details */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'white' }}>{team.name}</h3>
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
                  <h4 style={{ fontSize: '0.95rem', color: 'white', marginBottom: '12px' }}>Sprint Tasks checklist</h4>
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
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                      >
                        <input 
                          type="checkbox" 
                          checked={task.status === 'completed'} 
                          onChange={() => {}} // handled by div click
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ 
                          fontSize: '0.82rem', 
                          color: task.status === 'completed' ? 'var(--text-muted)' : 'white',
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
                  <h4 style={{ fontSize: '0.95rem', color: 'white', marginBottom: '10px' }}>Milestone Deadlines</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {team.milestones.map(m => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '6px 8px', background: 'rgba(255,255,255,0.01)', borderRadius: '4px' }}>
                        <span style={{ color: 'white' }}>{m.title}</span>
                        <span style={{ color: m.status === 'completed' ? 'var(--success)' : 'var(--warning)' }}>
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
                      <h4 style={{ fontSize: '0.9rem', color: 'white' }}>Corporate Sponsor</h4>
                      <span className="badge" style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
                        Active Collab
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>{collab.company_name}</h3>
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
                <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '4px' }}>AI-Powered Team Matching Recommendations</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>We have identified active students with complementary skills compatible with this challenge.</p>
              </div>

              {/* Skill checklist matching */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '12px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--ai-purple)', fontWeight: 600 }}>Challenge Demands:</span>
                {challenge.skills_required.map((skill, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', color: '#fff' }}>✓ {skill}</span>
                ))}
              </div>

              {/* Recommended students */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '10px' }}>
                {[
                  { name: 'Aarav Mehta', role: 'AI / ML Specialist', compatibility: 97, avatar: '👨‍💻', skills: ['Python', 'Machine Learning', 'GIS'] },
                  { name: 'Priya Sharma', role: 'Backend Architect', compatibility: 94, avatar: '👩‍💻', skills: ['Python', 'IoT', 'Django'] },
                  { name: 'Rohan Das', role: 'IoT Firmware Developer', compatibility: 90, avatar: '👨‍💻', skills: ['IoT', 'Embedded C++', 'Civil Eng.'] }
                ].map((student, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>
                      {student.compatibility}% compatible
                    </div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{student.avatar}</div>
                    <h4 style={{ fontSize: '0.9rem', color: '#fff' }}>{student.name}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>{student.role}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {student.skills.map((s, i) => (
                        <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.03)', padding: '2px 4px', borderRadius: '2px', color: 'var(--text-secondary)' }}>{s}</span>
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
