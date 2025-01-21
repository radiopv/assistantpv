import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { StatisticsData } from "@/types/dashboard";
import { Progress } from "@/components/ui/progress";
import { SponsorshipStats } from "@/components/Dashboard/AdvancedStats/SponsorshipStats";
import { UserEngagementStats } from "@/components/Dashboard/AdvancedStats/UserEngagementStats";

const Statistics = () => {
  const { t } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      // Get sponsorship stats
      const { data: sponsorships, error: sponsorshipsError } = await supabase
        .from("sponsorships")
        .select("status, sponsor_id");

      if (sponsorshipsError) throw sponsorshipsError;

      // Get children stats
      const { data: children, error: childrenError } = await supabase
        .from("children")
        .select("id, is_sponsored");

      if (childrenError) throw childrenError;

      // Get donations stats
      const { data: donations, error: donationsError } = await supabase
        .from("donations")
        .select("id, donation_date, people_helped");

      if (donationsError) throw donationsError;

      // Calculate stats
      const active = sponsorships.filter((s) => s.status === "active").length;
      const pending = sponsorships.filter((s) => s.status === "pending").length;
      const totalChildren = children.length;
      const sponsoredChildren = children.filter(c => c.is_sponsored).length;
      const totalSponsors = new Set(sponsorships.map(s => s.sponsor_id)).size;
      const totalPeopleHelped = donations.reduce((sum, d) => sum + (d.people_helped || 0), 0);

      return {
        active_sponsorships: active,
        pending_sponsorships: pending,
        total_donations: donations.length,
        total_children: totalChildren,
        sponsored_children: sponsoredChildren,
        total_sponsors: totalSponsors,
        total_people_helped: totalPeopleHelped,
        monthly_trends: donations.map(d => ({
          donation_date: d.donation_date
        })),
        city_distribution: []
      } as StatisticsData;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-0 sm:px-8 space-y-8">
        <Skeleton className="h-8 w-64 mx-auto" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  // Provide default values if stats is undefined
  const safeStats = {
    active_sponsorships: stats?.active_sponsorships || 0,
    pending_sponsorships: stats?.pending_sponsorships || 0,
    total_donations: stats?.total_donations || 0,
    total_children: stats?.total_children || 0,
    sponsored_children: stats?.sponsored_children || 0,
    total_sponsors: stats?.total_sponsors || 0,
    total_people_helped: stats?.total_people_helped || 0,
    monthly_trends: stats?.monthly_trends || [],
    city_distribution: stats?.city_distribution || []
  };

  const sponsorshipRate = safeStats.total_children > 0 
    ? (safeStats.sponsored_children / safeStats.total_children * 100).toFixed(1) 
    : 0;

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