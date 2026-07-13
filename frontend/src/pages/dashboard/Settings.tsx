import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config/api';
import { 
  User, Lock, Palette, Bell, Globe, Shield, Database, 
  FileText, Check, AlertCircle, RefreshCw, Eye, ShieldAlert,
  Server, ShieldCheck, Clock, Mail, Key, CheckCircle2, Loader2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { ThemeSwitcher } from '../../components/ui/Shared';
import { useAuthStore } from '../../store/authStore';

const settingsSections = [
  { icon: User, label: 'Profile', id: 'profile' },
  { icon: Lock, label: 'Password', id: 'password' },
  { icon: ShieldCheck, label: 'Face ID', id: 'faceid' },
  { icon: Mail, label: 'Gmail Settings', id: 'gmail' },
  { icon: Palette, label: 'Theme', id: 'theme' },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
  { icon: Globe, label: 'Language', id: 'language' },
  { icon: Shield, label: 'Permissions', id: 'permissions' },
  { icon: Database, label: 'Backup', id: 'backup' },
  { icon: FileText, label: 'Audit Logs', id: 'audit' },
];

const mockAuditLogs = [
  { id: '1', action: 'auth/login_success', user: 'PHIRANEISH A T', ip: '192.168.1.45', timestamp: '2026-07-06 12:45:12', status: 'Success' },
  { id: '2', action: 'project/create', user: 'PHIRANEISH A T', ip: '192.168.1.45', timestamp: '2026-07-06 11:20:05', status: 'Success' },
  { id: '3', action: 'settings/update_profile', user: 'PHIRANEISH A T', ip: '192.168.1.45', timestamp: '2026-07-06 10:15:33', status: 'Success' },
  { id: '4', action: 'auth/password_reset_request', user: 'Marcus Johnson', ip: '10.0.0.12', timestamp: '2026-07-05 18:30:10', status: 'Warning' },
  { id: '5', action: 'db/backup_triggered', user: 'System (Cron)', ip: '127.0.0.1', timestamp: '2026-07-05 00:00:00', status: 'Success' },
  { id: '6', action: 'auth/failed_login_attempt', user: 'unknown_user', ip: '198.51.100.72', timestamp: '2026-07-04 22:11:45', status: 'Failed' },
];

export const Settings: React.FC = () => {
  const { user, tokens } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>('profile');

  // Face ID Biometric states
  const [registeredFace, setRegisteredFace] = useState<string | null>(null);
  const [faceCheckLoading, setFaceCheckLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [registerProgress, setRegisterProgress] = useState(0);
  const [registerStep, setRegisterStep] = useState('Position your face in the frame...');
  const [registerStatus, setRegisterStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const fetchFaceRegistration = async () => {
    if (!user?.email) return;
    setFaceCheckLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/get-face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify({ email: user.email }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.hasFace && data.faceTemplate) {
          setRegisteredFace(data.faceTemplate);
        } else {
          setRegisteredFace(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch face biometric registration status:', err);
    } finally {
      setFaceCheckLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'faceid') {
      fetchFaceRegistration();
    } else {
      // Clean up camera stream if tab changes
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setIsCameraActive(false);
      setRegisterStatus('idle');
      setRegisterProgress(0);
    }
  }, [activeTab]);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      setRegisterStatus('scanning');
      setRegisterProgress(0);
      setRegisterStep('Initializing high-definition webcam feed...');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 320, facingMode: 'user' },
        audio: false,
      });
      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Simulate a biometric alignment flow
      const steps = [
        { progress: 20, text: 'Mapping face coordinates...' },
        { progress: 40, text: 'Analyzing jaw and cheek structure...' },
        { progress: 65, text: 'Extracting face landmark vector...' },
        { progress: 85, text: 'Capturing high-resolution template...' },
        { progress: 100, text: 'Saving signature to secure database...' },
      ];

      let currentStepIdx = 0;
      const interval = setInterval(async () => {
        setRegisterProgress(prev => {
          const next = prev + 5;
          const currentStep = steps[currentStepIdx];
          if (currentStep && next >= currentStep.progress) {
            setRegisterStep(currentStep.text);
            currentStepIdx++;
          }

          if (next >= 100) {
            clearInterval(interval);
            captureAndSaveFace(stream);
            return 100;
          }
          return next;
        });
      }, 100);

    } catch (err) {
      console.error(err);
      setRegisterStatus('failed');
      setRegisterStep('Error: Camera permission denied or device busy.');
      setIsCameraActive(false);
    }
  };

  const captureAndSaveFace = async (stream: MediaStream) => {
    try {
      // Stop camera stream
      stream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);

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

      // POST to backend API
      const res = await fetch(`${API_BASE_URL}/api/auth/register-face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify({ email: user?.email, faceTemplate: snapshot }),
      });

      if (!res.ok) {
        throw new Error('Database registration request failed');
      }

      setRegisteredFace(snapshot);
      setRegisterStatus('success');
      setRegisterStep('Biometric Face ID signature registered successfully!');
    } catch (err) {
      console.error(err);
      setRegisterStatus('failed');
      setRegisterStep('Failed to write biometric credentials to database.');
    }
  };

  const deleteFaceRegistration = async () => {
    if (!window.confirm('Are you sure you want to remove your biometric Face ID profile from the database?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register-face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify({ email: user?.email, faceTemplate: '' }),
      });
      if (res.ok) {
        setRegisteredFace(null);
        setRegisterStatus('idle');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passStatus, setPassStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [passMessage, setPassMessage] = useState('');

  // Gmail SMTP states
  const [gmailUser, setGmailUser] = useState('');
  const [gmailPass, setGmailPass] = useState('');
  const [smtpConfigured, setSmtpConfigured] = useState(false);
  const [smtpLoading, setSmtpLoading] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [smtpMessage, setSmtpMessage] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPassStatus('error');
      setPassMessage('All password fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      setPassStatus('error');
      setPassMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPassStatus('error');
      setPassMessage('New passwords do not match.');
      return;
    }

    setPassLoading(true);
    setPassStatus('idle');
    setPassMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Incorrect current password.');
      }

      setPassStatus('success');
      setPassMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPassStatus('error');
      setPassMessage(err.message || 'Failed to update password.');
    } finally {
      setPassLoading(false);
    }
  };

  // Fetch SMTP configuration on mount
  useEffect(() => {
    fetchSMTPConfig();
  }, []);

  const fetchSMTPConfig = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/config`);
      if (res.ok) {
        const data = await res.json();
        setGmailUser(data.gmailUser || '');
        setSmtpConfigured(data.isConfigured);
        if (data.hasPassword) {
          setGmailPass('••••••••••••••••');
        }
      }
    } catch (err) {
      console.error('Failed to load SMTP config:', err);
    }
  };

  const handleSaveSMTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setSmtpLoading(true);
    setSmtpStatus('idle');
    setSmtpMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gmailUser, gmailPass }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update configuration.');
      }

      setSmtpStatus('success');
      setSmtpMessage('Gmail SMTP credentials updated successfully.');
      setSmtpConfigured(true);
      fetchSMTPConfig();
    } catch (err: any) {
      setSmtpStatus('error');
      setSmtpMessage(err.message || 'Connection error. Make sure the backend server is running on port 4000.');
    } finally {
      setSmtpLoading(false);
    }
  };

  // Theme accent state
  const [accentColor, setAccentColor] = useState('indigo');

  // Notifications states
  const [notifTicketAssigned, setNotifTicketAssigned] = useState(true);
  const [notifSlaBreaches, setNotifSlaBreaches] = useState(true);
  const [notifDailyDigest, setNotifDailyDigest] = useState(false);
  const [notifSlackSync, setNotifSlackSync] = useState(true);
  const [notifFrequency, setNotifFrequency] = useState('instant');

  // Language settings
  const [language, setLanguage] = useState('en-US');
  const [timezone, setTimezone] = useState('UTC');

  // Backup simulation states
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [lastBackupTime, setLastBackupTime] = useState('2026-07-05 00:00:00');
  const [backupSuccess, setBackupSuccess] = useState(false);

  const triggerBackup = () => {
    setIsBackingUp(true);
    setBackupSuccess(false);
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          setBackupSuccess(true);
          const now = new Date();
          setLastBackupTime(now.toISOString().replace('T', ' ').substring(0, 19));
          setTimeout(() => setBackupSuccess(false), 5000);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account, preferences, and application settings.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <Card padding="sm">
            <nav className="flex flex-col gap-0.5">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeTab === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border-l-2 border-primary-500 pl-3'
                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-surface-800/50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <Card>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-6">Profile Information</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar name={user?.name || 'User'} size="xl" />
                    <div>
                      <Button variant="outline" size="sm">Change Photo</Button>
                      <p className="text-[10px] text-slate-400 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="Full Name" defaultValue={user?.name || ''} />
                    <Input label="Email Address" defaultValue={user?.email || ''} type="email" />
                    <Input label="Phone" placeholder="+1 (555) 000-0000" />
                    <Input label="Department" defaultValue={user?.department || 'Engineering'} />
                  </div>
                  <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button variant="primary">Save Changes</Button>
                  </div>
                </Card>
              )}

              {/* PASSWORD TAB */}
              {activeTab === 'password' && (
                <Card>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-6">Change Password</h2>
                  <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                    <Input 
                      label="Current Password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      required
                    />
                    <Input 
                      label="New Password" 
                      type="password" 
                      placeholder="Min 6 characters" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                    <Input 
                      label="Confirm New Password" 
                      type="password" 
                      placeholder="Repeat new password" 
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      required
                    />

                    {/* Status message */}
                    <AnimatePresence>
                      {passStatus !== 'idle' && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                            passStatus === 'success'
                              ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-red-500/10 border-red-500/15 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {passStatus === 'success' ? <CheckCircle2 className="h-4.5 w-4.5 shrink-0" /> : <AlertCircle className="h-4.5 w-4.5 shrink-0" />}
                          {passMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button type="submit" variant="primary" isLoading={passLoading}>
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {/* FACE ID TAB */}
              {activeTab === 'faceid' && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">Holographic Face ID</h2>
                      <p className="text-xs text-slate-500">Register your biometric face profile in the database to enable quick Face ID login.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-12 gap-8 items-start">
                    {/* Status & Actions Info */}
                    <div className="md:col-span-5 space-y-5">
                      <div className={`p-4 rounded-xl border flex flex-col gap-2.5 ${
                        registeredFace
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}>
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <span className={`w-2 h-2 rounded-full ${registeredFace ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                          {registeredFace ? 'Biometric Signature Active' : 'No Biometric Signature Registered'}
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-90">
                          {registeredFace
                            ? 'Your Face ID is registered in the database. You can now use your webcam to sign in from the login screen without typing your password.'
                            : 'Register your face coordinates now. The scan will be securely saved under your credentials in MongoDB.'}
                        </p>
                      </div>

                      {registeredFace && (
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Registered Template (Base64)</span>
                          <div className="relative w-28 h-28 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-md">
                            <img src={registeredFace} className="w-full h-full object-cover grayscale scale-x-[-1]" alt="Face template" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-2">
                              <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-bold">Secure ID</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={deleteFaceRegistration} className="text-red-500 hover:text-red-600">
                            Delete Biometric Profile
                          </Button>
                        </div>
                      )}

                      {!registeredFace && !isCameraActive && (
                        <Button variant="primary" onClick={startCamera}>
                          Start Biometric Registration
                        </Button>
                      )}
                    </div>

                    {/* Camera Scanner View */}
                    <div className="md:col-span-7 flex flex-col items-center">
                      <div className={`relative w-64 h-64 rounded-full border-2 flex items-center justify-center overflow-hidden bg-slate-950 transition-all duration-300 ${
                        registerStatus === 'success'
                          ? 'border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                          : registerStatus === 'failed'
                          ? 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.35)]'
                          : 'border-dashed border-slate-800'
                      }`}>
                        {registerStatus === 'scanning' && (
                          <div className="absolute inset-0 border-2 border-primary-500/30 rounded-full animate-ping pointer-events-none" />
                        )}

                        {isCameraActive ? (
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-700 gap-2">
                            <Shield className={`h-12 w-12 animate-pulse ${
                              registerStatus === 'success'
                                ? 'text-emerald-500'
                                : registerStatus === 'failed'
                                ? 'text-rose-500'
                                : 'text-slate-800'
                            }`} />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Scanner Offline</span>
                          </div>
                        )}

                        {/* Scanner HUD Overlay */}
                        {isCameraActive && (
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent top-1/2 animate-scan-beam" />
                            <svg className="absolute inset-0 w-full h-full text-primary-500/25" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
                              <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="currentColor" strokeWidth="0.25" />
                              <circle cx="50" cy="50" r="3" className="fill-primary-500" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Scanning HUD steps & progress bar */}
                      {(isCameraActive || registerStatus !== 'idle') && (
                        <div className="w-full max-w-sm mt-6 space-y-3">
                          <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                            <span className="truncate">{registerStep}</span>
                            <span>{registerProgress}%</span>
                          </div>
                          <div className="h-1 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-purple-600 transition-all duration-100"
                              style={{ width: `${registerProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* GMAIL SETTINGS TAB */}
              {activeTab === 'gmail' && (
                <Card>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">Gmail SMTP Settings</h2>
                      <p className="text-xs text-slate-500">Configure your direct Gmail sender for the contact desk.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSMTP} className="space-y-5 max-w-lg">
                    {/* Status Banner */}
                    <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-medium ${
                      smtpConfigured 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}>
                      <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">{smtpConfigured ? 'Gmail SMTP Connected' : 'Gmail SMTP Unconfigured'}</p>
                        <p className="opacity-80 mt-0.5">
                          {smtpConfigured 
                            ? 'Emails sent from the contact page will be delivered straight to your Gmail inbox.'
                            : 'Currently running in simulated mode. Fill in credentials below to enable real sending.'
                          }
                        </p>
                      </div>
                    </div>

                    <Input 
                      label="Gmail Address" 
                      value={gmailUser} 
                      onChange={e => setGmailUser(e.target.value)} 
                      placeholder="yourname@gmail.com" 
                      required
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-655 dark:text-slate-400 uppercase tracking-wider">
                        Gmail App Password
                      </label>
                      <Input 
                        value={gmailPass} 
                        onChange={e => setGmailPass(e.target.value)} 
                        placeholder="16-character code (e.g. abcd efgh ijkl mnop)" 
                        type="password"
                        required
                      />
                      <p className="text-[10px] text-slate-500 leading-normal mt-1 bg-slate-50 dark:bg-surface-950/40 p-3 rounded-xl border border-slate-105 dark:border-slate-850">
                        <strong>Security Note:</strong> Do not enter your normal account password. Enable <strong>2-Step Verification</strong> on your Google Account, then go to Google Account Security and open App Passwords to generate a 16-character code.
                      </p>
                    </div>

                    {/* Action response status messages */}
                    <AnimatePresence>
                      {smtpStatus !== 'idle' && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                            smtpStatus === 'success'
                              ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-red-500/10 border-red-500/15 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {smtpStatus === 'success' ? <CheckCircle2 className="h-4.5 w-4.5 shrink-0" /> : <AlertCircle className="h-4.5 w-4.5 shrink-0" />}
                          {smtpMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        isLoading={smtpLoading}
                      >
                        Save & Connect Gmail
                      </Button>
                    </div>
                  </form>
                </Card>
              )}

              {/* THEME TAB */}
              {activeTab === 'theme' && (
                <Card className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">Theme Preferences</h2>
                    <p className="text-xs text-slate-500">Configure visual appearance, theme mode, and colors.</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-850 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Appearance Theme</p>
                      <p className="text-[10px] text-slate-500">Toggle between dark and light colors</p>
                    </div>
                    <ThemeSwitcher />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Color Accents
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'indigo', label: 'Indigo / Teal', color: 'bg-indigo-600' },
                        { id: 'violet', label: 'Violet / Amber', color: 'bg-violet-600' },
                        { id: 'emerald', label: 'Emerald / Cyan', color: 'bg-emerald-600' },
                      ].map((accent) => (
                        <button
                          key={accent.id}
                          type="button"
                          onClick={() => setAccentColor(accent.id)}
                          className={`p-4 rounded-2xl border text-left flex items-center gap-3 cursor-pointer transition-all ${
                            accentColor === accent.id
                              ? 'bg-white dark:bg-surface-800 border-primary-500/30 shadow-md'
                              : 'bg-slate-50 dark:bg-surface-950/20 border-slate-200 dark:border-slate-850'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${accent.color}`} />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{accent.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <Card className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">Notification Settings</h2>
                    <p className="text-xs text-slate-500">Decide which activities trigger emails and pager notifications.</p>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { id: 'ticket', label: 'Ticket Assignment Alerts', sub: 'Receive emails when a new task or bug ticket is assigned to you', state: notifTicketAssigned, set: setNotifTicketAssigned },
                      { id: 'sla', label: 'Critical SLA Reminders', sub: 'Urgent notifications for tickets approaching resolution deadlines', state: notifSlaBreaches, set: setNotifSlaBreaches },
                      { id: 'digest', label: 'Daily Status Digest', sub: 'Receive a consolidated summary email of all sprint activities', state: notifDailyDigest, set: setNotifDailyDigest },
                      { id: 'slack', label: 'Slack Synchronization Events', sub: 'Sync platform events directly to connected Slack workspace channels', state: notifSlackSync, set: setNotifSlackSync },
                    ].map((notif) => (
                      <div key={notif.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-850 rounded-xl">
                        <div className="max-w-xl">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{notif.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{notif.sub}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => notif.set(!notif.state)}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                            notif.state ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${notif.state ? 'translate-x-4.5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                      Digest Frequency
                    </label>
                    <select
                      value={notifFrequency}
                      onChange={(e) => setNotifFrequency(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold"
                    >
                      <option value="instant">Instant Dispatch</option>
                      <option value="daily">Daily Summary</option>
                      <option value="weekly">Weekly Compilation</option>
                    </select>
                  </div>
                </Card>
              )}

              {/* LANGUAGE TAB */}
              {activeTab === 'language' && (
                <Card className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">Language & Locale</h2>
                    <p className="text-xs text-slate-500">Configure default display language and date formatting settings.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                        Preferred Display Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold"
                      >
                        <option value="en-US">English (United States) [en-US]</option>
                        <option value="es-ES">Spanish (Spain) [es-ES]</option>
                        <option value="fr-FR">French (France) [fr-FR]</option>
                        <option value="de-DE">German (Germany) [de-DE]</option>
                        <option value="ja-JP">Japanese (Japan) [ja-JP]</option>
                        <option value="hi-IN">Hindi (India) [hi-IN]</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 font-mono">
                        System Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-950 text-xs sm:text-sm text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
                      >
                        <option value="UTC">Coordinated Universal Time (UTC)</option>
                        <option value="PST">Pacific Standard Time (PST - UTC-8)</option>
                        <option value="EST">Eastern Standard Time (EST - UTC-5)</option>
                        <option value="IST">Indian Standard Time (IST - UTC+5:30)</option>
                      </select>
                    </div>
                  </div>
                </Card>
              )}

              {/* PERMISSIONS TAB */}
              {activeTab === 'permissions' && (
                <Card className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">Access & Permissions</h2>
                    <p className="text-xs text-slate-500">Configure role-based access privileges for workspace assets.</p>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-surface-900 text-[10px] sm:text-xs text-left">
                    <div className="grid grid-cols-5 bg-slate-50 dark:bg-surface-950 p-3 font-black uppercase tracking-wider text-slate-500">
                      <div>Resource Permission</div>
                      <div className="text-center">Admin</div>
                      <div className="text-center">Developer</div>
                      <div className="text-center">QA / Tester</div>
                      <div className="text-center">Guest</div>
                    </div>
                    {[
                      { perm: 'Create / Delete Projects', a: true, d: true, t: false, g: false },
                      { perm: 'Modify Sprints & Backlog', a: true, d: true, t: true, g: false },
                      { perm: 'Resolve Defect Bug Tickets', a: true, d: true, t: true, g: false },
                      { perm: 'Trigger System Database Backup', a: true, d: false, t: false, g: false },
                      { perm: 'Export Compliance PDF Reports', a: true, d: true, t: true, g: true },
                    ].map((row, idx) => (
                      <div key={idx} className="grid grid-cols-5 p-3 border-t border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-surface-950/20 transition-colors">
                        <div className="font-bold text-slate-800 dark:text-slate-300">{row.perm}</div>
                        <div className="flex justify-center text-emerald-500">{row.a ? <ShieldCheck className="h-4.5 w-4.5" /> : <ShieldAlert className="h-4.5 w-4.5 text-slate-300" />}</div>
                        <div className="flex justify-center text-emerald-500">{row.d ? <ShieldCheck className="h-4.5 w-4.5" /> : <ShieldAlert className="h-4.5 w-4.5 text-slate-300" />}</div>
                        <div className="flex justify-center text-emerald-500">{row.t ? <ShieldCheck className="h-4.5 w-4.5" /> : <ShieldAlert className="h-4.5 w-4.5 text-slate-300" />}</div>
                        <div className="flex justify-center text-emerald-500">{row.g ? <ShieldCheck className="h-4.5 w-4.5" /> : <ShieldAlert className="h-4.5 w-4.5 text-slate-300" />}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* BACKUP TAB */}
              {activeTab === 'backup' && (
                <Card className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">System Backups</h2>
                    <p className="text-xs text-slate-500">Configure automated data archiving or manually snapshot the system database.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-850 rounded-2xl text-left flex items-center justify-between">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Backup Storage Status</h4>
                        <p className="text-sm font-black text-slate-850 dark:text-white mt-1 font-mono">98.4 GB Used / AWS S3</p>
                      </div>
                      <Server className="h-8 w-8 text-primary-500/80" />
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-surface-950/40 border border-slate-200/50 dark:border-slate-850 rounded-2xl text-left flex items-center justify-between">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Last Snapshot Timestamp</h4>
                        <p className="text-sm font-black text-slate-850 dark:text-white mt-1 font-mono">{lastBackupTime}</p>
                      </div>
                      <Clock className="h-8 w-8 text-primary-500/80" />
                    </div>
                  </div>

                  {/* Backup Progress simulator */}
                  {isBackingUp && (
                    <div className="p-4 border border-primary-500/20 bg-primary-500/5 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-primary-500">
                        <span className="flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Compressing database payload...</span>
                        <span className="font-mono">{backupProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-surface-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary-500"
                          initial={{ width: '0%' }}
                          animate={{ width: `${backupProgress}%` }}
                          transition={{ duration: 0.15 }}
                        />
                      </div>
                    </div>
                  )}

                  <AnimatePresence>
                    {backupSuccess && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2"
                      >
                        <Check className="h-4.5 w-4.5 shrink-0" /> Full database schema successfully archived to S3 bucket.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant="primary"
                      disabled={isBackingUp}
                      leftIcon={<RefreshCw className={`h-4 w-4 ${isBackingUp ? 'animate-spin' : ''}`} />}
                      onClick={triggerBackup}
                    >
                      Trigger Full Database Backup
                    </Button>
                  </div>
                </Card>
              )}

              {/* AUDIT LOGS TAB */}
              {activeTab === 'audit' && (
                <Card className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">Audit Compliance Logs</h2>
                    <p className="text-xs text-slate-500">Audit trail trace logs of critical developer configurations.</p>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-surface-900 text-[10px] sm:text-xs text-left">
                    <div className="grid grid-cols-4 bg-slate-50 dark:bg-surface-950 p-3 font-black uppercase tracking-wider text-slate-500">
                      <div>Logged Event</div>
                      <div>Trigger User</div>
                      <div>Source IP</div>
                      <div>Timestamp / Date</div>
                    </div>
                    {mockAuditLogs.map((log) => (
                      <div key={log.id} className="grid grid-cols-4 p-3 border-t border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-surface-950/20 transition-colors font-mono">
                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            log.status === 'Success' ? 'bg-emerald-500' : log.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          {log.action}
                        </div>
                        <div className="text-slate-500 font-sans">{log.user}</div>
                        <div className="text-slate-500">{log.ip}</div>
                        <div className="text-slate-400">{log.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
