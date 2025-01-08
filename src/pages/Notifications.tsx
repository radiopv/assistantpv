import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Notifications = () => {
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

  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      <div className="space-y-4">
        {notifications?.map((notification) => (
          <Card key={notification.id} className="p-4">
            <h3 className="font-semibold">{notification.title}</h3>
            <p className="text-gray-600 mt-2">{notification.content}</p>
            <div className="text-sm text-gray-400 mt-2">
              {format(new Date(notification.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
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