import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { UrgentNeedsByCityStats } from "@/types/statistics";
import { useTranslation } from "@/components/Translation/TranslationContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE'];

export const UrgentNeedsStats = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useQuery<UrgentNeedsByCityStats[]>({
    queryKey: ['urgent-needs-by-city'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_urgent_needs_by_city');
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t("stats.urgent_needs.title")}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats}
              dataKey="urgent_needs_count"
              nameKey="city"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stats?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};