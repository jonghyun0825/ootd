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
  codeSent?: boolean;
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

  // 이메일로 6자리 인증코드를 보낸다. 링크 방식과 달리 요청한 브라우저가 아니어도
  // (예: 다른 기기에서 메일 확인) 코드만 입력하면 되므로 기기/브라우저에 영향을 받지 않는다.
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) return { error: error.message };
  return { codeSent: true };
}

export async function verifyEmailCode(email: string, token: string): Promise<{ error?: string }> {
  if (!supabase) {
    return { error: "Supabase가 설정되지 않았습니다." };
  }
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
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
