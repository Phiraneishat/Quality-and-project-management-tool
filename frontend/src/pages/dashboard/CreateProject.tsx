import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FolderKanban, Calendar, Users, Plus, Check, DollarSign, Activity } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge, StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { AvatarGroup } from '../../components/ui/Avatar';
import { ProgressBar } from '../../components/ui/Shared';
import { Link, useNavigate } from 'react-router-dom';

interface TeamOption {
  name: string;
  avatarText: string;
}

const teamOptions: TeamOption[] = [
  { name: 'Alex Thompson', avatarText: 'AT' },
  { name: 'Priya Sharma', avatarText: 'PS' },
  { name: 'Marcus Johnson', avatarText: 'MJ' },
  { name: 'Sarah Jenkins', avatarText: 'SJ' },
  { name: 'David Kim', avatarText: 'DK' },
];

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [risk, setRisk] = useState<'High' | 'Medium' | 'Low'>('Low');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('50000');
  const [selectedTeam, setSelectedTeam] = useState<string[]>(['Alex Thompson']);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['React', 'Vite']);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const toggleTeamMember = (memberName: string) => {
    setSelectedTeam((prev) =>
      prev.includes(memberName)
        ? prev.filter((name) => name !== memberName)
        : [...prev, memberName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission and navigate back
    navigate('/app/projects');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Back button and Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/app/projects')}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-900 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Create New Project</h1>
          <p className="text-sm text-slate-500 mt-0.5">Define your project parameters, assign team members, and trace progress.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Panel: Form Settings */}
        <div className="w-full lg:w-7/12 bg-white dark:bg-surface-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Project Title
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. OAuth Single Sign-On Integration"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Brief Scope / Description
              </label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe project deliverables and milestones..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer font-bold"
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  Risk Level
                </label>
                <select
                  value={risk}
                  onChange={(e) => setRisk(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer font-bold"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 font-mono">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 font-mono">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  Budget Allocation
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Tag Creation Input */}
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  Project Tags (Press Enter)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="e.g. Node.js, Stripe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
                
                {/* Active Tags list */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleRemoveTag(tag)}
                      className="bg-primary-500/10 text-primary-500 px-2 py-0.5 rounded-lg text-[9px] font-bold border border-primary-500/20 flex items-center gap-1 cursor-pointer hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                    >
                      {tag} <span>×</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Selection List */}
            <div>
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                Assign Development Team
              </label>
              <div className="flex flex-wrap gap-2">
                {teamOptions.map((member) => {
                  const isChecked = selectedTeam.includes(member.name);
                  return (
                    <button
                      key={member.name}
                      type="button"
                      onClick={() => toggleTeamMember(member.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/10'
                          : 'bg-slate-50 dark:bg-surface-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold">
                        {member.avatarText}
                      </span>
                      {member.name}
                      {isChecked && <Check className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" type="button" onClick={() => navigate('/app/projects')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" leftIcon={<Plus className="h-4 w-4" />}>
                Create Project
              </Button>
            </div>

          </form>
        </div>

        {/* Right Panel: Live Project Card Preview */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          <div className="bg-slate-50 dark:bg-surface-950/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between flex-1 relative overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
            
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-250 uppercase font-mono tracking-tight">Live Card Preview</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded font-black uppercase">
                    Planning
                  </span>
                </div>

                <Card className="flex flex-col h-full bg-white dark:bg-surface-900 shadow border border-slate-200/60 dark:border-slate-850 p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <FolderKanban className="h-4 w-4 text-primary-500" />
                        <StatusBadge status="Planning" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-display min-h-[24px]">
                        {name || <span className="text-slate-350 italic">Project Title Mockup</span>}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-4 min-h-[32px] line-clamp-2 text-left">
                    {desc || <span className="text-slate-350 italic">Scope and deliverables description...</span>}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4 text-left">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
                    ))}
                    <PriorityBadge priority={priority} />
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-400 font-medium">Progress</span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">0%</span>
                    </div>
                    <ProgressBar value={0} color="bg-primary-500" size="md" showLabel={false} />

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <AvatarGroup users={selectedTeam.map((n) => ({ name: n }))} max={3} size="xs" />
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <Calendar className="h-3 w-3" />
                        {endDate || 'YYYY-MM-DD'}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Extra Budget Insight Info */}
              <div className="mt-6 p-4 bg-white/70 dark:bg-surface-900 border border-slate-200/40 rounded-2xl text-left flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget Estimation</h4>
                  <p className="text-base font-black text-slate-850 dark:text-white mt-1 font-mono">${parseFloat(budget || '0').toLocaleString()}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
