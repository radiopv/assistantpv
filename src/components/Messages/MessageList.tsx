import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { MessageHeader } from "./MessageHeader";
import { MessageContent } from "./MessageContent";

interface Message {
  id: string;
  subject: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  sender?: {
    name: string;
    role: string;
  };
}

export const MessageList = ({ onSelectMessage }: { onSelectMessage: (message: Message | null) => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) {
        toast.error("Erreur lors de la suppression du message");
        return;
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      toast.success("Message supprimé avec succès");
      onSelectMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Erreur lors de la suppression du message");
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      let query = supabase
        .from("messages")
        .select(`
          *,
          sender:sender_id(name, role)
        `);

      // Si c'est un parrain, il ne voit que ses messages avec Vitia
      if (user?.role === "sponsor") {
        query = query.or(`recipient_id.eq.${user?.id},sender_id.eq.${user?.id}`);
      }
      // Si c'est Vitia, elle voit tous les messages des parrains
      else if (user?.name === "Vitia") {
        query = query.or(`recipient_id.eq.${user?.id},sender_id.eq.${user?.id}`);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      const transformedMessages = (data as any[])?.map(msg => ({
        ...msg,
        sender: msg.sender ? {
          name: msg.sender.name || "Unknown",
          role: msg.sender.role || "unknown"
        } : {
          name: "Unknown",
          role: "unknown"
        }
      }));

      setMessages(transformedMessages);
    };

    fetchMessages();

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
              ...(payload.new as Message),
              sender: {
                name: "Loading...",
                role: "unknown"
              }
            };
            setMessages((prev) => [newMessage, ...prev]);
            fetchMessages();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, user?.role, user?.name]);

  return (
    <Card className="h-[600px] w-full">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
              onClick={() => {
                onSelectMessage(message);
                if (!message.is_read) {
                  markAsRead(message.id);
                }
              }}
            >
              <MessageHeader 
                sender={message.sender}
                createdAt={message.created_at}
                onDelete={() => handleDeleteMessage(message.id)}
              />
              <MessageContent 
                subject={message.subject}
                content={message.content}
                isRead={message.is_read}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};