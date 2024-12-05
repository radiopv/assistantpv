import { type Database } from "@/integrations/supabase/types";

export type ActivityLogType = {
  id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
  user?: {
    name: string;
    role: string;
  };
};