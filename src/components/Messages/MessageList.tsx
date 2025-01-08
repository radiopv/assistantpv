import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MessageHeader } from "./MessageHeader";
import { MessageContent } from "./MessageContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Message } from "@/types/messages";

interface MessageListProps {
  messages: Message[];
  onSelectMessage: (message: Message | null) => void;
  onMessageUpdate: () => void;
}

export const MessageList = ({ messages, onSelectMessage, onMessageUpdate }: MessageListProps) => {
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

      onMessageUpdate();
      toast.success("Message supprimé avec succès");
      onSelectMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Erreur lors de la suppression du message");
    }
  };

  const handleStarMessage = async (messageId: string, isStarred: boolean) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_starred: !isStarred })
        .eq("id", messageId);

      if (error) throw error;
      onMessageUpdate();
    } catch (error) {
      console.error("Error starring message:", error);
      toast.error("Erreur lors du marquage du message");
    }
  };

  const handleArchiveMessage = async (messageId: string, isArchived: boolean) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_archived: !isArchived })
        .eq("id", messageId);

      if (error) throw error;
      onMessageUpdate();
    } catch (error) {
      console.error("Error archiving message:", error);
      toast.error("Erreur lors de l'archivage du message");
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId);

      if (error) throw error;
      onMessageUpdate();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

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
                onStar={() => handleStarMessage(message.id, message.is_starred)}
                onArchive={() => handleArchiveMessage(message.id, message.is_archived)}
                isStarred={message.is_starred}
                isArchived={message.is_archived}
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