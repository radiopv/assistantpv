import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr, es } from "date-fns/locale";
import { NeedItem } from "./NeedItem";

interface NeedNotification {
  id: string;
  created_at: string;
  type: string;
  metadata: {
    child_id?: string;
    child_name?: string;
    new_needs?: any[];
    is_read?: boolean;
  } | null;
  is_read: boolean;
}

interface DatabaseNotification {
  id: string;
  created_at: string;
  type: string;
  content: string;
  title: string;
  recipient_id: string;
  link: string | null;
  is_read: boolean;
  updated_at: string;
  metadata: {
    child_id?: string;
    child_name?: string;
    new_needs?: any[];
    is_read?: boolean;
  } | null;
}

export const NeedNotifications = () => {
  const { language } = useLanguage();

  const dateLocale = language === 'fr' ? fr : es;

  const translations = {
    fr: {
      title: "Notifications des besoins",
      markAsRead: "Marquer comme lu",
      noNotifications: "Aucune notification de besoins",
      needsUpdated: "Besoins mis à jour pour",
      markAsReadSuccess: "Notification marquée comme lue",
      error: "Une erreur est survenue"
    },
    es: {
      title: "Notificaciones de necesidades",
      markAsRead: "Marcar como leído",
      noNotifications: "Sin notificaciones de necesidades",
      needsUpdated: "Necesidades actualizadas para",
      markAsReadSuccess: "Notificación marcada como leída",
      error: "Se ha producido un error"
    }
  };

  const { data: notifications, refetch } = useQuery({
    queryKey: ["need-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("type", "need_update")
        .eq("recipient_id", (await supabase.auth.getUser()).data.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match the NeedNotification interface
      return (data as DatabaseNotification[]).map(notification => ({
        id: notification.id,
        created_at: notification.created_at,
        type: notification.type,
        metadata: notification.metadata || {
          child_id: null,
          child_name: '',
          new_needs: [],
          is_read: false
        },
        is_read: notification.is_read
      })) as NeedNotification[];
    }
  });

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ 
          metadata: { is_read: true },
          is_read: true
        })
        .eq("id", notificationId);

      if (error) throw error;

      toast.success(translations[language].markAsReadSuccess);
      refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(translations[language].error);
    }
  };

  if (!notifications?.length) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">
          {translations[language].noNotifications}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {translations[language].title}
      </h2>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id}
            className={`p-4 ${
              notification.metadata?.is_read 
                ? "bg-gray-50" 
                : "bg-white border-l-4 border-l-blue-500"
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {translations[language].needsUpdated} {notification.metadata?.child_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(notification.created_at), "PPp", { locale: dateLocale })}
                  </p>
                </div>
                {!notification.metadata?.is_read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {translations[language].markAsRead}
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                {notification.metadata?.new_needs?.map((need: any, index: number) => (
                  <NeedItem
                    key={`${need.category}-${index}`}
                    need={need}
                    onToggleUrgent={() => {}}
                    language={language}
                  />
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};