import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, ArrowRight, Settings2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export const AdminHub: React.FC = () => {
  const navigate = useNavigate();

  const tiles = [
    {
      id: 'users',
      title: 'Users',
      description: 'Manage registered users, view profile logs, update security parameters, or delete accounts.',
      icon: Users,
      path: '/app/admin/users',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'settings',
      title: 'Global Settings',
      description: 'Configure corporate security parameters, set system email thresholds, and configure biometrics.',
      icon: Settings2,
      path: '/app/settings',
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">Admin Controls</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure system parameters, manage users, and view operational intelligence logs.</p>
        </div>
      </div>

      {/* Grid of Admin Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile, i) => {
          const Icon = tile.icon;
          return (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                hover
                onClick={() => navigate(tile.path)}
                className="h-full flex flex-col justify-between group overflow-hidden relative"
              >
                {/* Visual hover background glow */}
                <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-tr ${tile.color} opacity-[0.03] group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tile.color} flex items-center justify-center text-white shadow-md transform group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
                      {tile.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {tile.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary-500 group-hover:translate-x-1 transition-transform duration-200">
                  Manage {tile.title.toLowerCase()}
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
