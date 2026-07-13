import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid3X3, List, FolderKanban, Calendar, Users, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge, StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Avatar, AvatarGroup } from '../../components/ui/Avatar';
import { ProgressBar } from '../../components/ui/Shared';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router-dom';

const mockProjects = [
  { id: '1', name: 'E-Commerce Platform v3', desc: 'Full redesign of the shopping experience with AI recommendations.', status: 'Development', priority: 'High', progress: 68, team: ['Alice', 'Bob', 'Charlie', 'Diana'], dueDate: '2026-08-15', tags: ['React', 'Node.js'], risk: 'Medium' },
  { id: '2', name: 'Mobile Banking App', desc: 'Secure mobile banking application with biometric auth.', status: 'Testing', priority: 'Critical', progress: 85, team: ['Eve', 'Grace'], dueDate: '2026-07-30', tags: ['React Native', 'Firebase'], risk: 'Low' },
  { id: '3', name: 'HR Management System', desc: 'Employee management, payroll, and leave tracking solution.', status: 'Planning', priority: 'Medium', progress: 15, team: ['Henry', 'Ivy'], dueDate: '2026-09-30', tags: ['Angular', 'PostgreSQL'], risk: 'High' },
  { id: '4', name: 'QualityDesk Analytics', desc: 'Advanced analytics dashboard for quality metrics visualization.', status: 'Design', priority: 'High', progress: 35, team: ['Jack', 'Kate', 'Leo', 'Mia', 'Noah'], dueDate: '2026-08-01', tags: ['React', 'D3.js'], risk: 'Low' },
  { id: '5', name: 'CI/CD Pipeline Upgrade', desc: 'Modernize build pipeline with parallel testing and auto-deploy.', status: 'Review', priority: 'Medium', progress: 92, team: ['Olivia', 'Peter'], dueDate: '2026-07-20', tags: ['Docker', 'Jenkins'], risk: 'Low' },
  { id: '6', name: 'Customer Portal', desc: 'Self-service portal for customers with ticket management.', status: 'Completed', priority: 'Low', progress: 100, team: ['Quinn', 'Rachel', 'Sam'], dueDate: '2026-06-30', tags: ['Next.js', 'MongoDB'], risk: 'Low' },
];

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'list' | 'timeline'>('grid');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = mockProjects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track all your active projects.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-5 w-5" />} onClick={() => navigate('/app/projects/new')}>
          New Project
        </Button>
      </div>

      {/* Filters Bar */}
      <Card padding="sm" className="flex flex-wrap items-center gap-3 !p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Filter className="h-4 w-4" />}>Filters</Button>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => setView('grid')}
            className={`p-2 ${view === 'grid' ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-500' : 'text-slate-400 hover:text-slate-600'} cursor-pointer transition-colors`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 ${view === 'list' ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-500' : 'text-slate-400 hover:text-slate-600'} cursor-pointer transition-colors`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`p-2 ${view === 'timeline' ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-500' : 'text-slate-400 hover:text-slate-600'} cursor-pointer transition-colors`}
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </Card>

      {/* Projects Grid / List / Timeline */}
      {view === 'timeline' ? (
        <Card className="overflow-x-auto">
          <div className="min-w-[800px] space-y-6">
            {/* Timeline Header Row (Days/Weeks grid) */}
            <div className="grid grid-cols-12 gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <div className="col-span-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-left">Project Title</div>
              <div className="col-span-9 grid grid-cols-5 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div>Week 1</div>
                <div>Week 2</div>
                <div>Week 3</div>
                <div>Week 4</div>
                <div>Week 5</div>
              </div>
            </div>

            {/* Timeline Taskbars */}
            <div className="space-y-4">
              {filtered.map((project, idx) => {
                const barColors = [
                  'from-indigo-500 to-indigo-600 shadow-indigo-500/20',
                  'from-cyan-500 to-cyan-600 shadow-cyan-500/20',
                  'from-amber-500 to-amber-600 shadow-amber-500/20',
                  'from-primary-500 to-primary-600 shadow-primary-500/20',
                  'from-emerald-500 to-emerald-600 shadow-emerald-500/20',
                  'from-rose-500 to-rose-600 shadow-rose-500/20',
                ];
                
                const colOffsets = [
                  'col-start-1 col-span-3',
                  'col-start-2 col-span-3',
                  'col-start-3 col-span-2',
                  'col-start-1 col-span-4',
                  'col-start-2 col-span-4',
                  'col-start-4 col-span-2',
                ];

                const barColor = barColors[idx % barColors.length];
                const gridPlacement = colOffsets[idx % colOffsets.length];

                return (
                  <div key={project.id} className="grid grid-cols-12 gap-2 items-center">
                    {/* Project Label */}
                    <div className="col-span-3 flex items-center gap-2.5 text-left">
                      <div className="h-2 w-2 rounded-full bg-primary-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{project.name}</span>
                        <span className="text-[9px] text-slate-400 font-semibold">{project.status}</span>
                      </div>
                    </div>

                    {/* Timeline Track Grid */}
                    <div className="col-span-9 grid grid-cols-5 relative h-9 bg-slate-50/50 dark:bg-surface-900/30 rounded-lg border border-slate-100/50 dark:border-slate-800/50">
                      {/* Interactive Gantt Bar */}
                      <div className={`${gridPlacement} h-full py-1`}>
                        <div className={`h-full rounded-md bg-gradient-to-r ${barColor} flex items-center justify-between px-3 text-[10px] text-white font-bold shadow-md`}>
                          <span>{project.progress}% Complete</span>
                          <span>Due: {project.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      ) : (
        <div className={view === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-3'}>
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover className="flex flex-col h-full">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FolderKanban className="h-4 w-4 text-primary-500" />
                      <StatusBadge status={project.status} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">{project.name}</h3>
                  </div>
                  <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{project.desc}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
                  ))}
                  <Badge variant={project.risk === 'High' ? 'danger' : project.risk === 'Medium' ? 'warning' : 'success'} size="sm">
                    {project.risk} Risk
                  </Badge>
                  <PriorityBadge priority={project.priority} />
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-400 font-medium">Progress</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} color={project.progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'} size="md" showLabel={false} />

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <AvatarGroup users={project.team.map((n) => ({ name: n }))} max={3} size="xs" />
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {project.dueDate}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Project" subtitle="Set up a new project with team and timeline.">
        <form className="flex flex-col gap-4">
          <Input label="Project Name" placeholder="e.g., Mobile App Redesign" />
          <Input label="Description" placeholder="Brief project description..." />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Priority</label>
              <select className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm outline-none">
                <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Risk Level</label>
              <select className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm outline-none">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="End Date" type="date" />
          </div>
          <Input label="Budget ($)" type="number" placeholder="50000" />
          <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Create Project</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
