import { supabase } from "@/integrations/supabase/client";

export const logError = async (error: Error, context?: Record<string, any>) => {
  try {
    const { error: dbError } = await supabase
      .from('activity_logs')
      .insert([{
        action: 'error',
        details: {
          message: error.message,
          stack: error.stack,
          context
        }
      }]);

    if (dbError) throw dbError;
  } catch (e) {
    console.error('Error logging to database:', e);
  }
};

export const trackPerformance = async (metricName: string, value: number, metadata?: Record<string, any>) => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{
        action: 'performance_metric',
        details: {
          metric_name: metricName,
          value,
          metadata
        }
      }]);

    if (error) throw error;
  } catch (e) {
    console.error('Error logging performance metric:', e);
  }
};

export const monitorApiCall = async (endpoint: string, duration: number, status: number) => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{
        action: 'api_call',
        details: {
          endpoint,
          duration,
          status
        }
      }]);

    if (error) throw error;
  } catch (e) {
    console.error('Error logging API call:', e);
  }
};