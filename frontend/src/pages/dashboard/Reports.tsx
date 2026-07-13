import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Download, FileText, Plus, X, Check, ChevronRight,
  ArrowRight, Calendar, Layers, Sparkles, RefreshCw,
  FileSpreadsheet, AlertCircle, Clock, FolderOpen,
  Bug, Users, Gauge, Shield, Zap, ListChecks, CheckCircle2,
  TrendingUp, Eye,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

/* ────────────── Static Data ────────────── */

const existingReports = [
  { name: 'Project Status Report — Q2 2026', type: 'Project', format: 'PDF',   date: '2026-07-01', size: '2.4 MB' },
  { name: 'Sprint Alpha v2.3 Summary',        type: 'Sprint',  format: 'PDF',   date: '2026-06-30', size: '1.8 MB' },
  { name: 'Monthly Quality Report — June',    type: 'Quality', format: 'Excel', date: '2026-06-30', size: '3.1 MB' },
  { name: 'Bug Analysis Report',              type: 'Bug',     format: 'PDF',   date: '2026-06-28', size: '1.2 MB' },
  { name: 'Team Productivity Report',         type: 'Productivity', format: 'CSV', date: '2026-06-25', size: '0.8 MB' },
  { name: 'Employee Performance Review',      type: 'Employee', format: 'PDF',  date: '2026-06-20', size: '4.5 MB' },
];

const formatColors: Record<string, string> = {
  PDF:   'bg-red-50   text-red-600   dark:bg-red-950/30   dark:text-red-400',
  Excel: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
  CSV:   'bg-blue-50  text-blue-600  dark:bg-blue-950/30  dark:text-blue-400',
};

/* ────────────── Report Types Config ────────────── */

const REPORT_TYPES = [
  {
    id: 'project',
    label: 'Project Report',
    desc: 'Status, milestones, and deliverables overview',
    icon: FolderOpen,
    color: 'from-indigo-500 to-blue-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/25',
    sections: ['Executive Summary', 'Milestone Timeline', 'Budget Tracking', 'Risk Assessment', 'Team Allocation'],
  },
  {
    id: 'sprint',
    label: 'Sprint Report',
    desc: 'Burndown, velocity, and task completion',
    icon: Zap,
    color: 'from-primary-500 to-violet-500',
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/25',
    sections: ['Sprint Goals', 'Burndown Chart', 'Velocity Trend', 'Completed Tasks', 'Carryover Items'],
  },
  {
    id: 'task',
    label: 'Task Report',
    desc: 'Task breakdown, statuses, and owner metrics',
    icon: ListChecks,
    color: 'from-cyan-500 to-teal-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/25',
    sections: ['Task Overview', 'Status Distribution', 'Priority Breakdown', 'Assignee Workload', 'Overdue Tasks'],
  },
  {
    id: 'employee',
    label: 'Employee Report',
    desc: 'Individual performance and contribution data',
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/25',
    sections: ['Performance Scorecard', 'Task Completion Rate', 'Attendance Log', 'Code Review Stats', 'Feedback Summary'],
  },
  {
    id: 'productivity',
    label: 'Productivity Report',
    desc: 'Team throughput, cycle time, and efficiency',
    icon: Gauge,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    sections: ['Throughput Analysis', 'Cycle Time', 'Lead Time', 'WIP Metrics', 'Bottleneck Analysis'],
  },
  {
    id: 'quality',
    label: 'Quality Report',
    desc: 'Test results, coverage, and defect density',
    icon: Shield,
    color: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    sections: ['Test Execution Summary', 'Pass/Fail Rate', 'Code Coverage', 'Defect Density', 'SLA Compliance'],
  },
  {
    id: 'bug',
    label: 'Bug Report',
    desc: 'Defect trends, severity, and resolution time',
    icon: Bug,
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    sections: ['Defect Overview', 'Severity Matrix', 'Resolution Time', 'Open vs Closed', 'Root Cause Analysis'],
  },
];

