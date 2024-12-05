import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const logActivity = async (userId: string | null, action: string, details?: any) => {
  try {
    if (!userId) {
      console.log('No user ID provided for activity logging');
      return;
    }

    // First check if the user exists in auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError || !authUser) {
      console.error('User not found in auth.users table:', userId);
      return;
    }

    // Then check if user exists in profiles
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
      // Only create profile if user exists in auth.users
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