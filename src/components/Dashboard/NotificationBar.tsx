import { Bell, MessageSquare, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const NotificationBar = () => {
  const { data: notifications } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);
        
        if (error) {
          console.warn('Notifications table not accessible:', error.message);
          return 0;
        }
        
        return count || 0;
      } catch (error) {
        console.warn('Error fetching notifications:', error);
        return 0;
      }
    },
    meta: {
      errorMessage: "Erreur lors du chargement des notifications"
    }
  });

  const { data: messages } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);
        
        if (error) {
          console.warn('Messages table not accessible:', error.message);
          return 0;
        }
        
        return count || 0;
      } catch (error) {
        console.warn('Error fetching messages:', error);
        return 0;
      }
    },
    meta: {
      errorMessage: "Erreur lors du chargement des messages"
    }
  });

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {notifications && notifications > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
            {notifications}
          </Badge>
        )}
      </Button>

      <Button variant="ghost" size="icon" className="relative">
        <MessageSquare className="h-5 w-5" />
        {messages && messages > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
            {messages}
          </Badge>
        )}
      </Button>

      <Button variant="ghost" size="icon" className="relative">
        <CheckSquare className="h-5 w-5" />
      </Button>
    </div>
  );
};