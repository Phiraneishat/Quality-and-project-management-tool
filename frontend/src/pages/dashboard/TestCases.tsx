import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TestTube, Plus, CheckCircle, XCircle, Ban, Clock, FileText,
  X, Check, ChevronRight, ArrowRight, Upload, AlertCircle,
  CheckCircle2, RefreshCw, Download, Layers, Code2, FlaskConical,
  Play, Pause, Settings2, MoreVertical, Trash2, Edit2, Eye,
  FolderOpen, Tag, Users, Zap, Hash, ListChecks, Search, Filter,
  ChevronDown, Globe,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/Shared';
import { StatCard } from '../../components/ui/StatCard';
import { Input, Textarea } from '../../components/ui/Input';

/* ─────────────── Types ─────────────── */
interface TestSuite {
  id: string;
  name: string;
  project: string;
  description?: string;
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  notExec: number;
  isAutomated: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  owner?: string;
  lastRun?: string;
  status: 'active' | 'draft' | 'archived';
}

/* ─────────────── Seed Data ─────────────── */
const SEED_SUITES: TestSuite[] = [
  { id: '1', name: 'Authentication Tests',  project: 'E-Commerce',   total: 45, passed: 42, failed: 2, blocked: 1, notExec: 0, isAutomated: true,  priority: 'critical', tags: ['auth', 'security'], owner: 'Alice Johnson', lastRun: '2026-07-06', status: 'active',   description: 'Full coverage of login, logout, MFA, and session management flows.' },
  { id: '2', name: 'Dashboard UI Tests',    project: 'QualityDesk',  total: 32, passed: 28, failed: 3, blocked: 0, notExec: 1, isAutomated: false, priority: 'high',     tags: ['ui', 'regression'], owner: 'Charlie Brown', lastRun: '2026-07-05', status: 'active',   description: 'Visual and functional tests for all dashboard components.' },
  { id: '3', name: 'Payment Integration',   project: 'E-Commerce',   total: 28, passed: 25, failed: 1, blocked: 2, notExec: 0, isAutomated: true,  priority: 'critical', tags: ['payment', 'stripe'], owner: 'Bob Smith',    lastRun: '2026-07-05', status: 'active',   description: 'End-to-end payment flow tests including Stripe and PayPal.' },
  { id: '4', name: 'Mobile Responsive',     project: 'Mobile App',   total: 38, passed: 30, failed: 5, blocked: 1, notExec: 2, isAutomated: false, priority: 'medium',   tags: ['mobile', 'responsive'], owner: 'Grace Hopper', lastRun: '2026-07-04', status: 'active', description: 'Layout tests across iOS, Android breakpoints.' },
  { id: '5', name: 'API Endpoint Tests',    project: 'E-Commerce',   total: 56, passed: 54, failed: 2, blocked: 0, notExec: 0, isAutomated: true,  priority: 'high',     tags: ['api', 'rest'], owner: 'Diana Prince', lastRun: '2026-07-06', status: 'active',        description: 'REST API contract tests for all public endpoints.' },
];

const PROJECTS  = ['E-Commerce', 'QualityDesk', 'Mobile App', 'Analytics', 'DevOps Platform', 'CRM Tool'];
const OWNERS    = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Grace Hopper'];
const PRIORITIES = ['critical', 'high', 'medium', 'low'] as const;
const IMPORT_FORMATS = [
  { id: 'csv',    label: 'CSV',          icon: FileText,     ext: '.csv',  desc: 'Comma-separated values' },
  { id: 'excel',  label: 'Excel',        icon: Layers,       ext: '.xlsx', desc: 'Microsoft Excel workbook' },
  { id: 'json',   label: 'JSON',         icon: Code2,        ext: '.json', desc: 'JSON test case format' },
  { id: 'xml',    label: 'XML / JUnit',  icon: Globe,        ext: '.xml',  desc: 'JUnit XML report' },
  { id: 'gherkin',label: 'Gherkin / BDD',icon: FlaskConical, ext: '.feature', desc: 'Cucumber feature files' },
];

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'text-red-500   bg-red-500/10   border-red-500/20',
  high:     'text-orange-500 bg-orange-500/10 border-orange-500/20',
  medium:   'text-amber-500  bg-amber-500/10  border-amber-500/20',
  low:      'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
};

const STATUS_COLORS: Record<string, string> = {
  active:   'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  draft:    'text-slate-500   bg-slate-500/10   border-slate-500/20',
  archived: 'text-violet-500  bg-violet-500/10  border-violet-500/20',
};

