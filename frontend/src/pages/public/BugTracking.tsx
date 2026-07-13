import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, AlertCircle, CheckCircle, Plus, Send, ShieldAlert, Terminal, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoggedBug {
  id: number;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  status: 'Open' | 'Resolved';
}

export const BugTracking: React.FC = () => {
  const [bugs, setBugs] = useState<LoggedBug[]>([
    { id: 1, title: 'Session cookie expiration invalidates JWT payload prematurely', severity: 'critical', file: 'auth/middleware.go', status: 'Open' },
    { id: 2, title: 'UI overflow in tasks sidebar on mobile viewport widths', severity: 'low', file: 'components/Sidebar.tsx', status: 'Open' },
    { id: 3, title: 'Database connection pools leak on transaction abort triggers', severity: 'high', file: 'db/pool.ts', status: 'Open' },
  ]);

  // Form Inputs
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('medium');
  const [file, setFile] = useState('controllers/user.ts');

  const handleAddBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newBug: LoggedBug = {
      id: Date.now(),
      title,
      severity,
      file,
      status: 'Open',
    };

    setBugs((prev) => [newBug, ...prev]);
    setTitle('');
  };

  const handleResolveBug = (id: number) => {
    setBugs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Resolved' } : b))
    );
    // Remove from array after a delay for visual transition
    setTimeout(() => {
      setBugs((prev) => prev.filter((b) => b.id !== id || b.status !== 'Resolved'));
    }, 800);
  };

  const getSeverityBadgeStyles = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-650 dark:text-orange-400 border-orange-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-650 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider mb-6 border border-red-500/20"
          >
            <Bug className="h-3.5 w-3.5" /> QA Defect Hub
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white leading-tight tracking-tight">
            Enterprise-Grade <span className="text-red-500">Bug Tracking</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-650 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate loose tickets and email trace logs. QualityDesk consolidates code errors, attaches trace logs, and coordinates fixes with custom severity pagers.
          </p>
        </div>
      </section>

      {/* ── Interactive Bug Logger & Queue ── */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch text-left">
          
          {/* Left Column: Log Form Widget */}
          <div className="w-full lg:w-5/12 bg-white/80 dark:bg-surface-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-black font-display text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-red-500" /> Interactive Bug Logger
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Add simulated bug tickets using the dashboard console below to witness our live ticket manager update in real time.
              </p>

              <form onSubmit={handleAddBug} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                    Ticket Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Token validation fails on null headers"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                      Severity Tag
                    </label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    >
                      <option value="low">Low Severity</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical Outage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                      Affected File
                    </label>
                    <input
                      type="text"
                      required
                      value={file}
                      onChange={(e) => setFile(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md shadow-red-500/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> File Bug Ticket
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2 text-[10px] text-slate-400">
              <Terminal className="h-4 w-4 text-red-500 shrink-0" />
              <span>Simulated tickets do not trigger external slack alerts.</span>
            </div>
          </div>

          {/* Right Column: Live Bug Queue Dashboard */}
          <div className="w-full lg:w-7/12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-950 p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <div className="absolute inset-0 grid-bg opacity-30" />
            
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-250 uppercase font-mono tracking-tight">Active Backlog Queue</span>
                  </div>
                  <span className="text-[10px] bg-red-500 text-white px-2.5 py-0.5 rounded-full font-black uppercase">
                    {bugs.filter(b => b.status === 'Open').length} Pending
                  </span>
                </div>

                {/* Bug Cards List (Animated) */}
                <div className="space-y-2.5 max-h-[290px] overflow-y-auto no-scrollbar">
                  <AnimatePresence initial={false}>
                    {bugs.map((bug) => (
                      <motion.div
                        key={bug.id}
                        layoutId={`bug-card-${bug.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-start gap-4 p-3 bg-white dark:bg-surface-900 border border-slate-200/50 dark:border-slate-850 rounded-2xl shadow-sm relative group hover:border-red-500/20 transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.2 rounded border ${getSeverityBadgeStyles(bug.severity)}`}>
                              {bug.severity}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 truncate max-w-[150px]">{bug.file}</span>
                          </div>
                          
                          <p className={`text-xs font-bold mt-2 leading-snug transition-colors ${
                            bug.status === 'Resolved' ? 'text-slate-400 line-through' : 'text-slate-850 dark:text-slate-200'
                          }`}>
                            {bug.title}
                          </p>
                        </div>

                        {bug.status === 'Open' ? (
                          <button
                            onClick={() => handleResolveBug(bug.id)}
                            className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg text-[9px] font-bold border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shrink-0"
                          >
                            <CheckCircle className="h-3 w-3" /> Resolve
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg text-[9px] font-bold text-emerald-500 shrink-0">
                            ✓ Fixed
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {bugs.length === 0 && (
                <div className="text-center py-10">
                  <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto opacity-40 mb-2 animate-bounce-subtle" />
                  <p className="text-xs text-slate-500">Backlog clean. All tickets resolved!</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* ── Feature highlights grid ── */}
      <section className="py-20 bg-white/40 dark:bg-surface-900/40 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { icon: ShieldAlert, title: 'Traceback Parser', desc: 'Auto-ingest stack traces, match files to github versions, and attach commit identifiers.' },
              { icon: Bug, title: 'Release Version Scope', desc: 'Identify which environments (staging, alpha, v1.2) are blocked, and release hotfixes.' },
              { icon: CheckCircle, title: 'Regression Guard', desc: 'Flags bug regressions instantly if a fixed error signature reappears in future builds.' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 bg-white dark:bg-surface-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl shadow-sm">
                  <div className="p-2 bg-red-500/10 rounded-xl text-red-500 inline-block">
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
