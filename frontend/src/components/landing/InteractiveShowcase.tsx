import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, LayoutDashboard, Bug, FlaskConical, Users,
  CheckCircle, ArrowRight, Activity, RefreshCw, Layers
} from 'lucide-react';

type TabType = 'overview' | 'kanban' | 'quality';

interface KanbanTask {
  id: number;
  title: string;
  column: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export const InteractiveShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // ── 3D Tilt & Shine Effect States ──
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    // Calculate rotation (-6 to 6 degrees max for subtle elegant motion)
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTilt({ x: rotateX, y: rotateY });
    setShine({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setShine(prev => ({ ...prev, opacity: 0 }));
  };
  
  // ── Overview Simulator States ──
  const [simStep, setSimStep] = useState(0);
  const [stats, setStats] = useState({ projects: 24, tasks: 186, bugs: 12, quality: 94 });
  const [tasksList, setTasksList] = useState([
    { id: 1, name: 'Implement auth module', status: 'In Progress', color: 'bg-blue-500' },
    { id: 2, name: 'Fix login validation bug', status: 'Testing', color: 'bg-purple-500' },
    { id: 3, name: 'Design dashboard UI', status: 'Completed', color: 'bg-emerald-500' },
  ]);
  const [simNotification, setSimNotification] = useState<string | null>(null);

  // ── Sprint Kanban States ──
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>([
    { id: 101, title: 'Database schema migration', column: 'todo', priority: 'high' },
    { id: 102, title: 'Integrate Stripe gateway', column: 'progress', priority: 'high' },
    { id: 103, title: 'Write integration tests', column: 'todo', priority: 'medium' },
    { id: 104, title: 'Export reports to CSV', column: 'done', priority: 'low' },
  ]);
  const [kanbanCompletedCount, setKanbanCompletedCount] = useState(0);

  // ── Quality Analytics Hover States ──
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; date: string } | null>(null);

