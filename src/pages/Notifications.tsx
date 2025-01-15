import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { NeedNotifications } from "@/components/Dashboard/NeedNotifications";
import { AuditLogsList } from "@/components/Admin/AuditLogs/AuditLogsList";
import { MessageList } from "@/components/Messages/MessageList";
import { ComposeMessage } from "@/components/Messages/ComposeMessage";
import { useLanguage } from "@/contexts/LanguageContext";

const Notifications = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      notifications: "Notifications",
      history: "Historique",
      messages: "Messages",
      newMessage: "Nouveau message",
      title: "Centre de notifications",
      subtitle: "Restez informé des mises à jour importantes"
    },
    es: {
      notifications: "Notificaciones",
      history: "Historial",
      messages: "Mensajes",
      newMessage: "Nuevo mensaje",
      title: "Centro de notificaciones",
      subtitle: "Manténgase informado de las actualizaciones importantes"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      <div className="container mx-auto px-4 py-12 space-y-12">
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-8 rounded-xl shadow-lg text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold font-title mb-4">
            {t.title}
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            {t.subtitle}
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-orange-200">
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList>
              <TabsTrigger value="notifications">{t.notifications}</TabsTrigger>
              <TabsTrigger value="history">{t.history}</TabsTrigger>
              <TabsTrigger value="messages">{t.messages}</TabsTrigger>
              <TabsTrigger value="new-message">{t.newMessage}</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Card className="p-6">
                <NeedNotifications />
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="p-6">
                <AuditLogsList />
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card className="p-6">
                <MessageList />
              </Card>
            </TabsContent>

            <TabsContent value="new-message">
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

export default Notifications;