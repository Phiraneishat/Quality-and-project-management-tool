import { create } from 'zustand';
import { User, AuthTokens, UserRole } from '../types';
import { API_BASE_URL } from '../config/api';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, isFaceLogin?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  clearError: () => void;
  checkSession: () => void;
}

// ─── Demo users for each role ───
export const DEMO_USERS: User[] = [
  {
    _id: '1',
    name: 'Phiraneish A T',
    email: 'admin@qualitydesk.io',
    role: 'Admin',
    avatar: '',
    isVerified: true,
    is2FAEnabled: false,
    department: 'Engineering',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-07-06T00:00:00Z',
  },
  {
    _id: '2',
    name: 'Sarah Chen',
    email: 'pm@qualitydesk.io',
    role: 'Project Manager',
    avatar: '',
    isVerified: true,
    is2FAEnabled: false,
    department: 'Product',
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-07-06T00:00:00Z',
  },
  {
    _id: '3',
    name: 'Marcus Webb',
    email: 'lead@qualitydesk.io',
    role: 'Team Lead',
    avatar: '',
    isVerified: true,
    is2FAEnabled: false,
    department: 'Engineering',
    createdAt: '2026-02-20T00:00:00Z',
    updatedAt: '2026-07-06T00:00:00Z',
  },
  {
    _id: '4',
    name: 'Raj Patel',
    email: 'dev@qualitydesk.io',
    role: 'Developer',
    avatar: '',
    isVerified: true,
    is2FAEnabled: false,
    department: 'Engineering',
    createdAt: '2026-03-10T00:00:00Z',
    updatedAt: '2026-07-06T00:00:00Z',
  },
  {
    _id: '5',
    name: 'Priya Nair',
    email: 'qa@qualitydesk.io',
    role: 'QA Tester',
    avatar: '',
    isVerified: true,
    is2FAEnabled: false,
    department: 'Quality',
    createdAt: '2026-03-15T00:00:00Z',
    updatedAt: '2026-07-06T00:00:00Z',
  },
  {
    _id: '6',
    name: 'James Carter',
    email: 'client@qualitydesk.io',
    role: 'Client',
    avatar: '',
    isVerified: true,
    is2FAEnabled: false,
    department: 'External',
    createdAt: '2026-04-01T00:00:00Z',
    updatedAt: '2026-07-06T00:00:00Z',
  },
];

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('qd-user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredTokens = (): AuthTokens | null => {
  try {
    const stored = localStorage.getItem('qd-tokens');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  tokens: getStoredTokens(),
  isAuthenticated: !!getStoredUser(),
  loading: false,
  error: null,

  login: async (email, password, isFaceLogin) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isFaceLogin }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed. Please verify your password.');
      }

      const data = await res.json();
      const tokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: 'demo-refresh-token',
      };

      localStorage.setItem('qd-user', JSON.stringify(data.user));
      localStorage.setItem('qd-tokens', JSON.stringify(tokens));
      
      set({ 
        user: data.user, 
        tokens, 
        isAuthenticated: true, 
        loading: false, 
        error: null 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  register: async (name, email, password, role) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed. User with this email might already exist.');
      }

      const data = await res.json();
      const tokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: 'demo-refresh-token',
      };

      localStorage.setItem('qd-user', JSON.stringify(data.user));
      localStorage.setItem('qd-tokens', JSON.stringify(tokens));

      set({ 
        user: data.user, 
        tokens, 
        isAuthenticated: true, 
        loading: false, 
        error: null 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('qd-user');
    localStorage.removeItem('qd-tokens');
    set({ user: null, tokens: null, isAuthenticated: false, error: null });
  },

  updateProfile: (data) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem('qd-user', JSON.stringify(updated));
      return { user: updated };
    });
  },

  clearError: () => set({ error: null }),

  checkSession: () => {
    const user = getStoredUser();
    const tokens = getStoredTokens();
    set({ user, tokens, isAuthenticated: !!user && !!tokens });
  },
}));
