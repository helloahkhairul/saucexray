import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Set these in your .env / EAS secrets:
//   EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
//   EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ─── Types ────────────────────────────────────────────────────

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type AnalysisRow = {
  id: string;
  user_id: string;
  app_url: string;
  app_name: string;
  developer: string;
  category: string;
  rating: number;
  price: string;
  screen_count: number;
  difficulty: Difficulty;
  overview: string;
  target_audience: string;
  monetization: string;
  complaints: string[];
  screen_flow: string[];
  must_have_features: string[];
  nice_to_have_features: string[];
  tech_stack: string[];
  improvement_opportunities: string[];
  build_steps: { label: string; time: string }[];
  icon_url?: string;
  created_at: string;
};

// ─── Analyses CRUD ────────────────────────────────────────────

/** Fetch all analyses for the current user, most-recent first. */
export async function listAnalyses(): Promise<AnalysisRow[]> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Fetch a single analysis by id. */
export async function getAnalysis(id: string): Promise<AnalysisRow | null> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

/** Save a new analysis row returned from the edge function. */
export async function saveAnalysis(
  row: Omit<AnalysisRow, 'id' | 'created_at'>
): Promise<AnalysisRow> {
  const { data, error } = await supabase
    .from('analyses')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Delete an analysis (user's own only, enforced by RLS). */
export async function deleteAnalysis(id: string): Promise<void> {
  const { error } = await supabase.from('analyses').delete().eq('id', id);
  if (error) throw error;
}

// ─── Auth helpers ─────────────────────────────────────────────

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.session;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
