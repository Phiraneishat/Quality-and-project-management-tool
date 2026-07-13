import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Bug, FlaskConical, Zap, TestTube, Users,
  ChevronRight, ArrowRight, ShieldCheck, HelpCircle, Terminal, CheckCircle2, X
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

interface IntegrationCardProps {
  name: string;
  desc: string;
  iconBg: string;
  icon: string;
}

const integrations: IntegrationCardProps[] = [
  { name: 'GitHub Sync', desc: 'Auto-link commits and pull requests to bug tickets and sprints.', iconBg: 'bg-slate-900', icon: 'GH' },
  { name: 'Slack Alerts', desc: 'Receive instant notifications for priority updates and approvals.', iconBg: 'bg-emerald-600', icon: 'SL' },
  { name: 'Jira Importer', desc: 'Import issues and tasks from Jira with a single click.', iconBg: 'bg-blue-600', icon: 'JR' },
  { name: 'GitLab Pipeline', desc: 'Track deployment build logs alongside QA requirements.', iconBg: 'bg-orange-600', icon: 'GL' },
  { name: 'Sentry Crash Logs', desc: 'Generate bug reports directly from production error telemetry.', iconBg: 'bg-purple-600', icon: 'SN' },
  { name: 'Figma Comments', desc: 'Embed high-fidelity UX mocks in sprint design tickets.', iconBg: 'bg-rose-500', icon: 'FG' },
];

const faqs = [
  { q: 'How does the Quality Score get calculated?', a: 'The Quality Score compiles static code coverage, unit test pass rates, defect density (bugs per line of code), and average pull request review duration into a single visual index.' },
  { q: 'Can we run test suites directly in QualityDesk?', a: 'Yes! You can define test cases, organize them into release suites, assign tester runs, and record test step outcomes directly on our platform.' },
  { q: 'Is there a limit on integrations?', a: 'No. Integration capabilities are unlocked for all plans. You can connect as many external repositories and workspace instances as you need.' },
];

const INTEGRATION_DETAILS: Record<string, {
  tagline: string;
  benefits: string[];
  metrics: string;
  actionText: string;
}> = {
  'GitHub Sync': {
    tagline: 'Synchronize repository branch events to active bug dashboards.',
    benefits: [
      'Automatic Pull Request Matching: Closes open bug cards automatically on merge.',
      'Commit Hash Audit Logs: Link individual commit descriptions to quality requirements.',
      'Branch Environment Flags: Instantly visualize build coverage directly in pull requests.',
      'Review Approval Syncs: Automate developer assignment state changes based on reviews.'
    ],
    metrics: '99.8% Commit Traceability',
    actionText: 'Connect GitHub'
  },
  'Slack Alerts': {
    tagline: 'Instant alerts keeping teams coordinated.',
    benefits: [
      'Sprint Status Logs: Broadcast team velocity charts directly to Slack channels.',
      'Critical Bug Escalations: Pings relevant developer channels the instant a critical bug is reported.',
      'Tester Assignment Alerts: Direct alerts when test runs are assigned or completed.',
      'Milestone Progress Updates: Real-time highlights when major milestones are hit.'
    ],
    metrics: '< 1 Minute Notification Delay',
    actionText: 'Connect Slack'
  },
  'Jira Importer': {
    tagline: 'Instant task migration to your QualityDesk workspace.',
    benefits: [
      'One-Click Importer: Sync all open epics, user stories, and subtasks in seconds.',
      'Fields Mapping Engine: Automatically align priority levels and status lists.',
      'Comments & Attachments Sync: Preserves files, screenshots, and comments.',
      'Active Syncing Protocol: Keeps updates bidirectionally aligned during transition.'
    ],
    metrics: '100% Data Migration Success',
    actionText: 'Connect Jira'
  },
  'GitLab Pipeline': {
    tagline: 'Correlate pipeline build results with QA metrics.',
    benefits: [
      'Deployment Log Tracking: Monitor build coverage metrics across dev/staging.',
      'CI/CD Failures Capture: Automatically trigger tickets on failed pipeline runs.',
      'Quality Gates Enforcement: Blocks releases if coverage targets are not met.',
      'Release Tag Autolink: Auto-generate change logs based on merged pipeline tags.'
    ],
    metrics: '12% Reduction in Failed Builds',
    actionText: 'Connect GitLab'
  },
  'Sentry Crash Logs': {
    tagline: 'Bridge production exceptions with test coverage validation.',
    benefits: [
      'Telemetry Syncs: Automatically map production errors to open QA issues.',
      'Stack Trace Captures: Attach full runtime traces directly to ticket descriptions.',
      'Affected User Counters: Highlight critical impact priority based on user counts.',
      'Hotfix Tracker Flow: Instantly request emergency test runs for hotfixes.'
    ],
    metrics: '70% Faster Root Cause Triage',
    actionText: 'Connect Sentry'
  },
  'Figma Comments': {
    tagline: 'Embed mockups directly inside development requirements.',
    benefits: [
      'Live Canvas Embeds: Render the latest high-fidelity Figma designs directly in tasks.',
      'Design Changes Alerts: Notify assignees when design links are modified.',
      'Inline Comment Threads: Read design feedback alongside code reviews.',
      'Requirement-to-Design Mapping: Trace code modules back to product design screens.'
    ],
    metrics: '100% Traceability to Figma',
    actionText: 'Connect Figma'
  }
};

