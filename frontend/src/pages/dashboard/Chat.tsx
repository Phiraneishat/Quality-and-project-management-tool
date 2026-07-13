import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Paperclip, Smile, Search, Phone, Video,
  MoreVertical, Pin, Reply, Trash2, Heart, ThumbsUp, Laugh,
  Zap, Check, CheckCheck, Plus, X, Hash, Users, ChevronDown,
  AtSign, Bold, Italic, Code, Mic, MicOff, ImageIcon,
  FileText, Star, Bell, BellOff, Settings, UserPlus,
  ArrowLeft, Circle,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';

/* ─────────────── Types ─────────────── */
interface Reaction { emoji: string; users: string[]; }
interface Attachment { name: string; size: string; type: 'file' | 'image'; }
interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: Reaction[];
  replyTo?: string;
  attachment?: Attachment;
  edited?: boolean;
  pinned?: boolean;
}
interface Channel {
  id: string;
  name: string;
  type: 'team' | 'project' | 'direct' | 'group';
  lastMsg: string;
  time: string;
  unread: number;
  members: number;
  online: number;
  muted?: boolean;
  avatar?: string;
  status?: 'online' | 'busy' | 'away' | 'offline';
  messages: Message[];
}

/* ─────────────── Seed Data ─────────────── */
function mkId() { return Math.random().toString(36).slice(2, 9); }
function now() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const CHANNELS: Channel[] = [
  {
    id: 'c1', name: 'Engineering Team', type: 'team',
    lastMsg: 'Alice: Pushed the auth fix!', time: '2m', unread: 3, members: 8, online: 3,
    messages: [
      { id: 'm1', sender: 'Alice Johnson', content: 'Hey team! Just pushed the auth middleware fix. Can someone review?', time: '10:32 AM', isMe: false, status: 'read', reactions: [{ emoji: '👍', users: ['Bob', 'You'] }, { emoji: '🔥', users: ['Charlie'] }] },
      { id: 'm2', sender: 'Bob Smith', content: "I'll take a look in 30 minutes after my current PR is done.", time: '10:35 AM', isMe: false, status: 'read' },
      { id: 'm3', sender: 'You', content: 'Great work Alice! I noticed the JWT refresh token logic might need an edge case check for expired sessions.', time: '10:38 AM', isMe: true, status: 'read' },
      { id: 'm4', sender: 'Alice Johnson', content: "Good catch! I'll add that. Also, the sprint planning meeting is at 2pm today — don't forget! 📅", time: '10:40 AM', isMe: false, reactions: [{ emoji: '✅', users: ['You', 'Bob', 'Charlie'] }] },
      { id: 'm5', sender: 'You', content: "Thanks for the reminder! I'll prepare the backlog items before the meeting.", time: '10:42 AM', isMe: true, status: 'read' },
      { id: 'm6', sender: 'Charlie Brown', content: 'QA sign-off on the last release is done ✅ All 147 test cases passed!', time: '10:50 AM', isMe: false, reactions: [{ emoji: '🎉', users: ['You', 'Alice', 'Bob'] }] },
      { id: 'm7', sender: 'You', content: 'Amazing work Charlie 🚀 Lets ship this today!', time: '10:52 AM', isMe: true, status: 'delivered' },
    ],
  },
  {
    id: 'c2', name: 'E-Commerce Project', type: 'project',
    lastMsg: 'Bob: Sprint review at 3pm', time: '15m', unread: 0, members: 5, online: 2,
    messages: [
      { id: 'p1', sender: 'Bob Smith', content: 'Sprint review is today at 3pm. Please have your demos ready 🎯', time: '09:45 AM', isMe: false },
      { id: 'p2', sender: 'Diana Prince', content: 'The checkout flow redesign is ready for demo!', time: '09:50 AM', isMe: false, attachment: { name: 'checkout-design-v3.fig', size: '4.2 MB', type: 'file' } },
      { id: 'p3', sender: 'You', content: 'Payment gateway integration is 90% done. Should be finished by tonight.', time: '10:00 AM', isMe: true, status: 'read' },
    ],
  },
  {
    id: 'c3', name: 'QA Discussion', type: 'group',
    lastMsg: 'Charlie: Test results uploaded', time: '1h', unread: 5, members: 4, online: 2,
    messages: [
      { id: 'q1', sender: 'Charlie Brown', content: 'Test results for build 2.4.1 uploaded. 12 critical bugs found.', time: '08:30 AM', isMe: false },
      { id: 'q2', sender: 'Grace Hopper', content: 'I categorised them by severity. Check the sheet 📋', time: '08:35 AM', isMe: false, attachment: { name: 'bug-report-2.4.1.xlsx', size: '1.8 MB', type: 'file' } },
      { id: 'q3', sender: 'You', content: 'Thanks Grace! Assigning all critical ones to the engineering team now.', time: '08:40 AM', isMe: true, status: 'read' },
      { id: 'q4', sender: 'Charlie Brown', content: 'The login timeout bug is the most critical — blocking 30% of users.', time: '08:42 AM', isMe: false, reactions: [{ emoji: '⚠️', users: ['You', 'Grace'] }] },
      { id: 'q5', sender: 'Grace Hopper', content: 'Should we push a hotfix today or wait for the full release?', time: '08:45 AM', isMe: false },
    ],
  },
  {
    id: 'c4', name: 'Diana Prince', type: 'direct',
    lastMsg: 'Can you review my PR?', time: '3h', unread: 1, members: 2, online: 1,
    status: 'online',
    messages: [
      { id: 'd1', sender: 'Diana Prince', content: 'Hey! Could you review my PR for the GraphQL migration? It adds pagination to all queries.', time: '07:15 AM', isMe: false },
      { id: 'd2', sender: 'You', content: 'Sure! Sending it over in 10 mins after standup.', time: '07:18 AM', isMe: true, status: 'read' },
      { id: 'd3', sender: 'Diana Prince', content: 'Thanks 🙏 The link is in the PR description.', time: '07:20 AM', isMe: false },
    ],
  },
  {
    id: 'c5', name: 'Design Team', type: 'team',
    lastMsg: 'Eve: New mockups ready', time: '5h', unread: 0, members: 3, online: 1, muted: true,
    messages: [
      { id: 'ds1', sender: 'Eve Adams', content: 'New mockups for the dashboard redesign are ready for review in Figma 🎨', time: '06:00 AM', isMe: false },
      { id: 'ds2', sender: 'You', content: 'They look amazing! Love the dark mode implementation.', time: '06:10 AM', isMe: true, status: 'read' },
    ],
  },
];

