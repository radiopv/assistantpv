import { Json } from "@/integrations/supabase/types";

export interface Need {
  category: string;
  description: string;
  is_urgent: boolean;
  [key: string]: string | boolean; // Ajout de l'index signature pour la compatibilité Json
}

export const convertJsonToNeeds = (jsonNeeds: Json | null): Need[] => {
  if (!jsonNeeds) return [];
  
  try {
    const needsArray = typeof jsonNeeds === 'string' ? JSON.parse(jsonNeeds) : jsonNeeds;
    
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

export const convertNeedsToJson = (needs: Need[] | null): Json => {
  if (!needs || !Array.isArray(needs)) {
    console.log('Needs is not an array:', needs);
    return [];
  }

  try {
    console.log('Converting needs to JSON:', needs);
    const jsonNeeds = needs.map(need => ({
      category: need.category,
      description: need.description,
      is_urgent: need.is_urgent
    }));
    console.log('Converted needs:', jsonNeeds);
    return jsonNeeds as Json;
  } catch (error) {
    console.error('Error converting needs to JSON:', error);
    return [] as Json;
  }
};