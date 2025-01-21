import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pedwjkjpckjlwbxfsmth.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZHdqa2pwY2tqbHdieGZzbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NzMxODcsImV4cCI6MjA0NzQ0OTE4N30.O7MUaPJkpNG1JekWOH3BaXsx5QxvAPRQKmsoANzEQiw";

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage // Use localStorage for session persistence
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    },
    // Add error handling
    db: {
      schema: 'public'
    }
  }
);

// Add global error handler for Supabase
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
    localStorage.removeItem('user');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.id);
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed');
  }
});

// Add error logging
const originalFrom = supabase.from.bind(supabase);
supabase.from = function(table: string) {
  const result = originalFrom(table);
  const originalSelect = result.select.bind(result);
  
  result.select = function(...args: any[]) {
    const query = originalSelect(...args);
    const originalThen = query.then.bind(query);
    
    query.then = function(resolve: any, reject: any) {
      return originalThen((response: any) => {
        if (response.error) {
          console.error(`Supabase query error for table ${table}:`, response.error);
        }
        return resolve(response);
      }, reject);
    };
    
    return query;
  };
  
  return result;
};