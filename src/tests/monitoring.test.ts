import { describe, it, expect, vi } from 'vitest';
import { logError, trackPerformance, monitorApiCall } from '../utils/monitoring';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } })
    },
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null })
    }))
  }
}));

describe('Monitoring Utils', () => {
  it('logs errors correctly', async () => {
    const error = new Error('Test error');
    await logError(error, 'test-context');
    
    expect(supabase.from).toHaveBeenCalledWith('activity_logs');
  });

  it('tracks performance metrics', async () => {
    await trackPerformance('test-action', 100);
    
    expect(supabase.from).toHaveBeenCalledWith('performance_logs');
  });

  it('monitors API calls', async () => {
    const mockApi = vi.fn().mockResolvedValue({ data: 'test' });
    const result = await monitorApiCall(mockApi, 'test-api');
    
    expect(result).toEqual({ data: 'test' });
  });

  it('handles errors in API calls', async () => {
    const mockApi = vi.fn().mockRejectedValue(new Error('API Error'));
    
    await expect(monitorApiCall(mockApi, 'test-api')).rejects.toThrow('API Error');
  });
});