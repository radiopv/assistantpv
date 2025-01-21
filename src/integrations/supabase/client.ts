import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Using direct values since we don't have access to .env files in this environment
const supabaseUrl = 'https://pedwjkjpckjlwbxfsmth.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZHdqa2pwY2tqbHdieGZzbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4OTQyMzAsImV4cCI6MjAyMjQ3MDIzMH0.0_KQB8FWi4XhqY4H8_5_-_k7KgLyZHZtaJpU_HA_5ZE';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
  throw new Error('Missing Supabase configuration');
}

// Create Supabase client with error handling
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

// Error handler for Supabase operations
export function handleSupabaseError(error: unknown, context: string) {
  console.error(`Supabase error in ${context}:`, error);

  // Handle specific error types
  if (error instanceof Error) {
    if (error.message.includes('JWT')) {
      console.error('Authentication error - please log in again');
      // You might want to trigger a logout or auth refresh here
      return;
    }
    
    if (error.message.includes('network')) {
      console.error('Network error - please check your connection');
      return;
    }
  }

  // Generic error handling
  console.error('An unexpected error occurred');
}

// Type guard for Supabase errors
export function isSupabaseError(error: unknown): error is { 
  message: string; 
  details: string; 
  hint: string; 
  code: string; 
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error
  );
}