const EMOJI_LIST = ['👍', '❤️', '😂', '🎉', '🔥', '✅', '🚀', '⚠️', '👀', '💡', '🙏', '⭐'];

const TYPE_COLORS: Record<string, string> = {
  team: 'bg-primary-500', project: 'bg-emerald-500',
  group: 'bg-violet-500', direct: 'bg-amber-500',
};

/* ─────────────── Sub-components ─────────────── */
const EmojiPicker: React.FC<{ onPick: (e: string) => void; onClose: () => void }> = ({ onPick, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: 8 }}
    className="absolute bottom-14 right-14 bg-white dark:bg-surface-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 shadow-2xl grid grid-cols-6 gap-1.5 z-50"
  >
    {EMOJI_LIST.map(e => (
      <button key={e} onClick={() => { onPick(e); onClose(); }}
        className="w-9 h-9 flex items-center justify-center text-lg hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer">
        {e}
      </button>
    ))}
  </motion.div>
);

const MessageBubble: React.FC<{
  msg: Message;
  onReact: (id: string, emoji: string) => void;
  onReply: (msg: Message) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
}> = ({ msg, onReact, onReply, onDelete, onPin }) => {
  const [hovered, setHovered] = useState(false);
  const [showReactPicker, setShowReactPicker] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 group ${msg.isMe ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowReactPicker(false); }}
    >
      {!msg.isMe && (
        <div className="shrink-0">
          <div className={`w-8 h-8 rounded-full ${TYPE_COLORS.team} flex items-center justify-center text-white text-xs font-black`}>
            {msg.sender.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        </div>
      )}

      <div className={`max-w-[72%] relative ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        {!msg.isMe && (
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 px-1">{msg.sender}</p>
        )}

        {/* Reply reference */}
        {msg.replyTo && (
          <div className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg mb-1 border-l-2 border-primary-500">
            ↩ Replying to: {msg.replyTo}
          </div>
        )}

        {/* Attachment */}
        {msg.attachment && (
          <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-1.5 border cursor-pointer ${
            msg.isMe
              ? 'bg-primary-600 border-primary-400/30 text-white'
              : 'bg-slate-100 dark:bg-surface-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {msg.attachment.type === 'image' ? <ImageIcon className="h-4 w-4 shrink-0" /> : <FileText className="h-4 w-4 shrink-0" />}
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{msg.attachment.name}</p>
              <p className={`text-[10px] ${msg.isMe ? 'text-primary-200' : 'text-slate-400'}`}>{msg.attachment.size}</p>
            </div>
          </div>
        )}

        {/* Message bubble */}
        <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          msg.isMe
            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-sm shadow-lg shadow-primary-500/20'
            : 'bg-white dark:bg-surface-800 text-slate-900 dark:text-white rounded-bl-sm border border-slate-200 dark:border-slate-700'
        }`}>
          {msg.pinned && (
            <span className="absolute -top-2 -left-1 text-amber-400 text-xs">📌</span>
          )}
          {msg.content}
          {msg.edited && <span className="text-[9px] opacity-50 ml-1.5">(edited)</span>}
        </div>

        {/* Reactions */}
        {msg.reactions && msg.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {msg.reactions.map(r => (
              <button key={r.emoji}
                onClick={() => onReact(msg.id, r.emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border cursor-pointer transition-all hover:scale-105 ${
                  r.users.includes('You')
                    ? 'bg-primary-500/15 border-primary-500/30 text-primary-600 dark:text-primary-400'
                    : 'bg-white dark:bg-surface-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                {r.emoji} <span className="font-bold">{r.users.length}</span>
              </button>
            ))}
          </div>
        )}

        {/* Time + read receipt */}
        <div className={`flex items-center gap-1.5 mt-1 px-1 ${msg.isMe ? 'justify-end' : ''}`}>
          <span className="text-[9px] text-slate-400">{msg.time}</span>
          {msg.isMe && (
            msg.status === 'read' ? <CheckCheck className="h-3 w-3 text-primary-400" />
            : msg.status === 'delivered' ? <CheckCheck className="h-3 w-3 text-slate-400" />
            : <Check className="h-3 w-3 text-slate-400" />
          )}
        </div>
      </div>

      {/* Hover actions */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`flex items-center gap-0.5 self-center shrink-0 bg-white dark:bg-surface-800 border border-slate-200 dark:border-slate-700 rounded-xl px-1 py-0.5 shadow-md ${msg.isMe ? 'mr-1' : 'ml-1'}`}
          >
            <div className="relative">
              <button onClick={() => setShowReactPicker(p => !p)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="React">
                <Smile className="h-3.5 w-3.5" />
              </button>
              <AnimatePresence>
                {showReactPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute bottom-10 left-0 bg-white dark:bg-surface-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-2xl grid grid-cols-6 gap-1 z-50 w-52"
                  >
                    {EMOJI_LIST.map(e => (
                      <button key={e} onClick={() => { onReact(msg.id, e); setShowReactPicker(false); }}
                        className="w-7 h-7 flex items-center justify-center text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
                        {e}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => onReply(msg)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" title="Reply">
              <Reply className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => onPin(msg.id)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer" title="Pin">
              <Pin className="h-3.5 w-3.5" />
            </button>
            {msg.isMe && (
              <button onClick={() => onDelete(msg.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─────────────── Main Chat Component ─────────────── */
export const Chat: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>(CHANNELS);
  const [activeId, setActiveId] = useState('c1');
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [typing, setTyping] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [muted, setMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = channels.find(c => c.id === activeId)!;
  const messages = active.messages;

  const filteredChannels = useMemo(() =>
    channels.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMsg.toLowerCase().includes(search.toLowerCase())
    ), [channels, search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator when user types
  const handleTextChange = (val: string) => {
    setText(val);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), 2000);
  };

  // Simulate reply from other user after sending
  const simulateReply = (channelId: string) => {
    const replies: Record<string, string> = {
      c1: "Thanks! I'll check it out now 👀",
      c2: "Great update! See you at the sprint review 🎯",
      c3: "On it! Filing a bug report right now.",
      c4: "Perfect! Let me know when you're done reviewing 🙏",
      c5: "Love the feedback! Making changes now.",
    };
    const senders: Record<string, string> = {
      c1: 'Alice Johnson', c2: 'Bob Smith', c3: 'Charlie Brown', c4: 'Diana Prince', c5: 'Eve Adams',
    };
    const reply = replies[channelId] || 'Got it, thanks!';
    const sender = senders[channelId] || 'Team Member';

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setChannels(prev => prev.map(ch => {
        if (ch.id !== channelId) return ch;
        return {
          ...ch,
          lastMsg: `${sender.split(' ')[0]}: ${reply}`,
          time: 'just now',
          messages: [...ch.messages, {
            id: mkId(), sender, content: reply,
            time: now(), isMe: false,
            reactions: [],
          }],
        };
      }));
    }, 1500);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg: Message = {
      id: mkId(),
      sender: 'You',
      content: text.trim(),
      time: now(),
      isMe: true,
      status: 'sent',
      replyTo: replyTo ? `${replyTo.sender}: ${replyTo.content.slice(0, 40)}…` : undefined,
    };
    setChannels(prev => prev.map(ch => {
      if (ch.id !== activeId) return ch;
      return { ...ch, lastMsg: `You: ${text.trim()}`, time: 'just now', messages: [...ch.messages, msg] };
    }));
    setText('');
    setReplyTo(null);
    // Simulate delivered → read status
    setTimeout(() => {
      setChannels(prev => prev.map(ch => ({
        ...ch,
        messages: ch.messages.map(m => m.id === msg.id ? { ...m, status: 'delivered' as const } : m),
      })));
    }, 800);
    setTimeout(() => {
      setChannels(prev => prev.map(ch => ({
        ...ch,
        messages: ch.messages.map(m => m.id === msg.id ? { ...m, status: 'read' as const } : m),
      })));
    }, 1500);
    simulateReply(activeId);
  };

  const handleReact = (msgId: string, emoji: string) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id !== activeId) return ch;
      return {
        ...ch,
        messages: ch.messages.map(m => {
          if (m.id !== msgId) return m;
          const existing = (m.reactions || []).find(r => r.emoji === emoji);
          if (existing) {
            const hasMe = existing.users.includes('You');
            const newUsers = hasMe ? existing.users.filter(u => u !== 'You') : [...existing.users, 'You'];
            return {
              ...m,
              reactions: newUsers.length === 0
                ? (m.reactions || []).filter(r => r.emoji !== emoji)
                : (m.reactions || []).map(r => r.emoji === emoji ? { ...r, users: newUsers } : r),
            };
          }
          return { ...m, reactions: [...(m.reactions || []), { emoji, users: ['You'] }] };
        }),
      };
    }));
  };

  const handleDelete = (msgId: string) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id !== activeId) return ch;
      return { ...ch, messages: ch.messages.filter(m => m.id !== msgId) };
    }));
  };

  const handlePin = (msgId: string) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id !== activeId) return ch;
      return { ...ch, messages: ch.messages.map(m => m.id === msgId ? { ...m, pinned: !m.pinned } : m) };
    }));
  };

  const clearUnread = (id: string) => {
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, unread: 0 } : ch));
  };

  const switchChannel = (id: string) => {
    setActiveId(id);
    clearUnread(id);
    setMobileShowChat(true);
    setShowInfo(false);
    setReplyTo(null);
  };

  const addEmoji = (e: string) => {
    setText(t => t + e);
    inputRef.current?.focus();
  };

  const pinnedMessages = messages.filter(m => m.pinned);
  const totalUnread = channels.reduce((a, c) => a + c.unread, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Chat & Collaboration</h1>
          <p className="text-sm text-slate-500 mt-1">Team chat, project discussions, and direct messaging.</p>
        </div>
        {totalUnread > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{totalUnread} unread</span>
          </div>
        )}
      </div>

      {/* Chat Layout */}
      <div className="grid lg:grid-cols-12 gap-4" style={{ height: 'calc(100vh - 210px)' }}>

        {/* ── Sidebar ── */}
        <div className={`lg:col-span-4 xl:col-span-3 flex flex-col bg-white dark:bg-surface-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden ${mobileShowChat ? 'hidden lg:flex' : 'flex'}`}>
          {/* Sidebar header */}
          <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Messages</h3>
              <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition-colors cursor-pointer" title="New Message">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-950/40 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Channel list */}
          <div className="flex-1 overflow-y-auto">
            {filteredChannels.map(ch => (
              <motion.button
                key={ch.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => switchChannel(ch.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all text-left border-b border-slate-50 dark:border-slate-800/50 ${
                  ch.id === activeId
                    ? 'bg-primary-50 dark:bg-primary-950/20 border-l-2 border-l-primary-500'
                    : 'hover:bg-slate-50 dark:hover:bg-surface-800/50'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-xl ${TYPE_COLORS[ch.type] || 'bg-primary-500'} flex items-center justify-center text-white text-xs font-black`}>
                    {ch.type === 'direct'
                      ? ch.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                      : ch.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  {ch.type === 'direct' && ch.status === 'online' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-surface-900" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-bold truncate ${ch.id === activeId ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>
                        {ch.name}
                      </p>
                      {ch.muted && <BellOff className="h-3 w-3 text-slate-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-1">{ch.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{ch.lastMsg}</p>
                </div>
                {ch.unread > 0 && (
                  <span className="h-5 min-w-[20px] flex items-center justify-center bg-primary-500 text-white text-[10px] font-black rounded-full px-1.5 shrink-0">
                    {ch.unread}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Chat Area ── */}
        <div className={`lg:col-span-8 xl:col-span-9 flex flex-col bg-white dark:bg-surface-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden ${!mobileShowChat ? 'hidden lg:flex' : 'flex'}`}>

          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <button onClick={() => setMobileShowChat(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="relative shrink-0">
              <div className={`w-9 h-9 rounded-xl ${TYPE_COLORS[active.type]} flex items-center justify-center text-white text-xs font-black`}>
                {active.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              {active.type === 'direct' && active.status === 'online' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-surface-900" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{active.name}</h3>
              <p className="text-[10px] text-slate-400">
                {active.type === 'direct'
                  ? active.status === 'online' ? '🟢 Online now' : 'Offline'
                  : `${active.members} members · ${active.online} online`}
              </p>
            </div>
            {/* Header actions */}
            <div className="flex items-center gap-1">
              {active.type === 'direct' && (
                <>
                  <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition-colors cursor-pointer" title="Voice call">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition-colors cursor-pointer" title="Video call">
                    <Video className="h-4 w-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => setMuted(m => !m)}
                className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${muted ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}
                title={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              </button>
              {active.type !== 'direct' && (
                <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition-colors cursor-pointer" title="Add member">
                  <UserPlus className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setShowInfo(p => !p)}
                className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${showInfo ? 'text-primary-500 bg-primary-50 dark:bg-primary-950/20' : 'text-slate-400 hover:text-slate-600'}`}
                title="Channel info"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Pinned messages banner */}
          <AnimatePresence>
            {pinnedMessages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-5 py-2.5 bg-amber-500/8 border-b border-amber-500/15 flex items-center gap-2.5"
              >
                <Pin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold truncate">
                  📌 {pinnedMessages[pinnedMessages.length - 1].content.slice(0, 60)}…
                </p>
                <span className="text-[10px] text-amber-500 font-bold shrink-0">{pinnedMessages.length} pinned</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Date separator */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                <span className="text-[10px] text-slate-400 font-bold bg-white dark:bg-surface-900 px-2">Today</span>
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
              </div>

              {messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  onReact={handleReact}
                  onReply={setReplyTo}
                  onDelete={handleDelete}
                  onPin={handlePin}
                />
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                      {active.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="px-4 py-2.5 bg-white dark:bg-surface-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm flex items-center gap-1">
                      {[0, 0.2, 0.4].map((d, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-slate-400"
                          animate={{ y: [-2, 2, -2] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: d }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400">typing…</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Info panel */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-l border-slate-100 dark:border-slate-800 shrink-0"
                >
                  <div className="w-[220px] h-full overflow-y-auto p-4 space-y-5">
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-2xl ${TYPE_COLORS[active.type]} flex items-center justify-center text-white font-black text-lg mx-auto mb-2`}>
                        {active.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{active.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{active.type} channel</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Details</p>
                      {[
                        { label: 'Members', value: active.members },
                        { label: 'Online', value: active.online },
                        { label: 'Messages', value: messages.length },
                        { label: 'Pinned', value: pinnedMessages.length },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-xs">
                          <span className="text-slate-500">{label}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Shared Files</p>
                      {messages.filter(m => m.attachment).length === 0
                        ? <p className="text-[10px] text-slate-400">No files shared yet.</p>
                        : messages.filter(m => m.attachment).map(m => (
                          <div key={m.id} className="flex items-center gap-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                            <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">{m.attachment!.name}</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className="px-4 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
            {/* Reply banner */}
            <AnimatePresence>
              {replyTo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2.5 mb-2 px-3.5 py-2 bg-primary-500/6 border border-primary-500/15 rounded-xl"
                >
                  <Reply className="h-3.5 w-3.5 text-primary-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-primary-500">Replying to {replyTo.sender}</p>
                    <p className="text-[10px] text-slate-400 truncate">{replyTo.content.slice(0, 60)}…</p>
                  </div>
                  <button onClick={() => setReplyTo(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formatting toolbar */}
            <div className="flex items-center gap-0.5 mb-2">
              {[
                { icon: Bold, tip: 'Bold' }, { icon: Italic, tip: 'Italic' },
                { icon: Code, tip: 'Code' }, { icon: AtSign, tip: 'Mention' },
                { icon: Hash, tip: 'Channel' },
              ].map(({ icon: Icon, tip }) => (
                <button key={tip}
                  onClick={() => { if (tip === 'Mention') setText(t => t + '@'); if (tip === 'Channel') setText(t => t + '#'); }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={tip}>
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            {/* Message input row */}
            <div className="flex items-end gap-2 relative">
              <button
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition-colors cursor-pointer shrink-0"
                title="Attach file"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={text}
                  onChange={e => handleTextChange(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={`Message ${active.name}…`}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-950/40 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all pr-12"
                />
              </div>

              {/* Emoji */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowEmoji(p => !p)}
                  className={`p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${showEmoji ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}
                  title="Emoji"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <AnimatePresence>
                  {showEmoji && (
                    <EmojiPicker onPick={addEmoji} onClose={() => setShowEmoji(false)} />
                  )}
                </AnimatePresence>
              </div>

              {/* Send */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={sendMessage}
                disabled={!text.trim()}
                className={`p-3 rounded-2xl transition-all cursor-pointer shrink-0 ${
                  text.trim()
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                }`}
                title="Send (Enter)"
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>

            <p className="text-[10px] text-slate-400 mt-1.5 px-1">Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 text-[9px] font-mono">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 text-[9px] font-mono">Shift+Enter</kbd> for new line</p>
          </div>
        </div>

      </div>
    </div>
  );
};
