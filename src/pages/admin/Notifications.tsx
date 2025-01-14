import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { NotificationService } from "@/services/NotificationService";
import { useLanguage } from "@/contexts/LanguageContext";
import { NotificationMetadata } from "@/types/needs";

interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  content: string;
  link?: string;
  is_read: boolean;
  created_at: string;
  metadata: NotificationMetadata;
}

const Notifications = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Notifications",
      markAllAsRead: "Tout marquer comme lu",
      noNotifications: "Aucune notification",
      markAsRead: "Marquer comme lu",
      delete: "Supprimer",
    },
    es: {
      title: "Notificaciones",
      markAllAsRead: "Marcar todo como leído",
      noNotifications: "Sin notificaciones",
      markAsRead: "Marcar como leído",
      delete: "Eliminar",
    }
  };

  const t = translations[language as keyof typeof translations];

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await NotificationService.getNotifications();
      return data as Notification[];
    }
  });

  const handleMarkAsRead = async (notification: Notification) => {
    await NotificationService.markAsRead(notification.id);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead();
    refetch();
  };

  const handleDelete = async (notification: Notification) => {
    await NotificationService.deleteNotification(notification.id);
    refetch();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <Button 
          variant="outline" 
          onClick={handleMarkAllAsRead}
          className="gap-2"
        >
          <Check className="w-4 h-4" />
          {t.markAllAsRead}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{t.noNotifications}</p>
            </Card>
          ) : (
            notifications.map((notification: Notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 ${!notification.is_read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification)}
                        className="gap-2"
                      >
                        <Check className="w-4 h-4" />
                        {t.markAsRead}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification)}
                      className="text-red-600 hover:text-red-700 gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t.delete}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Notifications;