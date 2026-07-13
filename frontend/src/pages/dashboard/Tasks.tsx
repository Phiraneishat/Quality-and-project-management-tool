import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, LayoutGrid, List, Calendar, GanttChart, GripVertical, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge, StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';

type ViewMode = 'kanban' | 'list' | 'calendar' | 'timeline';

const columns: { id: string; title: string; color: string }[] = [
  { id: 'todo', title: 'Todo', color: 'bg-slate-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'in-review', title: 'In Review', color: 'bg-amber-500' },
  { id: 'testing', title: 'Testing', color: 'bg-purple-500' },
  { id: 'blocked', title: 'Blocked', color: 'bg-red-500' },
  { id: 'completed', title: 'Completed', color: 'bg-emerald-500' },
];

const mockTasks = [
  { id: '1', name: 'Implement JWT auth middleware', status: 'todo', priority: 'High', assignee: 'Alice Johnson', labels: ['Backend'], est: '8h', project: 'E-Commerce', module: 'Authentication', description: 'Configure custom NestJS JWT guards & roles verification.', comments: 'Checked with PM' },
  { id: '2', name: 'Design dashboard wireframes', status: 'todo', priority: 'Medium', assignee: 'Bob Smith', labels: ['Design'], est: '4h', project: 'Analytics', module: 'Dashboard', description: 'Draft layouts for stats modules and chart widgets.', comments: '' },
  { id: '3', name: 'API rate limiter setup', status: 'todo', priority: 'Low', assignee: 'Charlie Brown', labels: ['DevOps'], est: '3h', project: 'E-Commerce', module: 'Security', description: 'Prevent brute-force login attempts using throttling.', comments: '' },
  { id: '4', name: 'Build task Kanban board', status: 'in-progress', priority: 'High', assignee: 'Diana Prince', labels: ['Frontend'], est: '12h', project: 'QualityDesk', module: 'Kanban', description: 'Create dynamic column layout with drag handlers.', comments: 'Styling needs review' },
  { id: '5', name: 'Setup MongoDB schemas', status: 'in-progress', priority: 'Urgent', assignee: 'Eve Adams', labels: ['Backend', 'DB'], est: '6h', project: 'E-Commerce', module: 'Database', description: 'Define mongoose schemas for tasks, bugs, and users.', comments: 'Initial schema review complete' },
  { id: '6', name: 'User profile page UI', status: 'in-progress', priority: 'Medium', assignee: 'Frank Castle', labels: ['Frontend'], est: '5h', project: 'Mobile App', module: 'Profile', description: 'Build responsive profile layout.', comments: '' },
  { id: '7', name: 'Code review — auth module', status: 'in-review', priority: 'High', assignee: 'Grace Hopper', labels: ['Review'], est: '2h', project: 'E-Commerce', module: 'Authentication', description: 'Verify JWT refresh logic and signature validations.', comments: 'Completed review' },
  { id: '8', name: 'Sprint retrospective notes', status: 'in-review', priority: 'Low', assignee: 'Henry Ford', labels: ['PM'], est: '1h', project: 'QualityDesk', module: 'Management', description: 'Compile team speed metrics and blockers list.', comments: '' },
  { id: '9', name: 'Integration test — payments', status: 'testing', priority: 'Critical', assignee: 'Ivy League', labels: ['QA'], est: '6h', project: 'E-Commerce', module: 'Billing', description: 'Verify mock Stripe webhooks logic.', comments: '' },
  { id: '10', name: 'Performance load testing', status: 'testing', priority: 'High', assignee: 'Jack Ryan', labels: ['QA', 'DevOps'], est: '8h', project: 'Mobile App', module: 'Infrastructure', description: 'Verify server request througputs.', comments: '' },
  { id: '11', name: 'Vendor API down — blocked', status: 'blocked', priority: 'Critical', assignee: 'Kate Bishop', labels: ['Backend', 'External'], est: '0h', project: 'E-Commerce', module: 'Integration', description: 'Stripe staging API down.', comments: 'Waiting for vendor update' },
  { id: '12', name: 'Landing page animations', status: 'completed', priority: 'Medium', assignee: 'Leo Messi', labels: ['Frontend'], est: '4h', project: 'QualityDesk', module: 'UI Components', description: 'Sleek Framer-motion scroll animations.', comments: 'Approved by PM' },
  { id: '13', name: 'Database migration script', status: 'completed', priority: 'High', assignee: 'Mia Farrow', labels: ['Backend', 'DB'], est: '3h', project: 'Analytics', module: 'Database', description: 'Migrate legacy user records.', comments: '' },
  { id: '14', name: 'Email template designs', status: 'completed', priority: 'Low', assignee: 'Noah Ark', labels: ['Design'], est: '5h', project: 'Mobile App', module: 'Messaging', description: 'Responsive transactional mail designs.', comments: '' },
];

export const Tasks: React.FC = () => {
  const [taskList, setTaskList] = useState(mockTasks);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');

  // Add Task Modal State values
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [targetColumn, setTargetColumn] = useState('todo');
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState('Alice Johnson');
  const [estimate, setEstimate] = useState('4h');
  const [labels, setLabels] = useState('Frontend');
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');

  const handleOpenAdd = (columnId: string) => {
    setTargetColumn(columnId);
    setTaskName('');
    setModuleName('');
    setDescription('');
    setComments('');
    setShowCreateModal(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask = {
      id: Math.random().toString(),
      name: taskName,
      status: targetColumn,
      priority,
      assignee,
      labels: labels.split(',').map(l => l.trim()).filter(Boolean),
      est: estimate || '2h',
      project: 'QualityDesk',
      module: moduleName,
      description,
      comments
    };

    setTaskList(prev => [...prev, newTask]);
    setShowCreateModal(false);
    setTaskName('');
    setModuleName('');
    setDescription('');
    setComments('');
  };

  const getTasksByStatus = (status: string) => {
    return taskList.filter((t) => t.status === status && (
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase()) ||
      t.project.toLowerCase().includes(search.toLowerCase())
    ));
  };

  const filteredTasks = taskList.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.assignee.toLowerCase().includes(search.toLowerCase()) ||
    t.project.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Manage tasks across all projects with Kanban, List, Calendar, or Timeline views.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-5 w-5" />} onClick={() => handleOpenAdd('todo')}>New Task</Button>
      </div>

      {/* Toolbar */}
      <Card padding="sm" className="flex flex-wrap items-center gap-3 !p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Filter className="h-4 w-4" />}>Filters</Button>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {[
            { mode: 'kanban' as ViewMode, icon: LayoutGrid, label: 'Kanban' },
            { mode: 'list' as ViewMode, icon: List, label: 'List' },
            { mode: 'calendar' as ViewMode, icon: Calendar, label: 'Calendar' },
            { mode: 'timeline' as ViewMode, icon: GanttChart, label: 'Timeline' },
          ].map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={label}
              className={`p-2 ${viewMode === mode ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-500' : 'text-slate-400 hover:text-slate-600'} cursor-pointer transition-colors`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </Card>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {columns.map((col) => {
            const tasks = getTasksByStatus(col.id);
            return (
              <div key={col.id} className="min-w-[280px] w-[280px] shrink-0">
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{col.title}</h3>
                  <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{tasks.length}</span>
                </div>

                {/* Column Body */}
                <div className="space-y-2.5 min-h-[200px] p-1">
                  {tasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card
                        hover
                        padding="sm"
                        className="!p-4 cursor-grab active:cursor-grabbing group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <PriorityBadge priority={task.priority} />
                          <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug mb-1">{task.name}</h4>
                        {task.module && (
                          <div className="text-[10px] font-bold text-primary-500 dark:text-primary-400 mb-2">
                            Module: {task.module}
                          </div>
                        )}
                        {task.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.labels.map((l) => (
                            <span key={l} className="text-[9px] font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 px-1.5 py-0.5 rounded">{l}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <Avatar name={task.assignee} size="xs" />
                          <span className="text-[10px] text-slate-400 font-mono">{task.est}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}

                  {/* Add Task */}
                  <button
                    onClick={() => handleOpenAdd(col.id)}
                    className="w-full py-2.5 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-400 hover:text-primary-500 hover:border-primary-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['Task', 'Module', 'Status', 'Priority', 'Assignee', 'Project', 'Estimate'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, i) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{task.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 rounded">
                        {task.module || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={columns.find((c) => c.id === task.status)?.title || task.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignee} size="xs" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{task.assignee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-slate-500">{task.project}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-slate-400 font-mono">{task.est}</span></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Calendar & Timeline placeholders */}
      {(viewMode === 'calendar' || viewMode === 'timeline') && (
        <Card className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-16 w-16 rounded-2xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-500 mx-auto mb-4">
              {viewMode === 'calendar' ? <Calendar className="h-8 w-8" /> : <GanttChart className="h-8 w-8" />}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              {viewMode === 'calendar' ? 'Calendar View' : 'Timeline View'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">Coming in the next update</p>
          </div>
        </Card>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        subtitle={`Add a task to the ${columns.find(c => c.id === targetColumn)?.title} column.`}
      >
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <Input
            label="Task Name"
            placeholder="e.g., Configure JWT validation guards"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            required
            autoFocus
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Assignee</label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option>Alice Johnson</option>
                <option>Bob Smith</option>
                <option>Charlie Brown</option>
                <option>Diana Prince</option>
                <option>Eve Adams</option>
                <option>Frank Castle</option>
                <option>Grace Hopper</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estimate (e.g., 4h, 1d)"
              placeholder="4h"
              value={estimate}
              onChange={e => setEstimate(e.target.value)}
            />
            <Input
              label="Labels (comma separated)"
              placeholder="e.g., Frontend, UI"
              value={labels}
              onChange={e => setLabels(e.target.value)}
            />
          </div>

          <Input
            label="Module"
            placeholder="e.g., Authentication, Billing"
            value={moduleName}
            onChange={e => setModuleName(e.target.value)}
          />

          <Textarea
            label="Description"
            placeholder="Describe the task details..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />

          <Textarea
            label="Comments"
            placeholder="Add initial notes or comments..."
            value={comments}
            onChange={e => setComments(e.target.value)}
            rows={2}
          />

          <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" leftIcon={<Plus className="h-4 w-4" />}>Create Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
