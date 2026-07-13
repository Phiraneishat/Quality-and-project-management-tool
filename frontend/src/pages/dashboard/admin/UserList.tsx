import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, Plus, Search, Filter, Trash2, ArrowLeft, 
  Shield, Briefcase, Users as UsersIcon, Code2, 
  ClipboardList, UserCircle, CheckCircle2, XCircle
} from 'lucide-react';
import { useUserStore } from '../../../store/userStore';
import { useToastStore } from '../../../store/toastStore';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Avatar } from '../../../components/ui/Avatar';

const ROLE_COLORS: Record<string, string> = {
  'Admin':           'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/25',
  'Project Manager': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25',
  'Team Lead':       'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25',
  'Developer':       'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  'QA Tester':       'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
  'Client':          'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25',
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  'Admin':           Shield,
  'Project Manager': Briefcase,
  'Team Lead':       UsersIcon,
  'Developer':       Code2,
  'QA Tester':       ClipboardList,
  'Client':          UserCircle,
};

export const UserList: React.FC = () => {
  const { users, fetchUsers, deleteUser } = useUserStore();
  const toast = useToastStore();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      
      const matchRole = roleFilter === 'All' || user.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const handleDelete = (id: string, name: string) => {
    deleteUser(id);
    toast.success(`User "${name}" deleted successfully.`);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4">
        <Link to="/app/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-500 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Controls
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">User Directory</h1>
              <p className="text-sm text-slate-500 mt-0.5">Total registered users: <span className="font-bold text-primary-500">{users.length}</span></p>
            </div>
          </div>

          <Button 
            variant="primary" 
            leftIcon={<Plus className="h-4 w-4" />} 
            onClick={() => navigate('/app/admin/users/create')}
          >
            Create User
          </Button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 dark:text-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-48 px-3.5 py-2 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-900 dark:text-white transition-all"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Developer">Developer</option>
            <option value="QA Tester">QA Tester</option>
            <option value="Client">Client</option>
          </select>
        </div>
      </Card>

      {/* Users Table / List */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-surface-950/20 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800/50">
              <AnimatePresence>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const RoleIcon = ROLE_ICONS[user.role] || UserCircle;
                    return (
                      <motion.tr 
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/40 dark:hover:bg-surface-900/20 transition-colors"
                      >
                        {/* Name & Email */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} src={user.avatar} className="h-10 w-10 text-sm font-bold bg-gradient-to-tr from-primary-500 to-purple-600 text-white shrink-0" />
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${ROLE_COLORS[user.role]}`}>
                            <RoleIcon className="h-3.5 w-3.5" />
                            {user.role}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {user.isVerified ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Verified</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-slate-400 shrink-0" />
                                <span className="text-xs font-semibold text-slate-400">Pending</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Created At */}
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {deleteConfirmId === user._id ? (
                              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-1.5 rounded-xl">
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 px-1 font-sans">Delete?</span>
                                <button 
                                  onClick={() => handleDelete(user._id, user.name)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
                                >
                                  Yes
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setDeleteConfirmId(user._id)}
                                disabled={user.email === 'admin@qualitydesk.io'} // Prevent deleting main admin
                                className={`p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 transition-all
                                  ${user.email === 'admin@qualitydesk.io' ? 'opacity-40 cursor-not-allowed hover:text-slate-400 hover:bg-transparent' : 'cursor-pointer'}`}
                                title={user.email === 'admin@qualitydesk.io' ? "Cannot delete system admin" : "Delete user"}
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="h-8 w-8 text-slate-300 animate-pulse" />
                        <span className="font-semibold text-sm">No users found matching your search.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
