import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users as UsersIcon, Plus, Mail, Star, X, Check,
  ChevronRight, ArrowRight, User, Briefcase, Code2,
  Phone, MapPin, Hash, Shield, Building2, Sparkles,
  CheckCircle2, AlertCircle, Tag, Layers, Clock, Trash2,
  Search, Filter, BarChart3,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ProgressBar } from '../../components/ui/Shared';
import { StatCard } from '../../components/ui/StatCard';
import { Input, Textarea } from '../../components/ui/Input';

/* ─────────────── Types ─────────────── */
type Availability = 'Available' | 'Busy' | 'On Leave' | 'Unavailable';
type AvailBadge = 'success' | 'warning' | 'default';

interface Member {
  id: string;
  name: string;
  role: string;
  dept: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills: string[];
  availability: Availability;
  performance: number;
  tasksCompleted: number;
  joinDate?: string;
  avatarColor?: string;
}

/* ─────────────── Seed Data ─────────────── */
const SEED_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson',  role: 'Team Lead',       dept: 'Engineering', email: 'alice@qualitydesk.io',  phone: '+1 555-0101', location: 'San Francisco, CA', skills: ['React', 'Node.js', 'MongoDB'],         availability: 'Available',   performance: 95, tasksCompleted: 142, joinDate: '2024-01-15', avatarColor: 'bg-emerald-500' },
  { id: '2', name: 'Bob Smith',      role: 'Developer',        dept: 'Engineering', email: 'bob@qualitydesk.io',    phone: '+1 555-0102', location: 'Austin, TX',          skills: ['TypeScript', 'NestJS', 'PostgreSQL'], availability: 'Busy',        performance: 88, tasksCompleted: 118, joinDate: '2024-03-10', avatarColor: 'bg-blue-500'    },
  { id: '3', name: 'Charlie Brown',  role: 'QA Tester',        dept: 'Quality',     email: 'charlie@qualitydesk.io',                       location: 'Chicago, IL',         skills: ['Selenium', 'Jest', 'Cypress'],         availability: 'Available',   performance: 92, tasksCompleted: 96,  joinDate: '2024-02-20', avatarColor: 'bg-violet-500'  },
  { id: '4', name: 'Diana Prince',   role: 'Developer',        dept: 'Engineering', email: 'diana@qualitydesk.io',  phone: '+1 555-0104', location: 'New York, NY',        skills: ['React', 'GraphQL', 'AWS'],             availability: 'Available',   performance: 91, tasksCompleted: 127, joinDate: '2024-01-28', avatarColor: 'bg-pink-500'    },
  { id: '5', name: 'Eve Adams',      role: 'Project Manager',  dept: 'Product',     email: 'eve@qualitydesk.io',    phone: '+1 555-0105',                                  skills: ['Agile', 'Scrum', 'JIRA'],              availability: 'On Leave',    performance: 89, tasksCompleted: 84,  joinDate: '2023-11-05', avatarColor: 'bg-amber-500'   },
  { id: '6', name: 'Frank Castle',   role: 'Developer',        dept: 'Engineering', email: 'frank@qualitydesk.io',                                                           skills: ['Python', 'Django', 'Docker'],           availability: 'Available',   performance: 86, tasksCompleted: 105, joinDate: '2024-04-12', avatarColor: 'bg-cyan-500'    },
  { id: '7', name: 'Grace Hopper',   role: 'QA Tester',        dept: 'Quality',     email: 'grace@qualitydesk.io',  phone: '+1 555-0107', location: 'Seattle, WA',         skills: ['Manual Testing', 'API Testing'],       availability: 'Busy',        performance: 94, tasksCompleted: 110, joinDate: '2024-02-01', avatarColor: 'bg-rose-500'    },
  { id: '8', name: 'Henry Ford',     role: 'Developer',        dept: 'Engineering', email: 'henry@qualitydesk.io',                         location: 'Boston, MA',          skills: ['Java', 'Spring Boot', 'Kubernetes'],   availability: 'Unavailable', performance: 82, tasksCompleted: 98,  joinDate: '2023-10-18', avatarColor: 'bg-slate-500'   },
];

