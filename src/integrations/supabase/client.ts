import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-client-info': 'passion-varadero',
    },
  },
  db: {
    schema: 'public',
  },
});

// Helper function to handle Supabase responses
export async function handleSupabaseResponse<T>(
  promise: Promise<{ data: T | null; error: Error | null }>
): Promise<T> {
  const { data, error } = await promise;
  if (error) throw error;
  if (!data) throw new Error('No data returned from Supabase');
  return data;
}