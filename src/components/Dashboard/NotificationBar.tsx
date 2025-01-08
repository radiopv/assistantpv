import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Mail, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthProvider";
import { toast } from "sonner";

export const NotificationBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: unreadNotifications = 0 } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    }
  });

  const { data: unreadMessages = 0 } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    }
  });

  const { data: pendingTasks = 0 } = useQuery({
    queryKey: ['pending-tasks'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('is_completed', false);

      if (error) throw error;
      return count || 0;
    }
  });

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  const handleMessagesClick = () => {
    navigate('/messages');
  };

  const handleTasksClick = () => {
    navigate('/tasks');
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleNotificationsClick}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadNotifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadNotifications}
          </span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleMessagesClick}
        className="relative"
      >
        <Mail className="h-5 w-5" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadMessages}
          </span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleTasksClick}
        className="relative"
      >
        <CheckSquare className="h-5 w-5" />
        {pendingTasks > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {pendingTasks}
          </span>
        )}
      </Button>
    </div>
  );
};