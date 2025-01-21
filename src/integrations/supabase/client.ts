import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://pedwjkjpckjlwbxfsmth.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZHdqa2pwY2tqbHdieGZzbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4OTQyMzAsImV4cCI6MjAyMjQ3MDIzMH0.0_KQB8FWi4XhqY4H8_5_-_k7KgLyZHZtaJpU_HA_5ZE';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
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
});

// Helper function to handle Supabase responses
export async function handleSupabaseResponse<T>(
  promise: Promise<{ data: T | null; error: Error | null }>
): Promise<T> {
  const { data, error } = await promise;
  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  if (!data) {
    console.error('No data returned from Supabase');
    throw new Error('No data returned from Supabase');
  }
  return data;
}