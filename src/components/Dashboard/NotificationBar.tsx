import { Bell, MessageSquare, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";

export const NotificationBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: notifications, refetch: refetchNotifications } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      try {
        console.log("Fetching unread notifications...");
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)
          .eq('recipient_id', user?.id);
        
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
    enabled: !!user?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: messages } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact' })
          .eq('is_read', false)
          .eq('recipient_id', user?.id);
        
        if (error) {
          console.error('Error fetching messages:', error);
          return 0;
        }
        
        return count || 0;
      } catch (error) {
        console.error('Error in messages query:', error);
        return 0;
      }
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Listen for real-time changes on the notifications table
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`
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
  }, [refetchNotifications, user?.id]);

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