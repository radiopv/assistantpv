import { Json } from "@/integrations/supabase/types";

export interface Need {
  category: string;
  description: string;
  is_urgent: boolean;
}

export const convertJsonToNeeds = (jsonNeeds: Json | null): Need[] => {
  if (!jsonNeeds) return [];
  
  try {
    // If jsonNeeds is a string, try to parse it
    const needsArray = typeof jsonNeeds === 'string' ? JSON.parse(jsonNeeds) : jsonNeeds;
    
    // Ensure we have an array
    if (!Array.isArray(needsArray)) return [];

    return needsArray.map(need => {
      if (typeof need !== 'object' || !need) {
        return {
          category: '',
          description: '',
          is_urgent: false
        };
      }

      const needObj = need as Record<string, unknown>;
      return {
        category: String(needObj?.category || ''),
        description: String(needObj?.description || ''),
        is_urgent: Boolean(needObj?.is_urgent || false)
      };
    });
  } catch (error) {
    console.error('Error parsing needs JSON:', error);
    return [];
  }
};

export const convertNeedsToJson = (needs: Need[]): Json => {
  try {
    const jsonNeeds = needs.map(need => ({
      category: need.category,
      description: need.description,
      is_urgent: need.is_urgent
    }));
    return jsonNeeds as Json;
  } catch (error) {
    console.error('Error converting needs to JSON:', error);
    return [] as Json;
  }
};