import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { SponsorshipStats as SponsorshipStatsType } from "@/types/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export const SponsorshipStats = () => {
  const { data: conversionStats, isLoading: conversionLoading } = useQuery<SponsorshipStatsType>({
    queryKey: ['sponsorship-conversion'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_sponsorship_conversion_stats');
      if (error) throw error;
      return data as SponsorshipStatsType;
    }
  });

  const { data: topCities, isLoading: citiesLoading } = useQuery({
    queryKey: ['top-sponsorship-cities'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_sponsorship_cities');
      if (error) throw error;
      return data;
    }
  });

  if (conversionLoading || citiesLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Statistiques de Conversion</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
            <span>Taux de conversion</span>
            <span className="font-bold">{conversionStats?.conversion_rate}%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
            <span>Durée moyenne</span>
            <span className="font-bold">{conversionStats?.avg_duration_days} jours</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
            <span>Parrainages actifs</span>
            <span className="font-bold">{conversionStats?.active_sponsorships}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top 5 des Villes</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="active_sponsorships" fill="#8884d8" name="Parrainages actifs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};