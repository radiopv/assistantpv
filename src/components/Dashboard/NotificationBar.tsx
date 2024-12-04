import { Bell, MessageSquare, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const NotificationBar = () => {
  const { data: notifications } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      return count || 0;
    }
  });

  const { data: messages } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      return count || 0;
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