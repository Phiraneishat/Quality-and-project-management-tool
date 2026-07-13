import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShieldCheck, TestTube, Bug, TrendingUp, AlertTriangle, BarChart3, Target, Play, Cpu, Terminal, ShieldAlert, CheckCircle, RefreshCw, Check, Clock, Globe } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/Shared';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const qualityScore = 94;
const qualityStatus = qualityScore >= 90 ? 'Excellent' : qualityScore >= 70 ? 'Good' : qualityScore >= 50 ? 'Average' : 'Poor';
const statusColor = qualityScore >= 90 ? 'text-emerald-500' : qualityScore >= 70 ? 'text-blue-500' : qualityScore >= 50 ? 'text-amber-500' : 'text-red-500';

const metrics = [
  { label: 'Code Coverage', value: 87, target: 80, icon: ShieldCheck, color: 'emerald' },
  { label: 'Requirement Coverage', value: 95, target: 100, icon: Target, color: 'blue' },
  { label: 'Test Coverage', value: 92, target: 90, icon: TestTube, color: 'violet' },
  { label: 'Review Score', value: 4.6, target: 4, icon: Award, color: 'amber', max: 5, suffix: '/5' },
  { label: 'Bug Density', value: 3.2, target: 5, icon: Bug, color: 'rose', max: 10, suffix: '/KLOC', inverse: true },
  { label: 'Defect Leakage', value: 1.8, target: 2, icon: AlertTriangle, color: 'orange', suffix: '%', inverse: true },
  { label: 'Customer Satisfaction', value: 4.7, target: 4.5, icon: TrendingUp, color: 'teal', max: 5, suffix: '/5' },
  { label: 'Reopened Bugs', value: 2.1, target: 3, icon: Bug, color: 'purple', suffix: '%', inverse: true },
  { label: 'Failed Builds', value: 3.5, target: 5, icon: BarChart3, color: 'red', suffix: '%', inverse: true },
];

const trendData = [
  { sprint: 'S1', score: 72 }, { sprint: 'S2', score: 78 }, { sprint: 'S3', score: 74 },
  { sprint: 'S4', score: 82 }, { sprint: 'S5', score: 88 }, { sprint: 'S6', score: 91 },
  { sprint: 'S7', score: 89 }, { sprint: 'S8', score: 94 },
];

const coverageData = [
  { name: 'Auth', code: 92, test: 88, req: 95 },
  { name: 'Dashboard', code: 85, test: 90, req: 100 },
  { name: 'Tasks', code: 88, test: 95, req: 92 },
  { name: 'Bugs', code: 90, test: 87, req: 98 },
  { name: 'Reports', code: 78, test: 82, req: 88 },
];

const radialData = [{ name: 'Quality', value: qualityScore, fill: '#10b981' }];

