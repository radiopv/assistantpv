import { useState } from "react";
import { MessageList } from "@/components/Messages/MessageList";
import { NewMessageDialog } from "@/components/Messages/NewMessageDialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Messages</h1>
        <NewMessageDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MessageList onSelectMessage={setSelectedMessage} />
        
        <Card className="h-[600px]">
          <ScrollArea className="h-full">
            {selectedMessage ? (
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>De: {selectedMessage.sender.name}</span>
                    <span>•</span>
                    <span>{new Date(selectedMessage.created_at).toLocaleDateString()}</span>
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