  // ── Overview Simulation Cycle ──
  useEffect(() => {
    if (activeTab !== 'overview') return;

    const interval = setInterval(() => {
      setSimStep((prev) => {
        const next = (prev + 1) % 4;
        
        if (next === 0) {
          // Reset
          setStats({ projects: 24, tasks: 186, bugs: 12, quality: 94 });
          setTasksList([
            { id: 1, name: 'Implement auth module', status: 'In Progress', color: 'bg-blue-500' },
            { id: 2, name: 'Fix login validation bug', status: 'Testing', color: 'bg-purple-500' },
            { id: 3, name: 'Design dashboard UI', status: 'Completed', color: 'bg-emerald-500' },
          ]);
          setSimNotification(null);
        } else if (next === 1) {
          // Fix bug completed
          setTasksList([
            { id: 1, name: 'Implement auth module', status: 'In Progress', color: 'bg-blue-500' },
            { id: 2, name: 'Fix login validation bug', status: 'Completed', color: 'bg-emerald-500' },
            { id: 3, name: 'Design dashboard UI', status: 'Completed', color: 'bg-emerald-500' },
          ]);
          setStats((prevStats) => ({
            ...prevStats,
            tasks: prevStats.tasks + 1,
            bugs: prevStats.bugs - 1,
            quality: 96,
          }));
          showNotification('✨ Priya Sharma resolved "Fix login validation bug"');
        } else if (next === 2) {
          // Implement auth goes to testing
          setTasksList([
            { id: 1, name: 'Implement auth module', status: 'Testing', color: 'bg-purple-500' },
            { id: 2, name: 'Fix login validation bug', status: 'Completed', color: 'bg-emerald-500' },
            { id: 3, name: 'Design dashboard UI', status: 'Completed', color: 'bg-emerald-500' },
          ]);
          setStats((prevStats) => ({ ...prevStats, quality: 97 }));
          showNotification('🚀 Auth module pushed to staging for test suite execution');
        } else if (next === 3) {
          // New issue reported
          setTasksList([
            { id: 4, name: 'Optimize image upload API', status: 'To Do', color: 'bg-slate-400' },
            { id: 1, name: 'Implement auth module', status: 'Testing', color: 'bg-purple-500' },
            { id: 2, name: 'Fix login validation bug', status: 'Completed', color: 'bg-emerald-500' },
          ]);
          setStats((prevStats) => ({
            ...prevStats,
            bugs: prevStats.bugs + 1,
            quality: 95,
          }));
          showNotification('⚠️ Lighthouse performance alert on home route');
        }

        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [activeTab]);

  const showNotification = (msg: string) => {
    setSimNotification(msg);
    setTimeout(() => {
      setSimNotification((curr) => (curr === msg ? null : curr));
    }, 3800);
  };

  // Move Kanban task forward
  const advanceKanbanTask = (taskId: number) => {
    setKanbanTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        let nextCol: 'todo' | 'progress' | 'done' = t.column;
        if (t.column === 'todo') nextCol = 'progress';
        else if (t.column === 'progress') {
          nextCol = 'done';
          setKanbanCompletedCount((c) => c + 1);
        } else nextCol = 'todo';
        return { ...t, column: nextCol };
      })
    );
  };

  // SVG Chart Data Points (Quality Analytics)
  const chartData = [
    { x: 40, y: 130, val: 82, date: 'Jun 28' },
    { x: 100, y: 110, val: 86, date: 'Jun 30' },
    { x: 160, y: 120, val: 84, date: 'Jul 02' },
    { x: 220, y: 80, val: 91, date: 'Jul 04' },
    { x: 280, y: 65, val: 94, date: 'Jul 06' },
  ];

  return (
    <div className="w-full relative select-none">
      {/* Glow Effect behind the Dashboard Window */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-purple-500/15 rounded-3xl blur-2xl -z-10" />

      {/* Mockup Dashboard Window Container */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`,
          transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out',
        }}
        className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-surface-900/90 shadow-2xl backdrop-blur-xl overflow-hidden relative group"
      >
        {/* Shine glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
          style={{
            opacity: shine.opacity,
            background: `radial-gradient(circle 200px at ${shine.x}px ${shine.y}px, rgba(255, 255, 255, 0.12), transparent 80%)`,
          }}
        />
        
        {/* macOS Style Window Title Bar */}
        <div className="h-12 bg-slate-50 dark:bg-surface-950/60 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-red-400/90 hover:bg-red-500 transition-colors cursor-pointer" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400/90 hover:bg-amber-500 transition-colors cursor-pointer" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/90 hover:bg-emerald-500 transition-colors cursor-pointer" />
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-200/40 dark:bg-slate-800/40 border border-slate-300/20 text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tight w-48 justify-center select-all">
            <span className="opacity-40">https://</span>qualitydesk.io/app
          </div>
          
          <div className="w-14 flex justify-end">
            <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>

        {/* Inner Interactive Tab Selectors */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 p-1.5 bg-slate-50/50 dark:bg-surface-950/20">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'kanban', label: 'Sprint Kanban', icon: Layers },
            { id: 'quality', label: 'Quality Metrics', icon: FlaskConical },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white dark:bg-surface-800 shadow-sm border border-slate-200/40 dark:border-slate-700/40 rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {tab.id === 'kanban' && kanbanCompletedCount > 0 && (
                    <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                      +{kanbanCompletedCount}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Content Viewports (Animated) ── */}
        <div className="p-5 min-h-[310px] relative flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* 1. OVERVIEW VIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                <div>
                  {/* Dynamic Stats Row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Projects', value: stats.projects, color: 'text-primary-500', bg: 'bg-primary-500/5 border-primary-500/10' },
                      { label: 'Tasks', value: stats.tasks, color: 'text-emerald-500', bg: 'bg-emerald-500/5 border-emerald-500/10' },
                      { label: 'Bugs Alert', value: stats.bugs, color: stats.bugs > 11 ? 'text-rose-500' : 'text-amber-500', bg: 'bg-rose-500/5 border-rose-500/10' },
                      { label: 'Quality Score', value: `${stats.quality}%`, color: 'text-violet-500', bg: 'bg-violet-500/5 border-violet-500/10' },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className={`${stat.bg} rounded-xl p-3 text-center border transition-all duration-300 hover:scale-[1.03]`}
                      >
                        <motion.p
                          key={stat.value}
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`text-xl sm:text-2xl font-black font-display tracking-tight ${stat.color}`}
                        >
                          {stat.value}
                        </motion.p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tasks List */}
                  <div className="mt-4 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                      <Activity className="h-3 w-3 text-primary-500" /> Active Tickets (Live Simulation)
                    </p>
                    <AnimatePresence initial={false}>
                      {tasksList.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/60 dark:bg-surface-950/30 border border-slate-100 dark:border-slate-800/80 hover:border-primary-500/20 transition-all group"
                        >
                          <div className={`w-1.5 h-6 rounded-full shrink-0 ${task.color}`} />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex-1 truncate">{task.name}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold transition-all ${
                            task.status === 'Completed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : task.status === 'Testing'
                              ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                            {task.status}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Simulated Notification Alert */}
                <div className="h-8 flex items-center overflow-hidden">
                  <AnimatePresence>
                    {simNotification && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500/5 border border-primary-500/15 text-[10px] text-primary-600 dark:text-primary-400 font-semibold w-full shadow-inner"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-primary-500 animate-spin-slow" />
                        {simNotification}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* 2. SPRINT KANBAN VIEW */}
            {activeTab === 'kanban' && (
              <motion.div
                key="kanban"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 flex-1 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Agile Board — Click card to advance stage
                  </p>
                  <button
                    onClick={() => {
                      setKanbanTasks([
                        { id: 101, title: 'Database schema migration', column: 'todo', priority: 'high' },
                        { id: 102, title: 'Integrate Stripe gateway', column: 'progress', priority: 'high' },
                        { id: 103, title: 'Write integration tests', column: 'todo', priority: 'medium' },
                        { id: 104, title: 'Export reports to CSV', column: 'done', priority: 'low' },
                      ]);
                      setKanbanCompletedCount(0);
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary-500 hover:text-primary-600 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Reset Board
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 flex-1">
                  {(['todo', 'progress', 'done'] as const).map((column) => (
                    <div key={column} className="rounded-xl bg-slate-50/50 dark:bg-surface-950/20 border border-slate-200/30 dark:border-slate-800/30 p-2 flex flex-col">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                          {column === 'todo' ? 'To Do' : column === 'progress' ? 'In Progress' : 'Done'}
                        </span>
                        <span className="text-[9px] bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.2 rounded-full font-bold text-slate-500">
                          {kanbanTasks.filter((t) => t.column === column).length}
                        </span>
                      </div>

                      <div className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar max-h-[190px]">
                        <AnimatePresence initial={false}>
                          {kanbanTasks
                            .filter((t) => t.column === column)
                            .map((task) => (
                              <motion.div
                                key={task.id}
                                layoutId={`task-card-${task.id}`}
                                onClick={() => advanceKanbanTask(task.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                className="group p-2.5 rounded-lg bg-white dark:bg-surface-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow hover:border-primary-500/40 dark:hover:border-primary-500/30 cursor-pointer text-left transition-all"
                              >
                                <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                                  {task.title}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded ${
                                    task.priority === 'high'
                                      ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500'
                                      : task.priority === 'medium'
                                      ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500'
                                      : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                                  }`}>
                                    {task.priority}
                                  </span>
                                  
                                  <span className="text-[8px] text-slate-400 group-hover:text-primary-500 font-medium flex items-center gap-0.5 transition-colors">
                                    {column === 'done' ? 'Reset' : 'Advance'} <ArrowRight className="h-2 w-2" />
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. QUALITY ANALYTICS VIEW */}
            {activeTab === 'quality' && (
              <motion.div
                key="quality"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Quality Index Trend — Hover points for insights
                  </p>
                  <div className="flex gap-3 text-[9px] font-bold text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-500" /> Coverage</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Quality</span>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  {/* SVG Chart Area */}
                  <div className="flex-1 h-36 relative bg-slate-50/50 dark:bg-surface-950/25 rounded-xl border border-slate-200/20 dark:border-slate-800/40 p-2">
                    <svg viewBox="0 0 320 150" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="280" y2="20" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />
                      <line x1="40" y1="70" x2="280" y2="70" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />
                      <line x1="40" y1="120" x2="280" y2="120" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3 3" />

                      {/* Area Gradient */}
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Line Paths */}
                      <path
                        d="M 40,130 L 100,110 L 160,120 L 220,80 L 280,65"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="animate-chart-draw"
                        style={{
                          strokeDasharray: 300,
                          strokeDashoffset: 0,
                        }}
                      />

                      {/* Area Fill */}
                      <path
                        d="M 40,130 L 100,110 L 160,120 L 220,80 L 280,65 L 280,140 L 40,140 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Secondary Guideline */}
                      <path
                        d="M 40,110 L 100,95 L 160,90 L 220,50 L 280,45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        opacity="0.6"
                      />

                      {/* Interactive Circles */}
                      {chartData.map((pt, idx) => (
                        <circle
                          key={idx}
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          className="fill-white stroke-primary-500 stroke-[3] cursor-pointer transition-all duration-200 hover:r-7"
                          onMouseEnter={(e) => {
                            setHoveredPoint({ x: pt.x, y: pt.y, val: pt.val, date: pt.date });
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}

                      {/* X Axis Labels */}
                      {chartData.map((pt, idx) => (
                        <text
                          key={idx}
                          x={pt.x}
                          y="145"
                          textAnchor="middle"
                          className="fill-slate-400 dark:fill-slate-500 font-semibold text-[8px] uppercase font-mono"
                        >
                          {pt.date}
                        </text>
                      ))}
                    </svg>

                    {/* Tooltip Overlay */}
                    {hoveredPoint && (
                      <div
                        className="absolute bg-slate-900 text-white rounded-lg px-2 py-1 text-[8px] font-bold shadow-lg pointer-events-none -translate-x-1/2 -translate-y-full border border-slate-700"
                        style={{
                          left: `${(hoveredPoint.x / 320) * 100}%`,
                          top: `${(hoveredPoint.y / 150) * 100 - 8}%`,
                        }}
                      >
                        {hoveredPoint.date}: <span className="text-accent-400">{hoveredPoint.val}% Index</span>
                      </div>
                    )}
                  </div>

                  {/* Quality Statistics Details Column */}
                  <div className="w-28 space-y-2 shrink-0">
                    <div className="p-2 bg-slate-50 dark:bg-surface-950/30 rounded-lg border border-slate-200/40 dark:border-slate-800/80 text-left">
                      <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Code Coverage</p>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100 mt-0.5">97.4% Passed</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-surface-950/30 rounded-lg border border-slate-200/40 dark:border-slate-800/80 text-left">
                      <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Defect Leakage</p>
                      <p className="text-xs font-black text-emerald-500 mt-0.5">-60% drop</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Badge (Visual highlight) */}
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3.5 py-1.5 rounded-xl shadow-lg shadow-emerald-500/25 text-[10px] font-black tracking-wide border border-emerald-400/40 flex items-center gap-1.5 animate-bounce-subtle z-20 hover:scale-105 transition-all">
            <CheckCircle className="h-3 w-3" /> Quality Score: {stats.quality}%
          </div>
        </div>

      </div>
    </div>
  );
};
