import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  content: string;
  link?: string;
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export const NotificationService = {
  async getNotifications() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error("Erreur lors de la mise à jour de la notification");
    }
  },

  async markAllAsRead() {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;
      toast.success("Toutes les notifications ont été marquées comme lues");
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error("Erreur lors de la mise à jour des notifications");
    }
  },

  async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error("Erreur lors de la suppression de la notification");
    }
  }
};