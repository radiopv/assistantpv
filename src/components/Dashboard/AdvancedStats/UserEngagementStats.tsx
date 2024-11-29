import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { UserEngagementStats as UserEngagementStatsType } from "@/types/dashboard";

export const UserEngagementStats = () => {
  const { data: stats, isLoading } = useQuery<UserEngagementStatsType>({
    queryKey: ['user-engagement'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_engagement_stats');
      if (error) throw error;
      return data as UserEngagementStatsType;
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Engagement des Utilisateurs</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
          <span>Taux d'activité</span>
          <span className="font-bold">{stats?.activity_rate}%</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
          <span>Parrains actifs</span>
          <span className="font-bold">{stats?.active_sponsors}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
          <span>Parrains inactifs</span>
          <span className="font-bold">{stats?.inactive_sponsors}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
          <span>Assistants</span>
          <span className="font-bold">{stats?.total_assistants}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
          <span>Couverture des villes</span>
          <span className="font-bold">{stats?.cities_coverage}</span>
        </div>
      </div>
    </Card>
  );
};