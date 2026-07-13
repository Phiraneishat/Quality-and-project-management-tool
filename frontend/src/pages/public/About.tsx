import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Flag, Users, HelpCircle, Heart } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  dept: 'engineering' | 'design' | 'product';
  imgText: string;
  bio: string;
}

const team: TeamMember[] = [
  { name: 'Alex Thompson', role: 'VP Engineering & Co-Founder', dept: 'engineering', imgText: 'AT', bio: 'Former Lead QA Architect at Stripe. Loves building developer tools that work.' },
  { name: 'Priya Sharma', role: 'QA Automation Lead', dept: 'engineering', imgText: 'PS', bio: 'Expert in Selenium and End-to-End frameworks. Speeds up delivery timelines.' },
  { name: 'Marcus Johnson', role: 'CTO & Co-Founder', dept: 'engineering', imgText: 'MJ', bio: 'Distributed systems veteran. Dedicated to zero-downtime platform scaling.' },
  { name: 'Sarah Jenkins', role: 'Lead UI/UX Designer', dept: 'design', imgText: 'SJ', bio: 'Obsessed with clean spaces and interactive animation transitions.' },
  { name: 'David Kim', role: 'Head of Product', dept: 'product', imgText: 'DK', bio: 'Translates technical quality measurements into actionable business workflows.' },
];

const milestones = [
  { year: '2024', title: 'Company Inception', desc: 'QualityDesk was born in San Francisco with a core team of three QA engineers aiming to build a developer-first tool.' },
  { year: '2025', title: '$3M Seed Funding', desc: 'Secured seed investment to expand our metrics engine and integrations workspace layer.' },
  { year: '2026', title: 'Quality Score Launch', desc: 'Released our proprietary index combining coverage, density, and sprint speeds into a single score.' },
];

export const About: React.FC = () => {
  const [activeDept, setActiveDept] = useState<'all' | 'engineering' | 'design' | 'product'>('all');

  const filteredTeam = activeDept === 'all' ? team : team.filter((t) => t.dept === activeDept);

  return (
    <div className="min-h-screen pt-16 grid-bg mesh-gradient">
      {/* ── Story Section ── */}
      <section className="py-20 relative overflow-hidden text-center">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] animate-orb-1" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-orb-2" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-wider mb-6 border border-primary-500/20"
          >
            <Heart className="h-3.5 w-3.5" /> Our Mission
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 dark:text-white leading-tight tracking-tight">
            Putting Quality at the <span className="text-gradient-primary">Heart of Software</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-650 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We believe shipping fast shouldn't mean shipping bugs. QualityDesk was created to combine task management with robust engineering metrics, enabling teams to build reliable software seamlessly.
          </p>
        </div>
      </section>

      {/* ── Interactive Vertical Timeline ── */}
      <section className="py-16 bg-white/40 dark:bg-surface-900/40 border-y border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white text-center mb-16">
            Our Journey So Far
          </h2>
          
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-32 space-y-12 pb-8">
            {milestones.map((ms, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative pl-8 sm:pl-12 group"
              >
                {/* Year Indicator on the Left (hidden on mobile, visible on desktop) */}
                <div className="absolute right-full mr-8 sm:mr-12 top-0.5 text-right hidden sm:block">
                  <span className="text-xl font-black font-display text-primary-500 group-hover:text-primary-600 transition-colors">
                    {ms.year}
                  </span>
                </div>

                {/* Timeline Circle Node */}
                <div className="absolute -left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-surface-900 border-2 border-primary-500 group-hover:bg-primary-500 transition-all shadow-md" />

                {/* Milestone Detail Card */}
                <div className="p-6 bg-white dark:bg-surface-900 border border-slate-200/70 dark:border-slate-850 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-black text-primary-500 sm:hidden block mb-1">{ms.year}</span>
                  <h3 className="text-base sm:text-lg font-bold font-display text-slate-850 dark:text-white">
                    {ms.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {ms.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Directory ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">The Team Behind the Tool</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
            Meet Our <span className="text-gradient-primary">Engineering Leaders</span>
          </h2>
          
          {/* Department Filter Selector */}
          <div className="mt-8 flex justify-center gap-2">
            {[
              { id: 'all', label: 'All Staff' },
              { id: 'engineering', label: 'Engineering' },
              { id: 'design', label: 'Design' },
              { id: 'product', label: 'Product' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDept(d.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  activeDept === d.id
                    ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/10'
                    : 'bg-white dark:bg-surface-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeam.map((member, i) => (
            <motion.div
              key={member.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="p-6 bg-white dark:bg-surface-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow">
                  {member.imgText}
                </div>
                <div>
                  <h3 className="font-bold text-slate-850 dark:text-white font-display leading-tight">{member.name}</h3>
                  <p className="text-xs text-primary-500 mt-0.5">{member.role}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-450 mt-4 leading-relaxed italic">
                "{member.bio}"
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
