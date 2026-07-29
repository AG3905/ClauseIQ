import { createBrowserClient, createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Browser Client for Client Components
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Server Client for Server Components and Route Handlers
export async function createServerSupabaseClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignored if called from a Server Component
        }
      },
    },
  });
}

// Singleton browser instance
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export interface UserSessionData {
  id: string;
  email: string;
  full_name: string;
  organization?: string;
  created_at?: string;
}

const LOCAL_SESSION_KEY = "clauseiq_active_session";

export function setLocalAuthSession(user: UserSessionData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
    document.cookie = `clauseiq_session=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export function getLocalAuthSession(): UserSessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    if (raw) return JSON.parse(raw);
    const cookieMatch = document.cookie.match(/(?:^|; )clauseiq_session=([^;]*)/);
    if (cookieMatch) return JSON.parse(decodeURIComponent(cookieMatch[1]));
  } catch {
    return null;
  }
  return null;
}

export function clearLocalAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    document.cookie = "clauseiq_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  }
}

export function getInitials(name?: string, email?: string): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim().length > 0) {
    const prefix = email.split('@')[0];
    const parts = prefix.split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return prefix.slice(0, 2).toUpperCase();
  }
  return "SA";
}

export function getDisplayName(name?: string, email?: string): string {
  if (name && name.trim().length > 0) {
    return name.trim();
  }
  if (email && email.trim().length > 0) {
    const prefix = email.split('@')[0];
    return prefix
      .split(/[._-]/)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }
  return "Counsel";
}

export interface AnalysisItem {
  id: string;
  user_id: string;
  document_name: string;
  document_text?: string;
  type: string;
  verdict: 'safe' | 'review' | 'danger';
  riskScore: string;
  created_at: string;
  result?: any;
}

export async function fetchUserAnalyses(): Promise<AnalysisItem[]> {
  if (typeof window === "undefined") return [];

  const supabase = createBrowserSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const activeUser = user || getLocalAuthSession();
  if (!activeUser) return [];

  const userKey = user?.id || activeUser.email;

  if (user?.id) {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(item => ({
          id: item.id,
          user_id: item.user_id,
          document_name: item.document_name,
          document_text: item.document_text,
          type: "Commercial Agreement",
          verdict: item.verdict || "review",
          riskScore: `${item.risk_score || 50}/100`,
          created_at: item.created_at,
          result: item.result
        }));
      }
    } catch {
      // Ignored if table not ready
    }
  }

  try {
    const raw = localStorage.getItem(`clauseiq_user_analyses_${userKey}`);
    if (raw) return JSON.parse(raw);
  } catch {
    return [];
  }
  return [];
}

export async function saveUserAnalysisRecord(record: {
  document_name: string;
  document_text: string;
  verdict: 'safe' | 'review' | 'danger';
  risk_score: number;
  result: any;
}): Promise<AnalysisItem> {
  const supabase = createBrowserSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const activeUser = user || getLocalAuthSession();

  const userKey = user?.id || activeUser?.email || "default_user";
  const userId = user?.id || activeUser?.id || "usr_anonymous";

  const newItem: AnalysisItem = {
    id: "aud-" + Math.random().toString(36).substring(2, 9),
    user_id: userId,
    document_name: record.document_name,
    document_text: record.document_text,
    type: "Commercial / MSA",
    verdict: record.verdict,
    riskScore: `${record.risk_score}/100`,
    created_at: new Date().toISOString(),
    result: record.result
  };

  if (user?.id) {
    try {
      await supabase.from('analyses').insert({
        id: newItem.id,
        user_id: user.id,
        document_name: record.document_name,
        document_text: record.document_text,
        result: record.result,
        verdict: record.verdict,
        risk_score: record.risk_score,
      });
    } catch {
      // Ignored if DB table not ready
    }
  }

  if (typeof window !== "undefined") {
    try {
      const existingRaw = localStorage.getItem(`clauseiq_user_analyses_${userKey}`);
      const existing: AnalysisItem[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(newItem);
      localStorage.setItem(`clauseiq_user_analyses_${userKey}`, JSON.stringify(existing));
    } catch {
      // Ignored
    }
  }

  return newItem;
}
