import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Eye, FolderKanban, BarChart3, CheckCircle, Clock, AlertTriangle,
  TrendingUp, ArrowUpRight, MessageSquare, FileText,
} from 'lucide-react';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/Shared';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../../../store/authStore';

const projects = [
  { name: 'E-Commerce Platform v3', status: 'On Track',  progress: 78, health: 'green',  dueDate: 'Jul 25, 2026', milestone: 'Beta Launch' },
  { name: 'Mobile App Redesign',    status: 'At Risk',   progress: 55, health: 'yellow', dueDate: 'Aug 10, 2026', milestone: 'Design Freeze' },
  { name: 'Analytics Dashboard',    status: 'Delayed',   progress: 30, health: 'red',    dueDate: 'Aug 30, 2026', milestone: 'Alpha Testing' },
];
const milestones = [
  { name: 'E-Commerce — Beta Launch',    date: 'Jul 25',  status: 'upcoming', progress: 78 },
  { name: 'Mobile App — Design Freeze',  date: 'Aug 10',  status: 'at-risk',  progress: 55 },
  { name: 'Analytics — Alpha Test',      date: 'Aug 30',  status: 'delayed',  progress: 30 },
  { name: 'QA Review — All Projects',    date: 'Sep 5',   status: 'upcoming', progress: 0  },
];
const projectProgressData = [
  { month: 'Mar', eCommerce: 20, mobile: 5,  analytics: 0 },
  { month: 'Apr', eCommerce: 38, mobile: 18, analytics: 8 },
  { month: 'May', eCommerce: 52, mobile: 32, analytics: 16 },
  { month: 'Jun', eCommerce: 65, mobile: 44, analytics: 23 },
  { month: 'Jul', eCommerce: 78, mobile: 55, analytics: 30 },
];
const qualityScores = [
  { project: 'E-Commerce', score: 94 },
  { project: 'Mobile App', score: 81 },
  { project: 'Analytics',  score: 72 },
];
const deliverables = [
  { title: 'Q3 Progress Report',          type: 'report',   date: 'Jul 10', status: 'ready' },
  { title: 'E-Commerce Beta Release Notes',type: 'document', date: 'Jul 20', status: 'pending' },
  { title: 'Analytics Roadmap v2',         type: 'report',   date: 'Aug 1',  status: 'pending' },
  { title: 'Mobile App UAT Sign-off',      type: 'approval', date: 'Aug 15', status: 'pending' },
];
const HEALTH_COLORS: Record<string, string> = { green: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', yellow: 'text-amber-500 bg-amber-500/10 border-amber-500/20', red: 'text-red-500 bg-red-500/10 border-red-500/20' };
const MILESTONE_COLORS: Record<string, string> = { upcoming: 'bg-blue-500', 'at-risk': 'bg-amber-500', delayed: 'bg-red-500' };
const s = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

export const ClientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Client Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome, <span className="font-bold text-rose-500">{user?.name}</span> · View-only access to your projects</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<MessageSquare className="h-4 w-4" />} onClick={() => navigate('/app/chat')}>Contact Team</Button>
          <Button variant="primary" leftIcon={<BarChart3 className="h-4 w-4" />} onClick={() => navigate('/app/reports')}>View Reports</Button>
        </div>
      </div>

      {/* Read-only notice */}
      <div className="flex items-center gap-3 p-3.5 bg-blue-500/6 border border-blue-500/15 rounded-2xl">
        <Eye className="h-4 w-4 text-blue-400 shrink-0" />
        <p className="text-xs text-blue-600 dark:text-blue-400">
          You have <strong>view-only access</strong> to your project portfolio. Contact your Project Manager to request changes or updates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'My Projects',    value: 3,    icon: <FolderKanban className="h-5 w-5" />, color: 'rose'    as const },
          { title: 'On Track',       value: 1,    icon: <CheckCircle className="h-5 w-5" />,  color: 'emerald' as const },
          { title: 'Needs Attention',value: 2,    icon: <AlertTriangle className="h-5 w-5" />,color: 'amber'   as const },
          { title: 'Avg Progress',   value: '54%',icon: <TrendingUp className="h-5 w-5" />,  color: 'indigo'  as const },
        ].map((stat, i) => (
          <motion.div key={i} {...s(i)}><StatCard {...stat} /></motion.div>
        ))}
      </div>

      {/* Project Status Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {projects.map((p, i) => (
          <motion.div key={i} {...s(i)}>
            <Card hover className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10"><FolderKanban className="h-4 w-4 text-rose-500" /></div>
                <span className={`text-[9px] font-bold px-2 py-1 rounded-full border ${HEALTH_COLORS[p.health]}`}>{p.status}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{p.name}</h3>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-3">
                <span>Due: {p.dueDate}</span>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className={`font-black ${p.progress >= 70 ? 'text-emerald-500' : p.progress >= 40 ? 'text-amber-500' : 'text-red-500'}`}>{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} color={p.progress >= 70 ? 'bg-emerald-500' : p.progress >= 40 ? 'bg-amber-500' : 'bg-red-500'} showLabel={false} />
                <p className="text-[9px] text-slate-400 mt-1.5">Next milestone: <span className="font-semibold text-slate-600 dark:text-slate-400">{p.milestone}</span></p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts + Milestones + Deliverables */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Project Progress Over Time</h3><p className="text-[10px] text-slate-400 mt-0.5">Monthly completion %</p></div>
            <Badge variant="info">5 Months</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={projectProgressData}>
              <defs>
                {[{ id: 'ec', color: '#f43f5e' }, { id: 'mob', color: '#f59e0b' }, { id: 'an', color: '#3b82f6' }].map(g => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={g.color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" unit="%" domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Area type="monotone" dataKey="eCommerce" stroke="#f43f5e" fill="url(#ec)" strokeWidth={2} name="E-Commerce" />
              <Area type="monotone" dataKey="mobile"    stroke="#f59e0b" fill="url(#mob)" strokeWidth={2} name="Mobile App" />
              <Area type="monotone" dataKey="analytics" stroke="#3b82f6" fill="url(#an)"  strokeWidth={2} name="Analytics" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            {[{ label: 'E-Commerce', color: '#f43f5e' }, { label: 'Mobile App', color: '#f59e0b' }, { label: 'Analytics', color: '#3b82f6' }].map(l => (
              <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <div className="w-3 h-0.5 rounded" style={{ background: l.color }} />{l.label}
              </span>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-5 space-y-4">
          <Card>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Key Milestones</h3>
            <div className="space-y-2.5">
              {milestones.map((m, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${m.status === 'delayed' ? 'bg-red-500/5 border border-red-500/10' : m.status === 'at-risk' ? 'bg-amber-500/5 border border-amber-500/10' : 'bg-slate-50 dark:bg-surface-800/50'}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${MILESTONE_COLORS[m.status]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{m.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[9px] text-slate-400">{m.date}</p>
                      {m.progress > 0 && <span className="text-[9px] font-semibold text-slate-500">{m.progress}% complete</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Deliverables</h3>
              <button onClick={() => navigate('/app/reports')} className="text-xs text-rose-500 font-semibold hover:underline cursor-pointer">Reports →</button>
            </div>
            <div className="space-y-2">
              {deliverables.map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-white truncate">{d.title}</p>
                    <p className="text-[9px] text-slate-400">{d.date}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${d.status === 'ready' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}>{d.status}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
