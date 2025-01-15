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
      const { data: statsData, error: statsError } = await supabase.rpc("get_current_statistics");
      if (statsError) throw statsError;

      const { data: trendsData, error: trendsError } = await supabase.rpc("get_monthly_donation_stats");
      if (trendsError) throw trendsError;

      const { data: cityData, error: cityError } = await supabase
        .from('children')
        .select('city')
        .not('city', 'is', null);
      
      if (cityError) throw cityError;

      const cityDistribution = cityData.reduce((acc: Record<string, number>, curr) => {
        acc[curr.city] = (acc[curr.city] || 0) + 1;
        return acc;
      }, {});

      const cityStats = Object.entries(cityDistribution).map(([city, count]) => ({
        city,
        count
      }));

      return {
        ...statsData[0],
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige/20 to-cuba-offwhite">
      <div className="container mx-auto px-0 sm:px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-title text-center mb-12 text-cuba-coral">
            Nos Statistiques
          </h1>
          
          <div className="grid gap-4 md:gap-6 md:grid-cols-3 mb-12">
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 sm:border sm:border-cuba-softOrange/20 rounded-none sm:rounded-lg hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-2 text-cuba-coral">Dons</h3>
              <p className="text-3xl font-bold text-cuba-deepOrange">{stats?.total_donations || 0}</p>
            </Card>

            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 sm:border sm:border-cuba-softOrange/20 rounded-none sm:rounded-lg hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-2 text-cuba-coral">Enfants Parrainés</h3>
              <p className="text-3xl font-bold text-cuba-deepOrange">{stats?.total_children || 0}</p>
            </Card>

            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 sm:border sm:border-cuba-softOrange/20 rounded-none sm:rounded-lg hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-2 text-cuba-coral">Parrains Actifs</h3>
              <p className="text-3xl font-bold text-cuba-deepOrange">{stats?.total_sponsors || 0}</p>
            </Card>
          </div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-2 mb-12">
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 sm:border sm:border-cuba-softOrange/20 rounded-none sm:rounded-lg">
              <h3 className="text-xl font-semibold mb-6 text-cuba-coral">Tendance des Dons Mensuels</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.monthly_trends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FEC6A1" />
                    <XAxis dataKey="month" stroke="#FF6B6B" />
                    <YAxis stroke="#FF6B6B" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFF9F5',
                        border: '1px solid #FEC6A1' 
                      }}
                    />
                    <Bar 
                      dataKey="donations" 
                      fill="#FF6B6B"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 sm:border sm:border-cuba-softOrange/20 rounded-none sm:rounded-lg">
              <h3 className="text-xl font-semibold mb-6 text-cuba-coral">Distribution par Ville</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.city_distribution || []}
                      dataKey="count"
                      nameKey="city"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#FF6B6B"
                      label
                    >
                      {stats?.city_distribution?.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFF9F5',
                        border: '1px solid #FEC6A1' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 sm:border sm:border-cuba-softOrange/20 rounded-none sm:rounded-lg">
            <h3 className="text-xl font-semibold mb-6 text-cuba-coral">État des Parrainages</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-center p-4 bg-gradient-to-r from-cuba-warmBeige to-cuba-softOrange/20 rounded-none sm:rounded-lg">
                <p className="text-lg font-semibold text-cuba-coral">Parrainages Actifs</p>
                <p className="text-3xl font-bold text-cuba-deepOrange">{stats?.active_sponsorships || 0}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-cuba-warmBeige to-cuba-softOrange/20 rounded-none sm:rounded-lg">
                <p className="text-lg font-semibold text-cuba-coral">Demandes en Attente</p>
                <p className="text-3xl font-bold text-cuba-deepOrange">{stats?.pending_sponsorships || 0}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistics;