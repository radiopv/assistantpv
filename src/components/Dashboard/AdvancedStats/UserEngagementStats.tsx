import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { UserEngagementStats as UserEngagementStatsType } from "@/types/statistics";
import { Progress } from "@/components/ui/progress";

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
    return <Skeleton className="h-[200px] w-full" />;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Engagement des Parrains</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {stats?.active_sponsors}
          </p>
          <p className="text-sm text-gray-600">Parrains Actifs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {stats?.activity_rate}%
          </p>
          <p className="text-sm text-gray-600">Taux d'Activité</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {stats?.total_assistants}
          </p>
          <p className="text-sm text-gray-600">Assistants</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {stats?.cities_coverage}
          </p>
          <p className="text-sm text-gray-600">Villes Couvertes</p>
        </div>
      </div>
    </Card>
  );
};