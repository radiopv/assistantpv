import { Json } from "@/integrations/supabase/types";

export interface Need {
  category: string;
  description: string;
  is_urgent: boolean;
}

export interface NeedJson {
  category: string;
  description: string;
  is_urgent: boolean;
}

export const convertJsonToNeeds = (jsonNeeds: Json | null): Need[] => {
  if (!Array.isArray(jsonNeeds)) return [];
  return jsonNeeds.map(need => {
    const needObj = need as NeedJson;
    return {
      category: String(needObj?.category || ''),
      description: String(needObj?.description || ''),
      is_urgent: Boolean(needObj?.is_urgent || false)
    };
  });
};

export const convertNeedsToJson = (needs: Need[]): Json => {
  return needs.map(need => ({
    category: need.category,
    description: need.description,
    is_urgent: need.is_urgent
  })) as unknown as Json;
};