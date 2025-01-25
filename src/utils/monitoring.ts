import { supabase } from '@/integrations/supabase/client';

interface ErrorLogParams {
  error: Error;
  context: Record<string, any>;
  userId: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  userId: string;
  metadata?: Record<string, any>;
}

export const logError = async ({ error, context, userId }: ErrorLogParams) => {
  try {
    const errorLog = {
      action: 'error_logged',
      user_id: userId,
      details: {
        error_message: error.message,
        error_stack: error.stack,
        context,
        timestamp: new Date().toISOString()
      }
    };

    const { error: supabaseError } = await supabase
      .from('activity_logs')
      .insert(errorLog);

    if (supabaseError) {
      console.error('Error logging to Supabase:', supabaseError);
    }
  } catch (err) {
    console.error('Error in logError:', err);
  }
};

export const logPerformance = async (metric: PerformanceMetric) => {
  try {
    const { error } = await supabase
      .from('performance_logs')
      .insert({
        metric_name: metric.name,
        value: metric.value,
        metadata: metric.metadata || {},
        user_id: metric.userId
      });

    if (error) {
      console.error('Error logging performance metric:', error);
    }
  } catch (err) {
    console.error('Error in logPerformance:', err);
  }
};