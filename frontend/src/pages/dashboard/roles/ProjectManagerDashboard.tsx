import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, FolderKanban, Users, Calendar, BarChart3, Zap,
  TrendingUp, AlertTriangle, CheckCircle, Clock, Plus, ArrowUpRight,
} from 'lucide-react';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/Shared';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useAuthStore } from '../../../store/authStore';

const projectsData = [
  { name: 'E-Commerce v3', progress: 78, status: 'On Track',   team: 8,  deadline: 'Jul 25', color: '#10b981' },
  { name: 'Mobile App',     progress: 55, status: 'At Risk',    team: 5,  deadline: 'Aug 10', color: '#f59e0b' },
  { name: 'QualityDesk v2', progress: 91, status: 'On Track',   team: 6,  deadline: 'Jul 15', color: '#10b981' },
  { name: 'Analytics Suite',progress: 30, status: 'Delayed',    team: 4,  deadline: 'Aug 30', color: '#ef4444' },
  { name: 'CRM Integration',progress: 64, status: 'On Track',   team: 7,  deadline: 'Aug 05', color: '#10b981' },
];
const sprintVelocity = [
  { sprint: 'S1', completed: 24, planned: 30 }, { sprint: 'S2', completed: 28, planned: 30 },
  { sprint: 'S3', completed: 22, planned: 30 }, { sprint: 'S4', completed: 32, planned: 35 },
  { sprint: 'S5', completed: 30, planned: 35 }, { sprint: 'S6', completed: 36, planned: 35 },
];
const teamUtilization = [
  { member: 'Alice J',   util: 92, role: 'Dev' },
  { member: 'Bob S',     util: 78, role: 'Dev' },
  { member: 'Charlie B', util: 85, role: 'QA' },
  { member: 'Diana P',   util: 65, role: 'Dev' },
  { member: 'Eve A',     util: 88, role: 'Design' },
];
const timeline = [
  { event: 'Sprint Alpha v2.3 launched',    date: 'Jul 6',  type: 'sprint',  status: 'done' },
  { event: 'QA Review: E-Commerce checkout',date: 'Jul 8',  type: 'review',  status: 'upcoming' },
  { event: 'Mobile App design freeze',      date: 'Jul 10', type: 'deadline',status: 'upcoming' },
  { event: 'Sprint Beta v2.4 planning',     date: 'Jul 12', type: 'sprint',  status: 'upcoming' },
  { event: 'Client demo: Analytics Suite',  date: 'Jul 15', type: 'meeting', status: 'upcoming' },
];

const s = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

export const ProjectManagerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Project Manager Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome, <span className="font-bold text-blue-500">{user?.name}</span> · Managing projects & teams</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/app/reports')}>View Reports</Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/app/projects/new')}>New Project</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: 'Active Projects', value: 18,  icon: <FolderKanban className="h-5 w-5" />, color: 'indigo'  as const, trend: { value: 8, label: 'vs last month' } },
          { title: 'On Track',        value: 13,  icon: <CheckCircle className="h-5 w-5" />,  color: 'emerald' as const, trend: { value: 5, label: 'this quarter' } },
          { title: 'At Risk',         value: 3,   icon: <AlertTriangle className="h-5 w-5" />,color: 'amber'   as const, trend: { value: -2, label: 'vs last month' } },
          { title: 'Delayed',         value: 2,   icon: <Clock className="h-5 w-5" />,         color: 'rose'    as const, trend: { value: -1, label: 'improved' } },
          { title: 'Active Sprints',  value: 4,   icon: <Zap className="h-5 w-5" />,           color: 'violet'  as const },
          { title: 'Team Members',    value: 32,  icon: <Users className="h-5 w-5" />,         color: 'blue'    as const, trend: { value: 3, label: 'new this month' } },
        ].map((stat, i) => (
          <motion.div key={i} {...s(i)}><StatCard {...stat} /></motion.div>
        ))}
      </div>

      {/* Projects Table */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Projects</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Real-time project health overview</p>
          </div>
          <button onClick={() => navigate('/app/projects')} className="text-xs text-blue-500 font-semibold hover:underline cursor-pointer">View All →</button>
        </div>
        <div className="space-y-3">
          {projectsData.map((p, i) => (
            <motion.div key={i} {...s(i)} className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-all cursor-pointer group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{p.name}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${p.status === 'On Track' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : p.status === 'At Risk' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>{p.status}</span>
                </div>
                <ProgressBar value={p.progress} color={p.color} showLabel={false} />
              </div>
              <div className="text-center shrink-0">
                <p className="text-lg font-black" style={{ color: p.color }}>{p.progress}%</p>
                <p className="text-[9px] text-slate-400">complete</p>
              </div>
              <div className="text-center shrink-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{p.team}</p>
                <p className="text-[9px] text-slate-400">members</p>
              </div>
              <div className="text-center shrink-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{p.deadline}</p>
                <p className="text-[9px] text-slate-400">deadline</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Charts + Timeline */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sprint Velocity</h3>
            <Badge variant="info">Last 6 Sprints</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sprintVelocity} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="planned" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Planned" />
              <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Team Utilization</h3>
          <div className="space-y-3">
            {teamUtilization.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[9px] font-black shrink-0">
                  {m.member.split(' ')[0][0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{m.member}</span>
                    <span className={`font-bold ${m.util > 85 ? 'text-amber-500' : 'text-emerald-500'}`}>{m.util}%</span>
                  </div>
                  <ProgressBar value={m.util} color={m.util > 85 ? 'bg-amber-500' : 'bg-blue-500'} showLabel={false} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
            <button onClick={() => navigate('/app/calendar')} className="text-xs text-blue-500 font-semibold hover:underline cursor-pointer">Calendar →</button>
          </div>
          <div className="space-y-3">
            {timeline.map((ev, i) => (
              <div key={i} className={`flex gap-3 items-start p-2.5 rounded-xl ${ev.status === 'done' ? 'opacity-50' : 'bg-slate-50 dark:bg-surface-800/50'}`}>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${ev.type === 'sprint' ? 'bg-violet-500' : ev.type === 'deadline' ? 'bg-red-500' : ev.type === 'meeting' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-slate-800 dark:text-white leading-snug">{ev.event}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{ev.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
