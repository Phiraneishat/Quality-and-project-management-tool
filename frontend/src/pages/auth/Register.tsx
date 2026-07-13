import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Sparkles, User, Mail, Lock, Eye, EyeOff, UserPlus, Shield } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  role: z.string().min(1, 'Please select a role'),
  terms: z.boolean().refine((val) => val === true, { message: 'You must accept the terms' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'Admin', label: 'Admin', desc: 'Full system configuration and control access' },
  { value: 'Project Manager', label: 'Project Manager', desc: 'Manage projects & teams' },
  { value: 'Team Lead', label: 'Team Lead', desc: 'Lead team activities' },
  { value: 'Developer', label: 'Developer', desc: 'Development tasks' },
  { value: 'QA Tester', label: 'QA Tester', desc: 'Testing & quality' },
  { value: 'Client', label: 'Client', desc: 'View-only access' },
];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore();
  const { register: registerUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'Developer' },
  });

  const password = watch('password', '');
  const getStrength = (pw: string): { level: number; label: string; color: string } => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score <= 3) return { level: 3, label: 'Good', color: 'bg-blue-500' };
    return { level: 4, label: 'Strong', color: 'bg-emerald-500' };
  };
  const strength = getStrength(password);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.name, data.email, data.password, data.role as UserRole);
      toast.success('Account created successfully! Welcome to QualityDesk.');
      navigate('/app');
    } catch (e: any) {
      toast.error(e.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Decorative */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-600 via-purple-600 to-violet-700 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />

        <div className="relative text-center px-12 max-w-lg">
          <div className="h-20 w-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-black font-display text-white">
            Join 10,000+ quality-driven teams
          </h2>
          <p className="mt-4 text-base text-white/70">
            Start managing projects, tracking bugs, and measuring quality — all for free.
          </p>

          <div className="mt-10 space-y-3">
            {['14-day free trial', 'No credit card required', 'Cancel anytime', 'All features included'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
                <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Link to="/" className="flex items-center gap-2.5 mb-6 group">
            <Logo size="lg" />
            <span className="font-display font-bold text-2xl text-gradient-hero">QualityDesk</span>
          </Link>

          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Get started with your free QualityDesk workspace.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                />
              </div>
              {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
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
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  {...register('password')}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {password && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.level ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{strength.label}</span>
                </div>
              )}
              {errors.password && <p className="text-[11px] text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  {...register('confirmPassword')}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-surface-900/50 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-red-500 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Your Role</label>
              <select
                {...register('role')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-900 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 appearance-none"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
                ))}
              </select>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" {...register('terms')} className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <p className="text-[11px] text-red-500 font-medium">{errors.terms.message}</p>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<UserPlus className="h-5 w-5" />}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="text-sm text-center text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
