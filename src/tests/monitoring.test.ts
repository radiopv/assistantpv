import { logError, logPerformance } from '@/utils/monitoring';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ error: null })
    }))
  }
}));

describe('Monitoring Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('logError should log errors to activity_logs table', async () => {
    const testError = new Error('Test error');
    const testContext = { userId: '123' };

    await logError(testError, testContext);

    expect(supabase.from).toHaveBeenCalledWith('activity_logs');
    expect(supabase.from().insert).toHaveBeenCalledWith([{
      action: 'error',
      details: expect.objectContaining({
        error_message: 'Test error',
        error_stack: expect.any(String),
        context: testContext,
        timestamp: expect.any(String)
      })
    }]);
  });

  test('logPerformance should log metrics to performance_logs table', async () => {
    const testMetric = {
      name: 'test_metric',
      value: 100,
      metadata: { test: 'data' }
    };

    await logPerformance(testMetric);

    expect(supabase.from).toHaveBeenCalledWith('performance_logs');
    expect(supabase.from().insert).toHaveBeenCalledWith([{
      metric_name: 'test_metric',
      value: 100,
      metadata: { test: 'data' }
    }]);
  });

  test('logPerformance should handle missing metadata', async () => {
    const testMetric = {
      name: 'test_metric',
      value: 100
    };

    await logPerformance(testMetric);

    expect(supabase.from).toHaveBeenCalledWith('performance_logs');
    expect(supabase.from().insert).toHaveBeenCalledWith([{
      metric_name: 'test_metric',
      value: 100,
      metadata: {}
    }]);
  });
});