import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sparkles, LayoutDashboard, Bug, FlaskConical,
  TestTube, Users, BarChart3, Zap, Shield, CheckCircle,
  Star, ChevronRight, Layers, Clock, Target, X
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Counter } from '../../components/ui/Counter';
import { InteractiveShowcase } from '../../components/landing/InteractiveShowcase';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const features = [
  { icon: LayoutDashboard, title: 'Project Management', desc: 'Plan, track, and deliver projects with customizable workflows and real-time collaboration.', color: 'from-blue-500 to-cyan-500' },
  { icon: Bug, title: 'Bug Tracking', desc: 'Capture, prioritize, and resolve bugs with severity tracking, screenshots, and assignments.', color: 'from-rose-500 to-pink-500' },
  { icon: FlaskConical, title: 'Quality Metrics', desc: 'Monitor code coverage, test coverage, bug density, and overall quality scores in real-time.', color: 'from-emerald-500 to-teal-500' },
  { icon: Zap, title: 'Sprint Management', desc: 'Run agile sprints with backlog grooming, burndown charts, and velocity tracking.', color: 'from-amber-500 to-orange-500' },
  { icon: TestTube, title: 'Test Case Management', desc: 'Create test plans, execute test suites, and track pass rates across releases.', color: 'from-violet-500 to-purple-500' },
  { icon: Users, title: 'Team Collaboration', desc: 'Manage teams, departments, skills, and availability with built-in chat and mentions.', color: 'from-indigo-500 to-blue-500' },
];

const stats = [
  { value: '10,000+', label: 'Teams worldwide' },
  { value: '2M+', label: 'Tasks completed' },
  { value: '99.9%', label: 'Uptime guarantee' },
  { value: '4.9/5', label: 'Customer rating' },
];

const testimonials = [
  { name: 'Alex Thompson', role: 'VP Engineering, TechCorp', text: 'QualityDesk transformed how we track quality metrics. Our defect leakage dropped 60% in 3 months.', rating: 5 },
  { name: 'Priya Sharma', role: 'QA Lead, InnovateTech', text: 'The integrated test case management and bug tracking saves us hours every sprint. Best QA tool we\'ve used.', rating: 5 },
  { name: 'Marcus Johnson', role: 'CTO, StartupXYZ', text: 'Finally, a project management tool that puts quality first. The analytics dashboard is incredibly powerful.', rating: 5 },
];

const FEATURE_DETAILS: Record<string, {
  tagline: string;
  benefits: string[];
  metrics: string;
  actionText: string;
}> = {
  'Project Management': {
    tagline: 'Streamline team coordination and project execution.',
    benefits: [
      'Interactive Kanban & List Boards: Organise tasks with drag-and-drop ease.',
      'Milestone Tracking: Define core phases and measure completion rates.',
      'Real-time Collaboration: Sync comments, file attachments, and activity feeds.',
      'Custom Workflow States: Tailor statuses to fit your engineering lifecycle.'
    ],
    metrics: '99.4% Task Completion Rate',
    actionText: 'Launch Projects'
  },
  'Bug Tracking': {
    tagline: 'Squash software defects before they impact your clients.',
    benefits: [
      'Severity & Priority Matrix: Automatically sort bugs based on business impact.',
      'Visual Screenshots & Recordings: Upload attachments directly to bug cards.',
      'Smart Assignee Routing: Instantly assign open defects to qualified developers.',
      'Reopen Rate Analysis: Prevent closed bugs from recurring with audit logs.'
    ],
    metrics: '< 2 Hours Defect Triage Time',
    actionText: 'Start Fixing'
  },
  'Quality Metrics': {
    tagline: 'Track performance standards and target defect leakage.',
    benefits: [
      'Real-time Quality Scores: Automated health checking across active sprints.',
      'Code Coverage Metrics: Sync test run indicators to measure coverage.',
      'Defect Leakage Monitoring: Identify code escapes before production releases.',
      'Live Quality Dashboard: Visual gauges for bug density and performance.'
    ],
    metrics: '97% Average Code Coverage',
    actionText: 'Monitor Quality'
  },
  'Sprint Management': {
    tagline: 'Deploy value continuously with agile sprint control.',
    benefits: [
      'Agile Sprints Boards: Set goals, lock velocity, and track burndowns.',
      'Backlog Grooming: Transition cards between backlog and active sprints.',
      'Velocity Tracking: Predict future delivery capabilities using past velocity.',
      'Automated Reminders: Notify team leads as sprint deadlines approach.'
    ],
    metrics: '25% Faster Release Cycles',
    actionText: 'Plan Sprint'
  },
  'Test Case Management': {
    tagline: 'Enforce perfect requirements verification.',
    benefits: [
      'Structured Test Cases: Define prerequisites, test steps, and results.',
      'Test Run Cycles: Bundle test suites and execute automated runs.',
      'Pass Rate Dashboards: Generate release readiness verification charts.',
      'Failed Run Escalation: Instantly convert failed test runs into bug reports.'
    ],
    metrics: '100% Traceability Compliance',
    actionText: 'Execute Tests'
  },
  'Team Collaboration': {
    tagline: 'Connect developers, product managers, and testers.',
    benefits: [
      'Centralized Sprints Chat: Inline mentions and discussions per task.',
      'Role Clearance & Dashboards: Restrict dashboard views based on team roles.',
      'Skills & Availability: Track developer tech stacks and resource levels.',
      'Team Performance Logs: Monitor metrics and productivity averages.'
    ],
    metrics: '40% Improved Collaboration Score',
    actionText: 'Sync Team'
  }
};

