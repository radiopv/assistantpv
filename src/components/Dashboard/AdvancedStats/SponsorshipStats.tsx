import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { SponsorshipConversionStats, TopCityStats } from "@/types/statistics";
import { useTranslation } from "@/components/Translation/TranslationContext";
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
  const { t } = useTranslation();
  
  const { data: conversionStats, isLoading: conversionLoading } = useQuery<SponsorshipConversionStats>({
    queryKey: ['sponsorship-conversion'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_sponsorship_conversion_stats');
      if (error) throw error;
      return data as unknown as SponsorshipConversionStats;
    }
  });

  const { data: topCities, isLoading: citiesLoading } = useQuery<TopCityStats[]>({
    queryKey: ['top-sponsorship-cities'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_sponsorship_cities');
      if (error) throw error;
      return data as unknown as TopCityStats[];
    }
  });

  if (conversionLoading || citiesLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t("stats.sponsorships.conversion_stats")}</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
            <span>{t("stats.sponsorships.conversion_rate")}</span>
            <span className="font-bold">{conversionStats?.conversion_rate}%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
            <span>{t("stats.sponsorships.avg_duration")}</span>
            <span className="font-bold">{conversionStats?.avg_duration_days} {t("common.days")}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-primary/5 rounded">
            <span>{t("stats.sponsorships.active")}</span>
            <span className="font-bold">{conversionStats?.active_sponsorships}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t("stats.sponsorships.top_cities")}</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCities}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="active_sponsorships" fill="#8884d8" name={t("stats.sponsorships.active")} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};