function mkId() { return Math.random().toString(36).slice(2, 9); }

/* ═══════════════ IMPORT MODAL ═══════════════ */
interface ImportModalProps { isOpen: boolean; onClose: () => void; onImported: (count: number, suiteName: string) => void; }

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImported }) => {
  const [format, setFormat]         = useState('csv');
  const [dragging, setDragging]     = useState(false);
  const [file, setFile]             = useState<File | null>(null);
  const [targetProject, setTarget]  = useState('');
  const [targetSuite, setTargetSuite] = useState('');
  const [overwrite, setOverwrite]   = useState(false);
  const [importing, setImporting]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [done, setDone]             = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedFormat = IMPORT_FORMATS.find(f => f.id === format)!;

  const handleFile = (f: File) => setFile(f);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const simulateImport = () => {
    if (!file && !targetSuite) return;
    setImporting(true);
    setProgress(0);
    const total = Math.floor(Math.random() * 30) + 10;
    let cur = 0;
    const iv = setInterval(() => {
      cur += Math.random() * 20 + 5;
      if (cur >= 100) {
        clearInterval(iv);
        setProgress(100);
        setImporting(false);
        setDone(true);
        setImportedCount(total);
      } else {
        setProgress(Math.min(cur, 99));
      }
    }, 150);
  };

  const handleFinish = () => {
    onImported(importedCount, targetSuite || (file?.name ?? 'Imported Suite'));
    handleReset();
  };

  const handleReset = () => {
    setFormat('csv'); setDragging(false); setFile(null);
    setTarget(''); setTargetSuite(''); setOverwrite(false);
    setImporting(false); setProgress(0); setDone(false); setImportedCount(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={!importing ? handleReset : undefined} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.18 }}
          className="relative w-full max-w-xl flex flex-col bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh]"
        >
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-primary-500 to-violet-500 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Upload className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-black font-display text-slate-900 dark:text-white">Import Test Cases</h2>
                <p className="text-xs text-slate-400 mt-0.5">Upload test cases from a file or external tool</p>
              </div>
            </div>
            <button onClick={!importing ? handleReset : undefined} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {!done && !importing && (
              <>
                {/* Format selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Import Format</label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {IMPORT_FORMATS.map(f => {
                      const Icon = f.icon;
                      return (
                        <button key={f.id} type="button" onClick={() => setFormat(f.id)}
                          className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            format === f.id
                              ? 'bg-primary-500/10 border-primary-500/30 text-primary-600 dark:text-primary-400'
                              : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}>
                          <Icon className="h-4 w-4" />
                          <p className="text-[10px] font-bold">{f.label}</p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">Accepted: <span className="font-mono">{selectedFormat.ext}</span> — {selectedFormat.desc}</p>
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                    dragging ? 'border-primary-500 bg-primary-500/5' : file
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary-500/50 hover:bg-primary-500/3'
                  }`}
                >
                  <input ref={fileRef} type="file" className="hidden"
                    accept={selectedFormat.ext}
                    onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
                  {file ? (
                    <>
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB · Ready to import</p>
                      </div>
                      <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                        className="text-[10px] text-rose-500 font-bold hover:underline cursor-pointer">Remove file</button>
                    </>
                  ) : (
                    <>
                      <div className={`p-4 rounded-2xl ${dragging ? 'bg-primary-500/15' : 'bg-slate-100 dark:bg-slate-800'} transition-colors`}>
                        <Upload className={`h-8 w-8 ${dragging ? 'text-primary-500' : 'text-slate-400'}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {dragging ? 'Drop your file here' : 'Drag & drop or click to browse'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Supports {selectedFormat.label} ({selectedFormat.ext})</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Target */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Target Project</label>
                    <select value={targetProject} onChange={e => setTarget(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer">
                      <option value="">Select project…</option>
                      {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <Input label="Target Suite Name" placeholder="e.g. Regression Suite v2"
                    value={targetSuite} onChange={e => setTargetSuite(e.target.value)}
                    icon={<TestTube className="h-4 w-4" />} />
                </div>

                {/* Overwrite toggle */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Overwrite existing test cases</p>
                    <p className="text-[10px] text-slate-400">Update matching tests by name instead of creating duplicates</p>
                  </div>
                  <button type="button" onClick={() => setOverwrite(o => !o)}
                    className={`w-10 h-5.5 rounded-full p-0.5 flex items-center transition-colors cursor-pointer shrink-0 ${overwrite ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow ${overwrite ? 'translate-x-4.5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Info tip */}
                <div className="flex items-start gap-2.5 p-3.5 bg-blue-500/5 border border-blue-500/15 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                    Download our <span className="font-bold underline cursor-pointer">template file</span> to ensure your data matches the expected format before importing.
                  </p>
                </div>
              </>
            )}

            {/* Import progress */}
            {(importing || done) && (
              <div className="space-y-5 py-2">
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className={`relative w-20 h-20 rounded-full flex items-center justify-center ${done ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
                    {done
                      ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}><CheckCircle2 className="h-10 w-10 text-emerald-500" /></motion.div>
                      : <><RefreshCw className="h-8 w-8 text-blue-500 animate-spin" /><div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" /></>}
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-black font-display ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {done ? `${importedCount} Test Cases Imported!` : 'Importing…'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {done ? `Successfully added to "${targetSuite || 'New Suite'}"` : `Processing ${file?.name ?? 'file'}…`}
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={done ? 'text-emerald-500' : 'text-blue-500'}>{done ? 'Complete' : 'Processing…'}</span>
                    <span className={`font-mono ${done ? 'text-emerald-500' : 'text-blue-500'}`}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-primary-500'}`}
                      initial={{ width: '0%' }} animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.3 }} />
                  </div>
                </div>
                {done && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-3 text-center p-4 bg-emerald-500/6 border border-emerald-500/15 rounded-2xl">
                    {[
                      { label: 'Imported', value: importedCount },
                      { label: 'Skipped', value: overwrite ? 0 : 0 },
                      { label: 'Errors', value: 0 },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-lg font-black text-slate-900 dark:text-white">{value}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{label}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-950/30 shrink-0">
            <Button variant="ghost" onClick={!importing ? handleReset : undefined} disabled={importing}>Cancel</Button>
            {!importing && !done && (
              <Button variant="primary" leftIcon={<Upload className="h-4 w-4" />}
                onClick={simulateImport}
                disabled={!file && !targetSuite}>
                Import Test Cases
              </Button>
            )}
            {done && (
              <Button variant="primary" leftIcon={<Check className="h-4 w-4" />} onClick={handleFinish}>
                Done
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ═══════════════ NEW TEST SUITE MODAL ═══════════════ */
const SUITE_STEPS = ['Details', 'Configuration', 'Test Cases', 'Review'];

interface NewTestSuiteModalProps { isOpen: boolean; onClose: () => void; onCreated: (suite: TestSuite) => void; }

const NewTestSuiteModal: React.FC<NewTestSuiteModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [step, setStep] = useState(0);

  // Step 1 — Details
  const [name, setName]         = useState('');
  const [project, setProject]   = useState('');
  const [description, setDesc]  = useState('');
  const [owner, setOwner]       = useState('');

  // Step 2 — Config
  const [isAutomated, setIsAutomated] = useState(false);
  const [priority, setPriority]       = useState<typeof PRIORITIES[number]>('medium');
  const [status, setStatus]           = useState<'active' | 'draft'>('active');
  const [tagInput, setTagInput]       = useState('');
  const [tags, setTags]               = useState<string[]>([]);

  // Step 3 — Test cases
  const [tcTitle, setTcTitle]   = useState('');
  const [tcList, setTcList]     = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTag  = (t: string) => { const c = t.trim(); if (c && !tags.includes(c)) setTags(p => [...p, c]); setTagInput(''); };
  const addTc   = () => { const c = tcTitle.trim(); if (c) { setTcList(p => [...p, c]); setTcTitle(''); } };

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!name.trim()) e.name = 'Suite name is required';
      if (!project) e.project = 'Project is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate(step)) setStep(s => s + 1); };
  const handleBack = () => setStep(s => s - 1);

  const handleCreate = () => {
    onCreated({
      id: mkId(), name: name.trim(), project, description,
      total: tcList.length, passed: 0, failed: 0, blocked: 0, notExec: tcList.length,
      isAutomated, priority, tags, owner, status,
      lastRun: undefined,
    });
    handleReset();
  };

  const handleReset = () => {
    setStep(0); setName(''); setProject(''); setDesc(''); setOwner('');
    setIsAutomated(false); setPriority('medium'); setStatus('active');
    setTagInput(''); setTags([]); setTcTitle(''); setTcList([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={handleReset} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.18 }}
          className="relative w-full max-w-2xl flex flex-col bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh]"
        >
          <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-violet-500 to-emerald-500 shrink-0" />

          {/* Header */}
          <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <FlaskConical className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h2 className="text-xl font-black font-display text-slate-900 dark:text-white">New Test Suite</h2>
                <p className="text-xs text-slate-400 mt-0.5">Create a structured collection of test cases</p>
              </div>
            </div>
            <button onClick={handleReset} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer transition-colors"><X className="h-5 w-5" /></button>
          </div>

          {/* Step tabs */}
          <div className="flex items-center gap-0 px-7 py-4 bg-slate-50/50 dark:bg-surface-950/30 border-b border-slate-100 dark:border-slate-800 shrink-0">
            {SUITE_STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <button onClick={() => { if (i < step) setStep(i); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    i === step ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10'
                    : i < step ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/5 cursor-pointer'
                    : 'text-slate-400 cursor-default'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                    {i < step ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  {s}
                </button>
                {i < SUITE_STEPS.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 mx-1 shrink-0" />}
              </React.Fragment>
            ))}
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-7 py-6">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

                {/* STEP 1 — Details */}
                {step === 0 && (
                  <div className="space-y-4">
                    <Input label="Suite Name *" placeholder="e.g. Smoke Test Suite v3"
                      value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                      error={errors.name} icon={<FlaskConical className="h-4 w-4" />} />
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Project *</label>
                      <select value={project} onChange={e => { setProject(e.target.value); setErrors(p => ({ ...p, project: '' })); }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer">
                        <option value="">Select a project…</option>
                        {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      {errors.project && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.project}</p>}
                    </div>
                    <Textarea label="Description (optional)" placeholder="Describe the scope and purpose of this test suite…"
                      value={description} onChange={e => setDesc(e.target.value)} />
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Assign Owner</label>
                      <select value={owner} onChange={e => setOwner(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer">
                        <option value="">Unassigned</option>
                        {OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* STEP 2 — Configuration */}
                {step === 1 && (
                  <div className="space-y-5">
                    {/* Priority */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Priority</label>
                      <div className="grid grid-cols-4 gap-2">
                        {PRIORITIES.map(p => (
                          <button key={p} type="button" onClick={() => setPriority(p)}
                            className={`px-3 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                              priority === p ? `${PRIORITY_COLORS[p]} border-current/40` : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['active', 'draft'] as const).map(s => (
                          <button key={s} type="button" onClick={() => setStatus(s)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                              status === s ? `${STATUS_COLORS[s]} border-current/40` : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}>
                            <div className={`w-2 h-2 rounded-full ${s === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Automated toggle */}
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Automated Test Suite</p>
                        <p className="text-[10px] text-slate-400">Mark as automated — runs via CI/CD pipeline</p>
                      </div>
                      <button type="button" onClick={() => setIsAutomated(a => !a)}
                        className={`w-10 h-5.5 rounded-full p-0.5 flex items-center transition-colors cursor-pointer shrink-0 ${isAutomated ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow ${isAutomated ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Tags</label>
                      <div className="flex gap-2 mb-2">
                        <input placeholder="Add tag and press Enter…" value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
                        <Button variant="outline" size="sm" onClick={() => addTag(tagInput)}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['regression', 'smoke', 'e2e', 'api', 'ui', 'security', 'performance'].filter(t => !tags.includes(t)).map(t => (
                          <button key={t} type="button" onClick={() => addTag(t)}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:border-primary-500/40 hover:text-primary-500 transition-all cursor-pointer">
                            + {t}
                          </button>
                        ))}
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {tags.map(t => (
                            <span key={t} className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 text-xs font-bold text-primary-600 dark:text-primary-400">
                              {t}
                              <button onClick={() => setTags(p => p.filter(x => x !== t))} className="hover:text-rose-500 cursor-pointer"><X className="h-3 w-3" /></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3 — Test Cases */}
                {step === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">Add individual test case titles to pre-populate the suite. You can always add more later.</p>
                    <div className="flex gap-2">
                      <Input placeholder="e.g. Verify login with valid credentials" value={tcTitle}
                        onChange={e => setTcTitle(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addTc(); } }}
                        icon={<ListChecks className="h-4 w-4" />} />
                      <Button variant="outline" onClick={addTc}>Add</Button>
                    </div>

                    {tcList.length === 0 ? (
                      <div className="py-8 text-center">
                        <FlaskConical className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">No test cases yet. Add one above or skip to create an empty suite.</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-56 overflow-y-auto">
                        {tcList.map((tc, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl group">
                            <span className="text-[10px] text-slate-400 font-mono w-5 shrink-0">{i + 1}</span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 flex-1">{tc}</p>
                            <button onClick={() => setTcList(p => p.filter((_, j) => j !== i))}
                              className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-500 cursor-pointer transition-all"><X className="h-3.5 w-3.5" /></button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {tcList.length > 0 && (
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>{tcList.length} test case{tcList.length > 1 ? 's' : ''} added</span>
                        <button onClick={() => setTcList([])} className="text-rose-500 font-bold hover:underline cursor-pointer">Clear all</button>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4 — Review */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500/6 to-violet-500/4 border border-primary-500/12 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20">
                          <FlaskConical className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white">{name}</p>
                          <p className="text-xs text-primary-500 font-medium">{project}</p>
                          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
                        </div>
                        <div className="ml-auto flex gap-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${PRIORITY_COLORS[priority]}`}>{priority}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[status]}`}>{status}</span>
                          {isAutomated && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-violet-600 bg-violet-500/10 border-violet-500/20">Automated</span>}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Owner', value: owner || 'Unassigned' },
                          { label: 'Test Cases', value: tcList.length },
                          { label: 'Tags', value: tags.length > 0 ? tags.join(', ') : 'None' },
                          { label: 'Status', value: status },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</p>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {tcList.length > 0 && (
                      <div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Test Cases ({tcList.length})</p>
                        <div className="space-y-1 max-h-36 overflow-y-auto">
                          {tcList.map((tc, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                              <CheckCircle2 className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                              {tc}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">All set! Click <strong>Create Suite</strong> to save.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-7 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-950/30 shrink-0">
            <Button variant="ghost" onClick={step === 0 ? handleReset : handleBack}>{step === 0 ? 'Cancel' : '← Back'}</Button>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {SUITE_STEPS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-5 bg-primary-500' : i < step ? 'w-1.5 bg-emerald-400' : 'w-1.5 bg-slate-300 dark:bg-slate-600'}`} />
                ))}
              </div>
              {step < 3
                ? <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={handleNext}>Next: {SUITE_STEPS[step + 1]}</Button>
                : <Button variant="primary" leftIcon={<FlaskConical className="h-4 w-4" />} onClick={handleCreate}>Create Suite</Button>}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ═══════════════ MAIN PAGE ═══════════════ */
export const TestCases: React.FC = () => {
  const [suites, setSuites]         = useState<TestSuite[]>(SEED_SUITES);
  const [showImport, setShowImport] = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [toast, setToast]           = useState<{ msg: string; type: 'success' | 'info' } | null>(null);
  const [search, setSearch]         = useState('');
  const [filterPriority, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalTests  = useMemo(() => suites.reduce((a, s) => a + s.total, 0), [suites]);
  const totalPassed = useMemo(() => suites.reduce((a, s) => a + s.passed, 0), [suites]);
  const totalFailed = useMemo(() => suites.reduce((a, s) => a + s.failed, 0), [suites]);
  const passRate    = totalTests ? Math.round((totalPassed / totalTests) * 100) : 0;
  const automated   = useMemo(() => suites.filter(s => s.isAutomated).length, [suites]);
  const automatedPct = suites.length ? Math.round((automated / suites.length) * 100) : 0;

  const filtered = useMemo(() => suites.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.project.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'All' || s.priority === filterPriority;
    return matchSearch && matchPriority;
  }), [suites, search, filterPriority]);

  const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500);
  };

  const handleImported = (count: number, suiteName: string) => {
    setSuites(prev => [{
      id: mkId(), name: suiteName, project: 'E-Commerce',
      total: count, passed: 0, failed: 0, blocked: 0, notExec: count,
      isAutomated: false, priority: 'medium', tags: ['imported'], status: 'draft',
    }, ...prev]);
    showToast(`${count} test cases imported into "${suiteName}"!`);
  };

  const handleCreated = (suite: TestSuite) => {
    setSuites(prev => [suite, ...prev]);
    showToast(`"${suite.name}" created successfully!`);
  };

  const handleDelete = (id: string) => {
    const s = suites.find(x => x.id === id);
    setSuites(prev => prev.filter(x => x.id !== id));
    if (s) showToast(`"${s.name}" deleted.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Test Case Management</h1>
          <p className="text-sm text-slate-500 mt-1">Create, execute, and track test cases across projects.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />} onClick={() => setShowImport(true)}>Import</Button>
          <Button variant="primary" leftIcon={<Plus className="h-5 w-5" />} onClick={() => setShowNew(true)}>New Test Suite</Button>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
            <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 ${toast.type === 'success' ? 'text-emerald-500' : 'text-blue-400'}`} />
            <p className={`text-sm font-semibold ${toast.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}`}>{toast.msg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total Tests"  value={totalTests}      icon={<TestTube className="h-5 w-5" />} color="indigo" />
        <StatCard title="Passed"       value={totalPassed}     icon={<CheckCircle className="h-5 w-5" />} color="emerald" trend={{ value: 5, label: 'vs last run' }} />
        <StatCard title="Failed"       value={totalFailed}     icon={<XCircle className="h-5 w-5" />} color="rose" trend={{ value: -15, label: 'improved' }} />
        <StatCard title="Pass Rate"    value={`${passRate}%`}  icon={<TestTube className="h-5 w-5" />} color="teal" />
        <StatCard title="Automated"    value={`${automatedPct}%`} icon={<Zap className="h-5 w-5" />} color="violet" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input placeholder="Search test suites or projects…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
        </div>
        <select value={filterPriority} onChange={e => setFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer font-medium">
          {['All', 'critical', 'high', 'medium', 'low'].map(p => <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
        </select>
      </div>

      {/* Suite list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <FlaskConical className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">No test suites match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((suite, i) => {
              const passRate = suite.total ? Math.round((suite.passed / suite.total) * 100) : 0;
              const isExpanded = expandedId === suite.id;
              return (
                <motion.div key={suite.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ delay: i * 0.04 }} layout>
                  <Card hover className="group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <FlaskConical className="h-4 w-4 text-primary-500 shrink-0" />
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{suite.name}</h3>
                          {suite.isAutomated && <Badge variant="purple" size="sm">Automated</Badge>}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${PRIORITY_COLORS[suite.priority]}`}>{suite.priority}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[suite.status]}`}>{suite.status}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-2">
                          <span>Project: {suite.project}</span>
                          {suite.owner && <span>• Owner: {suite.owner}</span>}
                          {suite.lastRun && <span>• Last run: {suite.lastRun}</span>}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          {[
                            { icon: CheckCircle, val: suite.passed,  color: 'text-emerald-500', label: 'Passed' },
                            { icon: XCircle,     val: suite.failed,  color: 'text-red-500',     label: 'Failed' },
                            { icon: Ban,         val: suite.blocked, color: 'text-amber-500',   label: 'Blocked' },
                            { icon: Clock,       val: suite.notExec, color: 'text-slate-400',   label: 'Not Run' },
                          ].map(({ icon: Icon, val, color, label }) => (
                            <span key={label} className={`flex items-center gap-1 text-xs font-semibold ${color}`}>
                              <Icon className="h-3.5 w-3.5" /> {val} <span className="text-slate-400 font-normal">{label}</span>
                            </span>
                          ))}
                          {suite.tags.length > 0 && (
                            <div className="flex gap-1">
                              {suite.tags.slice(0, 3).map(t => (
                                <span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="sm:w-52 shrink-0 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Pass Rate</span>
                          <span className={`text-sm font-black ${passRate >= 90 ? 'text-emerald-500' : passRate >= 70 ? 'text-amber-500' : 'text-red-500'}`}>{passRate}%</span>
                        </div>
                        <ProgressBar value={passRate} color={passRate >= 90 ? 'bg-emerald-500' : passRate >= 70 ? 'bg-amber-500' : 'bg-red-500'} size="md" showLabel={false} />

                        {/* Actions */}
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-bold rounded-lg bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 transition-colors cursor-pointer">
                            <Play className="h-3 w-3" /> Run
                          </button>
                          <button onClick={() => setExpandedId(isExpanded ? null : suite.id)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                            <Eye className="h-3 w-3" /> {isExpanded ? 'Hide' : 'View'}
                          </button>
                          <button onClick={() => handleDelete(suite.id)}
                            className="px-2 py-1.5 rounded-lg bg-rose-500/8 text-rose-500 hover:bg-rose-500/15 transition-colors cursor-pointer">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-xs text-slate-500 leading-relaxed">{suite.description || 'No description provided.'}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <ImportModal     isOpen={showImport} onClose={() => setShowImport(false)} onImported={handleImported} />
      <NewTestSuiteModal isOpen={showNew}  onClose={() => setShowNew(false)}    onCreated={handleCreated} />
    </div>
  );
};
