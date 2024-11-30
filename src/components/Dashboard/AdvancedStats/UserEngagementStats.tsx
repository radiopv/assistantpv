import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { UserEngagementStats as UserEngagementStatsType } from "@/types/statistics";

export const UserEngagementStats = () => {
  const { data: stats, isLoading } = useQuery<UserEngagementStatsType>({
    queryKey: ['user-engagement'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_engagement_stats');
      if (error) throw error;
      return data as unknown as UserEngagementStatsType;
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Engagement des Utilisateurs</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span>Taux d'activité des parrains</span>
            <span className="font-bold">{stats?.activity_rate}%</span>
          </div>
          <Progress value={stats?.activity_rate} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary/5 rounded">
            <div className="text-sm text-gray-500">Parrains actifs</div>
            <div className="text-2xl font-bold">{stats?.active_sponsors}</div>
          </div>
          <div className="p-4 bg-primary/5 rounded">
            <div className="text-sm text-gray-500">Parrains inactifs</div>
            <div className="text-2xl font-bold">{stats?.inactive_sponsors}</div>
          </div>
          <div className="p-4 bg-primary/5 rounded">
            <div className="text-sm text-gray-500">Assistants</div>
            <div className="text-2xl font-bold">{stats?.total_assistants}</div>
          </div>
          <div className="p-4 bg-primary/5 rounded">
            <div className="text-sm text-gray-500">Villes couvertes</div>
            <div className="text-2xl font-bold">{stats?.cities_coverage}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};