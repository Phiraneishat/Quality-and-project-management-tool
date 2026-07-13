import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config/api';
import {
  Mail, Phone, MapPin, Send, AlertOctagon, CheckCircle2,
  Loader2, AlertCircle, ExternalLink, Settings, ShieldAlert,
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [inquiryType, setInquiryType] = useState<'support' | 'sales' | 'general'>('general');
  const [priority, setPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('low');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  type Status = 'idle' | 'sending' | 'success' | 'error';
  const [status, setStatus] = useState<Status>('idle');
  const [infoMsg, setInfoMsg] = useState('');
  const [sandboxUrl, setSandboxUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('sending');
    setInfoMsg('');
    setSandboxUrl(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject: subject || `[${inquiryType}] Contact Request`,
          inquiryType: inquiryType === 'general' ? 'General Info' : inquiryType === 'sales' ? 'Enterprise / Sales' : 'Technical QA Support',
          priority: inquiryType === 'support' ? priority.toUpperCase() : 'N/A',
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server returned status ${response.status}`);
      }

      const result = await response.json();
      
      setStatus('success');
      if (result.sandboxUrl) {
        setSandboxUrl(result.sandboxUrl);
        setInfoMsg('Ticket logged successfully! Launching Gmail compose screen to send your message:');
      } else {
        setInfoMsg('Ticket logged successfully! Launching Gmail compose screen to send your message:');
      }

      // Build Gmail direct compose link
      const mailtoSubject = encodeURIComponent(subject || `[${inquiryType.toUpperCase()}] Contact Inquiry`);
      const mailtoBody = encodeURIComponent(
        `Hello QualityDesk Support,\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Inquiry Type: ${inquiryType === 'general' ? 'General Info' : inquiryType === 'sales' ? 'Enterprise / Sales' : 'Technical QA Support'}\n` +
        `Priority: ${inquiryType === 'support' ? priority.toUpperCase() : 'N/A'}\n\n` +
        `Message:\n${message}`
      );
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=support@qualitydesk.io&su=${mailtoSubject}&body=${mailtoBody}`;
      window.open(gmailUrl, '_blank');

      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 15000); // Keep open longer so they can click the sandbox link
    } catch (err: any) {
      setStatus('error');
      setInfoMsg(err.message || 'Could not send request. Please try again later.');
    }
  };

  const getSubmitBtnStyles = () => {
    if (status === 'sending') return 'bg-slate-500 cursor-not-allowed';
    if (inquiryType !== 'support') return 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-primary-500/25';
    switch (priority) {
      case 'critical': return 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/35 ring-4 ring-red-500/20';
      case 'high':     return 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-500/25';
      case 'medium':   return 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-amber-500/20';
      default:         return 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-primary-500/25';
    }
  };

  return (
    <div className="min-h-screen pt-16 grid-bg mesh-gradient">

      {/* ── Hero ── */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] animate-orb-1" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-orb-2" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-wider mb-6 border border-primary-500/20"
          >
            <Mail className="h-3.5 w-3.5" /> Support Center
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white leading-tight tracking-tight">
            How Can We Help <span className="text-gradient-primary">Your Team?</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-650 dark:text-slate-405 max-w-2xl mx-auto leading-relaxed">
            Have questions about integrations? Need custom contracts? Or did something break? Fill out the request below — our team will get back to you shortly.
          </p>
        </div>
      </section>

      {/* ── Main Layout ── */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">

          {/* ── Left: Form Card ── */}
          <div className="w-full lg:w-2/3 bg-white/80 dark:bg-surface-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-xl flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-6 flex-1">

              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                  <input
                    type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                <input
                  type="text" value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="Brief description of your request"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              {/* Inquiry Type */}
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Nature of Inquiry</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'general', label: 'General Info' },
                    { id: 'sales',   label: 'Enterprise / Sales' },
                    { id: 'support', label: 'Technical QA Support' },
                  ].map(t => (
                    <button key={t.id} type="button" onClick={() => setInquiryType(t.id as any)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border cursor-pointer text-center transition-all duration-200 ${
                        inquiryType === t.id
                          ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/10'
                          : 'bg-white dark:bg-surface-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-surface-800'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Priority (Technical Support only) */}
              <AnimatePresence>
                {inquiryType === 'support' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
                    className="overflow-hidden space-y-3"
                  >
                    <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-start gap-3">
                      <AlertOctagon className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Priority Ticket Tagging</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                          Selecting Critical instantly alerts our pager network. Reserve for production outages only.
                        </p>
                      </div>
                    </div>
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Severity Level</label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {[
                        { id: 'low',      label: 'General / Low' },
                        { id: 'medium',   label: 'Medium' },
                        { id: 'high',     label: 'High Priority' },
                        { id: 'critical', label: 'Critical Outage' },
                      ].map(p => (
                        <button key={p.id} type="button" onClick={() => setPriority(p.id as any)}
                          className={`py-2 px-1 rounded-lg text-[10px] font-black uppercase border cursor-pointer text-center transition-all ${
                            priority === p.id
                              ? p.id === 'critical' ? 'bg-red-500 text-white border-red-500 shadow-md'
                              : p.id === 'high'     ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                              : p.id === 'medium'   ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                              :                       'bg-slate-500 text-white border-slate-500 shadow-md'
                              : 'bg-white dark:bg-surface-950 text-slate-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message */}
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Detailed Message / Notes</label>
                <textarea
                  required rows={5} value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your request in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-950 text-sm text-slate-850 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                />
              </div>

              {/* Submit + Feedback */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`inline-flex items-center justify-center gap-2 py-4 px-8 rounded-xl text-sm font-bold text-white transition-all duration-200 cursor-pointer shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${getSubmitBtnStyles()}`}
                >
                  {status === 'sending' ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Delivering to Gmail...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Send to Gmail</>
                  )}
                </button>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                      className="flex flex-col gap-2 p-4 border rounded-xl text-xs font-bold bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 max-w-lg"
                    >
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-black">Request Processed Successfully!</p>
                          <p className="font-normal opacity-90 mt-0.5">{infoMsg}</p>
                        </div>
                      </div>
                      
                      {sandboxUrl && (
                        <div className="mt-2 pl-7">
                          <a 
                            href={sandboxUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow shadow-emerald-600/20 cursor-pointer text-xs font-black"
                          >
                            Open Live Test Inbox <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      )}
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                      className="flex items-start gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-650 dark:text-red-400 max-w-md"
                    >
                      <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                      <p className="font-normal">{infoMsg}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

          {/* ── Right: Info Cards ── */}
          <div className="w-full lg:w-1/3 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {[
                { icon: Mail,  label: 'Email Outreach',    value: 'support@qualitydesk.io', desc: 'Reach our developers directly. Expected reply <12h.' },
                { icon: Phone, label: 'Call Sales',         value: '+1 (800) 555-0199',      desc: 'Discuss custom pricing, compliance audits, or volume discounts.' },
                { icon: MapPin,label: 'San Francisco HQ',   value: '100 Pine St, Suite 1250', desc: 'San Francisco, CA 94111, United States.' },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="p-5 bg-white/70 dark:bg-surface-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-500/10 rounded-xl text-primary-500"><Icon className="h-4.5 w-4.5" /></div>
                      <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{card.label}</h3>
                    </div>
                    <p className="text-sm font-bold text-slate-850 dark:text-white mt-3 select-all">{card.value}</p>
                    <p className="text-[11px] text-slate-500 leading-normal mt-1">{card.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Map mockup with premium animated radar scanner & coordinates */}
            <div className="h-44 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden relative flex items-center justify-center shadow-md group">
              {/* Radar Grid Map background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="radar-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6366f1" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#radar-grid)" />
                  {/* Concentric Radar Rings */}
                  <circle cx="50%" cy="50%" r="30" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3" />
                  <circle cx="50%" cy="50%" r="60" fill="none" stroke="#6366f1" strokeWidth="1" />
                  <circle cx="50%" cy="50%" r="90" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="5,5" />
                </svg>
              </div>

              {/* Radar Sweep Effect */}
              <div className="absolute inset-0 pointer-events-none origin-center animate-spin" style={{ animationDuration: '6s', background: 'conic-gradient(from 0deg at 50% 50%, rgba(99, 102, 241, 0.15) 0deg, rgba(99, 102, 241, 0) 90deg)' }} />

              {/* Animating Wave Ring */}
              <div className="absolute w-12 h-12 rounded-full border border-primary-500/40 bg-primary-500/5 flex items-center justify-center animate-ping" style={{ animationDuration: '3s' }} />

              {/* Pin Locator */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-primary-500 shadow-[0_0_12px_#6366f1] border-2 border-white flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                </div>
                {/* Floating label */}
                <div className="absolute -top-7 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-primary-500/30 text-[9px] font-black text-primary-400 font-mono tracking-wider shadow-lg backdrop-blur-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  SF HQ: 37.7913° N
                </div>
              </div>

              {/* Top info overlay */}
              <div className="absolute top-3 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
                <span className="text-[8px] font-black text-primary-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SYSTEM ACTIVE
                </span>
                <span className="text-[8px] font-black text-slate-500 font-mono tracking-widest">
                  COORDS LOCKED
                </span>
              </div>

              {/* Dynamic Coordinate readout at bottom */}
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center z-10 pointer-events-none font-mono">
                <span className="text-[9px] font-black text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  HQ Locator Active
                </span>
                <div className="text-[8px] font-black text-primary-500 flex flex-col items-end">
                  <span>37.7913° N</span>
                  <span>122.4015° W</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
