import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { UserEngagementStats as UserEngagementStatsType } from "@/types/statistics";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const UserEngagementStats = () => {
  const { data: stats, isLoading } = useQuery<UserEngagementStatsType>({
    queryKey: ['user-engagement'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_user_engagement_stats');
        if (error) throw error;
        return {
          active_sponsors: data?.active_sponsors || 0,
          activity_rate: data?.activity_rate || 0,
          total_assistants: data?.total_assistants || 0,
          cities_coverage: data?.cities_coverage || 0
        } as UserEngagementStatsType;
      } catch (error) {
        console.error('Error fetching engagement stats:', error);
        toast.error("Erreur lors du chargement des statistiques d'engagement");
        throw error;
      }
    },
    retry: 2
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
            {stats?.active_sponsors || 0}
          </p>
          <p className="text-sm text-gray-600">Parrains Actifs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {stats?.activity_rate || 0}%
          </p>
          <p className="text-sm text-gray-600">Taux d'Activité</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {stats?.total_assistants || 0}
          </p>
          <p className="text-sm text-gray-600">Assistants</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {stats?.cities_coverage || 0}
          </p>
          <p className="text-sm text-gray-600">Villes Couvertes</p>
        </div>
      </div>
    </Card>
  );
};