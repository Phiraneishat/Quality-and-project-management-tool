import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Mail, ArrowUpRight } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Logo } from '../ui/Logo';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Integrations', href: '/features' },
    { label: 'Changelog', href: '/about' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/about' },
    { label: 'Blog', href: '/about' },
  ],
  Resources: [
    { label: 'Documentation', href: '/features' },
    { label: 'Help Center', href: '/contact' },
    { label: 'Community', href: '/about' },
    { label: 'API Reference', href: '/features' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/privacy' },
    { label: 'Security', href: '/about' },
  ],
};

export const Footer: React.FC = () => {
  const location = useLocation();
  const hideCtaPaths = ['/', '/features'];
  const shouldShowCta = !hideCtaPaths.includes(location.pathname);

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-surface-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Banner (only shown on pages that do not have their own call-to-action sections) */}
        {shouldShowCta && (
          <div className="py-12">
            <div className="relative rounded-3xl bg-gradient-to-r from-primary-600 via-purple-600 to-violet-600 p-8 md:p-12 overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white font-display">
                    Ready to deliver quality software?
                  </h3>
                  <p className="mt-2 text-sm text-white/70 max-w-lg">
                    Join 10,000+ teams who trust QualityDesk for project management, bug tracking, and quality assurance.
                  </p>
                </div>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 shrink-0"
                >
                  Start Free Trial
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10 border-t border-slate-200/60 dark:border-slate-800/60">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Logo size="sm" />
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
                QualityDesk
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Enterprise-grade quality & project management for modern teams.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: FaGithub, href: 'https://github.com' },
                { Icon: FaTwitter, href: 'https://twitter.com' },
                { Icon: FaLinkedin, href: 'https://linkedin.com' },
                { Icon: Mail, href: 'mailto:support@qualitydesk.io' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} QualityDesk. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Built with ❤️ for quality-driven teams
          </p>
        </div>
      </div>
    </footer>
  );
};
