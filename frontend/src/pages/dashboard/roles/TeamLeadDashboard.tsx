import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, ListTodo, Zap, Bug, Clock, CheckCircle, MessageSquare, Star, ArrowUpRight, Plus, TrendingUp } from 'lucide-react';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/Shared';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../../../store/authStore';

const memberTasks = [
  { name: 'Alice Johnson', avatar: 'AJ', tasks: 12, done: 9,  bugs: 1, status: 'online',  gradient: 'from-emerald-500 to-teal-500' },
  { name: 'Bob Smith',     avatar: 'BS', tasks: 10, done: 7,  bugs: 2, status: 'busy',    gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Charlie Brown', avatar: 'CB', tasks: 8,  done: 8,  bugs: 0, status: 'online',  gradient: 'from-violet-500 to-indigo-600' },
  { name: 'Diana Prince',  avatar: 'DP', tasks: 14, done: 10, bugs: 0, status: 'away',    gradient: 'from-amber-500 to-orange-500' },
  { name: 'Eve Adams',     avatar: 'EA', tasks: 7,  done: 5,  bugs: 3, status: 'offline', gradient: 'from-rose-500 to-pink-500' },
];
const weeklyVelocity = [
  { day: 'Mon', done: 8 }, { day: 'Tue', done: 12 }, { day: 'Wed', done: 10 },
  { day: 'Thu', done: 15 }, { day: 'Fri', done: 11 }, { day: 'Sat', done: 4 }, { day: 'Sun', done: 2 },
];
const sprintData = [
  { label: 'To Do', count: 14, color: '#94a3b8' },
  { label: 'In Progress', count: 8, color: '#3b82f6' },
  { label: 'In Review', count: 5, color: '#f59e0b' },
  { label: 'Done', count: 23, color: '#10b981' },
];
const teamActivity = [
  { user: 'Alice Johnson', action: 'Completed task "Auth middleware refactor"', time: '15m ago', type: 'done' },
  { user: 'Bob Smith',     action: 'Raised bug #219 "Null pointer in checkout"', time: '1h ago',  type: 'bug' },
  { user: 'Charlie Brown', action: 'Pushed 3 commits to main branch',          time: '2h ago',  type: 'code' },
  { user: 'Diana Prince',  action: 'Updated sprint backlog — added 4 tickets', time: '3h ago',  type: 'sprint' },
  { user: 'Eve Adams',     action: 'Requested code review on PR #142',         time: '4h ago',  type: 'review' },
];
const statusColor: Record<string, string> = { online: 'bg-emerald-400', busy: 'bg-amber-400', away: 'bg-slate-400', offline: 'bg-slate-600' };
const s = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

export const TeamLeadDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Team Lead Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome, <span className="font-bold text-violet-500">{user?.name}</span> · Leading team activities</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/app/chat')}>Team Chat</Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/app/tasks')}>Assign Task</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: 'Team Size',     value: 5,    icon: <Users className="h-5 w-5" />,      color: 'violet'  as const },
          { title: 'Open Tasks',    value: 22,   icon: <ListTodo className="h-5 w-5" />,   color: 'indigo'  as const, trend: { value: -5, label: 'vs last week' } },
          { title: 'Done Tasks',    value: 39,   icon: <CheckCircle className="h-5 w-5" />,color: 'emerald' as const, trend: { value: 22, label: 'this sprint' } },
          { title: 'Active Sprint', value: 1,    icon: <Zap className="h-5 w-5" />,         color: 'blue'    as const },
          { title: 'Open Bugs',     value: 6,    icon: <Bug className="h-5 w-5" />,         color: 'rose'    as const, trend: { value: -2, label: 'resolved' } },
          { title: 'Team Velocity', value: '87%',icon: <TrendingUp className="h-5 w-5" />, color: 'teal'    as const, trend: { value: 4, label: 'vs last sprint' } },
        ].map((stat, i) => (
          <motion.div key={i} {...s(i)}><StatCard {...stat} /></motion.div>
        ))}
      </div>

      {/* Team Member Cards */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">My Team</h3>
          <button onClick={() => navigate('/app/team')} className="text-xs text-violet-500 font-semibold hover:underline cursor-pointer">Manage →</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {memberTasks.map((m, i) => (
            <motion.div key={i} {...s(i)} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-violet-500/20 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${m.gradient} flex items-center justify-center text-white text-[10px] font-black`}>{m.avatar}</div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-surface-900 ${statusColor[m.status]}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{m.name.split(' ')[0]}</p>
                  <p className="text-[9px] text-slate-400 capitalize">{m.status}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Tasks</span>
                  <span className="font-bold text-slate-900 dark:text-white">{m.done}/{m.tasks}</span>
                </div>
                <ProgressBar value={(m.done / m.tasks) * 100} color="bg-violet-500" showLabel={false} />
                {m.bugs > 0 && (
                  <div className="flex items-center gap-1 text-[9px] text-red-500 font-semibold">
                    <Bug className="h-2.5 w-2.5" /> {m.bugs} bug{m.bugs > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Charts + Activity */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Sprint Board Status</h3>
          <div className="space-y-3">
            {sprintData.map((sp, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sp.color }} />
                <span className="text-xs text-slate-600 dark:text-slate-400 flex-1">{sp.label}</span>
                <div className="flex-1"><ProgressBar value={(sp.count / 50) * 100} color={`bg-[${sp.color}]`} showLabel={false} /></div>
                <span className="text-xs font-black w-6 text-right" style={{ color: sp.color }}>{sp.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Sprint Progress</span>
              <span className="text-sm font-black text-violet-500">46%</span>
            </div>
            <ProgressBar value={46} color="bg-violet-500" showLabel={false} />
          </div>
        </Card>

        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Output</h3>
            <Badge variant="success">+14% vs last week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyVelocity} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="done" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Tasks Done" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Team Activity</h3>
            <button onClick={() => navigate('/app/chat')} className="text-xs text-violet-500 font-semibold hover:underline cursor-pointer flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Chat →</button>
          </div>
          <div className="space-y-3">
            {teamActivity.map((act, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[9px] font-black shrink-0`}>
                  {act.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-800 dark:text-white">{act.user}</p>
                  <p className="text-[10px] text-slate-500 leading-snug">{act.action}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
