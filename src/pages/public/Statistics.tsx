import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { StatisticsData } from "@/types/dashboard";

const Statistics = () => {
  const { t } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      // Get sponsorship stats
      const { data: sponsorships, error: sponsorshipsError } = await supabase
        .from("sponsorships")
        .select("status");

      if (sponsorshipsError) throw sponsorshipsError;

      // Get children stats
      const { data: children, error: childrenError } = await supabase
        .from("children")
        .select("id, is_sponsored");

      if (childrenError) throw childrenError;

      // Get donations stats
      const { data: donations, error: donationsError } = await supabase
        .from("donations")
        .select("id, donation_date");

      if (donationsError) throw donationsError;

      // Calculate stats
      const active = sponsorships.filter((s) => s.status === "active").length;
      const pending = sponsorships.filter((s) => s.status === "pending").length;
      const totalChildren = children.length;
      const totalSponsors = new Set(sponsorships.map(s => s.sponsor_id)).size;

      return {
        active_sponsorships: active,
        pending_sponsorships: pending,
        total_donations: donations.length,
        total_children: totalChildren,
        total_sponsors: totalSponsors,
        monthly_trends: donations.map(d => ({
          donation_date: d.donation_date
        })),
        city_distribution: [] // This can be implemented if needed
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
    total_sponsors: stats?.total_sponsors || 0,
    monthly_trends: stats?.monthly_trends || [],
    city_distribution: stats?.city_distribution || []
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite">
      <div className="container mx-auto px-0 sm:px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-title text-center mb-12 text-cuba-coral">
            État des Parrainages
          </h1>

          <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 sm:border sm:border-cuba-softOrange/20 rounded-none sm:rounded-lg">
            <h3 className="text-xl font-semibold mb-6 text-cuba-coral">État des Parrainages</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-center p-4 bg-gradient-to-r from-cuba-warmBeige to-cuba-softOrange/20 rounded-none sm:rounded-lg">
                <p className="text-lg font-semibold text-cuba-coral">Parrainages Actifs</p>
                <p className="text-3xl font-bold text-cuba-deepOrange">
                  {safeStats.active_sponsorships.toLocaleString('fr-FR')}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-cuba-warmBeige to-cuba-softOrange/20 rounded-none sm:rounded-lg">
                <p className="text-lg font-semibold text-cuba-coral">Demandes en Attente</p>
                <p className="text-3xl font-bold text-cuba-deepOrange">
                  {safeStats.pending_sponsorships.toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistics;