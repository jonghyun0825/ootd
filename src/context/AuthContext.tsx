import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AppUser } from "../types/outfit";
import {
  getCurrentUser,
  signInWithEmail,
  signOut,
  subscribeToAuthChanges,
} from "../services/authService";
import { isSupabaseConfigured } from "../services/supabaseClient";

type LoginOutcome = { error?: string; sentMagicLink?: boolean };

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  isMockMode: boolean;
  requestLogin: (email: string) => Promise<LoginOutcome>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((current) => {
      if (!active) return;
      setUser(current);
      setLoading(false);
    });
    const unsubscribe = subscribeToAuthChanges((next) => {
      if (active) setUser(next);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const requestLogin = async (email: string): Promise<LoginOutcome> => {
    const result = await signInWithEmail(email);
    if (result.error) return { error: result.error };
    if (result.mockUser) {
      setUser(result.mockUser);
      return { sentMagicLink: false };
    }
    return { sentMagicLink: true };
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isMockMode: !isSupabaseConfigured, requestLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
