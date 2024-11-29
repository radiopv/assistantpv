import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ErrorAlert";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader";
import { DetailedStats } from "@/components/Dashboard/DetailedStats";
import { SponsorshipStats } from "@/components/Dashboard/AdvancedStats/SponsorshipStats";
import { AssistantStats } from "@/components/Dashboard/AdvancedStats/AssistantStats";
import { UrgentNeedsStats } from "@/components/Dashboard/AdvancedStats/UrgentNeedsStats";
import { UserEngagementStats } from "@/components/Dashboard/AdvancedStats/UserEngagementStats";
import { useAuth } from "@/components/Auth/AuthProvider";
import { DashboardStats } from "@/types/dashboard";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: rawData, error } = await supabase.rpc('get_dashboard_statistics');
      if (error) throw error;
      return rawData as DashboardStats;
    },
    meta: {
      errorMessage: "Erreur lors du chargement des statistiques"
    }
  });

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
      
      {/* Nouvelles statistiques avancées */}
      <div className="space-y-8">
        {isAdmin && (
          <>
            <SponsorshipStats />
            <div className="grid gap-4 md:grid-cols-2">
              <UrgentNeedsStats />
              <UserEngagementStats />
            </div>
            <AssistantStats />
          </>
        )}
        
        {user?.role === 'assistant' && (
          <>
            <UrgentNeedsStats />
            <AssistantStats />
          </>
        )}
        
        {user?.role === 'sponsor' && (
          <div className="grid gap-4 md:grid-cols-2">
            <UrgentNeedsStats />
            <UserEngagementStats />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
