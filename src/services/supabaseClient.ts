import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        // 앱이 HashRouter(#로 화면 전환)를 사용하므로, 매직 링크 로그인 토큰이
        // URL의 # 부분(해시)이 아니라 ?code= 형식(쿼리)으로 오도록 PKCE 방식을 사용한다.
        // 그렇지 않으면 라우터가 해시를 정리하면서 로그인 토큰을 지워버릴 수 있다.
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const OUTFIT_PHOTOS_BUCKET = "outfit-photos";
