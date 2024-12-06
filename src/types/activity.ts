import { type Json } from "@/integrations/supabase/types/json";

export type ActivityLogType = {
  id: string;
  user_id: string;
  action: string;
  details: Json;
  created_at: string;
  user?: {
    name: string;
    role: string;
    city?: string;
  };
};