import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: { name: string } | null;
  recipient: { name: string } | null;
}

export const MessageList = () => {
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(name),
          recipient:recipient_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    }
  });

  if (isLoading) {
    return <div>Chargement des messages...</div>;
  }

  return (
    <div className="space-y-4">
      {messages?.map((message) => (
        <Card key={message.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{message.subject}</h3>
                {!message.is_read && (
                  <Badge variant="destructive">Non lu</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">
                De: {message.sender?.name || 'Système'}
              </p>
              <p className="mt-2">{message.content}</p>
            </div>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(message.created_at), {
                addSuffix: true,
                locale: fr
              })}
            </span>
          </div>
        </Card>
      ))}
      {messages?.length === 0 && (
        <p className="text-center text-gray-500">Aucun message</p>
      )}
    </div>
  );
};