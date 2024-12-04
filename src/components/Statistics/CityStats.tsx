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

export const CityStats = () => {
  const { data: cityStats } = useQuery({
    queryKey: ['city-donation-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_city_donation_stats');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={cityStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="city" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="donations" fill="#8884d8" name="Dons" />
          <Bar dataKey="people_helped" fill="#82ca9d" name="Personnes aidées" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};