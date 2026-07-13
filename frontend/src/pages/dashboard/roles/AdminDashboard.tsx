import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, FolderKanban, Bug, Zap, TrendingUp, AlertTriangle,
  Activity, Server, Lock, UserCheck, Globe, ArrowUpRight, Plus,
  CheckCircle, XCircle, Clock, Database, Cpu, Wifi, RefreshCw,
} from 'lucide-react';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/Shared';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAuthStore } from '../../../store/authStore';

const userGrowth = [
  { month: 'Jan', users: 120 }, { month: 'Feb', users: 145 }, { month: 'Mar', users: 162 },
  { month: 'Apr', users: 190 }, { month: 'May', users: 224 }, { month: 'Jun', users: 267 },
  { month: 'Jul', users: 312 },
];
const systemLoad = [
  { time: '00:00', cpu: 23, mem: 45 }, { time: '04:00', cpu: 18, mem: 42 },
  { time: '08:00', cpu: 62, mem: 61 }, { time: '12:00', cpu: 78, mem: 72 },
  { time: '16:00', cpu: 71, mem: 68 }, { time: '20:00', cpu: 55, mem: 58 },
  { time: '23:59', cpu: 30, mem: 48 },
];
const roleDistribution = [
  { name: 'Developer', value: 38, fill: '#10b981' },
  { name: 'QA Tester', value: 22, fill: '#f59e0b' },
  { name: 'Project Manager', value: 18, fill: '#3b82f6' },
  { name: 'Team Lead', value: 12, fill: '#8b5cf6' },
  { name: 'Client', value: 10, fill: '#f43f5e' },
];
const recentUsers = [
  { name: 'Grace Hopper',   role: 'QA Tester',       email: 'grace@co.io',  status: 'active',  joined: '2 hrs ago' },
  { name: 'Liam Torres',    role: 'Developer',        email: 'liam@co.io',   status: 'active',  joined: '1 day ago' },
  { name: 'Priya Nair',     role: 'Project Manager',  email: 'priya@co.io',  status: 'pending', joined: '2 days ago' },
  { name: 'Sam Williams',   role: 'Team Lead',        email: 'sam@co.io',    status: 'active',  joined: '3 days ago' },
  { name: 'Client Corp',    role: 'Client',           email: 'corp@co.io',   status: 'invited', joined: '5 days ago' },
];
const auditLogs = [
  { action: 'User "grace@co.io" registered',           type: 'user',    time: '2 hrs ago',  icon: UserCheck },
  { action: 'System backup completed successfully',     type: 'system',  time: '4 hrs ago',  icon: Database },
  { action: 'Role changed: liam → Team Lead',          type: 'role',    time: '6 hrs ago',  icon: Shield },
  { action: 'Project "Analytics v2" archived',          type: 'project', time: '10 hrs ago', icon: FolderKanban },
  { action: 'SSL certificate renewed for *.qualitydesk.io', type: 'security', time: '1 day ago', icon: Lock },
  { action: 'API rate limit exceeded from 192.168.1.5', type: 'warning', time: '1 day ago', icon: AlertTriangle },
];

const ROLE_COLORS: Record<string, string> = { 'Developer': '#10b981', 'QA Tester': '#f59e0b', 'Project Manager': '#3b82f6', 'Team Lead': '#8b5cf6', 'Client': '#f43f5e' };
const s = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome back, <span className="font-bold text-primary-500">{user?.name}</span> · Full system access</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/app/settings')}>System Settings</Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/app/team')}>Add User</Button>
        </div>
      </div>

      {/* System health pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'API', status: 'Operational', color: 'emerald', icon: Globe },
          { label: 'Database', status: '99.9% uptime', color: 'emerald', icon: Database },
          { label: 'CPU', status: '62% load', color: 'amber', icon: Cpu },
          { label: 'Network', status: 'Normal', color: 'emerald', icon: Wifi },
          { label: 'Auth Service', status: 'Active', color: 'emerald', icon: Lock },
          { label: 'Storage', status: '68% used', color: 'amber', icon: Server },
        ].map(({ label, status, color, icon: Icon }) => (
          <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold
            ${color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
            <Icon className="h-3.5 w-3.5" />
            {label}: {status}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: 'Total Users',    value: 312,  icon: <Users className="h-5 w-5" />,       color: 'indigo' as const, trend: { value: 16, label: 'this month' } },
          { title: 'Active Projects',value: 18,   icon: <FolderKanban className="h-5 w-5" />,color: 'emerald' as const,trend: { value: 8, label: 'vs last month' } },
          { title: 'Open Bugs',      value: 12,   icon: <Bug className="h-5 w-5" />,          color: 'rose' as const,   trend: { value: -30, label: 'improving' } },
          { title: 'Active Sprints', value: 4,    icon: <Zap className="h-5 w-5" />,          color: 'violet' as const, trend: { value: 0, label: 'stable' } },
          { title: 'System Uptime',  value: '99.9%', icon: <Server className="h-5 w-5" />,   color: 'teal' as const,   trend: { value: 0.1, label: 'improvement' } },
          { title: 'Security Score', value: '94%',icon: <Shield className="h-5 w-5" />,       color: 'emerald' as const,trend: { value: 4, label: 'vs last audit' } },
        ].map((stat, i) => (
          <motion.div key={i} {...s(i)}><StatCard {...stat} /></motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-sm font-bold text-slate-900 dark:text-white">User Growth</h3><p className="text-[10px] text-slate-400 mt-0.5">Monthly registered users</p></div>
            <Badge variant="success" dot>Growing</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#ug)" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="lg:col-span-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Role Distribution</h3>
          <p className="text-[10px] text-slate-400 mb-4">312 total users</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={roleDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}>
                {roleDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {roleDistribution.map(r => (
              <div key={r.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.fill }} />
                <span className="flex-1 text-slate-600 dark:text-slate-400">{r.name}</span>
                <span className="font-bold text-slate-900 dark:text-white">{r.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 — System Load + Recent Users + Audit */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">System Load</h3>
            <button className="text-xs text-primary-500 font-semibold hover:underline cursor-pointer flex items-center gap-1"><RefreshCw className="h-3 w-3" /> Refresh</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={systemLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Line type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={2} dot={false} name="CPU" />
              <Line type="monotone" dataKey="mem" stroke="#10b981" strokeWidth={2} dot={false} name="Memory" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500"><div className="w-3 h-0.5 bg-primary-500 rounded" />CPU</span>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500"><div className="w-3 h-0.5 bg-emerald-500 rounded" />Memory</span>
          </div>
        </Card>

        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Users</h3>
            <button onClick={() => navigate('/app/team')} className="text-xs text-primary-500 font-semibold hover:underline cursor-pointer">Manage →</button>
          </div>
          <div className="space-y-2.5">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                  {u.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                  <p className="text-[10px] text-slate-400">{u.role}</p>
                </div>
                <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : u.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                  {u.status}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Audit Log</h3>
            <button onClick={() => navigate('/app/settings')} className="text-xs text-primary-500 font-semibold hover:underline cursor-pointer">View All →</button>
          </div>
          <div className="space-y-2.5">
            {auditLogs.map((log, i) => {
              const Icon = log.icon;
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${log.type === 'warning' ? 'bg-amber-500/10 text-amber-500' : log.type === 'security' ? 'bg-rose-500/10 text-rose-500' : 'bg-primary-500/10 text-primary-500'}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-snug">{log.action}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">{log.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
