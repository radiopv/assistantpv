import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Activity, User } from "lucide-react";
import { type ActivityLogType } from "@/types/activity";

const ActivityLog = () => {
  const { toast } = useToast();

  const { data: activities, isLoading, refetch } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      console.log('Fetching activity logs...');
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          user_id,
          action,
          details,
          created_at,
          profiles:user_id (
            id,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
      }
      
      console.log('Fetched data:', data);
      
      // Transform the data to match ActivityLogType
      const transformedData = data.map(item => ({
        ...item,
        user: {
          name: `User ${item.user_id.slice(0, 8)}`, // Using truncated user_id as name for now
          role: item.profiles?.role || 'unknown'
        }
      }));

      return transformedData as ActivityLogType[];
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('activity-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs'
        },
        () => {
          refetch();
          toast({
            title: "Nouvelle activité",
            description: "Le journal d'activité a été mis à jour",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const getActionIcon = (role: string) => {
    switch (role) {
      case 'assistant':
        return <Activity className="h-5 w-5 text-blue-500" />;
      case 'sponsor':
        return <User className="h-5 w-5 text-green-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Journal d'activité</h1>
        <p className="text-gray-600 mt-2">
          Suivi en temps réel des actions des assistants et sponsors
        </p>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {activities?.map((activity) => (
            <Card key={activity.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getActionIcon(activity.user?.role)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.user?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.action}
                      </p>
                    </div>
                    <time className="text-sm text-gray-500">
                      {format(new Date(activity.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </time>
                  </div>
                  {activity.details && (
                    <div className="mt-2 text-sm text-gray-700">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(activity.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const getActionIcon = (role: string) => {
  switch (role) {
    case 'assistant':
      return <Activity className="h-5 w-5 text-blue-500" />;
    case 'sponsor':
      return <User className="h-5 w-5 text-green-500" />;
    default:
      return <Activity className="h-5 w-5 text-gray-500" />;
  }
};

export default ActivityLog;