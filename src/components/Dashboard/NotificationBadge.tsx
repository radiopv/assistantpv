import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const NotificationBadge = () => {
  const { data: unreadCount = 0, refetch } = useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      
      if (error) {
        console.error('Error fetching unread notifications:', error);
        return 0;
      }
      
      return count || 0;
    }
  });

  useEffect(() => {
    // Subscribe to changes
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (unreadCount === 0) {
    return <Bell className="w-5 h-5" />;
  }

  return (
    <div className="relative">
      <Bell className="w-5 h-5" />
      <Badge 
        variant="destructive" 
        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
      >
        {unreadCount}
      </Badge>
    </div>
  );
};