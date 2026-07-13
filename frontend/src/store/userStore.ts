import { create } from 'zustand';
import { User, UserRole } from '../types';
import { DEMO_USERS } from './authStore';

interface UserState {
  users: User[];
  fetchUsers: () => void;
  createUser: (userData: { name: string; email: string; role: UserRole; department?: string; phone?: string; isVerified: boolean; is2FAEnabled: boolean }) => Promise<User>;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  fetchUsers: () => {
    const stored = localStorage.getItem('qd-all-users');
    if (stored) {
      set({ users: JSON.parse(stored) });
    } else {
      localStorage.setItem('qd-all-users', JSON.stringify(DEMO_USERS));
      set({ users: DEMO_USERS });
    }
  },
  createUser: async (userData) => {
    const newUser: User = {
      ...userData,
      _id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => {
      const updated = [...state.users, newUser];
      localStorage.setItem('qd-all-users', JSON.stringify(updated));
      return { users: updated };
    });
    
    return newUser;
  },
  deleteUser: (id) => {
    set((state) => {
      const updated = state.users.filter((u) => u._id !== id);
      localStorage.setItem('qd-all-users', JSON.stringify(updated));
      return { users: updated };
    });
  },
}));
