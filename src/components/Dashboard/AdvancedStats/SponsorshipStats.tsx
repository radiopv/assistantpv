import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { SponsorshipConversionStats, TopCityStats } from "@/types/statistics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { toast } from "sonner";

export const SponsorshipStats = () => {
  const { data: conversionStats, isLoading: conversionLoading } = useQuery<SponsorshipConversionStats>({
    queryKey: ['sponsorship-conversion'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_sponsorship_conversion_stats');
        if (error) throw error;
        return {
          conversion_rate: data?.conversion_rate || 0,
          avg_duration_days: data?.avg_duration_days || 0,
          active_sponsorships: data?.active_sponsorships || 0,
          pending_sponsorships: data?.pending_sponsorships || 0,
          total_donations: data?.total_donations || 0,
          total_children: data?.total_children || 0,
          sponsored_children: data?.sponsored_children || 0,
          total_sponsors: data?.total_sponsors || 0,
          total_people_helped: data?.total_people_helped || 0
        } as SponsorshipConversionStats;
      } catch (error) {
        console.error('Error fetching sponsorship stats:', error);
        toast.error("Erreur lors du chargement des statistiques de parrainage");
        throw error;
      }
    },
    retry: 2
  });

  const { data: topCities, isLoading: citiesLoading } = useQuery<TopCityStats[]>({
    queryKey: ['top-sponsorship-cities'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_top_sponsorship_cities');
        if (error) throw error;
        return (data || []) as TopCityStats[];
      } catch (error) {
        console.error('Error fetching top cities:', error);
        toast.error("Erreur lors du chargement des statistiques par ville");
        throw error;
      }
    },
    retry: 2
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
            <span className="font-bold">{conversionStats?.conversion_rate || 0}%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
            <span>Durée moyenne</span>
            <span className="font-bold">{conversionStats?.avg_duration_days || 0} jours</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
            <span>Parrainages actifs</span>
            <span className="font-bold">{conversionStats?.active_sponsorships || 0}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top 5 des Villes</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCities || []}>
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