import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, TestTube, Bug, CheckCircle, XCircle, Ban, Clock,
  FlaskConical, ArrowUpRight, Plus, TrendingUp, AlertTriangle, ShieldCheck,
} from 'lucide-react';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/Shared';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../../../store/authStore';

const testSuites = [
  { name: 'Authentication Tests',  project: 'E-Commerce',  passed: 42, failed: 2, blocked: 1, total: 45, rate: 93 },
  { name: 'Dashboard UI Tests',    project: 'QualityDesk', passed: 28, failed: 3, blocked: 0, total: 31, rate: 88 },
  { name: 'Payment Integration',   project: 'E-Commerce',  passed: 25, failed: 1, blocked: 2, total: 28, rate: 89 },
  { name: 'API Endpoint Tests',    project: 'E-Commerce',  passed: 54, failed: 2, blocked: 0, total: 56, rate: 96 },
];
const myBugs = [
  { id: '#208', title: 'Login timeout on Firefox 122',           severity: 'critical', status: 'Open',   project: 'E-Commerce' },
  { id: '#215', title: 'Cart total rounding error on checkout',  severity: 'high',     status: 'Assigned','project': 'E-Commerce' },
  { id: '#220', title: 'Pagination broken on mobile viewport',   severity: 'medium',   status: 'Verified','project': 'QualityDesk' },
  { id: '#224', title: 'Dark mode text contrast fails WCAG',     severity: 'low',      status: 'Open',   project: 'QualityDesk' },
];
const qualityTrend = [
  { sprint: 'S3', score: 74 }, { sprint: 'S4', score: 79 }, { sprint: 'S5', score: 82 },
  { sprint: 'S6', score: 86 }, { sprint: 'S7', score: 89 }, { sprint: 'S8', score: 93 },
];
const bugBySeverity = [
  { name: 'Critical', value: 3,  fill: '#dc2626' },
  { name: 'High',     value: 8,  fill: '#f97316' },
  { name: 'Medium',   value: 12, fill: '#eab308' },
  { name: 'Low',      value: 5,  fill: '#22c55e' },
];
const testPassRateWeekly = [
  { day: 'Mon', rate: 88 }, { day: 'Tue', rate: 91 }, { day: 'Wed', rate: 87 },
  { day: 'Thu', rate: 94 }, { day: 'Fri', rate: 90 }, { day: 'Sat', rate: 93 },
];
const PRIORITY_COLORS: Record<string, string> = {
  critical: 'text-red-500 bg-red-500/10 border-red-500/20',
  high:     'text-orange-500 bg-orange-500/10 border-orange-500/20',
  medium:   'text-amber-500 bg-amber-500/10 border-amber-500/20',
  low:      'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
};
const s = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.05 } });

export const QATesterDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">QA Tester Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome, <span className="font-bold text-amber-500">{user?.name}</span> · Testing & quality assurance</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/app/test-cases')}>Test Suites</Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => navigate('/app/bugs')}>Report Bug</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: 'Total Tests',   value: 160,   icon: <TestTube className="h-5 w-5" />,     color: 'indigo'  as const },
          { title: 'Passed',        value: 149,   icon: <CheckCircle className="h-5 w-5" />,  color: 'emerald' as const, trend: { value: 5, label: 'vs last run' } },
          { title: 'Failed',        value: 8,     icon: <XCircle className="h-5 w-5" />,      color: 'rose'    as const, trend: { value: -3, label: 'improved' } },
          { title: 'Pass Rate',     value: '93%', icon: <ShieldCheck className="h-5 w-5" />,  color: 'teal'    as const, trend: { value: 2, label: 'vs last sprint' } },
          { title: 'Open Bugs',     value: 28,    icon: <Bug className="h-5 w-5" />,           color: 'amber'   as const },
          { title: 'Resolved',      value: 156,   icon: <CheckCircle className="h-5 w-5" />,  color: 'emerald' as const, trend: { value: 18, label: 'this month' } },
        ].map((stat, i) => (
          <motion.div key={i} {...s(i)}><StatCard {...stat} /></motion.div>
        ))}
      </div>

      {/* Test Suites */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Test Suites</h3><p className="text-[10px] text-slate-400 mt-0.5">Real-time test execution status</p></div>
          <button onClick={() => navigate('/app/test-cases')} className="text-xs text-amber-500 font-semibold hover:underline cursor-pointer">Manage Suites →</button>
        </div>
        <div className="space-y-3">
          {testSuites.map((suite, i) => (
            <motion.div key={i} {...s(i)} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-500/20 transition-all cursor-pointer group">
              <div className="p-2.5 rounded-xl bg-amber-500/10 shrink-0">
                <FlaskConical className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">{suite.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Project: {suite.project}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  {[{ icon: CheckCircle, val: suite.passed, color: 'text-emerald-500' }, { icon: XCircle, val: suite.failed, color: 'text-red-500' }, { icon: Ban, val: suite.blocked, color: 'text-amber-500' }].map(({ icon: Icon, val, color }) => (
                    <span key={color} className={`flex items-center gap-1 text-[10px] font-semibold ${color}`}><Icon className="h-3 w-3" />{val}</span>
                  ))}
                </div>
              </div>
              <div className="sm:w-40 shrink-0">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">Pass Rate</span>
                  <span className={`font-black ${suite.rate >= 90 ? 'text-emerald-500' : suite.rate >= 75 ? 'text-amber-500' : 'text-red-500'}`}>{suite.rate}%</span>
                </div>
                <ProgressBar value={suite.rate} color={suite.rate >= 90 ? 'bg-emerald-500' : suite.rate >= 75 ? 'bg-amber-500' : 'bg-red-500'} showLabel={false} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 shrink-0 transition-colors" />
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Charts + Bugs */}
      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bugs by Severity</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={bugBySeverity} cx="50%" cy="50%" outerRadius={75} innerRadius={40} dataKey="value" paddingAngle={3}>
                {bugBySeverity.map((entry, i) => <Cell key={i} fill={entry.fill} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {bugBySeverity.map(b => (
              <div key={b.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: b.fill }} />
                <span className="flex-1 text-slate-600 dark:text-slate-400">{b.name}</span>
                <span className="font-bold text-slate-900 dark:text-white">{b.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quality Trend</h3>
            <Badge variant="success">↑ 19pts over 6 sprints</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={qualityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} name="Quality Score" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">My Bug Reports</h3>
            <button onClick={() => navigate('/app/bugs')} className="text-xs text-amber-500 font-semibold hover:underline cursor-pointer">View All →</button>
          </div>
          <div className="space-y-2.5">
            {myBugs.map((bug, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-500/20 cursor-pointer transition-all group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-primary-500">{bug.id}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${PRIORITY_COLORS[bug.severity]}`}>{bug.severity}</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug group-hover:text-amber-500 transition-colors">{bug.title}</p>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[9px] text-slate-400">{bug.project}</span>
                  <span className="text-[9px] text-slate-400">{bug.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
