import { describe, it, expect, vi } from 'vitest';
import { logError, logPerformance } from '../utils/monitoring';
import { supabase } from '../integrations/supabase/client';

// Mock Supabase client
vi.mock('../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

describe('Monitoring Utils', () => {
  describe('logError', () => {
    it('should log errors to activity_logs', async () => {
      const testError = new Error('Test error');
      const context = { userId: '123', page: 'test' };

      await logError({
        error: testError,
        context: context,
        userId: '123'  // Add required userId argument
      });

      expect(supabase.from).toHaveBeenCalledWith('activity_logs');
    });

    it('should handle Supabase errors gracefully', async () => {
      const mockError = new Error('Supabase error');
      vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock Supabase error response
      (supabase.from as any).mockImplementation(() => ({
        insert: vi.fn().mockResolvedValue({ error: mockError }),
      }));

      const testError = new Error('Test error');
      await logError({
        error: testError,
        context: {},
        userId: '123'  // Add required userId argument
      });

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('logPerformance', () => {
    it('should log performance metrics', async () => {
      const metric = {
        name: 'test_metric',
        value: 100,
        userId: '123'  // Add required userId argument
      };

      await logPerformance(metric);

      expect(supabase.from).toHaveBeenCalledWith('performance_logs');
    });
  });
});