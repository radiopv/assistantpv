import { Json } from "@/integrations/supabase/types";

export interface Need {
  category: string;
  description: string;
  is_urgent: boolean;
}

export const convertJsonToNeeds = (jsonNeeds: Json | null): Need[] => {
  if (!Array.isArray(jsonNeeds)) return [];
  return jsonNeeds.map(need => {
    if (typeof need !== 'object' || !need) return {
      category: '',
      description: '',
      is_urgent: false
    };
    
    const needObj = need as Record<string, unknown>;
    return {
      category: String(needObj?.category || ''),
      description: String(needObj?.description || ''),
      is_urgent: Boolean(needObj?.is_urgent || false)
    };
  });
};

export const convertNeedsToJson = (needs: Need[]): Json => {
  return needs as unknown as Json;
};