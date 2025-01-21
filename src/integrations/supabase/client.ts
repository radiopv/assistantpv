import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pedwjkjpckjlwbxfsmth.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZHdqa2pwY2tqbHdieGZzbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU4MjcyMDAsImV4cCI6MjAyMTQwMzIwMH0.0_KQb2fiR4e_D6VMY5ZKD_kpM_XHtuqQBxnXfLYKt8Y";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);