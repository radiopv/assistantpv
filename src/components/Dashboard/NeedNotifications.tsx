import { useEffect, useState } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Bell } from "lucide-react";

interface NeedNotification {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
  metadata?: {
    child_id?: string;
    child_name?: string;
    need_type?: string;
    is_read?: boolean;
  };
}

export const NeedNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NeedNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_id", user?.id)
        .eq("type", "need_update")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
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
        .update({ 
          is_read: true 
        })
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
        title: "Succès",
        description: "Notification marquée comme lue",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Chargement des notifications...</div>;
  }

  if (notifications.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center text-gray-500">
          <Bell className="w-5 h-5 mr-2" />
          <span>Aucune notification</span>
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
            <div>
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {notification.content}
              </p>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(notification.created_at).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            {!notification.is_read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(notification.id)}
              >
                Marquer comme lu
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};