import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export const DetailedStats = () => {
  const { data: monthlyStats } = useQuery({
    queryKey: ['monthly-donations'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_monthly_donation_trends');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Évolution des dons</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="donations" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition géographique</h3>
          <div className="h-[300px]">
            {/* Ajoutez ici une carte ou un graphique pour la répartition géographique */}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Statistiques des parrainages</h3>
          <div className="space-y-4">
            {/* Ajoutez ici des statistiques sur les parrainages */}
          </div>
        </Card>
      </div>
    </div>
  );
};