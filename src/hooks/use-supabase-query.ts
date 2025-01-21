import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { handleSupabaseError } from "@/utils/supabase-error-handler";
import { supabase } from "@/integrations/supabase/client";

export function useSupabaseQuery<T = any>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      try {
        const result = await queryFn();
        if (!result) {
          throw new Error('No data returned from query');
        }
        return result;
      } catch (error) {
        handleSupabaseError(error, `Query ${key.join('/')}`);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('Invalid API key')) {
        return false;
      }
      // Retry up to 3 times on server errors
      if (error?.message?.includes('Failed to fetch')) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: attemptIndex => Math.min(1000 * (2 ** attemptIndex), 30000),
    ...options
  });
}