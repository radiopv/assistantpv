import { MessageListContainer } from "@/components/Messages/MessageListContainer";
import { NewMessageDialog } from "@/components/Messages/NewMessageDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Messages = () => {
  const { t } = useLanguage();

  const { data: unreadCount } = useQuery({
    queryKey: ['unread-messages-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      return count || 0;
    }
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t('messages')}</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-white px-2 py-1 rounded-full text-sm">
              {unreadCount}
            </span>
          )}
        </div>
        <NewMessageDialog />
      </div>

      <MessageListContainer />
    </div>
  );
};

export default Messages;