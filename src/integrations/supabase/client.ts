import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pedwjkjpckjlwbxfsmth.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnamtzbW53aGdpcXRpc2lvbmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MTM5ODQsImV4cCI6MjA0NzA4OTk4NH0.VVKTb3v5g0PTUZ3uCg6kHjoc3-19c10royL3t8OKl30';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);