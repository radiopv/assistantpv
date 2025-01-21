import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pedwjkjpckjlwbxfsmth.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZHdqa2pwY2tqbHdieGZzbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NzMxODcsImV4cCI6MjA0NzQ0OTE4N30.O7MUaPJkpNG1JekWOH3BaXsx5QxvAPRQKmsoANzEQiw";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  }
);