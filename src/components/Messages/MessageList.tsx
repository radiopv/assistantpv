import { useEffect } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Star } from "lucide-react";

interface Message {
  id: string;
  subject: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  conversation_type: string;
  parent_id: string;
  sender_role: string;
  updated_at: string;
  sender?: {
    name: string;
    role: string;
  };
}

export const MessageList = ({ 
  messages,
  onSelectMessage 
}: { 
  messages: Message[];
  onSelectMessage: (message: Message) => void;
}) => {
  const { user } = useAuth();

  useEffect(() => {
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
          // Handle real-time updates
          console.log("Message update:", payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const handleMessageClick = async (message: Message) => {
    if (!message.is_read) {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", message.id);
    }
    onSelectMessage(message);
  };

  return (
    <Card className="h-[450px]">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => handleMessageClick(message)}
              className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                !message.is_read ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{message.sender?.name}</span>
                  <Badge variant={message.sender?.role === "admin" ? "destructive" : "secondary"}>
                    {message.sender?.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {message.is_starred && (
                    <Star className="h-4 w-4 fill-yellow-400" />
                  )}
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>
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