import React, { useState } from 'react';
import { LayoutGrid, GanttChart, Users, DollarSign, CheckSquare, Clock, AlertTriangle, ChevronRight, GripVertical } from 'lucide-react';
import { projectService } from '../services/advanced40Service';

const KANBAN_COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#475569', bg: '#f1f5f9' },
  { id: 'in_progress', label: 'In Progress', color: '#003087', bg: 'var(--primary-light)' },
  { id: 'review', label: 'Review', color: '#b45309', bg: '#fffbeb' },
  { id: 'completed', label: 'Completed', color: '#047857', bg: '#f0fdf4' },
];

function KanbanBoard({ project }) {
  const [tasks, setTasks] = useState(project.tasks);

  const moveTask = (taskId, direction) => {
    const colOrder = ['todo', 'in_progress', 'review', 'completed'];
    const task = tasks.find(t => t.id === taskId);
    const currentIdx = colOrder.indexOf(task.status);
    const newIdx = direction === 'right' ? Math.min(currentIdx + 1, 3) : Math.max(currentIdx - 1, 0);
    const newStatus = colOrder[newIdx];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
      {KANBAN_COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div key={col.id} style={{ minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', padding: '8px 12px', borderRadius: '8px', background: col.bg, border: `1px solid var(--border-subtle)` }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: col.color }}>{col.label}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: 'auto', fontWeight: 700 }}>{colTasks.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '100px' }}>
              {colTasks.map(task => (
                <div key={task.id} style={{ padding: '12px', borderRadius: '8px', background: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', cursor: 'grab', transition: 'all 0.15s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <GripVertical size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-primary)', fontWeight: 600, flex: 1 }}>{task.title}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>👤 {task.assignee}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {col.id !== 'todo' && <button onClick={() => moveTask(task.id, 'left')} style={{ padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#f8f9fa', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700 }}>←</button>}
                      {col.id !== 'completed' && <button onClick={() => moveTask(task.id, 'right')} style={{ padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#f8f9fa', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700 }}>→</button>}
                    </div>
                  </div>
                  {task.dueDate && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>Due: {task.dueDate}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GanttTimeline({ project }) {
  const tasks = project.tasks;
  const allDates = tasks.flatMap(t => [new Date(t.dueDate)]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const totalDays = Math.max((maxDate - minDate) / (1000 * 60 * 60 * 24), 30);

  const statusColors = { completed: '#10b981', in_progress: '#003087', review: '#f59e0b', todo: '#6b7280' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '480px' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
        <div style={{ width: '200px', flexShrink: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Task</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <span>Current Timeline</span>
          <span>{maxDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
      {tasks.map((task, i) => {
        const taskDate = new Date(task.dueDate);
        const daysFromStart = (taskDate - minDate) / (1000 * 60 * 60 * 24);
        const leftPercent = (daysFromStart / totalDays) * 100;
        return (
          <div key={task.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: i < tasks.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <div style={{ width: '200px', flexShrink: 0, fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
            <div style={{ flex: 1, height: '22px', position: 'relative', background: '#f1f5f9', borderRadius: '4px' }}>
              <div style={{
                position: 'absolute', top: '2px', left: `${Math.max(0, leftPercent - 5)}%`,
                width: '60px', height: '18px', borderRadius: '4px',
                background: statusColors[task.status],
                opacity: task.status === 'completed' ? 0.75 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '0.62rem', color: '#ffffff', fontWeight: 700 }}>{task.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProjectHealth({ project }) {
  const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
  const totalTasks = project.tasks.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);
  const healthColors = { Healthy: '#047857', 'At Risk': '#b45309', Critical: '#dc2626' };
  const overdueTasks = project.tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
      <div style={{ padding: '14px 10px', borderRadius: '8px', background: '#ffffff', border: '1px solid var(--border-subtle)', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: healthColors[project.healthStatus] }}>{project.healthScore}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{project.healthStatus}</div>
      </div>
      <div style={{ padding: '14px 10px', borderRadius: '8px', background: '#ffffff', border: '1px solid var(--border-subtle)', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#003087' }}>{progress}%</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tasks Complete</div>
      </div>
      <div style={{ padding: '14px 10px', borderRadius: '8px', background: '#ffffff', border: '1px solid var(--border-subtle)', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b45309' }}>₹{(project.budget.spent / 1000).toFixed(0)}K</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>of ₹{(project.budget.total / 1000).toFixed(0)}K</div>
      </div>
      <div style={{ padding: '14px 10px', borderRadius: '8px', background: '#ffffff', border: '1px solid var(--border-subtle)', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: overdueTasks > 0 ? '#dc2626' : '#047857' }}>{overdueTasks}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overdue Tasks</div>
      </div>
    </div>
  );
}

function MilestoneTimeline({ milestones }) {
  const statusColors = { completed: '#047857', in_progress: '#003087', upcoming: '#64748b' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {milestones.map((ms, i) => (
        <div key={ms.id} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: statusColors[ms.status] }} />
            {i < milestones.length - 1 && <div style={{ width: '2px', flex: 1, background: 'var(--border-subtle)', marginTop: '4px' }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 700 }}>{ms.title}</span>
              <span style={{ fontSize: '0.7rem', color: statusColors[ms.status], fontWeight: 700, textTransform: 'capitalize' }}>{ms.status.replace('_', ' ')}</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>Due: {ms.dueDate}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {ms.deliverables.map((d, j) => (
                <div key={j} style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckSquare size={12} color="var(--primary)" /> {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectManagementPage({ onNavigate }) {
  const projects = projectService.getAll();
  const [selectedProject, setSelectedProject] = useState(projects[0] || null);
  const [view, setView] = useState('kanban');

  if (!selectedProject) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No projects available.</div>;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>
      <div className="reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: '#be185d', marginBottom: '8px', fontWeight: 700 }}>
          <LayoutGrid size={13} color="#be185d" /> Project Workspaces
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)' }}>Project Workspaces</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage civic projects with Kanban boards, Gantt timelines, and milestone tracking.</p>
      </div>

      {/* Project Selector */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {projects.map(p => (
          <button key={p.id} onClick={() => setSelectedProject(p)} style={{ padding: '9px 16px', borderRadius: '10px', border: `1px solid ${selectedProject.id === p.id ? 'var(--primary)' : 'var(--border-subtle)'}`, background: selectedProject.id === p.id ? 'var(--primary)' : '#ffffff', color: selectedProject.id === p.id ? '#ffffff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: selectedProject.id === p.id ? 700 : 500, whiteSpace: 'nowrap', flexShrink: 0, boxShadow: selectedProject.id === p.id ? '0 2px 8px rgba(0,48,135,0.2)' : 'var(--shadow-xs)' }}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Health Score */}
      <ProjectHealth project={selectedProject} />

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '4px', background: '#ffffff', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)', width: 'fit-content', overflowX: 'auto' }}>
        {[
          { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
          { id: 'gantt', label: 'Timeline', icon: GanttChart },
          { id: 'milestones', label: 'Milestones', icon: CheckSquare },
          { id: 'team', label: 'Team', icon: Users },
        ].map(v => {
          const Icon = v.icon;
          const isActive = view === v.id;
          return (
            <button key={v.id} onClick={() => setView(v.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '6px', border: 'none', background: isActive ? 'var(--primary-light)' : 'transparent', color: isActive ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: isActive ? 700 : 500 }}>
              <Icon size={13} /> {v.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="glass-card" style={{ padding: '18px', overflowX: 'auto', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
        {view === 'kanban' && <KanbanBoard project={selectedProject} />}
        {view === 'gantt' && <GanttTimeline project={selectedProject} />}
        {view === 'milestones' && <MilestoneTimeline milestones={selectedProject.milestones} />}
        {view === 'team' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {selectedProject.team.map(member => (
              <div key={member.id} style={{ padding: '16px', borderRadius: '10px', background: '#f8f9fa', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{member.avatar}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{member.name}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{member.role}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: 500 }}>{member.assignedTasks} tasks assigned</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
