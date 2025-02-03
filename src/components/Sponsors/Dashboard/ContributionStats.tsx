import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContributionStatsProps {
  sponsorId: string;
}

export const ContributionStats = ({ sponsorId }: ContributionStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['contribution-stats', sponsorId],
    queryFn: async () => {
      const { data: donations, error } = await supabase
        .from('donations')
        .select('amount')
        .eq('sponsor_id', sponsorId);

      if (error) throw error;

      const totalAmount = donations?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0;
      const donationCount = donations?.length || 0;

      return {
        totalAmount,
        donationCount
      };
    }
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Statistiques de contributions</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Total des dons</p>
          <p className="text-2xl font-bold">{stats?.totalAmount || 0}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Nombre de dons</p>
          <p className="text-2xl font-bold">{stats?.donationCount || 0}</p>
        </div>
      </div>
    </Card>
  );
};