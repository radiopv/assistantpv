import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageList } from "@/components/Messages/MessageList";
import { ComposeMessage } from "@/components/Messages/ComposeMessage";
import { Card } from "@/components/ui/card";

const Messages = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Messagerie</h1>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inbox">Boîte de réception</TabsTrigger>
          <TabsTrigger value="compose">Nouveau message</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox">
          <Card className="p-6">
            <MessageList />
          </Card>
        </TabsContent>

        <TabsContent value="compose">
          <Card className="p-6">
            <ComposeMessage />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;