import React from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

const notifications = [
  { id: '1', title: 'Bug #142 assigned to you', msg: 'Login redirect loop on expired session — Critical severity', time: '2 min ago', read: false, type: 'bug' },
  { id: '2', title: 'Sprint Alpha v2.4 started', msg: 'Sprint planning is complete. 24 tasks added to backlog.', time: '1 hour ago', read: false, type: 'sprint' },
  { id: '3', title: 'Task deadline approaching', msg: '"API Integration" is due in 2 days. Current status: In Progress', time: '3 hours ago', read: false, type: 'deadline' },
  { id: '4', title: '@mention in Engineering Chat', msg: 'Alice: @you can you review the auth middleware PR?', time: '5 hours ago', read: true, type: 'mention' },
  { id: '5', title: 'Quality Score Updated', msg: 'E-Commerce project quality score improved to 94% (+4pts)', time: '1 day ago', read: true, type: 'quality' },
  { id: '6', title: 'New team member added', msg: 'Henry Ford joined the Engineering department as Developer.', time: '2 days ago', read: true, type: 'team' },
];

const typeColors: Record<string, string> = {
  'bug': 'text-rose-500 bg-rose-50 dark:bg-rose-950/30',
  'sprint': 'text-violet-500 bg-violet-50 dark:bg-violet-950/30',
  'deadline': 'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
  'mention': 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
  'quality': 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  'team': 'text-primary-500 bg-primary-50 dark:bg-primary-950/30',
};

export const Notifications: React.FC = () => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated with real-time alerts and reminders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" leftIcon={<CheckCheck className="h-4 w-4" />}>Mark All Read</Button>
          <Badge variant="danger" size="md">{unreadCount} unread</Badge>
        </div>
      </div>

      <Card padding="none">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 px-5 py-4 transition-colors ${!notif.read ? 'bg-primary-50/50 dark:bg-primary-950/10' : 'hover:bg-slate-50 dark:hover:bg-surface-800/50'}`}
            >
              <div className={`p-2 rounded-lg ${typeColors[notif.type]} shrink-0 mt-0.5`}>
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-semibold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{notif.msg}</p>
                  </div>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0 mt-2" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
