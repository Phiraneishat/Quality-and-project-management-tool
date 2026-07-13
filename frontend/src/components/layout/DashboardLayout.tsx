import React, { useState } from 'react';
import { Link, NavLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, ListTodo, Zap, Bug,
  FlaskConical, TestTube, Users, Calendar, BarChart3,
  MessageSquare, Bell, Settings, LogOut,
  ChevronLeft, ChevronRight, ChevronDown, Sparkles, Search,
  Shield, Eye, Briefcase, Code2, ClipboardList,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../ui/Avatar';
import { ThemeSwitcher } from '../ui/Shared';
import { UserRole } from '../../types';
import { Logo } from '../ui/Logo';

/* ─── Role colour accents ─── */
const ROLE_COLORS: Record<string, { gradient: string; badge: string; label: string }> = {
  'Admin':           { gradient: 'from-primary-500 to-purple-600', badge: 'bg-primary-500/15 text-primary-400 border-primary-500/25', label: 'Full Access' },
  'Project Manager': { gradient: 'from-blue-500 to-cyan-500',      badge: 'bg-blue-500/15 text-blue-400 border-blue-500/25',         label: 'Projects & Teams' },
  'Team Lead':       { gradient: 'from-violet-500 to-indigo-600',  badge: 'bg-violet-500/15 text-violet-400 border-violet-500/25',   label: 'Team Activities' },
  'Developer':       { gradient: 'from-emerald-500 to-teal-500',   badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',label: 'Dev Tasks' },
  'QA Tester':       { gradient: 'from-amber-500 to-orange-500',   badge: 'bg-amber-500/15 text-amber-400 border-amber-500/25',      label: 'Testing & QA' },
  'Client':          { gradient: 'from-rose-500 to-pink-500',      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/25',         label: 'View Only' },
};

/* ─── All nav items with allowed roles ─── */
type NavSubItem = {
  label: string;
  path: string;
};

type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: UserRole[];       // which roles can see this item
  group?: string;
  children?: NavSubItem[];
};

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/app',             roles: ['Admin','Project Manager','Team Lead','Developer','QA Tester','Client'] },
  { 
    icon: Shield,         
    label: 'Admin',        
    path: '/app/admin',       
    roles: ['Admin'],
    children: [
      { label: 'Users', path: '/app/admin/users' }
    ]
  },
  { icon: FolderKanban,   label: 'Projects',    path: '/app/projects',    roles: ['Admin','Project Manager','Team Lead','Developer','Client'] },
  { icon: ListTodo,       label: 'Tasks',        path: '/app/tasks',       roles: ['Admin','Project Manager','Team Lead','Developer'] },
  { icon: Zap,            label: 'Sprints',      path: '/app/sprints',     roles: ['Admin','Project Manager','Team Lead','Developer'] },
  { icon: Bug,            label: 'Bugs',         path: '/app/bugs',        roles: ['Admin','Project Manager','Team Lead','Developer','QA Tester'] },
  { icon: FlaskConical,   label: 'Quality',      path: '/app/quality',     roles: ['Admin','Project Manager','QA Tester'] },
  { icon: TestTube,       label: 'Test Cases',   path: '/app/test-cases',  roles: ['Admin','QA Tester','Team Lead'] },
  { icon: Users,          label: 'Team',         path: '/app/team',        roles: ['Admin','Project Manager','Team Lead'] },
  { icon: Calendar,       label: 'Calendar',     path: '/app/calendar',    roles: ['Admin','Project Manager','Team Lead','Developer','QA Tester'] },
  { icon: BarChart3,      label: 'Reports',      path: '/app/reports',     roles: ['Admin','Project Manager','Client'] },
  { icon: MessageSquare,  label: 'Chat',         path: '/app/chat',        roles: ['Admin','Project Manager','Team Lead','Developer','QA Tester'] },
];

const BOTTOM_ITEMS: NavItem[] = [
  { icon: Bell,     label: 'Notifications', path: '/app/notifications', roles: ['Admin','Project Manager','Team Lead','Developer','QA Tester','Client'] },
  { icon: Settings, label: 'Settings',      path: '/app/settings',      roles: ['Admin','Project Manager','Team Lead','Developer','QA Tester','Client'] },
];

const ROLE_ICONS: Record<string, React.ElementType> = {
  'Admin':           Shield,
  'Project Manager': Briefcase,
  'Team Lead':       Users,
  'Developer':       Code2,
  'QA Tester':       ClipboardList,
  'Client':          Eye,
};

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ 'Admin': true });

  const role = (user?.role ?? 'Developer') as UserRole;
  const roleColor = ROLE_COLORS[role] ?? ROLE_COLORS['Developer'];
  const RoleIcon = ROLE_ICONS[role] ?? Code2;

  const handleLogout = () => { logout(); navigate('/login'); };

  const visibleNav    = NAV_ITEMS.filter(i => i.roles.includes(role));
  const visibleBottom = BOTTOM_ITEMS.filter(i => i.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-950 flex">
      {/* ── Sidebar ── */}
      <aside className={`fixed left-0 top-0 h-screen z-40 flex flex-col glass-sidebar transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>

        {/* Logo */}
        <Link to="/" className="h-16 flex items-center px-4 gap-2.5 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer">
          <Logo size="md" />
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-display font-bold text-lg text-slate-900 dark:text-white truncate">
              QualityDesk
            </motion.span>
          )}
        </Link>

        {/* Role badge */}
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mx-3 mt-3 mb-1 px-3 py-2 rounded-xl border flex items-center gap-2.5 shrink-0" style={{ borderColor: 'transparent' }}
            >
            <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-bold w-full ${roleColor.badge}`}>
              <RoleIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{role}</span>
              <span className="ml-auto text-[9px] opacity-60 font-medium truncate">{roleColor.label}</span>
            </div>
          </motion.div>
        )}

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-3">
          <div className="flex flex-col gap-1">
            {visibleNav.map((item) => {
              const Icon = item.icon;
              const hasChildren = !!item.children;
              const isMenuExpanded = expandedMenus[item.label] ?? false;

              if (hasChildren && item.children) {
                const isAnyChildActive = item.children.some(child => 
                  location.pathname === child.path || location.pathname.startsWith(child.path)
                );

                return (
                  <div key={item.label} className="flex flex-col gap-1">
                    <NavLink
                      to={collapsed ? item.path : '#'}
                      onClick={(e) => {
                        if (!collapsed) {
                          e.preventDefault();
                          setExpandedMenus(prev => ({ ...prev, [item.label]: !prev[item.label] }));
                        }
                      }}
                      className={`w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer ${
                        isAnyChildActive
                          ? 'bg-primary-50/40 text-primary-600 dark:text-primary-400'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {isAnyChildActive && !isMenuExpanded && (
                        <motion.div layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                      )}
                      <Icon className={`h-5 w-5 shrink-0 ${isAnyChildActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                      {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                      {!collapsed && (
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMenuExpanded ? 'rotate-180' : ''}`} />
                      )}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                          {item.label}
                        </div>
                      )}
                    </NavLink>

                    {/* Submenu Accordion */}
                    <AnimatePresence>
                      {isMenuExpanded && !collapsed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-9 flex flex-col gap-1 overflow-hidden"
                        >
                          {item.children.map((child) => {
                            const isChildActive = location.pathname === child.path || location.pathname.startsWith(child.path);
                            return (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                                  isChildActive
                                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50/30 dark:bg-primary-950/20'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                {isChildActive && (
                                  <motion.div layoutId="sidebar-active"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary-500 rounded-r-full"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                                )}
                                <span className="truncate">{child.label}</span>
                              </NavLink>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const isActive = location.pathname === item.path ||
                (item.path !== '/app' && location.pathname.startsWith(item.path));
              return (
                <NavLink key={item.path} to={item.path}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="px-3 pb-3 flex flex-col gap-1 border-t border-slate-200/60 dark:border-slate-800/60 pt-3 shrink-0">
          {visibleBottom.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}

          {/* User Info */}
          <div className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/40">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${roleColor.gradient} flex items-center justify-center text-white text-xs font-black shrink-0`}>
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.role}</p>
              </div>
            )}
            {!collapsed && (
              <button onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Collapse Toggle */}
          <button onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer mt-1">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        {/* Topbar */}
        <div className="sticky top-0 z-30 glass-nav h-14 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search anything... (⌘K)"
                className="pl-10 pr-4 py-2 w-72 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <NavLink to="/app/notifications"
              className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </NavLink>
            <NavLink to="/app/settings" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${roleColor.gradient} flex items-center justify-center text-white text-xs font-black`}>
                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'U'}
              </div>
            </NavLink>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* ── High-Tech Biometric Security Assistant Widget ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
        <AnimatePresence>
          {assistantOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="w-72 bg-slate-905/95 dark:bg-surface-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl text-left text-white overflow-hidden relative"
            >
              {/* Scan grid line animation */}
              <div className="absolute inset-0 grid-bg opacity-10" />
              
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-800">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full border border-cyan-500/50 flex items-center justify-center bg-slate-950/80">
                    <svg className="w-6 h-6 text-cyan-400 animate-pulse" viewBox="0 0 100 100" fill="none">
                      <path d="M50 15 C35 15, 25 25, 25 45 C25 60, 30 70, 35 80 C40 85, 45 90, 50 90 C55 90, 60 85, 65 80 C70 70, 75 60, 75 45 C75 25, 65 15, 50 15 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                      <circle cx="50" cy="40" r="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M35 70 Q50 60 65 70" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="35" cy="45" r="2" fill="#06b6d4" />
                      <circle cx="65" cy="45" r="2" fill="#06b6d4" />
                      <circle cx="50" cy="55" r="2" fill="#8b5cf6" />
                      <circle cx="50" cy="72" r="2" fill="#8b5cf6" />
                    </svg>
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border border-slate-900 flex items-center justify-center text-[7px] font-black text-white">✓</span>
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide font-display text-white">Biometric Shield Active</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Profile: {user?.name || 'Authorized User'}</span>
                </div>
              </div>

              <div className="space-y-2 text-[10px] font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Gate:</span>
                  <span className="font-bold text-cyan-400">Holographic Face ID</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Role:</span>
                  <span className="font-bold text-white uppercase">{user?.role || 'Guest'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Access Status:</span>
                  <span className="font-bold text-emerald-400">Authenticated (100% Match)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Audit Verification:</span>
                  <span className="font-bold text-slate-450">{user?.isFaceIdRegistered ? 'Stored DB Profile' : 'Pre-seeded Session'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAssistantOpen(!assistantOpen)}
          className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl relative group overflow-hidden border cursor-pointer ${
            assistantOpen
              ? 'bg-slate-900 border-slate-800'
              : `bg-gradient-to-tr ${roleColor.gradient} border-white/10`
          }`}
        >
          {/* Pulsing ring */}
          <span className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-75 pointer-events-none" />
          
          <div className="relative z-10">
            <svg className="w-7 h-7 text-white" viewBox="0 0 100 100" fill="none">
              <path d="M50 15 C35 15, 25 25, 25 45 C25 60, 30 70, 35 80 C40 85, 45 90, 50 90 C55 90, 60 85, 65 80 C70 70, 75 60, 75 45 C75 25, 65 15, 50 15 Z" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3,3" />
              <circle cx="50" cy="40" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M35 70 Q50 60 65 70" stroke="currentColor" strokeWidth="2" />
              <circle cx="35" cy="45" r="2" fill="currentColor" />
              <circle cx="65" cy="45" r="2" fill="currentColor" />
              <circle cx="50" cy="55" r="2" fill="currentColor" />
              <circle cx="50" cy="72" r="2" fill="currentColor" />
            </svg>
          </div>
        </motion.button>
      </div>
    </div>
  );
};
