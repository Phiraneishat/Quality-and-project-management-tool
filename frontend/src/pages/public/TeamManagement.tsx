import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldAlert, Sparkles, Activity, CheckCircle, BarChart3 } from 'lucide-react';

interface StaffWorkload {
  name: string;
  role: string;
  avatarText: string;
  activeTasks: number;
  activeBugs: number;
  capacityLimit: number; // e.g. 10 max
}

export const TeamManagement: React.FC = () => {
  const [staff, setStaff] = useState<StaffWorkload[]>([
    { name: 'Alex Thompson', role: 'VP Engineering', avatarText: 'AT', activeTasks: 3, activeBugs: 1, capacityLimit: 10 },
    { name: 'Priya Sharma', role: 'QA Automation Lead', avatarText: 'PS', activeTasks: 6, activeBugs: 2, capacityLimit: 10 },
    { name: 'Marcus Johnson', role: 'CTO & Co-Founder', avatarText: 'MJ', activeTasks: 2, activeBugs: 0, capacityLimit: 8 },
    { name: 'Sarah Jenkins', role: 'Lead UI/UX Designer', avatarText: 'SJ', activeTasks: 4, activeBugs: 1, capacityLimit: 8 },
    { name: 'David Kim', role: 'Head of Product', avatarText: 'DK', activeTasks: 1, activeBugs: 0, capacityLimit: 6 },
  ]);

  const [selectedStaffIndex, setSelectedStaffIndex] = useState<number>(0);

  const activeMember = staff[selectedStaffIndex];
  const totalLoad = activeMember.activeTasks + activeMember.activeBugs;
  const loadPercentage = Math.min((totalLoad / activeMember.capacityLimit) * 100, 100);

  const simulateAssignTask = () => {
    setStaff((prev) =>
      prev.map((s, idx) =>
        idx === selectedStaffIndex && s.activeTasks < s.capacityLimit
          ? { ...s, activeTasks: s.activeTasks + 1 }
          : s
      )
    );
  };

  const simulateResolveTask = () => {
    setStaff((prev) =>
      prev.map((s, idx) =>
        idx === selectedStaffIndex && s.activeTasks > 0
          ? { ...s, activeTasks: s.activeTasks - 1 }
          : s
      )
    );
  };

  const getCapacityColor = (pct: number) => {
    if (pct >= 85) return 'text-red-500 stroke-red-500';
    if (pct >= 60) return 'text-amber-500 stroke-amber-500';
    return 'text-emerald-500 stroke-emerald-500';
  };

  return (
    <div className="min-h-screen pt-16 grid-bg">
      {/* ── Title Hero Section ── */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] animate-orb-1" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-orb-2" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-wider mb-6 border border-primary-500/20"
          >
            <Users className="h-3.5 w-3.5" /> Team Workspace
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white leading-tight tracking-tight">
            Workload & <span className="text-gradient-primary">Capacity Allocation</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-655 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Avoid developer fatigue. Track active task loads, filter by skillset departments, balance assignees, and optimize velocity cycles transparently.
          </p>
        </div>
      </section>

      {/* ── Interactive Workload Planner Layout ── */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch text-left">
          
          {/* Left Column: Staff Directory Selector */}
          <div className="w-full lg:w-5/12 bg-white/80 dark:bg-surface-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-black font-display text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary-500" /> Team Availability Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-405 mb-6 leading-relaxed">
                Select a developer or designer below to review their active sprint allocation indices.
              </p>

              {/* Staff Cards List */}
              <div className="space-y-2">
                {staff.map((member, idx) => {
                  const isActive = idx === selectedStaffIndex;
                  const pct = ((member.activeTasks + member.activeBugs) / member.capacityLimit) * 100;
                  
                  return (
                    <button
                      key={member.name}
                      onClick={() => setSelectedStaffIndex(idx)}
                      className={`w-full p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer text-left ${
                        isActive
                          ? 'bg-white dark:bg-surface-800 border-primary-500/30 dark:border-primary-500/20 shadow-md shadow-primary-500/5'
                          : 'bg-transparent border-transparent hover:bg-slate-100/50 dark:hover:bg-surface-800/30'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                        {member.avatarText}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-xs sm:text-sm font-bold font-display ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-850 dark:text-slate-200'}`}>
                          {member.name}
                        </h3>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">{member.role}</p>
                      </div>

                      {/* Workload Indicator Pill */}
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                        pct >= 85 ? 'bg-red-500/10 text-red-500' : pct >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {member.activeTasks + member.activeBugs} / {member.capacityLimit} Tickets
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-105 dark:border-slate-850 flex items-center gap-2 text-[10px] text-slate-400">
              <Activity className="h-4 w-4 text-primary-500 shrink-0" />
              <span>Click a member to simulate task updates.</span>
            </div>
          </div>

          {/* Right Column: Dynamic Load Capacity Ring */}
          <div className="w-full lg:w-7/12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-950 p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <div className="absolute inset-0 grid-bg opacity-30" />

            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary-500 animate-spin-slow" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-250 uppercase font-mono tracking-tight">Staff Capacity Analyzer</span>
                  </div>
                  <span className="text-[10px] bg-primary-500 text-white px-2.5 py-0.5 rounded-full font-black uppercase">
                    Load Ratio
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 bg-white/70 dark:bg-surface-900/50 rounded-2xl border border-slate-200/20 p-6 shadow-inner">
                  
                  {/* Custom Progress SVG Ring */}
                  <div className="w-28 h-28 relative shrink-0">
                    <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                      {/* Gray Ring track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="rgba(148, 163, 184, 0.1)"
                        strokeWidth="8"
                      />
                      {/* Active Colored Ring path */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeWidth="8"
                        strokeDasharray={251.2}
                        animate={{ strokeDashoffset: 251.2 - (251.2 * loadPercentage) / 100 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        className={`${getCapacityColor(loadPercentage)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-800 dark:text-white">{loadPercentage.toFixed(0)}%</span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Capacity</span>
                    </div>
                  </div>

                  {/* Allocation Details */}
                  <div className="flex-1 text-center sm:text-left space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-850 dark:text-white font-display">
                        Sprint load details: {activeMember.name}
                      </h3>
                      <p className="text-xs text-slate-450 mt-1">{activeMember.role}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-surface-950/40 rounded-xl border border-slate-200/40 text-left">
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Active Tasks</p>
                        <p className="text-sm font-black mt-0.5 text-slate-700 dark:text-slate-250">{activeMember.activeTasks}</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-surface-950/40 rounded-xl border border-slate-200/40 text-left">
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Active Bugs</p>
                        <p className="text-sm font-black mt-0.5 text-slate-700 dark:text-slate-250">{activeMember.activeBugs}</p>
                      </div>
                    </div>

                    {/* Simulation Buttons */}
                    <div className="flex justify-center sm:justify-start gap-2 pt-1">
                      <button
                        onClick={simulateAssignTask}
                        disabled={activeMember.activeTasks >= activeMember.capacityLimit}
                        className="py-2 px-3.5 bg-primary-500 hover:bg-primary-600 text-white font-bold text-[10px] rounded-lg shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Assign Task
                      </button>
                      <button
                        onClick={simulateResolveTask}
                        disabled={activeMember.activeTasks <= 0}
                        className="py-2 px-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-205 dark:border-slate-800 font-bold text-[10px] rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Complete Task
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              <div className="h-4" />
            </div>

          </div>

        </div>
      </section>

      {/* ── Feature Highlights Grid ── */}
      <section className="py-20 bg-white/40 dark:bg-surface-900/40 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { icon: Users, title: 'Workload Balancer', desc: 'Flags assignees with critical workloads before scheduling tasks or closing sprint points.' },
              { icon: ShieldAlert, title: 'Capability Metrics', desc: 'Assess group capabilities across development branches (Automation, APIs, Frontend UX) in seconds.' },
              { icon: BarChart3, title: 'Burndown Insight', desc: 'Correlate individual developers load metrics to team sprint velocities to deliver software faster.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 bg-white dark:bg-surface-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl shadow-sm">
                  <div className="p-2 bg-primary-500/10 rounded-xl text-primary-500 inline-block">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold font-display text-slate-850 dark:text-white mt-4">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
