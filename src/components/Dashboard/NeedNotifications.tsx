import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Bell, Image } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { fr, es } from "date-fns/locale";

interface NotificationMetadata {
  child_id?: string;
  child_name?: string;
  photo_url?: string;
  need_type?: string;
  is_read?: boolean;
}

interface NeedNotification {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
  metadata: NotificationMetadata;
  link?: string;
}

export const NeedNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NeedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  const dateLocale = language === 'fr' ? fr : es;

  useEffect(() => {
    if (user) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [user]);

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user?.id}`
        },
        (payload) => {
          console.log("Notification change detected:", payload);
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchNotifications = async () => {
    try {
      console.log("Fetching notifications for user:", user?.id);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Fetched notifications:", data);
      setNotifications(data.map(notification => ({
        ...notification,
        metadata: notification.metadata as NotificationMetadata
      })));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: t("error"),
        description: t("errorFetchingNotifications"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        throw error;
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      toast({
        title: t("success"),
        description: t("notificationMarkedAsRead"),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: t("error"),
        description: t("errorMarkingNotificationAsRead"),
        variant: "destructive",
      });
    }
  };

  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case 'photo_upload':
        return <Image className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <span className="text-gray-500">{t("loading")}</span>
        </div>
      </Card>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center text-gray-500">
          <Bell className="w-5 h-5 mr-2" />
          <span>{t("noNotifications")}</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`p-4 ${
            notification.is_read ? "bg-gray-50" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                {notification.type === 'photo_upload' ? (
                  <Image className="w-5 h-5 text-blue-500" />
                ) : (
                  <Bell className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.content}
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm", {
                    locale: dateLocale,
                  })}
                </div>
              </div>
            </div>
            {!notification.is_read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                {t("markAsRead")}
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};