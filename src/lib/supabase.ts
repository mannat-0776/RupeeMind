import { createClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  meta.env?.VITE_SUPABASE_URL &&
  meta.env?.VITE_SUPABASE_ANON_KEY &&
  meta.env?.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
