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
  ResponsiveContainer 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface StatisticsData {
  total_donations: number;
  total_children: number;
  total_sponsors: number;
  monthly_trends?: Array<{
    month: string;
    donations: number;
  }>;
}

const Statistics = () => {
  const { t } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const { data: statsData, error: statsError } = await supabase.rpc("get_current_statistics");
      if (statsError) throw statsError;

      const { data: trendsData, error: trendsError } = await supabase.rpc("get_monthly_donation_stats");
      if (trendsError) throw trendsError;

      return {
        ...statsData[0],
        monthly_trends: trendsData
      } as StatisticsData;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 space-y-8">
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
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-title text-center mb-12 text-cuba-coral">
            {t("statisticsTitle")}
          </h1>
          
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-2 text-cuba-coral">{t("donations")}</h3>
              <p className="text-3xl font-bold">{stats?.total_donations || 0}</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-2 text-cuba-coral">{t("sponsoredChildren")}</h3>
              <p className="text-3xl font-bold">{stats?.total_children || 0}</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold mb-2 text-cuba-coral">{t("totalSponsors")}</h3>
              <p className="text-3xl font-bold">{stats?.total_sponsors || 0}</p>
            </Card>
          </div>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-cuba-softOrange/20">
            <h3 className="text-xl font-semibold mb-6 text-cuba-coral">{t("monthlyDonationsTrend")}</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.monthly_trends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="donations" fill="#FF6B6B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistics;