import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseResponse } from '@/types/supabase';

export function useSupabaseQuery<T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, PostgrestError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, PostgrestError>({
    queryKey: key,
    queryFn,
    ...options,
  });
}

export function useSupabaseList<T>(
  table: string,
  options?: {
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
  }
) {
  return useSupabaseQuery<SupabaseResponse<T>>(
    [table, options?.select, options?.filter, options?.orderBy],
    async () => {
      let query = supabase.from(table).select(options?.select || '*');

      if (options?.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  );
}