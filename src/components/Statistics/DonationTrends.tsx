import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export const DonationTrends = () => {
  const { data: trends } = useQuery({
    queryKey: ['donation-trends'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_monthly_donation_trends');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="donations" 
            stroke="#8884d8" 
            name="Dons"
          />
          <Line 
            type="monotone" 
            dataKey="people_helped" 
            stroke="#82ca9d" 
            name="Personnes aidées"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};