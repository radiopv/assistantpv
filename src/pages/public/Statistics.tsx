import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { SponsorshipConversionStats, UserEngagementStats, TopCityStats } from "@/types/statistics";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Statistics = () => {
  const { data: sponsorshipStats } = useQuery<SponsorshipConversionStats>({
    queryKey: ['sponsorship-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_sponsorship_conversion_stats');
      if (error) throw error;
      return data as unknown as SponsorshipConversionStats;
    }
  });

  const { data: engagementStats } = useQuery<UserEngagementStats>({
    queryKey: ['engagement-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_engagement_stats');
      if (error) throw error;
      return data as unknown as UserEngagementStats;
    }
  });

  const { data: cityStats } = useQuery<TopCityStats[]>({
    queryKey: ['city-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_sponsorship_cities');
      if (error) throw error;
      return data as TopCityStats[];
    }
  });

  // Calculate success rate, ensuring it doesn't exceed 100%
  const calculateSuccessRate = () => {
    if (!sponsorshipStats?.active_sponsorships || !engagementStats) return 0;
    const totalSponsors = (engagementStats.active_sponsors || 0) + (engagementStats.inactive_sponsors || 0);
    if (totalSponsors === 0) return 0;
    const rate = Math.min((sponsorshipStats.active_sponsorships / totalSponsors) * 100, 100);
    return Math.round(rate);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Statistiques de Passion Varadero</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Sponsorship Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Parrainages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Taux de conversion</p>
                <p className="text-2xl font-bold">{sponsorshipStats?.conversion_rate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Durée moyenne</p>
                <p className="text-2xl font-bold">{sponsorshipStats?.avg_duration_days} jours</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parrainages actifs</p>
                <p className="text-2xl font-bold">{sponsorshipStats?.active_sponsorships}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Taux d'activité</span>
                  <span className="font-medium">{engagementStats?.activity_rate}%</span>
                </div>
                <Progress value={engagementStats?.activity_rate} className="h-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parrains actifs</p>
                <p className="text-2xl font-bold">{engagementStats?.active_sponsors}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assistants</p>
                <p className="text-2xl font-bold">{engagementStats?.total_assistants}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Villes couvertes</p>
                <p className="text-2xl font-bold">{engagementStats?.cities_coverage}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Enfants parrainés</p>
                <p className="text-2xl font-bold">{sponsorshipStats?.active_sponsorships}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parrains totaux</p>
                <p className="text-2xl font-bold">
                  {(engagementStats?.active_sponsors || 0) + (engagementStats?.inactive_sponsors || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux de réussite</p>
                <p className="text-2xl font-bold text-green-600">
                  {calculateSuccessRate()}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City Distribution Chart */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Distribution par ville</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="active_sponsorships" fill="#8884d8" name="Parrainages actifs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;