import { isSupabaseConfigured, supabase } from "./supabaseClient";
import type { AppUser } from "../types/outfit";

const MOCK_SESSION_KEY = "outfit-archive:mock-session";

function readMockUser(): AppUser | null {
  const raw = localStorage.getItem(MOCK_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

function writeMockUser(user: AppUser | null): void {
  if (user) {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(MOCK_SESSION_KEY);
  }
}

export async function getCurrentUser(): Promise<AppUser | null> {
  if (!isSupabaseConfigured || !supabase) {
    return readMockUser();
  }
  const { data } = await supabase.auth.getSession();
  const sessionUser = data.session?.user;
  if (!sessionUser) return null;
  return {
    id: sessionUser.id,
    email: sessionUser.email ?? undefined,
    createdAt: sessionUser.created_at,
  };
}

export function subscribeToAuthChanges(callback: (user: AppUser | null) => void): () => void {
  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    const sessionUser = session?.user;
    callback(
      sessionUser
        ? { id: sessionUser.id, email: sessionUser.email ?? undefined, createdAt: sessionUser.created_at }
        : null,
    );
  });
  return () => subscription.unsubscribe();
}

export type SignInResult = {
  error?: string;
  mockUser?: AppUser;
};

export async function signInWithEmail(email: string): Promise<SignInResult> {
  if (!isSupabaseConfigured || !supabase) {
    const mockUser: AppUser = {
      id: `mock-${encodeURIComponent(email)}`,
      email,
      createdAt: new Date().toISOString(),
    };
    writeMockUser(mockUser);
    return { mockUser };
  }

  const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) return { error: error.message };
  return {};
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    writeMockUser(null);
    return;
  }
  await supabase.auth.signOut();
}
