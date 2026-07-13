import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, Check, ChevronLeft, ChevronRight, ArrowRight,
  Calendar as CalendarIcon, Clock, MapPin, AlignLeft, Tag,
  Zap, Users, Flag, Bell, Repeat, Hash, CheckCircle2,
  AlertCircle, Layers,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input, Textarea } from '../../components/ui/Input';

/* ─────────────── Types ─────────────── */
type EventType = 'meeting' | 'sprint' | 'deadline' | 'release' | 'review' | 'personal';

interface CalEvent {
  id: string;
  day: number;
  month: number;
  year: number;
  title: string;
  type: EventType;
  color: string;
  time?: string;
  location?: string;
  desc?: string;
  allDay?: boolean;
}

/* ─────────────── Constants ─────────────── */
const DAYS_HEADER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EVENT_TYPES: { id: EventType; label: string; color: string; bg: string; pill: string }[] = [
  { id: 'meeting',  label: 'Meeting',   color: 'bg-amber-500',   bg: 'bg-amber-500/10',   pill: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'sprint',   label: 'Sprint',    color: 'bg-primary-500', bg: 'bg-primary-500/10', pill: 'text-primary-600 dark:text-primary-400 bg-primary-500/10 border-primary-500/20' },
  { id: 'deadline', label: 'Deadline',  color: 'bg-rose-500',    bg: 'bg-rose-500/10',    pill: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { id: 'release',  label: 'Release',   color: 'bg-emerald-500', bg: 'bg-emerald-500/10', pill: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'review',   label: 'Review',    color: 'bg-violet-500',  bg: 'bg-violet-500/10',  pill: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20' },
  { id: 'personal', label: 'Personal',  color: 'bg-blue-500',    bg: 'bg-blue-500/10',    pill: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' },
];

const typeConfig = (type: EventType) => EVENT_TYPES.find(t => t.id === type) ?? EVENT_TYPES[0];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/* ─────────────── Helpers ─────────────── */
const today = new Date();

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstWeekdayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay(); // 0=Sun,1=Mon…
  return d === 0 ? 6 : d - 1; // convert to Mon-based index
}
function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

/* ─────────────── Seed Events ─────────────── */
const SEED_EVENTS: CalEvent[] = [
  { id: 'e1', day: 3,  month: 6, year: 2026, title: 'Sprint Planning',       type: 'sprint',   color: 'bg-primary-500', time: '10:00 AM', allDay: false },
  { id: 'e2', day: 5,  month: 6, year: 2026, title: 'Release v2.4',          type: 'release',  color: 'bg-emerald-500', time: '02:00 PM', allDay: false },
  { id: 'e3', day: 8,  month: 6, year: 2026, title: 'Bug Triage Meeting',    type: 'meeting',  color: 'bg-amber-500',   time: '09:30 AM', location: 'Zoom', allDay: false },
  { id: 'e4', day: 12, month: 6, year: 2026, title: 'Sprint Review',         type: 'review',   color: 'bg-violet-500',  time: '03:00 PM', allDay: false },
  { id: 'e5', day: 15, month: 6, year: 2026, title: 'QA Sign-off Deadline',  type: 'deadline', color: 'bg-rose-500',    allDay: true },
  { id: 'e6', day: 18, month: 6, year: 2026, title: 'Team Retrospective',    type: 'meeting',  color: 'bg-blue-500',    time: '11:00 AM', location: 'Conf Room B', allDay: false },
  { id: 'e7', day: 22, month: 6, year: 2026, title: 'Sprint End',            type: 'sprint',   color: 'bg-primary-500', allDay: true },
  { id: 'e8', day: 28, month: 6, year: 2026, title: 'Monthly Report Due',    type: 'deadline', color: 'bg-teal-500',    allDay: true },
  { id: 'e9', day: today.getDate(), month: today.getMonth(), year: today.getFullYear(), title: 'Daily Standup', type: 'meeting', color: 'bg-amber-500', time: '09:00 AM', location: 'Google Meet', allDay: false },
];

/* ─────────────── Add Event Modal ─────────────── */
interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: CalEvent) => void;
  preselectedDay?: number;
  viewMonth: number;
  viewYear: number;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd, preselectedDay, viewMonth, viewYear }) => {
  const [title, setTitle]       = useState('');
  const [type, setType]         = useState<EventType>('meeting');
  const [day, setDay]           = useState(preselectedDay ?? today.getDate());
  const [month, setMonth]       = useState(viewMonth);
  const [year, setYear]         = useState(viewYear);
  const [time, setTime]         = useState('');
  const [allDay, setAllDay]     = useState(false);
  const [location, setLocation] = useState('');
  const [desc, setDesc]         = useState('');
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const cfg = typeConfig(type);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Event title is required';
    if (!day || day < 1 || day > 31) e.day = 'Enter a valid day';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onAdd({
      id: makeId(),
      day, month, year, title: title.trim(), type,
      color: cfg.color, time: allDay ? undefined : time || undefined,
      location: location || undefined, desc: desc || undefined, allDay,
    });
    handleReset();
  };

  const handleReset = () => {
    setTitle(''); setType('meeting'); setDay(preselectedDay ?? today.getDate());
    setMonth(viewMonth); setYear(viewYear); setTime(''); setAllDay(false);
    setLocation(''); setDesc(''); setErrors({});
    onClose();
  };

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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
          className="relative w-full max-w-lg bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Colour bar */}
          <div className={`h-1 w-full ${cfg.color}`} />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${cfg.bg} border border-current/20`}>
                <CalendarIcon className={`h-5 w-5 ${cfg.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <h2 className="text-xl font-black font-display text-slate-900 dark:text-white">Add Event</h2>
                <p className="text-xs text-slate-400 mt-0.5">Schedule a new calendar event</p>
              </div>
            </div>
            <button onClick={handleReset} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5 max-h-[72vh] overflow-y-auto">

            {/* Title */}
            <Input
              label="Event Title"
              placeholder="e.g. Sprint Planning Meeting"
              value={title}
              onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })); }}
              error={errors.title}
              icon={<Hash className="h-4 w-4" />}
            />

            {/* Event type */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Event Type</label>
              <div className="grid grid-cols-3 gap-2">
                {EVENT_TYPES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      type === t.id
                        ? `${t.bg} border-current/30 text-slate-900 dark:text-white`
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color} shrink-0`} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Day</label>
                <input
                  type="number" min={1} max={31} value={day}
                  onChange={e => { setDay(Number(e.target.value)); setErrors(p => ({ ...p, day: '' })); }}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                />
                {errors.day && <p className="text-[10px] text-red-500 mt-1">{errors.day}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Month</label>
                <select
                  value={month}
                  onChange={e => setMonth(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-900 dark:text-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer"
                >
                  {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m.slice(0, 3)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Year</label>
                <input
                  type="number" value={year}
                  onChange={e => setYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            {/* All day + time */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">All-day Event</p>
                  <p className="text-[10px] text-slate-400">No specific start/end time</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllDay(!allDay)}
                  className={`w-10 h-5.5 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${allDay ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow ${allDay ? 'translate-x-4.5' : 'translate-x-0'}`} />
                </button>
              </div>
              {!allDay && (
                <Input
                  label="Event Time"
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  icon={<Clock className="h-4 w-4" />}
                />
              )}
            </div>

            {/* Location */}
            <Input
              label="Location (optional)"
              placeholder="e.g. Zoom, Conference Room B"
              value={location}
              onChange={e => setLocation(e.target.value)}
              icon={<MapPin className="h-4 w-4" />}
            />

            {/* Description */}
            <Textarea
              label="Description (optional)"
              placeholder="Add notes or agenda for this event…"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-950/30">
            <Button variant="ghost" onClick={handleReset}>Cancel</Button>
            <Button
              variant="primary"
              leftIcon={<Check className="h-4 w-4" />}
              onClick={handleSubmit}
            >
              Add to Calendar
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* ─────────────── Event Detail Popover ─────────────── */
interface EventDetailProps {
  event: CalEvent;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose, onDelete }) => {
  const cfg = typeConfig(event.type);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      transition={{ duration: 0.18 }}
      className="absolute z-40 top-full left-0 mt-1 w-64 bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.color} shrink-0 mt-0.5`} />
          <p className="text-sm font-bold text-slate-900 dark:text-white">{event.title}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"><X className="h-3.5 w-3.5" /></button>
      </div>
      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.pill}`}>{cfg.label}</span>
      {event.time && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          {event.time}
        </div>
      )}
      {event.allDay && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
          All-day event
        </div>
      )}
      {event.location && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          {event.location}
        </div>
      )}
      {event.desc && (
        <p className="text-xs text-slate-400 leading-relaxed">{event.desc}</p>
      )}
      <div className="pt-1 border-t border-slate-100 dark:border-slate-700 flex justify-end">
        <button
          onClick={() => { onDelete(event.id); onClose(); }}
          className="text-[10px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer transition-colors"
        >
          Remove event
        </button>
      </div>
    </motion.div>
  );
};

/* ─────────────── Main Calendar Page ─────────────── */
export const CalendarPage: React.FC = () => {
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [view, setView]           = useState<'Month' | 'Week' | 'Day'>('Month');
  const [events, setEvents]       = useState<CalEvent[]>(SEED_EVENTS);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [addPreselectedDay, setAddPreselectedDay] = useState<number | undefined>(undefined);
  const [selectedEventId, setSelectedEventId]     = useState<string | null>(null);
  const [toast, setToast]         = useState<string | null>(null);

  /* Navigate */
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); };

  /* Grid cells */
  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const startOffset  = getFirstWeekdayOfMonth(viewYear, viewMonth);
  const totalCells   = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  /* Events for this month */
  const monthEvents = useMemo(
    () => events.filter(e => e.month === viewMonth && e.year === viewYear),
    [events, viewMonth, viewYear]
  );

  /* Upcoming (future from today) */
  const upcomingEvents = useMemo(() => {
    const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return events
      .filter(e => {
        const d = new Date(e.year, e.month, e.day);
        return d >= now;
      })
      .sort((a, b) => new Date(a.year, a.month, a.day).getTime() - new Date(b.year, b.month, b.day).getTime())
      .slice(0, 6);
  }, [events]);

  const addEvent = (evt: CalEvent) => {
    setEvents(prev => [...prev, evt]);
    showToast(`"${evt.title}" added to calendar!`);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('Event removed.');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const openAddOnDay = (day: number) => {
    setAddPreselectedDay(day);
    setShowAddModal(true);
  };

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">View meetings, deadlines, sprints, and milestones.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToday}>Today</Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setAddPreselectedDay(undefined); setShowAddModal(true); }}>
            Add Event
          </Button>
        </div>
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

      {/* Calendar card */}
      <Card>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white min-w-[160px] text-center">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-1">
            {(['Day', 'Week', 'Month'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  view === v
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Today highlight banner */}
        {viewMonth === today.getMonth() && viewYear === today.getFullYear() && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 mb-4 px-3.5 py-2.5 bg-primary-500/8 border border-primary-500/15 rounded-xl"
          >
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <p className="text-xs font-bold text-primary-600 dark:text-primary-400">
              Today is {MONTH_NAMES[today.getMonth()]} {today.getDate()}, {today.getFullYear()}
            </p>
            <span className="text-[10px] text-slate-400 ml-auto">
              {monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''} this month
            </span>
          </motion.div>
        )}

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-px mb-1">
          {DAYS_HEADER.map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-wider py-2">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-800/60 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
          {Array.from({ length: totalCells }, (_, i) => {
            const day = i - startOffset + 1;
            const valid = day >= 1 && day <= daysInMonth;
            const dayEvts = valid ? monthEvents.filter(e => e.day === day) : [];
            const todayCell = valid && isToday(day);

            return (
              <div
                key={i}
                onClick={() => valid && openAddOnDay(day)}
                className={`min-h-[88px] p-1.5 relative cursor-pointer transition-colors group ${
                  !valid
                    ? 'bg-slate-50 dark:bg-surface-950/50 cursor-default'
                    : todayCell
                    ? 'bg-primary-500/5 hover:bg-primary-500/8'
                    : 'bg-white dark:bg-surface-900 hover:bg-slate-50 dark:hover:bg-surface-800/60'
                }`}
              >
                {valid && (
                  <>
                    {/* Day number */}
                    <span className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full transition-all ${
                      todayCell
                        ? 'bg-primary-500 text-white'
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}>
                      {day}
                    </span>

                    {/* Add hint on hover */}
                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-3 w-3 text-slate-400" />
                    </div>

                    {/* Events */}
                    <div className="mt-1 space-y-0.5">
                      {dayEvts.slice(0, 3).map(evt => (
                        <div
                          key={evt.id}
                          onClick={e => { e.stopPropagation(); setSelectedEventId(selectedEventId === evt.id ? null : evt.id); }}
                          className={`${evt.color} text-white text-[9px] font-semibold px-1.5 py-0.5 rounded truncate cursor-pointer hover:brightness-110 transition-all relative`}
                        >
                          {evt.time && <span className="opacity-75 mr-0.5">{evt.time.split(':')[0]}</span>}
                          {evt.title}

                          {/* Popover */}
                          <AnimatePresence>
                            {selectedEventId === evt.id && (
                              <EventDetail
                                event={evt}
                                onClose={() => setSelectedEventId(null)}
                                onDelete={deleteEvent}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                      {dayEvts.length > 3 && (
                        <p className="text-[9px] text-slate-400 font-bold pl-1">+{dayEvts.length - 3} more</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {EVENT_TYPES.map(t => (
            <span key={t.id} className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className={`w-2 h-2 rounded-full ${t.color}`} />
              {t.label}
            </span>
          ))}
        </div>
      </Card>

      {/* Upcoming events */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Events</h3>
          <span className="text-[10px] text-slate-400">{upcomingEvents.length} upcoming</span>
        </div>
        <div className="space-y-2">
          <AnimatePresence>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No upcoming events. Add one above!</p>
            ) : (
              upcomingEvents.map((evt, i) => {
                const cfg = typeConfig(evt.type);
                const evtDate = new Date(evt.year, evt.month, evt.day);
                const isEvtToday = evtDate.toDateString() === today.toDateString();
                return (
                  <motion.div
                    key={evt.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-surface-800/50 transition-colors group"
                  >
                    <div className={`w-1.5 h-10 rounded-full ${cfg.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{evt.title}</p>
                        {isEvtToday && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-primary-500 text-white shrink-0">TODAY</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-[10px] text-slate-400">
                          {MONTH_NAMES[evt.month].slice(0, 3)} {evt.day}, {evt.year}
                        </p>
                        {evt.time && <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" />{evt.time}</p>}
                        {evt.location && <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate"><MapPin className="h-3 w-3" />{evt.location}</p>}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.pill}`}>{cfg.label}</span>
                    <button
                      onClick={() => deleteEvent(evt.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-300 hover:text-rose-500 transition-all cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addEvent}
        preselectedDay={addPreselectedDay}
        viewMonth={viewMonth}
        viewYear={viewYear}
      />
    </div>
  );
};
