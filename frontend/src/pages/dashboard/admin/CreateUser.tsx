import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, ArrowLeft, User as UserIcon, Mail, Lock, Shield, 
  Building2, Phone, Eye, EyeOff
} from 'lucide-react';
import { useUserStore } from '../../../store/userStore';
import { useToastStore } from '../../../store/toastStore';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { UserRole } from '../../../types';

export const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore();
  const { createUser } = useUserStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Developer');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rolesList: { value: UserRole; label: string; desc: string }[] = [
    { value: 'Admin', label: 'Admin', desc: 'Full system configuration and control access' },
    { value: 'Project Manager', label: 'Project Manager', desc: 'Manage projects, roadmaps, and sprint cycles' },
    { value: 'Team Lead', label: 'Team Lead', desc: 'Supervise team activity, review deliverables' },
    { value: 'Developer', label: 'Developer', desc: 'Write code, resolve tasks, and participate in code reviews' },
    { value: 'QA Tester', label: 'QA Tester', desc: 'Write test cases, run test runs, log bugs' },
    { value: 'Client', label: 'Client', desc: 'Read-only access to progress dashboards and reports' },
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Simulate slight network delay for premium visual UX (spinner)
      await new Promise(resolve => setTimeout(resolve, 600));

      await createUser({
        name,
        email,
        role,
        department: department || undefined,
        phone: phone || undefined,
        isVerified,
        is2FAEnabled,
      });

      toast.success(`User account for ${name} created successfully!`);
      navigate('/app/admin/users');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create user account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4">
        <Link to="/app/admin/users" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-500 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to User Directory
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Create New User</h1>
            <p className="text-sm text-slate-500 mt-0.5">Initialize a new employee credential and department profile.</p>
          </div>
        </div>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-surface-950 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white transition-all
                    ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'}`}
                />
              </div>
              {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@qualitydesk.io"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-surface-950 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white transition-all
                    ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'}`}
                />
              </div>
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-surface-950 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white transition-all
                    ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-surface-950 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white transition-all
                    ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-primary-500'}`}
                />
              </div>
              {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword}</span>}
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 dark:text-white transition-all"
                >
                  <option value="">Select Department (Optional)</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Quality">Quality</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Management">Management</option>
                </select>
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 0123"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Role selection cards */}
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Assign Role</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rolesList.map((r) => {
                const isSelected = role === r.value;
                return (
                  <div
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all active:scale-[0.98] select-none
                      ${isSelected 
                        ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-transparent'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{r.label}</span>
                      {isSelected && <span className="h-2 w-2 rounded-full bg-primary-500" />}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{r.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification & 2FA Toggles */}
          <div className="flex flex-col sm:flex-row gap-6 border-t border-slate-200/60 dark:border-slate-800/60 pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-800 text-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0 cursor-pointer"
              />
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Auto-Verify Email</div>
                <div className="text-xs text-slate-500">Skip activation email sending and mark account active immediately.</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={is2FAEnabled}
                onChange={(e) => setIs2FAEnabled(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-800 text-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0 cursor-pointer"
              />
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Force 2FA Onboard</div>
                <div className="text-xs text-slate-500">Require this user to configure biometrics / authenticator app.</div>
              </div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-200/60 dark:border-slate-800/60 pt-6">
            <Link to="/app/admin/users">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Create User Account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
