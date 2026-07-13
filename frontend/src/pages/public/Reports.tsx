import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Clock, Sparkles, RefreshCw, FileText, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

type ReportType = 'burndown' | 'bugs' | 'coverage';

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('burndown');
  const [sprintScope, setSprintScope] = useState('sprint-14');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(true);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowReport(false);
    
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 1200);
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'burndown': return 'Sprint Burndown Curve';
      case 'bugs': return 'Defect Density Distribution';
      default: return 'Automated Test Pass Rates';
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-wider mb-6 border border-primary-500/20"
          >
            <BarChart3 className="h-3.5 w-3.5" /> Analytics Panel
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white leading-tight tracking-tight">
            Audit-Ready <span className="text-gradient-primary">Quality Reports</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-655 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Generate audit-compliant quality summaries in seconds. Track release history checkpoints, sprint burndown velocities, and defect density patterns effortlessly.
          </p>
        </div>
      </section>

      {/* ── Interactive Report Generator Layout ── */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch text-left">
          
          {/* Left Column: Generator Form Widget */}
          <div className="w-full lg:w-5/12 bg-white/80 dark:bg-surface-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-black font-display text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary-500 animate-pulse" /> Custom Report Builder
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Choose a metrics parameters criteria template below to generate a visual mockup audit.
              </p>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                    Metrics Template
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as ReportType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                  >
                    <option value="burndown">Sprint Burndown Curve</option>
                    <option value="bugs">Defect Density Distribution</option>
                    <option value="coverage">Automated Test Pass Rates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                    Sprint / Target Scope
                  </label>
                  <select
                    value={sprintScope}
                    onChange={(e) => setSprintScope(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                  >
                    <option value="sprint-12">Sprint 12 (Stable Release)</option>
                    <option value="sprint-13">Sprint 13 (Hotfix Cycle)</option>
                    <option value="sprint-14">Sprint 14 (Active Development)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md shadow-primary-500/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Compiling report...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" /> Generate Analytics Report
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2 text-[10px] text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Complies with ISO-27001 metrics export schemas.</span>
            </div>
          </div>

          {/* Right Column: Visual Report Display Panel (Animated) */}
          <div className="w-full lg:w-7/12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-950 p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <div className="absolute inset-0 grid-bg opacity-30" />

            <div className="relative z-10 flex-1 flex flex-col justify-between">
              
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-250 uppercase font-mono tracking-tight">Mock PDF Output</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">
                  {sprintScope.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center min-h-[220px]">
                <AnimatePresence mode="wait">
                  {isGenerating && (
                    <motion.div
                      key="generating-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-3"
                    >
                      <RefreshCw className="h-8 w-8 text-primary-500 animate-spin mx-auto" />
                      <p className="text-xs text-slate-450 font-bold font-mono tracking-wider uppercase">Loading database metrics...</p>
                    </motion.div>
                  )}

                  {!isGenerating && showReport && (
                    <motion.div
                      key={reportType}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="w-full space-y-6"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-black text-slate-800 dark:text-white font-display">
                            {getReportTitle()}
                          </h3>
                          <p className="text-[9px] text-slate-400 mt-1 uppercase font-mono font-bold">
                            Generated successfully • 0.04s compile
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Approved
                        </span>
                      </div>

                      {/* Custom Rendered SVG Preview depending on report type */}
                      <div className="h-32 bg-white/70 dark:bg-surface-900/50 rounded-2xl border border-slate-200/20 p-2 shadow-inner">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 340 120">
                          {reportType === 'burndown' && (
                            <g>
                              {/* Decending stairs representing burndown */}
                              <path
                                d="M 30,20 L 80,20 L 80,45 L 140,45 L 140,65 L 200,65 L 200,85 L 260,85 L 260,110 L 310,110"
                                fill="none"
                                stroke="#6366f1"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <path
                                d="M 30,20 L 310,110"
                                fill="none"
                                stroke="rgba(148, 163, 184, 0.25)"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                              />
                              <circle cx="310" cy="110" r="4.5" fill="#10b981" />
                            </g>
                          )}

                          {reportType === 'bugs' && (
                            <g>
                              {/* Defect density bar charts */}
                              {[60, 95, 30, 80, 45].map((val, idx) => (
                                <rect
                                  key={idx}
                                  x={40 + idx * 55}
                                  y={110 - (val / 100) * 90}
                                  width="24"
                                  height={(val / 100) * 90}
                                  rx="4"
                                  className="fill-red-500/80"
                                />
                              ))}
                            </g>
                          )}

                          {reportType === 'coverage' && (
                            <g>
                              {/* Growing area curve representing test coverage */}
                              <path
                                d="M 30,95 Q 90,85 150,55 T 270,35 T 310,30"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                              />
                              <path
                                d="M 30,95 Q 90,85 150,55 T 270,35 T 310,30 L 310,110 L 30,110 Z"
                                fill="rgba(16, 185, 129, 0.08)"
                              />
                              <circle cx="310" cy="30" r="4" fill="#10b981" />
                            </g>
                          )}
                        </svg>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-2" />
            </div>

          </div>

        </div>
      </section>

      {/* ── Feature Highlights Grid ── */}
      <section className="py-20 bg-white/40 dark:bg-surface-900/40 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { icon: FileText, title: 'Export PDF & CSV', desc: 'Securely export metrics reports to CSV or signed PDFs for executive review panels.' },
              { icon: Clock, title: 'Automated Schedules', desc: 'Configure automatic cron schedules to distribute reports to slack channels daily.' },
              { icon: Activity, title: 'Compliance Audits', desc: 'Keep full track record logs of test cases execution history for compliance checkpoints.' },
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
