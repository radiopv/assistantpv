import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Notifications = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error("Erreur lors du marquage de la notification comme lue");
    }
  });

  const handleNotificationClick = async (notification: any) => {
    await markAsReadMutation.mutateAsync(notification.id);

    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      <div className="space-y-4">
        {notifications?.map((notification) => (
          <Card 
            key={notification.id} 
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${!notification.is_read ? 'border-l-4 border-l-blue-500' : ''}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-gray-600 mt-2">{notification.content}</p>
                <div className="text-sm text-gray-400 mt-2">
                  {format(new Date(notification.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </div>
              </div>
              {notification.link && (
                <Button variant="ghost" size="sm">
                  Voir détails
                </Button>
              )}
            </div>
          </Card>
        ))}
        
        {notifications?.length === 0 && (
          <p className="text-center text-gray-500">Aucune notification</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;