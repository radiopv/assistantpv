import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const logActivity = async (userId: string | null, action: string, details?: any) => {
  try {
    if (!userId) {
      console.log('No user ID provided for activity logging');
      return;
    }

    // Check if user exists in profiles
    const { data: userExists, error: userCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (userCheckError) {
      console.error('Error checking user profile:', userCheckError);
      return;
    }

    if (!userExists) {
      console.warn('User not found in profiles table:', userId);
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ 
          id: userId, 
          role: 'pending-sponsor',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
      if (insertError) {
        console.error('Error creating profile:', insertError);
        return;
      }
    }

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