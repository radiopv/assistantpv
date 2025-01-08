import { useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { MessageList } from "./MessageList";
import { MessageDetail } from "./MessageDetail";
import { Card } from "@/components/ui/card";
import type { Message } from "@/types/messages";

export const MessageListContainer = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  const { data: messages = [], refetch } = useQuery({
    queryKey: ['messages', user?.id, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("messages")
        .select(`
          *,
          sender:sender_id(name, role)
        `);

      if (user?.role === "sponsor") {
        query = query.or(`recipient_id.eq.${user?.id},sender_id.eq.${user?.id}`);
      } else if (user?.name === "Vitia") {
        query = query.or(`recipient_id.eq.${user?.id},sender_id.eq.${user?.id}`);
      }

      if (searchTerm) {
        query = query.or(`subject.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data as any[])?.map(msg => ({
        ...msg,
        sender: msg.sender ? {
          name: msg.sender.name || "Unknown",
          role: msg.sender.role || "unknown"
        } : {
          name: "Unknown",
          role: "unknown"
        }
      }));
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MessageList 
        messages={messages}
        onSelectMessage={setSelectedMessage}
        onMessageUpdate={refetch}
      />
      <MessageDetail 
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </div>
  );
};