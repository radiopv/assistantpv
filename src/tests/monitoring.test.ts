import { logError, logPerformance } from '@/utils/monitoring';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

describe('Monitoring Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('logError should insert error into performance_logs', async () => {
    const error = new Error('Test error');
    const context = { userId: '123', action: 'test' };

    await logError(error, context);

    expect(supabase.from).toHaveBeenCalledWith('performance_logs');
    expect(supabase.from('performance_logs').insert).toHaveBeenCalledWith({
      metric_name: 'error',
      value: 1,
      metadata: {
        error: error.message,
        stack: error.stack,
        ...context,
      },
    });
  });

  test('logPerformance should insert performance metric', async () => {
    const metric = {
      name: 'page_load',
      value: 1500,
      metadata: { page: 'home' },
    };

    await logPerformance(metric);

    expect(supabase.from).toHaveBeenCalledWith('performance_logs');
    expect(supabase.from('performance_logs').insert).toHaveBeenCalledWith({
      metric_name: metric.name,
      value: metric.value,
      metadata: metric.metadata,
    });
  });

  test('logError should handle missing context', async () => {
    const error = new Error('Test error');

    await logError(error);

    expect(supabase.from).toHaveBeenCalledWith('performance_logs');
    expect(supabase.from('performance_logs').insert).toHaveBeenCalledWith({
      metric_name: 'error',
      value: 1,
      metadata: {
        error: error.message,
        stack: error.stack,
      },
    });
  });
});