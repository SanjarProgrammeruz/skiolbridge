import { create } from 'zustand';
import api from '../api/client';

interface User {
  id: string;
  fullName: string;
  email: string;
  careerPath: string;
  experienceLevel: string;
  learningGoal: string;
  dailyLearningTime: number;
  onboardingCompleted: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    const token = localStorage.getItem('sb_token');
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, token, isInitialized: true });
    } catch {
      localStorage.removeItem('sb_token');
      set({ isInitialized: true });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data.data;
      localStorage.setItem('sb_token', token);
      set({ user, token, isLoading: false });
    } catch (err: unknown) {
      set({ isLoading: false });
      const error = err as { response?: { data?: { message?: string } } };
      throw new Error(error.response?.data?.message || 'Kirish xatosi');
    }
  },

  register: async (fullName, email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/register', { fullName, email, password });
      const { token, user } = res.data.data;
      localStorage.setItem('sb_token', token);
      set({ user, token, isLoading: false });
    } catch (err: unknown) {
      set({ isLoading: false });
      const error = err as { response?: { data?: { message?: string } } };
      throw new Error(error.response?.data?.message || 'Ro\'yxatdan o\'tish xatosi');
    }
  },

  logout: () => {
    localStorage.removeItem('sb_token');
    set({ user: null, token: null });
  },

  updateUser: (data) => {
    const user = get().user;
    if (user) set({ user: { ...user, ...data } });
  },
}));
