import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { 
  Menu, X, ChevronDown, Sparkles, ArrowRight,
  LayoutDashboard, Bug, FlaskConical, Users, BarChart3
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeSwitcher } from '../ui/Shared';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Product',
    children: [
      { label: 'Features', href: '/features', icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Bug Tracking', href: '/product/bug-tracking', icon: <Bug className="h-4 w-4" /> },
      { label: 'Quality Metrics', href: '/product/quality-metrics', icon: <FlaskConical className="h-4 w-4" /> },
      { label: 'Team Management', href: '/product/team-management', icon: <Users className="h-4 w-4" /> },
      { label: 'Reports', href: '/product/reports', icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const PublicNavbar: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${isScrolled
          ? 'glass-nav shadow-lg shadow-black/[0.03]'
          : 'bg-transparent'
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Logo size="md" />
          <span className="font-display font-bold text-xl text-gradient-hero">
            QualityDesk
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`
                    px-3.5 py-2 rounded-lg text-sm font-medium cursor-pointer
                    flex items-center gap-1 transition-colors
                    text-slate-600 dark:text-slate-300
                    hover:text-slate-900 dark:hover:text-white
                    hover:bg-slate-100/60 dark:hover:bg-slate-800/60
                  `}
                >
                  {link.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-64 p-2 bg-white dark:bg-surface-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <span className="text-primary-500">{child.icon}</span>
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`
                  relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
                  ${location.pathname === link.href
                    ? 'text-primary-600 dark:text-primary-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary-50 dark:bg-primary-950/40 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeSwitcher />
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-surface-900 border-t border-slate-200/60 dark:border-slate-800/60 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="flex flex-col">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      {link.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === link.label && (
                      <div className="ml-4 flex flex-col gap-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600"
                          >
                            {child.icon}
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link to="/login"><Button variant="outline" className="w-full">Sign In</Button></Link>
                <Link to="/register"><Button variant="primary" className="w-full">Get Started Free</Button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Animated glowing border */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary-500/20 via-purple-500/40 to-cyan-500/20" 
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient-move 6s ease infinite',
        }}
      />
      <style>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </header>
  );
};
