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
        return await queryFn();
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
      return failureCount < 3;
    },
    ...options
  });
}