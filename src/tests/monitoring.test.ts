import { logError, trackPerformance, monitorApiCall } from '../utils/monitoring';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: null, error: null })
    }))
  }
}));

describe('Monitoring Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('logError logs errors correctly', async () => {
    const error = new Error('Test error');
    const context = { test: 'context' };
    const userId = 'test-user';

    await logError(error, context, userId);

    expect(supabase.from).toHaveBeenCalledWith('activity_logs');
    expect(supabase.from('activity_logs').insert).toHaveBeenCalledWith([
      expect.objectContaining({
        action: 'error_log',
        user_id: userId,
        details: expect.objectContaining({
          message: error.message,
          context
        })
      })
    ]);
  });

  test('trackPerformance logs metrics correctly', async () => {
    const metricName = 'test-metric';
    const value = 100;
    const metadata = { test: 'metadata' };
    const userId = 'test-user';

    await trackPerformance(metricName, value, metadata, userId);

    expect(supabase.from).toHaveBeenCalledWith('activity_logs');
    expect(supabase.from('activity_logs').insert).toHaveBeenCalledWith([
      expect.objectContaining({
        action: 'performance_metric',
        user_id: userId,
        details: {
          metric_name: metricName,
          value,
          metadata
        }
      })
    ]);
  });

  test('monitorApiCall logs API calls correctly', async () => {
    const endpoint = '/api/test';
    const duration = 100;
    const status = 200;
    const userId = 'test-user';

    await monitorApiCall(endpoint, duration, status, userId);

    expect(supabase.from).toHaveBeenCalledWith('activity_logs');
    expect(supabase.from('activity_logs').insert).toHaveBeenCalledWith([
      expect.objectContaining({
        action: 'api_call',
        user_id: userId,
        details: {
          endpoint,
          duration,
          status
        }
      })
    ]);
  });
});