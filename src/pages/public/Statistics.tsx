import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { SponsorshipStats } from "@/components/Dashboard/AdvancedStats/SponsorshipStats";
import { UserEngagementStats } from "@/components/Dashboard/AdvancedStats/UserEngagementStats";
import { toast } from "sonner";
import { SponsorshipConversionStats } from "@/types/statistics";

const Statistics = () => {
  const { t } = useLanguage();

  const { data: sponsorshipStats, isLoading: isLoadingSponsorship, error: sponsorshipError } = useQuery({
    queryKey: ['sponsorship-stats'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_sponsorship_conversion_stats');
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        return {
          active_sponsorships: data?.active_sponsorships || 0,
          pending_sponsorships: data?.pending_sponsorships || 0,
          total_donations: data?.total_donations || 0,
          total_children: data?.total_children || 0,
          sponsored_children: data?.sponsored_children || 0,
          total_sponsors: data?.total_sponsors || 0,
          total_people_helped: data?.total_people_helped || 0,
          conversion_rate: data?.conversion_rate || 0,
          avg_duration_days: data?.avg_duration_days || 0
        } as SponsorshipConversionStats;
      } catch (error) {
        console.error('Error fetching sponsorship stats:', error);
        toast.error("Erreur lors du chargement des statistiques de parrainage");
        throw error;
      }
    },
    retry: 2,
    staleTime: 30000
  });

  if (sponsorshipError) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 bg-destructive/10">
          <p className="text-destructive">Une erreur est survenue lors du chargement des statistiques.</p>
        </Card>
      </div>
    );
  }

  if (isLoadingSponsorship) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const safeStats = {
    active_sponsorships: sponsorshipStats?.active_sponsorships || 0,
    pending_sponsorships: sponsorshipStats?.pending_sponsorships || 0,
    total_donations: sponsorshipStats?.total_donations || 0,
    total_children: sponsorshipStats?.total_children || 0,
    sponsored_children: sponsorshipStats?.sponsored_children || 0,
    total_sponsors: sponsorshipStats?.total_sponsors || 0,
    total_people_helped: sponsorshipStats?.total_people_helped || 0
  };

  const sponsorshipRate = safeStats.total_children > 0 
    ? (safeStats.sponsored_children / safeStats.total_children * 100).toFixed(1) 
    : "0";

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite">
      <div className="container mx-auto px-0 sm:px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-title text-center mb-12 text-cuba-coral">
            État des Parrainages
          </h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-cuba-softOrange/20">
              <h3 className="text-lg font-semibold mb-4 text-cuba-coral">Parrainages</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Taux de parrainage</span>
                    <span className="font-bold text-cuba-deepOrange">{sponsorshipRate}%</span>
                  </div>
                  <Progress value={Number(sponsorshipRate)} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Enfants parrainés</p>
                    <p className="text-2xl font-bold text-cuba-deepOrange">
                      {safeStats.sponsored_children}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total enfants</p>
                    <p className="text-2xl font-bold text-cuba-deepOrange">
                      {safeStats.total_children}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-cuba-softOrange/20">
              <h3 className="text-lg font-semibold mb-4 text-cuba-coral">Demandes</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Parrainages actifs</p>
                    <p className="text-2xl font-bold text-cuba-deepOrange">
                      {safeStats.active_sponsorships}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">En attente</p>
                    <p className="text-2xl font-bold text-cuba-deepOrange">
                      {safeStats.pending_sponsorships}
                    </p>
                  </div>
                </div>
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">Total parrains</p>
                  <p className="text-2xl font-bold text-cuba-deepOrange">
                    {safeStats.total_sponsors}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-cuba-softOrange/20 md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-cuba-coral">Impact</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Dons réalisés</p>
                    <p className="text-2xl font-bold text-cuba-deepOrange">
                      {safeStats.total_donations}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Personnes aidées</p>
                    <p className="text-2xl font-bold text-cuba-deepOrange">
                      {safeStats.total_people_helped}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-8 mt-12">
            <SponsorshipStats />
            <UserEngagementStats />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;