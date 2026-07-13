import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Bug as BugIcon, AlertCircle, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge, StatusBadge, SeverityBadge, PriorityBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';

const mockBugs = [
  { id: 'BUG-001', title: 'Login redirect loop on expired session', severity: 'Critical', priority: 'Urgent', status: 'Open', assignee: 'Alex Thompson', reporter: 'Sarah Chen', project: 'E-Commerce', module: 'Authentication', dueDate: '2026-07-10', created: '2 hours ago' },
  { id: 'BUG-002', title: 'Dashboard charts not rendering in Safari', severity: 'High', priority: 'High', status: 'Assigned', assignee: 'Raj Patel', reporter: 'Emma Wilson', project: 'QualityDesk', module: 'Dashboard', dueDate: '2026-07-12', created: '5 hours ago' },
  { id: 'BUG-003', title: 'File upload fails for files > 10MB', severity: 'High', priority: 'High', status: 'In Progress', assignee: 'Diana Prince', reporter: 'Frank Castle', project: 'Mobile App', module: 'File Management', dueDate: '2026-07-15', created: '1 day ago' },
  { id: 'BUG-004', title: 'Email notifications sent in wrong timezone', severity: 'Medium', priority: 'Medium', status: 'Ready for QA', assignee: 'Eve Adams', reporter: 'Grace Hopper', project: 'E-Commerce', module: 'Notifications', dueDate: '2026-07-18', created: '2 days ago' },
  { id: 'BUG-005', title: 'Kanban drag breaks on mobile touch events', severity: 'Medium', priority: 'Medium', status: 'Testing', assignee: 'Bob Smith', reporter: 'Henry Ford', project: 'QualityDesk', module: 'Tasks', dueDate: '2026-07-20', created: '3 days ago' },
  { id: 'BUG-006', title: 'Dark mode text contrast issue on badges', severity: 'Low', priority: 'Low', status: 'Closed', assignee: 'Charlie Brown', reporter: 'Ivy League', project: 'QualityDesk', module: 'UI Components', dueDate: '2026-07-05', created: '5 days ago' },
  { id: 'BUG-007', title: 'API rate limit bypass through batch requests', severity: 'Critical', priority: 'Critical', status: 'Reopened', assignee: 'Jack Ryan', reporter: 'Kate Bishop', project: 'E-Commerce', module: 'API Gateway', dueDate: '2026-07-08', created: '1 day ago' },
];

const statusColors: Record<string, string> = {
  'Open': 'border-l-red-500',
  'Assigned': 'border-l-blue-500',
  'In Progress': 'border-l-blue-500',
  'Ready for QA': 'border-l-amber-500',
  'Testing': 'border-l-purple-500',
  'Closed': 'border-l-emerald-500',
  'Reopened': 'border-l-red-500',
};

export const Bugs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedBug, setSelectedBug] = useState<string | null>(null);

  const filtered = mockBugs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = mockBugs.filter((b) => !['Closed'].includes(b.status)).length;
  const criticalCount = mockBugs.filter((b) => b.severity === 'Critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Bug Tracking</h1>
          <p className="text-sm text-slate-500 mt-1">Track, prioritize, and resolve bugs across all projects.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-5 w-5" />} onClick={() => setShowCreate(true)}>
          Report Bug
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Bugs', value: mockBugs.length, color: 'text-primary-500', icon: BugIcon },
          { label: 'Open', value: openCount, color: 'text-rose-500', icon: AlertCircle },
          { label: 'Critical', value: criticalCount, color: 'text-red-600', icon: AlertCircle },
          { label: 'Resolved', value: mockBugs.length - openCount, color: 'text-emerald-500', icon: BugIcon },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} padding="sm" className="flex items-center gap-3 !p-4">
              <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black font-display text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <Card padding="sm" className="flex items-center gap-3 !p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bugs by title or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
      </Card>

      {/* Bug List */}
      <div className="space-y-3">
        {filtered.map((bug, i) => (
          <motion.div
            key={bug.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card
              hover
              padding="none"
              className={`!p-0 border-l-4 ${statusColors[bug.status] || 'border-l-slate-300'} cursor-pointer`}
              onClick={() => setSelectedBug(bug.id)}
            >
              <div className="px-5 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-primary-500">{bug.id}</span>
                      <SeverityBadge severity={bug.severity} />
                      <StatusBadge status={bug.status} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{bug.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span>Project: <strong className="text-slate-600 dark:text-slate-300">{bug.project}</strong></span>
                      <span>•</span>
                      <span>Module: <strong className="text-slate-600 dark:text-slate-300">{bug.module}</strong></span>
                      <span>•</span>
                      <span>{bug.created}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <Avatar name={bug.assignee} size="xs" />
                      <span className="text-xs text-slate-500 hidden sm:block">{bug.assignee}</span>
                    </div>
                    <Eye className="h-4 w-4 text-slate-300" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Bug Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Report New Bug" subtitle="Provide details about the issue you've found." size="lg">
        <form className="flex flex-col gap-4">
          <Input label="Bug Title" placeholder="Describe the issue briefly..." />
          <Textarea label="Description" placeholder="Steps to reproduce, expected vs actual behavior..." />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Severity</label>
              <select className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm outline-none">
                <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Priority</label>
              <select className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm outline-none">
                <option>Urgent</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Project" placeholder="Select project..." />
            <Input label="Module" placeholder="e.g., Authentication" />
          </div>
          <Input label="Assigned Developer" placeholder="Select team member..." />
          <Input label="Due Date" type="date" />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Screenshots</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center">
              <p className="text-xs text-slate-400">Drag & drop screenshots here, or click to browse</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" leftIcon={<BugIcon className="h-4 w-4" />}>Submit Bug Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
