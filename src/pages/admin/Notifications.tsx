import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/Auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Bell } from "lucide-react";

const Notifications = () => {
  const { user, isAssistant } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Redirect if not admin
  useEffect(() => {
    if (!user?.role || user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data;
    }
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Bell className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Contenu</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications?.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell className="font-medium">{notification.type}</TableCell>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.content}</TableCell>
                <TableCell>
                  {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Notifications;