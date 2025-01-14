import { Bell, MessageSquare, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export const NotificationBar = () => {
  const navigate = useNavigate();

  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      try {
        console.log("Fetching unread notifications...");
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);
        
        if (error) {
          console.error('Error fetching notifications:', error);
          return 0;
        }
        
        console.log("Found unread notifications:", count);
        return count || 0;
      } catch (error) {
        console.error('Error in notification query:', error);
        return 0;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Listen for real-time changes on the notifications table
  useEffect(() => {
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
          console.log("Notification change detected, refetching...");
          refetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchNotifications]);

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
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleNotificationsClick = () => {
    navigate('/notifications');
    toast.info("Redirection vers les notifications");
  };

  const handleMessagesClick = () => {
    navigate('/messages');
    toast.info("Redirection vers les messages");
  };

  const handleTasksClick = () => {
    navigate('/tasks');
    toast.info("Redirection vers les tâches");
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={handleNotificationsClick}
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {notifications && notifications > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
            {notifications}
          </Badge>
        )}
      </Button>

      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={handleMessagesClick}
        title="Messages"
      >
        <MessageSquare className="h-5 w-5" />
        {messages && messages > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
            {messages}
          </Badge>
        )}
      </Button>

      <Button 
        variant="ghost" 
        size="icon" 
        className="relative"
        onClick={handleTasksClick}
        title="Tâches"
      >
        <CheckSquare className="h-5 w-5" />
      </Button>
    </div>
  );
};