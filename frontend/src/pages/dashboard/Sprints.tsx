import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Plus, Calendar, Target, CheckCircle, Clock, ListTodo,
  X, Users, Flag, Layers, ChevronRight, Check, AlertCircle,
  Sparkles, Hash, ArrowRight, Info, BarChart3, Gauge
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/Shared';
import { Avatar, AvatarGroup } from '../../components/ui/Avatar';
import { Input, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

/* ─────────────── Data ─────────────── */

const sprints = [
  {
    id: '1', name: 'Sprint Alpha v2.4', goal: 'Complete user auth and dashboard modules',
    status: 'Active', startDate: '2026-07-01', endDate: '2026-07-14',
    progress: 62, tasks: { total: 24, done: 15, inProgress: 6, todo: 3 },
    velocity: 34, team: ['Alice', 'Bob', 'Charlie', 'Diana'],
  },
  {
    id: '2', name: 'Sprint Alpha v2.3', goal: 'Bug fixes and quality improvements',
    status: 'Completed', startDate: '2026-06-17', endDate: '2026-06-30',
    progress: 100, tasks: { total: 28, done: 28, inProgress: 0, todo: 0 },
    velocity: 38, team: ['Eve', 'Frank', 'Grace'],
  },
  {
    id: '3', name: 'Sprint Beta v1.0', goal: 'Mobile responsive layout and testing',
    status: 'Planning', startDate: '2026-07-15', endDate: '2026-07-28',
    progress: 0, tasks: { total: 20, done: 0, inProgress: 0, todo: 20 },
    velocity: 0, team: ['Henry', 'Ivy', 'Jack'],
  },
];

const burndownData = [
  { day: 'D1', ideal: 24, actual: 24 }, { day: 'D2', ideal: 21, actual: 23 },
  { day: 'D3', ideal: 19, actual: 21 }, { day: 'D4', ideal: 17, actual: 18 },
  { day: 'D5', ideal: 14, actual: 16 }, { day: 'D6', ideal: 12, actual: 13 },
  { day: 'D7', ideal: 10, actual: 11 }, { day: 'D8', ideal: 7, actual: 9 },
];

const velocityData = [
  { sprint: 'v2.0', velocity: 28 }, { sprint: 'v2.1', velocity: 32 },
  { sprint: 'v2.2', velocity: 30 }, { sprint: 'v2.3', velocity: 38 },
  { sprint: 'v2.4', velocity: 34 },
];

/* ─────────── New Sprint Modal Data ─────────── */

const ALL_MEMBERS = [
  { id: 'u1', name: 'Alice Martin', role: 'Frontend Dev', color: 'bg-violet-500' },
  { id: 'u2', name: 'Bob Chen', role: 'Backend Dev', color: 'bg-blue-500' },
  { id: 'u3', name: 'Charlie Ross', role: 'QA Engineer', color: 'bg-emerald-500' },
  { id: 'u4', name: 'Diana Cruz', role: 'UI/UX Designer', color: 'bg-pink-500' },
  { id: 'u5', name: 'Eve Johnson', role: 'DevOps', color: 'bg-amber-500' },
  { id: 'u6', name: 'Frank Lee', role: 'Full Stack Dev', color: 'bg-cyan-500' },
];

const BACKLOG_TASKS = [
  { id: 't1', title: 'Implement OAuth2 login flow', type: 'Feature', points: 5 },
  { id: 't2', title: 'Fix regression in report export', type: 'Bug', points: 3 },
  { id: 't3', title: 'Dashboard performance audit', type: 'Task', points: 8 },
  { id: 't4', title: 'Refactor sprint API endpoints', type: 'Task', points: 5 },
  { id: 't5', title: 'Write E2E tests for auth module', type: 'Test', points: 3 },
  { id: 't6', title: 'Design new notification panel', type: 'Feature', points: 5 },
  { id: 't7', title: 'Integrate Slack webhooks', type: 'Feature', points: 8 },
  { id: 't8', title: 'Database index optimisation', type: 'Task', points: 2 },
];

const TASK_TYPE_COLORS: Record<string, string> = {
  Feature: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
  Bug: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  Task: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Test: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

const STEPS = ['Details', 'Team', 'Backlog', 'Review'];

/* ─────────────── New Sprint Modal ─────────────── */

interface NewSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (sprint: typeof sprints[0]) => void;
}

const NewSprintModal: React.FC<NewSprintModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [step, setStep] = useState(0);

  // Step 1 — Details
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [capacity, setCapacity] = useState(40);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2 — Team
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Step 3 — Backlog
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const totalPoints = BACKLOG_TASKS
    .filter(t => selectedTasks.includes(t.id))
    .reduce((acc, t) => acc + t.points, 0);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Sprint name is required';
    if (!goal.trim()) e.goal = 'Sprint goal is required';
    if (!startDate) e.startDate = 'Start date is required';
    if (!endDate) e.endDate = 'End date is required';
    if (startDate && endDate && endDate <= startDate) e.endDate = 'End date must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step < 3) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleCreate = () => {
    const newSprint = {
      id: String(Date.now()),
      name: name.trim(),
      goal: goal.trim(),
      status: 'Planning' as const,
      startDate,
      endDate,
      progress: 0,
      tasks: { total: selectedTasks.length, done: 0, inProgress: 0, todo: selectedTasks.length },
      velocity: 0,
      team: ALL_MEMBERS.filter(m => selectedMembers.includes(m.id)).map(m => m.name),
    };
    onCreated(newSprint);
    handleReset();
  };

  const handleReset = () => {
    setStep(0); setName(''); setGoal(''); setStartDate(''); setEndDate('');
    setPriority('Medium'); setCapacity(40); setSelectedMembers([]); setSelectedTasks([]);
    setErrors({});
    onClose();
  };

  const toggleMember = (id: string) =>
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleTask = (id: string) =>
    setSelectedTasks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const PRIORITY_COLORS = {
    Low: 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    Medium: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    High: 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400',
    Critical: 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleReset}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            className="relative w-full max-w-3xl bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh]"
          >
            {/* Gradient bar at top */}
            <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 shrink-0" />

            {/* Header */}
            <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20">
                  <Zap className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black font-display text-slate-900 dark:text-white">Create New Sprint</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Fill in the details to kickstart your next sprint cycle</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-0 px-7 py-4 bg-slate-50/50 dark:bg-surface-950/30 border-b border-slate-100 dark:border-slate-800 shrink-0">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <button
                    onClick={() => { if (i < step) setStep(i); }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      i === step
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10'
                        : i < step
                        ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 cursor-pointer'
                        : 'text-slate-400 cursor-default'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      i < step
                        ? 'bg-emerald-500 text-white'
                        : i === step
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {i < step ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    {s}
                  </button>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 mx-1 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-7 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* ── STEP 1: Details ── */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Input
                            label="Sprint Name"
                            placeholder="e.g. Sprint Alpha v2.5"
                            value={name}
                            onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                            error={errors.name}
                            icon={<Hash className="h-4 w-4" />}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Textarea
                            label="Sprint Goal"
                            placeholder="What does your team aim to achieve this sprint?"
                            value={goal}
                            onChange={e => { setGoal(e.target.value); setErrors(prev => ({ ...prev, goal: '' })); }}
                            error={errors.goal}
                          />
                        </div>
                        <div>
                          <Input
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={e => { setStartDate(e.target.value); setErrors(prev => ({ ...prev, startDate: '' })); }}
                            error={errors.startDate}
                            icon={<Calendar className="h-4 w-4" />}
                          />
                        </div>
                        <div>
                          <Input
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={e => { setEndDate(e.target.value); setErrors(prev => ({ ...prev, endDate: '' })); }}
                            error={errors.endDate}
                            icon={<Calendar className="h-4 w-4" />}
                          />
                        </div>
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Sprint Priority
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {(['Low', 'Medium', 'High', 'Critical'] as const).map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPriority(p)}
                              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                priority === p
                                  ? PRIORITY_COLORS[p]
                                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              <Flag className="h-3.5 w-3.5 mx-auto mb-1" />
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Capacity */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                            Team Capacity
                          </label>
                          <span className="text-sm font-black text-primary-500">{capacity} pts</span>
                        </div>
                        <input
                          type="range"
                          min={10} max={100} step={5}
                          value={capacity}
                          onChange={e => setCapacity(Number(e.target.value))}
                          className="w-full h-2 rounded-full accent-primary-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>10 pts</span><span>55 pts</span><span>100 pts</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 2: Team ── */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Select team members for this sprint</p>
                        <span className="text-xs font-bold text-primary-500 bg-primary-500/10 px-2.5 py-1 rounded-full">
                          {selectedMembers.length} selected
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {ALL_MEMBERS.map(member => {
                          const isSelected = selectedMembers.includes(member.id);
                          return (
                            <motion.button
                              key={member.id}
                              type="button"
                              onClick={() => toggleMember(member.id)}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-primary-500/40 bg-primary-500/5 dark:bg-primary-500/10'
                                  : 'border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              <div className={`w-9 h-9 rounded-full ${member.color} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{member.name}</p>
                                <p className="text-[10px] text-slate-400">{member.role}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                isSelected
                                  ? 'border-primary-500 bg-primary-500'
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}>
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                      {selectedMembers.length === 0 && (
                        <div className="flex items-center gap-2 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                          <Info className="h-4 w-4 text-amber-500 shrink-0" />
                          <p className="text-xs text-amber-600 dark:text-amber-400">No team members selected. You can add them later from sprint settings.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── STEP 3: Backlog ── */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Pick tasks from the product backlog</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{totalPoints} / {capacity} pts</span>
                          <div className="w-24 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${totalPoints > capacity ? 'bg-red-500' : 'bg-primary-500'}`}
                              style={{ width: `${Math.min((totalPoints / capacity) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {totalPoints > capacity && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/5 border border-red-500/15 rounded-xl">
                          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                          <p className="text-xs text-red-600 dark:text-red-400">Selected tasks exceed team capacity by {totalPoints - capacity} points.</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        {BACKLOG_TASKS.map(task => {
                          const isSelected = selectedTasks.includes(task.id);
                          return (
                            <motion.button
                              key={task.id}
                              type="button"
                              onClick={() => toggleTask(task.id)}
                              whileHover={{ x: 2 }}
                              className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-primary-500/40 bg-primary-500/5 dark:bg-primary-500/10'
                                  : 'border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                isSelected
                                  ? 'border-primary-500 bg-primary-500'
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}>
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${TASK_TYPE_COLORS[task.type]}`}>
                                {task.type}
                              </span>
                              <span className="text-xs font-black text-slate-400 w-8 text-right shrink-0">{task.points}pt</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── STEP 4: Review ── */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500/8 to-purple-500/5 border border-primary-500/15">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-4.5 w-4.5 text-primary-500" />
                          <h3 className="text-sm font-black text-slate-900 dark:text-white">Sprint Summary</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { label: 'Sprint Name', value: name || '—', icon: Hash },
                            { label: 'Goal', value: goal || '—', icon: Target },
                            { label: 'Start Date', value: startDate || '—', icon: Calendar },
                            { label: 'End Date', value: endDate || '—', icon: Calendar },
                            { label: 'Priority', value: priority, icon: Flag },
                            { label: 'Capacity', value: `${capacity} pts`, icon: Gauge },
                          ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="flex items-start gap-2.5">
                              <Icon className="h-3.5 w-3.5 text-primary-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</p>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-2">{value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Team */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-4 w-4 text-slate-400" />
                          <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
                            Team ({selectedMembers.length})
                          </p>
                        </div>
                        {selectedMembers.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {ALL_MEMBERS.filter(m => selectedMembers.includes(m.id)).map(m => (
                              <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                                <div className={`w-4 h-4 rounded-full ${m.color} flex items-center justify-center text-white text-[8px] font-black`}>
                                  {m.name[0]}
                                </div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{m.name}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No members selected</p>
                        )}
                      </div>

                      {/* Tasks */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-slate-400" />
                            <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
                              Backlog Tasks ({selectedTasks.length})
                            </p>
                          </div>
                          <span className={`text-xs font-bold ${totalPoints > capacity ? 'text-red-500' : 'text-emerald-500'}`}>
                            {totalPoints} / {capacity} pts
                          </span>
                        </div>
                        {selectedTasks.length > 0 ? (
                          <div className="space-y-1.5">
                            {BACKLOG_TASKS.filter(t => selectedTasks.includes(t.id)).map(t => (
                              <div key={t.id} className="flex items-center gap-2.5 py-1.5">
                                <CheckCircle className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                                <span className="text-xs text-slate-700 dark:text-slate-300 flex-1">{t.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{t.points}pt</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No tasks selected — tasks can be added later</p>
                        )}
                      </div>

                      <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl flex items-center gap-2.5">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                          All looks good! Click <strong>Create Sprint</strong> to launch.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-7 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-950/30 shrink-0">
              <Button
                variant="ghost"
                onClick={step === 0 ? handleReset : handleBack}
                leftIcon={step === 0 ? <X className="h-4 w-4" /> : undefined}
              >
                {step === 0 ? 'Cancel' : '← Back'}
              </Button>
              <div className="flex items-center gap-3">
                {/* Step dots */}
                <div className="flex gap-1.5">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === step ? 'w-5 bg-primary-500' : i < step ? 'w-1.5 bg-emerald-400' : 'w-1.5 bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
                {step < 3 ? (
                  <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={handleNext}>
                    Next: {STEPS[step + 1]}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    leftIcon={<Zap className="h-4 w-4" />}
                    onClick={handleCreate}
                    className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600"
                  >
                    Create Sprint
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────── Main Page ─────────────── */

export const Sprints: React.FC = () => {
  const [showNewSprint, setShowNewSprint] = useState(false);
  const [sprintList, setSprintList] = useState(sprints);
  const [createdToast, setCreatedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'sprints' | 'retrospective'>('sprints');

  // Retrospective Notes State
  const [retroNotes, setRetroNotes] = useState<Array<{ id: string; category: 'well' | 'improve' | 'actions'; text: string; color: string; author: string }>>([
    { id: '1', category: 'well', text: 'Auth & Biometrics database hooks completed ahead of schedule!', color: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-400', author: 'Raj Patel' },
    { id: '2', category: 'well', text: 'Checkout simulator details interface is extremely clean and matches UPI specs.', color: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-400', author: 'Emma Wilson' },
    { id: '3', category: 'improve', text: 'Camera capture resolution defaults are slightly offset on narrow mobile screens.', color: 'bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-400', author: 'Charlie Brown' },
    { id: '4', category: 'actions', text: 'Configure strict database validations to restrict unseeded Face ID access.', color: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-700 dark:text-indigo-400', author: 'Alice Martin' }
  ]);

  const [newRetroText, setNewRetroText] = useState('');
  const [newRetroCat, setNewRetroCat] = useState<'well' | 'improve' | 'actions'>('well');

  const addRetroNote = () => {
    if (!newRetroText.trim()) return;
    const colors = {
      well: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-400',
      improve: 'bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-400',
      actions: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-700 dark:text-indigo-400'
    };
    
    setRetroNotes(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        category: newRetroCat,
        text: newRetroText,
        color: colors[newRetroCat],
        author: 'Phira Admin'
      }
    ]);
    setNewRetroText('');
  };

  const removeRetroNote = (id: string) => {
    setRetroNotes(prev => prev.filter(x => x.id !== id));
  };

  const handleCreated = (sprint: typeof sprints[0]) => {
    setSprintList(prev => [sprint, ...prev]);
    setCreatedToast(true);
    setTimeout(() => setCreatedToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Sprint Management</h1>
          <p className="text-sm text-slate-500 mt-1">Plan, execute, and review agile sprints.</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={() => setShowNewSprint(true)}
        >
          New Sprint
        </Button>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {createdToast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
          >
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              🚀 Sprint created successfully and added to the list!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('sprints')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'sprints'
              ? 'border-primary-500 text-primary-500 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-655 dark:hover:text-slate-300'
          }`}
        >
          Sprints Dashboard
        </button>
        <button
          onClick={() => setActiveTab('retrospective')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'retrospective'
              ? 'border-primary-500 text-primary-500 font-black'
              : 'border-transparent text-slate-400 hover:text-slate-655 dark:hover:text-slate-300'
          }`}
        >
          Sprint Retrospective Sticky Board
        </button>
      </div>

      {/* Conditional Active Tab Contents */}
      {activeTab === 'retrospective' ? (
        <div className="space-y-6">
          {/* Add note card */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4.5 w-4.5 text-primary-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Add Retrospective Sticky Note</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="What did you observe during this sprint?..."
                value={newRetroText}
                onChange={e => setNewRetroText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
              />
              <div className="flex gap-2">
                <select
                  value={newRetroCat}
                  onChange={e => setNewRetroCat(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-705 dark:text-slate-300 outline-none cursor-pointer font-bold"
                >
                  <option value="well">What Went Well</option>
                  <option value="improve">What Needs Improvement</option>
                  <option value="actions">Action Item</option>
                </select>
                <Button variant="primary" onClick={addRetroNote} leftIcon={<Plus className="h-4 w-4" />}>
                  Post Note
                </Button>
              </div>
            </div>
          </Card>

          {/* Sticky Columns Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* What Went Well */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle className="h-4.5 w-4.5" /> What Went Well
              </div>
              <div className="space-y-3">
                {retroNotes.filter(n => n.category === 'well').map(n => (
                  <Card key={n.id} className={`${n.color} relative group text-left`}>
                    <button
                      onClick={() => removeRetroNote(n.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <p className="text-xs leading-relaxed pr-4 text-left">{n.text}</p>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/45 text-[9px] text-slate-400 font-bold">
                      <span>Posted by {n.author}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* What Needs Improvement */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-600 dark:text-amber-400 font-bold text-sm">
                <AlertCircle className="h-4.5 w-4.5" /> What Needs Improvement
              </div>
              <div className="space-y-3">
                {retroNotes.filter(n => n.category === 'improve').map(n => (
                  <Card key={n.id} className={`${n.color} relative group text-left`}>
                    <button
                      onClick={() => removeRetroNote(n.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <p className="text-xs leading-relaxed pr-4 text-left">{n.text}</p>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/45 text-[9px] text-slate-400 font-bold">
                      <span>Posted by {n.author}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <Target className="h-4.5 w-4.5" /> Action Items
              </div>
              <div className="space-y-3">
                {retroNotes.filter(n => n.category === 'actions').map(n => (
                  <Card key={n.id} className={`${n.color} relative group text-left`}>
                    <button
                      onClick={() => removeRetroNote(n.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <p className="text-xs leading-relaxed pr-4 text-left">{n.text}</p>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/45 text-[9px] text-slate-400 font-bold">
                      <span>Posted by {n.author}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sprintList.map((sprint, i) => (
            <motion.div
              key={sprint.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card hover className="relative overflow-hidden">
                {sprint.status === 'Active' && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-purple-500" />
                )}
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-primary-500" />
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{sprint.name}</h3>
                      <StatusBadge status={sprint.status} />
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{sprint.goal}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{sprint.startDate} → {sprint.endDate}</span>
                      <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" />Velocity: {sprint.velocity}</span>
                      <span className="flex items-center gap-1"><ListTodo className="h-3.5 w-3.5" />{sprint.tasks.total} tasks</span>
                    </div>
                  </div>
                  <div className="lg:w-64 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Progress</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{sprint.progress}%</span>
                    </div>
                    <ProgressBar
                      value={sprint.progress}
                      color={sprint.progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'}
                      size="md"
                      showLabel={false}
                    />
                    <div className="flex items-center justify-between mt-3 gap-2">
                      <div className="flex gap-2">
                        {[
                          { label: 'Done', value: sprint.tasks.done, color: 'text-emerald-500' },
                          { label: 'Active', value: sprint.tasks.inProgress, color: 'text-blue-500' },
                          { label: 'Todo', value: sprint.tasks.todo, color: 'text-slate-400' },
                        ].map(t => (
                          <span key={t.label} className={`text-[10px] font-bold ${t.color}`}>{t.value} {t.label}</span>
                        ))}
                      </div>
                      <AvatarGroup users={sprint.team.map(n => ({ name: n }))} max={3} size="xs" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Sprint Burndown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={burndownData}>
              <defs>
                <linearGradient id="burnActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeDasharray="8 4" strokeWidth={2} dot={false} name="Ideal" />
              <Area type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={2.5} fill="url(#burnActual)" dot={{ fill: '#6366f1', r: 4 }} name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Team Velocity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={velocityData}>
              <defs>
                <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Area type="monotone" dataKey="velocity" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#velGrad)" dot={{ fill: '#8b5cf6', r: 5, strokeWidth: 2, stroke: '#fff' }} name="Velocity" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* New Sprint Modal */}
      <NewSprintModal
        isOpen={showNewSprint}
        onClose={() => setShowNewSprint(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};
