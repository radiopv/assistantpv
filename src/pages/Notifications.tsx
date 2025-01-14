import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { NeedNotifications } from "@/components/Dashboard/NeedNotifications";
import { AuditLogsList } from "@/components/Admin/AuditLogs/AuditLogsList";
import { useLanguage } from "@/contexts/LanguageContext";

const Notifications = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      notifications: "Notifications",
      history: "Historique",
      title: "Centre de notifications"
    },
    es: {
      notifications: "Notificaciones",
      history: "Historial",
      title: "Centro de notificaciones"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t.title}</h1>
      
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList>
          <TabsTrigger value="notifications">{t.notifications}</TabsTrigger>
          <TabsTrigger value="history">{t.history}</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Notifications;