export const Quality: React.FC = () => {
  // CI/CD Pipeline Simulator States
  const [buildStatus, setBuildStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll terminal console
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [buildLogs]);

  const triggerPipeline = () => {
    if (buildStatus === 'running') return;
    setBuildStatus('running');
    setActiveStage(0);
    setBuildLogs([
      `[${new Date().toLocaleTimeString()}] 🚀 Initiating QualityDesk Production CI/CD Pipeline build...`,
      `[${new Date().toLocaleTimeString()}] 📦 Fetching latest master branch revision from GitHub repository...`,
      `[${new Date().toLocaleTimeString()}] 🔑 Verifying cryptographic workspace signatures... Verified.`
    ]);

    const runStage = (stageIdx: number) => {
      const stageSteps = [
        // Stage 0: Compile
        {
          logs: [
            `[${new Date().toLocaleTimeString()}] ⚙️ [COMPILE STAGE] Building production webpack assets & bundle...`,
            `[${new Date().toLocaleTimeString()}] ⚙️ Running TypeScript type-checking checks...`,
            `[${new Date().toLocaleTimeString()}] ⚙️ 2884 React modules successfully compiled in 2.74s.`
          ],
          nextText: 'Compilation Successful!'
        },
        // Stage 1: Lint
        {
          logs: [
            `[${new Date().toLocaleTimeString()}] 🔍 [LINT AUDIT] Checking code compliance via ESLint parser rules...`,
            `[${new Date().toLocaleTimeString()}] 🔍 0 errors, 14 warnings found (deprecations ignored).`,
            `[${new Date().toLocaleTimeString()}] 🔍 Code formatting validation complete.`
          ],
          nextText: 'Lint Audit Passed!'
        },
        // Stage 2: Unit Tests
        {
          logs: [
            `[${new Date().toLocaleTimeString()}] 🧪 [TEST SUITE] Launching Mongoose database unit test environment...`,
            `[${new Date().toLocaleTimeString()}] 🧪 Running auth.service.spec.ts... PASS`,
            `[${new Date().toLocaleTimeString()}] 🧪 Running quality.controller.spec.ts... PASS`,
            `[${new Date().toLocaleTimeString()}] 🧪 SUMMARY: 42/42 tests successfully executed.`
          ],
          nextText: 'All 42 Unit Tests Passed!'
        },
        // Stage 3: Security Scan
        {
          logs: [
            `[${new Date().toLocaleTimeString()}] 🛡️ [SECURITY SCAN] Auditing package.json dependencies for CVE exploits...`,
            `[${new Date().toLocaleTimeString()}] 🛡️ Running OWASP Dependency-Check scanner...`,
            `[${new Date().toLocaleTimeString()}] 🛡️ 0 High severity vulnerabilities found. Workspace secure.`
          ],
          nextText: 'Workspace Certified Secure!'
        },
        // Stage 4: Deploy
        {
          logs: [
            `[${new Date().toLocaleTimeString()}] ☁️ [DEPLOY STAGE] Uploading compiled React bundle index.html to AWS S3...`,
            `[${new Date().toLocaleTimeString()}] ☁️ Refreshing CloudFront CDN endpoints edge cache...`,
            `[${new Date().toLocaleTimeString()}] ☁️ Production release deployed successfully!`
          ],
          nextText: 'Pipeline Completed Successfully!'
        }
      ];

      const currentStage = stageSteps[stageIdx];
      if (!currentStage) return;

      setTimeout(() => {
        // Append logs
        setBuildLogs(prev => [...prev, ...currentStage.logs, `[${new Date().toLocaleTimeString()}] ✓ ${currentStage.nextText}`]);
        
        const nextStageIdx = stageIdx + 1;
        if (nextStageIdx < stageSteps.length) {
          setActiveStage(nextStageIdx);
          runStage(nextStageIdx);
        } else {
          setActiveStage(null);
          setBuildStatus('success');
          setBuildLogs(prev => [...prev, `\n[${new Date().toLocaleTimeString()}] 🎉 BUILD SUCCESSFUL: QualityDesk v2.4.0 is live!`]);
        }
      }, 2000);
    };

    runStage(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Quality Management</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor and improve quality metrics across all projects.</p>
      </div>

      {/* Quality Score Hero */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />
          <div className="relative">
            <div className="relative w-48 h-48 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} data={radialData}>
                  <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black font-display text-slate-900 dark:text-white">{qualityScore}</span>
                <span className="text-xs text-slate-400 font-medium">/ 100</span>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant={qualityScore >= 90 ? 'success' : qualityScore >= 70 ? 'info' : 'warning'} size="md" dot>
                {qualityStatus}
              </Badge>
              <p className="text-xs text-slate-500 mt-2">Overall Quality Score</p>
            </div>
          </div>
        </Card>

        {/* Quality Trend */}
        <Card className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quality Score Trend</h3>
              <p className="text-[10px] text-slate-400">Last 8 sprints</p>
            </div>
            <Badge variant="success">↑ +22 pts</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <defs>
                <linearGradient id="qualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Metrics Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-4">Quality Metrics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            const max = metric.max || 100;
            const percent = Math.min((metric.value / max) * 100, 100);
            const isGood = metric.inverse ? metric.value <= metric.target : metric.value >= metric.target;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card hover className="relative overflow-hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-${metric.color}-50 dark:bg-${metric.color}-950/30 text-${metric.color}-500`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={isGood ? 'success' : 'warning'} size="sm">
                      {isGood ? '✓ On Target' : '⚠ Below Target'}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{metric.label}</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-display">{metric.value}</span>
                    {metric.suffix && <span className="text-xs text-slate-400">{metric.suffix}</span>}
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      value={percent}
                      color={isGood ? 'bg-emerald-500' : 'bg-amber-500'}
                      size="md"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Target: {metric.target}{metric.suffix || '%'}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Coverage Comparison */}
      <Card>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Coverage by Module</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={coverageData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
            <Bar dataKey="code" fill="#6366f1" name="Code" radius={[4, 4, 0, 0]} />
            <Bar dataKey="test" fill="#8b5cf6" name="Test" radius={[4, 4, 0, 0]} />
            <Bar dataKey="req" fill="#14b8a6" name="Requirements" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* CI/CD & SonarQube Quality Analysis */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* CI/CD Pipeline Monitor */}
        <Card className="lg:col-span-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Production CI/CD Build Pipeline</h3>
              <p className="text-[10px] text-slate-400">Deploy verification and automated QA gate execution</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Play className="h-4 w-4" />}
              onClick={triggerPipeline}
              isLoading={buildStatus === 'running'}
            >
              {buildStatus === 'idle' ? 'Trigger Build' : buildStatus === 'running' ? 'Running Build...' : 'Re-Run Pipeline'}
            </Button>
          </div>

          {/* Pipeline Nodes Flow */}
          <div className="relative py-4 mb-6 flex items-center justify-between overflow-x-auto min-w-[500px]">
            {/* Horizontal progress background line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 -z-0" />

            {[
              { label: 'Compile', desc: 'React Bundle', icon: Cpu },
              { label: 'Lint Audit', desc: 'Code Standards', icon: ShieldCheck },
              { label: 'Unit Tests', desc: 'Mongoose Tests', icon: TestTube },
              { label: 'Security', desc: 'OWASP Scans', icon: ShieldAlert },
              { label: 'Deploy', desc: 'AWS S3 Upload', icon: Globe },
            ].map((node, idx) => {
              const Icon = node.icon;
              const isPassed = activeStage !== null ? idx < activeStage : buildStatus === 'success';
              const isActive = activeStage === idx;
              
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center shrink-0 w-24">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isPassed
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : isActive
                      ? 'bg-primary-500/15 border-primary-500 text-primary-500 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.35)]'
                      : 'bg-slate-50 dark:bg-surface-900 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white mt-2 mb-0.5">{node.label}</span>
                  <span className="text-[9px] text-slate-400 font-medium">{node.desc}</span>
                </div>
              );
            })}
          </div>

          {/* Console Log Terminal */}
          <div className="rounded-xl border border-slate-950 bg-black p-4 font-mono text-[11px] text-emerald-400 h-48 overflow-y-auto relative flex flex-col gap-1 shadow-inner text-left">
            <div className="absolute top-2 right-3 flex items-center gap-1.5 text-slate-650 select-none text-[9px] font-black uppercase tracking-widest">
              <Terminal className="h-3 w-3" /> Console Output
            </div>
            
            {buildLogs.length === 0 ? (
              <span className="text-slate-600 animate-pulse">Console idle. Trigger build to execute automated verification pipeline...</span>
            ) : (
              buildLogs.map((log, lIdx) => (
                <span key={lIdx} className="leading-relaxed whitespace-pre-wrap">{log}</span>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </Card>

        {/* SonarQube Code Health Dashboard */}
        <Card className="lg:col-span-4 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display mb-1">SonarQube Code Health</h3>
            <p className="text-[10px] text-slate-400 mb-6">Continuous code quality & static inspection report</p>

            <div className="space-y-4">
              {/* Technical Debt */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-450 dark:text-slate-400 font-bold block">Technical Debt</span>
                    <span className="text-[10px] text-emerald-500 font-bold">A Grade (Excellent)</span>
                  </div>
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white font-display">1.5 Days</span>
              </div>

              {/* Code Smells */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
                    <Bug className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-450 dark:text-slate-400 font-bold block">Code Smells</span>
                    <span className="text-[10px] text-slate-500 font-bold">Maintainability Rating: A</span>
                  </div>
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white font-display">12</span>
              </div>

              {/* Duplications */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500 shrink-0">
                    <RefreshCw className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-450 dark:text-slate-400 font-bold block">Duplications</span>
                    <span className="text-[10px] text-emerald-500 font-bold">Below limit threshold</span>
                  </div>
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white font-display">0.8%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-left">
            <span className="text-[9px] uppercase tracking-widest font-black text-slate-500 block mb-3">Security Standards Checks</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-350">
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" /> OWASP Top 10
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" /> SANS Top 25
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Leak Scan
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Exploit Audit
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
