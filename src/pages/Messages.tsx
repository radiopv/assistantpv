import { useState, type ChangeEvent } from "react";
import { MessageList } from "@/components/Messages/MessageList";
import { NewMessageDialog } from "@/components/Messages/NewMessageDialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Inbox, Star, Archive, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  sender: {
    name: string;
    role: string;
  };
}

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', filter],
    queryFn: async () => {
      let query = supabase
        .from("messages")
        .select(`
          *,
          sender:sender_id(name, role)
        `)
        .order("created_at", { ascending: false });

      if (filter === "unread") {
        query = query.eq("is_read", false);
      } else if (filter === "starred") {
        query = query.eq("is_starred", true);
      } else if (filter === "archived") {
        query = query.eq("is_archived", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Message[];
    }
  });

  const filteredMessages = messages?.filter(msg => 
    msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.sender?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
        <NewMessageDialog />
      </div>

      <div className="flex gap-4">
        <div className="w-1/3 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher des messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les messages</SelectItem>
                <SelectItem value="unread">Non lus</SelectItem>
                <SelectItem value="starred">Favoris</SelectItem>
                <SelectItem value="archived">Archivés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setFilter("all")}>
              <Inbox className="h-4 w-4 mr-2" />
              Boîte de réception
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setFilter("starred")}>
              <Star className="h-4 w-4 mr-2" />
              Favoris
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setFilter("archived")}>
              <Archive className="h-4 w-4 mr-2" />
              Archives
            </Button>
          </div>

          <MessageList 
            messages={filteredMessages || []} 
            onSelectMessage={setSelectedMessage} 
          />
        </div>

        <Card className="w-2/3 h-[600px]">
          <ScrollArea className="h-full">
            {selectedMessage ? (
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>De: {selectedMessage.sender?.name}</span>
                      <span>•</span>
                      <span>{new Date(selectedMessage.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        await supabase
                          .from("messages")
                          .update({ is_starred: !selectedMessage.is_starred })
                          .eq("id", selectedMessage.id);
                      }}
                    >
                      <Star className={`h-4 w-4 ${selectedMessage.is_starred ? "fill-yellow-400" : ""}`} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        await supabase
                          .from("messages")
                          .update({ is_archived: true })
                          .eq("id", selectedMessage.id);
                      }}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  {selectedMessage.content}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Sélectionnez un message pour le lire
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default Messages;