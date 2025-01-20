import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pedwjkjpckjlwbxfsmth.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZHdqa2pwY2tqbHdieGZzbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NzMxODcsImV4cCI6MjA0NzQ0OTE4N30.O7MUaPJkpNG1JekWOH3BaXsx5QxvAPRQKmsoANzEQiw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);