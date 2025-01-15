import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageList } from "@/components/Messages/MessageList";
import { ComposeMessage } from "@/components/Messages/ComposeMessage";
import { Card } from "@/components/ui/card";

const Messages = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      <div className="container mx-auto px-4 py-12 space-y-12">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-8 rounded-xl shadow-lg text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold font-title mb-4">
            Messagerie
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Communiquez avec vos contacts et restez informé
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-orange-200">
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
      </div>
    </div>
  );
};

export default Messages;