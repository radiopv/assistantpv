import { useState } from "react";
import { MessageList } from "@/components/Messages/MessageList";
import { NewMessageDialog } from "@/components/Messages/NewMessageDialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Archive, Star, Inbox, Send, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

      <div className="flex gap-4">
        <Card className="w-64 p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchMessages')}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="inbox" className="w-full">
            <TabsList className="grid w-full grid-cols-1 gap-2">
              <TabsTrigger value="inbox" className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                {t('inbox')}
              </TabsTrigger>
              <TabsTrigger value="starred" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {t('starred')}
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                {t('sent')}
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex items-center gap-2">
                <Archive className="h-4 w-4" />
                {t('archived')}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="pt-4">
            <Button variant="outline" className="w-full justify-start">
              <Star className="mr-2 h-4 w-4" />
              {t('important')}
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          <MessageList 
            onSelectMessage={setSelectedMessage} 
            searchTerm={searchTerm}
          />
          
          <Card className="h-[600px] relative">
            <ScrollArea className="h-full">
              {selectedMessage ? (
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{t('from')} {selectedMessage.sender?.name}</span>
                      <span>•</span>
                      <span>{new Date(selectedMessage.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Star className="h-4 w-4 mr-2" />
                        {t('markImportant')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="h-4 w-4 mr-2" />
                        {t('archive')}
                      </Button>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    {selectedMessage.content}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                  <Send className="h-12 w-12 text-gray-300" />
                  <p>{t('selectMessageToRead')}</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;