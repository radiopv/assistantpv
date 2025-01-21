import { supabase } from "@/integrations/supabase/client";

export const logError = async (error: Error, context: string) => {
  console.error(`Error in ${context}:`, error);

  try {
    await supabase
      .from('activity_logs')
      .insert({
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
    await supabase
      .from('performance_metrics')
      .insert({
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