const AVAILABILITY_CONFIG: Record<Availability, { badge: AvailBadge; status: 'online' | 'busy' | 'away' | 'offline'; pill: string }> = {
  'Available':   { badge: 'success', status: 'online',  pill: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  'Busy':        { badge: 'warning', status: 'busy',    pill: 'text-amber-600   dark:text-amber-400   bg-amber-500/10   border-amber-500/20'   },
  'On Leave':    { badge: 'default', status: 'away',    pill: 'text-blue-600    dark:text-blue-400    bg-blue-500/10    border-blue-500/20'    },
  'Unavailable': { badge: 'default', status: 'offline', pill: 'text-slate-500   dark:text-slate-400   bg-slate-500/10   border-slate-500/20'   },
};

const DEPTS      = ['Engineering', 'Quality', 'Product', 'Design', 'DevOps', 'Management'];
const ROLES      = ['Developer', 'Senior Developer', 'Team Lead', 'QA Tester', 'QA Lead', 'Project Manager', 'UI/UX Designer', 'DevOps Engineer', 'Product Owner', 'Scrum Master'];
const AVAIL_OPTS: Availability[] = ['Available', 'Busy', 'On Leave', 'Unavailable'];
const AVATAR_COLORS = ['bg-primary-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-pink-500', 'bg-blue-500', 'bg-teal-500', 'bg-orange-500'];

const SKILL_SUGGESTIONS = [
  'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'Node.js', 'NestJS',
  'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'Go', 'Rust',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'GraphQL',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
  'Jest', 'Cypress', 'Selenium', 'Playwright', 'Manual Testing', 'API Testing',
  'Agile', 'Scrum', 'JIRA', 'Figma', 'UI/UX Design',
];

const STEPS = ['Personal', 'Role & Dept', 'Skills', 'Review'];
function makeId() { return Math.random().toString(36).slice(2, 10); }

/* ─────────────── Add Member Modal ─────────────── */
interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: Member) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState(0);

  // Step 1
  const [fullName, setFullName]     = useState('');
  const [email, setEmail]           = useState('');
  const [phone, setPhone]           = useState('');
  const [location, setLocation]     = useState('');
  const [bio, setBio]               = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);

  // Step 2
  const [role, setRole]             = useState('');
  const [customRole, setCustomRole] = useState('');
  const [dept, setDept]             = useState('');
  const [availability, setAvailability] = useState<Availability>('Available');
  const [performance, setPerformance]   = useState(80);

  // Step 3
  const [skills, setSkills]         = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredSuggestions = skillInput.length > 0
    ? SKILL_SUGGESTIONS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s))
    : [];

  const addSkill = (s: string) => {
    const clean = s.trim();
    if (clean && !skills.includes(clean)) setSkills(prev => [...prev, clean]);
    setSkillInput('');
  };

  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!fullName.trim()) e.fullName = 'Full name is required';
      if (!email.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    }
    if (s === 1) {
      if (!role && !customRole.trim()) e.role = 'Select or enter a role';
      if (!dept) e.dept = 'Department is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 3) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleCreate = () => {
    const resolvedRole = customRole.trim() || role;
    onAdd({
      id: makeId(),
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      location: location.trim() || undefined,
      bio: bio.trim() || undefined,
      role: resolvedRole,
      dept,
      availability,
      skills,
      performance,
      tasksCompleted: 0,
      joinDate: new Date().toISOString().split('T')[0],
      avatarColor,
    });
    handleReset();
  };

  const handleReset = () => {
    setStep(0); setFullName(''); setEmail(''); setPhone(''); setLocation(''); setBio('');
    setAvatarColor(AVATAR_COLORS[0]); setRole(''); setCustomRole(''); setDept('');
    setAvailability('Available'); setPerformance(80); setSkills([]); setSkillInput('');
    setErrors({});
    onClose();
  };

  const finalRole = customRole.trim() || role;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          onClick={handleReset}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.18 }}
          className="relative w-full max-w-2xl flex flex-col bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh]"
        >
          {/* Gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-violet-500 to-pink-500 shrink-0" />

          {/* Header */}
          <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <UsersIcon className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <h2 className="text-xl font-black font-display text-slate-900 dark:text-white">Add Team Member</h2>
                <p className="text-xs text-slate-400 mt-0.5">Onboard a new member to your workspace</p>
              </div>
            </div>
            <button onClick={handleReset} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0 px-7 py-4 bg-slate-50/50 dark:bg-surface-950/30 border-b border-slate-100 dark:border-slate-800 shrink-0">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <button
                  onClick={() => { if (i < step) setStep(i); }}
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
                {i < STEPS.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 mx-1 shrink-0" />}
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

                {/* ── STEP 1: Personal Info ── */}
                {step === 0 && (
                  <div className="space-y-5">
                    {/* Avatar preview + color picker */}
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-2xl ${avatarColor} flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg`}>
                        {fullName ? fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : <User className="h-7 w-7" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Avatar Colour</p>
                        <div className="flex flex-wrap gap-2">
                          {AVATAR_COLORS.map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setAvatarColor(c)}
                              className={`w-6 h-6 rounded-full ${c} cursor-pointer transition-all hover:scale-110 ${avatarColor === c ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Input label="Full Name" placeholder="e.g. Jane Doe" value={fullName}
                          onChange={e => { setFullName(e.target.value); setErrors(p => ({ ...p, fullName: '' })); }}
                          error={errors.fullName} icon={<User className="h-4 w-4" />} />
                      </div>
                      <Input label="Email Address" type="email" placeholder="name@company.io" value={email}
                        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                        error={errors.email} icon={<Mail className="h-4 w-4" />} />
                      <Input label="Phone (optional)" placeholder="+1 555-0000" value={phone}
                        onChange={e => setPhone(e.target.value)} icon={<Phone className="h-4 w-4" />} />
                      <div className="sm:col-span-2">
                        <Input label="Location (optional)" placeholder="e.g. San Francisco, CA" value={location}
                          onChange={e => setLocation(e.target.value)} icon={<MapPin className="h-4 w-4" />} />
                      </div>
                      <div className="sm:col-span-2">
                        <Textarea label="Short Bio (optional)" placeholder="Brief professional summary…"
                          value={bio} onChange={e => setBio(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Role & Department ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    {/* Department */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Department *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {DEPTS.map(d => (
                          <button key={d} type="button" onClick={() => { setDept(d); setErrors(p => ({ ...p, dept: '' })); }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              dept === d
                                ? 'bg-primary-500/10 border-primary-500/30 text-primary-600 dark:text-primary-400'
                                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}>
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            {d}
                          </button>
                        ))}
                      </div>
                      {errors.dept && <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.dept}</p>}
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Role *</label>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {ROLES.map(r => (
                          <button key={r} type="button" onClick={() => { setRole(r); setCustomRole(''); setErrors(p => ({ ...p, role: '' })); }}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                              role === r && !customRole
                                ? 'bg-primary-500/10 border-primary-500/30 text-primary-600 dark:text-primary-400'
                                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}>
                            <Briefcase className="h-3.5 w-3.5 shrink-0" />
                            {r}
                          </button>
                        ))}
                      </div>
                      <Input label="Or enter custom role" placeholder="e.g. Solutions Architect" value={customRole}
                        onChange={e => { setCustomRole(e.target.value); if (e.target.value) setRole(''); setErrors(p => ({ ...p, role: '' })); }}
                        error={errors.role} icon={<Hash className="h-4 w-4" />} />
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Initial Availability</label>
                      <div className="grid grid-cols-2 gap-2">
                        {AVAIL_OPTS.map(a => {
                          const cfg = AVAILABILITY_CONFIG[a];
                          return (
                            <button key={a} type="button" onClick={() => setAvailability(a)}
                              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                availability === a
                                  ? `${cfg.pill} border-current/40`
                                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'
                              }`}>
                              <div className={`w-2 h-2 rounded-full shrink-0 ${
                                a === 'Available' ? 'bg-emerald-500' : a === 'Busy' ? 'bg-amber-500' : a === 'On Leave' ? 'bg-blue-500' : 'bg-slate-400'
                              }`} />
                              {a}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Starting performance */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Starting Performance Score</label>
                        <span className={`text-sm font-black ${performance >= 90 ? 'text-emerald-500' : performance >= 75 ? 'text-amber-500' : 'text-red-500'}`}>{performance}%</span>
                      </div>
                      <input type="range" min={0} max={100} step={1} value={performance}
                        onChange={e => setPerformance(Number(e.target.value))}
                        className="w-full h-2 rounded-full accent-primary-500 cursor-pointer" />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>0%</span><span>50%</span><span>100%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Skills ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <p className="text-sm text-slate-500">Add the member's technical skills and competencies</p>

                    {/* Skill input */}
                    <div className="relative">
                      <Input
                        label="Add Skill"
                        placeholder="Type a skill and press Enter…"
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && skillInput.trim()) { e.preventDefault(); addSkill(skillInput); } }}
                        icon={<Code2 className="h-4 w-4" />}
                      />
                      {filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-surface-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                          {filteredSuggestions.map(s => (
                            <button key={s} type="button" onClick={() => addSkill(s)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-primary-500/8 transition-colors text-left cursor-pointer">
                              <Tag className="h-3.5 w-3.5 text-slate-400" />
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Selected skills */}
                    {skills.length > 0 ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Selected Skills ({skills.length})</label>
                          <button type="button" onClick={() => setSkills([])} className="text-[10px] text-rose-500 font-bold cursor-pointer hover:underline">Clear all</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills.map(s => (
                            <motion.span
                              key={s}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/20 text-xs font-bold text-primary-600 dark:text-primary-400"
                            >
                              {s}
                              <button type="button" onClick={() => removeSkill(s)} className="hover:text-rose-500 transition-colors cursor-pointer">
                                <X className="h-3 w-3" />
                              </button>
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3.5 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                        <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
                        <p className="text-xs text-slate-400">No skills added yet. Type above or click a suggestion.</p>
                      </div>
                    )}

                    {/* Popular tags */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Popular Skills</label>
                      <div className="flex flex-wrap gap-1.5">
                        {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 20).map(s => (
                          <button key={s} type="button" onClick={() => addSkill(s)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-500 hover:border-primary-500/40 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-500/5 transition-all cursor-pointer">
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 4: Review ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    {/* Member preview card */}
                    <div className={`p-5 rounded-2xl border ${AVAILABILITY_CONFIG[availability].pill.includes('emerald') ? 'border-emerald-500/15 bg-emerald-500/4' : 'border-primary-500/15 bg-primary-500/4'}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-2xl ${avatarColor} flex items-center justify-center text-white text-xl font-black shrink-0 shadow`}>
                          {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 dark:text-white">{fullName || '—'}</p>
                          <p className="text-xs text-primary-500 font-semibold">{finalRole || '—'}</p>
                          <p className="text-[10px] text-slate-400">{dept || '—'}</p>
                        </div>
                        <div className="ml-auto">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${AVAILABILITY_CONFIG[availability].pill}`}>{availability}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {[
                          { icon: Mail, label: 'Email', value: email },
                          { icon: Phone, label: 'Phone', value: phone || 'Not provided' },
                          { icon: MapPin, label: 'Location', value: location || 'Not provided' },
                          { icon: Star, label: 'Performance', value: `${performance}%` },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-2">
                            <Icon className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</p>
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Code2 className="h-4 w-4 text-slate-400" />
                        <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Skills ({skills.length})</p>
                      </div>
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map(s => (
                            <span key={s} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400">{s}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No skills specified</p>
                      )}
                    </div>

                    {bio && (
                      <div className="p-3.5 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Bio</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{bio}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                        All looks good! Click <strong>Add Member</strong> to onboard.
                      </p>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-7 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-950/30 shrink-0">
            <Button variant="ghost" onClick={step === 0 ? handleReset : handleBack}>
              {step === 0 ? 'Cancel' : '← Back'}
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${
                    i === step ? 'w-5 bg-primary-500' : i < step ? 'w-1.5 bg-emerald-400' : 'w-1.5 bg-slate-300 dark:bg-slate-600'
                  }`} />
                ))}
              </div>
              {step < 3 ? (
                <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={handleNext}>
                  Next: {STEPS[step + 1]}
                </Button>
              ) : (
                <Button variant="primary" leftIcon={<UsersIcon className="h-4 w-4" />} onClick={handleCreate}>
                  Add Member
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ─────────────── Main Team Page ─────────────── */
export const Team: React.FC = () => {
  const [members, setMembers]     = useState<Member[]>(SEED_MEMBERS);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterAvail, setFilterAvail] = useState('All');

  const workloadData = useMemo(() => {
    return members.map(m => ({
      name: m.name.split(' ')[0],
      Tasks: Math.round((m.tasksCompleted % 6) + 2),
      Bugs: Math.round((m.performance % 4) + 1),
    }));
  }, [members]);

  const depts = ['All', ...Array.from(new Set(members.map(m => m.dept)))];
  const avails = ['All', 'Available', 'Busy', 'On Leave', 'Unavailable'];

  const filtered = useMemo(() => members.filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchDept  = filterDept === 'All' || m.dept === filterDept;
    const matchAvail = filterAvail === 'All' || m.availability === filterAvail;
    return matchSearch && matchDept && matchAvail;
  }), [members, search, filterDept, filterAvail]);

  const avgPerf = members.length ? Math.round(members.reduce((a, m) => a + m.performance, 0) / members.length) : 0;

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const handleAdd = (member: Member) => {
    setMembers(prev => [member, ...prev]);
    showToast(`${member.name} added to the team!`);
  };

  const handleRemove = (id: string) => {
    const m = members.find(x => x.id === id);
    setMembers(prev => prev.filter(x => x.id !== id));
    if (m) showToast(`${m.name} removed from the team.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Team Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage employees, teams, departments, and skills.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-5 w-5" />} onClick={() => setShowModal(true)}>
          Add Member
        </Button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
          >
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Members"    value={members.length}                                              icon={<UsersIcon className="h-5 w-5" />} color="indigo"  />
        <StatCard title="Available"        value={members.filter(m => m.availability === 'Available').length}  icon={<UsersIcon className="h-5 w-5" />} color="emerald" />
        <StatCard title="Departments"      value={new Set(members.map(m => m.dept)).size}                      icon={<Building2 className="h-5 w-5" />} color="violet"  />
        <StatCard title="Avg Performance"  value={`${avgPerf}%`}                                               icon={<Star className="h-5 w-5" />}      color="amber"   />
      </div>

      {/* Workload Balancer Chart */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4.5 w-4.5 text-primary-500 animate-pulse" />
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Team Workload Balancer</h3>
            <p className="text-[10px] text-slate-400">Total assigned active tasks and open bugs per team member</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 'bold' }} />
              <Bar dataKey="Tasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Bugs" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            placeholder="Search by name, role, or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer font-medium">
          {depts.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
        </select>
        <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer font-medium">
          {avails.map(a => <option key={a} value={a}>{a === 'All' ? 'All Availability' : a}</option>)}
        </select>
      </div>

      {/* Team Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <UsersIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold">No members match your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((member, i) => {
              const avail = AVAILABILITY_CONFIG[member.availability] ?? AVAILABILITY_CONFIG['Unavailable'];
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.04 }}
                  layout
                >
                  <Card hover className="flex flex-col group relative overflow-hidden">
                    {/* Top accent strip */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 ${member.avatarColor ?? 'bg-primary-500'} opacity-60`} />

                    <div className="flex items-start gap-4 mb-4 pt-1">
                      <div className={`w-12 h-12 rounded-xl ${member.avatarColor ?? 'bg-primary-500'} flex items-center justify-center text-white text-sm font-black shrink-0 shadow`}>
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{member.name}</h3>
                        <p className="text-xs text-primary-500 font-medium">{member.role}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{member.dept}</p>
                      </div>
                      <Badge variant={avail.badge} size="sm" dot>{member.availability}</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>

                    {member.location && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 -mt-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{member.location}</span>
                      </div>
                    )}

                    {member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {member.skills.slice(0, 4).map(skill => (
                          <span key={skill} className="text-[9px] font-semibold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-md">
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 4 && (
                          <span className="text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md">+{member.skills.length - 4}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-slate-400">Performance</span>
                        <span className={`text-xs font-black ${member.performance >= 90 ? 'text-emerald-500' : member.performance >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
                          {member.performance}%
                        </span>
                      </div>
                      <ProgressBar
                        value={member.performance}
                        color={member.performance >= 90 ? 'bg-emerald-500' : member.performance >= 75 ? 'bg-amber-500' : 'bg-red-500'}
                        size="sm" showLabel={false}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] text-slate-400">{member.tasksCompleted} tasks completed</p>
                        {member.joinDate && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {member.joinDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Remove hover action */}
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white dark:bg-surface-800 border border-slate-200 dark:border-slate-700 text-slate-300 hover:text-rose-500 hover:border-rose-500/30 transition-all cursor-pointer opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Member Modal */}
      <AddMemberModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={handleAdd} />
    </div>
  );
};
