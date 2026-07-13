import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { AdminDashboard } from './roles/AdminDashboard';
import { ProjectManagerDashboard } from './roles/ProjectManagerDashboard';
import { TeamLeadDashboard } from './roles/TeamLeadDashboard';
import { DeveloperDashboard } from './roles/DeveloperDashboard';
import { QATesterDashboard } from './roles/QATesterDashboard';
import { ClientDashboard } from './roles/ClientDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  switch (user?.role) {
    case 'Admin':           return <AdminDashboard />;
    case 'Project Manager': return <ProjectManagerDashboard />;
    case 'Team Lead':       return <TeamLeadDashboard />;
    case 'Developer':       return <DeveloperDashboard />;
    case 'QA Tester':       return <QATesterDashboard />;
    case 'Client':          return <ClientDashboard />;
    default:                return <DeveloperDashboard />;
  }
};
