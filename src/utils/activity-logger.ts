import { supabase } from "@/integrations/supabase/client";

export const logActivity = async (userId: string | null, action: string, details?: any) => {
  try {
    // Skip logging if no user ID is provided
    if (!userId) {
      console.log('No user ID provided for activity logging');
      return;
    }

    // Check if user exists in auth.users
    const { data: userExists, error: userCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (userCheckError || !userExists) {
      console.warn('User not found in profiles table, skipping activity log:', userId);
      return;
    }

    // Log the activity
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        details
      });

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error in activity logger:', error);
  }
};