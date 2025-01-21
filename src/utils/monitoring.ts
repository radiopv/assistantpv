import { supabase } from "@/integrations/supabase/client";

export const logError = async (error: Error, context: Record<string, any> = {}) => {
  try {
    const errorLog = {
      error_message: error.message,
      error_stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    };

    const { error: dbError } = await supabase
      .from('activity_logs')
      .insert([{
        action: 'error',
        user_id: context.userId || 'anonymous',
        details: errorLog
      }]);

    if (dbError) throw dbError;
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