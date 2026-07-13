import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import Lenis from 'lenis';
import { Sparkles } from 'lucide-react';

// Layout Components
import { PublicNavbar } from './components/layout/PublicNavbar';
import { Footer } from './components/layout/Footer';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ToastContainer } from './components/ui/Toast';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';

// Lazy-loaded Pages — Public
const Landing = lazy(() => import('./pages/public/Landing').then(m => ({ default: m.Landing })));
const Features = lazy(() => import('./pages/public/Features').then(m => ({ default: m.Features })));
const Pricing = lazy(() => import('./pages/public/Pricing').then(m => ({ default: m.Pricing })));
const About = lazy(() => import('./pages/public/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/public/Contact').then(m => ({ default: m.Contact })));
const BugTracking = lazy(() => import('./pages/public/BugTracking').then(m => ({ default: m.BugTracking })));
const QualityMetrics = lazy(() => import('./pages/public/QualityMetrics').then(m => ({ default: m.QualityMetrics })));
const TeamManagement = lazy(() => import('./pages/public/TeamManagement').then(m => ({ default: m.TeamManagement })));
const PublicReports = lazy(() => import('./pages/public/Reports').then(m => ({ default: m.Reports })));

// Lazy-loaded Pages — Auth
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));

// Lazy-loaded Pages — Dashboard
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const Projects = lazy(() => import('./pages/dashboard/Projects').then(m => ({ default: m.Projects })));
const CreateProject = lazy(() => import('./pages/dashboard/CreateProject').then(m => ({ default: m.CreateProject })));
const Tasks = lazy(() => import('./pages/dashboard/Tasks').then(m => ({ default: m.Tasks })));
const Sprints = lazy(() => import('./pages/dashboard/Sprints').then(m => ({ default: m.Sprints })));
const Bugs = lazy(() => import('./pages/dashboard/Bugs').then(m => ({ default: m.Bugs })));
const Quality = lazy(() => import('./pages/dashboard/Quality').then(m => ({ default: m.Quality })));
const TestCases = lazy(() => import('./pages/dashboard/TestCases').then(m => ({ default: m.TestCases })));
const Team = lazy(() => import('./pages/dashboard/Team').then(m => ({ default: m.Team })));
const CalendarPage = lazy(() => import('./pages/dashboard/Calendar').then(m => ({ default: m.CalendarPage })));
const Reports = lazy(() => import('./pages/dashboard/Reports').then(m => ({ default: m.Reports })));
const Chat = lazy(() => import('./pages/dashboard/Chat').then(m => ({ default: m.Chat })));
const Notifications = lazy(() => import('./pages/dashboard/Notifications').then(m => ({ default: m.Notifications })));
const Settings = lazy(() => import('./pages/dashboard/Settings').then(m => ({ default: m.Settings })));
const AdminHub = lazy(() => import('./pages/dashboard/admin/AdminHub').then(m => ({ default: m.AdminHub })));
const UserList = lazy(() => import('./pages/dashboard/admin/UserList').then(m => ({ default: m.UserList })));
const CreateUser = lazy(() => import('./pages/dashboard/admin/CreateUser').then(m => ({ default: m.CreateUser })));

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Smooth Scroll Provider (Lenis)
const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
};

// Loading Spinner
const PageLoader: React.FC = () => (
  <div className="h-[75vh] w-full flex items-center justify-center flex-col gap-4">
    <div className="relative flex items-center justify-center">
      <div className="h-16 w-16 rounded-full border-4 border-primary-100 dark:border-primary-900 border-t-primary-500 animate-spin" />
      <Sparkles className="h-6 w-6 text-primary-500 absolute animate-pulse" />
    </div>
    <p className="text-sm font-semibold text-slate-500 tracking-wide font-display">Loading module...</p>
  </div>
);

// Public Layout (Navbar + Footer)
const PublicLayout: React.FC = () => (
  <SmoothScrollProvider>
    <div className="min-h-screen flex flex-col bg-slate-50/30 dark:bg-surface-950/60 transition-colors duration-300 relative">
      {/* Background patterns */}
      <div className="absolute inset-0 grid-bg pointer-events-none -z-10" />
      <div className="absolute inset-0 mesh-gradient pointer-events-none -z-10" />

      <PublicNavbar />
      <main className="flex-1 relative">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  </SmoothScrollProvider>
);

