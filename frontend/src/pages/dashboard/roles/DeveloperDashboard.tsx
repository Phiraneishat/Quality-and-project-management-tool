import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Code2, ListTodo, GitBranch, Bug, Zap, Clock, CheckCircle,
  ArrowUpRight, GitCommit, GitPullRequest, MessageSquare, Plus, TrendingUp,
} from 'lucide-react';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/Shared';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../../../store/authStore';

const myTasks = [
  { title: 'Implement JWT refresh token middleware', sprint: 'Alpha v2.3', priority: 'critical', status: 'In Progress', points: 5 },
  { title: 'Fix null pointer in checkout flow',      sprint: 'Alpha v2.3', priority: 'high',     status: 'To Do',       points: 3 },
  { title: 'Add pagination to /api/products',        sprint: 'Alpha v2.3', priority: 'medium',   status: 'In Review',   points: 8 },
  { title: 'Write unit tests for auth service',      sprint: 'Alpha v2.3', priority: 'medium',   status: 'To Do',       points: 5 },
  { title: 'Refactor payment gateway adapter',       sprint: 'Beta v2.4',  priority: 'low',      status: 'To Do',       points: 13 },
];
const commitActivity = [
  { day: 'Mon', commits: 6 }, { day: 'Tue', commits: 11 }, { day: 'Wed', commits: 8 },
  { day: 'Thu', commits: 14 }, { day: 'Fri', commits: 9 }, { day: 'Sat', commits: 2 }, { day: 'Sun', commits: 0 },
];
const velocityTrend = [
  { sprint: 'S3', points: 18 }, { sprint: 'S4', points: 23 }, { sprint: 'S5', points: 21 },
  { sprint: 'S6', points: 27 }, { sprint: 'S7', points: 24 }, { sprint: 'S8', points: 31 },
];
const prList = [
  { title: 'feat: Add JWT middleware',  status: 'open',   reviews: 1, branch: 'feature/jwt-middleware' },
  { title: 'fix: Checkout null pointer',status: 'review', reviews: 2, branch: 'fix/checkout-null-ptr' },
  { title: 'chore: Update deps',        status: 'merged', reviews: 3, branch: 'chore/update-deps' },
];
const myBugs = [
  { id: '#219', title: 'Login redirect loop on mobile',  severity: 'high',   status: 'Assigned' },
  { id: '#225', title: 'API 500 on empty cart checkout', severity: 'critical',status: 'In Progress' },
  { id: '#231', title: 'Dark mode flicker on login page',severity: 'low',    status: 'To Fix' },
];
const PRIORITY_COLORS: Record<string, string> = { critical: 'text-red-500 bg-red-500/10 border-red-500/20', high: 'text-orange-500 bg-orange-500/10 border-orange-500/20', medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20', low: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
const STATUS_COLORS: Record<string, string> = { 'In Progress': 'text-blue-500 bg-blue-500/10', 'To Do': 'text-slate-500 bg-slate-500/10', 'In Review': 'text-violet-500 bg-violet-500/10', 'Done': 'text-emerald-500 bg-emerald-500/10' };
const PR_COLORS: Record<string, string> = { open: 'text-blue-500 bg-blue-500/10 border-blue-500/20', review: 'text-amber-500 bg-amber-500/10 border-amber-500/20', merged: 'text-violet-500 bg-violet-500/10 border-violet-500/20' };
const s = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

export const DeveloperDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Developer Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome, <span className="font-bold text-emerald-500">{user?.name}</span> · Development tasks & sprint progress</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/app/bugs')}>View Bugs</Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/app/tasks')}>New Task</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: 'My Tasks',      value: 5,     icon: <ListTodo className="h-5 w-5" />,     color: 'indigo'  as const },
          { title: 'Completed',     value: 23,    icon: <CheckCircle className="h-5 w-5" />,  color: 'emerald' as const, trend: { value: 15, label: 'this sprint' } },
          { title: 'Story Points',  value: 34,    icon: <Zap className="h-5 w-5" />,           color: 'violet'  as const },
          { title: 'Open PRs',      value: 2,     icon: <GitPullRequest className="h-5 w-5" />,color: 'blue'    as const },
          { title: 'Bugs Assigned', value: 3,     icon: <Bug className="h-5 w-5" />,           color: 'rose'    as const },
          { title: 'Commits/Week',  value: 50,    icon: <GitCommit className="h-5 w-5" />,    color: 'teal'    as const, trend: { value: 8, label: 'vs last week' } },
        ].map((stat, i) => (
          <motion.div key={i} {...s(i)}><StatCard {...stat} /></motion.div>
        ))}
      </div>

      {/* My Tasks */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div><h3 className="text-sm font-bold text-slate-900 dark:text-white">My Tasks — Sprint Alpha v2.3</h3><p className="text-[10px] text-slate-400 mt-0.5">5 tasks assigned · 34 story points</p></div>
          <button onClick={() => navigate('/app/tasks')} className="text-xs text-emerald-500 font-semibold hover:underline cursor-pointer">View All →</button>
        </div>
        <div className="space-y-2">
          {myTasks.map((task, i) => (
            <motion.div key={i} {...s(i)} className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/20 transition-all cursor-pointer group">
              <div className={`w-2 h-full min-h-[2.5rem] rounded-full shrink-0 ${task.priority === 'critical' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-slate-400">{task.sprint}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border capitalize ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                </div>
              </div>
              <div className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${STATUS_COLORS[task.status]}`}>{task.status}</div>
              <div className="text-[10px] text-slate-400 shrink-0 text-right">
                <span className="font-black text-slate-900 dark:text-white">{task.points}</span> pts
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Charts + PRs + Bugs */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Commit Activity</h3>
            <Badge variant="success">This Week</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={commitActivity} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="commits" fill="#10b981" radius={[5, 5, 0, 0]} name="Commits" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Story Point Velocity</h3>
            <Badge variant="info">Last 6 Sprints</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={velocityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Line type="monotone" dataKey="points" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="Points" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="lg:col-span-4 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pull Requests</h3>
              <Badge variant="info">{prList.filter(p => p.status !== 'merged').length} open</Badge>
            </div>
            <div className="space-y-2">
              {prList.map((pr, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <GitPullRequest className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{pr.title}</p>
                    <p className="text-[9px] font-mono text-slate-400 truncate">{pr.branch}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border capitalize shrink-0 ${PR_COLORS[pr.status]}`}>{pr.status}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">My Bugs</h3>
              <button onClick={() => navigate('/app/bugs')} className="text-xs text-emerald-500 font-semibold hover:underline cursor-pointer">All Bugs →</button>
            </div>
            <div className="space-y-2">
              {myBugs.map((bug, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-primary-500 shrink-0">{bug.id}</span>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 flex-1 truncate">{bug.title}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border capitalize shrink-0 ${PRIORITY_COLORS[bug.severity]}`}>{bug.severity}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
