import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Message {
  id: string;
  subject: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  sender: {
    name: string;
    role: string;
  };
}

export const MessageList = ({ onSelectMessage }: { onSelectMessage: (message: Message) => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:sender_id(name, role)
        `)
        .or(`recipient_id.eq.${user?.id},sender_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      // Transform the data to match the Message interface
      const transformedMessages = data?.map(msg => ({
        ...msg,
        sender: {
          name: msg.sender?.name || "Unknown",
          role: msg.sender?.role || "unknown"
        }
      })) || [];

      setMessages(transformedMessages);
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel("messages_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = {
              ...payload.new as Message,
              sender: {
                name: "Loading...", // This will be updated on the next fetch
                role: "unknown"
              }
            };
            setMessages((prev) => [newMessage, ...prev]);
            // Fetch the complete message data to get the sender info
            fetchMessages();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  return (
    <Card className="h-[600px] w-full">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => onSelectMessage(message)}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{message.sender.name}</span>
                  <Badge variant={message.sender.role === "admin" ? "destructive" : "secondary"}>
                    {message.sender.role}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </span>
              </div>
              <h3 className="font-medium mb-1">{message.subject}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
              {!message.is_read && (
                <Badge className="mt-2" variant="default">
                  Nouveau
                </Badge>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};