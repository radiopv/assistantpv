import { supabase } from "@/integrations/supabase/client";

export const logActivity = async (userId: string, action: string, details?: any) => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        details
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};