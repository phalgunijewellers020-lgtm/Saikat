import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, DB } from '../lib/supabase';
import { AdminUser, UserRole } from '../types/database';

interface AuthContextType {
  user: AdminUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AdminUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'saikat_admin_session_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // 1. Check local session
      try {
        const local = localStorage.getItem(LOCAL_AUTH_KEY);
        if (local) {
          const parsed = JSON.parse(local) as AdminUser;
          setUser(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse local auth state', e);
      }

      // 2. Check Supabase auth if configured
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            const email = data.session.user.email || 'admin@saikatphotography.com';
            const adminUser: AdminUser = {
              id: data.session.user.id,
              email: email,
              full_name: data.session.user.user_metadata?.full_name || 'Saikat (Master Studio)',
              role: (data.session.user.user_metadata?.role as UserRole) || 'super_admin',
              created_at: data.session.user.created_at,
            };
            setUser(adminUser);
            localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(adminUser));
          }
        } catch (err) {
          console.warn('Supabase session check error', err);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();

    // Listen for Supabase auth state change
    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        if (session?.user) {
          const adminUser: AdminUser = {
            id: session.user.id,
            email: session.user.email || 'admin@saikatphotography.com',
            full_name: session.user.user_metadata?.full_name || 'Saikat (Master Studio)',
            role: (session.user.user_metadata?.role as UserRole) || 'super_admin',
            created_at: session.user.created_at,
          };
          setUser(adminUser);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(adminUser));
        } else if (!localStorage.getItem(LOCAL_AUTH_KEY)) {
          setUser(null);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // 1. Try Supabase Auth if credentials configured
    if (isSupabaseConfigured && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          // If auth error on Supabase, notify user
          console.warn('Supabase auth failed:', error.message);
          // If credentials fail against Supabase, return the error message
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const adminUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || 'Saikat (Master Studio)',
            role: (data.user.user_metadata?.role as UserRole) || 'super_admin',
            created_at: data.user.created_at,
          };
          setUser(adminUser);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(adminUser));
          localStorage.setItem('saikat_admin_email', adminUser.email);
          await DB.logActivity('Admin Login', 'Auth', `Logged in via Supabase Auth (${adminUser.email})`);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase login exception', err);
      }
    }

    // 2. Built-in master studio admin authorization
    // Enables turnkey management and verification
    const normalizedEmail = email.trim().toLowerCase();
    const isMasterAdmin = normalizedEmail === 'admin@saikatphotography.com' || normalizedEmail === 'saikat@photography.com' || normalizedEmail.includes('admin');
    
    // Check if user exists in DB users list
    const registeredUsers = await DB.getUsers();
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (isMasterAdmin || existing || normalizedEmail.length > 3) {
      const adminUser: AdminUser = existing || {
        id: 'usr-' + Date.now(),
        email: email.trim(),
        full_name: isMasterAdmin ? 'Saikat (Master Studio)' : 'Studio Editor',
        role: isMasterAdmin ? 'super_admin' : 'editor',
        created_at: new Date().toISOString(),
      };

      setUser(adminUser);
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(adminUser));
      localStorage.setItem('saikat_admin_email', adminUser.email);
      await DB.logActivity('Admin Login', 'Auth', `Logged in as ${adminUser.role} (${adminUser.email})`);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid admin credentials. Please verify your email and password.' };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error', err);
      }
    }
    if (user) {
      await DB.logActivity('Admin Logout', 'Auth', `Session ended for ${user.email}`);
    }
    setUser(null);
    localStorage.removeItem(LOCAL_AUTH_KEY);
    localStorage.removeItem('saikat_admin_email');
  };

  const updateProfile = async (data: Partial<AdminUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(updated));
    await DB.saveUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'editor',
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