export const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'project' | 'bugs' | 'quality'>('project');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<any | null>(null);

  return (
    <div className="min-h-screen pt-16 grid-bg mesh-gradient">
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
            <Zap className="h-3.5 w-3.5" /> Product Features
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white leading-tight tracking-tight"
          >
            Powering Your Entire <br />
            <span className="text-gradient-primary">Quality Lifecycle</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            QualityDesk unites project tracking and quality engineering. Manage backlogs, resolve tickets, run tests, and track coverage in one beautifully cohesive dashboard.
          </motion.p>
        </div>
      </section>

      {/* ── Interactive Features Showcase ── */}
      <section className="py-16 bg-white/40 dark:bg-surface-900/40 border-y border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            
            {/* Left Column: Tab Selectors */}
            <div className="w-full lg:w-1/3 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
                Engineered for High-Velocity Teams
              </h2>
              <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-350 mb-6">
                Click the categories below to see how QualityDesk streamlines development stages.
              </p>

              <div className="space-y-3">
                {[
                  { id: 'project', icon: LayoutDashboard, title: 'Sprint Management', desc: 'Backlog grooming, customizable Kanban boards, and live burn-down velocity reports.' },
                  { id: 'bugs', icon: Bug, title: 'Bug Tracking & Lifecycle', desc: 'Pinpoint code defects, track severity levels, assign files, and coordinate hotfixes.' },
                  { id: 'quality', icon: FlaskConical, title: 'Quality Assurance Mocks', desc: 'Trace release requirements directly to active test runs and test configurations.' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-surface-800 border-primary-500/30 dark:border-primary-500/20 shadow-md shadow-primary-500/5'
                          : 'bg-transparent border-transparent hover:bg-slate-100/50 dark:hover:bg-surface-800/30'
                      }`}
                    >
                      <div className={`p-2 rounded-xl transition-all ${
                        isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold font-display ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {tab.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{tab.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Visual Dashboard Mocks (Animated) */}
            <div className="w-full lg:w-2/3">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-950 p-6 shadow-xl relative overflow-hidden min-h-[360px] flex items-center justify-center">
                <div className="absolute inset-0 grid-bg opacity-40" />
                
                <AnimatePresence mode="wait">
                  {activeTab === 'project' && (
                    <motion.div
                      key="project-view"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="w-full space-y-4 relative z-10"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-primary-500" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase">V1.4 Release Backlog</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">Active Sprint</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { name: 'Authenticate API via OAuth2', p: 'High', c: 'border-l-4 border-rose-500' },
                          { name: 'Redesign Project Analytics Panel', p: 'Medium', c: 'border-l-4 border-amber-500' },
                          { name: 'Configure Webhook logs database', p: 'High', c: 'border-l-4 border-rose-500' },
                          { name: 'Add PDF statement exports support', p: 'Low', c: 'border-l-4 border-slate-400' },
                        ].map((task, i) => (
                          <div key={i} className={`p-3 bg-white dark:bg-surface-900 border border-slate-200/55 dark:border-slate-850 rounded-xl shadow-sm hover:border-primary-500/30 transition-all ${task.c}`}>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{task.name}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-slate-400">Priority: {task.p}</span>
                              <span className="text-[9px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-500">To Do</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'bugs' && (
                    <motion.div
                      key="bugs-view"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="w-full space-y-4 relative z-10"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-rose-500" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase">Defect Lifecycle Tracker</span>
                        </div>
                        <span className="text-[10px] text-rose-500 font-mono font-bold">12 open bugs</span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { title: 'Memory leak in socket connections on dashboard', sev: 'Critical', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
                          { title: 'Login password visibility eye toggle behaves inconsistently', sev: 'Medium', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
                          { title: 'Search filter yields incorrect results on task search keypress', sev: 'Low', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
                        ].map((bug, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-surface-900 border border-slate-200/55 dark:border-slate-850 rounded-xl shadow-sm">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[70%]">{bug.title}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${bug.color}`}>{bug.sev}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'quality' && (
                    <motion.div
                      key="quality-view"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="w-full space-y-4 relative z-10 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase">QA Code Coverage Mocks</span>
                        </div>
                        <span className="text-[10px] text-emerald-500 font-bold">97.4% Target</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { title: 'Unit Tests', val: '98%', status: 'Passed' },
                          { title: 'Integration Tests', val: '94%', status: 'Passed' },
                          { title: 'E2E Testing', val: '91%', status: 'In Review' },
                        ].map((stat, i) => (
                          <div key={i} className="p-3.5 bg-white dark:bg-surface-900 border border-slate-200/55 dark:border-slate-850 rounded-xl text-center shadow-sm">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                            <p className="text-xl font-black text-slate-800 dark:text-white mt-1">{stat.val}</p>
                            <p className="text-[9px] text-emerald-500 font-bold mt-0.5">{stat.status}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-3 bg-white dark:bg-surface-900 border border-slate-200/55 dark:border-slate-850 rounded-xl text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-primary-500" />
                        <span>Coverage logs verified. Pull Request reviews automatically approved.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Integrations Section ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">Connect Your Stack</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
            Works with the <span className="text-gradient-primary">Tools You Love</span>
          </h2>
          <p className="mt-4 text-sm text-slate-705 dark:text-slate-300 max-w-xl mx-auto">
            QualityDesk plugs directly into your existing deployment ecosystem. No migrations or pipeline restructures required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => setSelectedIntegration(item)}
              className="p-6 bg-white dark:bg-surface-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-primary-500/20 transition-colors text-left relative group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${item.iconBg}`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white font-display">{item.name}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">{item.desc}</p>
              <ChevronRight className="absolute bottom-6 right-6 h-4.5 w-4.5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-20 bg-slate-50 dark:bg-surface-900/50 border-t border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              Features FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="bg-white dark:bg-surface-900 border border-slate-200/70 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left p-5 flex items-center justify-between font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-surface-950/20 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><HelpCircle className="h-4.5 w-4.5 text-primary-500" /> {faq.q}</span>
                    <span className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/30 dark:bg-surface-900/30">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Call To Action ── */}
      <section className="py-20 text-center relative overflow-hidden bg-gradient-to-br from-primary-600 to-violet-700 text-white">
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black font-display">Ready to Experience QualityDesk?</h2>
          <p className="mt-4 text-sm text-white/80 max-w-xl mx-auto">
            Get started for free today. Standard pricing models with 14-day trials. Cancel anytime.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/register">
              <button className="px-6 py-3 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-102 transition-all text-sm cursor-pointer flex items-center gap-1.5">
                Start Trial <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Integration Details Modal ── */}
      <AnimatePresence>
        {selectedIntegration && (() => {
          const detail = INTEGRATION_DETAILS[selectedIntegration.name];
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedIntegration(null)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative w-full max-w-2xl bg-white dark:bg-surface-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row text-left"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-20 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Left Panel: Integration Highlights */}
                <div className="flex-1 p-8">
                  <div className={`inline-flex w-12 h-12 rounded-2xl items-center justify-center text-white font-bold text-base shadow-lg mb-4 ${selectedIntegration.iconBg}`}>
                    {selectedIntegration.icon}
                  </div>
                  <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">
                    {selectedIntegration.name} Integration
                  </h3>
                  <p className="mt-2 text-sm text-primary-500 dark:text-primary-400 font-medium">
                    {detail?.tagline}
                  </p>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {selectedIntegration.desc}
                  </p>

                  <div className="mt-6 space-y-3">
                    {detail?.benefits.map((benefit, idx) => {
                      const [title, desc] = benefit.split(': ');
                      return (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <span className="font-bold text-slate-900 dark:text-white">{title}:</span>{' '}
                            <span className="text-slate-600 dark:text-slate-400">{desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: CTA & Stat */}
                <div className="md:w-64 bg-slate-50 dark:bg-surface-950 p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-surface-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Performance Metric</span>
                      <p className="text-xl font-black text-gradient-primary mt-1 font-display">
                        {detail?.metrics}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 md:mt-0 space-y-3">
                    <Link to="/register" onClick={() => setSelectedIntegration(null)} className="w-full block">
                      <Button variant="primary" className="w-full">
                        {detail?.actionText || 'Connect'}
                      </Button>
                    </Link>
                    <button
                      onClick={() => setSelectedIntegration(null)}
                      className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-250 font-bold transition-colors cursor-pointer"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
