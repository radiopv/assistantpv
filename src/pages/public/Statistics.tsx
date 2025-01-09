import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const Statistics = () => {
  const { data: sponsorshipStats } = useQuery({
    queryKey: ['sponsorship-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_sponsorship_conversion_stats');
      if (error) throw error;
      return data;
    }
  });

  const { data: engagementStats } = useQuery({
    queryKey: ['engagement-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_user_engagement_stats');
      if (error) throw error;
      return data;
    }
  });

  const { data: cityStats } = useQuery({
    queryKey: ['city-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_top_sponsorship_cities');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Statistiques</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-sm text-muted-foreground">Parrains actifs</p>
                <p className="text-2xl font-bold">{engagementStats?.active_sponsors}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux d'activité</p>
                <p className="text-2xl font-bold">{engagementStats?.activity_rate}%</p>
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

        {/* City Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution par ville</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cityStats?.map((city: { city: string; active_sponsorships: number }) => (
                <div key={city.city}>
                  <p className="text-sm text-muted-foreground">{city.city}</p>
                  <p className="text-2xl font-bold">{city.active_sponsorships}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;