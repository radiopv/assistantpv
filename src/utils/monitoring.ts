import { supabase } from "@/integrations/supabase/client";

export const logError = async (error: Error, context: Record<string, any> = {}, userId?: string) => {
  try {
    const errorLog = {
      action: 'error_log',
      user_id: userId || 'anonymous',
      details: {
        message: error.message,
        stack: error.stack,
        context
      }
    };

    await supabase.from('activity_logs').insert([errorLog]);
  } catch (e) {
    console.error('Failed to log error:', e);
  }
};

export const logPerformance = async (metric: {
  name: string;
  value: number;
  metadata?: Record<string, any>;
}) => {
  try {
    const { error } = await supabase
      .from('performance_logs')
      .insert([{
        metric_name: metric.name,
        value: metric.value,
        metadata: metric.metadata || {}
      }]);

    if (error) throw error;
  } catch (e) {
    console.error('Failed to log performance metric:', e);
  }
};

export const monitorApiCall = async (endpoint: string, duration: number, status: number, userId?: string) => {
  try {
    const apiLog = {
      action: 'api_call',
      user_id: userId || 'anonymous',
      details: {
        endpoint,
        duration,
        status
      }
    };

    await supabase.from('activity_logs').insert([apiLog]);
  } catch (e) {
    console.error('Failed to monitor API call:', e);
  }
};