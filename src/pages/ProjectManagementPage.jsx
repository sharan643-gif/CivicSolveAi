import React, { useState } from 'react';
import { LayoutGrid, GanttChart, Users, DollarSign, CheckSquare, Clock, AlertTriangle, ChevronRight, GripVertical } from 'lucide-react';
import { projectService } from '../services/advanced40Service';

const KANBAN_COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#6b7280', bg: 'rgba(107,114,128,0.08)' },
  { id: 'in_progress', label: 'In Progress', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  { id: 'review', label: 'Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { id: 'completed', label: 'Completed', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
      {KANBAN_COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div key={col.id} style={{ minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', padding: '8px 10px', borderRadius: '8px', background: col.bg, border: `1px solid ${col.color}22` }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: col.color }}>{col.label}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{colTasks.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '100px' }}>
              {colTasks.map(task => (
                <div key={task.id} style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', cursor: 'grab', transition: 'all 0.15s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <GripVertical size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600, flex: 1 }}>{task.title}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>👤 {task.assignee}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {col.id !== 'todo' && <button onClick={() => moveTask(task.id, 'left')} style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.65rem' }}>←</button>}
                      {col.id !== 'completed' && <button onClick={() => moveTask(task.id, 'right')} style={{ padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.65rem' }}>→</button>}
                    </div>
                  </div>
                  {task.dueDate && <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '4px' }}>Due: {task.dueDate}</div>}
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

  const statusColors = { completed: '#10b981', in_progress: '#3b82f6', review: '#f59e0b', todo: '#6b7280' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
        <div style={{ width: '200px', flexShrink: 0, fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Task</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
          <span>Today</span>
          <span>{maxDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
      {tasks.map((task, i) => {
        const taskDate = new Date(task.dueDate);
        const daysFromStart = (taskDate - minDate) / (1000 * 60 * 60 * 24);
        const leftPercent = (daysFromStart / totalDays) * 100;
        return (
          <div key={task.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '6px 0', borderBottom: i < tasks.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
            <div style={{ width: '200px', flexShrink: 0, fontSize: '0.78rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
            <div style={{ flex: 1, height: '20px', position: 'relative', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
              <div style={{
                position: 'absolute', top: '2px', left: `${Math.max(0, leftPercent - 5)}%`,
                width: '40px', height: '16px', borderRadius: '4px',
                background: statusColors[task.status],
                opacity: task.status === 'completed' ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: 600 }}>{task.status.replace('_', ' ')}</span>
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
  const budgetUsed = Math.round((project.budget.spent / project.budget.total) * 100);
  const healthColors = { Healthy: '#10b981', 'At Risk': '#f59e0b', Critical: '#ef4444' };
  const overdueTasks = project.tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '16px' }}>
      <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: healthColors[project.healthStatus] }}>{project.healthScore}</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{project.healthStatus}</div>
      </div>
      <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6' }}>{progress}%</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Tasks Complete</div>
      </div>
      <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b' }}>₹{(project.budget.spent / 1000).toFixed(0)}K</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>of ₹{(project.budget.total / 1000).toFixed(0)}K</div>
      </div>
      <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: overdueTasks > 0 ? '#ef4444' : '#10b981' }}>{overdueTasks}</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Overdue Tasks</div>
      </div>
    </div>
  );
}

function MilestoneTimeline({ milestones }) {
  const statusColors = { completed: '#10b981', in_progress: '#3b82f6', upcoming: '#6b7280' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {milestones.map((ms, i) => (
        <div key={ms.id} style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: statusColors[ms.status] }} />
            {i < milestones.length - 1 && <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.06)', marginTop: '4px' }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{ms.title}</span>
              <span style={{ fontSize: '0.68rem', color: statusColors[ms.status] }}>{ms.status.replace('_', ' ')}</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Due: {ms.dueDate}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {ms.deliverables.map((d, j) => (
                <div key={j} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckSquare size={10} color="var(--text-muted)" /> {d}
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', color: '#f472b6', marginBottom: '8px' }}>
          <LayoutGrid size={12} /> Project Management
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Project Workspaces</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage civic projects with Kanban boards, Gantt timelines, and milestone tracking.</p>
      </div>

      {/* Project Selector */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {projects.map(p => (
          <button key={p.id} onClick={() => setSelectedProject(p)} style={{ padding: '10px 16px', borderRadius: '10px', border: `1px solid ${selectedProject.id === p.id ? 'rgba(236,72,153,0.3)' : 'var(--border-subtle)'}`, background: selectedProject.id === p.id ? 'rgba(236,72,153,0.1)' : 'rgba(255,255,255,0.02)', color: selectedProject.id === p.id ? '#f472b6' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: selectedProject.id === p.id ? 700 : 400, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Health Score */}
      <ProjectHealth project={selectedProject} />

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)', width: 'fit-content' }}>
        {[
          { id: 'kanban', label: 'Kanban', icon: LayoutGrid },
          { id: 'gantt', label: 'Timeline', icon: GanttChart },
          { id: 'milestones', label: 'Milestones', icon: CheckSquare },
          { id: 'team', label: 'Team', icon: Users },
        ].map(v => {
          const Icon = v.icon;
          return (
            <button key={v.id} onClick={() => setView(v.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '6px', border: 'none', background: view === v.id ? 'rgba(236,72,153,0.15)' : 'transparent', color: view === v.id ? '#f472b6' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: view === v.id ? 700 : 400 }}>
              <Icon size={12} /> {v.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="glass-card" style={{ padding: '16px', overflowX: 'auto' }}>
        {view === 'kanban' && <KanbanBoard project={selectedProject} />}
        {view === 'gantt' && <GanttTimeline project={selectedProject} />}
        {view === 'milestones' && <MilestoneTimeline milestones={selectedProject.milestones} />}
        {view === 'team' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {selectedProject.team.map(member => (
              <div key={member.id} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{member.avatar}</div>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{member.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{member.role}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '6px' }}>{member.assignedTasks} tasks assigned</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
