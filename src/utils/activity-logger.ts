import { supabase } from "@/integrations/supabase/client";
import { type Json } from "@/integrations/supabase/types/json";

export const logActivity = async (userId: string, action: string, details?: Json) => {
  try {
    // First verify if the user exists in the sponsors table
    const { data: sponsor } = await supabase
      .from('sponsors')
      .select('id')
      .eq('id', userId)
      .single();

    if (!sponsor) {
      console.error('Cannot log activity: User not found in sponsors table');
      return;
    }

    console.log('Logging activity:', { userId, action, details });
    
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        details
      });

    if (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in logActivity:', error);
  }
};