// Auth Layout (with persistent navbar)
const AuthLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-slate-50/30 dark:bg-surface-950/60 relative">
    <div className="absolute inset-0 grid-bg pointer-events-none -z-10" />
    <div className="absolute inset-0 mesh-gradient pointer-events-none -z-10" />
    <PublicNavbar />
    <main className="flex-1 relative">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
  </div>
);

// Protected Route Guard
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <DashboardLayout />
    </Suspense>
  );
};

// Route-level Role Guard
const RoleRouteGuard: React.FC<{ allowedRoles: string[]; children: React.ReactNode }> = ({ allowedRoles, children }) => {
  const { user } = useAuthStore();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }
  return <>{children}</>;
};

// Theme initializer
const ThemeInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useThemeStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  return <>{children}</>;
};

function App() {
  return (
    <ThemeInit>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/bug-tracking" element={<BugTracking />} />
            <Route path="/product/quality-metrics" element={<QualityMetrics />} />
            <Route path="/product/team-management" element={<TeamManagement />} />
            <Route path="/product/reports" element={<PublicReports />} />
            <Route path="/privacy" element={<Landing />} />
            <Route path="/terms" element={<Landing />} />
          </Route>

          {/* Auth Pages (no navbar/footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<Login />} />
          </Route>

          {/* Dashboard (Protected) */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            
            {/* Admin Routes */}
            <Route path="admin" element={
              <RoleRouteGuard allowedRoles={['Admin']}>
                <AdminHub />
              </RoleRouteGuard>
            } />
            <Route path="admin/users" element={
              <RoleRouteGuard allowedRoles={['Admin']}>
                <UserList />
              </RoleRouteGuard>
            } />
            <Route path="admin/users/create" element={
              <RoleRouteGuard allowedRoles={['Admin']}>
                <CreateUser />
              </RoleRouteGuard>
            } />

            <Route path="projects" element={
              <RoleRouteGuard allowedRoles={['Admin','Project Manager','Team Lead','Developer','Client']}>
                <Projects />
              </RoleRouteGuard>
            } />
            <Route path="projects/new" element={
              <RoleRouteGuard allowedRoles={['Admin','Project Manager']}>
                <CreateProject />
              </RoleRouteGuard>
            } />
            <Route path="tasks" element={
              <RoleRouteGuard allowedRoles={['Admin','Project Manager','Team Lead','Developer']}>
                <Tasks />
              </RoleRouteGuard>
            } />
            <Route path="sprints" element={
              <RoleRouteGuard allowedRoles={['Admin','Project Manager','Team Lead','Developer']}>
                <Sprints />
              </RoleRouteGuard>
            } />
            <Route path="bugs" element={
              <RoleRouteGuard allowedRoles={['Admin','Project Manager','Team Lead','Developer','QA Tester']}>
                <Bugs />
              </RoleRouteGuard>
            } />
            <Route path="quality" element={
              <RoleRouteGuard allowedRoles={['Admin','Project Manager','QA Tester']}>
                <Quality />
              </RoleRouteGuard>
            } />
            <Route path="test-cases" element={
              <RoleRouteGuard allowedRoles={['Admin','QA Tester','Team Lead']}>
                <TestCases />
              </RoleRouteGuard>
            } />
            <Route path="team" element={
              <RoleRouteGuard allowedRoles={['Admin','Project Manager','Team Lead']}>
                <Team />
              </RoleRouteGuard>
            } />
            <Route path="calendar" element={
              <RoleRouteGuard allowedRoles={['Admin','Project Manager','Team Lead','Developer','QA Tester']}>
                <CalendarPage />
              </RoleRouteGuard>
            } />
            <Route path="reports" element={
              <RoleRouteGuard allowedRoles={['Admin','Project Manager','Client']}>
                <Reports />
              </RoleRouteGuard>
            } />
            <Route path="chat" element={
              <RoleRouteGuard allowedRoles={['Admin','Project Manager','Team Lead','Developer','QA Tester']}>
                <Chat />
              </RoleRouteGuard>
            } />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ThemeInit>
  );
}

export default App;
