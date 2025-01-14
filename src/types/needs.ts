import { Json } from "@/integrations/supabase/types/json";

export interface Need {
  id?: string;
  category: string;
  description?: string;
  is_urgent: boolean;
}

export interface NotificationMetadata {
  child_id?: string;
  child_name?: string;
  photo_url?: string;
  need_type?: string;
  is_read?: boolean;
}

export const convertJsonToNeeds = (jsonNeeds: Json | null): Need[] => {
  if (!jsonNeeds) {
    console.log('No needs provided');
    return [];
  }

  if (!Array.isArray(jsonNeeds)) {
    console.log('Invalid needs format:', jsonNeeds);
    return [];
  }

  try {
    console.log('Converting JSON needs:', jsonNeeds);
    return jsonNeeds.map(need => {
      const needObj = need as Record<string, unknown>;
      return {
        id: String(needObj?.id || ''),
        category: String(needObj?.category || ''),
        description: String(needObj?.description || ''),
        is_urgent: Boolean(needObj?.is_urgent || false)
      };
    });
  } catch (error) {
    console.error('Error converting needs:', error);
    return [];
  }
};

export const convertNeedsToJson = (needs: Need[]): Json => {
  if (!Array.isArray(needs)) {
    console.log('Invalid needs format:', needs);
    return [];
  }

  try {
    console.log('Converting needs to JSON:', needs);
    return needs.map(need => ({
      id: need.id,
      category: need.category,
      description: need.description,
      is_urgent: need.is_urgent
    })) as unknown as Json;
  } catch (error) {
    console.error('Error converting needs to JSON:', error);
    return [];
  }
};