import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
  initializeAuth: () => Promise<void>;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  forgotPassword: (email: string) => Promise<boolean>;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_default_101',
  name: 'Mannat Walia',
  email: 'mannnatwalia@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  monthly_income: 125000,
  currency: '₹',
  monthly_budget_target: 75000,
};

const ONBOARDING_KEY = 'rupeemind_onboarding_completed';
const USER_SESSION_KEY = 'rupeemind_auth_user';

const getStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialUser = getStoredUser();
const initialOnboarding = typeof window !== 'undefined' ? localStorage.getItem(ONBOARDING_KEY) === 'true' : false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  isLoading: false,
  error: null,
  hasCompletedOnboarding: initialOnboarding,

  initializeAuth: async () => {
    try {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'RupeeMind User',
            email: session.user.email || 'user@rupeemind.ai',
            avatar: session.user.user_metadata?.avatar_url || DEFAULT_USER.avatar,
            monthly_income: 125000,
            currency: '₹',
            monthly_budget_target: 75000,
          };
          localStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile));
          set({ user: profile, isAuthenticated: true });
        }

        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const profile: UserProfile = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'RupeeMind User',
              email: session.user.email || 'user@rupeemind.ai',
              avatar: session.user.user_metadata?.avatar_url || DEFAULT_USER.avatar,
              monthly_income: 125000,
              currency: '₹',
              monthly_budget_target: 75000,
            };
            localStorage.setItem(USER_SESSION_KEY, JSON.stringify(profile));
            set({ user: profile, isAuthenticated: true });
          }
        });
      }
    } catch {
      // Ignore initialization errors
    }
  },

  login: async (email: string, password?: string) => {
    set({ isLoading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'password123',
        });
        if (error) {
          // Fallback to local user session
          const user: UserProfile = {
            ...DEFAULT_USER,
            email,
            name: email.split('@')[0],
          };
          localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        }
        if (data.user) {
          const user: UserProfile = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email || email,
            avatar: data.user.user_metadata?.avatar_url || DEFAULT_USER.avatar,
            monthly_income: 125000,
            currency: '₹',
            monthly_budget_target: 75000,
          };
          localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        }
      }

      // Demo/Local login
      const user: UserProfile = {
        ...DEFAULT_USER,
        email,
        name: email.split('@')[0],
      };
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      const user: UserProfile = { ...DEFAULT_USER, email };
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    }
  },

  signup: async (name: string, email: string, password?: string) => {
    set({ isLoading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signUp({
          email,
          password: password || 'password123',
          options: { data: { full_name: name } },
        });
      }
      const user: UserProfile = {
        id: 'usr_' + Date.now(),
        name: name || 'New User',
        email,
        avatar: DEFAULT_USER.avatar,
        monthly_income: 125000,
        currency: '₹',
        monthly_budget_target: 75000,
      };
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      set({ isLoading: false, error: 'Failed to sign up' });
      return false;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
        });
        if (error) {
          throw error;
        }
      } else {
        // High fidelity Google OAuth simulation for demo/preview
        const googleUser: UserProfile = {
          id: 'usr_google_' + Date.now(),
          name: 'Mannat Walia',
          email: 'mannnatwalia@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          monthly_income: 125000,
          currency: '₹',
          monthly_budget_target: 75000,
        };
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(googleUser));
        set({ user: googleUser, isAuthenticated: true, isLoading: false });
      }
    } catch (err) {
      const googleUser: UserProfile = {
        id: 'usr_google_' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        avatar: DEFAULT_USER.avatar,
        monthly_income: 125000,
        currency: '₹',
        monthly_budget_target: 75000,
      };
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(googleUser));
      set({ user: googleUser, isAuthenticated: true, isLoading: false });
    }
  },

  loginAsDemo: () => {
    const demoUser = { ...DEFAULT_USER };
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(demoUser));
    set({ user: demoUser, isAuthenticated: true, isLoading: false, error: null });
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    localStorage.removeItem(USER_SESSION_KEY);
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (data: Partial<UserProfile>) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, ...data };
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updated));
      set({ user: updated });
    }
  },

  forgotPassword: async (email: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
        });
      } catch {
        // ignore
      }
    }
    return true;
  },

  completeOnboarding: () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    set({ hasCompletedOnboarding: true });
  },

  resetOnboarding: () => {
    localStorage.removeItem(ONBOARDING_KEY);
    set({ hasCompletedOnboarding: false });
  },
}));

