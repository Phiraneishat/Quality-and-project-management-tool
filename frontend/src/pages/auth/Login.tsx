import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Lock, LogIn, Eye, EyeOff, ArrowRight, Shield, Briefcase, Users, Code2, ClipboardList, UserCircle, Camera, Scan } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

const DEMO_ROLES = [
  { email: 'admin@qualitydesk.io',  role: 'Admin',           desc: 'Full system access',      gradient: 'from-primary-500 to-purple-600', icon: Shield },
  { email: 'pm@qualitydesk.io',     role: 'Project Manager', desc: 'Manage projects & teams', gradient: 'from-blue-500 to-cyan-500',       icon: Briefcase },
  { email: 'lead@qualitydesk.io',   role: 'Team Lead',       desc: 'Lead team activities',    gradient: 'from-violet-500 to-indigo-600',   icon: Users },
  { email: 'dev@qualitydesk.io',    role: 'Developer',       desc: 'Development tasks',       gradient: 'from-emerald-500 to-teal-500',    icon: Code2 },
  { email: 'qa@qualitydesk.io',     role: 'QA Tester',       desc: 'Testing & quality',       gradient: 'from-amber-500 to-orange-500',    icon: ClipboardList },
  { email: 'client@qualitydesk.io', role: 'Client',          desc: 'View-only access',        gradient: 'from-rose-500 to-pink-500',       icon: UserCircle },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore();
  const { login, register: apiRegister, clearError, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [quickLogging, setQuickLogging] = useState<string | null>(null);

  // Face scan simulator states
  const [scanningRole, setScanningRole] = useState<{ email: string; role: string } | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('Initializing Face ID...');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [simulateAuthorized, setSimulateAuthorized] = useState(true);
  const [scanStatus, setScanStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');
  const [needEnrollment, setNeedEnrollment] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Password reset state flow
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>(
    window.location.pathname.includes('forgot') ? 'forgot' : 'login'
  );
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      clearError();
      await login(data.email, data.password);
      toast.success('Welcome back! Redirecting to dashboard...');
      navigate('/app');
    } catch (e: any) {
      toast.error(e.message || 'Login failed. Please try again.');
    }
  };

  const quickLogin = async (email: string, role: string) => {
    setQuickLogging(email);
    try {
      // 1. Try to login with isFaceLogin enabled
      await login(email, 'password123', true);
      toast.success(`Signed in as ${role}!`);
      navigate('/app');
    } catch (loginErr) {
      // 2. Self-Healing Auth: Auto-register user on the fly if they don't exist in database yet
      console.log('User not found. Auto-registering demo role...', loginErr);
      
      const names: Record<string, string> = {
        'admin@qualitydesk.io': 'Phiraneish A T',
        'pm@qualitydesk.io': 'Sarah Chen',
        'lead@qualitydesk.io': 'Marcus Webb',
        'dev@qualitydesk.io': 'Raj Patel',
        'qa@qualitydesk.io': 'Priya Nair',
        'client@qualitydesk.io': 'James Carter',
        'guest@qualitydesk.io': 'Guest User',
      };
      const name = names[email] || email.split('@')[0];

      try {
        await apiRegister(name, email, 'password123', role as any);
        toast.success(`Demo account created! Signed in as ${role}`);
        navigate('/app');
      } catch (regErr) {
        toast.error('Quick login failed. Make sure your database is running.');
      }
    } finally {
      setQuickLogging(null);
    }
  };

  const enrollAndUnlock = async (email: string, role: string) => {
    setIsEnrolling(true);
    setScanProgress(0);
    setScanStatus('scanning');
    setScanStep('Calibrating camera sensor...');

    const steps = [
      { progress: 20, text: 'Mapping face landmarks & geometries...' },
      { progress: 40, text: 'Extracting digital face print hashes...' },
      { progress: 60, text: 'Writing biometric credentials to database...' },
      { progress: 85, text: 'Finalizing database security registration...' },
      { progress: 100, text: 'Profile Registered! Unlocking...' },
    ];

    let currentStepIdx = 0;
    const interval = setInterval(async () => {
      setScanProgress(prev => {
        const nextProgress = prev + 5;
        const currentStep = steps[currentStepIdx];

        if (currentStep && nextProgress >= currentStep.progress) {
          setScanStep(currentStep.text);
          currentStepIdx++;
        }

        if (nextProgress >= 100) {
          clearInterval(interval);
          
          let snapshot = '';
          if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = 160;
            canvas.height = 160;
            const ctx = canvas.getContext('2d');
            if (ctx && videoRef.current) {
              ctx.drawImage(videoRef.current, 0, 0, 160, 160);
              snapshot = canvas.toDataURL('image/png');
            }
          }
          if (!snapshot) {
            snapshot = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfmBwYEJy...';
          }

          fetch(`${API_BASE_URL}/api/auth/register-face`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, faceTemplate: snapshot }),
          }).then(res => {
            if (res.ok) {
              setScanStatus('success');
              setScanStep('Face ID enrolled & verified. Unlocking dashboard...');
              toast.success('Holographic Face ID profile registered successfully and database updated!');
              setTimeout(() => {
                if (cameraStream) {
                  cameraStream.getTracks().forEach(track => track.stop());
                }
                setCameraStream(null);
                setScanningRole(null);
                quickLogin(email, role);
              }, 1200);
            } else {
              setScanStatus('failed');
              setScanStep('Biometric registration failed. Please try again.');
            }
          }).catch(err => {
            console.error(err);
            setScanStatus('failed');
            setScanStep('Network error during database enrollment.');
          });

          return 100;
        }
        return nextProgress;
      });
    }, 100);
  };

  const startFaceScan = async (email: string, role: string) => {
    setScanningRole({ email, role });
    setScanProgress(0);
    setScanStatus('scanning');
    setScanStep('Connecting to secure auth directory...');
    setNeedEnrollment(false);
    setIsEnrolling(false);

    let hasStoredFace = true;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/get-face`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.hasFace) {
          hasStoredFace = false;
          setNeedEnrollment(true);
          setScanStep('No biometric face profile found. Please register to unlock.');
        }
      }
    } catch (dbErr) {
      console.error('Database Face ID registration verification failed:', dbErr);
    }

    setScanStep('Requesting webcam access...');
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.log('Webcam not available, running high-tech holographic mesh simulation.', err);
    }

    if (!hasStoredFace) {
      setScanProgress(0);
      setScanStep('Camera active. Align your face and click "Enroll & Unlock" below.');
      return;
    }

    const steps = [
      { progress: 15, text: 'Calibrating camera sensor...' },
      { progress: 35, text: 'Detecting facial outline landmarks...' },
      { progress: 55, text: 'Scanning facial structures & grids...' },
      { progress: 75, text: 'Comparing with stored database signature...' },
      { progress: 90, text: 'Validating role permissions...' },
      { progress: 100, text: 'Finalizing verification...' },
    ];

    let currentStepIdx = 0;
    const interval = setInterval(async () => {
      setScanProgress(prev => {
        const nextProgress = prev + 5;
        const currentStep = steps[currentStepIdx];

        if (currentStep && nextProgress >= currentStep.progress) {
          setScanStep(currentStep.text);
          currentStepIdx++;
        }

        if (nextProgress >= 100) {
          clearInterval(interval);
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          setCameraStream(null);

          // Perform verification check logic based on simulation toggle
          if (simulateAuthorized) {
            setScanStatus('success');
            setScanStep('Biometric Match: Access Granted!');
            toast.success(`Face Recognized! Signed in as ${role}`);
            setTimeout(() => {
              setScanningRole(null);
              quickLogin(email, role);
            }, 800);
          } else {
            setScanStatus('failed');
            setScanStep('ACCESS DENIED: Biometric Signature Mismatch (Intruder Alert!)');
            toast.error('Face match validation failed. Access Denied.');
          }
          return 100;
        }
        return nextProgress;
      });
    }, 120);
  };

  const cancelFaceScan = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setCameraStream(null);
    setScanningRole(null);
    setScanStatus('scanning');
  };

  // Forgot Password: Request OTP code
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (!res.ok) {
        throw new Error('Failed to send verification code. Please check your network connection.');
      }

      toast.success('Verification code sent to your email address!');
      setMode('reset');
    } catch (err: any) {
      toast.error(err.message || 'Error requesting password reset.');
    } finally {
      setResetLoading(false);
    }
  };

  // Reset Password: Submit OTP and new password
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      toast.error('Verification code is required');
      return;
    }
    if (resetNewPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp: otpCode, newPassword: resetNewPassword }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Invalid or expired verification code');
      }

      toast.success('Password reset successfully! Please sign in with your new password.');
      setMode('login');
      setResetEmail('');
      setOtpCode('');
      setResetNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: Form Side ── */}
      <div className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-6 group">
            <Logo size="lg" />
            <span className="font-display font-bold text-2xl text-gradient-hero">QualityDesk</span>
          </Link>

          {/* Heading */}
          {mode === 'login' && (
            <>
              <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Welcome back</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-6">
                Sign in to access your project dashboard and quality metrics.
              </p>
            </>
          )}
          {mode === 'forgot' && (
            <>
              <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Forgot Password</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-6">
                Enter your registered email address and we will send you a 6-digit verification code.
              </p>
            </>
          )}
          {mode === 'reset' && (
            <>
              <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Reset Password</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-6">
                We sent a 6-digit verification code to <span className="font-semibold text-slate-700 dark:text-slate-200">{resetEmail}</span>. Enter the code and your new password.
              </p>
            </>
          )}

          {/* ── Mode-based Render ── */}
          {mode === 'login' && (
            <>
              {/* ── Role Quick Login Cards ── */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Quick Login by Role</p>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ROLES.map(demo => {
                    const Icon = demo.icon;
                    const isLogging = quickLogging === demo.email;
                    return (
                      <motion.button
                        key={demo.email}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!!quickLogging}
                        onClick={() => startFaceScan(demo.email, demo.role)}
                        className={`relative flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer group overflow-hidden ${
                          isLogging
                            ? 'border-primary-500/40 bg-primary-500/5'
                            : 'border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-surface-900/60 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${demo.gradient} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-black text-slate-900 dark:text-white truncate">{demo.role}</p>
                          <p className="text-[9px] text-slate-400 truncate">{demo.desc}</p>
                        </div>
                        {isLogging ? (
                          <div className="w-3.5 h-3.5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin shrink-0" />
                        ) : (
                          <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2">Click any role to instantly login with that user</p>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs text-slate-400 font-medium">or sign in manually</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      {...register('email')}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline bg-transparent border-none cursor-pointer outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-red-500 font-medium">{errors.password.message}</p>}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Remember me for 30 days</span>
                </label>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
                    {error}
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}
                  leftIcon={<LogIn className="h-5 w-5" />} className="w-full mt-2">
                  Sign In to Dashboard
                </Button>
              </form>
            </>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleSendResetCode} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" isLoading={resetLoading} className="w-full mt-2">
                Send Reset Code
              </Button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-center font-bold text-primary-600 dark:text-primary-400 hover:underline bg-transparent border-none cursor-pointer mt-2"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleSaveNewPassword} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">6-Digit Verification Code</label>
                <input
                  type="text"
                  required
                  placeholder="123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white text-center font-mono tracking-widest outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" isLoading={resetLoading} className="w-full mt-2">
                Reset Password
              </Button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-center font-bold text-primary-600 dark:text-primary-400 hover:underline bg-transparent border-none cursor-pointer mt-2"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {mode === 'login' && (
            <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                Create one free
              </Link>
            </p>
          )}
        </motion.div>
      </div>

      {/* ── Right: Decorative Side ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-purple-600 to-violet-700 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-300/10 rounded-full blur-[100px]" />

        <div className="relative text-center px-12 max-w-lg">
          <Link to="/" className="inline-block hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
            <Logo size="xl" className="mx-auto mb-8" />
          </Link>
          <h2 className="text-3xl font-black font-display text-white">Ship quality software with confidence</h2>
          <p className="mt-4 text-base text-white/70 leading-relaxed">
            Track projects, manage sprints, squash bugs, and monitor quality metrics — all in one powerful platform.
          </p>

          {/* Role summary */}
          <div className="mt-8 space-y-2 text-left">
            {DEMO_ROLES.map(demo => {
              const Icon = demo.icon;
              return (
                <div key={demo.email} className="flex items-center gap-3 bg-white/8 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${demo.gradient} flex items-center justify-center shrink-0`}>
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white">{demo.role}</p>
                    <p className="text-[10px] text-white/55">{demo.desc}</p>
                  </div>
                  <div className="text-[9px] font-mono text-white/40 truncate max-w-[120px]">{demo.email}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* ── Face ID Scan Simulator Overlay ── */}
      <AnimatePresence>
        {scanningRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 text-center"
          >
            <style>{`
              @keyframes scan-vertical {
                0%, 100% { top: 0%; opacity: 0.3; }
                50% { top: 100%; opacity: 1; }
              }
            `}</style>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
            >
              {/* Scan beam */}
              {scanStatus === 'scanning' && (
                <div 
                  className="absolute left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-primary-500 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10" 
                  style={{
                    animation: 'scan-vertical 3s ease-in-out infinite',
                  }}
                />
              )}

              <div className="flex flex-col items-center">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 border transition-all ${
                  scanStatus === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : scanStatus === 'failed'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                }`}>
                  <Scan className="h-6 w-6 animate-pulse" />
                </div>
                
                <h3 className="text-lg font-bold text-white font-display mb-1">Holographic Face ID</h3>
                <p className="text-xs text-slate-400 mb-5 font-medium">Biometric authentication for role authorization</p>

                {/* Biometric Sim Profile Selectors */}
                {needEnrollment ? (
                  <div className="w-full bg-cyan-950/20 p-3 rounded-2xl border border-cyan-800/30 mb-5 text-left text-[11px] text-cyan-400 font-medium">
                    ⚡ <strong>Biometric Enrollment Mode</strong>: No Face ID found in the database. Position your face in the frame and click "Enroll & Unlock" below to save your biometric coordinates in MongoDB and log in.
                  </div>
                ) : (
                  <div className="w-full bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/80 mb-5 flex flex-col gap-1.5 text-left">
                    <span className="text-[9px] uppercase tracking-widest font-black text-slate-500 block mb-0.5">Biometric Scanner Mode</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        disabled={scanProgress > 0 && scanProgress < 100}
                        onClick={() => setSimulateAuthorized(true)}
                        className={`px-2 py-1.5 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer ${
                          simulateAuthorized
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        Authorize Match
                      </button>
                      <button
                        type="button"
                        disabled={scanProgress > 0 && scanProgress < 100}
                        onClick={() => setSimulateAuthorized(false)}
                        className={`px-2 py-1.5 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer ${
                          !simulateAuthorized
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        Simulate Intruder
                      </button>
                    </div>
                  </div>
                )}

                {/* Scan Frame */}
                <div className={`relative w-44 h-44 rounded-full border-2 flex items-center justify-center overflow-hidden bg-slate-950 mb-5 transition-all duration-300 ${
                  scanStatus === 'success'
                    ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : scanStatus === 'failed'
                    ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : 'border-dashed border-slate-700'
                }`}>
                  {/* Scanner overlay circle */}
                  {scanStatus === 'scanning' && (
                    <div className="absolute inset-0 border-2 border-primary-500/30 rounded-full animate-ping pointer-events-none" />
                  )}

                  {cameraStream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
                      <Camera className={`h-9 w-9 animate-pulse ${
                        scanStatus === 'success'
                          ? 'text-emerald-500'
                          : scanStatus === 'failed'
                          ? 'text-rose-500'
                          : 'text-slate-700'
                      }`} />
                      <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Camera Feed</span>
                    </div>
                  )}

                  {/* SVG overlay mesh mapping */}
                  <svg className={`absolute inset-0 w-full h-full pointer-events-none transition-colors duration-300 ${
                    scanStatus === 'success'
                      ? 'text-emerald-500/25'
                      : scanStatus === 'failed'
                      ? 'text-rose-500/25'
                      : 'text-primary-500/25'
                  }`} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,3" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,3" />
                    <path d="M30 40 Q50 30 70 40 Q50 65 30 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="42" cy="45" r="1.5" fill="currentColor" className="animate-pulse" />
                    <circle cx="58" cy="45" r="1.5" fill="currentColor" className="animate-pulse" />
                    <path d="M45 70 Q50 73 55 70" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>

                {/* Progress Stats */}
                <div className="w-full space-y-2 mb-5">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <span className={
                      scanStatus === 'success'
                        ? 'text-emerald-400 font-black'
                        : scanStatus === 'failed'
                        ? 'text-rose-400 font-black'
                        : 'text-slate-400'
                    }>{scanStep}</span>
                    <span className="text-primary-400 font-mono">{scanProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-100 ${
                        scanStatus === 'success'
                          ? 'bg-emerald-500'
                          : scanStatus === 'failed'
                          ? 'bg-rose-500'
                          : 'bg-gradient-to-r from-primary-500 to-purple-600'
                      }`}
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>

                {/* Target Role Tag */}
                <div className="px-4 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 uppercase mb-5">
                  <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                    scanStatus === 'success'
                      ? 'bg-emerald-500'
                      : scanStatus === 'failed'
                      ? 'bg-rose-500'
                      : 'bg-cyan-500'
                  }`} />
                  <span>Target Role: <strong className="text-white">{scanningRole.role}</strong></span>
                </div>

                <div className="flex gap-2 w-full">
                  {needEnrollment ? (
                    !isEnrolling && (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => enrollAndUnlock(scanningRole.email, scanningRole.role)}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                      >
                        Enroll & Unlock
                      </Button>
                    )
                  ) : (
                    scanStatus === 'failed' && (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => startFaceScan(scanningRole.email, scanningRole.role)}
                        className="flex-1 bg-rose-600 hover:bg-rose-500 text-white"
                      >
                        Try Again
                      </Button>
                    )
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isEnrolling && scanProgress < 100}
                    onClick={cancelFaceScan}
                    className="flex-1 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-white"
                  >
                    {scanStatus === 'failed' || needEnrollment ? 'Close' : 'Cancel'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
