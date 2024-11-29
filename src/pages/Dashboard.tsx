import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { toast } from "sonner";
import { convertJsonToNeeds } from "@/types/needs";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { DetailedStats } from "@/components/Dashboard/DetailedStats";
import { DashboardStats } from "@/types/dashboard";

interface RawDashboardStats {
  children: {
    total: number;
    sponsored: number;
    available: number;
  };
  sponsors: number;
  donations: {
    total: number;
    people_helped: number;
  };
  cities: number;
}

const Dashboard = () => {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: rawData, error } = await supabase.rpc('get_dashboard_statistics');
      if (error) throw error;
      
      const { data: childrenData } = await supabase
        .from('children')
        .select('needs');
      
      const urgentNeedsCount = childrenData?.reduce((count, child) => {
        const needs = convertJsonToNeeds(child.needs);
        return count + needs.filter(need => need.is_urgent).length;
      }, 0) || 0;

      const rawStats = rawData as unknown as RawDashboardStats;

      const typedStats: DashboardStats = {
        children: {
          total: rawStats.children?.total || 0,
          sponsored: rawStats.children?.sponsored || 0,
          available: rawStats.children?.available || 0,
          urgent_needs: urgentNeedsCount
        },
        sponsors: rawStats.sponsors || 0,
        donations: {
          total: rawStats.donations?.total || 0,
          people_helped: rawStats.donations?.people_helped || 0
        },
        cities: rawStats.cities || 0
      };

      return typedStats;
    },
    meta: {
      errorMessage: "Erreur lors du chargement des statistiques",
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast.error("Erreur lors du chargement des statistiques");
      }
    }
  });

  // Souscription aux changements en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'children'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          toast.success("Les données ont été mises à jour");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (statsError) {
    return (
      <div className="space-y-6">
        <ErrorAlert 
          message="Une erreur est survenue lors du chargement des statistiques" 
          retry={() => refetchStats()}
        />
      </div>
    );
  }

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardHeader stats={stats} />
      <DetailedStats />
    </div>
  );
};

export default Dashboard;