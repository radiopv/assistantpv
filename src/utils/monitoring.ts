import { supabase } from "@/integrations/supabase/client";

export const logError = async (error: Error, context: string) => {
  console.error(`Error in ${context}:`, error);

  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;

  if (!userId) {
    console.warn('No user ID available for error logging');
    return;
  }

  try {
    await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action: 'error',
        details: {
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString()
        }
      });
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
};

export const trackPerformance = async (action: string, duration: number) => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      console.warn('No user ID available for performance tracking');
      return;
    }

    await supabase
      .from('performance_logs')
      .insert({
        user_id: userId,
        action,
        duration,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to track performance:', error);
  }
};

export const monitorApiCall = async <T>(
  apiCall: () => Promise<T>,
  context: string
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    await trackPerformance(context, duration);
    return result;
  } catch (error) {
    await logError(error as Error, context);
    throw error;
  }
};