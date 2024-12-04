import { Json } from "@/integrations/supabase/types";

export interface Need {
  [key: string]: Json | undefined;
  categories?: string[];
  description: string;
  is_urgent: boolean;
}

export const convertJsonToNeeds = (jsonNeeds: Json | null): Need[] => {
  if (!Array.isArray(jsonNeeds)) return [];
  return jsonNeeds.map(need => {
    if (typeof need !== 'object' || !need) return {
      categories: [],
      description: '',
      is_urgent: false
    };
    
    const needObj = need as Record<string, unknown>;
    return {
      categories: Array.isArray(needObj?.categories) ? needObj.categories.map(String) : [],
      description: String(needObj?.description || ''),
      is_urgent: Boolean(needObj?.is_urgent || false)
    };
  });
};

export const convertNeedsToJson = (needs: Need[]): Json => {
  const jsonNeeds = needs.map(need => ({
    categories: need.categories || [],
    description: need.description,
    is_urgent: need.is_urgent
  }));
  return jsonNeeds as unknown as Json;
};