export const Landing: React.FC = () => {
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);

  return (
    <div className="overflow-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[90vh] flex items-center mesh-gradient">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px] animate-orb-1" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] animate-orb-2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold tracking-wider uppercase border border-primary-200 dark:border-primary-800 mb-6"
              >
                <Sparkles className="h-4 w-4 animate-pulse" />
                2026 Edition — Quality Management Reimagined
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.1]"
              >
                <span className="text-gradient-hero">Deliver Quality</span>
                <br />
                <span className="text-slate-900 dark:text-white">Software, Faster</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-lg text-slate-700 dark:text-slate-300 max-w-xl leading-relaxed"
              >
                The all-in-one platform for project management, bug tracking, sprint planning, 
                quality metrics, and team collaboration. Built for engineering teams that care about quality.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4"
              >
                <Link to="/register">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5 hover:translate-x-1 transition-transform" />}>
                    Start Free Trial
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center gap-4 justify-center lg:justify-start"
              >
                <div className="flex -space-x-2">
                  {['A', 'B', 'C', 'D'].map((l, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full border-2 border-white dark:border-surface-950 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${
                        ['from-primary-400 to-primary-600', 'from-purple-400 to-purple-600', 'from-teal-400 to-teal-600', 'from-rose-400 to-rose-600'][i]
                      }`}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Loved by 10,000+ teams</p>
                </div>
              </motion.div>
            </div>

            {/* Right: Interactive Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:w-1/2 w-full"
            >
              <InteractiveShowcase />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-16 bg-slate-900 dark:bg-surface-950 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-black font-display text-white">
                  <Counter value={stat.value} />
                </p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 grid-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">Powerful Features</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black font-display text-slate-900 dark:text-white">
              Everything you need to <span className="text-gradient-primary">ship quality</span>
            </h2>
            <p className="mt-4 text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
              From sprint planning to bug tracking, from quality metrics to team collaboration — 
              QualityDesk brings it all together in one beautiful platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  {...stagger}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => setSelectedFeature(feature)}
                  className="group relative bg-white dark:bg-surface-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-7 shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                  <ChevronRight className="absolute bottom-7 right-7 h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why QualityDesk ── */}
      <section className="py-24 bg-slate-50 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div {...fadeUp} className="lg:w-1/2 animate-slide-in">
              <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">Why QualityDesk?</span>
              <h2 className="mt-3 text-4xl font-black font-display text-slate-900 dark:text-white">
                Quality is not an act, <br />it is a <span className="text-gradient-primary">habit</span>
              </h2>
              <p className="mt-4 text-slate-700 dark:text-slate-305 leading-relaxed">
                Most project management tools treat quality as an afterthought. QualityDesk puts 
                quality metrics at the center of everything you do, so you can catch issues early 
                and deliver software your users love.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  { icon: Target, text: 'Real-time quality score tracking across all projects' },
                  { icon: Shield, text: 'Automated defect leakage and bug density analysis' },
                  { icon: Layers, text: 'Integrated test coverage with requirement traceability' },
                  { icon: Clock, text: 'Sprint velocity and burndown insights for better planning' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const isActive = activeBenefit === i;
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setActiveBenefit(i)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${
                        isActive
                          ? 'bg-primary-50/50 dark:bg-primary-950/20 border-primary-500/20 text-slate-900 dark:text-white translate-x-1.5'
                          : 'bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-surface-800/30'
                      }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 transition-colors ${
                        isActive ? 'bg-primary-500 text-white' : 'bg-primary-50 dark:bg-primary-950/30 text-primary-500'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold leading-relaxed">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Quality Score', value: '94%', sub: 'Across all projects', color: 'from-primary-500 to-violet-600' },
                { label: 'Bug Resolution', value: '< 24h', sub: 'Average time to fix', color: 'from-emerald-500 to-teal-600' },
                { label: 'Test Coverage', value: '97%', sub: 'Code coverage target', color: 'from-amber-500 to-orange-600' },
                { label: 'Sprint Velocity', value: '+23%', sub: 'Month over month', color: 'from-rose-500 to-pink-600' },
              ].map((card, i) => {
                const isActive = activeBenefit === i;
                return (
                  <motion.div
                    key={i}
                    animate={{
                      scale: isActive ? 1.05 : 0.98,
                      opacity: isActive ? 1 : 0.75,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white shadow-xl relative transition-shadow ${
                      isActive ? 'shadow-primary-500/25 ring-2 ring-white/20' : 'shadow-none'
                    }`}
                  >
                    <p className="text-xs font-semibold text-white/80">{card.label}</p>
                    <p className="text-3xl font-black font-display mt-2">{card.value}</p>
                    <p className="text-xs text-white/70 mt-1">{card.sub}</p>
                    {isActive && (
                      <span className="absolute top-4 right-4 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">Testimonials</span>
            <h2 className="mt-3 text-4xl font-black font-display text-slate-900 dark:text-white">
              Trusted by engineering <span className="text-gradient-primary">leaders</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-7 shadow-sm"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-purple-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-black font-display text-white">
              Ready to transform your <br />quality workflow?
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
              Join thousands of teams using QualityDesk to deliver better software, faster.
              Start your free trial today — no credit card required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg cursor-pointer">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link to="/contact">
                <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg cursor-pointer">
                  Schedule Demo
                </button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-white/60 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Free 14-day trial</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Feature Details Modal ── */}
      <AnimatePresence>
        {selectedFeature && (() => {
          const detail = FEATURE_DETAILS[selectedFeature.title];
          const FeatureIcon = selectedFeature.icon;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedFeature(null)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative w-full max-w-2xl bg-white dark:bg-surface-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-20 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Left Panel: Feature Highlights */}
                <div className="flex-1 p-8">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${selectedFeature.color} text-white shadow-lg mb-4`}>
                    <FeatureIcon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">
                    {selectedFeature.title}
                  </h3>
                  <p className="mt-2 text-sm text-primary-500 dark:text-primary-400 font-medium">
                    {detail?.tagline}
                  </p>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {selectedFeature.desc}
                  </p>

                  <div className="mt-6 space-y-3">
                    {detail?.benefits.map((benefit, idx) => {
                      const [title, desc] = benefit.split(': ');
                      return (
                        <div key={idx} className="flex items-start gap-2.5">
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
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
                    <Link to="/register" onClick={() => setSelectedFeature(null)} className="w-full block">
                      <Button variant="primary" className="w-full">
                        {detail?.actionText || 'Get Started'}
                      </Button>
                    </Link>
                    <button
                      onClick={() => setSelectedFeature(null)}
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
