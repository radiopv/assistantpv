import { Json } from "@/integrations/supabase/types";

export interface Need {
  [key: string]: Json | undefined;
  categories: string[];
  description: string;
  is_urgent: boolean;
}

export const convertJsonToNeeds = (jsonNeeds: Json | null): Need[] => {
  if (!Array.isArray(jsonNeeds)) return [];
  return jsonNeeds.map(need => ({
    categories: Array.isArray(need?.categories) ? need.categories.map(String) : [],
    description: String(need?.description || ""),
    is_urgent: Boolean(need?.is_urgent || false)
  }));
};

export const convertNeedsToJson = (needs: Need[]): Json => {
  return needs as unknown as Json;
};