import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Target, Award, Play, CheckCircle, XCircle, Code, ShieldCheck } from 'lucide-react';

interface CoverageFile {
  name: string;
  coverage: number;
  statements: number;
}

export const QualityMetrics: React.FC = () => {
  const [targetThreshold, setTargetThreshold] = useState<80 | 90 | 95>(90);

  const files: CoverageFile[] = [
    { name: 'services/auth_service.ts', coverage: 96, statements: 342 },
    { name: 'routes/payment_router.ts', coverage: 92, statements: 180 },
    { name: 'utils/date_parser.ts', coverage: 87, statements: 94 },
    { name: 'middleware/session_guard.go', coverage: 82, statements: 210 },
    { name: 'models/project_model.py', coverage: 78, statements: 155 },
  ];

  // SVG dimensions
  const height = 160;
  const targetY = height - (targetThreshold / 100) * height;

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
            <FlaskConical className="h-3.5 w-3.5" /> QA Metrics Desk
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white leading-tight tracking-tight">
            Advanced <span className="text-gradient-primary">Quality Insights</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-650 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing your release quality. Monitor code coverage, defect leakage ratios, unit test pass counts, and overall quality index parameters in real time.
          </p>
        </div>
      </section>

      {/* ── Interactive Coverage Threshold Toggle & SVG ── */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch text-left">
          
          {/* Left Column: Interactive Threshold Selector & Files List */}
          <div className="w-full lg:w-5/12 bg-white/80 dark:bg-surface-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-black font-display text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary-500" /> Coverage Guard Sim
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Toggle the coverage target threshold index below to view which directories satisfy code standards.
              </p>

              {/* Threshold Toggle */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-surface-950 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-6">
                <span className="text-xs font-bold text-slate-500 pl-2">Coverage target:</span>
                <div className="flex gap-1.5">
                  {([80, 90, 95] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTargetThreshold(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${
                        targetThreshold === t
                          ? 'bg-primary-500 text-white shadow'
                          : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                      }`}
                    >
                      {t}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Files Check List */}
              <div className="space-y-2">
                {files.map((file, idx) => {
                  const passes = file.coverage >= targetThreshold;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                        passes
                          ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-850 dark:text-slate-200'
                          : 'bg-rose-500/5 border-rose-500/10 text-slate-850 dark:text-slate-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{file.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{file.statements} statements</p>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-black ${passes ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {file.coverage}%
                        </span>
                        {passes ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2 text-[10px] text-slate-400">
              <Code className="h-4 w-4 text-primary-500 shrink-0" />
              <span>Simulated coverage calculated live on PR pull checks.</span>
            </div>
          </div>

          {/* Right Column: Dynamic SVG Chart Grid */}
          <div className="w-full lg:w-7/12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-950 p-6 shadow-xl relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <div className="absolute inset-0 grid-bg opacity-30" />

            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-primary-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-250 uppercase font-mono tracking-tight">Interactive Target Line</span>
                  </div>
                  <span className="text-[10px] bg-primary-500 text-white px-2.5 py-0.5 rounded-full font-black uppercase">
                    Coverage Chart
                  </span>
                </div>

                {/* SVG Visual graph */}
                <div className="relative h-44 bg-white/70 dark:bg-surface-900/50 rounded-2xl border border-slate-250/20 p-4 shadow-inner flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 360 160">
                    {/* Chart Grid Lines */}
                    <line x1="0" y1="40" x2="360" y2="40" stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="2 2" />
                    <line x1="0" y1="80" x2="360" y2="80" stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="2 2" />
                    <line x1="0" y1="120" x2="360" y2="120" stroke="rgba(148, 163, 184, 0.1)" strokeDasharray="2 2" />

                    {/* Columns Bars */}
                    {files.map((file, idx) => {
                      const barHeight = (file.coverage / 100) * height;
                      const barY = height - barHeight;
                      const passes = file.coverage >= targetThreshold;
                      return (
                        <g key={idx}>
                          <rect
                            x={30 + idx * 65}
                            y={barY}
                            width="28"
                            height={barHeight}
                            rx="5"
                            className={`transition-all duration-500 ${
                              passes ? 'fill-emerald-500/85' : 'fill-rose-500/85'
                            }`}
                          />
                          {/* File text abbreviation */}
                          <text
                            x={44 + idx * 65}
                            y="155"
                            textAnchor="middle"
                            className="fill-slate-400 dark:fill-slate-500 text-[8px] font-bold font-mono"
                          >
                            F{idx + 1}
                          </text>
                        </g>
                      );
                    })}

                    {/* Interactive Animated Target Threshold Line */}
                    <motion.g
                      animate={{ y: targetY }}
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="360"
                        y2="0"
                        stroke="#6366f1"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                      />
                      <rect x="300" y="-8" width="55" height="16" rx="4" fill="#6366f1" />
                      <text x="327" y="3" textAnchor="middle" fill="white" className="text-[8px] font-black font-mono">
                        Target {targetThreshold}%
                      </text>
                    </motion.g>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                {[
                  { label: 'Defect Density', val: '0.4 / kLOC', sub: 'Extremely Low' },
                  { label: 'Test Pass Rate', val: '99.8%', sub: '2.4k tests run' },
                  { label: 'PR Review Time', val: '< 2.4 hrs', sub: 'Automated reviews' },
                ].map((stat, idx) => (
                  <div key={idx} className="p-3 bg-white/70 dark:bg-surface-900/70 border border-slate-200/50 dark:border-slate-850 rounded-xl text-left">
                    <p className="text-[8px] font-bold text-slate-400 dark:text-slate-550 uppercase">{stat.label}</p>
                    <p className="text-sm font-black text-slate-800 dark:text-white mt-1">{stat.val}</p>
                    <p className="text-[8px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── Feature Highlights Grid ── */}
      <section className="py-20 bg-white/40 dark:bg-surface-900/40 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { icon: ShieldCheck, title: 'Code Coverage Analysis', desc: 'Syncs coverage statistics with Jest, Vitest, Go test, or JUnit pipelines automatically.' },
              { icon: Target, title: 'Quality Target Gates', desc: 'Prevent PR merges from completing if coverage values fall below target threshold configurations.' },
              { icon: Award, title: 'Certify Releases', desc: 'Automatically tag codebase release versions as certified once metrics thresholds pass.' },
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
