import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface StatisticsData {
  total_donations: number;
  total_children: number;
  total_sponsors: number;
  active_sponsorships: number;
  pending_sponsorships: number;
  monthly_trends?: Array<{
    month: string;
    donations: number;
  }>;
  city_distribution?: Array<{
    city: string;
    count: number;
  }>;
}

const COLORS = [
  '#FF6B6B',  // cuba-coral
  '#FEC6A1',  // cuba-softOrange
  '#FFD700',  // cuba-gold
  '#50C878',  // cuba-emerald
  '#0072BB'   // cuba-turquoise
];

const Statistics = () => {
  const { t } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      // Fetch general statistics
      const { data: statsData, error: statsError } = await supabase
        .from('sponsorships')
        .select('status');

      if (statsError) throw statsError;

      // Count active and pending sponsorships
      const activeSponsors = statsData.filter(s => s.status === 'active').length;
      const pendingSponsors = statsData.filter(s => s.status === 'pending').length;

      // Fetch monthly donation trends
      const { data: trendsData, error: trendsError } = await supabase
        .from('donations')
        .select('donation_date')
        .gte('donation_date', new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString());

      if (trendsError) throw trendsError;

      // Get city distribution
      const { data: cityData, error: cityError } = await supabase
        .from('children')
        .select('city')
        .not('city', 'is', null);
      
      if (cityError) throw cityError;

      // Process city distribution
      const cityDistribution = cityData.reduce((acc: Record<string, number>, curr) => {
        acc[curr.city] = (acc[curr.city] || 0) + 1;
        return acc;
      }, {});

      const cityStats = Object.entries(cityDistribution).map(([city, count]) => ({
        city,
        count
      }));

      return {
        active_sponsorships: activeSponsors,
        pending_sponsorships: pendingSponsors,
        monthly_trends: trendsData,
        city_distribution: cityStats
      } as StatisticsData;
    }
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