const OUTPUT_FORMATS = [
  { id: 'PDF',   label: 'PDF',   sub: 'Best for sharing & printing', icon: FileText,       color: 'text-red-500',     border: 'border-red-500/30',     bg: 'bg-red-500/5' },
  { id: 'Excel', label: 'Excel', sub: 'Best for data analysis',      icon: FileSpreadsheet, color: 'text-emerald-500', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
  { id: 'CSV',   label: 'CSV',   sub: 'Best for raw data export',    icon: Layers,          color: 'text-blue-500',    border: 'border-blue-500/30',    bg: 'bg-blue-500/5' },
];

const DATE_PRESETS = [
  { label: 'Last 7 days',   value: '7d' },
  { label: 'Last 30 days',  value: '30d' },
  { label: 'Last Quarter',  value: 'q' },
  { label: 'This Year',     value: 'y' },
  { label: 'Custom Range',  value: 'custom' },
];

const STEPS = ['Report Type', 'Configure', 'Format', 'Generate'];

/* ────────────── Generate Report Modal ────────────── */

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (report: { name: string; type: string; format: string; date: string; size: string }) => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ isOpen, onClose, onGenerated }) => {
  const [step, setStep] = useState(0);

  // Step 1
  const [selectedType, setSelectedType] = useState<string>('');

  // Step 2
  const [reportTitle, setReportTitle] = useState('');
  const [datePreset, setDatePreset] = useState('30d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);

  // Step 3
  const [outputFormat, setOutputFormat] = useState('PDF');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [watermark, setWatermark] = useState(false);
  const [confidential, setConfidential] = useState(false);

  // Step 4 — generation
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genDone, setGenDone] = useState(false);
  const [genPhase, setGenPhase] = useState('');

  const GEN_PHASES = [
    'Fetching project data...',
    'Applying date filters...',
    'Computing analytics...',
    'Rendering charts...',
    'Compiling sections...',
    'Exporting to ' + outputFormat + '...',
    'Finalising document...',
  ];

  const typeConfig = REPORT_TYPES.find(t => t.id === selectedType);

  // Pre-select all sections when type changes
  useEffect(() => {
    if (typeConfig) setSelectedSections([...typeConfig.sections]);
  }, [selectedType]);

  // Auto-fill title
  useEffect(() => {
    if (typeConfig && !reportTitle) {
      const now = new Date();
      setReportTitle(`${typeConfig.label} — ${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`);
    }
  }, [selectedType]);

  const toggleSection = (s: string) =>
    setSelectedSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleNext = () => {
    if (step === 0 && !selectedType) return;
    if (step < 3) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
    if (step === 3) { setGenDone(false); setGenProgress(0); }
  };

  const handleGenerate = () => {
    setGenerating(true);
    setGenProgress(0);
    setGenDone(false);
    let phase = 0;
    setGenPhase(GEN_PHASES[0]);

    const interval = setInterval(() => {
      setGenProgress(prev => {
        const next = prev + Math.random() * 15 + 5;
        if (next >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setGenDone(true);
          setGenProgress(100);
          return 100;
        }
        // advance phase text
        const newPhase = Math.floor((next / 100) * GEN_PHASES.length);
        if (newPhase !== phase && newPhase < GEN_PHASES.length) {
          phase = newPhase;
          setGenPhase(GEN_PHASES[newPhase]);
        }
        return next;
      });
    }, 200);
  };

  const handleDownload = () => {
    const title = reportTitle || `${typeConfig?.label} Report`;
    const sizes = { PDF: '2.3 MB', Excel: '1.1 MB', CSV: '0.4 MB' };
    
    // Trigger real file download or printing options
    if (outputFormat === 'PDF') {
      window.print();
    } else {
      const csvContent = 
        `QualityDesk Export: ${title}\n` +
        `Report Type,${typeConfig?.label || 'General'}\n` +
        `Generated Date,${new Date().toLocaleString()}\n` +
        `Confidential,${confidential ? 'Yes' : 'No'}\n\n` +
        `Metric,Target,Value,Status\n` +
        `Code Coverage,80%,87%,PASSED\n` +
        `Requirement Coverage,100%,95%,WARNING\n` +
        `Test Coverage,90%,92%,PASSED\n` +
        `Technical Debt,0 Days,1.5 Days,WARNING\n` +
        `Code Smells,0,12,PASSED\n` +
        `Duplication Threshold,<3%,0.8%,PASSED\n`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    onGenerated({
      name: title,
      type: typeConfig?.label.replace(' Report', '') || '',
      format: outputFormat,
      date: new Date().toISOString().split('T')[0],
      size: sizes[outputFormat as keyof typeof sizes] || '1.0 MB',
    });
    handleReset();
  };

  const handleReset = () => {
    setStep(0); setSelectedType(''); setReportTitle(''); setDatePreset('30d');
    setStartDate(''); setEndDate(''); setSelectedSections([]); setIncludeCharts(true);
    setIncludeSummary(true); setOutputFormat('PDF'); setOrientation('portrait');
    setWatermark(false); setConfidential(false); setGenerating(false);
    setGenProgress(0); setGenDone(false); setGenPhase('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          onClick={!generating ? handleReset : undefined}
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.18 }}
          className="relative w-full max-w-3xl flex flex-col bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh]"
        >
          {/* Gradient top bar */}
          <div className={`h-1 w-full shrink-0 bg-gradient-to-r ${typeConfig ? typeConfig.color : 'from-primary-500 via-purple-500 to-accent-500'} transition-all duration-500`} />

          {/* Header */}
          <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${typeConfig ? `${typeConfig.bg} ${typeConfig.border}` : 'bg-primary-500/10 border-primary-500/20'} transition-all duration-300`}>
                {typeConfig
                  ? <typeConfig.icon className="h-5 w-5 text-primary-500" />
                  : <BarChart3 className="h-5 w-5 text-primary-500" />}
              </div>
              <div>
                <h2 className="text-xl font-black font-display text-slate-900 dark:text-white">Generate Report</h2>
                <p className="text-xs text-slate-400 mt-0.5">Configure and export your analytics report</p>
              </div>
            </div>
            <button
              onClick={!generating ? handleReset : undefined}
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
                  onClick={() => { if (i < step && !generating) setStep(i); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    i === step ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10'
                    : i < step ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 cursor-pointer'
                    : 'text-slate-400 cursor-default'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    i < step ? 'bg-emerald-500 text-white'
                    : i === step ? 'bg-primary-500 text-white'
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

                {/* ── STEP 1: Report Type ── */}
                {step === 0 && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">Choose the type of report you want to generate</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {REPORT_TYPES.map(type => {
                        const Icon = type.icon;
                        const isSelected = selectedType === type.id;
                        return (
                          <motion.button
                            key={type.id}
                            type="button"
                            onClick={() => setSelectedType(type.id)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? `${type.bg} ${type.border} shadow-sm`
                                : 'border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <div className={`p-2.5 rounded-xl shrink-0 ${isSelected ? `${type.bg} border ${type.border}` : 'bg-slate-100 dark:bg-slate-800'}`}>
                              <Icon className={`h-5 w-5 ${isSelected ? 'text-primary-500' : 'text-slate-400'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                {type.label}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{type.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? 'border-primary-500 bg-primary-500' : 'border-slate-300 dark:border-slate-600'
                            }`}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Configure ── */}
                {step === 1 && typeConfig && (
                  <div className="space-y-6">
                    {/* Report title */}
                    <Input
                      label="Report Title"
                      value={reportTitle}
                      onChange={e => setReportTitle(e.target.value)}
                      placeholder="e.g. Sprint Alpha v2.4 Summary"
                      icon={<FileText className="h-4 w-4" />}
                    />

                    {/* Date range */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Date Range
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {DATE_PRESETS.map(p => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => setDatePreset(p.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                              datePreset === p.value
                                ? 'bg-primary-500/10 border-primary-500/30 text-primary-600 dark:text-primary-400'
                                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                      {datePreset === 'custom' && (
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input label="Start Date" type="date" value={startDate}
                            onChange={e => setStartDate(e.target.value)} icon={<Calendar className="h-4 w-4" />} />
                          <Input label="End Date" type="date" value={endDate}
                            onChange={e => setEndDate(e.target.value)} icon={<Calendar className="h-4 w-4" />} />
                        </div>
                      )}
                    </div>

                    {/* Sections */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Sections to Include
                        </label>
                        <button
                          type="button"
                          onClick={() => setSelectedSections(
                            selectedSections.length === typeConfig.sections.length ? [] : [...typeConfig.sections]
                          )}
                          className="text-[10px] text-primary-500 font-bold cursor-pointer hover:underline"
                        >
                          {selectedSections.length === typeConfig.sections.length ? 'Deselect all' : 'Select all'}
                        </button>
                      </div>
                      <div className="space-y-2">
                        {typeConfig.sections.map(section => {
                          const on = selectedSections.includes(section);
                          return (
                            <button
                              key={section}
                              type="button"
                              onClick={() => toggleSection(section)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                                on
                                  ? 'border-primary-500/30 bg-primary-500/5'
                                  : 'border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                on ? 'border-primary-500 bg-primary-500' : 'border-slate-300 dark:border-slate-600'
                              }`}>
                                {on && <Check className="h-2.5 w-2.5 text-white" />}
                              </div>
                              <span className={`text-sm font-medium ${on ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{section}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Include Charts & Graphs', sub: 'Visual data representations', state: includeCharts, set: setIncludeCharts },
                        { label: 'Include Executive Summary', sub: 'High-level overview section', state: includeSummary, set: setIncludeSummary },
                      ].map(t => (
                        <div key={t.label} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">{t.label}</p>
                            <p className="text-[10px] text-slate-400">{t.sub}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => t.set(!t.state)}
                            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0 ${
                              t.state ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          >
                            <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow ${t.state ? 'translate-x-4.5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Format & Output ── */}
                {step === 2 && (
                  <div className="space-y-6">
                    {/* Output format */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
                        Output Format
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {OUTPUT_FORMATS.map(fmt => {
                          const Icon = fmt.icon;
                          const isSelected = outputFormat === fmt.id;
                          return (
                            <motion.button
                              key={fmt.id}
                              type="button"
                              onClick={() => setOutputFormat(fmt.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? `${fmt.bg} ${fmt.border}`
                                  : 'border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              <div className={`p-2.5 rounded-xl ${isSelected ? fmt.bg : 'bg-slate-100 dark:bg-slate-800'}`}>
                                <Icon className={`h-6 w-6 ${isSelected ? fmt.color : 'text-slate-400'}`} />
                              </div>
                              <p className={`text-sm font-black ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{fmt.label}</p>
                              <p className="text-[10px] text-slate-400 leading-tight">{fmt.sub}</p>
                              {isSelected && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${fmt.bg} ${fmt.color}`}>Selected</span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Page orientation (PDF only) */}
                    {outputFormat === 'PDF' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Page Orientation
                        </label>
                        <div className="flex gap-3">
                          {(['portrait', 'landscape'] as const).map(o => (
                            <button
                              key={o}
                              type="button"
                              onClick={() => setOrientation(o)}
                              className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer capitalize ${
                                orientation === o
                                  ? 'bg-primary-500/8 border-primary-500/30 text-primary-600 dark:text-primary-400'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                            >
                              <div className={`border-2 rounded ${orientation === o ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'} ${
                                o === 'portrait' ? 'w-4 h-5' : 'w-5 h-4'
                              }`} />
                              {o}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extra options */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
                        Additional Options
                      </label>
                      <div className="space-y-2.5">
                        {[
                          { label: 'Add Watermark', sub: 'Stamp "CONFIDENTIAL" on each page', state: watermark, set: setWatermark },
                          { label: 'Mark as Confidential', sub: 'Restrict sharing — internal use only', state: confidential, set: setConfidential },
                        ].map(opt => (
                          <div key={opt.label} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                            <div>
                              <p className="text-xs font-bold text-slate-800 dark:text-white">{opt.label}</p>
                              <p className="text-[10px] text-slate-400">{opt.sub}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => opt.set(!opt.state)}
                              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0 ${
                                opt.state ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                              }`}
                            >
                              <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow ${opt.state ? 'translate-x-4.5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preview card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-500/6 to-purple-500/4 border border-primary-500/12">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="h-4 w-4 text-primary-400" />
                        <p className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">Output Preview</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        {[
                          { label: 'Type', value: typeConfig?.label || '—' },
                          { label: 'Format', value: outputFormat },
                          { label: 'Sections', value: `${selectedSections.length} sections` },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">{label}</p>
                            <p className="text-xs font-black text-slate-800 dark:text-white mt-0.5">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Generate ── */}
                {step === 3 && (
                  <div className="space-y-6">
                    {!genDone && !generating && (
                      <>
                        {/* Final summary */}
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500/8 to-purple-500/5 border border-primary-500/15 space-y-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary-500" />
                            <p className="text-sm font-black text-slate-900 dark:text-white">Ready to Generate</p>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {[
                              { label: 'Report Title', value: reportTitle || `${typeConfig?.label}` },
                              { label: 'Report Type',  value: typeConfig?.label || '—' },
                              { label: 'Date Range',   value: DATE_PRESETS.find(d => d.value === datePreset)?.label || 'Custom' },
                              { label: 'Format',       value: outputFormat },
                              { label: 'Sections',     value: `${selectedSections.length} of ${typeConfig?.sections.length}` },
                              { label: 'Charts',       value: includeCharts ? 'Included' : 'Excluded' },
                            ].map(({ label, value }) => (
                              <div key={label} className="flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary-400 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</p>
                                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{value}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            Generation may take a few seconds depending on data volume and section count.
                          </p>
                        </div>
                      </>
                    )}

                    {/* Generation progress */}
                    {(generating || genDone) && (
                      <div className="space-y-5">
                        {/* Animated icon */}
                        <div className="flex flex-col items-center gap-4 py-4">
                          <div className={`relative w-20 h-20 rounded-full flex items-center justify-center ${genDone ? 'bg-emerald-500/10' : 'bg-primary-500/10'}`}>
                            {genDone ? (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}>
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                              </motion.div>
                            ) : (
                              <>
                                <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
                                <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 animate-ping" />
                              </>
                            )}
                          </div>
                          <div className="text-center">
                            <p className={`text-lg font-black font-display ${genDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                              {genDone ? 'Report Generated!' : 'Generating Report...'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {genDone ? `Your ${outputFormat} report is ready to download.` : genPhase}
                            </p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className={genDone ? 'text-emerald-500' : 'text-primary-500'}>
                              {genDone ? 'Complete' : 'Processing...'}
                            </span>
                            <span className={`font-mono ${genDone ? 'text-emerald-500' : 'text-primary-500'}`}>{Math.round(genProgress)}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${genDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary-500 to-purple-500'}`}
                              initial={{ width: '0%' }}
                              animate={{ width: `${genProgress}%` }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                            />
                          </div>
                        </div>

                        {/* Steps checklist */}
                        <div className="space-y-2">
                          {GEN_PHASES.map((phase, i) => {
                            const phaseProgress = (i / GEN_PHASES.length) * 100;
                            const done = genProgress > phaseProgress + (100 / GEN_PHASES.length);
                            const active = !done && genProgress >= phaseProgress;
                            return (
                              <div key={phase} className={`flex items-center gap-2.5 text-xs transition-all ${done ? 'text-emerald-500' : active ? 'text-primary-500 font-bold' : 'text-slate-400'}`}>
                                {done
                                  ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                  : active
                                  ? <RefreshCw className="h-3.5 w-3.5 shrink-0 animate-spin" />
                                  : <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />}
                                {phase}
                              </div>
                            );
                          })}
                        </div>

                        {/* Download block */}
                        {genDone && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-emerald-500/10">
                                {outputFormat === 'PDF' ? <FileText className="h-5 w-5 text-emerald-500" />
                                  : outputFormat === 'Excel' ? <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                                  : <Layers className="h-5 w-5 text-emerald-500" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">
                                  {reportTitle || `${typeConfig?.label}`}
                                </p>
                                <p className="text-[10px] text-slate-400">{outputFormat} • Ready</p>
                              </div>
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<Download className="h-4 w-4" />}
                              onClick={handleDownload}
                            >
                              Download
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    )}
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
              disabled={generating}
            >
              {step === 0 ? 'Cancel' : '← Back'}
            </Button>

            <div className="flex items-center gap-3">
              {/* Step dots */}
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${
                    i === step ? 'w-5 bg-primary-500'
                    : i < step ? 'w-1.5 bg-emerald-400'
                    : 'w-1.5 bg-slate-300 dark:bg-slate-600'
                  }`} />
                ))}
              </div>

              {step < 3 && (
                <Button
                  variant="primary"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={handleNext}
                  disabled={step === 0 && !selectedType}
                >
                  Next: {STEPS[step + 1]}
                </Button>
              )}

              {step === 3 && !generating && !genDone && (
                <Button
                  variant="primary"
                  leftIcon={<BarChart3 className="h-4 w-4" />}
                  onClick={handleGenerate}
                >
                  Generate {outputFormat}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ────────────── Main Reports Page ────────────── */

export const Reports: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [reportList, setReportList] = useState(existingReports);
  const [toast, setToast] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const handleGenerated = (report: typeof existingReports[0]) => {
    setReportList(prev => [report, ...prev]);
    setToast(`"${report.name}" generated successfully!`);
    setTimeout(() => setToast(null), 4500);
  };

  const FILTERS = ['All', 'Project', 'Sprint', 'Quality', 'Bug', 'Productivity', 'Employee'];
  const filtered = activeFilter === 'All' ? reportList : reportList.filter(r => r.type === activeFilter);

  const TYPE_ICONS: Record<string, React.ReactNode> = {
    Project: <FolderOpen className="h-4.5 w-4.5" />,
    Sprint:  <Zap className="h-4.5 w-4.5" />,
    Quality: <Shield className="h-4.5 w-4.5" />,
    Bug:     <Bug className="h-4.5 w-4.5" />,
    Productivity: <Gauge className="h-4.5 w-4.5" />,
    Employee: <Users className="h-4.5 w-4.5" />,
    Task:    <ListChecks className="h-4.5 w-4.5" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and download detailed reports in PDF, Excel, or CSV.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-5 w-5" />} onClick={() => setShowModal(true)}>
          Generate Report
        </Button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report type quick-launch cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {REPORT_TYPES.map(type => {
          const Icon = type.icon;
          return (
            <motion.button
              key={type.id}
              type="button"
              whileHover={{ y: -2 }}
              onClick={() => setShowModal(true)}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 hover:border-primary-500/30 bg-white dark:bg-surface-900 hover:bg-primary-500/3 transition-all cursor-pointer text-center"
            >
              <div className={`p-2 rounded-xl ${type.bg} border ${type.border}`}>
                <Icon className="h-5 w-5 text-primary-500" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">{type.label.replace(' Report', '')}</p>
              <p className="text-[9px] text-slate-400">Report</p>
            </motion.button>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Reports', value: reportList.length, icon: FileText,   color: 'text-primary-500', bg: 'bg-primary-500/10' },
          { label: 'This Month',    value: reportList.filter(r => r.date.startsWith('2026-07')).length, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'PDF Reports',   value: reportList.filter(r => r.format === 'PDF').length, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} padding="sm">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${s.bg}`}><Icon className={`h-4.5 w-4.5 ${s.color}`} /></div>
                <div>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-[10px] text-slate-400">{s.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Reports list */}
      <Card padding="none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Generated Reports</h3>
          {/* Filter tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <AnimatePresence>
            {filtered.map((report, i) => (
              <motion.div
                key={`${report.name}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-surface-800/50 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-500">
                  {TYPE_ICONS[report.type] || <FileText className="h-4.5 w-4.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{report.name}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3 w-3" />{report.date} • {report.size}
                  </p>
                </div>
                <Badge variant="default" size="sm">{report.type}</Badge>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${formatColors[report.format] || ''}`}>
                  {report.format}
                </span>
                <button className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-950/30 text-slate-400 hover:text-primary-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                  <Download className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">
              No reports found for <span className="font-bold">{activeFilter}</span>.
            </div>
          )}
        </div>
      </Card>

      {/* Modal */}
      <GenerateReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onGenerated={handleGenerated}
      />
    </div>
  );
};
