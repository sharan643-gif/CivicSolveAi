import React, { useState } from 'react';
import { LayoutDashboard, CheckCircle2, Clock, Plus, User, FileText, MoveRight, Award, ShieldCheck } from 'lucide-react';

const KANBAN_STAGES = [
  { id: 'backlog', name: 'Backlog', color: '#64748b' },
  { id: 'in_progress', name: 'In Progress', color: '#3b82f6' },
  { id: 'review', name: 'Review', color: '#8b5cf6' },
  { id: 'testing', name: 'Testing', color: '#f59e0b' },
  { id: 'pilot', name: 'Pilot Stage', color: '#ec4899' },
  { id: 'completed', name: 'Completed', color: '#10b981' }
];

export default function ProjectWorkspace({ challengeTitle = 'Monsoon Rural Road Accessibility' }) {
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Topographical GIS Survey of Sikaripara Block', stage: 'completed', assignee: 'Aarav Mehta', priority: 'High', deadline: '2026-07-05' },
    { id: 't2', title: 'Formulate Industrial Slag Polymer Ratio Blend', stage: 'pilot', assignee: 'Priya Sharma', priority: 'Critical', deadline: '2026-07-20' },
    { id: 't3', title: 'Deploy IoT Sub-surface Soil Moisture Sensors', stage: 'testing', assignee: 'Rohan Gupta', priority: 'High', deadline: '2026-08-01' },
    { id: 't4', title: 'Draft District Panchayat Pilot Approval Document', stage: 'review', assignee: 'Dr. Ramesh Pathak', priority: 'Medium', deadline: '2026-08-10' },
    { id: 't5', title: 'Develop Mobile Alert App for Village Sarpanch', stage: 'in_progress', assignee: 'Aarav Mehta', priority: 'Medium', deadline: '2026-08-25' },
    { id: 't6', title: 'Conduct Post-Monsoon Road Durability Audit', stage: 'backlog', assignee: 'Unassigned', priority: 'Low', deadline: '2026-09-15' }
  ]);

  const [milestones, setMilestones] = useState([
    { id: 'm1', title: 'Milestone 1: Research & GIS Field Data Collection', status: 'completed', date: 'July 10, 2026', approvedBy: 'Dr. S. K. Bose (University Admin)' },
    { id: 'm2', title: 'Milestone 2: Lab Testing & Sensor Mesh Prototype', status: 'in_progress', date: 'August 15, 2026', approvedBy: 'Pending Expert Review' },
    { id: 'm3', title: 'Milestone 3: Sikaripara Block Field Pilot (1.2 km Road)', status: 'pending', date: 'September 30, 2026', approvedBy: 'District Rural Dev Dept' }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'milestones'

  const moveTask = (taskId, newStage) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, stage: newStage } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle,
      stage: 'backlog',
      assignee: 'Self Assigned',
      priority: 'Medium',
      deadline: '2026-09-01'
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  return (
    <div className="glass-l2" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Workspace Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Active Smart Workspace</span>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            {challengeTitle}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-elevated)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button onClick={() => setActiveTab('kanban')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activeTab === 'kanban' ? 'rgba(59,130,246,0.15)' : 'transparent', color: activeTab === 'kanban' ? '#fff' : 'var(--text-secondary)' }}>
            Kanban Board
          </button>
          <button onClick={() => setActiveTab('milestones')} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activeTab === 'milestones' ? 'rgba(16,185,129,0.15)' : 'transparent', color: activeTab === 'milestones' ? '#10b981' : 'var(--text-secondary)' }}>
            Milestones Tracker
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {activeTab === 'kanban' && (
        <>
          {/* Quick Add Task */}
          <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px' }}>
            <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} className="form-input" placeholder="Add a new task to Backlog..." style={{ flex: 1 }} />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>+ Add Task</button>
          </form>

          {/* Kanban Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            {KANBAN_STAGES.map(col => {
              const colTasks = tasks.filter(t => t.stage === col.id);
              return (
                <div key={col.id} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px', minWidth: '170px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${col.color}`, paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{col.name}</span>
                    <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '100px', color: col.color, fontWeight: 700 }}>{colTasks.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '200px' }}>
                    {colTasks.map(t => (
                      <div key={t.id} className="glass-l1" style={{ borderRadius: '8px', padding: '10px', fontSize: '0.78rem' }}>
                        <div style={{ color: '#fff', fontWeight: 600, marginBottom: '6px', lineHeight: 1.3 }}>{t.title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          <span>👤 {t.assignee.split(' ')[0]}</span>
                          <span style={{ color: t.priority === 'Critical' ? '#ef4444' : t.priority === 'High' ? '#f59e0b' : 'var(--text-muted)' }}>{t.priority}</span>
                        </div>

                        {/* Shift Stage Controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px' }}>
                          {col.id !== 'backlog' && (
                            <button onClick={() => {
                              const idx = KANBAN_STAGES.findIndex(s => s.id === col.id);
                              moveTask(t.id, KANBAN_STAGES[idx - 1].id);
                            }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.65rem', cursor: 'pointer' }}>‹ Back</button>
                          )}
                          {col.id !== 'completed' && (
                            <button onClick={() => {
                              const idx = KANBAN_STAGES.findIndex(s => s.id === col.id);
                              moveTask(t.id, KANBAN_STAGES[idx + 1].id);
                            }} style={{ background: 'none', border: 'none', color: col.color, fontSize: '0.65rem', cursor: 'pointer', marginLeft: 'auto' }}>Next ›</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Milestones View */}
      {activeTab === 'milestones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {milestones.map(m => (
            <div key={m.id} style={{ background: 'var(--bg-elevated)', border: `1px solid ${m.status === 'completed' ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`, borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color={m.status === 'completed' ? '#10b981' : m.status === 'in_progress' ? '#f59e0b' : 'var(--text-muted)'} />
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>{m.title}</h4>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', marginLeft: '26px' }}>
                  Target Date: <strong>{m.date}</strong> · Verifier: <strong>{m.approvedBy}</strong>
                </div>
              </div>

              {m.status === 'completed' ? (
                <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
                  ✓ Approved & Verified
                </span>
              ) : (
                <button onClick={() => setMilestones(milestones.map(x => x.id === m.id ? { ...x, status: 'completed', approvedBy: 'Verified by Industry Mentor' } : x))} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                  Approve Milestone
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
