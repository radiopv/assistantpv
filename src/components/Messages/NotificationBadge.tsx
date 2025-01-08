import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export const NotificationBadge = () => {
  const { data: unreadCount } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      if (error) throw error;
      return count || 0;
    }
  });

  if (!unreadCount) return null;

  return (
    <Badge variant="destructive" className="ml-2">
      {unreadCount}
    </Badge>
  );
};