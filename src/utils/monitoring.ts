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

export const trackPerformance = async (metricName: string, value: number, metadata: Record<string, any> = {}, userId?: string) => {
  try {
    const performanceLog = {
      action: 'performance_metric',
      user_id: userId || 'anonymous',
      details: {
        metric_name: metricName,
        value,
        metadata
      }
    };

    await supabase.from('activity_logs').insert([performanceLog]);
  } catch (e) {
    console.error('Failed to track performance:', e);
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