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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const COLORS = ['#0072BB', '#40C057', '#FA5252', '#7950F2', '#FD7E14'];

const Statistics = () => {
  const { t } = useLanguage();

  const { data: sponsorshipStats } = useQuery({
    queryKey: ['sponsorship-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_sponsorship_conversion_stats');
      if (error) throw error;
      return data as unknown as SponsorshipConversionStats;
    }
  });

  const { data: engagementStats } = useQuery({
    queryKey: ['engagement-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_engagement_stats');
      if (error) throw error;
      return data as unknown as UserEngagementStats;
    }
  });

  const { data: cityStats } = useQuery({
    queryKey: ['city-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_sponsorship_cities');
      if (error) throw error;
      return data as TopCityStats[];
    }
  });

  const { data: monthlyDonations } = useQuery({
    queryKey: ['monthly-donations'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_monthly_donation_trends', { months_back: 6 });
      if (error) throw error;
      return data;
    }
  });

  const { data: urgentNeeds } = useQuery({
    queryKey: ['urgent-needs'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_urgent_needs_by_city');
      if (error) throw error;
      return data;
    }
  });

  const calculateSuccessRate = () => {
    if (!sponsorshipStats?.active_sponsorships || !engagementStats) return 0;
    const totalSponsors = (engagementStats.active_sponsors || 0) + (engagementStats.inactive_sponsors || 0);
    if (totalSponsors === 0) return 0;
    const rate = Math.min((sponsorshipStats.active_sponsorships / totalSponsors) * 100, 100);
    return Math.round(rate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cuba-warmBeige to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-cuba-gradient text-white p-8 rounded-xl shadow-lg text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold font-title">
            {t("statisticsTitle")}
          </h1>
          <p className="text-white/90 mt-2">
            {t("statisticsDescription")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-cuba-turquoise/20 hover:border-cuba-turquoise/40 transition-colors">
            <CardHeader>
              <CardTitle className="font-title">{t("sponsorshipStats")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("conversionRate")}</p>
                  <p className="text-2xl font-bold text-cuba-turquoise">{sponsorshipStats?.conversion_rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("avgDuration")}</p>
                  <p className="text-2xl font-bold text-cuba-turquoise">{sponsorshipStats?.avg_duration_days} {t("days")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("activeSponsors")}</p>
                  <p className="text-2xl font-bold text-cuba-turquoise">{sponsorshipStats?.active_sponsorships}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-cuba-turquoise/20 hover:border-cuba-turquoise/40 transition-colors">
            <CardHeader>
              <CardTitle className="font-title">{t("engagement")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{t("activityRate")}</span>
                    <span className="font-medium">{engagementStats?.activity_rate}%</span>
                  </div>
                  <Progress value={engagementStats?.activity_rate} className="h-2 bg-cuba-turquoise/20" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("activeSponsors")}</p>
                  <p className="text-2xl font-bold text-cuba-turquoise">{engagementStats?.active_sponsors}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("assistants")}</p>
                  <p className="text-2xl font-bold text-cuba-turquoise">{engagementStats?.total_assistants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-cuba-turquoise/20 hover:border-cuba-turquoise/40 transition-colors">
            <CardHeader>
              <CardTitle className="font-title">{t("impact")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("sponsoredChildren")}</p>
                  <p className="text-2xl font-bold text-cuba-turquoise">{sponsorshipStats?.active_sponsorships}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("totalSponsors")}</p>
                  <p className="text-2xl font-bold text-cuba-turquoise">
                    {(engagementStats?.active_sponsors || 0) + (engagementStats?.inactive_sponsors || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("successRate")}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {calculateSuccessRate()}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-cuba-turquoise/20">
            <CardHeader>
              <CardTitle className="font-title">{t("monthlyDonationsTrend")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyDonations}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="donations" stroke="#0072BB" name={t("donations")} />
                    <Line type="monotone" dataKey="people_helped" stroke="#40C057" name={t("peopleHelped")} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-cuba-turquoise/20">
            <CardHeader>
              <CardTitle className="font-title">{t("urgentNeedsByCity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={urgentNeeds}
                      dataKey="urgent_needs_count"
                      nameKey="city"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {urgentNeeds?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-cuba-turquoise/20 mt-8">
          <CardHeader>
            <CardTitle className="font-title">{t("cityDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityStats}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active_sponsorships" fill="#0072BB" name={t("activeSponsors")} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;