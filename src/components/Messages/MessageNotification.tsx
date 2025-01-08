import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const MessageNotification = () => {
  const navigate = useNavigate();

  const { data: unreadCount } = useQuery({
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

  const handleClick = () => {
    navigate('/messages');
    toast.info("Redirection vers la messagerie");
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative"
      onClick={handleClick}
      title="Messages"
    >
      <MessageSquare className="h-5 w-5" />
      {unreadCount && unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
};