import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

export const StatisticsSection = () => {
  const { data: sponsorshipStats, isLoading: isLoadingSponsorship } = useQuery({
    queryKey: ["sponsorship-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_sponsorship_conversion_stats');
      if (error) throw error;
      return data;
    }
  });

  const { data: cityStats, isLoading: isLoadingCities } = useQuery({
    queryKey: ["city-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_sponsorship_cities');
      if (error) throw error;
      return data;
    }
  });

  const { data: engagementStats, isLoading: isLoadingEngagement } = useQuery({
    queryKey: ["engagement-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_engagement_stats');
      if (error) throw error;
      return data;
    }
  });

  if (isLoadingSponsorship || isLoadingCities || isLoadingEngagement) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Statistiques des Parrainages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {sponsorshipStats?.conversion_rate}%
            </p>
            <p className="text-sm text-gray-600">Taux de Conversion</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {sponsorshipStats?.avg_duration_days} jours
            </p>
            <p className="text-sm text-gray-600">Durée Moyenne</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {sponsorshipStats?.active_sponsorships}
            </p>
            <p className="text-sm text-gray-600">Parrainages Actifs</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Distribution par Ville</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="active_sponsorships" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Engagement des Parrains</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {engagementStats?.active_sponsors}
            </p>
            <p className="text-sm text-gray-600">Parrains Actifs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {engagementStats?.activity_rate}%
            </p>
            <p className="text-sm text-gray-600">Taux d'Activité</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {engagementStats?.total_assistants}
            </p>
            <p className="text-sm text-gray-600">Assistants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {engagementStats?.cities_coverage}
            </p>
            <p className="text-sm text-gray-600">Villes Couvertes</p>
          </div>
        </div>
      </Card>
    </div>
  );
};