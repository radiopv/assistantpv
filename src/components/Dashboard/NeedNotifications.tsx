import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { DetailedNotification } from "@/components/Sponsors/Dashboard/DetailedNotification";

interface NeedNotification {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
  metadata: any;
  link?: string;
}

export const NeedNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NeedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (user) {
      console.log("User authenticated, fetching notifications...");
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [user]);

  const subscribeToNotifications = () => {
    console.log("Setting up notifications subscription for user:", user?.id);
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
      console.log("Cleaning up notifications subscription");
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
      setNotifications(data as NeedNotification[]);
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
      console.log("Marking notification as read:", notificationId);
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

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center">
          <span className="text-gray-500">{t("loading")}</span>
        </div>
      </Card>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center text-gray-500">
          <span>{t("noNotifications")}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="divide-y divide-gray-100">
      {notifications.map((notification) => (
        <div key={notification.id} className="relative">
          <DetailedNotification notification={notification} />
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkAsRead(notification.id)}
              className="absolute top-2 right-2 h-7 px-2 text-xs"
            >
              {t("markAsRead")}
            </Button>
          )}
        </div>
      ))}
    </Card>
  );
};